/**
 * El arte del camino con cruces (`D-73`, séptima vuelta): el monte y la pastura, largos.
 *
 * Es el mismo monte de la segunda vuelta (`arte.ts`): las tiras de la contratapa de *Lobo
 * suelto*, de noche, a aerógrafo, y la pastura naranja de *Cordero atado*. Lo que cambia es el
 * largo: acá se camina, así que cada capa es una tira de varias pantallas, con el ancho que
 * pide su velocidad (`anchoDeCapa`, en `camino.ts`).
 *
 * Lo lejano y lo de adelante son del monte y sirven para los dos tramos: la pastura es un claro
 * adentro del monte, y el que pasa de una a la otra sigue viendo los mismos árboles. Lo que
 * cambia es el piso. Al final de cada piso se ve lo que viene: la luz naranja de la pastura
 * entre los árboles del monte, y la vela de la mesa servida al salir del claro.
 *
 * `scripts/imprimir-bestiario.mjs` imprime estas piezas junto con las de `arte.ts`.
 */

import { nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { M, azar, claroDeLaPastura, filaDeTiras } from './arte.ts';
import { ALTO, CAMINOS, VELOCIDAD, anchoDeCapa } from './camino.ts';
import { PALO } from './rig.ts';

const ANCHO = CAMINOS['el-monte']!.ancho;
/**
 * Lo lejano llega hasta el final del piso aunque su velocidad pida menos: en la vista quieta
 * (con movimiento reducido o sin JavaScript) las capas van todas juntas, y si no, al final
 * quedaría la noche vacía.
 */
const LEJOS = Math.max(anchoDeCapa(VELOCIDAD.lejos, ANCHO), ANCHO);
const FRENTE = anchoDeCapa(VELOCIDAD.frente, ANCHO);
/** Desde dónde empieza el piso: arriba de esto, lo lejano se ve entero. */
const PISO = 240;

/** La luz de la mesa servida: una vela, en la tinta de *La mosca y la sopa*. */
const VELA = 'var(--disco-la-mosca-y-la-sopa-tinta)';

/** Lo lejano: la noche y las tres filas de tiras del monte, a lo largo. */
function lejos(): string {
  const rnd = azar(71);
  let resplandores = '';
  for (let x = 160; x < LEJOS; x += 320 + rnd() * 260) {
    resplandores += nube(x, 120 + rnd() * 60, 180 + rnd() * 200, 60 + rnd() * 40, rnd() < 0.5 ? M.sombra : M.hondo, 'xl', 0.4 + rnd() * 0.2);
  }
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${LEJOS + 20}" height="${ALTO + 20}" fill="${M.negro}"/>` +
    resplandores +
    filaDeTiras(-40, 300, M.oscuro, M.sombra, 3, 'cl-a', -20, LEJOS + 20) +
    filaDeTiras(30, 320, M.hondo, M.medio, 9, 'cl-b', -20, LEJOS + 20) +
    filaDeTiras(110, 335, M.sombra, M.claro, 17, 'cl-c', -20, LEJOS + 20) +
    `</g>`
  );
}

/**
 * El piso del monte: oscuro, con el borde de arriba soplado (detrás se hunde el lobo), y una
 * picada más clara, pisada, que lo cruza entero. Unos pastos de crayón para que se note que el
 * piso pasa.
 */
