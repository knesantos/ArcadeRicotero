# ARQ — El reparto compartido: la cuarta forma del link, y el conjunto que se ordena

> Rol dueño: `arquitectura`. **Produce: `ADR-06` + `CTR-13`.** Fecha: **2026-09-03**.
> Versión: **v1**.
>
> **Extiende `ADR-02` v2 (`Docs/ARQ/ARQ-link-resultado-compartido.md`); no lo reemplaza y
> no lo toca.** Las tres formas de allá —`marcador`, `recorrido`, `identidad`— quedan
> exactamente como están, con su validación y sus links en la calle. Lo que este documento
> agrega es una **cuarta forma, `reparto`**, que ninguna de las tres podía describir: `r`
> es `^[A-Za-z0-9-]{1,12}$` y "tiene que resolver contra los datos del juego", así que no
> hay dónde escribir en qué fila quedó cada una de trece fichas.
>
> **Consume** — leído para escribir esto, no recordado: `CLAUDE.md` (la postura, las
> reglas y el "una sola puerta a la web"), `Docs/ARQ/ARQ-link-resultado-compartido.md`
> (`ADR-02` v1 y v2 enteros), `Docs/ARQ/ARQ-schema-dos-ejes.md` (`CTR-08`, por forma y por
> el argumento de "lo que no está en el tipo no se puede mostrar"),
> `Docs/ARQ/ARQ-schema-adivinar-tema.md` (`CTR-03.8`: los tres motivos por los que un
> contrato **no** baja a `.schema.json`), `Docs/DECISIONES.md` (`D-13`, `D-14`, `D-19`,
> `D-21`, `D-22`, `D-33`, `D-34`), `.claude/rules/codigo-juegos.md`,
> `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`.
>
> **Y el código, que para esta decisión es la fuente más dura que hay:**
> `src/lib/desafio.ts` entero, `src/lib/ponelos/filas.ts` entero (ya escrito, y este
> documento se ajusta a él y no al revés), `src/lib/letra/discos.ts`,
> `src/lib/letra/temas.ts` (`leerTemas`, `TemaDelDisco`, `ENCABEZADOS`),
> `src/lib/cancionero/banco.ts` (`FICHAS`, `FichaDisco`), `src/lib/tarjeta/plan.ts` entero,
> `src/lib/islas.test.ts` (qué mira y qué no), `scripts/generar-tapas.mjs` (las tres formas
> derivadas y sus rutas), `public/tapas/`.
>
> **Habilita:** la isla y la página de `US-08` ("Ponelos en fila", `/juegos/ponelos-en-fila/`),
> el botón de compartir y la lámina.
>
> **No resuelve, y no se mete:** cómo se ve el tablero, dónde va la bandeja, qué pasa en
> pantalla cuando llega un reparto ajeno y con qué palabras — eso es `UX-23`
> (`experiencia`); los nombres visibles de las filas y del juego, y el texto del crédito
> impreso — eso es de `contenido`; si el juego entra al "Listo" de la v1 y cuál es su piso
> — eso es `US-08` y `BR-22` (`producto`); `D-36` lo escribe el hilo principal.

---

## De dónde sale cada afirmación de este documento

| Lo que digo | De dónde sale |
|---|---|
| Las cuatro filas valen 1..4 y "sin ubicar" vale 0 | `src/lib/ponelos/filas.ts`, ya en el repo (`FILAS`, `SIN_UBICAR`) |
| Tres bits alcanzan y sobran tres valores | `MAX_FILAS_CODIFICABLES = 7` en ese mismo archivo |
| Los diez discos y su orden | `src/lib/letra/discos.ts` (`DISCOS`) |
| Los 105 temas, con disco y número de pista | `leerTemas()` sobre `RES-20`, `src/lib/letra/temas.ts` |
| Los títulos y años de los discos, y la ruta de su tapa | `FICHAS` (`src/lib/cancionero/banco.ts`) y `public/tapas/<slug>.jpg`, 320 px, que produce `scripts/generar-tapas.mjs` |
| `plan.ts` no sirve para la lámina | `MAX_FILAS = 6` y el `RangeError` de `planificar()`, líneas 160 y 172-175 |
| Un `import type` no arrastra `node:fs` a la isla | `src/lib/islas.test.ts`, la nota de `importaciones()` |
| Un fragmento no llega al servidor | Es la definición de fragmento en RFC 3986 §3.5: se resuelve del lado del cliente. **Lo que no afirmo de memoria** es qué hace cada previsualizador con él: ver `ADR-06.3` |

**Lo que este documento NO afirma sin ficha.** No digo qué hace WhatsApp, Telegram o X con
una dirección que trae `#`. Digo lo único que se deduce del formato —un previsualizador
que pide la página al servidor no recibe el fragmento— y dejo la consecuencia escrita como
**la peor de las dos**: la tarjeta del enlace sale genérica. Si alguien alguna vez quiere
el detalle por cliente, es ficha `RES-XX` de `investigador`; **no cambia la decisión**,
porque la alternativa (la query) ya está descartada por otro motivo más fuerte.

---

## ADR-06 — El reparto viaja en el fragmento, en tres bits por ficha

- **Fecha:** 2026-09-03
- **Estado:** **aceptada.** No depende de ninguna evidencia externa: es formato y
  aritmética, las dos verificables con `node --test` sin salir a ninguna red.
- **Extiende:** `ADR-02` v2. Cuarta forma, `reparto`.
- **Pedido por:** el hilo principal, para `US-08`.

### ADR-06.1 — Contexto: qué no entra en `ADR-02`

"Ponelos en fila" no produce ni un puntaje ni un desenlace ni una identidad: produce **una
función de las fichas a las filas**. Diez o trece valores, cada uno de cinco posibles.
`ADR-02` v2 tiene tres formas y ninguna la describe:

- `marcador` y `recorrido` piden `p` y `t`, dos enteros. Acá no hay puntaje y **no puede
  haberlo**: `BR-22` lo hereda de `BR-17`, y el sitio no tiene un orden correcto de los
  temas de esta banda. Un número sería inventar que sí.
