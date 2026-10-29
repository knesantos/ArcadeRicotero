/**
 * La anguila (`D-73`, vigesimotercera vuelta), medio hundida en el barro del rincón del bajo.
 *
 * Lo que hace sola es ahogarse despacio, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Boquea**: saca la cabeza y abre y cierra la boca, con la agalla a toda máquina, buscando aire.
 * - **Se retuerce**: la onda se le agranda y se le apura, y el lomo asoma y se hunde a los tirones.
 * - **Se hunde y asoma**: el barro se la traga hasta el ojo, y vuelve a salir.
 * - **Se le pega el barro**: sale con un pegote en la cabeza, sacude la cabeza y el pegote se resbala y cae.
 * - Siempre: la onda viaja de la cabeza a la cola, la agalla late, la pupila no para quieta, el barro hace
 *   burbujas que crecen lentas y revientan, y el fuego le tiembla en el barro.
 *
 * Tocada, **se desespera** (*"un barro que asfixia esa anguila"*): se retuerce y boquea, salta afuera del
 * barro en un arco que chorrea, entra de cabeza más allá y se pierde; asoma de vuelta en su lugar, boqueando,
 * se le escapa la burbuja grande del último aire, que sube y revienta, y el barro se la traga despacio hasta
 * que vuelve a asomar como estaba. Dice su verso. Con movimiento reducido no se mueve nada: tocarla la pasa
 * de quieta al salto.
 *
 * Se lleva números (`rig-anguila.ts`) y nada que dibuje.
 */

