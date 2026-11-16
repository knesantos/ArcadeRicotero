/**
 * Los camellos prestigiosos (`D-73`, vigesimonovena vuelta), en la nieve de Cybersiberia, al lado de Drogocop.
 *
 * *"Camellos prestigiosos"* es de *Estás frito angelito*, en *Último bondi a Finisterre* (1998). En el tema un
 * camello es el bicho y es también el que vende, y la letra deja tomar las dos cosas a la vez: **son dos camellos
 * que venden**. Y como están en Cybersiberia, lo que venden es lo que sobra: **nieve**. Uno, con la lupa de joyero en
 * el ojo, pesa copos en una balanza de joyero y los ensobra arriba de un cajón de chapa remachada; el otro hace de
 * campana, con la pezuña en el bolsillo, mirando para el lado de Drogocop. Están **parados en dos patas**: las de
 * adelante van metidas en las mangas, como brazos, y las de atrás asoman abajo del ruedo. *Prestigiosos*: el sobretodo es de pelo de
 * camello (que es lo más fino que hay, y es de ellos), con cuello de terciopelo, y los dos llevan la cucarda de gran
 * campeón. Del mismo tema: *"tu naturaleza te quiere"* (cuando alguien mira, vuelven a lo que son: caen a cuatro
 * patas y rumian con cara de zoológico) y *"vas a poner contacto"* (el cajón es la chapa del disco, con sus pistas de
 * circuito).
 *
 * De la letra son los camellos, el doble sentido, lo prestigioso y la naturaleza que los quiere. Del dibujo son la
 * nieve en sobres, la balanza, la lupa, la cucarda y el sobretodo que les queda de manta.
 *
 * Visten *Último bondi a Finisterre*, medido con sharp: el pelo de camello son las caras de la banda en el ojo de
 * buey de la tapa (la tapa sí tiene ese color: no hizo falta salir a las tintas del sitio), el sobretodo es la cara
 * del medio en la sombra, el cajón y la balanza son la chapa, los copos y los sobres el cromado, y la cucarda el oro
 * de las gafas con el rojo de la cabeza del frente (`--bestia-camellos-*`). La nieve que levantan es la del recinto.
 *
 * Coordenadas: el (0, 0) es la nieve debajo del medio del cajón (`rig-camellos.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, poli } from './trazos.ts';
import { CAMELLOS, CAMELLOS_ARMADO as A, CAMELLOS_NOMAS, QUIETO, marcas, type Momento } from './rig-camellos.ts';

const ID = 'los-camellos-prestigiosos';

/** Las tintas de *Último bondi a Finisterre* (`tokens.css`), y la nieve del recinto. */
const C = {
  pelo: 'var(--bestia-camellos-pelo)',
  peloClaro: 'var(--bestia-camellos-pelo-claro)',
  sobretodo: 'var(--bestia-camellos-sobretodo)',
  sobretodoHondo: 'var(--bestia-camellos-sobretodo-hondo)',
  cobre: 'var(--bestia-camellos-cobre)',
  hollin: 'var(--bestia-camellos-hollin)',
  chapaHonda: 'var(--bestia-camellos-chapa-honda)',
  chapa: 'var(--bestia-camellos-chapa)',
  cromo: 'var(--bestia-camellos-cromo)',
  oro: 'var(--bestia-camellos-oro)',
  oroClaro: 'var(--bestia-camellos-oro-claro)',
  rojo: 'var(--bestia-camellos-rojo)',
  rojoClaro: 'var(--bestia-camellos-rojo-claro)',
  nieve: 'var(--entorno-cyber-nieve)',
};

/* ------------------------------------------------------------------
   Lo que tienen los dos: el cogote con la cabeza, la quijada, el párpado
   ------------------------------------------------------------------ */

/**
 * El cogote largo y la cabeza, de perfil para la derecha, con la base en el (0, 0): la crin de la garganta, el copete,
 * la oreja chica, el ojo de párpado pesado con sus pestañas, el hocico partido. La quijada va aparte, porque rumia.
 */
