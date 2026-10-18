/**
 * Los seis entornos de la octava vuelta (`D-73`), a aerógrafo: el galpón de Patricio Rey, el
 * árbol del gran bonete, Cybersiberia, los astilleros, la mesa servida y la ruta del último bondi.
 *
 * Pedido del usuario: *"Armá un fondo bien rocambole para cada uno de los entornos del bestiario
 * redondo [...] un entorno adecuado para cada parte del mapa."* Cada entorno se pinta con la técnica
 * y la paleta de la tapa de su disco (`D-19`), medidas en las tapas reales:
 *
 * - **El galpón** es la noche de *En directo*: la luz roja que revienta arriba a la derecha y la
 *   gente impresa en trama de puntos, de espaldas, mirando una silla vacía.
 * - **El árbol** es *Luzbelito*: la llanura roja bajo el cielo violeta del interior del disco, con
 *   los huevos de plata, y un árbol hecho del mármol verde del frente, con el marco de cobre colgado.
 * - **Cybersiberia** es *Último bondi*: el cielo es la chapa remachada de la tapa, con las pistas de
 *   circuito en relieve, y la tele es el ojo de buey, prendida en la nieve.
 * - **Los astilleros** son la contratapa del disco 2 de *Cordero atado*: tiza azul sobre lo oscuro,
 *   los espirales, y los containers en el naranja del frente.
 * - **La mesa** es *La mosca y la sopa*: un collage de papel rasgado sobre el rojo de la tapa, la
 *   foto del escenario con su seguidor, que se escapa de la foto y cae en la olla de la contratapa.
 * - **La ruta** es el surco del disco: el asfalto es vinilo, y en el horizonte se recorta el mundo
 *   redondo entero. Los fierros pasan pintados, y el último bondi es de chapa remachada.
 *
 * Cada entorno tiene tres capas que reciben `(ancho, alto)`: lo lejano (opaco, ambiente), el piso
 * (con los hitos) y lo de adelante (con huecos). El recinto las imprime a 900; el camino (`camino.ts`)
 * las puede pedir más anchas, y lo sembrado se siembra a lo ancho. La geometría vive en
 * `rig-entornos.ts`. Los colores se nombran por token: acá no vive ni un hex (`diseno-marca.md`).
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import {
  ALTO, ANCHO, ARBOL, ASTILLERO, COSAS_DE_CYBERSIBERIA, COSAS_DE_LOS_ASTILLEROS, CYBER, GALPON, OJOS_DE_CYBERSIBERIA,
  COSAS_DE_LA_MESA, FIERROS, MESA, OJOS_DE_LA_MESA, OJOS_DE_LA_RUTA, OJOS_DE_LOS_ASTILLEROS, OJOS_DEL_ARBOL, RUTA,
} from './rig-entornos.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/* ------------------------------------------------------------------
   Las herramientas que no estaban en el aerógrafo
   ------------------------------------------------------------------ */

type Punto = readonly [number, number];

/** Un círculo como camino, para juntar varios en una sola máscara. */
const circulo = (x: number, y: number, r: number): string =>
  `M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0 Z`;

/** Una elipse como camino. */
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

/** Un polígono como camino. */
const poli = (ps: readonly Punto[]): string => `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;

/** Un rectángulo como camino. */
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)} h${f(w)} v${f(h)} h${f(-w)} Z`;

/**
 * La trama de puntos de la imprenta: cada punto crece con la luz que le toca. Es la de *En
 * directo*, la tapa que es una foto de la gente impresa en trama gruesa.
 */
function trama(x0: number, y0: number, x1: number, y1: number, paso: number, luz: (x: number, y: number) => number, color: string, o = 1): string {
  let s = '';
  for (let y = y0, fila = 0; y < y1; y += paso * 0.87, fila++) {
    for (let x = x0 + (fila % 2) * paso * 0.5; x < x1; x += paso) {
      const r = paso * 0.58 * Math.sqrt(Math.max(0, Math.min(1, luz(x, y))));
      if (r > 0.4) s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
    }
  }
  return `<g fill="${color}"${o < 1 ? ` opacity="${f(o)}"` : ''}>${s}</g>`;
}

/** Un brillo de cuatro puntas, soplado: la purpurina, el vidrio, la estrella que pica. */
function chispa(x: number, y: number, r: number, color: string, o = 1): string {
  const d = `M${f(x)} ${f(y - r)} Q${f(x + r * 0.12)} ${f(y - r * 0.12)} ${f(x + r)} ${f(y)} Q${f(x + r * 0.12)} ${f(y + r * 0.12)} ${f(x)} ${f(y + r)} Q${f(x - r * 0.12)} ${f(y + r * 0.12)} ${f(x - r)} ${f(y)} Q${f(x - r * 0.12)} ${f(y - r * 0.12)} ${f(x)} ${f(y - r)} Z`;
  return nube(x, y, r * 0.5, r * 0.5, color, 's', o * 0.6) + forma(d, color, o);
}

/** El cielo con estrellas: muchas chicas, pocas grandes y sopladas. */
function estrellas(x0: number, y0: number, x1: number, y1: number, cuantas: number, color: string, semilla: number): string {
  const rnd = azar(semilla);
  let chicas = '';
  let grandes = '';
  for (let i = 0; i < cuantas; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * rnd() * (y1 - y0);
    const t = rnd();
    if (t > 0.97) grandes += chispa(x, y, 4 + rnd() * 4, color, 0.8);
    else chicas += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + t * 1.1)}" opacity="${f(0.25 + t * 0.6)}"/>`;
  }
  return `<g fill="${color}">${chicas}</g>${grandes}`;
}

/**
 * El borde rasgado de un papel pegado: cada lado se parte en pedazos chicos y cada pedazo se
 * corre un poco para adentro o para afuera. Es el collage de la contratapa de *La mosca y la sopa*.
 */
function rasgado(ps: readonly Punto[], amplitud: number, semilla: number, paso = 7): string {
  const rnd = azar(semilla);
  const salida: Punto[] = [];
  for (let i = 0; i < ps.length; i++) {
    const [ax, ay] = ps[i]!;
    const [bx, by] = ps[(i + 1) % ps.length]!;
    const largo = Math.hypot(bx - ax, by - ay);
    const n = Math.max(1, Math.round(largo / paso));
    const [nx, ny] = [(by - ay) / largo, -(bx - ax) / largo];
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const j = (rnd() - 0.5) * 2 * amplitud;
      salida.push([ax + (bx - ax) * t + nx * j, ay + (by - ay) * t + ny * j]);
    }
  }
  return poli(salida);
}

/**
 * Las vetas del mármol del frente de *Luzbelito*: líneas que se dejan llevar por un remolino y se
 * enroscan. Unas sopladas, que son el fondo de la piedra, y otras finas encima.
 */
function vetas(x0: number, y0: number, x1: number, y1: number, cuantas: number, colores: readonly string[], semilla: number, largo = 170): string {
  const rnd = azar(semilla);
  let sopladas = '';
  let finas = '';
  for (let i = 0; i < cuantas; i++) {
    let x = x0 + rnd() * (x1 - x0);
    let y = y0 + rnd() * (y1 - y0);
    const fase = rnd() * 6.3;
    let d = `M${f(x)} ${f(y)}`;
    const pasos = Math.round((largo * (0.5 + rnd())) / 4);
    for (let k = 0; k < pasos; k++) {
      const a = Math.sin(x * 0.012 + fase) * 1.7 + Math.cos(y * 0.016 - fase * 0.6) * 1.5 + Math.sin((x + y) * 0.005 + fase) * 1.1;
      x += Math.cos(a) * 4;
      y += Math.sin(a) * 4;
      d += ` L${f(x)} ${f(y)}`;
    }
    const color = colores[i % colores.length]!;
    if (i % 3 === 0) sopladas += trazo(d, color, 5 + rnd() * 9, 0.3 + rnd() * 0.3);
    else finas += trazo(d, color, 0.7 + rnd() * 2.2, 0.25 + rnd() * 0.55);
  }
  return `<g filter="url(#soplo-s)">${sopladas}</g>${finas}`;
}

/* ------------------------------------------------------------------
   El galpón de Patricio Rey, en el rojo tramado de *En directo*
   ------------------------------------------------------------------
   Un galpón de chapa de noche, con las cabriadas recortadas contra una luz roja que revienta
   arriba a la derecha, como en la tapa de *En directo*. De fondo del escenario cuelga un disco; en
   el tablado, una silla vacía bajo el seguidor, la fuente de buñuelos y la bestia pop, que brilla.
   Adelante, la gente de espaldas, impresa en trama de puntos, con una bengala.
*/

const G = {
  noche: 'var(--entorno-galpon-noche)',
  rojo: 'var(--entorno-galpon-rojo)',
  brasa: 'var(--entorno-galpon-brasa)',
  luz: 'var(--entorno-galpon-luz)',
  vivo: 'var(--marca-rojo)',
  negro: 'var(--fondo)',
  oro: 'var(--acento-2)',
  papel: 'var(--papel)',
  madera: 'var(--disco-luzbelito-tinta)',
  maderaHonda: 'var(--disco-luzbelito-apoyo)',
};

/** Cuánta luz roja le llega a un punto, desde el reflector de atrás. */
function luzDelGalpon(ancho: number): (x: number, y: number) => number {
  const lx = GALPON.luz.x * (ancho / ANCHO);
  const ly = GALPON.luz.y;
  return (x, y) => Math.exp(-Math.hypot(x - lx, (y - ly) * 1.25) / 230) * 1.5 - 0.1;
}

/** Un trapo colgado de dos clavos, con franjas, que se comba en el medio. Sin letras. */
function trapo(x0: number, x1: number, y: number, comba: number, alto: number, franjas: readonly string[], id: string, semilla: number): string {
  const rnd = azar(semilla);
  const borde = (dy: number, extra: number): string => `${f(x0)} ${f(y + dy)} Q${f((x0 + x1) / 2)} ${f(y + dy + (comba + extra) * 2)} ${f(x1)} ${f(y + dy)}`;
  const silueta = `M${borde(0, 0)} L${f(x1 + 2)} ${f(y + alto)} Q${f((x0 + x1) / 2)} ${f(y + alto + (comba + 8) * 2)} ${f(x0 - 2)} ${f(y + alto)} Z`;
  const h = alto / franjas.length;
  let bandas = '';
  franjas.forEach((color, i) => {
    bandas += forma(`M${borde(i * h, i * 2)} L${f(x1 + 2)} ${f(y + (i + 1) * h)} Q${f((x0 + x1) / 2)} ${f(y + (i + 1) * h + (comba + (i + 1) * 2) * 2)} ${f(x0 - 2)} ${f(y + (i + 1) * h)} Z`, color);
  });
  // Los pliegues: sombras sopladas que bajan, donde la tela se junta.
  let pliegues = '';
  for (let x = x0 + 14; x < x1 - 8; x += 22 + rnd() * 26) pliegues += nube(x, y + alto / 2 + comba, 5 + rnd() * 6, alto * 0.8, G.negro, 'm', 0.45);
  return (
    trazo(`M${f(x0)} ${f(y)} l-6 -22 M${f(x1)} ${f(y)} l6 -22`, G.negro, 2) +
    enmascarado(id, silueta, bandas + pliegues + nube(x1, y, (x1 - x0) * 0.6, alto, G.rojo, 'xl', 0.25))
  );
}

function galponLejos(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const luz = luzDelGalpon(ancho);
  const { x: lx, y: ly } = { x: GALPON.luz.x * k, y: GALPON.luz.y };
  const fondoDelTablado = GALPON.tablado.fondo;

  // La chapa de la pared del fondo: costillas verticales, que la luz roja prende de a poco.
  let chapa = '';
  for (let x = 4; x < ancho; x += 15) {
    const i = Math.max(0, luz(x, 190));
    chapa += trazo(`M${f(x)} 60 L${f(x)} ${fondoDelTablado}`, G.brasa, 4, 0.12 + i * 0.6) + trazo(`M${f(x + 6)} 60 L${f(x + 6)} ${fondoDelTablado}`, G.negro, 3, 0.7);
  }

  // Las cabriadas: dos cordones y la diagonal en zigzag, recortadas negras contra el rojo.
  let cabriadas = trazo(`M-10 18 L${ancho + 10} 18 M-10 76 L${ancho + 10} 76`, G.negro, 7);
  for (let x = -10, n = 0; x < ancho + 10; x += 46, n++) cabriadas += trazo(`M${f(x)} ${n % 2 ? 18 : 76} L${f(x + 46)} ${n % 2 ? 76 : 18}`, G.negro, 4.5);
  for (let x = 120 * k; x < ancho; x += 300 * k) cabriadas += trazo(`M${f(x)} 76 L${f(x)} 104`, G.negro, 3) + forma(caja(x - 16, 104, 32, 12, ), G.negro);

  // Los haces: polvo prendido por el reflector, que baja en diagonal hacia el tablado.
  const rnd = azar(71);
  let haces = '';
  for (let i = 0; i < 6; i++) {
    const a = 2.25 + rnd() * 0.5;
    const largo = 520 + rnd() * 260;
    const abre = 0.035 + rnd() * 0.04;
    haces += soplo(poli([[lx, ly], [lx + Math.cos(a - abre) * largo, ly + Math.sin(a - abre) * largo], [lx + Math.cos(a + abre) * largo, ly + Math.sin(a + abre) * largo]]), G.rojo, 'm', 0.16 + rnd() * 0.12);
  }

  // El disco colgado de fondo: los surcos, y el brillo rojo que les pega de costado.
  const { x: dx0, y: dy, r: dr } = GALPON.disco;
  const dx = dx0 * k;
  let surcos = '';
  for (let r = 40; r < dr - 3; r += 3.2) surcos += `<circle cx="${f(dx)}" cy="${dy}" r="${f(r)}" fill="none" stroke="${G.brasa}" stroke-width="0.7" opacity="${f(0.25 + ((r * 7) % 5) / 14)}"/>`;
  const brilloDelDisco =
    soplo(`M${f(dx)} ${dy} L${f(dx + dr * 1.2)} ${f(dy - dr * 0.9)} L${f(dx + dr * 1.3)} ${f(dy - dr * 0.1)} Z`, G.rojo, 'm', 0.55) +
    soplo(`M${f(dx)} ${dy} L${f(dx - dr * 1.2)} ${f(dy + dr * 0.9)} L${f(dx - dr * 1.3)} ${f(dy + dr * 0.1)} Z`, G.brasa, 'm', 0.5);
  const disco =
    trazo(`M${f(dx - 70)} 76 L${f(dx - 60)} ${f(dy - dr + 20)} M${f(dx + 70)} 76 L${f(dx + 60)} ${f(dy - dr + 20)}`, G.negro, 2) +
    enmascarado('g-disco', circulo(dx, dy, dr), forma(circulo(dx, dy, dr), G.negro) + surcos + brilloDelDisco + nube(dx - 30, dy + 40, 90, 70, G.negro, 'l', 0.5)) +
    enmascarado('g-etiqueta', circulo(dx, dy, 34), forma(circulo(dx, dy, 34), G.vivo) + nube(dx - 14, dy + 16, 30, 24, G.brasa, 'm', 0.8) + nube(dx + 10, dy - 12, 12, 10, G.luz, 's', 0.35)) +
    forma(circulo(dx, dy, 4), G.negro);

  const trapos =
    trapo(18 * k, 238 * k, 196, 14, 54, [G.negro, G.vivo, G.papel, G.vivo, G.negro], 'g-trapo-1', 3) +
    trapo(652 * k, 884 * k, 206, 12, 48, [G.papel, G.negro, G.papel], 'g-trapo-2', 5);

  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${G.negro}"/>` +
    nube(ancho / 2, 200, ancho * 0.6, 200, G.noche, 'xl', 0.9) +
    nube(lx, ly, 330, 260, G.brasa, 'xl', 0.9) +
    nube(lx, ly, 170, 140, G.rojo, 'xl', 0.85) +
    // La trama de *En directo*: el rojo se imprime en puntos que crecen hacia la luz.
    trama(-10, -10, ancho + 10, fondoDelTablado + 10, 7, (x, y) => luz(x, y) * 0.85, G.rojo, 0.9) +
    nube(lx, ly, 70, 56, G.vivo, 'l', 0.9) +
    nube(lx, ly, 26, 22, G.luz, 'm') +
    // Del lado contrario a la luz, el galpón se hunde en lo oscuro.
    nube(0, 260, ancho * 0.35, 260, G.negro, 'xl', 0.6) +
    chapa +
    haces +
    cabriadas +
    trapos +
    disco +
    // Abajo, donde termina la pared, lo oscuro del tablado.
    `<rect x="-10" y="${fondoDelTablado}" width="${ancho + 20}" height="${alto - fondoDelTablado + 10}" fill="${G.negro}"/>` +
    `</g>`
  );
}

/** Una silla de madera, vacía, con la luz del seguidor desde arriba. `x` es el medio, `piso` las patas. */
function silla(x: number, piso: number): string {
  const asiento = piso - 34;
  const respaldo = asiento - 70;
  const patas =
    forma(caja(x - 34, asiento + 8, 6, piso - asiento - 8), G.madera) +
    forma(caja(x + 28, asiento + 8, 6, piso - asiento - 8), G.maderaHonda) +
    forma(caja(x - 26, asiento - 2, 4, piso - asiento - 8), G.maderaHonda) +
    forma(caja(x + 22, asiento - 2, 4, piso - asiento - 8), G.negro, 0.8);
  const travesanio = forma(caja(x - 32, piso - 16, 64, 4), G.maderaHonda);
  const tabla =
    forma(`M${f(x - 37)} ${f(asiento)} L${f(x - 28)} ${f(asiento - 10)} L${f(x + 32)} ${f(asiento - 10)} L${f(x + 37)} ${f(asiento)} Z`, G.madera) +
    forma(caja(x - 37, asiento, 74, 8), G.maderaHonda);
  const espaldar =
    forma(caja(x - 28, respaldo, 6, asiento - respaldo - 8), G.madera) +
    forma(caja(x + 24, respaldo, 6, asiento - respaldo - 8), G.maderaHonda) +
    forma(`M${f(x - 32)} ${f(respaldo + 2)} Q${f(x)} ${f(respaldo - 8)} ${f(x + 34)} ${f(respaldo + 2)} L${f(x + 34)} ${f(respaldo + 14)} Q${f(x)} ${f(respaldo + 4)} ${f(x - 32)} ${f(respaldo + 14)} Z`, G.madera) +
    [-12, 0, 12].map((dx) => forma(caja(x + dx - 2, respaldo + 12, 5, asiento - respaldo - 22), G.maderaHonda)).join('');
  // La luz de arriba: el filo de cada tabla que mira al techo, y el lado de la sombra.
  const luz =
    nube(x, asiento - 7, 30, 3, G.papel, 's', 0.55) +
    nube(x, respaldo + 2, 30, 3, G.papel, 's', 0.5) +
    nube(x + 30, asiento + 20, 8, 30, G.negro, 'm', 0.5);
  return (
    nube(x + 4, piso + 2, 52, 7, G.negro, 's', 0.7) +
    `<g filter="url(#grano)">${patas}${travesanio}${espaldar}${tabla}${luz}</g>`
  );
}

/** La mesita con la fuente de buñuelos, los redonditos de ricota, espolvoreados de azúcar. */
function fuenteDeBunuelos(x: number, piso: number): string {
  const tapa = piso - 40;
  let bunuelos = '';
  const rnd = azar(19);
  const pila: Array<[number, number, number]> = [];
  for (const [fila, n] of [[0, 5], [1, 4], [2, 3], [3, 1]] as const) {
    for (let i = 0; i < n; i++) pila.push([x + (i - (n - 1) / 2) * 11, tapa - 8 - fila * 9, 7 + rnd() * 1.2]);
  }
  for (const [bx, by, r] of pila) {
    bunuelos += enmascarado(`g-bunuelo-${Math.round(bx)}-${Math.round(by)}`, circulo(bx, by, r),
      forma(circulo(bx, by, r), G.madera) + nube(bx + r * 0.4, by + r * 0.4, r * 0.8, r * 0.7, G.maderaHonda, 's', 0.9) + nube(bx - r * 0.3, by - r * 0.4, r * 0.5, r * 0.4, G.oro, 's', 0.8));
    for (let s = 0; s < 4; s++) bunuelos += `<circle cx="${f(bx - r * 0.5 + rnd() * r)}" cy="${f(by - r * 0.7 + rnd() * r * 0.6)}" r="0.9" fill="${G.papel}" opacity="0.85"/>`;
  }
  return (
    nube(x + 3, piso + 2, 30, 5, G.negro, 's', 0.7) +
    forma(elipse(x, piso - 2, 18, 4), G.maderaHonda) +
    forma(caja(x - 3, tapa, 6, piso - tapa - 2), G.maderaHonda) +
    forma(elipse(x, tapa, 32, 7), G.madera) +
    nube(x - 8, tapa - 2, 20, 3, G.papel, 's', 0.4) +
    forma(elipse(x, tapa - 3, 30, 6), G.papel) +
    nube(x + 8, tapa - 1, 22, 4, G.maderaHonda, 's', 0.5) +
    bunuelos
  );
}

/**
 * La bestia pop: un bicho grande, encorvado, con los brazos largos hasta el piso y sin cara fija.
 * Brilla: lentejuelas adentro, el canto prendido por el reflector y un halo afuera.
 */
function bestiaPop(x: number, piso: number, alto: number): string {
  const a = alto;
  const p = (dx: number, dy: number): string => `${f(x + dx * a)} ${f(piso - dy * a)}`;
  const cuerpo =
    `M${p(-0.6, 0)} C${p(-0.64, 0.2)} ${p(-0.62, 0.5)} ${p(-0.46, 0.7)} ` +
    `C${p(-0.38, 0.8)} ${p(-0.26, 0.82)} ${p(-0.15, 0.84)} C${p(-0.2, 0.96)} ${p(-0.14, 1.1)} ${p(0.02, 1.1)} ` +
    `C${p(0.18, 1.1)} ${p(0.22, 0.96)} ${p(0.16, 0.84)} C${p(0.27, 0.82)} ${p(0.38, 0.8)} ${p(0.46, 0.7)} ` +
    `C${p(0.6, 0.5)} ${p(0.62, 0.2)} ${p(0.6, 0)} L${p(0.45, 0)} C${p(0.46, 0.2)} ${p(0.42, 0.36)} ${p(0.31, 0.46)} ` +
    `C${p(0.31, 0.3)} ${p(0.29, 0.12)} ${p(0.27, 0)} L${p(0.06, 0)} L${p(0.02, 0.16)} L${p(-0.04, 0)} L${p(-0.27, 0)} ` +
    `C${p(-0.29, 0.12)} ${p(-0.31, 0.3)} ${p(-0.31, 0.46)} C${p(-0.42, 0.36)} ${p(-0.46, 0.2)} ${p(-0.45, 0)} Z`;
  const rnd = azar(43);
  let lentejuelas = '';
  for (let i = 0; i < 70; i++) {
    const px = x - a * 0.6 + rnd() * a * 1.2;
    const py = piso - rnd() * a;
    lentejuelas += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(0.8 + rnd() * 2)}" fill="${rnd() < 0.5 ? G.oro : G.papel}" opacity="${f(0.25 + rnd() * 0.6)}"/>`;
  }
  let chispas = '';
  for (let i = 0; i < 8; i++) {
    const ang = rnd() * Math.PI * 2;
    const d = a * (0.6 + rnd() * 0.2);
    chispas += chispa(x + Math.cos(ang) * d * 0.85, piso - a * 0.55 + Math.sin(ang) * d * 0.7, 3 + rnd() * 6, rnd() < 0.6 ? G.oro : G.papel, 0.85);
  }
  // El canto que mira al reflector: el hombro y el brazo derechos, prendidos.
  const canto = `M${p(0.14, 0.92)} C${p(0.26, 0.86)} ${p(0.38, 0.84)} ${p(0.46, 0.72)} C${p(0.6, 0.5)} ${p(0.62, 0.2)} ${p(0.6, 0)} L${p(0.53, 0)} C${p(0.55, 0.22)} ${p(0.52, 0.48)} ${p(0.4, 0.66)} C${p(0.32, 0.76)} ${p(0.22, 0.8)} ${p(0.12, 0.84)} Z`;
  return (
    nube(x, piso - a * 0.5, a * 0.75, a * 0.62, G.oro, 'xl', 0.12) +
    nube(x + a * 0.2, piso - a * 0.5, a * 0.6, a * 0.55, G.rojo, 'xl', 0.2) +
    nube(x, piso + 2, a * 0.66, 7, G.negro, 's', 0.8) +
    enmascarado('g-bestia-pop', cuerpo,
      forma(cuerpo, G.negro) +
      trama(x - a * 0.7, piso - a * 1.05, x + a * 0.7, piso, 5, (px, py) => 0.05 + ((px - x) / a) * 0.8 + ((piso - py) / a) * 0.35, G.rojo, 0.7) +
      nube(x - a * 0.25, piso - a * 0.35, a * 0.3, a * 0.5, G.negro, 'l', 0.75) +
      lentejuelas +
      soplo(canto, G.oro, 's', 0.55) +
      soplo(canto, G.vivo, 'm', 0.35)) +
    chispas
  );
}

