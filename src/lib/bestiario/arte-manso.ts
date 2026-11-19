/**
 * El perro manso (`D-73`, vigesimonovena vuelta), comiendo de la olla en la tierra del baldío.
 *
 * *"Si el perro es manso come la basofia y no dice nada, le cuentan las costillas con un palo a carcajadas.
 * Demasiados los moretones, muy pocos encantamientos. Son tantos los cocineros que joden la sopa"* es de
 * *Cruz diablo!*, en *Luzbelito* (1996). Acá la metáfora va en serio: es un perro flaco con las costillas afuera
 * como las teclas de un xilofón, numeradas con tiza del 1 al 6. El palo lo lleva él, colgado de la cola con un
 * piolín: cuando la mueve, el palo le cuenta las costillas, y los cucharones de la olla se ríen. Él come y no dice nada.
 *
 * De la letra son el perro, la basofia (la olla con una espina y una lata), que no dice nada, las costillas
 * contadas, el palo, las carcajadas, los moretones, el único amuleto (roto) y los muchos cocineros (seis
 * cucharones en una olla). Del dibujo, que suenen como un xilofón, los números de tiza y que el palo cuelgue de su cola.
 *
 * Viste *Luzbelito*, medido con sharp: el pelo es el mármol del busto, las costillas su hueso, los moretones el
 * verde del mármol de la tapa, y la olla y los cucharones, el bronce del marco.
 *
 * Coordenadas: el (0, 0) es la tierra debajo de la panza, y mira a la izquierda (`rig-manso.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, poli } from './trazos.ts';
import { CONTADO, MANSO, MANSO_ARMADO as A, QUIETO, marcas, type Momento } from './rig-manso.ts';

const ID = 'el-perro-manso';

/** Las tintas de *Luzbelito* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-manso-negro)',
  verde: 'var(--bestia-manso-verde)',
  verdeHondo: 'var(--bestia-manso-verde-hondo)',
  verdeClaro: 'var(--bestia-manso-verde-claro)',
  bronce: 'var(--bestia-manso-bronce)',
  bronceHondo: 'var(--bestia-manso-bronce-hondo)',
  tiza: 'var(--bestia-manso-tiza)',
  hueso: 'var(--bestia-manso-hueso)',
  sepia: 'var(--bestia-manso-sepia)',
  sepiaHondo: 'var(--bestia-manso-sepia-hondo)',
  gris: 'var(--bestia-manso-gris)',
  grisClaro: 'var(--bestia-manso-gris-claro)',
  llama: 'var(--bestia-manso-llama)',
  oro: 'var(--bestia-manso-oro)',
};

/* ------------------------------------------------------------------
   La olla de los muchos cocineros
   ------------------------------------------------------------------ */

const [OX, OY] = A.olla;

/** Un cucharón: el mango derecho (o torcido) y, arriba, el cuenco colgado de un costado, boca arriba, con sopa. El (0, 0) es donde entra en la olla. */
const cuchara = (mango: string, cuenco: string, luz: string, alto: number, tuerce = 0): string =>
  trazo(`M0 2 L${tuerce} ${-alto * 0.5} L0 ${-alto}`, mango, 1.8) +
  // El mango sigue un poco y se dobla en gancho; el cuenco cuelga del costado.
  trazo(`M0 ${-alto} l0 -5 q-0.4 -3 -3 -2.4`, mango, 1.6) +
  forma(`M0.4 ${-alto - 1} A5.8 6.4 0 0 0 12 ${-alto - 1} Z`, cuenco) + forma(elipse(6.2, -alto - 1, 5.8, 1.7), luz) + forma(elipse(6.2, -alto - 0.8, 4.4, 1), C.verdeHondo) +
  trazo(`M3 ${-alto + 2.4} q2 2 4.4 1.8`, luz, 0.5, 0.7);

/** Un cucharón de los que se ríen. */
function cucharon(): string {
  return conGrano(cuchara(C.bronce, C.bronce, C.oro, 21) + trazo('M-0.7 0 L-0.7 -20', C.oro, 0.5, 0.8));
}

