/**
 * La isla de Skayboy y Poligirl (`US-09`, `T-247`). Isla de `skayboy-y-poligirl.astro`.
 *
 * **Lo que decide el juego no vive acá.** La física, la sala, quién vuelve a la entrada y
 * cuándo se gana están en `src/lib/skayboy/mundo.ts` (`T-254`), probados con `node --test`.
 * Esta isla hace tres cosas y nada más: **escucha las seis teclas, le pasa el mando al
 * mundo una vez por cuadro, y dibuja lo que el mundo dejó.** Si algún día hay que cambiar
 * de motor (`ADR-08.6`), se reescribe este archivo y el juego no se entera.
 *
 * ## Un cuadro es siempre un cuadro (`ADR-09.1`, `T-267`)
 *
 * El motor llama a la isla con el tiempo que pasó desde el tic anterior, y ese tiempo tiembla.
 * La isla no se lo pasa al mundo: se lo da a `jugarTic()`, que lo junta en un `Reloj` y le pasa
 * al mundo **cuadros enteros de `CUADRO_SEG`** —con tope de tres por tic, y lo que sobra del tope
 * se tira—. Es el mismo `dt` con que se juega la traza grabada de cada nivel en el build: sin
 * esto, la máquina probaría una física parecida a la del teléfono, no la misma. El tic entero
 * vive en `mundo.ts` y lo juega `mundo.test.ts`; `motor.test.ts` vigila que la isla no toque el
 * tiempo por su cuenta.
 *
 * ## El motor, con sus cuatro apagados (`ADR-08.2`) — y los vigila `motor.test.ts`
 *
 * 1. `global: false`: ni un nombre del motor en `window`.
 * 2. `canvas`: el `<canvas id="juego">` que ya está en el HTML, adentro del recorte impreso
 *    (`D-41` punto 3). El motor no crea el suyo.
 * 3. **El audio: `void k.audioCtx.close()` en la línea siguiente a `kaplay(`**, sincrónico y
 *    antes de cualquier otra cosa (`ADR-08.2.1`, condición 1). Ninguna opción del init lo
 *    apaga; esta línea sí. **Y `backgroundAudio: true`**, que no enciende nada: impide que
 *    el motor le haga `suspend()`/`resume()` al contexto cerrado cada vez que la pestaña se
 *    esconde y vuelve. Todo lo que suena sale del contexto del sitio: el tema por la
 *    cinta (`ADR-08.9`) y los tres efectos por `sonido.ts` (`CTR-17`).
 * 4. **Cero texto en el canvas.** Todo lo que se lee vive en el DOM, con las fuentes del
 *    sitio. Y `debug: false`, porque el inspector del motor también es texto.
 *
 * ## Se carga solo si hay un nivel que jugar
 *
 * El motor entra con `import()` y no arriba de todo: si la página no sembró ningún nivel,
 * el teléfono no baja 66,8 KB para mostrar el rótulo que ya estaba. Y en producción la
 * página siembra **solo los `listo`** (`nivelesListos()`): hasta que alguien juegue el nivel
 * 1 en un teléfono (`T-249`), lo que se ve publicado es el rótulo estático — que dice qué va
 * a haber ahí y no promete nada (`ADR-08.2`). Es lo honesto.
 *
 * ## Las teclas se mantienen apretadas, y eso el repo no lo tenía (`ADR-08.10`)
 *
 * El estado se lee por `pointerdown` / `pointerup` **con captura**, nunca por repetición de
 * eventos. Cada tecla lleva la cuenta de qué punteros la están apretando: dos dedos en la
 * misma tecla y uno que se levanta no la sueltan. Si la pestaña se esconde, se sueltan
 * todas — una tecla trabada es un personaje que camina solo, y el que espera tiene que
 * estar quieto (`UX-28 §3`).
 *
 * ## `prefers-reduced-motion` (`ADR-08.8`, vara 1)
 *
 * El juego arranca **quieto por construcción**: los dos parados en su entrada, y nada se
 * mueve sin un dedo encima. No hay nada que apagar, y por eso esta isla no consulta la
 * preferencia: no tiene movimiento que la persona no haya pedido.
 */

