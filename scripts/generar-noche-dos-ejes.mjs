/**
 * La noche de «¿Qué tipo de ricotero sos?», impresa (ronda de pulida de los juegos, 2026-11-18).
 *
 *   npm run generar-noche-dos-ejes
 *
 * Deja en `public/arte/dos-ejes/` las pasadas del camino de la noche: el barrio de la previa,
 * la ruta de la ida, la reja de la vereda, el escenario de cuando suena y el barrio dormido de
 * la vuelta. Son **máscaras**: cada archivo trae solo la forma de una pasada de tinta, y la
 * tinta la pone `juego.css` desde `tokens.css` (las de la tapa de *Luzbelito*: el mármol, el
 * cuero, la llama de la vela).
 *
 * ## La mano (ronda 2)
 *
 * La primera versión eran siluetas de vector liso, de un valor por capa: se veía de banco de
 * imágenes. Ahora cada lugar se imprime como una serigrafía de cuatro pasadas:
 *
 *   · **la sombra** — la silueta entera, en el mármol hondo;
 *   · **la tinta** — la misma silueta en el mármol claro, con lo que la gubia le sacó (rayado
 *     del lado en sombra, ladrillos, tablas, chapas) y con la falta de tinta del rodillo. En
 *     pantalla va corrida un par de píxeles: es el registro que no cierra;
 *   · **el cuero** — la gente y los trapos;
 *   · **la llama** — lo prendido.
 *
 * El canto irregular y el grano **se imprimen acá, una vez** (un desplazamiento y un ruido de
 * SVG que `sharp` vuelve píxeles); el teléfono no filtra nada, solo mueve (`transform` y
 * `opacity`), que es la regla del bestiario (`bestiario-inmersion.md` §1).
 *
 * Es dibujo propio. La gente también: la multitud de *Oktubre* que usaba la ronda 1 salió.
 * El azar tiene semilla: correrlo dos veces da los mismos archivos.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { GUINOS, TIRA, inicioDelLugar } from '../src/lib/dos-ejes/noche.ts';

const SALIDA = 'public/arte/dos-ejes';
mkdirSync(SALIDA, { recursive: true });

const ALTO = TIRA.alto;
const PISO = TIRA.piso;
const ANCHO = TIRA.ancho;
/** Cuántos píxeles por unidad se imprimen. En el teléfono una unidad mide cerca de un píxel. */
const ESCALA = 1.25;

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
const linea = (x1, y1, x2, y2) => `M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`;

function caja(x, y, w, h, mano = 1.3) {
  return poli([
    [x + j(mano), y + j(mano)],
    [x + w + j(mano), y + j(mano)],
    [x + w + j(mano), y + h + j(mano * 0.4)],
    [x + j(mano), y + h + j(mano * 0.4)],
  ]);
}

