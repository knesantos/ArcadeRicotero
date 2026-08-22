/**
 * Tipos y carga del banco de "completar la letra". Implementa `CTR-04`
 * (`Docs/ARQ/ARQ-schema-completar-letra.md`) y la historia `US-03`.
 *
 * **El banco arranca vacío a propósito.** El texto de los versos es material de origen y
 * entra por la mano del usuario, igual que los recortes de audio de `US-02` — `CTR-03` no
 * puede inventar `origen` ni `fechaCorte`, y acá pasa lo mismo con el verso. Lo que este
 * archivo deja hecho es todo lo que va alrededor, para que cargarlos después sea pegar un
 * JSON y no diseñar nada.
 *
 * Las dos condiciones que hacen cumplir estas funciones, y que no están en el quiz:
 *
 *  1. **El cruce de `D-13`.** Todo tema que entre tiene que estar entre los 105 de
 *     `RES-20`. Es la mitigación que de verdad importa de esa decisión: el error
 *     demostrado de las fuentes de fans es mezclar material del Indio solista y de Skay
 *     con el de la banda. Acá el banco no carga si un ítem cita un tema que no existe.
 *  2. **El verso no viaja armado.** `CTR-04` parte el verso en `antes` / `respuesta` /
 *     `despues` justamente para que no exista una versión completa esperando a que
 *     alguien la lea. `aPayload` respeta eso: manda las tres partes por separado y nunca
 *     las concatena.
 */

import type { Dificultad } from '../quiz/banco.ts';
import { indiceDeTemas, normalizar, type Disco } from './temas.ts';

export type Estado = 'borrador' | 'listo' | 'retirado';
export type ModoRespuesta = 'opciones' | 'texto';
export type Donde = 'disco-fisico' | 'streaming' | 'video';

export interface Tema {
  readonly slug: string;
  readonly titulo: string;
  readonly disco: Disco;
  readonly pista: number;
  readonly anio: number;
  /** Slug del artículo de la Redondopedia, si ya existe. */
  readonly articulo?: string;
}

/** El verso partido en tres. La respuesta nunca vive pegada al resto. */
export interface Hueco {
  readonly antes: string;
  readonly respuesta: string;
  readonly despues: string;
}

/** Los versos de alrededor. `BR-03`: 2 en fácil, 1 en media, 0 en difícil. */
export interface Contexto {
  readonly antes: readonly string[];
  readonly despues: readonly string[];
}

export interface OpcionCruda {
  readonly texto: string;
  readonly correcta: boolean;
  /** Por qué este distractor es falso. Interna: no viaja al cliente. */
  readonly nota?: string;
}

export interface ConfirmadoDeOido {
  readonly quien: string;
  readonly fecha: string;
  readonly donde: Donde;
  readonly minuto: string;
}

export interface RotuloCrudo {
  readonly tipo: 'leyenda' | 'testimonio';
  readonly texto: string;
}

export interface ItemCrudo {
  readonly id: string;
  readonly us: readonly string[];
  readonly dificultad: Dificultad;
  readonly tema: Tema;
  readonly hueco: Hueco;
  readonly contexto: Contexto;
  readonly opciones?: readonly OpcionCruda[];
  readonly variantesAceptadas?: readonly string[];
  readonly explicacion?: string;
  readonly rotulo?: RotuloCrudo;
  readonly fuentes: readonly string[];
  readonly fuenteLetra: readonly string[];
  readonly confirmadoDeOido?: ConfirmadoDeOido;
  readonly sensibleA: readonly string[];
  readonly estado: Estado;
  /** Nota de trabajo de `contenido`. Interna: no viaja al cliente. */
  readonly notaInterna?: string;
}

export interface BancoCrudo {
  readonly contrato: string;
  readonly contratoVersion: number;
  readonly juego: string;
  readonly actualizado: string;
  readonly modoRespuesta: ModoRespuesta;
  readonly items: readonly ItemCrudo[];
}

export interface Opcion {
  readonly texto: string;
  readonly correcta: boolean;
}

/** Lo que efectivamente viaja al navegador. */
export interface Item {
  readonly id: string;
  readonly dificultad: Dificultad;
  readonly tema: Omit<Tema, 'slug'> & { readonly slug: string };
  readonly hueco: Hueco;
  readonly contexto: Contexto;
  readonly opciones?: readonly Opcion[];
  readonly variantesAceptadas?: readonly string[];
  readonly explicacion?: string;
  readonly rotulo?: RotuloCrudo;
}

export class BancoInvalido extends Error {}

