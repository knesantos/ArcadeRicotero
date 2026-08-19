# ARQ — Schema de "adivinar el tema" (`US-02`)

> Rol dueño: `arquitectura`. Consume: `US-02`, `BR-01`, `BR-02`, `BR-04`, `BR-06`,
> `CTR-01` (todo, en especial `CTR-01.3`, `CTR-01.4`, `CTR-01.5`, `CTR-01.7`, `CTR-01.8`,
> `CTR-01.9`), `ADR-01` (sección "Fallback", cerrada), `RES-20` y `RES-22`
> (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`), `UX-03`, `D-06`, `D-07`, `D-09`,
> `D-12`, `.claude/rules/contenido-json.md`.
> Produce: **`CTR-03`**. Tarea: `T-24` del ciclo 2.
> Fecha: 2026-08-19.

---

## CTR-03 — Contrato del JSON de "adivinar el tema"

- **Estado:** **vigente con un valor de trabajo marcado.** Todo el contrato se puede usar
  hoy salvo **una** decisión que no es mía: si la respuesta se da con opción múltiple o
  con texto (`CTR-03.5`). El schema soporta las dos y la elección cambia **una clave**.
- **Por qué recién ahora.** `US-02` estuvo sin insumo todo el ciclo 1: nadie sabía qué
  temas existían. `RES-20` cerró ese hueco con **105 temas en diez discos, con duración y
  autoría por tema**, verificados contra el artículo de cada disco. Con 105 temas contra
  un piso de 20 (`US-02`), el material sobra; lo que faltaba era el contrato.
- **Para quién es esto:** para `contenido`, que va a cargar los 20 ítems, y para quien
  escriba el motor del juego 2. Los dos números que a `contenido` le van a molestar
  —`fragmento` completo y obligatorio, `fuentes` sin excepción— están explicados abajo con
  su motivo; si molestan, decilo antes de cargar veinte ítems, no después.

---

### CTR-03.1 — Archivo, envoltorio y presupuesto

**Archivo de datos:** `src/data/adivinar-tema.json`
**Copia corrible del schema:** `src/data/_schema/adivinar-tema.schema.json`

**Ninguno de los dos existe todavía y `T-24` no los crea** (§5 del plan del ciclo 2: la
copia sale cuando exista el primer ítem, con su propia tarea y su ejecutor). Los nombro
acá para que no se decidan dos veces.

```json
{
  "contrato": "CTR-03",
  "contratoVersion": 1,
  "juego": "adivinar-tema",
  "actualizado": "2026-08-19",
  "modoRespuesta": "opciones",
  "items": []
}
```

El envoltorio es **el mismo que el de `CTR-02`** (`contrato`, `contratoVersion`, `juego`,
`actualizado`, `items`), y eso es a propósito: un solo cargador de datos sirve para los
cuatro juegos, y quien lea `src/data/` no tiene que aprender dos formas de la misma cosa.
La única clave nueva a nivel archivo es `modoRespuesta`, y su motivo está en `CTR-03.5`.

**Un banco por juego, no un banco único.** Descarté meter los temas dentro de
`src/data/quiz.json` con una `categoria` nueva: son ítems con **forma distinta** (llevan
audio obligatorio, no llevan `enunciado`) y compartir archivo obligaría a que el schema del
quiz acepte campos que no le sirven, además de poner a dos tareas a escribir el mismo
archivo — que es el choque que la §4 del plan del ciclo 2 pasó el ciclo entero evitando.

**Presupuesto de tamaño:** 20 ítems × ~800 bytes ≈ **16 KB**, dos órdenes de magnitud
debajo del techo de 150 KB de `CTR-02.1`. Aun con los 105 temas de `RES-20` cargados
enteros serían ~85 KB: el archivo no es el problema.

**Presupuesto de audio: no lo fija este contrato, lo fija `CTR-01.5` y no cambia con el
tamaño del pool.** La ventana de precarga es *el tema en juego + 2*, con techo de 3
buffers residentes (≈ 5,3 MB de RAM). **20 ítems en el JSON no son 20 buffers en
memoria**; que el pool crezca de 20 a 105 no toca el presupuesto de gama baja en un solo
byte. Lo escribo porque es la confusión más fácil de cometer al ver un piso de ítems.

---

### CTR-03.2 — El ítem, campo por campo

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| `id` | string `^TM-\d{3}$` | sí | Contador propio, **`TM-001`+**. No comparte contador con `QZ-NNN` del quiz. |
| `us` | array de `^US-\d{2}$`, ≥ 1 | sí | Hoy siempre `["US-02"]`. Lo pide `.claude/rules/contenido-json.md`. |
| `dificultad` | `facil` \| `media` \| `dificil` | sí | `BR-01`. Mismo vocabulario que `CTR-02`, a propósito. |
| `fragmento` | objeto de **`CTR-01.8`** | sí | Completo. Trae adentro `credito.tema`, `credito.disco`, `credito.anio`. Ver `CTR-03.3`. |
| `opciones` | array de exactamente 4 | **según `modoRespuesta`** | Solo si `modoRespuesta` es `"opciones"`. Ver `CTR-03.5`. |
| `respuestasAceptadas` | array de string, ≥ 1 | **según `modoRespuesta`** | Solo si `modoRespuesta` es `"texto"`. El primer elemento es el título canónico. |
| `explicacion` | string 10–400 | no | El dato de color que se muestra al revelar. Opcional a propósito (abajo). |
| `rotulo` | objeto `{tipo, texto}` | no | Obligatorio **si** la `explicacion` no se apoya solo en hecho verificado. Ver `CTR-03.6`. |
| `fuentes` | array de `^RES-\d{2}$`, ≥ 1 | **sí, siempre** | Sin excepción de leyenda. Ver `CTR-03.6`. |
| `sensibleA` | array del enum `letra` \| `tapa` \| `audio` | **sí, y siempre contiene `audio`** | Ver `CTR-03.6`. |
| `spotify` | objeto `{trackId}` | **no** | `ADR-01`: un ítem sin `trackId` es válido y jugable. Ver `CTR-03.7`. |
| `estado` | `borrador` \| `listo` \| `retirado` | sí | Mismo enum que `CTR-02`. Las cuotas se cuentan solo sobre `listo`. |
| `notaInterna` | string | no | No se muestra nunca. |

**Lo que este ítem NO tiene, y por qué:**

- **No tiene `enunciado`.** El enunciado de este juego es el audio. Un campo de texto ahí
  invitaría a escribir pistas —"un tema de 1988 que…"— y eso convierte el juego de
  reconocimiento de oído en otra cosa. Si `producto` quiere una pista textual, es una
  regla de negocio nueva (`UX-03` ya descartó la vía sin audio por ese mismo motivo), y
  entra como campo nuevo en una v2.
- **No tiene `tema`, `disco` ni `anio` a nivel ítem.** Ver `CTR-03.3`. Es la regla más
  importante de este contrato.
- **No tiene nada de los 5 pasos.** Ver `CTR-03.4`.
- **No tiene `categoria`.** Las cuatro categorías (`historia`, `discos`, `letras`,
  `mitologia`) son del quiz: acá todos los ítems son de la misma naturaleza. `US-02` pide
  cuota por dificultad (≥ 5 fáciles), no por categoría.

**`explicacion` opcional y no obligatoria como en `CTR-02`.** Alternativa descartada:
copiarle a `CTR-02` la obligatoriedad. La descarto porque el costo dominante de un ítem
acá no es el texto sino **producir el audio** (`US-02`: "por qué 20 y no 40"), y exigir 400
caracteres de prosa por ítem le agrega costo a un banco cuyo cuello de botella es el
recorte manual del usuario. La revelación ya está completa sin ella: título, disco, año y
puntaje son datos locales (`ADR-01`, fallback, punto 1).

---

### CTR-03.3 — Lo que este contrato **no** redeclara: tema, disco y año

`CTR-01.8` declaró el objeto `credito` **fuente canónica** de tema/disco/año para
cualquier juego con audio, con la instrucción explícita de que `CTR-03` no los vuelva a
declarar. Acá se cumple, y en su forma más fuerte:

> **La respuesta correcta del ítem *es* `fragmento.credito.tema`.** No hay un campo
> `respuesta` que la duplique.

Consecuencias, que conviene ver escritas:

1. **Un tema no puede tener dos títulos dentro del mismo ítem.** No porque alguien lo
   revise: porque no hay dónde escribir el segundo.
2. **Si el modo es opción múltiple, la opción marcada `correcta: true` tiene que tener
   `texto` idéntico a `fragmento.credito.tema`** — carácter por carácter. Es un chequeo de
   script (`CTR-03.10`, chequeo 1), no de JSON Schema, y es el que impide que la opción
   correcta diga "Ji ji ji" mientras el crédito dice "Jijiji".
3. **Si el modo es texto, el primer elemento de `respuestasAceptadas` tiene que ser ese
   mismo título**, y el resto son variantes aceptadas.
4. **El título se copia literal de `RES-20`, nunca de memoria.** `RES-20` avisa que CMTV
   tiene al menos un error de tipeo ("Superógico" por **Superlógico**) y que la fuente
   buena es el artículo de cada disco. Y ojo con dos casos reales de esa misma ficha:
   `RES-20` escribe **"Jijiji"** (Oktubre, track 7) mientras el resto del repo escribe
   "Ji ji ji"; y lista **"Una piba con la remera de Greenpeace…"** con puntos suspensivos,
   o sea **abreviado**. Un título que la ficha trae abreviado **no alcanza** para llenar
   `credito.tema`: ese ítem no se carga hasta que una ficha lo traiga completo.
5. **La respuesta viaja al cliente en texto plano.** No es novedad ni la trae este campo:
   `CTR-01.8` ya lo dejó dicho —el archivo se pide como `/audio/fragmentos/<slug>.mp3`, así
   que quien abra la pestaña de red ya tiene el título—. **Cuándo** se muestra el crédito
   (solo al revelar) es de `experiencia`.

**Alternativa descartada:** un campo `respuesta` a nivel ítem, más cómodo de leer para el
motor. Descartada porque crea una segunda copia del título que puede desincronizarse del
crédito, y el crédito es el que se publica al lado del audio: un crédito equivocado es un
dato falso publicado junto a material de terceros. Que el motor tenga que escribir
`item.fragmento.credito.tema` es más feo y no se puede romper.

---

### CTR-03.4 — Los 5 pasos de `BR-02`, sin volver a fijar los segundos

**El JSON no guarda ni un solo dato de los pasos.** Ni las duraciones, ni la cantidad, ni
el puntaje. La escalera vive en **`CTR-01.9`** (0,1 / 0,5 / 2,0 / 5,0 / 10,0 s) y el
puntaje en **`BR-02`** (100/80/60/40/20); el motor los lee de ahí como constantes.

Esto es posible por algo que `CTR-01.9` ya demostró y que conviene repetir: **los 5 pasos
salen del mismo archivo**, no de cinco recortes. El motor reproduce
`[t0, t0 + duración del paso]` sobre el `AudioBuffer` que ya tiene decodificado. Cinco
pasos cuestan lo mismo que uno.

**La única atadura entre el dato y la escalera, y es una sola línea de aritmética:**

> `fragmento.duracionSeg` ≥ duración del **paso 5** de `CTR-01.9`.

Con los números de hoy, y sumando el techo de `CTR-01.3` (10,0 s con tolerancia de trama
de 10,10 s), la ventana válida es **[10,00 – 10,10]**. Un fragmento más corto que el paso 5
haría que el último escalón reproduzca silencio al final y que el jugador que pagó 80
puntos de descuento reciba menos audio del que la tabla le promete.

**Qué pasa si algo cambia — las tres puertas, y ninguna toca `BR-02`:**

| Cambia… | Qué hay que tocar |
|---|---|
| El **máximo** de `CTR-01.3` (p. ej. si `RES-11`/`RES-12` obligan a bajar a 8,0 s) | La ventana de `duracionSeg` en la copia corrible, y re-exportar los fragmentos con `CTR-01.6` paso 2. **Ni un campo nuevo, ni un ítem editado a mano.** |
| Las **duraciones** de la escalera (`CTR-01.9`) | Nada del JSON. Es una constante del motor. |
| La **cantidad** de pasos (`BR-02`, y es de `producto`) | **Nada del JSON.** Cero migración de datos. Esta es la propiedad que buscaba el diseño. |

**Alternativas descartadas, las tres por el mismo motivo de fondo:**

- **Guardar las 5 duraciones por ítem.** Permitiría que un archivo de datos contradiga a
  `CTR-01.9`, y ahí ya no hay fuente única: gana el que se leyó último.
- **Guardar `pasosDisponibles: 5` por ítem.** Redundante con `BR-02` y peligroso: un `4`
  mal tipeado rompe la tabla de puntaje en silencio, sin que nada falle.
- **Permitir un override por ítem para casos especiales** (un tema con intro larguísima).
  Descartada: eso es renumerar `BR-02` de a un ítem por vez, que es exactamente lo que
  `T-24` tiene prohibido. Si un tema no funciona con la escalera común, el problema es del
  recorte (`CTR-01.2` permite mover `inicioEnTemaSeg`), no de la escalera.

**Para `experiencia`:** `UX-03` necesita 5 estados visuales distinguibles y no necesita
ningún dato del JSON para dibujarlos. La animación se sincroniza contra la constante, igual
que el audio.

---

### CTR-03.5 — Las opciones de respuesta: qué decido y qué **no**

#### Lo que decido (arquitectura)

**El schema soporta los dos mecanismos y obliga a elegir uno, a nivel archivo:**

- `modoRespuesta: "opciones"` → cada ítem lleva `opciones`: exactamente **4**, con
  exactamente una `correcta: true`.
- `modoRespuesta: "texto"` → cada ítem lleva `respuestasAceptadas`, lista no vacía cuyo
  primer elemento es el título canónico.

**Por qué a nivel archivo y no por ítem.** Mezclar mecanismos de input entre ítems del
mismo juego hace que la partida cambie de forma sin motivo visible para el jugador, y
además vuelve la decisión de `producto` un dato disperso en veinte lugares. A nivel
archivo es **una clave** el día que se decida.
*Alternativa descartada:* `modoRespuesta` por ítem, que habilitaría "fácil con opciones,
difícil tipeando". Es una idea razonable **y es de `producto`**: `BR-01` define la
dificultad como una etiqueta de tres valores, no como un cambio de mecánica. Si la eligen,
`CTR-03` va a v2 y el cambio es mover una clave de nivel — barato, y por eso no lo
adelanto.

**Techo de `opciones[].texto` y de `credito.tema`: 80 caracteres, no 60 como en `CTR-02`.**
No es capricho y sale de contar, no de estimar: el título más largo de la discografía,
según `RES-20`, es **"Las increíbles andanzas del Capitán Buscapina en Cybersiberia"**
(*Último bondi a Finisterre*, track 1) y tiene **61 caracteres**. Con el techo de 60 de
`CTR-02`, ese tema **no entra en una opción** — y no es un caso raro, es el track 1 de un
disco. Los 80 dejan margen para el título abreviado de `Momo Sampler` cuando aparezca
completo, sin llegar a permitir un párrafo.

> **Para `experiencia`, y es consecuencia directa:** si gana opción múltiple, la pantalla
> tiene que bancar **cuatro opciones de hasta ~61 caracteres reales** en zona pulgar,
> además de los controles del reveal. No es el caso teórico del techo: es un tema del
> banco.

#### Lo que **no** decido, y por qué no es mío

`BR-04` fija 4 opciones y dice, textual, **"Aplica a `US-01` y a `US-04`"**. No nombra a
`US-02`, y `US-02` deja el mecanismo de input explícitamente fuera de la historia. O sea:
**hoy no existe una regla de producto que diga cómo se responde en este juego.**

Hay un argumento fuerte a favor de la opción múltiple —`D-09`, "jugable con el pulgar", es
no negociable, y `US-04` lo cita para prohibir el tipeo— y **por eso dejo `"opciones"`
como valor de trabajo**. Pero encontré una consecuencia aritmética que hace que la
coherencia con `BR-04` **no sea automática**, y no me corresponde resolverla:

> **Con 4 opciones y la mecánica de `BR-02` tal como está escrita, adivinar al azar en el
> paso 1 rinde más que acertar de verdad en el paso 5.**
>
> `BR-02` dice que errar antes no cambia el cálculo: el puntaje depende solo del paso más
> alto alcanzado al acertar. Entonces tirar una opción en cada paso es gratis y va
> descartando:
>
> | Paso | Opciones que quedan | Prob. de pegarla ahí | Puntos | Aporte |
> |---|---|---|---|---|
> | 1 | 4 | 1/4 | 100 | 25 |
> | 2 | 3 | 1/3 | 80 | 20 |
> | 3 | 2 | 1/2 | 60 | 15 |
> | 4 | 1 | 1/1 | 40 | 10 |
> | | | | **Esperado** | **70** |
>
> Un jugador que **no reconoce absolutamente nada** saca 70 puntos de promedio y **nunca
> baja de 40**, sin escuchar. El que se lo sabe de memoria saca 100. La distancia entre
> saber y no saber se reduce a 30 puntos sobre 100, y el paso 5 (20 puntos) queda
> inalcanzable: nadie lo usa nunca. Eso vacía la promesa de "premiar al que sabe" (`D-09`)
> igual que lo hacían las 3 opciones que `BR-04` descartó, y por la misma cuenta de azar
> que `BR-04` usó para descartarlas — solo que multiplicada por cinco intentos gratis.

Las salidas son todas de `producto` y no elijo ninguna: extender `BR-04` igual y aceptar
la cuenta; que un error consuma un paso; que las opciones aparezcan recién en el paso N;
o que el juego se responda con texto. **Pedido dejado en**
`Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md`.

**Lo bueno: la decisión no frena la carga de contenido.** Como la respuesta correcta vive
en `fragmento.credito.tema` y no en `opciones` (`CTR-03.3`), un ítem se puede cargar entero
antes de que `producto` conteste. Lo único que depende de la respuesta son los **tres
distractores** —y salen de la lista de 105 títulos de `RES-20`, que ya está en disco—.
Ningún trabajo de `contenido` se pierde por esperar.

---

### CTR-03.6 — Las dos reglas de veracidad de `CTR-02`, adaptadas y **más duras**

`CTR-02` convirtió dos criterios blandos en validaciones de máquina. Acá las dos siguen
vivas, y las dos se endurecen. El motivo es uno solo: **un ítem de este juego publica
material de terceros al lado de una afirmación**, cosa que una pregunta de texto no hace.

#### Regla 1 — `fuentes` es obligatoria **siempre**, sin la salida de la leyenda

En `CTR-02`, `fuentes` se exige salvo que el ítem esté rotulado como leyenda. **Acá no hay
salvo.** `fuentes` tiene `minItems: 1` y punto.

**Por qué se puede ser más duro:** lo que este ítem afirma en su núcleo es
**tema + disco + año**, y eso es dato discográfico. No existe la versión "leyenda" de en
qué disco está un tema: o está fichado o no se carga. Con `RES-20` en disco, exigirlo no
cuesta nada — la ficha cubre los 105 temas.

**Y la leyenda no se pierde, se muda al lugar donde sí puede aparecer:** el dato de color
de `explicacion`. Para eso está `rotulo`:

```json
"rotulo": { "tipo": "testimonio", "texto": "<quién lo cuenta y dónde>" }
```

- `tipo`: `leyenda` | `testimonio`.
- `texto`: 20 a 200 caracteres, y tiene que decir **quién lo cuenta y dónde** — misma
  exigencia que `CTR-02` le pone a `rotuloLeyenda`.
- **Regla que la máquina no puede ver y `revisor` sí:** si la `explicacion` afirma algo que
  las `fuentes` del ítem no respaldan, falta el `rotulo`. Es el hallazgo tipo `FIND-10`
  (cita verdadera que no sostiene la afirmación) aplicado a este banco.
- El schema sí verifica lo que puede: que `rotulo` no exista sin `explicacion`, y que si
  existe traiga `tipo` y un `texto` de largo mínimo — un rótulo vacío no valida.

> **Dependencia declarada con `T-16`, y se resuelve a favor de `CTR-02`.** Mientras escribo
> esto, otro tramo está agregando la categoría **testimonio** a `CTR-02` y todavía no tiene
> nombre de campo. **No adiviné el nombre ni copié el bloque.** Si `CTR-02` v2 nombra ese
> rótulo distinto de `rotulo`/`tipo: "testimonio"`, **manda `CTR-02`** y esta sección se
> alinea en `CTR-03` v2: es renombrar una clave en un archivo que hoy no tiene ítems, o
> sea gratis. Lo que **no** se negocia en ninguna de las dos versiones es la propiedad: el
> rótulo dice quién lo cuenta y dónde, o no valida.

#### Regla 2 — `sensibleA` nunca está vacío: **todo ítem de este juego contiene `audio`**

En `src/data/quiz.json` los quince ítems vigentes tienen `sensibleA: []`, y está bien: son
texto. Acá eso es imposible por schema —`minItems: 1` más `contains: {const: "audio"}`—
porque **`fragmento` es obligatorio**: no existe un ítem de `US-02` sin audio.

Vocabulario compartido con `CTR-02`, sin inventar valores nuevos: `letra`, `tapa`, `audio`.
`letra` se suma si la `explicacion` cita versos (tope de `BR-03`); `tapa`, si la pantalla
de revelación muestra la tapa del disco.

**Para qué sirve que esto sea un campo y no una advertencia.** `D-07` es un gate real de
publicación, y `CTR-02` lo volvió **corrible**. Acá la consecuencia es más fuerte y hay que
decirla completa:

> Mientras la nota de derechos del audio siga abierta (`CNT-01` sección A, fichas `RES-11`
> y `RES-12` pedidas en `T-22`), **el subconjunto publicable de `adivinar-tema.json` es
> vacío, por construcción, y se puede demostrar con un comando** (`CTR-03.10`, comando 3).
> El juego entero está detrás del gate. Eso no es una opinión sobre el riesgo: es lo que
> el filtro devuelve.

Esto también hace visible algo que `D-05` deja implícito: `US-04` es el primero que se cae
por derechos, pero **`US-02` es el segundo**, y su exposición no se mitiga recortando el
piso — se mitiga solo con la ficha o bajando la duración de `CTR-01.3`.

**Alternativa descartada:** dejar `sensibleA` libre como en `CTR-02` y confiar en que
`contenido` ponga `["audio"]` en cada ítem. Descartada por el mismo argumento que `D-12`
dejó documentado: la autoverificación falla incluso con buen criterio. Si el campo se puede
olvidar, un día se olvida, y el ítem olvidado es justo el que se cuela cuando alguien filtre
por "lo que sí se puede publicar".

---

### CTR-03.7 — Spotify: opcional, y la partida no depende de él

```json
"spotify": { "trackId": "<22 caracteres alfanuméricos>" }
```

- **El objeto entero es opcional.** Un ítem sin `spotify` **es válido, es jugable y llega
  al final de la partida** — punto 3 del fallback de `ADR-01`, que está cerrado y no espera
  ninguna evidencia. Ningún validador rechaza un tema por no estar en Spotify.
- `trackId` es el mismo dato para las dos opciones que siguen vivas en `ADR-01` (embed y
  deep link), así que **`contenido` puede cargar IDs hoy sin riesgo de trabajo perdido**,
  gane la que gane cuando cierren `E-04` y `E-07`.
- **`trackId` no es inventable.** Sale de la URL del tema en Spotify y `contenido` no tiene
  acceso a la web. Antes que un ID plausible, **el campo se omite**: un ID inventado pasa el
  patrón de 22 caracteres, no falla ninguna validación y manda al jugador a otro tema o a un
  404. Es el modo de falla más caro de detectar de todo el contrato.
- **Qué se le promete al jugador con este campo: lo que dice `BR-06`**, un acceso directo
  para escuchar el tema en Spotify, **sin garantizar que suene completo sin salir del
  sitio**. El copy no es mío, pero el campo no habilita más que eso.
- **Nada de Spotify durante la partida** (`ADR-01`, fallback, punto 7): el `trackId` se usa
  recién después de revelar y solo si el jugador toca el botón.

---

### CTR-03.8 — El bloque JSON Schema, completo y listo para pegar

Draft 2020-12, igual que `CTR-02`. **Este documento manda sobre la copia:** si mañana
`src/data/_schema/adivinar-tema.schema.json` se desincroniza de esto, manda esto.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/adivinar-tema/1",
  "title": "CTR-03 — Banco de adivinar el tema",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "contratoVersion", "juego", "actualizado", "modoRespuesta", "items"],
  "properties": {
    "contrato": { "const": "CTR-03" },
    "contratoVersion": { "const": 1 },
    "juego": { "const": "adivinar-tema" },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "modoRespuesta": { "enum": ["opciones", "texto"] },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/item" }
    }
  },
  "allOf": [
    {
      "if": {
        "required": ["modoRespuesta"],
        "properties": { "modoRespuesta": { "const": "opciones" } }
      },
      "then": {
        "properties": { "items": { "items": { "required": ["opciones"] } } }
      }
    },
    {
      "if": {
        "required": ["modoRespuesta"],
        "properties": { "modoRespuesta": { "const": "texto" } }
      },
      "then": {
        "properties": { "items": { "items": { "required": ["respuestasAceptadas"] } } }
      }
    }
  ],
  "$defs": {
    "item": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "us", "dificultad", "fragmento", "fuentes", "sensibleA", "estado"],
      "properties": {
        "id": { "type": "string", "pattern": "^TM-\\d{3}$" },
        "us": {
          "type": "array", "minItems": 1,
          "items": { "type": "string", "pattern": "^US-\\d{2}$" }
        },
        "dificultad": { "enum": ["facil", "media", "dificil"] },
        "fragmento": { "$ref": "#/$defs/fragmento" },
        "opciones": {
          "type": "array",
          "minItems": 4,
          "maxItems": 4,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/opcion" },
          "contains": {
            "type": "object",
            "required": ["correcta"],
            "properties": { "correcta": { "const": true } }
          },
          "minContains": 1,
          "maxContains": 1
        },
        "respuestasAceptadas": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": { "type": "string", "minLength": 1, "maxLength": 80 }
        },
        "explicacion": { "type": "string", "minLength": 10, "maxLength": 400 },
        "rotulo": { "$ref": "#/$defs/rotulo" },
        "fuentes": {
          "type": "array", "minItems": 1, "uniqueItems": true,
          "items": { "type": "string", "pattern": "^RES-\\d{2}$" }
        },
        "sensibleA": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": { "enum": ["letra", "tapa", "audio"] },
          "contains": { "const": "audio" },
          "minContains": 1
        },
        "spotify": {
          "type": "object",
          "additionalProperties": false,
          "required": ["trackId"],
          "properties": {
            "trackId": { "type": "string", "pattern": "^[A-Za-z0-9]{22}$" }
          }
        },
        "estado": { "enum": ["borrador", "listo", "retirado"] },
        "notaInterna": { "type": "string" }
      },
      "allOf": [
        {
          "if": { "required": ["rotulo"] },
          "then": { "required": ["explicacion"] }
        }
      ]
    },
    "fragmento": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "archivo", "duracionSeg", "inicioEnTemaSeg",
        "canales", "origen", "fechaCorte", "credito"
      ],
      "properties": {
        "archivo": { "type": "string", "pattern": "^[a-z0-9]+(-{1,2}[a-z0-9]+)*$" },
        "duracionSeg": { "type": "number", "minimum": 10.0, "maximum": 10.10 },
        "inicioEnTemaSeg": { "type": "number", "minimum": 0 },
        "canales": { "enum": [1, 2] },
        "origen": { "type": "string", "minLength": 3 },
        "fechaCorte": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
        "credito": {
          "type": "object",
          "additionalProperties": false,
          "required": ["tema", "disco", "anio"],
          "properties": {
            "tema": { "type": "string", "minLength": 1, "maxLength": 80 },
            "disco": { "type": "string", "minLength": 1, "maxLength": 80 },
            "anio": { "type": "integer", "minimum": 1985, "maximum": 2000 }
          }
        }
      }
    },
    "opcion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["texto", "correcta"],
      "properties": {
        "texto": { "type": "string", "minLength": 1, "maxLength": 80 },
        "correcta": { "type": "boolean" },
        "nota": { "type": "string", "maxLength": 200 }
      }
    },
    "rotulo": {
      "type": "object",
      "additionalProperties": false,
      "required": ["tipo", "texto"],
      "properties": {
        "tipo": { "enum": ["leyenda", "testimonio"] },
        "texto": { "type": "string", "minLength": 20, "maxLength": 200 }
      }
    }
  }
}
```

**Tres números del bloque que salen de otro lado y no se tocan acá:**

- `duracionSeg` **`minimum: 10.0`** ← paso 5 de `CTR-01.9`. `maximum: 10.10` ← tolerancia
  de trama de `CTR-01.3`. **Si `CTR-01.3` cambia el máximo, estos dos literales cambian con
  él**: son la única parte del schema acoplada a la duración, y por eso están juntos.
- `credito.anio` **1985–2000** ← rango real de la discografía según `RES-20` (*Gulp!* 1985,
  *Momo Sampler* 17-nov-2000). No es un rango de gusto: atrapa el `1898` por `1988` y el
  año de un disco que no es de la banda. Si algún día entra material fuera del rango, se
  sube el techo **con la ficha en la mano**, no con un parche.
- `archivo` acepta el doble guion (`-{1,2}`) por la regla de colisión de `CTR-01.4`
  (`ji-ji-ji--en-directo`).

**`$defs.fragmento` es la transcripción a schema de `CTR-01.8`, no una segunda
declaración.** Si difieren, manda `CTR-01`. **Recomendación para cuando se baje a archivo:**
sacarlo a `src/data/_schema/fragmento.schema.json` y que `CTR-03` (y cualquier contrato
futuro con audio) lo traiga por `$ref`. Con un solo juego con audio la copia es tolerable;
con dos deja de serlo.

---

### CTR-03.9 — Ejemplo, con los inventos marcados como inventos

> **Advertencia sobre este ejemplo, y viene de un error propio.** El ejemplo canónico de
> `CTR-02` salió con tres defectos que llegaron hasta `contenido`: citaba una ficha que no
> correspondía, después otra que tampoco sostenía la afirmación, el hecho era falso, y
> llevaba un `trackId` inventado que **pasa el schema y no apunta a nada**. Acá: el hecho
> es verdadero y verificado, la ficha citada es la que lo sostiene, y **todo valor que hoy
> no existe está puesto de forma que NO valide**, para que un copiar-pegar reviente en vez
> de colarse.

```json
{
  "id": "TM-001",
  "us": ["US-02"],
  "dificultad": "facil",
  "fragmento": {
    "archivo": "todo-un-palo",
    "duracionSeg": 10.0,
    "inicioEnTemaSeg": 0,
    "canales": 1,
    "origen": "youtube",
    "fechaCorte": "<AAAA-MM-DD del recorte — NO EXISTE TODAVIA, no inventar>",
    "credito": {
      "tema": "Todo un palo",
      "disco": "Un baión para el ojo idiota",
      "anio": 1988
    }
  },
  "opciones": [
    { "texto": "Todo un palo", "correcta": true },
    { "texto": "Vencedores vencidos", "correcta": false },
    { "texto": "Nuestro amo juega al esclavo", "correcta": false },
    { "texto": "Un poco de amor francés", "correcta": false }
  ],
  "fuentes": ["RES-20"],
  "sensibleA": ["audio"],
  "estado": "borrador"
}
```

**Qué es verdadero acá y con qué ficha, uno por uno:**

- **"Todo un palo" es el track 8 de *Un baión para el ojo idiota*, disco de 1988** (9 de
  mayo de 1988, Del Cielito). Fuente: **`RES-20`**, sección "Un baión para el ojo idiota",
  en `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`. **Por qué esa ficha y no otra:**
  `RES-20` es la que lista ese tema exacto dentro de ese disco exacto con su duración —que
  es literalmente lo que el ítem afirma—. `RES-02` da los álbumes pero no los temas, así
  que **no** sostendría esta afirmación y citarla sería el error de `FIND-10`.
- **Los tres distractores son títulos reales de la misma ficha:** "Vencedores vencidos"
  (mismo disco, track 5), "Nuestro amo juega al esclavo" (*¡Bang! ¡Bang!… Estás
  liquidado*, track 9) y "Un poco de amor francés" (*La mosca y la sopa*, track 3).
  **Un distractor inventado sería un dato falso mostrado al jugador**, aunque nunca sea la
  respuesta correcta: en un juego sobre una banda real, cuatro títulos en pantalla son
  cuatro afirmaciones de que esos temas existen. Chequeo 3 de `CTR-03.10`.
- **El slug `todo-un-palo`** sale de aplicar `CTR-01.4` al título; es el mismo que ese
  contrato usa de ejemplo.

**Qué está marcado como inventado, y cómo:**

| Valor | Estado real | Cómo está puesto |
|---|---|---|
| `fechaCorte` | **No existe ningún fragmento todavía** (`CTR-01`: "el audio no existe todavía"). Lo sabe solo quien recorte. | Texto que **no pasa** el patrón `AAAA-MM-DD`. Si alguien copia el ejemplo tal cual, el validador falla. |
| `duracionSeg: 10.0` | Es el valor **esperado** si se recorta con `CTR-01.6`, no una medición. | Se reemplaza por el `duration` real que devuelve `ffprobe` (`CTR-01.7`). |
| `spotify` | El `trackId` de este tema **no lo tengo y no puedo tenerlo** (sin acceso a la web). | **El objeto no está.** Es la forma correcta de no saberlo, y de paso muestra que un ítem sin Spotify es válido (`ADR-01`). |
| `estado: "borrador"` | Sin audio no hay ítem `listo`. | Explícito. |

**Segundo ejemplo, parcial: cómo se ve un `rotulo` de testimonio.** Se apoya en `RES-22`,
que trae del memoir que **el Indio no quería ni editar "Mi perro dinamita" y terminó siendo
uno de los más populares** — tema real: *La mosca y la sopa* (1991), track 4, uno de los
dos únicos con **Semilla Bucciarelli** como tercer autor (`RES-20`).

```json
"explicacion": "El Indio contó que no quería ni editar este tema, y terminó siendo uno de los más populares de la banda.",
"rotulo": {
  "tipo": "testimonio",
  "texto": "Lo cuenta el propio Indio Solari en «Recuerdos que mienten un poco» (ficha RES-22)"
},
"fuentes": ["RES-20", "RES-22"]
```

> **Y este ítem, tal como está, todavía no se carga.** `RES-22` no dice en qué capítulo
> aparece, y el rótulo de testimonio tiene que decir **dónde**. Falta el capítulo, así que
> falta el rótulo completo. Lo dejo escrito en vez de rellenarlo con algo verosímil: eso —
> tildar la casilla y seguir — es el riesgo declarado del ciclo 2, y un ejemplo del
> contrato es el peor lugar para dar el mal ejemplo.

---

### CTR-03.10 — Verificación: qué correr, cuándo, y **quién**

**Hoy `T-24` se verifica de forma documental y no hay nada que ejecutar**, porque no
existen ni `src/data/adivinar-tema.json` ni la copia del schema. Criterio documental: el
contrato expresa los 5 pasos de `BR-02` sin renumerarlos (`CTR-03.4`) y reserva los campos
de `CTR-01.8` sin redeclararlos (`CTR-03.3`).

**No tengo herramienta de ejecución (`D-12`) y no la voy a simular.** Lo de abajo es lo que
habrá que correr cuando el banco exista, y **lo corre el hilo principal o `revisor`, nunca
`arquitectura` sola** — misma regla que puso `T-18` para el gate del quiz.

```bash
# (1) valida contra el schema + ids, slugs y temas únicos
python -c "import json,jsonschema;d=json.load(open('src/data/adivinar-tema.json',encoding='utf-8'));s=json.load(open('src/data/_schema/adivinar-tema.schema.json',encoding='utf-8'));jsonschema.validate(d,s);i=d['items'];[__import__('sys').exit('repetido: '+k) for k in ['id'] if len({x['id'] for x in i})!=len(i)];assert len({x['fragmento']['archivo'] for x in i})==len(i),'slug repetido';assert len({x['fragmento']['credito']['tema'] for x in i})==len(i),'tema repetido';print('OK',len(i))"

# (2) cuotas de US-02/BR-01 sobre los ítems listo: piso 20, mínimo 5 faciles
python -c "import json;from collections import Counter;i=[x for x in json.load(open('src/data/adivinar-tema.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print(len(i),'/20',Counter(x['dificultad'] for x in i),'con spotify:',sum(1 for x in i if 'spotify' in x))"

# (3) el gate de D-07, corrible: cuántos ítems son publicables hoy
python -c "import json;i=[x for x in json.load(open('src/data/adivinar-tema.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print('sensibles a audio:',sum(1 for x in i if 'audio' in x['sensibleA']),'de',len(i),'| publicables con el gate abierto: 0')"

# (4) la respuesta correcta es el credito, y los distractores son titulos reales
#     (requiere la lista de los 105 titulos de RES-20 en un .json auxiliar)
python -c "import json;d=json.load(open('src/data/adivinar-tema.json',encoding='utf-8'));t=set(json.load(open('src/data/_schema/titulos-res-20.json',encoding='utf-8')));
[print('MAL',x['id']) for x in d['items'] if d['modoRespuesta']=='opciones' and (next(o['texto'] for o in x['opciones'] if o['correcta'])!=x['fragmento']['credito']['tema'] or not all(o['texto'] in t for o in x['opciones']) or len({o['texto'] for o in x['opciones']})!=4)];print('chequeo 4 corrido')"
```

**Qué chequea la máquina y qué no** — la tabla existe para que nadie confunda "validó" con
"está bien":

| # | Chequeo | Quién |
|---|---|---|
| 1 | Schema, `id`/slug/tema únicos | comando (1) |
| 2 | Piso de 20 y mínimo 5 `facil` (`US-02`, `BR-01`) | comando (2) |
| 3 | La opción `correcta` es igual al crédito; 4 textos distintos; los 4 son títulos reales de `RES-20` | comando (4) |
| 4 | Cuántos ítems toca el gate de `D-07` | comando (3) |
| 5 | El mp3 existe y pasa la tabla de `CTR-01.7` (codec, rate, canales, ≤ 10,10 s, ≤ 140.000 bytes) | `scripts/validar_fragmentos.py`, pendiente en `CTR-01.7` |
| 6 | Que el título esté copiado **literal** de `RES-20` y no abreviado | humano, contra la ficha |
| 7 | **Pertinencia de la cita**: que la ficha sostenga lo que el ítem afirma | **`revisor`** (`FIND-10`) |
| 8 | Que el `rotulo` diga quién lo cuenta **y dónde** | **`revisor`** |
| 9 | Que los primeros 100 ms del fragmento suenen | humano, con los oídos (`CTR-01.7`) |

---

### Consecuencias

- **`contenido` no puede cargar un ítem antes de que exista su mp3, y es a propósito.**
  `fragmento` es obligatorio y completo, y dos de sus campos —`origen` y `fechaCorte`— los
  sabe **solo quien recortó** (`CTR-01.8`). *Alternativa descartada:* hacer `fragmento`
  opcional mientras el ítem está en `borrador`. Lo único que se ganaría es adelantar los
  distractores, que salen de una lista que ya está en disco; a cambio se abriría la puerta
  a un `fechaCorte` verosímil e inventado, que es justo el modo de falla que `CTR-01.8`
  cerró. **Consecuencia de planificación: no tiene sentido abrir una tarea de `contenido`
  para `US-02` antes de que el usuario recorte los primeros fragmentos.**
- **Lo que le impone al motor:** nada nuevo sobre `CTR-01.5`. Lee la escalera de `CTR-01.9`
  como constante, el puntaje de `BR-02` como constante, y del JSON solo saca el slug, el
  crédito y las opciones.
- **Lo que le impone a `experiencia`:** cuatro opciones de hasta ~61 caracteres reales en
  zona pulgar si gana opción múltiple; el crédito (tema, disco, año) visible al revelar
  —`CTR-01.8` ya lo pedía—; y los 5 estados visuales de `UX-03`, que no necesitan ningún
  dato del JSON.
- **Fácil:** cambiar de mecanismo de respuesta. Una clave a nivel archivo y los distractores
  de una lista que ya existe.
- **Fácil:** que cambie la duración máxima del fragmento. Dos literales en el schema y una
  re-exportación con `CTR-01.6` — **siempre que el usuario haya guardado el máster en WAV**,
  que es la única parte de `CTR-01` donde saltarse un paso duele después.
- **Difícil:** volver atrás con `TM-NNN` una vez cargados veinte ítems, y volver atrás con
  la decisión de que la respuesta viva en el crédito. Las dos son baratas hoy y caras con
  el banco lleno.
- **Este contrato no habilita publicar nada.** Todo ítem de `US-02` es sensible a `audio`,
  el gate de `D-07` está abierto, y `CTR-03.10` comando (3) lo dice sin que nadie tenga que
  acordarse.

### Qué NO decide este contrato

- **Si se responde con opción múltiple o tipeando** — `producto`, pedido en
  `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md`. Valor de trabajo:
  `"opciones"`.
- **La tolerancia de matching** si gana el texto libre (tildes, mayúsculas, tipeos):
  `experiencia` el mecanismo, `contenido` qué cuenta como correcto (`PRD-alcance-v1.md`,
  PENDIENTE).
- **Qué 20 temas entran y cuál es fácil**: `contenido`, con `RES-20` y `CNT-03`.
- **Desde qué punto del tema se recorta** cuando no es el segundo 0: es regla de juego,
  `producto`/`contenido` (`CTR-01.2`); el contrato solo guarda `inicioEnTemaSeg`.
- **Cómo se ve la revelación, dónde va el crédito y cuándo aparecen las opciones en
  pantalla**: `experiencia`.
- **Si el embed o el deep link tienen implicancias de derechos**: `contenido`, nota de
  derechos.
