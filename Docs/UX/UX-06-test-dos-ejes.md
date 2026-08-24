# UX-06 — El test de los dos ejes: pantalla de pregunta y pantalla de resultado

> Rol dueño: `experiencia`. Consume `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-06`, `BR-17`),
> `Docs/DECISIONES.md` (`D-19`, la mezcla), `Docs/UX/UX-01-flujo-quiz.md`,
> `Docs/UX/UX-02-tarjeta-resultado.md`, `Docs/UX/UX-04-sistema-visual.md`,
> `Docs/UX/UX-05-tapas-en-pantalla.md`, `src/styles/tokens.css`,
> `src/lib/contraste.test.ts`, `.claude/rules/diseno-marca.md` y
> `.claude/rules/voz-ricotera.md`. Tarea `T-122` del ciclo 8
> (`Docs/ORQ/ORQ-plan-ciclo-8.md`).

**Resuelve:** `US-06` criterios 1 a 4 y la pregunta que `producto` dejó explícitamente
para mí en su criterio 4: *"si `UX-02` sirve tal cual o necesita una variante para un
resultado sin puntaje lo decide `experiencia`"*. También fija, porque `D-19` lo deja en mi
cancha ("el mapa sección→disco es de `experiencia` en última instancia"), **qué disco
viste esta sección nueva**.

**No resuelvo acá** (y quedan listados en "Bloqueos"): el texto exacto de las diez
preguntas y sus veinte opciones, los cuatro nombres de cuadrante y su descripción, el
mecanismo de sorteo de qué 5 de 10 entran a cada partida (todo eso es de `contenido` y
`arquitectura`, `US-06` ya lo deja así). Lo que sí fijo son los **presupuestos** —
caracteres, palabras— que esas piezas tienen que respetar para no romper el diseño.

---

## 0. Por qué este juego es, de los cinco, el que menos muro tiene

Vale decirlo antes de diseñar nada, porque cambia el punto de partida: **acá no hay nada
que el jugador tenga que saber.** No hay categoría de conocimiento, no hay dato de la
banda, no hay tema que reconocer, no hay letra que completar. Cualquiera que entre —sepa
diez discos o ninguno— responde las diez preguntas exactamente igual de bien que un
experto, porque no hay una respuesta mejor. Eso saca de encima toda la maquinaria que
`UX-01` construyó para sostener "sin muro de entrada" (rótulo de leyenda/testimonio,
primer ítem siempre Fácil, escalonamiento `BR-01`): **acá `BR-01` no aplica** (ya lo dice
`US-06`) y no hace falta reponer nada en su lugar. Lo anoto explícito para que quien
construya esta pantalla no busque una insignia de dificultad que no existe.

También significa que no hay auriculares que pedir (es texto puro, sin audio) ni imagen
con derechos que craditar (sin tapas reales, ver §5). El presupuesto de esta pantalla es
más chico que el de cualquiera de los otros cuatro juegos.

---

## 1. Presupuesto de tiempo (objetivo: 2–3 min, con más margen que el quiz)

`US-06` fija la ronda en 10 preguntas de elección entre dos opciones (`producto`, criterio
1: elegir entre dos opciones cortas sin conocimiento previo se resuelve más rápido que una
pregunta de trivia). Mi validación, análoga a la tabla de `UX-01`:

| Tramo | Duración estimada |
|---|---|
| Pantalla de entrada | 0:05–0:10 |
| 10 preguntas (leer + tocar + confirmación) | ~1:20 (≈8 s promedio c/u) |
| Pantalla de resultado + decisión de compartir | 0:20–0:30 |
| **Total** | **~1:45–2:10** |

Queda con más margen que el quiz (~2:00–2:15): sin cuatro opciones que leer, sin rótulo
que esperar, sin reveal de audio. Si en el uso real el promedio sube, hay hasta 50-75 s de
margen antes de tocar el techo de 3 min sin necesidad de bajar de 10 preguntas.

---

## 2. Pantalla 0 — Entrada

Mismo principio que `UX-01`: una sola pantalla, tres variantes de copy, mismo botón y
mismo layout siempre.

