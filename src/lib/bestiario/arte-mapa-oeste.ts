/**
 * Las escenas del plano de los-techos, el-monte, la-pastura, la-mesa (`arte-mapa.ts`).
 *
 * Todo vista desde arriba, a aerógrafo, con la paleta del disco de cada zona (`D-19`):
 *
 * - los-techos: *Bang bang, estás liquidado*, la ceniza y el ocre. Abajo el baldío en el crayón violeta
 *   de *Un baión* con el farol; arriba, de la medianera para afuera, los techos de chapa.
 * - el-monte: *Lobo suelto*, el naranja de Semilla y el petróleo. Pinos vistos desde arriba, senderos,
 *   huellas, el volcán del joven lobo y ojos en lo hondo.
 * - la-pastura: *Cordero atado*, el naranja de la tapa. El claro que brilla, el palenque y la soga.
 * - la-mesa: *La mosca y la sopa*, la mesa larga con su mantel, la sopa, la miel y la ventana.
 *
 * Debajo de cada bicho (sus posiciones están en `bestiario.json`) queda lo claro y quieto; lo
 * recargado y lo oscuro va en los huecos y hacia los bordes, porque encima van los sellos en tinta
 * casi negra. Los ids de las máscaras empiezan con `oe-`.
 */

import { enmascarado, forma, nube, soplo, trazo } from './aerografo.ts';
import { azar, contorno, f, polar, xy, type Escena } from './arte-mapa-base.ts';

interface Pt {
  x: number;
  y: number;
}

/** Un círculo donde no se dibuja lo decorativo: el aro de un bicho, con su radio. */
interface Aro extends Pt {
  r: number;
}

/* ------------------------------------------------------------------
   Herramientas de la mano
   ------------------------------------------------------------------ */

const NEGRO = 'var(--fondo)';
const PAPEL = 'var(--papel)';

const sector = (desde: number, hasta: number, adentro: number, afuera: number): string =>
  contorno({ tipo: 'sector', desde, hasta, adentro, afuera });

/** Un arco de circunferencia, en el sentido del reloj. */
const arco = (a0: number, a1: number, r: number): string => `M${xy(a0, r)} A${f(r)} ${f(r)} 0 0 1 ${xy(a1, r)}`;

const poligono = (pts: readonly Pt[]): string => `M${pts.map((p) => `${f(p.x)} ${f(p.y)}`).join(' L')} Z`;

const circulo = (cx: number, cy: number, r: number, color: string, o = 1): string =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${color}"${o < 1 ? ` opacity="${o}"` : ''}/>`;

/** Un círculo como subtrayecto, para juntar muchos en un solo elemento. */
const redondel = (cx: number, cy: number, r: number): string =>
  `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0Z`;

/** Puntitos: migas, hojas, semillas. Un trazo sin largo con la punta redonda. */
const puntos = (pts: readonly Pt[], color: string, ancho: number, o = 1): string =>
  pts.length ? trazo(pts.map((p) => `M${f(p.x)} ${f(p.y)}l0 0.01`).join(''), color, ancho, o) : '';