- `identidad` manda `r`, hasta doce caracteres que **tienen que resolver contra los datos
  del juego**. Trece posiciones no resuelven contra nada: no son un objeto del banco, son
  una combinación de las 5¹³ que el jugador armó recién.

Y la tentación obvia —trece parámetros, o uno con comas: `?f=1,1,2,3,2,4,0,3,2,1`— cruza
una línea que `ADR-02` regla 5 puso a propósito: la dirección se va a 150 caracteres, y el
día que alguien ordene los 105 temas se va a 400.

### ADR-06.2 — Decisión: la gramática del fragmento

```
https://arcade-ricotero.vercel.app/juegos/ponelos-en-fila/?g=ponelos#o=1.tapas.iSZiCg
```

Dos mitades, y hacen dos trabajos distintos:

| Parte | Qué es | Por qué está |
|---|---|---|
| `?g=ponelos` | El juego, en la query, como en las otras tres formas | Regla 1 de `ADR-02`: un reparto de otro juego es ruido, y el mecanismo para descartarlo es el mismo de siempre. Si mañana un segundo juego usa la forma `reparto`, el fragmento solo no alcanzaría para saber de quién es |
| `#o=1.tapas.iSZiCg` | El reparto | El fragmento no viaja al servidor (`ADR-06.3`) |

**La forma `reparto` no lleva `n`, y no es un olvido: es la única de las cuatro en la que
ningún campo es texto.** Ver `ADR-06.6`.

**La gramática del fragmento, entera:**

```
fragmento  = "o=" version "." conjunto "." carga
version    = 1*2DIGIT                 ; hoy siempre "1"
conjunto   = slug                     ; ^[a-z0-9]+(-[a-z0-9]+)*$, 1..40 caracteres
carga      = 1*80(ALPHA / DIGIT / "-" / "_")   ; base64url, sin relleno
```

| Parte | Alfabeto | Techo | Por qué ese techo |
|---|---|---|---|
| clave `o` | la letra `o`, de *orden* | 1 | **Si el fragmento no empieza con `o=`, no es un reparto y no se toca.** El sitio usa anclas normales (`#ficha-3`) y tienen que seguir andando |
| `version` | dígitos | 2 | Ver `ADR-06.5`: es lo que impide que un cambio de orden se lea mal en silencio |
| `conjunto` | el patrón de slug de `CTR-01.4`, el mismo que produce `slugDeTitulo()` | 40 | El id más largo de los catorce mide 33 (`temas-un-baion-para-el-ojo-idiota`). 40 deja aire y no habilita un párrafo |
| `carga` | base64url: `A-Z a-z 0-9 - _` | 80 | 80 caracteres son 60 bytes, 160 fichas. El tope real de ítems es `MAX_ITEMS_REPARTO = 120`; el largo exacto lo decide el conjunto, no el regex (paso 6 de `ADR-06.4`) |

El separador es `.` y no aparece en el alfabeto de ninguna de las tres partes, así que
partir en tres no tiene ambigüedad. Las cinco clases de caracteres que usa el fragmento
—letras, dígitos, `-`, `_` y `.`— son todas `unreserved` de RFC 3986: **nada de esto se
codifica en porcentaje**, así que lo que se copia es lo que se pega.

#### El empaquetado: tres bits por ficha, LSB primero

Cada ficha del conjunto ocupa **tres bits**, en el orden canónico de `CTR-13.4`:

| Valor | Qué significa |
|---|---|
| `0` | sin ubicar (`SIN_UBICAR`, en la bandeja) |
| `1..4` | las cuatro filas, por el `id` de `FILAS` (`valla`, `medio`, `atras`, `vereda`) |
| `5..7` | **reservados.** Hoy no los produce nadie y un link que los traiga se ignora entero |

La ficha `i` ocupa las posiciones de bit `3i`, `3i+1` y `3i+2`. Cada posición `b` cae en el
byte `b >> 3`, en el bit `b & 7`, **contando desde el bit menos significativo**:

```
escribir(v, i):  para k en 0,1,2:  si (v >> k) & 1:  bytes[(3i+k) >> 3] |= 1 << ((3i+k) & 7)
leer(i):         v = suma sobre k de ((bytes[(3i+k) >> 3] >> ((3i+k) & 7)) & 1) << k
```

Los bits que sobran en el último byte se escriben en **cero** y al leer **se ignoran**: son
como mucho siete bits que no describen ninguna ficha, y rechazar un link por ellos sería
cerrar un molinete por decoración.

`bytes = ceil(3n / 8)`, y la carga es esos bytes en base64url **sin relleno**. El relleno
no hace falta porque el largo se deduce del conjunto, y `=` es el carácter que más se
rompe al copiar y pegar.

| Fichas | Bits | Bytes | Caracteres |
|---|---|---|---|
| 10 (los discos, las tapas, las aperturas, los cierres) | 30 | 4 | **6** |
| 13 (el disco más largo) | 39 | 5 | **7** |
| 105 (los temas enteros, que hoy no es un conjunto) | 315 | 40 | **54** |

**Un ejemplo completo, para que el que implemente tenga contra qué probar.** Conjunto
`tapas`, diez fichas en el orden de `DISCOS`, repartidas
`[1, 1, 2, 3, 2, 4, 0, 3, 2, 1]` — o sea *Gulp!* y *Oktubre* contra la valla, *Cordero
atado* sin ubicar, *Lobo suelto* en la vereda. Los cuatro bytes salen
`0x89 0x26 0x62 0x0A` y la carga es **`iSZiCg`**. La dirección entera mide 85 caracteres.

#### El presupuesto de largo, que sube y queda medido

`ADR-02` regla 5 fijó *"la URL entera por debajo de ~100 caracteres"*. **Esta forma lo sube
a 130 y deja el peor caso medido en 114**: host (34) + ruta (24) + `?g=ponelos` (10) +
`#o=1.temas-un-baion-para-el-ojo-idiota.XXXXXXX` (46).

