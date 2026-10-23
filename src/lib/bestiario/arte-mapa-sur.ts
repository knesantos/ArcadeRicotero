/**
 * Las escenas del plano de los-astilleros, el-bajo, el-infierno, la-prision (`arte-mapa.ts`).
 *
 * Vista de plano, pintada a aerógrafo sobre la tinta de cada disco (`D-19`, `D-79`): volúmenes
 * soplados, borde duro donde va la máscara, grano y sombras hondas. Cada zona se reconoce por su
 * disco y por su lugar: el astillero naranja de *Cordero atado*, la sala inundada de *Un baión*, la
 * grieta de *Gulp!* y el patio tallado de *Oktubre*.
 *
 * Encima van los sellos de los bichos y los rótulos de papel, así que debajo de cada uno (`ocupado`)
 * se deja valor medio y poco detalle: lo oscuro y lo recargado va en los huecos y hacia los bordes.
 */

import { enmascarado, forma, nube, soplo, trazo } from './aerografo.ts';
import { azar, f, polar, xy, type Escena } from './arte-mapa-base.ts';

/* ------------------------------------------------------------------
   Lo que se comparte entre las cuatro zonas
   ------------------------------------------------------------------ */

const rad = Math.PI / 180;

/** Los bichos de estas cuatro zonas: ángulo, radio y tamaño del sello. Debajo no se recarga. */
const BICHOS: ReadonlyArray<readonly [number, number, number]> = [
  [118, 335, 36], [112, 392, 30], [138, 338, 34], [109, 262, 34], [127, 272, 32], [139, 228, 30],
  [115, 182, 32], [130, 168, 32], [123, 222, 24], [141, 405, 30],
  [163, 300, 52], [150, 352, 34], [176, 340, 36], [157, 222, 30], [177, 240, 32], [168, 395, 30],
  [147, 178, 30], [180, 388, 34], [181, 296, 32],
  [199, 305, 42], [191, 368, 38], [210, 385, 36], [208, 240, 34], [195, 198, 38], [211, 168, 32],
  [236, 305, 42], [226, 355, 32], [246, 375, 40], [228, 250, 34], [248, 262, 32], [221, 405, 26],
  [250, 185, 32], [238, 200, 30], [229, 168, 30], [242, 412, 30],
];
const SELLOS = BICHOS.map(([a, r, t]) => ({ ...polar(a, r), r: t * 0.55 }));

/** Las cajas de los rótulos de papel: centro y medio ancho. Alto fijo, 11 de cada lado. */
const ROTULOS: ReadonlyArray<readonly [number, number, number]> = [
  [734, 658, 52], [583, 770, 39], [403, 765, 43], [266, 658, 39],
];

/** ¿Cae acá un bicho o un rótulo (con un margen `m`)? Donde cae, la tierra va clara y quieta. */
function ocupado(x: number, y: number, m = 0): boolean {
  return (
    SELLOS.some((b) => (b.x - x) ** 2 + (b.y - y) ** 2 < (b.r + m) ** 2) ||
    ROTULOS.some(([cx, cy, w]) => Math.abs(cx - x) < w + 10 + m && Math.abs(cy - y) < 21 + m)
  );
}

/** Un sector de corona entre dos ángulos y dos radios, como camino cerrado. */
const banda = (d: number, h: number, r0: number, r1: number): string =>
  `M${xy(d, r1)} A${r1} ${r1} 0 0 1 ${xy(h, r1)} L${xy(h, r0)} A${r0} ${r0} 0 0 0 ${xy(d, r0)} Z`;

/** Un arco fino, para trazar. */
const arco = (d: number, h: number, r: number): string => `M${xy(d, r)} A${r} ${r} 0 0 1 ${xy(h, r)}`;

/** Una hebra ondulada que sigue el giro: la de una ola, una veta, una grieta. */
function hebra(a0: number, a1: number, r: number, amp: number, n: number, fase = 0, vueltas = 1.5): string {
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return polar(a0 + (a1 - a0) * t, r + amp * Math.sin(t * Math.PI * 2 * vueltas + fase));
  });
  let d = `M${f(pts[0]!.x)} ${f(pts[0]!.y)}`;
  for (let i = 1; i < n; i++) {
    const p = pts[i]!;
    const q = pts[i + 1]!;
    d += ` Q${f(p.x)} ${f(p.y)} ${f((p.x + q.x) / 2)} ${f((p.y + q.y) / 2)}`;
  }
  const u = pts[n]!;
  return `${d} L${f(u.x)} ${f(u.y)}`;
}

/** Un grupo parado en un punto polar y girado `rot`: con `rot` = el ángulo, "arriba" mira afuera. */
const en = (a: number, r: number, rot: number, dentro: string): string => {
  const p = polar(a, r);
  return `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(rot)})">${dentro}</g>`;
};

/** Un grupo parado en un punto cualquiera del plano. */
const aca = (x: number, y: number, rot: number, dentro: string): string =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">${dentro}</g>`;

/** La sombra tira abajo y a la derecha del plano (4, 6): en un grupo girado `rot`, eso es otro vector. */
const sombraLocal = (rot: number, k = 1): string => {
  const c = Math.cos(rot * rad);
  const s = Math.sin(rot * rad);
  return `translate(${f((4 * c + 6 * s) * k)} ${f((-4 * s + 6 * c) * k)})`;
};

/** Lo mismo, corrido (dx, dy): la sombra de una pieza. */
const proyecta = (dx: number, dy: number, dentro: string): string => `<g transform="translate(${f(dx)} ${f(dy)})">${dentro}</g>`;

/** Un rectángulo centrado. */
const rect = (cx: number, cy: number, w: number, h: number, color: string, o = 1): string =>
  `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" fill="${color}"${o < 1 ? ` opacity="${o}"` : ''}/>`;

/** Un círculo de borde duro. */
const disco = (cx: number, cy: number, r: number, color: string, o = 1): string =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${color}"${o < 1 ? ` opacity="${o}"` : ''}/>`;

/** Un anillo (círculo sin relleno). */
const anillo = (cx: number, cy: number, r: number, color: string, ancho: number, o = 1): string =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none" stroke="${color}" stroke-width="${f(ancho)}"${o < 1 ? ` opacity="${o}"` : ''}/>`;

/** Un punto al azar adentro de un sector, que no caiga bajo un bicho ni un rótulo. */
function sembrar(rnd: () => number, d: number, h: number, r0: number, r1: number, margen: number): { x: number; y: number; a: number; r: number } {
  for (let i = 0; i < 60; i++) {
    const a = d + rnd() * (h - d);
    const r = r0 + rnd() * (r1 - r0);
    const p = polar(a, r);
    if (!ocupado(p.x, p.y, margen)) return { x: p.x, y: p.y, a, r };
  }
  const a = (d + h) / 2;
  const r = (r0 + r1) / 2;
  return { ...polar(a, r), a, r };
}

/* ------------------------------------------------------------------
   Los astilleros: el patio, la grada, la dársena y el río
   ------------------------------------------------------------------ */

const AST = {
  tinta: 'var(--disco-cordero-atado-tinta)',
  negro: 'var(--disco-cordero-atado-apoyo)',
  fondo: 'var(--fondo)',
  oxido: 'var(--entorno-cyber-oxido)',
  acero: 'var(--entorno-cyber-acero)',
  aceroClaro: 'var(--entorno-cyber-acero-claro)',
  noche: 'var(--entorno-astillero-noche)',
  azul: 'var(--entorno-astillero-azul)',
  tiza: 'var(--entorno-astillero-tiza)',
  tizaClara: 'var(--entorno-astillero-tiza-clara)',
  madera: 'var(--portal-madera)',
  maderaHonda: 'var(--portal-madera-honda)',
  maderaLuz: 'var(--disco-luzbelito-tinta)',
  oro: 'var(--acento-2)',
  rojo: 'var(--marca-rojo)',
  papel: 'var(--papel)',
  farol: 'var(--portal-farol)',
  quemado: 'var(--portal-quemado)',
};

