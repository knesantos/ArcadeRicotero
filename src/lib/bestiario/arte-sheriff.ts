/**
 * El Sheriff (`D-73`, vigesimonovena vuelta, `T-529`), atendiendo su puestito de tiro al blanco en el ala del templo.
 *
 * *"¡Sheriff! ¡Sheriff! ¡Sheriff! ¡Qué limpio el templo está, si Alí Babá se va! Todo en su sitio así. Son tres tiros
 * a un peso, y la guita es miel"* es de *Sheriff*, en *Momo sampler* (2000). Se toma al pie de la letra: el sheriff es
 * el feriante de una kermés armada adentro del templo. *"Son tres tiros a un peso"* es el puestito, con el rifle
 * encadenado al mostrador y el precio pintado en la chapa (tres balas, un peso). Los blancos son ladroncitos de chapa
 * recortada, y en la fila hay un lugar vacío con la pintura sin gastar donde estuvo uno y un cartelito colgado:
 * *"Alí Babá se va"*. *"La guita es miel"* es la caja: un frasco de miel con las monedas pegoteadas adentro, la mano
 * del sheriff apoyada en un charquito y una gota que cuelga del mostrador. *"Todo en su sitio así"* es lo que hace
 * cuando lo tocan: caen dos, el tercer tiro erra, y él tumba el tercero con el dedo, sin mirar.
 *
 * De la letra son el sheriff, el templo limpio, Alí Babá que se fue, los tres tiros, el peso, la miel y todo en su
 * sitio. Del dibujo son el toldo, que los blancos sean los ladrones del cuento, el bigote y que haga trampa.
 *
 * Viste *Momo sampler*, medido con sharp: la estrella, la chapa y el rifle son la plata del medallón de la tapa; el
 * saco, el sombrero y el toldo, el violeta de la máscara de la contratapa; los ladroncitos y el pañuelo, el rojo
 * quemado de las letras del título, y la miel, su oro.
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio del mostrador (`rig-sheriff.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, f, poli } from './trazos.ts';
import { EMPUJA, HILO, QUIETO, SHERIFF, SHERIFF_ARMADO as A, marcas, type Momento } from './rig-sheriff.ts';

const ID = 'el-sheriff';

/** Las tintas de *Momo sampler* (`tokens.css`). */
const C = {
  lata: 'var(--bestia-sheriff-lata)',
  lataClara: 'var(--bestia-sheriff-lata-clara)',
  lataMedia: 'var(--bestia-sheriff-lata-media)',
  lataHonda: 'var(--bestia-sheriff-lata-honda)',
  negro: 'var(--bestia-sheriff-negro)',
  noche: 'var(--bestia-sheriff-noche)',
  violetaHondo: 'var(--bestia-sheriff-violeta-hondo)',
  violeta: 'var(--bestia-sheriff-violeta)',
  violetaClaro: 'var(--bestia-sheriff-violeta-claro)',
  lila: 'var(--bestia-sheriff-lila)',
  rojoHondo: 'var(--bestia-sheriff-rojo-hondo)',
  rojo: 'var(--bestia-sheriff-rojo)',
  cobre: 'var(--bestia-sheriff-cobre)',
  piel: 'var(--bestia-sheriff-piel)',
  mielHonda: 'var(--bestia-sheriff-miel-honda)',
  miel: 'var(--bestia-sheriff-miel)',
  ojo: 'var(--bestia-ojo-blanco)',
};

/** Un azar con semilla, para que las abolladuras caigan siempre igual. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const remache = (x: number, y: number): string => forma(elipse(x, y, 1.5, 1.5), C.lataClara) + forma(elipse(x + 0.4, y + 0.5, 0.8, 0.8), C.lataHonda);

/* ------------------------------------------------------------------
   Los ladroncitos de chapa
   ------------------------------------------------------------------ */

/**
 * La silueta de un ladroncito, con los pies en el (0, 0): un hombre de chapa recortada, parado de frente. Las babuchas
 * de punta enrulada, las bombachas, el cuerpo con un brazo colgando y el otro doblado a la cintura, y la cabeza con el
 * turbante y su nudo. Sin cara: es chapa.
 */
const CUERPO: ReadonlyArray<readonly [number, number]> = [
  [-3, 0], [-12, 0], [-15.5, -2.5], [-15, -5.5], [-13, -3.5], [-8, -4], [-10, -9], [-9, -15], [-6.5, -17.5], [-9, -19.5], [-12.5, -21], [-11, -24.5], [-8.5, -23],
  [-9, -30.5], [-3, -32.5], [-2.6, -33.6], [2.6, -33.6], [3, -32.5], [9, -30.5], [11.5, -23], [9, -19.5], [6.5, -17.5], [9, -15], [10, -9], [8, -4], [13, -3.5], [15, -5.5], [15.5, -2.5], [12, 0], [3, 0],
  [1.5, -7], [0, -9], [-1.5, -7],
];
const SILUETA = `${poli(CUERPO)} ${elipse(0, -36.4, 4.3, 4.3)} ${elipse(0, -40, 6.4, 3.7)} ${elipse(5.6, -41.6, 2, 1.8)}`;
/** El alfanje, en la mano de la cintura, cruzado por delante del cuerpo con la punta para abajo: una medialuna de chapa. */
const ALFANJE = 'M6 -21.6 Q-6 -20.5 -17.5 -8 Q-7 -13.6 4.6 -17.4 Z';

