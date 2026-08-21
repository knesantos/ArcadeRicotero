# ARQ — Schema de "adivinar la tapa" (`US-04`)

> Rol dueño: `arquitectura`. Consume: `US-04`, `BR-01`, `BR-04`, `D-04`, `D-05`, `D-09`,
> `D-12`, `D-14`, `D-19`, `D-21`, `CTR-02` (molde), `CTR-03` (`CTR-03.3` y `CTR-03.6`),
> `RES-02`, `RES-06`, `RES-25`, `RES-37`, `UX-04`, `scripts/generar-tapas.mjs`,
> `src/lib/quiz/banco.ts`, `.claude/rules/contenido-json.md`,
> `.claude/rules/diseno-marca.md`.
> Produce: **`CTR-05`**. Tarea: `T-53` del ciclo 4.
> Fecha: 2026-08-21.

---

## CTR-05 — Contrato de `src/data/tapa.json`

- **Estado:** vigente, sin valores abiertos, **con una dependencia declarada**: el schema
  exige la ficha `RES-44` en cada ítem y esa ficha la produce `T-47` mientras escribo esto.
  Hasta que exista, ningún ítem de `contenido` puede validar. Es a propósito: es el
  mecanismo que impide elegir una tapa sin auditoría de edición (`D-21`).
- **Para quién:** para `contenido`, que carga los 10 ítems en `T-54`; para quien escriba el
  motor en `T-55`; y para `revisor` en `T-56`, que tiene que poder rechazar un ítem sin
  preguntarle a nadie.
- **Qué resuelve.** `US-04` es el juego con la materia prima más cerca —las tapas ya están
  en `public/tapas/`— y con lo único estricto del proyecto más expuesto: si la imagen no es
  la que el jugador tiene en la cabeza, **el juego le marca error justo al que se sabe el
  disco**. `D-21` dejó eso escrito como la única prohibición dura del ciclo. Este contrato
  la convierte en algo que falla en la validación en vez de en la partida.

---

### CTR-05.1 — Archivo, envoltorio y los dos presupuestos

| | |
|---|---|
| Archivo de datos | `src/data/tapa.json` (lo nombra `T-54`; no lo cambio) |
| Copia corrible | `src/data/_schema/tapa.schema.json` — **existe, sale de esta misma ráfaga** |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Presupuesto de tamaño | ≤ 150 KB, heredado de `CTR-02.1`. 10 ítems × ~600 bytes ≈ **6 KB** |

```json
{
  "contrato": "CTR-05",
  "contratoVersion": 1,
  "juego": "adivinar-tapa",
  "actualizado": "2026-08-21",
  "items": [ ... ]
}
```

El envoltorio es el mismo de `CTR-02` y `CTR-03`, sin una sola clave nueva a nivel archivo:
un solo cargador sirve para los cuatro juegos y quien abra `src/data/` no aprende una forma
distinta por juego. La clave `juego` dice `adivinar-tapa` y la página vive en
`/juegos/adivinar-la-tapa/` — la ruta es de `experiencia`, la clave del dato es mía, y no se
pisan.

**El presupuesto que sí es nuevo acá es el de imágenes**, porque es lo que este juego le
descarga a un celular de gama baja:

- **Techo por archivo: 60 KB.** Los derivados que hoy produce `scripts/generar-tapas.mjs`
  son JPEG de 320 px al 72% de calidad; el script imprime el peso de cada uno al correr
  (`T-49` mantiene esa salida). Si un derivado se pasa de 60 KB, se baja la calidad o el
  ancho — no se sube el techo.
- **Ventana de precarga: el ítem en juego + 1.** Nunca las diez. Es la misma forma de la
  ventana de audio de `CTR-01.5`, por la misma razón: un pool de 10 ítems no son 10
  descargas.
  *Alternativa descartada:* precargar el pool entero al abrir el juego, que es cómodo de
  programar y hace que la primera pantalla pese medio mega en una conexión de celular para
  un jugador que va a ver seis tapas.
- **La isla de este juego no importa el motor de audio** (`CTR-01`) ni el banco del quiz.
  Son juegos distintos y el que entra acá no tiene por qué bajar un decodificador que no
  usa.

---

### CTR-05.2 — Qué se le pregunta al jugador, y por qué no es una decisión abierta

**Se muestra una imagen de tapa y se elige el título entre cuatro.** Una sola forma, sin
clave de modo en el archivo.

Esto **no lo elijo yo**: lo fijó `producto` en `US-04` criterio 1, textual — *"se le muestra
una tapa en baja resolución con crédito a Rocambole (`D-04`)"* y *"puede elegir entre
opciones de múltiple choice (nunca tipeo) cuál es el disco correcto"*. Lo que hago es no
dejar en el schema ninguna puerta para la otra forma, y decir qué se pierde con eso.

**La alternativa descartada: nombrar el disco y elegir entre cuatro tapas.** Es la lectura
literal del título del juego y tiene tres costos concretos.

Cuatro imágenes en una grilla de 2×2 sobre una pantalla de celular dan miniaturas de unos
150 px de ancho, y `D-04` ya obliga a que la fuente sea de baja resolución: el jugador
tendría que reconocer un cuadro de Rocambole en una estampilla, que es exactamente lo
contrario de lo que el juego promete. Segundo, cuadruplica la superficie auditada: cada
distractor es otra imagen con su edición y su crédito, y con un pool de diez las mismas
tres tapas se repetirían en todas las partidas. Y el tercero es el que me decidió: **con
cuatro tapas en pantalla, la regla dura de `D-21` deja de ser expresable por máquina.** Una
imagen sin edición confirmada podría entrar como distractor sin ser respuesta correcta, y
un schema no sabe distinguir una cosa de la otra dentro del mismo array. Con la forma que
manda `US-04`, "no puede ser la respuesta correcta" y "no puede ser un ítem jugable" son la
misma frase, y eso se valida en tres líneas (`CTR-05.4`).

