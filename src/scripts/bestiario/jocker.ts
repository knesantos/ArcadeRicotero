/**
 * El jocker burlón (`D-73`, vigesimocuarta vuelta), colgado de un brazo de la rama baja del árbol del gran
 * bonete.
 *
 * Lo que hace solo es burlarse, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Se hamaca** del brazo, con las piernas que se atrasan y las puntas del bonete que van a destiempo.
 * - **Abanica los naipes**: sube el mazo, lo abre, mira sus cuatro ases con un ojo entornado, lo mezcla y
 *   lo cierra.
 * - **Hace sonar los cascabeles**: sacude la cabeza y suenan las tres puntas.
 * - **Se ríe del de abajo**: lo señala con el mazo, se le abre la boca con la lengua afuera, patalea.
 * - **Saca un naipe de la oreja**: el as de picas. Lo muestra, y lo hace desaparecer.
 * - **Respira**, pestañea, y los ojos se le van para cualquier lado.
 *
 * Tocado, **es el comodín** (*"soy un jocker burlón de la «Estrella del Sur»"*): te mira, da el molinete
 * entero alrededor de la rama, y se da vuelta como un naipe: un rato es el dorso de la Estrella del Sur,
 * después el as de picas, y vuelve a ser él, muerto de risa, con el abanico abierto y la estrella
 * brillando, y te guiña. Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de la
 * sonrisa de costado a la carcajada.
 *
 * Se lleva números (`rig-jocker.ts`) y nada que dibuje.
 */

import { BURLON, JOCKER_ARMADO, QUIETO, VERSO, alJocker, alcanza, marcas, type Momento, type Punto } from '../../lib/bestiario/rig-jocker.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-jocker-burlon';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { hamaca: 3.6, abanica: 3, cascabelea: 2.4, burla: 3.2, oreja: 3.4, comodin: 7.6 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.6, 5.4] as const;
const PESTANEO = 0.18;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = {
  mira: [0, 0.6],
  molinete: [0.6, 2.4],
  rebote: [2.4, 2.9],
  dorso: [2.9, 3.4],
  as: [4.2, 4.6],
  vuelve: [5.3, 5.7],
  burla: [5.7, 7],
  guino: [7, 7.6],
} as const;

/** Adónde señala cuando se ríe del de abajo: el ángel de la soledad, al pie del árbol (en el recinto). */
export const DE_ABAJO: Punto = [372, 450];

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Lleva el brazo libre hacia un punto (en las del jocker), en la medida `k`. */
function alcanzar(m: Momento, punto: Punto, k: number): void {
  const { brazo, antebrazo } = alcanza(punto);
  m.brazo = mezclar(m.brazo, brazo, k);
  m.antebrazo = mezclar(m.antebrazo, antebrazo, k);
}

const copia = (b: Momento): Momento => ({
  ...b,
  mira: [...b.mira],
  parpados: [...b.parpados],
  puntas: [...b.puntas],
  muslos: [...b.muslos],
  canillas: [...b.canillas],
});

