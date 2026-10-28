/**
 * La piba con la remera de Greenpeace (`D-73`, vigesimotercera vuelta), dormida en la banquina de la ruta.
 *
 * Lo que hace sola es dormir, o hacerse, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Pasa un fierro**: abre un ojo, mira para la ruta y lo cierra de golpe. *"Nunca está cerca de las vías
 *   sin mirar atrás."*
 * - **Se rasca** la cadera, dormida.
 * - **El mosquito**: llega zumbando, se le posa en el aro, ella arruga la cara y lo espanta de un manotazo.
 * - **Se acomoda** en el almohadón, suspira y corre la pierna.
 * - **Corre dormida**, como un perro que sueña: *"se aparta corriendo de mamones, soquetes y fiolos"*.
 * - **Respira**, lento, haga lo que haga.
 *
 * Tocada, **finge que duerme** (*"está dormida o finge que duerme"*): aprieta los ojos fuerte, ronca
 * exagerado con zzz de mentira, espía con un ojo, se da cuenta de que la vieron, levanta la cabeza
 * colorada, mira para atrás, a la ruta, y se vuelve a tirar de golpe con un último zzz. Dice su verso. Con
 * movimiento reducido no se mueve nada: tocarla la pasa de dormida a espiando.
 *
 * Se lleva números (`rig-piba.ts`) y nada que dibuje.
 */

import { ESPANTA, FINGE, QUIETO, VERSO, marcas, posaEn, type Momento } from '../../lib/bestiario/rig-piba.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-piba-de-greenpeace';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { fierro: 2.4, rasca: 2.6, mosquito: 4.4, acomoda: 3.2, suena: 3, finge: 7.2 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.4, 3.6] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.2;
/** Cuánto tarda en respirar una vez, en segundos: lento, de dormida. */
export const RESPIRO = 4.6;

