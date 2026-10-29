/**
 * Los reels del sitio (`D-81`): video vertical de 1080x1920 para Instagram y X.
 *
 *   npm run reels -- tema DIF-13        Adiviná el tema: la escalera de audio, sin decir cuál era
 *   npm run reels -- letra DIF-14       Sacalo por la letra: versos tachados, una palabra a la vista
 *   npm run reels -- bestiario DIF-15   Bestiario redondo: se camina el infierno y se apaga antes
 *
 * Deja `public/redes/<DIF-XX>.mp4`, que se publica con el sitio como las piezas de `redes.mjs`.
 * Con `astro dev` corriendo; lo que hace falta afuera del repo está en `scripts/reels/motor.mjs`.
 * Con FOTOS=1,4.5 saca esas fotos sueltas en vez del video, para mirar antes de grabar.
 */
import { mkdirSync } from 'node:fs';

const REELS = ['tema', 'letra', 'bestiario'];
const [cual, id, ...resto] = process.argv.slice(2);
if (!REELS.includes(cual) || !/^DIF-\d{2,}$/.test(id ?? '')) {
  console.error(`Uso: npm run reels -- <${REELS.join('|')}> DIF-XX`);
  process.exit(1);
}
mkdirSync('public/redes', { recursive: true });
process.argv = [process.argv[0], cual, `public/redes/${id}.mp4`, ...resto];
await import(`./reels/${cual}.mjs`);
