# ORQ — Plan del ciclo 15: Skayboy y Poligirl, y la hoja que no es un atlas

> **Escrito por `orquestador`** el 2026-09-16, a pedido del usuario: *"Agregue los sprites
> continua con el siguiente ciclo"*.
>
> Arranca sobre `main` en `d4f44fe`, con **los entregables de los tres roles todavía sin
> commitear** (`producto`, `arquitectura` y `experiencia` escribieron en paralelo en esta
> misma ráfaga). Antes de tocar nada: guardar lo que ya está, y después mejorar.
>
> Rangos libres al abrir: `T-226`..`T-250` (los míos, y este plan los consume todos),
> `CNT-17`+, `REV-14`, `FIND-55`+, `RES-70`+. Consumidos por los tres entregables de hoy:
> `US-09`, `BR-23`..`BR-28`, `ADR-08`, `CTR-15`..`CTR-17`, `UX-27`..`UX-30`.
>
> **Consume:** `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`, `Docs/ARQ/ARQ-motor-de-juego.md`,
> `ARQ-atlas-de-sprites.md`, `ARQ-schema-niveles.md`, `ARQ-efectos-de-sonido.md`,
> `Docs/UX/UX-27`..`UX-30`, los traspasos nuevos de `Docs/SUGERENCIAS/` —nueve a la mañana,
> trece a la tarde—, `D-38`..`D-43`, `IDEA-14`, `INV-60`, `ESTADO.md`. Y desde la tarde,
> `Docs/REVISIONES/REV-14-ciclo-15.md`.
>
> **Enmendado el mismo 2026-09-16, a la tarde, después de `REV-14`.** Este plan se cortó a la
> mañana y el revisor lo leyó a la tarde. Dos hallazgos son míos y se cierran acá: **`FIND-61`**
> (le di a `revisor` dos tareas que no son suyas) y **`FIND-62`** (16 de 25 tareas sin comando
> corrible, contra `CLAUDE.md` §8 y `D-12`). Entran además **`D-42`** y **`D-43`**, que el plan
> no podía conocer, y las cuatro cadenas que `arquitectura` dejó viejas en
> `Docs/SUGERENCIAS/ARQ-para-orquestador-lo-que-cerro-y-lo-que-el-plan-dice-de-mas.md`.
> **Nada se borra: lo enmendado se marca.** El detalle, en `§3.2` y `§3.3`; el rango se amplió
> a `T-260` en `Docs/IDS.md` y de esa ampliación tomo tres: `T-251`, `T-252` y `T-253`. Quedan
> libres `T-254`..`T-260`.

## 1. Lo medido antes de cortar nada

Todo esto se midió **hoy, 2026-09-16**, sobre el árbol de trabajo. No es recuerdo ni
estimación: son los números que devolvieron los comandos.

| Qué | Dónde | Cuánto |
|---|---|---|
| El sitio hoy | `npm test` | **578/578** en verde (eran 576 al cerrar el ciclo 14) |
| Islas | `src/scripts/` | **15 archivos**, y **ninguno importa un paquete de npm**. El motor sería el primero |
| Censo de rutas | `src/lib/sitio/rutas-sonoras.ts` | **14 páginas declaradas**. La del juego no existe, y una página sin declarar rompe el build |
| Bancos validados | `src/lib/esquemas.test.ts:48` | **7 entradas**. No hay `skayboy` ni existe su schema |
| Tintas del pixel | `src/styles/tokens.css` | **cero** `--px-*`. La paleta de `UX-27 §4` todavía no existe en el repo |
| Auditor del área | `scripts/` | **`auditar-paleta-pixel.mjs` no existe**. Hasta que exista, el área no tiene auditor |
| Carpeta de sprites | `public/sprites/`, `public/arte/pixel/` | **ninguna de las dos existe**, y los dos documentos nombran una distinta |

### 1.1 La hoja de sprites, medida con `sharp`: **no está sobre grilla de píxel**

Esto es lo más importante del ciclo y cambia el trabajo de lugar. `CTR-15.2` dejó el comando
y los tres desenlaces escritos antes de correrlo, para que el resultado no se interprete. Se
corrió sobre `public/arte/skayboy_poligirl.png`:

| Medición | Resultado |
|---|---|
| Lienzo | 1299 × 725, RGBA |
| Alfa | **0 píxeles transparentes, 0 píxeles intermedios**: el alfa está lleno, como ya se sabía |
| Colores distintos | **108.705** |
| Cobertura | los 16 colores más usados cubren el **43 %** de la imagen; los 1024 más usados, el **71,6 %** |
| Fondo | **no es un color**: un bloque de 40 × 40 de fondo liso trae **52 tintas distintas** alrededor de `rgb(23,110,119)` |
| Grilla latente | con tolerancia ±10, **cambian 1221 de 1298 columnas y 679 de 724 filas**, y los bordes se reparten parejo en todas las fases de `N` = 2, 3, 4, 5, 6, 8, 10, 12 y 16 (concentración 1,00× lo esperado) |

**Traducido: `N = 1`, el desenlace 2 de `CTR-15.2`.** La hoja tiene *estética* de píxel y no
está dibujada sobre una grilla de píxel. Dos consecuencias que hay que mirar de frente:

1. **`image-rendering: pixelated` sobre esto no da pixel art, da barro** (`D-41` punto 1). La
   pieza hay que **cuantizarla**, y `CTR-15.2` ya avisó qué significa eso: *"no es un paso
   técnico, es dibujo, y tiene dueño"*.
2. **Sacar el fondo "por coincidencia exacta de color" no se puede** (`CTR-15.4`,
   `UX-27 §6` paso 2): el fondo son decenas de tintas. Hace falta umbral con tolerancia, y
   con tolerancia aparecen halos — que es justo lo que las dos hojas prohíben.

El traspaso del hilo principal ya había medido que los rótulos y sus flechas puentean los
sprites y que el recorte automático los devuelve pegados en un blob. Con esto encima, **el
recorte automático no es una opción hoy**, y la salida barata sigue siendo la misma que ese
traspaso recomendó: que el usuario reexporte (ver `§5`).

## 2. Los cinco choques entre roles, y de quién es cada uno

