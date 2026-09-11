# UX-25 — El portal en menos pantallas, sin sacar ningún casete

> Rol dueño: `experiencia`. `T-215`, ciclo 14.
>
> **Consumo:** `Docs/ORQ/ORQ-plan-ciclo-14.md` §1 (la medición real del 2026-09-10, a
> 375×812, leyendo el DOM: 2396 px, 233 px de cabecera, ~1757 px de ocho casetes, 227 px
> de pie); `src/pages/index.astro` entero; `src/lib/sitio/copy.ts` (`PORTAL`, `JUEGOS`,
> `CASETE_CANCIONERO`, `CASETE_REDONDOPEDIA`); `src/styles/sitio.css` entero (`.portada-
> arcade`, `.marca-grande`, `.bajada-portal`, `.rodillo`, `.casetera`, `.casete` y sus
> partes, `.lado`, `.pie-imprenta`); `src/styles/tokens.css` (`--toque-min: 48px`,
> `--espacio-1..4`, `--alto-pie-imprenta: clamp(8.5rem, 22vh, 13rem)`); `src/components/
> PieImprenta.astro`; `Docs/UX/UX-20-el-sitio-como-lugar.md` (los cuatro límites de
> movimiento, el umbral que corre una vez por visita); `Docs/UX/UX-22-la-imprenta-de-
> rocambole.md` (el idioma de estampa, sello, registro); `Docs/UX/UX-10-escritorio.md`
> (el corte de 46rem, el portal como única pantalla que ensancha su propio contenedor);
> `Docs/DECISIONES.md` `D-19`, `D-21`, `D-32`, `D-34`, `D-35`; `.claude/rules/diseno-
> marca.md` entera; `.claude/rules/voz-ricotera.md` §5 (la regla de las dos líneas).
>
> **No toco `UX-24` ni ningún archivo de código.** Esta hoja es el presupuesto y el
> rediseño del casete para que el hilo principal lo construya en `T-224`.

## 0. Lo medido, sin volver a discutirlo

`ORQ-plan-ciclo-14.md §1`, 2026-09-10, 375×812:

| Bloque | Alto medido |
|---|---|
| `.portada-arcade` (cabecera) | 233 px |
| 8 casetes | 216, 208, 216, 213, 209, 208, 235, 252 px — **~1757 px** |
| `.pie-imprenta` | 227 px |
| **Documento entero** | **2396 px = 2,95 pantallas** |

La diferencia entre 233+1757+227=2217 y 2396 son el rodillo, los dos títulos "Lado A" /
"Lado B" y el solapamiento negativo entre casetes — sección 1 los explica.

---

## 1. El presupuesto de píxeles por bloque

| Bloque | Hoy | Techo nuevo | Cómo se llega |
|---|---|---|---|
| `.portada-arcade` | 233 px | **210 px** | Margen superior de `.marca-grande`: `--espacio-3` (24px) → `--espacio-2` (16px). Margen inferior de `.bajada-portal`: `--espacio-3` → `--espacio-2`. El texto no cambia una letra — esto es margen, no redacción. |
| `.rodillo` | ~58 px (24+24 de margen + 10 de alto) | **42 px** | Margen `--espacio-3` → `--espacio-2` en los dos lados. |
| `.lado` (título "Lado A") | ~64 px | **48 px** | `margin-top`: `--espacio-4` (40px) → `--espacio-3` (24px). El `margin-bottom` (`--espacio-1`) no se toca. |
| `.lado` (título "Lado B") | ~64 px | **48 px** | Ídem. |
| **Cada casete** (×8) | 208–252 px | **136 px** | Rediseño completo, sección 2. Un solo número para los ocho: es el mismo objeto, y el collage ya vive de que se apilen parejos y se solapen — no de que cada uno tenga su propia altura de excepción. |
| `.pie-imprenta` | 227 px | **120 px (supuesto)** | No es mío: depende de `CNT-16` (`T-213`) y de `T-220`, que corren en esta misma ráfaga. Uso 120 px porque es el propio techo que `T-220` ya se puso como criterio de verificación en el plan (*"el pie mide < 120 px a 375×812"*) — no invento un número nuevo, adopto el que ya existe. **Si `CNT-16` entrega un crédito más largo que eso, este presupuesto no cierra** y hay que renegociar entre esa ficha y esta. |

