# ARQ — "Más o menos" (`US-10`): el banco, las familias derivadas, la referencia y el sorteo

> Rol dueño: `arquitectura`. **Produce: `CTR-20`** (`CTR-20.0` … `CTR-20.13`) y tres requisitos no
> funcionales, `RNF-CTR-20-A` … `RNF-CTR-20-C`. Fecha: 2026-09-25.
>
> **Consume:** `D-48` (reescrita el 2026-09-25), `D-09`, `D-13`, `D-14`, `D-45`, `D-46`, `ADR-02`,
> `CTR-06`, `CTR-19` (`.2`, `.3`, `.9`, `.13`, `.16`), `RES-20`, `RES-89`, `RES-90`, `RES-91`,
> `RES-93`..`RES-98` (`INV-93`), `RES-100`..`RES-105` (`INV-100`, con la nota del hilo principal al
> pegarla), `UX-34` §3.2, `Docs/SUGERENCIAS/HILO-para-todos-mas-o-menos-el-modelo.md`,
> `Docs/SUGERENCIAS/HILO-para-contenido-mas-o-menos-las-palabras.md`, dos mensajes del hilo
> principal del 2026-09-25 (el segundo retira `comoReferencia`), y el código leído en disco el mismo
> día: `src/lib/mas-o-menos/{conteo,datos,referencia,partida,formato}.ts` y sus tests,
> `src/lib/letra/temas.ts` (`leerDiscos`, `leerDuraciones`), `src/lib/letra/discos.ts`,
> `src/lib/cancionero/anotacion.ts`, `src/lib/desafio.ts`, `src/lib/esquemas.test.ts`,
> `src/data/setlistfm.json`.
>
> **El motor ya está escrito** contra el modelo del hilo principal. Este contrato lo fija y lo
> endurece. Todo lo que cambia respecto del modelo o del código está junto en `CTR-20.0`, con su
> motivo, para que el hilo principal no lo tenga que buscar en el resto del documento.

---

## CTR-20 — Contrato de "Más o menos"

- **Estado:** vigente. **Nada bloquea el build.** Quedan dos puntos abiertos y ninguno cambia la
  forma del archivo: si el número de `en-vivo` puede ser el número grande del revelado, algo que
  `RNF-CTR-19-A` hoy no permite (`CTR-20.9`, pedido a `producto`), y la duración de un track oculto
  (`CTR-20.13`, a `investigador`, no bloqueante).
- **Para quién:** para el hilo principal (motor y build), para `contenido` (`CNT-25`: los datos a
  mano, las palabras y las plantillas de `copy.ts`), para `experiencia` (`UX-34`: qué trae cada
  dato) y para `revisor` (`REV-16`, que cita `CTR-20.11`).
- **Qué resuelve:** qué se escribe a mano y qué no se puede escribir; de dónde sale cada número
  derivado; cómo se pone la referencia para que **la respuesta nunca se sepa sin saber**; cómo se
  arma la partida; qué viaja al navegador.
- **No hace falta un `ADR` nuevo.** Nada de esto es caro de revertir. El schema es un archivo
  nuevo, el motor son funciones puras con test, y el desafío usa una forma de `ADR-02` que ya
  existe.

---

### CTR-20.0 — Lo que cambia respecto del modelo y del código

Lo que no figura en esta tabla queda **como está en el modelo y en el código**, y pasa a ser
normativo: los cuatro escalones, la tabla `DISTANCIA`, el redondeo de `pasoDeRedondeo()`,
`CHANCE_DE_PAR = 0.5`, la bolsa de familias de `partida.ts`, `MINIMO_EN_VIVO = 3`, la exclusión de
*Mariposa Pontiac*, los ids derivados, la clave de `localStorage` y la forma `marcador`.

| # | Qué | Modelo / código hoy | `CTR-20` | Por qué | Toca |
|---|---|---|---|---|---|
| 1 | `comoReferencia` | el hilo lo sumó y lo retiró | **no existe**. `additionalProperties: false` lo rechaza | `UX-34` §3.2: la referencia de un par es `sujeto` chico y valor grande, sin oración | `DatoCrudo`, `Dato`, `Plantillas`, `armarPozo` |
| 2 | `sujeto` en una medida propia | opcional | **prohibido** (schema) | `sujeto` presente quiere decir que el dato puede ser la referencia de un par, que es como lo lee `UX-34`. Un campo que nadie lee se desactualiza sin que nadie lo note | JSON |
| 3 | Qué hace compartida a una medida | `armarPozo` cuenta los `listo` con esa medida y tira si no cuadra | **la forma de la medida**: `MM-NN` (igual al `id`) es propia, un nombre (`anio-nacimiento`) es compartida | contando sobre `listo`, un compañero en `borrador` rompe el build. Ahora el schema valida la forma, y un nombre que hoy usa un solo dato `listo` no rompe nada: no va en par hasta que llegue el segundo | `armarPozo` |
| 4 | `segun` ⇒ medida propia | nada | schema | en un par, el valor de la referencia se ve debajo del `sujeto` y sin su rótulo (`UX-34` §3.2). Un "según" pelado es una leyenda vestida de hecho (`CLAUDE.md`) | JSON |
| 5 | `segun` ⇒ la pregunta nombra a quien lo dijo | nada | test `i6` | `INV-100`, "Siguiente" (1), y `CLAUDE.md`: si la respuesta depende de qué fuente mirás, la pregunta está rota. Nombrar la fuente en la pregunta deja una sola respuesta | `CNT-25` |
| 6 | `entero`: referencia mínima | ≥ 1 | **≥ 2** | con 1, la respuesta se sabe sin saber: ningún número del pozo es 0 y no hay empates, así que "¿más o menos que 1?" es siempre "más". Es un punto regalado que el jugador aprende una vez y usa siempre | `referencia.ts` |
| 7 | `anio`: referencia máxima | ≤ 2026 | **≤ 2025** (`< ANIO_TOPE`) | mismo motivo: ningún valor pasa de 2026 y no hay empates, así que "¿antes o después de 2026?" es siempre "antes" | `referencia.ts` |
| 8 | `segundos`: referencia mínima | ≥ 10 s | **≥ 30 s** | "¿dura más o menos que 0:10?" no es una pregunta sobre una canción. El tema más corto del pozo dura 0:53 | `referencia.ts` |
| 9 | `segundos`: distancia mínima | el comentario la promete y el código no la cumple: con `V = 213`, racha 10+ y `d = 10`, sale 205, a 8 s | **≥ 10 s después de redondear** | en el último escalón el par ya pide 10 s. La referencia número no puede quedar más fina que el par | `referencia.ts` |
| 10 | Techo por dato | no existe | **`techo`** en `palabra` (temas contados) y en `en-vivo` (setlists cargados). La referencia queda por debajo | *Jijiji* figura 101 veces; × 3,5 da "¿figura en más o menos que 355 setlists?", con un rótulo que dice "de 256". En `palabra`, *amor* × 3,5 pasa de los 100 temas con letra | `Dato`, `referenciaNumero`, `armarPozo` |
| 11 | Distancia del par | ≥ el piso del escalón | **franja**: ≥ el piso del escalón y < el piso del anterior | con piso solo, a racha 10+ entra *Jijiji* (101) contra *Scaramanzia* (5). El par sale la mitad de las veces que se puede, así que a racha alta medio juego vuelve a ser de sentido común. Los asserts que ya tiene `referencia.test.ts` siguen en verde | `lejosParaPar` |
| 12 | `FUERA_DE_EN_VIVO` | lista a mano | **regla**: queda afuera todo slug que tenga alguna línea `grafiaDe`. La lista puede quedar si un test prueba que es exactamente ese conjunto | si mañana aparece otra grafía, hoy entra en silencio con un número que es un piso y no la cuenta | `datos.ts`, `i15` |
| 13 | Lo que viaja | `Dato[]` | **`PozoDeLaIsla`**: `datos`, `enVivo { pagina, consultado, setlistsCargados }`, `palabras { contados, total }` | `RNF-CTR-19-A` pide el enlace a la página y la fecha en el mismo bloque, y hoy `Fuentes.setlist` no trae ninguna de las dos | `datos.ts`, la página |
| 14 | Palabra en un solo tema | el build tira solo con 0 | **≥ 2 temas** (build y `i12`) | la regla de `HILO-para-contenido-mas-o-menos-las-palabras.md` | `armarPozo` |
| 15 | Medidas reservadas; `RES-20` y `RES-90` como fuente a mano | nada | schema | `D-13`: un número que ya lee el código no se copia | JSON |
| 16 | Rango del valor por escala | nada | schema: `anio` 1900–2026, `entero` ≥ 1, `segundos` 30–1200 | la escalera de `segundos` es absoluta (±2 a 3 min en el primer escalón) y está hecha para canciones. Contra un disco de 40 min, ±2,5 min en el primer escalón ya es difícil. **Lo que dura más de 20 min va en `entero`, con unidad minutos** | JSON |

