/**
 * El esclavo encadenado (`D-73`, vigesimoprimera vuelta), arrodillado adelante de la celda de los reos.
 *
 * Lo que hace solo, y nada es un bucle: elige cada vez.
 *
 * - **Respira** con el pecho, y las cadenas se mecen de su peso.
 * - **Tironea**: el antebrazo da tres tirones cortos y la cadena alta se sacude entera.
 * - **Ruge**: echa la cabeza para atrás con la boca abierta y le tiembla.
 * - **Aprieta**: el puño de abajo se cierra de bronca y la cadena del costado se hamaca.
 *
 * Tocado, **rompe la cadena**: carga agachándose, da el tirón, el eslabón salta con una chispa roja y la
 * cadena alta se va volando al piso; la cabeza ruge para atrás con el puño en alto. Y después la cadena
 * vuelve a estar en el puño, colgando como antes, y él baja un poco la cabeza: atrapado en libertad, que
 * es su verso. Lo dice a mitad del rugido. Con movimiento reducido no se mueve nada: tocarlo lo pasa de
 * la pose del dibujo a la de la cadena rota.
 *
 * Se lleva números (`rig-encadenado.ts`) y nada que dibuje.
 */

import { QUIETO, ROTA, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-encadenado.ts';
import { suave } from './articular.ts';
import { sacudir } from './sacudon.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-esclavo-encadenado';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { tironea: 2.4, ruge: 2.6, aprieta: 2, rompe: 5.4 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1, 2.6] as const;
export const PRIMERA = [0.5, 1.5] as const;
/** El verso sale en el medio del rugido, con la cadena ya volando. */
export const DEMORA_FICHA = 1.5;

/**
 * El toque, por tramos: hasta `carga` se agacha juntando fuerza, en `tiron` salta el eslabón, la
 * cadena tarda `cae` en llegar al piso, ruge entre `ruge`, y la cadena vuelve al puño entre `vuelve`.
 */
export const ROMPE = { carga: 0.5, tiron: 0.6, cae: 1.3, ruge: [0.62, 2.7], vuelve: [3.5, 4.5] } as const;
/** Adónde se va la cadena rota: despedida para la izquierda, sube un poco, gira y cae al piso (en píxeles del máster). */
export const VUELO = { x: -250, y: 340, giro: 55, sube: 90 } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  /** Cuántas veces saltó el eslabón (pidió el sacudón). */
  rotas: number;
}

/** El momento del toque, a `u` segundos de que lo tocaron, encima de `m` (lo que estaba haciendo). */
export function rompeEn(u: number, m: Momento): Momento {
  const R = ROMPE;
  const carga = loma(u, 0, R.carga, R.carga, R.tiron);
  const arriba = loma(u, R.carga, R.tiron, R.vuelve[0] - 0.8, R.vuelve[0]);
  const ruge = loma(u, R.ruge[0], R.ruge[0] + 0.15, R.ruge[1] - 0.5, R.ruge[1]);
  const desde = u - R.tiron;
  const vuela = desde > 0 ? Math.min(1, desde / R.cae) : 0;
  const amortigua = desde > 0 ? Math.exp(-desde * 1.4) : 0;
  const vuelve = rampa(u, R.vuelve[0], R.vuelve[1]);
  const gacha = loma(u, R.vuelve[0], R.vuelve[1], R.vuelve[1] + 0.3, DURA.rompe);
  return {
    ...m,
    respira: m.respira + 0.8 * carga,
    antebrazo: m.antebrazo + 8 * carga - 12 * arriba + 1.5 * Math.sin(u * 30) * ruge,
    cabeza: m.cabeza + 5 * carga - 9 * ruge + 2 * Math.sin(u * 27) * ruge + 6 * gacha,
    puno: m.puno + 6 * carga - 12 * ruge + 3 * Math.sin(u * 22) * ruge,
    punta: m.punta + 22 * Math.sin(desde * 7) * amortigua,
    baja: m.baja + 12 * Math.sin(desde * 5) * amortigua,
    // Antes del tirón cuelga del puño; al saltar, se va volando y se apaga; y después vuelve a estar.
    alta:
      desde <= 0
        ? { ...m.alta, giro: m.alta.giro + 6 * carga }
        : u < R.vuelve[0]
          ? { giro: VUELO.giro * vuela, x: VUELO.x * vuela, y: VUELO.y * vuela * vuela - VUELO.sube * Math.sin(Math.PI * vuela), o: 1 - rampa(u, R.tiron + 0.7, R.tiron + R.cae) }
          : { giro: m.alta.giro - 22 * (1 - vuelve) * Math.cos((u - R.vuelve[0]) * 6), x: 0, y: 0, o: vuelve },
    chispa: desde > 0 ? 1 - rampa(u, R.tiron + 0.05, R.tiron + 0.4) : 0,
  };
}

