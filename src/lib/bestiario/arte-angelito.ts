/**
 * El angelito frito (`D-73`, vigesimoctava vuelta), caído al pie del árbol, del lado del galpón.
 *
 * *"Estás frito, angelito"* es de *Estás frito angelito*, en *Último bondi a Finisterre* (1998). Del mismo tema salen
 * *"tu naturaleza te quiere"* y *"vas a poner contacto"*; los buitres de la tele y los camellos prestigiosos son de otro
 * recinto y no están acá. Se toma al pie de la letra: está **frito** porque lo cruzó la corriente. Se agarró del enchufe
 * (*poner contacto*) y quedó sentado en el cráter con el cable todavía en la mano, el pelo parado, la cara tiznada, los
 * ojos en espiral, un diente menos, la aureola torcida como un caño caliente, el ruedo de la túnica quemado a puntas y las
 * alas hechas huesos y plumas negras que echan humo, con brasas. **Tu naturaleza te quiere**: del pasto quemado asoma un
 * brote que se le arrima al pie, y él lo patea sin ganas. Tocado, lo vuelve a cruzar la corriente: las chispas saltan del
 * enchufe, se le ven los huesos como en un dibujito, el pelo se le para del todo, las alas se abren de golpe y la
 * aureola sale volando y vuelve a caerle, torcida para el otro lado.
 *
 * De la letra son lo frito, el contacto, la naturaleza que lo quiere y lo chamuscado de la estampa (las alas humeando, la
 * caída del lado del galpón). Del dibujo son el cráter, el cable, las plumas quemadas y los huesos.
 *
 * Viste *Último bondi a Finisterre*, medido con sharp: la tapa es de chapa negra y plata y casi no tiene color. El hollín es
 * su negro, la ceniza y la túnica son el metal y el cromado, la aureola es el oro de las gafas, las brasas son el rojo de la
 * cabeza del frente, y el brote es su píxel más verde, oliva apagado, porque no tiene otro (`--bestia-angelito-*`).
 *
 * Coordenadas: el (0, 0) es la tierra debajo de la cadera; mira a la izquierda (`rig-angelito.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { ANGELITO, ANGELITO_ARMADO as A, FRITO, QUIETO, marcas, type Momento } from './rig-angelito.ts';

const ID = 'el-angelito-frito';

/** Las tintas de *Último bondi a Finisterre* (`tokens.css`). */
const C = {
  hollin: 'var(--bestia-angelito-hollin)',
  cenizaHonda: 'var(--bestia-angelito-ceniza-honda)',
  ceniza: 'var(--bestia-angelito-ceniza)',
  hueso: 'var(--bestia-angelito-hueso)',
  oro: 'var(--bestia-angelito-oro)',
  oroClaro: 'var(--bestia-angelito-oro-claro)',
  brasa: 'var(--bestia-angelito-brasa)',
  brasaClara: 'var(--bestia-angelito-brasa-clara)',
  brasaHonda: 'var(--bestia-angelito-brasa-honda)',
  piel: 'var(--bestia-angelito-piel)',
  pielClara: 'var(--bestia-angelito-piel-clara)',
  pielHonda: 'var(--bestia-angelito-piel-honda)',
  brote: 'var(--bestia-angelito-brote)',
  broteClaro: 'var(--bestia-angelito-brote-claro)',
};

const circulo = (x: number, y: number, r: number): string => elipse(x, y, r, r);

/** Un azar con semilla, propio. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------
   El suelo: el cráter, la raya de la caída, las plumas quemadas y el cable
   ------------------------------------------------------------------ */

/** Una pluma quemada tirada en la tierra: negra, con la punta todavía al rojo. */
function plumaCaida(x: number, y: number, g: number, largo: number): string {
  const d = `M${f(x)} ${f(y)} Q${f(x + largo * 0.5)} ${f(y - 3)} ${f(x + largo)} ${f(y)} Q${f(x + largo * 0.5)} ${f(y + 3)} ${f(x)} ${f(y)} Z`;
  return `<g transform="rotate(${g} ${f(x)} ${f(y)})">` + forma(d, C.cenizaHonda) + trazo(`M${f(x)} ${f(y)} L${f(x + largo)} ${f(y)}`, C.ceniza, 0.7, 0.9) + forma(circulo(x + largo, y, 1.4), C.brasa) + `</g>`;
}

