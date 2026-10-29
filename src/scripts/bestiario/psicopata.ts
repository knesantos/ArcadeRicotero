/**
 * El buen psicópata (`D-73`, decimosexta vuelta), en el baldío, mirando un cuadro con su perro.
 *
 * Lo que hacen solos sale de la letra y de la tapa, y nada es un bucle: cada cosa tiene su tiempo.
 *
 * - **Él contempla el fusilamiento** como en un museo: respira, se acerca al cuadro a mirar un
 *   detalle y vuelve, ladea la cabeza. Cada tanto te mira de reojo por encima del hombro: el
 *   buen psicópata no pierde de vista a nadie.
 * - **El perro de la parabellum** está sentado, con la pistola en la cabeza: para las orejas, barre la
 *   tierra con la cola, mira el cuadro y lo mira a él. Y a veces, de la nada, **tira un salto mortal**
 *   (*"la noche tira un salto mortal"*): se agacha, salta, da la vuelta entera y cae sentado.
 *
 * Tocado, **el perro dispara**: levanta el caño y, con el humo, sale una banderita violeta que dice
 * *BANG* en las letras amarillas de la contratapa del disco. El culatazo lo tira en un salto mortal
 * para atrás. Él ni se inmuta: se da vuelta, te mira y te saluda tocándose la gorra, como un señor. La
 * banderita vuelve a entrar en el caño y él vuelve al cuadro. Dice su verso. Con movimiento reducido no
 * se mueve nada: tocarlo lo pasa de la pose quieta a la del saludo, con la banderita afuera.
 *
 * Se lleva números (`rig-psicopata.ts`) y nada que dibuje.
 */

import { PERRO_QUIETO, QUIETA, SALUDA, SALUDO, VERSO, brazo, marcas, type Momento, type Perro, type Punto } from '../../lib/bestiario/rig-psicopata.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-buen-psicopata';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  acerca: [8, 15],
  reojo: [13, 24],
  salto: [13, 24],
  primerSalto: [5, 9],
  orejas: [1.5, 4.5],
  mira: [2, 5],
  parpadeo: [2.6, 6],
} as const;

/** Cuánto dura cada cosa. */
export const DURA = { acerca: 3.2, reojo: 1.8, salto: 1.5, bang: 3.6 } as const;

/** El disparo, en segundos desde que lo tocan: el caño arriba, el tiro, el saludo y la vuelta al cuadro. */
export const BANG = { apunta: 0.25, tiro: 0.3, afuera: 0.42, adentro: 2.6, guarda: 3, salta: 0.32 } as const;

/**
 * Cuánto espera para abrir la ficha después del toque, en segundos: que se vea la banderita, el salto
 * mortal y el saludo. En el teléfono la ficha tapa la mitad de abajo de la escena, que es donde pasa;
 * con movimiento reducido se abre enseguida.
 */
export const DEMORA_FICHA = 1.1;

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclaP = (a: Punto, b: Punto, k: number): Punto => [mezcla(a[0], b[0], k), mezcla(a[1], b[1], k)];
const entre01 = (v: number): number => Math.min(1, Math.max(0, v));
/** Sube de 0 a 1 entre `a` y `b`. */
const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
/** Sube entre `a` y `b`, se queda, y baja entre `c` y `d`. */
const meseta = (u: number, a: number, b: number, c: number, d: number): number => Math.min(rampa(u, a, b), 1 - rampa(u, c, d));

/**
 * El salto mortal, en el tiempo `u` desde que arranca (de 0 a `DURA.salto`): se agacha, salta para
 * arriba y para atrás dando la vuelta entera, y cae agachado. `atras` es cuánto se corre (el culatazo).
 */
