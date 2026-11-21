/**
 * La tarjeta compartible de "Más o menos" (`US-10`), en el idioma de las fichas (ronda de
 * pulida, 2026-11-20).
 *
 * Arriba la firma del sitio y el nombre del juego; al medio **la racha**, grande, en el
 * celeste de *Un baión para el ojo idiota*, y a su lado una ficha boca abajo —el objeto del
 * juego—; debajo, **la pila de las fichas ganadas**, un canto por acierto en montones de
 * cinco; la línea que canta, la mejor racha del aparato y, al pie, dónde se juega.
 *
 * Mismas reglas que `tarjeta.ts`, de donde salen el grano, la espera de las letras y la
 * lectura de tokens: **ni un hex acá** (todo se lee de `tokens.css` en vivo), ninguna sombra,
 * ningún degradado. Nunca tira: si el canvas no está, devuelve `null`.
 *
 * No lleva ninguna pregunta ni ningún número del pozo (sería regalarlos), ni un dato de la
 * persona: dice hasta dónde se llegó.
 */

import { LIENZO, FRANJA } from '../lib/tarjeta/plan.ts';
import { tinta, esperarLetras, granular } from './tarjeta.ts';

const ROTULADA = '"Archivo Black", "Arial Black", sans-serif';
const CALCO = '"Oktubre Calco", "Archivo Black", "Arial Black", sans-serif';
const MARCA = 'FICHÍN RICOTERO';
/** Cuántos cantos se dibujan como mucho: lo demás lo dice la cifra. */
const TOPE = 60;
const POR_MONTON = 5;

export interface DatosDeLasFichas {
  readonly juego: string;
  /** El rótulo de la cifra: "Racha". */
  readonly rotulo: string;
  readonly racha: number;
  /** La línea que canta, según la racha. */
  readonly titulo: string;
  /** "Tu mejor racha: 12". */
  readonly mejor: string;
  /** El sello de la hazaña, si esta partida pasó la mejor racha del aparato. */
  readonly hazana: string | null;
  /** Dónde se juega. Es la única forma de volver que tiene una imagen suelta. */
  readonly sitio: string;
}

