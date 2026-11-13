/**
 * El polizón del remolque (`D-73`, vigesimoséptima vuelta), abajo de un bote dado vuelta, a oscuras.
 *
 * *"Un día el bote volcó y el premio a pique se fue. Todos te daban por muerto, y vos allí en tu remolque, sin luz,
 * como un polizón"* es de *Salando las heridas*, en *La mosca y la sopa* (1991). Se toma al pie de la letra, verso
 * por verso: **el bote volcó** (es el bote dado vuelta que flota adelante en el bajo, que ahora es suyo); **el
 * premio a pique se fue** (al lado asoma del agua la copa, hundida de costado, largando burbujas); **todos lo
 * daban por muerto** (arriba de la quilla le dejaron una corona, con su cinta, y una vela, que está apagada:
 * *sin luz*); **en su remolque** (de la proa sale la soga del remolque, que se pierde en el agua); y **como un
 * polizón**: está abajo, y lo único que se le ve son los ojos cuando levanta el bote una rendija. Del mismo tema:
 * *"bien maquillado y ocultando tu lunar"* (tiene la cara empolvada, los cachetes pintados, y una curita arriba del
 * lunar), *"hundimos tus pómulos, y vos resplandecías"* (los pómulos hundidos, y cuando lo destapan resplandece),
 * *"el café con tu suerte se enfría"* (cada tanto saca un pocillo de café frío por abajo de la proa) y *"salando
 * las heridas"* (y por la popa saca un salero y sala el agua). Cuando lo tocan levanta el bote entero, resplandece,
 * y pide silencio con el dedo: que lo sigan dando por muerto.
 *
 * De la letra son el bote volcado, el premio, la corona de muerto, el remolque, lo oscuro, el maquillaje, el lunar,
 * los pómulos, el resplandor, el café y la sal. Del dibujo son el saco, la curita y el dedo en la boca.
 *
 * Viste *La mosca y la sopa*, medido con sharp: el bote es la tierra de la contratapa, la franja y las flores son
 * el rojo del frente y el rosa y el amarillo de los lomos de la caja, la cara empolvada es el haz del seguidor, y
 * el resplandor, el amarillo de las letras.
 *
 * Coordenadas: el (0, 0) es el agua debajo del medio del bote, con la proa a la derecha (`rig-polizon.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli } from './trazos.ts';
import { ABRE, ASOMA, POLIZON, POLIZON_ARMADO as A, QUIETO, marcas, type Momento } from './rig-polizon.ts';

const ID = 'el-polizon-del-remolque';

/** Las tintas de *La mosca y la sopa* (`tokens.css`). */
const C = {
  madera: 'var(--bestia-polizon-madera)',
  maderaClara: 'var(--bestia-polizon-madera-clara)',
  maderaHonda: 'var(--bestia-polizon-madera-honda)',
  negro: 'var(--bestia-polizon-negro)',
  rojo: 'var(--bestia-polizon-rojo)',
  rosa: 'var(--bestia-polizon-rosa)',
  amarillo: 'var(--bestia-polizon-amarillo)',
  amarilloClaro: 'var(--bestia-polizon-amarillo-claro)',
  polvo: 'var(--bestia-polizon-polvo)',
  ojera: 'var(--bestia-polizon-ojera)',
  crema: 'var(--bestia-polizon-crema)',
  naranja: 'var(--bestia-polizon-naranja)',
};

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
   El agua: las ondas, el premio hundido
   ------------------------------------------------------------------ */