export function saltoMortal(u: number, atras = 0): Pick<Perro, 'x' | 'y' | 'giro' | 'agacha'> {
  if (u <= 0 || u >= DURA.salto) return { x: 0, y: 0, giro: 0, agacha: 0 };
  const agacha = u < 0.3 ? rampa(u, 0, 0.26) : u > 1.1 ? 1 - rampa(u, 1.2, DURA.salto) : 0;
  const k = entre01((u - 0.3) / 0.8);
  // En el aire: una parábola, y la vuelta entera, que arranca lenta y termina rápida.
  const y = u > 0.3 && u < 1.1 ? -4 * 74 * k * (1 - k) : 0;
  const giro = u > 0.3 ? 360 * suave(k) : 0;
  const x = atras * (u > 0.3 ? suave(k) * (1 - rampa(u, 1.1, DURA.salto) * 0.5) : 0);
  return { x, y, giro: giro >= 359.9 ? 0 : giro, agacha };
}

/** El disparo, en el tiempo `u` desde que lo tocaron: lo del perro y lo de él. */
export function disparo(u: number): {
  cabezaPerro: number; bandera: number; humo: { k: number; o: number }; salto: Pick<Perro, 'x' | 'y' | 'giro' | 'agacha'>;
  vuelta: number; saluda: number; gorra: number;
} {
  // `|| 0`: que la cabeza quieta sea un cero y no un cero negativo.
  const cabezaPerro = -14 * meseta(u, 0, BANG.apunta, BANG.adentro, BANG.guarda) || 0;
  const bandera = u < BANG.tiro ? 0 : u < BANG.afuera ? (u - BANG.tiro) / (BANG.afuera - BANG.tiro) : 1 - rampa(u, BANG.adentro, BANG.guarda);
  const h = (u - BANG.tiro) / 1.1;
  const humo = h >= 0 && h <= 1 ? { k: 0.5 + h * 1.8, o: Math.min(1, h * 10) * (1 - h) } : { k: 1, o: 0 };
  return {
    cabezaPerro,
    bandera: entre01(bandera),
    humo,
    salto: saltoMortal(u - BANG.salta, 26),
    vuelta: meseta(u, 0.45, 0.9, 2.9, 3.4),
    saluda: meseta(u, 0.7, 1.2, 2.5, 3.1),
    gorra: meseta(u, 1.1, 1.45, 2.25, 2.6),
  };
}

export interface Estado {
  disparando: boolean;
  saltos: number;
  bandera: number;
  vuelta: number;
}

