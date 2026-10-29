/**
 * La piba con la remera de Greenpeace (`D-73`, vigesimotercera vuelta), dormida en la banquina de la ruta.
 *
 * *"Está dormida o finge que duerme"* es de *Una piba con la remera de Greenpeace…*, en *Momo sampler*
 * (2000). La letra dice que *"ya se cansó de dormir tanto tiempo en sillones"*: por eso duerme en el pasto,
 * con la cabeza en un almohadón de sillón que se trajo, con su botón, sus flecos, una quemadura de pucho y
 * un resorte que se le escapa por la costura. *"Se aparta corriendo"* de mamones, soquetes y fiolos: duerme
 * con las zapatillas puestas y atadas con doble nudo. Y la remera: la letra nombra la marca, el dibujo no
 * pinta el logo (como el ticket del Alien): es una remera blanca con una ballena pintada a mano, con su
 * chorro y una ola. Del dibujo son la pulsera de hilo, el aro, la media rota, las pecas y el mosquito.
 *
 * Viste *Momo sampler*, medido con sharp: la piel es la máscara del interior donde le da la luz, el pelo lo
 * hondo de ese fondo, la remera la plata del envase, la ballena el vidrio y el lila de los ojos de la
 * contratapa; el jean y las zapatillas, las rayas de murga de los cachetes; el almohadón, el rosa y el oro de
 * las letras del título.
 *
 * Coordenadas: el (0, 0) es el pasto debajo de la cadera, y la cabeza se dibuja derecha y se acuesta
 * girándola (`rig-piba.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { FINGE, PIBA, PIBA_ARMADO as A, QUIETO, marcas, type Momento } from './rig-piba.ts';

/** Las tintas de *Momo sampler* (`tokens.css`). */
const C = {
  piel: 'var(--bestia-piba-piel)',
  pielHonda: 'var(--bestia-piba-piel-honda)',
  pielClara: 'var(--bestia-piba-piel-clara)',
  brillo: 'var(--bestia-piba-brillo)',
  pelo: 'var(--bestia-piba-pelo)',
  hondo: 'var(--bestia-piba-hondo)',
  peloLuz: 'var(--bestia-piba-pelo-luz)',
  remera: 'var(--bestia-piba-remera)',
  remeraClara: 'var(--bestia-piba-remera-clara)',
  remeraSombra: 'var(--bestia-piba-remera-sombra)',
  ballena: 'var(--bestia-piba-ballena)',
  ballenaClara: 'var(--bestia-piba-ballena-clara)',
  jean: 'var(--bestia-piba-jean)',
  jeanClaro: 'var(--bestia-piba-jean-claro)',
  zapatilla: 'var(--bestia-piba-zapatilla)',
  zapatillaHonda: 'var(--bestia-piba-zapatilla-honda)',
  boca: 'var(--bestia-piba-boca)',
  almohadon: 'var(--bestia-piba-almohadon)',
  almohadonHondo: 'var(--bestia-piba-almohadon-hondo)',
  oro: 'var(--bestia-piba-oro)',
};

/** Un miembro: un tubo de `a` a `b` que se afina de `ra` a `rb`. */
function tubo([ax, ay]: P, [bx, by]: P, ra: number, rb: number): string {
  const ang = Math.atan2(by - ay, bx - ax);
  const [nx, ny] = [-Math.sin(ang), Math.cos(ang)];
  return curva([[ax + nx * ra, ay + ny * ra], [(ax + bx) / 2 + nx * (ra + rb) * 0.52, (ay + by) / 2 + ny * (ra + rb) * 0.52], [bx + nx * rb, by + ny * rb], [bx + Math.cos(ang) * rb * 0.6, by + Math.sin(ang) * rb * 0.6], [bx - nx * rb, by - ny * rb], [(ax + bx) / 2 - nx * (ra + rb) * 0.52, (ay + by) / 2 - ny * (ra + rb) * 0.52], [ax - nx * ra, ay - ny * ra], [ax - Math.cos(ang) * ra * 0.6, ay - Math.sin(ang) * ra * 0.6]]);
}

/* ------------------------------------------------------------------
   El almohadón del sillón
   ------------------------------------------------------------------ */

