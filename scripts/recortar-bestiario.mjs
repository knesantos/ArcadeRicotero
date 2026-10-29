/**
 * Recorta el lobo y el cordero de las tapas del disco doble (`D-73`, cuarta vuelta).
 *
 *   node --experimental-strip-types scripts/recortar-bestiario.mjs [--prueba carpeta]
 *
 * Lee `src/lib/bestiario/recortes.ts`: cada pieza dice de qué frente sale y con qué polígono
 * se corta. Arma la máscara —el polígono, soplado en el borde; cruzado con la silueta del
 * cordero si hace falta; con los cantos de la tapa fundidos si la figura sigue más allá—, la
 * aplica sobre el frente, recorta la caja y la achica, y escribe `public/bestiario/<pieza>.webp`.
 *
 * Con `--prueba carpeta` escribe además cada frente con los polígonos dibujados encima, para
 * corregirlos a ojo.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { RECORTES, FUENTES, LADO_TAPA, REDUCCION, cajaDeRecorte } = await import(
  pathToFileURL(resolve(raiz, 'src/lib/bestiario/recortes.ts')).href
);

const { leerDeclaraciones, resolverToken } = await import(pathToFileURL(resolve(raiz, 'src/lib/pixel/tokens.ts')).href);
const { valores } = leerDeclaraciones(readFileSync(resolve(raiz, 'src/styles/tokens.css'), 'utf-8'));
/** El color de un token, como tres números. */
function rgbDe(token) {
  const r = resolverToken(valores, token);
  if ('error' in r) throw new Error(r.error);
  return [1, 3, 5].map((i) => parseInt(r.hex.slice(i, i + 2), 16));
}

const L = LADO_TAPA;
const salida = resolve(raiz, 'public/bestiario');
mkdirSync(salida, { recursive: true });

/** Una imagen gris de L × L a partir de un SVG. */
async function gris(svg) {
  return sharp(Buffer.from(svg)).resize(L, L).extractChannel(0).raw().toBuffer();
}

const fuentes = {};
for (const [clave, ruta] of Object.entries(FUENTES)) {
  fuentes[clave] = await sharp(resolve(raiz, ruta)).resize(L, L).removeAlpha().raw().toBuffer();
}

// La silueta del cordero: el recorte del repo (el frente entero achicado y sin fondo), al tamaño grande.
const silueta = await sharp(resolve(raiz, 'public/arte/cordero-rulo.png'))
  .ensureAlpha()
  .extractChannel(3)
  .resize(L, L, { kernel: 'cubic' })
  .blur(1.2)
  .raw()
  .toBuffer();

/** Agranda (`crece`) o achica una máscara de 0 y 1 un píxel, en cruz. */
function paso(m, crece) {
  const out = new Uint8Array(L * L);
  for (let y = 0; y < L; y++) {
    for (let x = 0; x < L; x++) {
      const i = y * L + x;
      const v = [m[i], x > 0 ? m[i - 1] : m[i], x < L - 1 ? m[i + 1] : m[i], y > 0 ? m[i - L] : m[i], y < L - 1 ? m[i + L] : m[i]];
      out[i] = crece ? Math.max(...v) : Math.min(...v);
    }
  }
  return out;
}
const veces = (m, n, crece) => {
  for (let k = 0; k < n; k++) m = paso(m, crece);
  return m;
};

/** Las piezas conexas de una máscara (en cruz): cada píxel, el número de su pieza; 0 es afuera. */
function piezas(m) {
  const lab = new Int32Array(L * L);
  const tam = [0];
  for (let s = 0; s < L * L; s++) {
    if (!m[s] || lab[s]) continue;
    const n = tam.length;
    let cuenta = 0;
    const pila = [s];
    lab[s] = n;
    while (pila.length) {
      const i = pila.pop();
      cuenta++;
      const x = i % L;
      for (const j of [x > 0 ? i - 1 : -1, x < L - 1 ? i + 1 : -1, i - L, i + L]) {
        if (j >= 0 && j < L * L && m[j] && !lab[j]) {
          lab[j] = n;
          pila.push(j);
        }
      }
    }
    tam.push(cuenta);
  }
  return { lab, tam };
}

