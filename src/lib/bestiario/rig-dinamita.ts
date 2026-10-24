/**
 * Los números de mi perro dinamita (`D-73`, decimonovena vuelta): dónde anda en el baldío, cómo está
 * armado, cómo camina, cómo se le quema la mecha y cómo vuela en pedazos. Los lee el dibujo
 * (`arte-dinamita.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/dinamita.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del recinto** (el baldío, `escenaBaldio`): el piso de tierra abajo, la chapa arriba.
 * - **El del perro**: el (0, 0) es el piso entre las cuatro patas, arriba es negativo, y mira para la
 *   izquierda. Se dibuja a esta medida y la escena lo achica con `LUGAR.escala`. La explosión vive en el
 *   del perro también, pero no se da vuelta con él: el *BUM* se lee siempre al derecho.
 */

export type Punto = readonly [number, number];

/** El perro en el recinto: parado en la tierra del baldío, a la derecha del buen psicópata. */
export const LUGAR = { x: 772, piso: 602, escala: 0.62 } as const;

export const alRecinto = ([x, y]: Punto, corrido = 0): Punto => [LUGAR.x + (x + corrido) * LUGAR.escala, LUGAR.piso + y * LUGAR.escala];

/** Hasta dónde camina, para cada lado, en las del perro: no se mete en el psicópata ni en los otros perros. */
export const RANGO = 110;

/** Cómo está armado, en el suyo. */
export const DINAMITA_ARMADO = {
  /** Los cartuchos: de dónde a dónde van, y el alto de cada uno (son tres, uno arriba del otro). */
  cartuchos: { x0: -34, x1: 42, y: [-86, -73, -60] as readonly number[], radio: 6.6 },
  /** El medio del atado: de ahí sale la explosión, y de ahí se sacude. */
  centro: [4, -73] as Punto,
  /** El pescuezo: de acá gira la cabeza (positivo levanta el hocico). */
  pescuezo: [-38, -84] as Punto,
  /** La quijada gira desde acá (abre para abajo). */
  quijada: [-58, -97] as Punto,
  /** La oreja de este lado, desde su base. */
  oreja: [-56, -121] as Punto,
  /** El ojo, con su párpado y su pupila. */
  ojo: { centro: [-72, -111] as Punto, radio: [3.6, 3] as Punto },
  /** La trufa: ahí le arde la fiebre. */
  trufa: [-103, -100] as Punto,
  /** Las patas: dónde se cuelgan y cuánto miden hasta la tierra. */
  hombro: [-24, -60] as Punto,
  cadera: [27, -60] as Punto,
  largo: 60,
  /** Las de lejos van corridas un poco hacia atrás, como se ve un perro de costado. */
  lejos: 8,
  /**
   * La mecha, que es la cola: una curva (de Bézier, cuadrática) que sale del cartucho del medio por
   * atrás y sube dura. La isla la acorta desde la punta mientras se quema.
   */
  mecha: [[42, -74], [80, -82], [70, -130]] as readonly Punto[],
} as const;

const A = DINAMITA_ARMADO;

/** Las piezas que vuelan cuando explota, con para dónde salen, cuánto giran y desde dónde. */
export const VUELO: Readonly<Record<string, { v: Punto; giro: number; eje: Punto }>> = {
  cabeza: { v: [-70, -170], giro: -330, eje: [-70, -106] },
  tronco: { v: [16, -96], giro: 160, eje: A.centro },
  'pata-del-cerca': { v: [-112, -40], giro: -250, eje: [A.hombro[0], A.hombro[1] + A.largo / 2] },
  'pata-del-lejos': { v: [-46, -128], giro: 300, eje: [A.hombro[0] + A.lejos, A.hombro[1] + A.largo / 2] },
  'pata-tra-cerca': { v: [118, -50], giro: 280, eje: [A.cadera[0], A.cadera[1] + A.largo / 2] },
  'pata-tra-lejos': { v: [66, -140], giro: -240, eje: [A.cadera[0] + A.lejos, A.cadera[1] + A.largo / 2] },
};

/** Un punto de la mecha, de 0 (donde sale del cartucho) a 1 (la punta entera). */
export function enLaMecha(t: number): Punto {
  const [p0, c, p2] = A.mecha as readonly [Punto, Punto, Punto];
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1]];
}

