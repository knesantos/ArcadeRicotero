/**
 * Las redes del sitio, de punta a punta (`D-81`).
 *
 *   npm run redes -- validar          revisa el calendario (forma, largo, voz a máquina)
 *   npm run redes -- piezas [DIF-XX]  imprime las piezas de lo aprobado (o de un posteo); los reels los graba `npm run reels`
 *   npm run redes -- lote             arma lote.json + lote.md con lo aprobado, para cargarlo a mano
 *   npm run redes -- perfil           imprime la foto de perfil (1080) y el banner de X (1500x500)
 *   npm run redes -- canales          lista los canales conectados en Buffer
 *   npm run redes -- cola [--prueba]  manda lo aprobado a la cola de Buffer, cada uno a su hora
 *
 * **Las piezas se imprimen con el navegador, no a mano.** La pieza es una página HTML con
 * los tokens y las letras reales del sitio (`tokens.css`, `public/fuentes/`), y Edge sin
 * ventana le saca la foto. Así el rojo sale de `tokens.css` y la letra es la de la banda, y
 * no un PNG con el color copiado a ojo (la regla de `diseno-marca.md`). Quedan en
 * `public/redes/`, porque la herramienta de la cola baja la imagen por URL: se publican con el
 * sitio y viven en `https://fichinricotero.com.ar/redes/`.
 *
 * Instagram en 1080x1350 (el vertical que más pantalla ocupa en el inicio) y X en 1200x675.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

import { SITIO, validar } from '../src/lib/difusion/calendario.ts';

const CALENDARIO = 'Docs/DIFUSION/calendario.json';
const SALIDA = 'public/redes';
const LOTE = 'Docs/DIFUSION/lote';

const MEDIDAS = { instagram: [1080, 1350], x: [1200, 675] };

/** Acento y letra de firma por disco (`D-19`, `diseno-marca.md`). Solo nombres de token. */
const DISCO = {
  oktubre: { acento: '--marca-rojo', nombre: 'OKTUBRE' },
  gulp: { acento: '--cat-historia', nombre: 'GULP!' },
  'lobo-suelto': { acento: '--cat-mitologia', nombre: 'LOBO SUELTO' },
  'la-mosca': { acento: '--cat-letras', nombre: 'LA MOSCA Y LA SOPA' },
  'ultimo-bondi': { acento: '--cat-discos', nombre: 'ÚLTIMO BONDI' },
};

const leer = () => JSON.parse(readFileSync(CALENDARIO, 'utf-8'));

