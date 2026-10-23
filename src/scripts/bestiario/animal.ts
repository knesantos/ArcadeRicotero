/**
 * Tu animal (`D-73`, decimoctava vuelta): la sombra con dos ojos entre las tiras del monte.
 *
 * Lo que hace solo es lo de un animal que alguien tiene atado, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Respira**, parpadea de a ratos, y la cola se le mueve sola.
 * - **Se esconde**: el cuerpo se le apaga en lo oscuro y quedan los ojos, que siguen mirando. Es lo que
 *   dice la estampa: una sombra con dos ojos. Al rato vuelve a estar.
 * - **Olfatea** el piso, **mira** para otro lado, y **se acomoda**: da un paso y la correa se mueve.
 *
 * Tocado, **se muestra** (*"si vos cuidás que tu animal no nos muestre libremente"*): sale entero de lo
 * oscuro, pela los dientes, y la correa se tensa como si alguien lo frenara de arriba. Después baja la
 * cabeza para que lo acaricies y mueve la cola. Dice su verso. Con movimiento reducido no se mueve nada:
 * tocarlo lo pasa de escondido a mostrándose.
 *
 * Se lleva números (`rig-animal.ts`) y nada que dibuje.
 */

import { MUESTRA, QUIETO, VERSO, marcas, type Momento, type Punto } from '../../lib/bestiario/rig-animal.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'tu-animal';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { esconde: 4.2, olfatea: 2.6, mira: 2.2, paso: 2, muestra: 4 } as const;
export type Accion = keyof typeof DURA;

/** Cuánto espera entre una cosa y otra, y antes de la primera; y cada cuánto parpadea. */
export const PAUSA = [1.2, 3.4] as const;
export const PRIMERA = [0.8, 2] as const;
export const PARPADEO = [2.4, 6] as const;

/** Cuánto espera para abrir la ficha después del toque: que se lo vea salir de lo oscuro. */
export const DEMORA_FICHA = 1.2;

/** Cuánto se ve el cuerpo cuando se esconde: casi nada, quedan los ojos. */
export const ESCONDIDO = 0.05;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclaP = (a: Punto, b: Punto, k: number): Punto => [mezcla(a[0], b[0], k), mezcla(a[1], b[1], k)];

/** Lo que lleva hecho: para el test. */
export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  paso: number;
  parpadeos: number;
}

