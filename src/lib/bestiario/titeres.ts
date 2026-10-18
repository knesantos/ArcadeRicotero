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
import { DRACULA_ARMADO, PIERRE_ARMADO } from './rig.ts';

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
 * La drácula con tacones (`D-73`, séptima vuelta): no es de tapa, está tallada en la estética de
 * *Oktubre* (`arte-prision.ts`) y recortada en piezas. La capa se abre como dos puertas de papel:
 * cada mitad negra (`capa-1`, `capa-2`) se achica contra su hombro, y del otro lado se despliega
 * el forro rojo (`forro-1`, `forro-2`), que arranca plegado. Los mechones de adelante (`pelo`) van
 * encima de la capa y siguen a la cabeza. Los párpados son de tinta, con el filo del párpado
 * cerrado tallado abajo.
 */
export function dracula(): string {
  const parpadoDeTinta = (n: number, { centro: [cx, cy], radio: [rx, ry] }: (typeof DRACULA_ARMADO.ojos)[number]): string =>
    `<g data-parte="parpado-${n}" data-pivote="${cx} ${cy - ry * 1.6}" transform="scale(1 0)">` +
    `<ellipse cx="${cx}" cy="${cy - ry * 0.2}" rx="${rx * 1.12}" ry="${ry * 1.5}" class="bt-dracula-parpado"/>` +
    `<path d="M${f(cx - rx)} ${f(cy + ry * 0.4)} Q${cx} ${f(cy + ry * 1.5)} ${f(cx + rx)} ${f(cy + ry * 0.4)}" class="bt-dracula-pestana"/></g>`;
  const [o1, o2] = DRACULA_ARMADO.ojos;
  // El forro arranca plegado contra su bisagra: sin la isla, la capa está cerrada.
  const plegado = (n: 1 | 2): string => {
    const [hx] = DRACULA_ARMADO.hombros[n - 1];
    return `<g data-parte="forro-${n}" data-bisagra="${hx}" transform="translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)">${imagen(`dracula-forro-${n}`)}</g>`;
  };
  return (
    `<g data-titere="dracula">` +
    parte('capa-atras', imagen('dracula-capa-atras')) +
    parte('pierna-1', imagen('dracula-pierna-1')) +
    parte('pierna-2', imagen('dracula-pierna-2')) +
    parte('cuerpo', imagen('dracula-cuerpo')) +
    parte('cabeza', imagen('dracula-boca') + parte('mandibula', imagen('dracula-mandibula')) + imagen('dracula-cabeza') + parpadoDeTinta(1, o1) + parpadoDeTinta(2, o2)) +
    plegado(1) +
    plegado(2) +
    `<g data-parte="capa-1" data-bisagra="${DRACULA_ARMADO.hombros[0][0]}">${imagen('dracula-capa-1')}</g>` +
    `<g data-parte="capa-2" data-bisagra="${DRACULA_ARMADO.hombros[1][0]}">${imagen('dracula-capa-2')}</g>` +
    parte('mano', imagen('dracula-mano')) +
    parte('pelo', imagen('dracula-pelo')) +
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
  // Pierre no es de tapa, pero tiene títere: la ficha lo muestra igual que la escena, sin el agua.
  'el-gordo-pierre': {
    piezas: ['pierre-cuerpo', 'pierre-cabeza', 'pierre-mandibula', 'pierre-brazo', 'pierre-antebrazo'],
    cuerpo: () => ['pierre-cuerpo', 'pierre-boca', 'pierre-mandibula', 'pierre-cabeza', 'pierre-brazo', 'pierre-antebrazo'].map(imagen).join(''),
  },
  // La drácula tampoco es de tapa: la ficha la muestra con la capa abierta, que es cuando se la ve entera.
  'la-dracula-con-tacones': {
    piezas: ['dracula-capa-atras', 'dracula-forro-1', 'dracula-forro-2', 'dracula-pierna-1', 'dracula-pierna-2'],
    cuerpo: () =>
      ['dracula-capa-atras', 'dracula-pierna-1', 'dracula-pierna-2', 'dracula-cuerpo', 'dracula-boca', 'dracula-mandibula', 'dracula-cabeza', 'dracula-forro-1', 'dracula-forro-2', 'dracula-pelo']
        .map(imagen)
        .join(''),
  },
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
