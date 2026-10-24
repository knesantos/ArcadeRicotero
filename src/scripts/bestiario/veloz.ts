/**
 * El diablo más veloz (`D-73`, vigésima vuelta), arrastrando los pies por el damero del infierno.
 *
 * Lo que hace solo es lo del que no tiene tiempo y no se apura, y nada es un bucle: elige qué hacer
 * cada vez.
 *
 * - **Arrastra los pies** hasta otro lugar del damero, despacísimo, hamacándose, y las pezuñas sacan
 *   chispas del piso.
 * - **Mira el reloj**: lo levanta de la cadena, lo mira, lo sacude. No tiene agujas.
 * - **Muerde la manzana**: la tira para arriba y la muerde en el aire, con sello de prohibido y todo, y la
 *   vuelve a agarrar. Mastica, y la barba mastica con él.
 * - **Saca la lengua de oro**, y se ríe.
 *
 * Tocado, **es el más veloz** (*"llegó y pateó la Caja de los Truenos y sonrió"*): en un parpadeo está al
 * lado de la caja, dejando el borrón atrás; le pega una patada, la tapa vuela, se escapan los truenos, y
 * sonríe con la lengua de oro. Después vuelve a su lugar arrastrando los pies, como siempre. Dice su verso.
 * Con movimiento reducido no se mueve nada: tocarlo lo pasa de quieto a la patada.
 *
 * Se lleva números (`rig-veloz.ts`) y nada que dibuje.
 */

import { HASTA_LA_CAJA, PATADA, QUIETO, VELOZ, VERSO, bocaCon, manoDeLaFruta, marcas, type Momento } from '../../lib/bestiario/rig-veloz.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-diablo-mas-veloz';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos (arrastrar depende de cuánto camina). */
export const DURA = { arrastra: 0, reloj: 2.8, muerde: 2.6, lengua: 2, patada: 3 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1, 2.8] as const;
export const PRIMERA = [0.6, 1.8] as const;

/** Lo que avanza arrastrando los pies, en el recinto por segundo: el más veloz. */
export const ARRASTRA = 16;
/** Lo que tarda en llegar a la caja cuando lo tocan. */
export const PARPADEO = 0.14;
export const DEMORA_FICHA = 1.3;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  /** Dónde está (lo que se corrió de su lugar, en el recinto) y cuánto caminó en total. */
  dx: number;
  caminado: number;
  mordiscos: number;
}

