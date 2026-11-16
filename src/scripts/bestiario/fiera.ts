/**
 * La fiera más fiera (`D-73`, vigesimonovena vuelta), en su jaula de la prisión. No se la ve nunca.
 *
 * Lo que hace sola se le nota en lo que tiene puesto y en lo que toca, y nada es un bucle: elige qué intenta.
 *
 * - **Roe**: el hueso sube del piso a donde tendría la boca, se sacude, y se le cae.
 * - **Encara la puerta**: el collar va hasta el hueco, la cadena se pone tirante y la frena en seco; la puerta se
 *   le cierra en el hocico y vuelve a abrirse sola. Nunca sale.
 * - **Se echa**: da tres vueltas en el lugar, el collar baja a la paja y ahí respira; después se para.
 * - **Huele** a quien mira: el collar se viene para adelante y echa dos bocanadas.
 * - Respira (el vaho sale donde tendría la boca), y la chapita gira y se hamaca.
 *
 * Tocada, **contesta la pregunta sin dejarse ver**: toma carrera, se tira contra los barrotes, que se comban, deja
 * cuatro tajos en el aire, la cadena la frena y la jaula entera se sacude. Después vuelve a su lugar y los barrotes
 * se enderezan. Con movimiento reducido no se mueve nada: tocarla pasa de la jaula quieta a la jaula combada.
 *
 * Se lleva números (`rig-fiera.ts`) y nada que dibuje.
 */