function almohadon(): string {
  const d = curva([[-212, -34], [-196, -46], [-160, -44], [-122, -48], [-108, -34], [-106, -12], [-114, -2], [-160, 0], [-200, -2], [-216, -14]]);
  // El capitoné: el botón del medio y las arrugas que tira.
  const [bx, by] = [-186, -22];
  const arrugas = [[-208, -36], [-160, -40], [-158, -6], [-208, -6]].map(([x, y]) => trazo(`M${bx} ${by} Q${(bx + x!) / 2 + 3} ${(by + y!) / 2 - 3} ${x} ${y}`, C.almohadonHondo, 1.4, 0.7)).join('');
  // El resorte que se escapa por la costura de la punta, de tanto sillón.
  const resorte = trazo('M-208 -40 c-2 -6 -8 -6 -8 -1 c0 5 -7 4 -7 -2 c0 -6 -7 -6 -7 0 c0 5 -6 3 -6 -2', C.remeraClara, 1.3) + trazo('M-208 -40 c-2 -6 -8 -6 -8 -1 c0 5 -7 4 -7 -2', C.remeraSombra, 0.6, 0.8);
  const fleco = (x: number, y: number, s: number): string => trazo(`M${x} ${y} l${s * 6} 4 M${x} ${y} l${s * 7} 0 M${x} ${y} l${s * 6} -3`, C.oro, 1, 0.9) + forma(elipse(x, y, 2, 2), C.oro);
  return conGrano(
    nube(-160, 0, 60, 5, C.hondo, 's', 0.8) +
    enmascarado('m-piba-almohadon', d,
      forma(d, C.almohadon) +
      nube(-170, -40, 44, 8, C.brillo, 'm', 0.35) + nube(-160, -2, 56, 10, C.almohadonHondo, 'm', 0.9) + nube(-112, -18, 8, 20, C.almohadonHondo, 'm', 0.7) +
      arrugas +
      // La quemadura de pucho, de cuando era de un living.
      nube(-200, -12, 4, 3, C.hondo, 's', 0.8) + forma(elipse(-200, -12, 1.6, 1.2), C.hondo)) +
    // El ribete de la costura, y el botón.
    trazo('M-212 -34 C-196 -46 -160 -44 -122 -48', C.oro, 1.4, 0.75) +
    forma(elipse(bx, by, 3.6, 3), C.oro) + nube(bx - 1, by - 1, 1.2, 1, C.brillo, 'xs', 0.9) +
    fleco(-213, -34, -1) + fleco(-216, -12, -1) + resorte,
  );
}

/** La mano de abajo, metida debajo del cachete. */
function manoAbajo(): string {
  const [x, y] = A.manoAbajo;
  const d = curva([[x - 12, y + 4], [x - 6, y - 6], [x + 6, y - 8], [x + 12, y - 2], [x + 8, y + 6], [x - 4, y + 8]]);
  return conGrano(enmascarado('m-piba-mano-abajo', d, forma(d, C.piel) + nube(x + 4, y + 4, 8, 4, C.pielHonda, 's', 0.8)) +
    [-4, 1, 6].map((dx) => trazo(`M${x + dx} ${y - 6} q1 4 0 8`, C.pielHonda, 0.8, 0.8)).join(''));
}

/* ------------------------------------------------------------------
   El cuerpo: la pierna de abajo, el torso con la remera, la pierna de arriba
   ------------------------------------------------------------------ */

