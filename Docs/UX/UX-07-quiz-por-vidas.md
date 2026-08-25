# UX-07 — El quiz por vidas: cabecera, escalón y retirada

> Rol dueño: `experiencia`. Consume `Docs/PRODUCTO/PRD-alcance-v1.md` (`BR-19` entero,
> `US-01` criterios 1, 2, 4, 5 y 6), `Docs/UX/UX-01-flujo-quiz.md` (lo que esta hoja
> reemplaza para este juego), `Docs/UX/UX-04-sistema-visual.md` (paleta y tipografía),
> `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md` y
> `src/scripts/partida.ts` / `src/styles/juego.css` (lo que existe hoy, para no
> rediseñar lo que ya funciona). `T-134`, ciclo 9.

**Resuelve:** `BR-19` apartados 1, 2, 3, 6 y 7 — la parte de "cómo se ve", no la
mecánica en sí, que ya está fijada por `producto`. Punto de partida: el quiz deja de
tener un "N de 8" fijo y pasa a jugarse con 3 vidas, tres escalones de dificultad que se
agotan enteros antes de subir, y tres desenlaces (derrota / victoria / retirada) en vez
de un tramo de puntaje.

**Qué NO cambia, para acotar el alcance de esta hoja:** la Pantalla 0 de entrada
(`UX-01`), el mecanismo de responder una opción, el feedback de acierto/error por
pregunta (`.opcion.es-correcta`/`.es-elegida`, verde/rojo + símbolo), el sello de
leyenda/testimonio y el botón `SEGUÍ` sin auto-avance. Todo eso sigue como está descrito
en `UX-01`. Lo que sigue es exclusivamente lo nuevo: la cabecera con vidas y escalón, el
botón de retirada, y las tres pantallas de resultado.

---

## 1. Las tres vidas en pantalla

### Dónde viven

Van en la cabecera de la pregunta (`pintarPregunta()`, hoy el `<div class="cabecera">`
que arma `.paso` + `.categoria` + `.insignia`), como el elemento de **mayor peso visual**
del grupo — más grande que la categoría, que sigue con el tratamiento chico que ya tenía.
Es el dato que más le importa al jugador en cada instante de la partida, y hoy no había
ningún dato de esa jerarquía ahí: `.paso` ("3 de 8") era orientación, no urgencia.

**Composición, de mayor a menor prioridad, en la misma fila con `flex-wrap` que ya
tiene `.cabecera`:**

1. **Vidas** (nuevo, ver abajo).
2. **Nivel** (nuevo, ver sección 2): "FÁCIL", "MEDIA" o "DIFÍCIL", con acento propio
   (nunca un disco de la mezcla, es un eje distinto de la categoría).
3. **Categoría** (existente, sin cambios: historia/discos/letras/mitología con su color
   de disco por `D-19`).
4. **Insignia de leyenda/testimonio** (existente, sin cambios, solo si aplica).

### Forma, no solo color — y la decisión de compartir tinta con el error

Tres marcas chicas, una por vida. Brief de arte para quien lo produzca: **tres sellos de
tinta imperfectos** (no círculos geométricos ni óvalo perfecto — la línea gruesa de
grabado que ya fija `UX-04`), del tamaño de una letra mayúscula, con la palabra "VIDAS"
al lado (texto corto, no un ícono solo: la primera vez que alguien ve la cabecera, antes
de perder ninguna, el conjunto ya se lee como "esto cuenta algo que tengo tres de",
sin necesitar una pantalla de instrucciones — el molinete sigue abierto).

- **Vida intacta:** sello lleno, tinta `--texto`.
- **Vida perdida:** el mismo sello, atravesado por el mismo trazo `✕` que ya usa
  `.opcion.es-elegida` para la opción marcada mal — no un símbolo nuevo, una extensión
  del mismo símbolo funcional ya testeado — y recoloreado a `--acento-4`.

**Por qué comparte tinta con el error, a propósito.** `BR-19` apartado 1 es explícito:
la única acción que cuesta una vida es responder mal. No hay una segunda vía, no hay
tiempo que corra, no hay nada más que reste. Vida perdida y error **son el mismo evento
en el mismo instante**, nunca dos señales independientes que puedan leerse distinto — así
que uso el mismo `--acento-4` que ya es "error, reservado" en `tokens.css`. Descarté un
tono propio para las vidas (por ejemplo un tercer acento) porque hubiera introducido una
distinción que no existe en la mecánica: sugeriría que hay dos formas de perder una vida
cuando hay exactamente una.

