# ARQ — La solución grabada: la máquina juega sola, y juega el mismo juego que el teléfono

> Rol dueño: `arquitectura`. **Produce: `ADR-09`** (`ADR-09.1` … `ADR-09.5`) **y `CTR-18`**
> (`CTR-18.1` … `CTR-18.12`). Tarea `T-263` del ciclo 16.
>
> **Consume:** `ORQ-plan-ciclo-16.md` (§0, §1, §2.1, §3, §6), `D-12`, `D-38`, `D-40`, `D-43`,
> `BR-01`, `BR-23` (puntos 1 y 4), `BR-24` (punto 3), **`BR-25`** (las seis condiciones),
> `US-09`, `ADR-08` (`08.2`, `08.3`, `08.6`, `08.9`, `08.10`, `08.11` punto 11), `CTR-07.7`,
> `CTR-16` (`16.1`, `16.5`, `16.6`, `16.7`, `16.8`), `CTR-17`, `FIND-58`, `UX-28 §3`,
> `UX-29 §3` y `§4`,
> `Docs/SUGERENCIAS/PRD-para-arquitectura-el-nivel-declara-su-segunda-solucion.md` (el pedido
> de `producto` que esto contesta, en sus puntos 1 y 2), `src/lib/skayboy/mundo.ts`,
> `src/lib/skayboy/niveles.ts`, `src/scripts/partida-skayboy.ts`,
> `src/pages/juegos/skayboy-y-poligirl.astro`, `src/data/skayboy.json`,
> `src/data/_schema/skayboy.schema.json`, `src/lib/esquemas.test.ts`,
> `src/lib/skayboy/mundo.test.ts`.
>
> **Se escriben en paralelo y este documento no depende de lo que digan:** `BR-29` (`T-262`,
> `producto`: qué prueba la máquina, qué prueba el pulgar y la tolerancia mínima por escalón),
> `CTR-16.10` (`T-264`, los mecanismos) y `UX-31` (`T-265`, los seis niveles). Donde hace falta
> algo de ellos está nombrado como hueco con dueño, en `CTR-18.12`.
>
> **Enmendado el 2026-09-22, en la pasada de coherencia de la ráfaga 1: de `CTR-16.10` sí
> dependía, y en un punto lo contradecía.** `CTR-18.8` fijó por su cuenta la regla de atribución
> de la paridad —y le negaba la apertura a quien empuja una caja sobre una placa— cuando esa
> regla es de `CTR-16.10.5` y `CTR-16.10.7`. Se alineó `CTR-18.8` con ellos, y de paso
> `CTR-18.6` (regla 11, las cajas, que `CTR-16.10` le pide a este test) y `CTR-18.12` (dos huecos
> que `CTR-16.10` ya cerró). Consume además `CTR-16.10` (`16.10.2`, `.5`, `.7`, `.10`, `.11`),
> `UX-31 §2` a `§4` y `BR-29` (f).
>
> **Enmendado el 2026-09-23, cierre de la ráfaga 1: `BR-29` contestó las dos preguntas que este
> documento le dejaba.** Punto 1: (a) es del teléfono y (b), (c), (d) y (f) de la traza. Punto 3:
> la tolerancia mínima es 10, 6 y 4 cuadros por escalón. Punto 4: `verificaciones.solo` se
> retira. Cambian, marcados donde pasó: el estado de `ADR-09`, su punto 3 y `ADR-09.3` entero
> (se toma la salida condicionada que dejaba escrita); el estado de `CTR-18`, `CTR-18.2`,
> `CTR-18.4`, la regla 8 y la 11 de `CTR-18.6`, `CTR-18.8` (el `por: null` de dos a la vez,
> `CTR-16.10.7`), `CTR-18.9` y `CTR-18.12`. **Consume además:** `BR-29` puntos 1, 3 y 4,
> `Docs/SUGERENCIAS/PRD-para-arquitectura-verificaciones-solo-se-retira.md` y `CTR-16.7`
> enmendado.
>
> **Medido por el hilo principal el 2026-09-22** (lecturas del repo y una corrida, no fichas
> `RES-`): `paso()` corre a **~217.000 cuadros por segundo** sobre `NIV-01` con `dt = 1/60`
> (`ORQ-plan-ciclo-16.md §1`); `paso()` parte cada llamada en `n = ⌈dt / SUBPASO_SEG⌉`
> subpasos iguales de `h = dt / n` (`mundo.ts:384-386`), con `SUBPASO_SEG = 1/120` y
> `PASO_MAXIMO_SEG = 1/20` (`mundo.ts:95` y `:101`), **así que dos `dt` distintos integran con
> `h` distinto y dan trayectorias distintas**; y la isla llama `paso(mundo, …, k.dt())` una vez
> por tic del motor (`partida-skayboy.ts:343`).
>
> **Calculado a mano, no medido.** `arquitectura` no corre comandos (`D-12`). Dos cuentas de
> este documento salen de leer `mundo.ts` y hacer la aritmética: el vértice del salto en
> `ADR-09.1` y la traza de `NIV-01` en `CTR-18.9`. Las confirma `T-267` al pegar el ejemplo.
> **Si la corrida dice otra cosa, manda la corrida** y la sección se enmienda con la marca
> puesta.
>
> **Regla de escritura de este documento, hermana de la de `FIND-55` para los píxeles: toda
> duración dice si son _cuadros_ o _segundos_.** Un cuadro es 1/60 s (`ADR-09.1`) y nada más.
> "Tolerancia 4" sin unidad es justo el número que se copia mal.

---

## ADR-09 — La máquina prueba cada nivel repitiendo una partida grabada, a paso fijo, y el teléfono corre ese mismo paso

- **Fecha:** 2026-09-22.
- **Estado:** **aceptada.** No se apoya en ningún hecho externo: todo lo que decide sale de
  `mundo.ts`, de la isla y de la medición del hilo principal. Lo que queda abierto son dos
  valores que no son de este documento (`CTR-18.12`): **los números de tolerancia**, que pone
  `BR-29`, y **los sucesos de la cuenta de paridad**, que definen `CTR-16.10` y `T-272`
  —*enmendado el 2026-09-22: este segundo ya lo cerró `CTR-16.10.7`, y `CTR-18.8` lo cita*—.
  *Enmendado el 2026-09-23: el primero lo cerró `BR-29` punto 3 (10, 6 y 4 cuadros). No queda
  ningún valor abierto.*
- **Para quién es:** para el hilo principal, que escribe el solucionador (`T-266`), graba la
  traza y pasa la isla a paso fijo (`T-267`), y diseña los niveles (`T-277`); para `producto`,
  que escribe `BR-29` contra esta definición de tolerancia; para `revisor`, que tiene que poder
  decir si una traza vale sin preguntarle nada a nadie.
- **Qué NO es:** no es el solucionador —cómo busca es de `T-266`—, no es el diseño de los niveles
  (`UX-31`) y **no decide qué prueba el pulgar**: eso es `BR-29`. Tampoco autoriza a marcar un
  nivel como `listo`: `CTR-16.7` sigue pidiendo la pasada de dos personas, `deDos`
  (`ADR-09.3`). *(Enmendado el 2026-09-23: decía "las dos pasadas de una persona", `deDos` y
  `solo`; `solo` se retiró.)*

### La decisión, en cinco líneas

1. **Paso fijo de 1/60 s** en la isla, en la prueba y en el solucionador, con un acumulador y un
   tope de **3 cuadros por tic** (`ADR-09.1`).
2. **La traza vive en un archivo propio**, `src/data/skayboy-soluciones.json`, que escribe una
   máquina y **no llega nunca al navegador** (`ADR-09.2`).
3. **"Se pasa solo" lo dice la traza en cada build, y `verificaciones.solo` se retira.**
   `deDos` no cambia (`ADR-09.3`). *(Enmendado el 2026-09-23. Decía que `solo` dejaba de decir
   "se pasa solo" y pasaba a decir "una persona sola lo jugó en el teléfono"; `BR-29` no le
   dejó al pulgar nada del modo solo, y la salida que `ADR-09.3` tenía escrita para ese caso
   se tomó.)*
4. **Si alguien afina una constante y una traza deja de valer, el test cae con el nombre del
   nivel y un comando la regraba.** Nada se regraba solo (`ADR-09.4`).
5. **La tolerancia no se guarda.** El test verifica que alcanza el mínimo de `BR-29`; el número
   exacto lo imprime el script (`ADR-09.5`).

### ADR-09.1 — El paso fijo: 1/60 s, con acumulador y tope de tres cuadros

**El problema, con un número.** `paso()` integra con Euler semi-implícito en subpasos de
`h = dt / n`. El salto sube mientras la velocidad es negativa, y la altura del vértice depende
de `h`: con `GRAVEDAD = 900` e `IMPULSO_SALTO = 270` el cálculo continuo da 40,5 px nativos, y
el discreto da **≈ 40,5 − 135 · h**. *(Cuenta sobre `mundo.ts:343-354`, no medición.)*

| Tic del motor | `n` | `h` | Vértice del salto |
|---|---|---|---|
| 1/60 s exacto | 2 | 1/120 s | **39,38 px nativos** |
| 16,5 ms | 2 | 8,25 ms | 39,39 px nativos |
| 16,9 ms | 3 | 5,63 ms | **39,74 px nativos** |
| 1/90 s (pantalla de 90 Hz) | 2 | 1/180 s | 39,75 px nativos |

Un teléfono a 60 Hz cuyo tic tiembla un poco para cada lado de 16,67 ms salta, según cómo le
vinieron los tics, entre 39,4 y 39,7 px. Es poco. **Y es exactamente la clase de poco que da
vuelta un borde de la traza**: un salto grabado en el último cuadro que todavía pasa una
cornisa pasa en la máquina y no pasa en la mano, o al revés. Con paso variable, una traza
ganadora es una afirmación sobre otro juego. Es el riesgo 1 de `ORQ-plan-ciclo-16.md §6`.

**La decisión.**

- **`CUADRO_SEG = 1/60`**, exportado desde `mundo.ts` y **desde ningún otro lado**. Lo importan
  la isla, `soluciones.test.ts` y el solucionador. `paso()` sigue aceptando cualquier `dt`
  —`mundo.test.ts` lo usa con 5 s para probar el tope—; lo que se fija es que **los tres que
  juegan una partida lo llaman siempre con `CUADRO_SEG`**.
