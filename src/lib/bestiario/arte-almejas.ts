/**
 * Las almejas (`D-73`, vigesimoctava vuelta), en un balde sobre el muelle de los astilleros.
 *
 * *"Sopa de almejas es todo lo que como"* es de *La hija del fletero*, en *Lobo suelto* (1993). Se toma al pie de la
 * letra: es lo único que come **el que se quedó**, así que el balde está lleno y al lado espera el plato de lata con
 * la sopa humeando y la cuchara adentro. Del mismo tema: *"en mi buzón hay un par de cartas suyas / fueron
 * juntándose y no tengo el valor"* (dos sobres sin abrir, mojados, debajo del balde) y *"nunca tuvo higo seco junto a
 * mí"* (el higo seco, solo, en la tabla, sin que nadie lo toque). Las almejas hablan entre ellas, abren y cierran la
 * valva como una boca; una se escapó del balde y se va por la tabla, y la cuchara baja a buscarla y no la agarra: la
 * almeja le muerde la punta y no la suelta. Cuando las tocan se cierran todas juntas de un golpe, abren de par en par
 * y tiran tres chorros; la última escupe una perla, que cae en la sopa. Que es la única riqueza del que se quedó.
 *
 * De la letra son la sopa, el balde, las cartas y el higo. Del dibujo son la fugitiva, la perla, los chorros, los
 * ojos de las almejas (de persona, como los animales de Rocambole) y el pie que sacan para caminar.
 *
 * Viste *Lobo suelto / Cordero atado*, medido con sharp: las valvas son el crema de la tapa de *Lobo suelto* y su
 * sombra tostada, el balde es el azul del plumaje del cordero (y el óxido, el naranja de su fondo), la sopa es ese
 * naranja, y el plato y la cuchara son el gris de la cadena.
 *
 * Coordenadas: el (0, 0) es la tabla del muelle debajo del medio del balde (`rig-almejas.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli } from './trazos.ts';
import { ALMEJAS, ALMEJAS_ARMADO as A, QUIETO, SOPA, marcas, type Momento } from './rig-almejas.ts';

const ID = 'las-almejas';

/** Las tintas de *Lobo suelto / Cordero atado* (`tokens.css`). */
const C = {
  valva: 'var(--bestia-almejas-valva)',
  valvaClara: 'var(--bestia-almejas-valva-clara)',
  valvaHonda: 'var(--bestia-almejas-valva-honda)',
  carne: 'var(--bestia-almejas-carne)',
  negro: 'var(--bestia-almejas-negro)',
  estano: 'var(--bestia-almejas-estano)',
  papel: 'var(--bestia-almejas-papel)',
  sepia: 'var(--bestia-almejas-sepia)',
  azul: 'var(--bestia-almejas-azul)',
  azulClaro: 'var(--bestia-almejas-azul-claro)',
  azulHondo: 'var(--bestia-almejas-azul-hondo)',
  sopa: 'var(--bestia-almejas-sopa)',
  sopaClara: 'var(--bestia-almejas-sopa-clara)',
  sopaHonda: 'var(--bestia-almejas-sopa-honda)',
  higo: 'var(--bestia-almejas-higo)',
};

/* ------------------------------------------------------------------
   Lo que está tirado en la tabla: las cartas, el higo, el charco
   ------------------------------------------------------------------ */

