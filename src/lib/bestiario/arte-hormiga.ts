/**
 * La hormiga dormida (`D-73`, vigesimoctava vuelta), tirada panza arriba en el mantel, al lado de un membrillo.
 *
 * *"Negrita yace asustada / la hormiga se le durmió"* es de *Caña seca y un membrillo*, en *Lobo suelto, cordero atado*
 * (1993). Se toma al pie de la letra, y del mismo tema sale lo que tiene alrededor. Es **negrita**: negra, del azul negro de
 * la lana del cordero. **Yace asustada**: duerme panza arriba con las patas flojas en el aire, y aun dormida tiene el ceño
 * fruncido y una gota fría en la frente. **Se le durmió** la hormiga: una de las patas, la que le cuelga, está dormida de
 * verdad. **Un dedalito de caña soplada**: apoya la cabeza en un dedal, con la caña derramada al lado, y ronca una burbuja
 * que se infla y a veces revienta. **Dios ya no quiere que baile / vamos, negrita, bailá hasta el fin**: las zapatillas de
 * baile, tiradas al lado, y el gorro de dormir. **Morena, vi tu camisa colgada, secando**: un hilo que sale de la ramita
 * del membrillo hasta un palillo clavado en el mantel, con una camisa chica prendida con dos alfileres. Tocada, se despierta
 * de golpe, y baila: se da vuelta sobre la espalda, pateando, como en un baile de plaza, y de a poco se vuelve a dormir.
 *
 * De la letra son la negrita, el susto, el sueño, el dedal de caña, el baile, la camisa y el membrillo. Del dibujo son las
 * zapatillas, el gorro, la burbuja, las zetas y el palillo.
 *
 * Viste *Lobo suelto, cordero atado*, medido con sharp: el cuerpo es la lana oscura del cordero con el azul de la contratapa,
 * las zapatillas son el naranja del fondo, el membrillo y el dedal son el oro de las pezuñas, y la camisa y las burbujas son el
 * celeste de la contratapa. La tapa no tiene verde: la hoja del membrillo es su píxel más verde (`--bestia-hormiga-*`).
 *
 * Coordenadas: el (0, 0) es el mantel debajo del medio del cuerpo; la cabeza va a la izquierda (`rig-hormiga.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { BAILA, HORMIGA, HORMIGA_ARMADO as A, QUIETO, marcas, type Momento } from './rig-hormiga.ts';

const ID = 'la-hormiga-dormida';

/** Las tintas de *Lobo suelto, cordero atado* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-hormiga-negro)',
  azulHondo: 'var(--bestia-hormiga-azul-hondo)',
  azul: 'var(--bestia-hormiga-azul)',
  azulClaro: 'var(--bestia-hormiga-azul-claro)',
  celeste: 'var(--bestia-hormiga-celeste)',
  celesteClaro: 'var(--bestia-hormiga-celeste-claro)',
  naranja: 'var(--bestia-hormiga-naranja)',
  naranjaClaro: 'var(--bestia-hormiga-naranja-claro)',
  naranjaHondo: 'var(--bestia-hormiga-naranja-hondo)',
  oro: 'var(--bestia-hormiga-oro)',
  oroClaro: 'var(--bestia-hormiga-oro-claro)',
  oroHondo: 'var(--bestia-hormiga-oro-hondo)',
  hoja: 'var(--bestia-hormiga-hoja)',
};

const circulo = (x: number, y: number, r: number): string => elipse(x, y, r, r);

/* ------------------------------------------------------------------
   Lo que se queda quieto: el membrillo, el dedal, las zapatillas, el hilo y el palillo
   ------------------------------------------------------------------ */

/** El hilo de tender, que sale de la ramita del membrillo, cuelga hasta la camisa y llega al palillo. */
const HILO = 'M-96 -60 Q6 -40 110 -60';

