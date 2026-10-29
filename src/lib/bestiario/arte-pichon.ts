/**
 * El pichón (`D-73`, vigesimoquinta vuelta), en el alféizar de la ventana enrejada de la prisión.
 *
 * *"Practicamos tiro al pichón"* es de *Preso en mi ciudad*, en *Oktubre* (1986). Los que practican están de
 * este lado, en el pasillo; él está del otro lado de la reja, en el alféizar, y siempre zafa. Es un pichón de
 * paloma de ciudad de los feos: el plumón crudo le asoma entre las plumas nuevas, tiene las comisuras amarillas
 * de pichón, los ojos grandes de susto, una pata vendada y una pluma que le falta en el ala. En el alféizar
 * tiene una lata vacía con agujeros de tiros, un casquillo entre las migas y una pizarrita donde lleva la cuenta
 * con palitos de tiza: cada tiro que esquiva, un palito. Al lado, un blanco dibujado en tiza y tachado.
 *
 * Viste *Oktubre*, medido con sharp: los grises son los del pelo del Indio de la contratapa, el cuello
 * tornasolado es el gris verdoso y el morado que tiene el escaneo de la gente de la tapa, el plumón y las
 * comisuras son la carne de esas caras, la pizarra y la piedra son el negro de la xilografía, y la etiqueta de
 * la lata, las patas y el fogonazo, el rojo de las banderas.
 *
 * Coordenadas: el (0, 0) es el alféizar entre las patas, y mira a la izquierda (`rig-pichon.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { PICHON, PICHON_ARMADO as A, PLUMAS, QUIETO, marcas, type Momento } from './rig-pichon.ts';

/** Las tintas de *Oktubre* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-pichon-negro)',
  pizarra: 'var(--bestia-pichon-pizarra)',
  sombra: 'var(--bestia-pichon-sombra)',
  grisHondo: 'var(--bestia-pichon-gris-hondo)',
  gris: 'var(--bestia-pichon-gris)',
  grisClaro: 'var(--bestia-pichon-gris-claro)',
  perla: 'var(--bestia-pichon-perla)',
  papel: 'var(--bestia-pichon-papel)',
  comisura: 'var(--bestia-pichon-comisura)',
  comisuraHonda: 'var(--bestia-pichon-comisura-honda)',
  plumon: 'var(--bestia-pichon-plumon)',
  plumonHondo: 'var(--bestia-pichon-plumon-hondo)',
  bronce: 'var(--bestia-pichon-bronce)',
  tornasol: 'var(--bestia-pichon-tornasol)',
  tornasolLila: 'var(--bestia-pichon-tornasol-lila)',
  rojo: 'var(--bestia-pichon-rojo)',
  rojoHondo: 'var(--bestia-pichon-rojo-hondo)',
};

/** Un azar fijo, para que las migas y los pelos del plumón caigan siempre en el mismo lugar. */
function semilla(n: number): () => number {
  let a = n;
  return () => {
    a = (a * 16807) % 2147483647;
    return (a - 1) / 2147483646;
  };
}

/* ------------------------------------------------------------------
   El alféizar: la piedra de arriba, el canto de adelante y lo que hay encima
   ------------------------------------------------------------------ */

/** De punta a punta del hueco de la ventana (`PRISION.ventana`, de 322 a 578), en las coordenadas del pichón. */
const [X0, X1] = [(322 - PICHON.x) / PICHON.escala, (578 - PICHON.x) / PICHON.escala];
/** La jamba de piedra de la derecha (de 578 a 592), en las coordenadas del pichón. */
const JAMBA = [(578 - PICHON.x) / PICHON.escala, (592 - PICHON.x) / PICHON.escala] as const;

/** Un agujero de bala en la piedra: el cráter descascarado, el hueco negro y las rajaduras. */
function agujero(x: number, y: number, r: number, k = 0): string {
  const rajas = [0, 1, 2, 3, 4].map((i) => {
    const a = k + i * 1.31 + (i % 2) * 0.4;
    const l = r * (2 + (i % 3) * 0.7);
    return `M${x + Math.cos(a) * r * 0.9} ${y + Math.sin(a) * r * 0.9} l${Math.cos(a) * l * 0.6} ${Math.sin(a) * l * 0.6} l${Math.cos(a + 0.5) * l * 0.4} ${Math.sin(a + 0.5) * l * 0.4}`;
  }).join(' ');
  return (
    nube(x, y, r * 1.8, r * 1.6, C.grisHondo, 'xs', 0.8) +
    forma(curva([0, 1, 2, 3, 4, 5, 6].map((i): P => {
      const a = (i / 7) * Math.PI * 2 + k;
      const rr = r * (1.35 + 0.3 * Math.sin(i * 2.7 + k));
      return [x + Math.cos(a) * rr, y + Math.sin(a) * rr];
    })), C.gris) +
    nube(x - r * 0.5, y - r * 0.6, r * 0.8, r * 0.5, C.perla, 'xs', 0.7) +
    trazo(rajas, C.grisHondo, Math.max(0.4, r * 0.18), 0.85) +
    forma(elipse(x, y, r * 0.8, r * 0.75), C.negro) + nube(x + r * 0.2, y + r * 0.2, r * 0.4, r * 0.4, C.sombra, 'xs', 0.6)
  );
}

