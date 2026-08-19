# UX-01 — Flujo de sesión del quiz

> Rol dueño: `experiencia`. Consume `Docs/BRIEF.md` (momento de uso, `D-09`, `D-10`,
> `D-04`), `Docs/DECISIONES.md` y `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-01`, `BR-01`).

> **v2 — `T-30`, ciclo 3.** Revisión acotada, no rediseño: agrega dónde se ve el rótulo
> de leyenda y de testimonio, que el banco ya exige (`CTR-02.4`) y que `D-14` puso en el
> centro de la postura del proyecto ("la defensa no es verificar más, es rotular bien").
> Todo lo demás de esta hoja queda igual. Suma a lo que consumo: `Docs/DECISIONES.md`
> `D-14`, y `Docs/ARQ/ARQ-schema-quiz.md` `CTR-02.3`/`CTR-02.4`.

**Resuelve:** `US-01` (quiz de preguntas, criterio 1 y 2), `BR-01` (escalonamiento de
dificultad sin muro de entrada), criterio no negociable `D-09` (pulgar + sin muro),
difusión `D-10` (entrada por link frío o por desafío de un amigo). `US-01` deja
explícitamente fuera de su alcance "el copy exacto de la pantalla de resultado y el
mecanismo de compartir" — eso es lo que diseño acá y en `UX-02`.

## Presupuesto de tiempo (objetivo: 2–3 min totales)

`US-01`, criterio 1, fija la ronda en **8 preguntas** (supuesto propio de `producto`, a
~15–20 s por pregunta con una sola mano; `producto` deja anotado que soy yo quien valida
el tiempo real y puede ajustar el número vía `Docs/SUGERENCIAS/`).

| Tramo | Duración estimada |
|---|---|
| Pantalla de entrada | 0:05–0:10 |
| 8 preguntas (`US-01`) | ~1:36 (12 s promedio c/u, feedback incluido) |
| Pantalla de resultado + decisión de compartir | 0:20–0:30 |
| **Total** | **~2:00–2:15** |

El número le queda cómodo al presupuesto de 2–3 min con margen. Si en el uso real el
promedio por pregunta sube (por ejemplo, si el jugador lee dos veces antes de tocar),
todavía hay margen de unos 45 s antes de tocar el techo de 3 min — no hace falta bajar
las 8 preguntas de `US-01` para cumplir el presupuesto.

## Pantalla 0 — Entrada

Una sola pantalla, tres variantes de copy según cómo se llega. El botón y el layout son
siempre los mismos: lo que cambia es una línea de texto.

**Qué se ve (todas las variantes):**
- Fondo ilustrado en lenguaje rocambolesco (ver `UX-04`): un personaje o ícono suelto,
  nunca una tapa real (`D-04`).
- Título fijo: algo como *"¿Cuánto sabés de los Redondos?"* (tono y copy final los
  redacta `contenido`, acá solo defino largo máximo: una línea, sin explicación debajo).
- Un solo botón grande, anclado en el tercio inferior de la pantalla (zona pulgar):
  **"JUGÁ"**.
- Nada más. Sin campo de nombre, sin login, sin pedido de permisos (notificaciones,
  ubicación, micrófono), sin pantalla de instrucciones intermedia.

**Variante A — link frío (Twitter, desconocido sin contexto):**
Subtítulo neutro, una línea, sin dato inventado (nada de contadores falsos tipo "1.240
ricoteros jugaron hoy": no hay analítica, `D-10` no la trae, y prometer un número que no
existe es justo el tipo de cosa que el criterio de veracidad castiga, aunque ese
criterio sea de `contenido` y no mío).

**Variante B — link de un amigo con su resultado (entrada b del BRIEF):**
El subtítulo se reemplaza por el desafío: *"Fulano sacó 7/8. ¿Te la bancás?"* Mismo
botón único, mismo tap. El desafío no agrega un paso: solo cambia una línea de texto.
Cómo viaja el dato del resultado hasta acá es una pieza técnica que no me toca definir
— ver `Docs/SUGERENCIAS/UX-para-arquitectura-formato-link-resultado.md`.

