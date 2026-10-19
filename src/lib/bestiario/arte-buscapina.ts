/**
 * El Capitán Buscapina (`D-73`, decimoquinta vuelta), sentado en la nieve de Cybersiberia.
 *
 * *"El Capitán Buscapina salda deudas. / Sentado, en bolas, watcheando la tele"*. No está en ninguna
 * tapa: se inventa en la de su disco (`T-440`), que es *Último bondi a Finisterre* (1998, pista 1), y
 * en la tapa de ese disco la banda aparece por primera vez, metida en el ojo de buey, hecha **postal
 * virtual**: gente de computadora, con la piel tibia y de plástico, la sombra honda y un reflejo
 * violeta. Así está pintado él: **aerógrafo frío, como si la tele lo soplara**. Lo vemos de espaldas,
 * a contraluz de la pantalla, y lo único que le da forma es el canto que le prende la tele, del lado
 * de la tele nada más: blanco y celeste en el filo, una franja angosta de piel tibia, y adentro la
 * espalda se hunde en el marrón y el violeta de las sombras de la tapa. Las orejas, que la luz
 * atraviesa, se encienden de rojo.
 *
 * Está como se mira la tele en el piso: echado para un costado, apoyado en el brazo izquierdo, con la
 * rodilla derecha arriba y el control colgando de la mano. Lo demás sale de la letra y de lo que contó
 * el Indio (`RES-21`): la canción viene de un cómic que dibujó una noche en Pinamar, con Fenton de
 * superhéroe y una capa con el sello del laboratorio que hace la Buscapina, porque Fenton tenía el
 * hígado deshecho y no se cuidaba. Acá la capa de látex negro, la de los trajes de la tapa, le sirve
 * de alfombra para no sentarse en la nieve; el sello es un retorcijón y no una marca. Tiene la gorra
 * de capitán y nada más. La mano en que se apoya tiene abajo las boletas, que son el papel quemado de
 * la contratapa, para que no se le vuelen. La nieve se le junta atrás y en los hombros.
 *
 * Es un títere de papel de trece piezas, en coordenadas de títere (`rig-buscapina.ts`): el (0, 0) es
 * la nieve donde está sentado. Los colores se nombran por token: acá no vive ni un hex.
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { BUSCA, BUSCA_ARMADO as A, type P } from './rig-buscapina.ts';
import type { Personaje } from './elenco.ts';

const ID = 'el-capitan-buscapina';

const T = {
  piel: 'var(--bestia-buscapina-piel)',
  clara: 'var(--bestia-buscapina-piel-clara)',
  honda: 'var(--bestia-buscapina-piel-honda)',
  violeta: 'var(--bestia-buscapina-violeta)',
  rojo: 'var(--bestia-buscapina-rojo)',
  papel: 'var(--bestia-buscapina-papel)',
  negro: 'var(--fondo)',
  nieve: 'var(--entorno-cyber-nieve)',
  lente: 'var(--entorno-cyber-lente)',
  vidrio: 'var(--entorno-cyber-vidrio)',
  hondo: 'var(--entorno-cyber-acero-hondo)',
  acero: 'var(--entorno-cyber-acero)',
  claro: 'var(--entorno-cyber-acero-claro)',
  oxido: 'var(--entorno-cyber-oxido)',
};

type Caja = readonly [number, number, number, number];

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/* ------------------------------------------------------------------
   Herramientas
   ------------------------------------------------------------------ */

/** Una curva suave que pasa por todos los puntos (Catmull-Rom llevada a Bézier). */
function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

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

/** Unos puntos corridos. */
const corre = (pts: readonly P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy] as const);

const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/**
 * La contraluz de la tele: la forma entera se pinta del blanco del filo, y encima la misma forma,
 * corrida para el lado contrario a la luz, en capas que se van oscureciendo. Lo que queda del filo de
 * cada capa es el canto, y queda del lado de la luz: blanco, celeste, una franja angosta de piel
 * tibia, el marrón y, adentro, lo hondo. `luz` es para dónde está la luz; `ancho` cuánto se mete el
 * canto; `cine` cuánto se achica cada capa, que es lo que deja un hilo de canto en los costados.
 */
function contraluz(d: string, [cx, cy]: P, luz: P, ancho = 1, hondo = 0.85, cine = 1, tintas: readonly string[] = PIEL): string {
  const m = Math.hypot(luz[0], luz[1]) || 1;
  const [lx, ly] = [luz[0] / m, luz[1] / m];
  const capa = (color: string, k: number, s: number, tam: 'xs' | 's' | 'm' | 'l', o = 1): string => {
    const e = 1 - (1 - s) * cine;
    return `<g transform="translate(${f(-lx * k * ancho)} ${f(-ly * k * ancho)}) translate(${f(cx)} ${f(cy)}) scale(${e}) translate(${f(-cx)} ${f(-cy)})">${soplo(d, color, tam, o)}</g>`;
  };
  const [filo, celeste, clara, tibia, honda, reflejo, fondo] = tintas;
  return (
    forma(d, filo!) +
    capa(celeste!, 1, 0.997, 'xs') +
    capa(clara!, 2, 0.992, 'xs', 0.85) +
    capa(tibia!, 3.2, 0.986, 's', 0.8) +
    capa(honda!, 4.8, 0.976, 's') +
    capa(reflejo!, 8, 0.96, 'm', 0.55) +
    capa(fondo!, 12, 0.93, 'm', hondo)
  );
}

/** Las tintas de la contraluz sobre la piel, y sobre la nieve que está en su sombra. */
const PIEL = [T.nieve, T.lente, T.clara, T.piel, T.honda, T.violeta, T.negro] as const;
const NIEVE_EN_SOMBRA = [T.nieve, T.nieve, T.nieve, T.nieve, T.lente, T.claro, T.acero] as const;

/** La piel de gallina: granitos chicos donde pega la luz, cada uno con su sombrita abajo. */
function gallina(zonas: ReadonlyArray<readonly [number, number, number, number]>, semilla: number, cuantos = 60): string {
  const rnd = azar(semilla);
  let luz = '';
  let sombra = '';
  for (const [x, y, rx, ry] of zonas) {
    for (let i = 0; i < cuantos; i++) {
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd());
      const px = x + Math.cos(a) * rx * r;
      const py = y + Math.sin(a) * ry * r;
      const t = 0.26 + rnd() * 0.18;
      sombra += `<circle cx="${f(px + 0.15)}" cy="${f(py + 0.4)}" r="${f(t)}"/>`;
      luz += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(t * 0.8)}"/>`;
    }
  }
  return `<g fill="${T.negro}" opacity="0.45">${sombra}</g><g fill="${T.clara}" opacity="0.55">${luz}</g>`;
}