---

### CTR-20.1 — El archivo

| | |
|---|---|
| Ruta del dato | **`src/data/mas-o-menos.json`** |
| Ruta del schema | **`src/data/_schema/mas-o-menos.schema.json`** (el bloque de `CTR-20.12`, copiado idéntico) |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Versionado | Git, más `contrato: "CTR-20"` y `contratoVersion: 1` adentro del dato |
| Presupuesto | **≤ 60 KB** sin comprimir (~120 datos de ~350 B y 25 palabras de ~200 B dan ~50 KB) |
| Presupuesto de cliente | **0 KB del archivo.** El navegador recibe el pozo ya armado (`CTR-20.8`), nunca este JSON |

`esquemas.test.ts` empareja dato y schema por nombre. Sumarlo es agregar `'mas-o-menos'` al
arreglo **el día que existan los dos archivos**, no antes: es la regla que ese test ya se impone.

**Envoltorio:**

```json
{
  "contrato": "CTR-20",
  "contratoVersion": 1,
  "actualizado": "2026-09-25",
  "datos": [ … ],
  "palabras": [ … ]
}
```

Los dos arreglos son obligatorios y pueden estar vacíos. Con los dos vacíos el juego se arma igual
con tres familias derivadas (`CTR-20.7`, piso de dos familias).

---

### CTR-20.2 — El dato a mano

Solo las tres familias de la banda: `la-banda`, `la-gente` y `los-recitales`. **Los ids
`MM-997`, `MM-998` y `MM-999` están reservados para los ejemplos de este contrato y no se cargan
nunca** (`i3`). Los números de los ejemplos salen de `INV-100`, pero los ejemplos no son datos: los
datos los carga `contenido` en `CNT-25`.

```json
{
  "id": "MM-998",
  "familia": "la-gente",
  "medida": "anio-nacimiento",
  "pregunta": "¿En qué año nació Skay Beilinson?",
  "sujeto": "Skay Beilinson",
  "valor": 1952,
  "escala": "anio",
  "firmeza": "hecho",
  "fuente": "RES-101",
  "estado": "borrador",
  "notaInterna": "Ejemplo de CTR-20.2. Su par es MM-999 (el Indio, 1949)."
}
```

```json
{
  "id": "MM-997",
  "familia": "los-recitales",
  "medida": "MM-997",
  "pregunta": "¿Cuántas personas fueron al último recital, según Infobae?",
  "valor": 50000,
  "escala": "entero",
  "unidad": ["persona", "personas"],
  "firmeza": "segun",
  "segun": "Infobae",
  "fuente": "RES-100",
  "explicacion": "Otras coberturas dan 40.000 o 45.000, y ninguna zanja el número.",
  "estado": "borrador"
}
```

| Campo | Tipo | Oblig. | Qué es |
|---|---|---|---|
| `id` | `^MM-\d{2,3}$` | sí | No se reutiliza (`Docs/IDS.md`). Un dato que sale se marca `retirado` y queda donde está |
| `familia` | enum | sí | `la-banda` · `la-gente` · `los-recitales`. **Las otras cuatro no tienen dónde escribirse** |
| `medida` | `MM-NN` o nombre | sí | **Propia** si es `MM-NN`, y entonces es igual al `id` (`i4`): el dato no va nunca en par. **Compartida** si es un nombre (`anio-nacimiento`, `publico-recital`): va en par con los otros datos que la usan. Las cinco medidas derivadas (`anio-disco`, `temas-disco`, `duracion`, `en-vivo`, `palabra`) están reservadas |
| `pregunta` | 10–140, `¿…?` | sí | La pregunta con respuesta de número. Registro 2 (`.claude/rules/voz-ricotera.md` §5) |
| `sujeto` | 2–60 | **si la medida es compartida; prohibido si es propia** | Lo que se nombra cuando el dato es la referencia de un par: `UX-34` §3.2 lo muestra chico, entre comillas, con el valor grande abajo |
| `valor` | entero | sí | La respuesta. Rango por escala (abajo) |
| `escala` | enum | sí | `anio` · `entero` · `segundos`. Le dice al motor cómo alejar la referencia (`CTR-20.5`) y a `formato.ts` cómo escribir el número |
| `unidad` | `[singular, plural]` | **sí en `entero`; prohibida en `anio` y `segundos`** | `["año", "años"]`. Minúscula; admite palabras separadas por espacio (`"personas por noche"`) |
| `firmeza` | enum | sí | `hecho` · `segun`. **No existe `leyenda`**: una leyenda no puede ser la respuesta de un número (`D-48` punto 6) |
| `segun` | 2–60 | **si y solo si `firmeza` es `segun`** | Quién lo dijo: `"Infobae"`, `"El Observador"` |
| `fuente` | `^RES-\d{2,3}$` | sí | La ficha. Tiene que existir en `Docs/INVESTIGACION/` (`i7`). **No puede ser `RES-20` ni `RES-90`**: lo que está ahí lo lee el código (`CTR-20.4`) |
| `explicacion` | 10–200 | no | Una línea que se lee al revelar. Registro 2 |
| `estado` | enum | sí | `listo` · `borrador` · `retirado`. Solo `listo` entra al pozo |
| `notaInterna` | ≤ 400 | no | Para el equipo. **No viaja** (`CTR-20.8`) |

**Rango del valor, por escala** (schema): `anio` de 1900 a 2026; `entero` desde 1; `segundos` de
30 a 1200. **Un año posterior a 2026 no entra**: es un plan, no un hecho (N-110 de `INV-100`, la
renovación de la marca en 2030, queda afuera por esto). Si algún día hace falta, se sube
`ANIO_TOPE` y el máximo del schema juntos, y eso es tocar este contrato.

