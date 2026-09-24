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
 * ## El dibujo sale de los atlas, y de nada más (`T-278`, `CTR-15`)
 *
 * Adentro del área no hay un solo rectángulo de tinta plana: todo lo que se ve es un cuadro de
 * `public/sprites/` —`skayboy.v1`, `poligirl.v1`, `sala.v2`—, cargado a tamaño nativo y
 * escalado por el motor con un entero y sin suavizado (`crisp`, `texFilter: 'nearest'`,
 * `ADR-08.3`). **Qué** se dibuja, en qué estado y dónde lo decide `escena.ts`, probado en Node
 * (`escena.test.ts`): el mapeo de `poseDe()` a los estados del atlas, el espejo según `mira`,
 * el tile de cada celda según el estado de palancas, placas, compuertas y cajas. La isla
 * recorre esos trazos y se los pasa al motor.
 *
 * **La única tinta que la isla lee de la hoja es el aire, `--px-luz`** (`UX-27 §1.1`): es el
 * fondo del motor, y el sólido (`--px-clave`) ya viene dibujado en el tile. Si no se deja leer,
 * o si un atlas no está o no es el que la escena espera, el juego no arranca y queda el rótulo
 * impreso: un área a medio pintar sería inventar lo que falta. Lo vigila `motor.test.ts`.
 *
 * ## Ganar se ve, y se sigue con un toque (`UX-32`, `T-290`)
 *
 * **Qué se ve lo decide `escena.ts`**, como todo el dibujo: con el mundo ganado, las dos puertas
 * son `puertaAbierta` en el mismo cuadro y los dos muñecos van de frente. La isla no hace nada
 * especial para eso — dibuja los trazos de siempre. Ni festejo, ni cartel, ni cámara: después de
 * ese cuadro no se mueve nada, porque el reloj del mundo se congela al ganar.
 *
 * **Seguir es tocar el área.** Encima del canvas hay un `<button>` del tamaño del recorte
 * (`#seguir-juego`, con el verbo del sitio de etiqueta), escondido mientras se juega. En el mismo
 * tic en que el mundo termina la isla lo muestra —`mostrarSeguir()`, llamada después de cada
 * `jugarTic(`—, y tocarlo cambia el mundo por el que arma `alTocarSeguir()`, el del nivel que sigue,
 * **ahí mismo**: sin recargar, sin bajar nada, con el mismo motor y los mismos atlas (`D-32`
 * límite 3). Las dos viven en `escena.ts` y se juegan en Node; la isla pone el pegamento y suelta
 * las teclas al cambiar de nivel: el que arranca tiene que estar quieto (`UX-28 §3`). En el último
 * nivel no aparece: a dónde lleva ahí es de `producto` (`UX-32 §5`, `BR-27`).
 *
 * ## Se carga solo si hay un nivel que jugar
 *
 * El motor entra con `import()` y no arriba de todo: si la página no sembró ningún nivel,
 * el teléfono no baja 66,8 KB para mostrar el rótulo que ya estaba. Y en producción la
 * página siembra **solo los `listo`** (`nivelesListos()`): hasta que alguien juegue el nivel
 * 1 en un teléfono (`T-249`), lo que se ve publicado es el rótulo estático — que dice qué va
 * a haber ahí y no promete nada (`ADR-08.2`). Es lo honesto.
 *
 * **En desarrollo** la página siembra todos los niveles, borradores incluidos, y la isla juega el
 * primero —o el que pida `?nivel=NIV-04` en la dirección—. Ese pedido no existe en el build.
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

import type { KAPLAYCtx, SpriteData } from 'kaplay';
import { QUIETO, crearMundo, crearReloj, jugarTic, type Mando, type Mundo, type Suceso } from '../lib/skayboy/mundo.ts';
import type { Banco, IdPersonaje } from '../lib/skayboy/niveles.ts';
import type { JsonDelAtlas } from '../lib/pixel/fuente.ts';
import {
  PIEZAS,
  alTocarSeguir,
  atlasDe,
  cuadroDelAtlas,
  grillaDelAtlas,
  mostrarSeguir,
  nivelAJugar,
  problemasDelAtlas,
  problemasDelCuadro,
  rutaDe,
  trazosDe,
  type Pieza,
} from '../lib/skayboy/escena.ts';
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
 * **El aire del área** (`UX-27 §1.1`, decisión `β`): todo lo que no es sólido, terreno pintado ni
 * sprite. Es el fondo del motor y la única tinta que esta isla lee de la hoja; el resto viene
 * dibujado en los atlas. El hex vive en `tokens.css` (`--px-luz: var(--papel)`), ni uno acá.
 */
