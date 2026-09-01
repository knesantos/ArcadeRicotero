# REV-09 — Los cuatro juegos de la v1 contra sus criterios de aceptación

> Rol dueño: `revisor`. Tarea: `T-174` del ciclo 10. Fecha: **2026-09-01**.
> Verifica: `US-01`..`US-04` y sus criterios en `Docs/PRODUCTO/PRD-alcance-v1.md`, contra
> el repo en el commit de cierre del ciclo 10.
> Produce: `FIND-34`..`FIND-37`.

---

## ⚠ Lo primero, porque condiciona todo lo que sigue

**Esta revisión la escribió el hilo principal, que también construyó todo lo que revisa.**

`Docs/EQUIPO.md` define a `revisor` como el rol que verifica *"con contexto fresco y sin
haber armado la pieza revisada"*, y esta vez esas dos condiciones no se cumplen. El usuario
pidió el ciclo entero en una ráfaga y las quince tareas salieron de la misma mano.

**No lo escribo como disculpa: lo escribo porque cambia cuánto vale este documento.**
`REV-08` dejó la lección hace cinco días y es exactamente la que se está incumpliendo acá:

> *"Toda verificación de contenido generado tiene que hacerse con un método distinto del
> que generó, o no verifica nada."*

**Lo que hice para que no sea un trámite**, sabiendo que no alcanza:

- Revisé **contra el texto de los criterios**, releídos uno por uno del PRD, no contra lo
  que recordaba haber construido.
- Medí en el navegador y en el disco. **Un hallazgo se me cayó midiendo** (el aviso de
  sonido de `US-02`: iba a reportarlo faltante y estaba puesto y visible).
- Busqué a propósito en lo que **no** tocó este ciclo, que es donde mi ceguera es menor.

**Lo que esto no puede darte:** un juicio independiente sobre las piezas del frente A, que
son mías de punta a punta. Si alguna vez conviene correr `revisor` de verdad sobre algo,
es sobre `src/lib/escalonar.ts` y `catalogo().dificultad`.

---

## Veredicto

> ## 🟢 La v1 se puede declarar, con una salvedad escrita y un par de ojos pendiente.
>
> **Veredicto al abrir la revisión: 🟡 no se podía.** Los cinco pisos estaban cumplidos y
> los cuatro juegos se jugaban de punta a punta, pero **tres criterios de aceptación
> describían un producto que ya no existe** (`FIND-35`) — condicionaban a Spotify y a un
> cerrojo de derechos que `D-22` y `D-14` habían retirado. Contra esa vara no se podía
> aprobar ni rechazar.
>
> **`FIND-34`, `FIND-35` y `FIND-36` quedaron cerrados en esta misma ráfaga**, porque el
> usuario pidió el ciclo entero y las tres eran de media hora. Los tres criterios están
> reescritos con su redacción vieja a la vista.
>
> **Lo que queda, y no es de trámite:**
>
> 1. **La salvedad de `BR-18` (g)**, que está escrita y decidida: sin la clave de YouTube
>    `US-02` no escalona, y el mínimo de 8 Fáciles es 0. La v1 se declara **sabiendo eso**,
>    no ignorándolo.
> 2. **`FIND-37`**: nada de este ciclo lo miró alguien que no lo construyera. Antes de
>    dar la v1 por cerrada de verdad, conviene que `revisor` pase por el frente A.

---

## Lo que se verificó, y pasa