function cogote(): string {
  const cuello = curva([[-15, 6], [-21, -22], [-15, -46], [-7, -62], [-8, -72], [4, -78], [17, -66], [13, -48], [5, -30], [7, -12], [13, 6]]);
  const cabeza = curva([[-9, -66], [-7, -82], [3, -92], [14, -93], [25, -88], [37, -83], [52, -78], [60, -70], [58, -61], [50, -57], [38, -60], [24, -62], [8, -58]]);
  const oreja = curva([[-6, -84], [-15, -95], [-9, -99], [1, -89]]);
  return conGrano(
    enmascarado('m-camellos-cuello', cuello, forma(cuello, C.pelo) + nube(-14, -30, 6, 30, C.cobre, 's', 0.45) + nube(4, -44, 5, 26, C.peloClaro, 's', 0.6)) +
    // La crin de la garganta: mechones que cuelgan para adelante.
    trazo('M15 -60 q7 5 5 13 M12 -48 q8 5 5 14 M6 -34 q8 6 4 15 M6 -20 q7 6 3 14 M10 -8 q6 5 2 12', C.sobretodoHondo, 2.6) + trazo('M14 -54 q5 4 4 9 M6 -28 q5 4 3 9', C.cobre, 1.2, 0.8) +
    enmascarado('m-camellos-oreja', oreja, forma(oreja, C.pelo) + nube(-8, -92, 3, 4, C.cobre, 'xs', 0.7)) +
    enmascarado('m-camellos-cabeza', cabeza,
      forma(cabeza, C.pelo) + nube(42, -70, 14, 8, C.peloClaro, 's', 0.85) + nube(8, -88, 12, 4, C.peloClaro, 'xs', 0.6) + nube(4, -64, 12, 6, C.cobre, 's', 0.45) + nube(30, -60, 20, 3, C.cobre, 'xs', 0.5)) +
    // El copete, despeinado, y el hocico partido con su ollar.
    trazo('M0 -89 q-2 -8 4 -10 M5 -91 q1 -9 8 -9 M10 -91 q4 -7 10 -5', C.sobretodoHondo, 2.2) +
    trazo('M53 -74 q3.4 2 1 5.4', C.hollin, 1.8) + trazo('M59.6 -67 Q54 -64 56 -59', C.hollin, 1.2, 0.85) +
    // El ojo: el blanco, la pupila que mira de costado, el párpado que le tapa la mitad, y las pestañas.
    forma(elipse(20, -79, 5, 4.4), C.cromo) + forma(elipse(21.8, -78.4, 2.3, 2.5), C.hollin) + forma(elipse(21, -79.4, 0.7, 0.7), C.cromo) +
    forma('M14.4 -78 A5.6 5.4 0 0 1 25.6 -78.4 Q20 -79.6 14.4 -78 Z', C.sobretodo) + trazo('M14.2 -78 Q20 -79.8 25.8 -78.4', C.hollin, 1.6) +
    trazo('M25 -79 l4.4 -1.6 M25.6 -78 l4.6 0.4', C.hollin, 0.8) +
    // La ceja, levantada del lado de afuera: desdén.
    trazo('M13 -86 Q20 -90 28 -85', C.sobretodoHondo, 1.8),
  );
}

/** La quijada: la mandíbula de abajo, con el belfo caído. Rumia de costado. */
function quijada(): string {
  const d = curva([[9, -62], [26, -63], [44, -60], [53, -57], [59, -50], [56, -42], [48, -44], [40, -50], [26, -54], [11, -56]]);
  return conGrano(enmascarado('m-camellos-quijada', d, forma(d, C.pelo) + nube(30, -55, 16, 3, C.cobre, 'xs', 0.6) + nube(54, -47, 6, 6, C.cobre, 'xs', 0.95)) + trazo('M10 -62 Q30 -64 55 -57', C.hollin, 1.1, 0.85) + trazo('M50 -44 q6 0 8 -6', C.cobre, 1.4));
}

/** El párpado, cerrado. */
function parpado(): string {
  return conGrano(forma(elipse(20, -79, 5.6, 5), C.sobretodo) + trazo('M14.6 -77.6 Q20 -74.6 25.6 -78', C.hollin, 1.5) + trazo('M24 -77 l4 1.6 M21.6 -75.6 l2.6 3', C.hollin, 0.8));
}

/** La lupa de joyero: el tubito negro calzado en el ojo, con su aro de oro y el vidrio. */
function lupa(): string {
  return conGrano(
    forma(poli([[15.6, -84.6], [24.6, -73.8], [36, -80], [29, -91.6]]), C.hollin) + trazo('M17 -84 L29.4 -90.6', C.chapa, 0.9, 0.8) +
    `<ellipse cx="32.4" cy="-85.8" rx="3.4" ry="6.6" transform="rotate(-32 32.4 -85.8)" fill="${C.chapaHonda}" stroke="${C.oro}" stroke-width="1.6"/>` +
    `<ellipse cx="32.8" cy="-86.6" rx="1.2" ry="3" transform="rotate(-32 32.8 -86.6)" fill="${C.oroClaro}" opacity="0.9"/>`,
  );
}

/* ------------------------------------------------------------------
   Parados: el cuerpo de sobretodo, la pata, la cola, el brazo de la pinza
   ------------------------------------------------------------------ */

