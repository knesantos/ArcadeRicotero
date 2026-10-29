/**
 * Los números de la anguila (`D-73`, vigesimotercera vuelta): dónde se ahoga en el barro del bajo, cómo está
 * armada y cómo se pone. Los lee el dibujo (`arte-anguila.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/anguila.ts`), que se lleva esto y nada que dibuje.
 *
 * El cuerpo es una cadena de doce segmentos, de la nuca a la cola. Cada uno gira en su coyuntura y la
 * posición de cada coyuntura sale de sumar las de antes (cinemática directa): así el largo no cambia y las
 * coyunturas no se abren. La onda viaja de la cabeza a la cola (`sin(onda − k·i)`), y donde la onda baja
 * el segmento se hunde: el barro corta todo lo que queda abajo de su superficie.
 *
 * En el salto, el cuerpo sigue el camino de la cabeza: cada coyuntura está un poco más atrás en la misma
 * curva, y gira para donde va la curva ahí. Es un delfín de barro, no un vaivén.
 *
 * Dos sistemas de coordenadas:
 * - **El de la anguila**: el (0, 0) es la superficie del barro, en el medio del charco; arriba es negativo.
 *   La cabeza mira a la izquierda y la cola va para la derecha, para el lado del fuego. Está dibujada a
 *   una vez y media, y la escena la achica con `ANGUILA.escala`.
 * - **El del recinto** (el bajo, de −250 a 1200): en el rincón de adelante a la derecha, donde el agua da
 *   con el fuego, debajo de la silla que flota y delante de las sirenas.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde está el charco, y lo que mide. */
export const ANGUILA = { x: 1076, piso: 610, escala: 0.68 } as const;

/** El charco de barro: centro y radios, en las coordenadas de la anguila. */
export const CHARCO = { x: -44, y: 6, rx: 226, ry: 22 } as const;

/** Hasta dónde se ve la anguila para abajo: la superficie del barro, un poquito más abajo del cero. */
export const SUPERFICIE = 2;

/** Cuántos segmentos tiene el cuerpo, cuánto mide cada uno y qué tan grueso es en cada coyuntura. */
export const N = 12;
export const LARGO = 25;
export const grueso = (i: number): number => 30 - 21 * Math.pow(i / (N - 1), 1.25);

/** Cómo está armada, en las coordenadas de la anguila y en las de la cabeza. */
export const ANGUILA_ARMADO = {
  /** La nuca: de acá sale el primer segmento y gira la cabeza. */
  cuello: [-150, -10] as Punto,
  /** En las coordenadas de la cabeza (la nuca en el cero, el hocico para la izquierda). */
  ojo: [-36, -6] as Punto,
  /** La bisagra de la quijada, y la punta de la boca. */
  bisagra: [-24, 6] as Punto,
  boca: [-58, 6] as Punto,
  /** La agalla, que late; la aleta del pecho, que rema. */
  agalla: [-10, 2] as Punto,
  aleta: [-4, 10] as Punto,
  /** El pegote de barro, arriba de la cabeza. */
  pegote: [-30, -16] as Punto,
} as const;

/** El cuerpo quieto: los ángulos de cada segmento (grados; 0 es para la derecha, positivo baja). */
export const REPOSO: readonly number[] = [32, 14, 4, 0, 0, 0, 0, 0, -2, -6, -10, -14];

/** Las burbujas del barro, en la superficie: dónde nace cada una y lo grande que se hace. */
export const BURBUJAS: readonly (readonly [number, number, number])[] = [[-70, 4, 9], [30, 6, 7], [130, 3, 11]];

/** El salto: cuánto avanza para la izquierda y cuánto sube por encima del barro. */
export const SALTO = { largo: 140, alto: 94, base: 24, pendiente: 1.48, desde: 30, recorre: 450 } as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se corre (unidades, a la derecha) y cuánto sube del barro (negativo es hundirse). */
  x: number;
  alto: number;
  /** La fase de la onda (radianes) y su tamaño (grados). */
  onda: number;
  amp: number;
  /** El salto: 0 en el barro; de 0 a 1, cuánto recorrió la cabeza el arco. */
  salto: number;
  /** Cuánto levanta la cabeza sobre el primer segmento (grados). */
  cabeza: number;
  /** La quijada (0 cerrada, 1 boqueando abierta), la agalla (0 a 1) y la aleta del pecho (grados). */
  boca: number;
  agalla: number;
  aleta: number;
  /** Para dónde mira la pupila, asustada (unidades de la cabeza). */
  mira: readonly [number, number];
  /** El pegote de barro en la cabeza (0 a 1) y cuánto se le resbaló (0 a 1). */
  pegote: number;
  cae: number;
  /** Las tres burbujas del barro: cuánto crecieron (0 a 1) y su reventón (0 a 1). */
  burbujas: readonly [number, number, number];
  revienta: readonly [number, number, number];
  /** La burbuja grande que se le escapa (0 a 1, subiendo) y su reventón (0 a 1). */
  globo: number;
  plop: number;
  /** El barro que chorrea del cuerpo en el salto (0 a 1, cayendo). */
  chorreo: number;
  /** Las salpicaduras donde sale y donde entra (0 a 1). */
  salpica: readonly [number, number];
  /** El reflejo del fuego en el barro (0 a 1). */
  brasa: number;
}

