/**
 * Zippo (`D-73`, vigésima vuelta), volando en su avioneta hecha migas por el cielo del infierno.
 *
 * Lo que hace solo es lo de un aviador sin copiloto, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Vuela** siempre: sube y baja, cabecea, la hélice a fondo, la bufanda que flamea, la llama que
 *   titila en la cabeza y el humo negro que le queda atrás. Abajo, en el damero, su mala sombra.
 * - **Chista a su mala sombra**: la sombra se le va para otro lado, él la mira, se lleva el índice a la
 *   boca, y la sombra vuelve a su lugar.
 * - **Hace *clac***: cierra la tapa, la llama se apaga, la vuelve a abrir y la llama se prende de más.
 * - **Tose el motor**: la hélice se frena, se le escapa una bocanada negra y la avioneta se cae un poco
 *   antes de agarrar de nuevo.
 * - **Hace un rizo**: una vuelta entera para arriba, en el lugar.
 * - **Se le cae una ficha** del bolsillo, de las que no supo repartir, que rebota en el damero.
 *
 * Tocado, **se manda en picada** (*"se va gritando Cruz Diablo! por pura cortesía"*): la llama larga, el
 * saludo, un rizo para abajo que pasa cabeza abajo sobre el damero —ahí se le caen dos fichas—, la risa de
 * mil dientes con el azufre, y vuelve arriba. Dice su verso. Con movimiento reducido no se mueve nada:
 * tocarlo lo pasa de quieto a la picada.
 *
 * Se lleva números (`rig-zippo.ts`) y nada que dibuje.
 */

import { CHIST, FICHAS, HUMOS, PICADA, QUIETO, SALUDO, VERSO, ZIPPO, ZIPPO_ARMADO, alRecinto, marcas, type Momento, type Suelto } from '../../lib/bestiario/rig-zippo.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'zippo';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { chista: 2.8, clac: 2.2, tose: 2.6, rizo: 2.4, ficha: 1.6, picada: 4 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.8, 2] as const;

/** Cuánto espera para abrir la ficha después del toque: que se lo vea tirarse. */
export const DEMORA_FICHA = 1.4;

/** El radio del rizo de la picada, en el recinto: lo de abajo pasa justo sobre el damero. */
export const RADIO_PICADA = 66;
/** El del rizo que hace solo, para arriba. */
export const RADIO_RIZO = 34;
/** La vida de una bocanada de humo, y la línea del damero donde rebotan las fichas. */
export const VIDA_HUMO = 1.6;
export const PISO_FICHAS = ZIPPO.pisoSombra + 6;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  /** Las fichas que ya se le cayeron. */
  caidas: number;
}

interface Humo {
  x: number;
  y: number;
  edad: number;
  grande: number;
}
interface Ficha {
  x: number;
  y: number;
  vx: number;
  vy: number;
  giro: number;
  edad: number;
  rebotes: number;
}

