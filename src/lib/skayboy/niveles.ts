/**
 * Los tipos del dato de niveles (`CTR-16`) y las funciones puras que lo leen.
 *
 * **Lo que este módulo no puede importar, y no es una preferencia** (`CTR-16.8`): nada de
 * `node:*`, nada de `sitio/arte.ts`, nada del motor. Lo lee la página en build y lo lee la
 * isla en el navegador, así que cualquiera de esas tres cosas lo rompería de un lado o del
 * otro. Por eso ninguna función de acá abre un archivo: el banco entra por parámetro.
 *
 * **Y lo que hace, que es la mitad que el schema no puede hacer.** `skayboy.schema.json`
 * mide el largo de cada renglón contra un número escrito en el schema; acá se mide contra
 * `ancho` y `alto` del propio dato, que es para lo que `CTR-16.2` los puso adentro del
 * archivo. Y sobre todo: **que cada caracter de la grilla esté declarado en la leyenda** no
 * lo puede ver ningún schema, porque JSON Schema no sabe mirar un valor hermano. Si esa
 * regla no vive acá, no vive en ninguna parte.
 */

/** Los dos, y son dos (`CTR-16.3`). */
export type IdPersonaje = 'skayboy' | 'poligirl';

/**
 * El enum de `tipo` de la leyenda (`CTR-16.4`).
 *
 * **No hay `letal` ni `mata`**: `FIND-58` los sacó y `UX-29 §7.2` dice por qué — el terreno
 * ajeno no lastima, devuelve a la entrada. Es el molinete otra vez. Un `letal` acá termina
 * siendo una clase de CSS y, tarde o temprano, una palabra en pantalla.
 */
export type TipoDeTerreno =
  | 'aire'
  | 'solido'
  | 'molinete'
  | 'tesoro'
  | 'entrada'
  | 'puerta'
  | 'mecanismo'
  | 'caja';

/**
 * Qué es un caracter de la grilla.
 *
 * `devuelve` es **la única** declaración de quién no pasa por dónde, y vive del lado del
 * terreno. Un campo gemelo en la ficha del personaje era `FIND-58`: dos lugares que dicen lo
 * mismo son un lugar donde se van a contradecir.
 */
export interface Terreno {
  readonly tipo: TipoDeTerreno;
  /** Solo en `molinete`: a quién devuelve a la entrada. Uno o los dos. */
  readonly devuelve?: readonly IdPersonaje[];
  /** Solo en `tesoro`: quién lo puede juntar. */
  readonly para?: readonly IdPersonaje[];
  /** Solo en `entrada` y `puerta`: de quién es. */
  readonly de?: IdPersonaje;
}

export interface Personaje {
  readonly id: IdPersonaje;
  readonly atlas: string;
}

export interface Mecanismo {
  readonly id: string;
  readonly en: readonly [number, number];
  readonly abre: readonly string[];
  /** `true` quiere decir que pide dos cuerpos a la vez, y entonces `alternativaSolo` existe. */
  readonly sostenido: boolean;
  readonly alternativaSolo?: string;
}

export interface Caja {
  readonly en: readonly [number, number];
}

/** Las dos pasadas de `CTR-16.7`. Las escribe el que jugó, no el que dibujó. */
export interface Verificaciones {
  readonly deDos: boolean;
  readonly solo: boolean;
}

export interface Nivel {
  readonly id: string;
  readonly nombre: string;
  readonly escalon: number;
  readonly estado: 'borrador' | 'listo';
  readonly grilla: readonly string[];
  readonly mecanismos: readonly Mecanismo[];
  readonly cajas: readonly Caja[];
  readonly verificaciones: Verificaciones;
}

