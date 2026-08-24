# ARQ — Schema de "adiviná el tema" (`US-02`)

> Rol dueño: `arquitectura`. Consume: `US-02`, `BR-01`, `BR-02`, `BR-04`, `BR-06`,
> `CTR-01` v2 (en especial `CTR-01.3`, `CTR-01.4`, `CTR-01.5`, `CTR-01.7`, `CTR-01.8`,
> `CTR-01.9`), `ADR-01`, `RES-20`, `D-13`, `D-14`, `D-22`, `D-23`, `D-24`,
> `Docs/SUGERENCIAS/HILO-para-arquitectura-escalera-de-seis-y-modo-buscador.md`,
> `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`,
> `.claude/rules/contenido-json.md`.
> Produce: **`CTR-03` v2**. Tarea: `T-104` del ciclo 7.
> Última actualización: **2026-08-24 (revisión 2)**. La v1 es del 2026-08-19 (`T-24`).

---

## Nota de versionado

`CTR-03` pasa a **v2** y el archivo no se parte, por el mismo criterio que `CTR-01`: el
contrato se cita por número desde el código, desde el propio archivo de datos —que ya
declara `"contratoVersion": 2`— y desde `D-24`. **La redacción vieja no se borra: queda
citada dentro de cada sección revisada, con fecha y motivo.**

El cambio es grande y conviene decirlo en una línea antes de la tabla: **la v1 describía un
banco de ítems que nunca se cargó, y la v2 describe un manifiesto de archivos de audio.**
No hay migración porque no hay datos que migrar — `D-24` lo dejó anotado: es trabajo de
`contenido` que la decisión borró, no que postergó.

---

## Qué cambió, en una tabla

| Sección | Antes (v1, 2026-08-19) | Ahora (v2, 2026-08-24) | Por qué |
|---|---|---|---|
| `CTR-03.1` | Banco de 20 ítems, envoltorio con `items` | **Manifiesto de archivos**, con `fragmentos` | `D-24`: el catálogo sale de `RES-20` en build |
| `CTR-03.2` | Trece campos por ítem, `TM-NNN` | **Cuatro campos por archivo**, sin ID de contenido | No hay ítems que identificar |
| `CTR-03.3` | La respuesta es `fragmento.credito.tema` | La respuesta es la **identidad** del tema; se compara por slug | `modoRespuesta: "buscador"` |
| `CTR-03.4` | Cinco pasos, `duracionSeg` ≥ 10,0 | **Seis pasos**, `duracionSeg` ≥ 15,0 (ventana de `CTR-01.3`) | `D-24`, `CNT-01` del 2026-08-24 |
| `CTR-03.5` | `"opciones"` \| `"texto"`, sin decidir | **`"buscador"`, y es el único valor** | `D-24`, decisión del usuario |
| `CTR-03.6` | `fuentes` obligatoria por ítem; `sensibleA` con `audio` | Las dos **cambian de lugar**: la fuente se verifica en build, el mapa es la carpeta | No hay ítem donde escribir un campo |
| `CTR-03.7` | `spotify.trackId` opcional por ítem | **Retirado del dato** | `D-22`: el tema entero lo sirve el sitio |
| `CTR-03.8` | Bloque JSON Schema para bajar a `src/data/_schema/` | Bloque normativo **que no se baja a archivo** | La validación real es el cruce contra los 105 |

---

## CTR-03 — Contrato del manifiesto de "adiviná el tema"

- **Estado:** **vigente y sin nada abierto.** La única decisión que la v1 dejó marcada como
  ajena —cómo se responde— la cerró el usuario en `D-24`.
- **Para quién es:** para `scripts/generar-fragmentos.mjs`, que escribe el archivo, y para
  `src/lib/tema/catalogo.ts`, que lo lee en build. **Ya no es para `contenido`**: no hay
  nada que cargar a mano acá.
- **Cambio que el archivo de datos necesita: ninguno.** `src/data/adivinar-tema.json`, tal
  como está hoy, cumple este contrato entero. Lo digo explícito porque la tarea lo pedía:
  **no dejo ningún cambio de datos pendiente para `T-107`.** Lo que sí dejo son dos
  propuestas opcionales de código, marcadas como tales en `CTR-03.1` y `CTR-03.8`.

---

### CTR-03.1 — Archivo, envoltorio y presupuesto — **v2**

**Archivo:** `src/data/adivinar-tema.json`.
**Quién lo escribe:** `scripts/generar-fragmentos.mjs`, entero, en cada corrida.
**Quién lo lee:** `catalogo()` en build. **Nunca se edita a mano.**

```json
{
  "contrato": "CTR-03",
  "contratoVersion": 2,
  "juego": "adivinar-tema",
  "modoRespuesta": "buscador",
  "actualizado": "2026-08-23",
  "nota": "Lista de archivos de audio que EXISTEN, no de temas. ...",
  "fragmentos": []
}
```

