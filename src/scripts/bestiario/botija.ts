/**
 * El botija rapado (`D-73`, vigesimocuarta vuelta), en la planchada del ferry que sale.
 *
 * Lo que hace solo es esperar con apuro, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Tararea**: cabecea al compás con los ojos entornados, la rodilla marca el tiempo y el boleto baila
 *   en los dientes.
 * - **Mira el reloj**: levanta la muñeca, lo mira, lo sacude y vuelve a mirar el ferry, con la ceja arriba.
 * - **Mira para atrás**, por si lo siguen: da vuelta la cabeza para el muelle, mira de un lado al otro y
 *   vuelve.
 * - **Se pasa la mano por la cabeza rapada**, de atrás para adelante, como quien todavía no se acostumbra.
 * - **Se acomoda el bolso**: sube el hombro, lo revolea con la cadera y se hamaca.
 * - **Zapatea** con la punta del pie de adelante, impaciente.
 * - **Respira**, y pestañea.
 *
 * Tocado, **zafa** (*"pudo cruzar el charco a tiempo / ¡Zafó!"*): salta del susto con la bocina, mira para
 * atrás, se agacha, corre planchada arriba, salta y llega a la borda con un pie solo, se tambalea revoleando
 * los brazos, y grita con los brazos para arriba: el boleto le salta de la boca y lo vuelve a agarrar con los
 * dientes. Después se baja de culo por la planchada, como en un tobogán, y se para donde estaba. Dice su
 * verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa a los brazos arriba con el grito.
 *
 * En el camino la planchada está estirada con `k`: lo que avanza (`viaje`) se estira igual, y el marco dice
 * cuánto (`data-dx`). Se lleva números (`rig-botija.ts`) y nada que dibuje.
 */

import { BOTIJA, BORDA, CORRIDA, QUIETO, VERSO, ZAFO, enLaPlanchada, marcas, type Momento, type Punto } from '../../lib/bestiario/rig-botija.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-botija-rapado';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { tararea: 3.4, reloj: 2.8, atras: 2.6, rasca: 2.4, bolso: 2, zapatea: 2.2, zafa: 8 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.4, 5.4] as const;
const PESTANEO = 0.16;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = {
  bocina: [0, 0.35], mira: [0.35, 1.1], agacha: [1.1, 1.35], corre: [1.35, 2.85], salta: [2.85, 3.45],
  tambalea: [3.45, 4.45], zafa: [4.45, 5.6], baja: [5.6, 7.3], levanta: [7.3, 8],
} as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclarP = (a: Punto, b: Punto, k: number): Punto => [mezclar(a[0], b[0], k), mezclar(a[1], b[1], k)];

/** Un momento entre dos, campo por campo. */
export function entreMomentos(a: Momento, b: Momento, k: number): Momento {
  return {
    viaje: mezclarP(a.viaje, b.viaje, k),
    cadera: mezclarP(a.cadera, b.cadera, k),
    inclina: mezclar(a.inclina, b.inclina, k),
    pies: [mezclarP(a.pies[0], b.pies[0], k), mezclarP(a.pies[1], b.pies[1], k)],
    puntas: [mezclar(a.puntas[0], b.puntas[0], k), mezclar(a.puntas[1], b.puntas[1], k)],
    brazos: [[mezclar(a.brazos[0][0], b.brazos[0][0], k), mezclar(a.brazos[0][1], b.brazos[0][1], k)], [mezclar(a.brazos[1][0], b.brazos[1][0], k), mezclar(a.brazos[1][1], b.brazos[1][1], k)]],
    ladea: mezclar(a.ladea, b.ladea, k),
    cabeceo: mezclarP(a.cabeceo, b.cabeceo, k),
    mira: mezclar(a.mira, b.mira, k),
    pupila: mezclarP(a.pupila, b.pupila, k),
    parpado: mezclar(a.parpado, b.parpado, k),
    ceja: mezclar(a.ceja, b.ceja, k),
    boca: mezclar(a.boca, b.boca, k),
    boleto: [mezclar(a.boleto[0], b.boleto[0], k), mezclar(a.boleto[1], b.boleto[1], k), mezclar(a.boleto[2], b.boleto[2], k)],
    bolso: mezclar(a.bolso, b.bolso, k),
    respira: mezclar(a.respira, b.respira, k),
    gotas: mezclar(a.gotas, b.gotas, k),
  };
}