/**
 * Cuántos versos de contexto corresponden a cada nivel (`BR-03`), **por lado**.
 *
 * La tabla de `BR-03` tiene dos columnas, no una: "versos visibles antes del hueco" y
 * "versos visibles después". Fácil es 2 **y** 2, no 2 en total. Es lo que ya hacía
 * cumplir `letra.schema.json` (`antes: minItems 2`, `despues: minItems 2`) y lo que este
 * archivo leía mal — sumaba los dos lados y comparaba contra el número de una columna,
 * así que un ítem fácil correcto (2+2) era rechazado por "traer 4 donde van 2".
 *
 * No se notó antes porque el banco estaba vacío: lo encontró el primer generador que
 * produjo ítems de verdad.
 */
export const CONTEXTO_POR_NIVEL: Record<Dificultad, number> = {
  facil: 2,
  media: 1,
  dificil: 0,
};

/** Quita del ítem todo lo que el jugador no tiene que ver. */
export function aPayload(item: ItemCrudo): Item {
  return {
    id: item.id,
    dificultad: item.dificultad,
    tema: item.tema,
    hueco: item.hueco,
    contexto: item.contexto,
    ...(item.opciones ? { opciones: item.opciones.map((o) => ({ texto: o.texto, correcta: o.correcta })) } : {}),
    ...(item.variantesAceptadas ? { variantesAceptadas: item.variantesAceptadas } : {}),
    ...(item.explicacion ? { explicacion: item.explicacion } : {}),
    ...(item.rotulo ? { rotulo: item.rotulo } : {}),
  };
}

/**
 * Invariantes que el código necesita. Fallan ruidoso en build, no en la cara del jugador.
 */
export function verificarInvariantes(
  items: readonly ItemCrudo[],
  modo: ModoRespuesta,
  temasValidos: ReadonlySet<string> = indiceDeTemas(),
): void {
  const vistos = new Set<string>();
  for (const it of items) {
    if (vistos.has(it.id)) throw new BancoInvalido(`id repetido: ${it.id}`);
    vistos.add(it.id);

    // D-13, la mitigacion que de verdad importa: si no esta entre los 105, no es de
    // Patricio Rey. Las fuentes de fans mezclan material solista y hay que atajarlo aca.
    if (!temasValidos.has(normalizar(it.tema.titulo))) {
      throw new BancoInvalido(
        `${it.id}: "${it.tema.titulo}" no esta entre los 105 temas de RES-20 (D-13)`,
      );
    }

    // El hueco no puede estar vacio ni ser el verso entero.
    if (!it.hueco.respuesta.trim()) throw new BancoInvalido(`${it.id}: el hueco no tiene respuesta`);
    if (!it.hueco.antes.trim() && !it.hueco.despues.trim()) {
      throw new BancoInvalido(`${it.id}: el hueco se come el verso entero, no queda nada alrededor`);
    }

    // BR-03: el contexto depende del nivel y no lo elige quien carga. Se mide cada lado
    // por separado, que es como esta escrita la tabla de la regla.
    const esperado = CONTEXTO_POR_NIVEL[it.dificultad];
    for (const [lado, versos] of [['antes', it.contexto.antes], ['despues', it.contexto.despues]] as const) {
      if (versos.length > esperado) {
        throw new BancoInvalido(
          `${it.id}: es ${it.dificultad} y trae ${versos.length} versos ${lado} del hueco, BR-03 permite ${esperado}`,
        );
      }
    }

    if (modo === 'opciones') {
      const ops = it.opciones ?? [];
      if (ops.length !== 4) {
        throw new BancoInvalido(`${it.id}: tiene ${ops.length} opciones, BR-04 fija 4`);
      }
      const correctas = ops.filter((o) => o.correcta).length;
      if (correctas !== 1) {
        throw new BancoInvalido(`${it.id}: tiene ${correctas} opciones correctas, tiene que haber 1`);
      }
      if (!ops.some((o) => o.correcta && o.texto === it.hueco.respuesta)) {
        throw new BancoInvalido(`${it.id}: la opcion correcta no coincide con la respuesta del hueco`);
      }
    }

    // D-13 otra vez: de donde salio la letra se declara siempre.
    if (it.fuenteLetra.length === 0) {
      throw new BancoInvalido(`${it.id}: no declara de donde salio la letra`);
    }
  }
}

/**
 * Carga el banco y devuelve solo los ítems jugables.
 *
 * Con el banco vacío devuelve una lista vacía sin romper: la pantalla del juego usa eso
 * para mostrarse "en la cocina" hasta que haya versos cargados.
 */
export function cargarBanco(crudo: BancoCrudo, temasValidos?: ReadonlySet<string>): readonly Item[] {
  const jugables = crudo.items.filter((i) => i.estado === 'listo');
  verificarInvariantes(jugables, crudo.modoRespuesta, temasValidos);
  return jugables.map(aPayload);
}
