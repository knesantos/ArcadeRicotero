/**
 * El arte del recinto del monte y la pastura (`D-73`, tercera vuelta), a aerógrafo.
 *
 * Cada pieza es un dibujo en las coordenadas de su dueño —el títere o la escena— y una caja.
 * `scripts/imprimir-bestiario.mjs` las imprime a `public/bestiario/`, y `titeres.ts` y
 * `escena-monte.ts` las pegan donde dice la caja. Las que se mueven (patas, cola, cabeza,
 * torso) son piezas sueltas, como un recorte de papel articulado.
 *
 * La luz viene de la izquierda, como en la tapa de *Lobo suelto*: la mitad derecha de la
 * cara del lobo se hunde en la sombra.
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';

const T = {
  claro: 'var(--bestia-lobo-claro)',
  crema: 'var(--bestia-lobo-crema)',
  ocre: 'var(--bestia-lobo-ocre)',
  sombra: 'var(--bestia-lobo-sombra)',
  oscuro: 'var(--bestia-lobo-oscuro)',
  gris: 'var(--bestia-lobo-gris)',
  negro: 'var(--fondo)',
  papel: 'var(--papel)',
  ojo: 'var(--bestia-ojo-blanco)',
};

/* ------------------------------------------------------------------
   El lobo: la cabeza
   ------------------------------------------------------------------ */

const CARA =
  'M37 -150 C33 -177, 56 -186, 70 -179 C84 -186, 108 -177, 104 -150 C106 -136, 104 -126, 107 -118 L101 -116 C102 -106, 96 -97, 86 -90 C78 -85, 62 -85, 54 -90 C44 -97, 38 -106, 39 -116 L33 -118 C36 -126, 34 -136, 37 -150 Z';
const OREJA_IZQ = 'M41 -150 C34 -170, 30 -192, 27 -214 C40 -196, 56 -180, 67 -167 Z';
const OREJA_DER = 'M75 -167 C86 -181, 100 -196, 115 -212 C112 -190, 108 -170, 103 -149 Z';

