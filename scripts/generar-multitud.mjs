/**
 * La gente mirando: el piso del portal, recortado de la tapa de *Oktubre*.
 *
 *   node scripts/generar-multitud.mjs            (escribe)
 *   node scripts/generar-multitud.mjs --ver      (solo informa, no toca nada)
 *
 * Lo pidió el usuario el 2026-10-04, con la imagen en la mano: *"usemos esta imagen de
 * fondo de la página, sin la parte de las letras de oktubre, un fondo negro y sobre el
 * final de la página las personas mirando"*.
 *
 * ## El máster
 *
 * `Docs/INVESTIGACION/TapasDiscos/oktubre-frontal-ancha.webp`, 1280×720: la tapa de
 * *Oktubre* estirada a 16:9 por alguien, con el wordmark rojo y la multitud de Rocambole.
 * La trajo el usuario y su origen no está fichado. **Ojo con los costados:** la tapa
 * cuadrada ocupa más o menos de x=257 a x=987; lo que queda afuera son caras agregadas
 * para llenar el ancho, y no son de Rocambole. El crédito del pie dice "la tapa de
 * Oktubre" y es cierto para el centro; si algún día se ficha quién estiró la imagen, se
 * nombra acá.
 *
 * ## Qué hace
 *
 * 1. **Corta abajo del wordmark.** De `DESDE` para abajo: arranca justo arriba de los
 *    puños y las puntas de las banderas, así que las letras —y el rayo de arriba a la
 *    derecha— quedan afuera enteros.
 * 2. **Saca el negro.** El negro de la imagen no es el del sitio (es gris neutro, ~#0d0d0d,
 *    con nubes de aerógrafo encima). Se vuelve transparente, así la multitud se apoya
 *    sobre `--fondo` sin dejar un rectángulo de otro negro alrededor.
 * 3. **La vuelve a imprimir en dos tintas del sitio**, como una serigrafía: lo claro en
 *    `--papel` y las banderas en `--disco-oktubre-tinta` (el rojo de la bandera, `RES-37`).
 *    Cada píxel se separa en cuánto tiene de cada tinta: lo claro sale del canal más bajo
 *    —en un blanco los tres canales están arriba, en el rojo no—, y lo rojo de cuánto le
 *    gana el rojo a los otros dos. El borde de cada trazo conserva su alfa intermedio.
 *
 * Este archivo no tiene ni un hex: los lee de `tokens.css`, igual que `generar-pasadas.mjs`.
 * Si un token falta, se cae nombrándolo.
 *
 * ## Por qué no es una `.tapa-fondo`
 *
 * No va detrás de ningún texto: es el piso del pie de imprenta, abajo del crédito. Una tapa
 * de fondo lleva velo porque tiene letra encima (`D-21`); esto es un recorte del collage,
 * como la mosca o el lobo (`public/arte/README.md`), y va a tinta plena.
 */
import sharp from 'sharp';
import fs from 'node:fs';

const MASTER = 'Docs/INVESTIGACION/TapasDiscos/oktubre-frontal-ancha.webp';
const SALIDA = 'public/arte/multitud-oktubre.png';
const TOKENS = 'src/styles/tokens.css';

/** Primera fila del recorte. El wordmark termina en y≈245 y el primer puño asoma en y≈362. */
const DESDE = 352;

/**
 * Umbrales de la separación, en niveles de 0 a 255.
 *
 * `PISO_CLARO` se come las nubes del fondo: medidas entre el wordmark y la multitud, el
 * canal más bajo nunca pasa de 28. `PISO_ROJO` es el ruido de compresión que tiñe de rojo
 * un píxel negro. `ROJO_LLENO` es cuánto le gana el rojo a los otros dos canales en una
 * bandera: medido, 246.
 */
const PISO_CLARO = 30;
const PISO_ROJO = 20;
const ROJO_LLENO = 246;

const soloVer = process.argv.includes('--ver');
const tokens = fs.readFileSync(TOKENS, 'utf-8');

function rgbDeToken(nombre) {
  const m = tokens.match(new RegExp(`${nombre}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  if (!m) throw new Error(`generar-multitud: el token ${nombre} no está en ${TOKENS} como hex de seis dígitos`);
  const hex = m[1];
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

const PAPEL = rgbDeToken('--papel');
const ROJO = rgbDeToken('--disco-oktubre-tinta');

const meta = await sharp(MASTER).metadata();
const alto = meta.height - DESDE;
const { data, info } = await sharp(MASTER)
  .extract({ left: 0, top: DESDE, width: meta.width, height: alto })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const salida = Buffer.alloc(info.width * info.height * 4);
const limitar = (x) => Math.min(1, Math.max(0, x));

for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const claro = limitar((Math.min(r, g, b) - PISO_CLARO) / (255 - PISO_CLARO));
  const rojo = limitar((r - Math.max(g, b) - PISO_ROJO) / (ROJO_LLENO - PISO_ROJO));
  const alfa = Math.min(1, claro + rojo);
  // El color es el promedio de las dos tintas pesado por cuánto hay de cada una.
  if (alfa > 0) {
    for (let c = 0; c < 3; c++) salida[o + c] = Math.round((PAPEL[c] * claro + ROJO[c] * rojo) / (claro + rojo));
  }
  salida[o + 3] = Math.round(alfa * 255);
}

const png = await sharp(salida, { raw: { width: info.width, height: info.height, channels: 4 } })
  // Paleta, como el resto de los recortes (`optimizar-arte.mjs`): dos tintas con su alfa
  // entran holgadas en 128 colores. Sin tramado: el grano ya lo pone el sitio encima.
  // Medido: 66 KB, contra 245 en RGBA y 91 con 256 colores.
  .png({ palette: true, colors: 128, dither: 0, quality: 92, effort: 10, compressionLevel: 9 })
  .toBuffer();

console.log(`${SALIDA}: ${info.width}×${info.height}, ${(png.length / 1024).toFixed(1)} KB`);
if (!soloVer) fs.writeFileSync(SALIDA, png);
