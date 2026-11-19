/**
 * Los reels del sitio (`D-81`): video vertical de 1080x1920 para Instagram y X.
 *
 *   npm run reels -- tema DIF-13        Adiviná el tema: la escalera de audio, sin decir cuál era
 *   npm run reels -- letra DIF-14       Sacalo por la letra: versos tachados, una palabra a la vista
 *   npm run reels -- bestiario DIF-15   Bestiario redondo: se camina el infierno y se apaga antes
 *   npm run reels -- mecha DIF-16       La mecha corta: el perro de la mecha juega, erra dos veces y estalla de contento
 *   npm run reels -- duelo DIF-17       El duelo: el lobo muerde rápido y erra, el cordero escucha y la saca
 *
 * Deja `public/redes/<DIF-XX>.mp4`, que se publica con el sitio como las piezas de `redes.mjs`.
 * tema, letra y bestiario graban con `astro dev` corriendo; mecha y duelo se arman de cero y no lo necesitan.
 * Lo que hace falta afuera del repo está en `scripts/reels/motor.mjs`.
 * Con FOTOS=1,4.5 saca esas fotos sueltas en vez del video, para mirar antes de grabar.
 */
import { mkdirSync } from 'node:fs';

const REELS = ['tema', 'letra', 'bestiario', 'mecha', 'duelo'];
const [cual, id, ...resto] = process.argv.slice(2);
if (!REELS.includes(cual) || !/^DIF-\d{2,}$/.test(id ?? '')) {
  console.error(`Uso: npm run reels -- <${REELS.join('|')}> DIF-XX`);
  process.exit(1);
}
mkdirSync('public/redes', { recursive: true });
process.argv = [process.argv[0], cual, `public/redes/${id}.mp4`, ...resto];
await import(`./reels/${cual}.mjs`);
