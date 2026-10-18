/**
 * Lo que suena de lejos en cada camino del bestiario (`D-76`).
 *
 * Pedido del usuario: *"que se escuchen recortes como lejos del álbum donde está inspirado o
 * que más personajes tenga ese entorno"*. Mientras se camina, suenan recortes de un disco como
 * si vinieran de un recital del otro lado del monte: apagados, bajos, uno detrás del otro.
 *
 * ## Qué disco
 *
 * 1. **El de la región**, el que viste su paleta (`disco` en `bestiario.json`, `D-19`), si tiene
 *    por lo menos `MINIMO` recortes. El monte suena a *Lobo suelto* porque está pintado con él.
 * 2. Si no le alcanza (la pastura viste *Cordero atado*, que todavía no tiene recortes), **el
 *    disco con más bichos del camino**: el de los temas de donde salen los que andan por ahí.
 *    Empate, el que tiene más recortes; después, el más viejo.
 *
 * Esto son datos y nada más: no importa ningún JSON, se los pasa la página (y el test).
 */

/** Con menos recortes que esto, un disco se repite enseguida y deja de sonar a recital. */
export const MINIMO = 3;

export interface TemaConDisco {
  slug: string;
  disco: string;
  anio: number;
}

export interface Fondo {
  /** El disco que suena. */
  disco: string;
  /** Sus temas con recorte, en el orden del cancionero. */
  temas: readonly string[];
}

/**
 * El disco que suena de lejos en un camino.
 *
 * `discoDeLaRegion`: el de `bestiario.json`. `temasDeLosBichos`: el tema de cada bicho del
 * camino (los de la región y los de visita), repetido si dos bichos salen del mismo.
 * `conAudio`: los temas que tienen recorte. Devuelve `null` si ningún disco llega al mínimo:
 * entonces el camino no ofrece sonido, en vez de prometer algo que se corta a los diez segundos.
 */
export function fondoDe(
  discoDeLaRegion: string,
  temasDeLosBichos: readonly string[],
  cancionero: readonly TemaConDisco[],
  conAudio: ReadonlySet<string>,
): Fondo | null {
  const temasDe = (disco: string): string[] =>
    cancionero.filter((t) => t.disco === disco && conAudio.has(t.slug)).map((t) => t.slug);

  const propio = temasDe(discoDeLaRegion);
  if (propio.length >= MINIMO) return { disco: discoDeLaRegion, temas: propio };

  const discoDe = new Map(cancionero.map((t) => [t.slug, t.disco]));
  const anioDe = new Map<string, number>();
  for (const t of cancionero) anioDe.set(t.disco, Math.min(anioDe.get(t.disco) ?? Infinity, t.anio));
  const bichos = new Map<string, number>();
  for (const slug of temasDeLosBichos) {
    const disco = discoDe.get(slug);
    if (disco) bichos.set(disco, (bichos.get(disco) ?? 0) + 1);
  }

  const candidatos = [...bichos.keys()]
    .map((disco) => ({ disco, bichos: bichos.get(disco)!, temas: temasDe(disco) }))
    .filter((c) => c.temas.length >= MINIMO)
    .sort((a, b) => b.bichos - a.bichos || b.temas.length - a.temas.length || anioDe.get(a.disco)! - anioDe.get(b.disco)!);

  const elegido = candidatos[0];
  return elegido ? { disco: elegido.disco, temas: elegido.temas } : null;
}

/**
 * Los ruidos de un camino (`D-76`), los que se sintetizan (`scripts/bestiario/entorno.ts`).
 * Son números, como `rig.ts`: cuánto viento, cuántos grillos, qué cruje bajo los pies, cada
 * cuánto pasa algo y qué suena al tocar a quién.
 */
export interface Receta {
  /** Lo que cruje bajo los pies. */
  suelo: 'hojas' | 'pasto';
  /** Cada cuánto se da un paso, en unidades de escena (`ALTO` = 640). */
  zancada: number;
  /** El volumen del viento; 0, sin viento. */
  viento: number;
  /** El volumen de cada grillo; 0, sin grillos. */
  grillos: number;
  /** Lo que pasa cada tanto, con su espera mínima y máxima en segundos. */
  cadaTanto?: Readonly<Record<string, readonly [number, number]>>;
  /** El sonido que hace un bicho al tocarlo, si la síntesis lo hace bien. */
  alTocar?: Readonly<Record<string, string>>;
}

export const RECETAS: Readonly<Record<string, Receta>> = {
  // El monte: hojas secas, viento entre los árboles, una lechuza que no se deja ver.
  'el-monte': {
    suelo: 'hojas',
    zancada: 85,
    viento: 0.05,
    grillos: 0.012,
    cadaTanto: { lechuza: [22, 40] },
  },
  // La pastura: pasto, menos viento, más grillos, y el cencerro de la vaca cubana.
  'la-pastura': {
    suelo: 'pasto',
    zancada: 85,
    viento: 0.03,
    grillos: 0.02,
    cadaTanto: { cencerro: [14, 30] },
    alTocar: { 'aquella-solitaria-vaca-cubana': 'cencerro' },
  },
};

/** Los sonidos que `entorno.ts` sabe hacer. El test mira que las recetas no pidan otros. */
export const SINTETIZADOS = ['lechuza', 'cencerro', 'grillo'] as const;
