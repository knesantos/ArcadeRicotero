/**
 * La multitud de *Oktubre*: la gente del final del portal y la que se ve de lejos al bajar.
 *
 *   node scripts/generar-multitud.mjs            (escribe)
 *   node scripts/generar-multitud.mjs --ver      (solo informa, no toca nada)
 *
 * Dos pedidos del usuario, en orden:
 *
 * - 2026-10-04 (`D-63`): *"usemos esta imagen de fondo de la página, sin la parte de las
 *   letras de oktubre, un fondo negro y sobre el final de la página las personas mirando"*.
 * - 2026-10-05 (`D-63`, enmienda 1): *"me gustaría que mientras vas bajando en la página en el
 *   fondo se vean banderas rojas y gente, como si la gente del final fuese el final de una
 *   multitud gigante, como si ir para abajo fuese acercarse a la multitud"*.
 *
 * Así que esto produce dos cosas.
 *
 * ## 1. La fila de adelante: `public/arte/multitud-oktubre.png`
 *
 * El piso del pie de imprenta. Sale de `oktubre-frontal-ancha.webp`, 1280×720: la tapa de
 * *Oktubre* estirada a 16:9 por alguien, con el wordmark rojo y la multitud de Rocambole. La
 * trajo el usuario y su origen no está fichado. **Ojo con los costados:** la tapa cuadrada
 * ocupa más o menos de x=257 a x=987; lo que queda afuera son caras agregadas para llenar el
 * ancho, y no son de Rocambole.
 *
 * Corta abajo del wordmark (`DESDE`), saca el negro de la imagen —gris neutro con nubes de
 * aerógrafo, no el del sitio— y reimprime la gente en dos tintas de `tokens.css`: lo claro en
 * `--papel` y las banderas en `--disco-oktubre-tinta`.
 *
 * **Y desde la enmienda 1 lleva una tercera tinta, `--fondo`, rellenando la silueta.** Detrás
 * de esta fila ahora hay más multitud, y una fila de gente tapa a la de atrás: sin el relleno,
 * la de atrás se vería por adentro de las caras de adelante, entre los trazos. La silueta es
 * del mismo negro que la página, así que sobre el fondo liso no se nota; solo se nota que tapa.
 *
 * ## 2. La multitud de lejos: `public/arte/multitud-lejos-{clara,roja,silueta}.png`
 *
 * Tres máscaras de alfa sola —como las pasadas: la tinta la pone `sitio.css` desde
 * `tokens.css`, y así se ajusta cuánto se ve sin volver a correr esto—. Salen del frente
 * ORIGINAL de la tapa (`oktubre-frontal.jpg`, de Rocambole entero), de las banderas para
 * abajo: las banderas rojas son lo que se ve primero de una multitud que está lejos.
 *
 * **En espejo**: la tapa y la tapa dada vuelta, una al lado de la otra. Así el mosaico no
 * tiene costura —el borde derecho de una es el izquierdo de la otra—, y en una pantalla ancha
 * la multitud sigue sin cortes. El precio es que en los dos ejes del espejo las banderas
 * quedan de a pares; `sitio.css` corre cada plano a una altura distinta para que los ejes no
 * caigan uno sobre el otro.
 *
 * ## La silueta
 *
 * Es el contorno de arriba de la gente, rellenado hacia abajo: se marca dónde hay tinta clara,
 * se emparcha (un desenfoque corto junta los trazos de una cabeza), y en cada columna se busca
 * la primera fila con gente. Esa línea se limpia en dos pasadas: se le sacan los picos finos
 * —un palo de bandera, un puño solo— y se le tapan las muescas angostas entre dos cabezas.
 * Las banderas NO entran en la silueta: flamean contra el cielo y detrás se tiene que seguir
 * viendo lo que haya.
 *
 * Este archivo no tiene ni un hex: los lee de `tokens.css`, igual que `generar-pasadas.mjs`.
 */
import sharp from 'sharp';
import fs from 'node:fs';

const TOKENS = 'src/styles/tokens.css';
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
const FONDO = rgbDeToken('--fondo');

const limitar = (x) => Math.min(1, Math.max(0, x));

/**
 * Cuánto hay de cada tinta en cada píxel. Lo claro sale del canal más bajo —en un blanco los
 * tres canales están arriba, en el rojo no— y lo rojo de cuánto le gana el rojo a los otros
 * dos. Los pisos se comen el ruido del negro de cada máster; los techos son el blanco y el
 * rojo pleno medidos en ese máster.
 */
function separar(rgb, n, { pisoClaro, pisoRojo, rojoLleno }) {
  const claro = new Float32Array(n);
  const rojo = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = rgb[i * 3];
    const g = rgb[i * 3 + 1];
    const b = rgb[i * 3 + 2];
    claro[i] = limitar((Math.min(r, g, b) - pisoClaro) / (255 - pisoClaro));
    rojo[i] = limitar((r - Math.max(g, b) - pisoRojo) / (rojoLleno - pisoRojo));
  }
  return { claro, rojo };
}

