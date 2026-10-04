/**
 * Lo que del banco de "¿Qué tipo de ricotero sos?" viaja al navegador (`CTR-08` v2).
 *
 * Se sacan los retirados y las notas internas: un ítem que el juego no sirve no tiene por qué
 * llegar, y `notaInterna` es trabajo de `contenido`. Lo usan la página del juego y sus cuatro
 * postales, que sirven el mismo banco: escrito una vez, no puede derivar.
 */
import type { Banco, Cuadrante, Item, Momento } from './partida.ts';

interface Crudo {
  readonly preguntasPorEje: number;
  readonly momentos: readonly Momento[];
  readonly cuadrantes: readonly (Cuadrante & Record<string, unknown>)[];
  readonly items: readonly (Item & Record<string, unknown>)[];
}

export function servir(crudo: Crudo): Banco {
  return {
    preguntasPorEje: crudo.preguntasPorEje,
    momentos: crudo.momentos.map(({ id, nombre, canta }) => ({ id, nombre, canta })),
    cuadrantes: crudo.cuadrantes.map(({ id, luzOscuridad, ordenCaos, nombre, bajada, estado }) => ({
      id,
      luzOscuridad,
      ordenCaos,
      nombre,
      bajada,
      estado,
    })),
    items: crudo.items
      .filter((i) => i.estado === 'listo')
      .map(({ id, eje, momento, enunciado, opciones, estado }) => ({
        id,
        eje,
        momento,
        enunciado,
        opciones: opciones.map(({ texto, polo }) => ({ texto, polo })),
        estado,
      })),
  };
}
