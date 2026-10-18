/**
 * El monito que trepa (`D-73`, decimoquinta vuelta), en el tronco del árbol del gran bonete.
 *
 * *"Cuanto más alto trepa el monito / el culo más se le ve"*, hecho movimiento en dos tiempos:
 *
 * - **Abajo, tapado.** A media altura del tronco, abrazado, con la cola enrulada colgando sobre el
 *   culo y las rodillas cerradas. Respira, te mira de reojo, mira para arriba, mira al jocker que se
 *   burla desde la rama. Cada tanto se acomoda la cola sobre el culo, meneando la cadera, como el que
 *   se baja la remera; y cada tanto se suelta de una mano para rascarse la coronilla.
 * - **Sube, y se le ve.** Le agarra el antojo (mira para arriba un rato) y trepa: los puños y los pies
 *   se agarran del canto y el cuerpo sube a tirones entre ellos. Al subir levanta la cola para el
 *   equilibrio, abre las piernas, y el culo pelado le asoma debajo del pelo, más cuanto más alto
 *   (`destape`, en `rig-monito.ts`). Arriba se da vuelta a mirarte por arriba del hombro y pela los
 *   dientes como el busto de la tapa; se mira el culo, te vuelve a mirar, y baja de culata, ligero.
 *   Abajo, lo primero que hace es taparse otra vez. A veces trepa nada más un poco, se mira, y se
 *   arrepiente.
 *
 * Tocado, trepa hasta arriba de una y dice su verso. Con movimiento reducido no se mueve nada:
 * tocarlo lo pasa de una pose quieta a la otra (abajo tapado, arriba destapado) y dice su verso.
 *
 * Se lleva números (`rig-monito.ts`) y nada que dibuje: la pose sale de la misma cuenta que la del
 * HTML, así la pose quieta de la isla es la de sin JavaScript.
 */

import {
  MIRADAS, MONITO, MONITO_ARMADO, PARADAS, PERIODO, TRAMO, VERSO, caderaEn, pose, transformes,
  type Gesto, type Punto,
} from '../../lib/bestiario/rig-monito.ts';
import { hacia, partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-monito-que-trepa';

export type Modo = 'quieto' | 'antojo' | 'sube' | 'arriba' | 'duda' | 'baja';
type Mirada = keyof typeof MIRADAS;

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  primerAntojo: [5, 8],
  antojo: [16, 30],
  mirarArriba: [1.3, 2.1],
  arriba: [3.4, 4.6],
  duda: [1.6, 2.4],
  mirada: [1.1, 3.2],
  acomodo: [8, 14],
  acomoda: 1.4,
  rascada: [12, 22],
  rasca: 2.2,
  parpadeo: [2.4, 6],
} as const;

/** La velocidad de la trepada en cada punto del tranco: tira, afloja, tira. Promedia 1. */
export const tiron = (subido: number): number => 0.5 + Math.sin((2 * Math.PI * subido) / PERIODO) ** 2;

export interface Estado {
  modo: Modo;
  subido: number;
  meta: number;
}

/**
 * Arma al monito con un azar que se puede fijar (el test lo fija). La isla usa `armarMonito`.
 */
