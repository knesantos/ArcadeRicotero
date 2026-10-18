/**
 * El bajo inundado y el gordo Pierre (`D-73`, sexta vuelta).
 *
 * Pedido del usuario, textual: *"Agrega otro personaje y pulilo a fondo, se creativo que quede
 * como uno de rocambole."* Y en el pedido que armó el bestiario: *"el gordo pier que tenga una
 * botella y este en un lugar inundado con un vidrio roto"*.
 *
 * Pierre no está en ninguna tapa: se inventa en la estética de su disco (`T-440`), que es
 * *Gulp!* (1985). La tapa de *Gulp!* es pincel seco negro sobre papel, fotocopiado, con letras
 * corridas en rojo sobre amarillo. Así que Pierre está **pintado a pincel seco en papel**
 * (`pincel.ts`), en claroscuro de fotocopia —lo oscuro no es un contorno, es una mancha de
 * pasadas que se secan contra la luz—, y **recortado con tijera** en piezas, como un títere de
 * papel. Lo único de Pierre que sale de una tapa de verdad es la etiqueta de la botella: el
 * «gulp.» pegado en la contratapa del disco, que la imprenta recorta de ahí (`tapa:` en
 * `scripts/imprimir-bestiario.mjs`).
 *
 * El bajo viste *Un baión* (`D-19`): la pared es el crayón azul de su contratapa, recortado de
 * la tapa misma; la puerta y el escenario van en tinta y rayones, como el dibujo del frente. Es
 * la noche de la Esquina del Sol que cuenta `RES-340`: la sala inundada, la banda que toca igual,
 * el vidrio de la puerta roto.
 *
 * Pierre está en coordenadas de títere: el (0, 0) es el agua debajo del medio de la panza, y
 * arriba es negativo. La luz entra por la puerta, arriba a la izquierda de él. La escena lo pone
 * en su lugar (`rig.ts`, `PIERRE`).
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar, mancha, pincelada, tinta, volumen, type P, type Pincel } from './pincel.ts';
import { BAJO, PIERRE, PIERRE_ARMADO as A } from './rig.ts';

const T = {
  papel: 'var(--disco-gulp-apoyo)',
  canto: 'var(--papel-borde)',
  negro: 'var(--fondo)',
  rojo: 'var(--disco-gulp-tinta)',
  amarillo: 'var(--bestia-pierre-amarillo)',
  verde: 'var(--bestia-pierre-verde)',
  noche: 'var(--entorno-bajo-agua)',
  luz: 'var(--acento-2)',
};

/** De dónde viene la luz: la puerta, arriba a la izquierda. */
const LUZ: P = [-0.34, -0.36];

const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;

/** La caja de un camino hecho de pares de números absolutos. */
function cajaDe(d: string, aire = 0): readonly [number, number, number, number] {
  const n = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  const x0 = Math.min(...xs) - aire;
  const y0 = Math.min(...ys) - aire;
  return [x0, y0, Math.max(...xs) + aire - x0, Math.max(...ys) + aire - y0];
}

/** Una pincelada de contorno: cargada, que casi no se seca. */
const linea = (r: readonly P[], ancho: number, semilla: number, seco = 0.08): string =>
  pincelada(r, { ancho, seco, apoyo: [0.35, 0.45], grano: 22 }, semilla);

/** Una mancha de sombra en una zona, con el pincel en un ángulo. */
const sombra = (id: string, d: string, angulo: number, ancho: number, seco: number, semilla: number, curva = 0.1): string =>
  mancha(id, d, cajaDe(d, 4), { ancho, seco, angulo, curva, grano: 14, apoyo: [0.7, 0.8] }, semilla);

/** Pinceladas de color corridas, como las letras de *Gulp!*: el amarillo asoma debajo del rojo. */
function colorCorrido(recorridos: ReadonlyArray<readonly P[]>, pincel: Pincel, semilla: number): string {
  const pasadas = (color: string): string => recorridos.map((r, i) => pincelada(r, { ...pincel, tinta: color }, semilla + i)).join('');
  return `<g transform="translate(3 2.6)">${tinta(pasadas(T.amarillo))}</g>${tinta(pasadas(T.rojo))}`;
}

/**
 * El papel recortado, con su canto. Adentro va lo pintado. `canto` dice entre qué puntos del
 * recorte se ve el borde del papel: donde una pieza queda tapada por otra (la quijada debajo de
 * la cabeza) el canto no se dibuja, así la costura del títere no corta la cara.
 */
function recorte(id: string, pts: readonly P[], adentro: string, canto?: readonly [number, number]): string {
  const borde = canto
    ? `M${pts.slice(canto[0], canto[1] + 1).map(([x, y]) => `${x} ${y}`).join(' L')}`
    : poli(pts);
  return enmascarado(id, poli(pts), forma(poli(pts), T.papel) + adentro) + trazo(borde, T.canto, 1.6, 0.9);
}

/**
 * Unos dedos gordos: salchichas de papel, cada una con su sombra abajo y el borde de pincel que
 * la separa de la siguiente. `centros` son los de cada dedo, `[rx, ry]` su tamaño y `giro`
 * hacia dónde apuntan.
 */
function dedos(id: string, centros: readonly P[], [rx, ry]: P, giro: number, seco: number, semilla: number): string {
  return centros
    .map(([x, y], i) =>
      `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${giro} ${x} ${y})" fill="${T.papel}"/>` +
      tinta(
        volumen(`${id}-${i}`, [x, y], [rx, ry], LUZ, { ancho: ry * 0.8, seco, grano: 8 }, semilla + i, { vueltas: 2, giro, hondo: 1.1 }) +
          `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${giro} ${x} ${y})" fill="none" stroke="${T.negro}" stroke-width="2"/>`,
      ),
    )
    .join('');
}

/** La noche sobre el papel, soplada del lado contrario a la puerta. */
const noche = (cx: number, cy: number, rx: number, ry: number, o: number): string => nube(cx, cy, rx, ry, T.noche, 'xl', o);
/** La luz de la calle que entra por el vidrio roto, apenas tibia sobre el papel. */
const tibia = (cx: number, cy: number, rx: number, ry: number): string => nube(cx, cy, rx, ry, T.luz, 'xl', 0.13);

/* ------------------------------------------------------------------
   La cabeza: pelado, peinado para el costado, la nariz roja y el bigote
   ------------------------------------------------------------------ */

const CABEZA: readonly P[] = [
  [-116, -198], [-122, -214], [-124, -238], [-124, -258], [-130, -280], [-124, -302], [-110, -312], [-102, -342], [-80, -372], [-44, -394], [0, -402], [44, -394], [80, -372], [102, -342], [110, -312], [124, -302], [130, -280], [124, -258], [124, -238], [122, -214], [116, -198], [100, -206], [72, -222], [60, -238], [30, -247], [0, -250], [-30, -247], [-60, -238], [-72, -222], [-100, -206],
];

/**
 * Un ojo achinado por la risa: el párpado de arriba se arquea, el cachete empuja el de abajo
 * para arriba, y entre los dos queda una medialuna con la pupila que brilla. Ojos de gente, como
 * los de los bichos de Rocambole, no de muñeco.
 */
