# ARQ — El motor 2D, y los seis candados que un `<canvas>` atraviesa sin que nadie se entere

> Rol dueño: `arquitectura`. **Produce: `ADR-08`** (`ADR-08.1` … `ADR-08.11`, más el apartado
> `ADR-08.2.1`, que nació el 2026-09-18).
>
> **Consume:** `Docs/BRIEF.md` (restricciones técnicas, criterio no negociable 2), `D-02`,
> `D-12`, `D-14`, `D-15`, `D-18`, `D-22`, `D-29`, `D-32`, `D-37` (puntos 4, 6 y 7), `D-38`,
> `D-39`, `D-40`, `D-41`, `D-42`, **`D-43`**, **`UX-27 §2` y `UX-28 §2` (la geometría real de
> la pantalla, que es la que manda desde `FIND-55`)**, **`REV-14`**, `BR-15`
> (consecuencias 1 y 3), `BR-16`, `IDEA-14`
> (`PRD-backlog-ideas.md`), `RES-60`, `RES-62`, `RES-63`, `RES-65` (`INV-60`),
> **`RES-70`, `RES-71`, `RES-72` (`INV-61`)**, `ADR-04`,
> `ADR-07` y `CTR-14` (`ARQ-rocola.md`), `CTR-01.5`, `CTR-15`, `CTR-16`, `CTR-17`,
> `Docs/SUGERENCIAS/HILO-para-arquitectura-el-motor-y-el-sonido-del-juego.md`,
> **`Docs/SUGERENCIAS/HILO-para-arquitectura-la-compuerta-del-motor-corrida.md`** (las cinco
> respuestas de `T-226`),
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
> Última actualización: 2026-09-22 (la cita de `ADR-07.10` punto 7 en `ADR-08.2` punto 3
> lleva una aclaración rotulada: las excepciones de `AudioContext` son dos, ver `ADR-08.2.1`;
> la segunda enmienda, del 2026-09-18, está más abajo. **Mismo día, `T-247`:** `ADR-08.2.1`
> gana una quinta condición —`backgroundAudio: true` en el init—, reflejada en el bloque de
> código de `ADR-08.2` punto 3 y en `ADR-08.11` punto 1).
>
> Versión anterior de esta línea: 2026-09-16 (ciclo 15, primera versión, **enmendada el mismo día por
> `REV-14`**: `FIND-55` cambió la resolución lógica en `ADR-08.3` y, con ella, la cuenta de
> RAM de `ADR-08.10`. Se enmienda en el lugar y con la marca puesta, no se versiona: nada se
> construyó todavía sobre los números viejos, y un `-v2` a las cuatro horas del `-v1` es un
> archivo más para desincronizar).
>
> **Segunda enmienda, 2026-09-18: la compuerta de `ADR-08.1` se corrió entera (`T-226`) y
> devolvió cuatro condiciones en verde, una en rojo y dos hallazgos que la lista no buscaba.**
> Lo que cambia acá es `ADR-08` (el rótulo de la licencia), `ADR-08.1` (los cinco resultados y
> una salida que no existe), `ADR-08.2` punto 3 (el audio del motor no se apaga con una
> opción) y `ADR-08.10` (el presupuesto, con números medidos en vez de estimados). **Sigue sin
> versionarse a `-v2` y con motivo:** la decisión no se movió —el motor sigue siendo Kaplay
> `3001.0.19`, elegido por lo mismo—, lo que se movió son hechos que estaban mal fichados y
> huecos que estaban sin medir. Un `-v2` es para cuando la decisión cambia; esto es la misma
> decisión con el rótulo dicho en serio.
>
> **Regla de escritura que nace de `FIND-55` y vale para todo `Docs/ARQ/`: toda medida de
> píxel dice si es _nativa_ o _CSS_, en cada mención.** El choque que el revisor encontró no
> fue un número mal puesto: fue que dos documentos escribieron "32 × 48" queriendo decir
> cosas distintas. Una medida sin unidad es la que se copia mal.
>
> **Segunda regla, que nace de `RES-70` y vale igual para todo `Docs/ARQ/`: una licencia se
> lee en el tag de la versión que se instala, nunca en la rama.** `RES-62.4` fichó "Kaplay:
> MIT" **verificada y de buena fe**, y estuvo mal igual: consultó
> `raw.githubusercontent.com/kaplayjs/kaplay/`**`master`**`/LICENSE`, donde eso es cierto. Lo
> que termina adentro de `node_modules/` no sale de `master`, sale del tag. Las dos preguntas
> —"¿qué licencia tiene este motor?" y "¿qué licencia tiene el archivo que queda en disco
> después de `npm i -E paquete@1.2.3`?"— tienen respuestas distintas y **solo la segunda
> importa**. Fuentes válidas: el tag, el tarball publicado, o el archivo en disco después de
> instalar. **Y un corolario que este caso regaló: el campo `license` del `package.json` no es
> una fuente** — es un metadato que declara quien publica, y acá dice `MIT` con el archivo de
> al lado diciendo otra cosa (`RES-70.1`). Vale para cualquier paquete que este proyecto
> vuelva a fichar, no solo para el motor.

---

## ADR-08 — El motor es **Kaplay 3001.0.19**, pineado exacto, y entra apagado de casi todo

