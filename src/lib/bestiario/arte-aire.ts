/**
 * El arte del aire (`D-90`): la bruma, la niebla rasante, la ventisca, la ceniza y lo que queda
 * pegado a la cámara. Los números de cada capa están en `aire.ts`; acá se pinta su baldosa.
 *
 * Es aerógrafo, como todo el bestiario (`aerografo.ts`), con sus dos gestos:
 *
 * - **El soplo suelto**: manchas que se pierden para todos lados. La bruma de atrás.
 * - **La máscara de papel**: la *lengua* de niebla tiene el canto de abajo duro, como cortado con
 *   una hoja apoyada en el piso, y para arriba se pierde soplada. Así la niebla se posa: no flota
 *   como un humo de computadora, se apoya en el suelo como la pintó una mano.
 *
 * Y encima, el rociado: el grano grueso de la boquilla abierta, que es lo que la separa de un
 * degradé. `scripts/imprimir-bestiario.mjs` imprime cada baldosa una vez; el teléfono no sopla nada.
 *
 * Cada baldosa **cierra sin costura**: lo que cae cerca de un borde se pinta también del otro lado
 * (`vuelta`), así se puede repetir de costado todo lo que haga falta.
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { AIRE, altoDeBaldosa, type CapaDeAire } from './aire.ts';
import { M, azar, filaDeTiras } from './arte.ts';
import { ALTO } from './camino.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Las tintas de cada región, las mismas de su entorno (`arte-entornos.ts`, `tokens.css`). */
const C = {
  hondo: 'var(--entorno-cyber-acero-hondo)',
  acero: 'var(--entorno-cyber-acero)',
  claro: 'var(--entorno-cyber-acero-claro)',
  nieve: 'var(--entorno-cyber-nieve)',
  lente: 'var(--entorno-cyber-lente)',
};
const T = {
  noche: 'var(--entorno-astillero-noche)',
  azul: 'var(--entorno-astillero-azul)',
  clara: 'var(--entorno-astillero-tiza-clara)',
  sodio: 'var(--disco-cordero-atado-tinta)',
  negro: 'var(--fondo)',
};
const I = {
  brasa: 'var(--entorno-infierno-brasa)',
  fuego: 'var(--entorno-infierno-fuego)',
  chispa: 'var(--entorno-templo-foco)',
  ceniza: 'var(--entorno-monte-medio)',
  negro: 'var(--fondo)',
};

/**
 * Lo que cae cerca de un borde de la baldosa se repite del otro lado. `medio`: hasta dónde llega
 * la mancha desde su centro, con el soplo incluido. `n` distingue las copias (los `id` de máscara).
 */
/** Lo que se imprime de más a cada lado de una baldosa antes de recortarla (`Pieza.sangria`). */
const SANGRIA = 120;

function vuelta(x: number, medio: number, ancho: number, pinta: (x: number, n: number) => string): string {
  let s = pinta(x, 0);
  if (x - medio < SANGRIA) s += pinta(x + ancho, 1);
  if (x + medio > ancho - SANGRIA) s += pinta(x - ancho, 2);
  return s;
}

/**
 * Una lengua de niebla: el canto de abajo duro (la máscara de papel apoyada en el piso, apenas
 * combada) y para arriba soplada. Lo más espeso está contra el canto.
 */
function lengua(id: string, x: number, y: number, largo: number, alto: number, color: string, o: number): string {
  // La máscara pasa de largo a los costados: lo único que corta es el canto de abajo.
  const a = x - largo * 0.8;
  const b = x + largo * 0.8;
  const silueta = `M${f(a)} ${f(y)} Q${f(x)} ${f(y + alto * 0.55)} ${f(b)} ${f(y)} L${f(b)} ${f(y - alto * 4)} L${f(a)} ${f(y - alto * 4)} Z`;
  const tam = largo >= 230 ? 'l' : 'm';
  return enmascarado(
    id,
    silueta,
    nube(x, y + alto * 0.3, largo * 0.3, alto * 1.25, color, tam, o) + nube(x - largo * 0.07, y + alto * 0.16, largo * 0.15, Math.max(5, alto * 0.42), color, 'm', o * 0.85),
  );
}

