/**
 * El borrego (`D-73`, vigesimoséptima vuelta), suelto en la pastura, cerca del palo del cordero.
 *
 * Lo que hace solo es jugar al borrego, y nada es un bucle: elige a qué juega cada vez.
 *
 * - **Brinca** en el lugar, con las cuatro patas juntas, dos veces.
 * - **Pasta**: baja la cabeza, arranca, y mastica mirando al frente.
 * - **Mira al atado**: levanta la cabeza para el lado del palo, para las orejas y se queda. Él está suelto.
 * - **Tira una patada** al aire con las de atrás, de puro contento.
 * - **Se rasca** el disfraz con una pata de atrás: la lana pica.
 * - **Se le baja el cierre**: el disfraz se le resbala un poco, se da cuenta, y se lo sube de un sacudón.
 * - **Respira**, pestañea y mueve la cola; el pañuelo y la cola llegan después que el cuerpo.
 *
 * Tocado, **se le cae el disfraz** (*"caen, caen al fin, caen los disfraces, caen desnudándote"*): pega un brinco
 * del susto y el vellón no sube con él: se le cae hasta las pezuñas. Queda pelado, flaco, con los cortes del
 * carnicero marcados a línea de puntos, temblando, con las orejas gachas, y bala sin ruido. Mira para los costados,
 * agacha la cabeza, agarra el disfraz con los dientes, se lo sube a los tirones, se sacude y sigue jugando. Dice
 * su verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de disfrazado a pelado.
 *
 * Se lleva números (`rig-borrego.ts`) y nada que dibuje.
 */

import { DESNUDO, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-borrego.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-borrego';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { brinca: 1.8, pasta: 4, mira: 3, patea: 1.4, rasca: 2.4, cierre: 3, desnudo: 8.6 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['brinca', 'pasta', 'mira', 'patea', 'rasca', 'cierre'] as const;

export const PAUSA = [0.8, 2.6] as const;
export const PRIMERA = [0.5, 1.6] as const;
export const DEMORA_FICHA = 1.4;
/** Cada cuánto pestañea y cada cuánto mueve la cola, en segundos. */
export const PESTANEA = [2.2, 5] as const;
export const COLEA = [1.6, 4] as const;
const PESTANEO = 0.2;
const COLEO = 0.8;
/** Lo que sube en un brinco, en sus unidades. */
export const BRINCO = 34;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { brinco: [0, 0.7], cae: [0.2, 0.75], tiembla: [0.8, 3.6], bala: [1.4, 2.4], mira: [2.4, 3.6], agacha: [3.8, 4.6], sube: [4.6, 6.6], sacude: [6.8, 7.8] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, patas: [...b.patas], orejas: [...b.orejas], pupila: [...b.pupila] });
/** El arco de un salto: 0 en las puntas, 1 arriba. */
const arco = (k: number): number => (k <= 0 || k >= 1 ? 0 : 4 * k * (1 - k));
/** El aliento: se llena despacio y se vacía más rápido (−1 a 1). */
export const aliento = (t: number, periodo: number): number => {
  const p = (((t % periodo) + periodo) % periodo) / periodo;
  return p < 0.62 ? -Math.cos((Math.PI * p) / 0.62) : Math.cos((Math.PI * (p - 0.62)) / 0.38);
};

