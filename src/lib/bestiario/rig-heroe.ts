/**
 * Los números del héroe del whisky (`D-73`, vigesimoctava vuelta): cómo está armado el camión, dónde se agarra cada
 * pieza y cómo se pone en cada momento. Los lee el dibujo (`arte-heroe.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/heroe.ts`), que se lleva esto y nada que dibuje.
 *
 * Es un fierro, como la Mariposa Pontiac: viaja adentro del `.cuerpo` del fierro de la ruta, que lo corre el tránsito,
 * y su (0, 0) es donde las ruedas tocan el carril, con la trompa para la derecha, como la imagen que reemplaza
 * (`ruta-camion`). Arriba es negativo.
 */

import type { P } from './trazos.ts';
import { FIERROS, RUTA } from './rig-entornos.ts';

export type Punto = P;

const ID = 'el-heroe-del-whisky';
/** El carril por donde pasa, en `y`. */
export const CARRIL = RUTA.carriles[FIERROS[ID].carril]!;

/** Cómo está armado, en las coordenadas del fierro. */
export const HEROE_ARMADO = {
  /** Las tres ruedas (dos atrás, una adelante, que es la de la cabina) y lo que miden. */
  ruedas: [[-92, -16], [-58, -16], [96, -16]] as readonly Punto[],
  radioRueda: 16,
  /** El cogote, de donde gira la cabeza, y el centro de la cabeza (la cara mira para arriba). */
  cuello: [-88, -62] as Punto,
  cabeza: [-101, -68] as Punto,
  /** La cadera: de acá se mece todo lo que va tirado en la caja. */
  cadera: [-36, -58] as Punto,
  /** El hombro del brazo que alcanza las estrellas y el del que sostiene la botella, y la muñeca de cada uno. */
  hombro: [-76, -64] as Punto,
  muneca: [-76, -106] as Punto,
  /** El gorro de papel: de donde se levanta. */
  gorro: [-104, -78] as Punto,
  /** El cuello del perro, la bisagra de la mandíbula, la cola y la trompa, de donde sale el ladrido. */
  perroCuello: [28, -74] as Punto,
  perroMandibula: [19, -83] as Punto,
  perroCola: [45, -48] as Punto,
  trompa: [5, -87] as Punto,
  /** La base de la varilla de las estrellas, en el techo de la cabina. */
  varilla: [82, -104] as Punto,
  /** De dónde cuelga cada estrella, en las coordenadas de la varilla sin torcer: la punta del hilo. */
  hilos: [[-70, -158], [-40, -148], [3, -131], [-98, -167]] as readonly Punto[],
  /** Cuánto mide cada estrella (el radio de la punta) y cuánto cuelga de su hilo. */
  estrellas: [11, 8.5, 7, 6.5] as readonly number[],
  cuelgan: [32, 25, 22, 25] as readonly number[],
  /** La boca del caño de escape, de donde sale el humo. */
  escape: [67, -128] as Punto,
  /** La guitarra-garrote apoyada contra la cabina: de dónde se apoya. */
  guitarra: [52, -34] as Punto,
  /** Dónde cuelga el bocadillo, sobre el carril: arriba de la varilla. */
  globo: -196,
} as const;

/** Cuánto sube el humo antes de irse (unidades). */
export const SUBE_HUMO = 38;

export interface Momento {
  /** El rebote del camión en el bache (−1 a 1). */
  bache: number;
  /** El giro de las ruedas, en grados. */
  giro: number;
  /** El balanceo de lo que va tirado en la caja (grados). */
  tumbo: number;
  /** La cabeza en el cogote (grados). */
  cabeza: number;
  /** El gorro de papel: lo que se corrió y lo que se torció (grados). */
  gorro: readonly [number, number, number];
  /** El ojo, que se abre abajo del gorro (0 cerrado, 1 abierto). */
  ojo: number;
  /** La botella: 0 sobre la panza, 1 en la boca. */
  botella: number;
  /** El brazo que alcanza: 0 colgando por el borde de la caja, 1 estirado hacia las estrellas. */
  alcanza: number;
  /** Los dedos de esa mano (0 abiertos, 1 cerrados en el aire). */
  dedos: number;
  /** El perro: cuánto salta, la cabeza (grados, positivo mira para arriba), la boca (0 a 1) y la cola (grados). */
  perro: { salto: number; cabeza: number; boca: number; cola: number };
  /** La varilla (grados) y cada estrella en su hilo (grados). */
  varilla: number;
  estrellas: readonly [number, number, number, number];
  /** Las dos bocanadas del escape, cada una en su fase (0 a 1). */
  humo: readonly [number, number];
  /** Las botellas vacías, que ruedan: cuánto se corrieron y se giraron. */
  vacias: readonly [number, number];
  /** El ladrido: cuánto se ven los arcos (0 a 1). */
  ladrido: number;
}

/** La pose quieta, la del HTML: tirado mirando las estrellas, con el gorro hasta las cejas y el perro mirando para arriba. */
export const QUIETO: Momento = {
  bache: 0,
  giro: 0,
  tumbo: 0,
  cabeza: 0,
  gorro: [0, 0, 0],
  ojo: 0,
  botella: 0,
  alcanza: 0,
  dedos: 0,
  perro: { salto: 0, cabeza: 12, boca: 0, cola: 0 },
  varilla: 0,
  estrellas: [0, 0, 0, 0],
  humo: [0.18, 0.62],
  vacias: [0, 0],
  ladrido: 0,
};