/** Arriba de la planchada, donde cae cuando se baja de la borda. */
const TOPE: Punto = [(enLaPlanchada(0.92)[0] - BOTIJA.x) / BOTIJA.escala, (enLaPlanchada(0.92)[1] - BOTIJA.piso) / BOTIJA.escala];
/** La pendiente de la tabla, en las coordenadas del botija: por cada unidad para la derecha, cuánto sube. */
const SUBE = (enLaPlanchada(0)[1] - enLaPlanchada(1)[1]) / (enLaPlanchada(1)[0] - enLaPlanchada(0)[0]);

/** Sentado en la tabla, con las rodillas arriba y los brazos abiertos: el tobogán. */
const SENTADO: Momento = {
  ...QUIETO,
  cadera: [-2, -18],
  inclina: -12,
  pies: [[26, -28], [20, -24]],
  puntas: [-40, -34],
  brazos: [[-100, -24], [100, 20]],
  ladea: -6,
  pupila: [1, -0.6],
  parpado: 0.45,
  ceja: 2,
  boca: 0,
  bolso: 22,
};

/** En un pie en la borda: el de acá apoyado, el de allá en el aire. */
const EN_UN_PIE: Momento = { ...QUIETO, cadera: [0, -62], pies: [[-14, -24], [0, -5]], puntas: [10, 0], parpado: 0, ceja: 4, pupila: [0.4, 1.4] };

/**
 * El toque, sobre la pose de base de ese cuadro (quieta, con la respiración y el pestañeo): lo que hace a
 * los `u` segundos de que lo tocaron. El `viaje` va con `k` 1; la isla lo estira.
 */