export async function dibujarFichas(datos: DatosDeLasFichas): Promise<Blob | null> {
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
    marca: tinta('--marca-rojo'),
    disco: tinta('--disco-un-baion-para-el-ojo-idiota-tinta'),
    apoyo: tinta('--disco-un-baion-para-el-ojo-idiota-apoyo'),
    papel: tinta('--papel'),
    papelBorde: tinta('--papel-borde'),
    oro: tinta('--acento-2'),
  };

  ctx.fillStyle = c.fondo;
  ctx.fillRect(0, 0, W, H);

  // La mesa: el doble filete del paño, en el azul de apoyo.
  ctx.strokeStyle = c.apoyo;
  ctx.lineWidth = 6;
  ctx.strokeRect(34, 34, W - 68, H - 68 - 14);
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, W - 96, H - 96 - 14);

  /** Escribe achicando hasta que entre. Devuelve el ancho de lo escrito. */
  const escribir = (texto: string, x: number, y: number, cuerpo: number, familia: string, color: string, anchoMax: number): number => {
    let k = cuerpo;
    ctx.font = `400 ${k}px ${familia}`;
    const ancho = ctx.measureText(texto).width;
    if (ancho > anchoMax) {
      k = Math.max(cuerpo * 0.4, (cuerpo * anchoMax) / ancho);
      ctx.font = `400 ${k}px ${familia}`;
    }
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    ctx.fillText(texto, x, y);
    return ctx.measureText(texto).width;
  };

  // ---- Arriba: quién firma y qué juego es.
  escribir(MARCA, MARGEN, 84, 62, CALCO, c.marca, UTIL);
  escribir(datos.juego.toUpperCase(), MARGEN, 170, 60, ROTULADA, c.texto, UTIL);

  // ---- La racha, grande, con su rótulo.
  escribir(datos.rotulo.toUpperCase(), MARGEN, 300, 40, ROTULADA, c.tenue, UTIL);
  escribir(String(datos.racha), MARGEN, 350, 330, ROTULADA, c.disco, UTIL - 400);

  // ---- La ficha boca abajo, torcida, a la derecha: el dorso celeste con su trama, el filete,
  // el canto estriado y la medalla con la marca del fichín. Si la marca no llega, queda la
  // medalla lisa: la tarjeta sale igual.
  {
    const ancho = 290;
    const alto = 394;
    const canto = 20;
    const marca = await new Promise<HTMLImageElement | null>((listo) => {
      const imagen = new Image();
      imagen.onload = () => listo(imagen);
      imagen.onerror = () => listo(null);
      imagen.src = '/marca/fr-tinta.svg';
    });
    ctx.save();
    ctx.translate(W - MARGEN - ancho / 2 - 24, 530);
    ctx.rotate(0.09);
    // El canto, abajo, con sus estrías.
    ctx.fillStyle = c.apoyo;
    ctx.fillRect(-ancho / 2, -alto / 2 + canto, ancho, alto);
    ctx.fillStyle = c.fondo;
    ctx.globalAlpha = 0.3;
    for (let x = -ancho / 2 + 3; x < ancho / 2; x += 9) ctx.fillRect(x, alto / 2, 3.5, canto);
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.disco;
    ctx.fillRect(-ancho / 2, -alto / 2, ancho, alto);
    // La trama, tono sobre tono, adentro del filete.
    ctx.fillStyle = c.apoyo;
    for (let y = -alto / 2 + 18; y < alto / 2 - 18; y += 11) ctx.fillRect(-ancho / 2 + 16, y, ancho - 32, 4);
    ctx.strokeStyle = c.fondo;
    ctx.lineWidth = 5;
    ctx.strokeRect(-ancho / 2 + 16, -alto / 2 + 16, ancho - 32, alto - 32);
    // La medalla: redondel liso, doble filete y la FR coronada.
    ctx.fillStyle = c.disco;
    ctx.beginPath();
    ctx.arc(0, 0, 92, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, 0, 78, 0, Math.PI * 2);
    ctx.stroke();
    if (marca) {
      const lado = 104;
      const k = Math.min(lado / marca.naturalWidth, lado / marca.naturalHeight) || lado / 1290;
      const w = (marca.naturalWidth || 1290) * k;
      const h = (marca.naturalHeight || 1170) * k;
      ctx.drawImage(marca, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  // ---- La pila: un canto por ficha ganada, en montones de cinco, apoyados en un renglón.
  const Y_PISO = 900;
  const dibujadas = Math.min(datos.racha, TOPE);
  const montones = Math.max(1, Math.ceil(dibujadas / POR_MONTON));
  const anchoCanto = Math.min(120, (UTIL - (montones - 1) * 16) / montones);
  const altoCanto = 22;
  for (let i = 0; i < dibujadas; i++) {
    const monton = Math.floor(i / POR_MONTON);
    const piso = i % POR_MONTON;
    const x = MARGEN + monton * (anchoCanto + 16) + (piso % 2 === 0 ? 0 : 4);
    const y = Y_PISO - (piso + 1) * (altoCanto + 4);
    ctx.fillStyle = c.papelBorde;
    ctx.fillRect(x, y + 6, anchoCanto - 4, altoCanto - 6);
    ctx.fillStyle = c.papel;
    ctx.fillRect(x, y, anchoCanto - 4, altoCanto - 6);
  }
  ctx.strokeStyle = c.apoyo;
  ctx.lineWidth = 5;
  if (dibujadas === 0) ctx.setLineDash([18, 14]);
  ctx.beginPath();
  ctx.moveTo(MARGEN, Y_PISO + 6);
  ctx.lineTo(W - MARGEN, Y_PISO + 6);
  ctx.stroke();
  ctx.setLineDash([]);

  // ---- La línea que canta, la mejor racha y, si la hubo, la hazaña estampada.
  escribir(datos.titulo, MARGEN, 950, 46, ROTULADA, c.texto, UTIL);
  escribir(datos.mejor, MARGEN, 1016, 34, ROTULADA, c.tenue, UTIL);
  if (datos.hazana) {
    const texto = datos.hazana.toUpperCase();
    ctx.font = `400 40px ${ROTULADA}`;
    const ancho = ctx.measureText(texto).width;
    ctx.save();
    ctx.translate(W - MARGEN - ancho - 60, 1076);
    ctx.rotate(-0.06);
    ctx.strokeStyle = c.oro;
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, ancho + 44, 70);
    escribir(texto, 22, 13, 40, ROTULADA, c.oro, ancho + 1);
    ctx.restore();
  }

  // ---- Al pie: dónde se juega, y la franja roja que ancla la composición.
  escribir(datos.sitio, MARGEN, H - 150, 44, ROTULADA, c.texto, UTIL);
  ctx.fillStyle = c.marca;
  ctx.fillRect(0, H - FRANJA, W, FRANJA);

  granular(ctx);

  return new Promise((listo) => lienzo.toBlob((b) => listo(b), 'image/png'));
}
