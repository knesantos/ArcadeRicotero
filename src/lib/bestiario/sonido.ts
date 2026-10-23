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
 * Los efectos del camino, en archivo (`/audio/bestiario/fx/`).
 *
 * Pedido del usuario: *"los efectos de sonido van a quedar mejor si buscas una libreria con efectos
 * ya hechos y cargados, que hacerlos vos"*. Cada efecto tiene sus variantes en mp3, una por archivo
 * (`<nombre>-<n>.mp3`, desde el 1), y `entorno.ts` las toca de a una al azar, con un poco más o
 * menos de tono y de fuerza, para que dos pasos seguidos no suenen al mismo paso.
 *
 * **Mientras el archivo no está, suena la síntesis** que ya había (`entorno.ts`). Por eso
 * `variantes` arranca en 0: el camino no pide nada que no existe, y la consola de la gente no se
 * llena de 404. Cuando entran los archivos, se sube el número y nada más; el test mira que cada
 * variante declarada esté en disco.
 */
export interface Efecto {
  /** Cuántos archivos hay; 0, todavía ninguno, y suena la síntesis. */
  variantes: number;
  /** El volumen del archivo, de 0 a 1, antes del general del entorno. */
  vol: number;
  /** Si pasa por la sala de la región (el eco), o va seco. */
  sala: boolean;
  /** Si es una cama: suena en vuelta, sin corte, mientras el camino está prendido. */
  bucle?: boolean;
  /** Cómo se lo nombra en la página de diagnóstico. */
  dice: string;
}

/** Los ocho suelos que se pisan. Cada uno tiene su efecto `pasos-<suelo>`. */
export const SUELOS = ['hojas', 'pasto', 'tablas', 'baldosa', 'chapa', 'nieve', 'agua', 'tierra'] as const;
export type Suelo = (typeof SUELOS)[number];

export const EFECTOS: Readonly<Record<string, Efecto>> = {
  'pasos-hojas': { variantes: 0, vol: 0.5, sala: true, dice: 'los pasos en las hojas' },
  'pasos-pasto': { variantes: 0, vol: 0.45, sala: true, dice: 'los pasos en el pasto' },
  'pasos-tablas': { variantes: 0, vol: 0.5, sala: true, dice: 'los pasos en las tablas' },
  'pasos-baldosa': { variantes: 0, vol: 0.45, sala: true, dice: 'los pasos en la baldosa' },
  'pasos-chapa': { variantes: 0, vol: 0.45, sala: true, dice: 'los pasos en la chapa' },
  'pasos-nieve': { variantes: 0, vol: 0.5, sala: true, dice: 'los pasos en la nieve' },
  'pasos-agua': { variantes: 0, vol: 0.5, sala: true, dice: 'los pasos en el agua' },
  'pasos-tierra': { variantes: 0, vol: 0.45, sala: true, dice: 'los pasos en la tierra' },

  vidrio: { variantes: 0, vol: 0.5, sala: true, dice: 'la botella que se rompe' },
  gota: { variantes: 0, vol: 0.4, sala: true, dice: 'la gota' },
  rama: { variantes: 0, vol: 0.45, sala: true, dice: 'la rama que cruje' },
  cubiertos: { variantes: 0, vol: 0.35, sala: true, dice: 'los cubiertos' },
  campana: { variantes: 0, vol: 0.3, sala: true, dice: 'la campana' },
  metal: { variantes: 0, vol: 0.35, sala: true, dice: 'el metal del astillero' },
  lechuza: { variantes: 0, vol: 0.35, sala: true, dice: 'la lechuza' },
  cencerro: { variantes: 0, vol: 0.4, sala: true, dice: 'el cencerro' },
  mosca: { variantes: 0, vol: 0.3, sala: false, dice: 'la mosca' },
  sirena: { variantes: 0, vol: 0.25, sala: true, dice: 'la sirena de lejos' },
  cadenas: { variantes: 0, vol: 0.4, sala: true, dice: 'las cadenas' },
  bombo: { variantes: 0, vol: 0.4, sala: true, dice: 'el bombo' },
  gente: { variantes: 0, vol: 0.25, sala: true, dice: 'la gente que espera' },
  motor: { variantes: 0, vol: 0.35, sala: false, dice: 'el motor que pasa' },
  bocina: { variantes: 0, vol: 0.3, sala: true, dice: 'la bocina del ferry' },
  estatica: { variantes: 0, vol: 0.25, sala: false, dice: 'la estática de la tele' },
  ola: { variantes: 0, vol: 0.35, sala: false, dice: 'la ola contra los pilotes' },
  brasas: { variantes: 0, vol: 0.35, sala: true, dice: 'las brasas' },

  // Las camas: suenan en vuelta mientras se camina.
  viento: { variantes: 0, vol: 0.4, sala: false, bucle: true, dice: 'el viento' },
  grillos: { variantes: 0, vol: 0.3, sala: false, bucle: true, dice: 'los grillos' },
  'agua-corriendo': { variantes: 0, vol: 0.35, sala: true, bucle: true, dice: 'el agua que corre' },
  rio: { variantes: 0, vol: 0.35, sala: false, bucle: true, dice: 'el río contra los pilotes' },
  fuego: { variantes: 0, vol: 0.35, sala: true, bucle: true, dice: 'el fuego' },
  olla: { variantes: 0, vol: 0.3, sala: true, bucle: true, dice: 'la olla que hierve' },
  'zumbido-electrico': { variantes: 0, vol: 0.2, sala: false, bucle: true, dice: 'el zumbido eléctrico' },
  'tono-de-sala': { variantes: 0, vol: 0.25, sala: false, bucle: true, dice: 'el tono de la sala' },
};