- **La isla deja de pasarle `k.dt()` a `paso()`** y pasa a un acumulador. El reloj sigue siendo
  el del motor (`ADR-08.11` punto 11: nada de `setInterval`); lo que cambia es que el tiempo
  que llega se reparte en cuadros enteros:

  ```ts
  import { CUADRO_SEG, PASO_MAXIMO_SEG, paso /* … */ } from '../lib/skayboy/mundo.ts';

  /** Cuántos cuadros puede ponerse al día un tic: 3, que es `PASO_MAXIMO_SEG` dicho en cuadros. */
  const TOPE_POR_TIC = Math.round(PASO_MAXIMO_SEG / CUADRO_SEG);
  /** Medio cuadro de fase: el temblor del tic no duplica ni saltea cuadros (ver abajo). */
  const FASE = CUADRO_SEG / 2;

  let acumulado = FASE;
  k.onUpdate(() => {
    acumulado += k.dt();
    const mandos = /* una sola lectura de las teclas por tic, como hoy */;
    let cuadros = 0;
    while (acumulado >= CUADRO_SEG && cuadros < TOPE_POR_TIC) {
      atender(paso(mundo, mandos, CUADRO_SEG));
      acumulado -= CUADRO_SEG;
      cuadros += 1;
    }
    // Lo que no entró en el tope no se simula: el mundo no recupera el tiempo que el teléfono
    // estuvo trabado (`mundo.ts:96-100`).
    if (acumulado >= CUADRO_SEG) acumulado = FASE;
  });
  ```

  Es un boceto del contrato, no el código: nombres y forma son de `T-267`. Lo que no se negocia
  son tres cosas —el único `dt` que recibe `paso()` es `CUADRO_SEG`, hay tope, y lo que sobra
  del tope se tira—.

**Por qué 1/60 y no otro número, contra las dos constantes que ya existen:**

1. **1/60 = 2 × `SUBPASO_SEG`, exacto.** `paso(mundo, m, 1/60)` hace `n = 2` subpasos de
   `h = 1/120`, que es `SUBPASO_SEG` sin redondeo: dividir por dos es exacto en punto flotante.
   La garantía escrita en `mundo.ts:94` —*"a 1/120 nada cruza medio tile en un paso"*— queda
   cierta tal como está escrita, no aproximadamente.
2. **`PASO_MAXIMO_SEG` = 1/20 = 3 cuadros, exacto.** El tope del acumulador no es un número
   nuevo: es la promesa que el mundo ya hacía —nunca avanzar más de 1/20 s entre dos dibujos—
   dicha en cuadros. Por eso se escribe como `Math.round(PASO_MAXIMO_SEG / CUADRO_SEG)` y no
   como un `3` suelto: si alguien mueve una de las dos constantes, el tope la sigue.
3. **Es la unidad que ya habla el repo.** `mundo.test.ts:33` corre a `CUADRO = 1/60`; la
   medición de `§1` del plan también; y `BR-29` va a fijar la tolerancia en cuadros. Un cuadro
   de la traza, un cuadro del test y un cuadro de `BR-29` son la misma cosa.
4. **En una pantalla de 60 Hz da un cuadro por tic.** Que es lo que se ve.

**El tope y la espiral de la muerte.** La espiral clásica —simular cuesta más que el tiempo
simulado, el acumulador crece, cada tic simula más— **acá no puede venir de la CPU**: a 217.000
cuadros por segundo, tres cuadros cuestan unos 14 µs. Viene de otro lado: la pestaña que se
escondió y volvió, un teléfono que se trabó medio segundo. El tope existe por la misma razón
que existía `PASO_MAXIMO_SEG`: **un cuerpo que avanza medio segundo de golpe con la tecla
apretada hizo algo que la persona no vio.** Si el teléfono no llega a 20 tics por segundo, el
juego se pone en cámara lenta en vez de saltearse la física. Es lo honesto.

**El medio cuadro de fase.** El tic del navegador no llega cada 16,67 ms exactos. Si el
acumulador arranca en cero, en una pantalla de 60 Hz queda justo sobre el umbral y el temblor
lo hace correr cero cuadros en un tic y dos en el siguiente: un tirón que se ve. Arrancando en
medio cuadro, **un temblor de hasta medio cuadro para cada lado no cambia la cuenta**: un
cuadro por tic, siempre. Es aritmética, no medición.

**Tres cosas que el paso fijo arrastra y conviene decir:**

- **Las teclas se leen una vez por tic** y valen para todos los cuadros de ese tic. En un
  teléfono que dibuja a 20 tics por segundo, cada tic corre tres cuadros con el mismo mando, así
  que **un borde puede caer hasta 2 cuadros antes** de cuando lo marcó el dedo; a 30 tics, hasta
  1. **Eso es exactamente lo que mide la tolerancia** (`ADR-09.5`), y le deja a `BR-29` un piso
  técnico: con menos de 2 cuadros en un escalón, un teléfono lento juega un nivel distinto del
  que probó la máquina. Va dicho en el traspaso a `producto`.
- **No se interpola el dibujo.** En una pantalla de 120 Hz cada estado del mundo se dibuja dos
  veces. Con píxel entero (`ADR-08.3`, `dibujarCuerpo` redondea la posición) la interpolación
  no compraría nada visible y le agregaría a la isla un estado que no está en el mundo.
- **El reloj de la partida pasa a ser tiempo de juego**: `mundo.tiempo` suma cuadros de 1/60 s
  y no cuenta lo que el tope tiró. No toca nada hoy; toca la conversación del ciclo 17 sobre
  cuánto cuesta el reloj (`UX-29 §4`, `BR-27`). **La cinta no se entera**: el tema sigue en el
  reloj del `AudioContext` (`ADR-08.9`, `ADR-08.11` punto 11), que nunca estuvo sincronizado
  con el juego ni tiene por qué.

**La guarda.** `src/lib/skayboy/motor.test.ts` —que ya lee el fuente de la isla— suma un caso:
**falla si la isla llama a `paso(` con un tercer argumento que no sea `CUADRO_SEG`, o si no
aparece el tope.** Rojo a mano: volver a poner `k.dt()` en la llamada.

| | Opción | Por qué sí / por qué no |
|---|---|---|
| ✅ | **Acumulador propio a 1/60 s, tope de 3 cuadros por tic, medio cuadro de fase** | La isla, la prueba y el solucionador llaman a la misma función con el mismo `dt`: la física es una sola, bit a bit |
| ✕ | **Seguir con `k.dt()`** | Es el estado de hoy, y la tabla de arriba es el motivo: `h` cambia tic a tic y con él el vértice de cada salto. La máquina probaría una física parecida |
| ✕ | **`maxFPS: 60` en el init de Kaplay, y seguir con `k.dt()`** | Limita cuántas veces se dibuja, no cuánto dura un tic: el `dt` sigue temblando alrededor de 1/60 y `n` y `h` tiemblan con él. Parece arreglarlo y no lo arregla |
| ✕ | **Usar un paso fijo que traiga el motor** | Si Kaplay lo trae, no está fichado — y no hace falta ficharlo, porque se descarta igual: la frecuencia la elegiría el motor, y `mundo.ts` existe justamente para no depender de él (sus razones 1 y 2). Un cambio de versión (`ADR-08.6`) o la salida a LittleJS movería la física de todos los niveles grabados |
| ✕ | **1/120 s** (un subpaso por cuadro) | La física sería la misma —mismo `h`—, pero la traza el doble de larga y la tolerancia en una unidad que no es la del ojo. Y en un teléfono de 60 Hz cada tic correría dos cuadros con el mismo mando: la máquina probaría bordes en medios cuadros que ningún pulgar en esa pantalla puede dar. Duplica y no compra nada |
| ✕ | **1/30 s** | En una pantalla de 60 Hz, un tic sí y uno no quedaría sin cuadro: el mundo se movería a tirones. Y el mando tendría la mitad de resolución |
| ✕ | **Grabar el `dt` de cada tic junto con la traza** | Probaría una corrida de un teléfono, no el juego. Dos teléfonos no dan los mismos tics |

### ADR-09.2 — Dónde vive la traza: en un archivo propio, y el navegador no la ve nunca

**La decisión.** Las trazas viven en **`src/data/skayboy-soluciones.json`**, con su schema en
**`src/data/_schema/skayboy-soluciones.schema.json`** (`CTR-18`). `src/data/skayboy.json` no se
toca, `CTR-16` sigue en `contratoVersion: 1`, y **`skayboy.schema.json` no cambia por esta
tarea**.

**Por qué afuera del nivel, y no adentro, que era la lectura natural del plan:**

1. **El navegador no la ve por construcción, no por cuidado.** La página hace
   `import datos from '../../data/skayboy.json'` y siembra ese banco, con los `listo`, en un
   `<script type="application/json">` (`skayboy-y-poligirl.astro:32`, `:48-51`, `:192`). Con la
   traza adentro de cada nivel, la página tendría que **acordarse de sacarla** antes de sembrar,
   y un paso que hay que acordarse de dar necesita su guarda. Con la traza en otro archivo, la
   página no la importa y no hay nada que sacar. **El defecto que el archivo aparte hace
   imposible es el que nadie vería**, que es el mismo argumento con el que `CTR-16.4` eligió un
   mapa y no un arreglo.
2. **Lo escribe una máquina, y `skayboy.json` lo escribe una persona.** `skayboy.json` está
   formateado a mano: las entradas de la leyenda y de `personajes` van en una línea cada una,
   las grillas alineadas. Un script que regrabe una traza adentro de ese archivo tiene dos
   salidas y las dos son malas: reescribirlo entero con `JSON.stringify`, y el primer regrabado
   es un diff de cien líneas en el archivo que diseña niveles; o editar texto adentro de un JSON,
   que es frágil. **Con dos archivos, cada uno tiene un solo tipo de autor.**
3. **`CTR-16` no sube de versión y `skayboy.schema.json` queda quieto.** El plan ponía a `T-267`
   y `T-272` en fila por ese schema (`§3`). Esa fila se afloja.
4. **El techo de 24 KB de `CTR-16.1` sigue midiendo lo que viaja.** Ese número es del
   presupuesto del teléfono (`ADR-08.10`); con las trazas adentro contaría bytes que nunca
   llegan a ningún teléfono.

**Lo que se paga, y cómo:** dos archivos que tienen que coincidir —un nivel sin traza, una traza
de un nivel que ya no existe—. Lo caza `soluciones.test.ts`, regla 1 de `CTR-18.6`, con el
`id` en el mensaje. **Lo que no hace falta pagar:** un hash de la grilla adentro de la solución.
La traza se vuelve a jugar contra la grilla de hoy en cada build; si alguien toca la grilla y la
traza sigue ganando, sigue siendo una prueba válida del nivel de hoy.

**Qué le llega al navegador, entonces:** exactamente lo mismo que antes de este ADR. La página
siembra `skayboy.json` con los `listo` (`CTR-16.8`), la isla lee ese `<script>` y nada más.
Ni el archivo de soluciones, ni el módulo que las lee, ni el solucionador entran a ninguna
página ni a ninguna isla (`CTR-18.11`, y regla 10 de `CTR-18.6`).

| | Opción | Por qué sí / por qué no |
|---|---|---|
| ✅ | **Archivo propio, `src/data/skayboy-soluciones.json`** | Las cuatro razones de arriba |
| ✕ | **Adentro de cada nivel, en `skayboy.json`** | Es lo que el plan daba por hecho. Obliga a la página a filtrar antes de sembrar; hace que un script reescriba el archivo que se diseña a mano; sube `CTR-16` a versión 2 y toca un schema que `T-272` tiene en fila; y le carga al techo del teléfono bytes que no viajan |
| ✕ | **Un archivo por nivel** | `esquemas.test.ts` empareja dato y schema por nombre (`esquemas.test.ts:59-70`): seis archivos son seis schemas o un caso especial. Un mapa en un solo archivo, además, hace imposible tener dos soluciones para el mismo nivel |
| ✕ | **No grabar nada: que el test busque la solución en cada `npm test`** | Una búsqueda cuesta segundos por nivel y una repetición milisegundos (`§1` del plan). Una búsqueda puede no converger (`§6`), y lo haría adentro del build. Y lo peor: **la prueba cambiaría sola cuando cambia la física**, sin un diff que lo muestre. `BR-25` (b) pide el camino **escrito**, *"así se hace"*, no recalculado |
| ✕ | **Una constante adentro del código del test** | Es dato en el código (`CLAUDE.md`), y un script que escribe TypeScript es peor que uno que escribe JSON |

