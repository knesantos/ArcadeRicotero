/**
 * El taller de "¿Qué tipo de ricotero sos?" (`D-57` puntos 8 y 10).
 *
 *   npm run generar-dos-ejes
 *
 * Produce, y deja en el repo:
 *
 *   · `public/arte/dos-ejes/libro-franja.jpg`, `libro-canto.jpg`, `libro-esquinero.png`
 *     — las tres piezas del libro de *Luzbelito*, recortadas del frente sin el óvalo, sin la
 *     figura y sin el título (las cajas viven en `src/lib/dos-ejes/arte.ts`);
 *   · `public/tarjetas/dos-ejes/cu-1.png` … `cu-4.png` — la tarjeta vertical que se comparte
 *     (1080 × 1350);
 *   · `public/tarjetas/dos-ejes/og-cu-1.png` … `og-cu-4.png` y `og-dos-ejes.png` — las vistas
 *     previas (1200 × 630) de las cuatro postales y de la portada del juego;
 *   · `scripts/dos-ejes-manifiesto.json` — la huella de lo que entró, que
 *     `src/lib/dos-ejes/tarjetas.test.ts` vuelve a calcular.
 *
 * ## Por qué un taller y no canvas en el teléfono
 *
 * Hay cuatro identidades y ninguna lleva un dato de la persona: todo se puede fabricar una vez.
 * Fijas, las tarjetas sirven además de `og:image` —que un previsualizador no puede pedirle a
 * un canvas— y la isla las baja al pintar el resultado, así `navigator.share({ files })` sale
 * en el mismo toque. Dibujar en el teléfono con `await` antes de compartir pierde el gesto en
 * Safari.
 *
 * ## Las letras
 *
 * Las de marca salen de las fuentes del sitio, trazo por trazo, con `fontkitten`: Oktubre
 * Calco (`.woff`, que lee) y Archivo Black en `.ttf` (`scripts/fuentes/`, con su licencia
 * OFL: `fontkitten` no lee el `.woff2` que sirve el sitio). El texto largo va en la sans del
 * sistema por `librsvg`, que es lo mismo que hace `--fuente` en pantalla. Por eso el PNG puede
 * salir apenas distinto en otra máquina, y el manifiesto guarda la huella de la **entrada**,
 * no la de los píxeles.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { create } from 'fontkitten';
import { MASTER, PIEZAS, PROHIBIDO, LADO_MASTER, TARJETA as LIENZO_TARJETA, VISTA_PREVIA, sePisan } from '../src/lib/dos-ejes/arte.ts';
import { TARJETA, PANTALLA_0, lineaQueNombra, selloDePolos } from '../src/lib/dos-ejes/copy.ts';
import {
  MANIFIESTO,
  FUENTE_CALCO,
  FUENTE_ROTULADA,
  VERSION_DEL_DIBUJO,
  coloresDelTaller,
  cuadrantesDelBanco,
  huellaDelTaller,
} from '../src/lib/dos-ejes/taller.ts';

const ARTE = 'public/arte/dos-ejes';
const TARJETAS = 'public/tarjetas/dos-ejes';
mkdirSync(ARTE, { recursive: true });
mkdirSync(TARJETAS, { recursive: true });

const C = coloresDelTaller();
const CALCO = create(readFileSync(FUENTE_CALCO));
const ROTULADA = create(readFileSync(FUENTE_ROTULADA));
const SANS = 'DejaVu Sans, Liberation Sans, Arial, sans-serif';
/** El dominio, de `astro.config.mjs` y de ningún otro lado. */
const SITIO = /site:\s*'https?:\/\/([^'/]+)/.exec(readFileSync('astro.config.mjs', 'utf-8'))[1];

// ------------------------------------------------------------------ azar con semilla