- **Fecha:** 2026-09-16. **Compuerta corrida el 2026-09-18** (`T-226`).
- **Estado:** **aceptada, con la compuerta cerrada** (`ADR-08.1`). Estuvo "aceptada con
  compuerta abierta" dos días; `T-226` corrió las cinco condiciones, **cuatro dieron verde y
  la cuarta —la licencia— dio rojo**, y el usuario eligió la salida A: el motor se queda y el
  rótulo se corrige. La elección de motor no se rediscute; lo que se corrige acá es lo que el
  documento decía de menos y lo que decía de más.
- **Para quién es:** para el hilo principal, que construye la isla; para `revisor`, que
  corre la compuerta; para `experiencia`, que necesita saber qué resolución lógica tiene la
  pantalla (`ADR-08.3`); para `orquestador`, que corta las tareas.
- **Qué NO es:** no es una autorización para empezar. `BR-16` sigue mandando: sin `US-09`
  con criterio y piso, esto es un contrato esperando a que alguien lo use.

### La decisión, en una línea

> **Kaplay `3001.0.19`**, **MIT con una cláusula anti-IA agregada — no es MIT a secas, no
> está en SPDX y no la aprobó OSI** (`RES-70`) —, cero dependencias, **66,8 KB gzip medidos
> en el bundle real de este sitio** (`T-226`), pineado sin `^`, importado dentro de una sola
> isla, **con su audio, su fuente, su `debug` y sus globales apagados**.

> **Enmendado el 2026-09-18 por `RES-70` (`INV-61`), con la compuerta ya corrida (`T-226`).**
> Esta línea decía **"MIT, cero dependencias, ~65 KB gzip (`RES-62.4`, `RES-62.5`)"** y la
> primera palabra era falsa. El `LICENSE.md` que viaja adentro de `kaplay@3001.0.19` es el
> texto MIT **con un bloque agregado** —encabezado *"In addition, the following restrictions
> apply"*— que prohíbe usar el software para entrenar o mejorar algoritmos de aprendizaje
> automático, prohíbe incluirlo en conjuntos de datos de entrenamiento y amenaza con acción
> legal. La familia "MIT Non-AI" no figura en la lista SPDX ni está aprobada por OSI, porque
> una restricción de campo de uso es incompatible con la Open Source Definition (`RES-70.5`,
> **rotulado por `investigador` como interpretación**, no como dictamen). **El rótulo viejo
> no se cita más**, y esta corrección se hace aunque el motor se quede: en este proyecto un
> rótulo que miente sobre lo que hay adentro es el defecto que `D-14` persigue, y un `ADR`
> que rotula MIT algo que no lo es tiene ese defecto exacto.
>
> **El matiz que hay que decir en la misma respiración (`RES-70.3`): no es una postura del
> proyecto, es una rama que quedó atrás.** Kaplay revirtió a MIT plano el 2025-05-11, pero el
> revert vive en `master` y en la línea `4000.x`, **no en la rama de mantenimiento 3001.x**,
> que se tagueó un mes más tarde arrastrando la versión vieja. O sea que la versión que
> instala cualquiera por ser `latest` quedó del lado viejo de un revert que ya había
> ocurrido. Por qué 3001.x nunca lo recibió: no hay changelog, issue ni anuncio (`RES-70.4`,
> **sin fuente**, y no se rellena).
>
> **Y por qué esto no lo caza ninguna herramienta (`RES-70.1`): el `package.json` del mismo
> paquete declara `"license": "MIT"`.** El metadato contradice al archivo de al lado, así que
> `npm view kaplay@3001.0.19 license` devuelve `MIT` y cualquier auditoría automática que lea
> el campo informa MIT y sigue de largo. Lo único que lo ve es abrir el `LICENSE.md` del tag.

### Por qué ese y no los otros dos que quedaban en pie

`RES-62` dejó tres finalistas y un orden. Lo que decide entre ellos no es el peso —los tres
entran— sino **cuánto motor hay que escribir a mano encima**, que es exactamente lo que
`BR-15` dice que no se hace.

| | Motor | Licencia | Peso | Por qué sí / por qué no |
|---|---|---|---|---|
| ✅ | **Kaplay 3001.0.19** | **MIT con cláusula anti-IA** (`RES-70`) — no OSI, no SPDX | **66,8 KB gzip**, medidos en el chunk de la isla (`T-226`) | Cero dependencias: el árbol de npm del cliente queda con **un** nodo y se audita leyendo una línea. El modelo por componentes (`area`, `body`, `solid`) mapea casi literal a "dos personajes + plataformas + zonas que devuelven a la entrada + puerta cooperativa" (el vocabulario es el de `UX-29`, y acá no es un eufemismo: es lo que el `area` del motor hace), y trae carga de nivel desde una grilla de caracteres — que es justo la forma que `CTR-16` le da al JSON. Input táctil nativo (`RES-62.5`) |
| ↩ | **LittleJS** | **MIT limpio, leído en el tarball publicado** (`RES-71`), **con Box2D vendorizado bajo zlib** (`RES-71.1`) — permisiva, sin restricción de campo de uso | **62 KB gzip** el módulo ESM minificado (`RES-71`) | **Es el repuesto declarado, y sigue siéndolo.** Trae ejemplo de plataformas armado (`RES-63.6`), pero la API es más manual y global: hay que escribir a mano lo que Kaplay trae. **El ahorro de peso ya no es el argumento** — ver la enmienda de abajo |
| ✕ | **Phaser 3.90.0** | MIT, **re-chequeada en el tag exacto** (`RES-62.1`, `RES-72`) | ~347 KB gzip | Tres veces todo el JavaScript que el sitio le manda hoy al teléfono. `D-09` sacó la velocidad de carga de los no negociables, así que esto no es un veto de performance: es que **no hay nada que comprar** con esos 280 KB extra. Su ventaja es la comunidad, y la comunidad no aparece en el teléfono de nadie |

