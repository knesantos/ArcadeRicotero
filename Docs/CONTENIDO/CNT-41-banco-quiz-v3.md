# CNT-41 — Banco del quiz, tercera versión, y el copy que lo acompaña

- **Fecha:** 2026-10-15 · **Ciclo:** 20 · **Decisión del ciclo:** `D-71` (la escribe el hilo principal).
- **Estado:** entregado. El JSON está en `src/data/quiz.json`; el copy de la sección 5 lo pasa
  el hilo principal a `src/lib/quiz/copy.ts`.
- **Consume:** `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`, `CNT-02`,
  `CNT-04`, `CNT-05`, `CNT-10`, `src/lib/quiz/fugas.test.ts`, `src/lib/pisos.test.ts`,
  `src/data/cancionero.json`, y las fichas `RES-02`, `RES-05`..`RES-09`, `RES-20`..`RES-22`,
  `RES-47`, `RES-48`, `RES-90`, `RES-100`, `RES-154`..`RES-171`.
- **Verificación (`D-12`, no la puedo correr):** `npm test`. Los que miran este banco son
  `src/lib/esquemas.test.ts`, `src/lib/pisos.test.ts`, `src/lib/quiz/fugas.test.ts`,
  `src/lib/quiz/banco.test.ts` y `src/lib/quiz/ronda.test.ts`.

## 1. Qué cambió y por qué

El banco pasaba el schema y los tests y se jugaba mal. Tres problemas:

1. **El fácil no era fácil.** Abría con leyendas de vida privada y con años de edición. Ahora
   fácil es lo que saca o deduce alguien que fue a una previa: un verso muy coreado, quién es
   Skay, de qué eran los buñuelos, qué hay en una tapa conocida. Ninguna leyenda y nada del
   memoir en fácil.
2. **Formulario.** Cada enunciado quedó en una idea, con la pregunta al final, casi todos por
   debajo de 100 caracteres. Cada explicación tiene que **regalar un dato más** y no repetir
   la pregunta. Ese dato es el premio de haber jugado.
3. **Monotonía.** Fuera los años de edición (cuatro), dos de los tres sellos, el orden de los
   discos y el conteo trampa. Del bloque de leyendas sobre la vida privada del Indio quedan
   dos (Parque Leloir, Rabolini) y las otras pasan a la explicación de `QZ-012`. Entra lo que
   vive la gente: la misa, el pogo, los trapos, los molinetes, los recitales de Córdoba y
   Tandil, la tapa de *Luzbelito*, Escobar.

Además:

- **`letras` tiene letras.** Tres versos de una línea sacados de `cancionero.json`
  (`QZ-047`, `QZ-048`, `QZ-058`) y tres títulos para completar (`QZ-039`, `QZ-049`, `QZ-050`).
  Las de "¿en qué disco salió?" (`QZ-042`, `QZ-043`) pasan a `discos`, y las de tapa del
  memoir (`QZ-026`, `QZ-028`, `QZ-029`) también.
- **Campo `disco`** en los 23 ítems que remiten a un disco. Lo dejé afuera de `QZ-057` (la
  respuesta es un disco del Indio solista, que no está en el enum) y de los que no hablan de
  un disco puntual. `sensibleA: ["tapa"]` marca solo los ítems cuya **pregunta** es sobre una
  tapa (`026`, `028`, `046`, `056`): la tapa que muestra la pantalla al revelar sale de `disco`
  y la cubre `CNT-01` en general.
- **`QZ-015` cambia de casilla, de leyenda a hecho.** Lo que se puntúa es lo que dijo el Indio
  en *Rolling Stone* 2007, verificado en `RES-08`. La leyenda es la premisa. Con el rótulo
  viejo, la insignia LEYENDA le decía al jugador que se preguntaba "qué se cuenta", y no era así.
- **Sesgo de largo:** la correcta es la única opción más larga en 1 de 44 (`QZ-031`).

### Conteo

| | fácil | media | difícil | total |
|---|---|---|---|---|
| historia | 3 | 4 | 4 | 11 |
| discos | 4 | 4 | 3 | 11 |
| letras | 4 | 3 | 4 | 11 |
| mitología | 3 | 4 | 4 | 11 |
| **total** | **14** | **15** | **15** | **44** |

Piso de `US-01` cumplido (40 jugables, 10 por categoría, 10/15/15). Al menos dos fáciles por
categoría (`fugas.test.ts`). Leyendas: 7. Testimonios: 3 (`026`, `028`, `029`).

## 2. Retirados (18)

