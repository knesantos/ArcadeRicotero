/**
 * Los 105 temas de Patricio Rey, leídos de la ficha `RES-20`.
 *
 * **Por qué se parsea la ficha en vez de copiar la lista.** `D-13` puso una condición
 * dura para usar fuentes de fans: todo tema que entre a un juego tiene que estar entre los
 * 105 de `RES-20`, porque el error demostrado de esas fuentes es mezclar material del
 * Indio solista y de Skay con el de la banda (`RES-23`: 149 entradas contra 105 reales).
 * Si la lista viviera copiada en un JSON, tendríamos dos verdades que se pueden
 * desincronizar, y la que manda es la ficha. Acá hay una sola.
 *
 * Corre en build y en los tests, nunca en el navegador.
 */

import { readFileSync } from 'node:fs';

/**
 * Los dos normalizadores viven en `src/lib/texto.ts` y no acá.
 *
 * Son funciones puras que **también las necesita el navegador** (el buscador de
 * `US-02` tiene que perdonar 'jijiji' por 'Ji ji ji'), y este archivo importa
 * `node:fs` en la primera línea: entero no entra a un bundle de cliente. Se
 * re-exportan para que nada de lo que ya los importaba de acá tenga que cambiar.
 */
import { normalizar, normalizarDuro, slugDeTitulo } from '../texto.ts';
export { normalizar, normalizarDuro, slugDeTitulo };

const FICHA = 'Docs/INVESTIGACION/INV-20-fuentes-primarias.md';

/** Los diez discos, con el slug que usan el schema y la Redondopedia. */
export const DISCOS = [
  'gulp',
  'oktubre',
  'un-baion-para-el-ojo-idiota',
  'bang-bang-estas-liquidado',
  'la-mosca-y-la-sopa',
  'lobo-suelto',
  'cordero-atado',
  'luzbelito',
  'ultimo-bondi-a-finisterre',
  'momo-sampler',
] as const;

export type Disco = (typeof DISCOS)[number];

export interface TemaDelDisco {
  readonly disco: Disco;
  readonly pista: number;
  readonly titulo: string;
}

