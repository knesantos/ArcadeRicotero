/**
 * El club de mantis (`D-73`, vigesimoquinta vuelta), sentado a la mesa servida.
 *
 * Lo que hacen solas es no quedarse quietas nunca, y nada es un bucle: eligen qué hacer cada vez.
 *
 * - **Se hamacan** de un lado al otro, cada una a su ritmo, como se hamacan las mantis de verdad: es su
 *   respirar, y no para nunca. Las antenas tiemblan, las pinzas se aprietan.
 * - **Giran la cabeza de golpe**: una se da vuelta para un lado y las otras la siguen, una detrás de la otra.
 *   Las mantis no pestañean: lo que les hace de pestañeo es un tirón de la cabeza, cada tanto.
 * - **Se limpian una antena**: la bajan con la pinza y se la pasan por la boca.
 * - **La del abanico abanica**, y a las otras se les vuelan las antenas.
 * - **La que mastica mastica**, y traga: la pata que le asomaba de la boca se le mete adentro, el bocado le
 *   baja por el cogote… y al rato la pata vuelve a asomar.
 * - **Chasquean las pinzas**, las tres, sin orden.
 * - **Se pasan la fuente** de masitas por el mantel.
 * - **Se miran**: las pseudopupilas van de una a otra, al que mira, y al macho.
 *
 * Tocado, **lo devoran** (*"sin descanso van a devorar"*): el macho llega contento por el mantel con el clavel,
 * las tres se quedan quietas de golpe y lo siguen con las pseudopupilas; él saluda con la flor y se sienta en
 * el plato; ellas lo rodean con cortesía, servilleta y todo… y en un cuadro, ÑAC: no está más. Queda el clavel
 * en el plato, y una antena. Mastican, se limpian las pinzas con la servilleta y vuelven a hamacarse, muy
 * nerviosas; y el macho vuelve a estar llegando por la derecha, contento, como si nada. Dicen su verso. Con
 * movimiento reducido no se mueve nada: tocarlas pasa del macho llegando a la flor sola en el plato.
 *
 * Se lleva números (`rig-mantis.ts`) y nada que dibuje.
 */