/** Un ladroncito de chapa recortada, pintado de un color y despintado a balazos. */
function ladron(tinta: string, sombra: string, semilla: number): string {
  const rnd = azar(semilla);
  let picado = '';
  for (let i = 0; i < 6; i++) picado += forma(elipse(-7 + rnd() * 14, -32 + rnd() * 28, 0.8 + rnd() * 1.2, 0.7 + rnd() * 0.9), C.lataMedia, 0.85);
  return conGrano(
    // La bisagra, en la repisa.
    forma(caja(-6, -1.6, 12, 3.2), C.lataHonda) +
    enmascarado(`m-sheriff-ladron-${semilla}`, SILUETA,
      forma(SILUETA, tinta) + nube(-7, -18, 4, 18, sombra, 's', 0.7) +
      // La faja, y las vueltas del turbante.
      forma(caja(-10, -19, 20, 2.6), C.lila, 0.85) + trazo('M-6 -39.4 Q0 -37.4 6 -39.6 M-5 -41.6 Q0 -40 5 -42', C.lila, 0.9, 0.85) + picado) +
    trazo(SILUETA, sombra, 0.8, 0.8) +
    // La diana, pintada en el pecho.
    trazo(elipse(0, -25.8, 3.3, 3.3), C.lila, 1, 0.95) + forma(elipse(0, -25.8, 1.1, 1.1), C.lila) +
    // El alfanje, cruzado por delante, y la mano que lo agarra.
    forma(ALFANJE, C.lataMedia) + trazo('M5 -21 Q-6 -19.6 -16.4 -8.6', C.lataClara, 0.8, 0.9) + trazo('M3.6 -22.6 l2.4 6', C.lataHonda, 1.5) + forma(elipse(5.4, -19.4, 2.3, 2.2), tinta) + trazo(elipse(5.4, -19.4, 2.3, 2.2), sombra, 0.6, 0.8),
  );
}

/* ------------------------------------------------------------------
   El quiosco: los palos, el toldo, la tabla de los blancos y el lugar del que se fue
   ------------------------------------------------------------------ */

function elFondo(): string {
  const rnd = azar(401);
  // El toldo: rayas, con el ruedo en ondas.
  const y0 = -296;
  let rayas = '';
  let ondas = '';
  for (let i = 0; i < 8; i++) {
    const x = -84 + i * 21;
    const tinta = i % 2 ? C.violetaClaro : C.rojo;
    rayas += forma(poli([[x, y0], [x + 21, y0], [x + 21, y0 + 22], [x, y0 + 22]]), tinta);
    ondas += forma(`M${x} ${y0 + 21.5} h21 a10.5 9 0 0 1 -21 0 Z`, tinta);
  }
  const toldo = `M-84 ${y0} H84 V${y0 + 22} H-84 Z`;
  let astillas = '';
  for (let i = 0; i < 16; i++) astillas += trazo(`M${f(-68 + rnd() * 136)} ${f(-258 + rnd() * 40)} h${f(5 + rnd() * 10)}`, C.violetaHondo, 0.8, 0.7);
  const fantasma = SILUETA;
  const T = A.talla;
  return (
    // El apoyo en el piso del templo.
    nube(0, 2, 84, 5, C.negro, 's', 0.7) +
    conGrano(
      // El telón del fondo, detrás del sheriff: lo despega del templo.
      forma(caja(-74, -210, 148, 140), C.negro) + nube(0, -140, 60, 50, C.noche, 'l', 0.9) +
      // La tabla de los blancos.
      forma(caja(-74, -264, 148, 56), C.noche) + nube(0, -262, 74, 8, C.violetaHondo, 's', 0.9) + astillas +
      trazo('M-74 -264 H74 M-74 -238 H74', C.violetaHondo, 0.9, 0.5) +
      // El lugar de Alí Babá: donde estuvo la chapa, la pintura quedó sin gastar; alrededor, el polvo de pólvora.
      `<g transform="translate(0 ${A.repisa}) scale(${T})">` +
      `<path d="${fantasma}" fill="none" stroke="${C.lila}" stroke-width="5" stroke-linejoin="round" opacity="0.14"/>` +
      forma(fantasma, C.violeta, 0.95) + forma(ALFANJE, C.violeta, 0.95) +
      `<path d="${fantasma}" fill="none" stroke="${C.lila}" stroke-width="1" stroke-dasharray="2.4 2.2" opacity="0.8"/>` +
      // La bisagra, doblada y sin nadie.
      forma(poli([[-6, -1.6], [6, -1.6], [7, -6], [4, -6.4], [3, -3], [-6, 1.6]]), C.lataMedia) + remache(-3, -0.4) +
      `</g>` +
      // La repisa.
      forma(caja(-76, A.repisa, 152, 5), C.lata) + trazo(`M-76 ${A.repisa + 0.6} H76`, C.lataClara, 1, 0.9) + nube(0, A.repisa + 6, 74, 3, C.negro, 'xs', 0.8) +
      // El piolín que para a los ladroncitos: corre por debajo de la repisa, con un tiro a cada bisagra, pasa por una argolla y
      // baja por el palo hasta el mostrador, donde lo tiene agarrado.
      trazo(`M56 ${A.repisa + 8} H-65`, C.lila, 0.9, 0.9) + A.blancos.map(({ x }) => trazo(`M${x} ${A.repisa + 4} V${A.repisa + 8}`, C.lila, 0.8, 0.9)).join('') +
      trazo(elipse(-67, A.repisa + 9, 2.3, 2.3), C.lataClara, 1.1) + trazo(`M-67 ${A.repisa + 11.4} V${A.mostrador.tapa}`, C.lila, 0.9, 0.9) +
      // Los dos palos.
      [-77, 71].map((x) => forma(caja(x, y0 + 6, 6, -y0 - 6), C.lataHonda) + trazo(`M${x + 1.4} ${y0 + 8} V-2`, C.lataMedia, 1.2, 0.8)).join('') +
      // El toldo.
      enmascarado('m-sheriff-toldo', toldo, rayas + nube(0, y0 + 22, 90, 5, C.negro, 's', 0.6) + nube(-30, y0 + 2, 40, 4, C.lila, 's', 0.25)) +
      ondas + trazo(`M-84 ${y0} H84`, C.lila, 1, 0.6),
    )
  );
}

