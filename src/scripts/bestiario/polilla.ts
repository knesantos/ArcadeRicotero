/**
 * La polilla (`D-73`, vigesimocuarta vuelta), colgada del cable de la guirnalda del templo, al lado de un foco.
 *
 * Lo que hace sola es no poder con la luz, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Da la ronda**: suelta el cable, cae un poco, agarra vuelo y le da vueltas a la luz a tirones, con un
 *   radio que va y viene, y se la lleva por delante tres veces. El foco se hamaca, parpadea y le saca polvo.
 *   Después vuelve a colgarse.
 * - **Abre y cierra las alas**: las junta para arriba sobre el lomo, como una polilla quieta, y las vuelve a
 *   abrir. Dos veces. Las estampitas aparecen y se esconden.
 * - **Se limpia las antenas**: suelta una pata del cable, se tira la antena para abajo y se la peina, colgada
 *   de una sola. Después la otra.
 * - **Tirita**: las alas le tiemblan rápido, para calentarse, y se le cae el polvo.
 * - **Mira la luz**: ladea la cabeza para el foco, le apunta las antenas, abre los ojos y estira una pata.
 * - **Respira**, se hamaca colgada y pestañea, haga lo que haga.
 *
 * Tocada, **insiste** (*"otra polilla en busca de la luz"*): suelta el cable y va derecho a la luz, se da el
 * golpe —el chispazo, el foco que se hamaca y parpadea, el polvo que le salta de las alas—, sale despedida
 * dando una vuelta en el aire, queda mareada con los ojos hechos remolinos mientras le cae el polvo, sacude la
 * cabeza y vuelve a ir derecho. Otro golpe. Y se vuelve a colgar del cable, como si nada. Dice su verso. Con
 * movimiento reducido no se mueve nada: tocarla la pasa del cable a pegada al vidrio.
 *
 * Se lleva números (`rig-polilla.ts`) y nada que dibuje.
 */

import { FOCO, INSISTE, MAREO, POLILLA, QUIETO, RONDA, SUELTAS, TOQUE_T, VERSO, contraElVidrio, enLaRonda, golpesDeLaRonda, marcas, type Momento, type Punto } from '../../lib/bestiario/rig-polilla.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-polilla';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { ronda: RONDA.dura, abre: 3, limpia: 3.4, tirita: 2.2, mira: 2.6, insiste: TOQUE_T.dura } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.6, 1.6] as const;
/** La ficha se abre en el primer golpe. */
export const DEMORA_FICHA = 1.35;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.6, 5.4] as const;
const PESTANEO = 0.26;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclarP = (a: Punto, b: Punto, k: number): Punto => [mezclar(a[0], b[0], k), mezclar(a[1], b[1], k)];
const R: Punto = [POLILLA.x, POLILLA.y];

/** Un momento nuevo, copia del de base, que se puede tocar. */
const copia = (m: Momento): Momento => ({ ...m, donde: [...m.donde], antenas: [...m.antenas], parpados: [...m.parpados], patas: [...m.patas], polvo: m.polvo.map((p) => [...p] as const) });

/* ------------------------------------------------------------------
   El polvo de las alas: cada mota sale de un lugar en un momento, y cae
   ------------------------------------------------------------------ */

/** De qué parte de las alas sale cada mota, en el recinto (desde el medio del tórax). */
const DE_LAS_ALAS: readonly Punto[] = [[-24, -2], [22, 2], [-16, 14], [18, 16]];
/** Una tanda de polvo: la mota, cuándo sale, de dónde (el medio de la polilla) y cuánto vive. */
type Tanda = readonly [number, number, Punto, number];

/** Dónde está cada mota a los `u` segundos: cae despacio, zigzagueando, y se apaga. */
export function polvoEn(u: number, tandas: readonly Tanda[]): Momento['polvo'] {
  return [0, 1, 2, 3].map((k) => {
    const t = tandas.filter(([m, e, , vida]) => m === k && u >= e && u - e < vida).at(-1);
    if (!t) return [0, 0, 0] as const;
    const [, e, [x, y], vida] = t;
    const a = u - e;
    const [ox, oy] = DE_LAS_ALAS[k]!;
    return [x + ox + 6 * Math.sin(2.6 * a + k) * Math.min(1, a * 2), y + oy + 17 * a + 5 * a * a, 0.9 * rampa(a, 0, 0.12) * (1 - rampa(a, vida * 0.45, vida))] as const;
  });
}