/** Dónde vive cada variante de un efecto. */
export function rutaDeEfecto(nombre: string, n: number): string {
  return `/audio/bestiario/fx/${nombre}-${n}.mp3`;
}

/**
 * La sala de una región: el eco. `entorno.ts` arma la respuesta una sola vez, con ruido que se
 * apaga, y todo lo que tiene `sala` pasa por ahí.
 */
export interface Sala {
  /** Lo que tarda el eco en apagarse, en segundos. */
  largo: number;
  /** Hasta dónde llegan los agudos del eco, en hercios: la piedra es más brillante que la tierra. */
  brillo: number;
  /** Cuánto eco, de 0 a 1. El monte casi nada; la prisión, mucho. */
  mezcla: number;
}

/**
 * Los ruidos de un camino (`D-76`). Son números, como `rig.ts`: cuánto viento, cuántos grillos,
 * qué cruje bajo los pies, qué sala, qué cama de fondo, cada cuánto pasa algo y qué suena al
 * tocar a quién. Los nombres son los de `EFECTOS`.
 */
export interface Receta {
  /** Lo que suena bajo los pies. */
  suelo: Suelo;
  /** Cada cuánto se da un paso, en unidades de escena (`ALTO` = 640). */
  zancada: number;
  /** El volumen del viento; 0, sin viento. */
  viento: number;
  /** El volumen de los grillos; 0, sin grillos. */
  grillos: number;
  /** El eco de la región. Sin sala, todo seco. */
  sala?: Sala;
  /** Lo que suena de fondo sin parar, con su volumen (de 0 a 1, antes del general). */
  cama?: Readonly<Record<string, number>>;
  /** Lo que pasa cada tanto, con su espera mínima y máxima en segundos. */
  cadaTanto?: Readonly<Record<string, readonly [number, number]>>;
  /** El sonido que hace un bicho al tocarlo. */
  alTocar?: Readonly<Record<string, string>>;
}