/** La piedra de arriba del alféizar, con las migas, el polvo de tiza y el casquillo tirado. */
function alfeizar(): string {
  const azar = semilla(7);
  const migas = Array.from({ length: 30 }, () => {
    const x = -100 + azar() * 132;
    const y = -4.6 + azar() * 6;
    const r = 0.5 + azar() * 1.1;
    return forma(elipse(x, y, r * 1.2, r * 0.8), azar() < 0.3 ? C.papel : C.plumonHondo, 0.9);
  }).join('');
  const [cx, cy] = [20, -2];
  const casquillo =
    `<g transform="rotate(-14 ${cx} ${cy})">` +
    forma(cajaRedonda(cx - 4, cy - 1.6, 8, 3.2, 0.8), C.bronce) + nube(cx, cy - 0.8, 3.6, 0.6, C.perla, 'xs', 0.8) + nube(cx + 1, cy + 1, 3.6, 0.6, C.plumonHondo, 'xs', 0.9) +
    trazo(`M${cx + 2.6} ${cy - 1.6} L${cx + 2.6} ${cy + 1.6}`, C.plumonHondo, 0.5) + forma(elipse(cx - 4, cy, 0.7, 1.6), C.sombra) + `</g>`;
  return conGrano(
    forma(`M${X0} -5.2 L${X1} -5.2 L${X1} 3 L${X0} 3 Z`, C.negro) +
    // Lo de arriba de la piedra le agarra la luz del foco; lo de adelante se va a lo hondo.
    nube(-50, -5, 110, 1.6, C.grisHondo, 's', 0.7) + nube(-60, -3, 26, 1.4, C.gris, 's', 0.35) + nube(-120, -3, 20, 1.4, C.gris, 's', 0.3) + nube(-50, 2, 110, 1.4, C.sombra, 's', 0.8) +
    trazo('M-80 -4 l8 2 l6 -1 M-12 -4 l10 2 M8 -5 l4 3 l7 1 M-130 -4 l12 2 l10 -1', C.sombra, 0.6, 0.8) +
    // El polvo de tiza debajo de la pizarrita.
    nube(-40, -2, 12, 2, C.papel, 's', 0.18) +
    migas + casquillo,
  );
}

/** El canto del alféizar, que va delante de las patas: la piedra gastada, con dos tiros viejos. */
function canto(): string {
  const d = `M${X0} 1 L${X1} 1 L${X1} ${A.pie} L${X0} ${A.pie} Z`;
  return conGrano(
    enmascarado('m-pichon-canto', d,
      forma(d, C.negro) + nube(-50, 2.4, 110, 1.4, C.grisHondo, 's', 0.75) + nube(-50, 6, 110, 1.4, C.sombra, 's', 0.6) +
      trazo('M-90 4 l14 1 l10 -1 M-40 5 l12 -1 l6 1 M10 3 l6 2 l10 1 M-130 4 l12 -1', C.sombra, 0.6, 0.9) +
      agujero(-64, 3.4, 1.5, 0.5) + agujero(30, 3.6, 1.4, 2.1) + agujero(-104, 3.2, 1.5, 1.3) + agujero(-130, 3.6, 1.4, 3.6)) +
    // El filo de la piedra, comido, que brilla con el foco.
    trazo(`M${X0} 1.4 L-120 1.5 L-116 2.6 L-112 1.4 L-70 1.6 L-66 2.6 L-62 1.5 L-8 1.4 L-4 2.4 L0 1.4 L${X1} 1.6`, C.gris, 0.9, 0.85),
  );
}

/** La lata vacía, con la etiqueta roja rota y tres agujeros de tiros. */
function lata(): string {
  const [lx] = A.lata;
  const [x0, x1] = [lx - 7, lx + 7];
  const cuerpo = cajaRedonda(x0, -19, 14, 19, 1.4);
  const tiro = (x: number, y: number): string =>
    forma(poli([[x - 1.6, y], [x - 0.6, y - 1.4], [x, y - 2.2], [x + 0.7, y - 1.3], [x + 1.8, y - 0.4], [x + 1, y + 0.8], [x + 0.2, y + 1.8], [x - 0.9, y + 1.2]]), C.perla) +
    forma(elipse(x, y, 0.9, 0.9), C.negro);
  return conGrano(
    enmascarado('m-pichon-lata', cuerpo,
      forma(cuerpo, C.gris) +
      // La etiqueta, roja, rota abajo a la derecha, y el metal que asoma.
      forma(`M${x0} -15 L${x1} -15 L${x1} -9 L${x1 - 3} -6 L${x1 - 5} -8 L${x1 - 8} -5 L${x0} -5 Z`, C.rojo) +
      nube(x1 - 1, -10, 3, 6, C.rojoHondo, 's', 0.9) + nube(x0 + 3, -11, 1.4, 4, C.papel, 'xs', 0.25) +
      // El metal: la luz del foco a la izquierda y lo hondo a la derecha.
      nube(x0 + 2.5, -10, 1.6, 10, C.perla, 's', 0.6) + nube(x1, -10, 2.6, 12, C.sombra, 's', 0.7) +
      trazo(`M${x0} -15 L${x1} -15 M${x0} -5 L${x1 - 8} -5`, C.rojoHondo, 0.4, 0.7) +
      // Una abolladura.
      nube(lx - 1, -2, 3, 1.4, C.grisHondo, 'xs', 0.8)) +
    // La boca abierta de arriba y el borde de abajo.
    forma(elipse(lx, -19, 7, 1.7), C.grisClaro) + forma(elipse(lx, -18.8, 6, 1.2), C.sombra) +
    trazo(`M${x0 + 0.4} -0.6 L${x1 - 0.4} -0.6`, C.grisHondo, 0.7) +
    tiro(lx - 2.5, -11) + tiro(lx + 3, -3.5) + tiro(lx - 3.5, -16.5),
  );
}

