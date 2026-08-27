/**
 * Ingiere fragmentos de audio YA RECORTADOS y escribe el manifiesto de "adiviná el tema".
 *
 *   npm run ingerir-fragmentos
 *
 * ## Por qué existe, si ya está `generar-fragmentos.mjs`
 *
 * El generador recorta los fragmentos desde los discos del usuario con ffmpeg, y en esta
 * máquina ffmpeg no está. El PR #8 trajo el camino inverso: **95 fragmentos recortados a
 * mano** (10 s, 64 kbps, mono), y lo único que falta es el manifiesto que el juego lee
 * (`src/data/adivinar-tema.json`). Este script hace solo eso: mira qué archivos hay,
 * valida cada uno contra los 105 temas de `RES-20`, mide la duración leyendo los frames
 * del mp3 —sin ffmpeg— y escribe el manifiesto.
 *
 * No recorta, no convierte, no normaliza. Si un archivo está mal, lo reporta y lo deja
 * afuera del manifiesto: el juego promete solo lo que existe y validó (`CTR-03`).
 *
 * ## La medición de duración, y su límite declarado
 *
 * Se lee el header del primer frame MPEG y se calcula duración = bytes de audio × 8 /
 * bitrate. Eso es exacto para CBR (los 95 del PR #8 lo son: todos idénticos en peso) y
 * es una aproximación para VBR. Si algún día entra un VBR y la cuenta da rara, la
 * salida es regenerar con el generador de verdad, no sofisticar este parser.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerTemas } from '../src/lib/letra/temas.ts';
import { slugDeTitulo } from '../src/lib/texto.ts';

const CARPETA = join('public', 'audio', 'fragmentos');
const CARPETA_ENTEROS = join('public', 'audio', 'temas');
const MANIFIESTO = join('src', 'data', 'adivinar-tema.json');

// ------------------------------------------------------------------ duración

const BITRATES_V1L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];

/** Los bytes de audio, salteando un tag ID3v2 si lo hay. */
function sinId3(b) {
  if (b.length > 10 && b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) {
    const largo = ((b[6] & 0x7f) << 21) | ((b[7] & 0x7f) << 14) | ((b[8] & 0x7f) << 7) | (b[9] & 0x7f);
    return b.subarray(10 + largo);
  }
  return b;
}

/** Duración en segundos, o `null` si el archivo no parece un mp3 sano. */
function duracionSeg(ruta) {
  const audio = sinId3(readFileSync(ruta));
  for (let i = 0; i < Math.min(audio.length - 4, 4096); i++) {
    if (audio[i] !== 0xff || (audio[i + 1] & 0xe0) !== 0xe0) continue;
    const version = (audio[i + 1] >> 3) & 0x03; // 3 = MPEG1
    const capa = (audio[i + 1] >> 1) & 0x03; // 1 = Layer III
    if (version !== 3 || capa !== 1) continue;
    const kbps = BITRATES_V1L3[(audio[i + 2] >> 4) & 0x0f];
    if (!kbps) continue;
    return ((audio.length - i) * 8) / (kbps * 1000);
  }
  return null;
}

// ------------------------------------------------------------------- ingesta

const porSlug = new Map(leerTemas().map((t) => [slugDeTitulo(t.titulo), t]));

const archivos = existsSync(CARPETA)
  ? readdirSync(CARPETA).filter((f) => f.endsWith('.mp3')).sort()
  : [];

const fragmentos = [];
const rechazados = [];

for (const archivo of archivos) {
  const slug = archivo.replace(/\.mp3$/, '');
  const tema = porSlug.get(slug);
  if (!tema) {
    rechazados.push(`${archivo}: no corresponde a ninguno de los 105 temas de RES-20`);
    continue;
  }
  const dur = duracionSeg(join(CARPETA, archivo));
  if (dur === null) {
    rechazados.push(`${archivo}: no se pudo leer como mp3`);
    continue;
  }
  fragmentos.push({
    slug,
    titulo: tema.titulo,
    duracionSeg: Number(dur.toFixed(2)),
    entero: existsSync(join(CARPETA_ENTEROS, archivo)),
  });
}

const manifiesto = {
  contrato: 'CTR-03',
  contratoVersion: 2,
  juego: 'adivinar-tema',
  modoRespuesta: 'buscador',
  actualizado: new Date().toISOString().slice(0, 10),
  nota:
    'Lista de archivos de audio que EXISTEN, no de temas. La escriben ' +
    'scripts/generar-fragmentos.mjs (desde los masters, con ffmpeg) o ' +
    'scripts/ingerir-fragmentos.mjs (desde fragmentos ya recortados, PR #8). ' +
    'Vacia significa que el juego todavia no tiene con que sonar, y la pantalla ' +
    'lo dice sin romperse.',
  fragmentos,
};

writeFileSync(MANIFIESTO, `${JSON.stringify(manifiesto, null, 2)}\n`, 'utf-8');

const duraciones = fragmentos.map((f) => f.duracionSeg);
const min = Math.min(...duraciones);
const max = Math.max(...duraciones);

console.log(`
  Fragmentos ingeridos:   ${fragmentos.length} de ${porSlug.size} temas
  Duraciones:             ${min.toFixed(2)} s a ${max.toFixed(2)} s
  Con tema entero:        ${fragmentos.filter((f) => f.entero).length}
  Rechazados:             ${rechazados.length}`);
for (const r of rechazados) console.log(`    - ${r}`);
console.log(`
  Manifiesto escrito en ${MANIFIESTO}.
  Ojo: la escalera (src/lib/tema/escalera.ts) no puede pedir mas segundos que el
  fragmento mas corto, o el catalogo rechaza el manifiesto entero al construir.
`);
