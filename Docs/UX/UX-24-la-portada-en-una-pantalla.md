# UX-24 — La portada de "adiviná el tema" en una pantalla

> Rol dueño: `experiencia`. `T-214`, ciclo 14.
>
> **Consume:** `Docs/ORQ/ORQ-plan-ciclo-14.md` §1 (las medidas reales del 2026-09-10, a
> 375×812); el pedido textual del usuario ("que no haya que scrollear para ver las
> canciones, que no haya espacio muerto en la página"); `src/pages/juegos/
> adivinar-el-tema.astro` entero; `src/scripts/partida-tema.ts` (`armarPantalla`,
> `armarBuscador`, `pintarRevelacion`, `pintarBarra`, `cerrarTema`); `src/styles/
> juego.css` (`.pantalla`, `.pozos`, `.pozo`, `.sugerencias`, `.sugerencia`,
> `.intentos`, `.reproductor`, `.buscador`, `body > main`, `.estampa`, `.revelacion*`);
> `src/components/PieImprenta.astro`; `src/lib/tema/copy.ts` (`PANTALLA_0`, `PARTIDA`,
> `SIN_SONIDO`); `src/lib/tema/buscador.ts` (`MAX_SUGERENCIAS`); `src/scripts/cinta.ts`
> (dónde monta el interruptor); `Docs/UX/UX-20-el-sitio-como-lugar.md` (los cuatro
> límites de movimiento, el mapa de atmósfera); `Docs/UX/UX-22-la-imprenta-de-
> rocambole.md` §1 y §1.4 (el techo del acierto, el mecanismo de `scrollIntoView`
> vigente); `Docs/DECISIONES.md` `D-19`, `D-21`, `D-33`, `D-35`; `.claude/rules/
> diseno-marca.md` (tabla anti-slop) y `.claude/rules/voz-ricotera.md`.
>
> **Resuelve:** `T-214`. Fija el presupuesto de píxeles de la portada, la partida y la
> revelación de "adiviná el tema" (`US-02`) para que las tres entren en un teléfono sin
> scroll muerto, con los 11 pozos alcanzables y ningún bloque tocable por debajo de
> `--toque-min` (48 px). No toca `US-25` (el portal) — esa es `T-215`, y no la abro acá.

## 0. Qué cambia y qué no

**No reabro nada de `UX-22`.** El mecanismo de la revelación —`Seguí` siempre tocable
desde el cuadro cero, la vista que se desplaza sola con `scrollIntoView({block:'end'})`
apuntando al bloque que termina en el botón— ya está construido y ya cumple las dos
condiciones de `UX-22 §1.4`. Lo que hago en la sección 4 es medir contra ese mecanismo,
no reemplazarlo.

**Sí cambio la estructura de los 11 pozos** (sección 2): "Todos los discos" queda como
única opción visible por defecto, y los otros diez se pliegan detrás de un disclosure.
Es el cambio que hace que el presupuesto de la portada cierre.

**No toco ningún hex, ninguna curva de animación ni ninguna paleta.** Todo lo de acá es
maquetado (alto, orden, qué se pliega), no marca.

---

## 1. La portada: presupuesto de píxeles (objetivo ≤ 812 px)

Hoy: **1591 px de documento** (1,96 pantallas). El desglose de dónde se va ese alto ya
lo midió el plan: `#portada` sola pesa 1350 px, y de eso los 11 pozos solos —sin
contar sus separaciones— ya son 693 px, más de la mitad.

La tabla de abajo es el **techo por bloque** que el hilo principal construye en `T-221`.
Es un presupuesto, no una medición: los números de `h1` (75 px) y de la bajada (72 px)
son los reales de hoy, medidos; el resto son objetivos que se logran con los cambios de
CSS que anoto en la columna de la derecha. Quien construya `T-221` mide con
`getBoundingClientRect`/`scrollHeight` real y ajusta con la lista de "si no alcanza" del
final de la sección — no hace falta que cada número caiga exacto, hace falta que la
**suma** cierre.

| # | Bloque | Alto objetivo | Cómo se logra |
|---|---|---|---|
| 1 | Padding superior de `main` | 16 px | Fijo (`--espacio-2`), no se toca — es el mismo en las trece pantallas |
| 2 | Cabecera (← Volver + interruptor de cinta) | 56 px | `.volver` ya mide 48 px (`--toque-min`) por diseño (`sitio.css:471-474`); bajo `margin-bottom` de `.cabecera-sitio` de `--espacio-3` (24 px) a `--espacio-1` (8 px) en el alcance de esta página. A 375 px los dos controles (sin `marca-chica`, que esta página no lleva) entran en una fila — ver contingencia abajo |
| 3 | Marca (sello ARCADE RICOTERO) | 38 px | Mismo tamaño de hoy (ya está achicada a propósito, `juego.css:179-187`); bajo el margen de `--espacio-2` arriba/abajo a `--espacio-1` |
| 4 | "— Adiviná el tema" (`.donde-estas`) | 31 px | Mismo tamaño; bajo `margin-bottom` de `--espacio-2` a `--espacio-1` en el alcance de esta página |
| 5 | `h1` "Adiviná el tema" | 75 px | Sin cambios — ya mide esto hoy (dos líneas a 2,3rem). No es el bloque caro, no lo toco |
| 6 | Bajada (`.tenue`, subtítulo) | 72 px | Sin cambios de CSS. Hoy son tres líneas a 1rem; si se acorta a dos, libera 24 px más de margen — lo anoto como palanca, no como requisito |
| 7 | "Todos los discos" (pozo único visible, preseleccionado) | 63 px | Sin cambios — es el mismo pozo de hoy, sale del `<ul class="pozos">` y queda solo, siempre visible (sección 2) |
| 8 | Disclosure "Elegí un disco" (`<summary>`, plegado) | 56 px | Control nuevo, `min-height: var(--toque-min)` + `margin-top: var(--espacio-1)` (sección 2) |
| 9 | Aviso de sonido | 74 px | Sin cambios (tres líneas a 0,8rem) |
| 10 | Arranque (cuántos + botón Jugá, sticky) | 110 px | Sin cambios — es la acción principal, no se toca |
| 11 | Padding inferior de `main` | 16 px | Fijo |
| | **Subtotal (1–11)** | **607 px** | |
| 12 | Pie de imprenta | **≤ 205 px** | Ver sección 5 — con el achique de `CNT-16`/`T-220` (< 120 px) sobran ~85 px de margen |
| | **Total** | **≤ 812 px** | |

**607 + 208 (el pie de hoy, sin tocarlo) = 815 px** — a 3 px del techo, prácticamente ya
cerrado solo con el cambio de los pozos. Con el pie de `CNT-16` el margen es cómodo.

### Contingencias, ya presupuestadas dentro del margen

- **Si la cabecera envuelve a dos filas** (el interruptor de cinta más su motivo, en
  algún aparato angosto): +56 px. El margen de 85 px con el pie de `CNT-16` lo absorbe.
- **Si el aviso de la llave del iPhone o del navegador incrustado se suma** (`SIN_SONIDO.
  llaveIphone` / `.incrustado`, `partida-tema.ts:176-187`): +19-24 px por línea extra.
  Mismo margen.
- **No los sumo ambos a la vez en el presupuesto de arriba** porque son mutuamente
  exclusivos en la práctica (un aparato no está a la vez en modo incrustado angosto y
  necesitando dos avisos de audio simultáneos) — si `T-225` (`revisor`) encuentra un
  aparato real donde se acumulan, el primer lugar para cortar es la bajada (punto 6).

### Si no alcanza: orden de corte

1. Bajada a dos líneas (libera 24 px) — pedido de longitud, no de redacción: que quien
   escriba `PANTALLA_0.subtitulo` en `T-221` la deje en ≤ 2 renglones a 343 px de ancho.
2. Aviso de sonido: bajar de `--fuente` a un tamaño 0,05rem menor si el texto de
   `PARTIDA.sinSonido` sigue en tres líneas (libera ~10 px, no más — no vale la pena
   sacrificar legibilidad por más).
3. **Nunca se corta:** el botón "Jugá" (fila 10), la estampa de la revelación, ni los
   colores/símbolos de acierto-error. Están fuera de este presupuesto por diseño.

---

## 2. Los 11 pozos: uno visible, diez plegados

### La decisión

**"Todos los discos" queda solo, fuera de la lista, siempre visible y preseleccionado.
Los otros diez viven adentro de un `<details>`/`<summary>` nativo, plegado por
defecto, en grilla de 2 columnas cuando se abre.**

Estructura (para `T-221`):

```html
<button class="pozo pozo--todos" data-disco="" aria-pressed="true">…</button>

<details class="elegi-discos">
  <summary>Elegí un disco</summary>
  <ul class="pozos"><!-- los diez, igual que hoy --></ul>
</details>
```

`.pozos` deja de tener un primer ítem que ocupa el ancho entero (`juego.css:564-568`,
regla que se puede borrar): ya no hace falta, "Todos" no vive ahí. Y la grilla de 2
columnas deja de estar detrás de `@media (min-width: 24rem)` (`juego.css:558-562`): a
375 px ya se aplica, sin esperar los 384 px del corte actual.

### Por qué esto y no las otras dos opciones

- **Grilla de 2 columnas siempre abierta** (sin plegar): baja el bloque de 693 a
  ~460-520 px (10 discos en 5 filas de a 2, agrupando los títulos largos —*¡Bang! ¡Bang!…
  Estás liquidado*, *Último bondi a Finisterre*— en la misma fila para minimizar cuántas
  filas crecen a dos líneas), pero **sigue sin cerrar el presupuesto de la sección 1**:
  460 px en vez de 119 px (pozo-todos + disclosure) es 341 px de más, y no hay margen
  para absorberlos sin volver a tocar el `h1` o la bajada, que son las piezas que **no**
  quiero tocar. La descarto por eso, no porque esté mal — es la opción correcta si algún
  día el presupuesto de arriba se afloja.
- **Tira horizontal con scroll lateral**: descartada de entrada. Es exactamente lo que
  el pedido pide evitar en otro lugar de la pantalla ("que no haya que scrollear"), y
  además esconde visualmente que hay diez discos más allá del borde — nadie sabe que
  hay que arrastrar si no ve el corte. Peor: en una fila que se desplaza horizontal, un
  disco elegido y el resto de la fila no se leen juntos con el pulgar en un solo
  vistazo, que es lo que si hace una lista vertical o una grilla.
- **El plegado con "Todos" arriba y el resto en un desplegable** es la única que baja el
  bloque de 693 a **119 px** (63 del pozo + 56 del disclosure) sin tocar nada del resto
  de la pantalla.

### Contra `--toque-min` y la zona del pulgar

- El `<summary>` mide `min-height: var(--toque-min)` (48 px): es un control tocable
  igual que cualquier botón del sitio, no una etiqueta.
- El pozo "Todos los discos" se queda en 63 px, igual que hoy — ya pasa el mínimo.
- **La zona del pulgar la sigue teniendo el botón "Jugá"**, que no se mueve del sticky
  de abajo. El disclosure vive arriba, en la zona que ya es más difícil de alcanzar con
  una mano — y está bien que así sea: es una acción de baja frecuencia (elegir un disco
  puntual), no la ruta principal. El "default correcto" que pide la tarea —tocar "Jugá"
  sin mirar la lista y jugar con todos los discos— sigue exactamente igual: "Todos los
  discos" ya está preseleccionado (`aria-pressed="true"`) antes de que nadie toque nada,
  y el sticky de `.arranque` no se toca.
- Los diez pozos de adentro del disclosure **no bajan de 48 px** tampoco: quedan con el
  mismo `.pozo` de hoy, solo que en 2 columnas.

### Presupuesto expandido (informativo, no entra en el techo de 812)

Cuando alguien toca el disclosure, la página sube a ~1,4 pantallas (parecido a lo que
mide hoy). **Eso está bien**: es una acción explícita, que la persona pidió con un tap —
no es el camino por defecto, y `UX-20 §1.3` (0 ms hasta que lo tocable responde) sigue
cumplido porque nada bloquea el toque siguiente mientras el contenido se despliega. El
navegador abre/cierra un `<details>` en el cuadro siguiente, sin animación propia por
defecto — nada que auditar contra el techo de movimiento de `UX-20`.

### La cadena de copy que falta

`PANTALLA_0.elegiPozo` ("¿Con qué jugás?") pasa a ser el texto del `<summary>`. Sugiero
`"Elegí un disco"` (imperativo voseado, sin infinitivo, tres palabras, pasa las siete
reglas de `voz.test.ts`) — el texto final lo redacta quien construya `T-221`.

---

## 3. La lista de sugerencias, sin scroll adentro

### Lo medido

6 ítems, `scrollHeight` 318 px, en una caja topeada en `max-height: 15rem` (240 px):
entran 4,5. El comentario de `buscador.ts:73` ("seis entran en un celular sin tapar el
teclado") ya no es cierto — quedó desactualizado cuando `.sugerencias` se topeó en
15rem sin volver a medir contra 6 ítems reales.

### La decisión: se queda en 6, sube el tope, se fija el alto del ítem

**No bajo `MAX_SUGERENCIAS` de 6 a 5.** El número ya tenía una razón escrita (seis
resultados es lo que hace falta para encontrar un tema por una palabra ambigua sin
que la lista se quede corta), y alcanza con corregir el tope que no se había vuelto a
medir. Bajar a 5 sería resolver un error de cálculo sacándole precisión al buscador.

Dos cambios en `juego.css`:

1. **`.sugerencias` sube de `max-height: 15rem` a `max-height: 21rem`** (240 px → 336
   px). Es 336 contra los 318 px medidos hoy: 18 px de margen, no ajustado al límite.
2. **`.sugerencia-titulo` y `.sugerencia-disco` pasan a una sola línea**
   (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`). Hoy no lo son, y
   por eso el alto de cada ítem varía con el largo del título — un tema con nombre largo
   puede ocupar dos líneas y estirar ese ítem por encima del promedio de 53 px
   (318 ÷ 6). Sin esto, una búsqueda que traiga varios títulos largos puede volver a
   pasarse de 336 px. Con esto, cada ítem queda en ~55-56 px fijos (padding `--espacio-1`
   arriba/abajo + una línea de título + una de disco + el borde), y 6 × 56 = 336 px es
   el techo real, no un promedio.

### Con el teclado abierto, que es el que manda

La lista se abre **hacia arriba**, pegada a la caja de texto (`partida-tema.ts:403-408`
ya explica por qué: es lo único que el teclado no tapa). El espacio disponible es la
distancia entre el techo del documento y el borde superior de la caja de texto, dentro
de la porción de pantalla que el teclado no cubre.

Con un tema recién empezado (los seis renglones de intento vacíos, sin revelación
abierta), lo que hay **arriba** de la caja de texto es: `main` padding-top (16) +
cabecera de partida (~36) + los 6 renglones vacíos (~94, `.intento--libre` a 0,6rem +
borde) + el reproductor completo (barra + escala + cinta + botón escuchar + aviso de
"¿no se escucha?", ~230) ≈ **376 px** antes de llegar a la caja de texto. Un teclado
móvil típico cubre entre el 35 % y el 45 % de los 812 px de la ventana (285-365 px), así
que la porción visible por encima del teclado ronda 447-527 px — **más que suficiente**
para los 336 px que pide la lista, incluso si el navegador no desplaza nada al enfocar
la caja (y si lo desplaza, lo hace para acercar la caja al teclado, lo que le da a la
lista *más* aire arriba, no menos).

No tengo con qué confirmar esto en un aparato real (`D-12`). El comando para que
`revisor` o el hilo principal lo verifiquen:

```
# con DevTools → Toggle device toolbar → 375×812, foco en el input,
# y el panel de "virtual keyboard" o el emulador real de Android:
document.querySelector('.sugerencias').scrollHeight <=
document.querySelector('.sugerencias').clientHeight
```

Si algún aparato real da un resultado distinto, la primera palanca es bajar
`MAX_SUGERENCIAS` a 5 recién ahí — no antes, porque hoy no hay evidencia de que haga
falta.

---

## 4. La revelación, en una pantalla

### El mecanismo que ya está resuelto, y que no toco

`UX-22 §1.4` ya fijó esto y `pintarRevelacion` (`partida-tema.ts:929-934`) ya lo
construye: al revelar, `revelacion.scrollIntoView({block: 'end'})` alinea el borde
inferior del panel —que siempre termina en el botón `Seguí`— con el borde inferior de
la ventana. La consecuencia, que la v4 de `UX-22` ya escribió, es la que uso acá:

> **Si el alto total de `.revelacion` es menor o igual a la ventana (812 px), el panel
> entero —estampa incluida— entra en pantalla sin que nadie scrollee, por construcción.**

No hace falta perseguir un presupuesto por bloque dentro de la revelación como hice con
la portada: hace falta una sola cuenta, `alto de .revelacion ≤ 812`, y hoy la cumple
con margen de sobra.

### El presupuesto, con y sin reproductor de tema entero

| Caso | Alto de `.revelacion` | Margen contra 812 |
|---|---|---|
| **Hoy** (sin reproductor de tema entero — no hay archivos, `D-22`) | 622 px, medido | 190 px |
| **Con reproductor de tema entero** (`REVELACION.escucharEntero` + `<audio controls>`) | ~722 px (622 + ~20 de texto + ~54-80 de los controles nativos del navegador, según SO) | ~90-140 px |
| **Peor caso**: lo de arriba + un título de disco largo envolviendo dos líneas en el `h2` (ej. *¡Bang! ¡Bang!… Estás liquidado*) | ~780-812 px | 0-32 px |

**El peor caso queda justo al límite, no lo pasa** — pero sin margen para nada más. Dos
salidas, ninguna toca la estampa ni el techo de tiempo de `UX-22 §1.1`:

1. `.revelacion-titulo` ya tiene `text-wrap: balance` (`juego.css:1075`); si un título
   de dos líneas empuja el total por encima de 812, la palanca es bajar su `font-size`
   un escalón (de 1,6rem a 1,4rem) **solo cuando el título mide más de un umbral de
   caracteres** — una regla de contenido, no de diseño, así que la dejo anotada acá y no
   la resuelvo con un número inventado.
2. Si en el futuro se agrega más contenido a la revelación (por ejemplo, una segunda
   línea de contexto), el orden de prioridad que ya fija `UX-22 §1.4` sigue rigiendo:
   **lo que puede quedar arriba del pliegue, afuera de la vista, es la parte de arriba
   del panel** (la estampa, si el panel se pone muy alto) — nunca el botón `Seguí`, que
   el mecanismo garantiza por construcción.

### Qué se ve y qué puede quedar abajo del pliegue

Con el mecanismo de `scrollIntoView({block:'end'})`, la jerarquía es siempre la misma,
de abajo hacia arriba en orden de qué nunca se sacrifica:

1. **`Seguí`** (o "Mirá cómo te fue" en el último tema) — nunca se sacrifica, es el
   ancla del `scrollIntoView`.
2. **El enlace a la letra y el reproductor de tema entero**, si existen — son los
   bloques más cercanos al botón y los últimos en desaparecer.
3. **Los puntos, el costo y la ficha del disco** — texto corto, registro 3, se leen
   rápido aunque queden parcialmente arriba del corte.
4. **La estampa y el título** — el premio (`D-33`). Es lo primero que se pierde si el
   panel crece por encima de 812, y es la consecuencia aceptada de la v4 de `UX-22`: en
   el peor caso imaginable, nada del premio se ve arriba pero el botón sigue entero y
   tocable. Con los números de hoy no llega a pasar — el margen más ajustado que calculé
   arriba es 0-32 px, no negativo.

---

## 5. El pie durante la partida: no se redistribuye nada

### Lo medido

Durante la partida (`#partida` visible, `#portada` oculta), el documento entra justo en
812 px, y 208 de esos (25,6 %) son el pie. El tablero de juego en sí —cabecera, barra,
casete, botón de escuchar, buscador— mide 604 px.

### La decisión

**No hay nada que redistribuir, y no hay espacio muerto que arreglar acá.** `D-35` ya
resolvió el problema real (el pie flotando sobre un vacío negro, la guillotina): el
`body` es flex-column, `main` crece con `flex: 1 0 auto` hasta donde termina el pie, así
que si el pie baja de tamaño, lo que pasa es que el documento entero baja de 812 a un
número menor — **no aparece un hueco negro, aparece un documento más corto**, que es
exactamente lo que pide el pedido ("que no haya espacio muerto"). No hace falta que el
tablero crezca para "usar" el espacio que el pie deja libre: `UX-20` ya trata el aire de
fondo como parte del lugar, no como un defecto a rellenar, y forzar más separación entre
los controles del tablero solo para ocupar los píxeles que sobran sería ruido sin
ninguna necesidad detrás.

### Lo que sí pido, en números

**No necesito que el pie baje de 208 px para que la partida entre en 812** — ya entraba.
Lo que pido es que **no crezca por encima de eso** cuando `CNT-16` reescriba su texto.
Como el pedido de esa tarea es achicarlo (`T-220`: el pie mide < 120 px), el resultado
es que la partida va a quedar con margen de sobra (604 + 120 = 724, contra 812), y ese
margen es el que uso en la sección 1 como colchón para las contingencias de la portada
— son la misma pieza (`PieImprenta.astro`) en las dos pantallas.

---

## Checklist — primera pantalla sin muro

- [ ] "Todos los discos" está preseleccionado antes de que nadie toque nada: el que
      llega y toca "Jugá" sin mirar nada juega con el catálogo completo.
- [ ] El disclosure de los diez discos empieza plegado. Nadie necesita abrirlo para
      jugar la primera partida.
- [ ] Cero scroll para llegar al botón "Jugá" a 375×812 (el sticky de `.arranque` sigue
      en pie, sin tocar).
- [ ] La lista de sugerencias no exige scroll interno para ver sus 6 resultados, ni con
      el teclado cerrado ni con el teclado abierto.
- [ ] La revelación entra entera en la ventana sin que nadie arrastre el dedo — la
      arrastra el sitio, una sola vez, con `scrollIntoView`.

## Checklist — accesibilidad

- [ ] El `<summary>` de "Elegí un disco" mide `--toque-min` (48 px) y es alcanzable con
      teclado (`<details>` nativo ya lo da: `Tab` + `Enter`/`Espacio`).
- [ ] Los diez pozos de adentro del disclosure siguen sin bajar de `--toque-min`, en la
      grilla de 2 columnas.
- [ ] Ningún ítem de la lista de sugerencias se comunica solo por posición: el
      resaltado del texto que coincide (`.sugerencia-coincide`) sigue en tinta, no en
      fondo.
- [ ] El `<details>` se abre y se cierra sin animación propia (comportamiento nativo):
      no hay ninguna transición nueva que auditar contra `UX-20 §1`.
- [ ] `.sugerencia-titulo` y `.sugerencia-disco` truncados con `text-overflow: ellipsis`
      no rompen el lector de pantalla: el `textContent` completo sigue en el DOM, solo
      cambia lo que se ve.

## Cómo se verifica

No corro nada (`D-12`). Comandos para quien construya `T-221`/`T-222`/`T-223`:

```js
// Portada, teclado cerrado, 375×812:
document.querySelector('main').scrollHeight <= 812 + 40   // margen que ya usa T-221

// Los 11 pozos siguen alcanzables (1 visible + 10 detrás del <details>):
document.querySelectorAll('[data-disco]').length === 11

// Ningún control tocable por debajo del mínimo:
[...document.querySelectorAll('.pozo, summary, .primario, .buscador-caja, .arriesgar')]
  .every(el => el.getBoundingClientRect().height >= 48)

// Sugerencias sin scroll interno, con 6 resultados:
const lista = document.querySelector('.sugerencias');
lista.scrollHeight <= lista.clientHeight

// Revelación entera en pantalla:
document.querySelector('.revelacion').getBoundingClientRect().height <= 812
```

`npm run check` y `npm test` siguen corriendo aparte, para lo que ya cubren
(`estilos.test.ts`, `voz.test.ts`, `contraste.test.ts`) — esta hoja no les agrega
ningún par de color nuevo ni ningún texto visible nuevo más allá del `<summary>`.

## Bloqueos que dejo anotados

- El texto exacto del `<summary>` ("Elegí un disco" o el que se decida) y el de
  `PANTALLA_0.subtitulo` acortado a dos líneas quedan para quien construya `T-221`,
  siguiendo `.claude/rules/voz-ricotera.md` — no son un banco de contenido nuevo, son
  las mismas cadenas de `copy.ts` que ya existen, más cortas.
- La palanca del punto 1 de la sección 4 (bajar el `font-size` del título de revelación
  solo si supera cierto largo) necesita un umbral de caracteres que no fijo acá porque
  depende de cómo se mida el ancho real de cada letra de disco (`UX-22 §7`) — si hace
  falta, es una medición del hilo principal antes de escribir el número, no una
  decisión de esta hoja.