> **Enmendado el 2026-09-18 por `RES-70` y `RES-71` (`INV-61`).** Dos casillas de esta tabla
> decían otra cosa y ninguna se borra:
>
> - **La licencia de Kaplay decía "MIT (`RES-62.4`)"**, que es la ficha refutada. Queda como
>   está escrito arriba, con `RES-70` al lado.
> - **La fila de LittleJS decía "MIT (`RES-62.7`) · ~46 KB gzip · 19 KB más liviano … el
>   ahorro de 19 KB no paga el motor que habría que escribir".** Medido hoy sobre el tarball
>   publicado de `1.18.29`, el módulo ESM minificado está en **62 KB gzip**: contra los 66,8
>   de Kaplay en el bundle real, la diferencia es de **menos de 5 KB**. **El argumento de esta
>   decisión sobrevive entero, pero ya no se apoya en el peso** — sigue siendo que el ahorro
>   no paga el motor que habría que escribir a mano. Un número que envejeció es peor que no
>   tener número, porque el que lo lee cree que está mirando la realidad.
> - **Y lo que no se sabía de LittleJS:** vendoriza Box2D bajo zlib (`RES-71.1`). No dispara
>   la condición 4 —zlib es permisiva y está aprobada por OSI—, pero *"LittleJS: MIT"* a secas
>   era incompleto. El repuesto sigue en pie y ahora se sabe qué trae adentro.

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

### La condición 4 dio rojo: qué se decidió, quién, y qué se descartó

`BR-15` consecuencia 1 hace de la licencia del motor **la única condición de todo el
proyecto donde `D-14` no aplica**. Acá no vale "si llega un reclamo se baja": se decide
antes. Por eso esta subsección existe y por eso la decisión no la tomó este documento.

| | Salida | Qué costaba | Estado |
|---|---|---|---|
| **A** | **Quedarse en `3001.0.19`** y corregir el rótulo: decir "MIT con cláusula anti-IA, no OSI", con `RES-70` al lado | Nada técnico —ya está medido y pasa las otras cuatro condiciones—. Cuesta escribir la verdad en este archivo | ✅ **elegida por el usuario, 2026-09-18** |
| **B** | Caer a **LittleJS**, el repuesto declarado | Reescribir el humo y parte de la planificación, **para comprar menos de 5 KB gzip** (`RES-71`) y una licencia limpia | ✕ descartada |
| **C** | Ir a `4000.0.0-alpha.27.1`, que **sí** es MIT plano (`RES-70.3`) | **Lo veta el propio `ADR-08`**: un alfa no entra a un sitio publicado | ✕ descartada, y se nombra para que no vuelva a proponerse |

**Por qué A, escrito para dentro de dos meses.** La restricción del bloque agregado es de
campo de uso: entrenar modelos y armar conjuntos de datos. **El uso que este sitio le da
—importar el paquete sin modificarlo y servirlo en un estático de fans, sin lucro— no cae
adentro de eso.** Ojo con cómo está rotulada esa frase: es **lectura del texto**, así la
rotuló `investigador` en `INV-61`, y ese rol no da consejo legal. Es la lectura evidente, no
un hecho verificado, y queda anotada como tal en los huecos abiertos.

**Lo que decidió A y lo que no.** Decidió que el motor se queda. **No** decidió que el rótulo
daba igual: el rótulo había que corregirlo en las tres salidas, porque lo que estaba mal no
era la elección sino la ficha. Si alguna vez el uso del sitio cambia —alguien quiere entrenar
algo con esto, alguien lo empaqueta adentro de un conjunto de datos— **esta decisión no lo
cubre y hay que volver acá**, que es exactamente para lo que sirve tenerla escrita.

---

## ADR-08.1 — La compuerta: cinco condiciones, **corrida el 2026-09-18**, cuatro en verde y una en rojo

> **Enmendado el 2026-09-18 con el resultado de `T-226`.** Esta sección se escribió en
> condicional, y con motivo: `arquitectura` no corre comandos (`D-12`) ni tiene `WebSearch`,
> así que dejó la condición, el comando que la contesta y la consecuencia de que diera que
> no. **Ya se corrió.** La tabla pasa de "si falla" a "qué dio", **sin borrar la consecuencia
> que estaba escrita**: lo que iba a pasar si fallaba es parte de por qué la condición
> existía. Lo corrió el hilo principal; el traspaso completo, con las cinco respuestas, está
> en `Docs/SUGERENCIAS/HILO-para-arquitectura-la-compuerta-del-motor-corrida.md`.

