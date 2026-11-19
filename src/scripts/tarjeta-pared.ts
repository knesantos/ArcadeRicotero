/**
 * La tarjeta compartible de "Completá la letra" (`US-03`), en el idioma de su pared (ronda de
 * pulida, 2026-11-18).
 *
 * Es **el muro de la vuelta**: ladrillo a la vista, un paño arriba con la firma del sitio, el
 * nombre del juego y la línea que canta; el paño del medio con las ocho palabras pintadas —la
 * que sacaste, con su tilde; la que no, lo que pusiste tachado y debajo la que era—; y abajo
 * la cuenta, en un sello, con la dirección para jugar.
 *
 * Mismas reglas que `tarjeta.ts`, de donde salen el grano, la espera de las letras y la
 * lectura de tokens: **ni un hex acá** (todo se lee de `tokens.css` en vivo), ninguna sombra,
 * ningún degradado. La tilde y la cruz se dibujan con trazos: como glifo, en un teléfono salen
 * con la letra de emoji. Nunca tira: si el canvas no está, devuelve `null`.
 *
 * No muestra más letra que el resultado en pantalla: la palabra de cada hueco y nada más.
 */

import { LIENZO } from '../lib/tarjeta/plan.ts';
import { tinta, esperarLetras, granular } from './tarjeta.ts';

const ROTULADA = '"Archivo Black", "Arial Black", sans-serif';
const CALCO = '"Oktubre Calco", "Archivo Black", "Arial Black", sans-serif';
const MARCA = 'FICHÍN RICOTERO';

/** Una palabra de la vuelta: la que era y, si no salió, la que se puso. */
export interface PalabraDelMuro {
  readonly era: string;
  readonly acerto: boolean;
  readonly puso: string;
}

export interface DatosDelMuro {
  readonly juego: string;
  /** La línea que canta: uno de los tres tramos. */
  readonly tramo: string;
  /** La cuenta, ya escrita ("6 de 8"). */
  readonly cuenta: string;
  readonly palabras: readonly PalabraDelMuro[];
  /** Dónde se juega. Es la única forma de volver que tiene una imagen suelta. */
  readonly sitio: string;
}

