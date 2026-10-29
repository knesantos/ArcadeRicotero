/**
 * Zippo (`D-73`, vigésima vuelta), en picada por el cielo del infierno.
 *
 * *"Zippo, que estaba hecho migas, se mandó en una picada, chistando a su mala sombra, sin copiloto ni
 * nada"* es de *Cruz diablo!*, el segundo tema de *Luzbelito* (1996). Por eso está soplado en las tintas
 * del compact de ese disco, medidas en la galleta: el fuego que la cruza en diagonal, del blanco del
 * corazón al rojo del borde, sobre el negro; el latón del anillo del medio, y el violeta del canto.
 *
 * De la letra son la picada, la mala sombra a la que chista, el asiento del copiloto vacío, las fichas
 * que no supo repartir, la boca que arde y la risa de mil dientes cargados de azufre. Del dibujo, todo lo
 * demás: que la cabeza es el encendedor que le da el nombre, con la tapa que hace *clac*; que la avioneta
 * es de lata pintada de rojo, descascarada hasta el latón, emparchada con cinta; y que la sombra, en el
 * damero, tiene sus propios ojos.
 *
 * Coordenadas: el (0, 0) es el medio de la cabina (`rig-zippo.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { FICHAS, HUMOS, PICADA, QUIETO, ZIPPO, ZIPPO_ARMADO as A, marcas, type Momento } from './rig-zippo.ts';

/** Las tintas del compact de *Luzbelito* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-zippo-negro)',
  brasa: 'var(--bestia-zippo-brasa)',
  rojo: 'var(--bestia-zippo-rojo)',
  naranja: 'var(--bestia-zippo-naranja)',
  ambar: 'var(--bestia-zippo-ambar)',
  amarillo: 'var(--bestia-zippo-amarillo)',
  nucleo: 'var(--bestia-zippo-nucleo)',
  crema: 'var(--bestia-zippo-crema)',
  laton: 'var(--bestia-zippo-laton)',
  latonHondo: 'var(--bestia-zippo-laton-hondo)',
  violeta: 'var(--bestia-zippo-violeta)',
};

/* ------------------------------------------------------------------
   La avioneta hecha migas
   ------------------------------------------------------------------ */

const FUSELAJE: readonly P[] = [[-116, -6], [-108, -22], [-80, -30], [-40, -28], [44, -26], [104, -22], [150, -16], [156, -8], [150, 0], [100, 12], [40, 28], [-40, 34], [-90, 28], [-112, 16]];
const COLA = poli([[118, -18], [128, -64], [146, -66], [158, -12]]);
const ALA = curva([[-58, 20], [-20, 16], [34, 22], [44, 36], [10, 56], [-70, 52], [-84, 40]]);

