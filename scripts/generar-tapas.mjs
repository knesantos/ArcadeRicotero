/**
 * Genera las tres formas en que una tapa real puede llegar al sitio (`D-21`, `UX-04`):
 *
 *   ficha    `public/tapas/<slug>.jpg`            320 px  — la tapa entera, en baja
 *   detalle  `public/tapas/detalle/<nombre>.jpg`  480 px  — un pedazo, como recorte pegado
 *   fondo    `public/tapas/fondo/<nombre>.jpg`    640 px  — detras del contenido, con velo
 *
 * Los masters viven fuera de `public/` a proposito (`Docs/INVESTIGACION/TapasDiscos/`):
 * al sitio solo llega la version chica. Se corre desde la raiz:
 *
 *   node scripts/generar-tapas.mjs
 *
 * QUE RECORTA Y POR QUE: el catalogo es `Docs/UX/UX-05-tapas-en-pantalla.md`, que dice
 * que detalle de que tapa viste cada pantalla y en que fraccion de la imagen cae. Aca
 * solo se traducen esas fracciones a pixeles. Si cambia el catalogo, cambia esta tabla —
 * no al reves.
 *
 * NUNCA AGRANDA. Los masters topean en 953x953 (los frontales) y 1181x929 (las traseras),
 * asi que un recorte chico no llega a 480 px sin quedar hecho papilla. El script usa
 * `withoutEnlargement` y avisa por consola cual quedo por debajo del objetivo: es un dato
 * para `experiencia`, no un error que tape el script.
 *
 * EL TOPE DE PESO DEL FONDO es de `UX-04`: 60 KB por imagen. Se busca la calidad mas alta
 * que entre en ese tope en vez de fijar una calidad y esperar que de.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const origen = 'Docs/INVESTIGACION/TapasDiscos';
const destino = 'public/tapas';

const ANCHO = { ficha: 320, detalle: 480, fondo: 640 };
const TOPE_KB_FONDO = 60;

/**
 * Ficha: slug del articulo de la Redondopedia -> master.
 *
 * OJO CON `la-mosca-y-la-sopa`, que tiene historia y conviene leerla entera antes de
 * volver a moverla.
 *
 * Hasta el 2026-08-24 este mapa apuntaba a la `-trasera`, y no por error: `RES-44` habia
 * dictaminado que el `-frontal` del repo era un **rediseno** y no arte de Rocambole (foto
 * de recital con el titulo estampado, sin el gato momificado ni los cerdos y peces que
 * documentan `RES-06`/`RES-22`), asi que `contenido` lo dejo afuera del banco de `US-04`
 * y la ficha del disco mostraba la contratapa.
 *
 * **El usuario lo corrigio el 2026-08-24**: trajo la tapa real y pidio que se use. Es la
 * misma obra que el `-frontal` que ya estaba —campo rojo, foto de recital, bloque amarillo
 * torcido con la mosca—, en otra edicion y a mas resolucion (1079 px contra 953).
 *
 * **Lo que eso deja abierto, y no lo resuelve este script:** `RES-44` sigue diciendo que
 * esta tapa es un rediseno. Su evidencia para esa fila es la mas floja de las 35 de la
 * tabla —un snippet, con el fetch devolviendo 403— asi que puede estar equivocada. Hasta
 * que alguien la vuelva a mirar, **el pie de esta imagen no se le acredita a Rocambole**.
 * Pedido en `Docs/SUGERENCIAS/HILO-para-investigador-tapa-de-la-mosca.md`.
 */
const FICHAS = {
  gulp: 'gulp-frontal.jpg',
  oktubre: 'oktubre-frontal.jpg',
  'un-baion-para-el-ojo-idiota': 'un-baion-para-el-ojo-idiota-frontal.jpg',
  'bang-bang-estas-liquidado': 'bang-bang-estas-liquidado-frontal.jpg',
  'la-mosca-y-la-sopa': 'la-mosca-y-la-sopa-frontal-real.jpg',
  'lobo-suelto': 'lobo-suelto-cordero-atado-cd1-frontal.jpg',
  'cordero-atado': 'lobo-suelto-cordero-atado-cd2-frontal.jpg',
  luzbelito: 'luzbelito-frontal.jpg',
  'ultimo-bondi-a-finisterre': 'ultimo-bondi-a-finisterre-frontal.jpg',
  'momo-sampler': 'momo-sampler-frontal.jpg',
};

