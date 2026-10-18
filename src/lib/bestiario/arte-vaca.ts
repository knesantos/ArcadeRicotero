/**
 * Aquella solitaria vaca cubana (`D-73`), a plumín sobre aguada.
 *
 * Pedido del usuario, textual: *"Agrega otro personaje y pulilo a fondo, se creativo que qeude
 * como uno de rocambole."* Y después: *"hace la vaca cubana"*.
 *
 * La vaca es de *Un baión para el ojo idiota* (1988) y no está en ninguna tapa: se inventa en la
 * estética de su disco (`T-440`). El frente de *Un baión* es plumín sobre aguada (`plumin.ts`):
 * la tele de patas largas lavada en naranja, rojo y amarillo y raspada con rayas de tinta, la luz
 * que larga, que es lila con garabatos, el perro de crayón rojo y el muñeco rosa. Con eso se viste
 * la vaca: el cuero en la luz lila de la tele, las manchas en el violeta del fondo, el rojo del
 * perro en las sombras, la ubre y el hocico en el rosa del muñeco. **La luz le viene de dos lados**:
 * del cielo, fría, por arriba, y del naranja de la pastura, que le calienta la panza desde abajo.
 * Se le notan la cadera y las costillas: es una vaca sola.
 *
 * **El cielo es la historia**. El Indio contó que *"a la pobre vaca le cayó encima un pedazo de
 * satélite… ¡y la mató!"* (`RES-360`), y pasó de verdad, en Cuba, en 1960. Por arriba cruza la
 * tele de la tapa hecha satélite: las patas largas de la tele son las antenas de un Sputnik. Lo que
 * cae prendido fuego es **la llama de la contratapa del disco**, recortada de la tapa de verdad
 * (`tapa:` en `scripts/imprimir-bestiario.mjs`). En el dibujo cae al lado.
 *
 * Está en coordenadas de títere (`rig.ts`, `VACA_ARMADO`): el (0, 0) es el piso debajo de la
 * panza, arriba es negativo y mira para la izquierda. La cabeza, la mandíbula, la oreja y el ojo
 * van en el marco de la cabeza, con el (0, 0) en el cogote.
 */

import { enmascarado, forma, nube, type Pieza } from './aerografo.ts';
import { azar, type P } from './pincel.ts';
import { aguada, camino, contorno, garabato, mancha, plumin, plumines, rayado, rayos, rulos, silueta, zigzag, type Pluma, type Tramo } from './plumin.ts';
import { VACA_ARMADO as A } from './rig.ts';

const T = {
  luz: 'var(--bestia-vaca-luz)',
  lila: 'var(--bestia-vaca-lila)',
  lilaHonda: 'var(--bestia-vaca-lila-honda)',
  mancha: 'var(--bestia-vaca-mancha)',
  naranja: 'var(--bestia-vaca-naranja)',
  ocre: 'var(--bestia-vaca-ocre)',
  rojo: 'var(--bestia-vaca-rojo)',
  rojoHondo: 'var(--bestia-vaca-rojo-hondo)',
  rosa: 'var(--bestia-vaca-rosa)',
  rosaHonda: 'var(--bestia-vaca-rosa-honda)',
  celeste: 'var(--bestia-vaca-celeste)',
  amarillo: 'var(--entorno-bajo-llama-clara)',
  pastura: 'var(--entorno-pastura)',
  pasturaHonda: 'var(--entorno-pastura-honda)',
  tinta: 'var(--fondo)',
};

type Caja = readonly [number, number, number, number];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;

/** La caja de una silueta, con aire para el contorno que se pasa de largo. */
function cajaDe(tramos: readonly Tramo[], aire: number): Caja {
  const pts = tramos.flat();
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - aire;
  const y0 = Math.min(...ys) - aire;
  return [x0, y0, Math.max(...xs) + aire - x0, Math.max(...ys) + aire - y0];
}

/** La pluma del contorno: cargada, nerviosa, y a veces repasada. */
const CONTORNO: Pluma = { ancho: 3.4, nervio: 1.5, repaso: 0.45 };
/** La pluma de los detalles: costillas, pliegues, rodillas. */
const DETALLE: Pluma = { ancho: 1.7, nervio: 1.1, repaso: 0.25 };

/* ------------------------------------------------------------------
   El cuerpo
   ------------------------------------------------------------------ */

const CUERPO = silueta(
  [-110, -262],
  [
    // 0–2. El lomo, que se hunde un poco antes de la cadera, y la cadera que se le nota.
    [[-80, -258], [-40, -250], [0, -252]],
    [[40, -254], [90, -268], [112, -270]],
    [[130, -272], [154, -264], [172, -258]],
    // 3–4. La grupa y el muslo.
    [[184, -252], [192, -232], [190, -205]],
    [[188, -180], [182, -160], [178, -136]],
    // 5–12. La pata de atrás: el garrón que sale para atrás, la caña, la pezuña.
    [[176, -118], [184, -98], [184, -84]],
    [[182, -68], [170, -54], [168, -34]],
    [[168, -24], [173, -14], [176, -5]],
    [[178, 0]],
    [[146, 0]],
    [[146, -8], [148, -16], [150, -24]],
    [[148, -44], [148, -62], [152, -80]],
    [[152, -98], [140, -114], [128, -124]],
    // 13–21. La ubre, grande, con dos tetas.
    [[134, -112], [128, -90], [114, -84]],
    [[111, -70]],
    [[105, -70]],
    [[104, -83]],
    [[96, -81], [88, -81], [82, -83]],
    [[80, -71]],
    [[74, -71]],
    [[73, -84]],
    [[62, -88], [56, -100], [56, -110]],
    // 22–23. La panza, honda.
    [[30, -106], [-10, -102], [-40, -108]],
    [[-64, -112], [-82, -118], [-94, -124]],
    // 24–30. La pata de adelante.
    [[-94, -104], [-94, -84], [-96, -66]],
    [[-97, -48], [-99, -32], [-99, -20]],
    [[-99, -12], [-97, -6], [-96, 0]],
    [[-126, 0]],
    [[-126, -8], [-124, -15], [-122, -22]],
    [[-121, -38], [-119, -52], [-122, -66]],
    [[-125, -86], [-130, -108], [-138, -128]],
    // 31–34. El pecho, la papada y el pescuezo por abajo, que sigue debajo de la cabeza.
    [[-148, -136], [-158, -144], [-166, -158]],
    [[-180, -178], [-194, -200], [-204, -222]],
    [[-214, -244], [-224, -266], [-230, -288]],
    [[-228, -304], [-210, -320], [-190, -330]],
    // 35. La cruz del pescuezo, grueso y corto, que baja al lomo.
    [[-166, -316], [-136, -282], [-110, -262]],
  ],
);