function cabezaLobo(): string {
  const orejas =
    enmascarado('m-oreja-izq', OREJA_IZQ, forma(OREJA_IZQ, T.ocre) + nube(42, -186, 6, 22, T.crema, 'm', 0.8) + soplo('M38 -160 L31 -205 L58 -172 Z', T.oscuro, 'm', 0.85)) +
    enmascarado('m-oreja-der', OREJA_DER, forma(OREJA_DER, T.oscuro) + soplo('M84 -172 L110 -204 L104 -156 Z', T.negro, 'm', 0.9) + nube(110, -190, 3, 14, T.sombra, 's', 0.7));

  const volumen =
    forma(CARA, T.crema) +
    // La luz: el pómulo y la frente del lado izquierdo, y nada más.
    nube(46, -122, 9, 18, T.claro, 'm', 0.95) +
    nube(52, -166, 13, 9, T.claro, 'm', 0.9) +
    nube(44, -150, 4, 9, T.papel, 's', 0.5) +
    // La mitad de la sombra: la derecha de quien mira, soplada sobre la máscara de la cara.
    soplo('M72 -188 C98 -188, 118 -160, 112 -118 C108 -98, 96 -84, 74 -82 C80 -110, 79 -150, 72 -188 Z', T.sombra, 'l') +
    soplo('M86 -180 C108 -170, 116 -140, 110 -110 C106 -96, 96 -88, 86 -86 C91 -120, 93 -150, 86 -180 Z', T.oscuro, 'm') +
    soplo('M80 -184 C104 -180, 118 -150, 112 -112 C108 -96, 98 -88, 82 -86 C86 -120, 86 -150, 80 -184 Z', T.negro, 'l', 0.7) +
    nube(104, -130, 6, 26, T.negro, 'm', 0.8) +
    // Las cuencas: hondas, con ojera. Los ojos van a quedar mirando desde un pozo.
    nube(55, -140, 19, 16, T.sombra, 'm', 0.95) +
    nube(55, -140, 14, 12, T.oscuro, 's', 0.75) +
    nube(88, -141, 15, 13, T.negro, 'm') +
    // El ceño: dos cuñas de sombra que bajan hacia el medio.
    soplo('M40 -158 L67 -147 L66 -152 L42 -166 Z', T.negro, 's', 0.85) +
    soplo('M100 -158 L74 -147 L75 -152 L98 -166 Z', T.negro, 's', 0.95) +
    nube(70, -152, 4, 8, T.sombra, 's', 0.8) +
    // El puente de la nariz, con una luz angosta.
    nube(69, -132, 5, 12, T.ocre, 's', 0.8) +
    nube(67, -136, 1.8, 8, T.claro, 'xs', 0.7) +
    // El hocico: las almohadillas hinchadas, gris azulado, y todo lo de abajo hundido.
    nube(61.5, -111, 10, 7.5, T.gris, 's', 0.95) +
    nube(79, -111, 10, 7.5, T.gris, 's', 0.55) +
    nube(80, -109, 9, 6, T.oscuro, 's', 0.6) +
    nube(70, -99, 20, 7, T.negro, 's', 0.9) +
    nube(70, -90, 14, 5, T.oscuro, 'm', 0.9) +
    // Los poros de los bigotes.
    [55, 59, 63, 77, 81, 85].map((x, i) => `<circle cx="${x}" cy="${-113 + (i % 2) * 3}" r="0.8" fill="${T.oscuro}" opacity="0.7"/>`).join('');

  const ojos =
    // El ojo grande: el blanco, sucio, con la sombra del párpado arriba. El iris es otra pieza.
    enmascarado('m-ojo-1', 'M42 -140 C44 -154, 67 -154, 68 -140 C66 -127, 44 -127, 42 -140 Z',
      forma('M42 -140 C44 -154, 67 -154, 68 -140 C66 -127, 44 -127, 42 -140 Z', T.ojo) + nube(55, -151, 13, 5, T.sombra, 's', 0.9) + nube(46, -140, 3, 6, T.ocre, 's', 0.5) + nube(64, -139, 3, 6, T.sombra, 's', 0.5)) +
    // El ojo chico, hundido, amarillento.
    enmascarado('m-ojo-2', 'M82 -140 C84 -146, 93 -146, 95 -140 C93 -135, 84 -135, 82 -140 Z',
      forma('M82 -140 C84 -146, 93 -146, 95 -140 C93 -135, 84 -135, 82 -140 Z', T.crema) + nube(88, -147, 9, 4, T.negro, 's'));

  const hocico =
    // La nariz: negra, ancha, húmeda.
    forma('M60 -124 C60 -131, 80 -131, 80 -124 C80 -117, 74 -113, 70 -113 C66 -113, 60 -117, 60 -124 Z', T.negro) +
    nube(65, -127, 3.5, 1.5, T.claro, 'xs', 0.6) +
    `<ellipse cx="65.5" cy="-119.5" rx="2.4" ry="1.5" fill="${T.oscuro}"/><ellipse cx="74.5" cy="-119.5" rx="2.4" ry="1.5" fill="${T.oscuro}"/>` +
    trazo('M70 -113 L70 -104', T.negro, 1.6) +
    // La boca cerrada: una raja oscura.
    soplo('M53 -103 Q70 -95 87 -103 Q78 -95 70 -94 Q62 -95 53 -103 Z', T.negro, 'xs');

  const colmillos =
    forma('M56 -104 C57 -97, 58 -90, 60 -83 C62 -91, 62 -98, 62 -104 Z', T.claro) +
    nube(61, -94, 1.3, 7, T.ocre, 'xs', 0.8) +
    nube(59, -103, 3, 2, T.sombra, 'xs', 0.8) +
    forma('M78 -104 C78 -97, 79 -90, 81 -83 C83 -91, 84 -98, 84 -104 Z', T.ocre) +
    nube(83, -94, 1.3, 7, T.oscuro, 'xs', 0.8);

  // El pelo del cachete: mechones blandos que se escapan de la silueta.
  const pelo =
    soplo('M36 -122 L26 -118 L34 -128 L25 -129 L35 -134 Z', T.crema, 'xs', 0.9) +
    soplo('M104 -122 L114 -118 L106 -128 L115 -129 L105 -134 Z', T.oscuro, 'xs', 0.9);

  return `<g filter="url(#grano)">${orejas}${enmascarado('m-cara-lobo', CARA, volumen)}${pelo}${ojos}${hocico}${colmillos}</g>`;
}

