# UX-05 — Catálogo: qué detalle de qué tapa viste cada pantalla

> Rol dueño: `experiencia`. Resuelve el mandato de `D-21` ("`experiencia` reescribe la
> fila de `UX-04` y escribe `UX-05`, el catálogo de qué detalle de qué tapa viste cada
> sección bajo el mapa de `D-19`"). Aplica las reglas de `UX-04` v3 (las tres formas, el
> piso de legibilidad, el mecanismo de crédito) — **no las redefine**. Consume `D-19` (la
> mezcla), `public/arte/README.md` (el despiece dibujado existente, con el que este
> catálogo tiene que convivir sin pisarlo), `RES-06`/`RES-20`/`RES-22`
> (`Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md` e `INV-20-fuentes-primarias.md`),
> `src/lib/sitio/copy.ts` (los nombres reales de pantalla y el campo `viste` ya asignado a
> cada casete), y las 35 imágenes de `Docs/INVESTIGACION/TapasDiscos/`, todas miradas antes
> de escribir la fila que las cita.

## Cómo leer esta tabla

- **Forma** es una de las tres de `UX-04`: **detalle recortado** (480 px, recorte tratado
  como pegado — borde rasgado, rotación), **fondo velado** (640 px, tope 60 KB, con
  `--velo-tapa` u opcional `--velo-tapa-titular` detrás de texto), o **ficha** (320 px, la
  tapa entera, sin cambios respecto de lo que ya existe en la Redondopedia).
- **Legibilidad:** todo fondo velado de esta tabla usa **`--velo-tapa` (86 %)**, no
  `--velo-tapa-titular`, porque en las siete pantallas reales de hoy el texto de cuerpo
  convive siempre con algún titular — ninguna pantalla real es solo texto grande. Dejo esto
  anotado porque significa que `--velo-tapa-titular` queda **propuesto y sin un caso de uso
  real todavía**; no es un error, es que ninguna pantalla de hoy lo pide.