/** La pizarrita de la cuenta: un pedazo de pizarra de techo, con los palitos de tiza y un blanco tachado. */
function pizarra(): string {
  const [px] = A.pizarra;
  const d = poli([[px - 12, -1], [px - 12, -21], [px + 7, -22], [px + 12, -18], [px + 12, -1]]);
  const palito = (x: number, y: number, giro: number, i: number): string =>
    `<g transform="rotate(${giro} ${x} ${y})">${trazo(`M${x} ${y - 2.6} l${0.3 * ((i % 3) - 1)} 2.6 l${-0.2 * (i % 2)} 2.6`, C.papel, 0.8, 0.85)}</g>`;
  const tanda = (x: number, y: number, k: number): string =>
    [0, 1, 2, 3].map((i) => palito(x + i * 2, y, (i % 2 ? -3 : 3) + k, i + k)).join('') + palito(x + 3, y, 62 + k, 5);
  return conGrano(
    nube(px, 0, 13, 1.6, C.negro, 's', 0.9) +
    enmascarado('m-pichon-pizarra', d,
      forma(d, C.pizarra) + nube(px - 4, -16, 10, 5, C.grisHondo, 'm', 0.6) + nube(px + 6, -4, 8, 4, C.sombra, 'm', 0.8) +
      // Lo borrado con la pata: el polvo de tiza que no se va.
      nube(px - 2, -9, 9, 3, C.papel, 's', 0.12) + nube(px + 4, -14, 5, 2, C.papel, 's', 0.1) +
      tanda(px - 9, -16, 0) + tanda(px + 1, -16, 2) +
      // El blanco, dibujado en tiza y tachado.
      trazo(`M${px + 8} -7 m-3.2 0 a3.2 3.2 0 1 0 6.4 0 a3.2 3.2 0 1 0 -6.4 0 M${px + 8} -7 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0`, C.papel, 0.5, 0.7) +
      trazo(`M${px + 4.6} -10.4 L${px + 11.4} -3.6 M${px + 11.4} -10.4 L${px + 4.6} -3.6`, C.papel, 0.6, 0.8)) +
    // El borde de la pizarra, astillado, y la piedrita que la sostiene.
    trazo(`M${px - 12} -21 L${px + 7} -22 L${px + 12} -18`, C.gris, 0.6, 0.7) + forma(elipse(px + 13, -1, 2, 1.4), C.grisHondo),
  );
}

/** Un palito de tiza nuevo, el de un tiro que esquivó. */
function rayita(): string {
  return conGrano(trazo('M0 -2.8 l0.3 2.8 l-0.25 2.8', C.papel, 0.9, 0.9) + nube(0, 0, 0.6, 2.6, C.papel, 'xs', 0.3));
}

/* ------------------------------------------------------------------
   El pichón
   ------------------------------------------------------------------ */

/** Un mechón de plumón crudo: tres o cuatro pelos que salen de un punto y se enrulan. */
function mechon(x: number, y: number, ang: number, largo: number, n: number, color = C.plumon): string {
  return Array.from({ length: n }, (_, i) => {
    const a = ang + (i - (n - 1) / 2) * 0.35;
    const l = largo * (0.7 + 0.3 * ((i * 7) % 3) / 2);
    const [ex, ey] = [x + Math.cos(a) * l, y + Math.sin(a) * l];
    const [qx, qy] = [x + Math.cos(a + 0.4) * l * 0.6, y + Math.sin(a + 0.4) * l * 0.6];
    return trazo(`M${x} ${y} Q${qx} ${qy} ${ex} ${ey}`, color, 0.55, 0.85);
  }).join('');
}

const LOMO: readonly P[] = [[-16, -20], [-13, -28], [-4, -32], [8, -31], [20, -26], [30, -19], [34, -14], [28, -9], [16, -5], [2, -5], [-10, -9], [-15, -14]];