/** Un trazo soplado: un sendero, una soga, un hilo de miel. */
const pista = (d: string, color: string, ancho: number, o: number, tam: 'xs' | 's' | 'm' | 'l'): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${f(ancho)}" stroke-linecap="round" stroke-linejoin="round" filter="url(#soplo-${tam})"${o < 1 ? ` opacity="${o}"` : ''}/>`;

/** El aro de un bicho puesto por su polar. */
const aroDe = (ang: number, r: number, tam: number): Aro => ({ ...polar(ang, r), r: tam * 0.55 });

const libre = (p: Pt, aros: readonly Aro[], margen: number): boolean => aros.every((a) => Math.hypot(a.x - p.x, a.y - p.y) > a.r + margen);

/** Una huella: la almohadilla y cuatro deditos, mirando para donde apunta `giro` (grados, 0 = arriba). */
function huella(x: number, y: number, giro: number, k: number): string {
  const a = (giro * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const en = (lx: number, ly: number, r: number): string => redondel(x + (lx * ca - ly * sa) * k, y + (lx * sa + ly * ca) * k, r * k);
  return en(0, 0.4, 1.05) + en(-1.2, -1, 0.5) + en(-0.42, -1.8, 0.5) + en(0.42, -1.8, 0.5) + en(1.2, -1, 0.5);
}

/** Una estrella de pino vista desde arriba: puntas largas y cortas, con el pulso de la mano. */
function puntasDePino(rnd: () => number, puntas: number): Array<{ a: number; k: number }> {
  const salida: Array<{ a: number; k: number }> = [];
  const giro = rnd() * Math.PI;
  for (let i = 0; i < puntas * 2; i++) {
    salida.push({ a: giro + (i * Math.PI) / puntas, k: i % 2 ? 0.5 + rnd() * 0.16 : 0.9 + rnd() * 0.22 });
  }
  return salida;
}

const estrella = (pts: ReadonlyArray<{ a: number; k: number }>, cx: number, cy: number, R: number): string =>
  poligono(pts.map(({ a, k }) => ({ x: cx + Math.cos(a) * R * k, y: cy + Math.sin(a) * R * k })));

/* ------------------------------------------------------------------
   Los techos
   ------------------------------------------------------------------ */

const C = {
  ceniza: 'var(--disco-bang-bang-estas-liquidado-tinta)',
  ocre: 'var(--disco-bang-bang-estas-liquidado-apoyo)',
  oxido: 'var(--entorno-cyber-oxido)',
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  luz: 'var(--entorno-baion-luz)',
  azul: 'var(--entorno-baion-azul)',
  rosa: 'var(--entorno-baion-rosa)',
};

/** Los aros de los bichos de los techos: ángulo, radio y tamaño, como en `bestiario.json`. */
const AROS_TECHOS: readonly Aro[] = [
  aroDe(264, 400, 32), aroDe(268, 358, 22), aroDe(289, 408, 34), aroDe(259, 352, 32), aroDe(277, 360, 32),
  aroDe(282, 398, 28), aroDe(292, 365, 28), aroDe(271, 410, 30), aroDe(275, 292, 40), aroDe(260, 272, 30),
  aroDe(287, 300, 28), aroDe(266, 300, 28), aroDe(292, 262, 28),
];

function techos(): string {
  const rnd = azar(2551);
  const aros = AROS_TECHOS;
  let s = forma(sector(251, 299, 244, 440), C.noche);

  /* El baldío: el crayón violeta de *Un baión*, con el farol que lo alumbra. */
  s += soplo(sector(253, 297, 250, 340), C.lila, 'm', 0.92);
  s += nube(209, 476, 64, 104, C.luz, 'xl', 0.6) + nube(213, 470, 28, 46, C.luz, 'l', 0.4);
  s += nube(polar(254, 300).x, polar(254, 300).y, 24, 70, C.noche, 'l', 0.6);
  s += nube(polar(298, 292).x, polar(298, 292).y, 24, 60, C.noche, 'l', 0.55);
  s += nube(polar(275, 244).x, polar(275, 244).y, 70, 14, C.noche, 'l', 0.5);
  const tandas: ReadonlyArray<readonly [string, number, number, number]> = [
    [C.violeta, 0.6, 3.2, -35], [C.azul, 0.45, 2.4, -30], [C.rosa, 0.45, 2.4, -42], [C.noche, 0.4, 2.8, -28], [C.luz, 0.55, 2, -38],
  ];
  for (const [color, o, ancho, base] of tandas) {
    let d = '';
    for (let i = 0; i < 16; i++) {
      const p = polar(255 + rnd() * 40, 252 + rnd() * 84);
      const dir = ((base + (rnd() - 0.5) * 24) * Math.PI) / 180;
      const largo = 9 + rnd() * 14;
      d += `M${f(p.x)} ${f(p.y)}l${f(Math.cos(dir) * largo)} ${f(Math.sin(dir) * largo)}`;
    }
    s += trazo(d, color, ancho, o);
  }
  // Yuyos: matas de pasto seco que se apiñan en los bordes y contra la medianera.
  let yuyo = '';
  let yuyoClaro = '';
  for (let i = 0, puestos = 0; i < 400 && puestos < 30; i++) {
    const p = polar(254 + rnd() * 42, 250 + rnd() * 88);
    if (!libre(p, aros, 4)) continue;
    puestos++;
    for (let k = 0; k < 5; k++) {
      const h = 9 + rnd() * 10;
      const dx = (rnd() - 0.5) * 12;
      const x = p.x + (k - 2) * 1.8;
      const trazoDe = `M${f(x)} ${f(p.y)}q${f(dx * 0.2)} ${f(-h * 0.6)} ${f(dx)} ${f(-h)}`;
      if (k % 2) yuyoClaro += trazoDe;
      else yuyo += trazoDe;
    }
  }
  s += trazo(yuyo, C.noche, 1.8, 0.8) + trazo(yuyoClaro, C.luz, 1.2, 0.5);
  // Una goma de auto y una lata, que se tiran en cualquier baldío.
  for (const [ang, r] of [[257, 330], [294, 318]] as const) {
    const p = polar(ang, r);
    if (!libre(p, aros, 6)) continue;
    s += circulo(p.x - 2, p.y + 3, 10, C.noche, 0.6) + circulo(p.x, p.y, 8.5, C.noche) + circulo(p.x, p.y, 4.2, C.lila, 0.8) + nube(p.x - 3, p.y - 3, 4, 2, C.luz, 'xs', 0.5);
  }

  /* La medianera: el ladrillo visto desde arriba, con vidrios rotos clavados en el filo. */
  s += soplo(sector(254, 298, 332, 352), C.noche, 's', 0.7);
  s += forma(sector(255, 296, 337, 347), C.ocre);
  let ladrillos = '';
  for (let a = 255.4; a < 296; a += 1.4) ladrillos += `M${xy(a, 337)}L${xy(a, 347)}`;
  s += trazo(ladrillos, NEGRO, 1, 0.38) + trazo(arco(255, 296, 342), C.ceniza, 1.2, 0.35);
  let vidrios = '';
  for (let a = 255.6; a < 295; a += 2 + rnd() * 1.4) {
    const p0 = polar(a, 346.5);
    const p1 = polar(a + 0.45, 351 + rnd() * 4);
    const p2 = polar(a + 1, 346.5);
    vidrios += `M${f(p0.x)} ${f(p0.y)}L${f(p1.x)} ${f(p1.y)}L${f(p2.x)} ${f(p2.y)}Z`;
  }
  s += forma(vidrios, C.luz, 0.9);

  /* Los techos de chapa: tres hileras de paños, con la calle oscura entre una y otra. */
  const hileras: ReadonlyArray<readonly [number, number]> = [[352, 379], [386, 411], [418, 442]];
  const cuerpoTecho = [C.ceniza, C.ceniza, C.ceniza, C.ocre, C.ocre, C.lila];
  let n = 0;
  hileras.forEach(([r0, r1], fila) => {
    let a = 251 - rnd() * 5;
    while (a < 299) {
      const ancho = 5.4 + rnd() * 4.8;
      const a0 = a + 0.5;
      const a1 = a + ancho - 0.5;
      a += ancho;
      const pts = [polar(a0, r0), polar(a1, r0), polar(a1, r1), polar(a0, r1)];
      const d = poligono(pts);
      const cx = (pts[0].x + pts[1].x + pts[2].x + pts[3].x) / 4;
      const cy = (pts[0].y + pts[1].y + pts[2].y + pts[3].y) / 4;
      const color = cuerpoTecho[Math.floor(rnd() * cuerpoTecho.length)];
      let costillas = '';
      if ((n + fila) % 2) {
        const k = Math.max(3, Math.round(((a1 - a0) * Math.PI * ((r0 + r1) / 2)) / 180 / 5.5));
        for (let i = 0; i < k; i++) {
          const aa = a0 + ((i + 0.5) * (a1 - a0)) / k;
          costillas += `M${xy(aa, r0 + 1.5)}L${xy(aa, r1 - 1.5)}`;
        }
      } else {
        const k = Math.max(3, Math.round((r1 - r0) / 5.5));
        for (let i = 0; i < k; i++) {
          const rr = r0 + ((i + 0.5) * (r1 - r0)) / k;
          costillas += `M${xy(a0 + 0.3, rr)}L${xy(a1 - 0.3, rr)}`;
        }
      }
      let dentro =
        forma(d, color) +
        nube(cx - 7, cy - 7, 24, 16, PAPEL, 'm', 0.32) +
        nube(cx + 13, cy + 10, 20, 14, NEGRO, 'm', 0.15 + rnd() * 0.3) +
        trazo(costillas, NEGRO, 1.5, 0.3) +
        `<g transform="translate(1.3 1.3)">${trazo(costillas, PAPEL, 1, 0.3)}</g>`;
      if (rnd() < 0.4) dentro += nube(cx + (rnd() - 0.5) * 24, cy + (rnd() - 0.5) * 18, 12 + rnd() * 8, 8 + rnd() * 6, C.oxido, 'm', 0.5);
      if (rnd() < 0.3) {
        const hx = cx + (rnd() - 0.5) * 20;
        const hy = cy + (rnd() - 0.5) * 14;
        dentro += forma(poligono([{ x: hx - 4, y: hy - 2 }, { x: hx + 1, y: hy - 4.5 }, { x: hx + 5, y: hy + 1 }, { x: hx - 1, y: hy + 4 }]), NEGRO, 0.85);
      }
      s += enmascarado(`oe-t${n++}`, d, dentro);
    }
  });
  // Las canaletas, de punta a punta, con el agua que brilla.
  for (const r of [349.5, 382.5, 414.5]) s += trazo(arco(252, 298, r), NEGRO, 4, 0.6) + trazo(arco(252, 298, r + 1.8), C.luz, 1.1, 0.3);

  /* Lo que sobresale de las chapas: tanques, chimeneas, claraboyas, antenas. */
  const sembrar = (cuantos: number, margen: number, semilla: number): Pt[] => {
    const r = azar(semilla);
    const salida: Pt[] = [];
    for (let i = 0; i < 300 && salida.length < cuantos; i++) {
      const p = polar(257 + r() * 36, 358 + r() * 58);
      if (!libre(p, aros, margen) || salida.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < 34)) continue;
      salida.push(p);
    }
    return salida;
  };
  const puestos = sembrar(14, 13, 77);
  puestos.slice(0, 3).forEach((p) => {
    s += nube(p.x - 5, p.y + 6, 13, 11, NEGRO, 's', 0.55) + circulo(p.x, p.y, 10.5, C.ocre) + circulo(p.x, p.y, 8, C.ceniza) + circulo(p.x, p.y, 4.2, C.ocre) + nube(p.x - 3, p.y - 3, 4, 3, PAPEL, 'xs', 0.7);
  });
  puestos.slice(3, 7).forEach((p, i) => {
    s += `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(i * 23 - 20)})">` + nube(-5, 6, 9, 7, NEGRO, 's', 0.55) + `<rect x="-6" y="-6" width="12" height="12" fill="${C.oxido}"/><rect x="-6" y="-6" width="12" height="3" fill="${C.ocre}"/><rect x="-3" y="-3" width="6" height="6" fill="${NEGRO}"/></g>`;
  });
  puestos.slice(7, 10).forEach((p, i) => {
    s += `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(i * 30 - 15)})">` + nube(0, 0, 18, 12, C.luz, 's', 0.45) + `<rect x="-10" y="-6" width="20" height="12" fill="${C.noche}"/><rect x="-8.5" y="-4.5" width="17" height="9" fill="${C.lila}"/><path d="M-8.5 -1.5L8.5 -1.5M-8.5 1.5L8.5 1.5M0 -4.5L0 4.5" stroke="${NEGRO}" stroke-width="1" opacity="0.6"/></g>`;
  });
  puestos.slice(10, 14).forEach((p) => {
    // La antena vista desde arriba es su sombra: larga, hacia la izquierda, con los travesaños.
    const sombra = `M${f(p.x)} ${f(p.y)}l-24 30`;
    const t1 = { x: p.x - 9.6, y: p.y + 12 };
    const t2 = { x: p.x - 16.8, y: p.y + 21 };
    s += trazo(sombra + `M${f(t1.x - 4)} ${f(t1.y - 3)}l8 6M${f(t2.x - 3)} ${f(t2.y - 2.4)}l6 4.8`, NEGRO, 1.5, 0.45) + circulo(p.x, p.y, 2.4, NEGRO) + circulo(p.x - 0.6, p.y - 0.6, 1, C.luz, 0.7);
  });
  // Un tendedero entre dos paños, con la ropa colgando.
  const t0 = polar(284, 387);
  const t1 = polar(268, 384);
  if (libre({ x: (t0.x + t1.x) / 2, y: (t0.y + t1.y) / 2 }, aros, 4)) {
    s += trazo(`M${f(t0.x)} ${f(t0.y)}Q${f((t0.x + t1.x) / 2)} ${f((t0.y + t1.y) / 2 + 8)} ${f(t1.x)} ${f(t1.y)}`, NEGRO, 1, 0.5);
    [C.rosa, C.luz, C.azul, C.lila, C.rosa].forEach((color, i) => {
      const t = 0.14 + i * 0.18;
      const x = t0.x + (t1.x - t0.x) * t;
      const y = t0.y + (t1.y - t0.y) * t + 4 * Math.sin(Math.PI * t) * 2;
      s += forma(poligono([{ x: x - 3, y }, { x: x + 3, y }, { x: x + 3.5, y: y + 9 }, { x: x - 3.5, y: y + 9 }]), color, 0.9);
    });
  }
  // El rastro de un gato por las chapas.
  let patas = '';
  let gx = polar(285, 372).x;
  let gy = polar(285, 372).y;
  for (let i = 0; i < 9; i++) {
    gx += 6.5 + rnd() * 1.5;
    gy += -5.5 + rnd();
    if (libre({ x: gx, y: gy }, aros, 3)) patas += huella(gx + (i % 2 ? 2.6 : -2.6), gy, 38, 1.3);
  }
  s += forma(patas, NEGRO, 0.45);
  // El borde de afuera se va a la oscuridad.
  s += nube(209, 245, 150, 36, NEGRO, 'xl', 0.45, 68);
  return s;
}

/* ------------------------------------------------------------------
   El monte
   ------------------------------------------------------------------ */

const M = {
  claro: 'var(--entorno-monte-claro)',
  medio: 'var(--entorno-monte-medio)',
  hondo: 'var(--entorno-monte-hondo)',
  ocre: 'var(--bestia-lobo-ocre)',
  crema: 'var(--bestia-lobo-crema)',
  sombra: 'var(--bestia-lobo-sombra)',
  oscuro: 'var(--bestia-lobo-oscuro)',
  gris: 'var(--bestia-lobo-gris)',
  naranja: 'var(--disco-lobo-suelto-tinta)',
  petroleo: 'var(--disco-lobo-suelto-apoyo)',
  luna: 'var(--portal-luna)',
  oro: 'var(--acento-2)',
  fuego: 'var(--entorno-infierno-fuego)',
  brasa: 'var(--entorno-infierno-brasa)',
};

/** El claro de la pastura y el volcán, que los árboles dejan libres, y el centro de cada uno. */
const PASTURA = { x: 275, y: 258.7, r: 72 } as const;
const VOLCAN = { x: 165, y: 272 } as const;

/** Los bichos del monte: x, y, tam, como en `bestiario.json`. */
const BICHOS_MONTE: ReadonlyArray<readonly [number, number, number]> = [
  [330, 198, 42], [240, 368, 38], [165, 262, 34], [214, 186, 30], [354, 283, 28], [326, 128, 34], [140, 325, 32], [398, 226, 32],
];

function monte(): string {
  const rnd = azar(3401);
  const aros: Aro[] = BICHOS_MONTE.map(([x, y, tam]) => ({ x, y, r: tam * 0.55 }));
  let s = '';

  /*
   * El monte cerrado: el piso hondo, las copas apiñadas, y los claros de luna donde está cada
   * bicho (el aro del visor) y por donde pasan los senderos. Lo oscuro queda entre claro y claro.
   */
  const claros: Aro[] = [
    ...BICHOS_MONTE.map(([x, y, tam]) => ({ x, y, r: tam * 0.55 + 6 })),
    { x: PASTURA.x, y: PASTURA.y, r: PASTURA.r + 8 },
    { x: VOLCAN.x, y: VOLCAN.y, r: 58 },
  ];
  s += forma(sector(293, 342, 246, 432), M.hondo);
  for (const [x, y, rx, ry, o] of [[190, 380, 70, 36, 0.5], [330, 170, 60, 44, 0.45], [250, 150, 56, 30, 0.4], [380, 290, 38, 50, 0.45], [120, 250, 40, 60, 0.4]] as const) s += nube(x, y, rx, ry, M.petroleo, 'xl', o);

  /* Los senderos de tierra clara: del claro al volcán, a las lobas, y de ahí a lo hondo. */
  const senderos: ReadonlyArray<readonly Pt[]> = [
    [{ x: 342, y: 398 }, { x: 312, y: 366 }, { x: 296, y: 350 }, { x: 284, y: 336 }],
    [{ x: 206, y: 266 }, { x: 188, y: 290 }, { x: 160, y: 308 }, { x: 134, y: 330 }, { x: 114, y: 346 }],
    [{ x: 258, y: 200 }, { x: 236, y: 188 }, { x: 212, y: 186 }, { x: 186, y: 166 }],
    [{ x: 322, y: 214 }, { x: 336, y: 196 }, { x: 342, y: 160 }, { x: 330, y: 122 }, { x: 316, y: 96 }],
  ];
  const sendero = (pts: readonly Pt[]): string => {
    let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      d += `Q${f(pts[i].x)} ${f(pts[i].y)} ${f(mx)} ${f(my)}`;
    }
    const u = pts[pts.length - 1];
    return d + `L${f(u.x)} ${f(u.y)}`;
  };
  for (const pts of senderos) {
    for (let i = 0; i < pts.length - 1; i++) {
      for (let t = 0; t < 1; t += 0.25) claros.push({ x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t, r: 8 });
    }
  }

  // Las copas: manchas sopladas de verde apagado, a la luz de la luna que entra por arriba a la derecha.
  const enElMonte = (p: Pt): boolean => {
    const ang = ((Math.atan2(p.x - 500, 500 - p.y) * 180) / Math.PI + 360) % 360;
    const dist = Math.hypot(p.x - 500, p.y - 500);
    return ang > 294 && ang < 341 && dist > 250 && dist < 436;
  };
  const copas: Pt[] = [];
  for (let gy = 70; gy < 440; gy += 15) {
    for (let gx = 70; gx < 440; gx += 15) {
      const p = { x: gx + (rnd() - 0.5) * 14, y: gy + (rnd() - 0.5) * 14 };
      if (enElMonte(p) && claros.every((c) => Math.hypot(c.x - p.x, c.y - p.y) > c.r - 4)) copas.push(p);
    }
  }
  copas.sort((a, b) => a.y - b.y);
  for (const p of copas) {
    const R = 17 + rnd() * 9;
    const u = rnd();
    s += nube(p.x - 4, p.y + 5, R * 1.1, R, NEGRO, 's', 0.55);
    s += nube(p.x, p.y, R, R * 0.92, u < 0.5 ? M.oscuro : M.hondo, 'xs');
    s += nube(p.x + R * 0.1, p.y - R * 0.12, R * 0.66, R * 0.58, u < 0.4 ? M.petroleo : M.medio, 's', u < 0.4 ? 0.55 : 0.55);
    if (u > 0.5) s += nube(p.x + R * 0.3, p.y - R * 0.34, R * 0.3, R * 0.26, M.claro, 'xs', 0.65);
  }

  /* Los claros de luna: tierra de hojas clara, alrededor de cada bicho, y los senderos. */
  for (const [x, y, tam] of BICHOS_MONTE) s += nube(x, y, tam * 0.66, tam * 0.6, M.crema, 'm', 0.9) + nube(x, y, tam * 0.85, tam * 0.75, M.ocre, 'l', 0.4);
  s += nube(PASTURA.x, PASTURA.y, 100, 100, M.crema, 'xl', 0.4);
  for (const pts of senderos) {
    const d = sendero(pts);
    s += pista(d, M.oscuro, 12, 0.3, 's') + pista(d, M.crema, 8, 0.8, 'xs') + pista(d, M.claro, 2.4, 0.5, 'xs');
  }
  // Las hojas caídas: el naranja del disco y el pardo, regados por los claros.
  const hojas: Pt[] = [];
  const hojasOscuras: Pt[] = [];
  for (let i = 0; i < 520 && hojas.length + hojasOscuras.length < 200; i++) {
    const p = polar(294 + rnd() * 48, 248 + rnd() * 180);
    if (claros.some((c) => Math.hypot(c.x - p.x, c.y - p.y) < c.r - 2)) (i % 3 ? hojas : hojasOscuras).push(p);
  }
  s += puntos(hojasOscuras, M.sombra, 2.6, 0.55) + puntos(hojas, M.naranja, 2.8, 0.75);
  // Los haces de luna que se cuelan entre las copas.
  for (const [x, y, ang] of [[330, 110, 30], [250, 190, 24], [180, 240, 34]] as const) s += nube(x, y, 20, 110, M.luna, 'xl', 0.1, ang);

  /* Un tronco caído, tres peñascos con musgo. */
  const troncoCaido = (x: number, y: number, giro: number, largo: number): string =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${giro})">` +
    nube(2, 5, largo / 2, 6, NEGRO, 's', 0.5) +
    `<rect x="${f(-largo / 2)}" y="-5.5" width="${largo}" height="11" rx="5" fill="${M.sombra}"/>` +
    `<rect x="${f(-largo / 2 + 4)}" y="-4" width="${f(largo - 8)}" height="3" rx="1.5" fill="${M.ocre}" opacity="0.6"/>` +
    `<ellipse cx="${f(largo / 2 - 1)}" cy="0" rx="3.4" ry="5.5" fill="${M.crema}"/><ellipse cx="${f(largo / 2 - 1)}" cy="0" rx="1.6" ry="3" fill="${M.ocre}"/>` +
    `<path d="M${f(-largo / 2 + 10)} -1 q8 4 16 0" stroke="${M.petroleo}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.7"/></g>`;
  for (const [x, y, g, l] of [[300, 300, -28, 44], [350, 158, 62, 38], [190, 340, 14, 40]] as const) s += troncoCaido(x, y, g, l);
  for (const [x, y, k] of [[388, 322, 1], [224, 134, 0.8], [118, 296, 0.9]] as const) {
    s += nube(x - 3, y + 5, 15 * k, 11 * k, NEGRO, 's', 0.5) + nube(x, y, 13 * k, 10 * k, M.medio, 's') + nube(x - 3, y - 3, 7 * k, 5 * k, M.claro, 's', 0.65) + nube(x + 4, y + 3, 6 * k, 4 * k, M.petroleo, 's', 0.55);
  }

  /* El volcán del joven lobo: el cono con sus costillas, el cráter que brilla y la humareda. */
  const vx = VOLCAN.x;
  const vy = VOLCAN.y;
  s += nube(vx, vy + 6, 62, 48, NEGRO, 'm', 0.45);
  const cono = poligono([{ x: vx - 56, y: vy + 26 }, { x: vx - 30, y: vy - 22 }, { x: vx - 12, y: vy - 28 }, { x: vx + 14, y: vy - 28 }, { x: vx + 32, y: vy - 20 }, { x: vx + 58, y: vy + 26 }, { x: vx + 20, y: vy + 40 }, { x: vx - 24, y: vy + 40 }]);
  let costillas = '';
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * Math.PI * 2;
    costillas += `M${f(vx + Math.cos(a) * 18)} ${f(vy - 14 + Math.sin(a) * 10)}L${f(vx + Math.cos(a + 0.12) * 62)} ${f(vy + 4 + Math.sin(a + 0.12) * 40)}`;
  }
  s += enmascarado(
    'oe-volcan',
    cono,
    forma(cono, M.sombra) + nube(vx - 20, vy - 4, 36, 28, M.crema, 'm', 0.55) + nube(vx + 28, vy + 24, 38, 24, NEGRO, 'm', 0.55) + trazo(costillas, NEGRO, 1.6, 0.4) + trazo(costillas, M.gris, 1, 0.18),
  );
  s += `<ellipse cx="${f(vx)}" cy="${f(vy - 14)}" rx="22" ry="13" fill="${M.oscuro}"/>`;
  s += nube(vx, vy - 14, 21, 12, M.brasa, 's') + nube(vx, vy - 14, 15, 8, M.fuego, 's') + nube(vx - 2, vy - 15, 7, 4, M.oro, 'xs') + nube(vx, vy - 12, 46, 30, M.fuego, 'xl', 0.4);
  for (const [dx, dy, ex, ey] of [[-8, -8, -26, 30], [6, -6, 10, 32], [14, -10, 40, 22]] as const) {
    const lava = `M${f(vx + dx)} ${f(vy + dy)}q${f((ex - dx) * 0.2 + 6)} ${f((ey - dy) * 0.5)} ${f(ex - dx)} ${f(ey - dy)}`;
    s += trazo(lava, M.brasa, 3.4, 0.9) + trazo(lava, M.fuego, 1.4, 0.9);
  }
  for (const [dx, dy, rx, o] of [[12, -42, 14, 0.5], [22, -62, 18, 0.42], [36, -84, 22, 0.34], [54, -104, 26, 0.24]] as const) s += nube(vx + dx, vy + dy, rx, rx * 0.8, M.gris, 'l', o);

  /* Las huellas de un lobo que viene del sur por el monte, hasta el claro. */
  const camino: readonly Pt[] = [{ x: 384, y: 300 }, { x: 366, y: 268 }, { x: 352, y: 238 }, { x: 346, y: 214 }];
  let pisadas = '';
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const seg = Math.min(2, Math.floor(t * 3));
    const u = t * 3 - seg;
    const a = camino[seg];
    const b = camino[seg + 1];
    const x = a.x + (b.x - a.x) * u + (i % 2 ? 3 : -3);
    const y = a.y + (b.y - a.y) * u;
    pisadas += huella(x, y, Math.atan2(b.x - a.x, -(b.y - a.y)) * 57.3, 1.7);
  }
  s += forma(pisadas, M.oscuro, 0.6);

  /* Los pinos del borde de cada claro, vistos desde arriba: estrellas de agujas. */
  const pinos: Array<{ x: number; y: number; R: number }> = [];
  for (let gy = 84; gy < 430; gy += 21) {
    for (let gx = 84; gx < 430; gx += 21) {
      const p = { x: gx + (rnd() - 0.5) * 18, y: gy + (rnd() - 0.5) * 18 };
      const R = 12 + rnd() * 8;
      if (!enElMonte(p) || rnd() < 0.55) continue;
      // Sobre el borde de un claro, que es donde se cuentan los pinos, y no sobre un bicho.
      const borde = claros.some((c) => Math.abs(Math.hypot(c.x - p.x, c.y - p.y) - c.r) < R * 0.9);
      if (!borde || !aros.every((a) => Math.hypot(a.x - p.x, a.y - p.y) > a.r + R * 0.4)) continue;
      if (claros.some((c) => c.r < 20 && Math.hypot(c.x - p.x, c.y - p.y) < c.r + R * 0.3)) continue;
      if (pinos.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < (o.R + R) * 0.8)) continue;
      pinos.push({ x: p.x, y: p.y, R });
    }
  }
  pinos.sort((a, b) => a.y - b.y);
  pinos.forEach((p, i) => {
    const pts = puntasDePino(rnd, 9 + (i % 3));
    s += nube(p.x - p.R * 0.3, p.y + p.R * 0.38, p.R * 1.05, p.R * 0.88, NEGRO, 's', 0.55);
    s += forma(estrella(pts, p.x, p.y, p.R), i % 3 === 0 ? M.oscuro : M.hondo);
    s += nube(p.x - p.R * 0.3, p.y + p.R * 0.25, p.R * 0.6, p.R * 0.5, M.petroleo, 's', 0.5);
    s += forma(estrella(pts, p.x + p.R * 0.12, p.y - p.R * 0.14, p.R * 0.72), M.medio, 0.6);
    s += forma(estrella(pts, p.x + p.R * 0.22, p.y - p.R * 0.26, p.R * 0.34), M.claro, 0.7);
  });

  /* Ojos en lo hondo, donde el monte se cierra. */
  for (const [ang, r] of [[336, 408], [300, 408], [320, 418]] as const) {
    const p = polar(ang, r);
    s += nube(p.x, p.y, 8, 5, M.oro, 'xs', 0.45) + circulo(p.x - 3, p.y, 1.5, M.oro) + circulo(p.x + 3, p.y, 1.5, M.oro);
  }
  // La noche se cierra en el borde de afuera.
  s += nube(250, 110, 150, 34, NEGRO, 'xl', 0.4, -36);
  return s;
}

