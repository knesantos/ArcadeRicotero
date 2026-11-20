/**
 * Mide dónde empieza a sonar cada fragmento de "adiviná el tema" y lo anota en el
 * manifiesto (`T-533`). La regla está en `src/lib/tema/arranque.ts`; esto es la plomería.
 *
 * ## Por qué hace falta un navegador
 *
 * En esta PC no hay ffmpeg ni masters, y Node no trae decodificador de mp3. El que sí lo
 * trae es cualquier navegador. Así que la medición va en dos mitades:
 *
 * 1. **El navegador decodifica** cada mp3 y calcula la envolvente: el nivel RMS de cada
 *    ventana de 10 ms. No decide nada. Lo manda de vuelta a este script, que lo guarda en
 *    `scripts/fragmentos-envolvente.json` junto con el sha1 de cada archivo.
 * 2. **Node aplica la regla** sobre esas envolventes y escribe `inicioSeg`, `sorteo` y
 *    `motivo` en `src/data/adivinar-tema.json` (`CTR-03` v3).
 *
 * `src/lib/tema/arranque.test.ts` vuelve a correr la mitad 2 y falla si el manifiesto dice
 * otra cosa, o si un mp3 cambió y nadie volvió a medir (el sha1 no coincide).
 *
 * ## Uso
 *
 *   npm run medir-fragmentos              levanta http://127.0.0.1:4399/, lo abrís en
 *                                         cualquier navegador, mide, escribe y se apaga solo
 *   npm run medir-fragmentos -- --aplicar no mide: vuelve a aplicar la regla a las
 *                                         envolventes ya guardadas (si cambió un umbral)
 *   npm run medir-fragmentos -- --tabla   no escribe nada: imprime la tabla
 *
 * No instala nada y no deja nada corriendo: el servidor se cierra al recibir la medición.
 */

import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  decidirArranque,
  codificarEnvolvente,
  decodificarEnvolvente,
  nivelDb,
  UMBRAL_DB,
  VENTANA_MS,
  PISO_DB,
} from '../src/lib/tema/arranque.ts';
import { ESCALERA, ventana } from '../src/lib/tema/escalera.ts';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFIESTO = join(RAIZ, 'src/data/adivinar-tema.json');
const ENVOLVENTE = join(RAIZ, 'scripts/fragmentos-envolvente.json');
const CARPETA = join(RAIZ, 'public/audio/fragmentos');
const PUERTO = 4399;

const hoy = () => new Date().toISOString().slice(0, 10);
const leer = (ruta) => JSON.parse(readFileSync(ruta, 'utf-8'));
const mp3De = (slug) => join(CARPETA, `${slug}.mp3`);

/** Lo que corre en el navegador: decodificar y medir la envolvente. Nada más. */
const PAGINA = `<!doctype html>
<html lang="es-AR"><meta charset="utf-8"><title>Medir fragmentos</title>
<body style="font:16px system-ui;margin:2rem;max-width:40rem">
<h1>Medir fragmentos</h1><p id="estado">Midiendo…</p>
<script type="module">
const estado = document.getElementById('estado');
const VENTANA_MS = ${VENTANA_MS}, PISO = ${PISO_DB};
try {
  const slugs = await (await fetch('/slugs')).json();
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new Ctx(1, 1, 44100);
  const medidas = {};
  let n = 0;
  for (const slug of slugs) {
    estado.textContent = 'Midiendo ' + (++n) + ' de ' + slugs.length + ': ' + slug;
    const crudo = await (await fetch('/mp3/' + slug + '.mp3')).arrayBuffer();
    const buf = await ctx.decodeAudioData(crudo);
    const largo = buf.length, canales = buf.numberOfChannels;
    const mono = new Float32Array(largo);
    for (let c = 0; c < canales; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < largo; i++) mono[i] += d[i] / canales;
    }
    const paso = Math.round(buf.sampleRate * VENTANA_MS / 1000);
    const env = [];
    let pico = 0;
    for (let i = 0; i + paso <= largo; i += paso) {
      let suma = 0;
      for (let k = i; k < i + paso; k++) { const v = mono[k]; suma += v * v; if (Math.abs(v) > pico) pico = Math.abs(v); }
      const rms = Math.sqrt(suma / paso);
      env.push(rms > 0 ? Math.max(PISO, 20 * Math.log10(rms)) : PISO);
    }
    medidas[slug] = {
      duracionSeg: Math.round(buf.duration * 1000) / 1000,
      picoDb: pico > 0 ? Math.round(200 * Math.log10(pico)) / 10 : PISO,
      env,
    };
  }
  const r = await fetch('/medidas', { method: 'POST', body: JSON.stringify(medidas) });
  estado.textContent = r.ok ? 'Listo: ' + slugs.length + ' fragmentos medidos. Ya podés cerrar esta pestaña.' : 'El script rechazó la medición.';
} catch (e) {
  estado.textContent = 'Falló: ' + e;
}
</script></body></html>`;

