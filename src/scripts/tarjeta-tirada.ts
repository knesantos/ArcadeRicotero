/**
 * La tarjeta compartible de "Adiviná la tapa" (`US-04`), en el idioma de la imprenta (ronda de
 * pulida, 2026-11-20).
 *
 * Es **la tirada colgada a secar**: arriba la firma del sitio y el nombre del juego; al medio la
 * cuenta, grande; debajo la soga con las hojas de la vuelta, en el orden en que se jugaron —las
 * que tenías, impresas del todo; las que no, en una sola tinta sobre el papel— cada una con su
 * broche y su tilde o su cruz; y al pie el crédito de las tapas (`D-21`: una imagen suelta no
 * tiene pie de imprenta) y dónde se juega.
 *
 * Mismas reglas que `tarjeta.ts`, de donde salen el grano, la espera de las letras y la lectura
 * de tokens: **ni un hex acá**, ninguna sombra, ningún degradado. La tilde y la cruz se dibujan
 * con trazos: como glifo, en un teléfono salen con la letra de emoji. Nunca tira: si el canvas
 * no está, devuelve `null`; si una tapa no llega, su hoja queda en papel.
 *
 * No lleva ningún dato de la persona ni el nombre de ningún disco: muestra qué salió y cómo.
 */

import { LIENZO, FRANJA } from '../lib/tarjeta/plan.ts';
import { tinta, esperarLetras, granular } from './tarjeta.ts';

const ROTULADA = '"Archivo Black", "Arial Black", sans-serif';
const CALCO = '"Oktubre Calco", "Archivo Black", "Arial Black", sans-serif';
const MARCA = 'FICHÍN RICOTERO';

export interface HojaDeLaTirada {
  /** Si la tenías: la hoja va impresa del todo. Si no, en una tinta. */
  readonly entera: boolean;
  /** La foto de la tapa, o su pasada de clave. `null` si el disco no tiene estampa. */
  readonly imagen: string | null;
}

export interface DatosDeLaTirada {
  readonly juego: string;
  /** La cuenta, ya escrita ("4 de 6"). */
  readonly puntaje: string;
  /** El rótulo de la soga. Registro 3. */
  readonly rotulo: string;
  readonly hojas: readonly HojaDeLaTirada[];
  /** De quién es el arte de las tapas. */
  readonly credito: string;
  /** Dónde se juega. Es la única forma de volver que tiene una imagen suelta. */
  readonly sitio: string;
}

/** Trae una imagen del sitio. Nunca tira: si no llega a tiempo, `null`. */
function traer(ruta: string): Promise<HTMLImageElement | null> {
  return new Promise((listo) => {
    const img = new Image();
    const reloj = window.setTimeout(() => listo(null), 4000);
    img.onload = () => {
      window.clearTimeout(reloj);
      listo(img);
    };
    img.onerror = () => {
      window.clearTimeout(reloj);
      listo(null);
    };
    img.src = ruta;
  });
}