La forma (lleno → tachado) y el texto ("VIDAS", visible siempre, no solo en el momento
del cambio) hacen que el estado nunca dependa solo del color — cumple el mismo principio
que ya exige el checklist de `UX-01` para acierto/error.

### El momento exacto del cambio

Tiene que verse **cuando pasa**, no solo quedar reflejado la próxima vez que se mire la
cabecera. Ocurre en el mismo instante en que `responder()` ya sabe que la respuesta es
incorrecta — el mismo momento en que hoy aparece el panel de feedback rojo (`.feedback.no`)
y se pinta `.opcion.es-elegida`. Tres cosas cambian juntas, en el mismo tick:

1. La opción tocada se pinta de rojo (ya existe).
2. El sello de vida correspondiente pasa de lleno a tachado (nuevo).
3. La región viva (`role="status"`, ya existe para el feedback) anuncia también la vida
   perdida en la misma locución — algo del orden de "van 2 vidas" antes o después del
   micro-copy de error, para que quien usa lector de pantalla se entere en el mismo golpe
   que quien ve la pantalla, no en una región separada que compita por su atención.

No hay transición animada más allá de la que ya usan los botones (`transition:
border-color 120ms` — cambio de color simple, sin rebote, sin glow): la regla anti-slop
veta el "micro-rebote", y acá no hace falta uno para que el cambio se note, porque pasa
en el mismo momento que ya tiene toda la atención del jugador (acaba de tocar una
opción y está mirando el resultado).

### Al arrancar la partida

Tres sellos llenos, "VIDAS" al lado, sin necesitar explicación aparte. Es la misma lógica
que ya usa el resto del sitio para no interrumpir con una pantalla de instrucciones: el
widget se explica solo la primera vez que cambia.

---

## 2. El cambio de escalón

Dos piezas, no una: una etiqueta que está siempre y un aviso que aparece una sola vez por
salto. Ninguna de las dos pide un tap extra ni corta el ritmo de responder.

### La etiqueta ambiente (siempre presente)

Reemplaza a `.paso` ("3 de 8", que dejó de tener sentido sin ronda fija). Formato:
**`{NIVEL} · {posición dentro del escalón}/{tamaño del escalón}`** — por ejemplo "MEDIA ·
4/15". Es el mismo patrón familiar que ya tenía `.paso` (un contador "X de Y"), pero
acotado al escalón actual en vez de al banco entero: da orientación local (cuánto llevo
de este tramo) sin exponer, pregunta a pregunta, que ganar significa llegar a la 40 — eso
queda reservado para el momento en que sí importa (la confirmación de retirada y las tres
pantallas de resultado, sección 3 y 4). Tratamiento visual chico y neutro, igual que
`.categoria` hoy (`--texto-tenue`, sin fuente rotulada): es información ambiente, no un
festejo.

**Ojo con la ortografía, mismo problema que ya resolvió `etiquetaCategoria()`:** "FÁCIL"
y "DIFÍCIL" llevan tilde y el valor crudo del nivel en el banco (`facil`/`dificil`) no la
trae. Hace falta la misma tabla de etiquetas que ya existe para categoría, no imprimir el
enum tal cual — si no, se repite el defecto que ya se corrigió una vez con "MITOLOGIA"
sin tilde.

### El aviso puntual (una vez por escalón, no siempre)

Ocurre exactamente en la primera pregunta de un escalón nuevo — la número 11 (entra a
Media) y la número 26 (entra a Difícil), según los tamaños de hoy (`BR-19` apartado 2).
Es una tarjeta chica, con el mismo lenguaje visual que ya usa `.sello` (borde propio,
`--fuente-rotulada` para la línea corta), ubicada **arriba del enunciado**, entre la
cabecera y la pregunta — se lee de pasada, antes de la pregunta, sin exigir un toque para
cerrarla ni una pantalla nueva.