/** La zapatilla de lona con el doble nudo, por si hay que salir corriendo. */
function zapatilla([x, y]: P, giro: number, id: string): string {
  const d = curva([[x - 12, y - 6], [x - 4, y - 10], [x + 8, y - 8], [x + 18, y - 2], [x + 18, y + 6], [x - 12, y + 6]]);
  return `<g transform="rotate(${giro} ${x} ${y})">` +
    enmascarado(id, d, forma(d, C.zapatilla) + nube(x + 4, y - 6, 10, 3, C.boca, 's', 0.7) + nube(x, y + 2, 14, 4, C.zapatillaHonda, 's', 0.8)) +
    // La suela y la puntera de goma.
    forma(poli([[x - 13, y + 3], [x + 19, y + 3], [x + 18, y + 7], [x - 12, y + 7]]), C.remeraClara) + forma(curva([[x + 10, y - 4], [x + 18, y - 2], [x + 18, y + 4], [x + 11, y + 3]]), C.remera) +
    trazo(`M${x - 13} ${y + 5} L${x + 18} ${y + 5}`, C.remeraSombra, 0.7, 0.8) +
    // Los cordones cruzados, y el moño con doble nudo.
    trazo(`M${x - 4} ${y - 9} l5 6 M${x + 1} ${y - 9} l-5 6 M${x + 2} ${y - 8} l5 5 M${x + 7} ${y - 7} l-5 5`, C.remeraClara, 1) +
    trazo(`M${x - 2} ${y - 10} q-6 -6 -9 -1 q4 3 9 1 q4 -6 8 -2 q-3 4 -8 2`, C.remeraClara, 1.1) + forma(elipse(x - 2, y - 10, 1.6, 1.4), C.remeraClara) +
    `</g>`;
}

function piernas(): string {
  const cadera: P = [0, -16];
  const rodilla: P = [76, -12];
  const tobillo: P = [132, -9];
  const muslo = tubo(cadera, rodilla, 15, 11);
  const canilla = tubo(rodilla, tobillo, 11, 8);
  return conGrano(
    nube(70, 0, 80, 4, C.hondo, 's', 0.8) +
    enmascarado('m-piba-muslo-1', muslo, forma(muslo, C.jean) + nube(40, -24, 34, 4, C.jeanClaro, 's', 0.8) + nube(40, -4, 40, 4, C.hondo, 's', 0.7)) +
    enmascarado('m-piba-canilla-1', canilla, forma(canilla, C.jean) + nube(104, -18, 26, 3, C.jeanClaro, 's', 0.7) + nube(100, -4, 30, 3, C.hondo, 's', 0.7)) +
    // La costura del jean y el dobladillo arremangado.
    trazo('M4 -22 Q40 -26 76 -21', C.jeanClaro, 0.8, 0.6) + forma(poli([[124, -18], [132, -18], [133, 0], [125, 0]]), C.jeanClaro) +
    // La media, que asoma rota en el talón.
    forma(poli([[133, -16], [140, -16], [141, -2], [133, -2]]), C.remeraClara) + forma(elipse(137, -6, 1.6, 1.4), C.piel) +
    zapatilla([148, -8], 2, 'm-piba-zapa-1'),
  );
}

const TORSO: readonly P[] = [[-112, -60], [-102, -74], [-82, -78], [-56, -68], [-30, -60], [-2, -64], [16, -52], [20, -28], [12, -6], [-20, -2], [-60, -1], [-98, -3], [-116, -14], [-120, -38]];

/** La ballena pintada a mano en la remera, con su chorro y una ola: lo que hay en vez del logo. */
function ballena(cx: number, cy: number): string {
  const d = curva([[cx - 20, cy], [cx - 16, cy - 8], [cx - 2, cy - 10], [cx + 12, cy - 6], [cx + 18, cy - 2], [cx + 22, cy - 8], [cx + 28, cy - 12], [cx + 26, cy - 3], [cx + 29, cy + 4], [cx + 21, cy + 1], [cx + 14, cy + 5], [cx - 4, cy + 7], [cx - 16, cy + 5]]);
  // Pintada con pincel gordo: el borde se corre, la panza va más clara y el chorro son tres pinceladas.
  return forma(d, C.ballena, 0.92) + trazo(d, C.ballena, 1.4, 0.7) +
    nube(cx - 2, cy + 3, 14, 2.4, C.ballenaClara, 's', 0.8) + trazo(`M${cx - 14} ${cy + 3} Q${cx} ${cy + 6} ${cx + 12} ${cy + 3}`, C.ballenaClara, 0.9, 0.8) +
    forma(elipse(cx - 12, cy - 2, 1.3, 1.3), C.remeraClara) +
    trazo(`M${cx - 6} ${cy - 10} q-2 -6 -6 -9 M${cx - 5} ${cy - 10} q0 -7 1 -10 M${cx - 4} ${cy - 10} q3 -5 7 -7`, C.ballenaClara, 1.3, 0.9) +
    trazo(`M${cx - 24} ${cy + 13} q5 -4 10 0 t10 0 t10 0 t10 0`, C.ballena, 1.6, 0.75);
}