/** Lo de atrás de la olla: la boca, la sopa con lo que flota, y los tres cucharones que no se ríen: uno corto, uno largo y torcido, uno petiso. */
function ollaAtras(): string {
  const fijo = (x: number, y: number, g: number, alto: number, tuerce = 0): string => `<g transform="translate(${x} ${y}) rotate(${g})">${cuchara(C.bronceHondo, C.bronceHondo, C.bronce, alto, tuerce)}</g>`;
  return conGrano(
    fijo(OX - 22, OY - 0.4, -30, 15) + fijo(OX - 12, OY - 2.4, -10, 27, 3.4) + fijo(OX - 3, OY - 3, 6, 12) +
    forma(elipse(OX, OY, 22, 5.6), C.bronceHondo) + forma(elipse(OX, OY + 0.6, 19.6, 4.4), C.verdeHondo) +
    nube(OX - 4, OY, 10, 1.6, C.verde, 'xs', 0.9) +
    // Lo que flota: una espina, una cáscara y la tapa de una lata.
    trazo(`M${OX - 4} ${OY + 1} l9 -1.4 M${OX - 1} ${OY - 0.8} l0.6 2.6 M${OX + 1.6} ${OY - 1.2} l0.6 2.6`, C.hueso, 0.7, 0.9) +
    forma(elipse(OX + 11, OY + 1.4, 3.2, 1.2), C.gris) + trazo(`M${OX - 13} ${OY + 1.6} q3 -2 5 0`, C.verdeClaro, 1, 0.9),
  );
}

/** La olla, de frente: abollada, tiznada, con las dos asas. Tapa lo que entra del hocico. */
function olla(): string {
  const d = `M${OX - 22} ${OY} Q${OX - 25} ${OY + 20} ${OX - 15} ${OY + 30} L${OX + 15} ${OY + 30} Q${OX + 25} ${OY + 20} ${OX + 22} ${OY} Q${OX} ${OY + 7.4} ${OX - 22} ${OY} Z`;
  return conGrano(
    trazo(`M${OX - 22} ${OY + 6} q-8 2 -6 9 M${OX + 22} ${OY + 6} q8 2 6 9`, C.bronceHondo, 2.4) +
    enmascarado('m-manso-olla', d,
      forma(d, C.bronce) + nube(OX - 10, OY + 14, 6, 12, C.oro, 's', 0.5) + nube(OX + 14, OY + 16, 10, 16, C.bronceHondo, 'm', 0.95) +
      // El tizne de abajo y una abolladura.
      nube(OX, OY + 30, 22, 6, C.negro, 's', 0.9) + nube(OX + 4, OY + 14, 4, 3, C.bronceHondo, 'xs', 0.9) +
      // Lo que chorreó.
      trazo(`M${OX - 4} ${OY + 5} q-1 6 0.6 11 M${OX + 9} ${OY + 4} q1 4 0 7`, C.verdeHondo, 1.6, 0.9)) +
    trazo(`M${OX - 22} ${OY} Q${OX} ${OY + 7.4} ${OX + 22} ${OY}`, C.oro, 1, 0.8),
  );
}

/** La burbuja de sopa: lo único que le sale cuando quiere gruñir. */
function burbuja(): string {
  return conGrano(`<circle cx="0" cy="-5" r="5.4" fill="none" stroke="${C.llama}" stroke-width="1"/>` + nube(0, -5, 4.6, 4.6, C.verdeClaro, 'xs', 0.35) +
    trazo('M-3 -7.4 q1 -2 3 -2.2', C.tiza, 0.9, 0.9) + forma(elipse(2.4, -3, 0.7, 0.7), C.tiza, 0.8));
}

/* ------------------------------------------------------------------
   El perro
   ------------------------------------------------------------------ */

/** Una pata flaca: del cuerpo a la tierra, con el codo y la mano. */
const pata = (pts: string, tinta: string, x: number): string =>
  trazo(pts, tinta, 4.4) + forma(elipse(x - 2.4, -1.6, 4.6, 2.2), tinta) + trazo(`M${x - 5} -0.8 l0 1.4 M${x - 2.6} -0.4 l0 1.4`, C.negro, 0.5, 0.7);

/** Las cuatro patas: las de lejos, más oscuras. */
function patas(): string {
  return conGrano(
    pata('M-15 -30 L-13 -14 L-14 -2', C.gris, -14) + pata('M27 -38 L32 -19 L27 -2', C.gris, 27) +
    nube(-13, -16, 3, 12, C.sepiaHondo, 'xs', 0.5) + nube(29, -18, 3, 14, C.sepiaHondo, 'xs', 0.5) +
    pata('M-24 -30 L-27 -14 L-25 -2', C.grisClaro, -25) + pata('M35 -42 L41 -21 L35 -2', C.grisClaro, 35) +
    forma(elipse(-26.4, -14, 2.4, 2.4), C.gris) + forma(elipse(40.4, -21, 2.6, 2.6), C.gris),
  );
}