/** Cuánto pesa el contorno en cada tramo: liviano arriba, donde le da el cielo; cargado abajo. */
function pesoDelCuerpo(i: number): number {
  if (i <= 2) return [0.45, 0, 0.5][i]!;
  if (i <= 4) return 0.85;
  if (i <= 12) return 1;
  if (i <= 21) return 1.1;
  if (i <= 23) return 1.3;
  if (i <= 30) return 1;
  if (i <= 34) return 1.05;
  return 0.55;
}

/** Las patas del otro lado, que se ven entre las de este lado, más oscuras. */
const PATA_LEJOS_TRAS = silueta(
  [116, -128],
  [
    [[112, -104], [113, -72], [115, -40]],
    [[116, -26], [114, -12], [114, -4]],
    [[138, -4]],
    [[138, -16], [137, -28], [139, -42]],
    [[140, -70], [142, -98], [148, -124]],
  ],
);
const PATA_LEJOS_DEL = silueta(
  [-92, -122],
  [
    [[-90, -96], [-90, -64], [-88, -40]],
    [[-87, -26], [-90, -12], [-91, -4]],
    [[-65, -4]],
    [[-65, -16], [-67, -28], [-67, -42]],
    [[-67, -70], [-65, -100], [-58, -124]],
  ],
);

/** Una pezuña: el pie de una pata, en tinta, con el reflejo del pasto. */
function pezunia(id: string, d: string, x0: number, x1: number, piso: number): string {
  return enmascarado(
    id,
    d,
    forma(`M${x0 - 4} ${piso - 15} L${x1 + 4} ${piso - 17} L${x1 + 4} ${piso + 2} L${x0 - 4} ${piso + 2} Z`, T.tinta) +
      nube((x0 + x1) / 2, piso - 3, (x1 - x0) * 0.45, 3, T.naranja, 'xs', 0.6) +
      `<path d="M${(x0 + x1) / 2 + 1} ${piso - 13} L${(x0 + x1) / 2 + 2} ${piso}" stroke="${T.lilaHonda}" stroke-width="1.2" fill="none"/>`,
  );
}

function pataDeLejos(nombre: string, tramos: readonly Tramo[], semilla: number): string {
  const d = camino(tramos);
  const caja = cajaDe(tramos, 4);
  const [x0, , ancho] = caja;
  return (
    forma(d, T.lilaHonda) +
    enmascarado(
      `${nombre}-adentro`,
      d,
      nube(x0 + ancho / 2, -110, ancho * 0.5, 22, T.mancha, 's', 0.8) +
        nube(x0 + ancho / 2, -20, ancho * 0.6, 26, T.mancha, 's', 0.6) +
        nube(x0 + ancho / 2, -6, ancho * 0.4, 6, T.naranja, 'xs', 0.4),
    ) +
    rayado(`${nombre}-raspado`, d, caja, { angulo: 76, paso: 3, ancho: 1.05 }, semilla) +
    rayado(`${nombre}-cruza`, d, caja, { angulo: 14, paso: 4.4, ancho: 0.85, corta: 0.4 }, semilla + 1) +
    pezunia(`${nombre}-pezunia`, d, x0 + 4, x0 + ancho - 4, -4) +
    contorno(tramos, () => 0.75, { ...CONTORNO, ancho: 2.6 }, semilla + 3)
  );
}

/** Las zonas de sombra para el raspado: se cruzan con la silueta, porque van adentro de su máscara. */
const ZONAS = {
  /** Todo menos la franja del lomo, donde le da el cielo. */
  sombra: 'M-240 -250 L230 -262 L230 10 L-240 10 Z',
  panza: 'M-240 -190 L230 -196 L230 10 L-240 10 Z',
  bajo: 'M-240 -124 C-120 -116 40 -114 230 -126 L230 10 L-240 10 Z',
  muslo: 'M156 -262 C184 -226 194 -176 184 -110 L210 -110 L210 -262 Z',
  pecho: 'M-240 -330 L-158 -330 C-158 -262 -146 -190 -126 -130 L-240 -130 Z',
  pescuezo: 'M-240 -300 L-198 -300 C-188 -262 -172 -220 -158 -180 L-240 -180 Z',
  pataDel: 'M-110 -128 L-90 -128 L-92 4 L-108 4 Z',
  pataTras: 'M160 -150 L196 -150 L196 4 L158 4 Z',
};

