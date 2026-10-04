# CNT-29 — El contraste al volver

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04, ciclo 18.
- **Estado:** entrega completa, **versión 2 (vuelta 1 de arreglos, 2026-10-04)**: cambia la
  forma de la segunda oración (`Con la tuya comparte: …`, sin comillas y sin tres "con"
  seguidos) y el polo de oscuridad (`con lo propio`, `CNT-30` §6.1). `copy.ts` tiene todavía la
  versión 1: el pedido al hilo principal está en
  `Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-1-dos-ejes.md`. Cierra lo que `CNT-26` §6
  puntos 5 y 6 dejó pendiente (el puntero decía `CNT-29`) y lo que `UX-06` §6 pedía sin copy.
- **Consume:** `D-57` punto 11 (la postal y la línea neutra de contraste), `UX-06` §6, `BR-17`
  (ningún resultado mejor que otro), `ADR-02` (el desafío lo escribe quien manda el enlace, no es un
  hecho), `CNT-26` §2.3, `CNT-30` (§5 los nombres, §6 la tabla de cadenas), `D-17`,
  `.claude/rules/voz-ricotera.md`.
- **Produce:** las cuatro líneas de contraste, la línea de llegada de la Pantalla 0 con la
  traducción de la manera del amigo, y la matriz de qué caso es cada par. IDs nuevos: ninguno.
- **Reemplaza** el `CONTRASTE` provisional de `src/lib/dos-ejes/copy.ts`, que decía
  "comparten la primera mitad", "la segunda mitad" y "la que queda enfrente".

## 1. Qué es, y qué tiene que cuidar

Cuando alguien llega por el enlace de un amigo, juega y termina, el resultado puede decirle cómo
se parece su manera a la de quien se lo mandó. **Una línea, debajo de la grilla de las cuatro
maneras**, en la que la manera del amigo ya está marcada con el sello `Quien te lo mandó`.

Lo único que importa de esa línea es lo que no hace:

1. **No gana ni pierde.** Ningún verbo de superar, igualar, acercarse, alejarse, quedar mejor ni
   peor. Dos maneras iguales no son "una coincidencia feliz" ni dos opuestas "un desencuentro":
   son dos maneras (`BR-17`; `UX-06` §6 pide la misma frase neutra para los cuatro).
2. **No tiene género.** Se dice "quien te lo mandó": no "el que", no "tu amigo", no "le salió
   al que te lo mandó".
3. **No es un hecho sobre el otro.** El nombre de la manera del amigo viaja en el enlace y
   cualquiera puede editarlo (`ADR-02`). La primera oración lo dice con el verbo de lo que cuenta
   alguien ("le salió"), no con el de lo que se sabe.
4. **Misma estructura en los cuatro casos.** Si un caso tuviera una forma distinta, el jugador
   leería la diferencia de forma como una diferencia de valor.

## 2. Los cuatro casos

El caso lo calcula el código desde los dos ids, sin números ni conteos:

- **misma** — los dos ids son iguales.
- **`luz-oscuridad`** — comparten el polo de `luz-oscuridad` y no el de `orden-caos`.
- **`orden-caos`** — comparten el polo de `orden-caos` y no el de `luz-oscuridad`.
- **opuesta** — no comparten ninguno: es la que queda en diagonal en la grilla de `D-57` punto 7.

La matriz completa (tuyo en filas, el del amigo en columnas):

| | `CU-1` luz+orden | `CU-2` luz+caos | `CU-3` oscuridad+orden | `CU-4` oscuridad+caos |
|---|---|---|---|---|
| **`CU-1`** | misma | `luz-oscuridad` (luz) | `orden-caos` (orden) | opuesta |
| **`CU-2`** | `luz-oscuridad` (luz) | misma | opuesta | `orden-caos` (caos) |
| **`CU-3`** | `orden-caos` (orden) | opuesta | misma | `luz-oscuridad` (oscuridad) |
| **`CU-4`** | opuesta | `orden-caos` (caos) | `luz-oscuridad` (oscuridad) | misma |

Cada fila de la matriz da cuatro casos distintos: nadie cae en el mismo caso dos veces. Es lo que
hace que la línea no pueda leerse como un puntaje.

## 3. Las cuatro líneas

**El molde, igual en los cuatro:**

> **A quien te lo mandó le salió «`${suyo}`». Con la tuya `[no] comparte`: `[…]`.**

