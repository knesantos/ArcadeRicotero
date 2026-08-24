# ARQ — Schema del banco del test de dos ejes (`US-06`)

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `US-06` y `BR-17`
> (`Docs/PRODUCTO/PRD-alcance-v1.md`), `D-02`, `D-12`, `D-14`, `D-17`, `CTR-02`
> (`Docs/ARQ/ARQ-schema-quiz.md`), `CTR-03`, `ADR-02`
> (`Docs/ARQ/ARQ-link-resultado-compartido.md`), `Docs/ORQ/ORQ-plan-ciclo-8.md` (`T-120`),
> `src/lib/esquemas.test.ts`, `.claude/rules/voz-ricotera.md`.
> Produce: `CTR-08`.
> Última actualización: 2026-08-24 (revisión 1, `T-120` del ciclo 8).

---

## CTR-08 — Contrato de `src/data/dos-ejes.json`

- **Fecha:** 2026-08-24
- **Estado:** **vigente, sin valores abiertos.** Todo lo que este contrato necesitaba de
  `producto` ya está en `US-06` y `BR-17`: los dos ejes, el piso de 20, las 5 por eje y
  las 2 opciones por pregunta. No espera ninguna ficha `RES-XX`: el banco no afirma nada
  sobre la banda, así que no hay hecho externo que verificar (`CTR-08.5`, regla 5).
- **Para quién es esto:** para `contenido`, que en `T-121` carga el banco y los cuatro
  cuadrantes; para el hilo principal, que en `T-123` construye el juego; y para `revisor`,
  que en `T-124` tiene que poder rechazar un ítem sin preguntarle nada a nadie.
- **Qué NO es:** no es una variante de `CTR-02`. El banco del quiz tiene una respuesta
  correcta y este no puede tenerla. Copiar la forma de `CTR-02` es el modo más rápido de
  romper `BR-17`, y por eso la sección `CTR-08.5` empieza por lo que se sacó.

`US-06` dejó explícitamente en manos de `arquitectura` una sola cosa además del schema:
**el mecanismo de sorteo de las 5 de 10 por eje.** Está en `CTR-08.6`, porque el sorteo es
la mitad de la garantía de que no haya empate: el conteo impar no sirve de nada si el
motor puede servir una partida corta cuando el banco no alcanza.

---

### CTR-08.1 — El archivo

| | |
|---|---|
| Ruta del dato | **`src/data/dos-ejes.json`** |
| Ruta del schema | **`src/data/_schema/dos-ejes.schema.json`** |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Versionado | Git, más el par `contrato` / `contratoVersion` adentro del archivo |
| Presupuesto de tamaño | **≤ 40 KB sin comprimir** |

**Los dos nombres importan y no son libres.** `src/lib/esquemas.test.ts` empareja dato y
schema por nombre de archivo: recorre un arreglo de nombres y abre `src/data/<n>.json`
contra `src/data/_schema/<n>.schema.json`. Con estas dos rutas, sumar el banco a la
verificación es agregar `'dos-ejes'` a ese arreglo (hoy `['quiz', 'letra', 'tapa',
'cancionero']`, línea 44). Cualquier otro par de nombres obliga a escribir un caso aparte.

**Presupuesto:** 20 ítems de ~230 bytes más cuatro cuadrantes son unos **5 KB**. El techo
de 40 KB está para que nadie descubra el problema con el archivo ya armado; si el banco
creciera a 200 ítems seguiría entrando holgado.

**La isla de este juego no importa nada del motor de audio (`CTR-01`) ni del buscador de
`CTR-03`.** Es texto y dos botones. El que entra al test no tiene por qué descargar un
decodificador ni un índice de 105 títulos.

---

### CTR-08.2 — Envoltorio

```json
{
  "contrato": "CTR-08",
  "contratoVersion": 1,
  "juego": "dos-ejes",
  "actualizado": "2026-08-24",
  "preguntasPorEje": 5,
  "cuadrantes": [ ... ],
  "items": [ ... ]
}
```

`contrato` y `contratoVersion` van adentro del dato por el mismo motivo que en `CTR-02`:
dentro de dos meses, mirando solo el JSON, se tiene que poder saber contra qué documento
validarlo.

**`preguntasPorEje` es el campo que hace verificable a `BR-17` regla 3, y por eso vive en
el dato y no en el código.** El schema lo declara entero, impar y entre 3 y 9:

```json
"preguntasPorEje": { "type": "integer", "minimum": 3, "maximum": 9, "not": { "multipleOf": 2 } }
```

`not: { multipleOf: 2 }` es "impar" escrito en JSON Schema. Con eso, **el comando que
valida el archivo contra el schema ya demuestra que ninguna partida puede empatar**: no
hace falta leer `BR-17` ni confiar en que el motor puso un 5. Si alguien alguna vez lo
mueve a 6 porque "diez preguntas son muchas", el archivo deja de validar en el acto.

