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
  /** Lo que suena bajo los pies. */
  suelo: 'hojas' | 'pasto' | 'tablas' | 'baldosa' | 'chapa' | 'nieve' | 'agua' | 'tierra';
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
  // Desde `D-77` se caminan las trece, y cada una suena a lo suyo.
  // La mesa: baldosa, y las moscas que dan vueltas sobre la sopa.
  'la-mesa': {
    suelo: 'baldosa',
    zancada: 80,
    viento: 0,
    grillos: 0,
    cadaTanto: { zumbido: [8, 18] },
    alTocar: { 'la-mosca': 'zumbido', 'el-moscon-zumbon': 'zumbido', 'el-moscardon-imaginario': 'zumbido' },
  },
  // Los techos: la chapa bajo los pies, el viento de arriba y, cada tanto, la sirena de la cana.
  'los-techos': { suelo: 'chapa', zancada: 90, viento: 0.06, grillos: 0.008, cadaTanto: { sirena: [26, 48] } },
  // La prisión: el pasillo de baldosa, una gotera, y el manojo de llaves de Barbazul.
  'la-prision': {
    suelo: 'baldosa',
    zancada: 80,
    viento: 0.02,
    grillos: 0,
    cadaTanto: { cadena: [12, 26], gota: [5, 12] },
    alTocar: { barbazul: 'cadena', 'la-fiera-mas-fiera': 'cadena' },
  },
  // El infierno: tierra seca, y las brasas que chisporrotean.
  'el-infierno': { suelo: 'tierra', zancada: 85, viento: 0.04, grillos: 0, cadaTanto: { brasas: [2, 6] } },
  // El bajo inundado: se camina en el agua, y por el vidrio roto entra la gotera.
  'el-bajo': { suelo: 'agua', zancada: 95, viento: 0, grillos: 0, cadaTanto: { gota: [1.5, 4] } },
  // Los astilleros: los tablones del muelle, el agua contra los pilotes y el ferry que sale.
  'los-astilleros': { suelo: 'tablas', zancada: 85, viento: 0.05, grillos: 0, cadaTanto: { ola: [4, 9], bocina: [30, 55] } },
  // El templo: el piso del salón, y de lejos el bombo de la murga.
  'el-templo': {
    suelo: 'baldosa',
    zancada: 80,
    viento: 0,
    grillos: 0.006,
    cadaTanto: { bombo: [6, 14] },
    alTocar: { 'la-murga-de-los-renegados': 'bombo' },
  },
  // Cybersiberia: nieve, viento de estepa y la tele que se va de canal.
  cybersiberia: {
    suelo: 'nieve',
    zancada: 80,
    viento: 0.08,
    grillos: 0,
    cadaTanto: { interferencia: [10, 22] },
    alTocar: { 'la-divina-tv-fuhrer': 'interferencia' },
  },
  // El árbol: la llanura de tierra, grillos, y la lechuza que circula por la copa.
  'el-arbol': {
    suelo: 'tierra',
    zancada: 85,
    viento: 0.05,
    grillos: 0.015,
    cadaTanto: { lechuza: [18, 34] },
    alTocar: { 'la-lechuza-que-circula': 'lechuza' },
  },
  // El galpón: el tablado, y la gente que murmura esperando que arranque.
  'el-galpon': { suelo: 'tablas', zancada: 80, viento: 0, grillos: 0, cadaTanto: { gente: [9, 18] } },
  // La ruta: la banquina de tierra, los grillos del campo y los fierros que pasan.
  'la-ruta': {
    suelo: 'tierra',
    zancada: 90,
    viento: 0.06,
    grillos: 0.014,
    cadaTanto: { motor: [9, 20] },
    alTocar: { 'el-zumba': 'motor', 'el-heroe-del-whisky': 'motor', 'la-mariposa-pontiac': 'motor', 'el-toxi-taxi': 'motor' },
  },
};

/** Los sonidos que `entorno.ts` sabe hacer. El test mira que las recetas no pidan otros. */
export const SINTETIZADOS = [
  'lechuza', 'cencerro', 'grillo', 'zumbido', 'sirena', 'cadena', 'gota', 'brasas', 'ola', 'bocina', 'bombo', 'interferencia', 'gente', 'motor',
] as const;