| # | Condición | Resultado y con qué se comprobó | La consecuencia que estaba escrita |
|---|---|---|---|
| 1 | **Entra en una isla de Astro con salida estática** y el sitio sigue construyendo | ✅ **pasa.** `npm run build` con la isla de humo adentro: 152 páginas. Y **dibuja de verdad en el navegador**, no solo compila | Se probaba LittleJS con el mismo humo. Si tampoco, el problema era del empaquetador y no del motor: se revisaba `astro.config.mjs` antes de cambiar de paquete |
| 2 | **No usa `eval()` ni `new Function()`** — la CSP estricta de un estático en Vercel no los admite | ✅ **pasa.** `grep` sobre los tres bundles publicados de `node_modules/kaplay/dist/`: **cero coincidencias**. `ADR-08.4` queda cumplido | **Se caía a LittleJS.** No se afloja la CSP: el sitio no tiene una hoy y la primera que escriba no va a nacer con un agujero adentro |
| 3 | **Trae sus propios tipos** y `npm run check` pasa sin tocar `tsconfig.json` | ✅ **pasa.** `npm run check`: **0 errores**, con `tsconfig.json` intacto. El `src/tipos/kaplay.d.ts` de `ADR-08.5` **no hace falta** | Se escribía un `.d.ts` propio. **Sin aflojar el `tsconfig`**: aflojarlo toca los 45 archivos de test |
| 4 | **No trae código vendorizado con licencia propia adentro del paquete** (`BR-15` consecuencia 1) | 🔴 **falla, y por donde no se esperaba.** Vendorizado no hay nada: un solo `LICENSE.md`, cero dependencias, el árbol de npm del cliente con **un nodo**. **La que no es MIT es la licencia del motor mismo** (`RES-70`) | Ficha a `investigador` y no se avanza hasta que vuelva. Se hizo: es `INV-61`. **Resuelta con la salida A**, arriba |
| 5 | **El peso real dentro del bundle** no pasa el techo de `ADR-08.10` | ✅ **pasa, con una sorpresa.** **66,8 KB gzip** el chunk de la isla, contra un techo de 90. La sorpresa está abajo y cambia una premisa | Se recortaba uso de API, o se caía a LittleJS. **La primera mitad de esa salida no existe** — ver abajo |

### 🔑 La sorpresa de la condición 5: el motor no se tree-shakea

`RES-62.5` fichó ~65 KB gzip y esta condición avisó, con razón, que eso era de import completo
y **no la medición que manda**. La medición que manda dio **66,8 KB gzip** para un humo que
importa el motor y dibuja **un rectángulo**. El import mínimo pesa lo mismo que el completo —
un poco más, incluso, por el envoltorio de Vite.

> **Enmendado: la salida que esta condición dejaba escrita no existe.** Decía *"se recorta uso
> de API hasta entrar, o se cae a LittleJS"*. **No hay API que recortar: usar menos motor no
> baja un byte.** Si algún día el techo de 90 KB gzip aprieta, quedan dos palancas y ninguna
> es el motor: **sacar peso de la isla** o **sacar peso del dato del nivel** (`CTR-16.1`, con
> su propio techo de 24 KB sin comprimir). Queda escrito acá para que no se descubra el día
> que aprieta, que es el peor día para descubrirlo.

**La vara se rehízo, como esta sección pedía.** Los "113 KB" que circulaban como número del
sitio eran de un `dist/` del 3 de septiembre, sin las ~2.000 líneas del ciclo 14. El número
nuevo, medido antes de instalar nada, está en `ADR-08.10`.

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
3. **El audio del motor: no hay flag, hay una línea que la isla escribe sí o sí.** Kaplay
   trae su propio sistema de sonido, y usarlo crearía un segundo `AudioContext` — lo que
   `ADR-07.10` punto 7 prohíbe con nombre ("un `AudioContext` fuera de `contexto.ts`,
   excepción única `diagnostico-audio.ts`") — *[aclaración del 2026-09-22: la cita es el
   texto original de `ADR-07.10`; ese punto se enmendó el 2026-09-22 a **dos** excepciones,
   `diagnostico-audio.ts` y el contexto que Kaplay crea en su init y la isla cierra con
   `void k.audioCtx.close()` — ver `ADR-08.2.1` y la enmienda en `ARQ-rocola.md:731-740`]*.
   **Todo lo que suena en este juego sale del
   contexto del sitio**: el tema por la vía de `ADR-08.9`, los efectos por la de `CTR-17`.
   Cero llamadas a la API de audio del motor. Y como no alcanza con no llamarla, la isla
   escribe esto:

   ```ts
   const k = kaplay({
     global: false,
     canvas,
     backgroundAudio: true,   // NO enciende audio: impide que el motor reanude el contexto
                              // cerrado al volver a la pestaña (ADR-08.2.1, condición 5)
     /* … */
   });
   void k.audioCtx.close();   // el apagado que ninguna opción ofrece (ADR-08.2.1)
   ```

   *[Enmendado el 2026-09-22 por `T-247`: el bloque tenía solo el `close()`. Le faltaba
   `backgroundAudio: true`, que es la otra mitad del apagado — ver `ADR-08.2.1`, condición 5.]*

4. **La fuente del motor, apagada.** Kaplay trae una fuente propia que aparece en pantalla
   con cualquier `text()`. Una fuente de motor dibujada en canvas es **el símil exacto que
   `D-18` retiró** y el "slop" que `diseno-marca.md` veta. Regla dura: **cero texto adentro
   del canvas.** Todo lo que se lee vive en el DOM, afuera del área de juego, con las
   fuentes reales del sitio — que es además lo que `D-41` punto 2 ya manda.