/** El cuerpo: el pecho gris, la panza clara, el lomo hondo, las plumas nuevas en cañón y el plumón que asoma. */
function cuerpo(): string {
  const d = curva(LOMO);
  // Las plumas nuevas del pecho, en escamitas, y los cañones de las que todavía no abrieron.
  const escamas = [[-8, -18], [-4, -14], [-10, -13], [0, -10], [-6, -9], [4, -15], [8, -10]].map(([x, y]) => trazo(`M${x! - 2} ${y} q2 2.4 4 0`, C.grisHondo, 0.5, 0.45)).join('');
  const canones = [[4, -6], [8, -7], [12, -6], [-2, -7]].map(([x, y]) => trazo(`M${x} ${y} l-0.6 3`, C.sombra, 0.9, 0.8) + forma(elipse(x! - 0.7, y! + 3.4, 0.6, 0.7), C.plumon)).join('');
  return conGrano(
    enmascarado('m-pichon-cuerpo', d,
      forma(d, C.gris) +
      nube(16, -27, 18, 6, C.grisHondo, 'm', 0.9) + nube(0, -10, 13, 5, C.grisClaro, 'm', 0.8) +
      // El pecho tornasolado, verde abajo y morado arriba, como el de las palomas grandes, pero apagado.
      nube(-12, -21, 5, 7, C.tornasol, 's', 0.85) + nube(-9, -27, 6, 3.4, C.tornasolLila, 's', 0.7) +
      nube(14, -5, 20, 4, C.sombra, 'm', 0.9) + nube(-4, -30, 7, 2.2, C.perla, 's', 0.45) +
      // El plumón crudo que todavía le cubre la panza a manchas.
      nube(4, -8, 6, 3, C.plumon, 's', 0.45) + nube(-6, -12, 3, 2, C.plumon, 's', 0.4) +
      escamas + canones) +
    // Lo desparejo: mechones que le salen por todos lados entre las plumas nuevas.
    mechon(6, -31, -1.8, 4.6, 4) + mechon(14, -29, -1.5, 4, 3) + mechon(24, -23, -1.1, 4, 3) + mechon(-2, -6, 1.8, 3.4, 3) +
    mechon(12, -5, 1.4, 3.6, 4) + mechon(31, -16, -0.4, 3, 3, C.plumonHondo) + mechon(-14, -16, 3.1, 2.6, 3),
  );
}

/** El plumón esponjado: lo que se le para cuando se infla del frío o del susto. */
function plumon(): string {
  const azar = semilla(19);
  const pelos = LOMO.flatMap(([x, y], i): string[] => {
    const [cx, cy] = A.panza;
    const a = Math.atan2(y - cy, x - cx);
    return [0, 1].map((k) => mechon(x + Math.cos(a) * 1.4, y + Math.sin(a) * 1.4, a + (azar() - 0.5) * 0.6, 4 + azar() * 3 + k, 3, (i + k) % 3 ? C.plumon : C.grisClaro));
  });
  return conGrano(nube(8, -18, 18, 10, C.plumon, 's', 0.22) + nube(10, -26, 12, 4, C.grisClaro, 's', 0.3) + pelos.join(''));
}

/** El ala plegada, con las dos franjas negras de paloma y el hueco de la pluma que le falta. */
function ala(): string {
  // El borde de atrás tiene un diente: la pluma que le volaron.
  const d = curva([[-2, -26], [6, -30], [18, -27], [30, -19], [35, -13], [29, -12], [27, -15], [24, -12], [14, -13], [3, -18]]);
  const remeras = [0, 1, 2, 3].map((i) => trazo(`M${16 + i * 3} ${-24 + i * 2} L${33 - i * 1.2} ${-14 + i * 0.3}`, C.sombra, 0.6, 0.6)).join('');
  return conGrano(
    enmascarado('m-pichon-ala', d,
      forma(d, C.gris) + nube(4, -26, 8, 4, C.grisClaro, 's', 0.8) + nube(22, -15, 10, 4, C.grisHondo, 'm', 0.9) +
      // Las dos franjas de las coberteras.
      trazo('M8 -28 Q12 -22 10 -16', C.sombra, 2, 0.9) + trazo('M14 -28 Q18 -22 16 -14', C.sombra, 1.8, 0.85) +
      nube(30, -15, 6, 3, C.sombra, 's', 0.8) + remeras) +
    // La pluma nueva que crece en el hueco: un cañón con la punta abierta.
    trazo('M22 -16 L27 -13.6', C.sombra, 1, 0.9) + mechon(27, -13.4, 0.4, 2, 3, C.gris) +
    mechon(2, -27, -2.3, 3, 3),
  );
}

