/**
 * Los números del rato molhado (`D-73`, decimoquinta vuelta): dónde nada en el bajo inundado, cómo
 * está armado y cómo se mueve. Los lee el dibujo (`arte-rato.ts`), para la pose quieta que está en el
 * HTML y para el retrato, y la conducta (`scripts/bestiario/rato.ts`), que se lleva esto y nada que
 * dibuje. La pose se calcula acá: la misma cuenta lo pone sin JavaScript y con la isla.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es el agua, debajo del medio del pecho; arriba es negativo. Está de
 *   tres cuartos, con el hocico para la derecha (para la puerta, de donde viene la luz): el lado de acá
 *   es el de la izquierda. El brazo 1 es el de acá (levanta las botas) y el 2 el de allá (el porrón).
 * - **El del recinto** (900 × 640): el bajo de `escenaBajo`, con el agua de la pared en `BAJO.fondo`.
 */

export type Punto = readonly [number, number];

/**
 * El rato en el recinto: nada delante de la puerta del vidrio roto, a la izquierda de Pierre, en el
 * agua. `agua` es la línea donde el agua lo toca: más abajo que la de Pierre, porque está más cerca.
 */
export const RATO = { x: 112, agua: 484, escala: 0.66 } as const;

/** Cómo está armado, en las coordenadas del títere. Los brazos se dibujan derechos, para arriba. */
export const RATO_ARMADO = {
  /** De acá gira la cabeza: mira, olfatea, levanta el hocico. */
  cuello: [0, -98] as Punto,
  /** Los hombros: 1 el de acá (a la izquierda), 2 el de allá, medio tapado por el pecho. */
  hombros: [[-44, -70], [40, -74]] as readonly [Punto, Punto],
  /** El brazo, del hombro al codo, y el antebrazo, del codo al medio del puño. */
  largos: { brazo: 58, antebrazo: 54 },
  /** El porrón va en el puño de allá, torcido contra el antebrazo: así queda parado con el brazo quieto. */
  porron: -38,
  /** La cola, que flota en el agua detrás de él: de dónde nace y dónde se dobla. */
  cola: [-28, -6] as Punto,
  punta: [-96, -18] as Punto,
  /** La oreja de acá, que se sacude: gira en la base. */
  oreja: [-30, -176] as Punto,
  /** Los bigotes nacen del hocico, y de ahí tiemblan cuando huele. */
  bigotes: [58, -112] as Punto,
  /** La punta de la nariz, y abajo de ella, donde la manga la seca. */
  nariz: [72, -116] as Punto,
  bajoLaNariz: [70, -106] as Punto,
  /** Los ojos de persona: 1 el de acá, en la sombra, más grande; 2 el de allá, en la luz, contra el hocico. */
  ojos: [
    { centro: [-12, -152] as Punto, radio: [9.6, 6.2] as Punto },
    { centro: [21, -159] as Punto, radio: [6.8, 4.8] as Punto },
  ],
  /** Los dos dientes de oro, abajo de la nariz: ahí brilla cuando brinda. */
  dientes: [61, -97] as Punto,
} as const;

/** Las botas cuelgan del puño de acá: el largo, de la manija a la suela. */
export const BOTAS = { largo: 98 } as const;

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
export const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const rad = (g: number): number => (g * Math.PI) / 180;
const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;

/**
 * Lo que hace, en números. La conducta lo mezcla de cuadro en cuadro; las poses quietas son
 * `GESTOS`. Todo en el títere.
 */
export interface Gesto {
  /** Cuánto sale del agua: 0 nadando con el agua al pecho; brindando, patalea y saca el pecho. */
  sube: number;
  /** Lo que se mece de costado, en grados. */
  mece: number;
  /**
   * Cada brazo, en grados: cuánto gira en el hombro (desde derecho para arriba) y cuánto gira el
   * antebrazo en el codo. El 1 levanta las botas; el 2 tiene el porrón.
   */
  brazo1: Punto;
  brazo2: Punto;
  /** Las botas: cuánto se hamacan (grados, 0 colgando derecho) y cuánto las da vuelta (0 a 1). */
  hamaca: number;
  vuelca: number;
  /** La cabeza: cuánto gira en el cuello (positivo, el hocico para abajo) y cuánto se corre. */
  cabeza: number;
  corre: Punto;
  /** Adónde miran las pupilas (de -1 a 1) y cuánto bajan los párpados (0 abiertos, 1 cerrados). */
  mira: Punto;
  parpados: readonly [number, number];
  /** La oreja, los bigotes (giro y cuánto se abren), la cola y la punta, en grados. */
  oreja: number;
  bigotes: number;
  abre: number;
  cola: number;
  punta: number;
  /** El brillo de los dientes de oro (0 a 1). */
  brillo: number;
  /** Cuánto gira el porrón adentro del puño, en grados (0 es como lo agarra nadando). */
  porron: number;
}

