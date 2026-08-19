# ARQ — Schema del banco del quiz

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `D-02`, `D-07`, `D-09`, `US-01`,
> `BR-01`, `BR-04`, `RES-21`, `RES-22`, `.claude/rules/contenido-json.md`, `Docs/IDS.md`,
> `CTR-01`.
> Produce: `CTR-02`.
> Última actualización: 2026-08-19 (**revisión 4**, `T-16` del ciclo 2: agrega la tercera
> categoría de fuente —**testimonio**— que `RES-21` estableció, de forma **aditiva**: los
> 15 ítems vigentes validan sin editarlos y `contratoVersion` sigue en 1. Toca `CTR-02.3`,
> `CTR-02.4`, `CTR-02.5`, `CTR-02.6` y `CTR-02.7`).
> Revisión 3: cierra el valor de trabajo con `BR-04`; reemplaza el hecho del ítem de
> ejemplo de `CTR-02.3` por uno que `RES-02` sí respalda, y deja escrito que el schema
> valida el formato de la cita, no su pertinencia.

---

## CTR-02 — Contrato de `src/data/quiz.json`

- **Fecha:** 2026-08-19
- **Estado:** **vigente, sin valores abiertos.** El único que quedaba —la cantidad de
  opciones por pregunta— lo cerró `producto` en `BR-04`
  (`Docs/PRODUCTO/PRD-alcance-v1.md`): **son 4**, para `US-01` y también para `US-04`.
- **Para quién es esto:** para `contenido`, que sin schema no puede cargar la primera
  pregunta; y para `revisor`, que tiene que poder rechazar un JSON sin preguntarle nada a
  nadie.
- **Qué cambió en la revisión 4:** el banco puede declarar **tres** categorías de fuente y
  no dos. `RES-21` estableció que *Recuerdos que mienten un poco* es **testimonio** —el
  prefacio se titula "Prefacio / advertencia" y el Indio dice ahí que el libro es **apenas
  su versión** y que **no puede interpretarse como una verdad unívoca e incontrastable**—,
  y con un solo booleano `esLeyenda` un ítem apoyado en ese libro solo podía mentir en una
  de dos direcciones: hacerse pasar por hecho verificado, o llamarse leyenda cuando es el
  protagonista contándolo con nombre y capítulo. Ahora hay una tercera casilla, y está
  diseñada para que **cueste más tildarla mal que llenarla bien** (`CTR-02.4`, regla 3).

Las categorías y los niveles de dificultad **ya están fijados por `producto`** (`US-01`
criterio 1, y `BR-01`): cuatro categorías, tres niveles. El schema los copia, no los
inventa. La cantidad de opciones, que era lo único que faltaba, la fijó `BR-04` en **4**:
el schema también la copia.

Escribo esto ahora, con el motor todavía inexistente, porque el riesgo 4 del brief es
quedarnos con cuatro juegos hermosos y doce preguntas adentro. El contenido va adelante
del motor, y el piso de `US-01` son **40 preguntas**: eso no se carga en una ráfaga.

---

### CTR-02.1 — El archivo

| | |
|---|---|
| Ruta | `src/data/quiz.json` |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Versionado | Git, más el par `contrato` / `contratoVersion` adentro del archivo |
| Presupuesto de tamaño | **≤ 150 KB sin comprimir** |

**Si se pasa de 150 KB**, se parte por categoría: `src/data/quiz-historia.json`,
`quiz-discos.json`, etc., cada uno con el mismo envoltorio. A ~700 bytes por ítem, 150 KB
son unas 200 preguntas: mucho más de lo que va a tener la v1. El presupuesto está para que
nadie descubra el problema con el archivo ya armado.

La isla del quiz **no importa el motor de audio** (`CTR-01`). Son dos juegos distintos y
el jugador que entra al quiz no tiene por qué descargar un decodificador que no va a usar.

---

### CTR-02.2 — Envoltorio

```json
{
  "contrato": "CTR-02",
  "contratoVersion": 1,
  "juego": "quiz",
  "actualizado": "2026-08-20",
  "items": [ ... ]
}
```

`contrato` y `contratoVersion` van adentro del dato a propósito: dentro de dos meses,
mirando solo el JSON, se tiene que poder saber contra qué documento validarlo. Si `CTR-02`
cambia de forma incompatible, sube a `contratoVersion: 2` y el motor puede rechazar lo
viejo en vez de romperse raro.

---

### CTR-02.3 — El ítem

**Los dos bloques de esta sección usan IDs de ejemplo** (`QZ-998`, `QZ-999`), reservados en
`CTR-02.7` y que **nunca se cargan** en `src/data/quiz.json`. Antes de la revisión 4 el
primero decía `QZ-001`, que es un ítem real del banco y habla de otra cosa.

```json
{
  "id": "QZ-998",
  "us": ["US-01"],
  "categoria": "discos",
  "dificultad": "facil",
  "enunciado": "¿En qué año salió «Oktubre»?",
  "opciones": [
    { "texto": "1986", "correcta": true },
    { "texto": "1985", "correcta": false },
    { "texto": "1988", "correcta": false },
    { "texto": "1989", "correcta": false }
  ],
  "explicacion": "Oktubre salió en 1986, un año después de Gulp! (1985).",
  "fuentes": ["RES-02"],
  "esLeyenda": false,
  "sensibleA": [],
  "spotify": { "trackId": "1a2B3c4D5e6F7g8H9i0J1k" },
  "estado": "listo"
}
```