/** El cartelito del que se fue: una etiqueta colgada de un clavo, con una flecha para afuera. Sin letras. */
function elCartel(): string {
  const [kx, ky] = A.cartel;
  return (
    forma(elipse(kx, ky, 1.3, 1.3), C.lataClara) + trazo(`M${kx} ${ky} l-3 5 M${kx} ${ky} l3 5`, C.lila, 0.7, 0.9) +
    conGrano(forma(cajaRedonda(kx - 6.5, ky + 5, 13, 9, 1), C.lila) + trazo(`M${kx - 4} ${ky + 9.5} h7.4 m-2.6 -2.4 l2.6 2.4 l-2.6 2.4`, C.rojo, 1.4))
  );
}

/** El fogonazo de un tiro que pega, en el (0, 0): un ¡pum! de grabado. Tinta plana, puntas rotas y desparejas, y las esquirlas sueltas. Sin halo. */
function elFogonazo(): string {
  const rnd = azar(419);
  const puntas: Array<readonly [number, number]> = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + (rnd() - 0.5) * 0.24;
    const r = i % 2 ? 4 + rnd() * 2.4 : 8.5 + rnd() * 8;
    puntas.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const a = (k: number): Array<readonly [number, number]> => puntas.map(([x, y]) => [x * k, y * k] as const);
  const esquirlas = [[15, -9], [-15.5, 6], [9, 14.5], [-11, -14]].map(([x, y]) => forma(poli([[x!, y!], [x! + 3, y! + 1], [x! + 1, y! + 3.4]]), C.miel)).join('');
  return forma(poli(a(1.14)), C.rojoHondo) + forma(poli(puntas), C.miel) + forma(poli(a(0.46)), C.lataClara) + esquirlas;
}

/** El agujero del tiro que erra, en la tabla: negro, con la chapa rajada alrededor. */
function elAgujero(): string {
  const [x, y] = A.yerro;
  return forma(elipse(x, y, 2.8, 2.8), C.negro) + trazo(elipse(x, y, 3.3, 3.3), C.lataMedia, 0.8, 0.9) + trazo(`M${x + 3} ${y - 2} l5 -4 M${x - 3} ${y + 2} l-5 2 M${x + 1} ${y + 3.4} l2 5 M${x - 2} ${y - 3.2} l-2 -4`, C.lila, 0.8, 0.85);
}

/* ------------------------------------------------------------------
   El sheriff
   ------------------------------------------------------------------ */

const [NX, NY] = A.cuello;
const [SX, SY] = A.estrella;

/** Una estrella de seis puntas con sus bolitas, de lata. */
function estrella(x: number, y: number, r: number): string {
  const pts: Array<readonly [number, number]> = [];
  let bolitas = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.52 : r;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    if (i % 2 === 0) bolitas += forma(elipse(x + Math.cos(a) * (r + 1), y + Math.sin(a) * (r + 1), 1.9, 1.9), C.lataClara);
  }
  const d = poli(pts);
  return forma(d, C.lataHonda) + enmascarado('m-sheriff-estrella', d, forma(d, C.lataMedia) + nube(x - 3, y - 3, r * 0.7, r * 0.6, C.lataClara, 'xs', 0.9) + nube(x + 4, y + 5, r * 0.6, r * 0.5, C.lataHonda, 'xs', 0.7)) +
    trazo(d, C.lataHonda, 0.9) + bolitas + trazo(elipse(x, y, r * 0.3, r * 0.3), C.lataHonda, 0.9);
}

/** El torso: el saco, las solapas, el pañuelo, la estrella de lata y el brazo de cerca hasta el codo. */
function elTorso(): string {
  const d = curva([[-48, -138], [-30, -146], [-2, -146], [16, -138], [20, -112], [18, -66], [-50, -66], [-52, -112]]);
  const [cx, cy] = A.codo;
  const manga = curva([[-50, -140], [-40, -136], [-42, -104], [cx + 6, cy + 6], [cx - 6, cy + 5], [-57, -110], [-56, -130]]);
  return conGrano(
    enmascarado('m-sheriff-torso', d,
      forma(d, C.violeta) + nube(-16, -70, 40, 20, C.violetaHondo, 'm', 0.9) + nube(14, -110, 8, 34, C.violetaHondo, 's', 0.8) + nube(-20, -142, 30, 5, C.violetaClaro, 's', 0.7) +
      // La camisa y las solapas.
      forma(poli([[-24, -146], [-8, -146], [-16, -100]]), C.lila, 0.9) + forma(poli([[-30, -146], [-24, -146], [-16, -102], [-27, -122]]), C.violetaClaro) + forma(poli([[-8, -146], [-2, -146], [-5, -122], [-16, -102]]), C.violetaClaro) +
      [-94, -84, -74].map((y) => forma(elipse(-16, y, 1.6, 1.6), C.lataMedia)).join('') + trazo('M-16 -100 V-66', C.violetaHondo, 1, 0.9)) +
    // El pañuelo, anudado al cuello.
    forma(curva([[-27, -147], [-16, -143], [-5, -147], [-9, -138], [-16, -132], [-23, -138]]), C.rojo) + nube(-16, -136, 5, 3, C.rojoHondo, 'xs', 0.7) + trazo('M-22 -144 q6 4 12 0', C.cobre, 0.8, 0.8) +
    // La manga de cerca, hasta el codo.
    enmascarado('m-sheriff-manga', manga, forma(manga, C.violeta) + nube(-54, -120, 4, 22, C.violetaHondo, 's', 0.8) + nube(-45, -122, 3, 18, C.violetaClaro, 's', 0.6)) +
    forma(elipse(cx, cy, 7.4, 7.4), C.violeta) + nube(cx + 1, cy + 3, 5, 4, C.violetaHondo, 'xs', 0.7) +
    estrella(SX, SY, 11.5),
  );
}

