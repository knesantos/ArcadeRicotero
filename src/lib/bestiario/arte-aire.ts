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
import { ACECHOS, AIRE, LUCES, altoDeBaldosa, type CapaDeAire } from './aire.ts';
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
 * Un jirón de niebla (segunda ronda; antes era una *lengua* de canto liso, y varias juntas se leían
 * como escalones). El canto de abajo es duro pero **rasgado**: papel roto con la mano, no cortado
 * con regla, y va torcido, así ninguno queda a la altura del de al lado. Para arriba se pierde
 * soplado, y el espesor cambia a lo largo: dos o tres bocanadas de distinto alto.
 *
 * Se arma una vez alrededor del cero y se corre: las copias que cierran la baldosa son la misma.
 */
function jiron(id: string, largo: number, alto: number, color: string, o: number, rnd: () => number): string {
  const a = -largo / 2;
  const pasos = Math.max(6, Math.round(largo / 8));
  const caida = (rnd() - 0.5) * alto * 2.2;
  const comba = alto * (0.2 + rnd() * 0.5);
  let canto = '';
  for (let i = 0; i <= pasos; i++) {
    const u = i / pasos;
    // La línea por donde se rasgó: torcida y combada. Y el rasgado: dientes desparejos, alguno hondo.
    const linea = caida * (u - 0.5) + Math.sin(u * Math.PI) * comba;
    const diente = (i % 2 ? 1 : -0.4) * (0.7 + rnd() * 2) + (rnd() < 0.12 ? 3 + rnd() * 3 : 0);
    canto += `${i ? ' L' : 'M'}${f(a + largo * u + (rnd() - 0.5) * 3)} ${f(linea + diente)}`;
  }
  const silueta = `${canto} L${f(-a)} ${f(-alto * 6)} L${f(a)} ${f(-alto * 6)} Z`;
  // Lo que entra antes de que el soplo toque el costado de la máscara.
  const tam = largo >= 165 ? 'm' : 's';
  const margen = tam === 'm' ? 22 : 10;
  let bocanadas = '';
  const cuantas = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < cuantas; i++) {
    const rx = largo * (0.1 + rnd() * 0.07);
    const libre = Math.max(0, largo / 2 - rx - margen);
    const cx = (rnd() * 2 - 1) * libre;
    const ry = Math.max(5, alto * (0.5 + rnd() * 0.6));
    bocanadas += nube(cx, caida * (cx / largo) + ry * 0.25, rx, ry, color, tam, o * (0.5 + rnd() * 0.3));
  }
  return enmascarado(id, silueta, bocanadas);
}

/**
 * Jirones sembrados en una franja, sueltos: los de arriba (lejos) más chicos que los de abajo, cada
 * uno a su altura, y con aire entre uno y otro para que asome el piso. Ninguno llega a medir lo que
 * mide una pantalla de teléfono (320 unidades): no hay franja que la cruce entera.
 */
function jirones(prefijo: string, c: CapaDeAire, semilla: number, cuantos: number, desde: number, hasta: number, tintas: readonly (readonly [string, number])[]): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const hondura = rnd();
    const y = desde + (hasta - desde) * hondura;
    const largo = 120 + hondura * 90 + rnd() * 50;
    const alto = 9 + hondura * 11 + rnd() * 5;
    const [color, o] = tintas[i % tintas.length]!;
    // Repartidos a lo largo, pero no en fila: cada uno en su tramo, corrido a gusto.
    const x = (c.ancho / cuantos) * (i + rnd());
    const dibujo = (n: number): string => jiron(`${prefijo}-${i}-${n}`, largo, alto, color, o * (0.85 + ((i * 7) % 5) * 0.05), azar(semilla * 31 + i));
    s += vuelta(x, largo / 2 + 30, c.ancho, (xx, n) => `<g transform="translate(${f(xx)} ${f(y)})">${dibujo(n)}</g>`);
  }
  return s;
}

/** Manchas sueltas, sopladas para todos lados: la bruma. */
function manchas(c: CapaDeAire, semilla: number, cuantas: number, desde: number, hasta: number, tintas: readonly (readonly [string, number])[], gorda = 34, ancha: readonly [number, number] = [70, 150]): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantas; i++) {
    const x = (c.ancho / cuantas) * (i + rnd() * 0.9);
    const y = desde + rnd() * (hasta - desde);
    // Ninguna mide lo que una pantalla de teléfono: son manchas, no franjas.
    const rx = ancha[0] + rnd() * (ancha[1] - ancha[0]);
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
  return rociado(c,     manchas(c, 311, 15, 236, 312, [[M.medio, 0.4], [M.claro, 0.2], [M.hondo, 0.44]], 30) +
      // Unas hebras más claras, finas, que cruzan: la bruma tiene vetas.
      manchas(c, 313, 8, 214, 286, [[M.claro, 0.13]], 14, [40, 90]),
  );
}

