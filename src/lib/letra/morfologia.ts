/**
 * Morfología de bolsillo del castellano, para que la palabra errada de "Completá la letra"
 * suene a la correcta (`T-532`).
 *
 * ## El defecto que cierra
 *
 * Hasta `T-532` los tres distractores eran palabras sueltas del disco, de largo parecido y
 * nada más: «Y se [___]» ofrecía música / rockeros / cristal donde va un verbo, y «se cargan
 * los [___]» ofrecía carozo / caníbal / ciudad donde va un plural. De los 72 ítems jugables,
 * 44 no tenían ni un distractor que compitiera: se acertaba por gramática, sin saberse el
 * tema. Eso es lo contrario de lo que el juego promete, que es premiar al que sabe.
 *
 * ## Qué es y qué no es
 *
 * **No es un analizador.** Son las cuatro cosas que se pueden leer de la terminación de una
 * palabra sin diccionario —cuántas sílabas tiene, dónde lleva el acento, si parece plural,
 * qué género insinúa, qué molde verbal tiene— y alcanzan para dos trabajos:
 *
 *  · el generador (`scripts/generar-letra.mjs`) **prefiere** candidatos con el molde de la
 *    respuesta, y
 *  · el test (`distractores-clase.test.ts`) **falla** cuando un ítem jugable trae un
 *    distractor de otro número, de otro molde o de otro largo.
 *
 * La clase de palabra de cada hueco jugable no la adivina esto: la declara una persona en
 * `src/data/letra-distractores.json`. Lo que se mide acá es si cada distractor cumple el
 * molde de la clase declarada. Sin `node:fs`, sin estado: funciones puras.
 */

const sinTildes = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** La palabra en minúscula y sin signos en los bordes. Conserva tildes y eñes. */
export function limpiar(palabra: string): string {
  return palabra
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    .toLocaleLowerCase('es')
    .normalize('NFC');
}

/** La clave de comparación: sin tildes ni mayúsculas. «Sólo» y «solo» son la misma. */
export function clave(palabra: string): string {
  return sinTildes(limpiar(palabra));
}

const FUERTES = 'aeoáéó';
const DEBILES_CON_TILDE = 'íú';
const VOCALES = 'aeiouáéíóúü';

interface Nucleo {
  /** La vocal que manda en la sílaba, sin tilde. */
  readonly vocal: string;
  /** Dónde está en la palabra limpia. */
  readonly en: number;
  readonly conTilde: boolean;
}

/**
 * Los núcleos silábicos de una palabra: uno por sílaba.
 *
 * Reglas: dos vocales fuertes juntas son dos sílabas (pe-or); una débil con tilde rompe el
 * diptongo (dí-as); el resto se junta (fue-go, ciu-dad). La `u` muda de `que`, `qui`, `gue`
 * y `gui` no cuenta, y la `y` final hace de vocal (rey, whisky).
 */
function nucleos(palabra: string): Nucleo[] {
  const p = limpiar(palabra).replace(/([qg])u([eiéí])/g, '$1_$2').replace(/y$/, 'i');
  const salida: Nucleo[] = [];
  let i = 0;
  while (i < p.length) {
    if (!VOCALES.includes(p[i]!)) {
      i++;
      continue;
    }
    let j = i;
    while (j < p.length && VOCALES.includes(p[j]!)) j++;
    const antes = salida.length;
    for (let k = i; k < j; k++) {
      const v = p[k]!;
      if (FUERTES.includes(v) || DEBILES_CON_TILDE.includes(v)) {
        salida.push({ vocal: sinTildes(v), en: k, conTilde: v !== sinTildes(v) });
      }
    }
    // Solo débiles (cui-dado, viu-da): la sílaba la lleva la última.
    if (salida.length === antes) salida.push({ vocal: sinTildes(p[j - 1]!).replace('ü', 'u'), en: j - 1, conTilde: false });
    i = j;
  }
  return salida;
}

/** Cuántas sílabas tiene. Una palabra sin vocales (una sigla) cuenta como una. */
export function silabas(palabra: string): number {
  return Math.max(1, nucleos(palabra).length);
}

/** El índice del núcleo que lleva el acento. */
function tonica(palabra: string): { readonly nucleos: Nucleo[]; readonly i: number } {
  const ns = nucleos(palabra);
  if (ns.length === 0) return { nucleos: ns, i: -1 };
  const conTilde = ns.findIndex((n) => n.conTilde);
  if (conTilde >= 0) return { nucleos: ns, i: conTilde };
  const llana = /[aeiouns]$/.test(clave(palabra).replace(/y$/, 'i'));
  return { nucleos: ns, i: llana ? Math.max(0, ns.length - 2) : ns.length - 1 };
}

