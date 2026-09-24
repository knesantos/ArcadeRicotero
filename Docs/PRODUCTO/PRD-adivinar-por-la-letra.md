# PRD — Adiviná el tema por la letra: el juego nuevo que convive con el de audio

> **Consume:** `Docs/ORQ/ORQ-plan-ciclo-9.md` (`T-130`), pedido del usuario *"arma entero el
> juego de adivinar el tema por las letras"* y su aclaración sobre `US-02`: **"es un juego
> nuevo, convive"**. `Docs/BRIEF.md` ("Listo de la v1", riesgo 4). `Docs/DECISIONES.md`
> `D-05` (cuatro juegos confirmados en `/kickoff`, no se redefinen solos), `D-14` (molinetes
> abiertos), `D-17`/`D-24` (voseo, buscador sobre 105 títulos). `Docs/PRODUCTO/PRD-alcance-
> v1.md` — `BR-01` (escalonamiento sin muro), `BR-02` (escalera y puntaje de `US-02`, el
> juego hermano), `BR-04` (no aplica acá, igual que dejó de aplicar a `US-02`), y `US-06`
> como precedente directo de "queda fuera del contrato de cuatro sin dejar de construirse".
> `src/lib/tema/escalera.ts`, `src/lib/tema/buscador.ts` y `catalogo.ts` (mecánica y
> herramientas reusables). `src/data/cancionero.json` (101 temas con letra sobre 104) y
> `src/data/letra.json` (recurso de `US-03`, **no** la fuente de este banco — ver más
> abajo). `.claude/rules/voz-ricotera.md` (registro 1, títulos ≤ 8 palabras).
>
> **Produce:** `US-07`, `BR-20`.

## Qué es este archivo y qué no

Esto fija la historia y la regla de negocio del quinto — en rigor, sexto contando la
Redondopedia — juego del sitio: adivinar un tema a partir de versos de su letra, cada vez
más largos, en vez de a partir de audio. **No toca `US-02`** ni su escalera de segundos: son
juegos hermanos que comparten catálogo (105 títulos, `RES-20`) y mecanismo de respuesta
(buscador), pero cada uno con su propia escalera y su propio banco. No fijo acá el schema
JSON (`CTR-09`, `arquitectura`), ni la pantalla (`UX-08`, `experiencia`), ni el texto de las
preguntas ni la regla fina de qué verso puede abrir la escalera (`CNT-11`, `contenido`).

## Nombre del juego

**"Sacalo por la letra."** Tres palabras, voseo imperativo (`D-17`), sin anglicismo, y
distinto de "Adiviná el tema" (`US-02`) a propósito: los dos empiezan con "adiviná" y
comparten catálogo, así que un nombre calcado los mezclaría en la cabeza de quien los ve
listados uno al lado del otro. "Sacar" en el sentido de "che, la sacaste" — reconocer algo
con lo mínimo — es más preciso para este juego que "adivinar": acá no hay azar de opciones
como en el quiz o en la tapa, hay reconocimiento genuino de la letra, y "sacarlo" nombra
exactamente eso. Cumple el techo de 8 palabras y el registro 1 de `voz-ricotera.md`
(imperativo, segunda persona, no explica). El copy exacto de la bajada de casete (la línea
que "canta" junto a esta que "nombra", sección 5 de esa regla) es de `contenido`.

---

## US-07 — Sacalo por la letra (adivinar el tema por sus versos)

**Prioridad: no forma parte del "Listo" de la v1.**

`D-05` confirmó en `/kickoff` que la v1 cierra con **cuatro** juegos: quiz, adivinar el
tema (audio), completar la letra, adivinar la tapa. Esa es una decisión del usuario, no
algo que `producto` reabra en solitario porque apareció una idea nueva y buena — es
exactamente el mismo argumento que ya usé para dejar a `US-06` fuera de ese contrato
(`PRD-alcance-v1.md`). `US-07` entra al sitio del mismo modo que ya entraron `US-05`
(Redondopedia) y `US-06` (dos ejes): **construible y publicable sin esperar a nada, pero
contada aparte de los cuatro que definen si la v1 está "lista".** Que el usuario haya
dicho "es un juego nuevo, convive" resuelve la pregunta de si reemplaza a `US-02` (no la
reemplaza), no la pregunta de si entra al contrato de cuatro (no entra, por el mismo motivo
que `US-06` no entró).

