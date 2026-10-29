/**
 * La anguila (`D-73`, vigesimotercera vuelta), medio hundida en el barro del rincón del bajo que da al fuego.
 *
 * *"El tipo maduró pronto y se pudrió bien temprano. Un barro que asfixia esa anguila es la salvajada"* es de
 * *Cruz Diablo*, en *Luzbelito* (1996). La anguila es el tipo de la letra: boquea en lo espeso y no puede
 * salir. De la letra salen también los moretones del lomo (*"demasiados los moretones, muy pocos
 * encantamientos"*), la boca que traga mal (*"su boca arde en maldiciones que se tragan mal"*) y los
 * centavos hundidos en el barro (*"nunca fue un listo de pesos, siempre un listo de centavos"*), con una
 * ficha de las que no supo repartir. Del dibujo son el ojito redondo de pescado asustado, el pegote de barro
 * en la cabeza y las narinas de tubo de las anguilas de verdad.
 *
 * Viste la tapa de *Luzbelito*, medida con sharp: la piel es el mármol verde de la tapa, con sus vetas
 * claras; la panza, la cera del busto en la sombra; el ojo es el blanco de la vela con el iris de cobre del
 * marco, y el barro es el óxido de ese marco, de lo hondo a lo que brilla. El fuego del rincón le pega en el
 * barro con la llama de la vela.
 *
 * Coordenadas: el (0, 0) es la superficie del barro en el medio del charco, y la cabeza mira a la izquierda
 * (`rig-anguila.ts`). Cada segmento se dibuja en las suyas: la coyuntura en el cero y el segmento para la
 * derecha; la cabeza, con la nuca en el cero y el hocico para la izquierda.
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { ANGUILA, ANGUILA_ARMADO as A, BURBUJAS, CHARCO, GOTEAN, LARGO, N, QUIETO, SUPERFICIE, TOCADA, alRecinto, grueso, marcas, type Momento } from './rig-anguila.ts';

/** Las tintas de *Luzbelito* (`tokens.css`). */
const C = {
  verde: 'var(--bestia-anguila-verde)',
  verdeHondo: 'var(--bestia-anguila-verde-hondo)',
  negro: 'var(--bestia-anguila-negro)',
  veta: 'var(--bestia-anguila-veta)',
  vetaClara: 'var(--bestia-anguila-veta-clara)',
  vientre: 'var(--bestia-anguila-vientre)',
  vientreClaro: 'var(--bestia-anguila-vientre-claro)',
  cobre: 'var(--bestia-anguila-cobre)',
  cobreClaro: 'var(--bestia-anguila-cobre-claro)',
  oxido: 'var(--bestia-anguila-oxido)',
  oxidoHondo: 'var(--bestia-anguila-oxido-hondo)',
  barro: 'var(--bestia-anguila-barro)',
  barroClaro: 'var(--bestia-anguila-barro-claro)',
  barroHondo: 'var(--bestia-anguila-barro-hondo)',
  pozo: 'var(--bestia-anguila-pozo)',
  moreton: 'var(--bestia-anguila-moreton)',
  llama: 'var(--bestia-anguila-llama)',
  llamaClara: 'var(--bestia-anguila-llama-clara)',
  ojo: 'var(--bestia-anguila-ojo)',
};

/** Un azar con semilla, para que las vetas del mármol salgan iguales en cada impresión. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a * 16807) % 2147483647;
    return (a - 1) / 2147483646;
  };
}

/* ------------------------------------------------------------------
   El cuerpo: doce segmentos de mármol verde, con la panza de cera
   ------------------------------------------------------------------ */

/** La silueta de un segmento: un tubo que se afina, con las puntas redondas para que la coyuntura no se abra. */
function tubo(a: number, b: number): string {
  return `M0 ${f(-a)} L${LARGO} ${f(-b)} A${f(b)} ${f(b)} 0 0 1 ${LARGO} ${f(b)} L0 ${f(a)} A${f(a)} ${f(a)} 0 0 1 0 ${f(-a)} Z`;
}

