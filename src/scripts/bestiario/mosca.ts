/**
 * La mosca (`D-73`, decimoséptima vuelta), sobre la olla de la mesa servida.
 *
 * Lo que hace solo es lo que hace una mosca, y nada es un bucle.
 *
 * - **Da vueltas sobre la olla**, en ochos que nunca son el mismo, metida en el seguidor que se escapa
 *   de la foto del escenario.
 * - **Se posa**: en el borde de la olla, en la punta del cucharón, o **en la sopa**, que es lo que dice
 *   el título del disco (*"algo rico arruinado por un elemento extraño que le cayó adentro"*, `RES-21`).
 *   En la sopa hace anillos. Posada, se frota las patas de adelante, da dos pasitos y se da vuelta.
 *
 * Tocada, **es el verso hecho gesto** (*"Sentís la mosca joder detrás de la oreja"*): se te viene encima,
 * zumba delante de la cara de quien mira, y se va de golpe para arriba, por detrás de la oreja. Al rato
 * vuelve a la olla. Dice su verso. Con movimiento reducido no se mueve nada: tocarla la pasa del borde de
 * la olla a encima tuyo.
 *
 * Se lleva números (`rig-mosca.ts`) y nada que dibuje.
 */

import { ENCIMA, OCHO, POSADAS, QUIETA, VERSO, enElOcho, marcas, rumboDe, type Momento, type Posada, type Punto } from '../../lib/bestiario/rig-mosca.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-mosca';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  vuelo: [4.5, 9],
  primerVuelo: [1.5, 3],
  posada: [3, 6.5],
  frota: [0.7, 1.5],
  pausa: [0.4, 1.4],
} as const;

/** Cuánto duran las cosas. */
export const DURA = { baja: 0.85, sube: 0.6, encima: 2.3, afuera: 1.1, vuelve: 0.9, paso: 0.45 } as const;

/** Cuánto espera para abrir la ficha después del toque: que se la vea venir encima. */
export const DEMORA_FICHA = 1.0;

/** Por dónde se va, por arriba y detrás de la oreja, y por dónde vuelve. */
export const AFUERA: Punto = [OCHO.x - 70, -50];
export const VUELTA: Punto = [OCHO.x + 90, -40];

type Modo = 'vuela' | 'baja' | 'posada' | 'sube' | 'encima' | 'afuera' | 'vuelve';

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclaP = (a: Punto, b: Punto, k: number): Punto => [mezcla(a[0], b[0], k), mezcla(a[1], b[1], k)];
/** Gira de `a` a `b` por el lado más corto, en grados. */
const hacia = (a: number, b: number, k: number): number => a + ((((b - a) % 360) + 540) % 360 - 180) * k;

export interface Estado {
  modo: Modo;
  posada: Posada | null;
  posadas: number;
  frotadas: number;
  x: number;
  y: number;
}

