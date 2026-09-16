# ARQ — El motor 2D, y los seis candados que un `<canvas>` atraviesa sin que nadie se entere

> Rol dueño: `arquitectura`. **Produce: `ADR-08`** (`ADR-08.1` … `ADR-08.10`).
>
> **Consume:** `Docs/BRIEF.md` (restricciones técnicas, criterio no negociable 2), `D-02`,
> `D-12`, `D-14`, `D-15`, `D-18`, `D-22`, `D-29`, `D-32`, `D-37` (puntos 4, 6 y 7), `D-38`,
> `D-39`, `D-40`, `D-41`, `D-42`, **`D-43`**, **`UX-27 §2` y `UX-28 §2` (la geometría real de
> la pantalla, que es la que manda desde `FIND-55`)**, **`REV-14`**, `BR-15`
> (consecuencias 1 y 3), `BR-16`, `IDEA-14`
> (`PRD-backlog-ideas.md`), `RES-60`, `RES-62`, `RES-63`, `RES-65` (`INV-60`), `ADR-04`,
> `ADR-07` y `CTR-14` (`ARQ-rocola.md`), `CTR-01.5`, `CTR-15`, `CTR-16`, `CTR-17`,
> `Docs/SUGERENCIAS/HILO-para-arquitectura-el-motor-y-el-sonido-del-juego.md`,
> `.claude/rules/codigo-juegos.md`, `.claude/rules/diseno-marca.md`,
> `.claude/rules/voz-ricotera.md`.
>
> **Medido sobre el repo el 2026-09-16** (no son fichas `RES-`, son lecturas de archivo):
> `package.json` declara una sola dependencia de producción (`astro: ^5.14.1`) y cuatro de
> desarrollo; `astro.config.mjs` fija `output: 'static'` sin adapter; `tsconfig.json`
> extiende `astro/tsconfigs/strict` y suma `erasableSyntaxOnly` y `verbatimModuleSyntax`;
> `astro/tsconfigs/base.json` trae `skipLibCheck: true`; una isla se carga con
> `<script>import '../../scripts/x.ts';</script>` (`src/pages/juegos/dos-ejes.astro:83-85`);
> `src/scripts/` tiene 15 archivos y ninguno importa un paquete de npm.
>
> Última actualización: 2026-09-16 (ciclo 15, primera versión, **enmendada el mismo día por
> `REV-14`**: `FIND-55` cambió la resolución lógica en `ADR-08.3` y, con ella, la cuenta de
> RAM de `ADR-08.10`. Se enmienda en el lugar y con la marca puesta, no se versiona: nada se
> construyó todavía sobre los números viejos, y un `-v2` a las cuatro horas del `-v1` es un
> archivo más para desincronizar).
>
> **Regla de escritura que nace de `FIND-55` y vale para todo `Docs/ARQ/`: toda medida de
> píxel dice si es _nativa_ o _CSS_, en cada mención.** El choque que el revisor encontró no
> fue un número mal puesto: fue que dos documentos escribieron "32 × 48" queriendo decir
> cosas distintas. Una medida sin unidad es la que se copia mal.

---

## ADR-08 — El motor es **Kaplay 3001.0.19**, pineado exacto, y entra apagado de casi todo

- **Fecha:** 2026-09-16
- **Estado:** **aceptada, con una compuerta de verificación abierta** (`ADR-08.1`). La
  elección está tomada y no se rediscute; lo que queda abierto es si el paquete cumple las
  cinco condiciones que esta decisión le pone, y eso lo contesta un comando, no una opinión.
  Si una condición falla, el repuesto ya está nombrado y el cambio está acotado.
- **Para quién es:** para el hilo principal, que construye la isla; para `revisor`, que
  corre la compuerta; para `experiencia`, que necesita saber qué resolución lógica tiene la
  pantalla (`ADR-08.3`); para `orquestador`, que corta las tareas.
- **Qué NO es:** no es una autorización para empezar. `BR-16` sigue mandando: sin `US-09`
  con criterio y piso, esto es un contrato esperando a que alguien lo use.

### La decisión, en una línea

> **Kaplay `3001.0.19`**, MIT, cero dependencias, ~65 KB gzip (`RES-62.4`, `RES-62.5`),
> pineado sin `^`, importado dentro de una sola isla, **con su audio, su fuente, su `debug`
> y sus globales apagados**.

### Por qué ese y no los otros dos que quedaban en pie

`RES-62` dejó tres finalistas y un orden. Lo que decide entre ellos no es el peso —los tres
entran— sino **cuánto motor hay que escribir a mano encima**, que es exactamente lo que
`BR-15` dice que no se hace.

