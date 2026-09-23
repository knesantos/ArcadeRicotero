# La compuerta de `ADR-08.1`, corrida: cuatro condiciones pasan, una falla, y aparecieron dos cosas que no estaban en la lista

> **De:** el hilo principal. **Para:** `arquitectura`. **Fecha:** 2026-09-18.
>
> Esto es `T-226` del ciclo 15, ejecutada entera. `ADR-08.1` dejó cinco condiciones escritas
> con su comando y su consecuencia, y dijo que no se afirmaba ninguna desde el documento
> porque `arquitectura` no corre comandos (`D-12`). **Acá están las cinco respuestas**, más
> dos hallazgos que la lista no estaba buscando y que igual aparecieron.
>
> **No toco `Docs/ARQ/`**, que es tu carpeta. Lo que sigue es el material para que enmiendes
> `ADR-08` vos.
>
> **Estado del árbol:** `kaplay@3001.0.19` quedó instalado y pineado en `package.json`. El
> humo se escribió, se corrió y **se retiró** — no quedó en el repo. `npm test` cierra en
> **578 en verde**, igual que antes de empezar.

---

## El tablero, de un vistazo

| # | Condición | Resultado | Con qué se probó |
|---|---|---|---|
| 1 | Entra en una isla de Astro con salida estática y el sitio sigue construyendo | ✅ **pasa** | `npm run build` con la isla adentro: 152 páginas. Y **dibuja de verdad en el navegador**, no solo compila |
| 2 | No usa `eval()` ni `new Function()` | ✅ **pasa** | `grep` sobre los tres bundles publicados: **cero coincidencias** |
| 3 | Trae sus propios tipos y `npm run check` pasa sin tocar `tsconfig.json` | ✅ **pasa** | `npm run check`: **0 errores**. `tsconfig.json` intacto |
| 4 | No trae licencia ajena adentro del paquete | 🔴 **falla, y por donde no se esperaba** | No hay nada vendorizado. **La que no es MIT es la licencia del motor mismo** — `RES-70`, `INV-61` |
| 5 | El peso real en el bundle no pasa el techo de `ADR-08.10` | ✅ **pasa, con una sorpresa** | **66,8 KB gzip** contra un techo de 90. Pero es el humo mínimo: **el motor no se tree-shakea** |

---

## 1. Las mediciones, con los números que hay que copiar a `ADR-08.10`

**La vara, rehecha como `ADR-08.1` pedía** — `npm run build` limpio, **antes** de instalar nada:

| | JS de cliente de todo el sitio | Chunks |
|---|---|---|
| **Antes del motor** | 116,3 KB bruto · **50,9 KB gzip** | 27 |
| **Con la isla del motor** | 298,4 KB bruto · 117,8 KB gzip | 28 |

Los "113 KB" que circulaban como número del sitio quedaron en **116,3 KB bruto / 50,9 KB
gzip**: la medición vieja era del 3 de septiembre, sin el ciclo 14.

**El chunk de la isla: 182,1 KB bruto / 66,8 KB gzip.** Margen contra el techo de 90:
**23,2 KB gzip** para toda la isla del juego, la lógica y los datos del nivel. Para
dimensionarlo: el chunk más pesado del sitio hoy es `adivinar-el-tema`, con 9,2 KB gzip. La
isla tendría que ser dos veces y media el juego más grande que existe para romper el techo.

**Lo que `ADR-08.10` da por cumplido y quedó verificado:** el motor **no se comparte**. Vive
en un solo chunk, cargado por **una sola página HTML**. Las otras 151 no pagan un byte.

### 🔑 El dato que cambia una premisa: el motor no se tree-shakea

`RES-62.5` fichó ~65 KB gzip y `ADR-08.1` condición 5 avisó, con razón, que eso era "de
import completo" y **no la medición que manda**. Bueno: la medición que manda dio **66,8 KB**
para un humo que importa el motor y dibuja **un rectángulo**. Es decir, **el import mínimo
pesa lo mismo que el completo** — un poco más, incluso, por el envoltorio de Vite.

**Consecuencia para tu contrato:** la salida que `ADR-08.1` condición 5 dejaba escrita
—*"se recorta uso de API hasta entrar"*— **no existe**. No hay API que recortar: usar menos
motor no baja el peso. Si algún día el techo de 90 KB se rompe, la única palanca es sacar
peso de la isla o del dato, nunca del motor. Conviene que esté dicho ahí y no se descubra el
día que aprieta.

### Y uno de los tres ❓ de `ADR-08.10` quedó medido

**Tiempo hasta jugable: 114 ms** desde el `<head>` hasta que el motor está inicializado y la
primera entidad agregada (`DOMContentLoaded` a 182 ms).

