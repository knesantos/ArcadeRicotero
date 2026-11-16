/**
 * Cybersiberia, a lo largo (`D-91`, tanda 3): frío **y** máquina.
 *
 * El recinto de 900 y su piso (la tele, la tele chica, los de la nieve) son de `arte-entornos.ts` y acá
 * no se editan: otra sesión los está tocando (`T-529`). Lo que el camino largo pinta por su cuenta:
 *
 * - **Lo lejano**, entero. El cielo sigue siendo la chapa remachada de *Último bondi*, pero ahora es
 *   un techo helado: escarcha que se espesa hacia el horizonte y carámbanos colgando de las juntas.
 *   La orilla va en dos planos: atrás, fábricas pálidas que el blanco se traga; adelante, pocas y
 *   oscuras (torres con baliza roja, bloques con pantallas prendidas, una pared de teles). Entre las
 *   dos, la ventisca. La nieve tiene ventisqueros en escorzo, chicos y apretados contra el horizonte.
 * - **Debajo del piso** (`tundraBajo`): la huella de una oruga que cruza la nieve hasta el horizonte,
 *   y al costado una fila de postes cada vez más chicos, con los cables combados y el hielo colgando.
 *   El primero corta el cuadro, con una caja prendida. Y un charco de hielo con algo atrapado adentro.
 * - **El coloso** (`VISITAS`): algo enorme que camina en el blanco, si te quedás quieto.
 */

import { forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { CYBER } from './rig-entornos.ts';
import { cinta, enLaFuga, fuga, linea } from './escorzo.ts';

const C = {
  hondo: 'var(--entorno-cyber-acero-hondo)',
  acero: 'var(--entorno-cyber-acero)',
  claro: 'var(--entorno-cyber-acero-claro)',
  nieve: 'var(--entorno-cyber-nieve)',
  vidrio: 'var(--entorno-cyber-vidrio)',
  lente: 'var(--entorno-cyber-lente)',
  oxido: 'var(--entorno-cyber-oxido)',
  negro: 'var(--fondo)',
  papel: 'var(--papel)',
  rojo: 'var(--marca-rojo)',
  // El verde agua de la aurora: el ojo del cordero, que es el único verde frío de las tapas (el lente de la tele es
  // celeste pálido y sobre la nieve gris no llegaba a ser color). Cuarta vuelta de la tanda 3.
  aurora: 'var(--bestia-cordero-ojo)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)} h${f(w)} v${f(h)} h${f(-w)} Z`;
const circulo = (x: number, y: number, r: number): string => `M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0 Z`;

/** Las tres cosas de la tapa (`arte-entornos.ts`): la pista en relieve, el remache y el terminal. */
const pista = (d: string, ancho: number, o = 1): string =>
  `<g transform="translate(0 2)">${trazo(d, C.negro, ancho + 2, 0.7 * o)}</g>` + trazo(d, C.acero, ancho, o) + `<g transform="translate(-0.8 -1.6)">${trazo(d, C.claro, ancho * 0.35, 0.75 * o)}</g>`;
const remache = (x: number, y: number, r: number): string =>
  forma(circulo(x, y + r * 0.3, r), C.negro, 0.7) + forma(circulo(x, y, r), C.claro) + forma(circulo(x - r * 0.35, y - r * 0.35, r * 0.4), C.papel, 0.7);
const terminal = (x: number, y: number, r: number): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${C.acero}" stroke-width="${f(r * 0.6)}"/>` +
  `<circle cx="${f(x - 0.8)}" cy="${f(y - 1.6)}" r="${f(r)}" fill="none" stroke="${C.claro}" stroke-width="${f(r * 0.18)}" opacity="0.8"/>`;

/** Un manojo de carámbanos colgando de `y`: desparejos, el del medio más largo, con un pelo de luz de la tele. */
function carambanos(rnd: () => number, x: number, y: number, cuantos: number, largo: number, o = 0.8): string {
  let s = '';
  for (let j = 0; j < cuantos; j++) {
    const cx = x + j * (3 + largo * 0.12) + rnd() * 2;
    const l = largo * (0.3 + rnd() * 0.5 + Math.sin(((j + 0.5) / cuantos) * Math.PI) * 0.4);
    const w = 1 + l * 0.07;
    s += forma(`M${f(cx - w)} ${f(y)} L${f(cx + w)} ${f(y)} L${f(cx + (rnd() - 0.5))} ${f(y + l)} Z`, C.nieve, o) + trazo(`M${f(cx - w * 0.3)} ${f(y + 1)} L${f(cx)} ${f(y + l * 0.7)}`, C.lente, 0.5, 0.6);
  }
  return s;
}

/** Copos teñidos: la nevada que pasa por delante de algo prendido agarra su color. */
function tenidos(rnd: () => number, x: number, y: number, rx: number, ry: number, cuantos: number, color: string): string {
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd());
    s += `<circle cx="${f(x + Math.cos(a) * rx * d)}" cy="${f(y + Math.sin(a) * ry * d)}" r="${f(0.7 + rnd() * 1.5)}" fill="${color}" opacity="${f((0.9 - d * 0.6) * (0.5 + rnd() * 0.5))}"/>`;
  }
  return s;
}