/** El agua alrededor: donde el bote la toca, y la copa del premio, hundida de costado, largando burbujas. */
function agua(): string {
  const copa = `<g transform="rotate(-28 -232 2)">` +
    forma(poli([[-246, -22], [-218, -22], [-222, 0], [-242, 0]]), C.amarillo) + nube(-236, -12, 4, 9, C.amarilloClaro, 'xs', 0.9) + nube(-224, -10, 4, 10, C.naranja, 'xs', 0.6) +
    trazo('M-246 -18 q-10 2 -6 12 M-218 -18 q10 2 6 12', C.amarillo, 2.4) + forma(elipse(-232, -22, 14, 3), C.maderaHonda) + forma(poli([[-235, 0], [-229, 0], [-228, 8], [-236, 8]]), C.amarillo) + `</g>`;
  return conGrano(
    nube(0, 6, 190, 6, C.negro, 's', 0.7) +
    trazo('M-210 8 q40 -5 80 0 M-60 12 q50 -4 110 1 M90 9 q50 -5 110 0', C.ojera, 1.2, 0.55) + trazo('M-150 14 q30 -3 60 0 M40 16 q40 -3 80 0', C.polvo, 0.8, 0.3) +
    copa +
    // Lo que el agua le tapa a la copa, y las burbujas del premio que se fue a pique.
    nube(-230, 8, 24, 5, C.negro, 's', 0.9) + trazo('M-252 4 q20 -4 44 0', C.ojera, 1.2, 0.7) +
    [[-214, -30, 2.4], [-208, -42, 1.8], [-216, -52, 1.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.polvo}" stroke-width="0.8" opacity="0.7"/>`).join(''),
  );
}

/** Las ondas del golpe, cuando el bote cae: dos anillos chatos. La isla los abre. */
function ondas(): string {
  return `<ellipse cx="0" cy="6" rx="196" ry="9" fill="none" stroke="${C.polvo}" stroke-width="1.6" opacity="0.7"/><ellipse cx="0" cy="8" rx="226" ry="13" fill="none" stroke="${C.ojera}" stroke-width="1.4" opacity="0.8"/>`;
}

/* ------------------------------------------------------------------
   Abajo del bote: lo oscuro, el resplandor, él
   ------------------------------------------------------------------ */

/** Hasta dónde llega la proa con el bote abierto del todo: la punta de arriba de la cuña. */
const LARGO = A.proa[0] - A.popa[0];
const PROA_ARRIBA: readonly [number, number] = [A.popa[0] + Math.cos((ABRE * Math.PI) / 180) * LARGO, -Math.sin((ABRE * Math.PI) / 180) * LARGO];
const ALTO_DE_LA_CUNA = Math.ceil(-PROA_ARRIBA[1]);

/**
 * Lo oscuro de abajo del bote: una cuña con la punta en la popa. La isla la abre con el bote. No pasa de donde
 * llega la proa levantada: si pasara, quedaría un paño negro colgando afuera del bote.
 */
function adentro(): string {
  // El canto de la derecha, por donde se lo ve, va roto a mano: un canto derecho se lee como un paño negro parado.
  const rnd = azar(499);
  const canto: Array<readonly [number, number]> = [];
  for (let i = 0; i <= 12; i++) {
    const y = (PROA_ARRIBA[1] * i) / 12;
    canto.push([PROA_ARRIBA[0] + 4 - (i % 2 ? 6 + rnd() * 16 : rnd() * 4) - (i === 12 ? 4 : 0), y]);
  }
  const d = poli([[A.popa[0], 0], ...canto]);
  return conGrano(enmascarado('m-polizon-adentro', d, forma(d, C.negro) + nube(60, -10, 110, 16, C.maderaHonda, 'm', 0.5)));
}

/** El resplandor: los rayos, cortados a mano, y el halo rociado. */
function resplandor(): string {
  const [cx, cy] = A.cara;
  const rnd = azar(503);
  let rayos = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + rnd() * 0.2;
    const [r0, r1] = [26, 50 + rnd() * 26];
    const w = 0.07 + rnd() * 0.05;
    rayos += forma(poli([[cx + Math.cos(a - w) * r0, cy + Math.sin(a - w) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a + w) * r0, cy + Math.sin(a + w) * r0]]), i % 2 ? C.amarillo : C.amarilloClaro, 0.75);
  }
  return `<g filter="url(#rociado)">${nube(cx, cy, 44, 44, C.amarillo, 'm', 0.5)}${nube(cx, cy, 28, 28, C.amarilloClaro, 's', 0.7)}${rayos}</g>`;
}

