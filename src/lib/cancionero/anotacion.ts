/**
 * Qué es letra y qué es la anotación del que transcribió.
 *
 * **El problema.** Las fuentes del cancionero son páginas de guitarra, y el que sube una
 * cifra escribe cosas en la columna de la letra que no son letra: `VERSO 1: (Riff 2) X7`,
 * `GUITARRA:`, la tablatura dibujada con guiones, `(X4)`, y hasta instrucciones en prosa
 * sobre cómo tocar un pasaje. La ingesta las guardaba como `t: "letra"`, así que para el
 * resto del sitio eran versos.
 *
 * **Por qué importa y no es cosmética.** El banco de `US-03` elige un hueco de un verso al
 * azar. Sobre datos sucios, el juego llegó a producir ítems cuyo enunciado era
 * `VERSO 1: [Riff] 2) X7` y `[Parte] 2 de 3`. Eso no es una pregunta difícil: es una
 * pregunta que nadie puede contestar, y el juego se la marca como error al que se sabe el
 * tema. Es exactamente lo único que `CLAUDE.md` declara estricto.
 *
 * **El criterio, y de qué lado se peca.** Ante la duda, **es letra.** Marcar un verso real
 * como anotación lo borra de la pantalla y del juego, y eso es peor que dejar pasar una
 * anotación: la anotación se ve y se corrige, el verso perdido no se ve nunca. Por eso las
 * reglas piden una **firma clara** —tablatura dibujada, marca de repetición, encabezado en
 * mayúsculas, jerga de guitarra con puntuación de anotación— y no se conforman con que la
 * línea "parezca rara".
 */

/** Jerga que solo aparece cuando alguien está explicando cómo se toca, no cantando. */
const TECNICA =
  /\b(riffs?|tablaturas?|palm\s*mute|arreglo de|acordes?|rasgue[oa]s?|cejilla|trastes?|p[uú]as?|guitarra\s*\d|bajo\s*\d|bpm|afinaci[oó]n|punteo)\b/i;

/** Las palabras con que se rotula un tramo de una cifra. */
const ESTRUCTURA =
  /(?:intro|outro|coda|final|estribillo|pre-?estribillo|estrofa|verso|puente|solo|base|riff|interludio|parte|bis|acordes?|guitarras?|bajo|bater[ií]a|teclado|arpegio|rasgueo|punteo|tab|tablatura|repetir|igual|afinaci[oó]n|cejilla|capo|traste|p[uú]a|arreglo|palm\s*mute)/;

const REGLAS: readonly (readonly [string, RegExp])[] = [
  // Solo caracteres de dibujo: la tablatura, los separadores, los asteriscos de una nota.
  ['layout', /^(?=.*[-_=|~*.])[\s\-_=|~*.]+$/],
  // `(X4)`, `x2`, `bis`, `repetir hasta el final`.
  ['repeticion', /^\s*[([{]?\s*(?:x\s*\d+|\d+\s*x|bis|repetir\b.*?)\s*[)\]}]?\s*$/i],
  // La tablatura dibujada: corridas de guiones, o la barra del compás.
  ['tab-grafica', /[-_]{3,}|\|\s*-|-\s*\||\|[^|]*\|/],
  // `VERSO 2:`, `INTRO:`, `ESTRIBILLO 3:`, `BAJO: (piano)`. La palabra de estructura, un
  // número si lo lleva, y **dos puntos o paréntesis**. Nadie canta una línea que arranca
  // así, diga lo que diga después — que es lo que la separa de la regla `encabezado`, que
  // sí mira lo que sigue. Sin esta, `VERSO 2: sin bajo` pasaba por verso y el juego llegó
  // a ofrecerla como pregunta.
  [
    'rotulo-de-tramo',
    /^[\s*]*[[(]?\s*(?:intro|outro|verso|estribillo|puente|solo|riff|parte|base|final|coda|guitarra|bajo|tab|estrofa|interludio|arreglo|acorde)s?\b\s*\d*\s*[:.()[\]]/i,
  ],
  // `[Solo Del Saxo]`, `[Intro] Dm A7 Eº`. El rótulo entre corchetes: la fuente lo usa como
  // título de tramo y después pone los acordes al lado. Va aparte de `rotulo-de-tramo`
  // porque acá la puntuación no viene pegada a la palabra sino al final del corchete.
  [
    'rotulo-entre-corchetes',
    /^\s*[[(]\s*(?:intro|outro|verso|estribillo|puente|solo|riff|parte|base|final|coda|guitarra|bajo|tab|estrofa|interludio|arreglo|acorde)s?\b[^\])]*[\])]/i,
  ],
];

