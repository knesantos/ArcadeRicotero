/**
 * El solucionador de Skayboy y Poligirl (`T-266`): **una máquina que juega sola**, sobre la
 * misma simulación que corre en el teléfono.
 *
 * ## Para qué existe
 *
 * `BR-25` pide, por cada nivel, que se pase solo, que ninguna acción pida dos dedos a la vez
 * y que el que espera quede a salvo. Hasta acá, las tres cosas las probaba una persona con
 * un teléfono, y seis niveles son doce partidas cada vez que alguien afina la gravedad
 * (`ORQ-plan-ciclo-16.md §0`). Este módulo las prueba buscando: encuentra la **traza** —qué
 * teclas, cuadro por cuadro— con la que una persona sola termina el nivel, la repite entera
 * con `repetir()` para ver que gana de verdad, y la **ensancha** hasta que cada tecla tenga
 * margen (`robustecer()`). Al teléfono le queda lo que solo un pulgar sabe: si se siente bien.
 *
 * ## Qué prueba de `BR-25`, y cómo
 *
 * - **(b) se pasa solo**: `resolverSolo()` devuelve la traza de una persona, o contesta que
 *   no la hay dentro de su presupuesto.
 * - **(c) nada pide dos dedos a la vez**: en la traza de uno, cada cuadro tiene teclas en una
 *   columna como mucho. No se revisa después: la búsqueda no sabe generar otra cosa.
 * - **(d) el que espera no se pierde**: la búsqueda cambia de columna **solo con los dos en el
 *   piso** (`enElPiso()`) **y la sala quieta** —ninguna caja andando, regla 11 de `CTR-18.6`—.
 *   El que queda esperando está apoyado y con `QUIETO` no se mueve ni un píxel, así que si el
 *   nivel lo obligara a esperar en el aire o encima de algo que lo devuelve, la traza no
 *   existiría: la prueba es por construcción (`§2.1`). Y como el piso no alcanza —una entrada
 *   dibujada en el aire arrancaba con `enSuelo` en `true` antes de `E8`—, la búsqueda descarta
 *   además toda jugada en la que el que espera termina un cuadro en otro lugar (`CTR-18.6`
 *   regla 7), y toda jugada en la que una caja tiene que esperar a alguien (regla 11). Y encima
 *   se verifica, porque una prueba por construcción también se rompe: ninguna vuelta del que no
 *   tiene un dedo encima, el que espera no se mueve, y las cajas no corren carreras.
 * - **(a) de a dos**: `resolverDeADos()` da una traza con las dos columnas a la vez. **Se mide
 *   y no se graba** (`CTR-18.4`): su duración mínima es la mitad de la pregunta de cuánto dura
 *   un nivel, y que dos personas lo hagan sin chocarse los dedos es del teléfono (`BR-29`).
 *
 * ## Quién lo usa
 *
 * `scripts/resolver-niveles.mjs`, que graba la traza de uno en `skayboy-soluciones.json` con el
 * formato de `CTR-18` (`T-267`); `T-272`, que le suma los mecanismos al mundo; y `T-277`, que
 * diseña los cinco niveles con esto en la mano (`§6` riesgo 3). **La isla y las páginas no lo
 * importan** (`CTR-18.11`): lo vigila la regla 10 de `soluciones.test.ts`.
 *
 * ## Lo que se mudó, y lo que queda
 *
 * `CTR-18.11` reparte así, y `T-267` lo cumplió: **acá quedan la búsqueda y el ensanchado**; la
 * traza como mandos, el renglón, la repetición (`repetir()`, `exigirTraza()`), la foto del mundo,
 * la tolerancia y la paridad viven en **`soluciones.ts`**, para que el test, el script y esto usen
 * la misma función y den el mismo número. El paso de la búsqueda es `CUADRO_SEG`, de `mundo.ts`:
 * el mismo que juega la isla.
 *
 * ## Lo que no importa
 *
 * Nada de `node:*`, nada del motor, nada del DOM: lo mismo que `mundo.ts` (`CTR-16.8`). Lo
 * corre `node --test` y lo corre el script. El único reloj es el del presupuesto de tiempo, y
 * entra por parámetro para que la prueba lo pueda fingir.
 */

import {
  CUADRO_SEG,
  CUERPO_ALTO,
  CUERPO_ANCHO,
  PERDON_TARDE_SEG,
  PERSONAJES,
  QUIETO,
  SUBPASO_SEG,
  TILE,
  VELOCIDAD,
  algunaCajaAnda,
  crearMundo,
  paso,
  type Caja,
  type Cuerpo,
  type Mando,
  type Mandos,
  type Mundo,
  type Suceso,
} from './mundo.ts';
import { posicionDe, type Banco, type IdPersonaje, type Nivel } from './niveles.ts';
import {
  TOPE_TOLERANCIA,
  claveDeMecanismos,
  clonarMundo,
  columnasConTeclas,
  compactar,
  conTecla,
  enElPiso,
  exigirTraza,
  expandir,
  idDeBorde,
  medirTolerancia,
  queEspera,
  recortar,
  repetir,
  tolerancia,
  tramoCorrido,
  type Borde,
  type Modo,
  type Repeticion,
  type Tolerancia,
  type Traza,
} from './soluciones.ts';

/* =========================================================================================
   1. Los números de la búsqueda
   ========================================================================================= */

/**
 * Hasta dónde se **ensancha** una traza antes de grabarla, en cuadros: medio segundo.
 * `ADR-09.5` deja ese tope en manos de `T-266`. Cada cuadro de holgura se paga con un cuadro
 * más de traza —corriendo contra la pared, sosteniendo el salto—, y el piso más alto que pide
 * `BR-29` es 10 cuadros, en Fácil: treinta es el triple.
 */
export const HOLGURA = 30;

/**
 * Cuánto dura una jugada de la búsqueda, en cuadros.
 *
 * **Cuatro, y una sola duración.** El plan sugería 4, 8 y 16, y mezclarlos no suma nada: una
 * jugada de 8 es exactamente dos de 4 con la misma acción —el salto va solo en el primer
 * cuadro, así que la segunda mitad es la acción sin salto—, y una de 16 son cuatro. Las largas
 * no llegan a ningún estado nuevo; solo agregan hijos repetidos, y con A* todo nodo por debajo
 * del costo óptimo se expande igual.
 *
 * Lo que sí cambia algo es el largo único, y se midió sobre una sala de 15 × 9 con dos
 * subidas: con 2 cuadros, 6.046 nodos y la de uno en 124 cuadros; con 4, 2.301 y 128; con 8,
 * 648 y 136; con 16, 145 y 142. La tolerancia robustecida dio 5 en los cuatro. En 4 la traza
 * casi no se alarga y la búsqueda ya es barata. `cuadrosPorJugada` lo cambia.
 */
export const CUADROS_POR_JUGADA = 4;

/** Un mando de una columna. La traza como mandos vive en `soluciones.ts`; esto es para armar jugadas. */
function mando(izquierda: boolean, derecha: boolean, saltar: boolean): Mando {
  return { izquierda, derecha, saltar };
}

/* =========================================================================================
   2. El estado: qué es "el mismo lugar" para la búsqueda
   ========================================================================================= */

/** px/s. La velocidad vertical entra a la clave en cubos: dos cuadros de gravedad cada uno. */
const CUBO_VY = 30;
/** En subpasos: pasado el perdón tarde, cuánto hace que dejó el piso ya no cambia nada. */
const TOPE_AIRE = Math.round(PERDON_TARDE_SEG / SUBPASO_SEG) + 1;

