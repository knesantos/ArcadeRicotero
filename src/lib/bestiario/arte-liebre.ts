/**
 * La liebre muerta (`D-73`, vigesimoséptima vuelta), tendida en el borde de abajo del claro.
 *
 * *"¡Caras de liebre! ¿De liebre muerta? ¿A quién le importa?"* es de *Sorpresa de Shangai*, en *Lobo suelto,
 * cordero atado* (1993). Se toma al pie de la letra, y del mismo tema sale todo lo demás: *"voy a tumbarme a la
 * Bartola sobre unos terciopelos"* (está panza arriba sobre un retazo de terciopelo, con las patas al aire),
 * *"¡toda esta guinda!"* (tiene un montoncito de guindas al lado de la cabeza), *"mis penas como piedras caen,
 * ruedan y escapan"* (cada tanto le pasa una piedra rodando por delante) y *"el que abandona no tiene premio"*
 * (por eso no abandona: sigue muerta). Si está muerta o se hace, el lobo todavía no lo decidió: tiene la lengua
 * afuera y el ojo cerrado, pero el ojo se le abre solo cuando cree que nadie mira. Cuando la tocan se muere más
 * fuerte: las cuatro patas derechas para arriba, tiesa, temblando del esfuerzo. Después espía, levanta la cabeza,
 * mira para los dos lados, se come una guinda y se vuelve a morir.
 *
 * De la letra son la liebre, lo muerta, el terciopelo, tumbarse a la Bartola, la guinda y las piedras. Del dibujo
 * son los dientes de conejo, el pompón y que haga trampa.
 *
 * Viste *Lobo suelto*, medido con sharp: el pelo es el gris plata del lobo de la tapa, la panza y el pompón son su
 * crema, la sombra es el topo del fondo, y el terciopelo y las guindas son el magenta del sello de la contratapa,
 * que es el único color que tiene ese disco.
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio del lomo, y la cabeza va a la derecha (`rig-liebre.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli } from './trazos.ts';
import { LIEBRE, LIEBRE_ARMADO as A, QUIETO, TIESA, marcas, type Momento } from './rig-liebre.ts';

const ID = 'la-liebre-muerta';

/** Las tintas de *Lobo suelto* (`tokens.css`). */
const C = {
  gris: 'var(--bestia-liebre-gris)',
  grisHondo: 'var(--bestia-liebre-gris-hondo)',
  noche: 'var(--bestia-liebre-noche)',
  topo: 'var(--bestia-liebre-topo)',
  arena: 'var(--bestia-liebre-arena)',
  crema: 'var(--bestia-liebre-crema)',
  marfil: 'var(--bestia-liebre-marfil)',
  papel: 'var(--bestia-liebre-papel)',
  magenta: 'var(--bestia-liebre-magenta)',
  magentaHondo: 'var(--bestia-liebre-magenta-hondo)',
  rosa: 'var(--bestia-liebre-rosa)',
};

/** Un azar con semilla, para que el pelo caiga siempre igual. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pelo = (x: number, y: number, dx: number, dy: number, tinta: string, o = 0.7): string => trazo(`M${f(x)} ${f(y)} l${f(dx)} ${f(dy)}`, tinta, 1, o);

/* ------------------------------------------------------------------
   El terciopelo, las guindas y la piedra
   ------------------------------------------------------------------ */

