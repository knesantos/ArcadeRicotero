/**
 * Lo publicado contra su fuente (`T-300`, ciclo 16; `CTR-15.7`, `CTR-15.8`).
 *
 * La imprenta escribe `public/sprites/<atlas>.v<N>.png` y `.json` desde `src/arte/pixel/<atlas>.txt`,
 * y a partir de ahí son dos cosas separadas en el repo: se puede tocar el `.txt` y olvidarse de
 * reimprimir, o tocar el PNG a mano, y el auditor de paleta no se entera —mira que las tintas sean
 * de la hoja, no que el dibujo sea el que dice la fuente—. Esto compara las dos: el JSON publicado
 * tiene que ser `jsonDelAtlas()` del dibujo, y cada píxel del PNG, el que pone `componerAtlas()`.
 *
 * No lee archivos ni decodifica PNG: recibe lo ya leído, para que el test elija cómo (sharp) y
 * esto se pueda probar con datos armados a mano.
 */
import { componerAtlas, contar, jsonDelAtlas, type Dibujo } from './fuente.ts';

/** Cuántas diferencias de píxel se nombran una por una antes de resumir. */
const PIXELES_NOMBRADOS = 5;

export interface Publicado {
  /** El JSON publicado, ya parseado. */
  json: unknown;
  /** El PNG publicado, decodificado a RGBA de 8 bits. */
  ancho: number;
  alto: number;
  rgba: Uint8Array;
}

/** La ruta sin extensión donde la imprenta publica un dibujo (`CTR-15.8`: siempre con versión). */
export function rutaPublicada(d: Pick<Dibujo, 'atlas' | 'version'>, carpeta = 'public/sprites'): string {
  return `${carpeta}/${d.atlas}.v${d.version}`;
}

/**
 * Todo lo que separa lo publicado de lo que imprimiría el dibujo hoy. Vacío: están en regla.
 * Un píxel transparente es transparente en los dos, sin mirar su color (el PNG puede guardar
 * cualquier RGB debajo de un alfa 0).
 */
export function diferenciasConLoPublicado(d: Dibujo, tintas: ReadonlyMap<string, string>, p: Publicado): string[] {
  const base = rutaPublicada(d);
  const problemas: string[] = [];
  const esperado = jsonDelAtlas(d);
  if (JSON.stringify(ordenar(p.json)) !== JSON.stringify(ordenar(esperado))) {
    problemas.push(`${base}.json no es el que imprime ${d.archivo}: reimprimí (o subí la versión si cambió la estructura, CTR-15.8)`);
  }
  const atlas = componerAtlas(d, tintas);
  if (p.ancho !== atlas.ancho || p.alto !== atlas.alto) {
    problemas.push(`${base}.png mide ${p.ancho} × ${p.alto} y ${d.archivo} imprime ${atlas.ancho} × ${atlas.alto}`);
    return problemas;
  }
  const distintos: string[] = [];
  let cuantos = 0;
  for (let i = 0; i < atlas.ancho * atlas.alto; i++) {
    const k = i * 4;
    const aE = atlas.rgba[k + 3]!;
    const aP = p.rgba[k + 3]!;
    const igual =
      aE === aP && (aE === 0 || (atlas.rgba[k] === p.rgba[k] && atlas.rgba[k + 1] === p.rgba[k + 1] && atlas.rgba[k + 2] === p.rgba[k + 2]));
    if (igual) continue;
    cuantos++;
    if (distintos.length < PIXELES_NOMBRADOS) distintos.push(`(${i % atlas.ancho}, ${Math.floor(i / atlas.ancho)})`);
  }
  if (cuantos > 0) {
    const resto = cuantos > distintos.length ? ` y ${cuantos - distintos.length} más` : '';
    problemas.push(`${base}.png no es el que imprime ${d.archivo}: ${contar(cuantos, 'píxel distinto', 'píxeles distintos')}, en ${distintos.join(', ')}${resto}`);
  }
  return problemas;
}

/** El mismo objeto con las claves en orden, para comparar sin que importe cómo se escribió. */
function ordenar(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(ordenar);
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, x]) => [k, ordenar(x)]),
    );
  }
  return v;
}
