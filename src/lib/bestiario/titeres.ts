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
import { PIERRE_ARMADO, VACA_ARMADO } from './rig.ts';

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
 * El gordo Pierre (`D-73`, sexta vuelta): no es de tapa, está pintado a pincel seco en la
 * estética de *Gulp!* (`arte-bajo.ts`) y recortado en seis piezas. La cabeza lleva adentro la
 * boca (quieta, atrás) y la mandíbula, que se abre cuando se ríe y cuando tose; el brazo de la
 * botella se dobla en el codo para el trago. Los párpados son de papel, con la raya del ojo
 * cerrado abajo: cuando se ríe bajan hasta la mitad, que es como se achinan.
 */
export function pierre(): string {
  const parpadoDePapel = (n: number, { parpado: [cx, cy], radio: [rx, ry] }: (typeof PIERRE_ARMADO.ojos)[number]): string =>
    `<g data-parte="parpado-${n}" data-pivote="${cx} ${cy - ry}" transform="scale(1 0)">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="bt-pierre-parpado"/>` +
    `<path d="M${cx - rx} ${cy + 1} Q${cx} ${cy + ry * 0.9} ${cx + rx} ${cy + 1}" class="bt-pierre-pestana"/></g>`;
  const [o1, o2] = PIERRE_ARMADO.ojos;
  return (
    `<g data-titere="pierre">` +
    parte('cuerpo', imagen('pierre-cuerpo')) +
    parte('cabeza', imagen('pierre-boca') + parte('mandibula', imagen('pierre-mandibula')) + imagen('pierre-cabeza') + parpadoDePapel(1, o1) + parpadoDePapel(2, o2)) +
    parte('brazo', imagen('pierre-brazo') + parte('antebrazo', imagen('pierre-antebrazo'))) +
    `</g>`
  );
}

/**
 * La vaca cubana (`D-73`): no es de tapa, está dibujada a plumín sobre aguada en la estética de
 * *Un baión* (`arte-vaca.ts`) y recortada en piezas. La cabeza cuelga del cogote, mirando el cielo,
 * con la boca y la mandíbula atrás (rumia de costado) y la oreja adelante. **El ojo está vivo**: el
 * blanco y la pupila se dibujan acá, para que la pupila siga al satélite, y encima va el párpado
 * pesado impreso, y el de papel que baja al parpadear. `corte` es el id del recorte del ojo: la
 * ficha lo dibuja otra vez y no puede repetir el de la escena.
 */
export function vaca(corte = 'vaca-ojo-corte'): string {
  const A = VACA_ARMADO;
  const [cx, cy] = A.cuello;
  const {
    centro: [ex, ey],
    radio: [rx, ry],
    giro,
  } = A.ojo;
  const ojo =
    `<g transform="translate(${ex} ${ey}) rotate(${giro})">` +
    `<clipPath id="${corte}"><ellipse rx="${rx}" ry="${ry}"/></clipPath>` +
    `<ellipse rx="${rx}" ry="${ry}" class="bt-vaca-blanco"/>` +
    `<g clip-path="url(#${corte})"><g data-parte="pupila" transform="translate(-2.6 -3.4)">` +
    `<circle r="7.2" class="bt-vaca-iris"/><circle r="3.4" class="bt-tinta"/><circle cx="-2" cy="-2.4" r="1.6" class="bt-vaca-brillo"/></g></g></g>`;
  const parpadoDePapel =
    `<g data-parte="parpado" data-pivote="${ex} ${ey - ry}" transform="scale(1 0)"><g transform="translate(${ex} ${ey}) rotate(${giro})">` +
    `<ellipse rx="${rx + 0.6}" ry="${ry + 0.6}" class="bt-vaca-parpado"/>` +
    `<path d="M${-rx} 1 Q0 ${ry * 0.95} ${rx} 1" class="bt-vaca-pestana"/></g></g>`;
  return (
    `<g data-titere="vaca">` +
    `<ellipse cx="20" cy="2" rx="190" ry="14" class="bt-sombra-piso"/>` +
    parte(
      'cuerpo',
      imagen('vaca-cuerpo') +
        `<g data-parte="bolo" opacity="0">${imagen('vaca-bolo')}</g>` +
        parte('cola', imagen('vaca-cola') + parte('borla', imagen('vaca-borla'))),
    ) +
    `<g data-parte="cabeza" transform="rotate(${A.mira} ${cx} ${cy})"><g transform="translate(${cx} ${cy}) scale(${A.cabeza})">` +
    imagen('vaca-boca') +
    parte('mandibula', imagen('vaca-mandibula')) +
    imagen('vaca-cabeza') +
    ojo +
    imagen('vaca-ojo') +
    parpadoDePapel +
    parte('oreja', imagen('vaca-oreja')) +
    `</g></g></g>`
  );
}

/**
 * El retrato de ficha de los que tienen tapa (`D-73`, pulida): las mismas piezas del títere,
 * quietas y encuadradas en la caja que las junta. Así la ficha muestra al bicho que se tocó en
 * la escena, y no la figura del plano. `null` para los demás, que siguen con su figura.
 */
const PIEZAS_DEL_RETRATO: Readonly<Record<string, { piezas: readonly string[]; caja?: readonly [number, number, number, number]; cuerpo: () => string }>> = {
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
  // Pierre no es de tapa, pero tiene títere: la ficha lo muestra igual que la escena, sin el agua.
  'el-gordo-pierre': {
    piezas: ['pierre-cuerpo', 'pierre-cabeza', 'pierre-mandibula', 'pierre-brazo', 'pierre-antebrazo'],
    cuerpo: () => ['pierre-cuerpo', 'pierre-boca', 'pierre-mandibula', 'pierre-cabeza', 'pierre-brazo', 'pierre-antebrazo'].map(imagen).join(''),
  },
  // La vaca tampoco es de tapa. Su cabeza va en otro marco (girada en el cogote), así que la
  // caja no sale de las piezas: se da a mano, con la cabeza levantada mirando el cielo.
  'aquella-solitaria-vaca-cubana': {
    piezas: ['vaca-cuerpo'],
    caja: [-350, -415, 555, 430],
    cuerpo: () => vaca('vaca-ojo-retrato'),
  },
};

export function retrato(id: string): { caja: string; svg: string } | null {
  const r = PIEZAS_DEL_RETRATO[id];
  if (!r) return null;
  const cs = r.caja ? [r.caja] : r.piezas.map((n) => cajas.get(n)!);
  const x0 = Math.min(...cs.map((c) => c[0]));
  const y0 = Math.min(...cs.map((c) => c[1]));
  const x1 = Math.max(...cs.map((c) => c[0] + c[2]));
  const y1 = Math.max(...cs.map((c) => c[1] + c[3]));
  const aire = Math.max(x1 - x0, y1 - y0) * 0.04;
  return { caja: `${f(x0 - aire)} ${f(y0 - aire)} ${f(x1 - x0 + aire * 2)} ${f(y1 - y0 + aire * 2)}`, svg: r.cuerpo() };
}