function ojo([cx, cy]: P, lado: number, semilla: number): string {
  const e = 1.36;
  const X = (v: number): number => cx + v * e;
  const Y = (v: number): number => cy + v * e;
  const ojoD = `M${X(-19)} ${Y(2)} C${X(-10)} ${Y(-10)} ${X(10)} ${Y(-10)} ${X(19)} ${Y(2)} C${X(10)} ${Y(-3)} ${X(-10)} ${Y(-3)} ${X(-19)} ${Y(2)} Z`;
  return (
    // La cuenca: lo oscuro debajo de la ceja, más hondo del lado de la noche.
    sombra(`pk-cuenca-${semilla}`, `M${X(-25)} ${Y(-2)} C${X(-18)} ${Y(-22)} ${X(18)} ${Y(-25)} ${X(28)} ${Y(-4)} C${X(30)} ${Y(4)} ${X(25)} ${Y(7)} ${X(21)} ${Y(2)} C${X(10)} ${Y(-11)} ${X(-12)} ${Y(-12)} ${X(-25)} ${Y(-2)} Z`, 4, 7, lado > 0 ? 0.06 : 0.24, semilla) +
    `<clipPath id="pk-ojo-${semilla}"><path d="${ojoD}"/></clipPath>` +
    `<g clip-path="url(#pk-ojo-${semilla})"><circle cx="${X(lado * 1.5)}" cy="${Y(-3)}" r="${6.4 * e}" fill="${T.negro}"/></g>` +
    `<circle cx="${X(lado * 1.5 - 2.6)}" cy="${Y(-4.6)}" r="1.6" fill="${T.papel}"/>` +
    // El párpado de arriba, arqueado, y el de abajo, empujado por el cachete.
    linea([[X(-21), Y(3)], [X(-11), Y(-12)], [X(11), Y(-12)], [X(21), Y(3)]], 5.4, semilla + 1) +
    linea([[X(-17), Y(2)], [X(-8), Y(-3)], [X(8), Y(-3)], [X(17), Y(2)]], 2.8, semilla + 2, 0.15) +
    linea([[X(-15), Y(8)], [X(-6), Y(4)], [X(6), Y(4)], [X(15), Y(8)]], 2.2, semilla + 3, 0.4) +
    // Las patas de gallo, del lado de afuera.
    linea([[X(lado * 21), Y(0)], [X(lado * 26), Y(-4)], [X(lado * 30), Y(-6)], [X(lado * 34), Y(-8)]], 2, semilla + 4, 0.25) +
    linea([[X(lado * 21), Y(4)], [X(lado * 27), Y(5)], [X(lado * 31), Y(6)], [X(lado * 35), Y(8)]], 2, semilla + 5, 0.25) +
    linea([[X(lado * 20), Y(7)], [X(lado * 24), Y(11)], [X(lado * 27), Y(14)], [X(lado * 30), Y(17)]], 1.8, semilla + 6, 0.35)
  );
}

function cabeza(): string {
  const [ojo1, ojo2] = A.ojos;
  const bigote =
    'M-2 -264 C-22 -268 -48 -264 -66 -252 C-74 -246 -78 -238 -76 -230 C-64 -238 -40 -246 -20 -248 C-10 -249 -4 -250 0 -250 ' +
    'C4 -250 10 -249 20 -248 C40 -246 64 -238 76 -230 C78 -238 74 -246 66 -252 C48 -264 22 -268 2 -264 Z';
  const nariz = 'M-18 -282 C-24 -294 -12 -302 -2 -298 C8 -304 24 -296 20 -282 C28 -272 20 -258 6 -261 C-2 -255 -22 -258 -22 -268 C-27 -272 -25 -279 -18 -282 Z';
  const pintado =
    // Lo oscuro de la cabeza entera: la medialuna de abajo a la derecha, que da la vuelta.
    volumen('pk-v-cabeza', [0, -300], [120, 104], LUZ, { ancho: 20, seco: 0.2, grano: 14 }, 701, { vueltas: 7, abre: 1.1, hondo: 1.55 }) +
    // El cachete y la quijada del lado de la noche, más hondos.
    volumen('pk-v-quijada', [66, -236], [54, 38], LUZ, { ancho: 14, seco: 0.15, grano: 12 }, 702, { vueltas: 4, hondo: 1.5 }) +
    // La frente: dos arrugas, porque se ríe con toda la cara.
    linea([[-46, -370], [-20, -376], [12, -376], [40, -370]], 2.2, 703, 0.4) +
    linea([[-30, -362], [-12, -366], [10, -366], [26, -362]], 1.8, 704, 0.5) +
    // El peinado de costado: pelos largos que cruzan el pelado, de oreja a oreja.
    linea([[-92, -330], [-56, -378], [10, -394], [70, -370]], 2.2, 705, 0.25) +
    linea([[-96, -322], [-52, -370], [14, -384], [74, -360]], 2, 706, 0.3) +
    linea([[-94, -314], [-48, -360], [16, -374], [80, -350]], 1.8, 707, 0.35) +
    // El pelo de los costados, y las orejas con lo hondo adentro.
    pincelada([[-104, -336], [-104, -318], [-106, -300], [-110, -286]], { ancho: 18, seco: 0.4, grano: 8 }, 708) +
    pincelada([[104, -336], [104, -318], [106, -300], [110, -286]], { ancho: 18, seco: 0.25, grano: 8 }, 709) +
    linea([[-112, -298], [-124, -290], [-124, -270], [-114, -260]], 4, 710) +
    linea([[112, -298], [124, -290], [124, -270], [114, -260]], 4, 711) +
    pincelada([[116, -290], [118, -280], [118, -272], [116, -266]], { ancho: 7, seco: 0.1 }, 712) +
    // Las cejas: gruesas, levantadas, con los pelos de la punta sueltos.
    pincelada([[-74, -330], [-62, -352], [-36, -358], [-14, -346]], { ancho: 11, seco: 0.22, apoyo: [0.4, 0.55], grano: 14 }, 713) +
    pincelada([[14, -346], [36, -358], [62, -352], [76, -330]], { ancho: 11, seco: 0.22, apoyo: [0.55, 0.4], grano: 14 }, 714) +
    ojo(ojo1.centro, -1, 720) +
    ojo(ojo2.centro, 1, 730) +
    // Los cachetes, dos manzanas empujadas para arriba por la risa: la sombra les queda abajo.
    volumen('pk-v-cachete-1', [-56, -258], [36, 26], LUZ, { ancho: 9, seco: 0.3, grano: 10 }, 740, { vueltas: 3, hondo: 1.3 }) +
    volumen('pk-v-cachete-2', [58, -258], [36, 26], LUZ, { ancho: 10, seco: 0.12, grano: 10 }, 741, { vueltas: 3, hondo: 1.5 }) +
    // El contorno del lado de la luz: roto, que la luz se lo come.
    linea([[-104, -334], [-112, -312], [-118, -290], [-120, -270]], 2.4, 744, 0.55) +
    linea([[-122, -252], [-122, -236], [-118, -220], [-112, -206]], 2.6, 745, 0.45) +
    linea([[-46, -390], [-70, -380], [-88, -364], [-98, -346]], 2, 746, 0.6) +
    // El surco de la nariz a la comisura, tapado a medias por el bigote.
    linea([[-24, -266], [-38, -258], [-50, -246], [-58, -232]], 3, 742, 0.3) +
    linea([[26, -266], [40, -258], [52, -246], [60, -232]], 3.4, 743, 0.2);
  // La nariz: una papa colorada de vino, pintada en rojo sobre amarillo corrido, con su sombra.
  const pasadasNariz = (color: string, semilla: number): string => {
    let r = '';
    for (let y = -308, i = 0; y < -250; y += 6, i++) r += pincelada([[-32, y], [-12, y - 3], [12, y + 1], [32, y - 1]], { ancho: 9, seco: 0.3, grano: 11, tinta: color }, semilla + i);
    return r;
  };
  const laNariz =
    `<clipPath id="pk-nariz-a"><path d="${nariz}" transform="translate(4.4 4)"/></clipPath><clipPath id="pk-nariz-r"><path d="${nariz}"/></clipPath>` +
    tinta(`<g clip-path="url(#pk-nariz-a)"><g transform="translate(4.4 4)">${pasadasNariz(T.amarillo, 752)}</g></g>`) +
    tinta(`<g clip-path="url(#pk-nariz-r)">${pasadasNariz(T.rojo, 762)}</g>`) +
    tinta(
      volumen('pk-v-nariz', [2, -279], [23, 21], LUZ, { ancho: 6, seco: 0.15, grano: 8 }, 750, { vueltas: 3, hondo: 1.3 }) +
        linea([[-6, -326], [-8, -312], [-12, -302], [-16, -296]], 3, 751, 0.25) +
        linea([[-24, -272], [-22, -260], [-8, -255], [6, -257]], 2.6, 753, 0.25),
    ) +
    `<ellipse cx="-9" cy="-264" rx="3.6" ry="2.6" fill="${T.negro}"/><ellipse cx="12" cy="-262" rx="3.8" ry="2.8" fill="${T.negro}"/>`;
  // El bigote: una mancha negra con la pasada para abajo, como pelo, y pelos sueltos en las puntas.
  const elBigote = tinta(
    sombra('pk-bigote', bigote, 96, 7, 0.08, 760, 0.05) +
      linea([[-70, -236], [-76, -232], [-82, -230], [-86, -230]], 2.2, 761, 0.3) +
      linea([[70, -236], [76, -232], [82, -230], [86, -230]], 2.2, 762, 0.3),
  );
  // Los cachetes colorados de vino: pinceladas rojas cortas, corridas.
  const colorado = colorCorrido(
    [
      [[-80, -262], [-70, -272], [-56, -276], [-42, -272]],
      [[-76, -254], [-64, -262], [-52, -264], [-40, -262]],
      [[42, -272], [56, -276], [70, -272], [80, -262]],
    ],
    { ancho: 10, seco: 0.62, grano: 7 },
    770,
  );
  // Dos gotas de sudor: el papel brilla y abajo hay una sombrita.
  const gota = (x: number, y: number, s: number): string =>
    forma(`M${x} ${y - 9} C${x + 5} ${y - 2} ${x + 6} ${y + 4} ${x} ${y + 5} C${x - 6} ${y + 4} ${x - 5} ${y - 2} ${x} ${y - 9} Z`, T.papel) +
    tinta(linea([[x + 1, y - 8], [x + 6, y - 1], [x + 4, y + 5], [x - 3, y + 5]], 2.2, s, 0.15));
  return recorte(
    'pk-papel',
    CABEZA,
    tibia(-50, -330, 80, 60) +
      colorado +
      tinta(pintado) +
      laNariz +
      elBigote +
      gota(-30, -372, 780) +
      gota(52, -362, 781) +
      gota(92, -316, 782) +
      noche(118, -300, 46, 100, 0.55),
    [0, 20],
  );
}