/** Un bafle sobre el tablado: la caja negra y la tela de la reja, con el canto prendido. */
function bafle(x: number, piso: number, w: number, h: number, id: string): string {
  return enmascarado(id, caja(x, piso - h, w, h),
    forma(caja(x, piso - h, w, h), G.negro) +
    trama(x + 8, piso - h + 8, x + w - 8, piso - 8, 4.2, () => 0.32, G.noche) +
    nube(x + w, piso - h, w * 0.5, h * 0.4, G.rojo, 'l', 0.4) +
    trazo(caja(x + 3, piso - h + 3, w - 6, h - 6), G.brasa, 2, 0.7));
}

function galponPiso(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const { fondo, borde } = GALPON.tablado;
  const s = GALPON.silla;
  const sx = s.x * k;
  let tablas = '';
  for (let y = fondo + 9; y < borde; y += 9 + (y - fondo) * 0.06) {
    tablas += trazo(`M-10 ${f(y)} L${ancho + 10} ${f(y)}`, G.negro, 1.6, 0.8) + trazo(`M-10 ${f(y + 1.6)} L${ancho + 10} ${f(y + 1.6)}`, G.brasa, 1, 0.35);
  }
  const rnd = azar(57);
  let cables = '';
  for (let i = 0; i < 4; i++) {
    const x0 = rnd() * ancho;
    cables += trazo(`M${f(x0)} ${f(fondo + 16)} C${f(x0 + 80)} ${f(fondo + 40 + rnd() * 30)} ${f(x0 - 60)} ${f(borde - 20)} ${f(x0 + 40 + rnd() * 80)} ${f(borde + 2)}`, G.negro, 2.4, 0.9);
  }
  return (
    `<g filter="url(#rociado)">` +
    // El tablado: tablas de madera vieja, más anchas cuanto más cerca, y el canto que da a la gente.
    forma(caja(-10, fondo, ancho + 20, borde - fondo), G.noche) +
    nube(ancho * 0.7, fondo, ancho * 0.5, 30, G.rojo, 'l', 0.35) +
    tablas +
    nube(ancho / 2, fondo + 4, ancho * 0.7, 8, G.negro, 'm', 0.7) +
    forma(caja(-10, borde, ancho + 20, alto - borde + 10), G.negro) +
    trazo(`M-10 ${borde} L${ancho + 10} ${borde}`, G.rojo, 2.4, 0.55) +
    cables +
    bafle(96 * k, fondo + 22, 104, 86, 'g-bafle-1') +
    bafle(706 * k, fondo + 22, 104, 86, 'g-bafle-2') +
    // El seguidor: un cono de luz pálida que cae de arriba sobre la silla.
    soplo(poli([[sx - 26, -20], [sx + 26, -20], [sx + 112, s.piso + 6], [sx - 112, s.piso + 6]]), G.luz, 'l', 0.13) +
    nube(sx, s.piso + 2, 112, 18, G.luz, 'm', 0.5) +
    nube(sx, s.piso + 2, 60, 9, G.papel, 's', 0.35) +
    `</g>` +
    bestiaPop(GALPON.bestiaPop.x * k, GALPON.bestiaPop.piso, GALPON.bestiaPop.alto) +
    silla(sx, s.piso) +
    fuenteDeBunuelos(GALPON.fuente.x * k, GALPON.fuente.piso)
  );
}

/**
 * La gente: cabezas y hombros de espaldas, puños arriba, impresos en la trama roja de *En
 * directo*. Va en grupos, con huecos, y una bengala prendida que tiñe a los de al lado.
 */
function galponFrente(ancho = ANCHO, alto = ALTO): string {
  const rnd = azar(97);
  const bengala = { x: ancho - 150 * (ancho / ANCHO), y: GALPON.gente - 56 };
  let silueta = '';
  let x = -20;
  while (x < ancho + 20) {
    const grupo = 3 + Math.floor(rnd() * 5);
    for (let i = 0; i < grupo && x < ancho + 20; i++) {
      const cy = GALPON.gente + 36 + rnd() * 46;
      const rx = 15 + rnd() * 6;
      const ry = rx * 1.18;
      silueta += elipse(x, cy, rx, ry);
      silueta += `M${f(x - rx * 2.4)} ${alto + 10} C${f(x - rx * 2.3)} ${f(cy + ry * 1.2)} ${f(x - rx * 1.2)} ${f(cy + ry * 0.7)} ${f(x)} ${f(cy + ry * 0.8)} C${f(x + rx * 1.2)} ${f(cy + ry * 0.7)} ${f(x + rx * 2.3)} ${f(cy + ry * 1.2)} ${f(x + rx * 2.4)} ${alto + 10} Z`;
      if (rnd() < 0.3) {
        // Un brazo arriba, con el puño cerrado.
        const lado = rnd() < 0.5 ? -1 : 1;
        const hx = x + lado * rx * 1.4;
        const hy = cy + ry;
        const px = hx + lado * (6 + rnd() * 16);
        const py = GALPON.gente - 46 + rnd() * 40;
        silueta += poli([[hx - 9, hy], [hx + 9, hy], [px + 7, py + 4], [px - 7, py + 4]]) + elipse(px, py, 8, 9);
      }
      x += rx * 2.1 + rnd() * 10;
    }
    x += 30 + rnd() * 90;
  }
  silueta += poli([[bengala.x - 16, GALPON.gente + 64], [bengala.x + 2, GALPON.gente + 64], [bengala.x + 4, bengala.y + 30], [bengala.x - 10, bengala.y + 30]]) + elipse(bengala.x - 3, bengala.y + 30, 8, 9);
  const luz = luzDelGalpon(ancho);
  const brilla = (px: number, py: number): number =>
    (0.16 + Math.max(luz(px, py) * 1.3, Math.exp(-Math.hypot(px - bengala.x, py - bengala.y) / 110))) * (1.2 - (1.3 * (py - GALPON.gente)) / (alto - GALPON.gente));
  return (
    `<g filter="url(#rociado)">` +
    nube(bengala.x, bengala.y, 150, 110, G.vivo, 'xl', 0.35) +
    enmascarado('g-gente', silueta, forma(silueta, G.negro) + trama(-20, GALPON.gente - 40, ancho + 20, alto + 10, 6, brilla, G.rojo, 0.95)) +
    // La bengala: el brazo que la levanta, el palito, la llama blanca de tan roja y el humo que sube.
    trazo(`M${f(bengala.x - 3)} ${f(bengala.y + 26)} L${f(bengala.x)} ${f(bengala.y)}`, G.negro, 3) +
    nube(bengala.x + 30, bengala.y - 90, 46, 70, G.brasa, 'xl', 0.4) +
    nube(bengala.x + 70, bengala.y - 150, 60, 70, G.noche, 'xl', 0.45) +
    nube(bengala.x, bengala.y, 22, 24, G.vivo, 'm') +
    nube(bengala.x, bengala.y, 7, 8, G.papel, 's') +
    estrellas(bengala.x - 40, bengala.y - 40, bengala.x + 40, bengala.y + 30, 30, G.oro, 101) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El árbol del gran bonete, en el mármol y la llanura roja de *Luzbelito*
   ------------------------------------------------------------------
   El interior de *Luzbelito* es una llanura roja con huevos de plata bajo un cielo violeta de
   nubes prendidas, y el frente es papel marmolado verde con un marco ovalado de cobre. El árbol
   más alto del mundo redondo está hecho de ese mármol, plantado en esa llanura, y del marco de
   cobre cuelga vacío de una rama: adentro es de noche aunque afuera no. En la copa están los
   nidos, el fruto raro y, arriba de todo, el señor de los cielos afilando.
*/

const A = {
  marmol: 'var(--entorno-arbol-marmol)',
  hondo: 'var(--entorno-arbol-marmol-hondo)',
  claro: 'var(--entorno-arbol-marmol-claro)',
  veta: 'var(--entorno-arbol-veta)',
  cobre: 'var(--entorno-arbol-cobre)',
  cobreHondo: 'var(--entorno-arbol-cobre-hondo)',
  tierra: 'var(--entorno-arbol-tierra)',
  tierraHonda: 'var(--entorno-arbol-tierra-honda)',
  tierraViva: 'var(--entorno-arbol-tierra-viva)',
  cielo: 'var(--entorno-arbol-cielo)',
  violeta: 'var(--entorno-arbol-violeta)',
  nube: 'var(--entorno-arbol-nube)',
  plata: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  papel: 'var(--papel)',
  negro: 'var(--fondo)',
  oro: 'var(--acento-2)',
  rojo: 'var(--marca-rojo)',
};

/** Un nubarrón como los del interior del disco: panza oscura, lomo prendido por una luz baja. */
function nubarron(x: number, y: number, w: number, h: number, semilla: number): string {
  const rnd = azar(semilla);
  let cuerpo = '';
  let lomo = '';
  let panza = '';
  for (let i = 0; i < 8; i++) {
    const cx = x + (i / 7 - 0.5) * w + (rnd() - 0.5) * w * 0.1;
    const cy = y + (rnd() - 0.5) * h * 0.5;
    const rx = w * (0.12 + rnd() * 0.1);
    const ry = h * (0.35 + rnd() * 0.3);
    cuerpo += nube(cx, cy, rx, ry, A.nube, 'l', 0.75);
    lomo += nube(cx - rx * 0.2, cy - ry * 0.45, rx * 0.7, ry * 0.4, A.papel, 'l', 0.55);
    panza += nube(cx + rx * 0.1, cy + ry * 0.55, rx * 0.9, ry * 0.4, A.violeta, 'l', 0.8);
  }
  return cuerpo + panza + lomo;
}

/** Un huevo de plata de la tapa, apoyado en la tierra roja, con su sombra. */
function huevo(x: number, piso: number, r: number): string {
  return (
    nube(x + r * 0.5, piso, r * 1.3, r * 0.3, A.negro, 's', 0.6) +
    enmascarado(`a-huevo-${Math.round(x)}-${Math.round(piso)}`, elipse(x, piso - r * 1.1, r * 0.85, r * 1.1),
      forma(elipse(x, piso - r * 1.1, r * 0.85, r * 1.1), A.peltre) +
      nube(x + r * 0.4, piso - r * 0.6, r * 0.7, r * 0.8, A.tierraHonda, 's', 0.6) +
      nube(x - r * 0.25, piso - r * 1.45, r * 0.35, r * 0.4, A.plata, 's', 0.95) +
      nube(x - r * 0.3, piso - r * 1.55, r * 0.12, r * 0.14, A.papel, 'xs', 0.9))
  );
}

function arbolLejos(ancho = ANCHO, alto = ALTO): string {
  const h = ARBOL.horizonte;
  const rnd = azar(131);
  let manchas = '';
  for (let i = 0; i < 70; i++) {
    const y = h + Math.pow(rnd(), 1.4) * (alto - h);
    const hondo = (y - h) / (alto - h);
    manchas += nube(rnd() * ancho, y, 20 + hondo * 120, 3 + hondo * 14, rnd() < 0.5 ? A.tierraHonda : A.tierraViva, 'm', 0.5 + rnd() * 0.4);
  }
  let huevos = '';
  for (let i = 0; i < 9; i++) {
    const y = h + 8 + Math.pow(rnd(), 1.8) * 120;
    huevos += huevo(rnd() * ancho, y, 2 + (y - h) * 0.07);
  }
  let nubes = '';
  for (let x = 120, n = 0; x < ancho + 100; x += 300 + rnd() * 120, n++) nubes += nubarron(x, 70 + rnd() * 160, 260 + rnd() * 140, 60 + rnd() * 40, 7 + n);
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${A.cielo}"/>` +
    nube(ancho * 0.3, 120, ancho * 0.5, 160, A.violeta, 'xl', 0.8) +
    nubes +
    // La luz baja del horizonte, como en la tapa: el cielo se aclara justo donde termina la tierra.
    nube(ancho / 2, h - 20, ancho * 0.7, 46, A.nube, 'xl', 0.7) +
    nube(ancho / 2, h - 8, ancho * 0.6, 14, A.papel, 'l', 0.45) +
    forma(caja(-10, h, ancho + 20, alto - h + 10), A.tierra) +
    nube(ancho / 2, h + 10, ancho * 0.7, 18, A.tierraViva, 'l', 0.8) +
    manchas +
    huevos +
    `</g>`
  );
}

/** El tronco, las ramas y la copa de mármol: un solo contorno para que las vetas no se corten. */
function siluetaDelArbol(k: number): { tronco: string; copa: string } {
  const { x: tx0, pie, horqueta } = ARBOL.tronco;
  const tx = tx0 * k;
  const X = (x: number): string => f(tx + (x - 450));
  const tronco =
    `M${X(380)} ${pie + 4} C${X(410)} ${pie - 10} ${X(424)} ${pie - 34} ${X(424)} ${pie - 64} C${X(424)} ${pie - 130} ${X(416)} ${horqueta + 90} ${X(428)} ${horqueta} ` +
    `L${X(474)} ${horqueta} C${X(482)} ${horqueta + 90} ${X(476)} ${pie - 130} ${X(478)} ${pie - 64} C${X(478)} ${pie - 34} ${X(492)} ${pie - 10} ${X(524)} ${pie + 4} Z ` +
    `M${X(428)} 240 C${X(390)} 200 ${X(330)} 172 ${X(250)} 134 L${X(258)} 122 C${X(336)} 158 ${X(398)} 188 ${X(442)} 214 Z ` +
    `M${X(468)} 214 C${X(520)} 180 ${X(580)} 152 ${X(650)} 132 L${X(656)} 144 C${X(590)} 164 ${X(530)} 202 ${X(478)} 240 Z ` +
    `M${X(440)} 220 C${X(444)} 160 ${X(446)} 110 ${X(448)} 60 L${X(460)} 60 C${X(460)} 110 ${X(462)} 160 ${X(468)} 220 Z ` +
    `M${X(424)} 322 C${X(380)} 312 ${X(330)} 304 ${X(276)} 298 L${X(276)} 308 C${X(330)} 314 ${X(380)} 324 ${X(424)} 342 Z`;
  const copa = (
    [[450, 132, 92], [340, 152, 80], [562, 146, 84], [250, 178, 54], [652, 182, 54], [400, 98, 68], [506, 94, 70], [450, 190, 68], [300, 206, 40], [600, 214, 40]] as const
  ).map(([x, y, r]) => circulo(tx + (x - 450), y, r)).join(' ');
  return { tronco, copa };
}

/** Un nido tejido de ramitas, con los huevos de plata asomando. */
function nido(x: number, y: number): string {
  const rnd = azar(Math.round(x + y));
  let ramitas = '';
  for (let i = 0; i < 16; i++) {
    const a = x - 26 + rnd() * 8;
    const b = x + 18 + rnd() * 8;
    const yy = y + rnd() * 14;
    ramitas += trazo(`M${f(a)} ${f(yy)} Q${f(x)} ${f(yy + 10 + rnd() * 6)} ${f(b)} ${f(yy - 2 + rnd() * 4)}`, rnd() < 0.5 ? A.cobreHondo : 'var(--disco-luzbelito-tinta)', 1.4, 0.85);
  }
  return huevo(x - 7, y + 4, 6) + huevo(x + 6, y + 3, 5) + ramitas;
}

/** El marco ovalado de cobre de la tapa, colgado de una cadena. Adentro, otra noche. */
function marco(x: number, y: number, rx: number, ry: number): string {
  let estrellasAdentro = '';
  const rnd = azar(17);
  for (let i = 0; i < 26; i++) estrellasAdentro += `<circle cx="${f(x - rx + rnd() * rx * 2)}" cy="${f(y - ry + rnd() * ry * 2)}" r="${f(0.5 + rnd())}" fill="${A.papel}" opacity="${f(0.4 + rnd() * 0.6)}"/>`;
  const luna = `M${f(x + 6)} ${f(y - 22)} a14 14 0 1 0 0 28 a10 12 0 1 1 0 -28 Z`;
  return (
    trazo(`M${f(x)} ${f(y - ry - 2)} L${f(x - 2)} ${f(y - ry - 56)}`, A.peltre, 2.4, 0.9) +
    trazo(`M${f(x)} ${f(y - ry - 2)} L${f(x - 2)} ${f(y - ry - 56)}`, A.plata, 1, 0.6) +
    enmascarado('a-marco-adentro', elipse(x, y, rx - 4, ry - 4),
      forma(elipse(x, y, rx, ry), A.negro) + nube(x, y + ry * 0.4, rx, ry * 0.5, A.cielo, 'l', 0.6) + estrellasAdentro + forma(luna, A.papel, 0.9) + nube(x + 4, y - 8, 18, 18, A.papel, 'l', 0.15)) +
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${A.cobreHondo}" stroke-width="10"/>` +
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${A.cobre}" stroke-width="5" opacity="0.9"/>` +
    trazo(`M${f(x - rx * 0.9)} ${f(y - ry * 0.4)} A${f(rx)} ${f(ry)} 0 0 1 ${f(x + rx * 0.3)} ${f(y - ry * 0.95)}`, A.papel, 1.6, 0.5) +
    trazo(`M${f(x + rx * 0.7)} ${f(y + ry * 0.7)} A${f(rx)} ${f(ry)} 0 0 1 ${f(x - rx * 0.2)} ${f(y + ry)}`, A.negro, 2.6, 0.6)
  );
}

/** El fruto raro: redondo, de cobre, con su corona como la de una granada, y que brilla. */
function fruto(x: number, y: number, r: number): string {
  const corona = [-2, -1, 0, 1, 2].map((i) => `M${f(x + i * 4 - 2.5)} ${f(y - r + 3)} L${f(x + i * 4.6)} ${f(y - r - 8 - (i === 0 ? 3 : 0))} L${f(x + i * 4 + 2.5)} ${f(y - r + 3)} Z`).join(' ');
  return (
    nube(x, y, r * 3, r * 2.6, A.cobre, 'xl', 0.35) +
    trazo(`M${f(x)} ${f(y - r - 6)} Q${f(x - 4)} ${f(y - r - 24)} ${f(x - 10)} ${f(y - r - 40)}`, A.hondo, 3) +
    forma(corona, A.cobreHondo) +
    enmascarado('a-fruto', circulo(x, y, r),
      forma(circulo(x, y, r), A.cobre) + nube(x + r * 0.5, y + r * 0.5, r * 0.8, r * 0.7, A.cobreHondo, 'm', 0.9) + nube(x - r * 0.35, y - r * 0.35, r * 0.35, r * 0.3, A.papel, 's', 0.7))
  );
}

/** Una figura de pie, de espaldas a la luz: túnica, cabeza, y lo que le pongan encima. */
function figura(x: number, cabeza: number, alto: number, color: string, o = 1): string {
  const r = alto * 0.12;
  const piso = cabeza + alto;
  return (
    forma(circulo(x, cabeza, r), color, o) +
    forma(`M${f(x - r * 0.9)} ${f(cabeza + r * 0.9)} C${f(x - r * 2.2)} ${f(cabeza + r * 2)} ${f(x - r * 2)} ${f(piso - r)} ${f(x - r * 2.2)} ${f(piso)} L${f(x + r * 2.2)} ${f(piso)} C${f(x + r * 2)} ${f(piso - r)} ${f(x + r * 2.2)} ${f(cabeza + r * 2)} ${f(x + r * 0.9)} ${f(cabeza + r * 0.9)} Z`, color, o)
  );
}

/** Dos alas cerradas atrás de los hombros: pálidas y sopladas, como las nubes. */
function alas(x: number, cabeza: number, alto: number, o = 0.85): string {
  const r = alto * 0.12;
  const ala = (lado: number): string =>
    soplo(`M${f(x + lado * r)} ${f(cabeza + r * 1.4)} C${f(x + lado * r * 3.4)} ${f(cabeza - r * 2.6)} ${f(x + lado * r * 4.4)} ${f(cabeza + r * 1.6)} ${f(x + lado * r * 2.4)} ${f(cabeza + alto * 0.8)} Z`, A.nube, 's', o);
  return ala(-1) + ala(1);
}

function arbolPiso(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const X = (x: number): number => x * k;
  const { tronco, copa } = siluetaDelArbol(k);
  const { x: tx0, pie } = ARBOL.tronco;
  const tx = X(tx0);
  const todo = `${tronco} ${copa}`;
  const marmolAdentro =
    forma(todo, A.hondo) +
    nube(tx - 60, 110, 260, 120, A.marmol, 'xl', 0.9) +
    nube(tx - 10, pie - 150, 40, 160, A.marmol, 'l', 0.8) +
    vetas(tx - 330, 10, tx + 330, pie, 150, [A.claro, A.veta, A.marmol, A.claro], 23, 190) +
    // La luz del cielo de atrás: el lomo de la copa prendido, la panza y el lado del tronco en sombra.
    nube(tx - 40, 40, 300, 50, A.nube, 'xl', 0.35) +
    nube(tx, 260, 320, 50, A.negro, 'xl', 0.55) +
    nube(tx + 26, pie - 120, 20, 170, A.negro, 'l', 0.55);
  const { x0: sx0, y0: sy0, x1: sx1, y1: sy1 } = ARBOL.soldada;
  const soldada =
    trazo(`M${f(X(sx0))} ${sy0} L${f(X(sx1))} ${sy1}`, A.cobreHondo, 8) +
    trazo(`M${f(X(sx0))} ${sy0 - 1.5} L${f(X(sx1))} ${sy1 - 1.5}`, A.cobre, 3.5) +
    trazo(`M${f(X(sx0))} ${sy0 - 3} L${f(X(sx1))} ${sy1 - 3}`, A.papel, 1, 0.45) +
    [0, 0.5].map((t) => {
      const wx = X(sx0 + (sx1 - sx0) * t);
      const wy = sy0 + (sy1 - sy0) * t;
      return [-4, -1.5, 1, 3.5].map((d) => forma(circulo(wx + d * 2, wy, 3.6), A.cobreHondo) + forma(circulo(wx + d * 2 - 1, wy - 1.2, 1.4), A.cobre)).join('') + chispa(wx + 6, wy - 6, 5, A.oro, 0.8);
    }).join('');

  // La tierra de cerca: más honda, con el borde soplado; las raíces se meten en ella.
  const rnd = azar(151);
  let raices = '';
  for (let i = 0; i < 7; i++) {
    const lado = i % 2 ? 1 : -1;
    const largo = 50 + rnd() * 90;
    raices += soplo(`M${f(tx + lado * 30)} ${pie - 6} Q${f(tx + lado * (40 + largo * 0.5))} ${f(pie - 2 + rnd() * 8)} ${f(tx + lado * (40 + largo))} ${f(pie + 4 + rnd() * 18)} L${f(tx + lado * (40 + largo))} ${f(pie + 10 + rnd() * 18)} Q${f(tx + lado * (40 + largo * 0.5))} ${f(pie + 8)} ${f(tx + lado * 20)} ${pie + 6} Z`, A.hondo, 'xs', 0.95);
  }
  let huevosCerca = '';
  for (const [x, p, r] of [[170, 470, 9], [560, 512, 12], [820, 494, 10], [80, 560, 16]] as const) huevosCerca += huevo(X(x), p, r);

  const [mx, my] = [X(ARBOL.marco.x), ARBOL.marco.y];
  const o = OJOS_DEL_ARBOL;
  const at = (id: string): readonly [number, number] => [X(o[id]![0]), o[id]![1]];
  const [cx, cy] = at('el-que-duerme-colgado');
  const [jx, jy] = at('el-jocker-burlon');
  const [mnx, mny] = at('el-monito-que-trepa');
  const [scx, scy] = at('el-senor-de-los-cielos');
  const [lx, ly] = at('la-lechuza-que-circula');
  const [a1x, a1y] = at('el-angel-de-la-soledad');
  const [a2x, a2y] = at('el-angel-guardian');
  const [a3x, a3y] = at('los-angelitos-profesionales');
  const [fx, fy] = at('el-angelito-frito');
  const [bgx, bgy] = at('el-bicho-del-gran-bonete');

  const sombrero = (x: number, y: number): string => forma(`M${f(x - 7)} ${f(y)} Q${f(x)} ${f(y - 13)} ${f(x + 7)} ${f(y)} Z`, A.negro) + forma(elipse(x, y, 11, 2.4), A.negro);
  const bonete = (x: number, y: number): string =>
    forma(`M${f(x - 12)} ${f(y)} L${f(x - 20)} ${f(y - 18)} L${f(x - 4)} ${f(y - 6)} Z`, A.rojo) +
    forma(`M${f(x - 5)} ${f(y - 4)} L${f(x)} ${f(y - 24)} L${f(x + 5)} ${f(y - 4)} Z`, A.papel) +
    forma(`M${f(x + 12)} ${f(y)} L${f(x + 20)} ${f(y - 18)} L${f(x + 4)} ${f(y - 6)} Z`, A.rojo) +
    forma(caja(x - 12, y - 4, 24, 5), A.negro) +
    [[-20, -18], [0, -24], [20, -18]].map(([dx, dy]) => forma(circulo(x + dx!, y + dy!, 2.4), A.oro)).join('');

  const habitantes =
    // El señor de los cielos, sentado arriba de la copa, afilando. Del filo salta la chispa.
    forma(circulo(scx, scy, 9), A.negro) +
    forma(`M${f(scx - 10)} ${f(scy + 8)} C${f(scx - 18)} ${f(scy + 24)} ${f(scx - 26)} ${f(scy + 36)} ${f(scx - 30)} ${f(scy + 40)} L${f(scx + 30)} ${f(scy + 40)} C${f(scx + 22)} ${f(scy + 34)} ${f(scx + 16)} ${f(scy + 22)} ${f(scx + 10)} ${f(scy + 8)} Z`, A.negro) +
    trazo(`M${f(scx + 12)} ${f(scy + 22)} L${f(scx + 40)} ${f(scy + 10)}`, A.plata, 2.4) +
    chispa(scx + 40, scy + 10, 7, A.papel, 0.9) +
    // El que duerme colgado de la rama soldada, cabeza abajo, como un murciélago.
    trazo(`M${f(cx - 6)} ${f(sy0 + (sy1 - sy0) * 0.73 + 2)} L${f(cx - 4)} ${f(cy - 30)} M${f(cx + 6)} ${f(sy0 + (sy1 - sy0) * 0.73 + 2)} L${f(cx + 4)} ${f(cy - 30)}`, A.negro, 7) +
    forma(`M${f(cx - 11)} ${f(cy - 34)} L${f(cx + 11)} ${f(cy - 34)} L${f(cx + 8)} ${f(cy - 8)} L${f(cx - 8)} ${f(cy - 8)} Z`, A.negro) +
    forma(circulo(cx, cy, 10), A.negro) +
    trazo(`M${f(cx - 9)} ${f(cy - 14)} L${f(cx - 12)} ${f(cy + 22)} M${f(cx + 9)} ${f(cy - 14)} L${f(cx + 12)} ${f(cy + 22)}`, A.negro, 4) +
    // El jocker burlón, colgado de un brazo de la rama baja, con el bonete de tres puntas.
    trazo(`M${f(jx + 10)} ${f(jy + 10)} L${f(jx + 14)} 306`, A.negro, 5) +
    figura(jx, jy, 74, A.negro) +
    bonete(jx, jy - 8) +
    // El monito, a media altura del tronco, subiendo.
    forma(elipse(mnx - 1, mny + 18, 9, 14), A.negro) +
    forma(circulo(mnx, mny, 8), A.negro) +
    nube(mnx - 2, mny + 28, 6, 5, A.cobre, 's', 0.55) +
    trazo(`M${f(mnx - 6)} ${f(mny + 10)} l-10 -14 M${f(mnx + 6)} ${f(mny + 12)} l10 -10 M${f(mnx - 6)} ${f(mny + 30)} l-8 8 M${f(mnx + 4)} ${f(mny + 30)} l10 6`, A.negro, 3.4) +
    trazo(`M${f(mnx - 4)} ${f(mny + 32)} q-14 10 -6 22 q6 6 10 -2`, A.negro, 2) +
    // El bicho del gran bonete, trepado y abrazado al fruto, que no lo suelta.
    forma(elipse(bgx + 2, bgy + 12, 11, 15), A.negro) +
    trazo(`M${f(bgx - 6)} ${f(bgy + 8)} Q${f(bgx - 26)} ${f(bgy + 10)} ${f(bgx - 30)} ${f(bgy + 24)} M${f(bgx - 4)} ${f(bgy + 20)} Q${f(bgx - 20)} ${f(bgy + 30)} ${f(bgx - 34)} ${f(bgy + 30)}`, A.negro, 4) +
    trazo(`M${f(bgx + 6)} ${f(bgy - 4)} q4 -10 10 -12 M${f(bgx - 2)} ${f(bgy - 4)} q-2 -10 2 -14`, A.negro, 2) +
    // La lechuza, dando vueltas por el cielo con las alas abiertas.
    forma(`M${f(lx)} ${f(ly - 8)} C${f(lx - 20)} ${f(ly - 22)} ${f(lx - 40)} ${f(ly - 12)} ${f(lx - 56)} ${f(ly - 4)} C${f(lx - 36)} ${f(ly - 2)} ${f(lx - 20)} ${f(ly + 6)} ${f(lx - 8)} ${f(ly + 16)} L${f(lx)} ${f(ly + 22)} L${f(lx + 8)} ${f(ly + 16)} C${f(lx + 20)} ${f(ly + 6)} ${f(lx + 36)} ${f(ly - 2)} ${f(lx + 56)} ${f(ly - 4)} C${f(lx + 40)} ${f(ly - 12)} ${f(lx + 20)} ${f(ly - 22)} ${f(lx)} ${f(ly - 8)} Z`, A.negro, 0.92) +
    forma(circulo(lx, ly, 12), A.negro) +
    forma(`M${f(lx - 11)} ${f(ly - 4)} L${f(lx - 9)} ${f(ly - 18)} L${f(lx - 3)} ${f(ly - 9)} Z M${f(lx + 11)} ${f(ly - 4)} L${f(lx + 9)} ${f(ly - 18)} L${f(lx + 3)} ${f(ly - 9)} Z`, A.negro) +
    // Los ángeles, al pie del árbol: las alas cerradas y pálidas, el cuerpo en sombra.
    alas(a1x, a1y, 62) + figura(a1x, a1y, 62, A.negro) +
    alas(a2x, a2y, 60) + figura(a2x, a2y, 60, A.negro) +
    `<ellipse cx="${f(a2x + 9)}" cy="${f(a2y - 15)}" rx="13" ry="4" fill="none" stroke="${A.oro}" stroke-width="2.6" transform="rotate(24 ${f(a2x + 9)} ${f(a2y - 15)})"/>` +
    nube(a2x + 9, a2y - 15, 16, 8, A.oro, 's', 0.35) +
    // Los angelitos profesionales: dos, de sombrero, con alas chicas. Van al grano.
    alas(a3x, a3y, 40, 0.75) + figura(a3x, a3y, 40, A.negro) + sombrero(a3x, a3y - 6) +
    alas(a3x + 42, a3y + 2, 40, 0.75) + figura(a3x + 42, a3y + 2, 40, A.negro) + sombrero(a3x + 42, a3y - 4) +
    `<ellipse cx="${f(a3x + 36)}" cy="${f(a3y + 2)}" rx="2.6" ry="2" fill="${A.papel}"/><ellipse cx="${f(a3x + 48)}" cy="${f(a3y + 2)}" rx="2.6" ry="2" fill="${A.papel}"/>` +
    // El angelito frito: caído del lado del galpón, chamuscado, con las alas humeando.
    nube(fx, fy + 14, 60, 12, A.negro, 'm', 0.85) +
    soplo(`M${f(fx - 30)} ${f(fy + 14)} C${f(fx - 40)} ${f(fy - 10)} ${f(fx - 20)} ${f(fy - 16)} ${f(fx - 8)} ${f(fy)} Z M${f(fx + 30)} ${f(fy + 14)} C${f(fx + 42)} ${f(fy - 12)} ${f(fx + 22)} ${f(fy - 18)} ${f(fx + 8)} ${f(fy)} Z`, A.peltre, 's', 0.8) +
    forma(circulo(fx, fy, 9), A.negro) + forma(elipse(fx, fy + 16, 14, 9), A.negro) +
    [0, 1, 2].map((i) => soplo(`M${f(fx - 20 + i * 18)} ${f(fy - 4)} C${f(fx - 30 + i * 18)} ${f(fy - 40)} ${f(fx - 6 + i * 18)} ${f(fy - 60)} ${f(fx - 18 + i * 18)} ${f(fy - 100)} L${f(fx - 12 + i * 18)} ${f(fy - 100)} C${f(fx + i * 18)} ${f(fy - 60)} ${f(fx - 22 + i * 18)} ${f(fy - 40)} ${f(fx - 14 + i * 18)} ${f(fy - 4)} Z`, A.nube, 'm', 0.3)).join('') +
    estrellas(fx - 30, fy - 10, fx + 30, fy + 20, 14, A.oro, 7);

  return (
    `<g filter="url(#rociado)">` +
    soplo(`M-20 ${pie - 40} C${f(ancho * 0.3)} ${pie - 52} ${f(ancho * 0.7)} ${pie - 52} ${ancho + 20} ${pie - 40} L${ancho + 20} ${alto + 20} L-20 ${alto + 20} Z`, A.tierraHonda, 'm', 0.75) +
    nube(tx, pie + 4, 200, 26, A.negro, 'l', 0.6) +
    raices +
    huevosCerca +
    enmascarado('a-arbol', todo, marmolAdentro) +
    soldada +
    nido(X(ARBOL.nidos[0][0]), ARBOL.nidos[0][1]) +
    nido(X(ARBOL.nidos[1][0]), ARBOL.nidos[1][1]) +
    marco(mx, my, ARBOL.marco.rx, ARBOL.marco.ry) +
    fruto(X(ARBOL.fruto.x), ARBOL.fruto.y, ARBOL.fruto.r) +
    `</g>` +
    habitantes
  );
}

/** Lo de adelante: cardos secos con huecos, y dos huevos de plata grandes y fuera de foco. */
function arbolFrente(ancho = ANCHO, alto = ALTO): string {
  const rnd = azar(167);
  let cardos = '';
  let x = -10;
  while (x < ancho + 10) {
    const mata = 3 + Math.floor(rnd() * 5);
    for (let i = 0; i < mata; i++) {
      const h = 50 + rnd() * 120;
      const bx = x + i * 7;
      const tx = bx + (rnd() - 0.5) * 30;
      cardos += trazo(`M${f(bx)} ${alto + 4} Q${f(bx + (tx - bx) * 0.3)} ${f(alto - h * 0.6)} ${f(tx)} ${f(alto - h)}`, A.negro, 2.4 + rnd() * 2);
      if (rnd() < 0.5) cardos += forma(circulo(tx, alto - h, 4 + rnd() * 4), A.tierraHonda) + trazo(`M${f(tx - 6)} ${f(alto - h - 6)} l12 12 M${f(tx + 6)} ${f(alto - h - 6)} l-12 12 M${f(tx)} ${f(alto - h - 9)} l0 18`, A.negro, 1.4);
    }
    x += 60 + rnd() * 150;
  }
  return (
    `<g filter="url(#soplo-xs)">${cardos}</g>` +
    `<g filter="url(#soplo-s)">${huevo(40 * (ancho / ANCHO), alto + 10, 34)}${huevo(ancho - 60 * (ancho / ANCHO), alto + 30, 46)}</g>`
  );
}

/* ------------------------------------------------------------------
   Cybersiberia, en el acero remachado de *Último bondi*
   ------------------------------------------------------------------
   La tapa de *Último bondi* es una chapa negra con pistas de circuito en relieve, remaches y un
   ojo de buey con la banda adentro. Cybersiberia es esa chapa hecha cielo, sobre una llanura de
   nieve, y la tele es el ojo de buey: una consola remachada, prendida, con la antena de conejo. Los
   cables salen de la tele y se pierden en la nieve como las pistas de la tapa; la fila de agujeros
   de la tapa son los puntos que se come el pac-man.
*/

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
  oro: 'var(--acento-2)',
  rojo: 'var(--marca-rojo)',
};

