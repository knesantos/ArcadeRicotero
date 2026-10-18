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
import { ATILA_ARMADO, BARBAZUL_ARMADO, DRACULA_ARMADO, LIMON_ARMADO, PIERRE_ARMADO, VACA_ARMADO } from './rig.ts';

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
 * La drácula con tacones (`D-73`, octava vuelta): no es de tapa, está tallada en la estética de
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
 * Limón (`D-73`, decimocuarta vuelta): no es de tapa, está pintado a crayón en la estética del baldío
 * (`arte-baldio.ts`) y recortado en piezas. Cada pierna y cada brazo cuelga de su cadera o su
 * hombro: la pieza está dibujada desde ahí, así que la isla la gira sobre el (0, 0) de su grupo.
 * La hoja gira en el cabito y la boca jadea, achicándose de arriba para abajo. Las pupilas no se
 * imprimen: son dos puntos de tinta que la isla corre, para que mire para atrás mientras corre.
 */
export function limon(): string {
  const A = LIMON_ARMADO;
  const colgado = (nombre: string, pieza: string, [x, y]: readonly [number, number]): string =>
    `<g transform="translate(${x} ${y})"><g data-parte="${nombre}">${imagen(pieza)}</g></g>`;
  const [boX, boY] = A.boca;
  const ojos = A.ojos
    .map(
      ({ centro: [cx, cy], radio: [rx, ry] }, i) =>
        `<circle data-parte="pupila-${i + 1}" cx="${cx + 2}" cy="${cy + 1}" r="${(rx * 0.42).toFixed(1)}" class="bt-limon-pupila"/>` +
        `<ellipse data-parte="parpado-${i + 1}" data-pivote="${cx} ${cy - ry}" cx="${cx}" cy="${cy}" rx="${rx + 1}" ry="${ry + 1}" class="bt-limon-parpado" transform="scale(1 0)"/>`,
    )
    .join('');
  return (
    `<g data-titere="limon">` +
    colgado('brazo-2', 'limon-brazo-atras', A.hombros[0]) +
    colgado('pierna-2', 'limon-pierna-atras', A.caderas[0]) +
    `<g data-parte="fruta">` +
    `<g data-parte="hoja">${imagen('limon-hoja')}</g>` +
    imagen('limon-fruta') +
    `<g data-parte="boca" data-pivote="${boX} ${boY - 5}">${imagen('limon-boca')}</g>` +
    ojos +
    `</g>` +
    colgado('pierna-1', 'limon-pierna', A.caderas[1]) +
    colgado('brazo-1', 'limon-brazo', A.hombros[1]) +
    `</g>`
  );
}

/**
 * Barbazul (`D-73`, undécima vuelta): tallado como el barbudo de la contratapa de *Oktubre*
 * (`arte-barbazul.ts`), con la barba de otra plancha. La barba cuelga de la cabeza y se mece con
 * retraso; las pupilas no están impresas: son de la página, para que la isla las haga mirar a la
 * drácula cuando pasa. Cada brazo se dobla en el codo, y el manojo cuelga del puño de la derecha.
 */
export function barbazul(): string {
  const ojo = (n: 1 | 2): string => {
    const { centro: [cx, cy], radio: [rx, ry] } = BARBAZUL_ARMADO.ojos[n - 1];
    return (
      `<g data-parte="pupila-${n}"><circle cx="${cx}" cy="${cy}" r="${f(ry * 0.86)}" class="bt-barbazul-pupila"/><circle cx="${f(cx + 1.4)}" cy="${f(cy - 1.4)}" r="1.1" class="bt-barbazul-brillo"/></g>` +
      `<g data-parte="parpado-${n}" data-pivote="${cx} ${f(cy - ry * 1.5)}" transform="scale(1 0)">` +
      `<ellipse cx="${cx}" cy="${f(cy - ry * 0.2)}" rx="${f(rx * 1.15)}" ry="${f(ry * 1.45)}" class="bt-barbazul-parpado"/>` +
      `<path d="M${f(cx - rx)} ${f(cy + ry * 0.4)} Q${cx} ${f(cy + ry * 1.4)} ${f(cx + rx)} ${f(cy + ry * 0.4)}" class="bt-barbazul-pestana"/></g>`
    );
  };
  return (
    `<g data-titere="barbazul">` +
    parte('cuerpo', imagen('barbazul-levita')) +
    parte('cabeza', imagen('barbazul-cabeza') + ojo(1) + ojo(2) + parte('barba', imagen('barbazul-barba'))) +
    parte('brazo-1', imagen('barbazul-brazo-1') + parte('antebrazo-1', imagen('barbazul-antebrazo-1'))) +
    parte('brazo-2', imagen('barbazul-brazo-2') + parte('antebrazo-2', imagen('barbazul-antebrazo-2') + parte('llaves', imagen('barbazul-llaves')))) +
    `</g>`
  );
}

/**
 * El negro Atila (`D-73`, duodécima vuelta): no es de tapa, está pintado a aerógrafo en la estética
 * de *Lobo suelto* (`arte-atila.ts`). Va de atrás para adelante: las piernas, la espalda del gabán
 * con el torso flaco, la cabeza (con los iris que miran de reojo y los párpados), el forro plegado
 * contra cada bisagra, las dos hojas del gabán, el cuello levantado con la bufanda —la cabeza se
 * hunde detrás— y las manos que lo tienen cerrado.
 */
