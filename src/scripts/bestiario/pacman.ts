/**
 * El pac-man (`D-73`, decimoséptima vuelta), en su fila de puntos de la nieve de Cybersiberia.
 *
 * Lo que hace solo es lo del fichín, y nada es un bucle: es una partida que se juega sola.
 *
 * - **Come la fila**, de punta a punta, con la boca que se abre y se cierra a cada paso. Cuando la deja
 *   limpia, los puntos vuelven a aparecer, como en el nivel que sigue.
 * - **Lo persigue un fantasma**, que aparece por la punta que le queda más lejos. Si el fantasma le
 *   viene de frente, el pac-man pega la vuelta; si lo arrincona en una punta, lo agarra, y el pac-man se
 *   muere como se muere en el fichín: la boca se le abre hasta que no queda nada, y una chispa. Al rato
 *   vuelve a aparecer en la punta de la derecha. *"Nuestro pac-man no es de nadie"*: tampoco del que lo
 *   mira.
 * - **La pastilla de poder**, en la punta de la izquierda: si la come, el fantasma se pone azul, huye, y
 *   el pac-man lo persigue y se lo come. Sale el 200, y los ojos del fantasma vuelven solos a su casa.
 *
 * Tocado, **es el verso hecho gesto** (*"todo el hambre del nuevo pac-man"*): le da el poder sin
 *  pastilla, y si no había fantasma, aparece uno, ya azul, para que se lo coma. Dice su verso. Con
 * movimiento reducido no se mueve nada: tocarlo lo pasa del principio de la fila al hambre.
 *
 * Se lleva números (`rig-pacman.ts`) y nada que dibuje.
 */

import { HAMBRE, PASILLO, PUNTOS, QUIETA, VERSO, marcas, type ModoFantasma, type Momento } from '../../lib/bestiario/rig-pacman.ts';
import { partes } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-pac-man';

/** Las velocidades, en unidades del recinto por segundo. */
export const VELOCIDAD = { pac: 58, poder: 72, fantasma: 50, asustado: 32, ojos: 160 } as const;

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  primerFantasma: [4, 7],
  fantasma: [3, 7],
  pastilla: [12, 18],
} as const;

/** Cuánto duran las cosas. */
export const DURA = { poder: 6.5, titila: 1.6, muere: 2.6, come: 0.5, puntaje: 1.1, nivel: 1.4 } as const;

/** Lo que tienen que estar de cerca para comerse (o para que lo agarren), y de lejos el fantasma para que huya. */
export const DISTANCIA = { come: 5, choca: 12, huye: 64 } as const;

/** La casa de los ojos del fantasma: afuera del pasillo, a la derecha. */
export const CASA = PASILLO.hasta + 34;

/** Cuánto espera para abrir la ficha después del toque: que se vea el fantasma ponerse azul. */
export const DEMORA_FICHA = 1.1;

export interface Estado {
  x: number;
  dir: 1 | -1;
  viva: boolean;
  modo: ModoFantasma;
  comidos: number;
  fantasmas: number;
  muertes: number;
  niveles: number;
  poder: boolean;
}