export function momentoDelToque(base: Momento, u: number): Momento {
  const T = TOQUE_T;
  let m: Momento = { ...base };
  if (u < T.agacha[0]) {
    // La bocina: salta del susto, con los ojos de par en par. Y mira para atrás, al muelle, por si lo siguen.
    const susto = loma(u, 0, 0.07, 0.16, 0.35);
    const atras = loma(u, 0.42, 0.52, 0.95, 1.05);
    m = {
      ...m,
      viaje: [0, -10 * susto],
      pies: [[base.pies[0][0], base.pies[0][1] + 6 * susto], [base.pies[1][0], base.pies[1][1] + 6 * susto]],
      brazos: [[mezclar(base.brazos[0][0], 30, susto), -30], [mezclar(base.brazos[1][0], 40, susto), mezclar(base.brazos[1][1], -30, susto)]],
      ceja: 4 * rampa(u, 0, 0.1),
      parpado: mezclar(base.parpado, 0, rampa(u, 0, 0.08)),
      mira: 1 - 2 * atras,
      pupila: [1.2 * Math.sin(u * 22) * atras + 1 * (1 - atras), -0.4],
      gotas: 0.35 * loma(u, 0.02, 0.1, 0.3, 0.45),
      boleto: [0, 0, 8 * susto],
    };
  } else if (u < T.corre[0]) {
    // Se agacha para arrancar: la cadera baja, el cuerpo se tira para adelante y los brazos atrás.
    const k = rampa(u, T.agacha[0], T.agacha[1]);
    m = { ...m, cadera: [2, -63 + 9 * k], inclina: mezclar(base.inclina, 18, k), brazos: [[mezclar(base.brazos[0][0], 40, k), -30], [mezclar(base.brazos[1][0], 50, k), -30]], ceja: 2, parpado: 0.1 };
  } else if (u < T.salta[0]) {
    // Corre planchada arriba: cuatro trancos, los brazos bombeando, el bolso rebotando.
    const v = entreT(u, T.corre);
    const p = 0.35 * suave(v) + 0.65 * v;
    const fi = (u - T.corre[0]) * Math.PI * 2 * 2.7;
    const pie = (n: 0 | 1): Punto => {
      const a = fi + n * Math.PI;
      const x = 13 * Math.cos(a);
      return [x, -SUBE * x - 5 - Math.max(0, Math.sin(a)) * 11];
    };
    m = {
      ...m,
      viaje: [CORRIDA[0] * p, CORRIDA[1] * p],
      cadera: [3, -60 - 2.4 * Math.abs(Math.sin(fi))],
      inclina: 16,
      pies: [pie(0), pie(1)],
      puntas: [-26 + 14 * Math.sin(fi), -26 - 14 * Math.sin(fi)],
      brazos: [[-36 * Math.sin(fi), -70], [36 * Math.sin(fi), -70]],
      ladea: 4,
      cabeceo: [0, 1.4 * Math.abs(Math.sin(fi))],
      parpado: 0.1,
      ceja: 2,
      bolso: 12 * Math.sin(fi * 2),
      boleto: [0, 0, 6 * Math.sin(fi * 2)],
    };
  } else if (u < T.tambalea[0]) {
    // El salto a la borda: un arco, con las piernas recogidas y los brazos para adelante.
    const w = entreT(u, T.salta);
    const recoge = Math.sin(Math.PI * w);
    m = {
      ...m,
      viaje: [mezclar(CORRIDA[0], BORDA[0], w), mezclar(CORRIDA[1], BORDA[1], suave(w)) - 34 * recoge],
      cadera: [0, -62],
      inclina: 10,
      pies: [mezclarP([6, -10], [10, -24], recoge), mezclarP([-4, -6], [-4, -22], recoge)],
      puntas: [-10, 10],
      brazos: [[-120 * recoge - 20, -20], [-100 * recoge - 10, -30]],
      ceja: 4,
      parpado: 0,
      pupila: [0.4, 1.2],
      bolso: -24 * recoge,
    };
  } else if (u < T.zafa[0]) {
    // Llega con un pie, justo: se tambalea revoleando los brazos, y le saltan las gotas del susto.
    const v = u - T.tambalea[0];
    const calma = 1 - rampa(u, 3.9, T.tambalea[1]);
    const molino = v * 760;
    m = {
      ...EN_UN_PIE,
      respira: base.respira,
      viaje: BORDA,
      inclina: 22 * Math.sin(v * Math.PI * 2 * 1.8) * calma,
      cadera: [0, -62 + 2 * calma],
      pies: [[-14 + 6 * Math.sin(v * 13), -24 + 5 * Math.cos(v * 11)], [0, -5]],
      brazos: [[-(molino % 360) * calma - 40 * (1 - calma), -10], [(molino + 180) % 360 * calma + 40 * (1 - calma), 10]],
      ladea: -8 * Math.sin(v * 9) * calma,
      gotas: rampa(u, T.tambalea[0], T.tambalea[1] - 0.1),
      boleto: [0, 0, 14 * Math.sin(v * 30) * calma],
      bolso: 26 * Math.sin(v * 8) * calma,
    };
  } else if (u < T.baja[0]) {
    // ¡Zafó!: los brazos arriba, el grito, y el boleto que salta de la boca y vuelve a los dientes.
    const z = entreT(u, [4.5, 5.5]);
    const salto = Math.abs(Math.sin((u - T.zafa[0]) * Math.PI * 3));
    m = {
      ...ZAFO,
      respira: base.respira,
      viaje: [BORDA[0], BORDA[1] - 5 * salto],
      pies: [[7, -7 + 2 * salto], [0, -5]],
      puntas: [0, 0],
      brazos: [[ZAFO.brazos[0][0] + 10 * Math.sin(u * 14), ZAFO.brazos[0][1]], [ZAFO.brazos[1][0] - 10 * Math.sin(u * 14), ZAFO.brazos[1][1]]],
      boca: loma(u, 4.45, 4.55, 5.35, 5.48),
      boleto: [6 * Math.sin(Math.PI * z), -160 * z * (1 - z), -360 * z],
      gotas: mezclar(ZAFO.gotas, 1, rampa(u, 5.2, T.zafa[1])),
      parpado: z > 0.92 ? 0 : ZAFO.parpado,
    };
  } else if (u < T.levanta[0]) {
    // Se baja de un salto a la tabla, se sienta y se tira de culo planchada abajo, hasta donde estaba.
    const hop = entreT(u, [T.baja[0], 5.95]);
    const sienta = rampa(u, 5.9, 6.15);
    const desliza = entreT(u, [6.15, 7.15]);
    const viaje: Punto = u < 5.95
      ? [mezclar(BORDA[0], TOPE[0], hop), mezclar(BORDA[1], TOPE[1], hop) - 16 * Math.sin(Math.PI * hop)]
      : mezclarP(TOPE, [0, 0], 0.4 * desliza + 0.6 * desliza * desliza);
    m = { ...entreMomentos({ ...QUIETO, respira: base.respira }, SENTADO, sienta), viaje };
    m.boca = 0.7 * loma(u, 6.2, 6.35, 6.9, 7.1);
    m.bolso = SENTADO.bolso * sienta + 6 * Math.sin(u * 20) * desliza;
    m.pupila = [1, -0.6];
  } else {
    // Se para donde estaba, y se sacude la bermuda.
    const k = rampa(u, T.levanta[0], 7.75);
    m = entreMomentos(SENTADO, base, k);
    m.brazos = [m.brazos[0], [m.brazos[1][0] + 18 * loma(u, 7.6, 7.7, 7.85, 7.98), m.brazos[1][1] - 10 * Math.sin(u * 40) * loma(u, 7.6, 7.7, 7.85, 7.98)]];
    m.viaje = [0, 0];
  }
  return m;
}