/** Copos que se le posaron: puntitos blancos sueltos. */
function copos(x0: number, y0: number, w: number, h: number, cuantos: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) s += `<circle cx="${f(x0 + rnd() * w)}" cy="${f(y0 + rnd() * h)}" r="${f(0.45 + rnd() * 0.8)}" opacity="${f(0.45 + rnd() * 0.5)}"/>`;
  return `<g fill="${T.nieve}">${s}</g>`;
}

/** Un brillo de látex: la raya dura y blanca que la luz deja en lo negro, como en los trajes de la tapa. */
const brillo = (d: string, ancho: number, o = 0.85): string => `<g filter="url(#soplo-xs)">${trazo(d, T.nieve, ancho, o)}</g>`;

/** Un contorno con temblor: la orilla de algo blando (la capa, la nieve), sin compás. */
function blando(cx: number, cy: number, rx: number, ry: number, semilla: number, amp = 0.12, n = 22): P[] {
  const rnd = azar(semilla);
  const fases = [rnd() * 6, rnd() * 6, rnd() * 6];
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 1 + amp * (Math.sin(a * 3 + fases[0]!) * 0.5 + Math.sin(a * 5 + fases[1]!) * 0.3 + Math.sin(a * 7 + fases[2]!) * 0.2) + (rnd() - 0.5) * amp * 0.6;
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r] as P;
  });
}

/* ------------------------------------------------------------------
   Las boletas: el papel quemado de la contratapa
   ------------------------------------------------------------------ */

function boletaD(cx: number, cy: number, w: number, h: number, giro: number, semilla: number, luz = 0.6): string {
  const rnd = azar(semilla);
  const pts: P[] = [];
  const lados: Array<[P, P]> = [[[-w / 2, -h / 2], [w / 2, -h / 2]], [[w / 2, -h / 2], [w / 2, h / 2]], [[w / 2, h / 2], [-w / 2, h / 2]], [[-w / 2, h / 2], [-w / 2, -h / 2]]];
  for (const [a, b] of lados) {
    for (let i = 0; i < 6; i++) {
      const t = i / 6;
      const come = (rnd() - 0.5) * 1.2;
      const [nx, ny] = [-(b[1] - a[1]), b[0] - a[0]];
      const m = Math.hypot(nx, ny);
      pts.push([a[0] + (b[0] - a[0]) * t + (nx / m) * come, a[1] + (b[1] - a[1]) * t + (ny / m) * come]);
    }
  }
  const d = `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
  let renglones = '';
  for (let y = -h / 2 + 3; y < h / 2 - 2; y += 2.2) renglones += `M${f(-w / 2 + 2.2)} ${f(y)} l${f(w * (0.35 + rnd() * 0.45))} 0 `;
  return (
    `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(giro)})">` +
    enmascarado(`m-bus-boleta-${semilla}`, d,
      forma(d, T.papel) +
      nube(-w * 0.15, -h * 0.35, w * 0.55, h * 0.35, T.nieve, 's', luz) +
      nube(w * 0.2, h * 0.4, w * 0.5, h * 0.4, T.claro, 's', 0.5) +
      trazo(renglones, T.oxido, 0.5, 0.65) +
      // El canto quemado, como la hoja de la contratapa.
      `<path d="${d}" fill="none" stroke="${T.oxido}" stroke-width="2.6" filter="url(#soplo-xs)"/>` +
      `<path d="${d}" fill="none" stroke="${T.negro}" stroke-width="0.7" opacity="0.6"/>`) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   La capa tendida en la nieve y la rodilla levantada
   ------------------------------------------------------------------ */

/** La capa tendida, arrugada: lo que se ve es lo de los costados y lo de nuestro lado. */
const CAPA: readonly P[] = blando(-6, 0, 118, 30, 7, 0.16, 28);
/** La punta de adelante a la izquierda, doblada sobre la capa: se le ve el forro rojo. */
const PUNTA: readonly P[] = [[-124, 14], [-112, 17], [-99, 19], [-103, 12], [-108, 5], [-116, 8]];
/** La rodilla derecha, levantada, y el muslo que baja a la cadera (lo de adentro lo tapa la espalda). */
const RODILLA: readonly P[] = [[40, -26], [46, -46], [54, -64], [62, -78], [72, -81], [80, -73], [81, -58], [75, -42], [65, -26], [55, -14], [44, -10]];
/** Las boletas que tiene debajo de la mano, para que no se le vuelen. */
const FAJO: P = [-80, 6];