/** Lenguas sembradas en una franja: las de arriba (lejos) más chicas y finas que las de abajo. */
function lenguas(prefijo: string, c: CapaDeAire, semilla: number, cuantas: number, desde: number, hasta: number, tintas: readonly (readonly [string, number])[]): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantas; i++) {
    const hondura = (i + rnd() * 0.8) / cuantas;
    const y = desde + (hasta - desde) * hondura;
    const largo = 150 + hondura * 170 + rnd() * 110;
    const alto = 9 + hondura * 10 + rnd() * 5;
    const [color, o] = tintas[i % tintas.length]!;
    const x = rnd() * c.ancho;
    const oo = o * (0.8 + rnd() * 0.3);
    s += vuelta(x, largo * 0.8, c.ancho, (xx, n) => lengua(`${prefijo}-${i}-${n}`, xx, y, largo, alto, color, oo));
  }
  return s;
}

/** Manchas sueltas, sopladas para todos lados: la bruma. */
function manchas(c: CapaDeAire, semilla: number, cuantas: number, desde: number, hasta: number, tintas: readonly (readonly [string, number])[], gorda = 34): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantas; i++) {
    const x = (c.ancho / cuantas) * (i + rnd() * 0.9);
    const y = desde + rnd() * (hasta - desde);
    const rx = 110 + rnd() * 150;
    const ry = gorda * (0.5 + rnd() * 0.5);
    const [color, o] = tintas[i % tintas.length]!;
    const oo = o * (0.75 + rnd() * 0.4);
    // El filtro del soplo llega hasta dos veces y media el alto de la mancha: una mancha chata con el
    // soplo más ancho quedaba cortada a cuchillo arriba y abajo. La chata lleva un soplo más corto.
    s += vuelta(x, rx + 80, c.ancho, (xx) => nube(xx, y, rx, ry, color, ry >= 17 ? 'xl' : 'l', oo));
  }
  return s;
}

/** Lo de bien abajo se apaga contra el borde de la pantalla, como en el piso del monte. */
const apagon = (c: CapaDeAire, color: string, o = 0.85): string =>
  soplo(`M-260 ${ALTO - 12} L${c.ancho + 260} ${ALTO - 12} L${c.ancho + 260} ${ALTO + 80} L-260 ${ALTO + 80} Z`, color, 'l', o);

/**
 * La hoja entera de la baldosa, sin tinta. El filtro del grano mide lo que filtra por la caja de lo
 * que tiene adentro, **sin contar el soplo**: sin esta hoja, cortaba cada mancha a cuchillo donde
 * terminaba su forma, y la bruma era una franja de borde duro.
 */
const hoja = (c: CapaDeAire): string => `<rect x="-200" y="${c.y - 40}" width="${c.ancho + 400}" height="${c.alto + 80}" fill="var(--fondo)" fill-opacity="0"/>`;

const rociado = (c: CapaDeAire, adentro: string): string => `<g filter="url(#rociado)">${hoja(c)}${adentro}</g>`;
/** Fuera de foco: lo que está pegado a la cámara se sopla entero. */
const fueraDeFoco = (adentro: string): string => `<g filter="url(#soplo-s)">${adentro}</g>`;

const receta = (region: string, pieza: string): CapaDeAire => AIRE[region]!.find((c) => c.pieza === pieza)!;

/* ------------------------------------------------------------------
   El monte (y la pastura, que es su claro)
   ------------------------------------------------------------------ */

function monteBruma(c: CapaDeAire): string {
  return rociado(c,     manchas(c, 311, 9, 262, 304, [[M.medio, 0.36], [M.claro, 0.17], [M.hondo, 0.4]]) +
      // Unas hebras más claras, finas, que cruzan: la bruma tiene vetas.
      manchas(c, 313, 6, 236, 290, [[M.claro, 0.11]], 16),
  );
}