/** Los moretones: en qué segmentos le quedaron. */
const MORETONES: Readonly<Record<number, readonly [number, number]>> = { 1: [8, -4], 4: [14, -6], 5: [4, -2], 8: [12, -3] };
/** Los segmentos con barro pegado en la panza. */
const EMBARRADOS = new Set([2, 3, 6, 7, 9, 10]);

function segmento(i: number): string {
  const a = grueso(i) / 2;
  const b = grueso(i + 1) / 2;
  const d = tubo(a, b);
  const rnd = azar(311 + i * 17);
  // Las vetas del mármol de la tapa: rayas que serpentean a lo largo, claras y finas.
  let vetas = '';
  for (let k = 0; k < 3; k++) {
    const y0 = (rnd() - 0.6) * a * 1.2;
    const y1 = y0 + (rnd() - 0.5) * a * 0.8;
    vetas += trazo(`M${f(-a)} ${f(y0)} C${f(LARGO * 0.3)} ${f(y0 - a * 0.5 * rnd())} ${f(LARGO * 0.6)} ${f(y1 + a * 0.4)} ${f(LARGO + b)} ${f(y1)}`, k ? C.veta : C.vetaClara, 0.6 + rnd() * 0.7, 0.55 + 0.3 * rnd());
  }
  const manchas = [0, 1].map((k) => nube(rnd() * LARGO, -a * (0.2 + 0.4 * rnd()), 4 + 4 * rnd(), 2 + 2 * rnd(), k ? C.negro : C.verdeHondo, 's', 0.7)).join('');
  const moreton = MORETONES[i] ? nube(MORETONES[i]![0], MORETONES[i]![1] * (a / 15), a * 0.7, a * 0.5, C.moreton, 'm', 0.75) + nube(MORETONES[i]![0], MORETONES[i]![1] * (a / 15), a * 0.3, a * 0.22, C.oxidoHondo, 's', 0.5) : '';
  const embarrado = EMBARRADOS.has(i) ? nube(LARGO * 0.5, a * 0.9, LARGO * 0.6, a * 0.4, C.barro, 's', 0.85) + nube(LARGO * 0.3, a * 0.7, 4, 2, C.barroClaro, 'xs', 0.8) : '';
  // La aleta del lomo, que en las anguilas corre de la nuca a la cola: una franja fina, apenas más clara.
  const lomo = i > 1 ? forma(`M${f(-a * 0.4)} ${f(-a - 0.5)} Q${f(LARGO / 2)} ${f(-(a + b) / 2 - 4)} ${f(LARGO + b * 0.4)} ${f(-b - 0.5)} L${f(LARGO + b * 0.4)} ${f(-b + 1)} L${f(-a * 0.4)} ${f(-a + 1)} Z`, C.verdeHondo, 0.9) + trazo(`M${f(-a * 0.4)} ${f(-a - 0.5)} Q${f(LARGO / 2)} ${f(-(a + b) / 2 - 4)} ${f(LARGO + b * 0.4)} ${f(-b - 0.5)}`, C.veta, 0.6, 0.6) : '';
  // La punta de la cola: la aleta se cierra en un pincel.
  const punta = i === N - 1 ? (() => {
    const c = `M${LARGO - 4} ${f(-b - 1)} Q${LARGO + 12} ${f(-b - 2)} ${LARGO + 22} 0 Q${LARGO + 12} ${f(b + 2)} ${LARGO - 4} ${f(b + 1)} Z`;
    return enmascarado('m-anguila-cola', c, forma(c, C.verdeHondo) + trazo(`M${LARGO} 0 L${LARGO + 20} 0`, C.veta, 0.5, 0.7) + nube(LARGO + 6, 2, 8, 2, C.vientre, 's', 0.4));
  })() : '';
  return conGrano(
    lomo + punta +
    enmascarado(`m-anguila-seg-${i}`, d,
      forma(d, C.verde) +
      // El lomo hondo arriba, la panza de cera abajo, y el brillo húmedo en la curva.
      nube(LARGO / 2, -a, LARGO, a * 0.7, C.negro, 'm', 0.75) +
      nube(LARGO / 2, a * 0.85, LARGO * 0.9, a * 0.45, C.vientre, 'm', 0.95) +
      nube(LARGO / 2, a * 0.75, LARGO * 0.5, a * 0.15, C.vientreClaro, 's', 0.35) +
      manchas + vetas +
      nube(LARGO / 2, -a * 0.45, LARGO * 0.55, a * 0.1, C.vetaClara, 's', 0.6) +
      moreton + embarrado),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el ojito asustado, la boca que traga mal, la agalla
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[6, -15], [-14, -17], [-32, -14], [-48, -9], [-60, -3], [-65, 2], [-60, 6], [-40, 6], [-24, 7], [-14, 13], [2, 15], [8, 0]];

function cabeza(): string {
  const d = curva(CRANEO);
  const [ox, oy] = A.ojo;
  const rnd = azar(907);
  const vetas = [0, 1, 2].map((k) => trazo(`M6 ${-10 + k * 5} C-14 ${-14 + k * 6 + rnd() * 4} -30 ${-6 + k * 4} -56 ${-2 + k * 2}`, k ? C.veta : C.vetaClara, 0.7, 0.55)).join('');
  return conGrano(
    enmascarado('m-anguila-craneo', d,
      forma(d, C.verde) +
      nube(-20, -16, 34, 8, C.negro, 'm', 0.8) +
      nube(-30, 11, 30, 6, C.vientre, 'm', 0.95) + nube(-44, 7, 12, 2, C.vientreClaro, 's', 0.4) +
      vetas +
      // El moretón debajo del ojo, y el barro que se le secó en la nuca.
      nube(ox + 6, oy + 8, 7, 4, C.moreton, 'm', 0.7) +
      nube(0, -12, 12, 5, C.barro, 's', 0.8) + nube(-4, -14, 4, 2, C.barroClaro, 'xs', 0.8) +
      // La hendija de la agalla, roja de óxido: se ve cuando la tapa se abre.
      forma(curva([[-14, -9], [-9, 1], [-14, 11], [-12, 1]]), C.oxidoHondo) + nube(-12, 1, 2, 8, C.oxido, 's', 0.9) +
      // La cuenca honda, alrededor del ojo.
      nube(ox, oy, 10, 9, C.negro, 's', 0.7)) +
    // El ojito redondo de pescado asustado: todo blanco de vela, con el iris de cobre chico en el medio.
    forma(elipse(ox, oy, 6.6, 6.6), C.ojo) +
    enmascarado('m-anguila-ojo', elipse(ox, oy, 6.6, 6.6), nube(ox + 2, oy + 3, 6, 4, C.veta, 's', 0.6)) +
    forma(elipse(ox, oy, 3.6, 3.6), C.cobre) + trazo(`M${ox - 3.4} ${oy} A3.4 3.4 0 0 1 ${ox + 3.4} ${oy}`, C.oxido, 0.9, 0.8) +
    trazo(`M${ox - 7} ${oy - 7.4} Q${ox} ${oy - 10} ${ox + 7} ${oy - 7.4}`, C.negro, 1.2, 0.8) +
    // Las narinas de tubo de la punta del hocico, y la línea de la boca.
    forma(`M-58 -4 L-62 -9 L-60 -10 L-55 -5 Z`, C.verdeHondo) + forma(elipse(-61, -9.6, 1.2, 0.9), C.pozo) +
    trazo('M-64 4 Q-44 7 -24 7', C.pozo, 1.4) +
    // Los poros de la línea lateral, que siguen por el cuerpo.
    [0, 1, 2, 3].map((k) => forma(elipse(-6 - k * 7, -2 + k * 0.4, 0.8, 0.8), C.vetaClara, 0.8)).join(''),
  );
}

/** Lo de adentro de la boca: el pozo negro, las encías de óxido y los dientitos de arriba. */
function boca(): string {
  const d = curva([[-22, 5], [-62, 5], [-56, 14], [-38, 18], [-20, 12]]);
  const dientes = [-56, -50, -44, -38, -32].map((x) => forma(poli([[x, 5.5], [x + 3, 5.5], [x + 1.5, 9]]), C.vientre)).join('');
  return conGrano(enmascarado('m-anguila-boca', d, forma(d, C.pozo) + nube(-40, 18, 10, 5, C.oxidoHondo, 's', 0.9) + nube(-30, 8, 8, 3, C.oxido, 's', 0.7)) + dientes);
}

/** La quijada de abajo, que boquea: la bisagra atrás, debajo del ojo. */
function quijada(): string {
  const d = curva([[-22, 5], [-40, 6.5], [-58, 6.5], [-61, 8.5], [-50, 12.5], [-32, 14], [-20, 11]]);
  return conGrano(enmascarado('m-anguila-quijada', d, forma(d, C.vientre) + nube(-40, 6, 20, 2, C.verdeHondo, 's', 0.9) + nube(-36, 13, 14, 2, C.barro, 's', 0.6) + nube(-50, 10, 6, 1.4, C.vientreClaro, 'xs', 0.5)) +
    trazo('M-60 7 Q-42 8 -24 7', C.pozo, 0.9, 0.9));
}

/** La tapa de la agalla, que late. */
function agalla(): string {
  const d = curva([[-13, -10], [-6, -6], [-4, 2], [-7, 10], [-13, 12], [-10, 1]]);
  return conGrano(enmascarado('m-anguila-agalla', d, forma(d, C.verde) + nube(-8, -4, 4, 6, C.negro, 's', 0.6) + nube(-8, 8, 4, 4, C.vientre, 's', 0.8)) + trazo('M-13 -10 Q-4 -4 -5 2 Q-6 8 -13 12', C.vetaClara, 0.7, 0.8));
}

/** La aleta del pecho, abierta en abanico. */
function aleta(): string {
  const [ax, ay] = A.aleta;
  const d = curva([[ax, ay - 3], [ax + 12, ay - 2], [ax + 18, ay + 6], [ax + 12, ay + 10], [ax + 2, ay + 4]]);
  const radios = [0, 1, 2, 3].map((k) => trazo(`M${ax + 1} ${ay} L${ax + 16 - k * 2} ${ay - 1 + k * 3.4}`, C.veta, 0.5, 0.8)).join('');
  return conGrano(enmascarado('m-anguila-aleta', d, forma(d, C.verdeHondo, 0.92) + nube(ax + 10, ay + 4, 6, 4, C.vientre, 's', 0.5) + radios));
}

/** La pupila, que no para quieta. */
function pupila(): string {
  const [ox, oy] = A.ojo;
  return forma(elipse(ox, oy, 2, 2), C.pozo) + forma(elipse(ox - 0.8, oy - 0.9, 0.8, 0.8), C.ojo);
}

/** El pegote de barro que se le queda en la cabeza, con su gota a punto de caer. */
function pegote(): string {
  const [px, py] = A.pegote;
  const d = curva([[px - 9, py + 4], [px - 6, py - 3], [px + 1, py - 5], [px + 8, py - 2], [px + 10, py + 4], [px + 4, py + 6], [px + 3, py + 13], [px, py + 13], [px - 1, py + 6]]);
  return conGrano(enmascarado('m-anguila-pegote', d, forma(d, C.barro) + nube(px + 3, py + 4, 8, 4, C.barroHondo, 's', 0.8) + nube(px - 2, py - 2, 4, 1.6, C.cobreClaro, 'xs', 0.7)));
}

/* ------------------------------------------------------------------
   El barro: el charco, la costra, las burbujas y lo que salpica
   ------------------------------------------------------------------ */

/** Un centavo hundido de canto en el barro, sin cara ni número: cobre gastado. */
const centavo = (x: number, y: number, r: number, giro: number): string =>
  `<g transform="rotate(${giro} ${x} ${y})">` + forma(elipse(x, y, r, r * 0.42), C.oxido) + forma(elipse(x, y - 0.6, r * 0.8, r * 0.3), C.cobre) + nube(x - r * 0.3, y - 1, r * 0.3, 0.6, C.cobreClaro, 'xs', 0.9) + `</g>`;

/** La ficha de las que no supo repartir: el disco con las muescas del borde. */
function ficha(x: number, y: number): string {
  const muescas = [0, 1, 2, 3, 4, 5].map((k) => {
    const a = (k / 6) * Math.PI * 2;
    return forma(elipse(x + Math.cos(a) * 6.4, y + Math.sin(a) * 2.6, 1.2, 0.8), C.vientre);
  }).join('');
  return forma(elipse(x, y + 1, 8, 3.4), C.oxidoHondo) + forma(elipse(x, y, 8, 3.2), C.oxido) + muescas + forma(elipse(x, y, 3.6, 1.4), C.barroHondo);
}

function charco(): string {
  const { x, y, rx, ry } = CHARCO;
  const d = curva([[x - rx, y], [x - rx * 0.7, y - ry * 0.75], [x, y - ry * 0.95], [x + rx * 0.7, y - ry * 0.8], [x + rx, y + 2], [x + rx * 0.6, y + ry * 0.9], [x - rx * 0.2, y + ry], [x - rx * 0.8, y + ry * 0.7]]);
  const rnd = azar(53);
  // Los grumos y las vetas de lo espeso: rayas cortas de barro claro y de verde hondo, de costado.
  let grumos = '';
  for (let k = 0; k < 26; k++) {
    const gx = x - rx * 0.9 + rnd() * rx * 1.8;
    const gy = y - ry * 0.7 + rnd() * ry * 1.5;
    grumos += trazo(`M${f(gx)} ${f(gy)} q${f(6 + rnd() * 8)} ${f(-1 - rnd() * 2)} ${f(14 + rnd() * 16)} 0`, k % 3 ? C.barroClaro : C.verdeHondo, 0.9 + rnd(), 0.5 + rnd() * 0.3);
  }
  return conGrano(
    // El borde se pierde en el agua: lo espeso no tiene canto, se apaga en lo negro.
    nube(x, y, rx + 10, ry + 4, C.pozo, 'm', 0.75) +
    enmascarado('m-anguila-charco', d,
      forma(d, C.pozo) +
      nube(x - 20, y - 2, rx * 0.85, ry * 0.55, C.barroHondo, 'l', 0.95) +
      nube(x - 40, y - 6, rx * 0.6, ry * 0.3, C.barro, 'l', 0.7) +
      // Lo de atrás del charco se mezcla con el agua verde; lo de adelante, con lo negro de la sala.
      nube(x - rx * 0.6, y - ry * 0.6, rx * 0.5, 8, C.verdeHondo, 'm', 0.8) + nube(x, y + ry, rx, 10, C.pozo, 'm', 0.85) +
      nube(x - rx * 0.95, y, 30, ry, C.pozo, 'm', 0.8) + nube(x + rx * 0.95, y, 24, ry, C.pozo, 'm', 0.6) +
      grumos +
      // El fuego del rincón le pega en el barro mojado, del lado de la derecha.
      nube(x + rx * 0.7, y - 4, 50, 10, C.oxido, 'm', 0.6) + nube(x + rx * 0.75, y - 6, 26, 3, C.cobreClaro, 's', 0.5) +
      nube(x - 30, y - ry * 0.5, 50, 2, C.vetaClara, 's', 0.3)) +
    centavo(x - 120, y + 16, 7, -8) + centavo(x - 96, y + 20, 6, 12) + centavo(x + 70, y + 18, 7, -4) + centavo(x + 150, y + 10, 5, 20) +
    ficha(x + 20, y + 21) +
    trazo(`M${x - rx + 6} ${y + 1} Q${x - rx * 0.5} ${y - ry * 0.9} ${x + rx * 0.4} ${y - ry * 0.85}`, C.veta, 1, 0.4),
  );
}

/** La costra de la superficie: lo espeso que se cierra donde entra el cuerpo, con los bordes en grumo. */
function costra(): string {
  const rnd = azar(71);
  const arriba: P[] = [];
  for (let x = -250; x <= 176; x += 12) {
    // Las puntas se afinan: la costra se pierde en el barro, sin canto.
    const borde = Math.min(1, (x + 250) / 60, (176 - x) / 50);
    arriba.push([x, SUPERFICIE + 4 - borde * (6 + rnd() * 4)]);
  }
  const d = `M-252 ${SUPERFICIE + 5} ` + arriba.map(([x, y]) => `L${f(x)} ${f(y)}`).join(' ') + ` L178 ${SUPERFICIE + 5} Q-40 ${SUPERFICIE + 8} -252 ${SUPERFICIE + 5} Z`;
  return conGrano(enmascarado('m-anguila-costra', d, forma(d, C.barroHondo) + nube(-40, SUPERFICIE - 1, 200, 2, C.barro, 's', 0.9) + nube(-60, SUPERFICIE - 3, 140, 1, C.barroClaro, 'xs', 0.7) + nube(130, SUPERFICIE - 2, 36, 2, C.cobreClaro, 's', 0.4)));
}

/** El reflejo del fuego en el barro: luz, que se suma a lo oscuro. */
function brasa(): string {
  return nube(150, -6, 60, 16, C.oxido, 'l', 0.8) + nube(160, -4, 30, 8, C.llama, 'm', 0.7) + nube(168, -4, 10, 3, C.llamaClara, 's', 0.8);
}

/** Una burbuja del barro, de radio 10: la cúpula espesa que se infla, con la luz del fuego encima. */
function burbuja(): string {
  const d = 'M-10 0 A10 9 0 0 1 10 0 Z';
  return conGrano(enmascarado('m-anguila-burbuja', d, forma(d, C.barro) + nube(3, -2, 8, 5, C.barroHondo, 's', 0.8) + nube(-4, -6, 3.4, 1.6, C.cobreClaro, 'xs', 0.9) + nube(0, -1, 10, 1.2, C.vetaClara, 'xs', 0.3)));
}

/** Lo que salta cuando revienta: el anillo de gotitas de barro. */
function revienta(): string {
  return Array.from({ length: 9 }, (_, k) => {
    const a = Math.PI * (1.05 + (k / 8) * 0.9);
    const r = 9 + (k % 3) * 3;
    return forma(elipse(Math.cos(a) * r, Math.sin(a) * r * 0.9, 1.3 + (k % 2) * 0.6, 1.8), k % 3 ? C.barro : C.barroClaro);
  }).join('') + trazo('M-8 2 Q0 -4 8 2', C.barroHondo, 1.4, 0.8);
}

/** La burbuja grande de aire que se le escapa de la boca: el último aire, con la luz del fuego en el borde. */
function globo(): string {
  return nube(0, 0, 12, 12, C.pozo, 's', 0.45) + trazo('M-11 0 A11 11 0 1 1 11 0 A11 11 0 1 1 -11 0', C.vetaClara, 1, 0.75) +
    trazo('M-7 -7 A10 10 0 0 1 4 -10', C.ojo, 1.6, 0.8) + nube(5, 6, 3, 2, C.llama, 's', 0.7) + nube(-3, 4, 6, 3, C.barro, 's', 0.4);
}

/** El reventón de la burbuja grande: el aire que se va, en rayitas y gotas. */
function plop(): string {
  return Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * Math.PI * 2 + 0.2;
    return trazo(`M${f(Math.cos(a) * 12)} ${f(Math.sin(a) * 12)} L${f(Math.cos(a) * (19 + (k % 3) * 3))} ${f(Math.sin(a) * (19 + (k % 3) * 3))}`, k % 2 ? C.vetaClara : C.llama, 1.6, 0.9);
  }).join('') + [[-6, 14], [8, 16], [0, 20]].map(([x, y]) => forma(elipse(x!, y!, 1.2, 1.8), C.barro)).join('');
}