Y una quinta, menor pero que se olvida: **`debug` apagado en producción**. El inspector y el
contador de cuadros del motor son texto dibujado en canvas, o sea el punto 4 otra vez.

**Dos de los cuatro quedaron verificados en el navegador en `T-226`:** con `global: false` no
aparece **ningún** nombre de Kaplay en `window` (se buscaron `add`, `rect`, `pos`, `color`,
`loadSprite`, `vec2`, `onUpdate`), y con `canvas: <el nuestro>` el DOM queda con **un solo**
`<canvas>`, el que ya estaba en el HTML, a la resolución lógica de `ADR-08.3` — **240 × 144 px
nativos** —, sin que el motor cree el suyo ni lo pegue al `body`. `D-41` punto 3 se sostiene.
El tercero es el del audio, acá abajo. **El cuarto —la fuente— no se ejercitó**: el humo no
dibujaba texto, así que sigue siendo regla sin prueba hasta que la vigile `motor.test.ts`.

> **Enmendado el 2026-09-18 por `T-226`, hallazgo 3.1.** El punto 3 decía **"El audio del
> motor, apagado y prohibido"**, como si "apagado" fuera una opción del init. **No lo es, y
> un lector razonable buscaba el flag y no lo encontraba.** Medido: las 29 opciones del init
> de Kaplay —`width`, `height`, `scale`, `stretch`, `letterbox`, `debug`, `debugKey`, `font`,
> `pixelDensity`, `crisp`, `canvas`, `root`, `background`, `texFilter`, `logMax`, `logTime`,
> `hashGridSize`, `touchToMouse`, `loadingScreen`, `backgroundAudio`, `gamepads`, `buttons`,
> `maxFPS`, `focus`, `global`, `plugins`, `burp`, `tagsAsComponents`, `spriteAtlasPadding`—
> **no incluyen ninguna que toque el audio**. `backgroundAudio` es otra cosa: si sigue sonando
> al perder el foco. En el bundle, el init hace `a.audio = sa()` **incondicionalmente**, y
> `sa()` es `new (window.AudioContext || window.webkitAudioContext)`. Verificado en el
> navegador: al llamar `kaplay()` aparece un `AudioContext` **en estado `running`** —ni
> siquiera `suspended`—, sin gesto de la persona. La mitigación de arriba también está
> verificada: después del `close()` queda en `closed` **y el motor sigue dibujando**.

### ADR-08.2.1 — El contexto que nace y muere en dos líneas: **sí, es excepción, y va escrita**

> **Sobre el número, que tiene tres tramos a propósito:** esto es un apartado del punto 3 de
> `ADR-08.2`, no una decisión nueva del mismo rango que `ADR-08.3` o `ADR-08.11`. Mismo
> criterio con el que `investigador` numera `RES-70.3`. Si `/coherencia` lo marca, está bien
> marcado y esta línea es la respuesta.

La pregunta que deja el hallazgo es mía y la contesto acá: ese `AudioContext` que vive unos
milisegundos, **¿es una excepción de `ADR-07.10` punto 7 o no hace falta declararla?**

> **Es excepción, es la segunda y última del sitio, y queda declarada con número.**

Tres razones, ninguna de trámite:

1. **La regla cuenta contextos, no duraciones.** `ADR-07.10` punto 7 dice "un `AudioContext`
   fuera de `contexto.ts`". Este se construye, existe y toma recursos del navegador antes de
   que nadie lo cierre. Decir "total dura poco" es exactamente la forma de razonar que
   convierte una regla dura en una costumbre.
2. **El `grep` que audita la regla no lo puede ver.** La verificación de `ADR-04.10` recorre
   `src/lib` y `src/scripts` buscando `new AudioContext|webkitAudioContext` y tiene que dar
   **dos** resultados. El del motor está adentro de `node_modules/`: el `grep` seguiría dando
   dos y en el navegador habría tres. **Es el mismo defecto que `ADR-08.7` le encontró a
   `islas.test.ts`** — un guardián apoyado en una premisa que dejó de ser cierta. Una
   excepción que nadie escribe es una excepción que nadie sabe que existe.
3. **Si mañana `close()` deja de alcanzar, este es el lugar donde se mira.** Un navegador que
   devuelva la promesa sin cerrar, un `webkit` viejo sin `close()`, o una versión del motor
   que mueva `audioCtx`: cualquiera de las tres rompe algo, y lo rompe callada.

**Las cinco condiciones que la excepción arrastra, y sin las cinco no vale** *(eran cuatro
hasta el 2026-09-22; la quinta es la enmienda de abajo)*:

1. **El `close()` va en la línea siguiente al `kaplay()`**, sincrónico, antes de cualquier
   otra sentencia. No adentro de un `then`, no en un `onLoad`, no "cuando arranca la partida".
2. **Cero llamadas a la API de audio del motor**, que es lo que el punto 3 ya decía.
3. **El contexto del sitio sigue siendo uno solo** y sigue viviendo en `contexto.ts`. Esta
   excepción no abre la puerta a que una isla construya el suyo: **lo que se acepta es no
   poder impedir que el motor lo construya**, que es otra cosa.