/**
 * Qué hace la búsqueda con cada campo del cuerpo. **Está escrito como tipo a propósito**: si
 * `mundo.ts` le suma un campo a `Cuerpo`, esto deja de compilar hasta que alguien decida si
 * va a la clave o no, y `solucionador.test.ts` lo repite en tiempo de ejecución.
 */
export const CAMPOS_DEL_CUERPO: Readonly<Record<keyof Cuerpo, string>> = {
  id: 'fuera: no cambia nunca',
  x: 'en la clave, redondeada al píxel nativo',
  y: 'en la clave, redondeada al píxel nativo',
  vx: 'fuera: paso() la pisa con el mando antes de usarla',
  vy: `en la clave, en cubos de ${CUBO_VY} px/s`,
  enSuelo: 'en la clave',
  mira: 'fuera: solo decide hacia dónde se dibuja',
  conDedo: 'fuera: paso() la pone con el mando de cada cuadro',
  enPuerta: 'fuera: sale de la posición y de enSuelo',
  desdeElSuelo: 'en la clave, solo en el aire y mientras el perdón tarde puede servir',
  saltoGuardado: 'en la clave, en subpasos',
  saltoApretado: 'en la clave',
  yaSalto: 'en la clave, solo en el aire',
};

/** Lo mismo para el mundo entero. */
export const CAMPOS_DEL_MUNDO: Readonly<Record<keyof Mundo, string>> = {
  banco: 'compartido: no cambia',
  nivel: 'compartido: no cambia',
  cuerpos: 'en la clave, con claveDeCuerpo()',
  juntados: 'en la clave',
  palancas: 'en la clave: activa o en reposo',
  placas: 'en la clave: pisada o libre',
  compuertas: 'en la clave, en su estado real y no el mandato (CTR-16.10.11)',
  cajas: 'en la clave, con claveDeCaja()',
  tiempo: 'fuera: es el costo, no el lugar',
  terminado: 'fuera: es la meta',
};

/**
 * Y para cada caja (`CTR-16.10.11`: *"la celda de cada caja, con si se está moviendo"*). Una caja
 * quieta es su celda; una que anda, además, cuánto le falta —la posición al píxel, como un
 * cuerpo—, porque dos cajas en la misma celda de destino pero en otro punto del tramo no tienen
 * el mismo futuro.
 */
export const CAMPOS_DE_LA_CAJA: Readonly<Record<keyof Caja, string>> = {
  x: 'en la clave, redondeada al píxel nativo',
  y: 'en la clave, redondeada al píxel nativo',
  columna: 'en la clave: la celda donde queda',
  fila: 'en la clave: la fila donde apoya',
  estado: 'en la clave: quieta, en su tramo o cayendo',
  direccion: 'fuera: mientras anda sale de x y de columna, y quieta vale cero',
  vy: `en la clave, en cubos de ${CUBO_VY} px/s`,
  empujadaPor: 'fuera: dice de quién es una apertura —la paridad—, no qué pasa después',
  espera: 'fuera: dice qué pasó en el último cuadro, y la jugada que la produce se poda',
};

/** La caja, cuantizada con el mismo criterio que el cuerpo. */
export function claveDeCaja(k: Caja): string {
  return [Math.round(k.x), Math.round(k.y), k.estado[0], k.columna, k.fila, Math.round(k.vy / CUBO_VY)].join(',');
}

/**
 * El cuerpo, cuantizado. **Dos cuerpos con la misma clave son el mismo nodo** para la
 * búsqueda, aunque difieran en una fracción de píxel: la posición va redondeada al píxel
 * nativo y la velocidad vertical en cubos (`§2.1`). Lo que se pierde en el redondeo es
 * justamente la precisión que un nivel no tiene que pedir; y como el nodo guarda el mundo de
 * verdad y la traza se repite con la física entera, lo que se encuentra siempre gana.
 */
export function claveDeCuerpo(c: Cuerpo): string {
  const aire = c.enSuelo
    ? 's'
    : c.yaSalto
      ? 'j'
      : `c${Math.min(Math.round(c.desdeElSuelo / SUBPASO_SEG), TOPE_AIRE)}`;
  return [
    Math.round(c.x),
    Math.round(c.y),
    Math.round(c.vy / CUBO_VY),
    aire,
    Math.round(c.saltoGuardado / SUBPASO_SEG),
    c.saltoApretado ? 1 : 0,
  ].join(',');
}

/**
 * Todo el estado mutable del mundo, cuantizado: los dos cuerpos, los tesoros y la sala —cada
 * palanca, cada placa, cada compuerta en su estado real y cada caja con `claveDeCaja()`—.
 *
 * **No es `claveDeMecanismos()`**, aunque miren lo mismo: aquella es exacta, porque la usan la
 * tolerancia para saber si una variante volvió al camino original y esta misma búsqueda para
 * saber si un turno cambió algo del mundo. Esta agrupa lo parecido, como hace con los cuerpos.
 */
export function claveDeEstado(mundo: Mundo): string {
  return [
    claveDeCuerpo(mundo.cuerpos.skayboy),
    claveDeCuerpo(mundo.cuerpos.poligirl),
    [...mundo.juntados].sort().join(';'),
    claveDeLaSala(mundo),
  ].join('|');
}

function claveDeLaSala(mundo: Mundo): string {
  if (mundo.palancas.length + mundo.placas.length + mundo.compuertas.length + mundo.cajas.length === 0) return '';
  const bits = (xs: readonly boolean[]): string => xs.map((x) => (x ? 1 : 0)).join('');
  return [
    bits(mundo.palancas.map((p) => p.activa)),
    bits(mundo.placas.map((l) => l.pisada)),
    bits(mundo.compuertas.map((g) => g.abierta)),
    mundo.cajas.map(claveDeCaja).join(';'),
  ].join('/');
}

/* =========================================================================================
   3. La búsqueda
   ========================================================================================= */

/** Lo que una columna hace durante una jugada. Saltar es un toque: va solo en el primer cuadro. */
interface Accion {
  readonly izquierda: boolean;
  readonly derecha: boolean;
  readonly salta: boolean;
}

const QUIETA: Accion = { izquierda: false, derecha: false, salta: false };
const ACCIONES: readonly Accion[] = [
  QUIETA,
  { izquierda: true, derecha: false, salta: false },
  { izquierda: false, derecha: true, salta: false },
  { izquierda: false, derecha: false, salta: true },
  { izquierda: true, derecha: false, salta: true },
  { izquierda: false, derecha: true, salta: true },
];

/**
 * Una jugada: una acción por columna, sostenida `cuadrosPorJugada` cuadros.
 *
 * **El salto va solo en el primer cuadro** porque `mundo.ts` salta con el flanco
 * (`saltoApretado`): si la tecla quedara apretada hasta la jugada siguiente, un segundo
 * salto seguido no saltaría. Por eso la jugada guarda dos mandos: el del primer cuadro y el
 * del resto.
 */
interface Jugada {
  readonly primero: Mandos;
  readonly resto: Mandos;
  /** Las columnas que tienen teclas. En la búsqueda de uno, una como mucho. */
  readonly columnas: readonly IdPersonaje[];
  readonly saltan: readonly IdPersonaje[];
  /**
   * `queEspera()` del primer cuadro y del resto. No son siempre el mismo: una jugada que solo
   * salta tiene teclas en el primer cuadro y ninguna después, y ahí no espera nadie.
   */
  readonly esperaEnElPrimero: IdPersonaje | null;
  readonly esperaEnElResto: IdPersonaje | null;
}