/**
 * La aurora (cuarta vuelta): la segunda fuente grande de luz de Cybersiberia, además de la tele. Una cortina verde
 * agua, baja, pegada al horizonte: hebras verticales sopladas, de distinto alto, sobre una línea que ondula, con el
 * pie más cargado y un pelo de rojo arriba. Es fría: la misma tinta de la pantalla. Lo de la orilla se recorta
 * contra ella, y abajo tiñe la nieve.
 */
function aurora(rnd: () => number, desde: number, hasta: number, pie: number, fuerza = 1): string {
  const ancho = hasta - desde;
  let s = nube((desde + hasta) / 2, pie - 76, ancho * 0.5, 104, C.aurora, 'xl', 0.5 * fuerza) + nube((desde + hasta) / 2, pie - 30, ancho * 0.42, 40, C.lente, 'xl', 0.3 * fuerza);
  for (let x = desde; x < hasta; x += 7 + rnd() * 9) {
    const u = (x - desde) / ancho;
    // Más alta en el medio, y se deshace en las puntas.
    const cuerpo = Math.sin(u * Math.PI) ** 0.7;
    const base = pie - 6 + Math.sin(u * Math.PI * 3.2) * 16 + Math.sin(u * Math.PI * 7) * 5;
    const alto = (60 + rnd() * 140) * (0.35 + cuerpo * 0.65);
    s += nube(x, base - alto / 2, 4 + rnd() * 7, alto / 2, rnd() < 0.62 ? C.aurora : C.lente, 'm', (0.3 + rnd() * 0.4) * cuerpo * fuerza);
    if (rnd() < 0.3) s += nube(x, base - alto, 4 + rnd() * 4, 9, C.rojo, 'm', 0.2 * cuerpo * fuerza);
    if (rnd() < 0.5) s += nube(x, base - 3, 6 + rnd() * 6, 5, C.nieve, 's', 0.32 * cuerpo * fuerza);
  }
  return s;
}

/** Una torre de fierro con su baliza roja y la nieve en los travesaños. */
function torre(x: number, pie: number, alto: number, color: string, o = 1): string {
  const t = pie - alto;
  let d = `M${f(x - alto * 0.1)} ${pie} L${f(x - 2.4)} ${f(t)} M${f(x + alto * 0.1)} ${pie} L${f(x + 2.4)} ${f(t)} `;
  for (let u = 0; u < 0.86; u += 0.2) {
    const [a, b] = [alto * 0.1 * (1 - u) + 2.4 * u, alto * 0.1 * (1 - u - 0.2) + 2.4 * (u + 0.2)];
    d += `M${f(x - a)} ${f(pie - alto * u)} L${f(x + b)} ${f(pie - alto * (u + 0.2))} M${f(x + a)} ${f(pie - alto * u)} L${f(x - b)} ${f(pie - alto * (u + 0.2))} `;
  }
  const brazos = `M${f(x - alto * 0.16)} ${f(t + alto * 0.1)} L${f(x + alto * 0.16)} ${f(t + alto * 0.1)} M${f(x - alto * 0.11)} ${f(t + alto * 0.24)} L${f(x + alto * 0.11)} ${f(t + alto * 0.24)}`;
  return (
    trazo(d, color, Math.max(1.2, alto * 0.022), o) + trazo(brazos, color, Math.max(1.6, alto * 0.03), o) +
    `<g transform="translate(0 -1.6)">${trazo(brazos, C.nieve, 1.2, 0.6 * o)}</g>` +
    // La baliza tiñe el aire que tiene alrededor y deja su mancha roja en la nieve del pie.
    nube(x, t - 3, alto * 0.16, alto * 0.14, C.rojo, 'l', 0.3 * o) + nube(x, pie + 6, alto * 0.34, 5, C.rojo, 'l', 0.26 * o) +
    nube(x, t - 3, 5, 5, C.rojo, 's', 0.8 * o) + forma(circulo(x, t - 3, 1.7), C.rojo, o)
  );
}