/* ------------------------------------------------------------------
   La boca y la mandíbula: lo que se abre cuando se ríe y cuando tose
   ------------------------------------------------------------------ */

/** Lo de adentro: oscuro, con los dientes de arriba y la lengua. Queda quieto, atrás. */
function boca(): string {
  const d = 'M-52 -248 C-30 -253 30 -253 52 -248 C48 -224 26 -206 0 -204 C-26 -206 -48 -224 -52 -248 Z';
  let dientes = '';
  for (let i = 0; i < 6; i++) {
    const x = -31 + i * 10.4;
    dientes += forma(`M${x} -248 L${x + 9} -248 L${x + 8.4} -239 C${x + 6} -236 ${x + 3} -236 ${x + 0.8} -239 Z`, T.papel);
  }
  return forma(d, T.negro) + dientes + nube(0, -214, 24, 9, T.rojo, 's', 0.9);
}

const MANDIBULA: readonly P[] = [
  [-58, -252], [-40, -246], [-20, -239], [0, -236], [20, -239], [40, -246], [58, -252], [96, -236], [118, -216], [118, -194], [106, -174], [82, -158], [42, -148],
  [0, -146], [-42, -148], [-82, -158], [-106, -174], [-118, -194], [-118, -216], [-96, -236],
];

function mandibula(): string {
  const pintado =
    // El labio de abajo, gordo, con su sombra.
    volumen('pm-v-labio', [0, -230], [36, 9], LUZ, { ancho: 5, seco: 0.15, grano: 10 }, 801, { vueltas: 2, hondo: 1.3 }) +
    linea([[-44, -246], [-22, -237], [22, -237], [44, -246]], 3.4, 802, 0.12) +
    // La pera, y el pliegue que la separa de la papada.
    volumen('pm-v-pera', [0, -212], [44, 22], LUZ, { ancho: 9, seco: 0.22, grano: 10 }, 803, { vueltas: 3, hondo: 1.4 }) +
    pincelada([[-76, -196], [-40, -184], [40, -184], [80, -198]], { ancho: 10, seco: 0.2, grano: 14 }, 804) +
    // La papada: la forma más grande de abajo, con la sombra que se le hunde debajo.
    volumen('pm-v-papada', [0, -172], [98, 30], LUZ, { ancho: 13, seco: 0.15, grano: 12 }, 805, { vueltas: 4, abre: 1.3, hondo: 1.6 }) +
    volumen('pm-v-quijada', [72, -210], [34, 42], LUZ, { ancho: 12, seco: 0.12, grano: 10 }, 806, { vueltas: 3, hondo: 1.5 });
  return recorte('pm-papel', MANDIBULA, tibia(-40, -220, 50, 40) + tinta(pintado) + noche(96, -196, 36, 50, 0.5), [7, 19]);
}

/* ------------------------------------------------------------------
   El cuerpo: la panza, la camisa que no da más, el saco abierto
   ------------------------------------------------------------------ */

/** El recorte del cuerpo, a tijera: tramos rectos. Abajo sigue debajo del agua. */
const CUERPO: readonly P[] = [
  [-146, -204], [-116, -218], [-78, -226], [-40, -216], [40, -216], [78, -226], [116, -218], [146, -204],
  [176, -176], [198, -140], [214, -96], [222, -50], [222, -4], [216, 36], [208, 70], [-208, 70], [-216, 36],
  [-222, -4], [-222, -50], [-214, -96], [-198, -140], [-176, -176],
];

/** Los dos paños del saco, por adentro del recorte. */
const SACO_IZQ = 'M-142 -198 C-118 -214 -90 -220 -66 -216 C-76 -186 -92 -150 -104 -110 C-116 -66 -120 -24 -122 74 L-212 74 C-220 20 -222 -40 -214 -92 C-204 -140 -176 -180 -142 -198 Z';
const SACO_DER = 'M144 -198 C120 -214 92 -220 68 -216 C80 -186 96 -150 108 -108 C120 -64 124 -24 126 74 L212 74 C220 20 222 -40 214 -92 C204 -140 178 -180 144 -198 Z';
/** La manga del brazo que se agarra la panza: viene del costado de la noche. */
const MANGA = 'M206 -146 C184 -122 156 -106 128 -98 L120 -78 C148 -76 182 -90 214 -110 Z';

