/**
 * El que mordió el anzuelo (`D-73`, vigesimotercera vuelta), colgando de la caña del muelle.
 *
 * Lo que hace solo es colgar, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Se hamaca** en la línea, con la cola, como si el río lo meciera.
 * - **Da la vuelta** sobre sí mismo, colgado del labio, y vuelve a quedar de este lado.
 * - **Mira la estrella** de lata que tiene arriba de la nariz: entorna los ojos y se pone colorado.
 * - **Boquea**, resignado, con la mirada para abajo.
 * - **Se sacude** como para soltarse, y enseguida se rinde.
 * - Siempre: la línea se mece, la estrella gira, le chorrea el agua y pestañea.
 *
 * Tocado (*"mordí el anzuelo una vez más / siempre un iluso"*): la caña da un tirón, se sacude, el labio se le
 * zafa del anzuelo y cae al agua de un chapuzón. Abajo no se ve nada; arriba la estrella de lata gira sola y
 * brilla. Salta del agua, muerde otra vez, se pone colorado y da una vuelta de contento colgado del labio. Dice
 * su verso cuando muerde. Con movimiento reducido no se mueve nada: tocarlo lo pasa de colgado a recién mordido.
 *
 * Se lleva números (`rig-anzuelo.ts`) y nada que dibuje.
 */

import { HUNDE, QUIETO, TOCADO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-anzuelo.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-que-mordio-el-anzuelo';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { hamaca: 3.4, vuelta: 2.8, mira: 3.6, boquea: 2.8, sacude: 2.8, toque: 7.4 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.4] as const;
export const PRIMERA = [0.6, 1.8] as const;
/** Dice su verso cuando vuelve a morder. */
export const DEMORA_FICHA = 4.5;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.2, 4.8] as const;