/** El foco que se hamaca cuando se lo lleva por delante: un péndulo que se va apagando. */
const hamaca = (u: number, h: number, fuerza: number): number => (u < h ? 0 : fuerza * Math.exp(-(u - h) / 0.9) * Math.sin(2 * Math.PI * 1.3 * (u - h)));
/** El foco que parpadea después del golpe, como un foco flojo. */
const titila = (u: number, h: number): number => loma(u, h + 0.12, h + 0.16, h + 0.42, h + 0.55) * (0.5 + 0.5 * Math.sign(Math.sin(37 * u)));
/** El chispazo del golpe. */
const chispa = (u: number, h: number): number => loma(u, h - 0.01, h + 0.02, h + 0.08, h + 0.28);

/** El aleteo de vuelo: rápido, con las alas que suben y bajan casi enteras. */
function aletea(m: Momento, u: number, k: number, hz = 7.5, fuerza = 1): void {
  const fase = u * Math.PI * 2 * hz;
  m.alas = mezclar(m.alas, 0.5 + 0.45 * fuerza * Math.cos(fase), k);
  m.aleteo = mezclar(m.aleteo, 10 + 26 * fuerza * Math.sin(fase), k);
}

/* ------------------------------------------------------------------
   La ronda
   ------------------------------------------------------------------ */

/** La ronda alrededor de la luz, sobre la pose de base: lo que hace a los `u` segundos de empezarla. */
export function momentoDeLaRonda(base: Momento, u: number, lado: 1 | -1, fase: number): Momento {
  const m = copia(base);
  const D = RONDA.dura;
  const p = enLaRonda(u, lado, fase);
  const q = enLaRonda(u + 0.03, lado, fase);
  const vuela = loma(u, 0.05, 0.4, D - 0.7, D - 0.1);
  const suelta = loma(u, 0, 0.15, D - 0.45, D - 0.1);
  m.donde = p;
  m.ladeo = Math.max(-22, Math.min(22, ((q[0] - p[0]) / 0.03) * 0.12)) * vuela;
  m.patas = [SUELTAS * suelta, SUELTAS * suelta];
  m.cuelga = mezclar(m.cuelga, 24, vuela);
  m.antenas = [mezclar(m.antenas[0], 16, vuela), mezclar(m.antenas[1], 16, vuela)];
  m.parpados = [mezclar(m.parpados[0], 0, vuela), mezclar(m.parpados[1], 0, vuela)];
  aletea(m, u, vuela);
  const golpes = golpesDeLaRonda(fase);
  const tandas: Tanda[] = [];
  golpes.forEach((h, i) => {
    const g = chispa(u, h);
    m.golpe = Math.max(m.golpe, 0.85 * g);
    m.foco += hamaca(u, h, 12 * Math.sign(enLaRonda(h, lado, fase)[0] - FOCO.centro[0]));
    m.brillo = Math.max(0, m.brillo + 0.3 * g - 0.55 * titila(u, h));
    m.parpados = [Math.max(m.parpados[0], 0.8 * g), Math.max(m.parpados[1], 0.8 * g)];
    // Cada golpe le saca dos motas de polvo de las alas.
    const donde = enLaRonda(h, lado, fase);
    tandas.push([(2 * i) % 4, h, donde, 1.5], [(2 * i + 1) % 4, h + 0.04, donde, 1.5]);
  });
  m.polvo = polvoEn(u, tandas.filter(([, e, , vida]) => e + vida < D + 0.3));
  return m;
}

/* ------------------------------------------------------------------
   El toque: insiste
   ------------------------------------------------------------------ */

/** Dónde está en el toque, a los `u` segundos, si la tocaron estando en `desde`. */
export function dondeEnElToque(u: number, desde: Punto = R): Punto {
  const T = TOQUE_T;
  const cae: Punto = [R[0] + 4, R[1] + 12];
  const c1 = contraElVidrio(cae);
  if (u < T.va[0]) return mezclarP(desde, cae, rampa(u, 0, T.va[0]));
  // Va derecho a la luz, cada vez más ligero.
  if (u < T.golpe) return mezclarP(cae, c1, entreT(u, T.va) ** 2);
  // El golpe la tira para atrás y abajo, lejos de Momo.
  if (u < T.mareada[0]) {
    const v = entreT(u, T.rebota);
    return mezclarP(c1, MAREO, 1 - (1 - v) ** 2);
  }
  // Mareada: da vueltitas chicas en el aire y se va cayendo de a poco.
  const mareada = (w: number): Punto => [MAREO[0] + 9 * Math.sin(2 * Math.PI * 0.8 * w), MAREO[1] + 5 * Math.sin(2 * Math.PI * 1.6 * w) + 3 * w];
  const fin = T.vuelve[0] - T.mareada[0];
  if (u < T.vuelve[0]) return mareada(u - T.mareada[0]);
  const m0 = mareada(fin);
  const c2 = contraElVidrio(m0);
  // Insiste: otra vez derecho, más ligero todavía.
  if (u < T.golpe2) return mezclarP(m0, c2, entreT(u, T.vuelve) ** 2.4);
  const rebote: Punto = [c2[0] + 26, c2[1] + 14];
  if (u < T.posa[0]) return mezclarP(c2, rebote, 1 - (1 - entreT(u, T.rebota2)) ** 2);
  // Y vuelve al cable, como si nada.
  return mezclarP(rebote, R, suave(entreT(u, T.posa)));
}

