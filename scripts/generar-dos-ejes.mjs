/**
 * El taller de "¿Qué tipo de ricotero sos?" (`D-57` puntos 8 y 10).
 *
 *   npm run generar-dos-ejes
 *
 * Produce, y deja en el repo:
 *
 *   · `public/arte/dos-ejes/libro-marmol.jpg`, `libro-lomo.jpg`, `libro-esquinero.png` y
 *     `libro-franja.jpg` — las cuatro piezas del libro de *Luzbelito*, recortadas del frente
 *     sin el óvalo, sin la figura y sin el título (las cajas viven en
 *     `src/lib/dos-ejes/arte.ts`);
 *   · `public/tarjetas/dos-ejes/cu-1.png` … `cu-4.png` — la tarjeta vertical que se comparte
 *     (1080 × 1350);
 *   · `public/tarjetas/dos-ejes/og-cu-1.png` … `og-cu-4.png` y `og-dos-ejes.png` — las vistas
 *     previas (1200 × 630) de las cuatro postales y de la portada del juego;
 *   · `scripts/dos-ejes-manifiesto.json` — la huella de lo que entró, que
 *     `src/lib/dos-ejes/tarjetas.test.ts` vuelve a calcular.
 *
 * ## Por qué un taller y no canvas en el teléfono
 *
 * Hay cuatro identidades y ninguna lleva un dato de la persona: todo se puede fabricar una vez.
 * Fijas, las tarjetas sirven además de `og:image` —que un previsualizador no puede pedirle a
 * un canvas— y la isla las baja al pintar el resultado, así `navigator.share({ files })` sale
 * en el mismo toque. Dibujar en el teléfono con `await` antes de compartir pierde el gesto en
 * Safari.
 *
 * ## Las letras
 *
 Todas salen trazo por trazo, con `fontkitten`, y ninguna depende de qué fuentes tenga la
 * máquina. Las de marca son las del sitio: Oktubre Calco (`.woff`, que lee) y Archivo Black en
 * `.ttf` (`scripts/fuentes/`, con su licencia OFL: `fontkitten` no lee el `.woff2` que sirve
 * el sitio). El texto largo va en DejaVu Sans, recortada al latín y con su licencia al lado:
 * cumple el papel de `--fuente` en pantalla, y con sus métricas el taller **mide** cada
 * renglón antes de ponerlo. Si una línea no entra en el papel, el taller falla en vez de
 * dibujarla afuera (`UX-36` §6.5).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { create } from 'fontkitten';
import { MASTER, PIEZAS, PROHIBIDO, LADO_MASTER, TARJETA as LIENZO_TARJETA, VISTA_PREVIA, sePisan } from '../src/lib/dos-ejes/arte.ts';
import { TARJETA, PANTALLA_0, RESULTADO, lineaQueNombra, selloDePolos } from '../src/lib/dos-ejes/copy.ts';
import {
  MANIFIESTO,
  FUENTE_CALCO,
  FUENTE_ROTULADA,
  FUENTE_SANS,
  FUENTE_SANS_NEGRITA,
  VERSION_DEL_DIBUJO,
  coloresDelTaller,
  cuadrantesDelBanco,
  huellaDelTaller,
  sitioDelTaller,
  textosDelTaller,
} from '../src/lib/dos-ejes/taller.ts';

const ARTE = 'public/arte/dos-ejes';
const TARJETAS = 'public/tarjetas/dos-ejes';
mkdirSync(ARTE, { recursive: true });
mkdirSync(TARJETAS, { recursive: true });

const C = coloresDelTaller();
const CALCO = create(readFileSync(FUENTE_CALCO));
const ROTULADA = create(readFileSync(FUENTE_ROTULADA));
const SANS = create(readFileSync(FUENTE_SANS));
const SANS_NEGRITA = create(readFileSync(FUENTE_SANS_NEGRITA));
/** El dominio, de `astro.config.mjs` y de ningún otro lado. */
const SITIO = sitioDelTaller();