- **Color:** `--acento-2` (oro, "destaque y foco" en `tokens.css`) **solo en el borde y
  en el símbolo**, nunca como color de relleno del texto — el texto de la tarjeta va en
  `--texto` sobre `--fondo-elevado`, que ya es un par testeado (`contraste.test.ts`,
  "texto sobre fondo elevado"). Usar `--acento-2` como tinta de texto sobre
  `--fondo-elevado` sería un par sin testear; usarlo de borde sigue el mismo patrón que
  ya acepta el código de hoy en `.feedback.ok`/`.feedback.no` (borde teñido por el
  estado, texto en la tinta base).
- **Por qué `--acento-2` y no otro acento:** no es acierto (`--acento-3`, exclusivo), no
  es error (`--acento-4`, exclusivo y ya usado por las vidas), no es un disco de la
  mezcla (el nivel es un eje distinto de la categoría, `D-19` no lo cubre). `--acento-2`
  es el que `tokens.css` ya describe como "destaque", que es exactamente la función de
  este aviso: llamar la atención una vez, sin competir con acierto ni con error.
- **Aparece una sola vez por escalón** — en la pregunta 12 (segunda de Media) ya no está;
  la etiqueta ambiente de la cabecera sigue diciendo "MEDIA" en silencio. Evita el "cartel
  gigante" permanente que ya rechazó `UX-01` para el rótulo de leyenda, aplicando el
  mismo criterio acá.
- **Texto:** corto, registro 1 o 3 según decida `contenido` (`CNT-10`) — acá solo fijo
  que entra en una línea, arriba del enunciado, sin puntos suspensivos si es un rótulo
  (`.claude/rules/voz-ricotera.md`, sección 5).

### Qué NO hago, y por qué

- **No uso una pantalla intermedia ("¡Subiste de nivel!").** Cortaría el ritmo que
  esta misma tarea pide no cortar: sería una pantalla más entre "toqué SEGUÍ" y "veo la
  próxima pregunta", justo lo que el sitio evita en todos lados.
- **No animo el cambio de la etiqueta ambiente** (parpadeo, escala, rebote): la regla
  anti-slop lo veta y no hace falta — el aviso puntual ya cumple el trabajo de "que se
  note", la etiqueta ambiente solo tiene que quedar correcta después.

### Costo en el presupuesto de tiempo

Dos apariciones por partida completa como máximo (una por cada salto de escalón), cada
una una línea corta de lectura pasiva. Contra la tabla de duración de `BR-19` apartado 7
(~4:25 al fin de Fácil, ~11 min a Media, ~18:40 a Difícil agotado), esto no mueve la
aguja — es el mismo orden de magnitud que ya asumía `UX-01` para el sello de
leyenda/testimonio, y ahí ya se midió que entraba con margen.

---

## 3. La retirada voluntaria

Es el punto más delicado de esta tarea: tiene que estar siempre disponible y no competir
con `SEGUÍ`, ni en el espacio de la pantalla ni en la facilidad del gesto.

### Dónde vive el disparador

**Una esquina superior, fija en todas las pantallas de la partida** (antes y después de
responder, con o sin escalón nuevo) — no en la cabecera junto a vidas/nivel/categoría, y
no en el tercio inferior donde viven las opciones y `SEGUÍ`. Es una tercera zona,
deliberadamente separada de las otras dos:

- El tercio inferior (zona pulgar) es today para la decisión de juego: opciones,
  `SEGUÍ`. Ahí no entra nada más.
- La cabecera es para informarse (vidas, nivel, categoría).
- La esquina superior, lejos del pulgar cuando el celular se sostiene con una mano, es
  para la única acción que **no** es parte del ritmo de juego.

Esa distancia física ya es la primera fricción, sin costar un tap extra: llegar ahí pide
estirar el pulgar o usar la otra mano, en vez de estar a mano en el gesto que ya se repite
en cada pregunta.

**Forma:** un enlace de texto chico, tono `--texto-tenue` (igual de discreto que
`← Volver al arcade` en el resultado de hoy), **no un ícono solo** — un símbolo sin
palabra invita a interpretarlo mal, y esto es justo lo que no puede pasar por accidente.

### El tamaño de toque, invisible pero real

Visualmente chico, pero con área de toque de `--toque-min` (48×48 px) igual que
cualquier otro control — la discreción es de contraste y tamaño de letra, no de zona
tocable: alguien con motricidad reducida tiene que poder acertarlo igual que cualquier
botón grande.

### La confirmación de dos pasos, y por qué no es un tap directo