/** El antebrazo de cerca: del codo a la mano, que apoya en el mostrador. La moneda pegada va aparte. */
function elAntebrazo(): string {
  const [cx, cy] = A.codo;
  const [mx, my] = A.mano;
  const d = curva([[cx - 3, cy - 6.5], [cx + 6, cy - 4], [mx - 8, my - 9], [mx - 5, my + 1], [mx - 12, my + 3], [cx - 5, cy + 6.5]]);
  return conGrano(
    enmascarado('m-sheriff-antebrazo', d, forma(d, C.violeta) + nube((cx + mx) / 2 - 4, (cy + my) / 2 + 5, 14, 4, C.violetaHondo, 's', 0.8, 39) + nube((cx + mx) / 2 + 2, (cy + my) / 2 - 4, 12, 2.5, C.violetaClaro, 's', 0.6, 39)) +
    trazo(`M${mx - 9} ${my - 8} l3.6 9`, C.lila, 1.6, 0.9) +
    // La mano, con los dedos abiertos, pegoteada.
    forma(curva([[mx - 8, my - 6], [mx, my - 6.5], [mx + 7, my - 3], [mx + 8, my + 1], [mx + 2, my + 2.4], [mx - 6, my + 2]]), C.piel) + nube(mx, my + 1.4, 6, 1.6, C.cobre, 'xs', 0.7) +
    trazo(`M${mx + 1} ${my - 5.4} l5 3.6 M${mx - 1} ${my - 3.4} l6 3.2 M${mx - 3} ${my - 1.4} l5 2.6`, C.cobre, 0.8, 0.8),
  );
}

/** La moneda que se le queda pegada en los dedos, con su pegote. */
function laPegada(): string {
  const [mx, my] = A.mano;
  return nube(mx + 5, my + 1, 5, 3, C.miel, 'xs', 0.8) + moneda(mx + 6, my + 1.5, 4.2);
}

/** Una moneda de un peso. */
function moneda(x: number, y: number, r: number): string {
  return forma(elipse(x, y, r, r), C.cobre) + trazo(elipse(x, y, r - 1, r - 1), C.miel, 0.8, 0.9) + trazo(`M${f(x - 0.8)} ${f(y - r * 0.4)} l1.2 -1 v${f(r * 0.9)}`, C.rojoHondo, 1);
}

/**
 * El brazo de lejos, dibujado levantado con el dedo en el tercer ladroncito: el brazo sale del hombro para afuera, quiebra
 * en el codo, y el antebrazo llega al blanco desde abajo, en diagonal. El índice sale de un puño con los otros dedos
 * cerrados. Gira del hombro.
 */
function elBrazoLejos(): string {
  const [hx, hy] = A.hombro;
  const L = A.largo;
  // Dibujado con el dedo derecho para arriba del hombro, y girado hacia el pecho del tercer ladroncito.
  const giro = (Math.atan2(A.blancos[2]!.x - hx, -(A.repisa - 25.8 * A.talla - hy)) * 180) / Math.PI;
  // El codo, afuera; y la muñeca, abajo del puño.
  const [ex, ey] = [15, -L * 0.44];
  const [wx, wy] = [1.4, -L + 22];
  return (
    `<g transform="translate(${hx} ${hy}) rotate(${f(giro)})">` +
    conGrano(
      // El brazo, del hombro al codo, y el antebrazo, del codo a la muñeca: dos tramos de manga, más fina arriba.
      trazo(`M0 2 L${ex} ${f(ey)}`, C.violetaHondo, 15) + trazo(`M${ex} ${f(ey)} L${wx} ${f(wy)}`, C.violetaHondo, 12.4) +
      trazo(`M-3.4 0 L${ex - 4} ${f(ey + 3)}`, C.violeta, 3, 0.9) + trazo(`M${ex - 3.6} ${f(ey - 4)} L${wx - 3} ${f(wy + 3)}`, C.violeta, 2.6, 0.9) +
      // El codo: la punta, y las arrugas de la manga donde quiebra.
      forma(elipse(ex + 1.6, ey + 0.6, 7.4, 7), C.violetaHondo) + trazo(`M${ex - 5} ${f(ey - 1)} q4 -3.4 9 -1.6 M${ex - 6} ${f(ey + 2.6)} q4 -2.4 8 -1`, C.negro, 0.8, 0.55) + trazo(`M${ex + 5.6} ${f(ey + 4.6)} q2.6 -4 0.6 -8.6`, C.violetaClaro, 0.9, 0.8) +
      // El puño de la camisa.
      trazo(`M${wx - 6} ${f(wy + 1.6)} l12 -1.2`, C.lila, 2.2, 0.95) +
      // El puño cerrado: el dorso, los tres dedos doblados con sus nudillos, y el pulgar cruzado encima.
      forma(curva([[-5.4, -L + 22], [5.6, -L + 21.4], [7, -L + 14], [5.6, -L + 9.6], [-4.4, -L + 10.4], [-6.4, -L + 14]]), C.piel) + nube(3.4, -L + 16, 2.4, 4, C.cobre, 'xs', 0.6) +
      [-1.4, 1.6, 4.4].map((x, i) => forma(cajaRedonda(x, -L + 7.6 + i * 0.6, 2.8, 5, 1.3), C.piel) + trazo(`M${x + 0.3} ${f(-L + 9.4 + i * 0.6)} h2.2`, C.cobre, 0.7, 0.9)).join('') +
      forma(curva([[-3, -L + 15], [2.6, -L + 12.6], [5.4, -L + 13.8], [4.6, -L + 16.6], [-1, -L + 18.6]]), C.piel) + trazo(`M-2.6 ${f(-L + 15.4)} q4 -2.6 7.4 -1.4`, C.cobre, 0.8, 0.9) +
      // El índice, estirado, por el costado.
      forma(cajaRedonda(-6.4, -L, 4.6, 12.4, 2.2), C.piel) + trazo(`M-5.2 ${-L + 0.8} h2.2`, C.lila, 0.8, 0.8) + trazo(`M-5.6 ${f(-L + 6.6)} h3`, C.cobre, 0.6, 0.8),
    ) +
    `</g>`
  );
}