function torso(): string {
  const d = curva(TORSO);
  const remera = poli([[-130, -90], [-8, -90], [-12, -40], [-6, 6], [-130, 6]]);
  const jean = poli([[-8, -90], [40, -90], [40, 6], [-6, 6], [-12, -40]]);
  // Las arrugas de la remera, de dormir de costado.
  const arrugas = [[-100, -66, -84, -48], [-40, -58, -30, -40], [-90, -14, -70, -20], [-30, -10, -16, -18]].map(([a, b, c, e]) => trazo(`M${a} ${b} Q${(a! + c!) / 2 + 4} ${(b! + e!) / 2} ${c} ${e}`, C.remeraSombra, 1.2, 0.7)).join('');
  return conGrano(
    nube(-50, 0, 70, 5, C.hondo, 's', 0.85) +
    enmascarado('m-piba-torso', d,
      `<g clip-path="url(#m-piba-remera)">` + forma(d, C.remeraClara) +
        nube(-70, -66, 46, 8, C.brillo, 'm', 0.7) + nube(-60, -4, 60, 12, C.remera, 'm', 0.95) + nube(-60, 2, 60, 6, C.remeraSombra, 'm', 0.9) + nube(-114, -30, 8, 24, C.remera, 'm', 0.8) +
        arrugas + ballena(-64, -34) + `</g>` +
      `<clipPath id="m-piba-remera"><path d="${remera}"/></clipPath>` +
      enmascarado('m-piba-cadera', jean, forma(d, C.jean) + nube(4, -54, 14, 6, C.jeanClaro, 'm', 0.8) + nube(6, -8, 16, 6, C.hondo, 'm', 0.8) +
        // El bolsillo de atrás y la presilla del cinto.
        trazo('M4 -46 q8 2 10 10', C.jeanClaro, 0.9, 0.7) + forma(poli([[-10, -60], [-6, -60], [-6, -52], [-10, -52]]), C.jeanClaro, 0.8))) +
    // El ruedo de la remera, que se le subió de un lado.
    trazo('M-8 -64 Q-14 -40 -10 -18 Q-8 -8 -6 -2', C.remeraClara, 1.6, 0.85),
  );
}

/** El muslo de arriba, del jean. */
function muslo(): string {
  const d = tubo(A.muslo, A.rodilla, 16, 12);
  return conGrano(enmascarado('m-piba-muslo-2', d, forma(d, C.jean) + nube(38, -58, 34, 5, C.jeanClaro, 's', 0.85) + nube(40, -30, 40, 5, C.hondo, 's', 0.7) + nube(70, -48, 8, 8, C.jeanClaro, 's', 0.5)) +
    trazo('M8 -56 Q40 -60 70 -58', C.jeanClaro, 0.8, 0.6));
}

/** La pantorrilla de arriba, con la zapatilla. */
function pantorrilla(): string {
  const d = tubo(A.rodilla, A.tobillo, 12, 8);
  const [tx, ty] = A.tobillo;
  return conGrano(
    enmascarado('m-piba-canilla-2', d, forma(d, C.jean) + nube(100, -50, 26, 3, C.jeanClaro, 's', 0.8) + nube(100, -32, 28, 3, C.hondo, 's', 0.6)) +
    // El rodillón gastado del jean.
    nube(74, -50, 6, 5, C.jeanClaro, 's', 0.7) +
    forma(poli([[tx - 6, ty - 9], [tx + 2, ty - 10], [tx + 4, ty + 8], [tx - 4, ty + 9]]), C.jeanClaro) +
    forma(poli([[tx + 3, ty - 8], [tx + 10, ty - 7], [tx + 11, ty + 7], [tx + 3, ty + 8]]), C.remeraClara) +
    zapatilla([tx + 18, ty + 2], 14, 'm-piba-zapa-2'),
  );
}

/* ------------------------------------------------------------------
   El brazo de arriba, que se rasca y espanta
   ------------------------------------------------------------------ */