const AIRE = '--px-luz';

function leerTinta(nombre: string): [number, number, number] {
  const valor = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(valor)?.[1];
  // Sin el aire no se arranca: un gris de repuesto sería una tinta diecisiete (`UX-27 §4`).
  if (hex === undefined) throw new Error(`${nombre} no se deja leer como #rrggbb: «${valor}»`);
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
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

/** El botón del recorte que lleva al nivel que sigue (`UX-32 §5`). Nace escondido en el HTML. */
const seguir = document.querySelector<HTMLButtonElement>('#seguir-juego');

/**
 * `deFrente` junta a los que volvieron a la entrada en este tic: el cuadro que sigue se dibujan
 * de frente (`UX-29 §3`, fila 1), y después la isla lo vacía.
 */
function atender(sucesos: readonly Suceso[], deFrente: Set<IdPersonaje>): void {
  for (const s of sucesos) {
    // Callado también: la compuerta no suena (`CTR-16.10.7`, cuatro motivos) y el dibujo lee el
    // estado del mundo, no el suceso. Lo consume la cuenta de la paridad (`CTR-18.8`), no la isla.
    if (s.tipo === 'compuerta') continue;
    if (s.tipo === 'vuelta') {
      deFrente.add(s.quien);
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
   Los atlas (`CTR-15.6`): un PNG y su JSON por pieza, a tamaño nativo
   ========================================================================== */

/** Un atlas cargado: su JSON (qué fila es qué estado) y los cuadros que el motor cortó del PNG. */
interface Atlas {
  readonly json: JsonDelAtlas;
  readonly sprite: SpriteData;
}

/**
 * Los tres JSON, antes de bajar el motor: si alguno no está o no es el que la escena espera,
 * el motor ni se baja y queda el rótulo. Las rutas las arma `rutaDe()`, que no arma ninguna sin
 * versión en el nombre (`CTR-15.8`).
 */
async function leerLosJson(nombres: Readonly<Record<Pieza, string>>): Promise<Record<Pieza, JsonDelAtlas>> {
  const pares = await Promise.all(
    PIEZAS.map(async (pieza) => {
      const ruta = rutaDe(nombres[pieza], 'json');
      const respuesta = await fetch(ruta);
      if (!respuesta.ok) throw new Error(`${ruta}: ${respuesta.status}`);
      const json: unknown = await respuesta.json();
      const problemas = problemasDelAtlas(pieza, json);
      if (problemas.length > 0) throw new Error(problemas.join('\n'));
      return [pieza, json as JsonDelAtlas] as const;
    }),
  );
  return Object.fromEntries(pares) as Record<Pieza, JsonDelAtlas>;
}

/**
 * El PNG de una pieza, cortado en la grilla de su JSON: una fila por estado, una columna por
 * cuadro. **No se reescala**: cada cuadro tiene que medir la celda en nativos, y si el PNG vino
 * agrandado no entra (`CTR-15.6`). La escala la pone el motor al dibujar, entera.
 */
function cargarAtlas(k: KAPLAYCtx, pieza: Pieza, nombre: string, json: JsonDelAtlas): Promise<Atlas> {
  const { columnas, filas } = grillaDelAtlas(json);
  const asset = k.loadSprite(null, rutaDe(nombre, 'png'), { sliceX: columnas, sliceY: filas });
  return new Promise((resolver, rechazar) => {
    asset.onLoad((sprite) => {
      const problemas = problemasDelCuadro(pieza, json, sprite.width, sprite.height);
      if (problemas.length > 0) rechazar(new Error(problemas.join('\n')));
      else resolver({ json, sprite });
    });
    asset.onError(rechazar);
  });
}

/* ==========================================================================
   El dibujo: cada trazo de la escena, un cuadro de un atlas (`T-278`)
   ========================================================================== */

function dibujar(k: KAPLAYCtx, mundo: Mundo, atlas: Readonly<Record<Pieza, Atlas>>, deFrente: ReadonlySet<IdPersonaje>): void {
  for (const t of trazosDe(mundo, deFrente)) {
    const { json, sprite } = atlas[t.pieza];
    k.drawSprite({
      sprite,
      frame: cuadroDelAtlas(json, t.estado, mundo.tiempo),
      pos: k.vec2(t.x, t.y),
      flipX: t.espejo,
    });
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
  // Solo en desarrollo, `?nivel=NIV-04` juega otro nivel sembrado (`nivelAJugar()`): sin esto, lo
  // único que se ve en el navegador es el nivel 1, que no tiene palancas, placas, compuertas ni
  // cajas. En el build `import.meta.env.DEV` es `false`, la rama se va, y se juega el primero.
  const pedido = import.meta.env.DEV ? new URLSearchParams(location.search).get('nivel') : null;
  const nivel = nivelAJugar(banco.niveles, pedido);
  // Sin un nivel sembrado queda el rótulo impreso, y el motor ni se baja.
  if (nivel === undefined) return;

  // El aire y los tres JSON, antes que el motor: si falta cualquiera, el motor ni se baja.
  const aire = leerTinta(AIRE);
  const nombres = atlasDe(banco);
  const jsons = await leerLosJson(nombres);

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
    // Sin suavizado, en las dos puntas: `crisp` es el `pixelated` del canvas, y `texFilter`
    // el muestreo de los atlas. Es el valor por defecto del motor y se escribe igual: un
    // `linear` que se cuele es barro (`CTR-15.2`), y así lo vigila `motor.test.ts`.
    crisp: true,
    texFilter: 'nearest',
    // Un píxel transparente entre pieza y pieza del atlas interno del motor: con densidad
    // fraccionaria (`ADR-08.3`, el caso feo) el muestreo no le roba un borde al vecino.
    spriteAtlasPadding: 1,
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
    background: aire,
  });
  void k.audioCtx.close();

  // El motor escribe el tamaño de la caja en línea; se lo sacamos para que lo mande la
  // hoja (`--escala`), que es la que sabe del reparto de `UX-28 §2`. Y el canvas no se
  // enfoca: las que se enfocan son las teclas, que tienen nombre.
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');
  canvas.tabIndex = -1;

  const cargados = await Promise.all(PIEZAS.map((pieza) => cargarAtlas(k, pieza, nombres[pieza], jsons[pieza])));
  const atlas = Object.fromEntries(PIEZAS.map((pieza, i) => [pieza, cargados[i]])) as Record<Pieza, Atlas>;
  // `let`: seguir al próximo nivel es cambiar este mundo por otro. El reloj no se cambia: es el
  // del motor, y lo que guarda es menos de un cuadro de tiempo, no nada del nivel.
  let mundo = crearMundo(banco, nivel);
  const reloj = crearReloj();
  const deFrente = new Set<IdPersonaje>();

  // Qué hace el toque y cuándo se ve el botón lo deciden `alTocarSeguir()` y `mostrarSeguir()`,
  // jugadas en Node; acá queda el pegamento con el DOM (`escena.test.ts` vigila que se llamen).
  seguir?.addEventListener('click', () => {
    const nuevo = alTocarSeguir(mundo, banco.niveles, deFrente);
    if (nuevo === undefined) return;
    // Si llegó con el teclado, el foco vuelve a la primera tecla: esconder el botón enfocado lo
    // mandaría al `body`, y el que juega con Tab tendría que volver a buscar el mando.
    const conTeclado = seguir.matches(':focus-visible');
    mundo = nuevo;
    // El que arranca tiene que estar quieto (`UX-28 §3`): ningún dedo pasa de un nivel al otro.
    soltarTodas();
    mostrarSeguir(seguir, mundo, banco.niveles);
    if (conTeclado) document.querySelector<HTMLButtonElement>('button[data-mando][data-tecla]')?.focus();
  });

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
    atender(jugarTic(reloj, mundo, ambos, k.dt()), deFrente);
    // En el mismo tic en que se gana, el toque para seguir ya es tocable (`D-32` límite 3).
    mostrarSeguir(seguir, mundo, banco.niveles);
  });
  k.onDraw(() => {
    dibujar(k, mundo, atlas, deFrente);
    // Un cuadro de frente y nada más (`UX-29 §3`): el dedo responde desde el cuadro cero.
    deFrente.clear();
  });

  // El rótulo se va cuando el motor ya dibuja, no antes: si el `import` falla, queda.
  document.querySelector('.rotulo-carga')?.setAttribute('hidden', '');
}

escucharTeclas();
engancharEfectos();
void arrancar();