/** La palabra de estructura al principio de la línea, sin importar cómo esté escrita. */
const ENCABEZADO_ARRANQUE = new RegExp(`^[\\s*]*${ESTRUCTURA.source}\\b`, 'i');

/**
 * `GUITARRA:`, `Intro`, `ESTRIBILLO FINAL:`, `VERSO 2`.
 *
 * La regla es: arranca con una palabra de estructura **y lo que sigue no tiene una sola
 * minúscula**. Eso separa el encabezado del verso que empieza con la misma palabra —
 * "Final de la noche…" arranca igual y es letra, porque sigue en minúscula.
 *
 * **Va en dos pasos y no en una expresión con `i`**, que fue el primer intento y estaba
 * mal: con la bandera puesta, la clase negada `[^a-z…]` deja de aceptar las mayúsculas
 * también, así que `ESTRIBILLO FINAL:` no matcheaba. La búsqueda de la palabra ignora
 * mayúsculas; el chequeo de lo que sigue, no. Lo agarró el test.
 */
function esEncabezado(x: string): boolean {
  const arranque = ENCABEZADO_ARRANQUE.exec(x);
  if (arranque === null) return false;
  return !/[a-záéíóúñ]/.test(x.slice(arranque[0].length));
}

/** Por qué una línea no es letra, o `null` si sí lo es. */
export function motivoAnotacion(texto: unknown): string | null {
  const x = String(texto ?? '');
  if (!x.trim()) return null; // el renglón en blanco separa estrofas: es estructura de la letra

  for (const [motivo, regla] of REGLAS) if (regla.test(x)) return motivo;
  if (esEncabezado(x)) return 'encabezado';

  // Jerga de guitarra **más** una firma de anotación. Las dos cosas: "acorde" suelto en un
  // verso es una palabra como cualquier otra; "(riff 2) X7" no lo canta nadie.
  if (TECNICA.test(x)) {
    if (/\S {3,}\S/.test(x)) return 'columna+tecnica'; // alineado en columnas, no cantado
    if (/[:()[\]]|\b[xX]\s*\d|\d\s*[xX]\b/.test(x)) return 'tecnica+puntuacion';
  }
  return null;
}

/** Atajo legible: `true` si la línea es anotación del transcriptor y no letra. */
export function esAnotacion(texto: unknown): boolean {
  return motivoAnotacion(texto) !== null;
}

/**
 * ¿Sirve esta línea para sacarle un hueco al juego de `US-03`?
 *
 * **Es más estricta que `esAnotacion`, y a propósito: los dos usos no se juegan lo mismo.**
 *
 * En la pantalla del cancionero, marcar de más **borra un verso real** y nadie se entera:
 * el renglón desaparece. Por eso allá, ante la duda, es letra. Y la duda existe de verdad
 * — hay versos cantados a los que el transcriptor les pegó un `Riff 1` al final, y hay al
 * menos uno donde la palabra *riff* es parte de lo que se canta.
 *
 * En el banco del juego, marcar de menos **le hace la pregunta al jugador**: si el hueco
 * cae sobre `Riff`, el que se sabe el tema no tiene forma de acertar. Y marcar de más no
 * cuesta nada, porque hay casi dos mil candidatos y el piso son quince.
 *
 * Costo asimétrico, criterio asimétrico: acá alcanza con que la línea **huela** a taller
 * de guitarra para dejarla afuera.
 */
export function sirveComoVerso(texto: unknown): boolean {
  const x = String(texto ?? '');
  if (!x.trim()) return false;
  if (esAnotacion(x)) return false;
  // `CTR-04` prohibe `<` y `>` en un verso jugable. No es capricho: nadie los canta, y en
  // el cancionero aparecen justo donde hay taller de guitarra — `<Igual que en el intro>`,
  // la leyenda `<>= Armonicos`. Que el contrato y el olfato coincidan es buena senal.
  if (/[<>]/.test(x)) return false;
  return !TECNICA.test(x);
}
