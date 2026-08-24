/**
 * Cómo se pinta una canción. Lo comparten la ficha del tema y el cancionero armado.
 *
 * **Por qué existe este archivo y no se pinta en cada página.** El cancionero que el
 * jugador se lleva tiene que verse igual que la página de la que lo sacó — si el HTML
 * generado alinea los acordes distinto, el que lo abre con la guitarra en la mano
 * descubre que le entregamos otra cosa. Una sola función arma el renglón, y las dos
 * salidas la usan.
 *
 * Todo acá es puro: entra el tema, sale texto. Corre en build y en el navegador.
 */

import { renglonDeAcordes, type Marca } from './acordes.ts';
import type { Linea, Seccion, TemaCancionero } from './banco.ts';

/**
 * El renglón de acordes como una sola cadena, con los espacios ya puestos.
 *
 * Sale monoespaciado a propósito: la fuente alineó los acordes contando caracteres, así
 * que la única manera de que caigan sobre la sílaba correcta es contar caracteres
 * también. Ver `.cancion` en `cancionero.css`.
 */
export function textoDeAcordes(marcas: readonly Marca[], semitonos = 0, tono?: string | null): string {
  return renglonDeAcordes(marcas, semitonos, tono)
    .map((c) => ' '.repeat(c.hueco) + c.acorde)
    .join('');
}

/** Un renglón listo para pintar: el de acordes (si hay) y el de letra. */
export interface RenglonPintado {
  readonly clase: 'letra' | 'tab' | 'anotacion' | 'instrumental';
  /** El renglón de acordes ya espaciado. Cadena vacía si esta línea no lleva. */
  readonly acordes: string;
  /** Las marcas crudas, para que el navegador pueda re-transportar sin volver a pedir. */
  readonly marcas: readonly Marca[];
  readonly texto: string;
}

/** Pasa una línea del dataset a la forma que la página pinta. */
export function pintarLinea(linea: Linea, semitonos = 0, tono?: string | null): RenglonPintado {
  const marcas = linea.acordes ?? [];
  return {
    clase: linea.t,
    acordes: marcas.length ? textoDeAcordes(marcas, semitonos, tono) : '',
    marcas,
    texto: linea.texto ?? '',
  };
}

/**
 * La etiqueta visible de una sección.
 *
 * La fuente trae la suya cuando la tiene (`ESTRIBILLO:`, `[Intro]`, `Verso 1`) y viene
 * escrita de quince maneras distintas. Se respeta la de la fuente en vez de
 * normalizarla: es lo que el que transcribió quiso decir, y uniformarla no agrega nada.
 * Cuando no hay etiqueta pero sí un tipo reconocido, se usa el tipo.
 */
const NOMBRE_TIPO: Readonly<Record<string, string>> = {
  intro: 'Intro',
  verso: 'Verso',
  estribillo: 'Estribillo',
  puente: 'Puente',
  solo: 'Solo',
  final: 'Final',
};

export function etiquetaDeSeccion(seccion: Seccion): string | null {
  if (seccion.etiqueta) return seccion.etiqueta.replace(/^\[|\]$/g, '').replace(/:$/, '').trim();
  return NOMBRE_TIPO[seccion.tipo] ?? null;
}

/** Una sección lista para pintar. */
export interface SeccionPintada {
  readonly etiqueta: string | null;
  readonly renglones: readonly RenglonPintado[];
}

export function pintarTema(
  tema: TemaCancionero,
  semitonos = 0,
): readonly SeccionPintada[] {
  return tema.secciones.map((s) => ({
    etiqueta: etiquetaDeSeccion(s),
    renglones: s.lineas.map((l) => pintarLinea(l, semitonos, tema.tono)),
  }));
}

/**
 * Cómo se nombra la fuente de una letra en pantalla.
 *
 * `D-14` sacó el requisito de fuente oficial —no existe y nunca existió— pero dejó en
 * pie el que importa: **que el rótulo diga la verdad sobre lo que hay adentro**. Así que
 * cada tema dice de dónde salió su letra y cuándo se la consultó, sin adornarlo de
 * "fuente verificada" ni esconderlo en un pie de página.
 */
export function creditoDeFuente(tema: TemaCancionero): string {
  const sitio = tema.fuente.sitio ?? 'origen no declarado';
  const cuando = tema.fuente.consultado ? `, consultada el ${tema.fuente.consultado}` : '';
  return `Letra y cifrado transcriptos por fans en ${sitio}${cuando}.`;
}
