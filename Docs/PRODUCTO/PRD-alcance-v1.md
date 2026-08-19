# PRD — Alcance v1: los cuatro juegos

> Consume: `Docs/BRIEF.md` ("Listo de la v1", "Orden de corte", "Criterios no
> negociables", riesgos 4 y 6), `Docs/DECISIONES.md` `D-05`, `D-04`, `D-06`, `D-08`,
> `D-09`, `D-10`.
>
> Los cuatro juegos (quiz, adivinar el tema, completar la letra, adivinar la tapa o el
> disco) están **confirmados por `D-05`** en el `/kickoff` del usuario — este documento
> no los re-discute. Lo que faltaba y produce este archivo: criterio de aceptación por
> juego, piso de ítems, y las reglas de negocio que el brief dejó como `PENDIENTE` a
> cargo de `producto` (dificultad de "completar la letra", puntaje del reveal de audio).

## Por qué existe el piso de ítems

El riesgo 4 del brief es literal: "cuatro juegos hermosos con doce preguntas adentro".
Un juego con el motor terminado y un puñado de ítems no cuenta como listo (`BRIEF.md`,
"Listo de la v1"). Cada historia de abajo fija un número, no una sensación, y ese número
está ajustado al costo real de producir cada tipo de ítem — porque quien carga el
contenido (`contenido`) trabaja en las mismas ráfagas irregulares que todo el equipo, y
un ítem de texto no cuesta lo mismo que un ítem que además necesita audio o una imagen
con derechos.

---

## BR-01 — Escalonamiento de dificultad sin muro de entrada (transversal a los 4 juegos)

**Aplica a:** `US-01`, `US-02`, `US-03`, `US-04`. Motivo: el criterio no negociable
"sin muro de entrada" (`D-09`) exige que el que recién llega no se sienta expulsado en
la primera pantalla de **ningún** juego.

**Taxonomía:** todo ítem del banco de contenido (pregunta, tema, letra, tapa) lleva una
etiqueta de dificultad de 3 valores — **Fácil / Media / Difícil** — asignada por
`contenido` al cargarlo.

**Regla:**
1. El primer ítem que se sirve en cualquier partida nueva, en cualquiera de los 4
   juegos, es siempre de nivel **Fácil**. Nunca Media ni Difícil.
2. Dentro de la misma partida, la dificultad no baja: si el ítem N es de nivel X, el
   ítem N+1 es de nivel X o superior (Fácil → Media → Difícil), nunca al revés.
3. Cada juego necesita un mínimo de ítems Fáciles en su piso (fijado en cada historia
   más abajo) para que "el primer ítem" no sea siempre el mismo — si solo hay uno o dos
   ítems Fáciles, el jugador que recién llega ve siempre lo mismo, y eso no es
   escalonamiento, es una vidriera fija.

**Verificación:** en cualquier partida nueva de cualquier juego, el primer ítem servido
está etiquetado Fácil. Es un chequeo binario, sin ambigüedad.

---

## US-01 — Quiz de preguntas

**Prioridad:** Alta (P0) — **la primera que se construye.**

Como jugador que llega por un link de Twitter sin saber nada de los Redondos, quiero
jugar una ronda corta de preguntas de dificultad creciente, para completar una partida
en dos o tres minutos y ver cuánto sé sin sentirme excluido si no sé nada.

**Criterio 1 — caso feliz:**
- **Given** un jugador nuevo, sin partidas previas, abre el quiz.
- **When** arranca una partida.
- **Then** el sistema sirve una ronda de 8 preguntas *(supuesto de duración de sesión: a
  ~15-20 seg por pregunta con una sola mano, 8 preguntas caen dentro de los 2-3 minutos
  declarados; `experiencia` valida el tiempo real y puede ajustar el número vía
  `Docs/SUGERENCIAS/`)*, ordenadas según `BR-01`, cubriendo al menos 2 de las 4
  categorías (historia, discos, letras, mitología), y al terminar la última pregunta se
  muestra un resultado (aciertos sobre 8) sin que el jugador haya necesitado crear
  cuenta ni loguearse.

**Criterio 2 — caso borde (no sabe nada):**
- **Given** un jugador responde mal las primeras 3 preguntas seguidas.
- **When** sigue jugando la misma ronda.
- **Then** el juego no lo bloquea ni corta la partida: sigue mostrando la pregunta
  siguiente con la misma estructura, y al final se muestra el resultado igual (aunque
  sea 0 de 8), habilitando jugar de nuevo sin fricción.

**Criterio 3 — caso borde (veracidad):**
- **Given** una pregunta del banco afirma un dato verificable.
- **When** se muestra al jugador.
- **Then** esa pregunta cita en su ficha de `contenido` la ficha `RES-XX` que la
  respalda, o lleva la marca explícita de leyenda (`D-09`, ningún dato falso).

**Piso de ítems: 40 preguntas.**
- Mínimo 10 por categoría (historia, discos, letras, mitología) — 4 categorías × 10.
- De esas 40, mínimo 10 de nivel Fácil, 15 Media, 15 Difícil (para que `BR-01` no
  repita siempre la misma pregunta como "primer ítem").
- **Por qué 40 y no 12:** es el contenido más barato de producir del banco — texto puro,
  sin audio ni imagen con derechos — y es el juego que se construye primero, así que
  fija el piso más alto de los cuatro. Con una ronda de 8 preguntas por partida, un pool
  de 40 hace que un jugador que vuelve a jugar varias veces no vea siempre el mismo
  octeto, que es exactamente el riesgo 4 del brief.

**Queda fuera de esta historia:** el copy exacto de la pantalla de resultado y el
mecanismo de compartir (dueño `experiencia`, ver `D-10`); la tolerancia de matching si
alguna pregunta usa texto libre en vez de opción múltiple (dueño `experiencia`).

---

## US-02 — Adivinar el tema (reveal progresivo de audio)

**Prioridad:** Alta (P0) — se defiende recortando piso antes que salir (`D-05`).

Como jugador que reconoce temas de oído, quiero escuchar un fragmento cada vez más
largo de un tema y arriesgar cuál es, para demostrar que lo reconozco con lo mínimo
posible y ganar más puntos cuanto menos necesité escuchar.

**Criterio 1 — caso feliz:**
- **Given** un jugador arranca un ítem nuevo, que por `BR-01` es de nivel Fácil si es el
  primero de la partida.
- **When** se reproduce el paso 1 del reveal (el fragmento más corto).
- **Then** el jugador puede responder inmediatamente o pedir más audio, tantas veces como
  quiera, antes de responder (`BR-02`); si responde bien en el paso 1 obtiene el puntaje
  máximo de la tabla de `BR-02`. La respuesta es un **intento único**: si falla, el ítem
  se cierra en 0 puntos, se revela la respuesta correcta, y la partida sigue con el
  próximo ítem sin bloquear al jugador (mismo principio de continuidad que `US-01`
  criterio 2).

**Criterio 2 — caso borde (sin sonido disponible):**
- **Given** un jugador abre el juego con el dispositivo en silencio o sin auriculares.
- **When** intenta escuchar el paso 1.
- **Then** el juego se lo advierte explícitamente antes de arrancar la partida — no lo
  deja adivinar "a ciegas" sin saber que el audio no sonó (el brief pide degradar con
  dignidad, no fallar en silencio).

**Criterio 3 — caso borde (Spotify no disponible):**
- **Given** un jugador acierta o agota los pasos de un ítem.
- **When** intenta escuchar el tema completo vía Spotify al revelar.
- **Then** si no tiene la app o no tiene Premium (`D-08`), igual puede ver el resultado
  del ítem (acertó o no, puntos ganados) sin que un enlace roto le impida cerrar la
  partida.

**Piso de ítems: 20 temas**, cada uno con fragmento de audio propio y link a Spotify.
- Mínimo 5 de nivel Fácil (hits reconocibles), resto repartido en Media/Difícil.
- **Por qué 20 y no 40 como el quiz:** cada ítem acá cuesta más — necesita producir un
  fragmento de audio (bajarlo de YouTube y recortarlo, `D-06`, trabajo manual del
  usuario), no solo redactar texto. Un piso menor que el del quiz refleja ese costo real
  sin bajar tanto como para que el jugador que vuelve escuche siempre las mismas 5
  canciones.

**Queda fuera de esta historia:** la vía técnica exacta del link o embed de Spotify
(`ADR-01`, dueño `arquitectura`); la duración exacta en segundos de cada paso del reveal
(dueño `arquitectura`, ver propuesta en `Docs/SUGERENCIAS/`).

---

## BR-02 — Puntaje del reveal progresivo en "adivinar el tema"

**Aplica a:** `US-02`.

> **Revisión 2026-08-19.** La mecánica de intentos de esta regla se corrige a partir de
> `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md` (`arquitectura`, `T-24`).
> El texto original permitía errar gratis en cada paso; combinado con `BR-04` (4 opciones,
> ahora extendida también a `US-02` — ver `BR-04`) eso le daba a un jugador que no
> reconoce nada un esperado de 70 puntos con piso de 40, y volvía inalcanzables el paso 5
> y la rama de 0 puntos. Verificación aritmética al final de esta regla.

**Pasos:** el reveal tiene **5 pasos fijos**, numerados 1 a 5, del fragmento más corto
(arranca en 0,1 seg, según el brief) al fragmento más largo disponible. `producto` fija
la **cantidad** de pasos y su valor en puntos; `arquitectura` fija la **duración exacta
en segundos** de cada paso dentro de su spec de precarga (pendiente — ver
`Docs/SUGERENCIAS/PRD-para-arquitectura-pasos-reveal-audio.md`).

**Mecánica (revisada — intento único por ítem):** el jugador puede pedir "más audio" en
cualquier momento, tantas veces como quiera, antes de responder — eso no cuesta puntos,
solo tiempo de partida. Pero **la respuesta es un solo intento por ítem**: al entregarla,
el ítem queda resuelto en el acto.
- Si es correcta, se anota el puntaje de la tabla de abajo según el paso en que se
  entregó esa única respuesta.
- Si es incorrecta, el ítem se marca fallado con **0 puntos**, se revela la respuesta
  correcta, y la partida sigue con el próximo ítem — sin una segunda oportunidad dentro
  del mismo ítem. Mismo principio que el quiz (`BR-04`): errar no es gratis.

Esto reemplaza la redacción anterior ("puede haber errado una respuesta antes de acertar;
eso no cambia el cálculo"), que era justamente la que abría la cuenta de 70/40: permitía
ensayar una opción por paso sin penalidad real y llegar garantizado a la última opción
sobreviviente.

**Tabla de puntaje, fija (sin cambios):**

| Paso alcanzado al responder | Puntos si acierta |
|---|---|
| Paso 1 (0,1 seg) | 100 |
| Paso 2 | 80 |
| Paso 3 | 60 |
| Paso 4 | 40 |
| Paso 5 (fragmento completo) | 20 |

Acertar en el paso 1 sin haber pedido audio extra da el máximo. Acertar recién en el
fragmento completo (paso 5) da el piso de 20 puntos **entre las respuestas correctas** —
nunca 0 por haber tardado, para no castigar con dureza al que necesitó todo el contexto
(coherente con "sin muro de entrada"). **0 puntos es exclusivamente el resultado de una
respuesta incorrecta** (o de no responder nunca), nunca el resultado de tardar en acertar.

**Si nunca responde:** si el jugador pasa al siguiente ítem sin arriesgar una respuesta,
cuenta igual que un fallo — 0 puntos, respuesta revelada, la partida sigue.

**Verificación aritmética — jugador que no reconoce absolutamente nada:**

Con intento único no hay eliminación de opciones posible (no existe una segunda entrega
que aproveche la información de un descarte previo), así que la probabilidad de acertar
de un jugador sin ningún reconocimiento es 1/4, sea cual sea el paso en que decida
responder — escuchar más audio no le suma información si no reconoce el tema.

| Estrategia del jugador sin reconocimiento | Cálculo | Esperado |
|---|---|---|
| Responde ya en el paso 1 (la que más le conviene: esperar no sube su 1/4, solo baja el premio) | 1/4 × 100 + 3/4 × 0 | **25** |
| Espera y responde recién en el paso 5 | 1/4 × 20 + 3/4 × 0 | **5** |

El mejor esperado posible para ese jugador (25) es el mismo techo que `BR-04` fija para
tirar al azar en el quiz con 4 opciones — la misma cuenta de azar, ahora consistente entre
los dos juegos de opción múltiple. El piso deja de ser 40 y pasa a ser **0** bajo cualquier
estrategia: una respuesta incorrecta cierra el ítem sin reintento.

**Paso 5 y rama de 0, alcanzables:**
- **Rama de 0 puntos:** es el resultado de cualquier respuesta incorrecta, en cualquier
  paso — para el jugador sin reconocimiento de la tabla de arriba ocurre el 75% de las
  veces. Deja de ser un estado inalcanzable y pasa a ser el más probable para quien no
  sabe.
- **Paso 5 (20 puntos):** ocurre cada vez que un jugador, sepa o no, escucha el fragmento
  completo antes de animarse a responder y acierta recién ahí. Ya no queda bloqueado por
  una eliminación de opciones que garantizaba acertar antes de llegar a ese paso.

---

## US-03 — Completar la letra

**Prioridad:** Alta (P0) — se defiende recortando piso antes que salir (`D-05`).

Como jugador que se sabe las letras, quiero completar el hueco de un verso con cada vez
menos contexto alrededor, para demostrar que me sé la canción de memoria y no solo por
asociación con el título.

**Criterio 1 — caso feliz:**
- **Given** un jugador arranca un ítem de nivel Fácil (`BR-01`: primer ítem siempre
  Fácil).
- **When** se le muestra el verso con el hueco.
- **Then** ve 2 versos completos antes y 2 después del hueco, más título y disco
  visibles (`BR-03`, nivel Fácil), y puede elegir o escribir qué completa el hueco.

**Criterio 2 — caso borde (nivel difícil, mismo tema):**
- **Given** un jugador llega a un ítem de nivel Difícil dentro de la misma partida.
- **When** se le muestra el ítem.
- **Then** ve únicamente el verso con el hueco, sin versos adicionales, sin título ni
  disco (`BR-03`, nivel Difícil) — nunca se introduce un tema completamente nuevo solo
  en modo difícil; la dificultad escala mostrando menos letra del mismo universo de
  temas de la partida, no cambiando de tema (pedido explícito del usuario en
  `/kickoff`).

**Criterio 3 — caso borde (exposición de derechos):**
- **Given** cualquier ítem de este juego, en cualquier nivel.
- **When** se renderiza en pantalla.
- **Then** nunca muestra más de 5 versos completos de una misma canción a la vez (tope
  fijado en `BR-03`), y el juego completo no se publica hasta que la nota de derechos de
  `contenido` lo habilite explícitamente — gate de publicación, no de construcción (ver
  "El gate de derechos" en `Docs/BRIEF.md`).

**Piso de ítems: 15 letras completas**, transcriptas y segmentadas en versos.
- Mínimo 4 de nivel Fácil.
- **Por qué 15 y no 40:** cada ítem exige transcribir la letra completa y segmentarla en
  versos, y es el contenido con mayor exposición directa a derechos de autor (letra
  completa, no un fragmento). Un piso similar al de audio, menor al del quiz, refleja
  ese costo y esa exposición. 15 alcanza para que la partida no repita siempre el mismo
  tema que el jugador acaba de escuchar en "adivinar el tema".

**Queda fuera de esta historia:** la tolerancia de matching cuando el jugador escribe
con errores de tipeo, mayúsculas o tildes (dueño `experiencia` para el mecanismo de
input, `contenido` para qué cuenta como "la palabra correcta").

---

## BR-03 — Niveles de dificultad de "completar la letra"

**Aplica a:** `US-03`. Fija lo que el brief dejó `PENDIENTE`: "cuánta letra se muestra
en cada nivel de dificultad". Pedido explícito del usuario en `/kickoff`: la dificultad
escala **mostrando menos letra**, nunca cambiando de tema.

**Unidad de medida:** versos completos visibles alrededor del hueco. El corte respeta
siempre el verso entero — nunca se muestra medio verso ni un adjetivo suelto separado de
su línea. El hueco a completar es siempre una palabra o frase corta dentro de un verso,
en los 3 niveles por igual; lo único que cambia entre niveles es el contexto alrededor,
nunca el tamaño del hueco.

| Nivel | Versos visibles antes del hueco | Versos visibles después | Título visible | Disco visible |
|---|---|---|---|---|
| Fácil | 2 | 2 | Sí | Sí |
| Media | 1 | 1 | Sí | No |
| Difícil | 0 (verso pelado) | 0 | No | No |

**Tope de exposición de derechos:** en ningún nivel se muestran más de 5 versos
completos de una misma canción a la vez (el máximo es el nivel Fácil: 2 + el verso del
hueco + 2). Este número es el que `contenido` cita en su nota de derechos para acotar
cuánta letra por ítem queda expuesta.

---

## BR-04 — Cantidad de opciones en una pregunta de múltiple choice

**Confirmo 4**, ni tres ni cinco. **Aplica a `US-01`, `US-02` y `US-04`**, el mismo número
para las tres: la cuenta de azar no distingue si la opción es texto, un tema de audio o
una tapa. Con 4 opciones el que no sabe nada acierta al azar el 25% de las veces; con 3
sube al 33% y empieza a rendirle casi como al que sabe, justo en los ítems Fáciles que
`BR-01` pone primero en toda partida — eso vacía la promesa de "premiar al que sabe". Con
5 el azar baja al 20%, pero choca con "jugable con el pulgar" (`D-09`, no negociable): 5
puntos porcentuales de rigor no justifican ceder un criterio que no cede.

> **Extensión a `US-02`, 2026-08-19.** `BR-04` no nombraba a `US-02` porque esa historia
> dejó el mecanismo de respuesta explícitamente fuera de alcance. `arquitectura` escaló la
> ausencia de regla en `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md` al
> escribir `CTR-03`, porque sin esta regla, 4 opciones combinadas con el reveal progresivo
> de `BR-02` (tal como estaba redactado) rendían 70 puntos esperados con piso de 40 para
> quien tira al azar, y volvían inalcanzables el paso 5 y la rama de 0 puntos. Cierro las
> dos mitades del problema juntas: confirmo 4 opciones acá, y corrijo la mecánica de
> intentos en `BR-02` para que la cuenta de azar vuelva a valer 25% esperado, igual que en
> el quiz (verificación completa en `BR-02`). `modoRespuesta: "opciones"` en `CTR-03` deja
> de ser un valor de trabajo — queda confirmado.

---

## BR-05 — Cortes de puntaje de los tres tramos de resultado (bajo / medio / alto)

**Aplica a:** `US-01`, pantalla de resultado del quiz. Pedido por `experiencia` en
`Docs/SUGERENCIAS/UX-para-producto-historias-quiz-y-audio.md` — única cosa que quedó
abierta tras `UX-01` (pantalla final) y `UX-02` (tarjeta compartible): ambas diseñan la
*estructura* de tres niveles y esperan de acá el % de aciertos que separa cada tramo.

**Los dos cortes, en % de aciertos sobre el total de la ronda, sin huecos ni solapes:**

| Tramo | Rango de % de aciertos |
|---|---|
| Bajo | 0% ≤ x < 30% |
| Medio | 30% ≤ x < 70% |
| Alto | 70% ≤ x ≤ 100% |

**Por qué el corte de abajo va en 30% y no en 25% o menos:** `BR-04` fija 4 opciones por
pregunta, y con 4 opciones el azar puro rinde 25% de aciertos — un jugador que responde
sin saber nada, al azar, saca en promedio 2 de 8. Si ese resultado cayera en "medio", el
tramo medio dejaría de distinguir "sabe algo" de "tocó botones al azar", y vaciaría la
promesa del brief de "premiar al que sabe sin expulsar al que recién llega" (`D-09`). El
corte en 30% deja al azar puro firmemente adentro de "bajo", con 5 puntos porcentuales de
margen para que ningún redondeo real lo empuje a "medio". El corte de arriba (70%) no
tiene la misma restricción — no hay un umbral de azar que defender ahí — y queda fijado
para que "alto" represente una minoría exigente sin vaciar "medio" del otro lado.

**Cómo redondea sobre una ronda de 8 preguntas (`US-01` criterio 1):** los únicos
resultados posibles son 0 a 8 aciertos — nueve valores discretos de %: 0 / 12,5 / 25 /
37,5 / 50 / 62,5 / 75 / 87,5 / 100. Verificado a mano contra los cortes de arriba:

| Aciertos | % | Tramo |
|---|---|---|
| 0/8 | 0% | Bajo |
| 1/8 | 12,5% | Bajo |
| 2/8 | 25% | Bajo |
| 3/8 | 37,5% | Medio |
| 4/8 | 50% | Medio |
| 5/8 | 62,5% | Medio |
| 6/8 | 75% | Alto |
| 7/8 | 87,5% | Alto |
| 8/8 | 100% | Alto |

Los tres tramos reciben al menos un valor posible (tres cada uno), `0/8` cae en Bajo,
`8/8` cae en Alto, y ningún resultado posible de 8 preguntas cae justo sobre un corte
(30% y 70% quedan entre dos valores discretos), así que no hace falta regla de desempate
por redondeo.

**Fuera de esta regla:** el título/copy de cada tramo (dueño `contenido`) y el arte
asociado por tramo (dueño `experiencia`, `UX-04`) — acá solo se fijan los dos números.

---

## US-04 — Adivinar la tapa o el disco

**Prioridad:** Media (P1) — **la primera que se cae si hay que recortar** (`D-05`: es
la de mayor exposición a la obra de Rocambole, artista vivo, y la que menos depende del
resto del sistema).

Como jugador que reconoce tapas de memoria, quiero ver una tapa y adivinar a qué disco
pertenece, para demostrar que conozco la discografía visualmente, en una partida que
cierra igual de rápido que las otras tres.

**Criterio 1 — caso feliz:**
- **Given** un jugador arranca una partida, cuyo primer ítem es Fácil por `BR-01`.
- **When** se le muestra una tapa en baja resolución con crédito a Rocambole (`D-04`).
- **Then** puede elegir entre opciones de múltiple choice (nunca tipeo — jugable con el
  pulgar, criterio no negociable) cuál es el disco correcto, y ve el resultado
  inmediatamente sin pasos adicionales.

**Criterio 2 — caso borde (pool en su piso mínimo):**
- **Given** el pool de tapas está en su piso mínimo (10).
- **When** un jugador juega varias partidas seguidas.
- **Then** el juego sigue siendo jugable de punta a punta (arranca, muestra tapas,
  cierra con resultado) aunque repita tapas entre partidas distintas — repetir contenido
  entre partidas no es lo mismo que no cerrar un ciclo dentro de una partida.

**Criterio 3 — caso borde (es el primero que se cae):**
- **Given** este es el juego con mayor exposición a la obra de Rocambole.
- **When** llega el momento de publicar el sitio.
- **Then** es el primero en quedar fuera de la versión publicada si la nota de derechos
  de `contenido` no cubre explícitamente el uso de tapas reales, sin que eso bloquee la
  publicación de los otros tres juegos (orden de corte, `D-05`).

**Piso de ítems: 10 tapas o discos.**
- Mínimo 3 de nivel Fácil.
- **Por qué 10 y no más:** a propósito es el piso más bajo de los cuatro. Es el juego
  que se cae primero (`D-05`), así que mantener su piso bajo minimiza el trabajo hundido
  si hay que recortarlo entero. Al mismo tiempo, con menos de 10 el jugador memoriza el
  pool completo en una sola sesión y el juego deja de ser un desafío. La cobertura
  ideal es la discografía de estudio completa; el número final de discos oficiales no lo
  fijo yo sin fuente — queda sujeto a una ficha `RES-XX` de `investigador` (`D-09`,
  ningún dato falso incluye no inventar cuántos discos hay).

**Queda fuera de esta historia:** si la tapa se muestra completa o recortada/pixelada
como parte de la mecánica de dificultad (dueño `experiencia`, con el material que
`investigador` fiche).

---

## Piso de ítems — resumen

| Juego | Piso | Mínimo Fácil | Costo dominante |
|---|---|---|---|
| Quiz (`US-01`) | 40 preguntas | 10 | Texto — el más barato, se construye primero |
| Adivinar el tema (`US-02`) | 20 temas | 5 | Audio propio por ítem (`D-06`) |
| Completar la letra (`US-03`) | 15 letras | 4 | Transcripción + mayor exposición a derechos |
| Adivinar la tapa (`US-04`) | 10 tapas | 3 | Imagen con derechos; primero que se cae (`D-05`) |

Ningún juego cierra un ciclo por debajo de su piso, sin importar cuánto tiempo lleve el
motor terminado.

---

## PENDIENTE

- **Duración exacta en segundos de cada paso del reveal de audio.** Dueño:
  `arquitectura`. `BR-02` fija que sean 5 pasos con esos puntos; falta mapear cada paso
  a segundos concretos dentro del presupuesto de precarga que ya está `PENDIENTE` en el
  brief. Dejé propuesta en
  `Docs/SUGERENCIAS/PRD-para-arquitectura-pasos-reveal-audio.md`.
- **Número real de discos de estudio para el piso de `US-04`.** El piso de 10 es un
  mínimo jugable, no la cobertura final. Dueño: `investigador`, ficha `RES-XX`.
- **Validación del tiempo real de partida** (8 preguntas / 5 temas / 5 letras / 6 tapas
  son supuestos de pacing, no medidos). Dueño: `experiencia`, al diseñar el flujo de
  sesión.
- **Tolerancia de matching de texto libre** en "completar la letra" si el input no es
  múltiple choice. Dueño: `experiencia` (mecanismo), `contenido` (qué cuenta como
  correcto).
- No fijé el schema JSON que guarda la etiqueta de dificultad ni los pasos del reveal:
  es `CTR-XX` de `arquitectura`.
