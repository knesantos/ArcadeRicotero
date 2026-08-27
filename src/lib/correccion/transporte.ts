/**
 * Los transportes de una corrección, detrás de una interfaz. `CTR-10` apartado 4.
 *
 * **El componente nunca nombra un transporte.** Pide `disponibles()` para saber cuántas
 * salidas ofrecer y llama a `enviar()`. La etiqueta visible de cada salida sale de
 * `CNT-12` indexada por `via` — `via` es una clave, no texto de pantalla.
 *
 * Esa indirección es lo que deja que `IDEA-13` (Supabase) entre algún día agregando un
 * transporte adelante en `ORDEN`, sin tocar el componente, ni el payload, ni las islas.
 */

import { aTexto, aTextoParaMail, type Correccion } from './armar.ts';
import { CASILLA, ASUNTO } from './destino.ts';

export type Via = 'mail' | 'portapapeles' | 'a-la-vista';

export interface Entrega {
  readonly via: Via;
  readonly resultado: 'copiado' | 'abierto' | 'a-la-vista' | 'no-pudo';
  /** El mensaje renderizado, siempre — aunque el transporte haya fallado. */
  readonly texto: string;
  readonly recortado: boolean;
}

export interface Transporte {
  readonly via: Via;
  /** Barato, sincrónico, sin efectos. */
  disponible(): boolean;
  entregar(c: Correccion): Promise<Entrega>;
}

/**
 * El mail.
 *
 * **`abierto` no es `enviado`, y la diferencia es técnica, no de redacción:** un `mailto:`
 * no devuelve nada. El navegador no informa si había cliente de correo, si se abrió, si la
 * persona escribió algo más o si lo canceló. **No existe forma de detectarlo**, y por eso
 * el mail nunca es el único camino ni un camino automático.
 */
const mail: Transporte = {
  via: 'mail',
  // Sin casilla configurada el transporte no existe: ni botón muerto, ni `mailto:`
  // generado hacia ningún lado. `CTR-10.6`.
  disponible: () => CASILLA !== null,
  async entregar(c) {
    const asunto = ASUNTO(c.juego);
    // El largo base es todo lo que la URL lleva además del cuerpo.
    const base = `mailto:${CASILLA}?subject=${encodeURIComponent(asunto)}&body=`.length;
    const armado = aTextoParaMail(c, base);
    if (!armado) {
      return { via: 'mail', resultado: 'no-pudo', texto: aTexto(c).texto, recortado: false };
    }
    globalThis.location.href = `mailto:${CASILLA}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(armado.texto)}`;
    return { via: 'mail', resultado: 'abierto', texto: armado.texto, recortado: armado.recortado };
  },
};

const portapapeles: Transporte = {
  via: 'portapapeles',
  disponible: () => typeof navigator !== 'undefined' && !!navigator.clipboard,
  async entregar(c) {
    const { texto } = aTexto(c);
    try {
      await navigator.clipboard.writeText(texto);
      return { via: 'portapapeles', resultado: 'copiado', texto, recortado: false };
    } catch {
      return { via: 'portapapeles', resultado: 'no-pudo', texto, recortado: false };
    }
  },
};

/**
 * El piso, y es el que hace cumplir `D-14` en este frente.
 *
 * No hace nada más que devolver el texto que ya está renderizado, así que **no puede
 * fallar**, y su `disponible()` es `true` siempre. No hay combinación de fallas que deje
 * a alguien sin poder mandar una corrección: en el peor caso, el texto está en pantalla
 * para copiarlo a mano.
 */
const aLaVista: Transporte = {
  via: 'a-la-vista',
  disponible: () => true,
  async entregar(c) {
    const { texto } = aTexto(c);
    return { via: 'a-la-vista', resultado: 'a-la-vista', texto, recortado: false };
  },
};

/** El orden de preferencia. Supabase entraría adelante, sin tocar nada más. */
export const ORDEN: readonly Transporte[] = [mail, portapapeles, aLaVista];

export function disponibles(): readonly Via[] {
  return ORDEN.filter((t) => t.disponible()).map((t) => t.via);
}

/**
 * Entrega la corrección. `CTR-10.4.1`.
 *
 * Si el transporte elegido responde `no-pudo`, sigue con el siguiente de `ORDEN` — y la
 * cadena **siempre** termina en `aLaVista`, que no puede fallar. La persona no se entera
 * de un intento fallido intermedio: lo que ve es la salida que sí funcionó.
 */
export async function enviar(c: Correccion, preferida?: Via): Promise<Entrega> {
  const cola = preferida
    ? [...ORDEN.filter((t) => t.via === preferida), ...ORDEN.filter((t) => t.via !== preferida)]
    : [...ORDEN];

  let ultima: Entrega | null = null;
  for (const t of cola) {
    if (!t.disponible()) continue;
    const e = await t.entregar(c);
    if (e.resultado !== 'no-pudo') return e;
    ultima = e;
  }
  return ultima ?? (await aLaVista.entregar(c));
}
