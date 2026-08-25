# ARQ — Formato del link de resultado compartido

> Rol dueño: `arquitectura`. Consume: `D-02` (sin backend), `D-09`, `D-10`, `D-14`,
> `UX-01`, `UX-02`, `BR-19` (partida por vidas), `BR-20` (escalera de `US-07`), `US-06`
> (identidad sin puntaje), `CTR-08`,
> `Docs/SUGERENCIAS/UX-para-arquitectura-formato-link-resultado.md`.
> Produce: `ADR-02` (v1 2026-08-19, **v2 2026-08-25**).
> Última actualización: 2026-08-25 (`T-132`, ciclo 9).

**Vigente: `ADR-02` v2.** La v1 queda abajo entera, sin editar, porque hay links en la
calle armados con ella y porque su sección de alternativas descartadas sigue valiendo.

---

## ADR-02 v2 — Un formato para cuatro clases de resultado

- **Fecha:** 2026-08-25
- **Estado:** **aceptada.** No depende de ninguna evidencia externa.
- **Reemplaza:** `ADR-02` v1, que asumía que todo resultado es un puntaje sobre un total.
- **Pedido por:** `T-132`, sobre `BR-19` apartado 6 y la deuda de `US-06` anotada en
  `ESTADO.md` desde el ciclo 8 (*"`ADR-02` lleva puntaje y este juego no tiene"*).
- **Implementa:** `T-143` (hilo principal). Este documento no trae código.

### Contexto: qué rompió la v1, y por dónde

La v1 fijó `?g=quiz&p=7&t=8`: un juego, un puntaje, un total. Se rompió por dos lados, y
uno de los dos ya estaba roto y nadie lo había arreglado.

1. **`BR-19` sacó al quiz del modelo de puntaje sobre total.** Con tres vidas no hay largo
   fijo: la partida cierra en la pregunta 3 o en la 40, y termina en uno de **tres**
   desenlaces (victoria por agotar el banco, derrota por vidas, **retirada voluntaria**).
   `BR-19` apartado 6 dice, textual, que esos dos campos "no alcanzan para describir
   ninguno de los tres desenlaces".
2. **`US-06` (dos ejes) nunca tuvo puntaje y por eso nunca pudo compartir.** Devuelve una
   identidad en un cuadrante, y `CTR-08.6` lo hace cumplir desde el tipo: `Resultado`
   tiene tres campos y **ninguno es un número** (`src/lib/dos-ejes/partida.ts`). Un
   formato que exige `p` y `t` le cierra la puerta al único juego del sitio que no
   compite. El juego está publicado desde el ciclo 8 sin botón de compartir.

Hay un tercer caso que hoy funciona **torcido** y conviene arreglar de paso: los juegos de
escalera puntúan por paso —hasta 100 por tema, o sea 400 en una vuelta de cuatro (`BR-02`
y `src/lib/tema/escalera.ts` para `US-02`; `BR-20` para `US-07`, con cuatro pasos en vez
de seis)—, pero el tope `t ≤ 100` de la v1 no dejaba pasar ese número. `partida-tema.ts` lo resolvió mandando **temas acertados**
en vez de puntos, y lo dejó documentado (líneas 629-635). El efecto: el texto del tuit
dice "160 de 400" y el link que lo acompaña dice 3 de 4. **Dos números distintos para la
misma partida.**

### Decisión

**Se mantienen los parámetros de consulta en claro. Lo que cambia es que ya no hay una
sola forma de resultado, sino tres — y cuál es se deduce de qué parámetros vinieron, sin
número de versión.**

| Forma | Qué describe | Parámetros | Ejemplo |
|---|---|---|---|
| **`marcador`** | Cuánto sacó sobre cuánto podía | `p` + `t`, **sin** `d` | `?g=tapa&p=7&t=10` |
| **`recorrido`** | Hasta dónde llegó y cómo terminó | `p` + `t` + `d` | `?g=quiz&p=23&t=40&d=retirada` |
| **`identidad`** | Qué le salió. Sin número | `r`, **sin** `p` ni `t` | `?g=dos-ejes&r=CU-3` |

