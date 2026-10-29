/**
 * Mandinga (`D-73`, vigesimosegunda vuelta), parado en el damero del infierno.
 *
 * *"Mandinga lo pone así, siniestro pero gentil, una sombra chinesca que le encandila a su muerte y se va"* es
 * de *Rato molhado*, en *Momo sampler* (2000). Por eso Mandinga **es** una sombra chinesca: un títere de
 * recorte, de perfil, sostenido con varillas desde abajo, como los de las funciones de sombras. El recorte es
 * el violeta casi negro de la contratapa de *Momo sampler*, y el calado y los cantos son la plata del medallón
 * del frente, medidos con sharp.
 *
 * De la letra son lo siniestro y lo gentil, la sombra chinesca, que encandila y se va, la risa y el
 * cascabel, la manga con que se seca la nariz y la cara tan expresiva como el par de sus botas nuevas: por eso
 * la cara es un perfil quieto y las botas son lo único que brilla, de charol. Del dibujo, el sombrero de ala
 * ancha, el poncho con la guarda pampa calada, las espuelas, el candil en el piso y que la sombra de la pared
 * tiene la cola y las garras que el títere no muestra.
 *
 * Coordenadas: el (0, 0) es el piso entre las botas, y mira a la izquierda (`rig-mandinga.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { GENTIL, MANDINGA, MANDINGA_ARMADO as A, QUIETO, marcas, type Momento } from './rig-mandinga.ts';

/** Las tintas de *Momo sampler* (`tokens.css`), y el fuego del infierno para el candil. */
const C = {
  recorte: 'var(--bestia-mandinga-recorte)',
  negro: 'var(--bestia-mandinga-negro)',
  violeta: 'var(--bestia-mandinga-violeta)',
  plata: 'var(--bestia-mandinga-plata)',
  plataClara: 'var(--bestia-mandinga-plata-clara)',
  plataHonda: 'var(--bestia-mandinga-plata-honda)',
  plataMedia: 'var(--bestia-mandinga-plata-media)',
  papel: 'var(--bestia-mandinga-papel)',
  fuego: 'var(--entorno-infierno-fuego)',
  brasa: 'var(--entorno-infierno-brasa)',
};

/** El calado: puntitos de plata en fila sobre una línea, como los agujeros del cuero de un títere de sombras. */
function calado(pts: readonly P[], paso = 4.2, r = 0.9, o = 0.9): string {
  let s = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / paso));
    for (let j = 0; j < n; j++) s += `<circle cx="${(x0 + ((x1 - x0) * j) / n).toFixed(1)}" cy="${(y0 + ((y1 - y0) * j) / n).toFixed(1)}" r="${r}" fill="${C.plataClara}" opacity="${o}"/>`;
  }
  return s;
}

/** El canto de plata de una pieza recortada: el filo que agarra la luz del fuego. */
const canto = (d: string, ancho = 1.4, o = 0.85): string => trazo(d, C.plata, ancho, o);

/* ------------------------------------------------------------------
   El cuerpo: las botas nuevas, las bombachas y el poncho
   ------------------------------------------------------------------ */

/** Las botas nuevas, de charol: lo único que brilla. Con las espuelas de rodaja. */
function botas(): string {
  const bota = (pts: readonly P[], id: string, luz: number): string => {
    const d = curva(pts, true);
    return enmascarado(id, d, forma(d, C.negro) + nube(luz, -30, 2.4, 16, C.papel, 's', 0.95) + nube(luz + 4, -8, 8, 2, C.plataClara, 's', 0.9) + nube(luz - 6, -40, 3, 4, C.plata, 's', 0.7)) + canto(d, 1);
  };
  const rodaja = ([x, y]: P): string =>
    trazo(`M${x - 6} ${y} L${x + 6} ${y} M${x} ${y - 6} L${x} ${y + 6} M${x - 4.2} ${y - 4.2} L${x + 4.2} ${y + 4.2} M${x - 4.2} ${y + 4.2} L${x + 4.2} ${y - 4.2}`, C.plataClara, 1.1) + forma(elipse(x, y, 1.6, 1.6), C.plata);
  return conGrano(
    bota([[-38, 0], [-38, -6], [-26, -12], [-22, -50], [-6, -50], [-4, -10], [0, 0]], 'm-mand-bota-1', -14) +
    bota([[4, 0], [4, -48], [18, -48], [20, -12], [28, -6], [28, 0]], 'm-mand-bota-2', 10) +
    trazo('M0 -8 L6 -8 M28 -8 L34 -8', C.plata, 1) + rodaja([7, -8]) + rodaja([35, -8]),
  );
}

