/**
 * Los conjuntos que se pueden repartir en "Ponelos en fila" (`US-08`). Implementa `CTR-13`.
 *
 * ## De dónde salen las fichas, y por qué no hay un JSON de banco
 *
 * De los 105 temas de `RES-20` y de las diez fichas de disco de `cancionero/banco.ts`.
 * **No hay `src/data/ponelos.json` y no es un olvido**: copiar los 105 títulos a un
 * archivo sería exactamente la segunda verdad que `D-13` existe para impedir, y esa regla
 * no es teórica — `RES-23` midió que las fuentes de fans listan 149 temas mezclando
 * material solista, y todo el sitio se defiende de eso cruzando contra una sola lista.
 *
 * Lo que sí escribe la página es el **catálogo**: los 105 temas y los diez discos, ya
 * resueltos en build, serializados en un `<script type="application/json">`. Son ~9 KB, el
 * mismo orden de magnitud que el catálogo de "Adiviná el tema", que ya está medido y
 * documentado como cómodo.
 *
 * ## Por qué este módulo corre en el navegador y no en build
 *
 * Porque el jugador cambia de conjunto sin recargar, y porque **una lista compartida tiene
 * que poder reconstruirse desde el fragmento**. El link trae un id de conjunto; si armar
 * un conjunto fuera trabajo de build, cada id posible sería una página, y los doce al azar
 * serían infinitas. Con el catálogo del lado del navegador, cualquier id se resuelve
 * leyendo la misma lista que ya está en pantalla.
 *
 * **Y por eso este archivo no importa nada de Node.** `islas.test.ts` lo verifica siguiendo
 * el grafo entero desde la isla; el precedente que escribió ese test es `tema/paleta.ts`,
 * que trajo `node:fs` dos saltos más allá y mató un juego con los tres comandos en verde.
 *
 * ## El orden canónico, que es lo que hace legible un link viejo
 *
 * Un reparto compartido son tres bits por ficha **en un orden que no viaja** (`ADR-06`).
 * Ese orden se define acá y en ningún otro lado:
 *
 * 1. Los discos, en el orden de `DISCOS` (cronológico).
 * 2. Los temas, por disco en ese mismo orden y, dentro de un disco, por número de pista.
 *    Es también el orden de "Todos los temas" (`D-69`), que son los 105 de un saque.
 * 3. Los conjuntos sorteados, por el barajado determinista de su semilla.
 *
 * Si alguna de las tres cambia, **los links viejos abren corridos y nadie se entera**. Es
 * el defecto que `VERSION_REPARTO` existe para volver ruidoso: cambiar el orden obliga a
 * subir esa versión.
 */

import { DISCOS } from '../letra/discos.ts';
import { rutaFicha } from '../tapa/pasadas.ts';
import { CONJUNTOS } from './copy.ts';
import type { Conjunto, Ficha, FormatoFicha } from './tablero.ts';

export type { Conjunto, Ficha, FormatoFicha };

/** Un tema del catálogo, tal como lo escribe la página en build desde `RES-20`. */
export interface TemaDelCatalogo {
  readonly slug: string;
  readonly titulo: string;
  readonly disco: string;
  readonly pista: number;
}

/** Un disco del catálogo, desde `FICHAS`. */
export interface DiscoDelCatalogo {
  readonly slug: string;
  readonly titulo: string;
  readonly anio: number;
}

/** Todo lo que la isla necesita para armar cualquier conjunto (`CTR-13`). */
export interface Catalogo {
  readonly temas: readonly TemaDelCatalogo[];
  readonly discos: readonly DiscoDelCatalogo[];
  /**
   * Los slugs de los temas que tienen recorte de audio (`D-69`). No arma ningún conjunto:
   * le dice a la isla qué ficha puede sonar. Opcional, porque sin él el juego se juega mudo.
   */
  readonly conAudio?: readonly string[];
}

/** Lo que la pantalla de elección muestra de cada conjunto, sin armarlo entero. */
export interface Resumen {
  readonly id: string;
  readonly nombre: string;
  readonly bajada: string;
  readonly cuantas: number;
  readonly formato: FormatoFicha;
  /** El disco que viste la entrada, cuando el conjunto es de un disco solo. */
  readonly disco: string | null;
}

/** Cuántos temas trae el conjunto sorteado. Doce entran en una sesión de dos o tres minutos. */
export const LARGO_SORTEO = 12;

/** El prefijo del conjunto sorteado. La semilla va detrás: `az-a1b2c3`. */
export const PREFIJO_SORTEO = 'az-';

/** El prefijo de los conjuntos por disco. El número es la posición en `DISCOS`. */
export const PREFIJO_DISCO = 't';

