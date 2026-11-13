/**
 * El polizón del remolque (`D-73`, vigesimoséptima vuelta), abajo de su bote dado vuelta, a oscuras.
 *
 * Todos lo dan por muerto, y lo que hace solo es cuidar que sigan. Nada es un bucle: elige qué se anima a hacer
 * cada vez.
 *
 * - **Espía**: levanta el bote una rendija, por la proa, y se le ven los ojos, y nada más: a oscuras es una sombra.
 *   Mira para los dos lados y lo baja.
 * - **Saca el café**: por abajo de la proa empuja un pocillo, que se le enfrió; lo deja un rato afuera y se lo lleva.
 * - **Sala el agua**: por la popa saca un salero y lo sacude (*"salando las heridas"*).
 * - **Prende un fósforo**: la rendija se alumbra de naranja, tiembla, y lo sopla. Sin luz.
 * - **Golpea** la tablazón desde adentro, tres veces, a ver si hay alguien. La corona salta.
 * - El bote se mece en el agua, y la corona, que está apoyada nomás, se mece atrás de él.
 *
 * Tocado, **lo destapan**: el bote pega un sacudón y se levanta entero por la proa; la corona se va cayendo de
 * costado, más tarde que el bote. Él queda a la vista, encandilado, maquillado, con la curita arriba del lunar, y
 * resplandece. Mira, y pide silencio con el dedo en la boca: que lo sigan dando por muerto. Baja el bote despacio
 * y lo suelta al final, que cae y abre ondas en el agua; y desde abajo, de un golpe, endereza la corona. Dice su
 * verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de tapado a destapado.
 *
 * Se lleva números (`rig-polizon.ts`) y nada que dibuje.
 */

import { ASOMA, QUIETO, RENDIJA, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-polizon.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-polizon-del-remolque';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { espia: 3.6, cafe: 4.4, sal: 3.4, fosforo: 3.2, golpea: 2.4, asoma: 9 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['espia', 'cafe', 'sal', 'fosforo', 'golpea'] as const;

export const PAUSA = [1.6, 4.2] as const;
export const PRIMERA = [0.8, 2.2] as const;
export const DEMORA_FICHA = 1.6;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { golpe: [0, 0.4], abre: [0.4, 1.6], resplandece: [1.2, 2.2], chist: [2.6, 5], baja: [5.2, 6.4], cae: [6.4, 6.56], ondas: [6.56, 7.8], acomoda: [7.5, 8.3] } as const;
/** Cuánto del bote baja despacio, sosteniéndolo, antes de soltarlo. */
export const SOSTIENE = 0.82;
/** Cuántas veces golpea. */
export const GOLPES = 3;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, mece: [...b.mece], pupila: [...b.pupila] });
/** Un sacudón seco: salta y se apaga. `u` desde el golpe. */
const sacudon = (u: number, fuerza: number, dura = 0.35): number => (u < 0 || u > dura ? 0 : fuerza * Math.sin(u * 60) * (1 - u / dura));