/** Los dos sobres sin abrir, mojados, y el higo seco que nunca tuvo. El balde apoya medio arriba de una carta. */
function suelo(): string {
  const sobre = (x: number, y: number, giro: number, sello: boolean): string => {
    const d = poli([[x - 17, y - 3], [x + 15, y - 5], [x + 17, y + 4], [x - 15, y + 6]]);
    return (
      `<g transform="rotate(${giro} ${x} ${y})">` +
      enmascarado(`m-almejas-sobre-${Math.round(x)}`, d,
        forma(d, C.papel) + nube(x + 8, y + 3, 14, 4, C.sepia, 'xs', 0.55) + nube(x - 12, y - 2, 6, 3, C.valvaHonda, 'xs', 0.35) +
        // El borde de carta aérea, a rayas, y el pliegue de la solapa.
        trazo(`M${x - 17} ${y - 3} L${x + 15} ${y - 5} M${x - 15} ${y + 6} L${x + 17} ${y + 4}`, C.azul, 1.6, 0.7) + trazo(`M${x - 14} ${y - 3} L${x} ${y + 2} L${x + 14} ${y - 4}`, C.sepia, 0.8, 0.8) +
        trazo(`M${x - 8} ${y + 3.4} l9 -0.4`, C.sepia, 0.7, 0.7)) +
      (sello ? `<rect x="${x + 7}" y="${y - 4.6}" width="6" height="5" fill="${C.sopaHonda}" opacity="0.9"/><path d="M${x + 8.4} ${y - 3.4} l3 0 M${x + 8.4} ${y - 1.8} l3 0" stroke="${C.papel}" stroke-width="0.6"/>` : '') +
      `</g>`
    );
  };
  // El higo, entero, con su cabito y sus arrugas, solito.
  const [hx, hy] = A.higo;
  const higo = curva([[hx - 5, hy - 1], [hx - 3, hy - 7], [hx + 3, hy - 8], [hx + 6, hy - 2], [hx + 4, hy + 2], [hx - 3, hy + 2]]);
  return conGrano(
    // El charco que gotea el balde, con un brillo roto, y la mancha húmeda donde apoya.
    nube(0, 0, 58, 5, C.azulHondo, 's', 0.85) + nube(-14, 0, 24, 2, C.azulClaro, 'xs', 0.35) + nube(30, 1, 16, 1.6, C.azulClaro, 'xs', 0.3) +
    sobre(-80, -3, -8, false) + sobre(-62, 0, 13, true) +
    nube(hx, hy + 3, 10, 2, C.negro, 'xs', 0.6) +
    enmascarado('m-almejas-higo', higo, forma(higo, C.higo) + nube(hx + 2, hy + 2, 5, 3, C.negro, 'xs', 0.7) + nube(hx - 2, hy - 4, 3, 2, C.sopaClara, 'xs', 0.7) + trazo(`M${hx - 3} ${hy - 4} q3 3 7 2 M${hx - 2} ${hy} q3 2 5 0`, C.negro, 0.6, 0.6)) +
    trazo(`M${hx} ${hy - 7} q1 -3 3 -3`, C.higo, 1.1),
  );
}

/* ------------------------------------------------------------------
   El balde: el fondo (lo de adentro y el asa) y el frente
   ------------------------------------------------------------------ */

/** Una valva chica de las del montón: dos arcos de crecimiento y el brillo. Va quieta, abajo de las que se mueven. */
function valvaChica(x: number, y: number, r: number, giro: number): string {
  const d = curva([[x - r, y + r * 0.2], [x - r * 0.7, y - r * 0.6], [x + r * 0.2, y - r * 0.8], [x + r, y - r * 0.1], [x + r * 0.6, y + r * 0.5], [x - r * 0.4, y + r * 0.6]]);
  return `<g transform="rotate(${giro} ${x} ${y})">${forma(d, C.valva)}${nube(x - r * 0.2, y - r * 0.4, r * 0.5, r * 0.3, C.valvaClara, 'xs', 0.9)}${trazo(`M${x - r * 0.7} ${y - r * 0.1} q${r * 0.6} ${-r * 0.6} ${r * 1.4} ${r * 0.1}`, C.valvaHonda, 0.8, 0.8)}${trazo(`M${x - r * 0.4} ${y + r * 0.2} q${r * 0.5} ${-r * 0.4} ${r} ${r * 0.1}`, C.valvaHonda, 0.7, 0.6)}</g>`;
}

