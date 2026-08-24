# PRD — Alcance v1: los cuatro juegos

> Consume: `Docs/BRIEF.md` ("Listo de la v1", "Orden de corte", "Criterios no
> negociables", riesgos 4 y 6), `Docs/DECISIONES.md` `D-05`, `D-04`, `D-06`, `D-08`,
> `D-09`, `D-10`, `D-24`.
>
> Los cuatro juegos (quiz, adivinar el tema, completar la letra, adivinar la tapa o el
> disco) están **confirmados por `D-05`** en el `/kickoff` del usuario — este documento
> no los re-discute. Lo que faltaba y produce este archivo: criterio de aceptación por
> juego, piso de ítems, y las reglas de negocio que el brief dejó como `PENDIENTE` a
> cargo de `producto` (dificultad de "completar la letra", puntaje del reveal de audio).
>
> **Revisión 2026-08-24 (`T-99`, ciclo 7).** Consume además `D-24` y los dos hilos que la
> devuelven a `producto`: `Docs/SUGERENCIAS/HILO-para-producto-mecanica-y-escalera-de-us02.md`
> y `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`. `US-02` ya estaba construida
> con seis intentos y buscador cuando `BR-02` todavía describía intento único con cuatro
> opciones — esta revisión hace que la regla escrita diga lo que el juego hace. Toca
> `US-02`, `BR-02`, `BR-04` y el piso de `US-02`. El resto del documento no se tocó.

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

> **Revisión 2026-08-24, sobre `D-24` y `T-99`.** El criterio 1 describía **intento
> único** ("si falla, el ítem se cierra en 0 puntos") y no fijaba largo de ronda. El
> juego construido, calcado a propósito del juego de referencia (`D-24`), es **seis
> intentos con desbloqueo** y una vuelta de **cuatro temas**. Se reescribe el criterio 1
> para que describa eso. Los criterios 2 y 3 no cambian de mecánica y quedan como están,
> salvo el aviso sobre `US-02` criterio 3 en `PENDIENTE`, al final del archivo.

Como jugador que reconoce temas de oído, quiero escuchar un fragmento cada vez más
largo de un tema y arriesgar cuál es, para demostrar que lo reconozco con lo mínimo
posible y ganar más puntos cuanto menos necesité escuchar.

**Criterio 1 — caso feliz:**
- **Given** un jugador arranca un ítem nuevo, que por `BR-01` es de nivel Fácil si es el
  primero de la partida.
- **When** se reproduce el paso 1 del reveal (0,1 seg) y el jugador busca un título en el
  buscador de los 105 temas de `RES-20` y **arriesga** una respuesta, o **pasa** si no
  tiene ningún candidato — tiene **seis intentos por tema**, uno por escalón (`BR-02`).
- **Then** cada intento gastado (arriesgar mal, o pasar) abre el escalón siguiente de
  audio; si acierta en cualquiera de los seis, el ítem se cierra con el puntaje del
  escalón en que acertó (tabla de `BR-02`); si agota los seis intentos sin acertar, el
  ítem se cierra en 0 puntos, se revela la respuesta correcta, y la partida sigue con el
  próximo ítem sin bloquear al jugador (mismo principio de continuidad que `US-01`
  criterio 2). **Una vuelta son cuatro temas**: a un ritmo de hasta seis intentos por
  tema —cada uno con su propio audio y su tipeo en el buscador— cuatro temas llenan los
  dos o tres minutos del brief con el mismo margen que el quiz reserva para sus 8
  preguntas más simples; `experiencia` valida el tiempo real y puede ajustar el número
  vía `Docs/SUGERENCIAS/`.

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

**Piso de ítems: 30 temas** (subido de 20 — revisión 2026-08-24, ver nota abajo), cada
uno con fragmento de audio propio.
- Mínimo 8 de nivel Fácil (hits reconocibles), resto repartido en Media/Difícil. Sube de
  5 a 8 en la misma proporción que el piso: mantiene el ~25-27% que ya usan los otros
  tres juegos (10/40 del quiz, 4/15 de letras), para que `BR-01` no repita siempre el
  mismo puñado de temas fáciles.
- **Por qué sube de 20 a 30 y no se queda ni iguala al quiz (revisión 2026-08-24, sobre
  `D-24`):** el piso original cargaba **dos** costos por ítem — producir el fragmento de
  audio (`D-06`) y curar tres distractores para el múltiple choice que `BR-04` le exigía
  hasta el 19 de agosto. El segundo costo **desapareció**: con el buscador de `D-24` la
  respuesta sale de elegir un título entre los 105 de `RES-20`, un pool compartido por
  todos los ítems, no un conjunto de opciones que haya que redactar uno por uno. Lo único
  que sigue costando por ítem es el fragmento de audio, y ese costo **no bajó** — sigue
  siendo trabajo manual del usuario (`D-06`). Por eso el piso sube (se fue la mitad del
  costo original), pero se queda lejos del piso de 40 del quiz (la otra mitad, la que no
  se fue, sigue siendo más cara que redactar una pregunta de texto).
- **Esto toca la definición de "Listo" de la v1.** `Docs/BRIEF.md`, sección "Listo de la
  v1", cita literalmente "cada uno con su piso de ítems cumplido (40 / 20 / 15 / 10)" —
  ese segundo número queda desactualizado hasta que se corrija ahí. No lo edito en este
  archivo porque `Docs/BRIEF.md` no es mío; queda anotado en `PENDIENTE`.

**Queda fuera de esta historia:** cómo se sirve el tema completo al revelar (`D-22`
lo saca de Spotify y lo pasa a mp3 propio; el criterio 3 de esta historia y el bullet de
arriba todavía describen la vía vieja — ver `PENDIENTE`, no es parte de esta revisión).

---

## BR-02 — Puntaje del reveal progresivo en "adivinar el tema"

**Aplica a:** `US-02`.

> **Revisión 2026-08-19 (histórica, superada por la de abajo).** La mecánica de intentos
> de esta regla se corrigió a partir de
> `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md` (`arquitectura`, `T-24`).
> El texto original permitía errar gratis en cada paso; combinado con `BR-04` (4 opciones,
> extendida entonces también a `US-02`) eso le daba a un jugador que no reconoce nada un
> esperado de 70 puntos con piso de 40, y volvía inalcanzables el paso 5 y la rama de 0
> puntos. La corrección de esa fecha fue **intento único**: errás y el ítem se cierra en
> cero, sin reintento.

> **Revisión 2026-08-24, sobre `D-24` y `T-99`.** El usuario trajo el juego que quiere
> calcado (relevado en `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`) y hace
> **exactamente lo contrario** de la revisión del 19 de agosto: no hay intento único, hay
> **seis intentos**, y errar —o pasar— es lo que abre el escalón siguiente. `US-02` ya
> está construida así (`src/lib/tema/escalera.ts`, `src/scripts/partida-tema.ts`); esta
> revisión hace que la regla escrita diga lo que el juego hace. Reemplaza "la respuesta es
> un solo intento por ítem" y la tabla de 5 filas de la revisión anterior. **Por qué no
> reabre el agujero que motivó el intento único:** ese agujero existía porque, con 4
> opciones, errar gratis era una máquina de descartar hasta la última opción
> sobreviviente. Ahora no hay opciones que descartar — hay un buscador sobre 105 títulos
> (`BR-04`, revisión de esta misma fecha) — así que errar ya no elimina nada útil para el
> jugador. Castigar el error con el ítem entero, en ese contexto, solo servía para cerrar
> el molinete al que entra sin reconocer nada, dejándolo con 0,1 segundo escuchado y nada
> más (`D-14`). Verificación aritmética completa al final de esta regla.

**Pasos:** el reveal tiene **seis pasos fijos**, numerados 1 a 6, de 0,1 a 15 segundos:
0,1 · 0,5 · 2 · 4 · 8 · 15. Los cinco primeros son los que ya fijaba esta regla desde el
19 de agosto; el sexto lo agrega `D-24` porque la escalera del juego de referencia tiene
un escalón más. La duración exacta en segundos deja de ser un `PENDIENTE` de
`arquitectura`: `D-24` la fijó junto con la mecánica y `arquitectura` ya la aplicó en
`CTR-01.9`.

**Mecánica (reescrita — seis intentos con desbloqueo):** el jugador tiene **seis
intentos por tema**, uno por escalón. En cada intento puede:
- **Arriesgar** una respuesta, elegida de un buscador con autocompletado sobre los 105
  títulos de `RES-20` — no hay opciones que contar (`BR-04` ya no aplica a este juego).
- **Pasar**, si no tiene ningún candidato para proponer.

Las dos acciones cuestan lo mismo, **un intento**, y las dos abren el escalón siguiente
(más audio). No hay forma de escuchar más sin gastar un intento, y no hay forma de gastar
un intento sin recibir más audio a cambio.

- **Si acierta:** el ítem se cierra en el acto con el puntaje de la tabla de abajo, según
  el escalón en el que respondió.
- **Si se le acaban los seis intentos sin acertar** (haya arriesgado, pasado, o combinado
  ambas cosas): el ítem se cierra en **0 puntos**, se revela la respuesta correcta, y la
  partida sigue con el próximo ítem — mismo principio de continuidad que el quiz
  (`US-01` criterio 2).

**Por qué "pasar" cuesta un intento y no es gratis** — es la mitad de la mecánica que el
mapa del juego de referencia dejó abierta para que `producto` la confirmara. Pasar y
arriesgar le dan al jugador exactamente lo mismo, el escalón siguiente, así que cobrarle
distinto premiaría la inacción por sobre el intento. Y hay un motivo de fondo: si pasar
fuera gratis, la ronda de seis intentos dejaría de ser un techo real — nada impediría
escuchar los 15 segundos completos sin gastar el recurso que hace que el ítem cierre, y
la vuelta de cuatro temas dejaría de caber en los dos o tres minutos del brief. Con los
seis intentos parejos, ese techo se sostiene. **Pasar existe igual, y no es decorativo:**
es la salida honesta para el jugador que no reconoce nada del catálogo y no tiene ningún
título para proponer — nadie está obligado a tipear una respuesta que no tiene, y esa es
la otra mitad de "sin muro de entrada" (`D-14`). Coincide con el juego de referencia, que
cobra lo mismo por *Skip* que por errar.

**Tabla de puntaje** (las cinco primeras filas son las que ya tenía esta regla, sin
tocar; la sexta la agrega esta revisión):

| Paso alcanzado al responder | Segundos | Puntos si acierta |
|---|---|---|
| 1 | 0,1 s | 100 |
| 2 | 0,5 s | 80 |
| 3 | 2 s | 60 |
| 4 | 4 s | 40 |
| 5 | 8 s | 20 |
| 6 (fragmento completo) | 15 s | **10** |

**Por qué 10 y no 0 en el paso 6:** dos partes de esta regla siguen intactas sin
excepción. Primero, **0 puntos es exclusivamente el resultado de una respuesta
incorrecta** (o de agotar los seis intentos sin responder), nunca el resultado de haber
tardado en acertar. Segundo, un acierto **nunca puede valer 0**, porque eso premiaría
igual al que reconoció el tema recién en el fragmento completo y al que directamente no
lo sacó. **Por qué 10 y no otro número:** confirmo el valor que `D-24` dejó provisorio.
Sigue la caída de a 20 puntos que traían los primeros cuatro escalones y la suaviza en
los últimos dos —de 40 a 20 y de 20 a 10— para no tocar el piso. Es además el valor que
ya está escrito en `src/lib/tema/escalera.ts`, así que confirmarlo cierra la brecha entre
esta regla y el juego construido sin pedirle a nadie que retoque una línea de código.

**Si nunca responde:** si el jugador agota los seis intentos sin haber arriesgado nunca
(pasó las seis veces), cuenta igual que agotar los seis fallando — 0 puntos, respuesta
revelada, la partida sigue.

**Verificación aritmética — jugador que no reconoce absolutamente nada:**

Cambia de raíz respecto de la verificación de la revisión anterior, porque cambió el
mecanismo de responder: ya no hay 4 opciones entre las que tirar una moneda, hay un
buscador sobre los **105 títulos** de `RES-20`. Para un jugador que no reconoce el tema
pero conoce el catálogo, arriesgar un título al azar cuesta lo mismo que pasar y encima
suma una chance de acertar — así que la mejor estrategia posible es tirar seis títulos
distintos, uno por intento, nunca pasar de arranque.

Con seis títulos distintos elegidos sin ninguna información, la probabilidad de que
alguno sea el correcto es 6/105, y por simetría —cualquiera de los seis intentos tiene la
misma chance de ser el que acierta— la probabilidad de acertar justo en el intento `n`
(para `n` de 1 a 6) es 1/105 en cada uno:

| Resultado | Probabilidad | Puntos |
|---|---|---|
| Acierta en el paso 1 | 1/105 | 100 |
| Acierta en el paso 2 | 1/105 | 80 |
| Acierta en el paso 3 | 1/105 | 60 |
| Acierta en el paso 4 | 1/105 | 40 |
| Acierta en el paso 5 | 1/105 | 20 |
| Acierta en el paso 6 | 1/105 | 10 |
| No acierta nunca | 99/105 | 0 |

**Esperado:** (100+80+60+40+20+10)/105 = 310/105 ≈ **2,95 puntos por tema**. Contra el
techo de 25 que fijaba la verificación anterior —y que `BR-04` sigue usando como vara
para el quiz con 4 opciones—, el azar puro rinde acá casi diez veces menos. Dejar
responder sin castigar el error de más no reabre el agujero que motivó el intento único
del 19 de agosto: con 105 títulos, el azar directamente no paga.

**Rama de 0 y paso 6, alcanzables:**
- **Rama de 0:** con la cuenta de arriba, es el resultado del **94,3%** de las tiradas de
  un jugador sin reconocimiento (99/105). Sigue siendo, con enorme margen, el resultado
  más probable para quien no sabe — la promesa de "premiar al que sabe" queda intacta.
- **Paso 6 (10 puntos):** se alcanza cada vez que un jugador, sepa o no, escucha el
  fragmento completo de 15 segundos antes de reconocer el tema. No hace falta ninguna
  eliminación de opciones para llegar ahí: alcanza con pasar o arriesgar cinco veces.

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

**Confirmo 4**, ni tres ni cinco. **Aplica a `US-01` y `US-04`**, el mismo número para
las dos: la cuenta de azar no distingue si la opción es texto o una tapa. Con 4 opciones
el que no sabe nada acierta al azar el 25% de las veces; con 3 sube al 33% y empieza a
rendirle casi como al que sabe, justo en los ítems Fáciles que `BR-01` pone primero en
toda partida — eso vacía la promesa de "premiar al que sabe". Con 5 el azar baja al 20%,
pero choca con "jugable con el pulgar" (`D-09`, no negociable): 5 puntos porcentuales de
rigor no justifican ceder un criterio que no cede.

> **Extensión a `US-02`, 2026-08-19 (histórica, retirada por la revisión de abajo).**
> `BR-04` no nombraba a `US-02` porque esa historia dejó el mecanismo de respuesta
> explícitamente fuera de alcance. `arquitectura` escaló la ausencia de regla en
> `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md` al escribir `CTR-03`,
> porque sin esta regla, 4 opciones combinadas con el reveal progresivo de `BR-02` (tal
> como estaba redactado) rendían 70 puntos esperados con piso de 40 para quien tira al
> azar, y volvían inalcanzables el paso 5 y la rama de 0 puntos. Esa fecha cerró las dos
> mitades del problema juntas: confirmó 4 opciones para `US-02` y corrigió `BR-02` a
> intento único.

> **Retiro de `US-02`, 2026-08-24, sobre `D-24` y `T-99`.** `US-02` deja de responder por
> opciones: el buscador con autocompletado de `D-24`, sobre los 105 títulos de `RES-20`,
> reemplaza el múltiple choice que la extensión de arriba le había impuesto.
> **`BR-04` deja de aplicar a `US-02`** — vuelve a aplicar solo a `US-01` y `US-04`, como
> en su redacción original. No hay "cuatro opciones" que contar cuando la respuesta sale
> de elegir un título de una lista de 105: el control del azar de ese juego se movió
> entero a `BR-02`, que lo recalcula contra el tamaño real del catálogo (105) en vez de
> contra un número fijo de opciones. `modoRespuesta: "buscador"` en `CTR-03.5` es el valor
> que corresponde ahora; `"opciones"` queda retirado para este juego.

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
| Adivinar el tema (`US-02`) | 30 temas *(subido de 20 el 2026-08-24)* | 8 | Audio propio por ítem (`D-06`) — bajó al perder la curación de distractores que exigía el múltiple choice (`D-24`) |
| Completar la letra (`US-03`) | 15 letras | 4 | Transcripción + mayor exposición a derechos |
| Adivinar la tapa (`US-04`) | 10 tapas | 3 | Imagen con derechos; primero que se cae (`D-05`) |

Ningún juego cierra un ciclo por debajo de su piso, sin importar cuánto tiempo lleve el
motor terminado.

---

## PENDIENTE

- ~~**Duración exacta en segundos de cada paso del reveal de audio.**~~ **[RESUELTO
  2026-08-24 por `D-24`.]** Ya no es un pendiente de `arquitectura`: la escalera de seis
  pasos y sus segundos (0,1 · 0,5 · 2 · 4 · 8 · 15) quedaron fijados junto con la
  mecánica de `US-02`, y `BR-02` los cita ahora.
- **Número real de discos de estudio para el piso de `US-04`.** El piso de 10 es un
  mínimo jugable, no la cobertura final. Dueño: `investigador`, ficha `RES-XX`.
- **`US-02` criterio 3 y su bullet de "queda fuera de esta historia" describen todavía la
  vía vieja de Spotify** ("si no tiene la app o no tiene Premium…", "la vía técnica
  exacta del link o embed de Spotify"). `D-22` reemplazó esa vía por mp3 propio del
  sitio antes de esta revisión, y el juego construido (`src/scripts/partida-tema.ts`,
  `pintarRevelacion`) ya no toca Spotify — usa `tema.entero` y un `<audio>` propio. No lo
  reescribí en `T-99` porque no era su alcance (la tarea pedía `BR-02`, no `D-22`).
  Dueño: `producto`, próxima ráfaga.
- **El piso de `US-02` subió a 30 (revisión 2026-08-24) y `Docs/BRIEF.md` sigue citando
  "(40 / 20 / 15 / 10)" en "Listo de la v1".** Ese número quedó desactualizado. No lo
  edito acá porque `Docs/BRIEF.md` no es carpeta de `producto` en el sentido de "archivo
  que este PRD sobrescribe" — lo fija `/kickoff` — pero si alguien lo vuelve a tocar,
  el número correcto para `US-02` es 30. Dueño: quien próximamente actualice el brief.
- **Validación del tiempo real de partida** (8 preguntas / 5 letras / 6 tapas siguen
  siendo supuestos de pacing, no medidos; los 4 temas de `US-02` dejaron de serlo el
  2026-08-24: `D-24` los confirmó junto con la mecánica, no es una cuenta de `producto`
  a ojo). Dueño: `experiencia`, al diseñar el flujo de sesión.
- **Tolerancia de matching de texto libre** en "completar la letra" si el input no es
  múltiple choice. Dueño: `experiencia` (mecanismo), `contenido` (qué cuenta como
  correcto).
- No fijé el schema JSON que guarda la etiqueta de dificultad ni los pasos del reveal:
  es `CTR-XX` de `arquitectura`.