Se sube en vez de acortar los ids, y el motivo importa: el id del conjunto es **lo único
legible que tiene el link**, y es lo que permite saber de qué lista se está hablando
mirando la dirección. Cambiarlo por `t3` ahorraría 30 caracteres y crearía una tabla de
traducción entre un código y un conjunto — es decir, **una segunda verdad sobre el orden
canónico**, que es exactamente lo que `ADR-06.5` existe para evitar. Y la razón por la que
el techo de 100 estaba puesto —que entre cómoda en un tuit junto al texto— no se rompe con
114.

### ADR-06.3 — Por qué el fragmento y no la query

**Lo bueno: el fragmento no viaja al servidor.** Cuando el navegador pide
`/juegos/ponelos-en-fila/?g=ponelos#o=1.tapas.iSZiCg`, lo que sale a la red es la ruta y la
query; el `#` y todo lo que sigue se quedan del lado del cliente y los resuelve la página.
En un sitio estático sobre un hosting de terceros eso tiene una consecuencia concreta y no
teórica: **el reparto de alguien no entra en ningún registro de acceso, ni nuestro ni de
Vercel.** Es la misma línea que ya siguen `correccion/armar.ts` y `tarjeta/plan.ts` —*"lo
que no se junta no se puede filtrar"*—, aplicada al único dato nuevo que este juego produce.
Una lista de cómo alguien ordena diez discos es inofensiva y no cambia nada: **lo que no
hace falta que salga, no sale.**

**Lo malo, y hay que decirlo entero: ningún previsualizador de enlaces lee lo que va
después del `#`.** Un previsualizador pide la página al servidor, y al servidor el
fragmento no le llegó nunca. Así que la tarjeta que arma el cliente de mensajería es la
genérica del sitio, la misma para las 148 páginas — exactamente lo que `ADR-02` v1 ya había
escrito como *"la consecuencia que más duele"*, ahora por un motivo distinto y con la misma
forma.

**No es un defecto de esta decisión, y acá se nota más que en los otros juegos: la imagen
ES el previsualizador.** La lámina PNG (`ADR-06.8`) es la pieza que viaja y la que muestra
el reparto; la dirección es el molinete abierto que va abajo, para el que quiera armar la
suya. Con la query pasaría lo mismo —`ADR-02` v1 y v2 lo dejaron demostrado: una query
string no llega a un `<meta>` que se resolvió en el build—, así que **el fragmento no cuesta
nada y compra que el dato no salga del teléfono**.

*Alternativa descartada:* la query, `?g=ponelos&o=1.tapas.iSZiCg`. Descartada por lo de
arriba. No gana previsualización —no la gana nadie en un sitio estático— y pierde lo único
que la otra opción da gratis.

### ADR-06.4 — Validación, y qué pasa con un fragmento inválido

**La respuesta corta, y es la regla que manda sobre todas las de abajo: se ignora entero y
el juego abre normal.** Nunca un mensaje de error, nunca una pantalla rota, nunca un
"link inválido". Es la regla 2 de `ADR-02` sin un cambio, y es lo que hace que el link no
sea un molinete: **un link roto no puede dejar a nadie afuera** (`D-14`).

`leerReparto` devuelve `null`, que significa "entraste normal" y no "hubo un error". Los
siete pasos, en orden, y cualquiera que falle da `null`:

1. La dirección parsea como URL. Si no, `null`.
2. `g` está y vale el juego propio (`ponelos`). Regla 1 de `ADR-02`, mismo mecanismo.
3. El fragmento empieza con `o=`. **Si no, no es un reparto: se devuelve `null` sin mirar
   nada más**, y las anclas normales del sitio siguen funcionando.
4. Lo que sigue parte en exactamente tres con `.`, y las tres partes matchean su alfabeto.
5. `version` es `1`. **Una versión que este código no conoce se ignora en silencio** — es
   lo contrario de adivinar, y es todo el propósito del campo (`ADR-06.5`).
6. El conjunto **resuelve** contra el catálogo de `CTR-13`, y la carga decodifica a
   **exactamente** `ceil(3n / 8)` bytes, con `n` = cuántas fichas tiene ese conjunto. Un
   byte de más o de menos es un link de otro conjunto, o truncado por un cliente de
   mensajería, o inventado: en los tres casos no describe nada real.
7. Los `n` valores caen en `0..4`. Un `5`, `6` o `7` está reservado y hoy no lo produce
   nadie: viene de un link fabricado a mano o de un futuro que este código no entiende, y
   en los dos casos lo honesto es no decir nada. **Se ignora el reparto entero, no la ficha
   suelta** — pintar como "sin ubicar" una ficha que el otro puso en algún lado sería
   mentir sobre lo que hizo, que es la misma razón por la que `ADR-02` rechaza un
   `recorrido` sin desenlace.

Y la regla 6 de `ADR-02` se hereda tal cual: **lo recibido no se mezcla con lo propio.** El
reparto que llega por link vive en la URL y se olvida al navegar; no pisa el propio ni se
escribe en `localStorage`.

### ADR-06.5 — El orden canónico no viaja, y por eso el primer campo es una versión

Esto es lo más caro de revertir de todo el documento, así que va con nombre.

La carga son valores **posicionales**: el tercer grupo de tres bits es la tercera ficha del
conjunto, y **qué ficha es eso no viaja en la dirección**. Lo fija el orden canónico de
`CTR-13.4`: el orden de `DISCOS` y, dentro de un disco, el número de pista.

**La consecuencia, escrita para dentro de dos meses: si ese orden cambia, los links viejos
se leen mal en silencio.** No fallan, no avisan, no se rompe nada visible: la ficha 7 pasa
a ser otra y la lista que alguien compartió muestra otra cosa. Es el peor modo de falla que
existe, porque nadie lo ve.

Tres cosas lo cambian sin que nadie se dé cuenta: que se agregue o se reordene un disco en
`DISCOS`, que `RES-20` corrija una numeración de pista, y que aparezca o desaparezca un
tema de un tracklist.

