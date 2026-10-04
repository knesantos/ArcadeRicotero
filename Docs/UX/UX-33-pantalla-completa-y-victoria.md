# UX-33 — La pantalla completa, la victoria bailada, y lo que juntan Skay y Poli

> Rol dueño: `experiencia`. Ciclo 16, ráfaga 5, 2026-09-24 (`T-297`).
>
> **De dónde sale.** `D-47`: el usuario jugó `NIV-01` en su teléfono, en la vista previa del
> PR #17. Textual: *"me parece que la mejor idea es hacerlo pantalla completa con los
> controles medio transparentes en la pantalla. El scroll en horizontal rompe los controles,
> que la pantalla completa use la disposición de los controles del horizontal completo. Los
> controles se sienten bien, agrega la pantalla completa y largá los demás niveles. Además
> debe haber una pantalla de victoria en la que bailen los personajes. Skay debe juntar
> guitarras y Poli cigarrillos."* `producto` ya bajó eso a criterios verificables en `BR-31`
> (enmienda a `US-09` criterios 1, 6 y 9, y a `BR-23`) — este documento no repite esa bajada,
> la construye encima.
>
> **Este documento no edita `UX-28` ni `UX-32`: los extiende y, donde hace falta, los
> enmienda por referencia**, igual que `D-47` y `BR-31` ya lo hicieron con ellos. Ninguno de
> los dos pierde una palabra; lo que sigue dice qué se le agrega a cada uno y dónde.
>
> **Consume:** `D-47` entera, `BR-31` entera (la victoria, el coleccionable, los seis
> niveles en fila, la pantalla completa como parte de "jugable con el pulgar", y `US-09`
> criterios 1, 6 y 9 ya enmendados por ella), `BR-23` (la paridad, y el punto 2 que `BR-31`
> extiende al estado nuevo), `BR-24` (el fracaso no toma prestado el grito, ni al revés),
> `BR-26` (el pie de homenaje, obligatorio y sin tocar nada), `D-33` (el acierto es el único
> grito del sitio, con techo y lista de a quién no le aplica), `D-32` límite 3 (0 ms hasta
> que la acción principal es tocable), `D-38` baranda 3 y `D-41` (pixel adentro, imprenta
> afuera, el fichín), `D-42` (cara reconocible, el pie obligatorio), `D-17` (voseo, sin
> infinitivo), `.claude/rules/diseno-marca.md` (la tabla anti-slop, en particular: nada de
> glassmorphism ni blur, nada de ícono de librería, la pastilla cápsula vetada — el "medio
> transparente" se resuelve con tinta plana y alfa, no con desenfoque); `UX-27` §1.1 (las
> tres capas del borde, y la enmienda del aire/sólido), §2.1 (el área no crece **en el
> reparto normal** — acá se dice cuándo deja de aplicar), §4 y §4.1.2 (las 15 tintas, la
> puerta y la franja de Objetos), §5.1 y §5.2 (nada de texto adentro del área, todo se
> distingue por contorno), §8.2 (ni la guitarra ni ningún objeto en la mano del sprite
> jugable, y el sello de la guitarra que ya vive en la chapa — se aclara cómo convive con
> esto); `UX-28` §1 (una pantalla, dos maneras de agarrarla), §2/§2.1 (el reparto de mandos
> y teclas, que este documento reutiliza sin tocar), §2.3-§2.5 (el presupuesto de alto, ya
> al límite del margen), §4 (la orientación no se fija, la línea de vertical); `UX-29` §3 y
> §7 (el fracaso no narra, el terreno rechaza); `UX-30` §3 (quién camina qué, y por qué
> ninguna pantalla lo explica); `UX-31` §5 (los mecanismos van en la clave y la luz, se
> distinguen por forma — el precedente directo de cómo se resuelven la guitarra y el
> cigarrillo sin pedir tinta nueva); `UX-32` entero (la puerta que cambia de forma, los dos
> de frente sin tocarse, por qué el grito de `D-33` no aplica acá, el toque para seguir); y
> `UX-21` (el interruptor de cinta: el molde de "sello de goma con estados" que este
> documento reutiliza para el control de pantalla completa). Leído también
> `src/styles/skayboy.css` (`.gabinete`, `.recorte`, `.fichin`, `.chapa-pie`, `.mando`,
> `.tecla`, las variables `--escala`, `--chapa`, `--bisel`, `--mando-alto`) y
> `src/styles/tokens.css` (`--px-tesoro: var(--acento-2)`, la tinta hoy compartida del
> coleccionable único — de ahí sale que no hace falta una tinta nueva para dos objetos).
>
> **Resuelve:** cómo se entra y se sale de la pantalla completa, qué pasa con el sobrante de
> pantalla, cómo se leen los controles superpuestos, dónde queda el pie de homenaje, qué
> pasa en iPhone y en vertical (`§1`); el baile de cada uno, cuánto dura, cómo se sigue, qué
> pasa al ganar el sexto nivel y si hay contador del coleccionable (`§2`); la forma, el
> tamaño y la tinta de la guitarra y el cigarrillo, y qué pasa cuando se juntan (`§3`); y los
> textos que hacen falta para `T-299` (`§4`, ampliando
> `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md`).
>
> **No resuelve:** el píxel final de nada de esto — qué cuadros exactos tiene el baile, qué
> tile exacto es la guitarra — que es de quien dibuje (`T-300`, como ya fijó `D-44` para el
> resto del juego); cómo se le pide la pantalla completa al sistema y qué API se usa en cada
> plataforma (`ADR-10`, `arquitectura`, `T-298`); el schema del coleccionable por personaje
> y el sexto estado `baila` en `CTR-15.7`/`CTR-16.4` (`arquitectura`, `T-298`); las palabras
> finales de cualquier texto (`contenido`, `CNT-22`, `T-299`).

