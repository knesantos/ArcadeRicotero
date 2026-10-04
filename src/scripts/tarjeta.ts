/**
 * El pincel de la tarjeta compartible. **La comparten los dos juegos de sacar temas**:
 * "Adiviná el tema" (`US-02`) y "Sacalo por la letra" (`US-07`).
 *
 * **La planta la decide `lib/tarjeta/plan.ts`; acá solo se pinta.** Todo lo que se puede
 * probar sin un navegador vive allá y tiene test: dónde va cada bloque, cuánto mide cada
 * fila, en cuántos renglones se parte un título largo. De este lado queda lo que ningún
 * test de Node puede mirar —un canvas no existe en Node— y por eso este archivo es lo más
 * flaco posible: pide medidas, pide colores, y dibuja.
 *
 * ## De dónde salen los colores, y por qué no hay ni un hex acá
 *
 * De `tokens.css`, leídos del documento en vivo con `getPropertyValue`. Es la misma regla
 * que ya obedecen `juego.css` y `sitio.css` y que audita `estilos.test.ts`: **el único
 * lugar del repo donde vive un hex es `tokens.css`**. Un color copiado a mano acá sería
 * exactamente la verdad duplicada que la regla de marca existe para evitar — y peor que
 * en una hoja de estilo, porque una imagen generada no se puede inspeccionar.
 *
 * Es el mismo criterio con el que `scripts/generar-marca-social.mjs` lee los tokens para
 * armar `public/tarjeta.png`. Aquella corre en build y lee el archivo; ésta corre en el
 * navegador y lee la hoja aplicada. La fuente de verdad es la misma.
 *
 * ## Las letras
 *
 * Se esperan explícitamente antes de dibujar. Un canvas no espera a nada: si la letra
 * todavía no llegó, escribe con la de repuesto **sin avisar** y la tarjeta sale con la
 * tipografía del sistema, que es justo lo que la regla anti-slop veta. Con `document.fonts`
 * se puede pedir y esperar; si falla, se dibuja igual con lo que haya, porque una tarjeta
 * fea es mejor que ninguna.
 *
 * `FICHÍN RICOTERO` va en Oktubre Calco: esa letra es un calco de la tapa (`RES-43`) y de
 * fábrica solo tenía **A B C D E I K O R T U**. La F, la H, la N y la Í se derivaron de
 * esas mismas letras cuando el sitio cambió de nombre (`D-60`,
 * `scripts/derivar-oktubre-calco.py`), y `fuentes.test.ts` falla si la marca pide una letra
 * que la fuente no tiene. Cualquier otra palabra de la tarjeta iría rota, así que el resto
 * va en Archivo Black, que es la única completa.
 */

import {
  planificar,
  cuerpoQueEntra,
  partirEnLineas,
  LIENZO,
  MARGEN,
  ANCHO_UTIL,
  FRANJA,
  CUERPOS,
  INTERLINEA,
  type DatosTarjeta,
} from '../lib/tarjeta/plan.ts';

/**
 * Qué de la tarjeta es del sitio y qué es del juego.
 *
 * Del **sitio**: la firma de arriba, el rótulo del pie, la franja roja, el grano, el
 * fondo, los colores de acierto y error. Esas no se parametrizan — si cambiaran por
 * juego, las dos tarjetas dejarían de reconocerse como del mismo lugar.
 *
 * Del **juego**: el nombre, el color con que se escribe, y el número grande con su
 * rótulo. Entran por `DatosTarjeta` y este archivo no sabe cuál es cuál.
 */
const MARCA = 'FICHÍN RICOTERO';

/** El valor de un token, tal como lo resolvió el navegador para esta página. */
function tinta(nombre: string, repuesto = '#ffffff'): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  return v || repuesto;
}

const ROTULADA = '"Archivo Black", "Arial Black", sans-serif';
const CALCO = '"Oktubre Calco", "Archivo Black", "Arial Black", sans-serif';

/** El lado del mosaico de grano. El mismo que el del token `--textura-grano`. */
const GRANO = 140;

/**
 * El grano se dibuja en cuadraditos de 3 px, no píxel por píxel. Se decidió midiendo.
 *
 * **Peso.** La tarjeta terminada pesaba **857 KB**, y el grano era casi todo: el ruido al
 * azar es incompresible, así que PNG no podía hacer nada con él. Medido sobre el mismo
 * fondo, cambiando solo el tamaño del cuadradito: 1 px → 520 KB, 2 px → 246 KB,
 * **3 px → 173 KB**, 4 px → 117 KB. Con cuadraditos hay tiradas de píxeles iguales y el
 * PNG vuelve a servir para algo.
 *
 * **Y además se ve mejor**, que es lo que terminó de decidirlo. La tarjeta mide 1080 px
 * de ancho y se mira en un teléfono de unos 390: se achica casi tres veces. Un grano de
 * un píxel a esa escala **desaparece** — el promedio de tres píxeles al azar es gris
 * parejo. Uno de tres píxeles queda en poco más de uno y se sigue viendo, que es todo el
 * punto de que haya grano.
 *
 * Cuatro pesaba menos todavía, pero a esa altura el grano se empieza a ver como cuadros.
 */