**Total bruto:** 210 + 42 + 48 + 48 + (8 × 136 = 1088) + 120 = **1556 px**.
**Menos el solapamiento entre casetes** (`.casetera > li + li { margin-top: -10px }`, que
no toco y sigue valiendo): 7 uniones × -10 px = -70 px.

**Total: ~1486 px = 1,83 pantallas**, contra las 2,95 de hoy. Un 38 % menos, con los ocho
casetes puestos y ninguno sacado.

**Qué entra en el primer pliegue (812 px):** cabecera (210) + rodillo (42) + "Lado A" (48)
= 300 px, quedan 512 px → **tres casetes y medio visibles sin tocar la pantalla**, contra
los 2,17 de hoy. No es "sin scroll" — nadie prometió eso para el portal, a diferencia de
la portada del juego que resuelve `UX-24` — pero el primer vistazo ya muestra más de un
tercio de la oferta, y no un casete y medio.

---

## 2. Qué le pasa al casete

Hoy cada casete trae cinco piezas: el dibujo original (arte), la etiqueta (título +
bajada), la tapa chica (detalle de la foto real, `D-21`/`UX-05`) y el sello de acción. Van
una por una.

### 2.1 El arte (dibujo original): se queda igual

54×54 px, sin cambios. No es el cuello de botella — el bloque que más alto mide hoy es la
etiqueta de texto, no la imagen — y es la pieza que más "casete" hace de todo el objeto:
tocarla no ahorra nada y sí arriesga que deje de reconocerse.

### 2.2 La tapa chica (foto real, 34×34 px): se saca del portal

**Esta es la decisión que más pesa, y la fundamento por tres lados:**

1. **Es la aplicación literal de mi propio mandato.** El sistema visual de este proyecto
   reserva las tapas reales, en baja resolución y con crédito, para el juego que las
   necesita — y un casete del portal no necesita reconocer una tapa para que alguien sepa
   qué botón tocar. La mezcla `D-19` ya dice de qué disco es cada sección **con el color**
   del borde y del sello; repetir esa información con una segunda foto de 34 px no suma
   nada que el color no dijera ya, y sí suma 34 px + el `gap` de fila que le pertenecía.
2. **`D-21` lo permite, no lo exige.** La decisión que abrió las tapas reales a cualquier
   pantalla dice que pueden entrar, con crédito y baja resolución — no dice que tengan que
   estar en todos lados. Sacarla del portal no es dar marcha atrás sobre `D-21`; es no
   usar un permiso donde no rinde.
3. **Efecto colateral bueno para `CNT-16`.** Hoy `tapasUsadas` en `index.astro` acredita
   en el pie **todos los discos que visten los ocho casetes** (vía
   `DETALLE_POR_VARIANTE`), porque cada uno muestra su detalle real. Sin la tapa chica, el
   pie del portal solo tiene que acreditar la franja de fondo fija (`oktubre-banderas`) —
   la lista de discos del crédito pasa de ocho o nueve nombres a uno. Esto es una
   consecuencia de mi rediseño, no una propuesta de texto: **queda anotado para `T-224`**,
   que es quien va a tocar `index.astro` y va a tener que achicar ese cálculo junto con el
   resto.

**Lo que descarté:** achicarla en vez de sacarla (a 20×20 px, por ejemplo). No alcanza:
el ahorro real no está en el tamaño de la imagen sino en la fila entera que hoy ocupa
(`casete-pie`, con su propio `gap` de `--espacio-2`), y una tapa de 20 px sigue exigiendo
esa fila. O se saca la fila, o no se ahorra nada que valga la pena.

### 2.3 El sello de acción: baja de fila, no de lugar

Hoy vive en una segunda fila del grid (`casete-pie`, `grid-column: 1 / -1`), enfrentado a
la tapa chica con `justify-content: space-between`. Sin la tapa, esa fila ya no tiene
sentido como fila propia — pero **no lo pongo al lado del título**, aunque siete de los
ocho sellos (`JUGÁ`, `ARMÁ`, `TOCÁ`, `LEÉ`) entrarían justos en esa línea. Uno no entra:
"Completá la letra" (18 caracteres) junto a "EN LA COCINA" (el sello de `casete--pronto`,
12 caracteres más su borde punteado) suma más ancho del que le queda a la columna de
etiqueta a 375 px. Un criterio parejo para los ocho es más fácil de sostener que una
excepción para el que hoy está en la cocina — y el día que cambie el texto de un sello,
nadie tiene que acordarse de que había un cálculo de ancho ajustado en un solo casete.