*Alternativa también descartada:* copiarle a `CTR-03` la clave `modoRespuesta` y soportar
las dos formas. En `CTR-03` esa clave existe porque **faltaba una regla de `producto`**;
acá la regla existe desde `US-04`. Un schema que soporta un modo que nadie pidió es una
puerta que alguien va a usar sin discutirla. Si `producto` quiere la otra forma algún día,
es `CTR-05` v2 y la migración es barata mientras el banco esté vacío.

**La respuesta correcta *es* `imagen.disco`.** No hay campo `respuesta`, igual que en
`CTR-03.3`: la opción marcada `correcta: true` tiene que tener el `texto` idéntico a
`imagen.disco`, y eso lo comprueba el chequeo 2 de `CTR-05.9`, no el schema. La razón de
fondo es la misma que allá: una segunda copia del título se desincroniza del crédito, y el
crédito es lo que se publica al lado de material de terceros.

**Un ítem no lleva `enunciado`.** El enunciado es la imagen. Un campo de texto ahí invita a
escribir una pista —"la tapa azul del televisor"— y convierte el juego de reconocimiento
visual en un quiz con foto. La pregunta fija que ve el jugador la escribe `experiencia`.

---

### CTR-05.3 — El ítem, campo por campo

| Campo | Tipo | Oblig. | Qué es |
|---|---|---|---|
| `id` | `^TP-\d{3}$` | sí | Contador propio, `TP-001`+. `CTR-02.7` ya reservó el prefijo `TP-` para este juego. |
| `us` | array de `^US-\d{2}$`, ≥ 1 | sí | Hoy siempre `["US-04"]`. Lo pide `.claude/rules/contenido-json.md`. |
| `dificultad` | `facil` · `media` · `dificil` | sí | `BR-01`. Mismo vocabulario que los otros tres bancos. |
| `imagen` | objeto | sí | La tapa, su edición, su auditoría y su crédito. Ver `CTR-05.4`. |
| `opciones` | array de exactamente **4** | sí | `BR-04`. Cada `texto` sale del enum de títulos: ver abajo. |
| `explicacion` | string 10–400 | no | El dato de color que se muestra al revelar. Opcional, como en `CTR-03`. |
| `rotulo` | objeto `{tipo, texto}` | condicional | Obligatorio si la `explicacion` afirma algo que las fuentes no sostienen como hecho. Ver `CTR-05.6`. |
| `fuentes` | array de `^RES-\d{2}$`, ≥ 1 | **sí, y contiene `RES-44`** | Ver `CTR-05.4` y `CTR-05.6`. |
| `sensibleA` | array de `letra`·`tapa`·`audio` | **sí, y contiene `tapa`** | No existe un ítem de este juego que no muestre una tapa. |
| `estado` | `borrador`·`listo`·`retirado` | sí | Las cuotas se cuentan solo sobre `listo`. |
| `notaInterna` | string | no | Para el equipo. Nunca se renderiza — `banco.ts` la saca del payload. |

**Las cuatro opciones son cuatro títulos reales, y eso lo hace cumplir el schema.** El campo
`opcion.texto` no es un string libre: es un enum cerrado con los diez títulos de disco que
el sitio ya usa. `CTR-03` tuvo que dejar eso como chequeo de script porque sus títulos son
105 temas; acá son diez y entran en el schema. Cierra por máquina un agujero que en el otro
banco queda abierto: **un distractor inventado es un dato falso mostrado al jugador**, aunque
nunca sea la respuesta correcta. Cuatro títulos en pantalla son cuatro afirmaciones de que
esos discos existen.

Los diez valores del enum, copiados de los diez artículos `tipo: "disco"` de
`src/data/redondopedia.json`, que son también los diez destinos de `generar-tapas.mjs`:

> `Gulp!` · `Oktubre` · `Un baión para el ojo idiota` · `¡Bang! ¡Bang!... Estás liquidado` ·
> `La mosca y la sopa` · `Lobo suelto` · `Cordero atado` · `Luzbelito` ·
> `Último bondi a Finisterre` · `Momo Sampler`

Tres cosas sobre esa lista que conviene no descubrir después:

`RES-02` nombra el doble de 1993 como **un** título —"Lobo suelto, cordero atado (vol. 1 y
vol. 2)"— y avisa en su discrepancia 2 que el conteo total es **9 o 10 según cómo se cuente
ese disco**. El sitio ya eligió: dos artículos, dos slugs, dos archivos en `public/tapas/`.
El enum sigue al sitio, y por eso tiene diez entradas y no nueve. **La consecuencia para
`contenido` es un chequeo humano que ninguna máquina puede hacer:** si las dos mitades del
doble comparten arte —`RES-37` les midió la misma paleta—, ponerlas juntas como opciones del
mismo ítem es una moneda al aire que castiga justo al que conoce el disco. Van juntas solo
si el arte las distingue.

Segunda: **el plan del ciclo habla de "11 títulos" y en el repo hay diez.** No cambio el
plan, que no es mi carpeta, pero el número importa para la aritmética del piso y lo dejo
anotado acá y en el reporte de `T-53`.

Tercera: ampliar el enum —si entra una tapa de un disco en vivo, o un recopilado— es una
tarea de `arquitectura` de una línea y es aditiva. Que sea una tarea y no una línea que se
escribe en el apuro de un lote es el mismo mecanismo que `CTR-02.4` le puso al enum `obra`.

