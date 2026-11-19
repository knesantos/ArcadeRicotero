/**
 * El as del Club París (`D-73`, vigesimonovena vuelta), parado en el muelle al lado de su valija.
 *
 * Lo que hace solo es hacerse el señor, y nada es un bucle: elige cómo.
 *
 * - **Revolea la moneda**: la tira para arriba, abre el guante para atajarla y le pasa de largo; pica en el muelle y
 *   se le va rodando atrás de la valija. La mira irse, y saca otra de atrás del canto.
 * - **Se pone de canto**: gira para mirar el río, y como es un naipe, a mitad de camino casi no está: quedan dos
 *   piernas y una raya. Se queda de espaldas un rato, mostrando el dorso, y vuelve.
 * - **Sopla el matasuegras**: se lo lleva a la boca, sopla, y sale torcido y se le cae; sopla otra vez, se estira
 *   entero un instante y se desinfla.
 * - Respira, pestañea con el párpado pesado, y el bigote postizo se le va torciendo.
 *
 * Tocado (*"pero cabe todo lo tuyo en una maldita valija"*) **cabe**: suelta la moneda, abre la valija, va hasta
 * ella, se dobla al medio y se mete; se queda un rato así, agarrado del canto; se dobla otra vez, entra del todo y
 * la tapa se cierra. La galera queda arriba de la valija. Después sale de un salto, todavía doblado y sentado en las
 * piernas, cae parado, se desdobla y la moneda vuelve al guante, con
 * el bigote torcido para el otro lado. Con movimiento reducido no se mueve nada: tocarlo lo pasa de parado a medio
 * adentro de la valija.
 *
 * Se lleva números (`rig-asparis.ts`) y nada que dibuje.
 */

import { ASPARIS_ARMADO, CABE, QUIETO, VERSO, copete, guanteDe, marcas, type Momento, type Punto } from '../../lib/bestiario/rig-asparis.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-as-del-club-paris';