/* ------------------------------------------------------------------
   La pastura
   ------------------------------------------------------------------ */

const P = {
  naranja: 'var(--entorno-pastura)',
  honda: 'var(--entorno-pastura-honda)',
  pezunia: 'var(--bestia-cordero-pezunia)',
  lana: 'var(--bestia-cordero-lana)',
  lanaClara: 'var(--bestia-cordero-lana-clara)',
  lanaOscura: 'var(--bestia-cordero-lana-oscura)',
  oscuro: 'var(--bestia-lobo-oscuro)',
  sombra: 'var(--bestia-lobo-sombra)',
  crema: 'var(--bestia-lobo-crema)',
  oro: 'var(--acento-2)',
};

function pastura(): string {
  const rnd = azar(3171);
  const { x: cx, y: cy, r } = PASTURA;
  // Los bichos de la pastura: el cordero, el borrego, la vaca, el rebaño y el ovejero.
  const aros: Aro[] = ([[296, 262, 40], [250, 236, 30], [302, 222, 36], [252, 284, 26], [226, 302, 32]] as const).map(([x, y, tam]) => ({ x, y, r: tam * 0.55 }));
  let s = '';

  /* El pasto que brilla: naranja de la tapa, más hondo en la orilla y encendido en el medio. */
  s += circulo(cx, cy, r + 2, P.honda);
  s += nube(cx, cy, r * 0.92, r * 0.92, P.naranja, 'm') + nube(cx - 14, cy - 12, 44, 38, P.pezunia, 'xl', 0.6) + nube(cx + 22, cy + 20, 30, 24, P.pezunia, 'l', 0.3);
  s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r + 8}" fill="none" stroke="${NEGRO}" stroke-width="20" filter="url(#soplo-m)" opacity="0.55"/>`;

  /* Las briznas, en tandas, y los espirales de crayón de la contratapa del disco 2. */
  const briznas = (color: string, ancho: number, o: number, cuantas: number, largo: number): string => {
    let d = '';
    for (let i = 0; i < cuantas; i++) {
      const a = rnd() * Math.PI * 2;
      const dd = 30 + Math.sqrt(rnd()) * (r - 36);
      const p = { x: cx + Math.cos(a) * dd, y: cy + Math.sin(a) * dd };
      if (!libre(p, aros, 6)) continue;
      const h = largo * (0.7 + rnd() * 0.6);
      d += `M${f(p.x - 2.6)} ${f(p.y)}l${f(-1 + rnd() * 2)} ${f(-h * 0.7)}M${f(p.x)} ${f(p.y)}l${f(-1.5 + rnd() * 3)} ${f(-h)}M${f(p.x + 2.6)} ${f(p.y)}l${f(rnd() * 3)} ${f(-h * 0.7)}`;
    }
    return trazo(d, color, ancho, o);
  };
  s += briznas(P.lana, 1.5, 0.55, 46, 9) + briznas(P.pezunia, 1.2, 0.8, 34, 8) + briznas(P.lanaOscura, 1.4, 0.4, 24, 8);
  const espiral = (x: number, y: number, rr: number): string => {
    let d = '';
    for (let k = 0; k <= 36; k++) {
      const a = (k / 36) * Math.PI * 4.5;
      const q = (rr * k) / 36;
      d += `${k ? 'L' : 'M'}${f(x + Math.cos(a) * q)} ${f(y + Math.sin(a) * q * 0.7)} `;
    }
    return trazo(d, P.lanaClara, 2, 0.65);
  };
  s += espiral(cx - 36, cy + 34, 12) + espiral(cx + 40, cy - 38, 10) + espiral(cx - 44, cy - 24, 8);
  // Flores amarillas de campo y unos chaquiñanes de pezuñas.
  const flores: Pt[] = [];
  for (let i = 0; i < 40 && flores.length < 12; i++) {
    const a = rnd() * Math.PI * 2;
    const dd = 36 + rnd() * (r - 44);
    const p = { x: cx + Math.cos(a) * dd, y: cy + Math.sin(a) * dd };
    if (libre(p, aros, 6)) flores.push(p);
  }
  s += puntos(flores, P.oro, 3, 0.9) + puntos(flores.map((p) => ({ x: p.x, y: p.y })), P.pezunia, 1.2);
  let pezunias = '';
  for (let i = 0; i < 18; i++) {
    const a = rnd() * Math.PI * 2;
    const dd = 26 + rnd() * (r - 36);
    const p = { x: cx + Math.cos(a) * dd, y: cy + Math.sin(a) * dd };
    if (!libre(p, aros, 5)) continue;
    const g = rnd() * 6.28;
    pezunias += `M${f(p.x + Math.cos(g) * 1.8)} ${f(p.y + Math.sin(g) * 1.8)}l${f(Math.cos(g + 0.3) * 3.4)} ${f(Math.sin(g + 0.3) * 3.4)}M${f(p.x - Math.cos(g) * 1.8)} ${f(p.y - Math.sin(g) * 1.8)}l${f(Math.cos(g + 0.3) * 3.4)} ${f(Math.sin(g + 0.3) * 3.4)}`;
  }
  s += trazo(pezunias, P.sombra, 1.8, 0.5);

  /* El palenque: el círculo pelado que deja la soga, el palo y la soga al cordero. */
  s += nube(cx, cy + 2, 40, 36, P.honda, 'm', 0.95) + nube(cx, cy + 4, 30, 24, P.sombra, 'l', 0.3);
  s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="22" fill="none" stroke="${P.sombra}" stroke-width="4" opacity="0.35" filter="url(#soplo-xs)"/>`;
  s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="30" fill="none" stroke="${P.oscuro}" stroke-width="1.4" stroke-dasharray="3 5" opacity="0.55"/>`;
  s += pista(`M${f(cx + 2)} ${f(cy - 14)}Q${f(cx + 12)} ${f(cy - 4)} ${f(cx + 20)} ${f(cy + 2)}`, P.crema, 2.2, 0.9, 'xs');
  s += nube(cx + 3, cy + 1, 12, 4, NEGRO, 's', 0.7, -12);
  s += enmascarado('oe-palo', `M${f(cx - 4.4)} ${f(cy + 3)}L${f(cx - 3.6)} ${f(cy - 20)}L${f(cx + 3.8)} ${f(cy - 22)}L${f(cx + 4.4)} ${f(cy + 3)}Z`, circulo(cx, cy - 8, 20, P.sombra) + nube(cx - 2.5, cy - 9, 1.6, 12, P.crema, 'xs', 0.8) + nube(cx + 4, cy - 9, 2, 12, NEGRO, 'xs', 0.8));
  s += circulo(cx, cy - 20, 3.6, P.crema) + circulo(cx, cy - 20, 1.8, P.sombra);
  // Mechones de lana enganchados en el pasto.
  const lana: Pt[] = [];
  for (let i = 0; i < 40 && lana.length < 10; i++) {
    const a = rnd() * Math.PI * 2;
    const dd = 14 + rnd() * (r - 22);
    const p = { x: cx + Math.cos(a) * dd, y: cy + Math.sin(a) * dd };
    if (libre(p, aros, 4)) lana.push(p);
  }
  s += puntos(lana, PAPEL, 3.2, 0.75);
  return s;
}

