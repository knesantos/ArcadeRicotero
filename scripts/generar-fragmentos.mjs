/**
 * Genera los fragmentos de audio de "adiviná el tema" (`US-02`) desde los discos que el
 * usuario tiene en la máquina, y escribe el manifiesto que lee el sitio.
 *
 *   npm run generar-fragmentos -- "D:/Musica/Redonditos"
 *   npm run generar-fragmentos -- "D:/Musica/Redonditos" --enteros
 *   npm run generar-fragmentos -- "D:/Musica/Redonditos" --rehacer
 *
 * ## Qué produce
 *
 * | Nivel | Dónde | Cómo | Para qué |
 * |---|---|---|---|
 * | Fragmento | `public/audio/fragmentos/<slug>.mp3` | 15 s, 96 kbps, mono, 44,1 kHz | los seis pasos del reveal |
 * | Tema entero (`--enteros`) | `public/audio/temas/<slug>.mp3` | 128 kbps estéreo | `D-22`: escucharlo al revelar |
 *
 * Y `src/data/adivinar-tema.json`, que es **la lista de archivos que existen**. El
 * catálogo de temas no sale de acá: sale de `RES-20` en build.
 *
 * ## Los 2,5 GB no entran al repo, y este script es la razón por la que no hace falta
 *
 * `D-23`: la discografía en calidad de archivo se queda en la máquina como material de
 * trabajo. Al repo va este derivado, que para los 104 temas son unos 19 MB.
 *
 * ## Cómo empareja archivos con temas, y por qué puede fallar sin romper nada
 *
 * Del nombre del archivo saca un título y lo resuelve contra los 105 de `RES-20` con
 * `resolverTema()` — la misma puerta de `D-13` que usa el cancionero, con su tabla de
 * alias y su normalización dura. **Lo que no resuelve, no se genera y se informa**: es
 * preferible una lista de diez archivos sin emparejar en la consola que un mp3 con el
 * nombre equivocado adentro del sitio, porque eso último sería el juego revelando un
 * título falso.
 *
 * ## Lo que copia del contrato y lo que cambia
 *
 * Los comandos son los de `CTR-01.6` y la verificación es la tabla de `CTR-01.7` (que el
 * contrato dejó pedida como `scripts/validar_fragmentos.py` y nunca se escribió: está
 * acá adentro, corriendo sobre cada archivo apenas se genera).
 *
 * **Lo único que cambia es la duración: 15 s en vez de 10.** No lo decide este script —
 * `D-23` ya había fijado "los 15 s de `CTR-01`" al partir el audio en dos niveles, y la
 * escalera de seis pasos que pidió el usuario termina justo ahí. La constante se lee de
 * `src/lib/tema/escalera.ts`, que es la única fuente.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, basename, sep } from 'node:path';
import { resolverTema, indiceDuro } from '../src/lib/letra/temas.ts';
import { slugDeTitulo } from '../src/lib/texto.ts';
import { DURACION_FRAGMENTO_SEG } from '../src/lib/tema/escalera.ts';

const DESTINO_FRAGMENTOS = join('public', 'audio', 'fragmentos');
const DESTINO_TEMAS = join('public', 'audio', 'temas');
const MANIFIESTO = join('src', 'data', 'adivinar-tema.json');

/** Lo que ffmpeg sabe leer y el usuario puede tener. */
const EXTENSIONES = new Set(['.mp3', '.flac', '.m4a', '.wav', '.ogg', '.opus', '.aac', '.wma', '.aiff']);

/** `CTR-01.7`, adaptada a los 15 s. 96 kbps × 15 s = 180 KB; el resto es margen de trama. */
const TOPE_BYTES = 210_000;

// ---------------------------------------------------------------- argumentos

const args = process.argv.slice(2);
const banderas = new Set(args.filter((a) => a.startsWith('--')));
const carpeta = args.find((a) => !a.startsWith('--'));

if (!carpeta) {
  console.error(`
Faltó la carpeta con los discos.

  npm run generar-fragmentos -- "D:/Musica/Redonditos"

Opciones:
  --enteros   además del fragmento, deja el tema completo para escucharlo al revelar
  --rehacer   vuelve a generar los que ya estaban
  --ffmpeg=<ruta>   si ffmpeg no está en el PATH
`);
  process.exit(1);
}

if (!existsSync(carpeta)) {
  console.error(`No existe la carpeta: ${carpeta}`);
  process.exit(1);
}

const HACER_ENTEROS = banderas.has('--enteros');
const REHACER = banderas.has('--rehacer');

// ---------------------------------------------------------------- ffmpeg

/**
 * Busca ffmpeg. En Windows casi nunca está en el PATH aunque esté instalado, así que se
 * miran los lugares donde lo dejan winget, chocolatey y scoop antes de darse por vencido.
 */