/** Lo que se ve del balde por la boca: el agua oscura, el montón de almejas, y el asa de alambre, parada detrás. */
function baldeFondo(): string {
  const [cx, cy] = A.boca;
  const agua = elipse(cx, cy, A.rx - 3, A.ry - 2);
  const montón: Array<readonly [number, number, number, number]> = [
    [-34, -84, 8, -10], [-26, -82, 7, 22], [-10, -80, 8, 6], [4, -81, 7.4, -18], [18, -80, 8, 12], [30, -82, 7.4, -30], [38, -85, 6, 20],
    [-30, -91, 7, 30], [-14, -90, 7.4, -22], [16, -92, 7, 14], [-2, -88, 6.4, 40],
  ];
  return conGrano(
    // El asa: un alambre que sube de los dos lados, atrás de todo lo de la boca.
    trazo(`M${-A.rx + 2} ${cy - 2} Q${-A.rx - 6} ${cy - 56} 0 ${cy - 56} Q${A.rx + 6} ${cy - 56} ${A.rx - 2} ${cy - 2}`, C.estano, 2.6) + trazo(`M${-A.rx + 2} ${cy - 4} Q${-A.rx - 4} ${cy - 54} -6 ${cy - 56}`, C.valvaClara, 0.8, 0.55) +
    // El aro de atrás del balde, y el agua con el montón arriba.
    forma(elipse(cx, cy, A.rx, A.ry), C.azulClaro) +
    enmascarado('m-almejas-boca', agua, forma(agua, C.azulHondo) + nube(-18, cy - 2, 20, 4, C.azul, 's', 0.8) + nube(22, cy + 2, 14, 3, C.negro, 's', 0.7) + trazo(`M-30 ${cy + 2} q10 -3 22 0 M6 ${cy + 4} q10 -3 22 0`, C.azulClaro, 0.8, 0.5)) +
    montón.map(([x, y, r, g]) => valvaChica(x, y, r, g)).join('') +
    // Un yuyo de mar, colgando de atrás.
    trazo(`M24 ${cy - 8} q-8 -10 2 -18 q8 -6 -2 -14`, C.valvaHonda, 1.6, 0.9),
  );
}

/** El frente del balde: la lata azul, abollada, con el óxido que chorrea del aro y las dos nervaduras. */
function baldeFrente(): string {
  const [, cy] = A.boca;
  const cuerpo = `M${-A.rx} ${cy} Q${-A.rx - 1} ${cy + 40} ${-A.pie} -2 Q0 4 ${A.pie} -2 Q${A.rx + 1} ${cy + 40} ${A.rx} ${cy} Q0 ${cy + A.ry * 1.9} ${-A.rx} ${cy} Z`;
  return conGrano(
    enmascarado('m-almejas-balde', cuerpo,
      forma(cuerpo, C.azul) + nube(-34, -44, 12, 40, C.azulClaro, 's', 0.55) + nube(32, -36, 14, 40, C.azulHondo, 's', 0.9) + nube(0, -4, 40, 7, C.azulHondo, 's', 0.9) +
      // El óxido, que chorrea del aro, y las manchas del agua que se evaporó.
      [[-30, 30], [-14, 42], [12, 24], [28, 36]].map(([x, h]) => nube(x!, cy + 8 + h! * 0.4, 1.8, h! * 0.5, C.sopaHonda, 'xs', 0.38)).join('') + nube(-4, cy + 6, 30, 3, C.sopaHonda, 'xs', 0.4) +
      // Las nervaduras, y la abolladura.
      trazo(`M${-A.rx + 2} -30 Q0 -22 ${A.rx - 4} -32 M${-A.rx + 6} -58 Q0 -50 ${A.rx - 7} -60`, C.azulHondo, 2.2, 0.9) + trazo(`M${-A.rx + 2} -32 Q0 -24 ${A.rx - 4} -34`, C.azulClaro, 0.8, 0.5) +
      nube(14, -24, 8, 6, C.azulHondo, 's', 0.7) + nube(11, -27, 4, 2, C.azulClaro, 'xs', 0.5)) +
    // El labio de adelante, que le da la luz del farol, y las dos orejas del asa.
    trazo(`M${-A.rx} ${cy} Q0 ${cy + A.ry * 1.9} ${A.rx} ${cy}`, C.azulClaro, 2.6) + trazo(`M${-A.rx + 6} ${cy + 6} Q0 ${cy + A.ry * 1.9 - 2} ${A.rx - 6} ${cy + 6}`, C.sopaClara, 0.7, 0.5) +
    forma(elipse(-A.rx + 2, cy - 1, 3, 3.4), C.estano) + forma(elipse(A.rx - 2, cy - 1, 3, 3.4), C.estano),
  );
}