import { QUIETO, TOCADA, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-anguila.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-anguila';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { boquea: 2.6, retuerce: 3, hunde: 3.4, pegote: 3.2, desespera: 7.6 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1, 2.8] as const;
export const PRIMERA = [0.6, 1.6] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto le salta la pupila a otro lado, en segundos. */
export const MIRA = [0.6, 1.8] as const;
/** Cuánto tarda en crecer una burbuja del barro, y cuánto espera la siguiente. */
export const BURBUJEA = [1.4, 2.8] as const;
export const ENTRE_BURBUJAS = [0.4, 2.2] as const;
const REVIENTA = 0.35;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE = { desespera: [0, 1.4], salta: [1.4, 3], perdida: [3, 3.5], asoma: [3.5, 4.1], globo: [4.1, 5.1], plop: [5.1, 5.45], traga: [5.3, 6.6], vuelve: [6.6, 7.6] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/**
 * El toque, a los `u` segundos de tocarla, encima de un momento de base (la onda y lo que ya estaba
 * haciendo). La conducta lo usa en cada cuadro y la hoja de poses para mirarlo.
 */
export function momentoDelToque(u: number, base: Momento = QUIETO): Momento {
  const T = TOQUE;
  const m: Momento = { ...base, burbujas: [...base.burbujas], revienta: [...base.revienta], salpica: [0, 0], mira: [...base.mira] };
  // Se desespera: la onda se agranda y se apura, boquea rápido, la agalla a full y la pupila clavada arriba.
  const des = loma(u, 0, 0.3, T.desespera[1] - 0.2, T.desespera[1] + 0.1);
  m.amp = mezclar(base.amp, 42, des);
  m.onda = base.onda + 9 * u * des;
  m.boca = Math.max(m.boca, des * (0.5 + 0.5 * Math.sin(u * 16)));
  m.agalla = Math.max(m.agalla, des * (0.6 + 0.4 * Math.sin(u * 20)));
  m.cabeza = base.cabeza + 18 * des;
  m.alto = base.alto + 6 * des;
  m.aleta = -30 * des * (0.5 + 0.5 * Math.sin(u * 24));
  if (des > 0.2) m.mira = [-1.4, -1.2];
  // El salto: el arco entero, de la nuca a la cola, con el barro que chorrea y salpica.
  if (u >= T.salta[0] && u < T.salta[1]) {
    const s = entreT(u, T.salta);
    m.salto = Math.max(0.001, s);
    m.amp = 0;
    m.boca = 0.9;
    m.agalla = 1;
    m.aleta = -34;
    m.chorreo = entreT(u, [T.salta[0] + 0.15, T.salta[1] - 0.2]);
    m.salpica = [entreT(u, [T.salta[0], T.salta[0] + 0.6]), entreT(u, [T.salta[0] + 0.5, T.salta[0] + 1.1])];
  }
  // Perdida en el barro: el salto la dejó más allá, y vuelve por abajo a su lugar sin que se vea.
  if (u >= T.perdida[0] && u < T.asoma[0]) {
    m.alto = -70;
    m.amp = 10;
  }
  if (u >= T.asoma[0]) {
    // Asoma la cabeza sola, boqueando, apenas afuera: se le escapa la burbuja grande, y el barro se la traga.
    const sube = rampa(u, T.asoma[0], T.asoma[1]);
    const traga = rampa(u, T.traga[0], T.traga[1]);
    const vuelve = rampa(u, T.vuelve[0], T.vuelve[1]);
    m.alto = mezclar(mezclar(-70, -6, sube), -44, traga * (1 - vuelve)) * (1 - vuelve) + base.alto * vuelve;
    m.cabeza = mezclar(base.cabeza, 26, sube * (1 - vuelve) * (1 - 0.6 * traga));
    m.amp = mezclar(6, base.amp, vuelve);
    m.boca = Math.max(base.boca, loma(u, T.globo[0], T.globo[0] + 0.25, T.globo[0] + 0.6, T.globo[0] + 0.9));
    m.globo = entreT(u, T.globo);
    if (u >= T.plop[0]) {
      m.globo = 1;
      m.plop = Math.max(0.001, entreT(u, T.plop));
      if (u >= T.plop[1]) m.globo = m.plop = 0;
    }
    m.mira = u < T.traga[0] ? [-0.6, -1.6] : [0, -1.8 * (1 - vuelve)];
    // Lo último que deja cuando se hunde: una burbujita que revienta donde estaba.
    const ultima = entreT(u, [T.traga[0] + 0.3, T.traga[1] - 0.1]);
    m.burbujas = [ultima < 1 ? ultima : 0, m.burbujas[1], m.burbujas[2]];
    m.revienta = [u > T.traga[1] - 0.1 && u < T.traga[1] + 0.3 ? entreT(u, [T.traga[1] - 0.1, T.traga[1] + 0.3]) : 0, m.revienta[1], m.revienta[2]];
  }
  m.brasa = Math.max(base.brasa, loma(u, 1.2, 1.6, 3, 3.6));
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

interface Burbuja {
  desde: number;
  crece: number;
}

/** Arma a la anguila con un azar que se puede fijar (el test lo fija). La isla usa `armarAnguila`. */
export function armarAnguilaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--anguila')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { boquea: 0, retuerce: 0, hunde: 0, pegote: 0, desespera: 0 };
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
  let tocadaQuieta = false;
  let fase = 0;
  let antes = 0;
  let mira: [number, number] = [0, 0];
  let miraMeta: [number, number] = [0, 0];
  let miraEn = entre(MIRA);
  const burbujas: Burbuja[] = [0, 1, 2].map(() => ({ desde: entre(ENTRE_BURBUJAS), crece: entre(BURBUJEA) }));

  function elegir(): Accion {
    const opciones = (['boquea', 'retuerce', 'hunde', 'pegote'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'desespera' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const crecen: [number, number, number] = [0, 0, 0];
    const revientan: [number, number, number] = [0, 0, 0];
    const m: Momento = { ...QUIETO, mira, burbujas: crecen, revienta: revientan, salpica: [0, 0] };
    // Siempre: la onda que viaja, la agalla que late, la boca que busca aire y el fuego que tiembla.
    m.onda = fase;
    m.amp = QUIETO.amp + 4 * Math.sin(t * 0.7);
    m.agalla = 0.4 + 0.35 * Math.sin(t * 2.6);
    m.boca = 0.15 + 0.15 * Math.max(0, Math.sin(t * 1.3));
    m.cabeza = QUIETO.cabeza + 3 * Math.sin(t * 0.9);
    m.aleta = 10 * Math.sin(t * 3.1);
    m.brasa = 0.6 + 0.15 * Math.sin(t * 7) + 0.1 * Math.sin(t * 13.3);
    // Las burbujas del barro: crecen lentas y revientan, cada una a su tiempo.
    burbujas.forEach((b, i) => {
      const u = t - b.desde;
      if (u > 0 && u < b.crece) crecen[i] = suave(u / b.crece);
      else if (u >= b.crece && u < b.crece + REVIENTA) revientan[i] = (u - b.crece) / REVIENTA;
    });
    const u = t - desde;
    switch (accion) {
      case 'boquea': {
        // Saca la cabeza para arriba y abre la boca grande, tres, cuatro veces.
        const k = loma(u, 0, 0.4, DURA.boquea - 0.5, DURA.boquea);
        m.alto += 6 * k;
        m.cabeza += 22 * k;
        m.boca = Math.max(m.boca, k * Math.pow(Math.max(0, Math.sin(u * 7)), 0.7));
        m.agalla = Math.max(m.agalla, k * (0.6 + 0.4 * Math.sin(u * 14)));
        m.mira = [mira[0] * (1 - k) - 1.2 * k, mira[1] * (1 - k) - 1.4 * k];
        break;
      }
      case 'retuerce': {
        // La onda se agranda y se apura: el lomo asoma y se hunde a los tirones.
        const k = loma(u, 0, 0.5, DURA.retuerce - 0.6, DURA.retuerce);
        m.amp += 26 * k;
        m.cabeza += 10 * k * Math.sin(u * 9);
        m.aleta = 30 * k * Math.sin(u * 12);
        break;
      }
      case 'hunde': {
        // Se hunde hasta el ojo, se queda un momento, y asoma.
        const k = loma(u, 0, 1.2, 2.2, DURA.hunde);
        m.alto -= 22 * k;
        m.cabeza -= 16 * k;
        m.amp *= 1 - 0.6 * k;
        m.boca *= 1 - k;
        m.mira = [mira[0] * (1 - k), mira[1] * (1 - k) - 1.8 * k];
        break;
      }
      case 'pegote': {
        // Se hunde un poco, sale con el pegote en la cabeza, sacude, y el pegote se resbala y cae.
        const baja = loma(u, 0, 0.5, 0.7, 1.2);
        m.alto -= 18 * baja;
        m.pegote = rampa(u, 0.6, 0.7);
        const sacude = loma(u, 1.4, 1.6, 2.2, 2.4);
        m.cabeza += 14 * sacude * Math.sin(u * 22);
        m.cae = rampa(u, 2.1, 3);
        break;
      }
      case 'desespera': {
        return momentoDelToque(u, m);
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
      aplicar(tocadaQuieta ? TOCADA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    // La onda avanza más rápido cuando se retuerce.
    const apuro = accion === 'retuerce' ? 2.2 : 1;
    fase += Math.max(0, t - antes) * 2.4 * apuro;
    antes = t;
    if (t >= miraEn) {
      miraMeta = [(azar() - 0.5) * 3, (azar() - 0.6) * 2.4];
      miraEn = t + entre(MIRA);
    }
    // La pupila salta rápido, como la de un pez asustado.
    mira = [mira[0] + (miraMeta[0] - mira[0]) * 0.35, mira[1] + (miraMeta[1] - mira[1]) * 0.35];
    for (const b of burbujas) if (t - b.desde > b.crece + REVIENTA) {
      b.desde = t + entre(ENTRE_BURBUJAS);
      b.crece = entre(BURBUJEA);
    }
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté desesperada. */
  const tocado = (t: number): void => {
    if (accion !== 'desespera') empezar('desespera', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      tocadaQuieta = !tocadaQuieta;
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

export const armarAnguila: Armar = (marcos, esc) => armarAnguilaCon(marcos, esc);
