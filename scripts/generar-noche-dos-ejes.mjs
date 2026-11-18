/**
 * La noche de «¿Qué tipo de ricotero sos?», dibujada (ronda de pulida de los juegos, 2026-11-18).
 *
 *   npm run generar-noche-dos-ejes
 *
 * Deja en `public/arte/dos-ejes/` las siluetas del camino de la noche: el barrio de la previa,
 * la ruta de la ida, el paredón de la vereda, el escenario de cuando suena y el barrio dormido
 * de la vuelta. Son **máscaras**: cada archivo trae solo la forma, y la tinta la pone
 * `juego.css` desde `tokens.css`, como las máscaras de la multitud del portal (`D-63`).
 *
 * Es dibujo propio, de recorte: polígonos de canto irregular, como papel cortado a tijera. No
 * sale de ninguna tapa. La gente de «la vereda» y de «cuando suena» no está acá: es la
 * multitud de *Oktubre* que ya tiene el sitio (`multitud-lejos-*.png`).
 *
 * El azar tiene semilla: correrlo dos veces da los mismos archivos.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { TIRA, inicioDelLugar } from '../src/lib/dos-ejes/noche.ts';

const SALIDA = 'public/arte/dos-ejes';
mkdirSync(SALIDA, { recursive: true });

// Las medidas son las de `noche.ts`: la isla camina por la misma tira que acá se dibuja.
const ALTO = TIRA.alto;
const PISO = TIRA.piso;
const ANCHO = TIRA.ancho;

function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rnd = azar(1996);
/** Un corrimiento chico: la mano de la tijera. */
const j = (n = 1.3) => (rnd() - 0.5) * 2 * n;
const r1 = (n) => Math.round(n * 10) / 10;
const poli = (puntos) => `M${puntos.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z`;

/** Un rectángulo cortado a mano. */
function caja(x, y, w, h, mano = 1.3) {
  return poli([
    [x + j(mano), y + j(mano)],
    [x + w + j(mano), y + j(mano)],
    [x + w + j(mano), y + h + j(mano * 0.4)],
    [x + j(mano), y + h + j(mano * 0.4)],
  ]);
}

/** Una mancha redonda cortada a mano: copas, cabezas, ruedas. */
function mancha(cx, cy, rx, ry, lados = 9, mano = 0.18) {
  const p = [];
  for (let i = 0; i < lados; i++) {
    const a = (i / lados) * Math.PI * 2;
    const k = 1 + (rnd() - 0.5) * 2 * mano;
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return poli(p);
}

class Capa {
  constructor() {
    this.llenos = [];
    this.huecos = [];
    this.trazos = [];
  }
  /** Lo que se recorta de lo lleno: ventanas, portones, la boca de un parlante. */
  hueco(d) {
    this.huecos.push(d);
  }
  lleno(d) {
    this.llenos.push(d);
  }
  trazo(d, ancho = 1.6) {
    this.trazos.push([d, ancho]);
  }
  svg(ancho, alto) {
    const trazos = this.trazos
      .map(([d, a]) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${a}" stroke-linecap="square"/>`)
      .join('');
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" preserveAspectRatio="none">` +
      `<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${ancho}" height="${alto}"><rect width="${ancho}" height="${alto}" fill="#fff"/><path fill="#000" d="${this.huecos.join('')}"/></mask>` +
      `<g mask="url(#m)"><path fill="#fff" d="${this.llenos.join('')}"/>${trazos}</g></svg>\n`
    );
  }
}

const cerca = new Capa();
const luz = new Capa();

/* ---------------------------------------------------------------- las piezas */

/** Una casa: el cuerpo, el remate, y ventanas que son agujeros. Algunas quedan prendidas. */
function casa(x, w, h, { techo = 'chato', prendidas = [], puerta = false } = {}) {
  const y = PISO - h;
  let d = caja(x, y, w, h + 4);
  if (techo === 'chato') d += caja(x - 4, y - 6, w + 8, 8);
  if (techo === 'dos-aguas') d += poli([[x - 6 + j(), y + 2], [x + w / 2 + j(2), y - h * 0.32 + j()], [x + w + 6 + j(), y + 2]]);
  if (techo === 'chapa') d += poli([[x - 5, y + 3 + j()], [x - 3, y - 4 + j()], [x + w + 6, y - 12 + j()], [x + w + 5, y + 3 + j()]]);
  cerca.lleno(d);
  // Las ventanas: dos filas como mucho, según el alto.
  const filas = h > 86 ? 2 : 1;
  const columnas = Math.max(1, Math.floor(w / 34));
  let n = 0;
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      const vx = x + 10 + c * ((w - 20) / columnas) + 3;
      const vy = y + 14 + f * 34;
      const vw = Math.min(16, (w - 20) / columnas - 8);
      if (vw < 8) continue;
      const hueco = caja(vx, vy, vw, 15, 0.8);
      cerca.hueco(hueco);
      if (prendidas.includes(n)) luz.lleno(hueco);
      n++;
    }
  }
  if (puerta) {
    const hueco = caja(x + w - 24, PISO - 30, 13, 30, 0.8);
    cerca.hueco(hueco);
    luz.lleno(hueco);
  }
}

