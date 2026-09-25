/**
 * El avance guardado en el aparato (`CTR-16.11`, `US-09` criterio 9 enmendado por `BR-31`, `D-47`
 * punto 2): **hasta qué nivel de la fila llegó alguien, sin cuenta y sin sincronización.**
 *
 * ## Qué se guarda, y qué no
 *
 * Una sola clave, **`arcade.skayboy.avance`**, literal (`CTR-16.11.1`): si el juego cambia de
 * nombre, nadie pierde lo que jugó. El valor es `{"pasados":["NIV-01","NIV-02"]}`: los `id` de los
 * niveles ganados en este aparato, en el orden en que se pasaron, sin repetir. **Nada más**: ni
 * tiempo, ni puntaje, ni fecha, ni cuántas veces se falló.
 *
 * - **Ausente o roto** es sin avance, y la próxima victoria lo pisa. Un valor corrupto no es un
 *   avance (`ADR-04.5`).
 * - **Los ids que la fila de hoy no tiene** se conservan al escribir y no cuentan al leer: es el
 *   nivel que dejó de servirse, o uno que todavía no pasó a `listo`. Si vuelve, vuelve pasado.
 * - **Los campos que no conoce** se conservan al escribir (`resto`): una versión posterior puede
 *   sumar uno sin clave nueva, y una pestaña con este código no se lo borra.
 * - **"Hasta qué nivel llegó" se calcula, no se guarda** (`hastaDonde()`): son los niveles de la
 *   fila de hoy pasados seguidos desde el primero. Si se guardara el número, dejaría de decir la
 *   verdad el día en que la fila cambie.
 *
 * ## Puro, salvo dos funciones chicas
 *
 * Todo lo que decide vive en funciones puras y se juega en Node (`avance.test.ts`). Las únicas que
 * tocan el aparato son `cargarAvance()` y `guardarPasado()`, y las dos lo hacen adentro de un
 * `try`: **si `localStorage` tira** —Safari en privado, la cuota llena, un marco que no lo deja—,
 * se traga y se sigue con el avance en memoria mientras dure la página. Perder el avance es una
 * molestia; romper el juego por no poder guardar sería ridículo.
 *
 * **Cuándo se escribe lo decide la isla, y es en el cuadro en que el mundo marca `terminado`**, no
 * al tocar "Seguí": quien cierra el teléfono con la victoria en pantalla no pierde el nivel. Se lee
 * lo que hay, se suma el `id` y se escribe, así **dos pestañas se juntan por unión** y ninguna le
 * borra el avance a la otra.
 *
 * Este módulo no importa el motor, ni el DOM, ni nada de `node:*` (`CTR-16.8`).
 */

import type { Nivel } from './niveles.ts';

/** La clave, literal (`CTR-16.11.1`). El `arcade.` es el espacio de nombres del sitio (`ADR-04.5`). */
export const CLAVE_AVANCE = 'arcade.skayboy.avance';

/** La forma de un `id` de nivel que se acepta al leer. Lo demás se descarta. */
const ID_DE_NIVEL = /^NIV-\d{2}$/;

/** El avance: los niveles pasados, y lo que haya en el valor que este código no conoce. */
export interface Avance {
  readonly pasados: readonly string[];
  readonly resto: Readonly<Record<string, unknown>>;
}

/** Sin avance: lo que hay la primera vez, y lo que vale un valor roto. */
export const SIN_AVANCE: Avance = Object.freeze({ pasados: Object.freeze([]) as readonly string[], resto: Object.freeze({}) });

/** Lo mínimo de `localStorage` que usa este módulo: lo que un doble de prueba tiene que tener. */
export interface Almacen {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
}

/* =========================================================================================
   Lo puro
   ========================================================================================= */

/**
 * El avance que dice ese texto. `null`, lo que no es JSON, lo que no es un objeto o un `pasados`
 * que no es un arreglo: **sin avance**. Las entradas que no son un `id` de nivel se descartan, y
 * las repetidas cuentan una vez, en el orden en que aparecieron por primera vez.
 */
export function leerAvance(texto: string | null): Avance {
  if (texto === null) return SIN_AVANCE;
  let valor: unknown;
  try {
    valor = JSON.parse(texto);
  } catch {
    return SIN_AVANCE;
  }
  if (valor === null || typeof valor !== 'object' || Array.isArray(valor)) return SIN_AVANCE;
  const { pasados, ...resto } = valor as Record<string, unknown>;
  if (!Array.isArray(pasados)) return SIN_AVANCE;
  const ids: string[] = [];
  for (const p of pasados) {
    if (typeof p === 'string' && ID_DE_NIVEL.test(p) && !ids.includes(p)) ids.push(p);
  }
  return { pasados: ids, resto };
}

