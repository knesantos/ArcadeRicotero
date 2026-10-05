/**
 * El menú de Skayboy y Poligirl, la tarjeta de fin de nivel y el rótulo de entrada (`D-61`).
 *
 * ## Qué se construye
 *
 * - **El menú**, sobre el tubo y los mandos: al entrar y cuando se abre desde la partida (que queda en
 *   pausa). Un botón grande —jugar el nivel que corresponde, o seguir el que estaba en pausa— y
 *   **los seis niveles, todos abiertos**, cada uno con su número, su nombre (`CNT-21`) y si está
 *   pasado. El candado de orden se fue con `D-61` punto 2: la fila manda **dónde se retoma**, no
 *   qué se puede jugar.
 * - **La tarjeta de fin de nivel**: en el mismo cuadro en que se gana, arriba del área, nombra el
 *   nivel pasado y ofrece seguir, repetir o elegir otro. El toque sobre el área (`#seguir-juego`) sigue
 *   valiendo igual: esto se suma, no lo reemplaza.
 * - **El rótulo de entrada**: el número y el nombre del nivel, un rato, al empezar cada uno.
 *
 * ## Por qué vive acá y no en la isla
 *
 * Por lo mismo que `escena.ts`: la isla no se carga en Node, y lo que decide —qué ficha está
 * pasada, a qué nivel lleva cada botón, cuándo se ve la tarjeta— es lo que tiene que poder verse
 * en rojo. Lo juega `menu.test.ts`. La isla pone el pegamento con el DOM.
 *
 * **Nada de esto dibuja en el canvas** (`ADR-08.2` punto 4): son capas de HTML adentro de
 * `.fichin`, que es lo único que se ve en la pantalla completa del sistema (`ADR-10.5`).
 */

import { siguienteDeLaFila, type Avance } from './avance.ts';
import { siguienteAlGanar } from './escena.ts';
import { crearMundo, type Mundo } from './mundo.ts';
import type { IdPersonaje, Nivel } from './niveles.ts';

/* =========================================================================================
   Dónde está cada nivel en la fila
   ========================================================================================= */

/** El número de un nivel en la fila sembrada, contando desde 1. `undefined` si no está sembrado. */
export function numeroDelNivel(niveles: readonly Nivel[], id: string): number | undefined {
  const i = niveles.findIndex((n) => n.id === id);
  return i < 0 ? undefined : i + 1;
}

/** Un nivel con su lugar en la fila: lo que necesita cualquier texto que lo nombre. */
export interface NivelEnLaFila {
  readonly id: string;
  readonly numero: number;
  readonly total: number;
  readonly nombre: string;
}

/** Ese nivel con su número y el total de la fila, o `undefined` si no está sembrado. */
export function enLaFila(niveles: readonly Nivel[], nivel: Pick<Nivel, 'id' | 'nombre'>): NivelEnLaFila | undefined {
  const numero = numeroDelNivel(niveles, nivel.id);
  return numero === undefined ? undefined : { id: nivel.id, numero, total: niveles.length, nombre: nivel.nombre };
}

/* =========================================================================================
   El menú
   ========================================================================================= */

/**
 * **En qué momento se abre el menú**, que decide qué dice el botón grande:
 *
 * - `entrada`: el nivel está armado y nadie jugó todavía (el reloj del mundo en cero). Es el menú
 *   con que abre la página: el botón grande juega.
 * - `pausa`: el nivel está empezado y sin ganar. El botón grande sigue ese mismo nivel, ahí donde
 *   estaba; y aparece el de empezarlo de nuevo.
 * - `ganado`: se abrió desde la tarjeta de fin de nivel. El botón grande juega el que sigue.
 *
 * El reloj del mundo solo corre con el menú cerrado (la isla no juega el tic con el menú abierto),
 * así que "reloj en cero" es "nadie jugó este mundo".
 */
export type Momento = 'entrada' | 'pausa' | 'ganado';

export function momentoDe(mundo: Pick<Mundo, 'terminado' | 'tiempo'>): Momento {
  if (mundo.terminado) return 'ganado';
  return mundo.tiempo > 0 ? 'pausa' : 'entrada';
}