function avion(): string {
  const rnd = azar(2401);
  const cuerpo = curva(FUSELAJE);
  // Lo descascarado: manchas chicas de latón donde se fue la pintura roja, cada una con su borde de óxido.
  const manchas = Array.from({ length: 11 }, () => {
    const [x, y] = [-92 + rnd() * 230, -18 + rnd() * 38];
    const r = 2.6 + rnd() * 5;
    return curva(Array.from({ length: 7 }, (_, i) => [x + Math.cos(i * 0.9) * r * (0.6 + rnd() * 0.8), y + Math.sin(i * 0.9) * r * (0.45 + rnd() * 0.5)] as P));
  });
  const pelado = manchas.join(' ');
  // El agujero de la panza: la lata rota, que deja ver lo oscuro de adentro.
  const agujero = poli([[52, 4], [60, -6], [70, 2], [78, -4], [84, 8], [74, 16], [62, 14]]);
  // La cinta de los parches, en cruz.
  const cinta = (x: number, y: number, g: number): string =>
    `<g transform="rotate(${g} ${x} ${y})">${forma(caja(x - 13, y - 3.5, 26, 7), C.crema, 0.85)}${trazo(`M${x - 13} ${y - 3.5} l26 0`, C.brasa, 0.6, 0.6)}</g>`;
  const remaches = [-96, -70, -44, 20, 46, 72, 98, 124].map((x) => forma(elipse(x, -18 + (x > 0 ? x * 0.03 : 0), 1.4, 1.4), C.latonHondo)).join('');
  // El asiento de atrás, el del copiloto que no vino: la cabina abierta y oscura, el respaldo de cuero
  // rajado y el cinturón suelto que cuelga por afuera, sin nadie que se lo abroche.
  const [vx, vy] = A.asientoVacio;
  // El respaldo es capitoné: tres gajos de cuero con sus botones, y el del medio rajado.
  const respaldo = cajaRedonda(vx - 13, vy - 48, 26, 32, 6);
  const asiento =
    enmascarado('m-zip-respaldo', respaldo, forma(respaldo, C.brasa) + nube(vx - 7, vy - 42, 7, 6, C.ambar, 's', 0.45) + nube(vx + 11, vy - 28, 6, 16, C.negro, 's', 0.8) +
      trazo(`M${vx - 4.5} ${vy - 46} l0 30 M${vx + 4.5} ${vy - 46} l0 30`, C.negro, 1, 0.75) +
      [-4.5, 4.5].map((dx) => [vy - 38, vy - 27].map((by) => forma(elipse(vx + dx, by, 1.3, 1.3), C.laton)).join('')).join('')) +
    trazo(`M${vx - 1} ${vy - 44} l2 6 l-2 5 l3 5`, C.negro, 1.3, 0.9) + nube(vx + 1, vy - 34, 2, 4, C.crema, 'xs', 0.4);
  const cabinaVacia = forma(elipse(vx, vy - 18, 24, 6), C.negro) + nube(vx, vy - 20, 18, 3, C.brasa, 'xs', 0.6);
  const cinturon = trazo(`M${vx + 14} ${vy - 18} Q${vx + 20} ${vy - 4} ${vx + 16} ${vy + 10}`, C.crema, 3.2, 0.85) +
    forma(caja(vx + 12.5, vy + 8, 7, 5), C.laton) + trazo(`M${vx + 14} ${vy - 18} Q${vx + 20} ${vy - 4} ${vx + 16} ${vy + 10}`, C.brasa, 0.6, 0.6);
  // Cada mancha pelada con su borde de óxido, para que se lea lata y no piedra.
  const bordes = manchas.map((d) => soplo(d, C.brasa, 'xs', 0.9)).join('');
  const adentro =
    forma(cuerpo, C.rojo) +
    // El volumen: la luz del fuego le pega de arriba, la panza se hunde en el negro.
    nube(-30, -22, 90, 9, C.naranja, 'm', 0.8) + trazo('M-104 -20 Q-60 -31 40 -27 L104 -21', C.ambar, 1.6, 0.7) + nube(-60, -26, 20, 2, C.nucleo, 'xs', 0.5) +
    nube(30, 30, 150, 18, C.negro, 'm', 0.8) + nube(140, -4, 20, 16, C.negro, 'm', 0.6) + nube(0, 10, 120, 8, C.brasa, 'm', 0.4) +
    bordes + forma(pelado, C.laton) + manchas.slice(0, 4).map((d) => soplo(d, C.amarillo, 'xs', 0.25)).join('') +
    // El capó del motor: el anillo de latón de la trompa, tiznado del motor que tose.
    forma(caja(-106, -24, 9, 50), C.latonHondo) + forma(caja(-104, -22, 3, 46), C.laton) +
    nube(-110, 4, 18, 24, C.negro, 'm', 0.8) + nube(-90, -16, 10, 6, C.brasa, 's', 0.6) +
    forma(agujero, C.negro) + trazo(`M52 4 L60 -6 L70 2 L78 -4 L84 8`, C.laton, 1.2, 0.8) + nube(68, 8, 6, 4, C.brasa, 'xs', 0.8) +
    remaches + cinta(-62, -4, -18) + cinta(-62, -4, 24) + cinta(112, -6, 10) + cabinaVacia;
  const cola =
    enmascarado('m-zip-cola', COLA, forma(COLA, C.rojo) + nube(132, -56, 14, 10, C.naranja, 's', 0.7) + nube(150, -20, 12, 30, C.negro, 'm', 0.6) + forma(elipse(138, -40, 6, 6), C.laton, 0.8)) +
    // La cola tiene un mordiscón: le falta una punta.
    forma(poli([[140, -66], [146, -66], [149, -58], [143, -60]]), C.negro);
  // El escape, y la hélice tiene su buje en la trompa.
  const [ex, ey] = A.escape;
  const escape = forma(caja(ex - 4, ey - 6, 30, 8), C.latonHondo) + forma(elipse(ex + 26, ey - 2, 3, 4), C.negro);
  const buje = forma(elipse(A.helice[0] + 4, A.helice[1], 8, 10), C.latonHondo) + nube(A.helice[0] + 2, A.helice[1] - 4, 4, 4, C.amarillo, 's', 0.6);
  // El tren de aterrizaje, hecho migas: una pata entera y la otra colgando de un alambre, con la rueda torcida.
  const rueda = (x: number, y: number, rx: number): string =>
    forma(elipse(x, y, rx, 10), C.negro) + forma(elipse(x, y, rx * 0.45, 4.5), C.latonHondo) + nube(x - 1, y - 2, rx * 0.25, 2, C.amarillo, 'xs', 0.6);
  const tren =
    trazo('M-46 30 L-52 58', C.latonHondo, 4) + trazo('M-46 30 L-52 58', C.laton, 1.4, 0.8) + rueda(-52, 62, 9) +
    trazo('M-8 32 L4 46', C.latonHondo, 4) + trazo('M4 46 Q10 54 6 62', C.negro, 0.9) + `<g transform="rotate(28 8 68)">${rueda(8, 68, 6)}</g>`;
  return conGrano(
    tren +
    asiento +
    cola +
    enmascarado('m-zip-fuselaje', cuerpo, adentro) +
    cinturon +
    // El ala de este lado, más abajo, con un tajo en el borde.
    enmascarado('m-zip-ala', ALA, forma(ALA, C.rojo) + nube(-20, 24, 50, 8, C.naranja, 's', 0.6) + nube(0, 50, 70, 10, C.negro, 'm', 0.75) + forma(poli([[24, 22], [30, 30], [22, 34]]), C.laton)) +
    trazo('M-56 22 L32 24', C.brasa, 1, 0.6) +
    escape + buje,
  );
}

