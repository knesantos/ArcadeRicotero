/**
 * La curaduría de distractores de "Completá la letra" (`T-532`): qué dice el archivo
 * `src/data/letra-distractores.json`, y la vara con la que se mide.
 *
 * ## Por qué hay un archivo aparte
 *
 * `letra.json` lo escribe entero `scripts/generar-letra.mjs` en cada corrida. Un distractor
 * arreglado a mano adentro de `letra.json` dura hasta la próxima corrida. Entonces la
 * decisión de una persona vive acá al lado —igual que la elección del verso vive en
 * `letra-confirmaciones.json`— y el generador la **aplica**: no la pisa nunca.
 *
 * Y con una regla más, que es la que hace que el defecto no vuelva: **un ítem sin
 * curaduría no se juega.** El generador no promueve a `listo` un verso cuyos tres
 * distractores no eligió nadie; lo deja en `borrador` y lo dice.
 *
 * ## La llave es el verso, no el id
 *
 * Los ids son posicionales y se corren (`--reanclar` existe por eso). La curaduría se ancla
 * con `tema` + `verso`, el mismo renglón con la respuesta entre corchetes que usa
 * `fuenteUnica`. Si el verso deja de dar ítem, la entrada queda huérfana y el generador
 * avisa; no se muda sola a otro verso.
 *
 * Vive en `src/lib` porque la usan dos: el generador, que valida antes de escribir, y
 * `distractores-clase.test.ts`, que valida lo escrito. Sin `node:fs`.
 */

import { clave, limpiar, motivoDeRechazo, type ClaseDelHueco } from './morfologia.ts';
import { versosDelTema, type TemaConSecciones } from './versos.ts';

/** Una entrada de `letra-distractores.json`. */
export interface EntradaCurada extends Partial<ClaseDelHueco> {
  readonly tema: string;
  /** El renglón con la respuesta entre corchetes: `Y se [ofreció]`. */
  readonly verso: string;
  /** Los tres, en minúscula. La caja la pone el generador según la respuesta. */
  readonly distractores?: readonly string[];
  /**
   * Los distractores que **no** salen del cancionero de la banda. Se prefiere que salgan de
   * ahí —suenan a Redondos—; cuando no hay con qué, se declara acá. Uno que no está en el
   * cancionero y tampoco acá es un error.
   */
  readonly fuera?: readonly string[];
  /** Si está, el ítem no se juega, y este es el motivo. */
  readonly baja?: string;
  readonly nota?: string;
}

/** Lo que este módulo lee de un ítem de `letra.json`. */
export interface ItemCurable {
  readonly tema: { readonly slug: string };
  readonly hueco: { readonly antes: string; readonly respuesta: string; readonly despues: string };
  readonly contexto: { readonly antes: readonly string[]; readonly despues: readonly string[] };
}

/** El renglón como lo escribe la hoja de escucha. Tiene que dar lo mismo que `renglon()` del generador. */
export function renglonDe(item: ItemCurable): string {
  const { antes, respuesta, despues } = item.hueco;
  return `${antes} [${respuesta}] ${despues}`.replace(/\s+/g, ' ').trim();
}

export const llaveDe = (tema: string, verso: string): string => `${tema}|${verso}`;

export function indiceDeCuraduria(entradas: readonly EntradaCurada[]): Map<string, EntradaCurada> {
  return new Map(entradas.map((e) => [llaveDe(e.tema, e.verso), e]));
}

/** Las palabras de un texto, como claves de comparación. */
const palabrasDe = (texto: string): string[] =>
  texto.split(/[^\p{L}\p{N}']+/u).map(clave).filter(Boolean);

/**
 * Todas las palabras que canta la banda, como claves. Se lee de los temas con letra del
 * cancionero entero, no de un disco: un distractor de otro disco sigue sonando a Redondos.
 */
export function vocabularioDelCancionero(temas: readonly (TemaConSecciones & { readonly contenido?: string })[]): Set<string> {
  const vocabulario = new Set<string>();
  for (const tema of temas) {
    if (tema.contenido !== 'letra') continue;
    for (const verso of versosDelTema(tema)) for (const p of palabrasDe(verso)) vocabulario.add(p);
  }
  return vocabulario;
}

/**
 * ¿Está en el cancionero? Cuenta también el singular o el plural regular de una palabra
 * que sí está: «gatillos» sale de «gatillo», que la banda canta.
 */
export function estaEnElCancionero(palabra: string, vocabulario: ReadonlySet<string>): boolean {
  const k = clave(palabra);
  return [k, `${k}s`, `${k}es`, k.replace(/es$/, ''), k.replace(/s$/, '')].some((f) => f.length > 2 && vocabulario.has(f));
}

/** Lo que el jugador tiene a la vista en un ítem: el verso del hueco y su contexto. */
export function aLaVista(item: ItemCurable): Set<string> {
  return new Set(
    [item.hueco.antes, item.hueco.despues, ...item.contexto.antes, ...item.contexto.despues].flatMap(palabrasDe),
  );
}

/**
 * Todo lo que está mal en una entrada, medida contra su ítem. Lista vacía = pasa.
 *
 * Es la vara entera de `T-532` que se puede afirmar a máquina:
 *  · son tres, distintos entre sí y distintos de la respuesta;
 *  · ninguno está escrito en el verso ni en el contexto que el jugador ve;
 *  · todos cumplen el molde de la clase declarada y el margen de sílabas (`motivoDeRechazo`);
 *  · salen del cancionero, o están declarados en `fuera`.
 */
export function problemasDe(
  entrada: EntradaCurada,
  item: ItemCurable,
  vocabulario: ReadonlySet<string>,
): string[] {
  if (entrada.baja) return [];
  const problemas: string[] = [];
  const distractores = entrada.distractores ?? [];
  const respuesta = item.hueco.respuesta;

  if (!entrada.clase) problemas.push('no declara la clase de palabra del hueco');
  if (distractores.length !== 3) problemas.push(`trae ${distractores.length} distractores y van 3`);
  if (new Set([respuesta, ...distractores].map(clave)).size !== distractores.length + 1) {
    problemas.push('hay opciones repetidas, o un distractor es la respuesta');
  }

  const vista = aLaVista(item);
  const fuera = new Set((entrada.fuera ?? []).map(clave));
  for (const d of distractores) {
    if (d !== limpiar(d)) problemas.push(`«${d}» va en minúscula y sin signos`);
    if (vista.has(clave(d))) problemas.push(`«${d}» está a la vista en el verso o en el contexto`);
    if (entrada.clase) {
      const motivo = motivoDeRechazo(d, respuesta, entrada as ClaseDelHueco);
      if (motivo) problemas.push(`«${d}»: ${motivo}`);
    }
    const esta = estaEnElCancionero(d, vocabulario);
    if (!esta && !fuera.has(clave(d))) problemas.push(`«${d}» no está en el cancionero ni declarado en "fuera"`);
    if (esta && fuera.has(clave(d))) problemas.push(`«${d}» está declarado en "fuera" y sí está en el cancionero`);
  }
  for (const f of fuera) {
    if (!distractores.some((d) => clave(d) === f)) problemas.push(`"fuera" nombra «${f}», que no es un distractor`);
  }
  return problemas;
}
