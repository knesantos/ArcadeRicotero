/**
 * Sincroniza el "Escuchar" de las fichas del bestiario con el verso de cada bestia (`D-78`).
 *
 *   npm run sincronizar-bestiario -- "<carpeta de discos>" ["<otra carpeta>" ...]
 *   npm run sincronizar-bestiario -- "<carpeta>" --ids=la-bestia-pop,el-morta
 *   npm run sincronizar-bestiario -- "<carpeta>" --rehacer
 *
 * ## Qué hace, por bestia
 *
 * 1. Busca el máster de su tema en las carpetas que se le pasan (por el título que va después
 *    del último " - " en el nombre del archivo). **Los másteres solo se leen**: ni se mueven, ni
 *    se renombran, ni se escribe nada al lado.
 * 2. Mide cuánto dura con ffprobe.
 * 3. Le pregunta a LRCLIB las versiones sincronizadas del tema, se queda con la de duración más
 *    parecida (`lib/bestiario/sincro.ts`) y ubica el renglón del verso. De LRCLIB se guarda
 *    **solo el segundo**, nunca la letra.
 * 4. Corta 10 s del máster desde un poco antes de ese segundo y los deja en
 *    `public/audio/bestiario/<id>.mp3`, al mismo volumen que los fragmentos.
 * 5. Anota el resultado en `src/data/bestiario-sincro.json`, que es lo que lee el sitio.
 *
 * Lo que no puede sincronizar (sin máster, sin versión que dure lo mismo, verso que no aparece)
 * no lo corta y lo deja anotado en `sinSincronizar`: esa bestia sigue sonando como hasta hoy.
 *
 * Las de `DESDE_EL_ARRANQUE` (`lib/bestiario/sincro.ts`) no buscan su verso: el recorte va desde el
 * segundo cero del máster, que es el arranque del tema, y no le pregunta nada a LRCLIB.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { normalizar } from '../src/lib/texto.ts';
import { DESDE_EL_ARRANQUE, elegirVersion, ubicarVerso } from '../src/lib/bestiario/sincro.ts';
import { SEGUNDOS_POR_TEMA } from '../src/scripts/rocola.ts';

const DESTINO = join('public', 'audio', 'bestiario');
const MANIFIESTO = join('src', 'data', 'bestiario-sincro.json');
const EXTENSIONES = new Set(['.flac', '.mp3', '.wav', '.m4a', '.ogg', '.aiff']);
/** Se arranca un poco antes del renglón: los tiempos de LRCLIB marcan la sílaba, no el aire. */
const PREVIO_SEG = 0.35;
/** El recorte dura lo que la rocola deja sonar, y se apaga en el último tramo. */
const DURACION_SEG = SEGUNDOS_POR_TEMA;
const SALIDA_SEG = 1.5;

// ---------------------------------------------------------------- argumentos

const args = process.argv.slice(2);
const carpetas = args.filter((a) => !a.startsWith('--'));
const REHACER = args.includes('--rehacer');
const IDS = args.find((a) => a.startsWith('--ids='))?.slice('--ids='.length).split(',').filter(Boolean);

if (!carpetas.length) {
  console.error('\nFaltó la carpeta con los discos.\n\n  npm run sincronizar-bestiario -- "C:/Musica/Redonditos" [--ids=a,b] [--rehacer]\n');
  process.exit(1);
}

// ---------------------------------------------------------------- ffmpeg