function monteRasante(c: CapaDeAire): string {
  return rociado(c,     manchas(c, 331, 14, 400, 590, [[M.medio, 0.3], [M.claro, 0.14], [M.hondo, 0.2]], 26, [45, 105]) +
      jirones('mr', c, 337, 13, 372, 612, [[M.claro, 0.44], [M.medio, 0.5], [M.claro, 0.34]]),
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
  return rociado(c, manchas(c, 511, 14, 236, 318, [[C.claro, 0.36], [C.nieve, 0.11], [C.acero, 0.42]], 30) + manchas(c, 517, 7, 200, 280, [[C.lente, 0.08], [C.claro, 0.17]], 16, [40, 100]));
}

/** La ventisca: rachas largas y finas, apenas caídas, y el polvo de nieve suelto entre ellas. */
function cyberVentisca(c: CapaDeAire): string {
  const rnd = azar(523);
  let s = manchas(c, 529, 8, 360, 570, [[C.nieve, 0.13]], 30, [50, 120]);
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
  return rociado(c, manchas(c, 611, 14, 236, 316, [[T.azul, 0.32], [T.clara, 0.11], [T.noche, 0.5]], 30) + manchas(c, 613, 6, 206, 280, [[T.sodio, 0.08], [T.clara, 0.09]], 16, [40, 100]));
}

function astilleroVaho(c: CapaDeAire): string {
  return rociado(c,     manchas(c, 617, 13, 410, 590, [[T.azul, 0.22], [T.clara, 0.09], [T.noche, 0.3]], 26, [45, 105]) +
      jirones('av', c, 619, 12, 392, 610, [[T.clara, 0.34], [T.azul, 0.46], [T.clara, 0.26]]),
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
  return rociado(c,     manchas(c, 711, 13, 380, 590, [[I.brasa, 0.42], [I.negro, 0.34], [I.fuego, 0.09]], 26, [45, 105]) +
      jirones('ih', c, 719, 12, 372, 612, [[I.brasa, 0.62], [I.negro, 0.5], [I.fuego, 0.14]]),
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
   La luz que se ve en el aire, y los ojos sin dueño (segunda ronda)
   ------------------------------------------------------------------ */

/**
 * Un haz: el cono de un farol o de un reflector, con la boca en el cero y abierto para abajo. Es
 * aerógrafo con máscara, como los rayos de cualquier tapa: los dos cantos duros (la cartulina) y
 * adentro el soplo, más cargado contra la boca y perdiéndose hacia el piso, donde deja su charco de
 * luz. Nada de degradé: tres bocanadas, una adentro de la otra.
 */
function haz(id: string, largo: number, ancho: number, color: string, corazon: string): string {
  const silueta = `M-5 0 L5 0 L${f(ancho / 2)} ${f(largo)} L${f(-ancho / 2)} ${f(largo)} Z`;
  // La máscara: los dos cantos de cartulina, duros, y el pie soplado (lo último del haz no llega al
  // piso con canto: se deshace). Blanco deja pasar, negro tapa.
  const mascara =
    `<mask id="${id}"><path d="${silueta}" fill="white"/>` +
    `<ellipse cx="0" cy="${f(largo * 1.04)}" rx="${f(ancho * 0.8)}" ry="${f(largo * 0.2)}" fill="black" filter="url(#soplo-xl)"/></mask>`;
  return (
    mascara +
    `<g mask="url(#${id})">` +
    forma(silueta, color, 0.2) +
    nube(0, largo * 0.2, ancho * 0.14, largo * 0.26, color, 'l', 0.5) +
    nube(0, largo * 0.5, ancho * 0.26, largo * 0.34, color, 'xl', 0.34) +
    nube(0, largo * 0.06, ancho * 0.05, largo * 0.08, corazon, 'm', 0.7) +
    `</g>` +
    // El charco de luz, donde el haz toca el piso.
    nube(0, largo * 0.8, ancho * 0.34, Math.max(18, largo * 0.05), color, 'xl', 0.4)
  );
}

/** La brasa: una mancha ancha y baja, tres bocanadas una adentro de la otra. */
const brasa = (): string => nube(0, 0, 170, 26, I.brasa, 'xl', 0.9) + nube(0, 4, 100, 20, I.fuego, 'xl', 0.5) + nube(0, 6, 44, 9, I.chispa, 'l', 0.4);

const QUIEN_ALUMBRA: Readonly<Record<string, () => string>> = {
  'luz-astillero-cono': () => haz('lz-a', 340, 300, T.sodio, 'var(--entorno-mesa-papel)'),
  'luz-infierno-brasa': brasa,
  'luz-cyber-haz': () => haz('lz-c', 560, 330, C.lente, C.nieve),
};

/** Un ojo de almendra: la silueta dura, el iris soplado adentro y la pupila. `giro`, lo torcido. */
function almendra(id: string, x: number, y: number, color: string, hondo: string, pupila: 'raya' | 'punto', giro = 0): string {
  const d = `M${f(x - 9)} ${f(y)} Q${f(x)} ${f(y - 6.8)} ${f(x + 9)} ${f(y)} Q${f(x)} ${f(y + 5)} ${f(x - 9)} ${f(y)} Z`;
  const ojo = enmascarado(id, d, forma(d, color) + nube(x, y - 5.5, 9, 3.2, hondo, 'xs', 0.8)) +
    (pupila === 'raya' ? `<ellipse cx="${f(x)}" cy="${f(y - 0.4)}" rx="1.3" ry="3.8" fill="var(--fondo)"/>` : `<circle cx="${f(x)}" cy="${f(y - 0.4)}" r="2.3" fill="var(--fondo)"/>`);
  return giro ? `<g transform="rotate(${giro} ${f(x)} ${f(y)})">${ojo}</g>` : ojo;
}

const QUIEN_MIRA: Readonly<Record<string, () => string>> = {
  // El monte: ojos de bicho, de almendra, con la pupila en raya.
  'acecho-monte': () => almendra('ac-m1', 11, 10, 'var(--acento-2)', M.sombra, 'raya') + almendra('ac-m2', 35, 10, 'var(--acento-2)', M.sombra, 'raya'),
  // Cybersiberia: no es un bicho, es una cámara. Dos lentes con su aro y el piloto rojo en el medio.
  'acecho-cyber': () =>
    [11, 35].map((x) => `<circle cx="${x}" cy="10" r="5.6" fill="${C.hondo}"/><circle cx="${x}" cy="10" r="4" fill="${C.lente}"/><circle cx="${x}" cy="10" r="1.6" fill="var(--fondo)"/><circle cx="${x - 1.4}" cy="8.4" r="0.9" fill="${C.nieve}"/>`).join('') +
    `<circle cx="23" cy="10" r="1.5" fill="var(--marca-rojo)"/>`,
  // Los astilleros: algo que mira desde el agua. Los ojos redondos, y abajo, cortado por las ondas, su reflejo.
  'acecho-astillero': () =>
    [12, 34].map((x) => `<circle cx="${x}" cy="8" r="4.6" fill="${T.clara}"/><circle cx="${x + 0.6}" cy="8.4" r="1.9" fill="var(--fondo)"/>`).join('') +
    [12, 34].map((x) => `<ellipse cx="${x}" cy="20" rx="4.2" ry="1.3" fill="${T.clara}" opacity="0.5"/><ellipse cx="${x + 1.2}" cy="24" rx="3" ry="0.9" fill="${T.clara}" opacity="0.3"/>`).join(''),
  // El infierno: los ojos torcidos para adentro, de brasa.
  'acecho-infierno': () => almendra('ac-i1', 11, 10, I.fuego, I.brasa, 'raya', 16) + almendra('ac-i2', 35, 10, I.fuego, I.brasa, 'raya', -16),
};

/**
 * Las piezas de las luces y de los ojos sin dueño. Las luces llevan el rociado, con su hoja entera
 * para que el filtro del grano no las corte; los ojos son chicos y de filo: se imprimen finos.
 */
export const PIEZAS_DE_LUZ: readonly Pieza[] = [
  ...[...new Map(Object.values(LUCES).flat().map((l) => [l.pieza, l] as const)).values()].map((l) => {
    const pinta = QUIEN_ALUMBRA[l.pieza];
    if (!pinta) throw new Error(`nadie pinta la luz "${l.pieza}" (arte-aire.ts)`);
    const [x, y, ancho, alto] = l.caja;
    return {
      nombre: l.pieza,
      caja: l.caja,
      dibujo: `<g filter="url(#rociado)"><rect x="${x}" y="${y}" width="${ancho}" height="${alto}" fill="var(--fondo)" fill-opacity="0"/>${pinta()}</g>`,
      densidad: 1,
      calidad: 60,
    };
  }),
  ...[...new Map(Object.values(ACECHOS).map((a) => [a.pieza, a] as const)).values()].map((a) => {
    const pinta = QUIEN_MIRA[a.pieza];
    if (!pinta) throw new Error(`nadie pinta los ojos "${a.pieza}" (arte-aire.ts)`);
    return { nombre: a.pieza, caja: [0, 0, a.ancho, a.alto] as const, dibujo: `<g filter="url(#grano)">${pinta()}</g>`, densidad: 5 };
  }),
];

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
