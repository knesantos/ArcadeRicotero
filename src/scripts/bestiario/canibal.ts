/**
 * El caníbal (`D-73`, decimoquinta vuelta), en la cabecera de la mesa servida.
 *
 * *"Soy un gourmet que huele eternamente mal. / Un caníbal de mi estilo."* Está sentado con los codos
 * en la mesa y los cubiertos parados en los puños, el plato vacío adelante, y mira por la ventana para
 * el lado de la pastura, que es donde está el cordero. Lo que hace solo, cada uno a su tiempo:
 *
 * - **Mira la ventana**, casi siempre. A veces baja la vista al plato vacío, o te mira a vos.
 * - **Olfatea el aire de la pastura**: levanta la nariz, cierra los ojos y se llena el pecho; después
 *   suelta el aire despacio. Muchas veces, después, se relame.
 * - **Se relame**: la lengua le pasa por el labio de una punta a la otra.
 * - **Golpea la mesa con el tenedor**, tres veces, mirando el plato: *"me cansé de tanto esperar"*.
 * - **Las moscas lo prefieren a él**: tres moscas de la mesa se le posan en la pelada, en la mancha de
 *   salsa de la servilleta, en la oreja, y dan vueltas alrededor de la cabeza. Él no las espanta.
 *
 * **Tocado, el verso hecho gesto**: olfatea fuerte hacia la ventana (las moscas se le vuelan), se da
 * vuelta a mirarte, te pela la sonrisa de la contratapa de *Cordero atado* y afila el cuchillo contra el
 * tenedor, dos pasadas. Después vuelve a mirar la pastura. Con movimiento reducido no se mueve nada:
 * tocarlo lo pasa de una pose quieta a la otra (mira la ventana; te sonríe afilando) y dice su verso.
 *
 * Se lleva números (`rig-canibal.ts`) y nada que dibuje: la pose sale de la misma cuenta que la del
 * HTML, así la pose quieta de la isla es la de sin JavaScript.
 */

import {
  FILO, GESTOS, MANOS_AFILA, MANOS_QUIETAS, MIRADAS, MOSCAS_QUIETAS, POSADAS, VERSO, dondeVa, enLaCabeza, moscaEn, transformes,
  type Gesto, type Mano, type Posada, type Punto,
} from '../../lib/bestiario/rig-canibal.ts';
import { hacia, partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-canibal';

export type Modo = 'mira' | 'olfatea' | 'relame' | 'tamborilea' | 'afila';
type Mirada = keyof typeof MIRADAS;

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  primerOlfato: [3, 6],
  olfato: [9, 17],
  olfatea: 2.6,
  relamida: [11, 20],
  relame: 1.3,
  tamborileo: [14, 26],
  tamborilea: 2.1,
  afila: 3.9,
  mirada: [3, 8],
  vistazo: [0.8, 1.8],
  parpadeo: [2.5, 6],
  posada: [2.5, 7],
  orbita: [1.4, 3.6],
  vuelo: 0.8,
} as const;

/** El pecho lleno: cuánto crece cuando olfatea. */
const LLENO = 0.032;

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclaP = (a: Punto, b: Punto, k: number): Punto => [mezcla(a[0], b[0], k), mezcla(a[1], b[1], k)];
const mezclaManos = (a: readonly [Mano, Mano], b: readonly [Mano, Mano], k: number): [Mano, Mano] =>
  [0, 1].map((i) => ({ muneca: mezclaP(a[i]!.muneca, b[i]!.muneca, k), giro: mezcla(a[i]!.giro, b[i]!.giro, k) })) as [Mano, Mano];

/** Lo que va de un gesto que sube en `sube`, se sostiene y baja en `baja`: de 0 a 1 y de vuelta. */
export function tramo(u: number, desde: number, sube: number, hasta: number, baja: number): number {
  if (u <= desde || u >= hasta + baja) return 0;
  if (u < desde + sube) return suave((u - desde) / sube);
  if (u <= hasta) return 1;
  return 1 - suave((u - hasta) / baja);
}

/**
 * El afilado, de 0 a `TIEMPOS.afila` segundos: cuánto huele, cuánto sonríe, cuánto llevó las manos a
 * afilar y por dónde va el cuchillo sobre el tenedor (de -1 a 1, dos pasadas).
 */
