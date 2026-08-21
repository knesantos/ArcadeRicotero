# ARQ — Schema de "completar la letra" (`US-03`)

> Rol dueño: `arquitectura`. Consume: `US-03`, `BR-01`, `BR-03`, `BR-04`, `BR-12`, `D-13`,
> `D-14`, `D-12`, `RES-03`, `RES-11`, `RES-14`, `RES-20`, `RES-23`,
> `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md` (las cinco mitigaciones del final),
> `CTR-01.4`, `CTR-02`, `CTR-03`, `.claude/rules/contenido-json.md`.
> Produce: **`CTR-04`**. Tarea: `T-62` del ciclo 4.
> Fecha: 2026-08-21.

---

## CTR-04 — Contrato de `src/data/letra.json`

- **Estado:** vigente, con **un** valor de trabajo marcado: si se responde eligiendo o
  tipeando (`CTR-04.8`). Es la misma vacante que tuvo `CTR-03` y por el mismo motivo —
  `BR-04` fija 4 opciones para `US-01`, `US-02` y `US-04`, y **no nombra a `US-03`**.
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
| Presupuesto de tamaño | ≤ 150 KB, el mismo techo de `CTR-02.1`. 15 ítems × ~900 bytes ≈ 14 KB |

El nombre del archivo de datos sale del nombre del schema que fijó el plan del ciclo
(`letra.schema.json`), para que el par se lea de un vistazo. El valor de `juego` es
`"completar-la-letra"`, igual que la ruta `src/pages/juegos/completar-la-letra.astro` que ya
existe.

```json
{
  "contrato": "CTR-04",
  "contratoVersion": 1,
  "juego": "completar-la-letra",
  "actualizado": "2026-08-21",
  "modoRespuesta": "opciones",
  "items": []
}
```

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
| `fuenteLetra` | array de `RES-NN`, 1 a 4 | sí | De dónde salió el **texto del verso**. Campo aparte de `fuentes`. Ver `CTR-04.6`. |
| `confirmadoDeOido` | objeto de 4 subcampos | no, pero condiciona `listo` | La mitigación 5 de `D-13`. Ver `CTR-04.6`. |
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

### CTR-04.6 — Las dos mitigaciones de `D-13` que deciden si un ítem está `listo`

`INV-21` dice cuál de las cinco cierra de verdad: **confirmar de oído contra el disco**, y
aclara por qué es realista — con 2/1/0 versos, el piso de `US-03` son ~30 versos, y eso se
verifica en una tarde escuchando. La 2, dos fuentes que coincidan, es la más barata que baja
el riesgo sin escuchar nada.

**La regla, y es la única condición de estado de este contrato:**

> Para que un ítem tenga `"estado": "listo"` necesita **o** el objeto `confirmadoDeOido`,
> **o** `fuenteLetra` con al menos dos fichas. Un verso con una sola fuente de fans y sin
> confirmar de oído se queda en `borrador`.

No estrangula la carga: `contenido` puede cargar quince ítems en `borrador` con una sola
fuente y subirlos después, en la tarde de escuchar. Lo que no puede es que un verso sin
ninguna de las dos mitigaciones cuente para el piso de `US-03`.

**`fuenteLetra` va aparte de `fuentes` a propósito.** Son dos afirmaciones distintas: `fuentes`
sostiene que el tema existe, en qué disco y en qué pista; `fuenteLetra` sostiene que el texto
del verso dice lo que dice. Meterlas en el mismo arreglo haría imposible medir la mitigación
2 —¿dos fichas de qué?— y borraría la trazabilidad que pide la mitigación 4: el día que se
corrija una transcripción, se filtra por `fuenteLetra` y aparecen los ítems afectados sin
auditar el banco entero.

**`confirmadoDeOido` es un objeto de cuatro subcampos, no un booleano**, por la lección de
`CTR-02.4` regla 3: una casilla que se tilda bajo presión de ráfaga se tilda sola.

| Subcampo | Qué exige | Por qué |
|---|---|---|
| `quien` | 3 a 60 caracteres, arranca en mayúscula | Quién escuchó. Hay una sola persona con parlantes en este proyecto, y aun así el campo tiene que decir su nombre: dentro de dos meses, "alguien lo escuchó" no es nadie. |
| `fecha` | `AAAA-MM-DD` | Cuándo. Si mañana cambia la transcripción de una fuente, se sabe qué escuchas son anteriores. |
| `donde` | enum: `disco-fisico` · `streaming` · `video` | No es lo mismo el disco que un video de YouTube con la letra sobreimpresa — que es leer la misma fuente de fans con música de fondo, no escuchar. |
| `minuto` | patrón `M:SS` o `MM:SS` | **Es el campo que separa la confirmación del tilde.** Solo se puede escribir habiendo encontrado el verso en la grabación, y deja el ítem re-chequeable en veinte segundos por otra persona. Es el equivalente exacto de `testimonio.ubicacion` en `CTR-02`. |