/** Una pista de circuito en relieve, como las de la tapa: el lomo, la luz arriba y la sombra abajo. */
function pista(d: string, ancho: number, o = 1): string {
  return (
    `<g transform="translate(0 2)">${trazo(d, C.negro, ancho + 2, 0.7 * o)}</g>` +
    trazo(d, C.acero, ancho, o) +
    `<g transform="translate(-0.8 -1.6)">${trazo(d, C.claro, ancho * 0.35, 0.75 * o)}</g>`
  );
}

/** Un remache: la cabeza redonda, con el brillo arriba a la izquierda. */
const remache = (x: number, y: number, r: number): string =>
  forma(circulo(x, y + r * 0.3, r), C.negro, 0.7) + forma(circulo(x, y, r), C.claro) + forma(circulo(x - r * 0.35, y - r * 0.35, r * 0.4), C.papel, 0.7);

/** Un terminal de la tapa: el aro donde termina una pista. */
const terminal = (x: number, y: number, r: number): string =>
  `<circle cx="${f(x)}" cy="${f(y + 2)}" r="${f(r)}" fill="none" stroke="${C.negro}" stroke-width="${f(r * 0.7)}" opacity="0.7"/>` +
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${C.acero}" stroke-width="${f(r * 0.6)}"/>` +
  `<circle cx="${f(x - 0.8)}" cy="${f(y - 1.6)}" r="${f(r)}" fill="none" stroke="${C.claro}" stroke-width="${f(r * 0.18)}" opacity="0.8"/>`;

/** Una pista que corre derecho y dobla en ángulo recto, con las puntas redondeadas por el trazo. */
function recorrido(rnd: () => number, x: number, y: number, pasos: number, largo: number): string {
  let d = `M${f(x)} ${f(y)}`;
  let horizontal = rnd() < 0.5;
  for (let i = 0; i < pasos; i++) {
    const l = largo * (0.4 + rnd());
    if (horizontal) x += rnd() < 0.5 ? -l : l;
    else y += (rnd() < 0.6 ? 1 : -1) * l * 0.5;
    d += ` L${f(x)} ${f(y)}`;
    horizontal = !horizontal;
  }
  return d;
}

function cyberLejos(ancho = ANCHO, alto = ALTO): string {
  const h = CYBER.horizonte;
  const rnd = azar(211);
  // La chapa del cielo: el cepillado, las juntas con sus remaches y las pistas en relieve.
  let cepillado = '';
  for (let i = 0; i < 140; i++) {
    const y = rnd() * h;
    const x = rnd() * ancho;
    cepillado += trazo(`M${f(x)} ${f(y)} l${f(80 + rnd() * 260)} 0`, rnd() < 0.5 ? C.claro : C.negro, 0.8 + rnd() * 1.4, 0.06 + rnd() * 0.12);
  }
  let juntas = '';
  for (const y of [104, 214]) {
    juntas += trazo(`M-10 ${y} L${ancho + 10} ${y}`, C.negro, 2.4, 0.8) + trazo(`M-10 ${y + 2} L${ancho + 10} ${y + 2}`, C.claro, 1, 0.35);
    for (let x = 12; x < ancho; x += 26) juntas += remache(x, y + 9, 2.6);
  }
  let x = 60 + rnd() * 140;
  while (x < ancho) {
    const y0 = rnd() < 0.5 ? 0 : 104;
    juntas += trazo(`M${f(x)} ${y0} L${f(x)} ${y0 + 104}`, C.negro, 2.2, 0.75);
    for (let y = y0 + 14; y < y0 + 100; y += 24) juntas += remache(x + 8, y, 2.4);
    x += 180 + rnd() * 260;
  }
  let pistas = '';
  for (let i = 0; i < Math.round(5 * (ancho / ANCHO)); i++) {
    const px = rnd() * ancho;
    const py = 24 + rnd() * 250;
    const d = recorrido(rnd, px, py, 3 + Math.floor(rnd() * 3), 70);
    const fin = d.split(' L').pop()!.split(' ').map(Number);
    pistas += pista(d, 5 + rnd() * 3, 0.85) + terminal(px, py, 6) + terminal(fin[0]!, fin[1]!, 5);
  }
  // Lo de la orilla: caños, chimeneas y torres, con nieve en el lomo y una luz roja que pica.
  let fabricas = '';
  for (let x = -20; x < ancho + 20;) {
    const w = 18 + rnd() * 70;
    const t = h - 14 - rnd() * 70;
    fabricas += forma(caja(x, t, w, h - t + 4), C.hondo);
    fabricas += trazo(`M${f(x)} ${f(t)} L${f(x + w)} ${f(t)}`, C.nieve, 2.2, 0.55);
    if (rnd() < 0.35) fabricas += forma(caja(x + w * 0.3, t - 40 - rnd() * 40, 7, 60), C.hondo) + nube(x + w * 0.3 + 3.5, t - 44, 3, 3, C.rojo, 'xs', 0.9);
    x += w + rnd() * 50;
  }
  const tx = CYBER.tele.x * (ancho / ANCHO);
  let nieveEnElAire = '';
  for (let i = 0; i < 260; i++) nieveEnElAire += `<circle cx="${f(rnd() * ancho)}" cy="${f(rnd() * h)}" r="${f(0.6 + rnd() * 1.4)}" opacity="${f(0.15 + rnd() * 0.4)}"/>`;
  let ventisqueros = '';
  for (let i = 0; i < 14; i++) {
    const y = h + 20 + rnd() * (alto - h - 40);
    const x0 = rnd() * ancho;
    const w = 120 + rnd() * 260;
    ventisqueros += soplo(`M${f(x0 - w / 2)} ${f(y)} Q${f(x0)} ${f(y - 14 - rnd() * 10)} ${f(x0 + w / 2)} ${f(y)} Z`, C.nieve, 's', 0.25) + nube(x0, y + 6, w * 0.45, 6, C.hondo, 'm', 0.35);
  }
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${C.hondo}"/>` +
    nube(ancho / 2, 60, ancho * 0.6, 140, C.acero, 'xl', 0.7) +
    cepillado +
    juntas +
    pistas +
    `<g fill="${C.nieve}">${nieveEnElAire}</g>` +
    // La tele se ve desde el horizonte: la nieve del aire, prendida de verde agua.
    nube(tx, h - 30, 320, 90, C.lente, 'xl', 0.28) +
    fabricas +
    // La nieve: gris donde no llega nada, blanca donde le pega la tele.
    forma(caja(-10, h, ancho + 20, alto - h + 10), C.claro) +
    nube(ancho / 2, h + 8, ancho * 0.7, 20, C.acero, 'l', 0.7) +
    nube(tx, CYBER.tele.piso + 20, 380, 150, C.nieve, 'xl', 0.75) +
    nube(tx, CYBER.tele.piso + 20, 220, 80, C.lente, 'xl', 0.35) +
    ventisqueros +
    nube(ancho / 2, alto, ancho * 0.7, 80, C.acero, 'xl', 0.55) +
    `</g>`
  );
}

/** Un buitre encorvado sobre la antena: el bulto, el cogote pelado y el pico de gancho. */
function buitre(x: number, y: number, lado: number): string {
  return (
    forma(`M${f(x - 9)} ${f(y + 16)} C${f(x - 14)} ${f(y)} ${f(x - 6)} ${f(y - 10)} ${f(x + 4)} ${f(y - 8)} C${f(x + 12)} ${f(y - 2)} ${f(x + 12)} ${f(y + 10)} ${f(x + 8)} ${f(y + 18)} Z`, C.negro) +
    trazo(`M${f(x + lado * 2)} ${f(y - 6)} q${f(lado * 4)} -8 ${f(lado * 8)} -6`, C.negro, 2.6) +
    forma(circulo(x + lado * 10, y - 13, 3.2), C.oxido) +
    trazo(`M${f(x + lado * 12)} ${f(y - 13)} q${f(lado * 4)} 0 ${f(lado * 3)} 4`, C.negro, 1.6) +
    nube(x + lado * 10, y - 14, 3, 3, C.lente, 'xs', 0.6)
  );
}

