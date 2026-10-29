/**
 * El chivato (`D-73`, vigesimotercera vuelta), con la oreja pegada a la reja de la celda del reo.
 *
 * Lo que hace solo es buchonear, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Escucha**: se pega más a la reja, entorna los ojos, mira para la celda y le tiembla la oreja.
 * - **Anota**: saca el lápiz de atrás de la oreja, escribe en la libretita mirándola y lo vuelve a guardar.
 * - **Mastica**: se lleva la libreta a la boca y se come la punta de una hoja, de costado, como buen chivo.
 * - **Se hace el distraído**: se despega, mira para arriba como si silbara y zapatea con la pezuña.
 * - **Respira y pestañea**, cada tanto, haga lo que haga.
 *
 * Tocado, **canta** (*"penas del corazón que duran siempre menos que las de prisión, chivato"*): se
 * sobresalta, bala la delación como un murguero —la boca abierta, la libreta en alto, la patada—, se le
 * vuela la hoja con la lista y cae adentro de la celda del reo; lo descubren y se encoge en la levita, con
 * la galera sobre los ojos y la gota de sudor; mira de reojo para los dos lados y vuelve a pegar la oreja.
 * Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de espiar a cantar.
 *
 * Se lleva números (`rig-chivato.ts`) y nada que dibuje.
 */