```
https://arcade-ricotero.vercel.app/quiz?g=quiz&p=23&t=40&d=retirada&n=Santi
```

| Param | Qué es | Validación |
|---|---|---|
| `g` | juego | `^[a-z-]{1,20}$`, **y tiene que ser el del juego que lee** (regla 1) |
| `p` | lo alcanzado, en la escala que fija `t` | entero, `0 ≤ p ≤ t` |
| `t` | la escala de `p` | entero, `1 ≤ t ≤ 9999` |
| `d` | desenlace | enum cerrado: `victoria` · `derrota` · `retirada` |
| `r` | identidad | `^[A-Za-z0-9-]{1,12}$`, **y tiene que resolver contra los datos del juego** |
| `n` | nombre de quien comparte | opcional, ≤ 20 caracteres, lista blanca (sin cambios) |

**Todo sigue siendo opcional.** Sin parámetros, es una visita normal (Variante A de
`UX-01`). El desafío es una capa encima de la entrada, nunca un modo aparte.

**Cualquier combinación que no sea exactamente una de las tres formas se ignora entera.**
`r` junto con `p`; `d` sin `p`; `d` con un valor fuera del enum; `t` sin `p`. Todas dan
visita normal. Son estados que solo puede producir un link fabricado a mano o una versión
futura que este código no entiende, y en los dos casos lo honesto es no decir nada: un
`recorrido` sin saber cómo terminó dejaría a la pantalla diciendo "perdió" de alguien que
ganó.

### Qué forma usa cada juego

| Juego | `g` | Forma | `p` es | `t` es |
|---|---|---|---|---|
| `US-01` quiz por vidas (`BR-19`) | `quiz` | `recorrido` | preguntas **respondidas** | el banco entero (hoy 40) |
| `US-04` adivinar la tapa | `tapa` | `marcador` | aciertos | largo de la ronda |
| `US-03` completar la letra | `letra` | `marcador` | aciertos | largo de la ronda |
| `US-02` adivinar el tema | `tema` | `marcador` | aciertos **o** puntos (ver abajo) | la escala elegida |
| `US-07` por la letra | `por-la-letra` | `marcador` | ídem `US-02` | ídem |
| `US-06` dos ejes | `dos-ejes` | `identidad` | — | — |

Tres precisiones que evitan discusión después:

- **En `recorrido`, `p` cuenta preguntas respondidas, no vistas.** Retirarse con la
  pregunta 24 en pantalla sin tocarla da `p=23`. `p=0` es válido y describe a alguien que
  se fue en la primera: si esa partida ofrece botón de compartir lo decide `experiencia`,
  el contrato no lo prohíbe.
- **La victoria de `BR-19` es `p = t` con `d=victoria`.** No hace falta un campo aparte:
  agotar el banco es, por definición, llegar al final del banco.
- **`US-02` puede pasar de temas a puntos cuando quiera, y ahora el tope lo permite** (`t`
  llegó a 9999, y el máximo de `BR-02` es 400 en una vuelta de cuatro temas). **No es de este
  ciclo:** `T-143` no toca `partida-tema.ts`. Lo que sí queda escrito es el costo de ese
  cambio, que es conocido y chico: los links viejos de `tema` dejan de **compararse** con
  los nuevos —cambia la escala— y siguen mostrándose. Ver "qué pasa con un link viejo".

**Lo que `BR-19` apartado 6 pide en pantalla y este formato deliberadamente no manda:**
aciertos sobre respondidas, y vidas restantes en la retirada. No es un olvido — está
argumentado abajo, en "qué se compara" y en las alternativas descartadas. **El resultado
propio y el desafío que viaja no son el mismo dato:** el propio lo tiene la partida entera
en memoria y lo pinta `UX-07`; el que viaja es el mínimo que le sirve a otra persona.

### Reglas duras

