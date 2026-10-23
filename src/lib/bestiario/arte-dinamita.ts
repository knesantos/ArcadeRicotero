/**
 * Mi perro dinamita (`D-73`, decimonovena vuelta), en la tierra del baldío.
 *
 * *"Mi perro dinamita"* es de *La mosca y la sopa* (1991), y **está soplado en las tintas de esa tapa**:
 * el rojo del sobre, las luces naranjas del escenario, el negro de la sala, el blanco del cañón de luz
 * de la derecha y el amarillo de las letras del rótulo. El pelo, que la tapa no tiene, es el sepia de la
 * foto del interior (el museo de La Plata), que es lo único de perro callejero que hay en el disco.
 *
 * Lo de dinamita se toma al pie de la letra, que es lo que hacía Rocambole: el cuerpo es un atado de
 * tres cartuchos rojos con dos vueltas de alambre, la cola es la mecha (*"no mueve el rabo con
 * docilidad"*: es una mecha, no se puede mover), y del cuello para adelante es un perro flaco, de hocico
 * largo y orejas de punta, con la trufa que le arde (*"con el hocico afiebrado"*). El cartucho del medio
 * lleva un rótulo negro torcido, con *DINAMITA* en el amarillo de las letras de la tapa: es el rótulo de
 * *La mosca y la sopa*, que también va torcido y pegado. Cuando explota, la estrella dice *BUM* en el
 * mismo amarillo.
 *
 * Coordenadas del títere: el (0, 0) es el piso entre las patas, arriba es negativo, y mira para la
 * izquierda (`DINAMITA_ARMADO`, `rig-dinamita.ts`). La explosión se dibuja en su (0, 0), que la isla pone
 * en el medio del atado.
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar, type P } from './pincel.ts';
import { marcoDelRecinto } from './rig.ts';
import { AULLA, DINAMITA_ARMADO as A, LUGAR, QUIETO, alRecinto, marcas, type Momento } from './rig-dinamita.ts';

const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas de la tapa y del interior de *La mosca y la sopa* (`tokens.css`). */
const C = {
  rojo: 'var(--bestia-dinamita-rojo)',
  hondo: 'var(--bestia-dinamita-rojo-hondo)',
  brasa: 'var(--bestia-dinamita-brasa)',
  naranja: 'var(--bestia-dinamita-naranja)',
  luces: 'var(--bestia-dinamita-luces)',
  amarillo: 'var(--bestia-dinamita-amarillo)',
  negro: 'var(--bestia-dinamita-negro)',
  foco: 'var(--bestia-dinamita-foco)',
  frio: 'var(--bestia-dinamita-foco-frio)',
  pelo: 'var(--bestia-dinamita-pelo)',
  medio: 'var(--bestia-dinamita-pelo-medio)',
  sombra: 'var(--bestia-dinamita-pelo-sombra)',
  claro: 'var(--bestia-dinamita-pelo-claro)',
  violeta: 'var(--entorno-baion-violeta)',
};

/* ------------------------------------------------------------------
   Herramientas
   ------------------------------------------------------------------ */

/** Una curva suave que pasa por todos los puntos (Catmull-Rom llevada a Bézier). */
function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

/** Un rectángulo de puntas redondas: un cartucho visto de costado. */
const cartucho = (x0: number, x1: number, y: number, r: number): string =>
  `M${f(x0 + r)} ${f(y - r)} L${f(x1)} ${f(y - r)} L${f(x1)} ${f(y + r)} L${f(x0 + r)} ${f(y + r)} A${f(r)} ${f(r)} 0 0 1 ${f(x0 + r)} ${f(y - r)} Z`;

/** El grano del papel de la tapa impresa: todo lo que se imprime lo lleva. */
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/**
 * El pelo del borde: mechones cortos que salen de la silueta para afuera, apuntando para `hacia`. Es lo
 * que hace que el perro tenga pelo de callejero y no contorno.
 */
function mechones(pts: readonly P[], n: number, largo: number, color: string, semilla: number, o = 0.85): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = pts[Math.floor(rnd() * pts.length)]!;
    const b = pts[(pts.indexOf(a) + 1) % pts.length]!;
    const k = rnd();
    const [x, y] = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    const l = largo * (0.5 + rnd() * 0.7);
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) - Math.PI / 2 + (rnd() - 0.5) * 0.9;
    s += trazo(`M${f(x)} ${f(y)} q${f(Math.cos(ang) * l * 0.5 + (rnd() - 0.5) * 2)} ${f(Math.sin(ang) * l * 0.5)} ${f(Math.cos(ang) * l)} ${f(Math.sin(ang) * l)}`, color, 0.7 + rnd() * 0.6, o);
  }
  return s;
}

/* ------------------------------------------------------------------
   Las letras del rótulo, a mano, en palotes: las de la tapa son finas y rectas
   ------------------------------------------------------------------ */