/* ------------------------------------------------------------------
   Una almeja: la valva de abajo con la cara, y la de arriba, que se abre
   ------------------------------------------------------------------ */

/**
 * La almeja de abajo: la valva, la carne que asoma cuando abre, y los dos ojos de persona. Está dibujada con la
 * bisagra en la izquierda, en el (−14, 1), y la valva de arriba se levanta de ahí.
 */
function almejaBase(): string {
  const lado = curva([[-15, 1], [-13, 7], [-5, 10.5], [6, 10], [13, 6], [15, 1]]);
  const carne = curva([[-14, 1.4], [-9, -4.6], [0, -6.6], [9, -5.4], [14.4, 1.2], [6, 3.2], [-6, 3.4]]);
  return conGrano(
    // El hueco oscuro de adentro, y la carne con su labio.
    forma(poli([[-14, 0], [14.6, 0], [10, 5], [-10, 5]]), C.negro) +
    enmascarado('m-almeja-carne', carne, forma(carne, C.carne) + nube(-6, -1, 7, 3, C.valvaHonda, 'xs', 0.55) + nube(6, -5, 6, 2, C.valvaClara, 'xs', 0.8)) +
    // Los ojos: el blanco, la pupila y el brillo; y la boquita.
    forma(elipse(-2, -3.4, 2.6, 2.7), C.valvaClara) + forma(elipse(5.4, -3.8, 2.6, 2.7), C.valvaClara) + forma(elipse(-1.4, -3, 1.2, 1.4), C.negro) + forma(elipse(6, -3.4, 1.2, 1.4), C.negro) + forma(elipse(-1.9, -3.7, 0.4, 0.4), C.valvaClara) +
    trazo('M0 -0.4 q2 1.4 5 0', C.valvaHonda, 0.7, 0.9) +
    // La valva de abajo, con su ranura y sus estrías.
    enmascarado('m-almeja-lado', lado, forma(lado, C.valvaHonda) + nube(-2, 5, 10, 4, C.valva, 's', 0.9) + nube(-8, 2, 4, 3, C.valvaClara, 'xs', 0.7) +
      trazo('M-11 4 q5 4 12 3 M-9 7 q5 2 12 0', C.valvaHonda, 0.6, 0.8)) +
    trazo('M-15 1 Q0 3.2 15 1', C.negro, 0.9, 0.9),
  );
}

/** La valva de arriba: la cúpula con los anillos de crecimiento y el brillo. Cerrada, tapa la carne. */
function almejaTapa(): string {
  const d = curva([[-15, 1.4], [-14.4, -6], [-6, -12], [5, -13], [13, -8], [15.4, 1.4], [0, 2.6]]);
  return conGrano(
    enmascarado('m-almeja-tapa', d, forma(d, C.valva) + nube(-6, -8, 7, 3.4, C.valvaClara, 'xs', 0.95) + nube(10, -1, 7, 4, C.valvaHonda, 'xs', 0.7) +
      // Los anillos, que salen de la bisagra, y las estrías.
      trazo('M-13 0 Q-10 -9 -1 -11 M-13 0 Q-6 -7 3 -8 M-13 0 Q-3 -4 8 -4', C.valvaHonda, 0.7, 0.85) + trazo('M-13 0 L13 -4 M-13 0 L10 -9 M-13 0 L2 -12', C.valvaHonda, 0.4, 0.4)) +
    trazo('M-14 1.2 Q0 3 14 1.2', C.negro, 0.8, 0.8),
  );
}