function piernas(): string {
  const dCapa = curva(CAPA);
  const rnd = azar(23);
  // Los pliegues del látex: cortos, torcidos, que salen de donde está sentado, con brillos rotos en el lomo.
  let pliegues = '';
  let brillos = '';
  for (let i = 0; i < 14; i++) {
    const a = Math.PI * (-0.1 + (i / 13) * 1.2);
    const [ux, uy] = [Math.cos(a), Math.sin(a) * 0.3];
    const r0 = 50 + rnd() * 26;
    const r1 = r0 + 16 + rnd() * 28;
    const tuerce = (rnd() - 0.5) * 14;
    const p0: P = [ux * r0 - 6, uy * r0 + 2];
    const p1: P = [ux * r1 + tuerce - 6, uy * r1 + 4];
    const medio: P = [(p0[0] + p1[0]) / 2 + tuerce * 0.6, (p0[1] + p1[1]) / 2 + (rnd() - 0.5) * 5];
    const loma = `M${f(p0[0])} ${f(p0[1])} Q${f(medio[0])} ${f(medio[1])} ${f(p1[0])} ${f(p1[1])} L${f(p1[0] + 3)} ${f(p1[1] + 2.5)} Q${f(medio[0] + 3)} ${f(medio[1] + 3.5)} ${f(p0[0] + 2)} ${f(p0[1] + 2.5)} Z`;
    // Cada pliegue es un lomo que agarra un poco de luz y, pegado, el surco negro.
    pliegues += `<g transform="translate(-2.4 -2)">${soplo(loma, T.acero, 's', 0.8)}</g>` + soplo(loma, T.negro, 's', 0.85);
    if (rnd() < 0.8) {
      const k0 = 0.15 + rnd() * 0.3;
      const k1 = k0 + 0.25 + rnd() * 0.3;
      const en = (k: number): P => [p0[0] + (p1[0] - p0[0]) * k + tuerce * 0.3 * Math.sin(k * Math.PI) - 2, p0[1] + (p1[1] - p0[1]) * k - 2.4];
      brillos += brillo(`M${f(en(k0)[0])} ${f(en(k0)[1])} L${f(en(k1)[0])} ${f(en(k1)[1])}`, 1, 0.5 + rnd() * 0.35);
    }
  }
  // El sello del cómic: un medallón de bronce repujado con un retorcijón adentro, no una marca.
  const [sx, sy] = [36, 18];
  const sello =
    nube(sx + 1, sy + 2, 10, 5, T.negro, 's', 0.8) +
    forma(elipse(sx, sy, 8.6, 4.8), T.oxido) +
    forma(elipse(sx, sy - 0.5, 7.8, 4.2), T.vidrio) +
    `<ellipse cx="${sx}" cy="${f(sy - 0.5)}" rx="5.6" ry="3" fill="none" stroke="${T.oxido}" stroke-width="0.8"/>` +
    trazo(`M${sx - 4.2} ${sy - 0.2} L${sx - 1.6} ${sy - 2.2} L${sx + 0.4} ${sy + 0.6} L${sx + 2.4} ${sy - 2} L${sx + 4.2} ${sy - 0.4}`, T.negro, 1) +
    nube(sx - 2.6, sy - 2.6, 3, 1.2, T.nieve, 'xs', 0.8);
  const dPunta = curva(PUNTA);
  // La punta doblada tira sombra sobre la capa, del lado de adentro, y el doblez agarra la luz.
  const punta =
    soplo('M-116 8 L-108 5 L-103 12 L-99 19 L-96 14 L-102 3 Z', T.negro, 's', 0.7) +
    enmascarado('m-bus-punta', dPunta, forma(dPunta, T.rojo) + nube(-104, 10, 8, 5, T.honda, 'm', 0.7) + nube(-118, 13, 5, 3, T.clara, 's', 0.3)) +
    brillo('M-123 14 Q-112 17.5 -100 19', 1, 0.75);
  const capa =
    enmascarado('m-bus-capa', dCapa,
      forma(dCapa, T.hondo) +
      nube(-6, -4, 106, 24, T.violeta, 'l', 0.3) +
      pliegues +
      brillos +
      // Lo de nuestro lado está en la sombra de él.
      nube(0, 22, 66, 12, T.negro, 'l', 0.6) +
      // El canto de la capa que da a la tele: lo único que la prende de lleno.
      nube(-112, -18, 16, 8, T.lente, 'm', 0.4) +
      nube(104, -18, 16, 8, T.lente, 'm', 0.4) +
      // La nieve que se le juntó en los pliegues.
      soplo('M-124 -4 Q-116 -12 -102 -8 Q-108 -2 -122 0 Z', T.nieve, 'xs', 0.85) +
      soplo('M96 -12 Q110 -18 118 -6 Q108 -6 98 -8 Z', T.nieve, 'xs', 0.85) +
      soplo('M54 26 Q66 20 80 24 Q68 29 56 29 Z', T.nieve, 'xs', 0.6) +
      copos(-120, -28, 236, 58, 30, 29) +
      sello) +
    // El grosor del látex en el canto de adelante: una orilla que brilla rota.
    `<g transform="translate(0 0.8)">${brillo(curva(CAPA.filter((p) => p[1] > 8), false), 0.8, 0.3)}</g>` +
    punta;
  // La rodilla: lo de arriba agarra la tele de lleno, el muslo se hunde para abajo.
  const dRodilla = curva(RODILLA);
  const [rx, ry] = A.rodilla;
  const rodilla = enmascarado('m-bus-rodilla', dRodilla,
    contraluz(dRodilla, [62, -46], [0.2, -1], 1.8, 0.95, 0.8) +
    nube(rx + 2, ry - 7, 7, 3, T.clara, 's', 0.5) +
    nube(52, -24, 14, 14, T.negro, 'm', 0.6) +
    gallina([[rx + 2, ry - 7, 9, 2.4]], 37, 20));
  // La sombra: la tele está atrás de él, así que la sombra cae de nuestro lado, sobre la capa y la nieve.
  const sombra = nube(-4, 36, 80, 15, T.negro, 'l', 0.5) + nube(0, 56, 48, 15, T.acero, 'l', 0.7) + nube(0, 68, 24, 8, T.hondo, 'm', 0.35);
  const [fx, fy] = FAJO;
  return conGrano(
    sombra +
      capa +
      // Las boletas debajo de la mano: el fajo, abierto, que asoma por los dedos y por abajo de la palma.
      boletaD(fx - 16, fy - 2, 18, 12, -22, 61, 0.3) + boletaD(fx - 8, fy + 6, 18, 12, 9, 62, 0.35) + boletaD(fx - 2, fy - 3, 18, 12, -5, 63, 0.55) +
      rodilla,
  );
}

/* ------------------------------------------------------------------
   La espalda: del montón de nieve al cogote, echada para la izquierda
   ------------------------------------------------------------------ */

const ESPALDA: readonly P[] = [
  [-46, -10], [-43, -30], [-41, -46], [-46, -62], [-52, -80], [-56, -94], [-57, -106], [-49, -114], [-35, -118], [-23, -121],
  [-20, -132], [3, -134], [5, -121], [16, -117], [28, -110], [37, -102], [42, -92], [41, -80], [38, -62], [36, -46], [42, -30],
  [46, -10], [24, -4], [0, -2], [-24, -4],
];
/** La nieve que se le juntó atrás, hasta la cintura: lo tapa de ahí para abajo. */
const MONTON: readonly P[] = [
  [62, 12], [57, 2], [46, -5], [32, -10], [18, -14], [6, -19], [-6, -23], [-18, -27], [-30, -28], [-42, -25], [-52, -18], [-60, -8],
  [-68, 4], [-72, 12], [-52, 16], [-26, 13], [0, 17], [30, 14],
];