const [[E1X, EY], [E2X]] = A.ojos;
const [ERX, ERY] = A.ojo;

/**
 * La cabeza: el sombrero texano y una cara larga y gastada. Ojeras, la piel picada, la nariz de gancho, el bigote
 * encerado en dos puntas duras y, en la boca torcida, un diente de oro. Los ojos, sin pupila: van aparte.
 */
function laCabeza(): string {
  const cara = curva([[NX - 14, NY - 30], [NX + 14, NY - 30], [NX + 14.5, NY - 15], [NX + 9.4, NY - 3], [NX + 3.4, NY + 3.6], [NX - 3.4, NY + 3.6], [NX - 9.4, NY - 3], [NX - 14.5, NY - 15]]);
  const ala = curva([[NX - 46, NY - 29], [NX - 28, NY - 36], [NX, NY - 38], [NX + 28, NY - 36], [NX + 46, NY - 29], [NX + 30, NY - 25], [NX, NY - 23.5], [NX - 30, NY - 25]]);
  const copa = curva([[NX - 21, NY - 33], [NX - 20, NY - 52], [NX - 9, NY - 58], [NX, NY - 53], [NX + 9, NY - 58], [NX + 20, NY - 52], [NX + 21, NY - 33]]);
  // El bigote, encerado: dos puntas duras para arriba.
  const bigote = poli([[NX, NY - 10.2], [NX + 7, NY - 11.4], [NX + 15, NY - 9.6], [NX + 25, NY - 16.4], [NX + 17, NY - 6.6], [NX + 7, NY - 6.6], [NX, NY - 7.8], [NX - 7, NY - 6.6], [NX - 17, NY - 6.6], [NX - 25, NY - 16.4], [NX - 15, NY - 9.6], [NX - 7, NY - 11.4]]);
  const rnd = azar(421);
  let picada = '';
  for (let i = 0; i < 16; i++) {
    const lado = i % 2 ? 1 : -1;
    picada += forma(elipse(NX + lado * (5.6 + rnd() * 7), NY - 14 + rnd() * 9, 0.5 + rnd() * 0.5, 0.4 + rnd() * 0.4), C.rojo, 0.75);
  }
  let barba = '';
  for (let i = 0; i < 22; i++) barba += forma(elipse(NX - 9 + rnd() * 18, NY - 3.6 + rnd() * 6, 0.36, 0.36), C.lataHonda, 0.8);
  const ojera = (x: number): string =>
    forma(`M${x - 4.8} ${EY + 2.4} Q${x} ${EY + 8.6} ${x + 4.8} ${EY + 2.4} Q${x} ${EY + 5} ${x - 4.8} ${EY + 2.4} Z`, C.rojoHondo, 0.8) + trazo(`M${x - 4} ${EY + 7.6} Q${x} ${EY + 10.4} ${x + 4} ${EY + 7.4}`, C.cobre, 0.7, 0.9);
  return conGrano(
    // El cogote y las orejas.
    forma(caja(NX - 6, NY - 6, 12, 10), C.cobre) + forma(elipse(NX - 15.6, NY - 16, 2.6, 5), C.cobre) + forma(elipse(NX + 15.6, NY - 16, 2.6, 5), C.cobre) +
    enmascarado('m-sheriff-cara', cara,
      forma(cara, C.piel) + nube(NX, NY - 28, 18, 6, C.rojoHondo, 's', 0.8) + nube(NX + 12, NY - 10, 5, 14, C.cobre, 's', 0.8) + nube(NX - 13, NY - 10, 4, 12, C.cobre, 's', 0.5) +
      // Las mejillas, chupadas.
      nube(NX - 9, NY - 6, 3, 5, C.rojoHondo, 'xs', 0.55) + nube(NX + 9, NY - 6, 3, 5, C.rojoHondo, 'xs', 0.6) + picada + barba) +
    // Las arrugas de la frente, debajo del ala.
    trazo(`M${NX - 9} ${NY - 25.6} q9 -1.6 18 0 M${NX - 7} ${NY - 23.4} q7 -1.2 14 0`, C.rojoHondo, 0.7, 0.8) +
    ojera(E1X) + ojera(E2X) +
    // El blanco de los ojos.
    forma(elipse(E1X, EY, ERX, ERY), C.ojo) + forma(elipse(E2X, EY, ERX, ERY), C.ojo) +
    // La nariz, de gancho: un filo, con la sombra de un lado.
    forma(poli([[NX - 1.6, NY - 23], [NX + 1.6, NY - 23], [NX + 4.8, NY - 13.4], [NX + 2.6, NY - 10.6], [NX - 0.8, NY - 9.6], [NX - 3.4, NY - 11.4], [NX - 2.2, NY - 14]]), C.cobre) +
    trazo(`M${NX - 0.6} ${NY - 22.4} L${NX + 1.6} ${NY - 13.4}`, C.piel, 0.9, 0.9) + forma(elipse(NX + 1.8, NY - 11.2, 1.1, 0.7), C.rojoHondo) +
    // La boca, torcida para abajo, con el diente de oro.
    trazo(`M${NX - 6} ${NY - 2.6} Q${NX} ${NY - 5} ${NX + 6.4} ${NY - 1.4}`, C.rojoHondo, 1.3) + forma(poli([[NX + 1.2, NY - 4.2], [NX + 3.8, NY - 3.6], [NX + 3.4, NY - 0.8], [NX + 1.4, NY - 1.4]]), C.miel) + trazo(`M${NX + 1.8} ${NY - 3.6} v1.6`, C.lataClara, 0.5, 0.9) +
    forma(bigote, C.lila) + trazo(`M${NX} ${NY - 10} v2.4 M${NX - 7} ${NY - 9.4} L${NX - 22} ${NY - 13.4} M${NX + 7} ${NY - 9.4} L${NX + 22} ${NY - 13.4}`, C.lataHonda, 0.7, 0.8) +
    // El sombrero: la copa abollada, la cinta y el ala ancha.
    enmascarado('m-sheriff-copa', copa, forma(copa, C.violeta) + nube(NX - 10, NY - 46, 8, 12, C.violetaClaro, 's', 0.7) + nube(NX + 12, NY - 42, 8, 14, C.violetaHondo, 's', 0.9) + nube(NX, NY - 52, 3, 7, C.violetaHondo, 's', 0.9)) +
    forma(caja(NX - 21, NY - 39, 42, 5), C.rojo) + trazo(`M${NX - 21} ${NY - 38.4} h42`, C.cobre, 0.8, 0.8) +
    enmascarado('m-sheriff-ala', ala, forma(ala, C.violetaHondo) + nube(NX, NY - 36, 44, 4, C.violeta, 's', 0.95) + nube(NX, NY - 24, 40, 3, C.negro, 's', 0.7)) +
    trazo(`M${NX - 44} ${NY - 29.6} Q${NX - 28} ${NY - 37} ${NX} ${NY - 38.6} Q${NX + 28} ${NY - 37} ${NX + 44} ${NY - 29.6}`, C.violetaClaro, 1.2, 0.95),
  );
}

