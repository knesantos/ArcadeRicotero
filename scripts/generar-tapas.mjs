/**
 * Genera `public/tapas/<slug>.jpg` en baja resolucion (D-04: tapas reales en baja,
 * con credito) desde los originales de `Docs/INVESTIGACION/TapasDiscos/`.
 *
 * Se corre desde la raiz del proyecto: `node scripts/generar-tapas.mjs`.
 * Los originales quedan fuera de `public/` a proposito: al sitio solo llega la
 * version chica. Si aparece un original mejor, se pisa el archivo en TapasDiscos
 * y se vuelve a correr esto.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const origen = 'Docs/INVESTIGACION/TapasDiscos';
const destino = 'public/tapas';
fs.mkdirSync(destino, { recursive: true });

// slug del articulo de la Redondopedia -> archivo original descargado.
const MAPA = {
  gulp: 'gulp-frontal.jpg',
  oktubre: 'oktubre-frontal.jpg',
  'un-baion-para-el-ojo-idiota': 'un-baion-para-el-ojo-idiota-frontal.jpg',
  'bang-bang-estas-liquidado': 'bang-bang-estas-liquidado-frontal.jpg',
  'la-mosca-y-la-sopa': 'la-mosca-y-la-sopa-frontal.jpg',
  'lobo-suelto': 'lobo-suelto-cordero-atado-cd1-frontal.jpg',
  'cordero-atado': 'lobo-suelto-cordero-atado-cd2-frontal.jpg',
  luzbelito: 'luzbelito-frontal.jpg',
  'ultimo-bondi-a-finisterre': 'ultimo-bondi-a-finisterre-frontal.jpg',
  'momo-sampler': 'momo-sampler-frontal.jpg',
};

for (const [slug, archivo] of Object.entries(MAPA)) {
  const desde = path.join(origen, archivo);
  if (!fs.existsSync(desde)) {
    console.log('FALTA', archivo);
    continue;
  }
  const hasta = path.join(destino, `${slug}.jpg`);
  await sharp(desde).resize({ width: 320, withoutEnlargement: true }).jpeg({ quality: 72 }).toFile(hasta);
  const kb = Math.round(fs.statSync(hasta).size / 1024);
  console.log('OK', `${slug}.jpg`, `${kb} KB`);
}