| Historia | Criterio | Cómo lo verifiqué | |
|---|---|---|---|
| `US-01` | 1 — el primero es Fácil | `armarRonda` filtra el pozo `facil` y tira `RondaImposible` si no hay; `ronda.test.ts` | ✅ |
| `US-01` | 2 — tres incorrectas y se termina | `vidas.ts` + sus 22 pruebas | ✅ |
| `US-01` | 3 — dato verificable | `fuentes` es `required` en `quiz.schema.json`, corrido sobre los 43 ítems | ✅ |
| `US-01` | 4, 5, 6 — escalón, victoria, retirada | `vidas.test.ts`, y jugado en el ciclo 9 | ✅ |
| `US-02` | 2 — avisa del sonido **antes** de arrancar | **Medido en el navegador**: `.aviso-sonido` existe, es visible y vive en `#portada` | ✅ |
| `US-03` | 1 y 2 — la escalera muestra menos letra | `BR-03` en `banco.ts`, con pruebas por nivel | ✅ |
| `US-03` | 3 — nunca más de 5 versos | tope en `banco.ts`, con prueba | ✅ |
| `US-04` | 1 — múltiple choice, nunca tipeo, crédito a Rocambole | los 10 ítems traen `opciones`; el crédito sale en el HTML construido | ✅ |
| `US-04` | 2 — jugable de punta a punta con 10 | `banco.test.ts` guarda el piso | ✅ |
| Pisos | los cinco | `pisos.test.ts` + `banco.test.ts` — **ahora sí los cinco** (`FIND-34`) | ✅ |

**Y lo que arregló este ciclo, verificado aparte:** `US-02` reparte escalonado
(`escalonar.test.ts`, 12 pruebas) y su catálogo trae `dificultad` en los 105
(`catalogo.test.ts`). Medido en el navegador: llegan 105 temas, 95 jugables, los 105 en
`dificil` — la degradación declarada de `D-27`, no un campo faltante.

---

## FIND-34 — Los dos pisos que más costaron eran los únicos sin guarda

**Severidad: alta. Estado: arreglado en este ciclo.**

`src/lib/pisos.test.ts` guardaba `US-01` y `US-05`; `US-04` tenía la suya en
`tapa/banco.test.ts`. **`US-02` y `US-03` no tenían ninguna**, y el archivo llevaba un
comentario afirmando:

> *"`US-02` — piso 30 temas. **Hoy: 0.** (…) `US-03` — piso 15 versos. **Hoy: 0** en
> `listo`."*

Los dos llegaron a su piso el **2026-08-27** —95 y 21— y el comentario siguió cinco días
describiendo un repo que ya no existía. El propio encabezado del archivo fija la regla que
se incumplió: *"se prenden el día que se cumplen, en el mismo ciclo que las cumpla"*.

**Por qué importa más que un comentario viejo:** borrar un mp3 de `public/audio/fragmentos`
bajaba el piso de `US-02` **sin que nada avisara**. Los dos pisos que más trabajo costaron
—cuatro ciclos el del audio— eran los dos que nadie miraba.

**Arreglado:** las dos guardas están prendidas y pasan. La de `US-03` además exige **al
menos un verso `facil`**, sin el cual `armarRonda` no puede abrir la partida.

---

## FIND-35 — Tres criterios de la v1 describen mecanismos que ya se retiraron

**Severidad: bloqueante para declarar la v1. Dueño: `producto`. Estado: arreglado en esta
misma ráfaga — ver la nota al pie de este hallazgo.**

Es el hallazgo del ciclo, y no lo vi leyendo código: lo vi leyendo los criterios de
aceptación al lado de `Docs/DECISIONES.md`.

| Criterio | Qué condiciona | Qué pasó |
|---|---|---|
| `US-02` c3 | *"cuando intenta escuchar el tema completo **vía Spotify** al revelar (…) si no tiene la app o no tiene Premium"* | **`D-22` sacó Spotify.** El sitio sirve el tema entero en mp3. En `partida-tema.ts` no queda **una sola** mención a Spotify |
| `US-03` c3 | *"el juego completo **no se publica** hasta que la nota de derechos de `contenido` lo habilite explícitamente"* | **`D-14` sacó ese cerrojo**, y descarta explícitamente *"sostener el gate de `D-07`"* |
| `US-04` c3 | *"es el primero en quedar fuera de la versión publicada si la nota de derechos no cubre el uso de tapas reales"* | Ídem `D-14`. **Y el sitio está publicado con las tapas adentro** desde hace días |