function armarJugada(s: Accion, p: Accion): Jugada {
  const en = (a: Accion, primero: boolean): Mando => mando(a.izquierda, a.derecha, a.salta && primero);
  const acciones: Record<IdPersonaje, Accion> = { skayboy: s, poligirl: p };
  const primero: Mandos = { skayboy: en(s, true), poligirl: en(p, true) };
  const resto: Mandos = { skayboy: en(s, false), poligirl: en(p, false) };
  return {
    primero,
    resto,
    columnas: PERSONAJES.filter((id) => acciones[id] !== QUIETA),
    saltan: PERSONAJES.filter((id) => acciones[id].salta),
    esperaEnElPrimero: queEspera(primero),
    esperaEnElResto: queEspera(resto),
  };
}

const QUIETOS = armarJugada(QUIETA, QUIETA);
const DE_UNO: Readonly<Record<IdPersonaje, readonly Jugada[]>> = {
  skayboy: ACCIONES.slice(1).map((a) => armarJugada(a, QUIETA)),
  poligirl: ACCIONES.slice(1).map((a) => armarJugada(QUIETA, a)),
};
const DE_A_DOS: readonly Jugada[] = ACCIONES.flatMap((s) => ACCIONES.map((p) => armarJugada(s, p))).filter(
  (j) => j.columnas.length > 0,
);

export interface OpcionesDeBusqueda {
  /** Cuánto dura una jugada, en cuadros. Por defecto `CUADROS_POR_JUGADA`. */
  readonly cuadrosPorJugada?: number;
  /** Cuántos nodos se expanden como mucho antes de contestar que no hay solución. */
  readonly maxNodos?: number;
  /** Cuántos milisegundos, medidos con `reloj`. */
  readonly maxMs?: number;
  /** En milisegundos. Por defecto `performance.now()`; la prueba lo finge. */
  readonly reloj?: () => number;
  /**
   * Cuándo puede cambiar de columna la búsqueda de uno, además de con los dos en el piso:
   *
   * - **`'en-hitos'`** (por defecto): cuando el que se deja está parado en su puerta, o
   *   **adentro de una compuerta abierta** —la traba: no se cierra sobre nadie
   *   (`CTR-16.10.4`)—, o cuando su turno cambió algo del mundo (`claveDeMecanismos()`). Sin ese
   *   filtro, la búsqueda prueba todos los órdenes posibles de dos recorridos que no se tocan
   *   —mitad y mitad, un cuarto y tres cuartos…— y todos cuestan lo mismo, porque de a uno el
   *   tiempo es la suma. Con el filtro el espacio es la suma de los dos y no el producto: en una
   *   sala de 15 × 9 con dos subidas, 2.301 nodos contra 12.505 para la misma traza; en una con
   *   las puertas fuera de alcance, 1.279 contra 90.739 para contestar que no hay. **La compuerta
   *   trabada entró con `T-272`, y no por prolijidad:** sin ella, una placa, una compuerta y las
   *   dos puertas del otro lado —sin caja— daban «no hay solución» después de 118.937 nodos, y la
   *   sala se pasa sola: uno pisa la placa, el otro entra al tramo y se queda, el primero suelta
   *   la placa y lo atraviesa. Entrar al tramo no cambia nada del mundo, así que el filtro no
   *   dejaba soltar esa columna. **Lo que se sigue perdiendo**: el nivel rebuscado donde uno
   *   tiene que adelantar camino antes de que el otro cierre algo detrás, sin haber tocado nada ni
   *   quedar en un lugar que haga algo. Si un nivel lo pide, `'libres'`.
   * - **`'libres'`**: con los dos en el piso, siempre. Completo, y mucho más lento.
   */
  readonly cambios?: 'en-hitos' | 'libres';
  /** Si la traza encontrada se robustece antes de devolverla (`robustecer()`). Por defecto sí. */
  readonly robustecer?: boolean;
  /** Hasta dónde se ensancha, en cuadros. Por defecto `HOLGURA`. */
  readonly holgura?: number;
  /** Hasta dónde se mide la tolerancia que se informa, en cuadros. Por defecto `TOPE_TOLERANCIA`. */
  readonly tope?: number;
  /** Cuántas veces puede medir la tolerancia `robustecer()` antes de conformarse. */
  readonly maxEvaluaciones?: number;
}

const MAX_NODOS = 150_000;
const MAX_MS = 60_000;
const MAX_EVALUACIONES = 120;

function relojPorDefecto(): number {
  return performance.now();
}

export interface SinSolucion {
  readonly tipo: 'sin-solucion';
  readonly explorados: number;
  readonly ms: number;
  /**
   * `'agotada'`: se recorrió todo lo alcanzable con jugadas de este largo y no hay manera.
   * `'nodos'` o `'tiempo'`: se acabó el presupuesto antes. Las dos son rojo, y ninguna cuelga.
   */
  readonly motivo: 'agotada' | 'nodos' | 'tiempo';
}

interface Encontrada {
  readonly tipo: 'encontrada';
  readonly cuadros: readonly Mandos[];
  readonly explorados: number;
  readonly ms: number;
}

interface Nodo {
  /** Se suelta al expandirlo: el camino se rearma con `padre` y `jugada`, no con mundos. */
  mundo: Mundo | null;
  readonly g: number;
  readonly f: number;
  readonly orden: number;
  readonly clave: string;
  readonly padre: Nodo | null;
  readonly jugada: Jugada | null;
  /** Los cuadros que duró la jugada. La que gana se corta en el cuadro en que gana. */
  readonly cuadros: number;
  readonly activa: IdPersonaje | null;
  readonly huboCambio: boolean;
  readonly meta: boolean;
}

/** Un montículo binario: el nodo más prometedor arriba. */
class Monticulo<T> {
  private readonly datos: T[] = [];
  private readonly antes: (a: T, b: T) => boolean;

  constructor(antes: (a: T, b: T) => boolean) {
    this.antes = antes;
  }

  get tamano(): number {
    return this.datos.length;
  }

  poner(x: T): void {
    const d = this.datos;
    d.push(x);
    let i = d.length - 1;
    while (i > 0) {
      const padre = (i - 1) >> 1;
      if (!this.antes(d[i], d[padre])) break;
      [d[i], d[padre]] = [d[padre], d[i]];
      i = padre;
    }
  }

  sacar(): T | undefined {
    const d = this.datos;
    const arriba = d[0];
    const ultimo = d.pop();
    if (d.length > 0 && ultimo !== undefined) {
      d[0] = ultimo;
      let i = 0;
      for (;;) {
        const a = 2 * i + 1;
        const b = a + 1;
        let menor = i;
        if (a < d.length && this.antes(d[a], d[menor])) menor = a;
        if (b < d.length && this.antes(d[b], d[menor])) menor = b;
        if (menor === i) break;
        [d[i], d[menor]] = [d[menor], d[i]];
        i = menor;
      }
    }
    return arriba;
  }
}

/**
 * Menos costo total estimado primero; a igual estimación, el que ya anduvo más. Es lo que
 * hace que entre caminos igual de buenos —correr, o correr saltando, que cuesta lo mismo—
 * la búsqueda baje por uno hasta el final en vez de abrirlos todos a la vez.
 */
function antes(a: Nodo, b: Nodo): boolean {
  if (a.f !== b.f) return a.f < b.f;
  if (a.g !== b.g) return a.g > b.g;
  return a.orden < b.orden;
}

/** La columna de la puerta de cada uno, en píxeles: `estaEnSuPuerta()` mira el medio de los pies. */
function puertasDe(banco: Banco, nivel: Nivel): Record<IdPersonaje, number> {
  const desde = (id: IdPersonaje): number => {
    const p = posicionDe(banco, nivel, 'puerta', id);
    if (p === undefined) throw new Error(`${nivel.id}: no hay puerta para ${id} (CTR-16.5 regla 1)`);
    return p.columna * TILE;
  };
  return { skayboy: desde('skayboy'), poligirl: desde('poligirl') };
}

