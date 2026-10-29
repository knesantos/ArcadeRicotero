/**
 * El Dr. Saturno (`D-73`, decimoctava vuelta), atendiendo al costado del templo de Momo.
 *
 * Lo que hace solo es lo de un doctor que no pisa el piso, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Flota** siempre, subiendo y bajando de a poco, con la sombra que se achica en el piso; el anillo se
 *   le ladea como un trompo que se cansa, y las tres lunitas le dan la vuelta a la cabeza, pasando por
 *   delante y por detrás.
 * - **Ausculta**: levanta la campana del estetoscopio y se escucha el anillo. Las lunitas se frenan para
 *   no hacer ruido.
 * - **Se prende el espejo** de frente, el de los doctores de antes: un destello de oro.
 * - **Llama al que sigue**: levanta el turnero y mira para el templo.
 * - **Se acomoda el anillo**: lo hace bailar, y las lunitas se desbocan.
 *
 * Tocado, **da un turno** (*"Dr. Saturno, dame un turno!"*): estira el turnero para el lado de quien mira,
 * sale el boleto, que se va volando y cae dando vueltas al piso del templo, y el anillo se desboca con el
 * halo prendido. Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de quieto a
 * dando el turno.
 *
 * Se lleva números (`rig-saturno.ts`) y nada que dibuje.
 */

import { QUIETO, SATURNO_ARMADO, TURNO, VERSO, bocaDelTurnero, marcas, type Momento, type Punto } from '../../lib/bestiario/rig-saturno.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-doctor-saturno';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { ausculta: 3, espejo: 1.6, llama: 2.4, gira: 2.6, turno: 3.8 } as const;
export type Accion = keyof typeof DURA;

/** Cuánto espera entre una cosa y otra, y antes de la primera. */
export const PAUSA = [1.4, 3.6] as const;
export const PRIMERA = [1, 2.4] as const;

/** Cuánto espera para abrir la ficha después del toque: que se vea salir el boleto. */
export const DEMORA_FICHA = 1.2;

/** Lo rápido que dan la vuelta las lunitas (radianes por segundo), tranquilas y desbocadas. */
export const VUELTA_LUNAS = { tranquila: 0.85, desbocada: 7 } as const;

/** Adónde cae el boleto: al piso del templo, adelante y a la izquierda de él (coordenadas del títere). */
export const CAE: Punto = [-150, -6];

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Lo que lleva hecho: para el test. */
export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  lunas: number;
}