**Qué se ve (todas las variantes):**
- Fondo ilustrado en lenguaje rocambolesco, con la paleta de la sección (ver §5) — un
  ícono o motivo suelto, nunca una tapa real (no la necesita, ver §0).
- Título fijo, registro 1 de `.claude/rules/voz-ricotera.md`: pregunta en segunda persona,
  ≤ 8 palabras (ej. *"¿Qué tipo de ricotero sos?"* — redacción final `contenido`).
- Subtítulo, registro 3: una línea neutra que dice el mecanismo sin vender nada — algo del
  tipo *"Diez preguntas. Elegís y listo."* (redacción final `contenido`; mi restricción:
  tiene que quedar claro que no hace falta saber nada de la banda, porque es el molinete
  más abierto de los cinco y conviene decirlo, no solo que sea cierto).
- Un solo botón grande, anclado en el tercio inferior (zona pulgar): **"EMPEZÁ"**. Uso un
  verbo distinto al "JUGÁ" del quiz a propósito — ayuda a que el jugador que ya conoce el
  sitio note, antes de tocar, que esto no es una ronda de preguntas con puntaje.
- Nada más: cero campos, cero permisos, cero pantalla de instrucciones intermedia.

**Variante A — link frío:** subtítulo neutro, sin dato inventado (mismo criterio que
`UX-01`).

**Variante B — link de un amigo con su resultado:** el subtítulo se reemplaza por el
desafío de identidad, no de puntaje — algo del tipo *"Fulano dio con 'El farol del
quilombo'. ¿Con cuál das vos?"* (redacción final `contenido`). Mismo botón único, mismo
tap. Cómo viaja el nombre del cuadrante del que comparte hasta acá es pieza técnica de
`arquitectura`, análoga a la que `UX-02` ya dejó pendiente para el quiz.

**Variante C — lo abre solo:** igual que la variante A, sin desafío.

**Qué se toca:** un tap sobre "EMPEZÁ". **Adónde lleva:** directo a la Pregunta 1, sin
pantalla de instrucciones — la pregunta 1 es su propio tutorial, igual que en `UX-01`.

---

## 3. Pantallas 1..10 — Pregunta

**Qué se ve:**
- Arriba, chico, en `--fuente-rotulada` y `--texto-tenue` (par ya testeado): un contador
  de progreso, "4/10". **Nada más en la cabecera** — sin insignia de categoría, sin
  insignia de dificultad, sin insignia de leyenda/testimonio: ninguna de las tres existe
  acá (§0). Se deja adrede sin mostrar a qué eje mueve la pregunta (luz/oscuridad u
  orden/caos): es la misma lógica de cualquier test de identidad — si el jugador supiera
  qué eje está en juego, podría "jugar" el resultado en vez de responder con lo primero
  que le sale, y el resultado dejaría de ser una identidad para volverse una elección
  calculada.
- El enunciado, centrado, en `--fuente` (texto largo, nunca la dibujada — mismo criterio
  que `UX-01`). Presupuesto propio: **≤ 14 palabras**, alineado a la oración mediana que
  midió `voz-ricotera.md` (13 palabras, rasgo 3.1) — si no entra en 14, está pidiendo dos
  preguntas en una.
- Debajo, ocupando el tercio inferior (zona pulgar): **dos botones grandes, apilados
  verticalmente**, uno por opción. No cuatro (no hay "distractores" que fabricar — cada
  opción es un extremo real del eje, no una opción incorrecta a descartar) y no un
  deslizador (un deslizador exige control fino con el pulgar, y `D-09` no cede eso por
  ningún motivo). Con solo dos opciones, cada botón tiene **más alto y más ancho** que
  cualquiera de los cuatro del quiz — el objetivo de toque global (`--toque-min`, 48 px)
  queda muy por debajo de lo que estos botones ocupan en la práctica.
