/**
 * La hija del fletero (`D-73`, decimosexta vuelta), en la popa del ferry que sale de los astilleros.
 *
 * *"La hija del fletero, linda infinita / Volvió a Madrid donde parece que es feliz"* es de *Lobo
 * suelto* (1993). La hija no está en ninguna tapa, pero el interior del disco 1 tiene a una mujer
 * pintada por Rocambole: aerógrafo gris, casi foto, con un tubo de teléfono rosa contra la boca y el
 * ojo grande, de pestañas pesadas, que te mira por encima de la mano. **La hija está pintada así**:
 * grisalla soplada, de borde duro donde iba la máscara y blando adentro, y un solo color, el rosa del
 * tubo, que también le pinta la boca. El Indio dice que la canción es como una fotonovela
 * (`RES-21`, p. 327), y la grisalla con un color es eso.
 *
 * El tubo es del dibujo, y la letra le da de qué hablar: *"todavía su amor me da descargas"*. El cable
 * rizado sale del tubo, pasa por la baranda y se mete en el agua, para el lado del muelle, que es de
 * donde llegan las descargas. Se da vuelta una sola vez, cuando la tocás: *"recuerdo cómo su mirada me
 * volteó"*.
 *
 * La noche es la de los astilleros: el farol de sodio le pega de atrás y de la izquierda, por la
 * espalda, y del lado del río le queda el frío de la tiza.
 *
 * Coordenadas del títere: el (0, 0) es la cubierta entre los zapatos, arriba es negativo, y mira para
 * la derecha (`HIJA_ARMADA`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { CABLE, HIJA_ARMADA, LUGAR, QUIETA, TUBO_LARGO, VUELTA, alRecinto, marcas, type Momento, type Punto } from './rig-hija.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas de la mujer del tubo (`tokens.css`), y las de la noche del muelle. */
const C = {
  honda: 'var(--bestia-hija-honda)',
  media: 'var(--bestia-hija-media)',
  gris: 'var(--bestia-hija-gris)',
  clara: 'var(--bestia-hija-clara)',
  luz: 'var(--bestia-hija-luz)',
  pelo: 'var(--bestia-hija-pelo)',
  tubo: 'var(--bestia-hija-tubo)',
  tuboLuz: 'var(--bestia-hija-tubo-luz)',
  tuboHondo: 'var(--bestia-hija-tubo-hondo)',
  sodio: 'var(--disco-cordero-atado-tinta)',
  tiza: 'var(--entorno-astillero-tiza)',
  tizaClara: 'var(--entorno-astillero-tiza-clara)',
  noche: 'var(--entorno-astillero-noche)',
  negro: 'var(--fondo)',
};

const A = HIJA_ARMADA;

/* ------------------------------------------------------------------
   Herramientas: la curva y el tubo que se afina
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

/** El contorno de un miembro que se afina, de `a` a `b`, con su ancho en cada punta. */
function miembro(a: P, b: P, anchoA: number, anchoB: number, panza = 0): P[] {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / l, dx / l];
  const medio: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const am = (anchoA + anchoB) / 2 + panza;
  return [
    [a[0] - (dx / l) * anchoA * 0.3, a[1] - (dy / l) * anchoA * 0.3],
    [a[0] + (nx * anchoA) / 2, a[1] + (ny * anchoA) / 2],
    [medio[0] + (nx * am) / 2, medio[1] + (ny * am) / 2],
    [b[0] + (nx * anchoB) / 2, b[1] + (ny * anchoB) / 2],
    [b[0] + (dx / l) * anchoB * 0.35, b[1] + (dy / l) * anchoB * 0.35],
    [b[0] - (nx * anchoB) / 2, b[1] - (ny * anchoB) / 2],
    [medio[0] - (nx * am) / 2, medio[1] - (ny * am) / 2],
    [a[0] - (nx * anchoA) / 2, a[1] - (ny * anchoA) / 2],
  ];
}

/** El grano del aerógrafo y del papel de la revista: todo lo que se imprime lo lleva. */
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/**
 * La luz del muelle sobre una pieza: el sodio del farol de atrás y de la izquierda, y el frío de la
 * tiza del lado del río. En una grisalla es lo único que no es gris, y se nota apenas.
 */
const luces = (x0: number, x1: number, y0: number, y1: number, k = 1): string =>
  nube(x0, (y0 + y1) / 2, (x1 - x0) * 0.22, (y1 - y0) * 0.55, C.sodio, 'm', 0.28 * k) +
  nube(x1, (y0 + y1) / 2, (x1 - x0) * 0.18, (y1 - y0) * 0.5, C.tiza, 'm', 0.22 * k);

/* ------------------------------------------------------------------
   El cuerpo: el saquito entallado, de espaldas y un poco de costado
   ------------------------------------------------------------------ */

/** El saquito, del talle a los hombros: se lo ve de tres cuartos de espaldas. */
export const TORSO: readonly P[] = [
  [-7.6, -89], [-10.2, -98], [-12.4, -108], [-13.4, -117], [-12.8, -122.6], [-9.6, -125.6], [-4, -127.4], [1.6, -128], [6.6, -127.4],
  [10.6, -125.6], [13.2, -121.6], [13.4, -113], [11.8, -103], [9.4, -94], [8.4, -89], [0.6, -87.6],
];

