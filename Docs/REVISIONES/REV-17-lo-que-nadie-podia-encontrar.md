# REV-17 — "Lo que nadie podía encontrar" (`D-51`), verificado contra sus criterios

> Revisado el **2026-10-01** por `revisor`, con contexto fresco y sin haber armado ninguna de las piezas. **Pegado en esta ruta por el hilo principal**, como manda el README de esta carpeta: `revisor` es read-only. Los hallazgos, las evidencias y los dueños son los del revisor, copiados sin cambiar el sentido. **El cierre de cada hallazgo está al final**, escrito por el hilo principal el 2026-10-02.
>
> **Qué se verificó:** `D-51` y los once puntos del encargo: la puerta de dos ejes (`UX-06`, `BR-17`, `ADR-02`, `CNT-26`, `CNT-13` §8), Skayboy publicado (`BR-25`, `BR-29`, `CTR-16.7`), la casilla de corrección (`CTR-10`, `BR-21`, `UX-09`, `PRD-correcciones.md` §4), desafío de "Adiviná el tema" y compartir de tapa y letra (`FIND-28`), Spotify del quiz (`INV-140`, `ADR-01`), `MM-36`..`MM-45` (`INV-100`, `CNT-25` §2, `BR-32`), las tres bandas (`BR-34`, `BR-35`, `RES-47`, `CNT-28`, `voz-ricotera.md` §6), las calcomanías (`D-21`), el peso muerto, el bondi del casete de la tapa y las fichas (`D-51`, `IDS.md`, `INV-140`, `INV-141`).
>
> **Sobre la base de la revisión:** el trabajo estaba sin commitear al empezar y se commiteó mientras revisaba (`f935241`, con el árbol idéntico al que se estaba mirando). Después entraron `f446334` (`CNT-27`, "Completá la letra" a 72 versos) y `5fdc634` (`D-52`, el pogo de "Ponelos en fila"), que están **fuera de alcance** y no se revisaron. Las pruebas se corrieron sobre `f935241` y de nuevo sobre `HEAD`.

## Lo que pasó

- **`node --test 'src/**/*.test.ts'`: 1377 de 1377**, en `f935241` y en `HEAD`.
- **`npm run check`: 0 errores, 0 avisos** (12 *hints*, ninguno de lo entregado).
- **`npm run build`: 156 páginas.** Ver `FIND-94`: el estado decía 153.
- **El validador de la instancia (`validar_instancia.py`) no pudo correrse:** `../InstanciadorProyectos/` no existe en este entorno. Es un aviso, no un resultado.
- **`grep -r "@gmail" dist/`: sin resultados.** La casilla no está entera en el JavaScript publicado: `dist/_astro/correccion.*.js` trae las dos mitades como dos cadenas de un arreglo y las une con una arroba al cargar.
- **Peso muerto:** `md5sum` del video borrado (`git show 2678050:public/arte/bondiAfinisterreAnimado.mp4`) y de `Docs/UX/video-master/ultimo-bondi-ojo-de-buey.mp4`: ambos `17876e0351529e9ac23643ca89a362e5`, copia exacta. Lo que salió de `public/` suma 4.901.381 bytes (el "~4,9 MB" de `D-51` cierra). Un barrido de `dist/` (todo `src`, `href`, `data-*` y `url()` locales de los 156 HTML, los CSS y los JS) no encuentra **ni una referencia colgada**; ni `dist/` ni `src/` nombran ya el video, la fuente *Redonditos Fan*, los cinco derivados de tapa, la hoja de Skayboy, el lobo-lupus ni el ensayo.
- **En el navegador** (Chromium, 375 px, contra el `astro preview`): portal con once casetes sin desborde horizontal; los cinco desafíos al llegar (dos ejes, tema, tapa, letra, y los rechazos); compartir de dos ejes, tapa y letra hasta el portapapeles; la casilla de corrección en dos artículos; los tres artículos de banda; las dos calcomanías; Skayboy cargando en horizontal y sin errores de consola.

## Hallazgos

### FIND-86 — MEDIA — `MM-40` afirma en la pregunta un objeto que la cita de la ficha no trae