---

## 1. La pantalla completa

### 1.1 Dos pantallas, no una: la entrada impresa y la manera de jugar

`BR-31` ya lo dice en una frase, y es el marco de todo lo que sigue: *"el mueble de `D-41`
—recorte con borde, nunca un `<canvas>` a sangre— sigue intacto como pantalla de entrada; la
pantalla completa es la manera de jugar, no un reemplazo de esa regla."*

Eso fija el reparto de trabajo: **`UX-28` sigue siendo la pantalla que ve cualquiera al
entrar**, con su fichín impreso, sus dos columnas de mando y su presupuesto de alto ya
medido al límite (`UX-28` §2.3-§2.5). Nada de eso se toca. Lo que este documento agrega es
una **segunda pantalla**, que se abre desde la primera con un toque y que resuelve
exactamente lo que la primera no puede: que un gesto de juego mueva la página.

### 1.2 Cómo se entra: el mismo sello que ya tiene la cinta

No hace falta inventar un lenguaje de control nuevo. `UX-21` ya resolvió, para la cinta, el
problema de "un control con más de un estado, que dice honestamente en cuál está": un sello
de goma —el rectángulo de esquina casi viva que ya usa `.casete-accion`, nunca la pastilla
cápsula— con una palabra rotulada adentro. Este control es la misma pieza, con otro texto.

> **Es un `<button>`, con dos estados, que vive superpuesto al fichín — nunca dentro de su
> grilla.**

**Por qué superpuesto y no en la cabecera.** `UX-28` §2.3 ya dejó la cuenta escrita: a ×1 el
renglón de cabecera + encabezado del juego mide como máximo 80 px CSS contra un margen que
en el peor caso es de apenas 30 px de sobra (`UX-28` §2.5, caso 812×354 — el que la propia
`UX-28` ya nombra "el caso real" en `§2`, retomado en `§2.3`: 375 menos la barra de gesto del
sistema, la base de todos sus cálculos de horizontal). No hay hueco ahí para un tercer
elemento sin reabrir esa cuenta, y no hace falta reabrirla: `UX-32` §5 ya resolvió el mismo
problema para el control de "seguí" con la misma salida, y esta pieza la copia. **El botón
de pantalla completa se ancla, con posición superpuesta, a una esquina de `.gabinete`** —la
esquina superior derecha de la chapa, la que queda libre porque la chapa del pie (abajo) ya
está ocupada por el homenaje— con `--toque-min` (48 px) como piso de tamaño, exista o no
exista aire visual alrededor.

El "sobra" medido en `UX-28` §2.5 va de **30 a 212 px CSS según el tamaño** — no de 51 a 212
como decía una versión anterior de este párrafo: 51 es el segundo caso más apretado (812×375
y 667×375), no el peor. En el caso más apretado, 812×354, los 30 px de sobra **no alcanzan**
para los 48 px del botón: `--toque-min` no se achica nunca, así que el sello va a tapar algo,
y hay que decir qué.

**La decisión: se acepta el solapamiento, pero nunca contra el área.** El sello nunca entra
al área de juego —`UX-27` §1.2 punto 3 lo prohíbe sin matices, un sello de goma no pisa
pixel art— así que lo que cede es la chapa y el bisel de ese único rincón (`UX-27` §1.1,
capas 1 y 2: 4 px arriba más 4 px al costado, la franja sin texto que ya excluye `§1.3` de
pantalla completa por puramente decorativa) y, sobre todo, **el margen en blanco alrededor
de `.gabinete`** que ya aloja la mayor parte de esta pieza — la horizontal, ahí sí generosa
(332 px de sobra a los 812 de ancho, `UX-28` §2.5 nota al pie), es la que hace la mayor parte
del trabajo, porque el sello es un rincón anclado a una esquina y no un cuadrado que necesite
sus 48 px limpios exactamente arriba del área. Ninguna tecla se achica, el pie de homenaje no
se mueve, la cabecera no pierde una letra: lo único que cede es una esquina de tinta que ya
era puramente decorativa. **Esto sigue sin pedirle un solo píxel nuevo a la grilla de
`UX-28`**: no hace falta reabrir la cuenta de §2.3 —esa cuenta es sobre meter un tercer
elemento **adentro** del renglón de la cabecera, en flujo, y esto es lo contrario, una pieza
superpuesta y fuera de flujo— pero si alguien construye esto y el rincón real da menos que
estos 8 px de margen decorativo, el criterio manda: primero el área, después la cabecera,
recién al final el sello puede perder su propio aire visual, nunca al revés.

Y no es una pieza rara en el idioma del sitio: una estampa que se pega apenas fuera del
recorte, sobre el margen, es la misma imagen que ya usa `UX-22` para la cinta adhesiva que
pega cada casete al collage — algo apoyado y prendido, no incrustado.

**Los dos estados, en el mismo molde de cuatro estampas que ya usa `UX-21` §2:**

| Estado | Estampa (visible, registro 3) | Qué hace el toque |
|---|---|---|
| Ventana (recién entrado, o después de salir) | Un estado que nombra lo que se gana al tocar | Pide pantalla completa |
| Pantalla completa | Un estado que nombra que ya se está adentro | Sale de pantalla completa |