/** El borde de la cabina, que le tapa la panza: el cuero gastado del ribete. */
function borde(): string {
  const d = curva([[-46, -6], [-20, -12], [16, -12], [38, -6], [36, 4], [-44, 4]]);
  return conGrano(enmascarado('m-zip-borde', d, forma(d, C.brasa) + nube(-14, -10, 26, 4, C.ambar, 's', 0.6) + nube(20, 2, 30, 4, C.negro, 's', 0.7)) + trazo('M-44 -4 Q-4 -12 36 -4', C.negro, 1.2, 0.6));
}

/** La hélice de costado: una pala de madera quemada, con la punta de latón. */
function helice(): string {
  const [hx, hy] = A.helice;
  const L = A.largoHelice;
  const pala = curva([[hx - 3, hy - L], [hx + 3, hy - L + 2], [hx + 4, hy], [hx + 3, hy + L - 2], [hx - 3, hy + L], [hx - 4, hy]]);
  return conGrano(forma(pala, C.brasa) + nube(hx - 1, hy - L * 0.5, 2, 12, C.ambar, 'xs', 0.6) + forma(caja(hx - 3.5, hy - L, 7, 7), C.laton) + forma(caja(hx - 3.5, hy + L - 7, 7, 7), C.laton));
}

/** El borrón de la hélice a fondo: un disco de costado, soplado. */
function borron(): string {
  const [hx, hy] = A.helice;
  return nube(hx, hy, 6, A.largoHelice + 2, C.ambar, 's', 0.35) + nube(hx, hy, 3, A.largoHelice - 6, C.crema, 'xs', 0.3);
}

/* ------------------------------------------------------------------
   El aviador: la campera, el brazo y la bufanda
   ------------------------------------------------------------------ */