function cuerpo(): string {
  // La panza: la camisa, una bola con la luz arriba a la izquierda.
  const panza =
    volumen('pc-v-panza', [0, -64], [176, 140], LUZ, { ancho: 22, seco: 0.28, grano: 13 }, 901, { vueltas: 7, abre: 1.05, hondo: 1.35 }) +
    // La sombra que tira la papada sobre la camisa.
    sombra('pc-bajo-papada', 'M-96 -176 C-70 -132 -30 -112 10 -112 C50 -112 84 -130 104 -170 L104 -190 L-96 -190 Z', 4, 10, 0.08, 902, 0.06);
  // El saco: el paño de la luz deja ver la tela; el de la noche, casi negro.
  const saco =
    sombra('pc-saco-izq', SACO_IZQ, 96, 20, 0.34, 903, 0.08) +
    sombra('pc-saco-der', SACO_DER, 84, 20, 0.14, 904, 0.08) +
    sombra('pc-manga', MANGA, -32, 14, 0.12, 905) +
    // Los bordes de las solapas, donde el saco se abre sobre la panza.
    linea([[-66, -214], [-84, -170], [-96, -110], [-100, -40]], 4, 906, 0.2) +
    linea([[68, -214], [88, -170], [100, -110], [106, -40]], 4, 907, 0.1);
  // Los botones, con la tela tirando en X: la camisa no da más.
  let botones = '';
  ([[4, -128], [10, -90], [12, -50], [8, -10]] as const).forEach(([x, y], i) => {
    botones += `<circle cx="${x}" cy="${y}" r="3.8" fill="${T.negro}"/>`;
    botones += linea([[x - 4, y - 3], [x - 14, y - 9], [x - 26, y - 12], [x - 38, y - 12]], 2.4, 910 + i, 0.3);
    botones += linea([[x + 4, y + 3], [x + 16, y + 9], [x + 28, y + 12], [x + 40, y + 11]], 2.4, 920 + i, 0.3);
    botones += linea([[x - 4, y + 3], [x - 12, y + 9], [x - 20, y + 12], [x - 30, y + 14]], 2, 930 + i, 0.4);
  });
  botones += linea([[2, -150], [8, -100], [14, -40], [8, 50]], 2.6, 940, 0.4);
  // La mano que se agarra la panza, del lado de la noche: casi toda sombra, con la luz que apenas
  // le toca los nudillos y la punta de los dedos.
  const dedosD = ([[72, -74], [88, -64], [106, -60], [124, -62]] as const)
    .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="17" ry="8.5" transform="rotate(62 ${x} ${y})"/>`)
    .join('');
  const manoD = `<ellipse cx="116" cy="-94" rx="31" ry="23" transform="rotate(-20 116 -94)"/>${dedosD}`;
  const mano =
    `<clipPath id="pc-mano">${manoD}</clipPath>` +
    tinta(
      `<g clip-path="url(#pc-mano)">` +
        mancha('pc-mano-negra', 'M40 -130 L150 -130 L150 -40 L40 -40 Z', [40, -130, 110, 90], { ancho: 9, seco: 0.06, angulo: 62, grano: 14 }, 941) +
        `</g>` +
        sombra('pc-bajo-mano', 'M50 -50 C76 -38 108 -38 134 -52 L138 -38 C108 -24 74 -26 48 -38 Z', 0, 7, 0.1, 942),
    ) +
    tinta(
      linea([[96, -112], [108, -116], [120, -114], [130, -108]], 2.6, 943, 0.3).replaceAll(T.negro, T.papel) +
        ([[66, -84], [82, -74], [100, -70], [118, -72]] as const)
          .map(([x, y], i) => linea([[x - 4, y - 6], [x - 1, y - 2], [x + 2, y + 2], [x + 4, y + 6]], 2.2, 944 + i, 0.35).replaceAll(T.negro, T.papel))
          .join(''),
    );
  // La corbata: aflojada, se cae por la ladera de la panza. Roja sobre amarilla, corrida.
  const corbata = 'M-4 -152 L12 -154 C24 -132 38 -110 50 -86 L36 -74 C22 -98 8 -124 -4 -152 Z';
  const pasadasCorbata = (color: string, semilla: number): string => {
    let r = '';
    for (let i = 0; i < 6; i++) r += pincelada([[-8 + i * 3, -156], [6 + i * 3, -132], [22 + i * 3, -106], [34 + i * 3, -80]], { ancho: 7, seco: 0.28, grano: 12, tinta: color }, semilla + i);
    return r;
  };
  const laCorbata =
    `<clipPath id="pc-corbata-a"><path d="${corbata}" transform="translate(3.6 3)"/></clipPath><clipPath id="pc-corbata-r"><path d="${corbata}"/></clipPath>` +
    tinta(`<g clip-path="url(#pc-corbata-a)"><g transform="translate(3.6 3)">${pasadasCorbata(T.amarillo, 952)}</g></g>`) +
    tinta(`<g clip-path="url(#pc-corbata-r)">${pasadasCorbata(T.rojo, 960)}</g>`) +
    tinta(linea([[12, -154], [26, -130], [38, -108], [50, -86]], 2.6, 950, 0.3) + sombra('pc-bajo-corbata', 'M38 -72 L52 -84 L58 -78 L44 -64 Z', 45, 5, 0.2, 951));
  return recorte(
    'pc-papel',
    CUERPO,
    tibia(-70, -90, 120, 110) +
      tinta(panza + saco + botones) +
      mano +
      laCorbata +
      noche(210, -40, 90, 180, 0.55) +
      noche(0, 56, 230, 46, 0.55),
  );
}

/* ------------------------------------------------------------------
   El brazo de la botella: el de arriba y el antebrazo con la mano
   ------------------------------------------------------------------ */

const BRAZO: readonly P[] = [
  [-172, -216], [-136, -218], [-114, -198], [-116, -168], [-138, -134], [-174, -102], [-212, -86], [-246, -94],
  [-258, -122], [-246, -152], [-214, -186],
];

function brazo(): string {
  const manga = 'M-166 -208 C-142 -212 -122 -198 -122 -176 C-128 -148 -158 -118 -200 -96 C-226 -88 -248 -104 -250 -126 C-242 -156 -204 -198 -166 -208 Z';
  return recorte(
    'pb-papel',
    BRAZO,
    tinta(
      sombra('pb-manga', manga, 140, 18, 0.26, 1001, 0.1) +
        volumen('pb-v', [-182, -150], [64, 48], LUZ, { ancho: 13, seco: 0.08, grano: 12 }, 1002, { vueltas: 3, giro: -32, hondo: 1.3 }) +
        // Los pliegues del codo, donde la manga se arruga.
        linea([[-206, -112], [-216, -118], [-226, -118], [-236, -114]], 2.6, 1003, 0.35) +
        linea([[-200, -124], [-210, -132], [-222, -134], [-232, -130]], 2.2, 1004, 0.45),
    ),
  );
}

const ANTEBRAZO: readonly P[] = [
  [-258, -118], [-236, -86], [-202, -94], [-188, -130], [-180, -172], [-176, -206], [-170, -232], [-182, -258],
  [-196, -262], [-196, -334], [-204, -350], [-222, -348], [-228, -334], [-228, -262], [-244, -256], [-254, -230],
  [-252, -192], [-256, -150],
];

/** La botella: verde como la letra del frente de *Gulp!*. */
const BOTELLA = 'M-224 -238 L-224 -288 C-224 -298 -216 -302 -214 -310 L-214 -342 L-206 -342 L-206 -310 C-204 -302 -196 -298 -196 -288 L-196 -238 C-196 -232 -224 -232 -224 -238 Z';

/**
 * La etiqueta: el «gulp.» pegado en la contratapa de *Gulp!*, recortado de la tapa al imprimir.
 * `ETIQUETA` es el cuadrilátero del papelito en la contratapa (llevada a 953 de ancho), y
 * `EN_LA_BOTELLA` dónde va sobre el vidrio. Es lo único de Pierre que sale de una tapa.
 */
export const ETIQUETA: readonly P[] = [[522, 225], [667, 211], [675, 267], [521, 300]];
const EN_LA_BOTELLA = { x: -226, y: -286, ancho: 31, giro: -3 };

function antebrazo(): string {
  const xs = ETIQUETA.map((p) => p[0]);
  const ys = ETIQUETA.map((p) => p[1]);
  const k = EN_LA_BOTELLA.ancho / (Math.max(...xs) - Math.min(...xs));
  const etiqueta =
    `<clipPath id="pa-etiqueta"><path d="${poli(ETIQUETA)}"/></clipPath>` +
    `<g transform="translate(${EN_LA_BOTELLA.x} ${EN_LA_BOTELLA.y}) rotate(${EN_LA_BOTELLA.giro}) scale(${k.toFixed(4)}) translate(${-Math.min(...xs)} ${-Math.min(...ys)})">` +
    `<g clip-path="url(#pa-etiqueta)"><image href="tapa:gulp-trasera" x="0" y="0" width="953" height="750" preserveAspectRatio="none"/></g></g>`;
  const vidrio =
    forma(BOTELLA, T.verde) +
    tinta(
      sombra('pa-botella', 'M-210 -304 L-196 -292 L-196 -236 L-212 -234 Z', 90, 5, 0.2, 1101) +
        linea([[-224, -240], [-224, -266], [-224, -290], [-216, -308]], 2.2, 1102, 0.3) +
        linea([[-206, -342], [-206, -328], [-206, -318], [-204, -310]], 2, 1103, 0.2),
    ) +
    nube(-218, -270, 2.4, 24, T.papel, 's', 0.8) +
    nube(-210, -326, 1.4, 10, T.papel, 'xs', 0.7) +
    etiqueta;
  const manga = 'M-248 -124 C-246 -150 -236 -180 -222 -206 L-184 -202 C-190 -172 -196 -140 -200 -104 C-216 -92 -240 -102 -248 -124 Z';
  // El puño: los dedos gordos cruzados por delante de la botella, y el pulgar arriba.
  const puno =
    `<path d="M-238 -250 C-226 -258 -192 -258 -178 -246 L-176 -206 C-192 -198 -224 -198 -236 -206 Z" fill="${T.papel}"/>` +
    dedos('pa-dedo', [[-208, -246], [-206, -234], [-206, -222], [-208, -210]], [26, 7], -4, 0.25, 1110) +
    `<ellipse cx="-228" cy="-256" rx="14" ry="7" transform="rotate(-30 -228 -256)" fill="${T.papel}"/>` +
    tinta(`<ellipse cx="-228" cy="-256" rx="14" ry="7" transform="rotate(-30 -228 -256)" fill="none" stroke="${T.negro}" stroke-width="2"/>`) +
    // El puño de la camisa, blanco, asomando de la manga.
    tinta(linea([[-236, -200], [-222, -194], [-204, -194], [-188, -198]], 3, 1120, 0.15));
  return recorte(
    'pa-papel',
    ANTEBRAZO,
    tinta(sombra('pa-manga', manga, 100, 16, 0.2, 1121, 0.06) + volumen('pa-v', [-220, -150], [30, 60], LUZ, { ancho: 10, seco: 0.1, grano: 10 }, 1122, { vueltas: 3, hondo: 1.3 })) +
      vidrio +
      puno +
      tibia(-214, -240, 24, 20) +
      noche(-186, -150, 26, 60, 0.4),
  );
}

/* ------------------------------------------------------------------
   Las piezas que se imprimen
   ------------------------------------------------------------------ */

const caja = (pts: readonly P[], aire = 6): readonly [number, number, number, number] => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.floor(Math.min(...xs) - aire);
  const y0 = Math.floor(Math.min(...ys) - aire);
  return [x0, y0, Math.ceil(Math.max(...xs) + aire) - x0, Math.ceil(Math.max(...ys) + aire) - y0];
};

export const PIEZAS_PIERRE: readonly Pieza[] = [
  { nombre: 'pierre-cuerpo', caja: caja(CUERPO), dibujo: cuerpo(), densidad: 2.4 },
  { nombre: 'pierre-boca', caja: [-58, -258, 116, 58], dibujo: boca(), densidad: 2.4 },
  { nombre: 'pierre-mandibula', caja: caja(MANDIBULA), dibujo: mandibula(), densidad: 2.4 },
  { nombre: 'pierre-cabeza', caja: caja(CABEZA), dibujo: cabeza(), densidad: 2.4 },
  { nombre: 'pierre-brazo', caja: caja(BRAZO), dibujo: brazo(), densidad: 2.4 },
  { nombre: 'pierre-antebrazo', caja: caja(ANTEBRAZO), dibujo: antebrazo(), densidad: 2.4 },
];

/* ------------------------------------------------------------------
   El bajo: la sala de la Esquina del Sol, de noche y con el agua adentro
   ------------------------------------------------------------------
   *Un baión* tiene dos dibujos: el crayón azul de la contratapa, rayado a pasadas largas, y el
   frente, donde las cosas van en tinta negra de fibra con relleno de rayones. La pared es la
   contratapa misma; la puerta, la ventana, el escenario y lo que flota van en la manera del frente.
*/

const B = {
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  luzFria: 'var(--entorno-baion-luz)',
  azul: 'var(--entorno-baion-azul)',
  rosa: 'var(--entorno-baion-rosa)',
  agua: 'var(--entorno-bajo-agua)',
  celeste: 'var(--entorno-bajo-celeste)',
  llama: 'var(--entorno-bajo-llama)',
  llamaClara: 'var(--entorno-bajo-llama-clara)',
  negro: 'var(--fondo)',
  oro: 'var(--acento-2)',
  rojo: 'var(--disco-gulp-tinta)',
};

export const ESCENA_BAJO = { ancho: 900, alto: 640 } as const;

interface Rayado {
  angulo?: number;
  largo?: readonly [number, number];
  grueso?: readonly [number, number];
  opacidad?: readonly [number, number];
  temblor?: number;
}

/** Rayones de crayón en una caja, todos para un mismo lado (con un poco de temblor). */
function rayado([x0, y0, x1, y1]: readonly [number, number, number, number], cuantos: number, colores: readonly string[], semilla: number, r: Rayado = {}): string {
  const { angulo = 60, largo = [8, 30], grueso = [2, 4.4], opacidad = [0.45, 0.9], temblor = 0.35 } = r;
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * (y1 - y0);
    const a = ((angulo + (rnd() - 0.5) * temblor * 90) * Math.PI) / 180;
    const l = largo[0] + rnd() * (largo[1] - largo[0]);
    const color = colores[Math.floor(rnd() * colores.length)]!;
    const d = `M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}`;
    s += trazo(d, color, grueso[0] + rnd() * (grueso[1] - grueso[0]), opacidad[0] + rnd() * (opacidad[1] - opacidad[0]));
  }
  return s;
}

/** Una línea de fibra, temblada a mano, como el contorno de las cosas en el frente de *Un baión*. */
function fibra(pts: readonly P[], ancho: number, semilla: number, color = B.negro, cerrada = false): string {
  const rnd = azar(semilla);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x + (rnd() - 0.5) * 2.4).toFixed(1)} ${(y + (rnd() - 0.5) * 2.4).toFixed(1)}`).join(' ');
  return trazo(cerrada ? `${d} Z` : d, color, ancho);
}