**Dónde queda:** debajo de la bajada, dentro de la misma columna de etiqueta, alineado a
la izquierda, con la misma rotación de sello de goma que ya tiene (`rotate(-1.4deg)`).
Sigue siendo un sello, no una pastilla — nada de esto lo toca.

### 2.4 La bajada: se pliega en el punto, no se recorta a la fuerza

Acá está la otra mitad del ahorro, y es la aplicación directa de la regla de las dos
líneas (`voz-ricotera.md §5`) más algo que ya audita `voz.test.ts`: la **primera
oración** de cada bajada tiene que medir ocho palabras o menos. Eso ya está garantizado
por el test — lo que hago acá es sacar provecho de esa garantía en el layout.

**La decisión: en el casete del portal se muestra solo la primera oración de `baja`**
(la que corta en el primer punto), nunca la segunda. El texto completo de dos oraciones
**se queda intacto en `copy.ts`** — no es una edición de contenido, es una regla de
render: `c.baja.split('.')[0] + '.'`. Nadie reescribe una palabra; el hilo principal
decide en el template cuánto de lo que ya existe se pinta en este lugar puntual.

**Por qué esto no pierde información que haga falta**, con la prueba corrida ocho veces
en la sección 3: en los ocho casos, título + primera oración + sello alcanzan para saber
qué es el juego y qué botón tocar. La segunda oración de cada bajada de hoy es siempre
mecánica adicional (cuántos intentos, cuántas opciones, qué pasa si fallás) — información
real, pero que la propia pantalla del juego repite apenas se entra. Ninguna de las ocho
segundas oraciones es la única fuente de un dato que el jugador necesite antes de decidir
si entra.

**Por qué no uso `-webkit-line-clamp` con puntos suspensivos.** Fue la primera opción que
consideré y la descarto: el corte automático de una línea a mitad de oración deja "…" en
pantalla, y `voz-ricotera.md §3.7` es explícito — el suspensivo es de la prosa que
**cuenta** (la Redondopedia), nunca de un rótulo ni de una instrucción, y la bajada de un
casete es la línea que **canta** (registro 1), no la que cuenta. Cortar en el punto que ya
existe en el texto evita el problema de raíz: no hay nada que recortar a la fuerza, hay
una oración completa que se muestra y otra que no.

**Medidas:** `font-size: 0.8rem` (bajaba de `0.85rem`), `line-height: 1.3` (bajaba de
`1.35`), sin recorte de línea porque no hace falta — medí las ocho primeras oraciones
contra el ancho real de la columna de etiqueta a 375 px (~197 px de texto, descontados
los `padding` de `.casete` y de `.casete-etiqueta` y el ancho del dibujo) y las ocho
entran en dos renglones sin excepción: la más larga, "El hecho como hecho, la leyenda como
hecho" (47 caracteres), y la más corta, "Un verso te tiene que alcanzar." (32). El
presupuesto de renglón es **2, siempre — 34 px**, no una variable por casete.

### 2.5 El casete nuevo, armado

Columna de etiqueta, de arriba abajo: título (`0.95rem`, bajaba de `1.05rem`) → primera
oración de la bajada, dos renglones → sello de acción o "en la cocina". Al lado, el
dibujo de 54×54 sin cambios. `.casete` pasa su `padding` de `--espacio-2` (16 px) parejo
a 12 px parejo.

**¿Sigue leyéndose como casete, y no como una tarjeta genérica?** Sí, y esta es la
pregunta que el encargo pide que conteste yo: lo que queda es dibujo + título + una línea
que explica + un sello de goma — que es literalmente lo que trae la carátula de papel de
un cassette grabado en casa, sin la foto de más que ningún cassette real tiene pegada
encima. Lo que se pierde (la miniatura de tapa, la segunda oración) no es lo que hace
"casete" al objeto — es contenido de bonus que la propia sección 3 confirma que no hace
falta para decidir si entrar.