**Sin ícono.** La cinta pudo resolverse con un triángulo porque el triángulo de reproducción
**ya vive en el mundo del sitio** — es la cabeza de un cassette, no un ícono importado. Acá
no hay un objeto propio del fichín que signifique "expandir": las flechas en diagonal que
cualquier interfaz usa para esto son exactamente el ícono de librería que
`diseno-marca.md` veta por nombre, y no hay un reemplazo rocambolesco honesto a mano. **Se
resuelve solo con la palabra**, como ya resuelve `.casete-pronto` ("EN LA COCINA") sin una
sola imagen. `contenido` fija las palabras exactas en `T-299` (moldes en `§4`); lo que fijo
acá es que no llevan ícono y que van en `--fuente-rotulada` porque, apenas se escriban con
tilde ("PANTALLA", "AMPLIÁ" o lo que salga), esa es la fuente que sí las tiene
(`diseno-marca.md`, deuda declarada).

### 1.3 La escala entera, y qué pasa con lo que sobra

`D-41` no se relaja: **la única forma de escalar el área es por múltiplo entero**, nunca
fraccionaria. Lo que sí cambia respecto de `UX-27` §2.1 es una frase, y conviene decirla con
precisión para que no se lea como una contradicción: esa sección dice que *"el área no crece
con la pantalla"* **en el reparto normal**, donde lo que absorbe el sobrante son las
columnas de mando y el aire. **En pantalla completa no hay columnas separadas** —los mandos
se superponen directamente sobre el área, ver `§1.4`— así que ahí no hay a quién más
dárselo: el área sí crece, y crece exactamente por el mecanismo que `§2.1` ya aprobó (múltiplos
enteros, `image-rendering: pixelated`), aplicado a un caso que antes no existía.

> **El motor toma el ancho y el alto disponibles, descuenta la chapa del pie (`§1.7`, fija,
> no escala) y el bisel de los cuatro lados (4 px CSS, fijo, `UX-27` §1.1), y elige el mayor
> entero que entra en las dos dimensiones a la vez.** El área queda centrada en lo que
> sobra.

**Lo que sobra son bandas de clave.** No hay a dónde más mandarlo, y no hace falta
inventarle una decoración: el color que ya cumple esa función es `--px-clave` (alias de
`--fondo`), la misma tinta del bisel que hoy marca "acá termina el área" (`UX-27` §1.1, capa
2). En pantalla completa esa línea de 4 px se convierte en una banda del ancho que haga
falta —a los costados si la pantalla es más ancha que el área a esa escala, arriba y abajo
si es más alta— y sigue siendo la misma tinta, el mismo trabajo, más superficie. No es un
color nuevo, es el mismo bisel estirado.

**Lo que no viaja a pantalla completa: la chapa decorativa de los costados y de arriba** —el
borde de tijera, el grano de `UX-22` §8— porque ahí el límite de la ventana ya hace ese
trabajo y sostenerla le restaría píxeles al área justo en el modo pensado para dárselos.
Sigue viajando, sin negociarse, el bisel (la frontera, `§1.3`) y la chapa del pie
(`§1.7`).

### 1.4 Los controles superpuestos: la disposición del horizontal, medio transparentes

**Son los mismos `.mando` y `.tecla` que `UX-28` §2/§2.1 ya define** — mismas proporciones
(112×244 el salto, 52×64 cada flecha), mismo `--toque-min`, la misma regla de que saltar es
el bloque grande porque el timing no se arregla achicando el juego. Lo único que cambia es
dónde viven: en el reparto normal ocupan su propia columna de la grilla; en pantalla
completa **se superponen directamente sobre el área escalada**, en el mismo lugar relativo
—salto grande a cada lado, las dos flechas abajo—, con posición fija en vez de columna de
`grid`. Es literalmente el pedido del usuario: *"que la pantalla completa use la disposición
de los controles del horizontal completo."*

**El problema de contraste, y por qué no se resuelve con desenfoque.** Un control
semitransparente apoyado sobre un tileset que cambia de tono según el nivel tiene que leerse
tanto sobre `--px-luz` (el aire, claro) como sobre `--px-clave` (el sólido, oscuro) — y la
instrucción es explícita: nada de glassmorphism, nada de blur. Esto no es el mismo problema
que resuelve el eco de registro de `UX-22` §8 —ese recurso es decorativo, estático, de
registro 1, y esa misma sección lo excluye por nombre de "cualquier rótulo de registro 3",
que es justo lo que es este botón—, así que no lo cito como precedente. El mecanismo que
hace falta acá es otro, y se explica solo:

> **Cada control lleva un doble borde de registro, íntegramente opaco: un anillo en
> `--papel` (claro) y, offset un píxel hacia adentro, un anillo en `--fondo` (oscuro).** El
> relleno del control es tinta plana (`--fondo`) con el alfa bajado — el "medio
> transparente" que pidió el usuario — pero **el borde y cualquier glifo o letra adentro
> nunca llevan alfa**, siempre al 100 %. Contra el aire, el anillo oscuro hace el trabajo;
> contra el sólido, lo hace el claro. Nunca hace falta que los dos contrasten a la vez, con
> que uno lo haga alcanza — es la misma lógica del contorno de un píxel (`UX-27` §5.2)
> trasladada a un control de imprenta.

Esto no mezcla los dos idiomas que `D-41` separa: el control sigue siendo imprenta (tinta
plana, borde definido, tipografía del sitio), dibujado en una capa de HTML/CSS aparte, nunca
adentro del `<canvas>`. Lo único nuevo es que esa capa vive encima del área en vez de al
lado.

