# ARQ — Schema de "completar la letra" (`US-03`)

> Rol dueño: `arquitectura`. Consume: `US-03`, `BR-01`, `BR-03`, `BR-04`, `BR-12`, `D-13`,
> `D-14`, `D-12`, **`D-25`**, `RES-03`, `RES-11`, `RES-14`, `RES-20`, `RES-23`, **`RES-49`**,
> `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md` (las cinco mitigaciones del final),
> `CTR-01.4`, `CTR-02`, `CTR-03`, `.claude/rules/contenido-json.md`.
> Produce: **`CTR-04`**. Tareas: `T-62` del ciclo 4 (v1) · **`T-131` del ciclo 9 (v2)** ·
> **`T-287` del ciclo 16 (v3)**.
> Fecha: 2026-08-21 · **revisado el 2026-08-27** · **enmendado el 2026-09-24**.
>
> La enmienda del 2026-09-24 consume además: `D-27`, `D-46` (con su precisión del
> 2026-09-24), `BR-30` (enmendada por `T-286`), `US-03` criterio 2, `CTR-09` v2 (el juego
> hermano, que ya hizo este mismo cambio), `CTR-19.3`, `CTR-19.6`, `CTR-19.15`, `RES-90`, y
> leídos en disco el 2026-09-24: `scripts/generar-letra.mjs`, `src/lib/letra/banco.ts`,
> `src/lib/letra/banco.test.ts`, `src/lib/en-vivo.ts`, `src/lib/quiz/ronda.ts`,
> `src/data/letra.json`, `src/data/letra-confirmaciones.json`, `src/data/setlistfm.json` y
> `src/data/_schema/letra.schema.json`.
>
> **Cerrada el mismo 2026-09-24, en una segunda pasada**, con tres cosas que llegaron después
> de la primera: la respuesta de `producto` sobre `US-03` criterio 2
> (`Docs/SUGERENCIAS/PRD-para-arquitectura-us-03-criterio-2-resuelto.md`, y el criterio
> enmendado en `PRD-alcance-v1.md`); lo que `T-288` dejó en disco (el schema, el generador,
> `letra.json`, `letra-confirmaciones.json`, `src/lib/letra/versos.ts` y `banco.test.ts`,
> leídos, no corridos); y su traspaso
> `Docs/SUGERENCIAS/HILO-para-contenido-dos-anclas-sin-vecinos.md`.

---

## Enmienda del 2026-09-24 (`T-287`) — `CTR-04` pasa a `contratoVersion: 3`

**Qué la pide:** la precisión de `D-46`, decidida por el usuario: *"Completá la letra también
sale del conteo"*. `BR-30` (enmendada por `T-286`) fijó cómo: el nivel de un ítem pasa a ser
el nivel de su **tema**, en tercios del conteo citado, igual que `US-07`. Y la tabla de
`BR-03` no cambia: el contexto sigue al nivel.

**Lo que cambia, y nada más:**

1. **`dificultad` la da `repartirEnTercios()`** (`CTR-19.15`) sobre los temas del banco. Hoy la
   da la posición del verso en su estrofa. El detalle está en `CTR-04.14`, que es nuevo.
2. **El contexto son los vecinos del verso en el tema, no en la estrofa** (`CTR-04.7`,
   enmendado). Un verso que no tiene los vecinos que pide su nivel no da ítem.
3. **El envoltorio suma `conteo`, y el ítem suma `dificultadSegun`** (`CTR-04.1` y `CTR-04.2`,
   enmendados). Es la misma forma que ya tiene `CTR-09` v2.
4. **`verificarInvariantes` mide el contexto exacto, no el tope** (`CTR-04.14`). Hoy acepta un
   Fácil con un verso de cada lado, y el schema no.
5. **La cota de 8 versos por tema se mide sobre los `listo`**, y pierde una de sus dos salidas
   (`CTR-04.4` y `CTR-04.12`, enmendados).

**Lo que no cambia:** la tabla de `BR-03`, las tres ramas del schema que atan el contexto al
nivel, el hueco, las tres vías de `cotejo`, `fuenteLetra`, lo que viaja al cliente y la regla
del motor que muestra título y disco según el nivel.

**La contradicción con `US-03` criterio 2 quedó resuelta por `producto` el mismo día.** Con
el nivel por tema, un tema Difícil tiene **solo** ítems Difíciles, y el criterio decía
*"nunca se introduce un tema completamente nuevo solo en modo difícil"*. `producto` adoptó la
opción A: la precisión de `D-46` manda, y el criterio 2 se enmendó (marcado, con la redacción
vieja al pie). Lo que queda de él es que el eje de dificultad sea cuánta letra se muestra
(`BR-03`), que el tema sea siempre uno de los 105 de `RES-20`, y que la dificultad no baje
(`BR-01` punto 2). **Con eso se retiran la consulta 3 y el comando (6) de `CTR-04.12`**, que
esta enmienda había dejado en suspenso. El detalle está en `CTR-04.14`, "El criterio 2,
resuelto". *Decía: "🔴 Y una contradicción que esta enmienda no puede resolver… La decide
`producto` con el usuario. Mientras tanto la consulta 3 de `CTR-04.12` queda en suspenso."*

**Y ya está en disco.** `T-288` aplicó el bloque `_parche` tal cual y regeneró el banco:
19 ítems `listo`, **11 Fáciles, 4 Medios y 4 Difíciles** (leído en `letra.json` el
2026-09-24). Desde ahí manda el archivo del schema (`CTR-04.10`). Que `npm test` lo dé verde
lo dice la verificación de `T-288` y de `T-295`, no esta lectura.

---

## Revisión del 2026-08-27 — `CTR-04` pasa a `contratoVersion: 2`

**Qué la pide:** `D-25`. El usuario decidió que `US-03` sale con letras de **fuente única**,
sin confirmación de oído, y `D-25` le encarga a `arquitectura` una consecuencia puntual: *"la
condición de estado pasa de dos vías a tres, y la tercera tiene que dejar rastro de cuál es:
un ítem `listo` por fuente única no se puede confundir con uno confirmado de oído"*.

**Las tres cosas que cambian, y nada más:**

1. **`CTR-04.6` pasa de dos vías a tres**, y las tres se declaran en un campo nuevo,
   `cotejo.regimen`. Las dos viejas quedan escritas y vigentes: cuando aparezca una segunda
   fuente o alguien escuche, el ítem **sube de régimen** y `D-25` se revierte sola.
2. **`fuenteLetra` deja de ser una lista de `RES-NN` y pasa a ser una lista de objetos** con
   `ficha`, `sitio`, `url` y `consultado`. Lo pide `T-145`: el panel de respuesta muestra qué
   sitio transcribió el verso, con su enlace, y hoy el ítem no tiene con qué.
3. **`CTR-04.1`** corrige un presupuesto que dejó de aplicar hace tres ciclos, y
   **`CTR-04.13`** deja especificado, línea por línea, el cambio del schema corrible para que
   lo aplique el hilo principal en `T-144` (`D-12`: yo no corro ni edito código).

**Lo que NO cambia, y conviene leerlo antes de festejar:** todo lo demás. El ítem sigue
necesitando fuente declarada, el tema sigue teniendo que estar entre los 105 de `RES-20`, el
hueco sigue sin poder comerse el verso, el contexto sigue atado a `BR-03` y el tope de versos
sigue en 5 por ítem y 8 por tema. **La vía nueva relaja *cuántas* fuentes, no *si hay***
(`D-25`, "lo que no cambia", punto 1). La lista completa de lo que el schema sigue rechazando
está en `CTR-04.6`, sección "Qué sigue rechazando el schema".

**Y una cosa que este contrato tiene que decir aunque no le guste**, porque es la que va a
importar dentro de dos meses: `CTR-04.6` v1 era, en palabras de este mismo archivo, *"la que
protege lo único estricto del proyecto"*. `D-25` la afloja a sabiendas y lo escribe sin
adornos. Esta revisión **no reconstruye esa protección por otro lado ni finge hacerlo**: lo
que hace es dejar la pérdida **visible, medible y reversible por ítem**. Eso es todo lo que
un schema puede aportar acá; el resto son las tres mitigaciones de `D-25`, y dos de ellas
—`T-138` y el botón de corrección— no son mías.

---

## CTR-04 — Contrato de `src/data/letra.json`

- **Estado:** **v3, especificada el 2026-09-24 (`T-287`) y aplicada en disco por `T-288`**
  (`$id …/letra/3` en el schema, `contratoVersion: 3` y `conteo` de `RES-90` en `letra.json`,
  leídos el 2026-09-24). Manda el archivo del schema; para lo que el schema no ve —de dónde
  sale el nivel y qué versos son el contexto— manda `CTR-04.14`. *Decía, en la primera pasada
  del mismo día: "pendiente de aplicar (`T-288`)". Y antes: "vigente en **v2**
  (`contratoVersion: 2`)", y seguía:* con **un** valor de trabajo marcado:
  si se responde eligiendo o tipeando (`CTR-04.8`). Es la misma vacante que tuvo `CTR-03` y
  por el mismo motivo — `BR-04` fija 4 opciones para `US-01`, `US-02` y `US-04`, y **no
  nombra a `US-03`**.
- **Para quién es:** para `contenido`, que en el ciclo 5 carga los 15 ítems de `US-03` y
  necesita saber qué forma tiene un ítem antes de sentarse a escuchar discos; y para quien
  escriba el motor del juego 3.
- **Lo que este contrato hace y ningún documento hacía todavía:** convertir las mitigaciones
  de `D-13` en algo que una máquina rechaza. Hasta hoy eran cinco viñetas de una ficha; acá
  dos de ellas —el cruce contra los 105 temas de `RES-20` y la confirmación de oído— son
  condición para que un ítem exista o para que pase a `listo`. **En v2 la segunda dejó de ser
  condición y pasó a ser una de tres vías declaradas** (`D-25`, `CTR-04.6`); la primera está
  igual que el día uno.

**Este juego no reproduce letras. Trabaja con versos sueltos, y el schema lo hace
estructural.** El piso de 15 ítems de `US-03` necesita **del orden de 30 versos**, no 15
letras enteras (`RES-23`, "qué hacer en su lugar"). El párrafo de `US-03` que dice "15
letras completas, transcriptas y segmentadas en versos" describe un costo que ya no
corresponde: con `BR-03` mostrando 2/1/0 versos, nadie transcribe una letra entera para
armar un ítem, y `BR-12` acaba de corregir la misma frase del lado de la Redondopedia.
**No edito `PRD-alcance-v1.md`** — lo dejo señalado en "Qué le pido a otros roles".

---

### CTR-04.1 — Archivo, envoltorio y presupuesto

| | |
|---|---|
| Ruta de datos | `src/data/letra.json` |
| Copia corrible del schema | `src/data/_schema/letra.schema.json` (existe desde `T-62`) |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Presupuesto de tamaño | **≤ 150 KB de *payload*** — ver abajo, cambió en v2 |

El nombre del archivo de datos sale del nombre del schema que fijó el plan del ciclo
(`letra.schema.json`), para que el par se lea de un vistazo. El valor de `juego` es
`"completar-la-letra"`, igual que la ruta `src/pages/juegos/completar-la-letra.astro` que ya
existe.

> **Enmendado el 2026-09-24 (`T-287`).** El envoltorio decía `"contratoVersion": 2` y no tenía
> `conteo`. Ahora `contratoVersion` es **3** y hay una clave obligatoria nueva, **`conteo`**:
> la `ficha` y la fecha (`consultado`) del bloque `conteo` de `src/data/setlistfm.json` con el
> que se calcularon los niveles. Es la misma clave de `CTR-09.1` y cumple el mismo papel.
> Delata un banco calculado con un conteo viejo: si se refresca el conteo y nadie corre el
> generador, el test `n1` se pone en rojo (`CTR-04.14`). El número de cada tema **no** se
> copia al banco. Vive en `setlistfm.json` y en ningún otro lado.

```json
{
  "contrato": "CTR-04",
  "contratoVersion": 3,
  "juego": "completar-la-letra",
  "actualizado": "2026-09-24",
  "modoRespuesta": "opciones",
  "conteo": { "ficha": "RES-90", "consultado": "2026-09-24" },
  "items": []
}
```

#### El presupuesto de tamaño se corrige acá, porque venía midiendo lo que no era

v1 decía "≤ 150 KB, 15 ítems × ~900 bytes ≈ 14 KB" y lo aplicaba al archivo de datos. **Esa
cuenta caducó en el ciclo 6 y nadie lo dijo:** `src/data/letra.json` tiene hoy **1.784 ítems**
generados por `scripts/generar-letra.mjs`, así que por la propia cuenta de v1 anda por el
orden de 1,5 MB. El techo lleva tres ciclos incumplido y el sitio anda bien, lo cual es la
señal de que el número medía la cosa equivocada.

**Lo que hay que presupuestar es lo que viaja, y no es el archivo.**
`completar-la-letra.astro` importa el JSON **en build**, lo filtra con `cargarBanco` —que se
queda solo con los `listo`— y serializa el resultado en `<script id="banco">`. Los borradores,
las notas internas y todo lo que `aPayload` recorta **no salen del build**. Entonces:

| Qué | Techo | Cuánto es hoy |
|---|---|---|
| `src/data/letra.json`, el archivo de origen | **sin techo** | 1.784 ítems, ninguno viaja entero |
| El payload serializado en la página | **≤ 150 KB** | ~30 ítems `listo` × ~1,1 KB ≈ 33 KB |

Los ~1,1 KB por ítem ya incluyen el `fuenteLetra` de v2, que le suma unos 140 bytes al ítem
que viaja (`CTR-04.6`). Con el piso de 15 de `US-03` son unos 17 KB: sobra techo por nueve
veces. El número no está para apretar hoy, sino para que el día que alguien decida servir el
banco entero —1.784 ítems, más de 1 MB en la página— la decisión se tope con un límite escrito
en vez de con un celular de gama baja. **Las dos cuentas de arriba son estimaciones mías: la
medición de verdad la deja corrible `CTR-04.12`, chequeo 10, y `D-12` me impide correrla.**

Mismo envoltorio que `CTR-02` y `CTR-03`, más `modoRespuesta` a nivel archivo por el mismo
motivo que `CTR-03.5`: mezclar mecanismos de respuesta entre ítems cambia la forma de la
partida sin que el jugador entienda por qué, y deja la decisión de `producto` dispersa en
quince lugares.

Este juego **no importa el motor de audio** (`CTR-01`): no tiene fragmentos ni buffers, así
que no toca el presupuesto de precarga de gama baja.

---

### CTR-04.2 — El ítem, campo por campo

| Campo | Tipo | Oblig. | Qué es |
|---|---|---|---|
| `id` | `^CL-\d{3}$` | sí | Prefijo `CL-` reservado en `CTR-02.7`. Contador propio, no se reutiliza. |
| `us` | array de `US-NN` | sí | Hoy siempre `["US-03"]`. |
| `dificultad` | `facil` · `media` · `dificil` | sí | `BR-01`. Manda cuánto contexto trae el ítem — ver `CTR-04.7`. **Desde v3 es el nivel del tema**: lo da `repartirEnTercios()` y lo escribe el generador. Nadie lo elige, ni a mano ni eligiendo un verso (`CTR-04.14`). |
| `dificultadSegun` | `en-vivo` · `sin-conteo` | sí | **Nuevo en v3.** De dónde salió el nivel. `sin-conteo` quiere decir que el tema no tiene línea en el conteo, y por `D-27` es `dificil`: el schema lo obliga. No viaja al cliente. Ver `CTR-04.14`. |
| `tema` | objeto | sí | El cruce con `RES-20`. Cinco subcampos obligatorios. Ver `CTR-04.5`. |
| `hueco` | objeto `{antes, respuesta, despues}` | sí | El verso partido en tres. Ver `CTR-04.3`. |
| `contexto` | objeto `{antes: [], despues: []}` | sí | Los versos de alrededor. Largo atado a `dificultad`. Ver `CTR-04.7`. |
| `opciones` | array de exactamente 4 | según `modoRespuesta` | Solo con `"opciones"`. Ver `CTR-04.8`. |
| `variantesAceptadas` | array ≤ 6, puede ir vacío | según `modoRespuesta` | Solo con `"texto"`. Obligatoria **aunque vaya vacía**: hay que decidir si el verso tiene variantes de transcripción, no dejarlo implícito. Mismo criterio que `esLeyenda` en `CTR-02`. |
| `explicacion` | string 10–400 | no | El dato de color al revelar. Opcional, igual que en `CTR-03`. |
| `rotulo` | objeto `{tipo, texto}` | no | `leyenda` o `testimonio`, si la `explicacion` no se apoya solo en hecho verificado. Ver `CTR-04.9`. |
| `fuentes` | array de `RES-NN`, ≥ 1, **contiene `RES-20`** | sí | Sostiene tema, disco, pista y año. Ver `CTR-04.5`. |
| `fuenteLetra` | **array de objetos** `{ficha, sitio, url, consultado}`, 1 a 4 | sí | De dónde salió el **texto del verso**. Campo aparte de `fuentes`. **Cambió de forma en v2**: es lo que el juego muestra en pantalla (`T-145`). Ver `CTR-04.6`. |
| `confirmadoDeOido` | objeto de 4 subcampos | no, pero habilita el régimen `oido` | La mitigación 5 de `D-13`. Ver `CTR-04.6`. |
| `cotejo` | objeto `{regimen, decision}` | **sí si `estado: "listo"`** | **Nuevo en v2.** Por cuál de las tres vías se sostiene este ítem. Es el rastro que pide `D-25`. Ver `CTR-04.6`. |
| `sensibleA` | array enum, ≥ 1, **contiene `letra`** | sí | Todo ítem de este juego muestra letra: no existe el caso vacío. |
| `spotify` | objeto `{trackId}` | no | Igual que `CTR-03.7`. Un ítem sin Spotify es válido y jugable (`ADR-01`). |
| `estado` | `borrador` · `listo` · `retirado` | sí | Las cuotas del piso se cuentan solo sobre `listo`. |
| `notaInterna` | string | no | Nunca se renderiza. |