/**
 * **El nivel del botón grande.** Con el mundo ganado, el que sigue (`siguienteAlGanar()`: en el
 * último, el primero de la fila, igual que el toque de seguir). Si no, el mismo que está armado:
 * al entrar es el primero sin pasar —lo eligió `nivelAJugar()` al arrancar—, y en pausa es el que
 * se estaba jugando.
 */
/**
 * **Qué ficha dice "acá estás"** (`CNT-40` §1.2): la del nivel armado cuando hay algo armado —una
 * partida en pausa, o un nivel recién ganado—, y ninguna en la entrada, porque ahí nadie está en
 * ningún lado todavía: ponerle el sello al nivel que va a jugar el botón grande diría dos veces lo
 * mismo.
 */
export function actualDelMenu(mundo: Mundo): string | null {
  return momentoDe(mundo) === 'entrada' ? null : mundo.nivel.id;
}

export function nivelDelBotonGrande(mundo: Mundo, niveles: readonly Nivel[]): Nivel {
  return siguienteAlGanar(mundo, niveles) ?? mundo.nivel;
}

/** Lo que el menú muestra de cada nivel. */
export interface FichaDelMenu extends NivelEnLaFila {
  /** Ganado alguna vez en este aparato (`avance.pasados`). */
  readonly pasado: boolean;
  /** El que está armado: en pausa, "acá estás". */
  readonly actual: boolean;
}

/**
 * **Las fichas del menú**: una por nivel sembrado, en el orden de la fila, todas tocables. Las
 * pasadas lo dicen; la del nivel armado también. Lo que ganó otra pestaña cuenta si la isla le
 * pasa el avance recién leído (`cargarAvance()` une lo guardado con lo que hay en memoria).
 */
export function fichasDelMenu(niveles: readonly Nivel[], avance: Avance, actual: string | null): FichaDelMenu[] {
  return niveles.map((n, i) => ({
    id: n.id,
    numero: i + 1,
    total: niveles.length,
    nombre: n.nombre,
    pasado: avance.pasados.includes(n.id),
    actual: n.id === actual,
  }));
}

/**
 * Dónde se retoma, para quien llega sin nada armado: el primero sin pasar, o el primero de la fila
 * si están todos (`CTR-16.11.2`, sin cambios). Es lo mismo que elige `nivelAJugar()` sin pedido.
 */
export function dondeSeRetoma(niveles: readonly Nivel[], avance: Avance): Nivel | undefined {
  return siguienteDeLaFila(niveles, avance) ?? niveles[0];
}

/**
 * **Lo que hace tocar una ficha**: el mundo de ese nivel, recién armado, con `deFrente` vacío (nadie
 * arranca con el cuadro de frente del nivel de antes). Un id que no está en lo sembrado —basura,
 * o un borrador que en producción no se sirve— no arma nada: `undefined`.
 *
 * La ficha del nivel que está en pausa **no** pasa por acá: tocarla sigue la partida donde
 * estaba (`alTocarFicha()`). Empezarlo de nuevo es otro botón.
 */
export function alElegirNivel(mundo: Mundo, niveles: readonly Nivel[], id: string, deFrente: Set<IdPersonaje>): Mundo | undefined {
  const nivel = niveles.find((n) => n.id === id);
  if (nivel === undefined) return undefined;
  deFrente.clear();
  return crearMundo(mundo.banco, nivel);
}

/**
 * Qué hace tocar una ficha, según el momento: **la del nivel en pausa sigue la partida** (devuelve
 * el mismo mundo, sin tocarlo); cualquier otra —o la misma ya ganada— arma ese nivel de cero.
 */
export function alTocarFicha(mundo: Mundo, niveles: readonly Nivel[], id: string, deFrente: Set<IdPersonaje>): Mundo | undefined {
  if (id === mundo.nivel.id && momentoDe(mundo) !== 'ganado') return mundo;
  return alElegirNivel(mundo, niveles, id, deFrente);
}

/** **Empezar el mismo nivel de nuevo**: el mundo de ese nivel, de cero, con `deFrente` vacío. */
export function alRepetir(mundo: Mundo, deFrente: Set<IdPersonaje>): Mundo {
  deFrente.clear();
  return crearMundo(mundo.banco, mundo.nivel);
}

