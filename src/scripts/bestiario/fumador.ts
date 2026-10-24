/**
 * El santo fumador (`D-73`, vigésima vuelta), dormido en su anda en el ala izquierda del templo de Momo.
 *
 * Lo que hace solo es lo de un santo en el letargo, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Duerme** parado: respira, la cabeza caída, el hilo de humo que sube del pucho y la ceniza que se
 *   le va alargando sola.
 * - **Pita** dormido: se lleva el pucho a la boca, la brasa se prende, y larga anillos de humo que suben
 *   hacia las guirnaldas.
 * - **Cabecea**: se le cae la cabeza de a poco, se despierta de golpe, abre un ojo, y se vuelve a dormir.
 * - **Le titila la aureola**, como un tubo de galpón que está por quemarse.
 * - **Se le cae la ceniza**, de un golpecito, sobre el anda.
 *
 * Tocado, **sale del letargo y desfila** (*"Santo fumador, de allá de La Plata, salí del letargo, vení a
 * desfilar"*): abre los ojos, la aureola encandila, el anda se levanta como si la cargaran entre varios y
 * se menea al paso de la procesión; él levanta la flor chillona y larga un anillo de humo grande. Después
 * lo bajan, y se vuelve a dormir. Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo
 * pasa de dormido a desfilando.
 *
 * Se lleva números (`rig-fumador.ts`) y nada que dibuje.
 */

import { ANILLOS, DESFILE, FUMADOR, FUMADOR_ARMADO, QUIETO, VERSO, alRecinto, brasaCon, marcas, type Anillo, type Momento } from '../../lib/bestiario/rig-fumador.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-santo-fumador';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { pita: 3.2, cabecea: 2.4, titila: 1.8, ceniza: 1.4, desfile: 5 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.4, 3.4] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.3;

/** Lo que crece la ceniza por segundo, y lo que sube un anillo de humo, en el recinto por segundo. */
export const CRECE_CENIZA = 0.025;
export const SUBE_ANILLO = 24;
/** Lo que gira el brazo del pucho para llevárselo a la boca. */
export const PITA = -50;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  anillos: number;
  ceniza: number;
}

interface Humo {
  x: number;
  y: number;
  edad: number;
  grande: number;
}

