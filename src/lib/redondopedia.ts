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
export type TipoArticulo = 'disco' | 'tema' | 'persona' | 'hito' | 'concepto' | 'leyenda';

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
  // `letras` era la unica categoria del mapa que ningun tipo usaba, y le toca al tipo
  // que habla de canciones. Entro con los 6 articulos de `BR-14` (ciclo 5).
  tema: 'letras',
  concepto: 'mitologia',
  leyenda: 'mitologia',
};

/** El orden narrativo de la portada: primero el que, despues el quien, despues la obra. */
export const ORDEN_PORTADA: readonly TipoArticulo[] = [
  'hito',
  'persona',
  'disco',
  // El tema va pegado al disco: vive adentro de ese mundo, no aparte.
  'tema',
  'concepto',
  'leyenda',
];

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

/* ==================================================================
   Los hilos (`D-75`): lo que hace que, leyendo algo, den ganas de seguir

   Todo sale de lo que el artículo ya tiene escrito. Nada de acá inventa una frase: el gancho
   es el arranque del resumen, el rumor es el arranque de un párrafo rotulado leyenda (y viaja
   con su rótulo), y los entrantes son los enlaces que otros artículos ya hacen. Si mañana
   `contenido` reescribe un resumen, el gancho cambia solo.
   ================================================================== */

/** El texto de un segmento sin la marca de los enlaces: lo que el lector ve. */
export function textoPlano(texto: string): string {
  return segmentar(texto)
    .map((p) => p.texto)
    .join('');
}

/**
 * Corta un texto en la última palabra entera antes de `tope` caracteres y le pone "…" si
 * cortó. Es prosa que cuenta (registro 2): el suspensivo dice que sigue, y ahí la regla de
 * la voz lo deja (`voz-ricotera.md` §3.7).
 */