/** Arma al Dr. Saturno con un azar que se puede fijar (el test lo fija). La isla usa `armarSaturno`. */
export function armarSaturnoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--saturno')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { ausculta: 0, espejo: 0, llama: 0, gira: 0, turno: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, lunas: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let lunas = QUIETO.lunas;
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let turnoQuieto = false;
  // Para dónde mira cuando llama, y para qué lado hace bailar el anillo.
  let lado = 1;

  function elegir(): Accion {
    const opciones = (['ausculta', 'espejo', 'llama', 'gira'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'turno' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number, dt: number): Momento {
    const m: Momento = { ...QUIETO, brazos: [0, 0], boleto: { ...QUIETO.boleto } };
    // Flota siempre, con dos olas que no coinciden; el anillo se ladea como un trompo cansado.
    m.flota = QUIETO.flota + 5 * Math.sin(t * 1.1) + 2 * Math.sin(t * 2.7 + 1);
    m.inclina = 1.6 * Math.sin(t * 0.6);
    m.anillo = 4 * Math.sin(t * 0.45) + 1.5 * Math.sin(t * 1.3);
    m.cabeza = 2 * Math.sin(t * 0.37 + 2);
    m.brazos = [2 * Math.sin(t * 0.8), -2 * Math.sin(t * 0.7 + 1)];
    let rapidez: number = VUELTA_LUNAS.tranquila;
    const u = t - desde;
    switch (accion) {
      case 'ausculta': {
        // La campana sube hasta el anillo, la cabeza se ladea para escuchar, y las lunitas se frenan.
        const k = loma(u, 0, 0.7, 2.3, DURA.ausculta);
        m.brazos = [m.brazos[0], mezcla(m.brazos[1], -62, k)];
        m.cabeza += 9 * k;
        rapidez *= 1 - 0.85 * k;
        break;
      }
      case 'espejo': {
        m.espejo = Math.sin(Math.PI * rampa(u, 0.3, 1.2));
        m.cabeza -= 5 * loma(u, 0, 0.3, 1.2, DURA.espejo);
        break;
      }
      case 'llama': {
        // El turnero en alto, y la cabeza que busca al que sigue para el lado del templo.
        const k = loma(u, 0, 0.5, 1.8, DURA.llama);
        m.brazos = [mezcla(m.brazos[0], 34, k), m.brazos[1]];
        m.cabeza -= 10 * k;
        m.inclina -= 3 * k;
        rapidez *= 1 + 1.5 * k;
        break;
      }
      case 'gira': {
        // Hace bailar el anillo: se le ladea para los dos lados, cada vez menos, y las lunitas se desbocan.
        const k = loma(u, 0, 0.2, 2, DURA.gira);
        m.anillo += lado * 18 * Math.sin(u * 7) * (1 - u / DURA.gira) * k;
        rapidez = mezcla(rapidez, VUELTA_LUNAS.desbocada * 0.7, k);
        m.halo = 0.4 * k;
        break;
      }
      case 'turno': {
        // El turnero para adelante, sale el boleto y se va volando hasta el piso; el anillo se desboca.
        const k = loma(u, 0, 0.5, 2.8, DURA.turno);
        m.brazos = [mezcla(m.brazos[0], TURNO.brazos[0], k), mezcla(m.brazos[1], TURNO.brazos[1], k)];
        m.inclina = mezcla(m.inclina, TURNO.inclina, k);
        m.cabeza = mezcla(m.cabeza, TURNO.cabeza, k);
        m.flota = mezcla(m.flota, TURNO.flota, k);
        m.espejo = Math.sin(Math.PI * rampa(u, 0.3, 1.1));
        m.halo = loma(u, 0.2, 0.6, 2.4, 3.4);
        m.anillo += 10 * Math.sin(u * 9) * loma(u, 0.3, 0.6, 2, 3);
        rapidez = mezcla(rapidez, VUELTA_LUNAS.desbocada, loma(u, 0.2, 0.6, 2.4, 3.4));
        // El boleto: sale de la boca del turnero (que sube con lo que flota), vuela, y cae dando vueltas.
        const [bx, by] = bocaDelTurnero(m.brazos[0]);
        const sale: Punto = [bx, by - m.flota];
        const vuela = rampa(u, 0.6, 1.3);
        const cae = rampa(u, 1.3, 3.2);
        const arriba: Punto = [TURNO.boleto.x, TURNO.boleto.y];
        const x = u < 1.3 ? mezcla(sale[0], arriba[0], vuela) : mezcla(arriba[0], CAE[0], cae) + Math.sin(u * 5) * 14 * (1 - cae);
        const y = u < 1.3 ? mezcla(sale[1], arriba[1], vuela) - Math.sin(Math.PI * vuela) * 30 : mezcla(arriba[1], CAE[1], cae * cae);
        m.boleto = { x, y, giro: u < 1.3 ? mezcla(0, TURNO.boleto.giro, vuela) : TURNO.boleto.giro + Math.sin(u * 6) * 40 * (1 - cae), ve: u < 0.55 ? 0 : 1 - rampa(u, 3.3, DURA.turno) };
        break;
      }
    }
    lunas += rapidez * dt;
    m.lunas = lunas;
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
      aplicar(turnoQuieto ? TURNO : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté dando un turno. */
  const tocado = (t: number): void => {
    if (accion !== 'turno') empezar('turno', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      turnoQuieto = !turnoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba del anillo, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, lunas }),
  };
}

/** Las lunitas que pasan por delante en un momento: para el test. */
export const lunasAdelante = (m: Momento): number => SATURNO_ARMADO.lunas.filter((_, i) => marcas(m).opacity[`luna-delante-${i + 1}`] === '1').length;

export const armarSaturno: Armar = (marcos, esc) => armarSaturnoCon(marcos, esc);