/** La tele: consola de acero remachada con la pantalla de ojo de buey, y el Alien Duce adentro. */
function tele(x: number): string {
  const { piso, ancho: w, alto: hh, pantalla } = CYBER.tele;
  const arriba = piso - hh;
  const { y: py, r } = pantalla;
  const cuerpo = `M${f(x - w / 2 + 16)} ${f(arriba)} L${f(x + w / 2 - 16)} ${f(arriba)} Q${f(x + w / 2)} ${f(arriba)} ${f(x + w / 2)} ${f(arriba + 16)} L${f(x + w / 2)} ${f(piso)} L${f(x - w / 2)} ${f(piso)} L${f(x - w / 2)} ${f(arriba + 16)} Q${f(x - w / 2)} ${f(arriba)} ${f(x - w / 2 + 16)} ${f(arriba)} Z`;
  let remaches = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    remaches += remache(x + Math.cos(a) * (r + 13), py + Math.sin(a) * (r + 13), 3);
  }
  let agujeros = '';
  for (let fila = 0; fila < 3; fila++) for (let i = 0; i < 9; i++) agujeros += forma(circulo(x - 64 + i * 9, piso - 40 + fila * 9, 2.6), C.negro) + forma(circulo(x - 64.5 + i * 9, piso - 40.8 + fila * 9, 1.2), C.claro, 0.5);
  const lineasDeBarrido = Array.from({ length: Math.round((r * 2) / 4) }, (_, i) => trazo(`M${f(x - r)} ${f(py - r + i * 4)} L${f(x + r)} ${f(py - r + i * 4)}`, C.hondo, 1.2, 0.25)).join('');
  const alien =
    forma(`M${f(x)} ${f(py - 44)} C${f(x + 32)} ${f(py - 44)} ${f(x + 34)} ${f(py - 6)} ${f(x + 12)} ${f(py + 14)} L${f(x + 10)} ${f(py + 26)} C${f(x + 30)} ${f(py + 30)} ${f(x + 50)} ${f(py + 44)} ${f(x + 56)} ${f(py + r)} L${f(x - 56)} ${f(py + r)} C${f(x - 50)} ${f(py + 44)} ${f(x - 30)} ${f(py + 30)} ${f(x - 10)} ${f(py + 26)} L${f(x - 12)} ${f(py + 14)} C${f(x - 34)} ${f(py - 6)} ${f(x - 32)} ${f(py - 44)} ${f(x)} ${f(py - 44)} Z`, C.hondo, 0.85) +
    trazo(`M${f(x - 14)} ${f(py - 40)} q-10 -16 -24 -20 M${f(x + 14)} ${f(py - 40)} q10 -16 24 -20`, C.hondo, 2.6, 0.85) +
    forma(circulo(x - 38, py - 60, 4), C.hondo, 0.85) + forma(circulo(x + 38, py - 60, 4), C.hondo, 0.85) +
    forma(`M${f(x - 22)} ${f(py - 14)} Q${f(x - 12)} ${f(py - 22)} ${f(x - 4)} ${f(py - 12)} Q${f(x - 13)} ${f(py - 9)} ${f(x - 22)} ${f(py - 14)} Z M${f(x + 22)} ${f(py - 14)} Q${f(x + 12)} ${f(py - 22)} ${f(x + 4)} ${f(py - 12)} Q${f(x + 13)} ${f(py - 9)} ${f(x + 22)} ${f(py - 14)} Z`, C.papel, 0.95);
  const [aix, aiy] = CYBER.antena.izq;
  const [adx, ady] = CYBER.antena.der;
  const k = x / CYBER.tele.x;
  return (
    // La luz de la pantalla, que se derrama sobre la nieve y el aire.
    nube(x, py, 230, 190, C.lente, 'xl', 0.3) +
    nube(x, piso + 34, 210, 34, C.lente, 'l', 0.4) +
    // La antena de conejo, y los buitres que esperan en la punta de la izquierda.
    trazo(`M${f(x - 14)} ${f(arriba + 2)} L${f(aix * k)} ${aiy} M${f(x + 14)} ${f(arriba + 2)} L${f(adx * k)} ${ady}`, C.claro, 3) +
    forma(circulo(aix * k, aiy, 4.5), C.claro) + forma(circulo(adx * k, ady, 4.5), C.claro) +
    buitre(aix * k + (x - 14 - aix * k) * 0.1, aiy + (arriba + 2 - aiy) * 0.1 - 16, -1) + buitre(aix * k + (x - 14 - aix * k) * 0.27, aiy + (arriba + 2 - aiy) * 0.27 - 16, 1) +
    nube(x + 6, piso + 4, w * 0.6, 10, C.negro, 'm', 0.6) +
    enmascarado('c-tele', cuerpo,
      forma(cuerpo, C.acero) +
      nube(x - w * 0.3, arriba + 30, w * 0.4, 40, C.claro, 'l', 0.6) +
      nube(x + w * 0.4, piso - 30, w * 0.3, hh * 0.6, C.negro, 'l', 0.6) +
      pista(`M${f(x - w / 2 + 14)} ${f(arriba + 22)} L${f(x - r - 30)} ${f(arriba + 22)} L${f(x - r - 30)} ${f(py + 30)}`, 4) +
      pista(`M${f(x + w / 2 - 14)} ${f(arriba + 40)} L${f(x + r + 26)} ${f(arriba + 40)} L${f(x + r + 26)} ${f(py + 10)} L${f(x + w / 2 - 14)} ${f(py + 10)}`, 4) +
      pista(`M${f(x - w / 2 + 14)} ${f(piso - 14)} L${f(x + w / 2 - 14)} ${f(piso - 14)}`, 3) +
      terminal(x - w / 2 + 14, arriba + 22, 4) + terminal(x + w / 2 - 14, py + 10, 4) +
      agujeros +
      // Las perillas.
      [x + 56, x + 88].map((px) => forma(circulo(px, piso - 30, 11), C.negro) + forma(circulo(px, piso - 32, 10), C.claro) + trazo(`M${f(px)} ${f(piso - 32)} l5 -6`, C.negro, 2)).join('') +
      // La nieve que se le juntó arriba.
      soplo(`M${f(x - w / 2 - 4)} ${f(arriba + 6)} Q${f(x - 40)} ${f(arriba - 14)} ${f(x + 10)} ${f(arriba - 2)} Q${f(x + 70)} ${f(arriba - 12)} ${f(x + w / 2 + 4)} ${f(arriba + 8)} L${f(x + w / 2 + 4)} ${f(arriba + 12)} L${f(x - w / 2 - 4)} ${f(arriba + 12)} Z`, C.nieve, 'xs', 0.95)) +
    // El ojo de buey: el aro grueso y la pantalla, prendida.
    `<circle cx="${f(x)}" cy="${f(py + 3)}" r="${f(r + 8)}" fill="none" stroke="${C.negro}" stroke-width="14" opacity="0.6"/>` +
    `<circle cx="${f(x)}" cy="${f(py)}" r="${f(r + 8)}" fill="none" stroke="${C.acero}" stroke-width="13"/>` +
    trazo(`M${f(x - (r + 8) * 0.9)} ${f(py - (r + 8) * 0.42)} A${f(r + 8)} ${f(r + 8)} 0 0 1 ${f(x + (r + 8) * 0.3)} ${f(py - (r + 8) * 0.95)}`, C.papel, 2.2, 0.5) +
    remaches +
    enmascarado('c-pantalla', circulo(x, py, r),
      forma(circulo(x, py, r), C.lente) +
      nube(x, py, r * 0.6, r * 0.6, C.papel, 'l', 0.7) +
      nube(x + r * 0.6, py + r * 0.6, r * 0.7, r * 0.6, C.acero, 'l', 0.55) +
      alien +
      lineasDeBarrido +
      `<circle cx="${f(x)}" cy="${f(py)}" r="${f(r)}" fill="none" stroke="${C.hondo}" stroke-width="16" opacity="0.5" filter="url(#soplo-m)"/>` +
      nube(x - r * 0.4, py - r * 0.5, r * 0.3, r * 0.14, C.papel, 's', 0.55, -30)) +
    // La nieve que se juntó al pie.
    soplo(`M${f(x - w / 2 - 30)} ${f(piso + 6)} Q${f(x - w / 2)} ${f(piso - 26)} ${f(x - w / 2 + 40)} ${f(piso + 2)} Q${f(x)} ${f(piso - 6)} ${f(x + w / 2 - 30)} ${f(piso + 2)} Q${f(x + w / 2 + 6)} ${f(piso - 20)} ${f(x + w / 2 + 30)} ${f(piso + 6)} L${f(x + w / 2 + 30)} ${f(piso + 14)} L${f(x - w / 2 - 30)} ${f(piso + 14)} Z`, C.nieve, 's', 0.9)
  );
}

/** La tele chica, caída de costado en la nieve, pasando el noticiero con las monjas. */
function teleChica(x: number): string {
  const { piso, ancho: w, alto: hh } = CYBER.teleChica;
  const cx = x;
  const cy = piso - hh / 2;
  const monja = (mx: number): string =>
    forma(`M${f(mx - 12)} ${f(cy + 26)} Q${f(mx - 10)} ${f(cy - 2)} ${f(mx)} ${f(cy - 10)} Q${f(mx + 10)} ${f(cy - 2)} ${f(mx + 12)} ${f(cy + 26)} Z`, C.hondo, 0.85) +
    forma(circulo(mx, cy - 4, 5), C.papel, 0.8);
  return (
    nube(cx, cy, 90, 70, C.lente, 'xl', 0.3) +
    `<g transform="rotate(-11 ${f(cx)} ${f(cy)})">` +
    enmascarado('c-tele-chica', caja(cx - w / 2, cy - hh / 2, w, hh),
      forma(caja(cx - w / 2, cy - hh / 2, w, hh), C.acero) + nube(cx + w / 2, cy + hh / 2, w * 0.4, hh * 0.4, C.negro, 'm', 0.6)) +
    enmascarado('c-pantalla-chica', caja(cx - w / 2 + 8, cy - hh / 2 + 8, w - 30, hh - 16),
      forma(caja(cx - w / 2 + 8, cy - hh / 2 + 8, w - 30, hh - 16), C.lente) + nube(cx - 6, cy, 30, 20, C.papel, 'l', 0.6) + monja(cx - 22) + monja(cx + 4)) +
    remache(cx + w / 2 - 11, cy - 12, 3) + remache(cx + w / 2 - 11, cy + 4, 3) +
    trazo(`M${f(cx - 10)} ${f(cy - hh / 2)} l-18 -26 M${f(cx + 2)} ${f(cy - hh / 2)} l10 -12 l14 4`, C.claro, 2) +
    `</g>` +
    soplo(`M${f(cx - w)} ${f(piso + 8)} Q${f(cx - w / 3)} ${f(piso - 30)} ${f(cx + 6)} ${f(piso - 4)} Q${f(cx + w / 2)} ${f(piso - 14)} ${f(cx + w)} ${f(piso + 8)} Z`, C.nieve, 's', 0.95)
  );
}

/** Una figura de pie: cabeza, hombros y cuerpo, para recortar contra la nieve. */
function parado(x: number, cabeza: number, alto: number, hombros = 1): string {
  const r = alto * 0.11;
  const piso = cabeza + alto;
  return (
    circulo(x, cabeza, r) +
    ` M${f(x - r * 2.3 * hombros)} ${f(cabeza + r * 2)} Q${f(x)} ${f(cabeza + r * 1.2)} ${f(x + r * 2.3 * hombros)} ${f(cabeza + r * 2)} ` +
    `L${f(x + r * 1.9 * hombros)} ${f(cabeza + alto * 0.55)} L${f(x + r * 1.5)} ${f(piso)} L${f(x + r * 0.3)} ${f(piso)} L${f(x)} ${f(cabeza + alto * 0.6)} L${f(x - r * 0.3)} ${f(piso)} L${f(x - r * 1.5)} ${f(piso)} L${f(x - r * 1.9 * hombros)} ${f(cabeza + alto * 0.55)} Z`
  );
}

/** El canto de una silueta prendido por la tele: el mismo contorno, corrido y soplado. */
const canto = (d: string, dx: number, dy: number, o = 0.55): string => `<g transform="translate(${f(dx)} ${f(dy)})">${soplo(d, C.lente, 'xs', o)}</g>`;

function cyberPiso(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const X = (x: number): number => x * k;
  const tx = X(CYBER.tele.x);
  const rnd = azar(223);
  // Los cables que salen de la tele y se meten en la nieve, como las pistas de la tapa.
  let cables = '';
  for (const [lado, y1, x2] of [[-1, 452, -40], [1, 438, ancho + 40], [-1, 520, X(160)], [1, 560, ancho * 0.8]] as const) {
    const x0 = tx + lado * 90;
    const d = `M${f(x0)} ${CYBER.tele.piso - 4} L${f(x0)} ${y1} L${f(x2)} ${y1}`;
    cables += pista(d, 6, 0.9) + `<g transform="translate(0 -3)">${trazo(d, C.nieve, 2, 0.5)}</g>` + terminal(x2, y1, 6);
  }
  // La fila de puntos que se come el pac-man: como la fila de agujeros de la tapa, pero prendidos.
  const { desde, hasta, y: yp } = CYBER.puntos;
  let puntos = '';
  for (let x = X(desde); x < X(hasta); x += 22) puntos += nube(x, yp, 6, 4, C.oro, 's', 0.45) + forma(circulo(x, yp, 3), C.papel);
  const { x: pmx, y: pmy, r: pmr } = CYBER.pacman;
  const pm = X(pmx);
  const pacman =
    nube(pm, pmy, pmr * 2.4, pmr * 1.8, C.oro, 'xl', 0.45) +
    forma(`M${f(pm)} ${f(pmy)} L${f(pm - pmr * Math.cos(0.6))} ${f(pmy - pmr * Math.sin(0.6))} A${pmr} ${pmr} 0 1 1 ${f(pm - pmr * Math.cos(0.6))} ${f(pmy + pmr * Math.sin(0.6))} Z`, C.oro) +
    nube(pm + 4, pmy + 6, pmr * 0.6, pmr * 0.5, C.oxido, 's', 0.5) +
    forma(circulo(pm + 2, pmy - pmr * 0.5, 2.6), C.negro);

  // Las huellas del Rey Garufa, que viene caminando solo desde el borde.
  const [gx, gy] = OJOS_DE_CYBERSIBERIA['el-rey-garufa']!;
  let huellas = '';
  for (let i = 1; i < 9; i++) huellas += forma(elipse(X(gx) + i * 22, gy + 70 + i * 4 + (i % 2) * 6, 4 + i * 0.3, 2 + i * 0.12), C.acero, 0.55);

  const o = OJOS_DE_CYBERSIBERIA;
  const at = (id: string): [number, number] => [X(o[id]![0]), o[id]![1]];
  const [bx, by] = [X(COSAS_DE_CYBERSIBERIA['el-capitan-buscapina']![0]), COSAS_DE_CYBERSIBERIA['el-capitan-buscapina']![1]];
  const [gax, gay] = at('el-rey-garufa');
  const [wx, wy] = at('super-walter');
  const [cbx, cby] = at('comboman');
  const [sx, sy] = at('la-princesita-sapito');
  const [px, py] = at('porco-rex');
  const [cmx, cmy] = at('los-camellos-prestigiosos');
  const [dx, dy] = at('drogocop');
  const [spx, spy] = at('el-super-boca');
  const [gvx, gvy] = [X(COSAS_DE_CYBERSIBERIA['el-gavilan']![0]), COSAS_DE_CYBERSIBERIA['el-gavilan']![1]];

  // El capitán Buscapina, de espaldas, sentado en la nieve frente a la tele, con la gorra puesta.
  const buscapina =
    `M${f(bx - 30)} ${f(by + 40)} C${f(bx - 32)} ${f(by + 14)} ${f(bx - 22)} ${f(by + 2)} ${f(bx - 12)} ${f(by - 2)} ` +
    `C${f(bx - 16)} ${f(by - 14)} ${f(bx - 12)} ${f(by - 30)} ${f(bx)} ${f(by - 30)} C${f(bx + 12)} ${f(by - 30)} ${f(bx + 16)} ${f(by - 14)} ${f(bx + 12)} ${f(by - 2)} ` +
    `C${f(bx + 22)} ${f(by + 2)} ${f(bx + 32)} ${f(by + 14)} ${f(bx + 30)} ${f(by + 40)} Z ` +
    `M${f(bx - 15)} ${f(by - 22)} Q${f(bx)} ${f(by - 40)} ${f(bx + 15)} ${f(by - 22)} Z`;
  const garufa = parado(gax, gay, 78);
  const sapo = `M${f(sx - 18)} ${f(sy + 16)} C${f(sx - 22)} ${f(sy + 2)} ${f(sx - 12)} ${f(sy - 8)} ${f(sx - 6)} ${f(sy - 4)} Q${f(sx)} ${f(sy - 6)} ${f(sx + 6)} ${f(sy - 4)} C${f(sx + 12)} ${f(sy - 8)} ${f(sx + 22)} ${f(sy + 2)} ${f(sx + 18)} ${f(sy + 16)} Z`;
  const chancho = circulo(px, py + 4, 15) + ` ${elipse(px + 26, py + 18, 30, 17)} M${f(px - 13)} ${f(py - 6)} l-4 -12 l12 6 Z M${f(px + 13)} ${f(py - 6)} l4 -12 l-12 6 Z` +
    [px + 4, px + 14, px + 38, px + 48].map((lx) => ` ${caja(lx - 3, py + 26, 6, 16)}`).join('');
  const camello = elipse(cmx - 3, cmy + 1, 10, 6) +
    ` M${f(cmx + 2)} ${f(cmy - 2)} C${f(cmx + 14)} ${f(cmy)} ${f(cmx + 10)} ${f(cmy + 22)} ${f(cmx + 20)} ${f(cmy + 30)} Q${f(cmx + 30)} ${f(cmy + 4)} ${f(cmx + 42)} ${f(cmy + 24)} Q${f(cmx + 54)} ${f(cmy + 2)} ${f(cmx + 66)} ${f(cmy + 26)} Q${f(cmx + 76)} ${f(cmy + 34)} ${f(cmx + 72)} ${f(cmy + 46)} L${f(cmx + 18)} ${f(cmy + 48)} Q${f(cmx + 4)} ${f(cmy + 30)} ${f(cmx - 2)} ${f(cmy + 4)} Z` +
    [cmx + 22, cmx + 32, cmx + 58, cmx + 68].map((lx) => ` ${caja(lx - 2.5, cmy + 44, 5, 34)}`).join('');
  const robot = parado(dx, dy, 84, 1.35) + ` ${caja(dx - 11, dy - 10, 22, 6)}`;
  const pilar = parado(spx, spy, 96, 1.6);
  const walter = circulo(wx, wy, 9) + ` M${f(wx - 10)} ${f(wy + 6)} L${f(wx + 10)} ${f(wy + 6)} L${f(wx + 18)} ${f(wy + 52)} L${f(wx + 4)} ${f(wy + 54)} L${f(wx)} ${f(wy + 34)} L${f(wx - 6)} ${f(wy + 56)} L${f(wx - 18)} ${f(wy + 52)} Z M${f(wx - 10)} ${f(wy + 10)} L${f(wx - 30)} ${f(wy - 6)} L${f(wx - 28)} ${f(wy - 12)} L${f(wx - 6)} ${f(wy + 4)} Z M${f(wx + 10)} ${f(wy + 10)} L${f(wx + 32)} ${f(wy + 2)} L${f(wx + 30)} ${f(wy - 4)} L${f(wx + 6)} ${f(wy + 4)} Z`;
  const capa = `M${f(wx - 9)} ${f(wy + 8)} C${f(wx - 40)} ${f(wy - 20)} ${f(wx - 30)} ${f(wy - 60)} ${f(wx - 60)} ${f(wy - 80)} C${f(wx - 10)} ${f(wy - 60)} ${f(wx + 10)} ${f(wy - 40)} ${f(wx + 9)} ${f(wy + 8)} Z`;
  const gavilan = `M${f(gvx)} ${f(gvy)} C${f(gvx - 20)} ${f(gvy - 6)} ${f(gvx - 44)} ${f(gvy - 4)} ${f(gvx - 64)} ${f(gvy + 8)} C${f(gvx - 40)} ${f(gvy + 6)} ${f(gvx - 20)} ${f(gvy + 10)} ${f(gvx - 6)} ${f(gvy + 14)} L${f(gvx - 4)} ${f(gvy + 26)} L${f(gvx + 4)} ${f(gvy + 26)} L${f(gvx + 6)} ${f(gvy + 14)} C${f(gvx + 20)} ${f(gvy + 10)} ${f(gvx + 40)} ${f(gvy + 6)} ${f(gvx + 64)} ${f(gvy + 8)} C${f(gvx + 44)} ${f(gvy - 4)} ${f(gvx + 20)} ${f(gvy - 6)} ${f(gvx)} ${f(gvy)} Z ${circulo(gvx, gvy + 2, 5)}`;
  // Comboman, medio comido: la silueta, con las mordidas sacadas.
  const combo = parado(cbx, cby, 80);
  const mordidas = [[cbx + 16, cby + 30, 10], [cbx + 20, cby + 46, 9], [cbx + 12, cby + 60, 8]] as const;
  const corona = (x: number, y: number, a: number): string => forma(`M${f(x - a)} ${f(y)} L${f(x - a)} ${f(y - a)} L${f(x - a / 2)} ${f(y - a / 2)} L${f(x)} ${f(y - a * 1.2)} L${f(x + a / 2)} ${f(y - a / 2)} L${f(x + a)} ${f(y - a)} L${f(x + a)} ${f(y)} Z`, C.oro);

  const sombraEnLaNieve = (x: number, piso: number, w: number): string => nube(x - 18, piso + 2, w, 6, C.acero, 's', 0.7);

  return (
    `<g filter="url(#rociado)">` +
    cables +
    huellas +
    puntos +
    `</g>` +
    tele(tx) +
    teleChica(X(CYBER.teleChica.x)) +
    pacman +
    // Los de la nieve, recortados contra la luz de la tele, con el canto prendido.
    sombraEnLaNieve(cmx + 46, cmy + 78, 46) + canto(camello, 2, -2, 0.5) + forma(camello, C.hondo) +
    sombraEnLaNieve(px + 20, py + 42, 46) + canto(chancho, 2.5, -2) + forma(chancho, C.negro) + corona(px, py - 12, 7) + nube(px, py + 12, 7, 5, C.oxido, 's', 0.8) +
    sombraEnLaNieve(dx, dy + 84, 30) + canto(robot, -2.5, -2) + forma(robot, C.negro) +
    `<g transform="rotate(-8 ${f(dx + 30)} ${f(dy + 40)})">` + forma(caja(dx + 22, dy - 6, 12, 62), C.hondo) + forma(caja(dx + 25, dy - 22, 6, 18), C.hondo) + trazo(`M${f(dx + 25)} ${f(dy + 2)} L${f(dx + 25)} ${f(dy + 52)}`, C.lente, 1.6, 0.7) + `</g>` +
    sombraEnLaNieve(bx, by + 40, 50) + canto(buscapina, 0, -3, 0.8) + forma(buscapina, C.negro) +
    sombraEnLaNieve(sx, sy + 16, 26) + canto(sapo, 0, -2) + forma(sapo, C.negro) + corona(sx, sy - 10, 5) +
    sombraEnLaNieve(gax, gay + 78, 30) + canto(garufa, -2.5, -2) + forma(garufa, C.negro) + corona(gax, gay - 8, 7) +
    nube(gax, gay + 30, 22, 18, C.rojo, 'l', 0.6) + forma(`M${f(gax)} ${f(gay + 38)} C${f(gax - 12)} ${f(gay + 28)} ${f(gax - 8)} ${f(gay + 18)} ${f(gax)} ${f(gay + 24)} C${f(gax + 8)} ${f(gay + 18)} ${f(gax + 12)} ${f(gay + 28)} ${f(gax)} ${f(gay + 38)} Z`, C.rojo) +
    `<mask id="c-mordidas"><rect x="${f(cbx - 60)}" y="${f(cby - 30)}" width="120" height="140" fill="white"/>${mordidas.map(([mx, my, r]) => `<circle cx="${f(mx)}" cy="${f(my)}" r="${r}" fill="black"/>`).join('')}</mask>` +
    sombraEnLaNieve(cbx, cby + 80, 30) + `<g mask="url(#c-mordidas)">${canto(combo, -2.5, -2)}${forma(combo, C.negro)}</g>` +
    sombraEnLaNieve(spx, spy + 96, 36) + canto(pilar, -2.5, -2, 0.5) + forma(pilar, C.negro) +
    soplo(capa, C.rojo, 'xs', 0.85) + forma(walter, C.negro) +
    forma(gavilan, C.negro, 0.9)
  );
}

/** Lo de adelante: montones de nieve con huecos, un caño remachado enterrado y copos fuera de foco. */
function cyberFrente(ancho = ANCHO, alto = ALTO): string {
  const rnd = azar(239);
  let montones = '';
  let x = -30;
  while (x < ancho + 30) {
    const w = 90 + rnd() * 160;
    const h = 22 + rnd() * 40;
    const monton = `M${f(x)} ${alto + 10} Q${f(x + w * 0.2)} ${f(alto - h)} ${f(x + w * 0.5)} ${f(alto - h * 0.9)} Q${f(x + w * 0.8)} ${f(alto - h * 0.8)} ${f(x + w)} ${alto + 10} Z`;
    montones += enmascarado(`c-monton-${Math.round(x)}`, monton, forma(monton, C.claro) + nube(x + w * 0.4, alto - h * 0.8, w * 0.4, h * 0.3, C.nieve, 'm', 0.8) + nube(x + w * 0.7, alto, w * 0.4, h * 0.6, C.acero, 'm', 0.8));
    x += w + 80 + rnd() * 200;
  }
  let copos = '';
  for (let i = 0; i < Math.round(14 * (ancho / ANCHO)); i++) copos += nube(rnd() * ancho, 380 + rnd() * 240, 4 + rnd() * 9, 4 + rnd() * 9, C.nieve, 'm', 0.35 + rnd() * 0.3);
  const cx = 60 * (ancho / ANCHO);
  const canio =
    enmascarado('c-canio', caja(cx - 80, alto - 52, 220, 34), forma(caja(cx - 80, alto - 52, 220, 34), C.acero) + nube(cx, alto - 48, 200, 6, C.claro, 's', 0.6) + nube(cx, alto - 20, 200, 8, C.negro, 's', 0.7)) +
    [cx - 40, cx + 10, cx + 60, cx + 110].map((rx) => remache(rx, alto - 36, 3)).join('') +
    soplo(`M${f(cx - 90)} ${alto + 10} Q${f(cx + 20)} ${alto - 50} ${f(cx + 160)} ${alto + 10} Z`, C.nieve, 's', 0.9);
  return `<g filter="url(#rociado)">${canio}${montones}</g>${copos}`;
}