/**
 * Las poses quietas. `nada` es la del HTML: con el agua al pecho, las botas en alto para que no se
 * mojen, el porrón en la mano de allá y la cara tan expresiva como las botas. `brinda` es el verso:
 * sale del agua, levanta el porrón y las botas más alto, con el hocico arriba y los dientes de oro.
 */
export const GESTOS: Readonly<Record<'nada' | 'brinda', Gesto>> = {
  nada: {
    sube: 0,
    mece: 0,
    brazo1: [-43, 47],
    brazo2: [164, -125],
    hamaca: 0,
    vuelca: 0,
    cabeza: 0,
    corre: [0, 0],
    mira: [-0.35, 0.1],
    parpados: [0.46, 0.4],
    oreja: 0,
    bigotes: 0,
    abre: 1,
    cola: 0,
    punta: 0,
    brillo: 0,
    porron: 0,
  },
  brinda: {
    sube: 26,
    mece: -2,
    brazo1: [-30, 4],
    brazo2: [18, 10],
    hamaca: -6,
    vuelca: 0,
    cabeza: -9,
    corre: [2, -3],
    mira: [-0.7, 0.3],
    parpados: [0.3, 0.26],
    oreja: -10,
    bigotes: -4,
    abre: 1.12,
    cola: -4,
    punta: 8,
    brillo: 1,
    porron: 16,
  },
};

/**
 * Los brazos de lo que hace la conducta: se seca la nariz con la manga (el antebrazo de allá le pasa
 * por abajo de la nariz), se le cansa el brazo de las botas hasta que tocan el agua, y las da vuelta
 * en alto para sacarles el agua.
 */
export const BRAZOS = {
  manga: [74, -137] as Punto,
  cansado: [-112, 127] as Punto,
  arriba: [-13, 10] as Punto,
} as const;
/** Al secarse la nariz da vuelta el porrón para abajo, para no pegarse con él en la cara. */
export const PORRON_EN_LA_MANGA = -72;

/** Mezcla dos gestos. */
export function entre(a: Gesto, b: Gesto, k: number): Gesto {
  const m = (x: number, y: number): number => mezcla(x, y, k);
  const p = (x: Punto, y: Punto): Punto => [m(x[0], y[0]), m(x[1], y[1])];
  return {
    sube: m(a.sube, b.sube),
    mece: m(a.mece, b.mece),
    brazo1: p(a.brazo1, b.brazo1),
    brazo2: p(a.brazo2, b.brazo2),
    hamaca: m(a.hamaca, b.hamaca),
    vuelca: m(a.vuelca, b.vuelca),
    cabeza: m(a.cabeza, b.cabeza),
    corre: p(a.corre, b.corre),
    mira: p(a.mira, b.mira),
    parpados: [m(a.parpados[0], b.parpados[0]), m(a.parpados[1], b.parpados[1])],
    oreja: m(a.oreja, b.oreja),
    bigotes: m(a.bigotes, b.bigotes),
    abre: m(a.abre, b.abre),
    cola: m(a.cola, b.cola),
    punta: m(a.punta, b.punta),
    brillo: m(a.brillo, b.brillo),
    porron: m(a.porron, b.porron),
  };
}

/**
 * De nadar a brindar (`e` de 0 a 1): en el camino el codo se dobla y el porrón se para, así sube cerca
 * del cuerpo y no se va para el lado de la puerta, donde cae el agua del vidrio roto.
 */
export function brindando(e: number): Gesto {
  const g = entre(GESTOS.nada, GESTOS.brinda, e);
  const doblez = Math.sin(Math.PI * Math.max(0, Math.min(1, e)));
  return { ...g, brazo2: [g.brazo2[0] - doblez * 12, g.brazo2[1] - doblez * 40], porron: g.porron + doblez * 25 };
}