/** Una gota de barro que chorrea del cuerpo. */
function gota(): string {
  return conGrano(forma('M0 -1 C2 3 2.4 7 0 9 C-2.4 7 -2 3 0 -1 Z', C.barro) + nube(-0.6, 5, 0.8, 1.6, C.cobreClaro, 'xs', 0.7));
}

/** La salpicadura de barro donde sale y donde entra: una corona espesa. */
function salpica(): string {
  const d = 'M-26 2 Q-22 -10 -18 -14 L-15 -6 Q-10 -24 -6 -30 L-3 -12 Q0 -34 4 -26 L5 -12 Q10 -26 14 -22 L13 -8 Q20 -16 24 -12 Q24 -4 26 2 Z';
  const gotas = [[-22, -22], [-8, -36], [10, -34], [22, -24]].map(([x, y]) => forma(elipse(x!, y!, 1.6, 2.2), C.barro)).join('');
  return conGrano(enmascarado('m-anguila-salpica', d, forma(d, C.barro) + nube(0, -4, 22, 6, C.barroHondo, 's', 0.8) + nube(-4, -20, 4, 8, C.barroClaro, 's', 0.7) + nube(16, -14, 4, 4, C.cobreClaro, 'xs', 0.5)) + gotas);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const cajaDeSegmento = (i: number): readonly [number, number, number, number] => {
  const a = grueso(i) / 2;
  const b = grueso(i + 1) / 2;
  const cola = i === N - 1 ? 24 : 0;
  return [-a - 2, -a - 6, LARGO + a + b + 4 + cola, 2 * a + 10];
};

export const PIEZAS_ANGUILA: readonly Pieza[] = [
  { nombre: 'anguila-charco', caja: [CHARCO.x - CHARCO.rx - 30, CHARCO.y - CHARCO.ry - 16, 2 * CHARCO.rx + 60, 2 * CHARCO.ry + 30], dibujo: charco(), densidad: 2.4 },
  { nombre: 'anguila-brasa', caja: [60, -50, 180, 90], dibujo: brasa(), densidad: 1.2 },
  ...Array.from({ length: N }, (_, i): Pieza => ({ nombre: `anguila-seg-${i + 1}`, caja: cajaDeSegmento(i), dibujo: segmento(i), densidad: D })),
  { nombre: 'anguila-boca', caja: [-66, 2, 50, 26], dibujo: boca(), densidad: D },
  { nombre: 'anguila-aleta', caja: [-8, 2, 28, 24], dibujo: aleta(), densidad: D },
  { nombre: 'anguila-cabeza', caja: [-70, -24, 82, 44], dibujo: cabeza(), densidad: D * 1.2 },
  { nombre: 'anguila-agalla', caja: [-16, -13, 15, 28], dibujo: agalla(), densidad: D * 1.2 },
  { nombre: 'anguila-pupila', caja: [-42, -12, 12, 12], dibujo: pupila(), densidad: D * 1.6 },
  { nombre: 'anguila-pegote', caja: [-44, -26, 28, 30], dibujo: pegote(), densidad: D },
  { nombre: 'anguila-quijada', caja: [-66, 2, 50, 16], dibujo: quijada(), densidad: D * 1.2 },
  { nombre: 'anguila-gota', caja: [-4, -2, 8, 13], dibujo: gota(), densidad: D },
  { nombre: 'anguila-salpica', caja: [-30, -40, 60, 44], dibujo: salpica(), densidad: D * 0.8 },
  { nombre: 'anguila-globo', caja: [-15, -15, 30, 30], dibujo: globo(), densidad: D },
  { nombre: 'anguila-plop', caja: [-26, -26, 52, 52], dibujo: plop(), densidad: D * 0.7 },
  { nombre: 'anguila-costra', caja: [-256, SUPERFICIE - 10, 438, 18], dibujo: costra(), densidad: 2.4 },
  { nombre: 'anguila-burbuja', caja: [-11, -11, 22, 12], dibujo: burbuja(), densidad: D },
  { nombre: 'anguila-revienta', caja: [-16, -16, 32, 24], dibujo: revienta(), densidad: D },
];

const img = imagenesDe(PIEZAS_ANGUILA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La anguila armada con las marcas de un momento. El barro corta todo lo que queda abajo de la superficie. */
function armado(m: Momento, sufijo: string): string {
  const { transform: t, opacity: o } = marcas(m);
  const corte = `anguila-barro${sufijo}`;
  const segmentos = Array.from({ length: N }, (_, k) => N - k).map((i) => parte(`seg-${i}`, img(`anguila-seg-${i}`), t[`seg-${i}`])).join('');
  const cabezaEntera = parte('cabeza',
    img('anguila-boca') + parte('aleta', img('anguila-aleta'), t.aleta) + img('anguila-cabeza') +
    parte('agalla', img('anguila-agalla'), t.agalla) + parte('pupila', img('anguila-pupila'), t.pupila) +
    parte('pegote', img('anguila-pegote'), t.pegote, o.pegote) + parte('quijada', img('anguila-quijada'), t.quijada),
    t.cabeza);
  const gotas = GOTEAN.map((_, j) => parte(`gota-${j + 1}`, img('anguila-gota'), t[`gota-${j + 1}`], o[`gota-${j + 1}`])).join('');
  const salpicas = [1, 2].map((j) => parte(`salpica-${j}`, img('anguila-salpica'), t[`salpica-${j}`], o[`salpica-${j}`])).join('');
  const burbujas = BURBUJAS.map((_, j) => parte(`burbuja-${j + 1}`, img('anguila-burbuja'), t[`burbuja-${j + 1}`], o[`burbuja-${j + 1}`]) + parte(`revienta-${j + 1}`, img('anguila-revienta'), t[`revienta-${j + 1}`], o[`revienta-${j + 1}`])).join('');
  return (
    img('anguila-charco') +
    parte('brasa', img('anguila-brasa'), '', o.brasa) +
    `<clipPath id="${corte}"><rect x="-600" y="-400" width="1200" height="${400 + SUPERFICIE}"/></clipPath>` +
    `<g clip-path="url(#${corte})">` + segmentos + cabezaEntera + gotas + salpicas +
    parte('globo', img('anguila-globo'), t.globo, o.globo) + parte('plop', img('anguila-plop'), t.plop, o.plop) +
    `</g>` +
    img('anguila-costra') + burbujas
  );
}

/** La anguila en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function anguilaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, '-r')}</g>`;
}

/** El títere que se toca, en la pose quieta: la cabeza afuera del barro, boqueando. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--anguila" data-id="la-anguila" role="button" tabindex="0" aria-label="${nombres.get('la-anguila') ?? 'La anguila'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, '')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el salto desesperado, en arco afuera del barro y chorreando. */
const [R0x, R0y] = alRecinto([-300, -110]);
export const RETRATO = { caja: [Math.round(R0x), Math.round(R0y), 200, 100] as const };
function retrato(): string {
  // La sala y el agua, en sus cajas de `arte-bajo.ts`.
  return `<image href="/bestiario/bajo-lejos.webp" x="-250" y="0" width="1450" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/bajo-agua.webp" x="-250" y="368" width="1450" height="272" preserveAspectRatio="none"/>` + anguilaEn(TOCADA);
}

export const ANGUILA_PERSONAJE: Personaje = {
  id: 'la-anguila',
  region: 'el-bajo',
  ancla: Math.round(ANGUILA.x + CHARCO.x * ANGUILA.escala),
  piezas: PIEZAS_ANGUILA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