/**
 * El id de "Todos los temas" (`D-69`): los 105, cada uno con el nombre de su disco al lado.
 *
 * Es el conjunto que el usuario pidió por nombre, y el que da vuelta la cuenta vieja de este
 * archivo: el tope de dieciséis fichas cuidaba una sesión de dos o tres minutos, y el usuario
 * lo dijo sin vueltas —*"la gracia de los tierlist así es que sean muchísimas cosas las que
 * estás poniendo en orden, así que más está bien"*—. Lo que hace jugable el largo no es
 * achicarlo: es repartir de a una (`mazo.ts`) y que la partida quede guardada para seguirla.
 */
export const ID_TODOS = 'todos';

/**
 * El generador determinista del sorteo (mulberry32).
 *
 * Determinista y no `Math.random()` porque **la semilla viaja en el id del conjunto**: el
 * que recibe el link tiene que sortear exactamente los mismos doce temas. Un sorteo que no
 * se puede repetir es un conjunto que no se puede compartir.
 */
function azarDeSemilla(semilla: string): () => number {
  let s = 0;
  for (const c of semilla) s = (Math.imul(s, 31) + c.charCodeAt(0)) | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates sobre una copia, con el azar inyectado. */
function barajar<T>(xs: readonly T[], rnd: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Una semilla nueva para un sorteo: seis caracteres de base 36.
 *
 * El azar entra por parámetro con un valor por defecto, como en `dos-ejes/partida.ts` y
 * por el mismo motivo: con un generador determinista, el test puede afirmar que la semilla
 * cumple la gramática del id de conjunto de `ADR-06` en vez de mirarla a ojo.
 */
export function semillaNueva(rnd: () => number = Math.random): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += Math.floor(rnd() * 36).toString(36);
  return PREFIJO_SORTEO + s;
}

/** Los temas de un disco, por número de pista. Es una pata del orden canónico. */
function temasDe(cat: Catalogo, disco: string): readonly TemaDelCatalogo[] {
  return cat.temas.filter((t) => t.disco === disco).sort((a, b) => a.pista - b.pista);
}

/** Los temas de los diez discos, en el orden canónico entero. */
function todosLosTemas(cat: Catalogo): readonly TemaDelCatalogo[] {
  return DISCOS.flatMap((d) => temasDe(cat, d));
}

/** El título de un disco, o su slug si el catálogo no lo trae (hueco declarado). */
function tituloDeDisco(cat: Catalogo, slug: string): string {
  return cat.discos.find((d) => d.slug === slug)?.titulo ?? slug;
}

/**
 * Una ficha de disco. **La tapa entra solo cuando el conjunto es el de las tapas.**
 *
 * Los dos conjuntos de discos tienen las mismas diez fichas, así que lo único que los
 * distingue es qué se mira para decidir: en "Los diez discos" se ordena el disco —el
 * título y el año, como quien mira el lomo en la estantería— y en "Las diez tapas" se
 * ordena el dibujo. Servir los dos con la tapa los volvía **la misma pantalla dos veces**,
 * y el piso de `US-08` pasaba a contar catorce conjuntos donde había trece.
 */
function fichaDeDisco(d: DiscoDelCatalogo, conTapa: boolean): Ficha {
  return {
    slug: d.slug,
    titulo: d.titulo,
    disco: d.slug,
    pie: String(d.anio),
    imagen: conTapa ? rutaFicha(d.slug) : null,
  };
}

/**
 * Una ficha de tema: se lee, así que no lleva imagen y se viste con la tinta de su disco.
 *
 * `conDisco` decide qué dice el renglón chico. En el conjunto de un disco, decirlo diez
 * veces sería ruido y lo que hace falta es el número de pista; en un conjunto que cruza
 * discos, el número de pista solo no ubica nada y lo que hace falta es el disco.
 */
function fichaDeTema(cat: Catalogo, t: TemaDelCatalogo, conDisco: boolean): Ficha {
  return {
    slug: t.slug,
    titulo: t.titulo,
    disco: t.disco,
    pie: conDisco ? tituloDeDisco(cat, t.disco) : `${t.pista}`,
    imagen: null,
  };
}

/** El id del conjunto de temas de un disco: `t1` … `t10`, por su posición en `DISCOS`. */
export function idDeDisco(slug: string): string | null {
  const i = (DISCOS as readonly string[]).indexOf(slug);
  return i < 0 ? null : `${PREFIJO_DISCO}${i + 1}`;
}

/** El slug de disco detrás de un id `t<n>`, o `null` si el id no es de esa forma. */
function discoDeId(id: string): string | null {
  const m = /^t([1-9]|10)$/.exec(id);
  if (!m) return null;
  return DISCOS[Number(m[1]) - 1] ?? null;
}

/**
 * Arma el conjunto que pide un id, o `null` si el id no nombra ninguno.
 *
 * **`null` y no una excepción**, porque el id llega de una dirección que escribió
 * cualquiera: un conjunto que no existe es un link viejo o roto, y ante eso el juego abre
 * en la pantalla de elección — nunca se rompe (`D-14`).
 */
export function armarConjunto(cat: Catalogo, id: string): Conjunto | null {
  const discos = DISCOS.map((slug) => cat.discos.find((d) => d.slug === slug)).filter(
    (d): d is DiscoDelCatalogo => d !== undefined,
  );

  if (id === 'discos' || id === 'tapas') {
    const conTapa = id === 'tapas';
    const c = conTapa ? CONJUNTOS.tapas : CONJUNTOS.discos;
    return {
      id,
      nombre: c.nombre,
      bajada: c.bajada,
      formato: conTapa ? 'tapa' : 'titulo',
      fichas: discos.map((d) => fichaDeDisco(d, conTapa)),
    };
  }

  if (id === ID_TODOS) {
    const fichas = todosLosTemas(cat).map((t) => fichaDeTema(cat, t, true));
    return fichas.length > 0
      ? { id, nombre: CONJUNTOS.todos.nombre, bajada: CONJUNTOS.todos.bajada, formato: 'titulo', fichas }
      : null;
  }

  if (id === 'abren' || id === 'cierran') {
    const c = id === 'abren' ? CONJUNTOS.abren : CONJUNTOS.cierran;
    const fichas = DISCOS.map((d) => {
      const suyos = temasDe(cat, d);
      return id === 'abren' ? suyos[0] : suyos[suyos.length - 1];
    })
      .filter((t): t is TemaDelCatalogo => t !== undefined)
      .map((t) => fichaDeTema(cat, t, true));
    return fichas.length > 0
      ? { id, nombre: c.nombre, bajada: c.bajada, formato: 'titulo', fichas }
      : null;
  }

  if (id.startsWith(PREFIJO_SORTEO)) {
    // La semilla es el id entero, no solo su cola: así dos prefijos distintos nunca
    // podrían sortear lo mismo si algún día hubiera un segundo tipo de sorteo.
    if (!/^az-[a-z0-9]{6}$/.test(id)) return null;
    const pozo = todosLosTemas(cat);
    if (pozo.length < LARGO_SORTEO) return null;
    const fichas = barajar(pozo, azarDeSemilla(id))
      .slice(0, LARGO_SORTEO)
      .map((t) => fichaDeTema(cat, t, true));
    return {
      id,
      nombre: CONJUNTOS.azar.nombre,
      bajada: CONJUNTOS.azar.bajada,
      formato: 'titulo',
      fichas,
    };
  }

  const disco = discoDeId(id);
  if (disco) {
    const fichas = temasDe(cat, disco).map((t) => fichaDeTema(cat, t, false));
    if (fichas.length === 0) return null;
    const titulo = tituloDeDisco(cat, disco);
    return {
      id,
      nombre: CONJUNTOS.temas.nombre(titulo),
      bajada: CONJUNTOS.temas.bajada(titulo),
      formato: 'titulo',
      fichas,
    };
  }

  return null;
}

/**
 * Los conjuntos que ofrece la pantalla de elección, en el orden en que se muestran.
 *
 * El sorteado va **con una semilla nueva cada vez que se arma esta lista**: entrar dos
 * veces al juego no ofrece los mismos doce temas. Es lo único que impide que este juego se
 * agote en una partida, que es su riesgo estructural — un conjunto ordenado queda ordenado
 * para siempre.
 */
export function conjuntosOfrecidos(cat: Catalogo, rnd: () => number = Math.random): readonly Resumen[] {
  const resumir = (c: Conjunto, disco: string | null): Resumen => ({
    id: c.id,
    nombre: c.nombre,
    bajada: c.bajada,
    cuantas: c.fichas.length,
    formato: c.formato,
    disco,
  });

  const salida: Resumen[] = [];
  // "Todos los temas" va primero: es el conjunto entero, y el que se pidió por nombre.
  for (const id of [ID_TODOS, 'discos', 'tapas', 'abren', 'cierran', semillaNueva(rnd)]) {
    const c = armarConjunto(cat, id);
    if (c) salida.push(resumir(c, null));
  }
  for (const d of DISCOS) {
    const id = idDeDisco(d);
    const c = id ? armarConjunto(cat, id) : null;
    if (c) salida.push(resumir(c, d));
  }
  return salida;
}