### ADR-09.3 — Qué significan desde ahora `verificaciones.solo` y `verificaciones.deDos`

> **Enmendado el 2026-09-23 (cierre de la ráfaga 1): `solo` se retira, y la salida que esta
> sección dejaba escrita es la que quedó.** La condición era: *"si `BR-29` no le deja al pulgar
> nada del modo solo, `verificaciones.solo` es un booleano que nadie tiene motivo para escribir,
> y se retira en `CTR-16` versión 2"*. `BR-29` punto 1 le da (b), (c) y (d) enteras a la traza y
> el punto 4 lo retira, con un motivo que acá no estaba: la única sensación que el pulgar podía
> aportar al modo solo —que nada pida precisión de un cuadro— ya es un número, la tolerancia
> mínima por escalón (punto 3). **Queda un solo booleano, `deDos`, y `CTR-16.7` lo escribe**
> (enmendado el mismo día, con el fragmento de schema para pegar). Abajo, el texto del 22 sigue
> entero y marcado donde dejó de valer: es el registro de por qué `solo` vivió un día con otro
> sentido.

`CTR-16.7` puso dos booleanos que escribe **el que jugó**, y los dos querían decir "se pasa":
de a dos, y solo. Desde que existe la traza, **"se pasa solo" lo prueba una máquina en cada
build.** Un booleano escrito a mano que diga lo mismo es un segundo lugar que afirma lo mismo
que el primero, y dos lugares que dicen lo mismo **son un lugar donde se van a contradecir**
(`FIND-58`). Entonces cambia lo que dice el booleano, no lo que prueba la traza:

| | Lo que decía (`CTR-16.7`) | Lo que dice desde `ADR-09` | Quién |
|---|---|---|---|
| **"Se pasa solo"** (`BR-25` b, c, d) | `verificaciones.solo: true` | **Se deriva, no se guarda**: la traza de uno gana, con una columna por cuadro, sin que nadie vuelva a la entrada y sin que el que espera se mueva (`CTR-18.6`) | `soluciones.test.ts`, en cada build |
| **`verificaciones.solo`** | "lo jugaron solo" | **Se retira** (`BR-29` punto 4, `CTR-16.7` enmendado el 2026-09-23). *El 22 decía: "Una persona sola lo jugó en un teléfono, con un dedo por vez, y se deja jugar": la mitad del pulgar del modo solo, lo que `BR-29` le deje. `BR-29` no le dejó nada* | nadie |
| **`verificaciones.deDos`** | "lo jugaron de a dos" | **Igual que antes**: dos personas a la vez en un teléfono lo terminaron. `BR-25` (a) lo dice con todas las letras: *"verificado jugándolo, no leyéndolo"* | escrito a mano por los que jugaron |
| **Tolerancia y paridad** | no existían | **Se derivan, no se guardan** (`ADR-09.5`, `CTR-18.8`) | `soluciones.test.ts` |

