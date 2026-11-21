/**
 * El gato que llamás con silbidos (`D-73`, vigesimonovena vuelta), sentado de espaldas en una señal de tren
 * clavada en la chapa de los techos.
 *
 * *"Estás llamando a un gato con silbidos"*, *"Yo voy en trenes, no tengo dónde ir"*, *"El futuro llegó hace
 * rato"* y *"Algo me late y no es mi corazón"* son de *Todo un palo*, en *Un baión para el ojo idiota* (1988).
 * Es un gato linyera, con el atadito al hombro, sentado en la tabla de una señal de brazo. Los silbidos con que
 * lo llaman se ven: le pegan en el lomo y se le juntan al lado, como fósforos usados. No viene. Al único silbido
 * que le hace caso es al del tren, que pasa lejos, y cuando se para ya pasó.
 *
 * De la letra son el gato, los silbidos, los trenes, que no tiene dónde ir (el atadito), que algo le late (el
 * atadito, también) y que el futuro llegó hace rato (el tren que ya pasó). Del dibujo, la señal de brazo, que
 * los silbidos se apilen y que el atadito lleve las rayas del acordeón de la tapa.
 *
 * Viste *Un baión para el ojo idiota*, medido con sharp: el pelo es el rosa de la muñeca, el ojo y los silbidos
 * el lila de su antifaz, la señal el rojo y el blanco de la tapa, y el atadito, la madera y las rayas del acordeón.
 * No se parece al gato matón (atigrado, agazapado) ni al de Susanita: es flaco, alto, rosa y da la espalda.
 *
 * Coordenadas: el (0, 0) es el pie del palo; está dibujado mirando a la derecha (`rig-silbido.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli } from './trazos.ts';
import { QUIETO, SILBIDO, SILBIDO_ARMADO as A, TREN, marcas, type Momento } from './rig-silbido.ts';

const ID = 'el-gato-que-llamas-con-silbidos';

/** Las tintas de *Un baión para el ojo idiota* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-silbido-negro)',
  rosa: 'var(--bestia-silbido-rosa)',
  rosaMedio: 'var(--bestia-silbido-rosa-medio)',
  rosaHondo: 'var(--bestia-silbido-rosa-hondo)',
  granate: 'var(--bestia-silbido-granate)',
  lila: 'var(--bestia-silbido-lila)',
  lilaClaro: 'var(--bestia-silbido-lila-claro)',
  lilaHondo: 'var(--bestia-silbido-lila-hondo)',
  rojo: 'var(--bestia-silbido-rojo)',
  rojoClaro: 'var(--bestia-silbido-rojo-claro)',
  rojoHondo: 'var(--bestia-silbido-rojo-hondo)',
  caqui: 'var(--bestia-silbido-caqui)',
  caquiClaro: 'var(--bestia-silbido-caqui-claro)',
  blanco: 'var(--bestia-silbido-blanco)',
};

const [EJX, EJY] = A.eje;

/* ------------------------------------------------------------------
   La señal
   ------------------------------------------------------------------ */

/** El palo, a franjas, con sus peldaños, y la tabla con las dos escuadras. */
function poste(): string {
  const palo = cajaRedonda(-2.6, EJY - 8, 5.2, -EJY + 8, 1);
  const franjas = [-176, -128, -72, -24].map((y) => forma(`M-3 ${y} h6 v14 h-6 Z`, C.negro)).join('');
  const peldanos = [-18, -36, -54, -72].map((y) => trazo(`M-6 ${y} L6 ${y}`, C.lilaHondo, 1.2)).join('');
  return conGrano(
    peldanos +
    enmascarado('m-silbido-poste', palo, forma(palo, C.blanco) + franjas + nube(2, -100, 1.4, 100, C.lilaHondo, 'xs', 0.7)) +
    // El pie, clavado en la chapa con dos bulones.
    forma(poli([[-8, 0], [-5, -7], [5, -7], [8, 0]]), C.lilaHondo) + forma(elipse(-4.6, -2.4, 1, 1), C.blanco) + forma(elipse(4.6, -2.4, 1, 1), C.blanco) +
    // La tabla y las escuadras.
    trazo(`M2 ${A.tabla + 20} L30 ${A.tabla + 3} M-2 ${A.tabla + 16} L-8 ${A.tabla + 3}`, C.lilaHondo, 1.8) +
    forma(poli([[-12, A.tabla], [54, A.tabla - 0.6], [53, A.tabla + 4], [-11, A.tabla + 4.4]]), C.caqui) +
    trazo(`M-12 ${A.tabla + 0.4} L54 ${A.tabla - 0.2}`, C.caquiClaro, 1, 0.9) + trazo(`M6 ${A.tabla + 1} l0 3 M30 ${A.tabla + 0.6} l0 3 M44 ${A.tabla + 0.6} l0 3`, C.negro, 0.5, 0.6) +
    // La punta del palo.
    forma(poli([[-3.4, EJY - 8], [0, EJY - 15], [3.4, EJY - 8]]), C.rojoHondo),
  );
}