| Clave | Tipo | Obligatoria | Nota |
|---|---|---|---|
| `contrato` | `"CTR-03"` | sí | |
| `contratoVersion` | `2` | sí | La v1 nunca produjo un archivo. |
| `juego` | `"adivinar-tema"` | sí | |
| `modoRespuesta` | `"buscador"` | sí | Único valor. Ver `CTR-03.5`. |
| `actualizado` | `AAAA-MM-DD` | sí | Fecha de la corrida del generador. Es también la trazabilidad de producción que `CTR-01.8` dejó de guardar por archivo. |
| `nota` | string | no | Para el que abre el archivo sin contexto. No la lee ningún código. |
| `fragmentos` | array | sí | Puede estar **vacío**, y hoy lo está. |

**`fragmentos` vacío es un estado válido, no un error.** Significa que el sitio todavía no
tiene con qué sonar, porque el audio se produce desde la máquina del usuario (`D-23`). La
pantalla lo dice y no se rompe; `catalogo()` devuelve los 105 temas con `jugable: false`.
Es la misma postura que el resto del proyecto toma con los insumos que faltan: un hueco
declarado antes que una excepción.

> **Revisado el 2026-08-24 (`T-104`): el envoltorio se aparta del común, a propósito.** La
> v1 usaba el mismo envoltorio que `CTR-02` —`contrato`, `contratoVersion`, `juego`,
> `actualizado`, `items`— con el argumento de que un solo cargador sirviera para los cuatro
> juegos. Acá la clave se llama **`fragmentos`** y no `items`.
>
> **Por qué.** `items` prometería ítems de contenido: con `id`, `us`, `dificultad`,
> `estado`. Adentro no hay nada de eso; hay archivos. Llamarlos `items` haría que el
> archivo mienta sobre lo que tiene y que el día de mañana alguien le pida a `contenido`
> que "complete los campos que faltan". Además, el cargador común tampoco existe para este
> juego: el catálogo se arma en build desde `RES-20`, no desde este archivo.
>
> *Alternativa descartada:* mantener `items` por uniformidad. Se descarta por lo de arriba.
> *Alternativa descartada:* renombrar el archivo a `fragmentos-audio.json`, que describiría
> mejor su contenido. Se descarta por costo sin beneficio: la ruta está escrita en el
> generador, en el catálogo, en dos tests y en `D-24`, y el nombre del juego sigue siendo
> la mejor pista de para qué existe.

**Presupuesto de tamaño:** 104 entradas × ~110 bytes ≈ **12 KB**, contra el techo de 150 KB
de `CTR-02.1`. El archivo no es el problema y nunca lo va a ser.

**Presupuesto de audio: no lo fija este contrato, lo fija `CTR-01.5`.** Tres buffers
residentes, ≤ 8,6 MB de RAM en el caso peor, ventana de dos adelantados. **104 entradas en
el manifiesto no son 104 buffers en memoria**, y que el pozo pase de 20 a 104 no toca el
presupuesto de gama baja en un solo byte. Se repite de la v1 porque es la confusión más
fácil de cometer.

> **Propuesta opcional para el hilo principal (no bloquea, no es un cambio de datos).** La
> interfaz `Manifiesto` de `src/lib/tema/catalogo.ts` declara cuatro claves y no incluye
> `juego` ni `modoRespuesta`, así que un archivo con `modoRespuesta: "opciones"` pasaría
> por el build sin que nadie lo note, jugándose igual como buscador. Es un modo de falla
> barato de cerrar: sumar las dos claves a la interfaz y hacer que `indexarFragmentos()`
> falle si no son las esperadas. *Alternativa:* dejarlo como está, apoyándose en que el
> único que escribe el archivo es el generador. Es defendible mientras eso siga siendo
> cierto; la propuesta cuesta cuatro líneas y deja de depender de que siga siéndolo.

---

### CTR-03.2 — La entrada, campo por campo, y los doce campos que se retiran

**La entrada entera está en `CTR-01.8` y no se redeclara acá.** Son cuatro campos:
`slug`, `titulo`, `duracionSeg`, `entero`.

> **Revisado el 2026-08-24 (`T-104`).** La v1 describía un ítem de trece campos. Abajo está
> qué pasó con cada uno de los que se van. La tabla existe para que dentro de dos meses
> nadie tenga que adivinar si un campo se olvidó o se retiró.

