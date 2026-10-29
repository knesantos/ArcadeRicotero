# UX-32 — Ganar se ve: la puerta abierta, y un solo toque para seguir

> Rol dueño: `experiencia`. Ciclo 16, ráfaga 4, 2026-09-24 (`T-289`).
>
> **Cierra el traspaso**
> `Docs/SUGERENCIAS/HILO-para-experiencia-ganar-no-se-ve-la-puerta-no-tiene-dibujo-abierto.md`
> (lo que midió `T-278`: con la isla dibujando por atlas, `sala.v1` no tiene la puerta
> abierta y hoy ganar no cambia nada en el área). Decide los dos puntos que dejaba abiertos
> —cómo se ve ganar, y si hace falta un aviso de lector de pantalla— y responde al punto 3,
> la aparente contradicción entre `CTR-16.4` y `UX-29 §8`.
>
> **Consume:** `Docs/UX/UX-27-la-convencion-del-pixel.md` §1.1 (las tres capas del borde),
> §4.1.2 (la puerta sin tinta propia, dibujada por forma con `--px-clave`/`--px-luz`), §5.1
> (ningún texto adentro del área, sin excepción) y §5.2 (todo se distingue por contorno y
> forma, nunca solo por color); `Docs/UX/UX-28-la-pantalla-y-las-dos-puertas.md` §3 (de
> frente = esperando, de perfil = en juego) y §2.5 (la tabla de sobrante de alto, 51 px CSS
> en el peor caso horizontal); `Docs/UX/UX-29-el-fracaso-no-es-la-muerte.md` entero, en
> particular §3 (nada se mueve para llamar la atención sobre sí mismo), §6 (la tabla de lo
> prohibido) y §8 (*"los dos llegan a la puerta y la puerta se abre. Eso es todo lo que
> pasa"*); `Docs/UX/UX-31-los-seis-niveles.md` §5 (la familia de tinta y el mecanismo de
> lectura de los cuatro mecanismos, que la puerta hereda); `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`:
> `BR-23` (la paridad, y *"el juego no se apoya en ningún vínculo sentimental... ni por una
> animación de festejo al llegar juntos a la puerta"*), `BR-24` punto 5 (*"el fracaso no
> toma prestado el grito del acierto"*), `BR-26` (el pie de homenaje, que no se toca),
> `BR-27` (qué se comparte al terminar el piso, todavía sin cerrar), `US-09` criterio 1
> (*"pasar al siguiente no cuesta más de un toque"*, hoy enmendado por `D-47`/`BR-31` — ver
> el aviso de abajo); `Docs/DECISIONES.md`: `D-32` límite 3
> (0 ms hasta que la acción principal es tocable), `D-33` (el acierto es el único grito del
> sitio, con su propio techo y su propia lista de a quién no le aplica), `D-38` baranda 3
> (nada narra la relación real), `D-42` (los muñecos tienen cara), `D-17` (voseo, sin
> infinitivo); `Docs/ARQ/ARQ-schema-niveles.md` `CTR-16.4`/`CTR-16.5` regla 2 (*"una puerta
> no se abre: se llega"*) y `CTR-16.10.8` (el estado lo dice la presencia, no un cambio de
> tinta); `src/lib/skayboy/escena.ts` (`TILES_DE_LA_SALA`, `tileDe()`, el comentario que
> deja el hueco escrito), `src/lib/skayboy/mundo.ts` (`terminado`, `enPuerta`, el reloj que
> se congela al ganar), `src/scripts/partida-skayboy.ts` (leído: hoy los `pointerdown`/
> `pointerup` están atados a los botones del mando, nunca al `canvas`).
>
> **Resuelve:** qué se ve en el área al ganar (`§2`), qué hace cada muñeco (`§3`), si el
> "grito" de `D-33` aplica acá (`§4`, no aplica), y cómo se pasa al siguiente nivel en un
> toque (`§5`). **No resuelve:** el píxel final de la puerta abierta (`T-290`, `D-44`: lo
> dibuja el hilo principal, como código), las palabras del aviso de lector de pantalla
> (`contenido`, traspaso ampliado en
> `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md §6`), ni qué se comparte al
> pasar el piso entero (`producto`, ya diferido por `UX-28 §7` y `BR-27`).

> **Enmendado el 2026-09-24 por `D-47`/`BR-31`, construido en detalle por
> `Docs/UX/UX-33-pantalla-completa-y-victoria.md §2`.** El mismo día, en otra ráfaga, el
> usuario pidió una pantalla de victoria bailada; `producto` la subió a criterio de `US-09`
> en `BR-31`, y enmendó `BR-23` para admitirla sin abrir la puerta al vínculo de pareja que
> sigue prohibido. Eso mueve el piso de dos secciones de este documento —la frase de `§1` y
> el párrafo de `§3` sobre la pose de frente— sin tocar el resto: la puerta que cambia de
> forma (`§2`), por qué el grito de `D-33` no aplica (`§4`) y el toque para seguir (`§5`)
> siguen exactamente como están escritos acá. Cada banner de abajo marca el punto exacto;
> donde este documento y `UX-33` parezcan decir cosas distintas, manda `UX-33`.

---

## 1. La decisión, en una línea

> **La puerta se abre, en forma, no en tinta. Los dos muñecos quedan de frente, sin
> tocarse. Nada más se mueve. Y para seguir alcanza con tocar donde ya está mirando.**

> **Enmendado el 2026-09-24 por `D-47`/`BR-31`.** "Los dos muñecos quedan de frente... nada
> más se mueve" ya no es el cuadro final: `BR-31` agrega una pantalla de victoria donde los
> dos personajes bailan, y `UX-33 §2.1` dice con precisión qué cambia. Lo que sigue de esta
> línea, sin tocarse: la puerta se abre por forma (`§2`), y para seguir alcanza con tocar
> donde ya está mirando (`§5`). El criterio vigente sobre los cuerpos es `UX-33 §2`.

No hace falta dibujar un festejo para que se entienda que se ganó: alcanza con que la única
pieza del área que puede leerse como "cerrado/abierto" —la puerta— cambie de forma. Es el
mismo principio que ya rige toda la sala (`UX-27 §5.2`): el estado se lee por forma y
contorno, nunca por color. Acá no hace falta inventar una convención nueva: hace falta
terminar la que ya estaba prometida en palabras.

---

## 2. El área: la puerta cambia de forma, y es lo único que cambia

### 2.1 Qué venía prometiendo la convención, sin cumplirlo

`UX-27 §4.1.2` ya lo dejó escrito el 2026-09-23, antes de que nadie mirara si el código lo
hacía: *"la cima abierta de la puerta contra el marco cerrado se lee por forma, no por
color, igual que el resto del área"*. Esa frase da por sentado que existen dos formas.
`T-278` mostró que solo existe una: `sala.v1` tiene `puertaSkayboy` y `puertaPoligirl`, y
las dos son el estado cerrado (`escena.ts`, `tileDe()`, caso `'puerta'`, con el comentario
que deja el hueco escrito a propósito, citando este traspaso). Esto no agrega una decisión
nueva: **cierra la que ya estaba tomada en palabras y nunca se dibujó.**

### 2.2 Los tiles nuevos, con precisión

| Qué | Cuántos | Nombre sugerido (el identificador final es de quien dibuja, `D-44`) | Cuadros |
|---|---|---|---|
| Puerta de Skayboy, abierta | 1 | `puertaSkayboyAbierta` | 1, estático |
| Puerta de Poligirl, abierta | 1 | `puertaPoligirlAbierta` | 1, estático |

Las dos cerradas (`puertaSkayboy`, `puertaPoligirl`) no se tocan: siguen siendo el estado
por defecto. Si a quien dibuje le resulta más prolijo renombrarlas a
`puertaSkayboyCerrada`/`puertaPoligirlCerrada` —la simetría que ya tienen
`compuertaCerrada`/`compuertaAbierta`—, es un cambio de nombre sin costo de diseño; no lo
exijo, queda a su criterio.

**Sin tinta nueva.** Las cuatro (dos cerradas, dos abiertas) siguen dentro de los dos
colores fijos, `--px-clave` y `--px-luz` (`UX-27 §4.1.2`): el área sigue en 15 tintas, esta
tarea no le pide una 16.

**La forma, no el píxel exacto** —eso es de quien dibuja, igual que con los cuatro
mecanismos: *"esta tabla fija la familia de tinta y el mecanismo de lectura, no el píxel
final"* (`UX-31 §5`):

- **Cerrada** se lee como un vano tapiado: la silueta remata arriba en un dintel sólido de
  `--px-clave`, de la misma familia que un sólido — es el estado que ya existe.
- **Abierta** es la misma silueta con el dintel retirado: donde había clave sólida arriba
  del vano, ahora hay `--px-luz` (aire) hasta el borde del tile. No es una puerta que se ve
  "distinta": es la misma puerta con el tapón sacado, igual que una compuerta llena contra
  una compuerta recogida (`CTR-16.10.8`).
- Contorno de 1 px lógico en la clave, sin excepción, en las dos formas (`UX-27 §5.2`).

### 2.3 Cuándo cambia, y qué NO hace al cambiar

**Trigger: `mundo.terminado === true`.** No hay un estado intermedio por puerta — no existe
"mi puerta ya se abrió, la del otro todavía no". Las dos puertas cambian **en el mismo
paso**, porque `terminado` ya es un único booleano global que pasa a `true` cuando los dos
cuerpos están `enPuerta` a la vez (`mundo.ts`, `jugarTic`). No hace falta lógica nueva para
que las dos se abran juntas: alcanza con que `tileDe()`, caso `'puerta'`, mire
`mundo.terminado` en vez de mirar solo `t.de`.

**Sin transición.** Un cuadro, un estado; el cuadro siguiente, el otro estado. Sin bisagra
que gire, sin cuadro intermedio, sin fundido. Es la misma gramática que ya rige palanca,
placa y compuerta (`CTR-16.10.8`: *"el estado lo dice la presencia, no un cambio de
tinta"*) y es la lectura más literal de `D-32`: nada se mueve para llamar la atención sobre
sí mismo, ni siquiera durante 400 ms.

**Sin sonido de apertura nuevo.** El efecto `puerta` que ya suena al ganar —gateado por la
cinta, según dejó anotado `T-278`— no cambia: es un efecto corto, de la misma familia que
el resto de los efectos del juego, y no es el tratamiento reservado que protege `D-33`
(`§4`).

---

## 3. Los dos muñecos: de frente, quietos, sin tocarse

> **Enmendado el 2026-09-24 por `D-47`/`BR-31`, y construido en detalle por
> `UX-33 §2`.** Esta sección fijaba el cuadro final como la pose de frente, quieta. Ya no:
> `BR-31` agrega la victoria bailada como criterio de `US-09`, y en el cuadro en que
> `mundo.terminado` pasa a `true` los dos cuerpos arrancan a bailar en vez de congelarse.
> **El argumento de esta sección no se cae, se traslada**: todo lo que sigue —por qué la
> pose sola no bastaba, y sobre todo la tabla de lo prohibido— vale igual leyendo "bailan,
> cada uno el suyo" donde dice "de frente" y "quietos" (`UX-33 §2.6` agrega una fila:
> tampoco comparten paso ni movimiento coordinado). El criterio vigente es `UX-33 §2`.

**Los dos quedan en la pose de frente** (`enPausa` en el atlas), la misma que ya usa el que
espera sin dedo encima (`UX-28 §3`). No hace falta dibujar una pose nueva.

Conviene forzarla **aunque el que llegó último todavía tenga un dedo encima de su
columna**: sin esto, el segundo en llegar podría quedar congelado en `quieto` (perfil) el
mismo cuadro en que se gana, y el cuadro de la victoria mostraría a uno de frente y al otro
de perfil — una asimetría que no dice nada, pero que se ve como una. El mecanismo ya existe
en el código (`estadoDelCuerpo(c, deFrente)`, el mismo booleano que hoy fuerza el cuadro de
frente al volver de un fallo, `UX-29 §3`): se reutiliza sin agregar un tercer estado.
Mientras `mundo.terminado` sea `true`, los dos cuerpos se dibujan con `deFrente = true`, sin
importar `conDedo`.

**Por qué la pose sola no alcanza, y por qué no hace falta que alcance sola.** El traspaso
preguntaba si un muñeco en pausa se lee como "llegó" o como "se trabó" — tiene razón en
dudarlo: de frente y quieto es, literalmente, el mismo dibujo que "estoy esperando a que el
otro llegue". Lo que saca la ambigüedad no es la pose: es que **al mismo tiempo la puerta
cambió de forma** (`§2`). Un muñeco de frente con la puerta cerrada detrás dice
"esperando". Un muñeco de frente con la puerta abierta detrás dice "llegamos". La pose es
prolijidad; la puerta es el mensaje.

**Lo que esto no hace, con nombre, porque `BR-23` lo prohíbe con nombre:**

| Prohibido | Por qué |
|---|---|
| Que los dos muñecos se den vuelta a mirarse | Insinúa un vínculo que `D-38` baranda 3 no permite ni por mecánica |
| Un abrazo, una mano tomada, un beso, caminar juntos hacia algún lado | `BR-23`: *"ni por mecánica, ni por texto, ni por una animación de festejo al llegar juntos a la puerta"* |
| Un tercer elemento (corazón, estrella, chispa) entre los dos | `UX-27 §9`: nada de partículas ni brillos de recompensa; y la mosca —lo único vivo del sitio— no entra al área (`UX-27 §1.2`) |
| Espejar a uno hacia el otro (`mira` cambiado para que "se miren") | La pose de frente ya es `espejo: false` siempre — mira a cámara, no al otro personaje (`escena.ts`) |
| Una pose nueva de "festejo" | No hace falta dibujarla: `§3` ya resuelve el mensaje sin ella, y `D-42` no da por buena una pieza nueva sin pasar por la hoja de contacto |

---

## 4. Afuera del área: el grito de `D-33` no aplica acá

La pregunta que dejaba abierta el traspaso. La respuesta es que no, y conviene decir por
qué con precisión, porque "no aplica" sin motivo es tan mal argumento como aplicarlo sin
pensarlo.

`D-33` no es una licencia genérica para que cualquier acierto del sitio ocupe la pantalla:
es **un mecanismo con nombre, con técnica y con techo** —la tapa se estampa por pasadas,
colores medidos de `RES-37`, el orden de una serigrafía real, hasta 1200 ms en cuatro
compases— reservado para el momento en que revelás una tapa. La propia decisión lo dice de
las otras dos puntas del sitio que también aciertan sin tapa: *"no dice que el quiz ni
'Completá la letra' tengan que imprimir nada: ahí el premio es la explicación, y un ciclo
que imprime tapas no tiene qué imprimirles"*. Este juego está todavía más lejos: no hay
tapa, no hay disco que revelar, no hay nada que estampar. Pedirle a la puerta el
tratamiento de `D-33` sería inventarle un premio que no tiene adentro.

Y hay un segundo argumento, más chico y más seco: `BR-24` punto 5 ya resolvió la pregunta
simétrica para el fracaso —*"el fracaso no toma prestado el grito del acierto: ni el
sonido, ni el movimiento, ni el tratamiento reservado"*— precisamente porque el grito es
**del sitio**, uno solo, no uno por juego. Si el propio fracaso de este juego no puede
tomarlo prestado, tampoco lo toma prestado el propio acierto de este juego: el grito sigue
siendo de la tapa, no se reparte.

**Lo que sí pasa afuera, entonces, y es chico a propósito:**

- El efecto `puerta` que ya suena (`§2.3`): se queda, porque es un efecto corto de la
  familia del resto del juego, no el tratamiento reservado.
- El control para seguir, que aparece en el mismo instante (`§5`).
- Nada más. Sin flash de color, sin cámara que se acerque, sin texto que diga "ganaron". El
  pie de homenaje sigue en su lugar, sin tocarse (`D-42`, `BR-26`).

---

## 5. Cómo se pasa al siguiente en un toque (`US-09` criterio 1)

El área deja de tener nada que jugar apenas `mundo.terminado` es `true` — nadie va a tocar
el mando para que pase algo más. Ese momento inerte es el lugar más barato para poner la
acción de seguir, y es también el más fácil de encontrar: es donde el jugador ya está
mirando.

> **Tocar en cualquier parte del área, una vez ganada, carga el próximo nivel.** Hoy el
> área no tiene ningún manejador de puntero propio —los `pointerdown`/`pointerup` de
> `partida-skayboy.ts` están atados a los botones del mando, nunca al `canvas`—, así que no
> hay nada que desarmar para sumar este. Tampoco hace falta un botón nuevo en el mueble ni
> renegociar el reparto de `UX-28 §2.3`/`§2.4`, que ya está al límite del margen en el peor
> caso (51 px CSS de sobra en 812 × 375 y en 667 × 375, `UX-28 §2.5`). Tocar la puerta que
> se acaba de abrir es, además, la metáfora más corta posible para "seguir".

**Y con eso no alcanza, porque un `<canvas>` no es accesible por su cuenta.** Tiene que
existir, además, un control real —foco de teclado, rol de botón, `aria-label` o texto con
el verbo que ya usa el sitio para continuar (`Seguí`, nunca `Seguir`, `D-17`)— que haga
exactamente lo mismo. No hace falta que ocupe un lugar nuevo del mueble: puede vivir
superpuesto al área (un `<button>` del tamaño del recorte, por ejemplo) o en cualquier
rincón que ya tenga aire, mientras cumpla `--toque-min` y esté en el DOM **desde el instante
en que `mundo.terminado` es verdadero, sin demora** (`D-32` límite 3: 0 ms hasta que la
acción principal es tocable). Dónde vive exactamente en el marcado es de quien lo
construya; acá lo que se fija es que exista, que sea uno solo, y que un toque alcance.

**Lo que este documento no decide:** si el sexto nivel también "sigue" tocando el área, o
si ahí el mismo gesto lleva a la pieza compartible de `BR-27` en vez de a un `NIV-07` que no
existe. Es el borde que ya había dejado abierto `UX-28 §7` (*"qué se comparte al terminar...
no entra a este ciclo"*) y sigue sin ser mío resolver solo: hace falta `producto` para decir
qué se comparte, y recién ahí se puede decir a dónde lleva el toque en el nivel 6.

---

## 6. La aclaración que le debía a `arquitectura`

El traspaso encontró una tensión de palabras entre `CTR-16.4`/`CTR-16.5` regla 2 —*"una
puerta no se abre: se llega"*— y `UX-29 §8` —*"la puerta se abre"*—, y pidió que alguno de
los dos papeles lo aclarara para que el próximo que lea no crea que `experiencia` pidió algo
que el contrato prohíbe. Se aclara acá, del lado que me toca:

**No hay contradicción: son dos preguntas distintas.** `CTR-16.4` habla de la **mecánica**:
ningún mecanismo, ninguna palanca, ninguna placa "abre" una puerta — no existe una acción de
abrir, existe la condición de victoria, que es que los dos cuerpos estén parados en la suya.
Una puerta nunca frena ni deja de frenar como una compuerta: no tiene ese estado en
`mundo.ts`, y este documento no le pide que lo tenga. `UX-29 §8` y este documento hablan de
la **imagen**: una vez que se llegó —que es lo único que `CTR-16.4` reconoce como causa—, el
sprite que se dibuja ahí cambia de forma. La puerta "se abre" en la retina, nunca en la
física. Nadie tiene que tocar `mundo.ts` para que esto funcione: `tileDe()` ya recibe
`mundo` entero y solo necesita mirar `terminado`, un campo que existe desde antes de esta
tarea.

---

## 7. Cómo se verifica

Sin comando propio, como el resto de lo que este juego resuelve en prosa (`revisor` lo
audita contra esta hoja, `UX-27`, `BR-23` y `BR-24`).

> **Enmendado el 2026-09-24 por `D-47`/`BR-31`:** los puntos 2 y 3 describían el cuadro
> final de antes de la victoria bailada. `UX-33 §5` trae la lista vigente para ese cuadro
> (puntos 6 y 8 de esa sección); acá quedan corregidos en el lugar para que nadie audite
> contra la versión vieja.

1. **Jugar el nivel 1 hasta el final**, con los dos personajes. En el cuadro en que
   `mundo.terminado` pasa a `true`: las dos puertas cambian de forma en el mismo cuadro,
   ninguna un cuadro antes que la otra.
2. **Mirar a los dos muñecos en ese mismo cuadro**: los dos arrancan a bailar, cada uno su
   propia coreografía (`UX-33 §2.2`); ninguno de perfil, ninguno mirando al otro, ninguno
   bailando el mismo paso que el otro.
3. **Buscar cualquier cosa que se mueva** en el área después de ese cuadro, con el juego
   quieto (sin tocar nada): fuera del bucle de baile de los dos personajes, tiene que no
   haber nada más. Ni parpadeo, ni partícula, ni cámara, ni desplazamiento de lugar.
4. **Tocar el área una vez ganada**, sin usar los mandos: carga el próximo nivel.
5. **Con un lector de pantalla o el tabulador**, sin tocar el área: existe un control
   enfocable, con la etiqueta que fije `contenido`, que hace lo mismo que tocar el área.
6. **Sacarle una foto al cuadro del triunfo** y preguntarse si cuenta algo sobre la
   relación entre las dos personas dibujadas. La respuesta tiene que ser que no — es la
   misma prueba que ya usa `UX-29 §9` para el fallo, dada vuelta.

---

> **Enmendado el 2026-10-04 por `UX-37` (`D-61`).** **`§4`**: el *"Nada más"* de lo que pasa
> afuera del área al ganar pasa a ser *nada más que la tarjeta de fin de nivel*. **`§5`**: el toque
> sobre el área sigue igual, pero ahora hay botones visibles (`Seguí`, `Repetí`, `Elegí otro`) y
> *"que sea uno solo"* pasa a valer en el orden de tabulación (`#seguir-juego` sale de él mientras
> la tarjeta está a la vista). El texto viejo y el nuevo, en `UX-37` `§8.4` y `§8.5`; la tarjeta, en
> `UX-37` `§4`.
