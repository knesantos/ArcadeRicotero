/**
 * El que duerme colgado (`D-73`, vigésima vuelta), cabeza abajo de la rama soldada del árbol.
 *
 * Lo que hace solo es dormir, y nada es un bucle: elige qué soñar cada vez.
 *
 * - **Duerme** hamacándose de las rodillas, con el gorro que cuelga y se atrasa, el saco cerrado como un
 *   murciélago y el sueño de tiza que respira con él. Adentro, los angelitos vuelan en ronda.
 * - **Sueña fuerte**: los angelitos se apuran, van al grano y tiran con las metralletas.
 * - **Ronca**: se le abre la boca, y el sueño se infla y se desinfla.
 * - **Al temor se le cae una gota de almíbar**, y tiembla.
 * - **Se da vuelta** dormido: se hamaca de más y el saco se le mueve.
 *
 * Tocado, **es hora de levantarse, querido**: se despierta de golpe, los ojos como platos, el saco se le
 * abre como alas de murciélago, el sueño revienta, el temor salta del dedo y lo vuelve a agarrar. Se
 * hamaca un rato y se vuelve a dormir, y el sueño vuelve. Dice su verso. Con movimiento reducido no se
 * mueve nada: tocarlo lo pasa de dormido a despierto.
 *
 * Se lleva números (`rig-colgado.ts`) y nada que dibuje.
 */

import { LEVANTARSE, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-colgado.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-que-duerme-colgado';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { suena: 3.2, ronca: 3, gota: 2, gira: 2.8, levantarse: 4.2 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.2;

/** Lo que corren los angelitos en el sueño (radianes por segundo), tranquilos y yendo al grano. */
export const RONDA = { tranquila: 0.9, alGrano: 3.4 } as const;
/** Lo que cae la gota de almíbar antes de deshacerse. */
export const CAE_GOTA = 70;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  ronda: number;
}

/** Arma al colgado con un azar que se puede fijar (el test lo fija). La isla usa `armarColgado`. */
export function armarColgadoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--colgado')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { suena: 0, ronca: 0, gota: 0, gira: 0, levantarse: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, ronda: 0 }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let despiertoQuieto = false;
  let ronda = QUIETO.angelitos;
  let lado = 1;

  function elegir(): Accion {
    const opciones = (['suena', 'ronca', 'gota', 'gira'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'levantarse' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number, dt: number): Momento {
    const m: Momento = { ...QUIETO, carozo: { ...QUIETO.carozo }, gota: { ...QUIETO.gota }, sueno: { ...QUIETO.sueno } };
    // Duerme: se hamaca de las rodillas, el gorro se atrasa, el sueño respira con él.
    m.hamaca = 3 * Math.sin(t * 0.9);
    m.gorro = -m.hamaca * 1.6 + 4 * Math.sin(t * 1.3 + 1);
    m.cabeza = 1.5 * Math.sin(t * 0.7 + 2);
    m.alas = 0.03 + 0.03 * Math.sin(t * 1.4);
    m.sueno.s = 1 + 0.04 * Math.sin(t * 1.6);
    let rapidez: number = RONDA.tranquila;
    const u = t - desde;
    switch (accion) {
      case 'suena': {
        // Los angelitos se apuran, van al grano, y tiran.
        const k = loma(u, 0, 0.5, 2.6, DURA.suena);
        rapidez = mezcla(rapidez, RONDA.alGrano, k);
        m.sueno.s += 0.14 * k;
        m.tiro = k * (Math.sin(u * 30) > 0.3 ? 1 : 0);
        m.cabeza += 4 * Math.sin(u * 6) * k;
        break;
      }
      case 'ronca': {
        // Se le abre la boca de a poco y el sueño se infla y se desinfla con el ronquido.
        const k = loma(u, 0, 0.4, 2.4, DURA.ronca);
        const ronquido = 0.5 + 0.5 * Math.sin(u * 4.2 - Math.PI / 2);
        m.boca = 0.7 * ronquido * k;
        m.sueno.s += 0.22 * ronquido * k;
        break;
      }
      case 'gota': {
        // El temor tiembla, y la gota de almíbar se le cae.
        const cae = rampa(u, 0.5, 1.6);
        m.gota = { y: CAE_GOTA * cae * cae, o: u < 0.2 ? 0 : 1 - rampa(u, 1.3, 1.7) };
        m.carozo.giro = 8 * Math.sin(u * 40) * loma(u, 0, 0.1, 0.4, 0.6);
        break;
      }
      case 'gira': {
        // Se da vuelta dormido: se hamaca de más, y se le mueve el saco.
        const k = loma(u, 0, 0.3, 1.8, DURA.gira);
        m.hamaca += lado * 9 * Math.sin(u * 3) * k;
        m.alas += 0.18 * k * Math.abs(Math.sin(u * 3));
        m.cabeza += lado * 6 * k;
        break;
      }
      case 'levantarse': {
        // ¡Es hora de levantarse, querido! Se despierta de golpe, abre el saco, revienta el sueño.
        const despierto = loma(u, 0, 0.08, 2.6, 3);
        m.ojos = despierto;
        m.boca = loma(u, 0, 0.08, 1, 1.6);
        m.alas = mezcla(m.alas, LEVANTARSE.alas, loma(u, 0.04, 0.3, 2.2, 3.2)) * (1 + 0.12 * Math.sin(u * 22) * loma(u, 0.3, 0.5, 1.2, 1.6));
        m.hamaca += LEVANTARSE.hamaca * Math.sin(u * 3.4) * Math.exp(-u * 0.9) * rampa(u, 0, 0.1);
        m.gorro += LEVANTARSE.gorro * Math.sin(u * 3.4 - 0.6) * Math.exp(-u * 0.8);
        m.cabeza = mezcla(m.cabeza, LEVANTARSE.cabeza, despierto);
        // El sueño revienta en rayas de tiza, y vuelve cuando se duerme.
        m.pop = rampa(u, 0.08, 0.7);
        m.sueno = { s: u < 2.6 ? 0.2 : rampa(u, 2.8, 3.8), o: (1 - rampa(u, 0.06, 0.2)) + rampa(u, 2.8, 3.6) };
        // El temor salta del dedo y vuelve a caer en el dedo.
        const salto = rampa(u, 0.05, 1.1);
        m.carozo = { x: LEVANTARSE.carozo.x * Math.sin(Math.PI * salto), y: -46 * Math.sin(Math.PI * salto), giro: -360 * salto };
        break;
      }
    }
    ronda += rapidez * dt;
    m.angelitos = ronda;
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
      aplicar(despiertoQuieto ? LEVANTARSE : QUIETO);
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

  /** Tocado: lo que esté soñando lo deja, salvo que ya se esté levantando. */
  const tocado = (t: number): void => {
    if (accion !== 'levantarse') empezar('levantarse', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      despiertoQuieto = !despiertoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso debajo de la cabeza (está cabeza abajo), y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, ronda }),
  };
}

export const armarColgado: Armar = (marcos, esc) => armarColgadoCon(marcos, esc);