/** El tanque de agua, sobre sus patas. */
function tanque(x, alto) {
  const y = PISO - alto;
  cerca.lleno(caja(x, y, 22, 16) + caja(x + 2, y + 15, 2.4, 14, 0.5) + caja(x + 17, y + 15, 2.4, 14, 0.5));
}

/** La antena de la tele. */
function antena(x, base, alto) {
  const y = PISO - base;
  cerca.lleno(caja(x, y - alto, 1.8, alto, 0.4) + caja(x - 8, y - alto + 3, 18, 1.6, 0.4) + caja(x - 5, y - alto + 9, 12, 1.6, 0.4));
}

function arbol(x, alto, copa) {
  cerca.lleno(caja(x - 2.5, PISO - alto * 0.5, 5, alto * 0.5 + 3, 0.8) + mancha(x + j(3), PISO - alto * 0.72, copa, copa * 0.82, 11, 0.2));
}

/** Un poste de luz de la calle, con el brazo; la lámpara va a la capa de la luz. */
function farol(x, alto, lado = 1, prendido = true) {
  const y = PISO - alto;
  cerca.lleno(caja(x, y, 2.6, alto + 3, 0.5) + caja(lado > 0 ? x : x - 18, y, 20, 2.2, 0.4) + caja(lado > 0 ? x + 14 : x - 20, y + 2, 9, 4, 0.5));
  if (prendido) luz.lleno(poli([[x + lado * 19 - 4, y + 7], [x + lado * 19 + 5, y + 7], [x + lado * 19 + 2.5, y + 12], [x + lado * 19 - 2, y + 12]]));
}

/** Una figura parada: la gente de papel. */
function figura(x, alto = 32, ancho = 9) {
  const y = PISO - alto;
  cerca.lleno(
    mancha(x, y + 4, 3.6, 4, 7, 0.14) +
      poli([[x - ancho / 2 + j(0.8), y + 9], [x + ancho / 2 + j(0.8), y + 9], [x + ancho / 2 - 1 + j(0.8), PISO + 2], [x - ancho / 2 + 1 + j(0.8), PISO + 2]]),
  );
}

/** Una figura sentada en el piso. */
function sentada(x) {
  cerca.lleno(mancha(x, PISO - 20, 3.6, 4, 7, 0.14) + poli([[x - 6, PISO - 15 + j()], [x + 5, PISO - 15 + j()], [x + 11 + j(), PISO + 2], [x - 8 + j(), PISO + 2]]));
}