/** Lo que hace en cada acción sola, a los `u` segundos de empezarla, sobre la pose de base. `lado` sortea un poco. */
export function momentoDeAccion(a: Exclude<Accion, 'zafa'>, base: Momento, u: number, lado = 1): Momento {
  const m: Momento = { ...base };
  switch (a) {
    case 'tararea': {
      // Cabecea al compás, con los ojos entornados; la rodilla marca el tiempo y el boleto baila.
      const k = loma(u, 0, 0.3, DURA.tararea - 0.4, DURA.tararea);
      const golpe = Math.abs(Math.sin(u * Math.PI * 2.2));
      m.cabeceo = [0.6 * k * Math.sin(u * Math.PI * 2.2), 1.8 * k * golpe];
      m.ladea = base.ladea + 7 * k * Math.sin(u * Math.PI * 1.1) * lado;
      m.parpado = mezclar(base.parpado, 0.75, k);
      m.cadera = [base.cadera[0], base.cadera[1] + 1.6 * k * golpe];
      m.brazos = [base.brazos[0], [base.brazos[1][0], base.brazos[1][1] + 8 * k * Math.sin(u * Math.PI * 4.4)]];
      m.boleto = [0, 0, 8 * k * Math.sin(u * Math.PI * 2.2)];
      m.bolso = 3 * k * Math.sin(u * Math.PI * 2.2);
      break;
    }
    case 'reloj': {
      // Levanta la muñeca, mira el reloj, lo sacude, y mira el ferry con la ceja arriba.
      const k = loma(u, 0, 0.4, 1.9, 2.4);
      const sacude = loma(u, 1.0, 1.1, 1.4, 1.5) * Math.sin(u * 50);
      m.brazos = [base.brazos[0], [mezclar(base.brazos[1][0], -58, k), mezclar(base.brazos[1][1], -64, k) + 14 * sacude]];
      m.ladea = base.ladea + 14 * k;
      m.pupila = mezclarP(base.pupila, [0.2, 1.2], k);
      m.parpado = mezclar(base.parpado, 0.1, k);
      m.ceja = 3 * loma(u, 1.6, 1.8, 2.4, DURA.reloj);
      m.pupila = mezclarP(m.pupila, [1.4, -0.6], loma(u, 1.8, 2, 2.5, DURA.reloj));
      break;
    }
    case 'atras': {
      // Da vuelta la cabeza para el muelle, mira de un lado al otro, y vuelve.
      const k = loma(u, 0.15, 0.3, 2.1, 2.3);
      m.mira = 1 - 2 * k;
      m.pupila = [k * 1.3 * Math.sin(u * 4.4), -0.2];
      m.ceja = 3 * k;
      m.parpado = mezclar(base.parpado, 0.05, k);
      m.cadera = [base.cadera[0], base.cadera[1] + 2 * k];
      m.brazos = [base.brazos[0], [base.brazos[1][0] - 6 * k, base.brazos[1][1] - 10 * k]];
      break;
    }
    case 'rasca': {
      // La mano por la cabeza rapada, de la nuca a la frente y de vuelta, con los ojos cerrados.
      const k = loma(u, 0, 0.4, 1.9, DURA.rasca);
      const va = Math.sin(u * Math.PI * 2 * 1.6);
      m.brazos = [base.brazos[0], [mezclar(base.brazos[1][0], -162 + 10 * va, k), mezclar(base.brazos[1][1], -10 - 8 * va, k)]];
      m.parpado = mezclar(base.parpado, 0.85, k);
      m.ladea = base.ladea + 6 * k;
      m.cabeceo = [0, 1.2 * k];
      break;
    }
    case 'bolso': {
      // Sube el hombro, revolea el bolso con la cadera y se hamaca hasta quedar.
      const k = loma(u, 0, 0.2, 0.5, 0.8);
      const hamaca = rampa(u, 0.35, 0.45) * Math.exp(-(u - 0.4) * 2.6) * Math.sin((u - 0.4) * 14);
      m.cadera = [base.cadera[0] - 2 * k, base.cadera[1] - 2 * k];
      m.inclina = base.inclina - 6 * k;
      m.bolso = -26 * k + 16 * hamaca;
      m.brazos = [base.brazos[0], [base.brazos[1][0] + 14 * k, base.brazos[1][1] - 20 * k]];
      break;
    }
    case 'zapatea': {
      // La punta del pie de adelante golpea la tabla, impaciente; la ceja baja.
      const k = loma(u, 0, 0.2, 1.8, DURA.zapatea);
      const golpe = Math.max(0, Math.sin(u * Math.PI * 2 * 3.2));
      m.puntas = [base.puntas[0] - 22 * golpe * k, base.puntas[1]];
      m.pies = [[base.pies[0][0] - 1.6 * golpe * k, base.pies[0][1] - 1.4 * golpe * k], base.pies[1]];
      m.ceja = -1.6 * k;
      m.pupila = mezclarP(base.pupila, [1.4, 0], k);
      m.ladea = base.ladea - 3 * k;
      break;
    }
  }
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al botija con un azar que se puede fijar (el test lo fija). La isla usa `armarBotija`. */
export function armarBotijaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--botija')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { tararea: 0, reloj: 0, atras: 0, rasca: 0, bolso: 0, zapatea: 0, zafa: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();
  // En el camino la planchada se estiró con `k`: lo que avanza a lo ancho se estira igual.
  const dx = Number(marcos[0]?.dataset.dx ?? 0);
  const k = dx > 0 ? 1 + dx / BOTIJA.ancla : 1;

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let zafoQuieto = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = (['tararea', 'reloj', 'atras', 'rasca', 'bolso', 'zapatea'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'zafa' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO };
    // Quieto: respira, y el bolso se le mece apenas.
    m.respira = Math.sin(t * 1.9);
    m.bolso = 1.4 * Math.sin(t * 0.9);
    const u = t - desde;
    const hecho = accion === 'zafa' ? momentoDelToque(m, u) : accion ? momentoDeAccion(accion, m, u, lado) : m;
    // El pestañeo va encima de lo que esté haciendo: los dos párpados hasta abajo, y suben.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) hecho.parpado = mezclar(hecho.parpado, 1, Math.sin((ojo / PESTANEO) * Math.PI));
    return hecho;
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas({ ...m, viaje: [m.viaje[0] * k, m.viaje[1]] });
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero') p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(zafoQuieto ? ZAFO : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté zafando. */
  const tocado = (t: number): void => {
    if (accion !== 'zafa') empezar('zafa', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      zafoQuieto = !zafoQuieto;
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

export const armarBotija: Armar = (marcos, esc) => armarBotijaCon(marcos, esc);