function navegador() {
  const candidatos = [
    process.env.NAVEGADOR,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
  ].filter(Boolean);
  const hallado = candidatos.find((c) => existsSync(c));
  if (!hallado) throw new Error('No encontré Edge ni Chrome. Pasá la ruta en la variable NAVEGADOR.');
  return hallado;
}

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** La página de una pieza. Sin sombras, sin degradados, sin pastillas: borde, cinta y giro. */
function pagina(p, red) {
  const [ancho, alto] = MEDIDAS[red];
  const raiz = pathToFileURL(resolve('.')).href;
  const d = DISCO[p.pieza.disco];
  const vertical = alto > ancho;
  const imagen = p.pieza.imagen
    ? `<figure class="recorte"><img src="${raiz}/public/${p.pieza.imagen}" alt=""></figure>`
    : '';
  const fuente = (familia, archivo) =>
    `@font-face{font-family:'${familia}';src:url('${raiz}/public/fuentes/${archivo}')}`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="${raiz}/src/styles/tokens.css">
<style>
${fuente('Archivo Black', 'archivo-black.woff2')}
${fuente('Patricio Rey Fan', 'patricio-rey.woff')}
html,body{margin:0;width:${ancho}px;height:${alto}px;overflow:hidden}
body{background:var(--fondo);color:var(--texto);font-family:var(--fuente);
  box-sizing:border-box;padding:${vertical ? 84 : 56}px;display:grid;
  grid-template-columns:${vertical || !imagen ? '1fr' : '1fr 0.8fr'};
  grid-template-rows:${vertical ? 'auto 1fr auto' : '1fr auto'};gap:${vertical ? 48 : 32}px;
  border:14px solid var(${d.acento})}
.texto{display:flex;flex-direction:column;justify-content:${vertical ? 'flex-start' : 'center'};gap:28px;
  ${vertical ? '' : 'grid-row:1'}}
.disco{font-family:var(--fuente-rotulada);font-size:${vertical ? 26 : 20}px;letter-spacing:.12em;
  color:var(${d.acento});border:3px solid var(${d.acento});border-radius:3px;padding:6px 14px;
  align-self:flex-start;transform:rotate(-2deg)}
h1{font-family:var(--fuente-rotulada);font-weight:400;margin:0;line-height:1.02;
  font-size:${vertical ? 104 : 72}px;text-wrap:balance}
p{margin:0;font-size:${vertical ? 44 : 32}px;line-height:1.25;color:var(--texto-tenue);max-width:22ch}
.recorte{margin:0;align-self:center;justify-self:center;transform:rotate(2.5deg);
  border:10px solid var(--papel);position:relative;${vertical ? 'max-height:600px' : 'grid-row:1 / span 2'}}
.recorte::before{content:'';position:absolute;top:-26px;left:50%;width:180px;height:44px;
  transform:translateX(-50%) rotate(-4deg);background:var(--papel-borde);opacity:.85}
.recorte img{display:block;max-width:100%;max-height:${vertical ? 560 : 520}px}
.pie{display:flex;justify-content:space-between;align-items:flex-end;${vertical ? '' : 'grid-column:1'}}
.firma{font-family:var(--fuente-marca-firma);font-size:${vertical ? 58 : 40}px;color:var(${d.acento});
  transform:rotate(-3deg);transform-origin:left bottom;white-space:nowrap}
.url{font-family:var(--fuente-rotulada);font-size:${vertical ? 26 : 20}px;letter-spacing:.06em}
</style></head><body>
<div class="texto"><span class="disco">${escapar(d.nombre)}</span>
<h1>${escapar(p.pieza.titulo)}</h1><p>${escapar(p.pieza.bajada)}</p></div>
${imagen}
<div class="pie"><span class="firma">FICHÍN RICOTERO</span><span class="url">FICHINRICOTERO.COM.AR</span></div>
</body></html>`;
}

async function esperarArchivo(ruta, ms = 20000) {
  const hasta = Date.now() + ms;
  let tamano = -1;
  while (Date.now() < hasta) {
    if (existsSync(ruta)) {
      const ahora = statSync(ruta).size;
      if (ahora > 0 && ahora === tamano) return;
      tamano = ahora;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`El navegador no dejó ${ruta}`);
}

/** Le saca la foto a una página HTML y la deja en JPEG en `destino`. */
async function fotografiar(html, ancho, alto, destino) {
  const exe = navegador();
  const tmp = mkdtempSync(join(tmpdir(), 'redes-'));
  try {
    const archivo = join(tmp, 'pieza.html');
    const png = join(tmp, 'pieza.png');
    writeFileSync(archivo, html);
    execFileSync(exe, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--allow-file-access-from-files',
      '--force-device-scale-factor=1', `--window-size=${ancho},${alto}`,
      '--virtual-time-budget=3000', `--user-data-dir=${join(tmp, 'perfil')}`,
      `--screenshot=${png}`, pathToFileURL(archivo).href,
    ], { stdio: 'ignore' });
    // En Windows el lanzador de Edge vuelve antes de que el proceso hijo escriba la foto.
    await esperarArchivo(png);
    // Instagram por API solo acepta JPEG; X acepta los dos. Uno solo para no duplicar.
    await sharp(png).resize(ancho, alto, { fit: 'cover', position: 'top' }).jpeg({ quality: 90, mozjpeg: true }).toFile(destino);
    console.log(`  ${destino}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/**
 * La cara de las cuentas (`D-82`): la FR redonda en la foto de perfil, y la marca con el
 * nombre en el banner. Los dos salen de `public/marca/`, que imprime `generar-logo.py`.
 */
function paginaPerfil(ancho, alto) {
  const raiz = pathToFileURL(resolve('.')).href;
  const cuadrada = ancho === alto;
  const marca = cuadrada ? 'fr-redondo.svg' : 'fichin-ricotero.svg';
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="stylesheet" href="${raiz}/src/styles/tokens.css">
<style>
html,body{margin:0;width:${ancho}px;height:${alto}px;overflow:hidden}
body{background:var(--fondo);display:grid;place-items:center;box-sizing:border-box;
  ${cuadrada ? '' : 'border:12px solid var(--marca-rojo);'}}
img{display:block;${cuadrada ? `width:${ancho}px;height:${alto}px` : `height:${Math.round(alto * 0.84)}px;width:auto`}}
</style></head><body><img src="${raiz}/public/marca/${marca}" alt=""></body></html>`;
}

async function imprimir(p) {
  if (p.pieza.video) {
    // Un reel no se imprime: lo graba `npm run reels`. Acá solo se mira que esté.
    const archivo = `public/${p.pieza.video}`;
    console.log(existsSync(archivo) ? `  ${archivo} (reel)` : `  falta ${archivo}: grabalo con "npm run reels"`);
    return;
  }
  mkdirSync(SALIDA, { recursive: true });
  for (const red of p.redes) {
    const [ancho, alto] = MEDIDAS[red];
    await fotografiar(pagina(p, red), ancho, alto, `${SALIDA}/${p.id}-${red}.jpg`);
  }
}

function salirSiInvalido(cal) {
  const malos = validar(cal);
  if (malos.length) {
    console.error(`El calendario tiene ${malos.length} problema(s):\n- ${malos.join('\n- ')}`);
    process.exit(1);
  }
}

const [orden = 'validar', ...resto] = process.argv.slice(2);
const cal = leer();

if (orden === 'validar') {
  salirSiInvalido(cal);
  const cuenta = Object.groupBy(cal.posteos, (p) => p.estado);
  console.log(`Calendario OK: ${cal.posteos.length} posteos (${Object.entries(cuenta).map(([e, l]) => `${l.length} ${e}`).join(', ') || 'ninguno'}).`);
} else if (orden === 'piezas') {
  salirSiInvalido(cal);
  const elegidos = resto.length
    ? cal.posteos.filter((p) => resto.includes(p.id))
    : cal.posteos.filter((p) => p.estado === 'aprobado');
  if (!elegidos.length) console.log('No hay nada para imprimir: ningún posteo aprobado (o ninguno con ese id).');
  for (const p of elegidos) {
    console.log(`${p.id}`);
    await imprimir(p);
  }
} else if (orden === 'lote') {
  salirSiInvalido(cal);
  const aprobados = cal.posteos.filter((p) => p.estado === 'aprobado').sort((a, b) => a.fecha.localeCompare(b.fecha));
  const lote = aprobados.flatMap((p) =>
    p.redes.map((red) => ({
      id: p.id,
      red,
      fecha: p.fecha,
      texto: red === 'x' ? p.x : p.instagram,
      ...(p.pieza.video
        ? { video: `${SITIO}/${p.pieza.video}`, archivo: `public/${p.pieza.video}` }
        : { imagen: `${SITIO}/redes/${p.id}-${red}.jpg`, archivo: `public/redes/${p.id}-${red}.jpg` }),
      alt: p.alt,
    })),
  );
  if (!lote.length) {
    console.log('No hay nada aprobado: el lote queda vacío.');
    process.exit(0);
  }
  const faltan = lote.filter((l) => !existsSync(l.archivo));
  if (faltan.length) {
    console.error(`Faltan piezas: ${faltan.map((l) => l.archivo).join(', ')}. Corré "npm run redes -- piezas" (o "npm run reels" para un video).`);
    process.exit(1);
  }
  mkdirSync(LOTE, { recursive: true });
  writeFileSync(`${LOTE}/lote.json`, `${JSON.stringify(lote, null, 2)}\n`);
  writeFileSync(
    `${LOTE}/lote.md`,
    `# Lote para la cola\n\n${lote
      .map((l) => `## ${l.id} · ${l.red === 'x' ? 'X' : 'Instagram'} · ${l.fecha}\n\n${l.video ? 'Video (reel)' : 'Imagen'}: \`${l.archivo}\`\n\n\`\`\`\n${l.texto}\n\`\`\`\n\nDescripción de la imagen: ${l.alt}\n`)
      .join('\n')}`,
  );
  console.log(`Lote: ${lote.length} publicaciones en ${LOTE}/lote.json y lote.md.`);
} else if (orden === 'perfil') {
  mkdirSync(SALIDA, { recursive: true });
  await fotografiar(paginaPerfil(1080, 1080), 1080, 1080, `${SALIDA}/perfil.jpg`);
  await fotografiar(paginaPerfil(1500, 500), 1500, 500, `${SALIDA}/banner-x.jpg`);
} else if (orden === 'canales') {
  const canales = await canalesDeBuffer();
  for (const c of canales) console.log(`${c.service.padEnd(10)} ${c.name}${c.isQueuePaused ? '  (cola en pausa)' : ''}`);
} else if (orden === 'cola') {
  await cargarCola(cal, resto.includes('--prueba'));
} else {
  console.error(`No conozco "${orden}". Usá validar, piezas, lote, perfil, canales o cola.`);
  process.exit(1);
}

// ---------------------------------------------------------------- Buffer (RES-407)

/**
 * La cola es Buffer (`D-81`): plan gratis, una clave de API personal, y Buffer publica a la
 * hora. Ni la API de Instagram ni la de X programan (`RES-406`, `RES-405`), así que alguien
 * tiene que tener el reloj; con Buffer no hace falta un servidor propio, que el sitio no tiene.
 *
 * La clave vive en `.env` como `BUFFER_API_KEY`, que git ignora. Nunca se imprime.
 */
async function buffer(query) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Sin .env: la clave puede venir del entorno.
  }
  const clave = process.env.BUFFER_API_KEY;
  if (!clave) {
    console.error('Falta BUFFER_API_KEY en .env (se genera en https://publish.buffer.com/settings/api).');
    process.exit(1);
  }
  const r = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clave}` },
    body: JSON.stringify({ query }),
  });
  const datos = await r.json();
  if (!r.ok || datos.errors) throw new Error(`Buffer respondió ${r.status}: ${JSON.stringify(datos.errors ?? datos)}`);
  return datos.data;
}