| | Motor | Licencia | Peso | Por qué sí / por qué no |
|---|---|---|---|---|
| ✅ | **Kaplay 3001.0.19** | MIT (`RES-62.4`) | ~65 KB gzip | Cero dependencias: el árbol de npm del cliente queda con **un** nodo y se audita leyendo una línea. El modelo por componentes (`area`, `body`, `solid`) mapea casi literal a "dos personajes + plataformas + zonas que devuelven a la entrada + puerta cooperativa" (el vocabulario es el de `UX-29`, y acá no es un eufemismo: es lo que el `area` del motor hace), y trae carga de nivel desde una grilla de caracteres — que es justo la forma que `CTR-16` le da al JSON. Input táctil nativo (`RES-62.5`) |
| ↩ | **LittleJS** | MIT (`RES-62.7`) | ~46 KB gzip | **Es el repuesto declarado.** 19 KB más liviano y con ejemplo de plataformas armado (`RES-63.6`), pero la API es más manual y global: hay que escribir a mano lo que Kaplay trae. El ahorro de 19 KB no paga el motor que habría que escribir |
| ✕ | **Phaser 3.90.0** | MIT (`RES-62.1`) | ~347 KB gzip | Tres veces todo el JavaScript que el sitio le manda hoy al teléfono. `D-09` sacó la velocidad de carga de los no negociables, así que esto no es un veto de performance: es que **no hay nada que comprar** con esos 280 KB extra. Su ventaja es la comunidad, y la comunidad no aparece en el teléfono de nadie |

Y los que ya habían quedado afuera en `RES-62`, para no volver a discutirlos: PlayCanvas por
peso (~600 KB, motor 3D), melonJS por peso y porque cinco fuentes dan cinco versiones
distintas, Excalibur por física de cuerpo rígido que este juego no necesita, y Matter.js /
Planck.js **por no ser motores** (`RES-62.16`).

**La alternativa que no estaba en la lista y hay que descartar por escrito: escribirlo a
mano.** Un plataformas de tiles con AABB son unas 400 líneas y este repo las sabe escribir.
Se descarta porque `BR-15` es una instrucción del usuario, no una preferencia técnica, y
porque el día que haya que agregar plataformas móviles, cajas empujables y portales
(`RES-61.5`, `RES-61.6`, `RES-61.14`) esas 400 líneas son 2.000 y nadie las mantiene. El
ahorro de un motor propio es real el primer día y negativo el segundo.

### Por qué **3001.0.19** y no el `next`

`RES-62.5` lo cierra: el `latest` del registro es `3001.0.19` y el `next` es
`4000.0.0-alpha.27.1`. Un alfa no entra a un sitio publicado. Y va **pineado exacto, sin
`^`**, por la misma razón por la que `ajv` está en `"8.20.0"` en `devDependencies` y no en
`^8.20.0`: el motor es la primera pieza de terceros que corre en el teléfono de la gente, y
un `npm install` de dentro de tres meses no puede cambiarla sin que alguien lo decida.

---

## ADR-08.1 — La compuerta: cinco condiciones, cinco comandos, y qué pasa si una falla

Nada de lo que sigue se puede afirmar desde acá: `arquitectura` no corre comandos (`D-12`) y
no tiene `WebSearch` (`CLAUDE.md`). **Entonces no se afirma.** Se deja la condición, el
comando que la contesta y la consecuencia de que dé que no. Esto se corre **antes de
escribir la primera línea de la isla**, en una tarea propia, y lo corre `revisor` o el hilo
principal.

| # | Condición | Comando que la contesta | Si falla |
|---|---|---|---|
| 1 | **Entra en una isla de Astro con salida estática** y el sitio sigue construyendo | `npm i -E kaplay@3001.0.19` · crear `src/scripts/humo-motor.ts` con un `kaplay({ global: false, canvas })` y un rectángulo · `npm run build` | Se prueba LittleJS con el mismo humo. Si tampoco, el problema es del empaquetador y no del motor: se revisa `astro.config.mjs` antes de cambiar de paquete |
| 2 | **No usa `eval()` ni `new Function()`** — la CSP estricta de un estático en Vercel no los admite | `grep -rn "new Function\|eval(" node_modules/kaplay/dist/` sobre el bundle publicado, y la ficha externa pedida a `investigador` | **Se cae a LittleJS.** No se afloja la CSP: el sitio no tiene una hoy y la primera que escriba no va a nacer con un agujero adentro |
| 3 | **Trae sus propios tipos** y `npm run check` pasa sin tocar `tsconfig.json` | `npm run check` | Se escribe `src/tipos/kaplay.d.ts` propio (`ADR-08.5`). **No se afloja el `tsconfig`**: aflojarlo toca los 45 archivos de test, que es cambiar un problema de un archivo por uno de cuarenta y cinco |
| 4 | **No trae código vendorizado con licencia propia adentro del paquete** (`BR-15` consecuencia 1 dice "la licencia del motor", y eso incluye lo que trae adentro) | `ls node_modules/kaplay/` y lectura de todo `LICENSE*` / `NOTICE*` / `vendor/` que aparezca | Si aparece algo que no es MIT: ficha a `investigador` y, hasta que vuelva, no se avanza. Es la única condición donde `D-14` **no** aplica (`BR-15` consecuencia 1) |
| 5 | **El peso real dentro del bundle**, con tree-shaking, no pasa el techo de `ADR-08.10` | `npm run build` y medir el chunk de la isla en `dist/_astro/` | Se recorta uso de API hasta entrar, o se cae a LittleJS. Los ~65 KB de `RES-62.5` son de import completo y **no son la medición que manda** |