**Variante C — lo abre solo, en un rato muerto (entrada c del BRIEF):**
Mismo layout que la variante A, sin desafío. Esta variante no tiene requisito de audio
porque el quiz es texto puro; el caso "sin auriculares" es del juego 2 (`UX-03`).

**Qué se toca:** un tap sobre "JUGÁ".

**Adónde lleva:** directo a la Pregunta 1. Nunca hay una pantalla de instrucciones entre
la entrada y la primera pregunta — la instrucción implícita es el botón en sí, y la
primera pregunta hace de tutorial.

**Regla de "sin muro" en la primera pregunta:** ya no es una imposición mía, la fija
`BR-01`: el primer ítem servido en cualquier partida nueva es siempre de nivel Fácil, y
dentro de la partida la dificultad nunca baja (Fácil → Media → Difícil). Lo que aporto
acá es la lectura de UX de esa regla: es lo que hace que el que "escuchó Ji Ji Ji en una
previa" conteste bien la primera y quiera seguir, en vez de rebotar en la número 1.

## Pantallas 1..N — Pregunta

**Qué se ve:**
- Arriba, chico: contador de progreso ("3/8") y una insignia de categoría con color
  propio (historia / discos / letras / mitología — cuatro colores fijos de la paleta,
  ver `UX-04`).
- **Si el ítem es leyenda o testimonio** (`esLeyenda: true`, o el objeto `testimonio`
  presente — `CTR-02.3`), junto a la insignia de categoría aparece una segunda
  insignia chica de la misma familia visual: una sola palabra, **"LEYENDA"** o
  **"TESTIMONIO"**, con su propio color e ícono. En un ítem de hecho verificado no
  aparece nada ahí — el silencio es el default, solo la excepción se marca. Detalle
  completo, y por qué va acá y no en otro lado, en "El rótulo de leyenda y de
  testimonio" más abajo.
- El enunciado de la pregunta, centrado, tipografía de cuerpo (nunca la tipografía
  dibujada: legibilidad primero en el texto largo).
- Cuatro opciones en botones verticales grandes que ocupan el tercio inferior de la
  pantalla — la zona que el pulgar alcanza sin reacomodar la mano.
- Sin cuenta regresiva visible. No asumo timer competitivo: si `producto` quiere sumar
  presión de tiempo como mecánica, es una decisión de reglas (`BR-XX`) que no invento acá.

**Qué se toca:** un tap sobre una opción. Nada de arrastrar, doble tap, ni swipe.

**Al acertar:** la opción tocada se pinta de verde saturado, aparece un ícono/mueca de
festejo (arte original, no texto largo), auto-avanza a la siguiente pregunta en ~1,2 s
sin necesitar un segundo tap — el pulgar no vuelve a moverse hasta la próxima decisión
real. **Excepto si el ítem tiene rótulo:** ver "El rótulo de leyenda y de testimonio".

**Al fallar:** la opción tocada se pinta de rojo, la correcta se resalta en verde al
mismo tiempo (no hay que adivinar cuál era), micro-copy que no humilla, auto-avanza en
~1,6 s (un poco más de tiempo para leer cuál era la correcta antes de que cambie la
pantalla). **Excepto si el ítem tiene rótulo:** ver abajo.

### El rótulo de leyenda y de testimonio (`T-30`, `D-14`, `CTR-02.4`)

Quince de los treinta ítems del banco de hoy —diez leyenda, cinco testimonio— no son
hecho verificado. `D-14` construye la postura entera del proyecto sobre esto: **la
defensa no es verificar más, es rotular bien.** Si el rótulo no llega a la pantalla, la
mitad del banco se lee como hecho verificado y el trabajo de dos ciclos se pierde justo
acá, en la última milla.

**Dos momentos, no uno — y cada uno hace un trabajo distinto.**