**Rótulo honesto:** es **escritorio, con el servidor de desarrollo en la misma máquina**. No
es el número del teléfono, y en gama baja va a ser varias veces eso. Vale como **piso**, no
como resultado. Lo que sí deja cerrado: `D-32` límite 3 pide 0 ms hasta que la acción
principal es tocable, y **114 ms ya no es cero**. El rótulo estático de `ADR-08.2` deja de
ser una precaución y pasa a ser lo que la persona mira sí o sí mientras el motor arranca.

---

## 2. 🔴 La condición 4, que falla por otro lado

La condición buscaba **código vendorizado con licencia propia adentro del paquete**. De eso
no hay nada: `node_modules/kaplay/` trae un solo `LICENSE.md`, cero dependencias, y el árbol
de npm del cliente quedó con **un nodo** — se audita leyendo una línea, tal como `ADR-08`
prometía.

**Lo que falla es la licencia del motor mismo.** El detalle completo está en `INV-61`
(`RES-70` … `RES-72`); el resumen:

- `kaplay@3001.0.19` **no es MIT**. Es MIT con un bloque agregado que prohíbe usar el
  software para **entrenar o mejorar modelos de aprendizaje automático**, prohíbe incluirlo
  en conjuntos de datos de entrenamiento, y amenaza con acción legal.
- **Su `package.json` declara `"license": "MIT"`.** El metadato contradice al archivo del
  mismo paquete, así que cualquier auditoría que lea el campo informa MIT y no ve nada.
- **La parte que más cambia la lectura (`RES-70.3`): el proyecto ya había sacado esa
  cláusula.** El revert a MIT plano es del 2025-05-11, pero ocurrió en `master` y en la línea
  `4000.x`, **no** en la rama de mantenimiento 3001.x — que se tagueó un mes después
  arrastrando la versión vieja. No es una postura del proyecto: es una rama que quedó atrás.
- **`RES-62.4` queda refutada**, y no por mala fe: consultó `.../kaplay/`**`master`**`/LICENSE`,
  donde la afirmación *es* cierta. Leyó bien el archivo equivocado. Ya está marcada en
  `INV-60` y la regla que deja está al final de `INV-61`: **una licencia se lee en el tag de
  la versión que se instala, nunca en la rama.**

### Por qué esto es tuyo y no se resuelve con `D-14`

`BR-15` consecuencia 1 hace de la licencia del motor **la única condición donde `D-14` no
aplica**. Acá no vale "si llega un reclamo se baja": hay que decidirlo antes.

Lo que sí conviene tener a la vista al decidir: **la restricción no toca el uso que este
sitio le da.** Importar el paquete sin modificarlo y servirlo en un sitio estático no entrena
nada ni mete el código en ningún conjunto de datos. Eso es lectura del texto —así lo rotuló
`investigador`, y no es consejo legal—, pero es la lectura evidente.

**Lo que sí queda tocado, pase lo que pase, es el rótulo.** `ADR-08` abre diciendo *"Kaplay
`3001.0.19`, MIT, cero dependencias"* y repite "MIT" en su tabla de finalistas. **Eso hay que
corregirlo aunque el motor se quede**, y no por trámite: este proyecto exige que un rótulo
diga la verdad sobre lo que hay adentro, y esa es la regla que sostiene todo el contenido del
sitio. Un `ADR` que rotula MIT algo que no lo es tiene exactamente el defecto que `D-14`
persigue.

### Las tres salidas, con su costo real

| | Salida | Qué cuesta |
|---|---|---|
| **A** | **Quedarse en `3001.0.19`** y corregir el rótulo: decir "MIT con cláusula anti-IA, no OSI", con `RES-70` al lado | Nada técnico: ya está medido y pasa las otras cuatro condiciones. Cuesta escribir la verdad en `ADR-08` |
| **B** | **Caer a LittleJS**, el repuesto declarado | Reescribir el humo y parte de la planificación. Y **el argumento del peso ya no lo sostiene**: LittleJS hoy mide **62 KB gzip** (`RES-71`), no los ~46 fichados — menos de 5 KB de diferencia. MIT limpio, con Box2D vendorizado bajo zlib, que es permisiva |
| **C** | Ir a `4000.0.0-alpha.27.1`, que **sí** es MIT plano | **Lo veta el propio `ADR-08`**: *"Un alfa no entra a un sitio publicado"*. Se nombra para descartarlo por escrito, no como opción |

**Mi lectura, que no es la decisión:** A. La restricción no alcanza a lo que hace este sitio,
B cuesta trabajo sin comprar casi nada, y lo que de verdad hay que arreglar —el rótulo— hay
que arreglarlo igual en las tres. Pero `BR-15` te puso esto en la mano a vos, y el tamaño que
tiene lo hace también del usuario.

---

## 3. Los dos hallazgos que la lista no buscaba