/** El agujero del vidrio roto: una estrella despareja alrededor de donde pegó. */
export function agujero(): readonly P[] {
  const rnd = azar(1307);
  const { x, y } = BAJO.agujero;
  const pts: P[] = [];
  // No es una estrella: el vidrio se rompe para donde quiere. Pocas puntas, de largo muy distinto,
  // y entre punta y punta el canto se quiebra en dos o tres tramos.
  let a = -Math.PI / 2;
  while (a < Math.PI * 1.5 - 0.3) {
    const r = 22 + rnd() * rnd() * 52;
    pts.push([x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r]);
    const tramos = 1 + Math.floor(rnd() * 2);
    const paso = 0.42 + rnd() * 0.5;
    for (let k = 1; k <= tramos; k++) {
      const b = a + (paso * k) / (tramos + 1);
      const rr = 12 + rnd() * 14;
      pts.push([x + Math.cos(b) * rr * 1.1, y + Math.sin(b) * rr]);
    }
    a += paso;
  }
  return pts.map(([px, py]) => [Math.round(px * 10) / 10, Math.round(py * 10) / 10] as const);
}

/**
 * El pedazo de la contratapa de *Un baión* que es crayón y nada más: sin el título, sin la lista
 * de temas, sin el lomo y sin la llama de abajo. En la contratapa llevada a 953 de ancho.
 */