> **Estado al cierre de la tarde, después de `REV-14`: los cuatro choques de `§2.1` a `§2.4`
> cerraron el mismo día.** `§2.1` la geometría y la carpeta —salvo dos líneas de `UX-27` que son de `T-229`, ver
> `§3.2` punto 5—, `§2.2` el sonido del fracaso, `§2.3` la paleta y `§2.4` la puerta del nivel
> 1, que cerró `producto` cediendo. **Cerrado no es probado:** eso es `T-252`. El relato de
> abajo queda como estaba, porque es **por qué** chocaron, y eso no cambia porque se resuelvan.

Los tres roles escribieron el mismo día sin mirarse, que es como se pidió. Salió bien: hay
cuatro cosas que un rol dio por bloqueadas y otro ya había cerrado, y cinco donde dos
documentos describen la misma pieza con números distintos. Lo segundo es lo que hay que
cerrar antes de dibujar o programar una línea.

### 2.1 La misma área de juego, con dos geometrías — **el choque número uno**

| | `arquitectura` (`ADR-08.3`, `CTR-15.3`, `CTR-16.2`) | `experiencia` (`UX-27 §2`, `UX-28 §2`) |
|---|---|---|
| Área lógica | **416 × 192** = 26 × 12 tiles | **240 × 144** = 15 × 9 tiles |
| Celda de personaje | **32 × 48 nativos** (2 × 3 tiles) | **16 × 24 nativos** (1 × 1,5 tiles) |
| Escala | entera **en píxeles de dispositivo** (DPR 3 → ×5) | **×2 en píxeles CSS** |
| Carpeta | `public/sprites/` | `public/arte/pixel/` |
| Paleta | lista de hex **en el JSON del atlas**, tope 32 | **16 `--px-*` en `tokens.css`** |

**La trampa está en que los dos dicen "32 × 48" y quieren decir cosas distintas.** En
`CTR-15.3` son píxeles nativos; en `UX-27 §2` son píxeles CSS después de escalar ×2. Los dos
coinciden en que **el muñeco se ve de 32 × 48 px CSS en el teléfono** y no coinciden en nada
más: en la sala de `arquitectura` el personaje ocupa un cuarto del alto; en la de
`experiencia`, un sexto. Eso no es un detalle de render, es **cuánto nivel entra en la
pantalla**, y `CTR-16.2` ya lo fijó en el schema (`ancho: 26`, `alto: 12`).

Y el reparto de pulgares no cierra con los números de `arquitectura` tal como están: 416 × 5
px de dispositivo a DPR 3 son **693 px CSS** de ancho, más 16 de bisel y las dos columnas de
112 de `UX-28`, dan **933 px** en una ventana de 812. Entra si el factor entero baja a ×3
(416 CSS), pero entonces un tile mide 16 px CSS y no 32.

**Quién mueve:** `arquitectura` ya lo dejó escrito —*"si el reparto no entra, el que se mueve
es el 416 × 192: decímelo y lo cambio"*— y la medición de `§1.1` empuja para el mismo lado:
si hay que cuantizar de cero, el tamaño nativo lo elige quien dibuja, y `UX-27` lo eligió
sobre la hoja. Lo que no se mueve es que el factor sea entero: eso es `D-41`.

### 2.2 El fracaso suena en un contrato y no suena en el otro

`CTR-17.1` tiene un efecto llamado **`muerte`** que suena al tocar terreno letal, y
`CTR-17.6` dice *"la muerte se ve además de oírse"*. `UX-29 §6` prohíbe que el fracaso suene
—*"ni golpe, ni quejido, ni música de derrota"*— y `UX-para-arquitectura-el-area-de-juego.md`
§6 lo repite: *"es la pieza donde el silencio es la decisión"*. `BR-24` está del lado de
`UX-29`.

Y hay un costado que rompe una verificación ya escrita: `UX-29 §9` audita con
`rg -i "vida|muerte|moriste|perdiste|game over"` sobre el copy y la isla. Un efecto que se
llama `muerte` en `sonido.ts`, y un `tipo: "letal"` con `mata: [...]` en `CTR-16.4`, hacen
fallar esa verificación desde el primer día. Son cinco efectos y no cuatro, y un vocabulario
de contrato que la decisión de pantalla ya dio vuelta.

**Quién mueve:** `arquitectura`, enmendando `CTR-17` y `CTR-16.4` con número, como
`ADR-08.9` enmendó `ADR-07.9`. Cuesta una tarea hoy y cuesta seis niveles escritos después.

### 2.3 La paleta tiene dos casas, y una de las dos rompe una regla del hilo principal

`CTR-15.4` pide la lista de hex **adentro del JSON del atlas** (`"paleta": ["#…"]`, tope 32).
`.claude/rules/diseno-marca.md` dice que `tokens.css` es *"el único archivo del repo donde
puede vivir un hex"*, y `UX-27 §4` pone los 16 en `tokens.css` con prefijo `--px-`. Una lista
de hex en `public/sprites/skayboy.v1.json` es un hex fuera de `tokens.css` con coartada.

Tiene arreglo barato y no lo decido yo: que el JSON nombre tokens en vez de hex, o que el
test cruce la lista contra `tokens.css` y falle si no coinciden. **De `arquitectura`**, con la
regla del hilo principal al lado.

### 2.4 El nivel 1 no puede tener una sola puerta

`US-09` criterio 4 y la tabla de escalones dicen que el nivel 1 *"enseña moverse y llegar a la
puerta"* y que **el 2 introduce la puerta doble**. `CTR-16.5` regla 1 exige *exactamente una
entrada y una puerta por personaje* en todo nivel, y la regla 2 dice que la condición de
victoria —los dos en su puerta al mismo tiempo— **no se parametriza por nivel**.

Los dos no pueden ser ciertos: bajo ese schema, el nivel 1 ya tiene la puerta doble. O el
escalón se reescribe, o el schema admite un nivel de una puerta. **De `producto`**, y es una
línea; pero hay que contestarla antes de escribir el primer JSON.

### 2.5 Las cuatro cosas que un rol dio por bloqueadas y otro ya cerró

Vale la pena dejarlo escrito porque las tres listas de bloqueos quedaron desactualizadas el
mismo día que se escribieron:

1. **El cuadro `enPausa`** (`CTR-15.7`, y bloqueo declarado por `producto` y `arquitectura`)
   **ya está resuelto**: `UX-28 §3` decide *de frente = esperando, de perfil = en juego*, con
   las poses que la hoja ya trae. No hay que dibujar nada nuevo.