- Un **detalle recortado** que **flota** en un margen (aria-hidden, sin overlap con texto —
  el mismo patrón que ya usan `perro.svg`/`mosca.svg` en el portal) **no dispara el test de
  contraste**: esa exención la fija `UX-04` textual ("si el detalle queda detrás o pegado a
  texto... rige el mismo piso de legibilidad"). Lo marco en cada fila.
- **Crédito**, por tipo de pantalla, mecanismo ya fijado por `UX-04` — acá solo se aplica:
  pantallas con `Base.astro` → línea nueva en `footer.pie-sitio`; islas de partida sin
  `Base.astro` (hoy: el quiz) → sello de esquina en `--fuente-rotulada`.
- **"Dónde cae"** es descripción en palabras y fracciones — los píxeles exactos los define
  quien recorta.
- La mezcla de `D-19` que este catálogo aplica: portada=**Oktubre**, historia=**Gulp!**,
  mitología=**Lobo suelto**, letras=**La mosca y la sopa**, discos=**Último bondi**,
  resultado=**Gulp! + el lettering del logo**.

---

## 1. `/` — el portal collage-cassette

El portal no tiene una sola identidad: la cabecera viste Oktubre (la marca del sitio,
`D-19`) y cada casete ya declara su propio disco en `copy.ts` (campo `viste`) desde antes de
esta tarea. Este catálogo aplica ese mapa existente a una pieza fotográfica real por primera
vez — hasta ahora esos casetes solo tenían color de acento (`--cat-*`) y un ícono dibujado.

| Pantalla | Disco (`D-19`) | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/` — cabecera (`marca-grande` + `bajada`) | Oktubre | `oktubre-frontal.jpg` | La franja de banderas rojas sobre negro, sin la multitud de caras debajo ni el wordmark arriba | La banda horizontal entre el 42 % y el 63 % de alto: las cinco astas con sus banderas, cortando antes de que empiecen las cabezas | Fondo velado (640 px, `--velo-tapa`) | Refuerza que la portada viste Oktubre (`D-19`) con la misma imaginería que ya usa el recorte dibujado `multitud-banderas.png` (`RES-06`), pero en material distinto (foto real, no calco) — conviven sin pisarse porque la regla de marca permite ambos materiales en la misma pantalla si no se mezclan en la misma pieza |
| `/` — casete "Preguntas ricoteras" (quiz) | Oktubre | `oktubre-frontal.jpg` | Una sola bandera con su asta, la segunda desde la izquierda | El 20 %–35 % de ancho, 45 %–62 % de alto: un asta aislada, sin las demás ni la multitud | Detalle recortado (480 px), flotante junto al rótulo "Viste Oktubre", sin overlap de texto | Recorte más chico y distinto del de la cabecera para no repetir el mismo encuadre dos veces en la misma pantalla; una sola bandera es legible como ícono de sello en un espacio de casete chico |
| `/` — casete "Adiviná el tema" | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las tiras de papel rasgado atadas al cuello de la figura, sin la cara | La franja del cuello, 55 %–75 % de alto, mitad izquierda de ancho: los "tags" de papel, sin colmillos ni ojos | Detalle recortado (480 px), flotante junto al rótulo "Viste Lobo suelto" | Evita la cara (ya cubierta por el dibujado `lobo-lupus.png`, `RES-20`); la textura de papel rasgado es abstracta, de alto contraste, y no "recompone" la tapa |
| `/` — casete "Completá la letra" | La mosca y la sopa | `la-mosca-y-la-sopa-frontal.jpg` | El rótulo amarillo en diagonal con el nombre del disco y la mosca dibujada junto a la firma | La esquina inferior derecha, del 70 % de alto para abajo | Detalle recortado (480 px), flotante junto al rótulo "Viste La mosca y la sopa" | Es el logo real de la tapa, no la foto de recital de arriba — evita mostrar gente real reconocible en una pieza chica de interfaz, y el logo ya es del tamaño de un sello |
| `/` — casete "Adiviná la tapa" | Último bondi | `ultimo-bondi-a-finisterre-frontal.jpg` | El motivo metálico grabado tipo circuito | La esquina superior izquierda, 0 %–30 % de ancho y de alto | Detalle recortado (480 px), flotante junto al rótulo "Viste Último bondi" | Evita el ojo de buey central con los rostros de la banda — este casete es la puerta al juego que va a usar muchas tapas reales como contenido de juego; su propio ícono de sección no debería adelantar ninguna cara |
| `/` — casete "La Redondopedia" | Gulp! | `gulp-frontal.jpg` | La pincelada blanca y negra sin ningún trazo de la letra verde | La esquina inferior derecha, 65 %–100 % de ancho y de alto, por debajo de la firma manuscrita | Detalle recortado (480 px), flotante junto al rótulo "Viste Gulp!" | Textura abstracta de la técnica fichada de Rocambole (rodillo/pincel, `RES-06`); distinto del recorte de Gulp! que usa `resultado` (ver más abajo), para no repetir la misma pieza en dos contextos del sitio |

**Crédito:** el portal usa `Base.astro` → una línea nueva en `footer.pie-sitio`:
*"Arte de tapa: Oktubre, Gulp!, Lobo suelto, La mosca y la sopa y Último bondi — Rocambole
(Ricardo Cohen)"* (los cinco discos que aparecen en esta pantalla, un solo crédito).

---

## 2. `/quiz/` — las cuatro pantallas

El quiz no usa `Base.astro` (es la isla de `partida.ts`): el crédito va en **sello de
esquina**, no en pie de página. Como el sello tiene que reflejar qué disco está en pantalla
en cada momento, su texto cambia junto con `item.categoria` — el contenido del sello lo
especifico acá, la lógica de actualizarlo la implementa el hilo principal.

| Pantalla | Disco (`D-19`) | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/quiz/` — presentación (`#portada`) | Oktubre | `oktubre-frontal.jpg` | Un fragmento de la curva de la "O" y el trazo diagonal de la "K" de "OKTUBRE", cortado en ángulo, sin completar ninguna letra | El cuarto superior izquierdo: 0 %–25 % de ancho, 15 %–40 % de alto | Fondo velado (640 px, `--velo-tapa`) | El corte en diagonal evita que el wordmark real se lea entero al lado de "ARCADE RICOTERO" — compet iría con la marca del sitio si se leyera completo; el trazo abstracto sigue siendo reconociblemente parte de esa tapa para quien la conoce |
| `/quiz/` — pregunta, categoría **historia** | Gulp! | `gulp-trasera.jpg` | La pincelada en forma de montaña, sin texto ni el sello rojo | 10 %–35 % de ancho, 5 %–25 % de alto | Detalle recortado (480 px), en la cabecera junto al chip de categoría, sin tocar la zona de opciones (pulgar) | Categoría historia = Gulp! (`D-19`); recorte distinto al de "resultado" (mismo master, otra zona) para que dos momentos del quiz no muestren idéntica imagen |
| `/quiz/` — pregunta, categoría **mitología** | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las mismas tiras de papel rasgado del casete del portal | Igual que la fila del casete de arriba | Detalle recortado (480 px), cabecera, sin tocar opciones | Reutilizar el mismo recorte que el casete de "Adiviná el tema" refuerza la asociación categoría↔disco en vez de fragmentarla — coherencia de marca, no ahorro de trabajo |
| `/quiz/` — pregunta, categoría **letras** | La mosca y la sopa | `la-mosca-y-la-sopa-frontal.jpg` | El mismo logo amarillo diagonal con la mosca | Igual que la fila del casete de arriba | Detalle recortado (480 px), cabecera, sin tocar opciones | Misma razón: consistencia con el casete de "Completá la letra" |
| `/quiz/` — pregunta, categoría **discos** | Último bondi | `ultimo-bondi-a-finisterre-frontal.jpg` | El mismo motivo metálico grabado | Igual que la fila del casete de arriba | Detalle recortado (480 px), cabecera, sin tocar opciones | Misma razón: consistencia con el casete de "Adiviná la tapa"; ojo — esto es la identidad de la *categoría* discos, no el disco real que pregunta ese ítem puntual, que puede ser cualquiera de los diez (ver "Qué no pude decidir") |
| `/quiz/` — respuesta (panel de feedback, mismo `#partida`) | El mismo que la pregunta que se está respondiendo | — (no agrega archivo nuevo) | — | — | Hereda el mismo detalle que ya está en pantalla | La respuesta no es una pantalla nueva en el DOM (`zonaPartida` se actualiza en el lugar): no tiene sentido cambiar la tapa a mitad de la misma sección. El sello de crédito de esquina persiste sin parpadeo |
| `/quiz/` — resultado (`#resultado`) | Gulp! + el lettering del logo | `gulp-frontal.jpg` (fondo) y `gulp-trasera.jpg` (logo) | Fondo: la pincelada blanca y negra del cuarto inferior derecho (igual que el casete de Redondopedia). Logo: el sello rojo manuscrito **"Gulp."**, solo, sin la lista de temas ni el texto de grabación | Fondo: 65 %–100 % de ancho y de alto del frontal. Logo: el tercio superior de la trasera, entre el texto de grabación y la lista de temas | Fondo velado (640 px, `--velo-tapa`) + detalle recortado (480 px) del logo, junto al puntaje grande | `D-19` pide explícitamente "Gulp! + el lettering del logo" para resultado y compartir — el sello rojo manuscrito de la contratapa **es literalmente ese lettering**, no una interpretación mía |

**Extiende a la tarjeta compartible (`UX-02`):** `D-19` dice "resultado **y compartir**" en
la misma cláusula — la tarjeta que se genera para redes hereda el mismo fondo y el mismo
logo que el resultado en pantalla. El detalle de layout de esa tarjeta es de `UX-02`, no de
este catálogo; dejo la cita para que no se pierda el mandato de `D-19`.

**Crédito:** sello de esquina, texto que cambia con la pantalla — ejemplos: en presentación
y resultado, *"Arte de tapa: Oktubre — Rocambole (Ricardo Cohen)"* y *"Arte de tapa: Gulp! —
Rocambole (Ricardo Cohen)"* respectivamente; en una pregunta de categoría discos, *"Arte de
tapa: Último bondi — Rocambole (Ricardo Cohen)"*.

---

## 3. `/juegos/adivinar-el-tema/`

Hoy es la pantalla "en la cocina" de `US-02` (`COCINA['adivinar-el-tema']`, usa
`Base.astro`). Viste Lobo suelto (`copy.ts`: `variante: 'mitologia'`, `D-19`).

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/juegos/adivinar-el-tema/` | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las mismas tiras de papel rasgado, a mayor escala que el detalle chico del portal | Igual zona que las filas anteriores (franja del cuello, mitad izquierda) | Fondo velado (640 px, `--velo-tapa`), detrás de toda la tarjeta `.cocina` | La pantalla es corta (título + un ícono + dos párrafos): un fondo proporcionado a esa tarjeta, no a todo el viewport, es coherente con que esto es una pantalla de "viene pronto", no el juego real |

**Crédito:** `Base.astro` → línea en `footer.pie-sitio`: *"Arte de tapa: Lobo suelto —
Rocambole (Ricardo Cohen)"*.

**Aviso de trazabilidad:** cuando `US-02` deje de ser una pantalla "en la cocina" y se
implemente como isla de partida (como ya es el quiz), lo más probable —siguiendo el patrón
de `UX-04`— es que deje `Base.astro`. Ese día, el crédito de esta fila migra de pie de
página a sello de esquina, y esa migración le corresponde a quien escriba el `UX-XX` propio
del juego 2 (todavía no existe).

---

## 4. `/juegos/completar-la-letra/`

Hoy es la pantalla "en la cocina" de `US-03`. Viste La mosca y la sopa (`copy.ts`:
`variante: 'letras'`, `D-19`).

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/juegos/completar-la-letra/` | La mosca y la sopa | `la-mosca-y-la-sopa-trasera.jpg` | La olla de metal con el cucharón asomando | La esquina superior derecha: 65 %–100 % de ancho, 20 %–55 % de alto | Fondo velado (640 px, `--velo-tapa`), detrás de la tarjeta `.cocina` | Uso la **trasera**, no el logo de la frontal ya usado en el portal/quiz, para variar el material dentro del mismo disco; recorta la olla (el objeto que da nombre al disco: "la sopa") y evita por completo la cara del chico que grita, que es la parte sensible de esa composición |

**Crédito:** `Base.astro` → *"Arte de tapa: La mosca y la sopa — Rocambole (Ricardo
Cohen)"*. Misma nota de trazabilidad que la fila anterior sobre la futura migración a sello
de esquina cuando `US-03` deje de ser cocina.