**Lo auditable, y sin inventar un test nuevo:** los dos anillos son `--papel` y `--fondo`,
que ya son el par que `contraste.test.ts` testea desde siempre. No hace falta agregar un par
nuevo — hace falta que quien construya use esos dos tokens y no un gris intermedio elegido a
ojo.

**Tamaño:** sin cambios respecto de `UX-28` §2.1. Las teclas no escalan con `--escala`
—son blanco de dedo, no pixel art— así que en pantalla completa, a cualquier múltiplo
entero del área, el salto sigue midiendo 112×244 y cada flecha 52×64.

### 1.5 Cómo se sale

**El mismo botón, mismo lugar relativo.** En pantalla completa el sello de `§1.2` se
superpone sobre el área —misma esquina, ahora con el tratamiento de doble borde y alfa de
`§1.4`, porque desde este momento es un control más de la capa superpuesta— y su segundo
estado ("ya estás adentro") es el que se toca para salir. No hace falta un control aparte
para entrar y otro para salir: es el mismo interruptor, dado vuelta, exactamente como
resuelve la cinta sus cuatro estados con un solo botón.

Donde el sistema ofrece pantalla completa real (Fullscreen API — Android, escritorio), la
tecla `Esc` o el gesto propio del sistema también salen: son un atajo gratis encima del
control explícito, nunca un reemplazo de él. **Nunca se depende solo de un gesto del
sistema**, porque en iPhone no existe (`§1.8`) y porque un control que solo vive en la
cabeza de quien ya sabe el atajo es un molinete para cualquier otro (`D-14`).

### 1.6 Que la página no scrollee ni haga zoom

Es la mitad del criterio 6 de `US-09` que `BR-31` acaba de subir a no negociable: *"ningún
gesto de juego mueve la página —ni scroll, ni rebote, ni zoom—."* Del lado de la experiencia
esto significa una sola cosa que hay que decir con nombre para que nadie la resuelva
escondiendo el síntoma: **mientras la pantalla completa está activa, ningún gesto sobre el
área o sobre los controles hace nada más que lo que ese control hace.** Ni desplaza la
página, ni la acerca, ni activa el menú contextual del navegador, ni dispara el gesto de
"deslizar para volver" cerca de un borde.

**Esto no es un molinete nuevo** (que sería pedirle algo a la persona antes de dejarla
jugar): es lo contrario, es sacarle de encima un gesto accidental que le rompía el control
que ya estaba usando. `D-14` prohíbe exigir algo para entrar; esto no exige nada, evita que
el propio teléfono le quite al jugador algo que ya tenía tocado.

### 1.7 El pie de homenaje: no se negocia, y no se toca

`BR-26` y `D-42` precisión 1 son estrictos: el pie tiene que verse **sin tocar nada**, en
cualquier pantalla de este juego. En pantalla completa eso significa que no puede vivir
adentro del `<canvas>` —`UX-27` §5.1 sigue absoluta, sin excepción, y una pantalla completa
no es la excepción que la rompe— así que la solución es la más simple posible: **no se
mueve.**

> **La chapa del pie —la franja de 24 a 28 px CSS con el homenaje, `UX-27` §1.1— se pincha
> siempre en el borde inferior de la pantalla, sin escalar con `--escala` y sin entrar en el
> cálculo de `§1.3`.** El motor primero reserva esa franja, y recién sobre lo que queda
> calcula el múltiplo entero del área. Es el mismo texto, el mismo registro 3, el mismo
> tamaño que ya tiene hoy — lo único que cambia es que ahora vive pegado al borde de la
> ventana en vez de pegado al borde del mueble impreso.

### 1.8 iPhone: sin pantalla completa real de página, mismo resultado

`D-47` ya lo dejó anotado y `BR-31` lo subió a criterio: *"donde el teléfono no ofrece
pantalla completa real (iPhone), el criterio igual se cumple: lo que importa es el
resultado —que el scroll no rompa los controles—, no el mecanismo del sistema con el que se
logra."* Traducido a esta pantalla:

- **En iPhone no se pide la Fullscreen API** (Safari solo la da para `<video>`). El modo se
  arma con CSS: el contenedor del juego pasa a ocupar la ventana entera
  (`position: fixed`, alto de la ventana visible), y se aplican las mismas reglas de `§1.6`
  (sin scroll, sin zoom) por CSS y por manejo de gestos, no por API del navegador.
- **Visualmente no hay ninguna diferencia con Android o escritorio.** Mismo botón, mismo
  doble borde de registro, misma escala entera, misma banda de clave, mismo pie pinchado
  abajo. La persona no tiene por qué notar que el mecanismo es distinto — y si lo nota
  porque la barra de Safari sube y baja, eso es exactamente lo que `§1.6` tiene que evitar
  también ahí: la altura disponible se vuelve a medir cuando la ventana cambia, y el área
  recalcula su múltiplo entero en vivo en vez de asumir un alto fijo. Esto es implementación
  (`T-301`), lo dejo anotado porque si no se mide en vivo el escalón entero se puede quedar
  mal calculado apenas la barra se esconde.
- **No hay una palabra nueva para "esto no es pantalla completa de verdad."** Sería
  información que a nadie le sirve para jugar mejor — el resultado es el mismo, y `D-14` no
  pide explicar el mecanismo, pide que funcione.

### 1.9 Vertical: no cambia nada, y no hace falta que cambie