### 3.1 🔴 El audio del motor **no se apaga por opción**, contra lo que dice `ADR-08.2` punto 3

`ADR-08.2` punto 3 dice *"el audio del motor, apagado y prohibido"*, porque un segundo
`AudioContext` es lo que `ADR-07.10` punto 7 prohíbe con nombre.

**Medido: no hay con qué apagarlo.** Las **29 opciones** del init de Kaplay son `width`,
`height`, `scale`, `stretch`, `letterbox`, `debug`, `debugKey`, `font`, `pixelDensity`,
`crisp`, `canvas`, `root`, `background`, `texFilter`, `logMax`, `logTime`, `hashGridSize`,
`touchToMouse`, `loadingScreen`, `backgroundAudio`, `gamepads`, `buttons`, `maxFPS`, `focus`,
`global`, `plugins`, `burp`, `tagsAsComponents`, `spriteAtlasPadding`. **Ninguna toca el
audio** (`backgroundAudio` es otra cosa: si sigue sonando al perder foco).

En el bundle, el init hace `let C = sa(); a.audio = C;` **incondicionalmente**, y `sa()` es
`new (window.AudioContext || window.webkitAudioContext)`. Verificado en el navegador: al
llamar `kaplay()` aparece **un `AudioContext` en estado `running`** — ni siquiera
`suspended`—, sin gesto de la persona.

**Y hay mitigación, también verificada.** El contexto queda expuesto como `k.audioCtx`, y
cerrarlo a mano justo después del init funciona: queda en `closed` **y el motor sigue
dibujando**. O sea:

```ts
const k = kaplay({ global: false, canvas, /* … */ });
void k.audioCtx.close();   // el apagado que ninguna opción ofrece
```

**Lo que te pido:** que `ADR-08.2` punto 3 deje de decir "apagado" como si fuera una opción y
pase a decir **qué línea hay que escribir**, porque hoy un lector razonable busca el flag y no
lo encuentra. Y que `T-247` sume el caso a `motor.test.ts`: hoy ese test falla si aparece
`kaplay(` sin `global:false` — que se caiga también si falta el cierre del contexto. El
contexto existe unos milisegundos igual, así que si eso te parece demasiado para
`ADR-07.10` punto 7, decilo vos: la excepción es tuya, no mía.

### 3.2 `islas.test.ts` se quedó ciego hoy, y `T-241` llega justo

El auditor de islas dice, textual, en su propio comentario: *"un paquete de `node_modules` es
problema del empaquetador, y **este proyecto no tiene ninguno del lado del cliente**"*.

**Esa premisa dejó de ser cierta hoy.** Con el humo puesto, `npm test` no dijo una palabra del
`import kaplay from 'kaplay'`: ninguna prueba mira paquetes de npm en islas. El agujero está
previsto —`T-241` trae la lista blanca de `ADR-08.8`— pero conviene saber que **entre hoy y
esa tarea, cualquier isla puede importar cualquier paquete y nadie se entera.**

Lo que sí funcionó, y vale anotarlo: los **únicos** dos tests que se pusieron rojos con el
humo fueron los del **censo** —`rutas-sonoras`—, porque la página nueva no estaba declarada.
El candado B hizo exactamente lo suyo: una pantalla no entra sin que alguien decida qué hace
la cinta ahí. Al retirar el humo volvieron solos a verde.

---

## 4. Lo que quedó verificado de `ADR-08.2`, de paso

Dos de los cuatro apagados se probaron en el navegador y **funcionan**:

- **`global: false`** — cero nombres de Kaplay en `window` (se buscaron `add`, `rect`, `pos`,
  `color`, `loadSprite`, `vec2`, `onUpdate`: ninguno).
- **`canvas: <el nuestro>`** — un solo `<canvas>` en el DOM, el que ya estaba en el HTML, a
  240 × 144. El motor **no creó el suyo** ni lo pegó al `body`, así que `D-41` punto 3 se
  sostiene.

El tercero es el del audio, que es `§3.1`. El cuarto —la fuente— no se ejercitó: el humo no
dibuja texto.

---

## 5. Lo que necesito de vos para seguir

1. **La decisión de la condición 4** (A, B o C), que destraba todo lo que depende del motor:
   `T-241`, `T-247`, `T-248`.
2. **`ADR-08` con el rótulo corregido**, diga lo que diga la decisión.
3. **`ADR-08.2` punto 3 reescrito** con la línea del cierre, y `ADR-08.1` condición 5 con la
   salida imposible sacada (no hay API que recortar).
4. **`ADR-08.10`** con los números de `§1` puestos: el techo medido, la vara nueva, y el
   tiempo hasta jugable dejando de ser ❓ para pasar a "medido en escritorio, falta teléfono".

Mientras tanto no escribo una línea de la isla, que es lo que la compuerta manda.
