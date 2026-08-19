# CNT-01 — Nota de derechos (esbozo)

- **Fecha:** 2026-08-19
- **Estado:** esbozo — primera versión, incompleta a propósito. No cierra el gate.
- **Consume:** `Docs/BRIEF.md` (sección "El gate de derechos"), `D-04`, `D-06`, `D-07`,
  `D-10` de `Docs/DECISIONES.md`.
- **Depende de:** `RES-03` (marco de derechos, ya completa y citada en el cuerpo) y de las
  fichas adicionales pedidas en `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`. De
  esas once preguntas, `RES-06` y `RES-09` (`Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`)
  ya respondieron cuatro, entera o parcialmente (preguntas 3, 5, 6 y 10). Quedan ocho sin
  ficha completa. Mientras falten, cualquier casilla marcada `[ ]` de "verificación legal"
  sigue abierta.

## Qué es esto y qué no es

Esta nota es el insumo de `contenido` para la investigación de derechos que se comprometió
a cerrar el usuario (`BRIEF.md`, "El gate de derechos"). **No es un dictamen legal.** Donde
no sé algo, digo explícitamente qué hay que averiguar y quién lo tiene que traer — nunca
completo el hueco con una conclusión inventada.

Recordatorio del gate (`D-07`): **construir, cargar contenido y jugar en local está
habilitado ya**, con esta nota tal como está. Lo que queda bloqueado es **publicar** —
subir el sitio a un lugar que un desconocido pueda abrir desde un link de Twitter (`D-10`).
Mientras haya aunque sea una casilla de "verificación legal" sin marcar en cualquiera de
las cuatro superficies, el sitio no se publica.

## Cómo leer las casillas

- `[x]` = criterio interno de contenido ya definido (cuánto se usa, cómo se acredita).
  **No implica que esté verificado legalmente** — implica que si mañana alguien dice "esto
  está permitido", ya sabemos exactamente qué pieza aprobar.
- `[ ]` = falta definir o falta verificar. Cada una dice quién lo trae.

---

## A. Fragmentos de audio

### Qué se usa
- [x] **Origen declarado sin eufemismos:** los fragmentos se producen bajando los temas
  completos de YouTube con un conversor a mp3 y recortando el pedazo que necesita cada
  juego (`D-06`). No hay material propio, no hay máster, no hay licencia de origen. Esto
  es una decisión del usuario, tomada con el reparo ya planteado y asumido — la nota lo
  registra tal cual, no lo suaviza.
- [x] **Dos riesgos distintos, no uno solo:**
  1. El acto de descargar de YouTube con un conversor **contraviene explícitamente** los
     términos de servicio de YouTube (`RES-03`: prohíben de forma explícita descargar
     contenido, salvo autorización expresa de YouTube o una función que el propio servicio
     habilite) — **independientemente** de qué se haga después con el archivo.
  2. El uso posterior del fragmento — publicarlo en un sitio que un desconocido abre desde
     Twitter — puede chocar contra el derecho de autor de la grabación y de la
     composición, **independientemente** de cómo se haya obtenido el archivo.
  Tratarlos como un solo riesgo genérico ("derechos de audio") esconde que hacen falta dos
  respuestas distintas, no una.

### Cantidad
- [x] **Duración máxima de fragmento: 10,0 segundos.** Cierra el número abierto de
  `CTR-01.3`. **Baja de los 15,0 s que `arquitectura` dejó como valor de trabajo** —lo digo
  así de explícito porque obliga a `T-10`: editar `CTR-01.3` y recalcular la escalera de
  `CTR-01.9` con la regla que ya está escrita ahí (pasos 1–3 no cambian, paso 4 = `M × 0,4`,
  paso 5 = `M`). No toco `Docs/ARQ/` — es tarea de `arquitectura`, no mía.

