/**
 * La escena de Skayboy y Poligirl (`T-278`, ciclo 16): **qué se dibuja, de qué atlas, en qué
 * estado y dónde**, sin motor. La isla (`src/scripts/partida-skayboy.ts`) recorre lo que sale de
 * acá y le pasa cada trazo al motor; no decide nada por su cuenta.
 *
 * ## Por qué vive afuera de la isla
 *
 * Por lo mismo que `mundo.ts`: la isla no se puede cargar en Node (toca el DOM al importarla), y
 * lo que hay que ver en rojo está justo acá — que cada pose tenga su estado del atlas, que una
 * palanca activa no se dibuje en reposo, que el perfil se espeje hacia donde mira, que ningún
 * atlas se pida sin versión. `escena.test.ts` lo juega; `motor.test.ts` mira que la isla dibuje
 * con esto y con nada más (ni un rectángulo de tinta plana).
 *
 * ## Qué atlas, y de dónde sale el nombre (`CTR-15.5`, `CTR-15.8`)
 *
 * Los dos muñecos los nombra **el dato**: `banco.personajes[].atlas` (`CTR-16.3`, y el schema
 * ya le exige la versión). La sala no tiene campo en el banco todavía, así que su nombre vive
 * acá, en `ATLAS_DE_LA_SALA` — y `escena.test.ts` lo ata a la `version:` de
 * `src/arte/pixel/sala.txt`, que es la que imprime el PNG. Los tres se piden por ruta, desde
 * `public/sprites/`, y **siempre con la versión en el nombre**: `rutaDe()` no arma una ruta sin
 * ella. Astro no le pone huella a `public/`, y un PNG repintado con el mismo nombre se le sigue
 * sirviendo viejo a quien lo tenga en caché.
 *
 * ## El mapeo de la pose al atlas (`UX-28 §3`, `CTR-15.7`)
 *
 * | `poseDe()`      | Estado del atlas              | Espejo                 |
 * |-----------------|-------------------------------|------------------------|
 * | `frente`        | `enPausa`                     | nunca: mira a cámara   |
 * | `perfil-quieto` | `quieto`                      | si `mira` es `-1`      |
 * | `perfil-corre`  | `corre` (4 cuadros, 10 por s) | si `mira` es `-1`      |
 * | `perfil-aire`   | `salta` si sube, `cae` si no  | si `mira` es `-1`      |
 *
 * - **`enPausa` es la pose de frente** y `quieto` la de perfil parado: `CTR-15.7` los nombra así
 *   y `UX-28 §3` fija el sentido — *de frente = esperando, de perfil = en juego*.
 * - **`mundo.ts` tiene una sola pose en el aire y el atlas dos.** Se elige por el signo de `vy`:
 *   subiendo (`vy < 0`) es `salta`; en el vértice y bajando es `cae`. Es lo que ya anotó
 *   `atlas.test.ts` para esta tarea, y `cae` está dibujado derecho (`UX-27 §7`, `UX-29 §6`).
 * - **El perfil se dibuja mirando a la derecha** —así está en el atlas, y `UX-27 §7` dice que el
 *   otro lado se espeja y no se dibuja—, así que se espeja cuando `mira` es `-1`.
 * - **El cuadro que sigue a una vuelta va de frente** (`UX-29 §3`, fila 1: *"queda un cuadro en
 *   su pose de quieto, de frente"*). No lo decide el mundo, que ya lo puso en la entrada: lo pide
 *   la isla con `deFrente`, un cuadro de dibujo, y nada más.
 * - El cuadro de una animación sale de `mundo.tiempo`, el reloj de la partida: se congela al
 *   ganar, y dos cuerpos corriendo pisan igual.
 *
 * ## La sala, tile por tile (`CTR-16.10.8`)
 *
 * El aire no se dibuja: es el fondo del área, `--px-luz` liso (`UX-27 §1.1`), y lo pone la isla
 * como color de fondo del motor. La entrada tampoco: es aire, y lo que la muestra es el muñeco
 * parado ahí. La **caja** no se dibuja donde la grilla dice `n` —ahí arrancó— sino donde está
 * (`mundo.cajas`). Todo lo demás, un tile de `sala.v1` por celda, con el estado del mundo:
 * palanca activa o en reposo, placa pisada o libre, compuerta abierta o cerrada, tesoro que
 * todavía no se juntó.
 *
 * ## Todo en píxeles nativos y enteros (`ADR-08.3`, `UX-27 §2.1`)
 *
 * Las posiciones de los trazos son enteras siempre: el cuerpo se redondea, y la celda de 16 × 24
 * se apoya abajo y al centro de la caja de colisión de 10 × 20 (`CTR-15.3`). La escala al
 * teléfono la hace el motor con un entero; acá no hay ninguna.
 */

