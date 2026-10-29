/**
 * El Alien Duce (`D-73`, vigesimosegunda vuelta), adentro de la pantalla de la tele grande de Cybersiberia.
 *
 * Lo que hace solo es salir en la tele, y nada es un bucle: elige qué hacer cada vez. La bola de efectos gira
 * siempre, despacio, y las lamparitas de las antenas titilan.
 *
 * - **Arenga**: la quijada para arriba, la boca que va y viene, el puño que golpea el aire.
 * - **Prende la bola**: los espejitos agarran la luz y los puntos salen a dar vueltas por la nieve.
 * - **Se corta la señal**: pasa una franja de interferencia, y él sigue como si nada.
 * - **Mueve las antenas**, con las lamparitas a full.
 * - **Mira para los costados**, como buscando quién lo mira.
 *
 * Tocado, **el evangelio** (*"dice desde la TV que no quiere estar jamás en la TV"*, *"va escribiendo su
 * evangelio en los tickets de Carrefour"*, *"chupa y escupe al fin"*): se corta la señal, se aplasta contra
 * el vidrio con las dos manos, gritando; vuelve a su lugar, y por la boca le sale, atravesando la pantalla, un
 * ticket larguísimo que llega a la nieve, con la bola prendida y el puño en alto. Después lo chupa de vuelta,
 * mastica, y lo escupe hecho un bollo, que cae en la nieve. Dice su verso. Con movimiento reducido no se mueve
 * nada: tocarlo lo pasa de quieto al evangelio.
 *
 * Se lleva números (`rig-alien.ts`) y nada que dibuje.
 */