/**
 * Cuántos cuadros faltan, como mínimo, para que los pies estén en la columna de la puerta.
 * **Nunca de más**: nadie corre más rápido que `VELOCIDAD`, y un cuerpo sin teclas no se
 * mueve de costado. Es lo que hace admisible a la heurística.
 */
function cuadrosHastaSuPuerta(c: Cuerpo, desde: number): number {
  const pies = c.x + CUERPO_ANCHO / 2;
  const distancia = pies < desde ? desde - pies : pies >= desde + TILE ? pies - (desde + TILE) : 0;
  return Math.ceil(distancia / (VELOCIDAD * CUADRO_SEG) - 1e-9);
}

/**
 * Si el cuerpo está adentro del tramo de una compuerta abierta: la traba, porque una compuerta no
 * se cierra sobre nadie (`CTR-16.10.4`). Es un lugar donde quedarse quieto hace algo, como la
 * puerta, y por eso es un hito para soltar la columna (`OpcionesDeBusqueda.cambios`).
 */
function trabaUnaCompuerta(mundo: Mundo, id: IdPersonaje): boolean {
  const c = mundo.cuerpos[id];
  return mundo.compuertas.some(
    (g) =>
      g.abierta &&
      c.x < (g.columna + 1) * TILE &&
      c.x + CUERPO_ANCHO > g.columna * TILE &&
      c.y < (g.hastaFila + 1) * TILE &&
      c.y + CUERPO_ALTO > g.desdeFila * TILE,
  );
}

function claveDeNodo(mundo: Mundo, activa: IdPersonaje | null, huboCambio: boolean): string {
  return `${claveDeEstado(mundo)}#${activa ?? '-'}${huboCambio ? '!' : ''}`;
}

function saltaronTodos(j: Jugada, sucesos: readonly Suceso[]): boolean {
  return j.saltan.every((id) => sucesos.some((s) => s.tipo === 'salto' && s.quien === id));
}

/**
 * A* sobre jugadas gruesas. `'uno'`: una columna por vez, con las reglas de cambio de
 * `OpcionesDeBusqueda.cambios`, y la heurística es la **suma** de lo que le falta a cada uno
 * —de a uno, los tiempos se suman—. `'conjunta'`: las dos columnas a la vez, y la heurística
 * es el **máximo**.
 *
 * Cuatro cosas que la búsqueda descarta sin simularlas enteras, y por qué ninguna le saca
 * una solución a un nivel sano:
 *
 * 1. **Una jugada con salto que no salta en su primer cuadro.** Apretar saltar en el aire
 *    solo guarda el pedido para el aterrizaje, y lo mismo se logra saltando en la jugada
 *    siguiente, ya en el piso. Lo que la búsqueda no usa, la tolerancia sí lo mide: el perdón
 *    está para el pulgar.
 * 2. **Una jugada en la que alguien vuelve a la entrada.** La traza grabada no fracasa
 *    nunca; un nivel que solo se pasa volviendo a la entrada es un nivel roto.
 * 3. **Quedarse quieto con los dos en el piso y la sala quieta.** Con `QUIETO`, apoyados y
 *    ninguna caja andando, no pasa nada. Con una caja andando sí —termina su tramo o cae
 *    sola (`CTR-16.10.5`)—, y ahí soltar todo es la jugada que la deja llegar antes de cambiar
 *    de columna. **Salvo en la raíz**, donde `enSuelo` no se podía creer: `crearMundo()` lo
 *    pone en `true` sin mirar la grilla. Ahí la búsqueda también prueba no tocar nada —el que
 *    flota cae solo, y es la manera honesta de empezar—; si los dos estaban apoyados de verdad,
 *    el hijo tiene la misma clave que la raíz y lo poda la 4. Desde `E8` (`CTR-16.5` regla 3)
 *    un banco sano no trae entradas en el aire, y la excepción queda por robustez: las pruebas
 *    `FLOTA_*` y `DOS_EN_EL_AIRE` son salas que el banco ya no admite, y la búsqueda no tiene
 *    por qué colgarse con ellas.
 * 4. **Un estado que ya se alcanzó igual o más barato**, según `claveDeEstado()`.
 * 5. **En la de uno, una jugada en la que el que espera se mueve** (`CTR-18.6` regla 7): en
 *    cada cuadro con teclas en una sola columna, el cuerpo de la otra tiene que terminar donde
 *    empezó, `===`, igual que en `repetir()`. Es la regla que protege (c) y (d) aplicada en
 *    la expansión, y no solo al final: sin ella, una entrada en el aire daba una traza que la
 *    verificación propia rechazaba, y el solucionador tiraba en vez de buscar otra.
 * 6. **En la de uno, una jugada en la que una caja espera a alguien** (`CTR-18.6` regla 11,
 *    `CTR-16.10.5`): es una carrera, y la traza grabada no pasa por ninguna. Se mira en cada
 *    cuadro, como en `repetir()`. Y la otra mitad de la regla 11 está en las jugadas: no se
 *    cambia de columna con una caja andando.
 */
