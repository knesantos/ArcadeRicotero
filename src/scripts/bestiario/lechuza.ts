/**
 * La lechuza que circula (`D-73`, vigesimotercera vuelta), parada en una rama seca del árbol del gran bonete.
 *
 * Lo que hace sola es vigilar, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Gira la cabeza de más**: para un lado, pasa por la nuca y se asoma por el otro, y vuelve.
 * - **Se esponja**: se infla de plumas, tirita y se asienta.
 * - **Entorna un ojo solo**, ladeada, y el otro lo abre de par en par. No le cree a nadie.
 * - **Sigue con la mirada** algo que pasa abajo, de un costado al otro.
 * - **Cabecea** como las lechuzas, midiendo la distancia.
 * - **Respira**, y pestañea poco: cada tanto, despacio.
 *
 * Tocada, **circula** (*"con la lechuza que circula, ya no se puede más"*): da toda la vuelta con la cabeza
 * hasta mirarte, sopla el pito tres veces, despega con las alas abiertas, da una vuelta grande al árbol (por
 * arriba de la copa, lejos, y por delante del tronco, cerca) sin dejar de mirarte, vuelve a la rama, entorna
 * un ojo y se queda. El boleto pinchado aletea con el viento. Dice su verso. Con movimiento reducido no se
 * mueve nada: tocarla la pasa de la rama a las alas abiertas con el pito sonando.
 *
 * Se lleva números (`rig-lechuza.ts`) y nada que dibuje.
 */

