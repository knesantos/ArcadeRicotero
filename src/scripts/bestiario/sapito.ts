/**
 * La princesita sapito (`D-73`, vigesimocuarta vuelta), sentada en su trono de nieve de Cybersiberia.
 *
 * Lo que hace sola es ser sapo con modales, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Croa**: la garganta se le infla tres veces, con los ojos a media asta.
 * - **Caza**: cae un copo de nieve, lo sigue con los ojos, saca la lengua y se lo come. Para tragar, los ojos
 *   se le hunden, como a los sapos de verdad.
 * - **Se acomoda la corona**: estira el brazo, la endereza… y la corona se le vuelve a torcer sola.
 * - **Tirita**: se abraza, le castañetea todo, le sale vaho, el tul se le vuela y la corona le baila.
 * - **Mira el zapatito**: levanta el pie, lo menea, lo mira de costado y suspira.
 * - **Respira** con la garganta, que en un sapo late siempre, pestañea y deja vagar la mirada.
 *
 * Tocada, **intenta volver** (*"su princesita, ay, se transformó en sapito"*): se endereza la corona, se para
 * en las patas de atrás, cierra los ojos y pone la trompa pintada. Le salen chispas alrededor y tiembla de
 * las ganas. Puf. Cuando se va la nube sigue siendo sapo, con la corona caída sobre un ojo. Croa un "ay",
 * se sienta de golpe, suspira y se sube la corona con el brazo. Dice su verso. Con movimiento reducido no se
 * mueve nada: tocarla la pasa del trono a la pose del beso, parada entre las chispas.
 *
 * Se lleva números (`rig-sapito.ts`) y nada que dibuje.
 */

import { BESO, QUIETO, VERSO, puntaDeLengua, marcas, type Momento } from '../../lib/bestiario/rig-sapito.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-princesita-sapito';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { croa: 2.6, caza: 2.8, corona: 3.2, tirita: 2.8, zapato: 3.2, princesa: 7.6 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.4] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.8, 6] as const;
const PESTANEO = 0.22;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { acomoda: [0, 0.9], alza: [0.8, 1.6], espera: [1.6, 3.4], puf: [3.3, 4.4], sigue: [4.4, 5.4], sienta: [5.4, 6.2], suspira: [6.2, 7.6] } as const;

/** La caza: de dónde cae el copo, dónde lo agarra la lengua y cuándo. */
export const CAZA = { desde: [64, -262] as const, agarra: 1.6, mete: 1.95 } as const;
/** Donde la lengua alcanza al copo, en sus coordenadas. */
export const AGARRA: readonly [number, number] = [46, -150];

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copiar = (m: Momento): Momento => ({ ...m, parpados: [...m.parpados], mira: [...m.mira], brazos: [...m.brazos], lengua: [...m.lengua], copo: [...m.copo] });

/** Hacia dónde apunta la lengua y lo que se estira para llegar a un punto. */
function apuntar([x, y]: readonly [number, number]): [number, number] {
  const [bx, by] = [0, -54];
  const [dx, dy] = [x - bx, y - by];
  return [(Math.atan2(dx, -dy) * 180) / Math.PI, Math.hypot(dx, dy) / 110];
}

/** Dónde va el copo mientras cae: baja meciéndose hasta donde lo alcanza la lengua. */
function copoCayendo(u: number): [number, number] {
  const k = Math.min(1, u / CAZA.agarra);
  const [x0, y0] = CAZA.desde;
  return [mezclar(x0, AGARRA[0], k) + 7 * Math.sin(u * 4.2) * (1 - k), mezclar(y0, AGARRA[1], k)];
}