**Antes de comparar contra nada, hay que rehacer la vara.** Los 113 KB de JavaScript de
cliente que circulan como número del sitio se midieron sobre un `dist/` del 3 de septiembre,
sin las ~2.000 líneas del ciclo 14. `npm run build` primero, comparar después.

---

## ADR-08.2 — Cómo entra a la isla, y las cuatro cosas que se le apagan al motor

La isla es `src/scripts/partida-skayboy.ts`, cargada como todas las demás:
`<script>import '../../scripts/partida-skayboy.ts';</script>`. Astro la empaqueta con Vite y
sale al `dist/` estático; no hace falta ningún adapter y `output: 'static'` no se toca.

**Cuatro apagados, y ninguno es cosmético:**

1. **`global: false`.** Kaplay, por defecto, cuelga su API entera de `globalThis`. Un sitio
   con siete islas más una cinta de audio compartida no puede tener un paquete escribiendo
   nombres sueltos en el objeto global. Todo se usa por el handle que devuelve `kaplay()`.
2. **`canvas: <el nuestro>`.** El motor **no crea el canvas ni lo pega al `body`**. Recibe un
   `<canvas>` que ya está en el HTML, adentro del recorte impreso que manda `D-41` punto 3.
   Si el motor crea el suyo, se pega a sangre contra el borde de la ventana y `D-41` se
   rompe en la primera pantalla.
3. **El audio del motor, apagado y prohibido.** Kaplay trae su propio sistema de sonido, y
   usarlo crearía un segundo `AudioContext` — lo que `ADR-07.10` punto 7 prohíbe con nombre
   ("un `AudioContext` fuera de `contexto.ts`, excepción única `diagnostico-audio.ts`").
   **Todo lo que suena en este juego sale del contexto del sitio**: el tema por la vía de
   `ADR-08.9`, los efectos por la de `CTR-17`. Cero llamadas a la API de audio del motor.
4. **La fuente del motor, apagada.** Kaplay trae una fuente propia que aparece en pantalla
   con cualquier `text()`. Una fuente de motor dibujada en canvas es **el símil exacto que
   `D-18` retiró** y el "slop" que `diseno-marca.md` veta. Regla dura: **cero texto adentro
   del canvas.** Todo lo que se lee vive en el DOM, afuera del área de juego, con las
   fuentes reales del sitio — que es además lo que `D-41` punto 2 ya manda.

Y una quinta, menor pero que se olvida: **`debug` apagado en producción**. El inspector y el
contador de cuadros del motor son texto dibujado en canvas, o sea el punto 4 otra vez.

### Qué se ve si el motor no carga

Hoy la respuesta del repo sería: pantalla en blanco. **No se acepta.** El recorte del área
de juego se sirve con contenido estático adentro —un rótulo en registro 3, que escribe
`contenido`— y la isla lo reemplaza cuando el motor arrancó. Si el `import` falla, el rótulo
queda. Es el mismo criterio que `ADR-07.4` regla 3 usa para el repuesto de la rocola:
**mejor la pieza impresa que el silencio.**

---

## ADR-08.3 — La resolución lógica, y qué quiere decir "múltiplos enteros" (`D-41`)

> **Enmendado el 2026-09-16 por `FIND-55` (`REV-14`).** Esta sección decía **416 × 192
> nativos · 26 × 12 tiles** y chocaba de frente con `UX-27 §2` y `UX-28 §2`, que dicen
> **240 × 144 nativos · 15 × 9 tiles**. **Manda `experiencia` y la corrección es esta.** No
> es cortesía: lo que el jugador ve —cuánto mundo entra y de qué tamaño se ve un píxel— se
> decide contra el presupuesto de pantalla y de pulgar, que es donde está el jugador, y
> encima los números de `UX-28` cierran y los míos no. A 812 × 375 CSS, menos las dos
> columnas de mando de 112 CSS y los biseles, el área queda en **480 px CSS de ancho**, que
> es exactamente 240 nativos a escala ×2. **416 nativos no entran a ×2** —serían 832 CSS— y
> a ×1 dejan el píxel del tamaño de una mosca. Los números viejos no se citan más.