| Campo de la v1 | Qué pasó | Por qué |
|---|---|---|
| `id` (`TM-001`+) | **Retirado, sin usar.** No se creó ni un `TM-NNN`. | Un archivo no es un ítem de contenido. La identidad del tema es su slug, que se deriva del título y no se inventa. Si algún día vuelve un banco, el contador arranca en `TM-001`: nunca se gastó. |
| `us` | Retirado | El manifiesto entero pertenece a `US-02`. Repetirlo 104 veces no informa. |
| `dificultad` | **Retirado, y tiene consecuencia para `producto`** | Ver "Consecuencias" al final: `BR-01` etiqueta ítems y acá no hay ítems. |
| `fragmento` (objeto de `CTR-01.8`) | **Es la entrada misma** | El ítem se disolvió y quedó el archivo. |
| `opciones` (4, una correcta) | **Retirado** | `D-24`: se responde con buscador. Ver `CTR-03.5`. |
| `respuestasAceptadas` | **Retirado** | Nunca existió el modo texto. Ver `CTR-03.5`. |
| `explicacion` | Retirado | El dato de color del reveal hoy es la ficha del tema (disco, año, pista) y el enlace a la letra, todo derivado. Si `contenido` quiere prosa por tema, es un banco nuevo y un contrato nuevo: no se cuelga de un manifiesto que reescribe un script. |
| `rotulo` (`leyenda` \| `testimonio`) | Retirado **con `explicacion`** | El rótulo rotula una afirmación, y sin `explicacion` no hay afirmación que rotular. La regla de las tres casillas no se toca: vive en `CTR-02` y en `CTR-04`, donde sí hay prosa. |
| `fuentes` | **Cambia de lugar, no desaparece** | `CTR-03.6`, regla 1. |
| `sensibleA` | **Cambia de lugar, no desaparece** | `CTR-03.6`, regla 2. |
| `spotify.trackId` | **Retirado** | `CTR-03.7`. |
| `estado` (`borrador`/`listo`/`retirado`) | **Retirado** | Un archivo de audio no tiene borrador: existe o no existe. "Retirado" es borrar el mp3 y volver a correr el generador, que es exactamente lo que hay que hacer si llega un reclamo (`D-14`). |
| `notaInterna` | Retirado | El generador reescribe el archivo entero en cada corrida: cualquier nota a mano se pierde. Un campo que no sobrevive a su propia herramienta es una trampa. |

**Lo que la entrada tampoco tiene, y sigue sin tener por la misma razón que en la v1:**

- **No tiene `enunciado`.** El enunciado de este juego es el audio.
- **No tiene `tema`, `disco` ni `anio`.** Salen de `RES-20` y de la ficha del disco, en
  build. El `titulo` que sí lleva es documentación, no dato de juego (`CTR-01.8`).
- **No tiene nada de los seis pasos.** Ver `CTR-03.4`.
- **No tiene `categoria`.** Las cuatro categorías son del quiz.

---

### CTR-03.3 — Qué es la respuesta correcta: una identidad, no un texto

> **Revisado el 2026-08-24 (`T-104`).** La v1 decía: *"La respuesta correcta del ítem **es**
> `fragmento.credito.tema`"*, y dedicaba tres consecuencias a que nadie escribiera el
> título dos veces. La propiedad se conserva y se refuerza; lo que cambia es que el título
> ya no se escribe **ninguna** vez.

> **La respuesta correcta es el tema del catálogo, y la comparación es por `slug`.**

`acierta(elegido, correcto)` compara `elegido.slug === correcto.slug`. En todo el juego no
hay una sola comparación de títulos. Consecuencias, que conviene ver escritas:

1. **La pregunta que la v1 dejó anotada como difícil desapareció.** El punto 4 de la v1
   avisaba que `RES-20` escribe *Jijiji* y el resto del repo *Ji ji ji*, y que decidir si
   son la misma respuesta no tiene una salida buena. Con buscador no hay que decidirlo: el
   jugador **elige** de una lista y lo que viaja es la identidad. La tolerancia de tipeo es
   un problema de **búsqueda** —perdonar tilde, espacio, palabra del medio— y no de
   **corrección**, que es donde estaba mal puesto.
2. **El título canónico es el de `RES-20`, literal, y no hay dónde escribir un segundo.**
   Si la ficha trae un título abreviado, el tema aparece abreviado en el buscador y en el
   reveal. Eso es un defecto de la ficha y se arregla en la ficha (`investigador`), no acá.
3. **El slug es la única cosa que el manifiesto y el catálogo tienen que compartir**, y por
   eso el build cruza uno contra otro (`CTR-03.6`, regla 1).
4. **La respuesta viaja al cliente en texto plano.** No es novedad: el archivo se pide como
   `/audio/fragmentos/<slug>.mp3`, así que quien abra la pestaña de red ya la tiene. Es un
   juego de honor, como cualquier trivia sin backend. **Cuándo** se muestra el crédito
   —solo al revelar— es de `experiencia`, y ya está resuelto en la pantalla.

*Alternativa descartada (de la v1, sigue valiendo):* un campo `respuesta` a nivel dato. Crea
una segunda copia del título que se puede desincronizar de la que se publica al lado del
audio.

---

### CTR-03.4 — Los seis pasos, sin un solo dato en el JSON

**El manifiesto no guarda ni un dato de los pasos.** Ni las duraciones, ni la cantidad, ni
el puntaje. La escalera vive en `CTR-01.9` y su implementación en
`src/lib/tema/escalera.ts`; el puntaje es de `BR-02`. El motor los lee como constantes.

Esto es posible porque **los seis pasos salen del mismo archivo de audio**: el motor
reproduce `[0, duración del paso]` sobre el `AudioBuffer` que ya tiene decodificado. Seis
pasos cuestan lo mismo que uno.

**La única atadura entre el dato y la escalera, y es una línea de aritmética:**

> `duracionSeg` ≥ duración del **paso 6** de `CTR-01.9`.