**Por eso `version` es el primer campo, y por eso hay una regla dura:**

> **Cualquier cambio en el orden canónico de un conjunto que ya existe obliga a subir
> `version` a `2`.** Con la versión subida, los links viejos caen en el paso 5 y se ignoran
> —visita normal, tablero vacío— en vez de mostrar una lista que nadie armó.

Y para que la regla no dependa de que alguien se acuerde, `CTR-13.6` deja pedida una
**prueba de huella**: el test guarda la huella del orden de cada conjunto y falla el día que
cambie. El que la rompa tiene que elegir a mano entre revertir y subir la versión. Es el
mismo criterio con el que `ADR-02` cerró lo del juego ajeno: se arregla en un lugar donde
no se puede olvidar, no en la buena memoria de cada sitio de llamada.

*Alternativa descartada:* **mandar el orden adentro del link** (los slugs, o los índices).
Es lo que lo haría autodescriptivo y sería honestamente mejor si el link fuera opaco para
siempre — pero el conjunto más chico pasa de 6 caracteres a más de 200, y el de trece a
más de 300. El link deja de entrar en un mensaje y el juego pierde lo único que lo hace
compartible.

*Alternativa descartada:* **una huella corta del orden adentro del link** (tres o cuatro
caracteres de hash, y si no coincide se ignora). Convierte el modo de falla silencioso en
uno ruidoso por 4 caracteres, y es tentador. Se descarta porque hace exactamente lo mismo
que la versión —invalidar los links viejos cuando el orden cambia— pero **sin que nadie se
entere de por qué**, y porque la versión ya hace falta igual para cualquier otro cambio de
formato. Dos mecanismos para un solo trabajo es uno de más. *Cuándo se retoma:* el día que
el orden canónico cambie sin que nadie suba la versión. Ahí la huella deja de ser
redundante y se agrega en `version = 2`.

### ADR-06.6 — Por qué se escribe en `src/lib/desafio.ts`

`src/lib/desafio.ts` se abre, hoy, con esta frase:

> *"**Este archivo es la unica puerta por la que entra dato de afuera a todo el sitio.** No
> hay backend, no hay login, no hay formularios: la URL es la unica superficie de entrada
> que existe."*

**Escribir el lector del reparto en un módulo aparte volvería falsa esa frase**, y eso es
peor que la duplicación que ahorraría: la mitad nueva de la puerta quedaría sin el
encabezado que explica por qué las dos reglas de abajo no son celo, y el próximo que
audite la superficie de entrada del sitio va a abrir un archivo y a creer que la vio
entera. Un dato que entra por el fragmento es dato de afuera igual que uno que entra por la
query.

Va, entonces, en el mismo archivo:

- **`Desafio` gana un cuarto miembro en la unión discriminada:**
  `{ forma: 'reparto'; juego: string; conjunto: string; casillas: readonly number[] }`.
  Mismo mecanismo que las otras tres y por la misma razón escrita allá: *lo que no está en
  el tipo no se puede mostrar*. Un `reparto` no tiene de dónde sacar un puntaje ni por
  accidente, que es lo que `BR-22` necesita de la arquitectura.
- **`armarLink(base, desafio)` lo arma**, escribiendo `g` en la query y el `o=` en el
  fragmento, y sigue tirando `RangeError` ante lo imposible: `casillas` vacío o de más de
  `MAX_ITEMS_REPARTO` (120), un valor que no sea entero de 0 a 4, un `conjunto` que no
  matchee el patrón de slug. **Un link inválido no se genera:** se rompe el test, no la
  pantalla de la gente.
- **`leerDesafio(query, juegoPropio)` no cambia de firma y no lee repartos**, porque el
  reparto no está en la query. Lo lee una función nueva **en el mismo archivo**:

  ```
  leerReparto(direccion: string, juegoPropio: string, fichasDelConjunto: (id: string) => number | null)
      -> { forma: 'reparto', juego, conjunto, casillas } | null
  ```

  El tercer parámetro es una **función que dice cuántas fichas tiene un conjunto, o `null`
  si ese conjunto no existe**, y es lo que hace el paso 6 de la validación. Va como
  función y no como tabla importada por un motivo concreto: **`desafio.ts` hoy no importa
  nada**, y esa es la condición para que lo pueda importar cualquiera de los dos lados.
  El catálogo de `CTR-13` se arma en build con `node:fs`; si `desafio.ts` lo importara,
  `islas.test.ts` tendría razón en fallar y se llevaría puestos los seis juegos que ya lo
  usan.

*Alternativa descartada:* **meter el reparto adentro de `leerDesafio`**, con un tercer
parámetro obligatorio. Es lo más parecido a las otras tres formas y se descarta porque
obligaría a los seis juegos que no tienen reparto a pasar un catálogo que no tienen, para
leer algo que nunca les va a llegar. La firma de `leerDesafio` se cambia cuando cambia la
semántica de todos, como hizo `ADR-02` v2 con `juegoPropio`; no para agregarle un caso a
uno solo.

*Alternativa descartada:* **`src/lib/ponelos/link.ts`**, al lado de `filas.ts`. Descartada
por la frase de arriba. Es la opción prolija por carpeta y la equivocada por superficie.

#### Las dos reglas de seguridad heredadas, y cómo se cumplen acá

**1. Ningún campo es texto: todos son índices.** Es la regla 4 de `ADR-02` v2, y esta forma
es **la única de las cuatro que la cumple entera**:

- `casillas` son números de 0 a 4 y se usan para elegir una fila de `FILAS`; lo que se
  pinta es el `nombre` de ahí, que es texto propio y auditado.
- `conjunto` es un slug que **no se muestra nunca**: se busca en el catálogo de `CTR-13` y
  se pinta el `nombre` del conjunto, que también es texto propio. Si no resuelve, se ignora
  el reparto. Es exactamente lo que hace `r` en `ADR-02`.
