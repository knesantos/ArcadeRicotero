/**
 * El corte de Fáciles de "Adiviná el tema" (`US-02`), leído del conteo que publica
 * setlist.fm. **`CTR-19.5`, y vive acá una sola vez.**
 *
 * ## De dónde sale
 *
 * `D-45` (enmendada el 2026-09-23) y `BR-18` apartado (h): dentro del pozo con fragmento de
 * audio, "Fácil" son los **8 títulos de mayor conteo citado** que resuelven a un tema del
 * catálogo. El conteo es cuántas veces figura cada tema en los setlists que carga la gente
 * en setlist.fm, copiado a mano de su página de estadísticas (`RES-74`) a
 * `src/data/setlistfm.json`. **No es cuántas veces lo tocó la banda** (`CTR-19.3`).
 *
 * ## Por qué es un módulo aparte, puro
 *
 * Sin `node:fs` y sin importar ningún JSON: recibe el conteo ya leído. Así lo pueden usar
 * `catalogo.ts` en build y los tests con conteos inventados, y el aislamiento de `CTR-19.13`
 * (t8) se puede afirmar buscando texto: este archivo no nombra el archivo de las vistas de
 * YouTube ni el de los recitales enteros. **El conteo no se mezcla con las vistas** —
 * `D-45` consecuencia 1— porque ninguna firma de acá acepta las dos cosas a la vez.
 *
 * ## La regla, en una línea
 *
 * Los Fáciles son los primeros `m` del ranking del pozo, con `m` el mayor valor hasta la
 * cuota tal que el último de ellos **supera estrictamente** todo lo que podría estar a su
 * altura sin haber quedado adentro. Un empate en el borde no lo decide ni el azar ni el
 * orden del arreglo: queda un Fácil menos y el test se pone en rojo con el `motivo`.
 */

import type { NivelDificultad } from './popularidad.ts';

/** Una línea publicada en la página de estadísticas, como la guarda `setlistfm.json`. */
export interface LineaCitada {
  readonly titulo: string;
  readonly veces: number;
  readonly slug?: string;
  readonly fuera?: string;
}

/** Lo que el corte necesita del bloque `conteo` de `setlistfm.json`. */
export interface ConteoCitado {
  readonly pagina: string;
  readonly consultado: string;
  readonly completo: boolean;
  readonly temas: readonly LineaCitada[];
}

export interface CorteEnVivo {
  /** Solo los temas del pozo. Lo que no está acá no se puede sortear. */
  readonly porSlug: ReadonlyMap<string, NivelDificultad>;
  /** 8 si el corte está determinado. Cero significa "este juego no escalona". */
  readonly faciles: number;
  /** Temas del pozo con una línea publicada. */
  readonly conConteo: number;
  readonly determinado: boolean;
  /** Si no está determinado, por qué: con los nombres y los números. */
  readonly motivo: string | null;
}

/** La cuota de `BR-01` para `US-02`. La fija `BR-18`, no este archivo. */
export const CUOTA_FACILES = 8;

/**
 * Reparte el pozo en tres niveles según el conteo citado (`CTR-19.5`, pasos 1 a 6).
 *
 * - **Fácil**: los primeros `m` del ranking del pozo (arriba).
 * - **Media**: el resto de las líneas del pozo que figuran en la página.
 * - **Difícil**: los temas del pozo que no figuran. Es `D-27` con las palabras del usuario
 *   —"sin escucha por ahora es difícil"—, donde "escucha" pasa a ser "figura en lo que
 *   publicó la página". Cambiar esta regla es tocar esta función, no el dato.
 */