/** La caza, sobre la pose de ese cuadro, a los `u` segundos. */
export function momentoDeLaCaza(base: Momento, u: number): Momento {
  const m = copiar(base);
  const [ag, mete] = [CAZA.agarra, CAZA.mete];
  if (u < ag) {
    const c = copoCayendo(u);
    m.copo = c;
    m.copoSe = rampa(u, 0, 0.3);
    // Lo sigue con los ojos, y abre los párpados de golpe cuando lo tiene a tiro.
    m.mira = [Math.max(-3, Math.min(3, c[0] / 20)), -3];
    m.parpados = [mezclar(m.parpados[0], 0, rampa(u, 0.8, 1.2)), mezclar(m.parpados[1], 0, rampa(u, 0.8, 1.2))];
    m.agacha = 0.4 * loma(u, 1.1, 1.3, 1.45, 1.55);
    // La lengua sale en un latigazo justo antes.
    const [a, l] = apuntar(AGARRA);
    const sale = rampa(u, ag - 0.14, ag);
    m.lengua = [a, l * sale];
  } else if (u < mete) {
    const [a, l] = apuntar(AGARRA);
    const vuelve = 1 - rampa(u, ag + 0.05, mete);
    m.lengua = [a * vuelve, l * vuelve];
    m.copo = puntaDeLengua(m.lengua);
    m.copoSe = 1;
    m.mira = [1, -2 * vuelve];
  } else {
    // Traga: los ojos se le hunden adentro de la cabeza, y la garganta late.
    const k = loma(u, mete, mete + 0.15, 2.4, 2.7);
    m.parpados = [Math.max(m.parpados[0], 0.85 * k), Math.max(m.parpados[1], 0.85 * k)];
    m.mira = [0, 3 * k];
    m.garganta = Math.max(m.garganta, 0.45 * loma(u, 2.1, 2.25, 2.35, 2.6));
    m.agacha = 0.25 * k;
  }
  return m;
}

/**
 * El toque, sobre la pose de base de ese cuadro (quieta, con la respiración y el pestañeo): lo que hace a
 * los `u` segundos de que la tocaron.
 */