- **`n` no existe en esta forma.** El nombre de quien comparte es el único dato de la URL
  que llega al DOM tal como vino, y acá no hace falta: no hay un "Fulano sacó 7 de 8" que
  contar, hay una lista que se mira. Sacarlo deja la clase entera de XSS sin un solo
  carácter nuevo de superficie, y de paso ahorra 20 caracteres en la forma más larga.
  *Cuándo se revierte:* si `experiencia` demuestra que la pantalla lo necesita, es un
  cambio de contrato y vuelve con `limpiarNombre` y `textContent`, que ya están escritos y
  testeados. No se improvisa en un componente.

**2. El reparto no se puede confiar, y está bien.** Cualquiera edita el fragmento en la
barra de direcciones y se pone las diez tapas contra la valla. Sin backend no hay forma de
impedirlo, y firmarlo con una clave que viaja en el propio JavaScript sería teatro
(`ADR-02` v1, y no cambió nada). Acá **cuesta todavía menos que en los otros juegos**:
`BR-22` dice que no hay respuesta correcta, así que no hay nada sobre lo que mentir. No hay
puntaje que inflar, no hay ranking que ensuciar, no hay comparación contra un promedio que
el sitio no tiene y no va a tener. **El único costo de mentir es engañarse a sí mismo**, y
ni siquiera está claro en qué consistiría la mentira.

### ADR-06.7 — Consecuencias

- **Fácil:** compartir. Son cuatro bytes, seis caracteres y ninguna llamada de red.
- **Fácil:** agregar un conjunto. Si tiene entre 1 y 120 fichas, el formato no se toca:
  entra al catálogo de `CTR-13` con su id y listo. La versión no se mueve — **agregar un
  conjunto nuevo no cambia el orden canónico de ninguno de los que ya existen.**
- **Fácil:** que las filas sean cinco o seis algún día. Los valores 5, 6 y 7 están
  reservados y el ancho no cambia. Lo que sí habría que mirar ese día es que un link viejo
  no queda mal leído (no queda: 0..4 siguen significando lo mismo).
- **Difícil, y a propósito:** cambiar el orden canónico. `ADR-06.5` y la prueba de huella
  lo convierten en una decisión con firma, no en un efecto colateral de tocar `DISCOS`.
- **Difícil:** mostrar el reparto ajeno en el previsualizador del mensaje. No se puede, y
  no se va a poder sin renderizado en servidor, que está fuera de alcance (`D-02`). Por eso
  la lámina.
- **Lo que le impone a `experiencia` (`UX-23`):** que el juego abra igual con un fragmento
  roto, con un fragmento de otra versión y sin fragmento — las tres son la misma pantalla.
  Y que el reparto recibido se presente como *lo que armó otra persona*, sin comparar contra
  el propio: no hay contra qué, y `BR-22` dice que no lo habrá.
- **Lo que le impone al hilo principal:** el cuarto miembro de la unión, `leerReparto` con
  el resolvedor inyectado, y que **los seis tests de nombre y XSS de `desafio.test.ts`
  sigan pasando con las mismas entradas**. Si un ataque de esa batería deja de estar
  cubierto, la revisión salió mal.

### ADR-06.8 — La lámina PNG: por qué necesita su propio módulo de planta

**La lámina es la pieza que viaja**, por lo de `ADR-06.3`: 1080 × 1350, el mismo vertical
de celular que ya eligió `tarjeta/plan.ts`, con las cuatro filas, sus fichas y el crédito.

**Y no puede salir de `plan.ts`, por dos motivos que están escritos en el propio archivo.**
El primero es aritmético: `MAX_FILAS = 6` y `planificar()` **tira `RangeError`** fuera de
1..6 — y no por capricho, sino porque ese módulo reparte una banda entre filas de un
setlist y una fila más flaca que el piso no se lee. El segundo es de forma: `plan.ts`
planifica **una lista de temas con un número grande abajo** (`hero`, `puntaje`, `rotuloHero`),
y este juego no tiene ningún número grande que poner ahí. Meterle una rama `if (esReparto)`
al módulo que ya usan `US-02` y `US-07` es la manera más rápida de romperles la tarjeta a
los dos.

**Decisión: `src/lib/ponelos/lamina.ts`, módulo propio, que planifica y no dibuja.** Sin un
solo `ctx.` adentro, igual que `plan.ts` y por la misma razón escrita allá: un canvas no
existe en Node, así que todo lo que viva del lado del dibujo es código que ningún test
puede mirar.

**Lo que sí reusa de `tarjeta/plan.ts`, importándolo:** `LIENZO`, `MARGEN`, `ANCHO_UTIL`,
`FRANJA`, `INTERLINEA`, `cuerpoQueEntra()` y `partirEnLineas()`. Son medidas y funciones
puras, y compartirlas es lo que hace que las dos piezas se reconozcan como del mismo lugar.
**Lo que no reusa es `planificar()`**, que es justamente lo que no sirve.

Lo que el módulo tiene que garantizar, y son las tres cosas que un test puede probar:

1. **No desborda, nunca.** Las cuatro bandas más el encabezado, el crédito y el pie entran
   en 1350 px o `planificarLamina()` tira `RangeError`. El alto de cada banda sale de
   cuántos renglones de fichas necesita, con un **piso por banda** para que su sello se lea
   aunque esté vacía: una fila vacía es información y tiene que verse.
2. **El bloque del crédito existe siempre y no hay bandera para apagarlo.** Es la condición
   1 de `D-21` hecha estructura: **el crédito a Rocambole va impreso adentro de la imagen**.
   Una lámina con diez tapas saliendo a un timeline es el caso exacto que quedó anotado en
   `D-33` —*"una tapa afuera del sitio viaja sin su crédito"*—, y acá se cierra: la lámina
   **es** el afuera, así que el crédito se imprime adentro de la pieza o la pieza no existe.
   Si no entra el alto del crédito, `RangeError`.