---

## 5. `/juegos/adivinar-la-tapa/`

Hoy es la pantalla "en la cocina" de `US-04`. Viste Último bondi (`copy.ts`: `variante:
'discos'`, `D-19`). **Distinción importante, ya anotada por `UX-04`:** esta identidad de
sección (Último bondi) es la del casete/placeholder, no la del juego jugable — una vez
construido, `US-04` va a mostrar fragmentos de **cualquiera** de los diez discos como
contenido de cada ronda, bajo la única condición estricta de `D-21` (la edición tiene que
estar confirmada). Esta fila cataloga solo la pantalla de hoy.

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/juegos/adivinar-la-tapa/` | Último bondi | `ultimo-bondi-a-finisterre-trasera.jpg` | Engranajes y tubos metálicos | La esquina superior derecha, evitando la placa de pergamino con la lista de temas y el triángulo rojo de la esquina opuesta | Fondo velado (640 px, `--velo-tapa`), detrás de la tarjeta `.cocina` | Uso la trasera (no el frontal ya usado en portal/quiz) para variar el material; los engranajes son textura pura, sin rostros ni texto legible — ideal de fondo, y no adelanta ninguna de las tapas que el futuro juego va a usar como respuesta |

**Crédito:** `Base.astro` → *"Arte de tapa: Último bondi — Rocambole (Ricardo Cohen)"*.
Cuando `US-04` deje de ser cocina, el crédito real del juego jugable **no lo resuelve esta
fila**: cada ronda va a mostrar un disco distinto y necesita su propio mecanismo (línea o
sello que nombre el disco de esa ronda específica) — queda para el `UX-XX` propio del
juego 4, todavía sin escribir.

---

## 6. `/redondopedia/` — la portada

Usa `Base.astro`. Es el casete "La Redondopedia" del portal llevado a página completa; viste
Gulp! (`copy.ts`: `CASETE_REDONDOPEDIA.viste`, `D-19`: historia=Gulp!) como identidad general
de entrada, aunque adentro cada artículo cambie de color según su tipo
(`TIPO_A_CATEGORIA`).

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/redondopedia/` | Gulp! | `gulp-frontal.jpg` | La pincelada blanca y negra sin la letra verde (mismo recorte que el casete del portal) | La esquina inferior derecha, 65 %–100 % de ancho y de alto | Fondo velado (640 px, `--velo-tapa`), detrás de la cabecera (título + bajada + explicación de rótulos), no detrás del índice de artículos | El índice de artículos es una lista larga y crece con cada `T-XX` que agregue contenido — un fondo fijo detrás de una lista que se extiende sin límite es justo el caso que `UX-04` evita al limitar el fondo a 640 px de peso; la cabecera es de tamaño fijo y acotado |