1. **Un desafío de otro juego no es un desafío: es ruido.** Si `g` no coincide con el
   juego de la página que lee, se ignora entero. **Esto hoy no se cumple y es un defecto
   vivo:** `src/scripts/partida.ts` línea 44 lee el desafío y lo pinta sin mirar `g`, así
   que `/quiz?g=tapa&p=10&t=10` muestra hoy "Alguien sacó 10/10" en el quiz. Con la escala
   ampliada a 9999 eso pasaría de raro a absurdo. Lo cierra la firma nueva de
   `leerDesafio` (abajo).
2. **Si algo no valida, se ignora el desafío entero y se entra como visita normal.**
   Nunca un mensaje de error, nunca una pantalla rota por una URL mal copiada. Un link
   truncado por un cliente de mensajería degrada a "home", no a "algo salió mal". Sin
   cambios respecto de la v1, y sigue siendo la regla que hace que el link no sea un
   molinete (`D-14`).
3. **`n` es entrada no confiable y se trata como tal.** Se renderiza con `textContent`,
   **nunca** con `innerHTML`, y se filtra a letras, números, espacios, guiones y
   apóstrofos antes de mostrarlo. Sin cambios respecto de la v1. Sigue siendo el único
   agujero de seguridad real que tiene un sitio estático.
4. **Ningún campo nuevo es texto: todos son índices.** Es la forma de que `n` siga siendo
   el único dato de la URL que llega al DOM tal como vino. `d` es un enum cerrado de tres
   valores y lo que se pinta es el copy de `contenido`, no la cadena de la URL. `r` **no
   se muestra nunca**: el juego lo busca en su propio `src/data/*.json` y pinta el
   `nombre` de ahí ("Luna llena"), que es texto propio y auditado. Si `r` no resuelve
   —cuadrante que no existe, o un juego que no tiene identidades— se ignora el desafío. La
   consecuencia es que la clase entera de XSS no se amplía ni un carácter al agregar dos
   parámetros.
5. **La URL entera se mantiene por debajo de ~100 caracteres.** Con el host real
   (`https://arcade-ricotero.vercel.app`, 34) más la ruta, el presupuesto para la query es
   de **60 caracteres**. El peor caso realista mide 45:
   `?g=quiz&p=23&t=40&d=retirada&n=Maria%20Jose`.
6. **Lo recibido no se mezcla con lo propio.** Lo de uno vive en `localStorage`; lo del
   otro vive en la URL y se olvida al navegar. Vale igual para la identidad de `US-06`: el
   cuadrante que llega por link no pisa el propio ni se guarda.

### El dato es manipulable, y sigue aceptado

Cualquiera edita `p=23` a `p=40` en la barra de direcciones, o `d=derrota` a
`d=victoria`. Sin backend no hay forma de impedirlo, y firmar con una clave que viaja en
el propio JavaScript sería teatro. La v1 ya lo decidió y no cambia nada acá; lo único que
agrega la v2 es que ahora también se puede mentir sobre el desenlace, que es igual de
inofensivo: el desafío es social, no competitivo.

### Qué pasa cuando llega un link viejo

**Hay links de la v1 circulando: el sitio está desplegado desde antes de este ciclo.** La
respuesta corta es que **ninguno rompe nada, y no hizo falta escribir un caso especial
para ellos.**

Un link viejo de la v1 (`?g=quiz&p=6&t=8`) es, leído con la v2, un **`marcador`
perfectamente válido**: trae `p` y `t` y no trae `d`. Se lee, se muestra la invitación
—"Alguien sacó 6/8. ¿Te la bancás?"— y esa frase sigue siendo verdad sobre la partida que
describe. Lo que no pasa es que se compare al final, y **eso sale solo de la regla de
comparación**, sin cláusula de compatibilidad: se compara si coinciden `g`, **forma** y
`t`. Un `marcador` de 8 preguntas contra el `recorrido` de 40 del quiz de hoy falla las dos
últimas condiciones.

Por juego, lo que pasa hoy con lo que ya está en la calle:

| Link viejo | Qué hace la v2 |
|---|---|
| `?g=quiz&p=6&t=8` | Muestra la invitación. **No compara** (cambió la forma y la escala) |
| `?g=tema&p=3&t=4` | **Funciona igual que antes, comparación incluida**: sigue siendo un `marcador` de escala 4 y `US-02` sigue armando esa misma escala |
| `?g=tapa&p=7&t=10` | Igual que antes, sin cambios |
| Cualquiera con `n` | El nombre se lee y se limpia con la misma lista blanca de siempre |

**Y la propiedad general, que es lo que hay que recordar dentro de dos meses:** cambiar la
escala o la forma de un juego **no rompe** sus links viejos, los **desengancha de la
comparación**. Es un costo conocido, chico y silencioso — nunca una pantalla de error.

### Qué se compara, y qué no

`comparacion()` (`src/lib/quiz/copy.ts`) hoy compara aciertos sobre total. Con `BR-19` eso
deja de estar definido. **Qué se compara es decisión de este ADR; el copy es de
`contenido` (`CNT-10`, `T-136`).**

**Precondición, para las tres formas: se compara solo si coinciden `g`, la forma y `t`.**
Si no coinciden, se muestra la invitación y no se compara. No se normaliza, no se convierte
y no se inventa un número que nadie jugó.

**Entre dos partidas por vidas (`recorrido`) se compara `p`: la pregunta alcanzada. Nada
más.**

- **Por qué `p` y no los aciertos:** bajo vidas los dos números son casi el mismo. Se
  pierde una vida solo respondiendo mal (`BR-19` apartado 1) y hay tres, así que quien
  llegó a la pregunta `P` tiene entre `P-3` y `P` aciertos. Mandar los aciertos costaría un
  parámetro, una validación y un modo de falla nuevo para agregar, como mucho, tres puntos
  de resolución. No los vale.
- **El desenlace no ordena.** Retirada y derrota **no se ordenan entre sí**, y es a
  propósito. `BR-19` apartado 6 dice que "de los tres solo la derrota se presenta como algo
  que salió mal: retirarse no es perder". Si la retirada valiera más que la derrota,
  cortarse antes se vuelve estrategia; si valiera menos, el sitio castiga al que usó la
  salida limpia que `BR-19` apartado 7 creó justamente para él. Las dos lecturas rompen la
  mecánica. **Entonces: mismo `p`, empate — se haya retirado uno y muerto el otro.**
- **La única excepción, y no la inventé yo:** empate en `p = t` entre una `victoria` y
  cualquier otra cosa lo gana la victoria. Es la respuesta del usuario ya escrita en
  `BR-19` apartado 3 — quedarse sin vidas en la última pregunta es derrota, y *"sin morir"
  manda por sobre "llegó hasta el final"*. Fuera de ese empate exacto, `d` **no entra en la
  cuenta**: entra como rótulo que acompaña al número del otro, porque decir "perdió en la
  23" de alguien que se retiró sería mentir sobre lo que hizo.
- **Victoria contra victoria es empate**, siempre: las dos son `p = t`. Es correcto —
  agotar el banco entero es el techo del juego y no hay grados.

**Entre dos `identidad` (`US-06`) no se compara: se contrasta.** No hay ganador porque no
hay número, y `CTR-08.6` puso el tipo de retorno sin números justamente para que nadie
pudiera fabricar uno más adelante. Los dos casos posibles son *les salió el mismo
cuadrante* y *les salió distinto*, y los dos son un resultado legítimo del juego. Cualquier
orden entre los cuatro cuadrantes sería inventar que hay uno mejor, que es exactamente lo
que `US-06` se propuso no hacer.

**Entre dos `marcador` se compara `p`,** como hasta hoy. Sin cambios.

**Lo que esto le pide a `CNT-10` (`T-136`), para que no se entere tarde:** las variantes
del quiz pasan de tres a cinco situaciones — le ganaste, no le alcanzás, empate, **empate
con victoria de por medio**, y **no comparable** (link de otra época o de otro banco, donde
solo hay invitación). Y en las cuatro primeras, el desenlace del otro aparece como rótulo,
no como jerarquía.

### Qué le pasa a `src/lib/desafio.ts`

Las dos funciones se quedan con el nombre. Cambian de firma y de tipo, y eso es
intencional: un llamador que no se actualiza tiene que **fallar al compilar**, no seguir
andando con la semántica vieja.

