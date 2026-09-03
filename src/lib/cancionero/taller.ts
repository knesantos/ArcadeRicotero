/**
 * La nota del que transcribió **es un párrafo, no un renglón**.
 *
 * **El problema que este archivo resuelve, y por qué `anotacion.ts` no alcanzaba.** Aquel
 * módulo mira una línea sola y le busca una firma: tablatura dibujada, `(X4)`, un rótulo
 * en mayúsculas. Eso caza el renglón suelto, pero el ruido que quedaba en el cancionero no
 * viene suelto: el que sube una cifra escribe **un párrafo entero** en la columna de la
 * letra, y la fuente lo parte en renglones cortos. Caso real de *Salando las heridas*:
 *
 *     Aclaración
 *     La parte en la que
 *     Hay que tocar acordes
 *     Que no sean desplegados
 *     El acorde base es un Lam
 *     Que va cambiando
 *     El bajo
 *
 * Renglón por renglón, `Compases`, `El bajo` y `Que va cambiando` no tienen ninguna firma:
 * son tres palabras castellanas que podrían estar en cualquier letra. **Juntas y pegadas a
 * `Hay que tocar acordes`, no hay duda de qué son.** El contexto es la evidencia, y hay que
 * mirarlo para verla.
 *
 * **Qué se rompía.** En la pantalla del cancionero esas líneas se pintaban como versos. En
 * el banco de `US-03` se convirtieron en huecos: un ítem cuyo enunciado era *"En una
 * transcripcion dice F#m pero queda ___ F#"*. El jugador que se sabe el tema de memoria no
 * tiene forma de acertar eso, y el juego se lo marca como error — lo único que `CLAUDE.md`
 * declara estricto.
 *
 * **De qué lado se peca, y por qué acá se puede pecar distinto que en `anotacion.ts`.**
 * Aquel módulo dice "ante la duda, es letra", y sigue teniendo razón para una línea suelta.
 * Acá la duda es otra: no se marca una línea por parecer rara, se marca **un bloque cuyas
 * líneas se sostienen entre sí**. Hace falta al menos una señal fuerte —una palabra que en
 * una letra de los Redondos no aparece nunca— y que la mayoría del bloque acompañe. Un
 * verso cantado suelto no arrastra a sus vecinos, porque no tiene con qué.
 *
 * Y como en el resto del proyecto: **nada se borra**. La línea pasa a `t: "anotacion"`, se
 * sigue viendo en la página con su estilo, y deja de ser letra para los juegos.
 */

/** Una línea tal como la ve este módulo: el tipo que le puso la ingesta y su texto. */
export interface LineaClasificable {
  readonly t: string;
  readonly texto?: string;
}

export type Senal = 'fuerte' | 'debil' | null;

/**
 * **Palabras de taller de guitarra que en una letra de los Redondos no aparecen nunca.**
 *
 * No es una intuición: se midieron los 2.466 versos que hoy pasan el filtro y ninguna de
 * estas aparece en uno cantado. Los dos únicos parecidos son trampas de subcadena y por eso
 * todo va con borde de palabra: **`sheriff` contiene `riff`** (y *Sheriff* es un tema
 * entero, con el estribillo repitiendo la palabra) y **`puaj` contiene `púa`**.
 *
 * Quedaron **afuera** a propósito tres que la intuición pediría: `capo` (en el Río de la
 * Plata es el que manda, no la cejilla), `escala` y `nota` (palabras corrientes), y
 * `afinar` (*"Contra las cuerdas vas a desafinar"*, de *Espejismo*, es un verso cantado).
 */
const TALLER_DURO =
  /\b(traste|trastes|p[uú]a|p[uú]as|cejilla|arpegio|arpegios|rasgueo|rasgueos|punteo|muteando|mutear|distorsi[oó]n|distorsionad[oa]|micr[oó]fono|micr[oó]fonos|pentat[oó]nica|tablatura|tablaturas|transcripci[oó]n|afinaci[oó]n|semitono|semitonos|comp[aá]s|compases|acorde|acordes|acorde[oó]n|intro|introducci[oó]n|introducion|estribillo|outro|riff|tab|bpm)\b/i;

/**
 * Palabras que marcan estructura o instrumento **y que también pueden ser letra**.
 *
 * `bajo`, `solo`, `parte`, `final` y `guitarra` aparecen cantadas de verdad —*"y bajo
 * nuestro pulgar"*, *"Solo un buen gesto"*, *"Bajo este pulso"*—, así que solas no dicen
 * nada. Sirven únicamente para **medir cuánto del bloque acompaña**, nunca para marcar.
 */
