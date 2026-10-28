/**
 * Los gallos sofocados (`D-73`, vigesimotercera vuelta), apoyados uno en el otro en el ala del templo.
 *
 * Lo que hacen solos es aguantar el fin de fiesta, y nada es un bucle: eligen qué hacer cada vez.
 *
 * - **Cabecean**: se les cierran los ojos, se les cae la cabeza, y se despiertan de un respingo.
 * - **El flaco quiere cantar**: levanta el pico, lo abre, y le sale un hipo con burbujas. Y otro.
 * - **Se acomodan las plumas**: el del espolón se espulga el lomo y el flaco sacude la cola.
 * - **Un picotazo**: uno le pica la cresta al otro, que se despierta ofendido y se la devuelve.
 * - **Un trago**: el del espolón sube la botella, mete el pico como las gallinas, tira la cabeza para atrás
 *   y se tambalea más.
 * - **Jadean**, se tambalean y pestañean, hagan lo que hagan.
 *
 * Tocados, **una riña de opereta** (*"no hay quien le quite a ese gallo el espolón"*): se despegan, se inflan
 * y abren las alas, el del espolón patea con el espolón y el flaco le tira picotazos, vuelan plumas, el del
 * espolón quiere cacarear y se le ahoga el cacareo, al flaco le agarra el hipo, y terminan abrazados,
 * tambaleándose (*"vienen tambaleando, gallos sofocados"*), hasta que vuelven a apoyarse. Dicen su verso.
 * Con movimiento reducido no se mueve nada: tocarlos los pasa de apoyados a la riña.
 *
 * Se lleva números (`rig-gallos.ts`) y nada que dibuje.
 */

import { QUIETO, RINA, TRAGO, VERSO, marcas, type Momento, type Par } from '../../lib/bestiario/rig-gallos.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'los-gallos-sofocados';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { cabecean: 3.2, hipo: 2.8, plumas: 3, picotazo: 2.2, trago: 3.2, rina: 7.2 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea cada uno, en segundos. */
export const PESTANEA = [2, 4.6] as const;

