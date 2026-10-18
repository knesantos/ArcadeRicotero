/**
 * La Mariposa Pontiac (`D-73`, decimoquinta vuelta), en la ruta del último bondi.
 *
 * *Mariposa Pontiac / Rock del país* es la pista 10 de *Luzbelito* (1996), y la mariposa no está en
 * ninguna tapa: se inventa en la de su disco (`T-440`). Esa tapa son cosas de verdad fotografiadas:
 * el papel marmolado verde, el óvalo de cobre oxidado y, adentro, en lo negro, un busto de yeso con
 * una vela en la cabeza; el interior es la tierra roja con huevos de plata bajo el cielo violeta, y
 * el CD es una llama corrida. La Mariposa Pontiac está hecha de eso:
 *
 * - **Es un Pontiac de los grandes, de cola larga** (el fastback de los cincuenta, con el faldón
 *   sobre la rueda de atrás y las rayas de cromo en el capó), pintado a aerógrafo como los otros
 *   fierros: la chapa es la tierra roja del interior y el cromo es la plata de los huevos. De costado
 *   refleja lo que tiene alrededor, como en el aerógrafo de autos: arriba el cielo violeta, abajo lo
 *   oscuro, y entre los dos la raya del horizonte.
 * - **Es una polilla de noche, de las de cola larga**, y las alas están recortadas del mármol de la
 *   tapa de verdad (`href="tapa:luzbelito-frontal"`, que la imprenta mete adentro): es el collage de
 *   Rocambole, y es el verde de una polilla luna. El borde de adelante del ala es pardo vino, como en
 *   esas polillas.
 * - **Los ocelos son el óvalo de cobre de la tapa**, recortado también de la tapa, y adentro, en
 *   lugar del busto, un ojo humano modelado en el mismo yeso. Los del ala del otro lado están vacíos:
 *   son el óvalo de la contratapa, que no tiene a nadie adentro.
 * - **En la punta del capó, donde los Pontiac llevaban una cabeza que se prendía de noche, lleva el
 *   busto de la tapa con su vela**, y la llama se corre para atrás con el viento, como la del CD.
 *
 * La luz es la de la ruta: la luna arriba a la derecha, que le pega en el capó, el techo y el filo de
 * las alas, y los faros, que van adelante. Lo demás es noche.
 *
 * El títere va adentro del fierro (`fierro`), con el (0, 0) donde las ruedas tocan el carril, como la
 * imagen vieja `ruta-pontiac`, que se sigue imprimiendo en `arte-entornos.ts` (el test de los fierros
 * la busca). Lo imprime `scripts/imprimir-bestiario.mjs`.
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { ASUSTADA, PONTIAC_ARMADO, QUIETA, transformaciones, type Pose } from './rig-pontiac.ts';

type P = readonly [number, number];

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const A = PONTIAC_ARMADO;

/** Las tintas de *Luzbelito* (`tokens.css`, bloque de la Mariposa Pontiac). */
const K = {
  chapa: 'var(--bestia-pontiac-chapa)',
  chapaViva: 'var(--bestia-pontiac-chapa-viva)',
  chapaHonda: 'var(--bestia-pontiac-chapa-honda)',
  cielo: 'var(--bestia-pontiac-cielo)',
  nube: 'var(--bestia-pontiac-nube)',
  cromoHondo: 'var(--bestia-pontiac-cromo-hondo)',
  cromo: 'var(--bestia-pontiac-cromo)',
  cromoClaro: 'var(--bestia-pontiac-cromo-claro)',
  brillo: 'var(--bestia-pontiac-brillo)',
  marmol: 'var(--entorno-arbol-marmol)',
  marmolHondo: 'var(--entorno-arbol-marmol-hondo)',
  marmolClaro: 'var(--entorno-arbol-marmol-claro)',
  veta: 'var(--bestia-pontiac-veta)',
  cobreHondo: 'var(--bestia-pontiac-cobre-hondo)',
  cobre: 'var(--bestia-pontiac-cobre)',
  cobreClaro: 'var(--bestia-pontiac-cobre-claro)',
  yeso: 'var(--bestia-pontiac-yeso)',
  yesoMedio: 'var(--bestia-pontiac-yeso-medio)',
  yesoHondo: 'var(--bestia-pontiac-yeso-hondo)',
  llama: 'var(--bestia-pontiac-llama)',
  llamaClara: 'var(--bestia-pontiac-llama-clara)',
  negro: 'var(--fondo)',
  rojo: 'var(--marca-rojo)',
};

/* ------------------------------------------------------------------
   Herramientas
   ------------------------------------------------------------------ */

/** Una curva suave que pasa por todos los puntos (Catmull-Rom llevada a Bézier). */
function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

const elipse = (cx: number, cy: number, rx: number, ry: number): string =>
  `M${f(cx - rx)} ${f(cy)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const circulo = (cx: number, cy: number, r: number): string => elipse(cx, cy, r, r);
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;
/**
 * La orilla soplada por dentro de la máscara: el borde queda duro y oscuro, y el soplo se abre hacia
 * el medio. Es lo que le da volumen a una pieza plana.
 */
const orilla = (d: string, ancho: number, o: number, color = 'var(--fondo)'): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}" filter="url(#soplo-s)" opacity="${o}"/>`;
const mover = (pts: readonly P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy] as const);

/**
 * Un pedazo de la tapa de verdad (953 × 953): el píxel (px, py) cae en (x, y), a `e` unidades por
 * píxel, con el ancho de la tapa apuntando para `giro`. La imprenta cambia `tapa:` por la imagen.
 */