/** La pose quieta, la del HTML: la cabeza afuera boqueando, el lomo asomando y dos burbujas que crecen. */
export const QUIETO: Momento = {
  x: 0,
  alto: 0,
  onda: 0,
  amp: 16,
  salto: 0,
  cabeza: -6,
  boca: 0.25,
  agalla: 0.4,
  aleta: 0,
  mira: [0, 0],
  pegote: 0,
  cae: 0,
  burbujas: [0.5, 0, 0.8],
  revienta: [0, 0, 0],
  globo: 0,
  plop: 0,
  chorreo: 0,
  salpica: [0, 0],
  brasa: 0.7,
};

/**
 * *"Un barro que asfixia esa anguila"*: el salto desesperado, con el cuerpo en arco afuera del barro, la boca
 * abierta y el barro chorreándole. Es el toque quieto y el retrato.
 */
export const TOCADA: Momento = {
  ...QUIETO,
  salto: 0.1,
  amp: 0,
  boca: 1,
  agalla: 1,
  aleta: -30,
  mira: [-1.4, -1],
  burbujas: [0, 0.6, 0],
  chorreo: 0.45,
  salpica: [0.8, 0],
  brasa: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

const rad = (g: number): number => (g * Math.PI) / 180;
const grados = (r: number): number => (r * 180) / Math.PI;

export const alRecinto = ([x, y]: Punto): Punto => [ANGUILA.x + x * ANGUILA.escala, ANGUILA.piso + y * ANGUILA.escala];

/** El camino del salto: la altura (negativa es arriba) a los `u` que avanzó para la izquierda, y su pendiente. */
function camino(u: number): { y: number; dy: number } {
  const { largo, alto, base, pendiente } = SALTO;
  if (u < 0) return { y: base - pendiente * u, dy: -pendiente };
  if (u > largo) return { y: base + pendiente * (u - largo), dy: pendiente };
  const a = (Math.PI * u) / largo;
  return { y: base - alto * Math.sin(a), dy: (-alto * Math.PI * Math.cos(a)) / largo };
}

/** La columna en el barro: los ángulos de la onda que viaja y la nuca. */
function enElBarro(m: Momento): { nuca: Punto; angulos: number[] } {
  const [cx, cy] = ANGUILA_ARMADO.cuello;
  const angulos = REPOSO.map((r, i) => r + m.amp * (0.35 + (0.65 * i) / (N - 1)) * Math.sin(m.onda - 0.8 * i));
  return { nuca: [cx + m.x, cy - m.alto], angulos };
}

/** La columna en el salto: cada coyuntura en el mismo camino, un poco más atrás que la de adelante. */
function enElSalto(s: number): { nuca: Punto; angulos: number[] } {
  const x0 = ANGUILA_ARMADO.cuello[0] + SALTO.desde;
  let u = SALTO.desde + s * SALTO.recorre;
  const nuca: Punto = [x0 - u, camino(u).y];
  const angulos: number[] = [];
  for (let i = 0; i < N; i++) {
    const { dy } = camino(u);
    angulos.push(grados(Math.atan2(-dy, 1)));
    u -= LARGO / Math.hypot(1, dy);
  }
  return { nuca, angulos };
}

/** La columna entera: la nuca, cada coyuntura (N + 1, la última es la punta de la cola) y cada ángulo. */
export function columna(m: Momento): { coyunturas: Punto[]; angulos: number[]; cabeza: number } {
  let { nuca, angulos } = enElBarro(m);
  if (m.salto > 0) {
    const s = enElSalto(Math.min(1, m.salto));
    // Arranca del barro sin salto: los primeros instantes del arco se mezclan con la pose de antes.
    const w = Math.min(1, m.salto / 0.1);
    nuca = [nuca[0] + (s.nuca[0] - nuca[0]) * w, nuca[1] + (s.nuca[1] - nuca[1]) * w];
    angulos = angulos.map((a, i) => a + (s.angulos[i]! - a) * w);
  }
  const coyunturas: Punto[] = [nuca];
  for (let i = 0; i < N; i++) {
    const [x, y] = coyunturas[i]!;
    coyunturas.push([x + LARGO * Math.cos(rad(angulos[i]!)), y + LARGO * Math.sin(rad(angulos[i]!))]);
  }
  return { coyunturas, angulos, cabeza: angulos[0]! + m.cabeza * (1 - Math.min(1, m.salto / 0.1)) };
}

/** Un punto de la cabeza, en las coordenadas de la anguila, para un momento. */
export function deLaCabeza(m: Momento, p: Punto): Punto {
  const { coyunturas, cabeza } = columna(m);
  const [nx, ny] = coyunturas[0]!;
  const [x, y] = rot(p, [0, 0], cabeza);
  return [nx + x, ny + y];
}

/** Dónde está la burbuja grande a los `g` (0 a 1) de haber salido de la boca. */
export function globoEn(m: Momento, g: number): Punto {
  const [bx, by] = deLaCabeza(m, ANGUILA_ARMADO.boca);
  return [bx - 8 * g, by - 6 - 46 * g];
}

/** Las gotas de barro que chorrean: de qué segmento cuelga cada una. */
export const GOTEAN = [1, 3, 5, 7, 9] as const;

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ANGUILA_ARMADO;
  const { coyunturas, angulos, cabeza } = columna(m);
  const [nx, ny] = coyunturas[0]!;
  const transform: Record<string, string> = {
    entero: `translate(${ANGUILA.x} ${ANGUILA.piso}) scale(${ANGUILA.escala})`,
    cabeza: `translate(${n2(nx)} ${n2(ny)}) rotate(${n2(cabeza)})`,
    quijada: `rotate(${n2(-30 * m.boca)} ${A.bisagra[0]} ${A.bisagra[1]})`,
    agalla: `translate(${A.agalla[0]} ${A.agalla[1]}) scale(${n2(1 + 0.4 * m.agalla)} ${n2(1 + 0.18 * m.agalla)}) translate(${-A.agalla[0]} ${-A.agalla[1]})`,
    aleta: `rotate(${n2(m.aleta)} ${A.aleta[0]} ${A.aleta[1]})`,
    pupila: `translate(${n2(m.mira[0])} ${n2(m.mira[1])})`,
    pegote: `translate(0 ${n2(m.cae * 16)})`,
  };
  const opacity: Record<string, string> = {
    pegote: n2(m.pegote * (1 - m.cae)),
    brasa: n2(m.brasa),
  };
  for (let i = 0; i < N; i++) {
    const [x, y] = coyunturas[i]!;
    transform[`seg-${i + 1}`] = `translate(${n2(x)} ${n2(y)}) rotate(${n2(angulos[i]!)})`;
  }
  BURBUJAS.forEach(([bx, by, r], i) => {
    const c = m.burbujas[i]!;
    const v = m.revienta[i]!;
    transform[`burbuja-${i + 1}`] = `translate(${bx} ${by}) scale(${n2(Math.max(0.01, c * r / 10))})`;
    opacity[`burbuja-${i + 1}`] = c > 0.02 ? '1' : '0';
    transform[`revienta-${i + 1}`] = `translate(${bx} ${n2(by - r * 0.4)}) scale(${n2((r / 10) * (0.6 + 0.8 * v))})`;
    opacity[`revienta-${i + 1}`] = n2(v > 0 ? 1 - v * v : 0);
  });
  const [gx, gy] = globoEn(m, m.globo);
  transform.globo = `translate(${n2(gx)} ${n2(gy)}) scale(${n2(0.3 + 0.9 * m.globo)})`;
  opacity.globo = m.globo > 0 && m.plop === 0 ? '1' : '0';
  const [px, py] = globoEn(m, 1);
  transform.plop = `translate(${n2(px)} ${n2(py)}) scale(${n2(0.8 + 0.9 * m.plop)})`;
  opacity.plop = n2(m.plop > 0 ? 1 - m.plop * m.plop : 0);
  GOTEAN.forEach((k, j) => {
    const [x, y] = coyunturas[k]!;
    const a = rad(angulos[k]!);
    // Cuelga de la panza del segmento y cae derecho, cada una a su ritmo.
    const panza: Punto = [x + (LARGO / 2) * Math.cos(a) - (grueso(k) / 2) * Math.sin(a), y + (LARGO / 2) * Math.sin(a) + (grueso(k) / 2) * Math.cos(a)];
    const c = Math.min(1, m.chorreo * (1 + (j % 3) * 0.25));
    transform[`gota-${j + 1}`] = `translate(${n2(panza[0])} ${n2(panza[1] + c * c * (50 + j * 8))}) scale(1 ${n2(1 + c)})`;
    opacity[`gota-${j + 1}`] = n2(m.chorreo > 0 ? 1 - c * c * 0.6 : 0);
  });
  // Las salpicaduras: donde sale del barro y donde vuelve a entrar.
  const salen: readonly Punto[] = [[ANGUILA_ARMADO.cuello[0] + SALTO.desde - 16, SUPERFICIE], [ANGUILA_ARMADO.cuello[0] + SALTO.desde - SALTO.largo + 16, SUPERFICIE]];
  salen.forEach(([x, y], j) => {
    const v = m.salpica[j]!;
    transform[`salpica-${j + 1}`] = `translate(${x} ${y}) scale(${n2(0.6 + 0.5 * v)} ${n2(0.2 + v)})`;
    opacity[`salpica-${j + 1}`] = n2(v > 0 ? Math.min(1, 3 * (1 - v) + 0.2) : 0);
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza, en el recinto. */
export const VERSO: Punto = alRecinto([-160, -120]);
