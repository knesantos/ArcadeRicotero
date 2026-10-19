/**
 * El pibe de los astilleros (`D-73`, decimoquinta vuelta), arriba de la pila de containers.
 *
 * Lo que hace solo sale de la letra, y nada es un bucle: cada cosa tiene su tiempo, que varía.
 *
 * - **Fuma, y la ceniza no se le cae** (*"La ceniza no caía desde su cigarro"*). Cada tanto le da una
 *   pitada: la brasa se prende, le alumbra la pera desde abajo, y la ceniza crece. El humo que larga
 *   sube y se enrosca como los espirales de tiza del cielo. A veces le pega un golpecito al pucho con
 *   el dedo, para tirar la ceniza: el pucho se sacude y la ceniza sigue ahí.
 * - **Vigila.** Mira el muelle (el ferry que sale, la planchada), el farol, a vos de reojo, la caja, y
 *   a la rana rubia, que él alquiló y se moría de ganas de matar, en la misma pila.
 * - **Patea el container**, a ratos, con las zapatillas colgando: no se queda quieto nunca.
 * - **Rapiña** (*"Rapiñaba montado a los containers"*): se inclina sobre la caja de cartón que se
 *   afanó, revuelve adentro, saca un pedal de guitarra, lo mira contra la luz del farol y se lo guarda
 *   en el bolsillo del buzo.
 *
 * Tocado, **se para arriba del container con la caja en alto y grita**, como el pibe de la caja de la
 * contratapa de *La mosca y la sopa*: las manos arriba, que es como se rinde uno, pero con lo que se
 * afanó en las manos. *"Nunca se rendía."* El pucho no se le cae, y la ceniza tampoco. Dice su verso.
 * Con movimiento reducido no se mueve nada: tocarlo lo pasa de la pose sentado a la del grito, quieta.
 *
 * Se lleva números (`rig-pibe.ts`) y nada que dibuje: la pose sale de la misma cuenta que la del HTML.
 */

import {
  ADENTRO_CAJA, AGARRE_CAJA, ALZADA, CAJA_ARRIBA, CENIZA, MIRADAS, PIBE_ARMADO, QUIETA, VERSO, caderaEn, cajaEnSuLugar, enLaCaja,
  manoQuieta, marcas, puchoEn, type Lugar, type Momento, type Punto,
} from '../../lib/bestiario/rig-pibe.ts';
import { hacia, partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-pibe-de-los-astilleros';

export type Modo = 'sentado' | 'rapina' | 'grito';
type Mirada = keyof typeof MIRADAS;

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  pitada: [5, 11],
  primeraPitada: [1.2, 2.6],
  golpecito: [13, 24],
  rapina: [16, 30],
  primeraRapina: [7, 11],
  mirada: [1.4, 4],
  pataleo: [4, 10],
  patalea: [1.8, 4],
  parpadeo: [2.4, 6],
} as const;

/** Cuánto dura cada cosa. */
export const DURA = { pitada: 1.5, humo: 3.4, golpecito: 1.5, rapina: 5.8, grito: 5.2 } as const;

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclaP = (a: Punto, b: Punto, k: number): Punto => [mezcla(a[0], b[0], k), mezcla(a[1], b[1], k)];

/** Un valor que pasa por varios momentos clave, suavizado entre uno y otro. */
function claves<T>(u: number, ks: ReadonlyArray<readonly [number, T]>, entre: (a: T, b: T, k: number) => T): T {
  if (u <= ks[0]![0]) return ks[0]![1];
  for (let i = 1; i < ks.length; i++) {
    const [t1, v1] = ks[i]!;
    const [t0, v0] = ks[i - 1]!;
    if (u <= t1) return entre(v0, v1, suave((u - t0) / (t1 - t0 || 1)));
  }
  return ks[ks.length - 1]![1];
}

/** Lo que se ve de la ceniza: crece con cada pitada hasta su largo más largo, y ahí se queda. */
export const cenizaTras = (pitadas: number): number => Math.min(CENIZA.maxima, CENIZA.quieta + pitadas * 0.9);

/**
 * La rapiña, en el tiempo `u` desde que empezó: dónde va la mano de la caja, cuánto se inclina,
 * adónde mira y cuánto se ve lo que sacó. `caja` es la caja en su lugar.
 */