import { ALZA, A_LA_OREJA, CANTA, ESCRIBE, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-chivato.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-chivato';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { escucha: 3, anota: 3.8, mastica: 3.4, distraido: 3.2, canta: 7.2 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.2, 4.6] as const;

/** Los tiempos del canto, para el test y para la conducta. */
export const CANTA_T = { salta: [0, 0.5], canta: [0.5, 2.7], vuela: [2.3, 4.3], encoge: [3.6, 5.3], mira: [4.4, 5.6], vuelve: [5.7, 7] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al chivato con un azar que se puede fijar (el test lo fija). La isla usa `armarChivato`. */
export function armarChivatoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--chivato')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { escucha: 0, anota: 0, mastica: 0, distraido: 0, canta: 0 };
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
  let cantaQuieto = false;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = (['escucha', 'anota', 'mastica', 'distraido'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'canta' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO, brazos: [...QUIETO.brazos], piernas: [...QUIETO.piernas], orejas: [...QUIETO.orejas], mira: [...QUIETO.mira] };
    // Quieto contra la reja: respira, los faldones se mecen apenas y la oreja de afuera tiembla sola.
    m.encoge = 0.05 + 0.05 * Math.sin(t * 1.7);
    m.faldon = 2 * Math.sin(t * 1.1);
    m.orejas = [m.orejas[0], 4 * Math.max(0, Math.sin(t * 0.7) ** 12) * Math.sin(t * 40)];
    // El pestañeo: un cuarto de segundo, cada tanto.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < 0.24) m.parpado = Math.sin((ojo / 0.24) * Math.PI);
    const u = t - desde;
    switch (accion) {
      case 'escucha': {
        // Se aprieta contra la reja: más inclinado, los ojos entornados y para la celda, la oreja que tiembla.
        const k = loma(u, 0, 0.5, 2.4, DURA.escucha);
        m.inclina -= 6 * k;
        m.cabeza -= 8 * k;
        m.mira = [mezclar(m.mira[0], -1, loma(u, 0.4, 0.8, 1.6, 2)), m.mira[1]];
        m.parpado = Math.max(m.parpado, 0.45 * k);
        m.orejas = [m.orejas[0] + 5 * k * Math.sin(u * 34) * loma(u, 1, 1.2, 1.6, 1.8), m.orejas[1] - 10 * k];
        break;
      }
      case 'anota': {
        // El lápiz de la oreja a la mano, escribe mirando la libreta, y de vuelta a la oreja.
        const sube = rampa(u, 0, 0.6) * (1 - rampa(u, 0.6, 1.1));
        const escribe = rampa(u, 0.6, 1.1) * (1 - rampa(u, 2.5, 2.9));
        const guarda = rampa(u, 2.5, 2.9) * (1 - rampa(u, 2.9, 3.6));
        m.brazos = [8 * escribe, A_LA_OREJA * (sube + guarda) + (ESCRIBE + 3 * Math.sin(u * 30)) * escribe];
        m.lapiz = u > 0.6 && u < 2.9 ? 1 : 0;
        m.cabeza = mezclar(m.cabeza, -2, loma(u, 0, 0.4, 3.2, DURA.anota));
        m.mira = [mezclar(m.mira[0], -0.6, escribe), mezclar(m.mira[1], 1, escribe)];
        m.orejas = [m.orejas[0], m.orejas[1] - 12 * (sube + guarda)];
        break;
      }
      case 'mastica': {
        // Se lleva la libreta a la boca, arranca la punta de una hoja y la mastica de costado.
        const lleva = loma(u, 0, 0.5, 1, 1.4);
        const come = loma(u, 0.9, 1.1, 2.9, DURA.mastica);
        m.brazos = [-76 * lleva, m.brazos[1]];
        m.cabeza = mezclar(m.cabeza, -4, loma(u, 0, 0.5, 2.8, DURA.mastica)) - 6 * lleva;
        m.hunde = 0.25 * lleva;
        m.bocado = come;
        m.mastica = come * Math.sin(u * 16);
        m.abre = come * (0.25 + 0.25 * Math.sin(u * 32));
        m.parpado = Math.max(m.parpado, 0.6 * come);
        m.mira = [mezclar(m.mira[0], 0, come), m.mira[1]];
        break;
      }
      case 'distraido': {
        // Se despega de la reja, mira para arriba como si silbara y zapatea.
        const k = loma(u, 0, 0.5, 2.6, DURA.distraido);
        m.inclina = mezclar(m.inclina, 4, k);
        m.cabeza = mezclar(m.cabeza, 8, k);
        m.mira = [mezclar(m.mira[0], 0.4, k), mezclar(m.mira[1], -1, k)];
        m.abre = 0.15 * k;
        m.boca = 0.35 * k;
        m.piernas = [0, -10 * k * Math.max(0, Math.sin(u * 9))];
        m.ladeo = mezclar(m.ladeo, -4, k);
        m.orejas = [m.orejas[0] - 10 * k, m.orejas[1]];
        break;
      }
      case 'canta': {
        const T = CANTA_T;
        // El sobresalto: se despega, abre los ojos, para las orejas y le salta la galera.
        const salta = loma(u, T.salta[0], 0.15, T.vuelve[0], T.vuelve[1]);
        m.asombro = loma(u, 0, 0.15, T.canta[1], T.encoge[0] + 0.2);
        m.salto = -8 * loma(u, 0, 0.12, 0.25, 0.45);
        // Canta de murguero: la boca abierta, la libreta en alto, la patada y el balido.
        const canta = loma(u, T.canta[0], T.canta[0] + 0.3, T.canta[1] - 0.2, T.canta[1]);
        const pulso = Math.sin(u * 9);
        m.inclina = mezclar(m.inclina, CANTA.inclina, salta);
        m.cabeza = mezclar(m.cabeza, CANTA.cabeza + 6 * pulso * canta, salta);
        m.abre = canta * (0.7 + 0.3 * Math.abs(pulso));
        m.boca = canta;
        m.balido = canta * (0.6 + 0.4 * Math.abs(Math.sin(u * 14)));
        m.orejas = [mezclar(m.orejas[0], CANTA.orejas[0], salta), mezclar(m.orejas[1], CANTA.orejas[1], salta)];
        m.mira = [mezclar(m.mira[0], CANTA.mira[0], canta), mezclar(m.mira[1], CANTA.mira[1], canta)];
        m.ladeo = mezclar(m.ladeo, CANTA.ladeo, salta);
        const alza = loma(u, T.canta[0], T.canta[0] + 0.4, T.vuela[0] + 0.3, T.encoge[0] + 0.1);
        m.brazos = [ALZA * alza + 10 * pulso * canta, CANTA.brazos[1] * canta + 14 * Math.sin(u * 9 + 1.5) * canta];
        // La patada de murga: una pierna y la otra, al compás.
        m.piernas = [22 * canta * Math.max(0, Math.sin(u * 4.5 + Math.PI)), -26 * canta * Math.max(0, Math.sin(u * 4.5))];
        m.encoge = m.encoge * (1 - canta) + 0.08 * canta * Math.abs(Math.sin(u * 9));
        m.faldon = 16 * canta * Math.sin(u * 9);
        // Se le vuela la hoja de la lista y cae adentro de la celda.
        if (u >= T.vuela[0] && u < T.vuela[1]) m.hoja = (u - T.vuela[0]) / (T.vuela[1] - T.vuela[0]);
        // Lo descubren: se encoge en la levita, la galera sobre los ojos, las orejas gachas, la gota.
        const encoge = loma(u, T.encoge[0], T.encoge[0] + 0.3, T.encoge[1], T.vuelve[1] - 0.3);
        m.encoge = Math.max(m.encoge, encoge);
        m.hunde = encoge;
        m.galera = encoge * loma(u, T.encoge[0], T.encoge[0] + 0.3, T.mira[1] - 0.1, T.vuelve[0] + 0.4);
        m.gota = encoge;
        m.orejas = [m.orejas[0] + 26 * encoge, m.orejas[1] - 26 * encoge];
        m.brazos = [m.brazos[0] - 30 * encoge, m.brazos[1]];
        // De reojo, para un lado y para el otro.
        const mira = loma(u, T.mira[0], T.mira[0] + 0.1, T.mira[1] - 0.1, T.mira[1]);
        if (mira > 0) m.mira = [mezclar(m.mira[0], Math.sign(Math.sin(u * 7)), mira), 0.2];
        // Y vuelve a pegar la oreja.
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
      aplicar(cantaQuieto ? CANTA : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté cantando. */
  const tocado = (t: number): void => {
    if (accion !== 'canta') empezar('canta', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      cantaQuieto = !cantaQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la galera, y la página abre la ficha. */
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

export const armarChivato: Armar = (marcos, esc) => armarChivatoCon(marcos, esc);