/** La nieve que cae: copos chicos sobre transparente. La página la corre para abajo y la repite. */
function cyberNieve(ancho = ANCHO, alto = ALTO): string {
  const rnd = azar(251);
  let copos = '';
  for (let i = 0; i < Math.round(170 * (ancho / ANCHO)); i++) {
    const r = 0.8 + rnd() * rnd() * 3.2;
    copos += `<circle cx="${f(rnd() * ancho)}" cy="${f(rnd() * alto)}" r="${f(r)}" opacity="${f(0.35 + rnd() * 0.5)}"/>`;
  }
  return `<g fill="${C.nieve}" filter="url(#soplo-xs)">${copos}</g>`;
}

/* ------------------------------------------------------------------
   Los astilleros, en la tiza azul del disco 2 de *Cordero atado*
   ------------------------------------------------------------------
   La contratapa del disco 2 es tiza celeste sobre azul oscuro: espirales, una cara que se ríe,
   escaleras y ventanitas. El frente es el naranja con el bicho azul. El muelle de noche está
   dibujado así: todo lo de acá tiene el canto de tiza, el cielo y el río se llenan de espirales, y
   los containers son el naranja de la tapa, con las costillas de las escaleras de la contratapa. La
   luz es la de un farol de sodio, naranja como la tapa.
*/

const T = {
  noche: 'var(--entorno-astillero-noche)',
  tiza: 'var(--entorno-astillero-tiza)',
  azul: 'var(--entorno-astillero-azul)',
  clara: 'var(--entorno-astillero-tiza-clara)',
  naranja: 'var(--entorno-pastura)',
  naranjaHonda: 'var(--entorno-pastura-honda)',
  sodio: 'var(--disco-cordero-atado-tinta)',
  negro: 'var(--fondo)',
  papel: 'var(--papel)',
  oro: 'var(--acento-2)',
  rojo: 'var(--marca-rojo)',
};

/**
 * La tiza: el trazo se corre con un ruido fino y se le comen pedazos, como la tiza sobre un
 * pizarrón. Va adentro de cada pieza que la usa, porque el aerógrafo no la trae.
 */
const filtroTiza = (): string =>
  `<defs><filter id="tiza" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="ruido"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="ruido" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="corrido"/>` +
  `<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 1.75" result="huecos"/>` +
  `<feComposite in="corrido" in2="huecos" operator="in"/></filter></defs>`;

/** Un espiral de tiza, como los de la contratapa: se abre de a poco y no cierra. */
function espiralDeTiza(cx: number, cy: number, r: number, vueltas: number, color: string, ancho: number, o = 1, achate = 1): string {
  let d = '';
  const n = Math.round(vueltas * 40);
  for (let i = 0; i <= n; i++) {
    const a = (i / 40) * Math.PI * 2;
    const rr = (r * i) / n;
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr * achate)} `;
  }
  return trazo(d, color, ancho, o);
}

/** Un container de costado: el naranja de la tapa, las costillas, las trancas de la puerta. */
function container(x: number, y: number, w: number, h: number, color: string, hondo: string, puertaALaDerecha: boolean, id: string): string {
  let costillas = '';
  for (let cx = x + 6; cx < x + w - 4; cx += 7) costillas += trazo(`M${f(cx)} ${f(y + 5)} L${f(cx)} ${f(y + h - 5)}`, hondo, 2.2, 0.75) + trazo(`M${f(cx + 2.4)} ${f(y + 5)} L${f(cx + 2.4)} ${f(y + h - 5)}`, T.papel, 0.8, 0.18);
  const px = puertaALaDerecha ? x + w - 34 : x + 4;
  const trancas = [0, 1, 2, 3].map((i) => trazo(`M${f(px + 4 + i * 8)} ${f(y + 6)} L${f(px + 4 + i * 8)} ${f(y + h - 6)}`, T.negro, 1.8, 0.7)).join('');
  return enmascarado(id, caja(x, y, w, h),
    forma(caja(x, y, w, h), color) +
    costillas +
    trancas +
    forma(caja(x, y, w, 5), hondo) + forma(caja(x, y + h - 5, w, 5), hondo) +
    nube(x, y + h / 2, w * 0.4, h, T.negro, 'l', 0.45));
}

function astilleroLejos(ancho = ANCHO, alto = ALTO): string {
  const { orilla } = ASTILLERO;
  const rnd = azar(307);
  let rayado = '';
  for (let i = 0; i < Math.round(240 * (ancho / ANCHO)); i++) {
    const x = rnd() * ancho;
    const y = rnd() * orilla;
    const l = 10 + rnd() * 30;
    rayado += trazo(`M${f(x)} ${f(y)} l${f(l * 0.5)} ${f(-l * 0.86)}`, T.tiza, 1.4 + rnd() * 1.8, 0.08 + rnd() * 0.14);
  }
  let espirales = '';
  for (let x = 60, n = 0; x < ancho; x += 150 + rnd() * 160, n++) espirales += espiralDeTiza(x, 40 + rnd() * 190, 18 + rnd() * 40, 2.4 + rnd() * 1.4, n % 3 ? T.tiza : T.clara, 2.4 + rnd() * 2.4, 0.6 + rnd() * 0.35);
  // La otra orilla: grúas de pórtico, pilas de containers, y las luces de sodio que pican.
  let orillaLejos = '';
  let luces = '';
  let reflejos = '';
  for (let x = -20; x < ancho + 20;) {
    const w = 30 + rnd() * 80;
    const t = orilla - 10 - rnd() * 40;
    orillaLejos += forma(caja(x, t, w, orilla - t + 2), T.negro) + trazo(`M${f(x)} ${f(t)} L${f(x + w)} ${f(t)}`, T.tiza, 1.2, 0.45);
    if (rnd() < 0.3) {
      const g = 60 + rnd() * 50;
      orillaLejos += trazo(`M${f(x + 4)} ${orilla} L${f(x + 10)} ${f(t - g)} L${f(x + 16)} ${orilla} M${f(x - 30)} ${f(t - g)} L${f(x + 70)} ${f(t - g)} M${f(x + 10)} ${f(t - g)} L${f(x + 46)} ${f(t - g + 30)}`, T.negro, 3) +
        trazo(`M${f(x - 30)} ${f(t - g - 2)} L${f(x + 70)} ${f(t - g - 2)}`, T.tiza, 1, 0.5);
    }
    for (let i = 0; i < 2; i++) {
      if (rnd() < 0.5) continue;
      const lx = x + rnd() * w;
      const ly = t + 4 + rnd() * 10;
      luces += nube(lx, ly, 10, 8, T.sodio, 'm', 0.6) + forma(circulo(lx, ly, 1.6), T.papel);
      for (let ry = orilla + 6; ry < ASTILLERO.muelle; ry += 7 + rnd() * 6) reflejos += trazo(`M${f(lx - 3 - rnd() * 4)} ${f(ry)} l${f(6 + rnd() * 8)} 0`, T.sodio, 1.6, 0.25 + rnd() * 0.3);
    }
    x += w + rnd() * 30;
  }
  let agua = '';
  for (let i = 0; i < Math.round(120 * (ancho / ANCHO)); i++) {
    const y = orilla + 6 + rnd() * (ASTILLERO.muelle - orilla);
    agua += trazo(`M${f(rnd() * ancho)} ${f(y)} l${f(14 + rnd() * 40)} ${f((rnd() - 0.5) * 2)}`, T.tiza, 1.2 + rnd(), 0.12 + rnd() * 0.2);
  }
  for (let i = 0; i < Math.round(5 * (ancho / ANCHO)); i++) agua += espiralDeTiza(rnd() * ancho, orilla + 30 + rnd() * 90, 10 + rnd() * 10, 1.6, T.tiza, 1.4, 0.35, 0.3);
  // La grúa grande, atrás de la pila: patas de pórtico y la pluma que cruza el cielo.
  const gx = 330 * (ancho / ANCHO);
  const grua =
    trazo(`M${f(gx)} ${orilla} L${f(gx + 10)} 74 M${f(gx + 60)} ${orilla} L${f(gx + 50)} 74 M${f(gx + 4)} 220 L${f(gx + 56)} 220 M${f(gx + 7)} 150 L${f(gx + 53)} 150 M${f(gx + 4)} 220 L${f(gx + 53)} 150 M${f(gx + 56)} 220 L${f(gx + 7)} 150 M${f(gx - 200)} 74 L${f(gx + 360)} 74 M${f(gx - 200)} 88 L${f(gx + 360)} 88`, T.negro, 6) +
    Array.from({ length: 28 }, (_, i) => trazo(`M${f(gx - 200 + i * 20)} 74 L${f(gx - 190 + i * 20)} 88`, T.negro, 2.4)).join('') +
    trazo(`M${f(gx - 200)} 72 L${f(gx + 360)} 72 M${f(gx + 60)} ${orilla} L${f(gx + 50)} 74`, T.tiza, 1.6, 0.6) +
    forma(caja(gx + 6, 90, 48, 34), T.negro) + forma(caja(gx + 12, 96, 16, 12), T.sodio, 0.8) +
    trazo(`M${f(gx + 250)} 88 L${f(gx + 250)} 200`, T.clara, 1, 0.5) + trazo(`M${f(gx + 250)} 200 q8 0 8 8 q0 8 -8 6`, T.clara, 2, 0.7);
  return (
    filtroTiza() +
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${T.noche}"/>` +
    nube(ancho / 2, -40, ancho * 0.7, 160, T.negro, 'xl', 0.7) +
    nube(ancho * 0.75, orilla - 20, ancho * 0.4, 80, T.azul, 'xl', 0.5) +
    `</g>` +
    `<g filter="url(#tiza)">${rayado}${espirales}</g>` +
    `<g filter="url(#rociado)">${grua}${orillaLejos}${luces}` +
    forma(caja(-10, orilla, ancho + 20, alto - orilla + 10), T.negro, 0.55) +
    `</g>` +
    `<g filter="url(#tiza)">${reflejos}${agua}</g>`
  );
}

/** El ferry que sale, con la hilera de ventanas prendidas, y la planchada que baja al muelle. */
function ferry(k: number): string {
  const { x0: a, x1: b, agua, cubierta } = ASTILLERO.ferry;
  const [x0, x1] = [a * k, b * k];
  const casco = `M${f(x0)} ${f(cubierta)} L${f(x1 - 30)} ${f(cubierta)} L${f(x1)} ${f(cubierta - 6)} L${f(x1 - 24)} ${agua} L${f(x0 + 14)} ${agua} Z`;
  const cabina = caja(x0 + 40, cubierta - 44, x1 - x0 - 90, 44);
  const puente = caja(x0 + 90, cubierta - 70, x1 - x0 - 190, 26);
  let ventanas = '';
  for (let x = x0 + 52; x < x1 - 60; x += 18) ventanas += forma(caja(x, cubierta - 32, 10, 12), T.sodio, 0.9) + nube(x + 5, cubierta - 26, 8, 8, T.sodio, 's', 0.4);
  for (let x = x0 + 100; x < x1 - 110; x += 22) ventanas += forma(caja(x, cubierta - 62, 14, 9), T.clara, 0.7);
  let reflejo = '';
  for (let x = x0 + 52; x < x1 - 60; x += 18) reflejo += trazo(`M${f(x)} ${f(agua + 8 + (x % 3) * 4)} l10 0 M${f(x + 2)} ${f(agua + 20 + (x % 4) * 3)} l6 0`, T.sodio, 1.8, 0.35);
  const borda = Array.from({ length: Math.round((x1 - x0 - 40) / 16) }, (_, i) => `M${f(x0 + 6 + i * 16)} ${f(cubierta)} l0 -10`).join(' ');
  return (
    `<g filter="url(#tiza)">${reflejo}</g>` +
    enmascarado('t-casco', casco, forma(casco, T.negro) + forma(caja(x0, cubierta + 8, x1 - x0, 7), T.naranja, 0.9) + nube(x1, agua, 140, 30, T.azul, 'l', 0.5)) +
    enmascarado('t-cabina', `${cabina} ${puente}`, forma(`${cabina} ${puente}`, T.azul) + nube(x0 + 60, cubierta - 40, 120, 40, T.negro, 'l', 0.5)) +
    ventanas +
    forma(caja(x1 - 140, cubierta - 108, 18, 38), T.naranja) + forma(caja(x1 - 140, cubierta - 108, 18, 7), T.negro) +
    nube(x1 - 120, cubierta - 140, 30, 24, T.clara, 'l', 0.25) +
    `<g filter="url(#tiza)">` +
    trazo(`${casco} ${cabina} ${puente}`, T.clara, 1.6, 0.75) +
    trazo(`M${f(x0)} ${f(cubierta - 10)} L${f(x1 - 30)} ${f(cubierta - 10)} ${borda}`, T.clara, 1.2, 0.7) +
    `</g>`
  );
}

function astilleroPiso(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const X = (x: number): number => x * k;
  const { muelle, pila, farol, hamaca, planchada, cania, pescado, lanchon, balde, valija } = ASTILLERO;
  const rnd = azar(331);

  // El muelle: tablones cada vez más anchos, con la tiza en las juntas.
  let tablones = '';
  for (let y = muelle + 12, paso = 9; y < alto + 10; y += paso, paso *= 1.14) tablones += trazo(`M-10 ${f(y)} L${ancho + 10} ${f(y)}`, T.tiza, 1.4, 0.35);
  for (let i = 0; i < Math.round(30 * k); i++) {
    const y = muelle + 14 + rnd() * (alto - muelle);
    tablones += trazo(`M${f(rnd() * ancho)} ${f(y)} l0 ${f(6 + (y - muelle) * 0.05)}`, T.tiza, 1, 0.3);
  }
  const fx = X(farol.x);
  const luzDelFarol =
    nube(fx + 30, farol.piso - farol.alto + 4, 180, 150, T.sodio, 'xl', 0.32) +
    nube(fx + 30, farol.piso - farol.alto + 6, 16, 10, T.papel, 's', 0.9) +
    nube(fx + 20, farol.piso + 30, 220, 50, T.sodio, 'xl', 0.35);
  const poste =
    forma(caja(fx - 4, farol.piso - farol.alto, 8, farol.alto), T.negro) +
    trazo(`M${f(fx)} ${f(farol.piso - farol.alto)} Q${f(fx + 6)} ${f(farol.piso - farol.alto - 18)} ${f(fx + 30)} ${f(farol.piso - farol.alto - 6)}`, T.negro, 5) +
    forma(`M${f(fx + 18)} ${f(farol.piso - farol.alto - 4)} L${f(fx + 42)} ${f(farol.piso - farol.alto - 4)} L${f(fx + 36)} ${f(farol.piso - farol.alto + 4)} L${f(fx + 24)} ${f(farol.piso - farol.alto + 4)} Z`, T.negro);

  // La pila de containers, con el pibe sentado arriba y la rana tomando sol.
  const filas = 4;
  const hf = (pila.piso - pila.arriba) / filas;
  const [px0, px1] = [X(pila.x0), X(pila.x1)];
  const colores: ReadonlyArray<readonly [string, string]> = [[T.naranja, T.naranjaHonda], [T.azul, T.noche], [T.naranjaHonda, T.negro], [T.tiza, T.noche]];
  let pilaDeContainers = '';
  for (let fila = 0; fila < filas; fila++) {
    const y = pila.piso - (fila + 1) * hf;
    const partes = fila === 1 || fila === 3 ? [[px0 + (fila === 3 ? 30 : 0), px1 - (fila === 3 ? 14 : 0)]] : [[px0, (px0 + px1) / 2 - 2], [(px0 + px1) / 2 + 2, px1]];
    partes.forEach(([a, b], i) => {
      const [c, h] = colores[(fila + i) % colores.length]!;
      pilaDeContainers += container(a!, y, b! - a!, hf - 2, c, h, (fila + i) % 2 === 0, `t-cont-${fila}-${i}`);
    });
  }
  pilaDeContainers += nube(px1, (pila.arriba + pila.piso) / 2, 110, 200, T.sodio, 'xl', 0.28);

  const o = OJOS_DE_LOS_ASTILLEROS;
  const at = (id: string): [number, number] => [X(o[id]![0]), o[id]![1]];
  const [pbx, pby] = at('el-pibe-de-los-astilleros');
  const [rnx, rny] = at('la-rana-rubia');
  const [lyx, lyy] = at('la-gran-lady');
  const [btx, bty] = at('el-botija-rapado');
  const [hjx, hjy] = at('la-hija-del-fletero');
  const [lnx, lny] = at('la-del-lanchon');
  const [asx, asy] = at('el-as-del-club-paris');
  const [nvx, nvy] = [X(COSAS_DE_LOS_ASTILLEROS['la-pequena-novia-del-carioca']![0]), COSAS_DE_LOS_ASTILLEROS['la-pequena-novia-del-carioca']![1]];

  const pibe =
    forma(circulo(pbx, pby, 9), T.negro) +
    forma(`M${f(pbx - 12)} ${f(pby + 8)} L${f(pbx + 12)} ${f(pby + 8)} L${f(pbx + 14)} ${f(pila.arriba)} L${f(pbx - 14)} ${f(pila.arriba)} Z`, T.negro) +
    trazo(`M${f(pbx - 8)} ${f(pila.arriba - 2)} L${f(pbx - 12)} ${f(pila.arriba + 34)} M${f(pbx + 8)} ${f(pila.arriba - 2)} L${f(pbx + 6)} ${f(pila.arriba + 36)}`, T.negro, 7) +
    // La guitarra roja, cruzada.
    forma(elipse(pbx + 6, pby + 26, 11, 8), T.rojo) + forma(elipse(pbx + 14, pby + 20, 7, 6), T.rojo) +
    trazo(`M${f(pbx + 2)} ${f(pby + 30)} L${f(pbx + 36)} ${f(pby + 2)}`, T.negro, 2.6) + forma(circulo(pbx + 8, pby + 24, 2.2), T.negro);
  const rana =
    forma(`M${f(rnx - 18)} ${f(pila.arriba)} C${f(rnx - 20)} ${f(rny + 4)} ${f(rnx - 10)} ${f(rny - 6)} ${f(rnx - 6)} ${f(rny - 3)} Q${f(rnx)} ${f(rny - 5)} ${f(rnx + 6)} ${f(rny - 3)} C${f(rnx + 10)} ${f(rny - 6)} ${f(rnx + 20)} ${f(rny + 4)} ${f(rnx + 18)} ${f(pila.arriba)} Z`, T.negro) +
    trazo(`M${f(rnx - 18)} ${f(pila.arriba)} C${f(rnx - 20)} ${f(rny + 4)} ${f(rnx - 10)} ${f(rny - 6)} ${f(rnx - 6)} ${f(rny - 3)} Q${f(rnx)} ${f(rny - 5)} ${f(rnx + 6)} ${f(rny - 3)} C${f(rnx + 10)} ${f(rny - 6)} ${f(rnx + 20)} ${f(rny + 4)} ${f(rnx + 18)} ${f(pila.arriba)}`, T.oro, 1.6, 0.8);

  // La hamaca, de la pila al poste del farol, con la Gran Lady acostada al sol que no hay.
  const [h0x, h0y] = [X(hamaca.desde[0]), hamaca.desde[1]];
  const [h1x, h1y] = [X(hamaca.hasta[0]), hamaca.hasta[1]];
  const medio = `Q${f((h0x + h1x) / 2)} ${f((h0y + h1y) / 2 + hamaca.comba * 2)}`;
  const tela = `M${f(h0x)} ${f(h0y)} ${medio} ${f(h1x)} ${f(h1y)} L${f(h1x)} ${f(h1y + 8)} Q${f((h0x + h1x) / 2)} ${f((h0y + h1y) / 2 + hamaca.comba * 2 + 12)} ${f(h0x)} ${f(h0y + 8)} Z`;
  const lady =
    forma(circulo(lyx, lyy, 8), T.negro) +
    forma(`M${f(lyx + 6)} ${f(lyy - 4)} Q${f(lyx + 40)} ${f(lyy - 8)} ${f(lyx + 64)} ${f(lyy - 16)} L${f(lyx + 66)} ${f(lyy - 8)} Q${f(lyx + 40)} ${f(lyy + 6)} ${f(lyx + 4)} ${f(lyy + 6)} Z`, T.negro);
  const hamacaEntera =
    enmascarado('t-hamaca', tela, forma(tela, T.naranja) + [0, 1, 2].map((i) => trazo(`M${f(h0x)} ${f(h0y + 2 + i * 2.5)} ${medio.replace(/(\d+(?:\.\d+)?)$/, (m) => f(Number(m) + 2 + i * 2.5))} ${f(h1x)} ${f(h1y + 2 + i * 2.5)}`, i % 2 ? T.rojo : T.papel, 1.2, 0.7)).join('') + nube((h0x + h1x) / 2, h0y + 30, 60, 20, T.negro, 'm', 0.4)) +
    lady;

  // La planchada del ferry, y el botija rapado subiéndose a último momento.
  const [pm0, pm1] = [planchada.muelle, planchada.cubierta];
  const rampa = `M${f(X(pm0[0]))} ${pm0[1]} L${f(X(pm1[0]))} ${pm1[1]} L${f(X(pm1[0]) + 26)} ${pm1[1]} L${f(X(pm0[0]) + 26)} ${pm0[1]} Z`;
  const botija =
    forma(circulo(btx, bty, 9), T.negro) +
    forma(`M${f(btx - 11)} ${f(bty + 8)} L${f(btx + 11)} ${f(bty + 8)} L${f(btx + 14)} ${f(bty + 40)} L${f(btx + 4)} ${f(bty + 40)} L${f(btx + 10)} ${f(bty + 58)} L${f(btx)} ${f(bty + 58)} L${f(btx - 4)} ${f(bty + 42)} L${f(btx - 14)} ${f(bty + 54)} L${f(btx - 20)} ${f(bty + 48)} L${f(btx - 10)} ${f(bty + 36)} Z`, T.negro) +
    nube(btx - 3, bty - 4, 6, 4, T.clara, 's', 0.4);
  // La hija del fletero en la popa, con la valija; no mira para atrás.
  const hija =
    forma(circulo(hjx, hjy, 7), T.negro) + forma(`M${f(hjx - 9)} ${f(hjy + 6)} L${f(hjx + 9)} ${f(hjy + 6)} L${f(hjx + 13)} ${f(hjy + 32)} L${f(hjx - 13)} ${f(hjy + 32)} Z`, T.negro) +
    forma(caja(hjx + 14, hjy + 16, 18, 14), T.naranjaHonda) + trazo(`M${f(hjx + 19)} ${f(hjy + 16)} q4 -6 8 0`, T.negro, 1.6);

  // El lanchón amarrado, con la proa para el muelle, y la del lanchón sentada en la proa.
  const [l0, l1] = [X(lanchon.x0), X(lanchon.x1)];
  const cascoLanchon = `M${f(l0)} ${f(lanchon.agua - 40)} Q${f((l0 + l1) / 2)} ${f(lanchon.agua - 30)} ${f(l1)} ${f(lanchon.agua - 36)} L${f(l1 - 10)} ${f(lanchon.agua)} L${f(l0 + 34)} ${f(lanchon.agua)} Z`;
  const delLanchon =
    enmascarado('t-lanchon', cascoLanchon, forma(cascoLanchon, T.azul) + forma(caja(l0, lanchon.agua - 30, l1 - l0, 6), T.naranja, 0.95) + nube(l1, lanchon.agua, 60, 30, T.negro, 'm', 0.6) + nube(l0 + 30, lanchon.agua - 34, 40, 10, T.sodio, 'm', 0.5)) +
    `<g filter="url(#tiza)">${trazo(cascoLanchon, T.clara, 2, 0.85)}</g>` +
    forma(circulo(lnx, lny, 7), T.negro) + forma(`M${f(lnx - 9)} ${f(lny + 6)} L${f(lnx + 10)} ${f(lny + 6)} L${f(lnx + 14)} ${f(lanchon.agua - 34)} L${f(lnx - 12)} ${f(lanchon.agua - 34)} Z`, T.negro) +
    trazo(`M${f(lnx - 4)} ${f(lanchon.agua - 34)} L${f(lnx - 28)} ${f(lanchon.agua - 20)} M${f(lnx + 4)} ${f(lanchon.agua - 34)} L${f(lnx - 22)} ${f(lanchon.agua - 14)}`, T.negro, 4) +
    trazo(`M${f(l0 + 6)} ${f(lanchon.agua - 32)} Q${f(l0 - 30)} ${f(muelle + 10)} ${f(l0 - 50)} ${f(muelle + 30)}`, T.clara, 1.6, 0.6);

  // La novia del carioca, de espaldas en el canto del muelle, mirando el río quieto.
  const novia =
    forma(circulo(nvx, nvy - 22, 8), T.negro) + forma(circulo(nvx + 4, nvy - 30, 5), T.negro) +
    forma(`M${f(nvx - 8)} ${f(nvy - 14)} L${f(nvx + 8)} ${f(nvy - 14)} L${f(nvx + 18)} ${f(nvy + 34)} L${f(nvx - 18)} ${f(nvy + 34)} Z`, T.negro) +
    soplo(`M${f(nvx - 8)} ${f(nvy - 14)} L${f(nvx - 18)} ${f(nvy + 34)} L${f(nvx - 14)} ${f(nvy + 34)} L${f(nvx - 5)} ${f(nvy - 12)} Z`, T.sodio, 'xs', 0.5);

  // La caña apoyada en la bita, y el que mordió el anzuelo colgando de la línea.
  const [cx, cpy] = [X(cania.x), cania.piso];
  const [ptx, pty] = [X(cania.punta[0]), cania.punta[1]];
  const [psx, psy] = [X(pescado.x), pescado.y];
  const bita = (bx: number, by: number): string => forma(`M${f(bx - 9)} ${f(by)} L${f(bx - 7)} ${f(by - 16)} L${f(bx - 12)} ${f(by - 20)} L${f(bx + 12)} ${f(by - 20)} L${f(bx + 7)} ${f(by - 16)} L${f(bx + 9)} ${f(by)} Z`, T.negro) + trazo(`M${f(bx - 12)} ${f(by - 20)} L${f(bx + 12)} ${f(by - 20)}`, T.clara, 1.4, 0.7);
  const pez = `M${f(psx)} ${f(psy)} C${f(psx + 12)} ${f(psy + 10)} ${f(psx + 12)} ${f(psy + 34)} ${f(psx + 2)} ${f(psy + 46)} L${f(psx + 12)} ${f(psy + 60)} L${f(psx)} ${f(psy + 54)} L${f(psx - 12)} ${f(psy + 60)} L${f(psx - 2)} ${f(psy + 46)} C${f(psx - 12)} ${f(psy + 34)} ${f(psx - 12)} ${f(psy + 10)} ${f(psx)} ${f(psy)} Z`;
  const pesca =
    bita(cx, cpy) +
    trazo(`M${f(cx - 4)} ${f(cpy - 6)} L${f(ptx)} ${f(pty)}`, T.negro, 3) + trazo(`M${f(cx - 4)} ${f(cpy - 7)} L${f(ptx)} ${f(pty - 1)}`, T.clara, 0.9, 0.5) +
    trazo(`M${f(ptx)} ${f(pty)} L${f(psx)} ${f(psy - 4)}`, T.clara, 0.8, 0.7) +
    trazo(`M${f(psx)} ${f(psy - 4)} q-4 0 -3 5`, T.clara, 1.2) +
    enmascarado('t-pez', pez, forma(pez, T.azul) + nube(psx - 4, psy + 20, 6, 20, T.clara, 's', 0.6) + nube(psx + 6, psy + 30, 8, 24, T.negro, 's', 0.6)) +
    `<g filter="url(#tiza)">${trazo(pez, T.clara, 1.4, 0.8)}${[0, 1, 2, 3].map((i) => trazo(`M${f(psx - 6)} ${f(psy + 14 + i * 7)} q6 4 12 0`, T.clara, 1, 0.6)).join('')}</g>` +
    forma(circulo(psx + 3, psy + 9, 1.8), T.papel);

  // El as del Club París, esperando con todo lo suyo en una valija.
  const [vx, vy] = [X(valija.x), valija.piso];
  const as =
    forma(circulo(asx, asy, 9), T.negro) +
    forma(`M${f(asx - 12)} ${f(asy + 8)} L${f(asx + 12)} ${f(asy + 8)} L${f(asx + 14)} ${f(asy + 44)} L${f(asx + 8)} ${f(vy)} L${f(asx + 1)} ${f(vy)} L${f(asx)} ${f(asy + 46)} L${f(asx - 2)} ${f(vy)} L${f(asx - 9)} ${f(vy)} L${f(asx - 14)} ${f(asy + 44)} Z`, T.negro) +
    forma(`M${f(asx - 12)} ${f(asy - 6)} L${f(asx + 12)} ${f(asy - 6)} L${f(asx + 8)} ${f(asy - 14)} L${f(asx - 8)} ${f(asy - 14)} Z`, T.negro) + forma(elipse(asx, asy - 6, 16, 3), T.negro) +
    enmascarado('t-valija', caja(vx - 22, vy - 30, 44, 30), forma(caja(vx - 22, vy - 30, 44, 30), T.naranjaHonda) + nube(vx + 14, vy - 6, 20, 16, T.negro, 'm', 0.6) + trazo(`M${f(vx - 10)} ${f(vy - 30)} l0 30 M${f(vx + 10)} ${f(vy - 30)} l0 30`, T.negro, 2.4, 0.7)) +
    trazo(`M${f(vx - 7)} ${f(vy - 30)} q7 -9 14 0`, T.negro, 2.6);

  // El balde de las almejas.
  const [bdx, bdy] = [X(balde.x), balde.piso];
  const cubo = `M${f(bdx - 22)} ${f(bdy - 40)} L${f(bdx + 22)} ${f(bdy - 40)} L${f(bdx + 17)} ${f(bdy)} L${f(bdx - 17)} ${f(bdy)} Z`;
  const almejas = [[-12, -40, -20], [0, -44, 10], [12, -40, 30], [-4, -38, -40]].map(([dx, dy, g]) =>
    `<g transform="rotate(${g} ${f(bdx + dx!)} ${f(bdy + dy!)})">${forma(elipse(bdx + dx!, bdy + dy!, 7, 5), T.clara)}${trazo(`M${f(bdx + dx! - 5)} ${f(bdy + dy! - 1)} q5 -4 10 0 M${f(bdx + dx! - 4)} ${f(bdy + dy! + 2)} q4 -3 8 0`, T.azul, 0.9)}</g>`).join('');
  const elBalde =
    nube(bdx + 4, bdy + 2, 28, 5, T.negro, 's', 0.7) + almejas +
    enmascarado('t-balde', cubo, forma(cubo, T.azul) + nube(bdx + 12, bdy - 20, 12, 30, T.negro, 'm', 0.6) + nube(bdx - 10, bdy - 26, 6, 18, T.sodio, 's', 0.5)) +
    `<g filter="url(#tiza)">${trazo(cubo, T.clara, 1.4, 0.8)}${trazo(`M${f(bdx - 22)} ${f(bdy - 40)} Q${f(bdx)} ${f(bdy - 70)} ${f(bdx + 22)} ${f(bdy - 40)}`, T.clara, 1.4, 0.7)}</g>`;

  return (
    filtroTiza() +
    `<g filter="url(#rociado)">` +
    ferry(k) +
    delLanchon +
    // El muelle: tablones oscuros con el canto de tiza, y la luz del farol que cae.
    soplo(`M-10 ${muelle - 2} L${ancho + 10} ${muelle - 2} L${ancho + 10} ${alto + 10} L-10 ${alto + 10} Z`, T.negro, 'xs') +
    nube(ancho / 2, muelle + 20, ancho * 0.7, 30, T.noche, 'l', 0.7) +
    luzDelFarol +
    `</g>` +
    `<g filter="url(#tiza)">${tablones}${trazo(`M-10 ${muelle} L${ancho + 10} ${muelle}`, T.clara, 2.4, 0.7)}${trazo(rampa, T.clara, 1.6, 0.7)}</g>` +
    forma(rampa, T.negro, 0.85) +
    `<g filter="url(#rociado)">${pilaDeContainers}</g>` +
    poste +
    hamacaEntera +
    pibe + rana + botija + hija + novia + pesca + as + elBalde
  );
}