2. **La animación de derrota**, declarada bloqueante por `D-42` precisión 2, **no existe más**:
   `UX-29` la reemplazó por una pasada de reimpresión del nivel. No se dibuja.
3. **La convención del pixel** en `public/arte/README.md` está escrita y lista para pegar
   (`UX-para-hilo-principal-readme-del-pixel.md`). Falta el acto de pegarla.
4. **La discrepancia Fedora / Panamá** la cerró `UX-27 §8.1`: manda `RES-64.3`, se corrige con
   dos colores de paleta y la palabra nunca llega al sitio porque el recorte la borra. Lo que
   sigue abierto es la ficha chica que `experiencia` le pidió a `investigador`, que no frena
   nada.

## 3. Las tareas

| ID | Rol | Qué | Archivos | Verifica con | [P] |
|---|---|---|---|---|---|
| `T-226` | **hilo principal** (era `revisor` — `FIND-61`) | La compuerta de `ADR-08.1`: las cinco condiciones del motor, una por una, con su consecuencia escrita. **Antes de la primera línea de isla** | `package.json`, `package-lock.json`, `src/scripts/humo-motor.ts` (temporal). **Ya no `REV-14`**: ese archivo es de `revisor` y las cinco respuestas se le pasan para que las asiente al cerrar (`T-250`) | `npm i -E kaplay@3001.0.19`; humo con `kaplay({ global:false, canvas })`; `npm run build`; `npm run check`; `grep -rn "new Function\|eval(" node_modules/kaplay/dist/`; medir el chunk en `dist/_astro/` contra los ≤ 90 KB de `ADR-08.10` — **y rehacer la vara con `npm run build` antes de comparar** | **[P]** |
| `T-227` | `investigador` | Las cuatro fichas del paquete que `ADR-08` declara condición y no se pueden afirmar de memoria | `Docs/INVESTIGACION/INV-61-motor-kaplay.md` (`RES-70`+) | **Sin comando, y el hueco queda declarado:** una ficha no la audita ninguna máquina. Las cuatro preguntas de `ARQ-para-investigador-motor-kaplay.md`, con URL y fecha y leídas en el paquete publicado y no en la documentación, **las mira `revisor` en `T-250`**. Lo único cruzable a máquina es el número de versión y su fecha: `npm view kaplay@3001.0.19 version time`, y lo corre `T-226` | **[P]** |
| `T-228` | `arquitectura` — **CERRADA** | `CTR-15.2` recibe el desenlace medido (`§1.1`): qué deja de ser el recorte, y qué pasa con el fondo por coincidencia exacta de `CTR-15.4` | `Docs/ARQ/ARQ-atlas-de-sprites.md` | `rg -n "N = 1" Docs/ARQ/ARQ-atlas-de-sprites.md` (devuelve el desenlace elegido, :141) y `rg -n "coincidencia exacta" Docs/ARQ/` (:200, la regla declarada muerta). Los otros dos desenlaces quedan como tabla histórica, no como opción viva — eso lo mira `revisor` | **[P]** |
| `T-229` | `experiencia` | `UX-27 §6` reescrito para una hoja que no está sobre grilla: el circuito de cuantización, el umbral de fondo con tolerancia y qué se pierde en el camino. **Toma además la línea de la carpeta** — ver `§3.2` punto 5 | `Docs/UX/UX-27-la-convencion-del-pixel.md` | `rg -n "public/arte/pixel" Docs/UX/UX-27-la-convencion-del-pixel.md` **sin resultados** (hoy devuelve :227 y :258, y `FIND-56` está cerrado de un lado solo). Que los siete pasos vuelvan a ser corribles y que el paso 3 deje de suponer que hay un píxel nativo medible **no tiene comando: lo mira `revisor`** | **[P]** |
| `T-230` | `arquitectura` — **CERRADA** | **Una sola geometría**: que `ADR-08.3`, `CTR-15.3` y `CTR-16.2` digan el mismo número que `UX-27 §2` y `UX-28 §2`, y la misma carpeta. Ganaron **240 × 144 · 15 × 9 · celda 16 × 24 nativos** y **`public/sprites/`** | `ARQ-motor-de-juego.md`, `ARQ-atlas-de-sprites.md`, `ARQ-schema-niveles.md` | `rg -n "416\|26 × 12" Docs/ARQ/`: **toda línea devuelta tiene que ser una enmienda rotulada**, no una regla viva (hoy: `motor`:153-160 y `schema`:19 lo son; `atlas`:170 hay que leerla). El reparto de `UX-28 §2` en 812 × 375 lo mira `revisor` con la cuenta de `§2.1` al lado | dep. `T-228`, `T-229` |
| `T-231` | `producto` — **CERRADA** | El choque de `§2.4`: si el nivel 1 tiene una puerta o dos. **Ganó el contrato: dos** (`PRD-skayboy-y-poligirl.md`:243 y :151, y el traspaso `PRD-para-arquitectura-find-59-cerrado-la-puerta-del-nivel-1.md`). `CTR-16.5` no se toca; se corrigió `US-09` criterio 4 | `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md` | `rg -n "una puerta\|puerta doble\|por personaje" Docs/PRODUCTO/PRD-skayboy-y-poligirl.md Docs/ARQ/ARQ-schema-niveles.md`: las dos salidas se leen juntas y ya dicen lo mismo. Queda un pedido a `arquitectura` —sacar de `CTR-16.5` el bloque que lo declara abierto— y **lo que sobrevive del criterio 4 se vuelve test**: `T-253` | **[P]** |
| `T-232` | `contenido` | `CNT-17`: el pie de homenaje. **Es condición de la pantalla** (`D-42` precisión 1, `BR-26`) | `Docs/CONTENIDO/CNT-17-pie-de-homenaje.md` | **`voz.test.ts` corre solo: lo de "a mano" era un error mío** (`FIND-62`). Audita los módulos `src/lib/<juego>/copy.ts`, así que este texto queda auditado **de verdad** cuando entra al sitio en `T-239`, con `node --test src/lib/voz.test.ts`. En el documento no hay comando: las tres cosas de `BR-26` con nombres completos y el registro 3 **los mira `revisor`**, y que entre en la chapa de 24 px de `UX-27 §1.1` se ve recién en `T-240` | **[P]** |
| `T-233` | `contenido` | `CNT-18`: el resto del texto de la pantalla — las seis teclas, la línea de vertical, el rótulo estático de `ADR-08.2` y el aviso accesible de `UX-29 §5` | `Docs/CONTENIDO/CNT-18-la-pantalla-del-juego.md` | Los dos primeros sí tienen comando, y corre cuando el texto entra al sitio (`T-239`): el infinitivo lo caza `node --test src/lib/voz.test.ts`, y la lista prohibida de `BR-24`, la barredora de `UX-29 §9` — `rg -in "vida\|muerte\|moriste\|perdiste\|game over" src/lib/skayboy/ src/scripts/partida-skayboy.ts`, sin resultados. Que el rótulo estático diga qué hay ahí sin prometer nada **no tiene comando: lo mira `revisor`** | **[P]** |
| `T-234` | `contenido` | `CNT-19`: el nombre del juego y la bajada del casete del portal | `Docs/CONTENIDO/CNT-19-el-nombre.md` | Las ≤ 8 palabras las cuenta `node --test src/lib/voz.test.ts` cuando el nombre entra al sitio (`T-239`). Que el juego de origen no aparezca: `rg -in "<el título que nombra RES-60>" src/ public/ Docs/UX/ Docs/CONTENIDO/`, sin resultados. **La prueba de las dos líneas —tapar la que canta— no tiene comando: la mira `revisor`**, y el nombre **lo confirma el usuario** | **[P]**, dep. usuario |
| `T-235` | `contenido` | `CNT-20`: qué tema suena durante la partida (`temaFijo`), con `experiencia` | `Docs/CONTENIDO/CNT-20-el-tema-que-suena.md` | Que el `slug` exista y salga de *Gulp!* sí tiene comando: `rg -n "\"slug\": \"<el elegido>\"" -A 3 src/data/cancionero.json` devuelve la entrada con `"disco": "gulp"`. Que el disco no se nombre en pantalla lo caza `rg -in "gulp" src/lib/skayboy/` (sin resultados) en `T-244`. **Que no sea un título que explique la mecánica no tiene comando: lo mira `revisor`** | **[P]** |
| `T-236` | `arquitectura` — **CERRADA** | `CTR-17` y `CTR-16.4` se alinean con `UX-29`: el fracaso no suena, y el vocabulario de muerte sale del contrato | `ARQ-efectos-de-sonido.md`, `ARQ-schema-niveles.md` | **Son tres efectos, no cuatro**: `FIND-57` sacó `muerte` y `D-43` consecuencia 1 sacó `cambio` — el plan de la mañana no podía saber lo segundo. `rg -n "muerte\|cambio\|letal\|mata" Docs/ARQ/ARQ-efectos-de-sonido.md Docs/ARQ/ARQ-schema-niveles.md`: toda línea devuelta es una enmienda rotulada. La barredora de `UX-29 §9` sobre el código corre en `T-245` | **[P]** |
| `T-237` | hilo principal | Pegar la convención del pixel en el README del collage, y decir cuál rige dónde | `public/arte/README.md` | `rg -n "public/sprites\|public/arte/pixel" public/arte/README.md public/arte/ensayo/README.md`: la carpeta del pixel aparece como **`public/sprites/`** (`T-230`) y los dos README no se contradicen. Que cada idioma quede dicho con todas las letras **lo mira `revisor`** | **[P]** |
| `T-238` | usuario + hilo principal | Los 16 `--px-*`: nacen en el lienzo, se copian a `tokens.css`, se testean | lienzo de marca, `src/styles/tokens.css`, `src/lib/contraste.test.ts` | `node --test src/lib/contraste.test.ts`: los 16 contra `--px-clave`, umbral 3:1 (`UX-27 §5.3`). Ningún hex nuevo fuera de `tokens.css` | dep. lienzo |
| `T-239` | hilo principal | La ruta existe y el sitio construye: página, censo con `tema-fijo`, rótulo estático adentro del recorte | `src/pages/juegos/<nombre>.astro`, `src/lib/sitio/rutas-sonoras.ts`, **`src/lib/skayboy/copy.ts`** (acá aterrizan `CNT-17`..`CNT-19`) | `npm run build` (la página sin declarar rompe el build, y esa es la prueba); `node --test src/lib/sitio/rutas-sonoras.test.ts`; **`node --test src/lib/voz.test.ts`** — es el punto del ciclo donde el texto de `T-232`..`T-234` pasa las siete reglas a máquina en vez de a ojo | dep. `T-233`, `T-234` |
| `T-240` | hilo principal | El marco impreso: chapa, bisel, área vacía, las seis teclas y el pie de homenaje | `src/styles/skayboy.css`, la página | `npm run build` y **`node --test src/lib/estilos.test.ts`** (ninguna pastilla de 999px, ninguna barra lateral, ningún hex fuera de `tokens.css`). **Lo que no tiene comando y queda declarado:** las medidas a **812 × 375** —720 de ancho, 324 de alto (`UX-28 §2`)—, las seis teclas ≥ `--toque-min` y el vertical a ×1 **se miran en el navegador**. Es ojo, y es de quien revisa | dep. `T-232`, `T-239` |
| `T-241` | hilo principal | Los auditores extendidos de `ADR-08.8`: lista blanca de paquetes de cliente, y la hoja nueva a los dos escáneres de estética | `src/lib/islas.test.ts`, `estilos.test.ts`, `movimiento.test.ts`, `voz.test.ts` | **`npm test`** en verde al terminar — y antes, **rojo tres veces a propósito**: con una isla que importa un paquete fuera de la lista, con un 999px en `skayboy.css` y con un `copy.ts` fuera de `MODULOS`, `npm test` tiene que **fallar**. Una guarda que nunca se vio en rojo no es una guarda | dep. `T-226`, `T-240` |
| `T-242` | hilo principal | El schema de `CTR-16` y el dato con el nivel 1 en `borrador` | `src/data/skayboy.json`, `src/data/_schema/skayboy.schema.json`, `src/lib/esquemas.test.ts`, `src/lib/skayboy/niveles.ts` | `npm test` con `skayboy` en el arreglo de `esquemas.test.ts`; y tres casos que **fallan**: `sostenido: true` sin `alternativaSolo`, `estado: 'listo'` sin las dos verificaciones, y una grilla con un renglón corto | dep. `T-230`, `T-231`, `T-236` |
| `T-243` | hilo principal | `scripts/auditar-paleta-pixel.mjs`: ningún PNG del área trae un color fuera de los **16** ni un alfa intermedio. **Son 16 para toda el área, no 32 por atlas** (`FIND-60`, cerrado en `CTR-15.4`) | `scripts/auditar-paleta-pixel.mjs` | `node scripts/auditar-paleta-pixel.mjs`: sobre `public/sprites/` vacía sale **0** sin romper; contra un PNG de prueba con un color 17 sale **≠ 0**; contra uno con un píxel a alfa 128, **≠ 0**. Y lo que `FIND-60` agrega: como el JSON del atlas declara nombres `--px-*` y no hex, el script **los resuelve contra `src/styles/tokens.css`** y sale ≠ 0 si un nombre no existe ahí | dep. `T-238` |
| `T-244` | hilo principal | El cuarto modo de la cinta: `tema-fijo` | `src/lib/sitio/cinta.ts`, `rutas-sonoras.ts`, `rocola.ts` | `node --test src/lib/sitio/rocola.test.ts` y `cinta.test.ts` en verde (los casos 691, 717 y 932 intactos); una prueba que **falla** si `tema-fijo` autoarranca sin gesto o si sortea | dep. `T-235`, `T-239` |
| `T-245` | hilo principal | Los **tres** efectos sintetizados de `CTR-17` —salto, tesoro, puerta—: eran cuatro en el plan de la mañana y `D-43` sacó `cambio` | `src/lib/skayboy/sonido.ts` + su test | `node --test src/lib/skayboy/sonido.test.ts`; cero archivos nuevos en `public/`; ningún `AudioContext` fuera de `contexto.ts`; el fracaso no dispara nada | dep. `T-236`, `T-244` |
| `T-246` | **sin dueño — ver `§5`** | Los dos atlas a ×1, en grilla, en paleta y con alfa binario | `public/sprites/` (ya ganó en `T-230`) | `node scripts/auditar-paleta-pixel.mjs` en verde; los dos JSON con las mismas animaciones y la misma cantidad de cuadros; y a ojo, tapando el color, las dos siluetas se leen igual a 32 × 48 CSS (`UX-27 §10`, `BR-23` punto 3) | dep. `T-228`..`T-230`, `T-238`, y la hoja del usuario |
| `T-247` | hilo principal | La isla: motor apagado de sus cuatro cosas, atlas cargado, los dos personajes moviéndose, y el terreno ajeno que devuelve a la entrada | `src/scripts/partida-skayboy.ts`, `src/lib/skayboy/motor.test.ts` | `node --test src/lib/skayboy/motor.test.ts` (falla si aparece texto, fuente, audio del motor o un `kaplay(` sin `global:false`); `npm run check`. **Lo del teléfono —cuatro dedos a la vez y el inactivo quieto y a salvo— no lo corre ningún rol ni ningún agente: es del usuario** (`§5` punto 3), y se hace junto con `T-249` en la misma sentada | dep. `T-226`, `T-242`, `T-246` |
| `T-248` | hilo principal | La puerta doble y el fin del nivel 1 | `src/scripts/partida-skayboy.ts`, `src/lib/skayboy/niveles.ts`, **`src/lib/skayboy/niveles.test.ts`** | **`node --test src/lib/skayboy/niveles.test.ts`**, con tres casos sobre la condición de victoria: **falla** si se cumple con uno solo en la puerta, **pasa** con los dos, y el que llegó primero no acumula costo mientras espera. Que pasar al siguiente no cueste más de un toque es dedo, y es de `T-249` | dep. `T-247` |
| `T-249` | **usuario** (era `revisor` — `FIND-61`) | La planilla de `BR-25` del nivel 1, **jugada**. `D-43` le sacó la mitad del trabajo: sin botón de cambio, probar que el nivel se resuelve solo es físico y barato — **una persona, un dedo por vez, una columna y después la otra.** Si así no se pasa, el nivel está mal | **No escribe ningún archivo:** el resultado se le pasa a `revisor`, que lo asienta en `REV-14 §2` al cerrar (`T-250`) | Un teléfono en horizontal y el nivel 1 abierto, las seis filas de `BR-25`: **(a)** se pasa de a dos, con las dos columnas a la vez; **(b)** se pasa solo, una columna y después la otra, **sin ningún botón que aprender** (`D-43`); **(c)** ninguna acción pidió entrada simultánea; **(d)** el que quedó quieto siguió a salvo; **(e)** el reintento fue gratis; **(f)** la paridad quedó anotada. **Ningún rol ni agente puede correr esto** (`§5` punto 3). Si una fila falla, el nivel queda en `borrador` y las dos verificaciones en `false` | dep. `T-248`, y del usuario |
| `T-250` | `revisor` | Cerrar `REV-14`: el ciclo contra los criterios, y la tabla de `§1` vuelta a medir | `Docs/REVISIONES/REV-14-ciclo-15.md` | `npm test`, `npm run check`, `npm run build`, el validador del instanciador, y la prueba de la captura de `UX-29 §9` punto 5. **Suma acá lo que no tuvo comando propio** (`§3.3`): la ficha de `T-227`, los cuatro documentos de `contenido` y la geometría de `T-230` en 812 × 375 | dep. todo |
| `T-251` | hilo principal | `FIND-58`, la mitad que un schema no puede: el caso que **cuenta** los molinetes — exactamente uno que devuelva solo a `skayboy`, uno solo a `poligirl`, uno a los dos (`CTR-16.4`). JSON Schema no sabe contar propiedades por su contenido, así que si nadie la escribe a mano, esa regla no la verifica nada | `src/lib/esquemas.test.ts` | `npm test` en verde; y **rojo** contra un nivel de prueba con dos molinetes que devuelven a lo mismo. **Mismo archivo que `T-242`: no es `[P]` con ella y va inmediatamente después** | dep. `T-242` |
| `T-252` | `revisor` | El barrido de vocabulario retirado: que ningún número ni palabra que una enmienda mató siga vivo como regla en otro archivo. Es la advertencia con la que cierra `REV-14` —*un choque declarado no es un choque resuelto*— vuelta tarea | **No escribe**: lee `Docs/ARQ/`, `Docs/UX/`, `Docs/PRODUCTO/`, `src/`, `public/arte/README.md`. Si algo sobrevive es un `FIND-` nuevo, y lo pega el hilo principal | `rg -n 'inmuneA\|"letal"\|mata: \[\|32 tintas\|416 × 192\|26 × 12\|public/arte/pixel' Docs/ARQ/ Docs/UX/ Docs/PRODUCTO/ src/ public/arte/README.md` — **probado el 2026-09-16: devuelve 16 líneas**, catorce de ellas enmiendas rotuladas y dos que son la regla viva que `T-229` tiene que sacar (`UX-27`:227 y :258). El criterio es ese: **toda línea devuelta tiene que ser una enmienda o una cita histórica**, ninguna una regla viva. `DECISIONES.md` y este plan quedan fuera del barrido a propósito: ahí lo viejo se guarda. Cubre `FIND-55`, `FIND-56`, `FIND-57`, `FIND-58` y `FIND-60` de una pasada | dep. `T-229`, `T-230`, `T-236`, `T-237` |
| `T-253` | hilo principal | Lo que queda del criterio 4 de `US-09` cuando `FIND-59` se cierra a favor del contrato: **el primer nivel del piso no usa en su grilla ningún caracter de `tipo` `molinete`, `mecanismo` ni `caja`** — es decir, no se puede perder. Lo pidió `producto` en su traspaso y **es condicional**: si `arquitectura` prefiere que no exista, la fila cae en la planilla de `BR-25` (`T-249`) y esta tarea se cancela | `src/lib/esquemas.test.ts` | `npm test` en verde; y **rojo** contra un nivel 1 de prueba con un molinete en la grilla. Cómo se identifica "el primero" lo dice `arquitectura` (`id` o `escalon`). **Mismo archivo que `T-242` y `T-251`: van los tres en fila, ninguno `[P]` con otro** | dep. `T-242`, y de que `arquitectura` la acepte |

