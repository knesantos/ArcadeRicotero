/**
 * El diablo de muchos cuernos (`D-73`, vigesimocuarta vuelta), el que recibe en la puerta del salón.
 *
 * Lo que hace solo es esperar a que llegue alguien, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Convida**: hace la reverencia del portero, la mano en el pecho y la otra barriendo para el lado de
 *   la puerta.
 * - **Mira el reloj**: saca el de bolsillo, lo mira, se lo lleva a la oreja y lo guarda. Llegan tarde.
 * - **Se rasca** entre los cuernos con un dedo, y los de ese lado se le menean. Entorna los ojos.
 * - **Se le cae el monóculo**: alza la ceja de más, el monóculo salta, queda colgando del cordón y se
 *   hamaca, y lo vuelve a poner.
 * - **Golpea la cola**: la punta de flecha le da al piso, impaciente, y revolea los ojos para arriba.
 * - **Respira**, se ladea apenas y pestañea.
 *
 * Tocado, **cuenta** (*"para cerrar un ojo y ver cuántos cuernos tiene el diablo"*): cierra el ojo sin
 * monóculo y se cuenta los cuernos con el dedo, de a uno, y cada uno se menea cuando le toca: los de la
 * izquierda con una mano, los de la derecha con la otra, y el de la pera tocándolo, bizco. Cuando termina le
 * sale uno más, verde, el que no se deja contar: abre la boca, se le cae el monóculo. Se encoge de hombros,
 * hace la reverencia para el lado de la puerta, se pone el monóculo y queda como estaba. Dice su verso. Con
 * movimiento reducido no se mueve nada: tocarlo lo pasa de la puerta a contarse los cuernos con un ojo.
 *
 * Se lleva números (`rig-cuernos.ts`) y nada que dibuje.
 */

import { CUENTA, CUERNOS_ARMADO as A, ORDEN, QUIETO, VERSO, alcanzar, contando, enLaCabeza, marcas, monoculoEn, type Momento, type Punto } from '../../lib/bestiario/rig-cuernos.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-diablo-de-muchos-cuernos';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { convida: 3, reloj: 3.4, rasca: 2.8, monoculo: 3.6, cola: 2.6, cuenta: 8 } as const;
export type Accion = keyof typeof DURA;
export type Sola = Exclude<Accion, 'cuenta'>;

export const PAUSA = [1.2, 3.4] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.8, 5.6] as const;
const PESTANEO = 0.24;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { cierra: [0, 0.6], cuenta: [1, 5], brota: [5, 5.6], saluda: [5.7, 7], pone: [7, 7.6] } as const;
/** Lo que dura contar cada cuerno. */
export const CADA = (TOQUE_T.cuenta[1] - TOQUE_T.cuenta[0]) / ORDEN.length;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
type Pose = [number, number];
const por = ([b, c]: Pose, k: number): Pose => [b * k, c * k];
const mas = (...ps: Pose[]): Pose => ps.reduce<Pose>((s, [b, c]) => [s[0] + b, s[1] + c], [0, 0]);
const entre = (a: Pose, b: Pose, k: number): Pose => [mezclar(a[0], b[0], k), mezclar(a[1], b[1], k)];

/** Una copia del momento que se puede tocar. */
function copia(m: Momento): Momento & { brazos: Pose; codos: Pose; parpados: [number, number]; cejas: [number, number]; pupilas: [Punto, Punto]; meneo: number[]; cabeceo: [number, number] } {
  return { ...m, brazos: [...m.brazos], codos: [...m.codos], parpados: [...m.parpados], cejas: [...m.cejas], pupilas: [[...m.pupilas[0]], [...m.pupilas[1]]], meneo: [...m.meneo], cabeceo: [...m.cabeceo] };
}

/** Pone el brazo `n` en una pose. */
function brazo(m: ReturnType<typeof copia>, n: 0 | 1, [b, c]: Pose): void {
  m.brazos[n] = b;
  m.codos[n] = c;
}

/** Hacia dónde miran las pupilas para ver un punto: un corrimiento chico, de a lo sumo `r`. */
function hacia(ojo: Punto, p: Punto, r = 2.8): Punto {
  const [dx, dy] = [p[0] - ojo[0], p[1] - ojo[1]];
  const l = Math.hypot(dx, dy) || 1;
  return [(dx / l) * r, (dy / l) * r];
}