function buscarBinario(nombre) {
  const explicito = args.find((a) => a.startsWith('--ffmpeg='))?.slice('--ffmpeg='.length);
  if (explicito) return nombre === 'ffmpeg' ? explicito : explicito.replace(/ffmpeg(\.exe)?$/i, `ffprobe$1`);

  const delEntorno = process.env[nombre.toUpperCase()];
  if (delEntorno) return delEntorno;

  const candidatos = [nombre];
  const home = process.env.USERPROFILE ?? process.env.HOME ?? '';
  if (process.platform === 'win32') {
    candidatos.push(
      join(home, 'scoop', 'shims', `${nombre}.exe`),
      join('C:', 'ProgramData', 'chocolatey', 'bin', `${nombre}.exe`),
      join(home, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', `${nombre}.exe`),
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

if (!FFMPEG) {
  console.error(`
No encontré ffmpeg, y sin ffmpeg no hay forma de recortar audio.

  Windows:  winget install Gyan.FFmpeg
  Mac:      brew install ffmpeg
  Linux:    sudo apt install ffmpeg

Si ya lo tenés instalado pero fuera del PATH, pasale la ruta:
  npm run generar-fragmentos -- "<carpeta>" --ffmpeg=C:/ffmpeg/bin/ffmpeg.exe
`);
  process.exit(1);
}

// ---------------------------------------------------------------- emparejar

/**
 * Saca un título del nombre de archivo.
 *
 * Lo que se le quita, en orden: la extensión, el número de pista de adelante
 * (`01 - `, `01. `, `1_`), y las acotaciones de edición del final que ninguna versión
 * del título lleva (`(remaster)`, `[en vivo]`, `- 2007 Remastered`).
 *
 * **No intenta ser inteligente.** Lo que queda se lo come `resolverTema()`, que ya
 * perdona tildes, espacios y mayúsculas, y tiene la tabla de alias escrita a mano para
 * los casos que ninguna regla resuelve.
 */
function tituloDeArchivo(ruta) {
  let t = basename(ruta, extname(ruta));
  t = t.replace(/^\s*\d{1,2}\s*[-._)]\s*/, '');
  t = t.replace(/\s*[([][^)\]]*(remaster|remasteriz|en vivo|live|bonus|version|versión)[^)\]]*[)\]]\s*/gi, ' ');
  t = t.replace(/\s*-\s*\d{4}\s*remaster.*$/i, '');
  return t.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function* archivosDe(dir) {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) yield* archivosDe(ruta);
    else if (EXTENSIONES.has(extname(entrada).toLowerCase())) yield ruta;
  }
}

const indice = indiceDuro();
const emparejados = new Map(); // slug -> { ruta, tema }
const sinEmparejar = [];

for (const ruta of archivosDe(carpeta)) {
  const tema = resolverTema(tituloDeArchivo(ruta), indice);
  if (!tema) {
    sinEmparejar.push(ruta);
    continue;
  }
  const slug = slugDeTitulo(tema.titulo);
  // Si el mismo tema aparece dos veces (un recopilatorio, una edición doble), gana el
  // archivo más pesado: casi siempre es el de mejor calidad, y en el peor caso es el
  // mismo tema. Se avisa, porque elegir por peso es una heurística y no una verdad.
  const previo = emparejados.get(slug);
  if (previo) {
    const gana = statSync(ruta).size > statSync(previo.ruta).size ? ruta : previo.ruta;
    console.log(`  ~ "${tema.titulo}" está repetido; me quedo con ${gana}`);
    emparejados.set(slug, { ruta: gana, tema });
    continue;
  }
  emparejados.set(slug, { ruta, tema });
}

console.log(`\nArchivos emparejados con RES-20: ${emparejados.size} de ${emparejados.size + sinEmparejar.length}`);

if (sinEmparejar.length > 0) {
  console.log(`\nEstos ${sinEmparejar.length} no los pude emparejar y NO se generan:`);
  for (const r of sinEmparejar) console.log(`  · ${r.split(sep).slice(-2).join('/')}`);
  console.log(`
  Puede ser material que no es de la banda (el Indio solista, Skay), o un título
  escrito distinto. Si es lo segundo, la solución es una fila en la tabla ALIAS de
  src/lib/letra/temas.ts — que es donde viven esos juicios, a la vista.`);
}

if (emparejados.size === 0) {
  console.error('\nNo hay nada que generar.');
  process.exit(1);
}

// ---------------------------------------------------------------- generar

mkdirSync(DESTINO_FRAGMENTOS, { recursive: true });
if (HACER_ENTEROS) mkdirSync(DESTINO_TEMAS, { recursive: true });

