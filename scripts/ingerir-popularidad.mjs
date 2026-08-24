/**
 * Popularidad por tema, medida en YouTube. Implementa `CTR-07`.
 *
 * ─── Las dos fases, y por qué son dos ──────────────────────────────────────────────
 *
 *   node scripts/ingerir-popularidad.mjs --resolver     ← escribe SOLO el bloque `video`
 *   node scripts/ingerir-popularidad.mjs                ← escribe SOLO `medicion`
 *
 * `CTR-07.4` las separa por dos razones y la segunda es la que manda. La primera es de
 * cuota: `videos.list` cuesta 1 unidad y toma 50 ids por llamada, mientras que buscar
 * cuesta 100 por tema — 105 búsquedas son 10.500 unidades sobre una cuota diaria de 10.000
 * (`RES-52` c). La segunda no depende de eso: **en el bloque `video` hay una decisión
 * declarada** —cuál es "el" video de ese tema— y en `medicion` no hay ninguna. Una corrida
 * automática puede pisar un número; no puede pisar un criterio.
 *
 * ─── Dónde ocurre la llamada ───────────────────────────────────────────────────────
 *
 * Acá, en la máquina del usuario, con su clave en el entorno. **Nunca en el build y nunca
 * en el navegador** (`CTR-07.5`, `D-15`): el sitio es estático y la clave no se le sirve a
 * nadie. Lo que viaja al repo es el JSON, no la credencial.
 *
 *   YT_API_KEY=... node scripts/ingerir-popularidad.mjs
 *
 * ─── Sin clave no es un error ──────────────────────────────────────────────────────
 *
 * Sin `YT_API_KEY` el script **no falla**: deja el archivo con los 105 temas de `RES-20` en
 * `sin-video`, cada uno con su motivo escrito, y dice el comando. Es el mismo criterio con
 * que `adivinar-tema.json` maneja no tener audio — vacío es un estado válido **y se
 * declara**, que es lo contrario de un hueco mudo.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { leerTemas, resolverTema, indiceDuro } from '../src/lib/letra/temas.ts';

const DESTINO = 'src/data/popularidad.json';

/** El canal Topic, el que arma YouTube desde el distribuidor y no un fan (`RES-52` a). */
const TOPIC = {
  id: 'UCv6PTVMYCpYJDBK4YiJz_4g',
  nombre: 'Patricio Rey y sus Redonditos de Ricota - Topic',
};

/** `BR-18` (d). Vive en el JSON, no acá: el test lo lee del archivo. */
const VIGENCIA_DIAS = 180;

/** Mismo slug que el cancionero, derivado del título canónico de `RES-20`. */
function aSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const hoy = () => new Date().toISOString().slice(0, 10);

async function pedir(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${url.replace(/key=[^&]+/, 'key=***')}`);
  return r.json();
}

/**
 * Fase 1. Lista la playlist de subidas del canal Topic y cruza los títulos contra los 105
 * de `RES-20` por la misma puerta de `D-13` que usa el cancionero.
 *
 * **Es la vía barata y todavía no está fichada** (`CTR-07.13` la dejó pedida a
 * `investigador`): `playlistItems.list` cuesta 1 unidad cada 50 ítems, así que el canal
 * entero sale por unas pocas unidades en vez de 10.500. Si el canal no expone su playlist,
 * esto devuelve vacío y lo dice — no se cae a búsqueda por su cuenta, porque esa vía cuesta
 * la cuota de un día y esa decisión no la toma un script solo.
 */
async function resolverPorListado(clave) {
  const canal = await pedir(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${TOPIC.id}&key=${clave}`,
  );
  const lista = canal.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!lista) return null;

  const videos = [];
  let pagina = '';
  do {
    const r = await pedir(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50` +
        `&playlistId=${lista}&key=${clave}${pagina ? `&pageToken=${pagina}` : ''}`,
    );
    for (const it of r.items ?? []) {
      videos.push({ id: it.snippet?.resourceId?.videoId, titulo: it.snippet?.title ?? '' });
    }
    pagina = r.nextPageToken ?? '';
  } while (pagina);
  return videos.filter((v) => v.id);
}

/** Fase 2. 50 ids por llamada, 1 unidad cada una (`RES-52` c). */
async function medirVistas(ids, clave) {
  const vistas = new Map();
  for (let i = 0; i < ids.length; i += 50) {
    const lote = ids.slice(i, i + 50);
    const r = await pedir(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${lote.join(',')}&key=${clave}`,
    );
    for (const v of r.items ?? []) {
      const n = Number(v.statistics?.viewCount);
      if (Number.isFinite(n)) vistas.set(v.id, n);
    }
  }
  return vistas;
}