**Por qué `RES-02` y no otra ficha.** El hecho que afirma el ítem es **el año de edición
de un disco**, y `RES-02` es exactamente eso: una tabla de álbum, año y sello. Si el
enunciado preguntara **qué tema abre o cierra** *Oktubre*, `RES-02` **no lo respaldaría**
—no tiene tracklists— y la ficha correcta sería `RES-20`. **"Es de discografía" no
alcanza:** la pertinencia se mide contra la afirmación puntual del ítem, no contra el tema
general de la ficha.

**El validador comprueba el formato de la cita, no su pertinencia.** `^RES-\d{2}$` y que
haya al menos una: eso es todo lo que la máquina ve, porque no sabe de qué trata cada
`RES-NN`. Una cita a una ficha que existe pero habla de otra cosa **pasa el schema y es
igual de falsa**. Es el agujero exacto que `D-09` ("ningún dato falso") tiene que tapar, y
lo tapan quien escribe el ítem y `revisor`, no el schema. **Antes de pegar un `RES-NN`,
abrí la ficha y buscá adentro la afirmación que estás haciendo.**

> **Este ejemplo ya falló dos veces por lo mismo**, y por eso queda anotado: primero citó
> `RES-03` (marco de derechos) y después `RES-02` para un hecho de **tracklist** que esa
> ficha no tiene. El enunciado viejo —"¿En qué disco aparece «Ji Ji Ji»?", que "cierra el
> lado B de Oktubre"— era además **falso**: `RES-20` lista *Oktubre* con 9 temas y "Jijiji"
> en el **track 7**. Se cambió el hecho por uno que la ficha citada sí sostiene.

El `trackId` del ejemplo es **inventado**, y cae en la misma trampa: matchea
`^[A-Za-z0-9]{22}$` y no apunta a ningún tema real. Un `trackId` de relleno pasa el schema
igual que una cita impertinente.

#### El segundo ítem canónico: un testimonio

Mismo esqueleto, con el objeto `testimonio` adentro. **No hay ningún campo nuevo
obligatorio para los otros dos tipos de ítem**: el de arriba sigue siendo válido tal cual.

```json
{
  "id": "QZ-999",
  "us": ["US-01"],
  "categoria": "discos",
  "dificultad": "dificil",
  "enunciado": "En sus memorias, el Indio contó algo del sobre interno de Oktubre: trae impresa la letra de «De estos polvos futuros lodos…». ¿Por qué no se escucha en el disco?",
  "opciones": [
    { "texto": "La sacaron a último momento, con el sobre ya impreso", "correcta": true },
    {
      "texto": "Quedó como track oculto, sin figurar en la lista de temas",
      "correcta": false,
      "nota": "El track oculto que sí existe es «Pianito - Jam», y está en Gulp! (1985), no en Oktubre."
    },
    { "texto": "Se editó como simple y nunca entró a un álbum", "correcta": false },
    { "texto": "La letra impresa es de otro tema, con el título cambiado", "correcta": false }
  ],
  "explicacion": "Es la versión del propio Indio: la canción se cayó del disco a último momento, cuando el sobre interno ya estaba impreso con la letra. Y es de las pocas que cualquiera puede comprobar por su cuenta: quien tenga el disco puede leer la letra en el sobre y no encontrar el tema adentro.",
  "fuentes": ["RES-21", "RES-22", "RES-20"],
  "esLeyenda": false,
  "testimonio": {
    "quien": "Indio Solari",
    "obra": "Recuerdos que mienten un poco",
    "ubicacion": "comentario de «Oktubre»",
    "afirmacion": "Cuenta que la letra de «De estos polvos futuros lodos…» quedó impresa en el sobre interno de Oktubre porque la canción se sacó del disco a último momento, con el sobre ya impreso."
  },
  "sensibleA": [],
  "estado": "listo"
}
```

**Tres fichas y tres razones distintas. Esto es lo que hay que copiar del ejemplo, más que
el hecho.**

- **`RES-21` admite la obra.** Es la ficha que estableció que el memoir es testimonio y la
  que trae el mapa de capítulos. **El schema la exige** cuando `testimonio.obra` es ese
  libro. Y **no sostiene ninguna afirmación puntual**: es el mapa, no el contenido. Citarla
  sola no respalda nada.
- **`RES-22` sostiene la afirmación del ítem.** El hallazgo del sobre interno de *Oktubre*
  está fichado ahí, atribuido al comentario del disco dentro del libro.
- **`RES-20` está por el `nota` del segundo distractor.** Un distractor falso no necesita
  ficha —es falso a propósito—, pero **una `nota` se le muestra al jugador y afirma algo**:
  que "Pianito - Jam" es el track oculto y que está en *Gulp!* (1985). Eso lo sostiene
  `RES-20`. **La pertinencia se mide contra cada afirmación del ítem, no contra el ítem
  entero**, y las `nota` de los distractores son el lugar donde eso se olvida.

**La categoría del ítem es independiente de la categoría de la fuente.** Este ejemplo es
`discos` y es testimonio a la vez. Un testimonio puede ser `historia`, `discos` o `letras`:
`categoria` dice de qué habla el ítem, el objeto `testimonio` dice de dónde salió el dato.
Son dos ejes distintos y no hay que cruzarlos.

**Por qué este hecho y no otro.** Cumple las dos condiciones con las que tropezó el ejemplo
de arriba: es **verdadero** y la cita es **pertinente**. Además `RES-22` lo eligió como el
mejor dato difícil de toda la investigación por una razón que le sirve al testimonio: es
comprobable por cualquiera que tenga el disco, así que el ítem no le pide al jugador que
confíe en el libro.