/** Un poste de la ruta con su cruceta. Devuelve dónde agarran los cables. */
function poste(capa, x, alto, base = PISO) {
  const y = base - alto;
  capa.lleno(caja(x, y, 2.8, alto + 3, 0.5) + caja(x - 10, y + 6, 23, 2.4, 0.4));
  return [x + 1.4, y + 7];
}

/** Un cable colgando entre dos puntas. */
function cable(capa, [x1, y1], [x2, y2], panza = 10) {
  capa.trazo(`M${r1(x1)} ${r1(y1)}Q${r1((x1 + x2) / 2)} ${r1((y1 + y2) / 2 + panza)} ${r1(x2)} ${r1(y2)}`, 1.1);
}

/** El piso: una franja de canto roto, de punta a punta. */
function piso(capa, desde, hasta, alto = ALTO) {
  const p = [[desde, alto + 2]];
  for (let x = desde; x <= hasta; x += 38) p.push([x, PISO + j(2.2)]);
  p.push([hasta, PISO], [hasta, alto + 2]);
  capa.lleno(poli(p));
}

/* ---------------------------------------------------------------- el camino */

const X = inicioDelLugar;

piso(cerca, -4, ANCHO + 4);

// --- Antes de la previa: el barrio que sigue para atrás.
casa(30, 70, 64, { techo: 'chapa' });
arbol(128, 92, 26);
casa(170, 96, 88, { techo: 'chato', prendidas: [1] });
tanque(206, 118);
casa(290, 84, 58, { techo: 'dos-aguas' });

// --- 0 · La previa: el barrio al atardecer, y la ronda alrededor del fuego.
{
  const x = X(0);
  casa(x + 6, 92, 76, { techo: 'chato', prendidas: [0] });
  antena(x + 30, 82, 30);
  casa(x + 112, 64, 104, { techo: 'chato', prendidas: [2] });
  tanque(x + 132, 134);
  arbol(x + 214, 110, 34);
  // El claro del medio: la ronda. El fuego lo dibuja la capa de la llama.
  sentada(x + 268);
  figura(x + 290, 34);
  sentada(x + 348);
  figura(x + 372, 31, 10);
  // Un cajón con botellas.
  cerca.lleno(caja(x + 392, PISO - 12, 22, 13, 0.8) + caja(x + 396, PISO - 24, 4, 12, 0.5) + caja(x + 404, PISO - 26, 4, 14, 0.5));
  casa(x + 440, 84, 62, { techo: 'chapa', prendidas: [1] });
  const a = poste(cerca, x + 420, 122);
  casa(x + 540, 70, 90, { techo: 'chato', prendidas: [0, 3] });
  antena(x + 580, 96, 26);
  cable(cerca, a, [x + 112, PISO - 104], 14);
  cable(cerca, a, [x + 610, PISO - 92], 9);
}

// --- 1 · La ida: campo abierto. Los postes que pasan y el micro son de otra capa.
{
  const x = X(1);
  arbol(x + 70, 60, 20);
  // Un cartel de la ruta.
  cerca.lleno(caja(x + 184, PISO - 64, 2.6, 66, 0.5) + caja(x + 168, PISO - 86, 46, 24, 1));
  // Alambrado: postes bajos y dos hilos.
  for (let i = 0; i < 9; i++) cerca.lleno(caja(x + 250 + i * 38, PISO - 20 + j(1.5), 2.2, 22, 0.5));
  cerca.trazo(`M${x + 250} ${PISO - 15}L${x + 556} ${PISO - 14}`, 0.9);
  cerca.trazo(`M${x + 250} ${PISO - 8}L${x + 556} ${PISO - 7}`, 0.9);
  arbol(x + 470, 74, 24);
  arbol(x + 512, 54, 17);
}