3. **No lleva ningún dato de la persona.** Ni nombre, ni aparato, ni de dónde entró — lo
   mismo que `plan.ts` y `correccion/armar.ts`, y por el mismo motivo. La lámina dice cómo
   quedó la lista y se calla.

Y un techo: `MAX_FICHAS_LAMINA`. Los conjuntos de hoy llegan a 13 y el módulo no tiene por
qué saber dibujar 105 fichas en una hoja de celular; fuera del rango, `RangeError`, que es
un test roto y no una imagen con el pie cortado compartida sin que nadie lo note. Es
literalmente el defecto que `plan.ts` documenta haber tenido.

*Alternativa descartada:* **subir `MAX_FILAS` a 10 y reusar `planificar()`**. Descartada:
las filas de la lámina no son las filas del setlist —una fila de acá contiene fichas, no un
título— y el reparto proporcional que necesita esta pieza es otro. Tocar un módulo que dos
juegos ya usan para servir a un tercero que necesita otra cosa es cómo se rompen los dos
primeros.

*Alternativa descartada:* **una imagen por fila y que la isla las apile en el DOM**.
Descartada porque lo que se comparte tiene que ser **un** archivo: cuatro imágenes sueltas
no son una lámina, y el crédito quedaría en una sola de las cuatro.

---

## CTR-13 — El conjunto ordenable

- **Fecha:** 2026-09-03
- **Estado:** **vigente, sin valores abiertos.** No espera ninguna ficha `RES-XX`: todo el
  dato ya está en el repo y **este contrato no agrega ni una afirmación sobre la banda**.
  Ordenar diez discos no afirma nada; los títulos, los años y las pistas ya vienen
  fichados de `RES-20` y de `FICHAS`.
- **Para quién es:** para el hilo principal, que arma la página y la isla; para
  `experiencia`, que sabe qué campos tiene para pintar; para `revisor`, que tiene que poder
  rechazar un conjunto sin preguntarle nada a nadie.
- **Qué NO es:** **no es un banco.** No hay `src/data/ponelos*.json`, no hay prefijo de ID
  nuevo y `CTR-02.7` no gana una línea. Ver `CTR-13.3`.

### CTR-13.1 — El tipo

Vive en `src/lib/ponelos/conjuntos.ts`. Es lo que la página arma **en build** y lo que
viaja al navegador por `<script type="application/json">`.

```ts
/** Cómo se ve una ficha del tablero. Lo decide el conjunto, no la ficha. */
export type FormatoFicha = 'tapa' | 'titulo';

export interface FichaOrdenable {
  /** Único dentro del conjunto. Patrón de slug. Es lo que la isla usa como clave. */
  readonly slug: string;
  /** Lo que se lee. Texto propio, derivado de `RES-20` o de `FICHAS`. */
  readonly titulo: string;
  /** El slug del disco: de acá salen la tinta (`--cat-*`, `RES-37`) y la ruta de tapa. */
  readonly disco: Disco;
  /** Ruta pública de la imagen, o `null` si esta ficha no lleva imagen. */
  readonly imagen: string | null;
}

export interface ConjuntoOrdenable {
  /** Lo que viaja en el fragmento (`ADR-06.2`). Slug, ≤ 40 caracteres. */
  readonly id: string;
  /** Cómo se nombra en pantalla. Registro 3 de `voz-ricotera.md`: dice qué hay adentro. */
  readonly nombre: string;
  readonly formato: FormatoFicha;
  /** **En el orden canónico de `CTR-13.4`.** El índice es la posición en la carga. */
  readonly items: readonly FichaOrdenable[];
}
```

**Cuatro campos en la ficha y ninguno más.** No hay `anio`, no hay `pista`, no hay
`popularidad`, no hay `dificultad` y **no hay `orden` ni `posicionCorrecta`**. La última
ausencia es la que importa: `BR-22` dice que no hay respuesta correcta, y este tipo no
tiene dónde escribir una. Es el mismo mecanismo de `CTR-08.5` regla 4 —la forma hace
imposible lo prohibido— aplicado a un tipo de TypeScript en vez de a un schema.

**`imagen` es `string | null` y el `null` es un valor declarado, no un hueco.** Un conjunto
de formato `titulo` trae las diez rutas en `null` y sigue siendo válido; lo que no puede
pasar es que un conjunto `tapa` traiga una ficha sin imagen (`CTR-13.6`, chequeo 4).

**`disco` está incluso cuando la ficha no lleva imagen**, y no es redundancia: es de donde
sale la tinta con la que se raya la ficha, igual que en `FilaTarjeta` de `plan.ts`. Que un
tema se vea del color de su disco es lo que hace que un conjunto de trece títulos no sea
una lista de texto gris.

### CTR-13.2 — Los catorce conjuntos

| id | Nombre (lo escribe `contenido`) | Formato | Fichas | De dónde sale |
|---|---|---|---|---|
| `discos` | los diez discos | `titulo` | 10 | `FICHAS` |
| `tapas` | las diez tapas | `tapa` | 10 | `FICHAS` + `public/tapas/<slug>.jpg` |
| `aperturas` | el tema que abre cada disco | `titulo` | 10 | `leerTemas()`, `pista === 1` |
| `cierres` | el tema que cierra cada disco | `titulo` | 10 | `leerTemas()`, la pista más alta |
| `temas-<slug>` × 10 | los temas de ese disco | `titulo` | 8..13 | `leerTemas()`, filtrado por disco |

Catorce, con dato ya en el repo y **sin cargar una línea de contenido nuevo**. El id más
largo es `temas-un-baion-para-el-ojo-idiota`, 33 caracteres, que es de donde salió el techo
de 40 de `ADR-06.2`.

**El piso de `US-08` se cuenta en conjuntos, no en fichas**, y eso no lo decide este
contrato —es de `producto`— pero el contrato lo hace posible: catorce listas distintas es
lo que impide que el juego se agote en una partida, que es el riesgo 4 del brief. Un piso
por ficha se cumpliría solo el día uno.

**Dos cosas que este contrato no puede ver, y que quedan anotadas:**