/**
 * El toque, sobre la pose de base de ese cuadro (colgada, con la respiración y el pestañeo): lo que hace a
 * los `u` segundos de que la tocaron. `desde` es dónde estaba y cuánto estaba ladeada.
 */
export function momentoDelToque(base: Momento, u: number, desde: { donde: Punto; ladeo: number } = { donde: R, ladeo: 0 }): Momento {
  const T = TOQUE_T;
  const m = copia(base);
  m.donde = dondeEnElToque(u, desde.donde);
  const vuela = loma(u, 0, 0.25, T.posa[1] - 0.4, T.posa[1]);
  const suelta = loma(u, 0, 0.18, 6.9, 7.35);
  m.patas = [SUELTAS * suelta, SUELTAS * suelta];
  m.cuelga = mezclar(m.cuelga, 24, vuela);
  // Volando ladeada para donde va; el golpe la hace dar una vuelta entera en el aire, y mareada se tambalea.
  const va = (dondeEnElToque(u + 0.03, desde.donde)[0] - m.donde[0]) / 0.03;
  const tumbo = 360 * (1 - (1 - entreT(u, T.rebota)) ** 2) * rampa(u, T.golpe, T.golpe + 0.01);
  const tambalea = 18 * Math.sin(2 * Math.PI * 0.7 * (u - T.mareada[0])) * loma(u, T.mareada[0], T.mareada[0] + 0.3, T.sacude[0], T.sacude[1]);
  m.ladeo = desde.ladeo * (1 - rampa(u, 0, 0.4)) + Math.max(-22, Math.min(22, va * 0.1)) * vuela * (1 - loma(u, T.golpe, T.golpe + 0.02, T.vuelve[0] - 0.1, T.vuelve[0])) + (u < T.mareada[0] ? tumbo : 0) + tambalea;
  // El aleteo: fuerte para ir, flojo y desparejo mareada.
  const mareada = loma(u, T.rebota[0] + 0.2, T.mareada[0], T.sacude[0], T.sacude[1]);
  aletea(m, u, vuela, mezclar(7.5, 3.6, mareada), mezclar(1, 0.55 + 0.25 * Math.sin(u * 5), mareada));
  // Los ojos: los aprieta en cada golpe, y mareada son dos remolinos.
  const g1 = chispa(u, T.golpe);
  const g2 = chispa(u, T.golpe2);
  m.mareo = rampa(u, T.golpe + 0.12, T.golpe + 0.4) * (1 - rampa(u, T.sacude[0] + 0.2, T.sacude[1]));
  m.giroMareo = 420 * u;
  const abre = loma(u, 0.1, 0.4, 7.2, 7.7);
  m.parpados = [Math.max(mezclar(base.parpados[0], 0, abre), 0.9 * Math.max(g1, g2)), Math.max(mezclar(base.parpados[1], 0, abre), 0.9 * Math.max(g1, g2))];
  // Las antenas: apuntan a la luz al ir, se le caen mareada, y se paran cuando sacude la cabeza.
  const apunta = loma(u, 0.3, 0.6, T.golpe, T.golpe + 0.1) + loma(u, T.vuelve[0], T.vuelve[0] + 0.15, T.golpe2, T.golpe2 + 0.1);
  const caidas = loma(u, T.golpe, T.golpe + 0.3, T.sacude[0], T.sacude[0] + 0.4);
  m.antenas = [
    mezclar(m.antenas[0], -30, apunta) + 58 * caidas + 6 * caidas * Math.sin(u * 4),
    mezclar(m.antenas[1], 26, apunta) + 50 * caidas + 6 * caidas * Math.sin(u * 4 + 1),
  ];
  // Sacude la cabeza para despabilarse, y la ladea mareada.
  m.cabeza = 14 * Math.sin(2 * Math.PI * 7 * u) * loma(u, T.sacude[0], T.sacude[0] + 0.1, T.sacude[1] - 0.15, T.sacude[1]) + 10 * Math.sin(2 * Math.PI * 0.7 * u + 1) * caidas - 10 * apunta;
  // El foco: el chispazo, la hamaca y el parpadeo de foco flojo.
  m.golpe = Math.max(g1, 0.8 * g2);
  m.foco += hamaca(u, T.golpe, 16) + hamaca(u, T.golpe2, 11);
  m.brillo = Math.max(0, m.brillo + 0.3 * Math.max(g1, g2) - 0.6 * titila(u, T.golpe) - 0.4 * titila(u, T.golpe2));
  // El polvo: cada golpe le saca las cuatro motas, y mareada se le cae un poco más.
  const c1 = dondeEnElToque(T.golpe);
  const c2 = dondeEnElToque(T.golpe2);
  m.polvo = polvoEn(u, [
    [0, T.golpe, c1, 1.7], [1, T.golpe + 0.03, c1, 1.7], [2, T.golpe + 0.05, c1, 2.6], [3, T.golpe + 0.08, c1, 2.6],
    [0, 3.2, dondeEnElToque(3.2), 1.4], [1, 3.4, dondeEnElToque(3.4), 1.3],
    [0, T.golpe2, c2, 1.5], [1, T.golpe2 + 0.03, c2, 1.5], [2, T.golpe2 + 0.05, c2, 1.6], [3, T.golpe2 + 0.08, c2, 1.6],
  ]);
  return m;
}

