/**
 * El pincel de la hoja de "Armá tu recital" (`D-72`; ronda de pulida, 2026-11-21).
 *
 * **La planta la decide `lib/recital/hoja.ts`; acá solo se pinta**, igual que `lamina.ts` con
 * `lib/ponelos/lamina.ts`. Es lo que se ve en la pantalla de la noche, hecho imagen: el piso de
 * tinta, la hoja de papel apenas torcida con cuatro tiras de cinta, el título en la letra de la
 * banda, los temas numerados en fibra y en mayúsculas, el corte de puntos y los bises.
 *
 * Los colores salen de `tokens.css`, leídos del documento (`tinta`, de `lamina.ts`). Sin sombra
 * (`D-64`): la hoja se recorta por su borde y por la cinta. Lleva el crédito adentro (`D-21`).
 */

import { plantaDeLaHoja, cuerpoDelTitulo, AIRE_HOJA, FRANJA_HOJA, MARGEN_HOJA } from '../lib/recital/hoja.ts';
import { tinta, granular } from './lamina.ts';

const ROTULADA = '"Archivo Black", "Arial Black", sans-serif';
const CALCO = '"Oktubre Calco", "Archivo Black", "Arial Black", sans-serif';
const FIRMA = '"Patricio Rey Fan", "Archivo Black", sans-serif';
const MARCA = 'FICHÍN RICOTERO';

export interface DatosHojaRecital {
  /** El título de la hoja: "La lista de esta noche". */
  readonly titulo: string;
  /** El lugar, en una línea. */
  readonly lugar: string;
  readonly lista: readonly string[];
  readonly bises: readonly string[];
  /** La palabra del corte: "BISES". */
  readonly rotuloBises: string;
  /** Cuántos temas y cuánto dura. */
  readonly cuenta: string;
  readonly credito: string;
  readonly sitio: string;
}

async function esperarLetras(): Promise<void> {
  try {
    await Promise.all([ROTULADA, CALCO, FIRMA].map((f) => document.fonts.load(`400 100px ${f.split(',')[0]}`)));
  } catch {
    // Con una letra que no llegó se dibuja con lo que haya.
  }
}