function astilleros(): string {
  const rnd = azar(1051);
  const A0 = 105;
  const A1 = 143;
  const T = AST;
  let s = '';

  // El suelo: el naranja del disco, curtido de óxido y de aceite, y polvo de obra más claro en el medio.
  s += forma(banda(98, 150, 126, 436), T.tinta);
  for (let i = 0; i < 9; i++) {
    const p = sembrar(rnd, A0, A1, 150, 360, 12);
    s += nube(p.x, p.y, 34 + rnd() * 30, 22 + rnd() * 20, T.oxido, 'l', 0.28 + rnd() * 0.12, rnd() * 180);
  }
  for (let i = 0; i < 6; i++) {
    const p = sembrar(rnd, A0, A1, 170, 350, 0);
    s += nube(p.x, p.y, 30 + rnd() * 24, 20 + rnd() * 14, T.papel, 'l', 0.16, rnd() * 180);
  }
  // Lo hondo: las esquinas del patio, de donde se va el naranja.
  s += nube(polar(A0 + 2, 150).x, polar(A0 + 2, 150).y, 50, 40, T.negro, 'xl', 0.3);
  s += nube(polar(A1 - 2, 150).x, polar(A1 - 2, 150).y, 60, 44, T.negro, 'xl', 0.5);
  s += nube(polar(A1 - 3, 250).x, polar(A1 - 3, 250).y, 46, 70, T.negro, 'xl', 0.3);
  // Los charcos de aceite y de lluvia vieja, con el cielo adentro.
  for (let i = 0; i < 8; i++) {
    const p = sembrar(rnd, A0 + 2, A1 - 2, 160, 350, 14);
    const w = 8 + rnd() * 12;
    s += nube(p.x, p.y, w, w * 0.55, T.noche, 'xs', 0.55, rnd() * 180);
    s += nube(p.x - w * 0.2, p.y - 1, w * 0.45, w * 0.18, T.tizaClara, 'xs', 0.5, rnd() * 20);
  }

  // Las vías: dos, que bajan la grada hasta el río, con sus durmientes.
  for (const [a, desde] of [[111.5, 156], [131, 156]] as const) {
    const largo = 374 - desde;
    let durm = '';
    for (let k = 0; k <= largo; k += 9) durm += `M-8 ${-(desde + k)} h16 `;
    s += en(a, 0, a, trazo(durm, T.quemado, 2.6, 0.8) + trazo(`M-3.4 ${-desde} V-374 M3.4 ${-desde} V-374`, T.negro, 1.5, 0.9) + trazo(`M-3.4 ${-desde} V-374`, T.aceroClaro, 0.5, 0.5));
  }

  // La dársena: un canal que se mete en el patio, con muelle de tablones a cada lado y una lancha atracada.
  {
    const a = 124.5;
    const largo = 380 - 296;
    let tablones = '';
    for (const lado of [-1, 1]) {
      const x0 = lado < 0 ? -37 : 25;
      tablones += `<rect x="${x0}" y="-384" width="12" height="${largo + 8}" fill="${T.madera}"/>`;
      let jun = '';
      for (let y = 380; y > 296; y -= 5.5) jun += `M${x0} ${-y} h12 `;
      tablones += trazo(jun, T.maderaHonda, 0.8, 0.8);
      tablones += trazo(`M${x0 + 4} -384 V-292 M${x0 + 8.5} -384 V-292`, T.maderaLuz, 0.6, 0.55);
      for (let y = 376; y > 304; y -= 18) tablones += disco(lado < 0 ? -25 : 25, -y, 2.6, T.maderaHonda);
    }
    const canal = `M-25 -386 L-25 -304 Q-25 -296 -17 -296 L17 -296 Q25 -296 25 -304 L25 -386 Z`;
    const lancha =
      `<g transform="translate(-2 -336) rotate(-6)">` +
      forma(`M-8 14 L8 14 Q10 0 4 -14 L0 -20 L-4 -14 Q-10 0 -8 14 Z`, T.maderaHonda) +
      forma(`M-6 12 L6 12 Q8 0 3 -12 L0 -17 L-3 -12 Q-8 0 -6 12 Z`, T.madera) +
      trazo(`M0 -16 V12 M-4 -6 H4 M-5 2 H5`, T.maderaLuz, 0.7, 0.7) +
      forma(`M-4 4 h8 v6 h-8 Z`, T.negro, 0.8) +
      `</g>`;
    s += en(a, 0, a,
      soplo(`M-40 -388 H40 V-290 H-40 Z`, T.negro, 'm', 0.45) +
        tablones +
        `<path d="${canal}" fill="${T.azul}"/>` +
        enmascarado('s-ast-darsena', canal,
          nube(0, -300, 30, 16, T.noche, 'm', 0.7) + nube(0, -380, 30, 20, T.noche, 'm', 0.7) + nube(-8, -340, 8, 30, T.tizaClara, 's', 0.3) +
            trazo('M-22 -320 q6 -3 12 0 t12 0 M-18 -352 q6 -3 12 0 t14 0 M-22 -370 q6 -3 12 0 t12 0', T.tizaClara, 1, 0.5)) +
        lancha,
    );
  }

  // El muro del muelle y el río: piedra del lado de acá, agua del de allá.
  s += forma(banda(98, 150, 380, 440), T.tiza);
  s += nube(polar(124, 400).x, polar(124, 400).y, 150, 60, T.tizaClara, 'xl', 0.4);
  const agua = banda(A0 - 4, A1 + 4, 380, 440);
  s += enmascarado(
    's-ast-rio',
    agua,
    nube(polar(124, 406).x, polar(124, 406).y, 130, 34, T.tiza, 'l', 0.8, 124 - 90) + nube(polar(124, 398).x, polar(124, 398).y, 90, 18, T.tizaClara, 'l', 0.35, 124 - 90) +
      nube(polar(112, 395).x, polar(112, 395).y, 50, 26, T.tizaClara, 'l', 0.28) +
      nube(polar(141, 402).x, polar(141, 402).y, 50, 26, T.tizaClara, 'l', 0.28) +
      nube(polar(124, 446).x, polar(124, 446).y, 190, 26, T.azul, 'l', 0.7) +
      nube(polar(A0, 418).x, polar(A0, 418).y, 30, 40, T.noche, 'l', 0.4) +
      nube(polar(A1, 418).x, polar(A1, 418).y, 30, 40, T.noche, 'l', 0.4),
  );
  let olas = '';
  for (let i = 0; i < 30; i++) {
    const r = 386 + rnd() * 40;
    const a = A0 + rnd() * (A1 - A0 - 8);
    olas += trazo(hebra(a, a + 3 + rnd() * 6, r, 1.6, 5, rnd() * 6), i % 3 === 0 ? T.tiza : T.tizaClara, 0.9 + rnd() * 0.8, 0.35 + rnd() * 0.4);
  }
  s += enmascarado('s-ast-olas', agua, olas);
  // La barcaza que espera a la entrada de la dársena: casco chato, carga de carbón y la estela que deja.
  {
    const a = 123;
    const casco = 'M-42 -9 L38 -9 Q50 -9 52 0 Q50 9 38 9 L-42 9 Z';
    let costillas = '';
    for (let x = -36; x < 40; x += 7) costillas += `M${x} -9 V9 `;
    s += en(a, 409, a,
      nube(-4, 4, 54, 15, T.noche, 's', 0.55) +
        trazo('M-52 -14 Q-20 -22 12 -14 T58 -14 M-54 14 Q-22 22 10 14 T56 14', T.tizaClara, 1, 0.5) +
        forma(casco, T.negro) + forma('M-39 -7 L36 -7 Q47 -7 49 0 Q47 7 36 7 L-39 7 Z', T.oxido) + trazo(costillas, T.negro, 0.7, 0.55) +
        // El carbón: un montículo de borde duro con su brillo, y la timonera atrás.
        forma('M-30 -5 Q-14 -9 4 -6 Q22 -3 24 0 Q22 5 2 6 Q-18 7 -30 5 Z', T.fondo) + nube(-6, -2, 12, 3.2, T.aceroClaro, 'xs', 0.5) +
        forma('M-42 -6 h9 v12 h-9 Z', T.papel) + forma('M-40 -4 h5 v8 h-5 Z', T.tiza, 0.7) + trazo('M-42 -9 H38', T.aceroClaro, 0.7, 0.55) +
        anillo(48, 0, 2, T.negro, 1) + disco(0, 0, 0.1, T.negro),
    );
  }
  // El muro de piedra: sillares con su junta y sus bitas de amarre.
  s += forma(banda(A0 - 4, A1 + 4, 368, 381), T.acero);
  s += forma(banda(A0 - 4, A1 + 4, 368, 372), T.aceroClaro, 0.85);
  s += trazo(arco(A0 - 4, A1 + 4, 380.5), T.negro, 1.4, 0.85);
  let juntas = '';
  for (let a = A0 - 3; a < A1 + 4; a += 2.6) juntas += `M${xy(a, 372)} L${xy(a, 380)} `;
  s += trazo(juntas, T.negro, 0.8, 0.6);
  for (const a of [108, 117, 134, 141]) {
    const p = polar(a, 375);
    s += disco(p.x, p.y, 3.2, T.negro) + disco(p.x - 0.6, p.y - 0.7, 1.4, T.aceroClaro, 0.8);
  }
  // Una boya roja y una cuerda tirante del muelle al agua.
  for (const [a, r] of [[111, 417], [143, 421]] as const) {
    const p = polar(a, r);
    s += nube(p.x + 3, p.y + 4, 8, 6, T.noche, 's', 0.7) + disco(p.x, p.y, 5, T.rojo) + disco(p.x - 1.6, p.y - 1.6, 1.6, T.papel, 0.8) + anillo(p.x, p.y, 8.5, T.tizaClara, 0.8, 0.5);
  }

  // La grada: el casco en construcción, mirando al río, con el andamio alrededor.
  {
    const a = 136.6;
    const casco = 'M-19 0 L19 0 Q25 -40 20 -70 Q12 -98 0 -108 Q-12 -98 -20 -70 Q-25 -40 -19 0 Z';
    let cuadernas = '';
    for (let y = -6; y > -40; y -= 5.5) cuadernas += `M${-19 + (-y) * 0.04} ${y} Q0 ${y - 3} ${19 - (-y) * 0.04} ${y} `;
    let tablas = '';
    for (const x of [-15, -10, -5, 0, 5, 10, 15]) tablas += `M${x * 1.0} -44 Q${x * 1.18} -70 ${x * 0.1} -104 `;
    let tablasInv = '';
    for (const x of [-15, -10, -5, 0, 5, 10, 15]) tablasInv += `M${x} -4 Q${x * 1.16} -26 ${x * 1.2} -44 `;
    let andamio = '';
    for (let y = -4; y > -92; y -= 11) andamio += `M-35 ${y} H-29 M29 ${y} H35 `;
    let cruces = '';
    for (let y = -4; y > -86; y -= 22) cruces += `M-34 ${y} L-30 ${y - 22} M-30 ${y} L-34 ${y - 22} M30 ${y} L34 ${y - 22} M34 ${y} L30 ${y - 22} `;
    s += en(a, 285, a,
      // La sombra que cae sobre el patio y sobre el agua.
      `<g transform="${sombraLocal(a, 1.5)}">${soplo(casco, T.negro, 's', 0.7)}</g>` +
        forma(casco, T.maderaHonda) +
        enmascarado('s-ast-casco', casco,
          nube(-5, -60, 22, 46, T.maderaLuz, 'm', 0.7) + nube(8, -90, 12, 18, T.maderaLuz, 'm', 0.4) +
            // La proa y la popa en tablas, y en el medio de la popa las cuadernas al aire.
            trazo(tablas, T.maderaHonda, 0.9, 0.85) + trazo(tablasInv, T.maderaHonda, 0.9, 0.85) +
            `<path d="M-17 -8 L17 -8 L19 -40 L-19 -40 Z" fill="${T.negro}" opacity="0.8"/>` +
            trazo(cuadernas, T.maderaLuz, 1.5, 0.85) + trazo('M0 -4 V-44', T.maderaLuz, 1.3, 0.7) +
            // Los clavos y la quilla, de proa a popa.
            trazo('M0 -44 V-106', T.maderaHonda, 1.5, 0.8)) +
        trazo('M-19 0 L19 0 Q25 -40 20 -70 Q12 -98 0 -108 Q-12 -98 -20 -70 Q-25 -40 -19 0', T.maderaHonda, 2.2, 0.9) +
        // El andamio: dos filas de postes con su tablón y sus cruces.
        trazo(`M-32 4 V-94 M32 4 V-94`, T.negro, 1.4, 0.85) + trazo(andamio, T.negro, 1.2, 0.8) + trazo(cruces, T.acero, 0.8, 0.8) +
        trazo(`M-32 4 V-94 M32 4 V-94`, T.madera, 0.5, 0.7) +
        // La grúa pórtico: una viga amarilla de lado a lado, con el carro y el gancho.
        `<g transform="translate(0 -92)">` +
        `<g transform="${sombraLocal(a, 2.2)}">${soplo('M-38 -3 H38 V3 H-38 Z', T.negro, 's', 0.6)}</g>` +
        forma('M-40 -4 H40 V4 H-40 Z', T.oro) + trazo('M-40 0 L-30 -4 L-20 4 L-10 -4 L0 4 L10 -4 L20 4 L30 -4 L40 0', T.negro, 0.9, 0.75) +
        forma('M-40 -4 H40 V-2.4 H-40 Z', T.papel, 0.55) + forma('M-8 -7 h14 v14 h-14 Z', T.negro) + disco(-1, 0, 2.2, T.oro) + disco(-1, 0, 6, T.negro, 0.4) +
        `</g>` +
        // La proa con espuma, ya en el agua.
        nube(0, -112, 18, 7, T.tizaClara, 's', 0.55),
    );
  }

  // Los tambores de aceite, los carretes de cable y las pilas de tablas: lo que deja una obra.
  for (let i = 0; i < 12; i++) {
    const p = sembrar(rnd, A0 + 3, A1 - 3, 160, 342, 16);
    // Que no pise la grada ni la dársena.
    if (p.a > 133.5 || (p.a > 121 && p.a < 128 && p.r > 285)) continue;
    const tipo = i % 3;
    if (tipo === 0) {
      s += disco(p.x + 2, p.y + 3, 6.5, T.negro, 0.55);
      s += disco(p.x, p.y, 6, i % 2 ? T.tizaClara : T.acero) + anillo(p.x, p.y, 4.1, T.negro, 0.7, 0.8) + disco(p.x - 1.8, p.y - 1.8, 1.5, T.papel, 0.8);
    } else if (tipo === 1) {
      s += disco(p.x + 2, p.y + 3, 9, T.negro, 0.5) + disco(p.x, p.y, 8.5, T.maderaHonda) + disco(p.x, p.y, 7.2, T.madera) + disco(p.x, p.y, 2.4, T.negro) + anillo(p.x, p.y, 5, T.maderaHonda, 0.8, 0.8) + anillo(p.x, p.y, 3.6, T.aceroClaro, 0.6, 0.5);
    } else {
      let tb = '';
      for (let k = -3; k <= 3; k++) tb += `M-12 ${k * 2.3} h24 `;
      s += aca(p.x, p.y, p.a - 90 + (rnd() - 0.5) * 20,
        `<g transform="translate(2.5 3.5)">${forma('M-12 -8 H12 V8 H-12 Z', T.negro, 0.5)}</g>` + forma('M-12 -8 H12 V8 H-12 Z', T.madera) + trazo(tb, T.maderaHonda, 0.8, 0.9) + forma('M-12 -8 H12 V-6 H-12 Z', T.maderaLuz, 0.6));
    }
  }
  // Los contenedores del muelle: una pila de seis, con la de arriba corrida, óxido y chapa acanalada.
  {
    const colores = [T.tiza, T.rojo, T.oro, T.tizaClara, T.oxido, T.tiza];
    let k = 0;
    for (const [a, r, giro] of [[106.8, 352, 0], [109.6, 352, 0], [112.2, 353, 3], [107.6, 365, 0], [110.4, 364, -2]] as const) {
      const c = colores[k++ % colores.length]!;
      let acan = '';
      for (let x = -12; x <= 12; x += 2.2) acan += `M${x} -4.6 v9.2 `;
      s += en(a, r, a + giro,
        `<g transform="${sombraLocal(a + giro, 1.4)}">${forma('M-14 -6 H14 V6 H-14 Z', T.negro, 0.55)}</g>` +
          forma('M-14 -6 H14 V6 H-14 Z', c) + trazo(acan, T.negro, 0.7, 0.35) + forma('M-14 -6 H14 V-4.6 H-14 Z', T.papel, 0.4) +
          trazo('M-14 -6 H14 V6 H-14 Z', T.negro, 0.9, 0.7) + forma('M10 -6 h4 v12 h-4 Z', T.negro, 0.22));
    }
    s += en(108.4, 358, 108.4 + 12,
      `<g transform="${sombraLocal(120, 2)}">${forma('M-14 -6 H14 V6 H-14 Z', T.negro, 0.55)}</g>` + forma('M-14 -6 H14 V6 H-14 Z', T.madera) + trazo('M-14 0 H14', T.maderaHonda, 0.9) + forma('M-14 -6 H14 V-4.6 H-14 Z', T.maderaLuz, 0.5));
  }
  // Las bitas del patio, las cadenas tiradas y un ancla vieja.
  {
    const p = polar(133, 205);
    s += en(133, 205, 133 + 40,
      trazo('M-22 -2 Q-12 -9 -2 -2 T18 -2 T36 -3', T.negro, 2.2, 0.85) + trazo('M-22 -2 Q-12 -9 -2 -2 T18 -2 T36 -3', T.aceroClaro, 0.7, 0.55));
    s += aca(p.x, p.y, 20,
      `<g transform="translate(2 3)">${trazo('M0 -14 V12 M-9 6 Q0 18 9 6 M-5 -9 H5', T.negro, 3, 0.45)}</g>` + trazo('M0 -14 V12 M-9 6 Q0 18 9 6 M-5 -9 H5', T.acero, 2.6) + trazo('M0 -14 V12', T.aceroClaro, 0.8, 0.6) + anillo(0, -17, 3, T.acero, 1.6));
  }

  // Las marcas del patio: la raya amarilla de la zona de carga, las huellas de las zorras y un tinglado de chapa.
  s += trazo(`${arco(A0 + 1, A1 - 1, 360)} `, T.oro, 1.6, 0.55).replace('stroke-linecap="round"', 'stroke-linecap="butt" stroke-dasharray="9 6"');
  for (const [a0, a1, r, o] of [[106, 130, 250, 0], [107, 128, 261, 1.6], [112, 140, 196, 2.4]] as const) s += trazo(hebra(a0, a1, r, 3, 8, o), T.oxido, 1.4, 0.4);
  {
    const w = 42;
    const h = 22;
    const techo = `M${-w / 2} ${-h / 2} H${w / 2} V${h / 2} H${-w / 2} Z`;
    let chapa = '';
    for (let x = -w / 2 + 3; x < w / 2; x += 3.8) chapa += `M${f(x)} ${-h / 2} V${h / 2} `;
    s += en(108.4, 214, 108.4,
      proyecta(5, 7, forma(techo, T.negro, 0.55)) + forma(techo, T.acero) + forma(`M${-w / 2} 0 H${w / 2} V${h / 2} H${-w / 2} Z`, T.negro, 0.35) + trazo(chapa, T.negro, 0.5, 0.45) +
        forma(`M${-w / 2} ${-h / 2} H${w / 2} V${-h / 2 + 1.6} H${-w / 2} Z`, T.aceroClaro, 0.8) + trazo(`M${-w / 2} 0 H${w / 2}`, T.negro, 1, 0.8) + trazo(techo, T.negro, 1.2, 0.8) +
        forma('M-14 -8 h8 v5 h-8 Z M8 3 h8 v5 h-8 Z', T.fondo, 0.75) + disco(14, -5, 2.6, T.oxido));
  }
  // La luz de los faroles de obra: tres charcos tibios en el patio y el filo de óxido en el borde.
  for (const [a, r] of [[121, 205], [109, 320], [133, 255]] as const) {
    const p = polar(a, r);
    s += nube(p.x, p.y, 44, 40, T.farol, 'xl', 0.22) + nube(p.x, p.y, 5, 5, T.farol, 'xs') + disco(p.x, p.y, 1.8, T.papel);
  }
  s += nube(polar(124, 130).x, polar(124, 130).y, 200, 30, T.negro, 'xl', 0.5);
  return s;
}

