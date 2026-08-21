/**
 * Tipos y carga del banco de "adivinar la tapa". Implementa `CTR-05`
 * (`Docs/ARQ/ARQ-schema-adivinar-tapa.md`) y la historia `US-04`.
 *
 * Es hermano de `src/lib/quiz/banco.ts` y hace lo mismo: pone tipos sobre el JSON y
 * saca del payload lo que el jugador no tiene que ver. Lo que cambia es que acá la
 * pregunta **es una imagen**, y eso trae dos cuidados propios:
 *
 *  1. **El crédito viaja siempre.** `D-21` y `D-04` no admiten una tapa en pantalla sin
 *     nombrar a Rocambole. Acá se hace imposible de olvidar: si un ítem no trae crédito,
 *     el banco no carga y el build se cae.
 *  2. **La edición no se inventa.** Un ítem cuya auditoría (`RES-44`) quedó en
 *     "no determinable" no puede ser la respuesta correcta. Si el archivo es un CD
 *     yanqui del 93 y la respuesta dice LP argentino del 86, el juego le marca error
 *     justo al que se sabe el disco — que es lo único que este proyecto dejó estricto.
 *
 * El armado de la ronda no vive acá: se reusa el de `../quiz/ronda.ts`, que ya
 * implementa `BR-01` y el barajado de opciones. Copiarlo sería copiar el defecto que
 * ese archivo arregla.
 */

import type { Dificultad } from '../quiz/banco.ts';

export type Estado = 'borrador' | 'listo' | 'retirado';
export type Encuadre = 'entera' | 'detalle';
export type Auditoria =
  | 'original confirmada'
  | 'reedicion confirmada'
  | 'coincide con la original, sin marcador que lo pruebe'
  | 'no determinable';

/**
 * La auditoría que **impide** que un archivo sea la respuesta correcta (`RES-44`).
 *
 * Es una sola: `no determinable`. Si no se pudo determinar qué es la imagen, no se puede
 * afirmar nada sobre ella, y una respuesta que el juego premia es una afirmación.
 *
 * **Una reedición sí sirve, y conviene decir por qué**, porque la primera versión de este
 * archivo la rechazaba y estaba de más. `RES-44` no dice que una reedición esté vetada:
 * dice que no sirve *cuando la pregunta dependería de la edición*. Acá la pregunta es de
 * qué disco es la tapa, y la tapa de una reedición sigue siendo la de ese disco. Además el
 * schema obliga a declarar `edicion`, y la pantalla la muestra al revelar: el jugador se
 * entera de qué está mirando.
 *
 * **Lo que este chequeo NO puede ver, y hay que saberlo.** El caso que de verdad rompe el
 * juego no es una reedición: es una imagen que **no es el arte de ese disco** — el frontal
 * de *La mosca y la sopa* resultó un rediseño con una foto de recital (`RES-44`), y bajo el
 * enum de `CTR-05` eso se anota igual que una reedición legítima. El enum no distingue las
 * dos cosas. Hoy el riesgo está cerrado por otro lado —`scripts/generar-tapas.mjs` ya no
 * genera nada desde ese frontal— pero cerrarlo de verdad pide un campo nuevo en el
 * contrato. Pedido dejado a `arquitectura`.
 */
const VETADAS_COMO_CORRECTA: readonly Auditoria[] = ['no determinable'];

export interface Credito {
  readonly autor: string;
  readonly origen?: string;
}

export interface ImagenCruda {
  readonly archivo: string;
  readonly encuadre: Encuadre;
  readonly disco: string;
  readonly edicion: string;
  readonly auditoria: Auditoria;
  readonly credito: Credito;
}

export interface OpcionCruda {
  readonly texto: string;
  readonly correcta: boolean;
  /** Por qué este distractor es falso. Interna: no viaja al cliente. */
  readonly nota?: string;
}

export interface RotuloCrudo {
  readonly tipo: 'leyenda' | 'testimonio';
  readonly texto: string;
}