### 3.1 `T-226` ya no incluye medir la hoja, porque la medición está hecha

El plan iba a abrir con una tarea de medición y **se corrió acá, antes de cortar nada**
(`§1.1`). El ciclo 14 cortó una tarea que ya estaba hecha (`T-219`) y eso fue un defecto del
plan; este ciclo evita el simétrico: no cortar una tarea para averiguar algo que un comando
contesta en dos minutos. Lo que queda por hacer no es medir, es **escribir la consecuencia**,
y eso tiene dueño: `T-228` y `T-229`.

### 3.2 Lo que `REV-14` le cambió a esta tabla, punto por punto

1. **`T-226` cambia de dueño** (`FIND-61`). Se la había dado a `revisor` y la tarea instala un
   paquete, escribe un archivo de humo y toca `package.json`: eso es escribir. `revisor` es
   read-only por diseño —verifica, no arregla— y el que escribe código en este proyecto es el
   **hilo principal** (`.claude/rules/codigo-juegos.md`: *no hay rol de implementación*). Le
   saqué además `REV-14` de la lista de archivos: la compuerta devuelve cinco respuestas y el
   que las asienta es `revisor` al cerrar.
2. **`T-249` no es de ningún agente** (`FIND-61`). Pide jugar una partida de a dos en un
   teléfono. No hay rol que pueda hacerlo, ni con permisos: **es del usuario**, y por eso
   pasa a `§5` con las otras dos.