function cuerpoDibujo(): string {
  const d = camino(CUERPO);
  const caja = cajaDe(CUERPO, 6);
  const manchas: Array<[string, number]> = [
    [mancha([128, -214], [58, 44], 61, -8), 61],
    [mancha([2, -200], [62, 44], 62, 6), 62],
    [mancha([-158, -240], [34, 50], 63, -30), 63],
    [mancha([160, -118], [16, 22], 64, 10, 2), 64],
    [mancha([-112, -96], [12, 16], 65, 0, 2), 65],
  ];
  const todo: readonly [number, number, number, number] = [-240, -340, 470, 360];
  const cuero =
    // La luz: fría del cielo en el lomo; el resto en el lila de la luz de la tele, cada vez
    // más hondo para abajo.
    nube(0, -258, 200, 14, T.luz, 'm') +
    nube(-176, -306, 28, 24, T.luz, 'm', 0.85) +
    nube(10, -260, 140, 5, T.celeste, 's', 0.6) +
    nube(0, -140, 230, 78, T.lilaHonda, 'l', 0.9) +
    nube(-110, -50, 22, 62, T.lilaHonda, 'm') +
    nube(162, -60, 24, 72, T.lilaHonda, 'm') +
    nube(180, -182, 18, 62, T.lilaHonda, 'm', 0.8) +
    nube(-188, -216, 26, 64, T.lilaHonda, 'm', 0.7) +
    nube(0, -110, 160, 12, T.mancha, 's', 0.65) +
    nube(-110, -112, 16, 14, T.mancha, 's', 0.5) +
    nube(150, -122, 20, 14, T.mancha, 's', 0.5) +
    // El naranja de la pastura, que le sube por la panza y las patas desde abajo.
    nube(0, -122, 210, 26, T.naranja, 'm', 0.32) +
    nube(0, -106, 130, 5, T.naranja, 's', 0.85) +
    nube(96, -84, 34, 5, T.ocre, 's', 0.6) +
    nube(-112, -10, 18, 16, T.naranja, 's', 0.6) +
    nube(162, -10, 18, 16, T.naranja, 's', 0.6) +
    // Las manchas: el violeta del fondo de la tapa, lleno de garabato, como el fondo de la tapa.
    manchas
      .map(
        ([md, s], i) =>
          aguada(md, T.mancha, { blando: 'xs' }) +
          garabato(`vc-m${i}a`, md, todo, { angulo: 32, paso: 4.4, ancho: 1.2 }, s) +
          rayado(`vc-m${i}b`, md, todo, { angulo: -50, paso: 6, ancho: 0.8, corta: 0.5 }, s + 1),
      )
      .join('') +
    // Un brillo de cielo sobre las manchas del lomo.
    plumines(
      [
        [[86, -252], [104, -258], [124, -260], [146, -254]],
        [[-34, -238], [-12, -242], [12, -242], [34, -236]],
        [[-170, -276], [-160, -282], [-150, -282]],
      ],
      { ancho: 2.2, tinta: T.lila, nervio: 1.2 },
      66,
    ) +
    // El raspado de la tele, sobre todo lo que no le da el cielo: rayas que rodean la panza.
    // Tres pasadas en la misma dirección, cada una más abajo y más apretada: así se oscurece.
    rayado('vc-sombra', ZONAS.sombra, caja, { angulo: 86, paso: 6.4, ancho: 0.95, comba: 0.07, corta: 0.12, pareja: true, desde: -85, entra: 64, nervio: 0.6 }, 67) +
    rayado('vc-panza', ZONAS.panza, caja, { angulo: 86, paso: 6.4, ancho: 1, comba: 0.07, corta: 0.12, pareja: true, desde: -25, entra: 44, nervio: 0.6 }, 68) +
    rayado('vc-bajo', ZONAS.bajo, caja, { angulo: 14, paso: 3.4, ancho: 0.9, comba: 0.02, pareja: true, nervio: 0.6 }, 69) +
    rayado('vc-muslo', ZONAS.muslo, caja, { angulo: 70, paso: 3.8, ancho: 1.05 }, 70) +
    rayado('vc-pecho', ZONAS.pecho, caja, { angulo: 56, paso: 4, ancho: 1.05, corta: 0.3 }, 71) +
    rayado('vc-pescuezo', ZONAS.pescuezo, caja, { angulo: 30, paso: 3.8, ancho: 1.05 }, 72) +
    rayado('vc-pata-del', ZONAS.pataDel, caja, { angulo: 86, paso: 3.2, ancho: 1 }, 73) +
    rayado('vc-pata-tras', ZONAS.pataTras, caja, { angulo: 84, paso: 3.2, ancho: 1 }, 74) +
    // La ubre: el rosa del muñeco, con las venas, encima de todo el raspado.
    enmascarado(
      'vc-ubre',
      'M128 -124 C134 -112 128 -90 114 -84 L111 -70 L105 -70 L104 -83 C96 -81 88 -81 82 -83 L80 -71 L74 -71 L73 -84 C62 -88 56 -100 56 -110 C80 -118 108 -124 128 -124 Z',
      forma('M40 -130 L140 -130 L140 -60 L40 -60 Z', T.rosa) +
        nube(96, -80, 34, 8, T.rosaHonda, 's') +
        nube(80, -116, 30, 6, T.lila, 's', 0.7) +
        rayado('vc-ubre-r', 'M40 -100 L140 -100 L140 -60 L40 -60 Z', [40, -130, 100, 70], { angulo: -60, paso: 3.4, ancho: 0.9, tinta: T.rojoHondo, corta: 0.4 }, 75) +
        plumines(
          [
            [[66, -110], [78, -104], [90, -106], [104, -98]],
            [[118, -112], [110, -104], [104, -96], [100, -90]],
          ],
          { ancho: 1.2, tinta: T.rosaHonda, nervio: 0.8 },
          76,
        ),
    ) +
    // Lo que se le nota adentro: la cadera, las costillas, la paleta, los pliegues de la papada.
    plumines(
      [
        [[100, -270], [106, -258], [110, -248], [118, -242]],
        [[118, -242], [136, -238], [154, -242], [172, -250]],
        [[-66, -214], [-76, -198], [-75, -180], [-68, -166]],
        [[-42, -216], [-52, -200], [-51, -182], [-45, -168]],
        [[-18, -216], [-27, -201], [-26, -184], [-21, -170]],
        [[6, -212], [-2, -199], [-1, -184], [4, -172]],
        [[-114, -254], [-102, -232], [-96, -204], [-100, -178]],
        [[-166, -190], [-158, -186], [-150, -188]],
        [[-174, -210], [-166, -207], [-158, -209]],
        [[-180, -232], [-172, -230], [-165, -232]],
        [[128, -124], [122, -142], [120, -162], [124, -182]],
        [[-122, -66], [-114, -62], [-106, -63]],
        [[-121, -58], [-114, -55], [-107, -56]],
        [[184, -86], [174, -82], [166, -84]],
        [[-94, -124], [-100, -138], [-104, -150]],
        [[-60, -110], [-30, -104], [10, -103], [40, -108]],
      ],
      DETALLE,
      77,
    ) +
    pezunia('vc-pez-del', d, -126, -96, 0) +
    pezunia('vc-pez-tras', d, 146, 178, 0);
  return (
    pataDeLejos('vl-tras', PATA_LEJOS_TRAS, 81) +
    pataDeLejos('vl-del', PATA_LEJOS_DEL, 82) +
    forma(d, T.lila) +
    enmascarado('vc-cuero', d, cuero) +
    contorno(CUERPO, pesoDelCuerpo, CONTORNO, 78) +
    cencerro()
  );
}