function espalda(): string {
  const d = curva(ESPALDA);
  // La espina va del cogote al asiento, torcida por cómo está echado.
  const espina = (y: number): number => -8 + ((y + 121) * 8) / 95;
  let nudos = '';
  for (let i = 0; i < 7; i++) {
    const y = -116 + i * 10.5;
    nudos += nube(espina(y), y, 2.4, 3.2, T.honda, 's', 0.7 - i * 0.07) + nube(espina(y), y + 2.4, 1.8, 1.3, T.negro, 'xs', 0.5);
  }
  const surco = `M${f(espina(-120) - 1)} -120 Q${f(espina(-80) - 1.5)} -80 ${f(espina(-26) - 1)} -26 L${f(espina(-26) + 1.5)} -26 Q${f(espina(-80) + 1)} -80 ${f(espina(-120) + 1.5)} -120 Z`;
  const cuerpo = enmascarado('m-bus-espalda', d,
    contraluz(d, [-6, -64], [0.05, -1], 1.9, 0.95, 1.2) +
    // Los hombros miran para arriba, a la pantalla: ahí la luz no es canto, les pega de lleno. El
    // izquierdo, subido por el brazo en que se apoya, agarra más.
    nube(-42, -115, 13, 4, T.clara, 's', 0.75) + nube(-42, -116, 8, 1.6, T.nieve, 'xs', 0.7) +
    nube(26, -111, 11, 3.4, T.clara, 's', 0.6) + nube(26, -112, 6, 1.4, T.nieve, 'xs', 0.55) +
    nube(-10, -121, 10, 2.4, T.piel, 's', 0.6) +
    // El filo de la tele chica, lejos a la izquierda.
    nube(-55, -92, 2, 16, T.lente, 's', 0.5) +
    // La espina: un surco con los nudos, y los dos lomos de los músculos.
    soplo(surco, T.negro, 's', 0.6) +
    nudos +
    nube(espina(-74) - 9, -74, 4, 32, T.violeta, 'm', 0.45) + nube(espina(-74) + 9, -74, 4, 32, T.violeta, 'm', 0.4) +
    // Los omóplatos: el izquierdo apretado contra la espina por el brazo que lo sostiene.
    soplo('M-44 -104 Q-28 -112 -20 -98 Q-22 -84 -36 -80 Q-48 -88 -44 -104 Z', T.violeta, 'm', 0.6) +
    soplo('M-40 -82 Q-28 -80 -20 -88 Q-22 -78 -32 -74 Z', T.negro, 's', 0.65) +
    soplo('M30 -100 Q14 -106 6 -92 Q8 -76 22 -72 Q34 -80 30 -100 Z', T.violeta, 'm', 0.5) +
    soplo('M26 -74 Q14 -72 6 -80 Q8 -70 18 -66 Z', T.negro, 's', 0.6) +
    // El rollo de la cintura del lado que se dobla: un hombre de cierta edad, sin héroe adentro.
    soplo('M-44 -48 Q-32 -42 -20 -50 Q-30 -55 -44 -52 Z', T.negro, 's', 0.8) +
    nube(-39, -41, 7, 4, T.honda, 'm', 0.75) +
    soplo('M38 -46 Q30 -44 24 -48 Q30 -50 38 -50 Z', T.negro, 's', 0.45) +
    // Lo que rebota de la nieve de atrás: un frío muy bajo en la cintura.
    nube(0, -32, 30, 6, T.lente, 'l', 0.12) +
    // El cogote: a la sombra de la cabeza y de la gorra, que le tapan la tele. Corto, y con los
    // pliegues de mirar para arriba.
    nube(-8, -128, 15, 9, T.negro, 's', 0.8) +
    nube(-8, -124, 9, 3, T.honda, 's', 0.6) +
    trazo('M-16 -124 Q-8 -122 0 -124', T.negro, 0.9, 0.5) +
    gallina([[-44, -114, 11, 2.6], [28, -109, 9, 2.4], [-55, -92, 2, 12], [40, -86, 2, 10]], 41, 46) +
    copos(-52, -116, 92, 90, 12, 43),
  );
  const dMonton = curva(MONTON);
  // La nieve del montón: arriba la prende la tele, que le pasa por encima de los hombros; la cara que
  // da para nuestro lado está en la sombra de él, gris y fría, como los montones de adelante.
  const monton = enmascarado('m-bus-monton', dMonton,
    contraluz(dMonton, [-4, -4], [0, -1], 1.4, 0.7, 0.3, NIEVE_EN_SOMBRA) +
    // Se amontonó más del lado del brazo en que se apoya, que le hace reparo.
    nube(-36, -14, 20, 9, T.claro, 'm', 0.55) +
    nube(10, 6, 50, 10, T.acero, 'l', 0.6) +
    // Abajo se hunde en la capa: el pie del montón es lo más oscuro.
    nube(-4, 16, 70, 6, T.hondo, 'm', 0.85) +
    // Los terrones: bultitos con su sombra abajo.
    [[-46, -12], [-22, -18], [2, -10], [26, -4], [44, 2]].map(([x, y]) => nube(x!, y! + 3, 6, 2, T.acero, 's', 0.5) + nube(x!, y!, 5, 2.2, T.nieve, 's', 0.4)).join('') +
    copos(-64, -28, 124, 36, 18, 59));
  // El montón le tira sombra a la espalda, justo arriba.
  const contacto = enmascarado('m-bus-espalda-2', d, soplo('M-50 -20 Q-34 -36 -16 -34 Q12 -26 46 -12 L46 -4 L-50 -4 Z', T.negro, 's', 0.5));
  return conGrano(cuerpo + contacto + monton);
}

/* ------------------------------------------------------------------
   Los brazos: el izquierdo, derecho y plantado; el derecho, colgado de la rodilla
   ------------------------------------------------------------------ */

const BRAZO_1: readonly P[] = [[-40, -112], [-55, -114], [-64, -104], [-68, -88], [-70, -72], [-69, -58], [-64, -49], [-56, -51], [-54, -64], [-50, -82], [-44, -100]];
const ANTEBRAZO_1: readonly P[] = [[-54, -64], [-72, -66], [-76, -48], [-79, -30], [-81, -16], [-88, -4], [-86, 6], [-70, 7], [-66, -2], [-69, -16], [-66, -34], [-60, -50]];
const BRAZO_2: readonly P[] = [[26, -106], [40, -110], [48, -102], [54, -90], [59, -76], [63, -64], [60, -54], [52, -54], [48, -64], [42, -78], [34, -92]];
const ANTEBRAZO_2: readonly P[] = [[50, -66], [62, -70], [74, -71], [84, -68], [88, -60], [84, -53], [74, -54], [62, -54], [52, -56]];