3. **`T-249` además se abarata** (`D-43` consecuencia 2). Sin botón de cambio, probar que un
   nivel se resuelve solo dejó de necesitar un modo aparte: **una persona, un dedo por vez,
   una columna y después la otra.** Si así no se pasa, el nivel está mal. Eso es la fila (b)
   de `BR-25` entera, y ya no hay nada que aprender antes de probarla.
4. **Tres tareas están cerradas antes de empezar el ciclo**: `T-228`, `T-230` y `T-236`, que
   `arquitectura` cerró en la misma tarde. Quedan en la tabla marcadas —no se borra una tarea
   hecha, se marca— y su columna de verificación pasó a ser el comando que **prueba que
   siguen cerradas**, que es lo único que sirve de acá en adelante.
5. **`FIND-56` está cerrado de un lado solo.** `arquitectura` se paró en `public/sprites/`;
   `UX-27` todavía dice `public/arte/pixel/` en las líneas 227 y 258. La corrección es del
   dueño del archivo y entra en `T-229`: es el mismo archivo, el mismo rol y una línea, y
   abrir una tarea aparte para eso sería una colisión, no un corte.
6. **`FIND-58` y `FIND-60` no tenían tarea y ahora tienen dos.** `arquitectura` cerró la mitad
   de documento —`CTR-16.3` perdió `inmuneA` entero, `CTR-15.4` bajó a 16 tintas y el JSON del
   atlas declara nombres de token—, pero cada uno dejó una mitad que ningún documento cierra:
   la regla que **cuenta** molinetes no entra en un `.schema.json` (`T-251`) y el auditor de
   paleta tiene que resolver nombres `--px-*` contra `tokens.css` (dentro de `T-243`). El
   barrido que prueba que lo retirado no revive es `T-252`.