**Una medida compartida pide la misma familia, la misma escala y la misma unidad** en todos los
datos no retirados que la usan, y sujetos distintos entre sí (`i5`). **Es la regla que hace que un
par no mezcle unidades** (`RES-94.1`), y sale de la frase de `D-48` punto 2: *"otro dato de la
misma familia"*.

**Un `segun` va con medida propia.** Así su número solo aparece como respuesta revelada, con la
`fuente` al lado, y en una pregunta que ya nombra a quien lo dijo (`i6`). *Costo declarado:* un
dato `segun` nunca va en par. En `INV-100` son ocho filas (N-020 y N-090 son el mismo número); la
que más se pierde es N-037 (el año de nacimiento de Walter Sidotti), que no se enfrenta con los
otros cinco integrantes.

**Qué quiere decir el `valor`, y las tres reglas que `contenido` aplica al cargar:**

- **(a) Exacto, o a menos de una unidad del real.** 52:38 puede ir como 52 o como 53 minutos, las
  dos sirven. La referencia es un entero distinto del valor, así que si el real está a menos de
  una unidad, ninguna referencia puede caer entre los dos, y el juego nunca contradice al que se
  sabe el número exacto. Truncar o redondear da lo mismo; lo que no puede pasar es alejarse una
  unidad o más.
- **(b) Aproximado en la fuente ("unos 15", "como cuarenta") ⇒ `segun`**, con la fuente en la
  pregunta. Lo que se juega es la cifra de esa fuente.
- **(c) Una cota ("más de 70.000", "como mínimo") no es una respuesta y no entra.** Con una
  referencia de 72.000, el juego diría "menos" y el real puede ser 75.000. Es N-014 de `INV-100`.

---

### CTR-20.3 — Las palabras

Cada palabra es **una lista de formas escritas** y nada más. **El número de temas no está en el
dato y no tiene dónde escribirse** (`additionalProperties: false`): lo cuenta `conteo.ts` en cada
build. Los ids `MP-998` y `MP-999` están reservados para los ejemplos.

```json
{ "id": "MP-999", "palabra": "corazón", "formas": ["corazón", "corazon"], "estado": "borrador" }
```

```json
{
  "id": "MP-998",
  "palabra": "está",
  "formas": ["está"],
  "noCuentan": [{ "forma": "esta", "porque": "Es el demostrativo: otra palabra, no la misma sin tilde." }],
  "estado": "borrador"
}
```

| Campo | Tipo | Oblig. | Qué es |
|---|---|---|---|
| `id` | `^MP-\d{2,3}$` | sí | No se reutiliza |
| `palabra` | forma | sí | Cómo se nombra en pantalla. **Tiene que ser una de las `formas`** (`i9`) |
| `formas` | 1–8 formas, sin repetir | sí | Lo que se cuenta, y lo que se muestra al revelar (`D-48` punto 4). **Ninguna forma puede estar en dos palabras no retiradas** (`i9`) |
| `noCuentan` | `[{ forma, porque }]`, 1–12 | no | Variantes de tilde que existen en el corpus y **no** son esta palabra, con el motivo. Una forma de `noCuentan` no puede estar en `formas` |
| `estado` | enum | sí | Como en `CTR-20.2` |
| `notaInterna` | ≤ 400 | no | No viaja |

**Una forma** es minúscula, solo letras del castellano (`a`–`z`, `ñ`, `á é í ó ú ü`), hasta 24
caracteres, en NFC. El patrón del schema ya rechaza una tilde descompuesta (la `e` más el acento
combinado): no está en la clase.

**La regla de conteo, normativa.** Es la que ya implementa `src/lib/mas-o-menos/conteo.ts`, y si
algún día difieren, manda este texto y se corrige el código.

1. **El corpus** son los temas de `src/data/cancionero.json` con `contenido: "letra"`. Hoy son 100:
   104 en el archivo y 105 en `RES-20`. Los que no tienen letra no suman cero: no están, y el
   rótulo lo dice (`RNF-CTR-20-C`).
2. **Las líneas** son las de `t: "letra"` con texto no vacío que `esAnotacion()` no marca
   (`anotacion.ts`), cada una pasada por `sinEtiquetaFinal()`. Es la letra que muestra el
   cancionero (`CTR-06`), no el filtro estricto de `versos.ts`.
3. **Las palabras de una línea** salen de pasar el texto a NFC, después a minúscula
   (`toLocaleLowerCase('es')`) y quedarse con las corridas `\p{L}+`. Todo lo que no es letra corta
   la palabra.
4. **Una forma cuenta** si coincide exacta con una palabra de la línea. No hay lematizador.
5. **El número** es cuántos temas del corpus tienen al menos una de las formas. **La lista** son
   esos temas, en el orden del cancionero. El número es el largo de la lista y nunca otra cosa.
6. **Las variantes de tilde.** Toda forma del corpus que sin tildes se escribe igual que una forma
   declarada, y que no está ni en `formas` ni en `noCuentan`, **hace fallar el test** (`i10`,
   `variantesSinDeclarar`). La clave sin tildes **conserva la ñ**: *año* y *ano* son dos palabras.
7. **Umbral:** una palabra `listo` aparece en **2 temas o más** (`i12`). Con 1 no se arma una
   pregunta.

**Vocabulario de taller, prohibido como forma** (`i11`). Es el piso mecánico; lo demás lo mira
`contenido` (homónimos, temas con letra rota):

- toda palabra que coincida entera con las listas `TECNICA` o `ESTRUCTURA` de `anotacion.ts`. Eso
  incluye *solo*, *bajo*, *base*, *final* e *igual*, que también son palabras de canción. Se
  pierden a propósito: en una cifra, *solo* es el solo de guitarra;
- la lista de taller que midió el hilo principal: `primera`, `tercera`, `cuarta`, `intermedio`,
  `fill`, `repite`, `toca`, `par`, `letra`, `tema`, `man`, `com`.

---

### CTR-20.4 — Las cuatro familias derivadas

**Ningún número derivado se copia a `mas-o-menos.json`** (`D-13`). Se calculan en cada build desde
la ficha o el dato que ya los tiene, y si la fuente se corrige, el juego se corrige solo (`D-48`,
consecuencia 2).

| Familia | Medida | `id` | `valor` | Escala / unidad | De dónde | Qué entra | `techo` | Hoy |
|---|---|---|---|---|---|---|---|---|
| `los-discos` | `anio-disco` | `anio-<disco>` | el año del encabezado | `anio` | `leerDiscos()` | los diez | — | 10 |
| `los-discos` | `temas-disco` | `temas-<disco>` | temas contados en el tracklist | `entero`, de la plantilla | `leerDiscos()` | nueve: **sin `gulp`** | — | 9 |
| `lo-que-dura` | `duracion` | `dura-<slugDeTitulo(titulo)>` | segundos | `segundos` | `leerDuraciones()` | solo `segundos !== null` | — | 94 |
| `en-vivo` | `en-vivo` | `vivo-<slug>` | `veces` | `entero`, de la plantilla | `setlistfm.json`, `conteo.temas` | líneas con `slug`, `veces ≥ 3`, slug sin línea `grafiaDe` | `conteo.setlistsCargados` | 96 |
| `las-palabras` | `palabra` | `palabra-<id en minúscula>` | largo de `temasDe()` | `entero`, de la plantilla | `conteo.ts` sobre el cancionero | palabras `listo` | temas del corpus | las de `CNT-25` |

`<disco>` es el slug de `DISCOS` (`discos.ts`). Los números de la columna "Hoy" están contados a
mano el 2026-09-25; **si el test da otra cosa, manda el test**.