function cuerpo(): string {
  const bombachas = curva([[-24, -48], [-28, -76], [-22, -104], [24, -104], [28, -76], [22, -46], [6, -50], [-6, -50]]);
  const poncho = curva([[-22, -190], [20, -190], [36, -150], [50, -100], [20, -92], [-12, -80], [-40, -94], [-54, -104], [-36, -150]]);
  // La guarda pampa: los escalones del tejido, calados en una franja paralela al borde de abajo.
  const guarda: P[] = [];
  for (let i = 0; i <= 16; i++) {
    const x = -50 + i * 6;
    const base = x < -12 ? -100 + (x + 50) * 0.42 : -84 + (x + 12) * -0.2;
    guarda.push([x, base - 8 - (i % 2) * 6], [x + 3, base - 8 - (i % 2) * 6]);
  }
  const flecos = Array.from({ length: 18 }, (_, i) => {
    const x = -52 + i * 5.8;
    const y = x < -12 ? -102 + (x + 52) * 0.5 : -82 + (x + 12) * -0.24;
    return trazo(`M${x} ${y} l${-1 + (i % 3)} 8`, C.plataMedia, 0.9, 0.9);
  }).join('');
  return conGrano(
    enmascarado('m-mand-bombachas', bombachas, forma(bombachas, C.recorte) + calado([[-18, -60], [-20, -96]], 5) + calado([[18, -60], [20, -96]], 5)) + canto(bombachas) +
    enmascarado('m-mand-poncho', poncho, forma(poncho, C.recorte) + nube(30, -130, 16, 40, C.negro, 'm', 0.7) + nube(-26, -170, 12, 14, C.violeta, 'm', 0.7) +
      calado(guarda, 3.2, 0.9) +
      // El rombo del medio, calado, y la abertura del cuello.
      calado([[-6, -160], [6, -146], [-6, -132], [-18, -146], [-6, -160]], 3.2, 1) + calado([[-6, -152], [-1, -146], [-6, -140], [-11, -146], [-6, -152]], 2.6, 0.7)) +
    canto(poncho, 1.6) + flecos +
    // La varilla del cuerpo, de madera, que lo sostiene desde abajo del piso.
    trazo(`M${A.varilla[0]} ${A.varilla[1]} L${A.varilla[0] + 4} 60`, C.plataHonda, 2.6) + trazo(`M${A.varilla[0] - 0.6} ${A.varilla[1]} L${A.varilla[0] + 3.4} 60`, C.plata, 0.6, 0.6),
  );
}

/* ------------------------------------------------------------------
   Los brazos, con sus varillas
   ------------------------------------------------------------------ */

function tramo([ax, ay]: P, [bx, by]: P, a0: number, a1: number): string {
  const ang = Math.atan2(by - ay, bx - ax);
  const [nx, ny] = [-Math.sin(ang), Math.cos(ang)];
  return poli([[ax + nx * a0, ay + ny * a0], [bx + nx * a1, by + ny * a1], [bx - nx * a1, by - ny * a1], [ax - nx * a0, ay - ny * a0]]);
}