7. **Cuentas viejas corregidas:** los efectos de `CTR-17` son **tres** y no cuatro (`T-236`,
   `T-245`), y la carpeta de `T-246` ya no es una incógnita: `public/sprites/`.
8. **`T-231` se cerró mientras escribía esto**, y era el último choque de `§2` que seguía
   abierto: `producto` cedió y **el nivel 1 tiene las dos puertas**; `CTR-16.5` queda como
   estaba. Deja dos colas: una línea que `arquitectura` tiene que sacar de `CTR-16.5` —el
   bloque que declara el hallazgo abierto— y **lo que sobrevive del criterio 4**, que es una
   propiedad del nivel y sí la puede mirar una máquina: `T-253`. Con eso, **los hallazgos de
   severidad alta de `REV-14` quedan cerrados en documento salvo las dos líneas de `UX-27`**,
   que son de `T-229`. Lo que falta no es cerrarlos: es probar que siguen cerrados, y eso es
   `T-252`.
9. **Un detalle de la propia `REV-14`, y no es mío arreglarlo:** el encabezado dice *"cinco de
   severidad ALTA"* y la tabla marca **cuatro** (`FIND-55`, `FIND-56`, `FIND-57`, `FIND-59`).
   La advertencia del cierre repite el cinco. No cambia ninguna tarea de este plan —los cuatro
   marcados tienen dueño y los siete restantes también—, pero es un número que no coincide con
   su propia tabla y alguien lo va a citar. Es de `revisor`, y el archivo lo pega el hilo
   principal.

### 3.3 Lo que igual no tiene comando, y con qué se verifica