function cuerpo(): string {
  const d = curva([[-38, 2], [-42, -16], [-34, -32], [-16, -40], [8, -40], [26, -33], [34, -16], [32, 2]]);
  // El cuello de corderito de la campera de aviador: borde de lana en rulos, con la luz del fuego arriba.
  const rulos: P[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI * (1 + i / 12);
    const r = i % 2 ? 22 : 25;
    rulos.push([-4 + Math.cos(a) * r, -36 + Math.sin(a) * r * 0.42]);
  }
  const corderito = curva([...rulos, [16, -30], [-4, -27], [-24, -30]]);
  const lana = [-20, -12, -4, 4, 12].map((x, i) => trazo(`M${x} ${-42 + (i % 2) * 2} q2 2 0 4`, C.ambar, 0.8, 0.6)).join('');
  // El cierre de la campera, con sus dientes, y el bolsillo de las fichas, con una que asoma.
  const cierre = trazo('M-4 -30 L-6 2', C.negro, 2) + Array.from({ length: 8 }, (_, i) => trazo(`M${-6.5 + i * -0.25} ${-28 + i * 4} l3 0`, C.laton, 0.6, 0.8)).join('');
  const [bx, by] = A.bolsillo;
  const adentro =
    forma(d, C.brasa) +
    nube(-26, -26, 16, 12, C.naranja, 'm', 0.5) + nube(-30, -30, 6, 4, C.ambar, 's', 0.5) + nube(24, -12, 16, 22, C.negro, 'm', 0.85) +
    // Las costuras de los hombros y el cuero gastado.
    trazo('M-36 -20 Q-24 -24 -18 -36', C.negro, 1, 0.6) + trazo('M28 -22 Q18 -26 12 -36', C.negro, 1, 0.6) +
    nube(-14, -10, 6, 3, C.ambar, 's', 0.35) + nube(10, -20, 5, 3, C.ambar, 's', 0.3) +
    cierre + forma(caja(bx - 9, by - 12, 16, 12), C.negro, 0.6) + forma(elipse(bx - 3, by - 13, 5, 2.4), C.laton) + nube(bx - 4, by - 14, 3, 1.4, C.amarillo, 'xs', 0.7);
  return conGrano(
    enmascarado('m-zip-cuerpo', d, adentro) +
    enmascarado('m-zip-corderito', corderito, forma(corderito, C.crema) + nube(-12, -42, 14, 4, C.nucleo, 's', 0.7) + nube(10, -30, 14, 6, C.ambar, 's', 0.7) + nube(-4, -28, 18, 3, C.brasa, 's', 0.5)) + lana,
  );
}

function brazo(): string {
  const [sx, sy] = A.hombro;
  const [mx, my] = A.mano;
  // La manga baja del hombro y se acoda: el codo cae afuera de la cabina, y la mano se agarra del borde.
  const codo: P = [sx - 18, sy + 20];
  const manga = curva([[sx - 8, sy - 8], [sx + 9, sy - 4], [sx + 2, sy + 16], [codo[0] + 8, codo[1] + 8], [mx + 6, my + 6], [mx - 2, my - 6], [codo[0] - 6, codo[1] - 2], [sx - 14, sy + 4]]);
  // El guante de cuero con el puño largo, y el índice suelto: el del *¡chist!*.
  const guante = curva([[mx - 7, my - 7], [mx + 6, my - 8], [mx + 9, my - 1], [mx + 4, my + 7], [mx - 6, my + 6]]);
  const indice = curva([[mx - 9, my - 6], [mx - 17, my - 9], [mx - 19, my - 7], [mx - 17, my - 4], [mx - 8, my - 1]]);
  const puno = curva([[mx + 2, my - 10], [mx + 10, my - 6], [mx + 8, my + 4], [mx, my + 2]]);
  return conGrano(
    enmascarado('m-zip-manga', manga, forma(manga, C.brasa) + nube(sx - 6, sy + 6, 8, 12, C.naranja, 'm', 0.45) + nube(codo[0], codo[1] + 6, 10, 8, C.negro, 'm', 0.75) + trazo(`M${sx - 4} ${sy + 8} Q${codo[0]} ${codo[1] + 2} ${mx + 4} ${my}`, C.negro, 0.8, 0.5)) +
    forma(puno, C.brasa) + trazo(`M${mx + 3} ${my - 9} L${mx + 1} ${my + 2}`, C.laton, 1.2, 0.8) +
    forma(guante, C.negro) + forma(indice, C.negro) + nube(mx - 2, my - 4, 4, 3, C.brasa, 's', 0.9) + nube(mx - 14, my - 7, 3, 1.4, C.brasa, 'xs', 0.8),
  );
}