function suelo(): string {
  const rnd = azar(28);
  let grietas = '';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rnd() * 0.4;
    const r0 = 36 + rnd() * 16;
    grietas += trazo(`M${f(-10 + Math.cos(a) * r0)} ${f(3 + Math.sin(a) * r0 * 0.16)} l${f(Math.cos(a) * (12 + rnd() * 16))} ${f(Math.sin(a) * 2.4)}`, C.hollin, 1.1, 0.8);
  }
  // El pasto quemado de alrededor: hebras negras, dobladas.
  let pasto = '';
  for (const x of [-170, -150, -128, -112, 52, 70, 88, 102]) pasto += trazo(`M${x} 2 q${f(2 + rnd() * 3)} ${f(-8 - rnd() * 6)} ${f(rnd() * 8 - 2)} ${f(-14 - rnd() * 6)}`, C.cenizaHonda, 1.1, 0.8);
  return conGrano(
    // La raya de la caída, que viene del galpón: tierra arrastrada y hollín.
    soplo('M-200 -3 C-160 -9 -110 -6 -64 -2 L-40 6 C-100 4 -160 4 -200 2 Z', C.hollin, 's', 0.8) +
    nube(-10, 3, 104, 14, C.hollin, 'm', 0.92) + nube(-10, 3, 66, 8, C.cenizaHonda, 's', 0.8) + nube(-10, 2, 40, 5, C.hollin, 's', 0.9) +
    grietas + pasto +
    // Las brasitas del cráter y las plumas quemadas.
    [[-60, 4], [-38, 7], [18, 6], [40, 4], [-20, 8], [60, 8]].map(([x, y]) => forma(circulo(x!, y!, 1.3), C.brasaClara, 0.9)).join('') +
    plumaCaida(-120, 2, -10, 16) + plumaCaida(-150, -2, 14, 14) + plumaCaida(56, 4, 170, 15) + plumaCaida(84, 0, -168, 12) +
    // El cable que viene del galpón, tirado por el suelo hasta la mano.
    trazo('M-204 -5 C-170 -2 -140 -9 -120 -5 C-108 -3 -98 -3 -92 -3', C.hollin, 5.2) + trazo('M-204 -6.6 C-170 -3.6 -140 -10.6 -120 -6.6 C-108 -4.6 -98 -4.6 -92 -4.6', C.ceniza, 1.1, 0.8) +
    // Los hilos pelados de la punta del cable que quedó sin enchufe, para el lado del galpón.
    trazo('M-204 -5 l-8 -3 M-204 -5 l-7 1 M-204 -5 l-6 5', C.brasaHonda, 1, 0.9),
  );
}

/* ------------------------------------------------------------------
   Las alas: hueso, algunas plumas negras, otras cortadas a la mitad
   ------------------------------------------------------------------ */

/**
 * Una pluma de verdad: el cañón al medio, las barbas a los dos lados, más anchas al medio y en punta. `estado` dice qué le pasó:
 * entera (con la punta carbonizada), cortada a la mitad (con la punta rota, negra y al rojo) o pelada hasta el cañón, con unas pocas
 * barbas que le quedaron cerca de la base.
 */
function pluma(ox: number, oy: number, grados: number, largo: number, ancho: number, estado: 'entera' | 'cortada' | 'pelada', rnd: () => number): string {
  const a = (grados * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-uy, ux];
  const p = (u: number, v: number): P => [ox + ux * largo * u + nx * v, oy + uy * largo * u + ny * v];
  const fin = estado === 'cortada' ? 0.62 + rnd() * 0.14 : 1;
  const ancho1 = (u: number): number => ancho * Math.sin(Math.PI * Math.min(1, 0.08 + u * 0.88)) ** 0.75;
  const cano = `M${f(ox)} ${f(oy)} L${f(p(fin, 0)[0])} ${f(p(fin, 0)[1])}`;
  if (estado === 'pelada') {
    // Solo el cañón, con dos o tres barbas chuecas cerca de la base y la punta todavía al rojo.
    let barbas = '';
    for (const u of [0.1, 0.2, 0.3]) {
      const [x, y] = p(u, 0);
      barbas += trazo(`M${f(x)} ${f(y)} l${f(nx * 5 + ux * 3)} ${f(ny * 5 + uy * 3)} M${f(x)} ${f(y)} l${f(-nx * 4 + ux * 3)} ${f(-ny * 4 + uy * 3)}`, C.ceniza, 1, 0.9);
    }
    const [tx, ty] = p(0.96, 0);
    return trazo(cano, C.hueso, 1.4) + barbas + forma(circulo(tx, ty, 1.6), C.brasaClara);
  }
  const izq: P[] = [];
  const der: P[] = [];
  for (let i = 0; i <= 10; i++) {
    const u = (i / 10) * fin;
    // Las barbas, con muescas: el borde de la pluma no es liso.
    const diente = i % 2 ? 1 : 0.78;
    izq.push(p(u, -ancho1(u) * diente));
    der.push(p(u, ancho1(u) * (i % 2 ? 0.8 : 1)));
  }
  const punta: P = estado === 'cortada' ? p(fin + 0.02, rnd() * 3 - 1.5) : p(1.04, 0);
  const contorno: P[] = [...izq, punta, ...der.reverse()];
  const d = poli(contorno);
  // El carbón: la punta negra y el borde cobre donde se quemó.
  const desde = estado === 'cortada' ? fin - 0.3 : 0.66;
  const [qx, qy] = p((desde + fin) / 2, 0);
  return (
    forma(d, C.ceniza) +
    enmascarado(`m-angelito-pluma-${Math.round(ox * 10)}-${Math.round(oy * 10)}-${Math.round(grados)}`, d, nube(p(0.25, 0)[0], p(0.25, 0)[1], largo * 0.2, ancho * 0.5, C.hueso, 'xs', 0.45) + nube(qx, qy, largo * 0.3, ancho * 1.3, C.hollin, 'xs', 0.95) + nube(p(fin, 0)[0], p(fin, 0)[1], ancho * 0.8, ancho * 0.9, C.brasaHonda, 'xs', 0.8)) +
    // Las barbas, marcadas, y el cañón.
    [0.2, 0.34, 0.48, 0.62].map((u) => trazo(`M${f(p(u * fin, 0)[0])} ${f(p(u * fin, 0)[1])} l${f(nx * ancho1(u) * 0.9 + ux * 3)} ${f(ny * ancho1(u) * 0.9 + uy * 3)} M${f(p(u * fin, 0)[0])} ${f(p(u * fin, 0)[1])} l${f(-nx * ancho1(u) * 0.9 + ux * 3)} ${f(-ny * ancho1(u) * 0.9 + uy * 3)}`, C.cenizaHonda, 0.7, 0.8)).join('') +
    trazo(cano, C.hueso, 1) + (estado === 'cortada' ? forma(circulo(p(fin, 0)[0], p(fin, 0)[1], 1.3), C.brasaClara) : '')
  );
}