const CRAYON_LIMPIO = [292, 158, 630, 590] as const;

/** La puerta: el vidrio de arriba y la madera; abajo se pierde en el agua. */
export const PUERTA = { x0: 112, x1: 286, arriba: 64, vidrio: [134, 92, 262, 262] as const };

const rect = (x0: number, y0: number, x1: number, y1: number): string => `M${x0} ${y0} L${x1} ${y0} L${x1} ${y1} L${x0} ${y1} Z`;

function puerta(): string {
  const { fondo } = BAJO;
  const [vx0, vy0, vx1, vy1] = PUERTA.vidrio;
  const hueco = agujero();
  // Las rajaduras: de cada punta del agujero, una raya que corre hasta el marco, quebrándose.
  const rnd = azar(1302);
  let rajas = '';
  hueco.forEach(([x, y], i) => {
    if (i % 2) return;
    const a = Math.atan2(y - BAJO.agujero.y, x - BAJO.agujero.x);
    const pts: P[] = [[x, y]];
    let [px, py] = [x, y];
    for (let k = 0; k < 4; k++) {
      const b = a + (rnd() - 0.5) * 0.6;
      const l = 14 + rnd() * 22;
      px = Math.min(vx1 - 2, Math.max(vx0 + 2, px + Math.cos(b) * l));
      py = Math.min(vy1 - 2, Math.max(vy0 + 2, py + Math.sin(b) * l));
      pts.push([px, py]);
    }
    rajas += fibra(pts, 1.6, 1310 + i);
  });
  // Lo de afuera, por el vidrio: la calle mojada con el farol, tibia.
  const calle =
    forma(rect(vx0, vy0, vx1, vy1), B.noche) +
    nube(196, 130, 90, 80, B.llama, 'xl', 0.45) +
    nube(204, 120, 40, 36, B.llamaClara, 'l', 0.7) +
    rayado([vx0, vy0, vx1, vy1], 120, [B.llamaClara, B.oro, B.llama], 1320, { angulo: 70, largo: [6, 18], grueso: [1.6, 3], opacidad: [0.35, 0.8] });
  // El vidrio que queda: rayones fríos en diagonal, el reflejo, salvo en el agujero.
  const vidrio =
    `<mask id="bl-vidrio" maskUnits="userSpaceOnUse" x="${vx0}" y="${vy0}" width="${vx1 - vx0}" height="${vy1 - vy0}">` +
    `<path d="${rect(vx0, vy0, vx1, vy1)}" fill="white"/><path d="${poli(hueco)}" fill="black"/></mask>` +
    `<g mask="url(#bl-vidrio)">${forma(rect(vx0, vy0, vx1, vy1), B.violeta, 0.55)}` +
    rayado([vx0, vy0, vx1, vy1], 160, [B.lila, B.luzFria, B.celeste], 1321, { angulo: -38, largo: [10, 34], grueso: [1.6, 3.2], opacidad: [0.3, 0.7], temblor: 0.12 }) +
    `</g>`;
  // La madera de la puerta, rayada en rosa y violeta, con su marco de fibra.
  const hoja = rect(PUERTA.x0, PUERTA.arriba, PUERTA.x1, fondo + 4);
  const madera =
    `<clipPath id="bl-madera"><path d="${hoja} ${rect(vx0, vy0, vx1, vy1)}" clip-rule="evenodd"/></clipPath>` +
    `<g clip-path="url(#bl-madera)">` +
    forma(hoja, B.noche) +
    rayado([PUERTA.x0, PUERTA.arriba, PUERTA.x1, fondo + 4], 260, [B.rosa, B.violeta, B.rosa, B.noche], 1322, { angulo: 92, largo: [12, 40], grueso: [2, 4], opacidad: [0.4, 0.85], temblor: 0.1 }) +
    nube(150, 200, 60, 140, B.llama, 'xl', 0.18) +
    `</g>` +
    fibra([[PUERTA.x0, fondo + 4], [PUERTA.x0, PUERTA.arriba], [PUERTA.x1, PUERTA.arriba], [PUERTA.x1, fondo + 4]], 5, 1323) +
    fibra([[vx0, vy0], [vx1, vy0], [vx1, vy1], [vx0, vy1]], 3.4, 1324, B.negro, true) +
    // El tablero de abajo, y el picaporte.
    fibra([[vx0, fondo + 6], [vx0, vy1 + 18], [vx1, vy1 + 18], [vx1, fondo + 6]], 2.4, 1325) +
    `<circle cx="${PUERTA.x1 - 18}" cy="292" r="5" fill="${B.oro}" opacity="0.8"/>` +
    fibra([[PUERTA.x1 - 23, 292], [PUERTA.x1 - 13, 292]], 2, 1327);
  // El canto del vidrio, filoso: le pega la luz de la calle solo de un lado.
  const canto = hueco.filter(([, y]) => y < BAJO.agujero.y + 6);
  return calle + vidrio + madera + rajas + fibra(canto, 1.4, 1328, B.llamaClara) + fibra(hueco.filter(([, y]) => y >= BAJO.agujero.y), 1.6, 1329, B.negro);
}