function bufanda(): string {
  const [nx, ny] = A.nudo;
  // Flamea para atrás en tres ondas, y la punta se deshilacha.
  const d = curva([[nx - 4, ny - 6], [nx + 30, ny - 14], [nx + 60, ny - 4], [nx + 92, ny - 12], [nx + 120, ny - 2], [nx + 116, ny + 6], [nx + 88, ny + 2], [nx + 58, ny + 8], [nx + 28, ny - 2], [nx - 2, ny + 6]]);
  const flecos = [0, 1, 2, 3].map((i) => trazo(`M${nx + 116 - i * 2} ${ny - 1 + i * 2} l10 ${i - 1}`, C.violeta, 1.4, 0.8)).join('');
  // Los pliegues: cada onda se hunde en el negro y agarra la luz del fuego en el lomo.
  const pliegues = [22, 52, 84, 108].map((dx, i) => nube(nx + dx, ny + (i % 2 ? 2 : -4), 6, 9, C.negro, 's', 0.6, 20)).join('');
  return conGrano(enmascarado('m-zip-bufanda', d, forma(d, C.violeta) + nube(nx + 40, ny - 10, 30, 3, C.crema, 's', 0.4) + nube(nx + 70, ny + 6, 50, 5, C.negro, 's', 0.55) + pliegues + nube(nx + 10, ny, 12, 8, C.ambar, 's', 0.4)) + flecos);
}

/* ------------------------------------------------------------------
   La cabeza: el encendedor de latón, con las antiparras y la tapa
   ------------------------------------------------------------------ */

function cabeza(): string {
  const { x, y, ancho, alto } = A.caja;
  const CAJA = cajaRedonda(x, y, ancho, alto, 7);
  const [lx, ly] = A.chimenea;
  // La chimenea: la rejilla con los agujeros por donde respira la llama.
  const chimenea = forma(caja(lx - 14, ly, 28, 16), C.latonHondo) +
    [0, 1].map((fila) => [0, 1, 2, 3].map((i) => forma(elipse(lx - 9 + i * 6, ly + 4 + fila * 6, 1.5, 1.5), C.negro)).join('')).join('') +
    forma(caja(lx - 4, ly + 1, 6, 4), C.laton);
  // Las antiparras de aviador: dos vidrios redondos que devuelven el fuego, con la correa.
  const vidrio = (vx: number, rajado: boolean): string =>
    forma(elipse(vx, y + 22, 9.5, 8.5), C.negro) + forma(elipse(vx, y + 22, 7.5, 6.8), C.rojo) + nube(vx + 1, y + 24, 6, 5, C.ambar, 's', 0.9) +
    nube(vx - 2.5, y + 19, 3, 2.2, C.nucleo, 'xs', 0.95) +
    // La antiparra de la derecha está rajada: hecho migas.
    (rajado ? trazo(`M${vx - 6} ${y + 17} L${vx - 1} ${y + 22} L${vx + 2} ${y + 20} L${vx + 6} ${y + 27} M${vx - 1} ${y + 22} L${vx - 3} ${y + 28}`, C.crema, 0.7, 0.9) : '');
  const correa = forma(caja(x - 2, y + 18, ancho + 4, 7), C.brasa) + trazo(`M${x - 2} ${y + 19} l${ancho + 4} 0`, C.ambar, 0.5, 0.4);
  // La boca cerrada: una raja torcida, que sube de un lado, y adentro arde (la risa va aparte, encima).
  const [mx, my] = A.boca;
  const boca = trazo(`M${mx - 14} ${my + 2} Q${mx - 4} ${my + 4} ${mx + 6} ${my} T${mx + 15} ${my - 5}`, C.negro, 2.8) + nube(mx, my + 1, 10, 2, C.rojo, 's', 0.8) + trazo(`M${mx + 15} ${my - 5} l2 -1`, C.negro, 1.6);
  // Las abolladuras: un hueco oscuro con el canto prendido arriba, como un golpe en la lata.
  const abolladura = (ax: number, ay: number, r: number): string => nube(ax, ay, r, r * 0.8, C.latonHondo, 's', 0.95) + nube(ax - r * 0.3, ay - r * 0.5, r * 0.6, r * 0.25, C.amarillo, 'xs', 0.6);
  const adentro =
    forma(CAJA, C.laton) +
    // El latón cepillado: la luz de la llama le pega de arriba a la izquierda, rayas verticales y la sombra abajo.
    nube(x + 10, y + 10, 16, 22, C.amarillo, 'm', 0.55) + nube(x + 6, y + 8, 6, 10, C.nucleo, 's', 0.6) +
    [6, 14, 22, 30, 38, 44].map((dx, i) => trazo(`M${x + dx} ${y + 4} l0 ${alto - 8}`, i % 2 ? C.latonHondo : C.ambar, 0.6, 0.35)).join('') +
    nube(x + ancho, y + alto * 0.6, 14, 40, C.latonHondo, 'm', 0.95) + nube(x + ancho / 2, y + alto, 30, 12, C.negro, 'm', 0.8) +
    // El hollín: la llama le tizna la frente, y las rayas de los golpes.
    nube(x + ancho / 2, y - 2, 26, 6, C.negro, 's', 0.7) + abolladura(x + 40, y + 46, 5) + abolladura(x + 9, y + 54, 3.5) +
    trazo(`M${x + 4} ${y + 36} l9 4 M${x + 36} ${y + 6} l6 7`, C.crema, 0.6, 0.45) +
    correa + vidrio(x + 13, false) + vidrio(x + 33, true) + trazo(`M${x + 22} ${y + 22} l2 0`, C.brasa, 2) +
    // Las mejillas que agarran el fuego, y la boca.
    nube(mx - 15, my - 6, 6, 4, C.naranja, 's', 0.45) + nube(mx + 13, my - 9, 5, 3, C.naranja, 's', 0.45) + boca;
  // La bisagra: el caño de los cinco nudillos, a la derecha arriba.
  const [bx, by] = A.bisagra;
  const bisagra = forma(caja(bx - 3, by - 2, 6, 14), C.latonHondo) + [0, 1, 2].map((i) => trazo(`M${bx - 3} ${by + 2 + i * 4} l6 0`, C.negro, 0.6, 0.7)).join('');
  // El cuello: un tornillo grueso donde se enrosca la caja.
  const cuello = forma(caja(A.cuello[0] - 8, y + alto - 2, 16, 8), C.latonHondo) + trazo(`M${A.cuello[0] - 8} ${y + alto + 2} l16 0`, C.negro, 0.8);
  return conGrano(cuello + chimenea + enmascarado('m-zip-caja', CAJA, adentro) + bisagra);
}