`D-41` punto 1 manda `image-rendering: pixelated` y **escalado por múltiplos enteros**. Eso
tiene una trampa que hay que escribir antes de que alguien la descubra probando: **hay tres
unidades en juego —píxel nativo, píxel CSS y píxel de dispositivo— y el entero tiene que
dar en las tres.**

| | Valor | Por qué |
|---|---|---|
| **Resolución lógica del área** | **240 × 144 px nativos** = 15 × 9 tiles de **16 × 16 nativos** | Lo fija `UX-27 §2`. El ancho sale de lo que sobra en un teléfono en horizontal con dos columnas de mando y el peor caso de muescas; el alto, de que la chapa del pie de homenaje (`D-42`) entre sin empujar nada |
| **`escalaCSS`** | **entero**: ×1 en vertical, **×2 en teléfono horizontal**, ×3 o ×4 en escritorio (`UX-27 §2`, `UX-28 §2` y `§5`) | La elige `experiencia` contra el reparto de la pantalla, **no el motor contra el tamaño de la ventana**. Nunca ×1,5, nunca ×2,5 |
| **Tamaño CSS del `<canvas>`** | `240 × escalaCSS` por `144 × escalaCSS` **px CSS**, fijo. A ×2 son **480 × 288 px CSS** | Es la caja que `UX-28 §2` ya repartió con las columnas de mando. **El área no crece con la pantalla** (`UX-27 §2.1`): si sobra lugar lo toman las columnas |
| **Buffer del `<canvas>`** (atributos `width`/`height`) | `240 × E` por `144 × E`, con **`E = max(escalaCSS, Math.round(escalaCSS × devicePixelRatio))`**, entero | `E` es cuántos píxeles **de dispositivo** ocupa un píxel nativo. Con DPR entero —1, 2, 3— da exacto (`escalaCSS × DPR`) y el mapeo es perfecto: a ×2 con DPR 3, buffer de 1440 × 864 dentro de una caja de 480 × 288 CSS |
| **Lo que sobra alrededor** | queda como **papel**, no como caja negra | El área está adentro de una pieza impresa (`D-41` punto 3). El sobrante es del marco, y es de `experiencia` (`UX-27 §1`) |

**El caso feo, escrito antes de que alguien lo descubra con el teléfono en la mano: el DPR
fraccionario.** Hay teléfonos con DPR 2,625 o 2,75. Ahí `escalaCSS × DPR` no es entero y
**alguna de las tres unidades tiene que ceder**. Cede la última, y a propósito: el buffer se
redondea a `E` entero y el navegador compone esa imagen en una caja CSS que **no se toca**,
porque estirar la caja rompería el reparto de `UX-28`. Queda un resto de medio píxel de
dispositivo que hace que algunas columnas de píxeles midan una unidad más que otras. Se
acepta por dos razones: es lo mejor que se puede hacer sin romper el reparto, y **la escena
no hace scroll** —el nivel es una sala cerrada y entra entero (`UX-29 §7.1`)—, así que la
irregularidad es estática y no tiembla. Lo que **no** se hace es escalar la caja CSS a un
número no entero de píxeles nativos: eso sí se ve, y en movimiento.

**Prohibido:** un canvas que se estire con `width: 100%`; un `escalaCSS` fraccionario; un
`devicePixelRatio` ignorado; que el motor decida la escala por su cuenta mirando la ventana;
y reescalar el atlas en el paso de carga para "adaptarlo" al DPR — el atlas se carga una vez
a tamaño nativo y **el escalado lo hace el dibujo** (`CTR-15.6`).

---

## ADR-08.4 — CSP, y el primer paquete de terceros que corre en el teléfono de la gente

El sitio **no tiene CSP hoy**. Esta decisión no la escribe —una cabecera de Vercel no es de
`arquitectura` sola— pero fija la condición que cualquier CSP futura tiene que poder cumplir:

> **El motor no puede necesitar `unsafe-eval`.** Si lo necesita, no entra.

Es la condición 2 de `ADR-08.1`. No la puedo verificar desde acá y **no la escribo de
memoria**: está pedida como ficha en
`Docs/SUGERENCIAS/ARQ-para-investigador-motor-kaplay.md`, junto con las otras tres cosas que
hay que leer en el paquete publicado y no en la página de marketing.

Lo que sí es medición sobre el repo y vale anotar: hoy `src/scripts/` tiene 15 archivos y
**ninguno importa un paquete de npm**. El motor sería el primero. Eso cambia tres cosas a la
vez —el árbol de dependencias del cliente, la premisa de `islas.test.ts` (`ADR-08.7`) y el
peso del bundle— y por eso la compuerta de `ADR-08.1` es una tarea aparte y no un paso
dentro de otra.

