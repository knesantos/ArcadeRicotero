/**
 * La dificultad de un tema, derivada de cuánto se lo escucha. **Regla de `D-27`, y vive
 * acá una sola vez.**
 *
 * ## Por qué está en `src/lib/` y no adentro de un juego
 *
 * Nació en `src/lib/por-la-letra/dificultad.ts` para "Sacalo por la letra" y se mudó acá
 * en el ciclo 10 (`T-162`, `CTR-03.11`), cuando `US-02` pasó a repartir con la misma
 * regla. **Dos copias de una regla es el modo de falla que el motivo 3 de `CTR-03.8`
 * describe**: el día que el reparto cambie —de tercios a cuartos, o el criterio del tema
 * sin medición— la copia que nadie se acuerda de tocar queda mintiendo.
 *
 * La usan `scripts/generar-por-la-letra.mjs` (escribe `dificultad` en el banco de `US-07`)
 * y `src/lib/tema/catalogo.ts` (la estampa en build sobre los temas de `US-02`). Los dos
 * caminos son distintos a propósito y están explicados en `CTR-03.11`: allá el nivel se
 * escribe en el dato, acá se deriva, porque el audio no se regenera cada 180 días y la
 * popularidad sí se revisa (`BR-18` apartado d).
 *
 * ## De dónde sale esto
 *
 * Decisión del usuario (`D-27`): la dificultad **no se etiqueta a mano**, se infiere de
 * cuánto se escucha el tema. Y no es una idea nueva del proyecto — `BR-18` apartado (f)
 * ya había hecho exactamente esto para `US-02` en el ciclo 8: *"fácil" pasó a ser el top
 * del ranking de vistas de YouTube*, porque una etiqueta manual de "qué tan conocido es"
 * se corrompe sola y nadie la mantiene.
 *
 * Acá encaja todavía mejor que allá: **en este juego, "qué tan conocido es el tema" no es
 * un proxy de la dificultad — es la dificultad**. Sacar *Ji Ji Ji* por un verso es fácil
 * porque lo cantó todo el mundo; sacar *Nadie es perfecto* es difícil por lo mismo al
 * revés.
 *
 * ## La regla
 *
 * Se ordenan los temas **con medición** por vistas, de mayor a menor, y se parten en
 * tercios: el primero es `facil`, el segundo `media`, el tercero `dificil`.
 *
 * **Un tema sin medición es `dificil`**, y lo fijó el usuario con esas palabras: *"sin
 * escucha por ahora es difícil"*. Tiene su lógica — si nadie lo subió a YouTube o el
 * video no se encontró, es de los que menos circulan. Pero ojo con la consecuencia, que
 * está medida abajo.
 *
 * ## 🔴 Lo que esta regla produce HOY, y hay que decirlo
 *
 * `src/data/popularidad.json` tiene los **105 temas en `sin-video`** y **cero mediciones**:
 * la clave de YouTube (`YT_API_KEY`) nunca se cargó, así que la fase de resolución no
 * corrió nunca. Con eso, esta regla devuelve **`dificil` para todos**, y el juego queda
 * sin escalonamiento real — igual que antes, pero ahora **declarado**.
 *
 * No es un defecto de esta función: es que le falta el insumo. Un solo comando lo cambia:
 *
 *     YT_API_KEY=... npm run ingerir-popularidad -- --resolver
 *
 * El día que eso corra, los tercios aparecen solos y `BR-01` empieza a cumplirse de
 * verdad, sin tocar una línea de código.
 */

export type NivelDificultad = 'facil' | 'media' | 'dificil';

/** Una entrada de `src/data/popularidad.json`, con lo que esta regla necesita. */
export interface TemaMedido {
  readonly slug: string;
  readonly estado: string;
  readonly medicion?: { readonly vistas: number };
}

export interface Reparto {
  readonly porSlug: ReadonlyMap<string, NivelDificultad>;
  /** Cuántos temas tenían medición de verdad. Cero significa "no hay escalonamiento". */
  readonly medidos: number;
}

/**
 * Reparte los temas en tres niveles según las vistas.
 *
 * Los que no tienen medición no entran al ranking: se les asigna `dificil` directo, sin
 * ocupar lugar en los tercios. Si entraran, empujarían a los temas medidos hacia arriba y
 * un tema de popularidad media pasaría a `facil` por el peso de los que no se midieron.
 */
export function repartirPorPopularidad(temas: readonly TemaMedido[]): Reparto {
  const porSlug = new Map<string, NivelDificultad>();

  const medidos = temas
    .filter((t) => typeof t.medicion?.vistas === 'number')
    .sort((a, b) => b.medicion!.vistas - a.medicion!.vistas);

  for (const t of temas) porSlug.set(t.slug, 'dificil');

  if (medidos.length === 0) return { porSlug, medidos: 0 };

  const corte = Math.ceil(medidos.length / 3);
  medidos.forEach((t, i) => {
    porSlug.set(t.slug, i < corte ? 'facil' : i < corte * 2 ? 'media' : 'dificil');
  });

  return { porSlug, medidos: medidos.length };
}