| ID | Qué preguntaba | Por qué sale |
|---|---|---|
| `QZ-001` | Año de *Gulp!* | Pregunta de año. El banco deja de preguntar años |
| `QZ-002` | Disco de 1986 | De año, y la respuesta (*Oktubre*) repetía la de `QZ-042` |
| `QZ-003` | Sello de *Gulp!* | Tres de sello eran demasiadas; queda `QZ-005` |
| `QZ-006` | Año de *Momo Sampler* | De año |
| `QZ-007` | Disco de 1988 | De año, y marcada fácil sin serlo |
| `QZ-008` | Sello de *La mosca y la sopa* | De sello, ver `QZ-003` |
| `QZ-009` | Qué disco vino después | Orden cronológico, puro formulario |
| `QZ-010` | Cuántos discos de estudio | `RES-02` la marca como trampa (9 o 10) |
| `QZ-011` | Ciudad de la leyenda de «Ji ji ji» | Leyenda oscura en fácil. Mar del Plata pasa a `QZ-015` |
| `QZ-013` | La jauría | Vida privada; pasa a la explicación de `QZ-012` |
| `QZ-016` | Colegio Militar | Vida privada, leyenda oscura en fácil |
| `QZ-017` | El disfraz | Vida privada; pasa a la explicación de `QZ-012` |
| `QZ-018` | Patricio Rey vivía en Salta | Tercer ítem del mismo relato; Salta pasa a `QZ-020` |
| `QZ-019` | Pancho Silva | Nombre para adivinar contra tres inventados |
| `QZ-024` | Último recital del Indio (Olavarría) | Se pisaba con `QZ-054`; y a cuatro meses de la muerte del Indio, una respuesta que es esa noche suma peso y no juego. `CNT-04` la permitía, no la exigía |
| `QZ-030` | Caja de whisky de *Último bondi* | Cuarto ítem de ese disco, y solo lo saca quien leyó el libro |
| `QZ-033` | Videoclip del Capitán Buscapina | Memoir, *Último bondi* otra vez; el dato pasa a `QZ-026` |
| `QZ-038` | El saludo de Skay en Quilmes | Su respuesta es la del verso fácil `QZ-047`; y la relación Indio–Skay es tema sensible desde el 5-jun-2026 (`RES-152`). El `trackId` pasa a `QZ-047` |

## 3. Se quedan, reescritos (22)

`004 005 012 014 015 020 021 022 023 025 026 028 029 031 032 035 036 039 040 041 042 043`.
Cambios de nivel: `022` fácil→media, `023` media→difícil, `012` media→difícil, `039`
difícil→media, `040` media→difícil. Cambios de categoría: `026`, `028`, `029` historia→discos;
`040`, `042`, `043` letras→discos. Bulacio (`025`) queda en registro 3 entero.

## 4. Nuevos (22, `QZ-044`..`QZ-065`)

| ID | Cat. | Nivel | Qué pregunta | Casilla | Fuente |
|---|---|---|---|---|---|
| `044` | historia | fácil | Qué toca Skay | hecho | `RES-05`, `RES-20`, `RES-06` |
| `045` | historia | fácil | De qué eran los buñuelos del debut | hecho | `RES-05` |
| `046` | discos | fácil | Qué hace de «ojo idiota» en la tapa | hecho | `RES-06`, `RES-22` |
| `047` | letras | fácil | «El futuro llegó hace rato» | hecho | `RES-20`, cancionero |
| `048` | letras | fácil | «Banderas en tu corazón, yo quiero verlas» | hecho | `RES-20`, `RES-157`, cancionero |
| `049` | letras | fácil | «Vencedores…» | hecho | `RES-20` |
| `050` | letras | fácil | «Mi perro…» | hecho | `RES-20`, `RES-48` |
| `051` | mitología | fácil | La misa | hecho | `RES-07` |
| `052` | mitología | fácil | El pogo más grande del mundo | hecho | `RES-158` |
| `053` | mitología | fácil | Quién es Patricio Rey | hecho | `RES-22`, `RES-05` |
| `054` | historia | media | Último recital de la banda: Córdoba | hecho | `RES-05`, `RES-100` |
| `055` | historia | media | Cuál no hizo nunca: firmar con multinacional | hecho | `RES-07`, `RES-05`, `RES-02` |
| `056` | discos | media | La vela de *Luzbelito* | hecho | `RES-168`, `RES-169`, `RES-06` |
| `057` | discos | media | Cuál no es de los Redondos: *Porco Rex* | hecho | `RES-47`, `RES-02` |
| `058` | letras | media | «¿Y cuánto vale dormir tan custodiado?» | hecho | `RES-20`, `RES-90`, cancionero |
| `059` | letras | media | «Me matan, Limón!» y Escobar | hecho | `RES-170`, `RES-20` |
| `060` | mitología | media | Los trapos | hecho | `RES-156` |
| `061` | mitología | media | 28 de diciembre, Día de los Inocentes | leyenda | `RES-05` |
| `062` | mitología | media | Abrían los molinetes | leyenda | `RES-155`, `RES-154` |
| `063` | mitología | difícil | El pogo nació en Paladium | leyenda | `RES-159`, `RES-154` |
| `064` | historia | difícil | Tandil 97, única conferencia televisada | hecho | `RES-05` |
| `065` | historia | difícil | El Lozanazo | hecho | `RES-05` |

