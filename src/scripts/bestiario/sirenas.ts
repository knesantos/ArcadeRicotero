/**
 * Las sirenas (`D-73`, vigesimosegunda vuelta), en el agua del bajo, del lado que da al fuego.
 *
 * Lo que hacen solas es flotar, cada una a su ritmo, y nada es un bucle: eligen qué hacer cada vez.
 *
 * - **Tararean**: abren la boca apenas, y sale un canto corto para el lado del fuego.
 * - **La gata se lava**: se pasa la mano por la oreja, como una gata.
 * - **La llena le saca el agua al botín**: lo levanta y lo sacude.
 * - **Colean**: una saca la cola del agua, lejos, y la vuelve a meter.
 *
 * Tocadas, **cantan** (*"gatas lindas, sirenas llenas, reclamando el botín para la prisión"*): suben, le cantan
 * a Luzbelito, que no se da vuelta, con el prendedor radioactivo prendido y el botín en alto; golpean el agua
 * con la cola, se zambullen, y salen otra vez. Dicen su verso. Con movimiento reducido no se mueve nada:
 * tocarlas las pasa de asomadas a cantando.
 *
 * Se llevan números (`rig-sirenas.ts`) y nada que dibuje.
 */

import { CANTAN, HONDO, QUIETO, VERSO, marcas, type Momento, type Par } from '../../lib/bestiario/rig-sirenas.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'las-sirenas';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { tararean: 2.6, lava: 2.4, botin: 2.4, colean: 2.2, cantan: 6.4 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1, 3] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.4;

