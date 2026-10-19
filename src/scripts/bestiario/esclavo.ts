/**
 * El esclavo sensible y chillón (`D-73`, decimoquinta vuelta), preso en la celda del fondo a la derecha
 * de la prisión de Barbazul, al lado de la ventana.
 *
 * *"Preso en mi ciudad"*, hecho conducta:
 *
 * - **Mira la calle.** Sentado en el catre, abrazado a las rodillas, mira por la reja de la ventana del
 *   fondo, donde flamean las banderas. Respira, parpadea con los párpados pesados, y de a ratos te mira
 *   a vos.
 * - **Casi llora.** Cada tanto le vienen tres hipos que le suben los hombros, baja los párpados, le
 *   tiembla el mentón, los ojos se le ponen al rojo vivo y la lágrima crece y baja por la mejilla; y se
 *   le corta: la lágrima se queda ahí, no cae (*"ahora ya no llora / casi ya no llora"*). La cadena del
 *   grillete se mece con cada hipo.
 * - **Esconde la cara.** Más de vez en cuando baja la cabeza a las rodillas y se queda un rato.
 * - **La drácula.** Cuando taconea cerca, la sigue con los ojos abiertos y al rojo vivo (*"atrapó un
 *   beso bienhechor / con ojos al rojo vivo"*), y a cada taco que apoya pega un respingo chico: es fácil
 *   para el gatillo. La lee de la escena (`#dracula-entera`, `[data-parte="taco"]`), sin tocarla.
 *
 * Tocado, **chilla**: se agarra del barrote, echa la cabeza para atrás y chilla con los ojos apretados; y
 * se le corta de golpe, te mira, traga y vuelve a abrazarse las rodillas (`chillidoEn`). Dice su verso.
 * Con movimiento reducido no se mueve nada: tocarlo lo pasa de la pose quieta al chillido y dice el verso.
 *
 * Se lleva números (`rig-esclavo.ts`) y nada que dibuje: la pose sale de la misma cuenta que la del HTML.
 */

import { DURA, ESCLAVO, GESTOS, VERSO, chillidoEn, sollozoEn, transformes, type Gesto, type Punto } from '../../lib/bestiario/rig-esclavo.ts';
import { hacia, partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-esclavo-sensible-y-chillon';

export type Modo = 'quieto' | 'sollozo' | 'rodillas' | 'chillido';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  primerSollozo: [5, 8],
  sollozo: [10, 18],
  primerasRodillas: [20, 30],
  rodillas: [28, 44],
  enRodillas: [3.4, 5.4],
  bajaARodillas: 0.9,
  vos: [8, 14],
  mirarte: [1.4, 2.4],
  parpadeo: [2.6, 6],
  respingo: 0.32,
  /** Lo que tarda la lágrima en volver al borde del ojo después de un sollozo. */
  seca: 6,
} as const;

/** Hasta dónde la sigue con los ojos: si la drácula pasa más lejos que esto, sigue mirando la calle. */
const ALCANCE = 330;

export interface Estado {
  modo: Modo;
  lagrima: number;
  mira: Punto;
  /** Cuántos respingos pegó con los tacos de la drácula. */
  respingos: number;
}