/** Arma al esclavo con un azar que se puede fijar (el test lo fija). La isla usa `armarEncadenado`. */
export function armarEncadenadoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--encadenado')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { tironea: 0, ruge: 0, aprieta: 0, rompe: 0 };
  let rotas = 0;
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, rotas }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let rotaQuieta = false;
  let salto = false;

  function elegir(): Accion {
    const opciones = (['tironea', 'ruge', 'aprieta'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'rompe' ? ultima : a;
    desde = t;
    salto = false;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    // Respira, y las cadenas se mecen de su peso, cada una a su ritmo.
    const m: Momento = {
      ...QUIETO,
      respira: Math.sin(t * 1.7),
      cabeza: 1.2 * Math.sin(t * 0.8 + 1),
      antebrazo: 0.8 * Math.sin(t * 0.9),
      punta: 3 * Math.sin(t * 1.3 + 2),
      baja: 2.5 * Math.sin(t * 1.1),
      alta: { ...QUIETO.alta, giro: 1.5 * Math.sin(t * 0.9 + 0.5) },
    };
    const u = t - desde;
    switch (accion) {
      case 'tironea': {
        // Tres tirones cortos: el antebrazo baja de golpe y vuelve, y la cadena alta se sacude.
        const k = loma(u, 0, 0.2, 1.9, DURA.tironea);
        const tiron = Math.max(0, Math.sin(u * 8)) ** 3;
        m.antebrazo += 6 * tiron * k;
        m.alta.giro += -5 * tiron * k + 3 * Math.sin(u * 13) * k;
        m.punta += 8 * Math.sin(u * 9) * k;
        m.cabeza += 2 * tiron * k;
        m.respira += 0.6 * tiron * k;
        break;
      }
      case 'ruge': {
        // La cabeza para atrás, la boca abierta al techo, y le tiembla.
        const k = loma(u, 0, 0.45, 1.9, DURA.ruge);
        m.cabeza += -8 * k + 1.8 * Math.sin(u * 26) * k;
        m.puno += -5 * k;
        m.respira += 0.7 * k;
        break;
      }
      case 'aprieta': {
        // El puño de abajo se cierra de bronca, y la cadena del costado se hamaca.
        const k = loma(u, 0, 0.3, 1.5, DURA.aprieta);
        m.puno += -9 * k + 2.5 * Math.sin(u * 20) * k;
        m.baja += 10 * Math.sin(u * 4.5) * k;
        break;
      }
      case 'rompe':
        return rompeEn(u, m);
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
      aplicar(rotaQuieta ? ROTA : QUIETO);
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
    // El eslabón salta una sola vez por toque, y pega en la cámara.
    if (accion === 'rompe' && !salto && t - desde >= ROMPE.tiron) {
      salto = true;
      rotas++;
      sacudir(0.35);
    }
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté rompiendo la cadena. */
  const tocado = (t: number): void => {
    if (accion !== 'rompe') empezar('rompe', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      rotaQuieta = !rotaQuieta;
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
    estado: () => ({ accion, hechas: { ...hechas }, rotas }),
  };
}

export const armarEncadenado: Armar = (marcos, esc) => armarEncadenadoCon(marcos, esc);