/** Las dos alas abiertas del salto, para arriba, con la de la derecha mellada. */
function alas(): string {
  const [sx, sy] = A.hombro;
  const una = (lado: -1 | 1, id: string): string => {
    const dedos = [0, 1, 2, 3, 4, 5].map((i): P[] => {
      const a = (lado < 0 ? -2.15 : -1.0) + lado * i * 0.14;
      const l = 40 - i * 3.6;
      const [bx, by] = [sx + lado * 10, sy - 30];
      const [ex, ey] = [bx + Math.cos(a) * l * 0.6, by + Math.sin(a) * l * 0.6];
      return [[ex, ey]];
    }).flat();
    const pts: P[] = [[sx, sy + 2], [sx + lado * 4, sy - 16], [sx + lado * 10, sy - 30], dedos[0]!, dedos[1]!, dedos[2]!, ...(lado > 0 ? [[sx + lado * 18, sy - 38] as P] : []), dedos[3]!, dedos[4]!, dedos[5]!, [sx + lado * 22, sy - 20], [sx + lado * 12, sy - 6]];
    const d = poli(pts);
    return enmascarado(id, d,
      forma(d, C.gris) + nube(sx + lado * 8, sy - 18, 8, 10, C.grisClaro, 'm', 0.8) +
      trazo(`M${sx + lado * 5} ${sy - 24} L${sx + lado * 16} ${sy - 12}`, C.sombra, 2, 0.85) + trazo(`M${sx + lado * 8} ${sy - 30} L${sx + lado * 20} ${sy - 18}`, C.sombra, 1.8, 0.8) +
      nube(dedos[2]![0], dedos[2]![1], 10, 8, C.grisHondo, 'm', 0.9) +
      dedos.map(([x, y]) => trazo(`M${sx + lado * 10} ${sy - 30} L${x} ${y}`, C.sombra, 0.5, 0.5)).join(''));
  };
  return conGrano(una(-1, 'm-pichon-ala-izquierda') + una(1, 'm-pichon-ala-derecha') + mechon(sx, sy - 2, -1.6, 4, 4));
}

/** La cola corta de pichón, con la franja negra de la punta. */
function cola(): string {
  const d = curva([[24, -20], [33, -19], [38, -16], [37, -11], [30, -10], [24, -13]]);
  return conGrano(
    enmascarado('m-pichon-cola', d, forma(d, C.grisHondo) + nube(36, -14, 3, 5, C.sombra, 's', 0.95) + nube(28, -18, 4, 2, C.gris, 's', 0.7) +
      trazo('M26 -15 L37 -15 M26 -13 L36 -12', C.sombra, 0.5, 0.6)) +
    mechon(30, -10.6, 1.6, 2.6, 3, C.plumonHondo),
  );
}

/** Una pata: el muslo emplumado, el tarso rojo con escamas y los dedos para adelante. La 2 va vendada. */
function pata(n: 0 | 1): string {
  const [hx, hy] = A.caderas[n];
  const [fx, fy] = A.pies[n];
  const tinta = n ? C.rojo : C.rojoHondo;
  const dedos = [[-7, 0.6], [-6.4, -0.6], [-5, 1.2]].map(([dx, dy]) => trazo(`M${fx} ${fy - 0.4} l${dx! * 0.6} ${dy! * 0.4} l${dx! * 0.4} ${dy! * 0.6 + 0.4}`, tinta, 1.3) + forma(elipse(fx + dx!, fy + dy! + 0.4, 0.5, 0.4), C.sombra)).join('') +
    trazo(`M${fx} ${fy - 0.4} l2.6 0.6`, tinta, 1.1);
  const escamas = [0.25, 0.45, 0.65].map((t) => trazo(`M${hx + (fx - hx) * t - 1} ${hy + (fy - hy) * t} l2 0.2`, C.rojoHondo, 0.4, 0.8)).join('');
  // La venda: una tira de trapo enrollada en el tarso, sucia, con el nudo y las dos puntas sueltas.
  const venda = n
    ? forma(poli([[fx - 2.2, -9.4], [fx + 2.4, -9.8], [fx + 2.2, -3.4], [fx - 2, -3]]), C.papel) +
      trazo(`M${fx - 2} -8 l4.2 -0.6 M${fx - 2} -6.2 l4.2 -0.8 M${fx - 2} -4.4 l4.2 -0.6`, C.perla, 0.5, 0.9) +
      nube(fx + 1, -5, 1.4, 1.6, C.plumonHondo, 'xs', 0.8) + nube(fx - 1.4, -8, 1, 1, C.comisuraHonda, 'xs', 0.6) +
      forma(elipse(fx + 2.6, -7, 1, 0.9), C.perla) +
      trazo(`M${fx + 3} -7 q2.6 -0.6 3.6 1.8 M${fx + 3} -6.8 q2 1.4 1.8 4`, C.papel, 0.7, 0.95)
    : '';
  return conGrano(
    nube(hx, hy + 1, 2.6, 2.4, C.grisHondo, 'xs', 0.9) +
    trazo(`M${hx} ${hy} L${fx} ${fy - 0.6}`, C.rojoHondo, 1.9) + trazo(`M${hx - 0.4} ${hy + 1} L${fx - 0.4} ${fy - 1}`, tinta, 0.8, 0.9) + escamas + dedos + venda,
  );
}