/** Un generador con semilla: el grano sale igual cada vez que se corre el taller. */
function azar(semilla) {
  let s = Math.imul((semilla ^ 0x9e3779b9) >>> 0, 0x85ebca6b) >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

// ------------------------------------------------------------------ las piezas del libro

async function piezas() {
  for (const [nombre, p] of Object.entries(PIEZAS)) {
    const { caja } = p;
    if (caja.x + caja.ancho > LADO_MASTER || caja.y + caja.alto > LADO_MASTER) throw new Error(`${nombre}: la caja se sale del máster`);
    for (const [cual, prohibida] of Object.entries(PROHIBIDO)) {
      if (sePisan(caja, prohibida)) throw new Error(`${nombre}: la caja toca ${cual} (RES-168)`);
    }
    const base = sharp(MASTER).extract({ left: caja.x, top: caja.y, width: caja.ancho, height: caja.alto }).resize(p.ancho, p.alto);
    const destino = `${ARTE}/${p.archivo}`;
    if (nombre === 'esquinero') {
      // El triángulo de cuero, sin el mármol de al lado: la diagonal la marca la tapa misma.
      const mascara = `<svg xmlns="http://www.w3.org/2000/svg" width="${p.ancho}" height="${p.alto}"><polygon points="0,0 ${p.ancho},0 ${p.ancho},${p.alto}" fill="#fff"/></svg>`;
      await base
        .ensureAlpha()
        .composite([{ input: Buffer.from(mascara), blend: 'dest-in' }])
        .png({ compressionLevel: 9, palette: true, quality: 90 })
        .toFile(destino);
    } else {
      await base.jpeg({ quality: 72, mozjpeg: true }).toFile(destino);
    }
  }
}

// ------------------------------------------------------------------ letras

const ancho = (f, t, s, tracking = 0) => {
  let w = 0;
  for (const g of f.glyphsForString(t)) w += (g.advanceWidth * s) / f.unitsPerEm + tracking;
  return w;
};

/** Un renglón en la letra de marca, como trazos: no depende de qué fuentes tenga la máquina. */
function trazo(f, t, s, x, y, color, tracking = 0) {
  const k = s / f.unitsPerEm;
  let cx = 0;
  let d = '';
  for (const g of f.glyphsForString(t)) {
    d += g.path.scale(k, -k).translate(x + cx, y).toSVG();
    cx += g.advanceWidth * k + tracking;
  }
  return `<path d="${d}" fill="${color}"/>`;
}

/** Parte un texto en renglones que entran en `max`, midiendo con la fuente de verdad. */
function partir(f, t, s, max) {
  const salida = [];
  let actual = '';
  for (const p of t.split(' ')) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (ancho(f, prueba, s) > max && actual) {
      salida.push(actual);
      actual = p;
    } else actual = prueba;
  }
  if (actual) salida.push(actual);
  return salida;
}

/** El texto largo, en la sans del sistema: se parte por caracteres, que es lo que hay. */
function partirPorLargo(t, max) {
  const salida = [];
  let actual = '';
  for (const p of t.split(' ')) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (prueba.length > max && actual) {
      salida.push(actual);
      actual = p;
    } else actual = prueba;
  }
  if (actual) salida.push(actual);
  return salida;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const texto = (t, x, y, cuerpo, color, peso = 'normal') =>
  `<text x="${x}" y="${y}" font-family="${SANS}" font-weight="${peso}" font-size="${cuerpo}" fill="${color}">${esc(t)}</text>`;

/** El sello de goma: rectángulo de esquina casi viva, borde fino, mayúsculas, apenas torcido. */
function sello(t, x, y, cuerpo, color, giro = -2) {
  const w = ancho(ROTULADA, t.toUpperCase(), cuerpo, 3) + cuerpo * 1.4;
  const h = cuerpo * 2.1;
  return `<g transform="rotate(${giro} ${x} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="none" stroke="${color}" stroke-width="${Math.max(3, cuerpo / 7).toFixed(1)}"/>${trazo(ROTULADA, t.toUpperCase(), cuerpo, x + cuerpo * 0.7, y + h * 0.7, color, 3)}</g>`;
}

/** El grano de serigrafía sobre el fondo: un cuadradito cada tanto, con semilla. */
function grano(w, h, semilla) {
  const r = azar(semilla);
  let s = '';
  for (let i = 0; i < (w * h) / 900; i++) {
    const x = Math.floor(r() * w);
    const y = Math.floor(r() * h);
    s += `<rect x="${x}" y="${y}" width="3" height="3" fill="${C['--texto']}" opacity="${(0.03 + r() * 0.05).toFixed(3)}"/>`;
  }
  return s;
}