function fondo(): string {
  const [mx, my] = A.membrillo;
  const pera = curva([[mx, 0], [mx - 18, -3], [mx - 27, -16], [mx - 22, -31], [mx - 10, -41], [mx - 5, -53], [mx + 5, -53], [mx + 10, -41], [mx + 22, -31], [mx + 27, -16], [mx + 18, -3]]);
  // La pelusa del membrillo: rayitas cortas pegadas a la piel, en todas direcciones.
  let pelusa = '';
  for (let i = 0; i < 26; i++) {
    const a = i * 2.399;
    const r = 6 + ((i * 7) % 20);
    const x = mx + Math.cos(a) * r * 0.9;
    const y = my - 4 + Math.sin(a) * r * 1.05;
    pelusa += trazo(`M${f(x)} ${f(y)} l${f(Math.cos(a + 1) * 3)} ${f(Math.sin(a + 1) * 2.4)}`, C.oroClaro, 0.7, 0.6);
  }
  const dedal = curva([[A.dedal[0] - 14, A.dedal[1] - 7], [A.dedal[0] + 8, A.dedal[1] - 10], [A.dedal[0] + 16, A.dedal[1] - 3], [A.dedal[0] + 14, A.dedal[1] + 6], [A.dedal[0] - 12, A.dedal[1] + 6]]);
  const zapatilla = (x: number, g: number): string =>
    `<g transform="rotate(${g} ${x} -2)">` +
    forma(`M${x - 9} -1 Q${x - 11} -7 ${x - 4} -8 Q${x + 2} -6 ${x + 9} -4 L${x + 9} 0 Z`, C.naranja) + trazo(`M${x - 3} -8 Q${x + 1} -13 ${x + 6} -5`, C.naranjaClaro, 1.2) + forma(`M${x - 10} 0 L${x + 10} 0 L${x + 10} 2.4 L${x - 10} 2.4 Z`, C.naranjaHondo) + forma(`M${x + 4} -4 l4 0 l0 -5 l-4 3 Z`, C.naranjaHondo, 0.9) + `</g>`;
  return conGrano(
    // La mancha del mantel abajo de todo, y la sombra del cuerpo.
    nube(0, 1, 74, 4, C.negro, 's', 0.45) + nube(mx, 1, 30, 3.4, C.negro, 's', 0.5) +
    // El membrillo.
    enmascarado('m-hormiga-membrillo', pera,
      forma(pera, C.oro) + nube(mx - 10, my - 8, 12, 14, C.oroClaro, 's', 0.85) + nube(mx + 14, my + 6, 10, 18, C.oroHondo, 's', 0.8) + nube(mx - 14, my + 14, 8, 6, C.oroHondo, 's', 0.5) + pelusa +
      // Los hoyuelos, y una manchita de golpe.
      [[-4, -2, 2.4], [8, 8, 2], [-12, 4, 1.8]].map(([dx, dy, r]) => forma(circulo(mx + dx!, my + dy!, r!), C.oroHondo, 0.7)).join('')) +
    trazo(pera, C.oroHondo, 0.9, 0.5) +
    // El rabito y la hoja, que sale para el lado del hilo.
    trazo(`M${mx} -52 q2 -4 -1 -8`, C.oroHondo, 2.4) + forma(`M${mx - 1} -58 Q${mx + 12} -70 ${mx + 24} -60 Q${mx + 12} -53 ${mx - 1} -58 Z`, C.hoja) + trazo(`M${mx} -58 L${mx + 20} -60`, C.celeste, 0.7, 0.6) +
    // El hilo con sus dos puntas atadas, el palillo clavado en el mantel y el nudo.
    trazo(HILO, C.celesteClaro, 1.1, 0.9) + forma(circulo(mx - 1, -59.4, 2.2), C.celesteClaro) +
    trazo(`M${A.palillo[0]} 2 L${A.palillo[0] + 2} -62`, C.oroHondo, 3.4) + trazo(`M${A.palillo[0] - 0.8} 0 L${A.palillo[0] + 1.2} -61`, C.oroClaro, 1, 0.8) + forma(poli([[A.palillo[0] - 1.5, -62], [A.palillo[0] + 5, -62], [A.palillo[0] + 2, -67]]), C.oroClaro) + forma(circulo(A.palillo[0] + 1.5, -60, 2), C.celesteClaro) +
    // Las zapatillas de baile: una parada y otra tirada de costado, con la tira.
    zapatilla(82, 0) + zapatilla(98, 72) +
    // El dedal, acostado, con el borde y los hoyuelos; y la caña que se derramó, con su burbuja.
    nube(A.dedal[0] - 22, A.dedal[1] + 5, 12, 2.4, C.oroClaro, 'xs', 0.85) + forma(circulo(A.dedal[0] - 26, A.dedal[1] + 2, 1.8), C.celesteClaro, 0.9) +
    enmascarado('m-hormiga-dedal', dedal, forma(dedal, C.oro) + nube(A.dedal[0] - 4, A.dedal[1] - 6, 12, 3, C.oroClaro, 'xs', 0.9) + nube(A.dedal[0] + 8, A.dedal[1] + 4, 9, 4, C.oroHondo, 'xs', 0.85) +
      [[-6, -2], [0, 1], [6, -3], [8, 2], [-2, 4], [4, 4]].map(([dx, dy]) => forma(circulo(A.dedal[0] + dx!, A.dedal[1] + dy!, 0.9), C.oroHondo, 0.8)).join('')) +
    forma(elipse(A.dedal[0] - 13, A.dedal[1] - 0.6, 3, 6.4), C.oroHondo) + forma(elipse(A.dedal[0] - 13.6, A.dedal[1] - 0.6, 1.8, 4.6), C.negro, 0.9) + trazo(`M${A.dedal[0] - 12} ${A.dedal[1] - 6.4} Q${A.dedal[0] - 16} ${A.dedal[1]} ${A.dedal[0] - 12} ${A.dedal[1] + 6}`, C.oroClaro, 0.9, 0.7),
  );
}