function brazo(n: 0 | 1): string {
  const pts = n === 0 ? BRAZO_1 : BRAZO_2;
  const d = curva(pts);
  const lado = n === 0 ? -1 : 1;
  const [hx, hy] = A.hombros[n];
  const [ex, ey] = A.codos[n];
  return conGrano(enmascarado(`m-bus-brazo-${n + 1}`, d,
    contraluz(d, [(hx + ex) / 2, (hy + ey) / 2], [lado * 0.75, -0.65], 1.6, 0.95, 0.2) +
    // El lado de adentro, que da al cuerpo: hondo, y el codo, huesudo.
    nube((hx + ex) / 2 - lado * 6, (hy + ey) / 2 + 4, 4, 24, T.negro, 'm', 0.6) +
    nube(ex + lado, ey + 2, 3, 3, T.honda, 's', 0.8) +
    // Donde el deltoides se mete en el brazo: un surco corto, y el tríceps flojo, de hombre grande.
    soplo(`M${hx + lado * 10} ${hy + 12} Q${hx + lado * 14} ${hy + 22} ${hx + lado * 12} ${hy + 30} L${hx + lado * 10} ${hy + 30} Q${hx + lado * 11} ${hy + 22} ${hx + lado * 8} ${hy + 13} Z`, T.negro, 's', 0.55) +
    nube(ex - lado * 3, ey - 12, 5, 9, T.honda, 'm', 0.5) +
    (n === 0 ? nube(-69, -80, 2, 16, T.lente, 's', 0.6) : '') +
    gallina([[(hx + ex) / 2 + lado * 7, (hy + ey) / 2 - 8, 2.4, 18]], 71 + n, 24)));
}

/** La mano plantada en la capa, vista de atrás y de arriba: el dorso, los nudillos y los dedos abiertos. */
function manoPlantada(): string {
  const [x, y] = A.manos[0];
  const pts: P[] = [[x + 8, y - 8], [x - 2, y - 9], [x - 10, y - 5], [x - 15, y - 1], [x - 16, y + 3], [x - 11, y + 5], [x - 2, y + 6], [x + 8, y + 5], [x + 11, y - 1]];
  const d = curva(pts);
  let dedos = '';
  for (let k = 0; k < 4; k++) dedos += trazo(`M${f(x - 5 - k * 0.6)} ${f(y - 4 + k * 2.6)} L${f(x - 14 + k * 0.4)} ${f(y - 2 + k * 2)}`, T.negro, 0.7, 0.55);
  return enmascarado('m-bus-mano-1', d,
    contraluz(d, [x, y + 1], [-0.3, -1], 0.9, 0.85, 0.5) +
    [-6, -2, 2].map((k) => nube(x - 6 + k * 0.4, y - 5 + k, 1.4, 1.2, T.clara, 'xs', 0.5)).join('') +
    dedos);
}

/** La mano que cuelga del otro lado de la rodilla, floja, con el control entre los dedos. */
function manoColgada(): string {
  const [x, y] = A.manos[1];
  const pts: P[] = [[x - 6, y - 8], [x + 4, y - 9], [x + 10, y - 3], [x + 10, y + 5], [x + 6, y + 10], [x - 1, y + 10], [x - 6, y + 5], [x - 8, y - 1]];
  const d = curva(pts);
  let dedos = '';
  for (let k = 0; k < 3; k++) dedos += trazo(`M${f(x - 2 + k * 3)} ${f(y + 4)} L${f(x - 2.4 + k * 3)} ${f(y + 9)}`, T.negro, 0.7, 0.6);
  return enmascarado('m-bus-mano-2', d, contraluz(d, [x, y + 2], [0.6, -1], 0.9, 0.85, 0.5) + [-5, -1, 3].map((k) => nube(x + 8, y + k, 1.4, 1.2, T.clara, 'xs', 0.55)).join('') + dedos);
}

function antebrazo(n: 0 | 1): string {
  const pts = n === 0 ? ANTEBRAZO_1 : ANTEBRAZO_2;
  const d = curva(pts);
  const [ex, ey] = A.codos[n];
  const [mx, my] = A.manos[n];
  if (n === 0) {
    // El antebrazo derecho y tieso, que aguanta el peso: la luz le corre por el filo de afuera.
    const brazo = enmascarado('m-bus-antebrazo-1', d,
      contraluz(d, [(ex + mx) / 2, (ey + my) / 2], [-0.85, -0.5], 1.5, 0.95, 0.2) +
      nube((ex + mx) / 2 + 5, (ey + my) / 2, 4, 22, T.negro, 'm', 0.55) +
      nube(-80, -26, 1.8, 14, T.lente, 's', 0.55) +
      // El codo trabado, que aguanta el peso, y la muñeca doblada contra la capa.
      nube(-70, -60, 3.4, 3, T.clara, 's', 0.45) +
      trazo('M-82 -9 Q-76 -7 -69 -9', T.negro, 1, 0.6) +
      gallina([[(ex + mx) / 2 - 6, (ey + my) / 2 - 10, 2, 14]], 81, 16));
    return conGrano(brazo + manoPlantada());
  }
  // El antebrazo que cuelga de la rodilla: corto, porque va para adelante.
  const brazo = enmascarado('m-bus-antebrazo-2', d,
    contraluz(d, [70, -62], [0.1, -1], 1.4, 0.95, 0.5) +
    nube(66, -56, 14, 3, T.negro, 'm', 0.6) +
    gallina([[70, -68, 12, 1.6]], 82, 14));
  // El control remoto: una tableta negra entre los dedos, la punta para la tele, los botones y la lucecita.
  const [rx, ry] = [mx + 9, my + 4];
  const control =
    `<g transform="rotate(-24 ${rx} ${ry})">` +
    forma(`M${rx - 4.4} ${ry + 9} L${rx - 3.6} ${ry - 10} Q${rx} ${ry - 13} ${rx + 3.6} ${ry - 10} L${rx + 4.4} ${ry + 9} Z`, T.negro) +
    brillo(`M${rx + 2.8} ${ry - 9} L${rx + 3.2} ${ry + 7}`, 0.7, 0.6) +
    [[-1.4, -5], [1.4, -5], [-1.4, -1.8], [1.4, -1.8], [0, 1.6]].map(([bx, by]) => `<circle cx="${f(rx + bx!)}" cy="${f(ry + by!)}" r="0.75" fill="${T.claro}"/>`).join('') +
    nube(rx, ry - 11, 1.4, 1.1, T.rojo, 'xs', 0.95) +
    `</g>`;
  return conGrano(brazo + control + manoColgada());
}

/* ------------------------------------------------------------------
   La cabeza: de espaldas, con la gorra, y vuelta por encima del hombro
   ------------------------------------------------------------------
   Las dos se dibujan derechas y se corren a donde la deja el cuerpo echado (`CORRE_CABEZA`).
*/