/** El pie con el que la que se escapó camina: una lengua carnosa que sale del labio y se estira. Va dibujada para la derecha. */
function pie(): string {
  const d = curva([[0, -3], [14, -4], [26, -2], [30, 2], [26, 5], [14, 4], [0, 3]]);
  return conGrano(enmascarado('m-almeja-pie', d, forma(d, C.carne) + nube(14, 3, 12, 2, C.valvaHonda, 'xs', 0.6) + nube(10, -2, 9, 1.6, C.valvaClara, 'xs', 0.8)) + trazo('M4 0 q10 -1 22 1', C.valvaHonda, 0.5, 0.7));
}

/* ------------------------------------------------------------------
   El plato de sopa, la cuchara y lo que sube
   ------------------------------------------------------------------ */

/** El plato hondo de lata, con la sopa, tres almejas flotando adentro y las burbujas. */
function plato(): string {
  const [px, py] = A.plato;
  const sopa = elipse(px, py - 10, 33, 6.4);
  const cuerpo = `M${px - 38} ${py - 10} Q${px - 36} ${py + 6} ${px - 26} ${py + 9} L${px + 26} ${py + 9} Q${px + 36} ${py + 6} ${px + 38} ${py - 10} Q${px} ${py - 2} ${px - 38} ${py - 10} Z`;
  return conGrano(
    nube(px + 2, py + 10, 38, 4, C.negro, 's', 0.8) +
    forma(elipse(px, py - 10, 38, 8), C.estano) +
    enmascarado('m-almejas-sopa', sopa, forma(sopa, C.sopa) + nube(px + 8, py - 9, 16, 3, C.sopaHonda, 's', 0.7) + nube(px - 12, py - 12, 12, 2.4, C.sopaClara, 'xs', 0.8) + trazo(`M${px - 20} ${py - 8} q10 3 22 0 M${px + 4} ${py - 12} q8 -2 18 1`, C.sopaClara, 0.7, 0.6)) +
    // Las almejas que le quedan: tres valvas medio hundidas, y las burbujitas.
    [[-14, -11, 5], [6, -9, 5.4], [18, -12, 4.4]].map(([x, y, r]) => valvaChica(px + x!, py + y!, r!, x! * 2)).join('') +
    [[-24, -10], [-3, -13], [24, -9], [10, -14]].map(([x, y]) => `<circle cx="${px + x!}" cy="${py + y!}" r="1.2" fill="none" stroke="${C.sopaClara}" stroke-width="0.7"/>`).join('') +
    enmascarado('m-almejas-plato', cuerpo, forma(cuerpo, C.estano) + nube(px - 24, py - 2, 8, 7, C.valvaClara, 's', 0.5) + nube(px + 26, py + 2, 12, 8, C.negro, 's', 0.7) + trazo(`M${px - 36} ${py - 2} Q${px} ${py + 6} ${px + 36} ${py - 2}`, C.negro, 0.9, 0.5) + nube(px + 4, py + 7, 16, 2, C.sopaHonda, 'xs', 0.55)) +
    trazo(`M${px - 38} ${py - 10} Q${px} ${py + 1} ${px + 38} ${py - 10}`, C.valvaClara, 1.2, 0.7) +
    // El abollón del aro, y la oreja del plato.
    forma(elipse(px + 38, py - 10, 3, 2.4), C.estano) + trazo(`M${px + 34} ${py - 16} q4 -2 6 2`, C.valvaClara, 0.6, 0.6),
  );
}