- **Criterio:** `BR-32` punto 1 (`PRD-mas-o-menos.md`): el dato con ficha tiene que respaldar exactamente lo que la pregunta afirma, igual que en `FIND-80`; `CLAUDE.md` §6.
- **Evidencia:** `src/data/mas-o-menos.json`, `MM-40`: *"¿Cuántas versiones de letras probó Rocambole antes de elegir el diseño de la tapa de «Gulp!», según él?"* = 40, `firmeza: "segun"`, `segun: "Rocambole"`. `INV-100`, fila `N-081`: la **cita** es *"probé como cuarenta versiones"*, sin objeto; "de letras" está en la columna de pregunta que redactó `investigador`, no en la cita. La propia `notaInterna` de `MM-40` lo admite, y `CNT-25` §2.6 deja la relectura de la nota de Infobae como pedido "no bloqueante". Entró `listo`. El proxy de red del entorno devuelve 403 a la nota.
- **Lo que sí está bien:** el número (40) coincide con la cita, la pregunta nombra a Rocambole (`i6`) y la `explicacion` avisa *"como cuarenta… cifra de memoria, no un conteo"*. Lo que no está respaldado es **qué eran** las versiones.
- **Arregla:** `investigador` (releer "40 años de Gulp!") y `contenido` (reformular o retirar).

### FIND-87 — MEDIA — el botón de corrección de la Redondopedia no arma el payload que `CTR-10` pide para ese banco

- **Criterio:** `CTR-10` (`ARQ-correccion.md`) §2.1, fila `redondopedia` (`dice` = el texto del párrafo o el `valor` del dato, `rotulo` = el del párrafo o dato, `fuente` = fichas, `ubicacion` = `párrafo N`) y §2.2 (`banco` = `{ contrato: 'sin-contrato', version: 0 }`); `BR-21` apartado 1 (la tercera categoría de corrección es "rótulo mal puesto"); `PRD-correcciones.md` §4 punto 1; `UX-09` ("Qué contiene" punto 2).
- **Evidencia:** `src/pages/redondopedia/[slug].astro`, bloque `<script>`: `ubicacion: 'el artículo'`, `dice: titulo`, sin `rotulo`, sin `fuente`, `banco: { contrato: 'redondopedia', version: 0 }`. Quien recibe el mail sabe en qué artículo, no qué frase ni con qué casilla. Tampoco hay test: la prueba 10 de `CTR-10` ("los seis juegos arman", un ítem real de cada banco) no existe para la Redondopedia.
- **Arregla:** hilo principal (el adaptador y su test) o `arquitectura` si prefiere enmendar `CTR-10` §2.1.

### FIND-88 — MEDIA — el transporte de mail, recién prendido, no tiene test, y el único que lo guardaba quedó vacío

- **Criterio:** `CTR-10` invariantes 8 y 9 (`sin casilla no hay mail`, `la cadena siempre termina en algo`); `CLAUDE.md` §8.
- **Evidencia:** `src/lib/correccion/armar.test.ts`: el test *"sin casilla configurada, el mail no existe"* estaba envuelto en `if (CASILLA === null)`; con la casilla puesta no afirmaba nada. `CASILLA` es una constante, así que ningún test podía forzar `null`. Las dos ramas nuevas de `transporte.ts` (`disponible` falso sin `location`, y el `try/catch` que cae a `no-pudo`) no las ejecutaba ninguna prueba.
- **Arregla:** hilo principal (un test del transporte con un `location` simulado, y una forma de probar la rama `null`).

### FIND-89 — MEDIA — Skayboy: lo que `BR-25` (a) y `BR-29` §4 siguen diciendo ya no es lo que pasó, y nadie lo enmendó