Con los números de hoy, y con la ventana de `CTR-01.3`, la franja válida es
**[14,90 – 15,15]**, y el build rechaza cualquier fragmento por debajo de **14,85**
(`indexarFragmentos()`, con el mensaje "el último paso sonaría a silencio"). Un fragmento
más corto que el paso 6 le devolvería silencio justo al jugador que gastó cinco intentos
para llegar ahí.

> **Revisado el 2026-08-24:** la v1 decía "los 5 pasos" y fijaba la franja en
> [10,00 – 10,10]. Cambiaron los dos números y **no cambió el diseño**: la propiedad que
> este contrato fue a buscar en `T-24` —que cambiar la escalera no migre ni un dato— se
> cumplió en el primer cambio real. `D-24` pasó de cinco pasos a seis y de 10 s a 15 s, y
> el archivo de datos no necesitó una sola edición: se volvió a correr el generador.

**Qué hay que tocar si algo cambia — y ninguna fila toca los datos a mano:**

| Cambia… | Qué hay que tocar |
|---|---|
| El **máximo** de `CTR-01.3` | La constante `DURACION_FRAGMENTO_SEG`, y re-correr el generador con `--rehacer`. |
| Las **duraciones** de la escalera | Solo `escalera.ts`. Nada del JSON. |
| La **cantidad** de pasos (es de `producto`) | Solo `escalera.ts`. Nada del JSON. Ya pasó, y salió así. |
| La **tabla de puntaje** (`BR-02`) | Solo `escalera.ts`. |

**Alternativas descartadas (de la v1, siguen valiendo):** guardar las duraciones por ítem
—habilitaría que un dato contradiga al contrato—; guardar `pasosDisponibles` —un número mal
tipeado rompe el puntaje en silencio—; permitir un override por tema —eso es renumerar
`BR-02` de a un tema por vez—.

---

### CTR-03.5 — `modoRespuesta`: **`"buscador"`**, y es el único valor

> **Cerrada el 2026-08-24 (`T-104`) con un valor que la v1 no contemplaba.** La v1 dejaba
> dos —`"opciones"` y `"texto"`—, elegía `"opciones"` como valor de trabajo y le pedía a
> `producto` que decidiera, con un pedido escrito en
> `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md`. **Decidió el usuario, en
> `D-24`, y eligió un tercero.**

- `modoRespuesta: "buscador"` → el jugador escribe, **elige de una lista de sugerencias** y
  lo que viaja es la identidad del tema. La lista son los 105 títulos de `RES-20` (o los
  del disco elegido), tengan audio o no.
- **El enum se reduce a un solo valor.** `"opciones"` y `"texto"` quedan registrados acá
  como descartados, no en el schema.
  *Por qué reducirlo:* ningún código del sitio implementa los otros dos, así que un archivo
  que los declarara se jugaría igual como buscador. Un enum que acepta valores que nadie
  respeta es una promesa falsa escrita en el contrato.
  *Alternativa descartada:* dejar los tres por si vuelven. Volver cuesta una línea y una
  revisión fechada; mantener la mentira cuesta que alguien la crea.

**Por qué `"buscador"` no es `"texto"` con otro nombre**, que es la confusión que hay que
prevenir: con texto libre hay que decidir si dos escrituras del mismo título son la misma
respuesta —el caso que la v1 anotó en `CTR-03.3`, punto 4— y esa decisión no tiene una
salida buena. Con lista, la comparación es de identidad y la pregunta no existe. El costo
de tipeo se paga en la **búsqueda**, donde equivocarse solo cuesta un resultado de más.

**El corolario, y es el que reescribió el contrato entero: no hacen falta distractores.**
Con buscador no hay tres títulos falsos que elegir por ítem, y como la respuesta correcta
sale del catálogo, **un ítem no necesita ningún dato propio**. De ahí que el banco haya
desaparecido y quede un manifiesto de archivos.

**Y el agujero aritmético de la v1 se cerró solo.** La v1 mostró que con cuatro opciones y
errar gratis, el que no reconocía nada sacaba 70 puntos de promedio: el azar pagaba más que
saber. `D-24` lo recalculó sobre 105 títulos: seis intentos al azar tienen ~5,5 % de sacar
algo, y dejan 99 títulos sin probar. **El azar dejó de pagar, así que la mecánica pudo
volverse generosa** —errar abre el escalón siguiente— sin vaciar la promesa de premiar al
que sabe. La cuenta es de `D-24`; acá se cita porque era el motivo por el que este contrato
no podía cerrar `CTR-03.5` solo.

**Lo que este contrato **no** decide del buscador, y es de otros:**

- **Qué tan tolerante es la búsqueda.** Hoy perdona tilde, espacio, palabra del medio y
  letra salteada, y la salteada solo si no hay nada mejor. Es mecanismo de pantalla:
  `experiencia`, con el mapa del juego de referencia como vara — que midió y descartó la
  búsqueda difusa por distancia de edición, porque `zzzzq` ofrecía temas de ZZ Top.