/** Los números, con tiza y a mano: del 1 al 6. */
const NUMEROS = [
  'M-1.2 -2.6 l1.8 -1.6 l0 7',
  'M-1.8 -2.8 q1.8 -2.4 3.2 -0.2 q0.6 2 -3.2 5.2 l3.8 0',
  'M-1.8 -3.6 q3.4 -1.6 3.2 1 q-0.2 1.6 -2.2 1.8 q2.6 0.2 2.4 2 q-0.4 2.2 -3.8 1',
  'M1 3 l0 -7 l-3.2 4.8 l4.8 0',
  'M2 -4 l-3.4 0 l-0.4 3 q3.8 -1 3.8 1.6 q-0.2 2.8 -4 1.8',
  'M1.8 -4 q-3.8 0.6 -3.6 4.6 q0.4 2.6 2 2.4 q2 -0.2 1.8 -2.2 q-0.4 -1.8 -3.6 -0.6',
];

/** Un moretón viejo: verde en el medio, con el borde que ya afloja. */
const moreton = (x: number, y: number, rx: number, ry: number): string =>
  nube(x, y, rx, ry, C.verdeClaro, 's', 0.6) + nube(x, y, rx * 0.6, ry * 0.6, C.verde, 'xs', 0.9) +
  // El canto del moretón: un anillo más oscuro, desparejo, y el medio que ya amarillea.
  `<ellipse cx="${x}" cy="${y}" rx="${rx * 0.8}" ry="${ry * 0.74}" fill="none" stroke="${C.verdeHondo}" stroke-width="1.4" opacity="0.6" filter="url(#soplo-xs)"/>` + nube(x + 0.4, y + 0.3, rx * 0.26, ry * 0.26, C.oro, 'xs', 0.25);

/** El tronco: el lomo huesudo, la panza chupada, los moretones y, arriba de cada costilla, su número. */
function cuerpo(): string {
  const d = curva([[-30, -57], [-14, -60], [8, -58], [28, -58], [40, -53], [43, -44], [38, -33], [18, -28], [-4, -26], [-22, -23], [-32, -32], [-34, -46]]);
  const numeros = A.costillas.x.map((x, i) => `<g transform="translate(${x + 1.6} ${-53 + (i % 2) * 0.8}) rotate(${(i % 3) * 5 - 6}) scale(0.82)">${trazo(NUMEROS[i]!, C.tiza, 1.3, 0.95)}</g>`).join('');
  return conGrano(
    enmascarado('m-manso-cuerpo', d,
      forma(d, C.gris) + nube(4, -58, 34, 4, C.grisClaro, 's', 0.9) + nube(6, -27, 30, 5, C.sepiaHondo, 'm', 0.7) +
      // El hueco entre las costillas: lo hondo donde van las teclas.
      nube(6, -38, 24, 10, C.sepiaHondo, 's', 0.55) +
      moreton(35, -44, 5, 6) + moreton(-25, -36, 4.6, 5.6) + moreton(-22, -52, 3, 2.4) +
      // El espinazo, que se le cuenta también.
      [-18, -8, 2, 12, 22, 32].map((x) => nube(x, -58.6, 2.2, 1.4, C.hueso, 'xs', 0.7)).join('')) +
    trazo(d, C.sepiaHondo, 0.6, 0.7) + numeros +
    // El polvo de la tiza.
    nube(6, -50, 22, 1.6, C.tiza, 'xs', 0.14),
  );
}

/** Una costilla: una tecla de hueso, curvada para atrás, con el brillo y la sombra abajo. El (0, 0) es de donde cuelga. */
function costilla(): string {
  const d = 'M-1.8 0 Q-2.6 8 -0.6 17 Q0.6 19 2.2 17.4 Q1 9 1.8 0 Q0 -1.2 -1.8 0 Z';
  return conGrano(nube(1.4, 9, 2, 8, C.sepiaHondo, 'xs', 0.8) + forma(d, C.hueso) + trazo('M-0.8 1.6 Q-1.4 8 -0.2 15', C.tiza, 0.6, 0.9) + trazo('M1.4 2 Q0.8 9 1.6 16', C.gris, 0.5, 0.8));
}

