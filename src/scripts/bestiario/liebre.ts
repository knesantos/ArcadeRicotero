/**
 * La liebre muerta (`D-73`, vigesimoséptima vuelta), tendida a la Bartola en su terciopelo, al borde del claro.
 *
 * Lo que hace sola es hacerse la muerta, y hacerlo mal. Nada es un bucle: elige qué se le escapa cada vez.
 *
 * - **Espía**: se le abre el ojo de a poco, mira para un lado y para el otro, y lo cierra de golpe.
 * - **Se le va una oreja**: una oreja se para sola, escucha, y se vuelve a caer.
 * - **Patea**: el reflejo. Una pata de atrás le tira dos sacudones.
 * - **Se relame**: la lengua se mete, se relame y vuelve a salir, más afuera que antes.
 * - **Pasa una piedra** rodando por delante (*"mis penas como piedras caen, ruedan y escapan"*) y la sigue con el
 *   ojo a medio abrir.
 * - **Suspira**: un muerto no suspira. Se le infla la panza y se queda dura, a ver si alguien vio.
 * - **Respira** apenas, y cada tanto le tiembla el pompón.
 *
 * Tocada, **se muere más fuerte** (*"¿de liebre muerta?"*): pega un respingo, y se pone tiesa con las cuatro patas
 * derechas para arriba y la lengua afuera del todo, temblando del esfuerzo. Aguanta. Después espía, levanta la
 * cabeza, mira para los dos lados, manotea una guinda del montón (*"¡toda esta guinda!"*), se la come, y se vuelve
 * a tumbar. En el montón aparece otra. Dice su verso. Con movimiento reducido no se mueve nada: tocarla la pasa de
 * floja a tiesa, con un ojo a medio abrir.
 *
 * Se lleva números (`rig-liebre.ts`) y nada que dibuje.
 */

import { QUIETO, TIESA, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-liebre.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-liebre-muerta';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { espia: 3, oreja: 2.2, patea: 1.6, relame: 2.6, piedra: 4.2, suspira: 3.2, tiesa: 9 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['espia', 'oreja', 'patea', 'relame', 'piedra', 'suspira'] as const;

export const PAUSA = [1.6, 4] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.4;
/** Cada cuánto le tiembla el pompón, en segundos, y cuánto dura. */
export const COLEA = [3, 7] as const;
const COLEO = 0.5;

/** Lo que giran las orejas para colgar cuando levanta la cabeza, en grados: más que lo que sube la cabeza. */
export const CUELGAN = [58, 82] as const;
/** Lo que levanta la cabeza para mirar, en grados. */
export const LEVANTA = 30;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { respingo: [0, 0.35], tiesa: [0.3, 0.7], aguanta: [0.7, 3.4], espia: [3.2, 4.2], levanta: [4.2, 5], manotea: [5.4, 6.2], come: [6.2, 7.2], tumba: [7.4, 8.4], otra: [8.4, 9] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, patea: [...b.patea], pupila: [...b.pupila], orejas: [...b.orejas] });

/** El aliento: se llena despacio y se vacía más rápido (−1 a 1). */
export const aliento = (t: number, periodo: number): number => {
  const p = (((t % periodo) + periodo) % periodo) / periodo;
  return p < 0.62 ? -Math.cos((Math.PI * p) / 0.62) : Math.cos((Math.PI * (p - 0.62)) / 0.38);
};