**Qué hace falta, entonces, para que un nivel sea `listo`:** lo que exige el schema —**`deDos`
en `true`** si `estado` es `listo`, `CTR-16.7`— más lo que exige `CTR-18.6`, que vale **para
todo nivel del banco, esté en `borrador` o en `listo`**. Un nivel en `borrador` sin traza que
gane no entra al banco: se diseña con la prueba en la mano, que es la idea del ciclo (`§0` del
plan). *(Enmendado el 2026-09-23: decía "los dos booleanos en `true` [...] `CTR-16.7`, sin
tocarlo". `CTR-16.7` se tocó: pide uno.)*

**La condición que deja esto abierto a `BR-29`, dicha antes de que llegue:** si `BR-29` no le
deja al pulgar **nada** del modo solo —si decide que (b), (c) y (d) son enteras de la máquina y
que el "se siente bien" se prueba solo de a dos—, entonces `verificaciones.solo` es un booleano
que nadie tiene motivo para escribir, y **se retira en `CTR-16` versión 2**. No se deja un
campo vacío de sentido esperando a que alguien lo llene por costumbre. **Se cumplió el
2026-09-23** (`BR-29` puntos 1 y 4): se retira en la versión 2, la misma de `CTR-16.10`, y lo
pega `T-272` (`CTR-16.10.9` paso 6).

**Un límite que no se arregla acá y se dice:** un booleano no sabe de qué grilla habla. Si
alguien toca la grilla después de la pasada del pulgar, la traza se entera sola en el build
siguiente y el booleano no. **Regla de oficio, no de máquina:** el que toca la grilla de un
nivel pone `deDos` en `false` *(decía "sus dos booleanos"; enmendado el 2026-09-23)*. Hacerlo
de máquina pediría guardar un hash de la grilla en `verificaciones`, que es un campo nuevo en
`CTR-16` para un problema que hoy tiene un nivel.

| | Opción | Por qué sí / por qué no |
|---|---|---|
| ✅ | **Retirar `solo`: "se pasa solo" es la traza, y la única pasada escrita a mano es `deDos`** *(elegida el 2026-09-23, cuando `BR-29` contestó)* | Cada cosa se dice en un solo lugar, y el único booleano que queda dice lo único que una máquina no puede decir: que dos personas lo jugaron a la vez |
| ✕ | **`solo` pasa a ser la pasada del pulgar; "se pasa solo" se deriva de la traza** *(era la elegida el 2026-09-22)* | Dependía de que `BR-29` le dejara al pulgar una mitad del modo solo, y no se la dejó: la precisión, que era lo único que un pulgar podía decir, es un número desde `BR-29` punto 3 |
| ✕ | **Dejar `solo` diciendo "se pasa solo", escrito a mano** | Es `FIND-58` otra vez: el booleano en `true` y la traza en rojo —o al revés— es una contradicción que el archivo deja escribir |
| ✕ | **Que el script escriba `solo: true` cuando la traza gana** | Es guardar un derivado (`CTR-07.7`): queda viejo en cuanto alguien afina una constante. Y firma en nombre de una persona algo que hizo una máquina |
| ✕ | **Sacar `solo` de `CTR-16` el 2026-09-22, sin esperar** | Obligaba a `CTR-16` versión 2 y a tocar `skayboy.schema.json` y `CTR-16.7` mientras `T-264` y `T-272` los tenían abiertos, **antes de que `BR-29` dijera si el modo solo tenía una mitad de pulgar**. Por eso quedó como salida condicionada; el 23 la condición se cumplió y es la primera fila |

### ADR-09.4 — Qué pasa cuando alguien afina la gravedad

Va a pasar, y está planificado que pase: afinar la gravedad y la velocidad es parte de la
partida en el teléfono (`ORQ-plan-ciclo-16.md §4` punto 3). **La respuesta es que el build lo
dice, con nombre, y un comando lo arregla — pero el comando lo corre una persona.**

1. **El test cae nombrando el nivel, la regla y el cuadro.** Ejemplos de mensaje en
   `CTR-18.6`. Como la traza tiene que ganar **exactamente en su último cuadro**
   (`CTR-18.5`), cualquier constante que cambie la partida la pone en rojo: si ahora gana
   antes, sobran cuadros; si gana después o no gana, faltan. **Lo que dispara el rojo es que la
   partida cambió, no que una constante cambió** — y es lo que importa.
2. **`node scripts/resolver-niveles.mjs --regrabar`** vuelve a grabar **solo los niveles en
   rojo**; `--regrabar NIV-03` uno solo; `--regrabar --todos` todos. Si la traza vieja sigue
   ganando pero antes, el script **la recorta** hasta el cuadro de la victoria y vuelve a medir
   la tolerancia; solo si no gana, o la tolerancia quedó corta, **busca de nuevo**. Así un ajuste
   chico da un diff chico.
3. **El script escribe únicamente `src/data/skayboy-soluciones.json`**, en la forma canónica de
   `CTR-18.1`, y nunca `skayboy.json`. Imprime, por nivel regrabado, la duración y la tolerancia
   de antes y de después.
4. **El diff de `skayboy-soluciones.json` es el registro.** Queda en git qué afinado cambió qué
   solución, y un revisor lo ve en el mismo commit que la constante.
5. **Si el solucionador no encuentra traza con la física nueva, el nivel no se pasa con esa
   física.** Es una decisión de diseño con consecuencias visibles, no una falla de la
   herramienta: se mueve el nivel, o se vuelve atrás la constante. **El test no se apaga.**

**No se guarda una firma de las constantes** (un hash de `GRAVEDAD`, `VELOCIDAD`…) en el
archivo de soluciones. Contestaría la pregunta equivocada —si las constantes cambiaron, en vez
de si las pruebas siguen valiendo— y es un derivado guardado (`CTR-07.7`). **Lo que sí se
guarda es la unidad**, `cuadrosPorSegundo: 60` (`CTR-18.2`), por la misma razón por la que
`CTR-16.2` guarda `tile: 16`: si alguien cambia `CUADRO_SEG`, el test lo dice en una línea en
vez de en seis niveles rojos que no explican nada.

| | Opción | Por qué sí / por qué no |
|---|---|---|
| ✅ | **Rojo con nombre, y un script que regraba a pedido** | El cambio se ve, se revisa y queda en git |
| ✕ | **Que `npm test` regrabe solo** | Un test que se arregla a sí mismo no falla nunca. Y un test que escribe en el repo es un script disfrazado |
| ✕ | **Firma de las constantes en el archivo** | Rojo aunque la partida sea idéntica bit a bit —`CAIDA_MAXIMA` puede cambiar sin que ningún nivel la alcance—, y es un derivado guardado |
| ✕ | **Marcar el nivel "sin traza" y seguir** | Un nivel sin prueba adentro del banco es `BR-25` (b) incumplido en silencio |

### ADR-09.5 — La tolerancia: se calcula, no se guarda

**La definición, textual, compartida con `producto` (`BR-29`) y con el solucionador
(`T-266`)**:

> *Para cada borde de la traza —el cuadro donde una tecla se aprieta o se suelta—, el mayor d
> tal que correr ese borde cualquier cantidad de cuadros entre 1 y d, antes o después, dejando
> todo lo demás igual, sigue ganando. La tolerancia del nivel es el mínimo sobre sus bordes.*

No se toca una palabra. Lo que la definición deja abierto —qué pasa en el cuadro 0, qué pasa
cuando un borde se corre más allá del final, qué pasa si un borde pisa al siguiente de la misma
tecla, qué quiere decir "sigue ganando"— lo cierra `CTR-18.7`, sin contradecirla.

**No se guarda. Mismas tres razones que `CTR-07.7`, adaptadas:** se congela adentro de un dato
que cambia cada vez que alguien afina una constante; un `21` guardado no tiene procedencia, no se
puede auditar sin volver a calcularlo; y **el corte por escalón es una regla de negocio de
`BR-29`, no un dato del nivel** — un nivel no puede fijarse su propia vara.

**Quién la calcula, y cuánto:**

- **`soluciones.test.ts` no calcula la tolerancia: verifica que alcanza.** Para cada borde prueba
  los corrimientos de 1 a `m` cuadros para los dos lados, con `m` = el mínimo que `BR-29` pide
  para el escalón del nivel, y se detiene. Buscar el máximo exacto costaría varias veces más y
  ninguna decisión depende de él.
- **`scripts/resolver-niveles.mjs` imprime el número exacto**, buscando hacia arriba hasta que
  un corrimiento pierde o hasta **60 cuadros (1 s)**, y si llega al tope imprime `≥ 60`. Un
  segundo de margen en cada borde es margen de sobra para cualquier escalón.

**Cómo se lee el número, para el que escriba `BR-29`:** una tolerancia de `d` cuadros quiere
decir que alrededor de cada borde hay una ventana de **al menos 2d + 1 cuadros** que gana. Con
`d = 4`, 9 cuadros: 150 ms. Y con el piso técnico de `ADR-09.1`: **menos de 2 cuadros en
cualquier escalón es un nivel que un teléfono lento juega distinto de la máquina.**

**La consecuencia que hay que decir antes de que alguien la descubra con `NIV-01` en rojo: la
traza más corta tiene tolerancia cero.** Una búsqueda que minimiza cuadros suelta cada tecla en
el último cuadro que todavía sirve, y ese borde, corrido un cuadro, pierde. Pasa hasta en
`NIV-01`, el nivel más fácil que puede existir (`CTR-18.9`: la traza más corta mide 0, la
grabada 21). **Entonces lo que se graba no es la traza más corta: es una traza ensanchada**
—cada borde corrido hacia el medio de la ventana en la que sigue ganando, hasta un tope de
holgura que elige `T-266`—. La duración mínima que `§2.1` del plan daba por "gratis" sigue
siendo gratis, pero **la imprime el script, no se lee del largo de la traza grabada**.

| | Opción | Por qué sí / por qué no |
|---|---|---|
| ✅ | **Derivada: el test verifica el mínimo, el script calcula el número** | Se recalcula contra la física de hoy en cada build, y el test paga solo lo que decide |
| ✕ | **Guardarla en el archivo** | `CTR-07.7`, las tres razones de arriba |
| ✕ | **Calcular el máximo exacto en el test** | Cuesta varias veces más que verificar el mínimo, y el máximo no decide nada que el mínimo no decida |
| ✕ | **Medir solo los saltos** | La definición dice *cada borde*. Soltar la carrera un cuadro tarde al lado de un molinete es tan "precisión fina" como un salto justo, y a veces más |
| ✕ | **Medirla sobre la traza más corta** | Da cero en `NIV-01`. Mediría al solucionador, no al nivel |

### Consecuencias

1. **Cambian cuatro filas del plan, y ninguna para peor.** `T-266` graba una traza ensanchada
   y la de a dos pasa a ser una herramienta de medir, no algo que se graba (`CTR-18.4`); `T-267`
   crea dos archivos nuevos y no toca `skayboy.json` ni su schema, y le suma una línea a
   `mundo.ts` (`CUADRO_SEG`); `T-272` emite el suceso `compuerta` de `CTR-16.10.7`, que es lo
   que la paridad consume (`CTR-18.8`, enmendado);
   `T-277` graba **una** traza por nivel. Detalle en
   `Docs/SUGERENCIAS/ARQ-para-hilo-principal-la-solucion-grabada.md`.
2. **Uno de los rojos a mano que `T-267` declara no se pone rojo.** *"`GRAVEDAD` +10 %"* sobre un
   banco que tiene solo `NIV-01` **no rompe nada**: en `NIV-01` nadie salta, y caminando por el
   piso la gravedad no cambia un píxel. El rojo de la física se prueba con `VELOCIDAD` (la
   victoria se corre de cuadro y la regla del último cuadro cae) o con una sala de prueba que
   salte. Va en el traspaso.
3. **`CTR-16.7` y `CTR-16.8` quedan desactualizados en su texto**: el primero sigue diciendo que
   `solo` es "se pasa solo" y el segundo no tiene la fila de los módulos nuevos. **No los toco en
   esta tarea** porque `ARQ-schema-niveles.md` lo tiene abierto `T-264` en la misma ráfaga (§3
   del plan: una sola mano por archivo). Se enmiendan con puntero a `ADR-09.3` y `CTR-18.11`
   cuando `T-264` cierre. **Pagado el 2026-09-23:** `CTR-16.7` quedó con un solo booleano, y
   `CTR-16.8` apunta a `CTR-18.11`.
4. **`BR-25` (b), (c) y (d) pasan a probarse por construcción** —si `BR-29` está de acuerdo;
   *lo estuvo, punto 1, 2026-09-23*—:
   una columna por cuadro es (b); que el que espera no se mueva mientras el otro juega es (c) y
   (d) juntos (`CTR-18.6`, reglas 6 y 7). A la persona en el teléfono le queda (a) y lo que solo
   un pulgar sabe. **Contesta los puntos 1 y 2 del pedido de `producto`**
   (`PRD-para-arquitectura-el-nivel-declara-su-segunda-solucion.md`): el nivel ya no *declara*
   su camino de uno solo, lo *demuestra*; y (d) se chequea sobre el dato en vez de jugando, que
   era lo que ese pedido prefería. El punto 3 —la tarjeta— sigue siendo del ciclo 17.
5. **`alternativaSolo` de `CTR-16.6` pasa de prueba a descripción.** La traza ya prueba que el
   nivel se pasa solo; el texto dice *cómo* cree el que lo dibujó que se pasa, y **nada impide
   que el texto cuente una estrategia y la traza use otra** — por ejemplo, el texto dice "la caja
   tapa la placa" y la traza estaciona al otro personaje arriba, que también es presencia y
   también vale. Es de `T-264` decidir si el campo se queda. Queda avisado en el traspaso.
6. **`IDEA-04` hereda todo esto sin pagarlo**: un plataformas con meta es exactamente lo que el
   solucionador busca, y el paso fijo, el formato y el test son del mundo, no de Skayboy.

---

## CTR-18 — Contrato de `src/data/skayboy-soluciones.json`

- **Fecha:** 2026-09-22.
- **Estado:** **vigente desde que `T-267` lo pegue y lo valide.** Un valor abierto que no es de
  este contrato: los números de tolerancia por escalón (`BR-29`). El otro que figuraba acá —la
  forma de los sucesos de la paridad— **lo cerró `CTR-16.10.7`** y `CTR-18.8` quedó enmendado para
  citarlo (2026-09-22). Detalle en `CTR-18.12`. *Enmendado el 2026-09-23: la tolerancia la
  cerró `BR-29` punto 3 —10, 6 y 4 cuadros para los escalones 1, 2 y 3—, así que **no queda
  ningún valor abierto**.*
- **Para quién es:** para el hilo principal, que lo escribe con el script y lo repite con el test;
  para `revisor`, que tiene que poder rechazar una traza sin preguntar; para `producto`, que fija
  sobre esto la vara de `BR-29`.
- **Qué depende de `BR-29` y qué no.** De `BR-29` depende **un solo número por escalón**, la
  tolerancia mínima. Todo lo demás aguanta cualquier reparto razonable entre máquina y pulgar,
  porque lo que este contrato exige son condiciones **suficientes** que no le cuestan nada al
  pulgar: si `BR-29` le deja (c) o (d) a la persona, la máquina los prueba igual y no molesta. Si
  `BR-29` le pide a la máquina algo que acá no está —la traza de a dos—, la salida está escrita
  en `CTR-18.4`. *Enmendado el 2026-09-23: `BR-29` ya está escrito. Fijó el número (punto 3), le
  dio a la traza (b), (c), (d) y (f), y dejó (a) solo al teléfono (punto 1): la salida de
  `CTR-18.4` no se usa y este contrato sigue en versión 1.*

### CTR-18.1 — El archivo

| | |
|---|---|
| Ruta del dato | **`src/data/skayboy-soluciones.json`** |
| Ruta del schema | **`src/data/_schema/skayboy-soluciones.schema.json`** |
| Codificación | UTF-8 sin BOM, saltos `LF`, sangría de 2 espacios, salto de línea final |
| Quién lo escribe | **`scripts/resolver-niveles.mjs`** (`T-266`, `T-267`). Se puede corregir a mano —es legible a propósito—, pero lo normal es el script |
| Quién lo lee | **`src/lib/skayboy/soluciones.test.ts` y los scripts de `scripts/`. Nadie más** (`CTR-18.11`) |
| Orden | las claves de `soluciones` por `id` de nivel, de menor a mayor. El script lo escribe así y el diff queda estable |
| Techo | **No tiene techo de bytes, porque no viaja a ningún teléfono.** Tiene tope de renglones —400 por traza, en el schema— porque lo que cuesta de verdad es el tiempo del test (`CTR-18.7`) |

**El nombre importa, como en `CTR-16.1`:** `esquemas.test.ts` empareja `src/data/<n>.json` con
`src/data/_schema/<n>.schema.json` por nombre. Sumar este archivo a la verificación es agregar
**`'skayboy-soluciones'`** a esa lista (`esquemas.test.ts:59-68`) **el día que existan los dos
archivos**, que es la regla del comentario de la línea 55.

### CTR-18.2 — Envoltorio

```json
{
  "contrato": "CTR-18",
  "contratoVersion": 1,
  "juego": "skayboy",
  "actualizado": "2026-09-22",
  "cuadrosPorSegundo": 60,
  "soluciones": {
    "NIV-01": { "deUno": [ "…" ] }
  }
}
```

- **`contrato` y `contratoVersion` adentro del dato**, por el motivo de siempre (`CTR-02`,
  `CTR-08`, `CTR-16.2`): mirando solo el JSON, dentro de dos meses, se sabe contra qué documento
  validarlo.
- **`cuadrosPorSegundo` es la unidad de todas las trazas del archivo, no un derivado.** El
  schema la fija en `60` (`const`). `soluciones.test.ts` la compara contra
  `Math.round(1 / CUADRO_SEG)` de `mundo.ts`. **Cambiar el cuadro es cambiar la unidad de
  todas las trazas**: se regraban todas y este contrato sube de versión.
- **`soluciones` es un mapa, no un arreglo**, por la razón de `CTR-16.4`: dos soluciones para el
  mismo nivel no se pueden escribir. Las claves son `NIV-` más dos dígitos.
- **`actualizado`** lo escribe el script solo cuando cambió algo.
- **La clave de la traza es `deUno`, y no `solo`**, a propósito: `solo` ya es el nombre de un
  booleano de `verificaciones` en el otro archivo (`ADR-09.3`), y dos cosas distintas con el
  mismo nombre en dos archivos vecinos es un malentendido esperando. *Enmendado el 2026-09-23:
  ese booleano se retiró (`CTR-16.7`), y el nombre se queda igual. Ahora por otro motivo:
  `deUno` y `deDos` son las dos pasadas de `CTR-16.7`, una en cada archivo, y leídos juntos
  dicen quién da cada una.*

### CTR-18.3 — El renglón: cómo se escribe una traza

Una traza es un **arreglo de renglones**. Cada renglón es un tramo de cuadros seguidos en los
que el mando no cambia:

```
renglón  :=  quién " " cuadros
quién    :=  "s" teclas  |  "p" teclas  |  "-"
teclas   :=  "<^"  |  ">^"  |  "<"  |  ">"  |  "^"
cuadros  :=  entero de 1 a 9999, sin ceros a la izquierda
```

| Caracter | Quiere decir |
|---|---|
| `s` | la columna de **Skayboy** tiene estas teclas apretadas |
| `p` | la columna de **Poligirl** tiene estas teclas apretadas |
| `-` | **nadie toca nada** |
| `<` · `>` · `^` | izquierda · derecha · saltar (`Mando` de `mundo.ts:108-112`) |

```json
"deUno": [
  "s> 12",
  "s>^ 6",
  "- 20",
  "p< 40"
]
```

Se lee de arriba abajo: Skayboy corre a la derecha 12 cuadros; sigue corriendo y salta —el
salto sale en el primer cuadro, porque se toca y no se mantiene (`mundo.ts:332-334`)— durante
6; nadie toca nada 20 cuadros; Poligirl corre a la izquierda 40. **La columna que no figura
en un renglón está suelta.**

**Por qué la persona sola no puede tener dos columnas en el mismo cuadro: lo hace imposible el
formato.** Un renglón nombra **una** columna o ninguna; la gramática no tiene dónde escribir la
otra. `"s< p> 4"` no es un renglón válido: lo rechaza el schema (`CTR-18.10`) y lo rechaza el
lector de `soluciones.ts`, y `soluciones.test.ts` tiene ese caso en rojo (`CTR-18.6`, regla 4).

**La expresión es una sola.** La cadena del `pattern` del schema y la expresión regular de
`soluciones.ts` son **la misma**, carácter por carácter, con los mismos grupos:

```
^(?:([sp])(<\^|>\^|<|>|\^)|-) ([1-9][0-9]{0,3})$
```

`soluciones.test.ts` compara las dos. Dos gramáticas que se escriben por separado son dos
gramáticas que un día aceptan cosas distintas (`FIND-58`, otra vez).

**Tres decisiones de forma, y por qué:**

- **Se nombra al personaje, no a la columna de la pantalla.** La traza le habla a `mundo.ts`,
  que no sabe de pantallas: `Mandos` va por `IdPersonaje` (`mundo.ts:117`). Qué columna maneja a
  quién lo decide la isla (`COLUMNA`, `D-43`); si algún día se da vuelta, las trazas siguen
  valiendo.
- **`<>` no existe.** Las dos a la vez se anulan (`mundo.ts:326-329`) y la traza no lo necesita:
  `^` solo hace lo mismo. Dos maneras de escribir el mismo mando ensucian el diff.
- **Duraciones, no cuadros absolutos.** Si un regrabado alarga un tramo, cambia una línea del
  diff y no se renumera el resto de la traza.

**Forma canónica:** dos renglones seguidos **iguales** son uno solo —expandidos dan el mismo
mando cuadro a cuadro—, y el test los rechaza. El script escribe siempre la forma canónica.

### CTR-18.4 — Una traza por nivel: la de uno. La de a dos no se graba

**`deUno` es obligatoria en todo nivel del banco**, esté en `borrador` o en `listo`. Es el
camino de uno solo *"escrito al lado del nivel — no 'se puede', sino así se hace"* de `BR-25`
(b), y es lo único que sostiene las reglas 5 a 9 y la 11 de `CTR-18.6`.

**La traza de a dos no se graba**, y el motivo es de lógica, no de ahorro:

1. **Lo que una traza de a dos probaría, ya lo prueba la de uno.** Dos personas siempre pueden
   turnarse: cada una agarra su columna y juegan la traza de uno por turnos. **Todo nivel que se
   pasa solo se pasa de a dos**, con la misma tolerancia en cada borde. La traza de a dos no
   agregaría ni una existencia ni un margen.
2. **Lo que `BR-25` (a) pide de verdad no lo prueba ninguna traza.** *"Dos personas moviéndose
   a la vez lo terminan"*, verificado jugándolo: lo que se prueba ahí es si dos personas de
   verdad, coordinando con la voz, lo terminan y la pasan bien. Una máquina que coordina
   perfecto no dice nada de eso. Por eso `verificaciones.deDos` sigue siendo de la persona
   (`ADR-09.3`).
3. **La única regla que la distinguiría de una de uno —"tiene al menos un cuadro con las dos
   columnas"— se cumple de mentira**: dos teclas contra una pared en el primer cuadro. Una regla
   que se cumple sin hacer nada es teatro.

**Lo que sí sirve de la búsqueda de a dos, y se queda:** el solucionador la puede seguir haciendo
(`T-266` la tiene en su verificación) **como herramienta de medir**. La duración mínima de a dos
es la mitad de la pregunta de *"cuánto tiene que durar"* que `UX-31` necesita, y el script la
imprime. No se guarda: es un derivado.

**Si `BR-29` le da (a) a la máquina, la salida está hecha:** entra una segunda traza en la misma
entrada del nivel, al lado de `deUno`, con un nombre que no choque con `verificaciones.deDos`,
la gramática ampliada a dos columnas por renglón (`"s> p^ 6"`) y las reglas de `CTR-18.6` menos
la 4, la 7 y la mitad de la 11 que mira el cambio de columna. Es `CTR-18` versión 2 y no rompe
una sola traza grabada.

*Enmendado el 2026-09-23: `BR-29` punto 1 le dio (a) solo al teléfono. La salida queda escrita
por si algún día cambia, pero no se usa, y `CTR-18` sigue en versión 1. **Consecuencia que se
escribe acá para que nadie la busque en otro lado:** lo que no se graba no se exige. Ninguna
regla de este contrato ni de `CTR-16.10` mira una traza de a dos (`CTR-16.10.5` y
`CTR-16.10.10` lo decían, y se enmendaron el mismo día).*

### CTR-18.5 — La regla de repetición

Así se juega una traza, en el test, en el solucionador y en el script. **Es la misma función en
los tres** (`CTR-18.11`).

1. **El banco es `src/data/skayboy.json` tal como está**, entero, con su leyenda de verdad; el
   nivel es el del `id` de la clave.
2. **`mundo = crearMundo(banco, nivel)`.** Nada más prepara el mundo.
3. **La traza se expande a una lista de `L` mandos**, uno por cuadro: cada renglón aporta
   `cuadros` copias de su mando; la columna que no figura va `QUIETO`.
4. **Para `i` de 0 a `L − 1`: `sucesos[i] = paso(mundo, mandos[i], CUADRO_SEG)`.** Nada más toca
   el mundo entre cuadro y cuadro.
5. **Gana si `mundo.terminado` se vuelve `true` exactamente en el último cuadro**: después de
   `L − 1` cuadros todavía es `false`, después de `L` es `true`. Si se vuelve `true` antes,
   **sobran cuadros**; si no se vuelve nunca, **no gana**. Las dos cosas son rojo.
6. **La duración de la traza grabada es `L` cuadros, `L / 60` segundos.** Sin cálculo aparte.

**Por qué ganar en el último cuadro y no "en algún cuadro":** con la regla floja, una traza con
veinte cuadros de sobra al final sigue ganando aunque alguien haya afinado la velocidad, y el
build no se entera de que la partida cambió (`ADR-09.4` punto 1). Con la regla estricta, la
traza **es** la partida, ni un cuadro más ni uno menos, y su largo es su duración.

### CTR-18.6 — Lo que exige `soluciones.test.ts`

Todo mensaje **nombra el nivel**; los de las reglas 5 a 8 y 11 nombran además **el cuadro** y,
cuando aplica, **el personaje y la tecla**. Y todo mensaje de las reglas 5 a 8 y 11 termina con
el comando que regraba: `node scripts/resolver-niveles.mjs --regrabar NIV-XX`.

| # | Regla | Cómo la mira | Un mensaje en rojo, por ejemplo | Rojo a mano |
|---|---|---|---|---|
| 1 | **Cada nivel de `skayboy.json` tiene su solución, y cada solución su nivel** | cruce de `id` entre los dos archivos | `NIV-04 no tiene traza` · `hay traza para NIV-09 y no hay NIV-09` | borrar una entrada |
| 2 | **Las trazas están en la unidad del mundo** | `cuadrosPorSegundo === Math.round(1 / CUADRO_SEG)` | `las trazas están grabadas a 60 cuadros por segundo y mundo.ts corre a 50: regrabá todas` | cambiar `CUADRO_SEG` |
| 3 | **Renglón válido y canónico** | la expresión de `CTR-18.3`; dos renglones seguidos iguales; y que la expresión de `soluciones.ts` sea la del schema | `NIV-02, renglón 7: igual al 6` | duplicar un renglón |
| 4 | **Una columna por cuadro** | lo hace imposible el formato; el caso existe para probar que el lector no deja pasar la excepción | `NIV-01, renglón 1: «s< p> 4» nombra dos columnas` | escribir ese renglón |
| 5 | **Gana, y en el último cuadro** | `CTR-18.5` | `NIV-03 · no gana: al cuadro 912 skayboy está en (131, 76) y poligirl en su puerta` · `NIV-01 · gana en el cuadro 94 y la traza tiene 99` | recortar un cuadro **al final**; `VELOCIDAD` ±10 % |
| 6 | **Nadie vuelve a la entrada** | ningún suceso `vuelta` en toda la repetición | `NIV-05 · cuadro 311: poligirl volvió a la entrada y su columna estaba suelta` | un tramo que pisa un molinete |
| 7 | **El que espera no se mueve** | en todo cuadro en que una columna tiene teclas, el cuerpo de la otra **termina el cuadro exactamente donde lo empezó** (`x` e `y`, comparados con `===`) | `NIV-02 · cuadro 88: skayboy esperaba y se movió de (40, 92) a (40, 93.2)` | cambiar de columna con el otro en el aire |
| 8 | **Tolerancia ≥ la de `BR-29` para su escalón** | `CTR-18.7`, con `BR-29` punto 3: 10, 6 y 4 cuadros para los escalones 1, 2 y 3 | `NIV-06 (escalón 3) · el borde del cuadro 402 (poligirl, saltar, aprieta) aguanta 1 cuadro y BR-29 pide 4` *(decía "pide 3", escrito antes del número; enmendado el 2026-09-23)* | grabar la traza más corta |
| 9 | **La paridad del banco** | `CTR-18.8` | `paridad: Poligirl le abre paso a Skayboy 4 veces y Skayboy a Poligirl 1; BR-23.1 pide diferencia ≤ 1` | cuando existan los mecanismos (`T-272`) |
| 10 | **Nada de esto llega al navegador** | leer el fuente de `src/pages`, `src/scripts`, `src/components` y `src/layouts` | `src/pages/juegos/skayboy-y-poligirl.astro nombra skayboy-soluciones` | agregar el import |
| 11 | **Las cajas no corren carreras** | en ningún cuadro de la repetición de la traza de uno —la única que se graba, `CTR-18.4`— hay una caja en `espera` (`CTR-16.10.5`); y al empezar el primer cuadro con teclas de una columna, después de cuadros con teclas de la otra, ninguna caja anda —ni en su tramo ni cayendo— (`CTR-16.10.11`) | `NIV-05 · cuadro 240: una caja espera arriba de skayboy` · `NIV-04 · cuadro 212: skayboy agarra su columna y la caja que empujó poligirl todavía anda` | cuando existan las cajas (`T-272`) |

**Cuatro precisiones que no entran en la tabla:**

- **La regla 6 es más fuerte que lo que pedía la tarea, a propósito.** Lo pedido era *"el que
  espera nunca recibe `vuelta`"*, y ese caso tiene su mensaje propio. Pero una traza donde **el
  que juega** vuelve a la entrada y después gana usa el molinete como atajo: enseña como camino
  lo que `BR-24` define como fracaso. La traza es el *"así se hace"* de `BR-25` (b); un *así se
  hace* que pasa por perder no es uno.
- **La regla 7 es la que prueba (c) y (d) juntas.** Mientras una columna tiene teclas el otro
  cuerpo está quieto, así que **nunca se mueven los dos a la vez** —ninguna acción de la traza
  puede depender de simultaneidad de entrada, la que `BR-25` (c) prohíbe— y **el que espera
  queda quieto y a salvo** —si una compuerta se le abre abajo o algo lo empuja, se movió—. Los
  cuadros sin ninguna tecla (`-`) no cuentan: ahí la persona levantó el dedo y el último que
  jugó puede terminar de caer. Lo que la regla prohíbe es agarrar la otra columna **antes** de
  que termine.
- **Las reglas 7 y 11 hacen innecesario modelar el cruce del pulgar**, que tarda de verdad unos
  cuantos cuadros en ir de una columna a la otra: con el que espera quieto y ninguna caja
  andando, el mundo no cambia mientras el pulgar viaja, y agregar cuadros de `-` en cada cambio
  no cambia el resultado. Dejaría de ser cierto con un mecanismo con reloj —una compuerta que se
  cierra sola a los dos segundos—, y **`CTR-16.10` no trae ninguno** (su regla 1: ninguna pieza
  tiene reloj). Lo único que se mueve solo es una caja que termina su tramo o cae, y eso lo cubre
  la regla 11. Si algún día entra una pieza con reloj, la traza de uno necesita una pausa mínima
  en cada cambio de columna, y es `CTR-18` versión 2. *(Enmendado el 2026-09-22: decía "si
  `CTR-16.10` trae uno", y ya se sabe que no.)*
- **La regla 11 no nace acá.** La piden `CTR-16.10.5`, que prohíbe en las soluciones la caja en
  `espera` —el escalón humano por la puerta de atrás—, y `CTR-16.10.11`, que quiere el cambio de
  columna con ninguna caja en movimiento; `CTR-16.10.10` le carga a este test la primera mitad.
  Está en la tabla para que lo que exige `soluciones.test.ts` sea una lista sola. *(Agregada el
  2026-09-22, en la pasada de coherencia.)*
- **Qué mira la regla 11, dicho de una vez** *(2026-09-23)*. Mira la traza de uno y nada más:
  la de a dos no se graba, y `CTR-16.10.5` y `CTR-16.10.10`, que pedían mirar *"las dos"*, se
  enmendaron el mismo día. Y la primera mitad mira **cada cuadro**, no solo los cambios de
  columna. En la traza de uno el que espera no se mueve (regla 7), así que la única carrera
  que puede dejar una caja en `espera` es la del que juega con su propia caja: la empuja al
  borde y se mete debajo mientras cae. Eso pasa en medio de un turno, no en el cambio. Con la
  de uno alcanza para lo que la regla protege: si gana sin pasar por una `espera`, **el nivel
  tiene otra manera de pasarse**, y eso es todo lo que `CTR-16.10.5` pide.

**El paso fijo no se prueba acá**: lo vigila `motor.test.ts` sobre el fuente de la isla
(`ADR-09.1`, "La guarda").

### CTR-18.7 — La tolerancia, hecha operación

La definición de `ADR-09.5`, sin cambiarle una palabra, con los cinco huecos cerrados para que
el test, el script y `BR-29` den el mismo número:

1. **Qué es un borde.** Se expande la traza a la línea de tiempo de cada tecla de cada
   personaje —seis líneas de `L` booleanos, `b[i]`, con `b[−1] = false`—. Hay un borde en el
   cuadro `t` si `b[t] ≠ b[t − 1]`. Un cambio de columna sin pausa son **varios bordes en el
   mismo cuadro** —las teclas que se sueltan de una columna y las que se aprietan de la otra—, y
   **cada uno se corre solo**.
2. **Qué es correrlo `k` cuadros.** Primero se estira la traza a `L + |k|` cuadros repitiendo su
   último cuadro. Después, sobre la línea de esa tecla: **más tarde** (`k > 0`), los cuadros de
   `t` a `t + k − 1` toman el valor de antes del borde; **más temprano** (`k < 0`), los cuadros
   de `t + k` a `t − 1` toman el valor de después. Todo lo demás queda igual.
3. **Los extremos.** Un borde que caería antes del cuadro 0 **se queda en el 0**: apretar antes
   de que empiece la partida es tener la tecla apretada desde el principio. Un borde que se corre
   más allá de `L − 1` cae adentro del estiramiento del punto 2. Y si el corrimiento **pisa otro
   borde de la misma tecla**, lo pisa: el gesto se acorta o desaparece, y la física dice si
   todavía gana. **No se topea nada a mano.**
4. **Qué quiere decir "sigue ganando".** La variante se juega con la regla de repetición
   (`CTR-18.5`, pasos 1 a 4) durante sus `L + |k|` cuadros, y **gana si `mundo.terminado` se
   vuelve `true` en algún cuadro y nadie recibió una `vuelta`**. A las variantes **no** se les
   aplican el último cuadro exacto, la columna única, el que espera quieto ni las cajas de la
   regla 11: una variante no es
   una traza nueva que se propone, es **la misma partida jugada con un pulgar peor**. Por eso un
   corrimiento que hace que las dos columnas se toquen un cuadro vale si la física gana.
5. **El número.** La tolerancia de un borde es el mayor `d` tal que las `2d` variantes
   (`k = ±1 … ±d`) ganan; es 0 si `k = +1` o `k = −1` ya pierde. La tolerancia de la traza es el
   mínimo sobre sus bordes.

**Lo que el test prueba y lo que no:** para un nivel de escalón `e`, prueba `k = ±1 … ±m` con
`m = TOLERANCIA_MINIMA_CUADROS[e]` (`BR-29`) y corta en la primera que pierde. El número exacto
lo busca el script, hasta 60 cuadros (`ADR-09.5`).

**El costo, y el presupuesto.** Son `2 · m` repeticiones por borde, cada una de hasta `L + m`
cuadros. Con una traza difícil de 30 s (1.800 cuadros), 40 bordes y `m = 4`: 320 variantes, unos
600.000 cuadros, **menos de 3 s** a la velocidad medida. **Presupuesto de `soluciones.test.ts`
entero: 10 s** en la máquina de `§1` del plan — es presupuesto, no medición. Si se pasa, las
palancas son dos y en este orden: **menos bordes** (el solucionador simplifica la traza antes de
grabarla: los bordes que se pueden sacar sin que pierda, se sacan) y **repetir desde una foto del
mundo tomada en el borde** en vez de desde el cuadro 0, con una función que clone el mundo y su
propio caso de prueba (foto + resto = corrida entera). La foto no se escribe antes de hacer
falta: un clon que se olvida un campo del mundo hace que la variante arranque de un estado falso,
y eso no se ve.

### CTR-18.8 — La paridad, contada con sucesos

> **Enmendado el 2026-09-22, en la pasada de coherencia de la ráfaga 1.** Esta sección se
> escribió sin leer `CTR-16.10`, que salía en paralelo, y aun así fijó una regla que era de él.
> La tabla de sucesos decía *"nadie si fue una caja"*, y la lista de lo que no suma traía *"la
> que no se atribuye a nadie (una caja sobre una placa)"*: la apertura que hacía una caja no era
> de nadie. `CTR-16.10.5` y `CTR-16.10.7` dicen lo contrario —la caja guarda `empujadaPor` y la
> apertura es de quien la empujó—, son los dueños de la regla y tienen razón: `BR-29` (f) cuenta
> *"qué columna acciona cada mecanismo"*, y empujar una caja hasta la placa es accionarla. Con el
> texto viejo, la cuenta sobre la intención de `UX-31` daba **2 a 1** en vez del **3 a 3** de su
> `§4`. Cambió además la forma: esta sección pedía tres sucesos del mundo, con la atribución como
> un conjunto de cuerpos, y `CTR-16.10.7` trae uno solo, con un `por`. El cruce lo lee la cuenta.

`BR-23` punto 1: en los niveles con mecanismos, las veces que Poligirl le abre paso a Skayboy y
las veces que Skayboy se lo abre a Poligirl quedan parejas, **diferencia máxima de uno, contada
sobre los seis niveles**. `BR-25` (f) pide que esté contada y `BR-29` (f) le da la cuenta a la
traza. Se cuenta sobre la repetición de la traza de uno, con **el suceso que define
`CTR-16.10.7`** y una lectura del mundo que hace la cuenta misma.

**Lo que la cuenta consume:**

| Qué | De dónde sale | Qué trae |
|---|---|---|
| **apertura** | el suceso `compuerta` con `abierta: true` (`CTR-16.10.7`), que emite `mundo.ts` (`T-272`) | el `id` de la compuerta y **`por`**: a quién se le atribuye, o `null` |
| **cierre** | el mismo suceso con `abierta: false` | el `id`. Termina la apertura, traiga el `por` que traiga |
| **cruce** | **no es un suceso del mundo**: lo lee la cuenta en `soluciones.ts`, comparando cada cuerpo al empezar y al terminar cada cuadro | qué cuerpo y qué compuerta |

**A quién se le atribuye una apertura lo dice `CTR-16.10.7`, y acá se cita sin cambiarle nada:**
el `por` es el que cruzó la palanca, el que pisó la placa, **o el `empujadaPor` de la caja que la
pisa** (`CTR-16.10.5`). Una caja empujada sobre una placa **abre a nombre de quien la empujó**.
`por: null` es el empujón de los dos a la vez —que en la traza de uno no puede pasar: se mueve
un cuerpo por vez— o el cierre que esperaba a que el tramo se liberara. *(Sumado el
2026-09-23, cuando `CTR-16.10.7` lo escribió:)* y cualquier cambio que en el mismo subpaso
hicieron los dos —los dos pisan la misma placa, por ejemplo—, que en la traza de uno tampoco
puede pasar, por el mismo motivo. Para la cuenta no cambia nada: en la traza de uno, el único
`null` que aparece es el del cierre tardío, y un cierre no suma.

**Qué es un cruce**, que `CTR-16.10.7` dice como *"que Y cruce su columna"*: el centro de la caja
de colisión del cuerpo pasa de un lado al otro del centro de la columna del tramo, con la caja de
colisión tocando alguna fila del tramo —el que camina por arriba del sólido que corona una
compuerta no la cruzó—. Es la misma medida con que un cuerpo mueve una palanca (`CTR-16.10.2`).
**No hace falta ordenar, dentro de un cuadro, un cruce contra la apertura o el cierre de la misma
compuerta:** entre apoyarse contra la compuerta cerrada y tener el centro sobre el de su columna
hay 13 px nativos —5 de medio cuerpo, 8 de media columna—, y otros 13 hasta dejar el tramo libre
para que cierre: unos 9 cuadros cada tramo a `VELOCIDAD = 88`. *Calculado a mano sobre
`CAJA_ANCHO`, `TILE` y `VELOCIDAD` de `mundo.ts`, como las cuentas de `CTR-18.9`.*

**Por qué el cruce lo lee la cuenta y no lo emite el mundo:** `CTR-16.10.7` trae un suceso solo,
y un segundo existiría únicamente para este test: el mundo lo calcularía en cada subpaso de cada
partida en el teléfono, y la isla tendría una cosa más que dejar pasar callada. La cuenta ya
tiene el mundo en la mano entre cuadro y cuadro (`CTR-18.5`, paso 4).

**La cuenta:**

> Un cuerpo **B** cruza una compuerta mientras sigue abierta una apertura con `por: A`, y **A no
> es B**: suma uno a *"A le abrió paso a B"*. Cada apertura suma **a lo sumo uno**, aunque B
> cruce tres veces antes del cierre.

Es la lectura computable de `CTR-16.10.7` (*"Quién lo usa"*, punto 1), con las palabras de esta
cuenta.

- **Suma, y es lo que cambió:** la apertura que hizo una caja que **A** empujó hasta la placa,
  cuando la cruza **B**. Es `NIV-04` entero y una mitad de `NIV-05` y de `NIV-06` en `UX-31`.
- **No suma:** la apertura que se abrió uno mismo (`por` es el que cruza), la de `por: null`,
  los tesoros, y toda ayuda que no sea una compuerta: **una caja de escalón, o de tapón sobre un
  molinete, tampoco**, porque `CTR-16.10.7` la deja afuera y le pasa la pregunta a `BR-23`. Si
  `BR-23` la quiere, entra como otra lectura en esta misma cuenta. **La cuenta no se guarda en
  ningún lado**, así que ampliarla no toca el archivo.
- **Un límite, dicho antes de que alguien lo encuentre:** la apertura queda a nombre de quien la
  abrió hasta que la compuerta se cierra, aunque en el medio otro mecanismo de la misma compuerta
  tome la posta —un mecanismo que se mueve con la compuerta ya abierta no emite nada
  (`CTR-16.10.7`)—. Ninguno de los seis niveles de `UX-31` pone dos mecanismos sobre una misma
  compuerta; si `T-277` arma uno, el par que imprime el script se mira contra la intención.
- **Por nivel** da un par *(Skayboy → Poligirl, Poligirl → Skayboy)*; el script lo imprime para
  que `revisor` lo compare con la paridad programada de `UX-31`. **Sobre el banco**, el test
  exige `|Σ S→P − Σ P→S| ≤ 1`: es el número de `BR-23.1`, citado, no uno de este contrato. Se
  cuenta sobre todos los niveles del banco, estén en `borrador` o en `listo`.
- **`NIV-01` cuenta 0 y 0**: no tiene compuertas, así que no hay un solo suceso `compuerta`. Es
  lo mismo que el "—" de `UX-31 §4` para los dos Fáciles: la cuenta del banco no los saltea,
  suman cero.
- **Sobre la traza de uno y no sobre otra**, porque es la que existe siempre y la única donde la
  atribución es limpia: se mueve un solo cuerpo por vez, y el `por: null` del empujón doble no
  aparece. Si el que espera está estacionado en una placa, la apertura es suya y el que cruza es
  el otro, que es exactamente *"le abrió paso"*.
- **El suceso `compuerta` no suena** (`CTR-16.10.7` da los cuatro motivos). Hoy `atender()` le
  pasa a `sonar()` todo suceso que no sea `vuelta` (`partida-skayboy.ts:205-218`): cuando `T-272`
  lo emita, **la isla lo tiene que dejar pasar callado**.

**La cuenta aplicada a la intención de `UX-31`**, a mano, para que `revisor` tenga contra qué
comparar lo que imprima el script:

| Nivel | El camino de una persona sola de `UX-31 §3`, leído con esta cuenta | S → P | P → S | Con el texto viejo |
|---|---|---|---|---|
| `NIV-01`, `NIV-02` | sin compuertas | 0 | 0 | 0 · 0 |
| `NIV-03` | Skayboy cruza la palanca (`por: skayboy`); Poligirl cruza la compuerta | 1 | 0 | 1 · 0 |
| `NIV-04` | Poligirl empuja la caja hasta la placa (`por: poligirl`, el `empujadaPor` de la caja); Skayboy cruza | 0 | 1 | **0 · 0** |
| `NIV-05` | la palanca de Skayboy abre y cruza Poligirl; la caja de Poligirl abre y cruza Skayboy | 1 | 1 | **1 · 0** |
| `NIV-06` | la palanca de Poligirl abre y cruza Skayboy; la caja de Skayboy abre y cruza Poligirl | 1 | 1 | **0 · 1** |
| **Banco** | | **3** | **3** | **2 · 1** |

**Coincide con `UX-31 §4` fila por fila.** Lo que manda es la cuenta que corre `T-277` sobre las
trazas, no esta tabla ni la de `UX-31`. Y la coincidencia es con la **intención** —el camino en
prosa—, no con los bocetos de una fila, que `UX-31 §3` declara ilustrativos y que leídos al pie
de la letra no siempre lo realizan. El caso que más cuesta ver: `UX-31 §2` lee la palanca como
*"queda abierta para siempre"*, y `CTR-16.10.2` la devuelve a reposo cuando se la cruza
caminando para el otro lado. En el boceto de `NIV-03`, Skayboy la cruza hacia la
derecha y después camina hacia su puerta, a la izquierda: si vuelve antes de que Poligirl cruce,
la compuerta se cierra y no están ni el 1 de la cuenta ni el paso de Poligirl. Eso lo acomoda
`T-277` con el solucionador en la mano —saltándola, que no la mueve, o con la palanca del otro
lado—; la cuenta no cambia.

### CTR-18.9 — Ejemplo: `NIV-01` con su traza

La sala es la de `src/data/skayboy.json`: piso en la fila 8, paredes en las columnas 0 y 14, y
en la fila 7 `#A.o.1...2.o.B#`. Sin molinetes, sin mecanismos, dos tesoros que no son condición.

```json
{
  "contrato": "CTR-18",
  "contratoVersion": 1,
  "juego": "skayboy",
  "actualizado": "2026-09-22",
  "cuadrosPorSegundo": 60,
  "soluciones": {
    "NIV-01": {
      "deUno": [
        "s< 60",
        "p> 39"
      ]
    }
  }
}
```

**Las cuentas, hechas a mano sobre `mundo.ts`** (a `VELOCIDAD = 88`, un cuadro son dos subpasos
de 0,733 px nativos: 1,467 px nativos por cuadro):

- **Skayboy** arranca en `x = 83` (`puntoDeEntrada`, columna 5). Está en su puerta —la `A`,
  columna 1— cuando `x + 5` cae entre 16 y 31, o sea con `x < 27`: **le alcanzan 39 cuadros**
  (`x = 25,8`; con 38 queda en 27,27 y no alcanza). A los 46 cuadros choca la pared de la columna
  0 en `x = 16`, que sigue adentro de la puerta. Con 60 queda ahí, apoyado, y en la puerta.
- **Poligirl** arranca en `x = 147` (columna 9). Está en su puerta —la `B`, columna 13— con
  `x ≥ 203`: **39 cuadros** la dejan en 204,2 (con 38, en 202,73). Mientras Skayboy camina, ella
  espera en 147 sin moverse; mientras ella camina, él espera en 16.
- **Gana en el cuadro 99** —el 39.º de Poligirl, que es el último de la traza—: **99 cuadros,
  1,65 s**.
- **Tolerancia: 21 cuadros.** Los dos bordes que la fijan son los de Skayboy: apretar
  izquierda hasta 21 cuadros tarde, o soltarla hasta 21 cuadros temprano, todavía le deja sus
  39. Los otros dos bordes aguantan sin tope: soltar tarde lo deja empujando la pared, adentro de
  la puerta; y el apretar de Poligirl se puede correr para cualquier lado —temprano, camina a la
  vez que él y ganan antes; tarde, el estiramiento de `CTR-18.7` le da los cuadros—.
- **La traza más corta es `["s< 39", "p> 39"]`: 78 cuadros, 1,3 s, y tolerancia 0**: apretar un
  cuadro tarde le deja 38 a Skayboy. Es el ejemplo de `ADR-09.5` en el nivel más fácil del juego.
  El `60` de la traza grabada es un ensanchado cualquiera: cuánto ensancha lo decide `T-266`, y
  este ejemplo no lo fija.
- **Las once reglas de `CTR-18.6`:** nivel y solución se corresponden; unidad 60; dos renglones
  distintos y canónicos; una columna por renglón; gana en el último cuadro; ni una `vuelta`; el
  que espera no se mueve; tolerancia 21, por encima de los 10 que `BR-29` pide al escalón 1
  *(decía "por encima de cualquier piso razonable", escrito antes del número; enmendado el
  2026-09-23)*; paridad 0 y 0,
  porque sin compuertas no hay un solo suceso `compuerta`; no lo importa ninguna página; y sin
  cajas, la 11 no tiene qué mirar.
- **El ejemplo sobrevive a `CTR-16.10` sin tocar un renglón** *(nota del 2026-09-22, pasada de
  coherencia)*. La fila `#A.o.1...2.o.B#` no usa ninguno de los caracteres que `CTR-16.10` suma
  o cambia de sentido (`/`, `=`, `|`, `n`); los dos arreglos que el nivel gana, `mecanismos` y
  `compuertas`, entran vacíos (`CTR-16.10.1`); y que los cuerpos se atraviesen (`CTR-16.10.6`) no
  cambia nada, porque acá caminan hacia lados opuestos y nunca se tocan. Lo que la traza repite
  es lo mismo antes y después de `T-272`.

### CTR-18.10 — El schema, para pegar

Es un archivo entero y no un fragmento de `skayboy.schema.json`: la traza vive en su propio
archivo (`ADR-09.2`), así que **`CTR-16` no sube de versión**. Lo pega y lo valida `T-267`, en
**`src/data/_schema/skayboy-soluciones.schema.json`**. Usa `comment` y no `$comment`, que es la
convención de los schemas del repo (`ajv` corre con `strict: false`, `esquemas.test.ts:24-34`).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/skayboy-soluciones/1",
  "title": "CTR-18 — Las soluciones grabadas de Skayboy y Poligirl",
  "comment": "Lo que este schema NO hace, y hay que saberlo antes de confiar en él: no juega las trazas, no sabe si cada nivel de skayboy.json tiene la suya, no detecta dos renglones seguidos iguales ni mide la tolerancia o la paridad. Todo eso vive en src/lib/skayboy/soluciones.test.ts (CTR-18.6). Este archivo lo escribe scripts/resolver-niveles.mjs y no lo importa ninguna página: la traza no viaja al teléfono (ADR-09.2).",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "contratoVersion", "juego", "actualizado", "cuadrosPorSegundo", "soluciones"],
  "properties": {
    "contrato": { "const": "CTR-18" },
    "contratoVersion": { "const": 1 },
    "juego": { "const": "skayboy" },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "cuadrosPorSegundo": {
      "comment": "La unidad de todas las trazas: un cuadro es 1/60 s (ADR-09.1). No es un derivado: es como `tile` en CTR-16.2. soluciones.test.ts la compara con CUADRO_SEG de mundo.ts; cambiarla es regrabar todo y subir de versión.",
      "const": 60
    },
    "soluciones": {
      "comment": "Un mapa y no un arreglo, por lo mismo que la leyenda de CTR-16.4: dos soluciones para el mismo nivel no se pueden escribir.",
      "type": "object",
      "minProperties": 1,
      "propertyNames": { "pattern": "^NIV-\\d{2}$" },
      "additionalProperties": { "$ref": "#/$defs/solucion" }
    }
  },
  "$defs": {
    "solucion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["deUno"],
      "properties": {
        "deUno": { "$ref": "#/$defs/trazaDeUno" }
      }
    },
    "trazaDeUno": {
      "comment": "CTR-18.3. Un renglón nombra una columna o ninguna: dos columnas en el mismo cuadro no se pueden escribir, y eso es lo que hace de esta la traza de una persona sola (BR-25 b). El pattern es la misma cadena que la expresión de src/lib/skayboy/soluciones.ts, y el test compara las dos. El tope de 400 renglones no es un número de diseño: es el que mantiene el test dentro de su presupuesto (CTR-18.7).",
      "type": "array",
      "minItems": 1,
      "maxItems": 400,
      "items": {
        "type": "string",
        "pattern": "^(?:([sp])(<\\^|>\\^|<|>|\\^)|-) ([1-9][0-9]{0,3})$"
      }
    }
  }
}
```

**Lo que `T-267` tiene que probar en rojo contra este schema**, con `erroresDeInstancia()` de
`esquemas.test.ts`, que es el mecanismo que ya existe para eso: un renglón `"s< p> 4"`; un
renglón `"s<> 4"`; `"s< 0"`; una clave `"NIV-1"`; y `cuadrosPorSegundo: 50`. Y en verde, el
ejemplo de `CTR-18.9` tal como está.

### CTR-18.11 — Los módulos, y lo que cada uno no puede importar

Mismo criterio que `CTR-16.8`: lo que evita el defecto de `D-29` es que cada módulo sepa qué no
puede tocar.

| Módulo | Qué hace | Qué **no** puede importar, ni quién lo puede importar a él |
|---|---|---|
| `src/lib/skayboy/mundo.ts` | **suma `CUADRO_SEG = 1/60`**, exportado. Es el único lugar del repo donde vive ese número | lo que ya no importaba (`mundo.test.ts:398-404`) |
| **`src/lib/skayboy/soluciones.ts`** (nuevo) | lee y escribe renglones con **una sola** expresión, expande y comprime, repite (`CTR-18.5`), encuentra bordes, arma variantes, verifica y calcula la tolerancia, cuenta la paridad —el suceso `compuerta` y el cruce, que lee del mundo (`CTR-18.8`)—; y declara `TOLERANCIA_MINIMA_CUADROS` por escalón con `BR-29` citado en cada línea | nada fuera de `mundo.ts` y `niveles.ts`: **ni `node:*`, ni motor, ni DOM** — el archivo lo lee quien lo llama y se lo pasa. **No lo importa la isla ni ninguna página** |
| `src/lib/skayboy/solucionador.ts` (`T-266`) | la búsqueda, y el ensanchado | `mundo.ts`, `niveles.ts`, `soluciones.ts`. **No escribe su propio lector de trazas**: si `T-266` ya lo tiene adentro, `T-267` lo muda a `soluciones.ts`. Dos lectores son dos formatos. No lo importa la isla ni ninguna página |
| `scripts/resolver-niveles.mjs` (`T-266`) | la entrada y salida: lee los dos JSON, imprime, y es **el único que escribe** `skayboy-soluciones.json` | — |
| `src/lib/skayboy/soluciones.test.ts` (`T-267`) | las once reglas de `CTR-18.6` | — |
| La isla y la página | lo de siempre | **no importan** `skayboy-soluciones.json`, `soluciones.ts` ni `solucionador.ts`. Lo caza la regla 10 |

**Por qué el mínimo de `BR-29` vive en `soluciones.ts` y no en el test:** lo usan el test (regla
8) y el script (`T-277` tiene que ver *"tolerancia ≥ la de BR-29 en cada escalón"*). Dos copias
del número son dos números.

### CTR-18.12 — Lo que este contrato deja abierto

| Qué | De quién | Mientras tanto |
|---|---|---|
| **`TOLERANCIA_MINIMA_CUADROS`** por escalón | **Cerrado el 2026-09-23 por `BR-29` punto 3**: 10, 6 y 4 cuadros para los escalones 1, 2 y 3 | `soluciones.ts` los declara citando `BR-29` en cada línea (`CTR-18.11`) y `T-267` escribe la regla 8 con ellos. Pasan con margen el piso técnico de 2 cuadros (`ADR-09.1`); `producto` lo verificó al pie de `ARQ-para-producto-la-tolerancia-de-la-traza.md`. *Decía: "`T-267` no escribe la regla 8 sin el número. No se inventa uno."* |
| **El suceso de la paridad y la regla de atribución** | **Cerrado el 2026-09-22 por `CTR-16.10.7`**: un suceso `compuerta` con `por`, y la caja atribuida por su `empujadaPor` (`CTR-16.10.5`). `T-272` lo emite; el cruce lo lee la cuenta (`CTR-18.8`) | Hasta `T-272`, la regla 9 da 0 y 0 y no puede fallar, y la 11 no tiene cajas que mirar. Se encienden solas |
| **La traza de a dos** | no se graba (`CTR-18.4`). **Cerrado el 2026-09-23:** `BR-29` punto 1 le dio (a) solo al teléfono | La salida de `CTR-18.4` queda escrita y sin uso. Ninguna regla mira una traza de a dos. *Decía: "Si `BR-29` le da (a) a la máquina: segunda traza al lado de `deUno`, `CTR-18` versión 2."* |
| **Una pausa mínima en cada cambio de columna** | **Cerrado el 2026-09-22: `CTR-16.10` no trae reloj** (su regla 1) | No hace falta: las reglas 7 y 11 dejan el mundo quieto en cada cambio (`CTR-18.6`). Vuelve solo si entra una pieza con reloj, y es `CTR-18` versión 2 |
| **La foto del mundo** (repetir desde el borde) | el hilo principal, solo si el test se pasa de 10 s | Se repite desde el cuadro 0 |
| **Retirar `verificaciones.solo`** | **Cerrado el 2026-09-23:** `BR-29` punto 4 lo retira, y `CTR-16.7` enmendado trae el fragmento de schema. Entra en la versión 2 de `CTR-16`, con `T-272` | Hasta que `T-272` pegue, el dato de `NIV-01` todavía trae el `solo` en `false` y no molesta a nadie: no hay ningún nivel `listo`. *Decía: "`CTR-16` versión 2, solo si `BR-29` no le deja al pulgar nada del modo solo · Se queda con el sentido de `ADR-09.3`."* |

---

## Cómo se verifica

`arquitectura` no corre comandos (`D-12`): los corre `revisor`, `orquestador` o el hilo
principal.

```bash
# 1. Este documento: exactamente dos líneas, los dos encabezados.
rg -n "^## (ADR-09|CTR-18)" Docs/ARQ/ARQ-solucion-grabada.md