export async function dibujarTirada(datos: DatosDeLaTirada): Promise<Blob | null> {
  const lienzo = document.createElement('canvas');
  lienzo.width = LIENZO.ancho;
  lienzo.height = LIENZO.alto;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return null;
  const [imagenes] = await Promise.all([
    Promise.all(datos.hojas.map((h) => (h.imagen ? traer(h.imagen) : Promise.resolve(null)))),
    esperarLetras(),
  ]);

  const W = LIENZO.ancho;
  const H = LIENZO.alto;
  const MARGEN = 80;
  const UTIL = W - MARGEN * 2;
  const c = {
    fondo: tinta('--fondo'),
    texto: tinta('--texto'),
    tenue: tinta('--texto-tenue'),
    borde: tinta('--borde'),
    marca: tinta('--marca-rojo'),
    papel: tinta('--papel'),
    madera: tinta('--papel-borde'),
    ok: tinta('--acento-3'),
    no: tinta('--acento-4'),
  };

  ctx.fillStyle = c.fondo;
  ctx.fillRect(0, 0, W, H);

  /** Escribe achicando hasta que entre. Devuelve el ancho de lo escrito. */
  const escribir = (texto: string, x: number, y: number, cuerpo: number, familia: string, color: string, anchoMax: number): number => {
    let k = cuerpo;
    ctx.font = `400 ${k}px ${familia}`;
    const ancho = ctx.measureText(texto).width;
    if (ancho > anchoMax) {
      k = Math.max(cuerpo * 0.45, (cuerpo * anchoMax) / ancho);
      ctx.font = `400 ${k}px ${familia}`;
    }
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.fillText(texto, x, y);
    return ctx.measureText(texto).width;
  };

  const trazo = (color: string, grosor: number): void => {
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  /** La tilde o la cruz, dibujadas adentro de un cuadrado de lado `l` con esquina en (x, y). */
  const marca = (cual: 'ok' | 'no', x: number, y: number, l: number, color: string): void => {
    trazo(color, Math.max(3, l * 0.16));
    ctx.beginPath();
    if (cual === 'ok') {
      ctx.moveTo(x + l * 0.2, y + l * 0.55);
      ctx.lineTo(x + l * 0.42, y + l * 0.76);
      ctx.lineTo(x + l * 0.8, y + l * 0.26);
    } else {
      ctx.moveTo(x + l * 0.26, y + l * 0.26);
      ctx.lineTo(x + l * 0.74, y + l * 0.74);
      ctx.moveTo(x + l * 0.74, y + l * 0.26);
      ctx.lineTo(x + l * 0.26, y + l * 0.74);
    }
    ctx.stroke();
  };

  // ---- Arriba: quién firma y qué juego es.
  escribir(MARCA, MARGEN, 84, 62, CALCO, c.marca, UTIL);
  escribir(datos.juego.toUpperCase(), MARGEN, 170, 60, ROTULADA, c.texto, UTIL);

  // ---- La cuenta, grande, en la tinta del papel; al lado, el rótulo de la soga.
  const anchoCuenta = escribir(datos.puntaje.toUpperCase(), MARGEN, 276, 170, ROTULADA, c.papel, UTIL - 300);
  escribir(datos.rotulo.toUpperCase(), MARGEN + anchoCuenta + 36, 396, 34, ROTULADA, c.tenue, UTIL - anchoCuenta - 36);

  // ---- La soga: hasta tres hojas por renglón, cada una colgada de su broche.
  const POR_RENGLON = 3;
  const hueco = 44;
  const lado = Math.floor((UTIL - hueco * (POR_RENGLON - 1)) / POR_RENGLON);
  const renglones = Math.ceil(datos.hojas.length / POR_RENGLON);
  const Y_SOGA = 452;
  const altoRenglon = lado + 70;
  for (let r = 0; r < renglones; r++) {
    const y = Y_SOGA + r * altoRenglon;
    // La soga, de lado a lado, apenas caída.
    trazo(c.tenue, 5);
    ctx.beginPath();
    ctx.moveTo(MARGEN - 30, y);
    ctx.quadraticCurveTo(W / 2, y + 16, W - MARGEN + 30, y);
    ctx.stroke();
  }
  datos.hojas.forEach((hoja, i) => {
    const col = i % POR_RENGLON;
    const r = Math.floor(i / POR_RENGLON);
    const x = MARGEN + col * (lado + hueco);
    const y = Y_SOGA + r * altoRenglon + 34;
    ctx.save();
    // Cada hoja cuelga un poco torcida, para un lado o para el otro.
    ctx.translate(x + lado / 2, y - 24);
    ctx.rotate(((i % 2 === 0 ? -1 : 1) * (1.2 + (i % 3) * 0.5) * Math.PI) / 180);
    ctx.translate(-lado / 2, 24);
    // El papel.
    ctx.fillStyle = c.papel;
    ctx.fillRect(0, 0, lado, lado);
    const img = imagenes[i];
    if (img) {
      // La tinta sobre el papel: la clave sola multiplica, como en la mesa.
      if (!hoja.entera) ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(img, 0, 0, lado, lado);
      ctx.globalCompositeOperation = 'source-over';
    }
    trazo(c.borde, 6);
    ctx.strokeRect(0, 0, lado, lado);
    // El broche: madera, pisando el borde de arriba.
    ctx.fillStyle = c.madera;
    ctx.fillRect(lado / 2 - 13, -40, 26, 62);
    trazo(c.fondo, 3);
    ctx.strokeRect(lado / 2 - 13, -40, 26, 62);
    ctx.beginPath();
    ctx.moveTo(lado / 2 - 13, -12);
    ctx.lineTo(lado / 2 + 13, -12);
    ctx.stroke();
    // La tilde o la cruz, en un redondel sobre la esquina de abajo.
    const R = 34;
    const cx = lado - 18;
    const cy = lado - 18;
    ctx.fillStyle = c.fondo;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    const color = hoja.entera ? c.ok : c.no;
    trazo(color, 6);
    ctx.beginPath();
    ctx.arc(cx, cy, R - 3, 0, Math.PI * 2);
    ctx.stroke();
    marca(hoja.entera ? 'ok' : 'no', cx - R * 0.62, cy - R * 0.62, R * 1.24, color);
    ctx.restore();
  });

  // ---- Al pie: el crédito de las tapas, dónde se juega, y la franja roja que ancla la composición.
  escribir(datos.credito, MARGEN, H - 186, 24, ROTULADA, c.tenue, UTIL);
  escribir(datos.sitio, MARGEN, H - 144, 44, ROTULADA, c.texto, UTIL);
  ctx.fillStyle = c.marca;
  ctx.fillRect(0, H - FRANJA, W, FRANJA);

  granular(ctx);

  return new Promise((listo) => lienzo.toBlob((b) => listo(b), 'image/png'));
}