import type { KAPLAYCtx } from 'kaplay';
import {
  CUERPO_ALTO,
  CUERPO_ANCHO,
  PERSONAJES,
  QUIETO,
  TILE,
  crearMundo,
  crearReloj,
  jugarTic,
  poseDe,
  type Cuerpo,
  type Mando,
  type Mundo,
  type Suceso,
} from '../lib/skayboy/mundo.ts';
import type { Banco, IdPersonaje } from '../lib/skayboy/niveles.ts';
import { armarEfectos, soltarEfectos, sonar } from '../lib/skayboy/sonido.ts';
import { alCambiarLaCinta, estadoDeLaCinta } from '../lib/sitio/cinta.ts';
import { PANTALLA } from '../lib/skayboy/copy.ts';

/**
 * Qué columna maneja a quién. **Siempre la misma** (`D-43`): no hay botón de cambio y no
 * hay modo que elegir (`UX-28 §1`). La izquierda es de Skayboy porque en el nivel 1 su
 * puerta queda a la izquierda — la columna apunta hacia donde va el personaje.
 */
const COLUMNA: Readonly<Record<'izquierda' | 'derecha', IdPersonaje>> = {
  izquierda: 'skayboy',
  derecha: 'poligirl',
};

type Tecla = 'izquierda' | 'derecha' | 'salto';

/**
 * Los colores del área, **provisorios hasta `T-238`**. La paleta de verdad son dieciséis
 * `--px-*` que nacen en el lienzo y todavía no existen (`UX-27 §5`). Mientras tanto se
 * dibuja con tokens que ya están en `tokens.css` —ni un hex acá— y el día que lleguen los
 * `--px-*` se cambian estos nombres y nada más.
 */
const TINTAS = {
  fondo: '--fondo',
  solido: '--texto-tenue',
  tesoro: '--acento-2',
  skayboy: '--cat-mitologia-apoyo',
  poligirl: '--disco-gulp-tinta',
  ambos: '--texto',
  ojo: '--fondo',
} as const;

type Rgb = readonly [number, number, number];

function leerTinta(nombre: string): Rgb {
  const valor = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(valor)?.[1];
  if (hex === undefined) return [128, 128, 128];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as unknown as Rgb;
}

/* ==========================================================================
   Las teclas
   ========================================================================== */

/** Qué punteros aprietan cada tecla de cada columna. Vacío es suelta. */
const apretadas = new Map<HTMLButtonElement, Set<number>>();

function mandoDe(lado: 'izquierda' | 'derecha'): Mando {
  const m = { izquierda: false, derecha: false, saltar: false };
  for (const [boton, punteros] of apretadas) {
    if (punteros.size === 0 || boton.dataset.mando !== lado) continue;
    const tecla = boton.dataset.tecla as Tecla;
    if (tecla === 'salto') m.saltar = true;
    else m[tecla] = true;
  }
  return m;
}

function pintarTecla(boton: HTMLButtonElement): void {
  boton.classList.toggle('tecla--apretada', (apretadas.get(boton)?.size ?? 0) > 0);
}

function apretar(boton: HTMLButtonElement, puntero: number): void {
  apretadas.get(boton)?.add(puntero);
  pintarTecla(boton);
}

function soltar(boton: HTMLButtonElement, puntero: number): void {
  apretadas.get(boton)?.delete(puntero);
  pintarTecla(boton);
}

function soltarTodas(): void {
  for (const [boton, punteros] of apretadas) {
    punteros.clear();
    pintarTecla(boton);
  }
}

/** El teclado usa un puntero que ningún dedo puede tener. */
const TECLADO = -1;

function escucharTeclas(): void {
  for (const boton of document.querySelectorAll<HTMLButtonElement>('button[data-mando][data-tecla]')) {
    apretadas.set(boton, new Set());

    boton.addEventListener('pointerdown', (e) => {
      // No pasivo a propósito: cancelar acá es lo que evita que el toque largo abra el menú
      // del sistema o seleccione texto mientras el pulgar sostiene la dirección.
      e.preventDefault();
      // La captura es lo que deja correr el pulgar sin soltar la tecla. Si el navegador no
      // la da (un puntero que ya se fue), la tecla se aprieta igual: sin captura se suelta
      // al salir del botón, que es peor pero no deja a nadie sin jugar.
      try {
        boton.setPointerCapture(e.pointerId);
      } catch {
        /* sigue sin captura */
      }
      apretar(boton, e.pointerId);
    });
    for (const fin of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
      boton.addEventListener(fin, (e) => soltar(boton, e.pointerId));
    }
    boton.addEventListener('contextmenu', (e) => e.preventDefault());

    // Con teclado también se juega: la tecla del botón enfocado se mantiene como un dedo.
    boton.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        apretar(boton, TECLADO);
      }
    });
    boton.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') soltar(boton, TECLADO);
    });
    boton.addEventListener('blur', () => soltar(boton, TECLADO));
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) soltarTodas();
  });
}