**Crédito:** `Base.astro` → *"Arte de tapa: Gulp! — Rocambole (Ricardo Cohen)"*.

---

## 7. `/redondopedia/<slug>/` — la ficha de artículo

Acá hay que distinguir dos casos, porque ya se comportan distinto en el código
(`src/pages/redondopedia/[slug].astro`).

### 7a. Ficha de **disco** (`articulo.tipo === 'disco'`)

**Ya implementado, sin cambios (`UX-04`: "Ficha... sigue como está").** Cada uno de los diez
artículos de disco muestra **su propia tapa entera**, en baja, como **ficha** — no un
detalle ni un fondo de otro disco. Los diez casos:

| Slug | Archivo master (frontal) |
|---|---|
| `gulp` | `gulp-frontal.jpg` |
| `oktubre` | `oktubre-frontal.jpg` |
| `un-baion-para-el-ojo-idiota` | `un-baion-para-el-ojo-idiota-frontal.jpg` |
| `bang-bang-estas-liquidado` | `bang-bang-estas-liquidado-frontal.jpg` |
| `la-mosca-y-la-sopa` | `la-mosca-y-la-sopa-frontal.jpg` |
| `lobo-suelto` | `lobo-suelto-cordero-atado-cd1-frontal.jpg` |
| `cordero-atado` | `lobo-suelto-cordero-atado-cd2-frontal.jpg` |
| `luzbelito` | `luzbelito-frontal.jpg` |
| `ultimo-bondi-a-finisterre` | `ultimo-bondi-a-finisterre-frontal.jpg` |
| `momo-sampler` | `momo-sampler-frontal.jpg` |

