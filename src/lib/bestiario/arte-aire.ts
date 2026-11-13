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
import { ACECHOS, AIRE, LUCES, VIDAS, altoDeBaldosa, type CapaDeAire } from './aire.ts';
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
      jirones('mr', c, 337, 13, 372, 612, [[M.medio, 0.4], [M.claro, 0.26], [M.medio, 0.34]]),
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
    const ancho = 110 + rnd() * 90;
    const alto = 96 + rnd() * 50;
    matas += vuelta(x, ancho / 2 + 60, c.ancho, (xx) => mata(xx, ancho, alto, azar(400 + n), n % 2 ? M.negro : M.oscuro, M.hondo));
    // Cada tanto, una tira de las del monte, enorme y de espaldas: es el mismo bosque, visto desde adentro.
    if (n % 3 === 1 && x + ancho * 0.7 + 170 < c.ancho) tiras += filaDeTiras(470 + rnd() * 40, ALTO + 30, M.negro, M.sombra, 600 + n, `mc-${n}`, x + ancho * 0.7, x + ancho * 0.7 + 30);
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

/**
 * La nevisca (sexta ronda): la nevada y la ventisca en una sola baldosa, que cae al sesgo. Copos
 * redondos de varios tamaños (los grandes, más cerca y más flojos), y entre ellos rachas cortas
 * acostadas para el lado que sopla. Cierra para los dos lados.
 */
function cyberNevisca(c: CapaDeAire): string {
  const rnd = azar(523);
  const alto = altoDeBaldosa(c);
  // Para dónde va: la misma pendiente con la que la mueve la isla (`deriva` y `cae`).
  const sesgo = (Math.atan2(c.cae, c.deriva) * 180) / Math.PI;
  const copia = (x: number, y: number, margen: number, pinta: (x: number, y: number) => string): string => {
    let s = '';
    for (const dx of [0, x < margen ? c.ancho : x > c.ancho - margen ? -c.ancho : null]) {
      for (const dy of [0, y < margen ? alto : y > alto - margen ? -alto : null]) if (dx !== null && dy !== null) s += pinta(x + dx, y + dy);
    }
    return s;
  };
  let s = '';
  for (let i = 0; i < 116; i++) {
    const x = rnd() * c.ancho;
    const y = rnd() * alto;
    const grande = rnd() < 0.12;
    const r = grande ? 2.6 + rnd() * 2.4 : 0.8 + rnd() * 1.4;
    const o = grande ? 0.28 + rnd() * 0.2 : 0.55 + rnd() * 0.4;
    s += copia(x, y, 14, (xx, yy) => nube(xx, yy, r, r, C.nieve, grande ? 's' : 'xs', o));
  }
  for (let i = 0; i < 32; i++) {
    const x = rnd() * c.ancho;
    const y = rnd() * alto;
    const rx = 18 + rnd() * 46;
    const ry = 1 + rnd() * 1.4;
    const o = 0.3 + rnd() * 0.35;
    s += copia(x, y, rx + 12, (xx, yy) => nube(xx, yy, rx, ry, C.nieve, 'xs', o, sesgo));
  }
  return `<g filter="url(#rociado)"><rect x="-20" y="-20" width="${c.ancho + 40}" height="${alto + 40}" fill="var(--fondo)" fill-opacity="0"/>${s}</g>`;
}

/** Rachas y motas que lleva el viento, en una tinta: la nieve de Cybersiberia, el polvo de la ruta. */
function rachas(c: CapaDeAire, semilla: number, color: string, largas: number, motas: number, giro: number, fondo: string): string {
  const rnd = azar(semilla);
  let s = fondo;
  for (let i = 0; i < largas; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 60 + rnd() * (c.alto - 100);
    const gorda = rnd() < 0.28;
    const rx = gorda ? 90 + rnd() * 130 : 30 + rnd() * 80;
    const ry = gorda ? 4 + rnd() * 5 : 1.1 + rnd() * 1.6;
    const o = gorda ? 0.2 + rnd() * 0.16 : 0.4 + rnd() * 0.4;
    s += vuelta(x, rx + 14, c.ancho, (xx) => nube(xx, y, rx, ry, color, gorda ? 's' : 'xs', o, giro));
  }
  for (let i = 0; i < motas; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 50 + rnd() * (c.alto - 80);
    const r = 0.8 + rnd() * 1.5;
    const o = 0.5 + rnd() * 0.4;
    s += vuelta(x, 12, c.ancho, (xx) => nube(xx, y, r * 2.4, r, color, 'xs', o, giro));
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
    const ancho = 170 + rnd() * 90;
    const alto = 80 + rnd() * 55;
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
    const alto = 84 + rnd() * 38;
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
   La ruta, el bajo, los techos y la prisión (tercera ronda)
   ------------------------------------------------------------------
   La ruta es aerógrafo, como las cuatro de arriba. Los otros tres son recintos que visten la mano
   de su disco, y el aire la respeta: en el bajo y en los techos es **crayón** (rayas cortas, de
   pulso, con el borde corrido de la fotocopia), y en la prisión, **gubia** (rayas rectas de filo
   duro, blanco sobre negro). Ahí no hay soplo ni grano: sería otra mano.
*/

const RU = { noche: 'var(--entorno-astillero-noche)', negro: 'var(--fondo)', papel: 'var(--papel)', tenue: 'var(--papel-tenue)', topo: 'var(--disco-luzbelito-apoyo)', polvo: 'var(--entorno-monte-claro)', faro: 'var(--entorno-templo-foco)' };
const J = { agua: 'var(--entorno-bajo-agua)', celeste: 'var(--entorno-bajo-celeste)', llama: 'var(--entorno-bajo-llama)', clara: 'var(--entorno-bajo-llama-clara)', luz: 'var(--entorno-baion-luz)', negro: 'var(--fondo)' };
const B = { noche: 'var(--entorno-baion-noche)', violeta: 'var(--entorno-baion-violeta)', lila: 'var(--entorno-baion-lila)', luz: 'var(--entorno-baion-luz)', azul: 'var(--entorno-baion-azul)', rosa: 'var(--entorno-baion-rosa)', negro: 'var(--fondo)' };
const P = { papel: 'var(--bestia-dracula-papel)', negro: 'var(--fondo)', rojo: 'var(--disco-oktubre-tinta)' };

/** La mano del crayón: el borde corrido de la fotocopia. La de la gubia: el filo de la madera. */
const crayon = (c: CapaDeAire, adentro: string): string => `<g filter="url(#xerox-fino)">${hoja(c)}${adentro}</g>`;
const gubia = (c: CapaDeAire, adentro: string): string => `<g filter="url(#gubia)">${hoja(c)}${adentro}</g>`;

/**
 * Tandas de rayas cortas, casi paralelas: el rayado de crayón de *Un baión* y el de gubia de
 * *Oktubre*. Cada tanda es un manchón de rayas, con aire alrededor; `giro` es para dónde van.
 */
function rayado(
  c: CapaDeAire, semilla: number, tandas: number, desde: number, hasta: number, tintas: readonly (readonly [string, number])[],
  m: { largo: readonly [number, number]; grosor: readonly [number, number]; giro: number; porTanda: readonly [number, number]; abre: readonly [number, number] },
): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < tandas; i++) {
    const x = (c.ancho / tandas) * (i + rnd());
    const y = desde + rnd() * (hasta - desde);
    const [color, o] = tintas[i % tintas.length]!;
    const cuantas = Math.round(m.porTanda[0] + rnd() * (m.porTanda[1] - m.porTanda[0]));
    let tanda = '';
    for (let j = 0; j < cuantas; j++) {
      const largo = m.largo[0] + rnd() * (m.largo[1] - m.largo[0]);
      const a = ((m.giro + (rnd() - 0.5) * 10) * Math.PI) / 180;
      const px = (rnd() - 0.5) * 2 * m.abre[0];
      const py = (rnd() - 0.5) * 2 * m.abre[1];
      tanda += trazo(`M${f(px)} ${f(py)} l${f(Math.cos(a) * largo)} ${f(Math.sin(a) * largo)}`, color, m.grosor[0] + rnd() * (m.grosor[1] - m.grosor[0]), o * (0.6 + rnd() * 0.4));
    }
    s += vuelta(x, m.abre[0] + m.largo[1], c.ancho, (xx) => `<g transform="translate(${f(xx)} ${f(y)})">${tanda}</g>`);
  }
  return s;
}