**Por qué esto no es una mala noticia para el ciclo 9.** El corpus que este juego necesita
—letras ya transcriptas— es el mismo que destrabó `US-03`, y el costo por ítem es cero: no
hay que grabar audio ni curar distractores. Puede llegar a su piso en la misma ráfaga en
que se construye, cosa que ningún otro juego del sitio logró hasta ahora en un solo ciclo.

Como jugador que se sabe las letras, quiero ver versos cada vez más largos de un tema y
arriesgar cuál es buscándolo entre los 105 títulos, para demostrar que reconozco la canción
por su letra y no solo de oído ni por el título en la tapa.

### Criterio 1 — caso feliz

- **Given** un jugador arranca un ítem nuevo, que por `BR-01` es de nivel Fácil si es el
  primero de la partida.
- **When** se muestra el paso 1 de la escalera (1 verso) y el jugador busca un título en el
  buscador de los 105 temas de `RES-20` y **arriesga** una respuesta, o **pasa** si no tiene
  ningún candidato — tiene **cuatro intentos por tema**, uno por escalón (`BR-20`).
- **Then** cada intento gastado (arriesgar mal, o pasar) abre el escalón siguiente de
  versos; si acierta en cualquiera de los cuatro, el ítem se cierra con el puntaje del
  escalón en que acertó (tabla de `BR-20`); si agota los cuatro intentos sin acertar, el
  ítem se cierra en **0 puntos**, se revela el tema correcto, y la partida sigue con el
  próximo ítem sin bloquear al jugador (mismo principio de continuidad que `US-01` criterio
  2 y `US-02` criterio 1). **Una vuelta son 6 temas**: con hasta cuatro intentos por tema
  —cada uno solo tipeo en el buscador, sin espera de audio— seis temas suman el mismo total
  de intentos máximo que una vuelta de `US-02` (24), y caben en los dos o tres minutos del
  brief con margen equivalente; `experiencia` valida el tiempo real y puede ajustar el
  número vía `Docs/SUGERENCIAS/`.

### Criterio 2 — caso borde (el verso no puede delatar el título)

- **Given** cualquier ítem de este juego, en cualquiera de sus cuatro pasos.
- **When** se muestran los versos revelados hasta ese paso.
- **Then** ninguno de esos versos contiene el título del tema como texto literal. Si el
  primer escalón mostrara justo el estribillo y el estribillo dijera el título, el ítem se
  ganaría solo y dejaría de medir nada — el mismo defecto que tendría un quiz cuya respuesta
  apareciera en el enunciado. **La regla exacta de qué verso puede abrir la escalera de cada
  ítem —por ejemplo, evitar arrancar justo en el estribillo, o descartar el ítem si todos
  sus versos tempranos mencionan el título— la fija `contenido` (`CNT-11`, `T-137`)**; esta
  historia solo deja sentado que la restricción existe, que es condición de que el ítem
  esté "listo", y que aplica en los cuatro pasos, no solo en el primero.

### Criterio 3 — caso borde (fuente única, y por qué acá pesa distinto que en `US-03`)

- **Given** un verso de un ítem viene de una fuente única (cifraclub, lacuerda.net o
  letras.com — una por tema, sin segunda fuente que la confirme).
- **When** ese verso se muestra en cualquiera de los cuatro pasos.
- **Then** el ítem sigue siendo válido tal cual está transcripto: una palabra mal
  transcripta no cambia cuál es el tema correcto, a diferencia de `US-03` donde el jugador
  escribe la palabra exacta que falta y una transcripción mala le marca error al que se
  sabe la canción. Por eso `US-07` **no necesita el candado que `D-25` tuvo que abrir a
  mano para `US-03`** (dos fuentes o confirmación de oído): el riesgo de fuente única acá es
  de otro orden — lo mide `Docs/ORQ/ORQ-plan-ciclo-9.md`, sección "El riesgo del ciclo" — y
  no compromete el criterio no negociable de veracidad, porque lo único que el jugador tiene
  que acertar es el título del tema, no una palabra suelta.

### Criterio 4 — caso borde (pool en su piso mínimo)

- **Given** el pool de temas está en su piso mínimo (60).
- **When** un jugador juega varias partidas seguidas.
- **Then** el juego sigue siendo jugable de punta a punta (arranca, muestra versos, cierra
  con resultado) aunque repita temas entre partidas distintas — repetir contenido entre
  partidas no es lo mismo que no cerrar un ciclo dentro de una partida (mismo principio que
  `US-04` criterio 2).

### Piso de ítems: 60 temas con letra, cada uno con su escalera de versos armada.

