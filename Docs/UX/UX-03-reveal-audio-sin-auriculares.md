# UX-03 — El reveal de audio sin auriculares

> Rol dueño: `experiencia`. Consume `Docs/BRIEF.md` (entrada c: "lo abre solo, en un
> rato muerto, posiblemente sin auriculares"; `D-03`, motor híbrido; `D-09`, sin muro y
> jugable con el pulgar) y `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-02`, `BR-02`).

**Resuelve:** `US-02` criterio 2 (caso borde "sin sonido disponible": *"el juego se lo
advierte explícitamente antes de arrancar la partida — no lo deja adivinar 'a ciegas'
sin saber que el audio no sonó"*), apoyado en `BR-02` (mecánica y puntaje de los 5 pasos
del reveal).

## La mecánica que este flujo tiene que respetar (`BR-02`)

El reveal no es un scrub continuo: son **5 pasos discretos**, del más corto (0,1 s) al
fragmento completo, con puntaje decreciente (100/80/60/40/20). El jugador pide "más
audio" a demanda, nunca retrocede, y el puntaje depende del paso más alto alcanzado al
acertar. Esto importa para el diseño: la interfaz tiene que representar 5 escalones
claros, no una barra de progreso ambigua.

## La decisión

**Aviso explícito antes de arrancar la partida (como pide `US-02`) + degradar con
dignidad durante el juego mediante un sustituto visual sincronizado con los 5 pasos.**
No agrego una pista alternativa sin audio como mecánica nueva — explico por qué en
"Qué descarté" más abajo.

## Por qué

`US-02` ya resolvió la parte de "avisar": tiene que ser explícito y anterior a arrancar,
no un fallo silencioso. Lo que yo agrego es *dónde* y *cómo* aparece ese aviso sin que
se vuelva un muro, y qué ve el jugador mientras juega si terminó decidiendo seguir sin
sonido.

Los navegadores móviles ya exigen un gesto explícito del usuario antes de reproducir
cualquier audio — no hay autoplay real. Aprovecho esa restricción: el aviso no necesita
una pantalla nueva, entra en la misma pantalla de entrada del juego, antes del primer
tap que arranca la partida.

## Qué pasa, pantalla por pantalla

**Pantalla de entrada del juego 2 (equivalente a la Pantalla 0 de `UX-01`, para este
juego):**
- Título corto, botón único **"EMPEZAR"** en zona pulgar — mismo patrón que el resto del
  sitio.
- Debajo del botón, **siempre visible, sin necesidad de tocar nada**: una línea fija,
  chica pero legible, tipo *"🎧 se juega mejor con sonido — igual podés arrancar sin
  auriculares"*. No es un modal, no pide confirmar nada, no bloquea el tap en
  "EMPEZAR": es el aviso explícito que pide `US-02`, resuelto sin agregar un paso.
- Al lado del botón "EMPEZAR", un ícono de volumen/mute visible y alcanzable con el
  pulgar — no escondido en un menú — para que quien ya sabe que está en silencio pueda
  mutear antes de arrancar sin sentirse "descubierto" por un pop-up.

**Qué se toca:** un tap en "EMPEZAR". El aviso no exige respuesta ni segundo tap.

**Durante cada ítem, los 5 pasos del reveal (`BR-02`):**
- El paso 1 se reproduce automáticamente al mostrarse el ítem (ya hubo gesto del usuario
  al tocar "EMPEZAR" o "SIGUIENTE ÍTEM").
- Cada paso, suene o no, se acompaña de una animación visual sincronizada — surco de
  vinilo o ecualizador en línea rocambolesca (ver `UX-04`) — con 5 estados visualmente
  distintos, uno por paso. El jugador sin sonido activado igual **ve** que avanzó de
  paso al tocar "más audio": no queda con la sensación de que el juego no respondió.
- El botón "más audio" (que pide el siguiente paso) muestra el costo en puntos restante
  visible en todo momento (ej. "paso 3 · vale 60"), para que la decisión de seguir
  pidiendo sea informada con o sin sonido de por medio.

## Qué descarté

- **Modal bloqueante preguntando "¿Tenés auriculares? Sí/No" antes de jugar.**
  Descartado: agrega un paso obligatorio a la entrada del juego, viola "un tap por
  decisión" y reintroduce el tipo de muro que `D-09` prohíbe, aunque sea dentro de un
  juego y no en la portada del sitio. `US-02` pide "advertir", no "preguntar y esperar
  respuesta".
- **Ofrecer una pista alternativa sin audio (texto) como mecánica nueva, a cambio de
  puntos.** Lo consideré y lo descarto para esta ráfaga: `BR-02` ya fija una tabla de
  puntaje cerrada de 5 pasos, y sumar una sexta vía de puntaje con su propio costo
  significa reabrir esa regla de negocio, no una decisión de interfaz. Además, este
  juego es, por diseño, un juego de reconocimiento de oído (`US-02`) — ofrecer una vía
  para resolverlo sin escuchar nada cambia qué mide el juego, no solo cómo se ve. Si
  `producto` quiere esa vía igual, es una historia nueva, no una resolución de `UX-03`.
- **Detectar auriculares por software.** Descartado por inviable: no existe una API web
  estándar y confiable para eso.

## Bloqueos que dejo anotados

- La duración exacta en segundos de cada uno de los 5 pasos sigue pendiente de
  `arquitectura` (ya señalado por `producto` en
  `Docs/SUGERENCIAS/PRD-para-arquitectura-pasos-reveal-audio.md`) — no bloquea este
  flujo, que solo depende de que existan 5 escalones distinguibles.
- La sincronía real entre el fragmento de Web Audio API y la animación visual es
  implementación del hilo principal / `arquitectura` — acá defino qué se ve y cuándo,
  no cómo se programa.
- Qué pasa si Spotify no está disponible al revelar el tema completo ya lo resuelve
  `US-02` criterio 3 (el resultado del ítem se ve igual); no repito ese flujo acá porque
  es posterior al reveal, no parte de él.