**Lo que el ítem no tiene, y por qué:**

- No tiene la letra del tema, ni un puntero a ella. No hay ningún archivo con letras en este
  proyecto y este contrato no abre la puerta para que aparezca.
- No tiene `mostrarTitulo` ni `mostrarDisco`. La tabla de `BR-03` es constante del motor,
  no dato — mismo argumento con el que `CTR-03.4` se negó a guardar los cinco pasos del
  reveal. Un booleano mal tipeado rompería `BR-03` en silencio.
- No tiene `respuesta` a nivel ítem: la respuesta correcta **es** `hueco.respuesta`, y no se
  duplica en ningún lado (`CTR-03.3` aplicado acá).
- No tiene `categoria`. Las cuatro categorías son del quiz.

---

### CTR-04.3 — Cómo se representa el hueco

**Decisión: el verso del hueco se guarda ya partido en tres — `antes`, `respuesta`,
`despues` — y el verso completo no existe como string en ninguna parte del archivo.**

```json
"hueco": {
  "antes": "<lo que va antes, dentro del mismo verso>",
  "respuesta": "<una palabra, o hasta cuatro>",
  "despues": "<lo que va despues, dentro del mismo verso>"
}
```

Los tres valores van con `<` y `>` a propósito, acá y en `CTR-04.11`: **no escribo versos de
memoria**, y así el que copie el bloque se lleva un archivo que no valida en vez de una letra
inventada.

El tamaño del hueco lo fijó `BR-03` y no es negociable desde acá: **es siempre una palabra o
una frase corta, en los tres niveles por igual**; lo que cambia entre niveles es el contexto
de alrededor, nunca el hueco. El schema lo hace cumplir con un patrón que admite **de una a
cuatro palabras** y hasta 40 caracteres. Cinco palabras ya son medio verso, y a partir de
ahí el juego deja de ser "me sé la letra" para ser "escribí el verso".

Dos reglas más que el schema hace solo:

- `antes` y `despues` **no pueden estar los dos vacíos**. Si lo estuvieran, el hueco sería el
  verso entero, que es exactamente lo que `BR-03` prohíbe. El hueco puede arrancar el verso
  o cerrarlo, pero no ser el verso.
- Ni el verso, ni el hueco, ni una opción admiten los caracteres `<` y `>`. Sirve para dos
  cosas a la vez: mantiene marcado fuera de un campo que se renderiza, y hace que el ejemplo
  de `CTR-04.11` **no valide** si alguien lo copia tal cual.

#### Alternativas descartadas

1. **Un verso completo más un índice de palabra** (`"verso": "...", "indicePalabra": 3`).
   Descartada por lo mismo que `CTR-02.3` descartó `indiceCorrecta`: el día que alguien
   corrija una palabra del verso —y va a pasar, porque la fuente es de fans (`D-13`)— el
   índice queda apuntando a otra palabra y el juego pide otra cosa **sin que nada falle**.
   Con el verso partido, corregir `antes` no puede mover la respuesta.
2. **Una plantilla con marcador** — el verso guardado como una sola cadena con un
   delimitador en el lugar de la palabra que falta, por ejemplo `"…antes ⟦hueco⟧ después…"`.
   Es cómoda de leer, y tiene dos problemas. La respuesta igual necesita un campo aparte, así
   que no ahorra nada y sí crea dos fuentes que se pueden desincronizar; y un delimitador mal
   escrito no rompe el archivo, se le muestra al jugador tal cual.

   > Nota de higiene, agregada al correr el validador: la versión original de esta viñeta
   > escribía el ejemplo con llaves dobles y un verso real adentro. Las llaves dobles son la
   > sintaxis de plantilla del instanciador, así que el validador lo leía como un marcador
   > sin resolver y dejaba la instancia **NO APTA**. El ejemplo no necesitaba un verso de
   > verdad para explicar la forma, así que ahora es genérico.
3. **Guardar el verso completo y que el motor tape la palabra al renderizar.** Descartada
   porque el verso entero viajaría al cliente con la respuesta adentro: cualquiera que abra
   el archivo, o la pestaña de red, tiene la respuesta servida. Partido en tres el problema
   no desaparece —el JSON es público— pero al menos no hay una versión "armada" del verso
   esperando a que alguien la lea.
4. **Que el hueco pueda ser un verso entero en nivel difícil.** No es mía: `BR-03` ya dijo
   que el tamaño del hueco no cambia entre niveles. Si `producto` lo reabre, es `CTR-04` v2.

---

### CTR-04.4 — El tope de versos: por ítem y por tema

**Por ítem: 5 versos, y sale de la forma del dato, no de una advertencia.** El máximo
posible es el nivel fácil: 2 de contexto antes, el verso del hueco, 2 después. El schema le
pone `maxItems: 2` a cada arreglo de contexto, así que **un ítem no tiene dónde escribir un
sexto verso**. Es el mismo número que `BR-03` fija como tope de exposición y el mismo que
`BR-12` acaba de fijar para los artículos `tema` de la Redondopedia.

**Por tema, en todo el banco: 8 versos distintos.** Esto no lo puede ver un schema —es
propiedad del conjunto— y va como chequeo de script (`CTR-04.12`, chequeo 5). El número es
una precaución propia del proyecto, no una regla legal, y lo elijo así: dos ítems fáciles
disjuntos del mismo tema ya consumen 10 versos y no entran bajo la cota, o sea que obligan a
solaparse o a que el segundo ítem sea media o difícil. Con eso, ningún tema queda
reconstruible leyendo el banco, que es lo único que me importa evitar.

> **Enmendado el 2026-09-24 (`T-287`).** La segunda salida del párrafo de arriba ya no existe.
> Con v3 todos los ítems de un tema tienen el mismo nivel (`CTR-04.14`), así que el segundo
> ítem de un tema Fácil **no puede** ser media. Quedan dos salidas: que los dos ítems se
> solapen, o que el tema tenga un solo ítem Fácil `listo`. Es criterio de curaduría y es de
> `contenido`.
>
> **Y la cota se mide sobre los `listo`, no sobre el archivo.** El comando (5) de `CTR-04.12`
> contaba todos los ítems. Con los 1.784 borradores del generador eso cubre temas enteros y no
> mide nada. Es el mismo arreglo que `CTR-04.1` v2 le hizo al presupuesto: se mide lo que el
> sitio publica. El comando nuevo está en `CTR-04.12`. El generador lo imprime en cada corrida
> (`CTR-04.14`, paso 9) y no aborta por esto: bajo `D-14` es una precaución, no un cerrojo.

**Dónde queda esto contra lo que dice la investigación.** `RES-03` fijó el marco del Art. 10
—hasta mil palabras de obra literaria u ocho compases en las musicales—; `RES-14` encontró
que **ninguna fuente resuelve** bajo cuál de los dos cae una letra citada sin partitura, y
dejó anotado que el Art. 17 da base textual para tratarla como obra literaria; `RES-11`
agregó que la excepción de los ocho compases **regula la obra y no la grabación**. Cinco
versos son unas 30 a 45 palabras: quedan cómodos bajo cualquiera de las dos lecturas, que es
lo que `RES-14` ya había concluido para `BR-03`. **No apoyo el número en los ocho compases**,
porque esa referencia mide notación musical y acá no hay ninguna.

Y bajo `D-14` esto no es un cerrojo: si llega un reclamo, se baja. El tope existe para que
el sitio sea lo que dice ser —un juego que cita versos— y no un repositorio de letras con
juego encima.

---

### CTR-04.5 — El cruce obligatorio con los 105 temas de `RES-20`

Es la mitigación 1 de `D-13`, la única que la ficha llama **obligatoria y gratis**: mata el
error demostrado de las fuentes de fans, que listan 149 canciones mezclando material del
Indio solista, de Los Fundamentalistas y de Skay. Sin este cruce, el juego sobre Patricio Rey
le pide al jugador que complete un verso que Patricio Rey nunca cantó.

**Cómo se declara. No con un tilde: con el objeto `tema`, cinco subcampos, ninguno opcional.**

```json
"tema": {
  "slug": "todo-un-palo",
  "titulo": "Todo un palo",
  "disco": "un-baion-para-el-ojo-idiota",
  "pista": 8,
  "anio": 1988
}
```

| Subcampo | Qué exige el schema | Por qué así |
|---|---|---|
| `slug` | patrón de `CTR-01.4` (minúsculas, ASCII, guion simple o doble) | Es el mismo slug con el que `US-02` nombra el archivo de audio. Un tema se llama igual en los dos juegos, y el día que haya un ítem de audio y uno de letra del mismo tema, se cruzan solos. |
| `titulo` | 1 a 80 caracteres, sin `<` ni `>` | Copiado **literal** de `RES-20`. El techo de 80 sale de contar, no de estimar: el título más largo de la discografía tiene 61 caracteres (`CTR-03.5`). |
| `disco` | **enum cerrado de los 10 slugs** de la discografía | Son los mismos diez `slug` de tipo `disco` que ya viven en `src/data/redondopedia.json`, así que el enlace a la ficha del disco sale sin campo nuevo: `/redondopedia/<disco>`. |
| `pista` | entero, 1 a 13, y **acotado por disco** | El número de pista no se sabe de memoria: hay que abrir la ficha. Es el subcampo que convierte el cruce en trabajo real. |
| `anio` | entero 1985–2000, **atado al disco por el schema** | Lo pide el enlace a la Redondopedia y la revelación. No es una copia libre: ver abajo. |

**Diez ramas `if/then`, una por disco, que atan año y pista máxima.** *Gulp!* 1985 con
12 pistas, *Oktubre* 1986 con 9, *Un baión…* 1988 con 8, *¡Bang! ¡Bang!…* 1989 con 9,
*La mosca y la sopa* 1991 con 10, *Lobo suelto* 1993 con 13, *Cordero atado* 1993 con 12,
*Luzbelito* 1996 con 11, *Último bondi…* 1998 con 10, *Momo Sampler* 2000 con 11. Suman
**105**, que es el número de `RES-20`. Con esto, `"pista": 11` en *Un baión…* no valida, y
`"anio": 1998` con `"disco": "oktubre"` tampoco.

> Sobre *Gulp!* con 12: `RES-20` deja la discrepancia abierta —CMTV lista 11, Wikipedia 12
> contando el track oculto "Pianito - Jam"—. El schema admite la pista 12 porque el tema
> existe; **lo que sigue prohibido es preguntar cuántos temas tiene el disco**, y eso es
> asunto de `contenido`, no del schema.

**La otra mitad del cruce, y es la que cierra: `fuentes` tiene que contener `RES-20`.**
`minItems: 1` más `contains: {"const": "RES-20"}`. Un ítem sin esa ficha no valida, sin
excepción de leyenda — mismo endurecimiento que `CTR-03.6` regla 1, y por el mismo motivo:
lo que el ítem afirma en su núcleo es dato discográfico, y no existe la versión "leyenda" de
en qué disco está un tema.

#### Por qué no enumeré los 105 slugs en el schema

La tarea me daba las dos vías. Elijo enumerar **los 10 discos** y dejar el tema como slug más
pista, con el cruce en un chequeo aparte, por cuatro razones:

1. Enumerar 105 slugs me obliga a **transcribir a mano 105 títulos** desde la ficha a un
   archivo de `Docs/ARQ/`. Una lista tipeada a mano es exactamente el modo de falla que este
   repo ya cazó tres veces, y quedaría en el peor lugar posible: el archivo que decide qué
   es válido.
2. La lista de `RES-20` **no está cerrada**. Tiene tres discrepancias vivas y un título que
   la propia ficha trae **abreviado** ("Una piba con la remera de Greenpeace…"). Congelarla
   en un enum congela algo que la investigación todavía discute, y cada corrección pasaría a
   ser una edición del schema.
3. Un enum de slugs **no atrapa el error que importa**. `oktubre` + pista 3 + un título de
   otro disco pasaría igual. Lo que atrapa eso es comparar la terna completa
   (`disco`, `pista`, `titulo`) contra la ficha, y eso es un script.
4. Ese script necesita una lista auxiliar, **y `CTR-03.10` ya la había anticipado** con
   nombre y ruta: `src/data/_schema/titulos-res-20.json`. Enumerar acá crearía una segunda
   lista de los mismos 105 temas, con dos lugares donde corregir.

**Forma de la lista auxiliar, para que la produzca quien tenga Bash** (no es `T-62` y no la
escribo yo): un arreglo de 105 objetos `{"disco": "<slug>", "pista": <n>, "titulo": "<literal
de RES-20>"}`, derivado de `Docs/INVESTIGACION/INV-20-fuentes-primarias.md` copiando y
pegando, no de memoria. Sirve para el chequeo 3 de `CTR-04.12` y para el chequeo 4 de
`CTR-03.10`, que hoy no se puede correr por lo mismo.

> **Actualización del 2026-08-27 (`T-131`): los dos párrafos de arriba están saldados y de
> mejor manera.** El ciclo 6 escribió `src/lib/letra/temas.ts`, que **parsea los 105 desde la
> ficha** en vez de copiarlos —una sola verdad, no dos que se desincronizan— y expone
> `resolverTema()`, la puerta de `D-13` hecha función. La lista auxiliar `titulos-res-20.json`
> **no se va a escribir**, el chequeo 3 quedó reescrito contra `temas.ts` en `CTR-04.12`, y
> el cruce del título ya corre en cada build dentro de `verificarInvariantes`.
>
> **Y con eso cae la frase que decía "mientras esa lista no exista, ningún ítem puede pasar a
> `listo`".** Estaba escrita para un faltante que se resolvió hace tres ciclos, y si nadie la
> tachaba iba a bloquear `T-144` por un motivo que ya no existe. Lo que sigue sin correr
> automático es la mitad `disco` + `pista` de la terna: eso lo cubre el chequeo 3, a mano.

---

### CTR-04.6 — Las tres vías que deciden si un ítem está `listo`

> **v1 tenía dos vías y las dos están cerradas de hecho.** `D-25` lo midió y no lo supuso:
> cada tema del cancionero tiene **una sola** fuente (cifraclub 78 · lacuerda.net 21 ·
> letras.com 5) y los 149 archivos crudos del scraper son uno por tema — **solapamiento
> cero**, así que no hay con qué cruzar; y los 26 huecos `_:__` de
> `src/data/letra-confirmaciones.json` siguen en blanco desde el ciclo 6. Con las dos vías
> cerradas, los 1.784 candidatos quedaron en `borrador` y el juego, apagado. La tercera vía
> es la salida que eligió el usuario, con la advertencia sobre la mesa.

`INV-21` dice cuál de las cinco mitigaciones de `D-13` cierra de verdad: **confirmar de oído
contra el disco**. La 2, dos fuentes que coincidan, es la más barata que baja el riesgo sin
escuchar nada. La tercera no baja ningún riesgo: **lo asume y lo deja anotado.**

**La regla, y sigue siendo la única condición de estado de este contrato:**

> Para que un ítem tenga `"estado": "listo"` necesita el objeto **`cotejo`**, que declara por
> cuál de las tres vías se sostiene, y la evidencia que esa vía exige:
>
> | `cotejo.regimen` | Qué exige además | Qué dice de verdad |
> |---|---|---|
> | `oido` | el objeto `confirmadoDeOido` | alguien puso el disco y encontró el verso |
> | `dos-fuentes` | `fuenteLetra` con **≥ 2** entradas, de **sitios distintos** | dos transcripciones independientes coinciden |
> | `fuente-unica` | `fuenteLetra` con **exactamente 1** entrada, **sin** `confirmadoDeOido`, y `decision: "D-25"` | una sola transcripción de fans, sin cotejar, publicada a sabiendas |
>
> Un ítem sin `cotejo` no puede estar `listo`. Un ítem cuyo `cotejo` no coincida con su
> evidencia **no valida** — la declaración no se cree sola.