/** La pose de base de un instante: floja, con el ojo cerrado, respirando apenas. */
export function base(t: number): Momento {
  return { ...QUIETO, respira: 0.5 * aliento(t, 4.6), lengua: QUIETO.lengua + 0.04 * Math.sin(t * 0.6) };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. `lado` es 0 o 1. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number, lado: 0 | 1 = 0): Momento {
  const m = copia(b);
  switch (accion) {
    case 'espia': {
      // El ojo se abre de a poco, barre para los dos lados, y se cierra de golpe.
      m.parpado = 1 - 0.6 * rampa(u, 0, 1.2) * (1 - rampa(u, 2.5, 2.62));
      m.pupila = [3 * Math.sin((u - 0.8) * 2.6) * loma(u, 0.8, 1, 2.4, 2.5), 0.6];
      break;
    }
    case 'oreja': {
      const k = loma(u, 0, 0.35, 1.5, DURA.oreja);
      const o: [number, number] = [m.orejas[0], m.orejas[1]];
      o[lado] = -52 * k + 5 * k * Math.sin(u * 14);
      m.orejas = o;
      break;
    }
    case 'patea': {
      // Dos sacudones del reflejo, y queda como estaba.
      const k = loma(u, 0, 0.1, 1.2, DURA.patea);
      const p: [number, number] = [0, 0];
      p[lado] = -22 * k * Math.abs(Math.sin(u * Math.PI * 2.5));
      m.patea = p;
      m.cola = 14 * k * Math.sin(u * 30);
      break;
    }
    case 'relame': {
      const adentro = loma(u, 0, 0.4, 1.7, 2);
      m.lengua = mezclar(m.lengua, 0.1 + 0.25 * Math.abs(Math.sin(u * 7)), adentro) + 0.3 * loma(u, 2, 2.2, 2.4, DURA.relame);
      m.cabeza = -3 * adentro;
      break;
    }
    case 'piedra': {
      // Le pasa una pena rodando, y la sigue con el ojo.
      m.piedra = Math.min(1, u / 3.4);
      const mira = loma(u, 0.5, 1, 3.2, 3.6);
      m.parpado = 1 - 0.5 * mira;
      m.pupila = [mezclar(-3.4, 3.4, m.piedra), 2];
      m.orejas = [-10 * mira, 0];
      break;
    }
    case 'suspira': {
      // La panza se infla, se da cuenta, y se queda dura a ver si alguien vio.
      m.respira = mezclar(m.respira, 3.2, loma(u, 0, 0.9, 1, 1.5));
      const dura = loma(u, 1.5, 1.6, 2.6, DURA.suspira);
      m.respira *= 1 - dura;
      m.tiesa = 0.3 * dura;
      m.parpado = 1 - 0.3 * loma(u, 1.7, 1.9, 2.4, 2.5);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que la tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El respingo: abre el ojo del susto, y enseguida se pone tiesa.
  const susto = loma(u, T.respingo[0], 0.1, T.respingo[1], T.tiesa[1]);
  const tiesa = loma(u, T.tiesa[0], T.tiesa[1], T.levanta[0], T.levanta[1]);
  m.tiesa = tiesa;
  m.tiembla = 1.2 * loma(u, T.aguanta[0], 1.4, T.aguanta[1], T.espia[1]) * Math.sin(u * 46) * (0.4 + 0.6 * rampa(u, 1, 3));
  m.respira *= 1 - tiesa;
  m.lengua = mezclar(m.lengua, 1, tiesa);
  // Espía, levanta la cabeza y mira para los dos lados.
  const espia = loma(u, T.espia[0], T.espia[1], T.tumba[0], T.tumba[1]);
  const arriba = loma(u, T.levanta[0], T.levanta[1], T.tumba[0], T.tumba[1]);
  m.parpado = 1 - Math.max(susto, 0.5 * espia + 0.5 * arriba);
  m.pupila = [3 * Math.sin((u - T.espia[0]) * 2.4) * espia * (1 - rampa(u, T.manotea[0], T.manotea[0] + 0.2)) + 3 * rampa(u, T.manotea[0], T.manotea[0] + 0.2) * espia, 1 - 2 * arriba];
  m.cabeza = -LEVANTA * arriba + 6 * arriba * Math.sin(u * 16) * loma(u, T.come[0], T.come[0] + 0.2, T.come[1] - 0.2, T.come[1]);
  // Las orejas no se paran: cuelgan. Cuando levanta la cabeza se le caen para atrás, un rato después, y se hamacan.
  const cuelgan = loma(u, T.levanta[0] + 0.15, T.levanta[1] + 0.25, T.tumba[0] + 0.1, T.tumba[1] + 0.15);
  m.orejas = [CUELGAN[0] * cuelgan + 7 * cuelgan * Math.sin(u * 5), CUELGAN[1] * cuelgan + 9 * cuelgan * Math.sin(u * 5 - 0.8)];
  m.lengua = mezclar(m.lengua, 0.05, arriba);
  // Manotea la guinda de arriba del montón y se la lleva a la boca; se la come, y aparece otra.
  m.manotea = 46 * loma(u, T.manotea[0] - 0.4, T.manotea[0], T.manotea[1], T.come[0] + 0.3);
  m.guinda = rampa(u, T.manotea[0], T.manotea[1]) * (u < T.otra[0] ? 1 : 0);
  m.guindaSe = u < T.otra[0] ? 1 - rampa(u, T.come[0], T.come[0] + 0.25) : rampa(u, T.otra[0], T.otra[1]);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la liebre con un azar que se puede fijar (el test lo fija). La isla usa `armarLiebre`. */
export function armarLiebreCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--liebre')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { espia: 0, oreja: 0, patea: 0, relame: 0, piedra: 0, suspira: 0, tiesa: 0 };
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
  let tiesaQuieta = false;
  let lado: 0 | 1 = 0;
  let colea = entre(COLEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'tiesa' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? 0 : 1;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const cola = t - colea;
    if (cola > 0 && cola < COLEO) b.cola = 16 * Math.sin((cola / COLEO) * Math.PI * 4) * Math.sin((cola / COLEO) * Math.PI);
    const u = t - desde;
    if (accion === 'tiesa') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u, lado);
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
      aplicar(tiesaQuieta ? TIESA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - colea > COLEO) colea = t + entre(COLEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté tiesa. */
  const tocado = (t: number): void => {
    if (accion !== 'tiesa') empezar('tiesa', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      tiesaQuieta = !tiesaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de las patas, y la página abre la ficha. */
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

export const armarLiebre: Armar = (marcos, esc) => armarLiebreCon(marcos, esc);