/** Los tiempos del canto: cuándo suben, cuándo golpean, cuándo se zambullen y cuándo vuelven. */
export const CANTAN_T = { suben: [0, 0.5], cantan: [0.4, 2.9], golpean: [2.8, 3.4], hunden: [3.4, 3.9], abajo: [3.9, 5.2], salen: [5.2, 6] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const par = (a: number, b: number): Par => [a, b];

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a las sirenas con un azar que se puede fijar (el test lo fija). La isla usa `armarSirenas`. */
export function armarSirenasCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--sirenas')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { tararean: 0, lava: 0, botin: 0, colean: 0, cantan: 0 };
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
  let cantanQuieto = false;
  let cual: 0 | 1 = 0;

  function elegir(): Accion {
    const opciones = (['tararean', 'lava', 'botin', 'colean'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'cantan' ? ultima : a;
    desde = t;
    hechas[a]++;
    cual = azar() < 0.5 ? 0 : 1;
  }

  function momento(t: number): Momento {
    // Flotan: cada una sube y baja a su ritmo, y se mece con el agua.
    let alto: [number, number] = [3 * Math.sin(t * 1.3), 3 * Math.sin(t * 1.1 + 2)];
    let mece: [number, number] = [2 * Math.sin(t * 0.8), 2 * Math.sin(t * 0.7 + 1)];
    let cabeza: [number, number] = [QUIETO.cabeza[0] + 3 * Math.sin(t * 0.6), QUIETO.cabeza[1] + 3 * Math.sin(t * 0.5 + 1)];
    let brazo: [number, number] = [QUIETO.brazo[0] + 4 * Math.sin(t * 0.9), QUIETO.brazo[1] + 5 * Math.sin(t * 0.8)];
    let boca: [number, number] = [0, 0];
    let cola: [number, number] = [0, 0];
    let coleo: [number, number] = [0, 0];
    let salpica: [number, number] = [0, 0];
    let canto = 0;
    let radio = QUIETO.radio + 0.2 * Math.sin(t * 2.4);
    const ondas: [number, number] = [0.4 + 0.2 * Math.sin(t * 1.3), 0.4 + 0.2 * Math.sin(t * 1.1 + 2)];
    const u = t - desde;
    switch (accion) {
      case 'tararean': {
        const k = loma(u, 0, 0.4, 2, DURA.tararean);
        boca = [0.5 * k, 0.4 * k];
        canto = k > 0 ? Math.min(0.9, u / DURA.tararean) : 0;
        cabeza = [cabeza[0] - 8 * k, cabeza[1] - 6 * k];
        break;
      }
      case 'lava': {
        // La gata se lleva la mano a la oreja y se la pasa, como una gata.
        const k = loma(u, 0, 0.5, 1.8, DURA.lava);
        brazo = [mezcla(brazo[0], 150, k) + 14 * k * Math.sin(u * 12), brazo[1]];
        cabeza = [cabeza[0] - 14 * k, cabeza[1]];
        break;
      }
      case 'botin': {
        // La llena levanta el botín y lo sacude, a ver si le sale el agua.
        const k = loma(u, 0, 0.5, 1.8, DURA.botin);
        brazo = [brazo[0], mezcla(brazo[1], -120, k) + 16 * k * Math.sin(u * 16)];
        cabeza = [cabeza[0], cabeza[1] - 10 * k];
        break;
      }
      case 'colean': {
        const k = loma(u, 0, 0.6, 1.4, DURA.colean);
        const c = cual;
        cola = c === 0 ? [k, 0] : [0, k];
        coleo = c === 0 ? [20 * Math.sin(u * 4) * k, 0] : [0, 20 * Math.sin(u * 4) * k];
        const s = loma(u, 1.3, 1.45, 1.6, 2.1);
        salpica = c === 0 ? [s, 0] : [0, s];
        break;
      }
      case 'cantan': {
        const T = CANTAN_T;
        const sube = loma(u, T.suben[0], T.suben[1], T.hunden[0], T.hunden[1]);
        const canta = loma(u, T.cantan[0], T.cantan[0] + 0.3, T.cantan[1] - 0.3, T.cantan[1]);
        alto = [mezcla(alto[0], CANTAN.alto[0], sube), mezcla(alto[1], CANTAN.alto[1], sube)];
        cabeza = [mezcla(cabeza[0], CANTAN.cabeza[0], canta), mezcla(cabeza[1], CANTAN.cabeza[1], canta)];
        brazo = [mezcla(brazo[0], CANTAN.brazo[0], canta), mezcla(brazo[1], CANTAN.brazo[1], canta) + 10 * canta * Math.sin(u * 5)];
        boca = [canta * (0.8 + 0.2 * Math.sin(u * 9)), canta * (0.8 + 0.2 * Math.sin(u * 7 + 1))];
        mece = [mece[0] + 6 * canta * Math.sin(u * 2.5), mece[1] + 6 * canta * Math.sin(u * 2.5 + 0.8)];
        canto = canta > 0 ? ((u - T.cantan[0]) * 0.9) % 1 : 0;
        radio = mezcla(radio, 1, canta) * (0.85 + 0.15 * Math.sin(u * 14));
        // Golpean el agua con la cola, las dos a la vez.
        const golpe = loma(u, T.golpean[0], T.golpean[0] + 0.2, T.golpean[1] - 0.1, T.golpean[1]);
        cola = [golpe, golpe];
        coleo = [40 * golpe * Math.sin((u - T.golpean[0]) * 9), -40 * golpe * Math.sin((u - T.golpean[0]) * 9)];
        const s = loma(u, T.golpean[1] - 0.15, T.golpean[1], T.golpean[1] + 0.2, T.golpean[1] + 0.6);
        // Se zambullen, abajo colean una vez cada una, y salen.
        const hunde = rampa(u, T.hunden[0], T.hunden[1]) * (1 - rampa(u, T.salen[0], T.salen[1]));
        alto = [mezcla(alto[0], HONDO, hunde), mezcla(alto[1], HONDO, hunde)];
        const abajo = loma(u, T.abajo[0], T.abajo[0] + 0.3, T.abajo[1] - 0.4, T.abajo[1]);
        cola = [Math.max(cola[0], abajo * 0.7), Math.max(cola[1], loma(u, T.abajo[0] + 0.4, T.abajo[0] + 0.7, T.abajo[1], T.abajo[1] + 0.2) * 0.7)];
        const zambulle = loma(u, T.hunden[0] + 0.1, T.hunden[0] + 0.3, T.hunden[0] + 0.4, T.hunden[1] + 0.4);
        const vuelven = loma(u, T.salen[0], T.salen[0] + 0.2, T.salen[0] + 0.3, T.salen[1] + 0.2);
        salpica = [Math.max(s, zambulle, vuelven * 0.6), Math.max(s, zambulle, vuelven * 0.6)];
        ondas[0] = Math.max(ondas[0], sube, zambulle, vuelven);
        ondas[1] = Math.max(ondas[1], sube * 0.8, zambulle, vuelven);
        break;
      }
    }
    return { alto: par(...alto), mece: par(...mece), cabeza: par(...cabeza), brazo: par(...brazo), boca: par(...boca), cola: par(...cola), coleo: par(...coleo), salpica: par(...salpica), canto, radio, ondas: par(...ondas) };
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) if (!nombre.startsWith('entera-')) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(cantanQuieto ? CANTAN : QUIETO);
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

  /** Tocadas: lo que estén haciendo lo dejan, salvo que ya estén cantando. */
  const tocado = (t: number): void => {
    if (accion !== 'cantan') empezar('cantan', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      cantanQuieto = !cantanQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dicen su verso arriba de las dos, y la página abre la ficha. */
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

export const armarSirenas: Armar = (marcos, esc) => armarSirenasCon(marcos, esc);