**Las tres son excluyentes por schema**, y ahí está lo que pide `D-25`. `fuente-unica` no
admite `confirmadoDeOido` ni una segunda ficha: si aparecen, el ítem **tiene que** cambiar de
régimen. Por eso un ítem `listo` por fuente única no se puede confundir con uno confirmado de
oído ni por descuido ni queriendo, y por eso `grep '"regimen": "fuente-unica"'` devuelve
exactamente los ítems que `D-25` aflojó — que es la lista que hay que mirar el día que
alguien decida revertirla.

**El ítem sube de régimen, nunca baja solo.** Si mañana `investigador` ficha lacuerda.net, o
aparece una segunda transcripción del mismo tema, o alguien hace los 26 minutos de escucha,
el ítem pasa a `dos-fuentes` o a `oido` **sin tocar el schema**: las dos vías viejas ya están
escritas y siguen vigentes. Es lo que `D-25` llama "qué la revierte", y no requiere volver a
discutir nada. `T-144` deja especificado que el generador **elija siempre el régimen más
fuerte que la evidencia permita** (`CTR-04.13`, punto 8): nadie tiene que acordarse de subir
un ítem a mano.

#### `fuenteLetra` en v2: la ficha, el sitio y el enlace, por ítem

```json
"fuenteLetra": [
  {
    "ficha": "RES-49",
    "sitio": "cifraclub.com",
    "url": "https://www.cifraclub.com/los-redonditos-de-ricota/todo-un-palo/",
    "consultado": "2026-08-24"
  }
]
```

| Subcampo | Qué exige el schema | Por qué |
|---|---|---|
| `ficha` | `^RES-\d{2}$` | Lo único que había en v1. Es lo que ata la fuente a una evaluación escrita: `RES-23` para letras.com, `RES-49` para cifraclub. **Un sitio sin ficha no se puede declarar**, y por eso los 21 temas de lacuerda.net siguen afuera del banco — el generador lo hace cumplir con `FICHA_POR_SITIO` y esta revisión no lo toca (la ficha es de `investigador`). |
| `sitio` | dominio en minúsculas, 4 a 40, sin esquema ni ruta | Es lo que se lee en pantalla (`T-145`). Va el dominio pelado y no un nombre de fantasía: el rótulo es **registro 3** (`voz-ricotera.md`), dice qué hay adentro y se calla. |
| `url` | `https://…`, ≤ 200, sin espacios ni `<` `>` | El enlace al tema en ese sitio, **no a la home**. Es la mitad que convierte "salió de cifraclub" en algo que el jugador puede ir a mirar en un toque. |
| `consultado` | `AAAA-MM-DD` | Cuándo se leyó esa página. Una transcripción de fans cambia sin avisar; sin fecha no se sabe si la que se comparó es la misma. |

**De dónde sale el dato: ya existe y no se tipea a mano.** Cada tema de
`src/data/cancionero.json` trae `fuente: {sitio, url, consultado}` con exactamente esa forma,
así que el generador lo copia del tema y le pega la `ficha` que ya resolvía por
`FICHA_POR_SITIO`. Ningún campo nuevo se inventa: **v2 no le pide a nadie un dato que el repo
no tenga.**

#### Por qué `fuenteLetra` cambió de forma en vez de sumarse un campo al lado

`T-145` necesita sitio + URL por ítem. La alternativa obvia era dejar `fuenteLetra:
["RES-49"]` como estaba y agregar un `transcripcion: {sitio, url}` aparte. **Está descartada
por lo mismo que este contrato descartó `indicePalabra` y el verso duplicado**: serían dos
campos afirmando de dónde salió la misma letra, y el día que uno se corrija sin el otro, el
ítem cita una ficha y muestra otro sitio **sin que nada falle**. Con la ficha adentro del
mismo objeto que el sitio, esa desincronización no tiene dónde ocurrir.

El costo es real y se paga: **la forma de v1 deja de validar**, así que `contratoVersion` va a
2 y el archivo se regenera entero. Se puede pagar porque `letra.json` lo escribe un script, no
una persona: no hay trabajo humano que se pierda. Si mañana el banco lo cargara alguien a
mano, esta misma migración costaría una tarde y la decisión sería otra.

#### Qué viaja al cliente en v2, que es de lo que depende `T-145`

Hasta hoy `aPayload` recorta todo lo que no se juega —`fuenteLetra`, `confirmadoDeOido`,
`fuentes`, `sensibleA`, `estado`, `notaInterna`—: al navegador llegan el ítem jugable y su
explicación, y nada más. **Con `T-145` eso deja de alcanzar**, porque el panel de respuesta
tiene que mostrar qué sitio transcribió el verso, con su enlace. El contrato pasa a exigir:

| Campo | ¿Viaja? | Por qué |
|---|---|---|
| `fuenteLetra` | **sí, entero** | Es el dato que se muestra. Van las 1 a 4 entradas: si un ítem tiene dos, la pantalla puede decir que dos sitios coinciden, que es información y no ruido. |
| `cotejo.regimen` | **sí** | Sin él, el panel no puede distinguir "esto lo escuchó alguien" de "esto salió de una sola transcripción" — y decir lo segundo como si fuera lo primero es el rótulo que miente. |
| `confirmadoDeOido` | **no** | Lleva el nombre de una persona y el minuto exacto: es trazabilidad interna, no información para el jugador. Que un verso esté confirmado se dice con `cotejo.regimen: "oido"`. |
| `notaInterna` | **no**, nunca | Igual que en v1. |

Son unos 140 bytes por ítem sobre el payload, contra el techo de 150 KB de `CTR-04.1`: no
mueve la aguja.

**Cómo se ve eso en pantalla no lo decide este contrato**, y conviene decirlo porque es
tentador: el enunciado, el largo y dónde se apoya el enlace son de `experiencia`, y el texto,
de `contenido`. Lo único que el contrato fija es que el dato esté disponible y que el rótulo
sea **registro 3** (`voz-ricotera.md`): dice de dónde salió el verso y se calla.

#### `fuenteLetra` va aparte de `fuentes`, y eso no cambió

Son dos afirmaciones distintas: `fuentes` sostiene que el tema existe, en qué disco y en qué
pista; `fuenteLetra` sostiene que el texto del verso dice lo que dice. Meterlas en el mismo
arreglo haría imposible medir el régimen `dos-fuentes` —¿dos fichas de qué?— y borraría la
trazabilidad que pide la mitigación 4 de `D-13`: el día que se corrija una transcripción, se
filtra por `fuenteLetra` y aparecen los ítems afectados sin auditar el banco entero. En v2 ese
filtro además se puede hacer **por sitio**, sin pasar por la ficha.

#### `confirmadoDeOido` no cambió, y sigue siendo un objeto

**Es un objeto de cuatro subcampos, no un booleano**, por la lección de `CTR-02.4` regla 3:
una casilla que se tilda bajo presión de ráfaga se tilda sola.

| Subcampo | Qué exige | Por qué |
|---|---|---|
| `quien` | 3 a 60 caracteres, arranca en mayúscula | Quién escuchó. Hay una sola persona con parlantes en este proyecto, y aun así el campo tiene que decir su nombre: dentro de dos meses, "alguien lo escuchó" no es nadie. |
| `fecha` | `AAAA-MM-DD` | Cuándo. Si mañana cambia la transcripción de una fuente, se sabe qué escuchas son anteriores. |
| `donde` | enum: `disco-fisico` · `streaming` · `video` | No es lo mismo el disco que un video de YouTube con la letra sobreimpresa — que es leer la misma fuente de fans con música de fondo, no escuchar. |
| `minuto` | patrón `M:SS` o `MM:SS` | **Es el campo que separa la confirmación del tilde.** Solo se puede escribir habiendo encontrado el verso en la grabación, y deja el ítem re-chequeable en veinte segundos por otra persona. Es el equivalente exacto de `testimonio.ubicacion` en `CTR-02`. |

**Lo que el schema no puede ver, y `revisor` sí:** que en ese minuto suene ese verso. La
máquina mira la forma, la persona mira la verdad — igual que siempre, y acá la persona la
tiene fácil porque le alcanza con poner el tema.

#### `cotejo`: el rastro, y qué garantiza de verdad

```json
"cotejo": { "regimen": "fuente-unica", "decision": "D-25" }
```

| Subcampo | Qué exige el schema | Por qué |
|---|---|---|
| `regimen` | enum cerrado: `oido` · `dos-fuentes` · `fuente-unica` | La vía por la que este ítem llegó a `listo`. Es lo que se filtra, se cuenta y se muestra. |
| `decision` | `const: "D-25"`, **obligatorio si `regimen` es `fuente-unica`** y **prohibido en los otros dos** | La huella dactilar. Bajo qué decisión escrita se aflojó la regla para este ítem. Un `const` significa que no puede decir otra cosa: nadie va a poder apoyar una promoción futura en una decisión que no existe sin tocar el schema. |

**Sí, `regimen` es derivable de la evidencia. Está puesto igual, y a propósito.** Este
contrato rechazó tres veces un campo redundante —`indicePalabra`, el verso completo,
`versosVisibles`—, así que hay que decir por qué acá la redundancia entra: **aquellas no las
podía chequear nadie**, y esta la chequea el schema entero, en el mismo archivo, con cuatro
ramas `if/then`. Una redundancia verificada a máquina no es una segunda fuente de verdad: es
un dígito de control. Si la declaración y la evidencia se separan, el archivo **no valida** —
en vez de mostrarle al jugador algo distinto de lo que dice el JSON, que es el modo de falla
que aquellos tres tenían.

Lo que se gana pagando ese byte de más: un ítem `listo` **dice en su propio cuerpo por qué lo
está**. Sin `regimen`, "una ficha y `listo`" es indistinguible de un bug —de hecho es
exactamente el bug que v1 rechazaba—, y dentro de dos meses nadie va a poder decir si eso fue
una decisión o un descuido.

**Lo que `cotejo` NO garantiza, dicho antes de que alguien lo suponga:** no prueba que se haya
hecho ningún trabajo. `minuto`, en `confirmadoDeOido`, solo se puede escribir habiendo
encontrado el verso en la grabación; `regimen: "fuente-unica"` lo escribe un script en un
milisegundo. **No es un descuido de diseño: bajo `D-25` no hay trabajo que probar**, porque la
decisión es justamente publicar sin cotejar. Pretender lo contrario con un campo ceremonial
sería peor que no tenerlo — sería un rótulo que miente sobre lo que hay adentro, que es lo
único que `D-14` dejó prohibido. Lo que `cotejo` garantiza es lo que sí se puede garantizar:
que la pérdida sea **visible por ítem, contable en un comando y revertible por filtro**.

#### Qué sigue rechazando el schema

`D-25` relaja *cuántas* fuentes, no *si hay*. Todo esto sigue sin validar, igual que en v1:

1. **Un ítem sin ninguna fuente de letra.** `fuenteLetra` sigue siendo obligatorio con
   `minItems: 1`, y ahora cada entrada tiene que traer **ficha, sitio, URL y fecha**: en v2 es
   más difícil declarar una fuente que en v1, no menos. Un sitio sin ficha `RES-NN` no se
   puede escribir, y por eso lacuerda.net sigue afuera.
2. **Un tema que no esté entre los 105 de `RES-20`.** Intacto y por triplicado: `fuentes`
   tiene que contener `RES-20`, `tema.disco` es un enum de los diez discos con año y pista
   máxima atados por disco, y el cruce del título lo corre `verificarInvariantes` en build
   contra la ficha parseada (`src/lib/letra/temas.ts`). `D-25` no toca nada de esto.
3. **Un ítem `listo` sin `cotejo`**, o con un `cotejo` que su evidencia no sostiene: `oido`
   sin `confirmadoDeOido`, `dos-fuentes` con una sola ficha, `fuente-unica` con dos, o
   `fuente-unica` con `confirmadoDeOido` encima.
4. **Un `confirmadoDeOido` sin minuto en `M:SS`.** La vía del oído no se ablandó ni un poco:
   quien la use sigue teniendo que decir quién, cuándo, dónde y en qué minuto.
5. **Todo lo demás de v1**, que esta revisión no tocó: el hueco que se come el verso entero,
   una respuesta de cinco palabras, `<` o `>` en cualquier texto, el contexto que no coincide
   con `dificultad` (`BR-03`), `sensibleA` vacío o sin `letra`, `opciones` que no sean cuatro
   con exactamente una correcta, `rotulo` sin `explicacion`, y cualquier campo inventado
   (`additionalProperties: false`).

#### Alternativas descartadas

**De v1, sobre las dos vías originales** (siguen valiendo, porque las dos vías siguen vivas):

1. **`confirmadoDeOido: true`, un booleano.** Es la traducción literal de la mitigación y es
   justo el campo que se llena por inercia. Descartada por `CTR-02.4` regla 3.
2. **Exigir `fuenteLetra` con dos fichas siempre, sin la salida del oído.** Estrangula la
   carga hoy: las fichas de fuentes de letras que existen son `RES-23` (letras.com,
   evaluada en negativo pero admitida por `D-13`) y `RES-49` (cifraclub). Y es peor de fondo:
   dos fans que se copiaron entre sí no valen más que uno, mientras que el disco es el disco.
3. **Exigir el oído siempre.** Es lo más seguro y bloquea la carga a la velocidad de una
   sola persona con auriculares. La dejo como la forma preferida —y medible, consulta 7 de
   `CTR-04.12`— sin volverla obligatoria.
4. **Un campo libre `fuente: "letras.com, consultado el ..."`.** Descartada por lo mismo que
   `CTR-02.4` descartó `fuentePrimaria`: una string no se valida por partes ni se filtra.

**De v2, sobre cómo se declara la fuente única** (`T-131`). Las cuatro son formas reales de
cumplir `D-25`, no espantapájaros:

5. **No declarar nada: dejar que `listo` con una sola ficha sea legal y listo.** Es la más
   barata —una rama `if/then` menos en el schema— y la que el generador podría hacer en dos
   líneas. Descartada porque es exactamente lo que `D-25` prohíbe: sin marca, un ítem
   promovido a sabiendas y un ítem promovido por un bug del generador **son el mismo JSON**.
   Y peor: el día que se revierta la decisión, no hay forma de saber cuáles bajar, porque el
   régimen viejo y el nuevo no se distinguen.
6. **Un valor nuevo de `estado`: `listo-sin-cotejar`.** Es la marca más imposible de
   confundir que existe, y por eso la consideré primero. Descartada por dos motivos, y el
   segundo es el que la mata: mezcla dos ejes distintos —dónde está el ítem en su ciclo de
   vida y con qué evidencia se lo sostiene—, y **rompe a todo el que filtra por
   `estado === 'listo'`**: `cargarBanco`, los seis comandos de `CTR-04.12` y las cuotas del
   piso de `US-03` empezarían a contar de menos, en silencio, hasta que alguien note que el
   juego sirve la mitad de los ítems. Un régimen no es un estado.
7. **Un booleano `fuenteUnica: true`.** La forma más corta de dejar rastro. Descartada por
   `CTR-02.4` regla 3 **agravada**: aquel booleano se tildaba por inercia y no cambiaba nada;
   este *baja la vara* — un tilde que habilita `listo`. Y no admite las otras dos vías, así
   que dejaría el régimen declarado en un lado (el booleano) y los otros dos deducidos en
   otro. Con `regimen` los tres se leen del mismo campo.
8. **Meter la marca adentro de `notaInterna`.** El campo ya existe, no toca el schema y
   admite cualquier explicación. Descartada porque `notaInterna` **nunca se renderiza ni se
   valida** (`CTR-04.2`): es prosa suelta, no se filtra por comando, no se cuenta, y un typo
   la hace invisible sin que nada falle. Lo que `D-25` pide es lo contrario de una nota: un
   dato con enum.

---

### CTR-04.7 — La dificultad de `BR-03`, expresada en datos

> **Enmendado el 2026-09-24 (`T-287`, `D-46`, `BR-30`). La decisión de este apartado queda
> igual. Cambian dos cosas que estaban alrededor.**
>
> 1. **Quién pone el nivel.** Ya no sale de dónde cae el verso. Lo da el conteo del tema
>    (`CTR-04.14`). La tabla de abajo sigue siendo la de `BR-03`, celda por celda.
> 2. **De dónde salen los versos de contexto.** Este apartado nunca lo dijo, y el generador
>    los tomaba **dentro de la estrofa**. Desde v3 son **los N versos inmediatamente
>    anteriores y los N posteriores en la lista de versos del tema**, en el orden del
>    cancionero y sin cortar en el borde de la estrofa. N es `CONTEXTO_POR_NIVEL[nivel]`
>    (`src/lib/letra/banco.ts`). **Si el verso no tiene N de cada lado, no da ítem**: ni baja
>    de nivel ni se rellena. El porqué y las alternativas están en `CTR-04.14`.
>
> **Cómo se declara que el contexto sigue al nivel:** no se declara con un campo. Lo declaran
> las tres ramas `if/then` de siempre, que atan el largo de `contexto` a `dificultad`. Un campo
> aparte sería justo la alternativa 4 de abajo (`versosVisibles`), que este contrato ya
> descartó. `BR-30` pidió que el contexto no se desacople, y la forma del dato ya lo impide.

