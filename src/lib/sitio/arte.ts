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