export function rapina(u: number, caja: Lugar): { mano: Punto | null; inclina: number; mira: Mirada; botin: number; sacude: number } {
  const arriba = enLaCaja([3, -30], caja);
  const adentro = enLaCaja(ADENTRO_CAJA, caja);
  const afuera = enLaCaja([1, -34], caja);
  const mirar: Punto = [-9, -38];
  const bolsillo: Punto = [PIBE_ARMADO.bolsillo[0] - 2, PIBE_ARMADO.bolsillo[1]];
  const revuelve = u > 1 && u < 2.1 ? Math.sin(u * 17) : 0;
  const quieta = manoQuieta(0);
  const mano = claves<Punto>(u, [
    [0, quieta], [0.8, arriba], [1.05, adentro], [2.1, [adentro[0] + 1, adentro[1] - 1]], [2.6, afuera], [3.3, mirar], [4.1, mirar], [4.8, bolsillo], [5.8, quieta],
  ], mezclaP);
  const conRevuelto: Punto = [mano[0] + revuelve * 2.2, mano[1] + Math.abs(revuelve) * 1.4];
  return {
    mano: u >= DURA.rapina ? null : conRevuelto,
    inclina: claves(u, [[0, 0], [0.8, -22], [2.3, -22], [3.3, -7], [4.6, -4], [5.6, 0]], mezcla),
    mira: u < 4.3 ? 'caja' : 'muelle',
    // Lo que sacó aparece cuando la mano ya salió por arriba del frente de la caja.
    botin: u > 2.42 && u < 4.7 ? Math.min(1, (u - 2.42) / 0.12, (4.7 - u) / 0.2) : 0,
    sacude: revuelve,
  };
}

/** El grito, en el tiempo `u` desde que lo tocaron: se para, alza la caja, grita, la baja y se sienta. */
export function grito(u: number, cajaEnSuLugarAhora: (parado: number) => Lugar): { parado: number; caja: Lugar; manos: [Punto, Punto] | null; grito: number; sacude: number } {
  const parado = claves(u, [[0, 0], [0.75, 1], [4.2, 1], [5.2, 0]], mezcla);
  // La caja va de su lugar a arriba de la cabeza en un arco, y vuelve.
  const k = claves(u, [[0, 0], [0.5, 0], [1.4, 1], [3.5, 1], [4.4, 0]], mezcla);
  const desde = cajaEnSuLugarAhora(parado);
  const sacude = u > 1.4 && u < 3.5 ? Math.sin(u * 26) * Math.min(1, (u - 1.4) * 3, (3.5 - u) * 3) : 0;
  const caja: Lugar = {
    x: mezcla(desde.x, CAJA_ARRIBA.x, k) - Math.sin(Math.PI * k) * 10,
    y: mezcla(desde.y, CAJA_ARRIBA.y, Math.sqrt(k)) + sacude * 1.2,
    giro: mezcla(desde.giro, CAJA_ARRIBA.giro, k) + Math.sin(Math.PI * k) * -14 + sacude * 4,
  };
  // Las manos van de donde estaban a los cantos de la caja, y vuelven: sin saltos.
  const agarra = claves(u, [[0.1, 0], [0.55, 1], [4.45, 1], [4.95, 0]], mezcla);
  const mano = (n: 0 | 1): Punto => mezclaP(manoQuieta(n, caderaEn(parado), parado), enLaCaja(AGARRE_CAJA[n], caja), agarra);
  return {
    parado,
    caja,
    manos: agarra > 0 ? [mano(0), mano(1)] : null,
    grito: claves(u, [[0, 0], [1.1, 0], [1.5, 1], [3.4, 1], [3.8, 0]], mezcla),
    sacude,
  };
}

export interface Estado {
  modo: Modo;
  pitadas: number;
  ceniza: number;
  botin: number;
  grito: number;
  parado: number;
}

