/**
 * Genera la cara que el sitio muestra cuando alguien lo saca a la calle.
 *
 *   node --experimental-strip-types scripts/generar-marca-social.mjs
 *
 * Produce tres archivos en `public/`:
 *
 *   · `tarjeta.png`  (1200x630) — la imagen de la tarjeta al compartir (`og:image`)
 *   · `icono-180.png` (180x180)  — el icono de pantalla de inicio
 *   · `favicon.svg`              — el icono de la pestaña
 *
 * **Por que un script y no tres archivos a mano.** Porque los colores salen de
 * `tokens.css` y de ningun otro lado: la regla de marca dice que ahi vive el unico hex
 * del repo, y un PNG con el rojo copiado a ojo es exactamente la clase de verdad
 * duplicada que esa regla evita. Si manana el fondo se aclara, se vuelve a correr esto y
 * la tarjeta se aclara sola.
 *
 * **Por que la tarjeta no lleva texto.** Porque las letras del sitio son fuentes
 * autoalojadas y aca no hay con que rasterizarlas; escribir el titulo con la letra que
 * haya instalada seria justo lo que la regla anti-slop veta ("la pila del sistema como
 * voz de titulo"). Las palabras las pone `og:title`, que todo previsualizador muestra al
 * lado de la imagen. Lo que aporta la imagen es la figura.
 *
 * El credito de `D-21` viaja en `og:image:alt` (ver `components/Cabeza.astro`).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';

// ---------------------------------------------------------------- tokens

const TOKENS = readFileSync('src/styles/tokens.css', 'utf-8');

/** El hex de un token, tal como esta escrito en tokens.css, como [r,g,b]. */
function color(nombre) {
  const hallado = new RegExp(`${nombre}\\s*:\\s*(#[0-9a-fA-F]{6})`).exec(TOKENS);
  if (!hallado) throw new Error(`tokens.css no declara ${nombre} como hex`);
  const h = hallado[1];
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

const hex = (nombre) => new RegExp(`${nombre}\\s*:\\s*(#[0-9a-fA-F]{6})`).exec(TOKENS)[1];

// ---------------------------------------------------------------- PNG: leer

/** Decodifica un PNG RGBA de 8 bits (los que produce cualquier recorte con transparencia). */
function leerPNG(ruta) {
  const b = readFileSync(ruta);
  if (b.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${ruta} no es PNG`);
  const ancho = b.readUInt32BE(16);
  const alto = b.readUInt32BE(20);
  if (b[24] !== 8 || b[25] !== 6) throw new Error(`${ruta}: solo se lee RGBA de 8 bits`);

  const trozos = [];
  let p = 8;
  while (p < b.length) {
    const largo = b.readUInt32BE(p);
    if (b.toString('ascii', p + 4, p + 8) === 'IDAT') trozos.push(b.subarray(p + 8, p + 8 + largo));
    p += 12 + largo;
  }
  const crudo = inflateSync(Buffer.concat(trozos));

  // Deshacer los filtros por linea (el formato guarda diferencias, no valores).
  const paso = ancho * 4;
  const px = Buffer.alloc(alto * paso);
  for (let y = 0; y < alto; y++) {
    const filtro = crudo[y * (paso + 1)];
    const linea = crudo.subarray(y * (paso + 1) + 1, (y + 1) * (paso + 1));
    for (let x = 0; x < paso; x++) {
      const a = x >= 4 ? px[y * paso + x - 4] : 0;
      const arriba = y > 0 ? px[(y - 1) * paso + x] : 0;
      const esquina = x >= 4 && y > 0 ? px[(y - 1) * paso + x - 4] : 0;
      let v = linea[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += arriba;
      else if (filtro === 3) v += (a + arriba) >> 1;
      else if (filtro === 4) {
        const pp = a + arriba - esquina;
        const pa = Math.abs(pp - a);
        const pb = Math.abs(pp - arriba);
        const pc = Math.abs(pp - esquina);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? arriba : esquina;
      }
      px[y * paso + x] = v & 255;
    }
  }
  return { ancho, alto, px };
}

// ---------------------------------------------------------------- PNG: escribir

const TABLA_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function trozo(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, crc]);
}

/** Escribe un PNG RGB de 8 bits (la tarjeta y el icono son opacos: no hace falta alfa). */
function escribirPNG(ruta, ancho, alto, rgb) {
  const cabecera = Buffer.alloc(13);
  cabecera.writeUInt32BE(ancho, 0);
  cabecera.writeUInt32BE(alto, 4);
  cabecera[8] = 8; // bits por canal
  cabecera[9] = 2; // color: RGB
  const paso = ancho * 3;
  const crudo = Buffer.alloc(alto * (paso + 1));
  for (let y = 0; y < alto; y++) {
    crudo[y * (paso + 1)] = 0; // sin filtro: son colores planos, comprime igual
    rgb.copy(crudo, y * (paso + 1) + 1, y * paso, (y + 1) * paso);
  }
  writeFileSync(
    ruta,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      trozo('IHDR', cabecera),
      trozo('IDAT', deflateSync(crudo, { level: 9 })),
      trozo('IEND', Buffer.alloc(0)),
    ]),
  );
}

// ---------------------------------------------------------------- pintar

function lienzo(ancho, alto, [r, g, b]) {
  const px = Buffer.alloc(ancho * alto * 3);
  for (let i = 0; i < px.length; i += 3) {
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
  }
  return { ancho, alto, px };
}

function rectangulo(l, x0, y0, w, h, [r, g, b]) {
  for (let y = Math.max(0, y0); y < Math.min(l.alto, y0 + h); y++) {
    for (let x = Math.max(0, x0); x < Math.min(l.ancho, x0 + w); x++) {
      const i = (y * l.ancho + x) * 3;
      l.px[i] = r;
      l.px[i + 1] = g;
      l.px[i + 2] = b;
    }
  }
}

function circulo(l, cx, cy, radio, [r, g, b]) {
  for (let y = Math.max(0, cy - radio); y <= Math.min(l.alto - 1, cy + radio); y++) {
    for (let x = Math.max(0, cx - radio); x <= Math.min(l.ancho - 1, cx + radio); x++) {
      // Cobertura por muestreo: el borde queda mezclado en vez de escalonado.
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      const cobertura = Math.max(0, Math.min(1, radio + 0.5 - d));
      if (cobertura <= 0) continue;
      const i = (y * l.ancho + x) * 3;
      l.px[i] += (r - l.px[i]) * cobertura;
      l.px[i + 1] += (g - l.px[i + 1]) * cobertura;
      l.px[i + 2] += (b - l.px[i + 2]) * cobertura;
    }
  }
}

/** Pega un PNG con alfa encima del lienzo, escalado por promedio de area. */
function pegar(l, img, dx, dy, dw, dh) {
  const escalaX = img.ancho / dw;
  const escalaY = img.alto / dh;
  for (let y = 0; y < dh; y++) {
    const destinoY = dy + y;
    if (destinoY < 0 || destinoY >= l.alto) continue;
    const y0 = Math.floor(y * escalaY);
    const y1 = Math.max(y0 + 1, Math.floor((y + 1) * escalaY));
    for (let x = 0; x < dw; x++) {
      const destinoX = dx + x;
      if (destinoX < 0 || destinoX >= l.ancho) continue;
      const x0 = Math.floor(x * escalaX);
      const x1 = Math.max(x0 + 1, Math.floor((x + 1) * escalaX));

      let sr = 0, sg = 0, sb = 0, sa = 0, n = 0;
      for (let sy = y0; sy < Math.min(y1, img.alto); sy++) {
        for (let sx = x0; sx < Math.min(x1, img.ancho); sx++) {
          const i = (sy * img.ancho + sx) * 4;
          const a = img.px[i + 3] / 255;
          sr += img.px[i] * a;
          sg += img.px[i + 1] * a;
          sb += img.px[i + 2] * a;
          sa += a;
          n++;
        }
      }
      if (!n || sa === 0) continue;
      const alfa = sa / n;
      const i = (destinoY * l.ancho + destinoX) * 3;
      l.px[i] += (sr / sa - l.px[i]) * alfa;
      l.px[i + 1] += (sg / sa - l.px[i + 1]) * alfa;
      l.px[i + 2] += (sb / sa - l.px[i + 2]) * alfa;
    }
  }
}

// ---------------------------------------------------------------- las piezas

const FONDO = color('--fondo');
const ROJO = color('--marca-rojo');
const PAPEL = color('--papel');

/**
 * La tarjeta al compartir. La figura de la cadena, grande, sobre tinta, con la franja
 * roja abajo — la misma tinta plana de la serigrafia, sin degradados ni sombras.
 */
function tarjeta() {
  const A = 1200;
  const AL = 630;
  const l = lienzo(A, AL, FONDO);

  const figura = leerPNG('public/arte/oktubre-cadena.png');
  const alto = Math.round(AL * 0.72);
  const ancho = Math.round((alto * figura.ancho) / figura.alto);
  pegar(l, figura, Math.round((A - ancho) / 2), Math.round((AL - alto) / 2) - 18, ancho, alto);

  // La franja roja del pie: ancla la composicion y trae el rojo de Oktubre a la tarjeta.
  rectangulo(l, 0, AL - 54, A, 54, ROJO);

  escribirPNG('public/tarjeta.png', A, AL, l.px);
  return `tarjeta.png ${A}x${AL}`;
}

/**
 * El icono: un cassette. Es la metafora del sitio entera —el portal es un cassette
 * grabado en casa— y a 16 px se lee como una estampa roja con su etiqueta de papel.
 */
function cassette(lado) {
  const l = lienzo(lado, lado, FONDO);
  const u = lado / 180; // todo se dibuja sobre una grilla de 180 y se escala
  const p = (v) => Math.round(v * u);

  rectangulo(l, p(14), p(38), p(152), p(104), ROJO); // el cuerpo
  rectangulo(l, p(28), p(50), p(124), p(38), PAPEL); // la etiqueta de papel
  rectangulo(l, p(52), p(96), p(76), p(38), FONDO); // la ventana de la cinta
  circulo(l, p(74), p(115), p(12), PAPEL); // los dos carreteles, enteros adentro
  circulo(l, p(106), p(115), p(12), PAPEL);

  return l;
}

function icono() {
  const l = cassette(180);
  escribirPNG('public/icono-180.png', 180, 180, l.px);
  return 'icono-180.png 180x180';
}

/**
 * El mismo cassette en vector para la pestaña. Se genera desde acá y no se escribe a
 * mano por lo mismo que todo lo demas: los colores son los del token, no copias.
 */
function favicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="Arcade Ricotero">
  <rect width="180" height="180" fill="${hex('--fondo')}"/>
  <rect x="14" y="38" width="152" height="104" fill="${hex('--marca-rojo')}"/>
  <rect x="28" y="50" width="124" height="38" fill="${hex('--papel')}"/>
  <rect x="52" y="96" width="76" height="38" fill="${hex('--fondo')}"/>
  <circle cx="74" cy="115" r="12" fill="${hex('--papel')}"/>
  <circle cx="106" cy="115" r="12" fill="${hex('--papel')}"/>
</svg>
`;
  writeFileSync('public/favicon.svg', svg);
  return 'favicon.svg';
}

for (const hecho of [tarjeta(), icono(), favicon()]) console.log('generado:', hecho);