/** Arma al santo fumador con un azar que se puede fijar (el test lo fija). La isla usa `armarFumador`. */
export function armarFumadorCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--fumador')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { pita: 0, cabecea: 0, titila: 0, ceniza: 0, desfile: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, anillos: 0, ceniza: 0 }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let desfileQuieto = false;
  let ceniza = QUIETO.ceniza;
  let largados = 0;
  // Los anillos que todavía tiene que largar en esta pitada, y cuándo larga el que sigue.
  let porLargar = 0;
  let proximo = 0;
  const humos: Humo[] = [];
  // La pizca de ceniza que se cae: dónde va, en las del santo, y cuánto lleva.
  let cae: { x: number; y: number; vy: number; edad: number } | null = null;

  function elegir(): Accion {
    // Cuando la ceniza ya está larga, se le cae.
    if (ceniza >= 1 && ultima !== 'ceniza') return 'ceniza';
    const opciones = (['pita', 'cabecea', 'titila'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'desfile' ? ultima : a;
    desde = t;
    hechas[a]++;
    if (a === 'pita') {
      porLargar = 2 + Math.floor(azar() * 2);
      proximo = t + 1.6;
    }
    if (a === 'desfile') {
      porLargar = 1;
      proximo = t + 2.2;
    }
  }

  function largar(m: Momento, grande: number): void {
    const [x, y] = alRecinto([FUMADOR_ARMADO.boca[0] + 6, FUMADOR_ARMADO.boca[1] - 6], m);
    humos.push({ x, y, edad: 0, grande });
    if (humos.length > ANILLOS) humos.shift();
    largados++;
  }

  function soltarCeniza(brazo: number): void {
    const [bx, by] = brasaCon(brazo);
    cae = { x: bx + 8 + ceniza * 6, y: by, vy: 0, edad: 0 };
    ceniza = 0.05;
  }

  function momento(t: number, dt: number): Momento {
    const m: Momento = { ...QUIETO, cae: { ...QUIETO.cae } };
    // Duerme: respira, la cabeza caída, la brasa y el hilo que titilan, el tubo que zumba.
    m.dormita = 1.2 * Math.sin(t * 0.6);
    m.cabeza = QUIETO.cabeza + 2 * Math.sin(t * 0.6 + 0.4);
    m.brasa = 1 + 0.1 * Math.sin(t * 3.1);
    m.hilo = 0.75 + 0.25 * Math.sin(t * 1.7);
    m.aureola = 0.96 + 0.04 * Math.sin(t * 47);
    m.brazos = [1.5 * Math.sin(t * 0.5), 0];
    ceniza = Math.min(1.1, ceniza + CRECE_CENIZA * dt);
    let grande = 1;
    const u = t - desde;
    switch (accion) {
      case 'pita': {
        const k = loma(u, 0.1, 0.8, 1.4, 2);
        m.brazos = [m.brazos[0], mezcla(0, PITA, k)];
        m.brasa = mezcla(m.brasa, 1.9, loma(u, 0.7, 0.9, 1.3, 1.6));
        m.hilo *= 1 - k;
        m.cabeza -= 4 * k;
        break;
      }
      case 'cabecea': {
        // Se le cae la cabeza de a poco, y de golpe se despierta: abre un ojo, y se vuelve a dormir.
        const baja = rampa(u, 0, 1.3) * (1 - rampa(u, 1.3, 1.42));
        m.cabeza += 18 * baja - 6 * loma(u, 1.3, 1.42, 1.6, 2.1);
        m.dormita += 4 * baja - 3 * loma(u, 1.3, 1.4, 1.5, 1.8);
        m.parpados = 1 - 0.65 * loma(u, 1.38, 1.46, 1.7, 2);
        break;
      }
      case 'titila': {
        // El tubo que se corta y vuelve, a los tirones, como en los galpones.
        const corte = [0.1, 0.25, 0.32, 0.6, 0.66, 0.9, 1.15, 1.2].some((a, i, l) => i % 2 === 0 && u >= a && u < l[i + 1]!);
        m.aureola = corte ? 0.05 : 1;
        break;
      }
      case 'ceniza': {
        // Un golpecito con el dedo, y la ceniza se va.
        const k = loma(u, 0.1, 0.25, 0.3, 0.5);
        m.brazos = [m.brazos[0], 8 * k];
        if (!cae && u > 0.25) soltarCeniza(m.brazos[1]);
        break;
      }
      case 'desfile': {
        // Abre los ojos, la aureola encandila, lo cargan y desfila meneándose; larga un anillo grande.
        const despierto = loma(u, 0.1, 0.35, 4.2, 4.8);
        m.parpados = 1 - despierto;
        m.cabeza = mezcla(m.cabeza, DESFILE.cabeza, despierto);
        m.dormita *= 1 - despierto;
        m.aureola = mezcla(m.aureola, DESFILE.aureola, loma(u, 0.2, 0.5, 1.4, 2.2)) + 0.25 * despierto;
        const cargan = loma(u, 0.3, 0.9, 3.8, 4.6);
        const paso = u * 3.4;
        m.alza = DESFILE.alza * cargan + 5 * Math.abs(Math.sin(paso)) * cargan;
        m.meneo = (DESFILE.meneo + 6 * Math.sin(paso)) * cargan;
        m.dx = 10 * Math.sin(paso * 0.5) * cargan;
        m.brazos = [mezcla(m.brazos[0], DESFILE.brazos[0] + 10 * Math.sin(u * 5), loma(u, 0.4, 0.9, 3.6, 4.2)), mezcla(0, PITA, loma(u, 1.2, 1.7, 2, 2.4))];
        m.brasa = mezcla(m.brasa, DESFILE.brasa, despierto);
        m.hilo *= 1 - loma(u, 1.2, 1.6, 2, 2.4);
        grande = 2;
        break;
      }
    }
    // Los anillos: los larga de a uno, y suben hacia las guirnaldas agrandándose hasta deshacerse.
    if (porLargar > 0 && t >= proximo) {
      largar(m, grande);
      porLargar--;
      proximo = t + 0.45;
    }
    for (const h of humos) {
      h.edad += dt;
      h.y -= SUBE_ANILLO * dt;
      h.x += 6 * Math.sin(h.edad * 2) * dt;
    }
    m.anillos = Array.from({ length: ANILLOS }, (_, i): Anillo => {
      const h = humos[i];
      if (!h || h.y < FUMADOR.techoDelHumo) return { x: FUMADOR.x, y: FUMADOR.piso, s: 1, o: 0 };
      const vida = Math.min(1, h.edad / 4);
      return { x: h.x, y: h.y, s: (0.5 + 1.4 * vida) * h.grande, o: 0.85 * (1 - vida) * Math.min(1, h.edad * 6) };
    });
    // La pizca cae hasta la tapa del anda, y se queda un rato.
    if (cae) {
      cae.edad += dt;
      const piso = FUMADOR_ARMADO.anda.y - 3;
      if (cae.y < piso) {
        cae.vy += 260 * dt;
        cae.y = Math.min(piso, cae.y + cae.vy * dt);
      }
      m.cae = { x: cae.x, y: cae.y, o: 1 - rampa(cae.edad, 2.5, 3.2) };
      if (cae.edad > 3.2) cae = null;
    }
    m.ceniza = ceniza;
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
      aplicar(desfileQuieto ? DESFILE : QUIETO);
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
    aplicar(momento(t, Math.min(dt, 0.1)));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté desfilando. */
  const tocado = (t: number): void => {
    if (accion !== 'desfile') empezar('desfile', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      desfileQuieto = !desfileQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la aureola, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, anillos: largados, ceniza }),
  };
}

export const armarFumador: Armar = (marcos, esc) => armarFumadorCon(marcos, esc);