export interface Banco {
  readonly contrato: string;
  readonly contratoVersion: number;
  readonly tile: number;
  readonly ancho: number;
  readonly alto: number;
  /** El tema que la cinta repite, o `null` mientras no esté elegido (`D-39`). */
  readonly temaFijo: string | null;
  readonly personajes: readonly Personaje[];
  readonly leyenda: Readonly<Record<string, Terreno>>;
  readonly niveles: readonly Nivel[];
}

/** Columna y fila en tiles, contadas desde arriba a la izquierda. */
export interface Posicion {
  readonly columna: number;
  readonly fila: number;
}

/**
 * Lo que la página le siembra al navegador: **solo los `listo`**, igual que `dos-ejes`
 * (`CTR-08`). Un `borrador` que se escapa al bundle es un nivel sin jugar en el teléfono de
 * alguien.
 */
export function nivelesListos(banco: Banco): readonly Nivel[] {
  return banco.niveles.filter((n) => n.estado === 'listo');
}

/** Qué hay en esa celda, o `undefined` si la coordenada cae afuera de la sala. */
export function terrenoEn(banco: Banco, nivel: Nivel, en: Posicion): Terreno | undefined {
  const renglon = nivel.grilla[en.fila];
  if (renglon === undefined) return undefined;
  const caracter = renglon[en.columna];
  if (caracter === undefined) return undefined;
  return banco.leyenda[caracter];
}

/**
 * Si ese terreno devuelve a ese personaje a la entrada.
 *
 * Se lee de la leyenda y de ningún otro lado, que es todo el punto de `FIND-58`. Un terreno
 * que no es molinete no devuelve a nadie.
 */
export function devuelveA(terreno: Terreno | undefined, personaje: IdPersonaje): boolean {
  if (terreno === undefined || terreno.tipo !== 'molinete') return false;
  return (terreno.devuelve ?? []).includes(personaje);
}

/** Dónde está la entrada, o la puerta, de ese personaje. La busca por la leyenda. */
export function posicionDe(
  banco: Banco,
  nivel: Nivel,
  tipo: 'entrada' | 'puerta',
  personaje: IdPersonaje,
): Posicion | undefined {
  const caracteres = Object.entries(banco.leyenda)
    .filter(([, t]) => t.tipo === tipo && t.de === personaje)
    .map(([c]) => c);
  for (let fila = 0; fila < nivel.grilla.length; fila++) {
    const renglon = nivel.grilla[fila] ?? '';
    for (let columna = 0; columna < renglon.length; columna++) {
      const caracter = renglon[columna];
      if (caracter !== undefined && caracteres.includes(caracter)) return { columna, fila };
    }
  }
  return undefined;
}

/**
 * Las reglas de `CTR-16.5` que un schema no puede correr, devueltas como una lista de
 * problemas en castellano. Vacía quiere decir que el banco está sano.
 *
 * Son dos, y las dos se miden contra el propio dato: que la grilla mida `alto` renglones de
 * `ancho` caracteres, y que **todo caracter que aparezca esté declarado en la leyenda**. Un
 * caracter sin declarar no es un error de tipeo inofensivo: es un tile que el motor va a
 * pintar como aire, y una pared que desaparece el día que alguien la dibuje.
 */
export function problemasDelBanco(banco: Banco): readonly string[] {
  const problemas: string[] = [];
  for (const nivel of banco.niveles) {
    if (nivel.grilla.length !== banco.alto) {
      problemas.push(
        `${nivel.id}: la grilla trae ${nivel.grilla.length} renglones y el alto es ${banco.alto}`,
      );
    }
    nivel.grilla.forEach((renglon, fila) => {
      if (renglon.length !== banco.ancho) {
        problemas.push(
          `${nivel.id}, renglón ${fila}: mide ${renglon.length} caracteres y el ancho es ${banco.ancho}`,
        );
      }
      for (const caracter of renglon) {
        if (banco.leyenda[caracter] === undefined) {
          problemas.push(`${nivel.id}, renglón ${fila}: «${caracter}» no está en la leyenda`);
        }
      }
    });
  }
  return problemas;
}