/** La camisa que se seca: chica, celeste, prendida del hilo con dos alfileres, con las gotas que le caen. */
function camisa(): string {
  const [sx, sy] = A.camisa;
  const d = poli([[sx - 12, sy + 2], [sx - 6, sy], [sx - 2, sy + 3], [sx + 2, sy + 3], [sx + 6, sy], [sx + 12, sy + 2], [sx + 20, sy + 12], [sx + 14, sy + 15], [sx + 10, sy + 11], [sx + 11, sy + 28], [sx - 11, sy + 28], [sx - 10, sy + 11], [sx - 14, sy + 15], [sx - 20, sy + 12]]);
  return conGrano(
    enmascarado('m-hormiga-camisa', d, forma(d, C.celeste) + nube(sx - 6, sy + 10, 8, 12, C.celesteClaro, 's', 0.8) + nube(sx + 9, sy + 20, 8, 10, C.azulHondo, 's', 0.55) + trazo(`M${sx - 4} ${sy + 5} l-1 20 M${sx + 4} ${sy + 5} l2 18`, C.azulClaro, 0.8, 0.6)) +
    trazo(d, C.azulClaro, 0.7, 0.7) + forma(poli([[sx - 3, sy + 3], [sx, sy + 8], [sx + 3, sy + 3]]), C.celesteClaro) + [10, 16, 22].map((dy) => forma(circulo(sx, sy + dy, 0.9), C.celesteClaro)).join('') +
    // Los dos alfileres de la cabecita colorada.
    [-8, 8].map((dx) => trazo(`M${sx + dx} ${sy - 3} L${sx + dx} ${sy + 5}`, C.celesteClaro, 1) + forma(circulo(sx + dx, sy - 3.4, 1.7), C.naranja)).join('') +
    // Las gotas que chorrea, que no llegan al mantel.
    forma(poli([[sx - 5, sy + 29], [sx - 3, sy + 29], [sx - 4, sy + 33]]), C.celesteClaro, 0.9) + forma(poli([[sx + 5, sy + 29], [sx + 7, sy + 29], [sx + 6, sy + 36]]), C.celesteClaro, 0.8),
  );
}

/* ------------------------------------------------------------------
   El cuerpo: el tórax y la panza, las patas, la cabeza, las antenas
   ------------------------------------------------------------------ */