| Campo | Tipo | Oblig. | Qué es y por qué |
|---|---|---|---|
| `id` | `QZ-NNN` | sí | Ver `CTR-02.7`. No se reutiliza nunca. |
| `us` | array de `US-NN` | sí | La historia a la que pertenece. Un ítem que no traza a un requisito es contenido que nadie pidió (`Docs/IDS.md`). |
| `categoria` | enum | sí | `historia` · `discos` · `letras` · `mitologia`. Fijadas por `US-01` criterio 1. |
| `dificultad` | enum | sí | `facil` · `media` · `dificil`. Fijadas por `BR-01`. El motor las usa para ordenar la partida: primer ítem siempre `facil`, y de ahí no baja. |
| `enunciado` | string, 10–180 | sí | El tope de 180 no es capricho: la pregunta y las cuatro opciones tienen que entrar en una pantalla de celular sin scroll. |
| `opciones` | array de exactamente **4** | sí | Ver abajo. |
| `explicacion` | string, 10–400 | sí | Se muestra **después** de responder. Es donde el que no sabía aprende algo y el que sabía se siente premiado. Obligatoria incluso en las fáciles. |
| `fuentes` | array de `RES-NN` | condicional | Obligatoria y no vacía si `esLeyenda` es `false` — **los testimonios incluidos**. Si hay `testimonio`, además tiene que traer la ficha que admite la obra (`CTR-02.4`, regla 3). La ficha tiene que respaldar el hecho del ítem: el schema valida el formato, no la pertinencia. |
| `esLeyenda` | boolean | sí | Sin default implícito: hay que escribirlo. Obliga a decidir. **No significa "no verificado": significa folclore anónimo, sin autor que se pueda nombrar.** Un testimonio lleva `false` y no es un hecho verificado — lo que lo distingue es el objeto `testimonio` (`CTR-02.4`, regla 1). |
| `rotuloLeyenda` | string, ≥ 10 | condicional | Obligatorio si `esLeyenda` es `true`. |
| `testimonio` | objeto | no | Presente = el ítem se apoya en **un testigo identificado**, ni hecho verificado ni leyenda. Ausente = no cambia nada, y por eso el campo es aditivo. Cuatro subcampos, los cuatro obligatorios: `quien`, `obra`, `ubicacion`, `afirmacion` (`CTR-02.4`, regla 3). Incompatible con `esLeyenda: true`. |
| `sensibleA` | array enum | sí | `letra` · `tapa` · `audio`. Vacío si el ítem no usa material de terceros. |
| `spotify` | objeto | no | `{ "trackId": "<22 caracteres>" }`. Opcional por `ADR-01`. |
| `estado` | enum | sí | `borrador` · `listo` · `retirado`. |
| `notaInterna` | string | no | Para el equipo. **Nunca se renderiza.** |

**Opciones.** Cada una es `{ "texto": string ≤ 60, "correcta": boolean, "nota": string? }`.
Exactamente una tiene `correcta: true` — el schema lo valida, no es un acuerdo de palabra.

- **Son cuatro, ni tres ni cinco. Cerrado por `BR-04`, ya no es valor de trabajo.**
  Cuatro opciones entran en una grilla de 2×2 con blancos grandes, que es lo que exige
  "jugable con el pulgar" (`D-09`); cinco obligan a una lista de destinos flacos o a hacer
  scroll. `BR-04` lo confirmó con un fundamento propio de `producto` —el azar da 25% con
  cuatro y 33% con tres, y con tres se vacía la promesa de premiar al que sabe— y lo
  extendió a `US-04`, que también es múltiple choice. Cambiarlo ahora ya no es "una línea
  del schema": el banco está cargándose contra este número (ver **Consecuencias**).
- **El motor baraja las opciones. El orden del JSON no significa nada.** Está escrito para
  que nadie caiga en la tentación de poner siempre la correcta primera, y para que nadie
  se apoye en el orden desde el código.
- **`correcta` viaja dentro de la opción**, no como un índice aparte. Alternativa
  descartada: `"indiceCorrecta": 0`. Descartada porque el día que alguien reordene las
  opciones para que se lean mejor, el índice queda apuntando a la respuesta equivocada y
  el error es silencioso: el juego sigue andando y da mal la respuesta. Con el booleano
  adentro, reordenar es inofensivo.
- `nota` es el "por qué no" opcional de un distractor. Si `contenido` no lo usa, no pasa
  nada.

---

### CTR-02.4 — Las reglas que el schema hace cumplir solo

El criterio no negociable número uno es **ningún dato falso** (`D-09`). Un criterio que
solo vive en un documento se incumple sin que nadie se entere. Estas reglas lo vuelven
verificable por máquina:

**Regla 1 — o hay fuente, o hay rótulo, o hay un testigo con nombre y lugar. No hay cuarta
opción.**

| Categoría de fuente | Cómo se declara | Qué obliga |
|---|---|---|
| **Hecho verificado** | `esLeyenda: false`, **sin** `testimonio` | `fuentes` con al menos una ficha `RES-NN` |
| **Leyenda rotulada** | `esLeyenda: true`, **sin** `testimonio` | `rotuloLeyenda` (≥ 10). `fuentes` puede ir vacía |
| **Testimonio rotulado** | `esLeyenda: false` **+** objeto `testimonio` | `fuentes` no vacía **y con la ficha que admite la obra**, más los cuatro subcampos de `testimonio` (regla 3) |

Un ítem sin fuente y sin rótulo **no valida**. No se carga "por ahora" ni "después le
pongo la ficha": no entra al archivo.

