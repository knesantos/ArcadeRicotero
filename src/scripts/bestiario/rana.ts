/**
 * La rana rubia (`D-73`, vigesimoséptima vuelta), tomando sol en su reposera, arriba de un container.
 *
 * Lo que hace sola es no hacer nada, con ganas. Nada es un bucle: elige qué no hace cada vez.
 *
 * - **Le tira un lengüetazo a la mosca** sin levantarse, y le erra: la mosca la esquiva a último momento.
 * - **Mueve el pie** de la pierna cruzada, al compás de algo que solo escucha ella.
 * - **Acomoda el reflector**: lo inclina buscando el farol de la grúa, y lo deja donde estaba.
 * - **Lo mira de reojo** al pibe, que es el que la alquiló: se levanta apenas los anteojos, mira para el lado de
 *   él, y los deja caer.
 * - **Croa bajito**: dos bocanadas cortas del buche, sin abrir los ojos.
 * - **Se le corre la peluca** y la vuelve a su lugar de un cabezazo.
 * - **Respira** lento, la etiqueta del alquiler se hamaca con el viento, y la mosca le da vueltas.
 *
 * Tocada, **croa en serio**: del sobresalto le salta la peluca, se levanta los anteojos, mira, y croa tres veces
 * con el buche a pleno, que la levanta de la reposera como un globo; se desinfla y cae. Y sin mirar, de un
 * lengüetazo, se come la mosca. Se baja los anteojos. Al rato llega otra mosca. Dice su verso. Con movimiento
 * reducido no se mueve nada: tocarla la pasa de recostada a croando.
 *
 * Se lleva números (`rig-rana.ts`) y nada que dibuje.
 */

import { CROA, QUIETO, RANA_ARMADO, VERSO, marcas, puntaDeLaLengua, type Momento } from '../../lib/bestiario/rig-rana.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-rana-rubia';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { lengua: 2.4, pie: 2.6, reflector: 3, reojo: 3.2, croaquito: 2, peluca: 2.8, croa: 9 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['lengua', 'pie', 'reflector', 'reojo', 'croaquito', 'peluca'] as const;

export const PAUSA = [1.4, 3.6] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.4;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { salto: [0, 0.72], anteojos: [0.4, 1.1], croa: [1.4, 4.4], cae: [4.4, 4.9], lengua: [5.4, 6.1], baja: [6.3, 7.1], otra: [7.8, 8.8] } as const;
/** Lo que le salta la peluca del sobresalto, en sus unidades. */
export const SALTA = 30;
/** Cuántas veces croa. */
export const CROADAS = 3;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, pupila: [...b.pupila], peluca: [...b.peluca], mosca: [...b.mosca] });
/** El aliento: se llena despacio y se vacía más rápido (−1 a 1). */
export const aliento = (t: number, periodo: number): number => {
  const p = (((t % periodo) + periodo) % periodo) / periodo;
  return p < 0.62 ? -Math.cos((Math.PI * p) / 0.62) : Math.cos((Math.PI * (p - 0.62)) / 0.38);
};

const [RX, RY] = RANA_ARMADO.mosca.radio;
const [CX, CY] = RANA_ARMADO.mosca.centro;
/** Dónde está la punta de la lengua estirada, medida desde el centro de la vuelta de la mosca. */
const PUNTA: readonly [number, number] = [puntaDeLaLengua()[0] - CX, puntaDeLaLengua()[1] - CY];

/** Por dónde anda la mosca sola: una vuelta chata, con el temblor del vuelo. */
export const vuelo = (t: number): [number, number] => [RX * Math.cos(t * 2.1) + 3 * Math.sin(t * 9.3), RY * Math.sin(t * 3.3) + 2 * Math.sin(t * 13.1)];

