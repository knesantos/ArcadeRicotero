# REV-11 — La imprenta de Rocambole (ciclo 12)

> Rol dueño: `revisor`. Tarea: `T-209` del ciclo 12. Fecha: **2026-09-02**.
> Verifica: `Docs/UX/UX-22-la-imprenta-de-rocambole.md`, `Docs/UX/UX-20-el-sitio-como-lugar.md`,
> `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`, `D-21`, `D-14`, `D-19`,
> `Docs/ARQ/ARQ-separaciones-de-tapa.md` (`ADR-05`, `CTR-12`),
> `Docs/CONTENIDO/CNT-14-las-palabras-de-la-imprenta.md`, contra el código construido en el
> ciclo 12 (`T-195`..`T-208`, commits `d3efb56` y `a893329`, con la corrección posterior de
> `T-205` en `b9e8598` incorporada por indicación del hilo principal, sin re-auditar).
> Produce: `FIND-46`..`FIND-51` (`REV-10` cerró en `FIND-45`).
>
> **Nota de autoría, para que no se lea mal.** El contenido es de `revisor`. El archivo lo
> pegó el hilo principal porque el rol no tiene `Write` — es el mismo reparto que `D-12`
> declara para los comandos: quien produce no siempre es quien escribe en el disco.

---

## Método

Se leyó en orden `UX-22` → `UX-20` → `diseno-marca.md`/`voz-ricotera.md` → `D-21`/`D-14`/`D-19`
→ `ARQ-separaciones-de-tapa.md` (`ADR-05`/`CTR-12`) → `CNT-14` → `INV-54`, y recién después el
código de los dos commits del ciclo, tal como estaba en el árbol de trabajo al momento de
revisar. Se corrió `npm test` (**436/436** verde), `npm run check` (**0 errores, 0 avisos**, 9
hints) y `npm run build` (**150 páginas**) — los tres verdes.

Dos hallazgos de esta ficha llegan con una corrección posterior, comunicada por el hilo
principal después de cerrada la revisión de código y **no re-auditada por `revisor`**: se
deja constancia de qué se verificó de primera mano y qué se toma como reportado.

## El límite del entorno

Igual que en `REV-10`: esta revisión no tuvo un teléfono real ni un navegador visible para
correr. **Nada de lo que sigue sobre "cómo se ve" o "cómo se siente" la impresión se
comprobó en pantalla** — es lectura de código, de tests y de los tres comandos de arriba.
Queda una lista al final para quien tenga un dispositivo en la mano.

## Veredicto

> ## 🟡 La doctrina se sigue con disciplina, pero dos hallazgos —uno ya corregido, uno
> confirmado y en corrección— son del mismo tipo que bajó la nota en `REV-10`: el mapa de lo
> declarado dejó de coincidir con el código en un punto no menor (`D-21`, no negociable).

---

## HALLAZGOS

### FIND-46 — El crédito del pie no acumula los discos de la sesión

**Severidad: mayor.**

**Estado: confirmado por el hilo principal, en corrección (no en este árbol al momento de
escribir esta ficha).**

**Qué se entregó:** `ponerLaSala()`/`sacarLaSala()` en `partida-tema.ts`, que recalculan el
pie de página (`.credito-tapas`) cada vez que la sala cambia de disco o vuelve a Lobo suelto.

**Criterio incumplido:** `UX-22 §2.5` — *"sumando cada disco que efectivamente se imprimió o
vistió el fondo durante la sesión, deduplicado, con el mismo patrón de texto"* — y `D-21`
condición 1 (el crédito dice qué tapas se usaron en esa pantalla). `PORTAL.creditoTapas`
(`sitio/copy.ts:56-59`) arma la frase con "**en esta pantalla**, arte de...".

**Evidencia:** `src/scripts/partida-tema.ts:1014-1028`, `creditoDePantalla()` lee
`credito.dataset.tapas` para armar `base`, pero **nunca lo reescribe** con la lista
acumulada. Cada `arrancarTema()` llama `sacarLaSala()` → `creditoDePantalla(null)`, que
recalcula `base` desde el atributo DOM **original y estático** (el que puso Astro en build),
no desde lo que ya se mostró en la sesión. Resultado trazado a mano: tema 1 acertado con
Oktubre → pie dice "Lobo suelto, Oktubre"; al pasar al tema 2, el pie vuelve a decir solo
"Lobo suelto" — Oktubre desaparece del crédito aunque su tapa ya se imprimió en pantalla
durante la sesión.

**Qué hacer:** hilo principal — que la lista sobreviva entre temas en vez de recalcularse
desde el atributo estático. Confirmado como en curso; anotar en `ESTADO.md` cuando cierre.

---

