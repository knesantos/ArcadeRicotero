/**
 * El taller: separa cada tapa en las tres tintas de una serigrafia, y emite la trasera.
 *
 *   node scripts/generar-pasadas.mjs            (escribe)
 *   node scripts/generar-pasadas.mjs --ver      (solo informa, no toca nada)
 *
 * Es `T-199` del ciclo 12 y cumple `ADR-05`/`CTR-12` (`Docs/ARQ/ARQ-separaciones-de-tapa.md`).
 * Su guardian es `src/lib/tapa/pasadas.test.ts`: abre cada PNG y mira los pixeles.
 *
 * ## Que produce
 *
 * Por cada uno de los diez discos, tres PNG RGBA de 8 bits a 320 px, ya TENIDOS:
 *
 *   public/tapas/pasadas/<slug>-clara.png   la tinta mas luminosa de las dos medidas (RES-37)
 *   public/tapas/pasadas/<slug>-media.png   la otra
 *   public/tapas/pasadas/<slug>-clave.png   la clave: `--fondo`, la tinta del sitio
 *
 * y la trasera real, `public/tapas/trasera/<slug>.jpg`, a 320 px de lado largo: una ficha
 * mas, la de la otra cara (`ADR-05.6`). Y un manifiesto en `scripts/pasadas-manifiesto.json`
 * que **no lo baja nadie**: es una declaracion que el guardian comprueba, no una verdad.
 *
 * La pantalla apila las tres pasadas con `mix-blend-mode: multiply` sobre `--papel`, en el
 * orden en que una serigrafia se imprime de verdad —clara, media, clave— (`RES-54`), y
 * recien despues fija la foto. Al fallar, la clave sola.
 *
 * ## De donde salen los colores, y por que este archivo no tiene ni un hex
 *
 * `tokens.css` es el unico archivo del repo donde puede vivir un hex
 * (`.claude/rules/diseno-marca.md`). Este script LO LEE: `--disco-<slug>-tinta`,
 * `--disco-<slug>-apoyo`, `--papel` y `--fondo`. La clave es `--fondo` y no un negro
 * nuevo (`ADR-05.1`): un `#000000` seria un hex inventado, y ademas la clave es la unica
 * tinta que no rota, igual que la base de `D-19` — cada tapa pone sus dos colores, el
 * negro es del sitio. Si un token falta o no es un hex de seis digitos, el build se cae
 * nombrando el token: un color inventado es peor que un build roto (`ADR-05.2`).
 *
 * ## Como se separa, y las cinco versiones que costo llegar a esto
 *
 * Se probo a ojo sobre las diez tapas antes de escribir esta version (2026-09-01):
 *
 * 1. Umbrales fijos de luminancia: Oktubre perfecto, Luzbelito y Gulp! embarrados (son
 *    tapas oscuras: casi todo caia en la clave).
 * 2. Umbrales por percentil de cada tapa: Luzbelito y Gulp! arreglados, **Oktubre perdio
 *    el rojo** — el percentil repartio las letras en la tinta equivocada.
 * 3. Percentil inclusivo: igual.
 * 4. Cada pixel del medio va a la tinta MAS CERCANA en color (como una separacion de
 *    tintas planas real): Oktubre recupero el rojo, pero **perdio el negro del fondo**: con
 *    mas del 34 % de la tapa en negro plano, el percentil de la clave cae a cero y el
 *    ruido del JPEG sobre ese negro se va a la tinta gris.
 * 5. **Esta:** clave por percentil con PISO absoluto, papel por percentil con TECHO
 *    absoluto, y en el medio la tinta mas cercana. Si una de las dos tintas queda con
 *    menos del 6 % del medio, el medio se parte por luminancia: las tres aparecen siempre.
 *
 * **Un desvio declarado respecto de `ADR-05.1`, regla 4 y 5**, anotado en
 * `Docs/SUGERENCIAS/HILO-para-arquitectura-el-papel-de-la-estampa.md`: el contrato pide
 * tres mascaras que sumen la imagen entera (clara 25 %, media 40 %, clave 35 %). Acá hay
 * una cuarta zona que **no se imprime: el papel**, lo mas luminoso de la tapa. Es lo que
 * hace que la multitud de *Oktubre* se lea en papel y negro y no en gris; sin papel, la
 * version 2 lo demostro, la estampa es barro. Las mascaras siguen siendo disjuntas y de
 * tinta plana, que es lo que el contrato necesita para que el orden de impresion no quede
 * horneado en los archivos.
 *
 * Antes del umbral, un filtro de mediana y un suavizado leve: los bordes de una
 * serigrafia son bloques, no ruido (`ADR-05.1`, regla 3).
 *
 * ## Tinta plana, y por que el PNG es RGBA y no de paleta
 *
 * Alfa 0 o 255, nunca en el medio: una serigrafia sin trama es tinta plana, y el guardian
 * lo verifica pixel por pixel. Para eso el PNG es **RGBA de 8 bits, sin paleta ni
 * entrelazado** (`CTR-12` §2): asi el test lo abre con `node:zlib` y nada mas. Un PNG de
 * paleta pesaria menos y obligaria al guardian a una dependencia para verificar la unica
 * afirmacion que el riesgo del ciclo pide verificar.
 *
 * ## Las dos pasadas mudas, que existen y no son un defecto
 *
 * En *Gulp!* la tinta clara es del color del papel y en *Cordero atado* la media es del
 * color de la clave (`ADR-05.2`). Se imprimen igual —los cuarenta archivos existen
 * siempre— y el taller lo avisa con el numero: en serigrafia, el blanco es el papel que
 * no se imprimio.
 *
 * ## Nunca agranda, nunca toca el master, y no entra al build
 *
 * Las separaciones salen de la ficha de 320 px que ya existe; las traseras, del master de
 * `Docs/INVESTIGACION/TapasDiscos/`, que vive fuera de `public/` a proposito. `sharp` no
 * esta declarado en `package.json` y por eso este script se corre a mano y sus salidas se
 * versionan, como `generar-tapas.mjs` (`CTR-12` §7).
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const SOLO_VER = process.argv.includes('--ver');

const FICHAS = 'public/tapas';
const PASADAS = 'public/tapas/pasadas';
const TRASERAS = 'public/tapas/trasera';
const MASTERS = 'Docs/INVESTIGACION/TapasDiscos';
const TOKENS = 'src/styles/tokens.css';
const MANIFIESTO = 'scripts/pasadas-manifiesto.json';

/** Los diez, en el orden de `src/lib/letra/discos.ts`. Se repite y no se importa porque
 *  este script es `.mjs` y aquel `.ts`: la lista tiene once lineas y el guardian la cruza. */
