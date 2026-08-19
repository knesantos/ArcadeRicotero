/**
 * Tipos y carga del banco del quiz. Implementa `CTR-02` (Docs/ARQ/ARQ-schema-quiz.md).
 *
 * Dos responsabilidades, y la segunda es la que importa:
 *
 *  1. Poner tipos sobre `src/data/quiz.json`.
 *  2. **Sacar del payload que llega al navegador todo lo que el jugador no tiene que
 *     ver.** `notaInterna` es una nota de trabajo de `contenido`, y `opcion.nota`
 *     explica por que un distractor es falso: mandarlas al cliente es spoilear la
 *     respuesta a cualquiera que abra las herramientas de desarrollo.
 *
 * Este archivo NO valida contra el JSON Schema: eso ya lo hace `jsonschema` en la
 * verificacion (`D-12`). Lo que chequea aca son los invariantes que el codigo necesita
 * para no romperse, y que el schema tambien garantiza — cinturon y tiradores, porque el
 * schema vive en otro archivo y puede desincronizarse.
 */

export type Categoria = 'historia' | 'discos' | 'letras' | 'mitologia';
export type Dificultad = 'facil' | 'media' | 'dificil';
export type Estado = 'borrador' | 'listo' | 'retirado';
export type Superficie = 'letra' | 'tapa' | 'audio';

/** Lo que alguien conto en primera persona. `CTR-02.4`. */
export interface Testimonio {
  readonly quien: string;
  readonly obra: string;
  readonly ubicacion: string;
  readonly afirmacion: string;
}

export interface OpcionCruda {
  readonly texto: string;
  readonly correcta: boolean;
  /** Por que este distractor es falso. Interna: no viaja al cliente. */
  readonly nota?: string;
}

export interface ItemCrudo {
  readonly id: string;
  readonly us: readonly string[];
  readonly categoria: Categoria;
  readonly dificultad: Dificultad;
  readonly enunciado: string;
  readonly opciones: readonly OpcionCruda[];
  readonly explicacion: string;
  readonly fuentes?: readonly string[];
  readonly esLeyenda: boolean;
  readonly rotuloLeyenda?: string;
  readonly testimonio?: Testimonio;
  readonly sensibleA: readonly Superficie[];
  readonly spotify?: { readonly trackId: string };
  readonly estado: Estado;
  /** Nota de trabajo de `contenido`. Interna: no viaja al cliente. */
  readonly notaInterna?: string;
}

export interface BancoCrudo {
  readonly contrato: string;
  readonly contratoVersion: number;
  readonly juego: string;
  readonly actualizado: string;
  readonly items: readonly ItemCrudo[];
}

/**
 * Las tres casillas de fuente de `CTR-02.4`, resueltas en una sola etiqueta.
 *
 * Existe porque la pantalla necesita saber **que clase de cosa** esta mostrando, y en el
 * JSON eso esta repartido entre un booleano y la presencia de un objeto. Que el codigo
 * tenga que deducirlo en cada componente es como se pierde un rotulo.
 */
export type ClaseDeFuente = 'hecho' | 'leyenda' | 'testimonio';

export interface Opcion {
  readonly texto: string;
  readonly correcta: boolean;
}

/**
 * Lo que del testimonio ve el jugador: **solo quien lo dijo y en que obra**.
 *
 * `ubicacion` y `afirmacion` se quedan del lado del servidor: son insumo de auditoria de
 * `revisor` para contrastar contra el original, no informacion de juego (`UX-01` v2).
 * Que sea un tipo aparte y no un `Partial<Testimonio>` es a proposito — asi el
 * compilador impide volver a mandar el objeto entero por descuido, que es como
 * aparecio `FIND-16`.
 */
export interface TestimonioVisible {
  readonly quien: string;
  readonly obra: string;
}

/** Lo que efectivamente viaja al navegador. Sin campos internos. */
export interface Item {
  readonly id: string;
  readonly categoria: Categoria;
  readonly dificultad: Dificultad;
  readonly enunciado: string;
  readonly opciones: readonly Opcion[];
  readonly explicacion: string;
  readonly clase: ClaseDeFuente;
  readonly rotuloLeyenda?: string;
  readonly testimonio?: TestimonioVisible;
  readonly spotify?: { readonly trackId: string };
}