/** La luz del fósforo: la llamita y lo que alumbra. */
function fosforo(): string {
  const [x, y] = A.fosforo;
  return `<g filter="url(#rociado)">${nube(x - 14, y - 4, 40, 14, C.naranja, 'm', 0.5)}</g>` + trazo(`M${x} ${y + 6} l0 -8`, C.crema, 1.2) + forma(`M${x} ${y - 2} q-3 -5 0 -10 q3 5 0 10 Z`, C.amarilloClaro) + forma(elipse(x, y - 2.6, 1, 1.6), C.naranja);
}

const CUERPO = curva([[34, 70], [36, -6], [52, -26], [78, -32], [106, -28], [124, -8], [128, 70]]);
const CARA = (() => {
  const [cx, cy] = A.cara;
  return curva([[cx - 17, cy - 6], [cx - 14, cy - 20], [cx, cy - 26], [cx + 15, cy - 20], [cx + 18, cy - 4], [cx + 13, cy + 14], [cx + 2, cy + 23], [cx - 10, cy + 16]]);
})();

/**
 * La sombra: él entero, en negro. A oscuras es lo que se ve, con los dos ojos encima; la luz (el bote destapado, el
 * fósforo) la va sacando.
 */
function sombra(): string {
  const [cx, cy] = A.cara;
  return forma(CUERPO, C.negro) + forma(CARA, C.negro) + forma(elipse(cx, cy - 6, 22, 26), C.negro) + forma(elipse(cx - 18, cy - 2, 5, 7), C.negro) + forma(elipse(cx + 19, cy - 1, 5, 7), C.negro) + forma(elipse(cx + 8, cy + 12, 12, 8), C.negro);
}

/** Los ojos: el blanco, que es lo único que se le ve en lo oscuro. Van arriba de la sombra. */
function ojos(): string {
  const [rx, ry] = A.radio;
  return A.ojos.map(([ox, oy]) => forma(elipse(ox, oy, rx + 1, ry + 1), C.negro) + forma(elipse(ox, oy, rx, ry), C.amarilloClaro)).join('');
}

/** El cuerpo: agachado, con el saco puesto, mojado hasta las solapas. */
function cuerpo(): string {
  const d = CUERPO;
  return conGrano(
    enmascarado('m-polizon-cuerpo', d,
      forma(d, C.maderaHonda) + nube(80, 30, 50, 40, C.negro, 'm', 0.7) + nube(56, -14, 14, 10, C.madera, 's', 0.6) + nube(108, -16, 12, 8, C.madera, 's', 0.5) +
      // Las solapas, la camisa y la corbata floja.
      forma(poli([[66, -30], [78, -4], [90, -30]]), C.crema) + forma(poli([[75, -28], [81, -28], [83, -6], [78, 2], [73, -6]]), C.rojo) +
      trazo('M64 -30 L76 6 M92 -30 L80 6', C.madera, 2.2, 0.9) + trazo('M50 -10 q4 30 0 60 M112 -12 q-4 30 2 60', C.negro, 1.4, 0.6)) +
    // Las gotas que le chorrean del hombro.
    [[46, -12], [118, -6]].map(([x, y]) => forma(`M${x} ${y} q-2.4 5 0 7 q2.4 -2 0 -7 Z`, C.polvo, 0.6)).join(''),
  );
}