/** Azar con semilla: el canto del revoque sale igual cada vez. */
function azar(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function dibujarMuro(datos: DatosDelMuro): Promise<Blob | null> {
  const lienzo = document.createElement('canvas');
  lienzo.width = LIENZO.ancho;
  lienzo.height = LIENZO.alto;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return null;
  await esperarLetras();

  const W = LIENZO.ancho;
  const H = LIENZO.alto;
  const c = {
    fondo: tinta('--fondo'),
    texto: tinta('--texto'),
    tenue: tinta('--texto-tenue'),
    borde: tinta('--borde'),
    marca: tinta('--marca-rojo'),
    juego: tinta('--cat-letras'),
    ok: tinta('--acento-3'),
    no: tinta('--acento-4'),
  };
  const rnd = azar(1991);

  // ---- La pared: el ladrillo en la tinta del borde, la junta en la del fondo.
  ctx.fillStyle = c.fondo;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = c.borde;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  ctx.fillStyle = c.fondo;
  const HILADA = 58;
  const LADRILLO = 144;
  for (let h = 0, y = 0; y < H; h++, y += HILADA) {
    ctx.fillRect(0, y, W, 6);
    for (let x = h % 2 ? LADRILLO / 2 : 0; x < W; x += LADRILLO) {
      ctx.fillRect(x + (rnd() - 0.5) * 10, y, 5, HILADA);
    }
  }

  /** Un paño pintado, con el canto roto a mordiscones arriba y abajo. */
  const pano = (y: number, alto: number): void => {
    ctx.fillStyle = c.fondo;
    ctx.fillRect(0, y, W, alto);
    for (let x = 0; x < W; ) {
      const ancho = 14 + rnd() * 44;
      ctx.fillRect(x, y - rnd() * 20, ancho, 22);
      ctx.fillRect(x, y + alto - 2, ancho, rnd() * 20 + 2);
      x += ancho;
    }
  };

  const escribir = (texto: string, x: number, y: number, cuerpo: number, familia: string, color: string, anchoMax: number): number => {
    let k = cuerpo;
    ctx.font = `400 ${k}px ${familia}`;
    const ancho = ctx.measureText(texto).width;
    if (ancho > anchoMax) {
      k = Math.max(cuerpo * 0.5, (cuerpo * anchoMax) / ancho);
      ctx.font = `400 ${k}px ${familia}`;
    }
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.fillText(texto, x, y);
    return ctx.measureText(texto).width;
  };

  /** La tilde y la cruz, dibujadas: trazo grueso, puntas redondas. `lado` es el alto de la marca. */
  const marca = (acerto: boolean, x: number, y: number, lado: number): void => {
    ctx.save();
    ctx.strokeStyle = acerto ? c.ok : c.no;
    ctx.lineWidth = lado * 0.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (acerto) {
      ctx.moveTo(x, y + lado * 0.55);
      ctx.lineTo(x + lado * 0.35, y + lado * 0.9);
      ctx.lineTo(x + lado * 0.95, y + lado * 0.1);
    } else {
      ctx.moveTo(x, y + lado * 0.1);
      ctx.lineTo(x + lado * 0.8, y + lado * 0.9);
      ctx.moveTo(x + lado * 0.8, y + lado * 0.1);
      ctx.lineTo(x, y + lado * 0.9);
    }
    ctx.stroke();
    ctx.restore();
  };

  const MARGEN = 72;

  // ---- El paño de arriba: quién firma, qué juego es y la línea que canta.
  pano(64, 286);
  escribir(MARCA, MARGEN, 88, 58, CALCO, c.marca, W - MARGEN * 2);
  escribir(datos.juego.toUpperCase(), MARGEN, 168, 64, ROTULADA, c.juego, W - MARGEN * 2);
  escribir(datos.tramo, MARGEN, 262, 46, ROTULADA, c.texto, W - MARGEN * 2);

  // ---- El muro de la vuelta: las palabras, en dos columnas.
  const filas = Math.ceil(datos.palabras.length / 2);
  const ALTO_CELDA = filas > 0 ? Math.min(176, 700 / filas) : 176;
  const Y_MURO = 420;
  pano(Y_MURO, filas * ALTO_CELDA + 36);
  const ANCHO_COL = (W - MARGEN * 2) / 2;
  datos.palabras.forEach((p, i) => {
    const x = MARGEN + (i % 2) * ANCHO_COL;
    const y = Y_MURO + 24 + Math.floor(i / 2) * ALTO_CELDA;
    const anchoMax = ANCHO_COL - 110;
    ctx.save();
    // Cada pintada con su pulso: gira apenas alrededor de su esquina.
    ctx.translate(x, y);
    ctx.rotate(((i % 3) - 1) * 0.012);
    if (p.acerto) {
      const ancho = escribir(p.era.toUpperCase(), 0, ALTO_CELDA * 0.24, 62, ROTULADA, c.texto, anchoMax);
      marca(true, ancho + 16, ALTO_CELDA * 0.24 + 8, 44);
    } else {
      // Lo que pusiste, apagado y con la raya de aerosol; debajo, la que era.
      const ancho = escribir(p.puso.toUpperCase(), 0, ALTO_CELDA * 0.06, 44, ROTULADA, c.tenue, anchoMax);
      ctx.fillStyle = c.no;
      ctx.fillRect(-10, ALTO_CELDA * 0.06 + 19, ancho + 20, 7);
      marca(false, ancho + 22, ALTO_CELDA * 0.06 + 6, 32);
      const anchoEra = escribir(p.era.toUpperCase(), 0, ALTO_CELDA * 0.06 + 56, 56, ROTULADA, c.ok, anchoMax);
      marca(true, anchoEra + 16, ALTO_CELDA * 0.06 + 64, 40);
    }
    ctx.restore();
  });

  // ---- Abajo: la cuenta en un sello, y dónde se juega.
  const Y_PIE = Y_MURO + filas * ALTO_CELDA + 36 + 62;
  const altoPie = Math.max(120, H - Y_PIE - 56);
  pano(Y_PIE, altoPie);
  ctx.font = `400 96px ${ROTULADA}`;
  const anchoCuenta = ctx.measureText(datos.cuenta).width;
  const xSello = W - MARGEN - anchoCuenta - 56;
  const ySello = Y_PIE + (altoPie - 132) / 2;
  ctx.save();
  ctx.translate(xSello, ySello);
  ctx.rotate(-0.035);
  ctx.strokeStyle = c.juego;
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, anchoCuenta + 56, 132);
  escribir(datos.cuenta, 28, 16, 96, ROTULADA, c.texto, anchoCuenta + 1);
  ctx.restore();
  escribir(datos.sitio, MARGEN, Y_PIE + altoPie / 2 - 18, 32, ROTULADA, c.tenue, xSello - MARGEN - 40);

  granular(ctx);

  return new Promise((listo) => lienzo.toBlob((b) => listo(b), 'image/png'));
}