- Las dos opciones llevan **el mismo tratamiento visual exacto** — mismo color, mismo
  borde, mismo tamaño de letra — para que el orden en pantalla (arriba/abajo) no
  favorezca a ninguna. Sugiero a `arquitectura`/`contenido` alternar o sortear qué extremo
  cae arriba entre preguntas, para que un jugador que responde "siempre la de arriba" no
  quede sesgado hacia el mismo lado del eje (queda como sugerencia, no como bloqueo: ver
  §8).
- **No hay opción de "pasar".** A diferencia de `US-02`, acá no hace falta reconocer nada
  externo para responder — cualquiera puede elegir entre dos frases de tono, aunque sea al
  azar, así que no existe el caso "no tengo ningún candidato" que justificaba el pasar de
  `BR-02`.

**Qué se toca:** un tap sobre una de las dos opciones. Nada de arrastrar, doble tap ni
swipe.

### Qué reemplaza al refuerzo de acierto — porque acá no hay acierto

Esta es la pregunta central de esta sección del flujo, y la contesto en dos partes.

**Primero, lo que no hago.** No pinto de verde ni de rojo, no aparece un ícono de festejo
ni una mueca de corrección, no hay "correcta se resalta al mismo tiempo": nada de eso
tiene sentido cuando las dos opciones son igual de válidas. Ponerle cualquiera de esos
elementos —aunque sea "las dos en verde"— sería mentirle al jugador sobre la naturaleza
del juego, lo mismo que `BR-17` prohíbe para el resultado final aplicado un paso antes.

**Segundo, lo que sí hago — confirmación, no premio.** El botón tocado cambia de estado:
el borde pasa de `--borde` fino a `--linea` (3 px) en la tinta de la sección (§5), y el
relleno pasa de `--fondo-elevado` a el color de apoyo de esa misma tinta — **cambio de
tinta y de borde**, la alternativa que fija la tabla de `.claude/rules/diseno-marca.md`
para reemplazar cualquier micro-animación o rebote. El botón que no se tocó queda
exactamente como estaba — no se atenúa ni se oscurece, porque oscurecer la opción no
elegida se leería como "la perdedora", y acá no hay perdedora. Ningún elemento se anima:
el único movimiento decorativo del sitio entero es la mosca (`diseno-marca.md`), y esta
pantalla no lo necesita.

Los dos botones quedan momentáneamente sin poder tocarse (para que un segundo tap
accidental no cambie la respuesta) y, a los **~700 ms**, la pantalla pasa a la pregunta
siguiente sin necesitar un segundo gesto — un tap por pregunta, igual que "un tap por
decisión relevante" en cualquier otro juego del sitio. Es más rápido que el auto-avance
del quiz (1,2–1,6 s) porque no hay nada que leer después de tocar: no hay revelación, no
hay corrección, no hay sello de leyenda.

**Lo que de verdad sostiene la atención, entonces, no es el refuerzo por pregunta — es la
curiosidad por el resultado.** Es el mecanismo propio del género "test de identidad": nadie
sigue jugando un test de dos minutos porque cada pregunta lo premia, sigue jugando porque
quiere ver en qué cuadrante cae. Diez preguntas sin fricción, con feedback táctil apenas
suficiente para sentir que el toque "prendió", alcanzan.

**Si abandona a mitad de partida:** igual que `UX-01` — no hay guardado de sesión, al
volver arranca de cero en la Pantalla 0. No hay progreso que valga la pena persistir en
una sesión de dos minutos.

---

## 4. Pantalla final — Resultado (el corazón de esta tarea)

**Qué se ve, de arriba hacia abajo:**

1. **El nombre del cuadrante**, el elemento más grande de toda la pantalla — mismo
   principio de jerarquía que el puntaje en `UX-01`/`UX-02`, aplicado a texto en vez de a
   un número. En `--fuente-rotulada` (por qué esa fuente y no una de disco, ver §5),
   color de la tinta de sección. Presupuesto exacto en §7.
2. **El plano de los dos ejes, con el punto del jugador** — ver diseño abajo. Solo en esta
   pantalla, dentro del sitio; **nunca en la tarjeta compartible** (§6).
3. Una línea corta de descripción del cuadrante, registro 2 (`.claude/rules/
   voz-ricotera.md`: "el que cuenta"), redactada por `contenido`. Presupuesto en §7.