/* ------------------------------------------------------------------
   Lo que hace sola, colgada
   ------------------------------------------------------------------ */

/** Abre y cierra las alas, dos veces: las junta para arriba sobre el lomo y las vuelve a abrir. */
function abre(m: Momento, u: number): void {
  const k = Math.max(loma(u, 0.2, 0.65, 1.0, 1.45), loma(u, 1.6, 2.0, 2.25, 2.75));
  m.alas = mezclar(m.alas, 0.04, k);
  m.aleteo = mezclar(m.aleteo, 2, k);
  m.antenas = [m.antenas[0] + 5 * k, m.antenas[1] + 5 * k];
  m.parpados = [Math.max(m.parpados[0], 0.55 * k), Math.max(m.parpados[1], 0.55 * k)];
  m.panza += 4 * k * Math.sin(u * 3);
}

/** Se limpia las antenas: suelta una pata, se tira la antena para abajo y se la peina. Después la otra. */
function limpia(m: Momento, u: number, primera: 0 | 1): void {
  for (const [n, a, b] of [[primera, 0.15, 1.6], [1 - primera, 1.75, 3.2]] as const) {
    const k = loma(u, a, a + 0.3, b - 0.3, b);
    const peina = Math.sin((u - a) * Math.PI * 2 * 2.4);
    const s = n === 0 ? 1 : -1;
    const patas: [number, number] = [m.patas[0], m.patas[1]];
    const antenas: [number, number] = [m.antenas[0], m.antenas[1]];
    patas[n] = mezclar(patas[n], 10 + 9 * peina, k);
    antenas[n] = mezclar(antenas[n], 40 + 6 * peina, k);
    m.patas = patas;
    m.antenas = antenas;
    // Colgada de una sola pata, se le va el cuerpo para ese lado; la cabeza, para la antena.
    m.ladeo += -s * 7 * k;
    m.cabeza += -s * 9 * k;
    m.parpados = [Math.max(m.parpados[0], 0.5 * k), Math.max(m.parpados[1], 0.5 * k)];
  }
}

/** Tirita: las alas le tiemblan rápido para calentarse, y se le cae el polvo. */
function tirita(m: Momento, u: number): void {
  const k = loma(u, 0, 0.2, DURA.tirita - 0.4, DURA.tirita);
  m.aleteo += 9 * k * Math.sin(2 * Math.PI * 16 * u);
  m.alas -= 0.1 * k * Math.abs(Math.sin(2 * Math.PI * 8 * u));
  m.donde = [m.donde[0] + 1.2 * k * Math.sin(2 * Math.PI * 13 * u), m.donde[1]];
  m.antenas = [m.antenas[0] + 5 * k * Math.sin(u * 40), m.antenas[1] + 5 * k * Math.sin(u * 40 + 2)];
  m.parpados = [mezclar(m.parpados[0], 0.75, k), mezclar(m.parpados[1], 0.75, k)];
  m.polvo = polvoEn(u, [[0, 0.35, R, 1.6], [1, 0.42, R, 1.6], [2, 0.9, R, 1.25], [3, 0.98, R, 1.2]]);
}

