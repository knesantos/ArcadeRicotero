/**
 * Los recitales enteros, desde MusicBrainz. Implementa `CTR-19` pieza 2 (`CTR-19.7`).
 *
 *   node --experimental-strip-types scripts/ingerir-recitales.mjs
 *
 * ─── Por qué MusicBrainz y nada más ─────────────────────────────────────────────────
 *
 * `D-45` enmendada: los setlists enteros se guardan **solo desde fuentes cuya licencia lo
 * permite**. `INV-76` barrió las candidatas y la única con licencia confirmada y contenido
 * es MusicBrainz: sus datos centrales, setlist de eventos incluido, son CC0 (`RES-78`), y
 * tiene 2 recitales de la banda con setlist (`RES-76`). Wikipedia y Wikidata tienen buena
 * licencia y cero setlists; el resto no tiene licencia que deje guardar.
 *
 * **Este script no toca la otra fuente de recitales, la que el sitio solo cita**: ni su
 * página ni su API (`CTR-19.7` punto 3, `RES-73.1`). El conteo que viene de ahí se copia a
 * mano desde una ficha; lo vigila t9 de `src/lib/en-vivo.test.ts`.
 *
 * ─── Las reglas de la API (`RES-79`) ───────────────────────────────────────────────
 *
 * - Sin clave.
 * - **Un pedido por segundo, como mucho.** Acá se espera 1,1 s entre pedidos.
 * - **User-Agent propio con contacto.** El contacto por defecto es la página pública del
 *   repositorio; `MB_CONTACTO=...` lo cambia sin tocar el código.
 * - Siempre la API JSON (`/ws/2/...?fmt=json`), nunca el HTML: las páginas normales piden
 *   una verificación de navegador.
 *
 * Son pocos pedidos: uno para listar los eventos de la banda y uno por evento con setlist
 * para saber dónde fue (el listado no trae el lugar).
 *
 * ─── Lo que le exige `CTR-19.7` ────────────────────────────────────────────────────
 *
 * 1. Reescribe el archivo **entero y ordenado** por fecha, orden y fuente.
 * 2. Resuelve cada título con `resolverTema()` (la puerta de `D-13`) y deja `slug` o
 *    `fuera`. Nunca descarta un tema: lo que no cruza y nadie clasificó con ficha va como
 *    `sin-identificar`, con una nota.
 * 3. No toca la fuente citada (arriba).
 * 4. Imprime cuántos recitales trajo de cada fuente.
 *
 * ─── Si algo falla, no escribe nada ────────────────────────────────────────────────
 *
 * Todo se arma en memoria, se valida contra el schema y contra `problemasDelArchivo()`, y
 * recién entonces se escribe, a un temporal que se renombra. Un corte de red a mitad de
 * camino sale con error y deja el archivo anterior como estaba. Tampoco se escribe un
 * archivo vacío (`CTR-19.7`): sin recitales, el archivo no existe.
 */

import { readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { resolverTema } from '../src/lib/letra/temas.ts';
import { slugDeTitulo } from '../src/lib/texto.ts';
import { salidaMasAbierta, problemasDelArchivo, URL_DE_SALIDA } from '../src/lib/recitales.ts';

const DESTINO = 'src/data/recitales.json';
const SCHEMA = 'src/data/_schema/recitales.schema.json';

/** El MBID de la banda, confirmado por dos vías (`RES-73.5`, `RES-80`). */
const ARTISTA = '956301d0-4b3c-4ffc-9898-b39305d25112';
const API = 'https://musicbrainz.org/ws/2';
const PAUSA_MS = 1100;

const CONTACTO = process.env.MB_CONTACTO || 'https://github.com/knesantos/ArcadeRicotero';
const USER_AGENT = `ArcadeRicotero-ingerir-recitales/1.0 ( ${CONTACTO} )`;

/**
 * La fuente, como la declara la ficha. **La licencia no se lee de la red**: la leyó
 * `investigador` y quedó en `RES-78`, con su texto copiado. Si MusicBrainz la cambia, se
 * entera una ficha nueva, no este script.
 */
const MUSICBRAINZ = {
  id: 'musicbrainz',
  nombre: 'MusicBrainz',
  sitio: 'https://musicbrainz.org/',
  licencia: {
    familia: 'cc0',
    version: '1.0',
    textual:
      'The core data of the database is licensed under the CC0, which is effectively placing the data into the Public Domain.',
    url: 'https://musicbrainz.org/doc/About/Data_License',
    consultada: '2026-09-23',
  },
  ficha: 'RES-78',
};

/**
 * Los títulos que no cruzan y que alguien **ya** clasificó con una ficha en la mano. Todo
 * lo demás que no cruza va como `sin-identificar`: la clase es una decisión de una persona,
 * y un script no la toma (`CTR-19.2`).
 */
const CLASIFICADOS = {
  'Un tal Brigitte Bardot': { fuera: 'inedito', nota: 'Demo de RCA de 1982, nunca entro a los diez discos (RES-75).' },
  'Nene nena': { fuera: 'inedito', nota: 'Demo de RCA de 1982, nunca entro a los diez discos (RES-75).' },
  // Estos dos siguen sin clase: lo que dice la fuente va a la nota, y la clase la pone
  // quien tenga una ficha. No es un cover ni un cántico hasta que alguien lo afirme.
  'Desde el alma': {
    fuera: 'sin-identificar',
    nota: 'La fuente lo enlaza a la obra "Desde el alma", vals de Rosita Melo: seria un cover, sin ficha que lo confirme.',
  },
  'Es un sentimiento': {
    fuera: 'sin-identificar',
    nota: 'Sin obra enlazada en la fuente. Podria ser un cantico de la gente; nadie lo clasifico con ficha.',
  },
};

const CAMBIOS =
  'Los titulos se cruzaron contra los 105 temas de los diez discos y se les agrego el slug del catalogo; ' +
  'los que no cruzan quedan marcados fuera de catalogo, con su clase. Las secciones de bis y los comentarios ' +
  'de la fuente pasan a la nota de cada tema. Fecha, lugar, ciudad y orden de los temas, como los da cada fuente.';

const hoy = () => new Date().toISOString().slice(0, 10);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

class ErrorDeRed extends Error {}

let ultimoPedido = 0;

/** Un pedido a la API, respetando el ritmo. Reintenta una vez si el servidor pide calma. */
async function pedir(ruta) {
  const url = `${API}${ruta}${ruta.includes('?') ? '&' : '?'}fmt=json`;
  for (let intento = 1; intento <= 2; intento++) {
    const falta = ultimoPedido + PAUSA_MS - Date.now();
    if (falta > 0) await esperar(falta);
    ultimoPedido = Date.now();

    let r;
    try {
      r = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } });
    } catch (e) {
      throw new ErrorDeRed(`no hubo respuesta de ${url}: ${e.cause?.code ?? e.message}`);
    }
    if (r.status === 503 && intento === 1) {
      await esperar(3000);
      continue;
    }
    if (!r.ok) throw new ErrorDeRed(`${r.status} ${r.statusText} en ${url}`);
    try {
      return await r.json();
    } catch {
      throw new ErrorDeRed(`la respuesta de ${url} no es JSON`);
    }
  }
  throw new ErrorDeRed(`MusicBrainz respondió 503 dos veces seguidas en ${url}`);
}

/** Todos los eventos de la banda, paginados de a 100. */
async function eventosDeLaBanda() {
  const eventos = [];
  for (let offset = 0; ; offset += 100) {
    const pagina = await pedir(`/event?artist=${ARTISTA}&limit=100&offset=${offset}`);
    eventos.push(...(pagina.events ?? []));
    if (eventos.length >= (pagina['event-count'] ?? 0) || (pagina.events ?? []).length === 0) break;
  }
  return eventos;
}

/**
 * El setlist de MusicBrainz, línea por línea. Su sintaxis (`RES-77`):
 *
 *   * [mbid|Título] (comentario)   un tema con su obra enlazada
 *   * Título (comentario)          un tema sin obra enlazada
 *   # Encore 2                     una sección: los temas que siguen son de ese bis
 *   @ [mbid|Artista]               un artista: no es un tema, no se guarda
 *
 * El comentario y la sección van a la `nota` del tema. El título queda **tal cual lo da la
 * fuente**, sin el comentario.
 */