// --- 2 · La vereda: el paredón, el portón, el puesto y el parlante. La gente, de otra capa.
{
  const x = X(2);
  farol(x + 24, 128, 1);
  // El puesto: carro, toldo y humo.
  cerca.lleno(
    caja(x + 60, PISO - 34, 64, 26, 1) +
      poli([[x + 50, PISO - 50 + j()], [x + 132, PISO - 56 + j()], [x + 138, PISO - 44 + j()], [x + 46, PISO - 40 + j()]]) +
      caja(x + 64, PISO - 42, 2.4, 10, 0.4) +
      caja(x + 118, PISO - 46, 2.4, 14, 0.4) +
      mancha(x + 76, PISO - 4, 7, 7, 9, 0.1) +
      mancha(x + 110, PISO - 4, 7, 7, 9, 0.1),
  );
  luz.lleno(caja(x + 70, PISO - 30, 44, 4, 0.6));
  figura(x + 146, 33);
  figura(x + 160, 30, 10);
  // El paredón, largo, con el portón y los pilares.
  const base = x + 196;
  cerca.lleno(
    poli([[base, PISO + 2], [base + j(), PISO - 70 + j(2)], [base + 150, PISO - 73 + j(2)], [base + 300, PISO - 69 + j(2)], [base + 404 + j(), PISO - 72 + j(2)], [base + 404, PISO + 2]]),
  );
  // El portón: un hueco con arco quebrado.
  cerca.hueco(
      poli([[base + 168, PISO + 2], [base + 168, PISO - 44], [base + 180, PISO - 58], [base + 216, PISO - 59], [base + 228, PISO - 44], [base + 228, PISO + 2]]),
  );
  cerca.lleno(caja(base + 154, PISO - 86, 12, 88, 0.8) + caja(base + 230, PISO - 86, 12, 88, 0.8) + caja(base + 150, PISO - 92, 96, 7, 0.8));
  luz.lleno(caja(base + 172, PISO - 84, 52, 5, 0.6));
  // El parlante en su poste, atrás del paredón.
  cerca.lleno(caja(base + 330, PISO - 132, 3, 64, 0.5) + caja(base + 316, PISO - 150, 30, 20, 1));
  cerca.hueco(mancha(base + 325, PISO - 140, 4, 4, 8, 0.1) + mancha(base + 337, PISO - 140, 4, 4, 8, 0.1));
  // Las torres de luz del lugar, lejos, asomando.
  cerca.lleno(caja(base + 70, PISO - 150, 2.4, 80, 0.4) + caja(base + 58, PISO - 158, 26, 9, 0.8));
  luz.lleno(caja(base + 60, PISO - 156, 22, 5, 0.5));
  farol(x + 590, 128, -1);
}

// --- 3 · Cuando suena: el escenario. La gente de adelante y los haces son de otra capa.
{
  const x = X(3);
  const torre = (tx, alto) => {
    cerca.lleno(caja(tx, PISO - alto, 3, alto + 2, 0.5) + caja(tx + 24, PISO - alto, 3, alto + 2, 0.5));
    for (let y = PISO - alto; y < PISO - 12; y += 22) {
      cerca.trazo(`M${tx + 1.5} ${r1(y)}L${tx + 25.5} ${r1(y + 22)}M${tx + 25.5} ${r1(y)}L${tx + 1.5} ${r1(y + 22)}`, 1.3);
    }
  };
  const parlantes = (px, alto, n) => {
    for (let i = 0; i < n; i++) {
      const y = PISO - alto + i * 30;
      cerca.lleno(caja(px, y, 40, 28, 1));
      cerca.hueco(mancha(px + 12, y + 14, 6.5, 6.5, 9, 0.08) + mancha(px + 29, y + 14, 6.5, 6.5, 9, 0.08));
    }
  };
  torre(x + 96, 196);
  torre(x + 478, 196);
  // El techo: la viga, y los tachos colgados.
  cerca.lleno(caja(x + 84, PISO - 204, 432, 9, 1.4) + caja(x + 84, PISO - 192, 432, 3, 0.8));
  for (let i = 0; i < 7; i++) {
    const tx = x + 150 + i * 50;
    cerca.lleno(caja(tx, PISO - 190, 2, 8, 0.3) + poli([[tx - 6, PISO - 182], [tx + 8, PISO - 182], [tx + 6, PISO - 172 + j()], [tx - 4, PISO - 172 + j()]]));
    luz.lleno(caja(tx - 3.5, PISO - 172, 9, 3, 0.4));
  }
  parlantes(x + 40, 150, 5);
  parlantes(x + 520, 150, 5);
  // El piso del escenario y el telón de fondo.
  cerca.lleno(caja(x + 130, PISO - 78, 340, 80, 1.4));
  cerca.hueco(caja(x + 150, PISO - 68, 300, 3, 0.6));
  // Los que tocan: cuatro figuras sobre las tablas, recortadas contra la luz.
  for (const [fx, alto] of [[214, 30], [276, 34], [330, 32], [388, 30]]) {
    const y = PISO - 78 - alto;
    cerca.lleno(mancha(x + fx, y + 4, 3.8, 4.2, 7, 0.14) + poli([[x + fx - 5, y + 9], [x + fx + 5, y + 9], [x + fx + 4, y + alto + 2], [x + fx - 4, y + alto + 2]]));
  }
  // Un pie de micrófono.
  cerca.lleno(caja(x + 288, PISO - 78 - 26, 1.4, 26, 0.3));
}