**Nada de índices.** `correcta` viaja adentro de la opción, y el motor baraja: el orden del
JSON no significa nada. El fundamento completo está en `CTR-02.3` y no lo repito.

---

### CTR-05.4 — La imagen: ruta, edición, auditoría y crédito

```json
"imagen": {
  "archivo": "gulp",
  "encuadre": "entera",
  "disco": "Gulp!",
  "edicion": "<qué edición es exactamente esta imagen, con año>",
  "auditoria": "original confirmada",
  "credito": { "autor": "Rocambole (Ricardo Cohen)", "origen": "coveralia" }
}
```

#### La ruta no se guarda: se arma

`archivo` es el **slug pelado**, sin carpeta, sin extensión y sin el sufijo del derivado. La
ruta pública sale de combinarlo con `encuadre`:

| `encuadre` | Archivo en el repo | Ruta pública que pide el navegador |
|---|---|---|
| `entera` | `public/tapas/<archivo>.jpg` | `/tapas/<archivo>.jpg` |
| `detalle` | `public/tapas/<archivo>-detalle.jpg` | `/tapas/<archivo>-detalle.jpg` |

Hoy existen los diez `<slug>.jpg` a 320 px que produce `scripts/generar-tapas.mjs` desde los
másters de `Docs/INVESTIGACION/TapasDiscos/`; los `-detalle` los produce `T-49` en este mismo
ciclo. **Guardar la ruta entera en el JSON estaba descartado de entrada**: son diez ítems
repitiendo `/tapas/` y `.jpg`, y el día que el script emita otro formato hay que editar el
banco a mano en vez de una línea de esta tabla. El schema además rechaza un `archivo` que
termine en `-detalle` o en `-fondo`, para que nadie fabrique `oktubre-detalle-detalle.jpg`.

**Dependencia con `T-49`, declarada:** si esa tarea nombra el derivado con otro sufijo, lo
que cambia es esta tabla y el chequeo 1 de `CTR-05.9` — ningún ítem se edita. El chequeo 1
existe justamente para que un desajuste de nombre falle en la validación y no como una
imagen rota en la cara del jugador.

**El slug es la respuesta, y viaja al cliente.** Quien abra la pestaña de red ve
`/tapas/oktubre.jpg` antes de contestar. Es el mismo precio que `CTR-01.8` y `CTR-03.3`
aceptaron para el audio y por el mismo motivo: ofuscarlo cuesta trabajo real y lo rompe el
primero que mire dos veces. Un fan site no se defiende de sus jugadores.

#### `edicion` y `auditoria`: la regla dura de `D-21`

`edicion` dice **qué edición es exactamente esa imagen** —"LP argentino, Wormo, 1985",
"reedición en CD, Del Cielito, 1991"— y `auditoria` dice cuánto de eso está probado. Los
cuatro valores del enum son los que va a usar `RES-44` y no hay un quinto:

| `auditoria` | Qué significa | ¿Puede ser respuesta correcta? |
|---|---|---|
| `original confirmada` | La imagen es la edición original, con marcador que lo prueba | Sí |
| `reedicion confirmada` | Es una reedición identificada como tal | Sí, con la salvedad de abajo |
| `coincide con la original, sin marcador que lo pruebe` | Se ve igual a la original y no hay sello, catálogo ni dato que lo confirme | Sí |
| `no determinable` | No se puede decir qué edición es | **No** |

**La regla dura se expresa en el schema, no como un pedido por favor:** si
`imagen.auditoria` es `no determinable`, `estado` solo puede ser `borrador` o `retirado`.
Como en este juego la imagen **es** la pregunta, un ítem que no puede ser respuesta correcta
no puede ser un ítem jugable, y `estado: "listo"` es lo único que el motor sirve
(`banco.ts`, `cargarBanco`). Tres líneas de `if/then` y `D-21` deja de depender de que
alguien se acuerde.

**El ítem no se borra: queda en `borrador`.** Si mañana aparece el dato que resuelve la
edición, se cambian dos campos y el ítem entra. Es el mismo mecanismo con el que `FIND-10`
se cerró sin perder una pregunta.

`edicion` tiene un piso que cuesta más llenar mal que bien: mínimo 10 caracteres y, cuando
la auditoría es cualquiera de los tres valores confirmados, **tiene que contener un año**
(`19xx` o `20xx`). `original` no valida; `LP argentino, Wormo, 1985` sí. Es el mismo truco de
`CTR-02.4` con `ubicacion`: un rótulo que se puede llenar con una palabra vaga es un tilde
disfrazado. Cuando la auditoría es `no determinable` el año no se exige, porque exigir un
dato que la ficha declaró indeterminable es pedir que alguien lo invente.

**Lo que el schema no ve, y `revisor` sí** (`T-56`): que la imagen sea de veras la edición
que dice `edicion`, y sobre todo que **una reedición confirmada muestre el mismo arte que la
original**. `RES-25` cazó el caso: la imagen de *Oktubre* que sirve el archivo es la banda
del logo en negro y rojo, no la pintura completa. Esa distinción no la hace ninguna máquina
—el schema no abre el JPEG— y es exactamente la que le marca error al que se sabe el disco.
El chequeo 4 de `CTR-05.9` lista los ítems por valor de auditoría para que esa lectura sea
de un renglón y no de abrir diez archivos.

#### `credito`: firmado o no valida

`credito.autor` es un **enum cerrado con un solo valor**: `Rocambole (Ricardo Cohen)`. No es
un string que alguien pueda dejar vacío o llenar con "desconocido". Es la misma decisión que
`CTR-01` tomó con el crédito del audio: publicar sin firmar no valida.