const DISCOS = [
  'gulp',
  'oktubre',
  'un-baion-para-el-ojo-idiota',
  'bang-bang-estas-liquidado',
  'la-mosca-y-la-sopa',
  'lobo-suelto',
  'cordero-atado',
  'luzbelito',
  'ultimo-bondi-a-finisterre',
  'momo-sampler',
];

/**
 * De que master sale cada trasera (`ADR-05.6`, con `RES-44` detras): los dos volumenes
 * de Lobo suelto comparten master; el CD1 es *Lobo suelto* y el CD2 *Cordero atado*.
 */
const MASTER_TRASERA = Object.fromEntries(
  DISCOS.map((s) => [
    s,
    s === 'lobo-suelto'
      ? 'lobo-suelto-cordero-atado-cd1-trasera'
      : s === 'cordero-atado'
        ? 'lobo-suelto-cordero-atado-cd2-trasera'
        : `${s}-trasera`,
  ]),
);

/* ---- Las constantes del taller (`CTR-12` §3). Ningun numero se escribe dos veces. ---- */
/** Sigma del suavizado antes del umbral. Techo 3.0: arriba de eso la tapa deja de reconocerse. */
const SIGMA_SUAVIZADO = 0.9;
/** El filtro de mediana que saca el ruido del JPEG antes de suavizar. */
const MEDIANA = 3;
/** Fraccion de la tapa que se lleva la clave (lo mas oscuro), como percentil. */
const CUOTA_CLAVE = 0.34;
/** Fraccion de la tapa que queda como papel (lo mas luminoso), sin imprimir. */
const CUOTA_PAPEL = 0.14;
/** Piso absoluto de la clave (0..255): el ruido sobre un negro plano no se va a otra tinta. */
const PISO_CLAVE = 44;
/** Techo absoluto del papel (0..255). */
const TECHO_PAPEL = 218;
/** Si una tinta queda con menos que esto del medio, el reparto por color no dice nada. */
const MINIMO_TINTA = 0.06;
/** Por debajo de esto contra el papel o la clave, la pasada es muda y se avisa. */
const MIN_CONTRASTE_ENTRE_TINTAS = 1.5;
const TOPE_KB_PASADA = 20;
const TOPE_KB_PASADAS = 48;
const TOPE_KB_TRASERA = 40;
const ANCHO = 320;
const ANCHO_TRASERA = 320;