/** La cuchara de lata: el cabo largo, que sale del plato, y la parte honda, que tiene un poco de sopa. */
function cuchara(): string {
  const { pivote: [vx, vy], punta: [ux, uy] } = A.cuchara;
  const [bx, by] = [vx + ux, vy + uy];
  const hondo = elipse(bx, by, 11, 6);
  return conGrano(
    trazo(`M${vx + 6} ${vy - 4} Q${vx - 20} ${vy - 2} ${bx + 7} ${by - 3}`, C.estano, 3.4) + trazo(`M${vx + 6} ${vy - 5.6} Q${vx - 20} ${vy - 3.6} ${bx + 7} ${by - 4.6}`, C.valvaClara, 0.9, 0.6) +
    forma(elipse(vx + 7, vy - 4, 3.6, 2.6), C.estano) + forma(elipse(vx + 7, vy - 4, 1.2, 1), C.negro) +
    `<g transform="rotate(-12 ${bx} ${by})">` + forma(hondo, C.estano) + enmascarado('m-almejas-cuch', elipse(bx, by, 9, 4.6), forma(elipse(bx, by, 9, 4.6), C.sopa) + nube(bx + 2, by + 1, 6, 2, C.sopaHonda, 'xs', 0.7)) + trazo(`M${bx - 11} ${by} Q${bx} ${by + 6} ${bx + 11} ${by}`, C.valvaClara, 0.8, 0.7) + `</g>`,
  );
}

/** El vapor de la sopa: tres hilos que se enroscan al subir, uno más alto que el otro. La isla los sube y los apaga. */
function vapor(): string {
  const hilo = (x: number, alto: number, o: number): string => {
    const d = `M${x} 16 C${x - 9} ${16 - alto * 0.25} ${x + 9} ${16 - alto * 0.45} ${x} ${16 - alto * 0.6} C${x - 8} ${16 - alto * 0.75} ${x + 7} ${16 - alto * 0.88} ${x + 1} ${16 - alto}`;
    return trazo(d, C.sopaClara, 4.4, o * 0.4) + trazo(d, C.valvaClara, 2, o);
  };
  return hilo(-7, 34, 0.9) + hilo(1, 40, 1) + hilo(8, 30, 0.85);
}

/** El chorro de una almeja: sale del labio y sube un poco para la derecha, en una curva que se abre en gotas. Va dibujado de abajo para arriba. */
function chorro(): string {
  return conGrano(
    nube(8, -26, 8, 24, C.azulClaro, 'xs', 0.55, 20) +
    trazo('M0 0 Q3 -28 16 -46', C.azulClaro, 6.4, 0.75) + trazo('M0 0 Q3 -28 16 -46', C.valvaClara, 3.6, 1) +
    [[19, -50, 2.8], [24, -44, 2.2], [12, -53, 2.2], [22, -37, 1.8], [27, -52, 1.6], [16, -58, 1.5], [26, -41, 1.3]].map(([x, y, r]) => forma(elipse(x!, y!, r!, r! * 1.3), C.valvaClara) + forma(elipse(x! - r! * 0.3, y! - r! * 0.4, r! * 0.35, r! * 0.35), C.valvaClara)).join(''),
  );
}