/** La pose de base de un instante: parado, respira, y mira al palo. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    respira: aliento(t, 2.6),
    cabeza: 2 * Math.sin(t * 0.6),
    pupila: [1.6 + 0.8 * Math.sin(t * 0.4), 0.4 * Math.sin(t * 0.9)],
    orejas: [2 * Math.sin(t * 0.9), 2 * Math.sin(t * 0.9 + 1)],
    // Lo que cuelga va atrás de la cabeza: la misma onda, un rato después.
    panuelo: 3 * Math.sin(t * 0.6 - 0.9),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'brinca': {
      // Dos brincos con las cuatro patas juntas: se agacha, salta, cae.
      const k = (u / 0.9) % 1;
      const en = u < 1.8 ? arco((k - 0.2) / 0.6) : 0;
      const agacha = u < 1.8 ? arco(k / 0.2) * 0.5 + arco((k - 0.8) / 0.2) : 0;
      m.salta = BRINCO * en - 4 * agacha;
      m.patas = [14 * en, 18 * en, -14 * en, -18 * en];
      m.orejas = [-30 * en, -34 * en];
      m.cola = 40 * en;
      m.panuelo = 24 * arco((k - 0.32) / 0.6) * (u < 1.8 ? 1 : 0);
      break;
    }
    case 'pasta': {
      const baja = loma(u, 0, 0.7, 1.8, 2.3);
      m.cabeza = mezclar(m.cabeza, 62, baja) - 6 * loma(u, 1.5, 1.7, 1.8, 2);
      m.patas = [-8 * baja, -4 * baja, 0, 0];
      // Mastica de costado, con la boca llena.
      const mastica = loma(u, 2.2, 2.4, 3.6, DURA.pasta);
      m.quijada = 0.5 * mastica * Math.abs(Math.sin(u * 9));
      m.panuelo = 30 * loma(u, 0.25, 0.95, 2.05, 2.55);
      break;
    }
    case 'mira': {
      // El otro está atado. Él no.
      const k = loma(u, 0, 0.5, 2.3, DURA.mira);
      m.cabeza = mezclar(m.cabeza, -16, k);
      m.orejas = [-26 * k, -30 * k];
      m.pupila = [mezclar(m.pupila[0], 3.2, k), mezclar(m.pupila[1], -1.4, k)];
      m.cola = 14 * k * Math.sin(u * 12);
      break;
    }
    case 'patea': {
      // El anca para arriba y las dos de atrás al aire.
      const k = arco((u - 0.2) / 0.9);
      m.inclina = 16 * k;
      m.salta = 10 * k;
      m.patas = [-10 * k, -6 * k, -50 * k, -62 * k];
      m.cabeza = mezclar(m.cabeza, 14, k);
      m.cola = 50 * k;
      m.panuelo = -20 * arco((u - 0.35) / 0.9);
      break;
    }
    case 'rasca': {
      const k = loma(u, 0, 0.4, 1.9, DURA.rasca);
      const frota = loma(u, 0.4, 0.6, 1.7, 1.9);
      m.patas = [0, 0, 58 * k + 10 * frota * Math.sin(u * 32), 0];
      m.inclina = -4 * k;
      m.cabeza = mezclar(m.cabeza, -8, k);
      m.parpado = Math.max(m.parpado, 0.7 * frota);
      break;
    }
    case 'cierre': {
      // El disfraz se le resbala, mira para atrás, y se lo sube de un sacudón.
      m.caido = 0.3 * rampa(u, 0, 0.9) * (1 - rampa(u, 2, 2.25));
      const nota = loma(u, 1, 1.3, 2, 2.3);
      m.cabeza = mezclar(m.cabeza, -22, nota);
      m.pupila = [mezclar(m.pupila[0], -3, nota), 1.4 * nota];
      m.orejas = [18 * nota, 22 * nota];
      m.salta = 8 * arco((u - 2) / 0.4);
      m.tiembla = 1.6 * loma(u, 2.2, 2.3, 2.6, 2.9) * Math.sin(u * 44);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El brinco del susto. El disfraz no sube: se cae.
  const en = arco((u - T.brinco[0]) / (T.brinco[1] - T.brinco[0]));
  m.salta = 1.3 * BRINCO * en;
  // Se lo sube a los tirones, con los dientes: tres tirones.
  const sube = rampa(u, T.sube[0], T.sube[1]);
  const tirones = Math.min(1, (Math.floor(sube * 3) + suave(((sube * 3) % 1) * 2.2)) / 3);
  m.caido = rampa(u, T.cae[0], T.cae[1]) * (1 - (sube >= 1 ? 1 : tirones));
  const pelado = loma(u, T.cae[0], T.cae[1], T.sube[0], T.sube[1]);
  m.patas = [mezclar(14 * en, DESNUDO.patas[0], pelado), mezclar(18 * en, DESNUDO.patas[1], pelado), mezclar(-14 * en, DESNUDO.patas[2], pelado), mezclar(-18 * en, DESNUDO.patas[3], pelado)];
  // Pelado: tiembla, las orejas gachas, bala sin ruido y mira para los costados.
  m.tiembla = 1.4 * loma(u, T.tiembla[0], T.tiembla[0] + 0.3, T.tiembla[1], T.agacha[1]) * Math.sin(u * 50);
  m.orejas = [mezclar(m.orejas[0], DESNUDO.orejas[0], pelado), mezclar(m.orejas[1], DESNUDO.orejas[1], pelado)];
  const bala = loma(u, T.bala[0], T.bala[0] + 0.2, T.bala[1] - 0.2, T.bala[1]);
  m.quijada = bala * (0.7 + 0.3 * Math.sin(u * 30));
  const mira = loma(u, T.mira[0], T.mira[0] + 0.2, T.mira[1] - 0.2, T.mira[1]);
  m.pupila = [mezclar(mezclar(m.pupila[0], DESNUDO.pupila[0], pelado), 3.4 * Math.sin((u - T.mira[0]) * 5.2), mira), mezclar(m.pupila[1], DESNUDO.pupila[1], pelado)];
  m.cola = mezclar(m.cola, DESNUDO.cola, pelado);
  // Agacha la cabeza al disfraz, y la levanta con cada tirón.
  const agacha = loma(u, T.agacha[0], T.agacha[1], T.sube[1] - 0.3, T.sube[1]);
  m.cabeza = mezclar(mezclar(m.cabeza, DESNUDO.cabeza - 10 * bala, pelado), 50 - 40 * tirones, agacha);
  m.quijada = Math.max(m.quijada, 0.4 * agacha);
  // El pañuelo llega después: vuela con el brinco y cuelga cuando agacha.
  m.panuelo = m.panuelo + 40 * arco((u - 0.15) / 0.8) + 26 * loma(u, T.agacha[0] + 0.25, T.agacha[1] + 0.25, T.sube[1] - 0.05, T.sube[1] + 0.25);
  // Se sacude entero, como perro mojado, y queda como si nada.
  const sacude = loma(u, T.sacude[0], T.sacude[0] + 0.15, T.sacude[1] - 0.3, T.sacude[1]);
  m.inclina = 5 * sacude * Math.sin(u * 34);
  m.orejas = [m.orejas[0] + 22 * sacude * Math.sin(u * 34), m.orejas[1] - 22 * sacude * Math.sin(u * 34)];
  m.cola += 40 * sacude * Math.sin(u * 34 - 1);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al borrego con un azar que se puede fijar (el test lo fija). La isla usa `armarBorrego`. */
export function armarBorregoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--borrego')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { brinca: 0, pasta: 0, mira: 0, patea: 0, rasca: 0, cierre: 0, desnudo: 0 };
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
  let desnudoQuieto = false;
  let pestanea = entre(PESTANEA);
  let colea = entre(COLEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'desnudo' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const cola = t - colea;
    if (cola > 0 && cola < COLEO) b.cola = 30 * Math.sin((cola / COLEO) * Math.PI * 5) * Math.sin((cola / COLEO) * Math.PI);
    const u = t - desde;
    if (accion === 'desnudo') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u);
    return b;
  }

  function aplicar(m: Momento): void {
    const { transform } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero') p.get(nombre)?.setAttribute('transform', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(desnudoQuieto ? DESNUDO : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (t - colea > COLEO) colea = t + entre(COLEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté pelado. */
  const tocado = (t: number): void => {
    if (accion !== 'desnudo') empezar('desnudo', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      desnudoQuieto = !desnudoQuieto;
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

export const armarBorrego: Armar = (marcos, esc) => armarBorregoCon(marcos, esc);