- **`Desafio` pasa a ser una unión discriminada por `forma`**
  (`marcador` · `recorrido` · `identidad`), con los campos de cada forma y `nombre?`
  común. Mismo mecanismo que ya usa `src/lib/dos-ejes/partida.ts` y por la misma razón que
  está escrita ahí: *lo que no está en el tipo no se puede mostrar*. Un `identidad` no
  tiene de dónde sacar un puntaje ni por accidente.
- **`leerDesafio(query, juegoPropio)`** — el segundo parámetro es **obligatorio**. Es la
  regla 1 hecha imposible de olvidar: la firma no deja leer un desafío sin decir de qué
  juego sos. Sigue devolviendo `null` para "entraste normal", que nunca es un error.
- **`armarLink(base, desafio)`** — acepta la unión y sigue tirando `RangeError` ante lo
  imposible (`p > t`, `t ≤ 0`, `d` fuera del enum, `r` en un juego sin identidades). Un
  link inválido no se genera: se rompe el build o el test, no la pantalla de la gente.
- **`LARGO_MAX_NOMBRE` y `limpiarNombre` no se tocan.** Incluido el apóstrofo de `FIND-21`.

**Sobre `desafio.test.ts`:** los seis tests de nombre y XSS (`XSS: el nombre nunca
vuelve...`, `FIND-21...`, `la lista blanca...`, el recorte, y los dos de `armarLink`)
**tienen que seguir pasando con las mismas entradas**. Si un ataque de esa batería deja de
estar cubierto, la revisión salió mal. Lo que cambia es la tabla de válidas/inválidas
—gana filas por forma— y `ida y vuelta`, que ahora lleva `forma`. Lo que hay que **agregar**
son cuatro casos, uno por cada cosa que decidió este ADR:

1. un link de la v1 (`?g=quiz&p=6&t=8`) se lee como `marcador` y **no** tira;
2. un desafío de otro juego devuelve `null` (`leerDesafio('?g=tapa&p=1&t=10', 'quiz')`);
3. las combinaciones imposibles devuelven `null`: `r` con `p`, `d` sin `p`, `d=ganó`;
4. `t=9999` entra y `t=10000` no.

### Alternativas descartadas

- **Un formato por juego** (`?g=quiz&preg=23&vidas=0&…` al lado de `?g=tapa&p=7&t=10`).
  Descartada porque multiplica el validador por la cantidad de juegos y porque el próximo
  juego llega con la pregunta de nuevo. Tres formas cubren cuatro juegos y las formas están
  ligadas a **clases de resultado**, no a juegos: si mañana otro juego pasa a vidas, usa
  `recorrido` sin tocar nada.
- **Mandar todo lo que pide `BR-19` apartado 6** (aciertos y vidas restantes además de
  pregunta y desenlace). Descartada por dos motivos separados. Los aciertos, por lo dicho
  arriba: bajo vidas aportan tres puntos de resolución como máximo. Las vidas restantes,
  porque solo existen en la retirada y son un matiz de **tu propia** pantalla —distinguir
  una retirada tranquila de una al límite—; el que recibe el link no puede hacer nada con
  ese dato y no entra en la comparación por la decisión de arriba. Los dos campos siguen
  disponibles en la pantalla propia, que es donde `BR-19` los pide.
- **Un parámetro de versión (`v=2`)**. Descartada porque la forma ya es autodescriptiva:
  la presencia de `d` o de `r` la determina sin ambigüedad. Un `v` gastaría caracteres y
  crearía una segunda fuente de verdad sobre la forma, que puede contradecir a la primera.
  *Queda anotado el día en que haga falta:* si alguna vez dos formas distintas comparten
  exactamente el mismo juego de parámetros, el discriminador deja de alcanzar y hay que
  agregarlo. Hoy no pasa.
- **Normalizar escalas para poder comparar siempre** (23/40 = 57%, contra 6/8 = 75%).
  Descartada porque bajo vidas el porcentaje no significa nada: un banco más grande agrega
  fáciles adelante, así que el mismo porcentaje sobre bancos distintos son dos hazañas
  distintas. Y porque muestra un número que ninguno de los dos jugó.