/** Cada letra en una caja de 3,4 × 7, con el (0, 0) arriba a la izquierda. */
const LETRAS: Readonly<Record<string, string>> = {
  D: 'M0 0 L0 7 L1.4 7 Q3.6 7 3.6 3.5 Q3.6 0 1.4 0 Z',
  I: 'M1.2 0 L1.2 7',
  N: 'M0 7 L0 0 L3.2 7 L3.2 0',
  A: 'M0 7 L1.7 0 L3.4 7 M0.8 4.4 L2.6 4.4',
  M: 'M0 7 L0 0 L1.7 4.2 L3.4 0 L3.4 7',
  T: 'M0 0 L3.6 0 M1.8 0 L1.8 7',
};
const ANCHO_LETRA: Readonly<Record<string, number>> = { D: 3.6, I: 2.4, N: 3.2, A: 3.4, M: 3.4, T: 3.6 };

/** Una palabra en palotes, desde (x, y), con la altura `alto` y el aire `aire` entre letras. */
function palabra(texto: string, x: number, y: number, alto: number, aire: number, color: string, grosor: number): string {
  const k = alto / 7;
  let corre = 0;
  let d = '';
  for (const l of texto) {
    d += `<path d="${LETRAS[l]}" transform="translate(${f(x + corre)} ${f(y)}) scale(${f(k)})"/>`;
    corre += (ANCHO_LETRA[l]! + aire) * k;
  }
  return `<g fill="none" stroke="${color}" stroke-width="${f(grosor / k)}" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
}

/* ------------------------------------------------------------------
   El atado: tres cartuchos, el alambre, el rótulo y el pelo del pecho
   ------------------------------------------------------------------ */

const { x0: X0, x1: X1, y: YS, radio: R } = A.cartuchos;

/** El pecho, de pelo: lo que une los cartuchos con el pescuezo. */
const PECHO: readonly P[] = [[-30, -94], [-40, -90], [-46, -80], [-46, -66], [-40, -54], [-30, -48], [-18, -50], [-18, -66], [-22, -86]];

/** La silueta del atado entero: los cartuchos y el pecho, para el tizne. */
const SILUETA_TRONCO = [...YS.map((y) => cartucho(X0, X1 + 3.6, y, R)), curva(PECHO)].join(' ');

function tronco(): string {
  const rnd = azar(1101);
  const uno = (y: number, i: number): string => {
    const d = cartucho(X0, X1, y, R);
    // La luz viene de arriba y de la izquierda, de las luces del escenario: el lomo del cartucho brilla
    // y la panza se hunde.
    return enmascarado(`m-din-cartucho-${i}`, d,
      forma(d, C.rojo) +
      nube((X0 + X1) / 2, y + R * 0.7, (X1 - X0) * 0.55, R * 0.55, C.hondo, 'm', 0.95) +
      nube((X0 + X1) / 2, y + R * 1.05, (X1 - X0) * 0.55, R * 0.35, C.brasa, 's', 0.8) +
      nube((X0 + X1) / 2 - 6, y - R * 0.45, (X1 - X0) * 0.48, R * 0.22, C.luces, 's', 0.9) +
      nube((X0 + X1) / 2 - 12, y - R * 0.55, (X1 - X0) * 0.22, R * 0.1, C.foco, 'xs', 0.75) +
      // El papel encerado del cartucho: unas vetas largas que se ven de cerca.
      Array.from({ length: 4 }, () => {
        const yy = y - R * 0.6 + rnd() * R * 1.2;
        const xa = X0 + 4 + rnd() * 20;
        return trazo(`M${f(xa)} ${f(yy)} L${f(xa + 18 + rnd() * 30)} ${f(yy + (rnd() - 0.5))}`, C.hondo, 0.6, 0.45);
      }).join('')) +
      // La punta de atrás, cortada: el papel plegado del cartucho, con su redondel.
      enmascarado(`m-din-punta-${i}`, elipse(X1, y, 3.6, R),
        forma(elipse(X1, y, 3.6, R), C.hondo) +
        nube(X1 + 0.6, y + 1, 2.4, R * 0.7, C.brasa, 's', 0.9) +
        trazo(`M${f(X1 - 1)} ${f(y - R + 1.4)} Q${f(X1 + 3)} ${f(y)} ${f(X1 - 1)} ${f(y + R - 1.4)}`, C.luces, 0.9, 0.8) +
        `<circle cx="${f(X1 + 0.4)}" cy="${f(y)}" r="1.1" fill="${C.negro}" opacity="0.8"/>`);
  };
  // El alambre: dos vueltas de cobre, torcido, que le aprieta el atado.
  const alambre = (x: number): string => {
    const arriba = YS[0]! - R - 0.6;
    const abajo = YS[2]! + R + 0.6;
    return (
      trazo(`M${f(x)} ${f(arriba)} Q${f(x + 2.4)} ${f((arriba + abajo) / 2)} ${f(x + 0.6)} ${f(abajo)}`, C.brasa, 2.6, 0.9) +
      trazo(`M${f(x)} ${f(arriba)} Q${f(x + 2.4)} ${f((arriba + abajo) / 2)} ${f(x + 0.6)} ${f(abajo)}`, C.naranja, 1.5, 1) +
      trazo(`M${f(x + 2.6)} ${f(arriba + 0.4)} Q${f(x + 5)} ${f((arriba + abajo) / 2)} ${f(x + 3.2)} ${f(abajo - 0.4)}`, C.naranja, 1.2, 0.85) +
      [-10, -2, 6, 14].map((dy) => trazo(`M${f(x - 0.4)} ${f(YS[1]! + dy * 1.6)} l2.6 -1.4`, C.foco, 0.6, 0.7)).join('') +
      // La punta torcida del alambre, que sobra.
      trazo(`M${f(x + 1)} ${f(abajo)} q3 3 1 6 q-2 2 1 3`, C.naranja, 1, 0.9)
    );
  };
  // El rótulo, como el de la tapa: negro, torcido, pegado sobre el cartucho del medio.
  const [rx, ry] = [-8, YS[1]! - 6.4];
  const rotulo =
    `<g transform="rotate(-7 ${f(rx + 19)} ${f(ry + 6)})">` +
    forma(`M${f(rx)} ${f(ry)} L${f(rx + 40)} ${f(ry - 0.6)} L${f(rx + 40.6)} ${f(ry + 12.4)} L${f(rx + 0.4)} ${f(ry + 13)} Z`, C.negro, 0.96) +
    palabra('DINAMITA', rx + 3, ry + 3, 7, 1.15, C.amarillo, 1) +
    nube(rx + 20, ry + 12, 20, 1.6, C.brasa, 's', 0.6) +
    `</g>`;
  // El pelo: el pecho de callejero, hirsuto, de donde sale el pescuezo.
  const pecho = curva(PECHO);
  const pelo =
    enmascarado('m-din-pecho', pecho,
      forma(pecho, C.medio) +
      nube(-40, -82, 6, 12, C.claro, 'm', 0.8) +
      nube(-34, -60, 8, 8, C.pelo, 'm', 0.85) +
      nube(-20, -70, 4, 18, C.sombra, 'm', 0.9) +
      nube(-30, -50, 12, 3, C.sombra, 's', 0.8) +
      mechones([[-40, -84], [-38, -72], [-30, -62], [-24, -56]], 26, 7, C.claro, 1121, 0.55)) +
    mechones(PECHO, 28, 5, C.medio, 1131, 0.9) +
    mechones(PECHO.slice(0, 5), 14, 4, C.claro, 1141, 0.7);
  return conGrano(
    YS.map((y, i) => uno(y, i)).join('') +
    // La sombra que se hace cada cartucho sobre el de abajo.
    nube((X0 + X1) / 2, YS[0]! + R + 0.5, (X1 - X0) * 0.5, 1.2, C.brasa, 'xs', 0.7) +
    nube((X0 + X1) / 2, YS[1]! + R + 0.5, (X1 - X0) * 0.5, 1.2, C.brasa, 'xs', 0.7) +
    alambre(-17) + alambre(31) +
    rotulo +
    pelo,
  );
}

/** El tizne de después de la explosión: hollín soplado, que solo agarra donde hay perro. */
function hollinTronco(): string {
  const rnd = azar(1201);
  let manchas = '';
  for (let i = 0; i < 16; i++) {
    const [x, y] = [X0 - 10 + rnd() * (X1 - X0 + 16), YS[0]! - R + rnd() * (YS[2]! - YS[0]! + R * 2 + 8)];
    manchas += nube(x, y, 4 + rnd() * 9, 3 + rnd() * 6, rnd() < 0.7 ? C.negro : C.brasa, rnd() < 0.6 ? 's' : 'm', 0.75 + rnd() * 0.25);
  }
  return conGrano(enmascarado('m-din-hollin-tronco', SILUETA_TRONCO, manchas + nube(X1, YS[1]!, 8, 20, C.negro, 'm', 0.9)));
}

/* ------------------------------------------------------------------
   La cabeza: el cráneo, el hocico largo y la oreja de allá
   ------------------------------------------------------------------ */

/** La cabeza con el pescuezo, de perfil, mirando a la izquierda. */
export const CABEZA: readonly P[] = [
  [-26, -92], [-34, -104], [-46, -116], [-58, -123], [-72, -123], [-82, -117], [-93, -110], [-102, -105], [-107, -101], [-106, -96],
  [-100, -95], [-88, -97], [-72, -98], [-62, -97], [-54, -91], [-46, -80], [-38, -70], [-28, -68], [-22, -80],
];

function orejaDe(base: P, punta: P, id: string, lejos: boolean): string {
  const o = curva([[base[0] - 7, base[1] + 2], [base[0] - 5, base[1] - 10], punta, [base[0] + 6, base[1] - 12], [base[0] + 8, base[1] + 3]]);
  const adentro = curva([[base[0] - 3, base[1]], [base[0] - 2, base[1] - 9], [punta[0] + 0.6, punta[1] + 6], [base[0] + 3, base[1] - 9], [base[0] + 4, base[1]]]);
  return enmascarado(id, o,
    forma(o, lejos ? C.sombra : C.medio) +
    forma(adentro, lejos ? C.brasa : C.hondo, lejos ? 0.7 : 0.85) +
    nube(base[0] + 3, base[1] - 10, 2.6, 10, C.rojo, 's', lejos ? 0.25 : 0.55) +
    (lejos ? '' : nube(base[0] - 5, base[1] - 8, 2, 9, C.claro, 's', 0.8))) +
    mechones([[base[0] - 7, base[1] + 2], [base[0] - 5, base[1] - 10], punta], 6, 3, lejos ? C.sombra : C.medio, 1300 + Math.round(base[0]), 0.9);
}

function cabeza(): string {
  const d = curva(CABEZA);
  const [ox, oy] = A.ojo.centro;
  const [rx, ry] = A.ojo.radio;
  const [tx, ty] = A.trufa;
  return conGrano(
    orejaDe([-48, -118], [-46, -146], 'm-din-oreja-lejos', true) +
    enmascarado('m-din-cabeza', d,
      forma(d, C.medio) +
      // El cráneo prendido de arriba, el cachete en la sombra, el pescuezo hondo.
      nube(-62, -116, 16, 6, C.claro, 'm', 0.7) +
      nube(-80, -110, 14, 4, C.pelo, 'm', 0.9) +
      nube(-60, -100, 10, 6, C.sombra, 'm', 0.7) +
      nube(-36, -84, 8, 16, C.sombra, 'm', 0.85) +
      nube(-30, -98, 4, 10, C.claro, 's', 0.6) +
      // El hocico afiebrado: el rojo de la tapa le sube desde la trufa, y arde.
      nube(tx + 6, ty + 1, 12, 6, C.rojo, 'm', 0.75) +
      nube(tx + 2, ty, 6, 4, C.luces, 's', 0.6) +
      // Los bigotes y los puntos de donde salen.
      [[-96, -99], [-92, -98], [-94, -102], [-90, -101]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.6" fill="${C.sombra}"/>`).join('') +
      // La cuenca del ojo y el ojo: blanco de cañón de luz, con el borde rojo de la fiebre.
      nube(ox, oy, rx + 4, ry + 3, C.sombra, 's', 0.8) +
      forma(elipse(ox, oy, rx, ry), C.foco) +
      nube(ox + 1, oy + 1, rx, ry * 0.6, C.frio, 'xs', 0.6) +
      trazo(`M${f(ox - rx - 0.6)} ${f(oy + 0.4)} Q${f(ox)} ${f(oy + ry + 1.4)} ${f(ox + rx + 0.4)} ${f(oy + 0.2)}`, C.rojo, 0.9, 0.85) +
      // La ceja, levantada: la cara de perro que no da la pata.
      trazo(`M${f(ox - 5)} ${f(oy - 4.6)} Q${f(ox)} ${f(oy - 7.4)} ${f(ox + 5)} ${f(oy - 5.6)}`, C.sombra, 1.6, 0.95) +
      // La comisura.
      trazo('M-64 -97 Q-70 -98 -76 -97.4', C.sombra, 1.1, 0.9)) +
    mechones(CABEZA.slice(0, 6), 22, 4, C.medio, 1311, 0.85) +
    mechones(CABEZA.slice(13), 16, 5, C.medio, 1321, 0.85) +
    // La trufa, negra y brillante, encima del hocico.
    forma(curva([[tx - 4, ty - 3], [tx + 2, ty - 4], [tx + 4, ty], [tx + 1, ty + 3], [tx - 4, ty + 2.4]]), C.negro) +
    nube(tx - 1, ty - 2, 1.6, 0.8, C.foco, 'xs', 0.85) +
    // Los bigotes, de un pelo, al aire.
    trazo('M-94 -99 Q-102 -92 -112 -91', C.claro, 0.5, 0.7) + trazo('M-92 -98 Q-98 -88 -106 -86', C.claro, 0.5, 0.6),
  );
}

