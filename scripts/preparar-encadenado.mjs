/**
 * Prepara el máster del esclavo encadenado para la imprenta (`D-73`, vigesimoprimera vuelta).
 *
 *   node --experimental-strip-types scripts/preparar-encadenado.mjs [--prueba carpeta]
 *
 * El dibujo que trajo el usuario (`Docs/UX/recortes-master/esclavo-encadenado.png`) es un estarcido
 * blanco sobre negro, y el negro de adentro de la figura es igual al del fondo. Si se transparentara
 * por luminosidad, quedaría un encaje por donde se ve la prisión: es lo que le pasaba al busto de
 * Luzbelito. Así que acá se le saca la **silueta maciza** —lo blanco, con las rendijas cerradas, los
 * agujeros tapados y solo la pieza más grande— y el negro de adentro queda como tinta.
 *
 * Las cadenas no: entre eslabón y eslabón se tiene que ver lo de atrás. Adentro de los cortes de las
 * cadenas (`CADENAS` en `rig-encadenado.ts`) la silueta es la luminosidad.
 *
 * Escribe `Docs/UX/recortes-master/esclavo-encadenado-silueta.png`: el gris del dibujo con la silueta
 * en el alfa. Las tintas no se ponen acá: las pone la imprenta, con tokens (`arte-encadenado.ts`).
 * Con `--prueba carpeta` escribe además el máster con los cortes dibujados encima, para mirarlos.
 */

import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { MASTER, CADENAS, CORTES, HUECOS } = await import(pathToFileURL(resolve(raiz, 'src/lib/bestiario/rig-encadenado.ts')).href);

const W = MASTER.ancho;
const H = MASTER.alto;
const entrada = resolve(raiz, 'Docs/UX/recortes-master/esclavo-encadenado.png');
const salida = resolve(raiz, 'Docs/UX/recortes-master/esclavo-encadenado-silueta.png');

const rgb = await sharp(entrada).removeAlpha().raw().toBuffer();
const luz = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) luz[i] = 0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2];

const puntos = (p) => p.map(([x, y]) => `${x},${y}`).join(' ');
const enCadena = await sharp(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}"/>${CADENAS.map((c) => `<polygon points="${puntos(c)}" fill="#fff"/>`).join('')}</svg>`),
)
  .extractChannel(0)
  .raw()
  .toBuffer();

/** Agranda (`crece`) o achica una máscara de 0 y 1 un píxel, en cruz. */
function paso(m, crece) {
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const a = m[i], l = x > 0 ? m[i - 1] : a, r = x < W - 1 ? m[i + 1] : a, u = y > 0 ? m[i - W] : a, d = y < H - 1 ? m[i + W] : a;
      out[i] = crece ? a | l | r | u | d : a & l & r & u & d;
    }
  }
  return out;
}
const veces = (m, n, crece) => {
  for (let k = 0; k < n; k++) m = paso(m, crece);
  return m;
};

/** Las piezas conexas (en cruz): cada píxel, el número de su pieza; 0 es afuera. */
function piezas(m) {
  const lab = new Int32Array(W * H);
  const tam = [0];
  for (let s = 0; s < W * H; s++) {
    if (!m[s] || lab[s]) continue;
    const n = tam.length;
    let cuenta = 0;
    const pila = [s];
    lab[s] = n;
    while (pila.length) {
      const i = pila.pop();
      cuenta++;
      const x = i % W;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
        if (j >= 0 && j < W * H && m[j] && !lab[j]) {
          lab[j] = n;
          pila.push(j);
        }
      }
    }
    tam.push(cuenta);
  }
  return { lab, tam };
}

// Lo blanco del cuerpo: sin las cadenas y sin la raya del piso.
let m = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) m[i] = luz[i] > 110 && !enCadena[i] && Math.floor(i / W) <= MASTER.piso ? 1 : 0;
// Se cierran las rendijas entre pliegue y pliegue, y se tapan los agujeros: lo de afuera que no se
// alcanza desde el borde del máster.
m = veces(m, 7, true);
const afuera = piezas(m.map((v) => 1 - v));
const delBorde = new Set();
for (let x = 0; x < W; x++) delBorde.add(afuera.lab[x]).add(afuera.lab[(H - 1) * W + x]);
for (let y = 0; y < H; y++) delBorde.add(afuera.lab[y * W]).add(afuera.lab[y * W + W - 1]);
for (let i = 0; i < W * H; i++) if (!m[i] && !delBorde.has(afuera.lab[i])) m[i] = 1;
m = veces(m, 7, false);
const { lab, tam } = piezas(m);
const mayor = tam.indexOf(Math.max(...tam.slice(1)));
// Y se agranda dos píxeles: el mismo canto de tinta que las cadenas, para que el blanco del borde no
// toque lo de atrás.
const macizo = veces(lab.map((v) => (v === mayor ? 1 : 0)), 2, true);
const cuerpo = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) cuerpo[i] = macizo[i] && !enCadena[i] && Math.floor(i / W) <= MASTER.piso ? 255 : 0;
const canto = await sharp(cuerpo, { raw: { width: W, height: H, channels: 1 } }).blur(0.6).extractChannel(0).raw().toBuffer();

// El canto de tinta de las cadenas: lo blanco de los eslabones, agrandado tres píxeles. Es el borde
// grueso del recorte de serigrafía, y es lo que las despega de los barrotes de la celda de atrás.
let eslabones = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) eslabones[i] = enCadena[i] && luz[i] > 110 ? 1 : 0;
eslabones = veces(eslabones, 3, true);
const cantoCadena = await sharp(Buffer.from(eslabones.map((v) => v * 255)), { raw: { width: W, height: H, channels: 1 } })
  .blur(0.6)
  .extractChannel(0)
  .raw()
  .toBuffer();

const suave = (v, a, b) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const g = Math.round(luz[i]);
  rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = g;
  const piso = Math.floor(i / W) <= MASTER.piso;
  const cadena = enCadena[i] ? Math.max(Math.round(255 * suave(luz[i], 50, 170)), cantoCadena[i]) : 0;
  rgba[i * 4 + 3] = !piso ? 0 : enCadena[i] ? cadena : canto[i];
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile(salida);
console.log(`esclavo-encadenado-silueta.png  ${W}×${H}`);

if (process.argv.includes('--prueba')) {
  const carpeta = resolve(process.argv[process.argv.indexOf('--prueba') + 1]);
  mkdirSync(carpeta, { recursive: true });
  const trazos =
    Object.values(CORTES).map((c) => `<polygon points="${puntos(c)}" fill="none" stroke="#f0f" stroke-width="1.2"/>`).join('') +
    HUECOS.map((c) => `<polygon points="${puntos(c)}" fill="none" stroke="#0ff" stroke-width="0.8" stroke-dasharray="3 2"/>`).join('');
  const encima = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${trazos}</svg>`);
  // Sobre gris, para ver qué quedó macizo y qué calado.
  const junto = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 90, g: 70, b: 60, alpha: 1 } } })
    .composite([{ input: salida }, { input: encima }])
    .png()
    .toBuffer();
  await sharp(junto)
    .resize(W * 2, H * 2, { kernel: 'nearest' })
    .png()
    .toFile(resolve(carpeta, 'encadenado-cortes.png'));
  console.log(`prueba: ${resolve(carpeta, 'encadenado-cortes.png')}`);
}