/** Lo que se menea un cuerno al que le tocó: un golpe que se apaga. */
const golpe = (u: number, desde: number): number => (u < desde ? 0 : 12 * Math.exp(-(u - desde) * 4.5) * Math.sin((u - desde) * 24));

/** La pose del brazo que cuenta en un instante: va de un cuerno al otro, con el brazo que le toca. */
function contandoCon(n: 0 | 1, u: number): Pose {
  const desde = n === 0 ? 0 : 4;
  const j = Math.min(3, Math.max(0, Math.floor((u - TOQUE_T.cuenta[0]) / CADA) - desde));
  const s = (u - TOQUE_T.cuenta[0] - (desde + j) * CADA) / CADA;
  const ahora = contando(ORDEN[desde + j]!);
  const antes = j > 0 ? contando(ORDEN[desde + j - 1]!) : ahora;
  return entre(antes, ahora, suave(s / 0.35));
}

/**
 * El toque, sobre la pose de base de ese cuadro (quieta, con la respiración y el pestañeo): lo que hace a
 * los `u` segundos de que lo tocaron.
 */
export function momentoDelToque(base: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(base);
  // Cierra el ojo sin monóculo, alza la ceja del otro y se pone serio.
  const cerrado = rampa(u, 0.2, 0.6) * (1 - rampa(u, 5, 5.2));
  m.parpados[0] = mezclar(base.parpados[0], 1, cerrado);
  m.parpados[1] = mezclar(base.parpados[1], 0, loma(u, 0.2, 0.6, 5.6, 6));
  m.cejas[1] = mezclar(base.cejas[1], 0.8, loma(u, 0.2, 0.6, 5, 5.2));
  m.ladea = mezclar(base.ladea, 4, loma(u, 0.2, 0.8, 5, 5.4));
  // Cuenta: el brazo 1 los de la izquierda, el 2 los de la derecha y la pera.
  const arriba1 = rampa(u, 0.5, 1) * (1 - rampa(u, 3, 3.4));
  const arriba2 = rampa(u, 2.7, 3) * (1 - rampa(u, 5, 5.3));
  let b1 = por(contandoCon(0, u), arriba1);
  let b2 = por(contandoCon(1, u), arriba2);
  ORDEN.forEach((c, i) => {
    const s0 = T.cuenta[0] + i * CADA + 0.12;
    m.meneo[i] = (m.meneo[i] ?? 0) + golpe(u, s0) * (u < s0 + 1.4 ? 1 : 0);
    // Cada cuenta, un cabeceo chico, y la pupila del monóculo va al cuerno.
    m.cabeceo[1] += 2 * loma(u, s0 - 0.1, s0, s0 + 0.1, s0 + 0.3);
    if (u >= s0 - 0.12 && u < s0 - 0.12 + CADA) {
      const ojo = A.ojos[1];
      m.pupilas[1] = c === 'pera' ? [-2, 3] : hacia(ojo, A.cuernos[c].lomo);
      if (c === 'pera') m.pupilas[0] = [2.4, 2.6];
    }
  });
  // Le sale uno más: el brote. Todos los cuernos se sacuden, abre la boca, se le cae el monóculo.
  const sale = Math.min(1.15, rampa(u, 5, 5.3) * (1 + 0.15 * Math.sin(Math.min(1, (u - 5) / 0.5) * Math.PI)));
  m.brote = sale * (1 - rampa(u, 6.2, 6.9));
  const sacude = loma(u, 5, 5.1, 5.4, 5.7);
  for (let i = 0; i < m.meneo.length; i++) m.meneo[i]! += 4 * sacude * Math.sin(u * 46 + i);
  m.grito = loma(u, 5.05, 5.15, 5.5, 5.9);
  m.cejas = [mezclar(m.cejas[0], 1.3, loma(u, 5, 5.1, 5.6, 6)), mezclar(m.cejas[1], 1.4, loma(u, 5, 5.1, 5.6, 6))];
  if (u > 5 && u < 5.8) m.pupilas = [[0, -3], [0, -3]];
  m.caida = rampa(u, 5.1, 5.45) * (1 - rampa(u, T.pone[0] + 0.1, T.pone[1]));
  m.vaiven = u > 5.45 ? 26 * Math.exp(-(u - 5.45) * 1.3) * Math.sin((u - 5.45) * 6.5) : 0;
  // Se encoge de hombros, y hace la reverencia para el lado de la puerta.
  const hombros = loma(u, 5.3, 5.5, 5.7, 5.95);
  b1 = mas(b1, por(alcanzar(0, [-66, -140]), hombros));
  b2 = mas(b2, por(alcanzar(1, [66, -140]), hombros));
  m.cabeceo[1] -= 4 * hombros;
  const reverencia = loma(u, T.saluda[0], T.saluda[0] + 0.5, T.saluda[1] - 0.4, T.saluda[1]);
  m.reverencia = 0.9 * reverencia;
  m.inclina = 4 * reverencia;
  m.parpados[0] = Math.max(m.parpados[0], 0.5 * reverencia);
  m.parpados[1] = Math.max(m.parpados[1], 0.4 * reverencia);
  b1 = mas(b1, por(alcanzar(0, [-4, -168]), reverencia));
  const barre = rampa(u, T.saluda[0] + 0.1, T.saluda[0] + 0.9);
  b2 = mas(b2, por(alcanzar(1, [mezclar(56, 102, barre), mezclar(-196, -146, barre)]), reverencia));
  m.cola = 8 * reverencia;
  // Se pone el monóculo con la mano 2: la mano va adonde esté colgando y lo sube al ojo.
  const pone = loma(u, T.pone[0] - 0.15, T.pone[0] + 0.1, T.pone[1], T.pone[1] + 0.35);
  if (pone > 0) b2 = mas(b2, por(alcanzar(1, monoculoEn(m)), pone));
  brazo(m, 0, b1);
  brazo(m, 1, b2);
  return m;
}