/** La tapa: la mitad de arriba de la caja, que se abre en la bisagra con un *clac*. */
function tapa(): string {
  const { x, y, ancho } = A.caja;
  const d = cajaRedonda(x, y - 30, ancho, 30, 6);
  return conGrano(
    enmascarado('m-zip-tapa', d, forma(d, C.laton) + nube(x + 10, y - 22, 14, 8, C.amarillo, 'm', 0.6) + nube(x + ancho, y - 10, 10, 20, C.latonHondo, 'm', 0.9) +
      [8, 18, 28, 38].map((dx) => trazo(`M${x + dx} ${y - 28} l0 26`, C.ambar, 0.6, 0.35)).join('')) +
    trazo(`M${x} ${y - 1} l${ancho} 0`, C.negro, 1.4, 0.8),
  );
}

/** La llama: el fuego de la galleta de *Luzbelito*, del blanco del corazón al rojo del borde. */
function llama(): string {
  const [lx, ly] = A.chimenea;
  const lengua = (alto: number, ancho: number, torcida: number): string =>
    `M${lx - ancho} ${ly} Q${lx - ancho * 1.2} ${ly - alto * 0.5} ${lx + torcida} ${ly - alto} Q${lx + ancho * 1.1} ${ly - alto * 0.45} ${lx + ancho} ${ly} Z`;
  return (
    nube(lx, ly - 30, 26, 40, C.naranja, 'l', 0.4) +
    soplo(lengua(72, 14, 6), C.rojo, 's', 0.9) +
    soplo(lengua(60, 11, 3), C.naranja, 's', 0.95) +
    soplo(lengua(44, 8, 1), C.amarillo, 'xs', 0.95) +
    soplo(lengua(26, 5, 0), C.nucleo, 'xs') +
    forma(lengua(14, 3, 0), C.nucleo)
  );
}

/** La risa de mil dientes cargados de azufre: la boca abierta de punta a punta, dos filas de dientitos amarillos. */
function risa(): string {
  const [mx, my] = A.boca;
  const BOCA = curva([[mx - 20, my - 6], [mx, my - 3], [mx + 20, my - 6], [mx + 16, my + 6], [mx, my + 12], [mx - 16, my + 6]]);
  const dientes = (fila: number): string =>
    Array.from({ length: 14 }, (_, i) => {
      const t = (i + 0.5) / 14;
      const x = mx - 18 + t * 36;
      const yb = fila === 0 ? my - 5 + Math.sin(Math.PI * t) * 2.5 : my + 8 - Math.sin(Math.PI * t) * 3;
      const h = 3.4 - Math.abs(t - 0.5) * 2;
      return forma(fila === 0 ? poli([[x - 1.2, yb], [x + 1.2, yb], [x, yb + h]]) : poli([[x - 1.2, yb], [x + 1.2, yb], [x, yb - h]]), C.amarillo);
    }).join('');
  return conGrano(enmascarado('m-zip-boca', BOCA, forma(BOCA, C.negro) + nube(mx, my + 6, 12, 4, C.rojo, 's', 0.85) + dientes(0) + dientes(1) + nube(mx - 6, my - 4, 8, 2, C.nucleo, 'xs', 0.5)));
}

