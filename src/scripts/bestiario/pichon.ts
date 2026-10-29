/**
 * El pichón (`D-73`, vigesimoquinta vuelta), en el alféizar de la ventana enrejada de la prisión.
 *
 * Lo que hace solo es lo de cualquier pichón de paloma en una cornisa, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Picotea** las migas del alféizar.
 * - **Se esponja**, con la cabeza metida, del frío o del miedo.
 * - **Se sacude** entero, que se le vuela el plumón.
 * - **Se rasca** la cabeza con la pata vendada.
 * - **Mira para el pasillo** con un ojo y después con el otro, girando la cabeza a los tirones, como paloma.
 * - **Se duerme con un ojo abierto**: cierra el que se ve, y cuando da vuelta la cabeza, el otro está abierto.
 * - **Da dos pasos** cabeceando y vuelve.
 * - **Respira** ligero y pestañea.
 *
 * Tocado, **le tiran** (*"practicamos tiro al pichón"*): un fogonazo desde abajo, del lado de quien mira; salta
 * con las alas abiertas, le vuelan las plumas y se tira del lado de la calle; la bala abre un agujero nuevo en la
 * piedra, que se queda. Al rato asoma la cabeza despacio por arriba del alféizar, da vuelta la cabeza para mirar
 * el agujero, sube, se sacude, y hace un palito más en la pizarrita. Dice su verso. Cada tiro suma un agujero y
 * un palito; al séptimo, la pared y la pizarra vuelven a empezar. Con movimiento reducido no se mueve nada:
 * tocarlo lo pasa de parado a agachado, con las plumas en el aire.
 *
 * Se lleva números (`rig-pichon.ts`) y nada que dibuje.
 */

