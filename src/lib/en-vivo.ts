/**
 * La dificultad de los juegos con canciones, leída del conteo que publica setlist.fm. **Las
 * dos reglas que salen de ese conteo viven acá, y cada una una sola vez** (`D-46`, `BR-30`).
 *
 * | Juego | Regla | Función | Contrato |
 * |---|---|---|---|
 * | `US-02` Adiviná el tema | el corte de 8 Fáciles | `repartirEnVivo()` | `CTR-19.5` |
 * | `US-07` Sacalo por la letra | los tercios de `D-27` | `repartirEnTercios()` | `CTR-19.15` |
 *
 * Las dos arrancan del mismo paso 1 (`lineasDelPozo()`) y ninguna lee otra cosa que un
 * `ConteoCitado`. El quiz y `US-03` no entran: su dificultad mide otra cosa (`BR-30`).
 *
 * ## De dónde sale
 *
 * `D-45` (enmendada el 2026-09-23) y `BR-18` apartado (h) llevaron el corte de `US-02` a lo
 * más tocado en vivo. `D-46` (2026-09-24) llevó ahí la dificultad de todo juego con
 * canciones: *"La dificultad de todo lo que sea con canciones sale de ahí"*. El conteo es
 * cuántas veces figura cada tema en los setlists que carga la gente en setlist.fm, copiado a
 * mano de su página de estadísticas (`RES-90`, el conteo completo) a
 * `src/data/setlistfm.json`. **No es cuántas veces lo tocó la banda** (`CTR-19.3`).
 *
 * ## Por qué es un módulo aparte, puro
 *
 * Sin `node:fs` y sin importar ningún JSON: recibe el conteo ya leído. Así lo pueden usar
 * `catalogo.ts` en build, `scripts/generar-por-la-letra.mjs` y los tests con conteos
 * inventados, y el aislamiento de `CTR-19.13` (t8, t15) se puede afirmar buscando texto:
 * este archivo no nombra el archivo de las vistas de YouTube ni el de los recitales
 * enteros. **El conteo no se mezcla con las vistas** —`D-45` consecuencia 1, `D-46`
 * consecuencia 3— porque ninguna firma de acá acepta las dos cosas a la vez.
 *
 * ## Las reglas, en una línea cada una
 *
 * - **El corte de `US-02`**: los Fáciles son los primeros `m` del ranking del pozo, con `m`
 *   el mayor valor hasta la cuota tal que el último de ellos **supera estrictamente** todo lo
 *   que podría estar a su altura sin haber quedado adentro.
 * - **Los tercios de `US-07`**: un tema queda en una franja solo si a lo sumo un tercio (o
 *   dos) del pozo figura al menos tantas veces como él.
 *
 * En las dos, **un empate en el borde baja entero**: no lo decide ni el azar ni el orden
 * del arreglo, que dentro de un empate es el abecedario de la página.
 */

/** Los tres niveles de `BR-01`. Vivía en el módulo de las vistas, que se retiró (`CTR-19.15`). */
export type NivelDificultad = 'facil' | 'media' | 'dificil';

/** Una línea publicada en la página de estadísticas, como la guarda `setlistfm.json`. */
export interface LineaCitada {
  readonly titulo: string;
  readonly veces: number;
  readonly slug?: string;
  /** Otra grafía de un tema que ya tiene su línea con `slug`: no suma ni entra a ningún reparto (`CTR-19.2`). */
  readonly grafiaDe?: string;
  readonly fuera?: string;
  /** Obligatoria en `grafiaDe` y `sin-identificar` (el schema lo exige). Ninguna regla la lee. */
  readonly nota?: string;
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

type LineaDelPozo = LineaCitada & { readonly slug: string };

/**
 * El paso 1 de las dos reglas (`CTR-19.5` y `CTR-19.15`), escrito una sola vez: las líneas
 * con `slug` dentro del pozo, de mayor a menor. Las `grafiaDe` y las `fuera` no entran
 * porque no tienen `slug`. `Array.prototype.sort` es estable: a igual número queda el orden
 * de la página, y ninguna de las dos reglas deja que ese orden decida un borde.
 */
function lineasDelPozo(pozo: ReadonlySet<string>, conteo: ConteoCitado): LineaDelPozo[] {
  return conteo.temas
    .filter((l): l is LineaDelPozo => typeof l.slug === 'string' && pozo.has(l.slug))
    .sort((a, b) => b.veces - a.veces);
}

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