function torso(): string {
  const d = curva(TORSO);
  const rnd = azar(901);
  // La costura de la espalda y la del costado, que el aerógrafo marca con una sombra fina.
  let tejido = '';
  for (let i = 0; i < 14; i++) {
    const x = -11 + rnd() * 23;
    const y = -124 + rnd() * 34;
    tejido += nube(x, y, 1.2 + rnd() * 2, 2 + rnd() * 3, rnd() < 0.5 ? C.clara : C.media, 's', 0.12 + rnd() * 0.14);
  }
  return conGrano(
    enmascarado('m-hija-torso', d,
      forma(d, C.gris) +
      tejido +
      // La espalda se arquea: la luz de arriba en los omóplatos y lo hondo en la cintura.
      nube(-3, -119, 9, 5, C.clara, 'm', 0.85) +
      nube(-6, -114, 4, 3, C.luz, 's', 0.45) +
      nube(9, -110, 6, 16, C.media, 'm', 0.9) +
      nube(11, -106, 3.4, 14, C.honda, 'm', 0.85) +
      nube(13, -104, 1.4, 12, C.negro, 's', 0.5) +
      nube(-11, -104, 2.4, 12, C.honda, 's', 0.55) +
      nube(0, -92, 12, 3, C.honda, 's', 0.55) +
      // La costura de la espalda, que se va al costado porque está de tres cuartos.
      trazo('M3 -126 Q2 -110 1.4 -90', C.media, 0.7, 0.8) +
      trazo('M3.7 -126 Q2.7 -110 2.1 -90', C.clara, 0.4, 0.5) +
      // La sisa del brazo de allá, apenas, y el pliegue del costado.
      trazo('M11.4 -122 Q13.2 -116 12 -110', C.honda, 0.8, 0.6) +
      // El cinturón fino del talle.
      forma('M-8.2 -94.6 Q0 -93 9.6 -95.4 L9 -91.6 Q0 -89.6 -8 -91 Z', C.honda, 0.9) +
      trazo('M-8 -94.2 Q0 -92.6 9.4 -95', C.clara, 0.4, 0.6) +
      luces(-13, 13, -127, -88)) +
    // El cuello del saquito, doblado, que agarra la luz de arriba.
    enmascarado('m-hija-solapa', 'M-6 -127.6 Q1 -124.6 8 -127.6 L7 -124.4 Q1 -121.4 -5 -124.6 Z',
      forma('M-6 -127.6 Q1 -124.6 8 -127.6 L7 -124.4 Q1 -121.4 -5 -124.6 Z', C.clara) + nube(1, -124, 6, 1.4, C.media, 's', 0.7)),
  );
}

/** La pollera acampanada, del talle al ruedo: el viento la empuja para el muelle, que queda atrás. */
export const POLLERA: readonly P[] = [
  [-7.8, -93], [-10.4, -84], [-14.6, -70], [-19.8, -56], [-25, -44.4], [-21.6, -42.2], [-17.4, -43.8], [-13, -41.2], [-8.4, -42.6], [-3, -40.4],
  [2.6, -41.8], [8, -40], [13, -41.6], [17.6, -40.6], [15.4, -54], [12.6, -68], [10.4, -82], [8.8, -93],
];

function pollera(): string {
  const d = curva(POLLERA);
  // Las tablas de la campana: cada una con su lomo que agarra la luz y su fondo hondo.
  let tablas = '';
  for (const [x0, x1, k] of [[-4, -21, 1], [0, -12, 0.8], [3, -2, 0.9], [6, 9, 0.8], [8, 15, 0.7]] as const) {
    tablas += nube((x0 + x1) / 2, -66, 1.6, 26, C.honda, 's', 0.55 * k, (x1 - x0) * 1.2) + nube((x0 + x1) / 2 + 2.4, -64, 1.4, 22, C.clara, 's', 0.55 * k, (x1 - x0) * 1.2);
  }
  return conGrano(
    enmascarado('m-hija-pollera', d,
      forma(d, C.media) +
      nube(-6, -78, 9, 12, C.gris, 'm', 0.9) +
      tablas +
      nube(13, -60, 6, 20, C.honda, 'm', 0.85) +
      nube(16, -52, 2, 12, C.negro, 's', 0.45) +
      nube(-16, -60, 5, 14, C.clara, 'm', 0.55) +
      // El ruedo, que ondea: lo de adentro de la campana asoma oscuro.
      nube(-4, -42, 22, 2.6, C.honda, 's', 0.75) +
      nube(-21, -46, 5, 4, C.clara, 's', 0.4) +
      luces(-24, 17, -93, -40, 1.2)),
  );
}

/** Las piernas con las medias y los zapatos de taco, quietas: el viento no las mueve. */
function piernas(): string {
  const pierna = (cadera: P, rodilla: P, tobillo: P, id: string, k: number): string => {
    const muslo = curva(miembro(cadera, rodilla, 7, 5.2, 0.6));
    const pantorrilla = curva(miembro(rodilla, tobillo, 5.2, 3, 1.4));
    const sil = `${muslo} ${pantorrilla}`;
    return enmascarado(id, sil,
      forma(muslo, C.gris) + forma(pantorrilla, C.gris) +
      // Las medias de nailon: un brillo largo en la canilla y la sombra del lado de atrás.
      nube(rodilla[0] + 1.6, (rodilla[1] + tobillo[1]) / 2, 1.1, 9, C.clara, 's', 0.85 * k) +
      nube(rodilla[0] - 1.8, (rodilla[1] + tobillo[1]) / 2 + 2, 1.6, 10, C.honda, 's', 0.7) +
      nube(rodilla[0], rodilla[1] - 4, 3, 5, C.honda, 's', 0.5) +
      // La costura de la media, atrás, como en las fotonovelas.
      trazo(`M${f(rodilla[0] - 1.2)} ${f(rodilla[1] - 3)} Q${f(rodilla[0] - 1.6)} ${f((rodilla[1] + tobillo[1]) / 2)} ${f(tobillo[0] - 0.8)} ${f(tobillo[1])}`, C.honda, 0.4, 0.7));
  };
  const zapato = (talon: P, punta: P, id: string, k: number): string => {
    const [tx, ty] = talon;
    const [px, py] = punta;
    const z: P[] = [[tx - 1.4, ty - 4.8], [tx + 3, ty - 5.2], [px - 3, py - 3.2], [px + 0.6, py - 1.2], [px, py], [tx + 2.4, py - 0.4], [tx + 1.2, ty - 1.4], [tx - 0.4, ty]];
    const dz = curva(z);
    return enmascarado(id, dz,
      forma(dz, C.pelo) +
      nube((tx + px) / 2, ty - 4, 4, 1.2, C.media, 's', 0.65 * k) +
      nube(px - 1, py - 2, 1.4, 0.8, C.luz, 'xs', 0.55 * k)) +
      // El taco fino.
      forma(`M${f(tx - 0.2)} ${f(ty - 1.6)} L${f(tx + 1.2)} ${f(ty - 1.6)} L${f(tx + 0.6)} ${f(ty)} L${f(tx - 0.2)} ${f(ty)} Z`, C.pelo);
  };
  return conGrano(
    // La de allá, más oscura.
    pierna([5.8, -47], [6.2, -25], [7.4, -5.4], 'm-hija-pierna-2', 0.5) +
    zapato([5.4, 0], [14.6, 0], 'm-hija-zapato-2', 0.6) +
    pierna([-5.4, -47], [-5.8, -25], [-4.4, -5.6], 'm-hija-pierna-1', 1) +
    zapato([-7, 0], [2.8, 0], 'm-hija-zapato-1', 1) +
    // La sombra de los dos pies en la cubierta.
    nube(2, 0.6, 14, 1.4, C.negro, 's', 0.55),
  );
}