- **Mínimo 15 de nivel Fácil** (25%, misma proporción que usan los otros tres juegos con
  etiqueta manual: 10/40 del quiz, 4/15 de letras, 3/10 de tapas) para que `BR-01` no repita
  siempre el mismo puñado de temas fáciles. La etiqueta la asigna `contenido` a mano, como
  en `US-01`/`US-03`/`US-04` — este banco no es un manifiesto de audio, así que no aplica
  todavía la excepción de `US-02` (`BR-01`, nota `T-116`) que calcula Fácil por ranking de
  YouTube. Ver más abajo por qué "todavía".
- **Por qué 60 y no 30, ni 40, ni el techo de 101 — dicho con el costo real, no con "cero".**
  El argumento de `US-02` (30 sube porque baja el costo de curar distractores) no aplica
  igual acá porque acá no hay audio que producir, pero el ítem **no sale gratis**: son dos
  trabajos, no uno. El primero es el filtro de título de `CNT-11`. El segundo, que la
  versión anterior de este párrafo no nombraba, es la **etiqueta de dificultad manual** —
  con un piso de 60 (15 de ellos Fácil) son **60 juicios de "qué tan conocido es este
  tema"**, y es justo la clase de juicio más discutible del banco: dos personas de
  `contenido` en días distintos pueden no coincidir en cuál de dos temas es más fácil de
  reconocer por su letra. Ninguno de los dos trabajos es cero, y el piso de 60 se sostiene
  igual, pero por un motivo más chico que el de la redacción anterior: lo caro de verdad
  —transcribir la letra completa— ya está hecho desde el ciclo 6 (`cancionero.json`); lo que
  queda por ítem es revisar y etiquetar, no escribir ni producir desde cero, y eso sigue
  siendo más liviano que curar distractores o recortar audio. El techo real del corpus es
  **101** (los temas con letra del cancionero), y fijar el piso ahí ataría esta historia a
  que el filtro de `CNT-11` apruebe el catálogo entero sin descartar ni un tema (por ejemplo,
  uno corto donde el título aparece en casi todos los versos). 60 deja margen para ese
  descarte sin acercarse al techo.

> **Enmendado 2026-09-24 por `D-27` y `BR-30` (`Docs/PRODUCTO/PRD-alcance-v1.md`), sin
> borrar el párrafo de abajo.** Lo que sigue queda desactualizado y se marca por
> trazabilidad, no porque siga vigente: **`D-27`, decidido el mismo 2026-08-27**, ya había
> convertido este "Plan B" en el mecanismo real de este juego —tercios por popularidad, no
> etiqueta manual— aunque este documento nunca se volvió a tocar para decirlo. `D-46`
> (2026-09-24) confirma que el mecanismo sigue siendo el de `D-27` y le cambia únicamente
> la fuente: en vez de vistas de YouTube (que nunca llegaron), el conteo citado de
> setlist.fm. La etiqueta de este juego **no es manual hoy**, y el "día que el ranking
> exista" que el párrafo de abajo imagina como futuro **ya llegó**. `BR-30` tiene el
> detalle completo, incluida la regla de reparto (tercios, no el corte de 8 de `US-02`) y
> por qué el piso de 15 Fáciles sigue alcanzando.

- **Plan B declarado para la etiqueta de dificultad, no vía principal todavía.** `BR-18`
  apartado (f) ya resolvió el mismo problema para `US-02`: "Fácil" dejó de ser etiqueta
  manual y pasó a ser el top-8 del ranking de vistas de YouTube, porque una etiqueta manual
  de "qué tan conocido es" se corrompe sola con el tiempo. Acá el encaje es más directo
  todavía que en `US-02`: para *adivinar qué tema es*, "qué tan conocido" no es una ayuda
  para calcular la cuota de Fáciles, **es la dimensión de dificultad en sí**. Pero ese
  ranking **hoy no existe**: `src/data/popularidad.json` tiene los 105 temas en
  `"estado": "sin-video"` porque falta la clave de YouTube (`YT_API_KEY`, deuda declarada en
  `ESTADO.md` desde el ciclo 8). Por eso esta migración queda anotada como **salida futura,
  no como condición para cerrar `US-07`**: el día que el ranking exista con datos reales, la
  etiqueta de Fácil de este juego puede migrar ahí igual que hizo `BR-18` (f), y las 60
  etiquetas manuales de hoy se pueden recalcular o retirar. Hasta entonces, la etiqueta es
  manual y su costo es el que queda reconocido en el punto anterior — no escondido detrás de
  "el ítem sale gratis".