El valor único se apoya en `RES-06`, que verificó que **desde 1978 Rocambole hizo todas las
portadas** de la banda, y el nombre civil va adentro porque `UX-04` y `D-21` piden que el
crédito lo nombre. Si `RES-44` encuentra una tapa que no es suya, el ítem **no valida** hasta
que se amplíe el enum con la ficha en la mano — y eso es una tarea de `arquitectura`, no un
campo que se completa en el apuro de un lote.

`credito.origen` es de dónde salió el archivo máster, y también es enum cerrado:
`coveralia` (lo que ficha `T-47`) o `cover-art-archive` (el único conducto que `RES-25` dejó
en pie y por donde entraron las mediciones de `RES-37`). Con `D-14` la nota de derechos dejó
de ser un cerrojo y pasó a ser un mapa: este campo es lo que hace que el mapa se pueda
consultar por comando si algún día alguien pregunta. **Que `RES-25` diga que ninguna vía
resuelve el derecho está asumido por `D-14`** — el campo registra de dónde salió, no dice que
haya permiso.

**Lo que el contrato deliberadamente no tiene: un campo `alt`.** El texto alternativo de una
imagen que hay que adivinar no puede nombrar el disco, o la respuesta queda escrita en el
marcado para cualquier lector de pantalla y para cualquiera que mire el fuente. Como el
único texto seguro es el que no depende del ítem, el `alt` lo compone la pantalla
(`experiencia`) y el schema no le da a nadie un lugar donde escribir la respuesta sin darse
cuenta.

---

### CTR-05.5 — El detalle recortado no es una pista progresiva

`D-21` habilitó el detalle recortado y la pregunta razonable es si este juego lo usa como
reveal, mostrando cada vez más tapa hasta que el jugador arriesga. **No, y no es mi decisión:
la cerró `US-04` criterio 1**, que pide que el jugador *"vea el resultado inmediatamente sin
pasos adicionales"*. Un reveal en pasos es, literalmente, pasos adicionales.

Hay dos motivos más que empujan en la misma dirección. El reveal progresivo es la mecánica de
`US-02` y viene con una tabla de puntaje propia (`BR-02`, 100/80/60/40/20) que `producto`
escribió para el audio; `US-04` no tiene tabla de puntaje, y fabricarle una desde un contrato
sería renumerar una regla de negocio ajena. Y `US-04` es el juego que se cae primero
(`D-05`): meterle la mecánica más cara del proyecto al de menor prioridad es trabajo hundido
si hay que recortarlo.

**Lo que el contrato sí hace es dejar el detalle declarable como encuadre fijo del ítem.**
`imagen.encuadre` vale `entera` o `detalle`, se elige una vez al cargar el ítem y no cambia
durante la partida. Con una sola regla encima:

> **Un ítem con `encuadre: "detalle"` no puede ser `dificultad: "facil"`.** El schema lo
> rechaza.

Un recorte es más difícil que la tapa entera del mismo disco, y `BR-01` pone un ítem fácil
primero en toda partida nueva. Sin esta regla, el jugador que llega sin idea puede recibir de
entrada un pedazo de cuadro sin contexto, que es un muro de entrada con otra forma (`D-09`).
La regla es un piso de `BR-01`, no una decisión de mecánica.

**Lo que no decido, y es de `experiencia`:** `US-04` deja explícitamente fuera de la historia
*"si la tapa se muestra completa o recortada/pixelada como parte de la mecánica de
dificultad"*, con dueño `experiencia`. Yo declaro el campo y su piso; **cuál tapa se recorta,
por dónde y cómo se ve el recorte es de `UX-05`** (`T-46`), y la forma la manda
`.claude/rules/diseno-marca.md` — recorte pegado con borde de serigrafía, no la imagen a
sangre. Si `experiencia` decide que en este juego no se usa ningún detalle, el campo se queda
en `entera` para los diez ítems y no sobra nada.

---

### CTR-05.6 — Veracidad y rótulo (`D-14`), heredados de `CTR-03.6`

**`fuentes` es obligatoria siempre y tiene que contener `RES-44`.** No hay salida por
leyenda, igual que en `CTR-03.6`: lo que el ítem afirma en su núcleo es **qué disco es esa
imagen y de qué edición**, y eso no tiene versión folclórica. O está auditado o no se carga.
La ficha de edición entra por schema (`contains: "RES-44"`) porque es la única forma de que
`T-54` no pueda saltearse la auditoría de `T-47`; la ficha discográfica que sostenga el
título —`RES-02`, `RES-20`— se agrega al lado y su pertinencia la mira `revisor`, como
siempre.

**Y la leyenda no se pierde: se muda al único lugar donde puede aparecer**, que es el dato de
color de `explicacion`. Ahí es donde un ítem de este juego dice algo más allá de la tapa —de
dónde salió el perro de *Un baión*, qué era la escultura de *Luzbelito*— y ahí es donde vale
la tabla de tres casillas de `D-14`:

```json
"explicacion": "...",
"rotulo": { "tipo": "leyenda", "texto": "<quién lo cuenta y dónde>" }
```

`tipo` es `leyenda` o `testimonio`; `texto` va de 20 a 200 caracteres y **tiene que decir
quién lo cuenta y dónde**, la misma exigencia que `CTR-02.4` le pone a `rotuloLeyenda`. El
schema verifica lo que puede: que `rotulo` no exista sin `explicacion` y que traiga los dos
subcampos con largo mínimo. Lo que no puede ver —que la `explicacion` afirme algo que las
fuentes no sostienen y por lo tanto le falte el rótulo— lo caza `revisor`, y es el hallazgo
tipo `FIND-10` aplicado a este banco.