/** La mecha quemada hasta `k` (1 entera): el pedazo de curva que queda, partido con de Casteljau. */
export function mechaHasta(k: number): { d: string; punta: Punto } {
  const [p0, c] = A.mecha as readonly [Punto, Punto, Punto];
  const kk = Math.min(1, Math.max(0.02, k));
  const q1: Punto = [p0[0] + (c[0] - p0[0]) * kk, p0[1] + (c[1] - p0[1]) * kk];
  const punta = enLaMecha(kk);
  return { d: `M${p0[0]} ${p0[1]} Q${n2(q1[0])} ${n2(q1[1])} ${n2(punta[0])} ${n2(punta[1])}`, punta };
}

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Llama {
  k: number;
  o: number;
}

export interface Momento {
  /** Cuánto se corrió de su lugar caminando (en las del perro), y para dónde mira: 1 izquierda, -1 derecha. */
  x: number;
  mira: number;
  /** La fase del paso y cuánto camina (0 parado, 1 al trote). */
  paso: number;
  anda: number;
  /** El pecho que sube y baja, de -1 a 1; cuánto se agacha, de 0 a 1. */
  respira: number;
  agacha: number;
  /** El temblor del cuerpo entero, y cuánto se sacude girando en el medio del atado (en grados). */
  temblor: Punto;
  sacude: number;
  /** La cabeza: cuánto gira en el pescuezo (positivo levanta el hocico), y cuánto abre la boca. */
  cabeza: number;
  boca: number;
  /** La oreja de este lado, de -1 (aplastada para atrás) a 1 (parada). */
  oreja: number;
  /** El párpado; adónde mira la pupila (corrida, en las del perro) y de qué tamaño es (1 normal). */
  parpado: number;
  pupila: Punto;
  pupilaK: number;
  /** Cuánto le arde la trufa, de 0 a 1. */
  fiebre: number;
  /** Lo que queda de mecha, de 0 a 1, y la chispa de la punta. */
  mecha: number;
  chispa: Llama;
  /** El tizne de después, de 0 a 1. */
  hollin: number;
  /** Cuánto se desarmó volando, de 0 (entero) a 1 (cada pieza en la punta de su vuelo). */
  desarme: number;
  /** La explosión: el fogonazo, la estrella del *BUM*, las esquirlas y el humo (que además sube). */
  fogonazo: Llama;
  estrella: Llama;
  esquirlas: Llama;
  humo: Llama & { sube: number };
}

const APAGADA: Llama = { k: 1, o: 0 };

/** La pose quieta, la del HTML: parado en la tierra, con la mecha dura y apagada. */
export const QUIETO: Momento = {
  x: 0,
  mira: 1,
  paso: 0,
  anda: 0,
  respira: 0,
  agacha: 0,
  temblor: [0, 0],
  sacude: 0,
  cabeza: 0,
  boca: 0.18,
  oreja: 0.4,
  parpado: 0.15,
  pupila: [0, 0],
  pupilaK: 1,
  fiebre: 0.6,
  mecha: 1,
  chispa: APAGADA,
  hollin: 0,
  desarme: 0,
  fogonazo: APAGADA,
  estrella: APAGADA,
  esquirlas: APAGADA,
  humo: { ...APAGADA, sube: 0 },
};

/**
 * La del aullido, tiznado y con la mecha corta: es la que deja el toque con movimiento reducido y la
 * del retrato, con la mecha prendida de vuelta.
 */
export const AULLA: Momento = { ...QUIETO, cabeza: 34, boca: 0.9, oreja: -0.8, parpado: 0.75, fiebre: 1, mecha: 0.35, hollin: 0.55 };

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

const n2 = (v: number): string => (Math.round(v * 100) / 100).toFixed(2);

/** Cuánto gira cada pata en su hombro o su cadera, en grados, con el paso. */
export function patas(m: Momento): Record<'pata-del-cerca' | 'pata-del-lejos' | 'pata-tra-cerca' | 'pata-tra-lejos', number> {
  const s = Math.sin(m.paso) * 22 * m.anda;
  // Al trote van cruzadas: la de adelante de acá con la de atrás de allá.
  return { 'pata-del-cerca': s, 'pata-tra-lejos': s, 'pata-del-lejos': -s, 'pata-tra-cerca': -s };
}

/** Dónde queda la punta de una pata (en el suyo, sin el vuelo): para ver que pise la tierra. */
export function pie(nombre: keyof ReturnType<typeof patas>, m: Momento): Punto {
  const raiz: Punto = nombre.startsWith('pata-del') ? A.hombro : A.cadera;
  const corre = nombre.endsWith('lejos') ? A.lejos : 0;
  const a = ((patas(m)[nombre]) * Math.PI) / 180;
  return [raiz[0] + corre - Math.sin(a) * A.largo, raiz[1] + Math.cos(a) * A.largo];
}

