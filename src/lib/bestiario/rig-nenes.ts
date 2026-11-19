/**
 * Los números de los nenes de oro (`D-73`, vigesimonovena vuelta, `T-529`): dónde está su podio en el bajo, cómo están
 * armados y cómo se ponen. Los lee el dibujo (`arte-nenes.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/nenes.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de los nenes**: el (0, 0) es la línea del agua al medio del podio; arriba es negativo. El de la izquierda es el
 *   A, que mira a la izquierda, y el de la derecha el B, que mira a la derecha: están espalda con espalda.
 * - **El del recinto** (el del bajo, que arranca antes del cero: `MARCO_DEL_RECINTO`): a la derecha de Pierre, en el
 *   agua, donde estaban sus ojos. El bajo va entero al camino, así que ahí queda igual.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está el podio, y lo que mide. El piso es la línea del agua. */
export const NENES = { x: 880, piso: 512, escala: 0.92 } as const;

/** Cómo están armados, en sus coordenadas. */
export const NENES_ARMADO = {
  /** El podio: de dónde a dónde, a qué altura está su tapa, y la plaquita del frente (x, y, ancho, alto). */
  podio: { desde: -70, hasta: 70, tapa: -46 },
  placa: [-17, -37, 34, 21] as readonly [number, number, number, number],
  /** Los pedestales: a cuánto del medio está cada uno, y a qué altura pisan los nenes. */
  pedestal: 36,
  pisan: -68,
  /** El trofeo, dibujado con los pies en el (0, 0) y mirando a la derecha: la cadera (de acá gira en el aire), los hombros y las manos. */
  cadera: 48,
  hombros: [-2, -68] as Punto,
  manos: [2, -113] as Punto,
  /** Donde tiene pegada la aguja del suero, con su cinta: atrás del hombro. */
  aguja: [-5, -64] as Punto,
  /** Lo que se hunde el podio con la marea alta: tapa la plaquita. */
  marea: 36,
  /** El clavado: cuánto se alejan del pedestal, y cuánto queda hundida la cadera cuando están clavados (se les ven las piernas). */
  salto: 78,
  clavado: 2,
  /** El suero: la punta del palo, de donde cuelga la botella. */
  suero: [0, -196] as Punto,
  /** El gotero, debajo de la botella: de acá salen las dos mangueras. Y lo que mide cada manguera sin estirar. */
  gotero: [0, -146] as Punto,
  manguera: 34,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export type Dos = readonly [number, number];

export interface Momento {
  /** La marea (0 baja, 1 alta: el agua tapa la plaquita) y lo que se mece la espuma (−1 a 1). */
  marea: number;
  mece: number;
  /**
   * El clavado de cada uno: 0 en el pedestal, 1 clavado de cabeza con las piernas afuera, 1,7 todavía clavado, 2 hundido
   * del todo, 3 de vuelta en el pedestal (trepó por atrás).
   */
  salto: Dos;
  /** Lo que se tuerce clavado (grados) y lo que le tiemblan las piernas (grados). */
  torcido: Dos;
  tiembla: Dos;
  /** Parado en el pedestal: lo que se inclina (grados) y los brazos (0 arriba de la cabeza; positivo los baja por adelante). */
  inclina: Dos;
  brazos: Dos;
  /** El destello de cada uno (0 a 1). */
  brillo: Dos;
  /** El pagaré de cada uno, hecho barquito: cuánto del viaje hizo (0 no está, 1 se hundió). */
  barco: Dos;
  /** El suero: la burbuja que sube por la botella (0 a 1) y lo que se hamaca la botella (grados). */
  burbuja: number;
  botella: number;
  /** La hora del reloj: no dibuja nada, es para que una acción sepa a quién le toca. */
  reloj: number;
}

/** La pose quieta, la del HTML: los dos en su pedestal, espalda con espalda, con la marea baja. */
export const QUIETO: Momento = {
  marea: 0,
  mece: 0,
  salto: [0, 0],
  torcido: [0, 0],
  tiembla: [0, 0],
  inclina: [0, 0],
  brazos: [0, 0],
  brillo: [0, 0],
  barco: [0, 0],
  burbuja: 0,
  botella: 0,
  reloj: 0,
};

/**
 * *"Cuando la marea los quiere tapar… pagan con promesas"*: la marea a medio subir, los dos pagarés flotando, y la
 * largada en falso: uno ya está clavado de cabeza, con las piernas de oro afuera, y el otro sigue en su pedestal,
 * brillando. Es el toque quieto y el retrato: en una sola foto se ven el trofeo y el clavado.
 */
export const CLAVADO: Momento = {
  ...QUIETO,
  marea: 0.5,
  salto: [1.3, 0],
  torcido: [14, 0],
  brillo: [0, 1],
  barco: [0.46, 0.56],
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [NENES.x + x * NENES.escala, NENES.piso + y * NENES.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const tramo = (k: number, a: number, b: number): number => Math.min(1, Math.max(0, (k - a) / (b - a)));
const suave = (k: number): number => k * k * (3 - 2 * k);

/**
 * Dónde está la cadera de un nene y cuánto giró, para un valor de `salto`, sin espejar (como el B, que salta a la
 * derecha): el pedestal, el arco del clavado, clavado con las piernas afuera, hundido, y trepando por atrás del pedestal.
 */
export function clavadoEn(s: number): { x: number; y: number; giro: number } {
  const A = NENES_ARMADO;
  const arriba = A.pisan - A.cadera;
  if (s <= 0 || s >= 3) return { x: A.pedestal, y: arriba, giro: 0 };
  if (s <= 1) {
    // Se echa para atrás, y salta: sube un poco, gira en el aire y entra de cabeza.
    const q = tramo(s, 0.14, 1);
    const atras = Math.sin(tramo(s, 0, 0.2) * Math.PI) * -9;
    return { x: A.pedestal + A.salto * suave(q), y: arriba + (A.clavado - arriba) * q * q - 70 * q * (1 - q), giro: atras + 180 * tramo(s, 0.16, 0.97) ** 1.35 };
  }
  if (s <= 2) {
    // Clavado; al final se va a pique.
    const k = tramo(s, 1.7, 2);
    return { x: A.pedestal + A.salto, y: A.clavado + 64 * k * k, giro: 180 };
  }
  // Trepa por atrás del pedestal: sale de abajo, derecho, y se acomoda de un saltito.
  const k = tramo(s, 2, 2.86);
  const salta = Math.sin(tramo(s, 2.86, 3) * Math.PI) * 5;
  return { x: A.pedestal, y: mezclar(64, arriba, 1 - (1 - k) * (1 - k)) - salta, giro: 0 };
}

/** Cuánto está parado en el pedestal (1) o en el agua (0): parado, sube y baja con la marea. */
export const enPedestal = (s: number): number => (s <= 0 || s >= 3 ? 1 : s > 2 ? tramo(s, 2, 2.86) : 0);

/** Por dónde va el barquito de un nene para una fase de 0 a 1, sin espejar: cae planeando, flota, se aleja y se hunde. */
export function barcoEn(p: number): { x: number; y: number; giro: number; se: number } {
  const A = NENES_ARMADO;
  if (p <= 0 || p >= 1) return { x: A.pedestal + 22, y: 0, giro: 0, se: 0 };
  const cae = tramo(p, 0, 0.22);
  const flota = tramo(p, 0.22, 0.86);
  const pique = tramo(p, 0.86, 1);
  const x = A.pedestal + 22 + 10 * Math.sin(cae * Math.PI * 2) * (1 - cae) + 30 * flota;
  const y = mezclar(-150, -2, cae * cae) + 1.4 * Math.sin(flota * 16) * (cae >= 1 ? 1 : 0) + 9 * pique;
  return { x, y, giro: 70 * (1 - cae) * Math.cos(cae * 9) + 5 * Math.sin(flota * 11) + 28 * pique, se: Math.min(1, cae * 8) * (1 - pique) };
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = NENES_ARMADO;
  const hunde = A.marea * m.marea;
  const [hx, hy] = A.hombros;
  const [sx, sy] = A.suero;
  const transform: Record<string, string> = {
    entero: `translate(${NENES.x} ${NENES.piso}) scale(${NENES.escala})`,
    'podio-fondo': `translate(0 ${n2(hunde)})`,
    podio: `translate(0 ${n2(hunde)})`,
    botella: `rotate(${n2(m.botella)} ${sx} ${sy})`,
    burbuja: `translate(0 ${n2(-20 * m.burbuja)})`,
    // La raya de espuma sube con la franja de la marea: queda siempre en la cresta.
    espuma: `translate(0 ${n2(1.4 * m.mece - 10 * m.marea)}) scale(${n2(1 + 0.05 * m.marea)} 1)`,
    // La marea: además de hundirse el podio, una franja de agua con la cresta de espuma clara le sube por la base.
    marea: `translate(0 ${n2(-10 * m.marea + 0.8 * m.mece)})`,
  };
  const opacity: Record<string, string> = {
    burbuja: n2(Math.sin(Math.min(1, Math.max(0, m.burbuja)) * Math.PI)),
    marea: n2(tramo(m.marea, 0.15, 0.5)),
  };
  (['a', 'b'] as const).forEach((n, i) => {
    const lado = i ? 1 : -1;
    const s = m.salto[i as 0];
    const c = clavadoEn(s);
    const pedestal = enPedestal(s);
    // Parado, se inclina desde los pies; en el aire y en el agua, gira de la cadera.
    const inclina = m.inclina[i as 0] * (s <= 0 || s >= 3 ? 1 : 0);
    const clavado = s >= 1 && s <= 2 ? 1 : 0;
    const giro = c.giro + inclina + clavado * (m.torcido[i as 0] + m.tiembla[i as 0]) + (clavado ? 0 : m.tiembla[i as 0]);
    const rad = (inclina * Math.PI) / 180;
    const x = c.x + A.cadera * Math.sin(rad);
    const y = c.y + A.cadera * (1 - Math.cos(rad)) + hunde * pedestal;
    transform[n] = `translate(${n2(lado * x)} ${n2(y)}) rotate(${n2(lado * giro)}) scale(${lado} 1) translate(0 ${A.cadera})`;
    transform[`brazos-${n}`] = `rotate(${n2(m.brazos[i as 0])} ${hx} ${hy})`;
    opacity[`brillo-${n}`] = n2(m.brillo[i as 0]);
    // La salpicadura, cuando entra; las burbujas, cuando se va a pique.
    const entra = tramo(s, 0.9, 1) * (1 - tramo(s, 1.05, 1.4));
    transform[`salpica-${n}`] = `translate(${n2(lado * (A.pedestal + A.salto))} 0) scale(${n2(0.6 + 0.6 * tramo(s, 0.9, 1.4))})`;
    opacity[`salpica-${n}`] = n2(s > 0 && s < 3 ? entra : 0);
    const pique = tramo(s, 1.72, 1.9) * (1 - tramo(s, 2.05, 2.3));
    transform[`burbujas-${n}`] = `translate(${n2(lado * (A.pedestal + A.salto))} ${n2(-10 * tramo(s, 1.72, 2.3))})`;
    opacity[`burbujas-${n}`] = n2(s > 0 && s < 3 ? pique : 0);
    // El aro de espuma clara alrededor de las piernas, mientras está clavado.
    transform[`aro-${n}`] = `translate(${n2(lado * (A.pedestal + A.salto))} ${n2(0.8 * m.mece)})`;
    opacity[`aro-${n}`] = n2(s > 0 && s < 3 ? tramo(s, 0.94, 1.02) * (1 - tramo(s, 1.72, 1.9)) : 0);
    // La manguera del suero: una goma. Sale del gotero y va a la aguja, pegada atrás del hombro. Cuando se tira, se estira
    // con él y salta: queda colgando del gotero, hamacándose cada vez menos, hasta que vuelve y se la enchufa de nuevo.
    const [gx, gy0] = A.gotero;
    const gy = gy0 + hunde;
    const enchufada = s < 0.3 || s > 2.96;
    let fin: readonly [number, number];
    if (enchufada) {
      const a = (lado * giro * Math.PI) / 180;
      const [ox, oy] = [lado * A.aguja[0], A.aguja[1] + A.cadera];
      fin = [lado * x + ox * Math.cos(a) - oy * Math.sin(a), y + ox * Math.sin(a) + oy * Math.cos(a)];
    } else {
      const w = lado * 0.9 * Math.cos((s - 0.3) * 13) * Math.exp(-(s - 0.3) * 2.4);
      fin = [gx + A.manguera * Math.sin(w), gy + A.manguera * Math.cos(w)];
    }
    const [dx, dy] = [fin[0] - gx, fin[1] - gy];
    transform[`manguera-${n}`] = `translate(${gx} ${n2(gy)}) rotate(${n2((Math.atan2(dy, dx) * 180) / Math.PI)}) scale(${n2(Math.hypot(dx, dy) / A.manguera)} ${lado})`;
    const b = barcoEn(m.barco[i as 0]);
    transform[`barco-${n}`] = `translate(${n2(lado * b.x)} ${n2(b.y)}) rotate(${n2(lado * b.giro)}) scale(${lado} 1)`;
    opacity[`barco-${n}`] = n2(b.se);
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del suero, en el recinto. */
export const VERSO: Punto = alRecinto([0, -214]);