El botón de pantalla completa **no aparece en vertical**. No porque se lo esconda a
propósito, sino porque no resuelve nada ahí: el bug que motivó toda esta tarea es
específico del reparto horizontal (`UX-28` §2.3), y el reparto apilado de `UX-28` §4 —área a
×1, las cuatro teclas de dirección abajo en una fila, sin scroll roto— no lo tiene. Agregarle
una función nueva a un caso que ya funciona sería sumar sin necesidad, justo lo que
`.claude/rules/experiencia-metodo` pide borrar.

**La línea de `CNT-18`** (*"gira el teléfono y el juego se ve más grande"*, condicionada por
`UX-28` §4.1) **sigue exactamente igual.** Si alguien gira el teléfono siguiendo esa línea,
llega a horizontal, y recién ahí —si el ancho y el alto entran en la franja que ya define
`UX-28` §2.3— aparece el botón de pantalla completa. Ningún criterio nuevo, ninguna
condición nueva: el botón se muestra exactamente donde ya se muestra el fichín horizontal.

---

## 2. La victoria bailada

### 2.1 Qué enmienda esto de `UX-32`, y qué no

`BR-31` ya fija el criterio; esto fija la forma. `UX-32` sigue entero salvo en una frase de
su `§1` y una de su `§3`:

| Sigue igual (`UX-32`) | Cambia (esta hoja) |
|---|---|
| La puerta cambia de forma, en el mismo cuadro para las dos (`§2`) | — |
| Nada más se mueve **para llamar la atención sobre sí mismo** — cámara, flash, texto (`§4`) | Los dos cuerpos dejan de estar del todo quietos: bailan, en el lugar (`§2.2` de acá) |
| El grito de `D-33` no aplica: sin sonido nuevo, sin tratamiento reservado (`§4`) | — |
| Se sigue con un toque, disponible desde el instante en que `mundo.terminado` es verdadero, sin demora (`§5`) | — |
| Sin gestos de pareja, sin abrazo, sin mirarse (`§3`) | Se agrega, con las mismas palabras de `BR-31`: **tampoco bailan el mismo paso ni comparten un movimiento coordinado** |

La frase que cambia en `UX-32` §3 es la que dice *"los dos quedan en la pose de frente
(`enPausa` en el atlas)"*: en el cuadro en que `mundo.terminado` pasa a `true`, los dos
cuerpos **ya no se congelan en `enPausa` — arrancan directamente el ciclo de `baila`**, el
sexto estado que fija `arquitectura` en `CTR-15.7` (`T-298`). Sigue valiendo, sin tocarse,
el mecanismo que forzaba `deFrente = true` sin importar quién tenía un dedo encima: acá se
extiende a forzar `baila` sin importar `conDedo`, para que nadie quede a mitad de un salto
cuando el nivel se da por pasado.

### 2.2 El baile: cada uno el suyo, y no el mismo paso

`BR-31` lo dice con la fuerza de un criterio de aceptación, no de una preferencia de estilo:
*"cada uno el suyo, con la misma cantidad de cuadros... sin ningún gesto de pareja: no se
abrazan, no se toman de la mano, no bailan el mismo paso ni comparten un solo movimiento
coordinado entre los dos."* Esto es más estricto que "no se tocan": **ni siquiera pueden
compartir la coreografía**, aunque estén separados en pantalla. Tres decisiones lo cumplen:

1. **Cuatro cuadros para cada uno, y no más.** No es un número elegido al azar: es el ancho
   que el atlas ya tiene. `CTR-15.6` construyó la grilla para que `corre` —la única
   animación con más de un cuadro hoy— entre en cuatro columnas. Pedirle a `baila` cinco
   cuadros o más obliga a ensanchar el atlas entero, con el costo que `CTR-15.6` ya dejó
   escrito que no sobra tanto como parece. Cuatro cuadros alcanza y no le pide una columna
   nueva a nadie.
2. **Las poses de un personaje no son las del otro.** No es "el mismo ciclo desfasado en el
   tiempo": es una coreografía distinta para cada uno, del mismo largo. Esto es contenido de
   dibujo y queda para quien dibuje (`T-300`) con esta condición como vara — lo que fijo acá
   es la condición, no las poses.
3. **Ninguno se mueve de lugar.** El pie de la celda sigue anclado donde `UX-27` §6.1 punto
   6 ya lo fija —centrado, apoyado en el borde de abajo—, igual que en `quieto` y en
   `enPausa`. El salto o la energía del baile se leen por la **pose** —agachado, extendido,
   brazos en alto— no por desplazar la celda. Esto no es solo prolijidad: significa que el
   motor no toca la física para el baile, es un cambio de cuadro como cualquier otro
   (`CTR-16.10.8`, la misma doctrina de "el estado lo dice la presencia").

**Velocidad: 8 cuadros por segundo, en bucle (`repite: true`).** Distinto del ritmo de
`corre` (10) para que los dos estados no se sientan calcados, y suficientemente rápido para
que a 32×48 px CSS (o el múltiplo que corresponda en pantalla completa, `§1.3`) se lea como
festejo y no como un temblor. Un bucle, no una secuencia que termina: mientras la persona se
quede mirando, el baile sigue; en el instante en que toca para seguir (`§2.3`), se corta sin
que haga falta esperar a que termine una vuelta — un baile que hay que esperar a que
"termine" antes de poder seguir es una pantalla con demora, y eso es lo que `D-32` límite 3
prohíbe.

**Aviso para `arquitectura`, no una decisión mía:** una fila más en el atlas sube su alto de
120 a 144 px nativos, y `CTR-15.6` medía el tileset completo en 128×128 nativos. El peso en
bytes sigue siendo trivial (unos KB más, lejos del techo de `ADR-08.10`), pero el
empaquetado en 128×128 deja de cerrar tal cual está escrito. Lo dejo anotado para `T-298`;
no es mío resolverlo.

