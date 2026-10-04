/**
 * El pincel de la lámina de "Ponelos en fila" (`US-08`).
 *
 * **La planta la decide `lib/ponelos/lamina.ts`; acá solo se pinta.** Mismo reparto que
 * `tarjeta.ts` y por el mismo motivo escrito allá: un canvas no existe en Node, así que
 * todo lo que viva de este lado es código que ningún test puede mirar. De allá viene dónde
 * va cada bloque y cuánto mide; de acá, pedir medidas y dibujar.
 *
 * ## De dónde salen los colores
 *
 * De `tokens.css`, leídos del documento en vivo con `getPropertyValue`, igual que
 * `tarjeta.ts`. **El único lugar del repo donde vive un hex es `tokens.css`**, y en una
 * imagen generada un color copiado a mano sería peor que en una hoja de estilo: nadie
 * puede inspeccionarlo.
 *
 * ## Lo que esta pieza lleva y la tarjeta no: el crédito
 *
 * Adentro de la imagen, no en el pie de la pantalla. Es la condición 1 de `D-21` aplicada
 * a la única pieza de este juego que sale del sitio: una lámina con las diez tapas de
 * Rocambole viaja por WhatsApp sin ningún pie donde apoyar la firma. `D-33` había dejado
 * ese caso escrito y abierto ("una tapa afuera del sitio viaja sin su crédito"); acá se
 * cierra imprimiéndolo.
 *
 * ## Y lo que NO lleva: número grande
 *
 * `tarjeta.ts` tiene un `hero` porque los dos juegos a los que sirve puntúan. Acá no hay
 * puntaje (`BR-22`), así que no hay número que agrandar. Lo que ocupa ese lugar es la
 * lista misma, que es lo que el jugador armó.
 */

import {
  planificarLamina,
  bandaDeLasFilas,
  renglonesQueEntran,
  cuerpoQueEntra,
  partirEnLineas,
  LIENZO,
  MARGEN,
  ANCHO_UTIL,
  FRANJA,
  INTERLINEA,
  CUERPOS_LAMINA,
  BANDAS,
  TAPA_LAMINA,
  tapasPorRenglon,
  ladoDeTapa,
  renglonesDeTapas,
  type DatosLamina,
} from '../lib/ponelos/lamina.ts';

const MARCA = 'FICHÍN RICOTERO';
const ROTULADA = '"Archivo Black", "Arial Black", sans-serif';
const CALCO = '"Oktubre Calco", "Archivo Black", "Arial Black", sans-serif';

/** El lado del mosaico de grano, y el del cuadradito. Los dos medidos en `tarjeta.ts`. */
const GRANO = 140;
const GRANO_CUADRO = 3;

/** El separador entre fichas de una misma banda. Un punto medio, como en un tracklist. */
const SEPARADOR = ' · ';

/** El valor de un token, tal como lo resolvió el navegador para esta página. */
function tinta(nombre: string, repuesto = '#ffffff'): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  return v || repuesto;
}

/** Espera las letras del sitio. Sin esto la lámina sale con la del sistema, sin avisar. */
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

/** El grano de serigrafía, como mosaico. La medición está en `tarjeta.ts`. */
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

function medir(ctx: CanvasRenderingContext2D, texto: string, cuerpo: number, familia: string): number {
  ctx.font = `400 ${cuerpo}px ${familia}`;
  return ctx.measureText(texto).width;
}