/* ==========================================================================
   El sonido: se arma con la cinta y se suelta con ella (`CTR-17.5`)
   ========================================================================== */

function engancharEfectos(): void {
  if (estadoDeLaCinta() === 'sonando') armarEfectos();
  alCambiarLaCinta((estado) => {
    if (estado === 'sonando') armarEfectos();
    else soltarEfectos();
  });
}

/* ==========================================================================
   Lo que pasa con cada suceso
   ========================================================================== */

const aviso = document.querySelector<HTMLElement>('#aviso-juego');

function atender(sucesos: readonly Suceso[]): void {
  for (const s of sucesos) {
    // Callado también: la compuerta no suena (`CTR-16.10.7`, cuatro motivos) y el dibujo lee el
    // estado del mundo, no el suceso. Lo consume la cuenta de la paridad (`CTR-18.8`), no la isla.
    if (s.tipo === 'compuerta') continue;
    if (s.tipo === 'vuelta') {
      // Callado: `vuelta` no suena (`UX-29 §5`, `CTR-17.6`). El aviso nombra el lugar y no
      // a la persona, y se escribe una vez por vuelta para que el lector lo repita.
      if (aviso !== null) {
        aviso.textContent = '';
        aviso.textContent = PANTALLA.avisoEntrada;
      }
      continue;
    }
    sonar(s.tipo);
  }
}

/* ==========================================================================
   El dibujo: rectángulos de tinta plana, hasta que lleguen los atlas (`T-246`)
   ========================================================================== */

function dibujar(k: KAPLAYCtx, mundo: Mundo, tintas: Readonly<Record<keyof typeof TINTAS, Rgb>>): void {
  const color = (t: Rgb) => k.rgb(t[0], t[1], t[2]);
  const { banco, nivel } = mundo;

  nivel.grilla.forEach((renglon, fila) => {
    [...renglon].forEach((caracter, columna) => {
      const t = banco.leyenda[caracter];
      if (t === undefined || t.tipo === 'aire' || t.tipo === 'entrada') return;
      const pos = k.vec2(columna * TILE, fila * TILE);
      if (t.tipo === 'solido' || t.tipo === 'caja') {
        k.drawRect({ pos, width: TILE, height: TILE, color: color(tintas.solido) });
      } else if (t.tipo === 'tesoro') {
        if (mundo.juntados.has(`${columna},${fila}`)) return;
        k.drawRect({ pos: pos.add(5, 5), width: 6, height: 6, color: color(tintas.tesoro) });
      } else if (t.tipo === 'puerta' && t.de !== undefined) {
        // La puerta es un marco del color de su dueño, y se llena cuando se abre.
        k.drawRect({
          pos: pos.add(1, -8),
          width: TILE - 2,
          height: TILE + 8,
          fill: mundo.terminado,
          color: color(tintas[t.de]),
          outline: { width: 2, color: color(tintas[t.de]) },
        });
      } else if (t.tipo === 'molinete') {
        // El terreno que devuelve a uno lleva el color **del otro**: es el suyo.
        const quienes = t.devuelve ?? [];
        const tinta = quienes.length > 1 ? tintas.ambos : quienes[0] === 'skayboy' ? tintas.poligirl : tintas.skayboy;
        k.drawRect({ pos: pos.add(0, 10), width: TILE, height: 6, color: color(tinta) });
      }
    });
  });

  for (const id of PERSONAJES) dibujarCuerpo(k, mundo.cuerpos[id], color(tintas[id]), color(tintas.ojo));
}

/**
 * Un cuerpo es su caja de colisión pintada, más **la pose como forma** (`UX-28 §3`): de
 * frente, dos ojos centrados; de perfil, uno solo hacia donde mira. Ningún estado se dice
 * con color, y ninguna pose es de caída (`UX-29 §6`).
 */