function buscar(
  banco: Banco,
  nivel: Nivel,
  modo: 'uno' | 'conjunta',
  opciones: OpcionesDeBusqueda,
): Encontrada | SinSolucion {
  const porJugada = opciones.cuadrosPorJugada ?? CUADROS_POR_JUGADA;
  const maxNodos = opciones.maxNodos ?? MAX_NODOS;
  const maxMs = opciones.maxMs ?? MAX_MS;
  const reloj = opciones.reloj ?? relojPorDefecto;
  const enHitos = modo === 'uno' && opciones.cambios !== 'libres';
  const t0 = reloj();
  const puertas = puertasDe(banco, nivel);

  const falta = (m: Mundo): number => {
    const s = cuadrosHastaSuPuerta(m.cuerpos.skayboy, puertas.skayboy);
    const p = cuadrosHastaSuPuerta(m.cuerpos.poligirl, puertas.poligirl);
    return modo === 'uno' ? s + p : Math.max(s, p);
  };

  const jugadasDe = (nodo: Nodo, mundo: Mundo): readonly Jugada[] => {
    const apoyados = PERSONAJES.every((id) => enElPiso(mundo.cuerpos[id]));
    const salaQuieta = !algunaCajaAnda(mundo);
    if (modo === 'conjunta') return apoyados && salaQuieta ? DE_A_DOS : [QUIETOS, ...DE_A_DOS];
    const activa = nodo.activa;
    const lista: Jugada[] = [];
    if (activa !== null) {
      // Soltar todo en el aire es caer derecho, y con una caja andando es dejarla llegar: sirve.
      // En el piso y con la sala quieta no cambia nada (poda 3).
      if (!enElPiso(mundo.cuerpos[activa]) || !salaQuieta) lista.push(QUIETOS);
      lista.push(...DE_UNO[activa]);
    } else {
      // Antes del primer turno: dejar caer al que empieza en el aire (poda 3, la excepción).
      // Con las dos entradas en el aire es la única jugada que la poda 5 deja pasar.
      lista.push(QUIETOS);
    }
    // La regla 11, segunda mitad: el pulgar cambia de columna con la sala quieta.
    const puedeCambiar =
      activa === null ||
      (apoyados &&
        salaQuieta &&
        (!enHitos || nodo.huboCambio || mundo.cuerpos[activa].enPuerta || trabaUnaCompuerta(mundo, activa)));
    if (puedeCambiar) {
      for (const otra of PERSONAJES) if (otra !== activa) lista.push(...DE_UNO[otra]);
    }
    return lista;
  };

  const abiertos = new Monticulo<Nodo>(antes);
  const mejorG = new Map<string, number>();
  let orden = 0;
  const inicio = crearMundo(banco, nivel);
  const raiz: Nodo = {
    mundo: inicio,
    g: 0,
    f: falta(inicio),
    orden: orden++,
    clave: claveDeNodo(inicio, null, false),
    padre: null,
    jugada: null,
    cuadros: 0,
    activa: null,
    huboCambio: false,
    meta: false,
  };
  mejorG.set(raiz.clave, 0);
  abiertos.poner(raiz);

  let explorados = 0;
  const sin = (motivo: SinSolucion['motivo']): SinSolucion => ({
    tipo: 'sin-solucion',
    explorados,
    ms: reloj() - t0,
    motivo,
  });

  for (;;) {
    const nodo = abiertos.sacar();
    if (nodo === undefined) return sin('agotada');
    if (nodo.g > (mejorG.get(nodo.clave) ?? Infinity)) continue;
    if (nodo.meta) return { tipo: 'encontrada', cuadros: cuadrosDelCamino(nodo), explorados, ms: reloj() - t0 };
    if (explorados >= maxNodos) return sin('nodos');
    if ((explorados & 63) === 0 && reloj() - t0 > maxMs) return sin('tiempo');
    explorados++;

    const mundo = nodo.mundo;
    if (mundo === null) continue;
    nodo.mundo = null;
    const mecanismos = claveDeMecanismos(mundo);

    for (const jugada of jugadasDe(nodo, mundo)) {
      const hijo = clonarMundo(mundo);
      let cuadros = 0;
      let sirve = true;
      for (let c = 0; c < porJugada; c++) {
        const espera = modo === 'uno' ? (c === 0 ? jugada.esperaEnElPrimero : jugada.esperaEnElResto) : null;
        const antesX = espera === null ? 0 : hijo.cuerpos[espera].x;
        const antesY = espera === null ? 0 : hijo.cuerpos[espera].y;
        const sucesos = paso(hijo, c === 0 ? jugada.primero : jugada.resto, CUADRO_SEG);
        cuadros++;
        if ((c === 0 && !saltaronTodos(jugada, sucesos)) || sucesos.some((s) => s.tipo === 'vuelta')) {
          sirve = false;
          break;
        }
        // Poda 5: el que espera no se mueve (CTR-18.6 regla 7), mirado igual que en repetir().
        if (espera !== null && (hijo.cuerpos[espera].x !== antesX || hijo.cuerpos[espera].y !== antesY)) {
          sirve = false;
          break;
        }
        // Poda 6: ninguna caja espera a nadie (CTR-18.6 regla 11), en cada cuadro.
        if (modo === 'uno' && hijo.cajas.some((k) => k.espera !== null)) {
          sirve = false;
          break;
        }
        if (hijo.terminado) break;
      }
      if (!sirve) continue;

      const activa = modo === 'uno' ? (jugada.columnas[0] ?? nodo.activa) : null;
      const cambio = claveDeMecanismos(hijo) !== mecanismos;
      // Un turno nuevo empieza sin haber cambiado nada; el mismo turno arrastra lo que cambió.
      const huboCambio = enHitos && (activa === nodo.activa ? nodo.huboCambio || cambio : cambio);
      const clave = claveDeNodo(hijo, activa, huboCambio);
      const g = nodo.g + cuadros;
      if ((mejorG.get(clave) ?? Infinity) <= g) continue;
      mejorG.set(clave, g);
      abiertos.poner({
        mundo: hijo,
        g,
        f: g + (hijo.terminado ? 0 : falta(hijo)),
        orden: orden++,
        clave,
        padre: nodo,
        jugada,
        cuadros,
        activa,
        huboCambio,
        meta: hijo.terminado,
      });
    }
  }
}

function cuadrosDelCamino(meta: Nodo): Mandos[] {
  const camino: Nodo[] = [];
  for (let n: Nodo | null = meta; n !== null && n.jugada !== null; n = n.padre) camino.push(n);
  camino.reverse();
  const cuadros: Mandos[] = [];
  for (const n of camino) {
    const j = n.jugada;
    if (j === null) continue;
    for (let c = 0; c < n.cuadros; c++) cuadros.push(c === 0 ? j.primero : j.resto);
  }
  return cuadros;
}

export interface Solucion {
  readonly tipo: 'solucion';
  readonly modo: Modo;
  /**
   * `'busqueda'`: la de uno. `'solape'`: la de a dos que sale de la de uno. `'conjunta'`: la
   * de a dos buscada con las dos columnas, cuando la de uno no existe o se pidió así.
   */
  readonly metodo: 'busqueda' | 'solape' | 'conjunta';
  /** La traza para grabar: robustecida y recortada en el cuadro que gana. */
  readonly traza: Traza;
  readonly cuadros: number;
  readonly segundos: number;
  /**
   * La más corta que encontró la búsqueda, antes de robustecer. **Es el piso de cuánto dura
   * el nivel** (`§2.1`, la mitad medida de lo que `INV-60` dejó sin resolver).
   */
  readonly minima: { readonly traza: Traza; readonly cuadros: number; readonly segundos: number };
  readonly tolerancia: Tolerancia;
  readonly explorados: number;
  /** Lo que tardó la búsqueda, y lo que tardó todo: búsqueda, verificación y robustez. */
  readonly msBusqueda: number;
  readonly ms: number;
}

/**
 * Repite una traza que el solucionador acaba de armar, y tira si no cumple. **Si tira, el
 * defecto es del solucionador, no del nivel**: la búsqueda juega con la misma física, así que
 * una traza suya que no gana quiere decir que el mundo copiado no era el mundo (una copia que
 * comparte algo, un campo que no está en la clave).
 */
function verificarPropia(banco: Banco, nivel: Nivel, traza: Traza, modo: Modo): Repeticion {
  let r: Repeticion;
  try {
    r = exigirTraza(banco, nivel, traza, modo);
  } catch (error) {
    throw new Error(`defecto del solucionador: ${(error as Error).message}`, { cause: error });
  }
  const vueltas = r.vueltas.skayboy + r.vueltas.poligirl;
  if (vueltas > 0) {
    throw new Error(`defecto del solucionador: ${nivel.id} trae ${vueltas} vuelta(s) y la búsqueda las descarta`);
  }
  return r;
}

/**
 * Verifica cada traza mínima, la robustece, y se queda con **la que más aguanta**; si
 * empatan, con la más corta. La `minima` que informa es la más corta de todas, que es el piso
 * de duración aunque no sea la que se graba. Las candidatas se comparan medidas hasta la
 * holgura; la elegida se vuelve a medir hasta el tope, que es el número que se informa.
 */
