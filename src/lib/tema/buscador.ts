/**
 * El buscador con autocompletado de "adiviná el tema" (`US-02`).
 *
 * **Es la pieza que decide si el juego se puede jugar con una mano.** El pedido del
 * usuario fue textual: *"es importante el autocompletar de las canciones para agilizar
 * el juego"*. Un juego de reconocimiento de oído donde escribir el título cuesta veinte
 * segundos no mide oído, mide dedos — y en un teclado de celular, con títulos como
 * *Las increíbles andanzas del Capitán Buscapina en Cybersiberia*, mide paciencia.
 *
 * Corre **en el navegador**, sobre los 105 temas de `RES-20`. Ciento cinco elementos es
 * nada: no hay índice invertido, no hay librería y no hay espera entre teclas. Se
 * recorre la lista entera en cada tecla y sobra tiempo.
 *
 * ## Las cuatro cosas que perdona, y por qué cada una
 *
 * 1. **Tildes.** Nadie escribe "Último bondi" con la tilde en un teclado táctil.
 * 2. **Espacios y puntuación.** `RES-20` escribe *Jijiji* y el resto del repo *Ji ji ji*
 *    (lo dejó anotado `CTR-03.3`, punto 4). El que tipea "ji ji ji" tiene que
 *    encontrarlo, y el que tipea "jijiji" también.
 * 3. **Empezar por el medio.** "bondi" encuentra *Último bondi a Finisterre*. Media
 *    discografía se recuerda por una palabra del medio del título, no por la primera.
 * 4. **Letras salteadas.** "vncdrs" encuentra *Vencedores vencidos*. Es el último
 *    recurso y el peor rankeado, pero salva al que escribe rápido y se come vocales.
 *
 * ## Lo que NO hace, a propósito
 *
 * No corrige tipeos por distancia de edición. El juego de referencia sí: escribiendo
 * "zzzzq" ofrece temas de ZZ Top — medido, está en el mapa
 * (`Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`). Se ve simpático y **es
 * ruido**: mete candidatos que el jugador no pidió y le tapa el que sí quería. Acá la
 * subsecuencia cubre el caso real —comerse letras— sin inventar coincidencias.
 *
 * ## Y una regla que es de veracidad, no de comodidad
 *
 * **El buscador ofrece los 105 títulos, no los que tienen audio.** Si solo listara los
 * jugables, el desplegable sería la respuesta: el jugador vería el conjunto chico donde
 * está la correcta. Es la misma razón por la que el `alt` de `US-04` no nombra el disco.
 */

import { normalizar, normalizarDuro } from '../texto.ts';

/** Lo mínimo que el buscador necesita saber de un tema. Lo arma `catalogo.ts` en build. */
export interface TemaBuscable {
  readonly slug: string;
  readonly titulo: string;
  /** Slug del disco. Filtra el pozo cuando el jugador elige un disco. */
  readonly disco: string;
  /** El disco como se escribe. Va al lado del título en el desplegable. */
  readonly discoTitulo: string;
  readonly pista: number;
}

/**
 * Un resultado del buscador, ya partido en tres para pintar.
 *
 * **Devuelve texto y no índices** a propósito. La coincidencia se calcula sobre la forma
 * normalizada ("ultimo bondi a finisterre") y el resaltado se pinta sobre la original
 * ("Último bondi a Finisterre"): las dos tienen distinto largo apenas aparece un signo
 * de puntuación, así que un índice de una no sirve para la otra. Devolver los tres
 * pedazos ya cortados deja esa aritmética adentro de este archivo, que es donde está
 * testeada, en vez de repetida en la pantalla.
 *
 * `medio` vacío significa "coincidió, pero no en un tramo contiguo del título" —
 * subsecuencia, o coincidencia por disco—, y entonces no se resalta nada.
 */
export interface Resultado {
  readonly tema: TemaBuscable;
  readonly antes: string;
  readonly medio: string;
  readonly despues: string;
}

/** Cuántas sugerencias se muestran. Seis entran en un celular sin tapar el teclado. */
export const MAX_SUGERENCIAS = 6;

/**
 * Los seis rangos de calidad, de mejor a peor. El número no se muestra nunca: ordena.
 *
 * Está escrito como constantes con nombre y no como números sueltos porque el orden
 * **es** la decisión de diseño de este archivo, y un `3` suelto en una comparación no
 * dice nada.
 */
const RANGO_EXACTO = 0;
const RANGO_EMPIEZA = 1;
const RANGO_PALABRA = 2;
const RANGO_CONTIENE = 3;
const RANGO_DISCO = 4;
const RANGO_SALTEADO = 5;
const NO_COINCIDE = 99;

/** Con menos de tres letras no se busca por subsecuencia: "la" traería medio catálogo. */
const MINIMO_SALTEADO = 3;

/** ¿Están todas las letras de `aguja` dentro de `pajar`, en orden? */
function esSubsecuencia(aguja: string, pajar: string): boolean {
  if (!aguja) return true;
  let i = 0;
  for (const c of pajar) {
    if (c === aguja[i]) i++;
    if (i === aguja.length) return true;
  }
  return false;
}

/**
 * Normaliza el título llevando, para cada carácter de la forma normalizada, de qué
 * posición del título original salió.
 *
 * Repite la lógica de `normalizar()` en vez de llamarla porque necesita el mapa, y
 * `normalizar()` trabaja sobre la cadena entera. El test `buscador.test.ts` verifica
 * contra `normalizar()` que las dos den siempre lo mismo: si alguna se mueve, falla.
 */