/** Una acción sola, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de empezarla. */
export function momentoDeAccion(accion: Exclude<Accion, 'comodin'>, u: number, base: Momento, lado: 1 | -1): Momento {
  const m = copia(base);
  const puntas = [...m.puntas] as [number, number, number];
  const muslos = [...m.muslos] as [number, number];
  const canillas = [...m.canillas] as [number, number];
  switch (accion) {
    case 'hamaca': {
      // Se hamaca del brazo: las piernas y las puntas se atrasan, y los cascabeles suenan en cada punta del viaje.
      const k = loma(u, 0, 0.6, DURA.hamaca - 0.7, DURA.hamaca);
      const a = u * Math.PI * 2 / 1.7;
      m.hamaca = lado * 15 * k * Math.sin(a);
      const atras = lado * 15 * k * Math.cos(a);
      muslos[0] += -atras * 0.9;
      muslos[1] += -atras * 0.7;
      canillas[0] += -atras * 1.1;
      canillas[1] += -atras * 0.8;
      for (const i of [0, 1, 2] as const) puntas[i] += -atras * (1 + i * 0.3);
      m.cabeza += -m.hamaca * 0.4;
      m.tilin = k * Math.max(0, Math.abs(Math.sin(a)) - 0.75) * 4;
      m.mira = [-lado * 0.6 * Math.cos(a) * k, m.mira[1]];
      break;
    }
    case 'abanica': {
      // Sube el mazo, lo abre en abanico, lo mira con un ojo entornado, lo mezcla y lo cierra.
      const k = loma(u, 0, 0.5, DURA.abanica - 0.5, DURA.abanica);
      alcanzar(m, [-70, 74], k);
      m.mazo = mezclar(m.mazo, -10, k);
      m.abanico = loma(u, 0.5, 0.9, 1.8, 2.1) + loma(u, 2.15, 2.3, 2.4, 2.5) * 0.4;
      m.mazo += 18 * loma(u, 2.0, 2.1, 2.4, 2.5) * Math.sin(u * 40);
      m.mira = [mezclar(m.mira[0], -1, k), mezclar(m.mira[1], 0.6, k)];
      m.parpados = [mezclar(m.parpados[0], 0.5, k), mezclar(m.parpados[1], 0.1, k)];
      m.cabeza += -6 * k;
      break;
    }
    case 'cascabelea': {
      // Sacude la cabeza: las tres puntas a destiempo, y el tilín.
      const k = loma(u, 0, 0.3, DURA.cascabelea - 0.4, DURA.cascabelea);
      m.cabeza += 11 * k * Math.sin(u * 20);
      for (const i of [0, 1, 2] as const) puntas[i] += 22 * k * Math.sin(u * 20 - 1 - i * 0.7);
      m.tilin = k;
      m.parpados = [mezclar(m.parpados[0], 0.75, k), mezclar(m.parpados[1], 0.75, k)];
      m.boca = 0.2 * k;
      m.hamaca += 2 * k * Math.sin(u * 20 - 2);
      break;
    }
    case 'burla': {
      // Se ríe del de abajo: lo señala con el mazo, carcajada con la lengua, patalea y se sacude.
      const k = loma(u, 0, 0.4, DURA.burla - 0.5, DURA.burla);
      alcanzar(m, alJocker(DE_ABAJO), k);
      m.mazo = mezclar(m.mazo, 20, k);
      m.mira = [mezclar(m.mira[0], 0.9, k), mezclar(m.mira[1], 1, k)];
      m.cabeza += 14 * k + 4 * k * Math.sin(u * 26);
      const risa = loma(u, 0.5, 0.7, DURA.burla - 0.7, DURA.burla - 0.3);
      m.boca = risa * (0.75 + 0.25 * Math.sin(u * 26));
      m.parpados = [mezclar(m.parpados[0], 0.6, risa), mezclar(m.parpados[1], 0.6, risa)];
      m.hamaca += 3 * risa * Math.sin(u * 26);
      m.respira = 2 * risa * Math.sin(u * 26);
      canillas[0] += 30 * risa * Math.sin(u * 12);
      canillas[1] += 30 * risa * Math.sin(u * 12 + 2);
      for (const i of [0, 1, 2] as const) puntas[i] += 8 * risa * Math.sin(u * 26 - i);
      m.tilin = risa * 0.8;
      break;
    }
    case 'oreja': {
      // La mano a la oreja, el as de picas que aparece, lo muestra, y se lo esconde con una vuelta del mazo.
      const va = loma(u, 0.2, 0.8, 1.3, 1.8);
      const muestra = loma(u, 1.3, 1.8, 2.7, 3.2);
      const [ox, oy] = JOCKER_ARMADO.oreja;
      alcanzar(m, [ox - 8, oy + 6], va);
      alcanzar(m, [-74, 60], muestra);
      m.mazo = mezclar(m.mazo, 160, va) - 120 * muestra;
      m.oreja = rampa(u, 1.0, 1.2) * (1 - rampa(u, 2.6, 2.7));
      m.cabeza += 8 * va - 4 * muestra;
      m.mira = [mezclar(m.mira[0], -1, va + muestra), mezclar(m.mira[1], -0.2, va) + 0.6 * muestra];
      m.parpados = [mezclar(m.parpados[0], 0, muestra), mezclar(m.parpados[1], 0.7, muestra)];
      m.boca = 0.15 * muestra;
      m.tilin = loma(u, 2.6, 2.65, 2.75, 2.9);
      break;
    }
  }
  m.puntas = puntas;
  m.muslos = muslos;
  m.canillas = canillas;
  return m;
}

/**
 * El toque, sobre la pose de base de ese cuadro (quieta, con la respiración y el pestañeo): lo que hace a
 * los `u` segundos de que lo tocaron.
 */