/** El retazo de terciopelo: magenta, con el pelo peinado para un lado, los pliegues y el montón de guindas. */
function terciopelo(): string {
  const d = curva([[-124, 4], [-92, -10], [0, -14], [104, -12], [176, -4], [184, 10], [124, 20], [0, 22], [-104, 18]]);
  const rnd = azar(211);
  let peinado = '';
  for (let i = 0; i < 70; i++) {
    const x = -120 + rnd() * 300;
    const y = -12 + rnd() * 32;
    peinado += trazo(`M${f(x)} ${f(y)} l${f(5 + rnd() * 8)} ${f(1 + rnd() * 2)}`, i % 4 ? C.magentaHondo : C.rosa, 0.8, 0.3 + rnd() * 0.3);
  }
  const [gx, gy] = A.guinda;
  return conGrano(
    enmascarado('m-liebre-terciopelo', d,
      forma(d, C.magenta) + nube(20, 14, 150, 8, C.magentaHondo, 'm', 0.9) + nube(-60, -6, 50, 5, C.rosa, 'm', 0.35) + nube(0, 0, 80, 12, C.noche, 'l', 0.55) + peinado +
      trazo('M-100 -4 q30 8 60 2 M90 14 q30 -6 70 -2', C.rosa, 1.2, 0.4)) +
    // El ruedo deshilachado.
    trazo('M-124 4 l-8 4 M-118 12 l-8 6 M184 10 l8 2 M178 14 l8 6', C.magentaHondo, 1.2, 0.8) +
    // Las guindas de abajo del montón: dos, con su cabito.
    [[gx - 9, gy + 12], [gx + 8, gy + 13]].map(([x, y]) => forma(elipse(x!, y!, 7, 6.6), C.magentaHondo) + nube(x! - 2, y! - 2, 2.4, 2, C.rosa, 'xs', 0.7)).join('') +
    trazo(`M${gx - 9} ${gy + 6} q2 -8 8 -10 M${gx + 8} ${gy + 7} q-2 -8 -6 -11`, C.topo, 1.1, 0.9),
  );
}

/** La guinda de arriba del montón: la que se come. */
function guinda(): string {
  const [gx, gy] = A.guinda;
  return conGrano(forma(elipse(gx, gy, 7.4, 7), C.magenta) + nube(gx + 2, gy + 3, 4, 3, C.magentaHondo, 'xs', 0.7) + nube(gx - 2.4, gy - 2.6, 2.2, 1.8, C.marfil, 'xs', 0.85) + trazo(`M${gx} ${gy - 6} q3 -8 9 -9`, C.topo, 1.2, 0.9));
}

/** La piedra que rueda: una pena. Va dibujada en el (0, 0), que la corre la isla. */
function piedra(): string {
  const d = poli([[-9, 1], [-6, -6], [2, -8], [9, -3], [8, 5], [0, 8], [-7, 6]]);
  return conGrano(enmascarado('m-liebre-piedra', d, forma(d, C.topo) + nube(-2, -4, 6, 3, C.papel, 'xs', 0.6) + nube(3, 5, 6, 3, C.noche, 'xs', 0.7)) + trazo('M-3 -2 l4 3', C.noche, 0.8, 0.6));
}

/* ------------------------------------------------------------------
   La liebre: el pompón, las patas, el cuerpo, las orejas, la cabeza
   ------------------------------------------------------------------ */

function cola(): string {
  const [kx, ky] = A.cola;
  const rnd = azar(223);
  let pelos = '';
  for (let i = 0; i < 9; i++) pelos += pelo(kx - 8 + rnd() * 8, ky - 8 + rnd() * 16, -4 - rnd() * 3, -1 + rnd() * 2, C.marfil);
  return conGrano(forma(elipse(kx, ky, 11, 10), C.crema) + nube(kx + 3, ky + 4, 6, 5, C.arena, 'xs', 0.6) + nube(kx - 3, ky - 3, 4, 3, C.marfil, 'xs', 0.8) + pelos);
}

/** Una pata de atrás, derecha para arriba: el muslo, la caña larga y el pie enorme de liebre. `n` 0 es la de cerca. */
function pataTras(n: 0 | 1): string {
  const [cx, cy] = A.caderas[n];
  const d = curva([[cx - 14, cy + 4], [cx - 13, cy - 30], [cx - 8, cy - 62], [cx - 12, cy - 84], [cx - 8, cy - 100], [cx + 8, cy - 102], [cx + 12, cy - 86], [cx + 8, cy - 62], [cx + 13, cy - 30], [cx + 14, cy + 4]]);
  const tinta = n ? C.grisHondo : C.gris;
  return conGrano(
    enmascarado(`m-liebre-tras-${n}`, d, forma(d, tinta) + nube(cx + 6, cy - 40, 5, 40, C.noche, 's', n ? 0.6 : 0.4) + nube(cx - 4, cy - 20, 6, 16, C.crema, 's', n ? 0.2 : 0.5) +
      // La planta del pie, para arriba, con las almohadillas.
      nube(cx, cy - 92, 9, 8, C.crema, 's', 0.9)) +
    [[-4, -96], [3, -97], [0, -88]].map(([x, y]) => forma(elipse(cx + x!, cy + y!, 2.4, 2), C.rosa, 0.85)).join('') +
    [-6, 0, 6].map((x) => trazo(`M${cx + x} ${cy - 101} l0 -4`, C.noche, 1.2, 0.8)).join(''),
  );
}