import { CIRCULA, LECHUZA, QUIETO, VERSO, VUELTA, enLaVuelta, lejania, marcas, type Momento } from '../../lib/bestiario/rig-lechuza.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-lechuza-que-circula';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { gira: 3.4, esponja: 2.4, entorna: 2.8, sigue: 3.2, cabecea: 2.2, circula: 8 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.4, 3.6] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos: poco, que es una lechuza. */
export const PESTANEA = [4.5, 8.5] as const;
const PESTANEO = 0.42;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { mira: [0, 0.9], pita: [0.95, 1.9], despega: [1.9, 2.35], vuela: [2.3, 6.2], posa: [6.2, 6.7], fija: [6.7, 8] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Dónde va la vuelta en un instante del vuelo: corre más ligero en el medio que al despegar y al llegar. */
function vueltaEn(u: number): number {
  const v = entreT(u, TOQUE_T.vuela);
  return 0.45 * v + 0.55 * suave(v);
}

/**
 * El toque, sobre la pose de base de ese cuadro (quieta, con la respiración y el pestañeo): lo que hace a
 * los `u` segundos de que la tocaron.
 */
export function momentoDelToque(base: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...base, parpados: [...base.parpados], cabeceo: [...base.cabeceo], vuelo: [...base.vuelo], boleto: [...base.boleto] };
  // Da toda la vuelta con la cabeza, de más, hasta mirarte; los ojos se le abren de par en par.
  m.giro = 360 * suave(entreT(u, T.mira));
  const abre = rampa(u, 0.2, 0.7) * (1 - rampa(u, 7.6, 8));
  const guino = 0.8 * loma(u, 6.95, 7.2, 7.4, 7.7);
  m.parpados = [mezclar(base.parpados[0], 0, abre), Math.max(mezclar(base.parpados[1], 0, abre), guino)];
  m.ladea = mezclar(base.ladea, 0, rampa(u, 0, 0.6) * (1 - rampa(u, 7.4, 8)));
  m.esponja = 0.4 * loma(u, 0.1, 0.6, 6.3, 7);
  // Tres pitazos: el cachete se infla, el pito tiembla y salta el pitido.
  const pitazo = [0.95, 1.3, 1.62].reduce((s, a) => Math.max(s, loma(u, a, a + 0.06, a + 0.2, a + 0.28)), 0);
  m.pitido = pitazo;
  m.cachetes = pitazo;
  m.pito = pitazo * 4 * Math.sin(u * 70);
  // Se agacha, abre las alas y salta.
  m.agacha = 0.9 * loma(u, T.despega[0], T.despega[0] + 0.15, T.despega[1] - 0.1, T.despega[1]) + 0.7 * loma(u, T.posa[0], T.posa[0] + 0.1, T.posa[0] + 0.25, T.posa[1]);
  const abiertas = rampa(u, 2, 2.3) * (1 - rampa(u, 6.25, 6.6));
  m.abiertas = abiertas;
  m.alas = 14 * loma(u, 1.95, 2.1, 6.4, 6.7);
  // La vuelta: por el camino del rig, achicándose arriba de la copa y agrandándose delante del tronco.
  if (u > T.vuela[0] && u < T.vuela[1]) {
    const w = vueltaEn(u);
    const [x, y] = enLaVuelta(w);
    const [x2] = enLaVuelta(Math.min(1, w + 0.01));
    const [x0] = enLaVuelta(Math.max(0, w - 0.01));
    m.vuelo = [(x - VUELTA[0]![0]) / LECHUZA.escala, (y - VUELTA[0]![1]) / LECHUZA.escala];
    m.lejos = lejania(y);
    m.ladeo = Math.max(-24, Math.min(24, (x2 - x0) * 0.7)) * loma(u, T.vuela[0], T.vuela[0] + 0.3, T.vuela[1] - 0.3, T.vuela[1]);
    m.patas = loma(u, T.vuela[0], T.vuela[0] + 0.25, T.vuela[1] - 0.2, T.vuela[1]);
    m.cola = 10 * Math.sin(u * 3);
  }
  // El aleteo: fuerte al despegar y al subir, planea arriba de la copa, frena al llegar.
  const planea = 1 - 0.7 * loma(vueltaEn(u), 0.15, 0.25, 0.4, 0.5);
  m.aleteo = abiertas * (-26 * loma(u, 2, 2.15, 2.25, 2.4) + 30 * planea * Math.sin((u - 2.3) * Math.PI * 2 * 2.3) * loma(u, 2.3, 2.5, 6, 6.2) - 34 * loma(u, 6, 6.15, 6.3, 6.5));
  // El boleto pinchado aletea con el viento del despegue y de la llegada.
  const viento = loma(u, 2, 2.2, 2.7, 3.3) + loma(u, 6, 6.2, 6.6, 7.1);
  m.boleto = [2 * viento * Math.abs(Math.sin(u * 13)), 16 * viento * Math.sin(u * 19)];
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la lechuza con un azar que se puede fijar (el test lo fija). La isla usa `armarLechuza`. */
export function armarLechuzaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--lechuza')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { gira: 0, esponja: 0, entorna: 0, sigue: 0, cabecea: 0, circula: 0 };
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
  let circulaQuieta = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = (['gira', 'esponja', 'entorna', 'sigue', 'cabecea'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'circula' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO, parpados: [...QUIETO.parpados], cabeceo: [...QUIETO.cabeceo], vuelo: [...QUIETO.vuelo], boleto: [...QUIETO.boleto] };
    // Quieta: respira, la cabeza se le ladea apenas y la cola le late.
    m.respira = Math.sin(t * 1.4);
    m.ladea = QUIETO.ladea + 1.6 * Math.sin(t * 0.37);
    m.cola = 2 * Math.sin(t * 0.8);
    // El pestañeo: despacio, los dos párpados hasta abajo.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      m.parpados = [mezclar(m.parpados[0], 1, k), mezclar(m.parpados[1], 1, k)];
    }
    const u = t - desde;
    switch (accion) {
      case 'gira': {
        // Para un lado, de más: pasa por la nuca y se asoma por el otro costado. Y vuelve por donde fue.
        m.giro = lado * 290 * loma(u, 0.2, 1.3, 2.2, 3.2);
        break;
      }
      case 'esponja': {
        const k = loma(u, 0, 0.5, 1.5, DURA.esponja);
        const tirita = loma(u, 0.7, 0.8, 1.3, 1.5);
        m.esponja = k;
        m.alas = 8 * k + 3 * tirita * Math.sin(u * 48);
        m.ladea += 4 * tirita * Math.sin(u * 44);
        m.parpados = [Math.max(m.parpados[0], 0.5 * k), Math.max(m.parpados[1], 0.5 * k)];
        break;
      }
      case 'entorna': {
        // Un ojo se le cierra a medias, el otro se abre del todo: ladeada, no le cree a nadie.
        const k = loma(u, 0.2, 0.8, 2, DURA.entorna);
        const [cierra, abre] = lado < 0 ? [0, 1] : [1, 0];
        const ojos: [number, number] = [m.parpados[0], m.parpados[1]];
        ojos[cierra] = mezclar(ojos[cierra], 0.72, k);
        ojos[abre] = mezclar(ojos[abre], 0, k);
        m.parpados = ojos;
        m.ladea += lado * 10 * k;
        m.cabeceo = [lado * 3 * k, 2 * k];
        break;
      }
      case 'sigue': {
        // Algo pasa abajo, de un costado al otro, y la cabeza lo sigue.
        const k = loma(u, 0, 0.35, 2.8, DURA.sigue);
        const va = suave(entreT(u, [0.4, 2.7]));
        m.giro = lado * (-64 + 128 * va) * k;
        m.cabeceo = [0, (3 - 3 * Math.cos(va * Math.PI * 4)) * k];
        m.ladea -= 6 * k;
        break;
      }
      case 'cabecea': {
        // El cabeceo de lechuza: la cabeza dibuja un ocho para medir la distancia.
        const k = loma(u, 0, 0.3, 1.8, DURA.cabecea);
        const a = u * Math.PI * 2 * 1.4;
        m.cabeceo = [9 * k * Math.sin(a), -4 * k * Math.sin(a * 2)];
        m.ladea += 12 * k * Math.sin(a);
        break;
      }
      case 'circula':
        return momentoDelToque(m, u);
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
      aplicar(circulaQuieta ? CIRCULA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté circulando. */
  const tocado = (t: number): void => {
    if (accion !== 'circula') empezar('circula', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      circulaQuieta = !circulaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la cabeza, y la página abre la ficha. */
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

export const armarLechuza: Armar = (marcos, esc) => armarLechuzaCon(marcos, esc);