/** El iris de cada ojo: otra pieza, porque mira para donde está el cordero. */
function irisLobo(cx: number, cy: number, r: number, tinta: string): string {
  return (
    `<g filter="url(#grano)">` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${tinta}"/>` +
    nube(cx, cy - r * 0.35, r * 0.9, r * 0.5, T.oscuro, 'xs', 0.6) +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="${T.negro}"/>` +
    nube(cx + r * 0.3, cy - r * 0.35, r * 0.25, r * 0.2, T.papel, 'xs', 0.95) +
    `</g>`
  );
}

/** La boca abierta, para aullar: se pega encima de la cabeza y la isla la estira. */
function bocaLobo(): string {
  return (
    `<g filter="url(#grano)">` +
    forma('M54 -104 Q70 -100 86 -104 Q84 -88 70 -84 Q56 -88 54 -104 Z', T.negro) +
    nube(70, -92, 8, 4, 'var(--bestia-lobo-boca)', 's', 0.9) +
    forma('M57 -104 C58 -98, 59 -93, 60.5 -88 C62 -94, 62 -99, 62 -104 Z', T.ojo) +
    forma('M78 -104 C78 -98, 79 -93, 80.5 -88 C82 -94, 83 -99, 83 -104 Z', T.crema) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El lobo: el cuerpo
   ------------------------------------------------------------------ */

const TORSO_LOBO =
  'M-64 -66 C-72 -94, -38 -106, 2 -100 C30 -96, 46 -92, 54 -96 C62 -100, 70 -104, 76 -100 L82 -90 C72 -82, 62 -74, 56 -62 C52 -46, 34 -38, 6 -40 C-26 -40, -58 -42, -64 -66 Z';

function torsoLobo(): string {
  const adentro =
    forma(TORSO_LOBO, T.ocre) +
    // El lomo en sombra, la panza apenas más clara, y la luz del lado de la cabeza.
    soplo('M-70 -96 C-30 -112, 30 -104, 60 -98 L60 -84 C20 -88, -30 -92, -70 -78 Z', T.oscuro, 'l') +
    nube(-6, -46, 46, 9, T.crema, 'm', 0.85) +
    nube(40, -78, 16, 22, T.crema, 'm', 0.9) +
    nube(46, -84, 6, 12, T.claro, 's', 0.8) +
    // Las costillas: bandas sopladas, como el pecho rayado de la tapa.
    [-42, -28, -14, 0, 14, 26].map((x) => nube(x, -66, 4.5, 22, T.sombra, 's', 0.75, 12)).join('') +
    // El cogote, con las rayas del pecho de la tapa.
    [0, 1, 2, 3].map((k) => nube(64 - k * 4, -94 + k * 8, 14, 2.6, T.sombra, 's', 0.8, -32)).join('') +
    // La grupa, hundida.
    nube(-58, -70, 12, 18, T.negro, 'm', 0.7);
  return `<g filter="url(#grano)">${enmascarado('m-torso-lobo', TORSO_LOBO, adentro)}` +
    // El pelo erizado del lomo: puntas que salen de la silueta.
    soplo('M-40 -101 l4 -8 l3 7 l5 -9 l3 8 l5 -8 l2 9 l5 -7 l1 8 Z', T.oscuro, 'xs') +
    `</g>`;
}

const PATA_TRAS = 'M-52 -66 C-62 -52, -60 -38, -52 -30 C-48 -24, -53 -12, -55 -4 L-44 -4 C-43 -12, -37 -24, -39 -34 C-41 -46, -34 -56, -32 -66 Z';
const PATA_DEL = 'M26 -68 C25 -52, 29 -32, 28 -4 L39 -4 C40 -30, 43 -50, 46 -68 Z';

function pataLobo(silueta: string, piso: number, lejos: boolean): string {
  const adentro =
    forma(silueta, lejos ? T.sombra : T.ocre) +
    soplo(silueta, lejos ? T.negro : T.oscuro, 'm', lejos ? 0.75 : 0.45) +
    nube(piso, -46, 4, 14, lejos ? T.sombra : T.crema, 's', 0.8) +
    nube(piso, -6, 8, 4, T.negro, 's', 0.8);
  const garra = `M${piso - 9} -5 C${piso - 9} -9, ${piso + 9} -9, ${piso + 9} -5 L${piso + 10} 0 L${piso - 10} 0 Z`;
  return (
    `<g filter="url(#grano)">${enmascarado(`m-pata-lobo-${piso}-${lejos ? 1 : 0}`, silueta, adentro)}` +
    forma(garra, lejos ? T.negro : T.oscuro) +
    trazo(`M${piso - 7} -1 l-2 2 M${piso - 2} -1 l-1 2 M${piso + 3} -1 l0 2 M${piso + 7} -1 l1 2`, T.claro, 0.9, 0.7) +
    `</g>`
  );
}

const COLA_LOBO = 'M-58 -76 C-80 -84, -100 -72, -112 -46 L-116 -32 L-108 -38 L-110 -26 L-100 -36 L-98 -26 C-90 -44, -78 -54, -58 -62 Z';

function colaLobo(): string {
  const adentro =
    forma(COLA_LOBO, T.sombra) +
    nube(-84, -68, 14, 5, T.crema, 'm', 0.7, -30) +
    nube(-104, -36, 10, 12, T.negro, 'm', 0.8);
  return `<g filter="url(#grano)">${enmascarado('m-cola-lobo', COLA_LOBO, adentro)}</g>`;
}

/* ------------------------------------------------------------------
   El cordero
   ------------------------------------------------------------------ */

const C = {
  lana: 'var(--bestia-cordero-lana)',
  clara: 'var(--bestia-cordero-lana-clara)',
  honda: 'var(--bestia-cordero-lana-oscura)',
  mascara: 'var(--bestia-cordero-mascara)',
  mascaraClara: 'var(--bestia-cordero-mascara-clara)',
  ojo: 'var(--bestia-cordero-ojo)',
  pezunia: 'var(--bestia-cordero-pezunia)',
  negro: 'var(--fondo)',
  blanco: 'var(--bestia-ojo-blanco)',
  rojo: 'var(--bestia-lobo-boca)',
};

/**
 * Las escamas de lana, como en la tapa: gotas que caen en punta hacia atrás y abajo, pisadas
 * como tejas, cada una con su luz arriba. Se dibujan de abajo para arriba, así la de arriba
 * pisa a la de abajo, y entre una y otra queda la sombra honda de la lana.
 */
function escamas(x0: number, y0: number, x1: number, y1: number, paso: number, semilla: number): string {
  const filas: string[] = [];
  let fila = 0;
  for (let y = y0; y <= y1; y += paso * 0.62, fila++) {
    let s = '';
    for (let x = x0 + (fila % 2 ? paso / 2 : 0); x <= x1; x += paso * 0.92) {
      const j = ((((x * 7 + y * 13 + semilla) % 7) + 7) % 7) - 3;
      const p = paso;
      const gota = `M${x - p * 0.42} ${y - p * 0.18} Q${x - p * 0.05} ${y - p * 0.62} ${x + p * 0.44} ${y - p * 0.22} Q${x + p * 0.3} ${y + p * 0.32} ${x - p * 0.22 + j * 0.25} ${y + p * 0.7} Q${x - p * 0.48} ${y + p * 0.22} ${x - p * 0.42} ${y - p * 0.18} Z`;
      const luz = `M${x - p * 0.3} ${y - p * 0.2} Q${x} ${y - p * 0.5} ${x + p * 0.34} ${y - p * 0.22} Q${x + p * 0.1} ${y - p * 0.05} ${x - p * 0.3} ${y - p * 0.2} Z`;
      s += forma(gota, C.lana) + forma(luz, C.clara, 0.75) + `<path d="${gota}" fill="none" stroke="${C.negro}" stroke-width="${(p * 0.05).toFixed(2)}" opacity="0.35"/>`;
    }
    filas.push(s);
  }
  return filas.reverse().join('');
}

const TORSO_CORDERO = 'M-60 -64 C-70 -106, -14 -122, 26 -112 C58 -104, 74 -84, 66 -54 C60 -32, 24 -26, -10 -28 C-44 -30, -58 -40, -60 -64 Z';

function torsoCordero(): string {
  const adentro =
    forma(TORSO_CORDERO, C.honda) +
    escamas(-72, -124, 76, -24, 13, 1) +
    // El volumen: luz arriba a la izquierda, la panza y la grupa hundidas en sombra.
    nube(-20, -104, 46, 12, C.clara, 'l', 0.45) +
    nube(4, -34, 70, 14, C.negro, 'm', 0.75) +
    nube(-58, -60, 14, 30, C.negro, 'm', 0.6) +
    nube(60, -70, 14, 26, C.negro, 'm', 0.5);
  return `<g filter="url(#grano)">${enmascarado('m-torso-cordero', TORSO_CORDERO, adentro)}</g>`;
}

function pataCordero(x: number, lejos: boolean): string {
  const silueta = `M${x - 9} -48 C${x - 10} -34, ${x - 9} -20, ${x - 8} -12 L${x + 8} -12 C${x + 9} -22, ${x + 10} -36, ${x + 9} -48 Z`;
  const pezunia = `M${x - 11} -13 Q${x} -17 ${x + 12} -13 L${x + 13} -2 Q${x} 1 ${x - 12} -2 Z`;
  return (
    `<g filter="url(#grano)">` +
    enmascarado(`m-pata-cordero-${x}`, silueta, forma(silueta, C.honda) + escamas(x - 14, -52, x + 14, -14, 9, x) + nube(x, -14, 10, 5, C.negro, 's', 0.8) + (lejos ? forma(silueta, C.negro, 0.45) : '')) +
    enmascarado(`m-pezunia-${x}`, pezunia, forma(pezunia, lejos ? C.mascaraClara : C.pezunia) + nube(x, -2, 12, 3, C.mascara, 's', 0.8) + nube(x - 4, -12, 5, 2, C.blanco, 'xs', 0.6)) +
    // Las uñas: tres, casi dedos.
    [x - 7, x - 1, x + 5].map((u) => forma(`M${u} -6 h4 v-3 q-2 -1 -4 0 Z`, C.blanco, 0.9)).join('') +
    `</g>`
  );
}

const CARA_CORDERO = 'M40 -124 C40 -148, 86 -150, 88 -124 C92 -104, 82 -86, 64 -84 C46 -86, 36 -104, 40 -124 Z';
const MELENA = 'M30 -128 C26 -154, 50 -166, 66 -160 C84 -166, 104 -152, 98 -124 C100 -100, 86 -78, 64 -76 C42 -78, 28 -100, 30 -128 Z';

function cabezaCordero(): string {
  const cuernos =
    // El grande, que se curva hacia adelante, con anillos; el chico, atrás.
    enmascarado('m-cuerno-chico', 'M46 -146 C36 -166, 50 -180, 68 -176 C58 -170, 56 -160, 58 -146 Z',
      forma('M46 -146 C36 -166, 50 -180, 68 -176 C58 -170, 56 -160, 58 -146 Z', C.mascara) + nube(52, -168, 5, 8, C.mascaraClara, 's', 0.8)) +
    enmascarado('m-cuerno-grande', 'M74 -142 C88 -168, 120 -174, 136 -152 C120 -156, 104 -150, 90 -130 Z',
      forma('M74 -142 C88 -168, 120 -174, 136 -152 C120 -156, 104 -150, 90 -130 Z', C.mascaraClara) +
      [0, 1, 2, 3, 4].map((k) => nube(88 + k * 9, -152 - k * 2.5, 1.6, 8, C.mascara, 'xs', 0.9, 30)).join('') +
      nube(110, -164, 14, 3, C.blanco, 's', 0.35) + nube(100, -140, 18, 6, C.negro, 's', 0.7));
  const melena = enmascarado('m-melena', MELENA, forma(MELENA, C.honda) + escamas(22, -168, 106, -76, 11, 5) + nube(64, -80, 30, 8, C.negro, 'm', 0.7));
  const cara =
    forma(CARA_CORDERO, C.mascara) +
    // La frente más clara, y la sombra que la máscara le hace a los ojos.
    nube(64, -138, 18, 7, C.mascaraClara, 'm', 0.95) +
    nube(64, -124, 24, 4, C.negro, 's', 0.6) +
    soplo('M42 -128 Q54 -134 64 -127 Q74 -134 86 -128 L86 -124 Q74 -129 64 -123 Q54 -129 42 -124 Z', C.negro, 's', 0.9) +
    nube(64, -114, 4, 8, C.mascaraClara, 's', 0.6) +
    nube(46, -112, 5, 14, C.mascaraClara, 'm', 0.5) +
    nube(84, -110, 5, 14, C.negro, 'm', 0.6);
  const ojo = (x: number, n: number): string =>
    enmascarado(`m-ojo-cordero-${n}`, `M${x - 9} -121 Q${x} -129 ${x + 9} -121 Q${x} -115 ${x - 9} -121 Z`,
      forma(`M${x - 9} -121 Q${x} -129 ${x + 9} -121 Q${x} -115 ${x - 9} -121 Z`, C.blanco) +
      nube(x - 8, -121, 2.5, 3, C.rojo, 'xs', 0.7) + nube(x, -127, 9, 3, C.mascara, 's', 0.9)) +
    // El párpado pesado, siempre a media asta.
    forma(`M${x - 10} -121.5 Q${x} -131 ${x + 10} -121.5 Q${x} -125 ${x - 10} -121.5 Z`, C.mascaraClara);
  const hocico = enmascarado('m-trompa', 'M50 -110 C50 -118, 78 -118, 78 -110 C80 -98, 72 -91, 64 -91 C56 -91, 48 -98, 50 -110 Z',
      forma('M50 -110 C50 -118, 78 -118, 78 -110 C80 -98, 72 -91, 64 -91 C56 -91, 48 -98, 50 -110 Z', C.mascara) +
      nube(64, -114, 12, 4, C.mascaraClara, 's', 0.8) + nube(64, -96, 14, 6, C.negro, 's', 0.9)) +
    `<ellipse cx="58.5" cy="-108" rx="3" ry="2" fill="${C.negro}"/><ellipse cx="69.5" cy="-108" rx="3" ry="2" fill="${C.negro}"/>` +
    trazo('M56 -98 Q64 -95 72 -98', C.negro, 1.2, 0.9);
  return `<g filter="url(#grano)">${cuernos}${melena}${enmascarado('m-cara-cordero', CARA_CORDERO, cara)}${ojo(54, 1)}${ojo(74, 2)}${hocico}</g>`;
}

/** El hocico solo, que la isla estira cuando mastica o bala. */
function hocicoCordero(): string {
  return `<g filter="url(#grano)">${enmascarado('m-trompa', 'M50 -110 C50 -118, 78 -118, 78 -110 C80 -98, 72 -91, 64 -91 C56 -91, 48 -98, 50 -110 Z',
      forma('M50 -110 C50 -118, 78 -118, 78 -110 C80 -98, 72 -91, 64 -91 C56 -91, 48 -98, 50 -110 Z', C.mascara) +
      nube(64, -114, 12, 4, C.mascaraClara, 's', 0.8) + nube(64, -96, 14, 6, C.negro, 's', 0.9)) +
    `<ellipse cx="58.5" cy="-108" rx="3" ry="2" fill="${C.negro}"/><ellipse cx="69.5" cy="-108" rx="3" ry="2" fill="${C.negro}"/>` +
    trazo('M56 -98 Q64 -95 72 -98', C.negro, 1.2, 0.9)}</g>`;
}

function irisCordero(x: number): string {
  return `<g filter="url(#grano)"><circle cx="${x}" cy="-121.5" r="3.6" fill="${C.ojo}"/>${nube(x, -123, 3.2, 1.6, C.honda, 'xs', 0.6)}<circle cx="${x}" cy="-121.5" r="1.7" fill="${C.negro}"/>${nube(x + 1, -122.8, 0.8, 0.7, 'var(--papel)', 'xs')}</g>`;
}

function colaCordero(): string {
  const d = 'M-56 -80 C-72 -92, -84 -78, -78 -64 C-72 -68, -62 -66, -54 -62 Z';
  return `<g filter="url(#grano)">${enmascarado('m-cola-cordero', d, forma(d, C.honda) + escamas(-90, -96, -50, -60, 9, 3))}</g>`;
}

/* ------------------------------------------------------------------
   La escena: el monte de noche y la pastura que brilla
   ------------------------------------------------------------------ */

export const ESCENA_ARTE = { ancho: 900, alto: 640 } as const;
export const PALO_ARTE = { x: 450, y: 418 } as const;
export const PASTURA_ARTE = { rx: 262, ry: 138 } as const;

const M = {
  claro: 'var(--entorno-monte-claro)',
  medio: 'var(--entorno-monte-medio)',
  hondo: 'var(--entorno-monte-hondo)',
  sombra: 'var(--bestia-lobo-sombra)',
  oscuro: 'var(--bestia-lobo-oscuro)',
  negro: 'var(--fondo)',
  naranja: 'var(--entorno-pastura)',
  naranjaHonda: 'var(--entorno-pastura-honda)',
  azul: 'var(--bestia-cordero-lana-clara)',
  azulHondo: 'var(--bestia-cordero-lana)',
};

function azar(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Una tira de papel rasgado, como las de la contratapa de *Lobo suelto*: sube del piso, se
 * inclina, termina en punta, y el canto derecho baja en dientes de sierra. De noche: el cuerpo
 * oscuro, el canto de los dientes encendido por la luz, y la sombra soplada contra el otro canto.
 */
function tira(x: number, arriba: number, abajo: number, ancho: number, cuerpo: string, luz: string, rnd: () => number, id: string): string {
  const inclinacion = (rnd() - 0.4) * 30;
  const punta = { x: x + ancho * 0.45 + inclinacion, y: arriba };
  const alto = abajo - arriba;
  const paso = 11 + rnd() * 7;
  const dientes: string[] = [];
  const canto: string[] = [];
  for (let y = arriba + paso; y < abajo - 4; y += paso) {
    const t = (y - arriba) / alto;
    const borde = punta.x + (x + ancho - punta.x) * Math.min(1, t * 1.5);
    const afuera = borde + 9 + rnd() * 5;
    dientes.push(`L${afuera.toFixed(1)} ${(y - paso * 0.15).toFixed(1)} L${borde.toFixed(1)} ${(y + paso * 0.35).toFixed(1)}`);
    canto.push(`M${borde.toFixed(1)} ${(y - paso * 0.5).toFixed(1)} L${afuera.toFixed(1)} ${(y - paso * 0.15).toFixed(1)} L${(borde - 3).toFixed(1)} ${(y + paso * 0.2).toFixed(1)} Z`);
  }
  const izquierda = `Q${(x + inclinacion * 0.3 - 4).toFixed(1)} ${(arriba + alto * 0.45).toFixed(1)} ${punta.x.toFixed(1)} ${punta.y.toFixed(1)}`;
  const d = `M${x.toFixed(1)} ${abajo} ${izquierda} ${dientes.join(' ')} L${(x + ancho).toFixed(1)} ${abajo} Z`;
  return enmascarado(id, d,
    forma(d, cuerpo) +
    canto.map((c) => soplo(c, luz, 's', 0.85)).join('') +
    soplo(`M${(x - 10).toFixed(1)} ${abajo} ${izquierda} L${(punta.x + 4).toFixed(1)} ${(punta.y + alto * 0.3).toFixed(1)} L${(x + ancho * 0.35).toFixed(1)} ${abajo} Z`, M.negro, 'm', 0.7) +
    nube(punta.x, abajo, ancho, alto * 0.25, M.negro, 'l', 0.8));
}

function filaDeTiras(arriba: number, abajo: number, cuerpo: string, luz: string, semilla: number, prefijo: string, desde = -20, hasta = ESCENA_ARTE.ancho + 20): string {
  const rnd = azar(semilla);
  let s = '';
  let x = desde;
  let n = 0;
  while (x < hasta) {
    const ancho = 34 + rnd() * 40;
    s += tira(x, arriba + rnd() * 70, abajo, ancho, cuerpo, luz, rnd, `${prefijo}-${n++}`);
    x += ancho * (0.5 + rnd() * 0.25);
  }
  return s;
}

/** Los trazos de crayón y los espirales de la contratapa del disco 2, sobre la pastura. */
function crayon(): string {
  const rnd = azar(23);
  let s = '';
  for (let i = 0; i < 150; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd());
    const x = PALO_ARTE.x + Math.cos(a) * d * (PASTURA_ARTE.rx - 16);
    const y = PALO_ARTE.y + Math.sin(a) * d * (PASTURA_ARTE.ry - 10);
    if (Math.hypot(x - PALO_ARTE.x, (y - PALO_ARTE.y) / 0.55) < 96) continue;
    const largo = 7 + rnd() * 10;
    const color = rnd() < 0.6 ? M.azulHondo : M.oscuro;
    s += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} l${(-3 + rnd() * 6).toFixed(1)} ${(-largo).toFixed(1)} M${(x + 3).toFixed(1)} ${y.toFixed(1)} l${(1 + rnd() * 4).toFixed(1)} ${(-largo * 0.7).toFixed(1)}`, color, 1.4, 0.75);
  }
  // Los espirales de la contratapa del disco 2: pocos, grandes, de trazo grueso.
  const espiral = (cx: number, cy: number, r: number): string => {
    let d = '';
    for (let k = 0; k <= 60; k++) {
      const a = (k / 60) * Math.PI * 5;
      const rr = (r * k) / 60;
      d += `${k ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr * 0.55).toFixed(1)} `;
    }
    return trazo(d, M.azulHondo, 3, 0.85);
  };
  s += espiral(250, 386, 34) + espiral(668, 452, 28) + espiral(560, 330, 18);
  return s;
}