/** Lo de adelante: rollos de cabo como los espirales de la contratapa, y una bita, con huecos. */
function astilleroFrente(ancho = ANCHO, alto = ALTO): string {
  const rnd = azar(347);
  let cosas = '';
  for (let x = 60 + rnd() * 80; x < ancho; x += 260 + rnd() * 260) {
    if (rnd() < 0.5) {
      cosas += forma(elipse(x, alto - 14, 56, 20), T.negro) + espiralDeTiza(x, alto - 16, 52, 4, T.clara, 3, 0.75, 0.36);
    } else {
      cosas += forma(`M${f(x - 22)} ${alto + 4} L${f(x - 16)} ${alto - 50} L${f(x - 26)} ${alto - 58} L${f(x + 26)} ${alto - 58} L${f(x + 16)} ${alto - 50} L${f(x + 22)} ${alto + 4} Z`, T.negro) +
        trazo(`M${f(x - 26)} ${alto - 58} L${f(x + 26)} ${alto - 58}`, T.clara, 2, 0.7) +
        trazo(`M${f(x + 16)} ${alto - 40} Q${f(x + 120)} ${alto - 10} ${f(x + 220)} ${alto + 10}`, T.clara, 3, 0.55);
    }
  }
  return filtroTiza() + `<g filter="url(#tiza)">${cosas}</g>`;
}

/* ------------------------------------------------------------------
   La mesa servida, en el collage rojo de *La mosca y la sopa*
   ------------------------------------------------------------------
   El frente de *La mosca y la sopa* es un rojo plano con una foto del escenario: luces naranjas y
   un seguidor blanco que cruza en diagonal. La contratapa es collage de papel rasgado: el edificio
   de columnas en sepia, la olla con el cucharón. La mesa está armada así: la pared es ese rojo, con
   recortes pegados; el seguidor se escapa de la foto y cae en la olla, que es un recorte con su
   canto de papel blanco. Los que cenan son sombras del otro lado del mantel.
*/

const M2 = {
  rojo: 'var(--entorno-mesa-rojo)',
  luz: 'var(--entorno-mesa-luz)',
  haz: 'var(--entorno-mesa-haz)',
  papel: 'var(--entorno-mesa-papel)',
  sepia: 'var(--entorno-mesa-sepia)',
  sepiaClara: 'var(--entorno-mesa-sepia-clara)',
  sepiaHonda: 'var(--entorno-mesa-sepia-honda)',
  naranja: 'var(--disco-la-mosca-y-la-sopa-tinta)',
  petroleo: 'var(--disco-la-mosca-y-la-sopa-apoyo)',
  plata: 'var(--disco-ultimo-bondi-a-finisterre-tinta)',
  pastura: 'var(--entorno-pastura)',
  negro: 'var(--fondo)',
  blanco: 'var(--papel)',
  oro: 'var(--acento-2)',
  vivo: 'var(--marca-rojo)',
};

/**
 * Un recorte pegado: el canto de papel blanco rasgado, apenas más grande, y adentro lo que sea,
 * cortado con el mismo rasgado. Todo girado un poco, como se pega a mano.
 */
function recorte(id: string, x: number, y: number, w: number, h: number, giro: number, adentro: string, semilla: number): string {
  const ps: Punto[] = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const afuera: Punto[] = [[x - 7, y - 7], [x + w + 7, y - 7], [x + w + 7, y + h + 7], [x - 7, y + h + 7]];
  const corte = rasgado(ps, 2, semilla, 6);
  return (
    `<g transform="rotate(${giro} ${f(x + w / 2)} ${f(y + h / 2)})">` +
    forma(rasgado(afuera, 4, semilla + 1, 5), M2.papel) +
    enmascarado(id, corte, adentro) +
    `</g>`
  );
}

/** El edificio de columnas de la contratapa, en sepia, como una foto vieja. */
function columnata(x: number, y: number, w: number, h: number): string {
  const base = y + h * 0.84;
  const capitel = y + h * 0.36;
  let columnas = '';
  const n = 6;
  for (let i = 0; i < n; i++) {
    const cx = x + w * 0.1 + (i * w * 0.62) / (n - 1);
    const r = w * 0.03;
    columnas += forma(caja(cx - r, capitel, r * 2, base - capitel), M2.sepiaClara) + nube(cx + r * 0.6, (capitel + base) / 2, r * 0.5, (base - capitel) / 2, M2.sepiaHonda, 's', 0.8) + forma(caja(cx - r * 1.4, capitel - 6, r * 2.8, 6), M2.sepiaClara);
  }
  return (
    forma(caja(x - 10, y - 10, w + 20, h + 20), M2.sepiaClara) +
    nube(x + w * 0.8, y + h * 0.2, w * 0.4, h * 0.3, M2.blanco, 'xl', 0.4) +
    forma(`M${f(x + w * 0.02)} ${f(capitel - 14)} L${f(x + w * 0.4)} ${f(y + h * 0.1)} L${f(x + w * 0.78)} ${f(capitel - 14)} Z`, M2.sepia) +
    forma(caja(x + w * 0.02, capitel - 16, w * 0.76, 10), M2.sepiaHonda) +
    forma(caja(x + w * 0.04, capitel, w * 0.72, base - capitel), M2.sepiaHonda) +
    columnas +
    forma(caja(x + w * 0.72, y + h * 0.3, w * 0.3, h * 0.6), M2.sepia) +
    [0, 1, 2].map((i) => forma(circulo(x + w * 0.8 + i * w * 0.07, y + h * 0.48, w * 0.022), M2.sepiaHonda)).join('') +
    forma(caja(x - 10, base, w + 20, h), M2.sepiaHonda) +
    [0, 1, 2, 3].map((i) => trazo(`M${f(x)} ${f(base + 4 + i * 6)} L${f(x + w * 0.8)} ${f(base + 4 + i * 6)}`, M2.sepia, 1.4, 0.7)).join('') +
    nube(x, y + h, w * 0.6, h * 0.5, M2.negro, 'xl', 0.45)
  );
}

/** La foto del escenario del frente: las luces naranjas, la banda chiquita y el seguidor. */
function fotoDelEscenario(x: number, y: number, w: number, h: number): string {
  let luces = '';
  for (let i = 0; i < 14; i++) {
    const lx = x + w * 0.12 + i * w * 0.055;
    luces += nube(lx, y + h * 0.28 + (i % 3) * 3, 3, 3, M2.oro, 'xs', 0.9) + soplo(poli([[lx - 1, y + h * 0.28], [lx + 1, y + h * 0.28], [lx + 10 - i * 1.4, y + h * 0.7], [lx - 8 - i * 0.8, y + h * 0.7]]), M2.luz, 's', 0.35);
  }
  const banda = [0.3, 0.42, 0.52, 0.62, 0.72].map((t, i) => forma(`M${f(x + w * t - 3)} ${f(y + h * 0.74)} l1 -${12 + (i % 2) * 4} a3 3 0 1 1 4 0 l1 ${12 + (i % 2) * 4} Z`, M2.negro)).join('');
  return (
    forma(caja(x - 10, y - 10, w + 20, h + 20), M2.negro) +
    nube(x + w * 0.5, y + h * 0.5, w * 0.36, h * 0.22, M2.luz, 'l', 0.85) +
    nube(x + w * 0.5, y + h * 0.5, w * 0.2, h * 0.1, M2.oro, 'l', 0.4) +
    luces +
    forma(caja(x + w * 0.2, y + h * 0.74, w * 0.6, 4), M2.negro) +
    banda +
    soplo(poli([[x + w * 0.97, y + h * 0.02], [x + w, y + h * 0.08], [x + w * 0.74, y + h * 0.95], [x + w * 0.62, y + h * 0.95]]), M2.haz, 's', 0.7) +
    nube(x + w * 0.97, y + h * 0.04, 6, 6, M2.blanco, 'xs')
  );
}

function mesaLejos(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const { x0, x1, arriba, abajo } = MESA.ventana;
  const [vx0, vx1] = [x0 * k, x1 * k];
  const [hx, hy] = [MESA.haz.desde[0] * k, MESA.haz.desde[1]];
  const [ox, oy] = [MESA.haz.hasta[0] * k, MESA.haz.hasta[1]];
  const ventana =
    forma(caja(vx0 - 8, arriba - 8, vx1 - vx0 + 16, abajo - arriba + 16), M2.negro) +
    enmascarado('m-ventana', caja(vx0, arriba, vx1 - vx0, abajo - arriba),
      forma(caja(vx0, arriba, vx1 - vx0, abajo - arriba), M2.petroleo) +
      estrellas(vx0, arriba, vx1, abajo - 50, 20, M2.blanco, 41) +
      // Del otro lado de la ventana, la pastura brilla naranja en lo oscuro, con su palo.
      nube((vx0 + vx1) / 2, abajo - 6, (vx1 - vx0) * 0.7, 26, M2.pastura, 'm', 0.95) +
      nube((vx0 + vx1) / 2, abajo - 10, (vx1 - vx0) * 0.4, 12, M2.oro, 'm', 0.4) +
      trazo(`M${f((vx0 + vx1) / 2)} ${f(abajo - 10)} l0 -16`, M2.negro, 2)) +
    trazo(`M${f((vx0 + vx1) / 2)} ${arriba} L${f((vx0 + vx1) / 2)} ${abajo} M${f(vx0)} ${f((arriba + abajo) / 2)} L${f(vx1)} ${f((arriba + abajo) / 2)}`, M2.negro, 6);
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${M2.rojo}"/>` +
    // De noche el rojo se apaga hacia los bordes y hacia abajo; donde cae el seguidor, se prende.
    nube(0, alto / 2, ancho * 0.3, alto * 0.7, M2.negro, 'xl', 0.75) +
    nube(ancho, alto * 0.7, ancho * 0.3, alto * 0.6, M2.negro, 'xl', 0.6) +
    nube(ancho / 2, alto, ancho * 0.7, 260, M2.negro, 'xl', 0.85) +
    nube(ancho / 2, 0, ancho * 0.5, 60, M2.negro, 'xl', 0.5) +
    recorte('m-columnas', 30 * k, 34, 330, 186, -3, columnata(30 * k, 34, 330, 186), 421) +
    ventana +
    recorte('m-foto', 586 * k, 32, 280, 168, 2.5, fotoDelEscenario(586 * k, 32, 280, 168), 431) +
    // El seguidor se escapa de la foto y baja por la pared hasta la olla.
    soplo(poli([[hx - 6, hy - 4], [hx + 8, hy + 8], [ox + 74, oy], [ox - 74, oy]]), M2.haz, 'm', 0.2) +
    soplo(poli([[hx - 2, hy], [hx + 4, hy + 4], [ox + 30, oy], [ox - 30, oy]]), M2.haz, 'm', 0.18) +
    forma(caja(-10, MESA.tablero.atras - 6, ancho + 20, alto), M2.negro, 0.55) +
    `</g>`
  );
}

/** Una mosca: el cuerpo negro, las alas de vidrio, y un brillo en el ojo. */
function mosca(x: number, y: number, t: number, punteada = false): string {
  if (punteada) {
    const linea = (d: string): string => `<path d="${d}" fill="none" stroke="${M2.blanco}" stroke-width="1.6" stroke-dasharray="2 4" stroke-linecap="round" opacity="0.8"/>`;
    return linea(elipse(x, y + t * 0.2, t * 0.5, t * 0.8)) + linea(circulo(x, y - t * 0.8, t * 0.4)) + linea(elipse(x - t * 0.9, y - t * 0.3, t * 0.8, t * 0.38)) + linea(elipse(x + t * 0.9, y - t * 0.3, t * 0.8, t * 0.38));
  }
  return (
    forma(elipse(x - t * 0.8, y - t * 0.4, t * 0.8, t * 0.36), M2.haz, 0.45) + forma(elipse(x + t * 0.8, y - t * 0.4, t * 0.8, t * 0.36), M2.haz, 0.45) +
    forma(elipse(x, y + t * 0.2, t * 0.42, t * 0.7), M2.negro) + forma(circulo(x, y - t * 0.6, t * 0.36), M2.negro) +
    forma(circulo(x - t * 0.12, y - t * 0.72, t * 0.1), M2.blanco, 0.7) +
    trazo(`M${f(x - t * 0.3)} ${f(y + t * 0.1)} l${f(-t * 0.5)} ${f(t * 0.5)} M${f(x + t * 0.3)} ${f(y + t * 0.1)} l${f(t * 0.5)} ${f(t * 0.5)} M${f(x - t * 0.3)} ${f(y + t * 0.4)} l${f(-t * 0.4)} ${f(t * 0.6)} M${f(x + t * 0.3)} ${f(y + t * 0.4)} l${f(t * 0.4)} ${f(t * 0.6)}`, M2.negro, t * 0.1)
  );
}