function brazo(n: 0 | 1): string {
  const d = tramo(A.hombros[n], A.codos[n], 8, 6);
  return conGrano(enmascarado(`m-mand-brazo-${n}`, d, forma(d, C.recorte) + calado([A.hombros[n], A.codos[n]], 4.4, 0.8, 0.7)) + canto(d, 1.1) + forma(elipse(A.codos[n][0], A.codos[n][1], 4, 4), C.plata));
}

/** El antebrazo con la mano de dedos largos, y la varilla de la mano, que baja hasta abajo del piso. */
function antebrazo(n: 0 | 1): string {
  const [ex, ey] = A.codos[n];
  const [hx, hy] = A.manos[n];
  const d = tramo([ex, ey], [hx, hy], 6, 4.4);
  const s = n === 0 ? -1 : 1;
  const mano = curva([[hx - 5, hy - 3], [hx + 5, hy - 4], [hx + s * 10, hy + 6], [hx + s * 6, hy + 4], [hx + s * 8, hy + 12], [hx + s * 3, hy + 6], [hx, hy + 12], [hx - 2, hy + 5], [hx - s * 6, hy + 8]]);
  return conGrano(
    enmascarado(`m-mand-ante-${n}`, d, forma(d, C.recorte)) + canto(d, 1) +
    // La manga con el puño calado: con esa se seca la nariz.
    calado([[ex + (hx - ex) * 0.7 - 5, ey + (hy - ey) * 0.7], [ex + (hx - ex) * 0.7 + 5, ey + (hy - ey) * 0.7 - 2]], 2.2, 0.9) +
    forma(mano, C.recorte) + canto(mano, 0.9),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el perfil quieto, los cuernos, el sombrero y el cascabel
   ------------------------------------------------------------------ */

const PERFIL: readonly P[] = [[14, -238], [8, -250], [-8, -254], [-22, -248], [-28, -236], [-30, -230], [-44, -222], [-32, -218], [-30, -214], [-40, -210], [-32, -207], [-30, -204], [-38, -190], [-24, -198], [-12, -198], [-2, -194], [10, -200], [16, -214]];

function cabeza(): string {
  const d = curva(PERFIL);
  // El ojo: una almendra calada, quieta, tan expresiva como una bota.
  const ojo = calado([[-26, -232], [-20, -235], [-14, -232], [-20, -229], [-26, -232]], 1.6, 0.8, 1) + forma(elipse(-20, -232, 1.2, 1.2), C.plataClara);
  // Los cuernos: cortos, curvos, de plata, escondidos debajo de la copa del sombrero.
  const cuerno = (pts: readonly P[], id: string): string => {
    const c = curva(pts);
    return enmascarado(id, c, forma(c, C.plataMedia) + nube(pts[1]![0], pts[1]![1], 3, 8, C.plataClara, 's', 0.9) + nube(pts[0]![0], pts[0]![1], 5, 4, C.plataHonda, 's', 0.9));
  };
  return conGrano(
    // De cabra, gruesos en la base y curvados para atrás: con el sombrero puesto apenas asoma la punta.
    cuerno([[-14, -250], [-12, -272], [2, -288], [20, -286], [26, -274], [14, -278], [2, -272], [-2, -252]], 'm-mand-cuerno-1') +
    calado([[-10, -262], [-4, -274], [6, -282], [16, -282]], 3.2, 0.6, 0.7) +
    enmascarado('m-mand-cara', d, forma(d, C.recorte) + nube(8, -224, 10, 20, C.negro, 'm', 0.6) + nube(-24, -244, 8, 4, C.violeta, 's', 0.8)) +
    canto(d, 1.3) + ojo +
    // El bigote, de puntas para arriba, y la pera en punta: calados.
    calado([[-30, -212], [-38, -214], [-44, -220]], 1.8, 0.7) + calado([[-30, -200], [-36, -194]], 1.8, 0.7) +
    // La arruga de la risa, que no le mueve la cara.
    calado([[-24, -216], [-22, -208]], 1.8, 0.6, 0.7),
  );
}

function sombrero(): string {
  const [kx, ky] = A.copa;
  const ala = curva([[kx - 50, ky + 2], [kx - 30, ky - 4], [kx + 30, ky - 4], [kx + 46, ky + 2], [kx + 30, ky + 6], [kx - 30, ky + 6]]);
  const copa = curva([[kx - 20, ky - 2], [kx - 16, ky - 34], [kx + 14, ky - 36], [kx + 18, ky - 2]]);
  return conGrano(
    enmascarado('m-mand-copa', copa, forma(copa, C.recorte) + nube(kx - 8, ky - 24, 6, 10, C.violeta, 'm', 0.8)) + canto(copa, 1.2) +
    // La cinta, calada.
    calado([[kx - 19, ky - 8], [kx + 17, ky - 8]], 2.6, 0.9) +
    enmascarado('m-mand-ala', ala, forma(ala, C.recorte) + nube(kx, ky + 2, 40, 2, C.negro, 's', 0.7)) + canto(ala, 1.2) +
    trazo(`M${A.cascabel[0]} ${A.cascabel[1] + 2} l0 2`, C.plata, 0.8),
  );
}

/** El cascabel, colgando del ala en un hilo: la risa y el cascabel. */
function cascabel(): string {
  const [qx, qy] = A.cascabel;
  return conGrano(trazo(`M${qx} ${qy + 3} L${qx - 1} ${qy + 14}`, C.plataMedia, 0.7) + forma(elipse(qx - 1, qy + 18, 4.6, 4.6), C.plata) + nube(qx - 2.6, qy + 16, 1.6, 1.4, C.papel, 'xs', 0.95) + trazo(`M${qx - 4} ${qy + 19.6} L${qx + 2} ${qy + 19.6}`, C.negro, 1) + forma(elipse(qx - 1, qy + 21.4, 0.9, 0.9), C.negro));
}

/* ------------------------------------------------------------------
   El candil, el fogonazo y la sombra chinesca de la pared
   ------------------------------------------------------------------ */

function candil(): string {
  const [cx, cy] = A.candil;
  const cuerpo = curva([[cx - 14, cy - 2], [cx - 10, cy - 10], [cx + 6, cy - 12], [cx + 18, cy - 14], [cx + 12, cy - 4], [cx + 10, cy]]);
  return conGrano(enmascarado('m-mand-candil', cuerpo, forma(cuerpo, C.plataHonda) + nube(cx - 4, cy - 8, 6, 2, C.plata, 's', 0.8)) + forma(elipse(cx, cy, 14, 2.4), C.negro) + trazo(`M${cx + 4} ${cy - 12} L${cx} ${cy - 16}`, C.negro, 1.4));
}

function llama(): string {
  const [lx, ly] = A.llama;
  const d = curva([[lx, ly - 18], [lx + 5, ly - 6], [lx + 4, ly + 2], [lx, ly + 4], [lx - 4, ly + 2], [lx - 5, ly - 6]]);
  return forma(d, C.fuego) + soplo(d, C.papel, 'xs', 0.6) + nube(lx, ly - 2, 2, 4, C.papel, 'xs', 0.95);
}

function resplandor(): string {
  const [lx, ly] = A.llama;
  return nube(lx, ly, 46, 40, C.fuego, 'l', 0.5) + nube(lx, ly, 16, 16, C.fuego, 'm', 0.7);
}

/** El fogonazo que encandila: el candil que se prende de golpe, blanco en el medio. */
function destello(): string {
  const [lx, ly] = A.llama;
  const rayos = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `M${lx} ${ly} L${lx + Math.cos(a + 0.06) * 260} ${ly + Math.sin(a + 0.06) * 260} L${lx + Math.cos(a - 0.06) * 260} ${ly + Math.sin(a - 0.06) * 260} Z`;
  }).join(' ');
  return nube(lx, ly, 220, 220, C.fuego, 'xl', 0.55) + soplo(rayos, C.papel, 's', 0.45) + nube(lx, ly, 60, 60, C.papel, 'l', 0.9) + nube(lx, ly, 18, 18, C.papel, 'm', 1);
}