function guardarEnvolventes(medidas) {
  const fragmentos = {};
  for (const slug of Object.keys(medidas).sort()) {
    const m = medidas[slug];
    const archivo = readFileSync(mp3De(slug));
    fragmentos[slug] = {
      sha1: createHash('sha1').update(archivo).digest('hex'),
      duracionSeg: m.duracionSeg,
      picoDb: m.picoDb,
      env: codificarEnvolvente(m.env),
    };
  }
  const salida = {
    nota:
      'Envolvente de cada fragmento de public/audio/fragmentos: nivel RMS por ventana, medido ' +
      'decodificando el mp3 en un navegador. La escribe scripts/medir-fragmentos.mjs; no se edita a mano. ' +
      'De acá salen inicioSeg y sorteo de src/data/adivinar-tema.json (regla: src/lib/tema/arranque.ts).',
    medido: hoy(),
    ventanaMs: VENTANA_MS,
    codificacion: 'base64, un byte por ventana: dB = byte / 2 - 100',
    fragmentos,
  };
  writeFileSync(ENVOLVENTE, JSON.stringify(salida, null, 1) + '\n');
  return salida;
}

/** Las filas de la tabla: la regla aplicada a cada envolvente. */
function filas(envolventes) {
  return Object.entries(envolventes.fragmentos).map(([slug, f]) => {
    const env = decodificarEnvolvente(f.env);
    const a = decidirArranque(env, f.duracionSeg);
    const ini = a.inicioSeg ?? 0;
    const pasos = ESCALERA.map((p) => {
      const v = ventana(p.segundos, ini, f.duracionSeg);
      return { ...v, db: nivelDb(env, v.desdeSeg, v.desdeSeg + v.duraSeg) };
    });
    return { slug, ...a, duracionSeg: f.duracionSeg, antesDb: nivelDb(env, 0, ESCALERA[0].segundos), pasos };
  });
}

function aplicar(envolventes) {
  const manifiesto = leer(MANIFIESTO);
  const porSlug = new Map(filas(envolventes).map((f) => [f.slug, f]));
  const sinMedir = manifiesto.fragmentos.filter((f) => !porSlug.has(f.slug)).map((f) => f.slug);
  if (sinMedir.length) throw new Error(`sin medir: ${sinMedir.join(', ')}`);

  manifiesto.contratoVersion = 3;
  manifiesto.actualizado = hoy();
  manifiesto.medicion = {
    medido: envolventes.medido,
    umbralDb: UMBRAL_DB,
    ventanaMs: VENTANA_MS,
    con: 'scripts/medir-fragmentos.mjs',
  };
  manifiesto.fragmentos = manifiesto.fragmentos.map((f) => {
    const m = porSlug.get(f.slug);
    const { slug, titulo, duracionSeg, entero } = f;
    return {
      slug,
      titulo,
      duracionSeg,
      entero,
      inicioSeg: m.inicioSeg,
      sorteo: m.sorteo,
      ...(m.motivo ? { motivo: m.motivo } : {}),
    };
  });
  writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + '\n');
  return manifiesto;
}