function pisoDelMonte(desde: number, hasta: number, semilla: number): string {
  const rnd = azar(semilla);
  // Dos bordes, como en el recinto: el de atrás sube un poco más que el de adelante.
  const borde = (y: number): string => {
    let d = `M${desde - 40} ${y + 4}`;
    for (let x = desde; x <= hasta + 40; x += 120) d += ` C${x + 30} ${(y - 8 + rnd() * 16).toFixed(1)}, ${x + 90} ${(y - 8 + rnd() * 16).toFixed(1)}, ${x + 120} ${(y + rnd() * 8).toFixed(1)}`;
    return d + ` L${hasta + 40} ${ALTO + 40} L${desde - 40} ${ALTO + 40} Z`;
  };
  let picada = `M${desde - 40} 520`;
  for (let x = desde; x <= hasta + 40; x += 200) picada += ` C${x + 60} ${(500 + rnd() * 30).toFixed(1)}, ${x + 140} ${(506 + rnd() * 30).toFixed(1)}, ${x + 200} ${(512 + rnd() * 20).toFixed(1)}`;
  let pastos = '';
  for (let i = 0; i < (hasta - desde) / 9; i++) {
    const x = desde + rnd() * (hasta - desde);
    const y = 330 + rnd() * 290;
    const largo = 6 + rnd() * 10;
    pastos += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} l${(-2 + rnd() * 4).toFixed(1)} ${(-largo).toFixed(1)}`, rnd() < 0.6 ? M.hondo : M.sombra, 1.3, 0.7);
  }
  let noche = '';
  for (let x = desde + 80; x < hasta; x += 220 + rnd() * 240) {
    noche += nube(x, 400 + rnd() * 180, 140 + rnd() * 160, 50 + rnd() * 50, M.negro, 'xl', 0.35 + rnd() * 0.3);
  }
  return (
    soplo(borde(300), M.oscuro, 'm') +
    soplo(borde(318), M.oscuro, 's') +
    nube((desde + hasta) / 2, 600, (hasta - desde) * 0.6, 80, M.negro, 'xl', 0.5) +
    noche +
    soplo(`${picada} L${hasta + 40} 600 L${desde - 40} 600 Z`, M.sombra, 'l', 0.5) +
    pastos +
    // Abajo, lo más cerca, se apaga: la noche se come el borde de la vista.
    soplo(`M${desde - 40} 590 L${hasta + 40} 590 L${hasta + 40} ${ALTO + 40} L${desde - 40} ${ALTO + 40} Z`, M.negro, 'l', 0.7)
  );
}

/** El piso del monte, con la luz naranja de la pastura asomando al final, entre los árboles. */
function pisoMonte(): string {
  return (
    `<g filter="url(#rociado)">` +
    // La luz del claro, detrás del borde del piso: se ve antes de llegar al cruce.
    nube(ANCHO - 120, 330, 260, 70, M.naranja, 'xl', 0.55) +
    nube(ANCHO - 60, 320, 120, 36, M.naranjaHonda, 'l', 0.6) +
    pisoDelMonte(0, ANCHO, 101) +
    `</g>`
  );
}

/**
 * El piso de la pastura: se entra desde el monte, el claro se abre en el medio (el mismo del
 * recinto, corrido `dx`), y a la salida, del otro lado, titila la vela de la mesa servida.
 */
function pisoPastura(): string {
  const { dx } = CAMINOS['la-pastura']!.claro!;
  return (
    `<g filter="url(#rociado)">` +
    nube(ANCHO - 140, 336, 150, 50, VELA, 'xl', 0.5) +
    nube(ANCHO - 140, 330, 26, 30, 'var(--entorno-templo-foco)', 'l', 0.8) +
    pisoDelMonte(0, ANCHO, 203) +
    `<g transform="translate(${dx} 0)">${claroDeLaPastura()}</g>` +
    `</g>`
  );
}

/**
 * Lo de adelante: matas de tiras que pasan más rápido que el piso, con huecos entre una y
 * otra, y cada tanto una tira alta que cruza toda la vista. Es lo que hace sentir que se camina.
 */
function frente(): string {
  const rnd = azar(131);
  let s = '';
  let n = 0;
  for (let x = 260; x < FRENTE - 100; x += 420 + rnd() * 360) {
    const ancho = 150 + rnd() * 140;
    s += filaDeTiras(540 + rnd() * 30, ALTO + 10, M.hondo, M.medio, 300 + n, `fr-a-${n}`, x, x + ancho);
    s += filaDeTiras(580 + rnd() * 20, ALTO + 10, M.oscuro, M.sombra, 400 + n, `fr-b-${n}`, x + 30, x + ancho + 40);
    if (n % 3 === 1) s += filaDeTiras(40 + rnd() * 60, ALTO + 10, M.oscuro, M.sombra, 500 + n, `fr-c-${n}`, x + ancho * 0.3, x + ancho * 0.3 + 110);
    n++;
  }
  return `<g filter="url(#rociado)">${s}</g>`;
}

/** El palo de la pastura queda donde dice el recinto: `camino.test.ts` lo mide contra esto. */
export const PALO_EN_EL_CAMINO = { x: PALO.x + CAMINOS['la-pastura']!.claro!.dx, y: PALO.y } as const;

export const PIEZAS_CAMINO: readonly Pieza[] = [
  { nombre: 'camino-monte-lejos', caja: [0, 0, LEJOS, ALTO], dibujo: lejos(), opaca: true, densidad: 1.25 },
  { nombre: 'camino-monte-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoMonte(), densidad: 1.5 },
  { nombre: 'camino-pastura-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoPastura(), densidad: 1.5 },
  { nombre: 'camino-monte-frente', caja: [0, 0, FRENTE, ALTO], dibujo: frente(), densidad: 1.25 },
];