function fondoMonte(): string {
  const { ancho, alto } = ESCENA_ARTE;
  const { x: px, y: py } = PALO_ARTE;
  const { rx, ry } = PASTURA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${M.negro}"/>` +
    // Un resplandor bajo detrás del monte: la noche no es negra pareja.
    nube(ancho * 0.38, 150, 380, 90, M.sombra, 'xl', 0.55) +
    nube(ancho * 0.7, 120, 200, 60, M.hondo, 'xl', 0.5) +
    filaDeTiras(-40, 300, M.oscuro, M.sombra, 3, 'fila-a') +
    filaDeTiras(30, 320, M.hondo, M.medio, 9, 'fila-b') +
    filaDeTiras(110, 335, M.sombra, M.claro, 17, 'fila-c') +
    // El piso del monte, en sombra.
    soplo(`M-40 290 L${ancho + 40} 290 L${ancho + 40} ${alto + 40} L-40 ${alto + 40} Z`, M.oscuro, 'l') +
    nube(px, py + 10, rx + 120, ry + 70, M.negro, 'xl', 0.4) +
    // La pastura: el naranja de la tapa, que brilla en el medio y se apaga en la orilla.
    `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}" fill="${M.naranjaHonda}" filter="url(#soplo-s)"/>` +
    nube(px, py - 6, rx * 0.86, ry * 0.8, M.naranja, 'l') +
    nube(px - 40, py - 20, rx * 0.5, ry * 0.4, 'var(--bestia-cordero-pezunia)', 'xl', 0.55) +
    // La orilla que se hunde en lo oscuro.
    `<ellipse cx="${px}" cy="${py}" rx="${rx + 18}" ry="${ry + 14}" fill="none" stroke="${M.negro}" stroke-width="44" filter="url(#soplo-l)" opacity="0.9"/>` +
    crayon() +
    // El círculo pelado que deja la soga: tierra más honda, pisada.
    nube(px, py + 4, 92, 50, M.naranjaHonda, 'm', 0.95) +
    nube(px, py + 8, 70, 34, M.oscuro, 'l', 0.35) +
    // El palo: madera, con la luz del lado izquierdo.
    nube(px + 4, py + 2, 14, 4, M.negro, 's', 0.8) +
    enmascarado('m-palo', `M${px - 4.5} ${py} L${px - 4} ${py - 50} L${px + 4} ${py - 53} L${px + 4.5} ${py} Z`,
      forma(`M${px - 4.5} ${py} L${px - 4} ${py - 50} L${px + 4} ${py - 53} L${px + 4.5} ${py} Z`, M.sombra) +
      nube(px - 3, py - 26, 2, 24, M.claro, 's', 0.7) + nube(px + 4, py - 26, 2.5, 26, M.negro, 's', 0.9)) +
    `</g>`
  );
}