- **Ordenar los cuatro cuadrantes de `US-06`** para que dos identidades puedan compararse.
  Descartada: convierte un test de identidad en un puntaje, que es exactamente lo que
  `US-06` criterio 3 y `CTR-08.6` prohíben desde el tipo.
- **Payload en base64url, fragmento de hash, acortador externo, HMAC.** Las cuatro siguen
  descartadas por los motivos de la v1, que no cambiaron. Ver abajo.

### Consecuencias

- **Fácil:** `US-06` puede compartir por primera vez. La deuda del ciclo 8 queda saldada
  con la forma `identidad` y sin un solo número. Falta el botón, que es de `experiencia` y
  del hilo principal, no de este ADR.
- **Fácil:** agregar un juego. Si su resultado entra en una de las tres formas —y hasta
  ahora entraron los seis— no se toca `desafio.ts`. La lista de `g` de la tabla es
  documental: el que la hace cumplir es el guardián de juego propio de la regla 1, que es
  conocimiento local de cada isla.
- **Difícil, y hay que hacerlo:** `T-143` toca `partida.ts` en tres puntos, no en uno —
  la firma de `leerDesafio`, la línea de invitación (`subtituloDesafio`, que hoy recibe
  `puntaje, total`) y `comparacion()`. Y `armarLink` en `compartirResultado`, que hoy manda
  `aciertos` y `ronda.length`.
- **Difícil:** `t ≤ 9999` deja pasar números absurdos en un `marcador` fabricado a mano
  ("sacó 9999 de 9999"). Lo acoto con la precondición de comparación —escala distinta, no
  se compara— y lo asumo para la línea de invitación, que ya era manipulable en la v1 y
  cuyo único daño posible es que alguien se engañe a sí mismo.
- **Sin cambios, y sigue siendo la consecuencia que más duele:** **la vista previa del
  tuit no muestra el resultado.** Un sitio estático sirve las mismas metaetiquetas Open
  Graph para las 148 páginas, y **una query string no llega a un `<meta>` que se resolvió
  en el build**: no hay forma de meter ahí ni el puntaje, ni el desenlace, ni el cuadrante.
  Todo esto aparece **al abrir el sitio**, nunca en el timeline. Vale también para el
  desenlace nuevo y para la identidad de `US-06`, que es la tentación fresca: la tarjeta
  que genera `npm run generar-marca-social` es una sola para todo el sitio y así se queda.
  El link lleva el desafío; la imagen de `UX-02` lleva el número.

---

## ADR-02 v1 — Cómo viaja un puntaje dentro de una URL, sin backend

> **[SUPERSEDIDA por `ADR-02` v2 el 2026-08-25.]** Se conserva sin editar: hay links en
> circulación armados con esto, y la v2 se apoya en sus alternativas descartadas en vez de
> repetirlas.

- **Fecha:** 2026-08-19
- **Estado:** **aceptada.** No depende de ninguna evidencia externa: se decide y listo.
- **Pedido por:** `experiencia`, para `UX-01` Pantalla 0 Variante B y `UX-02`.

### Contexto

`D-10` puso la difusión adentro de la v1, y el brief dice que el resultado compartido
**es** la puerta de entrada, no el final de la partida. Para que el que recibe el link vea
"Fulano sacó 7/8, ¿te la bancás?", el puntaje tiene que viajar en la propia URL: no hay
backend donde guardarlo (`D-02`).

### Decisión

**Parámetros de consulta en claro, cortos y legibles.**

```
https://<sitio>/?g=quiz&p=7&t=8&n=Santi
```

| Param | Qué es | Validación |
|---|---|---|
| `g` | juego | enum: `quiz` · `tema` · `letra` · `tapa` |
| `p` | puntaje o aciertos | entero, `0 ≤ p ≤ t` |
| `t` | total posible | entero, `1 ≤ t ≤ 50` |
| `n` | nombre de quien comparte | opcional, ≤ 20 caracteres |