/**
 * La silueta maciza (`macizo`): lo que se aleja del color del fondo, adentro del polígono; se le
 * sacan las motas, se le cierran las grietas, se le tapan los agujeros y queda la pieza más grande.
 * Solo el canto se sopla.
 */
async function siluetaMaciza(r, rgb, mascara, pintado) {
  const { fondo, umbral, canto } = r.macizo;
  let m = new Uint8Array(L * L);
  const distancia = new Float32Array(L * L);
  for (let i = 0; i < L * L; i++) {
    distancia[i] = Math.hypot(rgb[i * 3] - fondo[0], rgb[i * 3 + 1] - fondo[1], rgb[i * 3 + 2] - fondo[2]);
    m[i] = mascara[i] > 127 && distancia[i] > umbral ? 1 : 0;
  }
  m = veces(veces(m, 2, false), 2, true);
  m = veces(veces(m, 4, true), 4, false);
  if (r.macizo.incluye?.length) {
    const aMano = await gris(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}"><rect width="${L}" height="${L}" fill="#000"/>` +
        r.macizo.incluye.map((p) => `<polygon points="${puntos(p)}" fill="#fff"/>`).join('') +
        `</svg>`,
    );
    for (let i = 0; i < L * L; i++) if (aMano[i] > 127) m[i] = 1;
  }
  if (pintado) for (let i = 0; i < L * L; i++) if (pintado[i]) m[i] = 1;
  // Los agujeros: lo de afuera que no se alcanza desde el borde de la tapa.
  const afuera = piezas(m.map((v) => 1 - v));
  const delBorde = new Set();
  for (let k = 0; k < L; k++) for (const i of [k, (L - 1) * L + k, k * L, k * L + L - 1]) delBorde.add(afuera.lab[i]);
  for (let i = 0; i < L * L; i++) if (!m[i] && !delBorde.has(afuera.lab[i])) m[i] = 1;
  const { lab, tam } = piezas(m);
  const mayor = tam.indexOf(Math.max(...tam.slice(1)));
  for (let i = 0; i < L * L; i++) m[i] = lab[i] === mayor ? 1 : 0;
  // El canto se pela: el cierre deja un ribete del negro del fondo pegado a la figura, que se lee
  // como un contorno oscuro. Lo del borde que todavía se parece al fondo, se va.
  for (let k = 0; k < (r.macizo.pelar ?? 0); k++) {
    const borde = paso(m, false);
    for (let i = 0; i < L * L; i++) if (m[i] && !borde[i] && !pintado?.[i] && distancia[i] < umbral * 2) m[i] = 0;
  }
  const alfa = Buffer.alloc(L * L);
  for (let i = 0; i < L * L; i++) alfa[i] = m[i] ? 255 : 0;
  return sharp(alfa, { raw: { width: L, height: L, channels: 1 } }).blur(canto).extractChannel(0).raw().toBuffer();
}

const puntos = (poligono) => poligono.map(([x, y]) => `${x},${y}`).join(' ');

