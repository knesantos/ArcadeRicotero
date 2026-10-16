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

/**
 * El retrato de ficha de los que tienen tapa (`D-73`, pulida): las mismas piezas del títere,
 * quietas y encuadradas en la caja que las junta. Así la ficha muestra al bicho que se tocó en
 * la escena, y no la figura del plano. `null` para los demás, que siguen con su figura.
 */
const PIEZAS_DEL_RETRATO: Readonly<Record<string, { piezas: readonly string[]; cuerpo: () => string }>> = {
  'el-lobo-suelto': { piezas: ['lobo-real-pecho', 'lobo-real-cabeza'], cuerpo: lobo },
  'el-cordero-atado': {
    piezas: ['cordero-real-pata-tras', 'cordero-real-pata-del', 'cordero-real-cuerpo', 'cordero-real-cabeza'],
    cuerpo: () =>
      ['cordero-real-pata-tras', 'cordero-real-pata-del', 'cordero-lomo', 'cordero-real-cuerpo', 'cordero-real-cabeza'].map(imagen).join(''),
  },
  'ese-perro-que-sigue-alli': {
    piezas: ['perro-real-boca', 'perro-real-mandibula', 'perro-real-cabeza'],
    cuerpo: () => ['perro-real-boca', 'perro-real-mandibula', 'perro-real-cabeza'].map(imagen).join(''),
  },
  luzbelito: {
    piezas: ['luzbelito-real-busto', 'luzbelito-real-llama'],
    cuerpo: () => imagen('luzbelito-real-busto') + imagen('luzbelito-real-llama'),
  },
  momo: { piezas: ['momo-real-medallon'], cuerpo: () => imagen('momo-real-medallon') },
};

export function retrato(id: string): { caja: string; svg: string } | null {
  const r = PIEZAS_DEL_RETRATO[id];
  if (!r) return null;
  const cs = r.piezas.map((n) => cajas.get(n)!);
  const x0 = Math.min(...cs.map((c) => c[0]));
  const y0 = Math.min(...cs.map((c) => c[1]));
  const x1 = Math.max(...cs.map((c) => c[0] + c[2]));
  const y1 = Math.max(...cs.map((c) => c[1] + c[3]));
  const aire = Math.max(x1 - x0, y1 - y0) * 0.04;
  return { caja: `${f(x0 - aire)} ${f(y0 - aire)} ${f(x1 - x0 + aire * 2)} ${f(y1 - y0 + aire * 2)}`, svg: r.cuerpo() };
}