- [x] **Fundamento, separando evidencia de precaución:**

  **Evidencia (`RES-03`, fuente primaria, Art. 10 Ley 11.723):** Argentina no tiene *fair
  use*. El derecho de cita para obra musical topea en **8 compases**, con fin didáctico o
  científico y solo "las partes indispensables". La propia ficha marca, sin margen de duda,
  que **ninguna fuente dice que un fan site sin fines de lucro quede cubierto** por esa
  excepción — es zona gris declarada, sin ley ni jurisprudencia que la resuelva. Esta nota
  no afirma, porque no lo sabe, que el proyecto esté amparado por el Art. 10.

  Dos límites de esa evidencia que no salteo:
  1. **8 compases no son segundos.** Dependen del tempo de cada tema. La cuenta de
     `arquitectura` en `CTR-01.3` (8 compases ≈ 16 s) asume 120 BPM; un tema más rápido
     cruza los 8 compases bastante antes. `contenido` no tiene el tempo de cada canción del
     catálogo — esa ficha no existe hoy, y pedirla es territorio de la sesión paralela de
     investigación de la banda, fuera de este ciclo. Sin ese dato por tema, sostener **un
     número único para todo el banco** sobre la aritmética de compases sería tratar una
     estimación sobre un tempo supuesto como si fuera un techo verificado.
  2. **El Art. 10 exige fin "didáctico o científico".** Un juego de trivia no encaja
     obviamente en ninguna de las dos categorías. Si esa lectura es correcta, el derecho de
     cita ni siquiera aplicaría, y los 8 compases dejarían de ser un techo relevante. No
     resuelvo esa pregunta acá —necesita ficha legal y no es la que pidió este ciclo— pero
     es la razón de fondo por la que trato la cifra de compases como **referencia de orden
     de magnitud**, no como zona segura hasta los 15–16 segundos.

  **Precaución propia, sin respaldo legal:** con el tempo por tema desconocido y la
  aplicabilidad del Art. 10 puesta en duda, quedarme pegado a los 15–16 s que circularon
  (el valor de trabajo de `arquitectura`, la cuenta de 8 compases a 120 BPM, los 30 s de
  preview que regala Spotify) es exponerse más de lo necesario sin que ninguna de esas
  referencias sea, en rigor, una zona segura confirmada. Bajo el número a **10,0 s** como
  techo de contenido: deja margen frente a temas de tempo más rápido sin que tenga que
  inventar el tempo real de cada uno, y todavía sostiene los 5 pasos de la escalera de
  `CTR-01.9` (esa sección exige `M ≥ 4,0 s` para que tenga sentido). **No es una cifra con
  respaldo legal** — es la que me parece prudente mientras la investigación de derechos
  avanza.

- [x] **Máster en WAV fuera del repo: requisito, no consejo.** Todo fragmento se recorta
  desde un máster en WAV guardado fuera del repositorio (`~/RicotaArcade-masters/<slug>.wav`,
  `CTR-01.6`), nunca dentro de `public/audio/fragmentos/`. Es lo único que hace barato bajar
  la duración de nuevo si la investigación legal obliga a recortar más — re-exportar con un
  comando en vez de volver a bajar cada tema de YouTube. Se cumple siempre, sin excepción,
  para todo tema que entre al banco: esta nota lo trata como condición de trabajo, no como
  sugerencia.