- **De dónde sale el banco, y por qué no es `letra.json`:** la fuente es `cancionero.json`
  (101 temas con letra), no `src/data/letra.json` — ese archivo es el recurso de huecos de
  `US-03` y excluye a propósito los 21 temas de lacuerda.net por no tener ficha para esa
  mecánica puntual. Acá esa exclusión no aplica: `US-07` no necesita huecos ni ficha de
  confirmación (criterio 3), así que los 101 temas del cancionero están disponibles enteros
  como universo de partida para que `contenido` elija los 60 (o más).

**Queda fuera de esta historia:** el schema exacto del banco (`CTR-09`, `arquitectura`); la
pantalla y qué disco de la mezcla `D-19` la viste (`UX-08`, `experiencia`); la regla fina de
qué verso puede abrir la escalera de cada ítem y el criterio de descarte por título
(`CNT-11`, `contenido`); el generador que arma el JSON desde el cancionero; el copy exacto
de casete, enunciado y resultado (`contenido`); el botón de corrección del frente D, que se
engancha acá igual que en los otros tres juegos pero no es parte de esta historia.

---

## BR-20 — Escalera de versos de "Sacalo por la letra"

**Aplica a:** `US-07`.

### La escalera: cuatro pasos que duplican, arrancando en 1 verso

| Paso | Versos revelados (acumulado) | Puntos si acierta |
|---|---|---|
| 1 | 1 | 100 |
| 2 | 2 | 80 |
| 3 | 4 | 60 |
| 4 (último) | 8 | 40 |

Igual que `escalera.ts` de `US-02`, cada paso **duplica** lo que había: 1 → 2 → 4 → 8. Y es
acumulado, no incremental: el paso 3 no muestra "los versos 3 y 4", muestra los cuatro
primeros versos de la escalera juntos — la misma lógica que la barra de tiempo de
`anchosDeTramos()` en el juego de audio, aplicada a líneas de texto en vez de segundos.

**Por qué 4 pasos y no 6 como en `US-02`.** La escalera de audio puede seguir duplicando
hasta 15 segundos sin problema porque, sobre una canción de tres o cuatro minutos, 15
segundos siguen siendo una porción chica del total. Acá no: el corpus mide en promedio
**~29 versos por tema** (2.958 versos sobre 104 temas, `.claude/rules/voz-ricotera.md`
sección 4.1). Si la escalera siguiera duplicando a 16 y 32 versos, el último escalón
mostraría más de la mitad de la letra de la mayoría de los temas — y en los temas más
cortos, virtualmente toda. Eso deja de ser "reconocer con lo mínimo posible" y pasa a ser
"leer casi la canción entera", que es el trabajo de la Redondopedia y de `US-03`, no de
este juego, y multiplica la exposición de letra completa sin necesidad (aunque `D-14` no lo
bloquee, no hay motivo para regalar más letra de la que hace falta para identificar el
tema). Cortar en 8 versos —ronda el 27% del promedio— deja el juego jugable de punta a
punta sin acercarse a mostrar la canción completa en ningún escalón.

### La mecánica: errar (o pasar) es lo que desbloquea el escalón siguiente

Igual que `BR-02` en `US-02`, y por el mismo motivo: el buscador ofrece **105 títulos**
(`RES-20`), así que fallar una búsqueda al azar en el paso 1 no es "arriesgar", es "no
saber". Cerrar el ítem en el primer error dejaría al que entra sin reconocer nada con un
solo verso leído y nada más — cerrar un molinete (`D-14`). El jugador tiene **cuatro
intentos por tema**, uno por escalón. En cada intento puede:

- **Arriesgar** una respuesta del buscador sobre los 105 títulos — no hay opciones que
  contar, `BR-04` no aplica acá igual que dejó de aplicar a `US-02`.
- **Pasar**, si no tiene ningún candidato.

Las dos cuestan **un intento** y las dos abren el escalón siguiente. **Pasar no es gratis**,
por el mismo motivo que en `BR-02`: si lo fuera, nada impediría llegar al último escalón sin
gastar el recurso que hace que el ítem cierre, y la vuelta de seis temas dejaría de caber en
los dos o tres minutos del brief. Y pasar existe igual, sin castigo extra sobre arriesgar,
porque es la salida honesta para quien no tiene ningún título para proponer.

- **Si acierta:** el ítem se cierra en el acto con el puntaje del escalón en que acertó.
- **Si agota los cuatro intentos sin acertar** (haya arriesgado, pasado, o combinado ambas):
  el ítem se cierra en **0 puntos**, se revela el tema correcto, y la partida sigue con el
  próximo ítem.