/** La cara: empolvada, con los cachetes pintados, los pómulos hundidos, y la curita arriba del lunar. */
function cabeza(): string {
  const [cx, cy] = A.cara;
  const d = CARA;
  const [rx, ry] = A.radio;
  return conGrano(
    // Las orejas, y el pelo engominado, con la raya al medio y un yuyo del agua.
    forma(elipse(cx - 18, cy - 2, 4, 6), C.polvo) + forma(elipse(cx + 19, cy - 1, 4, 6), C.ojera) +
    enmascarado('m-polizon-cara', d,
      forma(d, C.polvo) + nube(cx + 12, cy + 2, 8, 22, C.ojera, 's', 0.5) +
      // Los pómulos hundidos, y el rubor encima.
      nube(cx - 9, cy + 6, 5, 7, C.ojera, 'xs', 0.75) + nube(cx + 10, cy + 6, 5, 7, C.ojera, 'xs', 0.85) +
      nube(cx - 11, cy + 1, 4.4, 3, C.rojo, 'xs', 0.7) + nube(cx + 12, cy + 1, 4.4, 3, C.rojo, 'xs', 0.7) +
      // Las ojeras.
      A.ojos.map(([ox, oy]) => nube(ox, oy + 1, rx + 2, ry + 3, C.ojera, 'xs', 0.7)).join('') +
      // El pelo.
      forma(curva([[cx - 19, cy - 8], [cx - 15, cy - 24], [cx, cy - 30], [cx + 16, cy - 24], [cx + 20, cy - 8], [cx + 12, cy - 17], [cx + 1, cy - 20], [cx - 10, cy - 17]]), C.negro) + trazo(`M${cx + 1} ${cy - 27} l0 8`, C.polvo, 0.8, 0.6) + nube(cx - 6, cy - 23, 5, 1.6, C.ojera, 'xs', 0.7)) +
    trazo(`M${cx - 12} ${cy - 22} q-8 6 -10 18`, C.madera, 1.6, 0.9) +
    // Las cejas pintadas, la nariz, y la boca, chica y colorada.
    trazo(`M${cx - 15} ${cy - 12} q6 -4 12 -1 M${cx + 5} ${cy - 12} q6 -4 12 0`, C.negro, 1.4) + trazo(`M${cx + 1} ${cy - 3} q-3 6 1 8`, C.ojera, 1.2, 0.9) +
    forma(`M${cx - 4} ${cy + 12} q2 -3 4 -1 q2 -2 4 1 q-4 4 -8 0 Z`, C.rojo) +
    // El lunar, que se le escapa por el borde de la curita.
    forma(elipse(cx + 12, cy + 11, 1.8, 1.8), C.negro) + `<g transform="rotate(-24 ${cx + 9} ${cy + 9})">${forma(cajaRedonda(cx + 2, cy + 6.4, 13, 5, 2), C.crema)}${forma(cajaRedonda(cx + 6, cy + 6.4, 5, 5, 1), C.rosa, 0.6)}</g>`,
  );
}

function parpado(n: 0 | 1): string {
  const [ox, oy] = A.ojos[n];
  const [rx, ry] = A.radio;
  return conGrano(forma(elipse(ox, oy, rx + 1.6, ry + 1.6), C.ojera) + nube(ox, oy - 2, rx - 1, 2, C.rosa, 'xs', 0.5) + trazo(`M${ox - rx - 0.6} ${oy + 1} Q${ox} ${oy + ry + 2} ${ox + rx + 0.6} ${oy + 1}`, C.negro, 1.2));
}

function pupila(n: 0 | 1): string {
  const [ox, oy] = A.ojos[n];
  return forma(elipse(ox, oy, 2.4, 2.6), C.negro) + forma(elipse(ox + 0.8, oy - 1, 0.7, 0.7), C.polvo);
}