function lasPupilas(): string {
  return [E1X, E2X].map((x) => forma(elipse(x, EY + 0.4, 1.9, 2), C.negro) + forma(elipse(x - 0.6, EY - 0.4, 0.6, 0.6), C.ojo)).join('');
}

/** Los párpados: pesados, con la ceja encima. La isla los baja desde arriba. */
function losParpados(): string {
  return conGrano(
    [E1X, E2X].map((x) => forma(elipse(x, EY, ERX + 1.2, ERY + 1.2), C.cobre) + trazo(`M${x - ERX - 1} ${EY + 1.4} Q${x} ${EY + ERY + 2} ${x + ERX + 1} ${EY + 1.4}`, C.rojoHondo, 1)).join(''),
  );
}

/** Las cejas: gruesas, caídas para afuera. No se mueven: van arriba de los párpados. */
function lasCejas(): string {
  return trazo(`M${E1X - 5} ${EY - 3.4} L${E1X + 4} ${EY - 6.6} M${E2X + 5} ${EY - 3.4} L${E2X - 4} ${EY - 6.6}`, C.lila, 1.9);
}

/** El vaho que le echa a la estrella. */
function elVaho(): string {
  return nube(SX + 2, SY - 2, 13, 9, C.lila, 's', 0.55) + nube(SX - 6, SY + 4, 7, 5, C.lataClara, 's', 0.4);
}

/** El brillo que le saca: un destello de cuatro puntas y otro chico, de tinta plana. Sin halo. */
function elBrillo(): string {
  const d = `M${SX - 4} ${SY - 18} l2 10 l10 2 l-10 2 l-2 10 l-2 -10 l-10 -2 l10 -2 Z`;
  const chico = `M${SX + 7} ${SY - 19} l1 4 l4 1 l-4 1 l-1 4 l-1 -4 l-4 -1 l4 -1 Z`;
  return forma(d, C.lataClara) + forma(chico, C.lataClara);
}

/* ------------------------------------------------------------------
   El mostrador, el rifle, el frasco y la miel
   ------------------------------------------------------------------ */

function elMostrador(): string {
  const { desde, hasta, tapa } = A.mostrador;
  const frente = caja(desde, tapa + 4, hasta - desde, -tapa - 4);
  const rnd = azar(409);
  let acanalado = '';
  for (let x = desde + 8; x < hasta; x += 8) acanalado += trazo(`M${x} ${tapa + 6} V-1`, C.lataHonda, 1, 0.5) + trazo(`M${x + 1.4} ${tapa + 6} V-1`, C.lataClara, 0.6, 0.35);
  let oxido = '';
  for (let i = 0; i < 7; i++) oxido += nube(desde + 6 + rnd() * (hasta - desde - 12), -4 - rnd() * 14, 5 + rnd() * 6, 3 + rnd() * 4, C.rojo, 's', 0.35);
  const [mx, my] = A.mano;
  const [gx, gy] = A.gota;
  // El cartel del precio: tres balas, igual, un peso.
  const bala = (x: number): string => forma(`M${x - 2.6} -29 v-9 q2.6 -6 5.2 0 v9 Z`, C.lila) + forma(caja(x - 3, -29, 6, 2.4), C.miel);
  return conGrano(
    enmascarado('m-sheriff-frente', frente, forma(frente, C.lata) + nube(0, -4, 90, 14, C.lataHonda, 'm', 0.9) + nube(-30, tapa + 10, 50, 6, C.lataMedia, 's', 0.6) + acanalado + oxido) +
    forma(cajaRedonda(-44, -46, 88, 25, 2), C.rojo) + trazo(cajaRedonda(-44, -46, 88, 25, 2), C.lila, 1, 0.8) +
    bala(-32) + bala(-22) + bala(-12) + trazo('M2 -36 h8 M2 -31.6 h8', C.lila, 1.8) + moneda(28, -33.6, 8) +
    remache(desde + 4, tapa + 9) + remache(hasta - 4, tapa + 9) + remache(desde + 4, -5) + remache(hasta - 4, -5) +
    // La tapa del mostrador.
    forma(cajaRedonda(desde - 4, tapa - 1, hasta - desde + 8, 6.4, 1.6), C.lataMedia) + trazo(`M${desde - 3} ${tapa - 0.2} H${hasta + 3}`, C.lataClara, 1.1, 0.95) + nube(0, tapa + 6.4, 84, 2.4, C.negro, 'xs', 0.7) +
    // El piolín de los blancos, que baja por el palo y llega a la mano, con su taquito de madera.
    trazo(`M-67 ${tapa - 1} Q-58 ${tapa - 4.4} ${mx - 11} ${my + 0.6}`, C.lila, 0.9, 0.9) + forma(cajaRedonda(mx - 15, my - 1.2, 7, 3, 1.2), C.cobre) +
    // El charquito de miel donde apoya la mano, y el hilo que se va por el canto.
    forma(elipse(mx + 2, my + 2.6, 15, 2.6), C.miel) + nube(mx + 4, my + 3, 9, 1.4, C.mielHonda, 'xs', 0.8) +
    moneda(mx - 9, my + 2, 3) + moneda(mx + 13, my + 2.4, 3) +
    forma(`M${gx - 2} ${my + 3} q2 6 1 ${gy - my - 6} q1 3 2 0 q-1 -8 1 ${-(gy - my - 6)} Z`, C.miel) +
    // La argolla donde termina la cadena del rifle.
    trazo(elipse(46, tapa + 12, 3, 3), C.lataMedia, 1.6),
  );
}