**Por qué el testimonio lleva `esLeyenda: false` y no un valor propio.** Porque el campo
dice lo que dice: *esto es folclore anónimo, sí o no*. Un testimonio **no** es folclore
anónimo — es un autor identificado afirmando algo en primera persona —, así que la
respuesta honesta a esa pregunta es `false`. La categoría no sale del booleano solo: sale
de la **combinación** con la presencia de `testimonio`. Y tiene una consecuencia práctica
buscada: la consulta 6 de `CTR-02.6` —ítems `listo` con `esLeyenda: false` y `fuentes`
vacía: **0**— sigue dando 0 **sin cambiar el comando que la mide**.

**Las dos casillas son excluyentes: `esLeyenda: true` junto con `testimonio` no valida.**
Dos sellos sobre el mismo ítem es la forma más rápida de que ninguno signifique nada, y
además deja a `experiencia` sin saber cuál renderizar y a `revisor` sin saber contra qué
regla auditar. El criterio para el caso de borde, que existe y es real: **mirá de quién es
la afirmación, no dónde está impresa.**

- El libro **reporta** un rumor que circula — `RES-22`: Rocambole salió a decir que
  Patricio Rey existía y vivía en Salta, y el Indio ni lo confirma ni lo desmiente. Eso es
  **leyenda**, aunque esté impresa en el memoir, y el `rotuloLeyenda` nombra a quien la
  cuenta.
- El testigo **afirma algo suyo** en primera persona — el sobre interno de *Oktubre* del
  ejemplo de `CTR-02.3`. Eso es **testimonio**.

**El rótulo es un campo, no una frase escondida en la explicación.** Es la diferencia
entre poder verificar que las leyendas están rotuladas y tener que leerlas todas a mano.
Y le permite a `experiencia` renderizarlo distinto — como un sello, no como una aclaración
en letra chica.

**Regla 2 — `sensibleA` hace verificable el gate de derechos.**

`D-07` separó construir de publicar. Para que ese gate se pueda **correr** y no solo
prometer, cada ítem declara qué material de terceros toca. Antes de publicar se filtra por
`sensibleA` no vacío y se cruza contra la nota de derechos de `contenido`. Sin este campo,
"revisar que la nota de derechos cubra todo" es leer el banco entero de nuevo.

**Regla 3 — el testimonio dice quién lo cuenta, en qué obra y en qué parte.**

Es la regla que existe contra un riesgo con nombre: **que el rótulo de testimonio se vuelva
un tilde que nadie mira.** El memoir son 863 páginas cómodas, están en el repo y no exigen
buscar nada; bajo presión de ráfaga, tildar "testimonio" y seguir es el camino de menor
resistencia. Por eso la categoría **no se declara con un tilde**: se declara escribiendo un
objeto con cuatro subcampos, y los cuatro son difíciles de completar mal.

| Subcampo | Qué exige el schema | Por qué así |
|---|---|---|
| `quien` | string 6–60, arranca en mayúscula | El **nombre** del testigo. "el libro" y "un testigo" no son nadie. Y no siempre es el Indio: el memoir cita a **Rocambole** textualmente (`RES-22`), y en ese caso el testigo es Rocambole. |
| `obra` | **enum cerrado**, hoy con un único valor: `Recuerdos que mienten un poco` | Una obra entra a la lista cuando **una ficha la estableció como testimonio**. Ampliarla es una tarea de `arquitectura` de una línea, no algo que se decide en el apuro de un lote. Es lo que hace imposible el "sale de un libro por ahí". |
| `ubicacion` | patrón cerrado: `cap. 14`, `cap. 14 «Walter David Bulacio»`, `comentario de «Oktubre»`, `p. 312`, `pp. 312-315`, con un `, p. N` opcional detrás de las formas con `cap.` y con `comentario de` | **Es el campo que separa un rótulo de un tilde.** `sale del libro` **no valida**: el patrón obliga a nombrar un capítulo, un comentario de disco o una página. Y deja el ítem re-chequeable en segundos con el PDF abierto. |
| `afirmacion` | string 40–300 que **empieza con un verbo de decir** + `que` / `cómo` / `por qué` | Obliga a escribir la afirmación **ya atribuida**. `El sobre interno de Oktubre trae impresa la letra de X` no valida; `Cuenta que el sobre interno…` sí. El campo no se puede llenar con un hecho impersonal aunque uno quiera. |

Los verbos admitidos: `Cuenta`, `Recuerda`, `Dice`, `Sostiene`, `Afirma`, `Niega`,
`Aclara`, `Admite`, `Reconoce`, `Describe`, `Explica`, `Atribuye`, `Define`, `Detalla`,
`Relata`, `Asegura`. **Si te falta uno, se agrega acá y en `CTR-02.5`** —ampliar la lista
es aditivo y no invalida nada—; **no lo fuerces con un sinónimo que no dice lo que pasó.**

Las tres formas de `ubicacion` existen por una razón cada una, y conviene saberla antes de
pelearse con el patrón: `RES-21` mapeó los 27 capítulos pero **cuatro se quedaron sin
título** por un límite de la extracción, así que el número de capítulo solo tiene que
alcanzar; `RES-22` ubicó su mejor hallazgo en el **comentario de un disco**, que es la
unidad real de navegación de esa parte del libro; y la página sirve cuando no hay ninguna
de las dos. El título entre `«»` de la forma `comentario de «X»` tiene que ser **uno de los
diez discos de `RES-20`**: eso el schema no lo mira, lo mira `revisor`.

**No hay un campo `rotuloTestimonio`, y es a propósito.** Lo que varía por ítem es **quién
y dónde**, y eso ya está en tres campos estructurados que se pueden chequear por máquina.
Lo que **no** varía por ítem es la advertencia, así que pedirla escrita cinco veces es
exactamente fabricar el campo que se llena por inercia. El sello que ve el jugador se
**compone** de `quien` + `obra` + `ubicacion` más este texto fijo de la categoría:

> Lo que sigue es lo que **contó** el testigo, no un hecho verificado de forma
> independiente. En el caso del memoir, la advertencia es del propio libro: el prefacio se
> titula "Prefacio / advertencia" y dice que es **apenas su versión** y que **no puede
> interpretarse como una verdad unívoca e incontrastable** (`RES-21`).

**Cómo se ve eso en pantalla lo decide `experiencia`**, igual que el sello de leyenda; el
contrato solo garantiza que los datos estén y que digan algo. Lo que sí garantiza, y un
string libre no podía: **es imposible que el rótulo exista sin nombrar quién y dónde.**

**Regla 4 — el enunciado de un testimonio pregunta qué contó el testigo, no qué pasó.**

La línea para copiar, tal cual: ***"¿Qué contó el Indio en sus memorias sobre…?"* vale;
*"¿Qué pasó en…?"* apoyado solo en el libro, no** (`RES-21`).

El schema hace cumplir un **piso** de eso: si el ítem trae `testimonio`, su `enunciado`
tiene que contener alguna marca de atribución (`contó`, `cuenta`, `según`, `memorias`,
`recuerda`, `dijo`, `sostiene`, `admite`, `niega`, `aclara`, `el propio`…). `¿Qué pasó en
Olavarría?` **no valida**. Pero es un piso y no una garantía: `¿Qué pasó la noche que el
Indio recuerda en sus memorias?` pasa el patrón y **sigue estando mal**, porque pregunta
qué pasó. Esa la caza `revisor` (`T-26`, punto 4), no la máquina.

**El truco práctico, para que salga bien la primera vez: escribí `afirmacion` antes que el
enunciado.** El campo ya te obliga a atribuir; el enunciado sale casi solo de ahí.

#### Alternativas descartadas

Cuatro, y las cuatro se pueden retomar sabiendo lo que cuestan:

1. **Convertir `esLeyenda` en un enum `tipoFuente: verificado | leyenda | testimonio`.** Es
   lo más limpio en una hoja en blanco y **rompe la restricción dura del gate**: los 15
   ítems vigentes traen un booleano y un enum de strings los invalida a los 15. Obligaría a
   editar `src/data/quiz.json`, que no es mi carpeta, y a subir `contratoVersion` a 2.
   Queda anotada como la forma que tendría `CTR-02` si algún día se rehace el banco por
   otro motivo; sola no paga el costo.
2. **Un booleano hermano: `esTestimonio: true` + `rotuloTestimonio: string`.** Es la
   traducción literal de "igual que `esLeyenda`", y es la que más se parece al problema que
   estamos evitando. Dos booleanos dan cuatro combinaciones, una sin sentido (`esLeyenda` y
   `esTestimonio` a la vez), y un string libre al lado de un tilde es justo el campo que
   termina diciendo "sale del libro". **La presencia de un objeto no se puede tildar:** o
   escribís los cuatro subcampos, o el ítem no valida.
3. **Exigir `fuentes` con `minItems: 2` en los testimonios**, es decir una ficha además de
   `RES-21`. Tentador, porque garantizaría que alguien de `investigador` miró el pasaje.
   Descartada por dos motivos. Uno práctico: **estrangula `T-21`** — `RES-22` fichó un
   puñado de afirmaciones del memoir y las otras 800 páginas no tienen ficha, así que la
   regla dejaría cinco preguntas en dos. Uno de fondo: en un testimonio, `ubicacion` **es**
   la cita y apunta al original, que está en el repo; es más comprobable que una ficha
   secundaria. Queda medida sin prohibirse, como consulta 8 de `CTR-02.6`.
4. **Un campo libre `fuentePrimaria: string` con la cita bibliográfica entera.** Descartada
   porque una sola string no se valida por partes, y lo que hay que volver difícil de
   completar mal es precisamente el "dónde".

**Cómo se agrega una obra nueva a `obra`** (procedimiento, para que no se improvise): entra
al enum el título exacto, y se agrega una rama `if/then` que la empareja con la ficha que
la admitió, igual que la que hoy empareja el memoir con `RES-21`. Las dos cosas son
aditivas —ampliar un enum nunca invalida datos que ya validaban— y las dos son de
`arquitectura`.

---

### CTR-02.5 — El schema, para pegar y correr

Texto normativo. Si una copia en `src/data/_schema/quiz.schema.json` se desincroniza de
esto, **manda esto**.

**Esa copia ya existe** (`T-04`, 2026-08-19) y es literal: `$id`
`https://ricotaarcade.local/schema/quiz/1`, `opciones` con `minItems`/`maxItems` en 4. Es
la que hay que pasarle a `jsonschema` para validar `src/data/quiz.json`. Si este bloque
cambia, **la copia se regenera en la misma ráfaga** — dos fuentes de verdad separadas en
el tiempo es exactamente lo que esta línea previene.

> ⚠ **Al 2026-08-19 esa copia está desincronizada de este bloque**: la revisión 4 se
> escribió en `T-16` y bajarla a `src/data/_schema/quiz.schema.json` es `T-17`. **Manda
> este bloque.** `arquitectura` no corre comandos (`D-12`), así que la validación la corre
> **`T-18`, el hilo principal**, y el criterio de cierre del gate es que **ninguno de los
> ítems que ya estaban en el banco haya tenido que editarse**.

**Por qué esto es aditivo, en cinco puntos que se pueden chequear leyendo el diff** — es el
criterio de aceptación de `T-16` y conviene poder verificarlo sin correr nada:

1. **No entró nada nuevo al `required` del ítem.** Sigue siendo la misma lista de diez.
2. `testimonio` se agrega bajo `properties` porque el ítem es `additionalProperties: false`
   — sin eso, un ítem con el campo nuevo **no** validaría. No estaba antes y no hace falta
   para los ítems viejos.