function brazo(): string {
  const d = tubo(A.hombro, A.codo, 9, 7);
  const manga = curva([[-96, -66], [-86, -70], [-74, -69], [-70, -60], [-74, -51], [-88, -51], [-96, -57]]);
  return conGrano(
    enmascarado('m-piba-brazo', d, forma(d, C.piel) + nube(-60, -64, 16, 3, C.pielClara, 's', 0.7) + nube(-60, -52, 18, 3, C.pielHonda, 's', 0.8)) +
    enmascarado('m-piba-manga', manga, forma(manga, C.remeraClara) + nube(-84, -68, 12, 3, C.brillo, 's', 0.8) + nube(-82, -52, 12, 4, C.remera, 's', 0.9)) +
    trazo('M-74 -69 Q-68 -60 -74 -51', C.remeraSombra, 1.2, 0.8),
  );
}

function antebrazo(): string {
  const d = tubo(A.codo, A.mano, 7, 5.5);
  const [hx, hy] = A.mano;
  const mano = curva([[hx - 7, hy - 4], [hx + 2, hy - 8], [hx + 9, hy - 4], [hx + 10, hy + 4], [hx + 3, hy + 8], [hx - 5, hy + 5]]);
  return conGrano(
    enmascarado('m-piba-antebrazo', d, forma(d, C.piel) + nube(-30, -56, 12, 2.4, C.pielClara, 's', 0.7) + nube(-26, -46, 14, 3, C.pielHonda, 's', 0.8)) +
    enmascarado('m-piba-mano', mano, forma(mano, C.piel) + nube(hx + 4, hy + 4, 6, 4, C.pielHonda, 's', 0.8) + nube(hx - 2, hy - 5, 4, 2, C.pielClara, 's', 0.7)) +
    [-1, 2, 5].map((dx) => trazo(`M${hx + dx + 2} ${hy - 6} q3 5 1 10`, C.pielHonda, 0.7, 0.8)).join('') +
    // La pulsera de hilo, de las de la playa.
    trazo(`M${hx - 9} ${hy - 9} q2 6 -1 12`, C.oro, 1.6, 0.9) + trazo(`M${hx - 11} ${hy - 9} q2 6 -1 12`, C.boca, 1, 0.8),
  );
}

/* ------------------------------------------------------------------
   La cabeza, derecha sobre el cuello (la acuesta el giro)
   ------------------------------------------------------------------ */

const CARA: readonly P[] = [[-104, -110], [-88, -104], [-82, -88], [-86, -72], [-96, -62], [-104, -59], [-112, -62], [-122, -72], [-126, -88], [-120, -104]];