/* =========================================================================================
   La tarjeta de fin de nivel
   ========================================================================================= */

/** Lo que dice la tarjeta: el nivel pasado, el que sigue, y si era el último. */
export interface FinDeNivel {
  readonly pasado: NivelEnLaFila;
  readonly sigue: NivelEnLaFila;
  readonly ultimo: boolean;
}

/**
 * **La tarjeta de fin de nivel**, o `null` si no corresponde: sin ganar, o con un nivel que no está
 * en lo sembrado (no hay a dónde seguir, igual que `seguirVisible()`). En el sexto, `sigue` es el
 * primero de la fila y `ultimo` es `true`: la tarjeta dice que era el último y por qué lo que
 * sigue es el 1.
 */
export function finDeNivel(mundo: Mundo, niveles: readonly Nivel[]): FinDeNivel | null {
  const siguiente = siguienteAlGanar(mundo, niveles);
  if (siguiente === undefined) return null;
  const pasado = enLaFila(niveles, mundo.nivel);
  const sigue = enLaFila(niveles, siguiente);
  if (pasado === undefined || sigue === undefined) return null;
  return { pasado, sigue, ultimo: pasado.numero === pasado.total };
}

/** Lo único de la tarjeta que toca esta función: si está escondida. */
export interface Escondible {
  hidden: boolean;
}

/**
 * Pone la tarjeta como tiene que estar con este mundo: **a la vista desde el cuadro en que se gana**
 * (`D-32` límite 3), escondida mientras se juega y mientras el menú está abierto. La isla la llama
 * después de cada `jugarTic(`, como `mostrarSeguir()`. Solo escribe si cambia, y devuelve si quedó
 * a la vista: la isla llena los textos solo cuando aparece.
 */
export function mostrarFinDeNivel(tarjeta: Escondible | null, mundo: Mundo, niveles: readonly Nivel[], menuAbierto: boolean): boolean {
  const verla = !menuAbierto && finDeNivel(mundo, niveles) !== null;
  if (tarjeta !== null && tarjeta.hidden === verla) tarjeta.hidden = !verla;
  return verla;
}

/* =========================================================================================
   El rótulo de entrada
   ========================================================================================= */

/**
 * Cuánto se queda el rótulo de entrada, en milisegundos. No es una animación —aparece y se va,
 * sin transición, así que el movimiento reducido no tiene nada que apagar—: es lo que tarda en
 * leerse "NIVEL 3 DE 6" y un nombre de cinco palabras, más un respiro.
 */
export const DURACION_DEL_ROTULO_MS = 2600;

/* =========================================================================================
   Dónde va el menú (`UX-37` §3.3)
   ========================================================================================= */

/** Un rectángulo en px CSS, medido desde la ventana. */
export interface Rectangulo {
  readonly izquierda: number;
  readonly arriba: number;
  readonly ancho: number;
  readonly alto: number;
}

/** Lo que la isla mide del fichín para ubicar el menú. */
export interface PiezasDelFichin {
  /** El tubo con su bisel: `.recorte`. */
  readonly recorte: Rectangulo;
  /** Las dos columnas de mando. Las que miden cero —escondidas— no cuentan. */
  readonly mandos: readonly Rectangulo[];
  /** La chapa del pie de homenaje. */
  readonly pie: Rectangulo;
  readonly ventana: { readonly ancho: number; readonly alto: number };
  /** Si la página está en el modo de pantalla completa (`ADR-10`). */
  readonly enElModo: boolean;
  /** El aire que se deja contra los bordes en el modo, en px CSS (`--tecla-aire`). */
  readonly aire: number;
  /**
   * Dónde empieza el pie del sitio (la firma y los créditos), en la ventana. Parado, el menú baja
   * hasta el borde de la ventana pero no los tapa. Sin pie, el borde de la ventana.
   */
  readonly tope?: number;
}

const tieneArea = (r: Rectangulo): boolean => r.ancho > 0 && r.alto > 0;