function hollinCabeza(): string {
  const rnd = azar(1401);
  let manchas = '';
  for (let i = 0; i < 10; i++) {
    const [x, y] = [-104 + rnd() * 78, -124 + rnd() * 52];
    manchas += nube(x, y, 4 + rnd() * 7, 3 + rnd() * 5, rnd() < 0.75 ? C.negro : C.brasa, 's', 0.75 + rnd() * 0.25);
  }
  // El ojo queda limpio, que se vea que te mira desde adentro del tizne.
  const [ox, oy] = A.ojo.centro;
  return conGrano(
    enmascarado('m-din-hollin-cabeza', curva(CABEZA),
      manchas) +
    forma(elipse(ox, oy, A.ojo.radio[0], A.ojo.radio[1]), C.foco) +
    trazo(`M${f(ox - A.ojo.radio[0] - 0.6)} ${f(oy + 0.4)} Q${f(ox)} ${f(oy + A.ojo.radio[1] + 1.4)} ${f(ox + A.ojo.radio[0] + 0.4)} ${f(oy + 0.2)}`, C.rojo, 0.9, 0.85) +
    // Un pelito parado, chamuscado, en la coronilla.
    trazo('M-60 -123 q-1 -5 2 -8 q1 4 -1 8', C.negro, 1, 0.9) + trazo('M-66 -123 q-2 -4 0 -7', C.negro, 0.9, 0.8),
  );
}

