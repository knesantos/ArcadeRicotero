/**
 * El rato molhado (`D-73`, decimoquinta vuelta), nadando en el bajo inundado.
 *
 * Flota con el agua al pecho, empapado, con las botas nuevas en alto y el porrón en la otra mano. Lo
 * que hace sale de la letra:
 *
 * - **Huele** para el lado de Pierre, que tiene la botella: *"va por un golpe más de borbón"*. El
 *   hocico para arriba, los bigotes que tiemblan, los ojos entrecerrados.
 * - **Se seca la nariz con la manga**, que está tan mojada como él: *"con la manga seca su nariz"*.
 * - **Se le cansa el brazo de las botas.** Baja de a poco, sin que la cara cambie (*"su cara es tan
 *   expresiva / como el par de sus botas nuevas"*), hasta que las suelas tocan el agua. Entonces las
 *   levanta de un tirón, las da vuelta, les sale el agua a chorro, las sacude y las vuelve a poner en
 *   alto. Y le gotea el hocico, siempre: cada gota hace su onda.
 *
 * **Tocado, brinda**: *"Tumberito jamón y porrón / mirá vos qué tan lejos llegó"*. Patalea y saca el
 * pecho del agua, levanta el porrón y las botas, el hocico arriba, y le brillan los dientes de oro. Al
 * bajar, el agua le hace ondas. Con movimiento reducido no se mueve nada: tocarlo lo pasa de una pose
 * quieta a la otra (nadando, brindando) y dice su verso.
 *
 * Se lleva números (`rig-rato.ts`) y nada que dibuje: la pose sale de la misma cuenta que la del
 * HTML, así la pose quieta de la isla es la de sin JavaScript.
 */

import {
  BRAZOS, GESTOS, PORRON_EN_LA_MANGA, RATO, RATO_ARMADO, VERSO, VUELCO, alRecinto, brazos, brindando, enLaCabeza, entre, suelas, transformes, vuelco,
  type Gesto, type Punto,
} from '../../lib/bestiario/rig-rato.ts';
import { hacia, partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-rato-molhado';

export type Modo = 'nada' | 'huele' | 'manga' | 'cansa' | 'vuelca' | 'brinda';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  primera: [3, 6],
  espera: [4, 9],
  huele: [2.2, 3.4],
  manga: 1.8,
  cansa: [4.5, 6.5],
  vuelca: VUELCO.fin,
  brinda: 3.2,
  mirada: [1.4, 3.6],
  parpadeo: [2.6, 6.5],
  oreja: [3, 8],
  gota: [1.4, 3.6],
  onda: [2.4, 4.2],
} as const;

export interface Estado {
  modo: Modo;
  /** Cuánto lleva en el modo, en segundos. */
  hace: number;
  /** La última pose que pintó (para el test). */
  gesto: Gesto;
  /** Si el chorro de las botas está saliendo. */
  chorrea: boolean;
}

interface Onda { n: number; x: number; y: number; desde: number; vida: number; r0: number; r1: number; ry: number }
interface Gota { n: number; x: number; y0: number; desde: number; viva: boolean }

const GRAVEDAD = 520;

