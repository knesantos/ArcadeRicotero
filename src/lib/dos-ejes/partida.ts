/**
 * El motor del test de dos ejes (`US-06`). Implementa `CTR-08` v2 (`D-57`).
 *
 * Funciones puras, y son puras porque si no, no hay test. El azar entra por parámetro con un
 * valor por defecto: con un generador determinista, `node --test` puede afirmar que salió un
 * ítem de cada eje por momento, que no se repite nada, y que el error salta con una celda
 * vacía. Un `Math.random()` incrustado convierte esas afirmaciones en una inspección a ojo.
 *
 * ## La noche (`D-57` punto 1)
 *
 * Desde el ciclo 18 la partida no es una lista de diez preguntas sueltas: es una noche de
 * recital contada en cinco momentos —la previa, la ida, la vereda, adentro, la vuelta—, y en
 * cada momento sale un ítem de cada eje. Siguen siendo cinco por eje, impar (`BR-17` regla 3),
 * porque los momentos son tantos como `preguntasPorEje`. Dentro del momento, cuál de los dos
 * ejes va primero se sortea: el intercalado estricto de antes (ABAB) dejaba adivinar el eje de
 * las diez sabiendo el de la primera.
 *
 * **Lo que este archivo no hace, y es a propósito:** no devuelve el conteo por eje.
 * `resolverCuadrante` tiene tres campos de retorno y ninguno es un número. Es la forma de hacer
 * cumplir desde el tipo el criterio 3 de `US-06` —el test devuelve una identidad, no un
 * puntaje— en vez de confiar en que quien pinte la pantalla se acuerde. Lo que no está en el
 * tipo no se puede mostrar.
 */

export type Eje = 'luz-oscuridad' | 'orden-caos';
export type Polo = 'luz' | 'oscuridad' | 'orden' | 'caos';

export interface Opcion {
  readonly texto: string;
  readonly polo: Polo;
}

export interface Item {
  readonly id: string;
  readonly eje: Eje;
  /** De qué momento de la noche es. Los retirados no lo llevan (`CTR-08` v2). */
  readonly momento?: string;
  readonly enunciado: string;
  readonly opciones: readonly Opcion[];
  readonly estado: string;
}

/** Un momento de la noche: el sello seco y la línea que canta (`CNT-30`). */
export interface Momento {
  readonly id: string;
  readonly nombre: string;
  readonly canta: string;
}

export interface Cuadrante {
  readonly id: string;
  readonly luzOscuridad: 'luz' | 'oscuridad';
  readonly ordenCaos: 'orden' | 'caos';
  readonly nombre: string;
  readonly bajada: string;
  readonly estado: string;
}

export interface Banco {
  readonly preguntasPorEje: number;
  readonly momentos: readonly Momento[];
  readonly cuadrantes: readonly Cuadrante[];
  readonly items: readonly Item[];
}

/** Lo que se le muestra al jugador: sin `estado`, con su momento y las opciones barajadas. */
export interface ItemServido {
  readonly id: string;
  readonly eje: Eje;
  readonly momento: string;
  readonly enunciado: string;
  readonly opciones: readonly Opcion[];
}

/** El resultado. Tres campos, **ninguno numérico** — ver el encabezado. */
export interface Resultado {
  readonly id: string;
  readonly nombre: string;
  readonly bajada: string;
}

export class PartidaImposible extends Error {}

const EJES: readonly Eje[] = ['luz-oscuridad', 'orden-caos'];