/** La quijada, con los dientes de abajo y la lengua de afuera, colgando: la de un perro que jadea. */
export const QUIJADA: readonly P[] = [[-56, -98], [-72, -98], [-88, -97], [-99, -95], [-100, -91], [-92, -88], [-78, -87], [-64, -89], [-55, -93]];

function quijada(): string {
  const d = curva(QUIJADA);
  const lengua = curva([[-78, -95], [-88, -94], [-93, -88], [-92, -80], [-87, -78], [-83, -82], [-82, -90]]);
  return conGrano(
    // Adentro de la boca, lo oscuro, que se ve cuando la abre.
    forma(curva([[-58, -99], [-74, -100], [-96, -97], [-90, -92], [-70, -93]]), C.brasa) +
    enmascarado('m-din-lengua', lengua,
      forma(lengua, C.rojo) + nube(-88, -84, 4, 6, C.hondo, 's', 0.8) + nube(-86, -90, 2, 4, C.luces, 's', 0.7) +
      trazo('M-86 -93 Q-87 -86 -88 -80', C.hondo, 0.8, 0.8)) +
    enmascarado('m-din-quijada', d,
      forma(d, C.medio) + nube(-78, -88, 18, 3, C.sombra, 's', 0.85) + nube(-86, -96, 12, 1.6, C.claro, 's', 0.6)) +
    mechones(QUIJADA.slice(4), 8, 3.4, C.medio, 1501, 0.9) +
    // Los dientes de abajo, chiquitos, y el colmillo.
    [-96, -92, -86, -80].map((x, i) => forma(`M${x} -97 L${x + 1.4} ${i === 1 ? -102 : -99.6} L${x + 2.6} -97 Z`, C.foco, 0.95)).join(''),
  );
}

