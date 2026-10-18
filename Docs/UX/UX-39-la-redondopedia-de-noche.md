# UX-39 — La Redondopedia de noche: el lugar, los tres hilos del pie y la portada

> Rol dueño: `experiencia`. 2026-10-18 (`T-451`), sobre `D-75` (2026-10-17). Rama
> `diseno/redondopedia-inmersiva`.
>
> **De dónde sale.** `D-75`, pedido directo del usuario, textual: *"Hace una pulida extrema de ui/ux a la
> redondopedia, debe sentirse inmersiva, misteriosa y mistica. Al mismo tiempo debe ser facil de leer y
> que leyendo algo te de ganas de seguir con otra cosa, no de forma forzada sino que cause interes
> real."* El hilo principal lo construyó antes de que esta hoja existiera. **Esta hoja es el flujo y las
> medidas de lo construido, la enmienda que le debe a `UX-20` §2, y lo que encontré al leerlo.** Donde
> `D-75` y el código dicen cosas distintas, manda el código (`§11`).
>
> **Consume:** `D-75` entera; `D-14` (los tres rótulos, molinetes abiertos), `D-17` (voseo), `D-19` (la
> mezcla), `D-21` (tapas reales con velo y crédito), `D-34` (la racleta no es un fundido), `D-63` (la
> multitud, la primera capa con deriva), `D-64` (sin sombra), `D-67` (la letra Redonditos), `D-72` y
> `D-73` (las dos puertas); `US-05` (criterios 1, 3, 4 y 6), `BR-07`, `BR-08`, `BR-09`; `UX-20` entera,
> `UX-22` §9 (ficha y rodillo), `UX-05` §7b y §7c, `UX-04`; `ADR-03` (el tránsito, tres nombres); `T-187`;
> `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`. Leído: `D-75`;
> `Docs/SUGERENCIAS/HILO-para-experiencia-y-contenido-d75-la-redondopedia-de-noche.md`;
> `src/pages/redondopedia/index.astro` y `[slug].astro`; `src/layouts/Base.astro`;
> `src/components/TarjetaArticulo.astro`; `src/scripts/oreja.ts`; `src/lib/redondopedia.ts` (sección "Los
> hilos"); `src/lib/sitio/arte.ts`, `letras.ts`, `graves.ts` y `copy.ts` (`REDONDOPEDIA`);
> `src/styles/tokens.css` y los bloques de `src/styles/sitio.css` que nombran `D-75`; los tests
> `contraste.test.ts`, `fuentes.test.ts`, `redondopedia.test.ts` y `estilos.test.ts`.
>
> **Resuelve:** la parte de pantalla de `US-05` (cómo se entra, cómo se lee y adónde se sigue); la
> enmienda de `UX-20` §2; los dos puntos que `D-75` dejó "a ojo" y son de `experiencia` (el orden de la
> portada y `:visited`, `§5.7` y `§5.8`). **No resuelve:** el CSS ni los componentes (hilo principal); las
> palabras ni los ganchos (`contenido`, `T-452`); el lienzo (`T-450`, tarea del usuario, `§12` dice qué
> tiene que mostrar); la prueba en un iPhone (`T-453`, `§10`).
>
> **No hay brief de arte original.** Todo sale de tapas que ya están en el sitio (`public/tapas/`), de la
> racleta y de la letra de la banda. No hay pieza que producir.
>
> **Lo que no pude hacer, dicho antes que nada.** Esta sesión no tuvo shell (`D-12`): no corrí ningún
> test, no abrí un navegador, no medí un píxel. Los números de esta hoja son de tres clases:
> **leído** (está escrito en el código o en un token, y lo cito), **cuenta** (mía, hecha a mano sobre lo
> leído) y **por medir** (va a `§10`). Los píxeles de pantalla son a 375 × 667 y a 1366 × 657, y las
> cuentas de alto suponen la letra del sistema a 16 px. Donde una cuenta mía y una medida del hilo
> choquen, vale la medida.

---

## 0. El principio, y lo que enmienda

**El misterio vive en el borde de la hoja; la lectura, en el medio.** Es la salida que `T-187` ya había
razonado (un artículo con clima propio es más difícil de leer y borra la frontera entre el hecho y la
leyenda) y que `D-75` toma entera. La hoja de un artículo tiene tres franjas, y cada una puede cosas
distintas:

| Franja | Qué hay | Qué puede | Qué no puede |
|---|---|---|---|
| **Arriba** | el regreso, la tapa velada, el título, el renglón de lo que hay adentro | tinta de disco, letra de la banda, la deriva de la tapa (`§2.5`) | llevar un párrafo rotulado debajo del velo |
| **En el medio** | la bajada, la ficha, el cuerpo rotulado | nada: es tinta lisa, quieta | moverse, entrar con efecto, teñirse de un disco |
| **Abajo** | los tres hilos | tarjetas con gancho, una leyenda prestada | prestar nada de las tres pantallas graves (`§6`) |

**Lo que enmienda**, sin borrar lo viejo:

| Qué | Qué decía | Qué dice ahora |
|---|---|---|
| `UX-20` §2, fila "Redondopedia — un artículo" | "Nada de movimiento nuevo"; 1 capa (grano) más un detalle flotante | 2 capas (grano y el lugar), con la deriva de `UX-20` §1.4 atada a la salida de la ventana; el detalle flotante ya no existe. Hecho en `UX-20` |
| `UX-20` §2, fila "Redondopedia — portada e índice" | 2 capas en un recuadro de cabecera | la capa ya no está en un recuadro: es el lugar de la hoja. Hecho en `UX-20` |
| `T-187` (frase) | la inmersión de un artículo es "tipográfica y nada más" | tipográfica y de borde: el cuerpo sigue igual |
| `UX-05` §7b y §7c | un detalle recortado flotando junto al título, nunca detrás del cuerpo | el lugar lo reemplaza; el crédito se sigue juntando en el pie (`§2.9`). No toqué `UX-05` |

**No cambian:** la fila de las tres pantallas graves de `UX-20` §2 y `UX-20` §3 entero (`§6`).

---

## 1. El recorrido (`US-05`)

La Redondopedia es otro modo de uso (`US-05` criterio 6, `D-20`): no hay partida que cerrar ni
resultado que compartir (`REDONDOPEDIA.bajada` lo dice). Acertar y fallar no existen. **Lo que sí pide
esta hoja es que la primera decisión quepa en una pantalla y que el final de cada lectura ofrezca la
siguiente.**

| # | Pantalla | Qué pasa |
|---|---|---|
| 1 | La portada | Llega el lugar (*Gulp!* velada), el título, el renglón que canta y la bajada. Nada pide nada. Se baja, o se toca lo que asoma |
| 2 | La oreja del día | Una leyenda del archivo con su rótulo `Leyenda` y un enlace "Seguí en …". Lectura de unos 12 segundos en el peor caso (230 caracteres a 200 palabras por minuto, cuenta). **Un toque lleva a un artículo** |
| 3 | Un artículo | La tapa de su disco o de su parte sube detrás del título; el renglón de abajo dice cuántos hechos, leyendas y testimonios trae y cuánto se tarda. Se lee |
| 4 | El pie | Tres hilos: lo que el artículo recomienda, una leyenda de otro artículo, y quién lo nombra. Un toque en cualquiera vuelve a 3 |
| 5 | Salir | `← A LA REDONDOPEDIA` arriba y abajo (`REDONDOPEDIA.volverPortada`); o el botón de volver del navegador |

- **Si se abandona a mitad:** no hay nada que guardar ni que perder. Lo ya abierto queda apagado en las
  tarjetas por el propio navegador (`§5.8`).
- **Otras entradas**, que esta hoja no cambia: el enlace "leé más" de un juego (`US-05` criterio 4), los
  enlaces del cuerpo (`BR-09`), los saltos de la portada.
- **Tiempo:** un artículo va de 1 a 6 minutos (lo guarda `redondopedia.test.ts`) y lo dice antes de
  empezar. No promete dos minutos (criterio 6). La oreja y el pie sí son de un toque.

---

## 2. El lugar

### 2.1 Qué es

La tapa velada que sube desde arriba de la ventana, **detrás del regreso y del título**, y se pierde en
la tinta antes del cuerpo. La pinta `Base.astro` cuando una página le pasa la prop `lugar`: un
`div.lugar[aria-hidden]` con un `div.tapa-fondo.tapa-fondo--lugar` adentro, cuya imagen entra por la
variable `--tapa-lugar` escrita en línea (`ADR-05.7`).

- **Es hermana de la hoja y no hija** (como la gente del pie del portal): mide la ventana y no la
  columna, y sube hasta el borde de arriba de todo. Va con `position: absolute`, `z-index: 0`,
  `pointer-events: none`. La hoja va en `z-index: 1`. Todo lo tocable queda por encima.
- **El regreso queda pegado encima**, como una cinta de `--papel`. La marca chica, que es rojo de marca
  en letra chica y no llega a AA sobre el peor caso del velo (`D-21`), lleva una chapa de `--fondo` cuando
  hay lugar (`body:has(> .lugar) .marca-chica`).
- **Es una `.tapa-fondo` como las demás:** velo plano, racleta abajo, nombre de tránsito `lugar`. No
  suma ninguna pieza nueva al sistema.

### 2.2 Qué imagen viste a cada artículo

| Artículo | Imagen | De dónde sale |
|---|---|---|
| **Disco** (los 10) | su detalle de cerca, `public/tapas/detalle/<slug>-zoom.jpg` | `lugarDeArticulo()` en `arte.ts` |
| **Hito y persona** (parte "historia") | el fondo de *Gulp!*, `gulp-pincelada` | `LUGAR_POR_CATEGORIA.historia` |
| **Tema** (parte "letras") | el fondo de *La mosca y la sopa*, `mosca-olla` | `LUGAR_POR_CATEGORIA.letras` |
| **Concepto y leyenda** (parte "mitología") | el fondo de *Lobo suelto*, `lobo-tiras` | `LUGAR_POR_CATEGORIA.mitologia` |
| **Los tres graves** | **ninguna** | `SIN_DETALLE_POR_TONO` |

- **Cada parte viste el disco que `D-19` le dio**, con el mismo archivo que ya viste la pantalla de esa
  parte del sitio. `LUGAR_POR_CATEGORIA` no tiene fila de "discos": el artículo de un disco se viste con
  **su** tapa, porque ponerle la de otro confundiría cuál es cuál.
- **Si falta el archivo, el artículo se queda sin lugar** (la función devuelve `null`) y sin el aire de
  arriba: el título sube y nada se rompe. Hoy están los diez `-zoom` y los tres fondos.
- **El disco muestra su tapa dos veces**, y no es un error: de cerca y velada detrás del título, y entera
  como ficha estampada (`figure.figura-tapa`, `UX-22` §9) debajo. La ficha está en el flujo y no cuenta
  como capa.

### 2.3 Las medidas

| Qué | Valor | Clase | Para qué |
|---|---|---|---|
| `--alto-lugar` | `30rem` (480 px) | leído, `tokens.css` | Cuánto baja la capa. Con techo de ventana: `height: min(var(--alto-lugar), 100svh)` |
| `--aire-lugar` | `clamp(2.5rem, 12svh, 6.5rem)` (de 40 a 104 px) | leído | Cuánta tapa se ve arriba del título antes de que se escriba nada: el escalón que se baja al entrar |
| `--ancho-lugar` | `52rem` (832 px) | leído | Tope de ancho en la computadora: a menos del doble de lo que miden los archivos (400 a 590 px) |
| `--desgaste` local | `7rem` (112 px), el doble del de las demás capas (`3.5rem`) | leído, `.lugar` | La racleta levanta más despacio |
| `--textura-rodillo-canto` | el rodillo de siempre con las vetas a lo alto (pieza de 14 × 240) | leído | Gasta los costados |
| `--deriva-capa-fondo` | `8%` (`0%` con movimiento reducido) | leído, ya existía | Tope de la deriva (`UX-20` §1.4) |
| `--velo-tapa` | el de siempre | leído | El velo |

**El aire de arriba** se aplica a `.articulo--con-lugar .articulo-cabeza` y a `.umbral-redondopedia`. Sin
lugar no hay aire.

### 2.4 El velo y la racleta

- **Velo plano:** `linear-gradient(var(--velo-tapa), var(--velo-tapa))` sobre la imagen, en la misma
  declaración (`D-21`, `D-64`). Dos paradas idénticas; nada se desvanece por degradado. La imagen se
  posa en `center 35%`.
- **La racleta** es la máscara de `.tapa-fondo`: el rodillo más un degradado, ambos cruzados. Con
  `--desgaste: 7rem`, los últimos 112 px se gastan. **En los 62 de más abajo (el 0,55 del desgaste) la
  única alfa que queda es la de la veta de la textura**; no es un fundido (`D-34`). Cuenta sobre los
  480 px: la tapa se ve plena hasta los 368 y hacia los 418 deja de ser una imagen (queda solo la veta).
  **Esos 418 px son el número que protege al cuerpo** (`§10`, M1).
- **Nunca detrás del cuerpo rotulado.** La hoja de un artículo mide cuatro ventanas, y una tapa estirada
  a ese alto sería una mancha (`UX-04`).

### 2.5 La deriva

`animation-timeline: view()` con `animation-range: exit`, el `deriva-de-capa` de la multitud **dado
vuelta** (`animation-direction: reverse`), dentro de `@supports (animation-timeline: view())`.

- **Qué se ve:** la tapa arranca subida hasta el 8 % (38 px, cuenta: 8 % de 480) y termina en su lugar
  justo cuando ya salió de la ventana. Mientras se baja, queda un poco atrás del título. Es profundidad,
  no un elemento moviéndose.
- **Por qué cumple los candados de `UX-20` §1.4:** nunca descubre un borde. El de arriba arranca 38 px
  por encima del borde de la hoja y solo puede bajar hasta su lugar a medida que se desplaza, así que
  queda siempre fuera de la ventana (cuenta; el rebote del borde en un iPhone es M6). El de abajo es la
  racleta. Cero JavaScript. El techo es `--deriva-capa-fondo`.
- **Con movimiento reducido o sin `view()`:** la tapa se queda quieta, en su posición de reposo. No se
  pierde ninguna información (`UX-20` §5).
- **Es la segunda capa del sitio con deriva**; la primera es la multitud del pie (`D-63`).

### 2.6 El tránsito

La capa hereda `view-transition-name: lugar` (`ADR-03` fija tres nombres: `lugar`, `marca`, `mosca`).
**Pasar de un artículo a otro, o de la portada a un artículo, corre la cámara de una tapa a la otra**, sin
sumar un nombre.

- **Candado:** tiene que haber una sola `.tapa-fondo` por documento. Dos con el mismo nombre cancelan el
  tránsito entero y no avisan. Por eso la portada dejó de pintar su propia capa y de pasar `conBanderas`
  (`index.astro` lo cuenta). Esta hoja lo repite porque es el defecto que ya pasó una vez.
- **Con un grave** el nombre existe de un solo lado. Qué hace el navegador con eso es de `ADR-03` y no lo
  probé.
- **Dentro de `UX-20` §1.1:** la deriva va atada al desplazamiento y no a un reloj; el paso sigue siendo
  el de siempre.

### 2.7 En la computadora (desde 46 rem)

La capa mide `min(100%, 52rem)`, centrada, y **no llega a los bordes de la ventana**: a 1366 px sería una
tira ampliada tres veces. Un costado recto en el medio de la pantalla es una caja, así que se gasta con
la misma racleta puesta de canto (`--textura-rodillo-canto`). **Son dos máscaras, una sobre otra:** la
caja de afuera (`.lugar`) gasta los costados y la de adentro (`.tapa-fondo--lugar`) el borde de abajo.
Se multiplican sin componerse. Es lo más nuevo y lo que más hay que mirar (`§10`, M5 y M6).

### 2.8 Los cuatro límites de `UX-20` §1

| # | Límite | Cómo cumple el lugar |
|---|---|---|
| 1 | 400 ms por paso | No hay duración: la deriva va atada al desplazamiento. El tránsito es el de siempre |
| 2 | 2 capas | Grano más el lugar. El cuerpo no tiene fondo. Un grave tiene 1 |
| 3 | 0 ms hasta poder tocar | La capa es `aria-hidden` y `pointer-events: none`; el regreso y el título están desde el primer cuadro |
| 4 | 8 % de recorrido | Usa `--deriva-capa-fondo`, que vale 8 % |

### 2.9 El crédito (`D-21`)

Baja resolución: los fondos miden entre 400 y 590 px (`tokens.css`). Crédito: la página le pasa a `Base` la
lista `tapas` y el pie nombra cada disco. En un disco, el propio título; en los demás, lo que devuelve
`discosDe([lugar.nombre])`; y las tarjetas de "Seguí por acá" que son discos suman la suya. En la portada,
*Gulp!* y los diez discos del índice.

---

## 3. La cabeza del artículo

Dentro de `header.articulo-cabeza`, en este orden: el título (`h1`) y `p.articulo-adentro`. **El tipo ya no
va arriba del título**: competía con él por ser lo primero que se lee, y pasó a ser el sello al principio
del renglón de abajo.

### 3.1 El título, en cuatro casos

| Caso | Letra | Tinta | Tamaño (leído) |
|---|---|---|---|
| **Entra entero** (hoy 33 artículos, sin contar los graves: cuenta sobre los 38 títulos) | Redonditos de Ricota Fan (`--fuente-luzbelito`), siempre en mayúscula y de un solo peso | la de su categoría o la de su disco, con la sal de la almohadilla como el título de cada juego | `clamp(2.3rem, 10.8vw, 3.3rem)`: 40,5 px a 375, 52,8 px arriba |
| ***Luzbelito*** y **Los Decoradores** | la rotulada (`--fuente-rotulada`) | la misma tinta y la misma sal | `clamp(1.9rem, 8.6vw, 2.6rem)` |
| ***Oktubre*** | la de la banda | **`--texto`**: su tinta es el rojo de marca, que `D-21` saca de encima de una tapa velada. Solo en el artículo; en el índice y en las tarjetas, sobre `--fondo`, sigue en su rojo | el de arriba |
| **Los tres graves** | la rotulada | `--texto`, sin sal | `1.7rem` |

- **"Entra entero"** lo decide `tituloEnLaBanda()` en `sitio/letras.ts`: todas las letras del título,
  sin espacios, tienen que estar en lo que la letra dibuja. `fuentes.test.ts` abre el archivo de la
  fuente y falla si la lista se adelanta a lo que la letra tiene. Una letra que falta la pone el
  navegador con la de repuesto, a mitad de palabra.
- ***Luzbelito* va aparte aunque entre**, porque la letra no es la de su tapa, solo se le parece
  (`diseno-marca.md`): escribirlo con ella diría que sí lo es. Los Decoradores queda afuera por los
  paréntesis, que la letra no tiene.
- **Contraste:** los títulos sobre el peor caso del velo llegan a 3:1 (doce tintas, lista en
  `contraste.test.ts`).

### 3.2 Lo que hay adentro

El renglón de abajo del título, en **registro 3**: el sello del tipo, y después, separados por un punto,
`N hechos`, `◆ N leyendas`, `❝ N testimonios` y `se lee en N min`. La casilla en cero no se escribe.

- **Es la promesa de `D-14` en una línea:** el que va a encontrar una leyenda lo sabe antes de leerla.
- **Cuenta los párrafos del cuerpo** (`contenidoDe()`), no los datos de la ficha. Hoy en los 38 los que
  tienen una leyenda o un testimonio en la ficha lo tienen también en el cuerpo (lo miré en el JSON), así
  que el aviso no queda corto. Nada lo guarda: ver `§11` A3.
- **Los minutos** salen de 200 palabras por minuto y valen por lo menos 1.
- **Contraste:** `--texto-tenue`, `--rotulo-leyenda` y `--rotulo-testimonio` llegan a 4,5:1 sobre el peor
  caso del velo. El sello del tipo va sobre su propia chapa de `--fondo`, con borde de su tinta y un giro de
  −1,2°.
- **Los graves también lo llevan**: es registro 3 y es la promesa de `D-14`.

### 3.3 La lectura

La bajada sube a 1,12 rem (≈ 18 px) y el cuerpo a **1,0625 rem (17 px)** con interlineado 1,68. `D-75`
dice que la columna de 34 rem pasa de 75 a entre 60 y 70 caracteres por renglón (sin medir acá). Los
párrafos rotulados llevan más aire alrededor (`--espacio-3` arriba y abajo): cada uno es una casilla
distinta y el aire es parte de la marca. **Es lo único que cambia en el medio.** La capitular de la bajada
(`T-187`) se queda, y no está en los graves.

---

## 4. Los tres hilos del pie

Un `footer.hilos` después del cuerpo y antes del botón de corrección. **El orden es el de cercanía**, de
lo más dirigido a lo más abierto: lo que el artículo recomienda, algo que se cuenta en otro lado, y desde
dónde lo nombran. Cada hilo se pinta solo si tiene algo; cada uno es una región con su título (`h2.lado`)
y `aria-labelledby`.

### 4.1 Seguí por acá

El `veaTambien` del artículo (`BR-09`), que dejó de ser un renglón de títulos pelados y pasó a tarjetas.
Un título pelado no da ningún motivo para tocarlo.

**La tarjeta** (`TarjetaArticulo.astro`, la misma de la portada) dice tres cosas, cada una con su renglón:

1. **El título** (nombra), en la letra de la banda si entra (`§3.1`), en la tinta de su categoría o disco.
2. **El gancho** (canta): el arranque del resumen, cortado en palabra a 110 caracteres acá y a 130 en la
   portada, con "…" si cortó. **No es una frase nueva**: si `contenido` reescribe un resumen, cambia solo.
3. **Lo que hay adentro** (rotula): `◆ N leyendas` si hay, `❝ lo contó X` o `lo contaron X y Y` si hay
   testimonio (el nombre es lo que va antes de la coma o del paréntesis en `quien`), y `se lee en N min`.

- **Un disco lleva su tapa chica** (4 rem, borde teñido por su tinta, giro −2,5°, `alt` vacío porque el
  título está al lado), y la página la acredita.
- **Giro leve y alterno** (−0,4° y 0,35°); alto mínimo `--toque-min` (48 px).
- **Si un `quien` empieza con otra cosa que un nombre**, la tarjeta lo muestra tal cual (`T-452`).

### 4.2 Pará la oreja

El arranque de **una leyenda que vive en otro artículo**, con su rótulo (`◆ Leyenda`, el mismo
`.parrafo--leyenda` del cuerpo) y debajo `Seguí en <título> →`, un enlace de 48 px de alto.

- **Qué se muestra:** hasta 230 caracteres, cortado en el último punto que caiga entre el 80 y el 230;
  si no hay, en palabra con "…".
- **Cuál:** una por artículo, **siempre la misma** (la semilla sale del slug): como un libro, no una
  distinta en cada visita. Prefiere un artículo al que este no manda ya (enlaces del cuerpo y "vea
  también"), que es el que abre una puerta nueva; si ya manda a todos, toma el primero de la ronda.
- **El filtro `seCuenta`** deja pasar solo los arranques con *circula, corre, cuentan, se dice, versión,
  rumor, historia, se repite*. **Por qué:** la casilla `leyenda` también rotula el dato que no tiene
  fuente. La nómina de los Fakires es leyenda en su artículo porque no está confirmada, y eso es honesto
  ahí, pero no es algo que se le cuente a nadie al oído. La oreja trae lo que se cuenta.
- **Solo `leyenda`.** Ningún testimonio se presta: la voz de alguien con nombre no sale de su ficha.
- **Los graves ni la llevan ni la prestan.** La muerte del Indio tiene un párrafo de versiones que
  circularon; sacarlo de ahí para ponerlo de anzuelo al pie de otro artículo es la voz que esas tres
  pantallas no admiten (`voz-ricotera.md` §6).
- **La ronda tiene once arranques** según `D-75` (no los conté; el test pide por lo menos seis). Si uno
  no funciona fuera de su artículo, la salida es reescribir el arranque de ese párrafo, **no** sumar una
  excepción al código (`T-452`).
- **Lo que calla:** el arranque no lleva la ficha de fuente del párrafo, si la tiene. El rótulo sí, y el
  párrafo entero está a un toque.

### 4.3 También anda por

Los artículos que nombran a este (los entrantes del grafo de `BR-09`) que **no** estén ya en su "vea
también" ni sean el de la oreja. Enlaces de texto, subrayados (`--acento-2`, 2 px), corridos en línea y
sin punto entre uno y otro. Al Indio lo nombran 32 artículos y 27 quedan en esta línea (`D-75`).

- **Es el menos pensado para decidir y el más útil para recorrer**: es "navegar como en Wikipedia"
  (`BR-09`) dado vuelta. Por eso va tercero.
- **Ojo con el toque:** `§9` y `§11` A2.

### 4.4 Qué hace que den ganas, y qué no

Los tres hilos van de lo **dirigido** (el artículo te recomienda algo), a lo **sorpresivo** (una leyenda
que no buscabas), a lo **abierto** (un mapa de quién lo nombra). Ninguno promete ("te puede interesar"),
ninguno cuenta ("3 de 38 leídos") ni empuja (nada se abre solo). La razón para tocar siempre es una cosa
que el artículo ya dice.

---

## 5. La portada

### 5.1 El orden

1. **El umbral**. 2. **La oreja del día**. 3. **La clave de los rótulos**. 4. **Las dos puertas aparte**.
5. **Los saltos**. 6. **El índice**.

### 5.2 El umbral

`header.umbral-redondopedia`. Aire de arriba `--aire-lugar`; el título `LA REDONDOPEDIA` en la letra
de la banda, con la sal, en `--cat-historia` (el rojo del título manuscrito de *Gulp!*, que es el disco
que viste esta portada, `D-19`) y de `clamp(2.5rem, 12.5vw, 3.6rem)`; debajo, **la línea que canta**
("Tenés todo el archivo tirado en el piso.", `LUGARES.redondopedia`) y **la que nombra** ("La enciclopedia
ricotera. Se entra y se sale cuando quieras…", `REDONDOPEDIA.bajada`). **Prueba de las dos líneas
(`voz-ricotera.md` §5):** tapá la que canta y el que llegó por un enlace sabe dónde está. Aprobada.

El lugar es *Gulp!* (`fondoTapa('gulp-pincelada')`). Antes era un recuadro con borde (`.portada-redondopedia`)
que encerraba la tapa; el recuadro sigue en las páginas de En vivo y del bestiario (`§11` A4).

### 5.3 La oreja del día

Una leyenda por noche. El armado trae **todas** las leyendas de la ronda en un `ul[data-oreja]`, con la
primera a la vista y el resto con `hidden`. `scripts/oreja.ts` deja visible la del día: `indiceDelDia()`
con la **fecha del teléfono**, que cambia a la medianoche de quien mira, no a la del servidor.

- **Sin JavaScript queda la primera**, que también es una leyenda entera y bien rotulada. El guion no crea
  nodos ni clases: mueve un `hidden` (por eso está en el censo de `estilos.test.ts` como "sin tablero").
- **Una por noche y no al azar:** el que vuelve encuentra algo nuevo, y el que recarga no ve otra
  distinta. Recorre la ronda entera, de a una por noche.
- **Es el mismo `.parrafo--leyenda` del cuerpo**: la única barra lateral que la marca admite es la
  sangría de cita de los párrafos rotulados (excepción declarada en `diseno-marca.md`), y la oreja es una
  cita.

### 5.4 La clave de los rótulos

`div.clave-rotulos`, registro 3: una entrada ("Cada párrafo dice qué es, en el renglón donde aparece.") y
**tres renglones** en una lista de definiciones: `hecho`, `◆ leyenda`, `❝ testimonio`, cada uno en su tinta
de rótulo (que no rota con la mezcla) y con su símbolo, y una frase que dice qué es. Reemplaza a un
párrafo de cinco renglones. Ya no dice "entre fans" (`voz-ricotera.md` §3.8).

### 5.5 Las puertas aparte

Dos tarjetas, *En vivo* y *Bestiario redondo* (`D-72`, `D-73`). No tienen casilla de hecho, leyenda ni
testimonio (cada lista y cada ficha lleva su rótulo adentro), así que **no entran al índice por tipo**.
Van juntas antes del índice, en una columna a 375 y en dos desde 46 rem, con un giro leve (−0,5° y
0,4°). Llevan título y gancho, sin el renglón de adentro. Sus títulos van en la rotulada (`§11` A5).

### 5.6 Los saltos y el índice

- **Los saltos:** `nav.partes` con seis sellos de goma (esquina de 3 px, borde de 2 px, mayúsculas, alto
  `--toque-min`): *La historia, La banda y los suyos, Los discos, Los temas, La cultura ricotera, Las
  leyendas*, cada uno con **cuántos artículos tiene**. Dos columnas a 375 (tres filas) y tres columnas
  desde 46 rem (dos filas). Saltar deja el título de la parte con aire (`scroll-margin-top`). Existen
  porque el índice mide varias pantallas y el que vino a buscar un disco no tiene por qué pasar por la
  historia entera.
- **El índice** va en el orden narrativo de la portada (hito, persona, disco, tema, concepto, leyenda),
  con el rodillo (`hr.rodillo`, `UX-22` §9) entre una parte y la siguiente.
- **Los diez discos** van con su tapa entera, su nombre y su año (`anioDe()`, leído de la ficha del
  disco: no se escribe a mano en ningún lado). La tapa es cuadrada, con el borde teñido por **la tinta
  de ese disco** y un giro leve (−1° y 0,8°); el nombre va en la letra de la banda salvo *Luzbelito*. Dos columnas a 375
  (cinco filas, menos de lo que medían diez tarjetas de texto) y cinco columnas desde 46 rem (dos filas).
  Es el único lugar del índice con imagen: es la parte que se reconoce de vista.
- **Las demás partes** usan la tarjeta de `§4.1` con gancho de 130 caracteres, en una columna a 375 y en
  dos desde 46 rem.

### 5.7 Veredicto del orden: se queda, con una condición

`D-75` dejó el orden "a ojo" y es mío. **Me parece bien cortado**, por esto:

| Lugar | Por qué ahí |
|---|---|
| **Umbral primero** | Nombra y canta; sin eso no hay portada |
| **Oreja segunda** | Es lo primero que se puede *hacer* con el archivo sin saber qué buscar: un toque lleva a un artículo. Es el molinete abierto de la Redondopedia (`D-14`). Y la primera cosa que se lee del archivo es una leyenda, no una instrucción |
| **Clave tercera** | Tiene que estar antes de la primera tarjeta: las tarjetas traen ◆ y ❝, y la promesa de `D-14` va antes de lo que hay que creer. La oreja ya mostró un rótulo; la clave lo explica, como la referencia de un mapa |
| **Puertas cuartas** | No son artículos y se perderían debajo del índice |
| **Saltos quintos** | Pegados a lo que saltan |
| **Índice último** | Es la parte que crece |

**Lo que descarté:** los saltos primero (el que llega sin idea vería una botonera antes de leer nada); el
índice primero con la oreja al final (la oreja no se vería); la clave al final (nadie baja varias
pantallas a leer una instrucción); la clave plegable (pide guardar qué vio cada quien: persistencia
nueva).

**Costo asumido:** el que vuelve a la portada vuelve a ver la clave antes del índice. Los saltos lo
salvan. Mi cuenta gruesa para la clave a 375 es de unos 250 a 300 px (sin medir).

**La condición:** a 375 × 667, la oreja tiene que **asomar su rótulo y las primeras líneas dentro de la
primera pantalla**. Mi cuenta es que arranca hacia los 450 px (16 de relleno, 48 de regreso, 24, 80 de
aire, un título de una o dos líneas de 47 px, la línea que canta y la bajada), pero depende de cuántas
líneas ocupen el título y la bajada, y es **por medir** (`§10`, M2). Si no asoma, la palanca es `--aire-lugar` (más bajo en
pantallas bajas), no la bajada ni la clave.

### 5.8 Veredicto de `:visited`: se queda, como excepción acotada

`.tarjeta-articulo:visited .tarjeta-titulo` y `.disco-del-indice:visited .disco-del-indice-titulo`
pasan el título de su tinta a `--texto-tenue`. Alcanza a las tarjetas del índice, a las de "Seguí por acá",
a las dos puertas y a los discos. **Comunica con color solo**, y `diseno-marca.md` dice que ningún estado
se comunica solo con color. Lo dejo, porque no es un estado de esa clase:

1. **No hay decisión que dependa de él.** No es acierto, ni error, ni rótulo: es memoria. Si alguien no
   distingue el apagado, pierde una ayuda; no pierde nada para leer ni para elegir. Un título apagado
   sigue diciendo lo mismo.
2. **El navegador no deja otro canal.** `:visited` solo admite propiedades de color. Marcar "leído" con
   una palabra obligaría a guardar en `localStorage` qué leyó cada quien: persistencia nueva y un estado
   de progreso, lo contrario de "un mapa de lo que falta y no un estado de juego" (`D-75`) y del "sin
   cuentas". Con `:visited` el sitio no sabe nada de nadie.
3. **No oculta información.** Baja el título de `--tinte` a `--texto-tenue`, un par que ya es AA sobre
   `--fondo`. El gancho, el renglón de adentro y la tapa quedan como están.
4. **Límites:** solo el título; no se extiende al borde, a la tapa ni al gancho; no se copia a otras
   pantallas sin repensarlo. Si algún día se pide un canal sin color, es una decisión con persistencia y
   va a `arquitectura`.

**Pedido al hilo:** esta excepción tendría que quedar escrita en `.claude/rules/diseno-marca.md`, que es
suya. No la toco.

---

## 6. Lo que no se mueve ni se decora (`UX-20` §3)

`UX-20` §3 sigue entero. Cómo queda tras `D-75`:

| `UX-20` §3 | En la Redondopedia de noche |
|---|---|
| **1. Los rótulos** (`LEYENDA`, `TESTIMONIO`, `.fuente-chip`, `.marca-rotulo`, `.articulo-tipo`) | Fríos y quietos. Ninguno entra con efecto ni se tiñe con la tapa. El sello del tipo se apoya en una chapa de `--fondo`, así que no recibe ni el velo ni la deriva. La oreja usa el mismo rótulo `Leyenda` del cuerpo |
| **2. Acierto y error** | No existen acá |
| **3. Los símbolos** (`◆ ❝`) | Idénticos en el renglón de adentro, en la tarjeta, en la clave y en el párrafo. Estáticos |
| **4. Las tres pantallas graves** | Ver abajo |
| **El cuerpo** | Sobre tinta lisa. Sin entrada, sin aparición al bajar, sin nada en los rótulos. **Lo único que cambió es el tamaño de la letra** |

**Prueba de la hoja:** tapá lo de arriba (el lugar y el título) y lo de abajo (los hilos). Lo que queda
es el artículo de antes de `D-75`, con la letra a 17 px.

**Las tres graves** (`walter-bulacio`, `olavarria-2017`, `muerte-del-indio`; la lista vive en
`sitio/graves.ts` y es la misma para todo):

| No llevan | Sí llevan |
|---|---|
| lugar ni aire de arriba; letra de la banda, tinta ni sal en el título; capitular; oreja (ni la llevan ni la prestan); disco en el pie de imprenta | el sello del tipo y el renglón de lo que hay adentro (registro 3); el cuerpo a 17 px; "Seguí por acá" y "También anda por"; el botón de corrección |

Que los graves lleven los hilos de abajo es lo construido, y `D-75` solo les quita la oreja. Dejo dos
puntos en `§11`: el título de su tarjeta (A1) y el gancho de las tarjetas de su pie (A6).

---

## 7. Los casos de 375 px y de 1366 px

| | 375 × 667 | 1366 × 657 |
|---|---|---|
| **El lugar** | 375 × 480 (leído); costados rectos hasta la ventana | 832 × 480, centrado; costados gastados |
| **Racleta** | los últimos 112 px; plena hasta ≈ 368 y deja de ser imagen hacia ≈ 418 (cuenta) | igual |
| **Aire de arriba** | 80 px (12 svh, cuenta) | 79 px (cuenta) |
| **Dónde arranca el título** | ≈ 168 px (16 de relleno, 48 del regreso, 24, 80 de aire; cuenta) | ≈ 167 px |
| **Deriva** | hasta 38 px | igual |
| **Caja de la hoja** | el ancho de la ventana | artículo: 544 px (34 rem), centrada; portada: 736 px (46 rem) |
| **La caja contra la tapa** | — | artículo: queda 32 px adentro de la parte plena de la tapa. **Portada: queda a 48 px del borde, adentro de los 62 que solo tienen veta (cuenta; por mirar, M4)** |
| **Título** | banda 40,5 px · rotulada 32,3 px · portada 46,9 px | banda 52,8 · rotulada 41,6 · portada 57,6 (todos topes) |
| **Cuerpo** | 17 px | 17 px |
| **Discos del índice** | 2 columnas, 5 filas | 5 columnas, 2 filas |
| **Saltos** | 2 columnas, 3 filas | 3 columnas, 2 filas |
| **Artículos y puertas** | 1 columna | 2 columnas |
| **Primera pantalla de la portada** | título, línea que canta, bajada, y la oreja si entra (por medir, M2) | más aire; la oreja entra entera según mi cuenta gruesa (por medir, M2) |
| **Costados de la tapa** | no hay máscara de canto | la máscara de canto vive en la caja de afuera |

---

## 8. Cuando algo falta

| Falta | Qué pasa | Qué se pierde |
|---|---|---|
| `view()` (un navegador sin él) | La tapa se queda quieta | Nada |
| Movimiento reducido | `--deriva-capa-fondo` vale `0%`: quieta | Nada (`UX-20` §5) |
| JavaScript | La oreja muestra la primera leyenda | Que cambie cada noche |
| El archivo de la tapa | El artículo se queda sin lugar y sin aire | La atmósfera; el título sube |
| Una letra de la banda | Ese título entero va en la rotulada (`§3.1`) | Nada |
| Un `quien` raro | La tarjeta lo muestra tal cual | Prolijidad (`T-452`) |
| El tránsito entre documentos | Corte directo | Nada (`ADR-03`) |

---

## 9. Primera pantalla sin muro y accesibilidad

| Punto | Estado | Cómo se sabe |
|---|---|---|
| Nada le pide nada al que llega (`D-09`, `D-14`) | cumple | leído en `index.astro` y `[slug].astro`: ni formulario, ni aviso, ni modal |
| Lo tocable responde desde el primer cuadro (`UX-20` §1.3) | cumple | la capa es `pointer-events: none` y `aria-hidden` |
| La tapa no lleva información | cumple | `aria-hidden`, imagen de fondo sin `alt` |
| Contraste del título sobre el lugar a 3:1 y de lo de adentro a 4,5:1 | cumple (test) | `contraste.test.ts`, los tres tests `D-75` |
| *Oktubre* no escribe su título en el rojo de marca sobre su tapa | cumple (test) | `contraste.test.ts` mira la regla de `sitio.css` |
| Rótulos con símbolo y palabra, no solo color | cumple | `◆`/`❝` más la palabra, en el renglón, en la tarjeta y en la clave |
| Lo leído apagado (`:visited`) | excepción acotada | `§5.8` |
| Toque de 48 px: la tarjeta, el salto, `Seguí en …`, el regreso | cumple | `min-height: var(--toque-min)` en las cuatro, leído |
| Toque de 48 px: los enlaces de "También anda por" | **por medir** | `.anda-por` tiene `line-height: 2.5` (40 px el renglón), pero el enlace es una caja en línea: su zona tocable es la del texto (≈ 20 px), no la del renglón (cuenta). `§11` A2 |
| Encabezados y regiones | cumple | un `h1` por página; `h2` por hilo con `aria-labelledby`; `nav` con nombre (`Las partes del archivo`) |
| Sin sombra, sin degradé decorativo | cumple (test) | velo plano; `estilos.test.ts` |
| Letra mínima | **abierto** | no hay un piso general; el de 12 px es del test de dos ejes (`UX-36` §8.4). Lo nuevo baja de 12 en `.clave-rotulos dt` (11,5 px) y `.partes a` (11,8 px): son rotulada en mayúscula y con espaciado. `§11` A7 |
| Movimiento reducido | cumple | `§8` |

---

## 10. Cómo se verifica

**A máquina**, que ya existe (no los corrí, `D-12`): `npm test`, `npm run check` y `npm run build`.
Cubren los tres tests de `D-75` en `contraste.test.ts`, la letra de la banda contra el `cmap`
(`fuentes.test.ts`), los ganchos, voces, años, entrantes, la oreja y su ronda diaria
(`redondopedia.test.ts`), y que no vuelva una sombra ni un velo que se desvanece (`estilos.test.ts`).

**Criterios que propongo y no existen como test**, para quien abra el navegador:

| # | Criterio | Dónde |
|---|---|---|
| **M1** | El primer párrafo rotulado (`.parrafo` o `.oreja-rumor`) empieza en `y ≥ 418 px`: `--alto-lugar` menos el 0,55 de `--desgaste` (480 − 62; en una ventana más baja que 480 px, el alto de la ventana menos 62). Si alguno falla, el cuerpo está sobre la racleta. Es el criterio que protege la frase "el cuerpo se lee sobre tinta lisa" | 375 × 667, en los 38 artículos y en la portada. **Los de título corto, sin ficha y sin disco son los dudosos** |
| **M2** | La oreja asoma su rótulo y las primeras líneas dentro de la primera pantalla | 375 × 667, portada |
| **M3** | La oreja no salta: el alto de `ul[data-oreja]` con la leyenda 0 y con la del día no difiere en más de un renglón. Si difiere, la clave y todo lo de abajo se corre al cargar | tres fechas distintas |
| **M4** | A 1366, el título de la portada no queda sobre el borde gastado de la tapa (cuenta: la caja queda a 48 px, adentro de los 62 de veta) | 1366 × 657, portada |
| **M5** | En la computadora, durante el tránsito, los costados de la tapa se ven gastados. La máscara de canto vive en la caja de afuera, y un nombre de tránsito captura la caja con nombre, no a sus ancestros (conocimiento general; no lo probé) | Chrome de escritorio |
| **M6** | En un iPhone y un iPad (`T-453`): `view()`; las dos máscaras una sobre otra; y **el rebote del borde de arriba**: la capa arranca subida 38 px, y tirando de la página hacia abajo más que eso asoma su borde de arriba, que es recto | Safari |
| **M7** | `.anda-por a` mide por lo menos `--toque-min` de alto tocable | 375 × 667 |

**Cronometraje** (la validación del método): leído en voz alta como quien llega, entrar, leer la oreja
(≈ 12 s), tocar y ver el título y el renglón de abajo del artículo son unos 30 segundos. La primera
decisión cabe en la primera pantalla (condicionado a M2).

---

## 11. Lo que no cierra, con dueño

| # | Qué | Dueño |
|---|---|---|
| **A1** | **La tarjeta de un grave va en la letra de la banda.** `D-75` dice que los graves van en la rotulada, y es cierto en el `h1` (`[slug].astro` filtra con `!grave`). `TarjetaArticulo.astro` no filtra: en el índice y en "Seguí por acá" los tres graves llevan su título en la banda y en `--tinte`, con el giro de siempre. No es una contradicción de `D-75`, que no habla de la tarjeta; es un hueco. **Propuesta:** una línea en `TarjetaArticulo.astro` (`!grave &&`, con `SLUGS_GRAVES` de `sitio/graves.ts`, que no importa nada) | hilo principal |
| **A2** | **El toque de "También anda por"** (`§9`, M7). Propuesta: que cada enlace mida `--toque-min` de alto tocable | hilo principal |
| **A3** | **Nada guarda que el renglón de adentro cuente la ficha.** Hoy no hace falta (`§3.2`). Si un artículo nuevo pone una leyenda solo en la ficha, el renglón y la tarjeta callan. Propuesta: un test que lo compare | hilo principal / `arquitectura` |
| **A4** | **Las páginas de En vivo y del bestiario siguen con el recuadro de antes** (`.portada-redondopedia`). En vivo pinta su propia `.tapa-fondo` con *Gulp!* adentro del recuadro. El tránsito anda (una sola capa por documento), pero el que pasa de la portada nueva a una de las dos puertas cae en la cabecera de antes. `D-75` no las tocó (son `D-72` y `D-73`). **Propuesta:** En vivo puede tomar `lugar={fondoCabecera}` y sacar su recuadro; el bestiario tiene su propio mundo dibujado y no | hilo principal |
| **A5** | **Los títulos de las dos puertas van en la rotulada**, no en la banda. Son las únicas tarjetas de la portada sin `en-la-banda`. Puede ser a propósito (no son artículos); lo dejo anotado | hilo principal |
| **A6** | **Los graves y los ganchos, en dos sentidos.** (a) El arranque del resumen de cada grave aparece como gancho en el índice y en las tarjetas de otros artículos: es registro 3 entero, así que no cambia la voz, pero es la primera vez que ese texto se muestra fuera de su artículo. (b) El pie de cada grave lleva "Seguí por acá" con tarjetas que traen el gancho de otros artículos, o sea prosa de registro 2 al pie de una pantalla de registro 3 (`UX-20` §3.4 pide la pantalla entera sin voz). `D-75` les quitó la oreja y dejó esto. **Mi lectura:** en un grave, la tarjeta pierde el gancho y queda con título y renglón de adentro, como el "vea también" de antes. Es de `contenido` decirlo, y del hilo hacerlo (la tarjeta ya recibe `tope` para el largo del gancho; haría falta una prop para sacarlo) | `contenido` (`T-452`) y hilo principal |
| **A7** | **Piso de letra general.** Propongo 12 px para lo nuevo (`.clave-rotulos dt`, `.partes a`) y probar que los saltos no se parten | hilo principal |
| **A8** | **Dos diferencias menores entre `D-75` y el código** (manda el código): "También anda por" también saca el artículo que eligió la oreja (`yaListados` incluye `rumor?.slug`); y la tarjeta muestra `◆` y `❝` cada una por su lado, no solo "si hay leyenda" | — |

---

## 12. Para el lienzo (`T-450`)

Propongo **una hoja propia** (según `diseno-marca.md`, la última pegada es la 16, así que la que sigue
es la 17; la 13 y la 15 todavía faltan). Tiene que mostrar:
la cabeza de un disco (*Oktubre*, título en `--texto`), de una parte (un tema) y de un grave, lado a lado;
la tarjeta con y sin tapa; los tres hilos con "Pará la oreja"; la portada entera a 375; y la portada a
1366 con los costados gastados. **No hay ningún hex nuevo.** Los valores llegaron antes a `tokens.css`
(`--alto-lugar`, `--aire-lugar`, `--ancho-lugar`, `--textura-rodillo-canto`), como ya pasó con la mesa
(`T-319`).