function mesaPiso(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const X = (x: number): number => x * k;
  const { atras, adelante, izq, der, cuelga } = MESA.tablero;
  const [ti, td] = [X(izq), X(der)];
  const tablero = `M${f(ti)} ${atras} L${f(td)} ${atras} L${f(td + 30)} ${adelante} L${f(ti - 30)} ${adelante} Z`;
  const rnd = azar(433);
  // El mantel que cuelga adelante: pliegues, y abajo el borde rasgado, como un papel más del collage.
  const faldon: Punto[] = [[ti - 30, adelante], [td + 30, adelante], [td + 30, cuelga], [ti - 30, cuelga]];
  let pliegues = '';
  for (let x = ti - 20; x < td + 20; x += 24 + rnd() * 20) pliegues += nube(x, (adelante + cuelga) / 2 + 6, 5, (cuelga - adelante) * 0.5, M2.sepia, 'm', 0.5);

  const o = OJOS_DE_LA_MESA;
  const at = (id: string): [number, number] => [X(o[id]![0]), o[id]![1]];
  /** Uno que cena del otro lado: el respaldo alto, los hombros y la cabeza, en sombra. */
  const comensal = (id: string, extra = ''): string => {
    const [x, y] = at(id);
    return (
      forma(`M${f(x - 30)} ${atras} L${f(x - 30)} ${f(y - 40)} Q${f(x)} ${f(y - 62)} ${f(x + 30)} ${f(y - 40)} L${f(x + 30)} ${atras} Z`, M2.negro, 0.75) +
      forma(`M${f(x - 30)} ${atras + 2} C${f(x - 30)} ${f(y + 20)} ${f(x - 16)} ${f(y + 14)} ${f(x)} ${f(y + 14)} C${f(x + 16)} ${f(y + 14)} ${f(x + 30)} ${f(y + 20)} ${f(x + 30)} ${atras + 2} Z`, M2.negro) +
      forma(circulo(x, y, 13), M2.negro) +
      extra
    );
  };
  const [cx, cy] = at('el-canibal');
  const [mx, my] = at('la-mula-de-la-enfermedad');
  const [px, py] = at('pituca');
  const [mtx, mty] = at('el-club-de-mantis');
  const [tx, ty] = at('la-tipa-rapaz');
  const [vx, vy] = at('el-verdugo-que-cena');
  const servilleta = forma(`M${f(cx - 12)} ${f(cy + 16)} L${f(cx + 12)} ${f(cy + 16)} L${f(cx)} ${f(cy + 38)} Z`, M2.blanco, 0.9);
  const toallon = forma(`M${f(px - 30)} ${f(py + 24)} C${f(px - 20)} ${f(py + 8)} ${f(px + 20)} ${f(py + 8)} ${f(px + 30)} ${f(py + 24)} L${f(px + 26)} ${f(atras)} L${f(px + 16)} ${f(atras)} L${f(px + 12)} ${f(py + 22)} L${f(px - 12)} ${f(py + 22)} L${f(px - 16)} ${f(atras)} L${f(px - 26)} ${f(atras)} Z`, M2.blanco, 0.85) +
    [0, 1].map((i) => trazo(`M${f(px - 28 + i * 4)} ${f(py + 30 + i * 6)} L${f(px - 22 + i * 4)} ${f(atras)}`, M2.vivo, 2, 0.8)).join('') +
    trazo(`M${f(px + 18)} ${f(py + 40)} q3 -4 6 0 q3 4 6 0`, M2.naranja, 1.2, 0.9);
  const capucha = forma(`M${f(vx - 16)} ${f(vy + 10)} Q${f(vx - 16)} ${f(vy - 20)} ${f(vx)} ${f(vy - 38)} Q${f(vx + 16)} ${f(vy - 20)} ${f(vx + 16)} ${f(vy + 10)} Z`, M2.negro);
  const orejas = forma(`M${f(mx - 8)} ${f(my - 10)} L${f(mx - 18)} ${f(my - 40)} L${f(mx - 2)} ${f(my - 12)} Z M${f(mx + 8)} ${f(my - 10)} L${f(mx + 18)} ${f(my - 40)} L${f(mx + 2)} ${f(my - 12)} Z`, M2.negro) +
    forma(elipse(mx, my + 14, 10, 12), M2.negro) + forma(caja(mx - 3, my + 22, 9, 3), M2.oro);
  /** Una mantis de frente: la cabeza en triángulo con los ojos grandes y los brazos plegados para rezar. */
  const unaMantis = (x: number, y: number, escala: number): string => {
    const e = (v: number): string => f(v * escala);
    return (
      forma(`M${f(x - 11 * escala)} ${f(y - 6 * escala)} L${f(x + 11 * escala)} ${f(y - 6 * escala)} L${f(x)} ${f(y + 9 * escala)} Z`, M2.negro) +
      forma(circulo(x - 9 * escala, y - 7 * escala, 4 * escala), M2.negro) + forma(circulo(x + 9 * escala, y - 7 * escala, 4 * escala), M2.negro) +
      forma(`M${f(x - 4 * escala)} ${f(y + 6 * escala)} L${f(x + 4 * escala)} ${f(y + 6 * escala)} L${f(x + 6 * escala)} ${atras} L${f(x - 6 * escala)} ${atras} Z`, M2.negro) +
      trazo(`M${f(x - 4 * escala)} ${f(y + 14 * escala)} l-${e(10)} ${e(12)} l${e(8)} -${e(18)} M${f(x + 4 * escala)} ${f(y + 14 * escala)} l${e(10)} ${e(12)} l-${e(8)} -${e(18)}`, M2.negro, 3.4 * escala) +
      trazo(`M${f(x - 3 * escala)} ${f(y - 10 * escala)} q-${e(6)} -${e(16)} -${e(16)} -${e(20)} M${f(x + 3 * escala)} ${f(y - 10 * escala)} q${e(6)} -${e(16)} ${e(16)} -${e(20)}`, M2.negro, 1.4)
    );
  };
  const mantis = unaMantis(mtx - 34, mty + 10, 0.85) + unaMantis(mtx + 34, mty + 12, 0.8) + unaMantis(mtx, mty, 1);
  const tipa =
    forma(circulo(tx, ty, 11), M2.negro) +
    forma(`M${f(tx - 14)} ${f(ty + 10)} L${f(tx + 14)} ${f(ty + 10)} L${f(tx + 22)} ${f(atras + 20)} L${f(tx - 22)} ${f(atras + 20)} Z`, M2.negro) +
    trazo(`M${f(tx + 12)} ${f(ty + 18)} L${f(tx + 30)} ${f(ty + 36)} L${f(tx + 36)} ${f(ty + 22)}`, M2.negro, 5) +
    `<path d="M${f(tx + 30)} ${f(ty + 2)} Q${f(tx + 36)} ${f(ty + 18)} ${f(tx + 42)} ${f(ty + 2)} Z" fill="${M2.vivo}" opacity="0.85"/>` +
    trazo(`M${f(tx + 29)} ${f(ty)} Q${f(tx + 36)} ${f(ty + 22)} ${f(tx + 43)} ${f(ty)} M${f(tx + 36)} ${f(ty + 12)} L${f(tx + 36)} ${f(ty + 24)} M${f(tx + 31)} ${f(ty + 24)} L${f(tx + 41)} ${f(ty + 24)}`, M2.haz, 1.4, 0.9);
  const comensales =
    comensal('el-canibal', servilleta) +
    comensal('el-canibal-desdentado') +
    `<g>${orejas}${comensal('la-mula-de-la-enfermedad')}</g>` +
    comensal('pituca', toallon) +
    mantis +
    tipa +
    comensal('el-verdugo-que-cena', capucha);

  // Lo que hay en la mesa.
  const platos = [cx, X(OJOS_DE_LA_MESA['el-canibal-desdentado']![0]), mx, px, mtx, vx].map((x) => forma(elipse(x, atras + 12, 24, 6), M2.blanco, 0.9) + forma(elipse(x, atras + 12, 16, 3.6), M2.papel)).join('');
  const { x: ox0, piso: op, ancho: ow, alto: oh } = MESA.olla;
  const ox = X(ox0);
  const ollaAdentro =
    forma(caja(ox - ow, op - oh - 40, ow * 2, oh + 60), M2.rojo) +
    forma(`M${f(ox - ow / 2)} ${f(op - oh + 10)} L${f(ox + ow / 2)} ${f(op - oh + 10)} L${f(ox + ow / 2 - 4)} ${f(op - 8)} Q${f(ox)} ${f(op + 4)} ${f(ox - ow / 2 + 4)} ${f(op - 8)} Z`, M2.plata) +
    nube(ox + ow * 0.3, op - oh / 2, ow * 0.25, oh * 0.6, M2.negro, 'm', 0.6) +
    nube(ox - ow * 0.25, op - oh / 2, ow * 0.1, oh * 0.5, M2.blanco, 's', 0.55) +
    forma(elipse(ox, op - oh + 10, ow / 2, 12), M2.sepiaHonda) +
    forma(elipse(ox, op - oh + 12, ow / 2 - 6, 8), M2.naranja) +
    nube(ox - 10, op - oh + 10, 30, 4, M2.oro, 's', 0.6) +
    trazo(`M${f(ox + 10)} ${f(op - oh + 10)} L${f(ox + 50)} ${f(op - oh - 44)}`, M2.plata, 5) +
    trazo(`M${f(ox + 10)} ${f(op - oh + 9)} L${f(ox + 50)} ${f(op - oh - 45)}`, M2.blanco, 1.2, 0.6) +
    [-ow / 2 - 8, ow / 2 + 8].map((dx) => forma(elipse(ox + dx, op - oh + 26, 9, 5), M2.plata)).join('');
  const vapor = [0, 1, 2].map((i) => soplo(`M${f(ox - 30 + i * 26)} ${f(op - oh)} C${f(ox - 50 + i * 26)} ${f(op - oh - 40)} ${f(ox - 10 + i * 26)} ${f(op - oh - 70)} ${f(ox - 30 + i * 26)} ${f(op - oh - 120)} L${f(ox - 22 + i * 26)} ${f(op - oh - 120)} C${f(ox + i * 26)} ${f(op - oh - 70)} ${f(ox - 40 + i * 26)} ${f(op - oh - 40)} ${f(ox - 20 + i * 26)} ${f(op - oh)} Z`, M2.blanco, 'm', 0.22)).join('');

  const [mix, mip] = [X(MESA.miel.x), MESA.miel.piso];
  const miel =
    nube(mix, mip - 16, 30, 26, M2.oro, 'l', 0.4) +
    enmascarado('m-miel', caja(mix - 13, mip - 30, 26, 30), forma(caja(mix - 13, mip - 30, 26, 30), M2.oro) + nube(mix + 8, mip - 10, 8, 16, M2.naranja, 's', 0.8) + nube(mix - 6, mip - 20, 3, 8, M2.blanco, 's', 0.8)) +
    forma(caja(mix - 14, mip - 38, 28, 8), M2.negro);
  let hormigas = '';
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const hx = mix + 16 + t * 46;
    const hy = mip + 2 + t * 30;
    hormigas += forma(elipse(hx, hy, 2.6, 1.6), M2.negro) + forma(circulo(hx - 3, hy - 0.6, 1.3), M2.negro) + trazo(`M${f(hx - 2)} ${f(hy)} l-1 2.6 M${f(hx)} ${f(hy)} l0 2.8 M${f(hx + 2)} ${f(hy)} l1 2.6`, M2.negro, 0.7);
  }
  const [vax, vap] = [X(MESA.vaso.x), MESA.vaso.piso];
  const vaso =
    mosca(vax, vap - 18, 8) +
    `<path d="M${f(vax - 17)} ${f(vap)} L${f(vax - 13)} ${f(vap - 44)} L${f(vax + 13)} ${f(vap - 44)} L${f(vax + 17)} ${f(vap)} Z" fill="${M2.haz}" opacity="0.18"/>` +
    trazo(`M${f(vax - 17)} ${f(vap)} L${f(vax - 13)} ${f(vap - 44)} L${f(vax + 13)} ${f(vap - 44)} L${f(vax + 17)} ${f(vap)} Z`, M2.haz, 1.6, 0.85) +
    trazo(`M${f(vax - 8)} ${f(vap - 38)} L${f(vax - 10)} ${f(vap - 6)}`, M2.blanco, 2, 0.5) + forma(elipse(vax, vap, 17, 3), M2.haz, 0.3);
  const [mbx, mbp] = [X(MESA.membrillo.x), MESA.membrillo.piso];
  const membrillo = forma(`M${f(mbx - 18)} ${f(mbp)} L${f(mbx - 14)} ${f(mbp - 16)} L${f(mbx + 16)} ${f(mbp - 18)} L${f(mbx + 18)} ${f(mbp - 2)} Z`, M2.sepiaHonda) +
    forma(`M${f(mbx - 14)} ${f(mbp - 16)} L${f(mbx + 16)} ${f(mbp - 18)} L${f(mbx + 12)} ${f(mbp - 22)} L${f(mbx - 16)} ${f(mbp - 20)} Z`, M2.vivo, 0.8) + nube(mbx - 4, mbp - 12, 6, 2, M2.blanco, 's', 0.5);
  const [hdx, hdy] = [X(COSAS_DE_LA_MESA['la-hormiga-dormida']![0]), COSAS_DE_LA_MESA['la-hormiga-dormida']![1]];
  const dormida = forma(elipse(hdx, hdy, 4.4, 2.6), M2.negro) + forma(circulo(hdx + 5, hdy, 2.2), M2.negro) +
    trazo(`M${f(hdx - 2)} ${f(hdy - 2)} l-2 -5 M${f(hdx)} ${f(hdy - 2)} l0 -6 M${f(hdx + 2)} ${f(hdy - 2)} l2 -5`, M2.negro, 0.9) +
    trazo(`M${f(hdx + 8)} ${f(hdy - 8)} q3 -2 6 0 M${f(hdx + 12)} ${f(hdy - 14)} q2 -1.5 4 0`, M2.blanco, 1, 0.7);
  const [qx, qp] = [X(MESA.queso.x), MESA.queso.piso];
  const queso = recorte('m-queso', qx - 24, qp - 26, 48, 26, -4,
    forma(caja(qx - 40, qp - 40, 80, 60), M2.rojo) +
    forma(`M${f(qx - 24)} ${f(qp)} L${f(qx - 24)} ${f(qp - 16)} L${f(qx + 24)} ${f(qp - 26)} L${f(qx + 24)} ${f(qp)} Z`, M2.oro) +
    forma(`M${f(qx - 24)} ${f(qp - 16)} L${f(qx + 24)} ${f(qp - 26)} L${f(qx + 24)} ${f(qp - 22)} L${f(qx - 24)} ${f(qp - 12)} Z`, M2.sepiaClara) +
    [[-10, -6, 3], [6, -10, 4], [14, -4, 2.4]].map(([dx, dy, r]) => forma(circulo(qx + dx!, qp + dy!, r!), M2.naranja, 0.7)).join(''), 441);
  const [ax, ap] = [X(MESA.manzana.x), MESA.manzana.piso];
  const manzana = recorte('m-manzana', ax - 15, ap - 30, 30, 30, 5,
    forma(caja(ax - 30, ap - 50, 60, 70), M2.negro) +
    forma(`M${f(ax)} ${f(ap - 22)} C${f(ax - 18)} ${f(ap - 30)} ${f(ax - 18)} ${f(ap)} ${f(ax)} ${f(ap - 2)} C${f(ax + 18)} ${f(ap)} ${f(ax + 18)} ${f(ap - 30)} ${f(ax)} ${f(ap - 22)} Z`, M2.vivo) +
    nube(ax - 6, ap - 18, 4, 5, M2.blanco, 's', 0.6) + trazo(`M${f(ax)} ${f(ap - 22)} q2 -6 6 -8`, M2.sepiaHonda, 1.6), 451);

  const [msx, msy] = [X(COSAS_DE_LA_MESA['la-mosca']![0]), COSAS_DE_LA_MESA['la-mosca']![1]];
  const [mdx, mdy] = [X(COSAS_DE_LA_MESA['el-moscardon-imaginario']![0]), COSAS_DE_LA_MESA['el-moscardon-imaginario']![1]];
  const [hpx, hpy] = [MESA.haz.hasta[0] * k, MESA.haz.hasta[1]];
  // Abajo de la mesa, en lo oscuro, el chimpancé de la misma estrofa que la mula.
  const chimpance = `<ellipse cx="${f(X(334))}" cy="556" rx="3" ry="2.2" fill="${M2.blanco}" opacity="0.8"/><ellipse cx="${f(X(346))}" cy="556" rx="3" ry="2.2" fill="${M2.blanco}" opacity="0.8"/>`;

  return (
    comensales +
    `<g filter="url(#rociado)">` +
    enmascarado('m-tablero', tablero, forma(tablero, M2.papel) + nube(hpx, (atras + adelante) / 2, 220, 50, M2.blanco, 'l', 0.5) + nube(ti, adelante, 200, 80, M2.sepia, 'xl', 0.6) + nube(td, adelante, 200, 80, M2.sepia, 'xl', 0.6) + forma(caja(ti - 40, adelante - 16, td - ti + 80, 7), M2.naranja, 0.85)) +
    enmascarado('m-faldon', rasgado(faldon, 3, 461, 6), forma(caja(ti - 40, adelante - 2, td - ti + 80, cuelga - adelante + 12), M2.papel) + pliegues + nube((ti + td) / 2, cuelga, td - ti, 60, M2.negro, 'xl', 0.7) + nube((ti + td) / 2, cuelga - 20, td - ti, 50, M2.sepiaHonda, 'xl', 0.6)) +
    soplo(caja(-10, cuelga - 4, ancho + 20, alto - cuelga + 14), M2.negro, 's', 0.75) +
    `</g>` +
    platos +
    // La olla de la contratapa: un recorte pegado sobre la mesa, con el seguidor encima.
    vapor +
    recorte('m-olla', ox - ow / 2 - 14, op - oh - 50, ow + 28, oh + 54, -2, ollaAdentro, 471) +
    nube(hpx, hpy + 6, 120, 18, M2.haz, 'l', 0.35) +
    miel + hormigas + vaso + membrillo + dormida + queso + manzana +
    mosca(msx, msy, 9) +
    mosca(mdx, mdy, 16, true) +
    chimpance
  );
}

/** Lo de adelante: dos respaldos tallados, de espaldas a la gente, con el hueco del medio libre. */
function mesaFrente(ancho = ANCHO, alto = ALTO): string {
  const rnd = azar(487);
  let sillas = '';
  for (let x = 110 + rnd() * 60; x < ancho; x += 420 + rnd() * 240) {
    const w = 110;
    const arriba = alto - 150 - rnd() * 40;
    sillas += forma(`M${f(x - w / 2)} ${alto + 10} L${f(x - w / 2)} ${f(arriba + 20)} Q${f(x - w / 2)} ${f(arriba)} ${f(x - w / 4)} ${f(arriba - 8)} Q${f(x)} ${f(arriba - 26)} ${f(x + w / 4)} ${f(arriba - 8)} Q${f(x + w / 2)} ${f(arriba)} ${f(x + w / 2)} ${f(arriba + 20)} L${f(x + w / 2)} ${alto + 10} L${f(x + w / 2 - 12)} ${alto + 10} L${f(x + w / 2 - 12)} ${f(arriba + 30)} L${f(x - w / 2 + 12)} ${f(arriba + 30)} L${f(x - w / 2 + 12)} ${alto + 10} Z`, M2.negro) +
      [-1, 0, 1].map((i) => forma(caja(x + i * 22 - 5, arriba + 30, 10, 200), M2.negro)).join('') +
      trazo(`M${f(x - w / 2 + 4)} ${f(arriba + 18)} Q${f(x)} ${f(arriba - 18)} ${f(x + w / 2 - 4)} ${f(arriba + 18)}`, M2.rojo, 2, 0.6);
  }
  return `<g filter="url(#soplo-xs)">${sillas}</g>`;
}

/* ------------------------------------------------------------------
   La ruta del último bondi: el surco del disco, de noche
   ------------------------------------------------------------------
   La ruta da la vuelta al mundo redondo por el borde, que es el surco del disco. Así que el asfalto
   es vinilo: negro, con los surcos finos que agarran la luz. Desde la banquina se ve el mundo
   entero recortado en el horizonte, cada región con su luz. Los fierros pasan pintados, y el
   último bondi es de la chapa remachada de *Último bondi*, con ojos de buey por ventanillas.
*/

const R = {
  noche: 'var(--entorno-astillero-noche)',
  negro: 'var(--fondo)',
  papel: 'var(--papel)',
  tenue: 'var(--papel-tenue)',
  topo: 'var(--disco-luzbelito-apoyo)',
  cuero: 'var(--disco-luzbelito-tinta)',
  oro: 'var(--acento-2)',
  vivo: 'var(--marca-rojo)',
};

/** El horizonte de la ruta: todas las regiones, chiquitas, cada una con su luz. */
function mundoEnElHorizonte(ancho: number, h: number): string {
  const tramo = ancho / 10;
  const en = (i: number): number => tramo * (i + 0.5);
  const luz = (x: number, color: string, r = 46): string => nube(x, h - 14, r, r * 0.55, color, 'xl', 0.55);
  const lomo = (x0: number, x1: number, y: number): string => forma(caja(x0, y, x1 - x0, h - y + 2), R.negro);
  let s = '';
  // El árbol del gran bonete, con el fruto que brilla.
  s += luz(en(0), A.cobre) + forma(caja(en(0) - 3, h - 46, 6, 46), R.negro) + forma(circulo(en(0) - 14, h - 56, 18) + ' ' + circulo(en(0) + 12, h - 60, 20) + ' ' + circulo(en(0), h - 74, 18), R.negro) + nube(en(0) + 14, h - 50, 3, 3, A.cobre, 'xs');
  // Cybersiberia: la tele prendida y la antena.
  s += luz(en(1), C.lente, 56) + lomo(en(1) - 16, en(1) + 16, h - 26) + forma(caja(en(1) - 9, h - 22, 18, 12), C.lente, 0.9) + trazo(`M${f(en(1) - 4)} ${h - 26} l-10 -18 M${f(en(1) + 4)} ${h - 26} l10 -20`, R.negro, 1.4);
  // El templo: el galpón de luz con la guirnalda.
  s += luz(en(2), 'var(--entorno-templo-foco)') + forma(`M${f(en(2) - 22)} ${h} L${f(en(2) - 22)} ${h - 24} L${f(en(2))} ${h - 40} L${f(en(2) + 22)} ${h - 24} L${f(en(2) + 22)} ${h} Z`, R.negro) +
    [-2, -1, 0, 1, 2].map((i) => forma(circulo(en(2) + i * 9, h - 30 + Math.abs(i) * 3, 1.4), 'var(--entorno-templo-foco)')).join('');
  // Los astilleros: la grúa, y una luz de sodio.
  s += luz(en(3), T.sodio) + trazo(`M${f(en(3) - 10)} ${h} L${f(en(3) - 6)} ${h - 60} L${f(en(3) - 2)} ${h} M${f(en(3) - 30)} ${h - 60} L${f(en(3) + 34)} ${h - 60}`, R.negro, 2.4) + lomo(en(3) + 4, en(3) + 30, h - 14) + nube(en(3) + 10, h - 16, 2, 2, T.sodio, 'xs');
  // El bajo inundado: el farol de la Esquina del Sol, y el agua que lo devuelve.
  s += luz(en(4), 'var(--entorno-bajo-celeste)') + lomo(en(4) - 24, en(4) + 20, h - 22) + forma(caja(en(4) - 26, h - 4, 52, 4), 'var(--entorno-bajo-celeste)', 0.7) + nube(en(4) + 14, h - 30, 3, 3, R.oro, 'xs');
  // El infierno encantador: el resplandor de brasa.
  s += luz(en(5), 'var(--entorno-infierno-brasa)', 70) + luz(en(5), 'var(--entorno-infierno-fuego)', 26) + lomo(en(5) - 18, en(5) + 18, h - 20) + forma(caja(en(5) + 6, h - 40, 6, 22), R.negro);
  // La prisión: el bloque con las rejas y una bandera.
  s += lomo(en(6) - 26, en(6) + 26, h - 34) + Array.from({ length: 6 }, (_, i) => trazo(`M${f(en(6) - 18 + i * 7)} ${h - 28} l0 18`, R.tenue, 1.2, 0.8)).join('') + trazo(`M${f(en(6) + 20)} ${h - 34} l0 -22`, R.negro, 1.4) + forma(`M${f(en(6) + 20)} ${h - 56} l14 4 l-14 4 Z`, R.vivo);
  // Los techos y el baldío: chapas en diente de sierra contra el violeta del farol.
  s += luz(en(7), 'var(--entorno-baion-lila)') + forma(`M${f(en(7) - 30)} ${h} L${f(en(7) - 30)} ${h - 18} L${f(en(7) - 20)} ${h - 28} L${f(en(7) - 20)} ${h - 18} L${f(en(7) - 8)} ${h - 28} L${f(en(7) - 8)} ${h - 18} L${f(en(7) + 4)} ${h - 28} L${f(en(7) + 4)} ${h - 18} L${f(en(7) + 30)} ${h - 18} L${f(en(7) + 30)} ${h} Z`, R.negro);
  // El monte del lobo: las tiras de papel rasgado.
  s += [-24, -12, 0, 12, 24].map((dx, i) => forma(`M${f(en(8) + dx - 8)} ${h} L${f(en(8) + dx)} ${h - 30 - (i % 2) * 14} L${f(en(8) + dx + 8)} ${h} Z`, R.negro)).join('') + nube(en(8) + 30, h - 6, 10, 6, 'var(--entorno-pastura)', 'm', 0.7);
  // Y en el medio de todo, más atrás, el galpón con su luz roja.
  s += luz(en(9), G.rojo, 60) + forma(`M${f(en(9) - 28)} ${h} L${f(en(9) - 28)} ${h - 22} L${f(en(9))} ${h - 36} L${f(en(9) + 28)} ${h - 22} L${f(en(9) + 28)} ${h} Z`, R.negro);
  return s;
}