/** Los tiempos del toque: cuándo se zafa, cuándo está abajo, cuándo salta y cuándo vuelve a morder. */
export const TOQUE_T = { tiron: [0, 0.7], zafa: [0.7, 1], cae: [1, 1.5], salta: [3.4, 4.3], muerde: [4.3, 4.7], vuelta: [4.7, 6.5], vuelve: [6.5, 7.4] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Lo que hace siempre, haga lo que haga: la línea se mece, la estrella gira y le chorrea el agua. */
function base(t: number): Momento {
  const estrella = Math.cos(t * 2.4);
  return {
    ...QUIETO,
    vaiven: 2.2 * Math.sin(t * 1.1) + 0.8 * Math.sin(t * 2.3),
    cola: 5 * Math.sin(t * 1.7),
    pectoral: 8 * Math.sin(t * 3.1),
    dorsal: 3 * Math.sin(t * 0.8),
    estrella,
    // Brilla cuando la estrella queda de frente al farol.
    brillo: 0.12 + 0.6 * Math.pow(Math.max(0, estrella), 14),
    gotas: [0, 1, 2].map((i) => (t * 0.5 + QUIETO.gotas[i]!) % 1) as unknown as readonly [number, number, number],
  };
}

/** El toque entero, `u` segundos después de tocarlo, encima de lo que hace siempre a la hora `t`. */
export function momentoDelToque(u: number, t = u): Momento {
  const T = TOQUE_T;
  const b = base(t);
  const m: Momento & { pez: [number, number]; mira: [number, number] } = { ...b, pez: [0, 0], mira: [...b.mira] };
  // El tirón de la caña: se sacude con los ojos redondos.
  const tira = loma(u, T.tiron[0], 0.1, 0.55, T.tiron[1]);
  m.tiron = 7 * tira * (0.5 + 0.5 * Math.sin(u * 18));
  m.cola += 30 * tira * Math.sin(u * 24);
  m.giro = 10 * tira * Math.sin(u * 15);
  m.dorsal += 16 * tira;
  m.pectoral += 20 * tira * Math.sin(u * 20);
  m.ensueno = mezclar(QUIETO.ensueno, 0, rampa(u, 0, 0.2));
  m.rubor = mezclar(QUIETO.rubor, 0, rampa(u, 0, 0.3));
  m.mira = [mezclar(QUIETO.mira[0], 0, rampa(u, 0, 0.2)), mezclar(QUIETO.mira[1], 0, rampa(u, 0, 0.2))];
  m.boca = 0.6 * tira;
  // Se zafa: el labio se le suelta, salta apenas para arriba y abre la boca.
  const zafa = entreT(u, T.zafa);
  if (u >= T.zafa[0]) {
    m.pez = [0, -6 * Math.sin(Math.PI * zafa)];
    m.boca = 1;
  }
  // Cae al agua, cada vez más rápido, girando, y se hunde detrás del canto.
  if (u >= T.cae[0]) {
    const k = entreT(u, T.cae);
    m.pez = [-4 * k, HUNDE * k * k];
    m.giro = 25 * k;
    m.cola += 22 * Math.sin(u * 20);
    // La línea, sin peso, se queda hamacando.
    m.vaiven += 10 * Math.exp(-(u - T.cae[0]) * 1.2) * Math.sin((u - T.cae[0]) * 4.5);
  }
  // El chapuzón, y las ondas que se abren.
  const golpe = entreT(u, [1.15, 2.05]);
  const ondas1 = entreT(u, [1.2, 2.6]);
  // Las burbujas antes de saltar: unas ondas chicas.
  const ondas2 = entreT(u, [2.9, 3.5]);
  // Y el chapuzón de cuando salta.
  const golpe2 = entreT(u, [3.35, 4.1]);
  if (u < 3) {
    m.chapuzon = -4;
    m.salpica = golpe;
    m.salpicaVe = loma(u, 1.15, 1.25, 1.8, 2.05);
    m.ondas = ondas1;
    m.ondasVe = loma(u, 1.2, 1.4, 2.2, 2.6);
  } else {
    m.chapuzon = -18;
    m.salpica = golpe2;
    m.salpicaVe = loma(u, 3.35, 3.45, 3.85, 4.1);
    m.ondas = u < 3.5 ? ondas2 * 0.6 : entreT(u, [3.4, 4.6]);
    m.ondasVe = u < 3.5 ? loma(u, 2.9, 3, 3.3, 3.5) * 0.8 : loma(u, 3.4, 3.6, 4.2, 4.6);
  }
  // Abajo no está: no le chorrea nada. Arriba, la estrella gira sola y brilla.
  m.gotasVe = QUIETO.gotasVe * (1 - rampa(u, 0.9, 1.2) + rampa(u, 4.6, 5.2));
  const sola = loma(u, 1.6, 2.1, 3.3, 3.8);
  m.estrella = mezclar(m.estrella, Math.cos(u * 7), sola);
  m.brillo = Math.max(m.brillo, sola * (0.75 + 0.25 * Math.sin(u * 11)));
  // Salta del agua en un arco, de la izquierda, con la boca abierta, y muerde.
  if (u >= T.salta[0]) {
    const w = entreT(u, T.salta);
    m.pez = [-20 * Math.pow(1 - w, 1.5), HUNDE * (1 - suave(w)) - 10 * Math.sin(Math.PI * w)];
    m.giro = 30 * (1 - w) - 8 * Math.sin(Math.PI * w);
    m.cola += 26 * (1 - w) * Math.sin(u * 20);
    m.boca = rampa(w, 0.4, 0.8);
    m.dorsal += 12 * (1 - w);
  }
  // Muerde: la boca se cierra, la caña cabecea, y se le pone la cara de iluso.
  if (u >= T.muerde[0]) {
    const w = entreT(u, T.muerde);
    m.pez = [0, 0];
    m.giro = TOCADO.giro * w;
    m.boca = 1 - w;
    m.tiron = 6 * Math.sin(Math.PI * w);
    m.vaiven += 4 * Math.sin(Math.PI * w);
  }
  const iluso = rampa(u, T.muerde[0], T.muerde[1] + 0.2);
  if (iluso > 0) {
    m.ensueno = mezclar(0, TOCADO.ensueno, iluso);
    m.rubor = mezclar(0, TOCADO.rubor, iluso);
    m.mira = [mezclar(0, TOCADO.mira[0], iluso), mezclar(0, TOCADO.mira[1], iluso)];
    m.brillo = Math.max(m.brillo, iluso * (0.8 + 0.2 * Math.sin(u * 9)));
    m.dorsal = mezclar(m.dorsal, TOCADO.dorsal, iluso);
  }
  // Una vuelta entera de contento, colgado del labio, meneando la cola.
  if (u >= T.vuelta[0]) {
    const w = entreT(u, T.vuelta);
    m.vuelta = Math.cos(2 * Math.PI * suave(w));
    m.cola += 14 * Math.sin(u * 5) * loma(u, T.vuelta[0], T.vuelta[0] + 0.3, T.vuelta[1], T.vuelve[1]);
    m.pectoral += 16 * Math.sin(u * 7);
  }
  // Y vuelve a lo de siempre.
  const vuelve = rampa(u, T.vuelve[0], T.vuelve[1]);
  if (vuelve > 0) {
    const t0 = { ...m };
    for (const k of ['giro', 'ensueno', 'rubor', 'brillo', 'dorsal', 'cola', 'pectoral'] as const) m[k] = mezclar(t0[k], b[k], vuelve);
    m.mira = [mezclar(t0.mira[0], b.mira[0], vuelve), mezclar(t0.mira[1], b.mira[1], vuelve)];
    m.vuelta = mezclar(t0.vuelta, 1, vuelve);
  }
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al pescado con un azar que se puede fijar (el test lo fija). La isla usa `armarAnzuelo`. */
export function armarAnzueloCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--anzuelo')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { hamaca: 0, vuelta: 0, mira: 0, boquea: 0, sacude: 0, toque: 0 };
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
  let mordidoQuieto = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = (['hamaca', 'vuelta', 'mira', 'boquea', 'sacude'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'toque' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const u = t - desde;
    const de = accion === 'toque' ? momentoDelToque(u, t) : base(t);
    const m: Momento & { mira: [number, number] } = { ...de, mira: [de.mira[0], de.mira[1]] };
    switch (accion) {
      case 'hamaca': {
        // El río lo mece: la línea va y viene más ancho, y la cola acompaña.
        const k = loma(u, 0, 0.6, 2.6, DURA.hamaca);
        m.vaiven += lado * 8 * k * Math.sin(u * 2.2);
        m.cola += 12 * k * Math.sin(u * 2.2 + 1);
        m.mira = [mezclar(m.mira[0], -lado * 1.6 * Math.sin(u * 2.2), k), m.mira[1]];
        break;
      }
      case 'vuelta': {
        // Da una vuelta entera sobre sí mismo, colgado del labio.
        const w = entreT(u, [0.3, 2.5]);
        m.vuelta = Math.cos(2 * Math.PI * suave(w));
        m.cola += 10 * loma(u, 0, 0.3, 2.4, DURA.vuelta) * Math.sin(u * 6);
        m.dorsal -= 8 * loma(u, 0, 0.3, 2.4, DURA.vuelta);
        break;
      }
      case 'mira': {
        // Mira la estrella de lata: entorna los ojos, se pone colorado, suspira y menea la cola despacio.
        const k = loma(u, 0, 0.6, 2.8, DURA.mira);
        m.mira = [mezclar(m.mira[0], TOCADO.mira[0], k), mezclar(m.mira[1], TOCADO.mira[1], k)];
        m.ensueno = mezclar(m.ensueno, 0.8, k);
        m.rubor = mezclar(m.rubor, 1, k);
        m.giro = -6 * k;
        m.cola += 10 * k * Math.sin(u * 3);
        m.brillo = Math.max(m.brillo, 0.7 * k * (0.7 + 0.3 * Math.sin(u * 5)));
        break;
      }
      case 'boquea': {
        // Boquea, resignado, con la mirada para abajo.
        const k = loma(u, 0, 0.4, 2.3, DURA.boquea);
        m.boca = k * (0.5 - 0.5 * Math.cos(u * 8));
        m.ensueno = mezclar(m.ensueno, 0.55, k);
        m.mira = [mezclar(m.mira[0], 0.6, k), mezclar(m.mira[1], 1.2, k)];
        m.rubor = mezclar(m.rubor, 0, k);
        m.pectoral += 12 * k * Math.sin(u * 8);
        break;
      }
      case 'sacude': {
        // Se sacude como para soltarse, con los ojos redondos... y se rinde, con la cola caída.
        const s = loma(u, 0, 0.15, 1, 1.3);
        const r = loma(u, 1.1, 1.5, 2.4, DURA.sacude);
        m.cola += 28 * s * Math.sin(u * 22) - 6 * r;
        m.giro = 8 * s * Math.sin(u * 16);
        m.vaiven += 4 * s * Math.sin(u * 11);
        m.tiron = 2.5 * s * (0.5 + 0.5 * Math.sin(u * 19));
        m.dorsal += 14 * s - 8 * r;
        m.pectoral += 24 * s * Math.sin(u * 25);
        m.ensueno = mezclar(m.ensueno * (1 - s), 0.65, r);
        m.rubor *= 1 - s;
        m.mira = [mezclar(m.mira[0] * (1 - s), 0.2, r), mezclar(m.mira[1] * (1 - s), 1.4, r)];
        break;
      }
    }
    // El pestañeo: un cuarto de segundo, cada tanto.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < 0.24) m.parpado = Math.sin((ojo / 0.24) * Math.PI);
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
      aplicar(mordidoQuieto ? TOCADO : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > 0.24) pestanea = t + entre(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté en el toque. */
  const tocado = (t: number): boolean => {
    if (accion === 'toque') return false;
    empezar('toque', t);
    return true;
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      mordidoQuieto = !mordidoQuieto;
      pintar(t, 0);
      decir();
    } else if (tocado(t)) {
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la punta de la caña, y la página abre la ficha. */
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

export const armarAnzuelo: Armar = (marcos, esc) => armarAnzueloCon(marcos, esc);