export function momentoDelToque(base: Momento, u: number): Momento {
  const m = copiar(base);
  // Se endereza la corona con el brazo de la derecha, y junta las manos para el beso.
  const subeBrazo = loma(u, 0.05, 0.35, 0.55, 0.85);
  const junta = rampa(u, 0.8, 1.3) * (1 - rampa(u, 5.4, 5.9));
  const empuja = loma(u, 6.5, 6.8, 7.2, 7.5);
  m.brazos = [mezclar(0, BESO.brazos[0], junta), mezclar(mezclar(0, BESO.brazos[1], junta), -186, Math.max(subeBrazo, empuja))];
  const derecha = rampa(u, 0.35, 0.65) * (1 - rampa(u, 6.9, 7.4));
  m.corona = mezclar(QUIETO.corona, 0, derecha);
  // Se para en las patas de atrás, y se sienta de golpe.
  m.alza = rampa(u, 0.8, 1.5) * (1 - rampa(u, 5.4, 5.75));
  m.agacha = 0.8 * loma(u, 5.7, 5.8, 5.9, 6.2);
  // Cierra los ojos, pone la trompa y espera; las chispas le giran alrededor y tiembla de las ganas.
  const cierra = rampa(u, 1.3, 1.6) * (1 - rampa(u, 4.6, 4.75));
  m.parpados = [mezclar(m.parpados[0], 1, cierra), mezclar(m.parpados[1], 1, cierra)];
  m.trompa = rampa(u, 1.4, 1.7) * (1 - rampa(u, 4.5, 4.8));
  m.chispas = rampa(u, 1.6, 2.2) * (1 - rampa(u, 3.7, 4));
  m.giro = 70 * (u - 1.6);
  const ganas = loma(u, 2.2, 2.6, 3.1, 3.4);
  m.tirita = 1.2 * ganas * Math.sin(u * 46);
  m.tul = BESO.tul * m.alza + 6 * ganas * Math.sin(u * 23);
  // Puf: la nube la tapa entera, y se va.
  m.puf = rampa(u, 3.3, 4);
  m.pufSe = rampa(u, 3.3, 3.5) * (1 - rampa(u, 4.3, 5.2));
  // Sigue siendo sapo: la corona caída sobre un ojo, abre el otro, croa un "ay".
  m.cae = rampa(u, 3.8, 4.15) * (1 - rampa(u, 6.85, 7.3));
  m.garganta = Math.max(m.garganta, loma(u, 4.9, 5.05, 5.2, 5.45), 0.55 * loma(u, 6.2, 6.6, 6.8, 7.2));
  // Y suspira, ladeada, mirando el piso.
  const triste = loma(u, 5.9, 6.2, 7.1, 7.5);
  m.cabeza = -7 * triste;
  m.mira = [mezclar(m.mira[0], -2, triste), mezclar(m.mira[1], 3, triste)];
  m.parpados = [Math.max(m.parpados[0], 0.55 * triste), Math.max(m.parpados[1], 0.55 * triste)];
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la sapita con un azar que se puede fijar (el test lo fija). La isla usa `armarSapito`. */
export function armarSapitoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--sapito')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { croa: 0, caza: 0, corona: 0, tirita: 0, zapato: 0, princesa: 0 };
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
  let besoQuieto = false;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = (['croa', 'caza', 'corona', 'tirita', 'zapato'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'princesa' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const m = copiar(QUIETO);
    // Quieta: respira, la garganta le late como a todo sapo y la mirada se le va.
    m.respira = Math.sin(t * 1.6);
    m.garganta = 0.08 * (1 + Math.sin(t * 3.1));
    m.mira = [1.6 * Math.sin(t * 0.23), 0.8 * Math.sin(t * 0.31)];
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      m.parpados = [mezclar(m.parpados[0], 1, k), mezclar(m.parpados[1], 1, k)];
    }
    const u = t - desde;
    switch (accion) {
      case 'croa': {
        // Tres croadas: la garganta se infla, se aplasta un poco y entorna los ojos.
        const croada = [0.2, 0.95, 1.7].reduce((s, a) => Math.max(s, loma(u, a, a + 0.18, a + 0.36, a + 0.6)), 0);
        const k = loma(u, 0, 0.2, 2.2, DURA.croa);
        m.garganta = Math.max(m.garganta, croada);
        m.agacha = 0.2 * croada;
        m.cabeza = -4 * k;
        m.parpados = [Math.max(m.parpados[0], 0.55 * k), Math.max(m.parpados[1], 0.55 * k)];
        break;
      }
      case 'caza':
        return momentoDeLaCaza(m, u);
      case 'corona': {
        // Estira el brazo, la endereza con dos toquecitos… y la corona se le vuelve a torcer sola.
        const brazo = loma(u, 0.2, 0.8, 1.5, 2);
        m.brazos = [0, -186 * brazo];
        const derecha = rampa(u, 0.8, 1.2) * (1 - rampa(u, 2.2, 2.9));
        m.corona = mezclar(QUIETO.corona, 0, derecha) + 3 * loma(u, 0.9, 1, 1.2, 1.4) * Math.sin(u * 30);
        // Ladea la cabeza hacia la mano, que el brazo de sapo no da para más.
        m.cabeza = 6 * brazo;
        m.mira = [0, -3 * loma(u, 1.9, 2.1, 2.8, DURA.corona)];
        break;
      }
      case 'tirita': {
        // Se abraza, tiembla entera, le sale vaho dos veces y el tul se le vuela.
        const k = loma(u, 0, 0.25, 2.4, DURA.tirita);
        m.tirita = 2.2 * k * Math.sin(u * 62);
        m.brazos = [-22 * k, 22 * k];
        m.tul = 7 * k * Math.sin(u * 17);
        m.corona = QUIETO.corona + 5 * k * Math.sin(u * 37);
        m.parpados = [Math.max(m.parpados[0], 0.8 * k), Math.max(m.parpados[1], 0.8 * k)];
        m.agacha = 0.3 * k;
        m.vaho = u > 0.6 && u < 1.6 ? u - 0.6 : u > 1.6 && u < 2.6 ? u - 1.6 : 0;
        break;
      }
      case 'zapato': {
        // Levanta el pie del zapatito, lo menea, lo mira de costado y suspira.
        const k = loma(u, 0, 0.6, 2.4, DURA.zapato);
        m.pie = 26 * k + 6 * loma(u, 0.9, 1.1, 1.8, 2) * Math.sin(u * 14);
        m.mira = [4 * k, 3 * k];
        m.cabeza = 8 * k;
        m.parpados = [mezclar(m.parpados[0], 0.15, k), mezclar(m.parpados[1], 0.15, k)];
        m.garganta = Math.max(m.garganta, 0.5 * loma(u, 2, 2.3, 2.5, 2.9));
        break;
      }
      case 'princesa':
        return momentoDelToque(m, u);
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
      aplicar(besoQuieto ? BESO : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté intentando volver. */
  const tocado = (t: number): void => {
    if (accion !== 'princesa') empezar('princesa', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      besoQuieto = !besoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la corona, y la página abre la ficha. */
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

export const armarSapito: Armar = (marcos, esc) => armarSapitoCon(marcos, esc);
