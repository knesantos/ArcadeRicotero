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
 * | *(ganado)*      | `baila` (4 cuadros, 8 por s)  | nunca: el atlas trae uno |
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
 * (`mundo.cajas`). Todo lo demás, un tile de la sala por celda, con el estado del mundo:
 * palanca activa o en reposo, placa pisada o libre, compuerta abierta o cerrada, tesoro que
 * todavía no se juntó, puerta cerrada o abierta. **El tesoro es de uno** desde `D-47`: la guitarra
 * de Skayboy (`tesoroSkayboy`) y el cigarrillo de Poligirl (`tesoroPoligirl`), elegidos por el dueño
 * que dice la leyenda (`para`) y no por el caracter, igual que la puerta. Al juntarlo, la celda
 * vuelve a ser aire en el mismo cuadro (`UX-33 §3.4`).
 *
 * ## Ganar (`UX-32`, `T-290`)
 *
 * **Lo único que cambia en la sala al ganar es la puerta, y cambia de forma.** Mientras
 * `mundo.terminado` es falso, cada puerta es la suya —`puertaSkayboy`, `puertaPoligirl`, con la
 * insignia calada en la hoja—; en el cuadro en que pasa a verdadero, **las dos** son
 * `puertaAbierta`, en el mismo cuadro, porque `terminado` es un solo booleano (`UX-32 §2.3`). Es
 * una sola abierta y no dos: la insignia vivía en la hoja, y sin hoja las dos puertas son el mismo
 * marco vacío (`sala.test.ts` lo cuenta). Quién llegó a cuál lo dice el muñeco parado adelante.
 *
 * **Y los dos muñecos bailan, cada uno el suyo** (`UX-33 §2`, `D-47` punto 3, `CTR-15.7`): en el
 * cuadro en que el mundo termina, los dos pasan a `baila`, con dedo o sin él —es el mismo forzado
 * que antes los ponía de frente (`UX-32 §3`), que `UX-33 §2.1` enmienda: nadie queda a mitad de un
 * salto—. **No se mueven de la celda**: el baile es un cambio de cuadro, la física no se entera. Y
 * como `mundo.tiempo` se congela al ganar, el cuadro del baile no sale de ahí sino del **tiempo
 * desde que se ganó**, con el reloj del motor: lo lleva una `Victoria` que la isla marca después de
 * cada tic (`marcarVictoria()`), y lo lee `relojDelTrazo()`. Con movimiento reducido, cuadro 0 fijo
 * (`ADR-08.8`). Los dos arrancan en el mismo cuadro y no hay desfase: lo que hace que no bailen el
 * mismo paso es el dibujo, no el reloj (`T-300`).
 *
 * **A dónde se sigue** lo contesta `siguienteAlGanar()`: el nivel que viene después en la fila —lo
 * que la página sembró, en orden de `id`: en producción, los `listo`—, y solo con el mundo ganado.
 * **En el último, el mismo toque lleva al primero de la fila.** El papel dice que ahí lleva a la
 * pieza compartible de `BR-27` (`BR-31` punto 1, `UX-33 §2.4`), que todavía no existe. Esconder el
 * botón dejaba el sexto en un callejón sin salida, contra `UX-33 §2.3` (el toque está desde el primer
 * cuadro de la victoria, en los seis). Volver a empezar no promete nada que no haya (`ADR-08.2`), y
 * es lo mismo que hace la fila al entrar con los seis pasados. El lector de pantalla oye además que
 * era el último (`avisoDelSuceso()`). **Y el control de seguir también vive acá**: `mostrarSeguir()`
 * dice si el botón se ve, `alTocarSeguir()` arma el mundo al que lleva el toque. La isla las llama
 * y pone el pegamento con el DOM.
 *
 * **Qué se lee al ganar** también: el aviso para el lector de pantalla (`avisoDelSuceso()`, con el
 * de la entrada y el de cada coleccionable) y el contador de lo que juntó cada uno, solo en la
 * victoria, en una capa de HTML encima del área (`UX-33 §2.5`): `contadorDeLaVictoria()` dice qué
 * texto y dónde, y `mostrarContador()` lo escribe.
 *
 * ## La fila (`CTR-16.11`, `US-09` criterio 9)
 *
 * **Al entrar se juega el primer nivel de la fila que no está pasado** en el avance guardado del
 * aparato (`avance.ts`), o el que se pidió en desarrollo con `?nivel=`, que le gana al avance. Con
 * los seis pasados, el primero otra vez: `CTR-16.11.2` devuelve "no queda ninguno" y no decide qué
 * se juega, y volver a empezar es lo único que no pide nada (`D-14`). Lo resuelve `nivelAJugar()`.
 *
 * ## Todo en píxeles nativos y enteros (`ADR-08.3`, `UX-27 §2.1`)
 *
 * Las posiciones de los trazos son enteras siempre: el cuerpo se redondea, y la celda de 16 × 24
 * se apoya abajo y al centro de la caja de colisión de 10 × 20 (`CTR-15.3`). La escala al
 * teléfono la hace el motor con un entero; acá no hay ninguna.
 */