/** La cola: un cabo corto, parado, con el nudo del piolín. */
function cola(): string {
  const d = curva([[37, -55], [43, -60], [48, -67], [51, -64], [47, -57], [43, -48]]);
  return conGrano(forma(d, C.gris) + nube(47, -63, 2.6, 2.6, C.grisClaro, 'xs', 0.9) + trazo(d, C.sepiaHondo, 0.5, 0.6) +
    trazo(`M${A.punta[0] - 2.4} ${A.punta[1] - 0.6} l4.4 2.6`, C.sepia, 1.3) + forma(elipse(A.punta[0], A.punta[1] + 0.6, 1.3, 1.3), C.sepia));
}

/** El cogote, con el collar de bronce y medio amuleto: el otro medio se le perdió. */
function cogote(): string {
  const d = curva([[-22, -59], [-36, -58], [-44, -50], [-42, -38], [-34, -32], [-22, -30]]);
  return conGrano(
    enmascarado('m-manso-cogote', d, forma(d, C.gris) + nube(-30, -57, 10, 3, C.grisClaro, 's', 0.9) + nube(-32, -34, 9, 4, C.sepiaHondo, 's', 0.7) + moreton(-27, -45, 3, 4)) +
    trazo('M-33 -58.4 Q-37 -46 -33 -32.6', C.bronce, 2.8) + trazo('M-33.8 -57 Q-37.6 -46 -34 -34', C.oro, 0.6, 0.8) +
    // El amuleto: media herradura.
    trazo('M-35 -33 q-2.6 3.6 -0.4 7', C.bronce, 1.6) + forma(elipse(-35.2, -26, 1, 1), C.bronceHondo),
  );
}

/**
 * La cabeza, agachada sobre la olla: cráneo redondo, el escalón de la frente, el hocico corto (un tercio de la
 * cabeza) con la trufa en la punta y la línea de la boca. Mira de costado, y una ceja que no opina.
 */
function cabeza(): string {
  const [ex, ey] = A.ojo;
  const d = curva([[-35, -52], [-41, -57], [-49, -56.6], [-54, -52.4], [-55.4, -47], [-60, -43.6], [-65.4, -38], [-66.8, -34], [-63, -32.4], [-56, -34.4], [-48, -34], [-39, -36], [-35, -42]]);
  return conGrano(
    enmascarado('m-manso-cabeza', d,
      forma(d, C.gris) + nube(-45, -55, 8, 3, C.grisClaro, 's', 0.9) +
      // El hocico, más claro, y la comisura en la sombra.
      nube(-61, -38.6, 5.6, 3.4, C.grisClaro, 's', 0.95) + nube(-47, -35, 8, 2.4, C.sepiaHondo, 's', 0.6) +
      moreton(-41, -46, 3, 3.4) + trazo('M-59 -36 l0.6 1.2 M-61.6 -35 l0.6 1.2 M-56.4 -36.6 l0.6 1.2', C.sepiaHondo, 0.4, 0.8)) +
    trazo(d, C.sepiaHondo, 0.6, 0.7) +
    // El escalón de la frente, y la línea de la boca, que sube en la comisura.
    trazo('M-54.6 -51 q-1.6 3 -0.6 4.6 q2 1 4.6 0.2', C.sepiaHondo, 0.7, 0.8) + trazo('M-65.4 -33.4 Q-56 -33.8 -49.6 -35.4 q1 1 0.6 2.4', C.sepiaHondo, 0.9, 0.95) +
    // La trufa, negra y mojada, en la punta.
    forma(curva([[-64, -39.4], [-67.6, -37.6], [-68, -34.4], [-65, -33.6], [-63, -36]]), C.negro) + forma(elipse(-66.4, -37, 0.8, 0.6), C.gris) +
    // El ojo: mira de costado, para quien lo mira, y no dice nada.
    forma(elipse(ex, ey, 3.2, 2.8), C.tiza) + forma(elipse(ex + 1, ey + 0.4, 1.7, 1.8), C.negro) + forma(elipse(ex + 0.4, ey - 0.4, 0.5, 0.5), C.tiza) +
    trazo(`M${ex - 4} ${ey - 3.6} Q${ex} ${ey - 4.8} ${ex + 4} ${ey - 3.2}`, C.sepiaHondo, 1, 0.9),
  );
}