- **Criterio:** `BR-25` (a), `BR-29` §4, `CTR-16.7` y `ARQ-schema-niveles.md` (`deDos`: "escrito a mano después de la partida en el teléfono").
- **Evidencia:** los seis niveles `listo` con `deDos: true`. `D-51` punto 2 dice la verdad entera, pero `PRD-skayboy-y-poligirl.md` y `ARQ-schema-niveles.md` no cambiaron.
- **¿El rótulo queda honesto?** **Sí, en el sentido que le da el schema** (*"no prueba que se jugó, prueba que alguien se hizo cargo de decir que sí"*), y quien se hizo cargo está nombrado en `D-51`. **No, en el sentido que le da el PRD**: `BR-29` §4 dice que `deDos: true` demuestra una partida en el teléfono. Nada de lo que ve la gente miente; la inexactitud está en los documentos.
- **Arregla:** `producto` (nota de excepción en `BR-25` (a) y `BR-29` §4) y `arquitectura` (lo mismo en `ARQ-schema-niveles.md`).

### FIND-90 — MEDIA — resultado de dos ejes: el segundo botón queda debajo de la línea a 375×667

- **Criterio:** `UX-06` §4, "Prioridad de scroll": el nombre del cuadrante y **los dos botones** entran sin scroll en 375×667.
- **Evidencia:** a 375×667, `Compartí` ocupa y=560-614; **`Probá de nuevo` ocupa y=638-695, 28 px más abajo de 667**. Lo causó esta entrega: el botón nuevo empujó al secundario.
- **Arregla:** hilo principal con `experiencia`.

### FIND-91 — MEDIA — las etiquetas "Orden" y "Caos" del plano salen recortadas por el propio SVG

- **Criterio:** `UX-06` §4: las etiquetas de extremo, fuera del rombo, legibles.
- **Evidencia:** `plano()`: `viewBox` 240×240; "Orden" anclado `end` en x=30 y "Caos" `start` en x=210. A 320, 375, 414 y 768 px "Orden" sobresale por la izquierda del SVG (10 px a 375) y "Caos" por la derecha (2 px). El código no cambió en esta entrega; lo nuevo es que la pantalla ahora se alcanza desde el portal.
- **Arregla:** hilo principal con `experiencia`.

### FIND-92 — BAJA — `los-decoradores`: "pasó catorce años en la banda" puede leerse como Los Decoradores

- **Criterio:** `BR-08` / `D-14`; `voz-ricotera.md` §6.
- **Evidencia:** segmento 2: *"Sergio Dawi toca el saxo y pasó catorce años en la banda."* En el segmento 1 "la banda" es Los Decoradores; los catorce años son de los Redondos (`RES-47`).
- **Arregla:** `contenido`.

### FIND-93 — BAJA — la guarda del piso de la Redondopedia sigue en 35

- **Criterio:** `US-05` criterio 2 y la tabla de piso, enmendados por `BR-34`: 38.
- **Evidencia:** `src/lib/pisos.test.ts`: `assert.ok(articulos.length >= 35)`.
- **Arregla:** hilo principal.

### FIND-94 — BAJA — `ESTADO.md` y el mensaje del commit dicen "build 153"; el build da 156

- **Criterio:** `ESTADO.md` ("si esto y el disco no coinciden, manda el disco"); `CLAUDE.md` §8.
- **Evidencia:** `npm run build` sobre el mismo árbol: **156 páginas** (153 más los tres artículos de banda).
- **Arregla:** hilo principal.

### FIND-95 — BAJA — `CNT-26` §6 manda a `CNT-27` dos pedidos que `CNT-27` no es

- **Criterio:** `Docs/IDS.md` / `CLAUDE.md` §5 (un ID, un significado).
- **Evidencia:** `CNT-26` §6 puntos 5 y 6 apuntan a `CNT-27`, que es la ampliación de versos de la letra.
- **Arregla:** `contenido` y `orquestador`.

### FIND-96 — BAJA — el comentario de `LUGARES` sigue contando ocho

- **Evidencia:** `src/lib/sitio/copy.ts`, docstring de `LUGARES`: *"La prueba que los ocho tienen que pasar…"*; hoy son once.
- **Arregla:** hilo principal.

### FIND-97 — BAJA — las dos calcomanías nuevas se publican sin pasar por la tabla de `optimizar-arte.mjs`

- **Evidencia:** `muneco-antifaz.png` (80.637 bytes) y `mosca-rotulo.png` (41.849 bytes), RGBA de 32 bits, no están en `HUECOS`; sus hermanas del mismo hueco son PNG de paleta de 21 a 34 KB.
- **Arregla:** hilo principal.

