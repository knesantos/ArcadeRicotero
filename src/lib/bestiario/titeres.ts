/**
 * Los títeres del bestiario (`D-73`, cuarta vuelta): el lobo y el cordero **son las tapas**,
 * recortadas en piezas (`recortes.ts`, `scripts/recortar-bestiario.mjs`).
 *
 * Cada pieza es una imagen puesta en su caja, en píxeles de la tapa; la isla escala el títere
 * entero a la escena y mueve las piezas sobre los pivotes de `ARMADO`. Los párpados son lo
 * único que se dibuja acá: una elipse del color de la piel de arriba de cada ojo, medido en la
 * tapa, que baja al parpadear.
 */

import { PIEZAS } from './arte.ts';
import { rutaDePieza } from './aerografo.ts';
import { ARMADO, RECORTES, cajaDeRecorte } from './recortes.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const cajas = new Map<string, readonly [number, number, number, number]>([
  ...PIEZAS.map((p) => [p.nombre, p.caja] as const),
  ...RECORTES.map((r) => [r.nombre, cajaDeRecorte(r)] as const),
]);

/** La imagen de una pieza, en su caja. */
export function imagen(nombre: string): string {
  const caja = cajas.get(nombre);
  if (!caja) throw new Error(`no hay pieza "${nombre}" en arte.ts ni en recortes.ts`);
  const [x, y, ancho, alto] = caja;
  return `<image href="${rutaDePieza(nombre)}" x="${f(x)}" y="${f(y)}" width="${ancho}" height="${alto}" preserveAspectRatio="none"/>`;
}

const parte = (nombre: string, cuerpo: string): string => `<g data-parte="${nombre}">${cuerpo}</g>`;

/** Un párpado: tapa el ojo bajando desde arriba. `giro` lo alinea con un ojo inclinado. */
function parpado(n: number, ojo: { centro: readonly [number, number]; radio: readonly [number, number]; giro?: number }, clase: string): string {
  const [cx, cy] = ojo.centro;
  const [rx, ry] = ojo.radio;
  const elipse = `<ellipse data-parte="parpado-${n}" data-pivote="${cx} ${cy - ry}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="${clase}" transform="scale(1 0)"/>`;
  return ojo.giro ? `<g transform="rotate(${ojo.giro} ${cx} ${cy})">${elipse}</g>` : elipse;
}

/** El lobo suelto: el busto de la tapa, el pecho y la cabeza. */
export function lobo(): string {
  const [ojo1, ojo2] = ARMADO.lobo.ojos;
  return (
    `<g data-titere="lobo">` +
    parte('pecho', imagen('lobo-real-pecho')) +
    parte('cabeza', imagen('lobo-real-cabeza') + parpado(1, ojo1, 'bt-lobo-parpado') + parpado(2, ojo2, 'bt-lobo-parpado-oscuro')) +
    `</g>`
  );
}

/** El cordero atado: la criatura de la tapa, con el lomo que la completa donde la tapa la corta. */
export function cordero(): string {
  const [ojo1, ojo2] = ARMADO.cordero.ojos;
  const [px, py] = ARMADO.cordero.piso;
  return (
    `<g data-titere="cordero">` +
    `<ellipse cx="${px}" cy="${py + 10}" rx="330" ry="34" class="bt-sombra-piso"/>` +
    parte('pata-tras', imagen('cordero-real-pata-tras')) +
    parte('pata-del', imagen('cordero-real-pata-del')) +
    parte('cuerpo', imagen('cordero-lomo') + imagen('cordero-real-cuerpo')) +
    parte('cabeza', imagen('cordero-real-cabeza') + parpado(1, ojo1, 'bt-cordero-parpado') + parpado(2, ojo2, 'bt-cordero-parpado')) +
    `</g>`
  );
}