Dos oraciones. La primera es **idéntica en los cuatro** (nombra la manera del amigo). La segunda
tiene la misma forma —"Con la tuya comparte: …" o "Con la tuya no comparte: …"— y dice qué
polos de *tu* línea aparecen en la del otro, con las mismas palabras que la línea que nombra del
resultado (`CNT-30` §6): *con la gente, con lo propio, con plan, sobre la marcha*.

**Por qué cambió la forma (versión 2).** La versión 1 decía `Con la tuya, comparte «con la gente»
y «con plan».`: tres "con" seguidos, donde el primero (*comparte con*) se lee como "comparte con
la gente" y no como "comparte lo que se llama «con la gente»". Con los dos puntos y sin comillas
el verbo termina antes de que empiecen los polos, y los polos se leen como lo que son: la línea
que nombra del resultado, dicha otra vez.

| Caso | Función | Texto exacto |
|---|---|---|
| **misma** | `CONTRASTE.misma(suyo, lo, oc)` | `A quien te lo mandó le salió «${suyo}». Con la tuya comparte: ${lo}, ${oc}.` |
| **`luz-oscuridad`** | `CONTRASTE['luz-oscuridad'](suyo, lo)` | `A quien te lo mandó le salió «${suyo}». Con la tuya comparte: ${lo}.` |
| **`orden-caos`** | `CONTRASTE['orden-caos'](suyo, oc)` | `A quien te lo mandó le salió «${suyo}». Con la tuya comparte: ${oc}.` |
| **opuesta** | `CONTRASTE.opuesta(suyo, lo, oc)` | `A quien te lo mandó le salió «${suyo}». Con la tuya no comparte: ${lo} ni ${oc}.` |

`lo` y `oc` son **los polos de la manera del jugador**, en minúscula y sin punto
(`polosEnFrase`, `CNT-30` §6.1): en los casos con un polo compartido es ese polo, y en la
opuesta son los dos polos de la tuya, que el otro no tiene. Con eso la función tiene siempre los
mismos tres datos (`suyo`, `lo`, `oc`) y un caso que decide qué usar.

**Cuatro ejemplos, uno por caso, para leer de corrido:**

- *Misma* (tuyo `CU-1`, suyo `CU-1`): A quien te lo mandó le salió «Mesa larga a las nueve». Con la
  tuya comparte: con la gente, con plan.
- *Un polo de `luz-oscuridad`* (tuyo `CU-1`, suyo `CU-2`): A quien te lo mandó le salió «Ronda en
  cualquier esquina». Con la tuya comparte: con la gente.
- *Un polo de `orden-caos`* (tuyo `CU-3`, suyo `CU-1`): A quien te lo mandó le salió «Mesa larga a
  las nueve». Con la tuya comparte: con plan.
- *Opuesta* (tuyo `CU-3`, suyo `CU-2`): A quien te lo mandó le salió «Ronda en cualquier
  esquina». Con la tuya no comparte: con lo propio ni con plan.

### La prueba

1. **Los cuatro en fila.** Mismo molde y mismo arranque. El largo total va de 15 a 23 palabras
   según el nombre del amigo y los polos que se citen: la línea de un polo es la más corta y la de
   la opuesta la más larga, pero la diferencia sale de cuántos polos se nombran y no de cuánto
   se dice, y los cuatro nombres de manera miden entre 4 y 5 palabras. No se lee como jerarquía.
2. **¿Alguno gana o pierde?** Ninguno: el único verbo es *compartir*, y *no compartir* es lo
   contrario de compartir, no el fracaso de nada. Si `REV-19` lo lee como un desencuentro, la
   salida es una sola palabra: `Con la tuya cada una tiene lo suyo: ${lo}, ${oc}.`, que dice lo
   mismo sin el "no". No la dejo escrita como principal porque cambia la forma de la oración y
   sería el único de los cuatro que arranca distinto.
3. **¿Tiene género?** *Quien te lo mandó* y *la tuya* (por "manera") no lo tienen. Los nombres
   de las cuatro maneras tampoco.
4. **¿Se entiende sin haber leído el resto?** Sí: nombra la manera del otro, dice qué comparte con
   la del jugador, y las palabras después de los dos puntos son las mismas que están debajo del
   nombre en la tarjeta que acaba de ver.
5. **Registro.** R3 entero: seca, dice qué hay y se calla. No lleva imagen, ni chiste, ni
   suspensivos, ni signo de exclamación. El único adorno posible es el que ya trae la grilla.