Dos que el revisor tiene que mirar con lupa están en el reporte al hilo principal: `QZ-053`
(hecho firme contra la leyenda de Rocambole) y `QZ-061` (la premisa es leyenda, la respuesta es
un dato de calendario).

## 5. El copy nuevo del quiz

Reemplaza `CNT-05` B1 y B2, y suma piezas que no existían. Lo demás de `CNT-05` y `CNT-10`
sigue en pie.

### B1' — Acierto (6 variantes, registro 1, el único grito del sitio)

| ID | Texto |
|---|---|
| `B1.1` | ¡Adentro! |
| `B1.2` | ¡La clavaste! |
| `B1.3` | ¡Como en el disco! |
| `B1.4` | ¡De memoria! |
| `B1.5` | ¡Esa te la sabías! |
| `B1.6` | ¡Justo en el hueso! |

Sale «¡Sabés, che!» (la regla de voz 3.4 veta el *che* de disfraz) y salen «¡Ahí la tenés!» y
«¡De una la sacaste!», que suenan a app. Todas tienen menos de cuatro palabras. «Como en el
disco» y «en el hueso» meten una imagen física (regla de voz 4.3).

### B2' — Error (6 variantes, sin «mal», sin «perdiste»)

| ID | Texto |
|---|---|
| `B2.1` | No era esa. |
| `B2.2` | Esa se te escapó. |
| `B2.3` | Pasó de largo. |
| `B2.4` | Te falta escuchar disco. |
| `B2.5` | La próxima la sacás. |
| `B2.6` | Quedó para la vuelta. |

Sin signos y en voz baja, porque el que pierde la vida ya lo ve en el marcador. `B2.4` es el
ejemplo textual de la regla de voz 4.4, áspero y de adentro. Sale «Ni todo el mundo se la
sabe», que consolaba de afuera.

### L' — Aviso de escalón (rótulo en registro 3 + una línea que canta)

| ID | Rótulo | Línea |
|---|---|---|
| `L1` | NIVEL MEDIA | Ahora pregunta el que tiene los discos. |
| `L2` | NIVEL DIFÍCIL | Ahora pregunta la vieja guardia. |

El rótulo queda como estaba en `CNT-10` (`avisoEscalon()`); la línea es nueva y va debajo. Las
dos líneas son espejo: dicen quién pregunta y no qué tan difícil es, porque eso ya lo dice el
rótulo.

### A' — Portada, la regla de las dos líneas

| ID | Qué | Texto |
|---|---|---|
| `A1` | La que canta | Entrá, sepas lo que sepas. *(queda la de `copy.ts`)* |
| `A2'` | La que nombra | Preguntas sobre los Redondos. Tenés tres vidas: arranca fácil y se pone bravo. |

Prueba de la regla: si se tapa `A1`, `A2'` sola dice qué es y cómo se juega. Reemplaza al
subtítulo de las cuatro categorías, que nombraba el contenido y no el juego. «Bravo» es la
única palabra de jerga de la pantalla.

### K — Racha (registro 1, sin anglicismos)

| ID | Aciertos seguidos | Texto |
|---|---|---|
| `K1` | 3 | TRES AL HILO |
| `K2` | 5 | CINCO AL HILO |
| `K3` | 10 | DIEZ AL HILO |

«Al hilo» es rioplatense y se entiende sin saber nada de la banda. Va en mayúscula como sello,
igual que los rótulos de nivel, y no lleva exclamación: el grito ya lo dio el acierto.

### E — Desenlaces