/** La cinta de papel engomado: un rectángulo translúcido, torcido. */
async function cinta(w, h, giro) {
  return sharp({ create: { width: w, height: h, channels: 4, background: { r: 237, g: 228, b: 206, alpha: 0.62 } } })
    .rotate(giro, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

/** La franja del libro a un ancho dado, torcida, con su sombra dura de papel sobre papel. */
async function libro(anchoFinal, giro) {
  const p = PIEZAS.franja;
  const alto = Math.round((anchoFinal * p.alto) / p.ancho);
  const tapa = await sharp(`${ARTE}/${p.archivo}`).resize(anchoFinal, alto).png().toBuffer();
  const sombra = await sharp({ create: { width: anchoFinal, height: alto, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.7 } } }).png().toBuffer();
  const conSombra = await sharp({ create: { width: anchoFinal + 14, height: alto + 14, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: sombra, left: 14, top: 14 },
      { input: tapa, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
  return sharp(conSombra).rotate(giro, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

const svg = (w, h, cuerpo) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${cuerpo}</svg>`);

// ------------------------------------------------------------------ la tarjeta vertical

async function tarjeta(c) {
  const { ancho: W, alto: H } = LIENZO_TARJETA;
  const M = 72;
  // La hoja: papel con borde de tinta, torcida apenas, apoyada sobre el libro.
  const hx = M;
  const hy = 230;
  const hw = W - 2 * M;
  const hh = 740;
  const tx = hx + 56;
  const tw = hw - 56 - 56 - 150; // a la derecha queda el esquinero

  let s = `<rect width="${W}" height="${H}" fill="${C['--fondo']}"/>${grano(W, H, 11)}`;
  s += trazo(CALCO, 'ARCADE RICOTERO', 62, M, M + 54, C['--marca-rojo']);
  s += trazo(ROTULADA, PANTALLA_0.titulo.toUpperCase(), 30, M, M + 106, C['--texto-tenue'], 2);

  let hoja = `<rect x="${hx + 14}" y="${hy + 14}" width="${hw}" height="${hh}" fill="#000" opacity=".55"/>`;
  hoja += `<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" fill="${C['--papel']}" stroke="${C['--fondo']}" stroke-width="6"/>`;
  hoja += trazo(ROTULADA, TARJETA.meSalio.toUpperCase(), 28, tx, hy + 96, C['--papel-tenue'], 4);
  const renglones = partir(ROTULADA, c.nombre, 84, tw);
  renglones.forEach((r, i) => (hoja += trazo(ROTULADA, r, 84, tx, hy + 196 + i * 92, C['--fondo'])));
  const finNombre = hy + 196 + (renglones.length - 1) * 92;
  hoja += sello(selloDePolos(c.luzOscuridad, c.ordenCaos), tx, finNombre + 46, 26, C['--fondo']);
  const ly = finNombre + 46 + 56 + 86;
  hoja += texto(lineaQueNombra(c.luzOscuridad, c.ordenCaos), tx, ly, 42, C['--fondo'], 'bold');
  partirPorLargo(c.bajada, 38).forEach((r, i) => (hoja += texto(r, tx, ly + 72 + i * 54, 38, C['--fondo'])));
  const capaHoja = `<g transform="rotate(-0.8 ${W / 2} ${hy + hh / 2})">${hoja}</g>`;

  s += texto(TARJETA.credito, M, H - 116, 23, C['--texto-tenue']);
  s += texto(SITIO, M, H - 84, 23, C['--texto-tenue']);
  s += trazo(ROTULADA, TARJETA.pregunta.toUpperCase(), 36, M, H - 30, C['--texto'], 2);

  const base = await sharp(svg(W, H, s)).png().toBuffer();
  const esquinero = await sharp(`${ARTE}/${PIEZAS.esquinero.archivo}`).resize(150, 171).png().toBuffer();
  const elLibro = await libro(W - 2 * M + 30, 1.6);
  return sharp(base)
    .composite([
      // Abajo de todo, el libro cerrado; arriba, la última hoja apoyada sobre la tapa.
      { input: elLibro, left: M - 20, top: hy + hh - 80 },
      { input: svg(W, H, capaHoja), left: 0, top: 0 },
      { input: esquinero, left: hx + hw - 150 - 3, top: hy + 3 },
      { input: await cinta(150, 42, -4), left: hx + hw / 2 - 75, top: hy - 22 },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toBuffer();
}

// ------------------------------------------------------------------ la vista previa

async function vistaPrevia(c) {
  const { ancho: W, alto: H } = VISTA_PREVIA;
  const hx = 48;
  const hy = 34;
  const hw = W - 96;
  const hh = 470;
  const tx = hx + 52;
  let s = `<rect width="${W}" height="${H}" fill="${C['--fondo']}"/>${grano(W, H, 13)}`;
  let hoja = `<rect x="${hx + 12}" y="${hy + 12}" width="${hw}" height="${hh}" fill="#000" opacity=".55"/>`;
  hoja += `<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" fill="${C['--papel']}" stroke="${C['--fondo']}" stroke-width="6"/>`;
  hoja += trazo(CALCO, 'ARCADE RICOTERO', 44, tx, hy + 84, C['--marca-rojo']);
  if (c) {
    hoja += trazo(ROTULADA, TARJETA.meSalio.toUpperCase(), 24, tx, hy + 140, C['--papel-tenue'], 4);
    const renglones = partir(ROTULADA, c.nombre, 74, hw - 104 - 140);
    renglones.forEach((r, i) => (hoja += trazo(ROTULADA, r, 74, tx, hy + 226 + i * 82, C['--fondo'])));
    const fin = hy + 226 + (renglones.length - 1) * 82;
    hoja += sello(selloDePolos(c.luzOscuridad, c.ordenCaos), tx, fin + 34, 24, C['--fondo']);
    hoja += texto(lineaQueNombra(c.luzOscuridad, c.ordenCaos), tx + 330, fin + 72, 34, C['--fondo'], 'bold');
  } else {
    const renglones = partir(ROTULADA, PANTALLA_0.titulo, 78, hw - 104 - 140);
    renglones.forEach((r, i) => (hoja += trazo(ROTULADA, r, 78, tx, hy + 200 + i * 88, C['--fondo'])));
    const fin = hy + 200 + (renglones.length - 1) * 88;
    // Las cuatro maneras, todas iguales: ninguna más grande ni primera.
    const nombres = cuadrantesDelBanco().map((x) => x.nombre);
    nombres.forEach((n, i) => (hoja += texto(n, tx + (i % 2) * 480, fin + 76 + Math.floor(i / 2) * 50, 32, C['--fondo'], 'bold')));
  }
  const capaHoja = `<g transform="rotate(-0.6 ${W / 2} ${hy + hh / 2})">${hoja}</g>`;
  const base = await sharp(svg(W, H, s)).png().toBuffer();
  const elLibro = await libro(W - 40, 1.2);
  const esquinero = await sharp(`${ARTE}/${PIEZAS.esquinero.archivo}`).resize(118, 135).png().toBuffer();
  return sharp(base)
    .composite([
      { input: elLibro, left: 10, top: hy + hh - 70 },
      { input: svg(W, H, capaHoja), left: 0, top: 0 },
      { input: esquinero, left: hx + hw - 118 - 3, top: hy + 3 },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toBuffer();
}

// ------------------------------------------------------------------ a disco

await piezas();
const salidas = Object.values(PIEZAS).map((p) => `${ARTE}/${p.archivo}`);
for (const c of cuadrantesDelBanco()) {
  const slug = c.id.toLowerCase();
  writeFileSync(`${TARJETAS}/${slug}.png`, await tarjeta(c));
  writeFileSync(`${TARJETAS}/og-${slug}.png`, await vistaPrevia(c));
  salidas.push(`${TARJETAS}/${slug}.png`, `${TARJETAS}/og-${slug}.png`);
}
writeFileSync(`${TARJETAS}/og-dos-ejes.png`, await vistaPrevia(null));
salidas.push(`${TARJETAS}/og-dos-ejes.png`);

writeFileSync(
  MANIFIESTO,
  `${JSON.stringify(
    {
      _comentario:
        'Lo escribe scripts/generar-dos-ejes.mjs. La huella es de lo que ENTRA (textos, colores, cajas, máster, fuentes, versión del dibujo); tarjetas.test.ts la recalcula y, si no coincide, pide volver a correr el taller.',
      version: VERSION_DEL_DIBUJO,
      huella: huellaDelTaller(),
      salidas,
    },
    null,
    2,
  )}\n`,
);
console.log(`listo: ${salidas.length} archivos`);
for (const s of salidas) console.log(`  ${s}`);