/** Fisher-Yates sobre una copia, con azar inyectable. */
function barajar<T>(xs: readonly T[], rnd: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Arma una noche: por cada momento, en orden, un ítem de cada eje.
 *
 * `vistos` son los ids que ya salieron en esta visita a la página (`BR-37`): "Empezá otra
 * noche" los pasa para que la segunda noche no repita escenas. Si una celda ya se mostró
 * entera, vuelve a tomar de todas —con tres por celda, eso pasa recién en la cuarta noche—.
 * Vive en memoria y nada más: sin `localStorage`.
 *
 * **Falla ruidoso si la noche no se puede armar**: si los momentos no son tantos como
 * `preguntasPorEje`, una partida podría salir con un eje par y empatar; si una celda está
 * vacía, la noche saldría con un momento cojo. En los dos casos tira en vez de devolver lo que
 * haya.
 */
export function sortearPartida(
  banco: Banco,
  rnd: () => number = Math.random,
  vistos: ReadonlySet<string> = new Set(),
): ItemServido[] {
  if (banco.momentos.length !== banco.preguntasPorEje) {
    throw new PartidaImposible(
      `la noche tiene ${banco.momentos.length} momentos y la partida pide ${banco.preguntasPorEje} por eje`,
    );
  }

  const servidos: ItemServido[] = [];
  for (const momento of banco.momentos) {
    for (const eje of barajar(EJES, rnd)) {
      const celda = banco.items.filter((i) => i.estado === 'listo' && i.eje === eje && i.momento === momento.id);
      if (celda.length === 0) {
        throw new PartidaImposible(`el momento ${momento.id} no tiene ningún ítem listo del eje ${eje}`);
      }
      const frescos = celda.filter((i) => !vistos.has(i.id));
      const it = barajar(frescos.length > 0 ? frescos : celda, rnd)[0]!;
      servidos.push({
        id: it.id,
        eje: it.eje,
        momento: momento.id,
        enunciado: it.enunciado,
        opciones: barajar(it.opciones, rnd),
      });
    }
  }
  return servidos;
}

/**
 * De los polos elegidos al cuadrante.
 *
 * La mayoría de cada eje **siempre existe** porque `preguntasPorEje` es impar — el schema lo
 * hace cumplir con `not: { multipleOf: 2 }`, así que no hay rama de empate que escribir.
 */
export function resolverCuadrante(banco: Banco, elegidos: readonly Polo[]): Resultado {
  const cuenta = (p: Polo) => elegidos.filter((x) => x === p).length;
  const luzOscuridad = cuenta('luz') > cuenta('oscuridad') ? 'luz' : 'oscuridad';
  const ordenCaos = cuenta('orden') > cuenta('caos') ? 'orden' : 'caos';

  const cuadrante = banco.cuadrantes.find(
    (c) => c.luzOscuridad === luzOscuridad && c.ordenCaos === ordenCaos,
  );
  if (!cuadrante) {
    throw new PartidaImposible(`no hay cuadrante para ${luzOscuridad} + ${ordenCaos}`);
  }
  return { id: cuadrante.id, nombre: cuadrante.nombre, bajada: cuadrante.bajada };
}

function cuadranteDe(banco: Banco, id: string): Cuadrante {
  const c = banco.cuadrantes.find((x) => x.id === id);
  if (!c) throw new PartidaImposible(`no hay cuadrante ${id}`);
  return c;
}

function buscar(banco: Banco, lo: Cuadrante['luzOscuridad'], oc: Cuadrante['ordenCaos']): Cuadrante {
  const c = banco.cuadrantes.find((x) => x.luzOscuridad === lo && x.ordenCaos === oc);
  if (!c) throw new PartidaImposible(`no hay cuadrante para ${lo} + ${oc}`);
  return c;
}

const otroLO = (p: Cuadrante['luzOscuridad']) => (p === 'luz' ? 'oscuridad' : 'luz');
const otroOC = (p: Cuadrante['ordenCaos']) => (p === 'orden' ? 'caos' : 'orden');

/**
 * Las cuatro maneras, en el orden de la grilla de dos por dos (`D-57` punto 7).
 *
 * **La tuya primero, para cada uno la suya.** Al lado, la que comparte tu polo de
 * luz-oscuridad (el mismo renglón); abajo, la que comparte tu polo de orden-caos (la misma
 * columna); en diagonal, la opuesta. Así el renglón de arriba es siempre tu polo de
 * luz-oscuridad y la columna de la izquierda tu polo de orden-caos, y **ninguna manera queda
 * fija arriba para todos**: el rombo de antes dejaba las dos caras de luz siempre encima, que
 * era la jerarquía que decía evitar.
 *
 * Devuelve además los rótulos de los márgenes, que son los polos y no los cuadrantes.
 */
export function disposicion(
  banco: Banco,
  id: string,
): {
  readonly celdas: readonly [Cuadrante, Cuadrante, Cuadrante, Cuadrante];
  readonly renglones: readonly [Cuadrante['luzOscuridad'], Cuadrante['luzOscuridad']];
  readonly columnas: readonly [Cuadrante['ordenCaos'], Cuadrante['ordenCaos']];
} {
  const t = cuadranteDe(banco, id);
  const lo = t.luzOscuridad;
  const oc = t.ordenCaos;
  return {
    celdas: [t, buscar(banco, lo, otroOC(oc)), buscar(banco, otroLO(lo), oc), buscar(banco, otroLO(lo), otroOC(oc))],
    renglones: [lo, otroLO(lo)],
    columnas: [oc, otroOC(oc)],
  };
}

/**
 * El plano de dos ejes del resultado, **fijo** (`D-59` enmienda 3, elegido por el usuario el
 * 2026-10-05: *"B, el fijo como el rombo viejo"*): Luz arriba y Orden a la izquierda, el mismo
 * dibujo para todos. Así se ve dónde cayó cada uno, y dos amigos con resultados opuestos miran
 * el mismo mapa.
 *
 * Es distinto de `disposicion()`, que sigue siendo relativa y ordena **la grilla** (la tuya
 * primero, para leer). El plano es el mapa; la grilla, la lista.
 *
 * Las celdas van arriba a la izquierda, arriba a la derecha, abajo a la izquierda y abajo a la
 * derecha. No hay ningún número: los lugares son los de los polos, no una medida (`BR-17`).
 */
export const PLANO_FIJO = {
  renglones: ['luz', 'oscuridad'],
  columnas: ['orden', 'caos'],
} as const satisfies {
  readonly renglones: readonly [Cuadrante['luzOscuridad'], Cuadrante['luzOscuridad']];
  readonly columnas: readonly [Cuadrante['ordenCaos'], Cuadrante['ordenCaos']];
};

export function planoFijo(banco: Banco): {
  readonly celdas: readonly [Cuadrante, Cuadrante, Cuadrante, Cuadrante];
  readonly renglones: typeof PLANO_FIJO.renglones;
  readonly columnas: typeof PLANO_FIJO.columnas;
} {
  const [arriba, abajo] = PLANO_FIJO.renglones;
  const [izquierda, derecha] = PLANO_FIJO.columnas;
  return {
    celdas: [buscar(banco, arriba, izquierda), buscar(banco, arriba, derecha), buscar(banco, abajo, izquierda), buscar(banco, abajo, derecha)],
    renglones: PLANO_FIJO.renglones,
    columnas: PLANO_FIJO.columnas,
  };
}

/** Qué comparten dos maneras: todo, un polo de un eje, o nada. Nunca quién ganó. */
export type Relacion = 'misma' | 'luz-oscuridad' | 'orden-caos' | 'opuesta';

/**
 * El contraste de `CNT-29`, entre la manera de quien juega y la de quien le mandó el enlace.
 *
 * Es simétrica a propósito: `relacion(a, b) === relacion(b, a)`. Si dependiera del orden, una
 * de las dos personas quedaría como la referencia y la otra como la desviación.
 */
export function relacion(banco: Banco, mio: string, suyo: string): Relacion {
  const a = cuadranteDe(banco, mio);
  const b = cuadranteDe(banco, suyo);
  const lo = a.luzOscuridad === b.luzOscuridad;
  const oc = a.ordenCaos === b.ordenCaos;
  if (lo && oc) return 'misma';
  if (lo) return 'luz-oscuridad';
  if (oc) return 'orden-caos';
  return 'opuesta';
}