---

## ADR-08.5 — Tipos: el `tsconfig` no se afloja

`npm run check` es `astro check && tsc --noEmit`, y `tsconfig.json` extiende
`astro/tsconfigs/strict` con `erasableSyntaxOnly` y `verbatimModuleSyntax` encima.

- **`skipLibCheck` ya viene en `true`** desde `astro/tsconfigs/base.json`, así que los `.d.ts`
  del paquete no se type-checkean por dentro. Eso **baja mucho** el riesgo de que un motor
  con tipos torcidos pinte el build de rojo: el riesgo real no es que sus tipos estén mal,
  es que **no existan**.
- **Si no trae tipos:** se escribe `src/tipos/kaplay.d.ts`, un módulo ambiente que declara
  **solo lo que la isla usa** y nada más. Un `.d.ts` chico y honesto le gana a un `any`
  suelto, porque el `any` se propaga y el `.d.ts` no.
- **Lo que NO se hace, y queda escrito para que nadie lo proponga con apuro:** aflojar
  `strict`, agregar `allowJs` con `checkJs: false` para el paquete, o poner
  `// @ts-expect-error` en el import. Cualquiera de las tres toca el contrato que los 45
  archivos de test dan por cierto.
- **Ojo con `erasableSyntaxOnly`:** afecta a *nuestro* código, no al del paquete. La isla no
  puede usar `enum`, `namespace` ni propiedades de parámetro en el constructor. Si el
  ejemplo del motor que uno copia trae un `enum`, se reescribe como objeto `as const`.

---

## ADR-08.6 — Qué cambia en `package.json`, y el criterio de actualización

```diff
   "dependencies": {
-    "astro": "^5.14.1"
+    "astro": "^5.14.1",
+    "kaplay": "3001.0.19"
   },
```

Tres reglas que nacen con esa línea:

1. **Pineado exacto, sin `^`.** Es la primera pieza de terceros que corre en el teléfono de
   la gente; un `npm install` no la puede cambiar sin que alguien lo decida.
2. **Sigue siendo una sola dependencia de cliente.** Kaplay declara cero dependencias
   (`RES-62.5`): si algún día `npm ls --omit=dev` muestra un segundo nodo del lado del
   cliente, eso es un cambio de arquitectura y pasa por acá antes.
3. **Actualizar de versión es una decisión, no un mantenimiento.** El salto a la línea 4000
   (`RES-62.5`) se mira cuando salga de alfa **y** cuando alguien tenga un motivo; hasta
   entonces, la versión que anda es la que se queda. Precedente directo: `RES-62.3` y Phaser
   3.90.0 frente a la v4 con renderer reescrito.

---

## ADR-08.7 — `islas.test.ts` deja de proteger lo que protegía. Cómo se arregla

El comentario del test dice textual: *"Solo relativas: un paquete de `node_modules` es
problema del empaquetador, y este proyecto no tiene ninguno del lado del cliente"*
(`islas.test.ts:47-52`). **Adoptar un motor vuelve falsa esa frase**, y un guardián apoyado
en una premisa falsa no avisa nada: sigue verde mientras la puerta queda abierta.

**El arreglo, y es de tres líneas, no de reescribir el test:** el recorrido pasa a mirar
también las importaciones **desnudas** (`from 'kaplay'`), y las compara contra una lista
blanca declarada en el mismo archivo.

```ts
/**
 * Los paquetes de npm que pueden llegar al navegador. **Es una lista blanca, como el censo
 * de `rutas-sonoras.ts`**: lo que no está acá no pasa, y el que quiera agregar uno tiene que
 * venir hasta esta línea y leer por qué existe (`ADR-08.7`).
 */
const PAQUETES_DE_CLIENTE = ['kaplay'] as const;
```

Y un caso de prueba nuevo que falla si una isla importa un paquete que no está en esa lista,
con el nombre del archivo y el del paquete en el mensaje. Mismo mecanismo y misma asimetría
del daño que `ADR-07.2`: **el paquete nuevo nace prohibido**, y el error se descubre leyendo
en vez de jugando.

Lo que **no** cambia: el chequeo de `node:*` sigue igual, y los tres casos que ya están
—camino largo, `import type`, la lista de discos— se quedan donde están.

---

## ADR-08.8 — Los otros cinco auditores con lista a mano, uno por uno

Ninguno rompe el build hoy si alguien no lo extiende. Es el hueco silencioso que el
relevamiento midió, y acá queda con la línea exacta que hay que agregar en cada uno.