/** Lo de adelante: tiras que tapan al lobo cuando pasa por abajo, y los costados. */
function frenteMonte(): string {
  const { ancho, alto } = ESCENA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    filaDeTiras(520, alto + 10, M.hondo, M.medio, 31, 'frente-a') +
    filaDeTiras(570, alto + 10, M.oscuro, M.sombra, 37, 'frente-b') +
    filaDeTiras(150, alto + 10, M.oscuro, M.sombra, 41, 'costado-izq', -40, 70) +
    filaDeTiras(170, alto + 10, M.oscuro, M.sombra, 43, 'costado-der', ancho - 70, ancho + 40) +
    `</g>`
  );
}

export const PIEZAS: readonly Pieza[] = [
  { nombre: 'monte-fondo', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: fondoMonte(), opaca: true, densidad: 2 },
  { nombre: 'monte-frente', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: frenteMonte(), densidad: 2 },
  { nombre: 'lobo-cabeza', caja: [20, -220, 100, 140], dibujo: cabezaLobo(), densidad: 3 },
  { nombre: 'lobo-torso', caja: [-76, -116, 162, 80], dibujo: torsoLobo(), densidad: 3 },
  { nombre: 'lobo-cola', caja: [-120, -90, 66, 68], dibujo: colaLobo(), densidad: 3 },
  { nombre: 'lobo-pata-tras', caja: [-64, -70, 34, 72], dibujo: pataLobo(PATA_TRAS, -49, false), densidad: 3 },
  { nombre: 'lobo-pata-tras-lejos', caja: [-64, -70, 34, 72], dibujo: pataLobo(PATA_TRAS, -49, true), densidad: 3 },
  { nombre: 'lobo-pata-del', caja: [14, -72, 38, 74], dibujo: pataLobo(PATA_DEL, 33, false), densidad: 3 },
  { nombre: 'lobo-pata-del-lejos', caja: [14, -72, 38, 74], dibujo: pataLobo(PATA_DEL, 33, true), densidad: 3 },
  { nombre: 'cordero-torso', caja: [-74, -126, 152, 102], dibujo: torsoCordero(), densidad: 3 },
  { nombre: 'cordero-cabeza', caja: [20, -182, 120, 108], dibujo: cabezaCordero(), densidad: 3 },
  { nombre: 'cordero-hocico', caja: [44, -120, 40, 34], dibujo: hocicoCordero(), densidad: 3 },
  { nombre: 'cordero-iris-1', caja: [49, -126, 10, 10], dibujo: irisCordero(54), densidad: 6 },
  { nombre: 'cordero-iris-2', caja: [69, -126, 10, 10], dibujo: irisCordero(74), densidad: 6 },
  { nombre: 'cordero-cola', caja: [-92, -98, 42, 40], dibujo: colaCordero(), densidad: 3 },
  { nombre: 'cordero-pata', caja: [-16, -56, 32, 58], dibujo: pataCordero(0, false), densidad: 3 },
  { nombre: 'cordero-pata-lejos', caja: [-16, -56, 32, 58], dibujo: pataCordero(0, true), densidad: 3 },
  { nombre: 'lobo-boca', caja: [50, -108, 40, 28], dibujo: bocaLobo(), densidad: 3 },
  { nombre: 'lobo-iris-1', caja: [48, -147, 14, 14], dibujo: irisLobo(55, -140, 6.2, T.ocre), densidad: 5 },
  { nombre: 'lobo-iris-2', caja: [83, -145, 10, 10], dibujo: irisLobo(88.5, -140.5, 3, T.sombra), densidad: 5 },
];
