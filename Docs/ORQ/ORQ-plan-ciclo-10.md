# ORQ — Plan del ciclo 10: la v1 cumple sus pisos y todavía no está lista

> **Escrito por el hilo principal** con `/ciclo`, el 2026-09-01, sin pedido nuevo del
> usuario: sale de leer el repo después de que el ciclo 9 cerrara entero.
>
> Punto de partida medido, no recordado: `npm test` **352/352**, `npm run check` limpio,
> el sitio desplegado, y **los cinco pisos de la v1 cumplidos**.

## Lo primero, porque es lo que ordena todo el ciclo

**Los pisos se cumplen contando ítems. El "Listo" de la v1 no se declara contando ítems.**

El tablero dice ✅ en las cinco historias y es verdad. Pero `US-02` —el juego que más
tardó en llegar y el que cierra la v1— **incumple una regla que su propia historia declara
por escrito**, y lo verifiqué en el código corriendo, no leyendo el tablero:

`src/scripts/partida-tema.ts:196-202` arma la vuelta con un Fisher-Yates sobre los 95
temas y corta los primeros cuatro. **La palabra `dificultad` no aparece una sola vez en
todo el archivo**, y `src/data/adivinar-tema.json` no tiene ese campo en ninguno de sus 95
ítems.

Es el mismo defecto que `REV-08` encontró en `US-07` y llamó `FIND-29`, con las mismas
palabras: *"el que llega sin saber nada podía recibir el tema más oscuro del catálogo como
primera pregunta"*. Allá se arregló. **Acá sigue vivo, y acá pesa más**, porque `US-07`
está fuera del "Listo" por `D-05` y `US-02` es el que lo cierra.

### Lo que dice el papel contra lo que hace la pantalla

`PRD-alcance-v1.md`, piso de `US-02`, textual:

> *Mínimo 8 de nivel Fácil — desde `T-116` (ciclo 8), definido por `BR-18` apartado f: los
> 8 temas de mayor posición en el ranking de vistas de YouTube (…) para que `BR-01` no
> repita siempre el mismo puñado de temas fáciles.*

| Lo que declara `US-02` | Lo que hay hoy |
|---|---|
| Piso de 30 temas con fragmento | **95** ✅ |
| Mínimo 8 de nivel Fácil | **0** — el campo no existe |
| `BR-01`: nunca un muro en la primera pantalla | **no se cumple**: la primera sale del azar |
| Un schema corrible que lo valide | **no existe** |

**El piso está cumplido y el criterio no.** Esa es la distancia que este ciclo cierra.

### El segundo hallazgo, del mismo tirón

**`adivinar-tema.json` es el único banco de juego del repo sin schema.**
`src/lib/esquemas.test.ts` valida siete archivos —`quiz`, `letra`, `tapa`, `cancionero`,
`popularidad`, `dos-ejes`, `por-la-letra`— y el de `US-02` no está en la lista, porque
`src/data/_schema/adivinar-tema.schema.json` no se escribió nunca. `catalogo.ts` hace
chequeos de arranque contra los 105 temas y el manifiesto, que es algo, **pero no es un
contrato**: nada impide que el campo que este ciclo agrega se cargue mal mañana.

Los 95 ítems del banco más grande de la v1 son los únicos que nadie valida a máquina.

## 🔴 El insumo que falta, que es del usuario y no lo puede traer ningún rol

**La clave de YouTube.** `src/data/popularidad.json` tiene los **105 temas en `sin-video` y
cero mediciones**, medido hoy. Sin eso, la regla de `D-27` reparte `dificil` a todos y el
escalonamiento no existe — ni en `US-02` ni en `US-07`.

```
YT_API_KEY=... npm run ingerir-popularidad -- --resolver
```

**Un comando destraba los dos juegos y no toca una línea de código.** Es, con distancia, lo
que más rinde por minuto invertido en todo el proyecto.

**Pero el ciclo no se cuelga de eso, y es a propósito.** `T-162` y `T-163` se construyen
para funcionar con cero mediciones: degradan a barajado **declarado**, con el motivo
escrito y el generador gritándolo en cada corrida, exactamente como quedó `US-07`. La
diferencia entre hoy y el final del ciclo no es que el juego escalone —eso lo prende la
clave— sino que **deje de mentir**: hoy el tablero dice ✅ sobre un criterio que no se
cumple, y después va a decir qué falta y por qué.

## Lo que este ciclo no hace, y conviene saberlo antes de empezar

**No agrega un juego, ni un ítem, ni una pantalla.** Es un ciclo de cierre: mira lo que ya
está construido contra lo que ya está escrito, y cierra las diferencias. Después de
`T-174` se puede declarar la v1 lista o se sabe exactamente qué falta para declararla, que
hoy no se sabe.