### FIND-98 — BAJA — el portal ya no cumple lo que `UX-25` midió; `D-51` lo deja anotado y sin dueño que lo corra

- **Criterio:** `UX-25`, "Cómo se verifica": `scrollHeight` a 375×812 por debajo de ~1500 px con ocho casetes; cada `.casete` por debajo de 140 px.
- **Evidencia:** `scrollHeight` = **2544 px** con once casetes; ocho de once pasan de 140 px. Buena parte del exceso es anterior a esta entrega, pero esta entrega sumó dos casetes.
- **Arregla:** `experiencia`.

## Sin hallazgos (lo que se verificó y está bien)

- **Dos ejes, la puerta.** Casete A2 con la variante `luzbelito` (par AA testeado). `LUGARES.dosEjes` y las 14 cadenas de `CNT-26` §5 coinciden carácter por carácter con el código. **`BR-17`: ningún número sale del juego** (`?g=dos-ejes&r=CU-4`, sin `n`, `p` ni `t`). El desafío pinta el nombre del cuadrante **del banco**, no el de la URL; un id inventado, una forma con `p`/`t` o `g=quiz` no pintan nada; todo por `textContent`.
- **Desafío de "Adiviná el tema".** Juego obligatorio (`FIND-28`); un nombre con `<img onerror>` llega limpio por la lista blanca de `limpiarNombre`. Tapa y letra: lo mismo; compartir usa la escalera de `D-14` de `compartir.ts`.
- **Casilla de corrección (lo que sí pasa).** `grep "@gmail" dist/` vacío; el botón aparece al pie de cada artículo; la cadena de `D-14` sigue entera.
- **Spotify.** Cada ID coincide con `INV-140` y está en la pregunta que habla de ese tema (`QZ-011`, `QZ-015`, `QZ-042` → *Ji ji ji*; `QZ-033` → *Capitán Buscapina*; `QZ-036` → *Criminal Mambo*; `QZ-038` → *Todo un palo*; `QZ-039` → *Luzbelito y las sirenas*). Ninguna otra pregunta lleva `spotify`. El botón sale después del reveal (`RQ-B6`).
- **"Más o menos", recontado a mano contra `INV-100`:** `MM-36` (1995, `N-025`), `MM-37` (2, `N-075` + `RES-20`), `MM-38` (36 = 1985 − 1949), `MM-39` (33 = 1985 − 1952), `MM-40` (40: número ok, objeto en `FIND-86`), `MM-41` (27 capítulos), `MM-42` (863 páginas), `MM-43` (1992), `MM-44` (12 pistas), `MM-45` (52 minutos). Las dos de edad cuentan año contra año, como pedía el remedio de `FIND-81`.
- **Bandas de después.** Tres `concepto`, 38 en total, 10 `disco`; las siete aristas de `BR-34` §3 en el cuerpo; nombres y datos coinciden con `RES-47`. **Lo no verificado no va como `hecho`:** la nómina de Skay va como `leyenda`, "1997" no aparece, las dos fechas de Los Decoradores van en paralelo con su fuente, Tucumán entra como "anunciado". **La muerte del Indio, en `los-fundamentalistas`, va en registro 3**; el diff de `muerte-del-indio` es una sola línea, el envoltorio de enlace. Prosa en el registro 2 de `voz-ricotera.md` §6, sin suspensivos, sin jerga.
- **Calcomanías.** El crédito de `D-21` cubre lo que se ve: las dos fichas son de disco y acreditan su propia tapa.
- **Peso muerto, bondi, fichas, voz y diseño de lo agregado**: sin hallazgos (ver "Lo que pasó").

## Diferidos (no rompen un criterio escrito)

