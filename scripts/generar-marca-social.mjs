/**
 * Genera la cara que el sitio muestra cuando alguien lo saca a la calle.
 *
 *   node scripts/generar-marca-social.mjs
 *
 * Produce tres archivos en `public/`:
 *
 *   · `tarjeta.png`  (1200x630) — la imagen de la tarjeta al compartir (`og:image`)
 *   · `icono-180.png` (180x180)  — el icono de pantalla de inicio
 *   · `favicon.svg`              — el icono de la pestaña
 *
 * **Las tres son la marca** (`D-82`): la FR coronada que imprime `scripts/generar-logo.py` en
 * `public/marca/`. Este script no dibuja nada propio: la tarjeta es el logo completo sobre la
 * tinta con la franja roja del pie, y el icono y el favicon son la marca redonda. Si cambia la
 * marca, se corre primero `generar-logo.py` y después esto.
 *
 * **Por que un script y no tres archivos a mano.** Porque los colores salen de
 * `tokens.css` y de ningun otro lado: la regla de marca dice que ahi vive el unico hex
 * del repo, y un PNG con el rojo copiado a ojo es exactamente la clase de verdad
 * duplicada que esa regla evita. Si manana el fondo se aclara, se vuelve a correr esto y
 * la tarjeta se aclara sola.
 *
 * La descripcion de la imagen viaja en `og:image:alt` (`PORTAL.altTarjeta`, ver
 * `components/Cabeza.astro`).
 */
import { copyFileSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

// ---------------------------------------------------------------- tokens

const TOKENS = readFileSync('src/styles/tokens.css', 'utf-8');

const hex = (nombre) => {
  const hallado = new RegExp(`${nombre}\\s*:\\s*(#[0-9a-fA-F]{6})`).exec(TOKENS);
  if (!hallado) throw new Error(`tokens.css no declara ${nombre} como hex`);
  return hallado[1];
};

const MARCA = 'public/marca';

/** Un SVG de la marca, rasterizado a un alto dado. */
const marca = (archivo, alto) => sharp(readFileSync(`${MARCA}/${archivo}`), { density: 300 }).resize({ height: alto }).png().toBuffer();

// ---------------------------------------------------------------- las piezas

/**
 * La tarjeta al compartir: el logo completo, grande, sobre la tinta, con la franja roja
 * abajo — la misma tinta plana de la serigrafia, sin degradados ni sombras.
 */
async function tarjeta() {
  const A = 1200;
  const AL = 630;
  const FRANJA = 54;
  const logo = await marca('fichin-ricotero.svg', AL - FRANJA - 70);
  const { width } = await sharp(logo).metadata();
  const franja = await sharp({ create: { width: A, height: FRANJA, channels: 3, background: hex('--marca-rojo') } }).png().toBuffer();
  await sharp({ create: { width: A, height: AL, channels: 3, background: hex('--fondo') } })
    .composite([
      { input: logo, left: Math.round((A - width) / 2), top: 30 },
      { input: franja, left: 0, top: AL - FRANJA },
    ])
    .png({ compressionLevel: 9 })
    .toFile('public/tarjeta.png');
  return `tarjeta.png ${A}x${AL}`;
}

/** El icono de pantalla de inicio: la marca redonda sobre la tinta, que iOS recorta. */
async function icono() {
  const lado = 180;
  const redondo = await marca('fr-redondo.svg', lado);
  await sharp({ create: { width: lado, height: lado, channels: 3, background: hex('--fondo') } })
    .composite([{ input: redondo, left: 0, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile('public/icono-180.png');
  return `icono-180.png ${lado}x${lado}`;
}

/** La pestaña: la marca redonda en vector, tal cual sale de `generar-logo.py`. */
function favicon() {
  copyFileSync(`${MARCA}/fr-redondo.svg`, 'public/favicon.svg');
  return 'favicon.svg';
}

for (const hecho of [await tarjeta(), await icono(), favicon()]) console.log('generado:', hecho);