/** La `x` de la drácula, leída de la transformación de su títere en la escena, o `null` si no está. */
export function xDeLaDracula(transform: string | null | undefined): number | null {
  const m = /translate\(\s*(-?[\d.]+)/.exec(transform ?? '');
  return m ? Number(m[1]) : null;
}

/** Arma al esclavo con un azar que se puede fijar (el test lo fija). La isla usa `armarEsclavo`. */
export function armarEsclavoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--esclavo')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ modo: 'quieto', lagrima: GESTOS.calle.lagrima, mira: GESTOS.calle.mira, respingos: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();
  // La drácula: se la mira, no se la toca.
  const svg = marcos[0]?.ownerSVGElement ?? null;
  const dracula = svg?.querySelector<SVGGElement>('#dracula-entera') ?? null;
  const taco = svg?.querySelector<SVGGraphicsElement>('[data-parte="taco"]') ?? null;

  let modo: Modo = 'quieto';
  let desde = 0;
  let hasta = 0;
  let proximoSollozo = entre(TIEMPOS.primerSollozo);
  let proximasRodillas = entre(TIEMPOS.primerasRodillas);
  let proximoVos = entre(TIEMPOS.vos);
  let vosHasta = 0;
  let parpadeo = entre(TIEMPOS.parpadeo);
  let respingoEn = -10;
  let respingos = 0;
  let tacoAntes = 0;
  let draculaAntes: number | null = null;
  let caminaHasta = -10;
  let lagrima = GESTOS.calle.lagrima;
  // La cadena cuelga del grillete y se mece: un resorte con freno.
  const cadena = { p: 0, v: 0 };
  let hombrosAntes = 0;
  // Con movimiento reducido: cuál de las dos poses quietas está a la vista.
  let chillaQuieto = false;
  // Lo que se suaviza de cuadro en cuadro: arranca en la pose quieta.
  const suelto = { mira: [...GESTOS.calle.mira] as [number, number], cabeza: GESTOS.calle.cabeza, parpados: [...GESTOS.calle.parpados] as [number, number], rojo: GESTOS.calle.rojo };
  let ultimo: Gesto = GESTOS.calle;

  const empezar = (m: Modo, t: number): void => {
    modo = m;
    desde = t;
  };

  function decidir(t: number): void {
    switch (modo) {
      case 'quieto':
        if (t > proximoVos && t > vosHasta) {
          vosHasta = t + entre(TIEMPOS.mirarte);
          proximoVos = vosHasta + entre(TIEMPOS.vos);
        }
        if (t > proximoSollozo && t > vosHasta) {
          empezar('sollozo', t);
          proximoSollozo = t + DURA.sollozo + entre(TIEMPOS.sollozo);
        } else if (t > proximasRodillas && t > vosHasta) {
          empezar('rodillas', t);
          hasta = t + entre(TIEMPOS.enRodillas);
          proximasRodillas = hasta + entre(TIEMPOS.rodillas);
          proximoSollozo = Math.max(proximoSollozo, hasta + 3);
        }
        break;
      case 'sollozo':
        if (t - desde >= DURA.sollozo) {
          // La lágrima se quedó en la mejilla: de ahí vuelve de a poco.
          lagrima = Math.max(lagrima, 0.75);
          empezar('quieto', t);
        }
        break;
      case 'rodillas':
        if (t > hasta + TIEMPOS.bajaARodillas) empezar('quieto', t);
        break;
      case 'chillido':
        if (t - desde >= DURA.chillido) {
          empezar('quieto', t);
          proximoSollozo = Math.max(proximoSollozo, t + 7);
        }
        break;
    }
  }

  /** Adónde mira y cómo, sin lo que le pasa: la calle, vos, o la drácula si taconea cerca. */
  function mirada(t: number): Gesto {
    const x = xDeLaDracula(dracula?.getAttribute('transform'));
    if (x !== null && draculaAntes !== null && Math.abs(x - draculaAntes) > 0.05) caminaHasta = t + 1.4;
    draculaAntes = x;
    const base: Gesto = { ...GESTOS.calle, lagrima };
    if (t < vosHasta) return { ...GESTOS.vos, lagrima };
    if (x !== null && t < caminaHasta && Math.abs(x - ESCLAVO.x) < ALCANCE) {
      // La sigue con los ojos: la tiene siempre a la izquierda, a la altura de la cara.
      const haciaElla = Math.max(-1, Math.min(0.2, (x - ESCLAVO.x) / 220));
      return { ...base, mira: [haciaElla, 0.12], cabeza: -2.5, parpados: [0.16, 0.18], rojo: 0.8 };
    }
    return base;
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto()) {
      // Las dos poses quietas, tal cual: la de la calle es la del HTML.
      aplicar(transformes(chillaQuieto ? 'chillido' : 'calle'));
      return;
    }
    const paso = Math.min(dt, 0.1);
    if (paso > 0) decidir(t);

    // Lo de base, suavizado: adónde mira, la cabeza, los párpados, el rojo.
    const m = mirada(t);
    suelto.mira = [hacia(suelto.mira[0], m.mira[0], paso * 4), hacia(suelto.mira[1], m.mira[1], paso * 4)];
    suelto.cabeza = hacia(suelto.cabeza, m.cabeza, paso * 14);
    suelto.parpados = [hacia(suelto.parpados[0], m.parpados[0], paso * 2.5), hacia(suelto.parpados[1], m.parpados[1], paso * 2.5)];
    suelto.rojo = hacia(suelto.rojo, m.rojo, paso * 0.8);
    // Respira, encogido: los hombros suben y bajan apenas.
    const respira = Math.sin(t * 1.25) * 0.9;
    let gesto: Gesto = { ...m, mira: suelto.mira, cabeza: suelto.cabeza + Math.sin(t * 0.45) * 0.6, parpados: suelto.parpados, rojo: suelto.rojo, hombros: respira };

    // Esconde la cara en las rodillas: baja, se queda, y vuelve.
    if (modo === 'rodillas') {
      const u = t - desde;
      const k = Math.min(suave(u / TIEMPOS.bajaARodillas), suave((hasta + TIEMPOS.bajaARodillas - t) / TIEMPOS.bajaARodillas));
      const R = GESTOS.rodillas;
      const mz = (a: number, b: number): number => a + (b - a) * k;
      gesto = {
        ...gesto,
        mira: [mz(gesto.mira[0], R.mira[0]), mz(gesto.mira[1], R.mira[1])],
        parpados: [mz(gesto.parpados[0], R.parpados[0]), mz(gesto.parpados[1], R.parpados[1])],
        cabeza: mz(gesto.cabeza, R.cabeza),
        alza: mz(gesto.alza, R.alza),
        hombros: gesto.hombros + R.hombros * k,
        lagrima: mz(gesto.lagrima, R.lagrima),
        rojo: mz(gesto.rojo, R.rojo),
      };
    }
    if (modo === 'sollozo') gesto = sollozoEn(t - desde, gesto);
    if (modo === 'chillido') gesto = chillidoEn(t - desde, gesto);

    // La lágrima que quedó en la mejilla vuelve al borde del ojo de a poco, y ahí se queda.
    if (modo === 'quieto') lagrima = hacia(lagrima, GESTOS.calle.lagrima, (paso * 0.25) / TIEMPOS.seca);

    // Un taco de la drácula, cerca: el respingo.
    const golpe = Number(taco?.getAttribute('opacity') ?? 0);
    if (golpe > 0.9 && tacoAntes <= 0.9 && t < caminaHasta && modo !== 'chillido' && t - respingoEn > 0.6) {
      respingoEn = t;
      respingos++;
    }
    tacoAntes = golpe;
    const r = t - respingoEn;
    if (r >= 0 && r < TIEMPOS.respingo) {
      gesto = { ...gesto, hombros: gesto.hombros - 1.8 * Math.sin((Math.PI * r) / TIEMPOS.respingo), parpados: r < 0.13 ? [1, 1] : gesto.parpados };
    }

    // El parpadeo, salvo con los ojos apretados.
    if (t > parpadeo + 0.14) parpadeo = t + entre(TIEMPOS.parpadeo);
    if (t > parpadeo && t < parpadeo + 0.14) gesto = { ...gesto, parpados: [1, 1] };

    // La cadena: cada sacudón de los hombros la patea, y se mece hasta quedar colgando.
    if (paso > 0) {
      const sacudon = (gesto.hombros - hombrosAntes) / paso;
      cadena.v += sacudon * 0.9 + (modo === 'chillido' && t - desde < 0.3 ? 60 * paso : 0);
      cadena.v += (-cadena.p * 38 - cadena.v * 3.2) * paso;
      cadena.p = Math.max(-9, Math.min(9, cadena.p + cadena.v * paso));
    }
    hombrosAntes = gesto.hombros;
    gesto = { ...gesto, cadena: cadena.p };
    ultimo = gesto;
    aplicar(transformes(gesto));
  }

  function aplicar(t: Readonly<Record<string, string>>): void {
    for (const [nombre, valor] of Object.entries(t)) {
      const el = p.get(nombre);
      if (!el) continue;
      if (nombre === 'rojo') el.setAttribute('opacity', valor);
      else el.setAttribute('transform', valor);
    }
  }

  function chillar(t: number): void {
    // Si ya está chillando, no vuelve a empezar: el chillido sigue hasta que se le corta.
    if (modo === 'chillido' && t - desde < 1.3) return;
    empezar('chillido', t);
    vosHasta = 0;
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      chillaQuieto = !chillaQuieto;
      pintar(t, 0);
    } else chillar(t);
    // El bocadillo, arriba de la celda: que no le tape la cara.
    esc.hablar(ID, VERSO[0], VERSO[1]);
  };
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
      if (!esc.quieto()) chillar(t);
      return true;
    },
    estado: () => ({ modo, lagrima: ultimo.lagrima, mira: ultimo.mira, respingos }),
  };
}

export const armarEsclavo: Armar = (marcos, esc) => armarEsclavoCon(marcos, esc);