function monteRasante(c: CapaDeAire): string {
  return rociado(c,     manchas(c, 331, 10, 430, 580, [[M.medio, 0.32], [M.claro, 0.15], [M.hondo, 0.2]], 24) +
      lenguas('mr', c, 337, 7, 400, 600, [[M.claro, 0.3], [M.medio, 0.38], [M.claro, 0.24]]),
  );
}

/** Una mata de pasto alto: hojas largas que salen de abajo de la pantalla, cada una con su caída. */
function mata(x: number, ancho: number, alto: number, rnd: () => number, cuerpo: string, luz: string): string {
  let s = '';
  const hojas = 11 + Math.floor(rnd() * 8);
  for (let i = 0; i < hojas; i++) {
    const bx = x + (rnd() - 0.5) * ancho;
    const cae = (rnd() - 0.5) * 90;
    const h = alto * (0.45 + rnd() * 0.55);
    const w = 5 + rnd() * 9;
    const base = ALTO + 30;
    const punta = { x: bx + cae, y: base - h };
    const d =
      `M${f(bx - w)} ${base} Q${f(bx - w + cae * 0.2)} ${f(base - h * 0.6)} ${f(punta.x)} ${f(punta.y)} ` +
      `Q${f(bx + w + cae * 0.45)} ${f(base - h * 0.55)} ${f(bx + w)} ${base} Z`;
    s += forma(d, cuerpo);
    // El canto que agarra la luz de atrás: un pelo claro del lado de la caída.
    if (i % 3 === 0) s += trazo(`M${f(bx + w * 0.6)} ${f(base - h * 0.2)} Q${f(bx + w + cae * 0.42)} ${f(base - h * 0.56)} ${f(punta.x)} ${f(punta.y)}`, luz, 1.6, 0.55);
  }
  return s;
}

function monteCerca(c: CapaDeAire): string {
  const rnd = azar(349);
  let matas = '';
  let tiras = '';
  let n = 0;
  for (let x = 90; x < c.ancho - 60; x += 250 + rnd() * 210) {
    const ancho = 130 + rnd() * 120;
    const alto = 150 + rnd() * 80;
    matas += vuelta(x, ancho / 2 + 60, c.ancho, (xx) => mata(xx, ancho, alto, azar(400 + n), n % 2 ? M.negro : M.oscuro, M.hondo));
    // Cada tanto, una tira de las del monte, enorme y de espaldas: es el mismo bosque, visto desde adentro.
    if (n % 3 === 1 && x + ancho * 0.7 + 170 < c.ancho) tiras += filaDeTiras(430 + rnd() * 40, ALTO + 30, M.negro, M.sombra, 600 + n, `mc-${n}`, x + ancho * 0.7, x + ancho * 0.7 + 70);
    n++;
  }
  return rociado(c, fueraDeFoco(tiras + matas) + apagon(c, M.negro));
}

/* ------------------------------------------------------------------
   Cybersiberia
   ------------------------------------------------------------------ */

function cyberVaho(c: CapaDeAire): string {
  return rociado(c, manchas(c, 511, 8, 262, 312, [[C.claro, 0.34], [C.nieve, 0.1], [C.acero, 0.4]]) + manchas(c, 517, 5, 226, 280, [[C.lente, 0.07], [C.claro, 0.16]], 18));
}