function correr(bin, argumentos) {
  const r = spawnSync(bin, argumentos, { encoding: 'utf-8' });
  if (r.error) throw r.error;
  return { ok: r.status === 0, salida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

/** `CTR-01.7`: las cinco condiciones, corridas sobre el archivo recién generado. */
function verificar(ruta) {
  if (!FFPROBE) return { ok: true, duracion: DURACION_FRAGMENTO_SEG, aviso: 'sin ffprobe, no verificado' };
  const { ok, salida } = correr(FFPROBE, [
    '-v', 'error',
    '-show_entries', 'stream=codec_name,sample_rate,channels',
    '-show_entries', 'format=duration,size',
    '-of', 'default=nw=1',
    ruta,
  ]);
  if (!ok) return { ok: false, motivo: 'ffprobe no pudo leerlo' };

  const dato = (clave) => salida.match(new RegExp(`^${clave}=(.+)$`, 'm'))?.[1]?.trim();
  const duracion = Number(dato('duration'));
  const bytes = Number(dato('size'));
  const fallas = [];
  if (dato('codec_name') !== 'mp3') fallas.push(`codec ${dato('codec_name')}`);
  if (dato('sample_rate') !== '44100') fallas.push(`sample rate ${dato('sample_rate')}`);
  if (dato('channels') !== '1') fallas.push(`${dato('channels')} canales`);
  // La trama de un MP3 son ~26 ms, así que el archivo siempre se pasa un poco: la
  // tolerancia de `CTR-01.3` no es flojera, es cómo funciona el formato.
  if (!(duracion >= DURACION_FRAGMENTO_SEG - 0.1 && duracion <= DURACION_FRAGMENTO_SEG + 0.15)) {
    fallas.push(`dura ${duracion.toFixed(2)} s`);
  }
  if (bytes > TOPE_BYTES) fallas.push(`pesa ${(bytes / 1024).toFixed(0)} KB`);

  return fallas.length === 0 ? { ok: true, duracion } : { ok: false, motivo: fallas.join(', ') };
}

const fragmentos = [];
const fallados = [];
let hechos = 0;

for (const [slug, { ruta, tema }] of [...emparejados].sort((a, b) => a[0].localeCompare(b[0]))) {
  const destino = join(DESTINO_FRAGMENTOS, `${slug}.mp3`);
  const entero = join(DESTINO_TEMAS, `${slug}.mp3`);

  if (!existsSync(destino) || REHACER) {
    // Los dos pasos de `CTR-01.6` en uno solo: se normaliza sobre el tema entero
    // (`loudnorm` lee el archivo completo) y se recorta la salida a 15 s. Emparejar
    // volúmenes importa de verdad acá — si un fragmento entra al doble de fuerte que el
    // anterior, el reveal de 0,1 s deja de ser comparable entre temas.
    const { ok, salida } = correr(FFMPEG, [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-i', ruta,
      '-af', 'loudnorm=I=-14:TP=-1:LRA=11',
      '-t', String(DURACION_FRAGMENTO_SEG),
      '-codec:a', 'libmp3lame', '-b:a', '96k', '-ar', '44100', '-ac', '1',
      '-map_metadata', '-1',
      destino,
    ]);
    if (!ok) {
      fallados.push(`${tema.titulo}: ffmpeg falló — ${salida.trim().split('\n').pop()}`);
      continue;
    }
    hechos++;
  }

  const v = verificar(destino);
  if (!v.ok) {
    fallados.push(`${tema.titulo}: ${v.motivo}`);
    continue;
  }

  if (HACER_ENTEROS && (!existsSync(entero) || REHACER)) {
    correr(FFMPEG, [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-i', ruta,
      '-af', 'loudnorm=I=-14:TP=-1:LRA=11',
      '-codec:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', '-ac', '2',
      '-map_metadata', '-1',
      entero,
    ]);
  }

  fragmentos.push({
    slug,
    titulo: tema.titulo,
    duracionSeg: Number(v.duracion.toFixed(2)),
    entero: existsSync(entero),
  });
}

// ---------------------------------------------------------------- manifiesto

const manifiesto = {
  contrato: 'CTR-03',
  contratoVersion: 2,
  juego: 'adivinar-tema',
  modoRespuesta: 'buscador',
  actualizado: new Date().toISOString().slice(0, 10),
  nota:
    'Lista de archivos de audio que EXISTEN, no de temas. La escribe ' +
    'scripts/generar-fragmentos.mjs desde los masters del usuario (D-23). Vacia ' +
    'significa que el juego todavia no tiene con que sonar, y la pantalla lo dice sin romperse.',
  fragmentos,
};

writeFileSync(MANIFIESTO, `${JSON.stringify(manifiesto, null, 2)}\n`, 'utf-8');

const pesoKB = fragmentos.length * 180;
console.log(`
Listo.

  Fragmentos generados en esta corrida: ${hechos}
  Fragmentos en el sitio:               ${fragmentos.length} de 105 temas (~${(pesoKB / 1024).toFixed(1)} MB)
  Temas enteros:                        ${fragmentos.filter((f) => f.entero).length}
  Manifiesto:                           ${MANIFIESTO}
`);

if (fallados.length > 0) {
  console.log(`No entraron ${fallados.length}, y ninguno rompe el juego:`);
  for (const f of fallados) console.log(`  · ${f}`);
}

console.log(`
Lo que falta hacer a mano, y ninguna herramienta puede hacerlo por vos (CTR-01.7):
escuchá los primeros 100 ms de tres o cuatro fragmentos. Si no se oye nada, el tema
arranca con silencio y ese recorte hay que correrlo con -ss.
`);