export type Accion = 'moneda' | 'canto' | 'matasuegras';
const SOLAS = ['moneda', 'canto', 'matasuegras'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { moneda: 5.4, canto: 5, matasuegras: 4.2, toque: 7.1 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = {
  abre: [0.3, 0.8],
  camina: [0.4, 1.1],
  dobla: [1.1, 1.8],
  entra: [3.4, 3.9],
  cierra: [3.9, 4.15],
  abreOtra: [5, 5.25],
  asoma: [5.3, 5.7],
  salta: [5.7, 6.2],
  despliega: [6.25, 6.75],
  fin: 7.1,
} as const;
/** Los tiempos de ponerse de canto: cuándo es una raya (a la ida y a la vuelta) y cuándo está de espaldas. */
export const CANTO_T = { raya: [0.5, 1.1], espaldas: [1.5, 3.3], rayaVuelta: [3.7, 4.1] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const A = ASPARIS_ARMADO;
const entre = ([ax, ay]: Punto, [bx, by]: Punto, k: number): Punto => [mezclar(ax, bx, k), mezclar(ay, by, k)];

/** La pose de base de un instante: parado, haciéndose el señor. */
export function base(t: number, ev: (n: string) => number): Momento {
  const p = ev('pestanea');
  const tic = ev('tic');
  return {
    ...QUIETO,
    respira: aliento(t, 3.2),
    ladea: QUIETO.ladea + 1.4 * Math.sin(t * 0.5),
    parpado: p >= 0 ? 1 : 0,
    // El bigote es postizo: se va despegando de a poco, y de un tic lo acomoda.
    bigote: QUIETO.bigote + 2.4 * Math.sin(t * 0.9 + 1) - (tic >= 0 ? 12 * Math.sin(tic * Math.PI) : 0),
    // La galera llega después que el naipe.
    galera: [0, 0, QUIETO.galera[2] + 2.4 * Math.sin(t * 0.5 - 0.9)],
    brazos: [QUIETO.brazos[0] + 2 * Math.sin(t * 0.6 - 0.5), QUIETO.brazos[1] - 2 * Math.sin(t * 0.6 - 0.8)],
  };
}

/** Lo que hace a los `u` segundos de empezar una acción solo, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'moneda': {
      // Toma envión, la revolea, y abre el guante para atajarla.
      const envion = loma(u, 0, 0.3, 0.3, 0.42);
      const espera = loma(u, 0.3, 0.45, 1.5, 2);
      m.brazos = [b.brazos[0], b.brazos[1] + 14 * envion - 46 * espera];
      if (u >= 0.4 && u < 3.4) {
        m.enMano = false;
        const suelta = guanteDe({ ...b, brazos: [b.brazos[0], b.brazos[1] - 40] }, 1);
        if (u < 1.5) {
          // Sube, da vueltas y le pasa de largo al guante.
          const k = (u - 0.4) / 1.1;
          const [x, y] = entre(suelta, A.cae, k);
          m.moneda = [x, y - 190 * arco(k)];
          m.vueltas = 4.5 * k;
        } else {
          // Pica dos veces y se va rodando atrás de la valija.
          const r = rampa(u, 1.8, 3);
          m.moneda = [mezclar(A.cae[0], A.rueda, r), A.cae[1] - 12 * arco((u - 1.5) / 0.3) - 5 * arco((u - 1.8) / 0.22)];
          m.vueltas = 0;
        }
        m.monedaSe = u < 3 ? 1 : 0;
      }
      // La mira irse: se ladea para ese lado, pestañea despacio. Y saca otra de atrás del canto.
      m.ladea = b.ladea + 5 * loma(u, 1.6, 2.2, 3.2, 3.8);
      m.parpado = u > 3.1 && u < 3.5 ? 1 : b.parpado;
      const saca = loma(u, 3, 3.5, 4.2, 5);
      m.brazos = [m.brazos[0], m.brazos[1] + 70 * saca];
      if (u >= 3.4 && u < 4) m.monedaSe = 0;
      break;
    }
    case 'canto': {
      // Gira para mirar el río. A mitad de camino es una raya; de espaldas muestra el dorso.
      const C = CANTO_T;
      const ida = rampa(u, 0, C.raya[0]) + rampa(u, C.raya[1], C.espaldas[0]);
      const vuelta = rampa(u, C.espaldas[1], C.rayaVuelta[0]) + rampa(u, C.rayaVuelta[1], 4.6);
      m.cara = 1 - ida + vuelta;
      const deEspaldas = loma(u, C.espaldas[0], C.espaldas[0] + 0.3, C.espaldas[1] - 0.3, C.espaldas[1]);
      m.ladea = b.ladea + 4 * deEspaldas * Math.sin(u * 1.6);
      m.brazos = [mezclar(b.brazos[0], 4, deEspaldas), mezclar(b.brazos[1], -4, deEspaldas)];
      m.naipe = [0, -4 * arco(u / 0.5) - 4 * arco((u - 4.1) / 0.5)];
      break;
    }
    case 'matasuegras': {
      // Se lo lleva a la boca con el guante de la izquierda y sopla: sale torcido y se le cae. Sopla otra vez.
      const alza = loma(u, 0, 0.5, 3.5, 4.1);
      m.brazos = [mezclar(b.brazos[0], -78, alza), b.brazos[1]];
      m.mataSe = u > 0.4 && u < 3.6 ? 1 : 0;
      const sopla1 = loma(u, 0.7, 1, 1.5, 1.9);
      const sopla2 = loma(u, 1.9, 2.15, 2.3, 3.2);
      m.mata = 0.16 + 0.6 * sopla1 + 0.84 * sopla2 * (1 - 0.4 * rampa(u, 2.4, 3)) + 0.03 * Math.sin(u * 40) * (sopla1 + sopla2);
      m.mataCae = 40 * loma(u, 1, 1.5, 1.8, 2.1) + 52 * loma(u, 2.35, 2.9, 3.2, 3.5);
      const esfuerzo = Math.max(loma(u, 0.7, 0.9, 1.3, 1.5), loma(u, 1.9, 2.05, 2.3, 2.5));
      m.parpado = esfuerzo > 0.5 ? 1 : b.parpado;
      m.galera = [b.galera[0], -7 * esfuerzo, b.galera[2] - 6 * esfuerzo];
      m.chico = 1 + 0.03 * esfuerzo;
      break;
    }
  }
  return m;
}

/** Dónde queda la galera cuando la valija se cerró: arriba de la tapa. */
const SOBRE_LA_TAPA: Punto = [A.valija.x + 4, -A.valija.alto - 9];

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // Va hasta la valija, se dobla al medio y se mete de un salto; después entra del todo, y al final sale por donde entró.
  const camina = rampa(u, T.camina[0], T.camina[1]);
  const mete = rampa(u, T.dobla[0], T.dobla[1]);
  const entra = rampa(u, T.entra[0], T.entra[1]) * (1 - rampa(u, T.asoma[0], T.asoma[1]));
  const sale = rampa(u, T.salta[0], T.salta[1]);
  const [mx, my] = A.medioAdentro;
  const x = mezclar(mezclar(56 * camina, mx, mete), 0, sale);
  // Al salir ya va sentado en las piernas: el doblez apoya en ellas todo el salto, así que nunca flota.
  const saliendo = u >= T.salta[0];
  const sentadoEnLaValija = my - (A.pie - A.doblez) * A.justo;
  const y = (saliendo ? mezclar(sentadoEnLaValija, 0, sale) - 30 * arco(sale) : mezclar(0, my, mete) + (A.adentro[1] - my) * entra - 34 * arco((u - T.dobla[0]) / 0.5)) - 5 * (arco((u - 0.45) / 0.3) + arco((u - 0.78) / 0.3));
  m.sentado = saliendo ? 1 : 0;
  m.naipe = [x, y];
  const doblado = rampa(u, T.dobla[0] + 0.1, T.dobla[0] + 0.7) * (1 - rampa(u, T.despliega[0], T.despliega[1]));
  m.dobla = doblado;
  m.dobla2 = entra;
  // Las piernas: las junta antes de doblarse, y son lo primero que saca al salir, las dos juntas, todavía atrás del
  // frente de la valija. Cae parado en ellas, y recién ahí se despliega.
  m.piernas = 1 - rampa(u, T.dobla[0], T.dobla[0] + 0.25) + rampa(u, T.salta[0], T.salta[0] + 0.12);
  m.chico = mezclar(1, A.justo, mete * (1 - sale));
  m.brazos = [mezclar(b.brazos[0], 0, doblado), mezclar(b.brazos[1], 0, doblado)];
  m.brazosSe = doblado < 0.25 ? 1 : 0;
  m.ladea = mezclar(b.ladea, CABE.ladea + 3 * Math.sin(u * 2.2), doblado);
  m.naipeSe = u > T.cierra[1] && u < T.abreOtra[0] + 0.05 ? 0 : 1;
  // La valija: se abre, se le cierra con él adentro, se sacude, y se vuelve a abrir.
  m.tapa = loma(u, T.abre[0], T.abre[1], T.cierra[0], T.cierra[1]) + loma(u, T.abreOtra[0], T.abreOtra[1], T.salta[1] - 0.1, T.fin - 0.2);
  m.sacude = Math.sin(u * 42) * loma(u, T.cierra[1] + 0.1, T.cierra[1] + 0.2, T.abreOtra[0] - 0.3, T.abreOtra[0] - 0.1);
  m.guante = (u >= T.dobla[1] - 0.05 && u < T.entra[0]) || (u >= T.asoma[1] - 0.1 && u < T.salta[0] + 0.05) ? 1 : 0;
  // La moneda se le cae del susto y queda en el muelle; al final salta de vuelta al guante.
  const vuelve = rampa(u, T.salta[1] - 0.1, T.fin - 0.25);
  if (u >= 0.1 && vuelve < 1) {
    m.enMano = false;
    const cae = rampa(u, 0.1, 0.55);
    const desde = guanteDe(b, 1);
    const [cx, cy] = entre(desde, A.cae, cae);
    const [hx, hy] = entre([cx, cy - 16 * arco(cae)], guanteDe(m, 1), vuelve);
    m.moneda = [hx, hy - 46 * arco(vuelve)];
    m.vueltas = mezclar(mezclar(0, CABE.vueltas + 1, cae), 3, vuelve);
  }
  // La galera salta del susto, queda arriba de la tapa cuando se cierra, y vuelve a la cabeza cuando él sale.
  const afuera = rampa(u, T.cierra[0] - 0.05, T.cierra[1]) * (1 - rampa(u, T.asoma[0], T.asoma[1]));
  const [gx, gy] = copete(m);
  m.galera = [
    (SOBRE_LA_TAPA[0] - gx) * afuera,
    (SOBRE_LA_TAPA[1] - gy) * afuera - 16 * arco(u / 0.35) - 22 * arco((u - T.abreOtra[0]) / 0.5),
    mezclar(mezclar(b.galera[2], CABE.galera[2], doblado), -4, afuera),
  ];
  // El bigote se le tuerce para un lado adentro, y para el otro cuando sale.
  m.bigote = mezclar(b.bigote, CABE.bigote, doblado) + 24 * loma(u, T.salta[0], T.salta[0] + 0.3, T.fin - 0.5, T.fin);
  m.parpado = u > 2.4 && u < 2.56 ? 1 : 0;
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--asparis',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.4, 3.8],
  primera: [0.9, 2.2],
  demoraFicha: 2.6,
  ritmos: { pestanea: { cada: [2.6, 5.6], dura: 0.2 }, tic: { cada: [6, 12], dura: 0.5 } },
  quieto: QUIETO,
  toca: CABE,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarAsparisCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarAsparis = armarCon(CONFIG);