/** Una pata de adelante: corta, con la manito doblada. */
function pataDel(n: 0 | 1): string {
  const [hx, hy] = A.hombros[n];
  const d = curva([[hx - 9, hy + 4], [hx - 8, hy - 24], [hx - 6, hy - 42], [hx + 2, hy - 48], [hx + 9, hy - 42], [hx + 8, hy - 24], [hx + 9, hy + 4]]);
  return conGrano(
    enmascarado(`m-liebre-del-${n}`, d, forma(d, n ? C.grisHondo : C.gris) + nube(hx + 4, hy - 20, 4, 20, C.noche, 's', n ? 0.6 : 0.35) + nube(hx, hy - 42, 6, 5, C.crema, 'xs', 0.8)) +
    [-3, 2].map((x) => trazo(`M${hx + x} ${hy - 47} l0 -3`, C.noche, 1, 0.8)).join(''),
  );
}

function cuerpo(): string {
  const d = curva([[-80, -22], [-68, -46], [-30, -58], [22, -56], [58, -46], [74, -30], [62, -10], [10, -3], [-52, -5]]);
  const rnd = azar(227);
  let pelos = '';
  for (let i = 0; i < 26; i++) pelos += pelo(-70 + rnd() * 130, -56 + rnd() * 8, -2 + rnd() * 4, -4 - rnd() * 4, i % 3 ? C.crema : C.marfil, 0.6);
  for (let i = 0; i < 14; i++) pelos += pelo(-60 + rnd() * 110, -6 + rnd() * 4, -3 + rnd() * 2, 3 + rnd() * 2, C.grisHondo, 0.6);
  return conGrano(
    enmascarado('m-liebre-cuerpo', d,
      forma(d, C.gris) + nube(-6, -8, 70, 10, C.noche, 'm', 0.75) + nube(-70, -24, 12, 14, C.grisHondo, 's', 0.6) +
      // La panza, para arriba: crema, con el ombligo.
      nube(-8, -52, 56, 12, C.crema, 'm', 0.95) + nube(-20, -56, 26, 5, C.marfil, 's', 0.6) + nube(60, -40, 12, 10, C.arena, 's', 0.45) +
      trazo('M-8 -46 l3 2 l-3 2', C.arena, 1, 0.8)) +
    pelos,
  );
}

/** Una oreja: larga, tirada en el terciopelo, con el adentro rosa. La 2 está quebrada. */
function oreja(n: 0 | 1): string {
  const [ox, oy] = A.orejas[n];
  const pts: Array<readonly [number, number]> = n
    ? [[ox - 4, oy - 6], [ox + 26, oy - 12], [ox + 52, oy - 8], [ox + 66, oy + 6], [ox + 72, oy + 16], [ox + 60, oy + 14], [ox + 46, oy + 4], [ox + 22, oy + 2], [ox - 2, oy + 6]]
    : [[ox - 4, oy - 7], [ox + 30, oy - 12], [ox + 62, oy - 8], [ox + 86, oy + 2], [ox + 90, oy + 9], [ox + 62, oy + 10], [ox + 28, oy + 6], [ox - 2, oy + 7]];
  const d = curva(pts);
  return conGrano(
    enmascarado(`m-liebre-oreja-${n}`, d, forma(d, n ? C.grisHondo : C.gris) + nube(ox + 44, oy + 1, 34, 4, C.rosa, 's', n ? 0.35 : 0.6) + nube(ox + 80, oy + 6, 8, 5, C.noche, 's', 0.7)) +
    pelo(ox + 30, oy - 12, 3, -4, C.crema) + pelo(ox + 50, oy - 10, 3, -4, C.crema),
  );
}

