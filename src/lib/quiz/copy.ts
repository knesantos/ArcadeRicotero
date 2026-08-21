/**
 * El copy del quiz. Transcribe `CNT-05` (Docs/CONTENIDO/CNT-05-copy-quiz.md).
 *
 * Vive en un modulo aparte por la misma razon por la que el contenido vive en JSON: el
 * texto es de `contenido`, no del componente. Si una pantalla escribe una cadena a mano,
 * la proxima vez que `contenido` cambie el tono nadie va a encontrarla.
 *
 * Los identificadores (`A1`, `B3`, `C1`...) son los de `CNT-05`, para que un cambio alla
 * se pueda rastrear aca sin leer los dos archivos enteros.
 */

import type { ClaseDeFuente, Item } from './banco.ts';
import type { Tramo } from './tramo.ts';

/** A1, A2, A3, A4 — Pantalla 0. */
export const PANTALLA_0 = {
  titulo: 'Entrá a jugar con los Redondos, sepas lo que sepas.',
  subtitulo: 'Preguntas de historia, discos, letras y mitología ricotera.',
  botón: 'JUGÁ',
} as const;

/** A3 — reemplaza al subtitulo cuando alguien llega por un desafio. */
export function subtituloDesafio(nombre: string | undefined, puntaje: number, total: number): string {
  const quien = nombre ?? 'Alguien';
  return `${quien} sacó ${puntaje}/${total}. ¿Te la bancás?`;
}

/** B1 — cuatro variantes que rotan.
 *
 * Corrida anti-slop 2026-08-21: la cuarta variante decia "¡Con la gorra bien
 * puesta!" — jerga de utileria, y encima en la tribuna "la gorra" es la policia,
 * el bando equivocado para premiar al que sabe. Cambio hecho aca (el producto es
 * lo visible); queda propuesto a `contenido` actualizar `CNT-05` para que los
 * identificadores sigan trazando. */
export const ACIERTOS = [
  '¡Ahí la tenés!',
  '¡Sabés, che!',
  '¡Esa la clavaste!',
  '¡De una la sacaste!',
] as const;

/** B2 — cuatro variantes. Ninguna dice "mal" ni "perdiste": el texto acompaña, no marca. */
export const ERRORES = [
  'Casi. Va la que sigue.',
  'No iba. Ya la vas a acertar.',
  'Ni todo el mundo se la sabe.',
  'Esa queda para la próxima.',
] as const;

/** B3, B4 — las etiquetas de rotulo. B4 es plantilla: el testigo no siempre es el Indio. */
export const ETIQUETA_LEYENDA = 'Esto es leyenda:';
export function etiquetaTestimonio(quien: string): string {
  return `Lo contó ${quien}:`;
}

/** B5 — reemplaza el auto-avance en los items con rotulo. */
export const BOTON_SEGUIR = 'SEGUÍ';

/** C1, C2, C3 — los tres tramos de `BR-05`. */
export const TRAMOS: Record<Tramo, { titulo: string; bajada: string }> = {
  bajo: {
    titulo: 'Los molinetes siguen abiertos',
    bajada: 'Jugá las veces que quieras — acá no hay examen que aprobar.',
  },
  medio: {
    titulo: 'Ya la vas agarrando',
    bajada: 'Ya sabés más de lo que pensabas. Seguí así.',
  },
  alto: {
    titulo: 'Sos de la vieja guardia',
    bajada: 'Te la sabés de memoria. Grande, campeón.',
  },
};

/** C4, C5 — botones del resultado. */
export const BOTON_COMPARTIR = 'COMPARTIR';
export const BOTON_DE_NUEVO = 'JUGAR DE NUEVO';

/**
 * D2 — el mensaje que ve quien llego por un desafio, comparado con quien lo mando.
 *
 * `FIND-17`: esto no estaba implementado y la pantalla mostraba un string inventado en
 * el componente. Las tres variantes son de `CNT-05`, y la del medio importa: **no dice
 * "perdiste"**, invita a otra vuelta, mismo espiritu que el tramo bajo.
 */
export function comparacion(
  puntaje: number,
  total: number,
  nombre: string | undefined,
  suyo: number,
  suTotal: number,
): string {
  const quien = nombre ?? 'quien te lo mando';
  const mio = `Vos: ${puntaje}/${total}`;
  if (puntaje > suyo) return `${mio} — le ganaste a ${quien} (${suyo}/${suTotal}).`;
  if (puntaje < suyo) return `${mio} — todavía no alcanzás a ${quien} (${suyo}/${suTotal}). Dale una más.`;
  return `${mio} — empate con ${quien}. Van a tener que desempatar.`;
}

/** D1 — texto del tuit. */
export function textoParaCompartir(puntaje: number, total: number): string {
  return `Saqué ${puntaje}/${total} en el arcade ricotero. ¿Vos cuánto sacás?`;
}

/**
 * La insignia de una palabra que va **antes** de responder (`UX-01` v2).
 *
 * Va antes y no despues por una razon concreta: el jugador que conoce la historia real
 * mejor que el folclore tiene que saber, antes de tocar, que se le pregunta "que se
 * cuenta" y no "que paso". Si no, es justo el que mas sabe el que el juego marca mal.
 */
export function insignia(clase: ClaseDeFuente): string | null {
  if (clase === 'leyenda') return 'LEYENDA';
  if (clase === 'testimonio') return 'TESTIMONIO';
  return null;
}

/**
 * El sello completo que se revela **despues** de responder.
 *
 * De `testimonio` se muestran solo `quien` y `obra`: `ubicacion` y `afirmacion` son
 * insumo de auditoria de `revisor`, no de disfrute del jugador (`UX-01` v2).
 */
export function selloRevelado(item: Item): { etiqueta: string; detalle: string } | null {
  if (item.clase === 'leyenda' && item.rotuloLeyenda) {
    return { etiqueta: ETIQUETA_LEYENDA, detalle: item.rotuloLeyenda };
  }
  if (item.clase === 'testimonio' && item.testimonio) {
    return {
      etiqueta: etiquetaTestimonio(item.testimonio.quien),
      detalle: item.testimonio.obra,
    };
  }
  return null;
}

/** Elige una variante sin repetir la anterior. */
export function variante(opciones: readonly string[], anterior: string | null, azar: () => number): string {
  const posibles = opciones.filter((o) => o !== anterior);
  const pozo = posibles.length > 0 ? posibles : opciones;
  return pozo[Math.floor(azar() * pozo.length)]!;
}