1. **Antes de responder — la insignia chica** (ya descrita en "Qué se ve"). Una sola
   palabra, "LEYENDA" o "TESTIMONIO", junto a la insignia de categoría. No cuenta la
   leyenda ni dice quién es el testigo: solo avisa **qué tipo de dato es** antes de que
   el jugador elija una opción.
   - **Por qué antes, y no solo después.** En un ítem `esLeyenda`, la opción "correcta"
     es la que dice el folclore — no necesariamente el hecho más preciso que existe
     sobre el tema; es la naturaleza del dato, no un error del banco. Un fan que conoce
     la historia real mejor que la leyenda merece saber, **antes de tocar**, que se le
     está preguntando "qué se cuenta" y no "qué pasó". Sin el aviso previo, ese
     jugador —justo el que más sabe— es el que más chances tiene de marcar la opción
     históricamente más exacta y que el juego se la marque mal. Eso es exactamente lo
     que `D-14` no tolera, y no es un matiz legal: es que "la respuesta correcta sea
     correcta" para el que sabe.
   - **Por qué solo la palabra, y no el detalle, en este momento.** El enunciado y las
     cuatro opciones ya compiten por la pantalla de la pulgar. Meter ahí el texto
     completo de `rotuloLeyenda` (hasta 200 caracteres) o los datos de `testimonio` es
     exactamente el "cartel gigante" que arruina el juego. La palabra sola alcanza
     para reencuadrar la pregunta sin robarle protagonismo.

