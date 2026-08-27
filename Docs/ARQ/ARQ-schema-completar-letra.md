# ARQ — Schema de "completar la letra" (`US-03`)

> Rol dueño: `arquitectura`. Consume: `US-03`, `BR-01`, `BR-03`, `BR-04`, `BR-12`, `D-13`,
> `D-14`, `D-12`, **`D-25`**, `RES-03`, `RES-11`, `RES-14`, `RES-20`, `RES-23`, **`RES-49`**,
> `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md` (las cinco mitigaciones del final),
> `CTR-01.4`, `CTR-02`, `CTR-03`, `.claude/rules/contenido-json.md`.
> Produce: **`CTR-04`**. Tareas: `T-62` del ciclo 4 (v1) · **`T-131` del ciclo 9 (v2)**.
> Fecha: 2026-08-21 · **revisado el 2026-08-27**.

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

- **Estado:** vigente en **v2** (`contratoVersion: 2`), con **un** valor de trabajo marcado:
  si se responde eligiendo o tipeando (`CTR-04.8`). Es la misma vacante que tuvo `CTR-03` y
  por el mismo motivo — `BR-04` fija 4 opciones para `US-01`, `US-02` y `US-04`, y **no
  nombra a `US-03`**.
- **Para quién es:** para `contenido`, que en el ciclo 5 carga los 15 ítems de `US-03` y
  necesita saber qué forma tiene un ítem antes de sentarse a escuchar discos; y para quien
  escriba el motor del juego 3.
- **Lo que este contrato hace y ningún documento hacía todavía:** convertir las mitigaciones
  de `D-13` en algo que una máquina rechaza. Hasta hoy eran cinco viñetas de una ficha; acá
  dos de ellas —el cruce contra los 105 temas de `RES-20` y la confirmación de oído— son
  condición para que un ítem exista o para que pase a `listo`.

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

```json
{
  "contrato": "CTR-04",
  "contratoVersion": 2,
  "juego": "completar-la-letra",
  "actualizado": "2026-08-27",
  "modoRespuesta": "opciones",
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
que viaja (`CTR-04.6`). Con el piso de 15 de `US-03` sobra techo por diez veces; el número
existe para que el día que alguien decida servir el banco entero, la decisión se tope con un
límite escrito en vez de con un celular de gama baja. **La medición la deja corrible
`CTR-04.12`, chequeo 10.**

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
| `dificultad` | `facil` · `media` · `dificil` | sí | `BR-01`. Manda cuánto contexto puede traer el ítem — ver `CTR-04.7`. |
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

**Mientras esa lista no exista, un ítem se puede cargar pero no puede pasar a `listo`**: el
cruce sin correr es un cruce que no se hizo.

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

Hasta hoy `aPayload` recorta `fuenteLetra`, `cotejo`, `confirmadoDeOido`, `fuentes`,
`sensibleA`, `estado` y `notaInterna`: al navegador llegan solo el ítem jugable y su
explicación. **Con `T-145` eso deja de alcanzar**, porque el panel de respuesta tiene que
mostrar qué sitio transcribió el verso, con su enlace. El contrato pasa a exigir:

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
rótulo sino con `fuenteLetra` y `confirmadoDeOido` (`CTR-04.6`), que dicen de dónde salió el
texto y si alguien lo escuchó.

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

#### Las cuotas del piso, contadas sobre `estado: "listo"`

| # | Consulta | Piso |
|---|---|---|
| 1 | Total de ítems `listo` | ≥ 15 (`US-03`) |
| 2 | Ítems `listo` con `dificultad: "facil"` | ≥ 4 (`US-03`) |
| 3 | Temas con ítem `dificil` que no tienen ningún ítem `facil` o `media` | **0** (`US-03` criterio 2) |
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

### Consecuencias

- **`contenido` puede cargar sin esperar nada**, en `borrador`, con una sola fuente de letra.
  Lo que necesita para el piso es la tarde de escuchar, no una ficha nueva.
- **Fácil:** rechazar un ítem con un tema que no es de Patricio Rey. No hace falta que nadie
  se acuerde de cruzar: `fuentes` sin `RES-20` no valida, y la terna la caza el chequeo 3.
- **Fácil:** cambiar de modo de respuesta. Una clave a nivel archivo, y los distractores.
- **Difícil, y a propósito:** cargar una letra entera. Cinco versos por ítem por forma del
  dato, ocho por tema por comando. Para meter una letra completa habría que repartirla en
  ítems de temas que no son, y eso lo caza el chequeo 5.
- **Difícil, y a propósito:** que un ítem llegue a `listo` sin que nadie haya escuchado el
  disco ni cruzado dos fuentes. Es la única condición de estado del contrato y es la que
  protege lo único estricto del proyecto (`D-14`).
- **Difícil, y asumido:** un tema que no esté en los 105 de `RES-20` no entra, aunque el
  jugador lo cante en la previa. Si algún día se decide incluir material del Indio solista o
  de Skay, no alcanza con tocar el schema: cambia el alcance del sitio, y eso es de
  `producto`.
- **Queda bloqueado hasta que exista `src/data/_schema/titulos-res-20.json`:** el chequeo 3.
  Mientras tanto, ningún ítem debería pasar a `listo`. Es una tarea de quien tenga Bash y
  sirve también para el chequeo 4 de `CTR-03.10`, que arrastra el mismo faltante desde el
  ciclo 2.
- **`bestiarioredondo` no se puede citar todavía.** `D-13` la aceptó como fuente y no tiene
  ficha `RES-NN`, así que no hay qué escribir en `fuenteLetra`. Hasta que exista, los ítems
  se apoyan en `RES-23` y en lo que salga de `T-60`.

### Qué NO decide este contrato

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

### Qué le pido a otros roles

- A **`producto`**: cerrar el modo de respuesta de `US-03`; y corregir la frase del piso de
  `US-03` que todavía dice "15 letras completas, transcriptas y segmentadas en versos", que
  es el mismo arreglo que `BR-12` acaba de hacer del lado de la Redondopedia.
- A **`investigador`**: una ficha de `bestiarioredondo` como fuente de texto, si es que sirve
  para eso — `INV-21` sospecha que es obra ilustrada y no transcripción.
- A **quien tenga Bash**: `src/data/_schema/titulos-res-20.json`, copiado de `RES-20`, con la
  terna `disco` + `pista` + `titulo` de los 105 temas.