**Decisión: el ítem guarda exactamente los versos que su nivel muestra, y el schema ata el
largo del contexto a `dificultad`.**

```json
"contexto": { "antes": ["<verso>", "<verso>"], "despues": ["<verso>", "<verso>"] }
```

| `dificultad` | `contexto.antes` | `contexto.despues` | Versos del ítem |
|---|---|---|---|
| `facil` | exactamente 2 | exactamente 2 | 5 |
| `media` | exactamente 1 | exactamente 1 | 3 |
| `dificil` | vacío | vacío | 1 |

Tres ramas `if/then` y listo. Un ítem `dificil` con versos de contexto **no valida**: no hay
dónde guardarlos. Un ítem `facil` con un solo verso antes, tampoco.

Lo que gana el proyecto con esto, y es la razón de la decisión: **el nivel difícil no expone
letra que nunca se muestra**. Si el ítem guardara siempre 2+2 y el motor recortara al
renderizar, un ítem difícil viajaría al cliente con cuatro versos que el jugador jamás ve —
`BR-03` cumplida en pantalla e incumplida en el archivo, que es público.

El título y el disco visibles por nivel (`BR-03`: fácil los dos, media solo el título,
difícil ninguno) **no son datos**: son la tabla, y vive en el motor como constante. El JSON
siempre trae `tema` completo, porque el motor lo necesita para revelar al final aunque no lo
muestre durante el ítem.

**Y no, eso no es una filtración.** El archivo entero es público desde que se sirve: quien
abra `src/data/letra.json` tiene todo, en cualquier diseño. Un juego estático sin backend no
puede esconderle nada al que mira el código, y pretender lo contrario sería la clase de
seguridad que se cae sola (`D-02`, sin backend).

#### Alternativas descartadas

1. **Guardar siempre 2+2 y que el motor recorte según nivel.** Es lo más cómodo para
   `contenido` —un solo formato— y expone el doble de letra de la que se muestra. Descartada
   por el párrafo de arriba.
2. **Un solo arreglo `contexto` con los versos en orden y un índice del verso del hueco.**
   Mismo defecto que la alternativa 1 de `CTR-04.3`: el índice se desincroniza en silencio.
3. **Guardar la letra segmentada del tema y que el ítem apunte por número de verso.** Es la
   forma clásica, y es exactamente lo que este contrato existe para impedir: una letra
   entera en el repo con quince punteros encima.
4. **Un campo `versosVisibles: 2` por ítem, en vez de atarlo a `dificultad`.** Crea una
   segunda fuente de verdad frente a la tabla de `BR-03` y habilita un "fácil" con 0 versos
   sin que nada falle.

---

### CTR-04.8 — Los distractores y el modo de respuesta

**Decisión: los tres distractores los escribe `contenido`, uno por uno, dentro de
`opciones`. No los genera el motor.**

`opciones` son exactamente 4, con exactamente una `correcta: true`, y cada `texto` obedece el
mismo patrón que `hueco.respuesta` —de una a cuatro palabras—, así que un distractor no puede
ser un verso. La opción correcta tiene que decir lo mismo que `hueco.respuesta`, carácter por
carácter, y eso lo verifica el chequeo 4 de `CTR-04.12`: es de script, no de schema, igual
que en `CTR-03.3`.

**Por qué declarados y no generados**, que es la parte que hay que poder defender en dos
meses:

- Un distractor sacado a máquina de un pool de palabras **puede completar el verso también**.
  Nadie se entera hasta que un jugador que se sabe la letra elige una opción defendible y el
  juego le marca error. Es el peor fallo posible acá (`D-14`), y llega por la puerta de la
  comodidad.
- Un pool de palabras para generar distractores **es más letra en el cliente**, justo lo que
  el tope de `CTR-04.4` evita.
- Lo generado cambia entre sesiones, así que `revisor` no puede auditar lo que el jugador
  vio. Con los distractores escritos, un ítem malo se corrige en el archivo y se sabe cuál
  era.

Tres reglas que el schema no puede mirar y quedan como chequeo (`CTR-04.12`, chequeo 4):
ningún distractor puede coincidir con la respuesta **normalizando mayúsculas y tildes**
—"Corazón" y "corazon" en la misma pantalla son dos opciones correctas—; ningún distractor
puede aparecer en los versos de contexto del propio ítem, porque lo regala; y los cuatro
textos tienen que ser distintos entre sí.

**Cuatro opciones es un valor de trabajo, no una regla cerrada.** `BR-04` fija 4 para
`US-01`, `US-02` y `US-04`, y **no nombra a `US-03`** — `US-03` criterio 1 dice "puede elegir
o escribir", que son dos juegos distintos. Copio el 4 porque la cuenta de azar de `BR-04` es
la misma acá (25% para el que no sabe nada, contra 33% con tres) y porque la grilla de 2×2
es lo que entra en zona pulgar. Pero **la que decide es `producto`**, y son dos decisiones
pegadas: si se responde eligiendo o tipeando, y si `BR-04` se extiende a `US-03`.

**No pierde trabajo quien cargue hoy.** La respuesta correcta vive en `hueco.respuesta`, que
no cambia con el modo; lo único que depende de la decisión son los tres distractores. Es la
misma propiedad que `CTR-03.5` dejó anotada para `US-02`.

Si gana `"texto"`, la tolerancia de tipeo la fijan `experiencia` (mecanismo) y `contenido`
(qué cuenta como correcto), como ya dice el PENDIENTE de `PRD-alcance-v1.md`. Del lado del
dato el enganche está: `variantesAceptadas` guarda las formas aceptadas además de la
canónica, y la canónica nunca se duplica ahí.

---

### CTR-04.9 — Rotulado de `D-14` y `sensibleA`

**El verso no lleva rótulo, y hay que entender por qué.** Las tres casillas de `D-14` —hecho,
leyenda, testimonio— clasifican **afirmaciones**. Un verso no afirma nada sobre el mundo: es
la letra. Lo que sí puede estar mal es la **transcripción**, y eso no se resuelve con un
rótulo sino con `fuenteLetra`, `confirmadoDeOido` y, desde v2, `cotejo` (`CTR-04.6`), que
dicen de dónde salió el texto, si alguien lo escuchó, y con cuánto respaldo se lo publicó.

> **Y ahí está el punto 3 de `D-25`**: *"el rótulo sigue sin poder mentir — si el sitio
> muestra un verso sostenido por una sola transcripción de fans, no puede presentarlo como si
> estuviera cotejado"*. `cotejo.regimen` es exactamente ese rótulo, y por eso viaja al cliente
> junto con `fuenteLetra`. Un verso publicado sin cotejar y mostrado sin decirlo sería una
> leyenda vestida de hecho, que es lo único que `D-14` dejó prohibido.

**Donde sí aplica el rotulado es en la `explicacion`**, que es la que afirma algo: qué quiere
decir el verso, a qué alude, qué contó el Indio sobre ese tema. Ahí va `rotulo`, con la misma
forma exacta de `CTR-03.6` —`{ "tipo": "leyenda" | "testimonio", "texto": "<quién lo cuenta
y dónde>" }`, texto de 20 a 200 caracteres— para que los tres contratos tengan una sola
forma. El schema verifica lo que puede: que no haya `rotulo` sin `explicacion`, y que el
texto tenga largo suficiente.

Y acá conviene decirlo fuerte, porque este juego es donde más tienta: **la interpretación de
un verso casi nunca es un hecho**. "Este verso habla de tal cosa" es leyenda ricotera en el
99% de los casos, y como leyenda rotulada es contenido de primera (`D-14`). Como hecho
disfrazado, es un defecto.

**`sensibleA` nunca está vacío y siempre contiene `letra`**, por schema. No existe un ítem de
`US-03` que no muestre letra. Bajo `D-14` el campo dejó de ser un cerrojo y pasó a ser el
mapa: si algún día hay que bajar o cambiar algo, se filtra por ahí en diez segundos.

---

### CTR-04.10 — El schema

La copia corrible está en `src/data/_schema/letra.schema.json` y se escribió en esta misma
tarea, así que hoy no hay desincronización. Si mañana difieren, **manda la copia del archivo
y este documento se corrige**: es al revés que en `CTR-02.5` y es a propósito — allá la copia
se bajó una tarea después y hubo un tramo con dos versiones. Acá nacen juntas, y tener el
bloque duplicado en dos lugares es exactamente lo que produce ese problema.

> **Ojo con el párrafo de arriba entre el 2026-08-27 y `T-144`.** Esa regla —manda la copia
> del archivo— vale cuando los dos están sincronizados, y hoy no lo están: la revisión de
> `T-131` está escrita acá y **el schema todavía es el de v1**, porque `D-12` me impide
> editarlo. En ese tramo manda `CTR-04.13`, que es la especificación del cambio. Cuando
> `T-144` la aplique, vuelve a mandar el archivo y `CTR-04.13` pasa a ser historia.

Lo que hay que saber del bloque sin abrirlo, **una vez aplicado `CTR-04.13`**:

- Draft 2020-12, `$id` `https://ricotaarcade.local/schema/letra/2`, `contratoVersion` en 2.
- `additionalProperties: false` en el ítem y en todos los objetos: un campo inventado no
  entra en silencio.
- **Ocho** ramas `allOf` a nivel ítem: las tres de `BR-03`, la de `rotulo` sin `explicacion`,
  la de `estado: listo` (que ahora exige `cotejo`) y **las tres nuevas de régimen**, una por
  valor de `cotejo.regimen`.
- Diez ramas `allOf` dentro de `tema`: año y pista máxima por disco.
- Dos ramas `allOf` a nivel archivo: `modoRespuesta` decide si se exige `opciones` o
  `variantesAceptadas`.
- Dos `$defs` nuevos: `fuenteDeLetra` y `cotejo`.

> **Enmendado el 2026-09-24 (`T-287`).** Con v3 aplicada: `$id` `…/letra/3`,
> `contratoVersion` en 3, `conteo` obligatorio en el envoltorio, `dificultadSegun` obligatorio
> en el ítem y **nueve** ramas `allOf` a nivel ítem. La novena ata `sin-conteo` a `dificil`.
> El cambio exacto es el bloque `_parche` de `CTR-04.14`, y **manda ese bloque** hasta que
> `T-288` lo aplique, con el mismo criterio que este apartado usó con `CTR-04.13`.
> **Aplicado:** el 2026-09-24 el schema del disco trae las cinco claves del bloque, valor por
> valor (leído, no corrido). Desde ahí vuelve a mandar el archivo y el bloque es historia. Una cosa
> que el schema sigue sin poder ver, y se suma a la lista de abajo: **que el nivel sea el que
> da la regla.** Eso lo mira el test `n1`.

**Lo que el schema NO puede verificar**, y por eso existe `CTR-04.12`:

1. Que los `id` sean únicos dentro del archivo.
2. Que la terna `disco` + `pista` + `titulo` sea una de las 105 de `RES-20`.
3. Que la opción correcta diga lo mismo que `hueco.respuesta`.
4. Que ningún distractor normalice igual que la respuesta.
5. Que los versos digan lo que dice el disco. Eso es `confirmadoDeOido` y lo mira una
   persona con el tema puesto.
6. Que un `RES-NN` citado exista y sea pertinente.
7. Las cuotas del piso de `US-03` y la cota de 8 versos por tema: son propiedades del
   conjunto.
8. **Que las dos entradas de un `dos-fuentes` sean de sitios distintos.** JSON Schema sabe
   pedir que los elementos de un arreglo sean únicos, pero no que un *subcampo* no se repita
   entre ellos: dos entradas del mismo sitio con URL distinta pasarían. Y dos páginas del
   mismo sitio no son dos fuentes independientes — es el régimen entero cobrando algo que no
   hizo. Chequeo 8 de `CTR-04.12`.
9. **Que el host de `url` sea el `sitio` declarado.** Un ítem que dice `cifraclub.com` y
   enlaza a otra parte le muestra al jugador una fuente y lo manda a otra. Chequeo 9.

---

### CTR-04.11 — Ejemplo, con los inventos puestos para que revienten

> El ejemplo canónico de `CTR-02` salió con tres defectos que llegaron hasta `contenido`.
> Acá el tema es real y verificado contra `RES-20`; **el texto de los versos no existe en
> este repo y no lo voy a escribir de memoria**, así que va con `<` y `>`, que el schema
> rechaza. Si alguien copia esto tal cual, el validador falla, que es lo que quiero.

```json
{
  "id": "CL-001",
  "us": ["US-03"],
  "dificultad": "facil",
  "tema": {
    "slug": "todo-un-palo",
    "titulo": "Todo un palo",
    "disco": "un-baion-para-el-ojo-idiota",
    "pista": 8,
    "anio": 1988
  },
  "hueco": {
    "antes": "<lo que va antes del hueco — NO ESCRIBIR DE MEMORIA>",
    "respuesta": "<la palabra que falta>",
    "despues": "<lo que va despues del hueco>"
  },
  "contexto": {
    "antes": ["<verso -2>", "<verso -1>"],
    "despues": ["<verso +1>", "<verso +2>"]
  },
  "opciones": [
    { "texto": "<la misma palabra que hueco.respuesta>", "correcta": true },
    { "texto": "<distractor 1>", "correcta": false },
    { "texto": "<distractor 2>", "correcta": false },
    { "texto": "<distractor 3>", "correcta": false }
  ],
  "fuentes": ["RES-20"],
  "fuenteLetra": [
    {
      "ficha": "RES-49",
      "sitio": "cifraclub.com",
      "url": "https://www.cifraclub.com/los-redonditos-de-ricota/todo-un-palo/",
      "consultado": "2026-08-24"
    }
  ],
  "sensibleA": ["letra"],
  "estado": "borrador"
}
```

**El mismo ítem promovido por la vía nueva** cambia dos cosas y ninguna más — el `estado` y
el `cotejo`:

```json
  "estado": "listo",
  "cotejo": { "regimen": "fuente-unica", "decision": "D-25" }
```

Y por la vía del oído, que sigue existiendo y sigue siendo la preferida:

```json
  "estado": "listo",
  "cotejo": { "regimen": "oido" },
  "confirmadoDeOido": {
    "quien": "<nombre de quien escuchó>",
    "fecha": "2026-08-27",
    "donde": "streaming",
    "minuto": "1:24"
  }
```

**Qué es verdadero acá y con qué ficha.** "Todo un palo" es la pista 8 de *Un baión para el
ojo idiota*, disco del 9 de mayo de 1988 por Del Cielito: lo sostiene `RES-20`, que es la
ficha con los tracklists. `RES-02` da los álbumes pero no los temas, así que **no**
sostendría la pista y citarla sería el error tipo `FIND-10`.

**Qué está marcado como invento y cómo:**

| Valor | Estado real | Cómo está puesto |
|---|---|---|
| Los versos y el hueco | Los hay en `src/data/cancionero.json` desde el ciclo 6, pero **no los escribo de memoria acá**. | Con `<` y `>`, que ningún campo de texto admite. **No valida.** |
| `fuenteLetra` | **Verdadero, copiado del repo.** *Todo un palo* está en `cancionero.json` con `fuente: {cifraclub.com, esa URL, 2026-08-24}`, y `RES-49` es la ficha de cifraclub que usa `FICHA_POR_SITIO`. | Es la forma exacta que va a producir `T-144`. Con una sola entrada, el ítem solo puede llegar a `listo` por el régimen `fuente-unica`. |
| `confirmadoDeOido.quien` del tercer bloque | Nadie escuchó ese verso. | Con `<` y `>`; además `quien` exige arrancar en mayúscula. **No valida.** |
| `spotify` | No tengo el `trackId` y no puedo tenerlo (sin acceso a la web). | **El objeto no está.** Es la forma correcta de no saberlo. |

Un ítem `media` del mismo tema se ve igual con `contexto.antes` y `contexto.despues` de un
verso cada uno; uno `dificil`, con los dos arreglos vacíos.

> **Enmendado el 2026-09-24 (`T-287`).** Desde v3 esa última frase ya no puede darse: los
> ítems de un mismo tema tienen todos el mismo nivel. El ítem suma
> `"dificultadSegun": "en-vivo"` al lado de `dificultad`, y el envoltorio suma el `conteo` de
> `CTR-04.1`. El `facil` del ejemplo **ya no es ilustrativo**, pero tampoco lo afirmo:
> *Todo un palo* figura 32 veces (`RES-90`) y en el pozo de `US-07` es justo el último Fácil
> (`CTR-19.15`, el borde contra *Superlógico*, que figura 29). El pozo de este juego es otro
> (`CTR-04.14`), así que el borde puede correrse. Lo dice `n1`. El ejemplo sigue sin validar
> a propósito, por los `<` y `>` de los versos.
>
> **Y se corrió.** En el banco que regeneró `T-288`, *Todo un palo* es `media` (leído en
> `letra.json` el 2026-09-24). El ejemplo se queda en `facil` porque está para mostrar la
> forma de 2 y 2, no el nivel de ese tema.