/**
 * Un ala quemada, para arriba y hacia atrás (la derecha): el hueso del brazo y de ahí las plumas en abanico, las de la punta largas
 * y las de la base más cortas; algunas enteras con la punta carbonizada, otras cortadas a la mitad y otras peladas hasta el cañón.
 */
function ala(punta: P, semilla: number, grande: number): string {
  const rnd = azar(semilla);
  const [bx, by] = A.hombroAla;
  const [tx, ty] = punta;
  const codo: P = [bx + (tx - bx) * 0.4 + 10, by + (ty - by) * 0.4 - 4];
  const estados = ['entera', 'cortada', 'entera', 'pelada', 'cortada', 'entera', 'pelada', 'entera'] as const;
  let plumas = '';
  const n = 8;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const ox = codo[0] + (tx - codo[0]) * t;
    const oy = codo[1] + (ty - codo[1]) * t;
    const grados = 30 - t * 100 + (rnd() - 0.5) * 8;
    const largo = (30 + t * 16 + rnd() * 6) * grande;
    plumas += pluma(ox, oy, grados, largo, 5.4 * grande, estados[(i + semilla) % estados.length]!, rnd);
  }
  return conGrano(
    plumas +
    trazo(`M${bx} ${by} L${f(codo[0])} ${f(codo[1])} L${f(tx)} ${f(ty)}`, C.hollin, 4.6) + trazo(`M${bx} ${by} L${f(codo[0])} ${f(codo[1])} L${f(tx)} ${f(ty)}`, C.hueso, 1.3, 0.85) +
    forma(circulo(codo[0], codo[1], 2.8), C.hueso, 0.9) + forma(circulo(tx, ty, 2.2), C.hueso, 0.9),
  );
}

/** Las brasas de un ala: los puntos todavía al rojo, en las puntas de las plumas cortadas y en el hueso. */
function brasasAla(punta: P, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < 9; i++) {
    const x = punta[0] - 40 + rnd() * 56;
    const y = punta[1] - 4 + rnd() * 34;
    s += nube(x, y, 3.4 + rnd() * 2.6, 2.4 + rnd() * 1.6, C.brasaClara, 'xs', 0.9) + forma(circulo(x, y, 1), C.oroClaro, 0.95);
  }
  return s + nube(punta[0], punta[1] + 2, 9, 6, C.brasa, 's', 0.7);
}

/* ------------------------------------------------------------------
   El cuerpo: las piernas, la túnica quemada, el pie que patea, el brazo del enchufe
   ------------------------------------------------------------------ */

