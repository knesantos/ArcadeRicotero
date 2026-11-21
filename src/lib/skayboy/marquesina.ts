/**
 * La marquesina del mueble (ronda de pulida de los juegos, 2026-11-18): **el título del fichín,
 * dibujado en pixel**, en el frente del mueble y arriba del tubo.
 *
 * Es pixel como código, igual que los atlas (`D-44`): cada letra es una grilla de texto de siete
 * renglones, y de acá salen los cuadraditos que la página imprime en un SVG, en el build. No hay
 * fuente que bajar ni texto que el navegador pueda suavizar. Las tintas las pone la hoja, de las
 * `--px-*` de la hoja 14.
 *
 * **No reemplaza al título**: el `<h1>` sigue en la página, con las letras del sitio, para el
 * lector de pantalla y para donde la marquesina no entra. Esto es solo para el ojo.
 *
 * El abecedario tiene **solo las letras que el título pide**. Una letra que falte no se
 * inventa en silencio: `problemasDeLaMarquesina()` la nombra, y la página no se construye.
 */

/** El alto de toda letra, en píxeles. */
export const ALTO_DE_LETRA = 7;
/** El aire entre dos letras, y el de un espacio entre palabras. */
export const AIRE_ENTRE_LETRAS = 1;
export const ANCHO_DEL_ESPACIO = 3;

/** Cada letra, renglón por renglón: `#` es tinta, `.` es aire. */
export const LETRAS: Readonly<Record<string, readonly string[]>> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
};

/** Un pixel de la marquesina: dónde va y de qué palabra es (las palabras se prenden de a una). */
export interface PixelDeMarquesina {
  readonly x: number;
  readonly y: number;
  readonly palabra: number;
}

export interface Marquesina {
  readonly ancho: number;
  readonly alto: number;
  readonly palabras: number;
  readonly pixeles: readonly PixelDeMarquesina[];
}

/** Las letras del texto que el abecedario no tiene, o las grillas mal medidas. Vacío es sano. */
export function problemasDeLaMarquesina(texto: string): string[] {
  const problemas: string[] = [];
  for (const [letra, filas] of Object.entries(LETRAS)) {
    if (filas.length !== ALTO_DE_LETRA) problemas.push(`la ${letra} tiene ${filas.length} renglones, y son ${ALTO_DE_LETRA}`);
    if (new Set(filas.map((f) => f.length)).size !== 1) problemas.push(`la ${letra} tiene renglones de distinto ancho`);
    if (filas.some((f) => /[^#.]/.test(f))) problemas.push(`la ${letra} tiene un caracter que no es # ni .`);
  }
  for (const letra of new Set(texto.toUpperCase().replace(/\s+/g, ''))) {
    if (LETRAS[letra] === undefined) problemas.push(`la marquesina no tiene la letra «${letra}»: se dibuja en LETRAS, no se saltea`);
  }
  return problemas;
}

/**
 * El texto, en píxeles: mayúsculas, una palabra detrás de la otra en un solo renglón. Una letra
 * que el abecedario no tiene no se dibuja (y `problemasDeLaMarquesina()` ya la nombró).
 */
export function marquesinaDe(texto: string): Marquesina {
  const pixeles: PixelDeMarquesina[] = [];
  let x = 0;
  const palabras = texto.toUpperCase().trim().split(/\s+/);
  palabras.forEach((palabra, i) => {
    if (i > 0) x += ANCHO_DEL_ESPACIO;
    for (const letra of palabra) {
      const filas = LETRAS[letra];
      if (filas === undefined) continue;
      filas.forEach((fila, y) => {
        for (let dx = 0; dx < fila.length; dx++) if (fila[dx] === '#') pixeles.push({ x: x + dx, y, palabra: i });
      });
      x += (filas[0]?.length ?? 0) + AIRE_ENTRE_LETRAS;
    }
  });
  return { ancho: Math.max(0, x - AIRE_ENTRE_LETRAS), alto: ALTO_DE_LETRA, palabras: palabras.length, pixeles };
}