/** Arma a tu animal con un azar que se puede fijar (el test lo fija). La isla usa `armarAnimal`. */
export function armarAnimalCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--animal')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { esconde: 0, olfatea: 0, mira: 0, paso: 0, muestra: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, paso: 0, parpadeos: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let paso = QUIETO.paso;
  let pasoDesde = paso;
  let pasoA = paso;
  let miraA: { cabeza: number; mira: Punto } = { cabeza: 0, mira: [0, 0] };
  let parpadeaEn = entre(PARPADEO);
  let parpadeos = 0;
  let ultimoParpadeo = -1;
  let hablarEn: number | null = null;
  let mostradoQuieto = false;

  function elegir(): Accion {
    const opciones = (['esconde', 'olfatea', 'mira', 'paso'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    if (a !== 'muestra') ultima = a;
    desde = t;
    hechas[a]++;
    pasoDesde = paso;
    if (a === 'paso') pasoA = Math.max(-16, Math.min(12, paso + (azar() < 0.5 ? -1 : 1) * (6 + azar() * 8)));
    if (a === 'muestra') pasoA = MUESTRA.paso;
    if (a === 'mira') miraA = { cabeza: -10 + azar() * 6, mira: [azar() * 2 - 1, azar() * 0.8 - 0.4] };
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO, mira: [...QUIETO.mira] as Punto };
    m.respira = 0.015 * Math.sin(t * 1.4);
    m.cola = 6 * Math.sin(t * 0.9) + 3 * Math.sin(t * 2.3);
    m.tira = QUIETO.tira + 0.08 * Math.sin(t * 0.7);
    m.mira = [QUIETO.mira[0] + 0.3 * Math.sin(t * 0.41), QUIETO.mira[1] + 0.2 * Math.sin(t * 0.67 + 2)];
    // El parpadeo: rápido, de a ratos.
    if (t >= parpadeaEn) {
      parpadeos++;
      ultimoParpadeo = t;
      parpadeaEn = t + entre(PARPADEO);
    }
    const u = t - desde;
    switch (accion) {
      case 'esconde': {
        // Se apaga el cuerpo; quedan los ojos, que se pasean; y vuelve.
        const k = loma(u, 0, 0.9, 3.2, DURA.esconde);
        m.ve = mezcla(QUIETO.ve, ESCONDIDO, k);
        m.mira = mezclaP(m.mira, [Math.sin(u * 1.3), 0.2 * Math.sin(u * 2)], k);
        break;
      }
      case 'olfatea': {
        // La cabeza baja al piso y husmea a sacudoncitos.
        const k = loma(u, 0, 0.5, 2, DURA.olfatea);
        m.cabeza = 16 * k + Math.sin(u * 22) * 1.6 * k;
        m.mira = mezclaP(m.mira, [-0.6, 1], k);
        m.parpados = mezcla(m.parpados, 0.5, k);
        break;
      }
      case 'mira': {
        const k = loma(u, 0, 0.5, 1.6, DURA.mira);
        m.cabeza = miraA.cabeza * k;
        m.mira = mezclaP(m.mira, miraA.mira, k);
        m.parpados = mezcla(m.parpados, 0.05, k);
        break;
      }
      case 'paso': {
        // Se acomoda: un paso para un lado, el cuerpo que sube y baja, y la correa que se mueve.
        const k = rampa(u, 0.2, 1.5);
        paso = mezcla(pasoDesde, pasoA, k);
        m.respira += 0.02 * Math.sin(Math.PI * k);
        m.tira = mezcla(m.tira, 0.6, loma(u, 0.2, 0.8, 1.2, 1.8));
        m.ve = mezcla(QUIETO.ve, 0.75, loma(u, 0, 0.5, 1.4, DURA.paso));
        break;
      }
      case 'muestra': {
        // Sale entero, pela los dientes con la correa tensa, y después baja la cabeza y mueve la cola.
        const sale = loma(u, 0, 0.35, 3.3, DURA.muestra);
        const dientes = loma(u, 0.3, 0.6, 1.3, 1.6);
        const manso = loma(u, 1.5, 2, 3.1, 3.7);
        paso = mezcla(pasoDesde, MUESTRA.paso, sale);
        m.ve = mezcla(QUIETO.ve, MUESTRA.ve, sale);
        m.quijada = dientes;
        m.tira = mezcla(m.tira, 1, Math.max(dientes, 0.3 * sale));
        m.cabeza = MUESTRA.cabeza * dientes + 18 * manso;
        m.mira = mezclaP(m.mira, dientes > manso ? MUESTRA.mira : [-0.5, 0.6], Math.max(dientes, manso));
        m.parpados = mezcla(mezcla(m.parpados, 0, dientes), 0.55, manso);
        m.cola = mezcla(m.cola, MUESTRA.cola, dientes) + 22 * Math.sin(u * 14) * manso;
        m.respira = mezcla(m.respira, MUESTRA.respira, dientes);
        break;
      }
    }
    // El parpadeo dura un décimo y pico: si cae ahora, tapa lo que esté mirando.
    if (ultimoParpadeo >= 0 && t - ultimoParpadeo < 0.14) m.parpados = 1;
    m.paso = paso;
    return m;
  }

  function aplicar(m: Momento): void {
    const { transform, opacity, correa } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero') p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
    p.get('correa')?.setAttribute('d', correa);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(mostradoQuieto ? MUESTRA : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya se esté mostrando. */
  const tocado = (t: number): void => {
    if (accion !== 'muestra') empezar('muestra', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      mostradoQuieto = !mostradoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de él, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, paso, parpadeos }),
  };
}

export const armarAnimal: Armar = (marcos, esc) => armarAnimalCon(marcos, esc);