export function armarMonitoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--monito')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ modo: 'quieto', subido: 0, meta: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let modo: Modo = 'quieto';
  let subido = 0;
  let meta = TRAMO;
  let desde = 0;
  let hasta = 0;
  let proximoAntojo = entre(TIEMPOS.primerAntojo);
  let proximaMirada = entre(TIEMPOS.mirada);
  let proximoAcomodo = entre(TIEMPOS.acomodo);
  let proximaRascada = entre(TIEMPOS.rascada);
  let parpadeo = entre(TIEMPOS.parpadeo);
  let acomodaDesde = -10;
  let rascaDesde = -10;
  let mirada: Mirada = 'vos';
  let miradaHasta = 0;
  let vistazoHecho = false;
  // Con movimiento reducido: cuál de las dos poses quietas está a la vista.
  let arribaQuieto = false;
  // Lo que se suaviza de cuadro en cuadro: arranca en el gesto de la pose quieta.
  const gesto: Gesto & { mira: [number, number]; parpados: [number, number] } = {
    cabeza: MIRADAS.vos.cabeza,
    mira: [...MIRADAS.vos.mira],
    parpados: [...MIRADAS.vos.parpados],
    mueca: 0,
  };

  const empezar = (m: Modo, t: number): void => {
    modo = m;
    desde = t;
  };

  function subir(t: number): void {
    if (modo === 'arriba') {
      // Ya está arriba: se queda un rato más, mirándote.
      hasta = t + entre(TIEMPOS.arriba);
      desde = t;
      return;
    }
    meta = TRAMO;
    acomodaDesde = rascaDesde = -10;
    vistazoHecho = false;
    empezar('sube', t);
  }

  /** Adónde mira, según lo que está haciendo y cuánto hace que lo hace. */
  function aDondeMira(t: number): { a: Mirada; mueca: number } {
    const u = t - desde;
    switch (modo) {
      case 'antojo':
        return { a: 'arriba', mueca: 0 };
      case 'sube':
        // Mira adonde va; pasada la mitad, un vistazo para abajo, a vos.
        if (subido > TRAMO * 0.55 && !vistazoHecho) {
          vistazoHecho = true;
          miradaHasta = t + 0.7;
        }
        return { a: t < miradaHasta ? 'vos' : 'arriba', mueca: 0 };
      case 'arriba':
        // Te mira desde arriba con los dientes pelados, se mira el culo, y te vuelve a mirar.
        if (u < 0.35) return { a: 'arriba', mueca: 0 };
        if (u < 1.7) return { a: 'abajo', mueca: 1 };
        if (u < 2.5) return { a: 'culo', mueca: 0.3 };
        return { a: 'abajo', mueca: 1 };
      case 'duda':
        return { a: u < 0.9 ? 'vos' : 'culo', mueca: 0 };
      case 'baja':
        return { a: 'angel', mueca: 0 };
      default:
        return { a: mirada, mueca: 0 };
    }
  }

  function decidir(t: number, dt: number): void {
    switch (modo) {
      case 'quieto':
        if (t > proximaMirada) {
          const r = azar();
          mirada = r < 0.42 ? 'vos' : r < 0.64 ? 'arriba' : r < 0.82 ? 'jocker' : r < 0.94 ? 'angel' : 'culo';
          proximaMirada = t + entre(TIEMPOS.mirada);
        }
        if (t > proximoAcomodo && t > rascaDesde + TIEMPOS.rasca) {
          acomodaDesde = t;
          proximoAcomodo = t + entre(TIEMPOS.acomodo);
        }
        if (t > proximaRascada && t > acomodaDesde + TIEMPOS.acomoda) {
          rascaDesde = t;
          proximaRascada = t + entre(TIEMPOS.rascada);
        }
        if (t > proximoAntojo && t > acomodaDesde + TIEMPOS.acomoda && t > rascaDesde + TIEMPOS.rasca) {
          hasta = t + entre(TIEMPOS.mirarArriba);
          empezar('antojo', t);
        }
        break;
      case 'antojo':
        if (t > hasta) {
          // Casi siempre hasta arriba; a veces un tranco o dos, y se arrepiente.
          meta = azar() < 0.68 ? TRAMO : PARADAS[2 + Math.floor(azar() * 3)]!;
          vistazoHecho = false;
          empezar('sube', t);
        }
        break;
      case 'sube':
        subido = Math.min(meta, subido + MONITO.sube * tiron(subido) * dt);
        if (subido >= meta) {
          if (meta >= TRAMO) {
            hasta = t + entre(TIEMPOS.arriba);
            empezar('arriba', t);
          } else {
            hasta = t + entre(TIEMPOS.duda);
            empezar('duda', t);
          }
        }
        break;
      case 'arriba':
      case 'duda':
        if (t > hasta) empezar('baja', t);
        break;
      case 'baja':
        subido = Math.max(0, subido - MONITO.baja * tiron(subido) * dt);
        if (subido <= 0) {
          // Lo primero que hace abajo es taparse otra vez.
          empezar('quieto', t);
          acomodaDesde = t + 0.2;
          mirada = 'vos';
          proximaMirada = t + TIEMPOS.acomoda + 0.6;
          proximoAntojo = t + entre(TIEMPOS.antojo);
          proximaRascada = Math.max(proximaRascada, t + 5);
        }
        break;
    }
  }

  function pintar(t: number, dt: number): void {
    const quieto = esc.quieto();
    if (quieto) {
      // Las dos poses quietas, tal cual: la de abajo es la del HTML.
      const pq = pose(arribaQuieto ? TRAMO : 0);
      aplicar(transformes(pq, arribaQuieto ? 'abajo' : 'vos'));
      return;
    }
    const paso = Math.min(dt, 0.1);
    if (paso > 0) decidir(t, paso);

    // La cadera: respira; al acomodarse menea; al trepar se mece con el tranco.
    const ua = t - acomodaDesde;
    const acomoda = ua >= 0 && ua < TIEMPOS.acomoda ? Math.sin((Math.PI * ua) / TIEMPOS.acomoda) : 0;
    const meneo = Math.sin(ua * Math.PI * 2 * 2.2) * acomoda;
    const trepando = modo === 'sube' || modo === 'baja' ? 1 : 0;
    const mece = Math.sin((2 * Math.PI * subido) / PERIODO) * 1.3 * trepando;
    const respira = Math.sin(t * 1.9) * 0.55 * (1 - trepando);
    const corre: Punto = [meneo * 1.6 + mece, respira];

    // La rascada: se suelta de la mano derecha y la lleva a la coronilla, y se rasca.
    const ur = t - rascaDesde;
    const rasca = modo === 'quieto' && ur >= 0 && ur < TIEMPOS.rasca ? Math.min(suave(ur / 0.45), suave((TIEMPOS.rasca - ur) / 0.45)) : 0;
    const [hx, hy] = caderaEn(subido);
    const [kx, ky] = MONITO_ARMADO.coronilla;
    const coronilla: Punto = [hx + corre[0] + kx * MONITO.escala + Math.sin(ur * 19) * 1.1, hy + corre[1] + ky * MONITO.escala + Math.cos(ur * 19) * 0.6];
    const pq = pose(subido, {
      corre,
      cambia: rasca > 0 ? (n, a) => (n === 'brazo-2' ? [a[0] + (coronilla[0] - a[0]) * rasca, a[1] + (coronilla[1] - a[1]) * rasca] : a) : undefined,
    });
    // La cola: se acomoda sobre el culo, se sacude en la punta, y trepando hace equilibrio.
    pq.cola += meneo * 7 + Math.sin((4 * Math.PI * subido) / PERIODO) * 7 * trepando;
    pq.rulo += acomoda * 16 + Math.sin(t * 0.8) * 2.5 * (1 - trepando);

    // La cara: adónde mira, el parpadeo, y la mueca.
    const { a, mueca } = aDondeMira(t);
    const m = MIRADAS[a];
    const v = paso * 5;
    gesto.cabeza = hacia(gesto.cabeza, m.cabeza + rasca * 8, paso * 70);
    gesto.mira = [hacia(gesto.mira[0], m.mira[0], v), hacia(gesto.mira[1], m.mira[1], v)];
    if (t > parpadeo + 0.14) parpadeo = t + entre(TIEMPOS.parpadeo);
    const ciego = t > parpadeo && t < parpadeo + 0.14;
    // Rascándose entrecierra los ojos, del gusto.
    gesto.parpados = [0, 1].map((i) => hacia(gesto.parpados[i]!, m.parpados[i]! + rasca * 0.35, paso * 3)) as [number, number];
    gesto.mueca = hacia(gesto.mueca, mueca, paso * 4);
    aplicar(transformes(pq, ciego ? { ...gesto, parpados: [1, 1] } : gesto));
  }

  function aplicar(t: Readonly<Record<string, string>>): void {
    for (const [nombre, valor] of Object.entries(t)) {
      const el = p.get(nombre);
      if (!el) continue;
      if (nombre === 'mueca') el.setAttribute('opacity', valor);
      else el.setAttribute('transform', valor);
    }
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      arribaQuieto = !arribaQuieto;
      pintar(t, 0);
    } else subir(t);
    esc.hablar(ID, VERSO[0], VERSO[1]);
  };
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
      if (!esc.quieto()) subir(t);
      return true;
    },
    estado: () => ({ modo, subido, meta }),
  };
}

export const armarMonito: Armar = (marcos, esc) => armarMonitoCon(marcos, esc);