- **Cuántos resultados se muestran y hacia dónde se abre la lista.** `experiencia`.
- **El pozo por disco** (`D-24`, parte 4). El manifiesto no lo declara: sale de cruzar los
  temas jugables con el disco de cada uno, en `pozo()`.

**Techo de largo del título: 80 caracteres**, igual que la v1 y por la misma cuenta: el más
largo de la discografía tiene 61 (`RES-20`, track 1 de *Último bondi a Finisterre*). Ya no
hay opciones que dibujar, pero el buscador y el reveal tienen que bancar esos 61 caracteres
reales en pantalla chica.

---

### CTR-03.6 — Las dos reglas de veracidad: **cambian de lugar, no se aflojan**

> **Reescrita el 2026-08-24 (`T-104`).** La v1 volvía corribles dos criterios: `fuentes`
> obligatoria sin excepción, y `sensibleA` conteniendo siempre `audio`. Las dos eran campos
> del ítem, y no hay ítems. **Ninguna de las dos se retira: las dos se mudan al lugar donde
> hoy se pueden verificar de verdad.** El pedido del hilo principal las marcó como "no
> implementadas" y quería que se viera antes de que pareciera un olvido; esto es la
> respuesta.

#### Regla 1 — La fuente no es un campo: es un cruce que rompe el build

Lo que este juego afirma de cada tema es **título, disco, año y pista**. La v1 exigía
`fuentes: ["RES-20"]` en cada ítem para respaldarlo.

**Ahora esos cuatro datos no los afirma un dato: los lee de `RES-20` en build.** `catalogo()`
parsea la ficha, arma los 105 slugs y **cada entrada del manifiesto tiene que resolver
contra uno de ellos**. La que no resuelve rompe el build nombrando el archivo culpable. Es
la puerta de `D-13`, la misma que usa el cancionero, aplicada al audio.

**Por qué esto es más fuerte que el campo, y no una excusa:**

| | `fuentes: ["RES-20"]` en el ítem | El cruce en build |
|---|---|---|
| Qué comprueba la máquina | Que el string tenga el formato `RES-\d{2}` | Que el tema **exista en la ficha**, con ese título exacto |
| Un ítem sobre un tema inventado | **Valida** | Rompe el build |
| Un `RES-` que no sostiene lo que el ítem afirma | Valida (es el hallazgo `FIND-10`) | No puede pasar: el dato **sale** de la ficha |
| Quién lo puede olvidar | Quien carga | Nadie: no hay campo |

**La leyenda no se pierde ni se muda a la fuerza.** La v1 mandaba lo no fichado a
`explicacion` con su `rotulo`. Acá no hay prosa por tema, así que **no hay nada que
rotular**: el juego no afirma nada más que la discografía. Las tres casillas de `D-14`
—hecho, leyenda, testimonio— siguen vivas y sin un rasguño en `CTR-02` (quiz) y `CTR-04`
(letras), y en la Redondopedia. Si algún día el reveal de este juego suma un dato de color,
vuelve el par `explicacion` + `rotulo` tal como la v1 lo dejó escrito, y vuelve con la
regla de `revisor`: si la explicación afirma algo que la fuente no sostiene, falta el
rótulo.

#### Regla 2 — El mapa de derechos no es un campo: es la carpeta, y se lista con un comando

`sensibleA` existía para una sola cosa (`D-14`): poder encontrar en diez segundos qué hay
que bajar si llega un reclamo. La v1 lo garantizaba con `contains: {const: "audio"}`.

**Acá el mapa es más directo:** `public/audio/fragmentos/` son, uno a uno, los temas que el
sitio publica en audio, y `public/audio/temas/` son los que publica **enteros**, que es la
superficie mayor que abrió `D-22`. El manifiesto los lista a los dos —con el `titulo`
legible al lado y el booleano `entero`—, y el comando 3 de `CTR-03.10` los imprime.

**Qué se gana y qué se pierde, sin adornar:**

- **Se gana** que el mapa no se puede desincronizar: el generador lo escribe leyendo el
  disco, y el comando compara el disco contra el manifiesto y avisa si hay un mp3 sin
  declarar.
- **Se gana** granularidad de derechos: el booleano `entero` distingue 15 segundos de una
  grabación completa, cosa que el enum `letra | tapa | audio` no distinguía.
- **Se pierde** poder marcar como sensible a `letra` o a `tapa` una entrada de este juego.
  Hoy no hace falta —la pantalla del reveal no muestra tapa ni versos, muestra ficha y un
  enlace a la letra—, y el día que muestre alguna de las dos, la sensibilidad la declara la
  pantalla, no el manifiesto. Eso es de `experiencia` y de `UX-05`, que ya lleva el catálogo
  de dónde aparece cada tapa.

**Y una cosa que la v1 escribía y hay que retirar explícitamente:** decía que *"el
subconjunto publicable de `adivinar-tema.json` es vacío, por construcción"*, porque el gate
de `D-07` estaba cerrado. **`D-14` sacó ese cerrojo**: hoy nada se frena esperando permiso,
el riesgo lo asume el usuario y si llega un reclamo se baja el fragmento puntual. El comando
que la v1 usaba para contar lo publicable pierde sentido; el que lo reemplaza cuenta lo
publicado, que es lo que ahora sirve.