/** La quijada, abajo, con los dientes, y la lengua afuera, que lame la olla. */
function quijada(): string {
  const d = curva([[-46.6, -36], [-55, -34], [-63, -32.6], [-64, -30.2], [-56, -30], [-47, -32.4]]);
  const lengua = curva([[-61, -32.4], [-65, -31.6], [-68.6, -28], [-68, -24.8], [-65, -25.2], [-62.4, -28.4], [-59.4, -31.2]]);
  return conGrano(
    forma(lengua, C.llama) + trazo('M-62 -31 Q-65.6 -29.4 -66.6 -26', C.bronce, 0.6, 0.9) + nube(-67, -26, 1.6, 1.4, C.tiza, 'xs', 0.6) +
    forma(d, C.gris) + nube(-55, -31, 7, 1.4, C.sepiaHondo, 'xs', 0.7) + trazo(d, C.sepiaHondo, 0.5, 0.6) + trazo('M-60.6 -33 l0.5 -1.4 M-58.2 -33.6 l0.5 -1.4', C.hueso, 0.8));
}

/** El párpado: pesado, de arriba. */
function parpado(): string {
  const [ex, ey] = A.ojo;
  return conGrano(forma(`M${ex - 3.6} ${ey - 3.2} L${ex + 3.6} ${ey - 3.2} L${ex + 3.6} ${ey + 3} Q${ex} ${ey + 4} ${ex - 3.6} ${ey + 3} Z`, C.gris) + trazo(`M${ex - 3.4} ${ey + 3} Q${ex} ${ey + 4} ${ex + 3.4} ${ey + 3}`, C.sepiaHondo, 0.7));
}

/** La oreja: nace arriba de la cabeza, se dobla y cae por el costado, de trapo. */
function oreja(): string {
  const d = curva([[-45.6, -56.4], [-41, -58.4], [-36.6, -56], [-34.6, -49], [-36, -41], [-39.8, -37.4], [-43.4, -41.6], [-44.6, -49]]);
  return conGrano(enmascarado('m-manso-oreja', d, forma(d, C.sepia) + nube(-38, -43, 3.4, 6, C.sepiaHondo, 's', 0.9) + nube(-41, -55, 4, 2.4, C.bronce, 'xs', 0.6)) + trazo(d, C.sepiaHondo, 0.5, 0.8) +
    // El doblez, donde se quiebra para caer.
    trazo('M-45 -54 q4 2.4 9 0.4', C.sepiaHondo, 0.6, 0.8));
}

/** La espina atravesada en la boca. */
function espina(): string {
  return conGrano(`<g transform="translate(5 -6) rotate(30 -68 -27)">${trazo('M-79 -27 L-57 -27', C.oro, 1.3)}${[-76, -72.6, -69.2, -65.8, -62.4].map((x) => trazo(`M${x} -30.4 l1.4 6.8`, C.oro, 0.8)).join('')}${forma(poli([[-57, -27], [-53, -30.4], [-53, -23.6]]), C.oro)}</g>`);
}

/** El palo: una rama pelada, con el nudo del piolín en la punta de arriba. El (0, 0) es el medio. */
function palo(): string {
  const h = A.palo / 2;
  return conGrano(trazo(`M0 ${-h} L0.6 -6 L-0.4 6 L0 ${h}`, C.sepia, 3.4) + trazo(`M-0.8 ${-h + 2} L-0.4 ${h - 3}`, C.bronce, 0.8, 0.8) + trazo('M0.4 -4 l3.4 -3.6', C.sepia, 1.6) +
    forma(elipse(0, -h + 1.6, 2.2, 1.4), C.hueso) + forma(elipse(0, h - 0.6, 1.9, 1.4), C.sepiaHondo));
}

/** El piolín: veinte unidades, que la isla estira. */
function piolin(): string {
  return `<rect x="0" y="-2" width="20" height="4" fill="none"/>` + trazo('M0 0 L20 0', C.hueso, 0.9, 0.95);
}

