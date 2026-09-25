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

/**
 * De donde salio el texto del verso, con lo que `T-145` muestra en pantalla (`CTR-04.6`
 * v2): la ficha que respalda a la fuente, el sitio y el enlace exacto. Antes era un
 * arreglo de strings `RES-XX`; el objeto existe porque el jugador tiene que poder ver
 * de donde salio el verso sin abrir el repo.
 */
export interface FuenteDeLetra {
  readonly ficha: string;
  readonly sitio: string;
  readonly url: string;
  readonly consultado: string;
}

/**
 * Por que via un item esta `listo` (`CTR-04.6` v2, `D-25`). Los tres regimenes son
 * excluyentes y cada uno se verifica contra su evidencia en `verificarInvariantes`:
 * `oido` exige `confirmadoDeOido`, `dos-fuentes` exige dos fichas, y `fuente-unica`
 * exige exactamente una y la referencia a `D-25` — para que un item promovido sin
 * cotejar no se pueda confundir nunca con uno verificado.
 */
export interface Cotejo {
  readonly regimen: 'oido' | 'dos-fuentes' | 'fuente-unica';
  readonly decision?: 'D-25';
}

/**
 * De dónde salió el nivel de un ítem (`CTR-04.14`, v3). `en-vivo`: de los tercios del
 * conteo citado sobre los temas del banco. `sin-conteo`: el tema no tiene línea en el
 * conteo, y por `D-27` es `dificil`. Nadie lo escribe a mano: lo escribe el generador.
 */
export type DificultadSegun = 'en-vivo' | 'sin-conteo';

export interface ItemCrudo {
  readonly id: string;
  readonly us: readonly string[];
  /**
   * El nivel del **tema** del ítem, no del verso (`D-46`, `BR-30`, `CTR-04.14`): lo da
   * `repartirEnTercios()` sobre los temas del banco, y manda cuánto contexto trae (`BR-03`).
   */
  readonly dificultad: Dificultad;
  /** No viaja al cliente: es de generación, igual que en `US-07`. */
  readonly dificultadSegun: DificultadSegun;
  readonly tema: Tema;
  readonly hueco: Hueco;
  readonly contexto: Contexto;
  readonly opciones?: readonly OpcionCruda[];
  readonly variantesAceptadas?: readonly string[];
  readonly explicacion?: string;
  readonly rotulo?: RotuloCrudo;
  readonly fuentes: readonly string[];
  readonly fuenteLetra: readonly FuenteDeLetra[];
  readonly cotejo?: Cotejo;
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
  /**
   * Con qué conteo citado se calcularon los niveles: la ficha y la fecha del bloque `conteo`
   * de `src/data/setlistfm.json` (`CTR-04.1` v3). El número de cada tema no se copia acá.
   */
  readonly conteo: { readonly ficha: string; readonly consultado: string };
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
  /** De donde salio el verso. Viaja para que `T-145` lo muestre en el panel (`D-25`). */
  readonly fuenteLetra: readonly FuenteDeLetra[];
  /** Por que via esta `listo`. Solo el regimen: la referencia a `D-25` es del repo. */
  readonly cotejoRegimen?: Cotejo['regimen'];
}

export class BancoInvalido extends Error {}

/**
 * `M:SS` o `MM:SS`. El mismo patrón que hace cumplir `letra.schema.json`, repetido acá
 * a propósito: el schema no lo corre ningún test, así que hasta hoy este campo no tenía
 * más guardián que la buena fe de quien editaba el JSON a mano.
 */
const MINUTO = /^\d{1,2}:[0-5]\d$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const DONDES: readonly Donde[] = ['disco-fisico', 'streaming', 'video'];

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
    fuenteLetra: item.fuenteLetra,
    ...(item.cotejo ? { cotejoRegimen: item.cotejo.regimen } : {}),
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
    //
    // **Exacto, no tope** (`CTR-04.14`, `n2`). Hasta v2 esto miraba `>`: un Facil con un
    // verso de cada lado pasaba el build y no pasaba el schema. Con el acople de `BR-30`
    // —el nivel sale del conteo del tema y el contexto lo sigue— un Facil flaco deja de ser
    // tolerable: es la puerta del que llega sin saber nada.
    const esperado = CONTEXTO_POR_NIVEL[it.dificultad];
    for (const [lado, versos] of [['antes', it.contexto.antes], ['despues', it.contexto.despues]] as const) {
      if (versos.length !== esperado) {
        throw new BancoInvalido(
          `${it.id}: es ${it.dificultad} y trae ${versos.length} versos ${lado} del hueco, BR-03 pide exactamente ${esperado}`,
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

    // CTR-04.6 v2, la regla que decide si el juego miente. En v1 un item pasaba a
    // `listo` solo con oido o con dos fuentes; `D-25` sumo la tercera via, y lo que
    // esta regla garantiza ahora no es la verificacion sino EL RASTRO: por que via
    // esta `listo` cada item, sin que un regimen se pueda disfrazar de otro. Es la
    // misma regla que las ramas 7 y 8 del schema — no una parecida — y vive tambien
    // aca porque corre en build, que es donde tiene que romperse.
    if (it.estado === 'listo') {
      const c = it.cotejo;
      if (!c) {
        throw new BancoInvalido(
          `${it.id}: esta en 'listo' sin cotejo. CTR-04.6 v2 exige declarar la via.`,
        );
      }
      if (c.regimen === 'oido' && !it.confirmadoDeOido) {
        throw new BancoInvalido(`${it.id}: cotejo 'oido' sin confirmadoDeOido`);
      }
      if (c.regimen === 'dos-fuentes' && it.fuenteLetra.length < 2) {
        throw new BancoInvalido(`${it.id}: cotejo 'dos-fuentes' con ${it.fuenteLetra.length} ficha`);
      }
      if (c.regimen === 'fuente-unica') {
        if (it.fuenteLetra.length !== 1) {
          throw new BancoInvalido(`${it.id}: cotejo 'fuente-unica' con ${it.fuenteLetra.length} fichas`);
        }
        if (c.decision !== 'D-25') {
          throw new BancoInvalido(`${it.id}: cotejo 'fuente-unica' sin la referencia a D-25`);
        }
        if (it.confirmadoDeOido) {
          throw new BancoInvalido(
            `${it.id}: cotejo 'fuente-unica' con confirmadoDeOido — le corresponde el regimen 'oido'`,
          );
        }
      }
    }

    // Y si dice estar confirmado, que la confirmacion sea una confirmacion. `minuto` es
    // el campo que la separa de un tilde puesto por inercia: solo se puede escribir
    // habiendo encontrado el verso en la grabacion, y deja el item re-chequeable por
    // otra persona en veinte segundos.
    const conf = it.confirmadoDeOido;
    if (conf) {
      if (!MINUTO.test(conf.minuto)) {
        throw new BancoInvalido(
          `${it.id}: confirmadoDeOido.minuto es "${conf.minuto}" y CTR-04 pide M:SS o MM:SS. ` +
            `Sin el minuto no es una confirmacion, es un tilde.`,
        );
      }
      if (!FECHA.test(conf.fecha)) {
        throw new BancoInvalido(`${it.id}: confirmadoDeOido.fecha es "${conf.fecha}" y va AAAA-MM-DD`);
      }
      if (!DONDES.includes(conf.donde)) {
        throw new BancoInvalido(
          `${it.id}: confirmadoDeOido.donde es "${conf.donde}" y va ${DONDES.join(' | ')}`,
        );
      }
      if (conf.quien.trim().length < 3) {
        throw new BancoInvalido(`${it.id}: confirmadoDeOido.quien no dice quien escucho`);
      }
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