/** La oreja de acá, aparte: se para, se tuerce y se aplasta cuando aúlla. */
function oreja(): string {
  const [x, y] = A.oreja;
  return conGrano(orejaDe([x, y], [x + 2, y - 30], 'm-din-oreja', false));
}

/** La fiebre: un resplandor que le late en la trufa. Se suma a lo de abajo. */
function fiebre(): string {
  const [tx, ty] = A.trufa;
  return nube(tx, ty, 9, 6, C.rojo, 'm', 0.7) + nube(tx - 1, ty, 5, 3.4, C.luces, 's', 0.8) + nube(tx - 2, ty - 1, 2, 1.4, C.amarillo, 'xs', 0.7);
}

/* ------------------------------------------------------------------
   Las patas: finas, de callejero, cada una colgando de su hombro o su cadera
   ------------------------------------------------------------------ */

/** El contorno de una pata que se afina, de `a` a `b`, con su ancho en cada punta. */
function miembro(a: P, b: P, anchoA: number, anchoB: number): P[] {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / l, dx / l];
  return [
    [a[0] + (nx * anchoA) / 2, a[1] + (ny * anchoA) / 2],
    [b[0] + (nx * anchoB) / 2, b[1] + (ny * anchoB) / 2],
    [b[0] - (nx * anchoB) / 2, b[1] - (ny * anchoB) / 2],
    [a[0] - (nx * anchoA) / 2, a[1] - (ny * anchoA) / 2],
  ];
}

function pataDelantera(lejos: boolean): string {
  const [hx, hy] = A.hombro;
  const base = lejos ? C.sombra : C.medio;
  // El brazo baja derecho, con el codo marcado atrás y la muñeca que se quiebra un poco.
  const sil = curva([
    [hx - 7, hy - 4], [hx + 6, hy - 4], [hx + 6, hy + 14], [hx + 4, hy + 24], [hx + 2.6, hy + 46], [hx + 3, hy + 54], [hx - 1, hy + 60],
    [hx - 10, hy + 60.4], [hx - 11, hy + 57], [hx - 3, hy + 53], [hx - 3.6, hy + 44], [hx - 5, hy + 26], [hx - 8, hy + 12],
  ]);
  return conGrano(
    enmascarado(`m-din-pata-del-${lejos ? 'lejos' : 'cerca'}`, sil,
      forma(sil, base) +
      nube(hx - 4, hy + 20, 2.4, 22, lejos ? C.medio : C.claro, 's', 0.8) +
      nube(hx + 4, hy + 24, 3, 26, lejos ? C.negro : C.sombra, 's', 0.8) +
      nube(hx - 4, hy + 58, 6, 2.6, C.sombra, 's', 0.9) +
      [-8, -5, -2].map((dx) => trazo(`M${f(hx + dx)} ${f(hy + 57)} L${f(hx + dx - 0.6)} ${f(hy + 60.4)}`, C.negro, 0.7, 0.7)).join('')) +
    mechones(miembro([hx + 6, hy - 2], [hx + 4, hy + 30], 1, 1), 6, 3, base, 1601 + (lejos ? 1 : 0), 0.85),
  );
}