/* ------------------------------------------------------------------
   El brazo del tubo: la manga del saquito y la mano
   ------------------------------------------------------------------ */

const [HX, HY] = A.hombro;
const L = A.largos;

/** El brazo de arriba, colgando del hombro: la manga. */
function brazoDeArriba(): string {
  const sil = curva(miembro([HX, HY - 2], [HX, HY + L.brazo + 1.6], 8, 6.4, 0.4));
  return conGrano(
    enmascarado('m-hija-brazo', sil,
      forma(sil, C.gris) +
      nube(HX - 2.4, HY + L.brazo / 2, 2, L.brazo * 0.5, C.clara, 'm', 0.85) +
      nube(HX + 2.6, HY + L.brazo / 2, 2.2, L.brazo * 0.55, C.honda, 'm', 0.7) +
      nube(HX - 3.4, HY + 6, 1.4, 6, C.sodio, 's', 0.3) +
      trazo(`M${f(HX - 2)} ${f(HY + L.brazo - 2)} Q${f(HX)} ${f(HY + L.brazo)} ${f(HX + 2.6)} ${f(HY + L.brazo - 3)}`, C.honda, 0.6, 0.6)),
  );
}

/**
 * El antebrazo, con la mano: el puño del saquito, la muñeca fina y los dedos largos que se cierran
 * sobre el tubo, como los de la mujer de la tapa, que lo aprieta. Se dibuja colgando; la isla lo
 * dobla en el codo.
 */
function antebrazo(): string {
  const codo: P = [HX, HY + L.brazo];
  const mano: P = [HX, codo[1] + L.antebrazo];
  const manga = curva(miembro([HX, codo[1] - 2], [HX, codo[1] + 11], 6.4, 5.8, 0.2));
  const muneca = curva(miembro([HX, codo[1] + 10], [HX, mano[1] - 2], 3.6, 3, 0.4));
  // La mano: el dorso, con los nudillos para afuera, y cuatro dedos que abrazan algo.
  const dorso = curva([[HX - 2.4, mano[1] - 3.6], [HX + 2.4, mano[1] - 3.8], [HX + 3.2, mano[1]], [HX + 2.6, mano[1] + 2.8], [HX - 1.6, mano[1] + 3.4], [HX - 3, mano[1]]]);
  const dedos = [0, 1, 2, 3].map((i) => {
    const y = mano[1] - 1.4 + i * 1.5;
    return trazo(`M${f(HX + 2.2)} ${f(y)} Q${f(HX + 4.8)} ${f(y + 0.4)} ${f(HX + 4)} ${f(y + 1.6)}`, C.clara, 1.25, 1) + trazo(`M${f(HX + 2.6)} ${f(y + 0.7)} Q${f(HX + 4.4)} ${f(y + 1)} ${f(HX + 3.8)} ${f(y + 1.8)}`, C.honda, 0.35, 0.6);
  }).join('');
  return conGrano(
    enmascarado('m-hija-muneca', muneca, forma(muneca, C.clara) + nube(HX + 1.2, codo[1] + 14, 1.2, 5, C.honda, 's', 0.6) + nube(HX - 1, codo[1] + 13, 1, 4, C.luz, 's', 0.5)) +
    enmascarado('m-hija-manga', manga,
      forma(manga, C.gris) + nube(HX - 2, codo[1] + 4, 2, 6, C.clara, 's', 0.8) + nube(HX + 2.2, codo[1] + 5, 2, 7, C.honda, 's', 0.7) +
      trazo(`M${f(HX - 3)} ${f(codo[1] + 10)} L${f(HX + 3)} ${f(codo[1] + 10.4)}`, C.honda, 0.8, 0.8)) +
    enmascarado('m-hija-mano', dorso,
      forma(dorso, C.clara) + nube(HX - 1, mano[1] - 1, 2, 2.4, C.luz, 's', 0.9) + nube(HX + 1.6, mano[1] + 2, 2, 1.6, C.media, 's', 0.7) +
      [-1.2, 0.4, 2].map((dx) => nube(HX + dx, mano[1] - 3, 0.6, 0.5, C.luz, 'xs', 0.8)).join('')) +
    dedos,
  );
}

/* ------------------------------------------------------------------
   El tubo: el único color
   ------------------------------------------------------------------ */

/** El tubo de baquelita, con el medio en el (0, 0) y a lo largo del eje x: el auricular atrás, el micrófono adelante. */
function tubo(): string {
  const l = TUBO_LARGO;
  const cuerpo = `M${f(-l + 1)} -2.2 Q0 -3.6 ${f(l - 1)} -2.2 L${f(l - 1)} 1.2 Q0 -0.2 ${f(-l + 1)} 1.2 Z`;
  const copa = (x: number, lado: -1 | 1): string => `M${f(x - 3.6)} -2.6 Q${f(x)} -4.4 ${f(x + 3.6)} -2.6 L${f(x + 3)} ${f(2.6 + lado * 0)} Q${f(x)} 4.6 ${f(x - 3)} 2.6 Z`;
  const [a, b] = [copa(-l, -1), copa(l, 1)];
  return conGrano(
    enmascarado('m-hija-tubo', `${cuerpo} ${a} ${b}`,
      forma(cuerpo, C.tubo) + forma(a, C.tubo) + forma(b, C.tubo) +
      // La baquelita brilla: una raya dura arriba, como el tubo de la tapa, y lo hondo abajo.
      nube(0, -2.4, l * 0.8, 0.8, C.tuboLuz, 'xs', 0.95) +
      nube(-l, -2, 2.4, 1, C.tuboLuz, 'xs', 0.8) +
      nube(l, -1.8, 2.4, 1, C.tuboLuz, 'xs', 0.7) +
      nube(0, 1.6, l, 1.6, C.tuboHondo, 's', 0.85) +
      nube(-l, 2.8, 3, 1.4, C.tuboHondo, 's', 0.9) +
      nube(l, 2.8, 3, 1.4, C.tuboHondo, 's', 0.9)),
  );
}