/**
 * Derivados. `caja` son fracciones [x0, y0, x1, y1] del master, tal como las escribe
 * `UX-05` en su columna "donde cae".
 *
 * Los tres recortes de la seccion `letras` salen de `la-mosca-y-la-sopa-trasera.jpg` y no
 * del frontal que nombra `UX-05`, por el mismo motivo de arriba: el frontal disponible es
 * un rediseno. La olla con el cucharon —el objeto que le da nombre al disco— es el motivo
 * que el propio catalogo ya habia elegido para la pantalla de completar la letra.
 */
// Nota de recorte para mosca-olla: la olla vive justo debajo de la lista de temas, asi
// que el cucharon entero y el texto no entran los dos. Gana no tener texto: a 34 px en
// el casete un cucharon cortado no se ve, una linea de tracklist si.
// El 2026-10-01 salieron cinco derivados que ninguna pantalla mostraba (`D-51`):
// `oktubre-bandera`, `bondi-circuito` y `momo-medallon` (detalles de categorías que ningún
// artículo usa: `marca`, `discos` y `momo`), `gulp-montana` y el fondo `oktubre-ok`. Se
// publicaban igual. Si alguna pantalla los vuelve a pedir, se recuperan del historial.
const DERIVADOS = [
  // --- detalles (recorte pegado) ---
  { nombre: 'lobo-tiras', forma: 'detalle', master: 'lobo-suelto-cordero-atado-cd1-frontal.jpg', caja: [0.05, 0.52, 0.55, 0.8] },
  { nombre: 'mosca-olla', forma: 'detalle', master: 'la-mosca-y-la-sopa-trasera.jpg', caja: [0.6, 0.43, 0.9, 0.84] },
  { nombre: 'gulp-pincelada', forma: 'detalle', master: 'gulp-frontal.jpg', caja: [0.62, 0.62, 1.0, 1.0] },
  // El sello manuscrito "Gulp." — el lettering que `D-19` pide para resultado y compartir.
  { nombre: 'gulp-logo', forma: 'detalle', master: 'gulp-trasera.jpg', caja: [0.54, 0.27, 0.72, 0.39] },

  // --- fondos (detras del contenido, siempre con velo) ---
  // El fondo `oktubre-banderas` del portal salió el 2026-10-04 (`D-62`): el portal pasó a
  // fondo negro liso con la gente de *Oktubre* al pie, que es un recorte del collage y lo
  // produce `generar-multitud.mjs`.
  { nombre: 'gulp-pincelada', forma: 'fondo', master: 'gulp-frontal.jpg', caja: [0.55, 0.55, 1.0, 1.0] },
  { nombre: 'lobo-tiras', forma: 'fondo', master: 'lobo-suelto-cordero-atado-cd1-frontal.jpg', caja: [0.0, 0.45, 0.62, 0.85] },
  { nombre: 'mosca-olla', forma: 'fondo', master: 'la-mosca-y-la-sopa-trasera.jpg', caja: [0.58, 0.42, 0.92, 0.9] },
  { nombre: 'bondi-engranajes', forma: 'fondo', master: 'ultimo-bondi-a-finisterre-trasera.jpg', caja: [0.55, 0.05, 1.0, 0.5] },
];

/**
 * ZOOMS — la imagen que **juega** en `US-04`. Pedido del usuario el 2026-08-28:
 *
 *   "el adivinar las tapas debe funcionar como los juegos splash: no mostrar la tapa
 *    entera sino un zoom alto como para que sea dificil"
 *
 * Cambia el juego de reconocer una tapa a reconocer un pedazo. **Ninguna tapa se muestra
 * entera**, asi que de paso muere entero el defecto que motivo el cambio anterior: si el
 * titulo impreso no entra en el recorte, no hay nada que leer.
 *
 * `zoom` es el lado del recorte como fraccion del lado corto del master, y sale de la
 * dificultad del item en `tapa.json` — es lo que hace que `BR-01` escalone de verdad:
 *
 *   facil   0.40  ~381 px del master: se ve un motivo entero
 *   media   0.26  ~248 px: se ve una parte de un motivo
 *   dificil 0.22  ~210 px: se ve un rasgo suelto, y hay que saber
 *
 * `centro` es donde cae ese cuadrado, en fracciones del master. Elegidos mirando los diez
 * masters de a uno: cada uno cae sobre el motivo que un ricotero reconoce, nunca sobre el
 * titulo. La eleccion es discutible y por eso esta en una tabla y no adentro del codigo.
 *
 * ESTA FORMA SI AGRANDA, y es la unica. El resto del script no agranda nunca (`UX-04`),
 * porque ahi la nitidez es todo. Aca no: negarse a agrandar seria topear en silencio cuan
 * fuerte puede ser el zoom, que es justo lo que se pidio. Un dificil sale de 210 px a 480
 * y se ve blando — en un juego de zoom eso no es un defecto, es el genero.
 *
 * DEUDA CON `UX-05`: el catalogo de `experiencia` no tiene esta forma. Propuesta en
 * `Docs/SUGERENCIAS/HILO-para-experiencia-tapas-sin-titulo.md`.
 */