Ojo con un caso que este juego trae y el quiz no: **buena parte de lo que se sabe del arte de
las tapas está `reportado`, no verificado.** `RES-06` lo dice de sí mismo — la entrevista de
1999 a Rocambole circula reproducida en sitios de fans y su tabla de tapas está marcada
"reportado". Eso **entra igual** (`D-14`: el conocimiento popular vale), rotulado como
corresponde. Lo que no entra es puesto como hecho pelado en la `explicacion` sin rótulo.

**`sensibleA` nunca está vacío y siempre contiene `tapa`**, por schema. No existe un ítem de
`US-04` sin imagen de tapa, así que dejarlo libre sería confiar en que nadie se olvide; `D-12`
ya documentó cómo termina eso. `letra` se suma si la `explicacion` cita versos (tope de
`BR-03`); `audio` no aplica.

---

### CTR-05.7 — El schema, para pegar y correr

Draft 2020-12, igual que `CTR-02` y `CTR-03`. **Texto normativo:** si la copia de
`src/data/_schema/tapa.schema.json` se desincroniza de este bloque, manda este bloque. Esta
vez las dos salen de la misma ráfaga y son idénticas.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/tapa/1",
  "title": "CTR-05 — Banco de adivinar la tapa",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "contratoVersion", "juego", "actualizado", "items"],
  "properties": {
    "contrato": { "const": "CTR-05" },
    "contratoVersion": { "const": 1 },
    "juego": { "const": "adivinar-tapa" },
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
        "id", "us", "dificultad", "imagen",
        "opciones", "fuentes", "sensibleA", "estado"
      ],
      "properties": {
        "id": { "type": "string", "pattern": "^TP-\\d{3}$" },
        "us": {
          "type": "array", "minItems": 1,
          "items": { "type": "string", "pattern": "^US-\\d{2}$" }
        },
        "dificultad": { "enum": ["facil", "media", "dificil"] },
        "imagen": { "$ref": "#/$defs/imagen" },
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
        "explicacion": { "type": "string", "minLength": 10, "maxLength": 400 },
        "rotulo": { "$ref": "#/$defs/rotulo" },
        "fuentes": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": { "type": "string", "pattern": "^RES-\\d{2}$" },
          "contains": { "const": "RES-44" },
          "minContains": 1
        },
        "sensibleA": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": { "enum": ["letra", "tapa", "audio"] },
          "contains": { "const": "tapa" },
          "minContains": 1
        },
        "estado": { "enum": ["borrador", "listo", "retirado"] },
        "notaInterna": { "type": "string" }
      },
      "allOf": [
        {
          "if": {
            "required": ["imagen"],
            "properties": {
              "imagen": {
                "required": ["auditoria"],
                "properties": { "auditoria": { "const": "no determinable" } }
              }
            }
          },
          "then": {
            "properties": { "estado": { "enum": ["borrador", "retirado"] } }
          }
        },
        {
          "if": {
            "required": ["imagen"],
            "properties": {
              "imagen": {
                "required": ["encuadre"],
                "properties": { "encuadre": { "const": "detalle" } }
              }
            }
          },
          "then": {
            "properties": { "dificultad": { "enum": ["media", "dificil"] } }
          }
        },
        {
          "if": { "required": ["rotulo"] },
          "then": { "required": ["explicacion"] }
        }
      ]
    },
    "imagen": {
      "type": "object",
      "additionalProperties": false,
      "required": ["archivo", "encuadre", "disco", "edicion", "auditoria", "credito"],
      "properties": {
        "archivo": {
          "type": "string",
          "maxLength": 60,
          "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$",
          "not": { "pattern": "-(detalle|fondo)$" }
        },
        "encuadre": { "enum": ["entera", "detalle"] },
        "disco": { "$ref": "#/$defs/tituloDeDisco" },
        "edicion": { "type": "string", "minLength": 10, "maxLength": 120 },
        "auditoria": {
          "enum": [
            "original confirmada",
            "reedicion confirmada",
            "coincide con la original, sin marcador que lo pruebe",
            "no determinable"
          ]
        },
        "credito": {
          "type": "object",
          "additionalProperties": false,
          "required": ["autor", "origen"],
          "properties": {
            "autor": { "enum": ["Rocambole (Ricardo Cohen)"] },
            "origen": { "enum": ["coveralia", "cover-art-archive"] }
          }
        }
      },
      "allOf": [
        {
          "if": {
            "required": ["auditoria"],
            "properties": {
              "auditoria": {
                "enum": [
                  "original confirmada",
                  "reedicion confirmada",
                  "coincide con la original, sin marcador que lo pruebe"
                ]
              }
            }
          },
          "then": {
            "properties": { "edicion": { "pattern": "(19|20)\\d{2}" } }
          }
        }
      ]
    },
    "opcion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["texto", "correcta"],
      "properties": {
        "texto": { "$ref": "#/$defs/tituloDeDisco" },
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
    },
    "tituloDeDisco": {
      "enum": [
        "Gulp!",
        "Oktubre",
        "Un baión para el ojo idiota",
        "¡Bang! ¡Bang!... Estás liquidado",
        "La mosca y la sopa",
        "Lobo suelto",
        "Cordero atado",
        "Luzbelito",
        "Último bondi a Finisterre",
        "Momo Sampler"
      ]
    }
  }
}
```

**Lo que el schema NO puede verificar**, y queda para los chequeos de `CTR-05.9` o para
`revisor`:

1. Que los `id` sean únicos. `uniqueItems` compara objetos enteros y no sirve.
2. Que la opción `correcta` tenga el mismo texto que `imagen.disco`.
3. Que los cuatro `texto` sean distintos entre sí. `uniqueItems` sobre `opciones` compara
   objetos: dos opciones con el mismo título y distinta `nota` pasan.
4. Que el archivo exista en `public/tapas/` con el nombre que arma `encuadre`.
5. Que la imagen sea de verdad la edición que declara, y que una reedición confirmada
   muestre el mismo arte que la original. Ningún schema abre un JPEG.
6. Que las `RES-NN` citadas existan y sostengan lo que el ítem afirma.
7. Que el crédito se **pinte** en la pantalla. El contrato garantiza que el dato esté.

---

### CTR-05.8 — Ejemplo canónico, con lo pendiente marcado como pendiente

> **Este ejemplo está hecho para que un copiar-pegar reviente.** El ejemplo canónico de
> `CTR-02` salió con tres defectos que llegaron hasta `contenido`, y `CTR-03.9` ya adoptó la
> regla: todo valor que hoy no existe se escribe de forma que **no valide**. Acá lo que no
> existe es la auditoría de `RES-44` (`T-47` la está escribiendo), así que `edicion` y
> `credito.origen` están puestos como texto que el schema rechaza.

```json
{
  "id": "TP-998",
  "us": ["US-04"],
  "dificultad": "facil",
  "imagen": {
    "archivo": "gulp",
    "encuadre": "entera",
    "disco": "Gulp!",
    "edicion": "<qué edición es este archivo — SALE DE RES-44, no inventar>",
    "auditoria": "original confirmada",
    "credito": {
      "autor": "Rocambole (Ricardo Cohen)",
      "origen": "<de dónde se bajó este archivo — SALE DE RES-44>"
    }
  },
  "opciones": [
    { "texto": "Gulp!", "correcta": true },
    { "texto": "Oktubre", "correcta": false },
    { "texto": "Luzbelito", "correcta": false },
    { "texto": "Momo Sampler", "correcta": false }
  ],
  "fuentes": ["RES-44", "RES-02"],
  "sensibleA": ["tapa"],
  "estado": "borrador"
}
```

Qué es verdadero acá y con qué ficha: **el archivo `public/tapas/gulp.jpg` corresponde a
*Gulp!*** según el mapa de `scripts/generar-tapas.mjs`, y ***Gulp!* es un disco de la banda,
de 1985, sello Wormo** según `RES-02`. Los tres distractores son títulos reales de la misma
ficha. Lo que **no** está establecido es de qué edición es ese JPEG: eso es lo que audita
`T-47`, y por eso el ítem está en `borrador` y los dos campos que dependen de la ficha no
validan. `estado: "listo"` sale recién cuando la ficha exista y diga qué edición es.

`TP-998` y `TP-999` están reservados para los ejemplos de este documento y **no se cargan
nunca** en `src/data/tapa.json` (ver `CTR-05.11`). Si copiás este bloque, cambiale el `id`.

---

### CTR-05.9 — Casos de prueba y comandos

**No tengo con qué correr nada (`D-12`) y no lo voy a simular.** Lo de abajo lo corre el
hilo principal o `revisor` — para `T-53` alcanza con el bloque de casos de prueba, que no
necesita que `src/data/tapa.json` exista; los otros tres se corren en `T-54` y `T-56`.

Los casos de prueba del schema, que son el criterio de verificación que `T-53` tiene
declarado en el plan del ciclo:

| # | Caso | Se espera |
|---|---|---|
| 1 | Ítem válido completo | **valida** |
| 2 | Tres opciones | rechaza |
| 3 | Cinco opciones | rechaza |
| 4 | Sin `imagen.credito` | rechaza |
| 5 | `credito.autor` que no nombra a Rocambole | rechaza |
| 6 | Sin `imagen.edicion` | rechaza |
| 7 | `edicion` sin año, con auditoría confirmada | rechaza |
| 8 | Ninguna opción correcta | rechaza |
| 9 | Dos opciones correctas | rechaza |
| 10 | `auditoria: "no determinable"` con `estado: "listo"` | rechaza |
| 11 | `auditoria: "no determinable"` con `estado: "borrador"` | **valida** |
| 12 | `encuadre: "detalle"` con `dificultad: "facil"` | rechaza |
| 13 | `fuentes` sin `RES-44` | rechaza |
| 14 | Un distractor que no es un título real | rechaza |
| 15 | `rotulo` sin `explicacion` | rechaza |
| 16 | `sensibleA` sin `tapa` | rechaza |

Los casos 4, 6, 8, 10 y los dos de cantidad de opciones son los cuatro rechazos que pide el
plan. El 11 está para probar que la regla de `D-21` **no** borra el ítem: lo saca de juego y
lo deja en el archivo.

```bash
# Casos de prueba del schema. Bash, no PowerShell. Necesita `pip install jsonschema`.
# Lo corre el hilo principal o `revisor`. NO lo corre `arquitectura` (D-12).
python - <<'PY'
import copy, json, jsonschema
S = json.load(open('src/data/_schema/tapa.schema.json', encoding='utf-8'))
BASE = {
  "contrato": "CTR-05", "contratoVersion": 1, "juego": "adivinar-tapa",
  "actualizado": "2026-08-21",
  "items": [{
    "id": "TP-999", "us": ["US-04"], "dificultad": "facil",
    "imagen": {
      "archivo": "gulp", "encuadre": "entera", "disco": "Gulp!",
      "edicion": "CASO DE PRUEBA, no es una edicion real, 1985",
      "auditoria": "original confirmada",
      "credito": {"autor": "Rocambole (Ricardo Cohen)", "origen": "coveralia"}},
    "opciones": [
      {"texto": "Gulp!", "correcta": True}, {"texto": "Oktubre", "correcta": False},
      {"texto": "Luzbelito", "correcta": False}, {"texto": "Momo Sampler", "correcta": False}],
    "fuentes": ["RES-44", "RES-02"], "sensibleA": ["tapa"], "estado": "listo"}]}