/* ------------------------------------------------------------------
   La mesa
   ------------------------------------------------------------------ */

const T = {
  rojo: 'var(--entorno-mesa-rojo)',
  luz: 'var(--entorno-mesa-luz)',
  haz: 'var(--entorno-mesa-haz)',
  papel: 'var(--entorno-mesa-papel)',
  sepia: 'var(--entorno-mesa-sepia)',
  clara: 'var(--entorno-mesa-sepia-clara)',
  honda: 'var(--entorno-mesa-sepia-honda)',
  sopa: 'var(--disco-la-mosca-y-la-sopa-tinta)',
  petroleo: 'var(--disco-la-mosca-y-la-sopa-apoyo)',
  oro: 'var(--acento-2)',
};

/** Los bichos de la mesa: ángulo, radio y tamaño, como en `bestiario.json`. */
const AROS_MESA: readonly Aro[] = [
  aroDe(302, 205, 40), aroDe(314, 198, 34), aroDe(288, 212, 34), aroDe(326, 210, 34), aroDe(300, 162, 26), aroDe(272, 198, 30),
  aroDe(263, 168, 28), aroDe(282, 160, 22), aroDe(276, 232, 22), aroDe(334, 172, 30), aroDe(318, 240, 32), aroDe(262, 230, 32),
];