`FIND-62` tenía razón en las dieciséis. Cuatro eran error mío y se cerraron con el comando que
ya existía: **`T-232`** decía *"pasa a mano las siete reglas de `voz.test.ts`"* y ese test
**corre solo** —audita los módulos `copy.ts`, así que el texto queda auditado cuando entra al
sitio en `T-239`—; **`T-241`** y **`T-243`** eran tareas de test sin `npm test` ni `node
scripts/…`; **`T-248`** era verificable con un caso de victoria en `niveles.test.ts`. Otras
tres —`T-233`, `T-234`, `T-235`— tienen comando **diferido**: el texto se audita cuando
aterriza en el código, y la tabla dice en qué tarea.

Para las que quedan, la regla de este plan es la de `CLAUDE.md` §8 leída de frente: **un hueco
declarado es mejor que un hueco.** Lo que no tiene comando lo dice, dice quién lo mira y en
qué tarea se mira:

| Qué no se puede correr | Quién lo mira | Dónde queda asentado |
|---|---|---|
| La ficha de `T-227`: cuatro respuestas con URL y fecha | `revisor` | `REV-14` (`T-250`) |
| Los documentos de `T-228`..`T-231`, `T-236`, `T-237`: que la regla enmendada no deje viva la vieja | `revisor`, con el `rg` de cada fila y con `T-252` | `REV-14` (`T-250`) |
| El registro 3 del pie, la prueba de las dos líneas, que el tema no explique la mecánica | `revisor`, con `voz-ricotera.md` §5 al lado | `REV-14` (`T-250`) |
| Las medidas de `T-240` a 812 × 375 y el vertical a ×1 | ojo, en el navegador — lo mira quien revisa | `REV-14` (`T-250`) |
| Las seis filas de `BR-25` jugadas (`T-249`) y los cuatro dedos de `T-247` | **el usuario, con un teléfono** | `REV-14 §2`, lo asienta `revisor` |

**Lo que no está en esa tabla tiene comando** — propio, o diferido a la tarea donde el texto
aterriza en el código. Un criterio sin comando, sin dueño y sin tarea donde se mire es el hueco
que `FIND-62` fue a buscar; con las dos cosas escritas deja de serlo, aunque siga sin correr.

## 4. Pasada de conflictos

- **`T-228` y `T-229` son paralelas pero comparten insumo.** Cada una escribe en su carpeta y
  ninguna lee la salida de la otra, pero las dos interpretan la misma medición. Si salen
  distintas, `T-230` es el lugar donde se cruzan y se cierra; por eso `T-230` depende de las
  dos y no de una.
- **`T-239`, `T-240`, `T-247` y `T-248` tocan la misma página.** Van en fila, en ese orden: la
  ruta primero porque es la que le abre la puerta al censo; el marco después, porque el área
  necesita saber cuánto mide antes de que el motor la pinte.
- **`T-239` y `T-244` tocan las dos `rutas-sonoras.ts`.** `T-239` primero: la fila del censo
  entra con la página, y el modo `tema-fijo` se construye contra una fila que ya existe.
- **`T-241` no puede ir antes que `T-240`:** tres de sus cuatro guardas necesitan que existan
  `skayboy.css` y `copy.ts` para tener algo que mirar. La fila de `esquemas.test.ts` entra con
  `T-242`, el día que existan el dato y el schema — es la regla escrita en el comentario de la
  línea 44 y no se adelanta.
- **`T-246` es la única tarea del ciclo que no puede empezar aunque todo lo demás esté.**
  Depende de la hoja del usuario y de un dueño que no existe (`§5`).
- **Las seis tareas de documento de la ráfaga 2 (`T-232`..`T-237`) son paralelas de verdad**:
  seis archivos, cuatro roles, ninguna lee la salida de otra.
- **`REV-14` lo escribe una sola tarea, y es `T-250`.** Era el peor conflicto del plan viejo:
  `T-226`, `T-249` y `T-250` escribían el mismo archivo, y dos de las tres ni siquiera eran de
  `revisor`. Con `FIND-61` cerrado, `T-226` devuelve sus cinco respuestas y `T-249` su planilla
  jugada, y **las dos las asienta `revisor` al cerrar**. Un archivo, un dueño, una tarea.
- **`T-251` toca `src/lib/esquemas.test.ts`, que es de `T-242`.** No son `[P]`: va inmediatamente
  después, en la misma ráfaga, porque la mitad de `FIND-58` que le toca no tiene sentido sin el
  dato y el schema que `T-242` crea.
- **`T-252` no escribe nada y por eso es `[P]` con todo lo que no sea sus dependencias.** Es un
  barrido de lectura: corre cuando los seis documentos que toca ya están cerrados, y si algo
  sobrevive, el resultado es un hallazgo, no una edición.

**Corte de ráfagas sugerido, corregido después de `REV-14`.** La primera ya no son seis tareas
sino tres: `T-226`, `T-227` y `T-229` — `T-228`, `T-230`, `T-231` y `T-236` cerraron el mismo
día. La segunda: `T-232`..`T-238`, las palabras y las tintas, que no dependen de nada de la
primera. La tercera: `T-239`..`T-245` más `T-251` y `T-253`, el esqueleto que se puede
construir **sin un solo sprite**. La cuarta: `T-246`, `T-247` y `T-248`, el arte y la isla. Y
al final, con el teléfono en la mano: `T-249`, y después `T-252` y `T-250`.

## 5. Las tres cosas que no puede hacer ningún rol

**No son tareas: son tuyas.** Las dos primeras frenan `T-246`; la tercera cierra el ciclo.

1. **La hoja reexportada.** Lo medido en `§1.1` dice que la hoja de hoy no se recorta: se
   redibuja. Lo barato es que vuelva a salir de donde salió, y ahora se puede pedir con
   números: **sin rótulos ni flechas** (hoy puentean los sprites y el recorte devuelve un
   blob), **con fondo transparente de verdad** (hoy el alfa está lleno y el fondo son 52
   tintas), **sobre una grilla de píxel real** y **con la paleta acotada**. Si no llega, la
   salida es cuantizar a mano, que es dibujo y cuesta lo que cuesta dibujar.