// --- 4 · La vuelta: el barrio dormido. Una sola puerta prendida.
{
  const x = X(4);
  // La parada: el caño y el cartel.
  cerca.lleno(caja(x + 26, PISO - 70, 2.4, 72, 0.5) + caja(x + 16, PISO - 86, 22, 18, 0.8));
  casa(x + 70, 86, 70, { techo: 'chapa' });
  arbol(x + 190, 96, 30);
  farol(x + 236, 126, 1);
  casa(x + 268, 110, 92, { techo: 'chato', puerta: true });
  tanque(x + 306, 122);
  antena(x + 290, 98, 28);
  casa(x + 400, 70, 56, { techo: 'dos-aguas' });
  const a = poste(cerca, x + 492, 120);
  casa(x + 520, 80, 82, { techo: 'chato' });
  cable(cerca, a, [x + 268, PISO - 92], 13);
  cable(cerca, a, [X(5) + 299.4, PISO - 113], 12);
}

// --- Después de la vuelta: el barrio sigue.
arbol(X(5) + 40, 80, 24);
casa(X(5) + 80, 100, 74, { techo: 'chato' });
poste(cerca, X(5) + 298, 120);
casa(X(5) + 210, 76, 60, { techo: 'chapa' });
casa(X(5) + 312, 90, 96, { techo: 'chato' });

writeFileSync(`${SALIDA}/noche-cerca.svg`, cerca.svg(ANCHO, ALTO));
writeFileSync(`${SALIDA}/noche-luz.svg`, luz.svg(ANCHO, ALTO));

/* ---------------------------------------------------------------- lo de lejos: una baldosa */
{
  rnd = azar(73);
  const capa = new Capa();
  const ancho = 1200;
  // Una línea de lomas y arboleda, baja, que cierra consigo misma: el primer punto y el último
  // tienen la misma altura.
  const p = [[0, ALTO + 2]];
  const pasos = 60;
  const alturas = [];
  for (let i = 0; i <= pasos; i++) {
    const t = (i / pasos) * Math.PI * 2;
    alturas.push(168 + Math.sin(t * 2) * 10 + Math.sin(t * 5 + 1) * 6 + (i === 0 || i === pasos ? 0 : j(5)));
  }
  alturas[pasos] = alturas[0];
  alturas.forEach((y, i) => p.push([(i / pasos) * ancho, y]));
  p.push([ancho, ALTO + 2]);
  capa.lleno(poli(p));
  // Unas casas lejanas y un tanque, sobre la loma.
  for (const [x, w, h] of [[120, 46, 30], [176, 30, 44], [520, 60, 26], [596, 34, 40], [900, 50, 34], [1010, 28, 22]]) {
    capa.lleno(caja(x, 176 - h, w, h + 10, 1));
  }
  capa.lleno(caja(760, 112, 3, 60, 0.5) + caja(748, 104, 27, 12, 0.8));
  writeFileSync(`${SALIDA}/noche-lejos.svg`, capa.svg(ancho, ALTO));
}