/** El brazo que hace callar: la manga, el puño de la camisa y la mano, con el dedo cruzándole la boca. */
function brazo(): string {
  const [hx, hy] = A.hombro;
  const [cx, cy] = A.cara;
  const [mx, my] = [cx + 4, cy + 20];
  const manga = curva([[hx - 8, hy + 4], [hx + 6, hy - 6], [mx + 12, my + 2], [mx + 6, my + 12], [hx - 2, hy + 12]]);
  return conGrano(
    enmascarado('m-polizon-manga', manga, forma(manga, C.madera) + nube(hx - 2, hy + 8, 14, 5, C.maderaHonda, 's', 0.8)) +
    forma(poli([[mx + 4, my + 1], [mx + 12, my - 1], [mx + 13, my + 9], [mx + 6, my + 11]]), C.crema) +
    // La mano cerrada y el índice, derecho, arriba de la boca.
    forma(elipse(mx + 1, my + 4, 6.4, 5.6), C.polvo) + nube(mx + 2, my + 7, 4, 2, C.ojera, 'xs', 0.6) +
    forma(cajaRedonda(mx - 5.6, my - 13, 6.8, 16, 3.2), C.ojera) + forma(cajaRedonda(mx - 4.6, my - 12, 4.8, 14, 2.4), C.polvo) + trazo(`M${mx - 4} ${my - 3} l4 0 M${mx - 4} ${my - 8} l4 0`, C.ojera, 0.6, 0.8),
  );
}

/* ------------------------------------------------------------------
   Lo que saca: el pocillo de café y el salero
   ------------------------------------------------------------------ */

/** El pocillo de café frío, en su platito, y la mano que lo empuja para afuera. */
function cafe(): string {
  const [x, y] = A.cafe.adentro;
  return conGrano(
    forma(curva([[x - 40, y - 6], [x - 20, y - 8], [x - 12, y - 3], [x - 20, y + 3], [x - 40, y + 3]]), C.polvo) + nube(x - 26, y, 8, 2, C.ojera, 'xs', 0.6) + forma(cajaRedonda(x - 50, y - 8, 12, 12, 2), C.crema) +
    forma(elipse(x, y + 2, 15, 3.4), C.crema) + nube(x, y + 3.4, 12, 1.6, C.ojera, 'xs', 0.6) +
    forma(poli([[x - 8, y - 12], [x + 8, y - 12], [x + 6, y + 1], [x - 6, y + 1]]), C.crema) + forma(elipse(x, y - 12, 8, 2.4), C.maderaHonda) + trazo(`M${x + 8} ${y - 9} q6 0 5 4 q-1 3 -6 2`, C.crema, 1.8) + trazo(`M${x - 5} ${y - 7} l0 5`, C.rojo, 1.4, 0.8),
  );
}

/** El salero, de vidrio con tapa de lata, la mano que lo sacude, y la sal que cae al agua. */
function salero(): string {
  const [x, y] = A.salero.adentro;
  const rnd = azar(509);
  let sal = '';
  for (let i = 0; i < 14; i++) sal += forma(elipse(x - 30 + (rnd() - 0.5) * 12, y - 2 + rnd() * 12, 0.8, 0.8), C.polvo, 0.5 + rnd() * 0.5);
  return conGrano(
    forma(curva([[x + 36, y - 4], [x + 14, y - 8], [x + 2, y - 4], [x + 10, y + 4], [x + 36, y + 5]]), C.polvo) + nube(x + 20, y + 2, 10, 2, C.ojera, 'xs', 0.6) + forma(cajaRedonda(x + 34, y - 7, 12, 13, 2), C.crema) +
    `<g transform="rotate(-58 ${x - 10} ${y - 6})">${forma(cajaRedonda(x - 18, y - 16, 14, 20, 3), C.polvo, 0.85)}${nube(x - 11, y - 2, 5, 4, C.crema, 'xs', 0.9)}${forma(cajaRedonda(x - 19, y - 21, 16, 6, 2), C.ojera)}${trazo(`M${x - 15} ${y - 12} l0 12`, C.amarilloClaro, 1, 0.7)}</g>` +
    sal,
  );
}

/* ------------------------------------------------------------------
   El bote dado vuelta y la corona
   ------------------------------------------------------------------ */

const CASCO = curva([[A.popa[0] - 2, 2], [-168, -34], [-120, -54], [-40, -63], [50, -64], [120, -52], [162, -30], [A.proa[0] + 2, -2], [168, 8], [-168, 9]]);