function cabeza(): string {
  const d = curva(CARA);
  const [cx, cy] = A.cara;
  const [bx, by] = A.boca;
  // El pelo largo y suelto, que se desparrama por el almohadón (para el lado de la cara que queda abajo).
  const melena = curva([[-104, -122], [-80, -114], [-74, -92], [-80, -72], [-90, -66], [-118, -60], [-140, -56], [-160, -62], [-150, -74], [-140, -90], [-134, -110], [-120, -120]]);
  const mechones = [[-126, -80, -158, -66], [-130, -96, -156, -84], [-122, -70, -150, -54], [-118, -108, -146, -100]].map(([a, b, c, e]) => trazo(`M${a} ${b} Q${(a! + c!) / 2} ${(b! + e!) / 2 - 8} ${c} ${e}`, C.peloLuz, 1.6, 0.8)).join('');
  const cuelloD = curva([[-111, -66], [-97, -66], [-98, -48], [-104, -44], [-110, -48]]);
  const cuello = enmascarado('m-piba-cuello', cuelloD, forma(cuelloD, C.piel) + nube(-108, -56, 4, 10, C.pielHonda, 's', 0.9));
  // Los ojos cerrados: las pestañas para abajo, como quien duerme. O se hace.
  const pestanas = A.ojos.map(([x, y]) => trazo(`M${x - 6} ${y} Q${x} ${y + 4} ${x + 6} ${y}`, C.pelo, 1.6) + [-3, 0, 3].map((dx) => trazo(`M${x + dx} ${y + 2.6} l${dx * 0.3} 2.4`, C.pelo, 0.7, 0.9)).join('')).join('');
  const pecas = [[-110, -78], [-107, -80], [-98, -79], [-101, -77], [-113, -76], [-95, -77]].map(([x, y]) => forma(elipse(x!, y!, 0.7, 0.7), C.pielHonda, 0.9)).join('');
  const nariz = trazo(`M${cx - 1} ${cy - 1} Q${cx + 2} ${cy + 5} ${cx - 1} ${cy + 7}`, C.pielHonda, 1, 0.8) + nube(cx + 2, cy + 3, 1.6, 2, C.brillo, 'xs', 0.8);
  // La boca cerrada, apretadita: si duerme o se hace, no se sabe.
  const boca = trazo(`M${bx - 4} ${by} Q${bx} ${by + 1.6} ${bx + 4} ${by - 0.6}`, C.boca, 1.6) + nube(bx, by + 2.4, 3, 1, C.boca, 'xs', 0.5);
  const flequillo = curva([[-124, -100], [-118, -114], [-100, -116], [-84, -106], [-86, -96], [-94, -102], [-100, -96], [-108, -102], [-114, -96], [-120, -98]]);
  return conGrano(
    enmascarado('m-piba-melena', melena, forma(melena, C.pelo) + nube(-90, -100, 12, 16, C.peloLuz, 'm', 0.8) + nube(-146, -66, 14, 8, C.hondo, 's', 0.9)) +
    mechones + cuello +
    enmascarado('m-piba-cara', d,
      forma(d, C.piel) +
      // La luz de arriba (que es el costado derecho de la cara parada) y lo hondo contra el almohadón.
      nube(-90, -88, 10, 18, C.pielClara, 'm', 0.8) + nube(-122, -82, 10, 22, C.pielHonda, 'm', 0.9) + nube(cx, -60, 14, 5, C.pielHonda, 'm', 0.6) +
      pecas) +
    pestanas + nariz + boca +
    enmascarado('m-piba-flequillo', flequillo, forma(flequillo, C.pelo) + nube(-94, -110, 8, 4, C.peloLuz, 's', 0.9)) +
    // El aro, que asoma entre el pelo.
    forma(elipse(-83, -78, 1.8, 2.6), C.oro) + nube(-83.5, -79, 0.6, 0.8, C.brillo, 'xs', 0.9),
  );
}

/** Un ojo abierto, sin la pupila: el blanco y el párpado de arriba. */
function ojo(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const d = curva([[x - 6, y], [x - 2, y - 3.6], [x + 3, y - 3.4], [x + 6, y + 0.4], [x + 2, y + 3], [x - 3, y + 2.8]]);
  return enmascarado(`m-piba-ojo-${n}`, d, forma(d, C.brillo) + nube(x, y - 3, 6, 2, C.remeraSombra, 's', 0.7)) +
    trazo(`M${x - 6.6} ${y + 0.2} Q${x - 1} ${y - 5} ${x + 6.4} ${y}`, C.pelo, 1.6) + trazo(`M${x + 5} ${y - 1} l2 -2`, C.pelo, 0.8);
}

/** La pupila, que se corre para mirar. */
function pupila(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  return forma(elipse(x, y, 2.6, 2.6), C.pelo) + forma(elipse(x, y, 1.2, 1.2), C.hondo) + forma(elipse(x - 0.9, y - 1, 0.7, 0.7), C.brillo);
}

/** Los ojos apretados fuerte, de hacerse la dormida con ganas, con las arrugas de los costados. */
function aprieta(): string {
  return conGrano(A.ojos.map(([x, y], i) => {
    const s = i ? 1 : -1;
    return nube(x, y, 7, 4.6, C.piel, 's', 0.95) +
      trazo(i ? `M${x + 5} ${y - 3} L${x - 4} ${y} L${x + 5} ${y + 3}` : `M${x - 5} ${y - 3} L${x + 4} ${y} L${x - 5} ${y + 3}`, C.pelo, 1.8) +
      trazo(`M${x + s * 7} ${y - 2} l${s * 3} -2 M${x + s * 7.4} ${y + 1} l${s * 3.4} 0 M${x + s * 7} ${y + 3} l${s * 3} 2`, C.pielHonda, 0.8, 0.9);
  }).join('') + trazo(`M${A.nariz[0] - 3} ${A.nariz[1] - 3} q3 -1.6 6 0`, C.pielHonda, 0.8, 0.8));
}