/** `aguda`, `llana` o `esdrujula`: lo que hace que dos palabras caigan igual en el verso. */
export function acento(palabra: string): 'aguda' | 'llana' | 'esdrujula' {
  const { nucleos: ns, i } = tonica(palabra);
  const desdeElFinal = ns.length - 1 - i;
  return desdeElFinal <= 0 ? 'aguda' : desdeElFinal === 1 ? 'llana' : 'esdrujula';
}

/** La rima asonante: las vocales desde la tónica. «fuego» y «miedo» dan `e-o`. */
export function rimaAsonante(palabra: string): string {
  const { nucleos: ns, i } = tonica(palabra);
  return i < 0 ? '' : ns.slice(i).map((n) => n.vocal).join('-');
}

/** La rima consonante: todo desde la vocal tónica. «turno» y «Saturno» dan `urno`. */
export function rimaConsonante(palabra: string): string {
  const { nucleos: ns, i } = tonica(palabra);
  if (i < 0) return '';
  const p = limpiar(palabra).replace(/([qg])u([eiéí])/g, '$1_$2').replace(/y$/, 'i');
  return sinTildes(p.slice(ns[i]!.en));
}

/**
 * Palabras que terminan en `s` y no son plurales. Lista corta y a propósito: son las que
 * aparecen en el cancionero o son de uso tan común que un curador las va a querer usar.
 */
const SINGULARES_EN_S = new Set([
  'menos', 'lejos', 'gratis', 'crisis', 'lunes', 'martes', 'jueves', 'viernes', 'dios', 'adios',
  'mes', 'tos', 'res', 'vos', 'dos', 'tres', 'seis', 'mas', 'jamas', 'quizas', 'apenas', 'antes',
  'entonces', 'mientras', 'ademas', 'despues', 'pais', 'compas', 'reves', 'anis', 'bis', 'gas',
  'atras', 'detras', 'tras', 'pues', 'virus', 'caos', 'tesis', 'dosis', 'cumpleanos', 'paraguas',
  'blues', 'jesus', 'autobus', 'interes', 'estres', 'cipres', 'marques', 'burgues',
]);

/**
 * ¿Tiene forma de plural? Termina en `s`, la `s` no cae en sílaba con tilde (francés,
 * después) y no es una de las singulares de siempre.
 */
export function parecePlural(palabra: string): boolean {
  const p = limpiar(palabra);
  if (!p.endsWith('s')) return false;
  if (SINGULARES_EN_S.has(clave(p))) return false;
  if (/[áéíóú]s$/.test(p)) return false;
  return /[aeiou]s$/.test(clave(p));
}

/** Las que la terminación engaña: «la mano», «el día». */
const FEMENINAS_EN_O = new Set(['mano', 'foto', 'moto', 'radio', 'libido']);
const MASCULINAS_EN_A = new Set([
  'dia', 'mapa', 'tema', 'problema', 'poema', 'poeta', 'planeta', 'idioma', 'clima', 'sistema',
  'programa', 'drama', 'fantasma', 'cometa', 'profeta', 'pirata', 'papa', 'sofa', 'tranvia',
  'canibal', 'esquema', 'dilema', 'enigma', 'aroma', 'lema', 'policia', 'guardia', 'cura',
]);

/**
 * El género que insinúa la terminación: `m`, `f`, o `null` si no dice nada (fatales, libre,
 * corazón). `null` no es un defecto: es una palabra que cabe con los dos.
 */
export function generoPorTerminacion(palabra: string): 'm' | 'f' | null {
  const p = clave(palabra);
  const singular = parecePlural(palabra) ? p.replace(/s$/, '') : p;
  if (FEMENINAS_EN_O.has(singular)) return 'f';
  if (MASCULINAS_EN_A.has(singular)) return 'm';
  if (singular.endsWith('o')) return 'm';
  if (singular.endsWith('a')) return 'f';
  if (/(cion|sion|dad|tad|tud|umbre)$/.test(singular)) return 'f';
  return null;
}

const ENCLITICO = '(?:me|te|se|lo|la|le|los|las|les|nos)?';
const INFINITIVO = new RegExp(`[aeií]r${ENCLITICO}$`);
const GERUNDIO = new RegExp(`(?:[aá]ndo|i[eé]ndo|y[eé]ndo)${ENCLITICO}$`);

/** ¿Tiene forma de infinitivo? (hablar, perder, verte). No distingue «mujer»: eso lo mira quien cura. */
export function pareceInfinitivo(palabra: string): boolean {
  return INFINITIVO.test(limpiar(palabra));
}

/** ¿Tiene forma de gerundio? (sangrando, acechándome). */
export function pareceGerundio(palabra: string): boolean {
  return GERUNDIO.test(limpiar(palabra));
}

/**
 * El molde de un verbo conjugado, leído de la terminación. Dos formas con el mismo molde
 * caben en el mismo hueco sin que la gramática las delate.
 *
 *  · `preterito-3s`  llegó, sonó, ofreció
 *  · `preterito-1s`  mordí, bailé
 *  · `imperfecto`    amaba, tenía
 *  · `futuro`        cambiará, vendrán → con la persona pegada (`futuro-pl`)
 *  · `nosotros`      vemos, oímos
 *  · `ellos`         duelen, siguen
 *  · `vos`           arrepentís, mirás, creés
 *  · `tu`            usas, recoges
 *  · `yo`            acabo, arranco
 *  · `el`            pierde, gana, anochezca
 */