const deLaTapa = (x: number, y: number, px: number, py: number, e: number, giro = 0): string =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(giro)}) scale(${e})"><image href="tapa:luzbelito-frontal" x="${-px}" y="${-py}" width="953" height="953" preserveAspectRatio="none"/></g>`;

/** El óvalo de cobre de la tapa: centro (508, 472), radio de afuera (123, 197), de adentro (93, 170). */
const OVALO = { centro: [508, 472] as P, afuera: [123, 197] as P, adentro: [93, 170] as P };

/* ------------------------------------------------------------------
   Las alas: el mármol de la tapa, con los ocelos de cobre
   ------------------------------------------------------------------
   Vistas de costado, paradas sobre el techo como las de una polilla quieta: la de adelante apunta
   para arriba y para adelante; la de atrás va sobre la cola del auto y termina en la cola larga.
*/

const ALA_ANTERIOR: readonly P[] = [
  [0, -94], [6, -108], [14, -128], [24, -152], [36, -174], [50, -190], [64, -198], [76, -198], [86, -192],
  [92, -180], [96, -162], [96, -142], [92, -124], [84, -110], [70, -101], [48, -96], [24, -94],
];
const ALA_POSTERIOR: readonly P[] = [
  [-2, -94], [-10, -112], [-24, -130], [-42, -144], [-62, -151], [-82, -150], [-98, -142], [-110, -128],
  [-115, -114], [-112, -104], [-96, -97], [-70, -94], [-40, -93], [-16, -93],
];
/** La cola: sale de abajo del ala de atrás y se va para atrás con el viento, con la punta en cuchara. */
const COLA: readonly P[] = [
  [-94, -119], [-110, -113], [-126, -106], [-140, -97], [-152, -90], [-163, -87], [-173, -88], [-181, -86],
  [-185, -79], [-181, -72], [-172, -72], [-163, -76], [-151, -80], [-137, -86], [-122, -93], [-108, -99], [-97, -105],
];

/** El mármol de la tapa es oscuro para una polilla luna: se aclara, sin perder las vetas. */
const ACLARA =
  `<filter id="m-pontiac-aclara" color-interpolation-filters="sRGB"><feComponentTransfer>` +
  `<feFuncR type="gamma" amplitude="1.3" exponent="0.72"/><feFuncG type="gamma" amplitude="1.38" exponent="0.7"/><feFuncB type="gamma" amplitude="1.2" exponent="0.78"/>` +
  `</feComponentTransfer></filter>`;
/** El mármol aclarado. El filtro (`ACLARA`) va una vez al principio de cada pieza que lo usa. */
const marmolClaro = (s: string): string => `<g filter="url(#m-pontiac-aclara)">${s}</g>`;

/** El ocelo: el óvalo de cobre recortado de la tapa, y adentro lo negro. */
function ocelo(id: string, [cx, cy]: P, [rx, ry]: P, apagado: boolean): string {
  const e = ry / OVALO.afuera[1];
  const [ix, iy] = [OVALO.adentro[0] * e, OVALO.adentro[1] * e];
  const aro = `${elipse(cx, cy, rx, ry)} ${elipse(cx, cy, ix, iy)}`;
  return (
    // La sombra que hace el aro sobre el ala: está apoyado, no pintado.
    nube(cx - 1.5, cy + 2, rx + 1, ry + 1, K.negro, 's', apagado ? 0.5 : 0.65) +
    `<clipPath id="${id}"><path d="${aro}" clip-rule="evenodd"/></clipPath>` +
    `<g clip-path="url(#${id})">` +
    deLaTapa(cx, cy, OVALO.centro[0], OVALO.centro[1], e) +
    // La luna le pega arriba a la derecha; abajo a la izquierda el cobre se hunde.
    nube(cx - rx * 0.6, cy + ry * 0.5, rx, ry * 0.7, K.negro, 'm', apagado ? 0.75 : 0.45) +
    (apagado ? forma(aro, K.cielo, 0.35) : nube(cx + rx * 0.5, cy - ry * 0.6, rx * 0.5, ry * 0.3, K.cobreClaro, 's', 0.35)) +
    `</g>` +
    forma(elipse(cx, cy, ix, iy), K.negro)
  );
}

/**
 * El ojo humano adentro del óvalo, modelado en el yeso del busto: la ceja, el párpado de abajo y el
 * blanco. El iris y el párpado de arriba no se imprimen acá: los mueve la isla.
 */