/** El brazo de la señal, con la cola de pez y el farol: horizontal es alto; bajo, vía libre. Sale para atrás del gato. */
function brazo(): string {
  const d = poli([[EJX + 6, EJY - 5], [EJX - 46, EJY - 6.4], [EJX - 40, EJY], [EJX - 46, EJY + 6.4], [EJX + 6, EJY + 5]]);
  return conGrano(
    enmascarado('m-silbido-brazo', d, forma(d, C.rojo) + forma(`M${EJX - 34} ${EJY - 8} h7 v16 h-7 Z`, C.blanco) + nube(EJX - 20, EJY + 5, 26, 2, C.rojoHondo, 'xs', 0.9) + nube(EJX - 20, EJY - 5, 26, 1.4, C.rojoClaro, 'xs', 0.7)) +
    // El farol, en el eje.
    forma(elipse(EJX + 2, EJY, 5, 5), C.negro) + forma(elipse(EJX + 2, EJY, 3.2, 3.2), C.rojoClaro) + forma(elipse(EJX + 1, EJY - 1, 1, 1), C.blanco) + nube(EJX + 2, EJY, 8, 8, C.rojoClaro, 's', 0.25),
  );
}

/** El tren, lejos: una locomotora del tamaño de una uña, con el penacho para atrás y su silbido arriba. Va para la derecha. */
function tren(): string {
  return `<rect x="-40" y="-30" width="62" height="36" fill="none"/>` +
    // El penacho: tres bocanadas que se quedan atrás.
    nube(-6, -11, 6, 4.4, C.lila, 's', 0.9) + nube(-18, -15, 7.4, 5, C.lila, 's', 0.7) + nube(-31, -18, 7, 4.6, C.lilaHondo, 's', 0.6) + nube(-5, -12.6, 3.4, 2.2, C.lilaClaro, 'xs', 0.9) +
    conGrano(
      forma(poli([[-8, 0], [-8, -6.4], [2, -6.4], [2, -9.6], [9, -9.6], [9, 0]]), C.lilaHondo) + forma(`M0 -6.4 h2.4 v-4 h-2.4 Z`, C.lilaHondo) +
      forma(elipse(-4, 0.6, 2.2, 2.2), C.negro) + forma(elipse(4.6, 0.6, 2.2, 2.2), C.negro) + forma(elipse(5.4, -6.4, 1.4, 1.4), C.rojoClaro) +
      trazo('M-9 3 L13 3', C.lilaHondo, 0.8) + forma(poli([[9, 0], [13, 0], [9, -3.4]]), C.lilaHondo) +
      // Su silbido, el único que el gato escucha.
      trazo('M4 -14 q3 -6 7 -2.6 q2.6 3 -1 4.6 q-2.6 0.6 -2.4 -1.8', C.lilaClaro, 1.2),
    );
}

/* ------------------------------------------------------------------
   El gato
   ------------------------------------------------------------------ */