/** Igual que `generar-fragmentos.mjs`: en Windows winget lo deja fuera del PATH de la sesión. */
function buscarBinario(nombre) {
  const explicito = args.find((a) => a.startsWith('--ffmpeg='))?.slice('--ffmpeg='.length);
  if (explicito) return nombre === 'ffmpeg' ? explicito : explicito.replace(/ffmpeg(\.exe)?$/i, `ffprobe$1`);
  const home = process.env.USERPROFILE ?? process.env.HOME ?? '';
  const candidatos = [nombre];
  if (process.platform === 'win32') {
    candidatos.push(
      join(home, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', `${nombre}.exe`),
      join(home, 'scoop', 'shims', `${nombre}.exe`),
      join('C:', 'ProgramData', 'chocolatey', 'bin', `${nombre}.exe`),
    );
  }
  for (const c of candidatos) {
    const r = spawnSync(c, ['-version'], { stdio: 'ignore' });
    if (!r.error && r.status === 0) return c;
  }
  return null;
}

const FFMPEG = buscarBinario('ffmpeg');
const FFPROBE = buscarBinario('ffprobe');
if (!FFMPEG || !FFPROBE) {
  console.error('\nNo encontré ffmpeg/ffprobe. En Windows: winget install Gyan.FFmpeg\n');
  process.exit(1);
}

function duracionDe(ruta) {
  const r = spawnSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', ruta], { encoding: 'utf8' });
  const d = Number(r.stdout.trim());
  return Number.isFinite(d) && d > 0 ? d : null;
}

// ---------------------------------------------------------------- másteres

function archivos(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...archivos(p));
    else if (EXTENSIONES.has(extname(n).toLowerCase())) out.push(p);
  }
  return out;
}

/**
 * Título normalizado → rutas. Puede haber más de un archivo con el mismo título (una carpeta de
 * recortes al lado de los discos): se usa el más largo, que es el tema entero.
 */
const masters = new Map();
for (const c of carpetas) {
  for (const p of archivos(c)) {
    const t = normalizar(basename(p, extname(p)).split(' - ').pop());
    masters.set(t, [...(masters.get(t) ?? []), p]);
  }
}

function masterDe(titulo) {
  let mejor = null;
  for (const ruta of masters.get(normalizar(titulo)) ?? []) {
    const dur = duracionDe(ruta);
    if (dur && (!mejor || dur > mejor.dur)) mejor = { ruta, dur };
  }
  return mejor;
}

// ---------------------------------------------------------------- LRCLIB

async function versiones(titulo) {
  const q = new URLSearchParams({ q: `${titulo} Redonditos` });
  for (let intento = 0; intento < 6; intento++) {
    try {
      const r = await fetch(`https://lrclib.net/api/search?${q}`, { headers: { 'User-Agent': 'fichin-ricotero/1.0' } });
      const datos = await r.json();
      if (Array.isArray(datos)) return datos;
    } catch {}
    // LRCLIB contesta "ocupado" seguido: se espera cada vez un poco más.
    await new Promise((ok) => setTimeout(ok, 3000 * (intento + 1)));
  }
  return null;
}

// ---------------------------------------------------------------- corrida

const bestiario = JSON.parse(readFileSync(join('src', 'data', 'bestiario.json'), 'utf8'));
const cancionero = JSON.parse(readFileSync(join('src', 'data', 'cancionero.json'), 'utf8'));
const tituloDe = new Map(cancionero.temas.map((t) => [t.slug, t.titulo]));
const previo = existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, 'utf8')) : { recortes: [], sinSincronizar: [] };
const hechos = new Map(previo.recortes.map((r) => [r.id, r]));
const pendientes = new Map(previo.sinSincronizar.map((r) => [r.id, r]));

const elegidas = bestiario.bestias.filter((b) => b.verso && (!IDS || IDS.includes(b.id)));
if (IDS) for (const id of IDS) if (!elegidas.some((b) => b.id === id)) console.warn(`  · ${id}: no es una bestia con verso`);
mkdirSync(DESTINO, { recursive: true });