/** Un bloque con las pantallas prendidas: la nieve arriba, y adentro una grilla de ventanas verde agua, alguna roja. */
function bloque(rnd: () => number, x: number, pie: number, w: number, alto: number): string {
  let ventanas = '';
  for (let fila = 0; fila < Math.floor(alto / 13) - 1; fila++) {
    for (let col = 0; col < Math.floor(w / 11) - 1; col++) {
      const que = rnd();
      if (que > 0.34) continue;
      ventanas += forma(caja(x + 7 + col * 11, pie - alto + 9 + fila * 13, 6, 5), que < 0.03 ? C.rojo : C.lente, 0.5 + rnd() * 0.45);
    }
  }
  return (
    forma(caja(x, pie - alto, w, alto + 4), C.hondo) +
    forma(caja(x + w * 0.6, pie - alto - 16, w * 0.24, 18), C.hondo) +
    nube(x + w * 0.4, pie - alto * 0.5, w * 0.8, alto * 0.7, C.lente, 'xl', 0.3) + nube(x + w * 0.5, pie + 9, w * 0.8, 9, C.lente, 'l', 0.4) +
    ventanas +
    soplo(`M${f(x - 3)} ${f(pie - alto + 3)} Q${f(x + w * 0.3)} ${f(pie - alto - 7)} ${f(x + w * 0.58)} ${f(pie - alto - 1)} L${f(x + w + 3)} ${f(pie - alto + 3)} L${f(x + w + 3)} ${f(pie - alto + 5)} L${f(x - 3)} ${f(pie - alto + 5)} Z`, C.nieve, 'xs', 0.85)
  );
}

/** La pared de teles, torcida y medio enterrada: quince pantallas, seis prendidas, una en rojo y una con nieve. */
function paredDeTeles(x: number, pie: number): string {
  const rnd = azar(2129);
  let teles = '';
  for (let fila = 0; fila < 3; fila++) {
    for (let col = 0; col < 5; col++) {
      const [px, py] = [x + 5 + col * 17.4, pie - 66 + fila * 20];
      const que = (fila * 5 + col) % 5 === 1 || (fila === 2 && col === 3) ? 'lente' : fila === 0 && col === 3 ? 'rojo' : fila === 1 && col === 4 ? 'nieve' : '';
      teles += forma(caja(px, py, 14, 16), C.negro);
      if (!que) continue;
      teles += forma(caja(px + 1.4, py + 1.6, 11.2, 12.4), que === 'rojo' ? C.rojo : que === 'nieve' ? C.nieve : C.lente, que === 'nieve' ? 0.6 : 0.85);
      for (let i = 0; i < 3; i++) teles += trazo(`M${f(px + 1.4)} ${f(py + 4 + i * 3.4 + rnd())} l11.2 0`, C.hondo, 0.8, 0.4);
    }
  }
  return (
    // Segunda vuelta: lo prendido tiñe. El verde agua se derrama en la nieve y en el aire, y la tele roja deja su mancha.
    nube(x + 46, pie + 18, 140, 28, C.lente, 'xl', 0.55) + nube(x + 46, pie - 40, 100, 66, C.lente, 'xl', 0.26) + nube(x + 66, pie + 9, 30, 7, C.rojo, 'm', 0.34) +
    tenidos(rnd, x + 46, pie - 30, 120, 80, 46, C.lente) +
    `<g transform="rotate(-5 ${x + 46} ${pie})">` +
    trazo(`M${x + 14} ${pie - 4} l-6 12 M${x + 78} ${pie - 4} l6 12`, C.hondo, 3.4) +
    forma(caja(x, pie - 72, 92, 70), C.hondo) +
    teles +
    soplo(`M${x - 4} ${pie - 68} Q${x + 30} ${pie - 82} ${x + 56} ${pie - 73} Q${x + 80} ${pie - 79} ${x + 96} ${pie - 68} L${x + 96} ${pie - 66} L${x - 4} ${pie - 66} Z`, C.nieve, 'xs', 0.9) +
    carambanos(rnd, x + 8, pie - 2, 4, 9, 0.7) + carambanos(rnd, x + 60, pie - 2, 3, 7, 0.7) +
    `</g>`
  );
}

