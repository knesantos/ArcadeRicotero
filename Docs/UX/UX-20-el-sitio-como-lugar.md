# UX-20 — El sitio como lugar

> Rol dueño: `experiencia`. `T-176`, ciclo 11, frente A.
>
> **Consumo:** `Docs/ORQ/ORQ-plan-ciclo-11.md` (la doctrina propuesta, el mapa de conflictos
> con el ciclo 10, la medición de partida); `Docs/DECISIONES.md` `D-14` (molinetes
> abiertos), `D-19` (la mezcla — la base no rota, el mapa sección→disco), `D-21` (tapas
> reales en cualquier pantalla, con velo y crédito); `Docs/UX/UX-04-sistema-visual.md`
> (los tokens de velo `--velo-tapa`/`--velo-tapa-titular` y su cálculo, la técnica
> rocambolesca fichada); `Docs/UX/UX-10-escritorio.md` (la prohibición de elevación/
> escala/sombra en el `:hover`, que esta hoja extiende a cualquier movimiento);
> `.claude/rules/diseno-marca.md` (la tabla de tics vetados); `src/styles/tokens.css`
> entero (líneas 203-210, el corte de `prefers-reduced-motion` con el selector
> universal `*`); `src/styles/sitio.css` entero (línea 147, `animation: vuelo-de-mosca
> 17s`; línea 166, `.contenido-sitio`); `src/pages/index.astro` y
> `src/layouts/Base.astro` (cómo entran hoy las capas de fondo); `src/lib/sitio/copy.ts`
> (qué disco viste cada juego, vía el campo `variante`); `src/styles/juego.css:104`
> (`transition: border-color 120ms, background-color 120ms` de `.opcion`, verificado
> leyendo el archivo); un grep sobre `src/pages/juegos/*.astro` para confirmar qué
> pantallas ya tienen `tapa-fondo` hoy y cuáles no; y
> `Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md` (el P3 que nombra la
> guillotina de `prefers-reduced-motion` por su nombre, todavía abierto).
>
> **Resuelve:** fija o corrige la doctrina de movimiento que propone el plan del ciclo
> 11, con los cuatro límites numéricos, el mapa de atmósfera por lugar que extiende
> `D-19`, la lista de lo que nunca se mueve, el catálogo de nombres de token que
> `T-177` tiene que crear, y qué le pasa a cada pieza bajo `prefers-reduced-motion`
> (el defecto que `T-178` tiene que cerrar). Todo lo que sigue es la vara que citan
> `T-177`..`T-183`, `T-185`, `T-186` y, al cierre, `T-193`.

## Cómo leer este documento

No hay ninguna ficha `RES-XX` de por medio: esto no es sobre la obra de Rocambole, es
sobre cómo se mueve una interfaz. Todo acá es **criterio propio de `experiencia`**,
apoyado en tres cosas verificables — las decisiones ya tomadas (`D-14`, `D-19`, `D-21`),
el código real (citado con archivo y línea), y la medición de partida que el hilo
principal dejó escrita en el plan del ciclo. Donde corrijo algo que el plan proponía en
prosa, lo digo explícito, porque el plan mismo pidió esa revisión: *"la doctrina de
arriba, adoptada o corregida"*.

No fijo un solo hex ni un solo milisegundo de curva. Fijo **nombres y techos**. El valor
exacto de cada token —cuánto dura `--duracion-paso`, qué bezier es `--curva-cinta`— lo
decide el hilo principal en la hoja 12 del lienzo y después en `tokens.css` (`T-177`),
siguiendo el circuito que manda `.claude/rules/diseno-marca.md`. Lo que esta hoja no
negocia son los cuatro techos de la sección 1: son de `experiencia`, no del lienzo,
porque son decisión de producto de sesión corta, no de estética.

---

## 0. La doctrina, adoptada — con dos correcciones

> **El movimiento es del lugar, no del elemento.** Nada se mueve para llamar la
> atención sobre sí mismo; lo que se mueve es la cámara: el aire, el fondo, la tinta, el
> paso de una pantalla a la otra.