**Lo que el schema no puede ver, y `revisor` sí:** que en ese minuto suene ese verso. La
máquina mira la forma, la persona mira la verdad — igual que siempre, y acá la persona la
tiene fácil porque le alcanza con poner el tema.

#### Alternativas descartadas

1. **`confirmadoDeOido: true`, un booleano.** Es la traducción literal de la mitigación y es
   justo el campo que se llena por inercia. Descartada por `CTR-02.4` regla 3.
2. **Exigir `fuenteLetra` con dos fichas siempre, sin la salida del oído.** Estrangula la
   carga hoy: las fichas de fuentes de letras que existen son `RES-23` (letras.com,
   evaluada en negativo pero admitida por `D-13`) y la que salga de `T-60` sobre
   redondossubtitulados. Y es peor de fondo: dos fans que se copiaron entre sí no valen más
   que uno, mientras que el disco es el disco.
3. **Exigir el oído siempre.** Es lo más seguro y bloquea la carga a la velocidad de una
   sola persona con auriculares. La dejo como la forma preferida —y medible, consulta 7 de
   `CTR-04.12`— sin volverla obligatoria.
4. **Un campo libre `fuente: "letras.com, consultado el ..."`.** Descartada por lo mismo que
   `CTR-02.4` descartó `fuentePrimaria`: una string no se valida por partes ni se filtra.

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

Lo que hay que saber del bloque sin abrirlo:

- Draft 2020-12, `$id` `https://ricotaarcade.local/schema/letra/1`, `contratoVersion` en 1.
- `additionalProperties: false` en el ítem y en todos los objetos: un campo inventado no
  entra en silencio.
- Cinco ramas `allOf` a nivel ítem: las tres de `BR-03`, la de `estado: listo` y la de
  `rotulo` sin `explicacion`.