/** El rifle de aire, parado en el mostrador contra el palo: la culata abajo, el caño para arriba, y la cadena que lo ata. */
function elRifle(): string {
  const tapa = A.mostrador.tapa;
  const culata = curva([[52, tapa - 1], [66, tapa - 1], [66, tapa - 16], [63.4, tapa - 34], [58.6, tapa - 34], [57, tapa - 20], [52, tapa - 12]]);
  return (
    `<g transform="rotate(4 59 ${tapa})">` +
    conGrano(
      enmascarado('m-sheriff-culata', culata, forma(culata, C.cobre) + nube(56, tapa - 12, 3, 14, C.rojo, 'xs', 0.8) + nube(63, tapa - 14, 2, 14, C.piel, 'xs', 0.6)) +
      // La caja del gatillo, el caño y la mira.
      forma(caja(58, tapa - 54, 6.4, 22), C.lataHonda) + trazo(`M58 ${tapa - 36} q-5 3 -1 7`, C.lataMedia, 1.3) + trazo(`M57.4 ${tapa - 44} l-4 3`, C.lataClara, 1.2) +
      forma(caja(59.4, tapa - 116, 3.6, 64), C.lata) + trazo(`M60.2 ${tapa - 115} V${tapa - 54}`, C.lataClara, 0.8, 0.9) + forma(caja(58.6, tapa - 119, 5.2, 3.4), C.lataHonda) + forma(caja(60.4, tapa - 122, 1.6, 3), C.lataMedia) +
      forma(caja(58.2, tapa - 76, 6, 3), C.lataMedia),
    ) +
    `</g>` +
    // La cadena, del gatillo a la argolla del mostrador: cuelga.
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => trazo(elipse(55.6 - i * 1.3 + (i > 5 ? (i - 5) * 0.8 : 0), tapa - 36 + i * 6.4 - i * i * 0.1, 1.5, 2.3), C.lataClara, 0.9)).join('')
  );
}

/** El frasco de miel: la caja. Vidrio, miel hasta la mitad y las monedas pegoteadas adentro. */
function elFrasco(): string {
  const [fx, fy] = A.frasco;
  const base = A.mostrador.tapa - 1;
  const d = cajaRedonda(fx - 11, fy + 3, 22, base - fy - 3, 4);
  return (
    enmascarado('m-sheriff-frasco', d,
      forma(d, C.lataHonda, 0.45) + forma(caja(fx - 12, fy + 13, 24, 30), C.mielHonda) + nube(fx - 3, fy + 16, 9, 4, C.miel, 'xs', 0.95) + nube(fx + 6, fy + 26, 4, 6, C.rojoHondo, 'xs', 0.5) +
      moneda(fx - 4, fy + 24, 3.4) + moneda(fx + 4.4, fy + 20.6, 3.2) + moneda(fx + 1, fy + 28.4, 3.2)) +
    trazo(d, C.lataClara, 1.2, 0.9) + trazo(`M${fx - 7.6} ${fy + 8} v${base - fy - 14}`, C.lataClara, 1.4, 0.7) +
    // La boca del frasco, abierta.
    forma(elipse(fx, fy + 3, 11, 3), C.negro, 0.8) + trazo(elipse(fx, fy + 3, 11, 3), C.lataClara, 1.3)
  );
}

/** La gota de miel, con la punta en el (0, 0): la isla la cuelga del canto, la estira y la suelta. */
function laGota(): string {
  return forma('M0 -5 Q3.4 2 0 4.6 Q-3.4 2 0 -5 Z', C.miel) + forma(elipse(-0.8, 1.6, 0.8, 1.2), C.lataClara, 0.8);
}