- **Qué tema "cierra" un disco lo decide la numeración de `RES-20`.** Si la ficha numera un
  track oculto, el cierre es ese. Es una afirmación menor sobre la obra y no hay respuesta
  correcta que romper (`BR-22`), pero si a alguien le importa, se discute mirando `RES-20`
  y no este archivo.
- **Los dos volúmenes de *Lobo suelto, cordero atado* son dos discos acá**, como ya
  decidió `banco.ts` con su motivo escrito (`RES-20` los lista separados y tienen tapas
  opuestas). La discrepancia 2 de `RES-02` sigue abierta y **no se usa como pregunta**;
  acá tampoco se está preguntando nada.

### CTR-13.3 — La regla dura: se derivan, no se copian

> **Los ítems se derivan en build de `RES-20` vía `leerTemas()` y de `FICHAS`. Nunca se
> copian a un JSON.**

Copiar los 145 ítems a `src/data/ponelos.json` sería **la segunda verdad que `D-13` existe
para impedir**. Hoy hay un solo lugar donde vive qué temas tiene cada disco y cómo se
escriben sus títulos, y todo el cruce del cancionero se apoya en eso. Una copia empieza
idéntica y termina distinta: la primera vez que `RES-20` corrija un título —ya pasó, y a
seis de los 105— la copia queda mintiendo, y el juego muestra un tema que en el resto del
sitio se llama de otra manera.

Es el mismo argumento con el que `CTR-03.8` decidió no bajar un schema, en su motivo 3:
*"un schema suelto se desincroniza… la que nadie va a acordarse de tocar es esa"*.

**Y hay un motivo más, que es de este juego en particular:** el orden canónico de
`ADR-06.5` **es** el orden de la derivación. Si la lista se copiara a un JSON, el orden
pasaría a ser el del archivo, y ahí sí cambiarlo sería tan barato como arrastrar dos líneas
en un editor — con links viejos leyéndose mal en silencio. Derivarlo lo ata a `DISCOS` y a
las pistas, que es material que nadie reordena por gusto.

*Alternativa descartada:* **un JSON de banco con su `.schema.json`, por uniformidad con
`CTR-02` y `CTR-04`.** Descartada por lo de arriba: la uniformidad valdría si el modo de
falla fuera el mismo, y no lo es — allá el riesgo es un ítem mal cargado a mano; acá el
riesgo es una copia que se desincroniza de la ficha.

### CTR-13.4 — El orden canónico de referencia

**Es la parte del contrato que `ADR-06` necesita y la que no viaja en la dirección.**

1. **Entre discos manda `DISCOS`** (`src/lib/letra/discos.ts`), en su orden literal, que es
   el cronológico de las diez ediciones.
2. **Dentro de un disco manda el número de pista**, ascendente, tal como lo lee
   `leerTemas()` de `RES-20`.
3. `discos` y `tapas` enumeran los diez en el orden de `FICHAS`, que es el de `DISCOS` — y
   `banco.ts` ya verifica que no se despeguen.
4. `aperturas` y `cierres` enumeran un tema por disco, también en el orden de `DISCOS`.

**Y ninguna de esas cuatro reglas se puede cambiar sin subir la `version` del empaquetado**
(`ADR-06.5`). La prueba de huella de `CTR-13.6` es lo que hace que el que la cambie se
entere el mismo día.

### CTR-13.5 — Cómo llega al navegador, y cuánto pesa

**Por `<script type="application/json">`, como los otros seis juegos.** Sin `fetch`, sin
una ruta por conjunto, sin red: `.claude/rules/codigo-juegos.md` dice sin backend, y un
juego de ordenar fichas no tiene por qué estrenar una llamada.

**La página manda los catorce conjuntos enteros**, y eso es una decisión y no un descuido:
un link recibido puede traer **cualquiera** de los catorce, y el paso 6 de la validación
(`ADR-06.4`) necesita saber cuántas fichas tiene ese conjunto *antes* de decodificar. Si la
página trajera solo el conjunto en juego, abrir un link ajeno costaría un pedido a la red y
un modo de falla nuevo — justo en el momento en que alguien llega de afuera por primera
vez, que es el peor lugar para poner una espera.

| | |
|---|---|
| Transporte | `<script type="application/json">` en `/juegos/ponelos-en-fila/` |
| Contenido | Los 14 conjuntos, con sus 145 fichas |
| **Presupuesto** | **≤ 24 KB sin comprimir.** Estimado real: ~14 KB |
| Lo que la isla importa como código | `src/lib/ponelos/filas.ts` (hoja, no importa nada) y `lamina.ts` |
| Lo que la isla importa **como tipo** | `ConjuntoOrdenable` y `FichaOrdenable` de `conjuntos.ts` |

**Esa última fila es la que evita repetir un defecto conocido.** `conjuntos.ts` llama a
`leerTemas()`, que importa `node:fs` en su primera línea: si la isla lo importara como
**valor**, Vite lo deja afuera, la importación tira y **el juego entero deja de responder**
— que es exactamente lo que le pasó a `tema/paleta.ts` y lo que hizo escribir
`islas.test.ts`. Un `import type` se borra al compilar y no arrastra nada, y ese test ya lo
sabe distinguir. **El tipo cruza; el código no.**

*Alternativa descartada:* **deduplicar** (los diez discos aparecen en `discos` y en `tapas`;
veinte temas aparecen en `aperturas`/`cierres` y otra vez en su `temas-<slug>`). Ahorraría
unos 3 KB y costaría un índice de referencias más un resolvedor en el navegador. Un
conjunto es **una lista cerrada y ordenada**, y que se pueda leer entera de un vistazo es
lo que hace verificable al orden canónico.

### CTR-13.6 — Verificación: qué correr, y quién

`arquitectura` no tiene con qué ejecutar (`D-12`) y no lo simula. **Lo corre el hilo
principal** al construir el juego, o `revisor` al revisarlo.

