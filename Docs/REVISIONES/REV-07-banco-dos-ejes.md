# REV-07 — Revisión del banco del test de dos ejes (`US-06`)

> Tarea `T-124` del ciclo 8, 2026-08-24.
>
> Pieza revisada: `src/data/dos-ejes.json` — 20 ítems `EJ-001`..`EJ-020` y los cuatro
> cuadrantes `CU-1`..`CU-4`, escritos por `contenido` en `T-121`.
>
> **Dos pasadas independientes, otra vez, y otra vez no coincidieron.** Escrito por el hilo
> principal, con la adjudicación arriba y las dos entregas abajo.

---

## Lo mecánico, corrido antes de las dos pasadas

El JSON valida contra `src/data/_schema/dos-ejes.schema.json`. 20 ítems, **10 por eje**.
`preguntasPorEje: 5` — impar, así que el empate es imposible. **Los cuatro cuadrantes
alcanzables**: cada eje tiene ítems que empujan a los dos polos. **Un ítem mueve un solo
eje.** Ningún campo `correcta`, `dificultad`, `peso` ni `puntos`. Los cuatro nombres entran
en los 26 caracteres de `UX-06` §7.

**Todo eso pasa, y no alcanzó para nada.** Los dos defectos que hunden este banco están
adentro de esas casillas, no afuera.

## Las dos pasadas

| | Encargo | Resultado |
|---|---|---|
| **`revisor`** | Verificar contra los criterios declarados | 3 hallazgos: `FIND-25`, `FIND-26` (bloqueante), `FIND-27` |
| **Pasada adversarial** | **Romperlo.** Asumir que hay defectos y buscarlos | **3 defectos estructurales + 15 ítems con problemas + los 4 cuadrantes de vuelta** |

**Coincidieron en uno solo: `CU-3`.** Y el motivo grande de `CU-3` no lo trajo ninguna de
las dos primero — lo trajo la segunda, y es el que decide.

## La adjudicación: la segunda tiene razón en lo estructural

`revisor` verificó bien lo que se le pidió verificar: los presupuestos de caracteres con
script propio, las tres reescrituras señaladas, que ningún ítem exija saber de la banda,
que el eje `orden-caos` no se nombre a sí mismo, la voz, los IDs. Todo eso estaba bien
mirado.

**Lo que no encontró es lo que solo existe en el conjunto.** Es el mismo patrón que el
ciclo 7 ya había dejado escrito en `REV-06`, y que este ciclo confirma por segunda vez:

> Verificar ítem por ítem es necesario y no alcanza. Un encargo que dice *"verificá"* y uno
> que dice *"rompé"* no encuentran lo mismo, y el segundo cuesta lo mismo que el primero.

### Los tres defectos estructurales, y por qué el schema no podía verlos

**1. La regla 1 de `BR-17` se cumple en la etiqueta, no en el contenido.** El schema valida
que cada ítem declare **un** `eje`. No puede validar que el ítem **mida** ese eje. Cuatro
ítems etiquetados `luz-oscuridad` son, por contenido, elecciones entre rutina e impulso —
material de `orden-caos` con la otra etiqueta puesta. Y `EJ-011`, al revés.

**2. El polo `orden` nunca paga y el polo `caos` confiesa cuatro veces.** Ninguna de las
diez opciones de `orden` describe un costo. Cuatro de las de `caos` describen un descuido.
**Un eje donde un polo es siempre competencia y el otro a veces es descuido no separa
maneras: ordena.** `CNT-09` dice que descartó "prolijo contra desprolijo" con el argumento
correcto, y el eje quedó escrito con esa forma igual.

**3. El eje `luz-oscuridad` mide cuatro cosas distintas.** Extraversión, optimismo,
apetito de intensidad, y control. **Con un sorteo de 5 sobre 10, la misma persona cae en un
polo o en el otro según qué cinco le tocaron.** Y `UX-06` §4 pone un botón de jugar de
nuevo: dos partidas seguidas devuelven identidades distintas, y el jugador concluye —con
razón— que el test no lo estaba leyendo.

Ese tercero es el más grave de los tres, y **es invisible ítem por ítem**: cada uno de los
diez es una pregunta razonable. El defecto vive en que no son la misma pregunta.

### Los cuatro cuadrantes, que es lo que más urge

Es el texto que la gente se lleva puesto y comparte. Van los cuatro de vuelta:

- **`CU-1` "Guardián de la llama"** — *mantener viva la llama* es la frase hecha para
  sostener el legado de una banda. **No nombra un temperamento: nombra devoción, y devoción
  es pertenencia**, la única línea que `BR-17` no deja cruzar. Los otros tres se llaman como
  fenómenos; este se llama como un cargo. Y su bajada es la única que **elogia** en vez de
  describir.
  > El principio rector de este sitio es **abrir los molinetes**, y uno de los cuatro
  > resultados posibles era *el que los cuida*.
- **`CU-3` "Cuervo puntual"** — **en Argentina *el Cuervo* es el hincha de San Lorenzo**,
  antes que cualquier otra lectura. `contenido` se cuidó de la asociación con la muerte y
  dejó pasar la que va a hacer todo el mundo. Es el único punto donde las dos pasadas
  coincidieron, y por motivos distintos: `revisor` lo marcó porque la bajada le da la
  **invisibilidad** como rasgo mientras las otras tres dan presencia.