**La adopto entera.** Es la misma lógica que ya rige el `:hover` de `UX-10`: reusar un
tinte que el elemento ya tiene, nunca elevación ni escala ni sombra — acá se extiende de
"cómo reacciona un elemento al mouse" a "cómo entra una pantalla", con el mismo
fundamento. Y la contracara —que el misterio lo sostiene el rótulo frío, y que
`LEYENDA`, `TESTIMONIO`, la ficha `RES-` y las tres pantallas de registro 3 no se
decoran ni se atmosferan— también la adopto entera: es la sección 3 de esta hoja.

**Dos correcciones, y ninguna cambia el sentido, lo hacen ejecutable:**

**Corrección 1 — "la tinta se hace más honda" no puede tocar el reposo.** El plan dice
que la tinta se hace más honda al entrar y más clara al volver. Tomado literal, eso
suena a que `--fondo` cambia de valor entre pantallas — y `D-19` es explícita: *"la base
no rota — fondo de tinta, grano, serigrafía, zona pulgar y contraste AA son idénticos en
todas las pantallas."* No hay contradicción si se lee bien: la hondura es un efecto
**transitorio**, que vive solo mientras dura el paso (un filtro de brillo que baja y
vuelve a subir, no un segundo valor de `--fondo` de reposo). Al terminar el paso, el
DOM queda exactamente en el mismo `--fondo` que tenía antes de que existiera esta hoja.
Es la diferencia entre *"este lugar es más oscuro"* (rompe `D-19`) y *"entrar a un lugar
se siente como bajar un escalón"* (no la rompe). El token que lo nombra es
`--hondura-transito` (sección 4), y por diseño no tiene ningún estado de reposo: solo
existe durante `--duracion-paso`.

**Corrección 2 — la doctrina no traía números, y sin números no se puede auditar.** El
propio plan lo dice en su sección de riesgo: *"ningún test puede decir si una transición
se siente como entrar a un lugar o como una web de plantilla"*. Cierto para el juicio
estético — falso para los cuatro límites duros. Un techo de milisegundos, un techo de
capas, un piso de cero para la interactividad y un techo de porcentaje para el
desplazamiento **sí se miden con una regla y un cronómetro**, y por eso están en la
sección 1: son la parte de "¿se mueve como un lugar o como slop?" que sí se puede
verificar sin ojo.

---

## 1. Los cuatro límites, con número

| # | Límite | Número | Se aplica a |
|---|---|---|---|
| 1 | Duración máxima de **un paso** | **400 ms** | cualquier tránsito atmosférico que ocurre una vez entre un reposo y el siguiente: el paso entre dos pantallas, y cada sub-paso del umbral de la portada |
| 2 | Capas de fondo, máximo | **2** | grano (constante, siempre presente, cuenta como capa 1) + a lo sumo **un** recorte real velado (capa 2). Nunca dos imágenes reales a la vez detrás de un mismo contenido |
| 3 | Tiempo hasta que la acción principal es tocable | **0 ms** | cualquier pantalla nueva: el botón, la opción o el casete responden desde el primer cuadro, mientras la atmósfera todavía se está asentando alrededor |
| 4 | Recorrido máximo de una capa al desplazar | **8 % del ancho de la capa** | cualquier capa de fondo con parallax (grano o recorte real) |

### 1.1 Por qué 400 ms