/* ---- La ruta ---- */

function rutaBruma(c: CapaDeAire): string {
  return rociado(c, manchas(c, 811, 13, 250, 326, [[RU.noche, 0.5], [RU.tenue, 0.1], [RU.topo, 0.24]], 28) + manchas(c, 813, 6, 220, 290, [[RU.tenue, 0.07]], 14, [40, 100]));
}

/** El polvo que levantan los fierros: motas y rachas cortas, tibias, que se van para donde va el tránsito. */
function rutaPolvo(c: CapaDeAire): string {
  return rociado(c, rachas(c, 821, RU.polvo, 34, 120, 2.5, manchas(c, 823, 9, 400, 580, [[RU.polvo, 0.1], [RU.topo, 0.14]], 26, [50, 120])));
}

function rutaCerca(c: CapaDeAire): string {
  const rnd = azar(829);
  let s = '';
  let n = 0;
  for (let x = 100; x < c.ancho - 60; x += 240 + rnd() * 220) {
    const ancho = 90 + rnd() * 80;
    const alto = 90 + rnd() * 60;
    s += vuelta(x, ancho / 2 + 60, c.ancho, (xx) => mata(xx, ancho, alto, azar(840 + n), n % 2 ? RU.negro : RU.topo, RU.tenue));
    // Cada tanto, un mojón de la ruta, torcido.
    if (n % 3 === 2) {
      const mx = x + ancho;
      s += vuelta(mx, 40, c.ancho, (xx) =>
        `<g transform="rotate(-7 ${f(xx)} ${ALTO})">` + forma(`M${f(xx - 13)} ${ALTO + 30} L${f(xx - 13)} ${ALTO - 70} Q${f(xx)} ${ALTO - 88} ${f(xx + 13)} ${ALTO - 70} L${f(xx + 13)} ${ALTO + 30} Z`, RU.topo) +
        forma(`M${f(xx - 13)} ${ALTO - 56} L${f(xx + 13)} ${ALTO - 56} L${f(xx + 13)} ${ALTO - 46} L${f(xx - 13)} ${ALTO - 46} Z`, 'var(--marca-rojo)', 0.8) + `</g>`);
    }
    n++;
  }
  return rociado(c, fueraDeFoco(s) + apagon(c, RU.negro));
}

/* ---- El bajo ---- */

/** El vaho del agua, a crayón: manchones de rayas acostadas, y cada tanto unas que suben torcidas. */
function bajoVaho(c: CapaDeAire): string {
  return crayon(
    c,
    rayado(c, 911, 16, 470, 616, [[J.celeste, 0.5], [J.luz, 0.3], [J.celeste, 0.36]], { largo: [22, 70], grosor: [1.6, 3.4], giro: 0, porTanda: [5, 11], abre: [70, 12] }) +
      rayado(c, 913, 9, 430, 520, [[J.luz, 0.3], [J.celeste, 0.3]], { largo: [10, 24], grosor: [1.4, 2.4], giro: -78, porTanda: [3, 6], abre: [26, 16] }),
  );
}

/** Los juncos de la orilla: cañas finas con su penacho, de espaldas a la luz. */
function bajoCerca(c: CapaDeAire): string {
  const rnd = azar(919);
  let s = '';
  let n = 0;
  for (let x = 90; x < c.ancho - 60; x += 250 + rnd() * 230) {
    const cuantos = 4 + Math.floor(rnd() * 4);
    let mata_ = '';
    for (let i = 0; i < cuantos; i++) {
      const bx = (rnd() - 0.5) * 90;
      const alto = 80 + rnd() * 70;
      const cae = (rnd() - 0.5) * 40;
      const d = `M${f(bx)} ${ALTO + 30} Q${f(bx + cae * 0.2)} ${f(ALTO - alto * 0.5)} ${f(bx + cae)} ${f(ALTO - alto)}`;
      mata_ += trazo(d, J.negro, 4.5) + `<ellipse cx="${f(bx + cae)}" cy="${f(ALTO - alto - 9)}" rx="4.6" ry="13" fill="${J.negro}" transform="rotate(${f(cae * 0.4)} ${f(bx + cae)} ${f(ALTO - alto)})"/>` +
        (i % 2 ? `<g transform="translate(-1.6 0)">${trazo(d, J.celeste, 1.2, 0.6)}</g>` : '');
    }
    s += vuelta(x, 110, c.ancho, (xx) => `<g transform="translate(${f(xx)} 0)">${mata_}</g>`);
    n++;
  }
  return `<g>${hoja(c)}${fueraDeFoco(s)}${apagon(c, J.negro)}</g>`;
}