4. Botón primario, el más grande: **"COMPARTÍ"**.
5. Botón secundario, más chico, debajo: **"JUGÁ DE NUEVO"** (sortea un nuevo subconjunto
   de 5+5 sobre el pool de 20, según fija `US-06`).

### El plano — cómo evito que se lea como un ranking

Un plano cartesiano común (grilla 2×2 con eje X horizontal y eje Y vertical) tiene un
problema de lectura que no es solo teórico acá: **las dos filas de arriba quedan "más
arriba" que las dos de abajo**, y en cualquier interfaz "más arriba" tiende a leerse como
"mejor" — el mismo reflejo que hace que un ranking ponga el primer puesto arriba. Con
`luz` en el extremo de arriba y `oscuridad` en el de abajo, ese reflejo pondría a los dos
cuadrantes de `luz` por encima de los dos de `oscuridad`, y eso es exactamente lo que
`US-06` criterio 3 prohíbe.

**Por eso el plano no es un cuadrado derecho, es un rombo** (el cuadrado girado 45°, tipo
rosa de los vientos): los cuatro extremos de los ejes —`LUZ`, `OSCURIDAD`, `ORDEN`,
`CAOS`— caen en las cuatro puntas (norte, sur, oeste, este), y **los cuatro cuadrantes son
las cuatro caras del rombo entre punta y punta**, del mismo tamaño y con el mismo
tratamiento visual entre sí. Ninguno ocupa "la fila de arriba": los cuatro son esquinas
equivalentes alrededor de un centro, y el único punto verdaderamente arriba de todo es una
punta de eje (`LUZ`), no un cuadrante. Es un criterio propio de `experiencia`, sin ficha
detrás — no reclamo que sea así como Rocambole compondría un símbolo, solo que un rombo
sin filas resuelve el problema de lectura mejor que una grilla derecha.