/* ------------------------------------------------------------------
   Las otras tres zonas, de a una
   ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   El bajo: la sala inundada de la Esquina del Sol, con la banda tocando
   ------------------------------------------------------------------ */

const BAJ = {
  tinta: 'var(--disco-un-baion-para-el-ojo-idiota-tinta)',
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  luz: 'var(--entorno-baion-luz)',
  rosa: 'var(--entorno-baion-rosa)',
  agua: 'var(--entorno-bajo-agua)',
  celeste: 'var(--entorno-bajo-celeste)',
  llama: 'var(--entorno-bajo-llama)',
  llamaClara: 'var(--entorno-bajo-llama-clara)',
  verde: 'var(--bestia-pierre-verde)',
  amarillo: 'var(--bestia-pierre-amarillo)',
  madera: 'var(--portal-madera)',
  maderaHonda: 'var(--portal-madera-honda)',
  papel: 'var(--papel)',
  fondo: 'var(--fondo)',
  oro: 'var(--acento-2)',
};

/** Una hebra que sigue el radio, de adentro para afuera: el borde de una cortina de luz sobre el agua. */
function hebraRadial(a: number, r0: number, r1: number, amp: number, n: number, fase = 0): string {
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const r = r0 + (r1 - r0) * t;
    return polar(a + ((amp * Math.sin(t * Math.PI * 3 + fase)) / r) / rad, r);
  });
  let d = `M${f(pts[0]!.x)} ${f(pts[0]!.y)}`;
  for (let i = 1; i < n; i++) {
    const p = pts[i]!;
    const q = pts[i + 1]!;
    d += ` Q${f(p.x)} ${f(p.y)} ${f((p.x + q.x) / 2)} ${f((p.y + q.y) / 2)}`;
  }
  const u = pts[n]!;
  return `${d} L${f(u.x)} ${f(u.y)}`;
}