import type { JsonDelAtlas } from '../pixel/fuente.ts';
import { SIN_AVANCE, siguienteDeLaFila, type Avance } from './avance.ts';
import { COLECCIONABLE, PANTALLA } from './copy.ts';
import {
  CUERPO_ALTO,
  CUERPO_ANCHO,
  PERSONAJES,
  TILE,
  crearMundo,
  juntadosPorPersonaje,
  poseDe,
  type Cuerpo,
  type Mundo,
  type Pose,
  type Suceso,
} from './mundo.ts';
import { duenoDelTesoro, tesorosDelNivel, type Banco, type IdPersonaje, type Nivel, type Terreno } from './niveles.ts';

/**
 * El atlas de la sala (`T-276`). Sube de versión con `src/arte/pixel/sala.txt` (`CTR-15.8`): la v2
 * suma la fila de `puertaAbierta` (`T-290`), y la v3 cambia el `tesoro` de los dos por la guitarra y
 * el cigarrillo, uno por dueño (`D-47`, `T-300`/`T-303`). Las viejas se quedan en `public/sprites/`
 * hasta que nada las pida — `CTR-15.8` no las borra en el mismo cambio.
 */
export const ATLAS_DE_LA_SALA = 'sala.v3';

/** Dónde viven los atlas (`CTR-15.5`). Se piden por ruta, como cualquier archivo de `public/`. */
export const CARPETA_DE_SPRITES = '/sprites/';

/** Un nombre de atlas con su versión (`CTR-15.8`): `skayboy.v1`, nunca `skayboy`. */
export const NOMBRE_CON_VERSION = /^[a-z][a-z0-9-]*\.v[1-9][0-9]*$/;

/** La celda de un muñeco, en nativos (`CTR-15.3`): 16 × 24, la misma para los dos. */
export const CELDA_DE_PERSONAJE = { ancho: 16, alto: 24 } as const;

/** Las tres piezas que dibuja la isla: los dos muñecos y la sala. */
export type Pieza = IdPersonaje | 'sala';
export const PIEZAS: readonly Pieza[] = [...PERSONAJES, 'sala'];

/** Los seis estados de un muñeco (`CTR-15.7`), los mismos para los dos. `baila` entró por `D-47`. */
export const ESTADOS_DE_PERSONAJE = ['quieto', 'corre', 'salta', 'cae', 'enPausa', 'baila'] as const;
export type EstadoDePersonaje = (typeof ESTADOS_DE_PERSONAJE)[number];