import { ATACA, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-fiera.ts';
import { arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'la-fiera-mas-fiera';

export type Accion = 'roe' | 'puerta' | 'echa' | 'huele';
const SOLAS = ['roe', 'puerta', 'echa', 'huele'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { roe: 3.8, puerta: 4, echa: 5.6, huele: 3.2, toque: 4.6 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { carrera: [0, 0.4], salto: [0.4, 0.62], aguanta: [0.62, 2.7], vuelve: [2.7, 3.8] } as const;
/** Cuánto tarda en respirar. */
const ALIENTO = 3.4;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));

/** La pose de base de un instante: parada, respira; la chapita gira despacio y la puerta se mece. */
export function base(t: number, _ev: (n: string) => number): Momento {
  const p = (((t % ALIENTO) + ALIENTO) % ALIENTO) / ALIENTO;
  // Llena despacio y larga rápido: el vaho sale al largar.
  const pecho = p < 0.62 ? p / 0.62 : 1 - (p - 0.62) / 0.38;
  return {
    ...QUIETO,
    dy: -3 * suave(pecho),
    ladea: 2 * Math.sin(t * 0.6),
    chapita: 0.5 + t * 1.1,
    cuelga: 7 * Math.sin(t * 1.3 + 1),
    aliento: p < 0.62 ? 0.12 : 0.12 + 0.6 * Math.sin((Math.PI * (p - 0.62)) / 0.38),
    puerta: 0.9 + 0.05 * Math.sin(t * 0.7),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'roe': {
      // Baja la cabeza a buscarlo, lo levanta, lo sacude, y se le cae: rebota dos veces.
      const baja = loma(u, 0, 0.35, 0.5, 0.9);
      m.dy = b.dy + 46 * baja;
      m.dx = -14 * baja;
      m.ladea = mezclar(b.ladea, -24, baja);
      m.hueso = rampa(u, 0.45, 0.95) * (u < 2.5 ? 1 : 0);
      const roe = loma(u, 1, 1.2, 2.3, 2.5);
      m.roe = 16 * roe * Math.sin(u * 24);
      m.ladea += 6 * roe * Math.sin(u * 24 + 1);
      m.aliento = Math.max(b.aliento, 0.5 * roe);
      if (u >= 2.5) m.rebota = 14 * arco((u - 2.5) / 0.34) * (u < 2.84 ? 1 : 0) + 5 * arco((u - 2.84) / 0.22);
      // Se queda mirándolo, y larga el aire.
      m.aliento = Math.max(m.aliento, 0.9 * loma(u, 2.9, 3.1, 3.4, 3.8));
      break;
    }
    case 'puerta': {
      // Va hasta el hueco; la cadena se pone tirante y la puerta se le cierra en el hocico.
      const va = loma(u, 0.2, 1.3, 2.4, 3.4);
      const freno = u > 1.3 && u < 1.7 ? arco((u - 1.3) / 0.4) : 0;
      m.dx = -62 * va + 16 * freno;
      m.dy = b.dy + 3 * Math.sin(u * 10) * va - 4 * freno;
      m.ladea = mezclar(b.ladea, -10, va) + 14 * freno;
      m.cuelga = b.cuelga + 26 * freno;
      m.puerta = mezclar(b.puerta, -0.8, loma(u, 1.1, 1.3, 2.6, 3.8));
      m.aliento = Math.max(b.aliento, loma(u, 1.6, 1.8, 2.2, 2.6));
      break;
    }
    case 'echa': {
      // Tres vueltas en el lugar, se desploma en la paja, respira ahí, y se para despacio.
      const gira = rampa(u, 0.2, 2.1);
      const k = loma(u, 0.2, 0.5, 1.9, 2.1);
      m.dx = 15 * k * Math.sin(gira * Math.PI * 6);
      m.dy = b.dy + 5 * k * Math.cos(gira * Math.PI * 6);
      m.ladea = b.ladea + 12 * k * Math.cos(gira * Math.PI * 6);
      const abajo = rampa(u, 2.1, 2.45) * (1 - rampa(u, 4.5, 5.4));
      m.dy += 104 * abajo;
      m.dx += 10 * abajo;
      m.ladea += 8 * abajo;
      m.chapita = mezclar(b.chapita, 0.3, abajo);
      m.cuelga = b.cuelga * (1 - abajo);
      break;
    }
    case 'huele': {
      // Se viene para el lado de quien mira, y echa dos bocanadas.
      const k = loma(u, 0.2, 0.9, 2.2, 3);
      m.cerca = 0.8 * k;
      m.dy = b.dy + 10 * k;
      m.dx = -18 * k;
      m.ladea = b.ladea + 9 * k * Math.sin(u * 3);
      m.aliento = Math.max(b.aliento * (1 - k), loma(u, 1, 1.15, 1.4, 1.6), loma(u, 1.7, 1.85, 2.1, 2.4));
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que la tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // Toma carrera para atrás, despacio; salta de golpe; la cadena la frena; vuelve caminando.
  const atras = loma(u, T.carrera[0], T.carrera[1], T.salto[0], T.salto[0] + 0.1);
  const adelante = rampa(u, T.salto[0], T.salto[1]) * (1 - rampa(u, T.vuelve[0], T.vuelve[1]));
  const golpe = u > T.salto[1] ? Math.exp(-(u - T.salto[1]) * 2.2) : 0;
  m.dx = 22 * atras + ATACA.dx * adelante + 5 * golpe * Math.sin((u - T.salto[1]) * 30);
  m.dy = b.dy * (1 - adelante) + 10 * atras + ATACA.dy * adelante;
  m.ladea = mezclar(b.ladea, ATACA.ladea, adelante) + 10 * atras;
  m.cerca = ATACA.cerca * adelante;
  m.cuelga = b.cuelga + 30 * golpe * Math.sin((u - T.salto[1]) * 12) + ATACA.cuelga * adelante * (1 - golpe);
  m.chapita = b.chapita + 9 * rampa(u, T.salto[0], T.aguanta[1]);
  // Los barrotes se comban con el golpe y se enderezan, con un temblor, cuando afloja.
  const afloja = rampa(u, T.vuelve[0], T.vuelve[0] + 0.5);
  m.comba = rampa(u, T.salto[1] - 0.08, T.salto[1]) * (1 - afloja);
  m.tajos = rampa(u, T.salto[1] - 0.04, T.salto[1] + 0.04) * (1 - rampa(u, T.aguanta[1] - 0.5, T.aguanta[1] + 0.1));
  m.tiembla = 4 * golpe * Math.sin((u - T.salto[1]) * 46) + (afloja > 0 && afloja < 1 ? 2 * Math.sin(u * 50) * (1 - afloja) : 0);
  m.aliento = Math.max(b.aliento * (1 - adelante), adelante * (0.7 + 0.3 * Math.sin(u * 9)));
  m.puerta = mezclar(b.puerta, 1, adelante) - 0.5 * golpe * Math.abs(Math.sin((u - T.salto[1]) * 7));
  // El hueso salta del susto.
  m.rebota = u > T.salto[1] && u < T.salto[1] + 0.4 ? 12 * arco((u - T.salto[1]) / 0.4) : 0;
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--fiera',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.2, 3.6],
  primera: [1, 2.4],
  demoraFicha: 1.6,
  ritmos: {},
  quieto: QUIETO,
  toca: ATACA,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarFieraCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarFiera = armarCon(CONFIG);