/* ------------------------------------------------------------------
   La cabeza: de perfil, mirando el río; y vuelta, mirándote
   ------------------------------------------------------------------ */

/** El perfil: la frente, la nariz chica y respingada, la boca, la pera, y la nuca bajo el pelo. */
export const PERFIL: readonly P[] = [
  [3, -156.4], [9.6, -154.2], [13, -150], [13.6, -147.6], [14.4, -145.4], [16, -142.2], [14.8, -141.4], [14.8, -139.6], [15.2, -138.2], [14.4, -137],
  [14.8, -135.8], [13.8, -134], [12.6, -132.2], [9.6, -131.4], [6.8, -131], [5.6, -127.6], [-0.6, -128.4], [-4.6, -134], [-6, -142], [-4.6, -150.6],
];

/** El pelo, de perfil: la melena ondulada que cae a la nuca y vuela para atrás. */
export const PELO: readonly P[] = [
  [1, -158.2], [8.6, -156.6], [12.6, -152.4], [12, -149.6], [8.6, -151], [4.6, -150.2], [1.4, -147], [0.4, -142.4], [1.8, -138.6], [-0.4, -134.6],
  [-3.4, -131.2], [-8.6, -129.8], [-13.2, -131.6], [-16.4, -135.8], [-15, -139], [-17.6, -143], [-14.6, -147.2], [-15.6, -151.4], [-11, -155.6], [-5.6, -158.2],
];

const O = A.ojo;

/** El ojo de perfil, del que se ve la almendra y las pestañas largas. La pupila no se mueve: mira al río. */
function ojoDePerfil(): string {
  const [x, y] = O.centro;
  const [rx, ry] = O.radio;
  return (
    nube(x - 0.6, y - 0.4, rx + 2.2, ry + 2, C.media, 's', 0.8) +
    forma(curva([[x - rx, y + 0.2], [x - 0.2, y - ry], [x + rx, y - 0.1], [x + 0.2, y + ry * 0.8]]), C.luz) +
    forma(elipse(x + rx * 0.45, y + 0.05, 0.9, 1.05), C.pelo) +
    // El delineado y las pestañas, pesadas, como los ojos de la tapa.
    trazo(`M${f(x - rx - 0.4)} ${f(y + 0.1)} Q${f(x)} ${f(y - ry * 1.5)} ${f(x + rx + 0.8)} ${f(y - 0.6)}`, C.pelo, 0.9, 1) +
    [0, 1, 2].map((i) => trazo(`M${f(x + 0.4 + i * 0.9)} ${f(y - ry + 0.1 + i * 0.1)} l${f(0.9 + i * 0.3)} ${f(-1.2 + i * 0.2)}`, C.pelo, 0.4, 0.9)).join('') +
    // La ceja fina y arqueada, de los cincuenta.
    trazo(`M${f(x - 2.6)} ${f(y - 3.2)} Q${f(x + 0.4)} ${f(y - 5)} ${f(x + 3)} ${f(y - 3.6)}`, C.pelo, 0.7, 0.9)
  );
}

function cabezaDePerfil(): string {
  const d = curva(PERFIL);
  const pelo = curva(PELO);
  const rnd = azar(911);
  const mechones = Array.from({ length: 46 }, () => {
    const y = -156 + rnd() * 24;
    const x = 4 - rnd() * 18;
    const l = 4 + rnd() * 6;
    const a = Math.PI * (0.95 + rnd() * 0.25);
    return trazo(`M${f(x)} ${f(y)} q${f(Math.cos(a) * l * 0.5)} ${f(Math.sin(a) * l * 0.5 - 1)} ${f(Math.cos(a) * l)} ${f(Math.sin(a) * l + 0.6)}`, rnd() < 0.3 ? C.gris : C.media, 0.35, 0.35 + rnd() * 0.3);
  }).join('');
  const cara = enmascarado('m-hija-perfil', d,
    forma(d, C.clara) +
    // La cara a contraluz: el farol le pega de atrás, así que la mejilla y la frente quedan a media luz
    // y lo único prendido es el filo del perfil, que le da la noche del río.
    nube(4, -142, 7, 9, C.media, 'm', 0.8) +
    nube(8, -138, 4, 4, C.gris, 's', 0.6) +
    nube(13.2, -147, 1.4, 6, C.luz, 's', 0.9) +
    nube(15, -141.6, 1, 1.4, C.luz, 'xs', 0.95) +
    nube(13.6, -136, 1.6, 3, C.luz, 's', 0.6) +
    nube(11, -132.4, 4, 1.4, C.honda, 's', 0.7) +
    nube(5, -130, 5, 2, C.honda, 's', 0.8) +
    nube(15.6, -146, 1, 6, C.tizaClara, 's', 0.35) +
    // La ventana de la nariz, y la boca: los labios del rosa del tubo, que es el único color.
    nube(14.4, -141, 0.8, 0.5, C.honda, 'xs', 0.9) +
    forma('M12.8 -137.9 Q14.6 -138.6 15.3 -137.7 Q14.6 -137.3 12.9 -137.4 Z', C.tubo) +
    forma('M12.9 -137.2 Q14.4 -137 14.9 -136.2 Q14 -135.4 12.8 -136.3 Z', C.tubo) +
    nube(14, -138.2, 0.9, 0.3, C.tuboLuz, 'xs', 0.8) +
    trazo('M12.6 -137.3 L15 -137.4', C.tuboHondo, 0.35, 0.9) +
    ojoDePerfil());
  const melena = enmascarado('m-hija-pelo', pelo,
    forma(pelo, C.pelo) +
    // El brillo de la melena, en ondas, como en la foto de una revista.
    nube(4, -155, 6, 1.6, C.gris, 's', 0.6) +
    nube(-8, -153, 5, 1.6, C.media, 's', 0.45) +
    nube(-12, -139, 2, 5, C.media, 's', 0.4) +
    nube(-6, -136, 4, 1.4, C.gris, 's', 0.35) +
    nube(-15, -145, 2, 5, C.sodio, 's', 0.35) +
    mechones);
  return conGrano(cara + melena);
}