/** Promedio corrido de un renglón, con el borde dado vuelta (`ciclico`) o estirado. */
function promedio1d(v, radio, ciclico) {
  const n = v.length;
  const out = new Float32Array(n);
  const en = (i) => (ciclico ? v[((i % n) + n) % n] : v[Math.min(n - 1, Math.max(0, i))]);
  let suma = 0;
  for (let i = -radio; i <= radio; i++) suma += en(i);
  for (let i = 0; i < n; i++) {
    out[i] = suma / (2 * radio + 1);
    suma += en(i + radio + 1) - en(i - radio);
  }
  return out;
}

/** Mínimo o máximo corrido de un renglón. */
function extremo1d(v, radio, fn, ciclico) {
  const n = v.length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let m = v[i];
    for (let k = -radio; k <= radio; k++) {
      const j = ciclico ? (((i + k) % n) + n) % n : Math.min(n - 1, Math.max(0, i + k));
      m = fn(m, v[j]);
    }
    out[i] = m;
  }
  return out;
}

/** El desenfoque que emparcha: tres pasadas de caja, por renglón y por columna. */
function desenfocar(m, w, h, radio, ciclico) {
  let a = m;
  for (let pasada = 0; pasada < 3; pasada++) {
    const fil = new Float32Array(w * h);
    for (let y = 0; y < h; y++) fil.set(promedio1d(a.subarray(y * w, (y + 1) * w), radio, ciclico), y * w);
    const col = new Float32Array(w * h);
    const c = new Float32Array(h);
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) c[y] = fil[y * w + x];
      const p = promedio1d(c, radio, false);
      for (let y = 0; y < h; y++) col[y * w + x] = p[y];
    }
    a = col;
  }
  return a;
}

/**
 * La silueta de la gente, como alfa de 0 a 1. Ver la cabecera: dónde hay tinta clara, un
 * desenfoque que junta los trazos de una cabeza —y que a un palo o a un puño solo los deja
 * tan finos que no pasan el `umbral`—, la primera fila con gente en cada columna, un poco de
 * `holgura` para no cortarle la coronilla a nadie, y un promedio que redondea: cabezas, no
 * almenas. `piso` es la red de abajo de todo, donde una multitud no tiene huecos.
 *
 * Se probó antes con mínimos y máximos corridos (sacar picos, tapar muescas): dejaba mesetas
 * planas, un castillo. El promedio sobre la línea ensanchada da lomas.
 */
function silueta(claro, w, h, { umbral, radio, holgura, suavizado, piso, ciclico }) {
  const marca = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) marca[i] = claro[i] > 0.2 ? 1 : 0;
  const parche = desenfocar(marca, w, h, radio, ciclico);
  let altura = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    let y = 0;
    while (y < h && parche[y * w + x] < umbral) y++;
    altura[x] = h - y;
  }
  // Donde no se encontró a nadie por encima del piso —una zona de caras oscuras, el borde de
  // la tapa—, la línea no cae al piso: se tiende entre las cabezas de los dos lados. Caer al
  // piso dejaba un tramo recto, y una multitud no tiene renglones.
  const valida = (x) => altura[x] >= h * piso;
  const llena = Float32Array.from(altura);
  for (let x = 0; x < w; x++) {
    if (valida(x)) continue;
    let izq = -1;
    let der = -1;
    for (let d = 1; d < w && (izq < 0 || der < 0); d++) {
      const a = ciclico ? (((x - d) % w) + w) % w : x - d;
      const b = ciclico ? (x + d) % w : x + d;
      if (izq < 0 && a >= 0 && valida(a)) izq = d;
      if (der < 0 && b < w && valida(b)) der = d;
    }
    const va = izq > 0 ? altura[ciclico ? (((x - izq) % w) + w) % w : x - izq] : null;
    const vb = der > 0 ? altura[ciclico ? (x + der) % w : x + der] : null;
    llena[x] = va !== null && vb !== null ? va + ((vb - va) * izq) / (izq + der) : (va ?? vb ?? h * piso);
  }
  altura = promedio1d(extremo1d(llena, holgura, Math.max, ciclico), suavizado, ciclico);
  const sil = new Float32Array(w * h);
  for (let x = 0; x < w; x++) {
    const tope = h - altura[x];
    for (let y = 0; y < h; y++) sil[y * w + x] = limitar(y - tope + 0.5);
  }
  return sil;
}