function ojo([cx, cy]: P, [a, b]: P): string {
  const blanco = `M${f(cx - a)} ${f(cy + 0.5)} C${f(cx - a * 0.45)} ${f(cy - b * 1.5)} ${f(cx + a * 0.45)} ${f(cy - b * 1.45)} ${f(cx + a)} ${f(cy - 0.4)} C${f(cx + a * 0.4)} ${f(cy + b * 1.25)} ${f(cx - a * 0.5)} ${f(cy + b * 1.3)} ${f(cx - a)} ${f(cy + 0.5)} Z`;
  return (
    // La cara alrededor del ojo, de yeso, hundida en lo negro como el busto en su óvalo: la luna le
    // da arriba a la derecha, en la ceja y en el pómulo, y lo demás se va a lo hondo.
    nube(cx, cy + 1, a + 2.4, b + 8, K.yesoMedio, 's', 0.92) +
    nube(cx - 3.5, cy + 5, a * 0.9, b + 3, K.yesoHondo, 's', 0.85) +
    nube(cx + 2.5, cy - b - 3.2, a * 0.85, 2.8, K.yeso, 's', 0.95) +
    nube(cx + 3, cy + b + 3, a * 0.6, 1.8, K.yeso, 'xs', 0.6) +
    // La cuenca, honda arriba del ojo: ahí apoya el párpado.
    nube(cx - 0.5, cy - b * 0.95, a * 1.05, 2, K.cobreHondo, 'xs', 0.95) +
    enmascarado(`${blancoId(cx)}`, blanco,
      forma(blanco, K.brillo) +
      nube(cx - a * 0.8, cy, a * 0.4, b, K.yesoMedio, 's', 0.8) +
      nube(cx + a * 0.85, cy, a * 0.35, b, K.yesoMedio, 's', 0.7) +
      nube(cx, cy - b * 0.9, a, b * 0.5, K.yesoHondo, 'xs', 0.55)) +
    trazo(`M${f(cx - a)} ${f(cy + 0.5)} C${f(cx - a * 0.45)} ${f(cy - b * 1.5)} ${f(cx + a * 0.45)} ${f(cy - b * 1.45)} ${f(cx + a)} ${f(cy - 0.4)}`, K.negro, 0.9, 0.8) +
    trazo(`M${f(cx + a)} ${f(cy - 0.4)} C${f(cx + a * 0.4)} ${f(cy + b * 1.25)} ${f(cx - a * 0.5)} ${f(cy + b * 1.3)} ${f(cx - a)} ${f(cy + 0.5)}`, K.yesoHondo, 0.7, 0.8) +
    // La carúncula, en el rincón de adentro.
    nube(cx - a + 1.4, cy + 0.6, 1.1, 0.9, K.chapaViva, 'xs', 0.8)
  );
}
const blancoId = (cx: number): string => `m-pontiac-blanco-${cx < 0 ? 'p' : 'a'}`;

/** Las nervaduras: del lomo para afuera, claras, como las de una polilla luna. */
function nervaduras(raiz: P, puntas: readonly P[], o: number): string {
  return puntas
    .map(([x, y]) => trazo(`M${f(raiz[0])} ${f(raiz[1])} Q${f((raiz[0] + x) / 2 + (y - raiz[1]) * 0.08)} ${f((raiz[1] + y) / 2 - (x - raiz[0]) * 0.08)} ${f(x)} ${f(y)}`, K.veta, 0.9, o))
    .join('');
}

/** El ala de adelante, la de este lado: con el ojo que mira desde el cobre. */
function alaAnterior(): string {
  const d = curva(ALA_ANTERIOR);
  const [ox, oy] = A.ojos[0].centro;
  const adentro =
    marmolClaro(deLaTapa(0, -94, 160, 800, 0.36, -56)) +
    // El volumen: la luna arriba a la derecha, el lomo en sombra, y la noche en el borde de abajo.
    orilla(d, 9, 0.5) +
    nube(78, -176, 30, 26, K.nube, 'l', 0.22) +
    nube(4, -100, 34, 20, K.negro, 'l', 0.8) +
    nube(60, -100, 50, 10, K.negro, 'm', 0.45) +
    nervaduras([3, -96], [[60, -194], [82, -190], [94, -170], [96, -148], [90, -126], [76, -106], [52, -98]], 0.4) +
    // El borde de adelante, pardo vino como el de una polilla luna, con la luna en el filo.
    soplo('M0 -96 L8 -112 L16 -134 L28 -160 L42 -182 L58 -196 L70 -200 L64 -192 L50 -180 L36 -158 L24 -132 L14 -108 Z', K.chapa, 's', 0.95) +
    trazo('M4 -104 Q16 -142 40 -180 Q54 -196 74 -199', K.nube, 1.2, 0.6) +
    // El borde de afuera, pálido, como el de las polillas luna.
    trazo('M78 -197 Q94 -186 96 -160 Q97 -136 86 -114 Q76 -102 56 -97', K.veta, 2.2, 0.6) +
    trazo('M78 -197 Q94 -186 96 -160 Q97 -136 86 -114', K.yeso, 0.7, 0.45) +
    // El pelo blanco del lomo, donde se agarra.
    nube(5, -97, 10, 6, K.yeso, 's', 0.6) +
    ocelo('m-pontiac-ocelo-a', [ox, oy], A.ovalos[0], false) +
    ojo([ox, oy], A.ojos[0].radio);
  return ACLARA + conGrano(enmascarado('m-pontiac-ala-a', d, adentro));
}

/** El ala de atrás, la de este lado: el otro ojo. La cola va aparte, colgada de ella. */
function alaPosterior(): string {
  const d = curva(ALA_POSTERIOR);
  const [ox, oy] = A.ojos[1].centro;
  const adentro =
    marmolClaro(deLaTapa(-2, -94, 560, 900, 0.36, 10)) +
    orilla(d, 9, 0.5) +
    nube(-40, -146, 50, 14, K.nube, 'l', 0.18) +
    nube(-6, -97, 30, 16, K.negro, 'l', 0.8) +
    nube(-60, -95, 60, 7, K.negro, 'm', 0.55) +
    nervaduras([-3, -95], [[-40, -144], [-66, -151], [-90, -148], [-106, -134], [-114, -116], [-104, -101]], 0.38) +
    trazo('M-8 -110 Q-30 -138 -62 -150 Q-84 -152 -100 -140', K.nube, 1, 0.45) +
    trazo('M-100 -140 Q-114 -126 -114 -110 Q-112 -102 -100 -98', K.veta, 2, 0.55) +
    nube(-5, -97, 9, 6, K.yeso, 's', 0.55) +
    ocelo('m-pontiac-ocelo-p', [ox, oy], A.ovalos[1], false) +
    ojo([ox, oy], A.ojos[1].radio);
  return ACLARA + conGrano(enmascarado('m-pontiac-ala-p', d, adentro));
}