/** Lo lejano de Cybersiberia, a lo largo. */
export function tundraLejos(ancho: number, alto: number): string {
  const h = CYBER.horizonte;
  const k = ancho / 900;
  const rnd = azar(2111);
  let cepillado = '';
  for (let i = 0; i < 140; i++) cepillado += trazo(`M${f(rnd() * ancho)} ${f(rnd() * h)} l${f(80 + rnd() * 260)} 0`, rnd() < 0.5 ? C.claro : C.negro, 0.8 + rnd() * 1.4, 0.06 + rnd() * 0.12);
  let juntas = '';
  let hielo = '';
  for (const y of [104, 214]) {
    juntas += trazo(`M-10 ${y} L${ancho + 10} ${y}`, C.negro, 2.4, 0.8) + trazo(`M-10 ${y + 2} L${ancho + 10} ${y + 2}`, C.claro, 1, 0.35);
    for (let x = 12; x < ancho; x += 26) juntas += remache(x, y + 9, 2.6);
    // Los carámbanos: la chapa es un techo. De la junta de abajo cuelgan más y más largos.
    for (let x = 30 + rnd() * 80; x < ancho; x += (y > 200 ? 70 : 150) + rnd() * 210) hielo += carambanos(rnd, x, y + 3, 2 + Math.floor(rnd() * 5), y > 200 ? 16 + rnd() * 26 : 8 + rnd() * 12, y > 200 ? 0.8 : 0.55);
  }
  for (let x = 60 + rnd() * 140; x < ancho; x += 180 + rnd() * 260) {
    const y0 = rnd() < 0.5 ? 0 : 104;
    juntas += trazo(`M${f(x)} ${y0} L${f(x)} ${y0 + 104}`, C.negro, 2.2, 0.75);
    for (let y = y0 + 14; y < y0 + 100; y += 24) juntas += remache(x + 8, y, 2.4);
  }
  let pistas = '';
  for (let i = 0; i < Math.round(5 * k); i++) {
    let [x, y] = [rnd() * ancho, 24 + rnd() * 160];
    let d = `M${f(x)} ${f(y)}`;
    const [x0, y0] = [x, y];
    let horizontal = rnd() < 0.5;
    for (let j = 0; j < 3 + Math.floor(rnd() * 3); j++) {
      const l = 70 * (0.4 + rnd());
      if (horizontal) x += rnd() < 0.5 ? -l : l;
      else y += (rnd() < 0.6 ? 1 : -1) * l * 0.5;
      d += ` L${f(x)} ${f(y)}`;
      horizontal = !horizontal;
    }
    pistas += pista(d, 5 + rnd() * 3, 0.85) + terminal(x0, y0, 6) + terminal(x, y, 5);
  }
  // La escarcha: motas que se espesan hacia el horizonte, hasta que la chapa es blanca.
  let escarcha = '';
  for (let i = 0; i < Math.round(240 * k); i++) {
    const y = h - rnd() ** 2.2 * 170;
    escarcha += `<circle cx="${f(rnd() * ancho)}" cy="${f(y)}" r="${f(0.5 + rnd() * 1.5)}" opacity="${f(0.16 + rnd() * 0.4 + (y - h + 170) / 600)}"/>`;
  }
  // El plano de atrás: lo que el blanco se está tragando. Pálido, con humo helado que el viento acuesta.
  let atras = '';
  for (let x = -20; x < ancho + 20;) {
    const w = 20 + rnd() * 80;
    const t = h - 10 - rnd() * 62;
    atras += forma(caja(x, t, w, h - t + 4), C.claro, 0.5) + trazo(`M${f(x)} ${f(t)} l${f(w)} 0`, C.nieve, 1.6, 0.4);
    if (rnd() < 0.3) {
      const cx = x + w * 0.3;
      const ct = t - 30 - rnd() * 50;
      atras += forma(caja(cx, ct, 6, t - ct + 2), C.claro, 0.5) + nube(cx - 22, ct - 6, 30, 7, C.nieve, 'm', 0.3) + nube(cx - 60, ct - 12, 40, 9, C.nieve, 'l', 0.18);
    }
    x += w + 20 + rnd() * 90;
  }
  // La ventisca del horizonte, entre los dos planos: bancos blancos, desparejos, que dejan ver y tapan.
  let ventisca = '';
  for (let x = 40; x < ancho; x += 150 + rnd() * 190) ventisca += nube(x, 300 + rnd() * 22, 130 + rnd() * 130, 16 + rnd() * 20, C.nieve, 'xl', 0.26 + rnd() * 0.34);
  // El plano de adelante: pocas cosas, oscuras, con huecos. Ninguna a la altura de la tele (1200), que va adelante.
  // Tercera vuelta: tampoco hay torre entre 1290 y 1720, que es lo que cae debajo de Super Walter (parado en el aire,
  // en 1707 del piso) según por dónde vaya la cámara: una torre ahí lo dejaba parado en la baliza.
  // Y la chapa devuelve lo prendido: sobre cada cosa con luz, su mancha en el cielo de acero, verde agua o roja.
  let devuelve = '';
  for (const x of [322, 532, 928, 1664, 2078]) devuelve += nube(x, 196, 130, 62, C.lente, 'xl', 0.2) + nube(x, 236, 80, 26, C.lente, 'xl', 0.18);
  for (const x of [170, 800, 1040, 1890, 2260]) devuelve += nube(x, 176, 70, 44, C.rojo, 'xl', 0.13);
  const cerca =
    torre(170, h + 2, 104, C.hondo) + bloque(rnd, 286, h + 2, 74, 82) +
    paredDeTeles(486, h + 4) +
    torre(800, h + 2, 122, C.hondo) + bloque(rnd, 880, h + 2, 96, 62) +
    torre(1040, h + 2, 96, C.hondo) + bloque(rnd, 1610, h + 2, 110, 90) + torre(1890, h + 2, 128, C.hondo) + bloque(rnd, 2040, h + 2, 78, 70) + torre(2260, h + 2, 90, C.hondo);
  // Los cables de torre a torre, combados, con el hielo colgando.
  let cables = '';
  const torres = [[170, 104], [800, 122], [1040, 96], [1890, 128], [2260, 90]] as const;
  for (let i = 0; i < torres.length - 1; i++) {
    const [[x0, a0], [x1, a1]] = [torres[i]!, torres[i + 1]!];
    const [y0, y1] = [h + 2 - a0 * 0.9, h + 2 - a1 * 0.9];
    const panza = Math.min(46, (x1 - x0) * 0.07);
    cables += trazo(`M${x0} ${f(y0)} Q${(x0 + x1) / 2} ${f((y0 + y1) / 2 + panza * 2)} ${x1} ${f(y1)}`, C.hondo, 1.1, 0.8);
    for (let u = 0.08; u < 0.94; u += 0.05 + rnd() * 0.09) {
      const cy = (1 - u) ** 2 * y0 + 2 * u * (1 - u) * ((y0 + y1) / 2 + panza * 2) + u * u * y1;
      cables += carambanos(rnd, x0 + (x1 - x0) * u, cy, 1 + Math.floor(rnd() * 3), 4 + rnd() * 6, 0.6);
    }
  }
  const tx = CYBER.tele.x * k;
  // La nieve: ventisqueros en escorzo. Cerca son largos y gordos; contra el horizonte, rayas.
  let ventisqueros = '';
  for (let i = 0; i < 34; i++) {
    const hondura = rnd() ** 1.7;
    const y = h + 12 + hondura * (alto - h - 30);
    const x0 = rnd() * ancho;
    const w = 50 + hondura * 380 + rnd() * 60;
    const lomo = 3 + hondura * 22;
    ventisqueros += soplo(`M${f(x0 - w / 2)} ${f(y)} Q${f(x0 - w * 0.1)} ${f(y - lomo)} ${f(x0 + w / 2)} ${f(y)} Z`, C.nieve, hondura > 0.5 ? 's' : 'xs', 0.3 + hondura * 0.2) + nube(x0 + w * 0.1, y + 2 + lomo * 0.3, w * 0.42, 2 + lomo * 0.3, C.acero, 'm', 0.4);
  }
  let lucesLejos = '';
  for (let i = 0; i < 12; i++) {
    const x = rnd() * ancho;
    lucesLejos += nube(x, h - 3 - rnd() * 8, 4, 3, i % 4 ? C.lente : C.rojo, 'xs', 0.7) + nube(x, h + 6, 16, 3, i % 4 ? C.lente : C.rojo, 's', 0.2);
  }
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${C.hondo}"/>` +
    nube(ancho / 2, 60, ancho * 0.6, 140, C.acero, 'xl', 0.7) +
    cepillado + juntas + pistas +
    // La chapa se aclara hacia abajo: es el blanco de afuera, que le sube.
    nube(ancho / 2, h - 10, ancho * 0.75, 70, C.claro, 'xl', 0.55) +
    `<g fill="${C.nieve}">${escarcha}</g>` +
    devuelve +
    hielo +
    // La tele se ve desde el horizonte: la nieve del aire, prendida de verde agua.
    nube(tx, h - 30, 320, 90, C.lente, 'xl', 0.28) +
    atras +
    ventisca +
    // La aurora: dos cortinas, una a cada lado de la tele (que ya tiene su luz). Va delante de la ventisca (detrás
    // quedaba lavada: en la primera prueba no se veía) y detrás de lo oscuro de la orilla, que se recorta contra ella.
    aurora(rnd, 480, 1040, 306, 1) + aurora(rnd, 1640, 2260, 304, 0.9) +
    cables + cerca +
    // La nieve: gris donde no llega nada, blanca en el horizonte y donde le pega la tele.
    forma(caja(-10, h, ancho + 20, alto - h + 10), C.claro) +
    nube(ancho / 2, h + 4, ancho * 0.75, 15, C.nieve, 'l', 0.75) +
    nube(ancho / 2, h - 4, ancho * 0.75, 9, C.nieve, 'l', 0.4) +
    lucesLejos +
    // La nieve bajo la aurora, teñida: una mancha ancha contra el horizonte y otra, más floja, que baja hacia acá.
    nube(760, h + 26, 300, 28, C.aurora, 'xl', 0.55) + nube(760, h + 90, 250, 56, C.aurora, 'xl', 0.24) + nube(760, h + 16, 220, 12, C.lente, 'l', 0.4) +
    nube(1950, h + 26, 320, 28, C.aurora, 'xl', 0.5) + nube(1950, h + 90, 260, 56, C.aurora, 'xl', 0.2) + nube(1950, h + 16, 230, 12, C.lente, 'l', 0.36) +
    nube(tx, CYBER.tele.piso + 20, 380, 150, C.nieve, 'xl', 0.75) +
    nube(tx, CYBER.tele.piso + 20, 220, 80, C.lente, 'xl', 0.35) +
    ventisqueros +
    nube(ancho / 2, alto, ancho * 0.7, 80, C.acero, 'xl', 0.55) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   La huella y los postes: el punto de fuga
   ------------------------------------------------------------------ */

/** La huella de la oruga y la fila de postes, que se juntan en el horizonte. */
const HUELLA = { desde: [190, 644], hasta: [705, 335], cerca: 124, lejos: 3 } as const;
const POSTES = { desde: [118, 632], hasta: [700, 334], hondos: [0, 0.58, 0.74, 0.84, 0.9, 0.94, 0.97], alto: 660 } as const;

/** Dónde quedó el charco de hielo, y lo que tiene adentro: la caja es la de la pieza fina. */
const HIELO = { x: 292, y: 520, rx: 50, ry: 13, caja: [234, 500, 116, 40] as const };

function charcoDeHielo(): string {
  const { x, y, rx, ry } = HIELO;
  const rnd = azar(2141);
  let canto = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = 0.86 + rnd() * 0.22;
    canto += `${i ? 'L' : 'M'}${f(x + Math.cos(a) * rx * r)} ${f(y + Math.sin(a) * ry * r)} `;
  }
  canto += 'Z';
  return (
    `<clipPath id="tu-hielo"><path d="${canto}"/></clipPath><g clip-path="url(#tu-hielo)">` +
    forma(canto, C.acero) + nube(x - 10, y - 2, rx * 0.8, ry * 0.8, C.lente, 'm', 0.4) + nube(x + 26, y + 5, rx * 0.5, ry * 0.5, C.hondo, 'm', 0.6) +
    // El casete, acostado adentro del hielo: la carcasa, la etiqueta, los dos carretes y la cinta que se le salió.
    `<g transform="translate(${x - 6} ${y}) scale(1 0.56) rotate(-14)">` +
    forma(caja(-14, -9, 28, 18), C.hondo) + forma(caja(-11, -7, 22, 6.4), C.vidrio, 0.9) + forma(caja(-8, 1.4, 16, 5), C.negro) +
    forma(circulo(-4.6, 3.9, 1.9) + circulo(4.6, 3.9, 1.9), C.nieve) + trazo('M-9 -4 l12 0 M-9 -2.2 l8 0', C.hondo, 0.7, 0.8) +
    trazo('M14 6 q9 2 13 -4 q3 -6 9 -2 q5 4 10 0', C.oxido, 0.9, 0.9) +
    `</g>` +
    // El hielo de arriba: el brillo, y las rajaduras.
    nube(x - 24, y - 6, 22, 3, C.nieve, 'xs', 0.6) +
    trazo(`M${x - 40} ${y + 4} l22 -5 l14 4 l26 -7 M${x - 4} ${y + 3} l8 7 M${x + 22} ${y - 4} l10 -5`, C.nieve, 0.8, 0.7) +
    `</g>` +
    trazo(canto, C.nieve, 1.6, 0.8)
  );
}