export function atila(conIds = true): string {
  const A = ATILA_ARMADO;
  const ojo = (n: 1 | 2): string => {
    const { centro: [cx, cy], radio: [rx, ry] } = A.ojos[n - 1];
    const iris = `<g data-parte="iris-${n}" transform="translate(${cx} ${cy})">${imagen(`atila-iris-${n}`)}</g>`;
    const parpado =
      `<g data-parte="parpado-${n}" data-pivote="${cx} ${f(cy - ry)}" transform="scale(1 0)">` +
      `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx * 1.12)}" ry="${f(ry * 1.08)}" class="bt-atila-parpado${n === 2 ? '-oscuro' : ''}"/>` +
      `<path d="M${f(cx - rx)} ${f(cy + ry * 0.5)} Q${cx} ${f(cy + ry * 1.25)} ${f(cx + rx)} ${f(cy + ry * 0.5)}" class="bt-atila-pestana"/></g>`;
    // El iris no se sale del blanco: va recortado por el ojo (en la escena; el retrato no lo necesita).
    return conIds ? `<clipPath id="atila-ojo-${n}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath><g clip-path="url(#atila-ojo-${n})">${iris}</g>${parpado}` : iris;
  };
  // El forro arranca plegado contra su bisagra: sin la isla, el gabán está cerrado.
  const plegado = (n: 1 | 2, dentro = ''): string => {
    const [hx] = A.bisagras[n - 1];
    return `<g data-parte="forro-${n}" data-bisagra="${hx}" transform="translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)">${imagen(`atila-forro-${n}`)}${dentro}</g>`;
  };
  const [sx, sy] = A.sirena;
  const [bx, by] = A.brillo;
  return (
    `<g data-titere="atila">` +
    parte('pierna-1', imagen('atila-pierna-1')) +
    parte('pierna-2', imagen('atila-pierna-2')) +
    parte('cuerpo', imagen('atila-cuerpo')) +
    parte('cabeza', imagen('atila-cabeza') + ojo(1) + ojo(2)) +
    plegado(1, `<g data-parte="sirena-luz" opacity="0" transform="translate(${sx} ${sy})">${imagen('atila-sirena-chica')}</g>`) +
    plegado(2) +
    `<g data-parte="hoja-1" data-bisagra="${A.bisagras[0][0]}">${imagen('atila-hoja-1')}</g>` +
    `<g data-parte="hoja-2" data-bisagra="${A.bisagras[1][0]}">${imagen('atila-hoja-2')}` +
    `<g data-parte="brillo" opacity="0" transform="translate(${bx} ${by})">${imagen('atila-brillo')}</g></g>` +
    parte('cuello', imagen('atila-cuello')) +
    parte('manos', imagen('atila-manos')) +
    `</g>`
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
  // La drácula tampoco es de tapa: la ficha la muestra con la capa abierta, que es cuando se la ve entera.
  'la-dracula-con-tacones': {
    piezas: ['dracula-capa-atras', 'dracula-forro-1', 'dracula-forro-2', 'dracula-pierna-1', 'dracula-pierna-2'],
    cuerpo: () =>
      ['dracula-capa-atras', 'dracula-pierna-1', 'dracula-pierna-2', 'dracula-cuerpo', 'dracula-boca', 'dracula-mandibula', 'dracula-cabeza', 'dracula-forro-1', 'dracula-forro-2', 'dracula-pelo']
        .map(imagen)
        .join(''),
  },
  // Barbazul tampoco es de tapa: la ficha lo muestra de cuerpo entero, con el manojo en la mano.
  barbazul: {
    piezas: ['barbazul-levita', 'barbazul-cabeza', 'barbazul-antebrazo-1', 'barbazul-antebrazo-2', 'barbazul-llaves'],
    cuerpo: () =>
      ['barbazul-levita', 'barbazul-cabeza', 'barbazul-barba', 'barbazul-brazo-1', 'barbazul-antebrazo-1', 'barbazul-brazo-2', 'barbazul-antebrazo-2', 'barbazul-llaves']
        .map(imagen)
        .join('') +
      // Sin las pupilas de la página, los ojos quedarían en blanco: van fijas, mirando a quien lee.
      BARBAZUL_ARMADO.ojos.map(({ centro: [cx, cy], radio: [, ry] }) => `<circle cx="${cx}" cy="${cy}" r="${f(ry * 0.86)}" class="bt-barbazul-pupila"/>`).join(''),
  },
  // El Atila tampoco es de tapa: la ficha lo muestra con el gabán abierto, con todo lo que se llevó.
  'el-negro-atila': {
    piezas: ['atila-forro-1', 'atila-forro-2', 'atila-cabeza', 'atila-pierna-1', 'atila-pierna-2'],
    cuerpo: () => {
      const iris = ([cx, cy]: readonly [number, number], n: 1 | 2): string => `<g transform="translate(${cx + 3} ${cy})">${imagen(`atila-iris-${n}`)}</g>`;
      return (
        ['atila-pierna-1', 'atila-pierna-2', 'atila-cuerpo', 'atila-cabeza'].map(imagen).join('') +
        iris(ATILA_ARMADO.ojos[0].centro, 1) + iris(ATILA_ARMADO.ojos[1].centro, 2) +
        ['atila-forro-1', 'atila-forro-2', 'atila-cuello'].map(imagen).join('')
      );
    },
  },
  // Limón tampoco es de tapa. Sus piernas y brazos están dibujados desde la cadera y el hombro, así
  // que la caja no sale de las piezas: es la del títere entero, de la hoja a las zapatillas.
  limon: { piezas: ['limon-fruta'], cuerpo: limon, caja: [-62, -114, 114, 118] },
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