/** Las cejas, que suben cuando espía o cuando se da cuenta de que la vieron. */
function cejas(): string {
  return A.ojos.map(([x, y], i) => trazo(i ? `M${x - 5} ${y - 8} Q${x} ${y - 11} ${x + 6} ${y - 8}` : `M${x - 6} ${y - 8} Q${x} ${y - 11} ${x + 5} ${y - 8}`, C.pelo, 1.8, 0.95)).join('');
}

/** La boca abierta del ronquido de mentira. */
function bocaAbierta(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx - 5, by - 2], [bx, by - 4], [bx + 5, by - 2], [bx + 5, by + 4], [bx, by + 7], [bx - 5, by + 4]]);
  return conGrano(enmascarado('m-piba-boca', d, forma(d, C.hondo) + nube(bx, by + 5, 4, 2, C.boca, 's', 0.9)) + trazo(d, C.boca, 1.4));
}

/** Lo colorado de los cachetes, cuando la vieron. */
function rubor(): string {
  return nube(-117, -75, 6, 3.4, C.boca, 's', 0.9) + nube(-91, -75, 6, 3.4, C.boca, 's', 0.9) +
    [-1, 1].map((s) => trazo(`M${-104 + s * 13 - 3} -75 l2 -2 M${-104 + s * 13} -75 l2 -2 M${-104 + s * 13 + 3} -75 l2 -2`, C.boca, 0.8, 0.8)).join('');
}

/** Un zzz de mentira, recortado en papel. */
function zeta(): string {
  const d = poli([[-6, -6], [6, -6], [6, -3], [-1, 3], [6, 3], [6, 6], [-6, 6], [-6, 3], [1, -3], [-6, -3]]);
  return conGrano(nube(1, 1, 6, 6, C.hondo, 's', 0.6) + enmascarado('m-piba-zeta', d, forma(d, C.remeraClara) + nube(4, 4, 6, 4, C.remeraSombra, 's', 0.8)));
}