// Antes de dibujar: que cada fuente tenga cada carácter que le toca. Una fuente recortada sin una
// letra no falla sola, dibuja un hueco (`CTR-08` v2, enmienda 1).
{
  const fuentes = { calco: CALCO, rotulada: ROTULADA, sans: SANS, sansNegrita: SANS_NEGRITA };
  const faltan = [];
  for (const [cual, textos] of Object.entries(textosDelTaller())) {
    for (const t of textos) for (const ch of t) if (ch !== ' ' && !fuentes[cual].hasGlyphForCodePoint(ch.codePointAt(0))) faltan.push(`${cual}: «${ch}» en «${t}»`);
  }
  if (faltan.length) throw new Error(`a las fuentes del taller les faltan letras:\n  ${faltan.join('\n  ')}`);
}

// ------------------------------------------------------------------ azar con semilla

/** Un generador con semilla: el grano sale igual cada vez que se corre el taller. */
function azar(semilla) {
  let s = Math.imul((semilla ^ 0x9e3779b9) >>> 0, 0x85ebca6b) >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

// ------------------------------------------------------------------ las piezas del libro

async function piezas() {
  for (const [nombre, p] of Object.entries(PIEZAS)) {
    const { caja } = p;
    if (caja.x + caja.ancho > LADO_MASTER || caja.y + caja.alto > LADO_MASTER) throw new Error(`${nombre}: la caja se sale del máster`);
    for (const [cual, prohibida] of Object.entries(PROHIBIDO)) {
      if (sePisan(caja, prohibida)) throw new Error(`${nombre}: la caja toca ${cual} (RES-168)`);
    }
    const base = sharp(MASTER).extract({ left: caja.x, top: caja.y, width: caja.ancho, height: caja.alto }).resize(p.ancho, p.alto);
    const destino = `${ARTE}/${p.archivo}`;
    if (nombre === 'esquinero') {
      // El triángulo de cuero, sin el mármol de al lado: la diagonal la marca la tapa misma.
      const mascara = `<svg xmlns="http://www.w3.org/2000/svg" width="${p.ancho}" height="${p.alto}"><polygon points="0,0 ${p.ancho},0 ${p.ancho},${p.alto}" fill="#fff"/></svg>`;
      await base
        .ensureAlpha()
        .composite([{ input: Buffer.from(mascara), blend: 'dest-in' }])
        .png({ compressionLevel: 9, palette: true, quality: 90 })
        .toFile(destino);
    } else {
      await base.jpeg({ quality: 72, mozjpeg: true }).toFile(destino);
    }
  }
}

// ------------------------------------------------------------------ letras

const ancho = (f, t, s, tracking = 0) => {
  let w = 0;
  for (const g of f.glyphsForString(t)) w += (g.advanceWidth * s) / f.unitsPerEm + tracking;
  return w - tracking;
};

/** Un renglón como trazos: no depende de qué fuentes tenga la máquina. */
function trazo(f, t, s, x, y, color, tracking = 0) {
  const k = s / f.unitsPerEm;
  let cx = 0;
  let d = '';
  for (const g of f.glyphsForString(t)) {
    d += g.path.scale(k, -k).translate(x + cx, y).toSVG();
    cx += g.advanceWidth * k + tracking;
  }
  return `<path d="${d}" fill="${color}"/>`;
}

/**
 * Parte un texto en renglones que entran en `max`, midiendo con la fuente de verdad. Una
 * palabra sola más ancha que `max` no se puede partir: el taller falla (`UX-36` §6.5, guarda 1).
 */
function partir(f, t, s, max, tracking = 0) {
  const salida = [];
  let actual = '';
  for (const p of t.split(' ')) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (ancho(f, prueba, s, tracking) > max && actual) {
      salida.push(actual);
      actual = p;
    } else actual = prueba;
  }
  if (actual) salida.push(actual);
  for (const r of salida) {
    if (ancho(f, r, s, tracking) > max) throw new Error(`«${r}» no entra en ${max} px a ${s} px: sale del papel`);
  }
  return salida;
}

/**
 * Como `partir`, pero con los renglones parejos: con la misma cantidad de renglones que el corte
 * goloso, elige el corte en el que el renglón más largo es el más corto. Para los nombres, que
 * son lo grande de la tarjeta: "Radio bajita, / misma hora" y no "Radio bajita, misma / hora".
 */