function terminar(
  banco: Banco,
  nivel: Nivel,
  minimas: readonly Traza[],
  modo: Modo,
  metodo: Solucion['metodo'],
  explorados: number,
  msBusqueda: number,
  t0: number,
  opciones: OpcionesDeBusqueda,
): Solucion {
  const reloj = opciones.reloj ?? relojPorDefecto;
  const holgura = opciones.holgura ?? HOLGURA;
  let masCorta: { traza: Traza; r: Repeticion } | null = null;
  let elegida: { traza: Traza; tolerancia: Tolerancia; r: Repeticion } | null = null;
  for (const minima of minimas) {
    const deLaMinima = verificarPropia(banco, nivel, minima, modo);
    if (masCorta === null || deLaMinima.cuadros < masCorta.r.cuadros) masCorta = { traza: minima, r: deLaMinima };
    const robusta =
      opciones.robustecer === false
        ? { traza: minima, tolerancia: tolerancia(banco, nivel, minima, { tope: holgura }) }
        : robustecer(banco, nivel, minima, { modo, holgura, maxEvaluaciones: opciones.maxEvaluaciones });
    const r = verificarPropia(banco, nivel, robusta.traza, modo);
    const gana =
      elegida === null ||
      esMejor(robusta.tolerancia, elegida.tolerancia) ||
      (!esMejor(elegida.tolerancia, robusta.tolerancia) && r.cuadros < elegida.r.cuadros);
    if (gana) elegida = { traza: robusta.traza, tolerancia: robusta.tolerancia, r };
  }
  if (masCorta === null || elegida === null) throw new Error(`${nivel.id}: terminar() sin ninguna traza`);
  return {
    tipo: 'solucion',
    modo,
    metodo,
    traza: elegida.traza,
    cuadros: elegida.r.cuadros,
    segundos: elegida.r.segundos,
    minima: { traza: masCorta.traza, cuadros: masCorta.r.cuadros, segundos: masCorta.r.segundos },
    tolerancia: tolerancia(banco, nivel, elegida.traza, { tope: opciones.tope ?? TOPE_TOLERANCIA }),
    explorados,
    msBusqueda,
    ms: reloj() - t0,
  };
}

/**
 * La misma traza de uno con los dos turnos dados vuelta, si son dos y si así también gana.
 *
 * **El orden decide la tolerancia, y la búsqueda no lo mira.** El que va último no tiene que
 * frenar en su puerta: el nivel termina en el cuadro en que entra. El que va primero sí, y si
 * su puerta no está contra la pared, frenar ahí aguanta cinco cuadros y no más. En una sala
 * con la puerta de Skayboy en una cornisa, Skayboy primero mide 5 y Poligirl primero, 12:
 * mismo nivel, otro orden. Por eso se prueban los dos órdenes y se graba el que más aguanta.
 * Con tres turnos o más —cuando `T-272` haga que uno le abra paso al otro— el orden ya no es
 * libre, y se deja como vino.
 */
function alReves(banco: Banco, nivel: Nivel, minima: Traza, tope: number): Traza[] {
  const turnos = turnosDe(expandir(minima));
  if (turnos.length !== 2) return [];
  const invertida = componer([turnos[1], turnos[0]], [0, turnos[1].mandos.length]);
  const valida = validar(banco, nivel, conColchon(invertida, tope), 'uno');
  return valida === null ? [] : [valida];
}

/**
 * **La traza de una persona sola**, o por qué no la hay.
 *
 * Una columna por cuadro; el cambio de columna, solo con los dos en el piso; nadie vuelve a
 * la entrada. Lo que devuelve ya se repitió con `exigirTraza()`: si no ganara, tira.
 */
export function resolverSolo(banco: Banco, nivel: Nivel, opciones: OpcionesDeBusqueda = {}): Solucion | SinSolucion {
  const reloj = opciones.reloj ?? relojPorDefecto;
  const t0 = reloj();
  const r = buscar(banco, nivel, 'uno', opciones);
  if (r.tipo !== 'encontrada') return r;
  const minima = compactar(r.cuadros);
  const candidatas = [minima, ...alReves(banco, nivel, minima, opciones.holgura ?? HOLGURA)];
  return terminar(banco, nivel, candidatas, 'uno', 'busqueda', r.explorados, r.ms, t0, opciones);
}

export interface OpcionesDeADos extends OpcionesDeBusqueda {
  /** La de uno, si ya está: la de a dos sale de ella y no hace falta buscarla otra vez. */
  readonly deUno?: Solucion | SinSolucion;
  /** `'solape'` (por defecto) o `'conjunta'`, para forzar la búsqueda con las dos columnas. */
  readonly metodo?: 'solape' | 'conjunta';
}

/**
 * **La traza de dos personas a la vez.**
 *
 * ## La semántica elegida: la de uno, con los turnos solapados
 *
 * Se toma la traza de uno y se la corta en **turnos** —cada tramo en que una sola columna
 * tiene teclas; los cuadros sin teclas son del turno en curso—. Después, turno por turno, se
 * adelanta cada uno todo lo que se pueda, para que arranque mientras el anterior sigue: el
 * cuadro más temprano en que la traza, repetida entera con `repetir()`, **todavía gana sin
 * que nadie vuelva a la entrada**. La misma columna nunca hace dos turnos a la vez.
 *
 * Si los dos recorridos no se tocan —hoy, que el mundo no tiene mecanismos—, eso es correr el
 * camino de cada uno a la vez desde el cuadro cero, y dura lo que el más largo de los dos:
 * lo más corto que hay. Si se tocan —la palanca que uno baja para el otro (`T-272`)—, el
 * turno del que espera arranca recién cuando la palanca ya le sirve, y eso lo encuentra la
 * repetición, no una regla escrita a mano. **No es la de a dos más corta posible**: es la más
 * corta que respeta el orden de la de uno.
 *
 * Si la de uno no existe, se busca con las dos columnas a la vez (`'conjunta'`), con el
 * mismo presupuesto. Un nivel así es de los que `BR-25` (c) no deja entrar, pero saber que de
 * a dos sí se pasa es el diagnóstico que el que lo dibujó necesita.
 */
export function resolverDeADos(banco: Banco, nivel: Nivel, opciones: OpcionesDeADos = {}): Solucion | SinSolucion {
  const reloj = opciones.reloj ?? relojPorDefecto;
  const t0 = reloj();
  let explorados = 0;
  if (opciones.metodo !== 'conjunta') {
    // La de uno se busca pelada: su tolerancia no hace falta, y robustecerla sería trabajo tirado.
    const deUno = opciones.deUno ?? buscar(banco, nivel, 'uno', opciones);
    explorados += deUno.explorados;
    if (deUno.tipo !== 'sin-solucion') {
      const minima = deUno.tipo === 'solucion' ? deUno.minima.traza : compactar(deUno.cuadros);
      const msBusqueda = deUno.tipo === 'solucion' ? deUno.msBusqueda : deUno.ms;
      return terminar(banco, nivel, [solapar(banco, nivel, minima)], 'dos', 'solape', explorados, msBusqueda, t0, opciones);
    }
  }
  const r = buscar(banco, nivel, 'conjunta', opciones);
  explorados += r.explorados;
  if (r.tipo !== 'encontrada') return { ...r, explorados, ms: reloj() - t0 };
  return terminar(banco, nivel, [compactar(r.cuadros)], 'dos', 'conjunta', explorados, r.ms, t0, opciones);
}

/** Un turno: el mando de su columna, cuadro por cuadro. */
interface Turno {
  readonly columna: IdPersonaje;
  readonly mandos: readonly Mando[];
}

function turnosDe(cuadros: readonly Mandos[]): Turno[] {
  const turnos: { columna: IdPersonaje; mandos: Mando[] }[] = [];
  let pendientes = 0;
  for (const m of cuadros) {
    const columnas = columnasConTeclas(m);
    if (columnas.length > 1) throw new Error('solapar: la traza de uno trae un cuadro con las dos columnas');
    const actual = turnos[turnos.length - 1];
    if (columnas.length === 1 && (actual === undefined || actual.columna !== columnas[0])) {
      // Los cuadros sin teclas antes del primer turno son de ese turno: esperar también es jugar.
      turnos.push({ columna: columnas[0], mandos: Array.from({ length: pendientes }, () => QUIETO) });
      pendientes = 0;
    }
    const turno = turnos[turnos.length - 1];
    if (turno === undefined) pendientes++;
    else turno.mandos.push(m[turno.columna]);
  }
  return turnos;
}