/** El mosquito, el mamón de la noche. */
function bicho(): string {
  return conGrano(
    forma(elipse(-3, -4, 4, 2.4), C.brillo, 0.55) + forma(elipse(3, -4.4, 4, 2.4), C.brillo, 0.45) +
    trazo('M-2 1 l-4 5 M0 1 l0 6 M2 1 l4 5 M5 0 l4 -1', C.pelo, 0.7) +
    forma(elipse(0, 0, 5, 2), C.pelo) + forma(elipse(5.4, -0.4, 1.8, 1.6), C.pelo) + trazo('M7 0 l4 1.4', C.pelo, 0.6) +
    nube(-1, -0.6, 2, 0.6, C.peloLuz, 'xs', 0.9),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3;
const [E1x, E1y] = A.ojos[0];
const [E2x, E2y] = A.ojos[1];
const [BX, BY] = A.boca;

export const PIEZAS_PIBA: readonly Pieza[] = [
  { nombre: 'piba-almohadon', caja: [-240, -62, 140, 68], dibujo: almohadon(), densidad: D },
  { nombre: 'piba-mano-abajo', caja: [-146, -36, 32, 24], dibujo: manoAbajo(), densidad: D },
  { nombre: 'piba-piernas', caja: [-16, -34, 190, 40], dibujo: piernas(), densidad: D },
  { nombre: 'piba-torso', caja: [-126, -84, 152, 90], dibujo: torso(), densidad: D },
  { nombre: 'piba-muslo', caja: [-14, -66, 100, 44], dibujo: muslo(), densidad: D },
  { nombre: 'piba-pantorrilla', caja: [56, -66, 112, 54], dibujo: pantorrilla(), densidad: D },
  { nombre: 'piba-brazo', caja: [-102, -78, 66, 38], dibujo: brazo(), densidad: D },
  { nombre: 'piba-antebrazo', caja: [-58, -70, 72, 40], dibujo: antebrazo(), densidad: D },
  { nombre: 'piba-cabeza', caja: [-166, -128, 104, 92], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'piba-ojo-1', caja: [E1x - 8, E1y - 7, 16, 12], dibujo: ojo(0), densidad: D * 2 },
  { nombre: 'piba-ojo-2', caja: [E2x - 8, E2y - 7, 16, 12], dibujo: ojo(1), densidad: D * 2 },
  { nombre: 'piba-pupila-1', caja: [E1x - 4, E1y - 4, 8, 8], dibujo: pupila(0), densidad: D * 2 },
  { nombre: 'piba-pupila-2', caja: [E2x - 4, E2y - 4, 8, 8], dibujo: pupila(1), densidad: D * 2 },
  { nombre: 'piba-aprieta', caja: [-126, -96, 44, 22], dibujo: aprieta(), densidad: D * 1.6 },
  { nombre: 'piba-cejas', caja: [-124, -100, 40, 12], dibujo: cejas(), densidad: D * 1.6 },
  { nombre: 'piba-boca', caja: [BX - 8, BY - 7, 16, 17], dibujo: bocaAbierta(), densidad: D * 1.6 },
  { nombre: 'piba-rubor', caja: [-130, -86, 52, 20], dibujo: rubor(), densidad: D },
  { nombre: 'piba-zeta', caja: [-12, -12, 24, 24], dibujo: zeta(), densidad: D * 1.4 },
  { nombre: 'piba-bicho', caja: [-10, -10, 24, 20], dibujo: bicho(), densidad: D * 2 },
];

const img = imagenesDe(PIEZAS_PIBA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La piba armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    `<ellipse cx="-20" cy="2" rx="170" ry="9" class="bt-piba-sombra"/>` +
    img('piba-almohadon') + img('piba-mano-abajo') +
    parte('cuerpo',
      img('piba-piernas') +
      parte('torso', img('piba-torso'), t.torso) +
      parte('pierna', img('piba-muslo') + parte('pantorrilla', img('piba-pantorrilla'), t.pantorrilla), t.pierna) +
      parte('cabeza',
        img('piba-cabeza') +
        parte('ojo-1', img('piba-ojo-1') + parte('pupila-1', img('piba-pupila-1'), t['pupila-1']), t['ojo-1'], o['ojo-1']) +
        parte('ojo-2', img('piba-ojo-2') + parte('pupila-2', img('piba-pupila-2'), t['pupila-2']), t['ojo-2'], o['ojo-2']) +
        parte('aprieta', img('piba-aprieta'), '', o.aprieta) +
        parte('cejas', img('piba-cejas'), t.cejas) +
        parte('boca', img('piba-boca'), t.boca, o.boca) +
        parte('rubor', img('piba-rubor'), '', o.rubor),
        t.cabeza) +
      // El brazo va después de la cabeza: cuando espanta al mosquito, la mano pasa por delante del pelo.
      parte('brazo', img('piba-brazo') + parte('antebrazo', img('piba-antebrazo'), t.antebrazo), t.brazo),
      t.cuerpo) +
    [1, 2, 3].map((n) => parte(`zeta-${n}`, img('piba-zeta'), t[`zeta-${n}`], o[`zeta-${n}`])).join('') +
    parte('bicho', img('piba-bicho'), t.bicho, o.bicho)
  );
}

/** La piba en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function pibaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: dormida, o haciéndose. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--piba" data-id="la-piba-de-greenpeace" role="button" tabindex="0" aria-label="${nombres.get('la-piba-de-greenpeace') ?? 'La piba con la remera de Greenpeace'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: espiando con un ojo, con un zzz de mentira en el aire, en la banquina. */
export const RETRATO = { caja: [PIBA.x - 140, PIBA.piso - 110, 240, 124] as const };
function retrato(): string {
  // Cada fondo en su caja de `arte-entornos.ts`: lo lejano entero y el piso desde y = 200.
  return `<image href="/bestiario/ruta-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/ruta-piso.webp" x="0" y="200" width="900" height="440" preserveAspectRatio="none"/>` + pibaEn(FINGE);
}

export const PIBA_PERSONAJE: Personaje = {
  id: 'la-piba-de-greenpeace',
  region: 'la-ruta',
  ancla: PIBA.x,
  piezas: PIEZAS_PIBA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