export const RECETAS: Readonly<Record<string, Receta>> = {
  // El monte: hojas secas, viento entre los árboles, una lechuza que no se deja ver.
  'el-monte': {
    suelo: 'hojas',
    zancada: 85,
    viento: 0.05,
    grillos: 0.012,
    sala: { largo: 0.6, brillo: 3000, mezcla: 0.06 },
    cadaTanto: { lechuza: [22, 40], rama: [16, 34] },
  },
  // La pastura: pasto, menos viento, más grillos, y el cencerro de la vaca cubana.
  'la-pastura': {
    suelo: 'pasto',
    zancada: 85,
    viento: 0.03,
    grillos: 0.02,
    sala: { largo: 0.5, brillo: 3500, mezcla: 0.05 },
    cadaTanto: { cencerro: [14, 30] },
    alTocar: { 'aquella-solitaria-vaca-cubana': 'cencerro' },
  },
  // Desde `D-77` se caminan las trece, y cada una suena a lo suyo.
  // La mesa: baldosa de cocina, la olla en el fuego, los cubiertos y las moscas sobre la sopa.
  'la-mesa': {
    suelo: 'baldosa',
    zancada: 80,
    viento: 0,
    grillos: 0,
    sala: { largo: 0.8, brillo: 5000, mezcla: 0.15 },
    cama: { olla: 0.5 },
    cadaTanto: { mosca: [8, 18], cubiertos: [10, 22] },
    alTocar: {
      'la-mosca': 'mosca',
      'el-moscon-zumbon': 'mosca',
      'el-moscardon-imaginario': 'mosca',
      'el-canibal': 'cubiertos',
      'el-verdugo-que-cena': 'cubiertos',
      pituca: 'cubiertos',
    },
  },
  // Los techos: la chapa bajo los pies, el viento de arriba, la canaleta que gotea y la sirena.
  'los-techos': {
    suelo: 'chapa',
    zancada: 90,
    viento: 0.06,
    grillos: 0.008,
    sala: { largo: 1.2, brillo: 4000, mezcla: 0.12 },
    cadaTanto: { sirena: [26, 48], gota: [3, 8] },
  },
  // La prisión: el pasillo de baldosa, el tono de la sala, una gotera y las llaves de Barbazul.
  'la-prision': {
    suelo: 'baldosa',
    zancada: 80,
    viento: 0.02,
    grillos: 0,
    sala: { largo: 3.2, brillo: 3500, mezcla: 0.35 },
    cama: { 'tono-de-sala': 0.6 },
    cadaTanto: { cadenas: [12, 26], gota: [5, 12] },
    alTocar: { barbazul: 'cadenas', 'la-fiera-mas-fiera': 'cadenas' },
  },
  // El infierno: tierra seca, el fuego que no para, las brasas y una campanada de vez en cuando.
  'el-infierno': {
    suelo: 'tierra',
    zancada: 85,
    viento: 0.04,
    grillos: 0,
    sala: { largo: 2, brillo: 2200, mezcla: 0.25 },
    cama: { fuego: 0.7 },
    cadaTanto: { brasas: [2, 6], campana: [30, 60] },
    alTocar: { mandinga: 'campana' },
  },
  // El bajo inundado: se camina en el agua que corre, entra la gotera y algo de vidrio se rompe.
  'el-bajo': {
    suelo: 'agua',
    zancada: 95,
    viento: 0,
    grillos: 0,
    sala: { largo: 1.6, brillo: 3000, mezcla: 0.25 },
    cama: { 'agua-corriendo': 0.6 },
    cadaTanto: { gota: [1.5, 4], vidrio: [28, 55] },
    alTocar: { 'el-gordo-pierre': 'vidrio', 'el-amorcito-que-mordio-el-vidrio': 'vidrio', 'la-anguila': 'gota' },
  },
  // Los astilleros: los tablones del muelle, el río contra los pilotes, el metal y el ferry.
  'los-astilleros': {
    suelo: 'tablas',
    zancada: 85,
    viento: 0.05,
    grillos: 0,
    sala: { largo: 1.4, brillo: 3500, mezcla: 0.15 },
    cama: { rio: 0.6 },
    cadaTanto: { ola: [4, 9], bocina: [30, 55], metal: [12, 28] },
    alTocar: { 'el-pibe-de-los-astilleros': 'metal', 'la-del-lanchon': 'bocina' },
  },
  // El templo: el piso del salón, mucho eco, y de lejos el bombo de la murga.
  'el-templo': {
    suelo: 'baldosa',
    zancada: 80,
    viento: 0,
    grillos: 0.006,
    sala: { largo: 3.5, brillo: 4500, mezcla: 0.38 },
    cadaTanto: { bombo: [6, 14] },
    alTocar: { 'la-murga-de-los-renegados': 'bombo' },
  },
  // Cybersiberia: nieve, viento de estepa, el zumbido de los cables y la tele que se va de canal.
  cybersiberia: {
    suelo: 'nieve',
    zancada: 80,
    viento: 0.08,
    grillos: 0,
    sala: { largo: 1, brillo: 6000, mezcla: 0.1 },
    cama: { 'zumbido-electrico': 0.5 },
    cadaTanto: { estatica: [10, 22] },
    alTocar: { 'la-divina-tv-fuhrer': 'estatica', 'los-buitres-de-la-tele': 'estatica', drogocop: 'sirena' },
  },
  // El árbol: la llanura de tierra, grillos, las ramas que crujen y la lechuza de la copa.
  'el-arbol': {
    suelo: 'tierra',
    zancada: 85,
    viento: 0.05,
    grillos: 0.015,
    sala: { largo: 0.7, brillo: 3000, mezcla: 0.07 },
    cadaTanto: { lechuza: [18, 34], rama: [14, 30] },
    alTocar: { 'la-lechuza-que-circula': 'lechuza', 'el-monito-que-trepa': 'rama', 'el-que-duerme-colgado': 'rama' },
  },
  // El galpón: el tablado, un eco de lugar grande, y la gente que murmura esperando que arranque.
  'el-galpon': {
    suelo: 'tablas',
    zancada: 80,
    viento: 0,
    grillos: 0,
    sala: { largo: 2.6, brillo: 4000, mezcla: 0.3 },
    cadaTanto: { gente: [9, 18] },
  },
  // La ruta: la banquina de tierra, los grillos del campo y los fierros que pasan.
  'la-ruta': {
    suelo: 'tierra',
    zancada: 90,
    viento: 0.06,
    grillos: 0.014,
    sala: { largo: 0.5, brillo: 3000, mezcla: 0.05 },
    cadaTanto: { motor: [9, 20] },
    alTocar: {
      'el-zumba': 'motor',
      'el-heroe-del-whisky': 'motor',
      'la-mariposa-pontiac': 'motor',
      'el-toxi-taxi': 'motor',
      'el-taxi-paranormal': 'motor',
    },
  },
};

