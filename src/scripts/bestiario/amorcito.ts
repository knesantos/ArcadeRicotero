/**
 * El amorcito que mordió el vidrio (`D-73`, vigesimosegunda vuelta), colgada de la ventana rota del bajo.
 *
 * Lo que hace solo es estar borracha por demás otra vez, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Se mece**: para un lado y para el otro, y la cabeza va un poco después que el cuerpo.
 * - **Tiene hipo**: un saltito, y le sale una burbuja de soda.
 * - **Se tira soda**: levanta el sifón y lo aprieta, para arriba.
 * - **Dormita**: se le cierran los ojos, se le cae la cabeza, y se despierta de golpe.
 * - **Saluda** con la mano suelta a nadie, para el lado del agua.
 *
 * Tocada, **muerde alocada** (*"cuando me muerda alocada: ¡Ñam fri frufi fali fru!"*): abre grande, muerde
 * el vidrio, que salta en migas, aparece el *¡Ñam!* escrito en el aire y empieza a cabalgar en el marco,
 * revoleando el sifón con el chorro. Después se calma, le agarra el hipo, y ya tiene otro vidrio entre los
 * dientes. Dice su verso. Con movimiento reducido no se mueve nada: tocarla la pasa de colgada al ¡Ñam!.
 *
 * Se lleva números (`rig-amorcito.ts`) y nada que dibuje.
 */