4. **`motor.test.ts` la vigila** (`ADR-08.8`): sin la línea del cierre, el build se cae.
5. **`backgroundAudio: true` en las opciones del `kaplay()`.** *[Condición agregada el
   2026-09-22 por `T-247`.]* **El nombre dice lo contrario de lo que hace acá, y por eso va
   explicado:** en un juego con el audio del motor vivo, `backgroundAudio: true` significa
   "seguí sonando con la pestaña escondida". En esta isla no hay nada que suene por el motor
   —el contexto ya está cerrado—, así que la opción **no enciende nada**. Lo único que hace
   es saltear las dos llamadas que el motor le hace al contexto cuando la pestaña cambia de
   visibilidad. `motor.test.ts` también la vigila: sin ella, el build se cae.

> **Enmienda del 2026-09-22 (`T-247`): el cierre era la mitad del apagado.** Medido en el
> navegador por el hilo principal: con `void k.audioCtx.close()` en la línea siguiente al
> init y **sin** `backgroundAudio`, Kaplay `3001.0.19` sigue registrando, en su init, dos
> manejadores sobre el contexto. En el bundle:
> `a.app.onHide(()=>{a.globalOpt.backgroundAudio||a.audio.ctx.suspend()}),a.app.onShow(()=>{!a.globalOpt.backgroundAudio&&!a.debug.paused&&a.audio.ctx.resume()})`.
> Sobre un contexto cerrado, cada vez que la persona esconde la pestaña y vuelve, el
> `resume()` tira `Uncaught (in promise) InvalidStateError: Cannot resume a closed
> AudioContext`. No rompe el juego, pero es un error sin atrapar por cada vuelta, y es
> justo el tipo de cosa que la razón 3 de arriba anticipaba: algo que se rompe callado.
> **Con `backgroundAudio: true` en el init, las dos ramas quedan en cortocircuito** y el
> motor no le toca más el contexto. Resultado verificado: **cero errores en tres cargas con
> esconder y volver.** La isla (`src/scripts/partida-skayboy.ts`) ya lo tiene y
> `src/lib/skayboy/motor.test.ts` lo exige (caso "sin backgroundAudio: true", probado en
> rojo).
>
> **Y corrige una frase de la enmienda del 2026-09-18**, más arriba, que decía que
> `backgroundAudio` "es otra cosa: si sigue sonando al perder el foco". Es cierto como
> descripción del flag y falso como conclusión: **sí toca el audio**, porque gobierna si el
> motor suspende y reanuda su contexto. La lista de "ninguna opción del init toca el audio"
> queda así: ninguna **lo apaga**; una —esta— **deja de manosearlo después de muerto**. La
> frase vieja se deja donde está, dentro de su cita, para que se vea qué cambió.
>
> **No se versiona a `-v2`:** la decisión —excepción declarada, cierre inmediato— es la
> misma; lo que cambió es que ahora el apagado está completo.

**Lo que queda sin medir y se dice:** esto se verificó en el navegador durante `T-226`. **En
Safari de iOS no se probó**, y ahí es donde el límite de contextos por página duele de
verdad. Va a la lista de huecos de `ADR-08.10`, no a una promesa.

### Qué se ve si el motor no carga

Hoy la respuesta del repo sería: pantalla en blanco. **No se acepta.** El recorte del área
de juego se sirve con contenido estático adentro —un rótulo en registro 3, que escribe
`contenido`— y la isla lo reemplaza cuando el motor arrancó. Si el `import` falla, el rótulo
queda. Es el mismo criterio que `ADR-07.4` regla 3 usa para el repuesto de la rocola:
**mejor la pieza impresa que el silencio.**

**Y desde `T-226` ese rótulo dejó de ser el repuesto del caso feo.** El tiempo hasta jugable
se midió —**114 ms**, en escritorio y con el servidor en la misma máquina, o sea un piso y no
el número del teléfono; la salvedad completa está en `ADR-08.10`—, así que **no es cero**. `D-32` límite 3 pide cero milisegundos
hasta que la acción principal es tocable. O sea que el contenido estático del recorte es lo
que la persona mira **en toda partida, siempre**, y no solo el día que el `import` falla. Se
escribe con ese peso: no es un mensaje de error, es la primera pantalla del juego.

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
   (`RES-62.5`), y `T-226` lo confirmó en disco: el árbol de npm del cliente quedó con **un
   nodo**. Si algún día `npm ls --omit=dev` muestra un segundo del lado del cliente, eso es un
   cambio de arquitectura y pasa por acá antes.
3. **Actualizar de versión es una decisión, no un mantenimiento.** El salto a la línea 4000
   (`RES-62.5`) se mira cuando salga de alfa **y** cuando alguien tenga un motivo; hasta
   entonces, la versión que anda es la que se queda. Precedente directo: `RES-62.3` y Phaser
   3.90.0 frente a la v4 con renderer reescrito. **Desde el 2026-09-18 el motivo existe y
   está escrito:** la línea 4000 trae el revert a MIT plano que 3001.x nunca recibió
   (`RES-70.3`). No alcanza para saltar hoy —un alfa no entra a un sitio publicado, y eso no
   se relaja porque haya aparecido una razón para quererlo— pero **el día que la 4000 sea
   estable, esta fila es la que pide el salto**, y no hay que volver a investigar por qué.

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