/**
 * **La región del menú** (`UX-37` §3.3): la del tubo y los mandos, **nunca la del pie de homenaje**
 * (`BR-26`) ni la de la cabecera.
 *
 * - **En el modo**, la sala entera: la ventana menos el pie, con aire contra los bordes.
 * - **Parado** —las columnas de mando debajo del tubo—, la zona de las teclas, hasta el borde de
 *   la ventana si sobra: el tubo queda a la vista arriba, con el nivel dibujado. El pie está entre
 *   los dos, en el mueble, y no se toca.
 * - **De costado** —las columnas a los lados—, de borde a borde de las columnas y a la altura del
 *   tubo: el pie, que va debajo del tubo, queda afuera. Y en el apilado acostado de un teléfono
 *   chico —las columnas abajo, afuera de la pantalla—, la misma franja de borde a borde.
 *
 * Sin columnas que midan algo (no debería pasar fuera del modo), el tubo solo.
 */
export function regionDelMenu(p: PiezasDelFichin): Rectangulo {
  if (p.enElModo) {
    const abajo = Math.min(p.ventana.alto, tieneArea(p.pie) ? p.pie.arriba : p.ventana.alto);
    return {
      izquierda: p.aire,
      arriba: p.aire,
      ancho: Math.max(0, p.ventana.ancho - 2 * p.aire),
      alto: Math.max(0, abajo - 2 * p.aire),
    };
  }
  const mandos = p.mandos.filter(tieneArea);
  const r = p.recorte;
  if (mandos.length === 0) return r;
  const izquierda = Math.min(...mandos.map((m) => m.izquierda));
  const derecha = Math.max(...mandos.map((m) => m.izquierda + m.ancho));
  const debajo = mandos.every((m) => m.arriba >= r.arriba + r.alto);
  if (debajo && p.ventana.ancho > p.ventana.alto) {
    // Acostado y con las teclas abajo —el apilado de un teléfono chico de costado, 568 x 320—: las
    // teclas caen afuera de la pantalla, y el menú ahí no se vería al entrar. Va en la franja del
    // tubo, de borde a borde de la ventana, como de costado: a los lados del mueble no hay nada.
    return { izquierda: p.aire, arriba: r.arriba, ancho: Math.max(0, p.ventana.ancho - 2 * p.aire), alto: r.alto };
  }
  if (debajo) {
    // Hasta el borde de la ventana si sobra lugar abajo de las teclas: ahí no hay nada del juego, y
    // el menú entra sin desplazarse.
    const arriba = Math.min(...mandos.map((m) => m.arriba));
    const limite = (p.tope === undefined ? p.ventana.alto : Math.min(p.ventana.alto, p.tope)) - p.aire;
    const abajo = Math.max(...mandos.map((m) => m.arriba + m.alto), limite);
    return { izquierda, arriba, ancho: derecha - izquierda, alto: abajo - arriba };
  }
  const desde = Math.min(izquierda, r.izquierda);
  const hasta = Math.max(derecha, r.izquierda + r.ancho);
  return { izquierda: desde, arriba: r.arriba, ancho: hasta - desde, alto: r.alto };
}

/** Si dos rectángulos se cruzan (compartir un borde no es cruzarse). */
export function seTocan(a: Rectangulo, b: Rectangulo): boolean {
  return (
    a.izquierda < b.izquierda + b.ancho &&
    b.izquierda < a.izquierda + a.ancho &&
    a.arriba < b.arriba + b.alto &&
    b.arriba < a.arriba + a.alto
  );
}

/* =========================================================================================
   Cuántos niveles pasó (`BR-40`)
   ========================================================================================= */

/**
 * **Cuántos niveles de la fila están pasados**, en cualquier orden (`BR-40`). Con los seis abiertos,
 * `hastaDonde()` —los pasados seguidos desde el primero— dice 0 para quien pasó solo el 5, y eso
 * sería un dato falso en la pieza que se comparte (`BR-27`). Los `id` que la fila de hoy no tiene
 * no cuentan.
 */
export function pasadosDeLaFila(fila: readonly Nivel[], avance: Avance): number {
  return fila.filter((n) => avance.pasados.includes(n.id)).length;
}