const GRANO_CUADRO = 3;

/**
 * Espera las letras del sitio.
 *
 * Se piden a un cuerpo cualquiera porque `document.fonts.load` resuelve la familia
 * entera; el cuerpo del pedido no cambia lo que se descarga.
 */
async function esperarLetras(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load(`400 100px ${ROTULADA.split(',')[0]}`),
      document.fonts.load(`400 100px ${CALCO.split(',')[0]}`),
    ]);
  } catch {
    // Sin `document.fonts`, o con una letra que no llegó: se dibuja con lo que haya.
  }
}

/**
 * El grano de serigrafía, que es lo que hace que la tarjeta se reconozca del sitio.
 *
 * Se dibuja como mosaico y no píxel por píxel sobre el lienzo entero: son 1.458.000
 * píxeles contra 19.600, y el resultado es el mismo porque el ruido no tiene forma.
 * `UX-04` lo pide por nombre ("grano, imperfección de borde, nunca vector limpio") y
 * `RES-06` lo ficha como técnica real de Rocambole.
 */
function granular(ctx: CanvasRenderingContext2D): void {
  const mosaico = document.createElement('canvas');
  mosaico.width = GRANO;
  mosaico.height = GRANO;
  const mctx = mosaico.getContext('2d');
  if (!mctx) return;

  const imagen = mctx.createImageData(GRANO, GRANO);
  const d = imagen.data;
  for (let y = 0; y < GRANO; y += GRANO_CUADRO) {
    for (let x = 0; x < GRANO; x += GRANO_CUADRO) {
      const alfa = Math.random() * 255;
      for (let dy = 0; dy < GRANO_CUADRO && y + dy < GRANO; dy++) {
        for (let dx = 0; dx < GRANO_CUADRO && x + dx < GRANO; dx++) {
          const i = ((y + dy) * GRANO + (x + dx)) * 4;
          d[i] = 255;
          d[i + 1] = 255;
          d[i + 2] = 255;
          d[i + 3] = alfa;
        }
      }
    }
  }
  mctx.putImageData(imagen, 0, 0);

  const patron = ctx.createPattern(mosaico, 'repeat');
  if (!patron) return;
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = patron;
  ctx.fillRect(0, 0, LIENZO.ancho, LIENZO.alto);
  ctx.restore();
}

interface Renglon {
  readonly texto: string;
  readonly cuerpo: number;
  readonly familia: string;
  readonly color: string;
  readonly x: number;
  readonly y: number;
}

function escribir(ctx: CanvasRenderingContext2D, r: Renglon): void {
  ctx.font = `400 ${r.cuerpo}px ${r.familia}`;
  ctx.fillStyle = r.color;
  ctx.textBaseline = 'top';
  ctx.fillText(r.texto, r.x, r.y);
}

/** Cuánto mide un texto a un cuerpo dado, con la letra puesta. */
function medir(ctx: CanvasRenderingContext2D, texto: string, cuerpo: number, familia: string): number {
  ctx.font = `400 ${cuerpo}px ${familia}`;
  return ctx.measureText(texto).width;
}

/** Escribe una línea encogiéndola lo justo para que entre. Devuelve el cuerpo usado. */
function escribirAjustado(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  anchoMax: number,
  familia: string,
  cuerpos: { readonly base: number; readonly piso: number },
  color: string,
): number {
  const cuerpo = cuerpoQueEntra(
    medir(ctx, texto, cuerpos.base, familia),
    anchoMax,
    cuerpos.base,
    cuerpos.piso,
  );
  escribir(ctx, { texto, cuerpo, familia, color, x, y });
  return cuerpo;
}

/**
 * Dibuja la tarjeta y la devuelve como PNG.
 *
 * Devuelve `null` en vez de tirar cuando el navegador no da un canvas: quien la pide ya
 * sabe seguir sin ella (`compartirResultado` comparte igual, sin imagen). Una tarjeta que
 * no se pudo dibujar no puede dejar a nadie sin poder compartir.
 */