/**
 * El cencerro, colgado de una correa al pie del pescuezo: es lo que suena cuando la tocan en el
 * camino (`sonido.ts`, `D-76`). Chapa ocre como el costado de la tele, raspada, con el badajo.
 */
function cencerro(): string {
  const chapa = 'M-217 -228 L-201 -230 L-195 -203 L-221 -201 Z';
  return (
    plumin([[-154, -306], [-170, -282], [-190, -252], [-208, -230]], { ancho: 4.4, tinta: T.rojoHondo, nervio: 0.6, punta: 0.8 }, 79) +
    plumin([[-154, -306], [-170, -282], [-190, -252], [-208, -230]], { ancho: 1, tinta: T.ocre, nervio: 0.4 }, 80) +
    forma(chapa, T.ocre) +
    enmascarado('vc-cencerro', chapa, nube(-214, -222, 6, 12, T.amarillo, 'xs', 0.6) + nube(-198, -208, 5, 10, T.rojoHondo, 'xs', 0.7)) +
    rayado('vc-cencerro-r', chapa, [-222, -232, 28, 32], { angulo: 80, paso: 2.6, ancho: 0.8, corta: 0.3 }, 83) +
    `<circle cx="-208" cy="-199" r="2.6" fill="${T.tinta}"/>` +
    `<path d="${chapa}" fill="none" stroke="${T.tinta}" stroke-width="2" stroke-linejoin="round"/>`
  );
}

/* ------------------------------------------------------------------
   La cabeza, en su marco: el (0, 0) es el cogote y mira para la izquierda
   ------------------------------------------------------------------ */

const CABEZA = silueta(
  [-8, -30],
  [
    [[-30, -38], [-50, -37], [-64, -31]],
    [[-84, -24], [-102, -16], [-114, -12]],
    [[-124, -9], [-131, 2], [-131, 12]],
    [[-131, 22], [-127, 30], [-118, 32]],
    [[-106, 32], [-94, 31], [-84, 30]],
    [[-64, 36], [-44, 40], [-28, 32]],
    [[-14, 26], [-2, 12], [2, 0]],
    [[4, -12], [0, -24], [-8, -30]],
  ],
);
const pesoDeLaCabeza = (i: number): number => [0.5, 0.8, 1.15, 1.1, 0.9, 1.15, 0.8, 0.5][i] ?? 1;

const CUERNO = 'M-19 -32 C-25 -45 -42 -54 -63 -51 C-51 -45 -41 -39 -34 -31 Z';
const CUERNO_LEJOS = 'M-7 -32 C-12 -47 -28 -58 -48 -60 C-37 -52 -27 -42 -21 -31 Z';
const OREJA_LEJOS = 'M-10 -26 C-6 -40 6 -50 20 -52 C18 -42 10 -32 0 -24 Z';
const HOCICO = 'M-114 -12 C-124 -9 -131 2 -131 12 C-131 22 -127 30 -118 32 C-111 22 -109 2 -114 -12 Z';
const NARIZ = 'M-124 3 C-128 4 -128 10 -125 11 C-123 9 -122 6 -124 3 Z';

/** Un cuerno: la luz del cielo, el ocre de la tele en la base, raspado a lo largo, la punta oscura. */
function cuerno(id: string, d: string, base: string, s: number): string {
  return (
    forma(d, base) +
    enmascarado(`${id}-adentro`, d, nube(-22, -32, 12, 6, T.ocre, 's', 0.85) + nube(-60, -50, 8, 6, T.mancha, 'xs', 0.8)) +
    rayado(`${id}-raspado`, d, [-70, -66, 66, 40], { angulo: 50, paso: 3.2, ancho: 0.9, corta: 0.4 }, s) +
    `<path d="${d}" fill="none" stroke="${T.tinta}" stroke-width="2" stroke-linejoin="round"/>`
  );
}

