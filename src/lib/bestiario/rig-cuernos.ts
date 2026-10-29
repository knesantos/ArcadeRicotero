/**
 * Los números del diablo de muchos cuernos (`D-73`, vigesimocuarta vuelta): dónde recibe en el salón del
 * infierno, cómo está armado, adónde apunta el dedo cuando cuenta y cómo cuelga el monóculo cuando se le cae.
 * Los lee el dibujo (`arte-cuernos.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/cuernos.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del diablo**: el (0, 0) es el piso entre las pezuñas; arriba es negativo. Mira de frente, a quien
 *   llega. Está dibujado a dos veces, y la escena lo achica con `CUERNOS.escala`.
 * - **El del recinto** (900 × 640): parado a la izquierda de la puerta del salón (140 a 220), en la primera
 *   fila del damero, donde estaban sus ojos. La puerta le queda a la derecha, para el lado del convite.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde se para (el piso entre las pezuñas), lo que mide y el ancla del marco. */
export const CUERNOS = { x: 92, piso: 388, escala: 0.54 } as const;

/** El medio de la cabeza: de acá se miden los cuernos. */
const H: Punto = [0, -246];
const en = ([x, y]: Punto): Punto => [H[0] + x, H[1] + y];

/** Los cuernos, en el orden en que los cuenta: de izquierda a derecha de quien mira, y el de la pera al final. */
export const ORDEN = ['carnero-1', 'cabra', 'ciervo', 'unicornio', 'chivo', 'toro', 'carnero-2', 'pera'] as const;
export type Cuerno = (typeof ORDEN)[number];

/** Cómo está armado, en sus coordenadas. El brazo 1 es el de la izquierda de quien mira: el que cuenta. */
export const CUERNOS_ARMADO = {
  /** La cintura: de acá se dobla para la reverencia. */
  cintura: [0, -112] as Punto,
  /** De acá sale la cola, detrás de los faldones. */
  cadera: [10, -108] as Punto,
  hombros: [[-38, -194], [38, -194]] as readonly [Punto, Punto],
  codos: [[-46, -150], [46, -150]] as readonly [Punto, Punto],
  /** La punta del índice, con el brazo colgando: el dedo que cuenta. */
  dedos: [[-49, -98], [49, -98]] as readonly [Punto, Punto],
  cuello: [0, -206] as Punto,
  cabeza: H,
  /** Los ojos (el 2 lleva el monóculo) y su radio. */
  ojos: [en([-14, -4]), en([14, -4])] as readonly [Punto, Punto],
  radioOjo: 7,
  /** Las cejas: de acá se alzan. */
  cejas: [en([-15, -15]), en([15, -15])] as readonly [Punto, Punto],
  /** La boca. */
  boca: en([0, 22]),
  /** El ojal de la solapa, con el clavel: de acá cuelga el cordón del monóculo. */
  ojal: [18, -176] as Punto,
  /** Lo que mide el cordón, del ojal al monóculo colgado. */
  cordon: 44,
  /** Donde nace cada cuerno (de acá se menea) y un punto de su lomo, que es adonde apunta el dedo. */
  cuernos: {
    'carnero-1': { base: en([-30, -12]), lomo: en([-68, -20]) },
    cabra: { base: en([-18, -28]), lomo: en([-40, -76]) },
    ciervo: { base: en([-6, -34]), lomo: en([-18, -112]) },
    unicornio: { base: en([1, -36]), lomo: en([3, -84]) },
    chivo: { base: en([13, -33]), lomo: en([38, -62]) },
    toro: { base: en([24, -26]), lomo: en([72, -80]) },
    'carnero-2': { base: en([30, -12]), lomo: en([70, -18]) },
    pera: { base: en([3, 46]), lomo: en([22, 56]) },
  } as Readonly<Record<Cuerno, { base: Punto; lomo: Punto }>>,
  /** El brote: el cuerno que le sale cuando termina de contar, entre el unicornio y el del chivo. */
  brote: en([8, -38]),
  /** La galera colgada de la punta de la cabra y la ficha del guardarropa colgada del toro. */
  galera: en([-110, -102]),
  ficha: en([100, -66]),
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (de −1 a 1), la reverencia (0 a 1) y lo que se ladea el tronco (grados). */
  respira: number;
  reverencia: number;
  inclina: number;
  /** Lo que se ladea la cabeza en el cuello (grados) y el cabeceo (unidades). */
  ladea: number;
  cabeceo: readonly [number, number];
  /** Lo que gira cada brazo en el hombro y cada antebrazo en el codo (grados). */
  brazos: readonly [number, number];
  codos: readonly [number, number];
  /** Los párpados (0 abiertos, 1 cerrados), las pupilas corridas (unidades) y las cejas alzadas (0 a 1). */
  parpados: readonly [number, number];
  pupilas: readonly [P, P];
  cejas: readonly [number, number];
  /** La boca abierta del susto (0 a 1). */
  grito: number;
  /** Lo que se menea cada cuerno, en el orden de `ORDEN` (grados). */
  meneo: readonly number[];
  /** El brote: lo que asoma (0 a 1). */
  brote: number;
  /** La cola (grados). */
  cola: number;
  /** El monóculo: 0 puesto en el ojo, 1 colgando del cordón; y lo que se hamaca colgado (grados). */
  caida: number;
  vaiven: number;
  /** El reloj de bolsillo en la mano 2 (0 a 1). */
  reloj: number;
}

