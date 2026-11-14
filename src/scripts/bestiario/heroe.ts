/**
 * El héroe del whisky (`D-73`, vigesimoctava vuelta), tirado en la caja de un camión que vuelve a su ciudad.
 *
 * Es un fierro, como la Mariposa Pontiac: el tránsito (`recintoDeRuta`) lo corre por el carril de atrás a la velocidad
 * de su carril, y acá se mueve lo de adentro. Lo que hace solo no es un bucle: elige qué intenta cada vez, y casi todo
 * le sale mal.
 *
 * - **Alcanza una estrella**: estira el brazo, ciego, porque tiene el gorro hasta las cejas; la estrella justo se
 *   va para el otro lado, cierra el puño sobre el aire y se le cae el brazo. La varilla viaja con el camión: nunca llega.
 * - **Se toma un trago**: levanta la botella, toma, la mira, la sacude. Está vacía.
 * - **Se le va el gorro**: un golpe de aire se lo levanta, asoma un ojo, y el menú le vuelve a caer sobre las cejas.
 * - **El perro les ladra** a las estrellas, con la boca abierta, y **salta** a morderlas y no llega.
 * - Y siempre: las ruedas giran, el camión rebota en los baches y lo que va tirado se mece (las botellas vacías ruedan), el
 *   escape echa humo, las estrellas se hamacan en sus hilos, y el perro mueve la cola.
 *
 * Tocado, *"el perro se hace notar"*: el perro ladra con todo el cuerpo, de a cuatro, y salta; las estrellas se sacuden, las
 * botellas saltan; el héroe se levanta el gorro, abre un ojo y lo mira. Después, el gorro le cae torcido.
 * Con movimiento reducido no se mueve nada: tocarlo lo pasa de tirado a ladrando.
 *
 * Solo números, como las islas: lee `rig-heroe.ts` y nada que dibuje. El bocadillo lo pone la isla, como a todos los fierros.
 */

import { CARRIL, HEROE_ARMADO, LADRA, QUIETO, marcas, type Momento } from '../../lib/bestiario/rig-heroe.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-heroe-del-whisky';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { alcanza: 3.6, trago: 4, gorro: 2.8, ladridito: 2.6, salta: 2.4, ladra: 4.6 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['alcanza', 'trago', 'gorro', 'ladridito', 'salta'] as const;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.8, 2] as const;
/** La velocidad del carril de atrás, la de la imagen vieja, si el fierro no dice otra. */
export const VELOCIDAD = 30;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { salta: [0, 0.6], gorro: [0.7, 1.4], mira: [0.9, 3.5], vuelve: [3.6, 4.4] } as const;
/** Cuántas veces ladra tocado, y lo que le sacude las estrellas. */
export const LADRIDOS = 4;
export const SACUDE = 22;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, gorro: [...b.gorro], perro: { ...b.perro }, estrellas: [...b.estrellas] as Momento['estrellas'], humo: [...b.humo], vacias: [...b.vacias] });
const limita = (v: number, a = -1, b = 1): number => Math.min(b, Math.max(a, v));

/** Los baches de la ruta: una suma de ondas que no se repite, y un golpe de vez en cuando (−1 a 1). */
export const bache = (t: number): number => limita(0.55 * Math.sin(t * 2.3) * Math.sin(t * 0.9 + 1) + 0.3 * Math.sin(t * 5.1 + 0.4) + 0.5 * Math.max(0, Math.sin(t * 0.61 + 2)) ** 14 * Math.sin(t * 17));