const TALLER_BLANDO =
  /\b(verso|puente|solo|coro|base|figura|efecto|cuerda|cuerdas|dedo|dedos|golpe|golpes|guitarra|guitarras|bajo|bater[ií]a|saxo|teclado|piano|viol[ií]n|trompeta|percusi[oó]n|nota|notas|tono|quintas|parte|partes|final)\b/i;

/** Verbos con los que se explica cómo se toca algo. */
const VERBO_DE_TALLER =
  /\b(toca|tocan|tocar|tocando|toc[aá]s|repite|repiten|repetir|repit[ae]|suena|suenan|suene|hacerlo|apretar|aprieta|aprietan|apret[aá]|golpea|golpear|desliza|pisar|pisa|rasguea|puntea|transporta|sigue|siguen|arranca|alarga)\b/i;

/**
 * El acorde escrito de forma **inconfundible**: o trae `#`/`b`, o trae un número, o es una
 * cifra latina con sufijo (`LAm`, `REsus`, `SOL7`). El `A` suelto no cuenta — es un
 * artículo, una nota y media letra del alfabeto, y confundirlo sale caro.
 */
const ACORDE_DURO =
  /(?:^|[\s([{"'/,.-])(?:(?:do|re|mi|fa|sol|la|si)(?:#|b)?(?:m|M|sus|maj|dim|aum|add)?\d*(?:m|sus\d?|maj\d?|dim|aum|add\d?|\d)|[A-G](?:#|b)(?:m|M|sus|maj|dim|aum|add|º|°)?\d*|[A-G](?:m|maj|min|dim|aug|sus|add|º|°)\d*|[A-G]\d|[A-G](?:#|b)?(?:m|M)?\/[A-G])(?=$|[\s)\]}"',.;:!?/-])/;

/** `x2`, `(4 veces)`, `X 6`: la marca de repetición metida en medio de una frase. */
const REPETICION = /(\b[xX]\s*\d+\b|\b\d+\s*[xX]\b|\(\s*\d+\s*veces?\s*\)|\b\d+\s*veces\b)/;

/**
 * El mensaje que no es del tema: el saludo, el mail, la firma, el pedido de corrección.
 *
 * Todos medidos en el corpus. Ojo con lo que **no** entra: `gracias` suelto es letra
 * cantada (*"Y gracias por el trago, man."*, *"Y aquí ¡gracias a Dios!"*), así que solo
 * entran las formas que le hablan al que lee la cifra, no al que escucha el disco.
 */
const MENSAJE =
  /(espero que (les|le|te)\b|\bles (guste|sirva|salga)\b|\brecomiendo\b|\bmand[aá](me)? un mail\b|\bun mail\b|\bun saludo\b|\bsaludos\b|\btabbed by\b|\byo la saqu[eé]\b|\bla saqu[eé] (de|viendo)\b|\bsi alguien (sabe|tiene|quiere|la)\b|\bcualquier (duda|correcci[oó]n)\b|\baclaraci[oó]n\b|\bse van a dar cuenta\b|\bno s[eé] cu[aá]l es\b|\bfade ?out\b)/i;

/** `Instrumental en Bbm - F# - F`, `[Interludio] Am F G`. La fuente rotula el tramo sin voz. */
const TRAMO_SIN_VOZ = /^[\s*[(]*\s*(instrumental|interl[uú]d(io|e))\b/i;

/**
 * El renglón que arranca señalando: *"Acá sigue con la misma base"*, *"Luego con la púa se
 * golpea"*. El deíctico solo no dice nada —una letra puede empezar con *"Ahora"*— pero
 * pegado a una palabra de taller es la voz del que explica, no la del que canta.
 */
const DEICTICO = /^[\s*(-]*\s*(ac[aá]|aqu[ií]|ah[ií]|luego|despu[eé]s|ahora|primero|entonces)\b/i;

/** El asterisco al margen: nadie canta con asterisco, y el transcriptor lo usa para acotar. */
const ASTERISCO_AL_MARGEN = /^\s*\*/;

/** La forma dura de un texto: sin tildes, sin puntuación, sin espacios. */
function duro(x: string): string {
  return x
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Qué tan fuerte huele a taller una línea sola.
 *
 * `fuerte` alcanza para marcarla sin mirar a nadie más. `debil` no marca nada por sí solo:
 * es lo que se cuenta para decidir si el bloque entero es una nota.
 */
export function senalDeTaller(texto: unknown): Senal {
  const x = String(texto ?? '');
  if (!x.trim()) return null;

  if (TALLER_DURO.test(x)) return 'fuerte';
  if (MENSAJE.test(x)) return 'fuerte';
  if (TRAMO_SIN_VOZ.test(x)) return 'fuerte';
  if (ASTERISCO_AL_MARGEN.test(x)) return 'fuerte';

  const acorde = ACORDE_DURO.test(x);
  const blando = TALLER_BLANDO.test(x);
  const verbo = VERBO_DE_TALLER.test(x);

  // Un acorde escrito con todas las letras **más** algo que lo explique. Ni el acorde solo
  // (una cifra suelta ya la caza `anotacion.ts`) ni la palabra sola (`bajo` es letra).
  if (acorde && (blando || verbo || REPETICION.test(x))) return 'fuerte';
  // El que señala mientras explica.
  if (DEICTICO.test(x) && (blando || verbo || acorde)) return 'fuerte';

  return acorde || blando || verbo || REPETICION.test(x) ? 'debil' : null;
}

/**
 * Los bloques de letra de una sección: corridas de renglones cantados sin cortar.
 *
 * Corta el bloque el renglón en blanco —que en una cifra separa estrofas— y cualquier línea
 * que no sea letra: una tablatura o una anotación ya marcada. Es exactamente como se ve el
 * párrafo en la página de origen, y es lo que hace que *"El bajo"* y *"Compases"* tengan
 * con quién sostenerse.
 */
function bloquesDeLetra(lineas: readonly LineaClasificable[]): number[][] {
  const bloques: number[][] = [];
  let actual: number[] = [];
  lineas.forEach((l, i) => {
    if (l.t === 'letra' && String(l.texto ?? '').trim()) actual.push(i);
    else if (actual.length) {
      bloques.push(actual);
      actual = [];
    }
  });
  if (actual.length) bloques.push(actual);
  return bloques;
}

/** Cuánto del bloque tiene que acompañar para que arrastre a los renglones sin firma. */
const MAYORIA = 0.6;

/**
 * Por qué cada línea de la sección es una nota del transcriptor, o `null` si es letra.
 *
 * Dos pasadas, y la segunda es la que este archivo vino a agregar:
 *
 *  1. **La línea sola.** Señal fuerte → es nota, sin discusión.
 *  2. **El bloque.** Si el bloque tiene al menos una fuerte y el 60% de sus renglones traen
 *     alguna señal, cae entero. Esa es la regla que rescata *"Compases"*, *"El bajo"* y
 *     *"Va a sonar extraño"*, que solas no tenían con qué defenderse.
 *
 * La mayoría es lo que protege la letra: en *Salando las heridas* el renglón *"Acá sigue
 * con la misma base"* está pegado a ocho versos cantados, y el bloque mide 1 de 9. Cae la
 * línea, se quedan los versos.
 *
 * Devuelve el motivo escrito y no un booleano por la misma razón que `motivoAnotacion` y
 * que la cuarentena de la ingesta: **un descarte silencioso no se puede auditar.**
 */
export function motivosDeTaller(lineas: readonly LineaClasificable[]): (string | null)[] {
  const senales = lineas.map((l) => (l.t === 'letra' ? senalDeTaller(l.texto) : null));
  const motivos: (string | null)[] = lineas.map((_, i) =>
    senales[i] === 'fuerte' ? 'nota del transcriptor' : null,
  );

  for (const bloque of bloquesDeLetra(lineas)) {
    if (bloque.length < 2) continue;
    if (!bloque.some((i) => senales[i] === 'fuerte')) continue;
    const acompanan = bloque.filter((i) => senales[i] !== null).length;
    if (acompanan / bloque.length < MAYORIA) continue;
    for (const i of bloque) {
      motivos[i] ??= `bloque de nota del transcriptor (${acompanan}/${bloque.length})`;
    }
  }
  return motivos;
}

/**
 * El título de la página metido como si fuera el primer verso.
 *
 * `lacuerda.net` encabeza algunas transcripciones con el nombre del tema en mayúsculas, y
 * la ingesta lo guardaba como letra: *San Telmo* abría con un verso que decía `SAN TELMO`.
 * La regla es angosta a propósito —**en mayúsculas y exactamente igual al título**— porque
 * un tema puede cantar su propio nombre, y de hecho varios lo hacen.
 */
export function esTituloDePagina(texto: unknown, titulo: string): boolean {
  const x = String(texto ?? '').trim();
  if (!x || /[a-záéíóúüñ]/.test(x)) return false;
  return duro(x) === duro(titulo) && duro(x).length > 0;
}
