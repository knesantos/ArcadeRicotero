/**
 * Notación latina a anglosajona, para el ingreso del cancionero.
 *
 * **Por qué existe.** El cancionero se raspa de tres sitios y **no todos cifran igual**:
 * cifraclub y letras.com usan la notación anglosajona (`A`…`G`), y **lacuerda.net usa la
 * latina** (`DO RE MI FA SOL LA SI`). Hasta el ciclo 7 la ingesta pasaba el nombre tal
 * cual, así que 20 temas entraban con acordes que el transpositor no sabe leer: pedir
 * medio tono arriba sobre un `LAm` no devuelve nada, y la ficha del tema muestra una
 * grilla rota.
 *
 * No se notó antes porque lacuerda.net **no era una de las fuentes**: apareció con el
 * cancionero rehecho el 2026-08-24. Lo encontró el schema, la primera vez que se corrió.
 *
 * **La trampa que tiene esto, y por la que hay un test que la nombra:** `"Solo"` empieza
 * con `SOL`. Un reemplazo por prefijo lo convierte en `"Go"`, que parece un acorde y no lo
 * es. Por eso van dos cerrojos: la raíz latina se busca **en mayúsculas exactas** —así
 * `Solo` e `Intro` no matchean nunca— y lo que sigue tiene que parecerse a un sufijo de
 * acorde. Lo que no pasa los dos, no es un acorde: es una etiqueta de sección que la
 * fuente dejó en la columna de los acordes, y se descarta.
 */

/** Las siete raíces. **`SOL` va primero**: si `SI` se probara antes, `SOL` nunca matchea. */
const LATINAS: readonly (readonly [string, string])[] = [
  ['SOL', 'G'],
  ['DO', 'C'],
  ['RE', 'D'],
  ['MI', 'E'],
  ['FA', 'F'],
  ['LA', 'A'],
  ['SI', 'B'],
];

/**
 * Lo que puede venir después de la raíz de un acorde y sigue siendo un acorde.
 * Alteración, calidad, tensiones, y el bajo invertido de `Am/G`.
 */
const SUFIJO = /^[#b]?(m|M|maj|min|dim|aug|sus|add|°|º)?\d*(sus\d*)?(add\d+)?(\([^)]*\))?(\/[A-G][#b]?)?$/;

/**
 * Devuelve el acorde en notación anglosajona, o `null` si no era un acorde.
 *
 * **Las dos notaciones pasan por la misma validación, y eso no es simetría decorativa.**
 * La primera versión devolvía intacto cualquier nombre que arrancara con `A`…`G`, porque
 * "ya venía bien". El test lo tumbó en el acto: `Final` arranca con `F`, y también
 * `Estribillo` con `E`, `Guitarra` con `G` y `Base` con `B`. Todas son etiquetas de sección
 * que las fuentes dejan en la columna de los acordes, y todas se colaban.
 *
 * De paso, validar el sufijo también saca los dos casos que el schema venía marcando desde
 * antes: secuencias enteras metidas en el campo de *un* acorde (`E5-D#5-D5-C5-A5`,
 * `Am  Am/G  Am/F#  Am/F`). No son acordes largos: son varios acordes sin separar.
 */
export function normalizarAcorde(nombre: unknown): string | null {
  const x = String(nombre ?? '').trim();
  if (!x) return null;

  // Latina primero, y si no cierra se cae a la anglosajona. **El orden importa y las dos
  // mitades tambien.** `DO` y `FA` empiezan con `D` y con `F`, que son raices anglosajonas
  // validas: probando anglosajona primero, `DO` daria `D` + `O`, se caeria por el sufijo y
  // se perderia un acorde real. Y probando solo la latina, `Fadd9` se leeria como `FA` +
  // `dd9`, que tampoco cierra — pero es un acorde perfectamente valido leido como anglo.
  // Con las dos pasadas, cada nombre se lee de la unica forma en que tiene sentido.
  for (const [latina, anglo] of LATINAS) {
    if (!x.startsWith(latina)) continue;
    const resto = x.slice(latina.length);
    if (SUFIJO.test(resto)) return anglo + resto;
    break;
  }

  if (/^[A-G]/.test(x) && SUFIJO.test(x.slice(1))) return x;
  return null;
}

/** Normaliza una lista y tira lo que no era un acorde, sin dejar huecos ni repetidos. */
export function normalizarAcordes(nombres: readonly unknown[]): string[] {
  const salida: string[] = [];
  for (const n of nombres) {
    const a = normalizarAcorde(n);
    if (a !== null && !salida.includes(a)) salida.push(a);
  }
  return salida;
}