/** La ventana de al lado, rota también: adentro no hay luz, y algo mira. */
function ventana(): string {
  return (
    forma('M598 132 L688 128 L690 238 L600 240 Z', B.noche) +
    rayado([598, 128, 690, 240], 70, [B.violeta, B.azul, B.noche], 1330, { angulo: -40, largo: [8, 22], grueso: [1.6, 3], opacidad: [0.3, 0.7] }) +
    forma('M628 160 L640 150 L646 166 L662 160 L654 176 L668 186 L650 190 L652 206 L638 196 L626 206 L628 190 L612 184 L626 176 Z', B.negro, 0.85) +
    fibra([[598, 132], [688, 128], [690, 238], [600, 240]], 4, 1331, B.negro, true) +
    fibra([[644, 130], [644, 238]], 2.6, 1332) +
    fibra([[662, 160], [688, 150]], 1.4, 1333) +
    fibra([[626, 206], [602, 226]], 1.4, 1334) +
    fibra([[652, 206], [664, 238]], 1.4, 1335)
  );
}

/** El escenario: la banda tocó igual. El bafle, el pie del micrófono y el bombo con el sol pintado. */
function escenario(): string {
  const { ancho } = ESCENA_BAJO;
  const { fondo } = BAJO;
  const rayos = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    const p = (r: number): string => `${(790 + Math.cos(a) * r).toFixed(1)} ${(fondo - 62 + Math.sin(a) * r).toFixed(1)}`;
    return trazo(`M${p(16)} L${p(25)}`, B.oro, 2.2, 0.85);
  }).join('');
  const aro = Array.from({ length: 25 }, (_, i): P => [790 + Math.cos((i / 24) * Math.PI * 2) * 34, fondo - 62 + Math.sin((i / 24) * Math.PI * 2) * 34]);
  return (
    forma(`M700 ${fondo - 30} L${ancho + 10} ${fondo - 34} L${ancho + 10} ${fondo + 4} L700 ${fondo + 4} Z`, B.noche) +
    rayado([700, fondo - 34, ancho + 10, fondo + 4], 90, [B.rosa, B.violeta], 1340, { angulo: 2, largo: [14, 40], grueso: [2, 3.6], temblor: 0.05 }) +
    fibra([[700, fondo + 4], [700, fondo - 30], [ancho + 10, fondo - 34]], 3.4, 1341) +
    // El bafle.
    forma(`M724 ${fondo - 140} L804 ${fondo - 142} L806 ${fondo - 30} L726 ${fondo - 30} Z`, B.negro) +
    rayado([730, fondo - 132, 800, fondo - 40], 90, [B.violeta, B.lila], 1343, { angulo: 0, largo: [4, 12], grueso: [1.4, 2.4], temblor: 0.05, opacidad: [0.3, 0.6] }) +
    fibra([[724, fondo - 140], [804, fondo - 142], [806, fondo - 30], [726, fondo - 30]], 3.4, 1344, B.negro, true) +
    fibra([[732, fondo - 120], [798, fondo - 121]], 1.6, 1345, B.lila) +
    // El pie del micrófono, solo, con el cable que se va al agua.
    fibra([[858, fondo - 32], [858, fondo - 168]], 3, 1346) +
    fibra([[842, fondo - 32], [874, fondo - 32]], 3, 1347) +
    `<ellipse cx="858" cy="${fondo - 176}" rx="6" ry="10" fill="${B.negro}"/>` +
    trazo(`M858 ${fondo - 160} C890 ${fondo - 120} 820 ${fondo - 80} 846 ${fondo - 40} C860 ${fondo - 20} 830 ${fondo + 10} 820 ${fondo + 20}`, B.negro, 2) +
    // El bombo, con el sol de la Esquina pintado a crayón en el parche.
    `<circle cx="790" cy="${fondo - 62}" r="34" fill="${B.noche}"/>` +
    `<circle cx="790" cy="${fondo - 62}" r="12" fill="${B.oro}" opacity="0.85"/>` +
    rayado([768, fondo - 84, 812, fondo - 40], 40, [B.oro, B.llama], 1348, { angulo: 30, largo: [4, 10], grueso: [1.6, 2.6], opacidad: [0.5, 0.9] }) +
    rayos +
    fibra(aro, 3.4, 1349) +
    // La lamparita pelada que cuelga arriba del escenario.
    trazo(`M800 -10 L800 ${fondo - 236}`, B.negro, 1.6) +
    nube(800, fondo - 226, 70, 60, B.oro, 'xl', 0.35) +
    nube(800, fondo - 228, 8, 10, B.llamaClara, 's', 0.95)
  );
}

function bajoLejos(): string {
  const { ancho, alto } = ESCENA_BAJO;
  const { fondo } = BAJO;
  // La pared: la contratapa de *Un baión*, llevada a lo oscuro. Es crayón de Rocambole, no un dibujo.
  const pared =
    `<filter id="tapa-de-noche" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.42 0 0 0 0  0 0.4 0 0 0  0 0 0.56 0 0.02  0 0 0 1 0"/></filter>` +
    `<clipPath id="bl-pared"><rect x="-10" y="-10" width="${ancho + 20}" height="${fondo + 12}"/></clipPath>` +
    `<g clip-path="url(#bl-pared)" filter="url(#tapa-de-noche)"><g transform="scale(1.552 1.66) translate(-50 -150)">` +
    `<image href="tapa:un-baion-para-el-ojo-idiota-trasera" x="0" y="0" width="953" height="750" preserveAspectRatio="none"/></g></g>`;
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${B.noche}"/>` +
    pared +
    // Lo oscuro de arriba y de los rincones: la sala está a media luz.
    nube(ancho / 2, -40, 520, 140, B.negro, 'xl', 0.75) +
    nube(440, 170, 120, 160, B.negro, 'xl', 0.35) +
    // El fuego, del lado que da al infierno: tiñe el rincón de la derecha.
    nube(ancho + 20, fondo - 40, 120, 140, B.llama, 'xl', 0.3) +
    puerta() +
    ventana() +
    escenario() +
    // La luz de la calle que entra por el agujero y cruza la sala, apenas: es aerógrafo.
    soplo(`M180 150 L230 150 L640 ${fondo + 4} L300 ${fondo + 4} Z`, B.llama, 'xl', 0.12) +
    soplo(`M190 160 L220 160 L520 ${fondo + 4} L330 ${fondo + 4} Z`, B.llamaClara, 'xl', 0.08) +
    `</g>`
  );
}

/**
 * El agua: de la pared para adelante, a rayones horizontales, más finos y apretados contra el
 * fondo y más gruesos adelante. Se imprime una vez y la escena la usa dos veces: atrás de Pierre
 * y adelante, cortada en la línea donde lo toca, así le tapa la panza de abajo sin costura.
 */