**Cada dato derivado lleva `sujeto`:** el título del disco (`tituloDelDisco()`), el del tema de
`RES-20` (nunca el de setlist.fm) o la palabra. La `pregunta` y la `fuente` salen de las plantillas
de `src/lib/mas-o-menos/copy.ts`, que escribe `contenido`. **Este contrato fija qué llena cada
hueco, no el texto.**

**Las reglas de cada familia:**

- **`los-discos`.** *Gulp!* no entra a `temas-disco`: son 11 o 12 según cuente el track oculto, y
  es la trampa 2 de `RES-20`. **Ninguna familia pregunta cuántos discos son** (9 o 10, la trampa
  de `RES-02`). Como guarda del parser, cada `temas-disco` tiene que coincidir con el `· N temas`
  del encabezado de su disco en `RES-20` (`i13`). *Lobo suelto* y *Cordero atado* comparten 1993 y
  no van nunca en par entre sí: con distancia 0 no entran en ninguna franja (`CTR-20.6`).
- **`lo-que-dura`.** Los 11 temas del vol. 2 sin duración no entran: sin duración no están
  medidos, no duran cero. *Pianito - Jam* (0:53) sí entra (ver `CTR-20.13`).
- **`en-vivo`.** Lo que se cuenta es **en cuántos setlists cargados figura el tema**, nunca cuántas
  veces se tocó (`CTR-19.3`). Hoy son 99 líneas con `slug` y quedan 96:
  - sale ***Mariposa Pontiac - Rock del país***, porque tiene dos líneas `grafiaDe` (*Rock del
    país*, 37, y *Mariposa Pontiac / Rock del país*, 10). Su 43 es un piso, no la cuenta del tema
    (`CTR-19.2`). **La regla es general**: sale cualquier slug que tenga una línea `grafiaDe`;
  - salen ***¡Lobo ¿estás?!*** (1) y ***La pequeña novia del carioca*** (2), por
    `MINIMO_EN_VIVO = 3`, el piso del hilo principal. Con 1 o 2 setlists sobre 256, el número dice
    más de quién cargó que de la banda, y la cola en 1 es la parte de la página que `RES-89.4` no
    garantiza completa.

  El título se busca por slug entre los 105 (`D-13`). Si una línea con `slug` no resuelve, el
  build tira.
- **`las-palabras`.** El `valor` es el largo de `temasDe()`. El dato viaja con `formas` y `temas`
  (`slug` y `titulo` de cada uno), para que el revelado muestre qué se contó y dónde.

**Filas de `INV-100` que no se cargan a mano, y qué regla las deja afuera.** La nota del hilo
principal al pegar la ficha ya nombra la mitad; acá está completa y con el mecanismo, para que
`contenido` no la cargue y `revisor` no la tenga que razonar:

| Filas | Por qué | Lo ataja |
|---|---|---|
| N-003 | leyenda | `firmeza` no tiene `leyenda` |
| N-009 | es un día, no hay escala de fecha | el schema: sin escala que la acepte |
| N-014 | cota ("más de 70.000") | `CTR-20.2` (c), lo mira `revisor` |
| N-044 | depende de la fecha de *Gulp!*, sin resolver | nota del hilo principal, lo mira `revisor` |
| N-049 | es sobre la muerte del Indio | `i8` |
| N-050 a N-053 | las dos trampas de `RES-20` | nota del hilo principal, lo mira `revisor` |
| N-054 a N-062, N-072 a N-074 | ya se derivan de `RES-20` | `i17` (pregunta repetida) y `revisor` |
| N-063 a N-071 | son sumas de las duraciones de `RES-20`: derivables (`D-13`), y pasan de 1200 s | el schema (`segundos` ≤ 1200) y `revisor`. Si se quieren, es una medida derivada nueva (`CTR-20.13`) |
| N-084, N-093 a N-103 | salen de `setlistfm.json`: o son `en-vivo`, o son propiedades del archivo, o son líneas `fuera` | `fuente` no puede ser `RES-90`, y `revisor` |
| N-110 | año futuro | el schema (`anio` ≤ 2026) |

---

### CTR-20.5 — La referencia número

La pone el juego según la racha (`D-48`, alternativa 5). **Es lo único del juego que se inventa, y
por eso es lo que más garantías tiene.**

**Los cuatro escalones de la racha:** 0–2, 3–5, 6–9 y 10+ (`escalon()`, `DESDE_RACHA`).

| Escala | 0–2 | 3–5 | 6–9 | 10+ | Cómo se aplica |
|---|---|---|---|---|---|
| `anio` | 8 a 12 años | 4 a 6 | 2 a 3 | 1 | se suma o se resta un entero sorteado en el rango |
| `segundos` | 120 a 180 s | 60 a 90 | 30 a 45 | 10 a 20 | se suma o se resta, y se redondea a 5 s |
| `entero` | ×/÷ 2,5 a 3,5 | ×/÷ 1,7 a 2 | ×/÷ 1,3 a 1,5 | ×/÷ 1,1 a 1,2 | se multiplica o se divide, y se redondea con `pasoDeRedondeo(valor)`: de a 1 bajo 20, de a 5 bajo 200, de a 50 bajo 2000, y dos cifras significativas desde ahí |

**El dominio de la referencia**, que es lo que agrega este contrato:

| | Mínimo | Máximo |
|---|---|---|
| `entero` | **2** | **`techo − 1`**, si el dato trae `techo` |
| `anio` | — | **2025** (`< ANIO_TOPE`, que sigue en 2026) |
| `segundos` | **30** | — |

La regla que ordena la tabla: **la referencia nunca cae donde la respuesta se sabe sin saber.**
Eso pasa en el borde de lo que el jugador sabe que existe: ningún conteo es 0, nada pasa de hoy, un
tema no está en más temas de los que se contaron. Pasa también fuera de lo razonable: una canción
de diez segundos. En el borde, "no hay empates" alcanza para deducir la respuesta. Afuera, el
sentido común la da hecha. **Los pisos que el jugador no conoce** (en `palabra` son 2 temas, en
`en-vivo` 3 setlists) **no limitan la referencia**: desde afuera, un tema en un solo setlist es
posible.

**El algoritmo (normativo):**

1. `e = escalon(racha)`. Se sortea el lado: arriba si `azar() < 0,5`.
2. **Candidata del lado:** se sortea la magnitud dentro del rango del escalón, se aplica y se
   redondea según la escala.
3. **Del lado correcto, estricto.** Si el redondeo pisó o cruzó la respuesta, se corre de a un paso
   de redondeo (1 año; 5 s; `pasoDeRedondeo(valor)`) hacia su lado. En `segundos`, además, si
   quedó a menos de 10 s de la respuesta, se corre un paso más.
4. **Dominio.** Si la candidata queda fuera de la tabla de arriba, ese lado no sirve y se prueba el
   otro, con otro sorteo de magnitud.
5. Si ninguno de los dos lados sirve, `referenciaNumero()` tira `RangeError`. **Con el pozo real eso
   no pasa**, y el que lo demuestra es `i19`, no la partida.

**Por qué siempre hay un lado.** El de abajo falla solo con valores chicos (`entero` por debajo de
~6, `segundos` por debajo de ~200 en el primer escalón), y ahí el de arriba entra siempre: el techo
queda lejos. El de arriba falla solo cerca del techo (`anio` desde 2014, *amor* o *Jijiji* en el
primer escalón), y ahí el de abajo entra siempre. `anio` no tiene piso y `segundos` no tiene techo.
El test lo prueba igual, sobre todo el pozo.