function cabezaDibujo(): string {
  const d = camino(CABEZA);
  const caja = cajaDe(CABEZA, 6);
  const parche = mancha([-44, -18], [32, 19], 91, -6, 2);
  const adentro =
    // La cara blanca, la sombra del cachete, el calor de la pastura debajo de la quijada.
    nube(-92, -20, 26, 5, T.celeste, 'xs', 0.6) +
    nube(-56, 18, 50, 18, T.lila, 's') +
    nube(-22, 8, 20, 24, T.lilaHonda, 's', 0.7) +
    nube(-64, 34, 50, 5, T.naranja, 's', 0.6) +
    // La mancha alrededor del ojo, hasta la oreja, llena de garabato.
    aguada(parche, T.mancha, { blando: 'xs' }) +
    garabato('vk-parche-a', parche, caja, { angulo: 24, paso: 3.8, ancho: 1.05 }, 92) +
    // El hocico, en el rosa del muñeco.
    aguada(HOCICO, T.rosa, { blando: 'xs' }) +
    enmascarado('vk-hocico', HOCICO, nube(-120, 28, 12, 6, T.rosaHonda, 'xs') + nube(-126, -2, 6, 4, T.luz, 'xs', 0.6)) +
    // El raspado del cachete, de la quijada y del costado de la trompa.
    rayado('vk-cachete', 'M-90 8 C-70 12 -46 10 -18 2 L-8 46 L-90 46 Z', caja, { angulo: -55, paso: 5.4, ancho: 0.85, corta: 0.3, entra: 14, desde: -20 }, 94) +
    rayado('vk-quijada', 'M-96 26 C-76 30 -50 32 -20 24 L-10 46 L-96 46 Z', caja, { angulo: 16, paso: 4.6, ancho: 0.8, corta: 0.4 }, 95);
  return (
    // Lo de atrás: la oreja y el cuerno del otro lado.
    forma(OREJA_LEJOS, T.mancha) +
    rayado('vk-oreja-lejos', OREJA_LEJOS, [-14, -56, 38, 34], { angulo: 50, paso: 3, ancho: 0.9 }, 97) +
    cuerno('vk-cuerno-lejos', CUERNO_LEJOS, T.lila, 98) +
    forma(d, T.luz) +
    enmascarado('vk-cara', d, adentro) +
    // Los rulitos de la frente, la nariz, la boca, el pómulo y la arruga del pescuezo.
    rulos([[-30, -32], [-24, -31]], 4, 2.4, { ancho: 1.1, nervio: 0.4 }, 99) +
    rulos([[-46, -32], [-40, -32]], 3.4, 2.2, { ancho: 1, nervio: 0.4 }, 100) +
    rulos([[-38, -26], [-33, -25]], 3, 2, { ancho: 0.9, nervio: 0.4 }, 101) +
    forma(NARIZ, T.tinta) +
    plumines(
      [
        [[-131, 20], [-124, 24], [-116, 26], [-108, 27]],
        [[-94, 6], [-82, 12], [-72, 14], [-62, 12]],
        [[-30, 28], [-20, 18], [-12, 8], [-8, -4]],
        [[-106, -12], [-101, -6], [-98, 0]],
      ],
      DETALLE,
      102,
    ) +
    `<g fill="${T.rojoHondo}">${[[-118, 20], [-115, 24], [-121, 26], [-112, 17], [-117, 14], [-110, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9"/>`).join('')}</g>` +
    contorno(CABEZA, pesoDeLaCabeza, { ...CONTORNO, ancho: 3 }, 103) +
    cuerno('vk-cuerno', CUERNO, T.luz, 104)
  );
}

/** La mandíbula: va atrás de la cabeza y se mueve de costado cuando rumia. */
const MANDIBULA = silueta(
  [-52, 22],
  [
    [[-70, 30], [-96, 32], [-116, 33]],
    [[-122, 34], [-123, 40], [-117, 43]],
    [[-100, 50], [-76, 50], [-58, 42]],
    [[-52, 36], [-50, 30], [-52, 22]],
  ],
);
function mandibulaDibujo(): string {
  const d = camino(MANDIBULA);
  return (
    forma(d, T.lila) +
    enmascarado('vm-adentro', d, nube(-88, 46, 40, 5, T.naranja, 's', 0.6) + nube(-76, 34, 30, 8, T.lilaHonda, 's', 0.7)) +
    rayado('vm-raspado', d, cajaDe(MANDIBULA, 4), { angulo: -40, paso: 5, ancho: 0.8, corta: 0.4 }, 111) +
    plumines([[[-110, 46], [-108, 50], [-107, 53]], [[-100, 47], [-99, 51]]], { ancho: 0.9, nervio: 0.4 }, 112) +
    contorno(MANDIBULA, (i) => (i === 0 ? 0 : 1), { ...CONTORNO, ancho: 2 }, 113)
  );
}

/** Lo de adentro de la boca: se ve cuando la mandíbula se corre. */
const bocaDibujo = (): string => forma('M-52 18 L-120 30 L-120 40 L-56 34 Z', T.rojoHondo) + forma('M-64 26 L-114 33 L-112 36 L-66 32 Z', T.rosaHonda, 0.7);

/** La oreja de este lado: el adentro rosa, el afuera en la mancha, con pelos. */
const OREJA = 'M-14 -16 C-2 -30 20 -34 38 -28 C32 -18 14 -10 -6 -10 Z';
const OREJA_ADENTRO = 'M-8 -17 C4 -26 18 -29 31 -27 C26 -20 12 -14 -2 -13 Z';
function orejaDibujo(): string {
  return (
    forma(OREJA, T.mancha) +
    aguada(OREJA_ADENTRO, T.rosa, { blando: 'xs' }) +
    rayado('vo-pelos', OREJA_ADENTRO, [-10, -32, 44, 22], { angulo: -12, paso: 2.6, ancho: 0.8, tinta: T.rosaHonda }, 121) +
    plumines([[[31, -27], [25, -25], [19, -23]], [[35, -28], [30, -30]]], { ancho: 0.9, tinta: T.lila, nervio: 0.4 }, 122) +
    `<path d="${OREJA}" fill="none" stroke="${T.tinta}" stroke-width="2.2" stroke-linejoin="round"/>`
  );
}

/**
 * Lo que va encima del ojo vivo (el blanco y la pupila los dibuja la página, para que la pupila
 * siga al satélite): el párpado de arriba, pesado, con las pestañas, la raya de abajo y el
 * pliegue. Es el ojo humano que Rocambole les pone a los animales.
 */
function ojoDibujo(): string {
  const {
    centro: [cx, cy],
    radio: [rx, ry],
    giro,
  } = A.ojo;
  const arco = (k: number, desde: number, hasta: number): P[] => {
    const pts: P[] = [];
    for (let i = 0; i <= 16; i++) {
      const x = desde + ((hasta - desde) * i) / 16;
      pts.push([x, -ry * k * Math.sqrt(Math.max(0, 1 - (x / rx) ** 2))]);
    }
    return pts;
  };
  const arriba = arco(1.08, -rx - 1, rx + 1);
  const bajo = arco(0.42, rx + 1, -rx - 1);
  const parpado = poli([...arriba, ...bajo]);
  const pestanias = [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((k): P[] => {
    const x = k * rx;
    const y = -ry * 0.42 * Math.sqrt(1 - k * k);
    return [
      [x, y],
      [x - 1.5 + k * 2, y - 3],
      [x - 3 + k * 4, y - 6.5],
    ];
  });
  return (
    `<g transform="translate(${cx} ${cy}) rotate(${giro})">` +
    forma(parpado, T.mancha) +
    plumin(arco(0.42, -rx, rx), { ancho: 2.6, nervio: 0.5, punta: 0.3 }, 131) +
    plumines(pestanias, { ancho: 1.1, nervio: 0.3, punta: 0.1 }, 132) +
    plumin(arco(-1, -rx * 0.8, rx * 0.9), { ancho: 1.1, nervio: 0.5, tinta: T.lilaHonda }, 133) +
    plumin(arco(1.6, -rx * 0.7, rx * 0.8), { ancho: 1.2, nervio: 0.6, tinta: T.lila }, 134) +
    `<ellipse cx="${-rx + 2}" cy="0.5" rx="2.4" ry="1.8" fill="${T.rosaHonda}"/>` +
    `</g>`
  );
}

/** La cola, que cuelga de la grupa, y la borla de la punta, que se mueve aparte. */
const COLA = silueta(
  [166, -260],
  [
    [[184, -244], [195, -206], [195, -166]],
    [[194, -152], [193, -144], [193, -136]],
    [[188, -136]],
    [[188, -148], [188, -158], [187, -168]],
    [[186, -206], [178, -236], [163, -252]],
  ],
);
function colaDibujo(): string {
  const d = camino(COLA);
  return (
    forma(d, T.lila) +
    enmascarado('vt-adentro', d, nube(193, -190, 4, 40, T.lilaHonda, 'xs')) +
    contorno(COLA, (i) => (i === 2 ? 0 : 0.6), { ...CONTORNO, ancho: 2.4 }, 141)
  );
}
function borlaDibujo(): string {
  const d = mancha([190, -114], [8, 22], 151, 4, 2);
  const pelos = Array.from({ length: 9 }, (_, i): P[] => {
    const x = 184 + i * 1.6;
    return [
      [190, -134],
      [x, -112],
      [x - 1 + (i % 3), -96 + (i % 2) * 4],
    ];
  });
  return forma(d, T.mancha) + plumines(pelos, { ancho: 1.2, nervio: 0.8, punta: 0.15 }, 152) + plumines(pelos.slice(2, 5), { ancho: 0.9, tinta: T.lila, nervio: 0.6 }, 153);
}

/** El bolo que sube por el pescuezo cuando rumia: un bulto chico, en su marco. */
const boloDibujo = (): string =>
  forma('M-11 -2 C-10 -8 10 -8 11 -2 C9 5 -9 5 -11 -2 Z', T.lila) +
  forma('M-9 -1 C-6 -4 6 -4 9 -1 C6 1 -6 1 -9 -1 Z', T.lilaHonda, 0.6) +
  plumin([[-11, 0], [-6, 6], [6, 6], [11, 0]], { ancho: 1.8, nervio: 0.4 }, 161);

/* ------------------------------------------------------------------
   El cielo: la tele hecha satélite, el pedazo que cae, el golpe y el pozo
   ------------------------------------------------------------------ */

function sateliteDibujo(): string {
  const frente: P[] = [[-46, -26], [14, -34], [18, 30], [-42, 38]];
  const arriba: P[] = [[-46, -26], [14, -34], [44, -50], [-16, -44]];
  const costado: P[] = [[14, -34], [44, -50], [48, 12], [18, 30]];
  const pantalla: P[] = [[-38, -17], [7, -24], [10, 21], [-34, 28]];
  const caja: Caja = [-60, -60, 120, 110];
  // Las patas largas de la tele de la tapa, que acá son las antenas de un Sputnik: van para atrás.
  const patas: P[][] = [
    [[40, 6], [80, 18], [118, 30], [152, 40]],
    [[46, -10], [90, -6], [128, 0], [164, 4]],
    [[30, 24], [62, 38], [96, 52], [128, 64]],
    [[42, -36], [84, -36], [126, -32], [166, -30]],
  ];
  const borde = (pts: readonly P[]): string => poli(pts);
  return (
    // La luz que larga, como en la tapa: garabatos lila que se abren desde la pantalla.
    rayos([-14, 4], 44, 108, 22, { amplitud: 5, paso: 6, ancho: 1.6, tinta: T.lila }, 171) +
    rayos([-14, 4], 70, 124, 12, { amplitud: 6, paso: 7, ancho: 1, tinta: T.lilaHonda }, 172) +
    patas.map((p, i) => plumin(p, { ancho: 3.4, tinta: T.rojo, nervio: 1, punta: 0.35 }, 173 + i) + plumin(p, { ancho: 1, nervio: 1, punta: 0.2 }, 177 + i)).join('') +
    // Las tres caras de la caja, lavadas en los colores de la tele y raspadas.
    forma(borde(arriba), T.naranja) +
    enmascarado('vs-arriba', borde(arriba), nube(20, -44, 26, 8, T.amarillo, 's', 0.7)) +
    rayado('vs-arriba-r', borde(arriba), caja, { angulo: -28, paso: 3, ancho: 1 }, 181) +
    forma(borde(costado), T.rojo) +
    enmascarado('vs-costado', borde(costado), nube(30, -20, 10, 20, T.ocre, 's', 0.8)) +
    rayado('vs-costado-r', borde(costado), caja, { angulo: 82, paso: 2.8, ancho: 1 }, 182) +
    forma(borde(frente), T.ocre) +
    enmascarado('vs-frente', borde(frente), nube(-40, 30, 16, 14, T.naranja, 's', 0.8) + nube(10, -30, 14, 10, T.amarillo, 's', 0.7)) +
    rayado('vs-frente-r', borde(frente), caja, { angulo: -8, paso: 3.2, ancho: 1, corta: 0.3 }, 183) +
    // La pantalla: el celeste del antifaz y la luz, con la lluvia de la tele.
    forma(borde(pantalla), T.celeste) +
    enmascarado(
      'vs-pantalla',
      borde(pantalla),
      nube(-14, 2, 18, 16, T.luz, 's') +
        [-12, -4, 4, 12, 20].map((y, i) => zigzag([-36, y], [8, y - 6], 2.4, 4, { ancho: 0.8, tinta: T.lilaHonda }, 184 + i)).join(''),
    ) +
    // Las orejas de conejo de arriba.
    plumines(
      [
        [[12, -42], [8, -60], [3, -76], [-2, -92]],
        [[24, -46], [32, -62], [40, -76], [48, -90]],
      ],
      { ancho: 1.6, nervio: 0.6 },
      190,
    ) +
    `<circle cx="-2" cy="-93" r="3" fill="${T.tinta}"/><circle cx="48" cy="-91" r="3" fill="${T.tinta}"/>` +
    // Los cantos de la caja, cargados.
    plumines(
      [frente, arriba, costado, pantalla].flatMap((pts) => pts.map((p, i): P[] => [p, pts[(i + 1) % pts.length]!])),
      { ancho: 2.4, nervio: 0.9, repaso: 0.5 },
      191,
    )
  );
}

/**
 * El pedazo que cae: un cacho de la tele con un muñón de pata, y atrás la llama de la contratapa
 * de *Un baión*, recortada de la tapa de verdad. La llama se separa del azul de la tapa por color
 * (`vp-solo-llama`: queda lo que tiene más rojo que azul) y se corta lejos del logo de la
 * disquería. El pedazo va adelante, en el (0, 0), y la llama se estira para atrás, hacia +x: la
 * isla lo gira para que la llama quede del lado de donde viene.
 */
function pedazoDibujo(): string {
  // La llama, en unidades de la tapa como la usa `arte-bajo.ts` (953 × 750): la base, cortada
  // por el lomo del disco, abajo a la izquierda, y las puntas arriba a la derecha.
  const corte = 'M24 371 L222 371 L222 566 L124 600 L92 690 L24 690 Z';
  const llama =
    `<filter id="vp-solo-llama" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2.4 0.5 -3.1 0 -0.5"/></filter>` +
    `<clipPath id="vp-corte"><path d="${corte}"/></clipPath>` +
    `<g transform="rotate(52) scale(0.6) translate(-48 -590)"><g clip-path="url(#vp-corte)">` +
    `<image href="tapa:un-baion-para-el-ojo-idiota-trasera" x="0" y="0" width="953" height="750" preserveAspectRatio="none" filter="url(#vp-solo-llama)"/></g></g>`;
  const cacho: P[] = [[-14, -10], [8, -14], [12, 8], [-10, 12]];
  return (
    llama +
    plumin([[2, 0], [30, 8], [60, 4], [92, -10]], { ancho: 3, tinta: T.rojo, nervio: 1.2 }, 201) +
    forma(poli(cacho), T.naranja) +
    rayado('vp-cacho', poli(cacho), [-16, -16, 32, 30], { angulo: -20, paso: 2.6, ancho: 0.9 }, 202) +
    forma('M8 -14 L16 -18 L19 4 L12 8 Z', T.rojo) +
    plumines(
      cacho.map((p, i): P[] => [p, cacho[(i + 1) % cacho.length]!]),
      { ancho: 2, nervio: 0.6 },
      203,
    ) +
    rayos([0, 0], 14, 30, 9, { ancho: 1.6, tinta: T.amarillo, nervio: 0.8 }, 204)
  );
}