/** La ventisca: rachas largas y finas, apenas caídas, y el polvo de nieve suelto entre ellas. */
function cyberVentisca(c: CapaDeAire): string {
  const rnd = azar(523);
  let s = manchas(c, 529, 5, 380, 560, [[C.nieve, 0.12]]);
  for (let i = 0; i < 64; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 60 + rnd() * (c.alto - 100);
    const gorda = rnd() < 0.28;
    const rx = gorda ? 90 + rnd() * 130 : 30 + rnd() * 80;
    const ry = gorda ? 4 + rnd() * 5 : 1.1 + rnd() * 1.6;
    const o = gorda ? 0.2 + rnd() * 0.16 : 0.4 + rnd() * 0.4;
    s += vuelta(x, rx + 14, c.ancho, (xx) => nube(xx, y, rx, ry, C.nieve, gorda ? 's' : 'xs', o, -3.5));
  }
  for (let i = 0; i < 90; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 50 + rnd() * (c.alto - 80);
    const r = 0.8 + rnd() * 1.5;
    const o = 0.5 + rnd() * 0.4;
    s += vuelta(x, 12, c.ancho, (xx) => nube(xx, y, r * 2.4, r, C.nieve, 'xs', o, -3.5));
  }
  return rociado(c, s);
}

/** Un médano de nieve: la loma recortada con máscara, la cresta encendida y la panza en sombra. */
function medano(id: string, x: number, ancho: number, alto: number): string {
  const base = ALTO + 30;
  const d = `M${f(x - ancho / 2)} ${base} Q${f(x - ancho * 0.2)} ${f(base - alto * 1.25)} ${f(x + ancho * 0.08)} ${f(base - alto)} Q${f(x + ancho * 0.34)} ${f(base - alto * 0.72)} ${f(x + ancho / 2)} ${base} Z`;
  return enmascarado(
    id,
    d,
    forma(d, C.claro) +
      nube(x - ancho * 0.1, base - alto * 1.02, ancho * 0.3, alto * 0.22, C.nieve, 'm', 0.85) +
      nube(x + ancho * 0.16, base - alto * 0.3, ancho * 0.42, alto * 0.42, C.hondo, 'l', 0.85) +
      nube(x, base, ancho * 0.6, alto * 0.3, C.hondo, 'l', 0.9),
  );
}

function cyberCerca(c: CapaDeAire): string {
  const rnd = azar(541);
  let s = '';
  let n = 0;
  for (let x = 140; x < c.ancho - 60; x += 330 + rnd() * 240) {
    const ancho = 220 + rnd() * 160;
    const alto = 95 + rnd() * 75;
    s += vuelta(x, ancho / 2 + 40, c.ancho, (xx, k) => medano(`cc-${n}-${k}`, xx, ancho, alto));
    // Un fierro torcido que sale de la nieve, con su hielo colgando.
    if (n % 2 === 0) {
      const fx = x + ancho * 0.3;
      const alt = 120 + rnd() * 70;
      s += vuelta(fx, 80, c.ancho, (xx) =>
        trazo(`M${f(xx)} ${ALTO + 20} Q${f(xx - 8)} ${f(ALTO - alt * 0.5)} ${f(xx + 26)} ${f(ALTO - alt)} l34 -6`, C.hondo, 6.5) +
        trazo(`M${f(xx + 1)} ${f(ALTO - alt * 0.45)} Q${f(xx - 5)} ${f(ALTO - alt * 0.7)} ${f(xx + 24)} ${f(ALTO - alt - 3)}`, C.nieve, 1.6, 0.6) +
        trazo(`M${f(xx + 40)} ${f(ALTO - alt - 4)} l0 14 M${f(xx + 50)} ${f(ALTO - alt - 6)} l0 8`, C.nieve, 2, 0.7));
    }
    n++;
  }
  return rociado(c, fueraDeFoco(s) + apagon(c, C.hondo, 0.7));
}

/* ------------------------------------------------------------------
   Los astilleros
   ------------------------------------------------------------------ */

function astilleroBruma(c: CapaDeAire): string {
  return rociado(c, manchas(c, 611, 8, 262, 306, [[T.azul, 0.3], [T.clara, 0.1], [T.noche, 0.5]]) + manchas(c, 613, 4, 232, 280, [[T.sodio, 0.07], [T.clara, 0.08]], 18));
}

function astilleroVaho(c: CapaDeAire): string {
  return rociado(c,     manchas(c, 617, 9, 440, 580, [[T.azul, 0.2], [T.clara, 0.08], [T.noche, 0.3]], 26) +
      lenguas('av', c, 619, 7, 410, 600, [[T.clara, 0.24], [T.azul, 0.36], [T.clara, 0.18]]),
  );
}