/* ---- Los techos ---- */

/**
 * El humo de las chimeneas (cuarta ronda; antes era hollín, que se perdía en el rayado del cielo).
 * Cada penacho sube torcido y se abre: tandas de rayas de pastel, claras, cada vez más sueltas y más
 * flojas. Claro sobre el cielo oscuro, para que se lea.
 */
function techosHumo(c: CapaDeAire): string {
  const rnd = azar(1011);
  let s = '';
  for (let i = 0; i < 4; i++) {
    const x = (c.ancho / 4) * (i + 0.2 + rnd() * 0.6);
    const pie = 330 + rnd() * 50;
    const tuerce = 18 + rnd() * 22;
    let penacho = '';
    for (let k = 0; k < 9; k++) {
      const abre = 8 + k * 7;
      const cuantas = 5 + k;
      const color = k % 3 === 0 ? B.luz : B.lila;
      for (let j = 0; j < cuantas; j++) {
        const px = -k * tuerce * (0.6 + k * 0.06) + (rnd() - 0.5) * 2 * abre;
        const py = -k * 30 + (rnd() - 0.5) * 22;
        const largo = 7 + rnd() * 9 + k;
        const a = ((-64 + (rnd() - 0.5) * 50 - k * 3) * Math.PI) / 180;
        penacho += trazo(`M${f(px)} ${f(py)} l${f(Math.cos(a) * largo)} ${f(Math.sin(a) * largo)}`, color, 2.2 + rnd() * 1.6, (0.62 - k * 0.055) * (0.7 + rnd() * 0.3));
      }
    }
    s += vuelta(x, 330, c.ancho, (xx) => `<g transform="translate(${f(xx)} ${f(pie)})">${penacho}</g>`);
  }
  return crayon(c, s);
}

/** Una prenda colgada de la soga, lejos: remera, sábana, media o calzón. Claras, que les pega el farol. */
function prenda(cual: number, x: number, y: number, k: number): string {
  const formas = [
    // La remera.
    `M${f(x - 20 * k)} ${f(y)} L${f(x - 34 * k)} ${f(y + 16 * k)} L${f(x - 24 * k)} ${f(y + 24 * k)} L${f(x - 17 * k)} ${f(y + 16 * k)} L${f(x - 16 * k)} ${f(y + 56 * k)} L${f(x + 16 * k)} ${f(y + 58 * k)} L${f(x + 17 * k)} ${f(y + 16 * k)} L${f(x + 24 * k)} ${f(y + 24 * k)} L${f(x + 34 * k)} ${f(y + 16 * k)} L${f(x + 20 * k)} ${f(y)} Q${f(x)} ${f(y + 9 * k)} ${f(x - 20 * k)} ${f(y)} Z`,
    // La sábana, con la punta que se vuela.
    `M${f(x - 30 * k)} ${f(y)} L${f(x + 30 * k)} ${f(y)} L${f(x + 34 * k)} ${f(y + 62 * k)} Q${f(x + 10 * k)} ${f(y + 54 * k)} ${f(x - 8 * k)} ${f(y + 64 * k)} L${f(x - 28 * k)} ${f(y + 58 * k)} Z`,
    // La media.
    `M${f(x - 6 * k)} ${f(y)} L${f(x + 6 * k)} ${f(y)} L${f(x + 6 * k)} ${f(y + 30 * k)} Q${f(x + 20 * k)} ${f(y + 36 * k)} ${f(x + 18 * k)} ${f(y + 44 * k)} L${f(x - 4 * k)} ${f(y + 44 * k)} Q${f(x - 8 * k)} ${f(y + 36 * k)} ${f(x - 6 * k)} ${f(y + 30 * k)} Z`,
    // El calzón.
    `M${f(x - 20 * k)} ${f(y)} L${f(x + 20 * k)} ${f(y)} L${f(x + 22 * k)} ${f(y + 24 * k)} L${f(x + 6 * k)} ${f(y + 26 * k)} L${f(x)} ${f(y + 14 * k)} L${f(x - 6 * k)} ${f(y + 26 * k)} L${f(x - 22 * k)} ${f(y + 24 * k)} Z`,
  ];
  const d = formas[cual % formas.length]!;
  const color = [B.lila, B.luz, B.rosa, B.lila][cual % 4]!;
  return forma(d, color, 0.9) + trazo(`M${f(x - 12 * k)} ${f(y + 10 * k)} l${f(3 * k)} ${f(30 * k)}`, B.violeta, 1.2, 0.6);
}

/**
 * La ropa tendida (cuarta ronda): cruza **arriba y lejos**, de antena a antena, por encima de las
 * medianeras. Antes iba pegada a la cámara, abajo, y casi no se veía. La soga combada, lo que
 * cuelga, y entre tendido y tendido, cielo.
 */
function techosRopa(c: CapaDeAire): string {
  const rnd = azar(1019);
  let s = '';
  let n = 0;
  for (let x = 120; x < c.ancho - 400; x += 480 + rnd() * 160) {
    const largo = 250 + rnd() * 110;
    const y0 = c.y + 36 + rnd() * 40;
    const comba = 12 + rnd() * 8;
    const soga = (u: number): number => y0 + Math.sin(u * Math.PI) * comba;
    let tendido = trazo(`M${f(x)} ${f(y0)} Q${f(x + largo / 2)} ${f(y0 + comba * 2)} ${f(x + largo)} ${f(y0)}`, B.luz, 1.3, 0.75);
    // Los dos palos: antenas flacas que bajan hasta los techos.
    for (const px of [x, x + largo]) tendido += trazo(`M${f(px)} ${f(y0 - 14)} L${f(px)} ${f(c.y + c.alto + 10)}`, B.negro, 2.6) + trazo(`M${f(px - 9)} ${f(y0 - 6)} L${f(px + 9)} ${f(y0 - 6)}`, B.negro, 2);
    const cuantas = 4 + Math.floor(rnd() * 3);
    for (let i = 0; i < cuantas; i++) {
      const u = (i + 0.5 + rnd() * 0.3) / (cuantas + 0.3);
      tendido += prenda(n * 3 + i, x + largo * u, soga(u), 0.4 + rnd() * 0.14);
    }
    s += tendido;
    n++;
  }
  return crayon(c, s);
}