export function afilado(u: number): { huele: number; sonrie: number; manos: number; pasada: number; teMira: number } {
  const huele = tramo(u, 0, 0.45, 0.75, 0.35);
  const sonrie = tramo(u, 0.85, 0.3, 3.0, 0.45);
  const manos = tramo(u, 1.0, 0.4, 2.95, 0.5);
  const pasada = u > 1.4 && u < 2.95 ? Math.sin((2 * Math.PI * (u - 1.4)) / 0.75) : 0;
  const teMira = tramo(u, 0.8, 0.3, 3.2, 0.5);
  return { huele, sonrie, manos, pasada, teMira };
}

/** Los golpes del tenedor contra la mesa: cuánto baja el puño (en el títere), tres veces. */
export function golpe(u: number): number {
  if (u < 0.5 || u > 0.5 + 3 * 0.34) return 0;
  const k = ((u - 0.5) / 0.34) % 1;
  return 9 * Math.sin(Math.PI * k) ** 2;
}

interface Mosca {
  el: SVGGraphicsElement | undefined;
  modo: 'posada' | 'orbita';
  posada: Posada;
  desde: Punto;
  cambio: number;
  hasta: number;
  fase: number;
  sentido: 1 | -1;
  ultima: Punto;
  giro: number;
}

export interface Estado {
  modo: Modo;
  moscas: ReadonlyArray<{ modo: 'posada' | 'orbita'; donde: Punto }>;
}