---

### CTR-04.12 — Verificación: casos de prueba, cuotas y comandos

**No corro nada** (`D-12`). Lo de abajo lo corre el hilo principal o `revisor`, con Bash.
Hoy no existe `src/data/letra.json`, así que lo único ejecutable en esta ráfaga es el caso 0.

#### Casos de prueba del schema

Cada caso es un archivo mínimo con un ítem. **Veintitrés tienen que fallar y tres validar**,
más el caso 0 que solo parsea; si alguno de los que tienen que fallar pasa, el schema no está
haciendo su trabajo. Los casos **15 a 26 son de v2** y no se pueden correr hasta que `T-144`
aplique `CTR-04.13`.

| # | Qué se arma | Resultado esperado |
|---|---|---|
| 0 | El schema mismo se parsea como JSON | pasa |
| 1 | Ítem completo, `facil`, 2+2 versos, `borrador`, una `fuenteLetra` | **valida** |
| 2 | Igual al 1 pero `estado: "listo"` **sin `cotejo`** | **rechaza** (`CTR-04.6`) |
| 3 | Igual al 2 pero con `cotejo: {"regimen": "oido"}` y `confirmadoDeOido` completo | **valida** |
| 4 | `dificil` con un verso en `contexto.antes` | **rechaza** (`BR-03`) |
| 5 | `facil` con un solo verso en `contexto.antes` | **rechaza** (`BR-03`) |
| 6 | `facil` con 3 versos en `contexto.despues` | **rechaza** (tope de 5 versos por ítem) |
| 7 | `hueco` con `antes` y `despues` vacíos | **rechaza** (el hueco sería el verso entero) |
| 8 | `hueco.respuesta` de cinco palabras | **rechaza** (`BR-03`: palabra o frase corta) |
| 9 | `fuentes: ["RES-02"]`, sin `RES-20` | **rechaza** (cruce de `D-13`) |
| 10 | `tema` sin `pista`, o con `pista: 11` en `un-baion-para-el-ojo-idiota` | **rechaza** |
| 11 | `tema.disco: "oktubre"` con `anio: 1998` | **rechaza** |
| 12 | `sensibleA: []` | **rechaza** |
| 13 | `confirmadoDeOido` con `minuto: "el estribillo"` | **rechaza** (patrón `M:SS`) |
| 14 | `opciones` con 3 elementos, o con dos `correcta: true` | **rechaza** |
| **15** | **Ítem `listo` por fuente única, entero y bien: una `fuenteLetra` completa y `cotejo: {"regimen": "fuente-unica", "decision": "D-25"}`** | **valida** — es el caso que `T-144` tiene que producir |
| 16 | `regimen: "fuente-unica"` sin `decision` | **rechaza** |
| 17 | `regimen: "fuente-unica"` con `decision: "D-14"` | **rechaza** (`const`) |
| 18 | `regimen: "fuente-unica"` **con** `confirmadoDeOido` | **rechaza** (los tres regímenes son excluyentes) |
| 19 | `regimen: "fuente-unica"` con dos entradas en `fuenteLetra` | **rechaza** |
| 20 | `regimen: "oido"` sin `confirmadoDeOido` | **rechaza** |
| 21 | `regimen: "oido"` con `decision: "D-25"` | **rechaza** (`decision` solo va en `fuente-unica`) |
| 22 | `regimen: "dos-fuentes"` con una sola entrada en `fuenteLetra` | **rechaza** |
| 23 | `regimen: "cotejado"` o cualquier valor fuera del enum | **rechaza** |
| 24 | `fuenteLetra: ["RES-49"]` — la forma de v1, strings sueltas | **rechaza** (es el caso que obliga a `contratoVersion: 2`) |
| 25 | Una entrada de `fuenteLetra` sin `url`, o con `url` en `http://`, o con `sitio: "Cifra Club"` | **rechaza** |
| 26 | `estado: "borrador"` con `cotejo: {"regimen": "oido"}` y sin `confirmadoDeOido` | **rechaza** — la coherencia del régimen se exige siempre, no solo en `listo` |

```bash
# (0) el schema parsea. Es lo unico corrible hoy, y verifica T-62.
python -c "import json;json.load(open('src/data/_schema/letra.schema.json',encoding='utf-8'));print('schema OK')"

# (1..14) cada caso, contra el schema. <archivo> es el fixture del caso.
python -c "import json,jsonschema,sys;d=json.load(open(sys.argv[1],encoding='utf-8'));s=json.load(open('src/data/_schema/letra.schema.json',encoding='utf-8'));jsonschema.validate(d,s);print('valida')" <archivo>
```

#### Chequeos sobre el banco, cuando exista

```bash
# (1) schema + ids unicos
python -c "import json,jsonschema;d=json.load(open('src/data/letra.json',encoding='utf-8'));s=json.load(open('src/data/_schema/letra.schema.json',encoding='utf-8'));jsonschema.validate(d,s);i=d['items'];assert len({x['id'] for x in i})==len(i),'id repetido';print('OK',len(i))"

# (2) cuotas de US-03 y BR-01 sobre los items listo: piso 15, minimo 4 faciles
python -c "import json;from collections import Counter;i=[x for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print(len(i),'/15',Counter(x['dificultad'] for x in i),'temas:',len({x['tema']['slug'] for x in i}))"

# (3) el cruce de D-13, terna completa. YA NO necesita `titulos-res-20.json`, y ese pedido
#     de v1 queda cancelado: `src/lib/letra/temas.ts` parsea los 105 desde la ficha misma y
#     expone `resolverTema`, que es la puerta de D-13 hecha funcion (con la tabla ALIAS
#     resolviendo los titulos que la normalizacion no reconcilia). Parsear la ficha es mejor
#     que copiarla: hay una sola verdad y no dos que se desincronizan.
node --experimental-strip-types --input-type=module -e "
import {readFileSync} from 'node:fs';
import {resolverTema} from './src/lib/letra/temas.ts';
const d = JSON.parse(readFileSync('src/data/letra.json','utf-8'));
const mal = d.items.filter((x) => { const t = resolverTema(x.tema.titulo);
  return !t || t.disco !== x.tema.disco || t.pista !== x.tema.pista; }).map((x) => x.id);
console.log('terna fuera de RES-20:', mal.length ? mal.length + ': ' + mal.slice(0,10).join(', ') : 'ninguna');
"

# (4) distractores: la correcta es la respuesta, y ninguna opcion la repite normalizada
python -c "import json,unicodedata as u;n=lambda s:''.join(c for c in u.normalize('NFD',s.lower()) if u.category(c)!='Mn').strip();d=json.load(open('src/data/letra.json',encoding='utf-8'));[print('MAL',x['id']) for x in d['items'] if d['modoRespuesta']=='opciones' and (next(o['texto'] for o in x['opciones'] if o['correcta'])!=x['hueco']['respuesta'] or len({n(o['texto']) for o in x['opciones']})!=4 or any(n(o['texto']) in n(' '.join(x['contexto']['antes']+x['contexto']['despues'])).split() for o in x['opciones'] if not o['correcta']))];print('chequeo 4 corrido')"

# (5) la cota de CTR-04.4: no mas de 8 versos distintos por tema en todo el banco
python -c "import json;from collections import defaultdict;v=defaultdict(set);[v[x['tema']['slug']].update(x['contexto']['antes']+x['contexto']['despues']+[x['hueco']['antes']+x['hueco']['respuesta']+x['hueco']['despues']]) for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items']];print({k:len(s) for k,s in v.items() if len(s)>8} or 'ningun tema pasa de 8')"

# (6) US-03 criterio 2: ningun tema aparece solo en dificil
python -c "import json;i=[x for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items'] if x['estado']=='listo'];f={x['tema']['slug'] for x in i if x['dificultad']!='dificil'};print('temas que solo existen en dificil:',{x['tema']['slug'] for x in i if x['dificultad']=='dificil'}-f or 'ninguno')"

# (7) senal, no piso: por que via esta listo cada item (D-25). Es la medida de cuanto pesa
#     la decision, y la que hay que mirar el dia que se la quiera revertir.
python -c "import json;from collections import Counter;i=[x for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print(Counter(x.get('cotejo',{}).get('regimen','SIN COTEJO') for x in i))"

# (8) v2: 'dos-fuentes' con dos entradas del mismo sitio no son dos fuentes
python -c "import json;i=json.load(open('src/data/letra.json',encoding='utf-8'))['items'];m=[x['id'] for x in i if x.get('cotejo',{}).get('regimen')=='dos-fuentes' and len({f['sitio'] for f in x['fuenteLetra']})<2];print('dos-fuentes falsos:',m or 'ninguno')"

# (9) v2: el enlace que se le muestra al jugador va al sitio que se le nombra
python -c "import json;from urllib.parse import urlparse;i=json.load(open('src/data/letra.json',encoding='utf-8'))['items'];m=[(x['id'],f['url']) for x in i for f in x['fuenteLetra'] if not urlparse(f['url']).hostname.endswith(f['sitio'])];print('url que no es del sitio:',m or 'ninguna')"

# (10) CTR-04.1: el presupuesto se mide sobre lo que viaja, no sobre el archivo
python -c "import json;d=json.load(open('src/data/letra.json',encoding='utf-8'));i=[x for x in d['items'] if x['estado']=='listo'];v=[{k:x[k] for k in ('id','dificultad','tema','hueco','contexto','opciones','fuenteLetra') if k in x} for x in i];kb=len(json.dumps(v,ensure_ascii=False).encode())/1024;print(f'payload {kb:.1f} KB de 150 con {len(i)} items listo')"
```

> **Enmendado el 2026-09-24 (`T-287`). Tres comandos cambian de sentido con v3.** Lo que decían
> queda arriba, sin tocar.
>
> - **(2)** La cuota de 4 Fáciles deja de ser solo una lectura: la afirma el test `n4`
>   (`CTR-04.14`). El comando sigue sirviendo para verla a mano.
> - **(5)** Contaba sobre **todos** los ítems, y con los borradores no mide nada (`CTR-04.4`,
>   enmendado). Se cuenta sobre los `listo`:
>
> ```bash
> # (5) v3: la cota de CTR-04.4 sobre lo que el sitio publica
> python -c "import json;from collections import defaultdict;v=defaultdict(set);[v[x['tema']['slug']].update(x['contexto']['antes']+x['contexto']['despues']+[x['hueco']['antes']+x['hueco']['respuesta']+x['hueco']['despues']]) for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print({k:len(s) for k,s in v.items() if len(s)>8} or 'ningun tema listo pasa de 8')"
> ```
>
> - **(6)** y la consulta 3 de la tabla de abajo **se retiran** (segunda pasada del
>   2026-09-24). Con v3, un tema Difícil tiene solo ítems Difíciles, así que el comando
>   listaría todos los temas Difíciles con ítems `listo`, **por construcción**. `producto`
>   enmendó `US-03` criterio 2 y ya no pide eso (`CTR-04.14`, "El criterio 2, resuelto"). El
>   comando queda escrito arriba, sin correr. Lo que el criterio enmendado sigue pidiendo lo
>   miden otros dos: que la dificultad no baje, `n4`; que el tema sea uno de los 105, el
>   chequeo (3) y `verificarInvariantes`. *Decía: "quedan en suspenso… Vuelve a regir, o se
>   retira, cuando `producto` lo resuelva con el usuario."*

#### Las cuotas del piso, contadas sobre `estado: "listo"`

| # | Consulta | Piso |
|---|---|---|
| 1 | Total de ítems `listo` | ≥ 15 (`US-03`) |
| 2 | Ítems `listo` con `dificultad: "facil"` | ≥ 4 (`US-03`) |
| 3 | ~~Temas con ítem `dificil` que no tienen ningún ítem `facil` o `media`~~ | **[RETIRADA** el 2026-09-24**]** Pedía 0 por `US-03` criterio 2, y el criterio se enmendó (`CTR-04.14`, "El criterio 2, resuelto"). Con v3 da todos los temas Difíciles por construcción. Lo que queda del criterio lo mide `n4` |
| 4 | Temas cuyo conjunto de versos distintos pase de 8 | **0** (`CTR-04.4`) |
| 5 | Ítems `listo` sin `cotejo`, o con un `cotejo` que su evidencia no sostiene | **0** — lo garantiza el schema; el comando lo confirma |
| 6 | Ítems `listo` con `regimen: "fuente-unica"` | **sin piso: es una señal, no una cuota** |
| 7 | Payload serializado en la página | ≤ 150 KB (`CTR-04.1`, chequeo 10) |

**La consulta 6 no tiene número a propósito y es la más importante de las nuevas.** Mide
cuánto del banco descansa en `D-25`. Hoy va a dar el 100% de los `listo`, y está bien: es lo
que el usuario decidió. Sirve para dos cosas — para ver la deuda bajar sola cuando alguien
haga los 26 minutos de escucha, y para saber, el día que llegue una tanda de correcciones,
sobre cuántos ítems hay que volver.

La consulta 3 traduce a número el criterio 2 de `US-03`: *nunca se introduce un tema
completamente nuevo solo en modo difícil*. Si un tema solo existe en `dificil`, la partida se
lo presenta al jugador por primera vez sin título, sin disco y sin un verso alrededor, que es
exactamente lo que el usuario pidió que no pasara en `/kickoff`.

> **Retirada el 2026-09-24.** El párrafo de arriba es la lectura que `producto` corrigió: el
> `/kickoff` habla de letra, no de que los temas se repitan dentro de una partida (`US-03`
> criterio 2, enmendado). Queda escrito para que se vea por qué existió la consulta.

**Chequeo cruzado con la Redondopedia, para cuando existan los artículos `tema`** (`BR-12`,
tope de 5 versos por artículo): sumar los versos de `letra.json` y los de `redondopedia.json`
por tema. No le pongo un piso porque el segundo archivo no es mío; lo dejo anotado para
`revisor`, que es quien mira los dos.

---

### CTR-04.13 — El cambio del schema, especificado para que lo aplique `T-144`

**Yo no lo edito** (`D-12`: los cuatro roles que escriben no corren nada, y `arquitectura` no
escribe código de producción). Lo de abajo es el cambio entero, listo para pegar, sobre
`src/data/_schema/letra.schema.json`. **Cuando esté aplicado, manda el archivo y esta sección
queda como historia** (`CTR-04.10`).

**Los ocho cambios en el schema:**

1. `"contratoVersion": { "const": 1 }` → **`{ "const": 2 }`**.
2. `"$id"` → `https://ricotaarcade.local/schema/letra/2`.
3. **`$defs` nuevo**, `fuenteDeLetra`:

```json
"fuenteDeLetra": {
  "type": "object",
  "additionalProperties": false,
  "required": ["ficha", "sitio", "url", "consultado"],
  "properties": {
    "ficha": { "type": "string", "pattern": "^RES-\\d{2}$" },
    "sitio": { "type": "string", "minLength": 4, "maxLength": 40, "pattern": "^[a-z0-9.-]+\\.[a-z]{2,}$" },
    "url": { "type": "string", "maxLength": 200, "pattern": "^https://[^\\s<>\"]+$" },
    "consultado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" }
  }
}
```

4. **`$defs` nuevo**, `cotejo`:

```json
"cotejo": {
  "type": "object",
  "additionalProperties": false,
  "required": ["regimen"],
  "properties": {
    "regimen": { "enum": ["oido", "dos-fuentes", "fuente-unica"] },
    "decision": { "const": "D-25" }
  },
  "allOf": [
    {
      "if": { "required": ["regimen"], "properties": { "regimen": { "const": "fuente-unica" } } },
      "then": { "required": ["decision"] },
      "else": { "not": { "required": ["decision"] } }
    }
  ]
}
```

5. En `$defs/item/properties`, **`fuenteLetra` cambia de items** (lo demás del campo queda
   igual: `minItems: 1`, `maxItems: 4`, `uniqueItems: true`):

```json
"fuenteLetra": {
  "type": "array",
  "minItems": 1,
  "maxItems": 4,
  "uniqueItems": true,
  "items": { "$ref": "#/$defs/fuenteDeLetra" }
}
```

6. En `$defs/item/properties`, **campo nuevo**: `"cotejo": { "$ref": "#/$defs/cotejo" }`.
7. En `$defs/item/allOf`, **se reemplaza** la rama de `estado: listo` —la del `anyOf` con
   `confirmadoDeOido` / `fuenteLetra` `minItems: 2`— por esta, que solo pide el rastro:

```json
{
  "if": { "required": ["estado"], "properties": { "estado": { "const": "listo" } } },
  "then": { "required": ["cotejo"] }
}
```

8. En `$defs/item/allOf`, **tres ramas nuevas**: cada régimen contra su evidencia. Son las que
   hacen que la declaración no se crea sola.