**Aviso para quien mapee slug → máster en `generar-tapas.mjs`:** los dos últimos discos del
álbum doble **no** siguen el patrón `<slug>-frontal.jpg`. `lobo-suelto` sale de un archivo
llamado `lobo-suelto-cordero-atado-cd1-frontal.jpg` y `cordero-atado` de
`lobo-suelto-cordero-atado-cd2-frontal.jpg` — sin esta tabla, alguien podría buscar
`lobo-suelto-frontal.jpg` y no encontrarlo.

**Decisión — no agrego detalle ni fondo nuevo en esta pantalla.** Aunque la identidad
"discos = Último bondi" (`D-19`) también aplica al color de acento de esta página
(`articulo--discos`), no agrego un recorte de Último bondi acá: la página **ya muestra la
tapa real y completa del disco que trata**, que es la señal de identidad más fuerte posible.
Superponer un segundo disco distinto (Último bondi) como fondo confundiría cuál tapa es la
del artículo. Los diez ya tienen, además, su sticker dibujado del despiece existente
(`STICKER_DISCO` en `arte.ts`) — salvo tres, ver la sección de discos al final.

### 7b. Ficha de **hito** o **persona** (`TIPO_A_CATEGORIA` → historia → Gulp!)

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/redondopedia/<slug>/` (tipo `hito` o `persona`) | Gulp! | `gulp-frontal.jpg` | La misma pincelada blanca y negra del casete/portada de Redondopedia | Esquina inferior derecha, 65 %–100 % | Detalle recortado (480 px), flotante junto al título y la etiqueta de tipo, nunca detrás del cuerpo rotulado | El cuerpo de estos artículos es prosa larga con segmentos rotulados (`BR-08`) — meter un fondo detrás de eso es exactamente lo que `UX-04` advierte que no escala (peso + legibilidad en scroll largo); un detalle chico junto al título no compite con nada |

### 7c. Ficha de **concepto** o **leyenda** (`TIPO_A_CATEGORIA` → mitología → Lobo suelto)

| Pantalla | Disco | Archivo master | Qué detalle | Dónde cae | Forma | Por qué |
|---|---|---|---|---|---|---|
| `/redondopedia/<slug>/` (tipo `concepto` o `leyenda`) | Lobo suelto | `lobo-suelto-cordero-atado-cd1-frontal.jpg` | Las mismas tiras de papel rasgado del resto del catálogo | Franja del cuello, mitad izquierda | Detalle recortado (480 px), flotante junto al título, nunca detrás del cuerpo | Misma razón que 7b: prosa larga, detalle chico y no invasivo |

**Aviso de tono, criterio propio sin ficha detrás:** tres artículos de tipo `hito` tratan
temas graves — `muerte-del-indio`, `walter-bulacio`, `olavarria-2017`. Mi sugerencia es que
el detalle decorativo de 7b **se omita** en esos tres slugs puntuales, aunque la regla
general de la fila lo habilite — es una llamada de tono, no de legibilidad, y la dejo
marcada para que `contenido` (dueño de `CNT-04`, el límite editorial sobre estos casos) la
confirme o la descarte.

**Crédito, en ambos casos (7b y 7c):** `Base.astro` → línea en `footer.pie-sitio` con el
disco correspondiente a esa página puntual (no los cinco del portal — acá es una sola
tapa por artículo).

---

## Los diez discos, uno por uno: dónde aparece cada uno

| Disco | Dónde aparece hoy (según este catálogo) |
|---|---|
| **Oktubre** | `/` (fondo cabecera + detalle casete quiz), `/quiz/` presentación (fondo), su propia ficha |
| **Gulp!** | `/` (detalle casete Redondopedia), `/redondopedia/` (fondo), artículos hito/persona (detalle), `/quiz/` pregunta-respuesta categoría historia (detalle) y resultado/compartir (fondo + logo), su propia ficha |
| **Lobo suelto** | `/` (detalle casete tema), `/quiz/` pregunta-respuesta categoría mitología (detalle), `/juegos/adivinar-el-tema/` (fondo), artículos concepto/leyenda (detalle), su propia ficha |
| **La mosca y la sopa** | `/` (detalle casete letra), `/quiz/` pregunta-respuesta categoría letras (detalle), `/juegos/completar-la-letra/` (fondo), su propia ficha |
| **Último bondi a Finisterre** | `/` (detalle casete tapa), `/quiz/` pregunta-respuesta categoría discos (detalle), `/juegos/adivinar-la-tapa/` (fondo), su propia ficha |
| **Un baión para el ojo idiota** | Solo su propia ficha (con sticker dibujado `muneco-antifaz.png`, ya existente) |
| **¡Bang! ¡Bang!... Estás liquidado** | Solo su propia ficha — **sin sticker dibujado tampoco** (ver más abajo) |
| **Cordero atado** | Solo su propia ficha (con sticker dibujado `cordero-rulo.png`, ya existente) |
| **Luzbelito** | Solo su propia ficha (con sticker dibujado `luzbelito-vela.png`, ya existente) |
| **Momo Sampler** | Solo su propia ficha (con sticker dibujado `banda-superheroes.png`, ya existente) |

Los diez aparecen en al menos una pantalla, como exige la tarea. Los cinco que no entran en
el mapa de `D-19` (Un baión, ¡Bang! ¡Bang!, Cordero atado, Luzbelito, Momo Sampler) llegan
únicamente vía su ficha propia, porque ese es el único punto del sitio donde tienen una
sección dedicada — no hay hoy una pantalla de "todos los discos" ni un cruce narrativo que
los use como acento de fondo. Si esa pantalla apareciera (un futuro índice de discos, una
línea de tiempo), ahí es donde estos cinco ganarían su primera fila de detalle/fondo.

**Caso aparte, `¡Bang! ¡Bang!... Estás liquidado`:** es el único de los diez sin ningún
acento hoy, ni siquiera dibujado — no está en `STICKER_DISCO` de `arte.ts` ni en ninguna de
las dos listas de `public/arte/README.md`. No lo resuelvo acá (ese despiece es del hilo
principal, no mío), pero lo dejo escrito para que no se pierda: su ficha en la Redondopedia
es, hoy, la única de las diez sin decoración propia además de la tapa.

---

## Qué NO pude decidir, y quién lo decide

- **Los recortes exactos en píxeles.** Di fracciones y descripciones ("la esquina inferior
  derecha, 65 %–100 %"); el recorte real en píxeles lo hace quien produzca los derivados con
  `scripts/generar-tapas.mjs` extendido (`T-45` ya lo dejó pendiente, en ese orden: diseño →
  `tokens.css` → test).
- **Si el detalle decorativo se omite en los tres artículos de tono grave** (sección 7c) —
  dejo la sugerencia, la confirma `contenido` (dueño de `CNT-04`).
- **El sticker faltante de ¡Bang! ¡Bang!... Estás liquidado** — no es mi carpeta
  (`public/arte/README.md`), lo dejo señalado, no resuelto.
- **El `UX-XX` propio del juego 4 jugable** (qué tapa exacta usa cada ronda, en qué forma,
  cómo se acredita ronda por ronda) — esta fila solo cubre la pantalla "en la cocina" de
  hoy; el juego real necesita su propio documento, todavía sin escribir.
- **La migración de crédito de pie a sello** cuando `US-02`, `US-03` y `US-04` dejen de usar
  `Base.astro` (si siguen el patrón del quiz) — la anoto como aviso en cada fila que
  corresponde, pero la ejecuta quien escriba esas islas.
- **Si `--velo-tapa-titular` (75 %) llega a usarse alguna vez** — hoy ninguna pantalla real
  calza (todas mezclan texto de cuerpo); queda como token vivo pero sin caso de uso en este
  catálogo.

---

## Trazabilidad

Este documento no deroga ni reescribe `UX-04`: aplica sus tres formas, su piso de
legibilidad y su mecanismo de crédito a las siete superficies reales del sitio de hoy. Cuando
una pantalla nueva se agregue (un juego que deja de ser cocina, un índice de discos futuro),
este catálogo suma una fila — no cambia las que ya existen, salvo que el propio `UX-04`
cambie primero.