**Todos los parámetros son opcionales.** Sin ninguno, es una visita normal (Variante A de
`UX-01`). El desafío es una capa encima de la entrada, no un modo aparte.

### Reglas duras

1. **Si algo no valida, se ignora el desafío entero y se entra como visita normal.**
   Nunca un mensaje de error, nunca una pantalla rota por una URL mal copiada. Un link
   truncado por un cliente de mensajería tiene que degradar a "home", no a "algo salió
   mal".
2. **`n` es entrada no confiable y se trata como tal.** Se renderiza con `textContent`,
   **nunca** con `innerHTML`, y se filtra a letras, números, espacios, guiones y
   apóstrofos antes de mostrarlo. Es el único agujero de seguridad real que tiene un sitio
   estático: un nombre inyectado desde la URL es XSS reflejado de manual. No es paranoia,
   es la única superficie que existe.
3. **La URL entera se mantiene por debajo de ~100 caracteres**, para que entre cómoda en
   un tuit junto al texto.
4. **El puntaje recibido no se mezcla con el propio.** El de uno vive en `localStorage`;
   el del otro vive en la URL y se olvida al navegar. Nunca se escribe el puntaje ajeno
   en el almacenamiento local.

### El dato es manipulable, y está aceptado

Cualquiera puede editar `p=7` a `p=8` en la barra de direcciones. **Sin backend no hay
forma de impedirlo**, y firmar el número con una clave que viaja en el propio JavaScript
sería teatro: la clave está a la vista de quien abra el bundle.

Lo dejo escrito para que sea una decisión y no un descuido, como pidió `experiencia`. No
agrego checksum: daría sensación de integridad sin darla, y le arruinaría el chiste al que
quiere compartir un 8/8 editado a mano. El desafío es social, no competitivo.

### Alternativas descartadas

- **Payload codificado en base64url** (`?r=eyJwIjo3fQ`). Descartada porque agrega un
  decodificador y un modo de falla nuevo (payload corrupto) a cambio de ocultar un dato
  que no es secreto. Y porque un link opaco da menos ganas de tocarlo: `p=7&t=8` se
  entiende de un vistazo, y eso juega a favor del bucle de compartir.
- **Fragmento de hash** (`#g=quiz&p=7`). Descartada porque en un sitio estático no aporta
  nada que el query no dé, y *supuesto:* algunos generadores de vista previa normalizan o
  descartan el fragmento. Ante dos opciones equivalentes, la convencional.
- **Acortador de URLs externo.** Descartada por lo que ya dijo `experiencia`: mete una
  dependencia de red y de un tercero que el proyecto no tiene en ningún otro lado, y de
  paso le filtra a ese tercero quién comparte qué.
- **Firmar el puntaje con HMAC.** Descartada: ver arriba. La clave estaría en el cliente.

### Consecuencias, y una que `experiencia` necesita saber ya

- **Fácil:** implementarlo. Es `new URLSearchParams(location.search)` y cuatro
  validaciones. Sirve igual para los cuatro juegos.
- **Fácil:** extenderlo. Si `producto` decide agregar la racha o el tiempo, es un
  parámetro más con la misma regla de "si no valida, se ignora".
- **Difícil — y esto cambia una expectativa:** **la vista previa del tuit no va a mostrar
  el puntaje.** Un sitio estático sirve las mismas metaetiquetas Open Graph para todas las
  URLs, así que la tarjeta que arma Twitter es fija: el "Fulano sacó 7/8" aparece recién
  **al abrir el sitio**, no en el timeline. Generar una vista previa por resultado exigiría
  un servicio de imágenes o renderizado en servidor, las dos cosas fuera de alcance
  (`D-02`, costo recurrente cero). *Supuesto verificable si a alguien le importa mucho:
  no pedí ficha porque no cambia la decisión, solo la expectativa.*
  Consecuencia práctica: la imagen compartible de `UX-02` gana peso, porque **la imagen es
  el único canal que lleva el puntaje al timeline**. El link lleva el desafío; la imagen
  lleva el número.