function leerSetlist(texto) {
  const temas = [];
  let seccion = null;
  for (const cruda of texto.split(/\r?\n/)) {
    const linea = cruda.trim();
    if (!linea) continue;
    if (linea.startsWith('#')) {
      seccion = linea.replace(/^#+\s*/, '') || null;
      continue;
    }
    if (!linea.startsWith('*')) continue;
    const cuerpo = linea.replace(/^\*\s*/, '');

    let titulo;
    let comentario = null;
    const enlazado = cuerpo.match(/^\[[0-9a-f-]{36}\|([^\]]+)\]\s*(?:\((.*)\))?\s*$/);
    if (enlazado) {
      titulo = enlazado[1].trim();
      comentario = enlazado[2]?.trim() || null;
    } else {
      const suelto = cuerpo.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
      titulo = (suelto ? suelto[1] : cuerpo).trim();
      comentario = suelto ? suelto[2].trim() : null;
    }

    const notas = [];
    if (seccion) notas.push(`En la fuente, seccion «${seccion}».`);
    if (comentario) notas.push(`Comentario de la fuente: «${comentario}».`);
    temas.push({ titulo, notas });
  }
  return temas;
}

/** Cruza un tema contra los 105 y le pone `slug` o `fuera`, nunca las dos. */
function cruzar({ titulo, notas }) {
  const r = resolverTema(titulo);
  if (r) {
    const tema = { titulo, slug: slugDeTitulo(r.titulo) };
    if (notas.length) tema.nota = recortar(notas.join(' '));
    return tema;
  }
  const clasificado = CLASIFICADOS[titulo];
  if (clasificado) {
    return { titulo, fuera: clasificado.fuera, nota: recortar([clasificado.nota, ...notas].join(' ')) };
  }
  return {
    titulo,
    fuera: 'sin-identificar',
    nota: recortar(['No cruza con los 105 de RES-20 y nadie lo clasifico con ficha todavia.', ...notas].join(' ')),
  };
}

/** El schema topea la nota de un tema en 200. Se corta con aviso, nunca en silencio. */
function recortar(nota) {
  return nota.length <= 200 ? nota : `${nota.slice(0, 199)}…`;
}

/** Dónde fue, desde la relación "held at" del evento. */
function lugarDe(evento) {
  const rel = (evento.relations ?? []).find((x) => x['target-type'] === 'place' && x.place);
  if (!rel) return null;
  const lugar = rel.place.name;
  const ciudad = rel.place.area?.name;
  return lugar && ciudad ? { lugar, ciudad } : null;
}

function validadorDelSchema() {
  const Ctor = Ajv2020.default ?? Ajv2020;
  return new Ctor({ allErrors: true, strict: false }).compile(JSON.parse(readFileSync(SCHEMA, 'utf-8')));
}