  const L = lineasDelPozo(pozo, conteo);

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

export interface TerciosEnVivo {
  /** Todo el pozo: cada tema del banco con su nivel. */
  readonly porSlug: ReadonlyMap<string, NivelDificultad>;
  /** Temas del pozo con una línea `slug`: sobre estos se parten los tercios. */
  readonly conConteo: number;
  /** Temas del pozo sin línea. Son `dificil` (`D-27`) y se nombran para que el log los muestre. */
  readonly sinConteo: readonly string[];
  readonly porNivel: Readonly<Record<NivelDificultad, number>>;
}

/**
 * Los tercios de `D-27` con la medida de `D-46`, para "Sacalo por la letra" (`CTR-19.15`).
 *
 * Los temas del pozo con línea se parten en tres franjas de `t = ⌈|L| / 3⌉`. Un tema sin
 * línea es `dificil` y no ocupa lugar en los tercios (*"sin escucha por ahora es
 * difícil"*). Lo que agrega el contrato es el borde: **un tema queda arriba solo si supera
 * estrictamente a todo lo que quedó abajo**. Por eso no se mira el puesto en el arreglo
 * sino el **alcance** de cada línea: cuántos temas del pozo figuran al menos tantas veces
 * como ella. Un grupo empatado comparte alcance y baja entero.
 *
 * Con la página incompleta (`completo: false`), un tema que no figura puede tener hasta la
 * cifra de la última línea publicada (`CTR-19.3`). Por eso a una línea que no la supera se
 * le suman al alcance los temas sin línea: no puede quedar arriba de ellos.
 *
 * La usa solo `scripts/generar-por-la-letra.mjs`, que escribe el nivel en el banco. No
 * garantiza el piso de 15 Fáciles de `US-07`: lo mide (`porNivel`).
 */
export function repartirEnTercios(pozo: ReadonlySet<string>, conteo: ConteoCitado | null): TerciosEnVivo {
  const porSlug = new Map<string, NivelDificultad>();
  for (const slug of pozo) porSlug.set(slug, 'dificil');

  // Paso 1.
  const L = conteo === null ? [] : lineasDelPozo(pozo, conteo);

  // Paso 2.
  const conLinea = new Set(L.map((l) => l.slug));
  const sinConteo = [...pozo].filter((s) => !conLinea.has(s));

  if (conteo !== null && L.length > 0) {
    // Paso 3.
    const t = Math.ceil(L.length / 3);
    const ultima = conteo.temas[conteo.temas.length - 1]!;

    // Pasos 4 y 5.
    for (const l of L) {
      let alcance = L.filter((x) => x.veces >= l.veces).length;
      if (!conteo.completo && l.veces <= ultima.veces) alcance += sinConteo.length;
      porSlug.set(l.slug, alcance <= t ? 'facil' : alcance <= 2 * t ? 'media' : 'dificil');
    }
  }

  const porNivel: Record<NivelDificultad, number> = { facil: 0, media: 0, dificil: 0 };
  for (const nivel of porSlug.values()) porNivel[nivel]++;

  return { porSlug, conConteo: L.length, sinConteo, porNivel };
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

  // t1. El slug guardado es el que da la puerta, lo de afuera sigue afuera, y una grafía es
  // de un tema que ya cuenta con su propia línea, con un número que no es menor (`CTR-19.2`).
  const porSlug = new Map<string, LineaCitada>();
  for (const l of conteo.temas) if (l.slug !== undefined && !porSlug.has(l.slug)) porSlug.set(l.slug, l);

  for (const l of conteo.temas) {
    const dice = resolver(l.titulo);
    if (l.grafiaDe !== undefined) {
      if (dice !== l.grafiaDe) {
        problemas.push(
          `«${l.titulo}» es grafía de "${l.grafiaDe}" y la puerta de D-13 dice ${dice === null ? 'que no es de los 105' : `"${dice}"`}: ` +
            'el juicio de que es ese tema vive en ALIAS, no en el dato',
        );
      }
      const cuenta = porSlug.get(l.grafiaDe);
      if (cuenta === undefined) {
        problemas.push(`«${l.titulo}» es grafía de "${l.grafiaDe}", y ninguna línea cuenta ese tema con su slug`);
      } else if (cuenta.veces < l.veces) {
        problemas.push(
          `«${l.titulo}» (${l.veces}) es grafía de «${cuenta.titulo}» (${cuenta.veces}): ` +
            'cuenta la que más figura, así que el slug va en la de más veces',
        );
      }
    } else if (l.slug !== undefined) {
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
          'La de menos veces pasa a grafiaDe con una nota',
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