function dibujarCuerpo(k: KAPLAYCtx, c: Cuerpo, cuerpo: ReturnType<KAPLAYCtx['rgb']>, ojo: ReturnType<KAPLAYCtx['rgb']>): void {
  const x = Math.round(c.x);
  const y = Math.round(c.y);
  k.drawRect({ pos: k.vec2(x, y), width: CUERPO_ANCHO, height: CUERPO_ALTO, color: cuerpo });
  if (poseDe(c) === 'frente') {
    k.drawRect({ pos: k.vec2(x + 2, y + 4), width: 2, height: 2, color: ojo });
    k.drawRect({ pos: k.vec2(x + CUERPO_ANCHO - 4, y + 4), width: 2, height: 2, color: ojo });
  } else {
    const ojoX = c.mira > 0 ? x + CUERPO_ANCHO - 3 : x + 1;
    k.drawRect({ pos: k.vec2(ojoX, y + 4), width: 2, height: 2, color: ojo });
  }
}

/* ==========================================================================
   El arranque
   ========================================================================== */

/**
 * `E` de `ADR-08.3`: cuántos píxeles de dispositivo ocupa un píxel nativo. Entero siempre;
 * con DPR fraccionario cede el buffer y no la caja CSS.
 */
function escalaCss(): number {
  const fichin = document.querySelector<HTMLElement>('.fichin');
  const valor = fichin === null ? 1 : Number(getComputedStyle(fichin).getPropertyValue('--escala'));
  return Number.isInteger(valor) && valor > 0 ? valor : 1;
}

async function arrancar(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#juego');
  const datos = document.querySelector('#banco-skayboy')?.textContent;
  if (canvas === null || datos === undefined || datos === null) return;
  const banco = JSON.parse(datos) as Banco;
  const nivel = banco.niveles[0];
  // Sin un nivel sembrado queda el rótulo impreso, y el motor ni se baja.
  if (nivel === undefined) return;

  const escala = escalaCss();
  const densidad = Math.max(escala, Math.round(escala * window.devicePixelRatio)) / escala;
  const { default: kaplay } = await import('kaplay');
  const k = kaplay({
    global: false,
    canvas,
    width: 240,
    height: 144,
    scale: escala,
    pixelDensity: densidad,
    crisp: true,
    debug: false,
    loadingScreen: false,
    burp: false,
    touchToMouse: false,
    // No es para que algo suene de fondo: es para que el motor **no toque** su contexto.
    // Sin esto, al esconderse la pestaña hace `suspend()` y al volver `resume()` sobre el
    // contexto que acabamos de cerrar, y cada vuelta tira un error sin atrapar ("Cannot
    // resume a closed AudioContext"). Medido en el navegador el 2026-09-22; es la mitad del
    // apagado que `ADR-08.2.1` no sabía que faltaba.
    backgroundAudio: true,
    background: [...leerTinta(TINTAS.fondo)],
  });
  void k.audioCtx.close();

  // El motor escribe el tamaño de la caja en línea; se lo sacamos para que lo mande la
  // hoja (`--escala`), que es la que sabe del reparto de `UX-28 §2`. Y el canvas no se
  // enfoca: las que se enfocan son las teclas, que tienen nombre.
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');
  canvas.tabIndex = -1;

  const tintas = Object.fromEntries(
    Object.entries(TINTAS).map(([clave, token]) => [clave, leerTinta(token)]),
  ) as Record<keyof typeof TINTAS, Rgb>;
  const mundo = crearMundo(banco, nivel);
  const reloj = crearReloj();

  k.onUpdate(() => {
    // Las teclas se leen una vez por tic y valen para todos los cuadros de ese tic (ADR-09.1).
    const mandos = {
      [COLUMNA.izquierda]: mandoDe('izquierda'),
      [COLUMNA.derecha]: mandoDe('derecha'),
    } as Record<IdPersonaje, Mando>;
    const ambos = { skayboy: mandos.skayboy ?? QUIETO, poligirl: mandos.poligirl ?? QUIETO };
    // Paso fijo: el tiempo del motor se reparte en cuadros enteros, con tope, y el mundo avanza
    // siempre de a un CUADRO_SEG. Es el mismo paso con que la máquina prueba cada nivel en el
    // build, así que lo que se juega acá es, bit a bit, lo que se probó. Todo eso vive en
    // jugarTic(), probado en Node: la isla solo le da el tiempo del motor.
    atender(jugarTic(reloj, mundo, ambos, k.dt()));
  });
  k.onDraw(() => dibujar(k, mundo, tintas));

  // El rótulo se va cuando el motor ya dibuja, no antes: si el `import` falla, queda.
  document.querySelector('.rotulo-carga')?.setAttribute('hidden', '');
}

escucharTeclas();
engancharEfectos();
void arrancar();