/** El lomo, de espaldas: una pera flaca, con el espinazo, las rayas y los omóplatos marcados. */
function cuerpo(): string {
  const d = curva([[17, -139], [31, -139], [36, -126], [41, -110], [42, -98], [34, -95], [14, -95], [6, -98], [8, -112], [13, -127]]);
  return conGrano(
    enmascarado('m-silbido-cuerpo', d,
      forma(d, C.rosaMedio) + nube(14, -118, 6, 22, C.rosa, 's', 0.9) + nube(38, -108, 6, 18, C.rosaHondo, 's', 0.9) + nube(24, -96, 18, 4, C.granate, 's', 0.7) +
      // Las rayas, cruzadas, y el espinazo.
      [-130, -122, -114, -106].map((y, i) => trazo(`M${12 - i} ${y + 2} Q24 ${y - 3} ${37 + i} ${y + 2}`, C.rosaHondo, 2, 0.85)).join('') +
      trazo('M24 -138 L24.6 -98', C.granate, 0.8, 0.7) + [-134, -128, -122, -116, -110, -104].map((y) => forma(elipse(24.2, y, 1.1, 0.8), C.rosa, 0.8)).join('') +
      // Los omóplatos de flaco.
      trazo('M17 -133 q2 5 0 9 M31 -133 q-2 5 0 9', C.granate, 0.9, 0.7)) +
    trazo(d, C.granate, 0.6, 0.8) +
    // El remiendo: un cuadrado de lona cosido a puntadas largas, donde le faltaba pelo.
    forma(poli([[29, -113], [38, -114.4], [39.6, -104], [30.4, -102.6]]), C.caqui) + trazo('M29 -113 L38 -114.4 L39.6 -104 L30.4 -102.6 Z', C.blanco, 0.6, 0.9).replace('stroke-linecap', 'stroke-dasharray="1.6 1.4" stroke-linecap') +
    // El pelo parado, de dormir a la intemperie.
    trazo('M11 -118 l-3.4 -2 M9.6 -109 l-3.6 0.4 M37 -127 l3.4 -2 M41.4 -114 l3.6 -1 M19 -139 l-1 -3.4', C.granate, 0.9) +
    // Las patas de atrás, plegadas, que asoman a los costados.
    forma(elipse(9, -98, 5, 3.2), C.rosaMedio) + forma(elipse(40, -98, 5, 3.2), C.rosaHondo) + trazo('M5.6 -97 l0 1.6 M8 -96.4 l0 1.6 M41 -96.4 l0 1.6 M43.4 -97 l0 1.6', C.granate, 0.5),
  );
}

/** La cola, que cuelga de la tabla: larga, a anillos, con la punta doblada. */
function cola(): string {
  const d = 'M38 -99 Q47 -98 48 -86 Q49 -72 44 -64 Q41 -60 43 -56';
  return conGrano(trazo(d, C.granate, 6.4) + trazo(d, C.rosaMedio, 5) +
    [[47.6, -90], [46.4, -70], [43, -61]].map(([x, y]) => trazo(`M${x! - 2.6} ${y} l5.2 0.6`, C.rosaHondo, 1.8, 0.9)).join('') + trazo('M46 -96 Q47.4 -80 44.6 -68', C.rosa, 0.9, 0.7) +
    // Los nudos del pelo, con sus mechas, y la punta pelada.
    forma(elipse(48.6, -81, 4.4, 3), C.rosaHondo) + trazo('M51.6 -83 l4 -2.4 M52.4 -80 l4.4 0.6 M45 -79 l-3.6 1.6', C.granate, 0.9) +
    forma(elipse(45.4, -66, 3.6, 2.6), C.rosaHondo) + trazo('M48 -65 l3.6 1.6 M42.6 -67 l-3.4 -1.4', C.granate, 0.9) + trazo('M43 -58 l0.4 3.6', C.rosa, 2.2));
}