/** El mismo avance con ese nivel pasado. Si ya estaba, el mismo avance: no se repite ni se mueve. */
export function conPasado(avance: Avance, id: string): Avance {
  if (avance.pasados.includes(id)) return avance;
  return { pasados: [...avance.pasados, id], resto: avance.resto };
}

/**
 * Los dos avances juntos: los pasados de `a` y después los de `b` que `a` no tenía; y el resto de
 * `b` pisado por el de `a`. Es la unión de dos pestañas, o de lo guardado con lo que quedó en
 * memoria cuando no se pudo escribir.
 */
export function unirAvances(a: Avance, b: Avance): Avance {
  let unido: Avance = { pasados: a.pasados, resto: { ...b.resto, ...a.resto } };
  for (const id of b.pasados) unido = conPasado(unido, id);
  return unido;
}

/** El texto que se guarda: `pasados` y **todo lo que no conoce**, tal como vino. */
export function textoDeAvance(avance: Avance): string {
  return JSON.stringify({ ...avance.resto, pasados: avance.pasados });
}

/**
 * **Dónde se retoma** (`CTR-16.11.2`): el primer nivel de la fila que no está pasado. Con un hueco
 * —`NIV-01` y `NIV-03` ganados, `NIV-02` no—, el hueco: no hay forma de saltear uno sin haber pasado
 * el anterior. Con todos pasados, `null`: "no queda ninguno". Qué se juega entonces no es de esta
 * función.
 */
export function siguienteDeLaFila(fila: readonly Nivel[], avance: Avance): Nivel | null {
  return fila.find((n) => !avance.pasados.includes(n.id)) ?? null;
}

/**
 * **Hasta qué nivel llegó**, de 0 a `fila.length`: cuántos de la fila, empezando por el primero y
 * sin saltear, están pasados. Es el número que se muestra (`US-09` criterio 9), nunca el que se
 * guarda.
 */
export function hastaDonde(fila: readonly Nivel[], avance: Avance): number {
  const i = fila.findIndex((n) => !avance.pasados.includes(n.id));
  return i < 0 ? fila.length : i;
}

/* =========================================================================================
   Las dos que tocan el aparato
   ========================================================================================= */

/**
 * Lo que esta página ya sabe que se ganó, aunque no lo haya podido escribir. Arranca vacío y lo
 * alimentan las dos funciones de abajo; con un `localStorage` que tira, es todo lo que hay.
 */
let enMemoria: Avance = SIN_AVANCE;

/** El `localStorage` de la página, si hay. **Pedirlo ya puede tirar** en un marco que no lo deja. */
function almacenDeLaPagina(): Almacen | undefined {
  return typeof localStorage === 'undefined' ? undefined : localStorage;
}

/**
 * El avance guardado, **una vez, al arrancar la isla**. Si no hay almacén, o si leer tira, lo que
 * haya en memoria: una página recién abierta arranca sin avance y juega el primero de la fila.
 */
export function cargarAvance(almacen?: Almacen): Avance {
  try {
    const a = almacen ?? almacenDeLaPagina();
    if (a !== undefined) enMemoria = unirAvances(leerAvance(a.getItem(CLAVE_AVANCE)), enMemoria);
  } catch {
    // Se traga y se sigue: sin avance guardado, se juega el primero de la fila.
  }
  return enMemoria;
}

/**
 * **Ese nivel, ganado**: se lee lo guardado, se le suma el `id` y se escribe. Nunca tira. Si leer o
 * escribir fallan, el avance en memoria ya lo tiene, y eso es lo que devuelve: mientras dure la
 * página, el nivel cuenta como pasado.
 */
export function guardarPasado(id: string, almacen?: Almacen): Avance {
  enMemoria = conPasado(enMemoria, id);
  try {
    const a = almacen ?? almacenDeLaPagina();
    if (a === undefined) return enMemoria;
    enMemoria = conPasado(unirAvances(leerAvance(a.getItem(CLAVE_AVANCE)), enMemoria), id);
    a.setItem(CLAVE_AVANCE, textoDeAvance(enMemoria));
  } catch {
    // Se traga y se sigue (`ADR-04.5`): la memoria de arriba ya se acordó.
  }
  return enMemoria;
}

/** Solo para las pruebas: cada caso arranca con la memoria de una página recién abierta. */
export function reiniciarAvanceParaPruebas(): void {
  enMemoria = SIN_AVANCE;
}