/** El bote: la tablazón, la quilla, la franja pintada, el remiendo de lata, la vela apagada y la soga del remolque. */
function bote(): string {
  const rnd = azar(521);
  let vetas = '';
  for (let i = 0; i < 60; i++) {
    const x = -165 + rnd() * 330;
    const y = -58 + rnd() * 60;
    vetas += trazo(`M${f(x)} ${f(y)} q${f(8 + rnd() * 14)} ${f(-1 + rnd() * 2)} ${f(16 + rnd() * 26)} ${f(rnd() * 2)}`, i % 3 ? C.maderaHonda : C.maderaClara, 0.8, 0.3 + rnd() * 0.35);
  }
  const tabla = (y: number, comba: number): string => trazo(`M-170 ${y + 8} Q0 ${y - comba} 172 ${y + 6}`, C.maderaHonda, 1.5, 0.85);
  return conGrano(
    // La soga del remolque: sale de la argolla de la proa y se pierde en el agua.
    trazo('M170 -10 Q196 -14 214 2 Q226 10 244 6', C.crema, 2.4) + trazo('M170 -10 Q196 -14 214 2 Q226 10 244 6', C.madera, 0.8, 0.7) +
    enmascarado('m-polizon-casco', CASCO,
      forma(CASCO, C.madera) + nube(0, 4, 180, 12, C.negro, 'm', 0.85) + nube(-140, -20, 30, 30, C.maderaHonda, 'm', 0.7) + nube(30, -58, 110, 7, C.maderaClara, 's', 0.8) + nube(150, -22, 16, 18, C.maderaHonda, 's', 0.6) +
      vetas + tabla(-12, 18) + tabla(-28, 22) + tabla(-44, 22) +
      // La franja pintada de la borda, descascarada, y el verdín de abajo.
      trazo('M-172 1 Q0 -9 176 0', C.rojo, 5, 0.85) + trazo('M-120 -1 l24 -1 M-10 -4 l30 0 M90 -3 l20 1', C.maderaHonda, 5, 0.7)) +
    // La quilla: el listón de arriba, con sus clavos.
    trazo('M-150 -47 Q-40 -66 50 -66 Q110 -64 160 -34', C.maderaClara, 4) + trazo('M-150 -47 Q-40 -66 50 -66 Q110 -64 160 -34', C.maderaHonda, 1, 0.7) +
    [-110, -70, -30, 10, 50, 90, 130].map((x) => forma(elipse(x, -66 + Math.abs(x - 20) * 0.11 + (x > 100 ? (x - 100) * 0.2 : 0), 1.3, 1.3), C.negro)).join('') +
    // El remiendo de lata, con cuatro clavos, donde se abrió cuando volcó.
    `<g transform="rotate(-8 96 -32)">${forma(cajaRedonda(84, -40, 26, 16, 1.6), C.ojera)}${nube(92, -36, 8, 3, C.polvo, 'xs', 0.6)}${[[87, -37], [107, -37], [87, -27], [107, -27]].map(([x, y]) => forma(elipse(x!, y!, 1.1, 1.1), C.negro)).join('')}</g>` +
    // La argolla de la proa, y la popa cuadrada.
    `<circle cx="168" cy="-12" r="4.4" fill="none" stroke="${C.ojera}" stroke-width="2"/>` + trazo('M-170 0 L-166 -34', C.maderaClara, 2.4, 0.8) +
    // La vela que le dejaron: apagada, con el pabilo negro y el sebo chorreado por la tablazón.
    forma(cajaRedonda(22, -84, 9, 19, 2), C.crema) + nube(28, -74, 2, 8, C.ojera, 'xs', 0.5) + trazo('M26.5 -84 l1 -5', C.negro, 1.2) + forma('M20 -68 q4 4 2 12 q4 -4 6 -1 q0 -8 5 -11 Z', C.crema, 0.95),
  );
}