/** La cucarda de gran campeón: la roseta plisada, el botón de oro y las dos cintas con la punta en golondrina. */
function cucarda(x: number, y: number, k = 1): string {
  let plisado = '';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    plisado += `M${(x + Math.cos(a) * 3.4 * k).toFixed(1)} ${(y + Math.sin(a) * 3.4 * k).toFixed(1)} L${(x + Math.cos(a) * 8.4 * k).toFixed(1)} ${(y + Math.sin(a) * 8.4 * k).toFixed(1)} `;
  }
  const cinta = (dx: number, giro: number): string => `<g transform="rotate(${giro} ${x} ${y})">` + forma(poli([[x + dx - 3 * k, y + 4 * k], [x + dx + 3 * k, y + 4 * k], [x + dx + 3 * k, y + 22 * k], [x + dx, y + 18.6 * k], [x + dx - 3 * k, y + 22 * k]]), C.rojo) + `</g>`;
  return cinta(-2.4 * k, 10) + cinta(2.4 * k, -12) + forma(elipse(x, y, 9 * k, 9 * k), C.rojo) + trazo(plisado, C.rojoClaro, 1 * k, 0.9) + forma(elipse(x, y, 4.6 * k, 4.6 * k), C.oro) + forma(elipse(x - 1 * k, y - 1 * k, 1.6 * k, 1.6 * k), C.oroClaro);
}

/** Una pata flaca, de la cadera (x, y0) a la pezuña partida en el piso (y1): la rodilla nudosa en el medio. */
function pataDe(x: number, y0: number, y1: number, tinta = C.pelo): string {
  const rod = (y0 + y1) / 2 - 2;
  return (
    trazo(`M${x} ${y0} Q${x + 3} ${(y0 + rod) / 2} ${x + 2} ${rod} Q${x - 1} ${(rod + y1) / 2} ${x} ${y1 - 7}`, tinta, 6.4) +
    forma(elipse(x + 2, rod, 4.6, 5.2), tinta) + nube(x + 3.4, rod + 1, 2, 3, C.cobre, 'xs', 0.6) +
    // La pezuña: dos dedos.
    forma(curva([[x - 7, y1], [x - 6, y1 - 7], [x - 0.6, y1 - 9], [x - 0.4, y1]]), C.hollin) + forma(curva([[x + 0.4, y1], [x + 0.6, y1 - 9], [x + 7, y1 - 7], [x + 8.4, y1]]), C.hollin) + trazo(`M${x - 5} ${y1 - 6} q2 -1.6 4 -1`, C.chapa, 0.8, 0.7)
  );
}

/**
 * El cuerpo parado, de perfil para la derecha, con el (0, 0) entre las pezuñas: el sobretodo cruzado de pelo de camello,
 * que la joroba levanta por atrás, el cuello de terciopelo, la cucarda en la solapa, una mano en el bolsillo y la pata
 * de atrás. La otra pata va aparte, porque resbala.
 */
function cuerpo(): string {
  // El sobretodo: largo hasta las rodillas, cruzado, entallado. La joroba lo levanta por atrás: el lomo hace un bulto
  // bajo la tela y el ruedo de atrás queda más alto que el de adelante, abierto en el tajo.
  const saco = curva([[-15, -160], [-27, -152], [-36, -141], [-47, -123], [-45, -104], [-35, -90], [-31, -72], [-40, -56], [-27, -47], [0, -41], [27, -38], [28, -80], [27, -122], [22, -152], [9, -163]]);
  const manga = curva([[4, -152], [17, -150], [27, -124], [28, -100], [16, -96], [9, -122]]);
  const cuello = curva([[-13, -160], [-3, -167], [13, -166], [23, -157], [17, -143], [6, -128], [-2, -146]]);
  const pataDeAtras = -A.pata[1];
  return conGrano(
    nube(0, 1, 34, 3.4, C.chapaHonda, 's', 0.55) +
    pataDe(-11, -pataDeAtras - 4, 0) +
    enmascarado('m-camellos-saco', saco,
      forma(saco, C.sobretodo) + nube(-40, -128, 8, 9, C.peloClaro, 's', 0.55) + nube(-36, -94, 10, 10, C.sobretodoHondo, 's', 0.85) + nube(23, -100, 8, 56, C.sobretodoHondo, 's', 0.55) + nube(-4, -42, 34, 5, C.sobretodoHondo, 's', 0.75) + nube(-34, -62, 7, 12, C.sobretodoHondo, 's', 0.7) +
      // La tela tirante en la joroba, la costura de la espalda, el tajo de atrás y el cruce.
      trazo('M-45 -118 Q-32 -122 -22 -136 M-44 -106 Q-30 -108 -19 -118', C.sobretodoHondo, 1.1, 0.7) +
      trazo('M-30 -72 Q-33 -60 -30 -47', C.hollin, 1.3, 0.7) + trazo('M5 -130 Q-2 -90 3 -41', C.sobretodoHondo, 1.4, 0.85)) +
    // Los botones, de a pares, hasta abajo, y el ruedo.
    [[9, -116], [20, -116], [9, -100], [20, -100], [10, -84], [21, -84], [10, -68], [21, -68]].map(([x, y]) => forma(elipse(x!, y!, 2.3, 2.3), C.hollin) + forma(elipse(x! - 0.6, y! - 0.6, 0.7, 0.7), C.chapa)).join('') +
    trazo('M-40 -56 Q-28 -46 0 -41 Q14 -39 27 -38', C.sobretodoHondo, 1.6, 0.9) +
    // La pata de adelante, metida en la manga como un brazo, con la pezuña en el bolsillo.
    enmascarado('m-camellos-manga', manga, forma(manga, C.sobretodo) + nube(23, -122, 5, 24, C.sobretodoHondo, 's', 0.7) + nube(11, -128, 3, 20, C.peloClaro, 'xs', 0.4)) +
    trazo('M10 -103 L28 -100', C.hollin, 2.2) + trazo('M12 -122 q5 2 10 0', C.sobretodoHondo, 1, 0.8) +
    // El cuello de terciopelo, ancho, y la cucarda en la solapa.
    enmascarado('m-camellos-terciopelo', cuello, forma(cuello, C.hollin) + nube(3, -162, 12, 3, C.chapa, 'xs', 0.5)) +
    cucarda(-7, -130),
  );
}