/**
 * Cuando vacía las botas, en segundos: el tirón para arriba, la vuelta, el chorro, la sacudida, las
 * vuelve a dar vuelta (con el brazo arriba, así no barren para el costado) y baja el brazo.
 */
export const VUELCO = { tiron: 0.45, gira: 1.05, chorro: 2.0, sacude: 2.55, endereza: 3.05, fin: 3.6 } as const;

/** El brazo de las botas mientras las vacía, `u` segundos después de que tocaron el agua (`desde`: cómo quedó el brazo). */
export function vuelco(u: number, desde: Punto): { brazo1: Punto; vuelca: number; hamaca: number } {
  const V = VUELCO;
  const a = BRAZOS.arriba;
  const hacia = (de: Punto, k: number): Punto => [de[0] + (a[0] - de[0]) * k, de[1] + (a[1] - de[1]) * k];
  if (u < V.tiron) {
    const k = suave(u / V.tiron);
    return { brazo1: hacia(desde, k), vuelca: 0, hamaca: 18 * Math.sin(k * Math.PI) };
  }
  if (u < V.gira) return { brazo1: a, vuelca: suave((u - V.tiron) / (V.gira - V.tiron)), hamaca: 0 };
  if (u < V.chorro) return { brazo1: a, vuelca: 1, hamaca: Math.sin((u - V.gira) * 3) * 2 };
  if (u < V.sacude) return { brazo1: [a[0] + Math.sin(u * 25) * 3, a[1]], vuelca: 1, hamaca: Math.sin(u * 25) * 14 };
  if (u < V.endereza) return { brazo1: a, vuelca: 1 - suave((u - V.sacude) / (V.endereza - V.sacude)), hamaca: 0 };
  const k = suave((u - V.endereza) / (V.fin - V.endereza));
  const n = GESTOS.nada.brazo1;
  return { brazo1: [a[0] + (n[0] - a[0]) * k, a[1] + (n[1] - a[1]) * k], vuelca: 0, hamaca: Math.sin(k * Math.PI) * -6 };
}

/** Cuánto se corre la pupila adentro del blanco, en el títere. */
export const MIRA = [3.2, 1.6] as const;

/** De dónde baja cada párpado: el borde de arriba del ojo. */
export const PIVOTES_PARPADO: readonly Punto[] = RATO_ARMADO.ojos.map(({ centro: [cx, cy], radio: [, ry] }) => [cx, Math.round((cy - ry - 0.6) * 10) / 10] as const);

/** El codo y el puño de un brazo dibujado derecho para arriba: donde están antes de girar. */
export const dibujado = (n: 0 | 1): { codo: Punto; puno: Punto } => {
  const [sx, sy] = RATO_ARMADO.hombros[n];
  return { codo: [sx, sy - RATO_ARMADO.largos.brazo], puno: [sx, sy - RATO_ARMADO.largos.brazo - RATO_ARMADO.largos.antebrazo] };
};

/** Un tramo de largo `l` que sale de `desde` girado `g` grados desde derecho para arriba. */
const tramo = ([x, y]: Punto, l: number, g: number): Punto => [x + Math.sin(rad(g)) * l, y - Math.cos(rad(g)) * l];

export interface Brazo {
  arriba: number;
  abajo: number;
  codo: Punto;
  puno: Punto;
}

/** Un brazo girado: dónde quedan el codo y el puño (en el títere). */
export function brazo(n: 0 | 1, [arriba, abajo]: Punto): Brazo {
  const A = RATO_ARMADO;
  const codo = tramo(A.hombros[n], A.largos.brazo, arriba);
  return { arriba, abajo, codo, puno: tramo(codo, A.largos.antebrazo, arriba + abajo) };
}

/** Los dos brazos para un gesto. */
export const brazos = (g: Gesto): readonly [Brazo, Brazo] => [brazo(0, g.brazo1), brazo(1, g.brazo2)];

/** Hacia dónde apunta el antebrazo (grados desde arriba, como gira la página): el del porrón lo sigue. */
export const anguloAntebrazo = (b: Brazo): number => b.arriba + b.abajo;

/** Lo que gira el porrón con el brazo: parado es 0. */
export const anguloPorron = (b: Brazo, g: Gesto): number => vuelta(anguloAntebrazo(b) + RATO_ARMADO.porron + g.porron);

