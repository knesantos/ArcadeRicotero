/**
 * La pared de «Completá la letra», impresa (ronda de pulida de los juegos, 2026-11-18).
 *
 *   npm run imprimir-pared-completar
 *
 * El objeto de este juego es **la pintada**: el verso escrito en una pared, con una palabra que
 * se cayó con el revoque ("te falta un diente en la sonrisa"). Deja en `public/arte/completar/`
 * las piezas de esa pared. Son **máscaras**: cada archivo trae solo la forma de una pasada, y la
 * tinta la pone `juego.css` desde `tokens.css` (`--borde` para la junta del ladrillo, `--fondo`
 * para el paño pintado, el rojo del error para el tachón). Ningún color nuevo.
 *
 *   · `ladrillos.webp`     — la junta de una pared de ladrillo a la vista, en baldosa que cierra.
 *                            Es fondo: no lleva texto encima.
 *   · `revoque-canto.webp` — el canto roto del paño pintado, donde el revoque se terminó. Baldosa
 *                            que cierra de costado; se usa arriba y, dada vuelta, abajo.
 *   · `tachon.webp`        — la raya de aerosol que tacha la palabra que no era.
 *
 * La mano se imprime acá, una vez; el teléfono no filtra nada, solo mueve
 * (`bestiario-inmersion.md` §1). Es dibujo propio. El azar tiene semilla: correrlo dos veces da
 * los mismos archivos.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SALIDA = 'public/arte/completar';
mkdirSync(SALIDA, { recursive: true });

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
const r1 = (n) => Math.round(n * 10) / 10;

async function imprimir(nombre, ancho, alto, cuerpo, defs = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}"><defs>${defs}</defs>${cuerpo}</svg>`;
  const datos = await sharp(Buffer.from(svg)).webp({ quality: 82, alphaQuality: 80, effort: 6 }).toBuffer();
  writeFileSync(`${SALIDA}/${nombre}.webp`, datos);
  console.log(`${nombre}.webp`, `${ancho}×${alto}`, `${(datos.length / 1024).toFixed(1)} KiB`);
}

/**
 * La falta de tinta: un ruido cosido (`stitchTiles`) que le come pedazos al trazo. No corre
 * nada de lugar, así que la baldosa sigue cerrando.
 */