**Garantías que el test hace cumplir** (`i19`, `i20`): la referencia es entera, distinta de la
respuesta, está del lado que dice `correcta` y queda dentro del dominio. En `segundos` es además
múltiplo de 5 y está a 10 s o más de la respuesta.

**El orden de los sorteos no es normativo.** Lo que sí es normativo es que con la misma semilla
sale la misma partida (`azarConSemilla`, mulberry32, en `partida.ts`). Ninguna semilla se guarda en
ningún lado, así que cambiar el orden solo cambia qué partida da cada semilla en los tests.

---

### CTR-20.6 — El par

Un paso puede ir **de par**: otro dato libre de la **misma medida**, con su número a la vista.
**Misma medida implica misma familia, misma escala y misma unidad** (`CTR-20.2`, y en las derivadas
la medida ya fija la familia).

**La distancia** se mide entre los dos valores: la diferencia en `anio` y `segundos`, el cociente
mayor/menor en `entero`. **Tiene que caer en la franja del escalón**, no solo pasar el piso:

| Escala | 0–2 | 3–5 | 6–9 | 10+ |
|---|---|---|---|---|
| `anio` | ≥ 8 | 4 a 7 | 2 a 3 | 1 |
| `segundos` | ≥ 120 | 60 a 119 | 30 a 59 | 10 a 29 |
| `entero` (cociente) | ≥ 2,5 | 1,7 a < 2,5 | 1,3 a < 1,7 | > 1 y < 1,3 |

En código: `dist ≥ PISO_DEL_PAR[e]` y, si `e > 0`, `dist < PISO_DEL_PAR[e − 1]`. `PISO_DEL_PAR` no
cambia. **Dos valores iguales no van nunca en par**: ningún escalón admite distancia 0 ni cociente 1.

**Cuándo va de par:** si hay al menos un candidato en la franja, con probabilidad
`CHANCE_DE_PAR = 0,5`. El compañero se sortea parejo entre los candidatos. Si no hay candidatos, el
paso va con número. **Los dos datos del par quedan usados.**

Qué se ve lo fija `UX-34` §3.2: el `sujeto` de la referencia, chico, y su valor formateado, grande.
**Por eso un `segun` no puede ser referencia de par** (`CTR-20.2`): ahí su número se vería sin su
rótulo.

---

### CTR-20.7 — La partida y el sorteo

- **El pozo** son todos los datos `listo`: los que se cargan a mano y los derivados, ya armados.
  **Con menos de dos familias con datos, el build tira** (`i17`): sin rotación no es el juego que
  pidió el usuario.
