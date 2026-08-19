# UX-01 — Flujo de sesión del quiz

> Rol dueño: `experiencia`. Consume `Docs/BRIEF.md` (momento de uso, `D-09`, `D-10`,
> `D-04`), `Docs/DECISIONES.md` y `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-01`, `BR-01`).

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
real.

**Al fallar:** la opción tocada se pinta de rojo, la correcta se resalta en verde al
mismo tiempo (no hay que adivinar cuál era), micro-copy que no humilla, auto-avanza en
~1,6 s (un poco más de tiempo para leer cuál era la correcta antes de que cambie la
pantalla).

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

## Bloqueos que dejo anotados

- Los cortes de puntaje de los tres tramos de resultado (bajo/medio/alto) siguen sin
  definir — propuesta a `producto` en
  `Docs/SUGERENCIAS/UX-para-producto-historias-quiz-y-audio.md`.
- El formato del link que trae un desafío (Variante B) es de `arquitectura` — propuesta
  en `Docs/SUGERENCIAS/UX-para-arquitectura-formato-link-resultado.md`.