/**
 * La cabeza vuelta: te mira por encima del hombro. Es la cara de la mujer del tubo, de tres cuartos,
 * con el ojo grande de pestañas pesadas y la boca rosa; el tubo ya lo bajó al pecho.
 */
export const VUELTA_SIL: readonly P[] = [
  [2, -156.4], [-6.4, -155], [-11, -151], [-12.4, -146.6], [-11.8, -143.4], [-13, -141.4], [-11.8, -140.6], [-11.6, -138.6], [-10.6, -137.2],
  [-10.8, -135.6], [-9, -133.2], [-6, -131.2], [-1.6, -130.8], [3, -129.6], [5.2, -127.6], [9.2, -129], [10.6, -135], [10.2, -143], [8, -151.6],
];

export const PELO_VUELTA: readonly P[] = [
  [2.6, -158.4], [-5.4, -157.2], [-11.6, -152.6], [-12.4, -148.4], [-9.4, -150], [-6, -150.8], [-2.4, -150.4], [1.6, -147.6], [4.4, -143.4],
  [6, -138], [6, -133.2], [8.6, -129.4], [13, -130.2], [16, -134], [15.4, -138.6], [17.6, -143], [15.2, -148], [15, -152.6], [10.6, -156.6],
];

function cabezaVuelta(): string {
  const d = curva(VUELTA_SIL);
  const pelo = curva(PELO_VUELTA);
  const [ox, oy] = A.ojoVuelta.centro;
  const [rx, ry] = A.ojoVuelta.radio;
  const rnd = azar(921);
  const mechones = Array.from({ length: 16 }, () => {
    const y = -157 + rnd() * 26;
    const x = 4 + rnd() * 10;
    const l = 4 + rnd() * 5;
    const a = Math.PI * (0.35 + rnd() * 0.3);
    return trazo(`M${f(x)} ${f(y)} q${f(Math.cos(a) * l * 0.5 + 1)} ${f(Math.sin(a) * l * 0.5)} ${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`, rnd() < 0.3 ? C.gris : C.media, 0.35, 0.35 + rnd() * 0.3);
  }).join('');
  // El otro ojo, el de allá, que asoma chico detrás de la nariz.
  const [o2x, o2y] = [ox + 7.4, oy - 0.2];
  const cara = enmascarado('m-hija-vuelta', d,
    forma(d, C.clara) +
    nube(4, -142, 6, 10, C.media, 'm', 0.75) +
    nube(-6, -139, 4, 6, C.luz, 'm', 0.7) +
    nube(-10.8, -146, 1.2, 4, C.luz, 's', 0.85) +
    nube(-2, -134, 6, 2.4, C.media, 's', 0.6) +
    nube(1, -131, 7, 1.6, C.honda, 's', 0.8) +
    // La nariz, que da a quien mira, y su sombra para el lado del pelo.
    nube(-9.4, -140.4, 1.6, 1, C.honda, 's', 0.7) +
    nube(-8.6, -143.4, 0.8, 3, C.luz, 'xs', 0.9) +
    // La boca, entreabierta y rosa: el único color, como el tubo. Te habla sin el tubo.
    forma('M-10.4 -135.8 Q-8.4 -137.4 -5.2 -136.2 Q-7.6 -135.6 -10.2 -135.5 Z', C.tubo) +
    forma('M-10.2 -135.2 Q-7.8 -135 -5.4 -135.8 Q-6.4 -133.4 -8.8 -133.6 Z', C.tubo) +
    trazo('M-10.2 -135.5 Q-7.6 -135.3 -5.3 -136', C.tuboHondo, 0.45, 0.95) +
    nube(-7.6, -134.2, 1, 0.4, C.tuboLuz, 'xs', 0.85) +
    // El ojo grande: la cuenca soplada, el blanco, el iris, el delineado grueso y las pestañas.
    nube(ox, oy - 0.4, rx + 3.4, ry + 3, C.media, 'm', 0.85) +
    nube(ox, oy - 2.6, rx + 1.6, 1.4, C.honda, 's', 0.6) +
    forma(curva([[ox - rx, oy + 0.2], [ox - 0.4, oy - ry], [ox + rx, oy - 0.2], [ox + 0.2, oy + ry * 0.9]]), C.luz) +
    `<circle cx="${f(ox - 0.5)}" cy="${f(oy + 0.1)}" r="${f(ry * 0.95)}" fill="${C.media}"/>` +
    `<circle cx="${f(ox - 0.5)}" cy="${f(oy + 0.1)}" r="${f(ry * 0.55)}" fill="${C.pelo}"/>` +
    `<circle cx="${f(ox - 0.9)}" cy="${f(oy - 0.4)}" r="0.35" fill="${C.luz}"/>` +
    trazo(`M${f(ox - rx - 0.6)} ${f(oy + 0.4)} Q${f(ox)} ${f(oy - ry * 1.9)} ${f(ox + rx + 1)} ${f(oy - 0.6)}`, C.pelo, 1.1, 1) +
    [-2, -0.8, 0.4, 1.6, 2.6].map((dx, i) => trazo(`M${f(ox + dx)} ${f(oy - ry - 0.2 + Math.abs(dx) * 0.1)} l${f(dx * 0.35 - 0.2)} ${f(-1.4 - (i % 2) * 0.3)}`, C.pelo, 0.45, 0.95)).join('') +
    trazo(`M${f(ox - 3.6)} ${f(oy - 4)} Q${f(ox)} ${f(oy - 6.2)} ${f(ox + 3.8)} ${f(oy - 4.4)}`, C.pelo, 0.8, 0.95) +
    // El de allá.
    nube(o2x, o2y, 2.6, 2.2, C.media, 's', 0.7) +
    forma(curva([[o2x - 1.4, o2y], [o2x, o2y - 0.9], [o2x + 1.2, o2y - 0.2], [o2x, o2y + 0.7]]), C.clara) +
    `<circle cx="${f(o2x - 0.3)}" cy="${f(o2y)}" r="0.6" fill="${C.pelo}"/>` +
    trazo(`M${f(o2x - 1.6)} ${f(o2y)} Q${f(o2x)} ${f(o2y - 1.6)} ${f(o2x + 1.6)} ${f(o2y - 0.4)}`, C.pelo, 0.6, 0.9) +
    trazo(`M${f(o2x - 1.4)} ${f(o2y - 3)} Q${f(o2x + 0.4)} ${f(o2y - 4)} ${f(o2x + 2)} ${f(o2y - 3)}`, C.pelo, 0.5, 0.8));
  const melena = enmascarado('m-hija-pelo-vuelta', pelo,
    forma(pelo, C.pelo) +
    nube(-3, -155, 7, 1.8, C.gris, 's', 0.6) +
    nube(10, -150, 4, 2, C.media, 's', 0.45) +
    nube(13, -138, 2, 5, C.sodio, 's', 0.35) +
    mechones);
  return conGrano(cara + melena);
}