---

## ✅ Cerrado el 2026-09-01, en una sola ráfaga — y dos premisas de este plan salieron mal

**Catorce de quince.** Falta `T-165` (la clave de YouTube), que es del usuario. `npm test`
**372/372** (eran 352), `npm run check` limpio, build de 150 páginas, y `REV-09` cerrando
en 🟢 con la v1 declarable.

**Las dos premisas que este plan escribió mal, y conviene que se lean acá arriba:**

1. **"`adivinar-tema.json` es el único banco de juego sin contrato" — falso.** Tiene
   `CTR-03`, vigente y en revisión 3. Lo que no tiene es un `.schema.json` corrible, y eso
   **es una decisión de `arquitectura` con tres motivos escritos** (`CTR-03.8`), no un
   olvido. La revisión 4 la re-evaluó a la luz del campo nuevo y **la ratificó**.
2. **`T-161` iba a crear `CTR-11` y no hizo falta.** La dificultad no va en el manifiesto:
   va en el catálogo, derivada en build. Y eso **ya lo había escrito `arquitectura` hace un
   ciclo**, en las Consecuencias de la v2 — *"sería un dato nuevo y no iría en el manifiesto
   — iría en el catálogo, al lado de `RES-20`"*. El trabajo entró como `CTR-03.11`.
   **`CTR-11` queda quemado y no se reutiliza** (`Docs/IDS.md`).

**Lo que salió mejor de lo planificado:** el frente A no duplicó nada, sacó duplicación.
`repartirPorPopularidad` (`D-27`) vivía en `src/lib/por-la-letra/` y pasó a
`src/lib/popularidad.ts`; el escalonado de `BR-01` estaba copiado en la isla de `US-07` y
pasó a `src/lib/escalonar.ts`. Los dos juegos comparten ahora una sola copia de cada regla.
**`ronda.ts` no se tocó**, como decía el plan.

**Lo que el plan no vio venir, y era lo que bloqueaba de verdad:** `FIND-35`. Tres de los
criterios de aceptación de la v1 describían mecanismos retirados por `D-22` y `D-14`. El
plan buscaba defectos en el código y el que impedía declarar estaba en el papel.

**La deuda de método:** el plan asignaba siete tareas a seis roles distintos y **las
escribió todas el hilo principal**, revisión incluida. Está declarado como `FIND-37`.

---

## Las tareas

### Frente A — `US-02` cumple `BR-01`

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-161` | `arquitectura` | **`CTR-11`**: el schema del banco de `US-02`, el único sin contrato. Incluye `dificultad` y el `dificultadSegun` que declara de dónde salió — la misma forma que `CTR-09.7` | `Docs/ARQ/ARQ-schema-adivinar-tema.md`, `src/data/_schema/adivinar-tema.schema.json` *(nuevo)* | `adivinar-tema` entra a la lista de `src/lib/esquemas.test.ts` y los 95 ítems validan | `[P]` |
| `T-162` | hilo principal | El banco lleva `dificultad`: `src/lib/tema/dificultad.ts` reusando `repartirPorPopularidad`, y `ingerir-fragmentos` la escribe. **Con cero mediciones degrada a `dificil` declarado, no a silencio** | `src/lib/tema/dificultad.ts` *(nuevo)*, `scripts/ingerir-fragmentos.mjs`, `src/data/adivinar-tema.json` | `npm test` y `adivinar-tema.json` valida contra `CTR-11` | tras `T-161` |
| `T-163` | hilo principal | La vuelta de `US-02` se arma escalonada, con la degradación declarada de `partida-por-la-letra.ts`. **Se va el Fisher-Yates de la línea 196** | `src/scripts/partida-tema.ts` | vuelta jugada a 375×812, y una guarda que falla si vuelve el barajado puro | tras `T-162` |
| `T-164` | `producto` | Qué hace el "Listo" de la v1 con el mínimo de 8 Fáciles de `US-02` **mientras no haya medición**. `D-27` dejó la misma pregunta para `US-07` y la contestó con "está fuera del Listo"; acá esa salida no existe | `Docs/PRODUCTO/PRD-alcance-v1.md` | el piso de `US-02` dice si la degradación frena la declaración o no, con el motivo | `[P]` |
| `T-165` | **vos** | La clave de YouTube. No la puede traer ningún rol y prende `US-02` y `US-07` de una | `src/data/popularidad.json` *(lo escribe el comando)* | `npm run ingerir-popularidad -- --resolver` deja mediciones > 0 | `[P]` |

### Frente B — lo que está mal en pantalla y tiene dueño

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-166` | `producto` | El `h1` del quiz tiene **diez palabras** y `voz-ricotera.md` 4.1 topea en ocho. O se recorta, o se declara la excepción por escrito | `Docs/PRODUCTO/PRD-alcance-v1.md` | queda una de las dos, escrita, y `T-167` puede cerrar sin mirar para otro lado | tras `T-164` |
| `T-167` | hilo principal | Cerrar el hueco del auditor: los `PANTALLA_0.titulo` de los cinco juegos entran a las líneas grandes que `voz.test.ts` mide | `src/lib/voz.test.ts`, `src/pages/quiz.astro` | `node --test src/lib/voz.test.ts` en verde **con los cinco adentro** | tras `T-166` |
| `T-168` | `investigador` | **`RES-53`**: qué sello editó *Un baión en el Ojo del Huracán*. `QZ-007` dice Wormo y `RES-20` dice Del Cielito, y hoy la contradicción está anotada, no resuelta | `Docs/INVESTIGACION/` | la ficha dice cuál es, con URL y fecha, o rotula que las fuentes no coinciden | `[P]` |
| `T-169` | `contenido` | **`QZ-025`** (Bulacio) se acierta con civismo: la Corte Interamericana es la única opción que aplica a un caso argentino. La salida que `CNT-04` ya habilita —cuánto tardó la Justicia argentina— es tuya, no mía | `src/data/quiz.json` | `node --test src/lib/quiz/fugas.test.ts` y el ítem no se contesta sin saber de la banda | `[P]` |
| `T-170` | `contenido` | El verso *"Pintan mal las cosas para **,l** mi viejo"* viene roto desde `cancionero.json` y se ve en dos lugares. Es 1 de 712 | `src/data/cancionero.json` | `npm test` y el verso sale entero en la ficha y en el banco | `[P]` |