| Auditor | Qué tiene hoy | Qué se le suma | Qué pasa si nadie lo hace |
|---|---|---|---|
| `src/lib/esquemas.test.ts` | el arreglo `['quiz','letra','tapa','cancionero','popularidad','dos-ejes','por-la-letra']` (línea 48) | **`'skayboy'`**, el día que existan `src/data/skayboy.json` y su schema — no antes, que es la regla escrita en el comentario de la línea 44 — **y el caso de prueba propio de `CTR-16.4`**, el que cuenta los molinetes, que el schema no puede expresar | Los niveles no se validan contra `CTR-16`. Un nivel sin puerta para uno de los dos personajes entra al sitio |
| `src/lib/voz.test.ts` (`MODULOS`) | ocho entradas para nueve módulos de copy | **`skayboy`**, con su `src/lib/skayboy/copy.ts` | Anglicismos y botones en infinitivo pasan el build. Ya pasó dos veces: *"Link copiado"* estuvo tres ciclos en producción |
| `src/lib/estilos.test.ts` (bloques por juego) | cuatro bloques (`JS`, `JS_TEMA`, `JS_LETRA`, `JS_PONELOS`) para siete islas | el par recíproco de la isla nueva | `FIND-15` se repite por cuarta vez, en silencio |
| `src/lib/movimiento.test.ts` (`ANIMACIONES`) | 11 entradas cerradas, con su mecanismo de apagado | lo que agregue `src/styles/skayboy.css`, **y la hoja entera a la lista de archivos que escanea** | Ver la fila de abajo |
| **La hoja de CSS nueva** | `movimiento.test.ts` y `estilos.test.ts` escanean `tokens.css`, `juego.css`, `sitio.css` y `cancionero.css` **por literal** | `src/styles/skayboy.css` sumada a **los dos** | Es el agujero más barato de todos: una hoja nueva se escapa de los dos auditores sin tocar el canvas. Sin chequeo de `@keyframes`, sin 999px, sin barra lateral |
| `src/lib/sitio/rutas-sonoras.ts` (`PAGINAS_DECLARADAS`) | catorce páginas | la página del juego (`ADR-08.9`) | **Este sí rompe el build solo**, y es el único. Por eso es el modelo de los otros cinco |

**Y dos varas que no existen y hay que inventar, porque adentro del canvas no hay CSS que
escanear:**

1. **`prefers-reduced-motion` no existe en JavaScript en este repo**: el corte es 100% CSS.
   Un bucle de `requestAnimationFrame` ni se audita ni se apaga. **Regla de este ADR:** la
   isla consulta `matchMedia('(prefers-reduced-motion: reduce)')` y, si está activo, el
   juego arranca **en pausa** con la acción esperando un toque, en vez de moverse solo. No
   se apaga el juego —un plataformas sin movimiento no es un juego—, se apaga el movimiento
   que la persona no pidió. Es accesibilidad, no estilo.
2. **`contraste.test.ts` no tiene par que medir sobre una superficie dibujada** (`D-41`
   consecuencia 3). **Ya no es una deuda: `UX-27 §5` lo resolvió** mientras esto se escribía
   —dieciséis tintas `--px-*` declaradas en `tokens.css`, contorno de clave en todo sprite y
   la vara de 3:1 de cada tinta contra `--px-clave`— y `CTR-15.4` quedó enmendado para
   apuntar ahí (`FIND-60`). Lo que `arquitectura` sostiene es el mecanismo: **la paleta se
   audita porque está declarada como lista, no porque alguien mire el PNG.** Un PNG no se
   puede auditar; una lista, sí.

**El auditor nuevo que hace falta y no existe: `src/lib/skayboy/motor.test.ts`.** Lee el
fuente de la isla y falla si aparece cualquiera de los cuatro apagados de `ADR-08.2`: una
llamada a la API de texto del motor, una carga de fuente, una llamada a su API de audio, o
un `kaplay(` sin `global: false`. Es el mismo mecanismo con el que `correccion/armar.test.ts`
lee el fuente para probar que ese módulo no puede tocar el navegador: barato, específico, y
caza justo lo que una revisión a ojo deja pasar.

---

## ADR-08.9 — La ruta entra al censo: **`tema-fijo`**, el cuarto modo de la cinta

`D-39` condición 2 es taxativa: *"la excepción se escribe **ahí**, a la vista, nunca como un
caso especial escondido en la isla del juego"*. Entonces se escribe ahí, y para eso hay que
resolver primero una pregunta que ninguna decisión hizo: **¿el tema lo pone el juego o lo
pone la cinta?**