const QUIETOS = ORDEN.map(() => 0);

/** La pose quieta, la del HTML: de frente, con el monóculo puesto y la sonrisa de quien recibe. */
export const QUIETO: Momento = {
  respira: 0,
  reverencia: 0,
  inclina: 0,
  ladea: -3,
  cabeceo: [0, 0],
  brazos: [0, 0],
  codos: [0, 0],
  parpados: [0.22, 0.08],
  pupilas: [[0, 0], [0, 0]],
  cejas: [0, 0.3],
  grito: 0,
  meneo: QUIETOS,
  brote: 0,
  cola: 0,
  caida: 0,
  vaiven: 0,
  reloj: 0,
};

/* ------------------------------------------------------------------
   Los brazos: llevar la punta del dedo a un punto
   ------------------------------------------------------------------ */

const ang = ([x, y]: Punto): number => (Math.atan2(y, x) * 180) / Math.PI;
const norm = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;

/** La punta del dedo `n` con el brazo y el codo girados. */
export function dedoCon(brazo: number, codo: number, n: 0 | 1): Punto {
  const A = CUERNOS_ARMADO;
  const codoGirado = rot(A.codos[n], A.hombros[n], brazo);
  const dedo = rot(A.dedos[n], A.hombros[n], brazo);
  return rot(dedo, codoGirado, codo);
}

/**
 * Lo que tienen que girar el brazo y el codo `n` para que la punta del dedo llegue a `p` (o lo más cerca que
 * dé el brazo), con el codo para afuera. Es la cuenta de dos tramos: el triángulo hombro, codo, dedo.
 */
export function alcanzar(n: 0 | 1, p: Punto): [number, number] {
  const A = CUERNOS_ARMADO;
  const S = A.hombros[n];
  const E = A.codos[n];
  const T = A.dedos[n];
  const l1 = Math.hypot(E[0] - S[0], E[1] - S[1]);
  const l2 = Math.hypot(T[0] - E[0], T[1] - E[1]);
  const dx = p[0] - S[0];
  const dy = p[1] - S[1];
  const d = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.01, Math.hypot(dx, dy)));
  const alfa = (Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)) * 180) / Math.PI;
  const hacia = ang([dx, dy]);
  // De los dos codos posibles, el que queda más para afuera del cuerpo.
  const afuera = n === 0 ? -1 : 1;
  const candidatos = [hacia + alfa, hacia - alfa].map((phi) => {
    const r = (phi * Math.PI) / 180;
    return { phi, x: S[0] + l1 * Math.cos(r), y: S[1] + l1 * Math.sin(r) };
  });
  const c = candidatos.sort((a, b) => b.x * afuera - a.x * afuera)[0]!;
  const brazo = norm(c.phi - ang([E[0] - S[0], E[1] - S[1]]));
  const objetivo: Punto = [S[0] + dx * (d / Math.hypot(dx, dy)), S[1] + dy * (d / Math.hypot(dx, dy))];
  const antebrazo = ang([objetivo[0] - c.x, objetivo[1] - c.y]);
  const codo = norm(antebrazo - ang([T[0] - E[0], T[1] - E[1]]) - brazo);
  return [brazo, codo];
}