function escribir(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  cuerpo: number,
  familia: string,
  color: string,
): void {
  ctx.font = `400 ${cuerpo}px ${familia}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.fillText(texto, x, y);
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
  const cuerpo = cuerpoQueEntra(medir(ctx, texto, cuerpos.base, familia), anchoMax, cuerpos.base, cuerpos.piso);
  escribir(ctx, texto, x, y, cuerpo, familia, color);
  return cuerpo;
}

/** Cuántos renglones necesita una banda al cuerpo de referencia, con un techo sensato. */
function renglonesQuePide(ctx: CanvasRenderingContext2D, texto: string): number {
  const ancho = medir(ctx, texto, CUERPOS_LAMINA.ficha.base, ROTULADA);
  return Math.max(1, Math.min(10, Math.ceil(ancho / ANCHO_UTIL)));
}

/**
 * Baja una tapa, o `null` si no llegó.
 *
 * `null` y no una excepción: una tapa que no cargó no puede dejar a nadie sin lámina. Se
 * dibuja lo que llegó, que es el mismo criterio de reemplazo con el que `arte.ts` maneja
 * los recortes que todavía no existen.
 */
function bajarTapa(ruta: string): Promise<HTMLImageElement | null> {
  return new Promise((listo) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => listo(img);
    img.onerror = () => listo(null);
    img.src = ruta;
  });
}

/**
 * Dibuja la lámina y la devuelve como PNG.
 *
 * Devuelve `null` en vez de tirar cuando el navegador no da un canvas: quien la pide ya
 * sabe seguir sin ella. Una imagen que no se pudo dibujar no puede dejar a nadie sin poder
 * compartir — es la misma escalera de `D-14` que ya usa el botón de compartir del quiz.
 */
export async function dibujarLamina(datos: DatosLamina): Promise<Blob | null> {
  const lienzo = document.createElement('canvas');
  lienzo.width = LIENZO.ancho;
  lienzo.height = LIENZO.alto;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return null;
  if (datos.bandas.length !== BANDAS) return null;

  await esperarLetras();

  const colores = {
    fondo: tinta('--fondo'),
    texto: tinta('--texto'),
    tenue: tinta('--texto-tenue'),
    borde: tinta('--borde'),
    marca: tinta('--marca-rojo'),
    // El juego viste ¡Bang! ¡Bang!… Estás liquidado (mezcla `D-19`).
    juego: tinta('--disco-bang-bang-estas-liquidado-tinta', tinta('--texto')),
  };

  ctx.fillStyle = colores.fondo;
  ctx.fillRect(0, 0, LIENZO.ancho, LIENZO.alto);

  // Las tapas se bajan antes de planificar: una banda de tapas pide alto en función de
  // cuántas entran de ancho, y eso no se puede saber a mitad del dibujo.
  const tapas = await Promise.all(
    datos.bandas.map(async (b) =>
      b.imagenes && b.imagenes.length > 0
        ? (await Promise.all(b.imagenes.map(bajarTapa))).filter((x): x is HTMLImageElement => x !== null)
        : [],
    ),
  );

  // Las bandas se miden ANTES de planificar: el reparto de alto depende de cuánto trae
  // cada una, que es la diferencia entera con la tarjeta de los otros dos juegos.
  const textos = datos.bandas.map((b) => b.fichas.join(SEPARADOR));
  const bloques = new Map(
    planificarLamina(
      datos.bandas.map((_, i) =>
        tapas[i]!.length > 0
          ? renglonesDeTapas(tapas[i]!.length, ANCHO_UTIL, CUERPOS_LAMINA.ficha.base)
          : renglonesQuePide(ctx, textos[i]!),
      ),
    ).map((b) => [b.clave, b]),
  );
  const en = (clave: string) => bloques.get(clave)!;

  escribirAjustado(ctx, MARCA, MARGEN, en('marca').y, ANCHO_UTIL, CALCO, CUERPOS_LAMINA.marcaSitio, colores.marca);
  escribirAjustado(
    ctx, datos.juego.toUpperCase(), MARGEN, en('titulo').y,
    ANCHO_UTIL, ROTULADA, CUERPOS_LAMINA.tituloJuego, colores.juego,
  );
  escribirAjustado(
    ctx, datos.conjunto, MARGEN, en('conjunto').y,
    ANCHO_UTIL, ROTULADA, CUERPOS_LAMINA.conjunto, colores.texto,
  );

  datos.bandas.forEach((banda, i) => {
    const slot = en(`banda-${i}`);

    // El rótulo de la fila, en registro 3: seco, tenue, y nunca teñido. Ninguna de las
    // cuatro filas lleva color propio — es lo que impide que la de arriba se lea como un
    // premio (`BR-22`).
    escribirAjustado(
      ctx, banda.nombre, MARGEN, slot.y,
      ANCHO_UTIL, ROTULADA, CUERPOS_LAMINA.rotuloFila, colores.tenue,
    );

    const yFichas = slot.y + CUERPOS_LAMINA.rotuloFila.base * INTERLINEA + 6;

    if (tapas[i]!.length > 0) {
      /*
       * La banda de un conjunto que se mira: las tapas, recortadas como estampa.
       *
       * Cada una con su borde y apenas torcida, como el resto del sitio — una grilla de
       * cuadrados perfectos seria la plantilla que la regla anti-slop veta. La rotacion se
       * alterna para que la fila no se lea como una sola pieza inclinada.
       */
      const disponible = slot.alto - (yFichas - slot.y) - 8;
      const lado = ladoDeTapa(tapas[i]!.length, ANCHO_UTIL, disponible);
      const porRenglon = tapasPorRenglon(ANCHO_UTIL, lado);
      tapas[i]!.forEach((img, n) => {
        const col = n % porRenglon;
        const ren = Math.floor(n / porRenglon);
        const x = MARGEN + col * (lado + TAPA_LAMINA.aire);
        const y = yFichas + ren * (lado + TAPA_LAMINA.aire);
        ctx.save();
        ctx.translate(x + lado / 2, y + lado / 2);
        ctx.rotate(((n % 2 === 0 ? -1 : 1) * 1.2 * Math.PI) / 180);
        ctx.drawImage(img, -lado / 2, -lado / 2, lado, lado);
        ctx.strokeStyle = colores.borde;
        ctx.lineWidth = 3;
        ctx.strokeRect(-lado / 2, -lado / 2, lado, lado);
        ctx.restore();
      });
    } else {
      const caben = renglonesQueEntran(slot.alto, CUERPOS_LAMINA.ficha.base);
      let cuerpo: number = CUERPOS_LAMINA.ficha.base;
      const lineas = [
        ...partirEnLineas(textos[i]!, ANCHO_UTIL, (s) => medir(ctx, s, cuerpo, ROTULADA), caben),
      ];
      const masAncha = Math.max(...lineas.map((l) => medir(ctx, l, cuerpo, ROTULADA)));
      cuerpo = cuerpoQueEntra(masAncha, ANCHO_UTIL, cuerpo, CUERPOS_LAMINA.ficha.piso);
      lineas.forEach((linea, n) => {
        escribir(ctx, linea, MARGEN, yFichas + n * cuerpo * INTERLINEA, cuerpo, ROTULADA, colores.texto);
      });
    }

    // La raya que cierra la banda. Del color del borde y de ningún disco: acá la tinta
    // diría cuál fila vale más.
    ctx.fillStyle = colores.borde;
    ctx.fillRect(MARGEN, slot.y + slot.alto - 3, ANCHO_UTIL, 2);
  });

  // El pie: cuántas se repartieron, el crédito de `D-21`, y dónde se juega.
  const credito = en('credito');
  escribirAjustado(
    ctx, datos.repartidas, MARGEN, credito.y,
    ANCHO_UTIL, ROTULADA, CUERPOS_LAMINA.pie, colores.tenue,
  );
  escribirAjustado(
    ctx, datos.credito, MARGEN, credito.y + CUERPOS_LAMINA.pie.base * INTERLINEA + 2,
    ANCHO_UTIL, ROTULADA, CUERPOS_LAMINA.pie, colores.tenue,
  );
  escribirAjustado(
    ctx, datos.sitio, MARGEN, en('sitio').y,
    ANCHO_UTIL, ROTULADA, CUERPOS_LAMINA.pie, colores.tenue,
  );

  // La franja del pie: el mismo rojo de Oktubre de `tarjeta.ts` y de `public/tarjeta.png`.
  // Es lo que hace que las tres piezas se reconozcan del mismo lugar.
  ctx.fillStyle = colores.marca;
  ctx.fillRect(0, LIENZO.alto - FRANJA, LIENZO.ancho, FRANJA);

  granular(ctx);

  return new Promise<Blob | null>((listo) => {
    lienzo.toBlob((blob) => listo(blob), 'image/png');
  });
}

/** Lo que la banda de una fila vacía necesita para no salir en blanco. */
export { bandaDeLasFilas };