/* ---- La prisión ---- */

/** El frío de la celda: rayado de gubia, blanco, a ras del piso. Tandas flacas, con aire entre una y otra. */
function prisionFrio(c: CapaDeAire): string {
  return gubia(
    c,
    // El filtro de la gubia deja el filo duro: lo que no llega a un tercio de tinta, desaparece. Las rayas
    // van llenas, y lo flojo lo pone el alfa de la capa (`aire.ts`).
    rayado(c, 1111, 15, 400, 612, [[P.papel, 2]], { largo: [26, 84], grosor: [1, 1.9], giro: 0, porTanda: [4, 9], abre: [60, 10] }) +
      rayado(c, 1113, 7, 360, 470, [[P.papel, 2]], { largo: [8, 18], grosor: [1, 1.5], giro: -84, porTanda: [3, 5], abre: [18, 12] }),
  );
}

/**
 * Los barrotes de la celda de enfrente (cuarta ronda): se mira desde adentro, por una reja a la que
 * le limaron el medio. Arriba cuelgan los cabos y abajo quedan los tocones, cada uno cortado a su
 * altura y al sesgo; el travesaño de arriba y el de abajo los unen. **El medio queda libre**: antes los
 * barrotes iban enteros y uno pasaba justo por la cara de la drácula.
 */
function prisionRejas(c: CapaDeAire): string {
  const rnd = azar(1117);
  let s = '';
  // Los dos travesaños, de punta a punta: finos, con el filo blanco arriba.
  for (const y of [34, 606]) s += forma(`M-140 ${y} L${c.ancho + 140} ${y} L${c.ancho + 140} ${y + 9} L-140 ${y + 9} Z`, P.negro) + trazo(`M-140 ${y + 1.2} L${c.ancho + 140} ${y + 1.2}`, P.papel, 1.2);
  for (let x = 70; x < c.ancho - 40; x += 120 + rnd() * 90) {
    const w = 10 + rnd() * 4;
    // El cabo de arriba: baja hasta donde lo limaron, con el corte al sesgo.
    const yt = 70 + rnd() * 54;
    s += forma(`M${f(x)} -20 L${f(x + w)} -20 L${f(x + w)} ${f(yt)} L${f(x)} ${f(yt + 9)} Z`, P.negro) + trazo(`M${f(x + 1.2)} -20 L${f(x + 1.2)} ${f(yt + 7)}`, P.papel, 1.3);
    // El tocón de abajo.
    const yb = 548 + rnd() * 40;
    s += forma(`M${f(x)} ${f(yb + 8)} L${f(x + w)} ${f(yb)} L${f(x + w)} ${ALTO + 20} L${f(x)} ${ALTO + 20} Z`, P.negro) + trazo(`M${f(x + 1.2)} ${f(yb + 9)} L${f(x + 1.2)} ${ALTO + 20}`, P.papel, 1.3);
  }
  return gubia(c, s);
}

/* ------------------------------------------------------------------
   La mesa, el templo, el árbol y el galpón (quinta ronda)
   ------------------------------------------------------------------ */

const ME = { papel: 'var(--entorno-mesa-papel)', sepia: 'var(--entorno-mesa-sepia-clara)', honda: 'var(--entorno-mesa-sepia-honda)' };
const TE = { foco: 'var(--entorno-templo-foco)', papel: 'var(--entorno-mesa-papel)', negro: 'var(--fondo)' };
const AR = { claro: 'var(--entorno-arbol-marmol-claro)', marmol: 'var(--entorno-arbol-marmol)', cobre: 'var(--entorno-arbol-cobre)', veta: 'var(--entorno-arbol-veta)', tierra: 'var(--entorno-arbol-tierra-viva)' };
const GA = { luz: 'var(--entorno-galpon-luz)', rojo: 'var(--entorno-galpon-rojo)', brasa: 'var(--entorno-galpon-brasa)' };

/** Lo que se repite para los dos lados (lo que sube o cae): cada cosa se pinta también del otro lado de los bordes que tenga cerca. */
function enLosDosEjes(c: CapaDeAire, x: number, y: number, margen: number, pinta: (x: number, y: number) => string): string {
  const alto = altoDeBaldosa(c);
  let s = '';
  for (const dx of [0, x < margen ? c.ancho : x > c.ancho - margen ? -c.ancho : null]) {
    for (const dy of [0, y < margen ? alto : y > alto - margen ? -alto : null]) if (dx !== null && dy !== null) s += pinta(x + dx, y + dy);
  }
  return s;
}

/**
 * Volutas: hebras de humo que suben torcidas, cada una una ese larga que se afina. `mano`: sopladas
 * (el incienso del templo) o de tinta plana con el borde apenas corrido (el humo de la mesa, que es
 * un afiche).
 */
function volutas(c: CapaDeAire, semilla: number, cuantas: number, tintas: readonly (readonly [string, number])[], mano: 'soplada' | 'plana'): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantas; i++) {
    const x = rnd() * c.ancho;
    const y = rnd() * c.alto;
    const largo = 70 + rnd() * 70;
    const onda = 9 + rnd() * 12;
    const lado = rnd() < 0.5 ? -1 : 1;
    const [color, o] = tintas[i % tintas.length]!;
    const grosor = 2 + rnd() * 2.6;
    const d = (xx: number, yy: number): string =>
      `M${f(xx)} ${f(yy)} c${f(lado * onda)} ${f(-largo * 0.18)} ${f(lado * onda)} ${f(-largo * 0.34)} 0 ${f(-largo * 0.5)} s${f(-lado * onda * 0.9)} ${f(-largo * 0.32)} ${f(lado * onda * 0.3)} ${f(-largo * 0.5)}`;
    s += enLosDosEjes(c, x, y, largo + 20, (xx, yy) =>
      mano === 'soplada'
        ? `<g filter="url(#soplo-s)">${trazo(d(xx, yy), color, grosor * 1.8, o)}</g>`
        : trazo(d(xx, yy), color, grosor, o) + trazo(d(xx + 3, yy - 6), color, grosor * 0.5, o * 0.6),
    );
  }
  return s;
}