/** La perla: una esfera con su brillo, y un halo chico de agua. */
function perla(): string {
  return conGrano(nube(0, 0, 7.5, 7.5, C.valvaClara, 'xs', 0.55) + forma(elipse(0, 0, 6.4, 6.4), C.valvaHonda) + forma(elipse(-0.4, -0.4, 5.6, 5.6), C.valva) + nube(-1.8, -2.2, 2.6, 1.9, C.valvaClara, 'xs', 1) + forma(elipse(-2.2, -2.6, 1.2, 0.9), C.valvaClara) + nube(1.8, 2.2, 2.8, 2.2, C.carne, 'xs', 0.7));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;

export const PIEZAS_ALMEJAS: readonly Pieza[] = [
  { nombre: 'almejas-suelo', caja: [-104, -18, 180, 26], dibujo: suelo(), densidad: D },
  { nombre: 'almejas-fondo', caja: [-64, -148, 128, 150], dibujo: baldeFondo(), densidad: D },
  { nombre: 'almejas-frente', caja: [-58, -88, 116, 94], dibujo: baldeFrente(), densidad: D },
  { nombre: 'almejas-base', caja: [-18, -10, 36, 22], dibujo: almejaBase(), densidad: D * 2.6 },
  { nombre: 'almejas-tapa', caja: [-18, -15, 36, 18], dibujo: almejaTapa(), densidad: D * 2.6 },
  { nombre: 'almejas-pie', caja: [-2, -6, 34, 12], dibujo: pie(), densidad: D * 2.4 },
  { nombre: 'almejas-plato', caja: [A.plato[0] - 44, A.plato[1] - 22, 88, 42], dibujo: plato(), densidad: D },
  { nombre: 'almejas-cuchara', caja: [A.cuchara.pivote[0] + A.cuchara.punta[0] - 16, A.cuchara.pivote[1] - 14, 84, 40], dibujo: cuchara(), densidad: D * 1.6 },
  { nombre: 'almejas-vapor', caja: [-18, -26, 36, 46], dibujo: vapor(), densidad: D * 1.6 },
  { nombre: 'almejas-chorro', caja: [-8, -68, 44, 70], dibujo: chorro(), densidad: D * 2 },
  { nombre: 'almejas-perla', caja: [-10, -10, 20, 20], dibujo: perla(), densidad: D * 3.4 },
];

const img = imagenesDe(PIEZAS_ALMEJAS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Las almejas armadas con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const almeja = (i: 1 | 2 | 3): string => parte(`almeja-${i}`, img('almejas-base') + parte(`tapa-${i}`, img('almejas-tapa'), t[`tapa-${i}`]), t[`almeja-${i}`]);
  return (
    img('almejas-suelo') +
    parte('balde',
      img('almejas-fondo') + almeja(1) + almeja(2) + almeja(3) +
      ([1, 2, 3] as const).map((i) => parte(`chorro-${i}`, img('almejas-chorro'), t[`chorro-${i}`], o[`chorro-${i}`])).join('') +
      img('almejas-frente'),
      t.balde) +
    // La que se escapó, caminando por la tabla con el pie por delante.
    parte('fugi',
      parte('fugi-cuerpo', parte('fugi-pie', img('almejas-pie'), t['fugi-pie']) + img('almejas-base') + parte('fugi-tapa', img('almejas-tapa'), t['fugi-tapa']), t['fugi-cuerpo']),
      t.fugi) +
    img('almejas-plato') +
    parte('cuchara', img('almejas-cuchara'), t.cuchara) +
    parte('vapor-1', img('almejas-vapor'), t['vapor-1'], o['vapor-1']) +
    parte('vapor-2', img('almejas-vapor'), t['vapor-2'], o['vapor-2']) +
    parte('perla', img('almejas-perla'), t.perla, o.perla)
  );
}

/** Las almejas en un momento, sin lo que las hace tocables: para el test, el retrato y para mirarlas. */
export function almejasEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: el balde lleno, las almejas entreabiertas, la cuchara en el plato. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--almejas" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'Las almejas'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: abiertas de par en par, con los tres chorros y la perla en el aire. */
export const RETRATO = { caja: [ALMEJAS.x - 86, ALMEJAS.piso - 116, 214, 128] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/astillero-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/astillero-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    almejasEn(SOPA)
  );
}

export const ALMEJAS_PERSONAJE: Personaje = {
  id: ID,
  region: 'los-astilleros',
  ancla: ALMEJAS.x,
  piezas: PIEZAS_ALMEJAS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