**El motor lee este número, no lo repite.** Un `const POR_EJE = 5` en TypeScript al lado
de un `5` en el JSON son dos fuentes de verdad que se desincronizan la primera vez que
alguien toca una sola. La regla de `.claude/rules/codigo-juegos.md` ("nada de datos
hardcodeados") se aplica también a esto.

---

### CTR-08.3 — El ítem

El ID de ejemplo es `EJ-999`, reservado en `CTR-08.10` y que nunca se carga en el banco.

```json
{
  "id": "EJ-999",
  "us": ["US-06"],
  "eje": "orden-caos",
  "enunciado": "Vas a un recital solo. ¿Cómo llegás?",
  "opciones": [
    { "texto": "Con la entrada sacada hace un mes y el bondi averiguado", "polo": "orden" },
    { "texto": "Sin entrada, ya voy a ver cómo entro", "polo": "caos" }
  ],
  "estado": "listo"
}
```

| Campo | Tipo | Oblig. | Qué es y por qué |
|---|---|---|---|
| `id` | `EJ-NNN` | sí | Ver `CTR-08.10`. No se reutiliza nunca. |
| `us` | array de `US-NN` | sí | Hoy siempre `["US-06"]`. Un ítem que no traza a un requisito es contenido que nadie pidió (`Docs/IDS.md`). |
| `eje` | enum | sí | `luz-oscuridad` · `orden-caos`. **Uno solo, y es la clave de todo el contrato** (`CTR-08.5`, regla 1). |
| `enunciado` | string, 10–120 | sí | La situación que se plantea. Techo bajo a propósito: ver abajo. |
| `opciones` | array de exactamente **2** | sí | Una por extremo del eje. Ver abajo. |
| `estado` | enum | sí | `borrador` · `listo` · `retirado`. El piso se cuenta sobre `listo`. |
| `notaInterna` | string | no | Para el equipo. **Nunca se renderiza.** |

**Y eso es todo. El ítem es `additionalProperties: false`, así que no hay dónde escribir
`correcta`, ni `dificultad`, ni `peso`, ni `explicacion`, ni `fuentes`.** No es un olvido
ni una lista que se completa después: es la sección `CTR-08.5`.

**Opciones.** Cada una es `{ "texto": string 2–72, "polo": enum }`. Exactamente dos, con
polos distintos y los dos del eje del ítem — el schema lo valida, no es un acuerdo de
palabra.

- **El motor baraja las dos opciones. El orden del JSON no significa nada.** Está escrito
  por una razón concreta: si `luz` cayera siempre primera, el que toca siempre el botón de
  arriba caería siempre en el mismo cuadrante, y el resultado dejaría de decir algo sobre
  él. Es la misma lección que `CTR-02` aprendió con `correcta`, aplicada a `polo`.
- **`polo` viaja adentro de la opción**, no como un índice ni como un orden implícito
  (`opciones[0]` = extremo A). Alternativa descartada por lo mismo de siempre: el día que
  alguien reordene las dos opciones para que se lean mejor, el índice apunta al polo
  equivocado y el error es silencioso — el juego sigue andando y devuelve otra identidad.

**Los techos de largo salen de la pantalla, no del gusto.** Enunciado ≤ 120 y opción ≤ 72
entran, en un celular de 360 px de ancho, como tres líneas y dos bloques de dos líneas,
dejando la zona pulgar libre para los dos destinos grandes. Son más holgados que los 60
caracteres de `CTR-02` porque acá hay dos opciones y no cuatro; una elección de
temperamento necesita más aire que un distractor.

---

### CTR-08.4 — Los cuatro cuadrantes

Viven en el mismo archivo que los ítems, porque son la otra mitad del banco: sin los
cuatro nombres, el juego no tiene qué devolver.

```json
{
  "id": "CU-1",
  "luzOscuridad": "luz",
  "ordenCaos": "orden",
  "nombre": "El que llega temprano",
  "bajada": "Sabés a qué hora abre y ya tenés el lugar elegido. No es cálculo: es que te gusta ver todo desde el principio.",
  "estado": "listo"
}
```

| Campo | Tipo | Oblig. | Qué es y por qué |
|---|---|---|---|
| `id` | `CU-1`..`CU-4` | sí | Es lo que viaja en el link compartido (`CTR-08.7`, nota sobre `ADR-02`). |
| `luzOscuridad` | enum | sí | `luz` · `oscuridad`. La coordenada del cuadrante en el primer eje. |
| `ordenCaos` | enum | sí | `orden` · `caos`. La coordenada en el segundo. |
| `nombre` | string, 3–48, **máximo 8 palabras** | sí | Registro 1 de `.claude/rules/voz-ricotera.md`. El techo de 8 palabras lo hace cumplir el patrón `^\S+( \S+){0,7}$`, no la buena voluntad. |
| `bajada` | string, 10–220 | sí | Registro 2. Es lo que hace que el resultado sea una identidad y no una etiqueta suelta. |
| `estado` | enum | sí | `borrador` · `listo`. Los cuatro tienen que estar `listo` para que el juego se pueda jugar. |

**Son cuatro, ni tres ni cinco.** `minItems: 4` y `maxItems: 4`. El quinto resultado
"neutro" que `BR-17` prohíbe no tiene dónde escribirse, y las cuatro combinaciones de
coordenadas se verifican en `CTR-08.9`.

**El schema rechaza un puñado de palabras en `nombre`:** `más`, `menos`, `mejor`, `peor`,
`nivel`, `ranking`, `top`, `verdadero`, `superior`, `inferior`. Es el piso mecánico del
criterio 3 de `US-06` — ningún cuadrante se presenta como el bueno. Es un piso y no una
garantía: un nombre puede jerarquizar sin usar ninguna de esas palabras, y eso lo caza
`revisor`. La lista es corta a propósito; ampliarla es aditivo y cuesta una línea.

**No hay campo de "intensidad", ni de porcentaje, ni de conteo.** `US-06` descartó los
grados dentro del cuadrante y este contrato no los deja volver por la puerta del dato.

---

### CTR-08.5 — Las cinco reglas que el schema hace cumplir solo

**Regla 1 — un ítem mueve un solo eje, y no por promesa.**

Es la regla más fácil de romper por descuido al cargar el banco y la que más caro sale: un
ítem que empuja los dos ejes hace que el resultado deje de ser reproducible y, peor, le
saca al jugador la posibilidad de tener una postura distinta en cada eje, que es lo que
hace que haya cuatro cuadrantes y no dos (`BR-17`, regla 1).

La hace cumplir la **forma**, no una validación agregada encima:

1. El eje se declara **una vez, en el ítem**, con un enum de dos valores. No hay manera de
   escribir dos.
2. El polo se declara **en la opción**, y el schema lo **estrecha según el eje del ítem**
   con una rama `if/then`: si `eje` es `luz-oscuridad`, los polos admitidos son `luz` y
   `oscuridad`; si es `orden-caos`, son `orden` y `caos`. Un ítem con una opción `luz` y
   otra `caos` **no valida**.

**Regla 2 — dos opciones, una por extremo puro.**

`BR-17` regla 2 pide que las dos opciones sean los extremos y no matices. El schema lo
exige con dos `contains` de `minContains: 1` y `maxContains: 1` dentro de la misma rama:
uno por cada polo del eje. Dos opciones del mismo polo **no validan**; una opción sin polo
tampoco.

Esta regla es la que sostiene la invariante 3 de `CTR-08.9`, y conviene ver por qué: si
**todo** ítem de un eje ofrece los dos extremos, entonces cualquier cantidad de respuestas
hacia un lado —de 0 a `preguntasPorEje`— es alcanzable, y por lo tanto los cuatro
cuadrantes lo son. La reachability no se argumenta: se deduce de esta regla más el barrido
del comando.

**Regla 3 — el conteo impar vive en el dato.**

Ya está en `CTR-08.2`. Lo que agrega esta sección es la consecuencia: **el empate es
imposible por aritmética, no por una rama del código que lo desempate.** Con
`preguntasPorEje` impar y cada respuesta valiendo exactamente uno para exactamente un eje,
ningún eje puede terminar mitad y mitad. Si alguna vez aparece una función
`desempatar()` en el motor, es la señal de que alguna de las tres reglas anteriores se
rompió.

**Regla 4 — ninguna opción es la correcta, y no hay dónde escribir que lo sea.**

En un test de identidad no hay respuesta correcta. `CTR-02` tiene `correcta: true` en cada
opción y **esa forma no se copia acá**: si el banco tuviera una respuesta correcta, el
test pasaría a medir cuánto sabés, que es lo único que `BR-17` prohíbe y lo que en `D-14`
se llama cerrar el molinete.

Cómo se hace cumplir: `additionalProperties: false` en el ítem y en la opción. `correcta`,
`dificultad`, `peso`, `puntos`, `explicacion` y `fuentes` no fallan por estar prohibidos
en una lista negra —una lista negra siempre se queda corta— sino porque **no hay ninguna
clave admitida fuera de las declaradas**. El mensaje de ajv para ese caso es genérico
("must NOT have additional properties"), así que el comando de `CTR-08.9` mira aparte esas
seis claves y las nombra: es la diferencia entre que `contenido` entienda el rechazo en
diez segundos o en diez minutos.

**Sobre `dificultad` en particular:** `US-06` dice que `BR-01` no aplica, y este contrato
lo toma al pie de la letra. No hay campo, ni opcional, ni con default. Un campo opcional
de dificultad sería la puerta de entrada exacta al defecto que `BR-17` prohíbe: alguien lo
llena, alguien lo usa para ordenar la partida, y el test empieza a medir nivel sin que
nadie haya decidido que lo haga.

**Regla 5 — acá no hay `hecho` / `leyenda` / `testimonio`, y no se agregan después "por
consistencia".**

Lo dejo escrito con nombre y motivo, porque es el campo que alguien va a querer sumar
mirando `CTR-02` de reojo.

El rotulado de `D-14` clasifica **el origen de una afirmación**. Un ítem de este banco no
afirma nada sobre la banda: le ofrece al jugador dos maneras de contestar sobre sí mismo.
Donde no hay afirmación, las tres casillas no tienen qué clasificar, y una casilla que no
clasifica nada es exactamente el campo que se llena por inercia — el riesgo que `CTR-02.4`
regla 3 se pasó media sección tratando de evitar. Un `esLeyenda: false` en veinte ítems
que no afirman nada no agrega verdad: le saca peso al mismo campo cuando aparece en el
quiz, donde sí decide algo.

**La regla práctica, y es la que hay que recordar:** *si un ítem necesita una ficha
`RES-XX` para ser honesto, no es un ítem de este banco — es una pregunta del quiz mal
ubicada.* El schema la hace cumplir sola: no hay campo `fuentes`, así que el ítem que lo
necesitaría no valida.

Dos corolarios que no son teóricos:

- **El enunciado no puede presuponer un hecho discutido.** "Después de que se separaron en
  el 2001, ¿vos qué hubieras hecho?" afirma una fecha adentro de una pregunta de
  temperamento, y no tiene dónde citarla. Se reescribe sin el dato. Esto el schema **no**
  lo ve; lo ve `revisor`.
- **El banco no cita letras.** No hay campo para declarar material de terceros —no existe
  `sensibleA` acá— y eso es la decisión, no un olvido: si una opción necesita un verso para
  funcionar, es un ítem de `US-03`. Mencionar el **título** de un tema está bien y no es
  material sensible; pegar el verso, no. Si `contenido` cree que hace falta, sale como
  revisión aditiva de este contrato, no como un campo improvisado en un lote.

**Y un límite duro que sí está en el schema:** `enunciado` y `texto` no pueden contener
`Bulacio`, `Olavarría` ni `Cromañón`. Son los lugares donde el sitio se saca la voz
(registro 3, `.claude/rules/voz-ricotera.md` §6, `CNT-04` y `CNT-06`), y una pregunta de
temperamento del tipo "¿vos qué hubieras hecho?" sobre un pibe muerto por la policía no
tiene forma de estar bien escrita. Tres nombres propios, sin ambigüedad posible.

**Lo que deliberadamente NO está en el schema es la muerte del Indio**, que es el tercer
tema de esa lista. Un patrón sobre `muerte`, `murió` o `falleció` reventaría el polo
`oscuridad` entero: la mitad de ese eje vive de imágenes duras, y prohibir la palabra
sería prohibir el eje. Va como señal para leer con los ojos, en el comando de `CTR-08.9`.

#### Alternativas descartadas

Seis, y las seis se pueden retomar sabiendo lo que cuestan.

1. **`efectos: [{ eje, polo }]`, un arreglo por ítem.** Es la forma flexible y natural, y
   es **exactamente la que permite mover dos ejes**. Con `maxItems: 1` daría el mismo
   resultado que el campo `eje`, a cambio de una estructura que invita a subir el tope el
   día que alguien quiera "una pregunta que valga doble". Descartada: la forma tiene que
   hacer imposible lo prohibido, no difícil.
2. **Un vector de pesos por opción: `{ "luzOscuridad": -1, "ordenCaos": 0 }`.** Descartada
   dos veces. Primero porque el cero es el valor por omisión y "mueve los dos ejes" queda a
   un tipeo de distancia. Segundo porque los pesos reintroducen los grados que `US-06`
   descartó: con un −2 y un −1 aparece "bastante caótico", y con él la jerarquía.
3. **No declarar `eje` en el ítem y deducirlo de los polos de las opciones.** Es menos
   redundante y es peor: contar ítems por eje pasa a exigir un barrido de opciones, la rama
   `if/then` que estrecha los polos desaparece, y una contradicción entre lo que el ítem
   dice ser y lo que sus opciones hacen deja de existir como error detectable. La
   redundancia acá es el mecanismo, no un descuido.
4. **Reusar `CTR-02` con `correcta: false` en las cuatro opciones.** Se escribió y se tiró:
   `maxContains: 1` sobre `correcta: true` pasaría a `minContains: 0`, y el banco quedaría
   a un tilde de tener una respuesta correcta. Un campo booleano que siempre vale `false`
   es una invitación.
5. **Guardar el resultado como dos números (`-3`, `+1`) en vez de dos polos.** Tentador
   para el link compartido, y descartado porque un número es un puntaje disfrazado: la
   primera pantalla que lo reciba lo va a mostrar, y el criterio 3 de `US-06` dice que el
   conteo no se muestra. Ver `CTR-08.6`.
6. **Cuadrantes en un archivo aparte (`src/data/cuadrantes.json`).** Descartada porque la
   invariante que más importa —que las cuatro combinaciones estén cubiertas y sean
   alcanzables— cruza ítems con cuadrantes, y partirla en dos archivos convierte una
   consulta de una línea en un cruce con dos rutas que se pueden desincronizar. Son 4
   objetos: no justifican un archivo.

---

### CTR-08.6 — El sorteo y la resolución, que es lo que `US-06` me dejó a mí

Esto no es dato: es lo que el motor tiene que hacer, y el contrato lo fija porque de acá
depende que el empate siga siendo imposible en tiempo de ejecución.

**Dos funciones puras, en `src/lib/dos-ejes/`.** Puras porque si no, no hay test.

```
sortearPartida(banco, rnd = Math.random) -> ItemServido[]
resolverCuadrante(banco, polosElegidos)  -> { id, nombre, bajada }
```

**`sortearPartida`, en orden:**

1. Arma un pozo por eje con los ítems de `estado: "listo"` de ese eje.
2. **Si algún pozo tiene menos de `preguntasPorEje`, tira error y no devuelve partida.**
   No sirve una partida corta. Es la regla que cierra el último agujero del empate: con
   4 preguntas en un eje, un jugador parejo empata y el juego no tiene qué mostrar. Falla
   ruidoso, en build o al abrir el juego, nunca en silencio.
3. Sortea `preguntasPorEje` de cada pozo, sin reposición (Fisher-Yates sobre una copia).
4. **Intercala los dos ejes alternando**, arrancando por un eje sorteado. Cinco preguntas
   seguidas del mismo eje se leen como la misma pregunta cinco veces.
5. Baraja las dos opciones de cada ítem servido (`CTR-08.3`).

**`rnd` es un parámetro con default, no `Math.random` escrito adentro.** Es la única forma
de que el sorteo se pueda testear: con un generador determinista, `node --test` puede
afirmar que salieron exactamente 5 y 5, que no se repite un ítem y que el error salta con
el pozo corto. Un `Math.random()` incrustado convierte esas tres afirmaciones en una
inspección a ojo.

**`resolverCuadrante`:** cuenta los polos elegidos por eje, toma la mayoría de cada uno
—que siempre existe, porque el conteo es impar— y busca el cuadrante cuyo par
`luzOscuridad` / `ordenCaos` coincide.

**Lo que devuelve es tan importante como lo que calcula: no devuelve el conteo.** El tipo
de retorno tiene tres campos y ninguno es un número. Es la forma de hacer cumplir el
criterio 3 de `US-06` desde la arquitectura y no desde la buena intención de quien pinta
la pantalla: **lo que no está en el tipo no se puede mostrar.** Si `experiencia` alguna vez
necesita el "4 a 1", va a tener que pedir un cambio de contrato, que es exactamente la
conversación que hay que tener antes y no después.

**Alternativa descartada: sortear 10 ítems del banco entero sin mirar el eje.** Es la
implementación de una línea y rompe todo: la cantidad por eje pasa a ser aleatoria, sale
un 6 y 4 en cualquier partida, y con 6 el empate vuelve — silencioso, en una de cada
tantas partidas, y sin que nadie lo pueda reproducir. `BR-17` regla 3 habla de la
**partida**, no del banco.

**Alternativa descartada: servir siempre los mismos 10.** Más barato y mata la razón por
la que el piso son 20 y no 10 (`US-06`: dos partidas seguidas pueden no coincidir).

**Fuera de este contrato:** que el juego recuerde qué ítems ya te tocaron entre partidas.
No hace falta para nada de lo de arriba y agregaría `localStorage` a un juego que hoy no
lo necesita. Si se quiere, es de `producto` y `experiencia`.

---

### CTR-08.7 — El bloque normativo, para pegar y correr

Texto normativo. Si la copia en `src/data/_schema/dos-ejes.schema.json` se desincroniza de
esto, **manda esto**, y la copia se regenera en la misma ráfaga.

> **La copia todavía no existe y no tiene tarea asignada en el plan del ciclo 8.** `T-121`
> le pide a `contenido` el JSON del banco y su documento `CNT-09`, pero
> `src/data/_schema/dos-ejes.schema.json` es un archivo de código y no es carpeta de
> `contenido`. **Lo baja el hilo principal**, y tiene que estar antes de que se verifique
> `T-121`: sin la copia, el banco no se puede validar contra nada. Queda señalado en el
> reporte de `T-120`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/dos-ejes/1",
  "title": "CTR-08 — Banco del test de dos ejes",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contrato", "contratoVersion", "juego", "actualizado",
    "preguntasPorEje", "cuadrantes", "items"
  ],
  "properties": {
    "contrato": { "const": "CTR-08" },
    "contratoVersion": { "const": 1 },
    "juego": { "const": "dos-ejes" },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "preguntasPorEje": {
      "comment": "BR-17 regla 3: impar, para que el empate sea imposible.",
      "type": "integer",
      "minimum": 3,
      "maximum": 9,
      "not": { "multipleOf": 2 }
    },
    "cuadrantes": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "items": { "$ref": "#/$defs/cuadrante" }
    },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/item" }
    }
  },
  "$defs": {
    "cuadrante": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "luzOscuridad", "ordenCaos", "nombre", "bajada", "estado"],
      "properties": {
        "id": { "type": "string", "pattern": "^CU-[1-4]$" },
        "luzOscuridad": { "enum": ["luz", "oscuridad"] },
        "ordenCaos": { "enum": ["orden", "caos"] },
        "nombre": {
          "comment": "Registro 1: 8 palabras como techo. Y sin comparativos (US-06, criterio 3).",
          "type": "string",
          "minLength": 3,
          "maxLength": 48,
          "pattern": "^\\S+( \\S+){0,7}$",
          "not": {
            "pattern": "\\b([Mm][áa]s|[Mm]enos|[Mm]ejor|[Pp]eor|[Nn]ivel|[Rr]anking|[Tt]op|[Vv]erdadero|[Ss]uperior|[Ii]nferior)\\b"
          }
        },
        "bajada": { "type": "string", "minLength": 10, "maxLength": 220 },
        "estado": { "enum": ["borrador", "listo"] }
      }
    },
    "item": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "us", "eje", "enunciado", "opciones", "estado"],
      "properties": {
        "id": { "type": "string", "pattern": "^EJ-\\d{3}$" },
        "us": {
          "type": "array",
          "minItems": 1,
          "items": { "type": "string", "pattern": "^US-\\d{2}$" }
        },
        "eje": { "enum": ["luz-oscuridad", "orden-caos"] },
        "enunciado": {
          "type": "string",
          "minLength": 10,
          "maxLength": 120,
          "not": { "pattern": "[Bb]ulacio|[Oo]lavarr|[Cc]roma[ñn]" }
        },
        "opciones": {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": { "$ref": "#/$defs/opcion" }
        },
        "estado": { "enum": ["borrador", "listo", "retirado"] },
        "notaInterna": { "type": "string" }
      },
      "allOf": [
        {
          "comment": "BR-17 regla 1 y 2, eje luz-oscuridad.",
          "if": {
            "required": ["eje"],
            "properties": { "eje": { "const": "luz-oscuridad" } }
          },
          "then": {
            "properties": {
              "opciones": {
                "items": { "properties": { "polo": { "enum": ["luz", "oscuridad"] } } },
                "allOf": [
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "luz" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  },
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "oscuridad" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  }
                ]
              }
            }
          }
        },
        {
          "comment": "BR-17 regla 1 y 2, eje orden-caos.",
          "if": {
            "required": ["eje"],
            "properties": { "eje": { "const": "orden-caos" } }
          },
          "then": {
            "properties": {
              "opciones": {
                "items": { "properties": { "polo": { "enum": ["orden", "caos"] } } },
                "allOf": [
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "orden" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  },
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "caos" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  }
                ]
              }
            }
          }
        }
      ]
    },
    "opcion": {
      "comment": "Sin `correcta`: en un test de identidad no hay respuesta correcta (BR-17).",
      "type": "object",
      "additionalProperties": false,
      "required": ["texto", "polo"],
      "properties": {
        "texto": {
          "type": "string",
          "minLength": 2,
          "maxLength": 72,
          "not": { "pattern": "[Bb]ulacio|[Oo]lavarr|[Cc]roma[ñn]" }
        },
        "polo": { "enum": ["luz", "oscuridad", "orden", "caos"] }
      }
    }
  }
}
```

**Dos detalles de implementación que no son decorativos:**

- `comment` en vez de `$comment` porque `src/lib/esquemas.test.ts` corre ajv con
  `strict: false` justamente para admitirlo, igual que los otros cuatro schemas del repo.
- `minContains` y `maxContains` son de draft 2020-12 y `ajv/dist/2020` los implementa. El
  `$schema` de arriba tiene que quedar tal cual: con un draft anterior, ajv ignora los dos
  y la regla 2 deja de aplicarse **en silencio**.

---

### CTR-08.8 — Lo que el schema NO puede verificar

1. Que los `id` sean únicos dentro del archivo. `uniqueItems` compara objetos enteros.
2. **El piso de 20 y las 10 por eje.** Un schema valida ítems sueltos, no propiedades del
   conjunto. Van a `CTR-08.9`.
3. **Que los cuatro cuadrantes cubran las cuatro combinaciones.** Ídem: es un cruce entre
   los cuatro objetos, no una propiedad de uno.
4. Que el enunciado no presuponga un hecho discutido (`CTR-08.5`, regla 5).
5. **Que las dos opciones de un ítem sean de verdad los dos extremos** y no dos formas de
   decir lo mismo. El schema ve que hay un `luz` y un `oscuridad`; que el texto de la
   opción `oscuridad` sea oscura lo ve `revisor`.
6. **Que un cuadrante no se lea como mejor que otro** aunque no use ninguna palabra de la
   lista negra.
7. Que el texto pase `.claude/rules/voz-ricotera.md`. Eso lo corre `src/lib/voz.test.ts`
   sobre el texto visible, y el oído de quien revisa sobre el resto.

---

### CTR-08.9 — Verificación: qué correr, y quién

`arquitectura` no tiene con qué ejecutar (`D-12`) y no lo simula. **Lo corre el hilo
principal** al cerrar `T-121` y `T-123`, o `revisor` en `T-124`.

```bash
# (1) El banco contra el contrato, item por item: un solo eje, dos polos opuestos,
#     ningun campo de mas, y `preguntasPorEje` impar.
#     Requiere agregar 'dos-ejes' al arreglo de src/lib/esquemas.test.ts (linea 44).
node --test src/lib/esquemas.test.ts