- Diez ramas `allOf` dentro de `tema`: año y pista máxima por disco.
- Dos ramas `allOf` a nivel archivo: `modoRespuesta` decide si se exige `opciones` o
  `variantesAceptadas`.

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
  "fuenteLetra": ["RES-23"],
  "sensibleA": ["letra"],
  "estado": "borrador"
}
```

**Qué es verdadero acá y con qué ficha.** "Todo un palo" es la pista 8 de *Un baión para el
ojo idiota*, disco del 9 de mayo de 1988 por Del Cielito: lo sostiene `RES-20`, que es la
ficha con los tracklists. `RES-02` da los álbumes pero no los temas, así que **no**
sostendría la pista y citarla sería el error tipo `FIND-10`.

**Qué está marcado como invento y cómo:**

| Valor | Estado real | Cómo está puesto |
|---|---|---|
| Los versos y el hueco | No hay letras en el repo. Salen de la fuente de fans (`D-13`) más el oído. | Con `<` y `>`, que ningún campo de texto admite. **No valida.** |
| `fuenteLetra: ["RES-23"]` | `RES-23` sí existe y es la ficha de letras.com, admitida por `D-13`. | Es válida como forma, y con una sola ficha el ítem **no puede pasar a `listo`** sin `confirmadoDeOido`. Por eso está en `borrador`. |
| `spotify` | No tengo el `trackId` y no puedo tenerlo (sin acceso a la web). | **El objeto no está.** Es la forma correcta de no saberlo. |

Un ítem `media` del mismo tema se ve igual con `contexto.antes` y `contexto.despues` de un
verso cada uno; uno `dificil`, con los dos arreglos vacíos.

---

### CTR-04.12 — Verificación: casos de prueba, cuotas y comandos

**No corro nada** (`D-12`). Lo de abajo lo corre el hilo principal o `revisor`, con Bash.
Hoy no existe `src/data/letra.json`, así que lo único ejecutable en esta ráfaga es el caso 0.

#### Casos de prueba del schema

Cada caso es un archivo mínimo con un ítem. Doce tienen que **fallar** y dos **pasar**; si
alguno de los que tienen que fallar pasa, el schema no está haciendo su trabajo.

| # | Qué se arma | Resultado esperado |
|---|---|---|
| 0 | El schema mismo se parsea como JSON | pasa |
| 1 | Ítem completo, `facil`, 2+2 versos, `borrador`, una `fuenteLetra` | **valida** |
| 2 | Igual al 1 pero `estado: "listo"` sin `confirmadoDeOido` y con una sola `fuenteLetra` | **rechaza** (regla de `CTR-04.6`) |
| 3 | Igual al 2 pero con `confirmadoDeOido` completo | **valida** |
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

# (3) el cruce de D-13: la terna disco+pista+titulo es una de las 105 de RES-20
#     (necesita src/data/_schema/titulos-res-20.json, que todavia no existe)
python -c "import json;d=json.load(open('src/data/letra.json',encoding='utf-8'));t={(x['disco'],x['pista'],x['titulo']) for x in json.load(open('src/data/_schema/titulos-res-20.json',encoding='utf-8'))};m=[x['id'] for x in d['items'] if (x['tema']['disco'],x['tema']['pista'],x['tema']['titulo']) not in t];print('fuera de RES-20:',m or 'ninguno')"

# (4) distractores: la correcta es la respuesta, y ninguna opcion la repite normalizada
python -c "import json,unicodedata as u;n=lambda s:''.join(c for c in u.normalize('NFD',s.lower()) if u.category(c)!='Mn').strip();d=json.load(open('src/data/letra.json',encoding='utf-8'));[print('MAL',x['id']) for x in d['items'] if d['modoRespuesta']=='opciones' and (next(o['texto'] for o in x['opciones'] if o['correcta'])!=x['hueco']['respuesta'] or len({n(o['texto']) for o in x['opciones']})!=4 or any(n(o['texto']) in n(' '.join(x['contexto']['antes']+x['contexto']['despues'])).split() for o in x['opciones'] if not o['correcta']))];print('chequeo 4 corrido')"

# (5) la cota de CTR-04.4: no mas de 8 versos distintos por tema en todo el banco
python -c "import json;from collections import defaultdict;v=defaultdict(set);[v[x['tema']['slug']].update(x['contexto']['antes']+x['contexto']['despues']+[x['hueco']['antes']+x['hueco']['respuesta']+x['hueco']['despues']]) for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items']];print({k:len(s) for k,s in v.items() if len(s)>8} or 'ningun tema pasa de 8')"

# (6) US-03 criterio 2: ningun tema aparece solo en dificil
python -c "import json;i=[x for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items'] if x['estado']=='listo'];f={x['tema']['slug'] for x in i if x['dificultad']!='dificil'};print('temas que solo existen en dificil:',{x['tema']['slug'] for x in i if x['dificultad']=='dificil'}-f or 'ninguno')"

# (7) senal, no piso: cuantos items descansan solo en fuentes de fans
python -c "import json;i=[x for x in json.load(open('src/data/letra.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print('confirmados de oido:',sum(1 for x in i if 'confirmadoDeOido' in x),'de',len(i))"
```

#### Las cuotas del piso, contadas sobre `estado: "listo"`

| # | Consulta | Piso |
|---|---|---|
| 1 | Total de ítems `listo` | ≥ 15 (`US-03`) |
| 2 | Ítems `listo` con `dificultad: "facil"` | ≥ 4 (`US-03`) |
| 3 | Temas con ítem `dificil` que no tienen ningún ítem `facil` o `media` | **0** (`US-03` criterio 2) |
| 4 | Temas cuyo conjunto de versos distintos pase de 8 | **0** (`CTR-04.4`) |
| 5 | Ítems `listo` sin `confirmadoDeOido` ni segunda `fuenteLetra` | **0** — lo garantiza el schema; el comando lo confirma |

La consulta 3 traduce a número el criterio 2 de `US-03`: *nunca se introduce un tema
completamente nuevo solo en modo difícil*. Si un tema solo existe en `dificil`, la partida se
lo presenta al jugador por primera vez sin título, sin disco y sin un verso alrededor, que es
exactamente lo que el usuario pidió que no pasara en `/kickoff`.

**Chequeo cruzado con la Redondopedia, para cuando existan los artículos `tema`** (`BR-12`,
tope de 5 versos por artículo): sumar los versos de `letra.json` y los de `redondopedia.json`
por tema. No le pongo un piso porque el segundo archivo no es mío; lo dejo anotado para
`revisor`, que es quien mira los dos.

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