/** El tórax y el abdomen, panza arriba: el vientre azul con los anillos, el brillo negro del costado, el aguijón. */
function tronco(): string {
  const torax = curva([[-29, -17], [-24, -30], [-10, -33], [4, -28], [6, -14], [-2, -4], [-18, -3], [-27, -9]]);
  const abdomen = curva([[2, -17], [8, -33], [30, -38], [52, -30], [58, -18], [52, -6], [30, -1], [10, -6]]);
  let anillos = '';
  for (let i = 0; i < 5; i++) anillos += trazo(`M${f(14 + i * 9)} ${f(-35 + i * 1.5)} Q${f(8 + i * 9)} ${f(-19)} ${f(14 + i * 9)} ${f(-3 - i * 1.2)}`, C.negro, 1.2, 0.75);
  return conGrano(
    // La cintura finita entre el tórax y la panza.
    trazo('M2 -18 L10 -18', C.negro, 6) +
    enmascarado('m-hormiga-abdomen', abdomen,
      forma(abdomen, C.negro) + nube(28, -26, 24, 9, C.azul, 's', 0.9) + nube(30, -34, 18, 3, C.azulClaro, 'xs', 0.75) + nube(30, -6, 24, 4, C.azulHondo, 's', 0.8) + anillos) +
    forma(poli([[57, -22], [66, -17], [57, -13]]), C.negro) + trazo('M57 -20 L65 -17', C.azulClaro, 0.9, 0.7) +
    enmascarado('m-hormiga-torax', torax,
      forma(torax, C.negro) + nube(-14, -24, 14, 7, C.azul, 's', 0.9) + nube(-16, -31, 10, 2.4, C.azulClaro, 'xs', 0.8) + nube(-12, -4, 14, 3, C.azulHondo, 's', 0.8) + trazo('M-24 -26 Q-12 -18 -2 -28 M-26 -12 Q-14 -6 -2 -10', C.azulHondo, 1.2, 0.8)),
  );
}

/**
 * Una pata de hormiga muerta de sueño: sale de arriba del tórax, sube a la rodilla, y la canilla se dobla otra vez hacia la panza
 * y termina en una uñita en gancho. Dos tramos finos, sin bolitas en las articulaciones.
 */
const pata = ([b, k, p]: readonly [P, P, P], color: string, ancho: number, brillo: string | null = null): string => {
  const d = `M${f(b[0])} ${f(b[1])} L${f(k[0])} ${f(k[1])} Q${f((k[0] + p[0]) / 2 + 3)} ${f((k[1] + p[1]) / 2 - 2)} ${f(p[0])} ${f(p[1])}`;
  // La uña: un gancho chiquito que sigue la dirección de la canilla y se dobla para adentro.
  const [dx, dy] = [p[0] - k[0], p[1] - k[1]];
  const l = Math.hypot(dx, dy) || 1;
  const gancho = `M${f(p[0])} ${f(p[1])} q${f((dx / l) * 2.4 - (dy / l) * 2.6)} ${f((dy / l) * 2.4 + (dx / l) * 2.6)} ${f((-dy / l) * 3.2)} ${f((dx / l) * 3.2)}`;
  return trazo(d, color, ancho) + (brillo ? trazo(`M${f(b[0])} ${f(b[1])} L${f(k[0])} ${f(k[1])}`, brillo, ancho * 0.25, 0.7) : '') + trazo(gancho, color, ancho * 0.6);
};

/** Las tres patas de cerca, del tórax: dos encogidas hacia la panza, y la tercera, la que se le durmió, que cuelga floja para un costado. */
function patas1(): string {
  return conGrano(
    pata([[-24, -29], [-37, -47], [-23, -41]], C.negro, 2.8, C.azulClaro) +
    pata([[-14, -31], [-17, -51], [-3, -43]], C.negro, 2.8, C.azulClaro) +
    // La dormida: no se encoge, se va para el costado y cuelga, floja, con la uña para abajo.
    trazo('M-4 -29 Q10 -48 30 -44 Q42 -40 44 -26', C.azulHondo, 2.6) + trazo('M44 -26 q-1 3 -3.4 4', C.azulHondo, 1.7) + trazo('M-4 -29 Q10 -48 30 -44', C.azulClaro, 0.7, 0.6),
  );
}

/** Las tres de lejos, más oscuras, también encogidas, asomando por atrás del cuerpo. */
function patas2(): string {
  return conGrano(
    pata([[-20, -30], [-46, -42], [-41, -32]], C.azulHondo, 2.4) +
    pata([[-9, -32], [-8, -55], [6, -47]], C.azulHondo, 2.4) +
    pata([[1, -30], [24, -49], [30, -37]], C.azulHondo, 2.4),
  );
}