/**
 * Lo que gira el brazo `n` para que el dedo, estirado, apunte a `p` desde lejos: el brazo entero en la línea
 * del hombro al punto, con el codo apenas doblado. Es como se cuentan los cuernos que la mano no alcanza.
 */
export function apuntar(n: 0 | 1, p: Punto): [number, number] {
  const A = CUERNOS_ARMADO;
  const S = A.hombros[n];
  const T = A.dedos[n];
  const reposo = ang([T[0] - S[0], T[1] - S[1]]);
  return [norm(ang([p[0] - S[0], p[1] - S[1]]) - reposo), 0];
}

/** Adónde apunta cada cuerno quien cuenta: el brazo 1 los de la izquierda, el 2 los de la derecha y la pera. */
export const CON_QUE_MANO: Readonly<Record<Cuerno, 0 | 1>> = {
  'carnero-1': 0,
  cabra: 0,
  ciervo: 0,
  unicornio: 0,
  chivo: 1,
  toro: 1,
  'carnero-2': 1,
  pera: 1,
};

/**
 * Adónde lleva la punta del dedo para contar cada cuerno: al lado del cuerno y afuera de la cara, así la
 * mano no le tapa los ojos. Al de la pera lo toca.
 */
export const DEDO_EN: Readonly<Record<Cuerno, Punto>> = {
  'carnero-1': [-76, -262],
  cabra: [-60, -286],
  ciervo: [-42, -287],
  unicornio: [-26, -287],
  chivo: [40, -290],
  toro: [70, -280],
  'carnero-2': [78, -262],
  pera: [30, -186],
};

/** La pose de un brazo para contar un cuerno. */
export function contando(c: Cuerno): [number, number] {
  return alcanzar(CON_QUE_MANO[c], DEDO_EN[c]);
}

/**
 * *"Para cerrar un ojo y ver cuántos cuernos tiene el diablo"*: el ojo sin monóculo cerrado, el dedo apuntando
 * a los cuernos y el que no se deja contar recién salido. Es el toque quieto y el retrato.
 */