/** Mira la luz: ladea la cabeza para el foco, le apunta las antenas, abre los ojos y estira una pata. */
function mira(m: Momento, u: number): void {
  const k = loma(u, 0.2, 0.6, 2.0, 2.5);
  const estira = loma(u, 0.7, 1.0, 1.6, 1.95);
  m.cabeza -= 14 * k;
  m.antenas = [mezclar(m.antenas[0], -26, k), mezclar(m.antenas[1], 18, k)];
  m.parpados = [mezclar(m.parpados[0], 0, k), mezclar(m.parpados[1], 0, k)];
  m.ladeo -= 6 * k;
  m.patas = [m.patas[0] + estira * (46 + 8 * Math.sin(u * 22)), m.patas[1]];
  m.aleteo += 10 * k;
  m.brillo += 0.1 * k * Math.sin(u * 9);
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la polilla con un azar que se puede fijar (el test lo fija). La isla usa `armarPolilla`. */
export function armarPolillaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--polilla')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { ronda: 0, abre: 0, limpia: 0, tirita: 0, mira: 0, insiste: 0 };
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
  let insisteQuieta = false;
  let lado: 1 | -1 = 1;
  let fase = 0;
  let pestanea = entre(PESTANEA);
  let ultimo: Momento = QUIETO;
  let deDonde: { donde: Punto; ladeo: number } = { donde: R, ladeo: 0 };

  function elegir(): Accion {
    const opciones = (['ronda', 'abre', 'limpia', 'tirita', 'mira'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'insiste' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
    fase = azar();
  }

  function base(t: number): Momento {
    const m = copia(QUIETO);
    // Colgada: respira con la panza, se hamaca apenas del cable, y las antenas le buscan el aire.
    m.respira = Math.sin(t * 2.3);
    m.panza = 2.5 * Math.sin(t * 0.55);
    m.cuelga = 3 * Math.sin(t * 0.7);
    m.ladeo = 1.6 * Math.sin(t * 0.43);
    m.antenas = [2.5 * Math.sin(t * 0.9), 2.5 * Math.sin(t * 0.9 + 1.3)];
    m.aleteo = QUIETO.aleteo + 1.5 * Math.sin(t * 0.6);
    m.foco = 0.8 * Math.sin(t * 0.8 + 0.4);
    m.brillo = QUIETO.brillo + 0.05 * Math.sin(t * 7.3) * Math.sin(t * 2.9);
    // El pestañeo: rápido, los dos juntos.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      m.parpados = [mezclar(m.parpados[0], 1, k), mezclar(m.parpados[1], 1, k)];
    }
    return m;
  }

  function momento(t: number): Momento {
    const m = base(t);
    const u = t - desde;
    switch (accion) {
      case 'ronda':
        return momentoDeLaRonda(m, u, lado, fase);
      case 'abre':
        abre(m, u);
        break;
      case 'limpia':
        limpia(m, u, lado < 0 ? 0 : 1);
        break;
      case 'tirita':
        tirita(m, u);
        break;
      case 'mira':
        mira(m, u);
        break;
      case 'insiste':
        return momentoDelToque(m, u, deDonde);
    }
    return m;
  }

  function aplicar(m: Momento): void {
    ultimo = m;
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
      aplicar(insisteQuieta ? INSISTE : QUIETO);
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

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté insistiendo. Si estaba volando, sale de ahí. */
  const tocado = (t: number): void => {
    if (accion === 'insiste') return;
    deDonde = { donde: [...ultimo.donde], ladeo: ultimo.ladeo };
    empezar('insiste', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      insisteQuieta = !insisteQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba del foco, y la página abre la ficha. */
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

export const armarPolilla: Armar = (marcos, esc) => armarPolillaCon(marcos, esc);

/** Lo que hace sola colgada, sobre una pose de base: para el test y para mirarla. */
export function momentoSola(accion: 'abre' | 'limpia' | 'tirita' | 'mira', base: Momento, u: number): Momento {
  const m = copia(base);
  if (accion === 'abre') abre(m, u);
  else if (accion === 'limpia') limpia(m, u, 0);
  else if (accion === 'tirita') tirita(m, u);
  else mira(m, u);
  return m;
}