export function recortarEnPalabra(texto: string, tope: number): string {
  if (texto.length <= tope) return texto;
  const corte = texto.lastIndexOf(' ', tope - 1);
  const cabeza = texto.slice(0, corte > tope / 2 ? corte : tope - 1);
  return `${cabeza.replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Lo que hay adentro de un artículo, contado por casilla, y cuánto se tarda en leerlo. */
export interface Contenido {
  readonly hechos: number;
  readonly leyendas: number;
  readonly testimonios: number;
  readonly minutos: number;
}

/**
 * Las palabras por minuto con las que se cuenta la lectura. Doscientas es lectura en
 * pantalla chica, sin apuro y en castellano: un poco por debajo del promedio de papel, que
 * es lo que corresponde a un teléfono en la mano.
 */
const PALABRAS_POR_MINUTO = 200;

export function contenidoDe(articulo: Articulo): Contenido {
  const cuenta = { hecho: 0, leyenda: 0, testimonio: 0 };
  for (const s of articulo.cuerpo) cuenta[s.rotulo] += 1;
  const texto = [articulo.resumen, ...articulo.cuerpo.map((s) => textoPlano(s.texto))].join(' ');
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  return {
    hechos: cuenta.hecho,
    leyendas: cuenta.leyenda,
    testimonios: cuenta.testimonio,
    minutos: Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO)),
  };
}

/**
 * Quiénes dan testimonio adentro de un artículo, por su nombre y sin la cita del libro:
 * "Indio Solari, en Recuerdos que mienten un poco" queda "Indio Solari". Es lo que la
 * tarjeta promete —hay alguien con nombre contándolo ahí adentro— y el rótulo de cada
 * párrafo sigue diciendo el resto.
 */
export function vocesDe(articulo: Articulo): string[] {
  const voces: string[] = [];
  for (const s of articulo.cuerpo) {
    if (s.rotulo !== 'testimonio' || !s.quien) continue;
    const nombre = s.quien.split(/[,(]/)[0]!.trim();
    if (nombre && !voces.includes(nombre)) voces.push(nombre);
  }
  return voces;
}

/**
 * El año de un disco, leído de su ficha: el primer año de cuatro cifras de un dato que diga
 * año, salida o fecha. No se escribe a mano en ningún lado: si la ficha cambia, cambia acá.
 */
export function anioDe(articulo: Articulo): string | null {
  for (const d of articulo.datos) {
    if (!/año|salida|fecha/i.test(d.etiqueta)) continue;
    const m = /\b(19|20)\d\d\b/.exec(d.valor);
    if (m) return m[0];
  }
  return null;
}

/** El arranque del resumen, para la tarjeta que invita a abrir el artículo. */
export function ganchoDe(articulo: Articulo, tope = 130): string {
  return recortarEnPalabra(articulo.resumen, tope);
}

/**
 * Quién apunta a cada artículo: los enlaces entrantes, en el orden del archivo.
 *
 * Es la otra mitad del grafo de `BR-09`. El "vea también" dice adónde manda un artículo;
 * esto dice desde dónde lo nombran, que es lo que hace que un nombre se sienta parte de algo
 * más grande y no una ficha suelta.
 */
export function entrantesPor(articulos: readonly Articulo[]): Map<string, string[]> {
  const entrantes = new Map<string, string[]>(articulos.map((a) => [a.slug, []]));
  for (const a of articulos) {
    for (const destino of enlacesSalientes(a)) entrantes.get(destino)?.push(a.slug);
  }
  return entrantes;
}

/** Un rumor: el arranque de un párrafo rotulado leyenda, con el artículo donde vive. */
export interface Rumor {
  readonly slug: string;
  readonly titulo: string;
  readonly arranque: string;
}

/** Hasta dónde llega el arranque de un rumor, y desde dónde ya vale cortar en un punto. */
const RUMOR_TOPE = 230;
const RUMOR_PISO = 80;

/**
 * El arranque de un párrafo: hasta el último punto que caiga entre el piso y el tope, y si
 * no hay ninguno, cortado en palabra con su suspensivo. Cortado en un punto no lleva "…":
 * el enlace de abajo ya dice que sigue.
 */
export function arranqueDe(texto: string): string {
  const plano = textoPlano(texto).trim();
  if (plano.length <= RUMOR_TOPE) return plano;
  let corte = -1;
  for (const m of plano.matchAll(/[.?!](?=\s)/g)) {
    if (m.index! + 1 > RUMOR_TOPE) break;
    if (m.index! + 1 >= RUMOR_PISO) corte = m.index! + 1;
  }
  return corte > 0 ? plano.slice(0, corte) : recortarEnPalabra(plano, RUMOR_TOPE);
}

/**
 * Las palabras con las que la Redondopedia dice que algo corre de boca en boca: circula,
 * corre, cuentan, se dice, una versión, un rumor, una historia, se repite.
 *
 * No toda leyenda es un rumor. La casilla `leyenda` también rotula el dato que no tiene
 * fuente —quiénes tocaban con Skay en 2012, por ejemplo—, y eso es honesto en su artículo
 * pero no es algo que se le cuente a nadie al oído. La oreja trae solo lo que se cuenta.
 */
const SE_CUENTA = /\b(circul\w*|corr(e|en|ió|ieron|ía|ían)|cuenta[n]?|se dice|dicen|versi[oó]n\w*|rumor\w*|historias?|repet\w*|repit\w*)\b/i;

/** Si el arranque de un párrafo cuenta algo que corre de boca en boca. */
export function seCuenta(arranque: string): boolean {
  return SE_CUENTA.test(arranque);
}

/**
 * Las leyendas que circulan por la Redondopedia, una por párrafo rotulado que se cuenta.
 *
 * **Los artículos graves no prestan ninguna** (`UX-20` §3.4, `voz-ricotera.md` §6): la
 * muerte del Indio tiene un párrafo de versiones que circularon, y sacarlo de ahí para
 * ponerlo de anzuelo al pie de otro artículo es exactamente la voz que esas tres pantallas
 * no admiten.
 */
export function rumores(articulos: readonly Articulo[], graves: ReadonlySet<string>): Rumor[] {
  const lista: Rumor[] = [];
  for (const a of articulos) {
    if (graves.has(a.slug)) continue;
    for (const s of a.cuerpo) {
      if (s.rotulo !== 'leyenda') continue;
      const arranque = arranqueDe(s.texto);
      if (seCuenta(arranque)) lista.push({ slug: a.slug, titulo: a.titulo, arranque });
    }
  }
  return lista;
}

/**
 * Cuál de `cantidad` cosas toca hoy, con la fecha del teléfono de quien mira. Cambia a la
 * medianoche de ahí y no a la del servidor, y es la misma todo el día: la oreja de la
 * portada dice una leyenda por noche, no una distinta cada vez que se recarga.
 */
export function indiceDelDia(fecha: Date, cantidad: number): number {
  if (cantidad <= 0) return 0;
  const dias = Math.floor(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) / 86_400_000);
  return ((dias % cantidad) + cantidad) % cantidad;
}

/** Un número estable para un texto: el mismo slug cae siempre en el mismo lugar de la ronda. */
function semilla(texto: string): number {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.codePointAt(0)!) >>> 0;
  return h;
}

/**
 * El rumor que se le cuenta al que termina de leer `slug`: uno que vive en otro artículo, y
 * mejor si es uno al que este no manda ya —el que abre una puerta nueva—. Es determinista:
 * la misma página dice siempre lo mismo, como un libro, y no algo distinto en cada visita.
 */
export function rumorPara(slug: string, lista: readonly Rumor[], yaEnlazados: ReadonlySet<string>): Rumor | null {
  const ajenos = lista.filter((r) => r.slug !== slug);
  if (ajenos.length === 0) return null;
  const desde = semilla(slug) % ajenos.length;
  const ronda = [...ajenos.slice(desde), ...ajenos.slice(0, desde)];
  return ronda.find((r) => !yaEnlazados.has(r.slug)) ?? ronda[0]!;
}