/** Lo que hace solo, a los `u` segundos de empezar una acción. `lado` elige para dónde. */
export function momentoDeAccion(base: Momento, a: Sola, u: number, lado: number): Momento {
  const m = copia(base);
  switch (a) {
    case 'convida': {
      // La reverencia del portero: la mano en el pecho, la otra barriendo para la puerta.
      const k = loma(u, 0.2, 0.8, 2.2, DURA.convida);
      const barre = rampa(u, 0.3, 1.3);
      m.reverencia = 0.85 * k;
      m.inclina = 3 * k;
      m.parpados = [Math.max(m.parpados[0], 0.55 * k), Math.max(m.parpados[1], 0.45 * k)];
      m.cejas = [m.cejas[0] + 0.4 * k, m.cejas[1] + 0.3 * k];
      brazo(m, 0, por(alcanzar(0, [-4, -168]), k));
      brazo(m, 1, por(alcanzar(1, [mezclar(56, 104, barre), mezclar(-196, -144, barre)]), k));
      m.cola = 7 * k;
      break;
    }
    case 'reloj': {
      // Saca el reloj, lo mira, se lo lleva a la oreja y lo guarda: llegan tarde.
      const k = loma(u, 0.1, 0.6, 2.7, DURA.reloj);
      const oreja = loma(u, 1.5, 1.9, 2.3, 2.6);
      const mira = loma(u, 0.5, 0.8, 1.4, 1.7);
      m.reloj = rampa(u, 0.35, 0.5) * (1 - rampa(u, 2.75, 2.9));
      const p: Punto = [mezclar(18, 52, oreja), mezclar(-150, -236, oreja)];
      brazo(m, 1, por(alcanzar(1, p), k));
      m.ladea += 6 * mira + 12 * oreja;
      m.cabeceo = [0, 3 * mira];
      m.pupilas = [[mezclar(0, 2, mira), 3 * mira - 2 * oreja], [mezclar(0, 1, mira), 3 * mira - 2 * oreja]];
      m.parpados = [Math.max(m.parpados[0], 0.6 * oreja), Math.max(m.parpados[1], 0.3 * mira)];
      m.cejas = [m.cejas[0] + 0.5 * mira, m.cejas[1]];
      break;
    }
    case 'rasca': {
      // Se rasca entre los cuernos con un dedo; los de ese lado se menean y entorna los ojos.
      const k = loma(u, 0.2, 0.7, 2, DURA.rasca);
      const rasca = loma(u, 0.6, 0.75, 1.9, 2.05);
      m.ladea -= 8 * k;
      const punto = enLaCabeza(m, [-6 + 3.5 * Math.sin(u * 28) * rasca, -282]);
      brazo(m, 0, por(alcanzar(0, punto), k));
      m.parpados = [Math.max(m.parpados[0], 0.75 * rasca), Math.max(m.parpados[1], 0.55 * rasca)];
      m.cejas = [m.cejas[0] + 0.3 * rasca, m.cejas[1] + 0.2 * rasca];
      for (let i = 0; i < 4; i++) m.meneo[i]! += 3 * rasca * Math.sin(u * 28 + i);
      m.cola = 5 * rasca * Math.sin(u * 9);
      break;
    }
    case 'monoculo': {
      // Alza la ceja de más, el monóculo salta, cuelga del cordón y se hamaca; lo vuelve a poner.
      m.cejas[1] = mezclar(m.cejas[1], 1.5, loma(u, 0.1, 0.3, 0.5, 1.1));
      m.caida = rampa(u, 0.35, 0.8) * (1 - rampa(u, 2.3, 2.9));
      m.vaiven = u > 0.8 ? 30 * lado * Math.exp(-(u - 0.8) * 1.4) * Math.sin((u - 0.8) * 6.5) : 0;
      m.grito = 0.4 * loma(u, 0.35, 0.45, 0.8, 1.1);
      m.pupilas = [[0, 3 * loma(u, 0.5, 0.8, 2.6, 3)], [-1 * loma(u, 0.5, 0.8, 2.6, 3), 3 * loma(u, 0.5, 0.8, 2.6, 3)]];
      m.cabeceo = [0, 2 * loma(u, 0.5, 0.8, 2.6, 3)];
      const mano = loma(u, 1.7, 2.2, 2.9, 3.4);
      if (mano > 0) brazo(m, 1, por(alcanzar(1, monoculoEn(m)), mano));
      break;
    }
    case 'cola': {
      // La punta de la cola golpea el piso, impaciente, y revolea los ojos para arriba.
      const k = loma(u, 0.1, 0.4, 2, DURA.cola);
      m.cola = -14 * k * Math.abs(Math.sin(u * Math.PI * 1.8));
      m.pupilas = [[1.4 * lado * k, -3 * k], [1.4 * lado * k, -3 * k]];
      m.ladea += 4 * lado * k;
      m.cejas = [m.cejas[0] + 0.5 * k, m.cejas[1] + 0.2 * k];
      m.parpados = [Math.max(m.parpados[0], 0.3 * k), m.parpados[1]];
      break;
    }
  }
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al diablo con un azar que se puede fijar (el test lo fija). La isla usa `armarCuernos`. */
export function armarCuernosCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--cuernos')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { convida: 0, reloj: 0, rasca: 0, monoculo: 0, cola: 0, cuenta: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entreR = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entreR(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let cuentaQuieta = false;
  let lado = 1;
  let pestanea = entreR(PESTANEA);

  function elegir(): Sola {
    const opciones = (['convida', 'reloj', 'rasca', 'monoculo', 'cola'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'cuenta' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m = copia(QUIETO);
    // Quieto: respira, se ladea apenas y la cola le late.
    m.respira = Math.sin(t * 1.6);
    m.ladea = QUIETO.ladea + 1.4 * Math.sin(t * 0.41);
    m.cola = 2 * Math.sin(t * 0.9);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      m.parpados = [mezclar(m.parpados[0], 1, k), mezclar(m.parpados[1], 1, k)];
    }
    const u = t - desde;
    if (accion === 'cuenta') return momentoDelToque(m, u);
    if (accion) return momentoDeAccion(m, accion, u, lado);
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
      aplicar(cuentaQuieta ? CUENTA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entreR(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entreR(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté contando. */
  const tocado = (t: number): void => {
    if (accion !== 'cuenta') empezar('cuenta', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      cuentaQuieta = !cuentaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de los cuernos, y la página abre la ficha. */
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

export const armarCuernos: Armar = (marcos, esc) => armarCuernosCon(marcos, esc);