function imprimirTabla(envolventes) {
  const f1 = (n) => n.toFixed(1);
  console.log('slug\tinicio\tsorteo\tantes(0-0,1)\t' + ESCALERA.map((p) => `p${p.n} dB`).join('\t') + '\tp6 desde');
  for (const f of filas(envolventes)) {
    console.log(
      [
        f.slug,
        f.inicioSeg === null ? '—' : f.inicioSeg.toFixed(2),
        f.sorteo ? 'sí' : `NO (${f.motivo})`,
        f1(f.antesDb),
        ...f.pasos.map((p) => f1(p.db)),
        f.pasos.at(-1).desdeSeg.toFixed(2),
      ].join('\t'),
    );
  }
}

function resumen(manifiesto) {
  const fuera = manifiesto.fragmentos.filter((f) => !f.sorteo);
  const corridos = manifiesto.fragmentos.filter((f) => f.sorteo && f.inicioSeg > 0);
  console.log(`\n${manifiesto.fragmentos.length} fragmentos · ${corridos.length} arrancan después de 0 · ${fuera.length} fuera del sorteo`);
  for (const f of fuera) console.log(`  fuera: ${f.slug} (${f.motivo}${f.inicioSeg === null ? '' : `, primer sonido a ${f.inicioSeg} s`})`);
}

// ---------------------------------------------------------------- entrada

const args = process.argv.slice(2);

if (args.includes('--tabla') || args.includes('--aplicar')) {
  if (!existsSync(ENVOLVENTE)) {
    console.error('No hay envolventes guardadas. Corré primero: npm run medir-fragmentos');
    process.exit(1);
  }
  const envolventes = leer(ENVOLVENTE);
  if (args.includes('--tabla')) imprimirTabla(envolventes);
  else resumen(aplicar(envolventes));
} else {
  const slugs = leer(MANIFIESTO).fragmentos.map((f) => f.slug);
  const validos = new Set(slugs);
  const servidor = createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(PAGINA);
    } else if (req.method === 'GET' && url.pathname === '/slugs') {
      res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(slugs));
    } else if (req.method === 'GET' && url.pathname.startsWith('/mp3/')) {
      // Solo los slugs del manifiesto: el nombre nunca se usa como ruta sin pasar por acá.
      const slug = decodeURIComponent(url.pathname.slice(5)).replace(/\.mp3$/, '');
      if (!validos.has(slug) || !existsSync(mp3De(slug))) return void res.writeHead(404).end();
      res.writeHead(200, { 'content-type': 'audio/mpeg' }).end(readFileSync(mp3De(slug)));
    } else if (req.method === 'POST' && url.pathname === '/medidas') {
      const trozos = [];
      req.on('data', (t) => trozos.push(t));
      req.on('end', () => {
        try {
          const medidas = JSON.parse(Buffer.concat(trozos).toString('utf-8'));
          const faltan = slugs.filter((s) => !medidas[s]);
          if (faltan.length) throw new Error(`faltan ${faltan.length} fragmentos`);
          const soloValidos = Object.fromEntries(slugs.map((s) => [s, medidas[s]]));
          const envolventes = guardarEnvolventes(soloValidos);
          res.writeHead(200).end('ok');
          resumen(aplicar(envolventes));
          servidor.close();
          servidor.closeAllConnections?.();
        } catch (e) {
          res.writeHead(400).end(String(e));
          console.error(`Medición rechazada: ${e}`);
        }
      });
    } else {
      res.writeHead(404).end();
    }
  });
  servidor.listen(PUERTO, '127.0.0.1', () => {
    console.log(`Abrí http://127.0.0.1:${PUERTO}/ en un navegador. Mide los ${slugs.length} fragmentos y se apaga solo.`);
  });
}
