# UX-34 — Más o menos: el flujo, pantalla por pantalla

> Rol dueño: `experiencia`. Ráfaga "Más o menos" (`D-48`, reescrita 2026-09-25), rama
> `ciclo-16/mas-o-menos`. Consume `D-48` (la mecánica: pregunta + referencia de la misma
> unidad, un toque, revelado de golpe, racha, sin reloj, la familia rota),
> `Docs/SUGERENCIAS/HILO-para-todos-mas-o-menos-el-modelo.md` (el contrato de datos: siete
> familias, `Dato`, cómo se aleja la referencia según la racha, el par), `Docs/
> INVESTIGACION/INV-93-genero-mas-o-menos.md` (`RES-93`..`RES-98`: el Higher Lower Game,
> Card Sharks, los diarios numéricos sin contador animado), `.claude/rules/diseno-
> marca.md` (tabla anti-slop completa), `.claude/rules/voz-ricotera.md` (los tres
> registros, la regla de las dos líneas), `Docs/DECISIONES.md` `D-14` (rotular bien es la
> única defensa), `D-17` (voseo, sin infinitivo), `D-19` (la mezcla, la base que no rota),
> `D-21` (tapas reales — esta sección no las usa, ver §1), `Docs/UX/UX-01-flujo-quiz.md`
> (el rótulo antes/después de responder, por qué el auto-avance no sirve cuando hay algo
> que leer), `Docs/UX/UX-04-sistema-visual.md`, `Docs/UX/UX-06-test-dos-ejes.md` y
> `Docs/UX/UX-23-ponelos-en-fila.md` (cómo se elige un disco libre y se lo justifica, cómo
> se evita que una familia se lea "mejor" que otra), `Docs/UX/UX-10-escritorio.md`,
> `src/styles/tokens.css`, `src/styles/juego.css`, `src/lib/sitio/copy.ts` (el comentario
> sobre por qué *Un baión* y *Cordero atado* quedaron afuera del reparto hasta hoy),
> `src/lib/contraste.test.ts`, `src/lib/mas-o-menos/conteo.ts`, `src/lib/letra/temas.ts`
> (`leerDuraciones`: la duración ya vive en segundos, parseada de un `(m:ss)` de `RES-20`).
>
> **No resuelvo acá** (quedan en "Bloqueos"): el texto exacto de cada `pregunta` y `fuente`
> (`CNT-25`), el schema y el sorteo (`CTR-20`), los pisos y qué cuenta como respuesta válida
> (`US-10`, `BR-32`, `BR-33`), la implementación del link de compartir (`ADR-02`, ya
> definida su forma).
>
> **Resuelve:** el recorrido completo de `US-10`, pantalla por pantalla; qué disco viste la
> sección y con qué variante de casete; cómo se escriben los números en pantalla; el
> checklist de accesibilidad y de "primera pantalla sin muro".

---

## 0. Por qué esta pantalla no es ni `UX-06` ni `UX-23`

Los dos juegos sin puntaje del sitio (`UX-06`, dos ejes; `UX-23`, ponelos en fila)
construyeron una doctrina completa de "acá no hay verde ni rojo, ninguna opción es mejor
que otra". **Más o menos es lo opuesto: tiene una respuesta correcta en cada paso**, igual
que el quiz — `D-48` dice "el número tiene que ser un hecho... nunca una leyenda como
respuesta" y corta la racha en el primer error. Así que el molde correcto para el estado
de los botones no es `.ejes-opcion` ni `.ficha`: es `.opcion` del quiz, con `.es-correcta`
y `.es-elegida` — el mismo símbolo (✔/✕) además del mismo color, ya construido y ya
testeado. Lo que sí hereda de los dos juegos sin puntaje es la lección de **peso parejo
entre categorías** (acá, entre familias): ninguna de las siete puede leerse como "la
familia buena" antes de que el jugador la vea (§4.2).

## 1. El disco de la sección: *Un baión para el ojo idiota*

`D-19` deja el mapa sección→disco en manos de `experiencia`. De los diez discos, ocho ya
están tomados (Oktubre=marca, Gulp!=historia/resultado, Último bondi=discos, La mosca y la
sopa=letras, Lobo suelto=mitología, Momo Sampler=`adivinar por la letra`, ¡Bang!
¡Bang!…=`ponelos en fila`, Luzbelito=`dos ejes`). Quedan dos, y el comentario de
`src/lib/sitio/copy.ts` ya deja escrito por qué ninguno de los dos entró antes:

- ***Cordero atado*** no es un disco distinto: es el volumen II de la misma edición doble
  que *Lobo suelto* (`RES-37` los midió juntos, "un solo alfabeto diseñado como sistema") y
  comparte tinta exacta (`#f28b16`) con una sección que ya existe. Vestir "Más o menos" con
  él sería la misma tapa dos veces, no un disco nuevo.
- ***Un baión para el ojo idiota*** es, por descarte, **el único realmente libre**.

**Elijo *Un baión para el ojo idiota*.** Dos razones:

1. **Costo cero y ya verificado.** `--disco-un-baion-para-el-ojo-idiota-tinta` (`#579ec5`,
   celeste) y `-apoyo` (`#457eb1`, azul) ya existen en `tokens.css`, y el par `'Un baion
   sobre fondo'` **ya está en `contraste.test.ts` y ya pasa AA** — no agrego ningún hex ni
   ningún par nuevo.
2. **El riesgo que el propio comentario de `copy.ts` señala — que el celeste de esta tapa
   "choca" con `--rotulo-testimonio` (`#6fc7ff`) — no aplica acá, y lo resuelvo por
   diseño, no por casualidad.** `D-48` punto 6 prohíbe que una leyenda sea respuesta de
   este juego: los datos son `hecho` o `según {fuente}`, nunca `leyenda`/`testimonio`, así
   que la insignia reservada de `--rotulo-testimonio` (la del quiz, "❝ alguien con nombre
   habla") **no aparece nunca en esta pantalla**. Y la distinción "hecho" vs. "según" no
   lleva una insignia de color propio (ver §4.4): va como texto plano en `--texto-tenue`,
   igual que cualquier otra fuente. Con eso, el celeste de *Un baión* solo tiñe borde,
   título de sección y botón principal — nunca un rótulo de confianza — y no hay ningún
   punto de la pantalla donde un jugador pueda confundir "esto viste Un baión" con "esto es
   un testimonio". Lo dejo escrito acá para que quien lo construya no reabra la duda.

**Tipografía.** Ninguna de las tres fuentes fan (`Oktubre Calco`, `Patricio Rey Fan`,
`Lobo Suelto Fan`) corresponde a *Un baión* — mismo caso que *Luzbelito* (`UX-06 §5`) y
*¡Bang! ¡Bang!…* (`UX-23 §4.1`). Todo el texto grande de esta sección (el `h1`, la insignia
de familia, el número grande) va en `--fuente-rotulada` (Archivo Black), que **ya renderiza
dígitos en producción**: `.puntaje`, `.cifra-numero` y `.revelacion-titulo` ya muestran
números en esa familia tipográfica en el sitio real, así que no hace falta verificar el
archivo de fuente aparte — el precedente ya está probado. Consecuencia directa: "MÁS",
"MENOS", "ANTES", "DESPUÉS" y "SEGUÍ" no tienen ningún carácter fuera del alfabeto de una
fuente de disco, porque no usan ninguna.

**Sin tapas reales.** Igual que *Luzbelito* (`UX-06 §5`) y *¡Bang! ¡Bang!…* (`UX-23 §4.1`),
esta sección usa solo la paleta medida (`RES-37`), no ningún jpg de
`Docs/INVESTIGACION/TapasDiscos/`. No aplica ningún mecanismo de crédito de `D-21` — no
hay tapa que firmar.

**Variante de casete.** `Casete.variante` (`src/lib/sitio/copy.ts`) necesita una clave
nueva. Propongo **`'baion'`** (mismo patrón corto que `'momo'` y `'bang'`), documentada con
el mismo estilo de comentario que ya usan esas dos entradas:

```ts
/** 'baion' la suma `US-10` (`UX-34`): era el único de los dos discos que quedaban sin
 *  tomar cuya tinta no duplica una ya usada — *Cordero atado* es el mismo disco que
 *  *Lobo suelto* (`RES-37` los midió juntos). El celeste de *Un baión* linda con
 *  `--rotulo-testimonio`, pero esta sección nunca muestra esa insignia (D-48 §6: acá no
 *  hay leyenda ni testimonio, solo hecho/según — ver `UX-34 §4.4`). */
readonly variante: 'marca' | 'historia' | 'discos' | 'letras' | 'mitologia' | 'momo' | 'bang' | 'baion';
```

Esto es código (`copy.ts`), no lo escribo yo — lo dejo especificado para que el hilo
principal lo sume junto con la entrada de `JUEGOS`. El `accion` sugerido: **"JUGÁ"** (es
una ronda con racha y respuesta correcta, no un armado sin resultado como "ARMÁ"); la
redacción final del título del casete y la bajada son de `contenido`, con el presupuesto
de §9. El título de la pantalla de juego en sí ya está fijado por `D-48`: **"Más o menos"**.

## 2. Presupuesto de tiempo

Cada paso cuesta **dos toques**, no uno: la decisión (Más/Menos) y "SEGUÍ" para continuar
(§4.3 explica por qué no hay auto-avance). Sin reloj (`D-48` punto 7), así que el tiempo
real depende de cuánto dura la racha del jugador — y eso lo decide el jugador, no el
diseño. Para saber si entra en el presupuesto de 2-3 minutos armo el caso típico:

| Tramo | Duración estimada |
|---|---|
| Pantalla de entrada | 0:05–0:10 |
| Leer pregunta + referencia + decidir (tap 1) | ~3-4 s |
| Leer el revelado + fuente + continuar (tap 2) | ~2-3 s |
| **Por paso** | **~5-7 s** |
| Racha típica (comparable a las 8 preguntas del quiz, dato de referencia de `UX-01`) | **~6 pasos → 0:30–0:42** |
| Pantalla de resultado + decisión de compartir | 0:15–0:25 |
| **Total, racha típica** | **~0:50–1:15** |

Con margen de sobra bajo el techo de 3 minutos incluso si la racha se estira: una racha de
15 pasos (jugador que sabe mucho) cuesta ~1:15–1:45 de puro juego, y sigue entrando. No
hace falta acotar el pozo de preguntas para que el presupuesto cierre — al contrario que el
quiz, acá una racha larga es el premio, no un riesgo de tiempo, porque el jugador la corta
cuando quiere con la primera respuesta que no sabe.

## 3. El recorrido

### 3.1 Pantalla 0 — Entrada

Mismo molde que `UX-01`/`UX-06`/`UX-23`: una sola pantalla, tres variantes de copy, mismo
botón y layout siempre.

**Qué se ve:**

- `h1`, fijo por `D-48`: **"MÁS O MENOS"**, `--fuente-rotulada`, tinta de *Un baión*.
- Bajada, registro 1 ("la que canta", ≤ 8 palabras, imagen física, redacción final
  `contenido`): dice el mecanismo sin venderlo — algo del tipo *"Tirá un número. A ver si
  la clavás."*
- **Una línea nueva, propia de este juego, registro 3**: de dónde salen los números. No la
  pide ningún otro juego del sitio porque ningún otro compara "toda naturaleza de número
  sobre la banda" en la misma partida — acá, antes de tocar nada, el jugador tiene que
  poder confiar en que el juego no inventa el dato con el que lo va a evaluar. Presupuesto:
  ≤ 14 palabras, sin exclamación, sin suspensivos (es rótulo, no relato) — algo del tipo
  *"Discos, recitales, letras: cada número trae de dónde salió."* Redacción final
  `contenido`.
- Un solo botón grande, zona pulgar: **"JUGÁ"**.
- Nada más: cero campos, cero permisos, cero pantalla de instrucciones intermedia.

**Variante A — link frío:** subtítulo neutro, sin dato inventado (mismo criterio de
`UX-01`/`UX-06`/`UX-23`: nada de "1.240 ricoteros ya jugaron hoy").

**Variante B — link de un amigo con su racha:** el subtítulo se reemplaza por el desafío —
algo del tipo *"Fulano llegó a racha de 9. ¿La superás?"* Mismo botón único, mismo tap.
Cómo viaja la racha hasta acá es `ADR-02` (forma `marcador`, `g=mas-o-menos`, `p` la
racha) — ya resuelto, no lo repito.

**Variante C — lo abre solo:** igual que la A, sin desafío.

**Qué se toca:** un tap sobre "JUGÁ". **Adónde lleva:** directo al primer paso, sin
pantalla de instrucciones — el primer paso es su propio tutorial, igual que en los otros
seis juegos.

### 3.2 Pantalla 1 — La pregunta

**Qué se ve, de arriba hacia abajo:**

1. **Cabecera** (`.cabecera`, reusada sin cambios): a la izquierda la racha ("RACHA 4",
   mismo tratamiento visual que `.paso` — `--texto-tenue`, sin negrita); a la derecha, **la
   insignia de familia**.

   **¿Se nombra la familia? Sí, con un sello — y decido que sea neutro, no coloreado por
   familia.** Reuso `.categoria` tal cual está (borde `1px`, `--texto-tenue`, sello de
   goma): son siete familias, no cuatro como las categorías del quiz, y `D-48` punto 5 es
   explícito — "cada familia pesa lo mismo en el sorteo". Colorear cada una distinto sería
   inventar siete tokens nuevos (o reusar los `--cat-*`/`--disco-*` de otras secciones, que
   arrastrarían una identidad ajena) para terminar sugiriendo una jerarquía que `D-48` ya
   descartó — el mismo tic que `UX-23 §4.2` (tic 3) nombra para las tier lists: "la rampa
   de peor a mejor". El texto de la insignia sale directo de la clave del dato, sin trabajo
   de `contenido`: `la-banda` → "LA BANDA", `la-gente` → "LA GENTE", `los-recitales` →
   "LOS RECITALES", `los-discos` → "LOS DISCOS", `lo-que-dura` → "LO QUE DURA", `en-vivo` →
   "EN VIVO", `las-palabras` → "LAS PALABRAS" (mayúsculas, guion por espacio).

2. **Enunciado** (`.enunciado`, reusado): el texto de `pregunta`. Ej.: *"¿Cuánto dura
   «Juguetes perdidos»?"* o, si el dato es de los que trae su propio número entero,
   *"¿Cuántos años tocaron juntos?"*.

3. **La referencia** (`.masomenos-referencia`, nueva — ver §7): la caja que muestra el
   número contra el que hay que decidir. Dos formas, según venga de un dato con nombre
   (`sujeto` presente) o de un número que pone el juego:

   - **Par** (con `sujeto`): una línea chica arriba, registro 3, con el nombre entre
     comillas — *"«Jijiji»"* — y debajo, grande, el valor formateado (§5) — *"5:34"*.
   - **Número**: solo el valor grande, formateado con su unidad — *"12 años"*, *"70.000
     personas"* — sin la línea de nombre, porque el enunciado ya dice qué se está
     preguntando.

   **Enmienda por `BR-18` (b), `FIND-84`/`REV-16`: cuando el par es de la familia
   `en-vivo`, la caja suma un tercer renglón, debajo del valor, en `.masomenos-sujeto`
   (registro 3, `--texto-tenue`) — *"Según setlist.fm, consultado el 24-09-2026."* **Sin
   enlace**, a propósito: la página de setlist.fm lista todos los conteos juntos, y un
   enlace ahí regala la respuesta antes de decidir; el enlace real va solo en el revelado
   (§3.3). Ya en código, reusando la clase que arma la línea del nombre (§7.2).

   Nunca lleva "¿más o menos?" escrito adentro: esa pregunta ya la hacen los dos botones de
   abajo, y repetirla sería la misma redundancia que `voz-ricotera.md` §4.6 prohíbe ("la
   letra no aclara lo que acaba de decir").

   **Esquina:** `.masomenos-referencia` no es un botón grande, es una ficha de dato — va a
   3px de estampa, no a `var(--radio)` (`diseno-marca.md`: "`--radio` queda para lo
   tocable grande; lo chico va a 3px"). Corrijo acá la §7.2, que no lo dejaba explícito.

4. **Los dos botones** (`.masomenos-opciones`, nueva — ver §7), en la zona pulgar, uno al
   lado del otro: **MÁS** / **MENOS**. Cuando la escala del dato es `anio`, los rótulos
   cambian a **ANTES** / **DESPUÉS** (`D-48` punto 3 — "¿más o menos que 1990?" no lo dice
   nadie). Antes de tocar, los dos tienen exactamente el mismo tratamiento — ni tamaño, ni
   tinta, ni orden fijo que sugiera cuál conviene: el mismo principio de `UX-06 §3` (las
   dos opciones pesan igual) aplicado a un juego que, a diferencia de aquel, sí va a decir
   cuál era la correcta un segundo después.

**Qué se toca:** un tap sobre MÁS o MENOS (o ANTES/DESPUÉS). Nada de arrastrar, doble tap
ni swipe.

**Nombre accesible de los botones — con la referencia adentro**, tal como pide el encargo:
`aria-label="Más que {valor formateado}{unidad si aplica}"` / `"Menos que {…}"`, o para
años `"Antes de {valor}"` / `"Después de {valor}"`. Así un lector de pantalla que no llegó
a leer la caja de referencia (o que la saltea) igual sabe contra qué número está decidiendo
en el momento exacto de tocar el botón — la etiqueta visible puede quedarse corta ("MÁS")
porque el contexto completo vive en el nombre accesible, no al revés.

### 3.3 El revelado — acierto

Al tocar, el botón elegido (y si corresponde el otro) pasan a los estados que **ya existen
y ya están testeados**: reuso `.opcion.es-correcta` (borde y tinta `--acento-3`, ✔︎ además
del color) sobre el botón que era la respuesta correcta, y `.opcion.es-elegida` (borde y
tinta `--acento-4`, ✕︎) sobre el botón tocado **solo si era el otro** — exactamente el
mismo mecanismo que el quiz usa entre cuatro opciones, aplicado a dos. Si el jugador acertó,
solo se pinta un botón (el que tocó, que es el correcto); no hace falta un segundo estado
"incorrecto" para nada, porque no lo hay.

Debajo aparece el panel de revelado (`.feedback.ok`, reusado): dentro,

- **El número real, grande y con el símbolo** (`.masomenos-real`, nueva — ver §7): mismo
  rol que `.micro` en el quiz pero a la escala de un premio, como ya hace
  `.revelacion-titulo` en "adiviná el tema" ("es el premio: el jugador se lleva el disco,
  no un número"). Formateado según §5, con su unidad. Color `--acento-3`, hereda del mismo
  mecanismo que ya tiñe `.feedback.ok .micro`.
- **La fuente**, en `.explicacion` (reusado, `--texto-tenue`, registro 3): el texto de
  `fuente` tal cual lo escribió `contenido`, sin editar. Ver §4.4 por qué acá no hace
  falta distinguir "hecho" de "según" con nada más que texto. **Si el paso mostró el
  renglón de setlist.fm en la caja de referencia (§3.2), acá es donde recién aparece el
  enlace real** a la página de estadísticas — antes de responder solo estaba el texto
  "Según setlist.fm, consultado el 24-09-2026", sin `href`.

**¿Hay botón "SEGUÍ" o pasa sola? Confirmo la propuesta del hilo principal: siempre hay
botón, nunca auto-avance.** No es una preferencia — es la misma regla que ya fijó `UX-01`
para los ítems con rótulo del quiz ("si el rótulo no llega a leerse, no sirve... un timer
fijo no le puede servir bien a la vez a un texto de 15 caracteres y a uno de 200"). En el
quiz esa regla se aplicaba solo a los ítems rotulados (leyenda/testimonio); acá **todos**
los pasos traen una fuente que leer — el campo `fuente` no es opcional en ningún `Dato` —
así que la excepción del quiz se vuelve la regla entera de este juego. Y hay un motivo de
fondo, no solo de forma: la fuente es el mecanismo que sostiene `D-14` ("la defensa no es
verificar más, es rotular bien") en el único juego del sitio que compara datos de
naturalezas distintas en la misma racha — cortarla con un timer para ganar velocidad
sería vaciar de contenido exactamente lo que este juego existe para mostrar. El costo en
tiempo ya está en el presupuesto de §2 y entra cómodo.

Botón: **"SEGUÍ"** (`.primario`, `--tinte-accion` = tinta de *Un baión*), mismo texto que
ya usa el quiz para el mismo gesto — no hace falta una palabra nueva para la misma acción.

**Qué anuncia la región viva** (`aria-live="polite"`): al revelar, *"Acertaste: {valor
formateado}. Fuente: {fuente}."* El foco se mueve al botón "SEGUÍ" apenas aparece — es el
único control que hace falta tocar después, y es el mismo criterio que ya usan los botones
de destino de `UX-23 §3.3` (todo lo tocable es un `<button>` real, alcanzable por foco sin
rueda fabricada).

### 3.4 El revelado — error

Mismo panel, con `.feedback.no` (borde y `.micro`/`.masomenos-real` en `--acento-4`, ✕︎).
Contenido:

- **El número real**, igual que en el acierto — es el mismo dato, cambia solo el color y
  el símbolo, nunca el contenido.
- **La fuente**, igual que en el acierto.

**Si la familia es `las-palabras`: se suma el detalle auditable, en las dos salidas del
paso (acierto y error), no solo en la que corta la partida.** El pedido lo nombra a
propósito del error porque es el caso que más importa —es el que además reaparece en el
resultado (§3.5)— pero la razón de fondo (`D-14`: un número se puede auditar) no depende
de si el jugador acertó o falló, así que lo aplico a ambas salidas por consistencia. Se
agrega, debajo de la fuente:

- **Las formas contadas** (`palabra.formas`), en una línea registro 3: *"Formas contadas:
  perro, perros."*
- **El desplegable "en cuáles"** (`.masomenos-despliegue`, nueva — ver §7): un
  `<details>`/`<summary>` con el mismo tratamiento visual que ya usa el desplegable de
  discos de "adiviná el tema" (`.pozos-plegado`/`.pozos-abrir`: sello de goma punteado,
  mayúsculas rotuladas, sin el triángulo nativo del navegador). Rótulo del disparador:
  algo del tipo *"VER EN CUÁLES"*. Adentro, la lista de temas (`.masomenos-temas`, nueva):
  cada tema es un sello (`<a class="categoria">`, reusado como enlace) con su título,
  enlazado a `/letras-y-acordes/<slug>/` — el mismo destino que ya usa el resto del sitio
  para "andá a leer la letra completa".

**Botón:** "SEGUÍ" también acá (mismo texto, mismo criterio de §3.3: hay algo que leer —
acá potencialmente más, con las formas y el desplegable — así que la regla de "tap, no
timer" pesa todavía más). Lleva a la Pantalla 2, resultado. **No hay una segunda
confirmación de "¿terminaste?"**: el error ya cortó la racha, "SEGUÍ" solo abre paso a
verlo, igual que el botón "SEGUÍ" del acierto abre paso al siguiente número.

**Qué anuncia la región viva:** *"Fallaste. La respuesta real era {valor formateado}.
Fuente: {fuente}."* (y, si aplica, se suma la lista de formas antes del cierre). Foco al
botón "SEGUÍ".

### 3.5 Pantalla 2 — El resultado

**Qué se ve, de arriba hacia abajo** (mismo orden que pide el encargo):

1. **Encabezado que canta según la racha** (`.tramo`, reusado con sus tres variantes —
   `D-48` fija los mismos cortes que el quiz: bajo 0–2, medio 3–7, alto 8+). Redacción
   final `contenido`, presupuesto en §9.
2. **La racha**, el número más grande de la pantalla (`.cifra-rotulo` + `.cifra-numero`,
   reusados tal cual — `--cat-historia`, Gulp!, porque "resultado = Gulp! + logo" es la
   regla de `D-19` en cualquier juego, no una decisión mía nueva).
3. **La mejor racha guardada** (`localStorage`, clave `arcade.mas-o-menos.mejor` según
   `D-48`), como dato secundario debajo — reuso `.cifra-pie` (`--texto-tenue`).
4. **La pregunta que te cortó**: el mismo panel `.feedback.no` de §3.4, con su pregunta,
   su referencia, su valor real y su fuente — no se resume ni se recorta, es la misma
   pieza que ya se vio un paso antes, ahora fija en el resultado. Si la racha llegó a cero
   (falló la primera), es el único paso que hubo; si el jugador "ganó" (se acabaron los
   datos del pozo antes de fallar, `D-48` punto 7 sección "Lo que ve el que perdió" no
   aplica ahí — dejo esa redacción a `contenido`, ver bloqueos.
5. Botón primario, el más grande: **"COMPARTÍ"** (`.primario.firma`, reusado —
   Patricio Rey Fan, `--cat-historia`, mismo botón que usan los otros seis juegos).
   `D-48` punto 11: **sin tarjeta-imagen en esta versión**, así que el flujo es más simple
   que `UX-02` — Web Share API con texto y el link `marcador` (`p` la racha, `t` el pozo),
   o copiar el link como respaldo, reusando `.compartir-salida`/`.compartir-aviso`
   (ya existen, genéricos).
6. Botón secundario: **"JUGÁ OTRA"** (`.secundario`, reusado) — arranca una racha nueva.
7. **"VOLVÉ AL ARCADE"** (`.salida-resultado`, reusado) — la cinta de vuelta al portal que
   ya usan los otros seis juegos.

## 4. Cómo se escriben los números

| Escala | Formato | Ejemplo |
|---|---|---|
| `anio` | entero, sin punto de miles | `1986` |
| `entero` | con punto de miles desde 1.000, sin punto por debajo | `34`, `70.000` |
| `segundos` | `m:ss` (minutos sin cero adelante, segundos a dos dígitos) | `5:34`, `12:07` |

**La unidad va al lado, tomada de `unidad: [singular, plural]`** (`D-48`/`CTR-20`), nunca
adentro del número: `12 años` no `12años`; se elige singular/plural según el valor. `anio`
y `segundos` no llevan palabra de unidad — el propio formato (año de cuatro cifras, `m:ss`)
ya dice qué es. Cuándo una unidad lleva una preposición delante en el enunciado (*"aparece
en 34 temas"*) es parte de cómo `contenido` redacta `pregunta`, no una regla de formato de
esta tabla — la tabla solo fija cómo se escribe el número y su unidad sueltos, en la caja
de referencia y en el revelado.

**Duración: el dato ya llega en segundos** (`leerDuraciones()`, `src/lib/letra/temas.ts`,
parseado del `(m:ss)` de `RES-20`), así que convertir a `m:ss` para mostrar es deshacer
exactamente el mismo parseo que ya hizo el build — no una notación nueva que este juego
inventa, es la que ya usa la ficha de origen.

**¿En qué fuente va el número grande?** `--fuente-rotulada` (Archivo Black), en toda la
pantalla — la caja de referencia (§3.2), el revelado (§3.3/§3.4) y la racha del resultado
(§3.5). Justificado en §1: ninguna fuente de disco corresponde a *Un baión*, así que no
hay alternativa que evaluar, y Archivo Black ya prueba en producción que renderiza dígitos.

## 5. Sin movimiento decorativo

El número aparece de golpe, sin contador que sube. No es una preferencia mía: es la lectura
directa de `RES-98` (la familia "diarios numéricos" — Costcodle, Yeardle — revela con
feedback estático, y es la que ya cita `D-48` punto 10 como modelo) contra la que
`diseno-marca.md` prohíbe por nombre ("el único movimiento decorativo del sitio es la
mosca"). En código: `.masomenos-real`/`.masomenos-valor` no llevan `transition` ni
`animation` propia — el único movimiento que toca esta pantalla es el genérico de todo el
sitio: el borde de `.opcion` al tocar (`--duracion-toque`, 120 ms, informa que el dedo
llegó) y el cruce de `--duracion-paso` entre pantallas (`ADR-03`, 200 ms), ninguno de los
dos nuevo ni propio de este juego.

## 6. Accesibilidad

- [ ] Objetivo de toque `--toque-min` (48 px) en los dos botones de cada paso y en
      "SEGUÍ"/"COMPARTÍ"/"JUGÁ OTRA" — heredado, sin excepción.
- [ ] Acierto/error nunca se comunican solo con color: símbolo (✔︎/✕︎) + color + palabra
      en el `micro`/`.masomenos-real`, igual que en el quiz.
- [ ] `aria-label` de cada botón de decisión incluye la referencia completa ("Más que 12
      años", "Antes de 1990") — no depende de que el jugador haya leído la caja de
      referencia por separado (§3.2).
- [ ] Región `aria-live="polite"` anuncia el resultado de cada paso completo (valor +
      fuente), nunca solo "✔" o "✕" sueltos (§3.3, §3.4).
- [ ] El foco se mueve al botón "SEGUÍ" apenas aparece el revelado — es el único control
      que hace falta tocar después.
- [ ] La insignia de familia (§3.2) se distingue por texto, no por color — no hace falta
      una segunda señal porque no es un estado (acierto/error/rótulo): es una etiqueta
      neutra, igual de tratamiento para las siete.
- [ ] El desplegable "en cuáles" (§3.4) es un `<details>`/`<summary>` nativo: tabulable,
      con `Enter`/`Espacio` para abrir, sin JavaScript de foco a medida.
- [ ] Ninguna animación nueva: nada que titile ni destelle (§5).
- [ ] Tipografía de cuerpo (enunciado, fuente, formas contadas) siempre en `--fuente`,
      nunca en la rotulada — la rotulada es solo para el número grande y los rótulos
      cortos, mismo criterio que el resto del sitio.

## 7. Sistema visual: clases reusadas y clases nuevas

**Cero hex nuevos, cero pares nuevos de `contraste.test.ts`** (§1). Todo lo que sigue son
`var(--...)` de tokens ya medidos.

### 7.1 Reusadas tal cual

`.cabecera`, `.paso`, `.categoria` (insignia de familia y, como `<a>`, cada tema del
desplegable), `.enunciado`, `.opcion`/`.opcion.es-correcta`/`.opcion.es-elegida`,
`.feedback`/`.feedback.ok`/`.feedback.no`, `.micro`, `.explicacion`, `.primario`,
`.primario.firma`, `.secundario`, `.salida-resultado`, `.compartir-salida`/
`.compartir-aviso`, `.cifra`/`.cifra-rotulo`/`.cifra-numero`/`.cifra-pie`, `.tramo` con sus
tres modificadores, `.disco--un-baion-para-el-ojo-idiota` (ya existe en `juego.css`, define
`--tinta-disco`/`--apoyo-disco` para este disco — falta solo aplicarle la clase al
contenedor de la partida).

### 7.2 Nuevas, con nombre concreto

| Clase | Qué es | Por qué no alcanza una reusada |
|---|---|---|
| `.masomenos-referencia` | La caja que muestra el `sujeto` (si hay) y el valor de referencia, grande. Mismo idioma que `.verso-bloque` en el borde y la sombra —`border: var(--linea) solid` teñido con la tinta de *Un baión*, `box-shadow` dura desplazada con el apoyo—, **pero `border-radius: 3px`, no `var(--radio)`**: es una ficha de dato, no un botón grande, y `diseno-marca.md` reserva `--radio` para lo tocable (`FIND-84`/`REV-16` lo corrigió). | Ninguna caja existente combina "nombre chico opcional + valor grande + esquina de estampa" — `.verso-bloque` es de completar la letra, trae otra tipografía interna y sí es `var(--radio)` porque ahí el bloque entero es parte de la pregunta, no una ficha aparte. |
| `.masomenos-valor` | El número grande dentro de `.masomenos-referencia`. `--fuente-rotulada`, `--texto` (nunca coloreado con acierto/error: todavía no se respondió). | — |
| `.masomenos-sujeto` | La línea chica, registro 3, `--texto-tenue`, dentro de `.masomenos-referencia`: el nombre entre comillas del dato con el que se compara (`«Jijiji»`) y, agregado por `BR-18` (b)/`FIND-84`, el renglón de fuente y fecha cuando el par es de `en-vivo` (`"Según setlist.fm, consultado el 24-09-2026"`, sin `<a>`: el enlace real recién aparece en el revelado, §3.3). Misma clase para las dos, porque el tratamiento visual es idéntico — cambia el contenido, no la forma. | `.explicacion` ya cumple ese rol dentro de `.feedback`, pero acá hace falta la misma voz *antes* de responder, adentro de una caja distinta con su propio color de borde. |
| `.masomenos-opciones` | Contenedor `display: flex` de los dos botones de decisión, uno al lado del otro (a diferencia de `.opciones`, que es grilla de hasta cuatro). Sus hijos son `.opcion` sin cambios, con una regla propia (`.masomenos-opciones .opcion { flex: 1; text-align: center; font-family: var(--fuente-rotulada); }`) para centrar una palabra corta en vez del texto largo a la izquierda que usa el quiz. | `.opciones` está pensada para hasta cuatro botones en columna/grilla 2×2; acá son siempre dos, lado a lado — el layout de `Higher Lower` que confirma `RES-93.1`. |
| `.masomenos-real` | El valor revelado, grande, dentro de `.feedback`. Mismo rol que `.micro` pero a la escala de `.revelacion-titulo` (1.6rem) porque es el premio de la pantalla, no un título de aviso. Reglas `.feedback.ok .masomenos-real`/`.feedback.no .masomenos-real` heredan el color, calcadas de `.feedback.ok .micro`/`.feedback.no .micro`. | `.micro` (1.1rem) es demasiado chico para el elemento central de la revelación — subirle el tamaño ahí afectaría también al quiz. |
| `.masomenos-despliegue` / `.masomenos-despliegue-abrir` | El `<details>`/`<summary>` de "en cuáles" (§3.4). Mismo tratamiento visual que `.pozos-plegado`/`.pozos-abrir` (sello punteado, sin marcador nativo) — lo dejo como clase propia en vez de reusar el nombre `pozos-*` porque ese nombre es específico de "adiviná el tema"; el hilo principal puede, si quiere, generalizar las dos reglas bajo un nombre común más adelante — no es necesario para que esta pantalla funcione. | — |
| `.masomenos-temas` | La lista de temas dentro del desplegable: `display: flex; flex-wrap: wrap; gap: var(--espacio-1)`, para que los sellos (`<a class="categoria">`) se acomoden en filas según el ancho, en vez de una columna larga. | — |

## 8. Escritorio (derivado, `UX-10`)

**No agrego nada a `UX-10`.** Esta pantalla reusa `.opcion`, `.primario` y `.secundario`
sin tocar su selector, así que hereda gratis el hover de `UX-10 §3.2` (ya están en la
lista: `.opcion`, `.primario`, `.secundario`) y el tope de `34rem` vía `.contenido-sitio`
que `UX-10 §2.3` recomienda para los seis juegos en partida. La decoración del margen
(`UX-10 §4`) se tiñe con `--disco-un-baion-para-el-ojo-idiota-apoyo`, la misma variable
local que esta pantalla ya define para su propio borde — ningún color nuevo.

Lo único sin cubrir por la lista fija de `UX-10 §3.2` es el `hover` de
`.masomenos-despliegue-abrir` (el disparador del desplegable) — mismo caso no crítico que
`.pozos-abrir`, que tampoco está en esa lista y ya tiene su propio `:hover` escrito a mano
en `juego.css`. Sugiero seguir el mismo patrón si se toca esa clase, sin que sea bloqueo
para el resto de esta pantalla.

## 9. Presupuestos para `contenido`

| Pieza | Presupuesto | De dónde sale |
|---|---|---|
| Bajada de la Pantalla 0 (primera oración) | ≤ 8 palabras, registro 1 | `voz-ricotera.md` §5 |
| Línea de "de dónde salen los números" | ≤ 14 palabras, registro 3, sin exclamación ni suspensivos | §3.1 |
| Copy de desafío (Variante B) | primera frase ≤ 8 palabras + link | mismo molde de `UX-01`/`UX-06` |
| `pregunta` de cada dato | sin techo fijo acá — lo fija `CTR-20`/`CNT-25`; recordatorio: nunca incluye la palabra "más o menos", eso lo dicen los botones | §3.2 |
| `fuente` de cada dato | registro 3, seco; si `firmeza: "segun"`, arranca con "Según {quién}" adentro del propio texto — la pantalla no agrega nada aparte (§1, §3.3) | `D-48` punto 6, `HILO-...-el-modelo.md` §4 |
| Los tres encabezados de tramo (bajo/medio/alto) | ≤ 8 palabras cada uno, registro 1 | mismo molde que el quiz (`.tramo`) |
| Botones: "SEGUÍ", "COMPARTÍ", "JUGÁ OTRA" | voseo, sin infinitivo, sin suspensivos | `D-17`, `voz.test.ts` |
| Rótulo del desplegable ("VER EN CUÁLES" o similar) | corto, registro 3, sin suspensivos | §3.4 |
| Título y bajada del casete del portal | título ya fijado por `D-48` como nombre del juego; bajada con el molde de `UX-25` (primera oración ≤ 8 palabras) | §1 |
| Redacción de "ganaste" (se acabó el pozo sin fallar) | pendiente — ver bloqueos | §3.5 |

## 10. Bloqueos que dejo anotados

- **El mapa sección→disco maestro de `UX-04` no incluye todavía esta fila** — mismo
  bloqueo que ya dejaron `UX-06 §8` y `UX-23 §11` para sus propios discos. Queda para una
  ráfaga que toque `UX-04` directamente.
- **La clave nueva `'baion'` en `Casete.variante` y la entrada en `JUEGOS`** son cambios de
  código (`src/lib/sitio/copy.ts`) — los especifico en §1 pero los escribe el hilo
  principal.
- **Qué dice la pantalla de resultado si el jugador agota el pozo sin fallar** ("ganaste",
  `D-48` punto "Si se acaban los datos, ganaste") — no tengo la redacción; dejo la
  estructura de la Pantalla 2 (§3.5) preparada para un cuarto caso ahí donde hoy digo "la
  pregunta que te cortó no aplica", pero el texto exacto es de `contenido`.
- **El texto de cada `pregunta` y `fuente`** es de `CNT-25`, con los presupuestos de §9.
- **El schema exacto de `Dato`, el sorteo por familia y cómo se aleja la referencia según
  la racha** son de `CTR-20` (`arquitectura`) — acá asumo la forma que ya describe
  `D-48`/`HILO-para-todos-mas-o-menos-el-modelo.md` y no la vuelvo a discutir.
- **Los pisos de cada familia y qué cuenta como respuesta válida** son de `US-10`/`BR-32`/
  `BR-33` (`producto`).

## 11. Verificación

No tengo con qué correrla (`D-12`). Para quien construya:

- `node --test src/lib/contraste.test.ts` sigue en verde sin agregar ningún par —
  confirmado en §1 que `'Un baion sobre fondo'` ya existe y ya pasa.
- `node --test src/lib/voz.test.ts` en verde una vez cargado el copy real: título de
  entrada ≤ 8 palabras, botones sin infinitivo, sin suspensivos en botones ni rótulos.
- `node --test src/lib/estilos.test.ts` en verde: `.masomenos-referencia` no usa
  `border-left`/`border-inline-start` (borde completo, no barra lateral) y ningún
  `border-radius: 999px` en las clases nuevas de §7.2.
- A 375×812: los dos botones de decisión entran lado a lado sin apretarse (ancho ≥
  `--toque-min` cada uno) y "SEGUÍ" entra en la zona pulgar sin scroll.
- Con `prefers-reduced-motion: reduce`: nada de esta pantalla cambia, porque no agrega
  ninguna animación propia (§5) — la verificación es que sigue viéndose igual, no que algo
  se apague.
- En un celular real: de la entrada al primer revelado hay como máximo dos taps, y
  ninguno pide texto, permiso ni login.