/** El golpe: la luz de la tele otra vez, una explosión de garabatos. Achatada: es en el piso. */
function estallidoDibujo(): string {
  return (
    nube(0, 0, 30, 22, T.luz, 'm') +
    nube(0, 0, 14, 10, T.amarillo, 's') +
    rayos([0, 0], 16, 80, 18, { amplitud: 5, paso: 6, ancho: 2.2, tinta: T.luz, achate: 0.75 }, 211) +
    rayos([0, 0], 40, 98, 14, { amplitud: 6, paso: 7, ancho: 1.3, achate: 0.75 }, 212) +
    rayos([0, 0], 26, 70, 10, { ancho: 2.6, tinta: T.naranja, achate: 0.75 }, 213)
  );
}

/** El pozo en la pastura, con los terrones levantados, la brasa en el medio y los rayones. */
function pozoDibujo(): string {
  const rnd = azar(221);
  const hoyo = 'M-40 0 C-40 -9 -20 -14 0 -14 C20 -14 40 -9 40 0 C40 9 20 14 0 14 C-20 14 -40 9 -40 0 Z';
  const terrones = Array.from({ length: 13 }, (_, i) => {
    const a = (i / 13) * Math.PI * 2 + rnd() * 0.3;
    const x = Math.cos(a) * (46 + rnd() * 8);
    const y = Math.sin(a) * (17 + rnd() * 3);
    const d = mancha([x, y], [5 + rnd() * 4, 3 + rnd() * 2], 230 + i, rnd() * 40, 4);
    return forma(d, i % 3 ? T.pastura : T.pasturaHonda) + `<path d="${d}" fill="none" stroke="${T.tinta}" stroke-width="1.2"/>`;
  }).join('');
  return (
    rayos([0, 0], 54, 112, 14, { ancho: 1.3, achate: 0.36, nervio: 0.8 }, 222) +
    forma(hoyo, T.mancha) +
    rayado('vz-hoyo', hoyo, [-42, -16, 84, 32], { angulo: 24, paso: 2.6, ancho: 1 }, 223) +
    nube(0, 2, 22, 7, T.naranja, 's') +
    nube(0, 2, 9, 3, T.amarillo, 'xs') +
    terrones +
    plumin([[-40, 0], [-30, 12], [30, 12], [40, 0]], { ancho: 2.6, nervio: 0.8 }, 224)
  );
}