/**
 * La melena que vuela para atrás, por detrás de la cabeza: ondas grandes y lisas, con el brillo de
 * la foto de revista en cada lomo. La isla la mece y, con la descarga, la eriza.
 */
function melenaAlViento(): string {
  const d = curva([
    [-1, -157], [-8, -158.6], [-14, -157], [-19, -153.4], [-24, -152.6], [-28, -149], [-27, -145.4], [-30.4, -142], [-28.6, -138.4],
    [-24, -138.8], [-20.6, -135.6], [-15, -133.4], [-9, -133.6], [-4, -137], [-1, -143],
  ]);
  // Los lomos de las ondas, que agarran la luz: curvas paralelas al vuelo del pelo.
  const lomos = [
    ['M-3 -155 Q-10 -157.4 -16 -154.6 Q-21 -151.6 -26 -150.4', 1.4, 0.55],
    ['M-5 -147 Q-12 -149 -18 -146.4 Q-23 -144 -28.6 -142.4', 1.2, 0.4],
    ['M-6 -139.6 Q-12 -140.4 -17 -138.4 Q-21 -137.4 -25 -139', 1, 0.3],
  ] as const;
  const rnd = azar(931);
  const hebras = Array.from({ length: 12 }, () => {
    const y = -154 + rnd() * 18;
    const l = 10 + rnd() * 8;
    return trazo(`M${f(-4 - rnd() * 4)} ${f(y)} q${f(-l * 0.5)} ${f(-2 + rnd() * 1.4)} ${f(-l)} ${f(rnd() * 2)}`, C.media, 0.3, 0.25 + rnd() * 0.2);
  }).join('');
  return conGrano(
    enmascarado('m-hija-melena', d,
      forma(d, C.pelo) +
      lomos.map(([q, ancho, o]) => `<g filter="url(#soplo-xs)">${trazo(q, C.gris, ancho, o)}</g>`).join('') +
      nube(-26, -146, 4, 5, C.sodio, 's', 0.3) +
      nube(-10, -136, 6, 2, C.negro, 's', 0.5) +
      hebras),
  );
}

/* ------------------------------------------------------------------
   El pañuelo, la valija y la descarga
   ------------------------------------------------------------------ */

/**
 * Un tramo del pañuelo de gasa, de (0, 0) a (−tramo, 0): la isla los cuelga uno del otro. Cada tramo
 * es una S de tela, con el doblez que agarra la luz y el revés en la sombra; el último se deshilacha.
 */
function tramoDePanuelo(n: 1 | 2 | 3): string {
  const l = A.tramo + 1;
  const [a0, a1] = [[6, 5], [5, 4], [4, 1.8]][n - 1]!;
  const ola = [1.4, 1.8, 2.2][n - 1]!;
  const d = curva([
    [1, -a0 / 2], [-l * 0.3, -a0 / 2 - ola], [-l * 0.7, -a1 / 2 + ola * 0.6], [-l, -a1 / 2],
    [-l, a1 / 2], [-l * 0.7, a1 / 2 + ola * 0.6], [-l * 0.3, a0 / 2 - ola], [1, a0 / 2],
  ]);
  return conGrano(
    enmascarado(`m-hija-panuelo-${n}`, d,
      forma(d, C.clara, 0.92) +
      nube(-l * 0.3, -ola - 0.6, l * 0.25, 0.9, C.luz, 's', 0.9) +
      nube(-l * 0.7, ola * 0.6 + 0.8, l * 0.25, 1, C.media, 's', 0.8) +
      trazo(`M0 0 Q${f(-l * 0.3)} ${f(-ola)} ${f(-l * 0.5)} 0 Q${f(-l * 0.7)} ${f(ola * 0.6)} ${f(-l)} 0`, C.gris, 0.4, 0.55) +
      nube(-l * 0.2, 0, 2, 1.6, C.sodio, 's', 0.25)) +
    (n === 3 ? [0, 1, 2, 3].map((i) => trazo(`M${f(-l)} ${f(-0.6 + i * 0.4)} l${f(-1.2 - (i % 2) * 0.8)} ${f(-0.3 + i * 0.3)}`, C.clara, 0.3, 0.7)).join('') : ''),
  );
}

/** El nudo del pañuelo en el cuello. */
function nudo(): string {
  const [x, y] = A.nudo;
  return conGrano(forma(elipse(x, y, 2.6, 1.8), C.clara) + nube(x, y + 0.6, 2, 1, C.media, 's', 0.8) + nube(x - 0.6, y - 0.6, 1.2, 0.6, C.luz, 'xs', 0.8));
}

