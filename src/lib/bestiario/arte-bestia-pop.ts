/**
 * La bestia pop (`D-73`, decimoquinta vuelta), en el tablado del galpón de Patricio Rey.
 *
 * *"Vamos a brillar, mi amor"*. No está en ninguna tapa: se inventa en la de su disco (`T-440`),
 * que es *Gulp!* (1985, pista 2). Así que el cuerpo es **pincel seco y fotocopia** (`pincel.ts`),
 * como el gordo Pierre: papel crema casi todo tapado de negro, y del lado de la luz el pincel se
 * seca y deja ver el papel, teñido del rojo del reflector del galpón. Las lentejuelas son el rojo
 * de las letras de *Gulp!* corrido sobre el amarillo, y las botas de plataforma también.
 *
 * **La cara no es una sola, y no es suya.** Donde iría la cara hay un hueco negro, y ahí se imprime
 * la de alguien de la gente, en la trama roja de *En directo*, que es como está impresa la gente del
 * galpón. Tiene cuatro, y la isla se las cambia. Lo contó el Indio sobre la canción: la gente le
 * cuelga al artista sus propias necesidades e ilusiones (`RES-21`). Al lado, la silla vacía de
 * Patricio Rey no tiene ninguna: a ese nadie le vio la cara.
 *
 * **Brilla con luz prestada**: las lentejuelas solo se prenden donde les pega el reflector, y la
 * página les agrega los destellos (`bt-bestia-pop-chispa`), que la isla hace saltar.
 *
 * Es un títere de papel de doce piezas, en coordenadas de títere (`rig-bestia-pop.ts`): el (0, 0)
 * es el tablado entre los pies. Los colores se nombran por token: acá no vive ni un hex.
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar, mancha, pincelada, tinta, type P } from './pincel.ts';
import { POP, POP_ARMADO as A, rotar } from './rig-bestia-pop.ts';
import type { Personaje } from './elenco.ts';

const ID = 'la-bestia-pop';

const T = {
  papel: 'var(--disco-gulp-apoyo)',
  negro: 'var(--fondo)',
  rojo: 'var(--disco-gulp-tinta)',
  amarillo: 'var(--bestia-pierre-amarillo)',
  reflector: 'var(--entorno-galpon-rojo)',
  brasa: 'var(--entorno-galpon-brasa)',
  noche: 'var(--entorno-galpon-noche)',
  seguidor: 'var(--entorno-galpon-luz)',
  piel: 'var(--bestia-pop-piel)',
  destello: 'var(--bestia-pop-reflector)',
  oro: 'var(--acento-2)',
};

/** De dónde viene la luz: el reflector rojo, arriba a la derecha. */
const LUZ: P = [0.6, -0.8];

type Caja = readonly [number, number, number, number];

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

/** La caja de unos puntos, con aire. */
function cajaDe(pts: readonly P[], aire = 6): Caja {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.floor(Math.min(...xs) - aire);
  const y0 = Math.floor(Math.min(...ys) - aire);
  return [x0, y0, Math.ceil(Math.max(...xs) + aire) - x0, Math.ceil(Math.max(...ys) + aire) - y0];
}

/** Cuánta luz del reflector le toca a un punto de una forma redonda: de 0 (de espaldas) a 1. */
function luzEn([x, y]: P, [cx, cy]: P, [rx, ry]: P): number {
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  const m = Math.hypot(LUZ[0], LUZ[1]);
  const d = (nx * LUZ[0] + ny * LUZ[1]) / m;
  return Math.max(0, Math.min(1, 0.42 + d * 0.7));
}

/* ------------------------------------------------------------------
   La manera: negro a pincel seco que se seca contra la luz
   ------------------------------------------------------------------ */

interface Volumen {
  /** El centro y los radios de la forma redonda que le da la luz. */
  c: P;
  r: P;
  /** Cuánto se come la sombra: más es un filo de luz más fino. */
  hondo?: number;
  /** El ángulo de las pasadas del pincel. */
  angulo: number;
  ancho: number;
  semilla: number;
}

/**
 * Lo pintado de una pieza: el papel teñido (rojo del lado del reflector, la noche del otro), el negro
 * cargado del lado de la sombra, y del lado de la luz el mismo negro pero seco, que deja ver el papel
 * en rayas, como la tapa de *Gulp!*.
 */
function negroConLuz(id: string, d: string, caja: Caja, v: Volumen): string {
  const [cx, cy] = v.c;
  const [rx, ry] = v.r;
  const hondo = v.hondo ?? 0.55;
  const m = Math.hypot(LUZ[0], LUZ[1]);
  const [ox, oy] = [(-LUZ[0] / m) * rx * hondo, (-LUZ[1] / m) * ry * hondo];
  const [x, y, w, h] = caja;
  const zona = `maskUnits="userSpaceOnUse" x="${x - 20}" y="${y - 20}" width="${w + 40}" height="${h + 40}"`;
  const sombra = `<ellipse cx="${f(cx + ox)}" cy="${f(cy + oy)}" rx="${f(rx * 1.04)}" ry="${f(ry * 1.04)}" filter="url(#soplo-s)"`;
  return (
    `<mask id="${id}-s" ${zona}><rect x="${x - 20}" y="${y - 20}" width="${w + 40}" height="${h + 40}" fill="black"/>${sombra} fill="white"/></mask>` +
    `<mask id="${id}-l" ${zona}><rect x="${x - 20}" y="${y - 20}" width="${w + 40}" height="${h + 40}" fill="white"/>${sombra} fill="black"/></mask>` +
    // El papel teñido: la luz roja se lo come del lado del reflector, la noche del otro.
    enmascarado(`${id}-t`, d,
      forma(d, T.brasa, 0.85) +
        nube(cx + (LUZ[0] / m) * rx * 0.7, cy + (LUZ[1] / m) * ry * 0.7, rx * 0.9, ry * 0.9, T.reflector, 'l', 0.95) +
        nube(cx - (LUZ[0] / m) * rx * 0.6, cy - (LUZ[1] / m) * ry * 0.6, rx * 0.7, ry * 0.7, T.noche, 'l', 0.6)) +
    `<g mask="url(#${id}-s)">${tinta(mancha(`${id}-n`, d, caja, { ancho: v.ancho, seco: 0.26, angulo: v.angulo, curva: 0.08, grano: 16, apoyo: [0.75, 0.8] }, v.semilla))}</g>` +
    `<g mask="url(#${id}-l)">${tinta(mancha(`${id}-c`, d, caja, { ancho: v.ancho * 0.85, seco: 0.44, angulo: v.angulo + 10, curva: 0.12, grano: 13, apoyo: [0.7, 0.75] }, v.semilla + 7))}</g>`
  );
}