/** El esqueleto: los 105 de `RES-20`, todos declarados sin video y con el motivo escrito. */
function esqueleto() {
  return {
    contrato: 'CTR-07',
    contratoVersion: 1,
    fuente: 'youtube',
    actualizado: hoy(),
    vigenciaDias: VIGENCIA_DIAS,
    temas: leerTemas().map((t) => ({
      slug: aSlug(t.titulo),
      disco: t.disco,
      estado: 'sin-video',
      motivo: 'Todavia nadie corrio la fase de resolucion: no hay videoId declarado.',
    })),
  };
}

function cargar() {
  if (!existsSync(DESTINO)) return esqueleto();
  const previo = JSON.parse(readFileSync(DESTINO, 'utf-8'));
  // Los temas mandan desde `RES-20`, no desde el archivo: si la ficha cambia, el archivo la
  // sigue. Lo que ya estaba resuelto se conserva por slug.
  const base = esqueleto();
  const porSlug = new Map((previo.temas ?? []).map((t) => [t.slug, t]));
  base.temas = base.temas.map((t) => porSlug.get(t.slug) ?? t);
  base.vigenciaDias = previo.vigenciaDias ?? VIGENCIA_DIAS;
  return base;
}

function guardar(datos) {
  datos.actualizado = hoy();
  writeFileSync(DESTINO, `${JSON.stringify(datos, null, 2)}\n`, 'utf-8');
}

function resumen(datos) {
  const porEstado = {};
  for (const t of datos.temas) porEstado[t.estado] = (porEstado[t.estado] ?? 0) + 1;
  console.log(`temas:        ${datos.temas.length} (los ${datos.temas.length} de RES-20)`);
  console.log(`por estado:   ${JSON.stringify(porEstado)}`);
  console.log(`vigencia:     ${datos.vigenciaDias} dias (BR-18 d)`);
}

async function main() {
  const clave = process.env.YT_API_KEY ?? '';
  const soloResolver = process.argv.includes('--resolver');
  const datos = cargar();

  if (!clave) {
    guardar(datos);
    resumen(datos);
    console.log('');
    console.log('Sin YT_API_KEY no hay a quien preguntarle. El archivo queda declarado y vacio.');
    console.log('La clave es gratuita y sale de Google Cloud Console (RES-52 c). Despues:');
    console.log('');
    console.log('  YT_API_KEY=... node scripts/ingerir-popularidad.mjs --resolver   # una vez');
    console.log('  YT_API_KEY=... node scripts/ingerir-popularidad.mjs              # cada 180 dias');
    return;
  }

  if (soloResolver) {
    const videos = await resolverPorListado(clave);
    if (videos === null) {
      console.log('El canal Topic no expone su playlist de subidas.');
      console.log('La otra via cuesta 100 unidades por tema y no la elige un script: ver CTR-07.13.');
      return;
    }
    const indice = indiceDuro();
    let resueltos = 0;
    for (const v of videos) {
      const canonico = resolverTema(v.titulo, indice);
      if (!canonico) continue;
      const slug = aSlug(canonico.titulo);
      const entrada = datos.temas.find((t) => t.slug === slug);
      // Un id ya resuelto no se pisa: adentro puede haber una decision manual (CTR-07.4).
      if (!entrada || entrada.video) continue;
      delete entrada.motivo;
      entrada.estado = 'sin-medir';
      entrada.motivo = 'Video resuelto, todavia sin medir: falta correr la fase de refresco.';
      entrada.video = {
        id: v.id,
        canal: 'topic',
        canalId: TOPIC.id,
        canalNombre: TOPIC.nombre,
        titulo: v.titulo,
        resolucion: 'listado-de-canal',
        resuelto: hoy(),
      };
      resueltos++;
    }
    guardar(datos);
    console.log(`videos en el canal: ${videos.length}`);
    console.log(`resueltos ahora:    ${resueltos}`);
    resumen(datos);
    return;
  }

  const conVideo = datos.temas.filter((t) => t.video?.id);
  if (conVideo.length === 0) {
    console.log('Ningun tema tiene videoId todavia. Corre primero:');
    console.log('  YT_API_KEY=... node scripts/ingerir-popularidad.mjs --resolver');
    return;
  }
  const vistas = await medirVistas(
    conVideo.map((t) => t.video.id),
    clave,
  );
  let medidos = 0;
  for (const t of conVideo) {
    const n = vistas.get(t.video.id);
    if (n === undefined) {
      // El video existia cuando se resolvio y hoy no responde. Se conserva el id y se dice.
      t.estado = 'sin-medir';
      delete t.medicion;
      t.motivo = `YouTube no devolvio estadisticas para ${t.video.id} el ${hoy()}.`;
      continue;
    }
    t.estado = 'medido';
    delete t.motivo;
    t.medicion = { vistas: n, medido: hoy() };
    medidos++;
  }
  guardar(datos);
  console.log(`llamadas a la API:  ${Math.ceil(conVideo.length / 50)} (1 unidad cada una)`);
  console.log(`medidos:            ${medidos} de ${conVideo.length}`);
  resumen(datos);
}

await main();