```json
{
  "if": {
    "required": ["cotejo"],
    "properties": { "cotejo": { "required": ["regimen"], "properties": { "regimen": { "const": "oido" } } } }
  },
  "then": { "required": ["confirmadoDeOido"] }
},
{
  "if": {
    "required": ["cotejo"],
    "properties": { "cotejo": { "required": ["regimen"], "properties": { "regimen": { "const": "dos-fuentes" } } } }
  },
  "then": { "properties": { "fuenteLetra": { "minItems": 2 } } }
},
{
  "if": {
    "required": ["cotejo"],
    "properties": { "cotejo": { "required": ["regimen"], "properties": { "regimen": { "const": "fuente-unica" } } } }
  },
  "then": {
    "properties": { "fuenteLetra": { "maxItems": 1 } },
    "not": { "required": ["confirmadoDeOido"] }
  }
}
```

> El `"required": ["cotejo"]` de cada `if` no es adorno: sin él, `properties` pasa en vacío
> cuando el campo no está y las tres ramas se aplicarían a los ítems sin `cotejo`.

#### 🔴 Y lo que rompe el build si se aplica solo el schema

**`CTR-04.6` v1 está escrita dos veces**: en el schema y en `src/lib/letra/banco.ts`, a
propósito y con el motivo anotado ahí mismo —el schema no lo corría ningún test hasta el
ciclo 7—. Esa copia **corre en build**, así que si `T-144` promueve ítems por la vía nueva sin
tocarla, `npm run build` falla en cada ítem con `esta en 'listo' sin confirmacion de oido y
con una sola ficha de letra`. Los cuatro cambios:

| Archivo | Qué |
|---|---|
| `src/lib/letra/banco.ts` | `ItemCrudo.fuenteLetra` pasa de `readonly string[]` a la interfaz nueva `{ficha, sitio, url, consultado}`; se agrega `cotejo?: {regimen, decision?}`. La invariante de `listo` pasa a exigir `cotejo` y a verificar el régimen contra su evidencia — **misma regla que las ramas 7 y 8**, no una parecida. El chequeo de `fuenteLetra.length === 0` se queda tal cual. |
| `src/lib/letra/banco.ts`, `aPayload` | Suma `fuenteLetra` y `cotejo.regimen` a lo que viaja (`CTR-04.6`, "qué viaja al cliente"). `confirmadoDeOido` y `notaInterna` siguen sin viajar. |
| `src/lib/letra/banco.test.ts` | Los fixtures usan `fuenteLetra: ['pendiente de carga']` y `['RES-23','RES-99']`: pasan a la forma nueva. Y el caso "una ficha y `listo` no valida" cambia de sentido — ahora lo que no valida es **sin `cotejo`**, y hay que sumar el caso de que sí valide con `fuente-unica`. |
| `scripts/generar-letra.mjs` | Escribe `contratoVersion: 2`; arma `fuenteLetra` con `{ficha: FICHA_POR_SITIO[sitio], ...tema.fuente}` —`sitio`, `url` y `consultado` salen tal cual del cancionero—; y promueve con **el régimen más fuerte que la evidencia permita**: `oido` si hay confirmación, si no `dos-fuentes` con dos entradas, si no `fuente-unica` con `decision: "D-25"`. El encabezado del script dice hoy "no marca nada como `listo`": esa frase queda vieja y hay que rescribirla, no borrarla. |

**Va todo en la misma corrida.** El schema, el generador y `letra.json` regenerado son un solo
cambio: `src/lib/esquemas.test.ts` valida `letra.json` contra `letra.schema.json` en cada
`npm test`, así que un schema en v2 con datos en v1 pinta el build de rojo, y al revés
también.

**Cómo se verifica que esto quedó bien**, y es lo que `revisor` mira en `T-146`:

```bash
npm run generar-letra && npm test && npm run build
# y despues, los tres que cuentan la historia de D-25:
#   chequeo (2) — el piso de US-03: >= 15 listo
#   chequeo (7) — por que via esta listo cada uno
#   chequeo (9) — el enlace que ve el jugador va al sitio que se le nombra
```

---

### CTR-04.14 — La dificultad sale del conteo en vivo — *nuevo, 2026-09-24, `T-287`*

**La decisión en una línea.** El nivel de cada ítem es el de su **tema**. Lo da
`repartirEnTercios()` (`src/lib/en-vivo.ts`, `CTR-19.15`) sobre los temas del banco, con el
conteo citado de `src/data/setlistfm.json`. Lo escribe `scripts/generar-letra.mjs`, y junto con
el nivel escribe el contexto que ese nivel pide por `BR-03`. Nadie lo elige.

Es la regla de `US-07` sin cambiarle nada (`BR-30`: *"no es una tercera fórmula"*). La misma
función, el mismo borde (un empate baja entero), el mismo *"sin conteo es difícil"*. Lo único
propio de este juego es el pozo, y que el nivel arrastra el contexto.

#### Qué deja de decidir una persona, dicho con precisión

La tarea preguntaba qué campo deja de escribirse a mano. **Ninguno, porque ninguno se
escribía a mano.** Lo que cambia es otra cosa:

- **Hoy `dificultad` la escribe el generador según dónde cae el verso.** Con dos versos antes
  y dos después **dentro de su estrofa**, `facil`. Con uno y uno, `media`. Si no, `dificil`
  (`generar-letra.mjs`, el bloque que empieza en *"BR-03: el contexto lo fija el nivel"*,
  leído el 2026-09-24). *"Estoy hasta la pasta!"* (`CL-1326`) es `dificil` porque no tiene un
  verso antes en su estrofa, no porque sea difícil.
- **Lo que decide `contenido` es qué verso se promueve** (`letra-confirmaciones.json`,
  `fuenteUnica.items`). Al elegir el verso elegía de rebote el nivel. **Eso es lo que se
  pierde:** desde v3 el nivel es del tema, y elegir un verso ya no lo mueve.
- **`letra-confirmaciones.json` no gana ningún campo de nivel.** Es lo único del circuito que
  se escribe a mano, y nunca tuvo uno.

  > **Enmendado en la segunda pasada del 2026-09-24.** Decía *"no cambia de forma"*, y sí
  > cambió en una cosa: `T-288` le sumó **`fuenteUnica.enEspera`**. Es la lista de las anclas
  > que dejaron de dar ítem por falta de vecinos (paso 8). No tiene nada de nivel, así que la
  > decisión de arriba sigue en pie. Cada entrada es `{verso, motivo, idAnterior, espera}`:
  > el ancla, el motivo de `contenido` tal cual, el id que tenía y por qué quedó apartada. El
  > generador no la promueve. La lista en cada corrida, y avisa si alguna vuelve a dar ítem.
  > Hoy tiene dos: *"Con sus muecas rotas [cromadas]"* y *"Que los buenos [volvieron]"*. **La
  > acepto como parte del circuito.** Borrar el ancla perdía la elección de `contenido`, y
  > dejarla en `items` dejaba el banco en v2, porque el generador aborta. Apartarla conserva
  > las dos cosas.

`BR-30` describe el "hoy" de este juego como *"Manual: `contenido` etiqueta cada hueco"*, y el
código no hace eso. Se lo paso a `producto` en
`Docs/SUGERENCIAS/ARQ-para-producto-la-letra-con-el-conteo.md`. No cambia la decisión. Sí
cambia la premisa de *"ningún ítem pierde hoy una etiqueta que ya tenía escrita a mano"*,
porque no había ninguna.

#### Dónde se calcula cada cosa

| Qué | Dónde | Por qué ahí |
|---|---|---|
| `dificultad` y `dificultadSegun` | el generador | El ítem guarda los versos que muestra (`CTR-04.7`), y cuántos depende del nivel. El nivel tiene que estar fijo cuando se escribe el archivo. |
| `contexto` | el generador | Por lo mismo. |
| `conteo` del envoltorio | el generador | Es el sello del conteo con el que se calculó. |
| que el banco sea el que da la regla | el test `n1`, en `npm test` | El mismo lugar que `t14` de `US-07` (`CTR-19.13`). |
| que el contexto tenga exactamente lo que pide el nivel | el schema, y `verificarInvariantes` en build | Ya estaba. `verificarInvariantes` pasa de tope a exacto. |
| algo nuevo en build | **nada** | La página no importa el conteo: recibe el nivel ya escrito, igual que `US-07`. |

#### El pozo: los temas del archivo, borradores incluidos