/** Arma a Zippo con un azar que se puede fijar (el test lo fija). La isla usa `armarZippo`. */
export function armarZippoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--zippo')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { chista: 0, clac: 0, tose: 0, rizo: 0, ficha: 0, picada: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, caidas: 0 }) };
  const titere: SVGGElement = g;
  // Las partes viven en dos capas: la sombra en la de atrás, lo demás en el títere.
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let picadaQuieta = false;
  let helice = QUIETO.helice;
  let paraHumo = 0;
  let caidas = 0;
  // Las fichas que todavía no soltó en esta picada.
  let fichasDeLaPicada = 0;
  const humos: Humo[] = [];
  const fichas: Ficha[] = [];

  function elegir(): Accion {
    const opciones = (['chista', 'clac', 'tose', 'rizo', 'ficha'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'picada' ? ultima : a;
    desde = t;
    hechas[a]++;
    if (a === 'ficha') soltarFicha(ultimo);
    if (a === 'picada') fichasDeLaPicada = 2;
  }

  // El último momento pintado: de ahí salen las fichas y el humo.
  let ultimo: Momento = QUIETO;

  function soltarFicha(m: Momento): void {
    if (fichas.length >= FICHAS) fichas.shift();
    const [x, y] = alRecinto(ZIPPO_ARMADO.bolsillo, m);
    fichas.push({ x, y, vx: -30 + azar() * 60, vy: -60 - azar() * 40, giro: azar() * 360, edad: 0, rebotes: 0 });
    caidas++;
  }

  function avanzarSueltos(m: Momento, dt: number, cada: number, grande: number): void {
    paraHumo -= dt;
    if (paraHumo <= 0) {
      paraHumo = cada;
      const [x, y] = alRecinto(ZIPPO_ARMADO.escape, m);
      humos.push({ x, y, edad: 0, grande });
      if (humos.length > HUMOS) humos.shift();
    }
    for (const h of humos) {
      h.edad += dt;
      // El humo se queda atrás (a la derecha, porque vuela para la izquierda) y sube de a poco.
      h.x += 46 * dt;
      h.y -= 10 * dt;
    }
    for (const c of fichas) {
      c.edad += dt;
      if (c.rebotes < 2) {
        c.vy += 900 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.giro += 540 * dt * Math.sign(c.vx || 1);
        if (c.y >= PISO_FICHAS) {
          c.y = PISO_FICHAS;
          c.vy = -c.vy * 0.35;
          c.vx *= 0.5;
          c.rebotes++;
        }
      }
    }
  }

  function sueltos(): Pick<Momento, 'humo' | 'fichas'> {
    const humo: Suelto[] = Array.from({ length: HUMOS }, (_, i) => {
      const h = humos[i];
      if (!h || h.edad >= VIDA_HUMO) return { x: ZIPPO.x, y: ZIPPO.y, s: 1, o: 0 };
      const k = h.edad / VIDA_HUMO;
      return { x: h.x, y: h.y, s: (0.35 + 1.1 * k) * h.grande, o: 0.75 * (1 - k) * Math.min(1, h.edad * 8) };
    });
    const lasFichas: Suelto[] = Array.from({ length: FICHAS }, (_, i) => {
      const c = fichas[i];
      if (!c) return { x: ZIPPO.x, y: ZIPPO.y, s: 0, o: 0 };
      return { x: c.x, y: c.y, s: c.giro, o: 1 - rampa(c.edad, 2.4, 3) };
    });
    return { humo, fichas: lasFichas };
  }

  function momento(t: number, dt: number): Momento {
    const m: Momento = { ...QUIETO, sombra: { ...QUIETO.sombra }, azufre: { ...QUIETO.azufre } };
    // Vuela siempre: dos olas que no coinciden, y un poco de deriva.
    m.dy = 6 * Math.sin(t * 1.3) + 2 * Math.sin(t * 2.9 + 1);
    m.dx = 8 * Math.sin(t * 0.4);
    m.cabecea = 3 * Math.sin(t * 1.1 + 0.5);
    m.llama = 1 + 0.08 * Math.sin(t * 17) + 0.05 * Math.sin(t * 29 + 2);
    m.viento = 18 + 5 * Math.sin(t * 7);
    m.bufanda = 6 * Math.sin(t * 9) + 3 * Math.sin(t * 13 + 1);
    m.cabeza = 2 * Math.sin(t * 0.7);
    m.brazo = 3 * Math.sin(t * 1.7);
    let vueltas = 40;
    let humoCada = VIDA_HUMO / HUMOS;
    let humoGrande = 1;
    const u = t - desde;
    switch (accion) {
      case 'chista': {
        // La sombra se le va para un lado; la mira, chista, y la sombra vuelve.
        const se = loma(u, 0, 0.7, 1.7, 2.1);
        m.sombra.dx = 46 * se;
        m.sombra.o = 1 - 0.3 * Math.abs(Math.sin(u * 9)) * se;
        const mira = loma(u, 0.4, 0.8, 2.2, 2.7);
        m.cabeza += 16 * mira;
        m.brazo = mezcla(m.brazo, CHIST, loma(u, 0.8, 1.2, 2, 2.5));
        break;
      }
      case 'clac': {
        // Se cierra la tapa de golpe y la llama se ahoga; se abre de otro golpe y la llama se prende de más.
        const cierra = rampa(u, 0.3, 0.42) * (1 - rampa(u, 1.3, 1.42));
        m.tapa = 1 - cierra;
        m.llama *= (1 - cierra) * (1 + 0.6 * loma(u, 1.4, 1.5, 1.7, 2.1));
        m.cabeza -= 4 * loma(u, 0.25, 0.35, 0.45, 0.6) - 4 * loma(u, 1.25, 1.35, 1.45, 1.6);
        break;
      }
      case 'tose': {
        // La hélice se frena y la avioneta se cae; una bocanada negra, y agarra de nuevo.
        const k = loma(u, 0, 0.5, 1.6, 2.4);
        vueltas = mezcla(40, 5, k);
        m.borron = 1 - 0.8 * k;
        m.dy += 18 * k + 3 * Math.sin(u * 30) * k;
        m.cabecea -= 7 * k;
        if (u > 0.5 && u < 1.6) {
          humoCada = 0.12;
          humoGrande = 1.5;
        }
        break;
      }
      case 'rizo': {
        // Una vuelta entera para arriba, en el lugar: la trompa sigue el camino.
        const th = 2 * Math.PI * rampa(u, 0.1, 2.2);
        m.dx += -RADIO_RIZO * Math.sin(th);
        m.dy += -RADIO_RIZO * (1 - Math.cos(th));
        m.cabecea += (th * 180) / Math.PI;
        m.bufanda += 20 * Math.sin(th);
        break;
      }
      case 'ficha': {
        // Mira cómo se le cae, y se encoge de hombros.
        m.cabeza += 14 * loma(u, 0, 0.3, 1.1, 1.5);
        m.brazo -= 20 * loma(u, 0.4, 0.7, 1, 1.4);
        break;
      }
      case 'picada': {
        // La llama larga y el saludo; el rizo para abajo, cabeza abajo sobre el damero, y vuelve.
        const prende = loma(u, 0, 0.3, 3.2, 3.8);
        m.tapa = 1;
        m.llama = mezcla(m.llama, PICADA.llama, prende);
        m.viento = mezcla(m.viento, PICADA.viento, prende);
        m.brazo = mezcla(m.brazo, SALUDO, loma(u, 0.15, 0.5, 1.4, 1.9));
        const th = 2 * Math.PI * rampa(u, 0.35, 3.1);
        m.dx += -RADIO_PICADA * Math.sin(th);
        m.dy += RADIO_PICADA * (1 - Math.cos(th));
        m.cabecea += (-th * 180) / Math.PI;
        m.bufanda += PICADA.bufanda * prende;
        m.risa = loma(u, 1.2, 1.5, 3.2, 3.7);
        m.azufre = { s: 0.5 + 0.6 * rampa(u, 1.3, 2.6), o: PICADA.azufre.o * loma(u, 1.3, 1.6, 2.8, 3.5) };
        m.cabeza += PICADA.cabeza * prende;
        humoCada = 0.09;
        humoGrande = 1.2;
        // Cabeza abajo, en lo más hondo del rizo, se le caen dos fichas del bolsillo.
        if (fichasDeLaPicada > 0 && th > Math.PI * (fichasDeLaPicada === 2 ? 0.9 : 1.1)) {
          fichasDeLaPicada--;
          soltarFicha(m);
        }
        break;
      }
    }
    helice += vueltas * dt;
    m.helice = helice;
    avanzarSueltos(m, dt, humoCada, humoGrande);
    return { ...m, ...sueltos() };
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
      aplicar(picadaQuieta ? PICADA : QUIETO);
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
    ultimo = momento(t, Math.min(dt, 0.1));
    aplicar(ultimo);
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté en picada. */
  const tocado = (t: number): void => {
    if (accion !== 'picada') empezar('picada', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      picadaQuieta = !picadaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la llama, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, caidas }),
  };
}

export const armarZippo: Armar = (marcos, esc) => armarZippoCon(marcos, esc);