# (2) Las invariantes de conjunto: piso, cuadrantes cubiertos, empate imposible
#     y los cuatro cuadrantes alcanzables. No necesita que el motor exista todavia.
node -e "import('node:fs').then(({readFileSync})=>{const j=JSON.parse(readFileSync('src/data/dos-ejes.json','utf8'));const n=j.preguntasPorEje,f=[],EJ=['luz-oscuridad','orden-caos'];const it=(j.items||[]).filter(x=>x.estado==='listo'),cu=(j.cuadrantes||[]).filter(c=>c.estado==='listo');const pe=e=>it.filter(x=>x.eje===e);if(!Number.isInteger(n)||n%2===0)f.push('preguntasPorEje no es impar: '+n);if(it.length<20)f.push('piso de US-06: '+it.length+'/20 listos');for(const e of EJ){const p=pe(e).length;if(p<10)f.push('eje '+e+': '+p+'/10');if(p<n)f.push('eje '+e+' no alcanza para servir una partida ('+p+'<'+n+')');}const ids=it.map(x=>x.id),du=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];if(du.length)f.push('ids repetidos: '+du.join(', '));const PROH=['correcta','dificultad','peso','puntos','explicacion','fuentes','esLeyenda'];for(const x of j.items||[]){for(const k of PROH)if(k in x)f.push(x.id+': campo prohibido \`'+k+'\` (CTR-08.5 regla 4)');for(const o of x.opciones||[])for(const k of PROH)if(k in o)f.push(x.id+': opcion con campo prohibido \`'+k+'\`');const ps=(x.opciones||[]).map(o=>o.polo).sort().join('+');if(ps!=='luz+oscuridad'&&ps!=='caos+orden')f.push(x.id+': polos '+ps+' (CTR-08.5 reglas 1 y 2)');if((x.eje==='luz-oscuridad')!==(ps==='luz+oscuridad'))f.push(x.id+': el eje declarado no coincide con los polos');}const k=(a,b)=>a+'|'+b,tabla=new Map(cu.map(c=>[k(c.luzOscuridad,c.ordenCaos),c.id]));if(cu.length!==4)f.push('cuadrantes listos: '+cu.length+'/4');if(tabla.size!==4)f.push('las 4 combinaciones no estan cubiertas, hay '+tabla.size+': '+[...tabla.keys()].join(' '));const vis=new Set();let emp=0;for(let a=0;a<=n;a++)for(let b=0;b<=n;b++){if(a*2===n||b*2===n){emp++;continue;}const q=tabla.get(k(a*2>n?'luz':'oscuridad',b*2>n?'orden':'caos'));if(q)vis.add(q);else f.push('resultado sin cuadrante: '+a+'/'+b);}if(emp)f.push('EMPATE POSIBLE en '+emp+' resultados');const inal=cu.filter(c=>!vis.has(c.id)).map(c=>c.id);if(inal.length)f.push('cuadrantes inalcanzables: '+inal.join(', '));const ojo=(j.items||[]).filter(x=>/[Mm]uer|[Ff]alleci|[Ss]olari/.test(JSON.stringify(x)));console.log(f.length?'ROTO:\n- '+f.join('\n- '):'OK CTR-08.9 · '+it.length+' items ('+pe(EJ[0]).length+' + '+pe(EJ[1]).length+') · '+((n+1)*(n+1))+' resultados posibles, 0 empates, 4 cuadrantes alcanzables');if(ojo.length)console.log('PARA LEER CON LOS OJOS (registro 3, voz-ricotera §6): '+ojo.map(x=>x.id).join(', '));})"

