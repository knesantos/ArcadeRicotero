/**
 * El modo de pantalla completa, jugado en Node con un DOM de utilería (`ADR-10.2`, `ADR-10.3`,
 * `T-301`).
 *
 * ## Por qué es una prueba de conducta y no un auditor de texto
 *
 * La primera entrega vigilaba esto leyendo el fuente (`motor.test.ts`), y la revisión lo rompió
 * de ocho maneras que pasaban en verde: el manejador del botón como flecha `async` con un `await`
 * adelante, el contenedor sacado de `document.querySelector('canvas')` en otra línea, el pedido
 * sobre `.recorte`, el `lock` sin `.catch`, la puerta de `fullscreenchange` vaciada, un `Escape`
 * que no sale, y el `ResizeObserver` creado sin `observe`. Un auditor de texto mira **cómo** se
 * escribió; esta mira **qué pasa**, y a las ocho las ve igual se escriban como se escriban.
 *
 * La pieza que lo hace posible es que `modo-pantalla.ts` no lee ningún global: el documento, la
 * ventana, la orientación, el observador, el contenedor y el botón le llegan de afuera.
 *
 * ## Qué se juega
 *
 * 1. **El pedido sale en el mismo toque**: cuando el manejador del clic devuelve, el pedido ya
 *    salió. Una espera en el medio —un `await`, una flecha `async`, un `setTimeout`— lo corre a
 *    más tarde, cuando el navegador ya no tiene el gesto de la persona y lo niega.
 * 2. **Sobre `.fichin` y nada más**: cada elemento de utilería anota si le pidieron la pantalla
 *    completa. El canvas, el recorte o lo que sea que devuelva un `querySelector` tienen que
 *    quedar sin pedido.
 * 3. **Cada rechazo se traga**: el del sistema y el de la orientación. Un rechazo sin atajar
 *    llega como `unhandledRejection` y la prueba lo cuenta.
 * 4. **Las tres puertas sacan de verdad**, y la página vuelve adonde estaba.
 * 5. **El observador mira el contenedor** y su aviso escribe el encuadre de `pantalla.ts`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarPantallaCompleta, type EntornoDelModo, type ModoDePantalla } from './modo-pantalla.ts';
import { PANTALLA_COMPLETA } from './copy.ts';
import { cajaDelArea, encuadre } from './pantalla.ts';

/* --------------------------------------------------------------------------
   La utilería
   -------------------------------------------------------------------------- */

type Oyente = (e: unknown) => void;

/** Lo que hace la API al pedir: da la pantalla, la niega, tira sin promesa, o no existe. */
type Sistema = 'da' | 'niega' | 'explota' | 'sin-api';

interface Escenario {
  readonly sistema?: Sistema;
  /** Qué contesta `screen.orientation.lock`: fija, rechaza, o no hay orientación. */
  readonly orientacion?: 'fija' | 'rechaza' | 'sin-orientacion';
  readonly scrollY?: number;
  readonly ancho?: number;
  readonly alto?: number;
  readonly dpr?: number;
}

interface Utileria {
  readonly modo: ModoDePantalla;
  readonly raiz: { dataset: Record<string, string | undefined> };
  /** Quién recibió un pedido de pantalla completa, por nombre, en orden. */
  readonly pedidos: string[];
  readonly salidasDelSistema: string[];
  readonly bloqueos: string[];
  readonly desbloqueos: string[];
  readonly desplazamientos: Array<[number, number]>;
  readonly sueltas: { cuenta: number };
  readonly propiedades: Map<string, string>;
  readonly observados: string[];
  readonly boton: { textContent: string | null; atributos: Map<string, string> };
  /** El elemento que el documento dice tener en pantalla completa. */
  sistemaEn(nombre: 'fichin' | null): void;
  tocarElBoton(): void;
  disparar(tipo: string, evento?: unknown): void;
  avisarAlObservador(): void;
}

/** Un elemento cualquiera: anota si le piden la pantalla completa. */
function elemento(nombre: string, pedidos: string[], alto = 0) {
  return {
    nombre,
    requestFullscreen(): Promise<void> {
      pedidos.push(nombre);
      return Promise.resolve();
    },
    getBoundingClientRect: () => ({ height: alto }),
  };
}