### Frente C — las tres deudas que dejó el juego de zoom

Las tres las declaró el hilo principal el 2026-08-28 al convertir "Adiviná la tapa" en un
juego de zoom, y **ninguna es suya**: en las tres pisó la carpeta de otro rol para no
frenar el arreglo. Están escritas en `ESTADO.md` y en
`Docs/SUGERENCIAS/HILO-para-experiencia-tapas-sin-titulo.md`.

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-171` | `experiencia` | `UX-05` adopta o corrige los diez zooms y centros. El script dice *"si cambia el catálogo cambia esta tabla, no al revés"* y se fue al revés | `Docs/UX/UX-05-tapas-en-pantalla.md` | la tabla de `UX-05` y `scripts/generar-tapas.mjs` dicen lo mismo | `[P]` |
| `T-172` | `arquitectura` | La regla que el hilo principal reemplazó en `tapa.schema.json` — de `encuadre: "detalle"` ⟹ `dificultad ∈ {media, dificil}` a `estado: "listo"` ⟹ `encuadre === "detalle"`. Es tuya: ratificala o cambiala | `src/data/_schema/tapa.schema.json`, `Docs/ARQ/` | `npm test` y el `$comment` cuenta por qué la regla es esa | `[P]` |
| `T-173` | `contenido` | Las explicaciones de `TP-002` y `TP-007` hablan del alfabeto del título, **que el zoom sacó de pantalla**. Señalan algo que la gente ya no ve | `src/data/tapa.json` | las diez explicaciones hablan de lo que se ve en su recorte | `[P]` |

### Cierre

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-174` | `revisor` | **`REV-09`**: los cuatro juegos de la v1 contra los criterios de aceptación de `US-01`..`US-04`, uno por uno. **No contra los pisos** —esos están cumplidos y contarlos otra vez no dice nada nuevo— sino contra el resto de cada historia | `Docs/REVISIONES/REV-09-cierre-v1.md` *(nuevo)* | hallazgos `FIND-34`+ con evidencia, y un veredicto explícito sobre si la v1 se puede declarar | tras el frente A y el B |
| `T-175` | hilo principal | `ESTADO.md` al día. **Y limpia "Decisiones pendientes"**, donde la mitad de las entradas ya se resolvieron y siguen ahí como si estuvieran abiertas | `ESTADO.md` | ninguna decisión resuelta figura como pendiente | último |

## Pasada de conflictos

- **`T-164` y `T-166` son las dos de `producto` y tocan `PRD-alcance-v1.md`.** No son
  paralelas: `T-166` va detrás. Le saqué la marca.
- **`T-161` y `T-172` son las dos de `arquitectura`** pero tocan schemas distintos
  (`adivinar-tema` contra `tapa`), así que no chocan de archivo. Un solo rol no las corre a
  la vez en una ráfaga; el orden entre ellas es indistinto.
