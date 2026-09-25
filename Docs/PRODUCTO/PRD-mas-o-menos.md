# PRD — Más o menos: preguntas de número sobre toda la banda

> **Consume:** `Docs/BRIEF.md` ("Listo de la v1", riesgo 4: "cuatro juegos hermosos con
> doce preguntas adentro" — leído acá también al revés, ver "Piso de ítems"). `Docs/
> DECISIONES.md` `D-48` (la decisión, reescrita el 2026-09-25 — el juego dejó de ser solo
> "en cuántos temas aparece una palabra" y pasó a preguntas de número de todo tipo sobre
> la banda), `D-09`/`D-14` (molinetes abiertos, jugable con el pulgar, sin cuenta), `D-13`
> (ningún número vive en dos lugares: lo que ya está en una ficha o en un dato del repo se
> deriva en build), `D-17` (voseo, sin infinitivos en botón). `Docs/INVESTIGACION/INV-93-
> genero-mas-o-menos.md` (`RES-93`..`RES-98`, el género: por qué Diseño B — sobre/bajo un
> número de referencia, pregunta por pregunta — es el que cumple sin forzar nada el pedido
> de mezclar años, integrantes, duraciones y conteos). `Docs/SUGERENCIAS/HILO-para-todos-
> mas-o-menos-el-modelo.md` (el modelo concreto que el hilo principal ya construye contra
> esto: el dato, las siete familias, la referencia por escalones de racha, el par, la
> partida — este documento no lo redefine, lo traza). `Docs/SUGERENCIAS/HILO-para-
> contenido-mas-o-menos-las-palabras.md` (la tabla medida de palabras, sus reglas de
> filtrado). `Docs/PRODUCTO/PRD-backlog-ideas.md` (`IDEA-11`, `BR-15`, `BR-16` — cómo se
> promueve una idea guardada). `Docs/PRODUCTO/PRD-alcance-v1.md` (`BR-01`, `BR-04`, `BR-05`
> — por qué no aplican tal cual y qué las reemplaza; `US-08`, precedente directo de "juego
> que entra fuera del contrato de cuatro"). `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`
> (`RES-20`, sección "Discrepancias sin promediar": las dos trampas de *Gulp!* — fecha y
> cantidad de temas — y la cantidad de discos, 9 o 10 según se cuente). `Docs/CONTENIDO/
> CNT-04-limite-editorial-muertes.md` y `CNT-06-muertes-en-prosa.md` (el límite editorial
> sobre Bulacio, Olavarría y la muerte del Indio — acá se aplica más estricto que en el
> quiz: ni siquiera el ángulo institucional entra). `.claude/rules/voz-ricotera.md`
> (botones Más/Menos/Antes/Después, no infinitivos; techo de 8 palabras). `.claude/rules/
> diseno-marca.md` (nada de contador animado; `--acento-3`/`--acento-4` para ✔/✕).
> `BR-18` (b), (d) y (h) y `Docs/ARQ/ARQ-schema-recitales.md` (`RNF-CTR-19-A`, `CTR-19.6`,
> el test de vigencia `CTR-19.13` t4, `vigenciaDias: 180`) — este documento amplía `BR-18`
> (b) para `US-10`, ver la sección nueva tras `BR-32`. `Docs/ARQ/ARQ-schema-mas-o-menos.md`
> (`CTR-20`, `RNF-CTR-20-B`: el choque que le devolvió a `producto`).
> `Docs/PRODUCTO/PRD-ponelos-en-fila.md` como modelo de forma de este documento.
>
> **Produce:** `US-10`, `BR-32`, `BR-33`.
>
> **IDs reservados y no tomados por esta sesión** (`Docs/IDS.md`): `CTR-20` (el schema de
> `src/data/mas-o-menos.json`, las derivaciones y el sorteo — `arquitectura`), `UX-34` (la
> pantalla y el casete — `experiencia`), `CNT-25` (los datos de `INV-100`, las palabras
> curadas y todo el copy — `contenido`), `REV-16` (`revisor`). `D-48` ya la escribió el
> hilo principal; no la reescribo, la traceo en la sección siguiente.

## Qué es este archivo y qué no

Promueve `IDEA-11` a historia de usuario, con el diseño que el hilo principal ya cerró y
amplió (`D-48`, `INV-93`, el modelo). Fijo el criterio de aceptación, el piso de ítems con
su verificación, los tramos del resultado, y las dos reglas de negocio que cierran qué
número puede ser respuesta correcta y cómo se arma la partida. No fijo el schema del JSON
ni el algoritmo de sorteo (`CTR-20`, `arquitectura`), no diseño la pantalla ni el casete
(`UX-34`, `experiencia`), no redacto los datos a mano ni el copy exacto (`CNT-25`,
`contenido`).

---

## Lo ya decidido por el hilo principal — trazado, no re-discutido

### Qué es el juego, y de qué género viene

**"Más o menos."** El jugador ve una pregunta con respuesta de número sobre la banda —
años, integrantes, recitales, discos, duraciones, setlists, palabras en una letra— y una
**referencia** de la misma unidad. Un toque le dice al sitio si cree que la respuesta real
es mayor o menor que esa referencia. Se juega hasta el primer error; el puntaje es el
largo de la racha.

`INV-93` investigó el género entero antes de que se eligiera este diseño (`RES-93`..
`RES-98`) y encontró que **ningún derivado real mezcla unidades dentro de la misma cadena**
(`RES-94.1`: el *Higher Lower Game* y sus más de cien modos siempre comparan la misma
unidad dentro de una racha, aunque cambien de modo entre partidas). Lo que sí tiene
precedente real de décadas para "cualquier pregunta con respuesta numérica, mayor o menor
que un número dado" es la mitad de encuesta de *Card Sharks* y *Play Your Cards Right*
(`RES-95`): un jugador tira un número, el otro dice si la respuesta real es mayor o menor.
Es el diseño que el hilo principal adoptó (Diseño B de `INV-93`) porque es el único que
cumple el pedido textual del usuario —*"que sean preguntas con respuesta de número pero
diferentes, no todo sobre las letras, sino cuántos integrantes son, cuántos años tocaron,
o sea sé creativo"*— sin forzar al género a mezclar unidades dentro de una misma cadena.

**Qué pasa con el trabajo ya hecho para "en cuántos temas aparece la palabra"** (la primera
versión de `D-48`, y la génesis real de `IDEA-11`): no se descarta. Pasa a ser una familia
más —`las-palabras`— dentro de las siete que arma el modelo, con las mismas reglas de
filtrado que ya trajo `Docs/SUGERENCIAS/HILO-para-contenido-mas-o-menos-las-palabras.md`.

### La ruta y el desafío

`/juegos/mas-o-menos/`, `g=mas-o-menos` (`ADR-02`). El nombre es la mecánica dicha en
rioplatense, y de paso el "más o menos" de quien no se la sabe toda — cumple `D-17` sin
forzar nada.

### Un paso de la partida

Una pregunta con respuesta de número y una referencia, siempre de la misma unidad
(`RES-94.1`). Un toque: **Más** o **Menos** — o, si la escala es un año, **Antes** o
**Después**, porque "¿más o menos que 1990?" no lo dice nadie (`D-17`). Se revela de golpe
el número real, ✔ o ✕ además del color, y de dónde salió, en registro 3 de
`voz-ricotera.md`. Sin contador que sube (`RES-98`: la familia "Wordle diario con números"
—Costcodle, Yeardle— revela de golpe y arma el suspenso con la escasez de intentos, no con
la animación; es la que calza sin fricción con "solo se mueve la mosca" de
`diseno-marca.md`).

La referencia es de dos clases (modelo, sección 1):

| Clase | Cuándo | Ejemplo |
|---|---|---|
| **número** | siempre se puede | "¿Cuántos años tocaron juntos? ¿Más o menos que 12?" |
| **par** | solo si hay otro dato de la misma medida sin usar, a la distancia justa | "*Jijiji* dura 5:34. ¿*Juguetes perdidos* dura más o menos?" |

### Las siete familias, y de dónde sale cada número

Tres a mano (de `INV-100`, todavía en curso) y cuatro derivadas en build de datos que el
repo ya tiene, sin escribir un número dos veces (`D-13`):

| Familia | De dónde | Ojo |
|---|---|---|
| `la-banda`, `la-gente`, `los-recitales` | a mano, cada una con su ficha `RES-` de `INV-100` | hecho o "según X"; nunca leyenda; nada sobre muertes (`BR-32`) |
| `los-discos` | año y cantidad de temas de cada disco, de `RES-20` | *Gulp!* fuera de "cuántos temas" (11 o 12); nunca se pregunta cuántos discos son (9 o 10) — las dos trampas de `RES-20` |
| `lo-que-dura` | duración de cada tema, de `RES-20` | los once sin duración del vol. 2 de *Lobo suelto* no entran |
| `en-vivo` | en cuántos setlists de setlist.fm figura un tema, de `RES-90` | se rotula como lo que es: setlists cargados, no veces tocado |
| `las-palabras` | en cuántos temas aparece una palabra, del cancionero (`src/lib/mas-o-menos/conteo.ts`) | temas y no veces; formas a la vista; ≥ 2 temas; nada de vocabulario de taller |

**Cada familia pesa lo mismo en el sorteo**, no importa cuántos datos tenga: si no, los 94
datos de duración taparían a los de la banda, que son los que pidió el usuario (`D-48`
punto 5).

### La partida

Se juega hasta el primer error. Puntaje = largo de la racha. Mejor racha en el aparato
(`localStorage`), sin cuenta. Sin empates: la referencia nunca es igual a la respuesta. Si
se acaban los datos, ganaste. Escalonado por cuatro escalones de racha (0–2 · 3–5 · 6–9 ·
10+): la referencia arranca lejos y se acerca con la racha — el que llegó sin idea acierta
los primeros por sentido común (`BR-01`, `D-09`).

### Compartir

Texto y dirección (`ADR-02`, forma `marcador`): `g=mas-o-menos`, `p` la racha, `t` la
cantidad de datos del pozo. Sin tarjeta-imagen en esta versión.

### Casete propio en el lado A del portal

---

## US-10 — Más o menos

> **Origen: `IDEA-11` promovida por `D-48` (2026-09-25).** `PRD-backlog-ideas.md` trae la
> idea original —*"que arrancas con una palabra y cuantas veces se dice [...] y tenes que
> ir adivinando si la otra palabra [...] se dijo mas o menos veces"*—, que el usuario amplió
> el mismo día pidiendo variedad de números sobre toda la banda, no solo palabras. Esta
> historia fija lo que faltaba: los criterios, el piso y los tramos de resultado.

**Prioridad: no forma parte del "Listo" de la v1.** Ver "`D-05` no se toca", más abajo.

Como jugador que tiene una idea general de los Redondos pero no todos los números de
memoria, quiero jugar rondas cortas de "más o menos" sobre cualquier cosa medible de la
banda, para poner a prueba lo que sé sin que una sola pregunta puntual me deje afuera.

### Criterio 1 — caso feliz (pregunta, referencia, un toque, revela de golpe)

- **Given** un jugador entra a "Más o menos" y arranca una partida nueva.
- **When** el sitio le muestra una pregunta con respuesta de número y una referencia de la
  misma unidad, y el jugador toca **Más** o **Menos**.
- **Then** se revela de golpe el número real, ✔ si acertó o ✕ si no, y la fuente del dato
  (registro 3); si acertó, la racha sube en uno y el siguiente paso es de una familia
  distinta a la que acaba de responder (siempre que haya otra con datos sin usar).

### Criterio 2 — caso borde (el par: la referencia es otro dato, con su número a la vista)

- **Given** hay al menos otro dato sin usar de la misma medida que el que se va a
  preguntar, a una distancia que entra en el escalón de racha actual (modelo, sección 6).
- **When** el sitio arma el paso.
- **Then** la mitad de las veces que puede, en vez de un número puesto por el juego, usa
  ese otro dato como referencia, mostrando su sujeto y su número ya revelado ("*Jijiji*
  dura 5:34. ¿*Juguetes perdidos* dura más o menos?") — nunca mezclando una medida con
  otra (`RES-94.1`).

### Criterio 3 — caso borde (los años: Antes / Después)

- **Given** la escala del dato es `anio`.
- **When** se muestra el paso.
- **Then** los dos botones dicen **Antes** y **Después**, nunca "Más" y "Menos" sobre un
  año — "¿más o menos que 1990?" no lo dice nadie (`D-17`).

### Criterio 4 — caso borde (error: corta, y muestra todo lo que hacía falta saber)

- **Given** un jugador toca la opción que no coincide con la relación real entre la
  respuesta y la referencia.
- **When** se revela el resultado del paso.
- **Then** la partida corta ahí: se ven la pregunta, el número real, la referencia que
  tenía delante y la fuente. Si el dato era de la familia `las-palabras`, se ven además las
  formas que se contaron y la lista de temas donde aparece, cada uno enlazado a su letra en
  `/letras-y-acordes/<slug>/` — para que el número se pueda auditar, no solo creer.

### Criterio 5 — caso borde (molinete: el que no sabe nada juega igual)

- **Given** un jugador que recién llega y no sabe casi nada de la banda.
- **When** juega los primeros pasos, en el escalón de racha 0–2.
- **Then** puede acertar por sentido común, porque ahí la referencia arranca lejos de la
  respuesta real (modelo, sección 5) — el molinete queda abierto (`D-09`, `D-14`): nadie
  necesita saber el dato exacto para arrancar.

### Criterio 6 — caso borde (sin empates)

- **Given** el sitio genera la referencia de cualquier paso.
- **When** la calcula.
- **Then** nunca es igual a la respuesta real — una regla de empate que hay que explicar es
  peor que un empate que no pasa (`RES-93.5`: ni el propio género se pone de acuerdo en
  cómo resolverlo).

### Criterio 7 — caso borde (se acabaron los datos, ganaste)

- **Given** un jugador viene de racha sin perder ninguna.
- **When** se le acaban los datos del pozo sin haber usado un dato dos veces en la misma
  partida.
- **Then** el sitio muestra un resultado de victoria, distinto del de derrota — agotar el
  pozo es un desenlace previsto, no un caso sin pantalla (mismo criterio que `BR-19` usó
  para el quiz).

### Criterio 8 — caso borde (compartir)

- **Given** un jugador terminó una partida, por error o por victoria.
- **When** toca compartir.
- **Then** obtiene texto y una dirección con forma `marcador` de `ADR-02`
  (`g=mas-o-menos`), con `p` la racha lograda y `t` la cantidad de datos del pozo — sin
  tarjeta-imagen en esta versión.

### Criterio 9 — caso borde (mejor racha en el aparato, sin cuenta)

- **Given** un jugador termina cualquier partida.
- **When** su racha final supera la mejor racha guardada en ese aparato.
- **Then** el sitio la guarda en `localStorage`, clave `arcade.mas-o-menos.mejor` — sin
  pedir cuenta ni login (`D-14`), y sin backend que la sincronice entre aparatos (`D-15`).

---

## Piso de ítems

El pozo tiene dos partes de costo muy distinto, y el piso las trata distinto — mismo
argumento que ya usó `US-08` para separar "lo que se deriva gratis" de "lo que le cuesta a
alguien curar".

### A. Las familias derivadas — el piso es lo que el repo ya tiene, no un número más bajo

Nadie las escribe a mano: salen enteras, en build, de fichas y datos que el repo ya tiene.
Igual que en `US-08`, fijar un piso más bajo dejaría afuera contenido que no cuesta nada
sumar.

| Familia | Cuánto hay hoy | De dónde |
|---|---|---|
| `los-discos` | 10 años + 9 cantidades de temas (*Gulp!* excluido) = **19** | `RES-20` |
| `lo-que-dura` | **94** | `RES-20` |
| `en-vivo` | **~100** (los de los 105 temas que figuran en `setlistfm.json`) | `RES-90` |

**Cómo se verifica a máquina:** un test de contrato (dueño `arquitectura`, sobre `CTR-20`)
que confirme, para cada familia derivada, que la cantidad medida de forma independiente
coincide con la tabla de arriba, y que ninguna deriva un dato prohibido por `BR-32`
(*Gulp!* en "cuántos temas", o "cuántos discos son").

### B. El dato a mano (de `INV-100`, todavía en curso) — piso 20, con mínimo por familia

**Piso: al menos 20 datos en estado `listo`, repartidos en las tres familias `la-banda`,
`la-gente` y `los-recitales`, con al menos 4 en cada una.**

Adopto el número que propuso el hilo principal porque encaja con dos cosas que ya están
fichadas y no invento yo:

- **Por qué 20 y no el techo esperado.** `Docs/IDS.md` reserva `RES-100`..`RES-139` para
  `INV-100`, que apunta a 60+ números (nota de la tabla de rangos). Fijar el piso en ese
  techo haría que la historia dependiera de que la investigación termine sin ninguna baja
  — y ya hay dos investigaciones reales que muestran que eso no pasa. `RES-20` fichó dos
  discrepancias sobre *Gulp!* sin promediar (la fecha, con tres versiones distintas, y la
  cantidad de temas, 11 o 12 según si el track oculto cuenta), y la propia `INV-100` ya trajo
  una tercera (N-020: los asistentes al último recital, entre 40.000 y 50.000 según la
  cobertura, sin fuente que la zanje). Son exactamente el tipo de dato que `BR-32` va a
  descartar por no tener un número único defendible. Veinte es un tercio del objetivo, deja
  margen para esas bajas, y es alcanzable sin esperar a que `INV-100` cierre entera.
- **Por qué 4 como mínimo por familia.** Si una de las tres quedara en cero o uno, el
  sorteo por familia (`BR-33`) la rotaría casi nunca y el juego dejaría de cumplir lo que
  pidió el usuario —variedad real, no solo palabras y discos—. Es el mismo argumento que
  `BR-01` punto 3 usa para el quiz: con uno o dos ítems Fáciles el jugador ve siempre lo
  mismo; acá, con menos de 4 en una familia, esa familia casi no aparece.

**Cómo se verifica a máquina:** un test (dueño `contenido`, sobre `CNT-25`) que cuente,
sobre `src/data/mas-o-menos.json`, los datos en estado `listo` por familia y confirme el
piso de 20 total y 4 por familia — y que ninguno viole `BR-32` (firmeza declarada, nada de
muertes, sin duplicar una medida ya derivable).

### C. Las palabras — piso 15, techo sugerido 25

**Piso: al menos 15 formas en estado `listo` en la sección `palabras` del dato.**

`Docs/SUGERENCIAS/HILO-para-contenido-mas-o-menos-las-palabras.md` trae más de 150 formas
con 3 o más temas, pero es un relevamiento crudo, no un banco curado: todavía falta que
`contenido` descarte homónimos (*sol*, *vino*, *mal* — cuentan los dos sentidos y el
jugador piensa en uno), vocabulario de taller que se coló (*par*, *letra*, *tema*, *toca*)
y palabras que solo suman por temas con letra rota (*La bestia pop*, *Criminal mambo*). El
piso de 15 es el mismo que ya sostenía la primera versión de `IDEA-11` cuando las palabras
eran el juego entero, y sigue siendo alcanzable después de esas bajas. El modelo sugiere un
techo de 25; no lo fijo como piso porque no cuesta lo mismo llegar a 15 bien curadas que a
25, y este juego no necesita el techo para cerrar su ciclo.

**Cómo se verifica a máquina:** el test que ya corre sobre `conteo.ts` (dueño `contenido`,
`CNT-25`) confirma, para cada palabra `listo`: que tiene ≥ 2 temas (una palabra de 1 solo
tema no tiene lado "menos" posible sin igualar la respuesta — el modelo, sección 5, fija
que la referencia nunca baja de 1 en escala `entero`), que las formas declaradas coinciden
con lo que se cuenta, que toda variante de tilde está clasificada explícitamente (cuenta o
no cuenta), y que ninguna forma está en la lista de vocabulario de taller de
`HILO-para-contenido-mas-o-menos-las-palabras.md`.

### El total del pozo

Sumando las tres partes, el piso mínimo verificable hoy es **19 (discos) + 94 (duración) +
~100 (en vivo) + 20 (a mano) + 15 (palabras) ≈ 248 datos.** El "~100" de `en-vivo` queda
con aproximado porque depende de un cruce entre `setlistfm.json` y los 105 temas que no
corrí yo — lo cierra el test de contrato de `arquitectura`. Este número es un piso, no un
techo: las familias derivadas van a crecer solas si el repo suma temas o duraciones, y eso
no rompe nada porque no le cuesta curación a nadie.

---

## Tramos del resultado (bajo / medio / alto)

**Bajo: racha 0–2. Medio: racha 3–7. Alto: racha 8+.** Adopto los cortes que propuso el
hilo principal, con el mismo argumento de fondo que ya usó `BR-05` para el quiz, adaptado a
que acá no hay opciones múltiples: cada paso es un tap binario (Más/Menos o Antes/Después),
así que la vara no es "% sobre un total fijo" sino "qué tan lejos llega alguien que
responde puro al azar, 50/50, sin saber nada".

- **Por qué el corte de abajo protege el mismo piso que `BR-05`.** Un jugador que tira
  moneda al aire en cada paso tiene, antes de errar, probabilidad `0,5ⁿ` de llegar a una
  racha de `n`: 12,5% de superar 2 (llegar a 3), y menos de 1% de superar 7 (llegar a 8).
  Con el corte en 2, el 87,5% de la masa de probabilidad de quien no sabe nada y responde
  al azar queda firmemente en "bajo" — el mismo margen que `BR-05` buscó con el 25% teórico
  del quiz contra su corte de 30%.
- **Por qué "alto" arranca en 8.** A esa altura, la probabilidad de haber llegado ahí por
  puro azar es menor al 0,4% — "alto" representa una minoría exigente que de verdad sabe,
  sin vaciar "medio" del otro lado, igual que hace `BR-05` con su corte de arriba.

No creo un `BR-XX` nuevo para esto porque no hay margen de rango reservado para más de
`BR-32`/`BR-33` en esta sesión (`Docs/IDS.md`); queda fijado acá, con el mismo peso que
tiene `BR-05` para el quiz, y `experiencia`/`arquitectura` lo citan como "los tramos de
`US-10`".

---

## BR-32 — Qué número puede ser la respuesta correcta

**Aplica a:** todo dato de `US-10`, en cualquiera de las siete familias.

1. **Hecho con ficha, o "según X" rotulado con el nombre.** Un dato a mano lleva
   `firmeza: "hecho"` con su `RES-XX` de `INV-100`, o `firmeza: "segun"` con el nombre de
   quien lo dijo ("según Clarín, N") — nunca una leyenda como respuesta correcta
   (`CLAUDE.md`, lo único estricto del proyecto: si el dato está mal, el juego le marca
   error justo al que se sabe el tema).
2. **Nada sobre muertes.** Ni Bulacio, ni Olavarría, ni la muerte del Indio: ninguna edad
   al morir, ninguna cantidad de heridos, ninguna fecha que exista solo para nombrar una de
   esas tres cosas. `CNT-04` habilitó al quiz una rendija —el ángulo institucional de
   Bulacio (a qué tribunal llegó, cuánto tardó el juicio)— porque ahí lo que se puntúa es
   el nombre de un tribunal, no un número. Acá **no hay esa rendija**: este juego pregunta
   números, y cualquier número asociado a esos tres hechos (una edad, una cantidad de
   víctimas, una fecha de muerte) convierte exactamente lo que `CNT-04` prohíbe —"cuatro
   opciones y un puntaje aplicados a una muerte"— en "un tap y una racha aplicados a una
   muerte", que es el mismo problema con otro widget. Ningún dato de `INV-100` puede
   originarse en esos tres hechos, sin excepción.
3. **Ningún número vive en dos lugares (`D-13`).** Si el número ya está en `RES-20`, en
   `setlistfm.json` o se deriva del cancionero, no se vuelve a cargar a mano en
   `mas-o-menos.json`: se deriva. Un dato a mano solo existe para lo que ningún archivo del
   repo ya tiene.
4. **Las dos trampas de `RES-20`, heredadas tal cual.** Nunca se pregunta cuántos temas
   tiene *Gulp!* (11 o 12, según si el track oculto cuenta — las dos son defendibles y por
   eso ninguna es "la" respuesta). Nunca se pregunta cuántos discos son en total (9 o 10,
   según el mismo criterio). Estas dos preguntas no entran ni a mano ni derivadas: la
   familia `los-discos` pregunta por *un* disco a la vez (su año, su cantidad de temas),
   nunca por el conjunto entero.
5. **El conteo de setlist.fm, dicho como lo que es.** La pregunta y la fuente de la familia
   `en-vivo` dicen "figura en N setlists cargados por la gente en setlist.fm", nunca "se
   tocó N veces en vivo" — son cosas distintas y `RES-90` fichó la diferencia.
6. **Las palabras, con las reglas de `D-48` punto 4 y del relevamiento de `contenido`:**
   - se cuenta en **temas**, no en veces (una palabra repetida en un estribillo transcripto
     verso por verso no infla el número);
   - las **formas** que se declaran son las que se muestran al revelar — nunca una forma
     que cuenta pero que la pantalla no nombra;
   - **cada palabra necesita al menos 2 temas.** No está en ninguna ficha previa; lo fijo
     acá porque el modelo (sección 5) nunca deja que la referencia baje de 1 en escala
     `entero` — una palabra de 1 solo tema no tiene lado "menos" posible sin caer en
     empate, así que jugaría siempre igual y el piso mínimo evita ese caso degenerado;
   - **nada de vocabulario de taller** (*par*, *letra*, *tema*, *toca*, *primera*,
     *intermedio*, *fill*, *repite*, *man*, *com*, y el resto de la lista de
     `HILO-para-contenido-mas-o-menos-las-palabras.md`);
   - **toda variante de tilde va clasificada** (cuenta como la misma palabra — *corazon* —
     o no cuenta porque es otra palabra — *esta*/*está*); un dato sin esa clasificación
     explícita no está `listo`.

### Cómo se prueba cada punto

El hilo principal escribe `src/lib/mas-o-menos/*.test.ts` (`D-12`: `producto` no lo corre,
deja dicho qué tienen que mirar):

- Sobre `src/data/mas-o-menos.json`: cada dato en estado `listo` tiene `firmeza` en
  `["hecho","segun"]`, y si es `"segun"` su campo `fuente` incluye un nombre; ningún dato
  ni su `pregunta`/`fuente` contiene las palabras que identifican los tres hechos vetados
  (chequeo de lista negra: "Bulacio", "Olavarría", nombres de las víctimas, y patrones de
  edad-al-morir/cantidad-de-heridos); ningún `id`/`medida` de un dato a mano coincide con
  una medida que ya exista en `RES-20`, `setlistfm.json` o el cancionero.
- Sobre la derivación de `los-discos` (`leerDiscos()`): el conjunto `temas-disco` nunca
  incluye el slug de *Gulp!*; no existe ningún dato —derivado ni a mano— cuya `medida` sea
  "cantidad de discos".
- Sobre la derivación de `en-vivo`: la plantilla de `pregunta`/`fuente` en
  `src/lib/mas-o-menos/copy.ts` usa el patrón "figura en N setlists cargados" y no contiene
  la cadena "se tocó" ni "veces en vivo".
- Sobre `conteo.ts` y la sección `palabras` del dato: cada palabra `listo` tiene
  `temas.length >= 2`; las `formas` declaradas son exactamente las que la función de conteo
  usa para sumar; toda forma sin tilde que tenga una variante con tilde está clasificada
  (`cuenta`/`noCuenta`) explícitamente, sin casos sin resolver; ninguna forma aparece en la
  lista de vocabulario de taller.

---

## Enmienda de `BR-18` (b), acotada a `US-10`: el número de `en-vivo` sí es el titular del revelado

**El choque, tal como lo dejó `arquitectura` (`RNF-CTR-20-B`, `ARQ-schema-mas-o-menos.md`):**
`RNF-CTR-19-A` obliga a que un número que salga de `setlistfm.json` "vaya chico, nunca como
titular" (`BR-18`, apartados b y h), porque la cifra solo sube y el sitio no tiene cómo
prometer que la va a refrescar todos los días. En "Más o menos", la familia `en-vivo`
pregunta "¿en cuántos setlists de setlist.fm figura «X»?" y **ese número es la respuesta del
paso**: tiene que mostrarse igual de grande que en las otras seis familias —en la caja de
referencia si es el par, y al revelar siempre—, porque criterio 1 de `US-10` ya exige que
todo paso revele "de golpe el número real, ✔ o ✕, y la fuente", sin excepción por familia.
Un revelado que esconde el número de `en-vivo` no es una versión más discreta del mismo
juego: es un juego que en una de siete familias no cumple su propio criterio de aceptación.

**Decisión: se toma la opción A que recomendó el hilo principal.** Para `US-10`, y
únicamente para `US-10`, el número de `en-vivo` **puede ser el titular** del bloque de
referencia y del revelado, con esta condición no negociable, y con un matiz entre los dos
momentos:

- **En los dos lugares —la caja de referencia, antes de responder, y el revelado, después—
  va la fuente y la fecha de consulta juntas al número:** "según setlist.fm, consultado el
  24-09-2026" (`enVivo.consultado`), lo mismo que exigían `RNF-CTR-19-A`/`RNF-CTR-20-B`,
  menos la restricción de tamaño.
- **El enlace a la página (`enVivo.pagina`) va solo al revelar, nunca en la caja de
  referencia.** La página de estadísticas de setlist.fm lista los conteos de todos los
  temas: un enlace ahí, tocable antes de decidir, le da la respuesta al jugador antes de
  que juegue — abriría exactamente el mismo problema que `BR-04` cuida al no dejar ver las
  cuatro opciones del quiz antes de tiempo. Al revelar ya no hay nada que arruinar, así que
  el enlace entra completo, como en las otras familias.

La redacción sigue diciendo "figura en N setlists cargados", nunca "se tocó N veces" (`BR-32`
punto 5, sin cambios).

**Por qué esto no vacía el motivo real de `BR-18` (b).** El motivo nunca fue "un número
grande es peligroso": fue que **una cifra suelta envejece sin que nadie lo note**, porque el
sitio trabaja en ráfagas irregulares y nada obliga a revisarla. Ese riesgo concreto ya tiene
una defensa que no depende de la buena voluntad de nadie: el test de vigencia que
`ARQ-schema-recitales.md` ya construyó para otro motivo (`CTR-19.13`, t4, sobre
`vigenciaDias: 180`) pone el build en rojo apenas el conteo pasa los 180 días desde
`consultado` — el mismo mecanismo que ya protege a `US-02` y `US-07`. Un número que puede
quedar circulando en silencio necesita ir chico; un número que **no puede** quedar
circulando vencido, porque un test lo frena, no tiene ese problema. La diferencia entre
`US-02`/`US-07` y `US-10` nunca fue el tamaño de letra: es que en los otros dos el número es
decoración de un ranking y acá es la respuesta del juego — y la respuesta del juego no puede
ir escondida sin romper la promesa central del sitio (`D-14`, "ningún dato falso": una
respuesta que el jugador no puede leer bien no es una respuesta verificable).

**Qué se descartó, y por qué:**
- **(B) sacar la familia `en-vivo` del juego.** Es la salida más simple, pero le resta al
  usuario una séptima de las familias que pidió —"cuántas veces tocado en vivo" es de las
  que nombró textualmente en `D-48`— sin que el riesgo real (envejecimiento silencioso) lo
  justifique, porque ese riesgo ya está cubierto por el test de vigencia.
- **Sostener el "va chico" también acá, y mostrar solo el veredicto grande.** Es lo que
  `RNF-CTR-20-B` dejó como comportamiento provisorio de `experiencia` mientras `producto`
  decidía. Se descarta porque genera una inconsistencia visible entre familias: el mismo
  jugador ve el número grande al acertar sobre una duración o un año, y chico al acertar
  sobre un conteo en vivo, sin que haya ninguna razón jugable para la diferencia — y una
  inconsistencia así es la clase de cosa que un jugador atento nota y no puede explicarse,
  aunque no sea un dato falso.

**Alcance de la enmienda:** esta enmienda rige **solo dentro de `US-10`**. Para `US-02` y
`US-07`, `BR-18` (b) y `RNF-CTR-19-A` siguen exactamente como estaban: ahí el número sigue
yendo chico, porque ahí sí es decoración de un ranking y no la respuesta de nada. No se
edita `BR-18` en `PRD-alcance-v1.md`; queda esta nota acá, y `PRD-alcance-v1.md` no necesita
tocarse porque su texto nunca dijo que la regla fuera universal a todo el sitio para
siempre, sino la regla de los juegos que ya tenía delante.

**Consecuencia para `arquitectura` y `experiencia`:** `RNF-CTR-20-B` queda resuelto — el
número de `en-vivo` se trata igual que las otras seis familias en el revelado y en la caja
de referencia del par, con `enVivo.consultado` junto al número en los dos momentos y
`enVivo.pagina` sumándose recién al revelar (nunca antes, por el motivo de arriba). No hace
falta un campo nuevo ni un test nuevo: `CTR-19.13` (t4) ya existe y ya cubre el riesgo que
motivaba la restricción.

---

## BR-33 — Cómo se arma la partida

**Aplica a:** `US-10`.

1. **Un error corta.** No hay vidas ni margen: la primera respuesta que no coincide con la
   relación real entre el número y la referencia termina la partida (mismo espíritu que
   `RES-93.4`: sin presión de tiempo, pero sin segunda oportunidad).
2. **La referencia nunca es igual a la respuesta.** Si el cálculo la hace caer sobre el
   número real, se corre un paso para el lado que le tocaba (modelo, sección 5) — sin
   empates que explicar (`RES-93.5`).
3. **La familia rota.** Dos pasos seguidos nunca son de la misma familia si hay otra con
   datos sin usar. Cada familia que todavía tiene datos disponibles tiene la misma chance
   de salir en el sorteo, sin importar cuántos datos le queden — así los 94 de `lo-que-dura`
   no tapan a los 20 de `la-banda`/`la-gente`/`los-recitales`, que son los que pidió el
   usuario (`D-48` punto 5).
4. **Un dato usado no vuelve.** Ni como pregunta ni como referencia de un par: una vez que
   un dato apareció en la partida, en cualquiera de los dos roles, queda descartado del pozo
   para el resto de esa misma partida.
5. **Escalonado por los cuatro escalones de racha del modelo — 0–2 · 3–5 · 6–9 · 10+.**
   Cada escalón fija qué tan lejos puede estar la referencia numérica y a qué distancia
   puede estar un par para servir como referencia (modelo, secciones 5 y 6): arranca lejos,
   sentido común alcanza; se acerca con la racha, hay que saber cada vez más.
6. **El revelado es de golpe.** El número real, ✔ o ✕ además del color, y la fuente
   aparecen juntos, en el mismo instante — nunca un contador que sube dígito por dígito
   (`D-48` punto 10; `RES-98` mostró que esa animación es una técnica genérica de web sin
   respaldo de diseño razonado, y que la familia de juegos diarios con números —Costcodle,
   Yeardle— prescinde de ella sin perder suspenso).

### Cómo se prueba

El hilo principal escribe el test de armado de partida (`src/lib/mas-o-menos/*.test.ts`,
mismo criterio de `D-12` que en `BR-32`):

- Sobre una secuencia simulada de pasos: nunca hay dos familias iguales consecutivas cuando
  existe al menos otra familia con datos sin usar en el pozo.
- Sobre el mismo pozo simulado: ningún `id` de dato aparece dos veces —ni como pregunta ni
  como referencia de un par— dentro de la misma partida.
- Sobre el cálculo de la referencia, para cada uno de los cuatro escalones de racha y cada
  `escala` (`anio`, `entero`, `segundos`): la distancia entre referencia y respuesta cae
  dentro de la banda de la tabla del modelo (sección 5), nunca la iguala, y en `entero`
  nunca baja de 1.
- Sobre el estado que arma la pantalla al revelar: el payload trae el número real, el
  resultado (✔/✕) y la fuente en el mismo objeto, sin ningún campo de "valor parcial" o
  "conteo en progreso" que sugiera una animación de subida.

---

## `D-05` no se toca

El "Listo" de la v1 sigue siendo cuatro juegos: quiz, adivinar el tema, completar la letra,
adivinar la tapa (`D-05`). "Más o menos" entra al sitio del mismo modo que ya entraron
`US-05` (Redondopedia), `US-06` (los dos ejes), `US-07` (sacalo por la letra), `US-08`
(ponelos en fila) y `US-09` (Skayboy y Poligirl): construible y publicable sin esperar a
nada, pero contado aparte de los cuatro que definen si la v1 está "lista". No reabro el
número de `D-05` porque apareció una idea buena de más — es el mismo argumento, palabra por
palabra, que ya usé (o que ya usó este mismo documento tipo) para las cinco anteriores.

---

## `BR-01` y `BR-04`: no aplican a `US-10`, y por qué reemplaza

- **`BR-01` (etiqueta Fácil/Media/Difícil por ítem) no aplica tal cual.** Ningún dato de
  `mas-o-menos.json` lleva esa etiqueta: la dificultad de un paso no depende del dato, sino
  de a qué distancia está la referencia, y eso lo fija `BR-33` por el escalón de racha en
  curso — el mismo dato de "años tocando juntos" es fácil al principio de la partida (la
  referencia está a 10 años) y difícil más adelante (a 1 año), sin que nadie le cambie la
  etiqueta. Lo que `BR-01` protege —que el primer paso sea accesible sin saber nada— lo
  protege acá el escalón 0–2 del modelo, con el mismo objetivo y otro mecanismo.
- **`BR-04` (4 opciones de múltiple choice) no aplica.** No hay opciones que contar ni
  distractores que curar: cada paso es un tap binario, Más/Menos o Antes/Después. Es el
  mismo motivo por el que `BR-04` no aplica a `US-08`: sin opciones armadas por `contenido`,
  no hay azar de distractor que controlar.

---

## PENDIENTE / para otro rol

- **Resuelto en esta misma revisión:** `RNF-CTR-20-B` (`ARQ-schema-mas-o-menos.md`) tenía
  un choque abierto contra `BR-18` (b) sobre si el número de `en-vivo` puede ser titular del
  revelado. Ver "Enmienda de `BR-18` (b), acotada a `US-10`" más arriba — queda que sí, con
  fecha, fuente y enlace en el mismo bloque, amparado en el test de vigencia ya existente
  (`CTR-19.13` t4). `arquitectura` puede sacar esa fila de "Lo abierto, con dueño"
  (`CTR-20.13`) y `experiencia` diseñar el revelado de `en-vivo` con el número grande, igual
  que las otras seis familias.
- **`CTR-20`** (`arquitectura`): el schema de `src/data/mas-o-menos.json`, el algoritmo de
  sorteo de familia y referencia, y el test de contrato que verifica la parte A del piso
  (las familias derivadas) y las dos trampas de `RES-20` a nivel de derivación.
- **`UX-34`** (`experiencia`): la pantalla, el casete del lado A, cómo se muestran ✔/✕ y la
  fuente en registro 3, y el mecanismo de "Antes/Después" contra "Más/Menos" en pantalla.
- **`CNT-25`** (`contenido`): los datos a mano una vez que `INV-100` traiga las fichas, la
  curación final de la tabla de palabras (homónimos, vocabulario de taller, temas con letra
  rota), y todo el copy visible (títulos, pregunta, botones dentro del techo de 8 palabras).
- **`INV-100`** (`investigador`): sigue en curso. Sin sus fichas, la parte B del piso (20
  datos a mano, 4 por familia) no se puede cumplir — es el bloqueo real de esta historia
  hoy, no una decisión de `producto` pendiente.
- No fijé el copy exacto de ningún botón, título de casete ni mensaje de victoria/derrota —
  eso es `contenido`, bajo `voz-ricotera.md`.