/**
 * La sombra chinesca en la pared: él mismo, pero con lo que el recorte no muestra. Los cuernos largos, sin
 * sombrero que los tape, las garras en la punta de los dedos y la cola con la punta de flecha.
 */
function sombraChinesca(): string {
  const cuerpo = curva([[-24, -190], [20, -190], [50, -100], [24, -100], [26, -48], [32, 0], [-40, 0], [-24, -48], [-28, -100], [-54, -104]]);
  const cabezaS = curva([...PERFIL]);
  // El sombrero también tiene sombra, y los cuernos, largos, salen por debajo del ala para los dos lados.
  const ala = curva([[-60, -254], [-30, -262], [30, -262], [54, -254], [30, -248], [-30, -248]]);
  const copa = curva([[-24, -258], [-20, -296], [16, -298], [22, -258]]);
  const cuernos = forma(curva([[-24, -254], [-56, -268], [-80, -300], [-74, -320], [-60, -290], [-30, -262]]), C.negro) + forma(curva([[20, -256], [52, -270], [78, -304], [74, -324], [58, -290], [24, -264]]), C.negro) + forma(ala, C.negro) + forma(copa, C.negro);
  const garras = [-1, 0, 1].map((i) => trazo(`M-50 -112 l${-12 - i * 3} ${i * 8 - 2} l-4 ${2 + i}`, C.negro, 3)).join('') + trazo('M-20 -184 L-50 -112', C.negro, 12);
  const cola = trazo('M30 -110 Q90 -100 96 -40 Q100 -10 120 -20', C.negro, 6) + forma(poli([[114, -30], [134, -22], [116, -10]]), C.negro);
  // Chinesca: de borde neto, apenas soplado por la luz del candil, que tiembla.
  return `<g opacity="0.94">` + soplo(cuerpo, C.negro, 'xs') + soplo(cabezaS, C.negro, 'xs') + `<g filter="url(#soplo-xs)">${cuernos}${garras}${cola}</g>` + soplo(cuerpo, C.negro, 'm', 0.4) + `</g>`;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3;
const [LX, LY] = A.llama;
const [CX] = A.candil;
const [QX, QY] = A.cascabel;
const [KX, KY] = A.copa;

export const PIEZAS_MANDINGA: readonly Pieza[] = [
  { nombre: 'mandinga-sombra', caja: [-90, -360, 260, 380], dibujo: sombraChinesca(), densidad: 0.9 },
  { nombre: 'mandinga-resplandor', caja: [LX - 90, LY - 80, 180, 160], dibujo: resplandor(), densidad: 1 },
  { nombre: 'mandinga-candil', caja: [CX - 18, -20, 40, 26], dibujo: candil(), densidad: D },
  { nombre: 'mandinga-llama', caja: [LX - 8, LY - 22, 16, 28], dibujo: llama(), densidad: D * 1.4 },
  { nombre: 'mandinga-brazo-2', caja: [10, -194, 30, 62], dibujo: brazo(1), densidad: D },
  { nombre: 'mandinga-antebrazo-2', caja: [22, -150, 34, 66], dibujo: antebrazo(1), densidad: D },
  { nombre: 'mandinga-botas', caja: [-42, -54, 84, 60], dibujo: botas(), densidad: D * 1.2 },
  { nombre: 'mandinga-cuerpo', caja: [-58, -200, 112, 264], dibujo: cuerpo(), densidad: D },
  { nombre: 'mandinga-cabeza', caja: [-50, -290, 72, 104], dibujo: cabeza(), densidad: D * 1.2 },
  { nombre: 'mandinga-sombrero', caja: [KX - 54, KY - 40, 104, 50], dibujo: sombrero(), densidad: D * 1.2 },
  { nombre: 'mandinga-cascabel', caja: [QX - 8, QY, 14, 26], dibujo: cascabel(), densidad: D * 1.6 },
  { nombre: 'mandinga-brazo-1', caja: [-46, -194, 36, 62], dibujo: brazo(0), densidad: D },
  { nombre: 'mandinga-antebrazo-1', caja: [-66, -150, 40, 66], dibujo: antebrazo(0), densidad: D },
  { nombre: 'mandinga-destello', caja: [LX - 280, LY - 280, 560, 560], dibujo: destello(), densidad: 0.5 },
];

const img = imagenesDe(PIEZAS_MANDINGA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Mandinga armado con las marcas de un momento: el recorte con las varillas, y el candil. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const brazoCon = (n: 1 | 2): string => parte(`brazo-${n}`, img(`mandinga-brazo-${n}`) + parte(`antebrazo-${n}`, img(`mandinga-antebrazo-${n}`), t[`antebrazo-${n}`]), t[`brazo-${n}`]);
  // Las varillas de las manos: una raya de largo 1 que la cuenta gira y estira hasta abajo del piso.
  const varilla = (n: 1 | 2): string => parte(`varilla-${n}`, `<path class="bt-mandinga-varilla" d="M0 0 L0 1" vector-effect="non-scaling-stroke"/>`, t[`varilla-${n}`]);
  return (
    parte('resplandor', img('mandinga-resplandor'), '', o.resplandor) +
    img('mandinga-candil') +
    parte('llama', img('mandinga-llama'), t.llama, o.llama) +
    parte('recorte',
      parte('cuerpo',
        varilla(2) + brazoCon(2) +
        img('mandinga-botas') + img('mandinga-cuerpo') +
        parte('cabeza',
          img('mandinga-cabeza') +
          parte('sombrero', img('mandinga-sombrero') + parte('cascabel', img('mandinga-cascabel'), t.cascabel), t.sombrero),
          t.cabeza) +
        varilla(1) + brazoCon(1),
        t.cuerpo),
      t.recorte) +
    parte('destello', img('mandinga-destello'), '', o.destello)
  );
}

/** Mandinga en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function mandingaEn(m: Momento = QUIETO): string {
  const { transform: t, opacity: o } = marcas(m);
  return `<g transform="${t.sombra}" opacity="${o.sombra}">${img('mandinga-sombra')}</g><g transform="${t.entero}">${armado(m)}</g>`;
}

/** La sombra chinesca, en la pared del fondo: casi no se ve, hasta que el candil se aviva. */
function sombraEnLaPared(): string {
  const { transform: t, opacity: o } = marcas(QUIETO);
  return `<g class="mandinga-pared" aria-hidden="true" pointer-events="none">${parte('sombra', img('mandinga-sombra'), t.sombra, o.sombra)}</g>`;
}

/** El títere que se toca, en la pose quieta: de perfil, con el sombrero puesto. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--mandinga" data-id="mandinga" role="button" tabindex="0" aria-label="${nombres.get('mandinga') ?? 'Mandinga'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: gentil, con el sombrero en la mano, el candil vivo y la sombra en la pared. */
export const RETRATO = { caja: [MANDINGA.x - 140, MANDINGA.piso - 290, 240, 300] as const };
function retrato(): string {
  return `<image href="/bestiario/infierno-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/infierno-cerca.webp" x="0" y="300" width="900" height="340" preserveAspectRatio="none"/>` + mandingaEn(GENTIL);
}

export const MANDINGA_PERSONAJE: Personaje = {
  id: 'mandinga',
  region: 'el-infierno',
  ancla: MANDINGA.x,
  piezas: PIEZAS_MANDINGA,
  capas: { atras: sombraEnLaPared, figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