import type { JsonDelAtlas } from '../pixel/fuente.ts';
import { CUERPO_ALTO, CUERPO_ANCHO, PERSONAJES, TILE, poseDe, type Cuerpo, type Mundo, type Pose } from './mundo.ts';
import type { Banco, IdPersonaje, Nivel, Terreno } from './niveles.ts';

/** El atlas de la sala (`T-276`). Sube de versión con `src/arte/pixel/sala.txt` (`CTR-15.8`). */
export const ATLAS_DE_LA_SALA = 'sala.v1';

/** Dónde viven los atlas (`CTR-15.5`). Se piden por ruta, como cualquier archivo de `public/`. */
export const CARPETA_DE_SPRITES = '/sprites/';

/** Un nombre de atlas con su versión (`CTR-15.8`): `skayboy.v1`, nunca `skayboy`. */
export const NOMBRE_CON_VERSION = /^[a-z][a-z0-9-]*\.v[1-9][0-9]*$/;

/** La celda de un muñeco, en nativos (`CTR-15.3`): 16 × 24, la misma para los dos. */
export const CELDA_DE_PERSONAJE = { ancho: 16, alto: 24 } as const;

/** Las tres piezas que dibuja la isla: los dos muñecos y la sala. */
export type Pieza = IdPersonaje | 'sala';
export const PIEZAS: readonly Pieza[] = [...PERSONAJES, 'sala'];

/** Los cinco estados de un muñeco (`CTR-15.7`), los mismos para los dos. */
export const ESTADOS_DE_PERSONAJE = ['quieto', 'corre', 'salta', 'cae', 'enPausa'] as const;
export type EstadoDePersonaje = (typeof ESTADOS_DE_PERSONAJE)[number];

/** Los tiles de la sala que la escena puede pedir (`CTR-16.10.8`, `sala.test.ts`). */
export const TILES_DE_LA_SALA = [
  'solido',
  'molineteCielo',
  'molineteInfierno',
  'molineteDos',
  'tesoro',
  'puertaSkayboy',
  'puertaPoligirl',
  'palancaReposo',
  'palancaActiva',
  'placaLibre',
  'placaPisada',
  'compuertaCerrada',
  'compuertaAbierta',
  'caja',
] as const;
export type TileDeLaSala = (typeof TILES_DE_LA_SALA)[number];

/** Lo que la escena le pide a cada atlas. Un estado que falta en el JSON no arranca el juego. */
export const ESTADOS_QUE_PIDE: Readonly<Record<Pieza, readonly string[]>> = {
  skayboy: ESTADOS_DE_PERSONAJE,
  poligirl: ESTADOS_DE_PERSONAJE,
  sala: TILES_DE_LA_SALA,
};

/* =========================================================================================
   Qué nivel se juega
   ========================================================================================= */