function partirParejo(f, t, s, max, tracking = 0) {
  const palabras = t.split(' ');
  const n = partir(f, t, s, max, tracking).length;
  let mejor = null;
  const probar = (desde, quedan, hechos) => {
    if (quedan === 1) {
      const renglones = [...hechos, palabras.slice(desde).join(' ')];
      const peor = Math.max(...renglones.map((r) => ancho(f, r, s, tracking)));
      if (peor <= max && (!mejor || peor < mejor.peor)) mejor = { renglones, peor };
      return;
    }
    for (let hasta = desde + 1; hasta <= palabras.length - quedan + 1; hasta++) {
      probar(hasta, quedan - 1, [...hechos, palabras.slice(desde, hasta).join(' ')]);
    }
  };
  probar(0, n, []);
  return mejor ? mejor.renglones : partir(f, t, s, max, tracking);
}

/** Un renglón que tiene que entrar entero, o el taller falla. */
function entero(f, t, s, max, tracking = 0) {
  if (ancho(f, t, s, tracking) > max) throw new Error(`«${t}» no entra en ${max} px a ${s} px`);
  return t;
}

/** El sello de goma: rectángulo de esquina casi viva, borde fino, mayúsculas, apenas torcido. */
function sello(t, x, y, cuerpo, color, giro = -2) {
  const tracking = 3;
  const w = ancho(ROTULADA, t.toUpperCase(), cuerpo, tracking) + cuerpo * 1.4;
  const h = cuerpo * 2.1;
  const svg = `<g transform="rotate(${giro} ${x} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="none" stroke="${color}" stroke-width="${Math.max(3, cuerpo / 7).toFixed(1)}"/>${trazo(ROTULADA, t.toUpperCase(), cuerpo, x + cuerpo * 0.7, y + h * 0.7, color, tracking)}</g>`;
  return { svg, ancho: w, alto: h };
}

/** El grano de serigrafía sobre el fondo: un cuadradito cada tanto, con semilla. */
function grano(w, h, semilla) {
  const r = azar(semilla);
  let s = '';
  for (let i = 0; i < (w * h) / 900; i++) {
    const x = Math.floor(r() * w);
    const y = Math.floor(r() * h);
    s += `<rect x="${x}" y="${y}" width="3" height="3" fill="${C['--texto']}" opacity="${(0.03 + r() * 0.05).toFixed(3)}"/>`;
  }
  return s;
}

/** Un hex de `tokens.css` como canales, para las capas que arma `sharp`. */
const canales = (hex, alpha) => ({ r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16), alpha });