/** La cabeza, de perfil para el lado del tren: el hocico corto, el ojo de rendija, los bigotes y una muesca en la mejilla. */
function cabeza(): string {
  const [ex, ey] = A.ojo;
  const d = curva([[14, -141], [12, -150], [15, -158], [24, -161], [32, -158], [37, -152], [41, -148], [40, -144], [35, -141], [26, -138]]);
  return conGrano(
    enmascarado('m-silbido-cabeza', d,
      forma(d, C.rosaMedio) + nube(18, -155, 6, 5, C.rosa, 's', 0.9) + nube(26, -140, 9, 3, C.rosaHondo, 's', 0.8) + nube(38, -146, 4, 3, C.rosa, 'xs', 0.9) +
      trazo('M17 -158 l3 4 M21 -160 l2 4.4 M14 -150 l4 1', C.rosaHondo, 1.4, 0.85) +
      // Una cicatriz vieja en la mejilla.
      trazo('M24 -147 l6 3.4 M25.6 -144.4 l1.6 -2.6 M28 -143 l1.6 -2.6', C.granate, 0.6, 0.9)) +
    trazo(d, C.granate, 0.6, 0.8) +
    // La nariz, la boca cerrada y los bigotes, largos.
    forma(poli([[39.6, -149], [42, -147.6], [39.6, -146.6]]), C.granate) + trazo('M39.6 -146 q-2 2.4 -5 1.6', C.granate, 0.6) +
    trazo('M37 -146 l11 -3 M37 -145 l12 1 M37 -144.2 l10 4.6', C.blanco, 0.45, 0.9) +
    // El ojo: una rendija que mira para el otro lado.
    forma(elipse(ex, ey, 3.4, 3), C.lilaClaro) + forma(elipse(ex + 1.2, ey, 0.9, 2.6), C.negro) + forma(elipse(ex - 0.8, ey - 1, 0.6, 0.6), C.blanco) +
    trazo(`M${ex - 3.6} ${ey - 2.8} Q${ex} ${ey - 4.4} ${ex + 3.8} ${ey - 2}`, C.granate, 0.9),
  );
}

/** Una oreja: el (0, 0) es el medio de la base. La de adelante tiene un mordisco, en punta. */
function oreja(mordida: boolean): string {
  const d = mordida ? poli([[-4, 1], [-2.6, -9.6], [-0.6, -4.6], [1.6, -8.6], [4, 1]]) : poli([[-4, 1], [0.6, -10.6], [4, 1]]);
  return conGrano(forma(d, C.rosaMedio) + forma(poli([[-1.6, 0.6], [0.4, -6.4], [2.4, 0.6]]), C.granate) + trazo(d, C.granate, 0.5, 0.8));
}

/** El párpado. */
function parpado(): string {
  const [ex, ey] = A.ojo;
  return conGrano(forma(`M${ex - 3.8} ${ey - 3} L${ex + 3.8} ${ey - 3} L${ex + 3.8} ${ey + 3} Q${ex} ${ey + 4} ${ex - 3.8} ${ey + 3} Z`, C.rosaMedio) + trazo(`M${ex - 3.6} ${ey + 3} Q${ex} ${ey + 4} ${ex + 3.6} ${ey + 3}`, C.granate, 0.7));
}

/** El palo del atadito, al hombro, con la mano que lo agarra. */
function palito(): string {
  const [hx, hy] = A.hombro;
  const [bx, by] = A.bulto;
  return conGrano(trazo(`M${hx + 6} ${hy + 12} L${bx + 2} ${by + 3}`, C.caqui, 2.2) + trazo(`M${hx + 5} ${hy + 10} L${bx + 2} ${by + 4}`, C.caquiClaro, 0.6, 0.8) +
    forma(elipse(hx + 2, hy + 5, 3.6, 2.8), C.rosa) + trazo(`M${hx} ${hy + 4} l0.6 2.6 M${hx + 2} ${hy + 3.6} l0.6 2.6`, C.granate, 0.5));
}