/** El humo de la mesa: volutas de tinta plana, del papel del afiche, con el grano encima. */
function mesaHumo(c: CapaDeAire): string {
  return `<g filter="url(#grano)">${volutas(c, 1211, 13, [[ME.papel, 0.5], [ME.sepia, 0.42], [ME.papel, 0.34]], 'plana')}</g>`;
}

/** El incienso del templo: hebras sopladas, tibias, del color de los focos. */
function temploIncienso(c: CapaDeAire): string {
  return `<g filter="url(#rociado)">${volutas(c, 1311, 15, [[TE.foco, 0.3], [TE.papel, 0.24], [TE.foco, 0.2]], 'soplada')}</g>`;
}

/**
 * El humo que baja (séptima ronda): el de las velas y el incienso que ya subió, se enfrió y vuelve.
 * Las mismas hebras, más pocas y más flojas; la isla las hace caer despacio hasta el piso.
 */
function temploHumoQueBaja(c: CapaDeAire): string {
  // Las volutas se pintan desde arriba de la baldosa: se las corre a donde empieza esta capa.
  return `<g filter="url(#rociado)"><g transform="translate(0 ${c.y})">${volutas({ ...c, y: 0 }, 1341, 12, [[TE.papel, 0.42], [TE.foco, 0.34]], 'soplada')}</g></g>`;
}

/** Una hoja: una almendra con su nervio, girada a gusto. */
function hoja_(x: number, y: number, largo: number, giro: number, color: string, o: number): string {
  const d = `M${f(-largo / 2)} 0 Q0 ${f(-largo * 0.34)} ${f(largo / 2)} 0 Q0 ${f(largo * 0.3)} ${f(-largo / 2)} 0 Z`;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(giro)})"${o < 1 ? ` opacity="${f(o)}"` : ''}>${forma(d, color)}${trazo(`M${f(-largo * 0.4)} 0 L${f(largo * 0.4)} 0`, AR.veta, 0.7, 0.5)}</g>`;
}

/** Las hojas que se le caen al árbol: pocas, sueltas, cada una girada a su modo. La baldosa cierra para los dos lados. */
function arbolHojas(c: CapaDeAire): string {
  const rnd = azar(1411);
  let s = '';
  for (let i = 0; i < 34; i++) {
    const x = rnd() * c.ancho;
    const y = rnd() * c.alto;
    const largo = 7 + rnd() * 9;
    const giro = rnd() * 360;
    const color = [AR.claro, AR.cobre, AR.marmol, AR.cobre][i % 4]!;
    const o = 0.7 + rnd() * 0.3;
    s += enLosDosEjes(c, x, y, 18, (xx, yy) => hoja_(xx, yy, largo, giro, color, o));
  }
  return `<g filter="url(#grano)">${s}</g>`;
}

/** La racha en la copa: hojas que pasan de costado, y las rayas del viento que las lleva. */
function arbolRacha(c: CapaDeAire): string {
  const rnd = azar(1419);
  let s = '';
  for (let i = 0; i < 26; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 50 + rnd() * (c.alto - 100);
    const rx = 40 + rnd() * 90;
    const o = 0.3 + rnd() * 0.3;
    const ry = 1.4 + rnd() * 1.2;
    s += vuelta(x, rx + 14, c.ancho, (xx) => nube(xx, y, rx, ry, AR.veta, 'xs', o, -4));
  }
  for (let i = 0; i < 30; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 40 + rnd() * (c.alto - 80);
    const largo = 6 + rnd() * 8;
    const giro = -20 + rnd() * 40;
    const color = i % 3 ? AR.claro : AR.cobre;
    s += vuelta(x, 20, c.ancho, (xx) => hoja_(xx, y, largo, giro, color, 0.85));
  }
  return rociado(c, s);
}

/** Una vela de las ofrendas: el cabo, la cera chorreada, la llama y la mancha de luz que deja en el piso. */
function vela(x: number, y: number, alto: number, rnd: () => number): string {
  const w = 5 + rnd() * 4;
  const cabo = `M${f(x - w)} ${f(y)} L${f(x - w * 0.9)} ${f(y - alto)} Q${f(x)} ${f(y - alto - 3)} ${f(x + w * 0.9)} ${f(y - alto)} L${f(x + w)} ${f(y)} Z`;
  const llama = `M${f(x)} ${f(y - alto - 2)} Q${f(x - 4.4)} ${f(y - alto - 9)} ${f(x + (rnd() - 0.5) * 3)} ${f(y - alto - 19)} Q${f(x + 4.4)} ${f(y - alto - 9)} ${f(x)} ${f(y - alto - 2)} Z`;
  return (
    // La luz en el piso y el charco de cera.
    nube(x, y + 2, 34, 8, TE.foco, 'l', 0.32) +
    nube(x, y + 1.5, w * 2.2, 3.2, TE.papel, 's', 0.75) +
    enmascarado(`ve-${Math.round(x)}-${Math.round(alto)}`, cabo, forma(cabo, TE.papel) + nube(x + w * 0.7, y - alto * 0.4, w * 0.9, alto * 0.7, TE.negro, 's', 0.6) + nube(x - w * 0.4, y - alto, w, 5, TE.foco, 's', 0.6)) +
    // La cera que chorrea por un lado.
    trazo(`M${f(x - w * 0.5)} ${f(y - alto + 1)} q-1.5 ${f(alto * 0.3)} 0 ${f(alto * 0.5)}`, TE.papel, 2.2) +
    nube(x, y - alto - 9, 9, 11, TE.foco, 'm', 0.5) +
    forma(llama, TE.foco) +
    `<ellipse cx="${f(x)}" cy="${f(y - alto - 7)}" rx="1.5" ry="3.6" fill="${TE.papel}"/>`
  );
}

/**
 * Las ofrendas del templo (sexta ronda): entre el medallón y el papel picado había una franja negra.
 * Ahí va lo que la gente le deja a Momo: velas de distinto alto, alguna caída, un platito, una
 * botella, flores, y el humo que **baja** y se queda a ras del piso. Tandas con aire entre una y otra.
 */