### 2.6 Lo que no hago: dos columnas a 375 px

Lo consideré y lo descarto, con números. A 375 px, dos columnas dejarían cada casete en
~170 px de ancho (descontado `gap` y márgenes) — un 15-20 % menos que el ancho de una sola
columna que ya usé para medir la sección 2.4. El caso límite que ya obligó a sacar el
sello del renglón del título ("Completá la letra" + "EN LA COCINA") se rompe mucho antes a
ese ancho, y no hay margen para arreglarlo bajando más el tamaño de letra sin perder
legibilidad. Además, `UX-10 §5` es explícito: por debajo de 46rem el ancho de ventana no
es lo que cambia el layout, y esta hoja no le encuentra un motivo funcional a romper eso
—a diferencia del cancionero, donde el acorde alineado sí lo pedía—. Una columna, más
compacta, es la respuesta.

---

## 3. La regla de las dos líneas, casete por casete

La prueba de `voz-ricotera.md §5`: tapá la que canta (acá, la bajada entera, no solo la
segunda oración) y fijate si título + sello alcanzan para saber qué es esto y qué tocar.

| # | Casete | La que nombra | La que canta (sobrevive: 1ª oración) | ¿Pasa tapada? |
|---|---|---|---|---|
| 1 | Preguntas ricoteras | Título + `JUGÁ` | "Ocho preguntas y ninguna piadosa." | Sí — título ya dice "preguntas", `JUGÁ` dice qué hacer |
| 2 | Adiviná el tema | Título + `JUGÁ` | "Con una décima te tiene que alcanzar." | Sí, con margen — el título es él mismo un imperativo que nombra el mecanismo entero |
| 3 | Sacalo por la letra | Título + `JUGÁ` | "Un verso te tiene que alcanzar." | Sí — mismo caso que el anterior |
| 4 | Completá la letra | Título + "EN LA COCINA" | "Lo tenés en la punta de la lengua." | Sí — el sello punteado ya avisa que no hay partida todavía, sin necesidad de la bajada |
| 5 | Ponelos en fila | Título + `ARMÁ` | "De la valla para atrás, los ponés vos." | Sí — "ponelos en fila" + "armá" ya arman la imagen de ordenar algo |
| 6 | Adiviná la tapa | Título + `JUGÁ` | "Rocambole dibujó; vos ponés el disco." | Sí, el más fuerte de los ocho: el título es la instrucción entera |
| 7 | Letras y acordes | Título + `TOCÁ` | "Los diez discos, con los dedos puestos." | Sí — "letras y acordes" + "tocá" ya dicen que es para tocar canciones |
| 8 | La Redondopedia | Título + `LEÉ` | "El hecho como hecho, la leyenda como leyenda." | Sí — "Redondopedia" + "leé" alcanza para entender que es para leer |

Los ocho pasan. Es la confirmación, no la premisa, de que cortar en la primera oración
(sección 2.4) no le saca al portal nada que haga falta para decidir si entrar — el
molinete sigue abierto con el título y el sello solos.

---

## 4. Lo que esta hoja no toca

**El umbral.** El bloque `<script is:inline slot="cabeza">` de `index.astro` que decide
`data-umbral` una vez por visita (`sessionStorage`, `ADR-03 §5`, `UX-20`) no cambia una
línea. Nada de este presupuesto agrega un nuevo elemento que necesite animación de entrada
propia, así que no hay nada nuevo que el umbral tenga que asentar — el rediseño del casete
hereda las animaciones `umbral-grano`, `umbral-figura` y `umbral-sello` que ya existen,
sin sumar una cuarta.

**El tránsito entre pantallas.** `view-transition-name: lugar` (en `.tapa-fondo--portal`)
y `view-transition-name: marca` (en `.marca-grande`) siguen siendo los únicos dos nombres
del documento — no agrego una `.tapa-fondo` nueva (la tapa chica que saco no era una,
era un `<img>` normal) ni una segunda marca. `ADR-03 §6.3` sigue cumpliéndose sin que yo
tenga que decir nada más.

---

## 5. El pie: cuánto necesito, no cuánto hay