/** La túnica, de blanca a ceniza: el ruedo a puntas quemadas con el borde cobre y el hollín de la corriente. */
function cuerpo(): string {
  const torso = curva([[6, -14], [16, -30], [15, -54], [6, -68], [-8, -69], [-17, -57], [-15, -38], [-11, -18]]);
  const ruedo = poli([[-14, -26], [-8, -22], [-4, -28], [2, -20], [7, -26], [12, -16], [16, -24], [18, -12], [6, -8], [-12, -12]]);
  return conGrano(
    // La pierna de lejos, un poco más arriba y más oscura, con la rodilla doblada.
    forma(curva([[12, -26], [-4, -38], [-24, -42], [-36, -38], [-50, -28], [-62, -20], [-64, -13], [-54, -12], [-42, -18], [-28, -26], [-8, -24], [8, -14]]), C.pielHonda) + nube(-22, -34, 8, 3, C.hollin, 's', 0.5) + trazo('M-8 -38 Q-26 -42 -38 -34', C.piel, 1.4, 0.5) +
    forma(curva([[-56, -24], [-68, -25], [-72, -17], [-62, -12], [-52, -16]]), C.hollin) + nube(-62, -19, 8, 3, C.cenizaHonda, 'xs', 0.8) +
    // La pierna de cerca: el muslo y la canilla (que sigue en el pie).
    forma(curva([[12, -4], [6, -22], [-10, -32], [-30, -36], [-38, -28], [-30, -16], [-10, -10]]), C.piel) + nube(-14, -20, 14, 5, C.hollin, 's', 0.45) + trazo('M2 -24 Q-14 -32 -30 -33', C.pielClara, 1.8, 0.6) + forma(circulo(-31, -29, 7), C.piel) + nube(-31, -33, 4, 2, C.pielClara, 'xs', 0.6) +
    // La túnica: ceniza clara, con el hollín de abajo y de la espalda, los pliegues y el cuello quemado.
    enmascarado('m-angelito-tunica', torso,
      forma(torso, C.hueso) + nube(4, -62, 14, 8, C.hueso, 's', 0.7) + nube(8, -30, 16, 22, C.cenizaHonda, 's', 0.8) + nube(-4, -22, 20, 7, C.hollin, 's', 0.75) + nube(12, -48, 6, 16, C.ceniza, 's', 0.6) +
      trazo('M-10 -60 Q-2 -44 -10 -22 M2 -62 Q8 -44 4 -20', C.ceniza, 1.2, 0.75) + trazo('M-14 -64 Q-2 -70 8 -66', C.hollin, 1.6, 0.7) + [[-6, -52, 3], [8, -40, 4], [-2, -32, 2.6]].map(([x, y, r]) => forma(circulo(x!, y!, r!), C.hollin, 0.6)).join('')) +
    // El ruedo a puntas, quemado en el borde.
    enmascarado('m-angelito-ruedo', ruedo, forma(ruedo, C.hueso) + nube(2, -10, 20, 6, C.hollin, 's', 0.85) + nube(-10, -26, 6, 3, C.brasaHonda, 'xs', 0.8)) +
    trazo('M-14 -26 L-8 -22 L-4 -28 L2 -20 L7 -26 L12 -16 L16 -24', C.brasaHonda, 1.3, 0.95) +
    // El brazo de lejos, caído sobre la rodilla.
    trazo('M2 -52 L-12 -38 L-26 -40', C.pielHonda, 8) + forma(circulo(-28, -40, 4.4), C.pielHonda),
  );
}

/** El pie que patea: la canilla, el tobillo y la zapatilla chamuscada, con la plantilla humeando. */
function pie(): string {
  const [tx, ty] = A.tobillo;
  const zapa = curva([[tx - 4, ty - 8], [tx - 20, ty - 7], [tx - 24, ty + 2], [tx - 14, ty + 6], [tx + 4, ty + 4]]);
  return conGrano(
    forma(curva([[-28, -36], [-40, -31], [-56, -20], [-66, -13], [-62, -4], [-50, -6], [-38, -14], [-22, -22]]), C.piel) + nube(-44, -16, 10, 3, C.hollin, 's', 0.5) + trazo(`M-36 -32 Q-48 -26 -62 -12`, C.pielClara, 1.6, 0.55) +
    enmascarado('m-angelito-zapa', zapa, forma(zapa, C.cenizaHonda) + nube(tx - 14, ty + 3, 10, 3, C.hollin, 's', 0.9) + nube(tx - 18, ty - 3, 5, 2, C.brasaHonda, 'xs', 0.8)) +
    trazo(`M${tx - 22} ${ty + 2} q4 -3 8 -1 M${tx - 10} ${ty + 4} q4 -2 8 0`, C.hollin, 0.9, 0.8) + forma(circulo(tx - 21, ty - 3, 1.2), C.brasaClara),
  );
}

/** El ruedo de la túnica, con las brasas: puntos todavía al rojo, donde la tela se quemó. */
function brasasRuedo(): string {
  return [[-8, -22], [-2, -23], [4, -21], [9, -22], [14, -17], [-12, -26], [16, -22]].map(([x, y]) => nube(x!, y!, 3.2, 2.4, C.brasaClara, 'xs', 0.95) + forma(circulo(x!, y!, 0.9), C.oroClaro)).join('');
}