/** La cabeza: el cuello tornasolado, el ojo grande del susto, el pico blando y el plumón de pichón parado. */
function cabeza(): string {
  const cuello = curva([[-11, -31], [-4, -31], [3, -27], [5, -20], [-3, -17], [-12, -21]]);
  const craneo = elipse(-5, -36, 8.4, 7.8);
  const [ex, ey] = A.ojo;
  const pico = curva([[-12, -38.4], [-17, -36.2], [-22, -32.6], [-20, -32], [-16, -32.6], [-12, -33.4]]);
  const abajo = curva([[-12.4, -33], [-17, -32.2], [-20.6, -31.6], [-17, -30.6], [-12.4, -31]]);
  return conGrano(
    enmascarado('m-pichon-cuello', cuello,
      forma(cuello, C.gris) + nube(-8, -24, 5, 5, C.tornasol, 's', 0.9) + nube(0, -27, 5, 4, C.tornasolLila, 's', 0.85) +
      nube(-2, -20, 4, 3, C.grisHondo, 's', 0.7) + nube(-10, -28, 2, 4, C.perla, 'xs', 0.4)) +
    enmascarado('m-pichon-craneo', craneo,
      forma(craneo, C.gris) + nube(-7, -41, 6, 3.4, C.grisClaro, 's', 0.85) + nube(-1, -31, 6, 4, C.grisHondo, 'm', 0.85) +
      nube(-9, -30, 4, 2, C.tornasol, 's', 0.6) + nube(0, -38, 3, 4, C.plumon, 's', 0.35)) +
    // El pico: largo y blando de pichón, con la cera, y las comisuras amarillas hinchadas.
    enmascarado('m-pichon-pico', pico, forma(pico, C.grisClaro) + nube(-16, -36, 4, 1.6, C.perla, 'xs', 0.8) + nube(-21, -33, 2, 1.4, C.sombra, 'xs', 0.9)) +
    enmascarado('m-pichon-mandibula', abajo, forma(abajo, C.gris) + nube(-19, -31.4, 2, 1, C.sombra, 'xs', 0.8)) +
    forma(elipse(-12.6, -37.8, 2, 1.3), C.perla) + nube(-12.4, -37.2, 1.6, 0.6, C.grisClaro, 'xs', 0.8) +
    forma(elipse(-12.4, -32.6, 2.2, 1.7), C.comisura) + nube(-11.8, -31.8, 1.4, 0.8, C.comisuraHonda, 'xs', 0.9) +
    trazo('M-12.6 -33 L-19 -32.2', C.sombra, 0.45, 0.8) +
    // El ojo: grande, oscuro, con el anillo de piel pelada y los brillos del susto.
    forma(elipse(ex, ey, 4, 3.8), C.perla) + forma(elipse(ex, ey, 3.2, 3.1), C.negro) +
    nube(ex + 0.6, ey + 0.8, 1.6, 1.4, C.tornasolLila, 'xs', 0.5) +
    forma(elipse(ex - 1, ey - 1.1, 1.1, 1), C.papel) + forma(elipse(ex + 1.1, ey + 1, 0.4, 0.4), C.papel, 0.8) +
    // El plumón de la cabeza, parado como pelo de recién levantado.
    mechon(-7, -43, -1.9, 5.4, 4) + mechon(-2, -42.4, -1.3, 4.6, 3) + mechon(1.6, -38, -0.5, 4, 3) + mechon(-10.6, -41, -2.5, 3.4, 3) +
    mechon(2.4, -30, 0.2, 3, 3, C.plumonHondo),
  );
}

/** El párpado: la piel gris que sube desde abajo, como en las palomas. */
function parpado(): string {
  const [ex, ey] = A.ojo;
  return conGrano(forma(elipse(ex, ey, 4.1, 3.9), C.grisClaro) + nube(ex, ey + 2, 3.6, 2, C.gris, 'xs', 0.8) + trazo(`M${ex - 3.4} ${ey - 0.6} Q${ex} ${ey - 2.2} ${ex + 3.4} ${ey - 0.6}`, C.sombra, 0.6, 0.9));
}

/* ------------------------------------------------------------------
   Lo de adelante de la reja: los tiros
   ------------------------------------------------------------------ */

/** La jamba de piedra a la derecha de la ventana, con los tiros viejos que le erraron. */
function jamba(): string {
  return conGrano(agujero(46, -40, 1.8, 0.3) + agujero(47, -67, 1.6, 1.7) + agujero(45, -94, 1.8, 3.1) + agujero(46, -12, 1.5, 4.4) +
    trazo('M44 -46 l-2 -4 M48 -72 l1 -5', C.grisHondo, 0.5, 0.7));
}

function agujeroNuevo(): string {
  return conGrano(agujero(0, 0, 2, 1.2));
}

/** Las esquirlas que salta la bala de la piedra, con el polvo. */
function esquirlas(): string {
  const piedras = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const a = i * 0.79 + 0.3;
    const r = 7 + (i % 3) * 3;
    const [x, y] = [Math.cos(a) * r, Math.sin(a) * r];
    return forma(poli([[x - 1, y - 0.4], [x + 0.2, y - 1.2], [x + 1, y + 0.2], [x - 0.2, y + 1]]), i % 2 ? C.grisClaro : C.perla);
  }).join('');
  return conGrano(nube(0, 0, 7, 6, C.grisClaro, 's', 0.6) + nube(2, -3, 4, 3, C.perla, 's', 0.5) + piedras);
}

