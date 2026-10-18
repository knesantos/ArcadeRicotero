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

import { forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { M, azar, claroDeLaPastura, filaDeTiras } from './arte.ts';
import { ENTORNOS, PIEZAS_ENTORNOS } from './arte-entornos.ts';
import { ALTO, CAMINOS, CRUCE, SOLAPE, VELOCIDAD, anchoDeCapa, type Tramo } from './camino.ts';
import { tintaDe } from './mapa.ts';
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

/* ------------------------------------------------------------------
   Los seis entornos de la décima vuelta, a lo largo (`D-77`)
   ------------------------------------------------------------------
   Los pinta la misma mano que pinta su recinto (`arte-entornos.ts`): cada función recibe el ancho,
   corre las cosas fijas con `k` y siembra lo suelto a lo ancho. Lo lejano y el piso van a lo largo
   de la escena, con el mismo `k`, así el disco sigue colgado arriba de la silla; lo de adelante va
   más largo, porque pasa más rápido, y llega hasta el final del cruce. Cada capa conserva la caja
   de arriba que tiene en el recinto.
*/

/** De qué pieza del recinto sale cada tramo largo, y la función que lo pinta. */
const DE_ENTORNO = Object.values(CAMINOS).filter((t) => t.forma === 'entorno');

/** La altura donde empieza una capa en su recinto (`PIEZAS_ENTORNOS`). */
const arribaDe = (nombre: string): number => PIEZAS_ENTORNOS.find((p) => p.nombre === nombre)!.caja[1];

function piezasDeEntorno(tramo: Tramo): Pieza[] {
  const capas = ENTORNOS[tramo.region as keyof typeof ENTORNOS];
  const pieza = tramo.piezas.piso!.replace(/^camino-|-piso$/g, '');
  const frente = anchoDeCapa(tramo.velocidad.frente, tramo.ancho);
  const yPiso = arribaDe(`${pieza}-piso`);
  const yFrente = arribaDe(`${pieza}-frente`);
  return [
    { nombre: tramo.piezas.lejos!, caja: [0, 0, tramo.escena, ALTO], dibujo: capas.lejos(tramo.escena, ALTO), opaca: true, densidad: 1.25 },
    { nombre: tramo.piezas.piso!, caja: [0, yPiso, tramo.escena, ALTO - yPiso], dibujo: capas.piso(tramo.escena, ALTO), densidad: 1.25 },
    { nombre: tramo.piezas.frente!, caja: [0, yFrente, frente, ALTO - yFrente], dibujo: capas.frente(frente, ALTO), densidad: 1.25 },
  ];
}

export const PIEZAS_CAMINO: readonly Pieza[] = [
  { nombre: 'camino-monte-lejos', caja: [0, 0, LEJOS, ALTO], dibujo: lejos(), opaca: true, densidad: 1.25 },
  { nombre: 'camino-monte-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoMonte(), densidad: 1.5 },
  { nombre: 'camino-pastura-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoPastura(), densidad: 1.5 },
  { nombre: 'camino-monte-frente', caja: [0, 0, FRENTE, ALTO], dibujo: frente(), densidad: 1.25 },
  ...DE_ENTORNO.flatMap(piezasDeEntorno),
];

/* ------------------------------------------------------------------
   El cruce del final (`D-77`)
   ------------------------------------------------------------------
   Los entornos y los recintos terminan en la noche de afuera. Entra soplada sobre el final de la
   escena, como la noche que se come el borde de la vista en el monte, y es un descampado oscuro: la
   picada que venía se abre en tantas como vecinas tiene la región, y cada una se va hacia la luz de
   su disco, que asoma en el horizonte. Ahí, sin ningún bicho abajo, se paran los carteles.
*/

/** La caja del cruce, en coordenadas del piso: arranca `SOLAPE` antes del final de la escena. */
export const cajaDelCruce = (t: Tramo): readonly [number, number, number, number] => [t.escena - SOLAPE, 0, SOLAPE + CRUCE, ALTO];

/** Donde el descampado se junta con el cielo, y donde nace la picada. */
const HORIZONTE = 404;
const PICADA = 590;

/**
 * La pieza del cruce de un tramo. `luces`: la tinta del disco de cada vecina, en el orden de los
 * carteles; cada una asoma en el horizonte, al final de su picada.
 */
export function piezaDelCruce(t: Tramo, luces: readonly string[]): Pieza {
  const [x0, , ancho] = cajaDelCruce(t);
  const rnd = azar([...t.region].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7));
  // Desde acá, la noche es negra del todo.
  const borde = t.escena + 56;
  const fin = x0 + ancho;
  const rect = (a: number, b: number): string => `M${a} -40 L${b} -40 L${b} ${ALTO + 40} L${a} ${ALTO + 40} Z`;
  const n = Math.max(1, luces.length);
  const paso = (fin - borde - 80) / n;
  const destinos = luces.map((_, i) => ({ x: borde + 40 + paso * (i + 0.5), y: HORIZONTE - 8 + rnd() * 16 }));

  // Las luces de las vecinas, detrás del horizonte: un resplandor ancho y un centro chico.
  let luz = '';
  luces.forEach((color, i) => {
    const { x, y } = destinos[i]!;
    luz += nube(x, y - 26, 74, 52, color, 'xl', 0.5) + nube(x, y - 12, 26, 13, color, 'm', 0.75);
  });

  // La picada: entra desde la escena y se abre, una lengua por vecina que se angosta hacia su luz.
  const nace = { x: borde - 40, y: PICADA };
  let picadas = '';
  for (const { x, y } of destinos) {
    const medio = { x: (nace.x + x) / 2 + (rnd() - 0.5) * 40, y: (nace.y + y) / 2 + 30 };
    picadas += soplo(
      `M${nace.x} ${nace.y - 26} Q${medio.x} ${medio.y - 12} ${x - 3} ${y} L${x + 3} ${y} Q${medio.x + 16} ${medio.y + 14} ${nace.x + 30} ${nace.y + 30} Z`,
      M.sombra,
      'm',
      0.5,
    );
  }

  // Unos pastos de crayón, para que el descampado no sea un hueco.
  let pastos = '';
  for (let i = 0; i < 70; i++) {
    const x = borde + rnd() * (fin - borde);
    const y = HORIZONTE + 30 + rnd() * (ALTO - HORIZONTE - 40);
    pastos += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} l${(-2 + rnd() * 4).toFixed(1)} ${(-(5 + rnd() * 9)).toFixed(1)}`, rnd() < 0.6 ? M.hondo : M.sombra, 1.2, 0.6);
  }

  return {
    nombre: t.piezas.cruce!,
    caja: cajaDelCruce(t),
    dibujo:
      `<g filter="url(#rociado)">` +
      // La noche que se come el borde: dos soplos que se van cerrando, y después negro de verdad.
      soplo(rect(t.escena - 8, fin + 60), M.negro, 'xl') +
      soplo(rect(t.escena + 24, fin + 60), M.negro, 'l') +
      forma(rect(borde, fin + 10), M.negro) +
      // El descampado: apenas más claro que el cielo, con la línea del horizonte soplada.
      soplo(`M${borde - 30} ${HORIZONTE} L${fin + 40} ${HORIZONTE} L${fin + 40} ${ALTO + 40} L${borde - 30} ${ALTO + 40} Z`, M.oscuro, 'l', 0.35) +
      luz +
      picadas +
      pastos +
      // Abajo, lo más cerca, se apaga, como en el monte.
      soplo(`M${borde - 60} ${ALTO - 50} L${fin + 40} ${ALTO - 50} L${fin + 40} ${ALTO + 40} L${borde - 60} ${ALTO + 40} Z`, M.negro, 'l', 0.7) +
      `</g>`,
    densidad: 1.25,
  };
}

/**
 * Las piezas de todos los cruces. Necesitan saber quién es vecino de quién y de qué disco es cada
 * uno: se lo pasa quien lee `bestiario.json` (la imprenta y el test), y `tintaDe` pone la tinta.
 */
export function piezasDeLosCruces(regiones: readonly { id: string; disco: string; vecinas: readonly string[] }[]): Pieza[] {
  const discoDe = new Map(regiones.map((r) => [r.id, r.disco]));
  return Object.values(CAMINOS)
    .filter((t) => t.piezas.cruce)
    .map((t) => piezaDelCruce(t, regiones.find((r) => r.id === t.region)!.vecinas.map((v) => tintaDe(discoDe.get(v)!))));
}
