/**
 * El motor del test de dos ejes (`US-06`). Implementa `CTR-08.6`.
 *
 * Dos funciones puras, y son puras porque si no, no hay test. El azar entra por parámetro
 * con un valor por defecto: con un generador determinista, `node --test` puede afirmar que
 * salieron exactamente cinco de cada eje, que no se repite un ítem, y que el error salta
 * con el pozo corto. Un `Math.random()` incrustado convierte esas tres afirmaciones en una
 * inspección a ojo.
 *
 * **Lo que este archivo no hace, y es a propósito:** no devuelve el conteo por eje.
 * `resolverCuadrante` tiene tres campos de retorno y ninguno es un número. Es la forma de
 * hacer cumplir desde el tipo el criterio 3 de `US-06` —el test devuelve una identidad, no
 * un puntaje— en vez de confiar en que quien pinte la pantalla se acuerde. Lo que no está
 * en el tipo no se puede mostrar.
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
  readonly enunciado: string;
  readonly opciones: readonly Opcion[];
  readonly estado: string;
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
  readonly cuadrantes: readonly Cuadrante[];
  readonly items: readonly Item[];
}

/** Lo que se le muestra al jugador: sin `estado`, y con las opciones ya barajadas. */
export interface ItemServido {
  readonly id: string;
  readonly eje: Eje;
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
 * Arma una partida: `preguntasPorEje` de cada eje, intercaladas.
 *
 * **Falla ruidoso si un pozo no llega.** No sirve una partida corta: con cuatro preguntas
 * en un eje, un jugador parejo empata y el juego no tiene qué mostrar. Es la regla que
 * cierra el último agujero del empate, y por eso tira en vez de devolver lo que haya.
 */
export function sortearPartida(banco: Banco, rnd: () => number = Math.random): ItemServido[] {
  const porEje = new Map<Eje, Item[]>();
  for (const eje of EJES) {
    const pozo = banco.items.filter((i) => i.eje === eje && i.estado === 'listo');
    if (pozo.length < banco.preguntasPorEje) {
      throw new PartidaImposible(
        `el eje ${eje} tiene ${pozo.length} items listos y la partida pide ${banco.preguntasPorEje}`,
      );
    }
    porEje.set(eje, barajar(pozo, rnd).slice(0, banco.preguntasPorEje));
  }

  // Intercalado, arrancando por un eje sorteado: cinco preguntas seguidas del mismo eje se
  // leen como la misma pregunta cinco veces.
  const [primero, segundo] = barajar(EJES, rnd) as [Eje, Eje];
  const servidos: ItemServido[] = [];
  for (let i = 0; i < banco.preguntasPorEje; i++) {
    for (const eje of [primero, segundo]) {
      const it = porEje.get(eje)![i]!;
      servidos.push({
        id: it.id,
        eje: it.eje,
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
 * La mayoría de cada eje **siempre existe** porque `preguntasPorEje` es impar — el schema
 * lo hace cumplir con `not: { multipleOf: 2 }`, así que no hay rama de empate que escribir.
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