### 2.3 Cuánto dura, y cómo se sigue

**No tiene una duración fija — dura lo que la persona se quede mirando.** Es la lectura más
literal de `D-32` límite 3 y de lo que `BR-31` ya dijo: *"pasar al nivel siguiente no cuesta
más que un toque... la pantalla de victoria llena un instante que antes no mostraba nada, no
agrega un paso."* El control para seguir es exactamente el que `UX-32` §5 ya construyó —
tocar en cualquier parte del área, más un control accesible equivalente para quien no
toca— y sigue disponible desde el primer cuadro en que `mundo.terminado` es verdadero, sin
importar en qué punto del bucle de `baila` está cada personaje en ese instante.

### 2.4 Qué pasa al ganar el sexto nivel

`BR-31` ya lo resolvió, y acá no hay nada que agregarle: **la pantalla de victoria del
sexto nivel es la misma que la de cualquier otro.** Mismas dos puertas, mismo baile, mismo
"un toque para seguir." No hay una sexta escena especial, ni un festejo más grande, ni un
texto de cierre distinto — este juego no tiene un final con más peso que los otros cinco.
**Lo único que cambia es a dónde lleva el toque**: en los niveles 1 a 5, al siguiente; en el
6, a la pieza compartible que fija `BR-27`. Sigue siendo terreno de `producto` decidir el
detalle de esa pieza (`UX-28` §7 ya lo dejó así, sin cerrar); lo que confirmo acá es que el
camino visual —puerta, baile, toque— es idéntico en los seis, así que no hace falta diseñar
una pantalla nueva para el final: la que ya existe **es** el final, seis veces.

### 2.5 El contador del coleccionable: sí, y solo ahí

`BR-31` deja explícitamente esta decisión de mi lado: *"esa decisión de dónde exactamente y
con qué forma es suya, no de esta regla."* Se decide así:

- **Durante la partida, no.** `UX-27` §5.1 sigue absoluta: nada de texto adentro del área,
  sin excepción, y un contador es texto. Fuera del área tampoco hay hueco: el mando ya usa
  todo el margen disponible (`§1.2`), y meter un número ahí competiría con la zona de
  pulgar que el criterio 6 de `US-09` protege — exactamente lo que `BR-31` pide evitar.
- **En la pantalla de victoria, sí, como sugiere `BR-31`.** Es el único momento en que el
  mando deja de necesitar toda su superficie para jugar (`mundo.terminado` ya es
  verdadero), así que hay margen para una capa de HTML superpuesta — la misma categoría que
  ya usa el control de "seguí" de `UX-32` §5, nunca dibujada adentro del `<canvas>`. Dos
  números chicos, uno junto a cada personaje (la guitarra cerca de Skayboy, el cigarrillo
  cerca de Poligirl), en registro 3, sin comparación entre los dos — la misma restricción
  que `BR-27` punto 2 ya le puso al tiempo. No hace falta ícono: el número puede ir junto a
  la palabra ("3 guitarras"), y si hace falta el glifo del objeto, es el mismo tile del área
  reescalado, no un ícono nuevo.
- **En la pieza compartible, lo que ya fija `BR-27` punto 2:** como dato de cada uno, nunca
  como comparación ni como puntaje — la misma regla con la que esa sección ya trata el
  tiempo.

### 2.6 Lo que sigue prohibido, sin relajarse

La misma tabla de `UX-32` §3, con la fila que `BR-31` agrega marcada:

| Prohibido | Por qué |
|---|---|
| Que los dos muñecos se den vuelta a mirarse | `D-38` baranda 3 |
| Abrazo, mano tomada, beso, caminar juntos | `BR-23`, `BR-31` |
| **El mismo paso, o cualquier movimiento coordinado entre los dos** | `BR-31`: ni siquiera sincronizados sin tocarse |
| Un tercer elemento entre los dos (corazón, estrella, chispa) | `UX-27` §9, la mosca no entra al área |
| Una pose nueva de "festejo de pareja" | No hace falta: cada uno baila el suyo por separado |
| Sonido nuevo, tratamiento de `D-33` | `UX-32` §4 sigue vigente: el grito sigue siendo de la tapa |
| Texto que diga "ganaron" o narre un logro compartido | `UX-29` §8, `voz-ricotera.md` |

---

## 3. La guitarra y el cigarrillo

### 3.1 Forma y tamaño en el tile de 16

Los dos son **objetos, tipo `tesoro`** en la leyenda actual (`CTR-16.4`), que
`arquitectura` va a partir en dos entradas —una por personaje— en `T-298`. Acá se fija cómo
se ven, con el mismo margen que ya usa el resto del inventario de objetos del juego.

- **Tile de 16×16 nativos**, como cualquier otro elemento de la grilla.
- **La figura ocupa el centro, con aire alrededor** — el mismo criterio que `UX-27` §2 usa
  para el personaje adentro de su celda (1 px nativo de aire para que el contorno no toque
  el borde del tile). Ninguno de los dos objetos llena el tile de punta a punta: eso es lo
  que los separa de leerse como parte del terreno.
- **Guitarra:** una silueta con **cuerpo redondeado y mástil recto** — lo que hace
  reconocible a una guitarra en miniatura no es el detalle, es la proporción cuerpo/mástil.
  A 16 px, eso significa una masa curva ocupando la mitad inferior del tile y una línea
  recta y angosta saliendo hacia una esquina superior, más larga que ancha.