```bash
# (1) El empaquetado: ida y vuelta, las cuentas de caracteres, y los siete pasos de
#     validacion de ADR-06.4 con sus siete formas de fallar.
node --test src/lib/ponelos/empaquetado.test.ts

# (2) La derivacion: 14 conjuntos, ids unicos y bien formados, cada ficha cruzando
#     contra leerTemas() y FICHAS, las cantidades (10/10/10/10 y 8..13), y que ningun
#     conjunto `tapa` traiga una ficha sin imagen.
node --test src/lib/ponelos/conjuntos.test.ts

# (3) La huella del orden canonico. Falla el dia que cambie, y ahi hay que elegir a mano
#     entre revertir y subir la version del empaquetado (ADR-06.5).
node --test src/lib/ponelos/orden.test.ts

# (4) La planta de la lamina: no desborda, el bloque de credito siempre esta, y
#     RangeError fuera del rango de fichas.
node --test src/lib/ponelos/lamina.test.ts

# (5) Que la isla no se haya traido node:fs de arrastre. Ya existe.
node --test src/lib/islas.test.ts

# (6) Que no haya aparecido un banco copiado (CTR-13.3). Una linea, y caza la regresion
#     mas cara del contrato.
node -e "import('node:fs').then(({readdirSync})=>{const p=readdirSync('src/data').filter(f=>/ponelos|reparto|ordenable/i.test(f));console.log(p.length?'ROTO: banco copiado en src/data: '+p.join(', ')+' (CTR-13.3)':'OK CTR-13.3 · el conjunto se sigue derivando');})"
```

**Los ocho casos que el test (1) tiene que cubrir**, uno por cada cosa que decidió
`ADR-06`:

1. Ida y vuelta para los catorce conjuntos: lo que se arma se lee igual.
2. Las cuentas: 10 fichas → 6 caracteres, 13 → 7, 105 → 54.
3. El ejemplo de `ADR-06.2`: `[1,1,2,3,2,4,0,3,2,1]` sobre `tapas` da `iSZiCg`.
4. Una carga de largo que no corresponde al conjunto → `null`.
5. Un valor 5, 6 o 7 → `null` (el reparto entero, no la ficha suelta).
6. `#o=2.tapas.iSZiCg` → `null` (versión desconocida, silencio).
7. `#ficha-3` y `#` vacío → `null`, **sin tocar nada**: son anclas normales.
8. `?g=tapa` con un `o=` válido → `null` (regla 1 de `ADR-02`).

**Qué chequea la máquina y qué no:**

| # | Chequeo | Quién |
|---|---|---|
| 1 | El empaquetado y sus siete formas de fallar | comando (1) |
| 2 | Que el conjunto se derive y no se copie | comandos (2) y (6) |
| 3 | Que el orden canónico no cambie sin que nadie se entere | comando (3) |
| 4 | Que una lámina no desborde y siempre lleve crédito | comando (4) |
| 5 | Que la isla no arrastre Node | comando (5) |
| 6 | Que el nombre de un conjunto no jerarquice ("los mejores temas de…") | `revisor`, y `voz.test.ts` sobre el texto visible |
| 7 | Que el crédito impreso diga lo que tiene que decir | `contenido` y `revisor` |

### CTR-13.7 — Por qué este contrato **no** baja a un `.schema.json`

Mismo argumento que `CTR-03.8`, y las tres razones aplican más fuerte acá:

1. **No hay archivo cargado a mano que validar.** Un JSON Schema valida un archivo; este
   contrato no tiene archivo. Lo que hay que verificar no es la forma del dato, es **la
   derivación** — que cada ficha salga de `leerTemas()` o de `FICHAS` y no de otro lado —, y
   eso un schema no lo puede ver. Diría que `tema-inventado` tiene forma de slug; el test
   de Node dice que ese tema no existe.
2. **Nadie edita nada.** El catálogo lo arma la página en cada build y pisa cualquier
   edición. Los schemas de `CTR-02` y `CTR-04` protegen contra el error de carga a mano, y
   acá no hay carga a mano.
3. **Un schema suelto se desincroniza**, y sería la tercera copia de la lista de discos
   —después de `DISCOS` y de `FICHAS`—, que es exactamente lo que `CTR-13.3` prohíbe.

*Alternativa descartada:* bajarlo igual, por uniformidad con los otros bancos. Se descarta
por lo de arriba. **Cuándo se revierte:** el día que alguien tenga que abrir a mano un
archivo de datos de este juego. Ese día `CTR-13.3` ya se rompió, y el schema es el menor de
los dos problemas.

### CTR-13.8 — Numeración

**Este contrato no crea un prefijo de ID.** No hay banco, así que `CTR-02.7` no gana una
línea: los prefijos siguen siendo `QZ-`, `AT-`, `CL-`, `TP-` y `EJ-`.

Los `id` de conjunto **no son identificadores del proyecto**: son slugs, y su forma la fija
`ADR-06.2`. No se reutiliza un id para otro conjunto —eso rompería links viejos igual que
un cambio de orden— y un conjunto que salga de circulación **se saca del catálogo**: sus
links dejan de resolver en el paso 6 y degradan a visita normal, que es la degradación
correcta.

### CTR-13.9 — Qué NO decide este contrato

- **Los nombres visibles** de los catorce conjuntos, de las cuatro filas y del juego, y el
  texto del crédito impreso: `contenido`.
- **Cómo se ve el tablero, cómo se elige un conjunto, y qué muestra la pantalla cuando
  llega un reparto ajeno:** `experiencia` (`UX-23`).
- **Si "Ponelos en fila" entra al "Listo" de la v1 y cuál es su piso:** `producto`
  (`US-08`, `BR-22`).
- **Qué disco viste la sección y cómo se distinguen las filas sin color de tier:** ya está
  decidido por el hilo principal bajo `D-19` y lo escribe `experiencia`. Este documento no
  lo discute; solo deja constancia de que **ninguna decisión de acá depende de eso**: el
  empaquetado, el orden canónico y la derivación se verifican sin abrir una hoja de estilo.
