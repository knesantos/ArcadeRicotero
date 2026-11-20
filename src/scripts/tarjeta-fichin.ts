/**
 * La tarjeta compartible de "Preguntas ricoteras" (`US-01`), en el idioma del fichín (ronda de
 * pulida, 2026-11-19).
 *
 * Es **la chapa de la máquina con la partida anotada**: arriba la firma del sitio y el nombre
 * del juego; al medio el desenlace estampado, el `Nº` al que llegaste —grande, en el amarillo
 * de las fichas— y las tres fichas como quedaron; debajo la planilla, pregunta por pregunta y
 * escalón por escalón; y al pie, dónde se juega.
 *
 * Mismas reglas que `tarjeta.ts`, de donde salen el grano, la espera de las letras y la
 * lectura de tokens: **ni un hex acá** (todo se lee de `tokens.css` en vivo), ninguna sombra,
 * ningún degradado. La tilde, la cruz y el rombo se dibujan con trazos: como glifo, en un
 * teléfono salen con la letra de emoji. Nunca tira: si el canvas no está, devuelve `null`.
 *
 * No lleva ningún dato de la persona, ni una sola pregunta: dice hasta dónde se llegó y cómo.
 */

import { LIENZO, FRANJA } from '../lib/tarjeta/plan.ts';
import { tinta, esperarLetras, granular } from './tarjeta.ts';

const ROTULADA = '"Archivo Black", "Arial Black", sans-serif';
const CALCO = '"Oktubre Calco", "Archivo Black", "Arial Black", sans-serif';
const MARCA = 'FICHÍN RICOTERO';

export type Casilla = 'ok' | 'no' | 'resto';

export interface DatosDelFichin {
  readonly juego: string;
  /** El desenlace, seco: `DERROTA`, `VICTORIA`, `RETIRADA`. */
  readonly rotulo: string;
  /** La línea que canta del desenlace. */
  readonly titulo: string;
  /** El número grande, ya escrito ("Nº 12"). */
  readonly numero: string;
  /** "Pregunta 12 de 40 · nivel Media". */
  readonly recorrido: string;
  /** "9 de 12 acertadas". */
  readonly aciertos: string;
  /** Cuántas fichas quedaron en pie, de cuántas. */
  readonly vidas: number;
  readonly fichas: number;
  readonly escalones: readonly { readonly nivel: string; readonly casillas: readonly Casilla[] }[];
  /** Dónde se juega. Es la única forma de volver que tiene una imagen suelta. */
  readonly sitio: string;
}

export async function dibujarFichin(datos: DatosDelFichin): Promise<Blob | null> {
  const lienzo = document.createElement('canvas');
  lienzo.width = LIENZO.ancho;
  lienzo.height = LIENZO.alto;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return null;
  await esperarLetras();

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
    ficha: tinta('--acento-2'),
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

  /** Una ficha de vida: llena con su filete y su rombo, o el hueco de trazo cortado con la cruz. */
  const ficha = (cx: number, cy: number, r: number, viva: boolean): void => {
    ctx.save();
    if (viva) {
      ctx.fillStyle = c.ficha;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      trazo(c.fondo, r * 0.09);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = c.fondo;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.42);
      ctx.lineTo(cx + r * 0.36, cy);
      ctx.lineTo(cx, cy + r * 0.42);
      ctx.lineTo(cx - r * 0.36, cy);
      ctx.closePath();
      ctx.fill();
    } else {
      trazo(c.no, r * 0.12);
      ctx.setLineDash([r * 0.3, r * 0.24]);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      marca('no', cx - r * 0.7, cy - r * 0.7, r * 1.4, c.no);
    }
    ctx.restore();
  };

  // ---- Arriba: quién firma y qué juego es.
  escribir(MARCA, MARGEN, 84, 62, CALCO, c.marca, UTIL);
  escribir(datos.juego.toUpperCase(), MARGEN, 170, 60, ROTULADA, c.texto, UTIL);

  // ---- El desenlace, estampado: un sello torcido, sin tinta propia (lo dice la palabra).
  ctx.font = `400 46px ${ROTULADA}`;
  const anchoRotulo = ctx.measureText(datos.rotulo).width;
  ctx.save();
  ctx.translate(MARGEN + 6, 300);
  ctx.rotate(-0.05);
  trazo(c.texto, 6);
  ctx.strokeRect(0, 0, anchoRotulo + 48, 78);
  escribir(datos.rotulo, 24, 14, 46, ROTULADA, c.texto, anchoRotulo + 1);
  ctx.restore();

  // ---- El número, grande, y las fichas como quedaron.
  const anchoNumero = escribir(datos.numero, MARGEN, 410, 250, ROTULADA, c.ficha, UTIL - 330);
  const R = 46;
  const x0 = Math.min(MARGEN + anchoNumero + 70, W - MARGEN - (datos.fichas * 2 * R + (datos.fichas - 1) * 22)) + R;
  for (let i = 0; i < datos.fichas; i++) ficha(x0 + i * (2 * R + 22), 548, R, i < datos.vidas);

  escribir(datos.titulo, MARGEN, 690, 44, ROTULADA, c.texto, UTIL);
  escribir(`${datos.recorrido} · ${datos.aciertos}`, MARGEN, 752, 32, ROTULADA, c.tenue, UTIL);

  // ---- La planilla: un renglón por escalón, una casilla por pregunta, con su símbolo.
  const Y_PLANILLA = 846;
  const altoDisponible = H - Y_PLANILLA - 200;
  const filas = Math.max(1, datos.escalones.length);
  const altoFila = Math.min(110, altoDisponible / filas);
  const masLargo = Math.max(1, ...datos.escalones.map((e) => e.casillas.length));
  const hueco = 6;
  const lado = Math.max(14, Math.min(altoFila - 46, (UTIL - (masLargo - 1) * hueco) / masLargo));
  datos.escalones.forEach((escalon, k) => {
    const y = Y_PLANILLA + k * altoFila;
    escribir(escalon.nivel, MARGEN, y, 24, ROTULADA, c.tenue, UTIL);
    escalon.casillas.forEach((casilla, i) => {
      const x = MARGEN + i * (lado + hueco);
      const yy = y + 34;
      if (casilla === 'resto') {
        trazo(c.borde, 2.5);
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, yy, lado, lado);
        ctx.setLineDash([]);
        return;
      }
      const color = casilla === 'ok' ? c.ok : c.no;
      trazo(color, 3);
      ctx.strokeRect(x, yy, lado, lado);
      marca(casilla, x, yy, lado, color);
    });
  });

  // ---- Al pie: dónde se juega, de lado a lado, y la franja roja que ancla la composición.
  escribir(datos.sitio, MARGEN, H - 150, 44, ROTULADA, c.texto, UTIL);
  ctx.fillStyle = c.marca;
  ctx.fillRect(0, H - FRANJA, W, FRANJA);

  granular(ctx);

  return new Promise((listo) => lienzo.toBlob((b) => listo(b), 'image/png'));
}