/** La pose de base de un instante: recostada, respira lento, el pie cuelga y la etiqueta se hamaca. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    respira: aliento(t, 3.8),
    pie: 5 * Math.sin(t * 0.9),
    brazo: 1.5 * Math.sin(t * 0.5),
    etiqueta: 7 * Math.sin(t * 1.3) + 3 * Math.sin(t * 2.9),
    mosca: vuelo(t),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'lengua': {
      // La mosca se le arrima; dispara, y la mosca la esquiva para arriba. Ni se inmuta.
      const cerca = loma(u, 0, 0.9, 1.5, 2.2);
      const esquiva = loma(u, 0.95, 1.05, 1.5, 2);
      m.mosca = [mezclar(m.mosca[0], PUNTA[0], cerca), mezclar(m.mosca[1], PUNTA[1], cerca) - 22 * esquiva];
      m.lengua = loma(u, 1, 1.1, 1.14, 1.5);
      m.cabeza = -4 * loma(u, 0.9, 1, 1.2, 1.6);
      break;
    }
    case 'pie': {
      const k = loma(u, 0, 0.3, 2.1, DURA.pie);
      m.pie = mezclar(m.pie, 16 * Math.sin(u * 11), k);
      break;
    }
    case 'reflector': {
      const k = loma(u, 0, 0.8, 2, DURA.reflector);
      m.brazo = mezclar(m.brazo, -16 + 4 * Math.sin(u * 5), k);
      m.cabeza = -5 * k;
      break;
    }
    case 'reojo': {
      // El que la alquiló está ahí al lado. Lo mira por arriba de los anteojos, y nada más.
      const k = loma(u, 0, 0.6, 2.3, 2.5);
      m.anteojos = 0.45 * k;
      m.pupila = [-3.6 * k, 1.6 * k];
      m.parpado = mezclar(m.parpado, 0.4, k);
      break;
    }
    case 'croaquito': {
      m.buche = 0.3 * Math.max(0, Math.sin(u * Math.PI * 2)) * (u < 1 ? 1 : 0) + 0.3 * Math.max(0, Math.sin((u - 0.1) * Math.PI * 2)) * (u > 1.1 ? 1 : 0) * (1 - rampa(u, 1.5, 1.6));
      m.parpado = mezclar(m.parpado, 0.9, loma(u, 0, 0.2, 1.6, DURA.croaquito));
      break;
    }
    case 'peluca': {
      // Se le va para atrás de a poco, y la acomoda de un cabezazo.
      const corre = rampa(u, 0, 1.6) * (1 - rampa(u, 1.9, 2.1));
const cabezazo = loma(u, 1.7, 1.9, 2, 2.3);
      m.cabeza = -14 * cabezazo;
      m.peluca = [-9 * corre, 5 * corre - 6 * loma(u, 1.9, 2, 2.1, 2.4), -14 * corre];
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que la tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El sobresalto: le salta la peluca, que cae torcida, y patea.
  // La peluca salta alto y gira en el aire, y tarda en caer: tiene que verse despegada de la cabeza.
  const salto = loma(u, T.salto[0], 0.14, 0.34, T.salto[1]);
  const torcida = loma(u, 0.1, T.salto[1], T.baja[0], T.baja[1]);
  m.peluca = [CROA.peluca[0] * torcida - 6 * salto, -SALTA * salto + CROA.peluca[1] * torcida * 0.3, CROA.peluca[2] * torcida - 26 * salto];
  m.pie = mezclar(m.pie, -30, salto);
  // Se levanta los anteojos y mira.
  const mira = loma(u, T.anteojos[0], T.anteojos[1], T.baja[0], T.baja[1]);
  m.anteojos = mira;
  m.parpado = mezclar(m.parpado, CROA.parpado, mira);
  m.pupila = [CROA.pupila[0] * mira, CROA.pupila[1] * mira];
  // Croa tres veces: el buche se llena despacio y se vacía de golpe, y la levanta de la reposera.
  const largo = (T.croa[1] - T.croa[0]) / CROADAS;
  const fase = u >= T.croa[0] && u < T.croa[1] ? ((u - T.croa[0]) % largo) / largo : 0;
  const lleno = fase < 0.7 ? suave(fase / 0.7) : 1 - suave((fase - 0.7) / 0.3) * 0.75;
  const croando = loma(u, T.croa[0], T.croa[0] + 0.05, T.croa[1] - 0.2, T.croa[1]);
  m.buche = croando * (fase ? lleno : 0.25);
  // Flota con el buche, pero tarda en subir: llega después. Y cae de golpe.
  m.flota = rampa(u, T.croa[0] + 0.3, T.croa[0] + 1.1) * (0.82 + 0.18 * lleno) * (1 - rampa(u, T.cae[0], T.cae[1]));
  m.cabeza = mezclar(m.cabeza, CROA.cabeza, croando) + 4 * loma(u, T.cae[1], T.cae[1] + 0.08, T.cae[1] + 0.15, T.cae[1] + 0.4);
  m.brazo = mezclar(m.brazo, CROA.brazo, loma(u, T.croa[0], T.croa[0] + 0.8, T.cae[0], T.cae[1] + 0.3));
  // Lo que cuelga llega después que el cuerpo: la etiqueta se sacude cuando sube y cuando cae.
  m.etiqueta += 26 * loma(u, T.croa[0] + 0.5, T.croa[0] + 1, T.croa[0] + 1.2, T.croa[0] + 2) * Math.sin(u * 9) + 30 * loma(u, T.cae[1], T.cae[1] + 0.1, T.cae[1] + 0.3, T.cae[1] + 1.2) * Math.sin(u * 12);
  m.pie = mezclar(m.pie, CROA.pie, m.flota);
  // Sin mirar, se come la mosca: la mosca se arrima, la lengua sale, y vuelve con ella.
  const [l0, l1] = T.lengua;
  const cerca = rampa(u, l0 - 1, l0);
  const sale = loma(u, l0, l0 + 0.1, l0 + 0.14, l1 - 0.1);
  const pegada = u >= l0 + 0.1;
  const vuelve = rampa(u, l0 + 0.14, l1 - 0.1);
  m.lengua = sale;
  m.mosca = pegada && u < T.otra[0]
    ? [mezclar(PUNTA[0], RANA_ARMADO.boca[0] - CX, vuelve), mezclar(PUNTA[1], RANA_ARMADO.boca[1] - CY, vuelve)]
    : u < T.otra[0]
      ? [mezclar(m.mosca[0], PUNTA[0], cerca), mezclar(m.mosca[1], PUNTA[1], cerca)]
      : [m.mosca[0] + 90 * (1 - rampa(u, T.otra[0], T.otra[1])), m.mosca[1] - 30 * (1 - rampa(u, T.otra[0], T.otra[1]))];
  m.moscaSe = u < T.otra[0] ? 1 - rampa(u, l1 - 0.2, l1 - 0.1) : rampa(u, T.otra[0], T.otra[0] + 0.3);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la rana con un azar que se puede fijar (el test lo fija). La isla usa `armarRana`. */
export function armarRanaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--rana')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { lengua: 0, pie: 0, reflector: 0, reojo: 0, croaquito: 0, peluca: 0, croa: 0 };
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
  let croaQuieta = false;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'croa' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const u = t - desde;
    if (accion === 'croa') return momentoDelToque(b, u);
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
      aplicar(croaQuieta ? CROA : QUIETO);
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

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté croando. */
  const tocado = (t: number): void => {
    if (accion !== 'croa') empezar('croa', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      croaQuieta = !croaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la peluca, y la página abre la ficha. */
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

export const armarRana: Armar = (marcos, esc) => armarRanaCon(marcos, esc);