async function main() {
  const consultado = hoy();
  console.log(`MusicBrainz, como ${USER_AGENT}`);

  const eventos = await eventosDeLaBanda();
  const conSetlist = eventos.filter((e) => typeof e.setlist === 'string' && e.setlist.trim() !== '');
  console.log(`  ${eventos.length} eventos de la banda, ${conSetlist.length} con setlist`);

  const recitales = [];
  for (const resumen of conSetlist) {
    // El listado no trae el lugar: se pide el evento con su relación "held at".
    const evento = await pedir(`/event/${resumen.id}?inc=place-rels`);
    const donde = lugarDe(evento);
    const fecha = evento['life-span']?.begin;
    if (!donde || !fecha) {
      console.warn(`  ! ${resumen.id}: sin ${donde ? 'fecha' : 'lugar y ciudad'} en la fuente, no entra`);
      continue;
    }
    const temas = leerSetlist(evento.setlist ?? resumen.setlist).map(cruzar);
    if (temas.length === 0) {
      console.warn(`  ! ${resumen.id} (${fecha}): el setlist no trae ningún tema legible, no entra`);
      continue;
    }
    recitales.push({
      fecha,
      lugar: donde.lugar,
      ciudad: donde.ciudad,
      fuente: MUSICBRAINZ.id,
      url: `https://musicbrainz.org/event/${evento.id}`,
      consultado,
      // MusicBrainz no dice de sí mismo si el setlist está completo: no se afirma.
      completitud: 'sin-declarar',
      temas,
    });
  }

  if (recitales.length === 0) {
    throw new Error('MusicBrainz no trajo ningún recital con setlist legible: no se escribe un archivo vacío (CTR-19.7)');
  }

  // Dos recitales de la misma fuente el mismo día llevan `orden` desde el segundo.
  recitales.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.fuente.localeCompare(b.fuente) || a.url.localeCompare(b.url));
  const porDia = new Map();
  for (const r of recitales) {
    const clave = `${r.fecha}|${r.fuente}`;
    const n = (porDia.get(clave) ?? 0) + 1;
    porDia.set(clave, n);
    if (n > 1) r.orden = n;
  }
  const ordenado = recitales.map(({ fecha, orden, ...resto }) => (orden ? { fecha, orden, ...resto } : { fecha, ...resto }));

  const fuentes = [MUSICBRAINZ];
  const salida = salidaMasAbierta(fuentes);
  if (!salida) throw new Error('las fuentes no tienen una licencia de salida en común: es CTR-19 v2, lo decide el usuario');

  const archivo = {
    contrato: 'CTR-19',
    pieza: 'recitales',
    contratoVersion: 1,
    actualizado: consultado,
    licencia: { id: salida, url: URL_DE_SALIDA[salida] },
    cambios: CAMBIOS,
    nota: 'Semilla: MusicBrainz tiene dos recitales de la banda con setlist cargado (RES-76). Crece con cada fuente abierta que se fiche.',
    fuentes,
    recitales: ordenado,
  };

  const validar = validadorDelSchema();
  if (!validar(archivo)) {
    const errores = validar.errors.map((e) => `  ${e.instancePath} ${e.message}`).join('\n');
    throw new Error(`lo armado no cumple ${SCHEMA}, no se escribe:\n${errores}`);
  }
  const resolver = (t) => {
    const r = resolverTema(t);
    return r ? slugDeTitulo(r.titulo) : null;
  };
  const problemas = problemasDelArchivo(archivo, resolver, hoy());
  if (problemas.length) throw new Error(`lo armado tiene problemas, no se escribe:\n  ${problemas.join('\n  ')}`);

  const temporal = `${DESTINO}.tmp`;
  try {
    writeFileSync(temporal, `${JSON.stringify(archivo, null, 2)}\n`, 'utf-8');
    renameSync(temporal, DESTINO);
  } catch (e) {
    rmSync(temporal, { force: true });
    throw e;
  }

  // `CTR-19.7` punto 4: para que `revisor` lo compare con lo que contó la ficha.
  console.log(`\nEscrito ${DESTINO}, licencia de salida ${salida}.`);
  for (const f of fuentes) {
    const suyos = ordenado.filter((r) => r.fuente === f.id);
    console.log(`  ${f.id}: ${suyos.length} recitales (${suyos.map((r) => `${r.fecha} ${r.lugar}, ${r.temas.length} temas`).join(' · ')})`);
  }
  const fuera = ordenado.flatMap((r) => r.temas.filter((t) => t.fuera).map((t) => `${r.fecha} ${t.fuera}: ${t.titulo}`));
  if (fuera.length) console.log(`  fuera de catálogo:\n    ${fuera.join('\n    ')}`);
}

main().catch((e) => {
  const tipo = e instanceof ErrorDeRed ? 'la red falló' : 'no se pudo armar';
  console.error(`\ningerir-recitales: ${tipo}. No se escribió nada; ${DESTINO} queda como estaba.\n${e.message}`);
  // `exitCode` y no `process.exit(1)`: en Windows, cortar el proceso con una conexión de
  // `fetch` todavía abierta dispara una aserción de libuv y el código de salida sale 127.
  process.exitCode = 1;
});