/**
 * El nivel que juega la isla: **el primero sembrado**, salvo que se pida otro por id. La isla solo
 * pide en desarrollo (`?nivel=NIV-04`), porque es la única manera de mirar en el navegador las
 * palancas, placas, compuertas y cajas que el nivel 1 no tiene; en el build no pide nada y juega
 * el primero de los `listo`. Un id que el banco no sembró —o basura— no es un error: se juega el
 * primero, igual que sin pedido. Sin niveles, `undefined`, y queda el rótulo.
 */
export function nivelAJugar(niveles: readonly Nivel[], pedido: string | null): Nivel | undefined {
  const id = pedido?.trim().toUpperCase() ?? '';
  return (id === '' ? undefined : niveles.find((n) => n.id === id)) ?? niveles[0];
}

/* =========================================================================================
   Los nombres y las rutas
   ========================================================================================= */

/** Los problemas de un nombre de atlas contra `CTR-15.8`. Vacío es sano. */
export function problemasDelNombre(nombre: string): string[] {
  return NOMBRE_CON_VERSION.test(nombre)
    ? []
    : [`«${nombre}» no es un atlas con versión en el nombre (<pieza>.v<N>, CTR-15.8): se serviría viejo desde la caché`];
}

/** Qué atlas dibuja cada pieza: los muñecos, del banco; la sala, de `ATLAS_DE_LA_SALA`. */
export function atlasDe(banco: Banco): Readonly<Record<Pieza, string>> {
  const de = (id: IdPersonaje): string => {
    const p = banco.personajes.find((q) => q.id === id);
    if (p === undefined) throw new Error(`el banco no tiene a ${id} (CTR-16.3)`);
    return p.atlas;
  };
  return { skayboy: de('skayboy'), poligirl: de('poligirl'), sala: ATLAS_DE_LA_SALA };
}

/** La ruta de un archivo del atlas. **Sin versión en el nombre, no hay ruta**: tira. */
export function rutaDe(nombre: string, extension: 'png' | 'json'): string {
  const [problema] = problemasDelNombre(nombre);
  if (problema !== undefined) throw new Error(problema);
  return `${CARPETA_DE_SPRITES}${nombre}.${extension}`;
}

/* =========================================================================================
   El JSON del atlas (CTR-15.7)
   ========================================================================================= */

/** Cuántas columnas y filas tiene la grilla del atlas: una fila por estado, una columna por cuadro. */
export function grillaDelAtlas(json: Pick<JsonDelAtlas, 'animaciones'>): { columnas: number; filas: number } {
  const anims = Object.values(json.animaciones);
  return {
    columnas: Math.max(1, ...anims.map((a) => a.cuadros)),
    filas: Math.max(1, ...anims.map((a) => a.fila + 1)),
  };
}

/**
 * Los problemas de un JSON de atlas para esa pieza. Vacío es sano. La isla no arranca con uno
 * que tenga problemas — queda el rótulo impreso, que es lo honesto.
 */
export function problemasDelAtlas(pieza: Pieza, json: unknown): string[] {
  const j = json as Partial<JsonDelAtlas> | null;
  if (j === null || typeof j !== 'object') return [`${pieza}: el JSON del atlas no es un objeto`];
  const problemas: string[] = [];
  if (j.contrato !== 'CTR-15' || j.contratoVersion !== 1) {
    problemas.push(`${pieza}: el JSON dice ${String(j.contrato)} v${String(j.contratoVersion)}, y la isla lee CTR-15 v1`);
  }
  if (j.pieza !== pieza) problemas.push(`${pieza}: el JSON es de «${String(j.pieza)}»`);
  const celda = pieza === 'sala' ? { ancho: TILE, alto: TILE } : CELDA_DE_PERSONAJE;
  if (j.celda?.ancho !== celda.ancho || j.celda?.alto !== celda.alto) {
    problemas.push(`${pieza}: la celda es ${j.celda?.ancho}×${j.celda?.alto} y tiene que ser ${celda.ancho}×${celda.alto} nativos (CTR-15.3)`);
  }
  if (pieza !== 'sala' && (j.colision?.ancho !== CUERPO_ANCHO || j.colision?.alto !== CUERPO_ALTO)) {
    problemas.push(`${pieza}: la caja de colisión no es la de mundo.ts, ${CUERPO_ANCHO}×${CUERPO_ALTO} (CTR-15.3)`);
  }
  const anims = j.animaciones ?? {};
  for (const estado of ESTADOS_QUE_PIDE[pieza]) {
    const a = anims[estado];
    if (a === undefined) {
      problemas.push(`${pieza}: falta el estado «${estado}», y la escena lo pide`);
    } else if (!(Number.isInteger(a.fila) && a.fila >= 0 && Number.isInteger(a.cuadros) && a.cuadros >= 1 && a.porSegundo >= 0)) {
      problemas.push(`${pieza}: «${estado}» no tiene fila, cuadros o velocidad que se puedan dibujar`);
    }
  }
  return problemas;
}