/** La cinta de papel engomado: el papel al 62 %, torcido. */
async function cinta(w, h, giro) {
  return sharp({ create: { width: w, height: h, channels: 4, background: canales(C['--papel'], 0.62) } })
    .rotate(giro, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

/** La franja del libro a un ancho dado, torcida, con su sombra dura de papel sobre papel. */
async function libro(anchoFinal, giro) {
  const p = PIEZAS.franja;
  const alto = Math.round((anchoFinal * p.alto) / p.ancho);
  const tapa = await sharp(`${ARTE}/${p.archivo}`).resize(anchoFinal, alto).png().toBuffer();
  const sombra = await sharp({ create: { width: anchoFinal, height: alto, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.7 } } }).png().toBuffer();
  const conSombra = await sharp({ create: { width: anchoFinal + 14, height: alto + 14, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: sombra, left: 14, top: 14 },
      { input: tapa, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
  const torcido = await sharp(conSombra).rotate(giro, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const { height } = await sharp(torcido).metadata();
  return { imagen: torcido, alto: height };
}

const svg = (w, h, cuerpo) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${cuerpo}</svg>`);

/** La hoja de papel: sombra dura, papel, borde de tinta. */
const papel = (x, y, w, h, sombra) =>
  `<rect x="${x + sombra}" y="${y + sombra}" width="${w}" height="${h}" fill="black" opacity=".55"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C['--papel']}" stroke="${C['--fondo']}" stroke-width="6"/>`;

// ------------------------------------------------------------------ la tarjeta vertical

/*
 * Las medidas de `UX-36` §6.2. La hoja va de `x = 72` a `1008`; el texto, de `tx` a `tx + 824`,
 * y el nombre deja libres los 150 px del esquinero.
 */
const T = {
  M: 72,
  hy: 230,
  relleno: 56,
  esquinero: 150,
  altoMinimo: 740,
  altoMaximo: 860,
  libroAbajo: 1150,
};

/** La hoja de una manera, relativa a su borde de arriba. Devuelve el dibujo y el alto que necesita. */
function hojaDeLaTarjeta(c, tx) {
  const util = LIENZO_TARJETA.ancho - 2 * T.M - 2 * T.relleno;
  let s = trazo(ROTULADA, TARJETA.meSalio.toUpperCase(), 34, tx, 88, C['--papel-tenue'], 4);
  const nombre = partirParejo(ROTULADA, c.nombre, 80, util - T.esquinero);
  if (nombre.length > 3) throw new Error(`${c.id}: el nombre ocupa ${nombre.length} renglones en la tarjeta (tope 3)`);
  nombre.forEach((r, i) => (s += trazo(ROTULADA, r, 80, tx, 176 + i * 88, C['--fondo'])));
  let y = 176 + (nombre.length - 1) * 88;

  const elSello = sello(selloDePolos(c.luzOscuridad, c.ordenCaos), tx, y + 40, 30, C['--fondo']);
  if (elSello.ancho > util) throw new Error(`${c.id}: el sello sale del papel`);
  s += elSello.svg;
  y += 40 + elSello.alto;

  const linea = partir(SANS_NEGRITA, lineaQueNombra(c.luzOscuridad, c.ordenCaos), 40, util);
  if (linea.length > 2) throw new Error(`${c.id}: la línea que nombra ocupa ${linea.length} renglones (tope 2)`);
  y += 54;
  linea.forEach((r, i) => (s += trazo(SANS_NEGRITA, r, 40, tx, y + i * 48, C['--fondo'])));
  y += (linea.length - 1) * 48;

  const bajada = partir(SANS, c.bajada, 34, util);
  if (bajada.length > 5) throw new Error(`${c.id}: la bajada ocupa ${bajada.length} renglones en la tarjeta (tope 5)`);
  y += 58;
  bajada.forEach((r, i) => (s += trazo(SANS, r, 34, tx, y + i * 48, C['--fondo'])));
  y += (bajada.length - 1) * 48;

  // El relleno de abajo cuenta desde el pie de la última letra, no desde su renglón.
  return { dibujo: s, alto: Math.ceil(y + 10 + 48) };
}

/**
 * **Las cuatro hojas miden lo mismo** (`US-06` c4a): el alto es el de la más larga, con piso y
 * tope. Cuatro hojas de cuatro alturas dejarían una "más completa".
 */
function altoDeLasHojas(cuadrantes) {
  const tx = T.M + T.relleno;
  const alto = Math.max(T.altoMinimo, ...cuadrantes.map((c) => hojaDeLaTarjeta(c, tx).alto));
  if (alto > T.altoMaximo) throw new Error(`la hoja más larga de la tarjeta mide ${alto} px (tope ${T.altoMaximo}): se achica el texto, no la hoja`);
  return alto;
}

async function tarjeta(c, hh) {
  const { ancho: W, alto: H } = LIENZO_TARJETA;
  const { M, hy } = T;
  const hx = M;
  const hw = W - 2 * M;
  const tx = hx + T.relleno;

  let s = `<rect width="${W}" height="${H}" fill="${C['--fondo']}"/>${grano(W, H, 11)}`;
  s += trazo(CALCO, RESULTADO.marca.toUpperCase(), 62, M, 126, C['--marca-rojo']);
  s += trazo(ROTULADA, entero(ROTULADA, PANTALLA_0.titulo.toUpperCase(), 30, W - 2 * M, 2), 30, M, 178, C['--texto-tenue'], 2);

  const { dibujo } = hojaDeLaTarjeta(c, tx);
  const capaHoja = `<g transform="rotate(-0.8 ${W / 2} ${hy + hh / 2})">${papel(hx, hy, hw, hh, 14)}<g transform="translate(0 ${hy})">${dibujo}</g></g>`;

  // El crédito es letra chica a propósito (`UX-36` §6.2): 26 px si entra en un renglón, y si
  // no baja de a uno hasta 22. Más chico ya no se lee ni en la tarjeta entera, y el taller falla.
  const cuerpoCredito = [26, 25, 24, 23, 22].find((k) => ancho(SANS, TARJETA.credito, k) <= W - 2 * M);
  if (!cuerpoCredito) throw new Error(`el crédito no entra en un renglón ni a 22 px: ${ancho(SANS, TARJETA.credito, 22).toFixed(0)} px de ${W - 2 * M}`);
  s += trazo(SANS, TARJETA.credito, cuerpoCredito, M, 1190, C['--texto-tenue']);
  s += trazo(SANS, SITIO, 26, M, 1224, C['--texto-tenue']);
  s += trazo(ROTULADA, entero(ROTULADA, TARJETA.pregunta.toUpperCase(), 44, W - 2 * M, 2), 44, M, 1278, C['--texto'], 2);

  const base = await sharp(svg(W, H, s)).png().toBuffer();
  const esquinero = await sharp(`${ARTE}/${PIEZAS.esquinero.archivo}`).resize(T.esquinero, 171).png().toBuffer();
  const elLibro = await libro(hw + 30, 1.6);
  if (T.libroAbajo - (hy + hh) < 60) throw new Error(`el libro asoma ${T.libroAbajo - (hy + hh)} px bajo la hoja (piso 60)`);
  return sharp(base)
    .composite([
      // Abajo de todo, el libro cerrado, con el borde de abajo fijo; arriba, la última hoja.
      { input: elLibro.imagen, left: M - 20, top: T.libroAbajo - elLibro.alto },
      { input: svg(W, H, capaHoja), left: 0, top: 0 },
      { input: esquinero, left: hx + hw - T.esquinero - 3, top: hy + 3 },
      { input: await cinta(150, 42, -4), left: hx + hw / 2 - 75, top: hy - 22 },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toBuffer();
}

// ------------------------------------------------------------------ la vista previa

/** Las medidas de `UX-36` §6.3: se ve a un tercio, y lo único que se lee es el nombre y la marca. */
const V = { hx: 48, hy: 100, hh: 440, relleno: 52, esquinero: 118, seguro: 36 };

/** El nombre de la vista previa: 76 px en dos renglones como mucho, o 66; si no, falla. */
function nombreDeLaVista(nombre, util) {
  for (const cuerpo of [76, 66]) {
    const renglones = partirParejo(ROTULADA, nombre, cuerpo, util);
    if (renglones.length <= 2) return { renglones, cuerpo, interlinea: Math.round(cuerpo * 1.1) };
  }
  throw new Error(`«${nombre}» ocupa más de dos renglones en la vista previa, aun a 66 px`);
}

/**
 * Los cuatro nombres de la portada, **en orden alfabético** (`UX-36` §6.4): el de los ids pone
 * las dos de luz arriba, que es la jerarquía que `D-57` punto 7 sacó.
 */
const ordenDeLaPortada = (cuadrantes) => [...cuadrantes].map((c) => c.nombre).sort((a, b) => a.localeCompare(b, 'es'));

async function vistaPrevia(c) {
  const { ancho: W, alto: H } = VISTA_PREVIA;
  const { hx, hy, hh } = V;
  const hw = W - 2 * hx;
  const tx = hx + V.relleno;
  const util = hw - 2 * V.relleno;
  const fondoHoja = hy + hh - V.seguro;

  // La marca va en la franja oscura de arriba y no sobre el papel: el rojo sobre el papel da
  // 3,0 : 1, y sobre `--fondo` es el par ya testeado (`UX-36` §6.3).
  let s = `<rect width="${W}" height="${H}" fill="${C['--fondo']}"/>${grano(W, H, 13)}`;
  s += trazo(CALCO, RESULTADO.marca.toUpperCase(), 48, tx, 70, C['--marca-rojo']);

  let hoja = papel(hx, hy, hw, hh, 12);
  let ultima;
  if (c) {
    hoja += trazo(ROTULADA, TARJETA.meSalio.toUpperCase(), 26, tx, hy + 62, C['--papel-tenue'], 4);
    const { renglones, cuerpo, interlinea } = nombreDeLaVista(c.nombre, util - V.esquinero - 20);
    renglones.forEach((r, i) => (hoja += trazo(ROTULADA, r, cuerpo, tx, hy + 150 + i * interlinea, C['--fondo'])));
    const fin = hy + 150 + (renglones.length - 1) * interlinea;
    const elSello = sello(selloDePolos(c.luzOscuridad, c.ordenCaos), tx, fin + 30, 26, C['--fondo']);
    hoja += elSello.svg;
    // La línea que nombra va **debajo** del sello: a su derecha, lo pisaba (`UX-36` §10, 17).
    ultima = fin + 30 + elSello.alto + 48;
    hoja += trazo(SANS_NEGRITA, entero(SANS_NEGRITA, lineaQueNombra(c.luzOscuridad, c.ordenCaos), 34, util), 34, tx, ultima, C['--fondo']);
  } else {
    const titulo = partir(ROTULADA, PANTALLA_0.titulo, 78, util - V.esquinero - 20);
    if (titulo.length > 2) throw new Error('el título de la portada ocupa más de dos renglones en la vista previa');
    titulo.forEach((r, i) => (hoja += trazo(ROTULADA, r, 78, tx, hy + 120 + i * 86, C['--fondo'])));
    const fin = hy + 120 + (titulo.length - 1) * 86;
    // Las cuatro maneras, todas del mismo cuerpo y en orden alfabético: ninguna primera.
    const nombres = ordenDeLaPortada(cuadrantesDelBanco());
    const columna = 520;
    nombres.forEach((n, i) => {
      const x = tx + (i % 2) * columna;
      ultima = fin + 72 + Math.floor(i / 2) * 48;
      hoja += trazo(SANS_NEGRITA, entero(SANS_NEGRITA, n, 30, columna - 24), 30, x, ultima, C['--fondo']);
    });
  }
  if (ultima > fondoHoja) throw new Error(`la vista previa ${c?.id ?? 'de la portada'} se sale de la zona segura (${ultima} > ${fondoHoja})`);
  const capaHoja = `<g transform="rotate(-0.6 ${W / 2} ${hy + hh / 2})">${hoja}</g>`;

  const base = await sharp(svg(W, H, s)).png().toBuffer();
  const elLibro = await libro(1160, 1.2);
  const esquinero = await sharp(`${ARTE}/${PIEZAS.esquinero.archivo}`).resize(V.esquinero, 135).png().toBuffer();
  return sharp(base)
    .composite([
      // El libro, detrás, con el borde de abajo en el borde del lienzo: asoma bajo la hoja.
      { input: elLibro.imagen, left: 20, top: H - elLibro.alto + 14 },
      { input: svg(W, H, capaHoja), left: 0, top: 0 },
      { input: esquinero, left: hx + hw - V.esquinero - 3, top: hy + 3 },
    ])
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toBuffer();
}

// ------------------------------------------------------------------ a disco

await piezas();
const salidas = Object.values(PIEZAS).map((p) => `${ARTE}/${p.archivo}`);
const cuadrantes = cuadrantesDelBanco();
const altoDeHoja = altoDeLasHojas(cuadrantes);
for (const c of cuadrantes) {
  const slug = c.id.toLowerCase();
  writeFileSync(`${TARJETAS}/${slug}.png`, await tarjeta(c, altoDeHoja));
  writeFileSync(`${TARJETAS}/og-${slug}.png`, await vistaPrevia(c));
  salidas.push(`${TARJETAS}/${slug}.png`, `${TARJETAS}/og-${slug}.png`);
}
writeFileSync(`${TARJETAS}/og-dos-ejes.png`, await vistaPrevia(null));
salidas.push(`${TARJETAS}/og-dos-ejes.png`);

writeFileSync(
  MANIFIESTO,
  `${JSON.stringify(
    {
      _comentario:
        'Lo escribe scripts/generar-dos-ejes.mjs. La huella es de lo que ENTRA (textos, colores, cajas, máster, fuentes, versión del dibujo); tarjetas.test.ts la recalcula y, si no coincide, pide volver a correr el taller.',
      version: VERSION_DEL_DIBUJO,
      huella: huellaDelTaller(),
      salidas,
      // Lo que midió el taller, para que el test lo vigile sin volver a dibujar.
      medidas: {
        altoDeLaHojaDeLaTarjeta: altoDeHoja,
        altoDeLaHojaDeLaVista: V.hh,
        ordenDeLaPortada: ordenDeLaPortada(cuadrantes),
      },
    },
    null,
    2,
  )}\n`,
);
console.log(`listo: ${salidas.length} archivos`);
for (const s of salidas) console.log(`  ${s}`);