/** La valija de cartón prensado, parada al lado de los zapatos, con las correas y la manija. */
function valija(): string {
  const d = 'M15.6 -1 L15 -18 Q15 -19.6 16.6 -19.6 L33 -19.8 Q34.6 -19.8 34.6 -18.2 L34.4 -1 Q34.4 0.2 33 0.2 L17 0.2 Q15.6 0.2 15.6 -1 Z';
  return conGrano(
    nube(25, 0.6, 12, 1.6, C.negro, 's', 0.6) +
    enmascarado('m-hija-valija', d,
      forma(d, C.media) +
      nube(20, -10, 5, 9, C.gris, 'm', 0.8) +
      nube(31, -10, 3, 10, C.honda, 'm', 0.7) +
      nube(17, -12, 2, 8, C.sodio, 's', 0.35) +
      // Las dos correas y las esquineras de metal.
      forma('M19.4 -19.6 L21 -19.6 L21 0.2 L19.4 0.2 Z', C.honda, 0.85) + forma('M28.6 -19.8 L30.2 -19.8 L30.2 0.2 L28.6 0.2 Z', C.honda, 0.85) +
      [[16, -18.8], [33.6, -18.8], [16, -0.6], [33.6, -0.6]].map(([x, y]) => forma(elipse(x!, y!, 1.4, 1.2), C.clara, 0.8)).join('') +
      // La etiqueta del viaje, del único color.
      forma('M23.4 -14.6 L27 -14.4 L26.8 -11.2 L23.2 -11.4 Z', C.tubo, 0.85) + nube(25, -13.4, 1.4, 0.6, C.tuboLuz, 'xs', 0.6)) +
    // La manija.
    trazo('M21.6 -19.8 Q22 -23.4 25 -23.4 Q28 -23.4 28.4 -19.8', C.honda, 1.4, 1) + trazo('M22 -20 Q22.4 -22.8 25 -22.8', C.clara, 0.4, 0.6),
  );
}

/**
 * El pelo parado por la estática, cuando le llega la descarga: mechones duros que salen de la cabeza
 * para todos lados, como en las historietas. Va encima de la melena y lo prende la isla.
 */
function erizo(): string {
  const [cx, cy] = [1, -145];
  const rnd = azar(941);
  let mechas = '';
  let estatica = '';
  for (let i = 0; i < 24; i++) {
    const a = Math.PI * (0.8 + (i / 23) * 1.35) + (rnd() - 0.5) * 0.12;
    const r0 = 8 + rnd() * 2;
    const l = 11 + rnd() * 9;
    const [x0, y0] = [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 1.05];
    const [x1, y1] = [cx + Math.cos(a) * (r0 + l), cy + Math.sin(a) * (r0 + l) * 1.05];
    const q = (rnd() - 0.5) * 3;
    const [nx, ny] = [-Math.sin(a) * 1.5, Math.cos(a) * 1.5];
    const d = `M${f(x0 + nx)} ${f(y0 + ny)} Q${f((x0 + x1) / 2 + q)} ${f((y0 + y1) / 2 - q)} ${f(x1)} ${f(y1)} Q${f((x0 + x1) / 2 + q * 0.6)} ${f((y0 + y1) / 2 - q * 0.6)} ${f(x0 - nx)} ${f(y0 - ny)} Z`;
    // Cada mechón parado agarra la luz en el lomo, como el pelo de la foto.
    mechas += forma(d, C.pelo) + trazo(`M${f(x0 + nx * 0.4)} ${f(y0 + ny * 0.4)} Q${f((x0 + x1) / 2 + q * 0.8)} ${f((y0 + y1) / 2 - q * 0.8)} ${f(x1)} ${f(y1)}`, C.gris, 0.5, 0.8);
    // Entre las puntas, la estática: rayitas del rosa del tubo.
    if (i % 4 === 1) {
      const [sx, sy] = [cx + Math.cos(a + 0.06) * (r0 + l + 2), cy + Math.sin(a + 0.06) * (r0 + l + 2)];
      estatica += trazo(`M${f(sx)} ${f(sy)} l${f(Math.cos(a) * 2.4 + 1)} ${f(Math.sin(a) * 2.4 - 1)} l${f(-1.2)} ${f(1)} l${f(Math.cos(a) * 2)} ${f(Math.sin(a) * 2)}`, C.tuboLuz, 0.6, 0.95);
    }
  }
  return conGrano(nube(cx - 2, cy - 8, 16, 12, C.tubo, 'l', 0.35) + mechas) + `<g filter="url(#soplo-xs)">${estatica}</g>` + estatica;
}

/** La descarga: una chispa rosa que corre por el cable, con su halo. Es luz: la página la suma. */
function chispa(): string {
  const rayo = (g: number): string => `<g transform="rotate(${g})"><path d="M-0.4 -9 L1.4 -3.4 L-0.4 -2.8 L2 4 L-1 -1.6 L0.8 -2.2 Z" fill="${C.luz}"/></g>`;
  return nube(0, 0, 9, 9, C.tubo, 'm', 0.95) + nube(0, 0, 4.6, 4.6, C.tuboLuz, 's', 1) + rayo(0) + rayo(120) + rayo(240) + nube(0, 0, 1.8, 1.8, C.luz, 'xs', 1);
}