/**
 * El papel recortado a tijera, con su canto. Adentro va lo pintado. El canto no es la crema del papel
 * sino el papel en la luz roja del galpón: una crema ahí sería un contorno de dibujito alrededor de
 * un bicho negro.
 */
function recorte(id: string, pts: readonly P[], adentro: string): string {
  return enmascarado(id, poli(pts), forma(poli(pts), T.papel) + adentro) + trazo(poli(pts), T.brasa, 1.2, 0.9);
}

/**
 * Las lentejuelas: toques cortos de pincel, sueltos, que solo se ven donde las agarra el reflector.
 * Son el rojo de las letras de *Gulp!* corrido sobre el amarillo; las de más luz se queman al rosado
 * del reflector. Del lado de la sombra no hay: el saco es negro y nada más. No son una trama: la
 * única trama de la bestia es la cara, que es de la gente.
 */
function lentejuelas(id: string, d: string, caja: Caja, v: { c: P; r: P; angulo: number }, cuantas: number, semilla: number, quitar?: (p: P) => boolean): string {
  const rnd = azar(semilla);
  const [x0, y0, w, h] = caja;
  const a = ((v.angulo + 90) * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const corridas: P[][] = [];
  const quemadas: P[][] = [];
  let puntos = '';
  for (let i = 0, puestas = 0; i < cuantas * 12 && puestas < cuantas; i++) {
    const p: P = [x0 + rnd() * w, y0 + rnd() * h];
    if (quitar?.(p)) continue;
    const l = luzEn(p, v.c, v.r);
    // Más cuanto más luz, y ninguna en lo hondo.
    if (l < 0.3 || rnd() > (l - 0.3) / 0.6) continue;
    puestas++;
    const largo = 2.6 + rnd() * 2.6;
    const giro = (rnd() - 0.5) * 0.8;
    const [dx, dy] = [ux * Math.cos(giro) - uy * Math.sin(giro), ux * Math.sin(giro) + uy * Math.cos(giro)];
    const toque: P[] = [[p[0] - dx * largo * 0.5, p[1] - dy * largo * 0.5], [p[0] + dx * largo * 0.5, p[1] + dy * largo * 0.5]];
    if (l > 0.85 && rnd() < 0.6) quemadas.push(toque);
    else corridas.push(toque);
    if (rnd() < 0.18) puntos += `<circle cx="${f(p[0] + dx * 2)}" cy="${f(p[1] + dy * 2)}" r="${f(0.7 + rnd() * 0.6)}"/>`;
  }
  const pasadas = (lista: P[][], color: string, s: number, ancho: number): string =>
    lista.map((r, i) => pincelada(r, { ancho, seco: 0.15, grano: 6, tinta: color, apoyo: [0.8, 0.6] }, s + i)).join('');
  return (
    `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">` +
    `<g transform="translate(1.3 1.1)">${tinta(pasadas(corridas, T.amarillo, semilla, 3), false)}</g>` +
    tinta(pasadas(corridas, T.rojo, semilla + 500, 2.8), false) +
    tinta(pasadas(quemadas, T.destello, semilla + 900, 2.6), false) +
    `<g fill="${T.destello}">${puntos}</g>` +
    `</g>`
  );
}

/** Pinceladas de color corridas, como las letras de *Gulp!*: el amarillo asoma debajo del rojo. */
function corridas(recorridos: ReadonlyArray<readonly P[]>, ancho: number, semilla: number, seco = 0.3): string {
  const pasadas = (color: string, s: number): string =>
    recorridos.map((r, i) => pincelada(r, { ancho, seco, grano: 9, tinta: color, apoyo: [0.6, 0.7] }, s + i)).join('');
  return `<g transform="translate(2.2 1.9)">${tinta(pasadas(T.amarillo, semilla))}</g>${tinta(pasadas(T.rojo, semilla + 50))}`;
}

/** El filo que mira al reflector: una pasada de luz roja soplada, adentro del recorte. */
const filo = (d: string, o = 0.55): string => soplo(d, T.reflector, 's', o) + soplo(d, T.destello, 'xs', o * 0.45);

/* ------------------------------------------------------------------
   El cuerpo: el saco de lentejuelas, el cuello alto y el pecho con el disquito
   ------------------------------------------------------------------ */

/**
 * El cuello parado: un abanico de lentejuelas detrás de la cabeza, de hombro a hombro, como el de
 * las capas de los cantantes de los setenta. Es el marco de la cara, y lo primero que se prende.
 */
const CUELLO = { c: [6, -160] as P, r: [66, 54] as P, adentro: [44, 38] as P, desde: 196, hasta: 344 };

/** Un arco de elipse, de `desde` a `hasta` grados, cortado a tijera en tramos. */
function arco([cx, cy]: P, [rx, ry]: P, desde: number, hasta: number, tramos: number): P[] {
  return Array.from({ length: tramos + 1 }, (_, i) => {
    const a = ((desde + ((hasta - desde) * i) / tramos) * Math.PI) / 180;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as P;
  });
}

/** El recorte del cuerpo: los hombros de gorila, el abanico del cuello arriba, y abajo el faldón. */
const CUERPO: readonly P[] = [
  [-46, -45], [-58, -60], [-68, -84], [-76, -110], [-79, -134], [-72, -156],
  ...arco(CUELLO.c, CUELLO.r, CUELLO.desde, CUELLO.hasta, 12),
  [80, -152], [85, -130], [81, -104], [73, -80], [63, -60], [52, -45], [30, -42], [8, -47], [-16, -45], [-34, -41],
];

/** El escote: el saco abierto en V hasta el botón, con el pecho peludo adentro. */
const ESCOTE: readonly P[] = [[-20, -158], [-12, -136], [-4, -112], [2, -94], [8, -112], [18, -136], [30, -156]];
/** El forro del abanico: lo que queda entre el canto de lentejuelas y la nuca. */
const FORRO: readonly P[] = [...arco(CUELLO.c, [CUELLO.r[0] - 8, CUELLO.r[1] - 7], CUELLO.desde + 4, CUELLO.hasta - 4, 12), ...arco(CUELLO.c, CUELLO.adentro, CUELLO.hasta, CUELLO.desde, 10)];

/** Si un punto cae adentro de un polígono. */
function adentro([x, y]: P, pts: readonly P[]): boolean {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

function cuerpo(): string {
  const d = poli(CUERPO);
  const caja = cajaDe(CUERPO, 2);
  // Las pasadas cruzan en diagonal, como los brochazos de la tapa de *Gulp!*.
  const vol: Volumen = { c: [4, -120], r: [84, 76], angulo: 62, ancho: 15, semilla: 1201 };
  // El forro del abanico: rojo corrido sobre amarillo, en pasadas que salen de la nuca como rayos, y lo
  // hondo pegado a la cabeza, que le tira sombra.
  const [cx, cy] = CUELLO.c;
  const rayos: P[][] = [];
  for (let i = 0; i <= 22; i++) {
    const a = ((CUELLO.desde + ((CUELLO.hasta - CUELLO.desde) * i) / 22) * Math.PI) / 180;
    const [ux, uy] = [Math.cos(a), Math.sin(a)];
    const r0 = CUELLO.adentro[0] - 6;
    const r1 = CUELLO.r[0] - 4;
    rayos.push([0, 0.33, 0.66, 1].map((t) => {
      const r = r0 + (r1 - r0) * t;
      return [cx + ux * r, cy + uy * r * (CUELLO.r[1] / CUELLO.r[0])] as P;
    }));
  }
  const forro =
    `<clipPath id="bp-forro"><path d="${poli(FORRO)}"/></clipPath><g clip-path="url(#bp-forro)">` +
    forma(poli(FORRO), T.amarillo) +
    corridas(rayos, 6.4, 1290, 0.16) +
    // La sombra de la cabeza sobre el forro, y la noche del lado de la izquierda.
    nube(cx + 4, cy + 4, CUELLO.adentro[0] + 6, CUELLO.adentro[1] + 6, T.negro, 'm', 0.9) +
    nube(cx - 56, cy, 26, 40, T.noche, 'l', 0.7) +
    `</g>`;
  // El pecho: pelo a pinceladas que bajan, sobre el papel teñido, y lo hondo debajo de la cabeza.
  const pecho =
    `<clipPath id="bp-escote"><path d="${poli(ESCOTE)}"/></clipPath><g clip-path="url(#bp-escote)">` +
    forma(poli(ESCOTE), T.brasa) +
    nube(16, -128, 16, 26, T.reflector, 'm', 0.7) +
    tinta(
      Array.from({ length: 14 }, (_, i) => {
        const x = -14 + i * 3.2;
        return pincelada([[x, -160], [x + 2, -142], [x - 1, -124], [x + 3, -100]], { ancho: 4.4, seco: 0.5, grano: 7, apoyo: [0.7, 0.3] }, 1250 + i);
      }).join(''),
    ) +
    nube(4, -158, 22, 14, T.negro, 'm', 0.9) +
    `</g>`;
  // El disquito colgado: el disco del fondo del galpón, en chiquito, que agarra la luz.
  const [mx, my] = [6, -114];
  let surcos = '';
  for (let r = 2.4; r < 6.6; r += 1.1) surcos += `<circle cx="${mx}" cy="${my}" r="${f(r)}" fill="none" stroke="${T.brasa}" stroke-width="0.4"/>`;
  const disquito =
    trazo(`M-12 -152 Q-4 -126 ${mx} ${my - 7} Q16 -126 22 -152`, T.oro, 0.9, 0.85) +
    forma(elipse(mx, my, 7, 7), T.negro) +
    surcos +
    forma(elipse(mx, my, 2.4, 2.4), T.rojo) +
    soplo(`M${mx} ${my} L${mx + 8} ${my - 6} L${mx + 7} ${my + 1} Z`, T.destello, 'xs', 0.8);
  // Las solapas: el filo de la V, con el vivo rojo corrido de las letras.
  const solapas = corridas(
    [
      [[-22, -158], [-14, -138], [-6, -116], [1, -96]],
      [[32, -156], [22, -136], [12, -116], [3, -96]],
    ],
    3,
    1260,
    0.12,
  );
  // Las costuras y los pliegues del saco, del lado de la luz: rayas negras finas.
  const pliegues = tinta(
    pincelada([[56, -150], [62, -120], [64, -96], [62, -70]], { ancho: 3, seco: 0.2, grano: 14 }, 1270) +
      pincelada([[-58, -140], [-64, -112], [-64, -86], [-58, -60]], { ancho: 3, seco: 0.2, grano: 14 }, 1271) +
      pincelada([[-40, -60], [-12, -64], [20, -64], [52, -58]], { ancho: 4, seco: 0.3, grano: 12 }, 1272),
  );
  const boton = forma(elipse(2, -86, 3.4, 3.4), T.oro) + forma(elipse(1.2, -86.8, 1.4, 1.4), T.destello);
  const quitar = (p: P): boolean => adentro(p, ESCOTE) || adentro(p, FORRO);
  // El canto del abanico: una fila de lentejuelas más gordas, que agarran el reflector de punta a punta.
  const canto = lentejuelas('bp-canto', poli(CUERPO), [CUELLO.c[0] - CUELLO.r[0], CUELLO.c[1] - CUELLO.r[1], CUELLO.r[0] * 2, CUELLO.r[1]], { c: CUELLO.c, r: CUELLO.r, angulo: 0 }, 70, 1295, (p) => adentro(p, FORRO));
  return recorte(
    'bp-papel',
    CUERPO,
    negroConLuz('bp-c', d, caja, vol) +
      lentejuelas('bp-lent', d, caja, vol, 170, 1281, quitar) +
      filo(`M66 -170 L80 -152 L85 -130 L81 -104 L73 -80 L65 -60 L71 -60 L80 -82 L88 -106 L90 -132 L84 -156 L70 -176 Z`) +
      forro +
      canto +
      pecho +
      solapas +
      pliegues +
      disquito +
      boton +
      // Abajo y a la izquierda, lo que no ve el reflector se hunde en la noche del galpón.
      nube(-60, -60, 40, 50, T.negro, 'l', 0.6),
  );
}

/* ------------------------------------------------------------------
   La cabeza: la melena parada y el hueco de la cara
   ------------------------------------------------------------------ */

/**
 * La melena: mechones que salen de alrededor de la cara, de largo y ancho desparejos, más largos
 * arriba y del lado del reflector, como las pasadas de la tapa. Abajo, la quijada metida en el cuello.
 */
const CABEZA: readonly P[] = (() => {
  const rnd = azar(1407);
  const pts: P[] = [];
  const [cx, cy] = [8, -162];
  const n = 60;
  let mechon = 0;
  let largo = 0;
  let tuerce = 0;
  for (let i = 0; i < n; i++) {
    const a = Math.PI / 2 + (i / n) * Math.PI * 2;
    const arriba = Math.max(0, -Math.sin(a) + 0.25) / 1.25;
    if (mechon <= 0) {
      mechon = 3 + Math.floor(rnd() * 3);
      largo = arriba * (3 + rnd() * 7) * (Math.cos(a) > 0.2 ? 1.2 : 1);
      tuerce = (rnd() - 0.5) * 0.25;
    }
    // Cada mechón sube a una punta y baja: un triángulo torcido.
    const fase = mechon / 4;
    const sale = largo * Math.max(0, 1 - Math.abs(fase - 0.5) * 2.2);
    mechon--;
    const r = (Math.sin(a) > 0.3 ? 29 : 32) + sale;
    pts.push([cx + Math.cos(a + tuerce * (sale / 20)) * r, cy + Math.sin(a + tuerce * (sale / 20)) * r * 1.02]);
  }
  return pts;
})();

const { centro: CARA, radio: RCARA } = A.cara;

function cabeza(): string {
  const d = poli(CABEZA);
  const caja = cajaDe(CABEZA, 2);
  const [cx, cy] = CARA;
  const [rx, ry] = RCARA;
  // Las pasadas de la melena: salen de alrededor de la cara para afuera, largas y secas en la punta.
  let melena = '';
  for (let i = 0; i < 26; i++) {
    const a = Math.PI * 0.62 + (i / 26) * Math.PI * 1.76;
    const [ux, uy] = [Math.cos(a), Math.sin(a)];
    const r0 = 0.9;
    const largo = 26 + (i % 3) * 6;
    melena += pincelada(
      [
        [cx + ux * rx * r0, cy + uy * ry * r0],
        [cx + ux * (rx + largo * 0.35), cy + uy * (ry + largo * 0.35) - 2],
        [cx + ux * (rx + largo * 0.7) + uy * 3, cy + uy * (ry + largo * 0.7) - ux * 3],
        [cx + ux * (rx + largo) + uy * 6, cy + uy * (ry + largo) - ux * 5],
      ],
      { ancho: 9, seco: 0.32, grano: 10, apoyo: [0.9, 0.35] },
      1410 + i,
    );
  }
  const vol: Volumen = { c: [10, -166], r: [40, 40], angulo: 60, ancho: 11, semilla: 1450, hondo: 0.26 };
  return recorte(
    'bpc-papel',
    CABEZA,
    negroConLuz('bpc', d, caja, vol) +
      tinta(melena) +
      filo(`M24 -200 L44 -186 L50 -166 L46 -146 L52 -146 L56 -168 L50 -190 L30 -206 Z`, 0.6) +
      // El hueco de la cara: negro lleno, para que la cara de la gente se imprima encima.
      soplo(elipse(cx, cy, rx * 1.12, ry * 1.1), T.negro, 's') +
      forma(elipse(cx, cy, rx, ry), T.negro),
  );
}

/* ------------------------------------------------------------------
   Las caras: la gente del galpón, impresa en la trama roja de *En directo*
   ------------------------------------------------------------------ */

interface Cara {
  pelo: 'largo' | 'rulos' | 'corto';
  boca: 'grita' | 'sonrie' | 'seria';
  ojos: 'abiertos' | 'cerrados' | 'anteojos';
  bigote?: boolean;
  /** Cuánto ladea la cabeza, en grados. */
  giro: number;
  /** Lo ancho de la cara, como fracción. */
  ancho: number;
}

/** Las cuatro: el que mira, el que canta a los gritos, la piba con los ojos cerrados, y el de anteojos. */
const CARAS: readonly Cara[] = [
  { pelo: 'corto', boca: 'seria', ojos: 'abiertos', giro: 0, ancho: 0.92 },
  { pelo: 'largo', boca: 'grita', ojos: 'abiertos', giro: -9, ancho: 0.9 },
  { pelo: 'rulos', boca: 'sonrie', ojos: 'cerrados', giro: 7, ancho: 0.88 },
  { pelo: 'corto', boca: 'seria', ojos: 'anteojos', bigote: true, giro: -3, ancho: 0.96 },
];

const g = (u: number, v: number, cu: number, cv: number, su: number, sv: number): number => Math.exp(-(((u - cu) / su) ** 2) - ((v - cv) / sv) ** 2);

/**
 * Cuánta luz tiene una cara en `(u, v)`: `u` de -1 a 1 de oreja a oreja, `v` de -1 (la frente) a 1
 * (el mentón). Es la luz de una foto de recital: el reflector arriba a la derecha, lo hondo de las
 * cuencas, la nariz, la boca. La trama la imprime en puntos.
 */
function luzDeCara(c: Cara, u0: number, v: number): number {
  const u = u0 / c.ancho;
  const w = v > 0.2 ? 1 - 0.3 * (v - 0.2) ** 2 : 1;
  const borde = (u / w) ** 2 + v * v;
  // El pelo: casi negro, pero el reflector le prende los mechones de su lado, y así se le ve la forma.
  const ondas = Math.cos(u * 9) * 0.05;
  const frente = c.pelo === 'rulos' ? -0.5 : c.pelo === 'largo' ? -0.6 : -0.7;
  const lado = c.pelo === 'largo' ? Math.abs(u) > 0.8 - Math.max(0, v) * 0.1 : c.pelo === 'rulos' ? Math.abs(u) > 0.84 + Math.sin(v * 12) * 0.05 : false;
  const melena =
    c.pelo === 'rulos' ? (u / 1.32) ** 2 + ((v + 0.12) / 1.22) ** 2 < 1 : c.pelo === 'largo' ? (u / 1.12) ** 2 + ((v + 0.05) / 1.28) ** 2 < 1 && v < 1.05 : borde < 1.05;
  if (melena && (borde > 1.05 || v < frente + ondas || lado)) {
    const prende = Math.max(0, u * 0.7 - v * 0.4 + 0.15);
    const textura = c.pelo === 'rulos' ? 0.5 + 0.5 * Math.sin(u * 15) * Math.sin(v * 13) : 0.5 + 0.5 * Math.sin(u * 26 + v * 3);
    return Math.max(0, Math.min(0.42, prende * textura * 0.55));
  }
  if (borde > 1.05) return 0;
  // La luz del reflector, de arriba a la derecha: el lado de la sombra se hunde en lo negro.
  let b = 0.46 + 0.26 * u - 0.12 * v;
  b *= Math.min(1, Math.max(0, (1.05 - borde) * 2.2)) ** 0.8;
  const ojo = c.ojos === 'cerrados' ? 0.3 : 0.75;
  b += 0.16 * (g(u, v, -0.36, -0.44, 0.26, 0.1) + g(u, v, 0.36, -0.44, 0.26, 0.1));
  b -= ojo * (g(u, v, -0.36, -0.2, 0.22, 0.13) + g(u, v, 0.36, -0.2, 0.22, 0.13));
  if (c.ojos === 'cerrados') {
    // Los párpados bajos: una raya que se curva para abajo, como el que canta con los ojos cerrados.
    const raya = (cu: number): number => Math.exp(-(((v + 0.14 - 0.5 * (u - cu) ** 2) / 0.04) ** 2) - ((u - cu) / 0.2) ** 2);
    b -= 0.95 * (raya(-0.36) + raya(0.36));
  }
  if (c.ojos === 'anteojos') {
    const lente = (cu: number): number => (Math.abs(u - cu) < 0.28 && Math.abs(v + 0.2) < 0.15 ? 1 : 0);
    if (lente(-0.36) || lente(0.36) || (Math.abs(u) < 0.1 && Math.abs(v + 0.26) < 0.04)) return 0;
  }
  b += 0.22 * g(u, v, 0.06, -0.02, 0.09, 0.3) + 0.24 * g(u, v, 0.08, 0.24, 0.12, 0.09);
  b -= 0.5 * g(u, v, 0.02, 0.4, 0.2, 0.06) + 0.25 * g(u, v, -0.15, 0.18, 0.08, 0.2);
  b += 0.12 * g(u, v, -0.52, 0.1, 0.2, 0.16) + 0.22 * g(u, v, 0.52, 0.1, 0.2, 0.16);
  b -= 0.16 * (g(u, v, -0.6, 0.45, 0.16, 0.25) + g(u, v, 0.6, 0.45, 0.16, 0.25));
  if (c.boca === 'grita') {
    // La boca abierta de cantar a los gritos: un pozo negro, con la fila de dientes arriba.
    if (((u - 0.02) / 0.3) ** 2 + ((v - 0.66) / 0.26) ** 2 < 1) return v < 0.47 && Math.abs(u) < 0.2 ? 0.55 : 0;
    b += 0.1 * g(u, v, 0.02, 0.98, 0.3, 0.08);
  } else if (c.boca === 'sonrie') {
    const vm = 0.58 - 0.4 * u * u;
    b -= 0.95 * Math.exp(-(((v - vm) / 0.06) ** 2) - (u / 0.4) ** 2);
    b += 0.2 * (g(u, v, -0.44, 0.28, 0.16, 0.12) + g(u, v, 0.44, 0.28, 0.16, 0.12));
  } else b -= 0.6 * g(u, v, 0.02, 0.64, 0.28, 0.05) - 0.14 * g(u, v, 0.03, 0.74, 0.18, 0.05);
  if (c.bigote) b -= 0.8 * g(u, v, 0.02, 0.5, 0.32, 0.07);
  b += 0.12 * g(u, v, 0.06, 0.95, 0.24, 0.1);
  return Math.max(0, Math.min(1, b));
}

/** Una cara impresa en trama: los puntos crecen con la luz, como en la tapa de *En directo*. */
function cara(c: Cara): string {
  const [cx, cy] = CARA;
  const [rx, ry] = RCARA;
  const paso = 2.05;
  let hondos = '';
  let claros = '';
  for (let y = cy - ry - 4, fila = 0; y < cy + ry + 4; y += paso * 0.87, fila++) {
    for (let x = cx - rx - 4 + (fila % 2) * paso * 0.5; x < cx + rx + 4; x += paso) {
      // La cara ladeada: se mira el punto girado al revés.
      const [qx, qy] = rotar([x, y], CARA, -c.giro);
      const l = luzDeCara(c, (qx - cx) / (rx * 0.86), (qy - cy) / (ry * 0.84));
      const r = paso * 0.62 * l ** 0.85;
      if (r < 0.3) continue;
      const punto = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
      if (l > 0.5) claros += punto;
      else hondos += punto;
    }
  }
  // El brillo de los ojos: dos puntos de luz del reflector, que es lo que hace que miren.
  const ojoEn = (lado: number): P => rotar([cx + lado * 0.36 * rx * 0.86 * c.ancho + 1, cy - 0.21 * ry * 0.84], CARA, c.giro);
  let brillos = '';
  if (c.ojos === 'abiertos') for (const lado of [-1, 1]) {
    const [ex, ey] = ojoEn(lado);
    brillos += `<circle cx="${f(ex + 0.6)}" cy="${f(ey - 0.5)}" r="0.85"/>`;
  }
  if (c.ojos === 'anteojos') for (const lado of [-1, 1]) {
    const [ex, ey] = ojoEn(lado);
    brillos += `<path d="M${f(ex + 1)} ${f(ey - 2.6)} l2.4 -0.6 l-3.2 4.6 l-1.6 0.2 Z"/>`;
  }
  return (
    `<g filter="url(#xerox-fino)">` +
    `<g fill="${T.reflector}">${hondos}</g><g fill="${T.piel}">${claros}</g>` +
    `<g fill="${T.destello}">${brillos}</g>` +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Los brazos: largos hasta el piso, con la manga de lentejuelas y el puño de volados
   ------------------------------------------------------------------ */

const BRAZO_1: readonly P[] = [[-34, -150], [-46, -164], [-62, -166], [-78, -156], [-90, -136], [-97, -110], [-98, -88], [-90, -74], [-74, -72], [-62, -80], [-58, -100], [-50, -120], [-38, -134]];
const ANTEBRAZO_1: readonly P[] = [
  [-92, -98], [-80, -102], [-66, -96], [-62, -80], [-64, -60], [-66, -46], [-63, -38], [-66, -32], [-64, -18], [-68, -6], [-78, 0], [-92, 1], [-104, -2], [-110, -12],
  [-109, -28], [-106, -36], [-108, -42], [-99, -48], [-98, -64], [-98, -84],
];
const BRAZO_2: readonly P[] = [[42, -148], [54, -162], [70, -164], [86, -154], [96, -134], [102, -108], [104, -86], [96, -72], [80, -70], [68, -78], [64, -98], [56, -120], [46, -134]];
const ANTEBRAZO_2: readonly P[] = [
  [70, -96], [84, -100], [98, -96], [104, -80], [106, -60], [104, -46], [109, -40], [111, -32], [116, -16], [112, -3], [102, 2], [86, 1], [78, -6], [74, -18],
  [76, -32], [72, -40], [78, -46], [74, -62], [70, -82],
];

/**
 * Un puño de nudillos apoyados, con el volado de la camisa en la muñeca y las uñas pintadas. El
 * dorso es negro de pincel; entre dedo y dedo queda el papel teñido, y el reflector le prende los
 * nudillos del lado de la luz. `luz` es cuánto le toca: el de atrás da a la silla y al reflector.
 */
function puno(lado: -1 | 1, [wx, wy]: P, semilla: number, luz: number): string {
  // El dorso: una pasada gorda que baja de la muñeca a los nudillos.
  const dorso = pincelada([[wx - 2, wy + 4], [wx - 1, wy + 10], [wx, wy + 16], [wx + 1, wy + 21]], { ancho: 34, seco: 0.1, grano: 12, apoyo: [0.95, 0.95] }, semilla + 2);
  // Los dedos: cuatro salchichas dobladas que tocan el piso, cada una con su pasada.
  let dedos = '';
  let nudillos = '';
  const unas: P[][] = [];
  for (let i = 0; i < 4; i++) {
    const x = wx - 14 + i * 9.4;
    const prendido = (lado > 0 ? i / 3 : 1 - i / 3) * luz;
    dedos += pincelada([[x, wy + 16], [x - 1, wy + 24], [x + 1, wy + 31], [x + 2, wy + 37]], { ancho: 8, seco: 0.08 + prendido * 0.3, grano: 9, apoyo: [0.9, 0.7] }, semilla + 10 + i);
    if (prendido > 0.2) nudillos += soplo(elipse(x + lado * 2.4, wy + 26, 1.8, 4.6), T.reflector, 'xs', 0.4 + prendido * 0.5);
    unas.push([[x - 2.4, wy + 36.6], [x - 0.8, wy + 38.2], [x + 0.8, wy + 38.2], [x + 2.4, wy + 36.6]]);
  }
  // El volado: papel que el pincel no tocó, con su sombra abajo.
  let volado = '';
  for (let i = 0; i < 5; i++) volado += `<ellipse cx="${f(wx - 18 + i * 8.5)}" cy="${f(wy + 1)}" rx="5.6" ry="4" fill="${T.papel}"/>`;
  const sombraVolado = tinta(pincelada([[wx - 20, wy + 4], [wx - 6, wy + 6], [wx + 8, wy + 6], [wx + 20, wy + 4]], { ancho: 3, seco: 0.3, grano: 8 }, semilla + 1));
  return (
    forma(`M${wx - 26} ${wy} h52 v42 h-52 Z`, T.noche, 0.9) +
    nube(wx + lado * 10, wy + 22, 18, 20, T.reflector, 'm', 0.35 + luz * 0.5) +
    tinta(dorso + dedos) +
    nudillos +
    corridas(unas, 3.2, semilla + 30, 0.05) +
    volado +
    sombraVolado
  );
}

function brazo(n: 0 | 1): string {
  const pts = n === 0 ? BRAZO_1 : BRAZO_2;
  const d = poli(pts);
  const caja = cajaDe(pts, 2);
  const [hx, hy] = A.hombros[n];
  const [ex, ey] = A.codos[n];
  const vol: Volumen = { c: [(hx + ex) / 2 + (n ? 4 : -6), (hy + ey) / 2 - 4], r: [26, 46], angulo: n ? 70 : 110, ancho: 12, semilla: 1500 + n * 40, hondo: n ? 0.22 : 0.42 };
  return recorte(
    `bpb${n}-papel`,
    pts,
    negroConLuz(`bpb${n}`, d, caja, vol) +
      lentejuelas(`bpb${n}-lent`, d, caja, vol, n ? 60 : 26, 1520 + n * 40) +
      (n ? filo(`M86 -156 L98 -134 L104 -108 L106 -86 L100 -74 L98 -88 L96 -110 L90 -134 L80 -152 Z`, 0.7) : '') +
      // La costura del hombro, y el pliegue del codo.
      tinta(pincelada(n ? [[50, -152], [60, -146], [70, -146], [84, -150]] : [[-38, -150], [-50, -146], [-62, -148], [-74, -154]], { ancho: 3, seco: 0.2, grano: 12 }, 1530 + n)) +
      tinta(pincelada(n ? [[70, -86], [80, -84], [90, -86], [98, -90]] : [[-62, -86], [-72, -84], [-84, -86], [-94, -90]], { ancho: 2.6, seco: 0.3, grano: 12 }, 1532 + n)) +
      (n ? '' : nube(-90, -120, 16, 40, T.negro, 'l', 0.5)),
  );
}

function antebrazo(n: 0 | 1): string {
  const pts = n === 0 ? ANTEBRAZO_1 : ANTEBRAZO_2;
  const d = poli(pts);
  const caja = cajaDe(pts, 2);
  const [ex, ey] = A.codos[n];
  const muneca: P = n === 0 ? [-85, -42] : [92, -40];
  const vol: Volumen = { c: [ex + (n ? 4 : -6), (ey + 0) / 2 - 6], r: [26, 56], angulo: n ? 84 : 96, ancho: 11, semilla: 1600 + n * 40, hondo: n ? 0.24 : 0.44 };
  const manga = (p: P): boolean => p[1] > muneca[1] - 4;
  // La manga llega hasta la muñeca; lo de abajo es la mano, que se pinta aparte.
  const [cx0, cy0, cw] = caja;
  const hastaLaMuneca = `M${cx0} ${cy0} h${cw} V${muneca[1]} H${cx0} Z`;
  return recorte(
    `bpa${n}-papel`,
    pts,
    `<clipPath id="bpa${n}-manga"><path d="${hastaLaMuneca}"/></clipPath><g clip-path="url(#bpa${n}-manga)">` +
      negroConLuz(`bpa${n}`, d, caja, vol) +
      `</g>` +
      lentejuelas(`bpa${n}-lent`, d, caja, vol, n ? 40 : 18, 1620 + n * 40, manga) +
      puno(n ? 1 : -1, muneca, 1640 + n * 40, n ? 0.8 : 0.2) +
      (n
        ? filo(`M98 -96 L104 -80 L106 -60 L104 -46 L111 -32 L116 -16 L112 -6 L108 -18 L104 -34 L100 -48 L100 -62 L98 -80 Z`, 0.7) +
          // Abajo, la mano de atrás ya toca el borde del charco del seguidor: una luz pálida, prestada.
          nube(114, -14, 9, 18, T.seguidor, 'm', 0.5)
        : nube(-104, -40, 14, 50, T.negro, 'm', 0.45)),
  );
}

/* ------------------------------------------------------------------
   Las piernas: pantalón oxford y botas de plataforma
   ------------------------------------------------------------------ */

const PIERNAS: readonly P[] = [
  [-48, -76], [0, -78], [48, -76], [52, -58], [57, -38], [64, -20], [70, -14], [77, -9], [80, -3], [77, 1], [10, 1], [10, -12], [16, -20], [14, -36],
  [6, -50], [-4, -50], [-12, -36], [-14, -20], [-8, -12], [-8, 1], [-72, 1], [-76, -3], [-73, -9], [-66, -14], [-60, -20], [-54, -38], [-52, -58],
];

function piernas(): string {
  const d = poli(PIERNAS);
  const caja = cajaDe(PIERNAS, 2);
  const vol: Volumen = { c: [4, -40], r: [66, 50], angulo: 92, ancho: 11, semilla: 1700, hondo: 0.3 };
  // Las plataformas: rojo corrido sobre amarillo, la suela negra y gorda, y el filo de luz arriba.
  const bota = (x0: number, x1: number, punta: number, semilla: number): string => {
    // La caña y la puntera, en pasadas que siguen el empeine; la plataforma, negra y gorda.
    const pasadas: P[][] = [];
    for (let y = -15; y < -4; y += 2.2) pasadas.push([[x0, y], [x0 + (x1 - x0) * 0.33, y - 0.6], [x0 + (x1 - x0) * 0.66, y + 0.4], [x1, y + (y + 10) * 0.2]]);
    return (
      forma(`M${x0} -16 L${x1} -16 L${x1} -5 L${x0} -5 Z`, T.amarillo) +
      corridas(pasadas, 3.4, semilla, 0.12) +
      nube(punta, -8, 7, 4, T.destello, 's', punta > 0 ? 0.7 : 0.25) +
      nube(punta > 0 ? x0 + 4 : x1 - 4, -9, 8, 6, T.negro, 's', 0.55) +
      forma(`M${x0 - 1} -5 L${x1 + 1} -5 L${x1 + 1} 2 L${x0 - 1} 2 Z`, T.negro) +
      trazo(`M${x0} -4.6 L${x1} -4.6`, T.reflector, 0.8, punta > 0 ? 0.8 : 0.35)
    );
  };
  return recorte(
    'bpp-papel',
    PIERNAS,
    negroConLuz('bpp', d, caja, vol) +
      lentejuelas('bpp-lent', d, caja, vol, 50, 1720, (p) => p[1] > -17) +
      // La raya del pantalón y la botamanga que se abre.
      tinta(pincelada([[-32, -70], [-34, -50], [-36, -30], [-38, -14]], { ancho: 2.4, seco: 0.3, grano: 12 }, 1730) + pincelada([[30, -70], [33, -50], [36, -30], [40, -14]], { ancho: 2.4, seco: 0.3, grano: 12 }, 1731)) +
      filo(`M48 -76 L52 -58 L56 -38 L62 -18 L66 -18 L60 -40 L56 -60 L52 -76 Z`, 0.6) +
      bota(-80, -8, -70, 1740) +
      bota(8, 82, 72, 1750) +
      nube(82, -6, 7, 7, T.seguidor, 's', 0.55),
  );
}

/* ------------------------------------------------------------------
   El halo: la luz que junta alrededor, que crece cuando brilla
   ------------------------------------------------------------------ */

function halo(): string {
  return (
    nube(10, -120, 120, 110, T.reflector, 'xl', 0.55) +
    nube(40, -150, 70, 60, T.destello, 'xl', 0.35) +
    nube(0, -110, 160, 140, T.brasa, 'xl', 0.4)
  );
}

/* ------------------------------------------------------------------
   Las piezas que se imprimen
   ------------------------------------------------------------------ */

/** Los recortes a tijera de cada pieza que se mueve: el test mira que cada bisagra caiga adentro. */
export const RECORTES_BESTIA_POP: Readonly<Record<string, readonly P[]>> = {
  piernas: PIERNAS,
  cuerpo: CUERPO,
  cabeza: CABEZA,
  'brazo-1': BRAZO_1,
  'antebrazo-1': ANTEBRAZO_1,
  'brazo-2': BRAZO_2,
  'antebrazo-2': ANTEBRAZO_2,
};

const CAJA_CARA: Caja = [CARA[0] - RCARA[0] - 4, CARA[1] - RCARA[1] - 4, RCARA[0] * 2 + 8, RCARA[1] * 2 + 8];

export const PIEZAS_BESTIA_POP: readonly Pieza[] = [
  { nombre: 'bestia-pop-halo', caja: [-190, -280, 380, 320], dibujo: halo(), densidad: 0.6 },
  { nombre: 'bestia-pop-piernas', caja: cajaDe(PIERNAS, 3), dibujo: piernas(), densidad: 2.4 },
  { nombre: 'bestia-pop-cuerpo', caja: cajaDe(CUERPO, 3), dibujo: cuerpo(), densidad: 2.4 },
  { nombre: 'bestia-pop-cabeza', caja: cajaDe(CABEZA, 3), dibujo: cabeza(), densidad: 2.6 },
  ...CARAS.map((c, i) => ({ nombre: `bestia-pop-cara-${i + 1}`, caja: CAJA_CARA, dibujo: cara(c), densidad: 3.2 })),
  { nombre: 'bestia-pop-brazo-1', caja: cajaDe(BRAZO_1, 3), dibujo: brazo(0), densidad: 2.4 },
  { nombre: 'bestia-pop-antebrazo-1', caja: cajaDe(ANTEBRAZO_1, 3), dibujo: antebrazo(0), densidad: 2.4 },
  { nombre: 'bestia-pop-brazo-2', caja: cajaDe(BRAZO_2, 3), dibujo: brazo(1), densidad: 2.4 },
  { nombre: 'bestia-pop-antebrazo-2', caja: cajaDe(ANTEBRAZO_2, 3), dibujo: antebrazo(1), densidad: 2.4 },
];

/* ------------------------------------------------------------------
   El títere: las piezas anidadas, los destellos de la página y el toque
   ------------------------------------------------------------------ */

const img = imagenesDe(PIEZAS_BESTIA_POP);

/**
 * Los destellos: estrellas de cuatro puntas que la página dibuja encima de las lentejuelas, y la isla
 * hace saltar. `luz` es cuánto les toca del reflector: las del lado de la sombra casi nunca.
 */
export const CHISPAS: Readonly<Record<string, ReadonlyArray<readonly [number, number, number]>>> = {
  cuerpo: [[-30, -204, 0.45], [40, -205, 1], [64, -184, 1], [24, -150, 0.8], [79, -140, 1], [76, -104, 0.9], [62, -66, 0.7], [8, -116, 1], [-44, -140, 0.25], [40, -50, 0.6]],
  'brazo-1': [[-78, -152, 0.35], [-92, -104, 0.2]],
  'antebrazo-1': [[-70, -60, 0.4], [-82, -3, 0.5]],
  'brazo-2': [[84, -148, 1], [98, -102, 0.9]],
  'antebrazo-2': [[104, -64, 1], [108, -4, 0.9]],
  piernas: [[-70, -9, 0.4], [72, -9, 1]],
};

/** Las que se ven sin la isla: el filo del lado del reflector, quieto. */
export const CHISPAS_QUIETAS: ReadonlySet<string> = new Set(['cuerpo-1', 'cuerpo-3', 'brazo-2-0', 'piernas-1']);

const estrella = (r: number): string =>
  `M0 ${f(-r)} Q${f(r * 0.14)} ${f(-r * 0.14)} ${f(r)} 0 Q${f(r * 0.14)} ${f(r * 0.14)} 0 ${f(r)} Q${f(-r * 0.14)} ${f(r * 0.14)} ${f(-r)} 0 Q${f(-r * 0.14)} ${f(-r * 0.14)} 0 ${f(-r)} Z`;

function chispas(parte: string): string {
  return (CHISPAS[parte] ?? [])
    .map(([x, y, luz], i) => {
      const quieta = CHISPAS_QUIETAS.has(`${parte}-${i}`);
      return `<path class="bt-bestia-pop-chispa" data-chispa="${parte}-${i}" data-luz="${luz}" data-px="${x}" data-py="${y}" d="${estrella(5)}" transform="translate(${x} ${y}) scale(${quieta ? 1 : 0})"/>`;
    })
    .join('');
}

const parte = (nombre: string, cuerpo: string, extra = ''): string => `<g data-parte="${nombre}"${extra}>${cuerpo}</g>`;

/** Lo que va adentro del títere, en la pose quieta: encorvado, los nudillos en el tablado, la primera cara puesta. */
export function adentroDelTitere(): string {
  const brazoCon = (n: 0 | 1): string =>
    parte(`brazo-${n + 1}`, img(`bestia-pop-brazo-${n + 1}`) + chispas(`brazo-${n + 1}`) + parte(`antebrazo-${n + 1}`, img(`bestia-pop-antebrazo-${n + 1}`) + chispas(`antebrazo-${n + 1}`)));
  const caras = Array.from({ length: A.caras }, (_, i) => parte(`cara-${i + 1}`, img(`bestia-pop-cara-${i + 1}`), ` opacity="${i ? 0 : 1}"`)).join('');
  return (
    parte('halo', img('bestia-pop-halo'), ' opacity="0.4"') +
    parte('piernas', img('bestia-pop-piernas') + chispas('piernas')) +
    parte(
      'cuerpo',
      brazoCon(1) + img('bestia-pop-cuerpo') + chispas('cuerpo') + parte('cabeza', img('bestia-pop-cabeza') + caras) + brazoCon(0),
    )
  );
}

function titere(nombre: string): string {
  return (
    `<g class="titere titere--bestia-pop" data-id="${ID}" role="button" tabindex="0" aria-label="${nombre}" transform="translate(${POP.x} ${POP.piso}) scale(${POP.escala})">` +
    adentroDelTitere() +
    `</g>`
  );
}

export const BESTIA_POP: Personaje | null = {
  id: ID,
  region: 'el-galpon',
  ancla: POP.x,
  piezas: PIEZAS_BESTIA_POP,
  capas: { figura: (nombres) => titere(nombres.get(ID) ?? 'La bestia pop') },
  retrato: { caja: [-132, -228, 264, 236], cuerpo: adentroDelTitere },
};