function cabeza(): string {
  const d = curva([[52, -42], [70, -58], [94, -60], [116, -50], [130, -34], [124, -18], [102, -9], [76, -8], [56, -18]]);
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  const [bx, by] = A.boca;
  const rnd = azar(229);
  let pelos = '';
  for (let i = 0; i < 8; i++) pelos += pelo(60 + rnd() * 40, -10 + rnd() * 3, -2 + rnd() * 3, 3 + rnd() * 2, C.grisHondo, 0.6);
  return conGrano(
    enmascarado('m-liebre-cabeza', d,
      forma(d, C.gris) + nube(84, -12, 30, 7, C.noche, 's', 0.7) + nube(100, -54, 22, 6, C.crema, 's', 0.9) + nube(122, -36, 9, 10, C.crema, 's', 0.8) + nube(66, -36, 10, 12, C.grisHondo, 's', 0.5) +
      // La ojera, para que el ojo cerrado se lea.
      nube(ex, ey, 11, 9, C.arena, 's', 0.5)) +
    pelos +
    // El ojo: grande, de costado, con el blanco de la tapa del lobo.
    forma(elipse(ex, ey, rx + 1.2, ry + 1.2), C.noche) + forma(elipse(ex, ey, rx, ry), C.marfil) +
    // La nariz rosa, el labio partido y los dos dientes de conejo, para arriba.
    forma(elipse(128, -36, 4.4, 3.6), C.rosa) + nube(127, -37.4, 1.6, 1, C.marfil, 'xs', 0.7) +
    trazo(`M126 -40 Q118 -47 ${bx + 3} ${by + 3} M118 -46 q-2 6 2 10`, C.noche, 1.3, 0.85) +
    forma(poli([[112, -51], [113, -60], [117.4, -59], [117, -49.6]]), C.marfil) + trazo('M115 -51 l0.4 -8', C.arena, 0.6, 0.8) +
    // Los bigotes, caídos.
    trazo('M124 -30 l16 6 M124 -28 l14 12 M122 -40 l18 -8', C.papel, 0.6, 0.55),
  );
}

/** La lengua, afuera: sale para arriba y se cae de costado, como en los dibujos. */
function lengua(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx - 3, by + 3], [bx + 4, by + 2], [bx + 3, by - 8], [bx - 4, by - 17], [bx - 13, by - 18], [bx - 14, by - 11], [bx - 7, by - 6]]);
  return conGrano(enmascarado('m-liebre-lengua', d, forma(d, C.rosa) + nube(bx - 10, by - 15, 5, 3, C.magenta, 'xs', 0.6) + trazo(`M${bx} ${by} Q${bx - 2} ${by - 10} ${bx - 10} ${by - 14}`, C.magenta, 0.9, 0.7)));
}

function parpado(): string {
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  return conGrano(forma(elipse(ex, ey, rx + 2.2, ry + 2.2), C.gris) + nube(ex, ey - 2, rx, 3, C.crema, 'xs', 0.5) + trazo(`M${ex - rx - 1.4} ${ey + 1.4} Q${ex} ${ey + ry + 2.6} ${ex + rx + 1.4} ${ey + 1.4}`, C.noche, 1.3) +
    // Las pestañas, que con el ojo cerrado son lo único que se le ve.
    [-5, -1.5, 2, 5.4].map((x) => trazo(`M${ex + x} ${ey + ry + 1.4} l${x > 0 ? 1 : -1} 3`, C.noche, 0.9, 0.9)).join(''));
}

