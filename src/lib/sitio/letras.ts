/**
 * Qué título de la Redondopedia se escribe en la letra de la banda (`D-75`).
 *
 * Desde `D-75` el título de cada artículo va en Redonditos de Ricota Fan (`--fuente-luzbelito`),
 * la digitalización fan que `D-67` escaló a la mayúscula del sistema y a la que le derivó las
 * tildes, la Ñ y los signos. Es la letra que más se lee de las tres de disco —desde unos 13 px—
 * y la que aguanta un título de cinco palabras sin cansar.
 *
 * Pero no dibuja todo, y una letra que no tiene la pone el navegador con la de repuesto, a
 * mitad de palabra. Así que el título se escribe en la banda **solo si entra entero**; si no,
 * va todo en la rotulada, como iba antes. Hoy queda afuera uno solo, el de los paréntesis.
 *
 * `fuentes.test.ts` abre el archivo de la fuente y comprueba que lo de acá abajo esté de
 * verdad en su `cmap`: esta lista no se puede adelantar a lo que la letra tiene.
 */

/** Lo que la letra dibuja, en mayúscula, que es como la escribe el CSS. Sin el espacio. */
export const LO_QUE_DIBUJA_LA_BANDA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÁÉÍÓÚÑ¿?¡!.,';

/**
 * Los artículos que no van en esta letra aunque entren.
 *
 * *Luzbelito*: la letra **no es la de su tapa**, la viste porque se le parece
 * (`diseno-marca.md`), y escribir el nombre de ese disco con ella es decir que sí lo es.
 */
const NO_EN_LA_BANDA: ReadonlySet<string> = new Set(['luzbelito']);

/** Si el título de este artículo va en la letra de la banda. */
export function tituloEnLaBanda(slug: string, titulo: string): boolean {
  if (NO_EN_LA_BANDA.has(slug)) return false;
  return [...titulo.toUpperCase().replace(/\s/g, '')].every((c) => LO_QUE_DIBUJA_LA_BANDA.includes(c));
}