/**
 * El muñeco de nieve del segundo poste: del alto de un dedo, con antena de alambre y un led rojo por nariz.
 * Es el segundo premio de la lupa (`fino-cyber-muneco`).
 */
const MUNECO = { x: 476, y: 464, caja: [462, 438, 28, 30] as const };
function muneco(): string {
  const { x, y } = MUNECO;
  return (
    nube(x + 4, y + 0.6, 9, 2, C.acero, 'xs', 0.8) +
    forma(circulo(x, y - 5, 5.4), C.nieve) + forma(circulo(x, y - 13, 3.6), C.nieve) + nube(x + 2, y - 4, 3, 4, C.claro, 'xs', 0.5) +
    trazo(`M${x - 4} ${y - 8} l-6 -4 M${x + 4} ${y - 8} l6 -5 M${x} ${y - 16} l-2 -8 l4 -2`, C.hondo, 0.8) +
    forma(circulo(x - 1.4, y - 14, 0.6) + circulo(x + 1.4, y - 14, 0.6), C.hondo) + forma(circulo(x, y - 12.4, 0.9), C.rojo) + nube(x, y - 12.4, 2.4, 2.4, C.rojo, 'xs', 0.5)
  );
}

/** Lo que va **debajo** del piso del recinto. Nada cae donde esperan los camellos (x de 190 a 340, de 350 a 470 de alto). */
export function tundraBajo(): string {
  const rnd = azar(2153);
  const ps = fuga(HUELLA.desde, HUELLA.hasta, HUELLA.cerca, HUELLA.lejos, 26, 12);
  let dientes = '';
  for (const [x, y, w, hondo] of fuga(HUELLA.desde, HUELLA.hasta, HUELLA.cerca, HUELLA.lejos, 64, 12)) {
    if (hondo > 0.93) continue;
    dientes += `M${f(x - w * 0.42)} ${f(y)} l${f(w * 0.24)} 0 M${f(x + w * 0.18)} ${f(y)} l${f(w * 0.24)} 0 `;
  }
  const huella =
    soplo(cinta(ps, 1.1), C.acero, 's', 0.32) +
    forma(cinta(ps, 0.25, -0.3), C.acero, 0.62) + forma(cinta(ps, 0.25, 0.3), C.acero, 0.62) +
    trazo(dientes, C.hondo, 1.4, 0.3) +
    // El canto de cada surco, donde la nieve quedó parada y agarra la luz.
    trazo(linea(ps, -0.44), C.nieve, 1.8, 0.85) + trazo(linea(ps, 0.16), C.nieve, 1.5, 0.7) + trazo(linea(ps, 0.45), C.hondo, 1.2, 0.3);

  // Los postes: el primero corta el cuadro; el último es una raya contra el blanco.
  const palos = POSTES.hondos.map((hondo) => {
    const [x, y] = enLaFuga(POSTES.desde, POSTES.hasta, hondo);
    const alto = POSTES.alto * (1 - hondo);
    return { x, y, alto, cerca: 1 - hondo, brazo: y - alto * 0.88, medio: alto * 0.11 };
  });
  let postes = '';
  let cables = '';
  palos.forEach((p, i) => {
    const gordo = 1.4 + p.cerca * 12;
    postes +=
      nube(p.x + p.alto * 0.12, p.y + 1, p.alto * 0.16, 1.5 + p.cerca * 5, C.acero, 's', 0.6) +
      trazo(`M${f(p.x)} ${f(p.y)} L${f(p.x)} ${f(p.y - p.alto)}`, C.hondo, gordo) +
      trazo(`M${f(p.x - gordo * 0.3)} ${f(p.y - 2)} L${f(p.x - gordo * 0.3)} ${f(p.y - p.alto)}`, C.nieve, Math.max(0.6, gordo * 0.16), 0.5) +
      trazo(`M${f(p.x - p.medio)} ${f(p.brazo)} L${f(p.x + p.medio)} ${f(p.brazo)}`, C.hondo, Math.max(1.2, gordo * 0.5)) +
      `<g transform="translate(0 ${f(-Math.max(0.8, gordo * 0.3))})">${trazo(`M${f(p.x - p.medio)} ${f(p.brazo)} L${f(p.x + p.medio)} ${f(p.brazo)}`, C.nieve, Math.max(0.8, gordo * 0.22), 0.85)}</g>` +
      // La nieve que se le juntó al pie.
      soplo(`M${f(p.x - 6 - p.cerca * 30)} ${f(p.y + 2)} Q${f(p.x)} ${f(p.y - 4 - p.cerca * 14)} ${f(p.x + 6 + p.cerca * 34)} ${f(p.y + 2)} Z`, C.nieve, 'xs', 0.9);
    const q = palos[i + 1];
    if (!q) return;
    for (const lado of [-1, 1]) {
      const [x0, y0, x1, y1] = [p.x + lado * p.medio, p.brazo, q.x + lado * q.medio, q.brazo];
      const panza = Math.hypot(x1 - x0, y1 - y0) * 0.1;
      const [mx, my] = [(x0 + x1) / 2, (y0 + y1) / 2 + panza * 2];
      cables += trazo(`M${f(x0)} ${f(y0)} Q${f(mx)} ${f(my)} ${f(x1)} ${f(y1)}`, C.hondo, 0.7 + p.cerca * 1.6, 0.9);
      if (lado < 0) continue;
      for (let u = 0.1; u < 0.95; u += 0.04 + rnd() * 0.07) {
        const tam = p.cerca * (1 - u) + q.cerca * u;
        const [cx, cy] = [(1 - u) ** 2 * x0 + 2 * u * (1 - u) * mx + u * u * x1, (1 - u) ** 2 * y0 + 2 * u * (1 - u) * my + u * u * y1];
        if (cy > 0) cables += carambanos(rnd, cx, cy + 0.6, 1 + Math.floor(rnd() * 3), 3 + tam * 20, 0.75);
      }
    }
  });
  // La caja del primer poste: una pantalla que sigue prendida, y el led.
  const p0 = palos[0]!;
  const cajaPrendida =
    // La caja tiñe: verde agua en la nieve y en los copos que le pasan por delante, y el rojo del led al pie.
    nube(p0.x + 26, 486, 120, 74, C.lente, 'xl', 0.46) + nube(p0.x + 14, 420, 60, 50, C.lente, 'xl', 0.3) + nube(p0.x + 4, 452, 24, 10, C.rojo, 'l', 0.4) +
    tenidos(rnd, p0.x + 20, 440, 86, 80, 40, C.lente) +
    forma(caja(p0.x - 4, 398, 36, 50), C.hondo) + forma(caja(p0.x + 1, 404, 26, 18), C.lente, 0.9) +
    trazo(`M${p0.x + 1} 409 l26 0 M${p0.x + 1} 414 l26 0 M${p0.x + 1} 419 l26 0`, C.hondo, 1, 0.4) +
    trazo(`M${p0.x + 4} 417 l5 -6 l4 4 l5 -8 l6 5`, C.hondo, 1.2, 0.75) +
    forma(circulo(p0.x + 6, 434, 2.2), C.rojo) + nube(p0.x + 6, 434, 5, 5, C.rojo, 'xs', 0.5) +
    [0, 1, 2].map((i) => forma(circulo(p0.x + 15 + i * 6, 434, 1.6), C.claro)).join('') +
    soplo(`M${p0.x - 7} 400 Q${p0.x + 12} 388 ${p0.x + 35} 400 L${p0.x + 35} 402 L${p0.x - 7} 402 Z`, C.nieve, 'xs', 0.9) +
    carambanos(rnd, p0.x - 1, 448, 5, 13, 0.8);
  // Cuarta vuelta: la nevada que pasa por delante de lo prendido agarra su color. Copos verde agua alrededor de la
  // tele grande (va con el piso, en 1200) y de la tele chica; van quietos, impresos: son los que la luz alcanza.
  const nevadaTenida = tenidos(rnd, CYBER.tele.x * (2400 / 900), CYBER.tele.pantalla.y, 250, 200, 130, C.lente) + tenidos(rnd, CYBER.teleChica.x * (2400 / 900), CYBER.teleChica.piso - 50, 90, 70, 34, C.lente);
  return `<g filter="url(#rociado)">${huella}${cables}${postes}${cajaPrendida}${charcoDeHielo()}${muneco()}${nevadaTenida}</g>`;
}