- **`T-169`, `T-170` y `T-173` son las tres de `contenido`** y tocan tres JSON distintos
  (`quiz`, `cancionero`, `tapa`). Sin conflicto de archivo.
- **`T-170` regenera `por-la-letra.json`** al arreglar el cancionero. Ninguna otra tarea del
  ciclo toca ese archivo.
- **`T-174` va después de `T-169`**, que cambia `quiz.json` — revisar un banco y modificarlo
  al mismo tiempo es revisar otra cosa.
- **Nada del frente A depende de `T-165`.** Es la única tarea con dueño de carne y hueso y
  el ciclo cierra igual sin ella; lo único que no pasa es que el escalonamiento se encienda.

**`[P]` al arrancar:** `T-161`, `T-164`, `T-165`, `T-168`, `T-171`, `T-172`. Seis archivos
distintos, seis dueños distintos, sin dependencias.

## Los dos tramos

| Tramo | Tareas | Por qué van juntas |
|---|---|---|
| **A** | `T-161`..`T-167` | `US-02` cumple `BR-01`, y el auditor de voz cierra su hueco. Es el frente que decide si la v1 se puede declarar |
| **B** | `T-168`..`T-175` | Las deudas con dueño, las tres del zoom, y la revisión que cierra |

Quince tareas, el tamaño del ciclo 8. El 9 fueron treinta y una y hubo que partirlo en dos
igual.

## Qué quedó afuera, y por qué

- **Mostrar la tapa entera al revelar.** Es el premio del formato splash y hoy no se puede
  porque `aPayload` manda una sola ruta. **Es una mejora, no un defecto**, y este ciclo es
  de cierre. Queda anotado en `ESTADO.md` con dueños (`experiencia` + `arquitectura`).
- **`momo-medallon.jpg`.** La pantalla de `US-07` se pinta con el color solo. `UX-08` dejó
  el brief pedido y `US-07` está fuera de la v1.
- **Los ids posicionales `CL-NNN` de `US-03`.** Cada endurecimiento del filtro corre la
  curaduría entera. `REV-08` lo dejó marcado como estructural y el guardián de anclas lo
  contiene mientras tanto — contiene, no resuelve. Es de `arquitectura` y merece su propio
  ciclo, no una fila de este.
- **La casilla de correo del botón de corrección** (`T-153` del ciclo 9). Sigue esperándote.
  Sin casilla el mail no existe y la cadena termina en el texto a la vista, así que **nadie
  queda sin poder corregir**: no bloquea la v1.
- **Supabase (`IDEA-13`), las bandas post-separación, y las once ideas de juego.** Todo
  crecimiento. Ninguno entra en un ciclo que existe para cerrar.
- **Los 21 temas de lacuerda.net, los nueve P3 de la auditoría impeccable, `RES-48` y su
  cita falsa, y los tres hallazgos abiertos de `REV-06`.** Trabajo real y viejo. Si `T-174`
  los toca de refilón, que los toque; empujarlos acá infla el ciclo sin cerrar nada.

## El riesgo del ciclo

**Que `T-174` encuentre que la v1 no se puede declarar, y que eso llegue al final.**

Es un ciclo de cierre y su única tarea de veredicto está en la última fila. Si `REV-09`
saca cuatro bloqueantes como sacó `REV-08`, el ciclo termina sabiendo más y sin poder
declarar nada — y va a doler más que en el 9, porque en el 9 el veredicto era sobre piezas
recién construidas y acá es sobre piezas que la gente ya está jugando.

**La mitigación es del orden, no del contenido:** el frente A arregla lo que ya *sé* que
está mal antes de que la revisión lo mire. `REV-09` no debería descubrir `FIND-29` en
`US-02` — eso ya está descubierto y arreglado para cuando llegue. Lo que busque va a ser lo
que ninguno de los dos vimos.

**Y el riesgo de fondo, que es de método y lleva tres ciclos repitiéndose:** por tercera vez
seguida, la revisión encontró lo que la verificación no, y siempre por el mismo motivo — *el
defecto no estaba en ningún ítem, estaba en el conjunto*. `REV-08` dejó la lección escrita:
**toda verificación de contenido generado tiene que hacerse con un método distinto del que
generó**. `T-162` y `T-163` generan y escalonan; que los verifique `T-174`, que no los
escribió.

## Rangos

Consume `T-161`..`T-175`, `CTR-11`, `RES-53`, `REV-09`, `FIND-34`+.
Quedan libres: `T-176`+, `D-32`+, `RES-54`+, `US-08`+, `BR-22`+, `CTR-12`+, `UX-13`+,
`CNT-13`+, `REV-10`+, `IDEA-14`+.