function componer(turnos: readonly Turno[], inicios: readonly number[]): Traza {
  const largo = Math.max(0, ...turnos.map((t, j) => inicios[j] + t.mandos.length));
  const columna: Record<IdPersonaje, Mando[]> = {
    skayboy: Array.from({ length: largo }, () => QUIETO),
    poligirl: Array.from({ length: largo }, () => QUIETO),
  };
  turnos.forEach((t, j) => t.mandos.forEach((m, i) => (columna[t.columna][inicios[j] + i] = m)));
  return compactar(Array.from({ length: largo }, (_, i) => ({ skayboy: columna.skayboy[i], poligirl: columna.poligirl[i] })));
}

function solapar(banco: Banco, nivel: Nivel, deUno: Traza): Traza {
  const turnos = turnosDe(expandir(deUno));
  const largos = turnos.map((t) => t.mandos.length);
  let inicios: number[] = [];
  largos.forEach((_, j) => inicios.push(j === 0 ? 0 : inicios[j - 1] + largos[j - 1]));

  for (let j = 1; j < turnos.length; j++) {
    const finDelAnterior = inicios[j - 1] + largos[j - 1];
    // La misma columna no juega dos turnos a la vez: el suyo anterior tiene que haber terminado,
    // y este tiene que terminar antes de que empiece el siguiente de la otra, que va detrás.
    const libreDesde = j >= 2 ? inicios[j - 2] + largos[j - 2] : 0;
    const maximo = Math.min(
      finDelAnterior - libreDesde,
      j + 1 < turnos.length ? largos[j] : Infinity,
    );
    for (let solape = maximo; solape >= 1; solape--) {
      const prueba = inicios.slice();
      prueba[j] = finDelAnterior - solape;
      for (let i = j + 1; i < turnos.length; i++) prueba[i] = prueba[i - 1] + largos[i - 1];
      if (validar(banco, nivel, componer(turnos, prueba), 'dos') !== null) {
        inicios = prueba;
        break;
      }
    }
  }
  const final = validar(banco, nivel, componer(turnos, inicios), 'dos');
  if (final === null) throw new Error(`defecto del solucionador: ${nivel.id}, el solape de la de uno dejó de ganar`);
  return final;
}

/**
 * Si la traza sirve para ese modo, recortada en el cuadro que gana; si no, `null`.
 *
 * **Mira lo mismo que `exigirTraza()`**, reglas 5 a 7 y 11 de `CTR-18.6`, salvo el largo exacto,
 * que arregla recortando. Es el filtro de toda candidata que no sale de la búsqueda —las de
 * `robustecer()`, la de `alReves()`, los solapes—, y lo que deje pasar lo termina rechazando
 * `verificarPropia()` con un tiro en vez de un descarte. Por eso en la de uno descarta también
 * la candidata en la que el que espera se mueve (regla 7): la invertida de una sala con una
 * entrada en el aire, por ejemplo, pone a jugar al que está apoyado mientras el otro cae. Y la
 * que hace esperar a una caja o cambia de columna con una andando (regla 11): ensanchar un
 * borde puede soltar la columna un cuadro antes de que la caja llegue.
 *
 * **Y en la de uno descarta la que no se puede escribir.** Correr un borde de izquierda hasta
 * pisar una corrida de derecha deja cuadros con las dos apretadas: se anulan en `mundo.ts` y la
 * física puede ganar igual, pero `<>` no existe en `CTR-18.3`, y una traza que el script no puede
 * grabar no sirve de nada (`T-267`).
 */
function validar(banco: Banco, nivel: Nivel, traza: Traza, modo: Modo): Traza | null {
  if (modo === 'uno' && traza.some((c) => PERSONAJES.some((id) => c.mandos[id].izquierda && c.mandos[id].derecha))) {
    return null;
  }
  const r = repetir(banco, nivel, traza);
  if (!r.gana || r.vueltas.skayboy + r.vueltas.poligirl > 0) return null;
  if (
    modo === 'uno' &&
    (r.maxColumnasConTeclas > 1 ||
      r.cambiosSinPiso > 0 ||
      r.movimientosDelQueEspera > 0 ||
      r.cuadrosConCajaEnEspera > 0 ||
      r.cambiosConCajaAndando > 0)
  ) {
    return null;
  }
  return r.sobrantes > 0 ? recortar(traza, r.cuadros) : traza;
}

/* =========================================================================================
   4. El ensanchado
   ========================================================================================= */

/**
 * **Hace que la traza aguante**, sin dejar de ganar ni de cumplir su modo.
 *
 * Existe por lo que avisa `tolerancia()`: la búsqueda devuelve la traza más corta, y la más
 * corta es la más justa —suelta cada tecla en el último cuadro que todavía sirve, y salta con
 * toques de un cuadro, que demorados un cuadro desaparecen—. Medida así, casi todo nivel daría
 * cero, y la vara de `BR-29` no separaría uno fácil de uno imposible. Una persona no juega la
 * traza más corta: corre un poco de más contra la pared, sostiene el salto, salta con margen.
 *
 * Es una búsqueda local sobre la traza. En cada vuelta toma el borde más apretado y lo corre
 * hacia el centro de su ventana —la mitad de la diferencia entre lo que aguanta antes y lo que
 * aguanta después—, de las maneras que da `movimientos()`. Cada candidata se repite entera; se
 * queda si gana, cumple el modo y **mejora la tolerancia** —sube el mínimo, o deja menos bordes
 * en el mínimo (`puntaje()`)—. Si ninguna mejora, ese borde queda así y se sigue con el próximo
 * **que esté en el mínimo**: cuando ninguno de esos se puede mover, o todos llegan a la
 * `holgura`, termina. Pulir los otros bordes no cambia el número del nivel y costaba caro: en
 * una sala de 15 × 9 con dos subidas llegó a gastar 56 mediciones y 3,1 s por el mismo mínimo;
 * hoy son 16 y 0,4 s.
 *
 * **Parar en una puerta que no está contra la pared aguanta cinco cuadros para cada lado y no
 * más**, y conviene saberlo antes de dibujar: la puerta mide 16 píxeles, unos once cuadros
 * corriendo, y la traza robustecida suelta la tecla en el medio. Contra la pared, en cambio, se
 * puede seguir apretando, y el que llega último no frena nunca: el nivel termina cuando entra.
 * Medido en una sala plana: las dos puertas contra la pared, 30; una suelta, también 30 —el
 * solucionador manda último al de la puerta suelta (`alReves()`)—; las dos sueltas, 5. **Con
 * los pisos de `BR-29` (Fácil 10, Media 6), en esos escalones al menos una de las dos puertas
 * tiene que estar contra algo que frene.** Lo mismo le va a pasar a cualquier lugar donde la
 * traza de uno tenga que dejar a alguien parado en el medio del piso —una placa, `T-272`—.
 *
 * La traza se alarga: es el precio del margen, y por eso `Solucion` guarda también la mínima.
 */