/* ------------------------------------------------------------------
   El coloso
   ------------------------------------------------------------------ */

/** El coloso: dónde camina, en lo lejano. A la izquierda de donde esperan los camellos, y por arriba de sus cabezas. */
export const COLOSO = { caja: [620, 160, 96, 176] as const } as const;

/**
 * Algo enorme que camina en el blanco: tres patas de fierro quebradas, un plato por cabeza y un ojo
 * rojo. Apenas más oscuro que la ventisca, y con los pies ya comidos por ella: se adivina, no se ve.
 */
function coloso(): string {
  const [x0, y0, w, h] = COLOSO.caja;
  const [x, y] = [x0 + 50, y0 + 34];
  const pie = y0 + h;
  const patas = `M${x - 6} ${y + 10} L${x - 26} ${y + 70} L${x - 34} ${pie} M${x} ${y + 12} L${x + 8} ${y + 78} L${x + 2} ${pie} M${x + 6} ${y + 10} L${x + 30} ${y + 62} L${x + 38} ${pie}`;
  return (
    `<g filter="url(#rociado)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${C.negro}" fill-opacity="0"/>` +
    // Segunda vuelta: más oscuro (a 0,62 no se lo adivinaba: no se lo veía) y lejos de la pared de teles.
    `<g opacity="0.92">` +
    trazo(patas, C.acero, 4.6) +
    forma(circulo(x - 26, y + 70, 3.4) + circulo(x + 8, y + 78, 3.4) + circulo(x + 30, y + 62, 3.4), C.acero) +
    forma(`M${x - 30} ${y + 4} Q${x} ${y - 12} ${x + 30} ${y + 4} Q${x} ${y + 16} ${x - 30} ${y + 4} Z`, C.acero) +
    forma(`M${x - 12} ${y - 3} Q${x} ${y - 20} ${x + 12} ${y - 3} Z`, C.acero) +
    trazo(`M${x - 4} ${y - 12} L${x - 14} ${y - 32} M${x + 2} ${y - 13} L${x + 4} ${y - 26}`, C.acero, 1.6) +
    soplo(`M${x - 28} ${y + 1} Q${x} ${y - 13} ${x + 28} ${y + 1} L${x + 24} ${y} Q${x} ${y - 9} ${x - 24} ${y} Z`, C.nieve, 'xs', 0.7) +
    `</g>` +
    // Los pies, tragados por la ventisca.
    nube(x, pie - 2, 46, 13, C.nieve, 'l', 0.5) +
    nube(x + 9, y + 5, 13, 11, C.rojo, 'm', 0.5) + forma(circulo(x + 9, y + 5, 1.8), C.rojo) +
    `</g>`
  );
}

/** Las piezas sueltas de Cybersiberia larga: el coloso que asoma y el charco de hielo, fino, para la lupa. */
export const PIEZAS_DE_LA_TUNDRA: readonly Pieza[] = [
  { nombre: 'camino-cyber-coloso', caja: COLOSO.caja, dibujo: coloso(), densidad: 2.5 },
  {
    nombre: 'fino-cyber-hielo',
    caja: HIELO.caja,
    dibujo: `<g filter="url(#rociado)"><rect x="${HIELO.caja[0]}" y="${HIELO.caja[1]}" width="${HIELO.caja[2]}" height="${HIELO.caja[3]}" fill="${C.negro}" fill-opacity="0"/>${charcoDeHielo()}</g>`,
    densidad: 4,
  },
  {
    nombre: 'fino-cyber-muneco',
    caja: MUNECO.caja,
    dibujo: `<g filter="url(#rociado)"><rect x="${MUNECO.caja[0]}" y="${MUNECO.caja[1]}" width="${MUNECO.caja[2]}" height="${MUNECO.caja[3]}" fill="${C.negro}" fill-opacity="0"/>${muneco()}</g>`,
    densidad: 5,
  },
];
