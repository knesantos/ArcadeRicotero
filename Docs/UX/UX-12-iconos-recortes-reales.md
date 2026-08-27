# UX-12 — Todo ícono de repuesto termina siendo un recorte real

> Rol dueño: `experiencia`. Consume el pedido textual del usuario del 2026-08-25 (*"la
> idea es que en un futuro todos esos iconos sean recortes reales de algun detalle de los
> discos"*, `Docs/ORQ/ORQ-plan-ciclo-9.md`, frente E, `T-160`), `Docs/DECISIONES.md`
> `D-19` (la mezcla, qué rota y qué no) y `D-21` (tapas reales en cualquier pantalla, las
> tres formas, el piso de legibilidad y el tope de peso), `Docs/UX/UX-04-sistema-visual.md`
> (el brief de arte original, el motivo transversal del perro, la prohibición del esclavo
> encadenado), `Docs/UX/UX-08-adivinar-por-la-letra.md` (por qué Momo Sampler y no otro
> disco, el brief de arte que dejó pedido), `public/arte/README.md` (el despiece vigente,
> **leído pero no editado — fuera de mi alcance en esta tarea**), `src/lib/sitio/arte.ts`
> (`RECORTE_REAL`, `DETALLE_POR_VARIANTE`, `STICKER_DISCO`) y `src/lib/sitio/copy.ts`
> (`JUEGOS`, `CASETE_REDONDOPEDIA`). Fichas de `investigador` citadas: `RES-06`, `RES-22`,
> `RES-37`.

**Resuelve:** el pedido de dirección del usuario, convertido en regla en vez de en un
cambio de ícono puntual (así lo pidió `T-160` explícitamente). Y la pregunta que
`T-156` dejó abierta y `ESTADO.md` anota como pendiente del usuario: *si el lobo nuevo va
también al casete de la Redondopedia.*

---

## 0. Por qué esto es una regla y no un capricho de nomenclatura

Hoy conviven, en la misma carpeta, dos generaciones de la misma idea: un dibujo vectorial
que "hace de" un personaje o un objeto (`.svg`), y el recorte fotográfico real de ese
mismo personaje u objeto, tomado de la tapa donde vive (`.png` con alfa). El mecanismo de
`arte.ts` (`conRecorteReal`) ya asume que esto es una **transición**, no un empate
permanente: apenas el archivo real aparece en `public/arte/`, lo usa; mientras no
aparezca, sostiene el dibujo. `mosca.svg→mosca.png`, `banderas.svg→multitud-banderas.png`
y ahora `lobo.svg→lobo-recortado.png` (`T-156`) son los tres casos que ya cruzaron. Esta
ficha fija la regla completa para que los tres que faltan —y cualquiera que se sume— no
dependan de que alguien se acuerde del criterio de memoria.

**La regla:** todo dibujo de repuesto en `public/arte/` es **provisorio por definición**.
Su destino final es un recorte fotográfico real de un detalle fichado de un disco —o,
si la pieza es transversal a toda la obra en vez de propia de un disco puntual (caso
único hoy: el perro, ver sección 2), un recorte real igual de fichado, solo que sin dueño
exclusivo. La única excepción es un dibujo que representa un **objeto genérico sin ficha
posible** (sección 3). Producir el recorte sigue siendo del usuario (`D-04`, `BRIEF.md`
insumos: "arte original... el usuario decide cómo se produce"); esta ficha dice **qué**
recorte falta, **de qué disco sale**, **en qué orden conviene producirlo** y **con qué
estándar técnico**, para que poner el archivo en la carpeta sea, como ya dice
`public/arte/README.md`, "recortá, guardá el archivo con el nombre exacto... y listo".

---

## 1. La decisión que se frenó: el lobo no va al casete de la Redondopedia

### Los dos hechos, tal como los dejó `T-156`

1. `CASETE_REDONDOPEDIA` es `variante: 'historia'` (`src/lib/sitio/copy.ts`), y por `D-19`
   esa variante viste **Gulp!**. El lobo es de **Lobo suelto** (`RES-20`: "álbum
   conceptual sobre Lupus y Rulo"), y ya tiene identidad propia asignada: la sección
   `mitologia` ("Adiviná el tema") y la ficha de *Lobo suelto* en la Redondopedia
   (`STICKER_DISCO['lobo-suelto']`).
2. El perro que hoy ocupa ese casete no es relleno: `public/arte/README.md` lo ficha como
   personaje de *Un baión* (`RES-06`, `RES-22`), con una regla propia de convivencia
   (nunca junto a televisor + muñeco, porque recompondría la tapa entera).

### La pregunta real no es "¿lobo o perro?", es "¿qué gobierna `D-19`?"

`D-19` dice, textual, qué rota y qué no: *"cada parte viste la estética de un disco
distinto —paleta medida + letra reconstruida— sobre una base que no cambia"*, y las tres
reglas que lo ordenan hablan de **fondo, acento y letra grande** — nunca de qué personaje
suelto acompaña la pantalla. La categoría "personaje/ícono suelto de portada" es de
`UX-04`, y es anterior a `D-19`: nació para dar "bienvenida, esto es under y es para vos"
sin citar una tapa puntual, no para ser la cuarta pata de la mezcla de color.

Esa distinción no es una salida fácil inventada para este caso: ya está escrita, con
ficha, en la propia entrada del perro en `RES-06`/`RES-22`. Las dos fuentes no lo
describen como "el bicho de *Un baión*": lo describen como **"una constante en toda la
mitología solariana"** / **"una constante de la literatura solariana"** — transversal a
toda la obra, no exclusivo de una tapa. Es el mismo perro que aparece dibujado en el
casco de *Un baión* junto al televisor y al muñeco, sí, pero su propia ficha dice que el
personaje no le pertenece a ese disco en particular. Por eso, un dato que ya estaba en el
código antes de esta tarea confirma la lectura: `STICKER_DISCO['un-baion-para-el-ojo-idiota']`
usa `muneco-antifaz.png`, **no** al perro — el perro nunca fue, ni en el código ni en la
ficha, "el ícono que representa a *Un baión*". Siempre vivió suelto, a nivel portal
(la portada, hoy tapada por `oktubre-cadena.png`; el casete de la Redondopedia).

El lobo es el caso contrario: `RES-20` lo describe como concepto de **un** disco puntual
(Lupus y Rulo, la fábula de *Lobo suelto*), y el propio `UX-08` ya trazó la línea que
corresponde aplicar acá cuando evaluó dónde ponerlo para `US-07`: descartó vestir ese
juego con *Lobo suelto* o *La mosca y la sopa* **porque reusar una identidad de sección ya
asignada duplica el riesgo de confusión** — dos lugares que dicen "esto es Lobo suelto" en
dos colores distintos. Poner el lobo en un casete pintado de Gulp! es exactamente ese
riesgo, solo que con los roles cambiados: ahora es un disco con dueño (mitología) el que
aparecería vistiendo el color de otro (historia).

### La decisión

**El lobo no va al casete de la Redondopedia. El perro se queda.** No es que la mezcla
ceda: es que la mezcla nunca gobernó esto. `D-19` fija paleta y letra grande por sección;
el personaje suelto que acompaña esa sección es una capa distinta, de `UX-04`, y ahí la
regla que corresponde es otra: **una pieza fichada como propia de un disco puntual vive
exclusivamente en la sección de ese disco; una pieza fichada como transversal a toda la
obra puede acompañar cualquier sección sin reclamar representarla.** El perro cumple la
segunda condición por ficha propia (`RES-06`, `RES-22`); el lobo cumple la primera
(`RES-20`) y por eso ya tiene casa fija.

**Esto no contradice `D-19` — lo aplica con más precisión que la lectura suelta que lo
puso en duda.** Si contradijera algo, sería la costumbre de leer "cada sección viste un
disco" como "todo lo que aparece en esa sección tiene que salir de ese disco", una lectura
que ya se demuestra falsa con el propio código: `casete.svg` —un objeto sin ficha, sin
disco de origen— convive hoy sin conflicto en tres casetes de tres colores distintos
(`marca`, `discos`, y el de Momo Sampler) y nadie lo señaló como un problema. La pregunta
correcta nunca fue "¿de qué color es la sección?", fue "¿esta pieza reclama representar un
disco puntual?". El perro, por su propia ficha, contesta que no. El lobo contesta que sí.

**Qué gana el usuario igual, sin este movimiento puntual:** el lobo recortado (`T-156`) ya
está en dos lugares — el casete de "Adiviná el tema" y la ficha de *Lobo suelto* en la
Redondopedia — y los dos son exactamente los lugares donde el lobo representa lo que dice
representar. Sumarlo a un tercer lugar donde representaría otra cosa no agrega alcance
real a la pieza nueva; le resta legibilidad al mapa sección→disco entero, que es
justamente lo que esta ficha existe para cuidar.

**Qué no cambia en código.** El estado actual —`CASETE_REDONDOPEDIA.arte: '/arte/perro.svg'`,
sin el lobo en ningún lado que no sea mitología— ya es el que corresponde. No hace falta
tocar `copy.ts` ni `arte.ts`: esta sección deja escrito el porqué para que la próxima vez
que alguien mire ese casete y dude, la respuesta ya esté acá y no se vuelva a abrir sin
motivo nuevo.

---

## 2. De qué disco sale cada uno de los tres SVG que quedan

| Archivo | Personaje/objeto | De qué disco sale | Tipo de pieza | Dónde va cuando exista el recorte real |
|---|---|---|---|---|
| `banderas.svg` | La multitud con banderas | ***Oktubre*** (fichado, `RES-06`) | Propia de un disco, pero ese disco es la **base de marca** de `D-19` ("portada y título en Oktubre") — no una de las cuatro categorías que rotan, así que aparece en todo el sitio sin competir con ninguna sección | Sin cambios de destino: sigue siendo `multitud-banderas.png`, fondo del portal y de la Redondopedia, anclada abajo. Ya tiene su recorte real puesto — queda acá para que la tabla esté completa, no porque falte nada |
| `perro.svg` | El perro | ***Un baión para el ojo idiota*** (fichado fotográficamente, `RES-06`, `RES-22`), pero **transversal** por ficha propia — "constante en toda la mitología solariana" | Personaje suelto sin sección exclusiva (sección 1 de esta ficha) | Recorte real `perro.png`, mismo lugar que hoy: el casete de la Redondopedia. Su regla de convivencia (nunca junto a televisor + muñeco) sigue intacta |
| `casete.svg` | El cassette dibujado | **Ninguno — objeto genérico, sin ficha posible** | Excepción declarada (ver razón abajo) | No tiene destino de recorte real. Se queda dibujo para siempre, salvo que alguna sección puntual produzca su propio ícono de reemplazo (como ya pasó con Momo Sampler, que iba a tener `mascara-momo.svg` — sección 5) |

### Por qué `casete.svg` es la excepción, y no solo "el que falta"

Las otras piezas de este despiece —perro, lobo, mosca, banderas, muñeco, gato, cabeza con
vela, bondi, cordero, banda— son todas **personajes o figuras que Rocambole dibujó en una
tapa puntual**, fichados por `RES-06`/`RES-22`/`RES-20`: tienen un origen fotografiable,
un lugar exacto en un disco real. Un cassette de cinta es lo opuesto: es un objeto de
librería, sin autoría de Rocambole, sin ficha posible sobre "qué tapa lo muestra" porque
ninguna la muestra — es la metáfora del propio sitio (el portal se llama arcade y sus
juegos son "casetes"), no una cita al arte de la banda. `public/arte/README.md` ya lo
anota así ("Genérico (dibujo original, se queda así)") y esta ficha lo confirma con la
regla general de la sección 0: sin ficha de disco posible, no hay recorte real que
producir. Recortar una foto de un cassette de verdad no cumpliría el pedido del usuario
—"un detalle de los discos"— cumpliría otra cosa distinta.

---

## 3. El orden de reemplazo

Ningún criterio ordenó los reemplazos que ya pasaron (mosca, banderas, lobo): fueron a
pedido puntual del usuario, pieza por pieza, y está bien que haya sido así. Para lo que
queda, fijo un criterio explícito y verificable, para que la próxima vez no dependa de
qué se le ocurre pedir primero:

**Criterio: va primero la pieza que más pantallas del sitio ve un mismo visitante en una
sola sesión.** No "la que ya tiene tapa fichada" —las dos piezas que quedan (`perro.svg`,
`banderas.svg`) ya la tienen, así que ese criterio no discrimina entre ellas— y no "la
más vistosa", que es opinable. La superficie de aparición sí se puede contar en el código:

1. **`banderas.svg` → `multitud-banderas.png` primero** *(ya hecho, sirve como ejemplo del
   criterio)*. `Base.astro` la usa como fondo — aparece detrás de **cualquier página que
   no sea la isla de un juego**: portal, Redondopedia entera, letras y acordes, cocina.
   Es la pieza de mayor superficie de exposición de todo el despiece.
2. **`perro.svg` → `perro.png`.** Aparece hoy en un solo lugar (el casete de la
   Redondopedia, `54×54px` en el portal), pero es la pieza que generó la pregunta que
   abrió esta tarea — conviene resolverla junto con la decisión de la sección 1, no
   después, para no dejar la regla escrita sin el archivo que la prueba.
3. **`casete.svg` no entra en el orden.** No es que quede último: no compite, porque no
   tiene destino de recorte real (sección 2).

Fuera de esta lista pero con prioridad real más alta que las dos de arriba: **Momo
Sampler** (sección 5). No es uno de los tres SVG que nombra `T-160` porque ni siquiera
llegó a tener su dibujo de repuesto — hoy usa el `casete.svg` genérico por default. Pero
es la pantalla más nueva del sitio ya jugable en producción (`US-07`, `ESTADO.md`) y hoy
se ve "sin vestir": si el criterio es superficie de exposición **a un jugador activo**
(no a alguien que solo mira el portal), Momo Sampler debería ir antes que `perro.svg`.
Lo dejo aparte de la lista numerada porque compite en una categoría distinta —arte que
todavía no existe ni como dibujo, no un SVG esperando su reemplazo real— pero el usuario
puede leerlo como el más urgente de los cuatro si prioriza por juego jugado y no por
pantalla de portada.

---

## 4. El estándar técnico de un recorte

Esto es específicamente el estándar de la familia **"personaje suelto recortado"**
(`public/arte/*.png`, alfa, silueta cerrada) — **distinto** del estándar que ya fija
`D-21`/`UX-04` para "detalle recortado" y "fondo velado" (`public/tapas/detalle/` y
`public/tapas/fondo/`, JPEG rectangular con tratamiento de borde por CSS, 210–591px,
tope 60 KB). Son dos materiales distintos que conviven sin mezclarse (`UX-04`, "regla que
ordena todo lo demás"): uno es un recorte fotográfico rectangular con textura de recorte
aplicada por fuera; el otro es un recorte de silueta irregular hecho a mano, sin fondo,
donde el propio archivo ya trae el borde recortado adentro.

Medido sobre lo que ya funciona en el repo:

| Pieza | Lado largo | Peso | Formato | Destino real más grande |
|---|---|---|---|---|
| `mosca.png` | 103×111 px | 17 KB | PNG con alfa | 44 px (`.mosca-viva`, animación de vuelo) |
| `lobo-recortado.png` | 320 px | 45 KB | PNG con alfa | 54×54 px (`.casete-arte`) |

*(Corrección sobre el dato de partida: `lobo-recortado.png` renderiza a **54×54 px** en el
casete —medido en `src/styles/sitio.css`, `.casete-arte`—, no a 57×57. Dejo el número
exacto porque este proyecto no repite una medida sin volver a mirarla.)*

**La regla:**

- **Formato: PNG con canal alfa, siempre.** Nunca JPEG — un JPEG no tiene transparencia y
  forzaría un fondo rectangular detrás de la figura, que es exactamente el "recorte
  rectangular liso, sin borde propio del proyecto" que veta `.claude/rules/diseno-marca.md`
  vía `D-21`.
- **Silueta cerrada, recortada a mano, sin halo.** No una selección automática de "quitar
  fondo" con resto de píxeles claros alrededor — el borde es parte del dibujo, con la
  imperfección de línea que pide `.claude/rules/diseno-marca.md` (serigrafía, grabado, no
  vector liso).
- **Lado largo: 200–400 px, con 320 px como referencia** (el número que ya funciona en
  `lobo-recortado.png`). Por qué ese rango: el destino real más grande de esta familia
  hoy es un sticker de ficha de disco en la Redondopedia, medido en `UX-04` en **~96 px**;
  con pantalla retina (2×) hacen falta ~192 px, y 320 px deja margen de sobra sin ser
  desperdicio. Bajar de 200 px empieza a perder el detalle del borde irregular; subir de
  400 px es peso sin destino — ningún uso conocido hoy lo necesita.
- **Peso: tope de 60 KB.** No es un número nuevo: es el mismo tope que ya fija `D-21`
  para el fondo velado, reusado a propósito porque ambos materiales pesan sobre el mismo
  rango de píxeles (210–591 px allá, 200–400 px acá) y son el mismo tipo de archivo
  gráfico. Los dos ejemplos que ya funcionan (17 KB y 45 KB) quedan cómodos debajo, igual
  que el catálogo de `D-21` queda cómodo debajo de su propio tope. El repuesto que trajo
  el lobo antes de recortarlo (~1,4 MB) lo pasaba por más de veinte veces — ese es
  exactamente el error que este número existe para que no se repita.
- **El máster sin reducir no llega nunca a `public/arte/`.** Mismo principio que `D-04`
  fija para las tapas: el archivo que se sube ya es el recorte final, liviano, no la
  fuente de la que se recortó.

---

## 5. Lo que falta de Momo Sampler

`UX-08` dejó pedido un brief de arte completo para *Sacalo por la letra* (`US-07`) y hoy,
con el juego ya jugable en producción, nada de eso existe todavía. La pantalla se pinta
solo con el color (`--disco-momo-sampler-tinta`/`-apoyo`), sin ninguna pieza de las tres
que pidió `UX-08`:

1. **`mascara-momo.svg`** — el dibujo de repuesto (arte original: una cara redonda,
   grabada, mirando de frente, técnica serigrafía/grabado). **No existe ni como
   placeholder**: el casete de este juego usa hoy el `/arte/casete.svg` genérico
   (`src/lib/sitio/copy.ts`, `JUEGOS[2].arte`). Esto es, en los términos de la sección 2,
   el comportamiento correcto mientras no exista nada mejor —mostrar el objeto sin ficha
   en vez de un personaje de otro disco— pero sigue siendo un hueco a llenar.
2. **`mascara-momo.png`** — el recorte real que reemplazaría al punto 1, con el mismo
   mecanismo `RECORTE_REAL` que ya usan mosca/banderas/perro/lobo. Hoy ese mapa en
   `src/lib/sitio/arte.ts` no tiene entrada para `mascara-momo.svg` porque el archivo
   todavía no existe — sumarla es un cambio de código de una línea, no mío, para cuando
   corresponda (`D-12`).
3. **`detalle/momo-medallon.jpg`** y **`fondo/momo-medallon.jpg`** — los dos derivados de
   `D-21` del medallón de la tapa real (`public/tapas/momo-sampler.jpg`, ya en el repo).
   `DETALLE_POR_VARIANTE['momo']` ya apunta a `'momo-medallon'` en el código
   (`src/lib/sitio/arte.ts`): el hueco no es de mapeo, es de que el archivo no fue
   generado todavía. Se producen con `node scripts/generar-tapas.mjs` una vez que ese
   script sepa recortar este máster puntual — mismo comando que ya genera los derivados
   de las otras nueve tapas.

Ninguno de los tres bloquea que se juegue: `arte.ts` ya devuelve `null` con elegancia y la
pantalla no se rompe (`UX-08`, "Bloqueos que dejo anotados"). Bloquea que la pantalla más
nueva del sitio se vea terminada.

---

## Checklist — qué deja escrito esta ficha

- [x] La regla: todo dibujo de repuesto es provisorio, con dos destinos posibles según su
      ficha (disco puntual → esa sección exclusiva; transversal → cualquier sección).
- [x] La decisión frenada por `T-156`, fundamentada contra `D-19`: el lobo no va al
      casete de la Redondopedia; el perro se queda; no hace falta tocar código.
- [x] De qué disco sale cada uno de los tres SVG que quedan (`banderas.svg`→Oktubre,
      `perro.svg`→Un baión/transversal, `casete.svg`→sin disco, excepción declarada).
- [x] El orden de reemplazo y el criterio que lo ordena (superficie de exposición),
      con Momo Sampler anotado aparte por competir en otra categoría.
- [x] El estándar técnico: PNG con alfa, silueta cerrada, 200–400 px de lado largo
      (320 px de referencia), tope de 60 KB — reusando el número de `D-21`, no uno nuevo.
- [x] Qué falta de Momo Sampler y por qué no es lo mismo que "un SVG esperando su
      reemplazo" (todavía no tiene ni el dibujo de repuesto).

## Bloqueos que dejo anotados

- **Producir los archivos** (`perro.png`, `mascara-momo.svg`/`.png`,
  `detalle/momo-medallon.jpg`, `fondo/momo-medallon.jpg`) sigue siendo del usuario
  (`D-04`, `BRIEF.md`) — esta ficha da la especificación, no el archivo.
- **La entrada nueva de `RECORTE_REAL` para `mascara-momo.svg`** y, si se genera el
  derivado de Momo, que `scripts/generar-tapas.mjs` sepa recortar ese máster puntual: son
  cambios de código de una línea cada uno, para quien esté parado en el código cuando el
  archivo exista (`D-12`) — no son parte de esta ficha ni del alcance de `experiencia`.