export type MoldeVerbal =
  | 'preterito-3s' | 'preterito-1s' | 'imperfecto' | 'imperfecto-pl' | 'futuro' | 'futuro-pl'
  | 'nosotros' | 'ellos' | 'vos' | 'tu' | 'yo' | 'el';

export function moldeVerbal(palabra: string): MoldeVerbal | null {
  const p = limpiar(palabra);
  if (/mos$/.test(p)) return 'nosotros';
  if (/rán$/.test(p)) return 'futuro-pl';
  if (/rá$/.test(p)) return 'futuro';
  if (/(aban|ían)$/.test(p)) return 'imperfecto-pl';
  if (/(aba|ía)$/.test(p)) return 'imperfecto';
  if (/ó$/.test(p)) return 'preterito-3s';
  if (/[éí]$/.test(p)) return 'preterito-1s';
  if (/[áéí]s$/.test(p)) return 'vos';
  if (/[ae]n$/.test(p)) return 'ellos';
  if (/[ae]s$/.test(p)) return 'tu';
  if (/o$/.test(p)) return 'yo';
  if (/[ae]$/.test(p)) return 'el';
  return null;
}

/** Lo que una persona declara del hueco de un ítem jugable (`letra-distractores.json`). */
export interface ClaseDelHueco {
  /**
   * `sustantivo` y `adjetivo` miran número y género; `verbo` mira el molde; `infinitivo` y
   * `gerundio`, la terminación; `otra` (adverbios, locuciones, extranjerismos) solo lo que
   * vale para todas: sílabas, no estar a la vista, no repetirse.
   */
  readonly clase: 'sustantivo' | 'adjetivo' | 'verbo' | 'infinitivo' | 'gerundio' | 'otra';
  /** Solo si el verso lo fuerza («los [___]», «un [___]»). */
  readonly numero?: 'sg' | 'pl';
  /** Solo si el verso lo fuerza («la [___]», «hermano [___]»). */
  readonly genero?: 'm' | 'f';
}

/** Cuántas sílabas de diferencia se toleran entre la respuesta y un distractor. */
export const MARGEN_SILABAS = 1;

/**
 * Por qué este distractor **no** suena a la respuesta, o `null` si pasa.
 *
 * Es la vara que comparten el test y el validador del generador: lo que se puede afirmar a
 * máquina. Que el distractor no sea *también* correcto y que tenga sentido en el verso no
 * se puede medir así: eso lo mira quien cura.
 */
export function motivoDeRechazo(distractor: string, respuesta: string, hueco: ClaseDelHueco): string | null {
  const dif = Math.abs(silabas(distractor) - silabas(respuesta));
  if (dif > MARGEN_SILABAS) {
    return `tiene ${silabas(distractor)} sílabas y la respuesta ${silabas(respuesta)}`;
  }

  if (hueco.clase === 'infinitivo') {
    return pareceInfinitivo(distractor) ? null : 'el hueco pide un infinitivo';
  }
  if (hueco.clase === 'gerundio') {
    return pareceGerundio(distractor) ? null : 'el hueco pide un gerundio';
  }
  if (hueco.clase === 'verbo') {
    const pide = moldeVerbal(respuesta);
    const trae = moldeVerbal(distractor);
    return pide === trae ? null : `el hueco pide un verbo como «${respuesta}» (${pide}) y esto se lee ${trae ?? 'sin molde de verbo'}`;
  }
  if (hueco.clase === 'sustantivo' || hueco.clase === 'adjetivo') {
    if (hueco.numero === 'pl' && !parecePlural(distractor)) return 'el hueco pide plural';
    if (hueco.numero === 'sg' && parecePlural(distractor)) return 'el hueco pide singular';
    const genero = generoPorTerminacion(distractor);
    if (hueco.genero && genero && genero !== hueco.genero) {
      return `el hueco pide ${hueco.genero === 'f' ? 'femenino' : 'masculino'}`;
    }
  }
  return null;
}

/**
 * Cuánto se parece el sonido de un candidato al de la respuesta. Más es mejor. Lo usa el
 * generador para ordenar, nunca para descartar.
 */
export function parecidoSonoro(candidato: string, respuesta: string): number {
  let puntos = 0;
  if (silabas(candidato) === silabas(respuesta)) puntos += 2;
  if (acento(candidato) === acento(respuesta)) puntos += 1;
  if (rimaAsonante(candidato) === rimaAsonante(respuesta)) puntos += 2;
  if (rimaConsonante(candidato) === rimaConsonante(respuesta)) puntos += 1;
  return puntos;
}
