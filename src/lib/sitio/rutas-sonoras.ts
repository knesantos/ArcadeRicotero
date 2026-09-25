/**
 * Qué puede hacer la cinta en cada ruta del sitio (`ADR-07.2`).
 *
 * Es el módulo más importante del ciclo 14, y no por lo que hace sino por lo que impide.
 *
 * ## El daño que este archivo existe para que no pase
 *
 * Los 95 recortes de `public/audio/fragmentos/` **son las respuestas de `US-02`**. Los temas
 * enteros son las respuestas de `US-03` y de `US-07`. Una rocola que suene donde no debe le
 * sopla la respuesta al que está jugando — y eso es lo único que `CLAUDE.md` declara
 * inaceptable: *"si el dato está mal, el juego le marca error justo al que se sabe el tema"*.
 * Acá es peor todavía, porque no le marca error: le regala el acierto.
 *
 * ## La regla gruesa, que es la única que no envejece
 *
 * > **Una pantalla de juego no pone temas. Ninguna, sin excepción, y sin discutir juego por
 * > juego si su respuesta es soplable.**
 *
 * `dos-ejes` no tiene respuesta correcta y `ponelos-en-fila` no tiene orden correcto, y van
 * mudas igual: en `ponelos-en-fila` uno de los conjuntos son doce temas sorteados, así que
 * la rocola nombrando un tema con su disco es material del tablero. Afinar juego por juego
 * significa que el octavo juego llegue con una discusión en vez de con una respuesta.
 *
 * ## Tres candados sobre la misma puerta
 *
 * - **A — lista blanca.** La rocola suena **solo** donde está escrito acá. Todo lo demás cae
 *   a `cama`. **Un juego nuevo nace mudo.** Es lo contrario de una lista negra, donde el
 *   juego nuevo nace sonando y el error se descubre jugando.
 * - **B — el censo.** `PAGINAS_DECLARADAS` es la lista de páginas clasificadas, y
 *   `rutas-sonoras.test.ts` **rompe el build** si aparece una página que nadie clasificó, o
 *   si desapareció una declarada. Agregar una pantalla sin decidir qué hace la cinta ahí no
 *   se puede: no se agrega sola, pero tampoco puede pasar de largo.
 * - **C — la siembra.** La rocola necesita que la página le haya sembrado la lista de piezas
 *   (`ADR-07.9`). Una pantalla que no la siembra no tiene con qué sonar, así que el olvido
 *   también cae del lado del silencio.
 *
 * ## Por qué este archivo casi no importa nada
 *
 * Solo `./graves.ts`, que no importa nada. Si trajera algo de `arte.ts` arrastraría `node:fs`
 * al navegador y moriría en silencio — es literalmente el defecto de `D-29`. Y los tres
 * graves se leen de `graves.ts` y no se vuelven a escribir acá: **una sola verdad sobre
 * quiénes son los tres.**
 *
 * ## Desvío declarado respecto de `ADR-07.9`
 *
 * El contrato de esa sección esboza `type ModoCinta = 'rocola' | 'cama'`, pero sus propios
 * casos de prueba 1, 2 y 4 piden que `modoEnRuta()` devuelva **`muda`** para los tres graves
 * y para `/diagnostico-audio/`. Manda el caso de prueba, que es lo específico: el tipo tiene
 * **tres** valores. `cama` y `muda` no son lo mismo y confundirlos es justamente lo que
 * `ADR-07.2` pide no hacer.
 */

import { SLUGS_GRAVES } from './graves.ts';

/**
 * Qué puede hacer la cinta acá. **Lo decide la ruta, nunca la persona.**
 *
 * - `rocola` — puede poner temas.
 * - `cama` — suena la cama sintetizada de `ADR-04`, que no puede soplar nada y cuesta cero
 *   bytes. **No es silencio**: apagar la cinta entera en los juegos sería sacarle a la gente
 *   algo que ya tenía y que no molesta a nadie.
 * - `muda` — no suena nada, ni cama. Los tres graves y el instrumento de medición.
 * - `tema-fijo` — suena **un** tema, siempre el mismo, elegido de antemano por `contenido`
 *   (`CNT-20`). Es el cuarto modo, y nace con `US-09` por `D-39`: ese juego suena entero.
 *   **No sortea y no autoarranca**, que son las dos cosas que lo separan de `rocola`: sin
 *   sorteo no hay tema que soplar —el tema es siempre el mismo y no es la respuesta de
 *   nada—, y sin autoarranque sigue haciendo falta un gesto de la persona.
 */
export type ModoCinta = 'rocola' | 'cama' | 'muda' | 'tema-fijo';

/**
 * Las rutas donde la rocola puede poner temas. **Esta lista es el candado A.**
 *
 * Se escribe como reglas sobre segmentos y no como cadenas sueltas porque dos de las cinco
 * entradas son rutas con segmento variable (`[slug]`), y una lista de cadenas no las puede
 * nombrar sin enumerar 105 letras y 35 artículos.
 *
 * **Para agregar una ruta hay que venir hasta acá y leer este comentario.** Antes de
 * hacerlo, la pregunta de `ADR-07.2`: ¿en esta pantalla la persona tiene que producir una
 * respuesta que la rocola pueda dejar oír o nombrar en el crédito, antes de que la produzca?
 * Si hay alguna duda, la respuesta es que no se agrega.
 */