2. **Quién dibuja los niveles y los sprites.** `IDEA-14` punto 1 lo marcó como bloqueo, y
   `experiencia` cerró la mitad que era suya (la convención) y dejó la otra mitad con nombre:
   **de los siete roles, ninguno produce arte.** O se justifica por escrito en
   `Docs/EQUIPO.md`, como se hizo con el séptimo rol, o lo produce el usuario — que es lo que
   ya pasó con la hoja y con los recortes de audio (`D-23`).
3. **La partida en el teléfono: `T-249`, y los cuatro dedos de `T-247`.** El plan de la mañana
   se la había dado a `revisor` y estaba mal por dos motivos (`FIND-61`): `revisor` no escribe,
   y **ningún agente tiene un pulgar**. Las seis filas de `BR-25` del nivel 1 se contestan
   jugando, y el que juega sos vos. `D-43` lo abarató: no hay modo que elegir ni botón que
   aprender, así que la prueba entera es **una persona, un dedo por vez, una columna y después
   la otra, y después las dos con alguien al lado**. Si con un dedo por vez el nivel no se
   pasa, el nivel está mal y queda en `borrador` — que es exactamente lo que `BR-25` quiere que
   pase. El resultado se lo pasás a `revisor` y lo asienta en `REV-14 §2`.

> **La planilla ya habla el idioma de `D-43`, y no hubo que pedirlo.** `BR-25` fila **(b)**
> decía *"alternando con el botón de cambio"*; `producto` la enmendó la misma tarde y ahora
> dice *"tocando una columna de mando y después la otra"* (`PRD-skayboy-y-poligirl.md`:513).
> Iba a levantarlo como deuda y llegó cerrado: lo dejo anotado porque es la clase de cosa que
> se arregla dos veces si nadie mira quién ya la arregló.

Y una cuarta que no frena este ciclo pero sí el próximo: **la `YT_API_KEY`**. `BR-28` fijó el
punto de control y me toca vigilarlo: si al cerrar el ciclo 15 `US-02` sigue en **0 de 8
ítems Fáciles**, el ciclo 16 no abre un noveno juego hasta que la clave llegue o hasta que se
retire la cuota con una decisión escrita. No es veto a nada de acá: es orden de construcción.

## 6. Qué NO entra al ciclo 15

Un ciclo no es "todo Skayboy y Poligirl hasta que esté listo": eso es un deseo. Lo que entra
es **el juego jugable de punta a punta con un nivel**, y lo que queda afuera está acá con su
motivo.

- **Cinco de los seis niveles del piso.** `US-09` pide **seis niveles listos** (`BR-25`) y
  este ciclo cierra con **uno**. El piso es del juego, no del ciclo: **`US-09` no se declara
  cumplida al cerrar el ciclo 15**, y decirlo ahora es más barato que descubrirlo en la
  revisión. El primero es el que prueba que el motor, el atlas, el schema, la pantalla y la
  verificación de `BR-25` funcionan juntos; los otros cinco son repetición de un circuito ya
  probado, y son del ciclo 16.
- **La tarjeta compartible** (`BR-27`, criterio 8 de `US-09`). Necesita que exista un
  recorrido que contar y una decisión de `arquitectura` con `experiencia` sobre si reusa
  `src/lib/tarjeta/plan.ts`. Con un solo nivel no hay qué compartir.
- **El guardado del avance** (criterio 9). Con un nivel no hay avance que guardar.
- **Los mecanismos de los escalones Media y Difícil** —palanca, botón de presión, caja
  empujable— y con ellos el ciclo de caminata y la pose de empujar que la hoja no trae. Cada
  mecanismo cuesta doble acá: arte **y** segunda solución para el que juega solo (`D-40`).
- **El coleccionable.** `producto` ya lo dejó fuera del piso y prohibió que sea condición.
- **`IDEA-04` y el video del bondi** (`public/arte/bondiAfinisterreAnimado.mp4`, 3,2 MB, que
  apareció en la misma ráfaga). Es de otro juego. Hereda el motor, la resolución lógica, la
  lista blanca de paquetes y los auditores extendidos sin volver a pagarlos, y por eso
  conviene que este ciclo los deje bien.
- **El escalonamiento de `US-02`** (los 8 Fáciles) y **la deuda que abrió `D-39`** —`dos-ejes`
  pidió la misma excepción con el mismo argumento y se la negaron—. Las dos siguen vivas y
  ninguna es de este frente.

## 7. Los tres riesgos del ciclo

1. **El arte, y ya no es una sospecha: está medido.** La hoja no está sobre grilla, tiene
   108.705 colores y el fondo no es un color. Entre eso y que nadie del equipo dibuja, **la
   pieza que le da el nombre al ciclo es la única que no tiene cómo producirse sola.** Por eso
   las tres cuartas partes de las tareas están cortadas para poder construirse **sin un solo
   sprite**: si el arte no llega, el ciclo entrega igual la ruta, el marco, el schema, el
   sonido, los auditores y la compuerta del motor, y el juego queda esperando el dibujo en vez
   de esperar todo.
2. **Las dos geometrías.** Si `T-230` no cierra antes de `T-242` y `T-246`, se dibujan sprites
   para una sala y niveles para otra, y el error aparece recién cuando las dos piezas se
   juntan en `T-247`. Es el error más caro posible del ciclo y el más barato de evitar: es una
   tarea de documento.
3. **El primer paquete de terceros en el teléfono de la gente.** `ADR-08` lo dice sin
   adornos: cambia el árbol de dependencias del cliente, la premisa de `islas.test.ts` y la
   superficie de una CSP futura, las tres a la vez. Por eso `T-226` va sola y primera, y por
   eso `T-241` existe: un guardián apoyado en una premisa que dejó de ser cierta **sigue
   verde mientras la puerta queda abierta**, que es exactamente cómo se cuelan los defectos
   que este repo ya cazó tres veces.

## 8. Lo que este plan no toca

**`ESTADO.md`.** Los tres roles lo dejaron escrito y tienen razón: es el archivo que más se
pisa y esta ráfaga corrió con cuatro escribiendo en paralelo. Lo cierra el hilo principal al
terminar la ráfaga, con el plan vigente y el próximo paso.

**El próximo paso, corregido al cierre de la tarde:** `T-226` —ahora del hilo principal—,
`T-227` y `T-229`, las tres en paralelo. `T-228`, `T-230`, `T-231` y `T-236` ya están cerradas
y no hay que arrancarlas: lo que queda de ellas es el barrido de `T-252` y los dos casos de
prueba que dejaron colgando, `T-251` y `T-253`.