### FIND-47 — `T-205` ("la tirada como afiche") no estaba construido pese a declararse cerrado

**Severidad: bloqueante en el momento de esta revisión.**

**Estado: CORREGIDO en `b9e8598`, verificado (reportado por quien corrigió; no re-auditado
en esta ficha por indicación explícita del encargo).**

**Qué se entregó (al momento de encontrar el hallazgo):** el commit `d3efb56` declaraba en
su mensaje *"T-205: la tirada se maqueta como afiche"*, pero `pintarResultado()` en
`partida-tema.ts` seguía armando `<ol class="resumen">` sin ninguna imagen por tema —solo
el símbolo de acierto o error más texto, idéntico al resumen previo al ciclo— y
`RESULTADO.afiche` (`tema/copy.ts`, la línea que canta escrita por `CNT-14 §2.6`) no se
usaba en ningún lado del script ni del CSS.

**Criterio incumplido:** `Docs/ORQ/ORQ-plan-ciclo-12.md`, fila `T-205` ("el resumen de la
vuelta lleva cada tapa como estampa chica... y se maqueta como afiche de recital"); `UX-22
§10`.

**Evidencia (al momento del hallazgo):** `src/scripts/partida-tema.ts:1099-1113` sin llamada
a `estampaDe()`; `grep -rn "RESULTADO.afiche"` sin resultados fuera de su propia declaración
en `copy.ts`.

**Corrección reportada:** `armarEstampita()` en `partida-tema.ts` pone la tapa de cada tema
del setlist —la ficha a color si se acertó, `pasadas[2]` (la clave) si no— a 32 px, sobre
papel y rotada, con `aria-hidden` porque el símbolo ya dice el resultado; `RESULTADO.afiche`
se pinta como `.afiche-canta` arriba del rótulo de la lista; `.estampita` en `juego.css` no
lleva animación. Verificado a 375×812 y a 320 px sin desborde horizontal.

**Qué hacer:** nada pendiente sobre el código. Sí queda una lección de proceso: un commit
declaró cerrada una tarea que no lo estaba — vale la pena que quien cierre un frente corra
`npm test`/`grep` de las cadenas nuevas contra el código antes de escribir el mensaje de
commit, no solo contra los tests (que no atraparon esto: nada auditaba que `RESULTADO.afiche`
se *usara*, solo que existiera como cadena válida).

---

### FIND-48 — `.estampa-papel` no lleva `isolation: isolate`

**Severidad: mayor.**

**Qué se entregó:** el contenedor de la estampa (`.estampa-papel`, `src/styles/juego.css`),
con tres imágenes de pasada apiladas en `mix-blend-mode: multiply`.

**Criterio incumplido:** `UX-22 §2.2` — *"esa pila tiene que quedar aislada del resto de la
página... sin `isolation: isolate` en el contenedor de la estampa esa mezcla podría
filtrarse contra lo que sea que esté detrás en el documento, no solo contra `--papel`"*.

**Evidencia:** `src/styles/juego.css:2238-2249` (`.estampa-papel`): `position: relative`,
`overflow: hidden`, `background: var(--papel)`, `border`, `rotate`, `box-shadow` — **sin
`isolation`**. `grep -rn isolation src/styles/*.css` no devuelve una sola coincidencia en
todo el repo.

**Qué hacer:** hilo principal — agregar `isolation: isolate;` a `.estampa-papel` (y a
`.estampa-papel--abre`, que hereda el mismo riesgo en "Adiviná la tapa").

---

### FIND-49 — El taller construido no coincide con `ADR-05.1`/`CTR-12` tal como están escritos, y el desvío no fue ratificado

**Severidad: mayor.**

**Qué se entregó:** `scripts/generar-pasadas.mjs`, con un algoritmo de separación que
introduce una cuarta zona — "papel sin imprimir" — de hasta el 20 % de cada tapa.

**Criterio incumplido:** `Docs/ARQ/ARQ-separaciones-de-tapa.md`, `ADR-05.1` regla 4 ("la
clara se lleva el 25 % más luminoso, la media el 40 % siguiente, la clave el 35 % restante")
y regla 5 ("las tres máscaras son disjuntas y suman la imagen entera"); `CTR-12 §5`, casos
11 y 12.

**Evidencia:** el propio comentario de cabecera de `generar-pasadas.mjs` (líneas 53-60)
declara el desvío y lo justifica con las cinco versiones probadas; el pedido de
ratificación está en `Docs/SUGERENCIAS/HILO-para-arquitectura-el-papel-de-la-estampa.md`
("Ratificar el papel como cuarta zona en `ADR-05.1`... o corregirme").
`Docs/ARQ/ARQ-separaciones-de-tapa.md` sigue, sin editar, con la regla de 25/40/35 y "suman
la imagen entera". `src/lib/tapa/pasadas.test.ts` (línea 234-253) ya audita el comportamiento
nuevo —no el del contrato— con un comentario que cita el mismo HILO: el guardián y el
contrato divergen a sabiendas, y el contrato es el que no se movió.

**Qué hacer:** `arquitectura` — resolver el HILO: ratificar la cuarta zona en `ADR-05.1`/
`CTR-12` con los números reales (clave ≥ 30 %, papel ≤ 20 %), o corregir el taller.

---

### FIND-50 — `CNT-14 §2.2` describe un sello que `UX-22` contradice, y no se reabrió

**Severidad: menor.**

**Qué se entregó:** `Docs/CONTENIDO/CNT-14-las-palabras-de-la-imprenta.md §2.2`, con un
sello de dos renglones (`ROCAMBOLE` / `BAJA RESOLUCIÓN`) para la estampa, y la fila
`REVELACION.credito.autor`/`.resolucion` en su tabla `§3`.

**Criterio incumplido:** coherencia interna del propio frente A del ciclo. `UX-22 §2.5`
(misma fecha, versión v2 tras refutación adversarial) dice explícito: *"No lleva un sello
propio en la estampa"*. La propia `CNT-14` se auto-condiciona: *"Si `UX-22` termina fijando
algo que contradiga una de estas líneas, se reabre esta pieza — no antes"*.

**Evidencia:** `CNT-14 §2.2` y su tabla `§3` siguen como estaban; `src/lib/tema/copy.ts` no
define `REVELACION.credito.autor` ni `.resolucion` — el código sigue correctamente a
`UX-22`, pero el documento de `contenido` quedó desactualizado y sin la nota de reapertura
que él mismo prometió.

**Qué hacer:** `contenido` — reabrir `CNT-14 §2.2` y ajustar la tabla `§3` para que no
prometa un campo que el código, con razón, nunca creó.

---

### FIND-51 — El scroll a "Seguí" tensiona "nada retrasa el dedo", sin ratificar

**Severidad: menor.**

**Qué se entregó:** en "Adiviná el tema" y "Adiviná la tapa", al responder el foco va al
botón "Seguí"/"primario" con `{ preventScroll: true }` y la vista se lleva con
`scrollIntoView({ block: 'start' })` a la figura de la estampa, no al botón.

**Criterio incumplido:** ninguno *a la letra* — `UX-20 §1.3` mide milisegundos hasta que el
botón responde (0 ms, cumplido: el foco y el listener ya están puestos). Pero
`ORQ-plan-ciclo-12` cita "nada retrasa el dedo" como uno de los cuatro límites que el ciclo
no puede aflojar, y en la práctica quien juega con el dedo o el mouse tiene que desplazar la
pantalla antes de poder tocar "Seguí" — una fricción nueva que no existía en la revelación
de texto plano del ciclo 11.

**Evidencia:** `src/scripts/partida-tema.ts:878-887` (comentario y código) y
`src/scripts/partida-tapa.ts:140-157` (misma corrección, mismo motivo declarado). Es un
trade-off razonado por escrito en el propio código — no es un descuido — pero **ninguna
hoja de `experiencia` lo ratificó** como excepción, a diferencia de desvíos análogos que
`REV-10` sí encontró ratificados o pendientes de ratificar (`FIND-43`, `FIND-44`).

**Qué hacer:** `experiencia` — decidir por escrito en `UX-22`/`UX-20` si este intercambio
(ver el premio contra un scroll corto) es una excepción aceptada, y con qué límite.

---

## LO QUE ESTÁ BIEN

- **436/436 tests, `npm run check` limpio, build de 150 páginas.**
- **El eco de `§8` con solo corrimiento, sin rotación, en texto:** justificado por escrito
  en `sitio.css:1004-1008` — `text-shadow` no rota, y duplicar el texto en un `::before`
  para poder rotarlo arriesgaría una segunda lectura para un lector de pantalla. Razonamiento
  sólido, coherente con `voz-ricotera.md` y con el resto del sitio. **Alcanza.**
- **Los techos de `UX-22 §1.1`:** la fórmula 3×`--escalon-pasada`+`--duracion-pasada` da
  1020 ms, verificado en `tokens.css` y en `pasada`/`fijado`/`sala`/`carrete` de
  `movimiento.test.ts`, con equivalente quieto correcto para las cuatro y sin tocar
  `--duracion-toque`.
- **El taller y su guardián (`pasadas.test.ts`):** 40 archivos, tinta plana, un solo RGB por
  archivo y es el del token, clave siempre `--fondo` — el test del "riesgo del ciclo" pasa.
- **Las tres pantallas graves y el juego de dos ejes** siguen sin imprenta ni registro
  imperfecto: lista cerrada de selectores en `estilos.test.ts`, sin intrusos.
- **`RES-54`** no inventa el orden de pasadas: lo trae con fuente, separa criterio de oficio
  de reconstrucción de Rocambole, y avisa dónde no hay dato (aerografía real de *Lobo
  suelto* y *Cordero atado*, `RES-54.12`).
- **El disco en sus propias letras (`CNT-14 §2.7`):** verificado glifo por glifo, los tres
  nombres calcados sin tilde donde corresponde, los otros siete con su tilde real en
  `--fuente-rotulada`.

---

## LAS PREGUNTAS DE `T-209`

### ¿Sorprende la tapa?

> 🟡 **Mecánicamente sí**, y bastante más que "una ficha de texto": impresión progresiva en
> los colores reales de esa tapa, la sala que se vuelve el disco, el audio sincronizado, un
> objeto que se da vuelta para mostrar la trasera real con la pista estampada. Con la
> corrección de `T-205` (`b9e8598`), la sorpresa además se extiende a la vuelta completa: el
> afiche del resumen lleva las cuatro tapas chicas. Lo que falta para firmar en verde: nadie
> lo vio funcionar en una pantalla real, y `FIND-46` significa que, si se juega una vuelta
> larga, el crédito que acompaña esa sorpresa no siempre dice la verdad sobre qué se mostró.

### ¿La imprenta se volvió plantilla?

> 🟡 **Mayormente no**, y es lo que más tranquiliza de esta revisión: los colores están
> horneados por disco y verificados píxel a píxel (`pasadas.test.ts`, el test que existe
> específicamente para este riesgo), la degradación por capa está declarada, y el eco de
> `§8` vive en una lista cerrada que un test audita. Pero dos grietas técnicas concretas
> —`FIND-48` (sin aislar el `multiply`) y `FIND-49` (el propio taller ya no imprime "los
> colores medidos" sino "los colores medidos, salvo hasta un 20 % que directamente no se
> imprime")— son exactamente el tipo de cosa que, sin corregir, convierte con el tiempo una
> técnica citada con fundamento en un efecto que se parece a la técnica pero ya no la prueba.

### Las tres preguntas del ciclo 11, repetidas sobre este ciclo

1. **¿Algo se mueve para llamar la atención sobre sí mismo?** No. La única animación de
   entrada nueva y sostenida es la estampa, y está argumentada como "la sala volviéndose el
   disco" —una excepción acotada con techo propio (`UX-22 §1`)—, no un elemento pidiendo
   aplausos. El carrete del casete gira solo mientras hay audio real sonando: es señal, no
   decoración.
2. **¿Algo se retrasa abajo del dedo?** A nivel de código, no (0 ms hasta que "Seguí"
   responde). Pero `FIND-51` documenta una fricción real y sin ratificar: hace falta un
   scroll corto para llegar al botón después de responder. Sigue **pendiente de confirmar
   con el dedo**, igual que en `REV-10`.
3. **¿Se siente un lugar, o se siente una web con animaciones?** Pesa hacia "lugar" en lo
   visual y en la disciplina del código, pero `FIND-46` y `FIND-47` (este último ya
   corregido) son la misma familia de síntoma que bajó la nota en `REV-10`: el mapa de lo
   declarado dejó de coincidir con el código, en el mismo ciclo que más depende de que esa
   correspondencia se sostenga.

---

## PENDIENTE DE VERIFICAR EN UNA PANTALLA DE VERDAD

1. Ver la secuencia completa de la estampa (clara → media → clave → fijado) funcionando en
   un celular real, con y sin `prefers-reduced-motion`.
2. Confirmar con el dedo, no con el ojo, que el scroll de `FIND-51` es tan corto como dice
   el código y no una espera real.
3. Jugar una vuelta larga (más de 4 temas, si se puede repetir disco) y confirmar en vivo
   que el pie de página, después de la corrección de `FIND-46`, acumula todos los discos
   mostrados y no solo el último.
4. Ver el afiche del resumen (`T-205`, corregido en `b9e8598`) a 375×812 con las cuatro
   estampitas, algunas a color y alguna en clave, y confirmar que se lee como afiche y no
   como cuatro miniaturas sueltas.
5. Forzar visualmente algo detrás de la estampa (scroll, otro elemento con color fuerte) y
   confirmar si `FIND-48` (falta de `isolation`) produce una mezcla visible antes de
   corregirlo.
6. Comparar dos discos revelados uno al lado del otro y confirmar que ninguno se lee
   "genérico" pese a la cuarta zona de papel sin imprimir de `FIND-49`.