/** El brazo del enchufe: la manga quemada, el antebrazo, el puño y el enchufe con el cable que baja a la tierra. */
function brazo(): string {
  const [ex, ey] = A.enchufe;
  return conGrano(
    // El cable que baja del enchufe a la tierra, dibujado colgando.
    trazo(`M${ex - 6} ${ey + 2} C${ex - 22} ${ey - 4} ${ex - 38} ${ey + 8} ${ex - 40} ${ey + 28}`, C.hollin, 4.6) + trazo(`M${ex - 6.6} ${ey + 0.8} C${ex - 22.6} ${ey - 5.2} ${ex - 38.6} ${ey + 6.8} ${ex - 40.6} ${ey + 26.8}`, C.ceniza, 1, 0.75) +
    // El brazo: manga a medio quemar, antebrazo tiznado.
    trazo(`M-6 -52 L-26 -40 L${ex + 4} ${ey}`, C.piel, 9) + nube(-30, -38, 9, 3, C.hollin, 's', 0.55) + trazo(`M-8 -55 L-26 -43`, C.pielClara, 1.6, 0.5) +
    forma(poli([[-10, -60], [0, -58], [0, -46], [-12, -44]]), C.hueso) + nube(-6, -46, 6, 3, C.hollin, 'xs', 0.8) + trazo('M-12 -44 L-9 -47 L-6 -43 L-3 -47 L0 -44', C.brasaHonda, 1.1, 0.9) +
    // El enchufe: la carcasa negra con los dos dientes mirando para el cuerpo, y el puño cerrado encima.
    forma(poli([[ex - 12, ey - 7], [ex + 2, ey - 7], [ex + 2, ey + 7], [ex - 12, ey + 7]]), C.hollin) + forma(caja2(ex - 12, ey - 7, 14, 2), C.ceniza) + trazo(`M${ex + 2} ${ey - 3} l6 0 M${ex + 2} ${ey + 3} l6 0`, C.hueso, 1.8) +
    forma(curva([[ex - 4, ey - 8], [ex + 4, ey - 9], [ex + 8, ey - 2], [ex + 4, ey + 6], [ex - 4, ey + 4]]), C.piel) + nube(ex, ey - 4, 5, 3, C.pielClara, 'xs', 0.8) + trazo(`M${ex - 2} ${ey - 5} l0 8 M${ex + 2} ${ey - 5} l0 8`, C.pielHonda, 0.8, 0.8),
  );
}

const caja2 = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;

/** Las chispas del enchufe: tres relámpagos y puntos, como las que salen cuando se hace contacto. */
function chispas(): string {
  const [ex, ey] = A.enchufe;
  return (
    trazo(`M${ex + 6} ${ey - 6} l-6 -8 l5 0 l-5 -9`, C.oroClaro, 2.2) + trazo(`M${ex + 12} ${ey + 2} l8 -3 l-3 4 l8 1`, C.oroClaro, 2) + trazo(`M${ex + 4} ${ey + 8} l-4 8 l5 -2 l-3 7`, C.hueso, 1.8) +
    [[ex + 18, ey - 12, 2.2], [ex - 4, ey - 22, 1.8], [ex + 24, ey + 6, 1.6], [ex - 2, ey + 22, 1.6]].map(([x, y, r]) => forma(circulo(x!, y!, r!), C.hueso)).join('') +
    nube(ex + 6, ey, 14, 11, C.oroClaro, 's', 0.4)
  );
}

/* ------------------------------------------------------------------
   La cabeza: la cara tiznada, los ojos, el pelo parado, la aureola
   ------------------------------------------------------------------ */

function cabeza(): string {
  const [cx, cy] = A.cabeza;
  const cara = curva([[cx - 20, cy], [cx - 17, cy - 15], [cx - 2, cy - 21], [cx + 14, cy - 15], [cx + 19, cy + 2], [cx + 12, cy + 16], [cx - 4, cy + 20], [cx - 17, cy + 12]]);
  return conGrano(
    // La oreja de este lado, tiznada.
    forma(elipse(cx + 17, cy + 2, 4, 6), C.pielHonda) + trazo(`M${cx + 16} ${cy - 1} q3 3 0 6`, C.hollin, 0.8, 0.7) +
    enmascarado('m-angelito-cara', cara,
      forma(cara, C.piel) + nube(cx - 4, cy + 8, 14, 8, C.pielClara, 's', 0.7) +
      // El tizne: la corona de hollín de la frente, los ojos de mapache y la barbilla.
      nube(cx, cy - 16, 22, 8, C.hollin, 's', 0.85) + nube(cx - 9, cy - 4, 10, 6, C.hollin, 's', 0.55) + nube(cx + 7, cy - 4, 10, 6, C.hollin, 's', 0.55) + nube(cx - 4, cy + 18, 14, 5, C.hollin, 's', 0.65) + nube(cx + 16, cy + 4, 5, 12, C.cenizaHonda, 's', 0.6) +
      // Las mejillas, coloradas del golpe.
      nube(cx - 15, cy + 8, 5, 3.4, C.brasaHonda, 'xs', 0.6) + nube(cx + 7, cy + 8, 5, 3.4, C.brasaHonda, 'xs', 0.6)) +
    // Los ojos: el blanco de hueso, y las cejas chamuscadas (a una se le fue el pelo y la otra quedó en alto).
    A.ojos.map(([x, y]) => forma(circulo(x, y, A.radioOjo + 1.2), C.hollin, 0.6) + forma(circulo(x, y, A.radioOjo), C.hueso)).join('') +
    trazo(`M${A.ojos[0]![0] - 8} ${A.ojos[0]![1] - 11} q6 -4 12 -1`, C.hollin, 1.8, 0.9) + trazo(`M${A.ojos[1]![0] - 4} ${A.ojos[1]![1] - 13} q4 -2 8 2`, C.hollin, 1.2, 0.35) +
    // La nariz chiquita, tiznada, y la boca: una o, y el hueco del diente que se perdió.
    forma(curva([[cx - 12, cy + 2], [cx - 8, cy - 1], [cx - 5, cy + 4], [cx - 10, cy + 6]]), C.pielHonda) + forma(circulo(A.boca[0] + 6, A.boca[1] + 1, 4.4), C.hollin) + forma(poli([[A.boca[0] + 3, A.boca[1] - 1.4], [A.boca[0] + 6, A.boca[1] - 1.4], [A.boca[0] + 5, A.boca[1] + 1.6]]), C.hueso) +
    // Un hilito de humo de la oreja: chamuscado de verdad.
    trazo(`M${cx + 18} ${cy - 4} q-2 -5 2 -9`, C.ceniza, 1.2, 0.6),
  );
}