**Por qué es bloqueante y no cosmético.** Un criterio de aceptación es la vara con la que
se declara algo terminado. Dos de estos tres dicen *"esto no se publica hasta que…"* sobre
un juego que **ya está publicado**, y el tercero promete un desenlace de una integración
que no existe. Contra esa vara, la v1 no se puede aprobar ni rechazar: **no mide este
producto.**

No hay nada roto en pantalla. `D-14` y `D-22` son decisiones tomadas con evidencia y el
sitio las cumple. Lo que quedó viejo es el papel — y en este proyecto el papel es lo que
decide cuándo algo está listo.

**Lo que pedía, y se hizo en esta misma ráfaga.** Los tres criterios están reescritos en
`PRD-alcance-v1.md`, cada uno con su redacción anterior citada y el motivo:

- **`US-02` c3** habla del **mp3** en vez de Spotify. El desenlace que protegía —*poder
  cerrar la partida aunque el camino al tema entero falle*— sigue igual, y ahora el caso
  borde es real: hay 95 fragmentos contra 105 temas, así que hay temas sin entero.
- **`US-03` c3** conserva el tope de 5 versos, que sí es una regla viva de `BR-03`, y
  retira la condición de publicación.
- **`US-04` c3** conserva el **orden de corte** —este juego se cae primero—, y cambia el
  disparador: antes una nota que nunca se cerró, ahora un reclamo, que es el hecho del que
  habla `D-14`.

**Ojo con quién lo escribió:** los tres los reescribí yo, en el mismo tirón en que los
encontré. Es `FIND-37` otra vez. La reescritura no inventa alcance —cada una conserva lo
que el criterio protegía y retira solo lo que una decisión ya había retirado— pero es una
decisión de `producto` tomada por el hilo principal.

---

## FIND-36 — `US-02` criterio 1 afirma algo que hoy no es cierto

**Severidad: media. Dueño: `producto`. Estado: arreglado.**

El criterio arranca: *"Given un jugador arranca un ítem nuevo, **que por `BR-01` es de
nivel Fácil si es el primero de la partida**"*.

Hoy no lo es: sin mediciones de escuchas los 95 caen en `dificil` (`D-27`), así que el
primero es difícil como todos. El ciclo 10 puso el mecanismo y `BR-18` apartado (g) decide
que eso **no frena** el "Listo" — pero esa decisión vive en `BR-18`, y **el criterio de
`US-02` sigue afirmando la versión que no se cumple.**

**Arreglado:** el criterio 1 lleva ahora la salvedad en la misma frase, apuntando a
`BR-18` (g). Quien lea el criterio solo ya no lee algo falso.

---

## FIND-37 — Esta revisión no la hizo `revisor`

**Severidad: de método. Sin arreglar, y no se puede arreglar en esta ráfaga.**

Está desarrollado arriba. Lo dejo como hallazgo numerado y no como nota al pie a propósito:
es la tercera vez en tres ciclos que el proyecto aprende lo mismo por el mismo lado, y un
hallazgo se busca la próxima vez, una nota al pie no.

**Lo que pido:** que antes de declarar la v1, `revisor` mire **al menos** el frente A
—`src/lib/escalonar.ts`, `catalogo().dificultad`, y las guardas nuevas— con contexto fresco.
Es la parte de este ciclo sobre la que mi juicio vale menos.

---

## Lo que quedó afuera de esta revisión, y por qué

- **`US-05` (Redondopedia) y `US-06`/`US-07`.** Fuera del "Listo" de la v1 por `D-05`. El
  piso de `US-05` sí está guardado.
- **La cuota de 8 Fáciles de `US-02`.** No la reviso como incumplimiento porque `BR-18` (g)
  la resolvió por escrito **hoy**, en este mismo ciclo. Que la decisión sea reciente y mía
  es justamente por lo que `FIND-37` pide otro par de ojos.
- **Los dos insumos que espera el usuario:** la clave de YouTube (`T-165`) y la casilla de
  correo (`T-153` del ciclo 9). Ninguno bloquea la v1; el primero enciende el escalonamiento
  real de `US-02` y `US-07`.