/** La pata que resbala, con la cadera en el (0, 0). */
function pata(): string {
  return conGrano(pataDe(0, 0, -A.pata[1]));
}

/** La cola, con la raíz en el (0, 0): fina, para abajo y para atrás, con el pincel de pelo en la punta. */
function cola(): string {
  return conGrano(trazo('M0 0 Q-16 6 -26 22', C.pelo, 3.4) + forma(curva([[-24, 18], [-30, 20], [-36, 32], [-30, 34], [-24, 28]]), C.sobretodoHondo) + trazo('M-30 24 l-4 8 M-27 25 l-1 8', C.hollin, 0.8, 0.6));
}

/** El brazo del joyero, con el hombro en el (0, 0): la manga, el puño, el guante blanco y la pinza. */
function brazo(): string {
  const [px, py] = A.pinza;
  const manga = curva([[-7, -4], [6, -8], [42, 12], [39, 26], [28, 25], [-6, 8]]);
  return conGrano(
    // La pinza, larga, de joyero.
    trazo(`M${px - 13} ${py - 9} L${px} ${py} M${px - 9} ${py - 13} L${px} ${py}`, C.chapa, 1.8) + trazo(`M${px - 12} ${py - 9} L${px - 1} ${py - 1}`, C.cromo, 0.7, 0.8) +
    // La pezuña que asoma del puño: dos dedos, que son los que agarran.
    forma(curva([[37, 14], [46, 14], [49, 22], [44, 27], [36, 25]]), C.hollin) + trazo('M40 16 q4 1 6 5', C.chapa, 0.8, 0.7) +
    enmascarado('m-camellos-brazo', manga, forma(manga, C.sobretodo) + nube(14, 14, 22, 5, C.sobretodoHondo, 's', 0.7) + nube(12, -2, 16, 3, C.peloClaro, 'xs', 0.45)) +
    forma(poli([[37, 9], [43, 13], [39, 27], [32, 23]]), C.cromo) + trazo('M37 9 L32 23', C.chapa, 0.8, 0.7),
  );
}

/**
 * La otra pata de adelante del joyero, también metida en su manga: baja derecha del hombro y apoya la pezuña en un
 * sobre abierto, arriba del cajón, esperando el copo. Va en las coordenadas del cuerpo.
 */
function mano(): string {
  const manga = curva([[-6, -150], [8, -152], [16, -112], [17, -94], [3, -92], [0, -112]]);
  const y = A.cajon.tapa + 2;
  return conGrano(
    sobrecito(12, y - 6, -6) +
    forma(curva([[3, -94], [16, -95], [19, -84], [14, -78], [5, -80]]), C.hollin) + trazo('M8 -92 q5 2 7 8', C.chapa, 0.8, 0.7) +
    enmascarado('m-camellos-mano', manga, forma(manga, C.sobretodo) + nube(13, -120, 4, 30, C.sobretodoHondo, 's', 0.7) + nube(1, -124, 3, 26, C.peloClaro, 'xs', 0.4)) +
    forma(poli([[1, -98], [18, -99], [18, -93], [2, -92]]), C.cromo) + trazo('M1 -98 L18 -99', C.chapa, 0.8, 0.7),
  );
}

/** Un copo: seis puntas, en el medio del (0, 0). */
function copo(): string {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    d += `M0 0 L${(c * 10).toFixed(1)} ${(s * 10).toFixed(1)} M${(c * 6).toFixed(1)} ${(s * 6).toFixed(1)} l${((c - s) * 3).toFixed(1)} ${((s + c) * 3).toFixed(1)} M${(c * 6).toFixed(1)} ${(s * 6).toFixed(1)} l${((c + s) * 3).toFixed(1)} ${((s - c) * 3).toFixed(1)} `;
  }
  return trazo(d, C.hollin, 3.4, 0.5) + trazo(d, C.nieve, 1.8) + forma(elipse(0, 0, 2, 2), C.nieve);
}

/* ------------------------------------------------------------------
   El cajón, la balanza y los sobres
   ------------------------------------------------------------------ */