/** La tierra debajo: donde apoya, húmeda de sopa, con lo que se le cayó. */
function piso(): string {
  return nube(-10, 0, 76, 5, C.negro, 'm', 0.8) + conGrano(nube(OX, 1, 20, 2.4, C.verdeHondo, 's', 0.7) + trazo('M-54 1 l6 0.6 M-50 2.6 l4 -0.4 M-104 2 l5 0.4', C.hueso, 0.8, 0.7));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [EX, EY] = A.ojo;

export const PIEZAS_MANSO: readonly Pieza[] = [
  { nombre: 'manso-piso', caja: [-122, -8, 180, 16], dibujo: piso(), densidad: 2 },
  { nombre: 'manso-olla-atras', caja: [OX - 46, OY - 44, 78, 52], dibujo: ollaAtras(), densidad: D },
  { nombre: 'manso-cucharon', caja: [-5, -32, 19, 36], dibujo: cucharon(), densidad: D * 1.4 },
  { nombre: 'manso-cola', caja: [34, -70, 20, 25], dibujo: cola(), densidad: D * 1.2 },
  { nombre: 'manso-patas', caja: [-34, -46, 82, 49], dibujo: patas(), densidad: D },
  { nombre: 'manso-cuerpo', caja: [-38, -64, 84, 44], dibujo: cuerpo(), densidad: D * 1.2 },
  { nombre: 'manso-costilla', caja: [-4, -2, 8, 23], dibujo: costilla(), densidad: D * 2 },
  { nombre: 'manso-cogote', caja: [-47, -62, 28, 40], dibujo: cogote(), densidad: D * 1.2 },
  { nombre: 'manso-quijada', caja: [-71, -38, 27, 15], dibujo: quijada(), densidad: D * 1.4 },
  { nombre: 'manso-cabeza', caja: [-71, -61, 39, 32], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'manso-parpado', caja: [EX - 5, EY - 5, 10, 10], dibujo: parpado(), densidad: D * 2.4 },
  { nombre: 'manso-oreja', caja: [-48, -61, 16, 26], dibujo: oreja(), densidad: D * 1.4 },
  { nombre: 'manso-espina', caja: [-80, -50, 36, 34], dibujo: espina(), densidad: D * 1.6 },
  { nombre: 'manso-burbuja', caja: [-7, -12, 14, 14], dibujo: burbuja(), densidad: D * 2 },
  { nombre: 'manso-olla', caja: [OX - 32, OY - 2, 64, 36], dibujo: olla(), densidad: D },
  { nombre: 'manso-piolin', caja: [0, -2, 20, 4], dibujo: piolin(), densidad: D * 2 },
  { nombre: 'manso-palo', caja: [-4, -A.palo / 2 - 2, 10, A.palo + 4], dibujo: palo(), densidad: D * 1.6 },
];

const img = imagenesDe(PIEZAS_MANSO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El perro y su olla, armados con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('manso-piso') +
    img('manso-olla-atras') +
    [1, 2, 3].map((n) => parte(`cucharon-${n}`, `<g transform="scale(1 ${A.largos[n - 1]})">${img('manso-cucharon')}</g>`, t[`cucharon-${n}`])).join('') +
    parte('perro',
      parte('cola', img('manso-cola'), t.cola) +
      img('manso-patas') +
      parte('tronco', img('manso-cuerpo'), t.tronco) +
      [1, 2, 3, 4, 5, 6].map((n) => parte(`costilla-${n}`, img('manso-costilla'), t[`costilla-${n}`])).join('') +
      parte('cogote', img('manso-cogote'), t.cogote) +
      parte('cabeza',
        parte('quijada', img('manso-quijada'), t.quijada) +
        img('manso-cabeza') +
        parte('parpado', img('manso-parpado'), t.parpado) +
        parte('oreja', img('manso-oreja'), t.oreja) +
        parte('espina', img('manso-espina'), '', o.espina),
        t.cabeza),
      t.perro) +
    parte('burbuja', img('manso-burbuja'), t.burbuja, o.burbuja) +
    img('manso-olla') +
    parte('piolin', img('manso-piolin'), t.piolin) +
    parte('palo', img('manso-palo'), t.palo)
  );
}

/** El perro en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function mansoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--manso" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El perro manso'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el palo en la cuarta costilla, los cucharones torcidos de la risa, y él comiendo. */
export const RETRATO = { caja: [MANSO.x - 150, MANSO.piso - 96, 224, 108] as const };
function retrato(): string {
  return `<image href="/bestiario/baldio-lejos.webp" x="0" y="0" width="1500" height="640" preserveAspectRatio="none"/>` + mansoEn(CONTADO);
}

export const MANSO_PERSONAJE: Personaje = {
  id: ID,
  region: 'los-techos',
  ancla: MANSO.x,
  piezas: PIEZAS_MANSO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