2. **Después de responder — el sello completo, como revelación.** Debajo de las cuatro
   opciones (que se quedan pintadas verde/rojo, sin cambios respecto de "Al
   acertar"/"Al fallar"), aparece una tarjeta chica con el contenido real del rótulo:
   - **Leyenda:** la etiqueta corta que redacta `contenido` (`CNT-05`, cadena 8 — del
     tipo *"Esto es leyenda:"*) seguida del texto de `rotuloLeyenda` tal como está
     cargado en el ítem.
   - **Testimonio:** la etiqueta corta con el nombre del testigo adentro — del tipo
     *"Lo cuenta {quien}:"* — seguida del valor de `testimonio.obra` en formato corto
     (ej. *"— de Recuerdos que mienten un poco"*). **No se muestran
     `testimonio.ubicacion` ni `testimonio.afirmacion`.** Son el dato que necesita
     `revisor` para auditar contra el PDF (`CTR-02.4`, regla 3), no lo que necesita el
     jugador para disfrutar la revelación. Mostrar los cuatro subcampos es la misma
     clase de exceso que un cartel gigante; mostrar `quien` + `obra` alcanza para que
     "testimonio" se sienta distinto de "leyenda" —alguien con nombre, contando algo,
     en un lugar concreto— sin convertir la pantalla en una ficha bibliográfica.
   - **Por qué después, y no en el mismo golpe que antes.** Es el momento de "premio"
     que pide el tono del proyecto: el jugador ya respondió, ya tuvo su verde o su
     rojo, y ahora se entera de **de dónde sale la posta**. Es una revelación, no un
     descargo — "te cuento una leyenda hermosa que circula entre fans", no una nota al
     pie de abogado.

**Jerarquía visual, las dos veces.** Ni nota al pie ni cartel gigante. La insignia
previa usa la misma familia visual y el mismo tamaño que la insignia de categoría —
no grita más que ella. La tarjeta posterior es del ancho de las opciones, con un borde
o fondo de color propio (nunca el verde de acierto ni el rojo de error, que quedan
exclusivos de esas dos señales) y un ícono distinto para leyenda y para testimonio, así
la distinción no depende solo de leer la palabra.

**Cómo se distingue leyenda de testimonio en pantalla:**
- Palabra distinta ("LEYENDA" / "TESTIMONIO"), en las dos apariciones.
- Ícono distinto: leyenda lleva un ícono de "esto se cuenta" (folclore anónimo — el
  brief de arte lo resuelve, pensado como una boca o un globo con signos de pregunta,
  en lenguaje rocambolesco); testimonio lleva un ícono de "alguien con nombre habla"
  (una comilla o una figura con globo de diálogo).
- Color distinto entre los dos, y distinto de verde/rojo. Los hex exactos son de
  `UX-04`/`T-38`; la restricción que dejo acá es que sean dos acentos de la paleta
  psicodélica que no sean el verde de acierto ni el rojo de error.
- Solo testimonio trae un nombre propio en el sello ("Lo cuenta {quien}:"); leyenda
  nunca nombra a nadie — es la diferencia de fondo entre folclore anónimo y testigo
  identificado, y por eso tiene que **verse**, no solo leerse en la letra chica.

**Qué pasa con el auto-avance.** Es la pregunta que más importa de esta tarea:
**si el rótulo no llega a leerse, no sirve.** `rotuloLeyenda` puede tener hasta 200
caracteres — no entra en 1,2 o 1,6 segundos bajo ningún criterio de lectura real. Dos
caminos:
- (a) estirar el timer lo suficiente para 200 caracteres (~8-10 s), parejo para todos
  los ítems tengan o no rótulo;
- (b) que el auto-avance siga aplicando solo a los ítems **sin** rótulo, y que los
  ítems **con** rótulo esperen un tap del jugador en vez de un reloj.

**Elijo (b).** Estirar el timer parejo penaliza a los 15 ítems de hecho verificado con
una espera que no necesitan. Y estirarlo solo para los rotulados tampoco resuelve el
problema de fondo: un timer fijo no le puede servir bien a la vez a un `rotuloLeyenda`
de 15 caracteres y a uno de 200. Un tap propio sí — el jugador lee lo que necesita y
avanza cuando quiere, sin reloj de por medio. Es la única forma de garantizar "si hay
rótulo, se leyó" en vez de "si hay rótulo, hubo tiempo de sobra para leerlo".

- **Sin rótulo (hecho verificado):** auto-avance sin cambios — ~1,2 s si acierta,
  ~1,6 s si falla, tal como ya describía esta hoja.
- **Con rótulo (leyenda o testimonio):** no hay auto-avance. Aparece un botón chico,
  anclado en la zona pulgar, con el texto que redacte `contenido` (algo del tipo
  "SEGUÍ"). **Esta cadena es nueva y no estaba en la lista de ocho de `CNT-05`/`T-29`**
  porque esa lista se armó antes de que existiera esta pantalla — la pido acá, y queda
  como bloqueo abajo. Un solo tap, mismo gesto que responder: no rompe la regla de "un
  tap por decisión".

**Costo en el presupuesto de tiempo, medido contra la propia tabla de esta hoja.** Con
30 ítems y 15 rotulados, una ronda de 8 trae en promedio ~4 ítems con sello.
Reemplazar 1,2-1,6 s de auto-avance por un tap propio cuesta, en el caso típico, unos
3-4 s más por ítem (leer la tarjeta corta + tocar) — unos +12-16 s por partida contra
el margen de ~45 s que esta hoja ya tenía antes de tocar el techo de 3 minutos. **Sigue
entrando.** El caso extremo —una ronda que sortee 8 de 8 rotulados— cuesta hasta
~+30 s y come casi todo el margen; lo dejo anotado para que `revisor` (`T-43`) mida el
tiempo real de una partida así. No lo resuelvo acá con una regla nueva de sorteo por
rótulo: eso sería `BR-XX` de `producto`, no una decisión de flujo.

**Nota de accesibilidad dentro de esta pantalla:** acierto/error nunca se comunican
solo por color — siempre color + ícono/forma distinta, para el jugador con dificultad
para distinguir rojo/verde.

**Si abandona a mitad de la partida:** no hay guardado de sesión a mitad de camino. No
hay backend ni cuentas (fuera de alcance del BRIEF), así que al volver a abrir arranca
de cero en la Pantalla 0. Es intencional: en una sesión de 2–3 min no hay "progreso" que
valga la pena persistir, y agregar esa persistencia sería la clase de flujo largo que
este rol tiene que marcar como mal cortado.

## Pantalla final — Resultado

**Qué se ve:**
- El puntaje, grande ("7/8").
- Un tramo visual de tres niveles (bajo / medio / alto, según % de aciertos) con arte
  distinto por nivel — **la estructura de tres niveles es mía, el texto y los cortes de
  % exactos los define `producto`/`contenido`**, no los invento acá para no dejar un
  criterio de puntaje de facto.
- Botón primario, el más grande de la pantalla: **"COMPARTIR"**. Por `D-10` el resultado
  compartido es la puerta de entrada, no un adorno — así que compite en jerarquía visual
  con "jugar de nuevo" y gana.
- Botón secundario, más chico, debajo: **"JUGAR DE NUEVO"**.

**Qué se toca:**
- Tap en "COMPARTIR" → abre el flujo de `UX-02` (Web Share API nativo si el navegador lo
  soporta; si no, copiar link como respaldo — la implementación exacta es del hilo
  principal).
- Tap en "JUGAR DE NUEVO" → vuelve a la Pregunta 1 con un set nuevo, sorteado del pool de
  40 preguntas que fija `US-01`. Con 8 por partida sobre un pool de 40, jugar dos veces
  seguidas no debería repetir el octeto completo, aunque alguna pregunta suelta puede
  repetirse — riesgo 4 del BRIEF, no lo resuelvo desde acá.

## Checklist — primera pantalla sin muro

- [ ] Cero campos de texto antes de jugar (ni nombre, ni mail).
- [ ] Cero permisos de sistema pedidos antes de la primera pregunta.
- [ ] Un solo tap entre "caer en el sitio" y "ver la primera pregunta".
- [ ] La primera pregunta del set es siempre la de piso más bajo.
- [ ] Ningún dato inventado en el copy de bienvenida (sin contadores falsos).
- [ ] Nada de scroll para encontrar el botón de jugar: entra en el viewport inicial.

## Checklist — accesibilidad

- [ ] Objetivo de toque mínimo 44×44 px en cada opción de respuesta y en los botones
      principales.
- [ ] Acierto/error se comunican con color **y** con forma/ícono, nunca solo color.
- [ ] Contraste alto entre texto y fondo también dentro de la paleta psicodélica (ver
      `UX-04`): saturado no es excusa para bajo contraste.
- [ ] Ninguna animación de la interfaz destella o titila rápido — la paleta es intensa
      pero el movimiento tiene que ser calmo, por riesgo de fotosensibilidad.
- [ ] Tipografía de cuerpo (preguntas, opciones) siempre en la fuente legible, nunca en
      la fuente dibujada de `UX-04`.
- [ ] El sello de leyenda/testimonio se distingue por color **y** por ícono, igual que
      acierto/error — nunca solo por la palabra "LEYENDA"/"TESTIMONIO".
- [ ] El texto del sello (`rotuloLeyenda`, `quien`, `obra`) va en la tipografía
      legible, nunca en la dibujada; solo la palabra corta de la insignia previa puede
      usar la tipografía display si el arte lo pide, porque no es texto largo.

## Bloqueos que dejo anotados

- Los cortes de puntaje de los tres tramos de resultado (bajo/medio/alto) siguen sin
  definir — propuesta a `producto` en
  `Docs/SUGERENCIAS/UX-para-producto-historias-quiz-y-audio.md`.
- El formato del link que trae un desafío (Variante B) es de `arquitectura` — propuesta
  en `Docs/SUGERENCIAS/UX-para-arquitectura-formato-link-resultado.md`.
- **Dos cadenas de copy nuevas para `contenido`, agregadas en `T-30`:** (1) la
  etiqueta corta de testimonio (`CNT-05`, cadena 8) tiene que ser una **plantilla con
  un hueco para `{quien}`** (ej. "Lo cuenta {quien}:"), no un texto fijo con "el
  Indio" adentro — `testimonio.quien` puede ser otra persona citada en el memoir, por
  ejemplo Rocambole (`CTR-02.4`). (2) el texto del botón que reemplaza al auto-avance
  en los ítems con rótulo (ej. "SEGUÍ"), que no estaba pedido en la lista original de
  ocho de `T-29` porque esa lista se armó antes de que esta pantalla existiera.