/** Arma al pibe con un azar que se puede fijar (el test lo fija). La isla usa `armarPibe`. */
export function armarPibeCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--pibe')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ modo: 'sentado', pitadas: 0, ceniza: CENIZA.quieta, botin: 0, grito: 0, parado: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let modo: Modo = 'sentado';
  let desde = 0;
  let pitadas = 0;
  let proximaPitada = entre(TIEMPOS.primeraPitada);
  let pitadaDesde = -10;
  let humoDesde = -10;
  let humoNuevo = false;
  let humoDe: Punto = [0, 0];
  let proximoGolpecito = entre(TIEMPOS.golpecito);
  let golpecitoDesde = -10;
  let proximaRapina = entre(TIEMPOS.primeraRapina);
  let proximaMirada = entre(TIEMPOS.mirada);
  let mirada: Mirada = 'muelle';
  let proximoPataleo = entre(TIEMPOS.pataleo);
  let pataleoDesde = -10;
  let pataleoDura = 0;
  let parpadeo = entre(TIEMPOS.parpadeo);
  let guitarra = 0;
  let guitarraV = 0;
  let ultimo: Momento = QUIETA;
  // Con movimiento reducido: cuál de las dos poses quietas está a la vista.
  let paradoQuieto = false;
  // Lo que se suaviza de cuadro en cuadro: arranca en la pose quieta.
  const cara = { cabeza: QUIETA.cabeza, mira: [...QUIETA.mira] as [number, number], parpados: [...QUIETA.parpados] as [number, number] };

  const empezar = (m: Modo, t: number): void => {
    modo = m;
    desde = t;
  };

  const gritar = (t: number): void => {
    if (modo === 'grito' && t - desde < 3.4) return;
    empezar('grito', t);
  };

  function decidir(t: number): void {
    if (modo === 'rapina' && t - desde >= DURA.rapina) {
      empezar('sentado', t);
      proximaRapina = t + entre(TIEMPOS.rapina);
      proximaMirada = t + 0.6;
    }
    if (modo === 'grito' && t - desde >= DURA.grito) {
      empezar('sentado', t);
      mirada = 'vos';
      proximaMirada = t + entre(TIEMPOS.mirada);
      proximaRapina = Math.max(proximaRapina, t + 6);
    }
    const ocupado = t < golpecitoDesde + DURA.golpecito || t < pitadaDesde + DURA.pitada;
    if (modo === 'sentado') {
      if (t > proximaMirada) {
        const r = azar();
        mirada = r < 0.34 ? 'muelle' : r < 0.56 ? 'rana' : r < 0.76 ? 'vos' : r < 0.88 ? 'farol' : 'caja';
        proximaMirada = t + entre(TIEMPOS.mirada);
      }
      if (t > proximaRapina && !ocupado) {
        empezar('rapina', t);
        return;
      }
      if (t > proximoGolpecito && !ocupado && pitadas > 0) {
        golpecitoDesde = t;
        proximoGolpecito = t + entre(TIEMPOS.golpecito);
      }
    }
    // Las pitadas siguen en cualquier modo menos mientras grita: el pucho no se suelta nunca.
    if (t > proximaPitada && modo !== 'grito' && t > golpecitoDesde + DURA.golpecito) {
      pitadaDesde = t;
      pitadas++;
      proximaPitada = t + entre(TIEMPOS.pitada);
    }
    if (t > proximoPataleo && modo === 'sentado') {
      pataleoDesde = t;
      pataleoDura = entre(TIEMPOS.patalea);
      proximoPataleo = t + pataleoDura + entre(TIEMPOS.pataleo);
    }
  }

  function momento(t: number, paso: number): Momento {
    const u = t - desde;
    const m: Momento = { ...QUIETA, manos: [null, null] };

    // Respira, y la cadera no se mueve: el pecho sube y baja.
    m.respira = Math.sin(t * 1.7) * (modo === 'grito' ? 0.4 : 1);

    // La pitada: la brasa se prende, la ceniza ya creció, y al rato larga el humo.
    const up = t - pitadaDesde;
    const tira = up >= 0 && up < DURA.pitada ? Math.min(suave(up / 0.35), suave((DURA.pitada - up) / 0.5)) : 0;
    m.brasa = QUIETA.brasa + (1 - QUIETA.brasa) * tira + Math.sin(t * 7.3) * Math.sin(t * 2.1) * 0.06;
    m.ceniza = cenizaTras(pitadas);
    if (up >= DURA.pitada * 0.9 && humoDesde < pitadaDesde) {
      humoDesde = t;
      humoNuevo = true;
    }

    let mira: Mirada = mirada;
    let manos: [Punto | null, Punto | null] = [null, null];
    if (modo === 'rapina') {
      const r = rapina(u, cajaEnSuLugar(caderaEn(0)));
      m.inclina = r.inclina;
      manos = [r.mano, null];
      mira = r.mira;
      m.botin = r.botin;
      m.caja = { ...cajaEnSuLugar(caderaEn(0)), giro: r.sacude * 1.6 };
    } else if (modo === 'grito') {
      const gr = grito(u, (k) => cajaEnSuLugar(caderaEn(k)));
      m.parado = gr.parado;
      m.inclina = ALZADA.inclina * gr.grito + gr.sacude * 1.4;
      m.caja = gr.caja;
      m.grito = gr.grito;
      if (gr.manos) manos = gr.manos;
      mira = u < 0.9 ? 'caja' : u < 3.6 ? 'arriba' : 'vos';
    }

    // El golpecito al pucho: la mano de la derecha va a la boca, el dedo le pega, el pucho se sacude.
    const ug = t - golpecitoDesde;
    if (modo !== 'grito' && ug >= 0 && ug < DURA.golpecito) {
      const llega = Math.min(suave(ug / 0.45), suave((DURA.golpecito - ug) / 0.45));
      const boca = puchoEn({ ...m, cabeza: cara.cabeza });
      manos = [manos[0], mezclaP(manoQuieta(1), [boca[0] + 4.6, boca[1] + 4.4], llega)];
      const dg = ug - 0.62;
      m.pucho = dg > 0 ? 16 * Math.exp(-dg * 5) * Math.sin(dg * 34) : 0;
      if (llega < 0.02) manos = [manos[0], null];
    }
    // El pucho, además, tiembla con el grito y con cada pitada.
    m.pucho += m.grito * Math.sin(t * 31) * 3 + tira * -4;
    m.manos = manos;

    // Patea el container: las dos piernas, a contratiempo, y se va calmando.
    const up2 = t - pataleoDesde;
    if (up2 >= 0 && up2 < pataleoDura && modo !== 'grito') {
      const amp = Math.min(suave(up2 / 0.5), suave((pataleoDura - up2) / 0.6));
      m.patas = [Math.sin(up2 * 5.2) * amp, Math.sin(up2 * 5.2 + Math.PI * 0.85) * amp];
    }

    // La cara: adónde mira, el parpadeo; con la pitada, la pera para arriba y los ojos que se achican.
    const meta = MIRADAS[mira];
    const v = paso * 5;
    cara.cabeza = hacia(cara.cabeza, meta.cabeza - tira * 3, paso * 60);
    cara.mira = [hacia(cara.mira[0], meta.mira[0], v), hacia(cara.mira[1], meta.mira[1], v)];
    const pesados = mira === 'arriba' ? ALZADA.parpados : QUIETA.parpados;
    cara.parpados = [0, 1].map((i) => hacia(cara.parpados[i]!, pesados[i]! + tira * 0.25, paso * 3)) as [number, number];
    if (t > parpadeo + 0.13) parpadeo = t + entre(TIEMPOS.parpadeo);
    const ciego = t > parpadeo && t < parpadeo + 0.13;
    m.cabeza = cara.cabeza;
    m.mira = cara.mira;
    m.parpados = ciego ? [1, 1] : cara.parpados;

    // La strato colgada se mece: llega tarde a cada movimiento del torso, con un resorte.
    const metaGuitarra = -m.inclina * 0.35 + (modo === 'grito' ? Math.sin(t * 13) * 5 * m.grito : 0) + m.respira * 0.5;
    guitarraV += ((metaGuitarra - guitarra) * 40 - guitarraV * 7) * paso;
    guitarra += guitarraV * paso;
    m.guitarra = guitarra;

    // El humo: sale de la boca y sube enroscándose, se agranda y se va.
    const uh = t - humoDesde;
    if (uh >= 0 && uh < DURA.humo) {
      if (humoNuevo) {
        humoDe = puchoEn(m);
        humoNuevo = false;
      }
      const k = uh / DURA.humo;
      m.humo = { x: humoDe[0] + 4 + k * 8 + Math.sin(uh * 2.4) * 2, y: humoDe[1] - 2 - k * 26, k: 0.55 + k * 0.9, o: Math.min(1, uh / 0.4) * (1 - k) * 0.95 };
    }
    return m;
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto()) {
      // Las dos poses quietas, tal cual: la de sentado es la del HTML.
      aplicar(paradoQuieto ? ALZADA : QUIETA);
      return;
    }
    const paso = Math.min(dt, 0.1);
    if (paso > 0) decidir(t);
    aplicar(paso > 0 ? momento(t, paso) : t === 0 && dt === 0 ? QUIETA : momento(t, 0));
  }

  function aplicar(m: Momento): void {
    ultimo = m;
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      paradoQuieto = !paradoQuieto;
      pintar(t, 0);
    } else gritar(t);
    esc.hablar(ID, VERSO[0], VERSO[1], true);
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
      if (!esc.quieto()) gritar(t);
      return true;
    },
    estado: () => ({ modo, pitadas, ceniza: ultimo.ceniza, botin: ultimo.botin, grito: ultimo.grito, parado: ultimo.parado }),
  };
}

export const armarPibe: Armar = (marcos, esc) => armarPibeCon(marcos, esc);
