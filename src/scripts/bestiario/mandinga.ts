/**
 * Mandinga (`D-73`, vigesimosegunda vuelta), el títere de sombra parado en el damero del infierno.
 *
 * Lo que hace solo es estar ahí, gentil, y nada es un bucle: elige qué hacer cada vez. La llama del candil
 * tiembla siempre, y la sombra de la pared tiembla con ella.
 *
 * - **Saluda**: se saca el sombrero, gentil, y se le ven los cuernos.
 * - **Se seca la nariz con la manga.**
 * - **Baila una conga**: rebota en las botas, y suena el cascabel.
 * - **Se ríe**: se sacude entero, con la cara quieta, y el cascabel.
 * - **Mira a Luzbelito**, y vuelve.
 *
 * Tocado, **encandila y se va** (*"siniestro pero gentil, una sombra chinesca que le encandila a su muerte y
 * se va"*): saluda con el sombrero, el candil se aviva y en la pared crece su sombra chinesca, con los cuernos
 * largos, las garras y la cola; un fogonazo encandila, y el recorte se pone de canto y no está más. La sombra
 * se apaga sola en la pared. Después vuelve a darse vuelta, y se pone el sombrero. Dice su verso. Con
 * movimiento reducido no se mueve nada: tocarlo lo pasa de quieto al saludo.
 *
 * Se lleva números (`rig-mandinga.ts`) y nada que dibuje.
 */

import { GENTIL, MANGA, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-mandinga.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'mandinga';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { saluda: 2.6, manga: 2.2, conga: 3, risa: 2, mira: 2.6, encandila: 6.8 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.6;

/** Los tiempos del toque: el saludo, la sombra, el fogonazo, cuándo no está y cuándo vuelve. */
export const ENCANDILA_T = { saluda: [0, 0.7], sombra: [0.6, 2.6], destello: [2.6, 2.75, 3, 3.5], se_va: [2.75, 3.1], vuelve: [4.6, 5.3], sombrero: [5.6, 6.4] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

/** El temblor de la llama del candil, de 0 a 1, que nunca se repite igual. */
export const tiembla = (t: number): number => 0.5 + 0.25 * Math.sin(t * 13) + 0.15 * Math.sin(t * 29 + 1) + 0.1 * Math.sin(t * 47 + 2);

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a Mandinga con un azar que se puede fijar (el test lo fija). La isla usa `armarMandinga`. */
export function armarMandingaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--mandinga')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { saluda: 0, manga: 0, conga: 0, risa: 0, mira: 0, encandila: 0 };
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
  let gentilQuieto = false;

  function elegir(): Accion {
    const opciones = (['saluda', 'manga', 'conga', 'risa', 'mira'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'encandila' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO, brazos: [...QUIETO.brazos], codos: [...QUIETO.codos] };
    // Quieto, gentil: apenas se hamaca en las varillas, y la llama del candil tiembla con su sombra.
    m.hamaca = 1.4 * Math.sin(t * 0.7);
    m.cascabel = 5 * Math.sin(t * 2.1);
    m.llama = QUIETO.llama * (0.5 + tiembla(t));
    m.sombra = QUIETO.sombra * (0.8 + 0.4 * tiembla(t));
    m.crece = 0.06 * tiembla(t);
    const u = t - desde;
    switch (accion) {
      case 'saluda': {
        const k = loma(u, 0, 0.6, 1.8, DURA.saluda);
        m.brazos = [GENTIL.brazos[0] * k, 0];
        m.sombrero = k;
        m.hamaca -= 6 * k;
        m.cabeza = 8 * loma(u, 0.4, 0.8, 1.4, 1.9);
        m.cascabel += 16 * k * Math.sin(u * 7);
        break;
      }
      case 'manga': {
        // Con la manga seca su nariz: la lleva, la pasa de un lado al otro, y la baja.
        const k = loma(u, 0, 0.5, 1.6, DURA.manga);
        m.brazos = [MANGA.brazo * k, 0];
        m.codos = [MANGA.codo * k + 10 * k * Math.sin(u * 14), 0];
        m.cabeza = -6 * k;
        break;
      }
      case 'conga': {
        // Meta conga: rebota en las botas nuevas, para un lado y para el otro, y suena el cascabel.
        const k = loma(u, 0, 0.3, 2.6, DURA.conga);
        m.rebota = 8 * k * Math.abs(Math.sin(u * 7));
        m.hamaca += 7 * k * Math.sin(u * 3.5);
        m.brazos = [20 * k * Math.sin(u * 7), -20 * k * Math.sin(u * 7)];
        m.cascabel += 24 * k * Math.sin(u * 14);
        break;
      }
      case 'risa': {
        // Se ríe con todo el cuerpo, y la cara, tan expresiva como las botas, no se le mueve.
        const k = loma(u, 0, 0.2, 1.6, DURA.risa);
        m.rebota = 3 * k * Math.abs(Math.sin(u * 22));
        m.hamaca -= 4 * k;
        m.cascabel += 30 * k * Math.sin(u * 18);
        break;
      }
      case 'mira': {
        // Mira para el lado de Luzbelito, y vuelve.
        const k = loma(u, 0, 0.5, 1.8, DURA.mira);
        m.cabeza = -10 * k;
        m.hamaca -= 3 * k;
        break;
      }
      case 'encandila': {
        const T = ENCANDILA_T;
        const saludo = rampa(u, T.saluda[0], T.saluda[1]) * (1 - rampa(u, T.sombrero[0], T.sombrero[1]));
        m.brazos = [GENTIL.brazos[0] * saludo * (1 - rampa(u, T.se_va[0], T.se_va[1]) * (1 - rampa(u, T.vuelve[0], T.vuelve[1]))), 0];
        m.sombrero = saludo;
        m.hamaca = mezcla(m.hamaca, GENTIL.hamaca, saludo);
        m.cabeza = GENTIL.cabeza * saludo;
        m.cascabel += 20 * saludo * Math.sin(u * 8);
        // El candil se aviva, y la sombra crece en la pared.
        const vivo = loma(u, T.sombra[0], T.sombra[1], 3.2, 4.4);
        m.llama = mezcla(m.llama, 1, vivo) * (0.85 + 0.15 * tiembla(t));
        m.crece = rampa(u, T.sombra[0], T.sombra[1]);
        m.sombra = mezcla(m.sombra, GENTIL.sombra, vivo) * (0.9 + 0.1 * tiembla(t));
        // El fogonazo que encandila, y el recorte se pone de canto: se va.
        m.destello = loma(u, T.destello[0], T.destello[1], T.destello[2], T.destello[3]);
        m.giro = 1 - rampa(u, T.se_va[0], T.se_va[1]) * (1 - rampa(u, T.vuelve[0], T.vuelve[1]));
        break;
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
      aplicar(gentilQuieto ? GENTIL : QUIETO);
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
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté encandilando. */
  const tocado = (t: number): void => {
    if (accion !== 'encandila') empezar('encandila', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      gentilQuieto = !gentilQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de los cuernos, y la página abre la ficha. */
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

export const armarMandinga: Armar = (marcos, esc) => armarMandingaCon(marcos, esc);