function bajoAgua(): string {
  const { ancho, alto } = ESCENA_BAJO;
  const { fondo } = BAJO;
  // El crayón de la contratapa de *Un baión*, acostado y aplastado: las pasadas largas de
  // Rocambole quedan como el agua vista de costado. Y unas pocas rayas sueltas encima, que brillan.
  // Se toma el pedazo limpio de la contratapa (sin letras ni la llama) y se pone dos veces, el
  // segundo espejado, para que el paño llegue de punta a punta sin estirarse de más.
  const [cx0, cy0, cx1, cy1] = CRAYON_LIMPIO;
  const sx = ancho / 2 / (cx1 - cx0);
  const sy = (alto - fondo + 8) / (cy1 - cy0);
  const paño = (espejo: boolean): string =>
    `<g transform="translate(${espejo ? ancho : 0} ${fondo - 4}) scale(${espejo ? -sx : sx} ${sy}) translate(${-cx0} ${-cy0})">` +
    `<g clip-path="url(#ba-limpio)"><image href="tapa:un-baion-para-el-ojo-idiota-trasera" x="0" y="0" width="953" height="750" preserveAspectRatio="none"/></g></g>`;
  const crayon =
    `<filter id="agua-de-noche" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.36 0 0 0 0  0 0.36 0 0 0  0 0 0.52 0 0.02  0 0 0 1 0"/></filter>` +
    `<clipPath id="ba-limpio"><rect x="${cx0}" y="${cy0}" width="${cx1 - cx0}" height="${cy1 - cy0}"/></clipPath>` +
    `<g filter="url(#agua-de-noche)">${paño(false)}${paño(true)}</g>`;
  let rayas = '';
  for (let banda = 0; banda < 6; banda++) {
    const y0 = fondo + ((alto - fondo) * banda) / 6;
    const y1 = fondo + ((alto - fondo) * (banda + 1)) / 6;
    const k = 0.7 + banda * 0.2;
    rayas += rayado([-20, y0, ancho + 20, y1], 26, [B.celeste, B.lila, B.agua], 1400 + banda, {
      angulo: 0,
      largo: [30 * k, 90 * k],
      grueso: [1.2 * k, 2.4 * k],
      temblor: 0.03,
      opacidad: [0.25, 0.6],
    });
  }
  // Los reflejos: la luz de la calle debajo de la puerta, la lamparita y el fuego del rincón.
  const reflejo = (x0: number, x1: number, y0: number, y1: number, colores: readonly string[], n: number, s: number): string =>
    rayado([x0, y0, x1, y1], n, colores, s, { angulo: 0, largo: [10, 44], grueso: [1.1, 2.6], temblor: 0.05, opacidad: [0.3, 0.85] });
  return (
    `<g filter="url(#rociado)">` +
    forma(rect(-10, fondo - 4, ancho + 10, alto + 10), B.noche) +
    crayon +
    rayas +
    reflejo(PUERTA.vidrio[0] + 10, PUERTA.vidrio[2] - 10, fondo + 6, fondo + 150, [B.llamaClara, B.oro, B.llama], 64, 1420) +
    nube(198, fondo + 70, 60, 90, B.llama, 'xl', 0.25) +
    reflejo(770, 830, fondo + 6, fondo + 120, [B.oro, B.llamaClara], 28, 1421) +
    reflejo(820, ancho + 10, fondo + 10, fondo + 200, [B.llama, B.rojo], 34, 1422) +
    nube(ancho, fondo + 90, 90, 100, B.llama, 'xl', 0.2) +
    // El borde del agua contra la pared: una raya de luz rota.
    reflejo(-10, ancho + 10, fondo - 2, fondo + 3, [B.lila, B.luzFria], 70, 1423) +
    // Más oscuro adelante: la sala se hunde hacia el que mira.
    nube(ancho / 2, alto + 30, 560, 90, B.negro, 'xl', 0.55) +
    `</g>`
  );
}

/** Lo que flota adelante: un bote dado vuelta, una silla, una botella vacía y unos papeles. */
function bajoFrente(): string {
  const { ancho, alto } = ESCENA_BAJO;
  const bote = 'M24 600 C40 566 200 560 236 590 L230 606 C180 598 80 600 30 612 Z';
  const silla = 'M772 528 L780 528 L782 600 L774 600 Z M820 524 L828 524 L830 600 L822 600 Z M776 536 L826 532 L826 546 L776 550 Z M776 560 L826 556 L826 566 L776 570 Z';
  return (
    `<g filter="url(#rociado)">` +
    // El bote: madera rayada y el canto de la quilla. Abajo, a oscuras, se esconde el polizón.
    forma(bote, B.noche) +
    `<clipPath id="bf-bote"><path d="${bote}"/></clipPath><g clip-path="url(#bf-bote)">` +
    rayado([24, 560, 236, 612], 90, [B.rosa, B.violeta, B.noche], 1501, { angulo: 4, largo: [14, 40], grueso: [2, 3.6], temblor: 0.05 }) +
    `</g>` +
    fibra([[24, 600], [40, 572], [120, 562], [200, 566], [236, 590]], 3.4, 1502) +
    fibra([[40, 570], [120, 559], [196, 563]], 1.8, 1507, B.llama) +
    fibra([[60, 590], [130, 582], [204, 586]], 1.8, 1503) +
    // La silla, con el respaldo afuera del agua.
    forma(silla, B.negro) +
    fibra([[776, 600], [778, 528]], 2.4, 1504, B.rosa) +
    // La botella vacía que flota acostada, y un papel con algo escrito que ya no se lee.
    forma('M392 588 L436 580 C442 579 446 583 444 588 L452 588 L452 594 L444 594 C444 600 440 602 436 601 L394 600 Z', B.noche) +
    fibra([[392, 588], [436, 580], [452, 588], [452, 594], [436, 601], [394, 600]], 2.2, 1505, B.negro, true) +
    nube(414, 586, 14, 2, B.luzFria, 's', 0.5) +
    forma('M600 610 L652 600 L660 622 L606 630 Z', B.lila, 0.85) +
    rayado([604, 604, 656, 626], 14, [B.noche], 1506, { angulo: -10, largo: [8, 18], grueso: [1, 1.6], temblor: 0.05 }) +
    `</g>` +
    // La franja de adelante, más oscura, para que lo que flota tenga dónde apoyarse. Sin grano:
    // en una franja soplada no se ve, y no se deja comprimir.
    soplo(`M-10 ${alto - 20} L${ancho + 10} ${alto - 20} L${ancho + 10} ${alto + 10} L-10 ${alto + 10} Z`, B.negro, 'm', 0.6)
  );
}

/** Las tiras del reflejo: la máscara que corta a Pierre dado vuelta en el agua, como el agua lo corta. */
function bajoOndas(): string {
  const { ancho, alto } = ESCENA_BAJO;
  const rnd = azar(1601);
  let s = forma(rect(-10, BAJO.fondo, ancho + 10, alto + 10), 'black');
  for (let y = PIERRE.agua + 1; y < alto; y += 2.6 + rnd() * 2.4) {
    const k = (y - PIERRE.agua) / (alto - PIERRE.agua);
    for (let x = 200 + rnd() * 30; x < 800; x += 6 + rnd() * 18) {
      const largo = 26 + rnd() * 70;
      s += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} l${largo.toFixed(1)} 0`, 'white', 2 + rnd() * 2.4, Math.max(0, (1 - k * 1.1) * (0.6 + rnd() * 0.4)));
      x += largo;
    }
  }
  return s;
}

export const PIEZAS_BAJO: readonly Pieza[] = [
  ...PIEZAS_PIERRE,
  { nombre: 'bajo-lejos', caja: [0, 0, ESCENA_BAJO.ancho, ESCENA_BAJO.alto], dibujo: bajoLejos(), opaca: true, densidad: 2 },
  { nombre: 'bajo-agua', caja: [0, BAJO.fondo - 4, ESCENA_BAJO.ancho, ESCENA_BAJO.alto - BAJO.fondo + 4], dibujo: bajoAgua(), opaca: true, densidad: 2 },
  { nombre: 'bajo-frente', caja: [0, 520, ESCENA_BAJO.ancho, ESCENA_BAJO.alto - 520], dibujo: bajoFrente(), densidad: 2 },
  { nombre: 'bajo-ondas', caja: [0, BAJO.fondo, ESCENA_BAJO.ancho, ESCENA_BAJO.alto - BAJO.fondo], dibujo: bajoOndas(), opaca: true, densidad: 1 },
];