/** La cola larga del ala de atrás: se tuerce, y hacia la punta se pone vino. */
function cola(): string {
  const d = curva(COLA);
  const adentro =
    marmolClaro(deLaTapa(-106, -106, 660, 880, 0.36, -21)) +
    orilla(d, 5, 0.45) +
    nube(-176, -77, 14, 10, K.chapa, 'm', 0.9) +
    nube(-182, -76, 5, 4, K.chapaViva, 's', 0.6) +
    // Donde se tuerce: la mitad de la cola da la espalda a la luna.
    nube(-150, -82, 9, 6, K.negro, 's', 0.5) +
    trazo('M-104 -108 Q-140 -86 -180 -77', K.veta, 0.9, 0.5) +
    trazo('M-102 -113 Q-136 -96 -170 -84', K.nube, 0.9, 0.45) +
    nube(-104, -106, 12, 9, K.negro, 'm', 0.75);
  return ACLARA + conGrano(enmascarado('m-pontiac-cola', d, adentro));
}

/**
 * Las dos alas del otro lado: más en sombra, teñidas del violeta de la noche, con la luna apenas en
 * el filo. Sus óvalos están vacíos: son el espejo de la contratapa, sin nadie adentro. Su cola no se
 * ve: queda detrás de la de este lado.
 */
const ANTERIOR_LEJOS = mover(ALA_ANTERIOR, -6, -2);
const POSTERIOR_LEJOS = mover(ALA_POSTERIOR, -3, -2);
function alasLejos(): string {
  const una = (d: string, id: string, tapa: string, filo: string, ocelos: string): string =>
    enmascarado(id, d, tapa + forma(d, K.negro, 0.3) + forma(d, K.cielo, 0.2) + orilla(d, 10, 0.55) + nube(0, -100, 44, 18, K.negro, 'l', 0.7) + trazo(filo, K.nube, 1.4, 0.35) + ocelos);
  const [o1, o2] = A.ojos;
  return ACLARA + conGrano(
    una(curva(POSTERIOR_LEJOS), 'm-pontiac-ala-pl', marmolClaro(deLaTapa(-5, -96, 520, 860, 0.36, 10)), 'M-12 -114 Q-34 -142 -66 -153 Q-88 -154 -102 -144',
      ocelo('m-pontiac-ocelo-pl', [o2.centro[0] - 3, o2.centro[1] - 2], A.ovalos[1], true)) +
      una(curva(ANTERIOR_LEJOS), 'm-pontiac-ala-al', marmolClaro(deLaTapa(-6, -96, 330, 760, 0.36, -56)), 'M-2 -108 Q10 -144 34 -182 Q48 -198 70 -201',
        ocelo('m-pontiac-ocelo-al', [o1.centro[0] - 6, o1.centro[1] - 2], A.ovalos[0], true)),
  );
}