function armar(esc: Escenario = {}): Utileria {
  const sistema = esc.sistema ?? 'da';
  const pedidos: string[] = [];
  const salidasDelSistema: string[] = [];
  const bloqueos: string[] = [];
  const desbloqueos: string[] = [];
  const desplazamientos: Array<[number, number]> = [];
  const sueltas = { cuenta: 0 };
  const propiedades = new Map<string, string>();
  const observados: string[] = [];
  const oyentes = new Map<string, Oyente[]>();
  const alClic: Oyente[] = [];
  const observadores: Array<() => void> = [];
  const raiz = { dataset: {} as Record<string, string | undefined> };

  const pie = elemento('.chapa-pie', pedidos, 24);
  const mando = elemento('.mando', pedidos, 324);
  const fichin: Record<string, unknown> = {
    nombre: 'fichin',
    clientWidth: esc.ancho ?? 844,
    clientHeight: esc.alto ?? 390,
    style: { setProperty: (n: string, v: string) => propiedades.set(n, v) },
    querySelector: (sel: string) => (sel === '.chapa-pie' ? pie : sel === '.mando' ? mando : elemento(sel, pedidos)),
    getBoundingClientRect: () => ({ height: esc.alto ?? 390 }),
  };
  if (sistema !== 'sin-api') {
    fichin.requestFullscreen = (): Promise<void> => {
      pedidos.push('fichin');
      if (sistema === 'explota') throw new TypeError('sin gesto: el prefijo viejo tira en vez de rechazar');
      if (sistema === 'niega') return Promise.reject(new TypeError('Permissions check failed'));
      documento.fullscreenElement = fichin;
      for (const f of oyentes.get('fullscreenchange') ?? []) f({});
      return Promise.resolve();
    };
  }

  const documento: Record<string, unknown> = {
    documentElement: raiz,
    fullscreenElement: null,
    addEventListener: (tipo: string, f: Oyente) => oyentes.set(tipo, [...(oyentes.get(tipo) ?? []), f]),
    // Lo que una isla mal escrita podría ir a buscar por su cuenta: también anota los pedidos.
    querySelector: (sel: string) => elemento(sel, pedidos),
    getElementById: (id: string) => elemento(`#${id}`, pedidos),
  };
  if (sistema !== 'sin-api') {
    documento.exitFullscreen = (): Promise<void> => {
      salidasDelSistema.push('exitFullscreen');
      documento.fullscreenElement = null;
      return Promise.resolve();
    };
  }

  const ventana = {
    scrollX: 0,
    scrollY: esc.scrollY ?? 0,
    scrollTo: (x: number, y: number) => {
      desplazamientos.push([x, y]);
    },
    devicePixelRatio: esc.dpr ?? 3,
    getComputedStyle: () => ({
      getPropertyValue: (n: string) => ({ '--bisel': '4px', '--tecla-aire': '8px' })[n] ?? '',
    }),
  };

  const orientacion =
    esc.orientacion === 'sin-orientacion'
      ? undefined
      : {
          lock: (o: string): Promise<void> => {
            bloqueos.push(o);
            return esc.orientacion === 'rechaza' ? Promise.reject(new Error('NotSupportedError')) : Promise.resolve();
          },
          unlock: () => {
            desbloqueos.push('unlock');
          },
        };

  class Observador {
    constructor(aviso: () => void) {
      observadores.push(aviso);
    }
    observe(el: { nombre?: string }): void {
      observados.push(el.nombre ?? '?');
    }
    unobserve(): void {}
    disconnect(): void {}
  }

  const boton = {
    textContent: null as string | null,
    atributos: new Map<string, string>(),
    setAttribute(n: string, v: string) {
      this.atributos.set(n, v);
    },
    addEventListener: (tipo: string, f: Oyente) => {
      if (tipo === 'click') alClic.push(f);
    },
  };

  const entorno = {
    documento,
    ventana,
    orientacion,
    Observador,
    fichin,
    boton,
    soltarTodas: () => {
      sueltas.cuenta++;
    },
  } as unknown as EntornoDelModo;

  const modo = montarPantallaCompleta(entorno);
  return {
    modo,
    raiz,
    pedidos,
    salidasDelSistema,
    bloqueos,
    desbloqueos,
    desplazamientos,
    sueltas,
    propiedades,
    observados,
    boton,
    sistemaEn(nombre) {
      documento.fullscreenElement = nombre === 'fichin' ? fichin : null;
    },
    tocarElBoton() {
      assert.ok(alClic.length > 0, 'el botón no tiene quién escuche su clic');
      for (const f of alClic) f({});
    },
    disparar(tipo, evento = {}) {
      for (const f of oyentes.get(tipo) ?? []) f(evento);
    },
    avisarAlObservador() {
      for (const f of observadores) f();
    },
  };
}