/** El fogonazo, desde abajo, del lado de quien mira: un destello y nada más, ni arma ni nadie. */
function fogonazo(): string {
  const estrella = (r0: number, r1: number, n: number, giro: number): string =>
    poli(Array.from({ length: n * 2 }, (_, i): P => {
      const a = (i / (n * 2)) * Math.PI * 2 + giro;
      const r = i % 2 ? r1 : r0 * (0.75 + 0.25 * Math.sin(i * 3.1));
      return [Math.cos(a) * r, Math.sin(a) * r];
    }));
  return nube(0, 0, 22, 19, C.rojo, 'm', 0.45) + forma(estrella(34, 7, 7, -0.3), C.rojo, 0.85) +
    forma(estrella(22, 5, 7, -0.05), C.comisura) + nube(0, 0, 9, 8, C.papel, 's') + forma(elipse(0, 0, 5, 4.4), C.papel) +
    trazo('M8 -10 l7 -9 M-12 -6 l-9 -4 M2 12 l2 9', C.papel, 0.8, 0.8);
}

/** Una pluma del ala que le vuela el tiro. */
function pluma(): string {
  const d = curva([[0, -9], [2.4, -4], [2.2, 3], [0.6, 8], [-0.6, 8], [-2.2, 3], [-2.4, -4]]);
  return conGrano(enmascarado('m-pichon-pluma', d, forma(d, C.gris) + nube(0, -6, 3, 3, C.sombra, 's', 0.8) + nube(-1, 2, 1.4, 4, C.grisClaro, 'xs', 0.7)) +
    trazo('M0 -8 L0.2 9.4', C.perla, 0.5, 0.9) + mechon(0.2, 7, 1.6, 2.4, 4));
}

/** Un copo de plumón que se suelta. */
function copo(): string {
  return conGrano(nube(0, 0, 2, 2, C.plumon, 'xs', 0.6) + [0, 1, 2, 3, 4, 5].map((i) => mechon(0, 0, i * 1.05, 3.6, 2)).join(''));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [EX, EY] = A.ojo;

export const PIEZAS_PICHON: readonly Pieza[] = [
  { nombre: 'pichon-alfeizar', caja: [X0, -8, X1 - X0, 12], dibujo: alfeizar(), densidad: D },
  { nombre: 'pichon-lata', caja: [A.lata[0] - 10, -23, 20, 25], dibujo: lata(), densidad: D * 1.4 },
  { nombre: 'pichon-pizarra', caja: [A.pizarra[0] - 14, -25, 30, 28], dibujo: pizarra(), densidad: D * 1.6 },
  { nombre: 'pichon-rayita', caja: [-1.6, -3.8, 3.2, 7.6], dibujo: rayita(), densidad: D * 3 },
  { nombre: 'pichon-pata-1', caja: [-2, -16, 18, 19], dibujo: pata(0), densidad: D * 1.4 },
  { nombre: 'pichon-alas', caja: [-34, -76, 72, 64], dibujo: alas(), densidad: D },
  { nombre: 'pichon-cola', caja: [21, -24, 17, 18], dibujo: cola(), densidad: D * 1.4 },
  { nombre: 'pichon-cuerpo', caja: [-20, -38, 56, 37], dibujo: cuerpo(), densidad: D * 1.3 },
  { nombre: 'pichon-plumon', caja: [-26, -44, 64, 46], dibujo: plumon(), densidad: D },
  { nombre: 'pichon-ala', caja: [-6, -34, 44, 26], dibujo: ala(), densidad: D * 1.3 },
  { nombre: 'pichon-cabeza', caja: [-26, -52, 34, 37], dibujo: cabeza(), densidad: D * 1.6 },
  { nombre: 'pichon-parpado', caja: [EX - 5, EY - 5, 10, 10], dibujo: parpado(), densidad: D * 2.4 },
  { nombre: 'pichon-pata-2', caja: [-12, -16, 22, 19], dibujo: pata(1), densidad: D * 1.4 },
  { nombre: 'pichon-canto', caja: [X0, -1, X1 - X0, A.pie + 1], dibujo: canto(), densidad: D },
  { nombre: 'pichon-jamba', caja: [JAMBA[0], -116, JAMBA[1] - JAMBA[0], 114], dibujo: jamba(), densidad: D },
  { nombre: 'pichon-agujero', caja: [-7, -7, 14, 14], dibujo: agujeroNuevo(), densidad: D * 2 },
  { nombre: 'pichon-esquirlas', caja: [-17, -17, 34, 34], dibujo: esquirlas(), densidad: D },
  { nombre: 'pichon-fogonazo', caja: [-46, -46, 92, 92], dibujo: fogonazo(), densidad: D * 0.8 },
  { nombre: 'pichon-pluma', caja: [-4, -10, 8, 22], dibujo: pluma(), densidad: D * 2 },
  { nombre: 'pichon-copo', caja: [-7, -7, 14, 14], dibujo: copo(), densidad: D * 2 },
];

const img = imagenesDe(PIEZAS_PICHON);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;
const en = ([x, y]: readonly [number, number], s: string, giro = 0): string => `<g transform="translate(${x} ${y})${giro ? ` rotate(${giro})` : ''}">${s}</g>`;

/**
 * El pichón armado con las marcas de un momento, con lo que tiene en el alféizar. Lo que baja del canto no se
 * ve: el recorte va con un nombre propio por cada uso, para que el títere y el retrato no se pisen el id.
 */
function armado(m: Momento, recorte: string): string {
  const { transform: t, opacity: o } = marcas(m);
  const rayitas = A.rayitas.map(([x, y, g], i) => parte(`rayita-${i + 1}`, en([x, y], img('pichon-rayita'), g), '', o[`rayita-${i + 1}`])).join('');
  return (
    `<clipPath id="${recorte}"><rect x="-120" y="-200" width="240" height="${200 + A.canto}"/></clipPath>` +
    img('pichon-alfeizar') +
    img('pichon-lata') +
    `<g transform="rotate(-4 ${A.pizarra[0]} 0)">${img('pichon-pizarra')}${rayitas}</g>` +
    `<g clip-path="url(#${recorte})">` +
    parte('pichon',
      parte('pata-1', img('pichon-pata-1'), t['pata-1']) +
      parte('cuerpo',
        parte('alas', img('pichon-alas'), t.alas, o.alas) +
        parte('cola', img('pichon-cola'), t.cola) +
        parte('bulto', img('pichon-cuerpo') + parte('plumon', img('pichon-plumon'), t.plumon, o.plumon), t.bulto) +
        parte('ala', img('pichon-ala'), t.ala, o.ala) +
        parte('cabeza', img('pichon-cabeza') + parte('parpado', img('pichon-parpado'), '', o.parpado), t.cabeza),
        t.cuerpo) +
      parte('pata-2', img('pichon-pata-2'), t['pata-2']),
      t.pichon) +
    `</g>` +
    img('pichon-canto')
  );
}

/** Lo de adelante de la reja: los tiros viejos de la jamba, los agujeros nuevos, las esquirlas, el fogonazo y las plumas. */
function delante(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('pichon-jamba') +
    A.agujeros.map((p, i) => parte(`agujero-${i + 1}`, en(p, img('pichon-agujero')), '', o[`agujero-${i + 1}`])).join('') +
    parte('esquirlas', img('pichon-esquirlas'), t.esquirlas, o.esquirlas) +
    parte('fogonazo', img('pichon-fogonazo'), t.fogonazo, o.fogonazo) +
    PLUMAS.map((_, i) => parte(`pluma-${i + 1}`, img(i < 3 ? 'pichon-pluma' : 'pichon-copo'), t[`pluma-${i + 1}`], o[`pluma-${i + 1}`])).join('')
  );
}