/** Los tiempos de la riña: para el test y para la conducta. */
export const RINA_T = { despegan: [0, 0.6], inflan: [0.5, 1.2], pelea: [1.3, 3.7], cacarea: [3.7, 4.7], abrazan: [4.6, 6.3], vuelve: [6.2, 7] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, a: number, b: number): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const hacia = (p: Par, meta: Par, k: number): Par => [mezclar(p[0], meta[0], k), mezclar(p[1], meta[1], k)];
const mas = (p: Par, d: Par): Par => [p[0] + d[0], p[1] + d[1]];
const uno = (p: Par, n: 0 | 1, v: number): Par => (n === 0 ? [v, p[1]] : [p[0], v]);

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a los gallos con un azar que se puede fijar (el test lo fija). La isla usa `armarGallos`. */
export function armarGallosCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--gallos')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { cabecean: 0, hipo: 0, plumas: 0, picotazo: 0, trago: 0, rina: 0 };
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
  let rinaQuieta = false;
  /** Quién pica primero en el picotazo. */
  let quien: 0 | 1 = 0;
  const pestanea: [number, number] = [entre(PESTANEA), entre(PESTANEA)];

  function elegir(): Accion {
    const opciones = (['cabecean', 'hipo', 'plumas', 'picotazo', 'trago'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'rina' ? ultima : a;
    desde = t;
    hechas[a]++;
    quien = azar() < 0.5 ? 0 : 1;
  }

  function momento(t: number): Momento {
    let m: Momento = { ...QUIETO, patas: [[...QUIETO.patas[0]], [...QUIETO.patas[1]]] };
    // Siempre: el tambaleo de los dos, el jadeo de sofocados, la barba que se hamaca y el pestañeo.
    m.tambaleo = 2.6 * Math.sin(t * 0.9) + 1.2 * Math.sin(t * 2.3 + 1);
    const jadeo: Par = [0.5 + 0.5 * Math.sin(t * 9), 0.5 + 0.5 * Math.sin(t * 9 + 1.3)];
    m.infla = [0.05 * jadeo[0], 0.05 * jadeo[1]];
    m.pico = mas(m.pico, [5 * jadeo[0], 5 * jadeo[1]]);
    m.barba = [5 * Math.sin(t * 1.7) - m.tambaleo, 5 * Math.sin(t * 1.9 + 1) - m.tambaleo];
    m.cuello = mas(m.cuello, [2 * Math.sin(t * 0.7), 2 * Math.sin(t * 0.8 + 2)]);
    const parpado: [number, number] = [m.parpado[0], m.parpado[1]];
    for (const n of [0, 1] as const) {
      const ojo = t - pestanea[n];
      if (ojo > 0 && ojo < 0.22) parpado[n] = mezclar(parpado[n], 1, Math.sin((ojo / 0.22) * Math.PI));
    }
    m.parpado = parpado;
    const u = t - desde;
    switch (accion) {
      case 'cabecean': {
        // Se les cierran los ojos y se les cae la cabeza, y se despiertan de un respingo.
        const k = loma(u, 0, 0.9, 2.2, 2.6);
        const susto = loma(u, 2.2, 2.32, 2.5, 3);
        m.cuello = mas(m.cuello, [14 * k - 26 * susto, 26 * k - 30 * susto]);
        m.parpado = hacia(m.parpado, [1, 1], k);
        m.cresta = mas(m.cresta, [10 * k, 10 * k]);
        m.salto = [6 * susto, 8 * susto];
        m.barba = mas(m.barba, [24 * susto * Math.sin(u * 30), 24 * susto * Math.sin(u * 30 + 1)]);
        m.tambaleo += 4 * susto;
        break;
      }
      case 'hipo': {
        // El flaco levanta el pico para cantar, lo abre, y le sale un hipo. Y otro. El otro lo mira.
        const k = loma(u, 0, 0.4, 2.2, DURA.hipo);
        const canta = loma(u, 0.4, 0.7, 0.92, 1);
        const hic = loma(u, 1, 1.06, 1.12, 1.32) + 0.7 * loma(u, 1.7, 1.76, 1.82, 2);
        m.cuello = mas(m.cuello, [-16 * k, -34 * k]);
        m.pico = mas(m.pico, [0, 26 * canta - 10 * hic]);
        m.parpado = hacia(m.parpado, [0.1, 0], k);
        m.salto = [0, 8 * hic];
        m.inclina = mas(m.inclina, [0, -6 * hic]);
        m.cresta = mas(m.cresta, [0, 12 * hic]);
        m.hipo = entreT(u, 1, 2.6);
        break;
      }
      case 'plumas': {
        // El del espolón se espulga el lomo a picotazos y se esponja; el flaco sacude la cola.
        const k = loma(u, 0, 0.5, 2, 2.5);
        const espulga = Math.sin(u * 14) * loma(u, 0.5, 0.6, 1.9, 2);
        m.cuello = mas(m.cuello, [-104 * k + 6 * espulga, 0]);
        m.infla = mas(m.infla, [0.35 * k, 0]);
        m.inclina = mas(m.inclina, [-8 * k, 0]);
        m.ala = mas(m.ala, [10 * k, 0]);
        const sacude = loma(u, 1.6, 1.8, 2.6, DURA.plumas);
        m.cola = mas(m.cola, [10 * k * Math.sin(u * 6), 16 * sacude * Math.sin(u * 24)]);
        m.infla = mas(m.infla, [0, 0.3 * sacude * (0.5 + 0.5 * Math.sin(u * 24))]);
        break;
      }
      case 'picotazo': {
        // Uno le pica la cresta al otro, que se despierta ofendido y se la devuelve, más flojo.
        const otro = (1 - quien) as 0 | 1;
        const pica = loma(u, 0.3, 0.45, 0.55, 0.8);
        const ay = loma(u, 0.5, 0.56, 0.7, 1);
        const vuelta = loma(u, 1.2, 1.35, 1.45, 1.7);
        m.cuello = mas(m.cuello, uno([0, 0], quien, 26 * pica));
        m.cuello = mas(m.cuello, uno([0, 0], otro, -20 * ay + 20 * vuelta));
        m.inclina = mas(m.inclina, uno([0, 0], quien, 8 * pica));
        m.inclina = mas(m.inclina, uno([0, 0], otro, 6 * vuelta - 4 * ay));
        m.salto = uno(m.salto, otro, 7 * ay);
        m.cresta = uno(m.cresta, otro, m.cresta[otro] + 24 * ay);
        m.parpado = uno(m.parpado, otro, mezclar(m.parpado[otro], 0, loma(u, 0.5, 0.6, 1.6, 2)));
        m.pico = uno(m.pico, otro, m.pico[otro] + 16 * vuelta);
        break;
      }
      case 'trago': {
        // Sube la botella, mete el pico, tira la cabeza para atrás y traga; después se tambalea más.
        const k = loma(u, 0, 0.7, 2.2, 2.8);
        const traga = loma(u, 1.2, 1.5, 1.9, 2.3);
        m.ala = [mezclar(m.ala[0], TRAGO.ala, k), m.ala[1]];
        m.cuello = [mezclar(m.cuello[0], TRAGO.cuello, k) - 34 * traga, m.cuello[1] - 8 * k];
        m.inclina = [mezclar(m.inclina[0], 0, k), m.inclina[1]];
        m.parpado = [mezclar(m.parpado[0], 1, traga), m.parpado[1]];
        m.tambaleo += 7 * Math.sin(u * 3.4) * loma(u, 2.2, 2.5, 2.9, DURA.trago);
        break;
      }
      case 'rina':
        m = rina(m, u);
        break;
    }
    return m;
  }

  /** La riña de opereta, desde el momento de siempre. */
  function rina(base: Momento, u: number): Momento {
    const T = RINA_T;
    let m = base;
    // Se despegan, se miran y se despiertan: crestas paradas, ojos abiertos.
    const des = rampa(u, T.despegan[0], T.despegan[1]) * (1 - rampa(u, T.abrazan[0], T.abrazan[0] + 0.5));
    m = { ...m, arrima: hacia(m.arrima, RINA.arrima, des), inclina: hacia(m.inclina, [-2, 2], des), cuello: hacia(m.cuello, [-12, -10], des), cresta: hacia(m.cresta, [0, 4], des), parpado: hacia(m.parpado, [0, 0], des) };
    // Se inflan, abren las alas y paran la cola.
    const inf = loma(u, T.inflan[0], T.inflan[1], T.cacarea[0] + 0.5, T.cacarea[1] + 0.1);
    m = { ...m, infla: hacia(m.infla, [1, 1], inf), ala: hacia(m.ala, [-40, 22], inf), cola: hacia(m.cola, RINA.cola, inf) };
    // La pelea: tres vueltas, patada con espolón, picotazo, patada.
    if (u >= T.pelea[0] && u < T.pelea[1]) {
      const v = (u - T.pelea[0]) / 0.8;
      const r = Math.floor(v);
      const f = Math.sin(Math.PI * (v - r));
      if (r % 2 === 0) {
        m = { ...m, salto: [26 * f, 4 * f], patas: [[m.patas[0][0] + 10 * f, m.patas[0][1] - 62 * f], m.patas[1]], inclina: mas(m.inclina, [-12 * f, -6 * f]), arrima: mas(m.arrima, [4 * f, -10 * f]), ala: mas(m.ala, [-30 * f, 10 * f]), pico: mas(m.pico, [18 * f, 10 * f]) };
      } else {
        m = { ...m, inclina: mas(m.inclina, [-6 * f, 14 * f]), cuello: mas(m.cuello, [-10 * f, 44 * f]), arrima: mas(m.arrima, [-6 * f, 12 * f]), pico: mas(m.pico, [6 * f, 20 * f]), salto: [4 * f, 0] };
      }
    }
    // Las plumas que vuelan: suben y bajan flotando.
    const plu = rampa(u, T.pelea[0] + 0.2, T.pelea[0] + 0.5) * (1 - rampa(u, T.abrazan[0] - 0.2, T.abrazan[0] + 0.4));
    m = { ...m, plumas: plu, vuelo: -28 * Math.sin(Math.PI * entreT(u, T.pelea[0] + 0.2, T.abrazan[0] + 0.4)) };
    // El cacareo que se ahoga: el del espolón levanta la cabeza, abre el pico, y se le corta de golpe.
    const [c0, c1] = T.cacarea;
    const alza = loma(u, c0, c0 + 0.2, c1 - 0.3, c1);
    const grita = loma(u, c0 + 0.1, c0 + 0.2, c0 + 0.45, c0 + 0.5);
    const ahoga = loma(u, c0 + 0.5, c0 + 0.56, c0 + 0.62, c0 + 0.8);
    m = {
      ...m,
      cuello: mas(m.cuello, [-24 * alza, 0]),
      pico: mas(m.pico, [26 * grita - 8 * ahoga, 0]),
      cacareo: grita * (0.75 + 0.25 * Math.sin(u * 40)),
      salto: mas(m.salto, [7 * ahoga, 6 * loma(u, c0 + 0.7, c0 + 0.76, c0 + 0.82, c0 + 1)]),
      cresta: mas(m.cresta, [26 * rampa(u, c0 + 0.5, c1), 0]),
      hipo: entreT(u, c0 + 0.7, c1 + 0.9),
    };
    // Terminan abrazados, tambaleándose, con el ala del del espolón por encima del flaco.
    const [a0, a1] = T.abrazan;
    const abr = loma(u, a0, a0 + 0.5, a1 - 0.2, T.vuelve[1] - 0.2);
    const paso = Math.sin((u - a0) * 7);
    m = {
      ...m,
      arrima: hacia(m.arrima, [2, 0], abr),
      inclina: hacia(m.inclina, [12, 4], abr),
      ala: [mezclar(m.ala[0], -70, abr), m.ala[1]],
      cuello: hacia(m.cuello, [30, -16], abr),
      parpado: hacia(m.parpado, [0.8, 0.9], abr),
      tambaleo: m.tambaleo + 9 * abr * Math.sin((u - a0) * 4.2),
      patas: [[m.patas[0][0] + 10 * paso * abr, m.patas[0][1] - 10 * paso * abr], [m.patas[1][0] - 8 * paso * abr, m.patas[1][1] + 8 * paso * abr]],
    };
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
      aplicar(rinaQuieta ? RINA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    for (const n of [0, 1] as const) if (t - pestanea[n] > 0.22) pestanea[n] = t + entre(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocados: lo que estén haciendo lo dejan, salvo que ya estén en la riña. */
  const tocado = (t: number): void => {
    if (accion !== 'rina') empezar('rina', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      rinaQuieta = !rinaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dicen su verso arriba de las crestas, y la página abre la ficha. */
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

export const armarGallos: Armar = (marcos, esc) => armarGallosCon(marcos, esc);