/** Las pupilas: dos espirales, de un mareo de rayo, con el blanco de la corriente en el centro. */
function pupilas(): string {
  return A.ojos.map(([x, y]) => {
    const r = [1, 2, 3.2, 4.4];
    return forma(circulo(x, y, 4.6), C.hollin) + `<path d="M${f(x)} ${f(y)} m1 0 a${f(r[0]!)} ${f(r[0]!)} 0 1 1 -2 0 a${f(r[1]!)} ${f(r[1]!)} 0 1 1 4 0 a${f(r[2]!)} ${f(r[2]!)} 0 1 1 -6 0 a${f(r[3]!)} ${f(r[3]!)} 0 1 1 8 0" fill="none" stroke="${C.hueso}" stroke-width="0.8"/>` + forma(circulo(x - 1.2, y - 1.6, 0.9), C.hueso, 0.9);
  }).join('');
}

/** El pelo parado, de la corriente: mechones negros que salen de la coronilla, con la punta ceniza. */
function pelo(): string {
  const [cx, cy] = A.cabeza;
  const rnd = azar(98);
  let s = '';
  for (let i = 0; i < 17; i++) {
    const a = (-170 + (i / 16) * 160) * (Math.PI / 180);
    const r0 = 18;
    const largo = 10 + rnd() * 12;
    const x0 = cx + Math.cos(a) * r0;
    const y0 = cy + Math.sin(a) * r0;
    const x1 = cx + Math.cos(a + (rnd() - 0.5) * 0.3) * (r0 + largo);
    const y1 = cy + Math.sin(a + (rnd() - 0.5) * 0.3) * (r0 + largo);
    s += trazo(`M${f(x0)} ${f(y0)} Q${f((x0 + x1) / 2 + (rnd() - 0.5) * 6)} ${f((y0 + y1) / 2)} ${f(x1)} ${f(y1)}`, C.hollin, 2.2 + rnd()) + trazo(`M${f((x0 + x1) / 2)} ${f((y0 + y1) / 2)} L${f(x1)} ${f(y1)}`, C.ceniza, 0.9, 0.7);
  }
  return conGrano(s + nube(cx, cy - 22, 16, 6, C.hollin, 's', 0.7));
}

/** La aureola: un aro de oro que se le torció y quedó caliente de un lado, con una grieta y la chispa de la punta. */
function aureola(): string {
  const [ax, ay] = A.aureola;
  const aro = elipse(ax, ay, 23, 6.4);
  return conGrano(
    trazo(aro, C.hollin, 6.4, 0.5) + trazo(aro, C.oro, 4.4) + trazo(aro, C.oroClaro, 1.3, 0.9) +
    // Lo caliente: el lado derecho al rojo vivo.
    trazo(`M${ax + 8} ${ay + 6.2} A23 6.4 0 0 0 ${ax + 23} ${ay}`, C.brasaClara, 4.2, 0.9) + trazo(`M${ax + 14} ${ay + 5} A23 6.4 0 0 0 ${ax + 22} ${ay + 1}`, C.oroClaro, 1.4, 0.8) +
    // La abolladura y la grieta, y la chispa que salta.
    trazo(`M${ax - 18} ${ay - 3.6} l3 2 l-1 3`, C.hollin, 1.2, 0.9) + forma(circulo(ax + 24, ay - 6, 1.4), C.oroClaro) + trazo(`M${ax + 24} ${ay - 6} l5 -5 M${ax + 24} ${ay - 6} l-1 -7`, C.oroClaro, 0.9, 0.85) +
    nube(ax + 16, ay, 10, 5, C.brasa, 's', 0.45),
  );
}

/* ------------------------------------------------------------------
   Los huesos, el brote, el humo, la tos
   ------------------------------------------------------------------ */