function pataTrasera(lejos: boolean): string {
  const [cx, cy] = A.cadera;
  const base = lejos ? C.sombra : C.medio;
  // El muslo para atrás, el garrón quebrado y el pie largo, como un perro flaco de costado.
  const sil = curva([
    [cx - 8, cy - 4], [cx + 8, cy - 6], [cx + 12, cy + 8], [cx + 9, cy + 22], [cx + 8, cy + 34], [cx + 4, cy + 46], [cx + 1, cy + 56], [cx + 1, cy + 60],
    [cx - 9, cy + 60.4], [cx - 9, cy + 57], [cx - 3, cy + 54], [cx, cy + 44], [cx + 2, cy + 34], [cx - 2, cy + 22], [cx - 7, cy + 10],
  ]);
  return conGrano(
    enmascarado(`m-din-pata-tra-${lejos ? 'lejos' : 'cerca'}`, sil,
      forma(sil, base) +
      nube(cx, cy + 6, 8, 10, lejos ? C.medio : C.pelo, 'm', 0.8) +
      nube(cx - 2, cy + 8, 3, 9, lejos ? C.medio : C.claro, 's', 0.7) +
      nube(cx + 9, cy + 20, 3, 20, lejos ? C.negro : C.sombra, 's', 0.85) +
      nube(cx - 3, cy + 58, 6, 2.6, C.sombra, 's', 0.9) +
      [-7, -4, -1].map((dx) => trazo(`M${f(cx + dx)} ${f(cy + 57)} L${f(cx + dx - 0.6)} ${f(cy + 60.4)}`, C.negro, 0.7, 0.7)).join('')) +
    mechones(miembro([cx + 12, cy + 6], [cx + 9, cy + 30], 1, 1), 6, 3, base, 1611 + (lejos ? 1 : 0), 0.85),
  );
}

/* ------------------------------------------------------------------
   La chispa de la mecha
   ------------------------------------------------------------------ */

/** La chispa de la punta de la mecha, en su (0, 0): rayitos blancos del cañón de luz y el naranja. */
function chispa(): string {
  const rnd = azar(1701);
  let rayos = '';
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + rnd() * 0.3;
    const l = 5 + rnd() * 9;
    rayos += trazo(`M${f(Math.cos(a) * 1.6)} ${f(Math.sin(a) * 1.6)} L${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`, i % 3 ? C.amarillo : C.foco, 0.8, 0.95);
  }
  return nube(0, 0, 9, 9, C.naranja, 'm', 0.8) + nube(0, 0, 4, 4, C.amarillo, 's', 0.95) + rayos + nube(0, 0, 2, 2, C.foco, 'xs', 1);
}

/* ------------------------------------------------------------------
   La explosión: el fogonazo, la estrella del BUM, las esquirlas y el humo
   ------------------------------------------------------------------ */

/** El fogonazo: una bola soplada, blanca adentro, que pasa por el amarillo y las luces hasta el rojo. */
function fogonazo(): string {
  return (
    nube(0, 0, 108, 92, C.rojo, 'xl', 0.75) +
    nube(0, -6, 84, 72, C.naranja, 'xl', 0.9) +
    nube(-6, -10, 58, 50, C.luces, 'l', 0.95) +
    nube(-4, -8, 38, 34, C.amarillo, 'l', 1) +
    nube(-4, -6, 20, 18, C.foco, 'm', 1)
  );
}

/** La estrella dentada del BUM, con las letras en el negro de la sala. */
function estrella(): string {
  const rnd = azar(1801);
  const puntas: P[] = [];
  const n = 18;
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? 44 + rnd() * 10 : 74 + rnd() * 22;
    puntas.push([Math.cos(a) * r * 1.15, Math.sin(a) * r * 0.86]);
  }
  const d = `M${puntas.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
  const adentro = `M${puntas.map(([x, y]) => `${f(x * 0.62)} ${f(y * 0.62)}`).join(' L')} Z`;
  // Las tres letras, gordas y torcidas, en una caja de 34 de alto.
  const B = 'M0 0 L0 34 M0 1 Q15 0 15 8.5 Q15 16 1 16 Q17 16 17 25 Q17 34 0 33';
  const U = 'M0 0 L0 23 Q0 34 9.5 34 Q19 34 19 23 L19 0';
  const M = 'M0 34 L0 1 L11.5 21 L23 1 L23 34';
  return conGrano(
    enmascarado('m-din-estrella', d,
      forma(d, C.amarillo) +
      nube(0, 0, 100, 80, C.luces, 'l', 0.55) +
      forma(adentro, C.amarillo) +
      nube(-10, -8, 40, 26, C.foco, 'm', 0.85)) +
    // El borde de la estrella, quemado: el rojo de la tapa, apenas.
    `<path d="${d}" fill="none" stroke="${C.rojo}" stroke-width="2.4" stroke-linejoin="miter" opacity="0.9"/>` +
    `<g transform="rotate(-9) translate(-38 -17)" fill="none" stroke="${C.negro}" stroke-width="7.2" stroke-linecap="square" stroke-linejoin="miter">` +
    `<path d="${B}"/><path d="${U}" transform="translate(25 0)"/><path d="${M}" transform="translate(52 0)"/></g>`,
  );
}

/** Las esquirlas: los rayos que salen disparados, chispas, y pedacitos de cartucho y de alambre. */
function esquirlas(): string {
  const rnd = azar(1901);
  let s = '';
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + rnd() * 0.2;
    const [r0, r1] = [40 + rnd() * 20, 96 + rnd() * 54];
    const [c, sn] = [Math.cos(a), Math.sin(a) * 0.86];
    s += trazo(`M${f(c * r0)} ${f(sn * r0)} L${f(c * r1)} ${f(sn * r1)}`, i % 2 ? C.amarillo : C.luces, 1.2 + rnd() * 1.8, 0.9);
    s += `<circle cx="${f(c * (r1 + 6))}" cy="${f(sn * (r1 + 6))}" r="${f(1 + rnd() * 1.6)}" fill="${C.foco}"/>`;
  }
  // Los pedazos: papel rojo de cartucho, retorcido, y vueltas de alambre.
  for (let i = 0; i < 7; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 70 + rnd() * 60;
    const [x, y] = [Math.cos(a) * r, Math.sin(a) * r * 0.8];
    s += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rnd() * 360)})">` +
      (i % 3 === 2
        ? trazo('M-5 0 q2.5 -4 5 0 q2.5 4 5 0', C.naranja, 1.3, 1)
        : forma('M-6 -3 L5 -4 L7 2 L-4 4 Z', C.rojo) + forma('M-6 -3 L5 -4 L5.4 -2 L-5.6 -1.4 Z', C.luces, 0.8)) +
      `</g>`;
  }
  return s;
}