Uso **≤ 120 px** como supuesto de trabajo (sección 1), y no es un número mío: es el propio
techo que `T-220` ya se fijó como criterio de verificación en el plan del ciclo. Si
`CNT-16` entrega un crédito que a 375 px mide más que eso, el total de la sección 1 crece
en la misma medida — no hay margen extra escondido en otro bloque para absorberlo.

Un dato a favor de que el número cierre igual: la sección 2.2 saca del portal casi todos
los discos que hoy acredita el pie (la lista de `tapasUsadas` en `index.astro` va a quedar
en un disco solo, `oktubre-banderas`, en vez de ocho). Eso no acorta el texto que escribe
`CNT-16` —esa ficha resuelve el mensaje de fans y el destino del crédito, no el conteo de
discos—, pero si el crédito del portal termina siendo "arte de la tapa de Oktubre" en vez
de "arte de las tapas de Oktubre, Lobo suelto, Cordero atado, La mosca y la sopa..." con
seis nombres más, el renglón que arma `PORTAL.creditoTapas` es bastante más corto por
construcción, no por redacción.

---

## 6. Escritorio: no contradice `UX-10`

`UX-10 §2.4` fija que desde 46rem la casetera pasa a grilla de 2 columnas explícitas y que
"cada casete queda en ~344 px" de ancho. Esta hoja no toca el ancho ni el número de
columnas — cambia la altura y la composición interna de cada casete, y eso se hereda igual
arriba y abajo del corte: a 46rem, cada columna de 344 px sigue mostrando el mismo casete
de 136 px de alto que describe la sección 2, no uno más bajo ni uno con una fila extra.

`UX-10 §5` dice, sobre el corte de 46rem, que "por debajo, todo teléfono en vertical, sin
excepción — el sitio se ve exactamente igual que hoy". Esa frase describía el estado del
2026-08-24 y no es una promesa de que el diseño mobile no vaya a evolucionar nunca — es la
garantía de que **agregar comportamiento de escritorio** (hover, columnas, decoración de
margen) no le cambia nada al celular. Esta hoja no agrega comportamiento de escritorio:
rediseña el objeto base, que las dos anchuras comparten. No hay contradicción que declarar
más allá de esta aclaración.

---

## Lo que queda para otro rol o para otra ráfaga

- **`UX-05`** (el catálogo de qué detalle de qué tapa viste cada pantalla) va a quedar
  desactualizado en la fila de los casetes del portal una vez que `T-224` saque la tapa
  chica. No lo corrijo acá — está fuera del alcance de esta tarea (un solo archivo) — pero
  queda anotado para quien retome esa hoja.
- **El cálculo de `tapasUsadas` en `index.astro`** tiene que achicarse junto con el resto
  del maquetado (sección 2.2). Es trabajo de `T-224`, no una decisión nueva que yo esté
  tomando ahora: es la consecuencia directa de sacar la tapa chica.

## Cómo se verifica

No tengo con qué correrlo (`D-12`). Lo que queda para quien construya `T-224`:

- A 375×812, con `npm run dev`: `document.documentElement.scrollHeight` por debajo de
  ~1500 px con los ocho casetes puestos (el número exacto depende de cuánto mida
  finalmente el pie de `T-220`).
- `document.querySelectorAll('.casete')` — cada uno con `getBoundingClientRect().height`
  por debajo de 140 px (el techo de 136 más un margen chico de tolerancia por fuente
  real) y por encima de `48` (`--toque-min`) sin excepción — hoy ya lo garantiza
  `min-height: var(--toque-min)` en `.casete` y esta hoja no lo saca.
- Ningún `.casete-baja` de los ocho debería mostrar más de dos renglones ni un punto
  suspensivo: si alguno lo hace, la oración que se está mostrando no es la primera, o el
  ancho real de la columna quedó más angosto que el que medí en la sección 2.4.
- `npm test` en verde, en particular `voz.test.ts` (la primera oración de cada bajada
  sigue siendo la que se audita, esté completa o cortada en el template) y
  `contraste.test.ts` (nada de esta hoja introduce un color nuevo).
- En un celular real: el primer vistazo muestra la cabecera, "Lado A" y al menos tres
  casetes completos sin scrollear.