/** La cabeza: el ceño fruncido de asustada, los ojos cerrados con pestañas, las mejillas, las mandíbulas, el gorro de dormir. */
function cabeza(): string {
  const [cx, cy] = A.cabeza;
  const cara = curva([[cx - 14, cy], [cx - 11, cy - 12], [cx, cy - 15], [cx + 12, cy - 10], [cx + 14, cy + 2], [cx + 8, cy + 13], [cx - 4, cy + 15], [cx - 12, cy + 10]]);
  const gorro = curva([[cx - 14, cy - 14], [cx - 4, cy - 20], [cx + 9, cy - 16], [cx + 3, cy - 12]]);
  const [a, b] = A.ojos;
  return conGrano(
    // Las mandíbulas, a los dos lados de la boca, chiquitas y en gancho.
    enmascarado('m-hormiga-cara', cara,
      forma(cara, C.negro) + nube(cx - 2, cy - 4, 11, 8, C.azul, 's', 0.9) + nube(cx - 4, cy - 12, 9, 2.4, C.azulClaro, 'xs', 0.85) + nube(cx + 6, cy + 10, 9, 4, C.azulHondo, 's', 0.8) +
      // Las mejillas coloradas del baile, y la raya del cachete.
      nube(a[0] - 2, a[1] + 9, 5, 3, C.naranja, 'xs', 0.75) + nube(b[0] + 1, b[1] + 9, 5, 3, C.naranja, 'xs', 0.7)) +
    // Los ojos cerrados: dos arcos con pestañas, y arriba las cejas torcidas del susto.
    [a, b].map(([x, y]) => trazo(`M${f(x - 5)} ${f(y)} Q${f(x)} ${f(y + 4.4)} ${f(x + 5)} ${f(y)}`, C.celesteClaro, 1.5) + trazo(`M${f(x - 4)} ${f(y + 1.6)} l-1.6 2 M${f(x)} ${f(y + 3)} l0 2.4 M${f(x + 4)} ${f(y + 1.6)} l1.6 2`, C.celesteClaro, 0.8, 0.9)).join('') +
    trazo(`M${a[0] - 6} ${a[1] - 6} L${a[0] + 4} ${a[1] - 9}`, C.celesteClaro, 1.4, 0.9) + trazo(`M${b[0] - 4} ${b[1] - 9} L${b[0] + 6} ${b[1] - 6}`, C.celesteClaro, 1.4, 0.9) +
    // Las mandíbulas: dos pinzas chicas, curvas, que salen de abajo de la cabeza y se cruzan en la punta.
    trazo(`M${A.boca[0] + 6} ${A.boca[1] - 5} Q${A.boca[0] - 6} ${A.boca[1] - 9} ${A.boca[0] - 12} ${A.boca[1] - 6}`, C.negro, 3.2) + trazo(`M${A.boca[0] + 6} ${A.boca[1] + 5} Q${A.boca[0] - 6} ${A.boca[1] + 9} ${A.boca[0] - 12} ${A.boca[1] + 6}`, C.negro, 3.2) +
    trazo(`M${A.boca[0] + 4} ${A.boca[1] - 6} Q${A.boca[0] - 5} ${A.boca[1] - 9} ${A.boca[0] - 11} ${A.boca[1] - 6}`, C.azulClaro, 0.8, 0.8) + trazo(`M${A.boca[0] + 4} ${A.boca[1] + 6} Q${A.boca[0] - 5} ${A.boca[1] + 9} ${A.boca[0] - 11} ${A.boca[1] + 6}`, C.azulClaro, 0.8, 0.8) +
    // La boca, una o chiquita y abierta de dormida.
    forma(elipse(A.boca[0] + 4, A.boca[1] + 1, 3, 3.6), C.azulHondo) + forma(elipse(A.boca[0] + 4, A.boca[1] + 1.6, 1.8, 2.4), C.negro) +
    // El gorro de dormir, caído para atrás, con el pompón.
    enmascarado('m-hormiga-gorro', gorro, forma(gorro, C.naranja) + nube(cx - 6, cy - 16, 8, 3, C.naranjaClaro, 'xs', 0.9) + nube(cx + 4, cy - 14, 6, 3, C.naranjaHondo, 'xs', 0.8)) +
    trazo(`M${cx - 13} ${cy - 14} Q${cx - 20} ${cy - 10} ${cx - 24} ${cy - 2}`, C.naranja, 5) + forma(circulo(cx - 25, cy - 1, 3.4), C.naranjaClaro) + forma(circulo(cx - 26, cy - 2, 1.4), C.celesteClaro, 0.8) +
    trazo(`M${cx - 13} ${cy - 14} Q${cx + 2} ${cy - 22} ${cx + 10} ${cy - 15}`, C.naranjaClaro, 1.6, 0.8),
  );
}