/** El encabezado de cada tracklist en la ficha, en el orden de `DISCOS`. */
const ENCABEZADOS: ReadonlyArray<readonly [Disco, RegExp]> = [
  ['gulp', /^### Gulp!/],
  ['oktubre', /^### Oktubre/],
  ['un-baion-para-el-ojo-idiota', /^### Un baión para el ojo idiota/],
  ['bang-bang-estas-liquidado', /^### ¡Bang! ¡Bang!/],
  ['la-mosca-y-la-sopa', /^### La mosca y la sopa/],
  ['lobo-suelto', /^### Lobo suelto, cordero atado, vol\. 1/],
  ['cordero-atado', /^### Lobo suelto, cordero atado, vol\. 2/],
  ['luzbelito', /^### Luzbelito/],
  ['ultimo-bondi-a-finisterre', /^### Último bondi a Finisterre/],
  ['momo-sampler', /^### Momo Sampler/],
];

/**
 * Saca de un título todo lo que la ficha le pega al lado y no es parte del nombre.
 *
 * **Por qué es más que sacar negritas.** La versión anterior solo cortaba una duración
 * pegada al final, y eso alcanzaba mientras la ficha fuera una lista pelada. No lo es:
 * `RES-20` intercala notas de prosa (`> ⚠ Del vol. 2 no conseguí duraciones…`) y créditos
 * en cursiva (`*— Solari / Beilinson / Bucciarelli*`) **dentro del bloque del tracklist**,
 * y como el bloque se une en un solo texto para poder leer títulos cortados en dos
 * renglones, esa prosa quedaba pegada al título del último tema de la lista.
 *
 * El daño era silencioso y real: 6 de los 105 títulos salían contaminados —
 * *Etiqueta negra*, *Juguetes perdidos*, *Queso ruso*, *Ella debe estar tan linda*,
 * *Mi perro dinamita* y *Pianito - Jam* —, así que el cruce de `D-13` los rechazaba por
 * no coincidir con nada. Un tema legítimo tratado como material contaminado es
 * exactamente el falso positivo que `D-13` no quiere.
 *
 * Se corta en el primer marcador de "acá el título ya terminó", en este orden:
 * duración `(4:02)`, crédito en cursiva `*—`, nota de bloque `>`.
 */
function limpiar(bruto: string): string {
  let t = bruto.replace(/\*\*/g, '');
  t = t.split(/\s*\([0-9]+:[0-9]{2}\)/)[0]!;
  t = t.split(/\s*\*[—-]/)[0]!;
  t = t.split(/\s*>/)[0]!;
  // Acotaciones que la ficha pone al lado del título y tampoco son el nombre.
  t = t.replace(/\s*\*\(instrumental\)\*/i, '').replace(/\s*\(track oculto\)/i, '');
  return t.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Lee los tracklists de `RES-20`.
 *
 * Falla ruidoso si la ficha cambia de forma: es preferible un test roto a un cruce que
 * silenciosamente deja de cruzar contra nada.
 */
export function leerTemas(ruta: string = FICHA): readonly TemaDelDisco[] {
  const lineas = readFileSync(ruta, 'utf-8').replace(/\r\n/g, '\n').split('\n');
  const temas: TemaDelDisco[] = [];

  for (const [disco, encabezado] of ENCABEZADOS) {
    const i = lineas.findIndex((l) => encabezado.test(l));
    if (i < 0) throw new Error(`no encontré el tracklist de ${disco} en ${ruta}`);

    // El bloque va desde el encabezado hasta el próximo, unido en un solo texto: la
    // ficha corta los renglones a mitad de título.
    let j = i + 1;
    while (j < lineas.length && !/^#{2,4} /.test(lineas[j]!)) j++;
    const bloque = lineas.slice(i + 1, j).join(' ');

    // Cada tema arranca con "N." y termina donde arranca el siguiente.
    const marcas = [...bloque.matchAll(/(?:^|[·|\s])(\d{1,2})\.\s/g)];
    for (let k = 0; k < marcas.length; k++) {
      const desde = marcas[k]!.index! + marcas[k]![0]!.length;
      const hasta = k + 1 < marcas.length ? marcas[k + 1]!.index! : bloque.length;
      const titulo = limpiar(bloque.slice(desde, hasta).replace(/·\s*$/, ''));
      if (titulo) temas.push({ disco, pista: Number(marcas[k]![1]), titulo });
    }
  }

  return temas;
}


/** El conjunto de títulos normalizados, para el cruce de `D-13`. */
export function indiceDeTemas(temas: readonly TemaDelDisco[] = leerTemas()): ReadonlySet<string> {
  return new Set(temas.map((t) => normalizar(t.titulo)));
}


/**
 * Los títulos que ni la normalización dura reconcilia, resueltos a mano.
 *
 * **Cada fila es un juicio, no una corrección de tipeo**, y por eso viven acá y no
 * escondidas adentro del ingestor: decir que *Capitán Buscapina* es el mismo tema que
 * *Las increíbles andanzas del Capitán Buscapina en Cybersiberia* es una afirmación
 * sobre la obra, y alguien tiene que poder discutirla leyendo una lista.
 *
 * Clave: el título tal como viene de la fuente. Valor: el título tal como lo escribe
 * `RES-20`, que es el que manda.
 */
export const ALIAS: Readonly<Record<string, string>> = {
  // Errata de la fuente: "peligrosos" por "peligros".
  'Unos Pocos Peligrosos Sensatos': 'Unos pocos peligros sensatos',
  // La fuente titula solo la primera mitad del nombre compuesto.
  Pianito: 'Pianito - Jam',
  'Mariposa Pontiac': 'Mariposa Pontiac - Rock del país',
  'Capitán Buscapina': 'Las increíbles andanzas del Capitán Buscapina en Cybersiberia',
  // Singular/plural y artículo: mismo tema, distinto capricho de quien cargó la ficha.
  'Canción para naufragio': 'Canción para naufragios',
  'Solitaria Vaca Cubana': 'Aquella solitaria vaca cubana',
  'El templo de momo': 'Templo de Momo',
  // La fuente arrastra el subtítulo entre paréntesis; el tracklist no lo lleva.
  '¡Es Hora de Levantarse, Querido! (¿Dormiste Bien?)': '¡Es hora de levantarse querido!',
  // Errata de la fuente: una sola "p" y guiones de más.
  'Shoping - Disco - Zen': 'Shopping Disco-Zen',
  // lacuerda.net parte el nombre en dos y abrevia: "Barba Azul vs." por "Barbazul versus".
  // Ninguna normalización lo salva —no comparten ni la palabra— así que va explícito.
  'Barba Azul vs. el amor letal': 'Barbazul versus el amor letal',
};

/** Índice por forma dura, para resolver un título de fuente contra los 105. */
export function indiceDuro(
  temas: readonly TemaDelDisco[] = leerTemas(),
): ReadonlyMap<string, TemaDelDisco> {
  return new Map(temas.map((t) => [normalizarDuro(t.titulo), t]));
}

/**
 * Resuelve un título de la fuente contra los 105 de `RES-20`. `null` si no es de ellos.
 *
 * Es la puerta de `D-13` hecha función: **lo que no resuelve acá no entra al sitio.**
 * El orden importa — primero el alias explícito, porque una fila escrita a mano gana
 * siempre contra una coincidencia automática.
 */
export function resolverTema(
  titulo: string,
  indice: ReadonlyMap<string, TemaDelDisco> = indiceDuro(),
): TemaDelDisco | null {
  const alias = ALIAS[titulo.trim()];
  if (alias) return indice.get(normalizarDuro(alias)) ?? null;
  return indice.get(normalizarDuro(titulo)) ?? null;
}
