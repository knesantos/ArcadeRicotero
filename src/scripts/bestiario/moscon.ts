/**
 * El moscón zumbón (`D-73`, vigesimosexta vuelta), atrapado en el vaso boca abajo de la mesa.
 *
 * Lo que hace solo es no rendirse, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Camina** por el mantel, adentro del vaso, de una pared a la otra, y cuando llega al vidrio se da vuelta.
 * - **Trepa** por el vidrio hasta la mitad, se resbala y cae.
 * - **Zumba y se da** contra el culo del vaso: arranca de golpe, le pega, el vaso tiembla, el vidrio se empaña
 *   donde le pegó, y cae mareado, con estrellitas.
 * - **Se frota las patas** de adelante, parado, como hacen las moscas, y ladea la cabeza.
 * - **Respira** por el abdomen, las alas se le mueven solas cada tanto, y el vaho del vidrio sube y baja con el
 *   resuello.
 *
 * Tocado, **se vuelve loco** (*"sos un moscón zumbón que quedó atrapado"*): zumba en redondo por adentro del vaso a
 * toda velocidad, le pega al vidrio una y otra vez, el vaso tiembla y se corre un poco por el mantel, el vidrio se
 * empaña entero y se raya más; hasta que cae de espaldas, patalea, y se da vuelta como si nada. Dice su verso. Con
 * movimiento reducido no se mueve nada: tocarlo lo pasa de parado en el mantel a pegado al culo del vaso.
 *
 * Se lleva números (`rig-moscon.ts`) y nada que dibuje.
 */

