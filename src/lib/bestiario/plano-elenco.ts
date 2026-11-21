/**
 * Quién sale en el plano (`D-91`, tanda 6, segunda vuelta). Pedido del usuario, textual: *"que no estén todos los
 * títeres en cada zona, máximo 2"*.
 *
 * El disco mostraba las 122 figuras, de treinta y pico de unidades cada una: de lejos, manchas. Ahora cada zona
 * muestra **dos**: la bestia que le da nombre o su protagonista, y una segunda que contraste en forma (un bicho
 * al lado de una persona, una cosa al lado de un animal). El galpón del medio y la ruta también son zonas.
 *
 * Nadie queda afuera del bestiario: las 122 siguen en los recintos del recorrido, en los chips y en el índice, que
 * se lee sin JavaScript. Las figuras del plano nunca abrieron ficha (son la imagen; se entra por los carteles).
 *
 * Esto son datos puros: lo leen la página, la imprenta y el test.
 */

/** Las dos de cada zona, en el orden en que se dibujan. */
export const EN_EL_PLANO: Readonly<Record<string, readonly [string, string]>> = {
  'el-galpon': ['patricio-rey', 'la-bestia-pop'],
  'el-arbol': ['el-bicho-del-gran-bonete', 'el-senor-de-los-cielos'],
  cybersiberia: ['el-capitan-buscapina', 'la-divina-tv-fuhrer'],
  'el-templo': ['momo', 'el-morta'],
  'los-astilleros': ['el-pibe-de-los-astilleros', 'la-rana-rubia'],
  'el-bajo': ['el-gordo-pierre', 'la-anguila'],
  'el-infierno': ['luzbelito', 'el-diablo-de-muchos-cuernos'],
  'la-prision': ['barbazul', 'la-fiera-mas-fiera'],
  'los-techos': ['el-negro-atila', 'mi-perro-dinamita'],
  'el-monte': ['el-lobo-suelto', 'el-rey-de-esta-jungla'],
  'la-pastura': ['el-cordero-atado', 'aquella-solitaria-vaca-cubana'],
  'la-mesa': ['el-canibal', 'la-mosca'],
  'la-ruta': ['el-zumba', 'la-mariposa-pontiac'],
};

/** Cuántas figuras muestra una zona, como mucho. */
export const MAXIMO_POR_ZONA = 2;

/** Los ids de todas las que salen en el plano. */
export const LAS_DEL_PLANO: ReadonlySet<string> = new Set(Object.values(EN_EL_PLANO).flat());

/** Cuánto más grande va cada una que cuando eran 122: con menos figuras, cada una se puede leer. */
export const AUMENTO_DEL_PLANO = 1.45;

/**
 * Dónde se para cada una en el disco: `[ángulo desde el norte en el sentido del reloj, distancia al medio]`, como `polar`
 * en `mapa.ts`. No es el `pos` del JSON (ese es el lugar entre las 122, y lo siguen usando los recintos): más grandes,
 * ahí se le encimaban al cartel de su región. Cada porción tiene dos lugares, uno contra el galpón y otro contra la
 * ruta, con el cartel en el medio. Las dos de la ruta quedan donde estaban, sobre el asfalto.
 */
export const LUGAR_EN_EL_PLANO: Readonly<Record<string, readonly [number, number]>> = {
  'patricio-rey': [306, 74],
  'la-bestia-pop': [60, 72],
  'el-senor-de-los-cielos': [0, 200],
  'el-bicho-del-gran-bonete': [4, 372],
  'la-divina-tv-fuhrer': [42, 202],
  'el-capitan-buscapina': [45, 372],
  'el-morta': [85, 202],
  momo: [90, 372],
  'la-rana-rubia': [124, 202],
  'el-pibe-de-los-astilleros': [129, 372],
  'la-anguila': [163, 202],
  'el-gordo-pierre': [168, 372],
  'el-diablo-de-muchos-cuernos': [200, 202],
  luzbelito: [200, 372],
  'la-fiera-mas-fiera': [236, 202],
  barbazul: [241, 372],
  // Los techos y el monte son porciones cortas (de 250 a 425): una más adentro y otra más afuera, a los lados del cartel.
  'mi-perro-dinamita': [286, 298],
  'el-negro-atila': [263, 384],
  // Tercera vuelta: el cartel del monte está en la punta de la derecha (333, 391). El lobo va a la otra punta, y la cruz, adentro.
  'el-rey-de-esta-jungla': [338, 298],
  'el-lobo-suelto': [301, 388],
  // La pastura es un claro redondo adentro del monte, con su cartel en el medio: una arriba y otra abajo.
  'el-cordero-atado': [317, 274],
  'aquella-solitaria-vaca-cubana': [317, 388],
  // La Pontiac estaba en 140, detrás del molinete del portal: pasa al otro lado del cartel de la ruta.
  'la-mariposa-pontiac': [206, 454],
  'el-canibal': [271, 198],
  'la-mosca': [324, 198],
};