/**
 * El humo: bocanadas redondas de borde duro, como Rocambole tapaba con una máscara de papel, y el volumen
 * soplado adentro: el gris del cañón de luz arriba, el negro de la sala en la panza, y abajo el naranja del
 * fuego que todavía la prende.
 */
function humo(): string {
  const bocanadas: Array<[number, number, number]> = [
    [0, -24, 46], [-42, -4, 34], [42, -6, 36], [-24, -60, 34], [24, -64, 38], [-2, -100, 30], [-62, -36, 24], [64, -40, 26], [-14, 14, 28], [22, 12, 24], [40, -98, 18], [-44, -88, 18],
  ];
  const d = bocanadas.map(([x, y, r]) => elipse(x, y, r, r * 0.9)).join(' ');
  let volumen = forma(d, C.sombra);
  for (const [x, y, r] of bocanadas) {
    volumen +=
      nube(x - r * 0.2, y - r * 0.32, r * 0.75, r * 0.55, C.frio, 'm', 0.75) +
      nube(x - r * 0.35, y - r * 0.5, r * 0.32, r * 0.22, C.foco, 's', 0.6) +
      nube(x + r * 0.3, y + r * 0.45, r * 0.7, r * 0.4, C.negro, 'm', 0.7);
  }
  volumen += nube(0, 26, 72, 26, C.naranja, 'l', 0.65) + nube(0, 32, 40, 14, C.rojo, 'm', 0.6) + nube(34, -60, 30, 44, C.violeta, 'l', 0.35);
  return conGrano(
    enmascarado('m-din-humo', d, volumen) +
    // Las hebras que se despegan del borde: el humo que se deshace.
    nube(-70, -70, 14, 10, C.frio, 'm', 0.4) + nube(70, -80, 12, 9, C.frio, 'm', 0.4) + nube(0, -138, 16, 12, C.frio, 'm', 0.35),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/**
 * La densidad: el perro va a 0,62 de su medida, y la escena lo muestra a unos 2,6 px de pantalla por
 * unidad del recinto. La cabeza, que es lo que se mira, va más fina; la explosión, que es soplo, más gruesa.
 */
const D = 2.4;
const Q = 86;
const [HX, HY] = A.hombro;
const [CX, CY] = A.cadera;

export const PIEZAS_DINAMITA: readonly Pieza[] = [
  { nombre: 'dinamita-tronco', caja: [-54, -100, 104, 58], dibujo: tronco(), densidad: D * 1.3, calidad: Q },
  { nombre: 'dinamita-hollin-tronco', caja: [-54, -100, 104, 58], dibujo: hollinTronco(), densidad: D * 0.8 },
  { nombre: 'dinamita-cabeza', caja: [-116, -154, 98, 90], dibujo: cabeza(), densidad: D * 1.5, calidad: Q },
  { nombre: 'dinamita-hollin-cabeza', caja: [-116, -136, 98, 72], dibujo: hollinCabeza(), densidad: D * 0.8 },
  { nombre: 'dinamita-quijada', caja: [-104, -106, 54, 32], dibujo: quijada(), densidad: D * 1.5, calidad: Q },
  { nombre: 'dinamita-oreja', caja: [-68, -158, 26, 44], dibujo: oreja(), densidad: D * 1.5, calidad: Q },
  { nombre: 'dinamita-fiebre', caja: [A.trufa[0] - 24, A.trufa[1] - 20, 48, 40], dibujo: fiebre(), densidad: 1.2 },
  { nombre: 'dinamita-pata-del-cerca', caja: [HX - 16, HY - 8, 28, 72], dibujo: pataDelantera(false), densidad: D, calidad: Q },
  { nombre: 'dinamita-pata-del-lejos', caja: [HX - 16, HY - 8, 28, 72], dibujo: pataDelantera(true), densidad: D, calidad: Q },
  { nombre: 'dinamita-pata-tra-cerca', caja: [CX - 14, CY - 10, 32, 74], dibujo: pataTrasera(false), densidad: D, calidad: Q },
  { nombre: 'dinamita-pata-tra-lejos', caja: [CX - 14, CY - 10, 32, 74], dibujo: pataTrasera(true), densidad: D, calidad: Q },
  { nombre: 'dinamita-chispa', caja: [-20, -20, 40, 40], dibujo: chispa(), densidad: 3 },
  { nombre: 'dinamita-fogonazo', caja: [-170, -150, 340, 290], dibujo: fogonazo(), densidad: 0.7 },
  { nombre: 'dinamita-estrella', caja: [-120, -96, 240, 192], dibujo: estrella(), densidad: 1.6, calidad: Q },
  { nombre: 'dinamita-esquirlas', caja: [-170, -140, 340, 280], dibujo: esquirlas(), densidad: 1.2 },
  { nombre: 'dinamita-humo', caja: [-150, -170, 300, 250], dibujo: humo(), densidad: 0.7 },
];

const img = imagenesDe(PIEZAS_DINAMITA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El perro y su explosión armados con las marcas de un momento (`marcas`, `rig-dinamita.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o, d } = marcas(m);
  const [ox, oy] = A.ojo.centro;
  const [rx, ry] = A.ojo.radio;
  return (
    parte('perro',
      parte('pata-del-lejos', img('dinamita-pata-del-lejos'), t['pata-del-lejos']) +
      parte('pata-tra-lejos', img('dinamita-pata-tra-lejos'), t['pata-tra-lejos']) +
      parte('tronco',
        // La mecha sale del cartucho del medio por atrás: va primero, que el cartucho le tape la raíz.
        `<path data-parte="mecha" d="${d.mecha}" class="bt-dinamita-mecha"/>` +
        `<path data-parte="mecha-trenza" d="${d.mecha}" class="bt-dinamita-trenza"/>` +
        parte('chispa', img('dinamita-chispa'), t.chispa, o.chispa) +
        img('dinamita-tronco') +
        parte('hollin-tronco', img('dinamita-hollin-tronco'), '', o['hollin-tronco']),
        t.tronco) +
      parte('pata-tra-cerca', img('dinamita-pata-tra-cerca'), t['pata-tra-cerca']) +
      parte('pata-del-cerca', img('dinamita-pata-del-cerca'), t['pata-del-cerca']) +
      parte('cabeza',
        parte('quijada', img('dinamita-quijada'), t.quijada) +
        img('dinamita-cabeza') +
        parte('hollin-cabeza', img('dinamita-hollin-cabeza'), '', o['hollin-cabeza']) +
        parte('pupila', `<circle r="1.9" class="bt-dinamita-pupila"/><circle cx="-0.6" cy="-0.7" r="0.55" class="bt-dinamita-brillo"/>`, t.pupila) +
        `<ellipse data-parte="parpado" cx="${ox}" cy="${oy}" rx="${f(rx + 0.6)}" ry="${f(ry + 0.5)}" class="bt-dinamita-parpado" transform="${t.parpado}"/>` +
        parte('fiebre', img('dinamita-fiebre'), '', o.fiebre) +
        parte('oreja', img('dinamita-oreja'), t.oreja),
        t.cabeza),
      t.perro) +
    // La explosión, que no se da vuelta con el perro: no se toca, y sin explotar no se ve.
    parte('estallido',
      parte('humo', img('dinamita-humo'), t.humo, o.humo) +
      parte('esquirlas', img('dinamita-esquirlas'), t.esquirlas, o.esquirlas) +
      parte('fogonazo', img('dinamita-fogonazo'), t.fogonazo, o.fogonazo) +
      parte('estrella', img('dinamita-estrella'), t.estrella, o.estrella),
      t.estallido)
  );
}

/** El perro en cualquier momento, sin lo que lo hace tocable: para el test y para el retrato. */
export function dinamitaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: parado en la tierra, con la mecha dura y apagada. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--dinamita" data-id="mi-perro-dinamita" role="button" tabindex="0" aria-label="${nombres.get('mi-perro-dinamita') ?? 'Mi perro dinamita'}">` +
    // El toque es el perro, no la explosión: un rectángulo que no se ve, del tamaño del perro parado.
    `<rect class="bt-dinamita-toque" x="${f(LUGAR.x - 116 * LUGAR.escala)}" y="${f(LUGAR.piso - 160 * LUGAR.escala)}" width="${f(206 * LUGAR.escala)}" height="${f(166 * LUGAR.escala)}"/>` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: aullando, tiznado, con la mecha corta y otra vez prendida. */
export const RETRATO_MOMENTO: Momento = { ...AULLA, chispa: { k: 1.2, o: 1 } };
export const RETRATO = (() => {
  const [x0, y0] = alRecinto([-122, -178]);
  const [x1, y1] = alRecinto([96, 16]);
  return { caja: [Math.round(x0), Math.round(y0), Math.round(x1 - x0), Math.round(y1 - y0)] as const };
})();
function retrato(): string {
  const { ancho } = marcoDelRecinto('los-techos');
  return `<image href="/bestiario/baldio-lejos.webp" x="0" y="0" width="${ancho}" height="640" preserveAspectRatio="none"/>` + dinamitaEn(RETRATO_MOMENTO);
}

export const DINAMITA: Personaje = {
  id: 'mi-perro-dinamita',
  region: 'los-techos',
  ancla: LUGAR.x,
  piezas: PIEZAS_DINAMITA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