/** La tapa y la tapa dada vuelta, una al lado de la otra: un mosaico sin costura. */
function espejar(v, w, h) {
  const out = new Float32Array(2 * w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      out[y * 2 * w + x] = v[y * w + x];
      out[y * 2 * w + 2 * w - 1 - x] = v[y * w + x];
    }
  }
  return out;
}

async function leer(master, desde) {
  const meta = await sharp(master).metadata();
  const { data, info } = await sharp(master)
    .extract({ left: 0, top: desde, width: meta.width, height: meta.height - desde })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { rgb: data, w: info.width, h: info.height };
}

async function escribir(ruta, rgba, w, h, colores) {
  const png = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    // Paleta, como el resto de los recortes (`optimizar-arte.mjs`). Sin tramado: el grano ya
    // lo pone el sitio encima.
    .png({ palette: true, colors: colores, dither: 0, quality: 92, effort: 10, compressionLevel: 9 })
    .toBuffer();
  console.log(`${ruta}: ${w}×${h}, ${(png.length / 1024).toFixed(1)} KB`);
  if (!soloVer) fs.writeFileSync(ruta, png);
  return png.length;
}

// ---------------------------------------------------------------- 1. la fila de adelante

{
  /** Primera fila: el wordmark termina en y≈245 y el primer puño asoma en y≈362. */
  const DESDE = 352;
  const { rgb, w, h } = await leer('Docs/INVESTIGACION/TapasDiscos/oktubre-frontal-ancha.webp', DESDE);
  // Medidos en este máster: entre el wordmark y la gente el canal más bajo nunca pasa de 28,
  // y una bandera le gana al resto por 246.
  const { claro, rojo } = separar(rgb, w * h, { pisoClaro: 30, pisoRojo: 20, rojoLleno: 246 });
  const sil = silueta(claro, w, h, { umbral: 0.18, radio: 6, holgura: 4, suavizado: 9, piso: 0.25, ciclico: false });

  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    // Tres tintas apiladas en el orden de una serigrafía: la silueta en `--fondo` abajo, y
    // encima lo claro y lo rojo. El alfa final es la unión de las tres.
    const tinta = Math.min(1, claro[i] + rojo[i]);
    const alfa = tinta + sil[i] * (1 - tinta);
    if (alfa > 0) {
      for (let c = 0; c < 3; c++) {
        const conTinta = tinta > 0 ? (PAPEL[c] * claro[i] + ROJO[c] * rojo[i]) / (claro[i] + rojo[i]) : 0;
        rgba[i * 4 + c] = Math.round((conTinta * tinta + FONDO[c] * sil[i] * (1 - tinta)) / alfa);
      }
    }
    rgba[i * 4 + 3] = Math.round(alfa * 255);
  }
  await escribir('public/arte/multitud-oktubre.png', rgba, w, h, 128);
}

// ---------------------------------------------------------------- 2. la multitud de lejos

{
  /** De las banderas para abajo: el wordmark del frente original termina en y≈375. */
  const DESDE = 420;
  /**
   * A qué escala se guarda. Es fondo y se ve tenue: no hace falta la definición del máster, y
   * el plano más grande mide ~45 % de una ventana de 900 px, o sea que con 0,7 se estira
   * apenas. Cada décima menos son ~20 % menos de peso.
   */
  const ESCALA = 0.7;
  const master = 'Docs/INVESTIGACION/TapasDiscos/oktubre-frontal.jpg';
  const meta = await sharp(master).metadata();
  const w = Math.round(meta.width * ESCALA);
  const h = Math.round((meta.height - DESDE) * ESCALA);
  const { data: rgb } = await sharp(master)
    .extract({ left: 0, top: DESDE, width: meta.width, height: meta.height - DESDE })
    .resize(w, h)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // El negro de este JPEG anda por 19-23, con ruido de compresión hasta ~35; el rojo pleno de
  // una bandera le gana a los otros dos canales por ~200.
  const sep = separar(rgb, w * h, { pisoClaro: 40, pisoRojo: 30, rojoLleno: 200 });
  const W = 2 * w;
  const claro = espejar(sep.claro, w, h);
  const rojo = espejar(sep.rojo, w, h);
  const sil = silueta(claro, W, h, { umbral: 0.18, radio: 5, holgura: 3, suavizado: 7, piso: 0.2, ciclico: true });

  for (const [nombre, alfa] of [['clara', claro], ['roja', rojo], ['silueta', sil]]) {
    // Alfa sola: el color no importa, la máscara lee el canal alfa. Blanco, por si alguien
    // abre el archivo y quiere ver algo.
    const rgba = Buffer.alloc(W * h * 4, 255);
    for (let i = 0; i < W * h; i++) rgba[i * 4 + 3] = Math.round(alfa[i] * 255);
    await escribir(`public/arte/multitud-lejos-${nombre}.png`, rgba, W, h, 64);
  }
}
