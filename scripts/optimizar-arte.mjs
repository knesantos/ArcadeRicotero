/**
 * Ajusta los recortes de `public/arte/` al tamaño en que la pantalla los usa de verdad.
 *
 *   node scripts/optimizar-arte.mjs            (escribe)
 *   node scripts/optimizar-arte.mjs --ver      (solo informa, no toca nada)
 *
 * ## El defecto que cierra
 *
 * Es un P3 de la auditoría del 2026-08-24, textual: *"hay originales de 560 px para
 * huecos de 57 px"*. Un recorte que se dibuja a 54 px de ancho y viaja a 560 px de ancho
 * hace que el celular baje diez veces los píxeles que va a pintar, y después los tire.
 *
 * ## La tabla manda, y la tabla sale del CSS
 *
 * Cada pieza declara **el hueco más grande en el que se dibuja**, con la regla de CSS que
 * lo fija. Si el CSS cambia, cambia esta tabla — no al revés. Es la misma regla que
 * `generar-tapas.mjs` tiene escrita para `UX-05`.
 *
 * El objetivo es **3× el hueco**: es lo que pide una pantalla de celular moderna (DPR 3)
 * para que el recorte no se vea blando. Ni más —no se gana nada—, ni menos.
 *
 * ## Nunca agranda, y nunca toca el máster
 *
 * `withoutEnlargement` de por medio: una pieza que ya está por debajo del objetivo se
 * queda como está y el script lo avisa. Los archivos de los que salieron estos recortes
 * viven en `Docs/UX/`, afuera de `public/`, así que esto se puede volver a correr.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const CARPETA = 'public/arte';

/** El hueco más grande, en píxeles de CSS, con la regla que lo fija. */
const HUECOS = [
  {
    archivo: 'oktubre-cadena.png',
    hueco: 132,
    donde: 'sitio.css `.recorte-portada` — clamp(92px, 30vw, 132px)',
  },
  {
    archivo: 'lobo-recortado.png',
    // Se usa en dos lados: el casete del portal (54 px) y la calcomanía de la ficha de
    // Lobo suelto en la Redondopedia (hasta 84 px). Manda el más grande de los dos.
    hueco: 84,
    donde: 'sitio.css `.sticker-ficha` — clamp(56px, 18vw, 84px); también `.casete-arte`, 54px',
  },
  {
    archivo: 'bondi-interplanetario.png',
    hueco: 84,
    donde: 'sitio.css `.sticker-ficha` — clamp(56px, 18vw, 84px)',
  },
  /* Los tres recortes que trajo el usuario el 2026-09-02, ya con el nombre que el codigo
     busca. Llegaron a 320×320 RGBA y entre 118 y 155 KB — de cuatro a siete veces lo que
     pesan sus hermanos ya ajustados para el mismo hueco de 84 px. */
  {
    archivo: 'cordero-rulo.png',
    hueco: 84,
    donde: 'sitio.css `.sticker-ficha` — clamp(56px, 18vw, 84px)',
  },
  {
    archivo: 'luzbelito-vela.png',
    hueco: 84,
    donde: 'sitio.css `.sticker-ficha` — clamp(56px, 18vw, 84px)',
  },
  {
    archivo: 'momo-medallon.png',
    hueco: 84,
    donde: 'sitio.css `.sticker-ficha` — clamp(56px, 18vw, 84px)',
  },
  {
    archivo: 'mosca.png',
    // La mosca del casete son 54 px, pero la misma pieza decora la pantalla "en la
    // cocina" a 140. Se mide por el techo, que es donde se vería blanda.
    hueco: 140,
    donde: 'sitio.css `.cocina-arte` — clamp(90px, 30vw, 140px); también `.casete-arte`, 54px',
  },
];

/**
 * `lobo-lupus.png` no está en la tabla **a propósito**: hoy no lo referencia ninguna
 * línea de código. Está en el despiece de `public/arte/README.md` esperando que alguien
 * lo cablee, y hasta que se sepa en qué hueco va, no hay contra qué medirlo. Un archivo
 * que no se descarga no le cuesta nada a nadie: pesa en el repo, no en el teléfono.
 */
const DPR = 3;
const soloVer = process.argv.includes('--ver');

const kb = (n) => (n / 1024).toFixed(1) + ' KB';

let ahorro = 0;

for (const { archivo, hueco, donde } of HUECOS) {
  const ruta = path.join(CARPETA, archivo);
  if (!fs.existsSync(ruta)) {
    console.log(`· ${archivo}: no está, se saltea`);
    continue;
  }

  const antes = fs.statSync(ruta).size;
  const original = await sharp(ruta).metadata();
  const objetivo = hueco * DPR;

  const salida = await sharp(ruta)
    .resize({ width: objetivo, height: objetivo, fit: 'inside', withoutEnlargement: true })
    // `palette` baja a 8 bits con dithering: en un recorte de tinta plana con transparencia
    // —que es todo lo que hay acá— no se distingue del original y pesa la mitad o menos.
    .png({ palette: true, quality: 92, effort: 10, compressionLevel: 9 })
    .toBuffer();

  const nuevo = await sharp(salida).metadata();
  const linea =
    `${archivo.padEnd(28)} ${original.width}×${original.height} ${kb(antes).padStart(9)}` +
    `  →  ${nuevo.width}×${nuevo.height} ${kb(salida.length).padStart(9)}`;

  if (nuevo.width === original.width && salida.length >= antes) {
    console.log(`= ${linea}   (ya estaba bien, no se toca)`);
    continue;
  }

  if (original.width < objetivo) {
    console.log(`⚠ ${archivo}: ${original.width} px para un hueco de ${hueco} — abajo de ${objetivo}. ${donde}`);
  }

  if (!soloVer) fs.writeFileSync(ruta, salida);
  ahorro += antes - salida.length;
  console.log(`${soloVer ? '·' : '✔'} ${linea}`);
}

console.log(`\n${soloVer ? 'Se ahorrarían' : 'Ahorrado'}: ${kb(ahorro)} en la primera carga del portal.`);