---

### CTR-03.7 — Spotify: retirado del dato

> **Retirado el 2026-08-24 (`T-104`).** La v1 reservaba `spotify: { trackId }` opcional por
> ítem, con el argumento de que servía igual para las dos vías que `ADR-01` mantenía vivas.

**`D-22` cambió la pregunta:** el tema completo lo sirve el sitio en mp3, sin cuenta y sin
Premium, así que Spotify bajó de ser la promesa a ser, como mucho, un enlace extra. El
manifiesto no lleva `trackId` y la partida no toca Spotify en ningún momento —lo que
`codigo-juegos.md` pedía y que ahora se cumple por ausencia, no por disciplina—.

**Qué pasa si vuelve.** No vuelve como campo de este archivo: un `trackId` no lo puede
averiguar el generador —no sale del disco del usuario— y `contenido` no tiene acceso a la
web. Volvería como un mapa aparte `slug → trackId`, cargado a mano, que el reveal consulta
si existe. **Un ID inventado es el peor modo de falla del proyecto**: pasa cualquier
validación de formato, no falla nunca, y manda al jugador a otro tema.

**`ADR-01` sigue abierto en esa parte**, y no la cierra este contrato: si Spotify se queda
como enlace externo al revelar o se retira del todo es decisión de `ADR-01` con `BR-06`.
Hoy el código no lo usa, que es la opción conservadora y la que no compromete ninguna de
las dos salidas.

---

### CTR-03.8 — El bloque normativo, y por qué **no** se baja a archivo