/** El vuelo de una pieza para un desarme: corrida y girada desde su eje. */
function vuelo(nombre: string, d: number): string {
  const v = VUELO[nombre];
  if (!v || d <= 0.001) return '';
  return `translate(${n2(v.v[0] * d)} ${n2(v.v[1] * d)}) rotate(${n2(v.giro * d)} ${v.eje[0]} ${v.eje[1]}) `;
}

/**
 * Las transformaciones, las opacidades y los trazos de cada parte para un momento: los escribe el
 * dibujo en el HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string>; d: Record<string, string> } {
  const [cx, cy] = A.centro;
  const p = patas(m);
  // Al trote el cuerpo sube y baja dos veces por paso; parado, respira.
  const sube = -Math.abs(Math.sin(m.paso)) * 3 * m.anda - m.respira * 1.2;
  const mecha = mechaHasta(m.mecha);
  const pata = (nombre: keyof typeof p): string => {
    const raiz = nombre.startsWith('pata-del') ? A.hombro : A.cadera;
    const corre = nombre.endsWith('lejos') ? A.lejos : 0;
    return `${vuelo(nombre, m.desarme)}translate(${corre} 0) rotate(${n2(p[nombre])} ${raiz[0]} ${raiz[1]})`;
  };
  const transform: Record<string, string> = {
    entero: `translate(${LUGAR.x} ${LUGAR.piso}) scale(${LUGAR.escala})`,
    // El perro se corre, se da vuelta (como un títere de papel: se afina y se abre), se agacha desde
    // el piso, tiembla y se sacude.
    perro:
      `translate(${n2(m.x + m.temblor[0])} ${n2(m.temblor[1])}) scale(${n2(m.mira)} ${n2(1 - m.agacha * 0.16)}) ` +
      `rotate(${n2(m.sacude)} ${cx} ${cy})`,
    tronco: `${vuelo('tronco', m.desarme)}translate(0 ${n2(sube)})`,
    'pata-del-cerca': pata('pata-del-cerca'),
    'pata-del-lejos': pata('pata-del-lejos'),
    'pata-tra-cerca': pata('pata-tra-cerca'),
    'pata-tra-lejos': pata('pata-tra-lejos'),
    cabeza: `${vuelo('cabeza', m.desarme)}translate(0 ${n2(sube)}) rotate(${n2(m.cabeza)} ${A.pescuezo[0]} ${A.pescuezo[1]})`,
    quijada: `rotate(${n2(-m.boca * 30)} ${A.quijada[0]} ${A.quijada[1]})`,
    oreja: `rotate(${n2(-m.oreja * 16)} ${A.oreja[0]} ${A.oreja[1]})`,
    parpado: `translate(${A.ojo.centro[0]} ${n2(A.ojo.centro[1] - A.ojo.radio[1])}) scale(1 ${n2(m.parpado)}) translate(${-A.ojo.centro[0]} ${n2(-(A.ojo.centro[1] - A.ojo.radio[1]))})`,
    pupila: `translate(${n2(A.ojo.centro[0] + m.pupila[0])} ${n2(A.ojo.centro[1] + m.pupila[1])}) scale(${n2(m.pupilaK)})`,
    chispa: `translate(${n2(mecha.punta[0])} ${n2(mecha.punta[1])}) scale(${n2(m.chispa.k)})`,
    // La explosión no se da vuelta con el perro: sale del medio del atado, donde esté.
    estallido: `translate(${n2(m.x + cx * m.mira)} ${cy})`,
    fogonazo: `scale(${n2(m.fogonazo.k)})`,
    estrella: `scale(${n2(m.estrella.k)}) rotate(${n2((1 - m.estrella.k) * 24)})`,
    esquirlas: `scale(${n2(m.esquirlas.k)})`,
    humo: `translate(0 ${n2(-m.humo.sube)}) scale(${n2(m.humo.k)})`,
  };
  const opacity: Record<string, string> = {
    fiebre: n2(m.fiebre),
    chispa: n2(m.chispa.o),
    'hollin-tronco': n2(m.hollin),
    'hollin-cabeza': n2(m.hollin),
    fogonazo: n2(m.fogonazo.o),
    estrella: n2(m.estrella.o),
    esquirlas: n2(m.esquirlas.o),
    humo: n2(m.humo.o),
  };
  return { transform, opacity, d: { mecha: mecha.d } };
}

/** Dónde dice su verso: arriba de él, sobre la tierra del baldío. */
export const VERSO: Punto = [LUGAR.x, LUGAR.piso - 190 * LUGAR.escala];