/** Arma al psicópata con un azar que se puede fijar (el test lo fija). La isla usa `armarPsicopata`. */
export function armarPsicopataCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--psicopata')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ disparando: false, saltos: 0, bandera: 0, vuelta: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  /** Cuándo abre la ficha: después del gesto (`DEMORA_FICHA`). */
  let hablarEn: number | null = null;
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let bangDesde = -100;
  let saltoDesde = -100;
  let saltos = 0;
  let proximoSalto = entre(TIEMPOS.primerSalto);
  let acercaDesde = -100;
  let proximoAcerca = entre(TIEMPOS.acerca);
  let reojoDesde = -100;
  let proximoReojo = entre(TIEMPOS.reojo);
  let orejasDesde = -100;
  let proximasOrejas = entre(TIEMPOS.orejas);
  let miraAlCuadro = true;
  let proximaMirada = entre(TIEMPOS.mira);
  let parpadeo = entre(TIEMPOS.parpadeo);
  let parpadeoPerro = entre(TIEMPOS.parpadeo);
  let cabezaPerro = 0;
  let ultimo: Momento = QUIETA;
  let saludandoQuieto = false;

  const disparando = (t: number): boolean => t - bangDesde < DURA.bang;
  const bang = (t: number): void => {
    if (disparando(t)) return;
    bangDesde = t;
  };

  function momento(t: number, paso: number): Momento {
    const m: Momento = { ...QUIETA, perro: { ...PERRO_QUIETO } };
    m.respira = Math.sin(t * 1.3);

    // Se acerca al cuadro a mirar un detalle, y vuelve.
    if (t > proximoAcerca && !disparando(t)) {
      acercaDesde = t;
      proximoAcerca = t + DURA.acerca + entre(TIEMPOS.acerca);
    }
    const acerca = meseta(t - acercaDesde, 0, 0.9, DURA.acerca - 0.9, DURA.acerca);
    m.inclina = -6 * acerca;
    m.cabeza = 4 * acerca + Math.sin(t * 0.4) * 1.5;

    // De reojo, por encima del hombro.
    if (t > proximoReojo && !disparando(t) && acerca < 0.05) {
      reojoDesde = t;
      proximoReojo = t + DURA.reojo + entre(TIEMPOS.reojo);
    }
    m.vuelta = 0.85 * meseta(t - reojoDesde, 0, 0.4, DURA.reojo - 0.4, DURA.reojo);

    // El perro: las orejas, la cola, y adónde mira.
    if (t > proximasOrejas) {
      orejasDesde = t;
      proximasOrejas = t + entre(TIEMPOS.orejas);
    }
    const uo = t - orejasDesde;
    m.perro.orejas = uo < 0.5 ? Math.sin(uo * 40) * Math.exp(-uo * 6) : 0;
    m.perro.cola = Math.sin(t * 2.2) * 0.4 + Math.sin(t * 0.7) * 0.3;
    if (t > proximaMirada) {
      miraAlCuadro = !miraAlCuadro;
      proximaMirada = t + entre(TIEMPOS.mira);
    }
    let metaCabezaPerro = miraAlCuadro ? -4 : 8;

    // El salto mortal, solo.
    if (t > proximoSalto && !disparando(t)) {
      saltoDesde = t;
      saltos++;
      proximoSalto = t + DURA.salto + entre(TIEMPOS.salto);
    }
    Object.assign(m.perro, saltoMortal(t - saltoDesde));

    // El disparo.
    if (disparando(t)) {
      const d = disparo(t - bangDesde);
      metaCabezaPerro = d.cabezaPerro;
      m.bandera = d.bandera;
      m.humo = d.humo;
      Object.assign(m.perro, d.salto);
      if (d.salto.giro || d.salto.agacha) m.perro.orejas = 1;
      m.vuelta = Math.max(m.vuelta, d.vuelta);
      m.mano = d.saluda > 0.001 ? mezclaP(manoAbajo(m), SALUDO, d.saluda) : null;
      m.gorra = d.gorra;
      m.cabeza = mezcla(m.cabeza, -2, d.vuelta);
    }
    cabezaPerro += (metaCabezaPerro - cabezaPerro) * Math.min(1, paso * (disparando(t) ? 18 : 3));
    m.perro.cabeza = cabezaPerro;

    // Los párpados: los dos parpadean, cada uno a su tiempo.
    if (t > parpadeo + 0.14) parpadeo = t + entre(TIEMPOS.parpadeo);
    if (t > parpadeoPerro + 0.12) parpadeoPerro = t + entre(TIEMPOS.parpadeo);
    m.parpado = t > parpadeo && t < parpadeo + 0.14 ? 1 : QUIETA.parpado;
    m.perro.parpado = t > parpadeoPerro && t < parpadeoPerro + 0.12 ? 1 : PERRO_QUIETO.parpado;
    return m;
  }

  /** La mano abajo, con la correa, donde la deja la pose sin el saludo: de ahí sube a la gorra. */
  const manoAbajo = (m: Momento): Punto => brazo({ ...m, mano: null }).mano;

  function aplicar(m: Momento): void {
    ultimo = m;
    const { transform, opacity, d } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
    for (const [nombre, valor] of Object.entries(d)) p.get(nombre)?.setAttribute('d', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(saludandoQuieto ? SALUDA : QUIETA);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETA);
      return;
    }
    aplicar(momento(t, Math.min(dt, 0.1)));
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      saludandoQuieto = !saludandoQuieto;
      pintar(t, 0);
      decir();
    } else {
      bang(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso, y la página abre la ficha. */
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
      if (!esc.quieto()) bang(t);
      return true;
    },
    estado: () => ({ disparando: disparando(esc.reloj()), saltos, bandera: ultimo.bandera, vuelta: ultimo.vuelta }),
  };
}

export const armarPsicopata: Armar = (marcos, esc) => armarPsicopataCon(marcos, esc);