/** El atadito: un pañuelo a cuadros, panzón para abajo, atado arriba con un nudo de dos puntas. Algo le late adentro. */
function bulto(): string {
  const [bx, by] = A.bulto;
  const d = curva([[bx - 3, by - 6], [bx + 4, by - 6], [bx + 9, by + 1], [bx + 10, by + 9], [bx + 3, by + 13], [bx - 6, by + 12], [bx - 10, by + 6], [bx - 8, by - 1]]);
  const cuadros = [-9, -4.5, 0, 4.5, 9].map((dx) => `M${bx + dx} ${by - 8} l${dx * 0.12} 23`).join(' ') + ' ' + [-3, 1.6, 6.2, 10.6].map((dy) => `M${bx - 11} ${by + dy} q11 2 22 0`).join(' ');
  return conGrano(
    enmascarado('m-silbido-bulto', d, forma(d, C.blanco) + trazo(cuadros, C.rojo, 2.2, 0.9) + trazo(cuadros, C.rojoHondo, 0.5, 0.9) + nube(bx + 5, by + 10, 6, 4, C.negro, 's', 0.45) + nube(bx - 5, by + 1, 3, 3, C.caquiClaro, 'xs', 0.4)) +
    trazo(d, C.rojoHondo, 0.7, 0.9) +
    // El nudo, con las dos puntas del pañuelo para arriba.
    forma(poli([[bx - 1, by - 6], [bx - 8, by - 17], [bx - 3.4, by - 15.4], [bx, by - 9]]), C.blanco) + forma(poli([[bx + 2, by - 6], [bx + 9, by - 17], [bx + 4.4, by - 16], [bx + 1, by - 9]]), C.blanco) +
    trazo(`M${bx - 6.4} ${by - 15} l3.4 4.6 M${bx + 7} ${by - 15.4} l-3.4 5`, C.rojo, 1.3) + trazo(`M${bx - 8} ${by - 17} L${bx - 1} ${by - 6} M${bx + 9} ${by - 17} L${bx + 2} ${by - 6}`, C.rojoHondo, 0.5, 0.8) +
    forma(elipse(bx + 0.5, by - 7, 2.8, 2.2), C.rojo) + trazo(`M${bx - 1.6} ${by - 7} l4.2 0`, C.rojoHondo, 0.6),
  );
}

/* ------------------------------------------------------------------
   Los silbidos
   ------------------------------------------------------------------ */

/** Un silbido: un rulo de aire tallado, con la cabecita como de fósforo. El (0, 0) es el medio. */
function rulo(tinta: string, gastado = false): string {
  return trazo('M-7 2 q3 -6 6.4 -2 q2.4 3.4 -0.6 4.4 q-2.6 0.4 -1.6 -2.4 q2 -4.4 6.6 -2.6', tinta, 1.5) + (gastado ? forma(elipse(-7, 2, 1.3, 1.1), C.negro) : forma(elipse(-7, 2, 1.2, 1), C.lilaClaro));
}