**Lo pone la cinta.** Si lo pusiera el juego, la isla tendría que abrir un `<audio>`, meterlo
al grafo y manejar el gesto — o sea escribir de nuevo, adentro de un juego, los tres
candados que `ADR-07` acaba de cerrar, y romper `ADR-07.10` punto 10 ("que un juego le avise
algo a la rocola"). La cinta ya sabe transmitir sin decodificar (`ADR-07.4`), ya tiene el
filtro vintage, ya tiene un solo interruptor y ya muestra el título sin el disco (`UX-26`).
**Las tres condiciones de `D-39` quedan cumplidas por construcción y no por promesa.**

Lo único que le falta a la cinta es no sortear: `D-39` consecuencia 3 dice que el tema de
este juego se elige, y que elegirlo es de `contenido` con `experiencia`.

### La enmienda, declarada

`ModoCinta` gana un cuarto valor. **Es una enmienda de `ADR-07.9` y se escribe con número,
no en silencio** — el precedente de cómo se hace es `D-42`.

```ts
/**
 * - `rocola`     — puede poner temas, sorteados.
 * - `cama`       — la cama sintetizada de `ADR-04`. No puede soplar nada y cuesta cero bytes.
 * - `muda`       — no suena nada, ni cama. Los tres graves y el instrumento de medición.
 * - `tema-fijo`  — **un** tema, el que declara el dato de la pantalla, en repetición
 *                  (`D-39`, `ADR-08.9`). Mismo transporte que `rocola`, misma cadena, mismo
 *                  interruptor, mismo rótulo de `UX-26`. Lo único que cambia es que no
 *                  sortea: la lista sembrada tiene una sola pieza.
 */
export type ModoCinta = 'rocola' | 'cama' | 'muda' | 'tema-fijo';
```

```diff
 export const PAGINAS_DECLARADAS: Readonly<Record<string, ModoCinta>> = {
   'juegos/ponelos-en-fila.astro': 'cama',
+  // La excepción de `D-39`, y la única del sitio. No es "un juego que suena": es un juego
+  // **sin respuesta que soplar** — no se adivina nada, se salta. El tema no se sortea: lo
+  // declara `temaFijo` en `src/data/skayboy.json` (`CTR-16.2`), lo elige `contenido`, y la
+  // cinta lo repite. Si mañana aparece un noveno juego pidiendo esto, la pregunta no es
+  // "¿tiene respuesta soplable?" —`dos-ejes` tampoco y va `cama`— sino la deuda que `D-39`
+  // consecuencia 1 dejó anotada con nombre, y esa la contesta el usuario, no este archivo.
+  'juegos/skayboy-y-poligirl.astro': 'tema-fijo',
 };
```

**Cuatro reglas que el modo nuevo arrastra:**

1. **`modoEnRuta()` sigue devolviendo `cama` por defecto.** `tema-fijo` no entra a
   `RUTAS_CON_ROCOLA`: se resuelve por `PAGINAS_DECLARADAS`, que es el censo, no la lista
   blanca de sorteo. La ruta nueva **sigue naciendo muda** si alguien la olvida.
2. **No autoarranca.** El primer byte de audio sigue necesitando un gesto sobre el
   interruptor (`ADR-07.8`, `ADR-07.10` punto 5). Si la cinta está apagada, el juego se juega
   en silencio, como los otros siete. **Un juego que arranca música solo sería el primer
   molinete al revés del sitio.**
3. **Un tema, no una lista. Y no precarga nada** (`ADR-07.10` punto 4). El techo de `CTR-14`
   —4 MB por tema— es el mismo y no sube.
4. **El nombre del archivo de la página manda, y eso es una ventaja, no un riesgo.** El
   título del juego todavía no está fijado (es de `contenido`, punto 7 de `IDEA-14`). Si la
   página se renombra, `rutas-sonoras.test.ts` **rompe el build con el nombre del archivo** y
   obliga a volver acá. Un renombre deja de ser una regresión silenciosa y pasa a ser un
   error con dirección.

**Lo que este modo no resuelve, y `D-39` consecuencia 1 ya dejó anotado:** sigue habiendo dos
pantallas con el mismo fundamento y distinta respuesta (`dos-ejes` va `cama`, esta va con
tema). El criterio que las separa lo escribe el usuario, no este documento. Acá solo queda
registrado que la asimetría está viva y tiene nombre.

---

## ADR-08.10 — El presupuesto, y lo que nadie midió

`CTR-01.5` fija 6,0 MB de audio residente y `CTR-14` cerró el de la rocola. Esto es lo que
suma el juego. **Los números con ✅ son cuentas cerradas; los ❓ son huecos con dueño.**

| Concepto | Cuenta | Techo de contrato |
|---|---|---|
| ✅ **JS de la isla, gzip** | motor + isla + datos, medido en `dist/_astro/` | **≤ 90 KB gzip.** Si no entra, `ADR-08.1` condición 5 |
| ✅ **El motor no se comparte con otras islas** | Vite podría meterlo en un chunk común | **Prohibido.** Se verifica mirando `dist/`: el paquete aparece en el chunk de este juego y en ninguno más. Las otras siete islas no pagan un byte |
| ✅ **RAM de bitmap decodificado** | dos atlas + tileset (`CTR-15.6`), con la celda de **16 × 24 nativos** de `FIND-55` | **≤ 0,5 MB**, y es **independiente del DPR** por construcción: el atlas se carga a tamaño nativo y el escalado lo hace el dibujo. Con la celda nueva la cuenta de `CTR-15.6` da **≈ 0,12 MB**, o sea que el techo quedó holgadísimo — y se deja igual, porque un techo se baja cuando alguien lo mide, no cuando alguien lo estima |
| ✅ **Red, audio del tema** | `CTR-14`, sin cambios | **≤ 4 MB**, y cero si la cinta está apagada |
| ✅ **Red, efectos de sonido** | `CTR-17` | **0 bytes.** Se sintetizan |
| ✅ **Datos del nivel** | `CTR-16.1` | **≤ 24 KB** sin comprimir |
| ❓ **Batería y CPU en un teléfono viejo** | sería el único juego del sitio con un bucle a 60 fps corriendo minutos | **Sin medir.** Verificación manual del usuario, como el riesgo 6 del brief. No es gate (`D-09`), pero si el teléfono se calienta, el techo de cuadros baja a 30 y se anota acá |
| ❓ **El juego corriendo junto a la cinta** | un `AudioContext` vivo contra un `requestAnimationFrame` en gama baja | **Sin medir.** Va en la misma prueba de mano |
| ❓ **Tiempo hasta jugable** | `D-32` límite 3 pide 0 ms hasta que la acción principal es tocable | **Sin medir.** Y es el único de los tres que puede obligar a cambiar el diseño: si el motor tarda, el rótulo estático de `ADR-08.2` es lo que la persona mira mientras tanto |

**Latencia del toque, que es requisito y no medición:** `touch-action: none` sobre el área de
juego, listeners **no pasivos** solo donde hace falta cancelar el gesto, y **un control que
se mantiene apretado** — que el repo no tiene en ningún lado hoy. El primero que lo escriba
lo escribe bien: el estado se lee por `pointerdown`/`pointerup` con captura, nunca por
repetición de eventos.

---

## ADR-08.11 — Qué queda prohibido, en una lista para revisar

1. **Un segundo `AudioContext`.** El del motor incluido. `ADR-07.10` punto 7.
2. Texto dibujado adentro del canvas, con cualquier fuente. `D-18`, `D-41` punto 2.
3. El motor creando su propio `<canvas>` o pegándolo al `body`. `D-41` punto 3.
4. `global: true`, o cualquier nombre del motor colgado de `globalThis`.
5. Un canvas escalado por un factor no entero, o un `devicePixelRatio` ignorado. `D-41`.
6. Un segundo paquete de npm del lado del cliente sin pasar por `ADR-08.6` y por la lista
   blanca de `ADR-08.7`.
7. Aflojar `tsconfig.json` para que entre un paquete sin tipos. `ADR-08.5`.
8. Datos de nivel escritos en el código. `CLAUDE.md`: el contenido viene de `src/data/*.json`.
9. Una hoja de CSS nueva que no esté en la lista de los dos auditores de estética.
   `ADR-08.8`.
10. La cadena con el nombre del juego de origen, en cualquier lado: texto visible, metadata
    o comentario del código. `RES-60`.
11. Un `setInterval` para la lógica del juego. El reloj es el del motor; el del audio es el
    del `AudioContext`. Dos relojes que no son el mismo no se sincronizan a mano.

---

## Consecuencias

1. **El repo pasa a tener JavaScript de terceros en el teléfono de la gente, por primera
   vez.** No es un detalle de `package.json`: es la premisa de `islas.test.ts`, el árbol de
   dependencias del cliente y la superficie de una CSP futura, todo a la vez. Por eso la
   compuerta de `ADR-08.1` es una tarea propia.
2. **`IDEA-04` hereda esto entero y no vuelve a pagarlo** — el motor, la resolución lógica,
   la lista blanca de paquetes, los seis auditores extendidos. Es lo que `IDEA-14` ya había
   anotado: el que se toma primero paga las dos cosas.
3. **La cinta gana un modo y el censo gana una fila.** `ARQ-rocola.md` queda con un puntero a
   `ADR-08.9`: `ADR-07.9` no se versiona, se enmienda.
4. **Quedan tres huecos sin medir** (batería, convivencia con la cinta, tiempo hasta
   jugable). Ninguno bloquea: `D-09` sacó la velocidad de carga de los no negociables. Pero
   se miden antes de publicar, no después, y el único que puede cambiar el diseño es el
   tercero.
5. **Nada de esto habilita a empezar.** `BR-16`: sin `US-09` con criterio y piso, y sin dueño
   del arte de niveles, esto es un contrato esperando.