/** La pose de base de un instante: el bote se mece, y la corona atrás de él. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    mece: [1.4 * Math.sin(t * 1.1), 0.7 * Math.sin(t * 0.8)],
    // Lo que está apoyado llega después: la misma onda del bote, un rato más tarde, y para el otro lado.
    corona: -1.6 * Math.sin(t * 0.8 - 1),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'espia': {
      const k = loma(u, 0, 0.8, 2.8, 3.1);
      m.abre = RENDIJA * k;
      m.pupila = [3 * Math.sin((u - 0.9) * 2.4) * loma(u, 0.9, 1.1, 2.6, 2.8), 0.6];
      m.parpado = u > 1.7 && u < 1.9 ? Math.sin(((u - 1.7) / 0.2) * Math.PI) : 0;
      break;
    }
    case 'cafe': {
      // Lo empuja para afuera, lo deja, y cuando ve que nadie lo toma se lo lleva.
      m.cafe = loma(u, 0.2, 1.1, 3.2, 4.1);
      m.mece = [m.mece[0] + 1.2 * loma(u, 0, 0.3, 0.9, 1.2), m.mece[1]];
      break;
    }
    case 'sal': {
      const k = loma(u, 0.1, 0.8, 2.6, 3.2);
      m.salero = k;
      m.sacude = 16 * loma(u, 0.9, 1, 2.3, 2.5) * Math.sin(u * 22);
      break;
    }
    case 'fosforo': {
      // La rendija, la llama que agarra de a poco y tiembla, y el soplido.
      const k = loma(u, 0, 0.6, 2.7, 3);
      m.abre = RENDIJA * 0.8 * k;
      m.fosforo = rampa(u, 0.8, 1.1) * (0.8 + 0.2 * Math.sin(u * 31) * Math.sin(u * 7)) * (u < 2.3 ? 1 : 0);
      // El fósforo le alumbra la cara a medias; apagado, vuelve a ser una sombra con dos ojos.
      m.luz = 0.7 * m.fosforo;
      m.pupila = [2.4, 1.4];
      m.parpado = 0.35 * m.fosforo;
      break;
    }
    case 'golpea': {
      // Toc, toc, toc. La corona, que está apoyada, salta después de cada golpe.
      for (let i = 0; i < GOLPES; i++) {
        const g = u - (0.3 + i * 0.5);
        m.tiembla += sacudon(g, 1.6, 0.25);
        m.mece = [m.mece[0] + (g > 0 && g < 0.2 ? 2.4 * Math.sin((g / 0.2) * Math.PI) : 0), m.mece[1]];
        m.corona += sacudon(g - 0.08, 5, 0.4);
      }
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El sacudón, y el bote que se levanta por la proa. Lo baja despacio, sosteniéndolo, y al final lo suelta.
  const sostenido = 1 - SOSTIENE * rampa(u, T.baja[0], T.baja[1]);
  const suelto = Math.min(1, Math.max(0, (u - T.cae[0]) / (T.cae[1] - T.cae[0])));
  m.abre = rampa(u, T.abre[0], T.abre[1]) * sostenido * (1 - suelto * suelto);
  m.tiembla = sacudon(u - T.golpe[0], 2.4) + sacudon(u - T.cae[1], 2.2) + sacudon(u - T.acomoda[0], 1.8, 0.25);
  const abierto = loma(u, T.abre[0], T.abre[1], T.baja[1] - 0.2, T.cae[1]);
  m.mece = [m.mece[0] * (1 - abierto), m.mece[1] * (1 - abierto)];
  // La corona se va cayendo de costado, más tarde que el bote; con la caída salta, y él la endereza de un golpe.
  const torcida = rampa(u, T.abre[0] + 0.5, T.abre[1] + 0.7) * (1 - rampa(u, T.acomoda[0] + 0.05, T.acomoda[1]));
  m.corona = mezclar(m.corona, ASOMA.corona, torcida) + sacudon(u - T.cae[1] - 0.06, 8, 0.6);
  // La luz le llega cuando el bote ya está bien arriba, y se le va apenas empieza a bajar: de la rendija para abajo
  // es otra vez una sombra con dos ojos, y el casco le pasa por delante.
  m.luz = loma(u, T.abre[0] + 0.5, T.abre[1], T.baja[0], T.baja[0] + 0.6);
  // Encandilado: entorna los ojos, se acostumbra, mira. Y pestañea una vez, con el dedo en la boca.
  const encandila = loma(u, T.abre[0], T.abre[0] + 0.4, T.resplandece[0] + 0.3, T.resplandece[1]);
  const pestaneo = u > 3.7 && u < 3.92 ? Math.sin(((u - 3.7) / 0.22) * Math.PI) : 0;
  m.parpado = Math.max(0.7 * encandila, pestaneo);
  const mira = rampa(u, T.resplandece[0], T.resplandece[1]);
  m.pupila = [ASOMA.pupila[0] * mira, ASOMA.pupila[1] * mira];
  // Resplandece: prende de a poco, late, y se apaga antes de que el bote baje.
  m.resplandor = loma(u, T.resplandece[0], T.resplandece[1], T.chist[1], T.baja[0] + 0.5) * (0.86 + 0.14 * Math.sin(u * 4.6));
  // Pide silencio.
  m.chist = loma(u, T.chist[0], T.chist[0] + 0.5, T.chist[1] - 0.4, T.chist[1]);
  // El bote cae y abre ondas en el agua.
  m.ondas = u > T.ondas[0] && u < T.ondas[1] ? (u - T.ondas[0]) / (T.ondas[1] - T.ondas[0]) : 0;
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al polizón con un azar que se puede fijar (el test lo fija). La isla usa `armarPolizon`. */
export function armarPolizonCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--polizon')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { espia: 0, cafe: 0, sal: 0, fosforo: 0, golpea: 0, asoma: 0 };
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
  let asomaQuieto = false;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'asoma' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const u = t - desde;
    if (accion === 'asoma') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u);
    return b;
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
      aplicar(asomaQuieto ? ASOMA : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya lo hayan destapado. */
  const tocado = (t: number): void => {
    if (accion !== 'asoma') empezar('asoma', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      asomaQuieto = !asomaQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la quilla, y la página abre la ficha. */
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

export const armarPolizon: Armar = (marcos, esc) => armarPolizonCon(marcos, esc);