## 4. La línea de llegada de la Pantalla 0

Es `PANTALLA_0.desafio(nombre, polos)`: lo que lee quien llega por un enlace **sin pasar por la
postal** (los `?g=dos-ejes&r=CU-n` viejos siguen andando, `D-57` punto 11). Dos oraciones, la
primera es R3 (lo que dice el otro) y la segunda R1 (le habla al que llega):

> **A alguien le salió «`${nombre}`»: `${polos}`. ¿Y a vos?**

`polos` es la línea traducida, **en minúscula y sin punto** (`polosEnFrase`), y es la traducción de
X que pidió el encargo. Los cuatro textos:

| `r` en el enlace | Texto exacto |
|---|---|
| `CU-1` | A alguien le salió «Mesa larga a las nueve»: con la gente, con plan. ¿Y a vos? |
| `CU-2` | A alguien le salió «Ronda en cualquier esquina»: con la gente, sobre la marcha. ¿Y a vos? |
| `CU-3` | A alguien le salió «Radio bajita, misma hora»: con lo propio, con plan. ¿Y a vos? |
| `CU-4` | A alguien le salió «Mochila liviana, sin mapa»: con lo propio, sobre la marcha. ¿Y a vos? |

- **Es la misma frase para los cuatro**, como pedía `CNT-26` §2.3: no hay verbo de ganar ni de
  superar, y las dos puntas se dicen con el mismo orgullo (*con la gente* y *con lo propio*
  no se pueden poner en orden: misma forma, sin persona y sin palabra de trámite).
- **Con el nombre del amigo,** si la isla todavía lee `n`: `A ${amigo} le salió «…»` y el resto
  igual.
- **Lo que esta línea ya no lleva**, y es una decisión que hay que mirar: `CNT-26` §2.3 le puso
  una tercera oración (*"Diez preguntas de cómo sos, no de cuánto sabés"*) porque la isla pisaba
  el subtítulo y le sacaba la tranquilidad a la pantalla que más la necesita. Acá la tercera
  oración se fue porque ahora la línea dice qué es X y el peso lo carga el subtítulo nuevo
  (*"No hace falta saber nada ni haber ido"*). **Pero si la isla sigue pisando `#subtitulo`, hay
  que devolverle el cierre**: `… ¿Y a vos? No hace falta saber nada.` La otra salida es que
  el desafío vaya en una línea propia encima del subtítulo y no lo pise. No las dos.

## 5. Lo que descarté

- **`comparten la primera mitad` / `la segunda mitad`** (lo provisional): obliga a contar
  mitades de una línea que casi nadie lee, y no dice cuál es cuál.
- **`la que queda enfrente`** para la opuesta: es una imagen espacial de la grilla y se pierde si
  la grilla cambia de forma en la mesa (donde se lee de otro modo).
- **`se miran de frente`**: la más linda de las opuestas, y la descarté por registro: el contraste
  es R3, y R3 no actúa (`voz-ricotera.md` §5).
- **Un "¡coinciden!"** o cualquier exclamación: el único grito del sitio es el acierto (`D-33`),
  y acá no hay acierto.
- **Nombrar al amigo por su nombre de manera en la segunda oración** (`A quien te lo mandó le salió
  «X», que con la tuya…`): la repetición de X en las dos oraciones hacía la línea más larga sin
  decir nada nuevo.

## 6. Cómo se verifica

No tengo con qué correrlo (`D-12`):

```
node --test src/lib/voz.test.ts
```

`voz.test.ts` llama a las funciones del copy con comodines (`1` y `'X'`) y les aplica los
anglicismos, las fórmulas de folleto y cómo se nombra a la gente: las cuatro líneas pasan. **No
mira** que la estructura sea igual en los cuatro ni que no haya verbo de ganar. Eso lo lee
`REV-19`, y la regla es esta: *si dos de las cuatro no empiezan igual, está mal.*

## 7. Pendientes

- **Código del hilo principal:** la función de caso (a partir de los ids), los tres parámetros de
  `CONTRASTE`, y que los polos del jugador lleguen en minúscula.
- **`experiencia` (`UX-36`):** dónde va la línea (debajo de la grilla), y que se muestre solo
  cuando el jugador llegó por un enlace con una `r` válida.
- Ninguna ficha `RES-XX` pendiente: la línea no afirma nada fuera del propio juego.