function mapear(titulo: string): { readonly normal: string; readonly origen: readonly number[] } {
  const chars = [...titulo];
  let normal = '';
  const origen: number[] = [];
  let separadorPendiente = false;

  for (let i = 0; i < chars.length; i++) {
    const limpio = chars[i]!
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');

    if (/^[a-z0-9]+$/.test(limpio)) {
      // El espacio se escribe recién cuando aparece la letra que lo sigue: así no queda
      // ni espacio al principio ni al final, igual que el `.trim()` de `normalizar()`.
      if (separadorPendiente && normal) {
        normal += ' ';
        origen.push(i);
      }
      separadorPendiente = false;
      for (const c of limpio) {
        normal += c;
        origen.push(i);
      }
    } else {
      separadorPendiente = true;
    }
  }

  return { normal, origen };
}

/** Parte el título en `[antes, medio, después]` marcando dónde cayó la consulta. */
function resaltar(titulo: string, consulta: string): readonly [string, string, string] {
  const chars = [...titulo];
  const { normal, origen } = mapear(titulo);
  const pos = consulta ? normal.indexOf(consulta) : -1;
  if (pos < 0) return [titulo, '', ''] as const;

  const desde = origen[pos]!;
  const hasta = (origen[pos + consulta.length - 1] ?? origen[origen.length - 1]!) + 1;
  return [chars.slice(0, desde).join(''), chars.slice(desde, hasta).join(''), chars.slice(hasta).join('')] as const;
}

/** El rango de calidad con que `tema` responde a la consulta. `NO_COINCIDE` si no. */
function rango(tema: TemaBuscable, blanda: string, dura: string): number {
  const tituloBlando = normalizar(tema.titulo);
  const tituloDuro = normalizarDuro(tema.titulo);

  if (tituloBlando === blanda || tituloDuro === dura) return RANGO_EXACTO;
  if (tituloBlando.startsWith(blanda) || tituloDuro.startsWith(dura)) return RANGO_EMPIEZA;
  if (tituloBlando.split(' ').some((palabra) => palabra.startsWith(blanda))) return RANGO_PALABRA;
  if (tituloBlando.includes(blanda) || tituloDuro.includes(dura)) return RANGO_CONTIENE;

  // Por disco: escribir "oktubre" trae los once temas de Oktubre. Va abajo de todo lo
  // que coincide por título porque el jugador está nombrando un tema, no un disco.
  if (normalizarDuro(tema.discoTitulo).includes(dura)) return RANGO_DISCO;

  if (dura.length >= MINIMO_SALTEADO && esSubsecuencia(dura, tituloDuro)) return RANGO_SALTEADO;

  return NO_COINCIDE;
}

/**
 * Las sugerencias para lo que el jugador lleva tipeado.
 *
 * Con la consulta vacía devuelve lista vacía y no el catálogo entero: un desplegable de
 * 105 títulos apenas tocás la caja tapa la pantalla y no ayuda a nadie.
 */
export function sugerir(
  temas: readonly TemaBuscable[],
  consulta: string,
  max: number = MAX_SUGERENCIAS,
): readonly Resultado[] {
  const blanda = normalizar(consulta);
  const dura = normalizarDuro(consulta);
  if (!dura) return [];

  const todos = temas
    .map((tema) => ({ tema, r: rango(tema, blanda, dura) }))
    .filter((c) => c.r !== NO_COINCIDE);

  /*
   * Las letras salteadas son un **rescate**, no una vía más: si hay aunque sea un tema
   * que coincide de verdad por título, los salteados se caen.
   *
   * Sin esto, escribir "bestia" trae *La bestia pop* y detrás cuatro títulos que
   * contienen b-e-s-t-i-a desperdigadas —medido, estaban ahí— y el que buscaba el
   * primero tiene que leer cinco renglones para confirmarlo. Es el ruido que se le
   * critica al juego de referencia, entrando por otra puerta.
   */
  const hayCoincidenciaReal = todos.some((c) => c.r <= RANGO_CONTIENE);
  const conRango = hayCoincidenciaReal ? todos.filter((c) => c.r !== RANGO_SALTEADO) : todos;

  conRango.sort((a, b) => {
    if (a.r !== b.r) return a.r - b.r;
    // A igual calidad, primero el título más corto: es el que el jugador está viendo
    // venir mientras escribe, y el que necesita menos teclas para confirmarse.
    if (a.tema.titulo.length !== b.tema.titulo.length) {
      return a.tema.titulo.length - b.tema.titulo.length;
    }
    // Desempate final estable: la misma consulta da siempre exactamente la misma lista.
    return a.tema.slug < b.tema.slug ? -1 : 1;
  });

  return conRango.slice(0, max).map(({ tema }) => {
    const [antes, medio, despues] = resaltar(tema.titulo, blanda);
    return { tema, antes, medio, despues };
  });
}

/**
 * ¿La respuesta que entregó el jugador es este tema?
 *
 * Compara por slug, no por texto: el jugador no escribe la respuesta, la **elige** del
 * desplegable, así que lo que viaja es una identidad y no una cadena que haya que
 * interpretar. Que no exista una comparación de títulos acá es lo que impide que
 * "Ji ji ji" y "Jijiji" sean dos respuestas distintas del mismo tema.
 */
export function acierta(elegido: TemaBuscable | null, correcto: TemaBuscable): boolean {
  return elegido !== null && elegido.slug === correcto.slug;
}