function mancha(cx, cy, rx, ry, lados = 9, mano = 0.18) {
  const p = [];
  for (let i = 0; i < lados; i++) {
    const a = (i / lados) * Math.PI * 2;
    const k = 1 + (rnd() - 0.5) * 2 * mano;
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return poli(p);
}

/** Una pasada de tinta: lo lleno, lo que se le recorta, los trazos, y lo que saca la gubia. */
class Capa {
  constructor() {
    this.llenos = [];
    this.huecos = [];
    this.trazos = [];
    this.gubias = [];
  }
  lleno(d) {
    this.llenos.push(d);
  }
  hueco(d) {
    this.huecos.push(d);
  }
  trazo(d, ancho = 1.6) {
    this.trazos.push([d, ancho]);
  }
  /** Una raya que la gubia saca de la tinta: en la sombra no está. */
  gubia(d, ancho = 1.2) {
    this.gubias.push([d, ancho]);
  }
  /** El dibujo, en blanco. Con `conGubia`, además se le sacan las rayas. */
  cuerpo(ancho, alto, conGubia) {
    const trazos = this.trazos.map(([d, a]) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${a}" stroke-linecap="square"/>`).join('');
    const rayas = conGubia ? this.gubias.map(([d, a]) => `<path d="${d}" fill="none" stroke="#000" stroke-width="${a}" stroke-linecap="round"/>`).join('') : '';
    return (
      `<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${ancho}" height="${alto}"><rect width="${ancho}" height="${alto}" fill="#fff"/>` +
      `<path fill="#000" d="${this.huecos.join('')}"/>${rayas}</mask>` +
      `<g mask="url(#m)"><path fill="#fff" d="${this.llenos.join('')}"/>${trazos}</g>`
    );
  }
}

/**
 * Imprime una pasada: el canto se corre con un ruido grueso (la tijera) y, si lleva grano, un
 * ruido fino le saca tinta en puntos (el rodillo). Sale un webp que es solo forma.
 */
async function imprimir(nombre, ancho, alto, cuerpo, { grano = 0, mano = 3, semilla = 4 } = {}) {
  // El grano: donde el ruido pasa de un umbral, no hay tinta. `grano` es cuánta falta (0 a 1).
  const corte = 5.4 + (1 - grano) * 1.6;
  const filtro =
    `<filter id="f" filterUnits="userSpaceOnUse" x="0" y="0" width="${ancho}" height="${alto}" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="${semilla}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="${mano}" xChannelSelector="R" yChannelSelector="G" result="d"/>` +
    (grano > 0
      ? `<feTurbulence type="fractalNoise" baseFrequency="0.55 0.8" numOctaves="2" seed="${semilla + 7}" result="g"/>` +
        `<feColorMatrix in="g" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 -10 ${r1(corte)}" result="gm"/>` +
        `<feComposite in="d" in2="gm" operator="in"/>`
      : '') +
    `</filter>`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${Math.round(ancho * ESCALA)}" height="${Math.round(alto * ESCALA)}">` +
    `<defs>${filtro}</defs><g filter="url(#f)">${cuerpo}</g></svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 55, alphaQuality: 88, effort: 5 }).toFile(`${SALIDA}/${nombre}.webp`);
}

const cerca = new Capa();
const cuero = new Capa();
const llama = new Capa();

/* ---------------------------------------------------------------- las piezas */

/** El lado en sombra de una pared: rayado en diagonal, a mano. */
function rayado(capa, x, y, w, h, paso = 4.5) {
  for (let k = -h; k < w; k += paso + j(0.8)) {
    const x1 = Math.max(x, x + k);
    const y1 = k < 0 ? y - k : y;
    const x2 = Math.min(x + w, x + k + h);
    const y2 = Math.min(y + h, y + (x2 - (x + k)));
    if (x2 - x1 > 1.5) capa.gubia(linea(x1 + j(0.5), y1 + j(0.5), x2 + j(0.5), y2 + j(0.5)), 1.1);
  }
}

/** Hiladas de ladrillo: rayas acostadas que no llegan de punta a punta. */
function hiladas(capa, x, y, w, h, paso = 9) {
  for (let yy = y + paso; yy < y + h - 2; yy += paso) {
    let xx = x + 3 + rnd() * 10;
    while (xx < x + w - 8) {
      const largo = 10 + rnd() * 22;
      capa.gubia(linea(xx, yy + j(0.6), Math.min(x + w - 3, xx + largo), yy + j(0.6)), 0.9);
      xx += largo + 5 + rnd() * 12;
    }
  }
}

function casa(x, w, h, { techo = 'chato', prendidas = [], puerta = false } = {}) {
  const y = PISO - h;
  let d = caja(x, y, w, h + 4);
  if (techo === 'chato') d += caja(x - 4, y - 6, w + 8, 8);
  if (techo === 'dos-aguas') d += poli([[x - 6 + j(), y + 2], [x + w / 2 + j(2), y - h * 0.32 + j()], [x + w + 6 + j(), y + 2]]);
  if (techo === 'chapa') d += poli([[x - 5, y + 3 + j()], [x - 3, y - 4 + j()], [x + w + 6, y - 12 + j()], [x + w + 5, y + 3 + j()]]);
  cerca.lleno(d);
  // El costado derecho queda en sombra: rayado. El frente, con sus hiladas.
  const costado = Math.min(20, w * 0.26);
  rayado(cerca, x + w - costado, y + 3, costado - 2, h - 2);
  cerca.gubia(linea(x + w - costado, y + 2, x + w - costado + j(), PISO), 1.3);
  hiladas(cerca, x + 2, y + 4, w - costado - 4, h - 4, 11);
  if (techo === 'chapa') for (let cx = x + 4; cx < x + w; cx += 7) cerca.gubia(linea(cx, y - 2, cx + 1, y - 9), 0.9);
  const filas = h > 86 ? 2 : 1;
  const columnas = Math.max(1, Math.floor((w - costado) / 30));
  let n = 0;
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
      const paso = (w - costado - 14) / columnas;
      const vx = x + 9 + c * paso;
      const vy = y + 14 + f * 34;
      const vw = Math.min(15, paso - 7);
      if (vw < 8) continue;
      const hueco = caja(vx, vy, vw, 15, 0.8);
      cerca.hueco(hueco);
      if (prendidas.includes(n)) {
        llama.lleno(hueco);
        // La cruz de la ventana, que se recorta contra la luz.
        llama.hueco(caja(vx + vw / 2 - 0.6, vy, 1.2, 15, 0.2) + caja(vx, vy + 6.5, vw, 1.2, 0.2));
      }
      n++;
    }
  }
  if (puerta) {
    const hueco = caja(x + 14, PISO - 30, 13, 30, 0.8);
    cerca.hueco(hueco);
    llama.lleno(hueco);
  }
}

function tanque(x, alto) {
  const y = PISO - alto;
  cerca.lleno(caja(x, y, 22, 16) + caja(x + 2, y + 15, 2.4, 14, 0.5) + caja(x + 17, y + 15, 2.4, 14, 0.5));
  rayado(cerca, x + 13, y + 2, 8, 12, 3.5);
}

function antena(x, base, alto) {
  const y = PISO - base;
  cerca.lleno(caja(x, y - alto, 1.8, alto, 0.4) + caja(x - 8, y - alto + 3, 18, 1.6, 0.4) + caja(x - 5, y - alto + 9, 12, 1.6, 0.4));
}

function arbol(x, alto, copa) {
  cerca.lleno(caja(x - 2.5, PISO - alto * 0.5, 5, alto * 0.5 + 3, 0.8) + mancha(x + j(3), PISO - alto * 0.72, copa, copa * 0.82, 13, 0.24));
  // Las hojas: tajos cortos y sueltos, más del lado en sombra.
  for (let i = 0; i < copa * 0.9; i++) {
    const a = rnd() * Math.PI * 2;
    const r = rnd() * copa * 0.78;
    const cx = x + Math.cos(a) * r + copa * 0.12;
    const cy = PISO - alto * 0.72 + Math.sin(a) * r * 0.8;
    cerca.gubia(linea(cx, cy, cx + 3 + rnd() * 3, cy + 2 + rnd() * 2), 1.2);
  }
}

function farol(x, alto, lado = 1, prendido = true) {
  const y = PISO - alto;
  cerca.lleno(caja(x, y, 2.6, alto + 3, 0.5) + caja(lado > 0 ? x : x - 18, y, 20, 2.2, 0.4) + caja(lado > 0 ? x + 14 : x - 20, y + 2, 9, 4, 0.5));
  if (prendido) llama.lleno(poli([[x + lado * 19 - 4, y + 7], [x + lado * 19 + 5, y + 7], [x + lado * 19 + 3, y + 13], [x + lado * 19 - 2.5, y + 13]]));
}

/** Una figura parada, en la capa que se pida. Con `brazo`, levanta uno. */
function figura(capa, x, alto = 32, ancho = 9, { base = PISO, brazo = 0 } = {}) {
  const y = base - alto;
  let d =
    mancha(x, y + 4, 3.6, 4.1, 8, 0.14) +
    poli([[x - ancho / 2 + j(0.8), y + 9], [x + ancho / 2 + j(0.8), y + 9], [x + ancho / 2 - 0.5 + j(0.8), base + 2], [x - ancho / 2 + 0.5 + j(0.8), base + 2]]);
  if (brazo) d += poli([[x + brazo * (ancho / 2 - 1), y + 11], [x + brazo * (ancho / 2 + 5), y - 4 + j()], [x + brazo * (ancho / 2 + 7.5), y - 3 + j()], [x + brazo * (ancho / 2 + 1.5), y + 14]]);
  capa.lleno(d);
  // La raya de las piernas.
  capa.hueco(caja(x - 0.5, base - alto * 0.38, 1, alto * 0.4, 0.2));
}

function sentada(capa, x) {
  capa.lleno(mancha(x, PISO - 20, 3.6, 4, 8, 0.14) + poli([[x - 6, PISO - 15 + j()], [x + 5, PISO - 15 + j()], [x + 11 + j(), PISO + 2], [x - 8 + j(), PISO + 2]]));
}

function poste(capa, x, alto, base = PISO) {
  const y = base - alto;
  capa.lleno(caja(x, y, 2.8, alto + 3, 0.5) + caja(x - 10, y + 6, 23, 2.4, 0.4));
  return [x + 1.4, y + 7];
}

function cable(capa, [x1, y1], [x2, y2], panza = 10) {
  capa.trazo(`M${r1(x1)} ${r1(y1)}Q${r1((x1 + x2) / 2)} ${r1((y1 + y2) / 2 + panza)} ${r1(x2)} ${r1(y2)}`, 1.1);
}

/** Un trapo atado de dos puntas: la tela cuelga y hace panza. */
function trapo(capa, x, y, w, h) {
  capa.lleno(
    poli([
      [x, y + j(0.8)],
      [x + w * 0.5, y + 2.5 + j(0.8)],
      [x + w, y + j(0.8)],
      [x + w - 1 + j(), y + h * 0.7],
      [x + w * 0.7, y + h + j(1.5)],
      [x + w * 0.35, y + h - 2 + j(1.5)],
      [x + 1 + j(), y + h * 0.8],
    ]),
  );
  // La franja del trapo.
  capa.hueco(poli([[x + 3, y + h * 0.36], [x + w - 3, y + h * 0.33], [x + w - 3, y + h * 0.52], [x + 3, y + h * 0.56]]));
}

function piso(capa, desde, hasta) {
  const p = [[desde, ALTO + 2]];
  for (let x = desde; x <= hasta; x += 38) p.push([x, PISO + j(2.2)]);
  p.push([hasta, PISO], [hasta, ALTO + 2]);
  capa.lleno(poli(p));
  // El piso es de tierra: tajos cortos, acostados.
  for (let x = desde + 10; x < hasta; x += 16 + rnd() * 30) {
    const y = PISO + 6 + rnd() * 16;
    capa.gubia(linea(x, y, x + 6 + rnd() * 14, y + j(0.8)), 1);
  }
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

// --- 0 · La previa: el barrio, y la ronda alrededor del fuego.
{
  const x = X(0);
  casa(x + 6, 92, 76, { techo: 'chato', prendidas: [0] });
  antena(x + 30, 82, 30);
  casa(x + 112, 64, 104, { techo: 'chato', prendidas: [2] });
  tanque(x + 132, 134);
  arbol(x + 214, 110, 34);
  // La ronda. El fuego lo dibuja su propia pieza, que es la que se mueve.
  sentada(cuero, x + 270);
  figura(cuero, x + 288, 34);
  sentada(cuero, x + 346);
  figura(cuero, x + 366, 31, 10, { brazo: 1 });
  // Un cajón con botellas.
  cerca.lleno(caja(x + 392, PISO - 12, 22, 13, 0.8) + caja(x + 396, PISO - 24, 4, 12, 0.5) + caja(x + 404, PISO - 26, 4, 14, 0.5));
  cerca.gubia(linea(x + 393, PISO - 6, x + 413, PISO - 6), 1);
  casa(x + 440, 84, 62, { techo: 'chapa', prendidas: [1] });
  const a = poste(cerca, x + 420, 122);
  casa(x + 540, 70, 90, { techo: 'chato', prendidas: [0, 3] });
  antena(x + 580, 96, 26);
  cable(cerca, a, [x + 112, PISO - 104], 14);
  cable(cerca, a, [x + 610, PISO - 92], 9);
  // La ropa colgada entre las dos casas de la izquierda.
  cable(cerca, [x + 98, PISO - 62], [x + 112, PISO - 70], 2);
}

// --- 1 · La ida: campo abierto. Los postes que pasan y el micro son de otra pieza.
{
  const x = X(1);
  arbol(x + 70, 60, 20);
  cerca.lleno(caja(x + 184, PISO - 64, 2.6, 66, 0.5) + caja(x + 168, PISO - 86, 46, 24, 1));
  // El cartel: una flecha, sacada con la gubia.
  cerca.gubia(linea(x + 176, PISO - 74, x + 204, PISO - 74), 2.2);
  cerca.gubia(`M${x + 197} ${PISO - 80}L${x + 205} ${PISO - 74}L${x + 197} ${PISO - 68}`, 2);
  for (let i = 0; i < 9; i++) cerca.lleno(caja(x + 250 + i * 38, PISO - 20 + j(1.5), 2.2, 22, 0.5));
  cerca.trazo(linea(x + 250, PISO - 15, x + 556, PISO - 14), 0.9);
  cerca.trazo(linea(x + 250, PISO - 8, x + 556, PISO - 7), 0.9);
  arbol(x + 470, 74, 24);
  arbol(x + 512, 54, 17);
  // Pasto alto contra el alambrado.
  for (let px = x + 256; px < x + 440; px += 5 + rnd() * 9) cerca.lleno(poli([[px, PISO + 1], [px + 1.5 + j(), PISO - 7 - rnd() * 6], [px + 3, PISO + 1]]));
}

// --- 2 · La vereda: la reja con los trapos, la cola, el puesto, el charco y el parlante.
{
  const x = X(2);
  farol(x + 20, 128, 1);
  // El puesto: carro, toldo y la brasa.
  cerca.lleno(
    caja(x + 52, PISO - 34, 64, 26, 1) +
      poli([[x + 42, PISO - 50 + j()], [x + 124, PISO - 56 + j()], [x + 130, PISO - 44 + j()], [x + 38, PISO - 40 + j()]]) +
      caja(x + 56, PISO - 42, 2.4, 10, 0.4) +
      caja(x + 110, PISO - 46, 2.4, 14, 0.4) +
      mancha(x + 68, PISO - 4, 7, 7, 9, 0.1) +
      mancha(x + 102, PISO - 4, 7, 7, 9, 0.1),
  );
  for (let tx = x + 48; tx < x + 126; tx += 9) cerca.gubia(linea(tx, PISO - 52, tx - 3, PISO - 42), 1.6);
  llama.lleno(caja(x + 62, PISO - 30, 44, 4, 0.6));
  figura(cuero, x + 136, 33);

  // La reja: barrotes, dos travesaños, los pilares y el portón cerrado, con su cadena.
  const r0 = x + 168;
  const r1x = x + 584;
  const altoReja = 82;
  for (let bx = r0; bx <= r1x; bx += 9.5) {
    const enPorton = bx > x + 352 && bx < x + 420;
    cerca.lleno(caja(bx, PISO - altoReja - (enPorton ? 6 : 0) + j(1.2), 1.7, altoReja + (enPorton ? 8 : 2), 0.35));
    // La punta de lanza.
    cerca.lleno(poli([[bx - 1.4, PISO - altoReja - (enPorton ? 6 : 0)], [bx + 0.9, PISO - altoReja - (enPorton ? 13 : 7) + j(0.6)], [bx + 3.1, PISO - altoReja - (enPorton ? 6 : 0)]]));
  }
  cerca.lleno(caja(r0 - 2, PISO - altoReja + 8, r1x - r0 + 6, 2.6, 0.5) + caja(r0 - 2, PISO - 16, r1x - r0 + 6, 2.6, 0.5));
  for (const px of [r0 - 8, x + 342, x + 420, r1x + 2]) {
    cerca.lleno(caja(px, PISO - altoReja - 12, 11, altoReja + 14, 0.8) + caja(px - 2, PISO - altoReja - 17, 15, 6, 0.6));
    hiladas(cerca, px + 1, PISO - altoReja - 10, 9, altoReja + 8, 8);
  }
  // El arco de chapa arriba del portón, y la luz del cartel.
  cerca.lleno(poli([[x + 342, PISO - altoReja - 14], [x + 356, PISO - altoReja - 30 + j()], [x + 418, PISO - altoReja - 31 + j()], [x + 431, PISO - altoReja - 14]]));
  llama.lleno(caja(x + 362, PISO - altoReja - 25, 50, 5, 0.6));
  // La cadena del portón: está cerrado.
  cuero.trazo(`M${x + 378} ${PISO - 44}Q${x + 386} ${PISO - 34} ${x + 394} ${PISO - 44}`, 1.8);

  // Los trapos, atados a la reja de dos puntas.
  trapo(cuero, x + 186, PISO - altoReja + 12, 46, 24);
  trapo(cuero, x + 262, PISO - altoReja + 15, 58, 27);
  trapo(cuero, x + 448, PISO - altoReja + 12, 52, 25);
  trapo(cuero, x + 522, PISO - altoReja + 16, 40, 22);

  // La cola: de espaldas a nosotros, contra la reja. Altos, bajos, alguno con el brazo arriba.
  for (let fx = x + 178; fx < x + 580; fx += 11 + rnd() * 9) {
    if (fx > x + 300 && fx < x + 336) continue; // el claro del charco
    figura(cuero, fx, 27 + rnd() * 9, 8 + rnd() * 2.5, { base: PISO - 2 + rnd() * 5, brazo: rnd() < 0.14 ? (rnd() < 0.5 ? 1 : -1) : 0 });
  }

  // El charco: un hueco en la tinta del piso, y el reflejo roto del cartel adentro.
  cerca.gubia(poli([[x + 286, PISO + 12], [x + 300, PISO + 8], [x + 332, PISO + 7], [x + 352, PISO + 11], [x + 346, PISO + 18], [x + 318, PISO + 21], [x + 294, PISO + 19]]), 0.1);
  cerca.hueco(poli([[x + 288, PISO + 12.5], [x + 301, PISO + 9], [x + 331, PISO + 8], [x + 350, PISO + 11.5], [x + 344, PISO + 17], [x + 318, PISO + 19.5], [x + 295, PISO + 18]]));
  for (const [lx, ly, lw] of [[306, 10.5, 9], [321, 11.5, 15], [311, 14, 6], [327, 15, 10], [316, 17, 5], [300, 13.5, 4]]) {
    llama.lleno(poli([[x + lx + j(0.5), PISO + ly], [x + lx + lw + j(0.8), PISO + ly + 0.3], [x + lx + lw - 1, PISO + ly + 1.5], [x + lx + 1, PISO + ly + 1.3]]));
  }

  // El parlante: una bocina grande en su poste, del lado de adentro.
  const bx = x + 478;
  cerca.lleno(caja(bx, PISO - 150, 3.4, 72, 0.5));
  cerca.lleno(poli([[bx - 4, PISO - 160], [bx + 8, PISO - 163], [bx + 34, PISO - 176 + j()], [bx + 36, PISO - 140 + j()], [bx + 8, PISO - 150], [bx - 4, PISO - 152]]));
  cerca.gubia(linea(bx + 12, PISO - 161, bx + 12, PISO - 151), 1.2);
  cerca.gubia(linea(bx + 22, PISO - 166, bx + 23, PISO - 146), 1.2);
  farol(x + 596, 128, -1);
}

// --- 3 · Cuando suena: el escenario. La gente de adelante y los haces son de otra pieza.
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
      rayado(cerca, px + 33, y + 2, 6, 24, 3.2);
    }
  };
  torre(x + 96, 196);
  torre(x + 478, 196);
  cerca.lleno(caja(x + 84, PISO - 204, 432, 9, 1.4) + caja(x + 84, PISO - 192, 432, 3, 0.8));
  for (let i = 0; i < 7; i++) {
    const tx = x + 150 + i * 50;
    cerca.lleno(caja(tx, PISO - 190, 2, 8, 0.3) + poli([[tx - 6, PISO - 182], [tx + 8, PISO - 182], [tx + 6, PISO - 172 + j()], [tx - 4, PISO - 172 + j()]]));
    llama.lleno(caja(tx - 3.5, PISO - 172, 9, 3, 0.4));
  }
  parlantes(x + 40, 150, 5);
  parlantes(x + 520, 150, 5);
  // Las tablas y el frente del escenario, de madera: tablas paradas.
  cerca.lleno(caja(x + 130, PISO - 78, 340, 80, 1.4));
  cerca.hueco(caja(x + 150, PISO - 68, 300, 3, 0.6));
  for (let tx = x + 144; tx < x + 466; tx += 13 + j(2)) cerca.gubia(linea(tx, PISO - 62, tx + j(), PISO - 4), 0.9);
  // Los que tocan: cuatro figuras recortadas contra la luz, y un pie de micrófono.
  for (const [fx, alto] of [[214, 30], [276, 34], [330, 32], [388, 30]]) {
    const y = PISO - 78 - alto;
    cerca.lleno(mancha(x + fx, y + 4, 3.8, 4.2, 8, 0.14) + poli([[x + fx - 5, y + 9], [x + fx + 5, y + 9], [x + fx + 4, y + alto + 2], [x + fx - 4, y + alto + 2]]));
  }
  cerca.lleno(caja(x + 288, PISO - 78 - 26, 1.4, 26, 0.3));
}

// --- 4 · La vuelta: el barrio dormido. Una sola puerta prendida.
{
  const x = X(4);
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

await imprimir('noche-sombra', ANCHO, ALTO, cerca.cuerpo(ANCHO, ALTO, false), { mano: 3.4, semilla: 4 });
await imprimir('noche-tinta', ANCHO, ALTO, cerca.cuerpo(ANCHO, ALTO, true), { mano: 3.4, semilla: 4, grano: 0.5 });
await imprimir('noche-cuero', ANCHO, ALTO, cuero.cuerpo(ANCHO, ALTO, true), { mano: 2.2, semilla: 9, grano: 0.3 });
await imprimir('noche-llama', ANCHO, ALTO, llama.cuerpo(ANCHO, ALTO, true), { mano: 1.6, semilla: 12, grano: 0.2 });

/* ---------------------------------------------------------------- lo de lejos: una baldosa */
{
  rnd = azar(73);
  const capa = new Capa();
  const ancho = 1200;
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
  for (const [x, w, h] of [[120, 46, 30], [176, 30, 44], [520, 60, 26], [596, 34, 40], [900, 50, 34], [1010, 28, 22]]) {
    capa.lleno(caja(x, 176 - h, w, h + 10, 1));
    capa.hueco(caja(x + 6, 182 - h, 6, 7, 0.5));
  }
  capa.lleno(caja(760, 112, 3, 60, 0.5) + caja(748, 104, 27, 12, 0.8));
  // El monte: rayas largas, acostadas, que siguen la loma.
  for (let y = 186; y < 236; y += 9) for (let x = 10 + rnd() * 40; x < ancho - 60; x += 70 + rnd() * 90) capa.gubia(linea(x, y + j(2), x + 30 + rnd() * 50, y + j(2)), 1.1);
  // Sin corrimiento de canto: es una baldosa y tiene que cerrar consigo misma.
  await imprimir('noche-lejos', ancho, ALTO, capa.cuerpo(ancho, ALTO, true), { mano: 0, grano: 0.45, semilla: 21 });
}

/* ---------------------------------------------------------------- los postes que pasan */
{
  rnd = azar(7);
  const capa = new Capa();
  const ancho = 360;
  const punta = poste(capa, ancho / 2, 150, ALTO);
  cable(capa, [0, punta[1] + 6], punta, 12);
  cable(capa, punta, [ancho, punta[1] + 6], 12);
  cable(capa, [0, punta[1] + 0], [punta[0] - 9, punta[1] - 1], 11);
  cable(capa, [punta[0] + 9, punta[1] - 1], [ancho, punta[1] + 0], 11);
  await imprimir('noche-postes', ancho, ALTO, capa.cuerpo(ancho, ALTO, true), { mano: 0, grano: 0.2, semilla: 3 });
}

/* ---------------------------------------------------------------- el micro */
{
  rnd = azar(11);
  const capa = new Capa();
  const ancho = 220;
  const alto = 96;
  capa.lleno(poli([[6, 78], [5, 26 + j()], [12, 16 + j()], [176, 14 + j()], [198, 32 + j()], [214, 54 + j()], [214, 78]]));
  for (let i = 0; i < 6; i++) capa.hueco(caja(18 + i * 26, 24, 19, 18, 0.7));
  capa.hueco(poli([[176, 24], [190, 25], [203, 46], [176, 45]]));
  capa.lleno(mancha(48, 79, 12, 12, 11, 0.06) + mancha(168, 79, 12, 12, 11, 0.06));
  capa.hueco(mancha(48, 79, 4, 4, 7, 0.1) + mancha(168, 79, 4, 4, 7, 0.1));
  capa.lleno(caja(30, 9, 110, 3, 0.5) + mancha(54, 7, 12, 5, 8, 0.15) + mancha(92, 6, 15, 6, 8, 0.15) + mancha(122, 8, 9, 4, 8, 0.15));
  // La franja del costado y el barro de abajo.
  capa.gubia(linea(10, 52, 206, 54), 2.4);
  for (let x = 14; x < 206; x += 5 + rnd() * 6) capa.gubia(linea(x, 70 + rnd() * 6, x + 2 + rnd() * 3, 73 + rnd() * 4), 1);
  await imprimir('noche-micro', ancho, alto, capa.cuerpo(ancho, alto, true), { mano: 2, grano: 0.35, semilla: 5 });
}

/* ---------------------------------------------------------------- la gente de adelante: una baldosa */
{
  rnd = azar(1985);
  const gente = new Capa();
  const atras = new Capa();
  const trapos = new Capa();
  const ancho = 520;
  const alto = 150;
  // Tres filas: las de atrás, chicas y apretadas; la de adelante, de espaldas, con hombros.
  const fila = (capa, y, radio, paso, hombros) => {
    for (let x = -paso; x < ancho + paso; x += paso * (0.8 + rnd() * 0.45)) {
      const cy = y + j(radio * 0.7);
      const pieza =
        mancha(x, cy, radio, radio * 1.12, 9, 0.12) +
        poli([[x - hombros + j(1.5), cy + radio * 1.5], [x - radio * 0.6, cy + radio * 0.7], [x + radio * 0.6, cy + radio * 0.7], [x + hombros + j(1.5), cy + radio * 1.5], [x + hombros + 1, alto + 2], [x - hombros - 1, alto + 2]]);
      for (const dx of [0, ancho, -ancho]) {
        if (x + dx < -40 || x + dx > ancho + 40) continue;
        capa.lleno(pieza.replace(/([ML])(-?[\d.]+) /g, (_, c, n) => `${c}${r1(Number(n) + dx)} `));
      }
      // Cada tanto, un brazo arriba o un trapo en su caña.
      const que = rnd();
      if (que < 0.22 && x > 14 && x < ancho - 14) {
        const lado = rnd() < 0.5 ? -1 : 1;
        capa.lleno(poli([[x + lado * hombros * 0.7, cy + radio * 1.3], [x + lado * (hombros * 0.7 + 4), cy - radio * 2.2 + j(2)], [x + lado * (hombros * 0.7 + 4) + 3.4, cy - radio * 2.1 + j(2)], [x + lado * hombros * 0.7 + 4, cy + radio * 1.5]]));
      } else if (que < 0.3 && x > 40 && x < ancho - 60) {
        const tope = cy - radio * 3.4 - rnd() * 14;
        capa.lleno(caja(x + hombros * 0.6, tope, 1.5, cy - tope + radio, 0.3));
        trapos.lleno(poli([[x + hombros * 0.6 + 1.5, tope + j()], [x + hombros * 0.6 + 16 + j(2), tope + 3 + j(2)], [x + hombros * 0.6 + 30 + j(3), tope - 1 + j(2)], [x + hombros * 0.6 + 27 + j(3), tope + 15 + j(2)], [x + hombros * 0.6 + 13 + j(2), tope + 19 + j(2)], [x + hombros * 0.6 + 1.5, tope + 15 + j()]]));
      }
    }
  };
  // Las dos filas de atrás van a la pasada de sombra; la de adelante, sola, al cuero: entre
  // cabeza y cabeza se ve la fila de atrás, y la gente deja de ser una mancha.
  fila(atras, 50, 4.8, 12, 7);
  fila(atras, 74, 6.4, 16, 10);
  fila(gente, 106, 8.8, 27, 12);
  // Un piso lleno debajo de la fila de adelante: la baldosa no deja ver nada por abajo.
  atras.lleno(`M0 92H${ancho}V${alto + 2}H0Z`);
  gente.lleno(`M0 138H${ancho}V${alto + 2}H0Z`);
  // El pelo y los hombros de la fila de adelante: tajos cortos.
  for (let i = 0; i < 150; i++) {
    const x = rnd() * ancho;
    const y = 96 + rnd() * 50;
    gente.gubia(linea(x, y, x + j(3), y + 4 + rnd() * 4), 1);
  }
  await imprimir('noche-gente', ancho, alto, gente.cuerpo(ancho, alto, true), { mano: 0, grano: 0.3, semilla: 31 });
  await imprimir('noche-gente-atras', ancho, alto, atras.cuerpo(ancho, alto, true), { mano: 0, grano: 0.4, semilla: 32 });
  await imprimir('noche-gente-trapos', ancho, alto, trapos.cuerpo(ancho, alto, true), { mano: 0, grano: 0.25, semilla: 33 });
}

/* ---------------------------------------------------------------- las estrellas: una baldosa */
{
  rnd = azar(5);
  const partes = [];
  // Cuadrados, no puntos: son los píxeles del fichín. Sin mano y sin grano: el píxel es duro.
  for (let i = 0; i < 26; i++) {
    const lado = rnd() < 0.25 ? 3 : 2;
    const x = Math.round(8 + rnd() * 300);
    const y = Math.round(6 + rnd() * 204);
    partes.push(`M${x} ${y}h${lado}v${lado}h${-lado}Z`);
  }
  writeFileSync(`${SALIDA}/noche-estrellas.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220"><path fill="#fff" d="${partes.join('')}"/></svg>\n`);
}

/* ---------------------------------------------------------------- el fuego de la previa */
{
  rnd = azar(3);
  const capa = new Capa();
  capa.lleno(
    poli([[4, 44], [8, 39], [56, 50], [53, 55]]) +
      poli([[4, 51], [52, 38], [56, 43], [7, 56]]) +
      poli([[14, 44], [11, 28], [19, 34], [23, 12], [31, 26], [36, 4], [42, 30], [49, 22], [46, 44]]),
  );
  capa.hueco(poli([[26, 42], [29, 30], [33, 36], [35, 26], [38, 42]]));
  await imprimir('noche-fuego', 60, 58, capa.cuerpo(60, 58, true), { mano: 1.2, grano: 0.15, semilla: 2 });
}

/* ---------------------------------------------------------------- los guiños: lo que aparece al elegir */
{
  rnd = azar(42);
  // Una figura que se suma, y un trapo en su caña. Las medidas las dice `noche.ts`.
  const f = new Capa();
  const fw = GUINOS.figura.ancho;
  const fh = GUINOS.figura.alto;
  f.lleno(
    mancha(fw / 2, 6, 4.2, 4.8, 9, 0.12) +
      poli([[fw / 2 - 6, 12], [fw / 2 + 6, 12], [fw / 2 + 5, fh], [fw / 2 - 5, fh]]) +
      poli([[fw / 2 + 5, 14], [fw / 2 + 11, 2], [fw / 2 + 13.5, 3], [fw / 2 + 7, 18]]),
  );
  f.hueco(caja(fw / 2 - 0.6, fh * 0.62, 1.2, fh * 0.4, 0.2));
  await imprimir('noche-figura', fw, fh, f.cuerpo(fw, fh, true), { mano: 1.2, grano: 0.25, semilla: 14 });

  const t = new Capa();
  const tw = GUINOS.trapo.ancho;
  const th = GUINOS.trapo.alto;
  t.lleno(caja(3, 2, 1.8, th - 2, 0.3) + poli([[5, 3], [20, 6], [tw - 2, 2], [tw - 5, 20], [22, 25], [5, 21]]));
  t.hueco(poli([[8, 10], [tw - 7, 9], [tw - 8, 14], [8, 15]]));
  await imprimir('noche-trapo', tw, th, t.cuerpo(tw, th, true), { mano: 1.4, grano: 0.25, semilla: 15 });
}

console.log('la noche, impresa en', SALIDA);