# 1b. La paridad cita a CTR-16.10 en vez de contradecirlo (pasada de coherencia, 2026-09-22).
#     La primera devuelve líneas de CTR-18.8 y de CTR-18.12; la segunda, solo líneas de
#     enmienda (los corchetes están para que ninguna de las dos se encuentre a sí misma).
rg -n "empujada[P]or" Docs/ARQ/ARQ-solucion-grabada.md
rg -n "nadie si fue una [c]aja" Docs/ARQ/ARQ-solucion-grabada.md Docs/SUGERENCIAS/ARQ-para-hilo-principal-la-solucion-grabada.md

# 1c. (2026-09-23) `solo` se retiró: ningún ejemplo de JSON de los dos contratos lo trae como
#     clave. Tiene que salir vacío.
rg -n '"s[o]lo"' Docs/ARQ/ARQ-schema-niveles.md Docs/ARQ/ARQ-solucion-grabada.md

# 1d. (2026-09-23) Nada exige una traza de a dos. Solo devuelve líneas de enmienda (las que
#     citan el texto viejo entre comillas o empiezan con "Enmendado"/"Decía").
rg -n "ni la de [d]os|mira las [d]os" Docs/ARQ/ Docs/SUGERENCIAS/ARQ-para-hilo-principal-lo-que-arrastra-ctr-16-10.md