Draft 2020-12, igual que los otros contratos. **Este documento manda sobre cualquier copia.**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/adivinar-tema/2",
  "title": "CTR-03 v2 — Manifiesto de fragmentos de adiviná el tema",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "contratoVersion", "juego", "modoRespuesta", "actualizado", "fragmentos"],
  "properties": {
    "contrato": { "const": "CTR-03" },
    "contratoVersion": { "const": 2 },
    "juego": { "const": "adivinar-tema" },
    "modoRespuesta": { "const": "buscador" },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "nota": { "type": "string" },
    "fragmentos": {
      "type": "array",
      "minItems": 0,
      "items": { "$ref": "#/$defs/fragmento" }
    }
  },
  "$defs": {
    "fragmento": {
      "type": "object",
      "additionalProperties": false,
      "required": ["slug", "titulo", "duracionSeg", "entero"],
      "properties": {
        "slug": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
        "titulo": { "type": "string", "minLength": 1, "maxLength": 80 },
        "duracionSeg": { "type": "number", "minimum": 14.90, "maximum": 15.15 },
        "entero": { "type": "boolean" }
      }
    }
  }
}
```

**Tres números que salen de otro lado y no se tocan acá:** `minimum: 14.90` y
`maximum: 15.15` son la ventana de `CTR-01.3`; el patrón de `slug` es el de `CTR-01.4` y es
lo que produce `slugDeTitulo()`; los 80 caracteres de `titulo` son el techo de `CTR-03.5`.
**Si `CTR-01.3` mueve el máximo, estos dos literales se mueven con él.**

> **Decisión: no se crea `src/data/_schema/adivinar-tema.schema.json`.** Es lo contrario de
> lo que hicieron `CTR-02` y `CTR-04`, así que va con su motivo.
>
> 1. **La validación real ya existe y es más fuerte.** `indexarFragmentos()` corre en cada
>    build y comprueba lo único que un JSON Schema **no puede**: que el slug corresponda a
>    uno de los 105 temas de `RES-20`. Un schema diría que `tema-inventado` tiene forma de
>    slug; el build dice que ese tema no existe.
> 2. **El archivo lo escribe un script, no una persona.** Los schemas de `CTR-02` y `CTR-04`
>    protegen contra el error de carga a mano. Acá nadie carga a mano; el generador escribe
>    el archivo entero en cada corrida y pisa cualquier edición.
> 3. **Un schema suelto se desincroniza.** Sería una tercera copia de la ventana de
>    duración —después del contrato y de `escalera.ts`— y el día que el máximo cambie,
>    la que nadie va a acordarse de tocar es esa.
>
> *Alternativa descartada:* bajarlo igual, por uniformidad con los otros bancos. Se descarta
> por lo de arriba: la uniformidad valdría si el modo de falla fuera el mismo, y no lo es.
> **Cuándo se revierte:** el día que este archivo se edite a mano por cualquier motivo. Ahí
> el schema vuelve, y el bloque de arriba está listo para copiar.
>
> *Cambio de datos que esta decisión deja pendiente:* **ninguno.** El archivo de hoy valida
> contra este bloque tal como está.

---

### CTR-03.9 — Ejemplo, con lo que todavía no existe marcado

> **Advertencia que la v1 se ganó a pulso:** su ejemplo canónico salió con una ficha que no
> correspondía, un hecho falso y un `trackId` inventado que pasaba el schema y no apuntaba
> a nada. Acá los dos temas son reales y verificados contra `RES-20`, y **lo que no existe
> está puesto de forma que no valide**.

```json
{
  "contrato": "CTR-03",
  "contratoVersion": 2,
  "juego": "adivinar-tema",
  "modoRespuesta": "buscador",
  "actualizado": "<AAAA-MM-DD de la corrida — lo escribe el generador, no se pone a mano>",
  "nota": "Lista de archivos de audio que EXISTEN, no de temas.",
  "fragmentos": [
    { "slug": "todo-un-palo", "titulo": "Todo un palo", "duracionSeg": 15.02, "entero": true },
    { "slug": "vencedores-vencidos", "titulo": "Vencedores vencidos", "duracionSeg": 15.05, "entero": false }
  ]
}
```

**Qué es verdadero acá y con qué ficha:**

- **"Todo un palo" y "Vencedores vencidos" son temas reales de *Un baión para el ojo
  idiota* (1988)**, tracks 8 y 5. Fuente: **`RES-20`**, sección de ese disco, en
  `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`. Es la ficha que lista el tema exacto
  dentro del disco exacto, que es lo que el manifiesto necesita para resolver.
- **Los slugs** son los que produce `slugDeTitulo()` sobre esos títulos.
- **Las duraciones** son valores plausibles **dentro de la ventana**, del tipo que devuelve
  `ffprobe`: nunca 15,00 exacto, porque la trama del mp3 no lo permite.
- **`entero: true` en el primero** muestra el caso en que además existe
  `public/audio/temas/todo-un-palo.mp3`. Es el booleano que marca la superficie mayor de
  `D-22`.

**Qué está marcado como inexistente:** `actualizado`, con un texto que **no pasa** el patrón
de fecha. Si alguien copia este ejemplo tal cual, el comando 1 de `CTR-03.10` falla en vez
de dejar pasar una fecha verosímil e inventada.

---

### CTR-03.10 — Verificación: qué correr, y quién

`arquitectura` no tiene con qué ejecutar (`D-12`) y no lo simula. **Lo corre el hilo
principal en `T-107`**, o `revisor`.

```bash
# (1) el manifiesto contra este contrato: envoltorio, patron de slug y ventana de duracion
node -e "import('node:fs').then(({readFileSync})=>{const j=JSON.parse(readFileSync('src/data/adivinar-tema.json','utf8'));const p=/^[a-z0-9]+(-[a-z0-9]+)*$/,f=[];if(j.contrato!=='CTR-03')f.push('contrato');if(j.contratoVersion!==2)f.push('contratoVersion');if(j.juego!=='adivinar-tema')f.push('juego');if(j.modoRespuesta!=='buscador')f.push('modoRespuesta');if(!/^\d{4}-\d{2}-\d{2}$/.test(j.actualizado??''))f.push('actualizado');if(!Array.isArray(j.fragmentos))f.push('fragmentos');for(const x of j.fragmentos??[]){if(!p.test(x.slug??''))f.push('slug '+x.slug);if(!(x.duracionSeg>=14.90&&x.duracionSeg<=15.15))f.push('duracion '+x.slug);if(typeof x.titulo!=='string'||typeof x.entero!=='boolean')f.push('campos '+x.slug);if(Object.keys(x).length!==4)f.push('campos de mas en '+x.slug);}console.log(f.length?'DESALINEADO: '+f.join(', '):'OK CTR-03.1/.2/.8 · '+j.fragmentos.length+' fragmentos')})"

# (2) la regla 1 de CTR-03.6: cada slug resuelve contra los 105 de RES-20, y el pozo real
node -e "Promise.all([import('./src/lib/tema/catalogo.ts'),import('node:fs')]).then(([c,{readFileSync}])=>{const m=JSON.parse(readFileSync('src/data/adivinar-tema.json','utf8'));const cat=c.catalogo(m);console.log('catalogo:',cat.temas.length,'temas | jugables:',cat.jugables,'| piso de US-02: 30 =>',cat.jugables>=30?'cumplido':'faltan '+(30-cat.jugables))})"

# (3) la regla 2 de CTR-03.6: el mapa de derechos, y que no haya mp3 sin declarar
node -e "import('node:fs').then(({readFileSync,existsSync,readdirSync})=>{const j=JSON.parse(readFileSync('src/data/adivinar-tema.json','utf8'));const ls=(p)=>existsSync(p)?readdirSync(p).filter(x=>x.endsWith('.mp3')):[];const fr=ls('public/audio/fragmentos'),te=ls('public/audio/temas');console.log('fragmentos publicados:',fr.length,'| temas enteros:',te.length,'| declarados:',j.fragmentos.length,'(con entero:',j.fragmentos.filter(x=>x.entero).length+')');const h=fr.filter(a=>!j.fragmentos.some(x=>x.slug+'.mp3'===a));console.log(h.length?'MP3 SIN DECLARAR: '+h.join(', '):'todo mp3 en disco esta en el manifiesto');for(const x of j.fragmentos)console.log('  ·',x.slug,'—',x.titulo,x.entero?'[fragmento + entero]':'[fragmento]')})"