/** Los tiles de la sala que la escena puede pedir (`CTR-16.10.8`, `sala.test.ts`). */
export const TILES_DE_LA_SALA = [
  'solido',
  'molineteCielo',
  'molineteInfierno',
  'molineteDos',
  // Uno por dueño (`CTR-16.4` enmendado por `D-47`): la guitarra y el cigarrillo.
  'tesoroSkayboy',
  'tesoroPoligirl',
  'puertaSkayboy',
  'puertaPoligirl',
  'puertaAbierta',
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
 * El nivel que juega la isla al arrancar (`CTR-16.11.2`): **el primero de la fila que el avance no
 * tiene pasado**, salvo que se pida otro por id. La isla solo pide en desarrollo (`?nivel=NIV-04`),
 * porque es la única manera de mirar en el navegador un nivel sin ganar los de antes; en el build
 * no pide nada. **El pedido le gana al avance.** Un id que el banco no sembró —o basura— no es un
 * error: cuenta como sin pedido. Con los seis pasados, el primero otra vez (ver "La fila", arriba).
 * Sin niveles, `undefined`, y queda el rótulo.
 */
export function nivelAJugar(niveles: readonly Nivel[], pedido: string | null, avance: Avance = SIN_AVANCE): Nivel | undefined {
  const id = pedido?.trim().toUpperCase() ?? '';
  const pedida = id === '' ? undefined : niveles.find((n) => n.id === id);
  return pedida ?? siguienteDeLaFila(niveles, avance) ?? niveles[0];
}

/**
 * **A dónde lleva el toque de seguir** (`UX-32 §5`, `US-09` criterio 1): con el mundo ganado, el
 * nivel que sigue al que se jugó **en lo sembrado** —en producción, solo los `listo`; un borrador
 * del medio no se salta a mano, ya no está—. Sin ganar, `undefined`: no hay nada que seguir. **En
 * el último, el primero de la fila**: la pieza compartible de `BR-27`, que es a donde el papel
 * manda ese toque, no existe todavía, y un sexto sin toque es un callejón (ver "Ganar", arriba). Un
 * nivel que no está en lo sembrado no sigue a ninguno: `undefined`.
 */
export function siguienteAlGanar(mundo: Mundo, niveles: readonly Nivel[]): Nivel | undefined {
  if (!mundo.terminado) return undefined;
  const i = niveles.findIndex((n) => n.id === mundo.nivel.id);
  if (i < 0) return undefined;
  return niveles[i + 1] ?? niveles[0];
}

/**
 * Si el nivel de este mundo es **el último de la fila sembrada** (`BR-31` punto 1): el que, ganado,
 * ya no tiene un siguiente. Un nivel que no está sembrado no es el último de nada.
 */
export function esElUltimo(mundo: Mundo, niveles: readonly Nivel[]): boolean {
  return niveles.length > 0 && niveles[niveles.length - 1]!.id === mundo.nivel.id;
}

/*
 * El control de seguir vive acá y no en la isla (`T-290`, el hallazgo de su verificación): la isla
 * no se puede cargar en Node, y lo que decide si el botón se ve y a qué mundo lleva el toque es
 * justo lo que hay que ver en rojo. La isla se queda con el pegamento —buscar el botón, soltar las
 * teclas, devolver el foco— y `escena.test.ts` vigila que llame a estas dos donde tiene que.
 */

/** Lo único del botón de seguir que toca la escena: si está escondido. */
export interface BotonDeSeguir {
  hidden: boolean;
}

/** Si el toque para seguir tiene que verse: ganado, y en un nivel sembrado. En el sexto también. */
export function seguirVisible(mundo: Mundo, niveles: readonly Nivel[]): boolean {
  return siguienteAlGanar(mundo, niveles) !== undefined;
}

/**
 * Pone el botón como tiene que estar con este mundo. La isla lo llama **después de cada
 * `jugarTic(`**, así que en el tic en que se gana el botón ya es tocable (`D-32` límite 3), y
 * apenas se sigue vuelve a esconderse. Solo escribe si cambia: el DOM no se toca sesenta veces
 * por segundo. Sin botón en la página no hace nada.
 */
export function mostrarSeguir(boton: BotonDeSeguir | null, mundo: Mundo, niveles: readonly Nivel[]): void {
  if (boton === null) return;
  const esconder = !seguirVisible(mundo, niveles);
  if (boton.hidden !== esconder) boton.hidden = esconder;
}

/**
 * **Lo que hace el toque de seguir** (`UX-32 §5`): con el mundo ganado, el mundo del nivel que
 * sigue, recién armado —el mismo que arma la isla al arrancar ese nivel; en el último, el primero
 * de la fila—, y `deFrente` vacío: nadie arranca el nivel nuevo con el cuadro de frente del viejo.
 * Sin ganar, `undefined` y no toca nada: un toque que no debería haber llegado no cambia el juego.
 */
export function alTocarSeguir(mundo: Mundo, niveles: readonly Nivel[], deFrente: Set<IdPersonaje>): Mundo | undefined {
  const siguiente = siguienteAlGanar(mundo, niveles);
  if (siguiente === undefined) return undefined;
  deFrente.clear();
  return crearMundo(mundo.banco, siguiente);
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
    case 'tesoro': {
      // Por el dueño, como la puerta por `de`; juntado, es aire en el mismo cuadro (`UX-33 §3.4`).
      const dueno = duenoDelTesoro(t);
      if (dueno === null || mundo.juntados.has(`${columna},${fila}`)) return null;
      return dueno === 'poligirl' ? 'tesoroPoligirl' : 'tesoroSkayboy';
    }
    case 'puerta':
      // Se abre en la imagen, nunca en la física (`UX-32 §6`): `mundo.ts` no le da estado a una
      // puerta; la condición es que los dos llegaron, y con eso las dos cambian en el mismo cuadro.
      if (mundo.terminado) return 'puertaAbierta';
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

/**
 * El estado de los dos muñecos con el mundo ganado (`UX-33 §2.1`, `CTR-15.7`): `baila`, y sin
 * espejo, porque el atlas trae un solo sentido. No es una pose de `poseDe()`: el mundo no baila, lo
 * dibuja la escena.
 */
export const AL_GANAR: { readonly estado: EstadoDePersonaje; readonly espejo: boolean } = Object.freeze({
  estado: 'baila',
  espejo: false,
});

/** La celda del muñeco (16 × 24) apoyada abajo y al centro de la caja de colisión, en enteros. */
export function celdaDelCuerpo(c: Cuerpo): { x: number; y: number } {
  return {
    x: Math.round(c.x + (CUERPO_ANCHO - CELDA_DE_PERSONAJE.ancho) / 2),
    y: Math.round(c.y + CUERPO_ALTO - CELDA_DE_PERSONAJE.alto),
  };
}

/**
 * Todo lo que se dibuja en un cuadro, en el orden en que se dibuja: la sala, las cajas, los dos
 * muñecos. `deFrente` son los que acaban de volver a la entrada (`UX-29 §3`). Con el mundo ganado
 * **bailan los dos**, con dedo o sin él, sin espejo y en su lugar (`UX-33 §2.1` y `§2.2`).
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
    const { estado, espejo } = mundo.terminado ? AL_GANAR : estadoDelCuerpo(c, deFrente.has(id));
    trazos.push({ pieza: id, estado, ...celdaDelCuerpo(c), espejo });
  }
  return trazos;
}

/* =========================================================================================
   La victoria: el reloj del baile (`CTR-15.7`, `UX-33 §2.2` y `§2.3`)
   ========================================================================================= */

/**
 * **El reloj del baile.** `mundo.tiempo` se congela al ganar (`mundo.ts`), así que con él el baile
 * quedaría quieto en el cuadro 0. Este es un reloj de dibujo aparte, con el tiempo del motor: no toca
 * el paso fijo (`ADR-09.1`) ni la traza (`CTR-18`). `ganadoEn` es cuándo se ganó, y `ahora`, el
 * último tic; los dos en segundos del motor.
 */
export interface Victoria {
  ganadoEn: number | null;
  ahora: number;
}

export function crearVictoria(): Victoria {
  return { ganadoEn: null, ahora: 0 };
}

/**
 * La isla la llama **después de cada `jugarTic(`**, con el reloj del motor. Anota cuándo se ganó, y
 * **devuelve `true` en un solo tic: el del cuadro en que el mundo pasó a `terminado`**. Es el tic en
 * que la isla guarda el avance (`CTR-16.11.1`: *"en el cuadro en que el mundo marca `terminado`"*,
 * no al tocar Seguí). Con un mundo sin ganar —el del nivel que sigue, recién armado— suelta la
 * victoria anterior, así el baile del próximo arranca en su cuadro 0.
 */
export function marcarVictoria(victoria: Victoria, mundo: Mundo, ahora: number): boolean {
  victoria.ahora = ahora;
  if (!mundo.terminado) {
    victoria.ganadoEn = null;
    return false;
  }
  if (victoria.ganadoEn !== null) return false;
  victoria.ganadoEn = ahora;
  return true;
}

/**
 * El tiempo con que se elige el cuadro de un trazo (`cuadroDelAtlas()`): **el de la partida para
 * todo, menos para el baile**, que cuenta desde que se ganó. Con movimiento reducido el baile queda
 * **en el cuadro 0**, fijo (`CTR-15.7`, `ADR-08.8` vara 1): es el primer movimiento del juego que
 * la persona no pidió con un dedo. El cuadro 0 se dibujó para leerse solo como festejo (`T-300`).
 */
export function relojDelTrazo(trazo: Pick<Trazo, 'estado'>, mundo: Mundo, victoria: Victoria, reducido: boolean): number {
  if (trazo.estado !== AL_GANAR.estado) return mundo.tiempo;
  if (reducido || victoria.ganadoEn === null) return 0;
  return Math.max(0, victoria.ahora - victoria.ganadoEn);
}

/**
 * **Si la persona pidió menos movimiento**, leído de lo que devuelve
 * `matchMedia('(prefers-reduced-motion: reduce)')` (`ADR-08.8` vara 1). Solo un `matches` que es
 * `true` de verdad cuenta: sin `matchMedia` (`null`), o con cualquier otra cosa, el baile se mueve.
 * Vive acá y no en la isla para que dar vuelta la condición haga caer un test (la verificación de
 * `T-302`: con `!==` el baile quedaba quieto para todos y se movía para quien pidió que no).
 */
export function pidioMenosMovimiento(preferencia: { readonly matches: unknown } | null | undefined): boolean {
  return preferencia?.matches === true;
}

/* =========================================================================================
   Lo que se lee: los avisos y el contador (`CNT-22`, `UX-33 §2.5`)
   ========================================================================================= */

/**
 * **Qué dice el lector de pantalla con cada suceso**, o `null` si calla. Registro 3: nombra el
 * lugar, el hecho o el objeto, nunca a la persona (`UX-29 §5`, `CNT-22`).
 *
 * - `vuelta`: el de la entrada (`CNT-18`);
 * - `tesoro`: el objeto de quien lo levantó, la guitarra o el cigarrillo (`CNT-22 §5`);
 * - `puerta`, que es ganar: el de las dos puertas (`CNT-22 §2`). **En el último** (`ultimo`, de
 *   `esElUltimo()`), además, que era el último: la primera oración de `CNT-22 §3`, sin la segunda,
 *   porque todavía no hay nada que compartir (`copy.ts`). El toque ahí vuelve al primero, y quien no
 *   ve la pantalla tiene que saber por qué el próximo es el 1;
 * - el salto y la compuerta, nada: se ven.
 */
export function avisoDelSuceso(suceso: Suceso, ultimo: boolean): string | null {
  switch (suceso.tipo) {
    case 'vuelta':
      return PANTALLA.avisoEntrada;
    case 'tesoro':
      return suceso.quien === 'poligirl' ? COLECCIONABLE.avisoCigarrillo : COLECCIONABLE.avisoGuitarra;
    case 'puerta':
      return ultimo ? `${PANTALLA.avisoVictoria} ${PANTALLA.avisoUltimo}` : PANTALLA.avisoVictoria;
    case 'salto':
    case 'compuerta':
      return null;
  }
}

/**
 * **El texto del contador de uno** (`CNT-22 §4`): el número y la palabra de su objeto, en singular
 * con uno y en plural con cualquier otro (`1 guitarra`, `0 cigarrillos`, `2 guitarras`). De uno
 * solo: el del otro va en su propia etiqueta, al lado del otro. Sin comparación (`BR-27` punto 2).
 */
export function textoDelContador(quien: IdPersonaje, cuantos: number): string {
  const [uno, varios] =
    quien === 'poligirl' ? [COLECCIONABLE.cigarrillo, COLECCIONABLE.cigarrillos] : [COLECCIONABLE.guitarra, COLECCIONABLE.guitarras];
  return `${cuantos} ${cuantos === 1 ? uno : varios}`;
}

/**
 * **La caja de una etiqueta del contador, en píxeles nativos del área** (`UX-33 §2.5`). Es fija, y
 * no una estimación del texto: la hoja le da a cada etiqueta este ancho y este alto en porcentajes
 * del área, y la letra en unidades del contenedor (`cqw`), así que a ×1, a ×2 o en la pantalla
 * completa la etiqueta ocupa **la misma porción del área**. Por eso lo que se prueba acá en Node es
 * lo que se ve: sin esto, a ×1 dos etiquetas de 90 px CSS sobre un área de 240 se pisaban en tres
 * de los seis niveles (la verificación de `T-302`).
 *
 * - `ancho`: entra «2 CIGARRILLOS», el texto más largo que hay, con aire (se mide en el navegador).
 * - `alto`: una línea de la rotulada.
 * - `aire`: lo mínimo que separa dos etiquetas, para que no se lean como una sola.
 */
export const ETIQUETA_DEL_CONTADOR = Object.freeze({ ancho: 96, alto: 16, aire: 2 });

/** Un rectángulo en píxeles nativos del área, con la esquina de arriba a la izquierda. */
export interface Caja {
  readonly x: number;
  readonly y: number;
  readonly ancho: number;
  readonly alto: number;
}

/** Si dos cajas se tocan, con `aire` de margen: separadas por menos que eso cuentan como cruzadas. */
export function seCruzan(a: Caja, b: Caja, aire = 0): boolean {
  return a.x < b.x + b.ancho + aire && b.x < a.x + a.ancho + aire && a.y < b.y + b.alto + aire && b.y < a.y + a.alto + aire;
}

/*
 * Dónde puede ir una etiqueta respecto de su muñeco, **en orden de preferencia**, con su costo.
 *
 * - Para el costado: primero **hacia el centro del área** (así el que está en la puerta de una punta
 *   no la saca afuera), después **hacia afuera**, y por último centrada sobre él. Siempre tapa la
 *   columna del muñeco: es la suya, no una que anda suelta.
 * - Para la altura: **arriba de la cabeza**; si no, **abajo de los pies**; y si tampoco, un renglón
 *   más arriba o más abajo. Cambiar de altura cuesta más que cambiar de costado: la etiqueta encima
 *   de la cabeza es la que se lee como de ese muñeco sin pensarlo.
 * - Y si nada de eso entra, **al costado de la cabeza** (`ubicarEtiquetas()`).
 */
const COSTADOS = [
  ['alCentro', 0],
  ['afuera', 1],
  ['centrada', 2],
] as const;
const ALTURAS = [
  ['arriba', 0],
  ['abajo', 10],
  ['arriba2', 20],
  ['abajo2', 30],
] as const;
type Costado = (typeof COSTADOS)[number][0];
type Altura = (typeof ALTURAS)[number][0];

/** La caja de una etiqueta con ese costado y esa altura, o `null` si no entra en el área. */
function cajaDeEtiqueta(celda: { x: number; y: number }, costado: Costado, altura: Altura, area: { ancho: number; alto: number }): Caja | null {
  const { ancho, alto, aire } = ETIQUETA_DEL_CONTADOR;
  if (ancho > area.ancho) return null;
  const haciaLaDerecha = celda.x + CELDA_DE_PERSONAJE.ancho / 2 < area.ancho / 2;
  const desdeLaIzquierda = costado === 'alCentro' ? haciaLaDerecha : !haciaLaDerecha;
  const suelta =
    costado === 'centrada'
      ? celda.x + (CELDA_DE_PERSONAJE.ancho - ancho) / 2
      : desdeLaIzquierda
        ? celda.x
        : celda.x + CELDA_DE_PERSONAJE.ancho - ancho;
  // Contra el borde del área, se corre hasta entrar: nunca se sale por un costado.
  const x = Math.min(Math.max(suelta, 0), area.ancho - ancho);
  const y =
    altura === 'arriba'
      ? celda.y - alto
      : altura === 'abajo'
        ? celda.y + CELDA_DE_PERSONAJE.alto
        : altura === 'arriba2'
          ? celda.y - 2 * alto - aire
          : celda.y + CELDA_DE_PERSONAJE.alto + alto + aire;
  if (y < 0 || y + alto > area.alto) return null;
  return { x, y, ancho, alto };
}

/**
 * **Dónde va cada etiqueta, sin que se crucen** (`UX-33 §2.5`, la verificación de `T-302`). Busca,
 * entre todas las combinaciones de costado y altura de las dos, la más barata en la que:
 *
 * 1. las dos etiquetas quedan adentro del área;
 * 2. **no se cruzan**, con `aire` de por medio;
 * 3. **ninguna tapa al otro muñeco**: una etiqueta encima del otro se lee como del otro.
 *
 * `con` dice quién lleva etiqueta; el que no, igual cuenta como muñeco que no se tapa. Si ninguna
 * combinación cumple las tres —dos muñecos encimados contra un techo, que ninguna puerta de hoy
 * produce—, se queda con la preferida de cada uno que entre en el área: mejor pisada que afuera.
 */
export function ubicarEtiquetas(
  celdas: Readonly<Record<IdPersonaje, { x: number; y: number }>>,
  con: Readonly<Record<IdPersonaje, boolean>>,
  area: { ancho: number; alto: number },
): Record<IdPersonaje, Caja | null> {
  const opciones = (id: IdPersonaje): { caja: Caja | null; costo: number }[] => {
    if (!con[id]) return [{ caja: null, costo: 0 }];
    const lista: { caja: Caja | null; costo: number }[] = [];
    for (const [altura, porAltura] of ALTURAS) {
      for (const [costado, porCostado] of COSTADOS) {
        const caja = cajaDeEtiqueta(celdas[id], costado, altura, area);
        if (caja !== null) lista.push({ caja, costo: porAltura + porCostado });
      }
    }
    // Lo último: al costado de la cabeza, sin tapar la columna. Es para cuando arriba y abajo están
    // ocupados por el otro muñeco (uno parado en una cornisa justo encima del otro).
    const { x, y } = celdas[id];
    const { ancho, aire } = ETIQUETA_DEL_CONTADOR;
    const haciaLaDerecha = x + CELDA_DE_PERSONAJE.ancho / 2 < area.ancho / 2;
    const derecha = { x: x + CELDA_DE_PERSONAJE.ancho + aire, y, ancho, alto: ETIQUETA_DEL_CONTADOR.alto };
    const izquierda = { ...derecha, x: x - ancho - aire };
    for (const [caja, costo] of [
      [derecha, haciaLaDerecha ? 40 : 41],
      [izquierda, haciaLaDerecha ? 41 : 40],
    ] as const) {
      if (caja.x >= 0 && caja.x + caja.ancho <= area.ancho && caja.y >= 0 && caja.y + caja.alto <= area.alto) lista.push({ caja, costo });
    }
    return lista;
  };
  const celda = (id: IdPersonaje): Caja => ({ x: celdas[id].x, y: celdas[id].y, ...CELDA_DE_PERSONAJE });
  const tapa = (caja: Caja | null, otro: IdPersonaje): boolean => caja !== null && seCruzan(caja, celda(otro));
  const deSkay = opciones('skayboy');
  const dePoli = opciones('poligirl');
  let mejor: { skayboy: Caja | null; poligirl: Caja | null; costo: number } | null = null;
  for (const s of deSkay) {
    if (tapa(s.caja, 'poligirl')) continue;
    for (const p of dePoli) {
      if (tapa(p.caja, 'skayboy')) continue;
      if (s.caja !== null && p.caja !== null && seCruzan(s.caja, p.caja, ETIQUETA_DEL_CONTADOR.aire)) continue;
      const costo = s.costo + p.costo;
      if (mejor === null || costo < mejor.costo) mejor = { skayboy: s.caja, poligirl: p.caja, costo };
    }
  }
  if (mejor !== null) return { skayboy: mejor.skayboy, poligirl: mejor.poligirl };
  return { skayboy: deSkay[0]?.caja ?? null, poligirl: dePoli[0]?.caja ?? null };
}

/**
 * Una etiqueta del contador: qué dice y **qué caja ocupa, en porcentajes del área** —la esquina de
 * arriba a la izquierda, el ancho y el alto—, así la misma cuenta vale en el mueble a ×1 o ×2 y en
 * la pantalla completa a cualquier escala (`UX-33 §1.3`). La caja la elige `ubicarEtiquetas()`.
 */
export interface EtiquetaDelContador {
  readonly texto: string;
  readonly x: number;
  readonly y: number;
  readonly ancho: number;
  readonly alto: number;
}

/**
 * **El contador, solo en la victoria** (`UX-33 §2.5`, `BR-31` punto 2): sin ganar, `null`, porque
 * durante la partida no hay contador, ni adentro ni afuera del área. Ganado, una etiqueta por
 * personaje con lo que **ese** juntó en este nivel (`juntadosPorPersonaje()`), junto a él, y sin
 * cruzarse con la del otro (`ubicarEtiquetas()`). Si el nivel no le trae ninguno, su etiqueta es
 * `null`: un cero donde no había nada que juntar es ruido.
 */
export function contadorDeLaVictoria(mundo: Mundo): Readonly<Record<IdPersonaje, EtiquetaDelContador | null>> | null {
  if (!mundo.terminado) return null;
  const { banco, nivel } = mundo;
  const juntados = juntadosPorPersonaje(mundo);
  const trae = tesorosDelNivel(banco, nivel);
  const area = {
    ancho: Math.max(1, ...nivel.grilla.map((r) => r.length)) * TILE,
    alto: Math.max(1, nivel.grilla.length) * TILE,
  };
  const cajas = ubicarEtiquetas(
    { skayboy: celdaDelCuerpo(mundo.cuerpos.skayboy), poligirl: celdaDelCuerpo(mundo.cuerpos.poligirl) },
    { skayboy: trae.skayboy > 0, poligirl: trae.poligirl > 0 },
    area,
  );
  const etiqueta = (id: IdPersonaje): EtiquetaDelContador | null => {
    const caja = cajas[id];
    if (caja === null) return null;
    return {
      texto: textoDelContador(id, juntados[id]),
      x: (caja.x / area.ancho) * 100,
      y: (caja.y / area.alto) * 100,
      ancho: (caja.ancho / area.ancho) * 100,
      alto: (caja.alto / area.alto) * 100,
    };
  };
  return { skayboy: etiqueta('skayboy'), poligirl: etiqueta('poligirl') };
}

/** Lo que `mostrarContador()` le toca a un nodo: un `HTMLElement` lo cumple tal cual. */
export interface NodoDelContador {
  hidden: boolean;
  textContent: string | null;
  readonly style: { setProperty(nombre: string, valor: string): void };
  readonly dataset: Record<string, string | undefined>;
}

/** La capa del contador: el contenedor, y una etiqueta por personaje. */
export interface CapaDelContador {
  readonly capa: NodoDelContador;
  readonly etiquetas: Readonly<Record<IdPersonaje, NodoDelContador>>;
}

/** Las cuatro propiedades CSS con que la hoja ubica cada etiqueta, en el orden de la caja. */
export const PROPIEDADES_DEL_CONTADOR = ['--contador-x', '--contador-y', '--contador-ancho', '--contador-alto'] as const;

/**
 * Pone la capa como tiene que estar con este mundo. La isla la llama **después de cada `jugarTic(`**,
 * al lado de `mostrarSeguir()`: en el tic en que se gana, el contador aparece; con el mundo del
 * nivel que sigue, se va. **Solo escribe lo que cambia**: el DOM no se toca sesenta veces por
 * segundo. La caja va en cuatro propiedades CSS de cada etiqueta (`PROPIEDADES_DEL_CONTADOR`), en
 * porcentajes del área, y la hoja hace el resto. Sin capa en la página no hace nada.
 */
export function mostrarContador(capa: CapaDelContador | null, mundo: Mundo): void {
  if (capa === null) return;
  const contador = contadorDeLaVictoria(mundo);
  const esconder = contador === null;
  if (capa.capa.hidden !== esconder) capa.capa.hidden = esconder;
  if (contador === null) return;
  for (const id of PERSONAJES) {
    const nodo = capa.etiquetas[id];
    const e = contador[id];
    if (nodo.hidden !== (e === null)) nodo.hidden = e === null;
    if (e === null) continue;
    if (nodo.textContent !== e.texto) nodo.textContent = e.texto;
    const valores = [e.x, e.y, e.ancho, e.alto].map((v) => `${v.toFixed(3)}%`);
    const ancla = valores.join(' ');
    if (nodo.dataset.ancla !== ancla) {
      PROPIEDADES_DEL_CONTADOR.forEach((nombre, i) => nodo.style.setProperty(nombre, valores[i]!));
      nodo.dataset.ancla = ancla;
    }
  }
}