const CORRE_CABEZA: P = [-9, -2];
const enLaCabeza = (s: string): string => `<g transform="translate(${CORRE_CABEZA[0]} ${CORRE_CABEZA[1]})">${s}</g>`;

/** La nuca y el perfil perdido: la cabeza mira para arriba, a la pantalla, y un poco a la derecha. */
const NUCA: readonly P[] = [
  [-12, -129], [-18, -138], [-20, -148], [-18, -158], [-11, -165], [1, -168], [13, -166], [21, -159], [24, -150], [25, -142],
  [29, -136], [26, -129], [17, -126], [6, -127], [-4, -127],
];

/** La gorra de capitán, de atrás: la copa ancha echada para atrás, la cinta y el cordón dorado. */
function gorraDeAtras(): string {
  const COPA: readonly P[] = [[-26, -169], [-23, -180], [-7, -187], [11, -188], [27, -182], [31, -172], [23, -164], [1, -162], [-19, -163]];
  const CINTA: readonly P[] = [[-20, -153], [-21, -164], [1, -167], [23, -165], [24, -154], [1, -151]];
  const dCopa = curva(COPA);
  const dCinta = curva(CINTA);
  return (
    // La sombra de la gorra en la nuca.
    nube(3, -152, 22, 5, T.negro, 's', 0.65) +
    enmascarado('m-bus-cinta', dCinta,
      forma(dCinta, T.negro) +
      nube(22, -159, 4, 6, T.acero, 's', 0.9) +
      brillo('M-18 -161 Q1 -164 21 -162', 0.8, 0.4) +
      trazo('M-20 -155 Q1 -152 23 -155', T.vidrio, 1.3, 0.9) +
      nube(-17, -155, 3, 1.3, T.nieve, 'xs', 0.6)) +
    enmascarado('m-bus-copa', dCopa,
      forma(dCopa, T.hondo) +
      nube(3, -168, 26, 6, T.negro, 'm', 0.9) +
      // El látex de la copa brilla como los trajes de la tapa: una raya dura arriba.
      brillo('M-21 -178 Q-5 -185 13 -185 Q23 -183 27 -178', 1.1, 0.65) +
      nube(29, -173, 2.6, 5, T.lente, 's', 0.7) +
      nube(-24, -173, 2.6, 5, T.lente, 's', 0.4)) +
    // La nieve en la copa: un montoncito que se le juntó arriba.
    soplo('M-17 -183 Q-5 -193 11 -192 Q23 -189 25 -182 Q11 -185 -1 -184 Q-11 -183 -17 -183 Z', T.nieve, 'xs', 0.95) +
    nube(5, -188, 11, 2.4, T.nieve, 's', 0.6)
  );
}

/** Una oreja que la luz atraviesa: se prende de rojo en el borde, como la piel contra un foco. */
function oreja(x: number, y: number, lado: -1 | 1, ancho: number, id: string): string {
  const d = curva([[x, y - 9], [x + lado * ancho, y - 7], [x + lado * (ancho + 1), y], [x + lado * ancho * 0.7, y + 7], [x, y + 8], [x - lado * 1.5, y]]);
  return enmascarado(id, d,
    forma(d, T.honda) +
    nube(x + lado * ancho * 0.7, y - 2, ancho * 0.5, 8, T.rojo, 's', 0.95) +
    nube(x + lado * ancho, y - 2, 1.4, 7, T.clara, 'xs', 0.9) +
    nube(x + lado * ancho * 0.2, y + 1, 1.6, 4, T.negro, 'xs', 0.75));
}

/** El pelo corto y gris que deja ver la gorra: rayitas cortas y torcidas, más claras en el canto. */
function pelo(x0: number, x1: number, y0: number, y1: number, semilla: number, cuantos = 90): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * (y1 - y0);
    const l = 1.6 + rnd() * 2.4;
    const a = Math.PI / 2 + (rnd() - 0.5) * 0.9 + (x - (x0 + x1) / 2) * 0.02;
    s += trazo(`M${f(x)} ${f(y)} l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`, rnd() < 0.25 ? T.claro : T.hondo, 0.6, 0.35 + rnd() * 0.4);
  }
  return s;
}

function cabeza(): string {
  const d = curva(NUCA);
  const nuca = enmascarado('m-bus-nuca', d,
    contraluz(d, [5, -148], [0.2, -1], 1.6, 0.95, 0.4) +
    pelo(-18, 24, -160, -132, 151) +
    // Abajo la cabeza se mete en el cogote, que está en lo hondo: ni un canto ahí.
    nube(2, -127, 22, 5, T.negro, 's', 0.85) +
    // La mejilla de la derecha, que asoma: el perfil perdido, prendido por la pantalla.
    nube(27, -137, 1.8, 5, T.nieve, 'xs', 0.85) +
    nube(25, -137, 2.6, 6, T.clara, 's', 0.5) +
    // Los pliegues de la nuca, de mirar para arriba.
    trazo('M-8 -133 Q4 -130 17 -133', T.negro, 1, 0.6));
  return conGrano(enLaCabeza(nuca + oreja(-17, -144, -1, 4.4, 'm-bus-oreja-1') + oreja(24, -145, 1, 4.8, 'm-bus-oreja-2') + gorraDeAtras()));
}

/**
 * La cabeza vuelta: te mira por encima del hombro izquierdo. La cara queda a contraluz, y le pega
 * nada más lo que rebota de la nieve y el celeste de la tele chica, lejos a la izquierda: el filo de
 * la nariz, el pómulo y el ojo, que brilla.
 */
const PERFIL: readonly P[] = [
  [18, -129], [23, -139], [24, -152], [20, -161], [9, -167], [-7, -167], [-19, -163], [-26, -156], [-28, -151], [-33, -146],
  [-34, -142], [-30, -140], [-31, -136], [-28, -133], [-28, -129], [-23, -126], [-16, -125], [-10, -120], [-1, -119], [9, -122],
];