/**
 * Cuánto giran las botas adentro del antebrazo: cuelgan derecho (contra lo que giró el brazo), más la
 * hamaca, y dadas vuelta cuando las vuelca para sacarles el agua.
 */
export const anguloBotas = (b: Brazo, g: Gesto): number => -anguloAntebrazo(b) + g.hamaca + 172 * suave(g.vuelca);

/** Del títere al recinto, para un gesto (el `sube` y el meneo van en el `entero`). */
export function alRecinto([x, y]: Punto, g: Gesto): Punto {
  const a = rad(g.mece);
  const [rx, ry] = [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  return [RATO.x + rx * RATO.escala, RATO.agua + ry * RATO.escala - g.sube * RATO.escala];
}

/** Un punto que va adentro de la cabeza (que gira en el cuello y se corre), en el títere. */
export function enLaCabeza([x, y]: Punto, g: Gesto): Punto {
  const [cx, cy] = RATO_ARMADO.cuello;
  const a = rad(g.cabeza);
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a) + g.corre[0], cy + dx * Math.sin(a) + dy * Math.cos(a) + g.corre[1]];
}

/** Dónde quedan las suelas de las botas, en el títere: si bajan de 0, se mojan. */
export function suelas(g: Gesto): Punto {
  const b = brazo(0, g.brazo1);
  const giro = anguloAntebrazo(b) + anguloBotas(b, g);
  return tramo(b.puno, BOTAS.largo, giro + 180);
}

/** Dónde dice su verso: arriba de la cabeza, y de las botas cuando brinda. */
export const VERSO: Punto = [RATO.x + 4, RATO.agua - 264 * RATO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones de cada parte para un gesto: las escribe el dibujo en el HTML (la pose quieta)
 * y la isla en cada cuadro, con la misma cuenta.
 */
export function transformes(g: Gesto): Record<string, string> {
  const A = RATO_ARMADO;
  const [b1, b2] = brazos(g);
  const entero = `translate(${RATO.x} ${n2(RATO.agua - g.sube * RATO.escala)}) rotate(${n2(g.mece)}) scale(${RATO.escala})`;
  const t: Record<string, string> = {
    entero,
    flota: entero,
    cabeza: `translate(${n2(g.corre[0])} ${n2(g.corre[1])}) rotate(${n2(g.cabeza)} ${A.cuello[0]} ${A.cuello[1]})`,
    oreja: `rotate(${n2(g.oreja)} ${A.oreja[0]} ${A.oreja[1]})`,
    bigotes: `translate(${A.bigotes[0]} ${A.bigotes[1]}) rotate(${n2(g.bigotes)}) scale(${n2(g.abre)} 1) translate(${-A.bigotes[0]} ${-A.bigotes[1]})`,
    cola: `rotate(${n2(g.cola)} ${A.cola[0]} ${A.cola[1]})`,
    punta: `rotate(${n2(g.punta)} ${A.punta[0]} ${A.punta[1]})`,
    brillo: n2(g.brillo),
  };
  ([b1, b2] as const).forEach((b, i) => {
    const n = i + 1;
    const [sx, sy] = A.hombros[i as 0 | 1];
    const d = dibujado(i as 0 | 1);
    t[`brazo-${n}`] = `rotate(${n2(b.arriba)} ${sx} ${sy})`;
    t[`antebrazo-${n}`] = `rotate(${n2(b.abajo)} ${d.codo[0]} ${d.codo[1]})`;
  });
  const p1 = dibujado(0).puno;
  t.botas = `rotate(${n2(anguloBotas(b1, g))} ${p1[0]} ${p1[1]})`;
  const p2 = dibujado(1).puno;
  t.porron = `rotate(${n2(g.porron)} ${p2[0]} ${p2[1]})`;
  for (const n of [1, 2] as const) {
    t[`pupila-${n}`] = `translate(${n2(g.mira[0] * MIRA[0])} ${n2(g.mira[1] * MIRA[1])})`;
    const [px, py] = PIVOTES_PARPADO[n - 1]!;
    t[`parpado-${n}`] = `translate(${px} ${py}) scale(1 ${n2(Math.max(0.02, g.parpados[n - 1]!))}) translate(${-px} ${-py})`;
  }
  return t;
}