/**
 * *"El perro se hace notar"*: ladra con la boca abierta, parado sobre las patas de atrás, y el héroe se levanta el
 * gorro y lo mira. Es el toque quieto y el retrato.
 */
export const LADRA: Momento = {
  ...QUIETO,
  cabeza: -6,
  gorro: [-8, -20, -26],
  ojo: 1,
  alcanza: 0,
  perro: { salto: 9, cabeza: 30, boca: 1, cola: 18 },
  estrellas: [9, -12, 14, -9],
  varilla: -2,
  vacias: [7, 18],
  ladrido: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** La vuelta de cada hilo, en las coordenadas de la varilla. */
const girarEn = (a: number, [x, y]: Punto): string => `rotate(${n2(a)} ${x} ${y})`;

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = HEROE_ARMADO;
  const [hx, hy] = A.hombro;
  const [mx, my] = A.muneca;
  const [vx, vy] = A.varilla;
  const transform: Record<string, string> = {
    entero: `translate(0 ${n2(-1.4 * m.bache)})`,
    hombre: `rotate(${n2(m.tumbo)} ${A.cadera[0]} ${A.cadera[1]})`,
    cabeza: `rotate(${n2(m.cabeza)} ${A.cuello[0]} ${A.cuello[1]}) translate(${A.cuello[0]} ${A.cuello[1]}) scale(0.86) translate(${-A.cuello[0]} ${-A.cuello[1]})`,
    gorro: `translate(${n2(m.gorro[0])} ${n2(m.gorro[1])}) rotate(${n2(m.gorro[2])} ${A.gorro[0]} ${A.gorro[1]}) translate(${A.gorro[0]} ${A.gorro[1]}) scale(0.88) translate(${-A.gorro[0]} ${-A.gorro[1]})`,
    'brazo-botella': `rotate(${n2(-166 * m.botella)} ${hx + 2} ${hy + 2})`,
    // Colgando floja por el borde de la caja, con la mano abierta, hay 175 grados; estirado hacia arriba, 0.
    'brazo-alto': `rotate(${n2(175 - 175 * m.alcanza)} ${hx} ${hy})`,
    dedos: `rotate(${n2(64 * m.dedos)} ${mx} ${my + 4})`,
    perro: `translate(0 ${n2(-m.perro.salto)})`,
    'perro-cabeza': `rotate(${n2(m.perro.cabeza)} ${A.perroCuello[0]} ${A.perroCuello[1]})`,
    'perro-boca': `rotate(${n2(-28 * m.perro.boca)} ${A.perroMandibula[0]} ${A.perroMandibula[1]})`,
    'perro-cola': `rotate(${n2(m.perro.cola)} ${A.perroCola[0]} ${A.perroCola[1]})`,
    varilla: `rotate(${n2(m.varilla)} ${vx} ${vy})`,
    vacias: `translate(${n2(m.vacias[0])} 0) rotate(${n2(m.vacias[1])} -6 -36)`,
    guitarra: `rotate(${n2(-1.1 * m.tumbo)} ${A.guitarra[0]} ${A.guitarra[1]})`,
    ladrido: `translate(${A.trompa[0]} ${A.trompa[1]}) scale(${n2(0.7 + 0.5 * m.ladrido)}) translate(${-A.trompa[0]} ${-A.trompa[1]})`,
  };
  A.ruedas.forEach(([cx, cy], i) => (transform[`rueda-${i + 1}`] = `rotate(${n2(m.giro)} ${cx} ${cy})`));
  A.hilos.forEach((p, i) => (transform[`estrella-${i + 1}`] = girarEn(m.estrellas[i]!, p)));
  // El humo sube y se ensancha, y se va aclarando.
  const [ex, ey] = A.escape;
  m.humo.forEach((u, i) => {
    transform[`humo-${i + 1}`] = `translate(${n2(-u * 22)} ${n2(-u * SUBE_HUMO)}) translate(${ex} ${ey}) scale(${n2(0.5 + 1.1 * u)}) translate(${-ex} ${-ey})`;
  });
  const opacity: Record<string, string> = {
    ojo: n2(m.ojo),
    ladrido: n2(m.ladrido),
    'humo-1': n2(m.humo[0] < 0.15 ? m.humo[0] / 0.15 : (1 - m.humo[0]) / 0.85),
    'humo-2': n2(m.humo[1] < 0.15 ? m.humo[1] / 0.15 : (1 - m.humo[1]) / 0.85),
  };
  return { transform, opacity };
}

/** Dónde está la punta de cada hilo de una estrella, con la varilla torcida `g` grados: para el test y la mano. */
export function puntaDeLaVarilla(g: number, p: Punto): Punto {
  const a = (g * Math.PI) / 180;
  const [vx, vy] = HEROE_ARMADO.varilla;
  const [dx, dy] = [p[0] - vx, p[1] - vy];
  return [vx + dx * Math.cos(a) - dy * Math.sin(a), vy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/** La cabeza del héroe en el fierro, para que la Mariposa Pontiac lo mire (`rig-pontiac.ts`, `DE_LOS_OTROS`). */
export const CABEZA_DEL_HEROE: Punto = HEROE_ARMADO.cabeza;