def caso(n, nombre, muta, espera):
    d = copy.deepcopy(BASE); muta(d["items"][0])
    try:
        jsonschema.validate(d, S); real = "valida"
    except jsonschema.ValidationError:
        real = "rechaza"
    print(("OK " if real == espera else "MAL"), n, nombre, "->", real)

def set_aud(i, v): i["imagen"]["auditoria"] = v
caso(1, "item valido", lambda i: None, "valida")
caso(2, "tres opciones", lambda i: i["opciones"].pop(), "rechaza")
caso(3, "cinco opciones", lambda i: i["opciones"].append({"texto": "Cordero atado", "correcta": False}), "rechaza")
caso(4, "sin credito", lambda i: i["imagen"].pop("credito"), "rechaza")
caso(5, "credito sin Rocambole", lambda i: i["imagen"]["credito"].__setitem__("autor", "Desconocido"), "rechaza")
caso(6, "sin edicion", lambda i: i["imagen"].pop("edicion"), "rechaza")
caso(7, "edicion sin anio", lambda i: i["imagen"].__setitem__("edicion", "la original"), "rechaza")
caso(8, "ninguna correcta", lambda i: i["opciones"][0].__setitem__("correcta", False), "rechaza")
caso(9, "dos correctas", lambda i: i["opciones"][1].__setitem__("correcta", True), "rechaza")
caso(10, "no determinable + listo", lambda i: set_aud(i, "no determinable"), "rechaza")
caso(11, "no determinable + borrador", lambda i: (set_aud(i, "no determinable"), i.__setitem__("estado", "borrador")), "valida")
caso(12, "detalle + facil", lambda i: i["imagen"].__setitem__("encuadre", "detalle"), "rechaza")
caso(13, "fuentes sin RES-44", lambda i: i.__setitem__("fuentes", ["RES-02"]), "rechaza")
caso(14, "distractor inventado", lambda i: i["opciones"][1].__setitem__("texto", "El regreso de Patricio Rey"), "rechaza")
caso(15, "rotulo sin explicacion", lambda i: i.__setitem__("rotulo", {"tipo": "leyenda", "texto": "Lo cuentan los fans desde siempre, sin fuente"}), "rechaza")
caso(16, "sensibleA sin tapa", lambda i: i.__setitem__("sensibleA", ["letra"]), "rechaza")
PY
```

```bash
# (1) valida el banco real + ids unicos, textos distintos, la correcta = imagen.disco,
#     y que el archivo exista en public/tapas/. Se corre en T-54 y T-56.
python - <<'PY'
import json, os, jsonschema
d = json.load(open('src/data/tapa.json', encoding='utf-8'))
s = json.load(open('src/data/_schema/tapa.schema.json', encoding='utf-8'))
jsonschema.validate(d, s)
items = d['items']
assert len({x['id'] for x in items}) == len(items), 'id repetido'
for x in items:
    im = x['imagen']
    ruta = 'public/tapas/%s%s.jpg' % (im['archivo'], '-detalle' if im['encuadre'] == 'detalle' else '')
    if not os.path.exists(ruta): print('FALTA EL ARCHIVO', x['id'], ruta)
    textos = [o['texto'] for o in x['opciones']]
    if len(set(textos)) != 4: print('OPCION REPETIDA', x['id'])
    correcta = next(o['texto'] for o in x['opciones'] if o['correcta'])
    if correcta != im['disco']: print('LA CORRECTA NO ES EL DISCO', x['id'], correcta, '!=', im['disco'])