export const CUENTA: Momento = {
  ...QUIETO,
  ladea: 6,
  brazos: [contando('ciervo')[0], 0],
  codos: [contando('ciervo')[1], 0],
  parpados: [1, 0],
  pupilas: [[0, 0], [-1, -3]],
  cejas: [0, 1],
  meneo: ORDEN.map((c) => (c === 'ciervo' ? 8 : 0)),
  brote: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [CUERNOS.x + x * CUERNOS.escala, CUERNOS.piso + y * CUERNOS.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Lo que se agacha el tronco con la reverencia y la respiración: la escala vertical del cuerpo. */
const alto = (m: Momento): number => 1 + 0.012 * m.respira - 0.16 * m.reverencia;

/** Lo que baja el hombro (y la cabeza) cuando el cuerpo se agacha. */
function baja(m: Momento): number {
  const A = CUERNOS_ARMADO;
  return (A.hombros[0][1] - A.cintura[1]) * (alto(m) - 1);
}

/** La cabeza: lo que se corre, se ladea y se agranda con la reverencia (se viene para adelante). */
function deLaCabeza(m: Momento): { tx: number; ty: number; giro: number; escala: number } {
  return { tx: m.cabeceo[0], ty: baja(m) * 1.2 + m.cabeceo[1], giro: m.ladea, escala: 1 + 0.06 * m.reverencia };
}

/** Un punto de la cabeza, puesto donde lo deja la cabeza en ese momento (en las coordenadas del tronco). */
export function enLaCabeza(m: Momento, p: Punto): Punto {
  const [cx, cy] = CUERNOS_ARMADO.cuello;
  const c = deLaCabeza(m);
  const escalado: Punto = [cx + (p[0] - cx) * c.escala, cy + (p[1] - cy) * c.escala];
  const [x, y] = rot(escalado, [cx, cy], c.giro);
  return [x + c.tx, y + c.ty];
}

/** Dónde está el monóculo: en el ojo, o colgando del cordón, hamacándose. */
export function monoculoEn(m: Momento): Punto {
  const A = CUERNOS_ARMADO;
  const ojo = enLaCabeza(m, A.ojos[1]);
  const a = (m.vaiven * Math.PI) / 180;
  const colgado: Punto = [A.ojal[0] + A.cordon * Math.sin(a), A.ojal[1] + A.cordon * Math.cos(a)];
  const k = m.caida;
  // Cae por una curva: primero se despega para afuera y después baja.
  const arco = 10 * Math.sin(k * Math.PI);
  return [ojo[0] + (colgado[0] - ojo[0]) * k + arco, ojo[1] + (colgado[1] - ojo[1]) * k * k];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = CUERNOS_ARMADO;
  const [wx, wy] = A.cintura;
  const [nx, ny] = A.cuello;
  const [kx, ky] = A.cadera;
  const c = deLaCabeza(m);
  const b = baja(m);
  const transform: Record<string, string> = {
    entero: `translate(${CUERNOS.x} ${CUERNOS.piso}) scale(${CUERNOS.escala})`,
    tronco: `rotate(${n2(m.inclina)} ${wx} ${wy})`,
    cuerpo: `translate(${wx} ${wy}) scale(${n2(1 + 0.01 * m.respira)} ${n2(alto(m))}) translate(${-wx} ${-wy})`,
    cabeza: `translate(${n2(c.tx)} ${n2(c.ty)}) rotate(${n2(c.giro)} ${nx} ${ny}) translate(${nx} ${ny}) scale(${n2(c.escala)}) translate(${-nx} ${-ny})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
  };
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.hombros[n];
    const [ex, ey] = A.codos[n];
    transform[`brazo-${n + 1}`] = `translate(0 ${n2(b)}) rotate(${n2(m.brazos[n])} ${hx} ${hy})`;
    transform[`antebrazo-${n + 1}`] = `rotate(${n2(m.codos[n])} ${ex} ${ey})`;
    const [ox, oy] = A.ojos[n];
    const top = oy - A.radioOjo - 1;
    transform[`parpado-${n + 1}`] = `translate(${ox} ${top}) scale(1 ${n2(Math.max(0.02, m.parpados[n]))}) translate(${-ox} ${-top})`;
    transform[`pupila-${n + 1}`] = `translate(${n2(m.pupilas[n][0])} ${n2(m.pupilas[n][1])})`;
    const [cx, cy] = A.cejas[n];
    const s = n === 0 ? -1 : 1;
    transform[`ceja-${n + 1}`] = `translate(0 ${n2(-6 * m.cejas[n])}) rotate(${n2(-s * 10 * m.cejas[n])} ${cx} ${cy})`;
  }
  ORDEN.forEach((nombre, i) => {
    const [bx, by] = A.cuernos[nombre].base;
    transform[`cuerno-${nombre}`] = `rotate(${n2(m.meneo[i] ?? 0)} ${bx} ${by})`;
  });
  const [rx, ry] = A.brote;
  transform.brote = `translate(${rx} ${ry}) scale(${n2(Math.max(0.01, m.brote))}) translate(${-rx} ${-ry})`;
  // El monóculo vive en el tronco, fuera de la cabeza: así puede caerse y colgar del ojal.
  const [mx, my] = monoculoEn(m);
  const [ox, oy] = A.ojos[1];
  transform.monoculo = `translate(${n2(mx - ox)} ${n2(my - oy)}) rotate(${n2(c.giro * (1 - m.caida) + m.vaiven * m.caida)} ${ox} ${oy})`;
  // El cordón: una raya de largo 1, del ojal al monóculo, que se gira y se estira.
  const [ax, ay] = A.ojal;
  const largo = Math.hypot(mx - ax, my - ay);
  const giro = (Math.atan2(-(mx - ax), my - ay) * 180) / Math.PI;
  transform.cordon = `translate(${ax} ${ay}) rotate(${n2(giro)}) scale(1 ${n2(Math.max(0.01, largo))})`;
  const opacity: Record<string, string> = {
    grito: n2(m.grito),
    brote: n2(Math.min(1, m.brote * 3)),
    reloj: n2(m.reloj),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de los cuernos, en el recinto. */
export const VERSO: Punto = alRecinto([0, -400]);