export class BancoInvalido extends Error {}

/**
 * Que clase de fuente es un item.
 *
 * `esLeyenda` significa "folclore anonimo, si o no". Un testimonio lleva `false` mas el
 * objeto `testimonio`; el schema rechaza tener los dos sellos a la vez, porque dos sellos
 * en un item es la forma mas rapida de que ninguno signifique nada.
 */
export function claseDeFuente(item: ItemCrudo): ClaseDeFuente {
  if (item.esLeyenda) return 'leyenda';
  if (item.testimonio) return 'testimonio';
  return 'hecho';
}

/** Quita del item todo lo que el jugador no tiene que ver. */
export function aPayload(item: ItemCrudo): Item {
  const clase = claseDeFuente(item);
  return {
    id: item.id,
    categoria: item.categoria,
    dificultad: item.dificultad,
    enunciado: item.enunciado,
    opciones: item.opciones.map((o) => ({ texto: o.texto, correcta: o.correcta })),
    explicacion: item.explicacion,
    clase,
    ...(clase === 'leyenda' && item.rotuloLeyenda ? { rotuloLeyenda: item.rotuloLeyenda } : {}),
    // FIND-16: solo `quien` y `obra`. `UX-01` v2 decidio que `ubicacion` y `afirmacion`
    // no se muestran —son insumo de auditoria de `revisor`, no de disfrute del jugador—
    // y esta funcion mandaba el objeto entero. Mandar al cliente algo que ninguna
    // pantalla renderiza es exactamente lo que este archivo dice que no hay que hacer.
    ...(clase === 'testimonio' && item.testimonio
      ? { testimonio: { quien: item.testimonio.quien, obra: item.testimonio.obra } }
      : {}),
    ...(item.spotify ? { spotify: item.spotify } : {}),
  };
}

/**
 * Invariantes que el codigo necesita. Fallan ruidoso en build, no en la cara del jugador.
 *
 * No repiten el schema entero: son las que, de romperse, harian que el juego se comporte
 * mal en vez de no compilar. Un item sin opcion correcta no es un error de tipos, es una
 * pregunta que nadie puede responder.
 */
export function verificarInvariantes(items: readonly ItemCrudo[]): void {
  const vistos = new Set<string>();
  for (const it of items) {
    if (vistos.has(it.id)) throw new BancoInvalido(`id repetido: ${it.id}`);
    vistos.add(it.id);

    const correctas = it.opciones.filter((o) => o.correcta).length;
    if (correctas !== 1) {
      throw new BancoInvalido(`${it.id}: tiene ${correctas} opciones correctas, tiene que haber 1`);
    }
    // BR-04: cuatro opciones, para US-01 y US-04.
    if (it.opciones.length !== 4) {
      throw new BancoInvalido(`${it.id}: tiene ${it.opciones.length} opciones, BR-04 fija 4`);
    }
    // CTR-02.4: la regla de veracidad. Un hecho sin fuente es lo que D-14 sigue
    // considerando estricto, porque marca error a quien se sabe el tema.
    if (claseDeFuente(it) === 'hecho' && (!it.fuentes || it.fuentes.length === 0)) {
      throw new BancoInvalido(`${it.id}: es hecho verificado y no cita ninguna ficha`);
    }
    if (it.esLeyenda && !it.rotuloLeyenda) {
      throw new BancoInvalido(`${it.id}: es leyenda y no trae rotulo`);
    }
  }
}

/**
 * Carga el banco y devuelve solo los items jugables.
 *
 * `estado: 'borrador'` y `'retirado'` no llegan al jugador. Es el mecanismo que permitio
 * cerrar `FIND-10` sin borrar una pregunta: se retira, no se pierde.
 */
export function cargarBanco(crudo: BancoCrudo): readonly Item[] {
  verificarInvariantes(crudo.items);
  return crudo.items.filter((i) => i.estado === 'listo').map(aPayload);
}