/** Arma al rato con un azar que se puede fijar (el test lo fija). La isla usa `armarRato`. */
export function armarRatoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const marco = marcos.find((m) => m.querySelector('.titere--rato'));
  const quietoGesto = (): Gesto => GESTOS.nada;
  if (!marco) return { mover: () => {}, reaccionar: () => false, estado: () => ({ modo: 'nada', hace: 0, gesto: quietoGesto(), chorrea: false }) };
  const titere = marco.querySelector<SVGGElement>('.titere--rato')!;
  const p = partes(marco);
  const entreT = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let modo: Modo = 'nada';
  let desde = 0;
  let dura = 0;
  let proximo = entreT(TIEMPOS.primera);
  let proximaMirada = entreT(TIEMPOS.mirada);
  let parpadeo = entreT(TIEMPOS.parpadeo);
  let proximaOreja = entreT(TIEMPOS.oreja);
  let orejaDesde = -10;
  let proximaGota = entreT(TIEMPOS.gota);
  let proximaOnda = entreT(TIEMPOS.onda);
  let brindaQuieto = false;
  let ultimo: Gesto = GESTOS.nada;
  let chorrea = false;
  let proximaSalpicada = 0;
  let ultimaCosa: Modo = 'nada';
  // Donde arrancó el brazo de las botas cuando empezó a vaciarlas (viene cansado, de abajo).
  let brazoDesde: Punto = GESTOS.nada.brazo1;
  // Lo que se suaviza de cuadro en cuadro: adónde mira cuando no hace nada.
  const mirada = { mira: [...GESTOS.nada.mira] as [number, number], cabeza: 0, meta: [...GESTOS.nada.mira] as [number, number], metaCabeza: 0 };

  const ondas: Onda[] = [1, 2, 3].map((n) => ({ n, x: 0, y: 0, desde: -100, vida: 1, r0: 0, r1: 0, ry: 0.13 }));
  const gotas: Gota[] = [1, 2, 3].map((n) => ({ n, x: 0, y0: 0, desde: -100, viva: false }));

  function empezar(m: Modo, t: number, segundos: number): void {
    modo = m;
    desde = t;
    dura = segundos;
  }

  /** Una onda en el agua: se abre y se apaga. Se usa la más vieja. */
  function onda(x: number, t: number, r0: number, r1: number, vida: number, ry = 0.13): void {
    const o = ondas.reduce((a, b) => (t - a.desde > t - b.desde ? a : b));
    Object.assign(o, { x, y: RATO.agua + 0.5, desde: t, vida, r0, r1, ry });
  }

  /** El gesto de cada momento: el de nadar, con lo que esté haciendo encima. */
  function gestoEn(t: number): Gesto {
    const u = t - desde;
    const base = GESTOS.nada;
    let g: Gesto = { ...base, mira: mirada.mira, cabeza: mirada.cabeza };
    // Lo que entra y sale de un gesto: sube en `a` segundos, se queda, y baja en `b`.
    const sobre = (a: number, b: number): number => Math.min(suave(u / a), suave((dura - u) / b));
    switch (modo) {
      case 'huele': {
        const e = sobre(0.45, 0.55);
        g = entre(g, { ...g, cabeza: -7, corre: [4, -3], mira: [1, -0.35], parpados: [0.62, 0.58], abre: 1.15, oreja: -8 }, e);
        g.bigotes = Math.sin(u * 38) * 3.2 * e;
        g.abre += Math.sin(u * 31) * 0.05 * e;
        break;
      }
      case 'manga': {
        const e = sobre(0.42, 0.45);
        const frota = Math.sin(Math.max(0, u - 0.42) * Math.PI * 2.6) * 11 * Math.min(1, suave((u - 0.3) / 0.2)) * e;
        g = entre(g, { ...g, brazo2: [BRAZOS.manga[0], BRAZOS.manga[1]], porron: PORRON_EN_LA_MANGA, cabeza: 4, corre: [1, 1], mira: [0.2, 0.6], parpados: [0.66, 0.62] }, e);
        g.brazo2 = [g.brazo2[0] + frota * 0.35, g.brazo2[1] + frota];
        g.bigotes = -frota * 0.4;
        break;
      }
      case 'cansa': {
        // Baja de a poco, cada vez más ligero, sin que se le mueva la cara.
        const k = suave(u / dura) ** 1.4;
        g = { ...g, brazo1: [base.brazo1[0] + (BRAZOS.cansado[0] - base.brazo1[0]) * k, base.brazo1[1] + (BRAZOS.cansado[1] - base.brazo1[1]) * k], hamaca: Math.sin(u * 2.1) * 3 * k };
        break;
      }
      case 'vuelca': {
        // Mira las botas mientras las vacía, con la misma cara de siempre; al final vuelve a mirarte.
        const mira: Punto = [-1, -0.8];
        const k = suave((u - VUELCO.endereza) / (VUELCO.fin - VUELCO.endereza));
        g = { ...g, ...vuelco(u, brazoDesde), cabeza: -3 * (1 - k), parpados: [0.5, 0.46], mira: [mira[0] + (base.mira[0] - mira[0]) * k, mira[1] + (base.mira[1] - mira[1]) * k] };
        break;
      }
      case 'brinda': {
        const e = sobre(0.55, 0.8);
        const camino = brindando(e);
        g = entre(g, GESTOS.brinda, e);
        g.brazo2 = camino.brazo2;
        g.porron = camino.porron;
        // El chin-chin: empuja el porrón para adelante una vez, y vuelve.
        const chin = Math.max(0, Math.sin(Math.max(0, u - 0.7) * Math.PI * 2.4)) * (u < 1.12 ? 1 : 0);
        g.brazo2 = [g.brazo2[0] + chin * 8, g.brazo2[1] - chin * 6];
        g.brillo = e * Math.max(0, 1 - Math.abs(u - 1.1) / 0.6);
        g.hamaca += Math.sin(u * 4) * 4 * e;
        break;
      }
      default:
        break;
    }
    // Flota: sube y baja con el agua, y se mece. La cola ondula en el agua. La oreja, cada tanto, se sacude.
    g.sube += Math.sin(t * 0.9) * 2.4;
    g.mece += Math.sin(t * 0.6) * 1.1;
    g.cola += Math.sin(t * 0.7) * 5;
    g.punta += Math.sin(t * 0.7) * 6 + Math.sin(t * 1.3) * 5;
    const uo = t - orejaDesde;
    if (uo >= 0 && uo < 0.4) g.oreja += -16 * Math.sin((uo / 0.4) * Math.PI) * (Math.sin(uo * 50) * 0.3 + 0.7);
    if (t > parpadeo && t < parpadeo + 0.13) g.parpados = [1, 1];
    return g;
  }

  function decidir(t: number): void {
    const u = t - desde;
    if (modo === 'nada') {
      if (t > proximaMirada) {
        const r = azar();
        // A vos, a la botella de Pierre, a sus botas.
        if (r < 0.5) [mirada.meta, mirada.metaCabeza] = [[-0.35, 0.1], 0];
        else if (r < 0.78) [mirada.meta, mirada.metaCabeza] = [[0.9, -0.1], 2];
        else [mirada.meta, mirada.metaCabeza] = [[-0.9, -0.7], -2];
        proximaMirada = t + entreT(TIEMPOS.mirada);
      }
      if (t > proximo) {
        // Una de las tres, al azar, pero nunca la misma dos veces seguidas.
        const otras = (['huele', 'manga', 'cansa'] as const).filter((m) => m !== ultimaCosa);
        const m = otras[Math.floor(azar() * otras.length)]!;
        ultimaCosa = m;
        if (m === 'huele') empezar('huele', t, entreT(TIEMPOS.huele));
        else if (m === 'manga') empezar('manga', t, TIEMPOS.manga);
        else empezar('cansa', t, entreT(TIEMPOS.cansa));
      }
      return;
    }
    if (modo === 'cansa') {
      // Cuando las suelas tocan el agua, las saca de un tirón.
      if (suelas(ultimo)[1] > -2 || u >= dura) {
        brazoDesde = ultimo.brazo1;
        const [x] = alRecinto(suelas(ultimo), ultimo);
        onda(x, t, 4, 22, 1, 0.2);
        empezar('vuelca', t, TIEMPOS.vuelca);
      }
      return;
    }
    if (u >= dura) {
      if (modo === 'brinda') onda(RATO.x, t, 30, 86, 1.6);
      modo = 'nada';
      mirada.meta = [-0.35, 0.1];
      mirada.metaCabeza = 0;
      proximo = t + entreT(TIEMPOS.espera);
    }
  }

  function pintarAgua(t: number, g: Gesto): void {
    // Las ondas: anillos que se abren y se apagan; cada uno va partido, la mitad de atrás y la de adelante.
    for (const o of ondas) {
      const k = (t - o.desde) / o.vida;
      for (const lado of ['atras', 'adelante']) {
        const e = p.get(`onda-${lado}-${o.n}`);
        if (!e) continue;
        if (k < 0 || k > 1) {
          e.setAttribute('opacity', '0');
          continue;
        }
        const rx = o.r0 + (o.r1 - o.r0) * suave(k);
        e.setAttribute('cx', o.x.toFixed(1));
        e.setAttribute('cy', o.y.toFixed(1));
        e.setAttribute('rx', rx.toFixed(1));
        e.setAttribute('ry', (rx * o.ry).toFixed(1));
        e.setAttribute('opacity', ((1 - k) * 0.7).toFixed(2));
      }
    }
    // Las gotas que le caen del hocico: caen, pegan en el agua y hacen su onda.
    for (const d of gotas) {
      const e = p.get(`gota-${d.n}`);
      if (!e || !d.viva) continue;
      const u = t - d.desde;
      const y = d.y0 + 0.5 * GRAVEDAD * u * u;
      if (y >= RATO.agua) {
        d.viva = false;
        e.setAttribute('opacity', '0');
        onda(d.x, t, 1.5, 12, 0.8, 0.22);
        continue;
      }
      e.setAttribute('cx', d.x.toFixed(1));
      e.setAttribute('cy', y.toFixed(1));
      e.setAttribute('opacity', '0.9');
    }
    if (t > proximaGota) {
      const d = gotas.find((x) => !x.viva);
      if (d) {
        // De la punta del hocico, o de la barbilla.
        const de = azar() < 0.6 ? RATO_ARMADO.bajoLaNariz : ([44, -96] as Punto);
        const [x, y] = alRecinto(enLaCabeza(de, g), g);
        Object.assign(d, { x, y0: y + 1.5, desde: t, viva: true });
      }
      proximaGota = t + entreT(TIEMPOS.gota);
    }
    if (modo === 'nada' && t > proximaOnda) {
      onda(RATO.x, t, 24, 70, 2.4);
      proximaOnda = t + entreT(TIEMPOS.onda);
    }
    // El chorro de las botas dadas vuelta: de la boca de la caña, que está en el puño, hasta el agua.
    const chorro = p.get('chorro');
    const u = t - desde;
    chorrea = modo === 'vuelca' && u > VUELCO.gira - 0.15 && u < VUELCO.sacude + 0.1;
    if (chorro) {
      if (chorrea) {
        const [x, y] = alRecinto(brazos(g)[0].puno, g);
        chorro.setAttribute('d', `M${x.toFixed(1)} ${(y + 4).toFixed(1)} C${(x + 1).toFixed(1)} ${(y + 20).toFixed(1)} ${(x - 1).toFixed(1)} ${(RATO.agua - 20).toFixed(1)} ${x.toFixed(1)} ${(RATO.agua + 1).toFixed(1)}`);
        chorro.setAttribute('opacity', u > VUELCO.chorro ? '0.5' : '1');
        chorro.setAttribute('stroke-dashoffset', (-((t * 95) % 17)).toFixed(1));
        if (t > proximaSalpicada) {
          onda(x, t, 3, 18, 0.7, 0.2);
          proximaSalpicada = t + 0.25;
        }
      } else chorro.setAttribute('opacity', '0');
    }
    // El reflejo se corre de costado, como se corre en el agua que se mueve.
    p.get('reflejo')?.setAttribute('transform', `translate(${(Math.sin(t * 1.3) * 1.6).toFixed(2)} 0)`);
  }

  function aplicar(t: Readonly<Record<string, string>>): void {
    for (const [nombre, valor] of Object.entries(t)) {
      const el = p.get(nombre);
      if (!el) continue;
      if (nombre === 'brillo') el.setAttribute('opacity', valor);
      else el.setAttribute('transform', valor);
    }
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto() || dt === 0) {
      // Las dos poses quietas, tal cual: la de nadar es la del HTML.
      ultimo = esc.quieto() && brindaQuieto ? GESTOS.brinda : GESTOS.nada;
      aplicar(transformes(ultimo));
      return;
    }
    const paso = Math.min(dt, 0.1);
    decidir(t);
    if (t > parpadeo + 0.13) parpadeo = t + entreT(TIEMPOS.parpadeo);
    if (t > proximaOreja) {
      orejaDesde = t;
      proximaOreja = t + entreT(TIEMPOS.oreja);
    }
    mirada.mira = [hacia(mirada.mira[0], mirada.meta[0], paso * 3), hacia(mirada.mira[1], mirada.meta[1], paso * 3)];
    mirada.cabeza = hacia(mirada.cabeza, mirada.metaCabeza, paso * 6);
    ultimo = gestoEn(t);
    aplicar(transformes(ultimo));
    pintarAgua(t, ultimo);
  }

  function brindar(t: number): void {
    if (modo === 'brinda') {
      dura = Math.max(dura, t - desde + 1.6);
      return;
    }
    // Si estaba con las botas, las deja en alto de una: el brindis manda.
    empezar('brinda', t, TIEMPOS.brinda);
    onda(RATO.x, t, 20, 60, 0.9);
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      brindaQuieto = !brindaQuieto;
      pintar(t, 0);
    } else brindar(t);
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
      if (!esc.quieto()) brindar(t);
      return true;
    },
    estado: () => ({ modo, hace: esc.reloj() - desde, gesto: ultimo, chorrea }),
  };
}

export const armarRato: Armar = (marcos, esc) => armarRatoCon(marcos, esc);