export function robustecer(
  banco: Banco,
  nivel: Nivel,
  traza: Traza,
  opciones: { readonly modo: Modo; readonly holgura?: number; readonly maxEvaluaciones?: number },
): { traza: Traza; tolerancia: Tolerancia; evaluaciones: number } {
  const holgura = opciones.holgura ?? HOLGURA;
  const maxEvaluaciones = opciones.maxEvaluaciones ?? MAX_EVALUACIONES;
  const inicial = validar(banco, nivel, traza, opciones.modo);
  if (inicial === null) {
    throw new Error(`${nivel.id}: no se robustece una traza que no gana o que no es de ${opciones.modo === 'uno' ? 'uno' : 'a dos'}`);
  }
  let actual = inicial;
  let medida = tolerancia(banco, nivel, actual, { tope: holgura });
  let evaluaciones = 1;
  const quietos = new Set<string>();

  while (evaluaciones < maxEvaluaciones) {
    const porApriete = [...medida.bordes].sort((a, b) => a.tolerancia - b.tolerancia || a.cuadro - b.cuadro);
    const borde = porApriete.find((b) => b.tolerancia < holgura && !quietos.has(idDeBorde(b)));
    // La tolerancia del nivel es el mínimo. Si ya no se puede mover ninguno de los bordes que
    // están en el mínimo, pulir los demás alarga la traza y no cambia el número que importa.
    if (borde === undefined || borde.tolerancia > medida.minimo) break;
    const primero = porApriete.map(idDeBorde);
    let mejoro = false;
    for (const candidata of movimientos(actual, borde, medida)) {
      if (evaluaciones >= maxEvaluaciones) break;
      const valida = validar(banco, nivel, conColchon(candidata, holgura), opciones.modo);
      if (valida === null) continue;
      const nueva = medirTolerancia(banco, nivel, valida, { tope: holgura, piso: medida.minimo, primero });
      evaluaciones++;
      if (nueva !== null && esMejor(nueva, medida)) {
        actual = valida;
        medida = nueva;
        mejoro = true;
        break;
      }
    }
    // Un borde queda quieto mientras nada cambie. Cuando una jugada mejora, **todos se vuelven a
    // mirar**: la ventana de un borde depende de los otros. Con cajas es la regla, no la
    // excepción: en la sala de `CTR-16.10.1` el salto que pasa por encima de la caja es un toque de
    // un cuadro en el primer cuadro del empujón —antes no hay empujón, demorado desaparece—, así
    // que no se puede correr para ningún lado y queda quieto; en cuanto otra jugada lo sostiene,
    // tiene trece cuadros para demorarse. Sin esto, la traza de esa sala se grababa aguantando 0.
    if (mejoro) quietos.clear();
    else quietos.add(idDeBorde(borde));
  }
  return { traza: actual, tolerancia: medida, evaluaciones };
}

/**
 * La traza con `cuadros` de más al final, repitiendo el último: el mismo estiramiento que usa
 * la medición (`CTR-18.7` punto 2). Correr un borde puede dejar al cuerpo unos píxeles más
 * atrás, y entonces llega unos cuadros más tarde; sin colchón, la candidata se cortaría antes
 * de llegar y se descartaría por algo que no es un defecto. `validar()` recorta lo que sobre.
 */
function conColchon(traza: Traza, cuadros: number): Traza {
  const ultima = traza[traza.length - 1];
  if (ultima === undefined) return traza;
  return [...traza.slice(0, -1), { mandos: ultima.mandos, cuadros: ultima.cuadros + cuadros }];
}

/**
 * Qué es mejorar: **subir el mínimo, o dejar menos bordes en el mínimo**. Nada más. Hubo una
 * tercera cuenta —la suma de todas las tolerancias— y era una trampa: con el salto del hueco ya
 * centrado en 7, alargar el sostenido un cuadro subía la suma en uno, y el robustecedor gastó
 * sus 120 mediciones alargándolo de a un cuadro, sin mover el 7.
 */
function puntaje(t: Tolerancia): readonly number[] {
  const enElMinimo = t.bordes.filter((b) => b.tolerancia === t.minimo).length;
  return [t.minimo, -enElMinimo];
}

function esMejor(a: Tolerancia, b: Tolerancia): boolean {
  const x = puntaje(a);
  const y = puntaje(b);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
}

/** El índice de la corrida que empieza en ese cuadro, o -1. */
function corridaQueEmpiezaEn(traza: Traza, cuadro: number): number {
  let t = 0;
  for (let i = 0; i < traza.length; i++) {
    if (t === cuadro) return i;
    t += traza[i].cuadros;
  }
  return -1;
}

/** La traza con otros largos en algunas corridas, o `null` si alguna queda vacía. */
function conLargos(traza: Traza, cambios: ReadonlyMap<number, number>): Traza | null {
  const nueva = traza.map((c, i) => ({ mandos: c.mandos, cuadros: c.cuadros + (cambios.get(i) ?? 0) }));
  return nueva.every((c) => c.cuadros >= 1) ? nueva : null;
}

/**
 * La traza con **un solo borde corrido y todo lo demás igual**: la variante de la medición
 * (`tramoCorrido()`), hecha de verdad y sin estirar. Es el único movimiento que separa dos
 * bordes que caen en el mismo cuadro —el salto del arranque, por ejemplo—; sin él, una traza
 * que salta en el primer cuadro de su turno no tenía cómo demorar el salto sin demorar también
 * la corrida. Y es el que sostiene un salto: correr más tarde el borde donde se suelta.
 */
function correrUnBorde(traza: Traza, borde: Borde, delta: number): Traza | null {
  const cuadros = expandir(traza);
  if (borde.cuadro >= cuadros.length) return null;
  const { columna, tecla } = borde;
  const tramo = tramoCorrido(cuadros, columna, tecla, borde.cuadro, delta);
  if (tramo === null) return null;
  let cambio = false;
  const corridos = cuadros.map((m, f) => {
    if (f < tramo.desde || f >= tramo.hasta || m[columna][tecla] === tramo.valor) return m;
    cambio = true;
    return conTecla(m, columna, tecla, tramo.valor);
  });
  return cambio ? compactar(corridos) : null;
}

/**
 * Las candidatas para el borde más apretado, de la más chica a la más grande en lo que tocan:
 * correr ese borde solo; estirar la corrida que termina en él (se corre todo lo que viene
 * después); correr la frontera entera entre dos corridas (la siguiente paga la diferencia);
 * y, si es un apriete que no aguanta que lo demoren —una corrida corta, un salto de un
 * cuadro—, alargarlo por la otra punta: primero corriendo solo el borde donde se suelta, después
 * estirando.
 */
function* movimientos(traza: Traza, borde: Borde, medida: Tolerancia): Generator<Traza> {
  const hacia = borde.antes < borde.despues ? 1 : borde.antes > borde.despues ? -1 : 0;
  const base = Math.max(1, Math.floor(Math.abs(borde.despues - borde.antes) / 2));
  const cantidades = [...new Set([base, Math.max(1, base >> 1), 1])];
  const i = corridaQueEmpiezaEn(traza, borde.cuadro);
  // La otra punta: el borde siguiente de la misma tecla.
  const suelta = medida.bordes.find(
    (b) => b.columna === borde.columna && b.tecla === borde.tecla && b.orden === borde.orden + 1,
  );
  const j = suelta === undefined ? -1 : corridaQueEmpiezaEn(traza, suelta.cuadro);

  for (const d of cantidades) {
    const candidatas: (Traza | null)[] = [];
    if (hacia !== 0) {
      candidatas.push(correrUnBorde(traza, borde, hacia * d));
      if (i > 0) {
        candidatas.push(conLargos(traza, new Map([[i - 1, hacia * d]])));
        if (i < traza.length) candidatas.push(conLargos(traza, new Map([[i - 1, hacia * d], [i, -hacia * d]])));
      }
    }
    if (borde.sentido === 'aprieta' && borde.despues < borde.antes && suelta !== undefined) {
      candidatas.push(correrUnBorde(traza, suelta, d));
      if (j > 0) candidatas.push(conLargos(traza, new Map([[j - 1, d]])));
    }
    for (const c of candidatas) if (c !== null) yield c;
  }
}