**Quedan los de `CNT-10`.** «Se te apagaron las tres vidas.» / «Llegaste con las tres vidas
prendidas.» / «Te vas con las vidas que te quedan.» Comparten una imagen física, no explican,
ninguno grita, y ya están en `copy.ts`. Cambiarlos no le suma nada a esta tanda.

## 5 bis. Ajustes por REV-22

El informe de `revisor` me llegó por el hilo principal. El conteo no cambia: 44 jugables,
14/15/15, 11 por categoría, porque `QZ-066` entra en el mismo casillero (historia, difícil)
que deja `QZ-064`.

| FIND | Ítem | Qué se hizo |
|---|---|---|
| `FIND-141` (alta) | `QZ-064` | **Retirada.** El memoir pone la única conferencia televisada en Olavarría 1997, `RES-05` la pone en Tandil, y `RES-176` lo deja sin resolver: es una respuesta que depende de qué fuente mires. No la paso a testimonio porque no tengo la ubicación del pasaje en el libro, y `testimonio.ubicacion` no se inventa. La reemplaza **`QZ-066`**: el primer recital fuera del país, Montevideo 1989 (`RES-05`, verificado) |
| `FIND-142` | `QZ-055` | Sale «ni televisión» de la explicación |
| `FIND-143` | `QZ-005` | Ahora pregunta el **nombre del sello propio** (Patricio Rey Discos) y no el disco, así que ya no repite respuesta ni opciones con `QZ-026`. El disco pasa a la explicación |
| `FIND-144` | `QZ-021` | «unas 80.000 personas cada una, según se cuenta». Sale «se confunden seguido» |
| `FIND-145` | `QZ-060` | Sin «barrio» ni «pueblo»; «entre 2008 y 2009» |
| `FIND-146` | `QZ-045` | Sale la frase de Patricia Rey. Era fácil, y la versión del memoir (recetario de Postres Royal, cocinera ficticia) contradice la de `RES-05`. El premio pasa a ser el nombre del sultán, Edgardo «el Docente» Gaudini |
| `FIND-147` | `QZ-050` | «Terminó siendo el tema de 1991, el año de la consagración masiva». Sale «la vuelta» |
| `FIND-148` | `QZ-062` (y la opción de `QZ-064`, retirada) | «show» → «recital» (`D-17`) |
| `FIND-149` | `QZ-055` | Las opciones pasan a sustantivos parejos («Un contrato con una multinacional» · «Un recital en el estadio de River» · «Discos con sello propio» · «Un recital en Montevideo»). La correcta empata en largo (33) con la de River. Barrí el banco: ninguna otra opción arranca en infinitivo |
| `FIND-152` | `QZ-020`, `QZ-063` | Los rótulos ya no arrancan con «Leyenda», porque la pantalla antepone «Esto es leyenda:». Mismo arreglo en `QZ-012` y `QZ-014`, que decían «Leyenda urbana…»: pasan a «Rumor sobre el Indio…» |
| fuga nueva (hilo principal) | `QZ-055` → `QZ-066` | La opción «Un recital en Montevideo» se revelaba como algo que la banda sí hizo y contestaba a `QZ-066`, que sale siempre después. Pasa a «Un recital en la cancha de Huracán» (34 caracteres, `RES-05`). `QZ-021` pregunta el año de Huracán, no el lugar |
| diferido | `QZ-057` | Sale «y la trampa era esa» (explicaba el chiste, voz §4.6) |

**Para `fugas.test.ts`:** el par `['QZ-026','QZ-005']` de `MENCION_SIN_RESPUESTA` ya no hace
falta, y tampoco `['QZ-030','QZ-005']` ni `['QZ-033','QZ-005']`. El texto de `QZ-005` nombra
*Último bondi a Finisterre*, que ahora es la respuesta de `QZ-026`, pero `005` es difícil y
`026` media, así que el test no lo mira. Los otros seis pares nombran ítems retirados (`QZ-002`, `QZ-009`,
`QZ-033`). **La lista entera puede quedar vacía.**

## 6. Pedidos a `investigador` (no bloquean nada)

- **`RES-` nuevo:** `trackId` de Spotify de «Juguetes perdidos» (`QZ-048`) y de «Vamos las
  bandas» (`QZ-058`), como en `RES-140`.
- **Ubicación en el PDF del memoir** del pasaje de Rocambole sobre el Patricio Rey real. Con
  eso, `QZ-020` puede pasar de leyenda a testimonio, que es su casilla más exacta.
- **El esclavo de *Oktubre*** (`RES-06`, sigue "reportado"): si se cierra, hay una pregunta
  difícil de primera esperando.