/** El azufre de la risa: bocanadas amarillas que se le escapan de la boca. */
function azufre(): string {
  const [mx, my] = A.boca;
  return [[-30, -10, 14], [24, -16, 12], [-10, -30, 10], [36, 4, 9], [-40, 10, 8]].map(([dx, dy, r]) => nube(mx + dx!, my + dy!, r!, r! * 0.8, C.amarillo, 's', 0.55) + nube(mx + dx! - 2, my + dy! - 2, r! * 0.4, r! * 0.3, C.nucleo, 'xs', 0.5)).join('');
}

/* ------------------------------------------------------------------
   Lo suelto: el humo, las fichas y la mala sombra
   ------------------------------------------------------------------ */

/** El nubarrón: el cielo que se le ennegrece, negro soplado con el canto prendido por el fuego de atrás. */
function nubarron(): string {
  return (
    nube(0, 0, 110, 62, C.negro, 'xl', 0.9) + nube(-30, -10, 70, 40, C.negro, 'l', 0.8) + nube(50, 6, 60, 36, C.negro, 'l', 0.75) +
    nube(-40, -44, 40, 10, C.brasa, 'm', 0.5) + nube(40, -40, 30, 8, C.rojo, 'm', 0.3)
  );
}

/** Una bocanada del humo negro que deja: el cielo que se le ennegrece. */
function humo(): string {
  return nube(0, 0, 16, 13, C.negro, 'm', 0.85) + nube(-4, -4, 9, 7, C.brasa, 's', 0.5) + nube(5, 4, 9, 6, C.negro, 's', 0.7);
}

/** Una ficha del fichín, de las que no supo repartir: latón, con el agujero y la cruz. */
function ficha(): string {
  return conGrano(forma(elipse(0, 0, 9, 9), C.latonHondo) + forma(elipse(0, 0, 7.6, 7.6), C.laton) + nube(-2.4, -2.4, 3, 3, C.amarillo, 's', 0.8) + trazo('M-4 0 L4 0 M0 -4 L0 4', C.latonHondo, 1.4) + forma(elipse(0, 0, 1.6, 1.6), C.negro));
}