**El pozo son los temas de todos los ítems de `letra.json` que no están `retirado`.** Es lo
que dice `BR-30` al pie de la letra (*"los temas de los que salen los huecos ya cargados en
`letra.json`"*), y es la forma que ya usa `US-07`: el pozo son los slugs del banco. Hoy son
unos 80 temas, los que tienen letra de un sitio con ficha (la descripción de `id` en el
schema). Los 21 `listo` salen de 11 de ellos.

**El invariante, que es lo que mira el test:** los niveles se calculan sobre **exactamente**
el conjunto de temas que quedan en el archivo. Hay una trampa y la tiene que evitar el
generador: el nivel decide el contexto, y el contexto decide si un verso da ítem. Un tema
Fácil podría quedarse sin ítems y salir del pozo que lo hizo Fácil. El paso 6 de abajo lo
resuelve.

#### El contexto: los vecinos del verso en el tema

La regla quedó escrita en `CTR-04.7` (enmendado). Sus tres consecuencias:

- **Un verso sin N vecinos de un lado no da ítem.** En un tema Fácil quedan afuera los dos
  primeros versos y los dos últimos. En uno Medio, el primero y el último. En uno Difícil
  entran todos.
- **Un verso que ya tenía 2 y 2 dentro de su estrofa tiene los mismos 2 y 2**, porque los
  vecinos en la estrofa son los vecinos en el tema. El contexto solo cambia donde antes lo
  cortaba el borde de la estrofa.
- **El verso repetido, el del estribillo, se deduplica después de mirar el contexto, no
  antes.** Así la huella queda en la primera aparición que puede llevar el contexto de su
  nivel. Hoy se deduplica antes. Con el nivel por tema, eso perdería el estribillo que abre la
  canción aunque vuelva más abajo con sus vecinos completos.

#### Lo que cambia en `scripts/generar-letra.mjs`, en orden

1. **Lee `src/data/setlistfm.json` y toma su bloque `conteo`.** Si falta el archivo o el
   bloque, **aborta** con un mensaje claro, igual que `CTR-09.7` paso 1. El conteo está
   commiteado, y que falte es un repo roto, no un dato que todavía no llegó.
2. **Primera pasada: los huecos, sin nivel y sin contexto.** Es el recorrido de hoy hasta el
   verso pelado: `elegirPalabra`, los largos de `antes`, `respuesta` y `despues`, y el
   descarte del verso pelado. La lista de versos del tema es la de hoy (`sirveComoVerso`,
   `motivoDescarteVerso`, `sinEtiquetaFinal`), pero **aplanada**: una lista por tema, no una
   por estrofa. Esa función se muda a `src/lib/letra/` y se exporta, porque el test `n3` la
   usa. Si el test la copiara, la copia mentiría en la próxima versión del filtro (`FIND-75`).
3. **El pozo son los temas con al menos un hueco.** Recién ahí se llama a
   `repartirEnTercios(pozo, conteo)`.
4. **Segunda pasada: el nivel y lo que depende de él.** Para cada hueco, N es
   `CONTEXTO_POR_NIVEL[nivel del tema]`, **importado de `src/lib/letra/banco.ts`**. El
   generador no escribe 2, 1 y 0 por su cuenta: la tabla de `BR-03` vive en un solo lugar. Si
   el verso no tiene N vecinos de cada lado, no da ítem. Siguen después los descartes de hoy
   que dependen del contexto: un verso de contexto de más de 90 caracteres, y menos de 3
   distractores (los distractores excluyen lo que está a la vista, y lo que está a la vista
   depende del contexto).
5. **Deduplica por huella** (`tema|antes|respuesta|despues`), con el paso 4 ya hecho.
6. **Si un tema del pozo se quedó sin ítems, lo saca del pozo y vuelve al paso 3.** Repite
   hasta que el pozo no cambie. Como el pozo solo achica, termina. Al terminar vale el
   invariante: los niveles son los de `repartirEnTercios` sobre los temas que quedaron. Es un
   caso raro, un tema con huecos pero sin ninguno que lleve el contexto de su nivel. Pero sin
   este paso `n1` se pondría en rojo después de una corrida limpia, y nadie entendería por qué.
   Los ids se numeran sobre la lista final, como hoy.
7. **Escribe** en cada ítem `dificultad` (lo que da `porSlug`) y `dificultadSegun`
   (`sin-conteo` si el tema está en `sinConteo`; si no, `en-vivo`). En el envoltorio escribe
   `contratoVersion: 3` y `conteo: { ficha, consultado }`, copiados del bloque que leyó.
8. **Las anclas de `fuenteUnica` y de `confirmados` siguen igual:** son del verso, no del
   nivel. Los ids se van a correr, porque hay versos que dejan de dar ítem y el deduplicado
   cambió de lugar. Por eso la primera corrida va con `--reanclar`. **Se suma un caso con
   mensaje propio:** un verso anclado que sigue en el cancionero pero no da ítem porque le
   faltan vecinos para su nivel. El mensaje nombra el tema, el nivel y cuántos vecinos
   faltan, y **aborta**, como ya aborta un ancla perdida. No es lo mismo que *"se corrieron los
   ids"*, y decirlo igual manda a `contenido` a buscar en el lugar equivocado. Reemplazar ese
   verso es de `contenido`. **Mientras tanto el ancla va a `fuenteUnica.enEspera`**, no se
   borra. Lo agregó `T-288` y está descripto arriba, en *"Qué deja de decidir una persona"*.
9. **En el log imprime**, además de lo de hoy: cuántos ítems hay en cada nivel, en total y en
   `listo`; la lista `sinConteo` con sus títulos; la ficha y la fecha del conteo; los Fáciles
   `listo` contra la cuota de 4; **los `listo` que cambiaron de nivel respecto del archivo
   anterior**, cruzados por tema y verso (el slug y la huella de `renglon`) y no por id, con el nivel viejo y el
   nuevo; y los temas `listo` que pasan de 8 versos distintos (`CTR-04.4`). Nada de esto
   aborta: la cuota y la cota son de `producto` y de `contenido`.
10. **Pone los comentarios al día.** El de *"BR-03: el contexto lo fija el nivel, no lo elige
    quien carga"* sigue siendo cierto, pero hoy lo explica la posición del verso y tiene que
    explicarlo el tema. El encabezado del script dice quién decide qué pasa a `listo`, pero
    no de dónde sale el nivel, y tiene que sumarlo.

**Fuera del generador, en `src/lib/letra/banco.ts`:** `ItemCrudo` suma
`dificultadSegun: 'en-vivo' | 'sin-conteo'` y `BancoCrudo` suma `conteo`. `aPayload` **no** los
manda al cliente: son de generación, igual que en `US-07` (`adivinar-por-la-letra.astro`).
`verificarInvariantes` pasa de `versos.length > esperado` a `versos.length !== esperado`, con
el mensaje *"BR-03 pide exactamente N"*. **Hoy un Fácil con un verso de cada lado pasa el build
y no pasa el schema.** Con el acople de `BR-30` (*"no hay forma de que un ítem Fácil muestre
menos de 2+2 versos"*), esa diferencia deja de ser tolerable.

#### Qué valida el test

Van en `src/lib/letra/banco.test.ts` y no en `esquemas.test.ts`, por lo mismo que en
`CTR-09.11` (enmendado por `T-291`): el otro archivo lo toca otra tarea en cada ráfaga.
**Cada regla va con su caso en rojo al lado.**

| # | Qué afirma | En rojo con |
|---|---|---|
| `n1` | **El banco es el que da la regla.** El `conteo` del envoltorio es el `{ficha, consultado}` de `setlistfm.json`. El pozo son los slugs de los ítems que no están `retirado`. Cada uno de esos ítems tiene `dificultad === repartirEnTercios(pozo, conteo).porSlug.get(slug)`, y `dificultadSegun` es `sin-conteo` si el tema está en `sinConteo` o `en-vivo` si no. El mensaje termina en *"Corré `npm run generar-letra`"*. | (a) un conteo con otra ficha o fecha; (b) un nivel tocado a mano en un solo ítem, que tiene que dar **un** problema y nombrar ese ítem; (c) un conteo sin la línea de un tema Fácil: ese tema pasa a `dificil` y a `sin-conteo` |
| `n2` | **El contexto sigue al nivel, exacto.** `verificarInvariantes` rechaza un Fácil con 1 y 1, y un Medio con 0 y 1. | Los dos casos. **El test que hoy afirma lo contrario se da vuelta:** *"BR-03: el contexto no puede pasarse…"* hoy espera que `facilConDos` (1 y 1) **no** tire error, y pasa a esperar que lo tire |
| `n3` | **El contexto son los vecinos del verso en su tema.** Para cada `listo` que no es `dificil`, reconstruye la lista de versos del tema con la **misma función exportada** que usa el generador (paso 2). Busca una posición donde los N anteriores sean `contexto.antes`, el siguiente sea el verso del hueco y los N posteriores sean `contexto.despues`. El verso del hueco se compara sin espacios, porque la puntuación que colgaba de la respuesta pasó a `despues`. | un `listo` con un verso de contexto cambiado por otro del mismo tema |
| `n4` | **`BR-01` con el banco real.** Hay al menos 4 `listo` en `facil` (la cuota de `US-03`), y `armarRonda()` sobre `cargarBanco()` abre en Fácil y no baja de nivel, con varias semillas. Si faltan Fáciles, el mensaje dice que es trabajo de `contenido`: cargar huecos de temas del tercio de arriba (`BR-30`). | un banco sin ningún Fácil `listo`: `armarRonda` tira `RondaImposible` |
| `c0`..`c9` | **El schema v3**, con los diez casos del comando de abajo y sus dos controles (`c1`, `c3`). | los ocho que tienen que rechazar |

Y dos tests que ya existen cambian: *"US-03: el banco real cumple su piso"* pasa a esperar
`contratoVersion` 3, y el de `BR-03` que nombra la fila `n2`.

*Sobre `n4`:* `CTR-09.8` no quiso los pisos de `US-07` en el schema, pero el `banco.test.ts` de
`US-07` sí los afirma, y el de este juego ya afirma el piso de 15. Afirmar la cuota de 4 es lo
mismo. Si se pone en rojo, el banco no está roto, está incompleto, y el mensaje lo dice.

#### Lectura indicativa de lo que va a dar

**No es una medición.** Es lo que sale de tomar prestados los bordes de `US-07` (`CTR-19.15`:
Fácil desde 32 veces, Media desde 9) y aplicarlos a los 11 temas de los 21 `listo`, con los
números de `RES-90`. El pozo de este juego es otro: no tiene los temas de lacuerda.net, y puede
tener temas que en `US-07` no llegan a 8 versos limpios. Los bordes se van a correr. El número
de verdad lo dan el generador y `n1`.

| Tema | Veces (`RES-90`) | Ítems `listo` | Nivel hoy (por posición) | Nivel indicativo |
|---|---|---|---|---|
| *Jijiji* | 101 | `CL-116`, `CL-118` | facil, facil | facil |
| *Música para pastillas* | 41 | `CL-093`, `CL-096` | dificil, media | facil |
| *Nuestro amo juega al esclavo* | 39 | `CL-383`, `CL-390` | media, facil | facil |
| *Criminal Mambo* | 37 | `CL-079` | facil | facil |
| *Un ángel para tu soledad* | 36 | `CL-634`, `CL-635` | facil, facil | facil |
| *Un poco de amor francés* | 36 | `CL-408`, `CL-418` | facil, facil | facil |
| *Vencedores vencidos* | 34 | `CL-210`, `CL-211` | facil, facil | facil |
| *Superlógico* | 29 | `CL-042`, `CL-047` | facil, facil | media |
| *Blues de la artillería* | 12 | `CL-446`, `CL-447` | facil, facil | media |
| *Dr. Saturno* | 3 | `CL-1326`, `CL-1330` | dificil, facil | dificil |
| *Es hora de levantarse querido* | 3 | `CL-808`, `CL-812` | facil, facil | dificil |

Pasaría de 17 / 2 / 2 a **13 / 4 / 4**, y la cuota de 4 Fáciles quedaría cumplida con margen.
**Diez de los 21 cambian de nivel.** Tres ganan contexto (`CL-093`, `CL-096`, `CL-383`) y
siete lo pierden: cuatro pasan de Fácil a Media y tres de Fácil a Difícil. `CL-093` se
promovió con el motivo *"Dificultad dificil, sin contexto mostrado"*, y ahora mostraría dos
versos de cada lado. Ese es el tipo de cambio que el paso 9 pone a la vista para `contenido`.

> **Lo que dio de verdad (`T-288`, 2026-09-24).** Los once temas quedaron en el nivel que
> decía la columna indicativa. Lo que se desvió fue la lista de ítems, no los bordes:
>
> - **19 `listo`, no 21: 11 Fáciles, 4 Medios, 4 Difíciles.** Lo conté ítem por ítem en
>   `letra.json`. Las dos anclas que faltan son `CL-383` y `CL-096`. Sus temas quedaron
>   Fáciles y a esos versos les falta un vecino: uno es el segundo verso del tema y el otro,
>   el anteúltimo. Están en `fuenteUnica.enEspera`. Los 19 siguen arriba del piso de 15 y de
>   la cuota de 4 Fáciles.
> - **Cambiaron de nivel 8 `listo`, no 10**, según el traspaso del hilo principal
>   (`HILO-para-contenido-dos-anclas-sin-vecinos.md`): los dos de las anclas apartadas no
>   cuentan.
> - **Dos temas `listo` pasan la cota de 8 versos**: *Jijiji* y *Un poco de amor francés*,
>   con 9 cada uno. Es el caso que anticipó `CTR-04.4` (enmendado), ya traspasado a
>   `contenido`.
> - ***La bestia pop* salió del pozo.** Figura 57 veces (`setlistfm.json`), pero en el
>   cancionero tiene **un solo** verso que pasa el filtro. Como tema Fácil, ese verso no
>   tiene vecinos, así que no da ítem y el paso 6 lo saca. En v2 ese verso daba, a lo sumo,
>   un ítem Difícil: no miré si estaba en el banco anterior. Ver "Consecuencias".

#### El criterio 2, resuelto

> **Reescrito en la segunda pasada del 2026-09-24.** Este apartado se llamaba *"La
> contradicción con el criterio 2"* y la dejaba abierta. `producto` la resolvió el mismo día
> (`Docs/SUGERENCIAS/PRD-para-arquitectura-us-03-criterio-2-resuelto.md`): adoptó la opción
> A. **La precisión de `D-46` manda, y `US-03` criterio 2 quedó enmendado** en
> `PRD-alcance-v1.md`, con la redacción vieja al pie.
>
> **Qué queda del criterio, y quién lo mide.** El criterio enmendado pide tres cosas. Que en
> un Difícil se vea solo el verso con el hueco: lo miden el schema y `verificarInvariantes`
> (en `banco.test.ts`, el test *"BR-03: el contexto no puede pasarse…"*). Que el tema sea
> uno real de los 105: lo miden `fuentes` con `RES-20` y el chequeo
> (3). Que la dificultad no baje dentro de la partida, que es el mitigante que eligió
> `producto`: lo mide `n4` con quinientas partidas. **Un tema nuevo en Difícil ya no es una
> falla, es lo esperado.** Por eso la consulta 3 y el comando (6) de `CTR-04.12` se retiran.
> No se reemplazan.
>
> **Lo que no es mío y sigue abierto:** `Docs/BRIEF.md` todavía dice *"no cambiando de
> tema"* sin la lectura nueva. `producto` lo anotó en su `PENDIENTE`. Le toca a quien
> actualice el brief.
>
> Lo que sigue es el texto de la primera pasada, sin tocar, para que se vea de dónde salió
> la pregunta.

`US-03` criterio 2 dice: *"nunca se introduce un tema completamente nuevo solo en modo
difícil; la dificultad escala mostrando menos letra del mismo universo de temas de la
partida, no cambiando de tema (pedido explícito del usuario en `/kickoff`)"*. `Docs/BRIEF.md`
lo dice igual: *"La dificultad escala mostrando menos letra, no cambiando de tema"*.

**Con el nivel por tema, eso no puede cumplirse.** Un tema Difícil solo tiene ítems
Difíciles, así que la partida lo presenta por primera vez sin título, sin disco y sin un verso
alrededor. Y la dificultad escala cambiando de tema, de los más tocados a los menos tocados.
En la tabla de arriba, *Dr. Saturno* y *Es hora de levantarse querido* hoy cumplen el criterio
porque tienen un ítem Fácil al lado. Con v3 dejan de cumplirlo.

**No lo decido yo, y tampoco lo tapo.** Las dos cosas las pidió el usuario. La precisión de
`D-46` es la más nueva y la más explícita, así que el contrato sigue a `BR-30`. Pero `T-286`,
al citar el brief para defender el acople, cortó la frase justo antes de *"no cambiando de
tema"*, y la contradicción quedó sin ver. La resuelve `producto` con el usuario. El traspaso
está en `Docs/SUGERENCIAS/ARQ-para-producto-la-letra-con-el-conteo.md`.

**No frena `T-288`**, porque se resuelva como se resuelva, la forma del dato no cambia. Si el
usuario confirma que la precisión reemplaza al *"no cambiando de tema"*, se enmienda el
criterio 2 y se retira la consulta 3. Si pide conservarlo, eso es una regla de la ronda, no
del banco: que un Difícil solo entre si su tema ya apareció, por ejemplo. Con el nivel por tema
esa regla no tendría con qué cumplirse, y habría que decidir otra cosa. Mientras tanto la
consulta 3 queda **en suspenso**, marcada en `CTR-04.12`.

#### El schema de v2 a v3: el bloque para pegar

**Por qué `contratoVersion` sube a 3:** un banco v2 no tiene `conteo` ni `dificultadSegun`, y
tiene que no validar. Así nadie deja un banco con niveles por posición creyendo que ya sale del
conteo. Es lo mismo que hizo `CTR-09` al pasar de 1 a 2.

Cada clave es una ruta dentro de `src/data/_schema/letra.schema.json`. Si termina en `+`, el
valor se agrega al final del arreglo que ya está ahí. Si no, reemplaza lo que haya. Lo que no
está nombrado no cambia. `T-288` lo pega a mano. El comando de verificación lo lee de acá
mismo, así que hay una sola copia.

```json
{
  "_parche": "CTR-04.14",
  "_como": "Rutas separadas por barra dentro de letra.schema.json. Con + al final se agrega al arreglo; sin + se reemplaza. Las claves que empiezan con guion bajo no se aplican.",
  "$id": "https://ricotaarcade.local/schema/letra/3",
  "properties/contratoVersion": { "const": 3 },
  "required+": ["conteo"],
  "properties/conteo": {
    "description": "CTR-04.14. Con que conteo citado se calcularon los niveles: la ficha y la fecha del bloque conteo de src/data/setlistfm.json. El test n1 los compara con ese archivo: si el conteo se refresco y el banco no, el banco quedo viejo. El numero de cada tema no se copia aca.",
    "type": "object",
    "additionalProperties": false,
    "required": ["ficha", "consultado"],
    "properties": {
      "ficha": { "type": "string", "pattern": "^RES-\\d{2,3}$" },
      "consultado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" }
    }
  },
  "$defs/item/required+": ["dificultadSegun"],
  "$defs/item/properties/dificultad": {
    "description": "CTR-04.14 (D-46, BR-30). El nivel del tema: tercios del conteo citado sobre los temas de este banco (repartirEnTercios, CTR-19.15). Lo escribe el generador. Manda el largo del contexto (BR-03, las tres ramas del allOf).",
    "enum": ["facil", "media", "dificil"]
  },
  "$defs/item/properties/dificultadSegun": {
    "description": "CTR-04.14. en-vivo = el nivel salio de los tercios del conteo. sin-conteo = el tema no tiene linea en el conteo y D-27 lo pone en dificil. Nadie lo escribe a mano.",
    "enum": ["en-vivo", "sin-conteo"]
  },
  "$defs/item/allOf+": [
    {
      "if": { "required": ["dificultadSegun"], "properties": { "dificultadSegun": { "const": "sin-conteo" } } },
      "then": { "properties": { "dificultad": { "const": "dificil" } } }
    }
  ]
}
```

> El `"required": ["dificultadSegun"]` del `if` no es adorno: sin él, `properties` pasa en
> vacío cuando el campo falta. Es la misma nota de `CTR-04.13`, punto 8.

**Cómo se verifica que el bloque valida con ajv**, antes y después de `T-288`. Va en bash,
porque Windows PowerShell 5.1 no escapa las comillas dobles de un argumento que le pasa a un
programa nativo. El comando lee el bloque de este archivo y lo aplica en memoria sobre el
schema del disco; si el schema ya está en v3, no lo aplica y prueba el del disco. Después corre
diez casos sobre `letra.json`:

```bash
node -e '
const fs=require("fs"),A=require("ajv/dist/2020"),Ajv=A.default||A,F="`".repeat(3);
const md=fs.readFileSync("Docs/ARQ/ARQ-schema-completar-letra.md","utf8");
const i=md.search(/\{\s*"_parche": "CTR-04\.14"/);
const parche=JSON.parse(md.slice(i,md.indexOf(F,i)));
const s=JSON.parse(fs.readFileSync("src/data/_schema/letra.schema.json","utf8"));
if(s.properties.contratoVersion.const!==3){for(const [k,v] of Object.entries(parche)){if(k.startsWith("_"))continue;const mas=k.endsWith("+"),r=(mas?k.slice(0,-1):k).split("/"),u=r.pop();let o=s;for(const x of r)o=o[x];o[u]=mas?[...o[u],...v]:v;}}
const val=new Ajv({allErrors:true,strict:false}).compile(s);
const hoy=JSON.parse(fs.readFileSync("src/data/letra.json","utf8"));
const v2=()=>{const b=structuredClone(hoy);b.contratoVersion=2;delete b.conteo;for(const it of b.items)delete it.dificultadSegun;return b;};
const v3=()=>{const b=structuredClone(hoy);b.contratoVersion=3;b.conteo={ficha:"RES-90",consultado:"2026-09-24"};for(const it of b.items)it.dificultadSegun??="en-vivo";return b;};
const de=(b,n)=>b.items.find(x=>x.dificultad===n);
const casos=[
["c0 un banco v2, sin conteo ni dificultadSegun",v2,false],
["c1 control: el mismo banco en v3",v3,true],
["c2 sin-conteo con facil",()=>{const b=v3();de(b,"facil").dificultadSegun="sin-conteo";return b;},false],
["c3 control: sin-conteo con dificil",()=>{const b=v3();de(b,"dificil").dificultadSegun="sin-conteo";return b;},true],
["c4 v3 sin conteo",()=>{const b=v3();delete b.conteo;return b;},false],
["c5 conteo.ficha sin la forma RES-",()=>{const b=v3();b.conteo.ficha="90";return b;},false],
["c6 un item sin dificultadSegun",()=>{const b=v3();delete b.items[0].dificultadSegun;return b;},false],
["c7 dificultadSegun curaduria",()=>{const b=v3();b.items[0].dificultadSegun="curaduria";return b;},false],
["c8 contratoVersion 2 con todo lo demas de v3",()=>{const b=v3();b.contratoVersion=2;return b;},false],
["c9 facil con un verso de contexto de cada lado",()=>{const b=v3(),f=de(b,"facil");f.contexto={antes:f.contexto.antes.slice(-1),despues:f.contexto.despues.slice(0,1)};return b;},false]];
let mal=0;for(const [n,f,se] of casos){const ok=val(f());if(ok!==se)mal++;console.log((ok===se?"OK  ":"MAL ")+n+" -> "+(ok?"valida":"rechaza"));}
console.log(mal?mal+" caso(s) no dan lo esperado":"los 10 casos dan lo esperado");process.exit(mal?1:0);'
```

Lo esperado: los diez con `OK`, y la última línea *"los 10 casos dan lo esperado"*. **`c2`,
`c4` y `c6` son las tres reglas que esta enmienda existe para hacer cumplir.** Si alguna
valida, el bloque no sirve. `c9` no es nuevo: es el acople de `BR-30`, que el schema ya hacía
cumplir, y está para que nadie lo afloje de paso. *No lo corrí (`D-12`). Lo corre `revisor` o
el hilo principal.*

#### Alternativas descartadas

1. **Que el pozo sean solo los temas con ítems `listo`.** Es la lectura más tentadora, porque
   reparte en tercios lo que de verdad se juega y casi garantiza la cuota de 4 Fáciles.
   Descartada por tres motivos. Con 11 temas los tercios son de 4, y "Fácil" pasa a querer
   decir "de los 4 más tocados entre los que eligió `contenido`", que no dice nada del tema.
   Cada promoción movería el nivel **de los otros temas**, y con el nivel su contexto: un ítem
   curado cambiaría lo que muestra sin que nadie lo toque. Y `BR-30` dice *"ya cargados en
   `letra.json`"*, no *"jugables"*.
2. **Un solo pozo para los dos juegos de letra, el de `US-07`.** Así el mismo tema tendría el
   mismo nivel en los dos juegos. Descartada: ese pozo trae temas de lacuerda.net que este
   juego no puede usar (no tienen ficha, `CTR-04.6`) y deja afuera temas que no llegan a 8
   versos limpios. Regenerar un banco obligaría a regenerar el otro, y `BR-30` pide el pozo de
   cada juego. El costo que se acepta: un tema puede ser Fácil en un juego y Medio en el otro,
   como ya pasa entre `US-02` y `US-07`.
3. **Calcular el nivel en build, como `US-02`, y sacarlo del banco.** Descartada: el contexto
   se guarda en el ítem (`CTR-04.7`) y depende del nivel. Calcular el nivel en build obligaría
   a cortar también los versos en build, desde el cancionero. El archivo dejaría de ser lo que
   ve el jugador, y las anclas de `contenido` apuntarían a ítems cuyo texto se decide en otro
   lado. `US-02` puede hacerlo porque su manifiesto es una lista de archivos, y un archivo no
   tiene nivel (`CTR-03.11`).
4. **Tomar el contexto dentro de la estrofa, como hoy.** Descartada porque deja sin ítems a
   los temas Fáciles: en una estrofa de 4 versos ninguno tiene 2 y 2, y en una de 5, uno solo.
   Justo los temas más tocados, donde `BR-30` manda a `contenido` a cargar más si falta la
   cuota, serían los que menos ítems dan.
5. **Bajar de nivel el verso que no tiene sus vecinos.** Evita descartar. Descartada porque
   el nivel volvería a salir de la posición del verso, que es lo que la precisión de `D-46`
   vino a reemplazar.
6. **Sin `dificultadSegun`: solo `conteo` en el envoltorio.** Descartada por lo mismo que en
   `CTR-09.7`: `dificil` dice dos cosas distintas, *"tercio de abajo"* o *"sin conteo"*, y si
   una pantalla muestra el nivel, el rótulo tiene que decir cuál de las dos.
7. **Probar solo el largo del contexto, sin `n3`.** Es más barato, porque no obliga a mudar
   la lista de versos a `src/lib/letra/`. Descartada: esta enmienda cambia qué versos rodean
   al hueco, y un cambio de regla que ningún test ve es `FIND-75` otra vez.

#### Consecuencias

- **Fácil:** que el primer ítem de toda partida sea de un tema muy tocado, con dos versos de
  cada lado, título y disco. Es el argumento 3 de `T-286`, y ahora lo sostiene la forma del
  dato.
- **Fácil:** saber por qué un ítem tiene su nivel. Es el de su tema, por su línea en
  `RES-90`.
- **Difícil, y aceptado por `BR-30`:** que `contenido` elija el nivel de un verso. Se pierde.
- **Cada refresco del conteo** (180 días, `CTR-19.6`) puede pasar un tema de franja, y con eso
  cambian el contexto de sus ítems `listo` y los ids. `n1` se pone en rojo hasta que alguien
  corra `npm run generar-letra -- --reanclar`, y el paso 9 dice qué `listo` cambiaron.
- **La cota de 8 versos por tema** (`CTR-04.4`) pierde la salida de *"que el segundo sea
  media"*. Dos Fáciles del mismo tema tienen que solaparse.
- **El archivo crece:** un tercio de los temas pasa a guardar 4 versos de contexto por ítem.
  `CTR-04.1` no le pone techo al archivo, y lo que viaja sube unos cientos de bytes por cada
  Fácil `listo`, contra un techo de 150 KB.
- ~~🔴 `US-03` criterio 2 no puede cumplirse hasta que lo resuelvan `producto` y el usuario~~
  **Resuelto el 2026-09-24:** `producto` enmendó el criterio (arriba, *"El criterio 2,
  resuelto"*). **Difícil, y aceptado:** la dificultad sube también cambiando de tema, de los
  más tocados a los menos tocados. Un tema del tercio de abajo aparece por primera vez sin
  título, sin disco y sin versos alrededor, y siempre tarde en la partida (`BR-01` punto 2).
- **Difícil, y recién visto al correr el generador: un tema muy tocado con pocos versos
  limpios sale del juego.** Un tema Fácil necesita al menos cinco versos que pasen el
  filtro, porque cada ítem lleva dos de cada lado. Si no los tiene, no da ítems y el paso 6
  lo saca del pozo. Hoy le pasa a *La bestia pop*. No se arregla aflojando el contrato:
  bajar de nivel el verso es la alternativa 5, descartada. Se arregla en el dato, limpiando
  o retranscribiendo la letra en el cancionero. Ese trabajo es de `contenido` y lo anotó el
  hilo principal en su traspaso. Si vuelve a entrar, lo hace solo en la próxima corrida.

#### Lo que toca `T-288` por este apartado

`scripts/generar-letra.mjs` (los 10 pasos); `src/lib/letra/banco.ts` (los tipos y
`verificarInvariantes` exacto); un módulo de `src/lib/letra/`, nuevo o existente, con la lista
de versos del tema exportada; `src/lib/letra/banco.test.ts` (`n1`..`n4`, `c0`..`c9` y los dos
tests que cambian); `src/data/_schema/letra.schema.json` (el bloque `_parche`); y
`src/data/letra.json`, regenerado. **Va todo en la misma corrida**, por lo mismo que
`CTR-04.13`: `esquemas.test.ts` valida `letra.json` contra su schema en cada `npm test`.

**Dos comentarios de `src/lib/en-vivo.ts` quedan mintiendo:** el encabezado (*"El quiz y
`US-03` no entran"*, y la tabla de juegos sin la fila de `US-03`) y el de `repartirEnTercios()`
(*"La usa solo `scripts/generar-por-la-letra.mjs`"*). **Ese archivo lo toca `T-292` en esta
misma ráfaga.** Los corrige el que llegue segundo: si `T-292` ya cerró, `T-288`. En paralelo
no.

> **Leído el 2026-09-24, con `T-288` y `T-292` en disco: siguen los dos.** El encabezado
> dice *"El quiz y `US-03` no entran"* y la tabla no tiene la fila de `US-03`. El comentario
> de `repartirEnTercios()` ahora dice *"La usan dos lugares"* y nombra
> `generar-por-la-letra.mjs` y `repartirEnVivo()`, pero no `generar-letra.mjs`, que es el
> tercero. Es comentario, no comportamiento. Traspaso:
> `Docs/SUGERENCIAS/ARQ-para-hilo-principal-lo-que-arrastra-t287.md`.
>
> **El resto de este apartado está hecho**, leído y no corrido: `src/lib/letra/versos.ts`
> exporta `versosDelTema` y `vecinos`, `verificarInvariantes` compara exacto, y
> `banco.test.ts` tiene `n1` con sus tres rojos, `n2`, `n3` con los borradores incluidos,
> `n4` con su rojo y los diez casos del schema.

```bash
# Verificación de T-288
npm run generar-letra -- --reanclar && npm test && npm run build
# y el comando del bloque _parche, que con el schema ya en v3 prueba el archivo del disco
```

---

### Consecuencias

- **`US-03` se prende con lo que ya hay.** Los 1.784 candidatos que generó el ciclo 6 dejaron
  de estar clavados en `borrador`: `T-138` elige los 15 de menor riesgo y `T-144` los promueve
  por `fuente-unica`. Era la única de las tres mitigaciones de `D-25` que dependía de este
  contrato, y con esto queda saldada.
- **`contenido` puede cargar sin esperar nada**, en `borrador`, con una sola fuente de letra.
  Y ahora también puede promover sin esperar nada, que es lo que cambió.
- **Fácil:** rechazar un ítem con un tema que no es de Patricio Rey. No hace falta que nadie
  se acuerde de cruzar: `fuentes` sin `RES-20` no valida, y la terna la caza el chequeo 3.
- **Fácil:** cambiar de modo de respuesta. Una clave a nivel archivo, y los distractores.
- **Difícil, y a propósito:** cargar una letra entera. Cinco versos por ítem por forma del
  dato, ocho por tema por comando. Para meter una letra completa habría que repartirla en
  ítems de temas que no son, y eso lo caza el chequeo 5.
- **🔴 Fácil ahora, y era difícil a propósito hasta el 2026-08-27:** que un ítem llegue a
  `listo` sin que nadie haya escuchado el disco ni cruzado dos fuentes. Esta era **la** línea
  del contrato que protegía lo único estricto del proyecto, y `D-25` la abrió sabiendo lo que
  abría. Lo que queda del candado es más flaco y hay que llamarlo por su nombre: **la fuente
  sigue siendo obligatoria y el régimen queda escrito en cada ítem.** Nada más. Que el verso
  diga lo que dice el disco ya no lo garantiza nadie antes de publicar; lo va a decir el
  jugador, con el botón de corrección (frente D del ciclo 9).
- **Fácil, y es lo que compra el rastro:** revertir. `D-25` se cae con un filtro —los ítems
  con `regimen: "fuente-unica"` vuelven a `borrador`— y las dos vías viejas siguen escritas,
  así que no hay que rediscutir ni reescribir nada. Un ítem que consiga su segunda fuente o
  su escucha **sube solo** en la próxima corrida del generador.
- **Difícil, y asumido:** un tema que no esté en los 105 de `RES-20` no entra, aunque el
  jugador lo cante en la previa. Si algún día se decide incluir material del Indio solista o
  de Skay, no alcanza con tocar el schema: cambia el alcance del sitio, y eso es de
  `producto`.
- **Se cancela un bloqueo de v1 que ya no existe.** v1 decía: *"Queda bloqueado hasta que
  exista `src/data/_schema/titulos-res-20.json`: el chequeo 3. Mientras tanto, ningún ítem
  debería pasar a `listo`"*. Esa lista auxiliar **no hace falta y no se va a escribir**:
  `src/lib/letra/temas.ts` parsea los 105 desde la ficha `RES-20` y expone `resolverTema`, que
  es mejor que la copia que v1 pedía —una sola verdad en vez de dos—. El chequeo 3 quedó
  reescrito arriba y corre hoy. **Si esa frase se dejaba en pie, bloqueaba `T-144` por un
  faltante que se resolvió en el ciclo 6 y nadie vino a tachar acá.**
- **`bestiarioredondo` no se puede citar todavía.** `D-13` la aceptó como fuente y no tiene
  ficha `RES-NN`, así que no hay qué escribir en `fuenteLetra`. Las dos que sí tienen ficha
  son `RES-23` (letras.com) y `RES-49` (cifraclub), y son las dos del mapa `FICHA_POR_SITIO`
  del generador.
- **Los 21 temas de lacuerda.net siguen afuera, y esta revisión lo confirma en vez de
  aprovecharla.** Sería la tentación obvia —si aflojamos el cotejo, aflojemos también la
  ficha—, y es exactamente lo que `D-25` excluyó: se relaja *cuántas* fuentes, no *si hay*.
  `fuenteDeLetra.ficha` es obligatorio, así que un sitio sin ficha no se puede ni escribir.
  Fichar lacuerda es de `investigador` y el pedido ya está en `Docs/SUGERENCIAS/`.
- **Las de v3 (2026-09-24) están en `CTR-04.14`, "Consecuencias".** La que más pesaba era
  roja, *US-03 criterio 2 no puede cumplirse*, y `producto` la resolvió el mismo día
  enmendando el criterio. La que queda para mirar es de dato: un tema muy tocado con menos
  de cinco versos limpios no da ítems (*La bestia pop*).

### Qué NO decide este contrato

- ~~**Si `US-03` criterio 2 sigue vigente bajo `D-46`**~~. Era de `producto`, y lo decidió el
  2026-09-24: se enmienda (`CTR-04.14`, "El criterio 2, resuelto").
- **Si la pantalla muestra el nivel.** Es de `experiencia` (`BR-30`, "Qué no hace esta
  regla"). Si lo muestra, rige `RNF-CTR-19-A`, y el dato para el rótulo ya está: el `conteo`
  del envoltorio y `dificultadSegun`, que en ese caso tendría que viajar. *Agregado el
  2026-09-24.*
- **Si se responde eligiendo o tipeando, y si `BR-04` se extiende a `US-03`.** Es de
  `producto`. Valor de trabajo: `"opciones"` con 4. Hoy no dejo la propuesta en
  `Docs/SUGERENCIAS/` porque `T-62` me limita a dos archivos: **queda pedido en el reporte de
  la tarea** para que el hilo principal la abra.
- **La tolerancia de tipeo** si gana el texto libre: `experiencia` el mecanismo, `contenido`
  qué cuenta como correcto (PENDIENTE de `PRD-alcance-v1.md`).
- **Qué 15 temas entran, cuál es fácil y qué palabra se tapa.** Es de `contenido`, con
  `RES-20` y las fuentes de `D-13`. La mitigación 3 —empezar por los temas más conocidos,
  donde un error se caza rápido— es criterio de carga, no regla de schema.
- **Cómo se ve el hueco en pantalla**, si es una línea de puntos, un casete o un renglón de
  cuaderno: `experiencia`, con `.claude/rules/diseno-marca.md`.
- **Si la nota de derechos necesita una fila nueva por los versos.** `sensibleA: ["letra"]`
  deja el mapa consultable; qué se escribe en `CNT-01` es de `contenido`.
- **Cómo se lee la fuente en el panel de respuesta** (`T-145`): el contrato pone el dato
  —`sitio`, `url`— y el registro —el 3, el que rotula—. Dónde va en la pantalla es de
  `experiencia` (`UX-09` lo tiene al lado, con el botón de corrección) y qué dice exactamente
  es de `contenido`.
- **Cuáles son los 15 versos de menor riesgo** (`T-138`) y con qué criterio se eligen. Es de
  `contenido`, y es la mitigación de `D-25` que más aporta después del botón. El schema no
  puede distinguir un estribillo rimado de un pasaje mascullado.
- **Qué promete el sitio cuando alguien corrige algo.** Es `BR-21` de `producto`, y el
  contrato de la corrección es `CTR-10` (`T-150`), archivo aparte.

### Qué le pido a otros roles

> **Agregado el 2026-09-24 (`T-287`).**
>
> - ~~A **`producto`**: que resuelva con el usuario la contradicción entre `US-03` criterio 2
>   y la precisión de `D-46`, y que corrija el "hoy" de `US-03` en la tabla de `BR-30`.~~
>   **Hecho las dos cosas el 2026-09-24**
>   (`Docs/SUGERENCIAS/PRD-para-arquitectura-us-03-criterio-2-resuelto.md`).
> - A **`contenido`**: que mire los `listo` que cambian de nivel después de `T-288` (el paso 9
>   de `CTR-04.14` los lista), que reemplace un ancla si alguna se pierde por falta de
>   vecinos, y que tenga en cuenta la cota de 8 sin la salida del segundo ítem medio. Traspaso:
>   `Docs/SUGERENCIAS/ARQ-para-contenido-la-letra-con-el-conteo.md`. **Ya no es un "si":**
>   hay dos anclas en `enEspera`, ocho `listo` cambiaron de nivel (`CL-086` es el que más hay
>   que mirar), dos temas pasan la cota y *La bestia pop* necesita letra limpia. El detalle
>   medido está en `Docs/SUGERENCIAS/HILO-para-contenido-dos-anclas-sin-vecinos.md`.
> - A **quien escriba código** (`T-288`): `CTR-04.14` entero, y el orden con `T-292` sobre
>   `src/lib/en-vivo.ts`. Lo primero está hecho. Lo segundo no: los dos comentarios siguen, y
>   el traspaso es `Docs/SUGERENCIAS/ARQ-para-hilo-principal-lo-que-arrastra-t287.md`.

- A **`producto`**: cerrar el modo de respuesta de `US-03`; y corregir la frase del piso de
  `US-03` que todavía dice "15 letras completas, transcriptas y segmentadas en versos", que
  es el mismo arreglo que `BR-12` acaba de hacer del lado de la Redondopedia.
- A **`investigador`**, y ahora es el pedido de más palanca del proyecto: **una segunda fuente
  de letras fichada revierte `D-25` sola.** Con el schema de v2 no hace falta decidir nada de
  nuevo — el generador ve dos entradas y promueve por `dos-fuentes`. Dos candidatas, por
  orden: **lacuerda.net**, que ya tiene 21 temas en el cancionero esperando ficha (pedido en
  `Docs/SUGERENCIAS/HILO-para-investigador-fichar-lacuerda.md`), y **`bestiarioredondo`**, que
  `D-13` aceptó y `INV-21` sospecha que es obra ilustrada y no transcripción.
- A **`contenido`** (`T-138`): que los 15 elegidos salgan de temas cuya fuente tenga ficha
  —cifraclub o letras.com—, porque los de lacuerda.net no pueden declarar `fuenteLetra` y el
  generador los va a saltear. Con 80 temas y 1.784 candidatos, sobra.
- A **quien escriba código** (`T-144`): `CTR-04.13`, y sobre todo el recuadro rojo. **El
  schema no es el único lugar donde vive esta regla**; `src/lib/letra/banco.ts` tiene la copia
  que corre en build, y si se aplica uno solo de los dos, el build falla o —peor— pasa
  dejando la regla vieja andando.
- ~~A **quien tenga Bash**: `src/data/_schema/titulos-res-20.json`~~ **[CANCELADO** el
  2026-08-27**]** — `src/lib/letra/temas.ts` lo resolvió mejor parseando la ficha. Ver
  Consecuencias.