for (const r of RECORTES) {
  const mascara = await gris(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}">` +
      `<defs><filter id="p" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${r.plumado}"/></filter></defs>` +
      `<rect width="${L}" height="${L}" fill="#000"/><polygon points="${puntos(r.poligono)}" fill="#fff" filter="url(#p)"/></svg>`,
  );
  let rgb = fuentes[r.fuente];
  if (r.tenido) {
    // La tapa como textura: lo negro queda en el negro del sitio, lo claro se tiñe.
    const negro = rgbDe('--fondo');
    const medio = rgbDe(r.tenido.medio);
    const claro = rgbDe(r.tenido.claro);
    const teñida = Buffer.alloc(L * L * 3);
    for (let i = 0; i < L * L; i++) {
      const [R, G, Bz] = [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]];
      let t = (0.299 * R + 0.587 * G + 0.114 * Bz) / 255;
      if (r.tenido.sinVerde && G > R + 30 && G > Bz + 30) t = 0;
      const [a, b, k] = t < 0.5 ? [negro, medio, t / 0.5] : [medio, claro, (t - 0.5) / 0.5];
      for (let c = 0; c < 3; c++) teñida[i * 3 + c] = Math.round(a[c] + (b[c] - a[c]) * k);
    }
    rgb = teñida;
  }
  let pintado = null;
  if (r.pintado) {
    // Lo repintado va encima de la tapa, con su alfa, y cuenta como figura.
    const hex = (token) => '#' + rgbDe(token).map((v) => v.toString(16).padStart(2, '0')).join('');
    const capa = await sharp(
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}">${r.pintado(hex)}</svg>`),
    )
      .resize(L, L)
      .ensureAlpha()
      .raw()
      .toBuffer();
    const encima = Buffer.from(rgb);
    pintado = new Uint8Array(L * L);
    for (let i = 0; i < L * L; i++) {
      const a = capa[i * 4 + 3] / 255;
      for (let c = 0; c < 3; c++) encima[i * 3 + c] = Math.round(rgb[i * 3 + c] * (1 - a) + capa[i * 4 + c] * a);
      pintado[i] = a > 0.5 ? 1 : 0;
    }
    rgb = encima;
  }
  const solida = r.macizo ? await siluetaMaciza(r, rgb, mascara, pintado) : null;
  const rgba = Buffer.alloc(L * L * 4);
  for (let i = 0; i < L * L; i++) {
    let a = solida ? solida[i] / 255 : mascara[i] / 255;
    if (r.conSilueta) a *= silueta[i] / 255;
    if (r.fondoOscuro) {
      // Fondo negro, figura clara: lo oscuro se va, y el borde se funde.
      const lum = 0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2];
      const { desde, hasta } = r.fondoOscuro;
      a *= Math.max(0, Math.min(1, (lum - desde) / (hasta - desde)));
    }
    if (r.fundirBordes) {
      // El canto de la tapa: la figura sigue más allá, así que se funde en 70 píxeles.
      const x = i % L;
      const y = Math.floor(i / L);
      a *= Math.min(1, x / 70) * Math.min(1, y / 70);
    }
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = Math.round(a * 255);
  }
  const [x, y, ancho, alto] = cajaDeRecorte(r);
  const buffer = await sharp(rgba, { raw: { width: L, height: L, channels: 4 } })
    .extract({ left: x, top: y, width: ancho, height: alto })
    .resize(Math.round(ancho * (r.reduccion ?? REDUCCION)), Math.round(alto * (r.reduccion ?? REDUCCION)))
    .webp({ quality: 86, alphaQuality: 90, effort: 5 })
    .toBuffer();
  writeFileSync(resolve(salida, `${r.nombre}.webp`), buffer);
  const k = r.reduccion ?? REDUCCION;
  console.log(`${r.nombre}.webp  ${Math.round(ancho * k)}×${Math.round(alto * k)}  ${Math.round(buffer.length / 1024)} kB`);
}

const i = process.argv.indexOf('--prueba');
if (i > 0) {
  const carpeta = process.argv[i + 1];
  for (const fuente of Object.keys(FUENTES)) {
    const poligonos = RECORTES.filter((r) => r.fuente === fuente)
      .map((r, n) => `<polygon points="${puntos(r.poligono)}" fill="none" stroke="${['#ff2222', '#22ff66', '#ffcc00', '#22ccff'][n % 4]}" stroke-width="3"/>`)
      .join('');
    await sharp(resolve(raiz, FUENTES[fuente]))
      .resize(L, L)
      .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}">${poligonos}</svg>`) }])
      .png()
      .toFile(resolve(carpeta, `prueba-${fuente}.png`));
  }
  console.log(`pruebas en ${carpeta}`);
}