const cache = new Map();
for (const b of elegidas) {
  if (!REHACER && hechos.has(b.id) && existsSync(join(DESTINO, `${b.id}.mp3`))) continue;
  const titulo = tituloDe.get(b.tema);
  const falla = (motivo) => {
    hechos.delete(b.id);
    pendientes.set(b.id, { id: b.id, tema: b.tema, motivo });
    console.log(`  ✕ ${b.id}: ${motivo}`);
  };

  const m = masterDe(titulo);
  if (!m) { falla('no está el máster en las carpetas, o ffprobe no lo pudo medir'); continue; }
  const { ruta: master, dur } = m;

  // Desde el arranque: el segundo cero, sin verso ni LRCLIB.
  const arranque = DESDE_EL_ARRANQUE.has(b.id);
  let lugar = { seg: 0, coincidencia: 1 };
  let version = null;
  if (!arranque) {
    if (!cache.has(b.tema)) cache.set(b.tema, await versiones(titulo));
    const lista = cache.get(b.tema);
    if (!lista) { falla('LRCLIB no contestó'); continue; }
    version = elegirVersion(lista, dur);
    if (!version) { falla('LRCLIB no tiene una versión sincronizada que dure lo mismo que el máster'); continue; }
    lugar = ubicarVerso(version.syncedLyrics, b.verso[0]);
    if (!lugar) { falla('el verso no aparece en la versión de LRCLIB'); continue; }
  }

  const desde = arranque ? 0 : Math.max(0, lugar.seg - PREVIO_SEG);
  const salida = join(DESTINO, `${b.id}.mp3`);
  // El corte va en la entrada (`-ss` / `-t`), que es exacto y no lee el resto del tema.
  // `loudnorm` sobre esos 10 s los deja al volumen de los fragmentos (-14 LUFS).
  const filtro = ['loudnorm=I=-14:TP=-1:LRA=11', 'afade=t=in:d=0.08', `afade=t=out:st=${DURACION_SEG - SALIDA_SEG}:d=${SALIDA_SEG}`].join(',');
  const r = spawnSync(
    FFMPEG,
    ['-y', '-v', 'error', '-ss', desde.toFixed(2), '-t', String(DURACION_SEG), '-i', master, '-af', filtro,
      '-codec:a', 'libmp3lame', '-b:a', '96k', '-ar', '44100', '-ac', '1', '-map_metadata', '-1', salida],
    { encoding: 'utf8' },
  );
  if (r.status !== 0) { falla(`ffmpeg falló — ${(r.stderr ?? '').trim().split('\n').pop()}`); continue; }

  pendientes.delete(b.id);
  hechos.set(
    b.id,
    arranque
      ? { id: b.id, tema: b.tema, desdeSeg: 0, arranque: true, duracionMasterSeg: Number(dur.toFixed(1)) }
      : {
          id: b.id,
          tema: b.tema,
          desdeSeg: Number(lugar.seg.toFixed(2)),
          coincidencia: Number(lugar.coincidencia.toFixed(2)),
          lrclib: version.id,
          duracionMasterSeg: Number(dur.toFixed(1)),
          difDuracionSeg: Number((version.duration - dur).toFixed(1)),
        },
  );
  console.log(arranque ? `  ✔ ${b.id}: desde el arranque del tema` : `  ✔ ${b.id}: ${lugar.seg.toFixed(2)} s (coincide ${Math.round(lugar.coincidencia * 100)} %)`);
}

const orden = new Map(bestiario.bestias.map((b, i) => [b.id, i]));
const porOrden = (a, b) => orden.get(a.id) - orden.get(b.id);
writeFileSync(
  MANIFIESTO,
  `${JSON.stringify(
    {
      decision: 'D-78',
      actualizado: new Date().toISOString().slice(0, 10),
      nota: 'Lo escribe scripts/sincronizar-bestiario.mjs. desdeSeg es el segundo del máster donde empieza el verso, sacado de LRCLIB (lrclib.net); de ahí no se guarda la letra. Los que tienen arranque: true van desde el segundo cero del tema, sin LRCLIB. Cada recorte vive en public/audio/bestiario/<id>.mp3.',
      recortes: [...hechos.values()].sort(porOrden),
      sinSincronizar: [...pendientes.values()].sort(porOrden),
    },
    null,
    2,
  )}\n`,
);
console.log(`\n  Sincronizadas: ${hechos.size} · sin sincronizar: ${pendientes.size} · ${MANIFIESTO}\n`);