/** El hilo de miel, del (0, 0) para arriba. */
function elHilo(): string {
  return trazo(`M0 0 V${-HILO}`, C.miel, 1.7) + trazo(`M0.5 -2 V${-HILO + 2}`, C.lataClara, 0.5, 0.7);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [HX, HY] = A.hombro;
const [CX, CY] = A.codo;
const [MX, MY] = A.mano;

export const PIEZAS_SHERIFF: readonly Pieza[] = [
  { nombre: 'sheriff-fondo', caja: [-92, -310, 184, 322], dibujo: elFondo(), densidad: 2 },
  { nombre: 'sheriff-cartel', caja: [A.cartel[0] - 9, A.cartel[1] - 3, 18, 20], dibujo: elCartel(), densidad: D * 2 },
  { nombre: 'sheriff-ladron-rojo', caja: [-20, -46, 40, 50], dibujo: ladron(C.rojo, C.rojoHondo, 3), densidad: D * 1.6 },
  { nombre: 'sheriff-ladron-cobre', caja: [-20, -46, 40, 50], dibujo: ladron(C.cobre, C.rojo, 5), densidad: D * 1.6 },
  { nombre: 'sheriff-agujero', caja: [A.yerro[0] - 10, A.yerro[1] - 9, 20, 20], dibujo: elAgujero(), densidad: D * 2 },
  { nombre: 'sheriff-fogonazo', caja: [-20, -20, 40, 40], dibujo: elFogonazo(), densidad: D },
  { nombre: 'sheriff-brazo-lejos', caja: [HX - 14, HY - A.largo - 6, 52, A.largo + 20], dibujo: elBrazoLejos(), densidad: D },
  { nombre: 'sheriff-torso', caja: [-62, -150, 86, 86], dibujo: elTorso(), densidad: D },
  { nombre: 'sheriff-brillo', caja: [SX - 20, SY - 22, 32, 30], dibujo: elBrillo(), densidad: D * 1.4 },
  { nombre: 'sheriff-cabeza', caja: [NX - 50, NY - 62, 100, 70], dibujo: laCabeza(), densidad: D * 1.5 },
  { nombre: 'sheriff-pupilas', caja: [E1X - 4, EY - 4, E2X - E1X + 8, 8], dibujo: lasPupilas(), densidad: D * 3 },
  { nombre: 'sheriff-parpados', caja: [E1X - 6, EY - 5.4, E2X - E1X + 12, 12], dibujo: losParpados(), densidad: D * 3 },
  { nombre: 'sheriff-cejas', caja: [E1X - 8, EY - 10, E2X - E1X + 16, 10], dibujo: lasCejas(), densidad: D * 3 },
  { nombre: 'sheriff-vaho', caja: [SX - 24, SY - 20, 50, 40], dibujo: elVaho(), densidad: 1.6 },
  { nombre: 'sheriff-mostrador', caja: [-88, -90, 180, 92], dibujo: elMostrador(), densidad: D },
  { nombre: 'sheriff-rifle', caja: [38, A.mostrador.tapa - 128, 40, 148], dibujo: elRifle(), densidad: D * 1.3 },
  { nombre: 'sheriff-frasco', caja: [A.frasco[0] - 14, A.frasco[1] - 2, 28, 36], dibujo: elFrasco(), densidad: D * 1.6 },
  { nombre: 'sheriff-moneda', caja: [-6, -6, 12, 12], dibujo: moneda(0, 0, 4.6), densidad: D * 2.4 },
  { nombre: 'sheriff-gota', caja: [-5, -6, 10, 12], dibujo: laGota(), densidad: D * 2.4 },
  { nombre: 'sheriff-hilo', caja: [-2, -HILO - 1, 4, HILO + 2], dibujo: elHilo(), densidad: D * 2 },
  { nombre: 'sheriff-antebrazo', caja: [CX - 10, CY - 10, MX - CX + 22, MY - CY + 16], dibujo: elAntebrazo(), densidad: D * 1.3 },
  { nombre: 'sheriff-pegada', caja: [MX - 2, MY - 5, 16, 12], dibujo: laPegada(), densidad: D * 2.4 },
];

const img = imagenesDe(PIEZAS_SHERIFF);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El puestito armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const [yx, yy] = A.yerro;
  const donde = [...A.blancos.slice(0, 2).map(({ x }) => [x, A.repisa - 25.8 * A.talla] as const), [yx, yy] as const];
  return (
    img('sheriff-fondo') +
    parte('cartel', img('sheriff-cartel'), t.cartel) +
    A.blancos.map((_, i) => parte(`blanco-${i + 1}`, img(i % 2 ? 'sheriff-ladron-cobre' : 'sheriff-ladron-rojo'), t[`blanco-${i + 1}`])).join('') +
    parte('agujero', img('sheriff-agujero'), '', o.agujero) +
    donde.map(([x, y], i) => `<g transform="translate(${x} ${f(y)})">${parte(`fogonazo-${i + 1}`, img('sheriff-fogonazo'), '', o[`fogonazo-${i + 1}`])}</g>`).join('') +
    parte('sheriff',
      parte('brazo-lejos', img('sheriff-brazo-lejos'), t['brazo-lejos']) +
      img('sheriff-torso') +
      parte('vaho', img('sheriff-vaho'), '', o.vaho) +
      parte('brillo', img('sheriff-brillo'), '', o.brillo) +
      parte('cabeza', img('sheriff-cabeza') + parte('pupilas', img('sheriff-pupilas'), t.pupilas) + parte('parpados', img('sheriff-parpados'), t.parpados) + img('sheriff-cejas'), t.cabeza),
      t.sheriff) +
    img('sheriff-mostrador') +
    img('sheriff-rifle') +
    img('sheriff-frasco') +
    parte('moneda', img('sheriff-moneda'), t.moneda, o.moneda) +
    parte('gota', img('sheriff-gota'), t.gota, o.gota) +
    parte('hilo', img('sheriff-hilo'), t.hilo, o.hilo) +
    parte('antebrazo', img('sheriff-antebrazo') + parte('pegada', img('sheriff-pegada'), '', o.pegada), t.antebrazo)
  );
}

/** El puestito en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function sheriffEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: atendiendo, aburrido, con los cuatro ladroncitos parados y un lugar vacío. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--sheriff" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El Sheriff'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: dos volteados, el tiro errado en la tabla, y él tumbando el tercero con el dedo, sin mirar. */
export const RETRATO = { caja: [SHERIFF.x - 74, SHERIFF.piso - 250, 148, 254] as const };
function retrato(): string {
  return `<image href="/bestiario/templo-lejos.webp" x="-300" y="0" width="1500" height="640" preserveAspectRatio="none"/>` + sheriffEn(EMPUJA);
}

export const SHERIFF_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-templo',
  ancla: SHERIFF.x,
  piezas: PIEZAS_SHERIFF,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