/** Los huesos de lo que cruza la corriente, como en un dibujito: las costillas, la columna, los brazos, las piernas. */
function esqueleto(): string {
  const hueso = (d: string, w = 2.2): string => trazo(d, C.hueso, w, 0.95);
  return (
    [-60, -54, -48, -42, -36, -30].map((y, i) => hueso(`M${f(10 - i * 0.6)} ${y} Q${f(-4 - i * 0.8)} ${y - 6} ${f(-12)} ${y + 1}`, 1.6)).join('') +
    hueso('M12 -62 Q16 -40 8 -16', 2.4) + hueso('M-26 -38 L-52 -26', 3) + hueso('M-26 -38 L-8 -28 L10 -20', 3) + hueso('M-52 -20 L-30 -30', 3) +
    forma(circulo(-30, -28, 4), C.hueso, 0.95) + forma(circulo(-26, -38, 3.6), C.hueso, 0.95) + forma(circulo(-58, -12, 3.4), C.hueso, 0.95) +
    hueso('M-4 -56 L-26 -42 L-50 -30', 2.6) + forma(circulo(-26, -42, 3), C.hueso, 0.95)
  );
}

/** La calavera, que se ve por un instante adentro de la cabeza. */
function craneo(): string {
  const [cx, cy] = A.cabeza;
  return (
    trazo(elipse(cx, cy - 2, 15, 16), C.hueso, 2.2, 0.95) + forma(circulo(A.ojos[0]![0], A.ojos[0]![1], 5.6), C.hollin, 0.95) + forma(circulo(A.ojos[1]![0], A.ojos[1]![1], 5.6), C.hollin, 0.95) +
    forma(poli([[cx - 9, cy + 5], [cx - 5, cy + 1], [cx - 4, cy + 6]]), C.hollin, 0.95) + trazo(`M${cx - 10} ${cy + 15} l0 6 M${cx - 5} ${cy + 16} l0 6 M${cx} ${cy + 16} l0 6 M${cx + 5} ${cy + 15} l0 6`, C.hueso, 1.8, 0.95)
  );
}

/** El brote que le quiere: un tallo chiquito con dos hojas y un cogollo, que se arrima al pie. */
function brote(): string {
  const [bx, by] = A.brote;
  const hoja = (x: number, y: number, g: number, l: number): string =>
    `<g transform="rotate(${g} ${f(x)} ${f(y)})">` + forma(`M${f(x)} ${f(y)} Q${f(x + l * 0.5)} ${f(y - l * 0.5)} ${f(x + l)} ${f(y)} Q${f(x + l * 0.5)} ${f(y + l * 0.34)} ${f(x)} ${f(y)} Z`, C.brote) + trazo(`M${f(x)} ${f(y)} L${f(x + l * 0.9)} ${f(y)}`, C.broteClaro, 0.8, 0.85) + `</g>`;
  return conGrano(
    trazo(`M${bx} ${by} C${bx + 2} ${by - 14} ${bx + 14} ${by - 22} ${bx + 14} ${by - 34}`, C.brote, 3.4) + trazo(`M${bx + 1} ${by - 1} C${bx + 3} ${by - 14} ${bx + 15} ${by - 22} ${bx + 15} ${by - 34}`, C.broteClaro, 0.9, 0.8) +
    hoja(bx + 5, by - 14, -140, 14) + hoja(bx + 9, by - 22, -24, 15) + forma(circulo(bx + 14, by - 35, 3), C.broteClaro) + forma(circulo(bx + 14, by - 35, 1.3), C.hueso, 0.8) +
    // La tierra negra de donde sale.
    nube(bx + 2, by + 2, 10, 3, C.hollin, 'xs', 0.9),
  );
}

/** Una bocanada de humo, dibujada en su punto de partida: la isla la sube, la ensancha y la deshace. */
function humo(): string {
  return soplo('M-7 0 C-15 -9 -5 -18 6 -13 C15 -6 7 3 -7 0 Z', C.ceniza, 's', 0.85) + nube(-1, -8, 6, 4, C.hueso, 's', 0.45);
}

/** La tos: una bocanada chica del lado de la boca. */
const tos = (): string => soplo('M-5 0 C-11 -7 -3 -13 5 -9 C11 -4 5 3 -5 0 Z', C.cenizaHonda, 's', 0.9) + nube(0, -5, 4, 3, C.ceniza, 'xs', 0.7);

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const [HX, HY] = A.humo[0]!;
const [HX2, HY2] = A.humo[1]!;
const PUNTA_1: P = [52, -104];
const PUNTA_2: P = [34, -118];