No es un número de framework. Hoy el sitio tiene un solo dato de referencia real: los
**120 ms** de `.opcion` (`juego.css:104`), que son información, no atmósfera. Un paso
atmosférico es un evento más grande que una confirmación de toque —cambia media
pantalla, no un borde— así que tiene que sentirse distinto, pero **sesiones de dos o
tres minutos no toleran nada que se acerque a la sensación de espera**: los estudios de
percepción de latencia que maneja cualquier guía de interacción mobile ubican el umbral
de "esto tarda" alrededor de 1.000 ms, y 400 ms deja un margen cómodo por debajo de eso
incluso sumando el tiempo de render real del dispositivo, sin acercarse a sentirse como
carga. **Un solo número, aplicado parejo** a todo paso, en vez de un número por tipo de
transición: es el mismo criterio que ya usó `UX-10` para el corte de ancho (46rem, un
número que sirve para todo en vez de uno por pantalla), y evita que el umbral de la
portada termine con un presupuesto tácito de 900 ms repartido en tres sub-pasos de 300
que nadie declaró. Si el umbral necesita grano + franja + marca, **cada uno** de esos
sub-pasos respeta los 400 ms — no hay un total escondido detrás de la suma.

### 1.2 Por qué 2 capas

Este número ya estaba escrito, en prosa, en el propio plan del ciclo (`T-186`: *"Dos
capas, no cinco, y solo traslación"*) — lo hago mío y lo fijo acá porque necesita
techo antes de que `T-186` lo construya, no después. El fundamento técnico es el mismo
que ya usó `UX-04` para el velo: *"Es un color plano con alfa, una sola capa — no dos
[...] un velo en dos capas [...] da un contraste distinto en cada punto de la imagen, y
eso no se puede resumir en un número que un test corra una sola vez."* Ese argumento no
es solo del velo: es de **cualquier apilamiento de imágenes reales**. Dos recortes
reales superpuestos, cada uno con su propio velo, ya no tienen un "peor caso" que
`contraste.test.ts` pueda auditar de una corrida — cada combinación posible de las dos
imágenes sería un par nuevo. El techo de 2 capas (grano constante + un recorte real) no
es solo estética anti-slop (aunque también lo es: apilar fondos es el pariente visual
del *glassmorphism* que veta `diseno-marca.md`) — es lo que mantiene auditable el
contraste que ya está auditado.

### 1.3 Por qué 0 ms

No es negociable y no hace falta justificarlo de nuevo: es la lectura literal de
`D-14` aplicada a una animación. Una pantalla que hay que "esperar a que termine de
asentarse" para poder tocar es un molinete nuevo, con la forma de una animación en vez
de la forma de un login. El número es cero porque cualquier número mayor que cero es,
otra vez, un molinete.

**Nota agregada tras `FIND-51` (ciclo 12, `UX-22 §1.4`).** Este límite mide **cuánto
tarda en responder** la acción principal, no **dónde queda parada** en la pantalla
después de que la vista se movió sola. Son dos ejes distintos: el segundo no existía
hasta que el ciclo 12 hizo que un reveal desplazara el viewport hacia un premio sin que
el dedo lo pidiera, así que este `§1.3` no lo cubre y no lo relaja. La excepción acotada
para ese eje nuevo —cuándo, y con qué techo— vive en `UX-22 §1.4`, no acá.

### 1.4 Por qué 8 %

El objetivo del parallax es que se note que hay profundidad, no que se note que algo se
mueve — si una capa recorre demasiado ancho, deja de ser aire y pasa a ser un elemento
que reclama atención, que es exactamente lo que la doctrina prohíbe en su primera
frase. Y hay una razón técnica, no solo de gusto: las capas de fondo hoy están fijas con
`background-size: cover` sobre un contenedor acotado (`.tapa-fondo`, `sitio.css:55-65`);
un recorrido grande arriesga descubrir el borde de la imagen o forzar el desborde
horizontal que **`UX-10` y la propia auditoría de `impeccable` ya verificaron en cero**
a 320, 375 y 1280 px. 8 % es un desplazamiento perceptible —un dedo que scrollea nota
que el fondo se corre más lento que el contenido— sin acercarse al borde de ningún
recorte del catálogo de hoy (el más ajustado mide 210 px de lado largo, `UX-04` v4): un
8 % de un contenedor de ese tamaño es apenas unos pixeles, nunca suficiente para
exponer el límite de la imagen.

---

## 2. El mapa de atmósfera por lugar

`D-19` fijó qué disco viste cada sección (el acento, la letra grande) y declaró que la
**base no rota**: fondo, grano, zona de pulgar y contraste AA son los mismos en
cualquier pantalla. Esta hoja no toca esa base. Lo que agrega es una tercera capa que
`D-19` no tenía: **cuántas capas de fondo lleva cada lugar y qué le pasa a esa capa al
moverse** — el clima, no el color. La columna "disco/tinte" de la tabla no es una
decisión nueva: es la que ya fijó `D-19` (o, para los tres juegos que llegaron después
de esa decisión, la que ya fijó cada `UX-XX` propio, citada). Lo nuevo son las dos
columnas de la derecha.

| Lugar | Disco / tinte (ya fijado) | Capas de fondo (máx. 2, `§1.2`) | Qué cambia acá y en ningún lugar más | Qué no cambia nunca (`D-19` + `§3`) |
|---|---|---|---|---|
| **Portada** | Oktubre — `--marca-rojo` (`D-19`) | 2: grano + `tapa-fondo--portal` (banderas, `sitio.css:70-77`) | El **umbral** (`T-185`): esta capa se asienta una vez por visita, dentro del techo de `§1.1`. Es el único lugar del sitio con entrada propia — en todos los demás, la atmósfera ya está puesta cuando el paso termina | El botón `JUGÁ` y los casetes son tocables desde el cuadro cero (`§1.3`), pase lo que pase con el grano o la franja |
| **Adiviná el tema** (`US-02`) | Lobo suelto — mitología (`D-19`) | 2: grano + `tapa-fondo--lobo-tiras` (ya en `adivinar-el-tema.astro:66`) | Nada propio del lugar: solo el paso genérico de entrada/salida (`§1.1`) | El reveal de audio y sus estados de acierto/error, que van siempre en `--acento-3`/`--acento-4`, nunca en el naranja de mitología |
| **Completá la letra** (`US-03`) | La mosca y la sopa — letras (`D-19`) | 2: grano + `tapa-fondo--mosca-olla` (ya en `completar-la-letra.astro:46`) | Ídem | Las cuatro opciones de palabra: mismo comportamiento que en cualquier otro juego, ✔/✕ incluidos |
| **Adiviná la tapa** (`US-04`) | Último bondi — discos (`D-19`) | 2: grano + `tapa-fondo--bondi-engranajes` (ya en `adivinar-la-tapa.astro:41`) | **Ojo acá:** el recorte de zoom que hay que adivinar es una tapa real, igual que el fondo atmosférico — pero son dos imágenes con roles distintos y el velo **nunca** se posa sobre la pieza jugable, solo sobre el fondo detrás de ella. Confundir las dos sería tapar la respuesta con el mismo velo que la protege | El crédito de esquina (`UX-04`, condición de `D-21`) sigue siendo el sello fijo, no una firma que aparece y desaparece con la atmósfera |
| **Sacalo por la letra** (`US-07`) | Momo Sampler — variante `momo` (`UX-08`) | 1 hoy (grano solo — no existe todavía `tapa-fondo--momo-sampler` en `sitio.css`) | Puede sumar su segunda capa cuando `T-186` genere el recorte de Momo Sampler; hasta entonces se queda en 1, nunca se le inventa una imagen de otro disco para "completar" | Igual que los de arriba |
| **¿Qué tipo de ricotero sos?** (`US-06`, dos ejes) — **enmendada el 2026-10-04, ver debajo de la tabla** | Luzbelito — criterio propio, sin ficha (`dos-ejes.astro`, comentario de cabecera) | **1, y se queda ahí a propósito** | Nada: es el único de los cinco que decido **no** subir a 2 capas. `BR-17` dice que ningún resultado es mejor que otro y que es el juego con el molinete más abierto — vestirlo con una tapa real de fondo sugeriría que hace falta reconocer el disco para jugarlo, que es justo lo que este juego no pide | Ningún resultado del cuestionario se tiñe con más o menos intensidad que otro: los cuatro cuadrantes pesan igual |
| **Redondopedia — portada e índice** | Gulp! — historia, en la cabecera (`D-19`) | 2 en la franja de cabecera (grano + `tapa-fondo--gulp-pincelada`, `sitio.css:94-97`), **1 en el índice que crece debajo** (ya documentado en el propio CSS, `sitio.css:112-115`: un fondo detrás de una lista sin techo es lo que `UX-04` evita) | El índice pasa a 2 columnas desde 46rem (`UX-10`), y eso es maquetado, no atmósfera — no cambia nada de esta tabla | — |
| **Redondopedia — un artículo** | El de su categoría: historia / discos / letras / mitología (`D-19`, clases `.articulo--*`) | 1 (grano) + a veces un **detalle recortado** flotante (`.detalle-articulo`), que no cuenta como capa de fondo porque no es de borde a borde | Nada de movimiento nuevo — un artículo es lectura, se entra y se sale (`REDONDOPEDIA.bajada`) | — |
| **Redondopedia — Bulacio, Olavarría, la muerte del Indio** | El tinte de clasificación se queda (es catalogación estática, no atmósfera) | **1, siempre — grano y nada más, nunca velo ni recorte real** | **Nada. Cero.** Ni entrada propia, ni parallax, ni una segunda capa aunque el resto de la Redondopedia la tenga. Es la aplicación visual de lo que `D-20` ya dijo de la voz: *"ahí no hay voz que valga"* — acá no hay atmósfera que valga | Todo: es el piso firme que sostiene el misterio de cualquier otro lado |
| **Cancionero (letras y acordes)** | La mosca y la sopa — letras, mismo disco que "Completá la letra" (`D-19`) | Hasta 2: grano + `tapa-fondo--mosca-olla` reusado (mismo disco, mismo archivo — no hace falta uno nuevo). Con `--velo-tapa` (86 %), **nunca** `--velo-tapa-titular` (75 %): acá el fondo convive con texto de cuerpo largo (acordes + verso), no solo con un título | Ninguna: el acorde alineado sobre la sílaba (`UX-10`) no se toca por nada de esta hoja | — |
| **Resultado y compartir** | Gulp! + el lettering del logo (`D-19`) | Hasta 2: grano + `tapa-fondo--gulp-pincelada` reusado (mismo archivo que la cabecera de la Redondopedia) | Vive hoy dentro de `quiz.astro`, fuera del alcance de código de este ciclo (`T-182`) — esta fila es la doctrina que rige **cuando** esa pantalla entre a la gramática del tránsito, no una instrucción para tocarla ahora | El puntaje, el tramo y cualquier rótulo `LEYENDA`/`TESTIMONIO` en la explicación final: nunca tintados por el disco de la sección (`§3`) |

**ENMIENDA 2026-10-04 (ciclo 18, `D-57` punto 8, `UX-36` §2) — la fila de "¿Qué tipo de ricotero
sos?", en voz alta.** La fila decía: *una sola capa, y se queda ahí a propósito: vestirlo con una
tapa real de fondo sugeriría que hace falta reconocer el disco para jugarlo.* **Eso sigue en pie
para lo que decía: el juego no tiene tapa de fondo, ni velada ni de ningún tipo, y sigue en una
capa (el grano).** Lo que cambia es que **la pantalla ahora lleva un recorte real pegado**: la
portada es la tapa del libro de *Luzbelito* (mármol, lomo y esquinero), la última hoja lleva el
esquinero, y la tarjeta y la vista previa muestran la tira del libro bajo la hoja.

Por qué no contradice la razón de la fila:

- **No es una capa de fondo.** Es un detalle recortado en el flujo (`UX-04`, forma 1), con borde
  grueso, sombra dura y rotación: no entra en el techo de dos capas de `§1.2`.
- **No identifica el disco.** `D-57` punto 8: sin el óvalo, sin la figura y sin la palabra
  LUZBELITO. Quien no conoce el disco ve un libro de cuero y mármol; quien lo conoce, además, lo
  reconoce. **Reconocible, no exigido**: la misma regla de `BR-36`.
- **Ninguna pieza es de un cuadrante.** Son las mismas para las cuatro maneras (`D-57` punto 8): ningún
  resultado se viste mejor que otro.
- **Ningún texto va sobre la foto.** Lo que se lee va sobre papel, así que no hay velo ni par nuevo.
- **Sigue sin movimiento de cámara.** Las piezas no se desplazan, no hacen parallax y no entran con paso
  propio. El único movimiento de la pantalla es el sello del momento, con `--duracion-paso` (`UX-36`
  §4.5), que respeta `§1.1` (≤ 400 ms) y `§1.3` (la acción principal es tocable desde el cuadro cero).

**`§3` (lo que nunca se mueve) sigue entero.** `§4` no suma tokens: la pausa de la elección
(`--pausa-eleccion`, 600 ms) es **espera de información**, como `--duracion-toque`, y por eso tampoco
la apaga el corte de movimiento reducido (`§5`).

**Una regla que la tabla no repite en cada fila porque es de todas:** ninguna fila
supera el techo de 2 capas del `§1.2`, y donde hay parallax, ninguna capa lo hace más
allá del 8 % del `§1.4`. Y el grano —presente en las diez filas, siempre a la misma
opacidad— es la única capa que de verdad es "base" en el sentido de `D-19`: no se le
mide profundidad porque no rota, ni de color ni de intensidad, en ningún lugar del
sitio.

---

## 3. Lo que nunca se mueve

Cuatro categorías, y es una lista cerrada — no "todo lo demás se puede animar", sino
"esto no se toca pase lo que pase":

1. **Los rótulos.** `LEYENDA`, `TESTIMONIO`, la insignia de rótulo del quiz, la ficha
   `RES-` (`.fuente-chip`), `.marca-rotulo`, `.articulo-tipo`. Aparecen en el mismo
   cuadro que el resto del texto de la pantalla, sin entrada propia, sin fade, sin
   ningún efecto que la atmósfera del lugar les imponga. Es el rótulo el que sostiene el
   misterio (`§0`): si el rótulo también "atmósfera", deja de ser piso firme.
2. **Los estados de acierto y error.** `--acento-3` (verde) y `--acento-4` (rojo) no
   llevan movimiento de cámara: nunca entran con fade, nunca tienen parallax, nunca se
   tiñen con el disco del lugar. Lo que **sí** conservan, y no es una excepción a esta
   regla sino otra categoría entera, es el micro-cambio de borde/fondo de 120 ms que
   `.opcion` ya tiene (`juego.css:104`) — eso no es atmósfera, es la confirmación de que
   el toque llegó, y por eso vive aparte con su propio nombre de token (`§4`) y su
   propio trato bajo `prefers-reduced-motion` (`§5`).
3. **Los símbolos funcionales.** ✔, ✕, ◆, ❝. Estáticos, iguales en cualquier lugar del
   sitio, sin animación de entrada ni de énfasis.
4. **Las tres pantallas de registro 3** (Bulacio, Olavarría, la muerte del Indio):
   **la pantalla entera**, no solo el párrafo rotulado. Sin velo, sin capa de fondo más
   allá del grano constante, sin transición de entrada distinta a la genérica del
   cascarón, sin parallax aunque el resto de la Redondopedia sí lo tenga. Ya está en la
   fila correspondiente del mapa de `§2`, y se repite acá porque es la única fila del
   mapa que no es "un lugar con su clima" sino "un lugar sin clima, a propósito".

---

## 4. El catálogo de nombres de token

Nombres para que `T-177` los escriba en la hoja 12 del lienzo primero y en
`tokens.css` después (circuito de `.claude/rules/diseno-marca.md`). **Ningún valor
acá**: ni milisegundo, ni curva, ni hex. Dos familias, coherentes con lo que ya existe
(`--espacio-1`, `--toque-min`, `--velo-tapa`, `--radio`, `--linea`):

### Movimiento (tiempo y curva)

| Token | Para qué sirve | Hoy vive como |
|---|---|---|
| `--duracion-toque` | La confirmación de que el dedo tocó algo: el cambio de borde/fondo de `.opcion`. Es información, no atmósfera — por eso está separada de las de abajo y `§5` la trata distinto | `120ms` a mano en `juego.css:104` |
| `--duracion-paso` | El tránsito completo entre dos pantallas, techo de `§1.1` | No existe — lo crea `ADR-03` (`T-180`) junto con el mecanismo |
| `--duracion-umbral` | Cada sub-paso del asentamiento de la portada (el grano, la franja, la marca), mismo techo de `§1.1` | No existe |
| `--duracion-vuelo` | El ciclo del vuelo de la mosca | `17s` a mano en `sitio.css:147` |
| `--curva-cinta` | La curva de aceleración/desaceleración que comparten el paso, el umbral y el vuelo — una sola curva para que se note que es la misma cámara en todos lados, no una por efecto | No existe |

### Aire (profundidad y velos)

| Token | Para qué sirve | Hoy vive como |
|---|---|---|
| `--hondura-transito` | Cuánto se oscurece la tinta durante `--duracion-paso` y vuelve a su valor de reposo al terminar (`§0`, corrección 1). Un filtro transitorio, nunca un segundo `--fondo` | No existe |
| `--deriva-capa-fondo` | El recorrido máximo de una capa de fondo al desplazar, techo de `§1.4` | No existe |
| `--velo-tapa` / `--velo-tapa-titular` | El velo que separa el texto del recorte real detrás — **se reusan sin cambios**, ya están medidos y testeados (`UX-04`, `D-21`) | Ya existen en `tokens.css:136-137` |

---

## 5. `prefers-reduced-motion`, pieza por pieza

El corte de hoy (`tokens.css:203-210`) usa el selector universal `*, *::before,
*::after` y lleva **todo** —duración de animación y de transición— a `0.01ms`. Eso
apaga la mosca, que es correcto, y de paso apaga los 120 ms de `.opcion`, que es el
defecto que la auditoría de `impeccable` dejó anotado como P3 desde el 2026-08-24 y que
`T-178` tiene que cerrar. **La regla que reemplaza al `*`:** el corte deja de operar por
selector y pasa a operar por familia de token — todo lo de "Movimiento" y "Aire" de
`§4` se fuerza a duración/recorrido cero, **excepto `--duracion-toque`, que el corte no
toca nunca.**

| Pieza | Con movimiento reducido | Qué pasa con la información |
|---|---|---|
| Vuelo de la mosca (`--duracion-vuelo`) | **Se apaga.** Queda quieta en su posición de partida (o en la que tenga si sobrevive el tránsito, `T-183`) | Ninguna: es puramente decorativa, no hay nada que reponer |
| Confirmación de toque de `.opcion` (`--duracion-toque`) | **Se conserva, siempre.** Es la única duración que este corte no apaga | — es la información en sí misma. Apagarla sería el defecto que esta sección existe para cerrar |
| Tránsito entre pantallas (`--duracion-paso`, `ADR-03`) | **Se apaga.** El cambio de pantalla es instantáneo: sin crossfade, sin `--hondura-transito`, sin parallax de por medio | Ninguna se pierde: qué lugar es cada pantalla ya se lee por el tinte fijo (borde, color de rótulo, letra grande de `D-19`), que son estáticos y no dependen del movimiento |
| Umbral de la portada (`--duracion-umbral`) | **Se apaga.** La portada aparece entera y quieta desde el primer cuadro — no "más rápido", directamente sin secuencia | Ninguna: el umbral no dice nada que la portada en reposo no diga ya |
| Hondura de tránsito (`--hondura-transito`) | **Se apaga.** El filtro de brillo nunca se aplica; la tinta queda siempre en su valor de reposo | Ninguna: es la lectura correcta de la corrección 1 del `§0` — sin movimiento, no hay "más honda" que perder, porque nunca hubo un segundo valor de reposo |
| Deriva de capas de fondo (`--deriva-capa-fondo`) | **Se apaga.** Las capas quedan fijas en su posición de reposo, 0 % de recorrido | Ninguna: la profundidad la comunica que la capa existe (recorte real + velo), no que se mueva |
| Rótulos, estados de acierto/error, símbolos funcionales | No aplica — no llevan movimiento propio en ningún estado (`§3`) | — |
| Las tres pantallas de registro 3 | No aplica — nunca tuvieron atmósfera que apagar (`§2`, `§3`) | — |

**La prueba que `T-179` tiene que poder correr:** con `prefers-reduced-motion: reduce`
activo, `document.activeElement` después de tocar una opción del quiz sigue mostrando el
cambio de borde/fondo, y ningún `getComputedStyle(...).transitionDuration` de `.opcion`
da `0.01ms`. Es exactamente el caso que hoy falla.

---

## 6. Cómo se reconoce que fallamos

Tres síntomas, concretos y medibles — la vara de `T-193`:

1. **Un elemento clickeable tiene su propia animación de entrada, rebote o brillo que
   ningún otro elemento de la pantalla comparte.** Un `@keyframes` o una `transition`
   nueva que vive pegada a un botón, una tarjeta o un ícono puntual, con un nombre de
   token que no es ninguno del catálogo de `§4`. Es el elemento pidiendo aplausos, no la
   cámara moviéndose — el caso exacto que la doctrina prohíbe en su primera frase.
2. **Un paso pasa de 400 ms, o el dedo toca antes de que el botón responda.** Cualquiera
   de las dos rompe un número de `§1` (1 o 3) que se puede medir con un cronómetro y un
   toque real, no con el ojo. Si hace falta "esperar a que termine" cualquier cosa antes
   de tocar `JUGÁ`, volvió el molinete.
3. **Con el movimiento apagado, el sitio dice menos que con el movimiento prendido.**
   Si desaparece una confirmación, una pista de "dónde estás" o cualquier información
   que antes existía —no la animación en sí, la información que llevaba encima—, el
   `§5` no se cumplió. Es la comprobación más barata y la más importante: activar
   `prefers-reduced-motion` y jugar una vuelta entera de cualquier juego sin que falte
   nada de lo que hoy se lee.

---

## Cómo se verifica

Nada de esta hoja es código, así que no hay comando propio que correr sobre ella. Lo que
sí es corrible, y queda para quien construya cada tarea (`D-12`):

- **`§1` y `§4` (los números y los nombres):** grep sobre `src/styles/*.css` después de
  `T-177` — cero duraciones o curvas sueltas fuera de `tokens.css`, y los nombres de la
  tabla de `§4` existen ahí, ninguno inventado en el camino.
- **`§2` (el mapa):** a simple ojo, cada lugar construido respeta su columna de capas —
  nunca más de 2, y el juego de dos ejes se queda en 1 aunque el resto suba.
- **`§3` (lo que nunca se mueve):** las tres pantallas de registro 3, con
  `prefers-reduced-motion` prendido y apagado, se ven exactamente igual entre sí en las
  dos corridas — es la prueba de que nunca tuvieron nada que apagar.
- **`§5` (el corte):** `node --test src/lib/movimiento.test.ts` (`T-179`) en verde, con
  el caso puntual de que `--duracion-toque` sobrevive al corte y las demás no.
- **`§6` (el fallo):** es la vara de `Docs/REVISIONES/REV-10-el-sitio-como-lugar.md`
  (`T-193`), en un celular real, con las tres preguntas de esta sección más la cuarta que
  ya trae el plan del ciclo: *¿se siente un lugar, o se siente una web con animaciones?*