Tocar el enlace **no retira la partida**: abre una tarjeta de confirmación, en el mismo
lugar donde estaba la pregunta (mismo mecanismo de `zonaPartida.replaceChildren()` que ya
usa el código para cambiar de pantalla dentro de la partida, sin sumar una cuarta sección
además de portada/partida/resultado). La tarjeta muestra:

- Un texto corto preguntando si se quiere salir (registro y palabras de `CNT-10`).
- **La misma foto de "hasta dónde llegaste" que va a la pantalla de resultado**: pregunta
  alcanzada sobre el total del banco, nivel actual, vidas que quedan. Es la única
  pantalla de la partida donde **sí** muestro el número sobre 40 — acá, y solo acá,
  importa que el jugador sepa cuánto le falta antes de decidir si corta.
- Dos botones, del mismo tamaño de toque que cualquier otro de la partida:
  - **Primario, el más grande:** volver a jugar (cierra la tarjeta, la pregunta sigue
    intacta, no se gastó nada — ni vida, ni intento, ni avance).
  - **Secundario, más chico:** confirmar la retirada, con el acento `--acento` (naranja)
    que también viste la pantalla de resultado de retirada (sección 4) — el mismo hilo de
    color entre "esto es lo que vas a ver" y la decisión de verlo.

**Por qué dos toques y no uno.** Es exactamente la tensión que plantea esta tarea: un
botón a mano de más retira gente sin querer, uno escondido no cumple su función. La
salida que uso reparte el costo entre distancia física (la esquina, lejos del pulgar) y
un paso de confirmación explícito con datos concretos delante — nadie se retira por un
toque perdido, y nadie que quiera retirarse de verdad tarda más de dos toques en
lograrlo. Es la única fricción de dos toques que agrega esta hoja, y la reservo para una
acción que termina la partida de forma irreversible — algo que nunca antes existía en el
sitio, porque antes la partida siempre terminaba sola.

**Descarté** un solo tap con deshacer breve (tipo "te retiraste, deshacer" por unos
segundos): pide un timer con el que ya hay mala experiencia en este mismo proyecto
(`UX-01` sacó el auto-avance por temporizador, `WCAG 2.2.1`) y resuelve peor el problema
que un paso de confirmación sin reloj.

### Qué pasa si cancela / si confirma

- **Cancela ("seguí jugando"):** vuelve exactamente a la pregunta en la que estaba, sin
  perder nada — ni una vida, ni el intento de responder, ni el escalón.
- **Confirma:** va directo a la pantalla de resultado de retirada (sección 4). No hay
  paso intermedio ni explicación pendiente que mostrar — a diferencia de perder la
  tercera vida (`US-01` criterio 2, continuidad), acá no hay una respuesta que ya se dio
  y que el jugador necesite ver antes de cerrar: se retira antes de responder, o —si venía
  de tocar la esquina mientras leía el feedback de la última respuesta— ya tuvo ese
  panel completo delante suyo antes de tocar "salir".

### Disponibilidad: desde la pregunta 1 hasta el final

El disparador es un elemento fijo de toda la pantalla de partida (`zonaPartida`), no algo
que aparezca a partir de cierto punto — está en la primera pregunta igual que en la
última, tal como pide `US-01` criterio 6. No hace falta una condición para mostrarlo:
simplemente vive ahí siempre que la partida está en curso.

---

## 4. Las tres pantallas de resultado

Reemplazan a la única pantalla de resultado de `UX-01` (`aciertos/8` + tramo de tres
niveles) para este juego. Los tres desenlaces son estados distintos, no una escala —
`BR-19` apartado 6 lo dice explícito: "de los tres solo la derrota se presenta como algo
que salió mal".

### Lo que comparten los tres

Mismo layout base que ya tiene `pintarResultado()` hoy, con el bloque de datos ampliado:

1. **Un número grande** ("hasta dónde llegaste"): pregunta alcanzada sobre el total del
   banco — mismo tratamiento tipográfico que el `.puntaje` de hoy (`--fuente-rotulada`,
   el número más grande de la pantalla).