/** Un noray: el hongo de fierro donde se ata el barco, con el canto encendido por el sodio. */
function noray(x: number, alto: number): string {
  const b = ALTO + 30;
  const y = b - alto;
  const d =
    `M${f(x - 30)} ${b} L${f(x - 26)} ${f(y + 34)} Q${f(x - 46)} ${f(y + 30)} ${f(x - 46)} ${f(y + 14)} Q${f(x - 44)} ${f(y)} ${f(x)} ${f(y)} ` +
    `Q${f(x + 44)} ${f(y)} ${f(x + 46)} ${f(y + 14)} Q${f(x + 46)} ${f(y + 30)} ${f(x + 26)} ${f(y + 34)} L${f(x + 30)} ${b} Z`;
  return forma(d, T.negro) + trazo(`M${f(x - 42)} ${f(y + 16)} Q${f(x - 40)} ${f(y + 4)} ${f(x - 8)} ${f(y + 3)}`, T.sodio, 2.6, 0.7) + trazo(`M${f(x - 25)} ${f(y + 40)} L${f(x - 28)} ${f(b - 30)}`, T.sodio, 2, 0.4);
}

/** Una cadena colgada entre dos puntos: eslabones, uno parado y uno acostado. */
function cadena(x0: number, y0: number, x1: number, y1: number, panza: number): string {
  let s = '';
  const pasos = Math.max(6, Math.round(Math.hypot(x1 - x0, y1 - y0) / 13));
  for (let i = 0; i <= pasos; i++) {
    const u = i / pasos;
    const x = x0 + (x1 - x0) * u;
    const y = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * panza;
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${i % 2 ? 7 : 3.4}" ry="${i % 2 ? 3.4 : 7}" fill="none" stroke="${T.negro}" stroke-width="3.4"/>`;
  }
  return s;
}

function astilleroCerca(c: CapaDeAire): string {
  const rnd = azar(631);
  let s = '';
  let n = 0;
  for (let x = 120; x < c.ancho - 80; x += 300 + rnd() * 240) {
    const alto = 110 + rnd() * 60;
    s += vuelta(x, 70, c.ancho, (xx) => noray(xx, alto));
    if (n % 2 === 0) {
      const largo = 130 + rnd() * 90;
      s += vuelta(x + largo / 2, largo / 2 + 30, c.ancho, (xx) => cadena(xx - largo / 2 + 20, ALTO + 30 - alto + 40, xx + largo / 2, ALTO + 10, 26));
    } else {
      // Un rollo de soga: vueltas apiladas.
      const rx = x + 130 + rnd() * 40;
      s += vuelta(rx, 80, c.ancho, (xx) =>
        [0, 1, 2, 3].map((k) => `<ellipse cx="${f(xx)}" cy="${f(ALTO + 8 - k * 13)}" rx="${f(52 - k * 3)}" ry="11" fill="${T.negro}" stroke="${T.noche}" stroke-width="2.4"/>`).join('') +
        trazo(`M${f(xx - 44)} ${f(ALTO - 34)} Q${f(xx - 30)} ${f(ALTO - 44)} ${f(xx - 6)} ${f(ALTO - 42)}`, T.sodio, 2, 0.5));
    }
    n++;
  }
  return rociado(c, fueraDeFoco(s) + apagon(c, T.negro));
}

/* ------------------------------------------------------------------
   El infierno
   ------------------------------------------------------------------ */

function infiernoHumo(c: CapaDeAire): string {
  return rociado(c,     manchas(c, 711, 9, 400, 590, [[I.brasa, 0.4], [I.negro, 0.34], [I.fuego, 0.08]], 26) +
      lenguas('ih', c, 719, 8, 372, 612, [[I.brasa, 0.62], [I.negro, 0.5], [I.fuego, 0.14]]),
  );
}