/** Arma a la mosca con un azar que se puede fijar (el test lo fija). La isla usa `armarMosca`. */
export function armarMoscaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--mosca')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ modo: 'posada', posada: null, posadas: 0, frotadas: 0, x: 0, y: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let hablarEn: number | null = null;
  let encimaQuieta = false;

  // Arranca posada en el borde, como en el HTML, y al rato levanta vuelo.
  let modo: Modo = 'posada';
  let desde = 0;
  let hasta = entre(TIEMPOS.primerVuelo);
  let donde: Posada = 'borde-derecho';
  let origen: Punto = [QUIETA.x, QUIETA.y];
  let rumboOrigen = QUIETA.rumbo;
  let u = Math.PI * 0.5;
  let pos: Punto = [QUIETA.x, QUIETA.y];
  let rumbo = QUIETA.rumbo;
  let posadas = 0;
  let frotadas = 0;
  // Posada: cuándo se frota y cuándo da un paso, y para dónde.
  let frotaHasta = -1;
  let proximaFrota = 0;
  let pasoDesde = -10;
  let pasoDe: Punto = [0, 0];
  let pasoA: Punto = [0, 0];
  let rumboPaso = 0;
  let proximoPaso = 0;
  let toquePendiente = false;

  const cambiar = (nuevo: Modo, t: number): void => {
    modo = nuevo;
    desde = t;
    origen = pos;
    rumboOrigen = rumbo;
  };

  /** Se posa en alguno que no sea el de recién. */
  const posarse = (t: number): void => {
    const lugares = (Object.keys(POSADAS) as Posada[]).filter((l) => l !== donde);
    donde = lugares[Math.floor(azar() * lugares.length)]!;
    cambiar('baja', t);
  };

  function momento(t: number, dt: number): Momento {
    const m: Momento = { ...QUIETA, patas: [0, 0] };
    let v = t - desde;
    // Lo que pasa cuando termina cada cosa.
    if (modo === 'vuela' && t >= hasta) posarse(t);
    else if (modo === 'baja' && v >= DURA.baja) {
      cambiar('posada', t);
      hasta = t + entre(TIEMPOS.posada);
      posadas++;
      proximaFrota = t + entre(TIEMPOS.pausa);
      proximoPaso = t + entre(TIEMPOS.pausa) + 0.6;
    } else if (modo === 'posada' && t >= hasta) cambiar('sube', t);
    else if (modo === 'sube' && v >= DURA.sube) {
      cambiar('vuela', t);
      hasta = t + entre(TIEMPOS.vuelo);
    } else if (modo === 'encima' && v >= DURA.encima) cambiar('afuera', t);
    else if (modo === 'afuera' && v >= DURA.afuera) cambiar('vuelve', t);
    else if (modo === 'vuelve' && v >= DURA.vuelve) {
      cambiar('vuela', t);
      hasta = t + entre(TIEMPOS.vuelo);
    }
    if (toquePendiente && (modo === 'vuela' || modo === 'posada' || modo === 'sube')) {
      toquePendiente = false;
      cambiar('encima', t);
    }
    v = t - desde;
    const w = 1.05 + 0.45 * Math.sin(t * 0.73) + 0.2 * Math.sin(t * 2.1);
    const vuelo = (): void => {
      // El aleteo: las alas abiertas, temblando, y el borrón que zumba.
      m.alas = 0.8 + 0.2 * Math.sin(t * 87);
      m.zumba = 0.75 + 0.25 * Math.sin(t * 53);
      m.sombra = 0;
    };
    const ahora = (v2: number): number => (modo === 'baja' ? v2 / DURA.baja : modo === 'sube' ? v2 / DURA.sube : v2);
    let nueva: Punto = pos;
    let rumboMeta = rumbo;
    switch (modo) {
      case 'vuela': {
        u += w * dt;
        const q = enElOcho(u);
        nueva = [q[0] + Math.sin(t * 17) * 1.4, q[1] + Math.sin(t * 23 + 1) * 1.6];
        rumboMeta = rumboDe(pos, nueva);
        vuelo();
        break;
      }
      case 'baja': {
        const k = suave(ahora(v));
        const S = POSADAS[donde];
        // Baja en curva: primero se pasa un poco por arriba, después se deja caer.
        nueva = [mezcla(origen[0], S.punto[0], k), mezcla(origen[1], S.punto[1], k) - Math.sin(k * Math.PI) * 18];
        rumboMeta = k < 0.8 ? rumboDe(pos, nueva) : S.rumbo;
        vuelo();
        m.alas = mezcla(m.alas, 0, rampa(k, 0.75, 1));
        m.zumba *= 1 - rampa(k, 0.7, 1);
        m.sombra = rampa(k, 0.8, 1);
        break;
      }
      case 'posada': {
        const S = POSADAS[donde];
        // Se frota las patas de adelante, de a ratos; entre una y otra da un pasito y se da vuelta.
        if (t >= proximaFrota && frotaHasta < t) {
          frotaHasta = t + entre(TIEMPOS.frota);
          proximaFrota = frotaHasta + entre(TIEMPOS.pausa);
          frotadas++;
        }
        if (t < frotaHasta) {
          const a = Math.sin(t * 26) * 24;
          m.patas = [a, -a];
        }
        if (t >= proximoPaso && t >= frotaHasta) {
          pasoDesde = t;
          pasoDe = [pos[0] - S.punto[0], pos[1] - S.punto[1]];
          const lejos = donde === 'cucharon' ? 2 : 7;
          pasoA = [(azar() - 0.5) * 2 * lejos, (azar() - 0.5) * 2];
          rumboPaso = S.rumbo + (azar() - 0.5) * 90;
          proximoPaso = t + DURA.paso + entre(TIEMPOS.pausa) + 0.8;
        }
        const kp = rampa(t - pasoDesde, 0, DURA.paso);
        const off = mezclaP(pasoDe, pasoA, kp);
        nueva = [S.punto[0] + off[0], S.punto[1] + off[1]];
        rumboMeta = t - pasoDesde < DURA.paso ? rumboPaso : rumbo;
        // Un temblor de patas mientras camina.
        if (kp > 0 && kp < 1) m.patas = [Math.sin(t * 40) * 10, Math.sin(t * 40 + 2) * 10];
        m.sombra = 1;
        if (donde === 'sopa') m.anillo = ((t - desde) % 1.3) / 1.3;
        break;
      }
      case 'sube': {
        const k = suave(ahora(v));
        nueva = mezclaP(origen, enElOcho(u), k);
        rumboMeta = rumboDe(pos, nueva);
        vuelo();
        m.alas *= rampa(k, 0, 0.2);
        m.sombra = 1 - rampa(k, 0, 0.3);
        break;
      }
      case 'encima': {
        // Se te viene encima: grande, delante de la cara, zumbando en zigzag; y se va para arriba.
        const llega = rampa(v, 0, 0.5);
        const vaSe = rampa(v, 1.6, DURA.encima);
        const zig: Punto = [Math.sin(v * 13) * 7 + Math.sin(v * 29) * 3, Math.sin(v * 17 + 1) * 5];
        const delante: Punto = [ENCIMA.x + zig[0] * llega, ENCIMA.y + zig[1] * llega];
        nueva = mezclaP(mezclaP(origen, delante, llega), AFUERA, vaSe * vaSe);
        rumboMeta = vaSe > 0 ? rumboDe(pos, nueva) : hacia(rumboOrigen, ENCIMA.rumbo + Math.sin(v * 9) * 25, llega);
        vuelo();
        m.cerca = llega * (1 - vaSe * 0.4);
        m.zumba = 1;
        break;
      }
      case 'afuera': {
        nueva = VUELTA;
        m.visible = false;
        m.sombra = 0;
        break;
      }
      case 'vuelve': {
        const k = suave(ahora(v) / DURA.vuelve);
        nueva = mezclaP(VUELTA, enElOcho(u), k);
        rumboMeta = rumboDe(pos, nueva);
        vuelo();
        break;
      }
    }
    // El rumbo se acomoda rápido pero no salta.
    if (Math.hypot(nueva[0] - pos[0], nueva[1] - pos[1]) > 0.01 || modo === 'posada') rumbo = hacia(rumbo, rumboMeta, Math.min(1, dt * (modo === 'posada' ? 6 : 14)));
    pos = nueva;
    m.x = pos[0];
    m.y = pos[1];
    m.rumbo = rumbo;
    return m;
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(encimaQuieta ? ENCIMA : QUIETA);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETA);
      return;
    }
    aplicar(momento(t, Math.min(dt, 0.1)));
  }

  const tocado = (t: number): void => {
    if (modo === 'encima' || modo === 'afuera' || modo === 'vuelve') return;
    if (modo === 'baja') toquePendiente = true;
    else cambiar('encima', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      encimaQuieta = !encimaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba del ocho, y la página abre la ficha. */
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
    estado: () => ({ modo, posada: modo === 'posada' ? donde : null, posadas, frotadas, x: pos[0], y: pos[1] }),
  };
}

export const armarMosca: Armar = (marcos, esc) => armarMoscaCon(marcos, esc);