2. **El encabezado que canta** (registro 1, `CNT-10`): la línea corta y coloreada según
   el desenlace — es la que hoy hace `.tramo`, con el color que le toca a cada uno (ver
   abajo). Por la regla de las dos líneas de `voz-ricotera.md` ("en el resultado, canta
   el encabezado y nombra el puntaje"): el número de arriba nombra, el título de abajo
   canta.
3. **El nivel alcanzado** (Fácil/Media/Difícil), chico, junto al número — misma etiqueta
   ambiente que ya usa la cabecera de la pregunta, para que el jugador reconozca el
   mismo dato que venía viendo.
4. **Aciertos sobre respondidas**, dato secundario y chico (`--texto-tenue`), **ya no
   determina ningún color ni título** — `BR-19` apartado 5 lo saca de esa función.
5. Los mismos tres elementos de siempre: `COMPARTÍ` (primario), `JUGÁ DE NUEVO`
   (secundario), la salida al arcade (`← Volver al arcade`).

### Victoria

- **Color del encabezado:** `--acento-3` (verde) — el mismo tono que ya usaba
  `.tramo--alto` para el mejor resultado posible del sistema viejo. No es un color
  nuevo puesto sobre un concepto nuevo: es la misma asociación que el sitio ya tenía
  entre "verde" y "el mejor desenlace posible", extendida de un tramo de puntaje a un
  desenlace completo — coherente, no una reinterpretación de qué significa `--acento-3`.
  No es "disfrazar el acierto de un disco": es la misma familia semántica (lo que salió
  bien), nunca la paleta de una tapa.
- **Símbolo:** reusa `✔`, el mismo que ya marca la opción correcta en cada pregunta —
  agotar el banco sin perder es, literalmente, la suma de puros aciertos sostenidos.
- **No lleva el widget de vidas.** Siempre queda al menos una (`BR-19` apartado 6, punto
  4): mostrarlo agregaría un dato constante, sin información.

### Derrota

- **Color del encabezado:** `--acento-4` (rojo, el mismo del error) — es el único de los
  tres que `BR-19` pide presentar como "algo que salió mal", así que es el único que usa
  el color reservado exclusivamente para eso.
- **Símbolo:** reusa `✕`, el mismo que marca la opción elegida cuando se falla.
- **No lleva el widget de vidas** (siempre en 0 — apartado 6, punto 4): mostrar tres
  sellos tachados bajo un título ya rojo sería redundante y no agrega nada que el
  jugador no sepa.

### Retirada

- **Color del encabezado:** `--acento` (naranja) — ni el verde de victoria ni el rojo de
  derrota. Es el mismo tono que usaba `.tramo--medio` en el sistema viejo, reaprovechado
  acá con un sentido parecido: un desenlace de por medio, sin veredicto.
- **Sin símbolo.** Ni `✔` ni `✕` describen "me fui por mi cuenta" sin mentir sobre el
  desenlace — forzar un símbolo nuevo acá pediría un brief de arte que esta tarea no
  tiene alcance para resolver (queda anotado en bloqueos). El color distinto más el
  título distinto (registro 1, `CNT-10`) ya alcanzan para que no se lea como color
  aislado: son dos señales, no una.
- **Único desenlace que lleva el widget de vidas** (`BR-19` apartado 6, punto 4): reusa
  el mismo grupo de sellos lleno/tachado + "VIDAS" que ya se vio durante la partida —
  mismo componente, no uno nuevo, así el jugador reconoce de un vistazo el mismo dato que
  venía mirando arriba.

### Qué NO muestra ninguna de las tres (heredado de `UX-02`, sigue vigente)

Ninguna pregunta, ninguna opción, ningún desglose por categoría, ningún dato personal.
`UX-02` ya fija esto para la tarjeta compartible y sigue aplicando tal cual — lo que
cambia acá es el dato agregado que se comparte (desenlace + hasta dónde + aciertos +
vidas si retirada), no las reglas de qué nunca se expone.

---

## Checklist — accesibilidad (agregado de esta hoja sobre el de `UX-01`)

- [ ] Cada vida se distingue por forma (lleno/tachado) y por texto ("VIDAS" + la
      palabra), nunca solo por el color `--texto`/`--acento-4`.
- [ ] La pérdida de una vida se anuncia en la misma región viva (`role="status"`) que ya
      anuncia acierto/error, en la misma locución — no una región aparte.
- [ ] El cambio de escalón es legible sin depender del color del aviso puntual: el
      texto de la tarjeta dice a qué nivel se entra, no solo lo insinúa con el borde.
- [ ] El disparador de retirada cumple `--toque-min` (48×48 px) aunque se vea chico.
- [ ] La confirmación de retirada tiene dos botones de tamaño de toque completo, con
      separación suficiente para no tocar el equivocado con una sola mano.
- [ ] Ningún desenlace de resultado se distingue solo por color: cada uno tiene además
      un título con palabras distintas, y victoria/derrota además un símbolo distinto.
- [ ] Ninguna transición de esta hoja (vida, escalón, apertura de la confirmación) usa
      un efecto vetado por `.claude/rules/diseno-marca.md` (glow, rebote, blur).

## Checklist — primera pantalla sin muro (repaso)

Sin cambios de fondo respecto de `UX-01`: la Pantalla 0 no se toca. Lo único que agrega
esta hoja al criterio de "sin muro" es que **el disparador de retirada está visible desde
la primera pregunta**, no aparece recién en algún punto avanzado — así nadie queda
obligado a un tramo largo antes de poder cortar con dignidad (`BR-19` apartado 7).

---

## Pares de color: ninguno nuevo

Todos los usos de esta hoja reutilizan tokens que ya están en `contraste.test.ts`:

| Uso nuevo | Token | Par ya testeado |
|---|---|---|
| Vida intacta (texto/sello) | `--texto` | "texto sobre fondo", "texto sobre fondo elevado" |
| Vida perdida (sello + anuncio) | `--acento-4` | "error sobre fondo" |
| Etiqueta ambiente de nivel | `--texto-tenue` | "texto tenue sobre fondo" |
| Aviso puntual de escalón (borde/símbolo, no texto) | `--acento-2` | "acento-2 sobre fondo" — se usa como borde, no como tinta de texto, mismo patrón que `.feedback.ok`/`.feedback.no` con `--acento-3`/`--acento-4` |
| Encabezado de victoria | `--acento-3` | "acierto sobre fondo" |
| Encabezado de derrota | `--acento-4` | "error sobre fondo" |
| Encabezado de retirada, botón de confirmar retiro | `--acento` | "acento sobre fondo" |

No pido agregar ningún par nuevo a `contraste.test.ts`. Sugerencia opcional, no
bloqueante: si `revisor` quiere más rigor, un test que confirme que "vida intacta" y
"vida perdida" se distinguen entre sí (`--texto` contra `--acento-4`) sería el mismo
patrón que ya existe para "los rótulos de leyenda y testimonio se distinguen entre sí" —
no hace falta ningún color nuevo para escribirlo.

---

## Trazabilidad — qué de `UX-01` queda superado para este juego

`UX-01` sigue vigente para la Pantalla 0 de entrada y para todo lo que `US-04` herede de
sus tramos de resultado (`BR-19` apartado 5 se los deja disponibles a ese juego). Para
`US-01`, esta hoja reemplaza en la práctica dos secciones de `UX-01`: "Pantallas 1..N —
Pregunta" en la parte que describía `.paso` como "N de 8", y "Pantalla final —
Resultado" entera. No edito `UX-01` en esta tarea porque el alcance que me dieron es un
archivo nuevo — queda anotado para que quien la actualice (posible tarea futura) sepa qué
reemplazar y con qué.

## Bloqueos que dejo anotados

- **El texto exacto de todo lo nuevo** (el aviso de escalón, el disparador de retirada,
  la confirmación, los tres encabezados de resultado) es de `contenido` (`CNT-10`,
  `T-136`). Acá solo fijé estructura, ubicación y comportamiento.
- **El payload del link compartido** para los tres desenlaces es de `arquitectura`
  (`ADR-02`, `T-132`) — dejo dicho qué datos tiene que poder representar cada uno en la
  sección 4, pero no el formato del link en sí.
- **Un símbolo propio para "retirada"** (si en algún momento se quiere uno, en vez de
  dejarlo sin símbolo) necesita un brief de arte nuevo, coherente con el lenguaje de
  Rocambole — no lo resuelvo en esta tarea porque no había pedido de crear una pieza
  nueva, y esta hoja ya cubre el estado sin necesitarla.
- **`UX-01` queda con una sección desactualizada** (el "N de 8" y el tramo de tres
  niveles, para el caso puntual del quiz) — no la edito por estar fuera del alcance de
  `T-134`, pero queda escrito arriba, en "Trazabilidad", qué reemplazar cuando alguien
  la retome.