/** Una antena de polilla, emplumada, con la base en (0, 0): sale para arriba y se tira para adelante. */
function antena(): string {
  const [p0, p1, p2, p3]: P[] = [[0, 0], [4, -15], [15, -31], [37, -39]];
  const en = (t: number): P => {
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  };
  let plumas = '';
  const borde: P[] = [];
  const otro: P[] = [];
  for (let i = 1; i < 34; i++) {
    const t = i / 34;
    const [x, y] = en(t);
    const [x2, y2] = en(t + 0.01);
    const l = Math.hypot(x2 - x, y2 - y);
    const [tx, ty] = [(x2 - x) / l, (y2 - y) / l];
    const w = 3.6 * Math.sin(Math.PI * Math.min(1, t * 1.12)) ** 0.8;
    // Las barbas, peinadas para adelante, de los dos lados del eje.
    const [ax, ay] = [x - ty * w + tx * w * 0.6, y + tx * w + ty * w * 0.6];
    const [bx, by] = [x + ty * w + tx * w * 0.6, y - tx * w + ty * w * 0.6];
    plumas += trazo(`M${f(x)} ${f(y)} L${f(ax)} ${f(ay)} M${f(x)} ${f(y)} L${f(bx)} ${f(by)}`, i % 2 ? K.cobreHondo : K.yesoHondo, 0.45, 0.85);
    borde.push([ax, ay]);
    otro.push([bx, by]);
  }
  const pluma = curva([[0, 0], ...borde, p3, ...otro.reverse()]);
  const eje = `M0 0 C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
  return conGrano(
    soplo(pluma, K.cobreHondo, 'xs', 0.4) +
      plumas +
      // La luna, en el lomo de la antena.
      `<g transform="translate(0.5 -1)">${trazo(eje, K.cobreClaro, 0.6, 0.5)}</g>` +
      trazo(eje, K.yesoHondo, 1.1) +
      nube(0, 0, 3, 2.4, K.yeso, 'xs', 0.6),
  );
}

/* ------------------------------------------------------------------
   El auto: un Pontiac de cola larga, de los cincuenta
   ------------------------------------------------------------------ */

const CHAPA =
  'M-118 -16 L-120 -26 Q-122 -36 -114 -42 C-100 -58 -76 -78 -50 -88 C-36 -93 -16 -95 4 -94 Q12 -93 16 -90 ' +
  'L38 -66 Q42 -63 50 -63 C70 -62 88 -60 98 -57 Q108 -54 111 -46 Q114 -38 112 -28 L110 -16 L90 -16 ' +
  'A20 20 0 0 0 50 -16 Z';
/** La raya del horizonte reflejada en el costado: arriba el cielo, abajo lo oscuro. */
const CIELO_REFLEJADO = 'M-130 -40 C-60 -46 20 -46 130 -44 L130 -110 L-130 -110 Z';
const SUELO_REFLEJADO = 'M-130 -40 C-60 -46 20 -46 130 -44 L130 0 L-130 0 Z';
const VENTANA_1 = 'M33 -66 L15 -87 Q12 -90 7 -90 L-9 -90 L-9 -66 Z';
const VENTANA_2 = 'M-14 -66 L-14 -90 L-30 -89 Q-44 -87 -54 -79 Q-61 -73 -58 -67 Z';
const FALDON = 'M-92 -18 L-92 -26 Q-90 -36 -66 -37 Q-42 -36 -40 -26 L-40 -18 Z';

function cuerpo(): string {
  const vidrio = (d: string, id: string): string =>
    enmascarado(id, d, forma(d, K.chapaHonda) + forma(d, K.negro, 0.35) + soplo('M40 -94 L50 -94 L-20 -60 L-30 -60 Z', K.cielo, 's', 0.55) + soplo('M-30 -94 L-24 -94 L-70 -60 L-76 -60 Z', K.cielo, 's', 0.35) + nube(10, -88, 30, 4, K.cielo, 's', 0.5)) +
    `<path d="${d}" fill="none" stroke="${K.cromo}" stroke-width="1.1" opacity="0.9"/>`;
  const chapa =
    forma(CHAPA, K.chapa) +
    orilla(CHAPA, 10, 0.55) +
    // Lo de abajo, en la sombra del propio auto: la noche sube por el costado hasta la lanza.
    nube(0, -24, 140, 15, K.chapaHonda, 'l', 0.95) +
    nube(0, -17, 130, 6, K.negro, 'm', 0.6) +
    // El hombro: la chapa dobla debajo de las ventanas y agarra la luna.
    soplo('M40 -62 C0 -63.5 -50 -63 -106 -47 L-106 -43 C-50 -58.5 0 -59 40 -57.5 Z', K.cielo, 's', 0.85) +
    trazo('M38 -61 C0 -62.4 -50 -62 -104 -46.6', K.brillo, 0.6, 0.4) +
    // El costado refleja, como en el aerógrafo de autos: arriba de la raya, el cielo violeta y la
    // nube clara; abajo, pegado a la raya, lo oscuro de la tierra.
    enmascarado('m-pontiac-cielo', CIELO_REFLEJADO,
      nube(0, -54, 130, 9, K.cielo, 'm', 0.85) +
      nube(10, -46.5, 124, 2.6, K.nube, 's', 0.75) +
      nube(60, -47, 40, 1.4, K.brillo, 'xs', 0.55)) +
    enmascarado('m-pontiac-suelo', SUELO_REFLEJADO, nube(0, -38, 130, 4, K.negro, 's', 0.55) + nube(-20, -30, 90, 6, K.chapaHonda, 'm', 0.7)) +
    // El guardabarros de adelante, redondo y lustrado.
    soplo('M84 -58.6 Q104 -56 110.6 -46 L108.6 -45 Q102 -53.4 84 -55.6 Z', K.brillo, 'xs', 0.45) +
    // La luna en lo que mira para arriba: el capó, el techo, el lomo de la cola.
    nube(72, -59.5, 30, 3, K.cielo, 's', 0.95) +
    nube(84, -58, 14, 1.5, K.brillo, 'xs', 0.55) +
    nube(-8, -92.5, 22, 2.4, K.cromoClaro, 's', 0.75) +
    soplo('M-112 -44 C-98 -60 -74 -80 -50 -89 C-36 -94 -20 -95 -4 -94 L-4 -91 C-22 -92 -38 -90 -52 -85 C-74 -76 -96 -58 -108 -44 Z', K.cielo, 's', 0.8) +
    trazo('M-108 -46 C-94 -62 -72 -80 -50 -88', K.brillo, 0.8, 0.35) +
    // La trompa redonda, y la cola, que da la espalda a la luna.
    nube(103, -45, 9, 10, K.chapaViva, 'm', 0.65) +
    nube(-112, -32, 14, 20, K.chapaHonda, 'm', 0.85) +
    // Los guardabarros: el de atrás abulta y tiene su faldón.
    soplo('M-12 -58 C-40 -58 -80 -50 -112 -36', K.chapaViva, 'xs', 0.4) +
    trazo('M-12 -58 C-40 -58 -80 -50 -112 -36', K.cielo, 0.9, 0.35) +
    forma(FALDON, K.chapaHonda, 0.55) +
    trazo('M-92 -19 L-92 -26 Q-90 -36 -66 -37 Q-42 -36 -40 -26 L-40 -19', K.cromoHondo, 1, 0.8) +
    // Las puertas y las manijas.
    trazo('M36 -63 L36 -20 M-12 -66 L-12 -20', K.negro, 0.8, 0.75) +
    trazo('M30 -55 L24 -55 M-16 -55 L-22 -55', K.cromoClaro, 1.4) +
    // La lanza de cromo del costado, de punta a punta.
    trazo('M104 -40 C60 -42 -40 -41 -110 -35', K.cromoHondo, 2.8) +
    trazo('M104 -40.6 C60 -42.6 -40 -41.6 -110 -35.6', K.cromo, 1.6) +
    trazo('M92 -41.4 C60 -43 0 -42.6 -40 -41.4', K.brillo, 0.6, 0.7) +
    // Las rayas de plata del capó, que bajan hasta la trompa.
    trazo('M42 -64.4 C62 -63.4 84 -61 100 -57', K.cromoClaro, 1.2, 0.9) +
    trazo('M50 -65.2 C66 -64 84 -62 96 -59', K.brillo, 0.6, 0.6) +
    // El zócalo.
    trazo('M86 -17.5 L54 -17.5 M46 -17.5 L-116 -17.5', K.cromoHondo, 1.2, 0.8);
  return conGrano(
    enmascarado('m-pontiac-chapa', CHAPA, chapa) +
      vidrio(VENTANA_1, 'm-pontiac-v1') +
      vidrio(VENTANA_2, 'm-pontiac-v2') +
      // Los paragolpes: plata con la noche adentro.
      forma('M100 -14 L118 -15 Q123 -22 119 -31 L104 -31 Q108 -24 100 -14 Z', K.cromo) +
      trazo('M106 -29 Q118 -28 120 -24', K.brillo, 0.9, 0.7) +
      nube(112, -18, 8, 3, K.cromoHondo, 's', 0.8) +
      forma('M-110 -14 L-124 -15 Q-128 -21 -125 -29 L-114 -29 Q-116 -22 -110 -14 Z', K.cromo) +
      trazo('M-118 -27 Q-125 -26 -126 -21', K.cromoClaro, 0.8, 0.7) +
      // La parrilla, detrás del paragolpes.
      [0, 1, 2, 3].map((i) => trazo(`M${108 + i * 1.5} -32 L${109 + i * 1.6} -21`, K.cromoClaro, 0.8, 0.85)).join('') +
      // El faro: el aro de cromo y la luz.
      forma(circulo(A.faro[0] - 2, A.faro[1], 5.6), K.cromo) +
      forma(circulo(A.faro[0] - 1.6, A.faro[1], 4.2), K.llamaClara) +
      nube(A.faro[0] - 1, A.faro[1], 3, 3, K.brillo, 'xs') +
      nube(A.faro[0], A.faro[1], 9, 8, K.llamaClara, 'm', 0.45) +
      // La luz de atrás.
      forma('M-119 -42 L-115 -44 L-114 -35 L-118 -34 Z', K.rojo) +
      nube(-118, -39, 6, 6, K.rojo, 's', 0.55) +
      busto(),
  );
}

/**
 * El busto de la tapa en la punta del capó, de perfil, mirando para arriba como en el óvalo, con la
 * barba en punta y la vela en la cabeza: donde los Pontiac llevaban su cabeza de cromo que se
 * prendía de noche. El pabilo es `PONTIAC_ARMADO.llama`; la llama la mueve la isla.
 */
function busto(): string {
  const [lx, ly] = A.llama;
  const cabeza = 'M86 -72 Q85.6 -76.2 89 -76.6 Q92 -76.6 92.6 -74 L94 -72.6 L92.8 -72 L93.2 -70.8 L92.2 -70.4 L93.4 -68.2 L90.4 -69.2 Q87.4 -68.8 86.4 -70.2 Z';
  return (
    forma('M83.6 -58.8 L94.4 -60 L94.2 -61.8 L84 -60.8 Z', K.cromo) +
    trazo('M84 -60.6 L94.2 -61.6', K.brillo, 0.5, 0.7) +
    enmascarado('m-pontiac-pecho', 'M83 -61 Q83.4 -66 86.6 -67.4 L91.6 -67.6 Q94.8 -66.2 95 -61.4 Z',
      forma('M83 -61 Q83.4 -66 86.6 -67.4 L91.6 -67.6 Q94.8 -66.2 95 -61.4 Z', K.yesoMedio) +
      nube(93.4, -64.4, 2.6, 3, K.yeso, 'xs', 0.95) +
      nube(84.4, -62.6, 2.4, 3, K.yesoHondo, 'xs', 0.9)) +
    forma('M87.6 -67.4 L90.6 -67.6 L90.4 -69.6 L87.8 -69.4 Z', K.yesoHondo) +
    enmascarado('m-pontiac-cabeza', cabeza,
      forma(cabeza, K.yesoMedio) +
      nube(91.6, -74.4, 2.2, 2.2, K.yeso, 'xs') +
      nube(86.6, -71.4, 1.8, 2.6, K.yesoHondo, 'xs', 0.9) +
      nube(91, -73.2, 0.9, 0.7, K.cobreHondo, 'xs', 0.9)) +
    // La vela, derecha sobre la cabeza, con la cera que le corre.
    forma(`M${lx - 0.9} -76.4 L${lx + 0.9} -76.4 L${lx + 0.9} ${ly + 0.4} L${lx - 0.9} ${ly + 0.4} Z`, K.brillo) +
    trazo(`M${lx + 0.9} -79 l0.3 2`, K.yeso, 0.5, 0.8) +
    nube(lx, ly + 2, 4, 4, K.llamaClara, 's', 0.3)
  );
}

/** Lo que está detrás de las ruedas: el hueco del guardabarros y el bajo, en lo negro. */
function chasis(): string {
  return (
    forma(circulo(A.ruedas[0]![0], A.ruedas[0]![1], 20.5), K.negro) +
    forma(circulo(A.ruedas[1]![0], A.ruedas[1]![1], 18), K.negro) +
    forma('M-116 -19 L106 -19 L106 -12 L-116 -12 Z', K.negro) +
    forma('M-123 -14 L-110 -14 L-110 -11 L-123 -11 Z', K.cromoHondo, 0.9)
  );
}

/** Una rueda con banda blanca y taza: las tres costillas de la taza dejan ver que gira. */
function rueda(): string {
  const r = A.radioRueda;
  const costillas = [0, 120, 240]
    .map((g) => {
      const a = (g * Math.PI) / 180;
      return trazo(`M${f(Math.cos(a) * 3.4)} ${f(Math.sin(a) * 3.4)} L${f(Math.cos(a) * 7.6)} ${f(Math.sin(a) * 7.6)}`, K.cromoHondo, 1.3);
    })
    .join('');
  return conGrano(
    forma(circulo(0, 0, r), K.negro) +
      nube(5, -7, 8, 5, K.cromoHondo, 's', 0.4) +
      // La banda blanca, gastada, que agarra la luna arriba y se pierde abajo.
      `<circle cx="0" cy="0" r="12" fill="none" stroke="${K.yesoMedio}" stroke-width="2.6"/>` +
      `<circle cx="0" cy="0" r="12.9" fill="none" stroke="${K.yeso}" stroke-width="0.7" opacity="0.7"/>` +
      nube(-4, 7, 11, 7, K.negro, 's', 0.6) +
      // La taza: plata, con la noche adentro.
      forma(circulo(0, 0, 9.4), K.cromoHondo) +
      forma(circulo(0.4, -0.4, 8.4), K.cromo) +
      nube(3, -3.6, 4.4, 3, K.cromoClaro, 's', 0.9) +
      nube(-3, 3.6, 4.4, 3, K.cromoHondo, 's', 0.8) +
      costillas +
      forma(circulo(0, 0, 3), K.cromoClaro) +
      forma(circulo(0, 0, 1.3), K.chapa) +
      nube(3.4, -4, 2, 1.4, K.brillo, 'xs', 0.8),
  );
}

/** La sombra en el carril: se queda en el asfalto cuando despega. */
const sombra = (): string =>
  nube(0, -1, 116, 5, K.negro, 's', 0.85) + nube(A.ruedas[0]![0], -1, 22, 3.4, K.negro, 'xs', 0.9) + nube(A.ruedas[1]![0], -1, 24, 3.4, K.negro, 'xs', 0.9);

/** El haz de los faros: para adelante, tibio como la vela. */
function haz(): string {
  const [x, y] = A.faro;
  return (
    soplo(`M${x} ${y - 3} L${x} ${y + 3} L${x + 138} ${y + 40} L${x + 138} ${y - 30} Z`, K.llamaClara, 'm', 0.13) +
    soplo(`M${x} ${y - 1.5} L${x} ${y + 1.5} L${x + 100} ${y + 16} L${x + 100} ${y - 10} Z`, K.brillo, 'm', 0.12) +
    nube(x + 4, y, 12, 8, K.llamaClara, 'm', 0.4)
  );
}

/** La llama de la vela, con el pabilo en (0, 0): corrida para atrás por el viento, como la del CD. */
const llama = (): string =>
  nube(-7, -1.5, 13, 6, K.llama, 'm', 0.6) +
  soplo('M0.8 0.8 C-4 2 -12 1.2 -22 -3.4 C-13 -3.6 -5 -5 -0.4 -2.2 Z', K.llama, 'xs') +
  soplo('M0.6 0.4 C-3 1 -8 0.6 -15 -2.4 C-8.4 -2.6 -3.6 -3.4 -0.2 -1.4 Z', K.llamaClara, 'xs') +
  soplo('M0.4 0 C-1.6 0.4 -4 0.2 -7 -1.2 C-3.6 -1.4 -1.6 -1.8 0 -0.8 Z', K.brillo, 'xs') +
  nube(-0.4, -0.4, 1.4, 1.2, K.brillo, 'xs');

/** El iris que mueve la isla: del cobre de la tapa, como un ojo color miel, con la luna adentro. */
const iris = (): string =>
  forma(circulo(0, 0, 3.6), K.cobre) +
  nube(-0.6, 0.6, 2.4, 2.4, K.cobreHondo, 'xs', 0.7) +
  `<circle cx="0" cy="0" r="3.4" fill="none" stroke="${K.negro}" stroke-width="0.6" opacity="0.8"/>` +
  [20, 80, 140, 200, 260, 320].map((g) => {
    const a = (g * Math.PI) / 180;
    return trazo(`M${f(Math.cos(a) * 1.7)} ${f(Math.sin(a) * 1.7)} L${f(Math.cos(a) * 3)} ${f(Math.sin(a) * 3)}`, K.cobreClaro, 0.4, 0.8);
  }).join('') +
  forma(circulo(0, 0, 1.55), K.negro) +
  forma(circulo(1, -1.1, 0.65), K.brillo);

/* ------------------------------------------------------------------
   Las piezas que se imprimen, y el títere
   ------------------------------------------------------------------ */

const caja = (pts: readonly P[], aire = 6): readonly [number, number, number, number] => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.floor(Math.min(...xs) - aire);
  const y0 = Math.floor(Math.min(...ys) - aire);
  return [x0, y0, Math.ceil(Math.max(...xs) + aire) - x0, Math.ceil(Math.max(...ys) + aire) - y0];
};

export const PIEZAS_PONTIAC: readonly Pieza[] = [
  { nombre: 'pontiac-sombra', caja: [-148, -10, 296, 18], dibujo: sombra(), densidad: 0.8 },
  { nombre: 'pontiac-haz', caja: [100, -100, 162, 116], dibujo: haz(), densidad: 0.6 },
  { nombre: 'pontiac-alas-lejos', caja: caja([...ANTERIOR_LEJOS, ...POSTERIOR_LEJOS]), dibujo: alasLejos(), densidad: 2 },
  { nombre: 'pontiac-antena', caja: [-6, -46, 52, 52], dibujo: antena(), densidad: 3 },
  { nombre: 'pontiac-chasis', caja: [-126, -40, 236, 32], dibujo: chasis(), densidad: 1 },
  { nombre: 'pontiac-rueda', caja: [-18, -18, 36, 36], dibujo: rueda(), densidad: 3.5 },
  { nombre: 'pontiac-cuerpo', caja: [-130, -102, 254, 92], dibujo: cuerpo(), densidad: 3 },
  { nombre: 'pontiac-llama', caja: [-28, -12, 32, 18], dibujo: llama(), densidad: 4 },
  { nombre: 'pontiac-cola', caja: caja(COLA), dibujo: cola(), densidad: 3 },
  { nombre: 'pontiac-ala-posterior', caja: caja(ALA_POSTERIOR), dibujo: alaPosterior(), densidad: 3 },
  { nombre: 'pontiac-ala-anterior', caja: caja(ALA_ANTERIOR), dibujo: alaAnterior(), densidad: 3 },
  { nombre: 'pontiac-iris', caja: [-5, -5, 10, 10], dibujo: iris(), densidad: 7 },
];

/** Los contornos de las alas, en las medidas del dibujo: el test mira que no le tapen la cara a nadie. */
export const CONTORNOS_PONTIAC: Readonly<Record<string, ReadonlyArray<readonly P[]>>> = {
  'ala-anterior': [ALA_ANTERIOR],
  'ala-posterior': [ALA_POSTERIOR],
  cola: [COLA],
  'ala-lejos': [ANTERIOR_LEJOS, POSTERIOR_LEJOS],
};

const img = imagenesDe(PIEZAS_PONTIAC);

/** El títere en una pose: lo de adentro del fierro, con cada parte que mueve la isla. */
function titere(pose: Pose): string {
  const t = transformaciones(pose);
  const parte = (nombre: string, cuerpo: string, extra = ''): string => {
    const x = t[nombre];
    return `<g data-parte="${nombre}"${x ? ` transform="${x.transform}"` : ''}${x?.opacity ? ` opacity="${x.opacity}"` : ''}${extra}>${cuerpo}</g>`;
  };
  const parpado = (i: number): string => {
    const o = A.ojos[i]!;
    const [cx, cy] = o.centro;
    const [rx, ry] = o.radio;
    const top = cy - ry - 0.6;
    return `<ellipse data-parte="parpado-${i + 1}" data-pivote="${cx} ${f(top)}" cx="${cx}" cy="${cy}" rx="${f(rx + 1)}" ry="${f(ry + 0.6)}" class="bt-pontiac-parpado" transform="${t[`parpado-${i + 1}`]!.transform}"/>`;
  };
  // Cada ala se dibuja a su medida y se achica sobre su raíz; lo de adentro va con ella.
  const achica = ({ raiz: [rx, ry], k }: { raiz: P; k: number }, s: string): string =>
    `<g transform="translate(${rx} ${ry}) scale(${k}) translate(${-rx} ${-ry})">${s}</g>`;
  const { anterior, posterior } = A.escalaAlas;
  return (
    `<g class="pontiac">` +
    parte('sombra', img('pontiac-sombra')) +
    parte(
      'entero',
      parte('haz', img('pontiac-haz')) +
        parte('ala-lejos', achica(anterior, img('pontiac-alas-lejos'))) +
        parte('antena-2', img('pontiac-antena'), ' opacity="0.75"') +
        img('pontiac-chasis') +
        parte('rueda-1', img('pontiac-rueda')) +
        parte('rueda-2', img('pontiac-rueda')) +
        img('pontiac-cuerpo') +
        parte('llama', img('pontiac-llama')) +
        parte('ala-posterior', achica(posterior, parte('cola', img('pontiac-cola')) + img('pontiac-ala-posterior') + parte('iris-2', img('pontiac-iris')) + parpado(1))) +
        parte('ala-anterior', achica(anterior, img('pontiac-ala-anterior') + parte('iris-1', img('pontiac-iris')) + parpado(0))) +
        parte('antena-1', img('pontiac-antena')),
    ) +
    `</g>`
  );
}

/** El retrato de la ficha: tocada, con el susto en los ojos y las ruedas despegadas del carril. */
const DESPEGADA: Pose = { ...ASUSTADA, alto: 16, colgado: 5, cabeceo: -3, abre: 26, adelanta: 12 };

export const PONTIAC: Personaje | null = {
  id: 'la-mariposa-pontiac',
  region: 'la-ruta',
  ancla: 560,
  piezas: PIEZAS_PONTIAC,
  // Vive adentro de su fierro, que la lleva el tránsito: no dibuja nada en las capas del recinto.
  capas: {},
  fierro: () => titere(QUIETA),
  retrato: { caja: [-178, -210, 332, 226], cuerpo: () => titere(DESPEGADA) },
};