// ---------------------------------------------------------------- los colores

const tokens = fs.readFileSync(TOKENS, 'utf-8');
const errores = [];

function hexDeToken(nombre) {
  const m = tokens.match(new RegExp(`${nombre}:\\s*([^;]+);`));
  if (!m) {
    errores.push(`falta el token ${nombre} en ${TOKENS}`);
    return null;
  }
  const valor = m[1].trim().split('/*')[0].trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(valor)) {
    errores.push(`el token ${nombre} no es un hex de seis digitos: "${valor}"`);
    return null;
  }
  return valor.toLowerCase();
}

const rgbDe = (hex) => ({
  hex,
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

/** Luminancia relativa WCAG: la misma definicion de "que tan claro" que usa `contraste.test.ts`. */
function luminancia({ r, g, b }) {
  const canal = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

const contraste = (a, b) => {
  const [la, lb] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
};

const hexPapel = hexDeToken('--papel');
const hexFondo = hexDeToken('--fondo');

// ---------------------------------------------------------------- la separacion

async function separar(slug, PAPEL, CLAVE) {
  const ficha = path.join(FICHAS, `${slug}.jpg`);
  if (!fs.existsSync(ficha)) {
    errores.push(`falta la ficha ${ficha}: corre \`node scripts/generar-tapas.mjs\` primero`);
    return null;
  }
  const hexTinta = hexDeToken(`--disco-${slug}-tinta`);
  const hexApoyo = hexDeToken(`--disco-${slug}-apoyo`);
  if (!hexTinta || !hexApoyo) return null;

  const base = sharp(ficha).resize({ width: ANCHO, withoutEnlargement: true }).median(MEDIANA).blur(SIGMA_SUAVIZADO);
  const { data: gris, info } = await base.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  const { data: rgb } = await base.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;

  const tinta = rgbDe(hexTinta);
  const apoyo = rgbDe(hexApoyo);
  const [clara, media] = luminancia(tinta) >= luminancia(apoyo) ? [tinta, apoyo] : [apoyo, tinta];

  // Histograma de la propia tapa: los cortes son percentiles, no valores fijos.
  const hist = new Array(256).fill(0);
  for (let i = 0; i < n; i++) hist[gris[i]]++;
  const corte = (fraccion) => {
    let acumulado = 0;
    for (let v = 0; v < 256; v++) {
      acumulado += hist[v];
      if (acumulado >= n * fraccion) return v;
    }
    return 255;
  };
  const techoClave = Math.max(corte(CUOTA_CLAVE), PISO_CLAVE);
  const pisoPapel = Math.min(corte(1 - CUOTA_PAPEL), TECHO_PAPEL);

  const distancia = (i, c) => {
    const dr = rgb[i * 3] - c.r, dg = rgb[i * 3 + 1] - c.g, db = rgb[i * 3 + 2] - c.b;
    return dr * dr + dg * dg + db * db;
  };

  const mascara = { clara: Buffer.alloc(n), media: Buffer.alloc(n), clave: Buffer.alloc(n) };
  const medio = [];
  for (let i = 0; i < n; i++) {
    const l = gris[i];
    if (l <= techoClave) { mascara.clave[i] = 255; continue; }
    if (l > pisoPapel) continue;
    medio.push(i);
    if (distancia(i, clara) <= distancia(i, media)) mascara.clara[i] = 255;
    else mascara.media[i] = 255;
  }

  // La garantia de las tres tintas.
  const cuenta = (m) => medio.reduce((acum, i) => acum + (m[i] ? 1 : 0), 0);
  let repartoPorLuz = false;
  if (medio.length && (cuenta(mascara.clara) < medio.length * MINIMO_TINTA || cuenta(mascara.media) < medio.length * MINIMO_TINTA)) {
    repartoPorLuz = true;
    const ordenado = [...medio].sort((a, b) => gris[a] - gris[b]);
    const mitad = Math.floor(ordenado.length / 2);
    ordenado.forEach((i, k) => {
      mascara.clara[i] = k >= mitad ? 255 : 0;
      mascara.media[i] = k < mitad ? 255 : 0;
    });
  }

  const avisos = [];
  if (contraste(clara, PAPEL) < MIN_CONTRASTE_ENTRE_TINTAS) avisos.push(`la clara (${clara.hex}) es del color del papel: ${contraste(clara, PAPEL).toFixed(2)}:1, pasada muda`);
  if (contraste(media, CLAVE) < MIN_CONTRASTE_ENTRE_TINTAS) avisos.push(`la media (${media.hex}) es del color de la clave: ${contraste(media, CLAVE).toFixed(2)}:1, pasada muda`);

  const salida = [];
  for (const [nombre, color] of [['clara', clara], ['media', media], ['clave', CLAVE]]) {
    const rgba = Buffer.alloc(n * 4);
    const m = mascara[nombre];
    let opacos = 0;
    for (let i = 0; i < n; i++) {
      rgba[i * 4] = color.r; rgba[i * 4 + 1] = color.g; rgba[i * 4 + 2] = color.b; rgba[i * 4 + 3] = m[i];
      if (m[i]) opacos++;
    }
    // RGBA de 8 bits, sin paleta, sin entrelazado (CTR-12 §2): el guardian lo abre con zlib.
    const png = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png({ palette: false, compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    salida.push({ nombre, hex: color.hex, cobertura: opacos / n, bytes: png.length, png });
  }
  const papel = 1 - salida.reduce((a, s) => a + s.cobertura, 0);
  const hashFicha = createHash('sha1').update(fs.readFileSync(ficha)).digest('hex').slice(0, 8);
  return { slug, ancho: info.width, alto: info.height, repartoPorLuz, avisos, salida, papel, hashFicha };
}

// ---------------------------------------------------------------- la trasera

async function trasera(slug) {
  const master = path.join(MASTERS, `${MASTER_TRASERA[slug]}.jpg`);
  if (!fs.existsSync(master)) {
    errores.push(`falta el master de la trasera de ${slug}: ${master}`);
    return null;
  }
  // La calidad mas alta que entra en el tope, como hace `generar-tapas.mjs` con el fondo.
  let calidad = 82;
  let jpeg;
  do {
    jpeg = await sharp(master).resize({ width: ANCHO_TRASERA, withoutEnlargement: true }).jpeg({ quality: calidad, mozjpeg: true }).toBuffer();
    calidad -= 6;
  } while (jpeg.length > TOPE_KB_TRASERA * 1024 && calidad > 30);
  const meta = await sharp(jpeg).metadata();
  return { slug, bytes: jpeg.length, calidad: calidad + 6, ancho: meta.width, alto: meta.height, jpeg };
}

// ---------------------------------------------------------------- correr

console.log(SOLO_VER ? 'Solo mirando. Nada se escribe.\n' : `Escribiendo en ${PASADAS}, ${TRASERAS} y ${MANIFIESTO}\n`);

const PAPEL = hexPapel ? rgbDe(hexPapel) : null;
const CLAVE = hexFondo ? rgbDe(hexFondo) : null;
const manifiesto = { generado: 'node scripts/generar-pasadas.mjs', contrato: 'CTR-12', discos: {} };
const resultados = [];
if (PAPEL && CLAVE) {
  for (const slug of DISCOS) resultados.push({ slug, s: await separar(slug, PAPEL, CLAVE), t: await trasera(slug) });
}

// No corta en el primer error: junta todos, no escribe nada de los discos afectados.
if (errores.length) {
  console.error('El taller no escribio nada de los discos afectados:');
  for (const e of errores) console.error(`  ✗ ${e}`);
}

let pasan = errores.length === 0;
if (!SOLO_VER && pasan) {
  fs.mkdirSync(PASADAS, { recursive: true });
  fs.mkdirSync(TRASERAS, { recursive: true });
}
for (const { slug, s, t } of resultados) {
  if (!s || !t) continue;
  const totalPasadas = s.salida.reduce((a, x) => a + x.bytes, 0);
  const fila = s.salida
    .map((c) => `${c.nombre} ${c.hex} ${(c.bytes / 1024).toFixed(1)} KB (${Math.round(c.cobertura * 100)} %)${c.bytes > TOPE_KB_PASADA * 1024 ? ' ⚠ PASA EL TOPE' : ''}`)
    .join(' · ');
  if (s.salida.some((c) => c.bytes > TOPE_KB_PASADA * 1024) || totalPasadas > TOPE_KB_PASADAS * 1024 || t.bytes > TOPE_KB_TRASERA * 1024) pasan = false;
  console.log(`${slug.padEnd(28)} ${fila} · papel ${Math.round(s.papel * 100)} %${s.repartoPorLuz ? ' · (medio repartido por luz)' : ''}`);
  console.log(`${''.padEnd(28)} las tres: ${(totalPasadas / 1024).toFixed(1)} KB${totalPasadas > TOPE_KB_PASADAS * 1024 ? ' ⚠ PASA EL TOPE' : ''} · trasera ${t.ancho}×${t.alto} ${(t.bytes / 1024).toFixed(1)} KB (q${t.calidad})${t.bytes > TOPE_KB_TRASERA * 1024 ? ' ⚠ PASA EL TOPE' : ''}`);
  for (const a of s.avisos) console.log(`${''.padEnd(28)} aviso: ${a}`);

  if (!SOLO_VER && pasan) {
    for (const c of s.salida) fs.writeFileSync(path.join(PASADAS, `${slug}-${c.nombre}.png`), c.png);
    fs.writeFileSync(path.join(TRASERAS, `${slug}.jpg`), t.jpeg);
  }
  manifiesto.discos[slug] = {
    ficha: `${FICHAS}/${slug}.jpg`,
    hashFicha: s.hashFicha,
    ancho: s.ancho,
    alto: s.alto,
    pasadas: Object.fromEntries(s.salida.map((c) => [c.nombre, { hex: c.hex, cobertura: Number(c.cobertura.toFixed(4)), bytes: c.bytes }])),
    papel: Number(s.papel.toFixed(4)),
    repartoPorLuz: s.repartoPorLuz,
    avisos: s.avisos,
    trasera: { master: `${MASTERS}/${MASTER_TRASERA[slug]}.jpg`, bytes: t.bytes, calidad: t.calidad, ancho: t.ancho, alto: t.alto },
  };
}
if (!SOLO_VER && pasan) fs.writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + '\n');

console.log(pasan ? '\nTodo dentro de los topes de CTR-12.' : '\n⚠ Algo esta mal: no es un aviso, es un defecto. No se escribio nada.');
process.exitCode = pasan ? 0 : 1;