/** El pichón en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function pichonEn(m: Momento = QUIETO, recorte = 'pichon-canto-mirar'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, recorte)}</g>`;
}

/** Lo de adelante de la reja en un momento, sin lo que lo envuelve en la escena: para el retrato y para mirarlo. */
export function delanteEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${delante(m)}</g>`;
}

/** Un rectángulo sin tinta, del tamaño del pichón con su lata: es chico, y así se lo toca igual. */
const TOQUE = `<rect x="-76" y="-54" width="114" height="58" fill="transparent"/>`;

/** El títere que se toca, en la pose quieta: parado en el alféizar, detrás de los barrotes. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--pichon" data-id="el-pichon" role="button" tabindex="0" aria-label="${nombres.get('el-pichon') ?? 'El pichón'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${TOQUE}${armado(QUIETO, 'pichon-canto-recorte')}</g>` +
    `</g>`
  );
}

/** Lo que va delante de la reja: no se toca, el toque es del pichón. */
function adelante(): string {
  return `<g class="pichon-tiros" pointer-events="none"><g data-parte="delante" transform="${marcas(QUIETO).transform.delante}">${delante(QUIETO)}</g></g>`;
}

/** El retrato de la ficha: en el alféizar, esponjado, con la reja delante y los tiros en la piedra. */
const RETRATO_MOMENTO: Momento = { ...QUIETO, esponja: 0.5, cabeza: 4, agujeros: 3, rayitas: 3 };
export const RETRATO = { caja: [PICHON.x - 103, PICHON.piso - 80, 184, 94] as const };
function retrato(): string {
  return `<image href="/bestiario/prision-lejos.webp" x="-250" y="0" width="1400" height="640" preserveAspectRatio="none"/>` +
    pichonEn(RETRATO_MOMENTO, 'pichon-canto-retrato') +
    // La reja, en su caja de `arte-prision.ts`: del arco al alféizar.
    `<image href="/bestiario/prision-reja.webp" x="300" y="90" width="300" height="266" preserveAspectRatio="none"/>` +
    delanteEn(RETRATO_MOMENTO);
}

export const PICHON_PERSONAJE: Personaje = {
  id: 'el-pichon',
  region: 'la-prision',
  ancla: PICHON.x,
  piezas: PIEZAS_PICHON,
  capas: { atras: titere, figura: adelante },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