**El punto del jugador** es un círculo sólido, centrado siempre en el medio de su
cuadrante — **nunca graduado según cuánto se inclinó** hacia un extremo u otro. Esto no es
solo estética: es la forma en que cumplo el criterio 3 de `US-06` ("no se muestra el
conteo exacto de respuestas por eje"). Si el punto se moviera según 3-contra-2 o 5-contra-0
dentro del cuadrante, estaría mostrando ese conteo por otra vía — un punto fijo en el
centro no filtra nada más que "caíste acá".

**Medidas de referencia** (para que quien lo construya no arranque de cero — el ajuste
fino de CSS es suyo, no mío):

| Elemento | Medida de referencia |
|---|---|
| Contenedor del plano | ~260×260 px, centrado |
| Rombo (cuadrado rotado 45°) | ~200×200 px antes de rotar |
| Etiquetas de extremo (LUZ/OSCURIDAD/ORDEN/CAOS) | `--fuente-rotulada`, ~0,75 rem, `--texto-tenue` (par ya testeado), una por punta, fuera del rombo |
| Relleno de cada cuadrante | `--disco-luzbelito-apoyo` parejo en los cuatro (nunca un tono distinto por cuadrante: distinguirlos por color sería reintroducir la jerarquía que el rombo evita) |
| Ícono por cuadrante | ~24 px, uno por cara, mismo tamaño y mismo tratamiento en las cuatro — brief en §5 |
| Punto del jugador | círculo sólido de 16 px, `--disco-luzbelito-tinta`, centrado en su cuadrante |
| Borde del rombo | `--linea` (3 px), `--borde` |

**Qué NO lleva el plano:** ningún número, ningún porcentaje, ninguna palabra como
"ganador" o "más" cerca de ningún cuadrante.

**Prioridad de scroll:** el nombre del cuadrante y los dos botones tienen que entrar sin
scroll en un viewport móvil chico (mismo criterio que la Pantalla 0 de `UX-01`, "nada de
scroll para encontrar el botón principal"); el plano puede quedar en una zona que sí
scrollea en pantallas muy chicas, porque es contenido de lectura adicional, no la acción
que hay que tomar — quien construya valida el tamaño real contra un viewport de referencia
(ej. 375×667).

---

## 5. Qué disco viste esta sección — `US-06` viste **Luzbelito**

`D-19` deja el mapa sección→disco en manos de `experiencia`. El mapa de hoy cubre portada
(Oktubre), historia (Gulp!), mitología (Lobo suelto), letras (La mosca y la sopa), discos
(Último bondi) y resultado del quiz (Gulp! + logo) — quedan **cinco** de las diez paletas
medidas por `RES-37` sin asignar a ninguna sección: *Un baión para el ojo idiota*, *¡Bang!
¡Bang! Estás liquidado*, *Cordero atado*, *Luzbelito* y *Momo Sampler*.

**Elijo Luzbelito.** Dos razones, y marco cuál es cuál:

1. **Criterio propio, sin ficha que lo respalde** (ninguna ficha de `investigador`
   describe el concepto del disco): *Luzbelito* es el diminutivo de *Luzbel*, es decir
   Lucifer — "portador de luz" que cae en la oscuridad. Es el único de los cinco discos
   libres cuyo propio nombre nombra la dualidad luz/oscuridad que es uno de los dos ejes
   exactos de este test. No lo verifico como hecho sobre la banda porque no hace falta
   para esta decisión: es una asociación de nombre, no una afirmación sobre la obra.
2. **Costo cero, y verificable ya mismo.** `--disco-luzbelito-tinta` (`#af9178`) y
   `--disco-luzbelito-apoyo` (`#69635c`) ya existen en `tokens.css` y el par
   `'Luzbelito sobre fondo'` ya está en la lista de `contraste.test.ts` (pasa AA, el
   comando de la §9 lo confirma). No agrego ningún hex nuevo ni ningún par nuevo al test.

**Por qué no reutilizo una de las cuatro categorías del quiz (Gulp!/Último
bondi/La mosca/Lobo suelto):** `US-06` no es una categoría de conocimiento (no mide
historia, discos, letras ni mitología, `PRD-alcance-v1.md` lo dice explícito) — vestirla
con una de esas cuatro paletas sugeriría un parentesco con esas categorías que no existe.
Un disco de los seis que ya visten otra sección tampoco: repetirlo diluiría la asociación
que ya construyeron esas seis pantallas.

**Sobre la tipografía de esta sección.** Ninguna de las tres fuentes fan digitalizadas
(`Oktubre Calco`, `Patricio Rey Fan`, `Lobo Suelto Fan`) corresponde a *Luzbelito* — no
existe un calco derivado de esa tapa. Por eso **todo el texto grande de esta sección va en
`--fuente-rotulada`** (Archivo Black), la que `diseno-marca.md` define como "repuesto de
todo". Esto además resuelve de raíz el aviso 5 de la tarea: como no hay una letra de disco
con el alfabeto recortado (`RES-42`/`RES-43`), **no hay ningún carácter con tilde o Ñ que
no pueda escribirse** en esta sección. `contenido` puede escribir los cuatro nombres de
cuadrante con acentos sin ninguna restricción tipográfica — la única restricción que le
dejo es de caracteres, no de alfabeto (ver §7).

**Sin tapas reales.** Esta sección no usa ningún jpg de `Docs/INVESTIGACION/TapasDiscos/`
— solo la paleta medida, igual que las cuatro categorías del quiz *antes* de que `D-21`
extendiera las tapas reales a toda pantalla. Por eso **no aplica ningún mecanismo de
crédito** (ni pie de página, ni sello de esquina de `UX-04`/`UX-05`): el crédito a
Rocambole solo hace falta cuando hay un recorte fotográfico real, y acá no lo hay. Si en
el futuro se agrega un detalle recortado real de la tapa de *Luzbelito* a esta sección, ahí
sí entra en el catálogo de `UX-05` y dispara el crédito — no es el caso de esta entrega.

**Brief de arte original para esta sección** (mismo formato que la tabla de `UX-04`):

| Pieza | Qué transmite | Dónde se usa |
|---|---|---|
| Ícono/motivo suelto de portada | Presentación del test, en la paleta de Luzbelito | Pantalla 0 |
| Cuatro íconos de cuadrante | Un ícono por cara del rombo, mismo tamaño y tratamiento entre sí — ningún ícono más grande, más central o más brillante que otro | Pantalla de resultado, plano |

Técnica sugerida: la misma de toda la tabla de `UX-04` (rodillo, serigrafía, grabado o
collage si es a mano; textura equivalente en digital). El usuario decide cómo se produce.

---

## 6. La tarjeta compartible — `UX-02` necesita variante, y acá está

Contesto la pregunta que dejó abierta `US-06` criterio 4: **`UX-02` no sirve tal cual.**
Está construida alrededor de un número corto ("7/8") que escala perfecto a cualquier
tamaño; acá el elemento central es un **nombre**, mucho más largo que tres caracteres, y
eso cambia el problema de raíz — sobre todo porque `UX-02` fija que la pieza tiene que
leerse "en menos de dos segundos" incluso en la miniatura chica de un timeline. Comparación
directa:

| Campo | `UX-02` (quiz) | `UX-06` (test de dos ejes) |
|---|---|---|
| Elemento más grande | Puntaje numérico ("7/8") | Nombre del cuadrante, texto de hasta 26 caracteres |
| Arte secundario | Tramo bajo/medio/alto — tres variantes **ordenadas** | Ícono del cuadrante — cuatro variantes **sin orden entre sí** |
| El plano de dos ejes | No existe | **Nunca en la tarjeta** — a escala de miniatura, la grilla y sus cuatro etiquetas quedan ilegibles, y eso rompe la regla de los dos segundos de `UX-02` antes de sumar nada nuevo. Vive únicamente en la pantalla de resultado dentro del sitio (§4) |
| Copy de desafío | *"¿Vos cuánto sacás?"* — compite en puntaje | *"¿Vos con cuál das?"* (ejemplo; redacción final `contenido`) — compite en curiosidad, no en número |
| Comparación al volver | *"vos: 8/8 — le ganaste a Fulano (7/8)"* | Nunca "ganaste"/"perdiste": *"vos también diste con {cuadrante}"* o *"vos diste con {cuadrante}, Fulano con {otro}"* — la misma frase neutra tanto si coincide como si no, para que ningún resultado se lea como el premio |
| Proporción de imagen | 1200×630 | 1200×630 — sin cambios |
| Qué NO muestra | pregunta, opción, dato personal, desglose por categoría | lo mismo, más: ningún cuadrante puede leerse como "más" o "mejor" que otro — ni por tamaño de letra, ni por posición, ni por brillo |

**Formato de la tarjeta (spec de diseño):**

| Propiedad | Valor |
|---|---|
| Proporción de la imagen | 1200×630, igual que `UX-02` |
| Jerarquía tipográfica | El nombre del cuadrante, en el tamaño más grande de toda la pieza; el resto, secundario |
| Contraste | Alto — tiene que leerse en miniatura de timeline, mismo estándar que `UX-02` |
| Qué muestra | Nombre del cuadrante, un ícono chico del cuadrante (§5), la marca del sitio, una línea corta de desafío |
| Qué NO muestra | El plano de dos ejes, cualquier pregunta u opción, cualquier dato personal, el conteo por eje |
| Texto del tweet prefil | Corto, con el nombre del cuadrante adentro y el link — ej. *"Caí en 'El farol del quilombo'. ¿Vos con cuál das?"* (redacción final `contenido`) |

**Camino de vuelta**, calcado del de `UX-02` con el cambio de contenido: toca el link →
cae en la Pantalla 0, Variante B → un tap arranca en la Pregunta 1 (el desafío tampoco
salta la primera pregunta acá) → juega su partida → en su propio resultado, la comparación
aparece como copy adicional (nunca de "ganar/perder", ver tabla arriba) → su propio botón
"COMPARTÍ" genera su propia tarjeta.

---

## 7. Presupuestos para `contenido` — cuánto banca cada pieza

| Pieza | Presupuesto | De dónde sale |
|---|---|---|
| Título de Pantalla 0 | ≤ 8 palabras | regla general de `voz-ricotera.md`, registro 1 |
| Bajada de Pantalla 0 | breve, registro 3, sin puntos suspensivos ni exclamación | `voz-ricotera.md` §5, §8 |
| Enunciado de cada pregunta | ≤ 14 palabras | oración mediana del corpus medido (13 palabras, rasgo 3.1) |
| Cada opción de respuesta (botón) | ≤ 5 palabras / ≤ 28 caracteres | que entre en una sola línea dentro del botón sin achicar la tipografía |
| **Nombre del cuadrante** | **≤ 26 caracteres, espacios incluidos, en 1 o 2 líneas** | más estricto que el techo general de 8 palabras de `BR-17`/`voz-ricotera.md`: es el elemento que además tiene que leerse en la miniatura de la tarjeta (§6), mismo criterio de los "dos segundos" que ya usa `UX-02` |
| Descripción corta del cuadrante (pantalla de resultado) | ≤ 36 palabras | párrafo mediano del corpus (rasgo 3.1) |
| Copy de desafío / tweet prefil | primera frase ≤ 8 palabras + link | `voz-ricotera.md`, botones y bajadas de casete |
| Copy de comparación al volver | plantilla neutra sin "ganaste"/"perdiste" | tabla de §6 |

---

## 8. Bloqueos que dejo anotados

- **El mapa sección→disco de `D-19`/`UX-04` no incluye todavía esta fila.** La decisión
  está tomada acá (§5: `US-06` = Luzbelito), pero `UX-04` es el archivo que aloja la tabla
  maestra y esta tarea me restringe a tocar solo `UX-06` — queda para una ráfaga futura que
  toque `UX-04` sumar la fila.
- **El orden en que se muestran las dos opciones de cada pregunta** (cuál cae arriba)
  puede sesgar a un jugador que responde siempre "la de arriba" hacia el mismo lado de
  cada eje. Sugiero alternar o sortear el orden por pregunta — la implementación es de
  `arquitectura`, no mía.
- El texto exacto de las 20 preguntas, sus 40 opciones, los 4 nombres de cuadrante y sus
  descripciones son de `contenido` (`CNT-09`), con los presupuestos de §7.
- El mecanismo de sorteo del subconjunto 5+5 por partida es de `arquitectura` (`CTR-08`,
  ya pedido en `US-06`).
- Cómo viaja el nombre del cuadrante compartido dentro del link (Variante B) es pieza
  técnica sin backend, análoga a la que `UX-02` ya dejó pendiente para el quiz.

---

## 9. Verificación

- **Ningún token nuevo, ningún par nuevo de contraste.** Reutilizo `--disco-luzbelito-tinta`
  y `--disco-luzbelito-apoyo` (ya en `tokens.css`), y el par `'Luzbelito sobre fondo'` ya
  está en `src/lib/contraste.test.ts` — pasa AA hoy. `--texto-tenue` sobre `--fondo`
  (contador de progreso, etiquetas del plano) también está testeado. Comando:
  `node --test src/lib/contraste.test.ts`.
- **Área de toque:** los dos botones de cada pregunta y los dos de la pantalla de
  resultado heredan la regla global de `tokens.css` (`--toque-min: 48px`, aplicada a todo
  `button`) — no hace falta un valor nuevo.
- **Voz:** título de Pantalla 0 ≤ 8 palabras, botones en voseo imperativo sin infinitivo
  ("EMPEZÁ", "COMPARTÍ", "JUGÁ DE NUEVO"), sin puntos suspensivos en ningún botón ni
  rótulo — verificable con `node --test src/lib/voz.test.ts` una vez que el copy real de
  `contenido` esté cargado.
- **Anti-slop:** sin pastilla cápsula, sin barra de acento a la izquierda, sin sombra
  difusa, sin degradado, sin animación de hover que infle — auditable a ojo contra la
  tabla de `.claude/rules/diseno-marca.md`, y a máquina con `estilos.test.ts` una vez
  construido.