/** La pose de base de un instante: va por la ruta, rebota, se mece, el escape echa humo, las estrellas se hamacan. */
export function base(t: number, velocidad = VELOCIDAD): Momento {
  const b = bache(t);
  const r = bache(t - 0.14);
  const hamaca = (i: number): number => (5 - i * 0.7) * Math.sin(t * (1.05 + i * 0.27) + i * 2.1) + 2 * Math.sin(t * (2.3 + i * 0.4) + i) + 5 * r * (i % 2 ? -1 : 1);
  return {
    ...QUIETO,
    bache: b,
    // El brazo cuelga flojo por el borde de la caja y se balancea con los baches.
    alcanza: -0.01 + 0.012 * Math.sin(t * 1.3) + 0.02 * r,
    giro: (t * velocidad / HEROE_ARMADO.radioRueda) * (180 / Math.PI) % 360,
    tumbo: 0.5 * Math.sin(t * 1.4) + 1.3 * r,
    cabeza: 1.6 * Math.sin(t * 0.8) + 1.4 * r,
    // Respira apenas el gorro, y se le mueve con la cabeza.
    gorro: [0, 0.4 * Math.sin(t * 1.4), 1.2 * Math.sin(t * 0.9)],
    perro: { salto: Math.max(0, r) * 1.6, cabeza: 12 + 4 * Math.sin(t * 0.7), boca: 0, cola: 9 * Math.sin(t * 6.3) },
    varilla: 1.1 * Math.sin(t * 0.8) + 1.4 * r,
    estrellas: [hamaca(0), hamaca(1), hamaca(2), hamaca(3)],
    humo: [(t * 0.22) % 1, (t * 0.22 + 0.5) % 1],
    vacias: [2.4 * Math.sin(t * 1.7) + 4 * r, 4 * Math.sin(t * 1.7) + 7 * r],
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'alcanza': {
      // Estira el brazo a ciegas hacia la estrella más cercana; justo se va para el otro lado, y cierra el puño sobre el aire.
      const sube = loma(u, 0, 1, 2.2, 3.1);
      m.alcanza = sube * (0.9 + 0.1 * Math.sin(u * 7));
      m.dedos = rampa(u, 1.2, 1.4) * (1 - rampa(u, 2.1, 2.5));
      m.estrellas = [m.estrellas[0] - 16 * loma(u, 0.8, 1.15, 1.4, 2.6) + 3 * Math.sin(u * 9) * rampa(u, 1.2, 1.4) * (1 - rampa(u, 1.4, 2.6)), m.estrellas[1], m.estrellas[2], m.estrellas[3]];
      m.cabeza += -5 * sube;
      m.tumbo += 1.4 * sube;
      m.varilla -= 1.2 * loma(u, 1, 1.2, 1.4, 2.4);
      break;
    }
    case 'trago': {
      // Levanta la botella, toma, la baja a medias, la sacude y se da cuenta: vacía.
      const toma = loma(u, 0, 0.9, 1.9, 2.5);
      const sacude = loma(u, 2.5, 2.7, 3.3, 3.6);
      m.botella = toma + 0.34 * sacude + 0.12 * sacude * Math.sin(u * 30);
      m.cabeza += 6 * toma;
      m.tumbo += 1.6 * toma;
      m.gorro = [m.gorro[0], m.gorro[1] - 1.6 * toma, m.gorro[2] + 6 * toma];
      break;
    }
    case 'gorro': {
      // Un golpe de aire le levanta el gorro: asoma un ojo, y el menú le cae otra vez hasta las cejas.
      const sube = loma(u, 0, 0.5, 1.3, 1.9);
      m.gorro = [-3 * sube, -9 * sube + m.gorro[1], -14 * sube + m.gorro[2]];
      m.ojo = 0.85 * loma(u, 0.35, 0.6, 1.1, 1.5);
      m.cabeza += 4 * sube;
      break;
    }
    case 'ladridito': {
      // Les ladra a las estrellas: tres ladridos con la boca abierta, y la cabeza que sigue a la más cercana.
      const ladra = (Math.max(0, Math.sin((u - 0.2) * Math.PI * 2.4)) ** 0.8) * loma(u, 0.2, 0.3, 1.7, 1.95);
      m.perro = { ...m.perro, cabeza: m.perro.cabeza + 14 * loma(u, 0, 0.4, 2, 2.5), boca: ladra, cola: m.perro.cola + 8 * ladra, salto: m.perro.salto + 1.8 * ladra };
      m.ladrido = 0.7 * ladra;
      break;
    }
    case 'salta': {
      // Salta a morder una estrella, y no llega: se le cierra la boca en el aire, la estrella se hamaca y cae sentado.
      const vuelo = loma(u, 0, 0.32, 0.5, 0.95);
      m.perro = { ...m.perro, salto: m.perro.salto + 15 * vuelo, cabeza: m.perro.cabeza + 18 * vuelo, boca: loma(u, 0.12, 0.28, 0.5, 0.56), cola: m.perro.cola + 14 * vuelo };
      m.estrellas = [m.estrellas[0], m.estrellas[1], m.estrellas[2] + 20 * loma(u, 0.45, 0.55, 0.7, 1.9) * Math.sin(u * 11), m.estrellas[3]];
      // Cae sentado: la caja se sacude y las botellas saltan.
      const cae = loma(u, 0.95, 1, 1.05, 1.6);
      m.vacias = [m.vacias[0] + 3 * cae, m.vacias[1] + 14 * cae];
      m.bache += 0.3 * cae;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El perro ladra con todo el cuerpo: de a cuatro, cada uno con un salto, la boca de par en par y la cola loca.
  const largo = (T.vuelve[0] - 0.4) / LADRIDOS;
  const fase = u >= 0.4 && u < T.vuelve[0] ? ((u - 0.4) % largo) / largo : 0;
  const ladra = u >= 0.4 && u < T.vuelve[0] ? (fase < 0.55 ? suave(fase / 0.15) * (1 - suave((fase - 0.4) / 0.15)) : 0) : 0;
  const parado = loma(u, T.salta[0], 0.3, T.vuelve[0], T.vuelve[1]);
  m.perro = { salto: 4 * parado + 9 * ladra, cabeza: mezclar(b.perro.cabeza, LADRA.perro.cabeza + 4 * ladra, parado), boca: ladra, cola: mezclar(b.perro.cola, 18 + 22 * Math.sin(u * 22), parado) };
  m.ladrido = ladra;
  // Las estrellas se sacuden, con los ladridos, y se van aflojando.
  const sacude = loma(u, 0.1, 0.4, 2.4, 3.8);
  m.estrellas = [0, 1, 2, 3].map((i) => b.estrellas[i]! + SACUDE * sacude * Math.sin(u * (9 + i * 2.3) + i)) as unknown as Momento['estrellas'];
  m.varilla = b.varilla + 2.2 * sacude * Math.sin(u * 10);
  // Las botellas saltan, y el camión también, un poco.
  const salta = loma(u, 0.4, 0.5, 3.4, 4);
  m.vacias = [b.vacias[0] + 8 * salta * Math.sin(u * 7), b.vacias[1] + 22 * salta * Math.sin(u * 9)];
  m.bache = b.bache + 0.3 * ladra;
  // El héroe: se levanta el gorro, abre un ojo y lo mira al perro (la cabeza hacia el perro). Después le cae torcido.
  const mira = loma(u, T.mira[0] - 0.2, T.mira[0] + 0.4, T.mira[1], T.vuelve[1]);
  m.cabeza = b.cabeza - 7 * mira;
  m.ojo = mira;
  const sube = loma(u, T.gorro[0], T.gorro[1], T.vuelve[0], T.vuelve[1]);
  m.gorro = [mezclar(b.gorro[0], LADRA.gorro[0], sube), mezclar(b.gorro[1], LADRA.gorro[1], sube), mezclar(b.gorro[2], LADRA.gorro[2], sube)];
  m.tumbo = b.tumbo + 2 * mira;
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al héroe con un azar que se puede fijar (el test lo fija). La isla usa `armarHeroe`. */
export function armarHeroeCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const marco = marcos[0];
  const hechas: Record<Accion, number> = { alcanza: 0, trago: 0, gorro: 0, ladridito: 0, salta: 0, ladra: 0 };
  if (!marco) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas }) };
  const p = new Map<string, SVGGraphicsElement>();
  for (const el of marco.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  // El fierro que lo lleva: el tránsito lo corre; acá se cuelga el bocadillo arriba de la varilla y se lee su velocidad.
  const fierro = (marco.closest?.('.bestia--fierro') as SVGGElement | null | undefined) ?? null;
  const velocidad = Number(fierro?.dataset.velocidad ?? VELOCIDAD);
  if (fierro) fierro.dataset.y = String(CARRIL + HEROE_ARMADO.globo + 26);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let ladraQuieto = false;
  /** El gorro le queda torcido después de que lo tocan, hasta la próxima. */
  let torcido = 0;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'ladra' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t, velocidad);
    b.gorro = [b.gorro[0], b.gorro[1], b.gorro[2] + torcido];
    const u = t - desde;
    if (accion === 'ladra') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u);
    return b;
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function mover(t: number, dt: number): void {
    if (esc.quieto() || (t === 0 && dt === 0)) {
      aplicar(ladraQuieto ? LADRA : QUIETO);
      return;
    }
    if (accion && t - desde >= DURA[accion]) {
      if (accion === 'ladra') torcido = -7;
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté ladrando. */
  const tocado = (t: number): void => {
    if (accion !== 'ladra') empezar('ladra', t);
  };

  return {
    mover,
    reaccionar: (id, t) => {
      if (id !== ID) return false;
      if (esc.quieto()) {
        // Sin movimiento, el toque es una segunda foto: tirado, o ladrándole al perro.
        ladraQuieto = !ladraQuieto;
        aplicar(ladraQuieto ? LADRA : QUIETO);
      } else {
        tocado(t);
        torcido = 0;
      }
      return true;
    },
    estado: () => ({ accion, hechas: { ...hechas } }),
  };
}

export const armarHeroe: Armar = (marcos, esc) => armarHeroeCon(marcos, esc);