export interface ItemCrudo {
  readonly id: string;
  readonly us: readonly string[];
  readonly dificultad: Dificultad;
  readonly imagen: ImagenCruda;
  readonly opciones: readonly OpcionCruda[];
  readonly explicacion?: string;
  readonly rotulo?: RotuloCrudo;
  readonly fuentes: readonly string[];
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
  readonly items: readonly ItemCrudo[];
}

export interface Opcion {
  readonly texto: string;
  readonly correcta: boolean;
}

export interface Imagen {
  readonly ruta: string;
  readonly encuadre: Encuadre;
  readonly edicion: string;
  readonly credito: Credito;
}

/** Lo que efectivamente viaja al navegador. Sin notas internas. */
export interface Item {
  readonly id: string;
  readonly dificultad: Dificultad;
  readonly imagen: Imagen;
  readonly opciones: readonly Opcion[];
  readonly explicacion?: string;
  readonly rotulo?: RotuloCrudo;
}

export class BancoInvalido extends Error {}

/**
 * De dónde sale el archivo según el encuadre.
 *
 * Los produce `scripts/generar-tapas.mjs`: la tapa entera vive en `public/tapas/` y el
 * detalle recortado en `public/tapas/detalle/` (`D-21`, `UX-04`).
 */
export function rutaImagen(imagen: Pick<ImagenCruda, 'archivo' | 'encuadre'>): string {
  return imagen.encuadre === 'detalle'
    ? `/tapas/detalle/${imagen.archivo}.jpg`
    : `/tapas/${imagen.archivo}.jpg`;
}

/** Quita del ítem todo lo que el jugador no tiene que ver. */
export function aPayload(item: ItemCrudo): Item {
  return {
    id: item.id,
    dificultad: item.dificultad,
    imagen: {
      ruta: rutaImagen(item.imagen),
      encuadre: item.imagen.encuadre,
      edicion: item.imagen.edicion,
      credito: item.imagen.credito,
    },
    opciones: item.opciones.map((o) => ({ texto: o.texto, correcta: o.correcta })),
    ...(item.explicacion ? { explicacion: item.explicacion } : {}),
    ...(item.rotulo ? { rotulo: item.rotulo } : {}),
  };
}

/**
 * Invariantes que el código necesita. Fallan ruidoso en build, no en la cara del jugador.
 *
 * Las dos últimas son las de este juego y no existen en el quiz: sin ellas, una tapa
 * puede llegar a pantalla sin firmar, o una edición sin confirmar puede terminar siendo
 * la respuesta que el juego premia.
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
    // BR-04: cuatro opciones, igual que el quiz.
    if (it.opciones.length !== 4) {
      throw new BancoInvalido(`${it.id}: tiene ${it.opciones.length} opciones, BR-04 fija 4`);
    }
    // D-21 y D-04: ninguna tapa llega a pantalla sin nombrar a Rocambole.
    if (!it.imagen.credito?.autor?.trim()) {
      throw new BancoInvalido(`${it.id}: la imagen no trae credito y ninguna tapa se publica sin firmar`);
    }
    // D-21, lo unico estricto: la respuesta correcta tiene que ser correcta.
    if (VETADAS_COMO_CORRECTA.includes(it.imagen.auditoria)) {
      throw new BancoInvalido(
        `${it.id}: la imagen quedo como "${it.imagen.auditoria}" en RES-44 y no se puede afirmar nada sobre ella`,
      );
    }
    // El schema ya lo pide, pero acá importa por otro motivo: la edicion es lo que
    // vuelve honesta a una reedicion. Sin ella, el jugador no sabe que esta mirando.
    if (!it.imagen.edicion?.trim()) {
      throw new BancoInvalido(`${it.id}: la imagen no declara que edicion es`);
    }
    if (it.fuentes.length === 0) {
      throw new BancoInvalido(`${it.id}: no cita ninguna ficha`);
    }
  }
}

/**
 * Carga el banco y devuelve solo los ítems jugables.
 *
 * `borrador` y `retirado` no llegan al jugador: es el mismo mecanismo del quiz, que
 * permite retirar un ítem sin perderlo.
 */
export function cargarBanco(crudo: BancoCrudo): readonly Item[] {
  const jugables = crudo.items.filter((i) => i.estado === 'listo');
  verificarInvariantes(jugables);
  return jugables.map(aPayload);
}