/**
 * Dónde van las ofrendas, a lo largo del templo entero (1940). No es una baldosa que se repite: en la
 * séptima ronda se vio que, repetida, las velas caían encima de las patas de Mister Ed y del Doctor
 * Saturno. Cada tanda va en un hueco entre los que están parados en el piso: la murga (328), la
 * bailarina (589), el Morta (979), Saturno (1240), Mister Ed (1347), los gallos (1468), el santo (194).
 * `cerca`: dónde, cuántas velas y si lleva botella. `lejos`: dónde, la fila de atrás.
 */
const OFRENDAS = {
  cerca: [[462, 3, false], [752, 5, true], [1722, 4, true], [1868, 3, false]] as const,
  lejos: [440, 690, 835, 1108, 1640, 1795],
};

function temploOfrendas(c: CapaDeAire): string {
  const rnd = azar(1321);
  let s = '';
  // La fila de atrás (séptima ronda): más lejos, contra donde empieza el piso. Las mismas velas, a
  // poco más de la mitad y más apagadas, en tandas que no coinciden con las de adelante.
  const lejos = azar(1327);
  for (let i = 0; i < OFRENDAS.lejos.length; i++) {
    const x0 = OFRENDAS.lejos[i]!;
    const y0 = 504 + lejos() * 12;
    let tanda = '';
    const cuantas = 2 + Math.floor(lejos() * 3);
    for (let k = 0; k < cuantas; k++) tanda += vela(x0 + (k - cuantas / 2) * (20 + lejos() * 12) + 0.37 * i, y0 + (lejos() - 0.5) * 8, 16 + lejos() * 40, lejos).replaceAll('"ve-', `"vl${i}-`).replaceAll('(#ve-', `(#vl${i}-`);
    s += `<g opacity="0.62" transform="translate(${f(x0)} ${f(y0)}) scale(0.56) translate(${f(-x0)} ${f(-y0)})">${tanda}</g>`;
  }
  for (let i = 0; i < OFRENDAS.cerca.length; i++) {
    const [x0, cuantas, conBotella] = OFRENDAS.cerca[i]!;
    const y0 = 548 + rnd() * 36;
    let tanda = '';
    for (let k = 0; k < cuantas; k++) tanda += vela(x0 + (k - cuantas / 2) * (16 + rnd() * 10), y0 + (rnd() - 0.5) * 14, 14 + rnd() * 46, rnd);
    // Un platito con algo adentro, y una botella vacía.
    const px = x0 + cuantas * 14 + 16;
    tanda += nube(px, y0 + 6, 18, 3.4, TE.negro, 's', 0.8) + `<ellipse cx="${f(px)}" cy="${f(y0 + 3)}" rx="15" ry="4.4" fill="${TE.papel}" opacity="0.85"/><ellipse cx="${f(px)}" cy="${f(y0 + 2)}" rx="10" ry="2.6" fill="${TE.negro}" opacity="0.7"/>`;
    if (conBotella) {
      const bx = x0 - cuantas * 14 - 12;
      tanda += nube(bx, y0 + 5, 9, 3, TE.negro, 's', 0.8) + forma(`M${f(bx - 5)} ${f(y0 + 4)} L${f(bx - 5)} ${f(y0 - 18)} Q${f(bx - 4)} ${f(y0 - 24)} ${f(bx - 2)} ${f(y0 - 26)} L${f(bx - 2)} ${f(y0 - 36)} L${f(bx + 2)} ${f(y0 - 36)} L${f(bx + 2)} ${f(y0 - 26)} Q${f(bx + 4)} ${f(y0 - 24)} ${f(bx + 5)} ${f(y0 - 18)} L${f(bx + 5)} ${f(y0 + 4)} Z`, TE.negro) + trazo(`M${f(bx - 3.4)} ${f(y0 - 16)} L${f(bx - 3.4)} ${f(y0)}`, TE.foco, 1.1, 0.6);
    }
    // Las flores: tres o cuatro puntos claros con su tallo, tirados.
    for (let k = 0; k < 4; k++) {
      const fx = x0 + (rnd() - 0.5) * cuantas * 24;
      const fy = y0 + 8 + rnd() * 14;
      tanda += trazo(`M${f(fx)} ${f(fy)} l${f(8 + rnd() * 6)} ${f(-2 + rnd() * 4)}`, TE.negro, 1.4) + `<circle cx="${f(fx)}" cy="${f(fy)}" r="${f(2 + rnd() * 1.4)}" fill="${k % 2 ? TE.foco : TE.papel}" opacity="0.9"/>`;
    }
    s += tanda;
  }
  return rociado(c, s);
}