/** Los ojos abiertos de golpe: el blanco celeste, la pupila chica del susto, las cejas arriba. */
function ojos(): string {
  return conGrano(
    A.ojos.map(([x, y]) => forma(circulo(x, y, A.radioOjo + 1.4), C.negro, 0.85) + forma(circulo(x, y, A.radioOjo), C.celesteClaro) + forma(circulo(x - 0.4, y + 0.4, 2.2), C.negro) + forma(circulo(x - 1.2, y - 0.6, 0.8), C.celesteClaro)).join('') +
    trazo(`M${A.ojos[0]![0] - 6} ${A.ojos[0]![1] - 9} Q${A.ojos[0]![0]} ${A.ojos[0]![1] - 13} ${A.ojos[0]![0] + 5} ${A.ojos[0]![1] - 9}`, C.celesteClaro, 1.4, 0.95) + trazo(`M${A.ojos[1]![0] - 5} ${A.ojos[1]![1] - 9} Q${A.ojos[1]![0]} ${A.ojos[1]![1] - 13} ${A.ojos[1]![0] + 6} ${A.ojos[1]![1] - 9}`, C.celesteClaro, 1.4, 0.95),
  );
}

/** Una antena con codo: sale de la cabeza, sube recta, se dobla en el codo y baja caída, con una maza chiquita en la punta. */
function antena(i: 0 | 1): string {
  const [x, y] = A.antenas[i]!;
  const [ex, ey, tx, ty] = i ? [x - 2, y - 28, x - 20, y - 18] : [x - 12, y - 24, x - 34, y - 12];
  return conGrano(
    trazo(`M${x} ${y} L${f(ex)} ${f(ey)}`, C.negro, 2.8) + trazo(`M${f(ex)} ${f(ey)} L${f(tx)} ${f(ty)}`, C.negro, 2) + forma(circulo(ex, ey, 2.2), C.azulHondo) +
    trazo(`M${x - 0.6} ${y - 2} L${f(ex - 0.4)} ${f(ey + 2)}`, C.azulClaro, 0.7, 0.7) + forma(elipse(tx, ty, 2.6, 1.8), C.azulHondo),
  );
}

/** La burbuja del ronquido, soplada de la boca hacia el costado: grande, celeste, transparente, con el brillo, sin tapar los ojos. */
function burbuja(): string {
  const [bx, by] = A.boca;
  const [cx, cy, r] = [bx - 21, by - 1, 12];
  return (
    forma(circulo(cx, cy, r), C.celeste, 0.38) + nube(cx + 3, cy + 4, 7, 5, C.celesteClaro, 'xs', 0.45) + trazo(circulo(cx, cy, r), C.celesteClaro, 1.3, 0.95) +
    // El brillo: la media luna de arriba a la izquierda y el punto.
    trazo(`M${f(cx - 8)} ${f(cy - 3)} Q${f(cx - 7)} ${f(cy - 8)} ${f(cx - 2)} ${f(cy - 9)}`, C.celesteClaro, 2, 0.95) + forma(circulo(cx - 5, cy + 5, 1.2), C.celesteClaro, 0.9) +
    // La película que la une a la boca.
    trazo(`M${f(bx - 2)} ${f(by - 1)} Q${f(bx - 5)} ${f(by)} ${f(cx + r - 1)} ${f(cy)}`, C.celesteClaro, 1.1, 0.8)
  );
}

/** Las zetas del sueño: tres, cada una más grande, subiendo para la derecha. */
function zetas(): string {
  const zeta = (x: number, y: number, s: number): string => trazo(`M${f(x)} ${f(y)} h${f(s)} l${f(-s)} ${f(s)} h${f(s)}`, C.celesteClaro, 2.2 + s * 0.08);
  const [zx, zy] = A.zzz;
  return zeta(zx - 8, zy, 6) + zeta(zx, zy - 9, 8) + zeta(zx + 10, zy - 20, 10);
}