import { AGACHADO, QUIETO, TIROS, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-pichon.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-pichon';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { picotea: 2.8, esponja: 3.2, sacude: 1.6, rasca: 2.6, mira: 3, duerme: 4.4, pasea: 3.2, tiro: 7.4 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['picotea', 'esponja', 'sacude', 'rasca', 'mira', 'duerme', 'pasea'] as const;
type Sola = (typeof SOLAS)[number];

export const PAUSA = [0.8, 2.4] as const;
export const PRIMERA = [0.5, 1.5] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [1.8, 4.6] as const;
const PESTANEO = 0.18;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = {
  fogonazo: [0, 0.3],
  salta: [0.04, 0.5],
  escondido: [0.75, 2.2],
  asoma: [2.2, 3.4],
  mira: [3.4, 4.2],
  sube: [4.2, 4.8],
  sacude: [4.8, 5.5],
  rayita: [5.5, 6.9],
  vuelve: [6.9, 7.4],
} as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
/** Un tirón de paloma: de una pose a la otra en un parpadeo. */
const tiron = (u: number, a: number): number => rampa(u, a, a + 0.07);

/** La pose de base de un instante: respira ligero y la cabeza no se le queda quieta. `tiros` son los agujeros y palitos que ya hay. */
export function base(t: number, tiros = 0): Momento {
  return {
    ...QUIETO,
    respira: Math.sin(t * 5.4),
    cabeza: 2 * Math.sin(t * 0.7) + 1.2 * Math.sin(t * 2.3),
    cola: 3 * Math.sin(t * 0.9),
    agujeros: tiros,
    rayitas: tiros,
  };
}

function sacudon(m: Momento, u: number, a: number, b: number): void {
  const k = loma(u, a, a + 0.1, b - 0.2, b);
  const s = Math.sin((u - a) * 42) * k;
  m.cuerpo += 7 * s;
  m.cabeza += 16 * Math.sin((u - a) * 42 + 1) * k;
  m.ala += 12 * Math.abs(s);
  m.cola += 12 * s;
  m.esponja = Math.max(m.esponja, 0.8 * k);
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Sola, u: number): Momento {
  const m: Momento = { ...b, patas: [...b.patas] };
  switch (accion) {
    case 'picotea': {
      // Se inclina y le da a las migas: tres o cuatro picotazos secos.
      const k = loma(u, 0, 0.3, DURA.picotea - 0.3, DURA.picotea);
      const p = [0.45, 0.95, 1.35, 2].reduce((s, t0) => s + loma(u, t0, t0 + 0.07, t0 + 0.14, t0 + 0.28), 0);
      m.cuerpo -= 12 * k;
      m.cabeza += -16 * k - 26 * p;
      m.cabeceo -= 3 * p;
      m.cola += 8 * k;
      break;
    }
    case 'esponja': {
      // Se infla, mete la cabeza en los hombros y entrecierra el ojo.
      const k = loma(u, 0, 0.6, DURA.esponja - 0.6, DURA.esponja);
      m.esponja = k;
      m.agacha = 0.3 * k;
      m.cabeza -= 8 * k;
      m.parpado = Math.max(m.parpado, 0.45 * k);
      break;
    }
    case 'sacude':
      sacudon(m, u, 0, DURA.sacude);
      break;
    case 'rasca': {
      // Levanta la pata vendada hasta la cara y se rasca, con la cabeza gacha y el ojo cerrado del gusto.
      const k = loma(u, 0, 0.4, DURA.rasca - 0.4, DURA.rasca);
      const r = loma(u, 0.45, 0.55, DURA.rasca - 0.55, DURA.rasca - 0.45);
      m.patas = [m.patas[0], 160 * k + 14 * r * Math.sin(u * 34)];
      m.cabeza += -22 * k + 6 * r * Math.sin(u * 34 + 0.8);
      m.cuerpo += 6 * k;
      m.parpado = Math.max(m.parpado, 0.8 * r);
      break;
    }
    case 'mira': {
      // Mira para el pasillo con un ojo, después con el otro, de frente, y vuelve: todo a los tirones.
      m.giro = 1 - 2 * tiron(u, 1.0) + 1.15 * tiron(u, 1.8) + 0.85 * tiron(u, 2.5);
      m.cabeza += 10 * tiron(u, 0.3) - 16 * tiron(u, 1.0) + 14 * tiron(u, 1.8) - 8 * tiron(u, 2.5);
      m.cabeceo += 2 * tiron(u, 0.3) - 2 * tiron(u, 2.5);
      break;
    }
    case 'duerme': {
      // Se esponja y cierra el ojo; cuando da vuelta la cabeza, el otro ojo está abierto. Duerme de guardia.
      const k = loma(u, 0, 0.6, DURA.duerme - 0.6, DURA.duerme);
      const vuelta = loma(u, 1.6, 1.67, 2.9, 2.97);
      m.esponja = Math.max(m.esponja, 0.6 * k);
      m.agacha = 0.4 * k;
      m.cabeza -= 12 * k;
      m.respira *= 1 - 0.5 * k;
      m.giro = 1 - 2 * vuelta;
      m.parpado = Math.max(m.parpado, k * (1 - vuelta));
      break;
    }
    case 'pasea': {
      // Dos pasos para la izquierda, cabeceando como paloma, y vuelve mirando para atrás.
      const ida = entreT(u, [0.2, 1.2]);
      const vuelta = entreT(u, [1.8, 2.9]);
      const anda = loma(u, 0.15, 0.25, 1.15, 1.25) + loma(u, 1.75, 1.85, 2.85, 2.95);
      const fase = (ida + vuelta) * Math.PI * 2;
      m.paso = -12 * suave(ida) + 12 * suave(vuelta);
      m.patas = [22 * Math.sin(fase) * anda, -22 * Math.sin(fase) * anda];
      m.salto = 1.4 * Math.abs(Math.sin(fase)) * anda;
      // El cabeceo: la cabeza se adelanta y se queda, mientras el cuerpo la alcanza.
      m.cabeceo += -4 * anda * ((fase / Math.PI) % 1);
      m.giro = 1 - 2 * loma(u, 1.6, 1.67, 2.9, 2.97);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos del tiro. `antes` son los tiros que ya había. */
export function momentoDelToque(b: Momento, u: number, antes: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b, patas: [...b.patas] };
  // PUM: el fogonazo desde abajo, el agujero nuevo en la piedra con sus esquirlas, y las plumas que vuelan.
  m.fogonazo = loma(u, 0, 0.03, 0.08, T.fogonazo[1]);
  m.agujeros = antes + rampa(u, 0.08, 0.16);
  m.esquirlas = entreT(u, [0.1, 0.9]);
  m.plumas = entreT(u, [0.12, 2.8]);
  // Salta con las alas abiertas y se tira del lado de la calle.
  m.salto = 22 * Math.sin(Math.PI * entreT(u, T.salta));
  m.alas = loma(u, T.salta[0], T.salta[0] + 0.06, T.salta[1] - 0.1, T.salta[1]);
  const baja = rampa(u, 0.42, T.escondido[0]);
  // Asoma despacio, nada más que la cabeza; después sube del todo.
  const asoma = rampa(u, T.asoma[0], T.asoma[1]);
  const sube = rampa(u, T.sube[0], T.sube[1]);
  m.baja = baja * (1 - 0.7 * asoma - 0.3 * sube);
  m.agacha = 0.8 * loma(u, 0.4, 0.5, T.sube[0], T.sube[1]);
  m.esponja = 0.8 * loma(u, 0.3, 0.5, T.sacude[0], T.sacude[0] + 0.4);
  // Mira el agujero: da vuelta la cabeza de un tirón para el lado de la jamba, y la levanta.
  const mira = loma(u, T.mira[0], T.mira[0] + 0.07, T.mira[1] - 0.15, T.mira[1] - 0.08);
  m.giro = 1 - 2 * mira;
  m.cabeza += -16 * mira + 4 * asoma * (1 - mira) * Math.sin(u * 9);
  // Se sacude.
  sacudon(m, u, T.sacude[0], T.sacude[1]);
  // Va hasta la pizarrita y hace el palito con el pico.
  const va = rampa(u, T.rayita[0], T.rayita[0] + 0.4) * (1 - rampa(u, T.vuelve[0], T.vuelve[1]));
  const raya = loma(u, 6, 6.1, 6.4, 6.55);
  m.paso = -6 * va;
  m.patas = [m.patas[0] + 16 * Math.sin(u * 16) * (loma(u, 5.5, 5.55, 5.85, 5.9) + loma(u, 6.9, 6.95, 7.3, 7.35)), m.patas[1] - 16 * Math.sin(u * 16) * (loma(u, 5.5, 5.55, 5.85, 5.9) + loma(u, 6.9, 6.95, 7.3, 7.35))];
  m.cuerpo -= 12 * raya;
  m.cabeza -= 30 * raya + 6 * raya * Math.sin(u * 30);
  m.rayitas = antes + rampa(u, 6.1, 6.4);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  /** Cuántos agujeros nuevos y palitos hay. */
  tiros: number;
}

/** Arma al pichón con un azar que se puede fijar (el test lo fija). La isla usa `armarPichon`. */
export function armarPichonCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--pichon')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { picotea: 0, esponja: 0, sacude: 0, rasca: 0, mira: 0, duerme: 0, pasea: 0, tiro: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, tiros: 0 }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let agachadoQuieto = false;
  let pestanea = entre(PESTANEA);
  /** Los agujeros nuevos y los palitos: cada tiro suma uno, y al séptimo vuelven a empezar. */
  let tiros = 0;
  let antes = 0;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'tiro' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t, tiros);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const u = t - desde;
    if (accion === 'tiro') return momentoDelToque(b, u, antes);
    if (accion) return momentoDeAccion(b, accion, u);
    return b;
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero' && nombre !== 'delante') p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(agachadoQuieto ? { ...AGACHADO, agujeros: tiros, rayitas: tiros } : { ...QUIETO, agujeros: tiros, rayitas: tiros });
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya le estén tirando. */
  const tocado = (t: number): void => {
    if (accion === 'tiro') return;
    antes = tiros >= TIROS ? 0 : tiros;
    tiros = antes + 1;
    empezar('tiro', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      agachadoQuieto = !agachadoQuieto;
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
    estado: () => ({ accion, hechas: { ...hechas }, tiros }),
  };
}

export const armarPichon: Armar = (marcos, esc) => armarPichonCon(marcos, esc);