/** El polvo del galpón: motas chicas y parejas, tibias, como la trama de puntos del público. */
function galponPolvo(c: CapaDeAire): string {
  const rnd = azar(1511);
  let s = manchas(c, 1513, 8, 180, 380, [[GA.luz, 0.07], [GA.rojo, 0.09]], 30, [50, 120]);
  for (let i = 0; i < 150; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 30 + rnd() * (c.alto - 60);
    const r = 0.9 + rnd() * 1.3;
    const o = 0.4 + rnd() * 0.45;
    s += vuelta(x, 8, c.ancho, (xx) => `<circle cx="${f(xx)}" cy="${f(y)}" r="${f(r)}" fill="${i % 4 ? GA.luz : GA.rojo}" opacity="${f(o)}"/>`);
  }
  return rociado(c, s);
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
  // El canto roto (sexta ronda): el haz era una banda de borde liso, de regla, que cruzaba media
  // pantalla. Ahora la silueta es cartulina **cortada a mano**: cada canto baja en tramos desparejos
  // que se meten un poco para adentro, con algún tajo más hondo, y se abre más cuanto más lejos de la
  // boca. Sigue siendo borde duro de máscara de papel, que es la mano de la casa; lo que se fue es la regla.
  const rnd = azar([...id].reduce((n, ch) => n * 31 + ch.charCodeAt(0), 7) >>> 0);
  const canto = (lado: number): string[] => {
    const puntos: string[] = [];
    for (let u = 0.07 + rnd() * 0.05; u < 0.99; u += 0.022 + rnd() * 0.075) {
      const tajo = rnd() < 0.16;
      const muerde = (tajo ? 5 + rnd() * 9 : rnd() * 3.6) * (0.35 + u * 1.15);
      puntos.push(`L${f(lado * (5 + (ancho / 2 - 5) * u - muerde))} ${f(largo * u)}`);
      // El tajo vuelve enseguida al canto: es un diente, no una panza.
      if (tajo) puntos.push(`L${f(lado * (5 + (ancho / 2 - 5) * (u + 0.012) - rnd() * 2))} ${f(largo * (u + 0.012))}`);
    }
    return puntos;
  };
  const derecho = canto(1);
  const izquierdo = canto(-1).reverse();
  const silueta = `M-5 0 L5 0 ${derecho.join(' ')} L${f(ancho / 2)} ${f(largo)} L${f(-ancho / 2)} ${f(largo)} ${izquierdo.join(' ')} Z`;
  // La máscara: los dos cantos de cartulina, duros, y el pie soplado (lo último del haz no llega al
  // piso con canto: se deshace). Blanco deja pasar, negro tapa.
  // Y adentro no es un plano parejo (sexta ronda): la máscara se cruza con textura. Las **vetas**
  // son cuñas oscuras que nacen en la boca y se abren hacia el pie, como la luz que pasa por una
  // rejilla sucia; las **motas**, el polvo que flota y le come luz de a manchas. Todo en la máscara:
  // lo que queda es menos tinta, no otra tinta.
  let textura = '';
  for (let i = 0; i < 9; i++) {
    const a = (rnd() - 0.5) * (ancho - 24);
    const w = (4 + rnd() * 20) * (rnd() < 0.3 ? 2 : 1);
    textura += `<path d="M${f(a * 0.02)} ${f(largo * 0.05)} L${f(a + w / 2)} ${f(largo)} L${f(a - w / 2)} ${f(largo)} Z" fill="black" opacity="${f(0.22 + rnd() * 0.36)}" filter="url(#soplo-xs)"/>`;
  }
  for (let i = 0; i < 12; i++) {
    const u = 0.25 + rnd() * 0.7;
    const x = (rnd() - 0.5) * ancho * u * 0.9;
    const r = (10 + rnd() * 26) * (0.5 + u);
    textura += `<ellipse cx="${f(x)}" cy="${f(largo * u)}" rx="${f(r)}" ry="${f(r * (0.4 + rnd() * 0.5))}" fill="black" opacity="${f(0.2 + rnd() * 0.3)}" filter="url(#soplo-m)"/>`;
  }
  const mascara =
    `<mask id="${id}"><path d="${silueta}" fill="white"/>${textura}` +
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
const brasa = (): string => nube(0, 0, 170, 26, I.fuego, 'xl', 0.75) + nube(0, 4, 100, 20, I.chispa, 'xl', 0.6) + nube(0, 6, 44, 9, 'var(--entorno-mesa-papel)', 'l', 0.55);

const QUIEN_ALUMBRA: Readonly<Record<string, () => string>> = {
  'luz-astillero-cono': () => haz('lz-a', 340, 300, T.sodio, 'var(--entorno-mesa-papel)'),
  'luz-infierno-brasa': brasa,
  'luz-cyber-haz': () => haz('lz-c', 560, 330, C.lente, C.nieve),
  'luz-ruta-faros': () => haz('lz-r', 260, 190, RU.faro, RU.papel),
  'luz-techos-farol': () => haz('lz-t', 380, 320, B.lila, B.luz),
  'luz-templo-foco': () => haz('lz-m', 360, 300, TE.foco, TE.papel),
  'luz-galpon-seguidor': () => haz('lz-g', 420, 340, GA.luz, GA.luz),
  // El reflejo del pucho en el agua: una escalerita de rayas de crayón, cada vez más cortas y más flojas.
  'luz-bajo-reflejo': () =>
    Array.from({ length: 9 }, (_, i) => trazo(`M${f(-34 + i * 3.4 + (i % 2) * 5)} ${f(4 + i * 13)} l${f(68 - i * 6.6)} 0`, i % 3 ? J.llama : J.clara, 3.6 - i * 0.22, 0.9 - i * 0.07)).join(''),
  // El reflector del muro: de gubia. El cono de canto duro, casi nada de tinta, y el rayado que lo llena.
  'luz-prision-reflector': () => {
    const silueta = 'M-6 0 L6 0 L200 640 L-200 640 Z';
    let rayas = '';
    for (let y = 30; y < 640; y += 15) rayas += trazo(`M${f(-y * 0.32)} ${y} L${f(y * 0.32)} ${y}`, P.papel, 1.4);
    // El cono apenas teñido va sin filtro (la gubia se lo comería); el rayado, con su filo.
    return forma(silueta, P.papel, 0.2) + `<g filter="url(#gubia)">${enmascarado('lz-p', silueta, rayas)}</g>`;
  },
};

/** Las luces que no son de aerógrafo: van con la mano de su recinto (crayón, gubia), sin rociado. */
const SIN_ROCIADO: Readonly<Record<string, string>> = { 'luz-bajo-reflejo': 'xerox-fino', 'luz-prision-reflector': '' };

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
  // La prisión: blancos, de gubia, con la pupila roja. El de la celda de enfrente.
  'acecho-prision': () => almendra('ac-p1', 11, 10, P.papel, P.papel, 'punto') + almendra('ac-p2', 35, 10, P.papel, P.papel, 'punto') + `<circle cx="11" cy="9.6" r="1.1" fill="${P.rojo}"/><circle cx="35" cy="9.6" r="1.1" fill="${P.rojo}"/>`,
};

/**
 * El filo (quinta ronda): lo que la luz le prende a un bicho cuando le pasa por encima. Es una
 * medialuna fina, de canto duro del lado de la luz y que se pierde para atrás: el canto encendido de
 * algo que está a contraluz, como el de las tiras del monte. La caja mide 100 × 50 y la isla la
 * estira al ancho del bicho; la medialuna abraza la parte de arriba.
 */
