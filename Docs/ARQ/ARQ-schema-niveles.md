# ARQ — Schema de los niveles: `src/data/skayboy.json`

> Rol dueño: `arquitectura`. **Produce: `CTR-16`** (`CTR-16.1` … `CTR-16.9`).
>
> **Consume:** `CLAUDE.md` (*"nada de datos hardcodeados: el contenido viene siempre de
> `src/data/*.json`"*), `D-14`, `D-32` (límite 3), `D-38`, `D-39`, `D-40`, `D-41`, `D-42`,
> **`D-43`**, `BR-01`, `BR-16`, `IDEA-14` (par elemental cielo/infierno, piso leído 2/2/2),
> `RES-61.1` … `RES-61.8` (`INV-60`), `ADR-08` (`ARQ-motor-de-juego.md`), `CTR-15`,
> `CTR-17`, `CTR-02`, `CTR-08` (forma del envoltorio), **`UX-27 §2`** (la grilla),
> **`UX-28 §1`** (dos columnas, ningún modo que elegir), **`UX-29 §7`** (el terreno ajeno
> devuelve a la entrada, y el nivel es una sala cerrada), **`REV-14`** (`FIND-55`, `FIND-58`,
> y `FIND-59`), **`US-09` criterio 4**, `src/lib/esquemas.test.ts`.
>
> **Qué NO es:** no es el diseño de los niveles ni el piso de cuántos hay. El piso lo fija
> `producto` al promover (`BR-16`), y a quién devuelve cada terreno es **criterio del sitio**
> y se declara como tal (`IDEA-14`): este schema lo deja escrito en el dato, no lo decide.
>
> Última actualización: 2026-09-16 (ciclo 15, primera versión, **enmendada el mismo día por
> `REV-14`**: `FIND-55` cambió la grilla —el envoltorio de `CTR-16.2` decía 26 × 12 y ahora
> dice 15 × 9— y `FIND-58` rehízo `CTR-16.3` y `CTR-16.4`, que decían dos veces quién se
> lastima y una de las dos no era computable. Cada enmienda está marcada donde pasó).
>
> **Regla de escritura que nace de `FIND-55`: toda medida de píxel dice si es _nativa_ o
> _CSS_. En este documento todo es nativo, porque un dato de nivel no sabe a qué escala se
> va a ver — eso es de `ADR-08.3` y de `UX-27`.**

---

## CTR-16 — Contrato de `src/data/skayboy.json`

- **Fecha:** 2026-09-16
- **Estado:** **vigente, con un valor abierto que no es mío** — `temaFijo` (lo elige
  `contenido` con `experiencia`, `D-39` consecuencia 3) y el reparto personaje→terreno
  (`CTR-16.4`).
- **Para quién es:** para quien diseñe los niveles; para el hilo principal, que los carga;
  para `revisor`, que tiene que poder rechazar un nivel sin preguntarle nada a nadie.

### Por qué un JSON propio y no un editor

`RES-63.8` cerró que un mapa de Tiled **no** hereda la GPL del editor, y `RES-62.18` que LDtk
es MIT de punta a punta: los dos se pueden usar. **Y aun así el dato de este juego es un JSON
propio.** El motivo es del repo, no de la licencia: el formato de LDtk son miles de líneas de
JSON generado con campos que nadie de acá escribió, y `esquemas.test.ts` lo validaría contra
un schema que tampoco escribimos. Seis niveles de 15 × 9 tiles son **nueve renglones de
quince caracteres cada uno**, legibles en un diff, editables sin instalar nada y validables
contra un schema de una página. El editor gana cuando hay cien niveles; acá hay seis.

Si algún día son cien, el camino está: LDtk exporta y un script de ingesta escribe este mismo
formato. Es una decisión de producción, no de arquitectura.

---

### CTR-16.1 — El archivo

| | |
|---|---|
| Ruta del dato | **`src/data/skayboy.json`** |
| Ruta del schema | **`src/data/_schema/skayboy.schema.json`** |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Versionado | Git, más el par `contrato` / `contratoVersion` adentro del archivo |
| Presupuesto de tamaño | **≤ 24 KB sin comprimir** |

**Los dos nombres importan y no son libres.** `src/lib/esquemas.test.ts` empareja dato y
schema por nombre de archivo: recorre un arreglo (hoy siete entradas, línea 48) y abre
`src/data/<n>.json` contra `src/data/_schema/<n>.schema.json`. Sumar los niveles a la
verificación es agregar **`'skayboy'`** a ese arreglo — y **el día que los dos archivos
existan, no antes**, que es la regla escrita en el comentario de la línea 44.

**Sobre el nombre `skayboy`:** el título del juego todavía no está fijado (es de `contenido`,
punto 7 de `IDEA-14`). Si cambia, el renombre son tres lugares —el dato, el schema y esa
línea del arreglo— y el test rompe hasta que los tres coincidan. Se paga barato y con aviso.

**Presupuesto:** seis niveles de 9 renglones de 15 caracteres son menos de 1 KB de grilla;
con leyenda, mecanismos y metadatos, unos 5 KB. El techo de 24 KB está para que nadie
descubra el problema con el banco ya armado, y con la grilla de `FIND-55` quedó todavía más
lejos.

---

### CTR-16.2 — Envoltorio

```json
{
  "contrato": "CTR-16",
  "contratoVersion": 1,
  "juego": "skayboy",
  "actualizado": "2026-09-16",
  "tile": 16,
  "ancho": 15,
  "alto": 9,
  "temaFijo": null,
  "personajes": [ ... ],
  "leyenda": { ... },
  "niveles": [ ... ]
}
```

- **`tile`, `ancho`, `alto` viven en el dato y son iguales para todos los niveles.** El schema
  los fija en **16, 15 y 9 px nativos / tiles** (`ADR-08.3`, `CTR-15.3`, `UX-27 §2`) — decían
  26 y 12 hasta que `FIND-55` los corrigió. Están escritos igual, y no es redundancia: es lo
  que permite que el validador compare cada renglón de grilla contra `ancho` sin que el
  número esté en el código.
- **Que la grilla se haya achicado de 312 tiles a 135 no es un detalle de formato: cambia lo
  que entra en un nivel.** Un nivel de 15 × 9 con dos personajes de 1 × 1,5 tiles adentro es
  una sala chica, y eso es exactamente lo que `UX-29 §7.1` pidió —una sala cerrada, sin vacío
  por donde caerse— y lo que `UX-28 §6` presupuesta —un nivel que se pasa en menos de un
  minuto. **El que diseñe los niveles lo va a sentir en el primero**, así que queda anotado
  acá y no en una nota al pie.
- **`temaFijo` es el tema que la cinta repite durante la partida** (`D-39`, `ADR-08.9`). Es el
  `slug` de un tema del catálogo, o `null` mientras no esté elegido. **Con `null` el juego
  suena a cama, como los otros siete, y no rompe nada**: es el estado seguro.
  Quién lo elige: `contenido` con `experiencia` (`D-39` consecuencia 3). El candidato natural
  sale de la familia cielo/infierno, que es el par elemental decidido.
- **`contrato` y `contratoVersion` adentro del dato**, por el mismo motivo que en `CTR-02` y
  `CTR-08`: dentro de dos meses, mirando solo el JSON, se tiene que poder saber contra qué
  documento validarlo.

---

### CTR-16.3 — Los dos personajes

> **Enmendado el 2026-09-16 por `FIND-58` (`REV-14`), y lo encontró el revisor: no lo vio
> ningún rol.** Este bloque declaraba `inmuneA: ["cielo"] / ["infierno"]`, y eso tenía dos
> defectos que se tapaban entre sí:
>
> 1. **No era computable.** `"cielo"` e `"infierno"` no eran valores de ningún enum del
>    contrato: ningún caracter de la leyenda declaraba pertenecer a un terreno llamado así.
>    Un validador no podía decir si el dato era coherente, y un lector tampoco.
> 2. **Era la segunda vez que el archivo decía lo mismo.** La leyenda ya lo decía por otro
>    camino (`tipo: "letal"` + `mata`), y **dos lugares que dicen quién se lastima es un lugar
>    donde se van a contradecir.**
>
> **Se va `inmuneA` entero.** Quién es devuelto por qué terreno se escribe **una sola vez, en
> la leyenda**, que es donde vive el terreno. Y de paso se va el vocabulario de muerte, que
> `UX-29 §7.2` retiró con todas las letras: *"ninguno de los dos mata a nadie"*.

```json
"personajes": [
  { "id": "skayboy",  "atlas": "skayboy.v1" },
  { "id": "poligirl", "atlas": "poligirl.v1" }
]
```

**Exactamente dos, ni uno más ni uno menos**, y el schema lo exige con `minItems: 2` /
`maxItems: 2`. **Un personaje acá es un `id` y un atlas, y nada más.** Todo lo que lo
distingue del otro está del lado del terreno (`CTR-16.4`), que es el que lo deja pasar o no.

**Por qué eso es mejor y no solo más corto:** un campo por personaje invita a que aparezca el
segundo. Con `inmuneA` en la ficha del personaje, el día que alguien quiera que uno salte más
alto el lugar ya está hecho. Sin campos, agregar una diferencia obliga a escribir una
decisión.

**Paridad, que es contrato y no preferencia** (`D-38`, y lo que el propio sitio publica
rotulado `hecho` sobre Carmen Castro):

- Los dos usan la misma celda y la misma caja de colisión (`CTR-15.3`).
- Los dos tienen las mismas cinco animaciones (`CTR-15.7`).
- Los dos tienen **exactamente un** terreno que los devuelve a ellos solos, y no es el mismo
  (`CTR-16.4`).
- **No hay campos de habilidad por personaje en este schema, a propósito.** Si mañana uno
  salta más alto, eso entra por una decisión escrita y no por un campo que aparece un martes.

**El reparto sigue siendo criterio del sitio y sigue sin fundamento fichado.** En los 105
títulos y en los 2913 versos del cancionero no hay un solo verso que asocie a ninguna de las
dos personas con un elemento (medición de `INV-60`). Quién es devuelto por qué terreno lo
decide `experiencia` con `contenido`, se escribe en la leyenda, y **ninguna pantalla puede
explicar el porqué** — decir "no puede pasar por X porque Y" inventa un fundamento que no
existe, y eso cae bajo lo único que `CLAUDE.md` declara estricto.

---

### CTR-16.4 — La leyenda: qué es cada caracter de la grilla

> **Enmendado el 2026-09-16 por `FIND-58`.** Cambian dos cosas: el `tipo` `"letal"` con su
> campo `mata` pasa a llamarse **`"molinete"` con `devuelve`**, y esta tabla queda como **el
> único lugar del archivo donde se declara quién no puede pasar por dónde.**

```json
"leyenda": {
  ".": { "tipo": "aire" },
  "#": { "tipo": "solido" },
  "C": { "tipo": "molinete", "devuelve": ["poligirl"] },
  "I": { "tipo": "molinete", "devuelve": ["skayboy"] },
  "X": { "tipo": "molinete", "devuelve": ["skayboy", "poligirl"] },
  "o": { "tipo": "tesoro", "para": ["skayboy", "poligirl"] },
  "1": { "tipo": "entrada", "de": "skayboy" },
  "2": { "tipo": "entrada", "de": "poligirl" },
  "A": { "tipo": "puerta",  "de": "skayboy" },
  "B": { "tipo": "puerta",  "de": "poligirl" },
  "=": { "tipo": "mecanismo" },
  "n": { "tipo": "caja" }
}
```

**Por qué `molinete` y no `letal`, `peligro` o `dañino`.** `UX-29 §7.2` decidió la mecánica y
le puso nombre en la misma línea: *"el elemento ajeno devuelve a la entrada… no te consume,
te rechaza. **Es el molinete otra vez**"*. Usar acá cualquier palabra de daño sería dejar en
el schema el vocabulario que `UX-29` retiró del juego, y el dato es justo el lugar donde ese
vocabulario sobrevive más tiempo: un `tipo: "letal"` en un JSON termina siendo una clase de
CSS llamada `letal`, un nombre de función `mata()` y, tarde o temprano, una palabra en
pantalla. **El enum completo de `tipo`** es entonces: `aire`, `solido`, `molinete`, `tesoro`,
`entrada`, `puerta`, `mecanismo`, `caja`.

- **La leyenda es del archivo entero, no de cada nivel.** Un caracter que significa una cosa
  en el nivel 2 y otra en el 5 es un defecto esperando.
- **`devuelve` es la única declaración de quién no pasa, y es obligatoria en todo
  `molinete`.** Nombra uno o dos `id` de `personajes`, sin repetidos. No hay un segundo lugar
  donde decirlo y no hay manera de que dos lugares se contradigan, que era `FIND-58`.
- **El tercer molinete —el que devuelve a los dos— no es opcional.** `RES-61.1` lo verificó
  en el juego de origen y es lo que hace que los dos tengan que cuidarse del mismo obstáculo
  alguna vez. Sin él, el par no coopera: se turna.
- **Lo que la leyenda no dice:** cómo se ve. Eso es el tileset (`CTR-15`) y el mapa
  caracter→tile vive en el JSON del tileset, no acá. Un dato de nivel que traiga un color es
  un dato de nivel que hay que editar cuando cambie la paleta.

#### Cómo se verifica, y qué parte no la puede hacer el schema

`FIND-58` pide que esto sea validable por `esquemas.test.ts`, así que conviene decir con
precisión qué hace cada mitad — porque **JSON Schema no sabe contar propiedades de un objeto
por su contenido**, y afirmar que sí sería el mismo defecto que el hallazgo vino a arreglar.

| Regla | Quién la hace cumplir |
|---|---|
| `tipo` es uno de los ocho del enum | `skayboy.schema.json`, `enum` |
| Todo `molinete` trae `devuelve` con 1 o 2 entradas, `uniqueItems`, y cada entrada es `"skayboy"` o `"poligirl"` | el schema, con `if`/`then` sobre `tipo` |
| `de` y `para` solo nombran esos mismos dos `id` | el schema |
| Los caracteres de la leyenda son de un solo caracter y no se repiten | **el schema, gratis**: son claves de un objeto |
| **Hay exactamente un molinete que devuelve solo a `skayboy`, exactamente uno que devuelve solo a `poligirl`, y exactamente uno que devuelve a los dos** | **un caso de prueba propio en `esquemas.test.ts`**, cuatro líneas de JavaScript sobre el JSON ya parseado |

**Alternativa descartada, y es la que parece mejor hasta que se mira de cerca:** hacer que
`leyenda` sea un **arreglo** de `{ "caracter": …, "tipo": … }`. Con un arreglo, `contains` +
`minContains`/`maxContains` expresan la última fila **dentro del schema**, que es lo que uno
quiere. Se descarta porque se pierde algo peor: en un arreglo **nada impide dos entradas para
el mismo caracter**, y eso el schema tampoco lo puede chequear. Entre "una regla de conteo
vive en el test" y "un caracter duplicado entra en silencio y el segundo pisa al primero", la
elección es fácil — **el defecto que el mapa hace imposible es el que nadie vería.**

---

### CTR-16.5 — Un nivel

```json
{
  "id": "NIV-01",
  "nombre": "",
  "escalon": 1,
  "estado": "borrador",
  "grilla": [
    "###############",
    "#.............#",
    "..."
  ],
  "mecanismos": [
    { "id": "MEC-01", "en": [4, 7], "abre": ["PUE-01"], "sostenido": false }
  ],
  "cajas": [ { "en": [7, 7] } ],
  "verificaciones": { "deDos": false, "solo": false }
}
```

| Campo | Regla del schema |
|---|---|
| `id` | `NIV-` más dos dígitos. No se reutiliza, y un nivel descartado se marca y se queda (`Docs/IDS.md`) |
| `nombre` | **≤ 8 palabras.** Es una línea grande del sitio y le rige el techo de `voz-ricotera.md` §4.1. El texto es de `contenido` |
| `escalon` | entero **1, 2 o 3**. Es lo que hace verificable el escalonamiento de `BR-01` sin que nadie cuente a mano |
| `estado` | `borrador` \| `listo`. La página sirve **solo** los `listo`, igual que `dos-ejes` (`CTR-08`) |
| `grilla` | exactamente `alto` renglones de exactamente `ancho` caracteres, todos declarados en `leyenda`. Es la regla que más defectos caza y la más barata de correr |
| `mecanismos`, `cajas` | coordenadas `[columna, fila]` en tiles, dentro de la grilla |
| `verificaciones` | ver `CTR-16.7` |

**Dos reglas de composición que el schema exige y no son estética:**

1. **Exactamente una entrada y exactamente una puerta por personaje.** Cero es un nivel que no
   se puede terminar; dos es un nivel con dos finales y ningún motivo.
2. **La condición de victoria es que los dos estén en su puerta al mismo tiempo**
   (`RES-61.2`). No es un campo: es la regla del juego, y está acá escrita para que nadie la
   parametrice por nivel. Un nivel que se gana con uno solo en la puerta es otro juego.

> **`FIND-59` cerrado a favor de estas dos reglas: rigen desde el nivel 1.** `US-09` criterio
> 4 le da al primer nivel **las dos entradas y las dos puertas**, y `producto` lo confirmó
> cediendo su lado (`T-231`). Las reglas 1 y 2 quedan como están: ningún campo por nivel,
> ningún `if`/`then`.

---

### CTR-16.6 — `D-40` hecho cumplir por el schema, no por la buena voluntad

`D-40` consecuencia 1 dice, textual: queda prohibido **por construcción** el puzzle que
**exige** simultaneidad, salvo que tenga una segunda solución para el que juega solo. Un
schema no puede probar que un nivel se resuelve; **sí puede hacer imposible declararlo sin la
segunda solución.**

```json
"sostenido": true,
"alternativaSolo": "la caja de [7,9] tapa la placa y la deja abierta"
```

- **`sostenido: true`** quiere decir que el mecanismo solo aguanta mientras alguien lo pisa —
  o sea, que pide dos cuerpos a la vez.
- **Cuando `sostenido` es `true`, `alternativaSolo` pasa a ser obligatorio** y con texto de
  verdad (`minLength: 10`). Se hace con un `if`/`then` del schema, que es JSON Schema 2020-12
  estándar y `ajv` ya lo corre.
- **No hay manera de esquivarlo:** `sostenido` es obligatorio en todo mecanismo, así que un
  puzzle simultáneo declarado como no-simultáneo es una mentira escrita a mano, no un
  descuido. Y una mentira escrita a mano la caza `revisor` jugando, que es lo que le toca.

Esto es lo más importante de todo el contrato y por eso tiene sección propia: es la única
consecuencia de `D-40` que, si no se escribe **antes** de que se dibuje el primer nivel, sale
carísima después.

---

### CTR-16.7 — `listo` cuesta dos pasadas

```json
"verificaciones": { "deDos": true, "solo": true }
```

El schema exige: **si `estado` es `listo`, los dos booleanos tienen que ser `true`.** Otro
`if`/`then`.

Es `D-40` consecuencia 2 vuelta contrato: *"cada uno se verifica dos veces —dos personas
moviéndose a la vez y una sola alternando"*. Seis niveles que valen por doce en diseño, no
doce niveles.

**Quién los pone en `true`:** el que probó, y es `revisor` (`D-12`: los cuatro roles que
escriben no tienen con qué correr nada). **Un booleano no prueba nada por sí mismo** — lo que
hace es que nadie pueda marcar un nivel como terminado sin haber tenido que escribir, con la
mano, que lo probó de las dos maneras. Es el mismo mecanismo que un rótulo: no garantiza el
contenido, garantiza que alguien se hizo cargo.

---

### CTR-16.8 — Qué le llega al navegador, y los límites de módulo

La página resuelve el banco en build y le manda al navegador **solo los niveles `listo`**,
sembrados como `<script type="application/json">`, igual que `dos-ejes`
(`dos-ejes.astro:82`). Seis niveles son un par de KB: no hace falta pedirlos por red ni
partirlos.

Los módulos y sus límites, que es lo que evita el defecto de `D-29`:

| Módulo | Qué hace | Qué **no** puede importar |
|---|---|---|
| `src/lib/skayboy/niveles.ts` | tipos del dato y las funciones puras que lo leen | nada de `node:*`, nada de `sitio/arte.ts`, nada del motor |
| `src/lib/skayboy/copy.ts` | el texto visible | idem. **Y entra a `MODULOS` de `voz.test.ts`** (`ADR-08.8`) |
| `src/scripts/partida-skayboy.ts` | la isla: lo único que importa el motor | nada de `node:*`. Es el único archivo del repo con un import desnudo de npm, y está en la lista blanca de `ADR-08.7` |
| `src/lib/skayboy/sonido.ts` | los efectos de `CTR-17` | el motor, y cualquier cosa que cree un `AudioContext` que no sea `contexto.ts` |

**La isla no lee `src/data/` en tiempo de ejecución.** Lee el `<script type="application/json">`
que la página ya sembró. Un `import` de JSON dentro de la isla mete el banco entero al bundle,
incluidos los `borrador`.

---

### CTR-16.9 — Lo que este contrato deja abierto a propósito

| Qué | De quién |
|---|---|
| **El piso de niveles** y el criterio Given/When/Then | `producto` al promover (`BR-16`). La lectura que existe es 2/2/2, y `escalon` está en el schema para que ese número sea verificable |
| **`temaFijo`** | `contenido` con `experiencia` (`D-39` consecuencia 3) |
| **El reparto de `devuelve`** — qué molinete rechaza a quién | `experiencia` con `contenido`. Es criterio del sitio y no se explica en ninguna pantalla. (Se llamaba "el reparto `inmuneA` / `mata`" hasta `FIND-58`) |
| **El rango por letra** de `RES-61.8` | **No está en este schema, y es a propósito.** `RES-61.8` avisa que el umbral de tiempo no se puede copiar de ningún lado y que es trabajo de afinación. Si `producto` lo quiere, entra como `contratoVersion: 2` con un campo `tiempoObjetivo` por nivel. Mientras tanto, **no se promete un puntaje que no está** |
| **Los mecanismos que el juego de origen suma después** —espejos, portales, hielo, ventiladores (`RES-61.12` … `RES-61.15`) | Ampliación de un ciclo posterior. La leyenda es abierta por diseño: sumar un `tipo` es sumar una entrada al `enum` del schema y un tile |
| **Qué es el fracaso, y cómo se narra** (`D-42` precisión 2) | Era de `producto` con `contenido`, y **`UX-29` lo cerró el mismo día**: no se muere nadie, a alguien lo devuelven a la entrada, el fracaso no suena y no cuesta vidas sino reloj. Este schema nunca tuvo campo de muerte y ahora no lo va a tener: lo que hay es `devuelve` (`CTR-16.4`). Lo que sigue siendo de `producto` es **cuánto cuesta el reloj y si hay tope** (`UX-29 §4`) |
