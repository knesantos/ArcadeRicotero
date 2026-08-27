/**
 * El payload de una corrección, y su renderizado a texto. Implementa `CTR-10`.
 *
 * ## 🔴 Este archivo no puede tocar el navegador, y eso se audita
 *
 * `CTR-10` apartado 3: acá **no** se menciona `navigator`, `Date`, `localStorage`,
 * `sessionStorage`, `screen`, `document`, `location` ni `crypto`. No es una convención:
 * lo verifica una prueba que **lee este fuente**, igual que hacen `estilos.test.ts` y
 * `voz.test.ts` con lo suyo.
 *
 * El motivo es `BR-21`: al que corrige no se le pide nada — ni nombre, ni mail, ni
 * aparato, ni hora. Un módulo que no puede leer el navegador no puede filtrar al
 * navegador ni por accidente, y eso es más fuerte que acordarse de no hacerlo.
 *
 * **Y la URL de la página no se copia nunca.** No es teórico: `ADR-02` v2 mete
 * `?n=<nombre>` en los links de desafío, así que `location.href` puede traer **el nombre
 * de un tercero** que no tiene nada que ver con la corrección. La ubicación del ítem se
 * reconstruye desde `juego` e `itemId`, que son datos del banco.
 */

export type JuegoCorregible = 'quiz' | 'letra' | 'por-la-letra' | 'tapa' | 'tema' | 'redondopedia';

/** Las tres casillas de `D-14`. */
export type RotuloCorregible = 'hecho' | 'leyenda' | 'testimonio';

export interface FuenteDeCorreccion {
  readonly sitio?: string;
  readonly url?: string;
  readonly fichas?: readonly string[];
}

/** Contra qué versión del banco se escribió. `CTR-10.2.2`: reemplaza a la fecha. */
export interface BancoDeCorreccion {
  readonly contrato: string;
  readonly version: number;
  readonly actualizado?: string;
}

/** Los once campos de `CTR-10.2`. Ninguno es de la persona. */
export interface Correccion {
  readonly contrato: 'CTR-10';
  readonly v: 1;
  readonly juego: JuegoCorregible;
  readonly itemId: string;
  readonly ubicacion?: string;
  /** Qué dice el sitio hoy, textual. Sale del banco, **nunca del DOM**. */
  readonly dice: string;
  readonly rotulo?: RotuloCorregible;
  /** Lo único que escribe la persona. Sin tope de largo. */
  readonly deberiaDecir: string;
  readonly fuente?: FuenteDeCorreccion;
  readonly banco: BancoDeCorreccion;
}

export const CONTRATO = 'CTR-10' as const;
export const VERSION = 1 as const;

/** `CTR-10.5.1`. Se mide la URL **ya codificada**, no el texto. */
export const LARGO_MAX_URL = 1800;
/** Prefijo mínimo de `dice` que se conserva: con menos deja de servir para encontrar
 *  un párrafo de la Redondopedia, el único ítem del sitio sin identificador propio. */
export const DICE_MIN = 60;

const ID_VALIDO = /^[A-Za-z0-9-]{1,60}$/;
const UBICACION_MAX = 40;

export class CorreccionInvalida extends Error {}

/** Arma una corrección validada. Tira si le falta lo que la vuelve accionable. */
export function armar(datos: Omit<Correccion, 'contrato' | 'v'>): Correccion {
  if (!ID_VALIDO.test(datos.itemId)) {
    throw new CorreccionInvalida(`itemId invalido: "${datos.itemId}"`);
  }
  if (!datos.dice.trim()) throw new CorreccionInvalida('dice no puede estar vacio');
  if (!datos.deberiaDecir.trim()) throw new CorreccionInvalida('deberiaDecir no puede estar vacio');
  if (datos.ubicacion && datos.ubicacion.length > UBICACION_MAX) {
    throw new CorreccionInvalida(`ubicacion pasa de ${UBICACION_MAX} caracteres`);
  }
  return { contrato: CONTRATO, v: VERSION, ...datos };
}