/**
 * Los efectos que `entorno.ts` sabe sintetizar, el respaldo de cuando el archivo no está. El test
 * mira que cada efecto del manifiesto tenga el suyo: sin respaldo, un archivo que no carga es un
 * silencio que nadie pidió.
 */
export const SINTETIZADOS = [
  ...SUELOS.map((s) => `pasos-${s}` as const),
  'vidrio', 'gota', 'rama', 'cubiertos', 'olla', 'campana', 'metal', 'lechuza', 'cencerro', 'mosca', 'sirena',
  'cadenas', 'bombo', 'gente', 'motor', 'bocina', 'estatica', 'ola', 'brasas',
  'viento', 'grillos', 'agua-corriendo', 'rio', 'fuego', 'zumbido-electrico', 'tono-de-sala',
] as const;

/** Todo lo que una receta pide, para cargar solo eso al prender. */
export function efectosDe(r: Receta): string[] {
  const pedidos = new Set<string>([`pasos-${r.suelo}`]);
  if (r.viento > 0) pedidos.add('viento');
  if (r.grillos > 0) pedidos.add('grillos');
  for (const n of Object.keys(r.cama ?? {})) pedidos.add(n);
  for (const n of Object.keys(r.cadaTanto ?? {})) pedidos.add(n);
  for (const n of Object.values(r.alTocar ?? {})) pedidos.add(n);
  return [...pedidos];
}