/** La gota fría del susto, en la frente. */
function gota(): string {
  const [gx, gy] = A.gota;
  return forma(`M${gx} ${gy - 6} Q${gx + 4.4} ${gy} ${gx} ${gy + 3.6} Q${gx - 4.4} ${gy} ${gx} ${gy - 6} Z`, C.celesteClaro, 0.95) + trazo(`M${gx - 1.4} ${gy - 1} q0 2 1.2 2.6`, C.celeste, 0.9, 0.9);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const [CX, CY] = A.cabeza;

export const PIEZAS_HORMIGA: readonly Pieza[] = [
  { nombre: 'hormiga-fondo', caja: [-134, -74, 276, 82], dibujo: fondo(), densidad: D * 1.6 },
  { nombre: 'hormiga-camisa', caja: [A.camisa[0] - 28, A.camisa[1] - 12, 56, 52], dibujo: camisa(), densidad: D * 2 },
  { nombre: 'hormiga-patas-2', caja: [-66, -88, 118, 68], dibujo: patas2(), densidad: D * 1.8 },
  { nombre: 'hormiga-cuerpo', caja: [-34, -42, 104, 46], dibujo: tronco(), densidad: D * 1.8 },
  { nombre: 'hormiga-patas-1', caja: [-52, -86, 92, 60], dibujo: patas1(), densidad: D * 1.8 },
  { nombre: 'hormiga-cabeza', caja: [CX - 34, CY - 32, 62, 56], dibujo: cabeza(), densidad: D * 2.6 },
  { nombre: 'hormiga-ojos', caja: [A.ojos[0]![0] - 10, A.ojos[1]![1] - 14, 34, 28], dibujo: ojos(), densidad: D * 3 },
  { nombre: 'hormiga-antena-1', caja: [-100, -62, 54, 40], dibujo: antena(0), densidad: D * 2.6 },
  { nombre: 'hormiga-antena-2', caja: [-80, -70, 40, 44], dibujo: antena(1), densidad: D * 2.6 },
  { nombre: 'hormiga-burbuja', caja: [A.boca[0] - 38, A.boca[1] - 15, 42, 30], dibujo: burbuja(), densidad: D * 3 },
  { nombre: 'hormiga-zzz', caja: [A.zzz[0] - 12, A.zzz[1] - 32, 34, 40], dibujo: zetas(), densidad: D * 2.4 },
  { nombre: 'hormiga-gota', caja: [A.gota[0] - 6, A.gota[1] - 8, 12, 14], dibujo: gota(), densidad: D * 4 },
];

const img = imagenesDe(PIEZAS_HORMIGA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La hormiga armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('hormiga-fondo') +
    parte('camisa', img('hormiga-camisa'), t.camisa) +
    parte(
      'cuerpo',
      parte('patas-2', img('hormiga-patas-2'), t['patas-2']) +
        parte('tronco', img('hormiga-cuerpo'), t.tronco) +
        parte('patas-1', img('hormiga-patas-1'), t['patas-1']) +
        parte(
          'cabeza',
          parte('antena-2', img('hormiga-antena-2'), t['antena-2']) +
            parte('antena-1', img('hormiga-antena-1'), t['antena-1']) +
            img('hormiga-cabeza') +
            parte('ojos', img('hormiga-ojos'), '', o.ojos) +
            parte('burbuja', img('hormiga-burbuja'), t.burbuja, o.burbuja),
          t.cabeza,
        ),
      t.cuerpo,
    ) +
    parte('zzz', img('hormiga-zzz'), t.zzz, o.zzz) +
    parte('gota', img('hormiga-gota'), t.gota, o.gota)
  );
}

/** La hormiga en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export const hormigaEn = (m: Momento = QUIETO): string => `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;

/** El títere que se toca, en la pose quieta: panza arriba, dormida. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--hormiga" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'La hormiga dormida'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: despierta de golpe y bailando de espaldas, sobre la mesa. */
export const RETRATO = { caja: [HORMIGA.x - 78, HORMIGA.piso - 44, 156, 52] as const };
function retrato(): string {
  return `<image href="/bestiario/mesa-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/><image href="/bestiario/mesa-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` + hormigaEn(BAILA);
}

export const HORMIGA_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-mesa',
  ancla: HORMIGA.x,
  piezas: PIEZAS_HORMIGA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