/**
 * Los problemas del cuadro que el motor cortó del PNG: tiene que medir **la celda, a tamaño
 * nativo** (`CTR-15.6`: el atlas nunca se reescala en la carga; la escala la pone el dibujo).
 * Un PNG guardado a ×2 da cuadros de 32 × 48 y no entra.
 */
export function problemasDelCuadro(pieza: Pieza, json: Pick<JsonDelAtlas, 'celda'>, ancho: number, alto: number): string[] {
  return ancho === json.celda.ancho && alto === json.celda.alto
    ? []
    : [`${pieza}: el PNG corta cuadros de ${ancho}×${alto}, y la celda es ${json.celda.ancho}×${json.celda.alto} nativos (CTR-15.6)`];
}

/**
 * Qué cuadro del atlas dibuja ese estado en ese momento de la partida, como índice de la grilla
 * cortada de izquierda a derecha y de arriba abajo (fila × columnas + cuadro). Un estado que no
 * repite se queda en su último cuadro.
 */
export function cuadroDelAtlas(json: Pick<JsonDelAtlas, 'animaciones'>, estado: string, tiempo: number): number {
  const a = json.animaciones[estado];
  if (a === undefined) throw new Error(`el atlas no tiene el estado «${estado}»`);
  const { columnas } = grillaDelAtlas(json);
  const avance = a.porSegundo > 0 ? Math.floor(Math.max(0, tiempo) * a.porSegundo + 1e-9) : 0;
  const cuadro = a.repite ? avance % a.cuadros : Math.min(avance, a.cuadros - 1);
  return a.fila * columnas + cuadro;
}

/* =========================================================================================
   La escena
   ========================================================================================= */

/** Un trazo: un estado de un atlas, en una posición entera de píxel nativo, espejado o no. */
export interface Trazo {
  readonly pieza: Pieza;
  readonly estado: string;
  readonly x: number;
  readonly y: number;
  readonly espejo: boolean;
}

/**
 * El estado del atlas para un cuerpo, y si va espejado (la tabla de arriba). `deFrente` es el
 * cuadro que sigue a una vuelta (`UX-29 §3`): de frente aunque tenga un dedo encima.
 */
export function estadoDelCuerpo(c: Cuerpo, deFrente = false): { estado: EstadoDePersonaje; espejo: boolean } {
  const pose: Pose = deFrente ? 'frente' : poseDe(c);
  switch (pose) {
    case 'frente':
      return { estado: 'enPausa', espejo: false };
    case 'perfil-quieto':
      return { estado: 'quieto', espejo: c.mira < 0 };
    case 'perfil-corre':
      return { estado: 'corre', espejo: c.mira < 0 };
    case 'perfil-aire':
      return { estado: c.vy < 0 ? 'salta' : 'cae', espejo: c.mira < 0 };
  }
}

/**
 * Qué tile de la sala va en esa celda, o `null` si no se dibuja nada ahí. El `switch` es
 * exhaustivo contra `TipoDeTerreno`: un tipo nuevo no compila hasta que alguien decida con qué se
 * dibuja.
 */