**Y un quinto caso, que `T-226` obligó a agregar: falla si hay un `kaplay(` sin su
`k.audioCtx.close()` inmediatamente después** (`ADR-08.2.1`, condición 4). Los otros cuatro
casos vigilan que la isla **no llame** a algo; este vigila que la isla **llame** a algo, que
es la forma más fácil de olvidarse. Sin esa línea, el segundo `AudioContext` queda vivo, el
`grep` de `ADR-04.10` sigue devolviendo sus dos resultados de siempre —el del motor está en
`node_modules/`, donde ese `grep` no mira— y nadie se entera hasta que un teléfono se queda
sin contextos. **Es el único de los cinco donde la ausencia de código es el defecto.**

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
suma el juego. **Los números con ✅ son cuentas cerradas; los ❓ son huecos con dueño; y el ⚠
que apareció el 2026-09-18 es un número real medido en la máquina equivocada**, que es una
tercera cosa y conviene que se vea como tal.

> **Enmendado el 2026-09-18 con las mediciones de `T-226`.** Tres filas dejaron de ser
> promesa: el peso de la isla, el reparto en chunks y el tiempo hasta jugable. **La vara
> también se rehízo**, que era lo primero que `ADR-08.1` pedía.

**La vara, medida sobre `npm run build` limpio y antes de instalar nada:**

| | JS de cliente de todo el sitio | Chunks |
|---|---|---|
| **Sin el motor** | **116,3 KB bruto · 50,9 KB gzip** | 27 |
| **Con la isla de humo del motor** | 298,4 KB bruto · 117,8 KB gzip | 28 |

Los "113 KB" que circulaban como número del sitio quedan enterrados acá: eran de un `dist/`
del 3 de septiembre, sin el ciclo 14. **El número del sitio hoy es 116,3 KB bruto / 50,9 KB
gzip en 27 chunks**, y esa es la vara contra la que se compara todo lo que venga.

| Concepto | Cuenta | Techo de contrato |
|---|---|---|
| ✅ **JS de la isla, gzip** | **medido: 182,1 KB bruto · 66,8 KB gzip** el chunk de la isla, con el humo mínimo (`T-226`) | **≤ 90 KB gzip.** **Margen: 23,2 KB gzip** para la isla entera, la lógica y el dato del nivel. Para dimensionarlo: el chunk más pesado del sitio hoy es `adivinar-el-tema` con 9,2 KB gzip — la isla tendría que ser dos veces y media el juego más grande que existe para romper el techo. **Y el motor no se puede achicar** (`ADR-08.1` condición 5): si el techo aprieta, se achica la isla o el dato |
| ✅ **El motor no se comparte con otras islas** | Vite podría meterlo en un chunk común | **Prohibido, y verificado en `dist/` el 2026-09-18:** el paquete vive en un solo chunk, cargado por **una sola página HTML** de las 152. Las otras 151 no pagan un byte. Se vuelve a verificar cada vez que cambie el reparto de chunks |
| ✅ **RAM de bitmap decodificado** | dos atlas + tileset (`CTR-15.6`), con la celda de **16 × 24 nativos** de `FIND-55` | **≤ 0,5 MB**, y es **independiente del DPR** por construcción: el atlas se carga a tamaño nativo y el escalado lo hace el dibujo. Con la celda nueva la cuenta de `CTR-15.6` da **≈ 0,12 MB**, o sea que el techo quedó holgadísimo — y se deja igual, porque un techo se baja cuando alguien lo mide, no cuando alguien lo estima |
| ✅ **Red, audio del tema** | `CTR-14`, sin cambios | **≤ 4 MB**, y cero si la cinta está apagada |
| ✅ **Red, efectos de sonido** | `CTR-17` | **0 bytes.** Se sintetizan |
| ✅ **Datos del nivel** | `CTR-16.1` | **≤ 24 KB** sin comprimir |
| ❓ **Batería y CPU en un teléfono viejo** | sería el único juego del sitio con un bucle a 60 fps corriendo minutos | **Sin medir.** Verificación manual del usuario, como el riesgo 6 del brief. No es gate (`D-09`), pero si el teléfono se calienta, el techo de cuadros baja a 30 y se anota acá |
| ❓ **El juego corriendo junto a la cinta** | un `AudioContext` vivo contra un `requestAnimationFrame` en gama baja | **Sin medir.** Va en la misma prueba de mano |
| ⚠ **Tiempo hasta jugable** | **medido: 114 ms** desde el `<head>` hasta el motor inicializado con la primera entidad agregada (`DOMContentLoaded` a 182 ms) | **Rótulo honesto: es escritorio, con el servidor de desarrollo en la misma máquina. No es el número del teléfono**, y en gama baja va a ser varias veces eso. **Vale como piso, no como resultado**, y por eso queda ⚠ y no ✅. Lo que sí cierra: `D-32` límite 3 pide **0 ms** y 114 ms ya no es cero, así que el rótulo estático de `ADR-08.2` **deja de ser una precaución** y pasa a ser lo que la persona mira en toda partida |
| ❓ **El `AudioContext` del motor en Safari de iOS** | `ADR-08.2.1`: nace `running` y se cierra en la línea siguiente | **Sin medir.** El `close()` está verificado en el navegador de `T-226`; iOS, donde el límite de contextos por página duele, no se probó. Misma prueba de mano que los otros dos |

**Latencia del toque, que es requisito y no medición:** `touch-action: none` sobre el área de
juego, listeners **no pasivos** solo donde hace falta cancelar el gesto, y **un control que
se mantiene apretado** — que el repo no tiene en ningún lado hoy. El primero que lo escriba
lo escribe bien: el estado se lee por `pointerdown`/`pointerup` con captura, nunca por
repetición de eventos.