/** Deja correr las promesas y los temporizadores pendientes, y devuelve los rechazos sin atajar. */
async function rechazosSinAtajar(hacer: () => void): Promise<unknown[]> {
  const sueltos: unknown[] = [];
  const anotar = (razon: unknown) => sueltos.push(razon);
  process.on('unhandledRejection', anotar);
  try {
    hacer();
    for (let i = 0; i < 4; i++) await new Promise((r) => setTimeout(r, 0));
  } finally {
    process.off('unhandledRejection', anotar);
  }
  return sueltos;
}

const enElModo = (u: Utileria) => u.raiz.dataset.pantalla === 'completa';

/* --------------------------------------------------------------------------
   1 y 2. El pedido: en el mismo toque, sobre `.fichin`
   -------------------------------------------------------------------------- */

test('ADR-10.2: el pedido sale en el mismo toque, sobre .fichin y sobre nada más', () => {
  const u = armar();
  u.tocarElBoton();
  // **Sin esperar nada**: esto se mira apenas vuelve el manejador. Con un `await` o una flecha
  // `async` en el camino, acá todavía no hay pedido, y en el teléfono el sistema lo niega.
  assert.deepEqual(u.pedidos, ['fichin'], `pidió sobre ${JSON.stringify(u.pedidos)}: tiene que ser .fichin, una vez, en el toque`);
  assert.ok(enElModo(u), 'el modo tiene que quedar puesto en el mismo toque, antes de todo lo demás');
});

test('ADR-10.2: el modo va primero, aunque el pedido tire sin promesa', () => {
  const u = armar({ sistema: 'explota' });
  assert.doesNotThrow(() => u.tocarElBoton(), 'un pedido que tira no puede escaparse del manejador');
  assert.deepEqual(u.pedidos, ['fichin']);
  assert.ok(enElModo(u), 'el modo entra antes del pedido: si el pedido falla, el modo ya está');
});

/* --------------------------------------------------------------------------
   3. Cada rechazo se traga
   -------------------------------------------------------------------------- */

test('ADR-10.2: si el sistema niega la pantalla, el rechazo se traga y el modo sigue', async () => {
  const u = armar({ sistema: 'niega' });
  const sueltos = await rechazosSinAtajar(() => u.tocarElBoton());
  assert.deepEqual(sueltos, [], 'quedó un rechazo del pedido sin atajar');
  assert.ok(enElModo(u), 'negada la del sistema, el modo de la página tiene que seguir');
  assert.deepEqual(u.bloqueos, [], 'sin pantalla del sistema no se pide la orientación');
});

test('ADR-10.2: si la orientación no se deja fijar, el rechazo se traga', async () => {
  const u = armar({ orientacion: 'rechaza' });
  const sueltos = await rechazosSinAtajar(() => u.tocarElBoton());
  assert.deepEqual(u.bloqueos, ['landscape'], 'con la pantalla del sistema dada, se pide la orientación horizontal');
  assert.deepEqual(sueltos, [], 'quedó el rechazo del lock sin atajar');
  assert.ok(enElModo(u));
});

test('ADR-10.2: sin orientación (Safari viejo) no se rompe nada', async () => {
  const u = armar({ orientacion: 'sin-orientacion' });
  const sueltos = await rechazosSinAtajar(() => u.tocarElBoton());
  assert.deepEqual(sueltos, []);
  assert.ok(enElModo(u));
});

/* --------------------------------------------------------------------------
   4. Las tres puertas
   -------------------------------------------------------------------------- */

test('ADR-10.3 puerta 1: el mismo botón, dado vuelta, saca y suelta todo', async () => {
  const u = armar();
  await rechazosSinAtajar(() => u.tocarElBoton());
  assert.equal(u.boton.textContent, PANTALLA_COMPLETA.completa);
  assert.equal(u.boton.atributos.get('aria-label'), PANTALLA_COMPLETA.salir);
  assert.equal(u.boton.atributos.get('aria-pressed'), 'true');

  u.tocarElBoton();
  assert.ok(!enElModo(u), 'el segundo toque tiene que sacar del modo');
  assert.deepEqual(u.salidasDelSistema, ['exitFullscreen'], 'adentro de la del sistema, salir la suelta');
  assert.deepEqual(u.desbloqueos, ['unlock']);
  assert.equal(u.boton.textContent, PANTALLA_COMPLETA.ventana);
  assert.equal(u.boton.atributos.get('aria-label'), PANTALLA_COMPLETA.entrar);
  assert.equal(u.boton.atributos.get('aria-pressed'), 'false');
});