/** Cadena GraphQL: el escape de JSON le sirve tal cual. */
function gql(s) {
  return JSON.stringify(s);
}

async function canalesDeBuffer() {
  const { account } = await buffer('query { account { organizations { id } } }');
  const canales = [];
  for (const o of account.organizations) {
    const { channels } = await buffer(
      `query { channels(input: { organizationId: ${gql(o.id)} }) { id name service isQueuePaused } }`,
    );
    canales.push(...channels);
  }
  return canales;
}

/** El nombre del servicio en Buffer para cada red del calendario. */
function servicios(red) {
  return red === 'x' ? ['twitter', 'x'] : ['instagram'];
}

async function cargarCola(cal, prueba) {
  salirSiInvalido(cal);
  const aprobados = cal.posteos.filter((p) => p.estado === 'aprobado');
  if (!aprobados.length) {
    console.log('No hay nada aprobado para mandar a la cola.');
    return;
  }
  // Los reels van a mano por ahora: la subida de video por la API de Buffer no está probada,
  // y un posteo a medias en la cola es peor que uno que no salió.
  const reels = aprobados.filter((p) => p.pieza.video);
  if (reels.length) {
    console.error(`${reels.map((p) => p.id).join(', ')} son reels: cargalos a mano con el lote ("npm run redes -- lote") y sacalos de aprobado antes de usar la cola.`);
    process.exit(1);
  }

  // La imagen la baja Buffer desde el sitio: si no está publicada todavía, no se manda nada.
  for (const p of aprobados)
    for (const red of p.redes) {
      const url = `${SITIO}/redes/${p.id}-${red}.jpg`;
      const r = await fetch(url, { method: 'HEAD' });
      if (!r.ok) {
        console.error(`${url} no carga (${r.status}). Primero se integra y se publica el sitio con las piezas.`);
        if (!prueba) process.exit(1);
      }
    }

  const canales = prueba ? [] : await canalesDeBuffer();
  const canal = (red) => canales.find((c) => servicios(red).includes(c.service));

  for (const p of aprobados) {
    const ids = {};
    for (const red of p.redes) {
      const destino = canal(red);
      if (!prueba && !destino) {
        console.error(`No hay canal de ${red} conectado en Buffer. Conectalo y volvé a correr.`);
        process.exit(1);
      }
      const metadata = red === 'instagram' ? 'metadata: { instagram: { type: post, shouldShareToFeed: true } }' : '';
      const mutacion = `mutation { createPost(input: {
        text: ${gql(red === 'x' ? p.x : p.instagram)}
        channelId: ${gql(destino?.id ?? 'CANAL')}
        schedulingType: automatic
        mode: customScheduled
        dueAt: ${gql(new Date(p.fecha).toISOString())}
        assets: [{ image: { url: ${gql(`${SITIO}/redes/${p.id}-${red}.jpg`)}, metadata: { altText: ${gql(p.alt)} } } }]
        ${metadata}
      }) { ... on PostActionSuccess { post { id } } ... on MutationError { message } } }`;

      if (prueba) {
        console.log(`--- ${p.id} · ${red}\n${mutacion}`);
        continue;
      }
      const { createPost } = await buffer(mutacion);
      if (!createPost.post) {
        console.error(`${p.id} · ${red}: Buffer no lo aceptó: ${createPost.message}`);
        process.exit(1);
      }
      ids[red] = createPost.post.id;
      console.log(`${p.id} · ${red}: en la cola para ${p.fecha}`);
    }
    if (!prueba) {
      // Se anota posteo por posteo: si el siguiente falla, lo que ya entró queda registrado.
      p.estado = 'en-cola';
      p.buffer = ids;
      writeFileSync(CALENDARIO, `${JSON.stringify(cal, null, 2)}\n`);
    }
  }
}