/** La mala sombra, en el damero: la silueta de la avioneta aplastada, con dos ojos rojos que lo miran. */
function sombra(): string {
  return (
    nube(0, 0, 82, 30, C.negro, 'm', 0.9) + nube(-10, -6, 50, 18, C.negro, 's', 0.7) +
    nube(64, -16, 12, 16, C.negro, 's', 0.8) +
    forma(elipse(-18, -4, 3, 2), C.rojo) + forma(elipse(-6, -4, 3, 2), C.rojo) + nube(-12, -4, 12, 5, C.rojo, 's', 0.35)
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const { x: CX, y: CY, ancho: CW, alto: CH } = A.caja;

export const PIEZAS_ZIPPO: readonly Pieza[] = [
  { nombre: 'zippo-sombra', caja: [-100, -42, 200, 84], dibujo: sombra(), densidad: 1.4 },
  { nombre: 'zippo-nubarron', caja: [-200, -130, 400, 260], dibujo: nubarron(), densidad: 0.8 },
  { nombre: 'zippo-humo', caja: [-36, -32, 72, 64], dibujo: humo(), densidad: 2 },
  { nombre: 'zippo-ficha', caja: [-11, -11, 22, 22], dibujo: ficha(), densidad: 4 },
  { nombre: 'zippo-bufanda', caja: [A.nudo[0] - 8, A.nudo[1] - 24, 140, 40], dibujo: bufanda(), densidad: D },
  { nombre: 'zippo-avion', caja: [-132, -74, 300, 158], dibujo: avion(), densidad: D * 0.8 },
  { nombre: 'zippo-borron', caja: [A.helice[0] - 22, A.helice[1] - A.largoHelice - 22, 44, A.largoHelice * 2 + 44], dibujo: borron(), densidad: 2 },
  { nombre: 'zippo-helice', caja: [A.helice[0] - 8, A.helice[1] - A.largoHelice - 4, 16, A.largoHelice * 2 + 8], dibujo: helice(), densidad: D },
  { nombre: 'zippo-cuerpo', caja: [-40, -50, 76, 54], dibujo: cuerpo(), densidad: D },
  { nombre: 'zippo-cabeza', caja: [CX - 6, CY - 16, CW + 12, CH + 26], dibujo: cabeza(), densidad: D * 1.2 },
  { nombre: 'zippo-risa', caja: [A.boca[0] - 24, A.boca[1] - 10, 48, 26], dibujo: risa(), densidad: D * 1.4 },
  { nombre: 'zippo-llama', caja: [A.chimenea[0] - 40, A.chimenea[1] - 90, 80, 96], dibujo: llama(), densidad: 2.4 },
  { nombre: 'zippo-tapa', caja: [CX - 4, CY - 34, CW + 8, 38], dibujo: tapa(), densidad: D * 1.2 },
  { nombre: 'zippo-azufre', caja: [A.boca[0] - 64, A.boca[1] - 50, 128, 80], dibujo: azufre(), densidad: 1.6 },
  { nombre: 'zippo-borde', caja: [-50, -18, 92, 26], dibujo: borde(), densidad: D },
  { nombre: 'zippo-brazo', caja: [-74, -44, 64, 54], dibujo: brazo(), densidad: D },
];

const img = imagenesDe(PIEZAS_ZIPPO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Lo que va en el recinto, fuera del cuerpo: el humo que queda atrás y las fichas que caen. */
function sueltos(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('nubarron', img('zippo-nubarron'), t.nubarron) +
    Array.from({ length: HUMOS }, (_, i) => parte(`humo-${i + 1}`, img('zippo-humo'), t[`humo-${i + 1}`], o[`humo-${i + 1}`])).join('') +
    Array.from({ length: FICHAS }, (_, i) => parte(`ficha-${i + 1}`, img('zippo-ficha'), t[`ficha-${i + 1}`], o[`ficha-${i + 1}`])).join('')
  );
}

/** Zippo y su avioneta, armados con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return parte('vuelo',
    parte('bufanda', img('zippo-bufanda'), t.bufanda) +
    img('zippo-avion') +
    parte('borron', img('zippo-borron'), '', o.borron) +
    parte('helice', img('zippo-helice'), t.helice, o.helice) +
    img('zippo-cuerpo') +
    parte('cabeza',
      img('zippo-cabeza') +
      parte('risa', img('zippo-risa'), '', o.risa) +
      parte('llama', img('zippo-llama'), t.llama, o.llama) +
      parte('tapa', img('zippo-tapa'), t.tapa) +
      parte('azufre', img('zippo-azufre'), t.azufre, o.azufre),
      t.cabeza) +
    img('zippo-borde') +
    parte('brazo', img('zippo-brazo'), t.brazo),
    t.vuelo);
}

/** La mala sombra en el damero, en un momento. */
const sombraEn = (m: Momento): string => {
  const { transform: t, opacity: o } = marcas(m);
  return parte('sombra', img('zippo-sombra'), t.sombra, o.sombra);
};

/** Zippo en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function zippoEn(m: Momento = QUIETO): string {
  return sombraEn(m) + sueltos(m) + `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: volando derecho con la cabeza prendida. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--zippo" data-id="zippo" role="button" tabindex="0" aria-label="${nombres.get('zippo') ?? 'Zippo'}">` +
    sueltos(QUIETO) +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: en picada, saludando, con la risa de mil dientes. */
export const RETRATO = { caja: [ZIPPO.x - 86, ZIPPO.y - 76, 172, 150] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('infierno-lejos') + `<g transform="${marcas(PICADA).transform.entero}">${armado({ ...PICADA, dy: 0 })}</g>`;
}

export const ZIPPO_PERSONAJE: Personaje = {
  id: 'zippo',
  region: 'el-infierno',
  ancla: ZIPPO.x,
  piezas: PIEZAS_ZIPPO,
  capas: { atras: () => sombraEn(QUIETO), figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