/* ---------------------------------------------------------------- los postes que pasan */
{
  rnd = azar(7);
  const capa = new Capa();
  const ancho = 360;
  // Un poste por baldosa, y el cable que sale de una punta y llega a la otra a la misma altura.
  const punta = poste(capa, ancho / 2, 150, ALTO);
  cable(capa, [0, punta[1] + 6], punta, 12);
  cable(capa, punta, [ancho, punta[1] + 6], 12);
  cable(capa, [0, punta[1] + 0], [punta[0] - 9, punta[1] - 1], 11);
  cable(capa, [punta[0] + 9, punta[1] - 1], [ancho, punta[1] + 0], 11);
  writeFileSync(`${SALIDA}/noche-postes.svg`, capa.svg(ancho, ALTO));
}

/* ---------------------------------------------------------------- el micro */
{
  rnd = azar(11);
  const capa = new Capa();
  const ancho = 220;
  const alto = 90;
  // La carrocería, con la trompa a la derecha. Las ventanillas son agujeros: se ve la noche.
  capa.lleno(poli([[6, 76], [5, 24 + j()], [12, 14 + j()], [176, 12 + j()], [198, 30 + j()], [214, 52 + j()], [214, 76]]));
  for (let i = 0; i < 6; i++) capa.hueco(caja(18 + i * 26, 22, 19, 18, 0.7));
  capa.hueco(poli([[176, 22], [190, 23], [203, 44], [176, 43]]));
  capa.lleno(mancha(48, 76, 12, 12, 11, 0.06) + mancha(168, 76, 12, 12, 11, 0.06));
  // El portaequipaje del techo, con los bolsos.
  capa.lleno(caja(30, 7, 110, 3, 0.5) + mancha(54, 5, 12, 5, 8, 0.15) + mancha(92, 4, 15, 6, 8, 0.15) + mancha(122, 6, 9, 4, 8, 0.15));
  writeFileSync(`${SALIDA}/noche-micro.svg`, capa.svg(ancho, alto));
}

/* ---------------------------------------------------------------- las estrellas: una baldosa */
{
  rnd = azar(5);
  const capa = new Capa();
  const ancho = 320;
  const alto = 220;
  // Cuadrados, no puntos: son los píxeles del fichín.
  for (let i = 0; i < 26; i++) {
    const lado = rnd() < 0.25 ? 3 : 2;
    const x = Math.round(8 + rnd() * (ancho - 20));
    const y = Math.round(6 + rnd() * (alto - 16));
    capa.lleno(`M${x} ${y}h${lado}v${lado}h${-lado}Z`);
  }
  writeFileSync(`${SALIDA}/noche-estrellas.svg`, capa.svg(ancho, alto));
}

/* ---------------------------------------------------------------- el fuego de la previa */
{
  rnd = azar(3);
  const capa = new Capa();
  // Dos leños cruzados y la llama, de tres puntas.
  capa.lleno(
    poli([[4, 44], [8, 39], [56, 50], [53, 55]]) +
      poli([[4, 51], [52, 38], [56, 43], [7, 56]]) +
      poli([[14, 44], [11, 28], [19, 34], [23, 12], [31, 26], [36, 4], [42, 30], [49, 22], [46, 44]]),
  );
  writeFileSync(`${SALIDA}/noche-fuego.svg`, capa.svg(60, 58));
}

console.log('la noche, dibujada en', SALIDA);