export function momentoDelToque(base: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(base);
  const puntas = [...m.puntas] as [number, number, number];
  const muslos = [...m.muslos] as [number, number];
  const canillas = [...m.canillas] as [number, number];
  // Te mira, con los ojos abiertos, y se acomoda para tomar envión.
  const atento = rampa(u, 0, 0.3) * (1 - rampa(u, 7.3, 7.6));
  m.mira = [mezclar(m.mira[0], 0, atento), mezclar(m.mira[1], 0, atento)];
  m.parpados = [mezclar(m.parpados[0], 0, atento), mezclar(m.parpados[1], 0, atento)];
  m.cabeza = mezclar(m.cabeza, 0, atento);
  // El molinete: un envión para atrás y la vuelta entera alrededor de la rama, para afuera del árbol.
  const envion = -14 * loma(u, 0.2, 0.5, 0.6, 0.9);
  const vuelta = 360 * suave(entreT(u, T.molinete));
  const rebote = 12 * Math.exp(-(u - T.rebote[0]) * 5) * Math.sin((u - T.rebote[0]) * 14) * (u > T.rebote[0] ? 1 : 0);
  const estira = loma(u, 0.5, 0.8, 2.2, 2.6);
  // Colgado como un naipe, se hamaca apenas.
  const naipe = loma(u, 3.0, 3.3, 5.4, 5.6);
  m.hamaca = envion + (u < T.rebote[0] ? vuelta : 0) + rebote + 4 * naipe * Math.sin((u - 3) * 3);
  muslos[0] = mezclar(muslos[0], 0, estira);
  muslos[1] = mezclar(muslos[1], 0, estira);
  canillas[0] = mezclar(canillas[0], 0, estira);
  canillas[1] = mezclar(canillas[1], 0, estira);
  m.brazo = mezclar(m.brazo, 70, estira);
  m.antebrazo = mezclar(m.antebrazo, -10, estira);
  const giro = entreT(u, T.molinete);
  for (const i of [0, 1, 2] as const) puntas[i] += -40 * estira * Math.sin(giro * Math.PI) - 10 * i * estira * Math.sin(giro * Math.PI);
  m.tilin = Math.max(estira * 0.9, rampa(u, 0, 0.2) * (1 - rampa(u, 0.4, 0.6)));
  // Las tres medias vueltas de naipe: el dorso de la Estrella del Sur, el as de picas, y él otra vez.
  m.vuelta = suave(entreT(u, T.dorso)) + suave(entreT(u, T.as)) + suave(entreT(u, T.vuelve));
  // La burla: la carcajada, el abanico abierto, los cascabeles y la estrella que brilla.
  const burla = loma(u, T.burla[0], T.burla[0] + 0.2, T.burla[1] - 0.2, T.burla[1] + 0.2);
  m.boca = Math.max(burla * (0.8 + 0.2 * Math.sin(u * 24)), 0.2 * rampa(u, 0, 0.3) * (1 - rampa(u, 0.5, 0.7)));
  alcanzar(m, [-74, 66], burla);
  m.mazo = mezclar(m.mazo, 30, burla);
  m.abanico = burla;
  m.cabeza += burla * (8 + 6 * Math.sin(u * 24));
  for (const i of [0, 1, 2] as const) puntas[i] += 16 * burla * Math.sin(u * 24 - i);
  m.tilin = Math.max(m.tilin, burla);
  canillas[0] += 26 * burla * Math.sin(u * 11);
  canillas[1] += 26 * burla * Math.sin(u * 11 + 2);
  m.respira = mezclar(m.respira, 2 * Math.sin(u * 24), burla);
  m.brillo = loma(u, 6.0, 6.2, 6.6, 7.0);
  m.estrella = 12 * burla * Math.sin(u * 9);
  // Y te guiña.
  const guino = loma(u, T.guino[0], T.guino[0] + 0.12, T.guino[0] + 0.3, T.guino[0] + 0.45);
  m.parpados = [m.parpados[0], Math.max(m.parpados[1], guino)];
  m.puntas = puntas;
  m.muslos = muslos;
  m.canillas = canillas;
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al jocker con un azar que se puede fijar (el test lo fija). La isla usa `armarJocker`. */
export function armarJockerCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--jocker')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { hamaca: 0, abanica: 0, cascabelea: 0, burla: 0, oreja: 0, comodin: 0 };
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
  let burlonQuieto = false;
  let lado: 1 | -1 = 1;
  let pestanea = entre(PESTANEA);

  function elegir(): Exclude<Accion, 'comodin'> {
    const opciones = (['hamaca', 'abanica', 'cascabelea', 'burla', 'oreja'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'comodin' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m = copia(QUIETO);
    // Quieto: respira, se hamaca apenas, y los ojos se le van de un lado al otro.
    m.respira = Math.sin(t * 1.6);
    m.hamaca = 1.6 * Math.sin(t * 0.9);
    m.cabeza = QUIETO.cabeza + 2 * Math.sin(t * 0.43);
    m.mira = [QUIETO.mira[0] + 0.6 * Math.sin(t * 0.31), QUIETO.mira[1] + 0.3 * Math.sin(t * 0.53)];
    m.puntas = [-1.6 * Math.cos(t * 0.9), -1.2 * Math.cos(t * 0.9 - 0.4), -1 * Math.cos(t * 0.9 - 0.8)];
    m.estrella = 3 * Math.sin(t * 0.9 - 0.6);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      m.parpados = [mezclar(m.parpados[0], 1, k), mezclar(m.parpados[1], 1, k)];
    }
    if (!accion) return m;
    const u = t - desde;
    return accion === 'comodin' ? momentoDelToque(m, u) : momentoDeAccion(accion, u, m, lado);
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
      aplicar(burlonQuieto ? BURLON : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté de comodín. */
  const tocado = (t: number): void => {
    if (accion !== 'comodin') empezar('comodin', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      burlonQuieto = !burlonQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso al lado de la cabeza, y la página abre la ficha. */
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

export const armarJocker: Armar = (marcos, esc) => armarJockerCon(marcos, esc);