/**
 * La ceniza encendida: chispas que suben (la baldosa se repite también para arriba) y hollín gris
 * entre ellas. Cada una se pinta también del otro lado del borde que tenga cerca, en los dos ejes.
 */
function infiernoCeniza(c: CapaDeAire): string {
  const rnd = azar(727);
  const alto = altoDeBaldosa(c);
  const enLosDosEjes = (x: number, y: number, pinta: (x: number, y: number) => string): string => {
    let s = '';
    for (const dx of [0, x < 16 ? c.ancho : x > c.ancho - 16 ? -c.ancho : null]) {
      for (const dy of [0, y < 16 ? alto : y > alto - 16 ? -alto : null]) if (dx !== null && dy !== null) s += pinta(x + dx, y + dy);
    }
    return s;
  };
  let s = '';
  for (let i = 0; i < 84; i++) {
    const x = rnd() * c.ancho;
    const y = rnd() * alto;
    const r = 0.9 + rnd() * 1.7;
    const viva = rnd() < 0.3;
    const giro = -30 + rnd() * 60;
    const o = viva ? 1 : 0.7 + rnd() * 0.3;
    s += enLosDosEjes(x, y, (xx, yy) =>
      (viva ? nube(xx, yy, r * 3.2, r * 3.2, I.fuego, 's', 0.34) : '') +
      nube(xx, yy, r * 0.8, r * 1.5, viva ? I.chispa : I.fuego, 'xs', o, giro));
  }
  for (let i = 0; i < 60; i++) {
    const x = rnd() * c.ancho;
    const y = rnd() * alto;
    const r = 1.4 + rnd() * 2;
    const giro = rnd() * 180;
    const o = 0.35 + rnd() * 0.3;
    s += enLosDosEjes(x, y, (xx, yy) => nube(xx, yy, r * 1.3, r * 0.5, I.ceniza, 'xs', o * 0.7, giro));
  }
  return s;
}

/* ------------------------------------------------------------------
   Las piezas
   ------------------------------------------------------------------ */

/** Quién pinta cada baldosa. */
const PINTA: Readonly<Record<string, (c: CapaDeAire) => string>> = {
  'aire-monte-bruma': monteBruma,
  'aire-monte-rasante': monteRasante,
  'aire-monte-cerca': monteCerca,
  'aire-cyber-vaho': cyberVaho,
  'aire-cyber-ventisca': cyberVentisca,
  'aire-cyber-cerca': cyberCerca,
  'aire-astillero-bruma': astilleroBruma,
  'aire-astillero-vaho': astilleroVaho,
  'aire-astillero-cerca': astilleroCerca,
  'aire-infierno-humo': infiernoHumo,
  'aire-infierno-ceniza': infiernoCeniza,
};

/**
 * Las baldosas del aire, una por pieza (el monte y la pastura comparten las suyas). La niebla es
 * pura mancha y se imprime gruesa, que pesa poco; lo que tiene filo (las matas, la ceniza) va más fino.
 */
export const PIEZAS_AIRE: readonly Pieza[] = [...new Map(Object.values(AIRE).flat().map((c) => [c.pieza, c] as const)).values()].map((c) => {
  const pinta = PINTA[c.pieza];
  if (!pinta) throw new Error(`nadie pinta la baldosa "${c.pieza}" (arte-aire.ts)`);
  const region = Object.keys(AIRE).find((r) => AIRE[r]!.includes(c))!;
  return {
    nombre: c.pieza,
    caja: [0, c.y, c.ancho, c.alto] as const,
    dibujo: pinta(receta(region, c.pieza)),
    densidad: c.plano === 'cerca' ? (c.cae ? 1.5 : 1.25) : 1,
    // El grano pesa: la niebla aguanta más compresión que un títere, porque no tiene filo que cuidar.
    calidad: c.plano === 'cerca' ? 78 : 58,
    // La que se repite también para arriba (la ceniza) son motas sueltas: no hay soplo que cruce el borde.
    sangria: c.cae ? 0 : SANGRIA,
  };
});