- **La familia sale de una bolsa**, como en `partida.ts`. En cada vuelta pasan todas las familias
  que tienen datos libres, una vez cada una y en orden al azar. Una familia que se queda sin datos
  a mitad de vuelta se saltea, y la primera de una vuelta nueva nunca es la última que salió,
  salvo que sea la única que queda. **Esto cumple y supera lo que pedía el modelo** ("nunca dos
  seguidas iguales", "la misma chance cada una"): en cada vuelta, cada familia sale exactamente una
  vez (`D-48` punto 5).
- **El dato** se sortea parejo dentro de la familia. Después se decide par o número (`CTR-20.6`).
- **Un dato usado no vuelve** en la partida, tampoco el que fue referencia de un par.
- **Un error corta.** El puntaje es la racha: los aciertos seguidos.
- **Si se acaban los datos libres, ganaste.** Es `estado.ganada`.
- **La mejor racha** se guarda en `localStorage`, clave **`arcade.mas-o-menos.mejor`**, con el mismo
  prefijo que `arcade.skayboy.avance`. Se guarda un entero en texto. Si al leerlo no parsea como
  entero ≥ 0, vale 0. **Si `localStorage` tira** (Safari en privado, cuota llena), el juego sigue
  sin mejor racha, igual que `avance.ts`: un molinete no se cierra porque el aparato no guarda.
- **El azar es inyectable** (`Azar = () => number` en `[0, 1)`). El navegador usa `Math.random` y los
  tests usan `azarConSemilla`.

---

### CTR-20.8 — Qué viaja al navegador

La isla recibe **un objeto**, armado en build por `armarPozo()` y la página:

```ts
interface PozoDeLaIsla {
  /** Los datos `listo`, a mano y derivados, ya armados. */
  readonly datos: readonly Dato[];
  /** RNF-CTR-19-A: el enlace y la fecha, una vez para toda la familia. `null` sin conteo. */
  readonly enVivo: { readonly pagina: string; readonly consultado: string; readonly setlistsCargados: number } | null;
  /** RNF-CTR-20-C: "en N de los `contados` temas con letra, de `total`". `null` sin palabras. */
  readonly palabras: { readonly contados: number; readonly total: number } | null;
}

interface Dato {
  readonly id: string;
  readonly familia: Familia;
  readonly medida: string;
  readonly pregunta: string;
  /** Presente si el dato puede ser referencia de un par: los derivados siempre, los a mano con medida compartida. */
  readonly sujeto?: string;
  readonly valor: number;
  readonly escala: Escala;
  readonly unidad?: readonly [string, string];
  /** La referencia número queda por debajo. Solo `palabra` y `en-vivo`. */
  readonly techo?: number;
  /** Registro 3, ya armado: ficha, o "según X" y ficha, o lo que mide el conteo. */
  readonly fuente: string;
  readonly explicacion?: string;
  /** Solo `palabra`. */
  readonly formas?: readonly string[];
  readonly temas?: readonly { readonly slug: string; readonly titulo: string }[];
}
```

**No viaja:** `notaInterna`, `estado`, `firmeza`, `segun` (ya está dentro de `fuente` y de la
pregunta), `noCuentan`, el `RES-` suelto (va dentro de `fuente`), ningún dato que no esté `listo`,
el cancionero ni las líneas de `setlistfm.json`.

**Presupuesto: `JSON.stringify(PozoDeLaIsla)` ≤ 160 KB sin comprimir** (`i18`). La cuenta de hoy da
~105 KB: 94 duraciones de ~230 B, 96 `en-vivo` de ~320 B, 19 discos, ~60 datos a mano de ~350 B y
25 palabras de ~1,1 KB con su lista. Comprimido, lo repetido (claves, la `fuente` de cada familia)
baja a ~20 KB. **Si algún día se pasa**, lo primero es mandar la `fuente` una vez por familia en vez
de una vez por dato. Eso es tocar este apartado, no el schema.

**La isla importa solo `partida.ts`, `referencia.ts` y `formato.ts`.** Nunca `datos.ts`,
`conteo.ts` ni `temas.ts`: el primero no hace falta en el navegador y el último arrastra
`node:fs`. Es la regla que `islas.test.ts` ya vigila.

---

### CTR-20.9 — Los rótulos

`contenido` escribe el texto y `experiencia` decide dónde va. Este apartado fija **qué tiene que
estar**, en registro 3 (`.claude/rules/voz-ricotera.md` §5).

> **RNF-CTR-20-A — todo número con su fuente.** Al revelar, el número real va en la misma pantalla
> que la `fuente` del dato. **En un par, van las dos fuentes** si son distintas: el jugador vio un
> número de la referencia y tiene derecho a saber de dónde salió. Un dato `segun` ya nombra a quien
> lo dijo en su pregunta (`i6`) y en su `fuente`, y nunca es referencia de un par. Así, **ningún
> camino muestra un "según" como si fuera un hecho**.

> **RNF-CTR-20-B — `en-vivo`.** Rige `RNF-CTR-19-A` entero: **qué mide** (figura en N de los
> `setlistsCargados` setlists que carga la gente en setlist.fm), **de dónde sale** (con enlace a
> `enVivo.pagina`) y **la fecha** (`enVivo.consultado`), en el mismo bloque. Nunca dice "se tocó N
> veces".
>
> **Choque abierto, para `producto`:** `RNF-CTR-19-A` también dice que el número "va chico, nunca
> como titular" (`BR-18` apartados b y h). En este juego **el número es la respuesta**, y el
> revelado de las otras seis familias lo muestra grande. El motivo de `BR-18` (b), que la cifra
> solo sube y envejece, sigue en pie. Lo mitigan la fecha en el bloque y el test de vigencia de
> `CTR-19.13` (t4), pero no lo resuelven. **Hasta que `producto` decida, `experiencia` diseña el
> revelado de `en-vivo` sin el número como titular**: el veredicto grande y el número en la línea
> de su rótulo. No cambia ningún dato ni ninguna función.

> **RNF-CTR-20-C — `las-palabras`.** Al revelar se ven **las formas contadas** (`D-48` punto 4) y
> "en N de los `contados` temas con letra", con el `total` al lado (hoy 100 de 105: entre los que
> faltan están los instrumentales y *San Telmo*, que tiene solo tablatura). **El que perdió** ve además la lista de temas,
> cada uno enlazado a `/letras-y-acordes/<slug>/`. Lo que no puede pasar es que el número cuente
> una forma que la pantalla no nombra.

---

### CTR-20.10 — El desafío

`ADR-02`, forma **`marcador`**, **sin cambios en `desafio.ts`**:

```ts
armarLink(base, { forma: 'marcador', juego: 'mas-o-menos', puntaje: racha, total: pozo.datos.length });
leerDesafio(query, 'mas-o-menos');
```

- `g=mas-o-menos` tiene 11 caracteres y cumple `^[a-z-]{1,20}$`.
- `p` es la racha, entero ≥ 0. `t` es la cantidad de datos del pozo. `p ≤ t` siempre se cumple,
  porque cada acierto gasta al menos un dato. `t ≤ 9999`: hoy son 209 derivados, más las
  palabras y los datos a mano.
- **`t` no es un máximo alcanzable**: un par gasta dos datos, así que la partida perfecta termina
  antes de llegar a `t`. La pantalla que lee el desafío lo presenta como racha, no como "p de t"
  (pedido a `experiencia` y `contenido`, `CTR-20.13`).
- *Alternativa descartada:* **`recorrido` con `d=victoria|derrota`.** Describe mejor un juego que
  corta en el primer error, pero `ADR-02` define la victoria de `recorrido` como `p = t`, y acá la
  victoria no la cumple. `D-48` punto 11 eligió `marcador`, y este contrato lo confirma.

---

### CTR-20.11 — Invariantes para los tests

Numeradas para que `revisor` las cite como "`CTR-20.11` i7". Entre paréntesis, dónde viven.

**El archivo** (`esquemas.test.ts` y `src/lib/mas-o-menos/banco.test.ts`):

- **i1** `mas-o-menos.json` valida contra su schema, y los cuatro ejemplos de `CTR-20.2` y `CTR-20.3`
  también, copiados sin tocar una coma.
- **i2 — los rojos del schema.** Cada caso sale de un ejemplo válido tocado en un solo campo, y se
  rechaza en ese lugar, con su control en verde al lado:
  r1 `familia: "los-discos"` · r2 `medida: "duracion"` · r3 `segun` sin `segun` · r4 `hecho` con
  `segun` · r5 `segun` con medida compartida · r6 medida compartida sin `sujeto` · r7 medida propia
  con `sujeto` · r8 `anio` con `unidad` · r9 `entero` sin `unidad` · r10 `fuente: "RES-20"` ·
  r11 `anio` con valor 2027 · r12 una palabra con `"temas": 7` · r13 la forma `"Perro"` · r14 un
  dato con `comoReferencia`.
- **i3** Los ids `MM` son únicos entre datos y los `MP` entre palabras. `MM-997`..`MM-999`,
  `MP-998` y `MP-999` no están en el archivo.
- **i4** Una medida `MM-NN` es igual al `id` de su dato.
- **i5** Los datos no retirados de una medida compartida tienen la misma familia, la misma escala y
  la misma `unidad`, y sujetos distintos entre sí.
- **i6** Todo dato `segun` no retirado tiene el texto de `segun` dentro de su `pregunta`, comparado
  en minúscula.
- **i7** La `fuente` de todo dato `listo` o `borrador` existe: en algún `Docs/INVESTIGACION/*.md` hay
  una línea `^#{2,4} <fuente>\b`.
- **i8** Nada sobre muertes: la `pregunta`, el `sujeto` y la `explicacion` de un dato no retirado no
  coinciden con `/(muri|muert|morir|falleci|asesin|bulacio|olavarr)/i`. Es un piso: el resto lo lee
  `revisor` (`CNT-04`, `CNT-06`).

**Las palabras** (`banco.test.ts`, contra el cancionero real):

- **i9** `palabra` está en `formas`. Ninguna forma de `noCuentan` está en las `formas` de su palabra.
  Ninguna forma se repite entre dos palabras no retiradas.
- **i10** `variantesSinDeclarar()` da `[]` para toda palabra no retirada.
- **i11** Ninguna forma es vocabulario de taller (`CTR-20.3`). Los casos en rojo nombran a mano
  `riff`, `solo`, `intro`, `primera` y `fill`, sin recorrer la constante: si la guarda se achica,
  el rojo no se achica con ella.
- **i12** Toda palabra `listo` aparece en 2 temas o más.

**Las derivadas y el pozo** (`src/lib/mas-o-menos/pozo.test.ts`, con las fuentes reales):

- **i13** Hay 10 `anio-disco`, uno por cada disco de `DISCOS`, y 9 `temas-disco`, ninguno
  `temas-gulp`. Cada `temas-disco` coincide con el `· N temas` del encabezado de `RES-20`.
- **i14** Hay un `duracion` por cada tema de `leerDuraciones()` con `segundos !== null`, y ninguno
  más.
- **i15** Los `en-vivo` son exactamente las líneas con `slug`, `veces ≥ MINIMO_EN_VIVO` y sin línea
  `grafiaDe` hacia su slug. `FUERA_DE_EN_VIVO`, si se queda, es exactamente el conjunto de destinos
  de `grafiaDe`.
- **i16** En cada `palabra`, `valor` es el largo de `temasDe()`, `temas` es esa misma lista y
  `techo` es la cantidad de temas del corpus.
- **i17** En el pozo, los ids son únicos y **las preguntas también**: una pregunta a mano que
  repite una derivada es un número copiado (`D-13`). Hay 2 familias o más con datos. Todo dato cuya
  medida comparte otro dato del pozo trae `sujeto`. `techo` aparece solo en `palabra` y `en-vivo`,
  y en esos datos `valor ≤ techo`.
- **i18** Lo que viaja no trae las claves `notaInterna`, `estado`, `firmeza`, `segun` ni
  `noCuentan`, y ocupa 160 KB o menos.

**La referencia y el par** (`referencia.test.ts`):

- **i19** Para **todo dato del pozo real**, en los cuatro escalones, con los dos lados y los dos
  extremos del rango de magnitud, la referencia cumple las garantías de `CTR-20.5`.
- **i20** Casos a mano: el `entero` 1 da siempre ≥ 2; el `entero` 2 nunca da 1; el `anio` 2025
  nunca da 2026; el `segundos` 213 en el escalón 10+ queda a 10 s o más; `palabra` 34 con techo
  100 da siempre < 100; `en-vivo` 101 con techo 256 da siempre < 256.
- **i21** `lejosParaPar` respeta la franja: `anio` a 10 años en racha 12 da `false`, a 1 año en
  racha 12 da `true`; `entero` 101 contra 5 en racha 12 da `false`. Los asserts que ya existen
  siguen en verde.

**La partida** (`partida.test.ts`):

- **i22** Los nueve tests que ya existen son invariantes de este contrato: sin empate y con
  `correcta` verdadera, rotación, peso igual, dato usado que no vuelve, par solo de la misma medida,
  victoria al agotar, un error corta, determinismo e ids repetidos.

**El desafío y lo heredado:**

- **i23** Un `marcador` con `g=mas-o-menos`, `p` la racha de una partida perfecta y `t` el pozo se
  arma con `armarLink` y `leerDesafio(…, 'mas-o-menos')` lo devuelve igual.
- **i24** La vigencia del conteo es la de `CTR-19.13` t4. No hay test nuevo: si vence, se pone en
  rojo el que ya existe.

---

### CTR-20.12 — Schema, para pegar

Draft 2020-12, como los demás. **Es texto normativo:** se copia idéntico a
`src/data/_schema/mas-o-menos.schema.json`, y si alguna vez difieren, manda este bloque. Lo que
compara dos campos o dos datos (i3 a i17) no lo puede hacer un schema, y lo hacen los tests.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/mas-o-menos/1",
  "title": "CTR-20 — El banco de Más o menos (US-10)",
  "description": "Solo lo que no existe en otro lado (D-13, D-48 punto 4): los numeros de la banda con su ficha, y las palabras que se cuentan. Los discos, las duraciones, los setlists y en cuantos temas aparece cada palabra se derivan en build y aca no tienen donde escribirse (CTR-20.4).",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "contratoVersion", "actualizado", "datos", "palabras"],
  "properties": {
    "contrato": { "const": "CTR-20" },
    "contratoVersion": { "const": 1 },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "datos": { "type": "array", "items": { "$ref": "#/$defs/dato" } },
    "palabras": { "type": "array", "items": { "$ref": "#/$defs/palabra" } }
  },
  "$defs": {
    "estado": { "enum": ["listo", "borrador", "retirado"] },
    "notaInterna": {
      "type": "string",
      "minLength": 1,
      "maxLength": 400,
      "comment": "Para el equipo. No viaja al navegador (CTR-20.8)."
    },
    "forma": {
      "type": "string",
      "minLength": 1,
      "maxLength": 24,
      "pattern": "^[a-zñáéíóúü]+$",
      "comment": "Una forma escrita: minuscula, solo letras del castellano, en NFC (una tilde descompuesta no pasa el patron)."
    },
    "dato": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "familia", "medida", "pregunta", "valor", "escala", "firmeza", "fuente", "estado"],
      "properties": {
        "id": { "type": "string", "pattern": "^MM-\\d{2,3}$" },
        "familia": {
          "enum": ["la-banda", "la-gente", "los-recitales"],
          "comment": "Las otras cuatro (los-discos, lo-que-dura, en-vivo, las-palabras) se derivan en build y no se escriben a mano (CTR-20.4)."
        },
        "medida": {
          "type": "string",
          "maxLength": 40,
          "pattern": "^(MM-\\d{2,3}|[a-z][a-z0-9]*(-[a-z0-9]+)*)$",
          "not": { "enum": ["anio-disco", "temas-disco", "duracion", "en-vivo", "palabra"] },
          "comment": "MM-NN: medida propia, igual al id, nunca va en par. Un nombre: medida compartida, va en par con los otros datos que la usan. Las cinco de las familias derivadas estan reservadas."
        },
        "pregunta": { "type": "string", "minLength": 10, "maxLength": 140, "pattern": "^¿.+\\?$" },
        "sujeto": { "type": "string", "minLength": 2, "maxLength": 60 },
        "valor": { "type": "integer" },
        "escala": { "enum": ["anio", "entero", "segundos"] },
        "unidad": {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": { "type": "string", "minLength": 1, "maxLength": 24, "pattern": "^[a-zñáéíóúü]+( [a-zñáéíóúü]+)*$" },
          "comment": "[singular, plural], por ejemplo [\"año\", \"años\"]."
        },
        "firmeza": {
          "enum": ["hecho", "segun"],
          "comment": "No existe leyenda: una leyenda no puede ser la respuesta de un numero (CLAUDE.md, D-48 punto 6)."
        },
        "segun": { "type": "string", "minLength": 2, "maxLength": 60 },
        "fuente": {
          "type": "string",
          "pattern": "^RES-\\d{2,3}$",
          "not": { "enum": ["RES-20", "RES-90"] },
          "comment": "La ficha del numero. RES-20 y RES-90 las lee el codigo: un numero que esta ahi se deriva, no se copia (D-13)."
        },
        "explicacion": { "type": "string", "minLength": 10, "maxLength": 200 },
        "estado": { "$ref": "#/$defs/estado" },
        "notaInterna": { "$ref": "#/$defs/notaInterna" }
      },
      "allOf": [
        {
          "comment": "Medida propia: sin sujeto. Medida compartida: con sujeto (CTR-20.2).",
          "if": { "properties": { "medida": { "pattern": "^MM-" } } },
          "then": { "not": { "required": ["sujeto"] } },
          "else": { "required": ["sujeto"] }
        },
        {
          "comment": "Un segun lleva el nombre de quien lo dijo y va con medida propia: nunca es la referencia de un par, donde el numero se ve sin su rotulo (CTR-20.2, UX-34 3.2).",
          "if": { "properties": { "firmeza": { "const": "segun" } } },
          "then": { "required": ["segun"], "properties": { "medida": { "pattern": "^MM-" } } },
          "else": { "not": { "required": ["segun"] } }
        },
        {
          "comment": "Un anio no pasa de 2026: un anio futuro es un plan, no un hecho. Sin unidad.",
          "if": { "properties": { "escala": { "const": "anio" } } },
          "then": { "properties": { "valor": { "minimum": 1900, "maximum": 2026 } }, "not": { "required": ["unidad"] } }
        },
        {
          "comment": "Una cantidad arranca en 1 y dice de que es.",
          "if": { "properties": { "escala": { "const": "entero" } } },
          "then": { "properties": { "valor": { "minimum": 1 } }, "required": ["unidad"] }
        },
        {
          "comment": "La escalera de segundos es absoluta y esta hecha para canciones: de 0:30 a 20:00. Lo mas largo va en entero, en minutos.",
          "if": { "properties": { "escala": { "const": "segundos" } } },
          "then": { "properties": { "valor": { "minimum": 30, "maximum": 1200 } }, "not": { "required": ["unidad"] } }
        }
      ]
    },
    "palabra": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "palabra", "formas", "estado"],
      "comment": "Sin valor y sin temas: el numero lo cuenta conteo.ts en cada build (CTR-20.3). Que palabra este en formas, que ninguna forma se repita entre palabras y que no queden variantes sin declarar lo prueba el test (CTR-20.11, i9 a i12).",
      "properties": {
        "id": { "type": "string", "pattern": "^MP-\\d{2,3}$" },
        "palabra": { "$ref": "#/$defs/forma" },
        "formas": {
          "type": "array",
          "minItems": 1,
          "maxItems": 8,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/forma" }
        },
        "noCuentan": {
          "type": "array",
          "minItems": 1,
          "maxItems": 12,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["forma", "porque"],
            "properties": {
              "forma": { "$ref": "#/$defs/forma" },
              "porque": { "type": "string", "minLength": 8, "maxLength": 200 }
            }
          }
        },
        "estado": { "$ref": "#/$defs/estado" },
        "notaInterna": { "$ref": "#/$defs/notaInterna" }
      }
    }
  }
}
```

**Comando para verificarlo** (lo corren `revisor` o el hilo principal, `D-12`):

```
node --test src/lib/esquemas.test.ts src/lib/mas-o-menos/
```

---

### CTR-20.13 — Lo abierto, con dueño

| Qué | De quién | Bloquea |
|---|---|---|
| Si el número de `en-vivo` puede ser el número grande del revelado (`RNF-CTR-20-B` contra `BR-18` b y h). Mientras tanto, sin titular | `producto` (`BR-32`/`BR-33`), con `experiencia` | no |
| El piso de datos `listo` para dar el juego por hecho y los tramos del resultado | `producto` (`BR-32`/`BR-33`) | no |
| `MINIMO_EN_VIVO` (3): lo puede mover `producto` tocando una constante y la "Hoy" de `CTR-20.4` | `producto` | no |
| Las plantillas de `copy.ts` (pregunta y fuente de cada familia derivada; la de `en-vivo` recibe `setlistsCargados` y `consultado`) y los textos de los datos a mano, con las reglas (a), (b) y (c) de `CTR-20.2` | `contenido` (`CNT-25`) | no |
| Que la pantalla del desafío muestre la racha y no "p de t" (`CTR-20.10`) | `experiencia` (`UX-34`), `contenido` | no |
| Que `voz.test.ts` audite también las cadenas visibles de `mas-o-menos.json` (`pregunta`, `sujeto`, `explicacion`, `unidad`), no solo los `copy.ts` | hilo principal | no |
| ¿La duración de un track oculto, *Pianito - Jam* (0:53), es la misma en todas las ediciones de *Gulp!*? Es el mismo track de la trampa 2 de `RES-20`. Si depende de la edición, sale de `lo-que-dura` con una línea en `datos.ts` y en `i14` | `investigador`, ficha nueva | no |
| La duración de cada disco (N-063 a N-071) como medida derivada `duracion-disco`, sin *Gulp!* ni el vol. 2. Pide una escalera propia, porque la de `segundos` es absoluta. **Fuera de la v1 de este contrato**; si se pide, es `contratoVersion` 2 | `contenido` lo pide, `arquitectura` lo contrata | no |

---

## Alternativas descartadas

1. **Un intervalo de discrepancia en el dato** (`rango: [40000, 50000]`), con la referencia
   obligada a caer afuera. Resolvía de raíz el caso de N-020, pero costaba un campo y una rama del
   motor para un puñado de filas de `INV-100`. El mismo resultado sale de nombrar la fuente en la
   pregunta (`i6`): "según Infobae" deja una sola respuesta.
2. **`segun` en una medida compartida, con el "según" metido en el `sujeto`.** `UX-34` muestra el
   sujeto entre comillas: *«Último recital, según Infobae»* se lee como un título, no como un
   rótulo. El rótulo quedaría disfrazado, que es lo que `CLAUDE.md` no deja.
3. **La distancia del par como piso solo**, que es el modelo. Explicado en `CTR-20.0` fila 11: a
   racha alta, medio juego vuelve a ser de sentido común.
4. **El dominio de la referencia solo por escala, sin techo por dato.** No alcanza. El techo de
   `palabra` y el de `en-vivo` salen de los datos (temas contados, setlists cargados), no de la
   escala, y cambian con cada build.
5. **Piso de `en-vivo` en 5.** Mi primera lectura: por debajo de 5, el lado de abajo casi nunca
   entra y la pregunta queda en "¿es poquito?". Se descarta: dejaba afuera 17 temas más, entre
   ellos los quince que figuran 3 veces (*Espejismo*, *Sheriff*, las murgas de *Momo*), que son
   preguntas difíciles y legítimas. El lado forzado no revela nada, porque el jugador no sabe que
   se forzó.
6. **Decidir si una medida es compartida contando los `listo`**, que es lo que hace el código hoy.
   Un compañero en `borrador` rompía el build. La forma de la medida lo dice antes de cargar nada.
7. **Guardar los números derivados en el JSON "para poder mirarlos".** Es la segunda verdad que
   `D-13` prohíbe. Para mirarlos va a estar `scripts/medir-mas-o-menos.mjs`, que el hilo principal
   deja junto con el juego (`HILO-para-contenido-mas-o-menos-las-palabras.md`) y que imprime lo
   mismo que calcula el build.
8. **Validar las reglas entre campos con `$data` de ajv.** Ningún otro schema del repo lo usa, y
   un test con mensaje propio dice qué dato rompió y por qué. Un error de `$data` no dice ninguna
   de las dos cosas.
9. **Pasar las palabras a una tabla de temas compartida con índices**, en vez de una lista por
   dato. Ahorra ~10 KB de 105. No vale la indirección.

---

## Consecuencias

- **El hilo principal tiene estos cambios de código, todos chicos.** En `referencia.ts`: los tres
  bordes del dominio, la distancia mínima de `segundos`, el parámetro `techo` y la franja de
  `lejosParaPar`. En `partida.ts`: `sujeto` y `techo` en `Dato`, y el `techo` pasado a
  `referenciaNumero`. En `datos.ts`: `comoReferencia` afuera, `sujeto` en las derivadas, `techo`,
  la regla de compartida por forma, `grafiaDe`, el mínimo de dos temas y `PozoDeLaIsla`. Más el
  schema, `'mas-o-menos'` en `esquemas.test.ts` y los tests i1 a i24.
- **Fácil:** sumar un dato a mano, una palabra o una medida compartida es escribir JSON. Mover
  `MINIMO_EN_VIVO`, `CHANCE_DE_PAR` o un número de la tabla de distancias es tocar una constante,
  y el test exhaustivo (`i19`) dice si el cambio rompe alguna garantía.
- **Caro, y a propósito:** una escala nueva (decimales, fechas con día), una familia derivada
  nueva o un año posterior a 2026. Las tres tocan este contrato, porque cada una cambia qué quiere
  decir una respuesta correcta.
- **Lo que hereda el juego sin agregar nada:** los huecos de sus fuentes, que se dicen en el rótulo
  (100 de 105 temas con letra, 256 setlists cargados); la vigencia del conteo de `CTR-19`; y la
  puerta de `D-13` (`resolverTema`), que ya filtró cada título que entra.
- **`CTR-19` no cambia.** El choque de `RNF-CTR-19-A` con el revelado de este juego queda
  declarado acá y pedido a `producto`. Si `producto` cambia la regla, el que se enmienda es
  `CTR-19.9`.