function rutaLejos(ancho = ANCHO, alto = ALTO): string {
  const h = RUTA.horizonte;
  const rnd = azar(503);
  let lactea = '';
  for (let i = 0; i < Math.round(260 * (ancho / ANCHO)); i++) {
    const t = rnd();
    const x = t * ancho;
    const y = 40 + t * 120 + (rnd() - 0.5) * 70;
    lactea += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.4 + rnd() * 0.8)}" opacity="${f(0.2 + rnd() * 0.5)}"/>`;
  }
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${R.negro}"/>` +
    nube(ancho / 2, h - 30, ancho * 0.7, 120, R.noche, 'xl', 0.9) +
    `<g transform="rotate(-6 ${f(ancho / 2)} 100)">${nube(ancho / 2, 100, ancho * 0.7, 50, R.papel, 'xl', 0.07)}</g>` +
    `<g fill="${R.papel}">${lactea}</g>` +
    estrellas(0, 0, ancho, h - 30, Math.round(380 * (ancho / ANCHO)), R.papel, 509) +
    `<path d="M${f(ancho * 0.84)} 70 a20 20 0 1 0 14 34 a16 16 0 1 1 -14 -34 Z" fill="${R.papel}" opacity="0.85"/>` +
    nube(ancho * 0.84 + 6, 88, 46, 46, R.papel, 'xl', 0.12) +
    mundoEnElHorizonte(ancho, h) +
    // La pampa, oscura, hasta la ruta.
    forma(caja(-10, h, ancho + 20, alto - h + 10), R.negro) +
    nube(ancho / 2, h + 6, ancho * 0.7, 10, R.noche, 'l', 0.8) +
    `</g>`
  );
}

/** Yuyos en una franja: tallos con la punta prendida por lo que pase. */
function yuyos(x0: number, x1: number, piso: number, alto: number, cuantos: number, semilla: number, color: string, luz: string): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const h = alto * (0.3 + rnd() * 0.7);
    const dx = (rnd() - 0.5) * 16;
    s += trazo(`M${f(x)} ${f(piso + rnd() * 6)} q${f(dx * 0.3)} ${f(-h * 0.6)} ${f(dx)} ${f(-h)}`, rnd() < 0.85 ? color : luz, 1.2 + rnd() * 1.6, 0.85);
  }
  return s;
}

function rutaPiso(ancho = ANCHO, alto = ALTO): string {
  const k = ancho / ANCHO;
  const X = (x: number): number => x * k;
  const { arriba, abajo } = RUTA.asfalto;
  const rnd = azar(521);
  // El asfalto es el vinilo: surcos finos, uno al lado del otro, que agarran la luz de a ratos.
  let surcos = '';
  for (let y = arriba + 6; y < abajo - 4; y += 2.6 + rnd() * 1.6) {
    const o = 0.06 + rnd() * 0.16;
    surcos += trazo(`M-10 ${f(y)} Q${f(ancho / 2)} ${f(y + (rnd() - 0.5) * 2)} ${ancho + 10} ${f(y)}`, R.tenue, 0.7, o);
  }
  const medio = (RUTA.carriles[0] + RUTA.carriles[1]) / 2 - 6;
  let lineas = '';
  for (let x = -20 + rnd() * 30; x < ancho; x += 64) lineas += forma(caja(x, medio, 34, 4), R.papel, 0.75);
  // Los postes del telégrafo, con los cables combados.
  const postes: number[] = [];
  for (let x = X(70); x < ancho + 120; x += X(250)) postes.push(x);
  let telegrafo = '';
  for (const x of postes) telegrafo += forma(caja(x - 3, 250, 6, arriba - 250 + 4), R.negro) + forma(caja(x - 22, 262, 44, 5), R.negro) + [-18, -6, 6, 18].map((d) => forma(caja(x + d - 1.5, 256, 3, 6), R.tenue)).join('');
  for (let i = 0; i < postes.length - 1; i++) {
    for (const d of [-18, 6]) telegrafo += trazo(`M${f(postes[i]! + d)} 258 Q${f((postes[i]! + postes[i + 1]!) / 2 + d)} 290 ${f(postes[i + 1]! + d)} 258`, R.negro, 1.2, 0.85);
  }
  // El taxi paranormal, volcado en la banquina, con un faro que todavía alumbra el cielo.
  const { x: vx0, piso: vp } = RUTA.volcado;
  const vx = X(vx0);
  const volcado =
    soplo(poli([[vx + 50, vp - 30], [vx + 58, vp - 22], [vx + 300, vp - 300], [vx + 230, vp - 330]]), R.papel, 'm', 0.13) +
    nube(vx, vp + 4, 90, 8, R.negro, 's', 0.8) +
    forma(`M${f(vx - 60)} ${f(vp - 30)} L${f(vx + 62)} ${f(vp - 30)} L${f(vx + 66)} ${f(vp - 16)} L${f(vx + 40)} ${f(vp - 14)} L${f(vx + 30)} ${f(vp)} L${f(vx - 34)} ${f(vp)} L${f(vx - 44)} ${f(vp - 14)} L${f(vx - 64)} ${f(vp - 16)} Z`, R.negro) +
    forma(caja(vx - 40, vp - 30, 80, 4), R.oro, 0.85) +
    [vx - 38, vx + 38].map((wx) => forma(circulo(wx, vp - 40, 12), R.negro) + forma(circulo(wx, vp - 40, 5), R.tenue)).join('') +
    nube(vx + 58, vp - 26, 6, 5, R.papel, 's', 0.9) +
    forma(caja(vx - 62, vp - 24, 6, 6), R.vivo, 0.8);
  const o = OJOS_DE_LA_RUTA;
  const [sx, sy] = [X(o['la-bella-senora-desencarnada']![0]), o['la-bella-senora-desencarnada']![1]];
  const [pbx, pby] = [X(o['la-piba-de-greenpeace']![0]), o['la-piba-de-greenpeace']![1]];
  // La bella señora, esperando parada al costado: casi sin cuerpo, con un velo pálido alrededor.
  const senora =
    nube(sx, sy + 26, 22, 44, R.papel, 'l', 0.2) +
    forma(circulo(sx, sy, 9), R.negro) +
    forma(`M${f(sx - 8)} ${f(sy + 8)} L${f(sx + 8)} ${f(sy + 8)} L${f(sx + 16)} ${f(arriba - 2)} L${f(sx - 16)} ${f(arriba - 2)} Z`, R.negro, 0.85) +
    soplo(`M${f(sx - 10)} ${f(sy - 10)} Q${f(sx)} ${f(sy - 18)} ${f(sx + 10)} ${f(sy - 10)} L${f(sx + 22)} ${f(arriba - 2)} L${f(sx - 22)} ${f(arriba - 2)} Z`, R.papel, 's', 0.16);
  // La piba con la remera, dormida en el pasto (o haciéndose).
  const piba =
    forma(circulo(pbx, pby, 9), R.negro) +
    forma(`M${f(pbx + 8)} ${f(pby - 4)} Q${f(pbx + 40)} ${f(pby - 10)} ${f(pbx + 70)} ${f(pby - 4)} L${f(pbx + 96)} ${f(pby + 2)} L${f(pbx + 96)} ${f(pby + 10)} Q${f(pbx + 40)} ${f(pby + 12)} ${f(pbx + 6)} ${f(pby + 10)} Z`, R.negro) +
    forma(`M${f(pbx + 12)} ${f(pby - 4)} Q${f(pbx + 26)} ${f(pby - 8)} ${f(pbx + 42)} ${f(pby - 6)} L${f(pbx + 42)} ${f(pby + 10)} L${f(pbx + 12)} ${f(pby + 10)} Z`, R.papel, 0.55);
  return (
    `<g filter="url(#rociado)">` +
    // La banquina de arriba, con el pasto, y lo que alumbran los faros al pasar.
    soplo(`M-10 ${arriba - 30} L${ancho + 10} ${arriba - 30} L${ancho + 10} ${arriba + 4} L-10 ${arriba + 4} Z`, R.negro, 'xs') +
    forma(caja(-10, arriba, ancho + 20, abajo - arriba), R.negro) +
    nube(ancho / 2, (arriba + abajo) / 2, ancho * 0.6, 40, R.papel, 'xl', 0.05) +
    surcos +
    trazo(`M-10 ${arriba + 4} L${ancho + 10} ${arriba + 4} M-10 ${abajo - 4} L${ancho + 10} ${abajo - 4}`, R.papel, 2, 0.55) +
    lineas +
    forma(caja(-10, abajo, ancho + 20, alto - abajo + 10), R.negro) +
    nube(ancho / 2, abajo + 30, ancho * 0.6, 30, R.topo, 'xl', 0.35) +
    `</g>` +
    yuyos(-10, ancho + 10, arriba, 30, Math.round(160 * k), 523, R.topo, R.cuero) +
    yuyos(-10, ancho + 10, alto, 50, Math.round(120 * k), 527, R.topo, R.cuero) +
    telegrafo +
    senora +
    volcado +
    piba
  );
}

/** Lo de adelante: matas de yuyos con huecos y un mojón blanco, sin número. */
function rutaFrente(ancho = ANCHO, alto = ALTO): string {
  const rnd = azar(541);
  let s = '';
  for (let x = rnd() * 120; x < ancho; x += 180 + rnd() * 240) {
    s += yuyos(x - 40, x + 40, alto + 4, 90 + rnd() * 60, 40, Math.round(x), R.negro, R.topo);
    if (rnd() < 0.35) {
      const mx = x + 70;
      s += forma(`M${f(mx - 9)} ${alto + 4} L${f(mx - 9)} ${alto - 50} Q${f(mx)} ${alto - 60} ${f(mx + 9)} ${alto - 50} L${f(mx + 9)} ${alto + 4} Z`, R.tenue) + forma(caja(mx - 9, alto - 40, 18, 6), R.vivo, 0.8);
    }
  }
  return `<g filter="url(#soplo-xs)">${s}</g>`;
}

/* Los fierros: cada uno con el (0, 0) donde las ruedas tocan el carril, mirando para la derecha. */

/** Una rueda con su taza, medio tapada por el guardabarros. */
const rueda = (x: number, r: number): string => forma(circulo(x, -r, r), R.negro) + forma(circulo(x, -r, r * 0.45), C.claro) + forma(circulo(x - r * 0.12, -r * 1.12, r * 0.14), R.papel, 0.6);

/** El haz de un faro hacia adelante, soplado sobre lo oscuro. */
const haz = (x: number, y: number, largo: number): string =>
  soplo(poli([[x, y - 3], [x, y + 3], [x + largo, y + 26], [x + largo, y - 18]]), R.papel, 'm', 0.16) + nube(x + 2, y, 7, 5, R.papel, 's', 0.95);

/** El último bondi: chapa remachada de *Último bondi*, ojos de buey por ventanillas, con trompa. */
function bondi(): string {
  const caja0 = `M-150 -14 L-150 -112 Q-150 -124 -138 -124 L86 -124 Q100 -124 102 -110 L106 -74 L140 -70 Q152 -68 152 -56 L152 -14 Z`;
  let ventanas = '';
  for (let i = 0; i < 5; i++) {
    const x = -112 + i * 40;
    ventanas += `<circle cx="${x}" cy="-84" r="17" fill="none" stroke="${C.claro}" stroke-width="5"/>` +
      enmascarado(`r-ojo-de-buey-${i}`, circulo(x, -84, 14), forma(circulo(x, -84, 14), C.vidrio) + nube(x + 6, -78, 10, 10, C.oxido, 's', 0.7) + nube(x - 5, -90, 4, 3, R.papel, 's', 0.8)) +
      [0, 1, 2, 3, 4, 5].map((j) => forma(circulo(x + Math.cos((j / 6) * Math.PI * 2) * 17, -84 + Math.sin((j / 6) * Math.PI * 2) * 17, 1.4), R.papel, 0.6)).join('');
  }
  let remaches = '';
  for (let x = -142; x < 100; x += 12) remaches += forma(circulo(x, -118, 1.4), C.claro) + forma(circulo(x, -50, 1.4), C.claro);
  return (
    haz(152, -40, 150) +
    nube(0, 2, 150, 7, R.negro, 's', 0.8) +
    enmascarado('r-bondi', caja0,
      forma(caja0, C.acero) +
      nube(-20, -120, 160, 20, C.claro, 'l', 0.7) +
      nube(-20, -10, 170, 26, R.negro, 'l', 0.7) +
      forma(caja(-150, -60, 260, 7), R.vivo, 0.85) +
      pista('M-150 -36 L-60 -36 L-50 -26 L40 -26 L50 -36 L152 -36', 3) +
      remaches) +
    ventanas +
    // El parabrisas, el cartel prendido sin letras y el farol de atrás.
    forma('M100 -116 L104 -76 L82 -76 L80 -116 Z', C.vidrio, 0.9) +
    forma(caja(-20, -122, 70, 10), C.vidrio, 0.95) + nube(15, -117, 40, 8, C.vidrio, 's', 0.5) +
    forma(caja(-152, -44, 5, 10), R.vivo) + nube(-152, -39, 10, 8, R.vivo, 's', 0.6) +
    rueda(-96, 18) + rueda(104, 18) +
    // El zumba, colgado del estribo de atrás, medio afuera.
    forma(caja(-148, -70, 26, 56), C.hondo) +
    trazo('M-140 -66 L-140 -14', C.claro, 2) +
    forma(circulo(-164, -76, 8), R.negro) +
    forma('M-158 -70 L-146 -66 L-140 -40 L-150 -14 L-160 -14 L-156 -36 L-168 -50 Z', R.negro) +
    trazo('M-160 -64 L-142 -62', R.negro, 4) +
    trazo('M-166 -44 L-182 -36', R.negro, 4) +
    `<ellipse cx="-168" cy="-77" rx="2.2" ry="1.7" fill="${R.papel}"/><ellipse cx="-161" cy="-77" rx="2.2" ry="1.7" fill="${R.papel}"/>`
  );
}

/** El camión del héroe del whisky: la cabina, la caja de barandas y él tirado arriba, con la botella. */
function camion(): string {
  const cabina = 'M60 -14 L60 -96 Q60 -104 68 -104 L96 -104 L118 -70 Q126 -68 126 -58 L126 -14 Z';
  let barandas = '';
  for (let x = -116; x < 54; x += 14) barandas += trazo(`M${x} -64 L${x} -26`, R.cuero, 3, 0.8);
  return (
    haz(126, -44, 140) +
    nube(0, 2, 130, 6, R.negro, 's', 0.8) +
    forma(caja(-124, -28, 180, 14), R.negro) +
    forma(caja(-124, -66, 180, 40), R.topo) + barandas +
    trazo('M-124 -66 L56 -66', R.cuero, 3) +
    enmascarado('r-cabina', cabina, forma(cabina, R.vivo) + nube(110, -30, 30, 50, R.negro, 'm', 0.6) + nube(80, -100, 30, 8, R.papel, 's', 0.4)) +
    forma('M98 -98 L114 -72 L88 -72 L88 -98 Z', C.vidrio, 0.9) +
    rueda(-90, 16) + rueda(-56, 16) + rueda(96, 16) +
    // El héroe, tirado en la caja, mirando las estrellas, con la botella en la mano.
    forma(circulo(-80, -76, 8), R.negro) +
    forma('M-74 -80 Q-30 -88 10 -78 L30 -74 L30 -68 Q-20 -66 -74 -68 Z', R.negro) +
    trazo('M-60 -80 L-44 -102', R.negro, 4) +
    forma('M-48 -102 L-40 -108 L-36 -104 L-44 -98 Z', R.oro, 0.9) + nube(-42, -104, 8, 6, R.oro, 's', 0.4) +
    `<ellipse cx="-83" cy="-78" rx="2" ry="1.6" fill="${R.papel}"/><ellipse cx="-77" cy="-79" rx="2" ry="1.6" fill="${R.papel}"/>`
  );
}

/** La Mariposa Pontiac: medio auto de los grandes, medio mariposa, con las alas abiertas. */
function pontiac(): string {
  const auto = 'M-100 -14 L-104 -34 Q-100 -46 -80 -48 L-40 -50 L-24 -72 L30 -72 L52 -50 L92 -46 Q108 -42 108 -26 L106 -14 Z';
  const ala = (lado: number, grande: boolean): string => {
    const [ax, ay] = [lado * (grande ? 70 : 52), grande ? -150 : -96];
    const d = `M${lado * 6} -72 C${lado * 20} ${grande ? -150 : -110} ${ax} ${ay - 10} ${ax + lado * 6} ${ay + 18} C${ax} ${ay + 50} ${lado * 30} ${grande ? -84 : -74} ${lado * 6} -70 Z`;
    return enmascarado(`r-ala-${lado}-${grande ? 'g' : 'c'}`, d,
      forma(d, A.cobre, 0.85) + nube(lado * 10, -76, 30, 30, R.vivo, 'l', 0.7) +
      forma(circulo(ax * 0.75, ay * 0.82, grande ? 13 : 8), R.negro, 0.85) + forma(circulo(ax * 0.75, ay * 0.82, grande ? 7 : 4), R.oro) +
      nube(ax, ay + 10, 18, 26, R.negro, 'm', 0.5)) +
      trazo(d, R.negro, 1.6, 0.8);
  };
  return (
    haz(108, -32, 130) +
    nube(0, 2, 110, 6, R.negro, 's', 0.8) +
    ala(-1, true) + ala(-1, false) + ala(1, true) + ala(1, false) +
    enmascarado('r-pontiac', auto, forma(auto, A.cobreHondo) + nube(0, -60, 100, 14, A.cobre, 'l', 0.6) + nube(0, -10, 110, 14, R.negro, 'l', 0.7) + forma(caja(-104, -36, 212, 3), R.papel, 0.6)) +
    forma('M-20 -68 L-34 -50 L-4 -50 L-4 -68 Z M2 -68 L2 -50 L44 -50 L28 -68 Z', C.vidrio, 0.6) +
    trazo('M-8 -72 L-8 -98 M8 -72 L8 -98', R.negro, 1.6) + forma(circulo(-8, -100, 2.4), R.negro) + forma(circulo(8, -100, 2.4), R.negro) +
    rueda(-62, 15) + rueda(68, 15) + forma(caja(-106, -30, 6, 6), R.vivo)
  );
}

/** El toxi-taxi: negro y amarillo, y la sombra que lo sigue, estirada atrás. */
function taxi(): string {
  const auto = 'M-90 -14 L-92 -32 Q-88 -42 -70 -44 L-40 -46 L-24 -66 L32 -66 L50 -46 L84 -42 Q96 -38 96 -24 L94 -14 Z';
  const sombra = 'M-96 -10 C-140 -12 -190 -20 -236 -40 C-226 -52 -214 -60 -204 -58 C-196 -70 -180 -72 -176 -60 C-140 -48 -116 -34 -96 -30 Z';
  return (
    haz(96, -30, 140) +
    soplo(sombra, R.negro, 'm', 0.75) + soplo(sombra, C.hondo, 'l', 0.4) +
    nube(0, 2, 100, 6, R.negro, 's', 0.8) +
    enmascarado('r-taxi', auto, forma(auto, R.negro) + forma(caja(-40, -70, 90, 26), R.oro) + nube(0, -12, 100, 10, R.negro, 'l', 0.6) + forma(caja(-92, -34, 188, 3), C.claro, 0.6)) +
    forma('M-20 -62 L-32 -46 L-4 -46 L-4 -62 Z M2 -62 L2 -46 L42 -46 L28 -62 Z', C.vidrio, 0.55) +
    forma(caja(-6, -74, 16, 7), R.vivo) + nube(2, -71, 12, 6, R.vivo, 's', 0.6) +
    rueda(-56, 14) + rueda(60, 14)
  );
}

/* ------------------------------------------------------------------
   Lo que asoma: la luz de cada entorno, para anunciarlo desde el vecino
   ------------------------------------------------------------------ */

/** La tinta con que se ve cada entorno desde lejos. */
const LUZ: Readonly<Record<string, string>> = {
  'el-galpon': G.rojo,
  'el-arbol': A.cobre,
  cybersiberia: C.lente,
  'los-astilleros': T.sodio,
  'la-mesa': M2.rojo,
  'la-ruta': R.papel,
};

/**
 * La luz de un entorno que asoma en el piso de su vecino: una mancha soplada de su tinta. El camino
 * la pone al final del tramo, para que el cruce se anuncie antes de llegar.
 */
export function luzQueAsoma(region: string, x: number, y: number, r = 120): string {
  const color = LUZ[region];
  if (!color) return '';
  return nube(x, y, r, r * 0.7, color, 'xl', 0.45) + nube(x, y, r * 0.4, r * 0.3, color, 'l', 0.4);
}

/* ------------------------------------------------------------------
   Las piezas que imprime la imprenta, a 900 de ancho para los recintos
   ------------------------------------------------------------------ */

/**
 * Lo lejano se imprime a 2 por unidad, como los demás recintos; el piso y lo de adelante, con
 * transparencia, a 1,5: el webp con alfa pesa mucho más, y la diferencia no se ve en un teléfono.
 */
const pieza = (nombre: string, dibujo: string, caja0: readonly [number, number, number, number], opaca = false): Pieza => ({ nombre, caja: caja0, dibujo, opaca, densidad: opaca ? 2 : 1.5 });

export const ENTORNOS = {
  'el-galpon': { lejos: galponLejos, piso: galponPiso, frente: galponFrente },
  'el-arbol': { lejos: arbolLejos, piso: arbolPiso, frente: arbolFrente },
  cybersiberia: { lejos: cyberLejos, piso: cyberPiso, frente: cyberFrente, nieve: cyberNieve },
  'los-astilleros': { lejos: astilleroLejos, piso: astilleroPiso, frente: astilleroFrente },
  'la-mesa': { lejos: mesaLejos, piso: mesaPiso, frente: mesaFrente },
  'la-ruta': { lejos: rutaLejos, piso: rutaPiso, frente: rutaFrente },
} as const;

export const PIEZAS_ENTORNOS: readonly Pieza[] = [
  pieza('galpon-lejos', galponLejos(), [0, 0, ANCHO, ALTO], true),
  pieza('galpon-piso', galponPiso(), [0, 0, ANCHO, ALTO]),
  pieza('galpon-frente', galponFrente(), [0, 240, ANCHO, ALTO - 240]),
  pieza('arbol-lejos', arbolLejos(), [0, 0, ANCHO, ALTO], true),
  pieza('arbol-piso', arbolPiso(), [0, 0, ANCHO, ALTO]),
  pieza('arbol-frente', arbolFrente(), [0, 380, ANCHO, ALTO - 380]),
  pieza('cyber-lejos', cyberLejos(), [0, 0, ANCHO, ALTO], true),
  pieza('cyber-piso', cyberPiso(), [0, 0, ANCHO, ALTO]),
  pieza('cyber-frente', cyberFrente(), [0, 360, ANCHO, ALTO - 360]),
  { nombre: 'cyber-nieve', caja: [0, 0, ANCHO, ALTO], dibujo: cyberNieve(), densidad: 1 },
  pieza('astillero-lejos', astilleroLejos(), [0, 0, ANCHO, ALTO], true),
  pieza('astillero-piso', astilleroPiso(), [0, 0, ANCHO, ALTO]),
  pieza('astillero-frente', astilleroFrente(), [0, 480, ANCHO, ALTO - 480]),
  pieza('mesa-lejos', mesaLejos(), [0, 0, ANCHO, ALTO], true),
  pieza('mesa-piso', mesaPiso(), [0, 0, ANCHO, ALTO]),
  pieza('mesa-frente', mesaFrente(), [0, 400, ANCHO, ALTO - 400]),
  pieza('ruta-lejos', rutaLejos(), [0, 0, ANCHO, ALTO], true),
  pieza('ruta-piso', rutaPiso(), [0, 200, ANCHO, ALTO - 200]),
  pieza('ruta-frente', rutaFrente(), [0, 460, ANCHO, ALTO - 460]),
  pieza(FIERROS['el-zumba'].pieza, bondi(), FIERROS['el-zumba'].caja),
  pieza(FIERROS['el-heroe-del-whisky'].pieza, camion(), FIERROS['el-heroe-del-whisky'].caja),
  pieza(FIERROS['la-mariposa-pontiac'].pieza, pontiac(), FIERROS['la-mariposa-pontiac'].caja),
  pieza(FIERROS['el-toxi-taxi'].pieza, taxi(), FIERROS['el-toxi-taxi'].caja),
];