/** Dibuja la hoja y la devuelve como PNG, o `null` si el navegador no da un canvas. */
export async function dibujarHojaRecital(datos: DatosHojaRecital): Promise<Blob | null> {
  const plan = plantaDeLaHoja(datos.lista.length, datos.bises.length);
  const lienzo = document.createElement('canvas');
  lienzo.width = plan.ancho;
  lienzo.height = plan.alto;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return null;
  await esperarLetras();

  const c = {
    piso: tinta('--fondo'),
    papel: tinta('--papel'),
    tintaPapel: tinta('--fondo'),
    tenue: tinta('--papel-tenue'),
    borde: tinta('--papel-borde'),
    marca: tinta('--marca-rojo'),
  };
  const anchoUtil = plan.ancho - MARGEN_HOJA * 2;
  ctx.textBaseline = 'top';

  ctx.fillStyle = c.piso;
  ctx.fillRect(0, 0, plan.ancho, plan.alto);

  // La hoja, apenas torcida; todo lo escrito gira con ella.
  const hoja = { x: AIRE_HOJA, y: AIRE_HOJA, ancho: plan.ancho - AIRE_HOJA * 2, alto: plan.alto - FRANJA_HOJA - AIRE_HOJA * 2 };
  ctx.save();
  ctx.translate(plan.ancho / 2, plan.alto / 2);
  ctx.rotate((-0.6 * Math.PI) / 180);
  ctx.translate(-plan.ancho / 2, -plan.alto / 2);
  ctx.fillStyle = c.papel;
  ctx.fillRect(hoja.x, hoja.y, hoja.ancho, hoja.alto);
  const cinta = (cx: number, cy: number, giro: number): void => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((giro * Math.PI) / 180);
    ctx.fillStyle = c.borde;
    ctx.fillRect(-80, -26, 160, 52);
    ctx.strokeStyle = c.tenue;
    ctx.lineWidth = 2;
    ctx.strokeRect(-80, -26, 160, 52);
    ctx.restore();
  };
  cinta(hoja.x + 14, hoja.y + 18, -40);
  cinta(hoja.x + hoja.ancho - 14, hoja.y + 18, 38);
  cinta(hoja.x + 14, hoja.y + hoja.alto - 18, 37);
  cinta(hoja.x + hoja.ancho - 14, hoja.y + hoja.alto - 18, -41);

  const escribir = (texto: string, x: number, y: number, cuerpo: number, familia: string, color: string): void => {
    ctx.font = `400 ${cuerpo}px ${familia}`;
    ctx.fillStyle = color;
    ctx.fillText(texto, x, y);
  };
  const ancho = (texto: string, cuerpo: number, familia: string): number => {
    ctx.font = `400 ${cuerpo}px ${familia}`;
    return ctx.measureText(texto).width;
  };
  /** Escribe una línea achicándola lo justo para que entre. */
  const ajustado = (texto: string, x: number, y: number, max: number, cuerpo: number, familia: string, color: string): void => {
    escribir(texto, x, y, cuerpoDelTitulo(ancho(texto, cuerpo, familia), max, cuerpo, 0.4), familia, color);
  };

  // La cabeza: la marca chica, el título en la letra de la banda y el lugar.
  ajustado(MARCA, MARGEN_HOJA, plan.yMarca, anchoUtil, 46, CALCO, c.marca);
  ajustado(datos.titulo.toLocaleUpperCase('es-AR'), MARGEN_HOJA, plan.yTitulo, anchoUtil, 104, FIRMA, c.tintaPapel);
  ajustado(datos.lugar.toLocaleUpperCase('es-AR'), MARGEN_HOJA, plan.yLugar, anchoUtil, 38, ROTULADA, c.tenue);

  // Los temas: el número en tenue, el título en fibra y en mayúsculas, y la raya de abajo.
  // Cada renglón sale apenas torcido para un lado o para el otro: está escrito a mano.
  // **Todos con la misma letra**: la del título más largo. Achicar solo los largos dejaba una
  // lista de cuerpos distintos, que no es una hoja escrita por una mano.
  const columna = Math.round(plan.cuerpo * 1.9);
  const max = anchoUtil - columna;
  const cuerpo = Math.min(
    plan.cuerpo,
    ...[...datos.lista, ...datos.bises].map((t) => cuerpoDelTitulo(ancho(t.toLocaleUpperCase('es-AR'), plan.cuerpo, ROTULADA), max, plan.cuerpo)),
  );
  const renglon = (titulo: string, numero: number, y: number): void => {
    const texto = titulo.toLocaleUpperCase('es-AR');
    ctx.save();
    ctx.translate(MARGEN_HOJA, y + plan.cuerpo / 2);
    ctx.rotate(((numero % 2 === 0 ? 0.35 : -0.4) * Math.PI) / 180);
    escribir(`${numero}.`, 0, -plan.cuerpo / 2 + (plan.cuerpo - cuerpo * 0.8) / 2, Math.round(plan.cuerpo * 0.8), ROTULADA, c.tenue);
    // Si ni al piso entra, se aprieta de costado: entero antes que cortado.
    ctx.font = `400 ${cuerpo}px ${ROTULADA}`;
    ctx.fillStyle = c.tintaPapel;
    ctx.fillText(texto, columna, -cuerpo / 2, max);
    ctx.restore();
    ctx.fillStyle = c.borde;
    ctx.fillRect(MARGEN_HOJA, y + plan.paso - Math.round(plan.cuerpo * 0.22), anchoUtil, 2);
  };
  datos.lista.forEach((t, k) => renglon(t, k + 1, plan.yLista[k]!));

  if (plan.yCorte !== null) {
    // El corte: la raya de puntos con la palabra adentro, como en la pantalla.
    const cuerpo = 40;
    const palabra = datos.rotuloBises.toLocaleUpperCase('es-AR');
    const y = plan.yCorte + 16;
    const xPalabra = MARGEN_HOJA + 70;
    const anchoPalabra = ancho(palabra, cuerpo, ROTULADA);
    ctx.save();
    ctx.strokeStyle = c.tintaPapel;
    ctx.lineWidth = 5;
    ctx.setLineDash([16, 11]);
    ctx.beginPath();
    ctx.moveTo(MARGEN_HOJA, y + cuerpo / 2);
    ctx.lineTo(xPalabra - 16, y + cuerpo / 2);
    ctx.moveTo(xPalabra + anchoPalabra + 16, y + cuerpo / 2);
    ctx.lineTo(MARGEN_HOJA + anchoUtil, y + cuerpo / 2);
    ctx.stroke();
    ctx.restore();
    escribir(palabra, xPalabra, y, cuerpo, ROTULADA, c.tintaPapel);
    datos.bises.forEach((t, k) => renglon(t, datos.lista.length + k + 1, plan.yBises[k]!));
  }

  // El pie: cuántos y cuánto dura, el crédito y dónde se arma.
  ajustado(datos.cuenta, MARGEN_HOJA, plan.yPie + 24, anchoUtil, 34, ROTULADA, c.tintaPapel);
  ajustado(datos.credito, MARGEN_HOJA, plan.yPie + 74, anchoUtil, 24, ROTULADA, c.tenue);
  ajustado(datos.sitio, MARGEN_HOJA, plan.yPie + 108, anchoUtil, 24, ROTULADA, c.tenue);
  ctx.restore();

  // La franja del pie: el mismo rojo de las otras piezas que salen del sitio.
  ctx.fillStyle = c.marca;
  ctx.fillRect(0, plan.alto - FRANJA_HOJA, plan.ancho, FRANJA_HOJA);
  granular(ctx, plan.alto);

  return new Promise<Blob | null>((listo) => lienzo.toBlob((blob) => listo(blob), 'image/png'));
}