---

## ADR-08.11 — Qué queda prohibido, en una lista para revisar

1. **Un segundo `AudioContext` vivo.** `ADR-07.10` punto 7. **El del motor es la excepción
   declarada de `ADR-08.2.1`** —no se puede impedir que nazca— y por eso la prohibición es
   sobre que **siga vivo**: sin el `void k.audioCtx.close()` en la línea de al lado, esto se
   incumple. Cero llamadas a la API de audio del motor, además. *[Ampliado el 2026-09-22 por
   `T-247`:]* **y un `kaplay()` sin `backgroundAudio: true` también lo incumple** — el
   nombre engaña: acá no enciende sonido, impide que el motor le haga `suspend()`/`resume()`
   al contexto ya cerrado cada vez que la pestaña se esconde y vuelve, que tira un
   `InvalidStateError` sin atrapar por vuelta (`ADR-08.2.1`, condición 5).
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
12. **Escribir "Kaplay: MIT" a secas**, en este documento, en una página de créditos o en un
    comentario. `RES-70`: es MIT con cláusula anti-IA, y el rótulo dice lo que hay adentro.
13. **Fichar la licencia de un paquete leyendo `master` o el campo `license` del
    `package.json`.** La regla de método de la cabecera: el tag, el tarball o el disco.

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
4. **De los tres huecos sin medir, uno se midió a medias y apareció uno nuevo.** El tiempo
   hasta jugable tiene número —114 ms, **de escritorio**— y eso alcanzó para cerrar la
   pregunta de diseño: no es cero, así que el rótulo estático manda. Siguen sin medir la
   batería en un teléfono viejo, la convivencia con la cinta, y ahora el `AudioContext` del
   motor en Safari de iOS (`ADR-08.2.1`). Ninguno bloquea —`D-09` sacó la velocidad de carga
   de los no negociables— pero se miden antes de publicar, no después.
5. **El sitio pasa a servir código de terceros que no es open source en el sentido estricto.**
   `kaplay@3001.0.19` lleva una restricción de campo de uso que ni OSI ni SPDX reconocen
   (`RES-70`). No cambia lo que el sitio hace ni lo que la gente ve; cambia lo que el sitio
   puede decir de sí mismo. **El día que alguien escriba una página de créditos o un archivo
   de licencias, esta es la línea que tiene que estar bien**, y sale de `ADR-08`, no de
   `npm view`.
6. **`RES-62.4` quedó refutada y la corrección viaja hacia arriba.** Una ficha verificada de
   buena fe sostuvo dos líneas de este documento durante dos días. No se arregla con más
   cuidado: se arregla con la regla de método de la cabecera, que cambia **qué archivo** se
   lee. Es lo transferible del asunto y por eso está arriba y no acá.
7. **Nada de esto habilita a empezar.** `BR-16`: sin `US-09` con criterio y piso, y sin dueño
   del arte de niveles, esto es un contrato esperando.

---

## Cómo se verifica esta enmienda

`arquitectura` no corre comandos (`D-12`), así que acá quedan escritos y los corre `revisor`,
`orquestador` o el hilo principal. Los tres primeros miran **este archivo**; el cuarto y el
quinto miran el repo y son los que importan el día que la isla exista.

```bash
# 1. Los ocho anclajes de la enmienda del 2026-09-18. Tienen que aparecer los ocho.
rg -n "RES-70|cláusula anti-IA|audioCtx\.close|no se tree-shakea|66,8 KB gzip|50,9 KB gzip|114 ms|nunca en la rama" Docs/ARQ/ARQ-motor-de-juego.md

# 2. El rótulo viejo sobrevive SOLO adentro de las citas de enmienda, que empiezan con ">".
#    Cualquier línea que no arranque con ">" y diga esto es un rótulo sin corregir.
rg -n "^[^>].*MIT, cero dependencias" Docs/ARQ/ARQ-motor-de-juego.md

# 3. La salida que no existe, tampoco fuera de su cita.
rg -n "^[^>].*se recorta uso de API" Docs/ARQ/ARQ-motor-de-juego.md
```

**Los dos de arriba devuelven exactamente una línea cada uno: la del propio comando**, que
vive en este bloque y se encuentra a sí mismo. **Un segundo resultado es el defecto** — ahí
hay un rótulo viejo suelto fuera de su cita de enmienda.

```bash
# 4. La línea de base del audio, la de `ADR-04.10`: exactamente dos resultados,
#    `contexto.ts` y `diagnostico-audio.ts`. Ojo: este grep NO ve el del motor,
#    que vive en node_modules. Por eso existe el caso 5 de `motor.test.ts`.
rg -n "new AudioContext|webkitAudioContext" src/lib src/scripts

# 5. El día que exista la isla, el auditor de `ADR-08.8`:
node --test src/lib/skayboy/motor.test.ts
```

**Y la que no se puede automatizar, que es la de la licencia:** cuando alguien cambie la
versión del motor, se abre el `LICENSE*` **del tag nuevo** —no de `master`, no del campo
`license`— y se compara contra `RES-70`. Si cambió, se ficha de nuevo y se vuelve a `ADR-08`
antes de tocar `package.json`.