export async function dibujarTarjeta(datos: DatosTarjeta): Promise<Blob | null> {
  const lienzo = document.createElement('canvas');
  lienzo.width = LIENZO.ancho;
  lienzo.height = LIENZO.alto;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return null;

  await esperarLetras();

  const colores = {
    fondo: tinta('--fondo'),
    texto: tinta('--texto'),
    tenue: tinta('--texto-tenue'),
    borde: tinta('--borde'),
    marca: tinta('--marca-rojo'),
    juego: tinta(datos.tinteJuego, tinta('--texto')),
    // El resultado viste Gulp! (`D-19`), igual que el boton de compartir de la pantalla.
    resultado: tinta('--cat-historia'),
    ok: tinta('--acento-3'),
    no: tinta('--acento-4'),
  };

  ctx.fillStyle = colores.fondo;
  ctx.fillRect(0, 0, LIENZO.ancho, LIENZO.alto);

  const bloques = new Map(planificar(datos.filas.length).map((b) => [b.clave, b]));
  const en = (clave: string) => bloques.get(clave)!;

  // ---- el encabezado
  escribirAjustado(
    ctx, MARCA, MARGEN, en('marca').y, ANCHO_UTIL,
    CALCO, CUERPOS.marcaSitio, colores.marca,
  );
  escribirAjustado(
    ctx, datos.juego.toUpperCase(), MARGEN, en('titulo').y,
    ANCHO_UTIL, ROTULADA, CUERPOS.tituloJuego, colores.juego,
  );
  escribirAjustado(
    ctx, datos.tramo, MARGEN, en('tramo').y, ANCHO_UTIL,
    ROTULADA, CUERPOS.tramo, colores.texto,
  );

  // ---- el setlist
  const SANGRIA = 62; // lo que ocupa la marca de acierto o de error, mas su aire
  const anchoTitulo = ANCHO_UTIL - SANGRIA;

  datos.filas.forEach((fila, i) => {
    const slot = en(`fila-${i}`);
    const y = slot.y + 8;

    // La marca. Simbolo ademas de color, como en toda la pantalla: en una imagen que se
    // mira chiquita, el color solo no alcanza (`UX-01`).
    escribir(ctx, {
      texto: fila.acerto ? '✔' : '✕',
      cuerpo: 40,
      familia: ROTULADA,
      color: fila.acerto ? colores.ok : colores.no,
      x: MARGEN,
      y,
    });

    // El titulo: un renglon si entra, dos si no, encogido si tampoco.
    let lineas = [fila.titulo];
    let cuerpo: number = CUERPOS.tituloFila.base;
    if (medir(ctx, fila.titulo, cuerpo, ROTULADA) > anchoTitulo) {
      lineas = [...partirEnLineas(fila.titulo, anchoTitulo, (s) => medir(ctx, s, cuerpo, ROTULADA))];
      const masAncha = Math.max(...lineas.map((l) => medir(ctx, l, cuerpo, ROTULADA)));
      cuerpo = cuerpoQueEntra(masAncha, anchoTitulo, cuerpo, CUERPOS.tituloFila.piso);
    }
    lineas.forEach((linea, n) => {
      escribir(ctx, {
        texto: linea,
        cuerpo,
        familia: ROTULADA,
        color: colores.texto,
        x: MARGEN + SANGRIA,
        y: y + n * cuerpo * INTERLINEA,
      });
    });

    // El renglon chico: disco, cuanto audio hizo falta y cuanto tardo.
    escribirAjustado(
      ctx, fila.pie, MARGEN + SANGRIA, y + lineas.length * cuerpo * INTERLINEA + 8,
      anchoTitulo, ROTULADA, CUERPOS.pieFila, colores.tenue,
    );

    /*
     * La raya del renglon, tenida con la tinta real de la tapa de ESE disco.
     *
     * Es el mismo gesto que hace la revelacion en pantalla (`paleta.ts`), traido a la
     * imagen: el setlist no es una lista de textos, es una lista de discos. Un disco que
     * no este en los diez se raya con el borde de siempre, nunca con un color inventado.
     */
    ctx.fillStyle = tinta(`--disco-${fila.disco}-tinta`, colores.borde);
    ctx.fillRect(MARGEN, slot.y + slot.alto - 3, ANCHO_UTIL, 3);
  });

  // ---- el pie: el tiempo primero, el puntaje despues
  escribirAjustado(
    ctx, datos.rotuloHero.toUpperCase(), MARGEN, en('rotuloHero').y, ANCHO_UTIL,
    ROTULADA, CUERPOS.pieFila, colores.tenue,
  );
  escribirAjustado(
    ctx, datos.hero, MARGEN, en('hero').y, ANCHO_UTIL,
    ROTULADA, CUERPOS.hero, colores.resultado,
  );
  escribirAjustado(
    ctx, datos.puntaje, MARGEN, en('puntaje').y, ANCHO_UTIL,
    ROTULADA, CUERPOS.pieFila, colores.tenue,
  );
  escribirAjustado(
    ctx, datos.sitio, MARGEN, en('sitio').y, ANCHO_UTIL,
    ROTULADA, CUERPOS.pieFila, colores.tenue,
  );

  // La franja del pie: ancla la composicion y trae el rojo de Oktubre, igual que en
  // `public/tarjeta.png`. Es lo que hace que las dos piezas se reconozcan del mismo lugar.
  ctx.fillStyle = colores.marca;
  ctx.fillRect(0, LIENZO.alto - FRANJA, LIENZO.ancho, FRANJA);

  granular(ctx);

  return new Promise<Blob | null>((listo) => {
    lienzo.toBlob((blob) => listo(blob), 'image/png');
  });
}