function filo(id: string, color: string, mano: 'aerografo' | 'gubia'): string {
  const d = 'M4 44 Q50 -14 96 44 Q50 2 4 44 Z';
  if (mano === 'gubia') {
    // En la madera tallada el filo es una raya llena y tres cortes cortos al lado.
    return `<g filter="url(#gubia)">${forma(d, color)}${trazo('M20 16 l-7 -9 M50 6 l0 -8 M80 16 l7 -9', color, 1.6)}</g>`;
  }
  return `<g filter="url(#grano)">${enmascarado(id, 'M0 46 Q50 -22 100 46 Z', forma(d, color) + nube(50, 8, 30, 7, 'var(--entorno-mesa-papel)', 's', 0.7))}</g>`;
}

const QUIEN_FILA: Readonly<Record<string, () => string>> = {
  'filo-sodio': () => filo('fl-s', T.sodio, 'aerografo'),
  'filo-papel': () => filo('fl-p', P.papel, 'gubia'),
  'filo-lila': () => filo('fl-l', B.luz, 'aerografo'),
};

/** Las piezas de los filos que piden las luces (`Luz.filo`). */
export const PIEZAS_DE_FILO: readonly Pieza[] = [...new Set(Object.values(LUCES).flat().flatMap((l) => (l.filo ? [l.filo.pieza] : [])))].map((nombre) => {
  const pinta = QUIEN_FILA[nombre];
  if (!pinta) throw new Error(`nadie pinta el filo "${nombre}" (arte-aire.ts)`);
  return { nombre, caja: [0, 0, 100, 50] as const, dibujo: pinta(), densidad: 3 };
});

/** Un pájaro lejos, de frente: las dos alas abiertas en ve y el cuerpo. La isla lo aletea achatándolo. */
const ave = (color: string): string =>
  forma('M20 11 Q12 2 1 4 Q10 6 15 12 Q18 15 20 14 Q22 15 25 12 Q30 6 39 4 Q28 2 20 11 Z', color) + `<ellipse cx="20" cy="12.5" rx="2.6" ry="3.4" fill="${color}"/>`;

const QUIEN_PASA: Readonly<Record<string, () => string>> = {
  'vida-ave': () => ave(M.medio),
  'vida-ave-papel': () => ave(P.papel),
  // La estrella que se cae: la cabeza, y la cola que se pierde para atrás (cae hacia la derecha y abajo).
  'vida-fugaz': () => soplo('M4 4 L84 22 L86 26 L82 27 Z', RU.papel, 'xs', 0.7) + nube(84, 25, 3.4, 3, RU.papel, 'xs', 1),
  // El barquito de papel: dos pliegues y la vela, con su raya de agua.
  'vida-barquito': () =>
    forma('M4 18 L36 18 L29 27 L11 27 Z', J.luz) + forma('M20 3 L30 18 L10 18 Z', J.luz) + forma('M20 3 L20 18 L10 18 Z', J.celeste, 0.6) + trazo('M2 28.5 l12 0 M20 29 l16 0', J.celeste, 1.2, 0.7),
};

/** Las piezas de lo que pasa lejos (`VIDAS` en `aire.ts`): chicas y de filo, se imprimen finas. */
export const PIEZAS_DE_VIDA: readonly Pieza[] = [...new Map(Object.values(VIDAS).map((v) => [v.pieza, v] as const)).values()].map((v) => {
  const pinta = QUIEN_PASA[v.pieza];
  if (!pinta) throw new Error(`nadie pinta "${v.pieza}" (arte-aire.ts)`);
  return { nombre: v.pieza, caja: [0, 0, v.ancho, v.alto] as const, dibujo: pinta(), densidad: 4 };
});

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
      dibujo: `<g${SIN_ROCIADO[l.pieza] === '' ? '' : ` filter="url(#${SIN_ROCIADO[l.pieza] ?? 'rociado'})"`}><rect x="${x}" y="${y}" width="${ancho}" height="${alto}" fill="var(--fondo)" fill-opacity="0"/>${pinta()}</g>`,
      densidad: l.pieza in SIN_ROCIADO ? 1.5 : 1,
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
  'aire-cyber-nevisca': cyberNevisca,
  'aire-cyber-cerca': cyberCerca,
  'aire-astillero-bruma': astilleroBruma,
  'aire-astillero-vaho': astilleroVaho,
  'aire-astillero-cerca': astilleroCerca,
  'aire-infierno-humo': infiernoHumo,
  'aire-infierno-ceniza': infiernoCeniza,
  'aire-ruta-bruma': rutaBruma,
  'aire-ruta-polvo': rutaPolvo,
  'aire-ruta-cerca': rutaCerca,
  'aire-bajo-vaho': bajoVaho,
  'aire-bajo-cerca': bajoCerca,
  'aire-techos-humo': techosHumo,
  'aire-techos-ropa': techosRopa,
  'aire-prision-frio': prisionFrio,
  'aire-prision-rejas': prisionRejas,
  'aire-mesa-humo': mesaHumo,
  'aire-templo-incienso': temploIncienso,
  'aire-templo-ofrendas': temploOfrendas,
  'aire-templo-humo-baja': temploHumoQueBaja,
  'aire-arbol-hojas': arbolHojas,
  'aire-arbol-racha': arbolRacha,
  'aire-galpon-polvo': galponPolvo,
};

/**
 * Las baldosas del aire, una por pieza (el monte y la pastura comparten las suyas). La niebla es
 * pura mancha y se imprime gruesa, que pesa poco; lo que tiene filo (las matas, la ceniza) va más fino.
 */
export const PIEZAS_AIRE: readonly Pieza[] = [...new Map(Object.values(AIRE).flat().filter((c) => !c.ajena).map((c) => [c.pieza, c] as const)).values()].map((c) => {
  const pinta = PINTA[c.pieza];
  if (!pinta) throw new Error(`nadie pinta la baldosa "${c.pieza}" (arte-aire.ts)`);
  const region = Object.keys(AIRE).find((r) => AIRE[r]!.includes(c))!;
  return {
    nombre: c.pieza,
    caja: [0, c.y, c.ancho, c.alto] as const,
    dibujo: pinta(receta(region, c.pieza)),
    densidad: c.cae ? 1.5 : c.plano === 'cerca' ? 1.25 : 1,
    // El grano pesa: la niebla aguanta más compresión que un títere, porque no tiene filo que cuidar.
    calidad: c.plano === 'cerca' ? 78 : 58,
    // La que se repite también para arriba (la ceniza) son motas sueltas: no hay soplo que cruce el borde.
    sangria: c.cae ? 0 : SANGRIA,
  };
});
