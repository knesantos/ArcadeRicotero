/**
 * Los títeres del bestiario (`D-73`): el lobo y el cordero de Rocambole, armados con las
 * piezas que imprime `scripts/imprimir-bestiario.mjs` desde `arte.ts`.
 *
 * Cada pieza que se mueve es un `<g data-parte>` con su imagen adentro, puesta en la caja que
 * dice su dibujo; la isla le pone el `transform` y la hace girar sobre `PIVOTES` (`rig.ts`).
 * Lo que es papel o soga —los eslabones de la cadena, el collar— se dibuja acá en vector,
 * porque son planos y recortados, como en la tapa. Los párpados también: solo se ven en el
 * parpadeo.
 *
 * Los dos miran a la derecha; la isla los da vuelta.
 */

import { PIEZAS } from './arte.ts';
import { rutaDePieza } from './aerografo.ts';
import { CADENA_LOBO } from './rig.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const cajas = new Map(PIEZAS.map((p) => [p.nombre, p.caja]));

/** La imagen de una pieza, en su caja. `dx` la corre de costado (las patas de atrás). */
export function imagen(nombre: string, dx = 0): string {
  const caja = cajas.get(nombre);
  if (!caja) throw new Error(`no hay pieza "${nombre}" en arte.ts`);
  const [x, y, ancho, alto] = caja;
  return `<image href="${rutaDePieza(nombre)}" x="${f(x + dx)}" y="${f(y)}" width="${ancho}" height="${alto}" preserveAspectRatio="none"/>`;
}

const parte = (nombre: string, cuerpo: string, extra = ''): string => `<g data-parte="${nombre}"${extra}>${cuerpo}</g>`;

/** Un eslabón de papel, con su corte en zigzag, como los de la tapa. */
function eslabon(x: number, y: number, ang: number, deCanto: boolean, i: number): string {
  const cuerpo = deCanto
    ? `<rect x="-8" y="-2" width="16" height="4" rx="1" class="bt-papel"/><rect x="-8" y="0.5" width="16" height="1.5" class="bt-lobo-sombra"/>`
    : `<rect x="-9" y="-5.5" width="18" height="11" rx="1.2" class="bt-papel"/>` +
      `<path d="M-6 -2 l2 3 l2 -3 l2 3 l2 -3 l2 3 l2 -3" class="bt-trazo-oscuro" stroke-width="1.4"/>` +
      `<rect x="-9" y="3" width="18" height="2.5" class="bt-lobo-crema"/>`;
  return `<g data-parte="eslabon" data-i="${i}" data-x="${f(x)}" data-y="${f(y)}" data-ang="${f(ang)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">${cuerpo}</g>`;
}

function cadena(): string {
  let s = '';
  for (let i = 0; i < CADENA_LOBO.length - 1; i++) {
    const [x0, y0] = CADENA_LOBO[i]!;
    const [x1, y1] = CADENA_LOBO[i + 1]!;
    s += eslabon((x0 + x1) / 2, (y0 + y1) / 2, (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI, i % 2 === 1, i);
  }
  const [xr, yr] = CADENA_LOBO[CADENA_LOBO.length - 1]!;
  s += `<g data-parte="eslabon" data-i="${CADENA_LOBO.length - 1}" data-x="${xr - 6}" data-y="${yr}" data-ang="180" transform="translate(${xr - 6} ${yr}) rotate(180)"><path d="M-9 -5.5 L4 -5.5 L1 -2 L5 1 L2 5.5 L-9 5.5 Z" class="bt-papel"/></g>`;
  return `<g class="cadena">${s}</g>`;
}

/** El lobo suelto. */
export function lobo(): string {
  return (
    `<g data-titere="lobo">` +
    `<ellipse cx="-4" cy="1" rx="74" ry="7" class="bt-sombra-piso"/>` +
    parte('pata-tras-lejos', imagen('lobo-pata-tras-lejos', 8)) +
    parte('pata-del-lejos', imagen('lobo-pata-del-lejos', 8)) +
    parte('cola', imagen('lobo-cola')) +
    parte('torso', imagen('lobo-torso')) +
    parte('pata-tras', imagen('lobo-pata-tras')) +
    parte('pata-del', imagen('lobo-pata-del')) +
    cadena() +
    parte(
      'cabeza',
      // La cabeza va más chica que en la tapa (allá es un busto) y baja, adelantada: acecha.
      `<g transform="translate(64 -98) scale(0.82) translate(-58 92)">` +
      imagen('lobo-cabeza') +
        parte('pupila-1', imagen('lobo-iris-1')) +
        parte('pupila-2', imagen('lobo-iris-2')) +
        `<ellipse data-parte="parpado-1" data-pivote="55 -153" cx="55" cy="-140" rx="13.5" ry="13" class="bt-lobo-crema" transform="scale(1 0)"/>` +
        `<ellipse data-parte="parpado-2" data-pivote="88.5 -147" cx="88.5" cy="-140.5" rx="7.5" ry="6.5" class="bt-lobo-oscuro" transform="scale(1 0)"/>` +
        parte('boca', imagen('lobo-boca'), ' data-pivote="70 -104" transform="translate(70 -104) scale(1 0) translate(-70 104)"') +
        // El collar: tres eslabones alrededor del cogote.
        `<g>${eslabon(53, -95, -22, false, -1)}${eslabon(69, -91, 0, true, -2)}${eslabon(85, -95, 22, false, -3)}</g>` +
        `</g>`,
    ) +
    `</g>`
  );
}

/** El cordero atado. */
export function cordero(): string {
  const parpado = (x: number, n: number): string =>
    `<path data-parte="parpado-${n}" data-pivote="${x} -128" d="M${x - 10} -121.5 Q${x} -132 ${x + 10} -121.5 Q${x} -114 ${x - 10} -121.5 Z" class="bt-cordero-mascara-clara" transform="scale(1 0)"/>`;
  return (
    `<g data-titere="cordero">` +
    `<ellipse cx="0" cy="1" rx="66" ry="7" class="bt-sombra-piso"/>` +
    parte('pata-tras-lejos', imagen('cordero-pata-lejos', -22)) +
    parte('pata-del-lejos', imagen('cordero-pata-lejos', 42)) +
    parte('cola', imagen('cordero-cola')) +
    parte('torso', imagen('cordero-torso')) +
    parte('pata-tras', imagen('cordero-pata', -34)) +
    parte('pata-del', imagen('cordero-pata', 30)) +
    parte(
      'cabeza',
      imagen('cordero-cabeza') +
        parte('pupila-1', imagen('cordero-iris-1')) +
        parte('pupila-2', imagen('cordero-iris-2')) +
        parpado(54, 1) +
        parpado(74, 2) +
        parte('hocico', imagen('cordero-hocico')) +
        // El collar de soga, de donde sale la que lo ata.
        `<path d="M40 -92 Q62 -78 86 -94" class="bt-trazo-soga" stroke-width="4"/>` +
        `<circle cx="62" cy="-84" r="3.5" class="bt-soga"/>`,
    ) +
    `</g>`
  );
}
