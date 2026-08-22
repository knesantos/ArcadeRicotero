/**
 * Acordes: leerlos, transportarlos y dejarlos caer sobre la letra.
 *
 * **Por qué el sitio transporta y no se limita a mostrar.** El cancionero es para tocar,
 * y "tocar" en una ronda real quiere decir bajarle dos tonos porque el que canta no
 * llega. Un cancionero que obliga a cantar en el tono del disco le está pidiendo al
 * jugador que tenga la voz del Indio para poder entrar, y eso es un molinete cerrado
 * (`D-14`): nada acá se le niega a nadie por no tener con qué entrar.
 *
 * Todo lo de este archivo es funciones puras sobre strings. Corre igual en build y en el
 * navegador, y por eso no toca el sistema de archivos.
 */

/** Las doce notas con nombre de sostenido, que es la escritura por defecto. */
const SOSTENIDOS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
/** Las mismas doce escritas con bemol. Misma tecla, distinto nombre. */
const BEMOLES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

/** Semitonos desde Do para cada nombre de nota que la fuente puede traer. */
const GRADO: Readonly<Record<string, number>> = {
  C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4,
  F: 5, 'E#': 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11,
};

/**
 * Los tonos que se escriben con bemol.
 *
 * No es capricho tipográfico: en Fa mayor la cuarta nota es Si bemol y **nunca** La
 * sostenido, aunque sean la misma tecla. Escribirla mal delata que el transporte lo hizo
 * una máquina sin saber de música, y a quien lee cifras le chirría.
 */
const TONOS_CON_BEMOL = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm']);

/** Un acorde partido en sus tres partes. `Am7/G` → raíz `A`, resto `m7`, bajo `G`. */
export interface Acorde {
  readonly raiz: string;
  readonly resto: string;
  readonly bajo: string | null;
}

const ACORDE = /^([A-G](?:#|b)?)([^/]*)(?:[/]([A-G](?:#|b)?).*)?$/;

/** Parte un acorde. `null` si no lo es — la fuente a veces mete texto en el renglón. */
export function parsear(texto: string): Acorde | null {
  const m = ACORDE.exec(texto.trim());
  if (!m) return null;
  return { raiz: m[1]!, resto: m[2] ?? '', bajo: m[3] ?? null };
}

/** Vuelve a armar el acorde escrito. */
export function escribir(a: Acorde): string {
  return a.raiz + a.resto + (a.bajo ? '/' + a.bajo : '');
}

/** Mueve una nota N semitonos, eligiendo sostenido o bemol según el tono de destino. */
function moverNota(nota: string, semitonos: number, conBemol: boolean): string {
  const g = GRADO[nota];
  if (g === undefined) return nota;
  const tabla = conBemol ? BEMOLES : SOSTENIDOS;
  return tabla[(((g + semitonos) % 12) + 12) % 12]!;
}

/**
 * Transporta un acorde escrito. Si no se lo puede leer, se devuelve tal cual: perder un
 * acorde raro es peor que mostrarlo sin transportar, porque el que toca ve el hueco.
 */
export function transportar(texto: string, semitonos: number, tonoDestino?: string | null): string {
  if (semitonos === 0) return texto;
  const a = parsear(texto);
  if (!a) return texto;
  const conBemol = TONOS_CON_BEMOL.has(tonoDestino ?? '');
  return escribir({
    raiz: moverNota(a.raiz, semitonos, conBemol),
    resto: a.resto,
    bajo: a.bajo ? moverNota(a.bajo, semitonos, conBemol) : null,
  });
}

/** El tono del tema, movido los mismos semitonos. Conserva el sufijo de menor. */
export function transportarTono(tono: string | null, semitonos: number): string | null {
  if (!tono) return null;
  if (semitonos === 0) return tono;
  const menor = tono.endsWith('m');
  const nota = menor ? tono.slice(0, -1) : tono;
  const g = GRADO[nota];
  if (g === undefined) return tono;
  const destinoIdx = (((g + semitonos) % 12) + 12) % 12;
  // Se prueba primero el nombre con bemol: si ese tono es de los que se escriben con
  // bemol, gana; si no, manda el sostenido.
  const conBemol = BEMOLES[destinoIdx]! + (menor ? 'm' : '');
  return TONOS_CON_BEMOL.has(conBemol) ? conBemol : SOSTENIDOS[destinoIdx]! + (menor ? 'm' : '');
}

/** Un acorde y en qué columna de la letra cae. Es la forma en que viaja en `CTR-06`. */
export type Marca = readonly [string, number];

/** Un trozo del renglón de acordes: relleno hasta la columna, y el acorde. */
export interface Casilla {
  readonly hueco: number;
  readonly acorde: string;
}

/**
 * Arma el renglón de acordes que va arriba de un verso.
 *
 * **El problema real, que es de tipografía y no de música.** La fuente alinea los
 * acordes por columna contando caracteres, que funciona porque cifraclub los muestra en
 * monoespaciada. Si dos acordes caen tan juntos que el primero pisaría al segundo, hay
 * que separarlos — pero moverlos rompe la alineación con la sílaba, que es justo lo que
 * el que toca está leyendo. Se elige **conservar el orden y garantizar un espacio**:
 * peor un acorde corrido medio carácter que dos acordes ilegibles encimados.
 */
export function renglonDeAcordes(marcas: readonly Marca[], semitonos = 0, tonoDestino?: string | null): Casilla[] {
  const casillas: Casilla[] = [];
  let cursor = 0;
  for (const [nombre, col] of [...marcas].sort((a, b) => a[1] - b[1])) {
    const acorde = transportar(nombre, semitonos, tonoDestino);
    const hueco = Math.max(col - cursor, cursor === 0 ? 0 : 1);
    casillas.push({ hueco, acorde });
    cursor += hueco + acorde.length;
  }
  return casillas;
}

/** Los acordes distintos de un tema, ya transportados y sin repetir. */
export function acordesDelTema(
  usados: readonly string[],
  semitonos = 0,
  tonoDestino?: string | null,
): readonly string[] {
  const vistos: string[] = [];
  for (const a of usados) {
    const t = transportar(a, semitonos, tonoDestino);
    if (!vistos.includes(t)) vistos.push(t);
  }
  return vistos;
}