/** Un sobrecito de papel, cerrado, con su solapa. El medio es el (0, 0). */
const sobrecito = (x: number, y: number, giro: number): string =>
  `<g transform="rotate(${giro} ${x} ${y})">` + forma(poli([[x - 11, y - 8], [x + 11, y - 8], [x + 11, y + 8], [x - 11, y + 8]]), C.nieve) + forma(poli([[x - 11, y - 8], [x, y + 1], [x + 11, y - 8]]), C.cromo) + trazo(`M${x - 11} ${y - 8} L${x} ${y + 1} L${x + 11} ${y - 8}`, C.chapa, 1.1) + trazo(`M${x - 11} ${y - 8} L${x - 11} ${y + 8} L${x + 11} ${y + 8} L${x + 11} ${y - 8}`, C.chapa, 0.9, 0.8) + `</g>`;

const remache = (x: number, y: number): string => forma(elipse(x, y, 2.2, 2.2), C.chapa) + forma(elipse(x - 0.6, y - 0.7, 0.8, 0.8), C.cromo);

/** El cajón de chapa remachada (la tapa del disco hecha mostrador), con los sobres ya pesados en fila, el montón de nieve y el poste de la balanza. */
function cajon(): string {
  const { x0, x1, frente, tapa } = A.cajon;
  const cara = poli([[x0, frente], [x1, frente], [x1, 0], [x0, 0]]);
  const arriba = poli([[x0, frente], [x0 + 8, tapa], [x1 - 4, tapa], [x1, frente]]);
  const [px, py] = A.balanza.pie;
  const [cx, cy] = A.balanza.cruz;
  let remaches = '';
  for (let x = x0 + 8; x <= x1 - 6; x += 19.6) remaches += remache(x, frente + 6) + remache(x, -6);
  return conGrano(
    nube((x0 + x1) / 2, 2, (x1 - x0) / 2 + 10, 4, C.chapaHonda, 's', 0.6) +
    enmascarado('m-camellos-cajon', cara,
      forma(cara, C.chapaHonda) + nube(x0 + 20, frente + 10, 30, 10, C.chapa, 's', 0.4) + nube(x1 - 10, -20, 20, 30, C.hollin, 's', 0.6) +
      // Las pistas de circuito de la tapa, en relieve.
      trazo(`M${x0 + 14} -22 L${x0 + 14} -40 L${x0 + 48} -40 M${x0 + 66} -18 L${x0 + 94} -18 L${x0 + 94} -44 L${x0 + 116} -44`, C.hollin, 4.4) + trazo(`M${x0 + 14} -22 L${x0 + 14} -40 L${x0 + 48} -40 M${x0 + 66} -18 L${x0 + 94} -18 L${x0 + 94} -44 L${x0 + 116} -44`, C.chapa, 1.2, 0.7) +
      [[x0 + 14, -22], [x0 + 48, -40], [x0 + 66, -18], [x0 + 116, -44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${C.chapaHonda}" stroke="${C.chapa}" stroke-width="1.4"/>`).join('')) +
    remaches +
    enmascarado('m-camellos-tapa', arriba, forma(arriba, C.chapa) + nube(x1 - 20, tapa + 6, 30, 5, C.chapaHonda, 's', 0.7)) + trazo(`M${x0} ${frente} L${x1} ${frente}`, C.cromo, 1.2, 0.8) +
    // Los sobres ya pesados, en fila, parados uno contra el otro: se tienen que ver.
    [0, 1, 2, 3].map((i) => sobrecito(x0 + 16 + i * 11, tapa - 7 - (i % 2), -16 + i * 5)).join('') +
    // El montón de nieve del que saca, arriba del cajón, y la que se juntó al pie.
    forma(curva([[x1 - 32, tapa + 4], [x1 - 26, tapa - 10], [x1 - 15, tapa - 15], [x1 - 6, tapa - 5], [x1 - 2, tapa + 6]]), C.nieve) + nube(x1 - 12, tapa, 8, 3, C.chapa, 'xs', 0.35) +
    forma(curva([[x0 - 8, 2], [x0 - 2, -9], [x0 + 12, -7], [x0 + 22, 2]]), C.nieve) + forma(curva([[x1 - 16, 2], [x1 - 6, -7], [x1 + 6, -4], [x1 + 10, 2]]), C.nieve) +
    // El poste de la balanza, alto, con su pie.
    forma(elipse(px, py, 11, 3.4), C.oro) + trazo(`M${px} ${py} L${cx} ${cy}`, C.oro, 3.4) + trazo(`M${px - 1} ${py - 2} L${cx - 1} ${cy + 2}`, C.oroClaro, 1, 0.9) + forma(elipse(cx, cy - 5, 3.4, 3.4), C.oro),
  );
}

/** El fiel de la balanza, con la cruz en el (0, 0): el brazo, las cadenitas y los dos platillos. En el de la izquierda, la pesa. */
function balanza(): string {
  const { brazo: b, cuelga } = A.balanza;
  const plato = (x: number): string =>
    trazo(`M${x} 0 L${x - 12} ${cuelga} M${x} 0 L${x + 12} ${cuelga} M${x} 0 L${x} ${cuelga}`, C.oroClaro, 0.9, 0.9) + forma(`M${x - 15} ${cuelga} Q${x} ${cuelga + 11} ${x + 15} ${cuelga} Z`, C.oro) + trazo(`M${x - 15} ${cuelga} L${x + 15} ${cuelga}`, C.oroClaro, 1.6);
  return conGrano(
    trazo(`M${-b} 0 L${b} 0`, C.oro, 3.2) + trazo(`M${-b} -1 L${b} -1`, C.oroClaro, 0.9) + trazo('M0 2 L0 -12', C.oro, 2.2) + forma(poli([[-3, -10], [0, -17], [3, -10]]), C.oro) +
    plato(-b) + plato(b) +
    // La pesa de bronce, en el platillo de la izquierda.
    forma(poli([[-b - 5.4, cuelga], [-b + 5.4, cuelga], [-b + 4, cuelga - 9], [-b - 4, cuelga - 9]]), C.chapa) + forma(elipse(-b, cuelga - 10.6, 2.4, 2), C.chapa) + trazo(`M${-b - 3} ${cuelga - 7} l0 5`, C.cromo, 0.8, 0.7),
  );
}

/* ------------------------------------------------------------------
   A cuatro patas: el camello de zoológico y el bulto
   ------------------------------------------------------------------ */

/**
 * Un camello a cuatro patas, de perfil para la derecha, con el (0, 0) debajo del medio del lomo: las dos jorobas, las
 * cuatro patas, la cola, y el sobretodo echado encima como una manta, con el cuello de terciopelo y la cucarda puesta.
 */
function cuatro(): string {
  const lomo = curva([[-62, -92], [-56, -108], [-42, -113], [-31, -133], [-18, -135], [-8, -117], [0, -115], [10, -133], [22, -135], [32, -117], [46, -113], [58, -100], [56, -80], [44, -66], [10, -59], [-30, -61], [-56, -71]]);
  const manta = curva([[-46, -112], [-32, -137], [-17, -139], [-8, -121], [0, -119], [9, -137], [23, -139], [33, -120], [40, -112], [39, -76], [30, -70], [0, -67], [-30, -69], [-45, -76]]);
  return conGrano(
    nube(0, 1, 62, 4, C.chapaHonda, 's', 0.55) +
    // Las patas de atrás del dibujo, más oscuras, y las de adelante.
    pataDe(-40, -66, 0, C.sobretodoHondo) + pataDe(30, -66, 0, C.sobretodoHondo) +
    trazo('M-61 -92 Q-72 -84 -70 -62', C.pelo, 3.2) + forma(curva([[-72, -64], [-76, -54], [-70, -48], [-66, -58]]), C.sobretodoHondo) +
    enmascarado('m-camellos-lomo', lomo,
      forma(lomo, C.pelo) + nube(0, -64, 56, 8, C.cobre, 's', 0.5) + nube(-50, -84, 12, 16, C.cobre, 's', 0.4) + nube(48, -98, 10, 10, C.peloClaro, 's', 0.6) +
      trazo('M44 -72 q5 4 3 10 M38 -68 q5 4 2 10 M50 -78 q5 4 4 10', C.sobretodoHondo, 2, 0.8)) +
    pataDe(-52, -70, 0) + pataDe(42, -70, 0) +
    // El sobretodo de manta: las jorobas lo levantan en dos bultos.
    enmascarado('m-camellos-manta', manta,
      forma(manta, C.sobretodo) + nube(-24, -132, 10, 5, C.peloClaro, 's', 0.6) + nube(16, -132, 10, 5, C.peloClaro, 's', 0.6) + nube(0, -112, 6, 12, C.sobretodoHondo, 's', 0.8) + nube(0, -70, 42, 6, C.sobretodoHondo, 's', 0.7) +
      trazo('M-30 -128 Q-34 -100 -38 -76 M-14 -126 Q-10 -100 -14 -72 M12 -128 Q10 -100 6 -70 M26 -126 Q30 -100 32 -74', C.sobretodoHondo, 1.2, 0.6)) +
    [[-34, -80], [-24, -78], [-2, -76], [10, -76]].map(([x, y]) => forma(elipse(x!, y!, 2.2, 2.2), C.hollin)).join('') +
    // El cuello de terciopelo, que quedó para adelante, y la cucarda.
    forma(curva([[30, -122], [41, -114], [42, -96], [34, -98], [32, -110]]), C.hollin) +
    cucarda(22, -102, 0.9),
  );
}

/** El cajón tapado con un sobretodo: una joroba más. Asoman una esquina de chapa, un platillo de la balanza y la nieve del pie. */
function bulto(): string {
  const { x0, x1 } = A.cajon;
  const [cx, cy] = A.balanza.cruz;
  const d = curva([[x0 - 6, 0], [x0 - 4, -46], [x0 + 14, -82], [cx - 22, -104], [cx, cy - 2], [cx + 20, -102], [x1 - 6, -74], [x1 + 4, -40], [x1 + 6, 0]]);
  return conGrano(
    nube((x0 + x1) / 2, 2, 76, 4, C.chapaHonda, 's', 0.6) +
    // La esquina del cajón que no llegó a tapar.
    forma(poli([[x1 - 26, -24], [x1, -24], [x1, 0], [x1 - 26, 0]]), C.chapaHonda) + remache(x1 - 6, -6) + remache(x1 - 20, -6) +
    enmascarado('m-camellos-bulto', d,
      forma(d, C.sobretodo) + nube(cx - 30, -74, 22, 12, C.peloClaro, 's', 0.55) + nube(x1 - 16, -40, 16, 34, C.sobretodoHondo, 's', 0.75) + nube(cx, -6, 70, 9, C.sobretodoHondo, 's', 0.7) +
      // Los pliegues, que caen de la punta del poste de la balanza, y los botones.
      trazo(`M${cx} ${cy} Q${cx - 28} -70 ${cx - 48} -6 M${cx} ${cy} Q${cx - 4} -60 ${cx - 14} -4 M${cx} ${cy} Q${cx + 22} -70 ${cx + 28} -30`, C.sobretodoHondo, 1.3, 0.7) +
      [[cx - 30, -52], [cx - 28, -36], [cx - 26, -20]].map(([x, y]) => forma(elipse(x!, y!, 2.3, 2.3), C.hollin)).join('')) +
    // El cuello de terciopelo arriba, la cucarda que quedó prendida, y la nieve del pie.
    forma(curva([[cx - 10, cy + 2], [cx, cy - 6], [cx + 12, cy + 4], [cx + 4, cy + 10], [cx - 4, cy + 8]]), C.hollin) +
    cucarda(cx + 20, -78, 0.9) +
    forma(curva([[x0 - 12, 2], [x0 - 4, -8], [x0 + 12, -5], [x0 + 20, 2]]), C.nieve),
  );
}

/** La polvareda de nieve que levantan al tirarse y al pararse: tapa el cambio. El piso es el (0, 0). */
function polvo(): string {
  // Una bocanada con canto: la silueta va recortada como con máscara de papel, y el volumen, soplado adentro.
  const bocanada = (cx: number, cy: number, rx: number, ry: number, n: number, fase: number): string => {
    const pts: Array<readonly [number, number]> = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2 + fase;
      const k = i % 2 ? 0.74 + 0.08 * Math.sin(i * 2.3) : 1 + 0.1 * Math.sin(i * 1.7 + fase);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return curva(pts);
  };
  const grande = bocanada(0, -84, 150, 86, 9, 0.3);
  const izq = bocanada(-128, -48, 62, 46, 6, 1.1);
  const der = bocanada(130, -50, 60, 44, 6, 2);
  const copete = bocanada(14, -168, 62, 38, 6, 0.7);
  const todo = `${grande} ${izq} ${der} ${copete}`;
  let copos = '';
  const pts: Array<readonly [number, number, number]> = [[-176, -128, 5], [-112, -178, 4], [-52, -206, 5], [84, -204, 4], [150, -150, 5], [184, -108, 4], [-190, -30, 4], [120, -196, 3], [-150, -160, 3], [194, -40, 4]];
  for (const [x, y, r] of pts) copos += forma(curva([[x - r, y], [x - r * 0.3, y - r], [x + r, y - r * 0.2], [x + r * 0.5, y + r], [x - r * 0.4, y + r * 0.8]]), C.nieve);
  return (
    `<rect x="-200" y="-220" width="400" height="240" fill="none"/>` +
    conGrano(
      enmascarado('m-camellos-polvo', todo,
        forma(todo, C.nieve) + nube(40, -30, 150, 30, C.chapa, 'm', 0.42) + nube(-90, -60, 50, 34, C.chapa, 'm', 0.3) + nube(100, -100, 40, 30, C.chapa, 'm', 0.26) + nube(-20, -120, 70, 30, C.cromo, 'm', 0.3) +
        // Los rulos de adentro, de borde duro: es nieve en polvo, no niebla.
        trazo('M-110 -70 q20 -30 50 -12 M-30 -110 q26 -34 60 -10 M60 -74 q24 -26 54 -6 M-70 -24 q30 -22 64 -2 M30 -30 q30 -20 62 0 M0 -160 q16 -22 40 -8', C.chapa, 2.4, 0.5)) +
      copos,
    )
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.2;

export const PIEZAS_CAMELLOS: readonly Pieza[] = [
  { nombre: 'camellos-cogote', caja: [-28, -108, 96, 122], dibujo: cogote(), densidad: D * 1.3 },
  { nombre: 'camellos-quijada', caja: [4, -70, 60, 34], dibujo: quijada(), densidad: D * 1.3 },
  { nombre: 'camellos-parpado', caja: [10, -90, 24, 22], dibujo: parpado(), densidad: D * 1.5 },
  { nombre: 'camellos-lupa', caja: [10, -98, 32, 30], dibujo: lupa(), densidad: D * 1.5 },
  { nombre: 'camellos-cuerpo', caja: [-56, -172, 92, 180], dibujo: cuerpo(), densidad: D },
  { nombre: 'camellos-pata', caja: [-12, -4, 26, -A.pata[1] + 10], dibujo: pata(), densidad: D },
  { nombre: 'camellos-cola', caja: [-42, -6, 48, 46], dibujo: cola(), densidad: D },
  { nombre: 'camellos-brazo', caja: [-12, -14, 76, 56], dibujo: brazo(), densidad: D * 1.2 },
  { nombre: 'camellos-mano', caja: [-12, -156, 40, 96], dibujo: mano(), densidad: D * 1.2 },
  { nombre: 'camellos-copo', caja: [-13, -13, 26, 26], dibujo: copo(), densidad: D * 2.2 },
  { nombre: 'camellos-cajon', caja: [A.cajon.x0 - 14, A.balanza.cruz[1] - 12, A.cajon.x1 - A.cajon.x0 + 30, -A.balanza.cruz[1] + 20], dibujo: cajon(), densidad: D },
  { nombre: 'camellos-balanza', caja: [-58, -20, 116, 58], dibujo: balanza(), densidad: D * 1.4 },
  { nombre: 'camellos-sobre', caja: [-13, -10, 26, 20], dibujo: sobrecito(0, 0, 0), densidad: D * 2 },
  { nombre: 'camellos-cuatro', caja: [-82, -146, 148, 154], dibujo: cuatro(), densidad: D },
  { nombre: 'camellos-bulto', caja: [A.cajon.x0 - 16, A.balanza.cruz[1] - 12, A.cajon.x1 - A.cajon.x0 + 30, -A.balanza.cruz[1] + 20], dibujo: bulto(), densidad: D },
  { nombre: 'camellos-polvo', caja: [-200, -220, 400, 240], dibujo: polvo(), densidad: 1.1 },
];

const img = imagenesDe(PIEZAS_CAMELLOS);
const parte = (nombre: string, cuerpoDe: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpoDe}</g>`;

/** Los camellos armados con las marcas de un momento: los dos juegos de partes, y arriba la polvareda. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const [px, py] = A.pata;
  const cabeza = (p: string, conLupa: boolean): string =>
    parte(`${p}-cogote`, img('camellos-cogote') + parte(`${p}-quijada`, img('camellos-quijada'), t[`${p}-quijada`]) + parte(`${p}-parpado`, img('camellos-parpado'), '', o[`${p}-parpado`]) + (conLupa ? img('camellos-lupa') : ''), t[`${p}-cogote`]);
  return (
    parte('parados',
      // El joyero, atrás del cajón: se le ve de la cintura para arriba.
      parte('joyero', cabeza('j', true) + img('camellos-cuerpo') + `<g transform="translate(${px} ${py})">${img('camellos-pata')}</g>` + img('camellos-mano') + parte('brazo', img('camellos-brazo') + parte('copo', img('camellos-copo'), t.copo, o.copo), t.brazo), t.joyero) +
      img('camellos-cajon') + parte('balanza', img('camellos-balanza'), t.balanza) +
      // El campana, a la derecha, entero.
      parte('campana', parte('c-cola', img('camellos-cola'), t['c-cola']) + cabeza('c', false) + parte('c-pata', img('camellos-pata'), t['c-pata']) + img('camellos-cuerpo'), t.campana) +
      parte('sobre', img('camellos-sobre'), t.sobre, o.sobre),
      t.parados, o.parados) +
    parte('cuatro',
      parte('q-joyero', cabeza('q1', true) + img('camellos-cuatro'), t['q-joyero']) +
      img('camellos-bulto') +
      parte('q-campana', cabeza('q2', false) + img('camellos-cuatro'), t['q-campana']) +
      parte('suelto', img('camellos-sobre'), t.suelto, o.suelto),
      '', o.cuatro) +
    parte('polvo', img('camellos-polvo'), t.polvo, o.polvo)
  );
}

/** Los camellos en un momento, sin lo que los hace tocables: para el test, el retrato y para mirarlos. */
export function camellosEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: parados, despachando. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--camellos" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'Los camellos prestigiosos'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: a cuatro patas, haciéndose los camellos, con el cajón tapado en el medio. */
export const RETRATO = { caja: [CAMELLOS.x - 100, CAMELLOS.piso - 104, 204, 112] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/cyber-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/cyber-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    camellosEn(CAMELLOS_NOMAS)
  );
}

export const CAMELLOS_PERSONAJE: Personaje = {
  id: ID,
  region: 'cybersiberia',
  ancla: CAMELLOS.x,
  piezas: PIEZAS_CAMELLOS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
