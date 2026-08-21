/**
 * La Redondopedia: tipos, carga y grafo de enlaces.
 *
 * Implementa la parte de codigo de `US-05` y `BR-07`..`BR-09`
 * (Docs/PRODUCTO/PRD-redondopedia.md). El rotulado por afirmacion de `BR-08` vive en
 * la forma de los datos: el cuerpo de un articulo no es un bloque de texto, es una
 * lista de segmentos y CADA segmento lleva su rotulo (hecho/leyenda/testimonio) y su
 * fuente en el punto exacto donde aparece — no hay manera de escribir prosa sin
 * rotularla, que es justo lo que pide la regla.
 *
 * Contrato v0: `arquitectura` todavia debe el contrato formal (CTR-XX) que pidio
 * `Docs/SUGERENCIAS/PRD-para-arquitectura-contrato-redondopedia.md`. Esta forma es
 * la propuesta de trabajo del hilo principal; si el contrato formal cambia algo,
 * este archivo es el unico lugar del codigo que hay que tocar.
 *
 * Los enlaces internos van dentro del texto con la forma `[[slug|texto visible]]`
 * (`BR-09`: navegar como en Wikipedia). `segmentar()` los convierte en piezas que la
 * pagina pinta como <a>; `enlacesSalientes()` alimenta el chequeo del grafo, que corre
 * como test en `redondopedia.test.ts`.
 */

export type Rotulo = 'hecho' | 'leyenda' | 'testimonio';
export type TipoArticulo = 'disco' | 'persona' | 'hito' | 'concepto' | 'leyenda';

export interface Dato {
  readonly etiqueta: string;
  readonly valor: string;
  readonly rotulo: Rotulo;
  readonly fuente?: string | null;
}

export interface Segmento {
  readonly texto: string;
  readonly rotulo: Rotulo;
  readonly fuente?: string | null;
  readonly quien?: string | null;
}

export interface Articulo {
  readonly slug: string;
  readonly tipo: TipoArticulo;
  readonly titulo: string;
  readonly resumen: string;
  readonly datos: readonly Dato[];
  readonly cuerpo: readonly Segmento[];
  readonly veaTambien: readonly string[];
}

/** La mezcla D-19, heredada tal cual (PRD: "la Redondopedia hereda ese mapa").
 *  historia=Gulp!, discos=Ultimo bondi, letras=La mosca y la sopa, mitologia=Lobo. */
export const TIPO_A_CATEGORIA: Record<TipoArticulo, 'historia' | 'discos' | 'letras' | 'mitologia'> = {
  hito: 'historia',
  persona: 'historia',
  disco: 'discos',
  concepto: 'mitologia',
  leyenda: 'mitologia',
};

/** El orden narrativo de la portada: primero el que, despues el quien, despues la obra. */
export const ORDEN_PORTADA: readonly TipoArticulo[] = ['hito', 'persona', 'disco', 'concepto', 'leyenda'];

export type Pieza =
  | { readonly clase: 'texto'; readonly texto: string }
  | { readonly clase: 'enlace'; readonly slug: string; readonly texto: string };

const ENLACE = /\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g;

/** Parte el texto de un segmento en piezas de texto plano y enlaces internos. */
export function segmentar(texto: string): Pieza[] {
  const piezas: Pieza[] = [];
  let cursor = 0;
  for (const m of texto.matchAll(ENLACE)) {
    if (m.index! > cursor) piezas.push({ clase: 'texto', texto: texto.slice(cursor, m.index) });
    piezas.push({ clase: 'enlace', slug: m[1]!, texto: m[2]! });
    cursor = m.index! + m[0].length;
  }
  if (cursor < texto.length) piezas.push({ clase: 'texto', texto: texto.slice(cursor) });
  return piezas;
}

/** Todos los slugs a los que apunta un articulo: enlaces del cuerpo mas "vea tambien". */
export function enlacesSalientes(articulo: Articulo): Set<string> {
  const destinos = new Set<string>(articulo.veaTambien);
  for (const segmento of articulo.cuerpo) {
    for (const pieza of segmentar(segmento.texto)) {
      if (pieza.clase === 'enlace') destinos.add(pieza.slug);
    }
  }
  destinos.delete(articulo.slug);
  return destinos;
}

/** Agrupa por tipo respetando el orden narrativo de la portada. */
export function porTipo(articulos: readonly Articulo[]): Map<TipoArticulo, Articulo[]> {
  const grupos = new Map<TipoArticulo, Articulo[]>();
  for (const tipo of ORDEN_PORTADA) grupos.set(tipo, []);
  for (const a of articulos) grupos.get(a.tipo)?.push(a);
  return grupos;
}
