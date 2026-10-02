# UX-10 — El sitio en escritorio

> Rol dueño: `experiencia`. `T-157`/`T-158`, ciclo 9, frente E. Consume el pedido textual
> del usuario ("que este ciclo haga una pulida para la página desktop, si bien esto es
> mobile first debe ser igual de jugable y navegable desde desktop"), `.claude/rules/
> codigo-juegos.md` ("el escritorio es un caso derivado, no el punto de partida"),
> `.claude/rules/diseno-marca.md` (tabla de tics vetados), `src/styles/tokens.css`,
> `src/styles/sitio.css`, `src/styles/juego.css`, `src/styles/cancionero.css`, y las
> mediciones a 1440×900 que trae el pedido de esta tarea. También leí `UX-01`, `UX-04`,
> `UX-07` y `UX-08` para no repetir ni contradecir lo que ya está decidido sobre cada
> pantalla.
>
> **Afuera a propósito:** el recorrido por teclado (foco, orden de tabulación). El
> usuario nombró cuatro frentes y dejó ese explícitamente fuera de este ciclo. Esta hoja
> no lo toca, y ninguna regla de acá depende de él.
>
> **Enmendada el 2026-10-02 por `UX-35` (`T-317`, ciclo 17, `D-54`).** Lo de abajo se conserva
> entero, con marcas en cuatro lugares. (1) **`§2.4` (el portal a 46 rem) queda superado desde
> 64 rem**: el portal pasa a `--ancho-mesa` (76 rem) con el lado A en tres por tres; de 46 a 64
> rem sigue valiendo lo que dice `§2.4`, con la casetera alineada y el noveno casete al centro
> (`UX-35` `§2.3`). (2) **`§4` (la tira de cinta del margen) no se construyó**: el margen se
> resolvió con la carátula del casete, una columna al lado de la hoja que además dice qué juego
> es (`UX-35` `§3`). (3) **`§2.3` vale en su criterio y cambia una cifra**: el tablero sigue
> sin crecer por llenar, pero desde 64 rem mide 38 rem y no 34, porque la carátula lo pidió
> (`UX-35` `§4.4`). (4) El checklist del final tiene tres ítems cuya medida cambió, marcados
> ahí. Todo lo demás —la sección 1 (los cortes de ancho y de puntero), `§2.1`, `§2.2`, `§3`
> entera y el hover— sigue como está.

**Resuelve:** cómo se comporta en una pantalla ancha cada pantalla que ya existe —
`US-01` (quiz), `US-02` (adiviná el tema), `US-03` (completá la letra), `US-04` (adiviná
la tapa), `US-05` (Redondopedia), `US-06` (dos ejes), `US-07` (sacalo por la letra), más
el portal y la sección de letras y acordes (sin `US-XX` propio, nace en el ciclo 6 como
infraestructura de `US-03`). No define pantallas nuevas — es una pulida transversal — así
que en vez de "pantalla por pantalla" está organizado por **tipo de pantalla**, que es la
unidad que realmente cambia de comportamiento.

## 0. Lo que ya estaba bien, y lo que no

Antes de proponer nada, esto es lo que salió de leer el código real, no de suponerlo:

| Dato | Confirmado en | Lectura |
|---|---|---|
| `.contenido-sitio { max-width: 34rem }` (`sitio.css:166`) rige portal, Redondopedia y cancionero (todos entran por `Base.astro`) | Código | Un solo tope, un solo lugar — bien |
| El quiz, `dos-ejes`, `adiviná el tema` y `adiviná la tapa` **repiten el mismo `max-width: 34rem` a mano**, en un `<style>` inline de cada `.astro` (cuatro copias idénticas) | `quiz.astro:68`, `dos-ejes.astro:87`, `adivinar-el-tema.astro:134`, `adivinar-la-tapa.astro:66` | Funciona, pero está escrito cuatro veces |
| **`completar-la-letra.astro` y `adivinar-por-la-letra.astro` no tienen ningún `max-width`** — ni propio ni heredado, porque tampoco usan `Base.astro` ni `.contenido-sitio` | Código (sin resultado en la búsqueda) | Estos dos juegos hoy **no tienen techo de ancho**: en una pantalla ancha, la caja del verso, el buscador (`.buscador-caja`, `flex:1`) y la lista de sugerencias (`.sugerencias`, `left:0;right:0`) se estiran al ancho completo del `body`. Es el caso más urgente de esta hoja, y no aparecía en la tabla de mediciones del pedido porque esa tabla midió el quiz, no estos dos |
| `.opciones` pasa a 2 columnas en `min-width: 24rem` (`juego.css:91`) — un corte de *teléfono grande*, no de escritorio | Código | No hay ningún corte pensado para escritorio en todo el sitio hoy |
| `.tema` (ficha de letra+acordes) declara `max-width: 46rem` y `.cancionero-intro` declara `42rem` (`cancionero.css:210,22`) | Código | **Están muertos**: como están anidados dentro de `.contenido-sitio` (34rem), el tope de afuera manda y el de adentro nunca se aplica. Alguien ya había pensado que el cancionero necesita más aire y ese ancho quedó escrito sin efecto |
| `.casetera` y `.indice-articulos` son `display: grid` **sin `grid-template-columns`** | `sitio.css:271-277`, `551-557` | El número de columnas que se vea hoy depende del comportamiento por defecto del navegador ante una grilla sin columnas declaradas, no de una regla escrita. Esta hoja lo fija explícito en vez de dejarlo a lo que decida el motor de render |
| `.enunciado` (1.3rem = 20,8px) y `.opcion` (268×59px a 34rem de ancho) | `juego.css:78,97` + aritmética sobre `tokens.css` | Los números que trae el pedido coinciden con lo que dice el código — confirmado, no una casualidad de la medición |
| **Ningún elemento clickeable principal tiene `:hover`** — ni `.opcion`, ni `.casete`, ni `.pozo`, ni `.sugerencia`, ni `.primario`, ni `.tarjeta-articulo` | Grep de `:hover` en las cuatro hojas de estilo: solo aparece en `.retirada-disparador`, `.fuente-verso-enlace`, `.boton-recorte`, `.pista a`, `.elegir`, `.herramienta button` | Con mouse, hoy no hay ninguna señal de "esto se puede tocar" antes de hacer clic. Es el hallazgo que más pesa del punto 3 |

## 1. Un solo corte por ancho, y por qué es ese número

**46rem (736 px).** No es un número elegido a ojo ni el clásico corte de framework: es
**el que ya está escrito, dos veces, e inerte** (`.tema` y `.cancionero-intro`/
`.disco-tapa` arriba). Dos motivos independientes piden el mismo ancho:

1. **El cancionero lo necesita por función, no por gusto.** El acorde va alineado arriba
   de la sílaba exacta; en una columna de 34rem (544px) una línea con acorde y letra corta
   más seguido de lo necesario, separando el acorde de la palabra que le corresponde. Más
   ancho = menos versos que se parten.
2. **Dos casetes de ancho cómodo entran uno al lado del otro justo ahí.** Un casete
   necesita icono (54px) + texto corrido de título y bajada sin apretarse: ronda los
   320-350px, muy parecido al ancho que ya tiene un casete hoy en un teléfono grande. Dos
   de esos más el `gap` (`--espacio-2`, 16px) más el padding del contenedor entran justo en
   46rem, sin sobrar ni faltar.

Que las dos cuentas den el mismo número no es casualidad: es la escala de todo el sitio
apoyada en el mismo bloque mínimo (un casete, una ficha). Por eso un solo corte alcanza —
no hace falta un segundo corte más ancho para "escritorio grande": lo que sobra por
encima de 46rem lo resuelve el punto 4 (la decoración del margen), no un layout distinto.

**No es "sos una computadora": es "tenés 736px lógicos".** Un teléfono grande apaisado
(la mayoría de los modelos actuales pasan los 800px lógicos acostados) también cruza este
corte y también se beneficia — coherente con *móvil primero*: se diseña para lo angosto y
se deja que el ancho sume, nunca que reste. Ningún teléfono en vertical, que es el caso
que manda, se acerca a 736px.

**El segundo corte no es de ancho, es de capacidad de puntero** (sección 3.2):
`@media (hover: hover) and (pointer: fine)`. No depende de si la pantalla es angosta o
ancha — depende de si hay mouse. Un Chromebook táctil de 1440px no lo dispara; una laptop
con mouse conectado en una ventana chica sí. Van separados a propósito: mezclar los dos
en un solo corte por ancho haría que una notebook táctil reciba un hover pegado que nunca
se puede soltar con el dedo, que es peor que no tener hover.

## 2. Qué hace cada tipo de pantalla con el ancho sobrante

Cuatro tipos, cuatro respuestas — ninguna copiada de la anterior.

### 2.1 Redondopedia: el artículo no se toca, el índice sí

**El artículo (`US-05`, portada e ficha de cada pieza):** se queda en 34rem, siempre.
El dato que trae el pedido —66 caracteres por línea a 1440px— **ya está en el rango
cómodo (45-75)**, así que ensancharlo no mejora nada y empeora la lectura. Acá "nada, se
queda centrado" es la respuesta correcta, y el fundamento es ese número, no comodidad de
diseño: pasar de 66 a, digamos, 90 caracteres por línea hace que el ojo pierda el
renglón al saltar de línea, que es exactamente lo que un artículo largo no se puede dar el
lujo de hacer.

**El índice de artículos (`.indice-articulos`) y el índice de discos del cancionero
(`.disco`, ver 2.2) son casos distintos entre sí**, y ahí está el matiz que separa esta
hoja de "ensanchar todo lo que se pueda":

- El índice de la Redondopedia son tarjetas **chicas y parejas** (título + una línea de
  resumen). Estas sí pasan a **2 columnas desde 46rem** — es "elegir qué leer", no "leer",
  y el mismo criterio vale para el índice del portal (2.4).
- El índice de discos del cancionero **no es parejo**: un disco con dieciséis temas y uno
  con cuatro no arman una grilla prolija — quedarían huecos donde el disco corto termina
  antes que el de al lado. Ese se queda en una columna (ver 2.2).

**El margen que queda libre en el artículo** (448px a cada lado a 1440px, según la
medición) recibe la decoración de la sección 4. No hay nada más que poner ahí: ya se
decidió que ensanchar la prosa es peor, y llenar el margen con navegación (un índice
persistente, "en esta página") agregaría una decisión más para leer en una sesión de
2-3 minutos, que es exactamente lo que este proyecto evita.

### 2.2 Letras y acordes: se ensancha, con motivo funcional

**Intro/índice de discos y ficha de tema (`.cancionero-intro`, `.tema`):** dejan de
estar recortados a 34rem por el tope de `Base.astro` y usan el ancho que ya tenían
escrito — **46rem la ficha, 42rem la intro**, sin inventar un número nuevo. Es el único
tipo de pantalla de todo el sitio donde el ancho sobrante se resuelve agrandando la
columna, y el motivo ya está en la sección 1: el acorde necesita el espacio.

Se queda en **una sola columna** aunque haya lugar de sobra: cada `.disco` es un bloque
de alto variable (tracklist completo), y una grilla de dos columnas con bloques de alto
distinto deja huecos — el mismo problema que 2.1 descarta para el índice de discos.

### 2.3 Juego en partida: el tablero no cambia, y acá el vacío sí se defiende

> **Enmendado el 2026-10-02 (`UX-35` `§4.4`).** El criterio de esta sección sigue entero: el
> tablero no crece para llenar, porque el mouse viaja entre una opción y otra y la letra de
> juego no es de televisor. Lo que cambia es **la cifra**: "34rem, sin excepción" vale hasta
> 64 rem; desde ahí la hoja mide `--ancho-tablero` (38 rem, 608 px; las opciones pasan de 268
> a 300 px) porque tiene una carátula al lado, y "Ponelos en fila" llega a 52 rem (832 px) **desde 80 rem**, con sus dos paños; entre 64 y 80 rem usa los 38 rem de los demás (`UX-35` `§4.5`, `FIND-106`). La letra,
> el enunciado de 20,8 px y el piso de `--toque-min` no se tocan. El último párrafo de la
> sección ("el margen que queda recibe la decoración de la sección 4") queda superado:
> véase la marca en `§4`.

Los seis juegos (`US-01`, `US-02`, `US-03`, `US-04`, `US-06`, `US-07`) se quedan en
**34rem, sin excepción — el mismo ancho de siempre, en cualquier pantalla.** Es la
respuesta "nada, queda centrado" que el pedido habilita, y el fundamento es doble:

1. **El ancho ya está calibrado**, no solo para el pulgar: a 34rem las opciones del quiz
   miden 268×59px, muy por encima del `--toque-min` de 48px, y el enunciado mide 20,8px —
   cómodo para leer con mouse o con el dedo. Agrandar el tablero no lo hace más jugable:
   agranda el recorrido que tiene que viajar el mouse entre una opción y otra, que es
   friction, no comodidad.
2. **Es un juego, no un póster.** Estirar un tablero de preguntas a 1000px de ancho para
   "usar la pantalla" es la misma lógica que ya rechaza la tabla de tics vetados de
   `diseno-marca.md` para las tarjetas: llenar porque hay lugar, no porque haga falta.

**Lo que sí cambia, y es el hallazgo más concreto de esta hoja:** hoy **no los seis
juegos comparten este tope**. Cuatro lo repiten a mano (`quiz.astro`, `dos-ejes.astro`,
`adivinar-el-tema.astro`, `adivinar-la-tapa.astro`) y **dos no lo tienen** —
`completar-la-letra.astro` (`US-03`) y `adivinar-por-la-letra.astro` (`US-07`) — así que
hoy, en una pantalla ancha, esos dos juegos **sí** tienen el problema que el pedido
describe para el quiz, y peor: sin tope, el buscador y su lista de sugerencias (`US-02`
y `US-07` comparten `buscador.ts`) se estiran de punta a punta de la pantalla, cosa que
ninguno de los otros cuatro juegos hace porque ninguno usa un campo de texto ancho.
**Recomendación concreta:** que los seis tableros reusen la misma regla en vez de
reescribirla — literalmente `.contenido-sitio`, que es la clase que el resto del sitio ya
usa para esto — en vez de cuatro copias y dos faltantes. No es una decisión de diseño
nueva, es sacar una inconsistencia que ya existe.

El margen que queda (448px a cada lado a 1440px) recibe la decoración de la sección 4,
tintada con el color propio de cada juego — ver ahí el detalle.

### 2.4 Portal: la única pantalla que ensancha su propio contenedor

> **Superado desde 64 rem por `UX-35` `§2` (2026-10-02).** Hasta 64 rem esta sección sigue
> valiendo: dos columnas desde 46 rem, contenedor de 46 rem, y desde el ciclo 17 con la
> casetera alineada y el noveno casete al centro (`UX-35` `§2.3`). Desde 64 rem el contenedor
> sube a `--ancho-mesa` (76 rem), el lado A va en tres por tres, el lado B centrado, y desde
> 80 rem el casete crece y la bajada se lee entera. La afirmación de abajo, "por encima de
> 46rem el contenedor no sigue creciendo", ya no es cierta para el portal. El argumento de
> fondo —elegir no es leer ni jugar— es el mismo, y es el que justifica el ensanche.

El portal es la pantalla de **elegir un juego**, no de leer ni de jugar — el mismo
criterio de 2.1 (tarjetas chicas y parejas → más columnas) aplica acá con más fuerza
todavía, porque es literalmente el propósito de la pantalla. Desde 46rem:

- La casetera pasa a **grilla de 2 columnas explícitas** (`gap: --espacio-2`), en vez de
  depender de cómo resuelva el navegador una grilla sin columnas declaradas (ver 0).
- El contenedor del portal (no el `.contenido-sitio` genérico — uno propio, para no
  arrastrar el ensanche a las pantallas que sí quieren quedarse en 34rem) crece junto con
  la grilla, hasta el mismo 46rem: con dos columnas y el `gap`, cada casete queda en
  ~344px — el mismo orden de magnitud que ya tiene un casete hoy en un teléfono grande, no
  un casete gigante con texto perdido en el medio.

Por encima de 46rem, el contenedor del portal no sigue creciendo: el resto del ancho es
para la decoración de la sección 4, igual que en los otros tres tipos de pantalla.

## 3. Tipografía y toque

### 3.1 Las escalas no cambian, en ningún ancho

`--toque-min: 48px`, `.opcion` a 268×59px, `.enunciado` a 20,8px: **se quedan iguales**
en cualquier ancho de ventana. Tres razones, y ninguna es "no da el tiempo":

1. `--toque-min` es un **piso**, no un objetivo. 59px ya lo supera con margen; no hay
   beneficio en bajarlo para "aprovechar" que hay mouse, y si un día alguien juega desde
   una tablet táctil conectada a un monitor grande, el piso lo sigue necesitando.
2. **Ancho de ventana no es lo mismo que "hay mouse".** Una notebook con pantalla táctil
   en una ventana maximizada tiene 1440px y dedo, no mouse. Achicar por ancho asumiría
   algo que el ancho solo no garantiza.
3. Agrandar tampoco suma: un enunciado de 28px y opciones de 90px de alto en un monitor
   se leen como una interfaz para TV, no como el quiz de un fan site. Rompería la escala
   que ya está calibrada contra el resto del sitio (la tarjeta de resultado, los casetes,
   la Redondopedia) sin ninguna ganancia de lectura.

Ningún elemento de este documento pide un ancho a partir del cual la tipografía cambie,
porque la decisión es que no cambie.

### 3.2 Lo que sí falta no es tamaño, es reacción al mouse

El hallazgo de la sección 0: **nada de lo clickeable tiene `:hover`.** No es un problema
de escala, es un problema de feedback — con mouse, la única señal de "esto es un botón"
hoy es hacer clic y ver qué pasa. Se agrega, condicionado a
`@media (hover: hover) and (pointer: fine)`, a: `.opcion`, `.casete`, `.pozo`,
`.sugerencia`, `.tarjeta-articulo`, `.primario`, `.secundario`, `.arriesgar`, `.escuchar`.

**Regla, no once implementaciones distintas:** el hover reusa el color que ese elemento
*ya* usa para su propio estado activo/correcto/elegido, nunca un color nuevo —
`.pozo[aria-pressed='true']` ya tiñe el borde con `--cat-mitologia`; el hover de `.pozo`
es una versión más floja de ese mismo tinte, no un color que `contraste.test.ts` no
conozca. Para lo que hoy no tiene ningún estado con color propio (`.primario`, un botón
sólido), el precedente ya existe en el código: `.boton-recorte:hover` invierte fondo y
tinta con los mismos dos tokens que ya usa en reposo. **Nunca elevación, nunca escala,
nunca sombra difusa** — la tabla de tics vetados de `diseno-marca.md` lo prohíbe
explícitamente ("hover que levanta o infla"), y acá aplica letra por letra.

**Sin pares nuevos para `contraste.test.ts`:** ningún hover de esta sección introduce un
color que no esté ya testeado, porque todos reusan un tinte que el propio elemento ya
pinta en otro estado.

## 4. La decoración del margen: por qué no queda vacío

> **No se construyó, y el margen se resolvió con la carátula (`UX-35` `§3`, `D-54`,
> 2026-10-02).** La tira de cinta se descartó: decoraba el vacío en vez de usarlo, y no
> resolvía lo que más pesaba, que en partida no quedaba nada en pantalla que dijera qué juego
> era. La carátula del casete ocupa ese lugar: una columna al lado de la hoja desde 64 rem, con
> la misma pieza de tapa, el mismo número de pista y la lista de casetes. **Vale para las
> páginas de juego.** El margen de la Redondopedia y del cancionero queda sin tira y sin
> carátula: las páginas de lectura quedaron afuera del ciclo 17 (`ORQ-plan-ciclo-17.md` §3).
> Lo que sigue se conserva como registro de la propuesta, no como especificación vigente; el
> diagnóstico del primer párrafo (el vacío es lo que más pesa en la frase original del pedido)
> sí se sostuvo.

Ya quedó fundamentado que 2.1 y 2.3 **no** ensanchan su columna. Eso no significa que el
margen se quede en blanco — es la parte del pedido que más peso tiene en la frase
original ("se ve como una app de celular metida adentro de un monitor"), y dejar el
margen liso no la resuelve, aunque el ancho de la columna esté bien justificado.

**La pieza:** una tira de cinta, del mismo tamaño y técnica que ya usan `.casete::before`
(64×18px) y `.cocina::before` (74×20px) — nada nuevo que dibujar, es el mismo recorte de
`--papel` con transparencia, rotado unos grados. Se ancla al borde superior de la columna,
del lado de afuera, mordiendo apenas el margen — como si la columna entera fuera una hoja
pegada a la pared, no una ventana flotando en el medio de la nada. **Una sola tira por
pantalla**, no dos simétricas: la simetría perfecta es, otra vez, la estética que
`diseno-marca.md` pide evitar.

**El color, por tipo de pantalla — acá sí hay una diferencia entre las categorías:**

- **Contenido (Redondopedia, cancionero):** `--papel` con transparencia, igual que hoy.
  Neutro, porque la pieza que decora no tiene un disco único asociado.
- **Juego en partida:** tintada con `--tinte` — la misma variable local que cada juego ya
  define para su propio borde (`--cat-mitologia` en el reveal de audio, `--cat-letras` en
  completar la letra, `--disco-momo-sampler-apoyo` en sacalo por la letra). El quiz, que
  mezcla las cuatro categorías pregunta a pregunta, y adiviná la tapa, que cambia de disco
  en cada ronda, no tienen una identidad fija — para esos dos la cinta queda neutra, como
  en contenido.
- **Portal:** no necesita esta pieza. Cada casete ya trae su propia cinta (`.casete::before`)
  y el fondo ya usa el ancho completo (`.tapa-fondo--portal`, fijo a la ventana). Sumar
  otra encima sería la única pantalla con dos capas de la misma decoración.

**Se muestra solo desde 46rem**, junto con todo lo demás de esta hoja: por debajo no hay
margen donde ponerla, y en celular directamente no existe en el DOM.

## 5. Los cortes, en una tabla

| Corte | Valor | Tipo | Motivo | A quién afecta |
|---|---|---|---|---|
| Ancho | `46rem` (736px) | `min-width` | Reutiliza un valor que ya estaba escrito e inerte (`cancionero.css`); coincide con el ancho de dos casetes cómodos | Portal (2 columnas), índice de Redondopedia (2 columnas), cancionero (ensancha a 46/42rem), decoración de margen (secciones 4) en todo lo demás |
| Puntero | `(hover: hover) and (pointer: fine)` | Capacidad, no ancho | Lo que falta es saber si hay mouse, no si la pantalla es angosta | `.opcion`, `.casete`, `.pozo`, `.sugerencia`, `.tarjeta-articulo`, `.primario`, `.secundario`, `.arriesgar`, `.escuchar` |

**Ninguno de los dos toca el celular.** Por debajo de 46rem — todo teléfono en vertical,
sin excepción — el sitio se ve exactamente igual que hoy. El corte de puntero tampoco:
un teléfono no dispara `hover: hover` aunque tenga 1440px de ancho lógico (no los tiene,
pero si algún día existiera uno así, seguiría sin mouse).

## 6. Qué no resuelve esta hoja

- **El recorrido por teclado.** Afuera a pedido explícito (ver el encabezado). El hover
  de la sección 3.2 no reemplaza un `:focus-visible` — ya existe (`tokens.css:198`) y
  esta hoja no lo toca ni depende de él.
- **Por qué `.casetera` se ve como se ve hoy exactamente.** La sección 0 deja escrito que
  la grilla no declara columnas; esta hoja fija el objetivo (2 columnas desde 46rem) y no
  necesita saber por qué el comportamiento de hoy da el número que da — eso es trabajo de
  quien lo implemente, no de diseño.
- **Producir el arte de la cinta de margen.** No hace falta ninguno: la sección 4 reusa
  una pieza que el CSS ya sabe dibujar con tokens existentes.

## Checklist de verificación (la corre quien implemente — `D-12`)

> **Enmendado el 2026-10-02 (`UX-35` `§7`).** Tres ítems cambian de medida desde 64 rem y están
> marcados abajo; el checklist vigente de la mesa es el de `UX-35`.

- [ ] A 1024px, 1280px y 1440px: ningún tablero de juego (los seis) supera 544px de ancho.
      *(Superado desde 64 rem: la hoja mide hasta 608px, y "Ponelos en fila" hasta 832px, pero solo desde 80 rem: entre 64 y 80 rem también 608px.
      `UX-35` `§7.3` y `§7.5`.)*
- [ ] `completar-la-letra` y `adivinar-por-la-letra` quedan bajo el mismo tope que los
      otros cuatro juegos — hoy no lo están.
- [ ] El buscador y su lista de sugerencias (`US-02`, `US-07`) no superan el ancho del
      tablero en ningún viewport.
      *(El criterio sigue; la medida del tablero es la de `UX-35` `§4.4`.)*
- [ ] Desde 46rem: portal e índice de la Redondopedia muestran 2 columnas parejas, sin
      ítems cortados ni huecos.
      *(Para el portal vale de 46 a 64 rem; desde 64 son tres columnas. `UX-35` `§7.1`.)*
- [ ] Desde 46rem: la ficha de tema y la intro del cancionero miden 46rem/42rem, no 34rem.
- [ ] `node --test src/lib/contraste.test.ts` sigue en verde sin agregar ningún par nuevo.
- [ ] `node --test src/lib/estilos.test.ts` (o el que audite pastillas/barras laterales)
      sigue en verde: la cinta de margen no es una pastilla cápsula ni una barra lateral.
- [ ] Con mouse conectado, pasar por encima de una opción del quiz, un casete, un pozo o
      una tarjeta de artículo cambia de tinta antes de hacer clic.
- [ ] En un celular real (no una ventana angosta de escritorio), nada de lo de arriba
      cambió una sola línea respecto de antes de esta hoja.