export function repartirEnVivo(
  pozo: ReadonlySet<string>,
  conteo: ConteoCitado | null,
  cuota: number = CUOTA_FACILES,
): CorteEnVivo {
  const porSlug = new Map<string, NivelDificultad>();
  for (const slug of pozo) porSlug.set(slug, 'dificil');

  if (conteo === null) {
    return { porSlug, faciles: 0, conConteo: 0, determinado: false, motivo: 'sin conteo' };
  }

  // Paso 1. `Array.prototype.sort` es estable: a igual número queda el orden de la página.
  const L = conteo.temas
    .filter((l): l is LineaCitada & { slug: string } => typeof l.slug === 'string' && pozo.has(l.slug))
    .sort((a, b) => b.veces - a.veces);

  // Paso 2, las partes fijas del techo.
  const ultima = conteo.temas.length > 0 ? conteo.temas[conteo.temas.length - 1]! : null;
  const techoPorTop = !conteo.completo && ultima ? ultima.veces : 0;
  const sinIdentificar = conteo.temas
    .filter((l) => l.fuera === 'sin-identificar')
    .sort((a, b) => b.veces - a.veces)[0];
  const techoPorSinIdentificar = sinIdentificar?.veces ?? 0;

  const techo = (m: number): number => Math.max(L[m]?.veces ?? 0, techoPorTop, techoPorSinIdentificar);

  // Paso 3. El mayor `m` que cumple; `m = 0` cumple siempre.
  const tope = Math.min(cuota, L.length);
  let m = 0;
  for (let k = tope; k > 0; k--) {
    if (L[k - 1]!.veces > techo(k)) {
      m = k;
      break;
    }
  }

  // Paso 5.
  L.forEach((l, i) => porSlug.set(l.slug, i < m ? 'facil' : 'media'));

  // Paso 4.
  const determinado = m === cuota;
  let motivo: string | null = null;
  if (!determinado) {
    if (L.length < cuota) {
      motivo = `hay ${L.length} temas del pozo con conteo y la cuota es ${cuota}`;
    } else {
      const borde = L[cuota - 1]!;
      const causas: string[] = [];
      const siguiente = L[cuota];
      if (siguiente && siguiente.veces >= borde.veces) {
        causas.push(
          `${borde.titulo} (${borde.veces}) empata con ${siguiente.titulo} (${siguiente.veces}) en el puesto ${cuota}`,
        );
      }
      if (techoPorSinIdentificar >= borde.veces && sinIdentificar) {
        causas.push(`«${sinIdentificar.titulo}» (sin identificar) figura ${sinIdentificar.veces} veces, arriba del corte`);
      }
      if (techoPorTop >= borde.veces && ultima) {
        causas.push(
          `${borde.titulo} (${borde.veces}) no supera a la última línea publicada (${ultima.veces}): ` +
            'la página publica un top y un tema que no figura puede tener lo mismo',
        );
      }
      motivo = causas.join('; ') || `el puesto ${cuota} no queda separado del resto`;
    }
  }

  return { porSlug, faciles: m, conConteo: L.length, determinado, motivo };
}

/**
 * Lo que los schemas no pueden ver del conteo (`CTR-19.13`, t1 a t3), en una lista de
 * textos. Cada texto nombra la línea que lo causa. Lista vacía = el conteo está sano.
 *
 * `resolver` es la puerta de `D-13` (`resolverTema()` + `slugDeTitulo()`), recibida como
 * parámetro para que este módulo siga sin `node:fs`.
 */
export function problemasDelConteo(
  conteo: ConteoCitado,
  resolver: (titulo: string) => string | null,
): readonly string[] {
  const problemas: string[] = [];

  // t1. El slug guardado es el que da la puerta, y lo de afuera sigue afuera.
  for (const l of conteo.temas) {
    const dice = resolver(l.titulo);
    if (l.slug !== undefined) {
      if (dice === null) {
        problemas.push(
          `«${l.titulo}» (${l.veces}) no es ninguno de los 105 de RES-20 y está guardado con slug "${l.slug}": ` +
            'no suma al conteo. Declaralo fuera, o sumá el alias en letra/temas.ts',
        );
      } else if (dice !== l.slug) {
        problemas.push(`«${l.titulo}» guarda el slug "${l.slug}" y la puerta de D-13 dice "${dice}"`);
      }
    } else if (dice !== null) {
      problemas.push(
        `«${l.titulo}» está marcado fuera (${l.fuera ?? 'sin clase'}) y ahora resuelve a "${dice}": revisá la línea`,
      );
    }
  }

  // t2. `veces` no sube en el orden de la página.
  for (let i = 1; i < conteo.temas.length; i++) {
    const antes = conteo.temas[i - 1]!;
    const ahora = conteo.temas[i]!;
    if (ahora.veces > antes.veces) {
      problemas.push(
        `«${ahora.titulo}» (${ahora.veces}) está debajo de «${antes.titulo}» (${antes.veces}): ` +
          'la transcripción desordenó la página',
      );
    }
  }

  // t3. Un número por línea y una línea por slug: dos grafías no se suman (`CTR-19.2`).
  const vistos = new Map<string, string>();
  for (const l of conteo.temas) {
    if (l.slug === undefined) continue;
    const antes = vistos.get(l.slug);
    if (antes !== undefined) {
      problemas.push(
        `«${antes}» y «${l.titulo}» son el mismo tema (${l.slug}): no se suman. ` +
          'Una de las dos pasa a fuera "sin-identificar" con una nota',
      );
    }
    vistos.set(l.slug, l.titulo);
  }

  return problemas;
}

/** Días entre dos fechas `AAAA-MM-DD`, para la vigencia (`CTR-19.6`, t4). */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / 86_400_000);
}