- [ ] Sigue sin resolverse la pregunta legal de fondo: si "fragmento corto + sin fines de
  lucro + con crédito" configura alguna figura de uso permitido para un juego, y si el
  requisito de fin didáctico/científico del Art. 10 puede leerse de forma que cubra este
  proyecto. Este número no cierra eso — sigue pedido a `investigador`, entre las ocho
  preguntas legales pendientes de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`.

### Crédito
- [x] **Sí, va crédito visible junto a cada fragmento.** Como mínimo: tema, disco, año. Un
  fragmento sin firma se parece más a "reproducción suelta" que a una cita, y le saca peso
  al argumento de proporcionalidad que sostiene un número corto como 10,0 s. `CTR-01.8` hoy
  no reserva campo para esto — queda dicho acá para que `arquitectura` lo sume cuando toque
  `CTR-01`; esta nota no edita ese contrato.
- [ ] Falta definir el formato exacto de crédito visible en pantalla (tipografía, si va
  superpuesto o en un pie fijo, si suma intérprete además de tema/disco/año) — lo redacto en
  el siguiente lote de `CNT-XX`, una vez que exista el schema del juego (`CTR-XX` de
  `arquitectura`) y el layout de `experiencia`.
- [ ] Falta decidir si el crédito también debe decir explícitamente "fragmento obtenido de
  YouTube, no es material oficial" — propongo que sí, por transparencia, pero es una
  decisión que toca confirmar junto con la investigación de derechos.

### Qué falta saber antes de publicar
- [ ] Si "fragmento corto + sin fines de lucro + con crédito" configura alguna figura de
  uso permitido (cita, uso leal o equivalente) en la jurisdicción relevante para el
  proyecto, y qué duración es razonable bajo esa figura. → pedido a `investigador`.
- [ ] Si descargar de YouTube con un conversor, aparte de la canción en sí, agrega un
  riesgo propio frente a YouTube como plataforma. → pedido a `investigador`.
- [ ] **Parcial.** `RES-09` (`INV-02`, líneas 465-471) identifica a **Erks S.A.** —sociedad
  constituida en 1992 por Indio Solari, Skay Beilinson y Carmen "Poli" Castro, partes
  iguales— como titular del catálogo y de los derechos del grupo. Es a **nivel banda**, no
  tema por tema, así que sigue sin resolver quién tiene los derechos de *cada* tema puntual
  (sello, gestión del intérprete vs. gestión colectiva). Tampoco hay postura pública
  conocida de la banda o de Erks S.A. sobre uso de **fragmentos de audio** por fans en
  particular (distinta de la postura de Rocambole sobre su obra visual, que sí existe —
  ver sección B). → falta el detalle tema por tema y la postura sobre audio, pedido a
  `investigador`.

---

## B. Tapas de Rocambole

### Qué se usa
- [x] Tapas reales, únicamente en el juego "adivinar la tapa o el disco" (`D-04`). En
  ningún otro lugar del sitio se usa una tapa real — el resto de la interfaz usa arte
  original en lenguaje rocambolesco.
- [x] Rocambole es artista vivo — verificado por `RES-06` (Ricardo Cohen, 83 años, activo
  públicamente el 5 de junio de 2026, al despedir al Indio). El brief lo marca como el
  riesgo de derechos más alto del proyecto, y es el primer juego que se cae en el orden de
  corte precisamente por esto.
- [ ] **"Obra registrada" — corregido, no es un hecho verificado.** Esta nota decía, con
  casilla marcada `[x]`, que Rocambole tiene "obra registrada". Esa frase venía heredada
  tal cual de `D-04` (`Docs/DECISIONES.md`), escrita antes de que existiera investigación,
  y ya fue corregida ahí. **Ninguna ficha respalda el registro de la obra plástica de
  Rocambole.** `RES-09` confirma registro de **marca del nombre de la banda** en el INPI, a
  nombre de Erks S.A. — no es lo mismo que el registro de las tapas o los diseños como
  obra plástica. De fondo: el derecho de autor **no depende** de estar registrado para
  existir, así que sacar esta frase no debilita el criterio de precaución de la nota, lo
  apoya en algo cierto. Queda como parte de la pregunta 4 abierta más abajo (autorización
  expresa / titularidad de la tapa), no como hecho dado.

### Resolución
- [ ] Resolución máxima: **no fijada todavía.** Como techo de contenido propongo un ancho
  que alcance para jugar cómodo en celular pero no para reimprimir o usar como wallpaper
  (orden de magnitud: unos cientos de píxeles de lado, a definir con `experiencia` cuando
  fije el layout del juego). No es una cifra con respaldo legal, es una precaución.

### Crédito
- [ ] Falta fijar el formato exacto, pero como mínimo tiene que decir: artista (Rocambole),
  disco, año — todos datos que necesitan su propia ficha `RES-XX` antes de citarse.

### Qué falta saber antes de publicar
- [ ] Si baja resolución + crédito + carácter no comercial alcanza en la práctica, o si de
  todos modos hace falta autorización expresa del artista o de quien gestione sus derechos
  sobre las tapas. **Sigue sin ficha propia.** `RES-06` aporta contexto favorable (ver el
  ítem siguiente) pero no resuelve esto — una declaración simpática en una entrevista no es
  una autorización legal. → pedido a `investigador`.
- [x] **Sí existe postura pública, y es la sección más favorable de toda la investigación
  de derechos.** `RES-06` (`INV-02`, líneas 231-246) trae cita textual de Rocambole:
  *"siempre me encantó la reproductibilidad del arte, que todos puedan tener acceso a mi
  obra"* — se sorprendió al ver sus diseños tatuados en fans y adoptó esa circulación
  masiva; su obra circula hace décadas en remeras, banderas, paredes y tatuajes sin control
  de su parte.

  **Tres límites que la misma ficha marca, para no sobreleerla:**
  1. No prueba que él sea hoy titular de los derechos sobre las tapas: son obra hecha para
     discos editados por sellos y, desde 1992, bajo el paraguas de Erks S.A. (`RES-09`).
     Quién tiene la titularidad de la tapa como obra plástica **sigue sin verificar**.
  2. Una declaración periodística no tiene efecto jurídico de autorización.
  3. No prueba que cubra un uso que él no vio ni aprobó, como un juego de trivia online.

  Hace que pedirle permiso directamente sea una jugada razonable y barata, pero no cierra
  el ítem anterior (baja resolución + crédito + no comercial ¿alcanza?). Dueño de esa
  decisión: `contenido` + el usuario.
- [ ] **Parcial, no "pedido" a secas.** `RES-06` (`INV-02`, líneas 265-292) trae una tabla
  "De dónde salió cada tapa" con nivel de confianza por disco: *Gulp!*, *Oktubre*, *Un
  baión para el ojo idiota*, *La mosca y la sopa*, *Luzbelito* y *Momo Sampler* tienen
  origen reportado (no verificado en fuente primaria — depende de una entrevista de 1999
  cuyos sitios de alojamiento devuelven HTTP 403). **Quedan tres discos sin explicación
  localizada:** ¡Bang! ¡Bang!, Lobo suelto/Cordero atado y Último bondi a Finisterre. Falta
  completar esos tres y, además, un listado verificado de **archivos** de tapa (qué imagen
  exacta corresponde a cada disco), que sigue sin existir. → pedido a `investigador`.

---

## C. Letras

### Qué se usa
- [x] Citas parciales de letras, en el juego "completar la letra", con la mecánica de
  reveal decreciente: fácil da contexto, difícil da un verso pelado. La regla exacta de
  cuánto texto corresponde a cada nivel es `BR-XX`, a cargo de `producto` — `contenido` la
  aplica cuando exista, pero el **techo de derechos** de acá abajo es independiente de esa
  regla y más estricto: ninguna regla de dificultad puede pedirle a `contenido` que
  muestre más de lo que este techo permite.

### Cantidad
- [ ] Cuánto de una letra se puede citar sin que deje de ser "cita" y pase a ser
  "reproducción": **no está determinado.** Como techo de contenido, mientras no haya
  verificación legal: nunca la letra completa de un tema en ningún nivel de dificultad, y
  como máximo el fragmento puntual que la mecánica necesita para ese verso o esa estrofa —
  no una estrofa "de más" para dar contexto de sobra.
- [ ] Este techo es provisorio y **no es una cifra con respaldo legal.** Es el punto de
  partida que `investigador` tiene que confirmar o corregir.

### Crédito
- [ ] Tema, disco, año, y autor(es) de la letra si difiere del intérprete. Ojo: no asumir
  un patrón fijo de autoría — hay que verificarlo tema por tema, no generalizar de memoria.
  → pedido a `investigador`.

### Qué falta saber antes de publicar
- [ ] Si citar unos versos con fines de juego encuadra en algún derecho de cita reconocido,
  y qué cantidad es razonable bajo esa figura. → pedido a `investigador`.
- [ ] Quién tiene los derechos de autor de las letras (compositor, editorial musical) —
  puede no coincidir con quién tiene los derechos del fonograma. → pedido a `investigador`.
- [ ] Fuente confiable del texto exacto de cada letra, para no cargar una transcripción de
  fan con errores como si fuera el texto oficial. → pedido a `investigador`, antes de que
  `contenido` cite una sola línea.

---

## D. Nombre y marca de la banda

### Qué se usa
- [x] El nombre "Patricio Rey y sus Redonditos de Ricota" (y sus formas cortas: "los
  Redondos", "Redonditos") aparece en el nombre del sitio, en textos y en metadata, de
  forma **nominativa**: para identificar de qué banda es el fan site, no como marca propia
  ni como merchandising.
- [x] El proyecto es un fan site sin fines de lucro, sin publicidad y sin venta de nada —
  marco declarado en el brief. Esto **no** es todavía un hecho verificado como suficiente
  legalmente; es el marco bajo el que se pide la verificación.

### Crédito / disclaimer
- [ ] Falta redactar el texto exacto de un disclaimer visible ("fan site no oficial, sin
  fines de lucro, sin relación con la banda ni con su sello") — lo escribo junto con
  `experiencia` cuando exista el pie de página o pantalla de créditos. Propuesta cruzada
  pendiente en `Docs/SUGERENCIAS/CNT-para-experiencia-disclaimer.md` si hace falta cuando
  ese frente arranque.

### Qué falta saber antes de publicar
- [x] **Sí, y es la pregunta legal más concretamente contestada de las once.** `RES-09`
  (`INV-02`, líneas 473-478): hay **registros de marca en el INPI**, gestionados por
  **Erks S.A.** — el titular es la sociedad, no una persona —, con renovación prevista en
  2030. **Falta** un dato puntual: qué clases del nomenclador cubre el registro; no se pudo
  consultar el padrón del INPI directamente por web en esta ronda. → esa consulta sigue
  pedida a `investigador`.
- [ ] Si existe alguna política pública de la banda o su management sobre el uso del
  nombre por fan sites. → pedido a `investigador`.
- [ ] Si el propio nombre del proyecto ("RicotaArcade") o su branding necesitan algo más
  que el disclaimer — lo reviso cuando `investigador` traiga lo anterior, no antes.

---

## Resumen para quien audita el gate

| Superficie | Techo interno definido | Verificación legal | Bloquea publicar hasta |
|---|---|---|---|
| Audio (YouTube→mp3) | Sí (10,0 s + máster WAV fuera del repo) | Parcial (`RES-03`: marco general y ToS de YouTube; `RES-09`: titularidad a nivel banda, Erks S.A.) | figura de uso permitido para audio, titular tema por tema, postura de la banda sobre uso de fragmentos |
| Tapas de Rocambole | Parcial (baja resolución, sin cifra) | Parcial (`RES-06`: postura pública de Rocambole + origen reportado de 6 de 9 discos) | autorización expresa o equivalente, titularidad de la tapa como obra plástica, los 3 discos sin origen localizado |
| Letras | Parcial (fragmento puntual, sin cifra) | No iniciada (`RES-09` da la dupla compositiva general Solari/Beilinson, pero no la autoría tema por tema) | `RES-03` + fichas de letras |
| Nombre y marca | Parcial (uso nominativo, falta disclaimer) | Parcial (`RES-09`: marca registrada en INPI a nombre de Erks S.A.) | clases del INPI cubiertas por el registro, política pública sobre uso del nombre por fan sites |

Ninguna fila está cerrada. Esta versión existe para que la investigación de derechos tenga
por dónde empezar, no para autorizar nada todavía.