- `QZ-037` habla de «Ji ji ji» y no lleva botón (está `retirado`, no se sirve).
- `INV-140` marca "verificado" con grados distintos (*Criminal Mambo* por inferencia, *Luzbelito y las sirenas* con el álbum no visto); un clic en cada uno lo cierra.
- **El casete de Skayboy cortaba el "Gulp." del sobre** (el detalle es apaisado y el casete lo recortaba al cuadrado).
- `skay-y-los-fakires`, segmento 4: la segunda nómina no tiene fuente identificable en `RES-47`; segmento 2: "con tres nombres", cuando la primera etapa fue sin nombre formal.
- `los-fundamentalistas` repite en su primer segmento casi todo el resumen.
- `los-fundamentalistas` no está en `SLUGS_GRAVES` (lo dejó `BR-34` a `experiencia`); las tres bandas muestran "concepto" sobre el título.
- `public/arte/README.md` se publica (~10 KB de notas de trabajo).
- `juego.css` conserva una regla `.correccion-disparador:hover` que duplica la de `sitio.css`; `.correccion-panel` usa `--radio`.
- En el "Seguí por acá" de `los-decoradores` el título largo parte en dos renglones con un hueco grande.
- `compartir.ts`: si la persona cancela la hoja de compartir, el código cae al portapapeles. Es la misma escalera que "Más o menos".

---

## Cierre — hilo principal, 2026-10-02

| Hallazgo | Estado | Qué se hizo |
|---|---|---|
| `FIND-86` | **cerrado** | `contenido` retiró `MM-40` (`estado: "retirado"`, queda en el archivo para volver con la nota). "Más o menos" queda en 44 datos, 16/16/12 (`CNT-25` §2.7). |
| `FIND-87` | **cerrado** | Adaptador nuevo `src/lib/correccion/redondopedia.ts` (`partesParaCorregir`): el artículo entero, cada dato y cada párrafo, con su texto sin la marca de enlace, su rótulo, su `ubicacion` (`párrafo N`) y `banco: sin-contrato v0`. El panel muestra un selector **"Qué parte"** antes del campo (un solo botón por artículo, no diez). Dos tests con los 38 artículos de verdad, uno con su rojo visto. |
| `FIND-88` | **cerrado** | El mail es una fábrica (`transporteDeMail(casilla)`): tres tests nuevos con un `location` simulado — sin casilla no se ofrece; con casilla abre un `mailto:` con asunto y la corrección entera; si el navegador no deja, dice `no-pudo` y la cadena sigue. |
| `FIND-89` | **cerrado** | `producto` dejó la nota de excepción fechada en `BR-25` (a) y `BR-29` §4; `arquitectura`, en `CTR-16.7` de `ARQ-schema-niveles.md`. Las reglas no cambian. |
| `FIND-90` | **cerrado** | `.ejes-plano` con tope de alto (`36vh`): a 375×667 los dos botones terminan en y=532 y y=613. En un teléfono alto el plano mide igual. |
| `FIND-91` | **cerrado** | `viewBox` de `-32 0 304 240`: medido a 320, 375 y 768 px, las cuatro etiquetas quedan adentro con 16 px o más de aire. |
| `FIND-92` | **cerrado** | `contenido`: "pasó catorce años en los Redondos". |
| `FIND-93` | **cerrado** | `pisos.test.ts` pide 38 (`BR-34`). |
| `FIND-94` | **cerrado** | `ESTADO.md` dice 156. |
| `FIND-95` | **cerrado** | `contenido` reapuntó los dos pedidos a `CNT-29` (sin escribir, pendiente suyo); reservado en `IDS.md`. |
| `FIND-96` | **cerrado** | El comentario de `LUGARES` cuenta once. |
| `FIND-97` | **cerrado** | Las dos calcomanías entran a `HUECOS` y pasan a paleta: 80 → 20 KB y 41 → 8 KB. |
| `FIND-98` | **abierto** | Es de `experiencia`: el largo del portal con once casetes. |
| Diferido: el "Gulp." cortado | **cerrado** | Regla general en el portal: un detalle apaisado (más de 1,4 de ancho por alto) se pega entero, con el marco abrazando la pieza (`.casete-arte--apaisada`); el ancho no cambia, así que las etiquetas siguen en la misma columna. |

**Verificado al cerrar:** `npm test` 1381/1381, `npm run check` 0/0, build 156, `grep -r "@gmail" dist/` vacío, y en la vista previa a 375 px: el selector de partes en la ficha de *La mosca y la sopa*, el "Gulp." entero en el casete de Skayboy, el resultado de dos ejes a 375×667 y 320×568.