test('ADR-10.3 puerta 2: sin API, Escape saca del modo', () => {
  const u = armar({ sistema: 'sin-api' });
  u.tocarElBoton();
  assert.ok(enElModo(u), 'sin API el modo entra igual: es lo que hay en iPhone');
  u.disparar('keydown', { key: 'Enter' });
  assert.ok(enElModo(u), 'otra tecla no saca');
  u.disparar('keydown', { key: 'Escape' });
  assert.ok(!enElModo(u), 'Escape tiene que sacar del modo cuando no hay pantalla del sistema');
});

test('ADR-10.3 puerta 3: cuando el sistema termina la suya, el modo sale', async () => {
  const u = armar();
  await rechazosSinAtajar(() => u.tocarElBoton());
  assert.ok(enElModo(u));
  // Con la del sistema puesta, `Escape` la consume el navegador: el modo no se adelanta.
  u.disparar('keydown', { key: 'Escape' });
  assert.ok(enElModo(u), 'con la del sistema puesta, Escape la maneja el navegador y avisa por fullscreenchange');
  // El gesto de volver de Android: el sistema la suelta y avisa.
  u.sistemaEn(null);
  u.disparar('fullscreenchange');
  assert.ok(!enElModo(u), 'el sistema terminó la suya y el modo quedó puesto');
  assert.deepEqual(u.salidasDelSistema, [], 'ya estaba afuera: no se le pide al sistema que salga otra vez');
});

test('ADR-10.3 puerta 3: el aviso con prefijo también saca', async () => {
  const u = armar();
  await rechazosSinAtajar(() => u.tocarElBoton());
  u.sistemaEn(null);
  u.disparar('webkitfullscreenchange');
  assert.ok(!enElModo(u));
});

test('ADR-10.3: un fullscreenchange ajeno no saca del modo que entró sin el sistema', () => {
  const u = armar({ sistema: 'sin-api' });
  u.tocarElBoton();
  u.disparar('fullscreenchange');
  assert.ok(enElModo(u), 'el modo entró sin el sistema: un aviso del sistema no es una salida');
});

test('entrar y salir sueltan las teclas: una tecla que se muda con un dedo encima no queda apretada', async () => {
  const u = armar();
  await rechazosSinAtajar(() => u.tocarElBoton());
  assert.equal(u.sueltas.cuenta, 1);
  u.tocarElBoton();
  assert.equal(u.sueltas.cuenta, 2);
});

test('al salir, la página vuelve adonde estaba: no arriba de todo', async () => {
  const u = armar({ scrollY: 71 });
  await rechazosSinAtajar(() => u.tocarElBoton());
  u.tocarElBoton();
  assert.deepEqual(u.desplazamientos.at(-1), [0, 71], 'la persona tiene que volver al mueble donde estaba');
});

/* --------------------------------------------------------------------------
   5. El observador y el encuadre
   -------------------------------------------------------------------------- */

test('ADR-10.1: el observador mira el contenedor y su aviso escribe el encuadre de pantalla.ts', async () => {
  const u = armar({ ancho: 844, alto: 390, dpr: 3 });
  assert.ok(u.observados.includes('fichin'), `el observador mira ${JSON.stringify(u.observados)} y no el contenedor`);

  // Afuera del modo, un aviso no escribe nada: el mueble de `D-41` no se entera.
  u.avisarAlObservador();
  assert.equal(u.propiedades.size, 0, 'afuera del modo el encuadre no se escribe');

  await rechazosSinAtajar(() => u.tocarElBoton());
  u.propiedades.clear();
  u.avisarAlObservador();
  const caja = cajaDelArea(844, 390, { bisel: 4, pie: 24, mando: 324 + 16 });
  const e = encuadre(caja.ancho, caja.alto, 3, caja);
  assert.deepEqual(Object.fromEntries(u.propiedades), {
    '--encuadre-ancho': `${e.ancho}px`,
    '--encuadre-alto': `${e.alto}px`,
    '--encuadre-izquierda': `${e.izquierda}px`,
    '--encuadre-arriba': `${e.arriba}px`,
  });
});