/** Los tiempos del toque: para el test y para la conducta. */
export const FINGE_T = { aprieta: [0, 0.4], ronca: [0.6, 2.7], espia: [2.8, 3.8], vieron: [3.8, 4.8], vuelve: [4.8, 5.3], calma: [5.4, 7.2] } as const;
/** Cuándo sale cada zzz de mentira en el toque, y cuánto tarda en irse. */
export const ZZZ = { salen: [0.8, 1.4, 2], tarda: 1.5, ultimo: 5 } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const subida = (u: number, desde: number, tarda: number): number => {
  const p = (u - desde) / tarda;
  return p <= 0 || p >= 1 ? 0 : p;
};

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la piba con un azar que se puede fijar (el test lo fija). La isla usa `armarPiba`. */
export function armarPibaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--piba')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { fierro: 0, rasca: 0, mosquito: 0, acomoda: 0, suena: 0, finge: 0 };
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
  let fingeQuieta = false;
  /** De qué lado llega el mosquito, y cuánto zumba. */
  let lado = 1;

  function elegir(): Accion {
    const opciones = (['fierro', 'rasca', 'mosquito', 'acomoda', 'suena'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'finge' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO, ojos: [0, 0], zetas: [0, 0, 0], bicho: [...QUIETO.bicho] };
    let ojos: [number, number] = [0, 0];
    let zetas: [number, number, number] = [0, 0, 0];
    // Dormida: respira lento, y la mano de arriba sube y baja con la cadera.
    m.respira = Math.sin((t / RESPIRO) * Math.PI * 2);
    m.antebrazo = 1.5 * m.respira;
    const u = t - desde;
    switch (accion) {
      case 'fierro': {
        // Pasa uno por la ruta: abre un ojo de a poco, lo mira (para arriba, que es la ruta) y lo cierra de golpe.
        const abre = rampa(u, 0.2, 0.8) * (1 - rampa(u, 1.4, 1.48));
        ojos = [0, 0.7 * abre];
        m.mira = abre > 0 ? Math.min(1, (u - 0.5) * 3) : 0;
        m.cabeza = 4 * loma(u, 0.3, 0.8, 1.4, 1.6);
        m.aprieta = 0.55 * loma(u, 1.42, 1.5, 1.8, 2.2);
        break;
      }
      case 'rasca': {
        // Se rasca la cadera sin despertarse, y la boca se le tuerce.
        const k = loma(u, 0, 0.4, 2.1, DURA.rasca);
        m.brazo = -6 * k;
        m.antebrazo += k * (-18 + 12 * Math.sin(u * 19));
        m.boca = 0.25 * loma(u, 0.8, 1, 1.6, 1.9);
        m.cuerpo = 1.2 * k;
        break;
      }
      case 'mosquito': {
        // Llega zumbando, se le posa en el aro, ella arruga la cara, lo espanta y el mosquito se va.
        const [ax, ay] = posaEn(m.cabeza);
        const llega = rampa(u, 0, 1.6);
        const zumba = (1 - llega) * 14;
        const [x0, y0] = [ax + lado * 90, ay - 80];
        if (u < 2.4) {
          m.bicho = [mezclar(x0, ax, llega) + Math.sin(u * 11) * zumba, mezclar(y0, ay, llega) + Math.cos(u * 15) * zumba];
        } else {
          const v = rampa(u, 2.4, 3.8);
          m.bicho = [ax - lado * 110 * v + Math.sin(u * 13) * 6, ay - 120 * v + Math.cos(u * 17) * 6];
        }
        m.vuela = rampa(u, 0, 0.3) * (1 - rampa(u, 3.6, 4));
        m.aprieta = 0.8 * loma(u, 1.7, 1.9, 2.5, 2.9);
        m.cejas = -0.3 * loma(u, 1.7, 1.9, 2.5, 2.9);
        const pega = loma(u, 2, 2.35, 2.6, 3.2);
        m.brazo = ESPANTA[0] * pega;
        m.antebrazo = mezclar(m.antebrazo, ESPANTA[1], pega);
        m.cabeza = -4 * pega;
        break;
      }
      case 'acomoda': {
        // Se hunde en el almohadón, mece el cuerpo, corre la pierna y suspira.
        const k = loma(u, 0, 0.5, 2.6, DURA.acomoda);
        m.cuerpo = 2.6 * k * Math.sin(u * 3.4);
        m.cabeza = -7 * k;
        m.pierna = 8 * loma(u, 0.6, 1.2, 2.4, 3);
        m.pantorrilla = -10 * loma(u, 0.6, 1.2, 2.4, 3);
        m.boca = 0.6 * loma(u, 1.2, 1.5, 1.8, 2.2);
        m.respira = mezclar(m.respira, 1.4, loma(u, 1, 1.4, 1.8, 2.2));
        break;
      }
      case 'suena': {
        // Corre dormida: la pierna de arriba pedalea y la mano se le crispa, como un perro que sueña.
        const k = loma(u, 0, 0.4, 2.4, DURA.suena);
        m.pierna = k * (-6 + 8 * Math.sin(u * 13));
        m.pantorrilla = k * (14 + 15 * Math.sin(u * 13 + 1.4));
        m.antebrazo += k * 8 * Math.sin(u * 17);
        m.boca = k * (Math.sin(u * 21) > 0.4 ? 0.3 : 0);
        m.cejas = -0.4 * k;
        break;
      }
      case 'finge': {
        const T = FINGE_T;
        // Aprieta los ojos fuerte: está dormidísima.
        m.aprieta = rampa(u, T.aprieta[0], T.aprieta[1]) * (1 - rampa(u, T.espia[0] - 0.1, T.espia[0] + 0.1)) + loma(u, T.vuelve[0], T.vuelve[0] + 0.1, T.calma[0], T.calma[0] + 0.5);
        // El ronquido de mentira: la boca grande, el pecho que sube como un fuelle, y los zzz que salen solos.
        const ronca = loma(u, T.ronca[0], T.ronca[0] + 0.3, T.ronca[1] - 0.2, T.ronca[1]);
        const fuelle = Math.sin((u - T.ronca[0]) * 4.6);
        m.boca = ronca * (0.55 + 0.45 * fuelle);
        m.respira = mezclar(m.respira, 1.6 * fuelle, ronca);
        zetas = [subida(u, ZZZ.salen[0], ZZZ.tarda) || subida(u, ZZZ.ultimo, ZZZ.tarda), subida(u, ZZZ.salen[1], ZZZ.tarda), subida(u, ZZZ.salen[2], ZZZ.tarda)];
        // Espía con un ojo, para este lado, con la ceja levantada.
        const espia = loma(u, T.espia[0], T.espia[0] + 0.25, T.vuelve[0], T.vuelve[0] + 0.06);
        const vieron = loma(u, T.vieron[0], T.vieron[0] + 0.15, T.vuelve[0], T.vuelve[0] + 0.06);
        ojos = [vieron, Math.max(0.55 * espia, vieron)];
        m.cejas = 0.6 * espia + 0.4 * vieron;
        m.mira = -1;
        // La vieron: levanta la cabeza colorada, mira para atrás, a la ruta, y vuelve a mirar para acá.
        m.cabeza = 26 * loma(u, T.vieron[0], T.vieron[0] + 0.2, T.vuelve[0], T.vuelve[0] + 0.25);
        if (u > T.vieron[0] + 0.25 && u < T.vieron[0] + 0.65) m.mira = 1;
        m.rubor = rampa(u, T.vieron[0], T.vieron[0] + 0.3) * (1 - rampa(u, T.calma[0], T.calma[1]));
        // Y se vuelve a tirar de golpe, con un último zzz, y se acomoda.
        m.cuerpo = 2 * loma(u, T.vuelve[0], T.vuelve[0] + 0.15, T.vuelve[1], T.vuelve[1] + 0.4);
        break;
      }
    }
    m.ojos = ojos;
    m.zetas = zetas;
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
      aplicar(fingeQuieta ? FINGE : QUIETO);
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

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté fingiendo. */
  const tocada = (t: number): void => {
    if (accion !== 'finge') empezar('finge', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      fingeQuieta = !fingeQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocada(t);
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
      if (!esc.quieto()) tocada(t);
      return true;
    },
    estado: () => ({ accion, hechas: { ...hechas } }),
  };
}

export const armarPiba: Armar = (marcos, esc) => armarPibaCon(marcos, esc);