function pupila(): string {
  const { centro: [ex, ey] } = A.ojo;
  return forma(elipse(ex, ey, 3.6, 3.8), C.noche) + forma(elipse(ex + 1.2, ey - 1.4, 1.1, 1.1), C.marfil);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const O = A.ojo.centro;

export const PIEZAS_LIEBRE: readonly Pieza[] = [
  { nombre: 'liebre-terciopelo', caja: [-136, -30, 332, 58], dibujo: terciopelo(), densidad: 1.8 },
  { nombre: 'liebre-guinda', caja: [A.guinda[0] - 10, A.guinda[1] - 18, 22, 28], dibujo: guinda(), densidad: D * 1.6 },
  { nombre: 'liebre-piedra', caja: [-12, -11, 24, 22], dibujo: piedra(), densidad: D * 1.6 },
  { nombre: 'liebre-cola', caja: [A.cola[0] - 18, A.cola[1] - 14, 32, 28], dibujo: cola(), densidad: D },
  { nombre: 'liebre-pata-tras-2', caja: [A.caderas[1][0] - 18, A.caderas[1][1] - 110, 36, 118], dibujo: pataTras(1), densidad: D },
  { nombre: 'liebre-pata-del-2', caja: [A.hombros[1][0] - 12, A.hombros[1][1] - 54, 24, 62], dibujo: pataDel(1), densidad: D },
  { nombre: 'liebre-oreja-2', caja: [A.orejas[1][0] - 8, A.orejas[1][1] - 18, 86, 40], dibujo: oreja(1), densidad: D },
  { nombre: 'liebre-oreja-1', caja: [A.orejas[0][0] - 8, A.orejas[0][1] - 18, 104, 34], dibujo: oreja(0), densidad: D },
  { nombre: 'liebre-cuerpo', caja: [-88, -66, 168, 70], dibujo: cuerpo(), densidad: D },
  { nombre: 'liebre-pata-tras-1', caja: [A.caderas[0][0] - 18, A.caderas[0][1] - 110, 36, 118], dibujo: pataTras(0), densidad: D },
  { nombre: 'liebre-cabeza', caja: [46, -66, 100, 64], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'liebre-lengua', caja: [A.boca[0] - 20, A.boca[1] - 24, 30, 30], dibujo: lengua(), densidad: D * 1.6 },
  { nombre: 'liebre-pupila', caja: [O[0] - 6, O[1] - 6, 12, 12], dibujo: pupila(), densidad: D * 2.4 },
  { nombre: 'liebre-parpado', caja: [O[0] - 12, O[1] - 11, 24, 24], dibujo: parpado(), densidad: D * 2 },
  { nombre: 'liebre-pata-del-1', caja: [A.hombros[0][0] - 12, A.hombros[0][1] - 54, 24, 62], dibujo: pataDel(0), densidad: D },
];

const img = imagenesDe(PIEZAS_LIEBRE);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La liebre armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('liebre-terciopelo') +
    parte('cuerpo',
      parte('cola', img('liebre-cola'), t.cola) +
      parte('pata-tras-2', img('liebre-pata-tras-2'), t['pata-tras-2']) +
      parte('pata-del-2', img('liebre-pata-del-2'), t['pata-del-2']) +
      parte('panza', img('liebre-cuerpo'), t.panza) +
      parte('pata-tras-1', img('liebre-pata-tras-1'), t['pata-tras-1']) +
      parte('cabeza',
        parte('oreja-2', img('liebre-oreja-2'), t['oreja-2']) +
        parte('oreja-1', img('liebre-oreja-1'), t['oreja-1']) +
        img('liebre-cabeza') +
        parte('lengua', img('liebre-lengua'), t.lengua) +
        parte('pupila', img('liebre-pupila'), t.pupila) +
        parte('parpado', img('liebre-parpado'), t.parpado),
        t.cabeza) +
      parte('pata-del-1', img('liebre-pata-del-1'), t['pata-del-1']),
      t.cuerpo) +
    parte('guinda', img('liebre-guinda'), t.guinda, o.guinda) +
    parte('piedra', img('liebre-piedra'), t.piedra, o.piedra)
  );
}

/** La liebre en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function liebreEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: tendida a la Bartola, con la lengua afuera. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--liebre" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'La liebre muerta'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: tiesa, con las cuatro patas para arriba y un ojo a medio abrir. */
export const RETRATO = { caja: [LIEBRE.x - 70, LIEBRE.piso - 74, 170, 96] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` +
    liebreEn(TIESA)
  );
}

export const LIEBRE_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-monte',
  ancla: LIEBRE.x,
  piezas: PIEZAS_LIEBRE,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