/** Un grupo con el origen en un punto de la mesa: x va por la tangente, y hacia el centro. */
const enMesa = (ang: number, r: number, cuerpo: string, giro = 0): string => {
  const p = polar(ang, r);
  return `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(ang + giro)})">${cuerpo}</g>`;
};

function mesa(): string {
  const rnd = azar(2603);
  const aros = AROS_MESA;
  const [A0, A1, R0, R1] = [258, 337, 152, 238];
  let s = '';

  /* El piso de tablas, que apenas asoma, y la sombra que la mesa le echa. */
  s += forma(sector(254, 341, 136, 254), T.honda);
  let tablas = '';
  for (let a = 254; a < 342; a += 2.4) tablas += `M${xy(a, 136)}L${xy(a, 254)}`;
  s += trazo(tablas, NEGRO, 1.2, 0.5);
  s += soplo(sector(A0 - 0.5, A1 + 0.5, R0 - 3, R1 + 7), NEGRO, 'm', 0.8);

  /* El mantel: crema, con un cuadrillé de rojo que apenas se nota y las caídas con sus pliegues. */
  const mantel = sector(A0, A1, R0, R1);
  let cuadrillePlano = '';
  for (const r of [160, 178, 196, 214, 232]) cuadrillePlano += arco(A0, A1, r);
  let cuadrilleRadial = '';
  for (let a = A0 + 2; a < A1; a += 4.6) cuadrilleRadial += `M${xy(a, R0)}L${xy(a, R1)}`;
  let pliegues = '';
  let pliegueClaro = '';
  for (let a = A0 + 1; a < A1; a += 2.8 + rnd() * 1.6) {
    pliegues += `M${xy(a, R1 - 8)}L${xy(a + 0.3, R1)}M${xy(a, R0 + 8)}L${xy(a + 0.3, R0)}`;
    pliegueClaro += `M${xy(a + 0.8, R1 - 8)}L${xy(a + 1.1, R1)}M${xy(a + 0.8, R0 + 8)}L${xy(a + 1.1, R0)}`;
  }
  const manchas =
    nube(polar(287, 224).x, polar(287, 224).y, 17, 12, T.rojo, 'm', 0.32) + nube(polar(331, 187).x, polar(331, 187).y, 12, 9, T.clara, 'm', 0.5) +
    nube(polar(268, 182).x, polar(268, 182).y, 18, 11, T.clara, 'l', 0.4) + nube(polar(310, 224).x, polar(310, 224).y, 14, 8, T.honda, 'l', 0.2) +
    `<circle cx="${f(polar(308, 230).x)}" cy="${f(polar(308, 230).y)}" r="7.5" fill="none" stroke="${T.rojo}" stroke-width="1.6" opacity="0.38" filter="url(#soplo-xs)"/>` +
    `<circle cx="${f(polar(293, 176).x)}" cy="${f(polar(293, 176).y)}" r="6" fill="none" stroke="${T.sepia}" stroke-width="1.4" opacity="0.4" filter="url(#soplo-xs)"/>`;
  s += enmascarado(
    'oe-mantel',
    mantel,
    forma(mantel, T.papel) +
      nube(polar(297, 195).x, polar(297, 195).y, 78, 60, PAPEL, 'xl', 0.45) +
      trazo(cuadrillePlano, T.rojo, 9, 0.2) + trazo(cuadrilleRadial, T.rojo, 8, 0.2) +
      manchas +
      soplo(sector(A0, A1, R0, R0 + 7), T.clara, 's', 0.6) + soplo(sector(A0, A1, R1 - 7, R1), T.clara, 's', 0.6) +
      trazo(pliegues, T.honda, 1.4, 0.35) + trazo(pliegueClaro, PAPEL, 1, 0.55) +
      trazo(arco(A0, A1, R0 + 1.5), T.rojo, 2.2, 0.5) + trazo(arco(A0, A1, R1 - 1.5), T.rojo, 2.2, 0.5) +
      nube(polar(A0, 195).x, polar(A0, 195).y, 8, 50, NEGRO, 'm', 0.28, 12) + nube(polar(A1, 195).x, polar(A1, 195).y, 8, 50, NEGRO, 'm', 0.28, -20),
  );

  /* Migas y gotas, donde no tapen un bicho. */
  const migas: Pt[] = [];
  const migasClaras: Pt[] = [];
  const gotas: Pt[] = [];
  for (let i = 0; i < 400 && migas.length + gotas.length < 100; i++) {
    const p = polar(A0 + 2 + rnd() * (A1 - A0 - 4), R0 + 6 + rnd() * (R1 - R0 - 12));
    if (!libre(p, aros, 3)) continue;
    const u = rnd();
    if (u < 0.55) migas.push(p);
    else if (u < 0.82) migasClaras.push(p);
    else gotas.push(p);
  }
  s += puntos(migas, T.sepia, 1.7, 0.7) + puntos(migasClaras, PAPEL, 1.9, 0.85) + puntos(gotas, T.sopa, 2.4, 0.7);

  /* La sopa: el plato hondo bajo la mosca, la sopera, la miel y el pan. */
  const tazon = (cuerpo = ''): string =>
    nube(-3, 4, 22, 20, NEGRO, 's', 0.5) + circulo(0, 0, 20, PAPEL) +
    `<circle r="20" fill="none" stroke="${T.clara}" stroke-width="1.6"/><circle r="14.5" fill="${T.haz}" opacity="0.6"/>` + cuerpo;
  const sopa =
    `<circle r="11.5" fill="${T.sopa}"/>` + nube(-3, -3, 7, 4, T.oro, 'xs', 0.55) +
    `<path d="M-6 2q4 -8 10 -4q3 4 -2 6q-5 1 -4 -3" fill="none" stroke="${T.luz}" stroke-width="1.4" opacity="0.8"/>` +
    puntos([{ x: 5, y: 4 }, { x: -7, y: -4 }, { x: 1, y: 7 }], T.clara, 2.6, 0.95);
  s += enMesa(300, 162, tazon(sopa));
  // El vapor de la sopa y sus salpicaduras.
  s += nube(polar(300, 162).x + 6, polar(300, 162).y - 14, 10, 7, PAPEL, 'm', 0.3) + nube(polar(300, 162).x + 12, polar(300, 162).y - 26, 8, 6, PAPEL, 'm', 0.22);
  // Los otros dos platos, vacíos, con sus cubiertos.
  const cubiertos = (): string =>
    trazo('M-28 14L-28 -4M-30.6 -4l0 -9M-28 -4l0 -10M-25.4 -4l0 -9', NEGRO, 1.1, 0.4) +
    trazo('M-29 14L-29 -4M-31.6 -4l0 -9M-29 -4l0 -10M-26.4 -4l0 -9', T.haz, 1.2) +
    forma('M26 14L29.4 14L29.4 -12Q27 -15 26 -8Z', T.haz) + forma('M29.4 14L29.4 -12L30.6 -10L30.6 14Z', NEGRO, 0.35) + `<rect x="25.6" y="4" width="3.8" height="12" rx="1.6" fill="${T.sepia}"/>`;
  s += enMesa(296, 237, tazon(`<path d="M-8 3q6 4 14 -2" stroke="${T.clara}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>`) + cubiertos(), 180);
  s += enMesa(331, 233, tazon(`<ellipse cx="-2" cy="1" rx="8" ry="4" fill="${T.sopa}" opacity="0.7"/>`) + cubiertos(), 180);
  // La sopera, de loza, con su tapa y las dos asas.
  s += enMesa(
    319, 158,
    nube(-4, 5, 22, 18, NEGRO, 's', 0.5) + `<ellipse cx="-17" cy="0" rx="4.4" ry="3" fill="${T.haz}"/><ellipse cx="17" cy="0" rx="4.4" ry="3" fill="${T.haz}"/>` +
      circulo(0, 0, 17, PAPEL) + `<circle r="17" fill="none" stroke="${T.clara}" stroke-width="1.6"/><circle r="12" fill="${T.haz}" opacity="0.7"/>` +
      `<path d="M-10 0q10 -9 20 0" fill="none" stroke="${T.rojo}" stroke-width="1.4" opacity="0.6"/>` + nube(-3, -3, 5, 4, PAPEL, 'xs') + circulo(0, 0, 3.6, T.clara) + circulo(-0.8, -0.8, 1.4, PAPEL),
  );
  // El frasco de miel visto desde arriba, y el hilo que baja hacia las hormigas.
  const miel = polar(286, 147);
  s += pista(`M${f(miel.x + 2)} ${f(miel.y + 6)}q-4 7 -1 14q3 6 -2 12`, T.oro, 2.4, 0.9, 'xs');
  s += enMesa(286, 147, nube(-2, 3, 11, 10, NEGRO, 's', 0.5) + circulo(0, 0, 9.2, T.oro) + `<circle r="9.2" fill="none" stroke="${T.sepia}" stroke-width="1"/>` + circulo(0, 0, 6.2, T.clara) + `<circle r="6.2" fill="none" stroke="${T.honda}" stroke-width="0.8"/>` + nube(-2, -2, 2.4, 1.8, PAPEL, 'xs', 0.9));
  // El pan, con los tajos.
  s += enMesa(273, 151, nube(-2, 3, 14, 7, NEGRO, 's', 0.5) + `<ellipse rx="13" ry="7" fill="${T.sepia}"/><ellipse cx="-2" cy="-1.4" rx="9" ry="3.6" fill="${T.clara}" opacity="0.8"/><path d="M-6 -3l3 6M-1 -3.4l3 6.4M4 -2.6l2.6 5.2" stroke="${T.honda}" stroke-width="1.2" stroke-linecap="round" fill="none"/>`, 14);
  // Las copas, con un resto de vino.
  for (const [ang, r] of [[307, 238], [286, 238]] as const) s += enMesa(ang, r, nube(-2, 3, 8, 7, NEGRO, 's', 0.45) + circulo(0, 0, 6.6, T.haz, 0.55) + `<circle r="6.6" fill="none" stroke="${T.haz}" stroke-width="1.4"/>` + circulo(0, 0, 4, T.rojo, 0.75) + nube(-2, -2, 1.8, 1.2, PAPEL, 'xs'));

  /* La ventana: la luz fría entra por el borde y cae sobre el mantel con la sombra de los vidrios. */
  const haz = `M-17 4L17 4L46 92L-34 98Z`;
  s += enMesa(318, 246, soplo(haz, T.haz, 'm', 0.3) + trazo('M-8 6L-12 94M6 6L11 92M-26 50L30 46', T.honda, 4.5, 0.2) + `<rect x="-19" y="-6" width="38" height="12" fill="${T.honda}"/><rect x="-16.5" y="-4" width="33" height="9" fill="${T.haz}"/><path d="M0 -4L0 5M-16.5 0.5L16.5 0.5" stroke="${T.honda}" stroke-width="1.4"/>`);

  /* Moscas chicas, que no son bichos de la ficha: andan por la sopa y la miel. */
  const moscas: Pt[] = [];
  for (let i = 0; i < 300 && moscas.length < 7; i++) {
    const p = polar(A0 + 3 + rnd() * (A1 - A0 - 6), R0 + 8 + rnd() * (R1 - R0 - 16));
    if (libre(p, aros, 6) && moscas.every((o) => Math.hypot(o.x - p.x, o.y - p.y) > 26)) moscas.push(p);
  }
  moscas.forEach((p, i) => {
    const g = rnd() * 360;
    s += `<g transform="translate(${f(p.x)} ${f(p.y)}) rotate(${f(g)})"><ellipse cx="-2.2" cy="-1.4" rx="3.6" ry="1.4" fill="${T.haz}" opacity="0.55" transform="rotate(-24)"/><ellipse cx="2.2" cy="-1.4" rx="3.6" ry="1.4" fill="${T.haz}" opacity="0.55" transform="rotate(24)"/><ellipse rx="1.7" ry="2.6" fill="${NEGRO}"/>${i % 2 ? '' : `<circle cy="-2.4" r="1" fill="${T.rojo}"/>`}</g>`;
  });
  // La orilla del mantel se oscurece hacia el piso.
  s += nube(polar(297, 143).x, polar(297, 143).y, 70, 6, NEGRO, 'm', 0.35, -30);
  return s;
}

/** Las escenas de las cuatro zonas del oeste, por id de región. */
export const ESCENAS_OESTE: Readonly<Record<string, Escena>> = {
  'los-techos': techos,
  'el-monte': monte,
  'la-pastura': pastura,
  'la-mesa': mesa,
};