/** La corona de muerto: el aro de flores, las hojas y la cinta cruzada, con unas letras que ya no se leen. */
function corona(): string {
  const [kx, ky] = A.corona;
  const [cx, cy] = [kx, ky - 30];
  const rnd = azar(523);
  let flores = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = 23 + (rnd() - 0.5) * 5;
    const [x, y] = [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const tinta = [C.rojo, C.rosa, C.amarillo, C.crema][i % 4]!;
    flores += forma(poli([[x - 6, y + 2], [x, y - 7], [x + 6, y + 3]]), C.maderaHonda, 0.9) + forma(elipse(x, y, 5.4, 5), tinta) + nube(x + 1.4, y + 1.6, 3, 2.4, C.maderaHonda, 'xs', 0.45) + forma(elipse(x, y, 1.6, 1.6), i % 4 === 2 ? C.naranja : C.amarilloClaro);
  }
  return conGrano(
    `<circle cx="${cx}" cy="${cy}" r="23" fill="none" stroke="${C.maderaHonda}" stroke-width="12"/>` + flores +
    // La cinta, cruzada, con las dos puntas colgando y los renglones borrados.
    `<g transform="rotate(-32 ${cx} ${cy})">${forma(poli([[cx - 33, cy - 4], [cx + 33, cy - 4], [cx + 33, cy + 4], [cx - 33, cy + 4]]), C.crema)}${trazo(`M${cx - 26} ${cy} l12 0 M${cx - 8} ${cy} l8 0 M${cx + 6} ${cy} l16 0`, C.ojera, 1.6, 0.8)}</g>` +
    // Las dos puntas de la cinta, que cuelgan de abajo y se apoyan en la tablazón.
    forma(poli([[cx - 31, cy + 13], [cx - 22, cy + 17], [cx - 24, cy + 33], [cx - 28, cy + 28], [cx - 33, cy + 34]]), C.crema, 0.95) + trazo(`M${cx - 30} ${cy + 16} l7 3`, C.ojera, 1, 0.6),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2;
const cajaOjo = ([x, y]: readonly [number, number], r: number): readonly [number, number, number, number] => [x - r, y - r, r * 2, r * 2];

export const PIEZAS_POLIZON: readonly Pieza[] = [
  { nombre: 'polizon-agua', caja: [-266, -64, 500, 88], dibujo: agua(), densidad: 1.6 },
  { nombre: 'polizon-ondas', caja: [-232, -10, 464, 34], dibujo: ondas(), densidad: 1.4 },
  { nombre: 'polizon-adentro', caja: [A.popa[0] - 2, -ALTO_DE_LA_CUNA - 2, Math.ceil(PROA_ARRIBA[0] - A.popa[0]) + 8, ALTO_DE_LA_CUNA + 4], dibujo: adentro(), densidad: 1 },
  { nombre: 'polizon-resplandor', caja: [A.cara[0] - 84, A.cara[1] - 84, 168, 168], dibujo: resplandor(), densidad: 1.4 },
  { nombre: 'polizon-cuerpo', caja: [28, -40, 106, 112], dibujo: cuerpo(), densidad: D },
  { nombre: 'polizon-cabeza', caja: [A.cara[0] - 26, A.cara[1] - 34, 52, 62], dibujo: cabeza(), densidad: D * 2 },
  { nombre: 'polizon-sombra', caja: [28, -92, 106, 164], dibujo: sombra(), densidad: 1.2 },
  { nombre: 'polizon-ojos', caja: [A.ojos[0][0] - 8, A.ojos[0][1] - 8, A.ojos[1][0] - A.ojos[0][0] + 16, 16], dibujo: ojos(), densidad: D * 2.6 },
  { nombre: 'polizon-pupila-1', caja: cajaOjo(A.ojos[0], 4), dibujo: pupila(0), densidad: D * 3 },
  { nombre: 'polizon-pupila-2', caja: cajaOjo(A.ojos[1], 4), dibujo: pupila(1), densidad: D * 3 },
  { nombre: 'polizon-parpado-1', caja: cajaOjo(A.ojos[0], 9), dibujo: parpado(0), densidad: D * 2.6 },
  { nombre: 'polizon-parpado-2', caja: cajaOjo(A.ojos[1], 9), dibujo: parpado(1), densidad: D * 2.6 },
  { nombre: 'polizon-brazo', caja: [A.cara[0] - 6, A.cara[1] - 2, 52, 52], dibujo: brazo(), densidad: D * 1.6 },
  { nombre: 'polizon-fosforo', caja: [A.fosforo[0] - 70, A.fosforo[1] - 34, 100, 54], dibujo: fosforo(), densidad: 1.6 },
  { nombre: 'polizon-cafe', caja: [A.cafe.adentro[0] - 54, A.cafe.adentro[1] - 18, 72, 28], dibujo: cafe(), densidad: D * 1.4 },
  { nombre: 'polizon-salero', caja: [A.salero.adentro[0] - 44, A.salero.adentro[1] - 24, 94, 40], dibujo: salero(), densidad: D * 1.4 },
  { nombre: 'polizon-bote', caja: [-180, -94, 428, 108], dibujo: bote(), densidad: D },
  { nombre: 'polizon-corona', caja: [A.corona[0] - 40, A.corona[1] - 66, 82, 70], dibujo: corona(), densidad: D * 1.3 },
];

const img = imagenesDe(PIEZAS_POLIZON);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El bote y su polizón armados con las marcas de un momento. */
function armado(m: Momento, seco: string): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('polizon-agua') +
    parte('ondas', img('polizon-ondas'), t.ondas, o.ondas) +
    // Lo de abajo del bote no pasa del agua: él está metido hasta el pecho.
    `<clipPath id="${seco}"><rect x="-280" y="-300" width="600" height="302"/></clipPath>` +
    `<g clip-path="url(#${seco})">` +
    parte('adentro', img('polizon-adentro'), t.adentro) +
    parte('polizon',
      parte('resplandor', img('polizon-resplandor'), '', o.resplandor) +
      img('polizon-cuerpo') +
      img('polizon-cabeza') +
      parte('sombra', img('polizon-sombra'), '', o.sombra) +
      img('polizon-ojos') +
      parte('pupila-1', img('polizon-pupila-1'), t['pupila-1']) +
      parte('pupila-2', img('polizon-pupila-2'), t['pupila-2']) +
      parte('parpado-1', img('polizon-parpado-1'), t['parpado-1']) +
      parte('parpado-2', img('polizon-parpado-2'), t['parpado-2']) +
      parte('brazo', img('polizon-brazo'), t.brazo, o.brazo),
      t.polizon, o.polizon) +
    // El fósforo lo prende a la altura de la rendija: no se agacha con él.
    parte('fosforo', img('polizon-fosforo'), '', o.fosforo) +
    `</g>` +
    parte('cafe', img('polizon-cafe'), t.cafe, o.cafe) +
    parte('salero', img('polizon-salero'), t.salero, o.salero) +
    parte('bote', img('polizon-bote') + parte('corona', img('polizon-corona'), t.corona), t.bote)
  );
}

/** El polizón en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function polizonEn(m: Momento = QUIETO, seco = 'polizon-seco'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, seco)}</g>`;
}

/** El títere que se toca, en la pose quieta: el bote cerrado, con la corona encima. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--polizon" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El polizón del remolque'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'polizon-seco')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el bote levantado, y él abajo, resplandeciendo, con el dedo en la boca. */
export const RETRATO = { caja: [POLIZON.x - 70, POLIZON.piso - 112, 200, 124] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/bajo-lejos.webp" x="-250" y="0" width="1450" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/bajo-agua.webp" x="-250" y="368" width="1450" height="272" preserveAspectRatio="none"/>` +
    polizonEn(ASOMA, 'polizon-seco-retrato')
  );
}

export const POLIZON_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-bajo',
  ancla: POLIZON.x,
  piezas: PIEZAS_POLIZON,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