# (4) CTR-03.4 y CTR-03.5: la escalera y la comparacion por identidad, con los tests que ya existen
node --test src/lib/tema/catalogo.test.ts src/lib/tema/escalera.test.ts src/lib/tema/buscador.test.ts
```

**Qué chequea la máquina y qué no** — la tabla existe para que nadie confunda "validó" con
"está bien":

| # | Chequeo | Quién |
|---|---|---|
| 1 | Envoltorio, patrón de slug, ventana de duración, cuatro campos y nada más | comando (1) |
| 2 | Que cada slug sea uno de los 105 de `RES-20` (regla 1 de `CTR-03.6`) | comando (2), y el build |
| 3 | El piso de temas jugables de `US-02` | comando (2) |
| 4 | El mapa de derechos publicado, fragmento y entero (regla 2) | comando (3) |
| 5 | Que la respuesta se compare por identidad y no por texto | comando (4), `buscador.test.ts` |
| 6 | Que el mp3 exista y pase la tabla de `CTR-01.7` | el generador, al producirlo |
| 7 | Que los primeros 100 ms suenen | humano, con los oídos (`CTR-01.7`) |
| 8 | Que el título de `RES-20` esté completo y no abreviado | humano, contra la ficha |

---

### Consecuencias

- **`contenido` no tiene nada que cargar en este juego, y es definitivo, no una espera.**
  `D-24` borró los veinte ítems con cuatro distractores cada uno. La consecuencia de
  planificación de la v1 —"no abrir una tarea de `contenido` para `US-02` hasta que haya
  audio"— se reemplaza por una más simple: **no hay tarea de `contenido` para `US-02`.**
> **Nota del hilo principal al integrar el ciclo 7, 2026-08-24.** Los números de este punto
> se escribieron mientras `producto` los estaba moviendo: `T-99` y `T-104` corrieron en
> paralelo. Hoy `US-02` pide **30 ítems con al menos 8 fáciles**, no 20 con 5. **La pregunta
> no se cae, se afila:** la cuota por dificultad pasó de 5 a 8 sobre un pozo más grande, y
> sigue sin tener dónde vivir. El párrafo queda como lo escribió `arquitectura`, con los
> números viejos a la vista, porque corregirlos yo sería contestar por `producto`. El
> comando (2) sí lo actualicé a 30: ahí el número no es un argumento, es una medición.

- **Queda una pregunta para `producto`, y la dejo señalada sin resolverla:** `US-02` pide un
  piso de 20 ítems con **al menos 5 fáciles** (`BR-01`), y la dificultad era una etiqueta
  por ítem que ya no existe. El piso de 20 sí se puede medir —son 20 temas con fragmento en
  disco, comando (2)—, pero la cuota por dificultad no tiene dónde vivir: en un pozo de 105
  temas sorteados, qué tema es fácil depende del jugador, no de una etiqueta. Salidas
  posibles, todas de `producto`: retirar la cuota de `US-02`; reemplazarla por una regla de
  producción ("los primeros 20 fragmentos son de los temas más conocidos"); o pedir una
  etiqueta por tema, que sería un dato nuevo y **no** iría en el manifiesto —iría en el
  catálogo, al lado de `RES-20`—. *No lo decido: `BR-01` es de `producto` y `T-99` ya está
  reescribiendo `BR-02`.*
- **Lo que le impone al motor:** nada nuevo sobre `CTR-01.5`. Del manifiesto saca cuatro
  campos; todo lo demás lo deriva.
- **Lo que le impone a `experiencia`:** un buscador que ofrezca los 105 títulos con hasta 61
  caracteres reales en pantalla chica, y el crédito visible al revelar. Las cuatro opciones
  en zona pulgar que la v1 dejaba pedidas **ya no hacen falta**: ese pedido queda retirado.
- **Fácil:** cambiar la escalera, la duración o el bitrate. Se vuelve a correr el generador
  y ningún dato migra. Ya se demostró con `D-24`.
- **Difícil:** volver a un banco de ítems con prosa por tema. No imposible —el contrato
  viejo está entero acá arriba, sección por sección— pero sería un archivo nuevo al lado de
  este, no este archivo con campos agregados: el generador lo pisa en cada corrida.
- **Este contrato no frena nada.** El encuadre es `D-14`: si llega un reclamo, se borra el
  mp3, se vuelve a correr el generador y el tema desaparece del pozo sin tocar una línea de
  código.

### Qué NO decide este contrato

- **La tolerancia del buscador y cómo se ve la lista:** `experiencia`.
- **La tabla de puntaje y la mecánica de intentos:** `producto` (`BR-02`, `T-99`).
- **La cuota por dificultad de `US-02`:** `producto`, señalado arriba.
- **El techo de duración del fragmento:** `contenido` (`CNT-01`, sección A).
- **Qué temas se generan primero:** el usuario, con su carpeta y un comando.
- **Si Spotify vuelve como enlace al revelar:** `ADR-01`, abierto.