/** El montón de siempre: los silbidos que ya le tiraron, uno arriba del otro, en la tabla. Se tiene que leer de lejos. */
function pila(): string {
  const T = A.tabla;
  const uno = (x: number, y: number, g: number, tinta: string): string => `<g transform="translate(${x} ${y}) rotate(${g}) scale(1.3)">${rulo(tinta, true)}</g>`;
  return conGrano(uno(-9, T - 3.4, 6, C.lila) + uno(7, T - 3.6, -172, C.lila) + uno(-1, T - 7.6, 34, C.lilaClaro) + uno(-13, T - 8, -50, C.lilaHondo) + uno(10, T - 9, 96, C.lilaClaro) + uno(-4, T - 12.6, 150, C.lila));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.6;
const [EX, EY] = A.ojo;
const [BX, BY] = A.bulto;

export const PIEZAS_SILBIDO: readonly Pieza[] = [
  { nombre: 'silbido-tren', caja: [-40, -30, 62, 36], dibujo: tren(), densidad: D },
  { nombre: 'silbido-poste', caja: [-14, EJY - 18, 70, -EJY + 20], dibujo: poste(), densidad: D * 0.8 },
  { nombre: 'silbido-brazo', caja: [EJX - 50, EJY - 12, 64, 24], dibujo: brazo(), densidad: D },
  { nombre: 'silbido-pila', caja: [-26, A.tabla - 24, 52, 26], dibujo: pila(), densidad: D * 1.4 },
  { nombre: 'silbido-rulo', caja: [-10, -6, 20, 12], dibujo: conGrano(rulo(C.lilaClaro)), densidad: D * 1.6 },
  { nombre: 'silbido-cola', caja: [33, -104, 21, 52], dibujo: cola(), densidad: D },
  { nombre: 'silbido-cuerpo', caja: [2, -142, 46, 50], dibujo: cuerpo(), densidad: D * 1.2 },
  { nombre: 'silbido-palito', caja: [BX - 2, BY, 30, 54], dibujo: palito(), densidad: D * 1.2 },
  { nombre: 'silbido-bulto', caja: [BX - 13, BY - 19, 26, 35], dibujo: bulto(), densidad: D * 1.4 },
  { nombre: 'silbido-cabeza', caja: [9, -164, 42, 30], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'silbido-oreja-1', caja: [-6, -12, 12, 14], dibujo: oreja(false), densidad: D * 1.8 },
  { nombre: 'silbido-oreja-2', caja: [-6, -12, 12, 14], dibujo: oreja(true), densidad: D * 1.8 },
  { nombre: 'silbido-parpado', caja: [EX - 5, EY - 5, 10, 10], dibujo: parpado(), densidad: D * 2.4 },
];

const img = imagenesDe(PIEZAS_SILBIDO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/**
 * La señal con el gato, armada con las marcas de un momento. El tren pasa lejos, detrás de la línea de los techos:
 * de las ruedas para abajo no se ve (el recorte va con un nombre por cada uso, para que el títere y el retrato no
 * se pisen el id).
 */
function armado(m: Momento, recorte: string): string {
  const { transform: t, opacity: o } = marcas(m);
  const nuevos = A.pila.map(([x, y, g], i) => parte(`pila-${i + 1}`, `<g transform="translate(${x} ${y}) rotate(${g}) scale(1.3)">${img('silbido-rulo')}</g>`, '', o[`pila-${i + 1}`])).join('');
  return (
    `<clipPath id="${recorte}"><rect x="0" y="-260" width="200" height="${260 + A.tren.y - 1}"/></clipPath>` +
    `<g clip-path="url(#${recorte})">${parte('tren', img('silbido-tren'), t.tren, o.tren)}</g>` +
    img('silbido-poste') +
    parte('brazo', img('silbido-brazo'), t.brazo) +
    img('silbido-pila') +
    parte('pila', nuevos, t.pila, o.pila) +
    parte('gato',
      parte('cola', img('silbido-cola'), t.cola) +
      parte('lomo', img('silbido-cuerpo'), t.lomo) +
      parte('arriba',
        parte('cabeza',
          parte('oreja-1', img('silbido-oreja-1'), t['oreja-1']) +
          img('silbido-cabeza') +
          parte('parpado', img('silbido-parpado'), t.parpado) +
          parte('oreja-2', img('silbido-oreja-2'), t['oreja-2']),
          t.cabeza) +
        parte('atadito', img('silbido-palito') + parte('bulto', img('silbido-bulto'), t.bulto), t.atadito),
        t.arriba),
      t.gato) +
    parte('silbido', img('silbido-rulo'), t.silbido, o.silbido)
  );
}

/** El gato en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function silbidoEn(m: Momento = QUIETO, recorte = 'silbido-techos-mirar'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, recorte)}</g>`;
}

/** Un rectángulo sin tinta: el gato, su tabla y el palo de la señal. */
const TOQUE = `<rect x="-16" y="${EJY - 16}" width="72" height="${-EJY + 16}" fill="transparent"/>`;

function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--silbido" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El gato que llamás con silbidos'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${TOQUE}${armado(QUIETO, 'silbido-techos-recorte')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: parado, por saltar, con la señal baja y el tren que ya se va. */
export const RETRATO = { caja: [SILBIDO.x - 150, SILBIDO.piso - 210, 216, 216] as const };
function retrato(): string {
  return `<image href="/bestiario/baldio-lejos.webp" x="0" y="0" width="1500" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/baldio-chapa.webp" x="0" y="284" width="1500" height="42" preserveAspectRatio="none"/>` + silbidoEn(TREN, 'silbido-techos-retrato');
}

export const SILBIDO_PERSONAJE: Personaje = {
  id: ID,
  region: 'los-techos',
  ancla: SILBIDO.x,
  piezas: PIEZAS_SILBIDO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