/** La luz de la descarga en la cara, cuando le llega: le prende la mejilla de rosa. */
function resplandor(): string {
  return nube(6, -140, 9, 9, C.tubo, 'm', 0.7) + nube(4, -142, 4, 4, C.tuboLuz, 's', 0.6);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/**
 * La densidad la pide la ficha: el retrato se ve a unos 3 px de pantalla por unidad del recinto y la
 * hija va a 0,42 de su medida, así que en un teléfono de pantalla triple el aerógrafo necesita casi
 * cuatro píxeles por unidad del títere para no deshacerse.
 */
const D = 4;
const Q = 90;

export const PIEZAS_HIJA: readonly Pieza[] = [
  { nombre: 'hija-melena', caja: [-36, -164, 40, 36], dibujo: melenaAlViento(), densidad: D, calidad: Q },
  { nombre: 'hija-piernas', caja: [-12, -50, 30, 53], dibujo: piernas(), densidad: D, calidad: Q },
  { nombre: 'hija-valija', caja: [12, -26, 26, 29], dibujo: valija(), densidad: D, calidad: Q },
  { nombre: 'hija-pollera', caja: [-28, -97, 50, 60], dibujo: pollera(), densidad: D, calidad: Q },
  { nombre: 'hija-torso', caja: [-16, -132, 32, 47], dibujo: torso(), densidad: D, calidad: Q },
  { nombre: 'hija-panuelo-1', caja: [-21, -7, 24, 14], dibujo: tramoDePanuelo(1), densidad: D, calidad: Q },
  { nombre: 'hija-panuelo-2', caja: [-21, -7, 24, 14], dibujo: tramoDePanuelo(2), densidad: D, calidad: Q },
  { nombre: 'hija-panuelo-3', caja: [-23, -7, 26, 14], dibujo: tramoDePanuelo(3), densidad: D, calidad: Q },
  { nombre: 'hija-nudo', caja: [-7, -133, 8, 8], dibujo: nudo(), densidad: D * 1.3 },
  { nombre: 'hija-cabeza', caja: [-21, -162, 40, 38], dibujo: cabezaDePerfil(), densidad: D * 1.5, calidad: Q },
  { nombre: 'hija-cabeza-vuelta', caja: [-17, -162, 38, 38], dibujo: cabezaVuelta(), densidad: D * 1.5, calidad: Q },
  { nombre: 'hija-tubo', caja: [-12, -6, 24, 12], dibujo: tubo(), densidad: D * 1.5 },
  { nombre: 'hija-brazo', caja: [HX - 7, HY - 8, 14, L.brazo + 14], dibujo: brazoDeArriba(), densidad: D, calidad: Q },
  { nombre: 'hija-antebrazo', caja: [HX - 6, HY + L.brazo - 6, 14, L.antebrazo + 12], dibujo: antebrazo(), densidad: D * 1.3, calidad: Q },
  { nombre: 'hija-erizo', caja: [-30, -178, 54, 52], dibujo: erizo(), densidad: D },
  { nombre: 'hija-chispa', caja: [-20, -20, 40, 40], dibujo: chispa(), densidad: 2.4 },
  { nombre: 'hija-resplandor', caja: [-12, -158, 34, 34], dibujo: resplandor(), densidad: 1.2 },
];

const img = imagenesDe(PIEZAS_HIJA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El párpado de cada cara: lo baja la isla para parpadear. */
function parpado(nombre: 'parpado' | 'parpado-vuelta', t: Readonly<Record<string, string>>): string {
  const { centro: [cx, cy], radio: [rx, ry] } = nombre === 'parpado' ? A.ojo : A.ojoVuelta;
  return `<ellipse data-parte="${nombre}" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx + 0.5)}" ry="${f(ry + 0.4)}" class="bt-hija-parpado" transform="${t[nombre]}"/>`;
}

/** Las ondas donde el cable se mete en el agua. */
function ondas(): string {
  const [x, y] = CABLE.agua;
  return `<g data-parte="ondas">` + [0, 1].map((i) => `<ellipse cx="${f(x)}" cy="${f(y + 1)}" rx="${f(5 + i * 5)}" ry="${f(1.2 + i * 1.1)}" class="bt-hija-onda" opacity="${f(0.7 - i * 0.3)}"/>`).join('') + `</g>`;
}

/** La hija armada con las marcas de un momento (`marcas`, `rig-hija.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o, d } = marcas(m);
  return (
    // El cable, lo primero: lo hundido, en el agua, y lo de afuera, que cuelga por delante del casco.
    `<path data-parte="hundido" d="${d.hundido}" class="bt-hija-hundido"/>` +
    ondas() +
    parte('pollera', img('hija-pollera'), t.pollera) +
    parte('piernas', img('hija-piernas')) +
    parte('valija', img('hija-valija')) +
    parte('torso',
      img('hija-torso') +
      [1, 2, 3].map((n) => parte(`panuelo-${n}`, img(`hija-panuelo-${n}`), t[`panuelo-${n}`])).join('') +
      img('hija-nudo'),
      t.torso) +
    parte('cabeza',
      parte('pelo', img('hija-melena'), t.pelo) +
      parte('erizo', img('hija-erizo'), '', o.erizo) +
      parte('perfil', img('hija-cabeza') + parpado('parpado', t), '', o.perfil) +
      parte('vuelta', img('hija-cabeza-vuelta') + parpado('parpado-vuelta', t), '', o.vuelta) +
      `<g data-parte="resplandor" class="bt-hija-resplandor" opacity="${o.resplandor}">${img('hija-resplandor')}</g>`,
      t.cabeza) +
    parte('tubo', img('hija-tubo'), t.tubo) +
    // El cable cuelga del micrófono por delante de ella, y se va por la baranda.
    `<path data-parte="cable" d="${d.cable}" class="bt-hija-cable"/>` +
    `<path data-parte="cable-luz" d="${d['cable-luz']}" class="bt-hija-cable-luz"/>` +
    parte('brazo', img('hija-brazo') + parte('antebrazo', img('hija-antebrazo'), t.antebrazo), t.brazo) +
    `<g data-parte="chispa" class="bt-hija-chispa" transform="${t.chispa ?? 'translate(0 0)'}" opacity="${o.chispa}">${img('hija-chispa')}</g>`
  );
}

/** La hija en cualquier momento, sin lo que la hace tocable: para el test y para el retrato. */
export function hijaEn(m: Momento = QUIETA): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: de perfil, con el tubo en la oreja, mirando el río. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--hija" data-id="la-hija-del-fletero" role="button" tabindex="0" aria-label="${nombres.get('la-hija-del-fletero') ?? 'La hija del fletero'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETA).transform.entero}">${armado(QUIETA)}</g>` +
    `</g>`
  );
}

/**
 * El retrato de la ficha: en la popa, con el tubo bajado, mirándote por encima del hombro. Va sobre su
 * pedazo de ferry y de noche (las capas del recinto, que la página ya cargó).
 */
export const RETRATO = (() => {
  // Con su pedazo de popa alrededor: la planchada a la izquierda y la cabina atrás. Así la ficha no
  // queda como una tira.
  const [x0, y0] = alRecinto([-96, -200]);
  const [x1, y1] = alRecinto([62, 30]);
  return { caja: [Math.round(x0), Math.round(y0), Math.round(x1 - x0), Math.round(y1 - y0)] as const };
})();
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('astillero-lejos') + fondo('astillero-piso') + hijaEn(VUELTA);
}

export const HIJA: Personaje = {
  id: 'la-hija-del-fletero',
  region: 'los-astilleros',
  ancla: LUGAR.x,
  piezas: PIEZAS_HIJA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