# 1e. (2026-09-23) La regla 3 de CTR-16.5 y los dos casos nuevos de CTR-16.10.10 existen.
rg -n "^3\. \*\*Cada entrada tiene|^\| E8 \||^\| M7 \|" Docs/ARQ/ARQ-schema-niveles.md
```

Y cuando `T-267` pegue el contrato:

```bash
# 2. El dato valida contra el schema, y el schema rechaza los cinco rojos de CTR-18.10.
node --test src/lib/esquemas.test.ts

# 3. Las once reglas de CTR-18.6 sobre el banco de verdad.
node --test src/lib/skayboy/soluciones.test.ts

# 4. La isla a paso fijo: rojo si `k.dt()` vuelve a la llamada de `paso(`.
node --test src/lib/skayboy/motor.test.ts

# 5. Ninguna página ni ninguna isla nombra las trazas. Tiene que salir vacío.
rg -n "skayboy-soluciones|solucionador|skayboy/soluciones" src/pages src/scripts src/components src/layouts
```

Y cuando `T-272` emita el suceso `compuerta` y `T-277` cargue los seis niveles:

```bash
# 6. El par de paridad de cada nivel, contra la tabla de CTR-18.8 (que es la de UX-31 §4):
#    0·0, 0·0, 1·0, 0·1, 1·1, 1·1, y 3 a 3 en el banco. Si un nivel da otro par, se mira
#    primero la grilla contra la intención de UX-31 §3, no la cuenta.
node scripts/resolver-niveles.mjs --todos
```

**Los tres rojos a mano de `T-267`, ajustados a lo que este contrato deja probar:** la traza de
`NIV-01` recortada **un cuadro al final** (`"p> 38"`: regla 5, no gana); un renglón con dos
columnas (`"s< p> 4"`: reglas 3 y 4, y el schema); y **`VELOCIDAD` ±10 %** en `mundo.ts` (regla
5: gana en otro cuadro). *`GRAVEDAD` +10 % no sirve con el banco de hoy: en `NIV-01` nadie salta
(`ADR-09`, consecuencia 2).*