function bajo(): string {
  const rnd = azar(2063);
  const T = BAJ;
  const A0 = 143;
  const A1 = 183;
  const zona = banda(A0 - 6, A1 + 6, 126, 436);
  let s = '';

  // El agua: el celeste de la contratapa, que se hunde en el azul de crayón hacia los bordes.
  s += forma(zona, T.tinta);
  s += nube(polar(163, 300).x, polar(163, 300).y, 130, 110, T.luz, 'xl', 0.28);
  s += nube(polar(163, 380).x, polar(163, 380).y, 110, 50, T.celeste, 'xl', 0.5);
  for (const [a, r] of [[A0, 410], [A1, 410], [A0 + 1, 170], [A1 - 1, 170], [163, 428]] as const) {
    const p = polar(a, r);
    s += nube(p.x, p.y, 62, 50, T.agua, 'xl', 0.6);
  }

  // El piso de la sala, visto a través del agua: un damero que se tuerce con la corriente.
  s +=
    `<defs><pattern id="s-bajo-damero" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(163 500 500)">` +
    `<rect width="44" height="44" fill="${T.tinta}"/><rect width="22" height="22" fill="${T.celeste}"/><rect x="22" y="22" width="22" height="22" fill="${T.celeste}"/></pattern>` +
    `<filter id="s-bajo-corriente" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="7" result="o"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="o" scale="26" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
  s += enmascarado('s-bajo-piso', zona, `<g filter="url(#s-bajo-corriente)" opacity="0.6"><rect x="0" y="0" width="1000" height="1000" fill="url(#s-bajo-damero)"/></g>`);

  // Los reflejos del agua: una red de hebras de luz que se cruzan, como los rayones claros del crayón.
  let red = '';
  for (let r = 190; r < 420; r += 17) red += trazo(hebra(A0 - 2, A1 + 2, r + rnd() * 6, 3 + rnd() * 3, 9, rnd() * 6, 2 + rnd()), T.luz, 1 + rnd() * 0.8, 0.22 + rnd() * 0.16);
  for (let a = A0 + 1; a < A1; a += 3.1) red += trazo(hebraRadial(a + rnd(), 160, 410, 4 + rnd() * 3, 14, rnd() * 6), T.luz, 0.9, 0.16 + rnd() * 0.1);
  s += enmascarado('s-bajo-red', zona, red);
  // Los rayones del crayón: trazos cortos y parejos, de la mano que pintó el agua en la contratapa.
  let rayones = '';
  for (let i = 0; i < 46; i++) {
    const p = sembrar(rnd, A0, A1, 160, 400, 0);
    const l = 8 + rnd() * 12;
    rayones += `M${f(p.x)} ${f(p.y)} l${f(l * 0.8)} ${f(-l * 0.6)} `;
  }
  s += trazo(rayones, T.celeste, 1.5, 0.45);
  s += trazo(rayones.replace(/M(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `M${Number(x) + 3} ${Number(y) + 2.5}`), T.luz, 0.8, 0.35);

  // La luz de la tarima: tres haces que cruzan la sala, rosa, claro y llama.
  for (const [a, color, o, abre] of [[153.5, T.rosa, 0.3, 6], [163, T.luz, 0.3, 7], [172.5, T.llama, 0.2, 6]] as const) {
    const p0 = polar(a, 196);
    const p1 = polar(a - abre, 372);
    const p2 = polar(a + abre, 372);
    s += soplo(`M${f(p0.x)} ${f(p0.y)} L${f(p1.x)} ${f(p1.y)} L${f(p2.x)} ${f(p2.y)} Z`, color, 'l', o);
  }

  // La tarima: tablas pintadas de rosa viejo sobre el agua, con el borde que alumbran los faroles de pie.
  {
    const tarima = banda(150, 176.5, 146, 204);
    s += soplo(banda(150, 177.5, 146, 210), T.fondo, 'm', 0.55);
    s += forma(tarima, T.rosa);
    let tablas = '';
    for (let a = 151.2; a < 176; a += 1.55) tablas += `M${xy(a, 147)} L${xy(a, 203)} `;
    s += enmascarado('s-bajo-tarima', tarima, nube(polar(163, 180).x, polar(163, 180).y, 40, 30, T.luz, 'm', 0.35) + trazo(tablas, T.noche, 0.8, 0.55));
    s += trazo(arco(150, 176.5, 203.5), T.llamaClara, 1.8, 0.85);
    s += trazo(arco(150, 176.5, 146.5), T.noche, 1.8, 0.6);
    for (let k = 0; k < 8; k++) {
      const p = polar(151.5 + k * 3.35, 207);
      s += nube(p.x, p.y, 3, 3, T.llamaClara, 'xs') + nube(p.x, p.y, 14, 10, T.llama, 's', 0.3);
    }
    // La batería con sus platos, los dos amplificadores y el pie del micrófono, de arriba.
    const amp = (x: number, giro: number): string =>
      `<g transform="translate(${x} -12) rotate(${giro})">${forma('M-9 -11 h18 v22 h-18 Z', T.noche)}${trazo('M-6 -6 h12 M-6 -2 h12 M-6 2 h12 M-6 6 h12', T.lila, 0.7, 0.8)}${disco(0, 8.5, 1, T.llamaClara)}</g>`;
    s += en(163, 172, 163,
      disco(0, 1, 12, T.noche, 0.55) +
        disco(0, 0, 11, T.papel) + anillo(0, 0, 11, T.noche, 1.4, 0.8) + anillo(0, 0, 7, T.celeste, 1, 0.7) +
        disco(-9, -13, 5.5, T.papel) + anillo(-9, -13, 5.5, T.noche, 0.9, 0.8) + disco(9, -13, 5.5, T.papel) + anillo(9, -13, 5.5, T.noche, 0.9, 0.8) +
        anillo(-21, -4, 8, T.oro, 1.2) + disco(-21, -4, 6.4, T.oro, 0.55) + anillo(21, -7, 8.5, T.oro, 1.2) + disco(21, -7, 6.8, T.oro, 0.55) +
        disco(-21, -4, 1.3, T.fondo) + disco(21, -7, 1.3, T.fondo) +
        amp(-40, -8) + amp(40, 8) +
        trazo('M0 -22 V-34', T.fondo, 1.3, 0.9) + anillo(0, -22, 3.5, T.fondo, 1.2, 0.8) + disco(0, -35, 1.8, T.luz),
    );
    // Los cables que bajan de la tarima y se pierden en el agua.
    for (const [a, o] of [[154, 0], [160, 2], [170, 4]] as const) s += trazo(hebra(a, a + 3, 206 + o * 3, 4, 5, o), T.fondo, 1.1, 0.8);
  }

  // El muro de la sala, con la puerta del vidrio roto y un hueco por donde entró el río.
  {
    const muro = (d: number, h: number): string =>
      forma(banda(d, h, 371, 382), T.violeta) + forma(banda(d, h, 371, 374), T.luz, 0.7) + trazo(arco(d, h, 382), T.noche, 1.6, 0.9);
    s += soplo(banda(A0 - 6, A1 + 6, 366, 392), T.fondo, 'm', 0.35);
    s += muro(A0 - 6, 154.8) + muro(161.3, 169.3) + muro(172.8, A1 + 6);
    let ladrillos = '';
    for (let a = A0 - 5; a < A1 + 6; a += 2) if (!(a > 154 && a < 162) && !(a > 169 && a < 173)) ladrillos += `M${xy(a, 374)} L${xy(a, 381)} `;
    s += trazo(ladrillos, T.noche, 0.7, 0.6);
    // Los escombros del hueco: lo que se cayó del muro.
    for (const [a, r, rr] of [[170.4, 376, 3.4], [171.5, 379, 2.6], [172, 374, 2.2], [169.6, 372, 2]] as const) {
      const p = polar(a, r);
      s += disco(p.x + 1, p.y + 1.4, rr, T.fondo, 0.5) + disco(p.x, p.y, rr, T.violeta) + disco(p.x - rr * 0.3, p.y - rr * 0.3, rr * 0.4, T.luz, 0.6);
    }
    // La puerta: el marco de madera, una hoja medio abierta y el vidrio astillado, con la calle del otro lado.
    const a = 158;
    s += soplo(`M${xy(a - 3, 384)} L${xy(a - 11, 432)} L${xy(a + 11, 432)} L${xy(a + 3, 384)} Z`, T.llama, 'l', 0.4);
    const puntas: string[] = [];
    for (let k = 0; k < 10; k++) {
      const ang = (k / 10) * Math.PI * 2 + rnd() * 0.3;
      const largo = 7 + rnd() * 17;
      puntas.push(`M0 0 L${f(Math.cos(ang) * largo)} ${f(Math.sin(ang) * largo)}`);
    }
    s += en(a, 376, a,
      `<g transform="scale(1.35)">` +
      // Los dos postes del marco y la hoja, abierta contra el agua.
      forma('M-17 -7 h5 v14 h-5 Z M12 -7 h5 v14 h-5 Z', T.maderaHonda) + trazo('M-17 -6 h5 M12 -6 h5', T.madera, 0.9, 0.8) +
        `<g transform="translate(12 0) rotate(-62)">${forma('M0 -2 h20 v4 h-20 Z', T.madera)}${forma('M2 -1.4 h16 v2.8 h-16 Z', T.celeste, 0.55)}${trazo('M2 0 h16', T.papel, 0.6, 0.6)}</g>` +
        // El vidrio roto: la estrella del golpe, las astillas que cuelgan y el centro blanco.
        `<g transform="translate(2 -3)">${trazo(puntas.join(' '), T.papel, 0.9, 0.9)}${anillo(0, 0, 5, T.papel, 0.6, 0.7)}${anillo(0, 0, 11, T.papel, 0.5, 0.45)}${disco(0, 0, 1.6, T.papel)}</g>` +
        forma('M-13 4 l5 -4 l3 6 Z M-4 6 l6 -3 l1 5 Z M7 5 l5 -4 l1 6 Z', T.luz, 0.8) + `</g>`,
    );
    // Las astillas que quedaron flotando de este lado.
    for (let k = 0; k < 11; k++) {
      const p = polar(a + (rnd() - 0.5) * 12, 346 + rnd() * 24);
      if (ocupado(p.x, p.y, 4)) continue;
      const w = 3 + rnd() * 4;
      s += aca(p.x, p.y, rnd() * 360, forma(`M0 0 L${f(w)} ${f(w * 0.3)} L${f(w * 0.3)} ${f(-w * 0.9)} Z`, T.papel, 0.8) + trazo(`M0 0 L${f(w)} ${f(w * 0.3)}`, T.luz, 0.5, 0.9));
      s += anillo(p.x, p.y, w + 2, T.luz, 0.6, 0.35);
    }
  }

  // La mesa del gordo, en el agua, con las sillas dadas vuelta.
  {
    const p = polar(163, 300);
    s += nube(p.x + 3, p.y + 5, 28, 24, T.agua, 's', 0.45);
    s += disco(p.x, p.y, 25, T.maderaHonda) + disco(p.x, p.y, 23, T.madera) + nube(p.x - 6, p.y - 6, 12, 9, T.papel, 's', 0.25);
    s += anillo(p.x, p.y, 17, T.maderaHonda, 0.8, 0.7) + anillo(p.x, p.y, 38, T.luz, 1, 0.45) + anillo(p.x, p.y, 52, T.luz, 0.9, 0.3);
    for (const [a, r, giro] of [[168, 262, 20], [157, 332, 200], [172, 322, 110], [152, 286, 300]] as const) {
      const q = polar(a, r);
      if (ocupado(q.x, q.y, 6)) continue;
      s += aca(q.x, q.y, giro,
        proyecta(2.4, 3.4, forma('M-7 -7 h14 v14 h-14 Z', T.fondo, 0.4)) + forma('M-7 -7 h14 v14 h-14 Z', T.maderaHonda) + forma('M-5.4 -5.4 h10.8 v10.8 h-10.8 Z', T.madera) +
          trazo('M-7 -9 h14', T.maderaHonda, 2.2) + trazo('M-7 7 v6 M7 7 v6', T.maderaHonda, 1.6, 0.8) + anillo(0, 0, 11, T.luz, 0.7, 0.35));
    }
  }

  // Las columnas de la sala, que asoman del agua, y la guirnalda de focos que cuelga entre ellas.
  {
    const columnas: Array<{ x: number; y: number }> = [];
    for (const [a, r] of [[148, 258], [178.5, 266], [146.5, 312], [172, 326]] as const) {
      const p = polar(a, r);
      if (ocupado(p.x, p.y, 12)) continue;
      columnas.push(p);
      s += nube(p.x + 3, p.y + 5, 14, 12, T.agua, 's', 0.6) + disco(p.x, p.y, 11, T.violeta) + disco(p.x, p.y, 8.4, T.lila) + disco(p.x - 2, p.y - 2, 4.2, T.luz, 0.8) + anillo(p.x, p.y, 11, T.noche, 1.3, 0.9) + anillo(p.x, p.y, 16, T.luz, 0.8, 0.5) + anillo(p.x, p.y, 21, T.luz, 0.7, 0.28);
    }
    for (let i = 0; i + 1 < columnas.length; i += 2) {
      const [u, v] = [columnas[i]!, columnas[i + 1]!];
      const mx = (u.x + v.x) / 2;
      const my = (u.y + v.y) / 2 + 22;
      s += trazo(`M${f(u.x)} ${f(u.y)} Q${f(mx)} ${f(my)} ${f(v.x)} ${f(v.y)}`, T.fondo, 1.1, 0.8);
      for (let k = 1; k < 7; k++) {
        const t = k / 7;
        const x = (1 - t) * (1 - t) * u.x + 2 * (1 - t) * t * mx + t * t * v.x;
        const y = (1 - t) * (1 - t) * u.y + 2 * (1 - t) * t * my + t * t * v.y;
        if (ocupado(x, y, 3)) continue;
        s += nube(x, y, 11, 9, T.llama, 's', 0.28) + disco(x, y, 2.1, T.llamaClara) + disco(x - 0.5, y - 0.5, 0.8, T.papel);
      }
    }
  }

  // Lo que flota: botellas, papeles de la banda, una guitarra, un salvavidas.
  for (let i = 0; i < 9; i++) {
    const p = sembrar(rnd, A0 + 2, A1 - 2, 215, 366, 14);
    const color = i % 3 === 0 ? T.verde : i % 3 === 1 ? T.amarillo : T.llama;
    const cuerpo = 'M-9 -3 h13 a3 3 0 0 1 3 3 a3 3 0 0 1 -3 3 h-13 Z';
    s += aca(p.x, p.y, rnd() * 360,
      proyecta(2, 3, forma(cuerpo, T.fondo, 0.4)) +
        forma(cuerpo, color) + forma('M4 -1.4 h7 v2.8 h-7 Z', color) + disco(11.5, 0, 1.5, T.papel, 0.85) + forma('M-6 -2 h7 v4 h-7 Z', T.papel, 0.8) + trazo('M-8 -2.2 h12', T.papel, 0.8, 0.8) + anillo(0, 0, 13, T.luz, 0.7, 0.35));
  }
  for (let i = 0; i < 6; i++) {
    const p = sembrar(rnd, A0 + 2, A1 - 2, 215, 366, 14);
    s += aca(p.x, p.y, rnd() * 360, forma('M-7 -5 h14 v10 h-14 Z', T.papel) + trazo('M-5 -2.4 h10 M-5 0 h10 M-5 2.4 h7', T.noche, 0.6, 0.7) + anillo(0, 0, 11, T.luz, 0.6, 0.3));
  }
  {
    const p = polar(171.5, 272);
    if (!ocupado(p.x, p.y, 14))
      s += aca(p.x, p.y, 200,
        proyecta(2.4, 3.4, forma('M-4 -6 q-8 -9 -17 0 q-9 9 6 12 q12 2 12 -12 Z', T.fondo, 0.4)) +
          forma('M-4 -6 q-8 -9 -17 0 q-9 9 6 12 q12 2 12 -12 Z', T.madera) + trazo('M8 -1 h26', T.maderaHonda, 2.6) + disco(-12, -1, 3.2, T.maderaHonda) + trazo('M-4 -3 h-2 M-4 2 h-2', T.oro, 0.6, 0.8) + anillo(-12, -2, 20, T.luz, 0.7, 0.3));
  }
  {
    const p = polar(146.4, 292);
    if (!ocupado(p.x, p.y, 16)) s += disco(p.x, p.y, 10, T.papel) + disco(p.x, p.y, 4.6, T.celeste) + anillo(p.x, p.y, 7.4, T.llama, 3.2, 0.95) + anillo(p.x, p.y, 7.4, T.papel, 0.8, 0.5) + anillo(p.x, p.y, 15, T.luz, 0.8, 0.4);
  }

  // La noche de afuera: la calle inundada que se pierde, con un reverbero de farol y el borde hundido.
  s += nube(polar(163, 420).x, polar(163, 420).y, 140, 24, T.noche, 'xl', 0.55);
  s += nube(polar(168, 408).x, polar(168, 408).y, 22, 10, T.llama, 'm', 0.35);
  s += nube(polar(A0, 150).x, polar(A0, 150).y, 40, 34, T.agua, 'xl', 0.5);
  s += nube(polar(A1, 150).x, polar(A1, 150).y, 40, 34, T.agua, 'xl', 0.5);
  return s;
}
/* ------------------------------------------------------------------
   El infierno: la costra de lava de Gulp!, con los ríos de fuego abajo
   ------------------------------------------------------------------ */

const INF = {
  tinta: 'var(--disco-gulp-tinta)',
  crema: 'var(--disco-gulp-apoyo)',
  brasa: 'var(--entorno-infierno-brasa)',
  fuego: 'var(--entorno-infierno-fuego)',
  rojo: 'var(--marca-rojo)',
  oro: 'var(--acento-2)',
  llama: 'var(--entorno-bajo-llama-clara)',
  fondo: 'var(--fondo)',
  papel: 'var(--papel)',
  oxido: 'var(--entorno-cyber-oxido)',
};

/** Un camino suave que pasa por los puntos (Catmull-Rom a cúbicas). */
function curvaPor(pts: ReadonlyArray<{ x: number; y: number }>): string {
  const n = pts.length;
  const p = (i: number): { x: number; y: number } => pts[Math.max(0, Math.min(n - 1, i))]!;
  let d = `M${f(p(0).x)} ${f(p(0).y)}`;
  for (let i = 0; i < n - 1; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

function infierno(): string {
  const rnd = azar(3079);
  const T = INF;
  const A0 = 183;
  const A1 = 217;
  const zona = banda(A0 - 6, A1 + 6, 126, 436);
  let s = '';

  // La lava de abajo: lo que queda a la vista entre placa y placa.
  s += forma(zona, T.fuego);
  s += nube(polar(200, 300).x, polar(200, 300).y, 150, 130, T.oro, 'xl', 0.2);

  // La costra: placas de corteza que se rompen, cada una con su borde de luz y su borde de sombra.
  let tintas = '';
  let hondas = '';
  let cenizas = '';
  let luces = '';
  let sombras = '';
  let grietas = '';
  let brasas = '';
  const anillos: number[] = [];
  for (let r = 144; r < 440; r += 34 + rnd() * 20) anillos.push(r);
  for (let i = 0; i + 1 < anillos.length; i++) {
    const [r0, r1] = [anillos[i]!, anillos[i + 1]!];
    const rm = (r0 + r1) / 2;
    const da = (38 + rnd() * 12) / rm / rad;
    for (let a = 174 + rnd() * da * 0.7; a < 226; ) {
      const a1 = a + da * (0.85 + rnd() * 0.35);
      const g = 2.5 + rnd() * 3.2;
      const ia = g / rm / rad / 2;
      const j = (): number => (rnd() - 0.5) * 6;
      const v = [
        polar(a + ia, r0 + g / 2 + j()), polar((a + a1) / 2 + (rnd() - 0.5) * 1.5, r0 + g / 2 - 1 + j() * 1.6), polar(a1 - ia, r0 + g / 2 + j()),
        polar(a1 - ia + (rnd() - 0.5) * 0.8, rm + j() * 2), polar(a1 - ia, r1 - g / 2 + j()),
        polar((a + a1) / 2 + (rnd() - 0.5) * 1.5, r1 - g / 2 + 1 + j() * 1.6), polar(a + ia, r1 - g / 2 + j()), polar(a + ia + (rnd() - 0.5) * 0.8, rm + j() * 2),
      ];
      const d = `M${v.map((q) => `${f(q.x)} ${f(q.y)}`).join(' L')} Z`;
      const c = { x: v.reduce((m, q) => m + q.x, 0) / v.length, y: v.reduce((m, q) => m + q.y, 0) / v.length };
      const cerca = ocupado(c.x, c.y, 34);
      const dado = rnd();
      tintas += d;
      if (!cerca && dado < 0.38) hondas += d;
      else if (dado > 0.84) cenizas += d;
      // El bisel: luz en los bordes que miran al noroeste, sombra en los del sudeste.
      for (let k = 0; k < v.length; k++) {
        const [u, w] = [v[k]!, v[(k + 1) % v.length]!];
        const mx = (u.x + w.x) / 2 - c.x;
        const my = (u.y + w.y) / 2 - c.y;
        const seg = `M${f(u.x)} ${f(u.y)} L${f(w.x)} ${f(w.y)} `;
        if (-mx - my > 4) luces += seg;
        else if (mx + my > 4) sombras += seg;
      }
      // Una grieta adentro de la placa, que deja ver el fuego.
      if (rnd() < 0.4) {
        const p0 = v[Math.floor(rnd() * v.length)]!;
        const p1 = { x: c.x + (rnd() - 0.5) * 10, y: c.y + (rnd() - 0.5) * 10 };
        const p2 = { x: (p0.x + p1.x) / 2 + (rnd() - 0.5) * 8, y: (p0.y + p1.y) / 2 + (rnd() - 0.5) * 8 };
        grietas += `M${f(p0.x)} ${f(p0.y)} L${f(p2.x)} ${f(p2.y)} L${f(p1.x)} ${f(p1.y)} `;
        if (rnd() < 0.5) grietas += `M${f(p2.x)} ${f(p2.y)} l${f((rnd() - 0.5) * 14)} ${f((rnd() - 0.5) * 14)} `;
      }
      // Las motas de brasa que se despegan de la costra.
      if (rnd() < 0.5) brasas += `M${f(c.x + (rnd() - 0.5) * 24)} ${f(c.y + (rnd() - 0.5) * 24)} h0.1 `;
      a = a1;
    }
  }
  s += enmascarado(
    's-inf-costra',
    zona,
    // Cada placa, de la tinta de Gulp!; algunas más hondas y otras blanqueadas de ceniza, como la tapa fotocopiada.
    `<path d="${tintas}" fill="${T.tinta}"/>` +
      `<path d="${hondas}" fill="${T.brasa}" opacity="0.38"/>` +
      `<path d="${cenizas}" fill="${T.crema}" opacity="0.3"/>` +
      trazo(luces, T.crema, 1.6, 0.6) + trazo(sombras, T.brasa, 2.2, 0.75) +
      // La luz que sube de las grietas: ancha y soplada abajo, fina y clara arriba.
      `<g filter="url(#soplo-xs)">${trazo(grietas, T.fuego, 3.2, 0.7)}</g>` + trazo(grietas, T.oro, 1.1, 0.95) + trazo(grietas, T.llama, 0.4, 0.8) +
      trazo(brasas, T.oro, 2.4, 0.7),
  );

  // Los ríos: tres grietas grandes que bajan del portón al borde, con el fuego más claro en el medio.
  const rios: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
    [[196, 160], [192, 235], [189.5, 300], [187.5, 360], [185, 430]],
    [[204, 160], [202.5, 215], [204.5, 285], [206, 335], [203, 395], [200, 430]],
    [[213, 165], [214.5, 240], [215.5, 305], [213.5, 365], [216, 430]],
  ];
  // Un rectángulo invisible que agranda la caja del grupo: los filtros miden contra ella, no contra el trazo.
  const caja = '<rect x="230" y="600" width="290" height="340" fill="none"/>';
  for (const [k, rio] of rios.entries()) {
    const pts = rio.map(([a, r]) => polar(a, r));
    const d = curvaPor(pts);
    s += enmascarado(
      `s-inf-rio-${k}`,
      zona,
      `<g filter="url(#soplo-m)" opacity="0.5">${caja}${trazo(d, T.oro, 32)}</g>` +
        `<g filter="url(#xerox-fino)">${caja}${trazo(d, T.brasa, 20)}${trazo(d, T.fuego, 15)}${trazo(d, T.oro, 8.5)}${trazo(d, T.llama, 2.8, 0.9)}</g>`,
    );
  }

  // El portón del infierno, al pie de la grieta: dos pilares, el umbral y la puerta alumbrada desde adentro.
  s += nube(polar(200, 160).x, polar(200, 160).y, 110, 70, T.oro, 'l', 0.75) + nube(polar(200, 150).x, polar(200, 150).y, 46, 26, T.llama, 'm', 0.7);
  s += soplo(`M${xy(196, 170)} L${xy(190, 270)} L${xy(210, 270)} L${xy(204, 170)} Z`, T.oro, 'l', 0.3);
  s += en(200, 160, 200,
    proyecta(3, 5, forma('M-30 4 H30 V-14 H-30 Z', T.fondo, 0.5)) +
      forma('M-26 2 L-26 -8 Q0 -34 26 -8 L26 2 Z', T.fondo) + forma('M-18 2 L-18 -6 Q0 -24 18 -6 L18 2 Z', T.oro) + forma('M-11 2 L-11 -4 Q0 -15 11 -4 L11 2 Z', T.llama) +
      // Los pilares con sus cuernos, el dintel y los escalones.
      forma('M-34 6 h10 v-22 h-10 Z M24 6 h10 v-22 h-10 Z', T.brasa) + forma('M-34 -16 h4 v-5 h2 v5 h4 Z M24 -16 h4 v-5 h2 v5 h4 Z', T.fondo) +
      trazo('M-34 -16 h10 M24 -16 h10', T.crema, 0.9, 0.7) + trazo('M-34 -2 h10 M24 -2 h10', T.fondo, 0.7, 0.6) +
      trazo('M-30 12 H30 M-27 16 H27 M-24 20 H24', T.fondo, 1.4, 0.65) + trazo('M-30 11 H30', T.crema, 0.6, 0.55),
  );

  // La losa de Luzbelito: una piedra lisa donde se sienta, con su sombra, y las otras piedras que quedaron.
  {
    const c = polar(199, 305);
    const losa =
      curvaPor(Array.from({ length: 9 }, (_, k) => {
        const ang = (k % 8 / 8) * Math.PI * 2;
        const rr = 36 + (k % 2 ? 3 : -2);
        return { x: c.x + Math.cos(ang) * rr, y: c.y + Math.sin(ang) * rr * 0.8 };
      })) + 'Z';
    s += soplo(losa, T.fondo, 's', 0.55);
    s += proyecta(3, 4, forma(losa, T.fondo, 0.35)) + forma(losa, T.crema) + nube(c.x - 8, c.y - 8, 22, 14, T.papel, 's', 0.5) + trazo(losa, T.brasa, 1.2, 0.7);
  }
  for (let i = 0; i < 9; i++) {
    const p = sembrar(rnd, A0 + 1, A1 - 1, 170, 410, 22);
    const n = 7;
    const rr = 7 + rnd() * 9;
    const pts = Array.from({ length: n }, (_, k) => {
      const ang = (k / n) * Math.PI * 2 + rnd() * 0.4;
      const q = rr * (0.75 + rnd() * 0.5);
      return `${f(p.x + Math.cos(ang) * q)} ${f(p.y + Math.sin(ang) * q * 0.85)}`;
    });
    const d = `M${pts.join(' L')} Z`;
    s += proyecta(3, 4.5, forma(d, T.fondo, 0.5)) + forma(d, T.brasa) +
      nube(p.x - rr * 0.3, p.y - rr * 0.3, rr * 0.5, rr * 0.35, T.crema, 'xs', 0.55) + nube(p.x + rr * 0.55, p.y + rr * 0.5, rr * 0.4, rr * 0.25, T.fuego, 'xs', 0.7);
  }

  // Los huesos que quedaron en la costra, y una cadena tirada que baja del portón.
  for (let i = 0; i < 6; i++) {
    const p = sembrar(rnd, A0 + 2, A1 - 2, 175, 415, 20);
    s += aca(p.x, p.y, rnd() * 180,
      proyecta(1.5, 2, forma('M-8 -1.4 h16 v2.8 h-16 Z', T.fondo, 0.4)) +
        trazo('M-8 0 H8', T.crema, 2.8) + disco(-8.5, -1.7, 1.9, T.crema) + disco(-8.5, 1.7, 1.9, T.crema) + disco(8.5, -1.7, 1.9, T.crema) + disco(8.5, 1.7, 1.9, T.crema) + trazo('M-5 0.6 H5', T.brasa, 0.5, 0.5));
  }
  {
    const pts = [polar(201, 176), polar(203, 188), polar(199.5, 203), polar(201, 216)];
    s += trazo(curvaPor(pts), T.fondo, 3.4, 0.85) + trazo(curvaPor(pts), T.papel, 0.9, 0.5);
    pts.forEach((q, k) => { if (k) s += anillo(q.x, q.y, 3.2, T.crema, 1, 0.8); });
  }

  // La ceniza que sube: humo oscuro en los bordes y un calor rojo donde cruzan los ríos.
  s += nube(polar(A0, 420).x, polar(A0, 420).y, 60, 50, T.brasa, 'xl', 0.55);
  s += nube(polar(A1, 420).x, polar(A1, 420).y, 60, 50, T.brasa, 'xl', 0.55);
  s += nube(polar(A0, 150).x, polar(A0, 150).y, 40, 40, T.brasa, 'xl', 0.45);
  s += nube(polar(A1, 150).x, polar(A1, 150).y, 40, 40, T.brasa, 'xl', 0.45);
  for (let i = 0; i < 5; i++) {
    const p = sembrar(rnd, A0, A1, 200, 400, 30);
    s += nube(p.x, p.y, 36 + rnd() * 20, 18 + rnd() * 12, T.fondo, 'l', 0.14, rnd() * 180);
  }
  s += nube(polar(200, 300).x, polar(200, 300).y, 170, 160, T.rojo, 'xl', 0.3);
  return s;
}
/* ------------------------------------------------------------------
   La prisión: el patio tallado de Oktubre, con el bloque, las torres y los reflectores
   ------------------------------------------------------------------ */

const PRI = {
  tinta: 'var(--disco-oktubre-tinta)',
  gris: 'var(--disco-oktubre-apoyo)',
  papel: 'var(--bestia-dracula-papel)',
  azul: 'var(--bestia-barbazul-azul)',
  fondo: 'var(--fondo)',
  oxido: 'var(--entorno-cyber-oxido)',
  acero: 'var(--entorno-cyber-acero)',
};

/**
 * Un rayado a gubia: líneas paralelas de punta a punta de una silueta, con el filo corrido de la
 * madera tallada. La silueta recorta; `cx, cy, ext` dicen dónde centrar las líneas y cuánto cubren.
 */
function rayado(id: string, silueta: string, cx: number, cy: number, ext: number, angulo: number, paso: number, color: string, ancho: number, o = 1): string {
  let d = '';
  for (let k = -ext; k <= ext; k += paso) d += `M${-ext} ${f(k)} H${ext} `;
  return enmascarado(
    id,
    silueta,
    `<g opacity="${o}"><g filter="url(#gubia)"><g transform="translate(${f(cx)} ${f(cy)}) rotate(${angulo})">${trazo(d, color, ancho)}</g></g></g>`,
  );
}

function prision(): string {
  const rnd = azar(4091);
  const T = PRI;
  const A0 = 217;
  const A1 = 255;
  const zona = banda(A0 - 6, A1 + 6, 126, 436);
  let s = '';

  // El concreto del patio: gris de Oktubre, con manchas claras donde pegó el reflector y lo hondo en los bordes.
  s += forma(zona, T.gris);
  s += nube(polar(236, 290).x, polar(236, 290).y, 150, 130, T.papel, 'xl', 0.5);
  for (let i = 0; i < 8; i++) {
    const p = sembrar(rnd, A0, A1, 165, 400, 0);
    s += nube(p.x, p.y, 30 + rnd() * 30, 20 + rnd() * 20, T.papel, 'l', 0.3, rnd() * 180);
  }
  for (const [a, r] of [[A0 - 1, 170], [A1 + 1, 170], [A0 - 1, 300], [A1 + 1, 300]] as const) {
    const p = polar(a, r);
    s += nube(p.x, p.y, 50, 70, T.fondo, 'xl', 0.45);
  }
  // Las grietas del concreto, finas y torcidas.
  for (let i = 0; i < 9; i++) {
    const p = sembrar(rnd, A0 + 1, A1 - 1, 180, 395, 10);
    let d = `M${f(p.x)} ${f(p.y)}`;
    let [x, y] = [p.x, p.y];
    for (let k = 0; k < 4; k++) {
      x += (rnd() - 0.5) * 16;
      y += (rnd() - 0.3) * 12;
      d += ` L${f(x)} ${f(y)}`;
    }
    s += trazo(d, T.fondo, 0.8, 0.45);
  }

  // El patio de ejercicio: cancha pintada en el rojo de la bandera, con sus líneas y sus aros, y la reja alrededor.
  {
    const a = 236;
    const cancha = 'M-56 -28 H56 V28 H-56 Z';
    s += en(a, 372, a,
      proyecta(4, 6, forma(cancha, T.fondo, 0.5)) +
        forma(cancha, T.tinta) +
        enmascarado('s-pri-cancha', cancha, nube(-20, -6, 50, 22, T.papel, 's', 0.25) + nube(48, 20, 30, 18, T.fondo, 's', 0.3)) +
        trazo('M-52 -24 H52 V24 H-52 Z M0 -24 V24', T.papel, 1.3, 0.9) +
        anillo(0, 0, 10, T.papel, 1.3, 0.9) +
        trazo('M-52 -9 H-30 V9 H-52 M52 -9 H30 V9 H52', T.papel, 1.2, 0.85) +
        // Los aros: el tablero y el aro de cada lado.
        trazo('M-55.5 -6 V6 M55.5 -6 V6', T.fondo, 2.4) + anillo(-51, 0, 2.6, T.fondo, 1) + anillo(51, 0, 2.6, T.fondo, 1) +
        // La reja: postes y la malla, como una línea de rombos.
        `<path d="M-58 -30 H58 V30 H-58 Z" fill="none" stroke="${T.fondo}" stroke-width="1.1" stroke-dasharray="2 1.6" opacity="0.8"/>` +
        trazo('M-58 -30 v-2 M-29 -30 v-2 M0 -30 v-2 M29 -30 v-2 M58 -30 v-2 M58 0 h2 M-58 0 h-2', T.fondo, 1.6, 0.9),
    );
  }

  // El bloque de celdas: techo de chapa a dos aguas visto de arriba, y las paredes con sus ventanitas con reja.
  {
    const a = 236;
    const techo = 'M-56 -33 H56 V33 H-56 Z';
    const frente = 'M-60 -41 H60 V41 H-60 Z';
    let ventanas = '';
    for (let x = -54; x <= 54; x += 9) ventanas += `M${x} -39.5 h5 v3 h-5 Z M${x} 36.5 h5 v3 h-5 Z `;
    let rejas = '';
    for (let x = -54; x <= 54; x += 9) for (const k of [1, 2, 3, 4]) rejas += `M${x + k} -39.5 v3 M${x + k} 36.5 v3 `;
    let chapa = '';
    for (let x = -54; x <= 56; x += 4.5) chapa += `M${x} -33 V33 `;
    s += proyecta(6, 9, en(a, 302, a, forma(frente, T.fondo, 0.55)));
    s += soplo(`M${xy(222, 262)} L${xy(222, 345)} L${xy(252, 345)} L${xy(252, 262)} Z`, T.fondo, 'm', 0.25);
    s += en(a, 302, a,
      forma(frente, T.fondo) +
        forma(ventanas, T.papel, 0.9) + trazo(rejas, T.fondo, 0.5, 0.9) +
        forma(techo, T.papel) +
        // Las dos aguas: la de afuera, clara; la de adentro, en sombra tallada.
        enmascarado('s-pri-techo', techo,
          forma('M-56 0 H56 V33 H-56 Z', T.gris, 0.65) + trazo(chapa, T.fondo, 0.5, 0.35) +
            `<g opacity="0.55"><g filter="url(#gubia)">${trazo(Array.from({ length: 14 }, (_, k) => `M-56 ${f(2 + k * 2.4)} H56`).join(' '), T.fondo, 0.7)}</g></g>`) +
        trazo('M-56 0 H56', T.fondo, 1.2, 0.8) + trazo('M-56 -33 H56 V33 H-56 Z', T.fondo, 1.5) +
        // Las claraboyas, la chimenea de ventilación y un tanque.
        forma('M-48 -26 h14 v10 h-14 Z M34 -26 h14 v10 h-14 Z M-48 14 h14 v10 h-14 Z M34 14 h14 v10 h-14 Z', T.fondo) +
        forma('M-46.5 -24.5 h11 v7 h-11 Z M35.5 -24.5 h11 v7 h-11 Z M-46.5 15.5 h11 v7 h-11 Z M35.5 15.5 h11 v7 h-11 Z', T.azul, 0.55) +
        trazo('M-41 -24.5 v7 M41 -24.5 v7 M-41 15.5 v7 M41 15.5 v7', T.papel, 0.7, 0.8) +
        disco(-24, 8, 4, T.fondo) + disco(-24, 8, 2.4, T.gris) + disco(26, -8, 3.4, T.fondo) + disco(26, -8, 2, T.gris),
    );
  }

  // Dos pabellones chicos, de chapa: la guardia y el depósito, con su techo a dos aguas.
  for (const [a, r, w, h] of [[221.5, 222, 30, 18], [252.5, 305, 34, 20]] as const) {
    const techo = `M${-w / 2} ${-h / 2} H${w / 2} V${h / 2} H${-w / 2} Z`;
    let chapa = '';
    for (let x = -w / 2 + 3; x < w / 2; x += 3.6) chapa += `M${f(x)} ${-h / 2} V${h / 2} `;
    s += en(a, r, a,
      proyecta(4, 6, forma(`M${-w / 2 - 3} ${-h / 2 - 3} H${w / 2 + 3} V${h / 2 + 3} H${-w / 2 - 3} Z`, T.fondo, 0.55)) +
        forma(`M${-w / 2 - 3} ${-h / 2 - 3} H${w / 2 + 3} V${h / 2 + 3} H${-w / 2 - 3} Z`, T.fondo) +
        forma(techo, T.papel) + forma(`M${-w / 2} 0 H${w / 2} V${h / 2} H${-w / 2} Z`, T.gris, 0.7) + trazo(chapa, T.fondo, 0.5, 0.4) + trazo(`M${-w / 2} 0 H${w / 2}`, T.fondo, 0.9, 0.8) +
        `<path d="M${-w / 2 + 3} ${-h / 2 - 2} h5 M${w / 2 - 8} ${-h / 2 - 2} h5" stroke="${T.papel}" stroke-width="1.4" opacity="0.85"/>`);
  }

  // El muro de afuera, con su alambre de púas, las banderas rojas y las dos torres con su reflector.
  {
    s += soplo(banda(A0 - 6, A1 + 6, 407, 436), T.fondo, 'm', 0.5);
    s += forma(banda(A0 - 6, A1 + 6, 409, 425), T.papel) + forma(banda(A0 - 6, A1 + 6, 409, 412), T.fondo, 0.85) + trazo(arco(A0 - 6, A1 + 6, 424.5), T.fondo, 1.6);
    let almenas = '';
    for (let a = A0 - 5; a < A1 + 6; a += 1.7) almenas += `M${xy(a, 413)} L${xy(a, 424)} `;
    s += trazo(almenas, T.gris, 0.9, 0.7);
    let puas = '';
    const n = 52;
    for (let k = 0; k <= n; k++) {
      const p = polar(A0 - 4 + (k / n) * (A1 - A0 + 8), k % 2 ? 402 : 406.4);
      puas += `${k ? 'L' : 'M'}${f(p.x)} ${f(p.y)} `;
    }
    s += trazo(puas, T.fondo, 0.8, 0.75);
    for (let k = 0; k < 9; k++) {
      const p = polar(A0 + 1 + k * 4.5, 404.2);
      s += aca(p.x, p.y, rnd() * 90, trazo('M-2.4 -2.4 L2.4 2.4 M-2.4 2.4 L2.4 -2.4', T.fondo, 0.7, 0.8));
    }
    for (const [aa, giro] of [[224, 30], [237, -20], [248, 36]] as const) {
      const [x, y] = [polar(aa, 418).x, polar(aa, 418).y];
      s += aca(x, y, aa + giro,
        trazo('M0 4 V-10', T.fondo, 1.4) + forma('M0 -10 L15 -8 L12 -4 L15 0 L0 -1 Z', T.tinta) + trazo('M0 -10 L15 -8 L12 -4 L15 0 L0 -1 Z', T.fondo, 0.7, 0.7) + trazo('M1 -7 Q7 -9 13 -7', T.papel, 0.5, 0.5));
    }
    // Las torres: techo en pirámide, sombra y el reflector que barre el patio.
    for (const [aa, haz] of [[220.5, [230, 242]], [251.5, [246, 232]]] as const) {
      const p = polar(aa, 415);
      const q0 = polar(haz[0]!, 318);
      const q1 = polar(haz[1]!, 346);
      s += soplo(`M${f(p.x)} ${f(p.y)} L${f(q0.x)} ${f(q0.y)} L${f(q1.x)} ${f(q1.y)} Z`, T.papel, 'l', 0.4);
      s += aca(p.x, p.y, aa,
        proyecta(4, 6, forma('M-13 -13 H13 V13 H-13 Z', T.fondo, 0.5)) + forma('M-13 -13 H13 V13 H-13 Z', T.fondo) +
          forma('M-11 -11 L0 0 L-11 11 Z', T.papel) + forma('M-11 -11 L11 -11 L0 0 Z', T.gris) + forma('M11 -11 L11 11 L0 0 Z', T.fondo, 0.6) + forma('M-11 11 L0 0 L11 11 Z', T.acero) +
          trazo('M-11 -11 L11 11 M11 -11 L-11 11', T.fondo, 0.8, 0.7) + nube(0, 0, 4, 4, T.papel, 'xs') + disco(0, 0, 1.6, T.papel));
    }
  }

  // El anillo de adentro: la pared del patio chico, con el hueco del ascensor y su cable.
  {
    s += forma(banda(A0 - 6, A1 + 6, 142, 150), T.fondo, 0.9) + trazo(arco(A0 - 6, A1 + 6, 150.5), T.papel, 1.2, 0.7);
    const p = polar(239, 176);
    s += aca(p.x, p.y, 239,
      proyecta(4, 6, forma('M-17 -17 H17 V17 H-17 Z', T.fondo, 0.5)) + forma('M-17 -17 H17 V17 H-17 Z', T.fondo) + forma('M-14 -14 H14 V14 H-14 Z', T.acero) +
        forma('M-11 -11 H11 V11 H-11 Z', T.fondo) + nube(0, 0, 8, 8, T.papel, 'xs', 0.9) +
        trazo('M-14 -14 L14 14 M14 -14 L-14 14', T.papel, 0.8, 0.7) + trazo('M0 -22 V-14', T.fondo, 1.4) + disco(0, 0, 2.2, T.papel) + anillo(0, 0, 5, T.papel, 0.8, 0.6));
  }

  // El blanco de tiro: círculos rojo y papel sobre un caballete, con sus agujeros y los sacos de arena detrás.
  {
    const p = polar(227.5, 398);
    s += aca(p.x, p.y, 227.5,
      proyecta(3, 5, disco(0, 0, 15, T.fondo, 0.5)) +
        // Los sacos de arena, apilados de a tres.
        [[-18, 20], [-6, 20], [6, 20], [-12, 26], [0, 26]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="3.6" fill="${T.oxido}"/><path d="M${x! - 4} ${y} h8" stroke="${T.fondo}" stroke-width="0.6" opacity="0.6"/>`).join('') +
        disco(0, 0, 15, T.papel) + disco(0, 0, 12.4, T.tinta) + disco(0, 0, 9.4, T.papel) + disco(0, 0, 6.4, T.tinta) + disco(0, 0, 3, T.fondo) + anillo(0, 0, 15, T.fondo, 1.2) +
        disco(2, -3, 0.9, T.fondo) + disco(-4, 2, 0.9, T.fondo) + disco(5, 5, 0.9, T.fondo) + disco(-1, -8, 0.9, T.fondo) + disco(8, -1, 0.9, T.fondo) + disco(-9, -4, 0.9, T.fondo),
    );
  }

  // Lo que se tallaría en una plancha: sombra rayada a gubia a los pies del bloque y de la cancha.
  s += rayado('s-pri-gubia-bloque', `M${xy(222, 262)} L${xy(222, 345)} L${xy(252, 345)} L${xy(252, 262)} Z`, polar(236, 300).x + 6, polar(236, 300).y + 9, 160, 38, 3.4, T.fondo, 0.9, 0.5);
  s += rayado('s-pri-gubia-muro', banda(A0 - 6, A1 + 6, 388, 408), 500, 500, 600, 34, 3.2, T.fondo, 0.9, 0.45);
  s += rayado('s-pri-gubia-borde', banda(A0 - 6, A0 + 3.5, 150, 400), 500, 500, 600, 124, 3.4, T.fondo, 0.9, 0.3);
  s += rayado('s-pri-gubia-borde2', banda(A1 - 3.5, A1 + 6, 150, 400), 500, 500, 600, 124, 3.4, T.fondo, 0.9, 0.3);

  // La luz de los faroles del patio y el rojo que se mete por los bordes: la bandera, otra vez.
  for (const [a, r] of [[226, 330], [247, 238], [233, 400]] as const) {
    const p = polar(a, r);
    s += nube(p.x, p.y, 34, 30, T.papel, 'l', 0.3) + disco(p.x, p.y, 2, T.fondo) + disco(p.x, p.y, 1, T.papel);
  }
  for (const [a, r] of [[A0 + 1, 410], [A1 - 1, 400]] as const) {
    const p = polar(a, r);
    s += nube(p.x, p.y, 40, 34, T.tinta, 'l', 0.25);
  }
  return s;
}

export const ESCENAS_SUR: Readonly<Record<string, Escena>> = {
  'los-astilleros': astilleros,
  'el-bajo': bajo,
  'el-infierno': infierno,
  'la-prision': prision,
};