- **Cigarrillo:** una silueta **fina y recta**, con una marca chica en una punta —el ascua—
  que la distingue de cualquier otro palito del juego (no hay ninguno hoy, así que no hay
  con qué confundirla). Ocupa una fracción angosta del tile, apoyada en diagonal para que no
  se lea como una línea de la grilla.

### 3.2 Con qué tintas: una sola, sin pedir una más

`UX-27` §4 ya dejó exactamente **una** tinta para la franja de Objetos (la que hoy usa el
tesoro único, `--px-tesoro`, alias de `--acento-2` en `tokens.css`), después de que §4.1.2
le sacara su tinta propia a la puerta para financiar otra cosa. **Esta tarea no pide una
tinta 16.** Los dos objetos nuevos —guitarra y cigarrillo— comparten esa misma única tinta
de Objetos, más el contorno de clave obligatorio (`UX-27` §5.2), exactamente igual que los
cuatro mecanismos de `UX-31` §5 comparten clave y luz sin necesitar franja propia y se
distinguen por forma. Es el mismo mecanismo, aplicado al mismo tipo de problema: **dos
objetos, un color, la forma hace el trabajo.**

El nombre final del token (si sigue llamándose `--px-tesoro` o pasa a otra cosa una vez que
deja de ser "un" tesoro) es de quien lo implemente — acá lo que se fija es que **no hace
falta un segundo hex**, y que ambos objetos salen del mismo.

### 3.3 Cómo se distinguen de lejos y en gris

La vara es la misma que `UX-30` §3 ya usa para el reparto de terreno y que `UX-27` §5.2 pide
para todo lo que hay que reconocer adentro del área: **mirar en escala de grises, tapando el
color.** Con una sola tinta compartida, esto no es opcional, es la única prueba que existe.

- **La guitarra es una masa curva** — su silueta tiene más área rellena, se lee "gorda".
- **El cigarrillo es una línea** — su silueta es angosta y larga, se lee "flaca".

Una masa redondeada contra una línea recta es la diferencia de silueta más barata que hay:
no depende de un detalle fino que se pierda a 16 px, y sigue leyéndose igual de lejos que de
cerca porque la diferencia está en la proporción, no en el trazo. **Esta es la misma prueba
que `BR-23` punto 3 ya exige para las siluetas de los personajes** (la hoja de contacto en
blanco y negro, `UX-30` §3, enmienda del 2026-09-23): acá se extiende a los dos objetos
nuevos, con el mismo criterio de aceptación.

### 3.4 Qué pasa cuando se juntan