const ZOOM = { facil: 0.4, media: 0.26, dificil: 0.22 };

const JUEGO = [
  // slug del item -> de que master sale el zoom y donde cae el centro
  { slug: 'gulp', master: 'gulp-frontal.jpg', centro: [0.42, 0.33], nivel: 'facil' },
  // El titulo rojo esta arriba; el centro va a la multitud de caras grises, que es el
  // motivo de la tapa y no dice ni una letra.
  { slug: 'oktubre', master: 'oktubre-frontal.jpg', centro: [0.5, 0.83], nivel: 'facil' },
  { slug: 'luzbelito', master: 'luzbelito-frontal.jpg', centro: [0.5, 0.52], nivel: 'facil' },
  { slug: 'un-baion-para-el-ojo-idiota', master: 'un-baion-para-el-ojo-idiota-frontal.jpg', centro: [0.72, 0.35], nivel: 'media' },
  { slug: 'bang-bang-estas-liquidado', master: 'bang-bang-estas-liquidado-frontal.jpg', centro: [0.8, 0.33], nivel: 'media' },
  { slug: 'ultimo-bondi-a-finisterre', master: 'ultimo-bondi-a-finisterre-frontal.jpg', centro: [0.5, 0.5], nivel: 'media' },
  { slug: 'lobo-suelto', master: 'lobo-suelto-cordero-atado-cd1-frontal.jpg', centro: [0.53, 0.47], nivel: 'dificil' },
  { slug: 'cordero-atado', master: 'lobo-suelto-cordero-atado-cd2-frontal.jpg', centro: [0.68, 0.28], nivel: 'dificil' },
  { slug: 'momo-sampler', master: 'momo-sampler-frontal.jpg', centro: [0.57, 0.48], nivel: 'dificil' },
  // Sale de la trasera y no del frontal, por el mismo lio de siempre con esta tapa. OJO:
  // esa cara tiene el titulo dos veces en el lomo y la lista de temas arriba. El centro cae
  // sobre la olla con el cucharon —el motivo que UX-05 ya habia elegido— y ahi no hay texto.
  { slug: 'la-mosca-y-la-sopa', master: 'la-mosca-y-la-sopa-trasera.jpg', centro: [0.79, 0.5], nivel: 'dificil' },
];

const kb = (ruta) => fs.statSync(ruta).size / 1024;

/** Recorta por fracciones y devuelve el pipeline listo para redimensionar. */
async function recortar(desde, caja) {
  const meta = await sharp(desde).metadata();
  const [x0, y0, x1, y1] = caja;
  const left = Math.round(x0 * meta.width);
  const top = Math.round(y0 * meta.height);
  const width = Math.max(1, Math.round((x1 - x0) * meta.width));
  const height = Math.max(1, Math.round((y1 - y0) * meta.height));
  return { pipeline: sharp(desde).extract({ left, top, width, height }), width, height };
}

/** Escribe con la calidad mas alta que entre en el tope. Devuelve la calidad usada. */
async function escribirBajoTope(pipeline, hasta, topeKb) {
  for (const calidad of [82, 74, 66, 58, 50, 42]) {
    await pipeline.clone().jpeg({ quality: calidad }).toFile(hasta);
    if (kb(hasta) <= topeKb) return calidad;
  }
  return null;
}

const avisos = [];

// --- fichas -----------------------------------------------------------------
fs.mkdirSync(destino, { recursive: true });
console.log('FICHAS (320 px)');
for (const [slug, archivo] of Object.entries(FICHAS)) {
  const desde = path.join(origen, archivo);
  if (!fs.existsSync(desde)) {
    avisos.push(`falta el master ${archivo} (ficha ${slug})`);
    console.log('  FALTA', archivo);
    continue;
  }
  const hasta = path.join(destino, `${slug}.jpg`);
  await sharp(desde).resize({ width: ANCHO.ficha, withoutEnlargement: true }).jpeg({ quality: 72 }).toFile(hasta);
  console.log('  OK', `${slug}.jpg`.padEnd(34), `${Math.round(kb(hasta))} KB`);
}