/**
 * El renderizador es **una lista blanca**, no un recorrido del objeto (`CTR-10.3`).
 *
 * Nada de `Object.entries` ni de `JSON.stringify` del objeto entero: se imprimen los once
 * campos del tipo, en orden fijo. Si alguien mañana le agrega un campo al objeto, **no se
 * imprime** hasta que también lo agregue acá — que es exactamente la guarda que hace falta
 * cuando lo que se manda afuera no puede llevar datos de nadie.
 */
export function aTexto(c: Correccion, opciones: { readonly recortar?: boolean } = {}): {
  readonly texto: string;
  readonly recortado: boolean;
} {
  let recortado = false;
  const lineas: string[] = [];
  const poner = (etiqueta: string, valor: string | undefined) => {
    if (valor) lineas.push(`${etiqueta}: ${valor}`);
  };

  poner('Contrato', `${c.contrato} v${c.v}`);
  poner('Juego', c.juego);
  poner('Ítem', c.itemId);
  poner('Ubicación', c.ubicacion);
  poner('Dice', c.dice);
  poner('Rótulo', c.rotulo);
  poner('Debería decir', c.deberiaDecir);
  if (c.fuente) {
    poner('Fuente', c.fuente.sitio);
    if (!opciones.recortar) poner('URL', c.fuente.url);
    if (!opciones.recortar && c.fuente.fichas?.length) poner('Fichas', c.fuente.fichas.join(', '));
  }
  poner('Banco', `${c.banco.contrato} v${c.banco.version}${c.banco.actualizado ? ` (${c.banco.actualizado})` : ''}`);

  if (opciones.recortar && (c.fuente?.url || c.fuente?.fichas?.length)) recortado = true;
  return { texto: lineas.join('\n'), recortado };
}

/**
 * El texto para el cuerpo del `mailto:`, recortado si hace falta para que la URL entre.
 *
 * El orden de recorte lo fija `CTR-10.5.2`, y su criterio en una línea: **se recorta lo
 * que se puede volver a buscar en el repo con `itemId`; nunca lo que solo existe en el
 * mensaje.** Primero cae la URL de la fuente, después las fichas, después `dice` se acorta
 * a prefijo — y `deberiaDecir` **no se recorta jamás**.
 *
 * Si aun así no entra, devuelve `null`: media corrección es peor que ninguna, porque se
 * puede leer al revés y aplicar mal, y aplicar mal un dato es el único daño que este
 * proyecto declara estricto. El transporte de mail responde `no-pudo` y la cadena sigue
 * con el portapapeles, que no tiene tope.
 */
export function aTextoParaMail(c: Correccion, largoBase: number): {
  readonly texto: string;
  readonly recortado: boolean;
} | null {
  const cabe = (t: string) => largoBase + encodeURIComponent(t).length <= LARGO_MAX_URL;

  const entero = aTexto(c);
  if (cabe(entero.texto)) return entero;

  // 1 y 2: se caen la URL y las fichas de la fuente.
  const podado = aTexto(c, { recortar: true });
  if (cabe(podado.texto)) return { texto: marcar(podado.texto), recortado: true };

  // 3: `dice` se acorta a prefijo, nunca a cero.
  for (let largo = c.dice.length; largo >= DICE_MIN; largo -= 20) {
    const corto = aTexto({ ...c, dice: `${c.dice.slice(0, largo)}…` }, { recortar: true });
    if (cabe(corto.texto)) return { texto: marcar(corto.texto), recortado: true };
  }

  // 4: `deberiaDecir` no se toca. Si no entra, no hay mail.
  return null;
}

/** Un mensaje incompleto que no avisa que está incompleto es un rótulo que miente. */
function marcar(texto: string): string {
  return `${texto}\n\n[recortado por largo — CTR-10]`;
}