import { GOLPEA, MOSCON_ARMADO, QUIETO, VASO, VERSO, adentroDelVaso, marcas, type Momento } from '../../lib/bestiario/rig-moscon.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-moscon-zumbon';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { camina: 3, trepa: 3.2, golpea: 3.4, frota: 3, loco: 8.6 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['camina', 'trepa', 'golpea', 'frota'] as const;

export const PAUSA = [0.8, 2.4] as const;
export const PRIMERA = [0.4, 1.2] as const;
export const DEMORA_FICHA = 1.4;
/** Cada cuánto se le mueven las alas solas, en segundos. */
export const ALETEA = [1.6, 4] as const;
const ALETEO = 0.35;
/** Lo que camina por segundo, en sus unidades, y el zumbido: batidos por segundo. */
export const VELOCIDAD = 22;
export const ZUMBIDO = 48;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { arranca: [0, 0.4], vuela: [0.4, 5.2], cae: [5.2, 5.7], patalea: [5.7, 7.6], paran: [7.6, 8.6] } as const;
/** Cuántas vueltas da adentro del vaso, loco, y cuántas veces le pega al vidrio. */
export const VUELTAS = 5;
export const GOLPES = 6;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const T = MOSCON_ARMADO.tope;

/** La pose de base de un instante, parado en `x` del mantel mirando para `lado`: respira y el vaho resuella. */
export function base(t: number, x: number, lado: 1 | -1): Momento {
  return {
    ...QUIETO,
    pos: [x, 0],
    rumbo: lado > 0 ? 0 : 180,
    respira: Math.sin(t * 5.5),
    cabeza: 3 * Math.sin(t * 1.3),
    vaho: 0.2 + 0.12 * Math.sin(t * 2.7),
    vahoEn: [lado * 18, -30],
    bate: (t * ZUMBIDO) % 1,
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, desde `x` y mirando para `lado`. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number, x: number, lado: 1 | -1): Momento {
  const m: Momento = { ...b, pos: [...b.pos], vahoEn: [...b.vahoEn] };
  switch (accion) {
    case 'camina': {
      // Camina hasta el vidrio, con las patas trotando; al llegar se da vuelta.
      const k = loma(u, 0, 0.3, 2.6, DURA.camina);
      m.pos = [x, 0];
      m.frota = 10 * k * Math.sin(u * 22);
      m.cabeza += 4 * k * Math.sin(u * 22 + 1);
      break;
    }
    case 'trepa': {
      // Sube por el vidrio de su lado, apuntando para arriba; a mitad de camino se resbala y cae.
      const sube = rampa(u, 0.2, 1.6);
      const resbala = rampa(u, 1.6, 1.9);
      const cae = rampa(u, 1.9, 2.3);
      const alto = T.arriba * 0.5 * sube * (1 - resbala * 0.3) * (1 - cae);
      m.pos = [lado * (T.x - 2), alto];
      m.rumbo = lado > 0 ? -90 * sube * (1 - cae) : 180 + 90 * sube * (1 - cae);
      m.frota = 12 * sube * (1 - cae) * Math.sin(u * 18);
      m.alas = 20 * resbala * (1 - cae);
      m.zumba = 0.6 * loma(u, 1.6, 1.7, 2.2, 2.4);
      m.vahoEn = [lado * (T.x - 4), alto - 8];
      m.vaho = mezclar(m.vaho, 0.5, sube * (1 - cae));
      break;
    }
    case 'golpea': {
      // Arranca de golpe, sube zumbando, le pega al culo del vaso, el vaso tiembla, y cae mareado.
      const sube = rampa(u, 0.3, 0.9);
      const pega = loma(u, 0.85, 0.9, 1.0, 1.1);
      const cae = rampa(u, 1.1, 1.9);
      const y = T.arriba * sube * (1 - cae) + 8 * Math.sin(Math.PI * cae) * (1 - cae);
      m.pos = [x + lado * 8 * sube * (1 - cae), y];
      m.rumbo = lado > 0 ? -80 * sube * (1 - cae) + 40 * cae * (1 - cae) : 180 + 80 * sube * (1 - cae);
      m.zumba = loma(u, 0.2, 0.35, 1.0, 1.4);
      m.alas = 40 * m.zumba;
      m.tiembla = 3 * pega * Math.sin(u * 60);
      m.vahoEn = [x + lado * 8, T.arriba - 4];
      m.vaho = mezclar(m.vaho, 1, loma(u, 0.85, 1.0, 1.8, DURA.golpea));
      m.estrellas = loma(u, 1.0, 1.2, 2.6, 3.2);
      m.giroEstrellas = u * 180;
      m.cabeza += 14 * loma(u, 1.1, 1.3, 2.6, 3.2) * Math.sin(u * 9);
      m.patalea = 8 * loma(u, 1.9, 2.0, 2.4, 2.8) * Math.sin(u * 30);
      break;
    }
    case 'frota': {
      // Parado, se frota las patas de adelante y ladea la cabeza.
      const k = loma(u, 0, 0.4, 2.4, DURA.frota);
      m.frota = -20 * k + 14 * k * Math.sin(u * 14);
      m.cabeza += 12 * k * Math.sin(u * 2.1);
      m.respira = Math.sin(u * 8);
      break;
    }
  }
  return m;
}

/** El toque, desde `x` del mantel: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number, x: number): Momento {
  const Tq = TOQUE_T;
  const m: Momento = { ...b, pos: [...b.pos], vahoEn: [...b.vahoEn] };
  const vuela = loma(u, Tq.arranca[0], Tq.arranca[1], Tq.vuela[1], Tq.cae[1]);
  // Da vueltas adentro del vaso: una elipse que le pega a las paredes, cada vez más rápido.
  const f = ((u - Tq.arranca[1]) / (Tq.vuela[1] - Tq.arranca[1])) * VUELTAS;
  const a = f * Math.PI * 2;
  const rx = (T.x + 6) * vuela;
  const ry = (-T.arriba / 2) * vuela;
  const cy = T.arriba / 2;
  m.pos = [mezclar(x, 0, vuela) + rx * Math.cos(a), mezclar(0, cy, vuela) + ry * Math.sin(a)];
  m.rumbo = mezclar(b.rumbo, (Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)) * 180) / Math.PI, vuela);
  m.zumba = vuela;
  m.alas = 40 * vuela;
  // Le pega al vidrio en cada vuelta y media: el vaso tiembla, se corre, se empaña y se raya.
  const golpe = Math.max(0, Math.sin(a * (GOLPES / VUELTAS))) ** 12 * vuela;
  m.tiembla = 4 * golpe * Math.sin(u * 70);
  m.corre = 6 * rampa(u, Tq.vuela[0], Tq.vuela[1]) * Math.sin(u * 1.3);
  m.vahoEn = [m.pos[0] * 1.05, m.pos[1] - 6];
  m.vaho = mezclar(m.vaho, 1, rampa(u, Tq.vuela[0], Tq.vuela[0] + 1.5) * (1 - rampa(u, Tq.paran[0], Tq.paran[1])));
  m.rayones = mezclar(m.rayones, 1, rampa(u, Tq.vuela[0], Tq.vuela[1]));
  // Cae de espaldas, patalea un rato, y se da vuelta.
  const cae = rampa(u, Tq.cae[0], Tq.cae[1]);
  const panza = loma(u, Tq.cae[0], Tq.cae[1], Tq.paran[0], Tq.paran[0] + 0.5);
  if (u >= Tq.cae[0]) {
    m.pos = [mezclar(m.pos[0], x, cae), mezclar(m.pos[1], 0, cae)];
    m.rumbo = mezclar(m.rumbo, b.rumbo, cae);
  }
  m.panza = panza;
  m.patalea = 22 * loma(u, Tq.patalea[0], Tq.patalea[0] + 0.2, Tq.patalea[1], Tq.paran[0]) * Math.sin(u * 26);
  m.frota = 10 * loma(u, Tq.patalea[0], Tq.patalea[0] + 0.2, Tq.patalea[1], Tq.paran[0]) * Math.sin(u * 26 + 2);
  m.estrellas = loma(u, Tq.cae[0], Tq.cae[1], Tq.patalea[1], Tq.paran[0]);
  m.giroEstrellas = u * 140;
  m.respira = mezclar(m.respira, Math.sin(u * 12), cae);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  x: number;
  lado: 1 | -1;
}

/** Arma al moscón con un azar que se puede fijar (el test lo fija). La isla usa `armarMoscon`. */
export function armarMosconCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--moscon')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { camina: 0, trepa: 0, golpea: 0, frota: 0, loco: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, x: 0, lado: 1 }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let golpeaQuieto = false;
  let x = QUIETO.pos[0];
  let lado: 1 | -1 = 1;
  let aletea = entre(ALETEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'loco' ? ultima : a;
    desde = t;
    hechas[a]++;
    // Para caminar, se da vuelta si tiene el vidrio pegado.
    if (a === 'camina') {
      if (x >= T.x - 6) lado = -1;
      else if (x <= -T.x + 6) lado = 1;
      else if (azar() < 0.4) lado = lado === 1 ? -1 : 1;
    }
  }

  function momento(t: number): Momento {
    const b = base(t, x, lado);
    const ala = t - aletea;
    if (ala > 0 && ala < ALETEO) b.alas = 30 * Math.sin((ala / ALETEO) * Math.PI);
    const u = t - desde;
    if (accion === 'loco') return momentoDelToque(b, u, x);
    if (accion) return momentoDeAccion(b, accion, u, x, lado);
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
      aplicar(golpeaQuieto ? GOLPEA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - aletea > ALETEO) aletea = t + entre(ALETEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    // Caminando avanza, y el vidrio lo frena.
    if (accion === 'camina') {
      const k = loma(t - desde, 0, 0.3, 2.6, DURA.camina);
      [x] = adentroDelVaso([x + lado * VELOCIDAD * k * dt, 0]);
    }
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté loco. */
  const tocado = (t: number): void => {
    if (accion !== 'loco') empezar('loco', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      golpeaQuieto = !golpeaQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba del vaso, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, x, lado }),
  };
}

export const armarMoscon: Armar = (marcos, esc) => armarMosconCon(marcos, esc);

/** Lo alto del vaso, para el test. */
export const ALTO_DEL_VASO = VASO.alto;