print('chequeos 1 a 4 corridos sobre', len(items), 'items')
PY

# (2) cuotas del piso de US-04 y BR-01, contadas solo sobre `listo`
python -c "import json;from collections import Counter;i=[x for x in json.load(open('src/data/tapa.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print(len(i),'/10 |',Counter(x['dificultad'] for x in i),'| discos distintos:',len({x['imagen']['disco'] for x in i}),'| encuadre:',Counter(x['imagen']['encuadre'] for x in i))"

# (3) el mapa de D-14: de donde salio cada imagen y en que estado quedo la auditoria
python -c "import json;from collections import Counter;i=json.load(open('src/data/tapa.json',encoding='utf-8'))['items'];print(Counter(x['imagen']['auditoria'] for x in i));[print(x['id'],'|',x['estado'],'|',x['imagen']['disco'],'|',x['imagen']['edicion'],'|',x['imagen']['credito']['origen']) for x in i]"
```

Qué mira la máquina y qué mira una persona, para que nadie confunda "validó" con "está
bien":

| # | Chequeo | Quién |
|---|---|---|
| 1 | Schema completo, `id` únicos | comando (1) |
| 2 | La opción correcta es igual a `imagen.disco`; los cuatro textos son distintos | comando (1) |
| 3 | El archivo existe en `public/tapas/` con el nombre que arma `encuadre` | comando (1) |
| 4 | Piso de 10, mínimo 3 fáciles, discos distintos suficientes | comando (2) |
| 5 | El reparto de auditoría, ítem por ítem | comando (3), **lo lee una persona** |
| 6 | Que la imagen sea la edición que declara, y que una reedición no cambie el arte | `revisor`, con la ficha y la imagen |
| 7 | Que las dos mitades del doble no compitan como opciones del mismo ítem | `revisor` |
| 8 | Que la pantalla pinte el crédito a Rocambole cada vez que hay una tapa | `revisor` (`T-56`) |

---

### CTR-05.10 — Las cuotas del piso, contadas sobre `estado: "listo"`

| # | Consulta | Piso |
|---|---|---|
| 1 | Ítems `listo` | ≥ **10** (`US-04`) |
| 2 | Ítems `listo` con `dificultad: "facil"` | ≥ **3** (`US-04`) |
| 3 | Discos distintos entre los ítems `listo` | ≥ **6** |
| 4 | Ítems `listo` con `auditoria: "no determinable"` | **0** (lo garantiza el schema) |

**El piso 3 necesita explicación, porque no sale de ninguna historia.** El motor no puede
servir dos ítems del mismo disco en la misma partida: si el jugador ya vio la tapa entera de
*Luzbelito* y después le toca un detalle del mismo disco, la segunda no es una pregunta. Con
seis tapas por partida —el supuesto de pacing que `PRD-alcance-v1.md` deja marcado como
PENDIENTE— hacen falta al menos seis discos distintos para armar una ronda. **Si `producto` o
`experiencia` bajan ese número al medir el tiempo real de partida, este piso baja con él**:
es aritmética, no gusto.

Es también la salida al problema que el plan del ciclo llama "el margen es fino": si la
auditoría de `T-47` deja un disco afuera como respuesta correcta, quedan nueve y el piso de
diez no cierra con un ítem por disco. **El ítem es una imagen, no un disco**, así que un
segundo encuadre de otra tapa —o una imagen distinta del mismo disco que sí esté auditada—
completa los diez sin inventar una edición. Y el título del disco que quedó afuera **sigue
jugando como distractor**: un distractor es texto del enum y no necesita imagen. Lo que se
pierde es esa tapa como pregunta, no el disco del juego.

`borrador` y `retirado` no cuentan para el piso, igual que en `CTR-02.6`.

---

### CTR-05.11 — Numeración

`TP-NNN`, tres dígitos, correlativo desde `TP-001`, **no se reutiliza**. Contador propio: no
comparte numeración con `QZ-` ni con `TM-`. Un ítem que sale de circulación va a
`"estado": "retirado"` y se queda en el archivo.

**`TP-990`..`TP-999` quedan reservados para los ejemplos de esta documentación y no se cargan
nunca en `src/data/tapa.json`.** Hoy están tomados `TP-998` (el ejemplo de `CTR-05.8`) y
`TP-999` (el caso base de las pruebas). Misma excepción de tres dígitos declarada en
`CTR-02.7`, por el mismo motivo, y con la misma aclaración: no edito `Docs/IDS.md` porque no
es mi carpeta.

---

### Consecuencias

- `contenido` no puede cargar un solo ítem `listo` antes de que exista `RES-44`, y es a
  propósito: la ficha entra por `fuentes` con `contains`, no por buena voluntad. La cadena
  `T-47 → T-54` del plan queda hecha cumplir por el schema y no solo por la tabla del ciclo.
- Lo que el contrato le impone al motor (`T-55`): baraja las opciones, no sirve dos ítems del
  mismo `imagen.disco` en la misma partida, precarga el ítem en juego más uno, y filtra por
  `estado: "listo"` como ya hace `cargarBanco` en `banco.ts`. Nada de eso necesita un campo
  nuevo.
- Lo que le impone a `experiencia`: cuatro opciones de texto en zona pulgar con la imagen
  arriba —el título más largo del enum, *¡Bang! ¡Bang!... Estás liquidado*, son 32
  caracteres, la mitad del peor caso de `CTR-03`—, el crédito a Rocambole visible cada vez
  que hay una tapa, y un `alt` que no nombre el disco durante la partida.
- Fácil: sacar de juego una tapa que resultó dudosa. Se cambia `auditoria` y `estado` en el
  mismo ítem, el archivo sigue validando y el título sigue jugando como distractor.
- Fácil: ampliar el enum de títulos o el de crédito. Las dos cosas son aditivas y ningún dato
  cargado deja de validar.
- Difícil, y a propósito: cargar un ítem sin firmar, sin edición o sin auditoría. No hay
  tilde que marcar; hay un enum cerrado, un patrón de año y una ficha exigida por `contains`.
- Difícil, y asumido: **el schema no mira la imagen.** Puede garantizar que el ítem declare su
  edición; no puede ver que el JPEG sea otra cosa. Ese es el chequeo 6 y es de `revisor`, con
  el aviso de `RES-25` sobre *Oktubre* en la mano.
- Este contrato no le pide nada a `producto` ni deja ningún valor de trabajo abierto.

### Qué NO decide este contrato

- **Cuál tapa se recorta, por dónde y cómo se ve el recorte**: `experiencia`, `UX-05`
  (`T-46`), y la forma la manda `.claude/rules/diseno-marca.md`.
- **Si en este juego se usa detalle recortado o solo tapa entera**: `experiencia`, porque
  `US-04` le dejó explícitamente esa mecánica. Yo dejo el campo y el piso de `BR-01`.
- **Qué diez tapas entran, cuál es fácil y qué dice cada `explicacion`**: `contenido`, con
  `RES-44` y `RES-06`.
- **Qué edición es cada archivo**: `investigador`, `RES-44` (`T-47`).
- **El copy de la pregunta, el `alt`, dónde va el crédito en pantalla y cómo se ve el
  resultado**: `experiencia`.
- **Si el uso de tapas necesita algo más que el crédito**: `contenido`, nota de derechos —
  que con `D-14` es un mapa y no un cerrojo.