3. **Las tres ramas nuevas de `allOf` arrancan con `"if": {"required": ["testimonio"]}`.**
   Un ítem sin esa clave hace falso el `if`, y el `then` no se aplica nunca. Los 15 ítems
   vigentes no tienen la clave: para ellos el schema de la revisión 4 es, literalmente, el
   de la revisión 3.
4. **Ningún keyword existente cambió.** `esLeyenda` sigue siendo `boolean` y obligatorio;
   las dos ramas `allOf` de la regla 1 están idénticas, carácter por carácter.
5. **`contratoVersion` sigue en `const: 1`**, y el `$id` también. Ver el recuadro de abajo.

> **Sobre no bumpear `contratoVersion` — conclusión, no obediencia.** `CTR-02.2` reserva el
> número para los cambios **incompatibles**, y este no lo es en la dirección que importa:
> **todo archivo que validaba contra la revisión 3 valida contra la 4.** Lo que sí pasa es
> lo inverso —un archivo **con** `testimonio` no valida contra una copia vieja del schema,
> por `additionalProperties: false`—, y eso es un modo de falla **ruidoso y deseable**: si
> alguien valida el banco nuevo con el schema viejo, se entera de una, en vez de que pase
> en silencio. Se resuelve con `T-17`, que es una tarea del mismo ciclo. **No lo subo, y no
> hace falta una tarea extra para subirlo.** El `$id` termina en `/1` porque refleja
> `contratoVersion`, no la revisión del documento: la revisión se rastrea por Git y por el
> encabezado de este archivo.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/quiz/1",
  "title": "CTR-02 — Banco del quiz",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "contratoVersion", "juego", "actualizado", "items"],
  "properties": {
    "contrato": { "const": "CTR-02" },
    "contratoVersion": { "const": 1 },
    "juego": { "const": "quiz" },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/item" }
    }
  },
  "$defs": {
    "item": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id", "us", "categoria", "dificultad", "enunciado",
        "opciones", "explicacion", "esLeyenda", "sensibleA", "estado"
      ],
      "properties": {
        "id": { "type": "string", "pattern": "^QZ-\\d{3}$" },
        "us": {
          "type": "array", "minItems": 1,
          "items": { "type": "string", "pattern": "^US-\\d{2}$" }
        },
        "categoria": {
          "enum": ["historia", "discos", "letras", "mitologia"]
        },
        "dificultad": { "enum": ["facil", "media", "dificil"] },
        "enunciado": { "type": "string", "minLength": 10, "maxLength": 180 },
        "opciones": {
          "type": "array",
          "minItems": 4,
          "maxItems": 4,
          "items": { "$ref": "#/$defs/opcion" },
          "contains": {
            "type": "object",
            "required": ["correcta"],
            "properties": { "correcta": { "const": true } }
          },
          "minContains": 1,
          "maxContains": 1
        },
        "explicacion": { "type": "string", "minLength": 10, "maxLength": 400 },
        "fuentes": {
          "type": "array",
          "items": { "type": "string", "pattern": "^RES-\\d{2}$" }
        },
        "esLeyenda": { "type": "boolean" },
        "rotuloLeyenda": { "type": "string", "minLength": 10, "maxLength": 200 },
        "testimonio": { "$ref": "#/$defs/testimonio" },
        "sensibleA": {
          "type": "array",
          "uniqueItems": true,
          "items": { "enum": ["letra", "tapa", "audio"] }
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
          "if": {
            "required": ["esLeyenda"],
            "properties": { "esLeyenda": { "const": false } }
          },
          "then": {
            "required": ["fuentes"],
            "properties": { "fuentes": { "minItems": 1 } }
          }
        },
        {
          "if": {
            "required": ["esLeyenda"],
            "properties": { "esLeyenda": { "const": true } }
          },
          "then": { "required": ["rotuloLeyenda"] }
        },
        {
          "if": { "required": ["testimonio"] },
          "then": {
            "required": ["fuentes"],
            "properties": {
              "esLeyenda": { "const": false },
              "fuentes": { "minItems": 1 }
            }
          }
        },
        {
          "if": {
            "required": ["testimonio"],
            "properties": {
              "testimonio": {
                "required": ["obra"],
                "properties": {
                  "obra": { "const": "Recuerdos que mienten un poco" }
                }
              }
            }
          },
          "then": {
            "required": ["fuentes"],
            "properties": {
              "fuentes": { "contains": { "const": "RES-21" } }
            }
          }
        },
        {
          "if": { "required": ["testimonio"] },
          "then": {
            "properties": {
              "enunciado": {
                "pattern": "(cont(ó|aba|aron)|[Cc]uenta|[Ss]egún|memorias|[Rr]ecuerda|[Rr]ecordó|[Dd]ice|[Dd]ijo|[Ss]ostiene|[Ss]ostuvo|[Aa]dmite|[Aa]dmitió|[Nn]iega|[Nn]egó|[Aa]clara|[Aa]claró|[Ee]l propio|[Ll]a propia)"
              }
            }
          }
        }
      ]
    },
    "testimonio": {
      "type": "object",
      "additionalProperties": false,
      "required": ["quien", "obra", "ubicacion", "afirmacion"],
      "properties": {
        "quien": {
          "type": "string",
          "minLength": 6,
          "maxLength": 60,
          "pattern": "^[A-ZÁÉÍÓÚÑ]"
        },
        "obra": { "enum": ["Recuerdos que mienten un poco"] },
        "ubicacion": {
          "type": "string",
          "maxLength": 100,
          "pattern": "^((cap\\. \\d{1,2}( «[^»]{3,80}»)?|comentario de «[^»]{3,60}»)(, pp?\\. \\d{1,4}(-\\d{1,4})?)?|pp?\\. \\d{1,4}(-\\d{1,4})?)$"
        },
        "afirmacion": {
          "type": "string",
          "minLength": 40,
          "maxLength": 300,
          "pattern": "^(Cuenta|Recuerda|Dice|Sostiene|Afirma|Niega|Aclara|Admite|Reconoce|Describe|Explica|Atribuye|Define|Detalla|Relata|Asegura) (que|cómo|por qué) \\S"
        }
      }
    },
    "opcion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["texto", "correcta"],
      "properties": {
        "texto": { "type": "string", "minLength": 1, "maxLength": 60 },
        "correcta": { "type": "boolean" },
        "nota": { "type": "string", "maxLength": 200 }
      }
    }
  }
}
```

**Lo que el schema NO puede verificar** y queda para el script de validación o para
`revisor`:

1. Que los `id` sean únicos dentro del archivo. `uniqueItems` compara objetos enteros, no
   sirve.
2. Que cada `RES-NN` citado exista de verdad en `Docs/INVESTIGACION/`. Es justo lo que
   `/coherencia` tiene que atrapar.
3. Que cada `US-NN` citado exista en `Docs/PRODUCTO/`.
4. **Las cuotas del piso de `US-01`** (ver `CTR-02.6`). Un schema valida ítems sueltos, no
   propiedades del conjunto.
5. Que la pregunta sea **verdadera**. Ningún schema hace eso. Por eso existe
   `investigador`.
6. **Que el pasaje de `testimonio.ubicacion` exista y diga lo que dice `afirmacion`.** El
   patrón obliga a nombrar un lugar concreto; que el capítulo sea ese y que el testigo haya
   dicho eso lo verifica `revisor` **con el PDF abierto** (`T-26`, punto 4). Es la misma
   división de siempre: la máquina mira la forma, la persona mira la verdad. Acá la persona
   la tiene fácil, porque el original está en el repo.
7. **Que el enunciado esté formulado como "qué contó" y no como "qué pasó".** El patrón de
   la regla 4 es un piso: exige una marca de atribución, no una formulación correcta.

---

### CTR-02.6 — Las cuotas del piso, contadas sobre `estado: "listo"`

`US-01` fija el piso en **40 preguntas** y `BR-01` exige suficientes fáciles para que el
primer ítem de cada partida no sea siempre el mismo. Son propiedades del **conjunto**, así
que las dejo acá como consultas a correr sobre el archivo, no como reglas del schema:

| # | Consulta | Piso |
|---|---|---|
| 1 | Total de ítems con `estado: "listo"` | ≥ 40 |
| 2 | Ítems `listo` por cada valor de `categoria` | ≥ 10 en las cuatro |
| 3 | Ítems `listo` con `dificultad: "facil"` | ≥ 10 |
| 4 | Ítems `listo` con `dificultad: "media"` | ≥ 15 |
| 5 | Ítems `listo` con `dificultad: "dificil"` | ≥ 15 |
| 6 | Ítems `listo` con `esLeyenda: false` y `fuentes` vacía | **0** |

**`borrador` y `retirado` no cuentan para el piso.** Es la razón de ser del campo
`estado`: permite que `contenido` deje una pregunta a medio verificar dentro del archivo,
sin que infle un número que después se cae en revisión. Una pregunta esperando su ficha
`RES-XX` es `borrador`, no es piso.

**La consulta 6 no cambió con la revisión 4, y era condición del plan del ciclo 2.** Un
ítem de testimonio lleva `esLeyenda: false` y `fuentes` no vacía, así que sigue contando
como lo que es —un ítem con fuente— y **el comando que la mide se queda igual**.

#### Dos consultas nuevas, que no son pisos sino señales

El riesgo que abren los testimonios no es de cantidad: es de **calidad del rótulo**, y eso
no se mide con un mínimo. Estas dos existen para que alguien lo mire, no para que un número
diga que está bien.

| # | Consulta | Qué mirar |
|---|---|---|
| 7 | Para cada ítem con `testimonio`: `id`, `quien`, `ubicacion`, `afirmacion` | **Los lee una persona.** Señal de alarma: que varios compartan la misma `ubicacion`, o que dos `afirmacion` sean la misma frase con otra palabra. Un rótulo real varía porque los pasajes son distintos; un tilde se repite. |
| 8 | Ítems con `testimonio` cuyo `fuentes` sea exactamente `["RES-21"]` | **No es una falla:** el schema lo permite a propósito (alternativa descartada 3, `CTR-02.4`). Es el número de ítems que descansan **solo** en el libro, sin ninguna ficha que haya mirado el pasaje. Si es alto, `revisor` ya sabe por dónde empezar. |

```bash
# (7) y (8) — el rótulo de testimonio, para leerlo con los ojos.
# Lo corre el hilo principal o `revisor`. NO lo corre `arquitectura` (D-12).
python -c "import json;i=[x for x in json.load(open('src/data/quiz.json',encoding='utf-8'))['items'] if 'testimonio' in x];print('testimonio:',len(i),'| solo RES-21:',sum(1 for x in i if x.get('fuentes')==['RES-21']));[print(x['id'],'|',x['testimonio']['quien'],'|',x['testimonio']['ubicacion'],'|',x['testimonio']['afirmacion']) for x in i]"
```

Este es el comando que `T-21` dejó anotado como "sale de `CTR-02` una vez cerrada `T-16`".
El criterio de esa tarea: los cinco ítems del lote del memoir aparecen listados, con
`ubicacion` distinta entre sí salvo que dos salgan de veras del mismo pasaje.

---

### CTR-02.7 — Numeración de los ítems, y una excepción declarada

`QZ-NNN`, tres dígitos, correlativo, **no se reutiliza**. Un ítem que sale de circulación
se marca `"estado": "retirado"` y se queda en el archivo, igual que la regla de
`Docs/IDS.md` de marcar `[CANCELADO]` y no borrar.

**`QZ-990`..`QZ-999` quedan reservados para los ejemplos de esta documentación y no se
cargan nunca en `src/data/quiz.json`.** Hoy están tomados `QZ-998` y `QZ-999`, los dos
ítems de `CTR-02.3`. El motivo es chico y concreto: un ejemplo con ID válido es cómodo de
copiar, y hasta la revisión 3 el ejemplo se llamaba `QZ-001`, que es un ítem real del banco
sobre otro tema. **Si copiás un bloque de `CTR-02.3`, cambiale el `id` por el que te reservó
el plan del ciclo.**

Prefijos previstos, uno por juego: `QZ-` quiz · `AT-` adivinar el tema · `CL-` completar
la letra · `TP-` tapa.

**La excepción, declarada a propósito:** `Docs/IDS.md` fija dos dígitos, y estos IDs usan
tres. Es deliberado. Los IDs de `Docs/IDS.md` identifican **documentos y requisitos**, que
son decenas; un banco de preguntas pasa de 99 sin despeinarse, y renumerar después es
peor. Estos IDs viven en `src/data/`, no en `Docs/`, y no se mezclan con ningún `US-`,
`ADR-` ni `RES-`. **No edito `Docs/IDS.md`** porque no es mi carpeta; lo dejo señalado acá
para que quien la mantenga decida si agrega la fila.

---

### Consecuencias

- **Fácil:** `contenido` arranca hoy. No necesita el motor, ni `ADR-01`, ni las `US-XX`:
  necesita fichas `RES-XX` y este archivo.
- **Fácil:** rechazar contenido mal cargado sin discutir. Un ítem sin fuente y sin rótulo
  no valida, y eso no es opinión de nadie.
- **Fácil:** correr el gate de derechos antes de publicar, filtrando por `sensibleA`.
- **Difícil, y a partir de ahora caro:** cambiar de cuatro opciones a otra cantidad. El
  schema cambia en una línea; las preguntas ya escritas, no. La ventana para discutirlo
  barato era antes del primer lote y **ya se cerró**: `BR-04` fijó 4 y el banco se carga
  contra ese número. Reabrirlo es rehacer preguntas, no editar un schema.
- **Difícil:** que un ítem sobreviva a una ficha `RES-XX` que se corrige. Si una fuente
  cambia, hay que buscar quién la citaba — el campo `fuentes` lo hace posible, pero a mano
  hasta que exista el script.
- **Fácil, y es lo que destraba el gate 2 del ciclo 2:** `contenido` puede apoyarse en el
  memoir —la fuente más rica que tiene `historia`— **sin mentir en ninguna de las dos
  direcciones** que había antes de la revisión 4.
- **Difícil a propósito: llenar mal el rótulo de testimonio.** No hay tilde que marcar; hay
  cuatro campos, uno con enum cerrado, uno con patrón de lugar y uno que obliga a atribuir
  la afirmación. `sale del libro` **no valida**. Es el costo que se le pone adelante al
  riesgo número uno del ciclo, y se paga una vez por ítem.
- **Difícil, y asumido:** hoy un testimonio **solo puede vivir en una obra escrita**. Si
  aparece uno en un documental o una entrevista filmada, `ubicacion` no lo admite y el ítem
  no entra hasta que se amplíe el patrón con una forma tipo `min. MM:SS`. **Ampliar un
  patrón es aditivo** y cuesta una línea; no lo hago ahora porque no hay ningún ítem que lo
  necesite y cada forma aceptada de más es una puerta de salida más.
- **Difícil, y también a propósito:** sumar una obra al enum `obra` es una tarea de
  `arquitectura`, no una línea que se escribe dentro de un lote. Es lo que impide que la
  categoría se estire sola hasta cubrir cualquier libro que alguien tenga a mano.
- **Señalado y no decidido, porque no es mío: `sensibleA` no tiene un valor para texto de
  libro.** Sus tres valores son `letra`, `tapa` y `audio`. Si `contenido` termina citando el
  memoir **textualmente** en un enunciado o en una explicación, el gate de `D-07` hoy no lo
  ve. Agregar `libro` al enum sería aditivo y cuesta una línea, pero **quién decide si eso
  es material sensible es `contenido` con su nota de derechos** (`CNT-01`). Si la respuesta
  es que sí, sale como revisión 5 y no invalida nada de esto. Lo dejo acá y en el reporte de
  `T-16`; no abro un archivo en otra carpeta por una línea.
- **Lo que le imponía a `producto`:** confirmar la cantidad de opciones por pregunta.
  **Saldado:** `BR-04` la fijó en 4 para `US-01` y `US-04`. `CTR-02` no espera nada más de
  `producto`.
- **Lo que queda pendiente de `arquitectura`:** `CTR-03`, el contrato de
  `src/data/temas.json` para "adivinar el tema" (`US-02`), que embebe el objeto
  `fragmento` de `CTR-01.8`; y los contratos de `US-03` (letras segmentadas en versos,
  con el tope de 5 versos de `BR-03`) y `US-04` (tapas). No los escribo a medias en esta
  ráfaga: el quiz es lo que se construye primero (`US-01`, P0) y es lo que desbloquea a
  `contenido` hoy.