- **`CU-4` "Tormenta sin agenda"** — describe *se nota cuando entrás*, que según la propia
  definición del eje en `CNT-09` (oscuridad = lo que se guarda hacia adentro) es un rasgo de
  **luz**. El jugador que llegó ahí eligiendo cinco veces guardarse recibe como devolución
  que llena la habitación.
- **`CU-2` "Cometa suelto"** — la identidad queda en irse antes del final.

**Y el defecto del conjunto:** las cuatro bajadas hablan de **llegar e irse de un lugar**.
Se diferencian por puntualidad, que es **un solo eje**. La coordenada luz↔oscuridad casi no
aparece en el texto que el jugador comparte. **La mitad del test no se ve en lo que el test
devuelve.**

> **Y la raíz probable, que conviene mirar porque puede volver:** el ejemplo canónico de
> `CTR-08.4` usa un cuadrante llamado *"El que llega temprano"* con una bajada sobre a qué
> hora abre el lugar. **El molde del ejemplo se copió al banco.** Un ejemplo de contrato no
> es neutro: es la primera versión que alguien va a imitar.

### Un defecto de forma, barato y real

**Seis marcas de género masculino** en cuatro ítems obligan al jugador a hablar como varón.
Las opciones están en primera persona: el que las toca las está diciendo. Es un molinete
chico en el juego que menos muro tiene de los cinco.

## Veredicto

**El banco no se publica como está, y no es por un ítem: es por cómo están definidos los
ejes.** El piso de 20 se cumple en cantidad y eso no salva nada — cinco ítems no van de
ninguna forma, cuatro hay que repensarlos enteros, seis se salvan con una línea, cinco
están limpios, y los cuatro cuadrantes se rehacen.

**Ningún dato es falso, porque este juego no afirma nada.** Lo que falla es la única regla
estricta que tiene: que ninguna opción sea mejor que la otra y ningún resultado mejor que
otro.

Devuelto a `contenido` como **`T-126`**, con el encargo escrito como rehechura y no como
corrección: elegir cuál de los cuatro constructos es el eje `luz-oscuridad` y reescribir los
otros contra esa definición, darle un costo al polo `orden`, rehacer los cuatro cuadrantes
sin el molde del ejemplo, y sacar la marca de género de los veinte.

**Con un aviso operativo que importa:** retirar los cinco rotos deja el banco en 15, y el
motor arrancaría igual —solo exige 5 por pozo— así que **el piso de `US-06` quedaría
incumplido en silencio.** El reemplazo entra en la misma entrega que el retiro.

---

# Anexo A — la ficha de `revisor` (`T-124`), tal como la entregó

Se conserva entera: el trabajo de verificación es correcto y es la mitad que la pasada
adversarial no hizo.

**`FIND-25`** · `EJ-002` · *no bloqueante* — `CNT-09` declara que ninguna pregunta nombra su
eje, y `UX-06` §3 exige no delatarlo. `EJ-002` dice "se te corta la **luz**" y ofrece "ando
a **oscuras**": nombra el eje casi literal. Verificado con `grep` sobre los diez ítems del
eje — único caso; el eje `orden-caos` está limpio entero.

**`FIND-26`** · los cuatro cuadrantes · **bloqueante** — `CU-3` es el único de los cuatro sin
una imagen activa hacia otros: `CU-1` protege, `CU-2` es magnético, `CU-4` tiene presencia;
`CU-3` se define por pasar desapercibido. Es la duda que `contenido` anotó ella misma, y al
leer las cuatro bajadas en fila se confirma: es el cuadrante que menos se elegiría.

**`FIND-27`** · `EJ-013` · *no bloqueante* — "La noche antes, corriendo" carga apuro frente a
"Una semana antes, con lista". Matiz aislado, no un patrón del eje.

**Sin hallazgos:** las tres reescrituras señaladas resuelven la simetría · ningún ítem exige
saber de la banda · el eje `orden-caos` nunca se nombra · ningún ítem cita Bulacio,
Olavarría, Cromañón ni la muerte del Indio, y la decisión de dejarla afuera es correcta ·
sin anglicismos, sin fórmula de folleto, sin infinitivos · IDs únicos y correlativos.

**Veredicto de `revisor`:** *"el piso está cumplido en cantidad y el banco es técnicamente
jugable"*, con `FIND-26` como único bloqueante.

# Anexo B — la pasada adversarial

Su entrega completa es larga y está resumida arriba, en la adjudicación. Lo que aportó y la
otra no:

- Los **tres defectos estructurales** (etiqueta contra contenido, el polo que nunca paga, el
  eje que mide cuatro cosas).
- **El Cuervo como hincha de San Lorenzo.**
- **`CU-1` nombra pertenencia**, con la ironía de los molinetes.
- **`CU-4` describe un rasgo del eje contrario.**
- Las **cuatro bajadas diferenciadas solo por puntualidad**, y la sospecha de que el molde
  salió del ejemplo del contrato.
- Las **seis marcas de género**.
- El **aviso operativo** sobre el piso quedando corto en silencio.
- Y un falso positivo que descartó antes de escribirlo, que vale la pena registrar: los 20
  ítems tienen la opción `luz`/`orden` primera en el JSON, pero `CTR-08.3` obliga al motor a
  barajar, así que el orden del archivo no sesga nada.