**El tile pasa a aire, en el mismo cuadro, sin transición.** Es la misma gramática que ya
rige palanca, placa, compuerta y puerta (`CTR-16.10.8`, `UX-32` §2.3: *"el estado lo dice la
presencia, no un cambio de tinta"*). No hay brillo, no hay partícula, no hay chispa de
recompensa — `UX-27` §9 ya lo prohíbe con nombre para todo el área, y el motivo de fondo es
el mismo de `UX-32` §4: **el grito de `D-33` es de la tapa, y este juego no tiene tapa que
estampar.** Levantar una guitarra no es sacar un tema; no se le puede pedir el tratamiento
de lo uno sin tenerlo de lo otro.

**Sin sonido nuevo obligatorio.** Si `arquitectura` decide que hay un efecto corto al
levantar el objeto, tiene que ser de la misma familia liviana que el resto de los efectos
del juego (el mismo criterio que ya aplicó `UX-32` §2.3 para el sonido de la puerta), nunca
el tratamiento reservado de `D-33`. No es una condición que yo agregue: es la misma que ya
regía para todo lo demás en este juego.

**Ningún objeto va en la mano del sprite jugable.** `UX-27` §8.2 ya lo prohibió para la
guitarra —*"una guitarra cruzada sobre un cuerpo de 14 px rompe la silueta"*— y la misma
razón vale para el cigarrillo. Levantar el objeto no cambia el sprite del personaje: el tile
desaparece del piso, y ahí termina la animación. Nada que sostener, nada que cargar.

### 3.5 Esto no toca el sello de la chapa que ya existía

`UX-27` §8.2 dejaba pendiente un sello de guitarra impreso en la chapa —insignia, no
utilería, junto al pie de homenaje— a la espera de que `investigador` fichara el objeto
equivalente de Carmen Castro. **`BR-31` no responde esa pregunta: la vuelve innecesaria para
el propósito con el que se hizo.** El cigarrillo que junta Poligirl adentro del juego es una
decisión de `D-47`, tomada con la nota de `D-14` ya puesta (*"si llega un reclamo, se cambia
el objeto"*), no un hallazgo de investigación. Las dos cosas pueden convivir sin
contradecirse —el sello de la chapa sigue siendo una decisión aparte, todavía abierta en
`Docs/SUGERENCIAS/UX-para-investigador-sombrero-y-insignias.md`— pero **no hace falta
esperar esa ficha para que el cigarrillo entre al juego como coleccionable.** Son dos
piezas distintas: una vive impresa y fija en la chapa (si algún día se resuelve); la otra
vive dibujada y contable adentro del área, ya decidida.

---

## 4. Los textos que hacen falta, para `T-299`

Ya quedaron pedidos con molde completo en
`Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md §7` (sumado en esta misma
tarea). En una lista, para no duplicar la redacción acá:

1. **Las dos estampas del interruptor de pantalla completa** (`§1.2`/`§1.5`): un estado que
   nombra lo que se gana al tocar, y un estado que nombra que ya se está adentro — molde de
   registro 3, dos palabras cada una como la cinta, más un `aria-label` en voseo para cada
   toque (entrar / salir).
2. **Nada nuevo para iPhone.** El resultado es el mismo que en cualquier otra plataforma
   (`§1.8`): no hace falta un texto que explique que el mecanismo es distinto.
3. **Una línea para la pantalla de victoria de cualquier nivel**, si `contenido` decide que
   hace falta más allá del aviso de lector de pantalla que ya pidió `UX-32` §6 — acá se
   agrega solo la aclaración de que ahora hay baile, por si el aviso de accesibilidad
   necesita nombrarlo ("bailan" en vez de "llegaron", si corresponde).
4. **Una línea distinta para el final del sexto nivel**, separada de la de cualquier otro
   nivel porque ahí el toque lleva a compartir y no a seguir jugando — sin narrar un logro
   compartido (`§2.6`), sin "ganaron", registro que decida `contenido` entre el 1 y el 3
   según a dónde apunte.
5. **Si existe el contador del coleccionable** (`§2.5`): las palabras "guitarras" /
   "cigarrillos" en la forma exacta que se van a leer al lado del número, y opcionalmente un
   anuncio corto de accesibilidad al levantar uno ("Guitarra." / "Cigarrillo.", cuatro
   palabras como techo, registro 3).

---

## 5. Cómo se verifica

Sin comando propio para casi todo esto — se audita con los ojos, como el resto de lo que
este juego resuelve en prosa (`UX-32` §7 ya fijó el precedente):

1. **En horizontal, tocar el botón de pantalla completa.** El scroll no se mueve, el zoom no
   entra con dos dedos, y el área queda centrada con bandas de clave si sobra algo.
2. **Medir el múltiplo entero elegido en tres tamaños distintos de pantalla.** Nunca una
   escala fraccionaria; el pie de homenaje siempre visible, pinchado abajo, del mismo tamaño
   en los tres.
3. **Mirar los controles superpuestos sobre el aire y sobre el sólido del nivel.** El doble
   borde de registro se lee en los dos casos sin que haga falta forzar el contraste a ojo.
4. **En iPhone, repetir el punto 1.** Mismo resultado visual, sin pedir la Fullscreen API.
5. **En vertical, confirmar que el botón no aparece**, y que la línea de `CNT-18` sigue
   igual que antes de esta tarea.
6. **Jugar hasta ganar un nivel.** Los dos personajes arrancan a bailar en el mismo cuadro en
   que la puerta cambia de forma; cada uno tiene una coreografía distinta a la del otro;
   ninguno se desplaza de su lugar; tocar en cualquier momento del bucle pasa al siguiente
   sin demora.
7. **Ganar el sexto nivel.** Misma pantalla que cualquier otro; el toque lleva a compartir.
8. **Sacarle una foto al cuadro del baile** y hacer la misma prueba que `UX-32` §7 punto 6:
   ¿la imagen, suelta y sin contexto, cuenta algo sobre la relación entre las dos personas
   dibujadas? Tiene que seguir siendo que no.
9. **Mirar el tile de la guitarra y el del cigarrillo en escala de grises.** Se siguen
   distinguiendo por silueta sin ayuda del color.
10. **Levantar uno de cada uno.** El tile desaparece en un cuadro, sin brillo ni partícula;
    ningún personaje lo lleva en la mano.

```
node --test src/lib/contraste.test.ts       # --papel / --fondo, el par que ya usan los
                                              # controles superpuestos — sin par nuevo
node --test src/lib/estilos.test.ts          # ningún estado del área se comunica solo con color
node --test src/lib/voz.test.ts              # una vez que contenido cargue los textos de §4
npm test
```

---

## 6. Lo que este documento no cierra

- **Cómo se le pide la pantalla completa al sistema operativo**, y qué pasa si el navegador
  la niega en Android o escritorio: de `arquitectura` (`ADR-10`, `T-298`).
- **El sexto estado `baila` y el coleccionable por personaje en el schema**: de
  `arquitectura` (`CTR-15.7`, `CTR-16.4`, `T-298`).
- **Los cuadros exactos del baile, y los tiles exactos de la guitarra y el cigarrillo**: de
  quien dibuje (`T-300`), con las condiciones de `§2.2` y `§3` como vara, no como plano.
- **Las palabras finales de cada texto**: de `contenido` (`CNT-22`, `T-299`), con los moldes
  de `§4` y del traspaso ampliado.
- **A dónde lleva exactamente el toque en el sexto nivel** (qué pieza compartible, con qué
  contenido): de `producto` (`BR-27`), sin cambios desde `UX-28` §7 y `UX-32` §5.

---

> **Enmendado el 2026-10-04 por `UX-37` (`D-61`).** **`§1.2`**: la estampa del interruptor nombra
> el verbo del toque en los dos estados (`PANTALLA COMPLETA` fuera del modo, `SALÍ` adentro), no el
> estado. **`§1.9`**: el botón aparece también parado y en cualquier ventana, y el modo parado pone
> el área arriba y las teclas abajo. **`§1.4`**: el relleno de los controles queda en 56 % las
> teclas y 66 % los sellos, y en ventanas bajas cede el bloque de saltar. **`§1.5`**: el sello de
> salir tiene un tope contra la columna de mando. **`§1.7`**: la reserva del pie cuesta un escalón y
> se acepta. El texto viejo y el nuevo, en `UX-37` `§8.6` a `§8.8` y `§9`.
