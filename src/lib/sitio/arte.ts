/**
 * El puente entre el collage y los archivos reales de `public/arte/` y `public/tapas/`.
 *
 * El usuario recorta piezas de las tapas (el despiece completo esta en
 * `public/arte/README.md`) y las deja con el nombre acordado. Este modulo corre en
 * build (frontmatter de Astro, no en el navegador): si el recorte ya existe, la
 * pagina lo pega; si todavia no, usa el repuesto dibujado o no muestra nada.
 * Asi ningun hueco del collage rompe la pagina con una imagen quebrada.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** URL publica del recorte si ya existe; si no, el repuesto (o nada). */
export function recorte(archivo: string, repuesto: string | null = null): string | null {
  return existsSync(join(process.cwd(), 'public', 'arte', archivo)) ? `/arte/${archivo}` : repuesto;
}

/** La tapa real en baja resolucion (D-04), solo si ya esta generada. */
export function tapa(slug: string): string | null {
  return existsSync(join(process.cwd(), 'public', 'tapas', `${slug}.jpg`)) ? `/tapas/${slug}.jpg` : null;
}

/**
 * Las otras dos formas en que una tapa real puede llegar a pantalla (`D-21`, `UX-04`):
 * el detalle recortado y el fondo velado. Los produce `scripts/generar-tapas.mjs` desde
 * los masters; si todavia no se corrio, devuelven null y la pagina no muestra nada — el
 * mismo criterio que los recortes dibujados.
 */
export function detalleTapa(nombre: string): string | null {
  return existsSync(join(process.cwd(), 'public', 'tapas', 'detalle', `${nombre}.jpg`))
    ? `/tapas/detalle/${nombre}.jpg`
    : null;
}

export function fondoTapa(nombre: string): string | null {
  return existsSync(join(process.cwd(), 'public', 'tapas', 'fondo', `${nombre}.jpg`))
    ? `/tapas/fondo/${nombre}.jpg`
    : null;
}

/**
 * Que detalle de tapa viste cada seccion, bajo el mapa de `D-19` y el catalogo `UX-05`.
 * La clave es la `variante` que ya usan los casetes y las pantallas en la cocina.
 */
export const DETALLE_POR_VARIANTE: Record<string, string> = {
  marca: 'oktubre-bandera',
  mitologia: 'lobo-tiras',
  letras: 'mosca-olla',
  discos: 'bondi-circuito',
  historia: 'gulp-pincelada',
};

/** Que fondo velado viste cada pantalla "en la cocina" (`UX-05`).
 *  "Adivinar la tapa" y "Adivinar el tema" ya no estan aca: salieron de la cocina y
 *  sus paginas piden el fondo directo. */
export const FONDO_COCINA: Record<string, string> = {
  'completar-la-letra': 'mosca-olla',
};

/**
 * De que disco sale cada derivado. Existe por la condicion 1 de `D-21`: el credito a
 * Rocambole no alcanza generico, tiene que decir **que tapas se usaron en esa pantalla**.
 * Un fondo no tiene donde poner una firma al lado, asi que la pantalla la junta y la
 * pone en el pie (`UX-04`, mecanismo de credito).
 */
const DISCO_DE: Record<string, string> = {
  'oktubre-bandera': 'Oktubre',
  'oktubre-banderas': 'Oktubre',
  'oktubre-ok': 'Oktubre',
  'lobo-tiras': 'Lobo suelto',
  'mosca-olla': 'La mosca y la sopa',
  'bondi-circuito': 'Último bondi a Finisterre',
  'bondi-engranajes': 'Último bondi a Finisterre',
  'gulp-pincelada': 'Gulp!',
  'gulp-montana': 'Gulp!',
  'gulp-logo': 'Gulp!',
};

/** Los discos que aparecen en una pantalla, sin repetir y en orden de aparicion. */
export function discosDe(nombres: readonly (string | null | undefined)[]): readonly string[] {
  const vistos: string[] = [];
  for (const n of nombres) {
    const d = n ? DISCO_DE[n] : undefined;
    if (d && !vistos.includes(d)) vistos.push(d);
  }
  return vistos;
}

/**
 * Articulos donde el detalle decorativo de tapa NO va, aunque la regla general de
 * `UX-05` (7b) lo habilite. Son los tres que tratan muertes de personas con nombre: un
 * adorno al lado de ese titulo esta fuera de tono. Lo sugirio `experiencia` como llamada
 * de tono sin ficha detras y queda pendiente que lo confirme `contenido`, dueño de
 * `CNT-04` y de `CNT-06`. Mientras tanto rige la opcion conservadora.
 */
export const SIN_DETALLE_POR_TONO = new Set(['muerte-del-indio', 'walter-bulacio', 'olavarria-2017']);

/**
 * El detalle de tapa que acompaña al titulo de un articulo que NO es de disco
 * (`UX-05`, 7b y 7c). Los de disco ya muestran su propia tapa entera: superponerles el
 * recorte de otro disco confundiria cual es cual.
 */
export function detalleArticulo(tipo: string, slug: string, categoria: string): string | null {
  if (tipo === 'disco' || SIN_DETALLE_POR_TONO.has(slug)) return null;
  return detalleTapa(DETALLE_POR_VARIANTE[categoria] ?? '');
}

/** Que recorte real reemplaza a cada dibujo de repuesto (ver public/arte/README.md). */
const RECORTE_REAL: Record<string, string> = {
  '/arte/mosca.svg': 'mosca.png',
  '/arte/banderas.svg': 'multitud-banderas.png',
  '/arte/perro.svg': 'perro.png',
  '/arte/lobo.svg': 'lobo-lupus.png',
};

/** Si el usuario ya pego el recorte real de esta pieza, usarlo; si no, el dibujo. */
export function conRecorteReal(ruta: string): string {
  const real = RECORTE_REAL[ruta];
  return real ? (recorte(real, ruta) as string) : ruta;
}

/** Que pieza del despiece decora la ficha de cada disco en la Redondopedia. */
export const STICKER_DISCO: Record<string, string> = {
  'un-baion-para-el-ojo-idiota': 'muneco-antifaz.png',
  'la-mosca-y-la-sopa': 'gato-momificado.png',
  luzbelito: 'luzbelito-vela.png',
  'ultimo-bondi-a-finisterre': 'bondi-interplanetario.png',
  'momo-sampler': 'banda-superheroes.png',
  'lobo-suelto': 'lobo-lupus.png',
  'cordero-atado': 'cordero-rulo.png',
};