/** El humo del pozo: dos resortes que suben y se abren. */
const humoDibujo = (): string =>
  rulos([[0, -4], [-4, -40], [6, -80], [-6, -124]], 16, 6, { ancho: 2.4, tinta: T.lila, nervio: 0.6 }, 241) +
  rulos([[4, -10], [10, -46], [0, -84], [12, -118]], 11, 5, { ancho: 1.1, nervio: 0.5 }, 242);

/* ------------------------------------------------------------------
   Las piezas que se imprimen
   ------------------------------------------------------------------ */

export const PIEZAS_VACA: readonly Pieza[] = [
  { nombre: 'vaca-cuerpo', caja: cajaDe([...CUERPO, ...PATA_LEJOS_TRAS, ...PATA_LEJOS_DEL], 10), dibujo: cuerpoDibujo(), densidad: 2.2 },
  { nombre: 'vaca-cabeza', caja: [-142, -76, 190, 132], dibujo: cabezaDibujo(), densidad: 2.6 },
  { nombre: 'vaca-mandibula', caja: [-132, 14, 90, 44], dibujo: mandibulaDibujo(), densidad: 2.6 },
  { nombre: 'vaca-boca', caja: [-126, 14, 80, 30], dibujo: bocaDibujo(), densidad: 2 },
  { nombre: 'vaca-oreja', caja: [-20, -40, 64, 36], dibujo: orejaDibujo(), densidad: 2.6 },
  { nombre: 'vaca-ojo', caja: [-82, -38, 48, 48], dibujo: ojoDibujo(), densidad: 4 },
  { nombre: 'vaca-cola', caja: [156, -266, 46, 136], dibujo: colaDibujo(), densidad: 2.2 },
  { nombre: 'vaca-borla', caja: [172, -142, 36, 56], dibujo: borlaDibujo(), densidad: 2.4 },
  { nombre: 'vaca-bolo', caja: [-14, -10, 28, 20], dibujo: boloDibujo(), densidad: 3 },
  { nombre: 'vaca-satelite', caja: [-140, -140, 320, 290], dibujo: sateliteDibujo(), densidad: 1.5 },
  { nombre: 'vaca-pedazo', caja: [-30, -150, 200, 180], dibujo: pedazoDibujo(), densidad: 1.6 },
  { nombre: 'vaca-estallido', caja: [-110, -84, 220, 168], dibujo: estallidoDibujo(), densidad: 1.4 },
  { nombre: 'vaca-pozo', caja: [-120, -46, 240, 92], dibujo: pozoDibujo(), densidad: 1.6 },
  { nombre: 'vaca-humo', caja: [-34, -140, 64, 146], dibujo: humoDibujo(), densidad: 1.6 },
];