/** Arma al diablo más veloz con un azar que se puede fijar (el test lo fija). La isla usa `armarVeloz`. */
export function armarVelozCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--veloz')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { arrastra: 0, reloj: 0, muerde: 0, lengua: 0, patada: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, dx: 0, caminado: 0, mordiscos: 0 }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let patadaQuieta = false;
  // Dónde está, adónde va arrastrando los pies, y lo que lleva caminado (las patas van con eso).
  let pos = 0;
  let meta = 0;
  let caminado = 0;
  let mordida = 0;
  let mordiscos = 0;
  let mordio = false;

  function elegir(): Accion {
    const opciones = (['arrastra', 'reloj', 'muerde', 'lengua'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'patada' ? ultima : a;
    desde = t;
    hechas[a]++;
    mordio = false;
    if (a === 'arrastra') {
      // Otro lugar del damero, lejos del que está: nunca un pasito.
      let otra = (azar() * 2 - 1) * VELOZ.rango;
      if (Math.abs(otra - pos) < VELOZ.rango * 0.5) otra = pos > 0 ? -VELOZ.rango * 0.8 : VELOZ.rango * 0.8;
      meta = otra;
    }
    if (a === 'patada') meta = (azar() * 2 - 1) * VELOZ.rango * 0.6;
  }

  /** Avanza arrastrando los pies hacia la meta; devuelve si todavía camina. */
  function arrastrar(m: Momento, dt: number): boolean {
    const falta = meta - pos;
    const camina = Math.abs(falta) > 0.5;
    if (camina) {
      const paso = Math.min(Math.abs(falta), ARRASTRA * dt);
      pos += Math.sign(falta) * paso;
      caminado += paso;
    }
    // Las patas se turnan apenas: el pie que arrastra no se levanta, y la pezuña saca chispas.
    const fase = caminado / 9;
    const k = camina ? 1 : 0;
    m.patas = [m.patas[0] + 7 * Math.sin(fase) * k, m.patas[1] - 7 * Math.sin(fase) * k];
    m.hamaca += 3 * Math.sin(fase) * k - 4 * k;
    m.cabeza += 2 * Math.sin(fase * 0.5) * k;
    m.chispas = k * Math.max(0, Math.abs(Math.sin(fase)) - 0.55) * 2.2 * (0.6 + 0.4 * azar());
    return camina;
  }

  function momento(t: number, dt: number): Momento {
    const m: Momento = { ...QUIETO, fruta: { ...QUIETO.fruta } };
    // Encorvado, respira, la cola se mueve sola y el fuego robado titila en el bolsillo.
    m.hamaca = 1.5 * Math.sin(t * 0.8);
    m.cola = 8 * Math.sin(t * 1.3) + 4 * Math.sin(t * 2.3);
    m.fuego = 1 + 0.12 * Math.sin(t * 13) + 0.08 * Math.sin(t * 21);
    m.reloj = 6 * Math.sin(t * 2.2);
    m.brazos = [2 * Math.sin(t * 0.9), -2 * Math.sin(t * 0.7)];
    const u = t - desde;
    switch (accion) {
      case 'arrastra': {
        if (!arrastrar(m, dt)) accion = null;
        break;
      }
      case 'reloj': {
        // Levanta el reloj, lo mira, lo sacude: no tiene agujas.
        const k = loma(u, 0, 0.5, 2.2, DURA.reloj);
        m.brazos = [m.brazos[0], mezcla(m.brazos[1], -52, k)];
        m.cabeza = mezcla(m.cabeza, -12, k);
        m.reloj = mezcla(m.reloj, 40 * Math.sin(u * 14) * loma(u, 1, 1.2, 1.8, 2), k) + 30 * k;
        break;
      }
      case 'muerde': {
        // La tira para arriba, la muerde en el aire, y la vuelve a agarrar; mastica.
        const levanta = loma(u, 0, 0.3, 1.9, 2.3);
        m.brazos = [mezcla(m.brazos[0], 30, levanta), m.brazos[1]];
        m.cabeza = mezcla(m.cabeza, 10, levanta);
        const vuela = rampa(u, 0.35, 1.25);
        if (vuela > 0 && vuela < 1) {
          const [hx, hy] = manoDeLaFruta(m.brazos[0]);
          const [bx, by] = bocaCon(m.cabeza);
          // Sube a la boca en arco y baja a la mano: en el medio, el mordiscón.
          const ida = Math.sin(Math.PI * vuela);
          m.fruta = { x: (bx - 4 - hx) * ida, y: (by - hy) * ida - 26 * Math.sin(Math.PI * vuela) * (1 - ida), giro: 340 * vuela };
        }
        m.quijada = 22 * loma(u, 0.62, 0.74, 0.8, 0.92) + 8 * Math.abs(Math.sin(u * 16)) * loma(u, 1.1, 1.3, 2.2, 2.5);
        if (!mordio && u > 0.8) {
          mordio = true;
          mordida = 1;
          mordiscos++;
        }
        break;
      }
      case 'lengua': {
        // Echa la cabeza para atrás y saca la lengua de oro, que se retuerce.
        const k = loma(u, 0, 0.3, 1.5, DURA.lengua);
        m.cabeza = mezcla(m.cabeza, 9, k);
        m.quijada = 12 * k;
        m.lengua = k * (0.85 + 0.15 * Math.sin(u * 18));
        m.hamaca -= 3 * k;
        break;
      }
      case 'patada': {
        // En un parpadeo está en la caja, con el borrón atrás; patada, truenos y lengua de oro.
        if (u < PARPADEO) pos = mezcla(pos, HASTA_LA_CAJA, rampa(u, 0, PARPADEO));
        else if (u < DURA.patada) pos = HASTA_LA_CAJA;
        m.estela = loma(u, 0, 0.04, 0.2, 0.5);
        m.hamaca = mezcla(m.hamaca, PATADA.hamaca, loma(u, 0, 0.15, 2.4, 2.9));
        // La pata de atrás se va para atrás, y patea.
        const atras = loma(u, 0.2, 0.45, 0.5, 0.6);
        const patea = loma(u, 0.55, 0.68, 1.2, 1.6);
        m.patas = [mezcla(0, PATADA.patas[0], patea), 34 * atras + PATADA.patas[1] * patea];
        m.brazos = [mezcla(m.brazos[0], PATADA.brazos[0], patea), mezcla(m.brazos[1], PATADA.brazos[1], patea)];
        m.cola = mezcla(m.cola, PATADA.cola, patea);
        m.tapa = PATADA.tapa * rampa(u, 0.68, 0.82) * (1 - rampa(u, 2.3, 2.6));
        m.salto = PATADA.salto * loma(u, 0.68, 0.76, 0.84, 1);
        m.rayos = loma(u, 0.7, 0.78, 1.9, 2.5) * (0.75 + 0.25 * Math.sin(u * 40));
        const sonrie = loma(u, 0.8, 1.1, 2.4, 2.9);
        m.cabeza = mezcla(m.cabeza, PATADA.cabeza, sonrie);
        m.quijada = PATADA.quijada * sonrie;
        m.lengua = PATADA.lengua * sonrie * (0.85 + 0.15 * Math.sin(u * 16));
        m.fuego = mezcla(m.fuego, PATADA.fuego, sonrie);
        break;
      }
    }
    // Después de la patada, vuelve arrastrando los pies.
    if (accion === null && Math.abs(meta - pos) > 0.5) arrastrar(m, dt);
    m.dx = pos;
    m.mordida = mordida;
    return m;
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
      aplicar(patadaQuieta ? PATADA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (accion && accion !== 'arrastra' && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    const caminaba = accion === 'arrastra';
    const m = momento(t, Math.min(dt, 0.1));
    // Cuando termina de arrastrarse (o de volver de la caja), espera antes de lo que sigue.
    if (caminaba && accion === null) hasta = t + entre(PAUSA);
    if (!accion && Math.abs(meta - pos) <= 0.5 && t >= hasta) empezar(elegir(), t);
    aplicar(m);
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté pateando. */
  const tocado = (t: number): void => {
    if (accion !== 'patada') empezar('patada', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      patadaQuieta = !patadaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de los cuernos, al lado de la caja, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, dx: pos, caminado, mordiscos }),
  };
}

export const armarVeloz: Armar = (marcos, esc) => armarVelozCon(marcos, esc);