const comida = (id, { grano = 0.5, falta = 0.3, semilla = 4 } = {}) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${grano}" numOctaves="2" seed="${semilla}" stitchTiles="stitch" result="g"/>
    <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 8 ${r1(-8 * (0.27 + falta * 0.22))}" result="h"/>
    <feComposite in="SourceGraphic" in2="h" operator="in"/>
  </filter>`;

// ---------------------------------------------------------------- los ladrillos

{
  // Aparejo a soga: hiladas de 26, ladrillos de 64, corridas medio ladrillo una de cada dos.
  const rnd = azar(1991);
  const LADRILLO = 64;
  const HILADA = 26;
  const ANCHO = LADRILLO * 4;
  const ALTO = HILADA * 8;
  const piezas = [];
  for (let h = 0; h < 8; h++) {
    const y = h * HILADA;
    // La junta de asiento: de lado a lado, apenas más gruesa a tramos.
    piezas.push(`<rect x="0" y="${y}" width="${ANCHO}" height="${r1(2.2 + rnd() * 0.9)}"/>`);
    const corrida = h % 2 === 0 ? 0 : LADRILLO / 2;
    for (let x = corrida; x < ANCHO; x += LADRILLO) {
      // La llaga: no llega justa al medio, como en una pared levantada a ojo.
      const dx = r1((rnd() - 0.5) * 5);
      piezas.push(`<rect x="${r1(x + dx)}" y="${y}" width="${r1(2 + rnd() * 0.8)}" height="${HILADA}"/>`);
    }
    // Una picadura cada tanto: un ladrillo cachado. Lejos del borde, así la baldosa cierra.
    if (rnd() < 0.6) {
      const px = 24 + rnd() * (ANCHO - 60);
      const py = y + 7 + rnd() * 9;
      piezas.push(
        `<path d="M${r1(px)},${r1(py)} l${r1(5 + rnd() * 6)},${r1(-3 + rnd() * 2)} l${r1(3 + rnd() * 4)},${r1(3 + rnd() * 3)} l${r1(-6 - rnd() * 4)},${r1(3 + rnd() * 2)} z"/>`,
      );
    }
  }
  await imprimir(
    'ladrillos',
    ANCHO,
    ALTO,
    `<g fill="#fff" filter="url(#c)">${piezas.join('')}</g>`,
    comida('c', { grano: 0.42, falta: 0.25, semilla: 7 }),
  );
}

// ---------------------------------------------------------------- el canto del revoque

{
  // El paño pintado termina donde se terminó el revoque: un canto a mordiscones, con algún
  // pedazo suelto que quedó agarrado más arriba. Lo lleno es lo de abajo.
  const rnd = azar(54);
  const ANCHO = 416;
  const ALTO = 26;
  const BASE = 15;
  const puntos = [];
  let x = 0;
  let y = BASE;
  const y0 = BASE;
  while (x < ANCHO) {
    puntos.push([x, y]);
    const paso = 5 + rnd() * 16;
    x = Math.min(ANCHO, x + paso);
    // Escalones duros: sube o baja de golpe y sigue derecho, como se quiebra un revoque.
    if (rnd() < 0.55) y = Math.max(4, Math.min(ALTO - 5, y + (rnd() - 0.5) * 16));
    puntos.push([x, puntos[puntos.length - 1][1]]);
    puntos.push([x, y]);
  }
  // Cierra con el arranque: la baldosa se repite de costado sin escalón.
  puntos.push([ANCHO, y0]);
  const d = `M0,${ALTO} L${puntos.map(([px, py]) => `${r1(px)},${r1(py)}`).join(' L')} L${ANCHO},${ALTO} Z`;
  const sueltos = [];
  for (let i = 0; i < 7; i++) {
    const sx = 20 + rnd() * (ANCHO - 50);
    const sy = 1 + rnd() * 5;
    sueltos.push(`<path d="M${r1(sx)},${r1(sy)} l${r1(3 + rnd() * 6)},${r1(rnd() * 2)} l${r1(-1 - rnd() * 2)},${r1(2 + rnd() * 3)} l${r1(-3 - rnd() * 4)},${r1(-1 + rnd())} z"/>`);
  }
  await imprimir('revoque-canto', ANCHO, ALTO, `<g fill="#fff"><path d="${d}"/>${sueltos.join('')}</g>`);
}

// ---------------------------------------------------------------- el tachón de aerosol

{
  // Una raya de aerosol de ida: gorda, con el pulso de la mano y los bordes comidos por la
  // pared. Tacha la palabra que no era.
  const rnd = azar(77);
  const ANCHO = 240;
  const ALTO = 40;
  const pts = [];
  for (let i = 0; i <= 8; i++) pts.push([8 + (i * (ANCHO - 16)) / 8, ALTO / 2 + (rnd() - 0.5) * 7 + (i % 2 ? -2 : 2)]);
  const d = `M${pts.map(([px, py]) => `${r1(px)},${r1(py)}`).join(' L')}`;
  const gotas = [];
  for (let i = 0; i < 14; i++) {
    gotas.push(`<circle cx="${r1(10 + rnd() * (ANCHO - 20))}" cy="${r1(ALTO / 2 + (rnd() - 0.5) * 30)}" r="${r1(0.6 + rnd() * 1.3)}"/>`);
  }
  const defs = `
  <filter id="a" x="-5%" y="-30%" width="110%" height="160%">
    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="p"/>
    <feDisplacementMap in="SourceGraphic" in2="p" scale="5" xChannelSelector="R" yChannelSelector="G" result="t"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="12" result="g"/>
    <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 8 -2.6" result="h"/>
    <feComposite in="t" in2="h" operator="in"/>
  </filter>`;
  await imprimir(
    'tachon',
    ANCHO,
    ALTO,
    `<g filter="url(#a)"><path d="${d}" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><g fill="#fff">${gotas.join('')}</g></g>`,
    defs,
  );
}