function cabezaVuelta(): string {
  const d = curva(PERFIL);
  // El ojo, en las coordenadas de la cabeza derecha (antes de correrla).
  const [ox, oy] = [A.ojo[0] - CORRE_CABEZA[0], A.ojo[1] - CORRE_CABEZA[1]];
  const rnd = azar(201);
  let barba = '';
  for (let i = 0; i < 46; i++) barba += `<circle cx="${f(-28 + rnd() * 20)}" cy="${f(-136 + rnd() * 12)}" r="0.4"/>`;
  const cara = enmascarado('m-bus-perfil', d,
    contraluz(d, [3, -146], [0.95, -0.35], 1.6, 0.9, 1.1) +
    pelo(10, 22, -160, -132, 157, 34) +
    // La cara, hundida: el rebote de la nieve de abajo, el reflejo violeta de la tapa en la mejilla
    // y, en el filo, el celeste de la tele chica.
    nube(-18, -142, 10, 9, T.honda, 'm', 0.7) +
    nube(-20, -138, 8, 5, T.violeta, 'm', 0.75) +
    nube(-24, -133, 6, 2.4, T.lente, 's', 0.3) +
    nube(-8, -150, 5, 7, T.honda, 's', 0.5) +
    `<g filter="url(#soplo-xs)">${trazo('M-27 -154 Q-29 -150 -33.4 -145.5', T.lente, 0.9, 0.85)}${trazo('M-20 -138 Q-17 -136 -12 -137', T.lente, 0.7, 0.4)}</g>` +
    // La barba de días, gris.
    `<g fill="${T.claro}" opacity="0.55">${barba}</g>` +
    // La boca entreabierta, del frío.
    trazo('M-30 -135.6 Q-27 -134.6 -24 -135.2', T.negro, 0.9, 0.9) +
    // El ojo: la cuenca honda, el párpado pesado, la bolsa, y el brillo que lo hace mirar.
    nube(ox, oy, 6, 4.4, T.negro, 's', 0.85) +
    forma(curva([[ox - 3.2, oy], [ox, oy - 1.7], [ox + 2.8, oy - 0.4], [ox, oy + 1.3]]), T.honda) +
    `<circle cx="${f(ox - 0.7)}" cy="${f(oy - 0.1)}" r="1.15" fill="${T.negro}"/>` +
    `<circle cx="${f(ox - 1.15)}" cy="${f(oy - 0.55)}" r="0.5" fill="${T.nieve}"/>` +
    trazo(`M${f(ox - 3.4)} ${f(oy - 0.4)} Q${f(ox)} ${f(oy - 2.6)} ${f(ox + 3)} ${f(oy - 0.8)}`, T.negro, 1.1, 0.95) +
    trazo(`M${f(ox - 2.8)} ${f(oy + 2.5)} Q${f(ox)} ${f(oy + 3.6)} ${f(ox + 2.4)} ${f(oy + 2.3)}`, T.violeta, 0.8, 0.7) +
    // La ceja, tupida y gris.
    trazo(`M${f(ox - 4.8)} ${f(oy - 4.4)} Q${f(ox - 1)} ${f(oy - 6)} ${f(ox + 3.8)} ${f(oy - 4.6)}`, T.claro, 1.2, 0.55) +
    nube(-12, -122, 14, 4, T.negro, 's', 0.6));
  // La gorra, de costado: la visera de charol para nuestro lado, el escudo y el cordón dorado.
  const COPA: readonly P[] = [[-29, -167], [-29, -177], [-15, -185], [7, -187], [23, -181], [27, -172], [19, -164], [-3, -162], [-21, -163]];
  const dCopa = curva(COPA);
  const VISERA = 'M-23 -162 Q-37 -165 -45 -159 Q-43 -155 -33 -156 Q-27 -157 -21 -158 Z';
  const gorra =
    nube(-5, -157, 26, 5, T.negro, 's', 0.6) +
    enmascarado('m-bus-copa-2', dCopa,
      forma(dCopa, T.hondo) +
      nube(-3, -169, 26, 6, T.negro, 'm', 0.85) +
      brillo('M-25 -176 Q-9 -185 11 -185 Q21 -181 25 -175', 1.1, 0.65) +
      nube(26, -172, 2.6, 5, T.lente, 's', 0.7)) +
    forma('M-23 -157 L-24 -164 Q1 -168 21 -165 L21 -156 Q1 -153 -23 -157 Z', T.negro) +
    trazo('M-23 -158 Q-1 -154 21 -157', T.vidrio, 1.3, 0.9) +
    // El escudo, de bronce repujado: el mismo retorcijón del sello de la capa.
    forma(elipse(-17, -167, 3.4, 3), T.vidrio) +
    trazo('M-19.2 -167 L-17.8 -168.3 L-16.6 -166.1 L-15.2 -167.4', T.oxido, 0.7) +
    forma(VISERA, T.negro) +
    brillo('M-25 -160 Q-35 -162 -42 -158', 0.8, 0.8) +
    soplo('M-21 -183 Q-7 -192 9 -190 Q21 -187 23 -181 Q9 -184 -5 -183 Z', T.nieve, 'xs', 0.95);
  return conGrano(enLaCabeza(cara + oreja(4, -146, -1, 5, 'm-bus-oreja-3') + gorra));
}

/* ------------------------------------------------------------------
   Lo que la isla mueve aparte: la nieve en los hombros, la boleta, el vaho y la luz de la tele
   ------------------------------------------------------------------ */

/** La nieve que se le junta en los hombros: la isla la deja crecer y se la sacude cuando tirita. */
function nieveEnLosHombros(): string {
  const loma = (x0: number, x1: number, y0: number, y1: number, alto: number): string =>
    `M${f(x0)} ${f(y0)} Q${f((x0 + x1) / 2)} ${f((y0 + y1) / 2 - alto)} ${f(x1)} ${f(y1)} Q${f((x0 + x1) / 2)} ${f((y0 + y1) / 2 - alto * 0.15)} ${f(x0)} ${f(y0)} Z`;
  return (
    soplo(loma(-56, -24, -108, -120, 6), T.nieve, 'xs', 0.95) +
    soplo(loma(6, 36, -117, -103, 5), T.nieve, 'xs', 0.95) +
    nube(-40, -116, 10, 1.6, T.lente, 'xs', 0.5) +
    nube(22, -112, 9, 1.6, T.lente, 'xs', 0.5) +
    copos(-54, -120, 90, 10, 14, 101)
  );
}

/** La boleta que tira: una sola, centrada en su (0, 0), para que la isla la haga volar. */
const boleta = (): string => boletaD(0, 0, 16, 11, 0, 111, 0.55);

/** El vaho: el aliento que se hace nube en el frío y sube para el lado de la tele. */
const vaho = (): string => nube(0, 0, 13, 8, T.nieve, 'm', 0.5) + nube(4, -3, 7, 5, T.lente, 's', 0.45) + nube(-3, 2, 5, 3, T.nieve, 's', 0.4);