/** Arma al caníbal con un azar que se puede fijar (el test lo fija). La isla usa `armarCanibal`. */
export function armarCanibalCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--canibal')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ modo: 'mira', moscas: [] }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let modo: Modo = 'mira';
  let desde = 0;
  let proximoOlfato = entre(TIEMPOS.primerOlfato);
  let proximaRelamida = entre(TIEMPOS.relamida);
  let proximoTamborileo = entre(TIEMPOS.tamborileo);
  let proximaMirada = entre(TIEMPOS.mirada);
  let mirada: Mirada = 'ventana';
  let miradaHasta = 0;
  let parpadeo = entre(TIEMPOS.parpadeo);
  let relameDespues = false;
  // Con movimiento reducido: cuál de las dos poses quietas está a la vista.
  let afilaQuieto = false;

  // Lo que se suaviza de cuadro en cuadro: arranca en el gesto de la pose quieta.
  const cara = { cabeza: GESTOS.ventana.cabeza, mira: [...GESTOS.ventana.mira] as [number, number], parpados: [...GESTOS.ventana.parpados] as [number, number] };

  const moscas: Mosca[] = MOSCAS_QUIETAS.map((m, i) => ({
    el: p.get(`mosca-${i + 1}`),
    modo: 'posada',
    posada: m,
    desde: m.punto,
    cambio: -10,
    hasta: entre(TIEMPOS.posada) + i * 1.3,
    fase: azar() * Math.PI * 2,
    sentido: azar() < 0.5 ? 1 : -1,
    ultima: m.punto,
    giro: m.giro,
  }));

  const empezar = (m: Modo, t: number): void => {
    modo = m;
    desde = t;
  };

  /** Dónde da vueltas una mosca alrededor de la cabeza. */
  const orbita = (m: Mosca, t: number, ges: Gesto): Punto => {
    const [cx, cy] = enLaCabeza([10, -106], ges);
    const a = m.fase + m.sentido * t * 3.4;
    return [cx + Math.cos(a) * 34, cy + Math.sin(a * 1.3) * 20 - 6];
  };

  /** Un lugar libre donde posarse: lo prefieren a él. */
  function libre(m: Mosca): Posada {
    const ocupadas = new Set(moscas.filter((o) => o !== m && o.modo === 'posada').map((o) => o.posada));
    const libres = POSADAS.filter((q) => !ocupadas.has(q));
    return libres[Math.floor(azar() * libres.length)] ?? POSADAS[0]!;
  }

  /** Las moscas se le vuelan de encima (cuando olfatea fuerte), y al rato vuelven. */
  function espantar(t: number): void {
    for (const m of moscas) {
      if (m.modo === 'orbita') continue;
      m.desde = m.ultima;
      m.modo = 'orbita';
      m.cambio = t;
      m.hasta = t + entre([1.6, 3]);
    }
  }

  function moverMoscas(t: number, ges: Gesto, anda: boolean): void {
    for (const m of moscas) {
      if (anda && t > m.hasta) {
        m.desde = m.ultima;
        m.cambio = t;
        if (m.modo === 'posada') {
          m.modo = 'orbita';
          m.hasta = t + entre(TIEMPOS.orbita);
        } else {
          m.modo = 'posada';
          m.posada = libre(m);
          m.hasta = t + entre(TIEMPOS.posada);
        }
      }
      const objetivo = m.modo === 'orbita' ? orbita(m, t, ges) : dondeVa(m.posada, ges);
      const k = suave((t - m.cambio) / TIEMPOS.vuelo);
      let punto: Punto = mezclaP(m.desde, objetivo, k);
      // En el vuelo hace una curva; posada en el aire, se sostiene temblando.
      if (k < 1) {
        const [dx, dy] = [objetivo[0] - m.desde[0], objetivo[1] - m.desde[1]];
        const largo = Math.hypot(dx, dy) || 1;
        const comba = Math.sin(Math.PI * k) * Math.min(14, largo * 0.4) * m.sentido;
        punto = [punto[0] - (dy / largo) * comba, punto[1] + (dx / largo) * comba];
      }
      if (m.modo === 'posada' && m.posada.en === 'aire') punto = [punto[0] + Math.sin(t * 9) * 1.6, punto[1] + Math.sin(t * 11.3) * 1.1];
      const [vx, vy] = [punto[0] - m.ultima[0], punto[1] - m.ultima[1]];
      const quieta = m.modo === 'posada' && k >= 1;
      if (quieta) m.giro = m.posada.giro;
      else if (Math.hypot(vx, vy) > 0.05) m.giro = (Math.atan2(vx, -vy) * 180) / Math.PI;
      m.ultima = punto;
      m.el?.setAttribute('transform', moscaEn(punto, m.giro));
    }
  }

  function decidir(t: number): void {
    const u = t - desde;
    switch (modo) {
      case 'mira':
        if (t > proximaMirada) {
          const r = azar();
          mirada = r < 0.4 ? 'plato' : r < 0.75 ? 'vos' : 'ventana';
          miradaHasta = t + entre(TIEMPOS.vistazo);
          proximaMirada = t + entre(TIEMPOS.mirada);
        }
        if (t > miradaHasta) mirada = 'ventana';
        if (relameDespues || t > proximaRelamida) {
          relameDespues = false;
          proximaRelamida = t + entre(TIEMPOS.relamida);
          empezar('relame', t);
        } else if (t > proximoOlfato) {
          proximoOlfato = t + entre(TIEMPOS.olfato);
          empezar('olfatea', t);
        } else if (t > proximoTamborileo) {
          proximoTamborileo = t + entre(TIEMPOS.tamborileo);
          empezar('tamborilea', t);
        }
        break;
      case 'olfatea':
        if (u > TIEMPOS.olfatea) {
          relameDespues = azar() < 0.55;
          mirada = 'ventana';
          empezar('mira', t);
        }
        break;
      case 'relame':
        if (u > TIEMPOS.relame) empezar('mira', t);
        break;
      case 'tamborilea':
        if (u > TIEMPOS.tamborilea) {
          mirada = 'ventana';
          empezar('mira', t);
        }
        break;
      case 'afila':
        if (u > TIEMPOS.afila) {
          mirada = 'ventana';
          proximoOlfato = Math.max(proximoOlfato, t + 6);
          empezar('mira', t);
        }
        break;
    }
  }

  function aplicar(t: Readonly<Record<string, string>>): void {
    for (const [nombre, valor] of Object.entries(t)) {
      const el = p.get(nombre);
      if (!el) continue;
      if (nombre === 'mueca' || nombre === 'relame') el.setAttribute('opacity', valor);
      else el.setAttribute('transform', valor);
    }
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto()) {
      // Las dos poses quietas, tal cual: la de la ventana es la del HTML.
      const ges = afilaQuieto ? GESTOS.afila : GESTOS.ventana;
      aplicar(transformes(ges));
      for (const [i, m] of moscas.entries()) m.el?.setAttribute('transform', moscaEn(dondeVa(MOSCAS_QUIETAS[i]!, ges), MOSCAS_QUIETAS[i]!.giro));
      return;
    }
    const paso = Math.min(dt, 0.1);
    if (paso > 0) decidir(t);
    const u = t - desde;

    // Adónde mira y lo que hace con la cara, según lo que está haciendo.
    let meta: { cabeza: number; mira: Punto; parpados: readonly [number, number] } = MIRADAS[mirada];
    let respira = Math.sin(t * 1.6) * 0.006;
    let manos: readonly [Mano, Mano] = MANOS_QUIETAS;
    let mueca = 0;
    let relame = 0;
    let lengua = 0;
    if (modo === 'olfatea') {
      const huele = tramo(u, 0, 0.7, 1.5, 1.0);
      meta = huele > 0.3 ? MIRADAS.olfatea : MIRADAS.ventana;
      respira += LLENO * huele;
    } else if (modo === 'relame') {
      relame = tramo(u, 0, 0.15, TIEMPOS.relame - 0.2, 0.2);
      lengua = mezcla(-1, 1, suave((u - 0.1) / (TIEMPOS.relame - 0.35)));
    } else if (modo === 'tamborilea') {
      meta = u < 1.6 ? MIRADAS.plato : MIRADAS.vos;
      const baja = golpe(u);
      manos = [MANOS_QUIETAS[0], { muneca: [MANOS_QUIETAS[1].muneca[0], MANOS_QUIETAS[1].muneca[1] + baja], giro: MANOS_QUIETAS[1].giro - baja * 0.6 }];
    } else if (modo === 'afila') {
      const a = afilado(u);
      meta = a.huele > 0.3 ? MIRADAS.olfatea : a.teMira > 0.4 ? MIRADAS.vos : MIRADAS.ventana;
      respira += LLENO * a.huele;
      mueca = a.sonrie;
      const afila: [Mano, Mano] = [
        { muneca: [MANOS_AFILA[0].muneca[0] + FILO[0] * 7 * a.pasada, MANOS_AFILA[0].muneca[1] + FILO[1] * 7 * a.pasada], giro: MANOS_AFILA[0].giro },
        MANOS_AFILA[1],
      ];
      manos = mezclaManos(MANOS_QUIETAS, afila, a.manos);
    }

    // La cara se acomoda despacio, y parpadea.
    const v = paso * 5;
    cara.cabeza = hacia(cara.cabeza, meta.cabeza, paso * 40);
    cara.mira = [hacia(cara.mira[0], meta.mira[0], v), hacia(cara.mira[1], meta.mira[1], v)];
    cara.parpados = [0, 1].map((i) => hacia(cara.parpados[i]!, meta.parpados[i]!, paso * 3)) as [number, number];
    if (t > parpadeo + 0.14) parpadeo = t + entre(TIEMPOS.parpadeo);
    const ciego = paso > 0 && t > parpadeo && t < parpadeo + 0.14;
    const ges: Gesto = {
      cabeza: cara.cabeza + (modo === 'olfatea' && u > 0.7 && u < 1.5 ? Math.sin(u * 26) * 1.2 : 0),
      mira: cara.mira,
      parpados: ciego ? [1, 1] : cara.parpados,
      mueca,
      lengua,
      relame,
      respira,
      manos,
    };
    aplicar(transformes(ges));
    moverMoscas(t, ges, paso > 0);
  }

  function afilar(t: number): void {
    if (modo === 'afila' && t - desde < TIEMPOS.afila - 0.4) return;
    empezar('afila', t);
    espantar(t);
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      afilaQuieto = !afilaQuieto;
      pintar(t, 0);
    } else afilar(t);
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
      if (!esc.quieto()) afilar(t);
      return true;
    },
    estado: () => ({ modo, moscas: moscas.map((m) => ({ modo: m.modo, donde: m.ultima })) }),
  };
}

export const armarCanibal: Armar = (marcos, esc) => armarCanibalCon(marcos, esc);