/** Arma al pac-man con un azar que se puede fijar (el test lo fija). La isla usa `armarPacman`. */
export function armarPacmanCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--pacman')).find((x): x is SVGGElement => !!x);
  const vacio: Estado = { x: 0, dir: -1, viva: true, modo: 'fuera', comidos: 0, fantasmas: 0, muertes: 0, niveles: 0, poder: false };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => vacio };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let hablarEn: number | null = null;
  let hambreQuieto = false;
  // El pac-man.
  let x = QUIETA.pac.x;
  let dir: 1 | -1 = QUIETA.pac.dir;
  let viva = true;
  let muereDesde = -100;
  let andado = 0;
  let pausaHasta = 0;
  let poderHasta = -100;
  let poderAlNacer = false;
  // El fantasma.
  let fx = QUIETA.fantasma.x;
  let fdir: 1 | -1 = 1;
  let modo: ModoFantasma = 'fuera';
  let vuelveEn = entre(TIEMPOS.primerFantasma);
  // La fila.
  const puntos = PUNTOS.map(() => true);
  let reponeEn: number | null = null;
  let pastilla = true;
  let pastillaVuelve = 0;
  let puntaje = { x: 0, hasta: -100 };
  // Lo que cuenta el test.
  let comidos = 0;
  let fantasmas = 0;
  let muertes = 0;
  let niveles = 0;

  const conPoder = (t: number): boolean => t < poderHasta;

  /** El fantasma aparece por la punta que le queda más lejos al pac-man. */
  function apareceFantasma(asustado: boolean): void {
    const izquierda = x - PASILLO.desde > PASILLO.hasta - x;
    fx = izquierda ? PASILLO.desde - 8 : PASILLO.hasta + 8;
    fdir = izquierda ? 1 : -1;
    modo = asustado ? 'asustado' : 'persigue';
  }

  function paso(t: number, dt: number): void {
    if (t < pausaHasta) return;

    // Muerto: la animación, y al rato vuelve a aparecer en la punta de la derecha.
    if (!viva) {
      if (t - muereDesde >= DURA.muere) {
        viva = true;
        x = QUIETA.pac.x;
        dir = -1;
        if (poderAlNacer) {
          poderAlNacer = false;
          poderHasta = t + DURA.poder;
        }
      }
    } else {
      // Con poder, va detrás del fantasma azul; sin poder, le huye si lo tiene de frente y cerca.
      const fantasmaVivo = modo === 'persigue' || modo === 'asustado' || modo === 'titila';
      if (fantasmaVivo && conPoder(t) && modo !== 'persigue') dir = (Math.sign(fx - x) || dir) as 1 | -1;
      else if (modo === 'persigue' && Math.sign(fx - x) === dir && Math.abs(fx - x) < DISTANCIA.huye) dir = (-dir) as 1 | -1;
      const v = conPoder(t) ? VELOCIDAD.poder : VELOCIDAD.pac;
      x += dir * v * dt;
      if (x <= PASILLO.desde) [x, dir] = [PASILLO.desde, 1];
      if (x >= PASILLO.hasta) [x, dir] = [PASILLO.hasta, -1];
      andado += v * dt;
      // Come lo que tiene adelante.
      PUNTOS.forEach((px, i) => {
        if (puntos[i] && Math.abs(px - x) < DISTANCIA.come) {
          puntos[i] = false;
          comidos++;
        }
      });
      if (pastilla && Math.abs(PASILLO.pastilla - x) < DISTANCIA.come + 4) {
        pastilla = false;
        pastillaVuelve = t + entre(TIEMPOS.pastilla);
        poderHasta = t + DURA.poder;
        if (modo === 'persigue') modo = 'asustado';
      }
    }

    // La fila limpia: el nivel que sigue.
    if (reponeEn === null && puntos.every((s) => !s)) reponeEn = t + DURA.nivel;
    if (reponeEn !== null && t >= reponeEn) {
      puntos.fill(true);
      reponeEn = null;
      niveles++;
    }
    if (!pastilla && t >= pastillaVuelve) pastilla = true;

    // El fantasma.
    if (modo === 'fuera') {
      if (t >= vuelveEn && viva) apareceFantasma(conPoder(t));
    } else if (modo === 'ojos') {
      fdir = (Math.sign(CASA - fx) || 1) as 1 | -1;
      fx = Math.min(CASA, fx + VELOCIDAD.ojos * dt * fdir);
      if (Math.abs(CASA - fx) < 1) {
        modo = 'fuera';
        vuelveEn = t + entre(TIEMPOS.fantasma);
      }
    } else {
      if (modo === 'persigue') {
        if (conPoder(t)) modo = 'asustado';
      } else if (!conPoder(t)) modo = 'persigue';
      else modo = poderHasta - t < DURA.titila && Math.floor(t / 0.2) % 2 ? 'titila' : 'asustado';
      const huye = modo !== 'persigue';
      fdir = ((Math.sign(x - fx) || 1) * (huye ? -1 : 1)) as 1 | -1;
      fx += fdir * (huye ? VELOCIDAD.asustado : VELOCIDAD.fantasma) * dt;
      fx = Math.min(PASILLO.hasta + 10, Math.max(PASILLO.desde - 10, fx));
      // Se encuentran.
      if (viva && Math.abs(fx - x) < DISTANCIA.choca) {
        if (huye) {
          modo = 'ojos';
          fantasmas++;
          puntaje = { x: fx, hasta: t + DURA.puntaje };
          pausaHasta = t + DURA.come;
        } else {
          viva = false;
          muereDesde = t;
          muertes++;
          modo = 'fuera';
          vuelveEn = t + DURA.muere + entre(TIEMPOS.fantasma);
        }
      }
    }
  }

  function momento(t: number): Momento {
    const muere = viva ? 0 : (() => {
      const u = t - muereDesde;
      if (u < 0.25) return 0;
      if (u < 1.35) return 1 + Math.min(5, Math.floor((u - 0.25) / 0.18));
      if (u < 1.7) return 7;
      return -1;
    })();
    const ciclo = [0, 1, 2, 1] as const;
    return {
      pac: { x, dir, boca: muere === 0 && !viva ? 1 : ciclo[Math.floor(andado / 5) % 4]!, muere: Math.max(0, muere), visible: muere !== -1 },
      fantasma: { x: fx, dir: fdir, modo, falda: (Math.floor(t / 0.14) % 2) as 0 | 1 },
      puntos: [...puntos],
      pastilla: pastilla && (!conPoder(t) ? Math.floor(t / 0.25) % 2 === 0 : true),
      puntaje: { x: puntaje.x, o: t < puntaje.hasta ? 1 : 0 },
    };
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(hambreQuieto ? HAMBRE : QUIETA);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETA);
      return;
    }
    paso(t, Math.min(dt, 0.1));
    aplicar(momento(t));
  }

  /** El hambre: el poder sin pastilla, y un fantasma azul para comerse si no había. */
  const tocado = (t: number): void => {
    if (!viva) {
      poderAlNacer = true;
      return;
    }
    poderHasta = t + DURA.poder;
    if (modo === 'fuera') apareceFantasma(true);
    else if (modo === 'persigue' || modo === 'titila') modo = 'asustado';
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      hambreQuieto = !hambreQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de donde esté comiendo, y la página abre la ficha. */
  const decir = (): void => esc.hablar(ID, (esc.quieto() ? (hambreQuieto ? HAMBRE : QUIETA).pac.x : x) + VERSO[0], VERSO[1]);
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
    estado: () => ({ x, dir, viva, modo, comidos, fantasmas, muertes, niveles, poder: conPoder(esc.reloj()) }),
  };
}

export const armarPacman: Armar = (marcos, esc) => armarPacmanCon(marcos, esc);