// --- derivados --------------------------------------------------------------
for (const forma of ['detalle', 'fondo']) {
  const carpeta = path.join(destino, forma);
  fs.mkdirSync(carpeta, { recursive: true });
  console.log(`\n${forma.toUpperCase()}S (${ANCHO[forma]} px${forma === 'fondo' ? `, tope ${TOPE_KB_FONDO} KB` : ''})`);

  for (const d of DERIVADOS.filter((x) => x.forma === forma)) {
    const desde = path.join(origen, d.master);
    if (!fs.existsSync(desde)) {
      avisos.push(`falta el master ${d.master} (${forma} ${d.nombre})`);
      console.log('  FALTA', d.master);
      continue;
    }
    const hasta = path.join(carpeta, `${d.nombre}.jpg`);
    const { pipeline, width, height } = await recortar(desde, d.caja);
    const objetivo = ANCHO[forma];
    const ladoLargo = Math.max(width, height);
    const redimensionado = pipeline.resize(
      width >= height
        ? { width: objetivo, withoutEnlargement: true }
        : { height: objetivo, withoutEnlargement: true },
    );

    let calidad;
    if (forma === 'fondo') {
      calidad = await escribirBajoTope(redimensionado, hasta, TOPE_KB_FONDO);
      if (calidad === null) avisos.push(`${forma}/${d.nombre}.jpg no entra en ${TOPE_KB_FONDO} KB ni al 42 de calidad`);
    } else {
      await redimensionado.jpeg({ quality: 80 }).toFile(hasta);
      calidad = 80;
    }

    const salida = await sharp(hasta).metadata();
    const corto = ladoLargo < objetivo;
    if (corto) {
      avisos.push(
        `${forma}/${d.nombre}.jpg quedo en ${salida.width}x${salida.height}: el recorte del master da ${width}x${height}, ` +
          `por debajo de los ${objetivo} px que pide UX-04. No se agranda a proposito.`,
      );
    }
    console.log(
      '  OK',
      `${d.nombre}.jpg`.padEnd(24),
      `${salida.width}x${salida.height}`.padEnd(11),
      `q${calidad}`.padEnd(5),
      `${Math.round(kb(hasta))} KB`.padStart(7),
      corto ? '  <- por debajo del objetivo' : '',
    );
  }
}

// --- zooms del juego --------------------------------------------------------
// Van a `public/tapas/detalle/` porque es la carpeta que `rutaImagen` ya sabe servir para
// `encuadre: "detalle"`. El sufijo `-zoom` los separa de los recortes decorativos, que
// viven en la misma carpeta y los usa el sistema visual, no el juego.
{
  const carpeta = path.join(destino, 'detalle');
  fs.mkdirSync(carpeta, { recursive: true });
  console.log(`\nZOOMS DEL JUEGO (${ANCHO.detalle} px, esta forma si agranda)`);

  for (const z of JUEGO) {
    const desde = path.join(origen, z.master);
    if (!fs.existsSync(desde)) {
      avisos.push(`falta el master ${z.master} (zoom ${z.slug})`);
      console.log('  FALTA', z.master);
      continue;
    }
    const meta = await sharp(desde).metadata();
    // El recorte es cuadrado en pixeles, no en fracciones: hay masters de traseras que no
    // son cuadrados y una fraccion pareja les saldria rectangular.
    const lado = Math.round(ZOOM[z.nivel] * Math.min(meta.width, meta.height));
    const [cx, cy] = z.centro;
    const left = Math.min(Math.max(0, Math.round(cx * meta.width - lado / 2)), meta.width - lado);
    const top = Math.min(Math.max(0, Math.round(cy * meta.height - lado / 2)), meta.height - lado);

    const hasta = path.join(carpeta, `${z.slug}-zoom.jpg`);
    await sharp(desde)
      .extract({ left, top, width: lado, height: lado })
      .resize({ width: ANCHO.detalle })
      .jpeg({ quality: 82 })
      .toFile(hasta);

    console.log(
      '  OK',
      `${z.slug}-zoom.jpg`.padEnd(30),
      `${z.nivel}`.padEnd(8),
      `${lado}px del master`.padEnd(18),
      `${Math.round(kb(hasta))} KB`.padStart(7),
    );
  }
}

if (avisos.length) {
  console.log('\nAVISOS (no son errores: son datos para experiencia)');
  for (const a of avisos) console.log('  -', a);
} else {
  console.log('\nSin avisos.');
}