export const RUTAS_CON_ROCOLA: ReadonlyArray<{
  readonly nombre: string;
  readonly acepta: (segmentos: readonly string[]) => boolean;
}> = [
  { nombre: 'el portal', acepta: (s) => s.length === 0 },
  { nombre: 'el cancionero', acepta: (s) => s[0] === 'letras-y-acordes' && s.length <= 2 },
  { nombre: 'la Redondopedia', acepta: (s) => s[0] === 'redondopedia' && s.length <= 2 },
];

/**
 * Las rutas donde no suena **nada**, ni la cama.
 *
 * Los tres graves salen de `graves.ts` — acá no se reescriben. `/diagnostico-audio/` se
 * agrega por un motivo distinto y hay que decirlo: no es una falta de respeto, es que esa
 * página **mide el audio**, y cualquier sonido que el sitio agregue ahí es una lectura
 * falsa. En la práctica ya estaba muda (esa página no usa `Base.astro` y no importa la isla
 * de la cinta), pero "en la práctica" no es un candado.
 *
 * Es la única ruta de esta lista que no es grave, y por eso el módulo se llama
 * `rutas-sonoras.ts` y no `graves-v2.ts`.
 */
export const RUTA_INSTRUMENTO = 'diagnostico-audio';

/** La unica pantalla en modo `tema-fijo` (`D-39`, `CNT-20`). Bajo `/juegos/`. */
export const RUTA_TEMA_FIJO = 'skayboy-y-poligirl';

/**
 * Las dieciséis páginas de `src/pages/`, clasificadas una por una. **Es el candado B.**
 *
 * No se usa en tiempo de ejecución: existe para que `rutas-sonoras.test.ts` la compare
 * contra el disco y rompa el build si alguien agrega una pantalla sin pasar por acá. La ruta
 * es relativa a `src/pages/`, tal como la escribe Astro.
 */
export const PAGINAS_DECLARADAS: Readonly<Record<string, ModoCinta>> = {
  'index.astro': 'rocola',
  'quiz.astro': 'cama',
  'diagnostico-audio.astro': 'muda',
  'juegos/adivinar-el-tema.astro': 'cama',
  'juegos/adivinar-la-tapa.astro': 'cama',
  'juegos/adivinar-por-la-letra.astro': 'cama',
  'juegos/completar-la-letra.astro': 'cama',
  'juegos/dos-ejes.astro': 'cama',
  'juegos/ponelos-en-fila.astro': 'cama',
  // `US-10`. Muda de temas como todos: una pregunta es cuánto dura un tema, y ese tema
  // sonando la respondería.
  'juegos/mas-o-menos.astro': 'cama',
  // `US-09`. El unico juego que no cae a `cama`: `D-39` lo hizo sonar entero, y es la
  // primera excepcion a `D-37`. Puede hacerlo porque su respuesta no es un tema.
  'juegos/skayboy-y-poligirl.astro': 'tema-fijo',
  'letras-y-acordes/index.astro': 'rocola',
  'letras-y-acordes/[slug].astro': 'rocola',
  'letras-y-acordes/armar-cancionero.astro': 'rocola',
  'redondopedia/index.astro': 'rocola',
  // Los tres graves son este mismo archivo y salen `muda` por `graves.ts`; el resto, rocola.
  'redondopedia/[slug].astro': 'rocola',
};

/**
 * Parte una ruta en segmentos, tolerando la barra final o su ausencia.
 *
 * Mismo criterio que `esPantallaGrave()`: se compara por segmento y no con `includes()`,
 * porque una ruta que mañana contenga `quiz` adentro de otra palabra es otra ruta, y hacerla
 * callar por parecido sería decidir por adivinanza.
 */
function segmentosDe(ruta: string): string[] {
  return ruta.split('?')[0]!.split('#')[0]!.split('/').filter(Boolean);
}

/** ¿Esta ruta es una de las que no suenan nunca? */
export function esPantallaMuda(ruta: string): boolean {
  const s = segmentosDe(ruta);
  const ultimo = s[s.length - 1];
  if (ultimo === RUTA_INSTRUMENTO && s.length === 1) return true;
  return ultimo !== undefined && SLUGS_GRAVES.includes(ultimo);
}

/**
 * Qué puede hacer la cinta en esta ruta.
 *
 * **El silencio es el que se hereda**: lo que no está en la lista blanca cae a `cama`, que
 * no puede soplar nada. Una ruta inventada, una que todavía no existe, o una que alguien se
 * olvidó de clasificar, todas caen del mismo lado.
 */
export function modoEnRuta(ruta: string): ModoCinta {
  if (esPantallaMuda(ruta)) return 'muda';
  const s = segmentosDe(ruta);
  // El cuarto modo se resuelve por ruta exacta y no por lista blanca: es **una** pantalla
  // con **un** tema, y una regla generica invitaria a que manana entre otra sin decidirlo.
  if (s.length === 2 && s[0] === 'juegos' && s[1] === RUTA_TEMA_FIJO) return 'tema-fijo';
  for (const regla of RUTAS_CON_ROCOLA) {
    if (regla.acepta(s)) return 'rocola';
  }
  return 'cama';
}