export const PIEZAS_ANGELITO: readonly Pieza[] = [
  { nombre: 'angelito-suelo', caja: [-216, -24, 300, 40], dibujo: suelo(), densidad: 1.6 },
  { nombre: 'angelito-brote', caja: [A.brote[0] - 16, A.brote[1] - 46, 46, 56], dibujo: brote(), densidad: D * 2 },
  { nombre: 'angelito-ala-1', caja: [4, -156, 96, 108], dibujo: ala(PUNTA_1, 7, 0.9), densidad: D * 1.6 },
  { nombre: 'angelito-ala-2', caja: [-4, -168, 98, 118], dibujo: ala(PUNTA_2, 19, 1), densidad: D * 1.6 },
  { nombre: 'angelito-brasas-1', caja: [4, -156, 96, 108], dibujo: brasasAla(PUNTA_1, 3), densidad: D * 1.4 },
  { nombre: 'angelito-brasas-2', caja: [-4, -168, 98, 118], dibujo: brasasAla(PUNTA_2, 5), densidad: D * 1.4 },
  { nombre: 'angelito-cuerpo', caja: [-80, -80, 120, 80], dibujo: cuerpo(), densidad: D * 1.8 },
  { nombre: 'angelito-pie', caja: [-90, -40, 70, 40], dibujo: pie(), densidad: D * 2 },
  { nombre: 'angelito-brasas', caja: [-20, -34, 44, 22], dibujo: brasasRuedo(), densidad: D * 2 },
  { nombre: 'angelito-esqueleto', caja: [-70, -72, 94, 66], dibujo: esqueleto(), densidad: D * 1.6 },
  { nombre: 'angelito-brazo', caja: [-80, -66, 82, 76], dibujo: brazo(), densidad: D * 2 },
  { nombre: 'angelito-chispas', caja: [A.enchufe[0] - 20, A.enchufe[1] - 34, 66, 70], dibujo: chispas(), densidad: D * 2 },
  { nombre: 'angelito-cabeza', caja: [A.cabeza[0] - 26, A.cabeza[1] - 26, 56, 52], dibujo: cabeza(), densidad: D * 2.4 },
  { nombre: 'angelito-pupilas', caja: [A.ojos[0]![0] - 8, A.ojos[0]![1] - 8, 32, 16], dibujo: pupilas(), densidad: D * 3 },
  { nombre: 'angelito-craneo', caja: [A.cabeza[0] - 20, A.cabeza[1] - 22, 44, 48], dibujo: craneo(), densidad: D * 2 },
  { nombre: 'angelito-pelo', caja: [A.cabeza[0] - 44, A.cabeza[1] - 62, 88, 56], dibujo: pelo(), densidad: D * 1.6 },
  { nombre: 'angelito-aureola', caja: [A.aureola[0] - 36, A.aureola[1] - 20, 72, 36], dibujo: aureola(), densidad: D * 2.2 },
  { nombre: 'angelito-humo', caja: [-24, -30, 48, 40], dibujo: humo(), densidad: 1.6 },
  { nombre: 'angelito-tos', caja: [-14, -22, 28, 28], dibujo: tos(), densidad: 2.4 },
];

const img = imagenesDe(PIEZAS_ANGELITO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;
/** Una imagen movida a su punto de partida: el humo y la tos se dibujan en el (0, 0) y se llevan a donde salen. */
const en = ([x, y]: P, nombre: string): string => `<g transform="translate(${x} ${y})">${img(nombre)}</g>`;

/** El angelito armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte(
      'cuerpo',
      parte('ala-1', img('angelito-ala-1') + parte('brasas-1', img('angelito-brasas-1'), '', o.brasas), t['ala-1']) +
        parte('ala-2', img('angelito-ala-2') + parte('brasas-2', img('angelito-brasas-2'), '', o.brasas), t['ala-2']) +
        parte('torso', img('angelito-cuerpo') + parte('brasas', img('angelito-brasas'), '', o.brasas) + parte('esqueleto', img('angelito-esqueleto'), '', o.esqueleto), t.torso) +
        parte('pie', img('angelito-pie'), t.pie) +
        parte('brazo', img('angelito-brazo') + parte('chispas', img('angelito-chispas'), '', o.chispas), t.brazo) +
        parte(
          'cabeza',
          img('angelito-cabeza') + parte('pupilas', img('angelito-pupilas'), t.pupilas) + parte('craneo', img('angelito-craneo'), '', o.esqueleto) + parte('pelo', img('angelito-pelo'), t.pelo) +
            parte('tos', en(A.boca, 'angelito-tos'), t.tos, o.tos),
          t.cabeza,
        ) +
        parte('aureola', img('angelito-aureola'), t.aureola, o.aureola),
      t.cuerpo,
    ) +
    parte('humo-1', en(A.humo[0]!, 'angelito-humo'), t['humo-1'], o['humo-1']) +
    parte('humo-2', en(A.humo[1]!, 'angelito-humo'), t['humo-2'], o['humo-2']) +
    parte('humo-3', en(A.humoPie, 'angelito-humo'), t['humo-3'], o['humo-3'])
  );
}

/** Lo que se queda quieto detrás: el cráter con el cable y el brote que lo quiere. */
const fondo = (m: Momento): string => img('angelito-suelo') + parte('brote', img('angelito-brote'), marcas(m).transform.brote);

/** El angelito en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function angelitoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${fondo(m)}${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: sentado en el cráter, con el enchufe en la mano. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--angelito" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El angelito frito'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${fondo(QUIETO)}${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: frito de nuevo, con los huesos a la vista, el pelo parado y la aureola en el aire. */
export const RETRATO = { caja: [ANGELITO.x - 70, ANGELITO.piso - 90, 140, 100] as const };
function retrato(): string {
  return `<image href="/bestiario/arbol-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/><image href="/bestiario/arbol-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` + angelitoEn(FRITO);
}

export const ANGELITO_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-arbol',
  ancla: ANGELITO.x,
  piezas: PIEZAS_ANGELITO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