# (3) Cuando el motor exista (T-123): que haga lo que dice CTR-08.6.
node --test src/lib/dos-ejes/sorteo.test.ts src/lib/dos-ejes/resultado.test.ts
```

**Por qué el barrido de (2) es una demostración y no una muestra.** El resultado de un eje
depende solo de **cuántas** respuestas fueron a cada polo, no de cuáles ni en qué orden.
Entonces recorrer `a` de 0 a `n` y `b` de 0 a `n` cubre **todos** los resultados que el
juego puede producir: son `(n+1)²` = 36 con `n = 5`. Que ninguno empate y que los cuatro
cuadrantes aparezcan no es una estimación, es la enumeración completa.

Y la cadena que hace válida esa reducción está escrita entera en este contrato: cada ítem
ofrece los dos extremos de su eje (regla 2, la valida el comando 1), así que cualquier
conteo de 0 a `n` es realmente alcanzable por un jugador; el conteo es impar (regla 3), así
que siempre hay mayoría; y los cuatro pares de coordenadas están cubiertos (comando 2). Las
tres cosas juntas son "los cuatro cuadrantes son alcanzables y el empate es imposible".

**Qué chequea la máquina y qué no:**

| # | Chequeo | Quién |
|---|---|---|
| 1 | Un ítem mueve un solo eje (reglas 1 y 2) | comandos (1) y (2) |
| 2 | Ninguna opción es la correcta; ningún campo de más | comandos (1) y (2) |
| 3 | `preguntasPorEje` impar | comandos (1) y (2) |
| 4 | Piso de 20 y de 10 por eje, sobre `estado: "listo"` | comando (2) |
| 5 | Los cuatro cuadrantes cubren las cuatro combinaciones | comando (2) |
| 6 | Empate imposible y cuatro cuadrantes alcanzables, por enumeración | comando (2) |
| 7 | El sorteo sirve 5 y 5, sin repetir, y falla con el pozo corto | comando (3) |
| 8 | Que el resultado no exponga el conteo | comando (3), y el tipo de retorno |
| 9 | Que las dos opciones sean de verdad opuestas | `revisor` |
| 10 | Que ningún cuadrante se lea como el bueno | `revisor` |
| 11 | Que el enunciado no presuponga un hecho | `revisor` |

**El comando (3) todavía no se puede correr** porque `src/lib/dos-ejes/` no existe: lo crea
`T-123`. Los dos primeros sí, apenas `T-121` deje el JSON y el hilo baje la copia del
schema.

---

### CTR-08.10 — Numeración

`EJ-NNN`, tres dígitos, correlativo, **no se reutiliza**. Un ítem que sale de circulación
se marca `"estado": "retirado"` y se queda en el archivo (`Docs/IDS.md`).

**`EJ-990`..`EJ-999` quedan reservados para los ejemplos de esta documentación y no se
cargan nunca en `src/data/dos-ejes.json`.** Hoy está tomado `EJ-999`. Si copiás el bloque
de `CTR-08.3`, cambiale el `id`.

`EJ-` se suma a la lista de prefijos de banco que abrió `CTR-02.7`: `QZ-` quiz · `AT-`
adivinar el tema · `CL-` completar la letra · `TP-` tapa · **`EJ-` test de dos ejes**. Vale
la misma excepción declarada allá: son tres dígitos y no dos porque viven en `src/data/`,
no en `Docs/`, y no se mezclan con ningún `US-`, `ADR-` ni `RES-`. **No edito
`Docs/IDS.md`**, que no es mi carpeta.

Los cuadrantes son `CU-1`..`CU-4`, un dígito, porque son cuatro y siempre van a ser cuatro:
un patrón de dos dígitos sugeriría que puede haber un quinto.

---

### Consecuencias

- **Fácil, y es lo que destraba `T-121`:** `contenido` arranca sin esperar nada. No
  necesita el motor, ni una ficha `RES-XX`, ni una decisión de `experiencia`. Necesita
  `US-06`, `BR-17` y este archivo.
- **Fácil:** rechazar un ítem mal cargado sin discutirlo. Un ítem que mueve dos ejes, o que
  trae una respuesta correcta, no valida, y eso no es opinión de nadie.
- **Fácil:** saber, con un comando, que ninguna partida puede empatar y que los cuatro
  cuadrantes se pueden alcanzar. Es el defecto que el ciclo 7 tuvo abierto un ciclo entero
  —el quiz sirviendo solo preguntas fáciles sin que nadie lo notara— y que solo se ve
  mirando el conjunto.
- **Difícil, y a propósito:** meter una noción de nivel en este juego. No hay `dificultad`,
  no hay `peso`, no hay `correcta`, no hay conteo en el resultado. Cada una de esas cuatro
  ausencias es una línea del schema o del tipo de retorno, y las cuatro habría que
  discutirlas de nuevo con `producto`, que es lo que corresponde.
- **Difícil:** cambiar de 2 opciones a 3. El schema cambia en dos líneas y **todo el banco
  se cae**: con tres opciones, dos polos no alcanzan y aparece el punto intermedio que
  `BR-17` regla 2 prohíbe. La ventana para discutirlo es antes del primer lote.
- **Cambiar `preguntasPorEje` es barato y está previsto.** Se toca un número del JSON, el
  motor lo lee, el comando (2) rehace la enumeración sobre el nuevo valor. Lo único que no
  se puede es ponerlo par: el schema no valida.
- **Lo que le impone a `experiencia` (`T-122`):** el resultado que recibe son tres campos
  —`id`, `nombre`, `bajada`— y **ningún número**. Si la pantalla que tiene en la cabeza
  necesita mostrar "4 a 1" o una barra, es un pedido de cambio de contrato, no un detalle
  de render. Y las dos opciones llegan barajadas: no puede apoyarse en que la primera sea
  siempre la misma.
- **Lo que le impone al hilo principal (`T-123`):** dos funciones puras con el generador
  aleatorio inyectado, y el error ruidoso cuando el pozo no alcanza.
- **Lo que queda pendiente de `arquitectura`, y no lo abro acá:** `ADR-02` define el link
  compartido con `g` (juego), `p` (puntaje) y `t` (total). **Este juego no tiene puntaje**,
  así que necesita un parámetro nuevo que lleve el `id` del cuadrante y ningún número. Es
  una revisión de `Docs/ARQ/ARQ-link-resultado-compartido.md`, que `T-120` no habilita a
  tocar. Lo que este contrato deja fijado por adelantado: **lo que viaja es `CU-N`, nunca
  un conteo** — por lo mismo que dice la alternativa descartada 5.
- **Este contrato no frena nada.** No hay derechos de terceros adentro: el banco es texto
  escrito por `contenido`, sin letra, sin tapa y sin audio.

### Qué NO decide este contrato

- **El texto de las preguntas, las opciones y los cuatro nombres:** `contenido` (`T-121`).
- **Si `UX-02` se reutiliza para un resultado sin puntaje:** `experiencia` (`T-122`).
- **Cuántas preguntas entran en 2 o 3 minutos de verdad:** `experiencia`, midiendo. Si el
  número cambia, cambia `preguntasPorEje` y tiene que seguir siendo impar (`BR-17`).
- **Si el test entra al "Listo" de la v1:** ya está decidido que no (`US-06`, `D-05`).
- **Si alguna vez los 105 temas tienen coordenadas en el plano:** quedó fuera del ciclo 8 y
  sería otro contrato, no este. Ubicar un tema es afirmar algo sobre la obra; ubicar al
  jugador no afirma nada, y todo este documento se apoya en esa diferencia.