/**
 * La luz de la tele, que la página suma (`mix-blend-mode: screen`) y la isla hace titilar: el halo en
 * el aire con nieve arriba de la gorra, el charco a los costados, y encima de él lo que mira para
 * arriba (la copa de la gorra, los hombros, la rodilla, el filo del brazo en que se apoya). Así,
 * cuando cambia de canal, lo que cambia es la luz que le pega a él.
 */
function luz(color: string): string {
  return (
    nube(-6, -198, 46, 15, color, 'l', 0.7) +
    nube(-8, -186, 24, 5, color, 'm', 0.55) +
    nube(-46, -117, 14, 4.5, color, 'm', 0.6) +
    nube(26, -112, 12, 4, color, 'm', 0.5) +
    nube(70, -80, 10, 4, color, 'm', 0.5) +
    nube(-68, -82, 4, 22, color, 'm', 0.35) +
    nube(-104, -20, 26, 8, color, 'm', 0.4) +
    nube(100, -26, 26, 8, color, 'm', 0.4)
  );
}

/* ------------------------------------------------------------------
   Las piezas que se imprimen
   ------------------------------------------------------------------ */

/** Los recortes de cada pieza que se mueve, en el lugar donde quedan: el test mira las bisagras. */
export const RECORTES_BUSCAPINA: Readonly<Record<string, readonly P[]>> = {
  capa: CAPA,
  rodilla: RODILLA,
  espalda: ESPALDA,
  monton: MONTON,
  cabeza: corre(NUCA, ...CORRE_CABEZA),
  'cabeza-vuelta': corre(PERFIL, ...CORRE_CABEZA),
  'brazo-1': BRAZO_1,
  'antebrazo-1': ANTEBRAZO_1,
  'brazo-2': BRAZO_2,
  'antebrazo-2': ANTEBRAZO_2,
};

/** Dónde quedan las boletas de debajo de la mano: el test mira que la mano las tape. */
export const FAJO_BUSCAPINA = FAJO;

/**
 * Cuántos píxeles por unidad: en la escena va a escala 0,5, y en un teléfono de tres píxeles por punto
 * eso pide 1,4; la ficha lo muestra más grande. A 2,2 todas juntas pesan unos 130 kB.
 */
const D = 2.2;

export const PIEZAS_BUSCAPINA: readonly Pieza[] = [
  { nombre: 'buscapina-piernas', caja: [-134, -90, 266, 168], dibujo: piernas(), densidad: D },
  { nombre: 'buscapina-espalda', caja: cajaDe([...ESPALDA, ...MONTON], 5), dibujo: espalda(), densidad: D },
  { nombre: 'buscapina-nieve', caja: [-62, -130, 104, 34], dibujo: nieveEnLosHombros(), densidad: D },
  { nombre: 'buscapina-cabeza', caja: [-37, -200, 64, 76], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'buscapina-cabeza-vuelta', caja: [-59, -200, 80, 84], dibujo: cabezaVuelta(), densidad: D * 1.4 },
  { nombre: 'buscapina-brazo-1', caja: cajaDe(BRAZO_1, 5), dibujo: brazo(0), densidad: D },
  { nombre: 'buscapina-antebrazo-1', caja: cajaDe(ANTEBRAZO_1, 7), dibujo: antebrazo(0), densidad: D },
  { nombre: 'buscapina-brazo-2', caja: cajaDe(BRAZO_2, 5), dibujo: brazo(1), densidad: D },
  { nombre: 'buscapina-antebrazo-2', caja: [44, -80, 60, 46], dibujo: antebrazo(1), densidad: D },
  { nombre: 'buscapina-boleta', caja: [-14, -12, 28, 24], dibujo: boleta(), densidad: 3 },
  { nombre: 'buscapina-vaho', caja: [-34, -26, 68, 52], dibujo: vaho(), densidad: 1.2 },
  { nombre: 'buscapina-luz', caja: [-160, -250, 320, 300], dibujo: luz(T.lente), densidad: 0.5 },
  { nombre: 'buscapina-luz-cancha', caja: [-160, -250, 320, 300], dibujo: luz(T.vidrio), densidad: 0.5 },
];

/* ------------------------------------------------------------------
   El títere: las piezas anidadas y el toque
   ------------------------------------------------------------------ */

const img = imagenesDe(PIEZAS_BUSCAPINA);

const parte = (nombre: string, cuerpo: string, extra = ''): string => `<g data-parte="${nombre}"${extra}>${cuerpo}</g>`;

/**
 * Lo que va adentro del títere, en la pose quieta: de espaldas, echado sobre el brazo izquierdo,
 * mirando la tele, con el control colgando de la rodilla. La cabeza vuelta, la boleta que vuela, el
 * vaho y la luz del partido arrancan apagados.
 */
export function adentroDelTitere(): string {
  const brazoCon = (n: 0 | 1): string =>
    parte(`brazo-${n + 1}`, parte(`antebrazo-${n + 1}`, img(`buscapina-antebrazo-${n + 1}`)) + img(`buscapina-brazo-${n + 1}`));
  const [bx, by] = A.boca;
  return (
    parte('piernas', img('buscapina-piernas')) +
    parte(
      'espalda',
      brazoCon(1) +
        brazoCon(0) +
        img('buscapina-espalda') +
        parte('nieve', img('buscapina-nieve'), ' opacity="0.6"') +
        parte('cabeza', parte('nuca', img('buscapina-cabeza')) + parte('vuelta', img('buscapina-cabeza-vuelta'), ' opacity="0"')) +
        parte('vaho', img('buscapina-vaho'), ` opacity="0" transform="translate(${bx + 10} ${by - 6})"`),
    ) +
    parte('boleta', img('buscapina-boleta'), ' opacity="0"') +
    `<g class="bt-buscapina-luz">${parte('luz', img('buscapina-luz'), ' opacity="0.6"')}${parte('luz-cancha', img('buscapina-luz-cancha'), ' opacity="0"')}</g>`
  );
}

function titere(nombre: string): string {
  return (
    `<g class="titere titere--buscapina" data-id="${ID}" role="button" tabindex="0" aria-label="${nombre}" transform="translate(${BUSCA.x} ${BUSCA.piso}) scale(${BUSCA.escala})">` +
    adentroDelTitere() +
    `</g>`
  );
}

export const BUSCAPINA: Personaje | null = {
  id: ID,
  region: 'cybersiberia',
  ancla: BUSCA.x,
  piezas: PIEZAS_BUSCAPINA,
  capas: { figura: (nombres) => titere(nombres.get(ID) ?? 'El Capitán Buscapina') },
  retrato: { caja: [-140, -214, 280, 290], cuerpo: adentroDelTitere },
};