export function tileDe(mundo: Mundo, t: Terreno | undefined, columna: number, fila: number): TileDeLaSala | null {
  if (t === undefined) return null;
  const en = (p: { readonly columna: number; readonly fila: number }) => p.columna === columna && p.fila === fila;
  switch (t.tipo) {
    case 'aire':
    case 'entrada':
      return null;
    case 'caja':
      // Ahí arrancó. La caja se dibuja donde está, desde `mundo.cajas`.
      return null;
    case 'solido':
      return 'solido';
    case 'molinete': {
      const devuelve = t.devuelve ?? [];
      if (devuelve.length > 1) return 'molineteDos';
      // Por elemento (`CTR-16.10`); sin él, el reparto de `UX-30 §3`: el cielo devuelve a Skayboy.
      const elemento = t.elemento ?? (devuelve[0] === 'skayboy' ? 'cielo' : 'infierno');
      return elemento === 'cielo' ? 'molineteCielo' : 'molineteInfierno';
    }
    case 'tesoro':
      return mundo.juntados.has(`${columna},${fila}`) ? null : 'tesoro';
    case 'puerta':
      // Cerrada siempre, también al ganar: `sala.v1` no tiene la puerta abierta. Es un hueco, no
      // una decisión — `UX-29 §8` dice que se abre y `CTR-16.4` que "se llega"; lo decide
      // `experiencia` (traspaso en `Docs/SUGERENCIAS/`, `T-278`).
      return t.de === 'poligirl' ? 'puertaPoligirl' : 'puertaSkayboy';
    case 'palanca':
      return mundo.palancas.find(en)?.activa === true ? 'palancaActiva' : 'palancaReposo';
    case 'placa':
      return mundo.placas.find(en)?.pisada === true ? 'placaPisada' : 'placaLibre';
    case 'compuerta': {
      const g = mundo.compuertas.find((q) => q.columna === columna && fila >= q.desdeFila && fila <= q.hastaFila);
      return g?.abierta === true ? 'compuertaAbierta' : 'compuertaCerrada';
    }
  }
}

/** La celda del muñeco (16 × 24) apoyada abajo y al centro de la caja de colisión, en enteros. */
export function celdaDelCuerpo(c: Cuerpo): { x: number; y: number } {
  return {
    x: Math.round(c.x + (CUERPO_ANCHO - CELDA_DE_PERSONAJE.ancho) / 2),
    y: Math.round(c.y + CUERPO_ALTO - CELDA_DE_PERSONAJE.alto),
  };
}

/**
 * Todo lo que se dibuja en un cuadro, en el orden en que se dibuja: la sala, las cajas, los dos
 * muñecos. `deFrente` son los que acaban de volver a la entrada (`UX-29 §3`).
 */
export function trazosDe(mundo: Mundo, deFrente: ReadonlySet<IdPersonaje> = new Set()): Trazo[] {
  const trazos: Trazo[] = [];
  const { banco, nivel } = mundo;
  nivel.grilla.forEach((renglon, fila) => {
    for (let columna = 0; columna < renglon.length; columna++) {
      const tile = tileDe(mundo, banco.leyenda[renglon[columna] ?? ''], columna, fila);
      if (tile !== null) trazos.push({ pieza: 'sala', estado: tile, x: columna * TILE, y: fila * TILE, espejo: false });
    }
  });
  for (const k of mundo.cajas) {
    trazos.push({ pieza: 'sala', estado: 'caja', x: Math.round(k.x), y: Math.round(k.y), espejo: false });
  }
  for (const id of PERSONAJES) {
    const c = mundo.cuerpos[id];
    const { estado, espejo } = estadoDelCuerpo(c, deFrente.has(id));
    trazos.push({ pieza: id, estado, ...celdaDelCuerpo(c), espejo });
  }
  return trazos;
}