import { EVANGELIO, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-alien.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-alien-duce';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { arenga: 3.2, bola: 3, senal: 1.6, antenas: 2, mira: 2.6, evangelio: 8 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [0.8, 2.6] as const;
export const PRIMERA = [0.5, 1.5] as const;
export const DEMORA_FICHA = 1.8;

/** Los tiempos del evangelio: el vidrio, el ticket, la chupada, la escupida. */
export const EVANGELIO_T = { senal: [0, 0.35], vidrio: [0.2, 0.6, 1.4, 1.9], sale: [2, 3.6], chupa: [4.6, 5.1], mastica: [5.1, 5.5], escupe: [5.6, 6.4] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const tramo = (u: number, a: number, b: number): number => Math.min(1, Math.max(0, (u - a) / (b - a)));

/** La arenga: la boca abre y cierra con las sílabas, de 0 a 1. */
export const silabas = (u: number): number => Math.max(0, Math.sin(u * 11) * 0.6 + Math.sin(u * 4.3) * 0.5);

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al Alien con un azar que se puede fijar (el test lo fija). La isla usa `armarAlien`. */
export function armarAlienCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--alien')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { arenga: 0, bola: 0, senal: 0, antenas: 0, mira: 0, evangelio: 0 };
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
  let evangelioQuieto = false;
  let lado = 1;

  function elegir(): Accion {
    const opciones = (['arenga', 'bola', 'senal', 'antenas', 'mira'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'evangelio' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO };
    // En el aire: la bola gira despacio, las lamparitas titilan y la cabeza se sostiene alta.
    m.bola = t * 12;
    m.lamparas = 0.3 + 0.3 * (Math.sin(t * 5) > 0.6 ? 1 : 0);
    m.hamaca = 1.2 * Math.sin(t * 0.6);
    m.cabeza = QUIETO.cabeza + 1.6 * Math.sin(t * 0.8);
    m.antenas = 3 * Math.sin(t * 1.7);
    const u = t - desde;
    switch (accion) {
      case 'arenga': {
        // La quijada arriba, la boca con las sílabas y el puño que golpea el aire.
        const k = loma(u, 0, 0.3, 2.8, DURA.arenga);
        m.boca = k * silabas(u);
        m.cabeza = mezcla(m.cabeza, -16, k) + 3 * k * Math.sin(u * 4.3);
        m.puno = -26 * k + 14 * k * Math.abs(Math.sin(u * 5.4));
        m.hamaca += 2 * k * Math.sin(u * 2.7);
        break;
      }
      case 'bola': {
        const k = loma(u, 0, 0.4, 2.4, DURA.bola);
        m.puntos = mezcla(QUIETO.puntos, 1, k);
        m.bola += 140 * u * k;
        m.cabeza -= 6 * k;
        break;
      }
      case 'senal': {
        m.ruido = loma(u, 0, 0.1, 1.2, DURA.senal) * (0.6 + 0.4 * Math.sin(u * 40));
        m.franja = tramo(u, 0, DURA.senal);
        m.hamaca += 3 * Math.sin(u * 30) * loma(u, 0, 0.1, 1.2, DURA.senal);
        break;
      }
      case 'antenas': {
        const k = loma(u, 0, 0.3, 1.6, DURA.antenas);
        m.antenas += 18 * k * Math.sin(u * 12);
        m.lamparas = mezcla(m.lamparas, 1, k) * (0.7 + 0.3 * Math.sin(u * 20));
        break;
      }
      case 'mira': {
        const k = loma(u, 0, 0.5, 1.9, DURA.mira);
        m.hamaca += lado * 9 * k;
        m.cabeza += 4 * k;
        break;
      }
      case 'evangelio': {
        const T = EVANGELIO_T;
        // Se corta la señal y se aplasta contra el vidrio, gritando que no quiere estar en la tele.
        const senal = loma(u, T.senal[0], T.senal[0] + 0.05, T.senal[1] - 0.1, T.senal[1]) + loma(u, 1.8, 1.85, 1.95, 2.05);
        m.ruido = Math.min(1, senal) * (0.6 + 0.4 * Math.sin(u * 40));
        m.franja = tramo(u, 0, 2.05) * 2 % 1;
        const vidrio = loma(u, T.vidrio[0], T.vidrio[1], T.vidrio[2], T.vidrio[3]);
        m.acerca = vidrio;
        m.palmas = loma(u, T.vidrio[1] - 0.1, T.vidrio[1], T.vidrio[2], T.vidrio[2] + 0.2);
        m.boca = Math.max(vidrio * (0.6 + 0.4 * silabas(u)), 0);
        // El evangelio: el ticket le sale por la boca y atraviesa la pantalla, con la bola prendida.
        const saca = rampa(u, T.sale[0], T.sale[1]) * (1 - rampa(u, T.chupa[0], T.chupa[1]));
        m.ticket = saca;
        const orgullo = loma(u, T.sale[0], T.sale[0] + 0.3, T.chupa[0], T.chupa[1]);
        m.boca = Math.max(m.boca, orgullo, loma(u, T.escupe[0] - 0.1, T.escupe[0], T.escupe[0] + 0.15, T.escupe[0] + 0.4));
        m.cabeza = mezcla(m.cabeza, EVANGELIO.cabeza, orgullo);
        m.puno = mezcla(0, EVANGELIO.puno, orgullo) + 10 * orgullo * Math.sin(u * 6);
        m.puntos = mezcla(QUIETO.puntos, 1, loma(u, T.sale[0], T.sale[0] + 0.4, 6.6, 7.6));
        m.bola += 200 * u;
        m.lamparas = mezcla(m.lamparas, 1, orgullo);
        m.antenas += 10 * orgullo * Math.sin(u * 9);
        // Mastica lo que chupó, y lo escupe: el bollo vuela a la nieve y queda ahí hasta el final.
        const mastica = loma(u, T.mastica[0], T.mastica[0] + 0.05, T.mastica[1] - 0.05, T.mastica[1]);
        if (mastica > 0) m.boca = 0.35 * mastica * Math.abs(Math.sin(u * 30));
        if (u >= T.escupe[0]) m.bollo = suave(tramo(u, T.escupe[0], T.escupe[1]));
        // Después, arenga un rato con el puño.
        const arenga = loma(u, T.escupe[1], T.escupe[1] + 0.3, DURA.evangelio - 0.6, DURA.evangelio);
        if (arenga > 0) {
          m.boca = Math.max(m.boca, arenga * silabas(u));
          m.puno = -26 * arenga + 14 * arenga * Math.abs(Math.sin(u * 5.4));
        }
        break;
      }
    }
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
      aplicar(evangelioQuieto ? EVANGELIO : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté con el evangelio. */
  const tocado = (t: number): void => {
    if (accion !== 'evangelio') empezar('evangelio', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      evangelioQuieto = !evangelioQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la antena de la tele, y la página abre la ficha. */
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

export const armarAlien: Armar = (marcos, esc) => armarAlienCon(marcos, esc);