import { NAM, QUIETO, SORBO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-amorcito.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-amorcito-que-mordio-el-vidrio';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { mece: 3.2, hipo: 1.4, soda: 2.4, dormita: 3, saluda: 2.2, muerde: 4.8 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1, 2.8] as const;
export const PRIMERA = [0.5, 1.6] as const;
export const DEMORA_FICHA = 1.3;

/** Los tiempos de la mordida: cuándo cierra la boca, cuándo cabalga y cuándo vuelve el vidrio. */
export const MUERDE_T = { abre: [0, 0.35], cierra: 0.42, migas: [0.42, 1.1], nam: [0.45, 0.75, 2.8, 3.3], cabalga: [0.8, 3.3], hipo: [3.6, 4.1], vidrio: [3.9, 4.4] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const tramo = (u: number, a: number, b: number): number => Math.min(1, Math.max(0, (u - a) / (b - a)));

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al amorcito con un azar que se puede fijar (el test lo fija). La isla usa `armarAmorcito`. */
export function armarAmorcitoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--amorcito')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { mece: 0, hipo: 0, soda: 0, dormita: 0, saluda: 0, muerde: 0 };
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
  let namQuieto = false;
  let lado = 1;

  function elegir(): Accion {
    const opciones = (['mece', 'hipo', 'soda', 'dormita', 'saluda'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'muerde' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO, brazos: [...QUIETO.brazos] };
    // Borracha: se mece despacito, la cabeza llega tarde, los brazos cuelgan y se balancean.
    m.mece = 3 * Math.sin(t * 0.9);
    m.cabeza = QUIETO.cabeza - 5 * Math.sin(t * 0.9 - 0.8);
    m.brazos = [4 * Math.sin(t * 0.9 + 0.5), 3 * Math.sin(t * 0.9 + 0.2)];
    m.parpado = QUIETO.parpado + 0.15 * Math.sin(t * 0.37);
    m.colorado = QUIETO.colorado + 0.2 * Math.sin(t * 0.6);
    const u = t - desde;
    switch (accion) {
      case 'mece': {
        // Se le va el cuerpo para un lado, casi se cae del marco, y vuelve.
        const k = loma(u, 0, 1, 2, DURA.mece);
        m.mece += lado * 12 * k;
        m.cabeza += lado * 14 * k;
        m.brazos = [m.brazos[0] - lado * 14 * k, m.brazos[1] - lado * 14 * k];
        break;
      }
      case 'hipo': {
        const h = tramo(u, 0.1, 1.3);
        m.rebota = 5 * loma(u, 0.08, 0.14, 0.2, 0.34);
        m.parpado = mezcla(m.parpado, 0, loma(u, 0.08, 0.14, 0.4, 0.7));
        m.hipo = h > 0 && h < 1 ? h : 0;
        break;
      }
      case 'soda': {
        // Levanta el sifón y aprieta: la soda para arriba, y la cara para el otro lado.
        const k = loma(u, 0, 0.5, 1.8, DURA.soda);
        m.brazos = [m.brazos[0], mezcla(m.brazos[1], SORBO, k)];
        m.chorro = loma(u, 0.5, 0.65, 1.5, 1.8);
        m.cabeza -= 10 * k;
        m.parpado = mezcla(m.parpado, 0.9, k);
        break;
      }
      case 'dormita': {
        // Se le cierran los ojos, se le cae la cabeza, y se despierta de golpe.
        const k = loma(u, 0, 1.4, 2.2, 2.3);
        m.parpado = mezcla(m.parpado, 1, k);
        m.cabeza += 26 * k;
        m.mece -= 4 * k;
        m.rebota = 4 * loma(u, 2.2, 2.3, 2.4, 2.7);
        break;
      }
      case 'saluda': {
        // Saluda con la mano suelta, para el lado del agua, a nadie.
        const k = loma(u, 0, 0.4, 1.7, DURA.saluda);
        m.brazos = [mezcla(m.brazos[0], -70, k) + 18 * k * Math.sin(u * 10), m.brazos[1]];
        m.cabeza -= 6 * k;
        break;
      }
      case 'muerde': {
        const T = MUERDE_T;
        // Abre grande, con los ojos bien abiertos, y muerde de golpe.
        const abre = rampa(u, T.abre[0], T.abre[1]);
        m.parpado = mezcla(m.parpado, 0, abre);
        m.boca = u < T.cierra ? abre : loma(u, T.cierra + 0.1, T.cierra + 0.3, 2.9, 3.3);
        m.cabeza = mezcla(m.cabeza, -14, loma(u, 0, 0.3, 0.4, 0.5)) + 10 * loma(u, 0.38, 0.45, 0.6, 0.8);
        // El vidrio se va en migas, y al final ya tiene otro.
        m.vidrio = u < T.cierra ? 1 : rampa(u, T.vidrio[0], T.vidrio[1]);
        m.migas = u >= T.migas[0] && u <= T.migas[1] ? tramo(u, T.migas[0], T.migas[1]) : 0;
        m.nam = loma(u, T.nam[0], T.nam[1], T.nam[2], T.nam[3]);
        // Cabalga en el marco, revoleando el sifón con el chorro.
        const c = loma(u, T.cabalga[0], T.cabalga[0] + 0.3, T.cabalga[1] - 0.4, T.cabalga[1]);
        m.rebota = 8 * c * Math.abs(Math.sin(u * 9));
        m.mece += 8 * c * Math.sin(u * 4.5);
        m.cabeza += 10 * c * Math.sin(u * 4.5 + 0.6);
        m.brazos = [mezcla(m.brazos[0], NAM.brazos[0], c) + 10 * c * Math.sin(u * 9), mezcla(m.brazos[1], NAM.brazos[1], c) + 40 * c * Math.sin(u * 9)];
        m.chorro = c;
        m.colorado = mezcla(m.colorado, 1, loma(u, 0.4, 0.8, 3.4, 4.4));
        // Se calma, y le agarra el hipo.
        const h = tramo(u, T.hipo[0], T.hipo[1]);
        m.hipo = h > 0 && h < 1 ? h : 0;
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
      aplicar(namQuieto ? NAM : QUIETO);
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

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté mordiendo. */
  const tocado = (t: number): void => {
    if (accion !== 'muerde') empezar('muerde', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      namQuieto = !namQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la ventana, y la página abre la ficha. */
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

export const armarAmorcito: Armar = (marcos, esc) => armarAmorcitoCon(marcos, esc);