import { MACHO, QUIETO, SILLAS, SOLA, VERSO, marcas, type Momento, type Punto, type UnaMantis } from '../../lib/bestiario/rig-mantis.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-club-de-mantis';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { giran: 2.4, antenas: 3, abanica: 2.6, mastica: 3.4, chasquean: 2, pasan: 3.4, miran: 3.2, devora: 7 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['giran', 'antenas', 'abanica', 'mastica', 'chasquean', 'pasan', 'miran'] as const;
type Sola = (typeof SOLAS)[number];

export const PAUSA = [0.6, 2] as const;
export const PRIMERA = [0.4, 1.2] as const;
/** Cuándo dicen el verso, después del toque: recién comido el macho. */
export const DEMORA_FICHA = 3.7;
/** Cada cuánto a alguna le da el tirón de la cabeza, que es lo que les hace de pestañeo, y lo que dura. */
export const TIRON = [1.4, 3.6] as const;
const TIRON_DURA = 0.32;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = {
  llega: [0, 1.7],
  saluda: [1.7, 2.3],
  sienta: [2.3, 2.7],
  rodean: [2.7, 3.4],
  nac: 3.45,
  mastican: [3.5, 4.5],
  limpian: [4.5, 5.6],
  calma: [5.6, 6],
  vuelve: [6, 7],
} as const;

/** El ritmo de la hamaca de cada una: no se ponen nunca de acuerdo. */
const RITMO = [1.9, 2.35, 1.6] as const;
const FASE = [0, 2.1, 4.2] as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const tope = (v: number): number => Math.max(-1, Math.min(1, v));
/** El chasquido de una pinza que empieza en `a`: se abre de golpe y se cierra más de golpe todavía. */
const chasquido = (u: number, a: number): number => (u < a ? 0 : u < a + 0.07 ? (u - a) / 0.07 : u < a + 0.12 ? 1 : u < a + 0.16 ? 1 - (u - a - 0.12) / 0.04 : 0);

const copia = (m: UnaMantis): UnaMantis => ({ ...m, mira: [...m.mira], antenas: [...m.antenas], brazos: [...m.brazos], pinzas: [...m.pinzas] });
const copiar = (m: Momento): Momento & { mantis: [UnaMantis, UnaMantis, UnaMantis] } => ({
  ...m,
  mantis: [copia(m.mantis[0]), copia(m.mantis[1]), copia(m.mantis[2])],
  macho: { ...m.macho, en: [...m.macho.en] },
});

/** Adónde mira la mantis `i` para ver un punto del mantel (en las coordenadas del club). */
export const miraA = (i: number, [x, y]: Punto): Punto => [tope((x - SILLAS[i]!.x) / 60), tope(0.2 + y / 40)];

/** La pose de base de un instante: se hamacan cada una a su ritmo, tiemblan las antenas y el macho espera contento. */
export function base(t: number): Momento {
  const m = copiar(QUIETO);
  m.mantis.forEach((u, i) => {
    const s = Math.sin(t * RITMO[i]! + FASE[i]!);
    // Nerviosas: la hamaca tiene un temblor encima.
    u.hamaca = 4.6 * s + 0.7 * Math.sin(t * 13 + i * 2);
    u.corre = 2.4 * s;
    u.cabeza += 2 * Math.sin(t * 0.7 + i) - 1.4 * s;
    u.antenas = [u.antenas[0] + 7 * Math.sin(t * 3.1 + i) + 3 * Math.sin(t * 8.3 + i), u.antenas[1] + 7 * Math.sin(t * 2.7 + i * 1.7) + 3 * Math.sin(t * 9.1 + i)];
    u.pinzas = [u.pinzas[0] + 2.4 * Math.sin(t * 4.3 + i), u.pinzas[1] + 2.4 * Math.sin(t * 3.9 + i * 2)];
    u.mira = [tope(u.mira[0] + 0.25 * Math.sin(t * 0.43 + i * 1.3)), tope(u.mira[1] + 0.15 * Math.sin(t * 0.31 + i))];
  });
  m.abanico = 4 * Math.sin(t * 1.3);
  // El macho espera contento: se mece con el clavel en alto.
  m.macho.saluda = QUIETO.macho.saluda + 0.12 * Math.sin(t * 2.2);
  return m;
}

/** Lo que hacen a los `u` segundos de empezar una acción sola, sobre la pose de base. `cual` elige a quién le toca. */
export function momentoDeAccion(b: Momento, accion: Sola, u: number, cual = 0, lado = 1): Momento {
  const m = copiar(b);
  const M = m.mantis;
  const k = cual % 3;
  switch (accion) {
    case 'giran': {
      // Una da vuelta la cabeza de golpe, y las otras la siguen, una detrás de la otra.
      M.forEach((x, i) => {
        const tarde = ((i - k + 3) % 3) * 0.18;
        const g = rampa(u, 0.1 + tarde, 0.18 + tarde) * (1 - rampa(u, 1.8 + tarde * 0.5, 1.9 + tarde * 0.5));
        x.cabeza = mezclar(x.cabeza, 24 * lado, g);
        x.gira = 0.8 * lado * g;
        x.mira = [mezclar(x.mira[0], lado, g), mezclar(x.mira[1], 0, g)];
      });
      break;
    }
    case 'antenas': {
      // Baja una antena con la pinza y se la pasa por la boca, dos o tres veces, mascándola.
      const x = M[k]!;
      const p = k === 0 ? 1 : lado > 0 ? 0 : 1;
      const s = loma(u, 0, 0.45, 2.5, 3);
      const pasa = loma(u, 0.5, 0.7, 2.3, 2.5);
      const brazos = [...x.brazos] as [number, number];
      const pinzas = [...x.pinzas] as [number, number];
      const antenas = [...x.antenas] as [number, number];
      brazos[p] = mezclar(brazos[p], 150, s);
      pinzas[p] = mezclar(pinzas[p], 6, s);
      antenas[p] = mezclar(antenas[p], -126 + 22 * Math.sin(u * 9) * pasa, s);
      x.brazos = brazos;
      x.pinzas = pinzas;
      x.antenas = antenas;
      x.cabeza = mezclar(x.cabeza, p ? 10 : -10, s);
      x.mastica = Math.max(x.mastica, pasa * (0.5 + 0.5 * Math.sin(u * 18)));
      x.mira = [mezclar(x.mira[0], p ? 0.6 : -0.6, s), mezclar(x.mira[1], 1, s)];
      break;
    }
    case 'abanica': {
      // La del abanico abanica fuerte; a las otras se les vuelan las antenas, y se corren.
      const s = loma(u, 0, 0.3, 2.2, 2.6);
      m.abanico = mezclar(m.abanico, 22 * Math.sin(u * 15), s);
      const x = M[0]!;
      x.pinzas = [x.pinzas[0] + 10 * s * Math.sin(u * 15 + 0.6), x.pinzas[1]];
      x.cabeza = mezclar(x.cabeza, 10, s);
      x.mira = [mezclar(x.mira[0], -0.4, s), x.mira[1]];
      for (const i of [1, 2]) {
        const y = M[i]!;
        const viento = s / i;
        y.antenas = [y.antenas[0] - 24 * viento + 8 * viento * Math.sin(u * 17 + i), y.antenas[1] + 16 * viento + 8 * viento * Math.sin(u * 15 + i)];
        y.cabeza = mezclar(y.cabeza, 8, viento);
        y.mira = [mezclar(y.mira[0], -1, viento), y.mira[1]];
      }
      break;
    }
    case 'mastica': {
      // Mastica a dos carrillos; traga, la pata se le mete y el bocado le baja por el cogote; al rato asoma otra vez.
      const x = M[2]!;
      const masca = loma(u, 0.1, 0.3, 1.7, 1.9);
      x.mastica = Math.max(x.mastica, masca * (0.5 + 0.5 * Math.sin(u * 17)));
      x.cabeza += masca * 3 * Math.sin(u * 17) - 10 * loma(u, 1.9, 2.05, 2.4, 2.7);
      m.pata = 1 - rampa(u, 1.8, 2.05) * (1 - rampa(u, 2.9, 3.3));
      m.bocado = loma(u, 2.0, 2.1, 2.5, 2.65);
      m.traga = rampa(u, 2.05, 2.6);
      x.mira = [mezclar(x.mira[0], 0, masca), mezclar(x.mira[1], 0.2, masca)];
      break;
    }
    case 'chasquean': {
      // Las tres pinzas chasquean sin orden: cada una a su tiempo, dos veces.
      M.forEach((x, i) => {
        const a = 0.15 + ((i * 0.37 + k * 0.21) % 0.9);
        const c = chasquido(u, a) + chasquido(u, a + 0.5 + i * 0.13);
        const brazos = [...x.brazos] as [number, number];
        const pinzas = [...x.pinzas] as [number, number];
        for (const p of [0, 1] as const) {
          if (i === 0 && p === 0) continue;
          pinzas[p] = pinzas[p] + 70 * c;
          brazos[p] = brazos[p] + 14 * c;
        }
        x.brazos = brazos;
        x.pinzas = pinzas;
        x.cabeza += 6 * c * (i % 2 ? 1 : -1);
      });
      break;
    }
    case 'pasan': {
      // La fuente de masitas va por el mantel de la del abanico a la que mastica, que se sirve, y vuelve.
      const va = rampa(u, 0.4, 1.3) * (1 - rampa(u, 2.3, 3.2));
      m.fuente = 86 * va;
      const x0 = M[0]!;
      const empuja = loma(u, 0.2, 0.45, 1.1, 1.4);
      x0.brazos = [x0.brazos[0], x0.brazos[1] - 10 * empuja];
      x0.pinzas = [x0.pinzas[0], x0.pinzas[1] + 30 * empuja];
      const sirve = loma(u, 1.4, 1.6, 1.9, 2.15);
      const x2 = M[2]!;
      x2.brazos = [x2.brazos[0] + 8 * sirve, x2.brazos[1]];
      x2.pinzas = [x2.pinzas[0] + 40 * sirve, x2.pinzas[1]];
      x2.mastica = Math.max(x2.mastica, loma(u, 2.1, 2.2, 3.0, 3.2) * (0.5 + 0.5 * Math.sin(u * 17)));
      const donde: Punto = [-48 + m.fuente, 23];
      M.forEach((x) => {
        const s = loma(u, 0.2, 0.4, 3.0, 3.3);
        const [mx, my] = miraA(M.indexOf(x), donde);
        x.mira = [mezclar(x.mira[0], mx, s), mezclar(x.mira[1], my, s)];
        x.cabeza -= 6 * s;
      });
      break;
    }
    case 'miran': {
      // Las pseudopupilas van de una a otra, después al que mira, y al final al macho que espera.
      const pasos: ReadonlyArray<readonly [Punto, Punto, Punto]> = [
        [[1, 0.1], [1, 0.1], [-1, 0.1]],
        [[1, 0.2], [-1, 0.2], [-1, 0.2]],
        [[0, 0.2], [0, 0.2], [0, 0.2]],
        [miraA(0, MACHO.llega), miraA(1, MACHO.llega), miraA(2, MACHO.llega)],
      ];
      const s = loma(u, 0, 0.1, 3.0, 3.2);
      const tramo = Math.min(3, Math.floor(u / 0.75));
      M.forEach((x, i) => {
        const [mx, my] = pasos[tramo]![i]!;
        x.mira = [mezclar(x.mira[0], mx, s), mezclar(x.mira[1], my, s)];
        x.gira = mezclar(x.gira, 0.25 * Math.sign(mx), s);
      });
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que pasa a los `u` segundos de que las tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copiar(b);
  const M = m.mantis;
  const Q = QUIETO.mantis;
  // Se quedan quietas de golpe: ni la hamaca ni el temblor, hasta que se calman.
  const quietas = rampa(u, 0.08, 0.16) * (1 - rampa(u, T.calma[0], T.calma[1]));
  M.forEach((x, i) => {
    x.hamaca *= 1 - quietas;
    x.corre *= 1 - quietas;
    x.antenas = [mezclar(x.antenas[0], Q[i]!.antenas[0], quietas), mezclar(x.antenas[1], Q[i]!.antenas[1], quietas)];
    x.pinzas = [mezclar(x.pinzas[0], Q[i]!.pinzas[0], quietas), mezclar(x.pinzas[1], Q[i]!.pinzas[1], quietas)];
  });

  // El macho: llega caminando por el mantel, saluda con el clavel y se sienta en el plato.
  const camina = rampa(u, T.llega[0], T.llega[1]);
  const sienta = rampa(u, T.sienta[0], T.sienta[1]);
  const vuelve = rampa(u, T.vuelve[0], T.vuelve[1] - 0.1);
  const [lx, ly] = MACHO.llega;
  const [px, py] = MACHO.plato;
  const [vx, vy] = MACHO.vuelve;
  const enElPlato = u < T.vuelve[0];
  m.macho.en = enElPlato
    ? [mezclar(mezclar(lx, px - 8, camina), px, sienta), mezclar(mezclar(ly, py + 2, camina), py, sienta)]
    : [mezclar(vx, lx, vuelve), mezclar(vy, ly, vuelve)];
  const andando = (u > T.llega[0] && u < T.llega[1] - 0.05) || (u > T.vuelve[0] && u < T.vuelve[1] - 0.15);
  m.macho.paso = andando ? (u * 2.4) % 1 : 0;
  const saluda = loma(u, T.saluda[0], T.saluda[0] + 0.15, T.saluda[1], T.sienta[1]);
  m.macho.saluda = mezclar(m.macho.saluda, 0.7 + 0.3 * Math.sin(u * 16), saluda);
  m.macho.sentado = enElPlato ? sienta : 0;
  const nac = u >= T.nac && u < T.vuelve[0];
  m.macho.ve = nac ? 0 : enElPlato ? 1 : rampa(u, T.vuelve[0], T.vuelve[0] + 0.4);
  // Lo que queda en el plato, hasta que vuelve el macho, como si nada.
  const queda = nac || u >= T.vuelve[0] ? 1 - rampa(u, T.vuelve[0] + 0.2, T.vuelve[1] - 0.2) : 0;
  m.flor = u >= T.nac ? queda : 0;
  m.antena = m.flor;

  // Las tres lo siguen con las pseudopupilas y con la cabeza, mientras se vea.
  const siguen = rampa(u, 0.1, 0.25) * (1 - rampa(u, T.nac, T.nac + 0.3));
  const donde: Punto = [m.macho.en[0], m.macho.en[1] - 18];
  M.forEach((x, i) => {
    const [mx, my] = miraA(i, donde);
    x.mira = [mezclar(x.mira[0], mx, siguen), mezclar(x.mira[1], my, siguen)];
    x.gira = mezclar(x.gira, 0.35 * mx, siguen);
    x.cabeza = mezclar(x.cabeza, 14 * mx, siguen * 0.7);
  });

  // Lo rodean con cortesía: se inclinan para el plato y levantan las pinzas, abiertas.
  const rodean = rampa(u, T.rodean[0], T.rodean[1]) * (1 - rampa(u, T.nac, T.nac + 0.12));
  const inclina = [9, 0, -9] as const;
  const corre = [10, 0, -8] as const;
  // ÑAC: en un cuadro las pinzas se cierran sobre el plato, y después mastican agachadas.
  const zarpa = rampa(u, T.nac - 0.04, T.nac) * (1 - rampa(u, T.mastican[0] + 0.2, T.mastican[0] + 0.6));
  const masca = loma(u, T.mastican[0], T.mastican[0] + 0.15, T.mastican[1] - 0.1, T.mastican[1] + 0.1);
  const limpia = loma(u, T.limpian[0], T.limpian[0] + 0.25, T.limpian[1] - 0.3, T.limpian[1]);
  M.forEach((x, i) => {
    const encima = rodean + zarpa;
    x.hamaca += inclina[i]! * Math.min(1, encima + 0.5 * masca);
    x.corre += corre[i]! * Math.min(1, encima + 0.5 * masca);
    x.cabeza = mezclar(x.cabeza, (i === 0 ? 10 : i === 2 ? -10 : 0), Math.max(rodean, zarpa));
    const brazos = [...x.brazos] as [number, number];
    const pinzas = [...x.pinzas] as [number, number];
    for (const p of [0, 1] as const) {
      // La del abanico no lo suelta: muerde con la otra.
      if (i === 0 && p === 0) continue;
      // La que está del lado de la tipa no levanta la pinza de afuera: no le va a meter la uña en la copa.
      const lejos = (i === 0 && p === 1) || (i === 2 && p === 0) ? 1 : i === 2 ? 0.3 : 0.6;
      brazos[p] = mezclar(brazos[p], 70 * lejos, rodean);
      pinzas[p] = mezclar(pinzas[p], 60, rodean);
      brazos[p] = mezclar(brazos[p], 30 * lejos - 6, zarpa);
      pinzas[p] = mezclar(pinzas[p], 2, zarpa);
      // Se limpian las pinzas con la servilleta: la levantan hasta la boca y se frotan las uñas, primero una y después la otra.
      const turno = i === 2 && p === 1 ? 0 : p === 0 ? loma(u, T.limpian[0], T.limpian[0] + 0.2, T.limpian[0] + 0.55, T.limpian[0] + 0.7) : loma(u, T.limpian[0] + 0.5, T.limpian[0] + 0.7, T.limpian[1] - 0.25, T.limpian[1]);
      brazos[p] = mezclar(brazos[p], 140 + 6 * Math.sin(u * 16 + i), limpia * turno);
      pinzas[p] = mezclar(pinzas[p], 14 + 12 * Math.sin(u * 16 + i), limpia * turno);
    }
    x.brazos = brazos;
    x.pinzas = pinzas;
    x.mastica = Math.max(x.mastica, masca * (0.5 + 0.5 * Math.sin(u * 19 + i)));
    x.cabeza += masca * (-8 + 3 * Math.sin(u * 19 + i));
    x.servilleta = Math.max(x.servilleta, limpia * (0.75 + 0.25 * Math.sin(u * 14 + i)));
    // Ya comidas, miran al que mira, como si nada.
    const nada = loma(u, T.mastican[0], T.mastican[0] + 0.2, T.calma[1], T.vuelve[0] + 0.3);
    x.mira = [mezclar(x.mira[0], 0, nada), mezclar(x.mira[1], 0.3, nada)];
  });
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al club con un azar que se puede fijar (el test lo fija). La isla usa `armarMantis`. */
export function armarMantisCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--mantis')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { giran: 0, antenas: 0, abanica: 0, mastica: 0, chasquean: 0, pasan: 0, miran: 0, devora: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let comido = false;
  let cual = 0;
  let lado = 1;
  let tiron = entre(TIRON);
  let quienTira = 0;
  let ladoTiron = 1;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'devora' ? ultima : a;
    desde = t;
    hechas[a]++;
    cual = Math.floor(azar() * 3);
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const b = base(t);
    // El tirón de la cabeza, que les hace de pestañeo: de golpe para un lado, y de vuelta.
    const v = t - tiron;
    if (v > 0 && v < TIRON_DURA) {
      const x = b.mantis[quienTira]!;
      const k = v < 0.05 ? v / 0.05 : v < TIRON_DURA - 0.08 ? 1 : (TIRON_DURA - v) / 0.08;
      x.cabeza += 13 * ladoTiron * k;
    }
    const u = t - desde;
    if (accion === 'devora') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u, cual, lado);
    return b;
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero') p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(comido ? SOLA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - tiron > TIRON_DURA) {
      tiron = t + entre(TIRON);
      quienTira = Math.floor(azar() * 3);
      ladoTiron = azar() < 0.5 ? -1 : 1;
    }
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocadas: lo que estén haciendo lo dejan, salvo que ya estén devorando. */
  const tocado = (t: number): void => {
    if (accion !== 'devora') empezar('devora', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      comido = !comido;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dicen su verso arriba de las antenas de la del medio, y la página abre la ficha. */
  const decir = (): void => esc.hablar(ID, VERSO[0], VERSO[1]);
  titere.addEventListener('click', tocar);
  titere.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });

  pintar(0, 0);
  return {
    mover: pintar,
    reaccionar: (id, t) => {
      if (id !== ID) return false;
      if (!esc.quieto()) tocado(t);
      return true;
    },
    estado: () => ({ accion, hechas: { ...hechas } }),
  };
}

export const armarMantis: Armar = (marcos, esc) => armarMantisCon(marcos, esc);