**Por qué el último escalón vale 40 y no 0 ni un número más bajo.** Dos partes de esta
regla son las mismas que fija `BR-02` para `US-02`, sin excepción: **0 puntos es
exclusivamente el resultado de una respuesta incorrecta** (o de agotar los intentos), nunca
el resultado de haber tardado en acertar; y **un acierto nunca puede valer 0**, porque eso
premiaría igual al que reconoció el tema recién con 8 versos leídos y al que directamente no
lo sacó. Los cuatro valores (100/80/60/40) son, además, los mismos cuatro primeros que ya
usa `BR-02` para `US-02` — no es casualidad ni ahorro de trabajo: los dos juegos comparten
catálogo y mecanismo de respuesta (buscador sobre 105 títulos), así que comparten también el
lenguaje de puntaje. Un jugador que juega los dos reconoce la misma escala.

### Verificación aritmética — jugador que no reconoce absolutamente nada

Mismo razonamiento que `BR-02`: con un buscador sobre 105 títulos, arriesgar un título al
azar cuesta lo mismo que pasar y encima suma una chance de acertar, así que la mejor
estrategia de quien no reconoce nada es tirar cuatro títulos distintos, uno por intento.

| Resultado | Probabilidad | Puntos |
|---|---|---|
| Acierta en el paso 1 | 1/105 | 100 |
| Acierta en el paso 2 | 1/105 | 80 |
| Acierta en el paso 3 | 1/105 | 60 |
| Acierta en el paso 4 | 1/105 | 40 |
| No acierta nunca | 101/105 | 0 |

**Esperado:** (100+80+60+40)/105 = 280/105 ≈ **2,67 puntos por tema** — más bajo todavía que
el 2,95 esperado de `US-02`, porque hay dos escalones menos entre los que repartir chances.
**Rama de 0:** 101/105 ≈ **96,2%** de las tiradas de quien no reconoce nada. El azar sigue
sin pagar, con más margen que en el juego hermano.

### El punto de partida de la escalera no lo fija esta regla

`BR-20` fija **cuántos** versos revela cada paso, no **cuáles**. Qué verso puntual abre la
escalera de un ítem (por ejemplo, arrancar tres versos después del principio para esquivar
un estribillo inicial que dice el título) es la regla fina de `CNT-11` (`contenido`,
`T-137`), citada en `US-07` criterio 2. Lo único que esta regla exige sobre ese punto de
partida: tiene que ser **el mismo para los cuatro pasos de un mismo ítem** — la escalera
crece agregando versos siguientes, nunca saltando a otro fragmento de la canción a mitad de
partida, porque eso rompería la sensación de "cada vez te doy más de lo mismo" que es toda
la lógica de una escalera que duplica.

---

## PENDIENTE

- **`BR-01` (escalonamiento sin muro de entrada) aplica también a `US-07`**, con etiqueta de
  dificultad asignada a mano por `contenido`, igual que `US-01`/`US-03`/`US-04`. No edito
  `Docs/PRODUCTO/PRD-alcance-v1.md` para sumarlo a la lista de "Aplica a" de esa regla —no es
  mi archivo en esta tarea, lo está tocando `T-129` en paralelo— pero queda dicho acá para
  quien la toque después.

  > **Enmendado 2026-09-24 por `BR-30`, sin borrar.** "Asignada a mano por `contenido`" ya
  > no describe este juego: desde `D-27` (2026-08-27) y confirmado por `D-46`, la etiqueta
  > sale del conteo en tercios, no de `contenido`. `BR-01` sigue aplicando entera —primer
  > ítem Fácil, la dificultad no baja, piso mínimo de 15— solo que ya no por etiqueta
  > manual. `US-01`, `US-03` y `US-04` sí siguen siendo manuales (`BR-30` lo confirma para
  > `US-03`, que se lo planteó y decidió no migrarlo).
- **La tabla resumen de piso de ítems de `PRD-alcance-v1.md`** ("Piso de ítems — resumen")
  no incluye a `US-07` todavía, por el mismo motivo de arriba. El número a sumar es este:
  60 temas, mínimo 15 Fácil, costo dominante "curación del filtro de título (`CNT-11`)".
- **Tolerancia de matching del buscador** (mayúsculas, tildes, errores de tipeo al escribir
  un título) ya la resolvió `D-24`/`arquitectura` para `US-02` — este juego reusa el mismo
  componente (`buscador.ts`), así que no hereda un pendiente nuevo acá.
- No fijé el schema JSON que guarda la escalera ni los versos por ítem: es `CTR-09` de
  `arquitectura` (`T-133`).
