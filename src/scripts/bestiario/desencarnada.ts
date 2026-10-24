/**
 * La bella señora desencarnada (`D-73`, vigésima vuelta), esperando al costado de la ruta.
 *
 * Lo que hace solo es esperar, que no es hacer dedo, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Espera**: apenas se mece, y en el pecho le late el corazón, poquito, con un latido doble.
 * - **Mira la ruta**: para un lado, para el otro. No pasa nada.
 * - **La despeina el viento** de los fierros que pasan: se le van el velo, el pañuelo y la pollera.
 * - **Se acomoda la mantilla**, con la mano del guante.
 * - **Suspira**: el pecho sube, y el corazón se prende un poco más.
 *
 * Tocada, **se le viene el día** (*"cuando la noche es más oscura, se viene el día en tu corazón"*): se
 * levanta el velo, se le ve la calavera con el rouge puesto, se le prenden las cuencas, y desde el pecho
 * crece el resplandor del horizonte. Después baja el velo, y sigue esperando. Dice su verso. Con
 * movimiento reducido no se mueve nada: tocarla la pasa de esperando al día.
 *
 * Se lleva números (`rig-desencarnada.ts`) y nada que dibuje.
 */

import { ALZA, EL_DIA, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-desencarnada.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-bella-senora-desencarnada';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { mira: 3.4, viento: 2.6, acomoda: 2.4, suspira: 2.6, dia: 4.6 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.4, 3.6] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.4;

/** El latido: cuántos por segundo, y cuánto prende el corazón cada uno. */
export const LATE = { porSegundo: 1.05, cuanto: 0.14 } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

/** El latido doble del corazón, de 0 a 1: *pum-pum*, y un silencio. */
export function latido(t: number): number {
  const fase = (t * LATE.porSegundo) % 1;
  const golpe = (c: number, ancho: number): number => Math.max(0, 1 - Math.abs(fase - c) / ancho);
  return Math.max(golpe(0.1, 0.08), 0.7 * golpe(0.3, 0.08));
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la señora con un azar que se puede fijar (el test lo fija). La isla usa `armarDesencarnada`. */
export function armarDesencarnadaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--desencarnada')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { mira: 0, viento: 0, acomoda: 0, suspira: 0, dia: 0 };
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
  let diaQuieto = false;
  let lado = 1;

  function elegir(): Accion {
    const opciones = (['mira', 'viento', 'acomoda', 'suspira'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'dia' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO };
    // Espera: apenas se mece, el velo y el pañuelo con la brisa, y el corazón que late poquito.
    m.mece = 1 * Math.sin(t * 0.5);
    m.pollera = 0.8 * Math.sin(t * 0.7 + 1);
    m.viento = 3 * Math.sin(t * 1.1);
    m.panuelo = 6 * Math.sin(t * 2) + 3 * Math.sin(t * 3.3);
    m.cabeza = 1.5 * Math.sin(t * 0.4 + 1);
    m.dia = QUIETO.dia + LATE.cuanto * latido(t);
    const u = t - desde;
    switch (accion) {
      case 'mira': {
        // Para un lado de la ruta, después para el otro.
        const uno = loma(u, 0, 0.5, 1.3, 1.7);
        const otro = loma(u, 1.5, 2, 2.8, DURA.mira);
        m.cabeza += lado * (16 * uno - 16 * otro);
        m.mece += lado * (2 * uno - 2 * otro);
        break;
      }
      case 'viento': {
        // Pasa un fierro y la despeina: el velo, el pañuelo y la pollera para el mismo lado.
        const k = loma(u, 0, 0.3, 1.4, DURA.viento);
        const rafaga = 1 + 0.25 * Math.sin(u * 14);
        m.viento += lado * 18 * k * rafaga;
        m.panuelo += lado * 40 * k * rafaga;
        m.pollera += lado * 4 * k;
        m.mece -= lado * 2 * k;
        break;
      }
      case 'acomoda': {
        // Se acomoda la mantilla con la mano del guante, y ladea la cabeza.
        const k = loma(u, 0, 0.6, 1.6, DURA.acomoda);
        m.brazos = [m.brazos[0], -120 * k];
        m.cabeza += 6 * k;
        m.viento -= 4 * k;
        break;
      }
      case 'suspira': {
        // El pecho sube y baja, y el corazón se prende un poco más.
        const k = loma(u, 0, 0.9, 1.3, DURA.suspira);
        m.mece -= 3 * k;
        m.cabeza -= 5 * k;
        m.dia = mezcla(m.dia, 0.5, k);
        break;
      }
      case 'dia': {
        // Se levanta el velo, se le prenden las cuencas y desde el pecho se viene el día.
        const levanta = loma(u, 0.1, 0.6, 3, 3.6);
        m.brazos = [mezcla(0, EL_DIA.brazos[0], levanta), mezcla(0, ALZA, levanta)];
        m.velo = loma(u, 0.35, 0.9, 2.9, 3.7);
        m.cabeza = mezcla(m.cabeza, EL_DIA.cabeza, levanta);
        m.cuencas = loma(u, 0.8, 1.2, 2.8, 3.4);
        m.dia = mezcla(m.dia, EL_DIA.dia, loma(u, 0.8, 1.6, 3, 4.2)) * (1 + 0.08 * latido(t));
        m.panuelo += EL_DIA.panuelo * levanta;
        m.viento += EL_DIA.viento * levanta;
        break;
      }
    }
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
      aplicar(diaQuieto ? EL_DIA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocada: lo que esté haciendo lo deja, salvo que ya se le esté viniendo el día. */
  const tocado = (t: number): void => {
    if (accion !== 'dia') empezar('dia', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      diaQuieto = !diaQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la peineta, y la página abre la ficha. */
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

export const armarDesencarnada: Armar = (marcos, esc) => armarDesencarnadaCon(marcos, esc);
