# REV-10 — El sitio como lugar (ciclo 11)

> Rol dueño: `revisor`. Tarea: `T-193` del ciclo 11. Fecha: **2026-09-01**.
> Verifica: `UX-20-el-sitio-como-lugar.md`, `ADR-03` (tránsito), `ADR-04` (cama de cinta),
> `UX-21` (el interruptor), `CNT-13` (los nombres del lugar), `.claude/rules/diseno-marca.md`,
> `.claude/rules/voz-ricotera.md` y `D-14` (molinetes abiertos), contra el código construido
> en el ciclo 11 (`T-176`..`T-192`).
> Produce: `FIND-38`..`FIND-45` (`REV-09` cerró en `FIND-37`).

---

## Método

Este informe consolida **cuatro revisiones independientes** corridas en paralelo, cada una
con su propia lente: (1) estética genérica de IA contra `diseno-marca.md`, (2) molinetes
abiertos (`D-14`) y quien no ve la pantalla, (3) integridad del circuito — ¿lo construido
obedece a lo escrito?, y (4) las cuatro preguntas de `T-193` contra el conjunto de la
doctrina. Sobre esa consolidación corrí una verificación propia de los hallazgos con más
impacto antes de firmarlos: `git status`, `git diff --stat` y `git diff` completo sobre los
dos archivos en disputa, lectura directa de `sitio.css`, `tokens.css`, `UX-21`, `UX-20` y el
HILO de desvíos, `grep` sobre `Docs/SUGERENCIAS/` y `ESTADO.md`, y una corrida propia de
`npm test` (417/417 verde) y `npm run check` (0 errores, 0 advertencias). Donde dos lentes
discreparon, la evidencia de código decide, no el promedio de veredictos.

## El límite del entorno — primero, y con todas las letras

**El navegador de las cuatro revisiones y de esta consolidación mantiene el documento en
`visibilityState: "hidden"`. Chrome saltea las `@view-transition` en documentos escondidos.**
Esto significa que **el cruce real entre pantallas —el paso que sale, el que entra, la
hondura del tránsito, el umbral completo de la portada— no se pudo ver funcionando en
ningún momento de este ciclo de revisión.** Lo que sí se verificó, de forma repetida e
independiente: que las reglas `@view-transition` existen en `tokens.css`, que se aplican
vía CSSOM, que hay una sola adhesión y tres nombres (`lugar`/`marca`/`mosca`) sin ninguno
sobre una zona de partida, y que `movimiento.test.ts` (11/11) prueba el mecanismo y sus
techos numéricos. **Nada de esto equivale a haberlo visto cruzar en una pantalla real.**
Ninguna afirmación de este informe sobre "cómo se ve" o "cómo se siente" el tránsito debe
leerse como si se hubiera comprobado — se aclara pieza por pieza donde corresponde, y queda
una lista corrible al final para quien tenga un teléfono en la mano.

## Contradicción entre lentes, y quién gana

Dos lentes aprobaron el ciclo (estética anti-slop; integridad del circuito) y dos lo
rechazaron (molinetes/`D-14`; las cuatro preguntas de `T-193`), sobre el mismo hecho:
`src/pages/quiz.astro` y `src/pages/juegos/adivinar-el-tema.astro` —ambos declarados
explícitamente fuera de alcance por el propio plan del ciclo— fueron editados por tareas
de este ciclo. Verifiqué esto de nuevo por mi cuenta con `git diff --stat` y `git diff`
completo: es un hecho, no una interpretación (`FIND-38`). **Gana la evidencia:** el
veredicto general de este informe sigue a las lentes 2 y 4, no el promedio con las otras
dos. Que dos lentes no lo hayan encontrado no lo vuelve menos cierto — la de "integridad
del circuito" revisó citas rotas y alcance de tokens con lupa, pero no corrió `git diff`
contra el mapa de conflictos del plan, que es exactamente donde vivía este hallazgo.

## Veredicto

> ## 🟡 No se puede cerrar el ciclo como "hecho" todavía. La doctrina y el código
> mayormente se corresponden, pero hay una brecha de alcance confirmada por evidencia
> directa y una pieza central —el tránsito entre pantallas— sin verificar en un
> dispositivo real.

---

## HALLAZGOS

### FIND-38 — `quiz.astro` y `adivinar-el-tema.astro` se editaron pese a estar excluidos por escrito

**Severidad: bloqueante.**

**Qué se entregó:** `CNT-13` (la línea "dónde estás") y el interruptor de cinta
(`ADR-04`/`UX-21`) se cablearon también en `src/pages/quiz.astro` y en
`src/pages/juegos/adivinar-el-tema.astro`.

**Criterio incumplido:** `Docs/ORQ/ORQ-plan-ciclo-11.md`, "Mapa de conflictos con el ciclo
10" y su "Corrección del 2026-09-01" (los dos archivos, listados letra por letra como
"suyos... ninguna tarea de este ciclo los edita"); `Docs/UX/UX-21-el-interruptor-de-cinta.md`
§1 ("`quiz.astro` no pasa por `Base.astro`... La cinta no aparece ahí todavía"); `ESTADO.md`
líneas 78 y 127-128 ("Ningún otro archivo se pisó de los dos lados" / "no los toca ninguna
tarea del 11").

**Evidencia (verificada por mí, no solo citada):** `git diff --stat -- src/pages/quiz.astro
src/pages/juegos/adivinar-el-tema.astro` → `2 files changed, 21 insertions(+), 3
deletions(-)`. El diff completo de `quiz.astro` agrega `import { PORTAL, LUGARES }` +
`<p class="donde-estas">{LUGARES.quiz}</p>` y un `<script>import '../scripts/cinta.ts'`
nuevo; el de `adivinar-el-tema.astro` agrega lo mismo más un cambio de tamaño de fuente en
`.marca`. Ninguno de estos módulos (`CNT-13`, `cinta.ts`, `ADR-04`) existía antes de este
ciclo. Y `Docs/SUGERENCIAS/HILO-para-experiencia-tres-desvios-del-ciclo-11.md` punto 3,
escrito por la misma sesión, confirma que el interruptor se instaló en "las seis pantallas
de juego" — es decir, los cinco juegos **más quiz** — contradiciendo en el mismo ciclo lo
que `UX-21` §1, también de esta sesión, declara sobre el mismo archivo.

**Qué hacer:** orquestador o hilo principal decide entre revertir las dos ediciones hasta
que cierre `T-167` del ciclo 10, o ratificar por escrito la excepción — corrigiendo `UX-21`
§1, el mapa de conflictos del plan y `ESTADO.md`, que hoy afirman los tres algo falso. Y
confirmar contra la sesión del ciclo 10 que nada de su trabajo en esos archivos se perdió.

---

### FIND-39 — El umbral del grano y de la figura son el fundido que el propio comentario dice no usar

**Severidad: mayor.**

**Qué se entregó:** el umbral de la portada (`T-185`), tres sub-pasos: grano, figura, marca.

**Criterio incumplido:** `.claude/rules/diseno-marca.md` (tabla anti-slop, fundido de
entrada vetado) + el comentario de cabecera del propio `src/styles/sitio.css:44-50`, que
llama al fundido de entrada "el tic de plantilla número uno" y afirma que "ni la figura ni
la marca arrancan invisibles y hacen fade".

**Evidencia:** `sitio.css:64-68`, `@keyframes umbral-grano { from { opacity: 0; } }` sobre
`.con-grano::after` (el grano de toda la pantalla) — arranca en `opacity: 0` literal, la
definición exacta del patrón vetado. `sitio.css:77-86`, `@keyframes umbral-figura` anima
`opacity: 0.35 → 0.9` junto con `translate` — un fade-up. El comentario defiende solo "la
figura" y "la marca" sin nombrar al grano, que es el único de los tres sub-pasos que sí
cumple al 100 % la definición del patrón que dice evitar. Solo `umbral-sello` (la marca,
líneas 94-103) evita `opacity` por completo.

**Qué hacer:** `experiencia`, dueña de `UX-20` §0 y del umbral (`T-185`): o ajusta
`umbral-grano` para que no arranque en `opacity: 0` literal (ej. un mecanismo de asentamiento
sin opacidad), o corrige el comentario para que no afirme una ausencia de fundido que el
código no cumple del todo. Es de ojo y de doctrina, ningún test lo puede detectar.

---

### FIND-40 — Dos comentarios de código citan archivos de `Docs/SUGERENCIAS/` que no existen

**Severidad: menor.**

**Qué se entregó:** `src/styles/tokens.css:178` y `src/scripts/cinta.ts:28` citan, cada uno,
una propuesta pendiente para `experiencia` en un archivo específico de `Docs/SUGERENCIAS/`.

**Criterio incumplido:** `CLAUDE.md` §3, regla de propiedad — la propuesta cruzada tiene que
ser localizable en la carpeta que corresponde.

**Evidencia:** `HILO-para-experiencia-escalon-del-umbral.md` y
`HILO-para-experiencia-cinta-durante-la-partida.md` no existen — confirmado con `ls
Docs/SUGERENCIAS/`. El contenido real de ambos quedó consolidado en un tercer archivo,
`HILO-para-experiencia-tres-desvios-del-ciclo-11.md` (puntos 1 y 3), y las citas del código
nunca se actualizaron al nombre real.

**Qué hacer:** hilo principal corrige las dos citas para que apunten al archivo real, o
separa el HILO en los dos archivos que el código ya promete por nombre.

---

### FIND-41 — El interruptor de cinta se esconde en las pantallas de juego, `UX-21` §7 dice que nunca

**Severidad: menor.**

**Qué se entregó:** el interruptor de cinta cableado en la cabecera de las pantallas de
juego, incluido `quiz.astro`.

**Criterio incumplido:** `Docs/UX/UX-21-el-interruptor-de-cinta.md` §7 ("la cama se calla,
el interruptor se queda" — nunca se esconde).

**Evidencia:** en las seis pantallas de juego, `<header class="cabecera-sitio">` —donde
cuelga el interruptor— vive dentro de `#portada`, y `src/scripts/partida.ts` oculta esa
sección entera al empezar la partida; el interruptor se va con ella y vuelve al terminar.
Ya está declarado como desvío conocido en `HILO-para-experiencia-tres-desvios-del-ciclo-11.md`
punto 3, con dos salidas propuestas y ninguna aplicada todavía.

**Qué hacer:** `experiencia` elige una de las dos salidas que ya deja escritas el HILO
(mover la cabecera afuera de `#portada`, o aceptarlo como está y decirlo en `UX-21`).

---

### FIND-42 — `UX-20` §1.4 dice "por ciento del ancho", el código mide "por ciento del alto"

**Severidad: menor.**

**Qué se entregó:** `--deriva-capa-fondo: 8%`, aplicado con `transform:
translateY(calc(-1 * var(--deriva-capa-fondo)))`.

**Criterio incumplido:** `Docs/UX/UX-20-el-sitio-como-lugar.md` §1.4 ("Recorrido máximo de
una capa al desplazar: 8% **del ancho** de la capa").

**Evidencia:** `sitio.css:204-208` usa `translateY`; por la especificación de CSS
Transforms, el porcentaje de `translateY` se resuelve contra el **alto** de la caja de
referencia, nunca contra el ancho. El efecto está bien acotado y justificado en el propio
CSS, pero el número que audita `§1.4` mide algo distinto de lo que dice medir.

**Qué hacer:** `experiencia` confirma si `§1.4` debía decir "del alto" (redacción
imprecisa) o si el criterio real era otro.

---

### FIND-43 — `T-186` prometía la deriva "en cada lugar", solo la tiene el portal

**Severidad: menor.**

**Qué se entregó:** `--deriva-capa-fondo` / `@keyframes deriva-de-capa`.

**Criterio incumplido:** `Docs/ORQ/ORQ-plan-ciclo-11.md`, fila `T-186` ("dos capas de
fondo... que se corren distinto al desplazar", en plural, "cada lugar").

**Evidencia:** `sitio.css:210-213`, el propio comentario dice "Y la lleva una sola capa: la
franja fija del portal". Solo `.tapa-fondo--portal` recibe `animation-name: deriva-de-capa`;
`.tapa-fondo--lobo-tiras`, `--mosca-olla`, `--bondi-engranajes` y `--gulp-pincelada` no la
reciben. La razón técnica está bien argumentada en el CSS (evita descubrir el borde de una
caja acotada), pero la reducción de alcance no quedó ratificada en el HILO de decisiones de
`experiencia`, a diferencia de los otros tres desvíos de la misma sesión.

**Qué hacer:** agregar esta como cuarta desviación declarada en el HILO existente (o uno
nuevo) para que `experiencia` la ratifique o la corrija.

---

### FIND-44 — El umbral completo suma 520 ms; `UX-20` §1.1 promete "un solo número, sin total escondido"

**Severidad: menor.**

**Qué se entregó:** `--escalon-umbral: 70ms`, que escalona los tres sub-pasos del umbral.

**Criterio incumplido:** `Docs/UX/UX-20-el-sitio-como-lugar.md` §1.1 ("Un solo número,
aplicado parejo... no hay un total escondido detrás de la suma").

**Evidencia:** `HILO-para-experiencia-tres-desvios-del-ciclo-11.md` punto 1 hace la cuenta:
el umbral entero dura `380 + 140 = 520 ms` de punta a punta. Ningún sub-paso individual
pasa los 400 ms, pero la suma sí. La pregunta ya está formulada por escrito en el HILO y
sigue sin respuesta en `UX-20` ni en `ESTADO.md` al cierre del ciclo.

**Qué hacer:** `experiencia` responde la pregunta ya escrita (¿el techo es por sub-paso o
por umbral entero?) y, si corresponde, deja el número en `UX-20` §1.1 antes de que otro
ciclo dé por aprobados los 520 ms tácitamente.

---

### FIND-45 — La fila "Cancionero" de `UX-20` §2 no marca que quedó sin construir

**Severidad: menor.**

**Qué se entregó:** la fila "Cancionero (letras y acordes)" de la tabla de `UX-20` §2.

**Criterio incumplido:** consistencia interna de la propia tabla — las otras dos filas
incompletas ("Sacalo por la letra", "Resultado y compartir") sí llevan la anotación
explícita de diferido.

**Evidencia:** la fila dice "Hasta 2: grano + `tapa-fondo--mosca-olla` reusado... no hace
falta uno nuevo", sin marca de pendiente. `git diff --stat -- src/pages/letras-y-acordes/index.astro`
muestra solo 2 líneas cambiadas (el cableado de `LUGARES.cancionero`), y `grep` de
`tapa-fondo` en ese archivo no devuelve nada: el fondo no se construyó este ciclo.

**Qué hacer:** `experiencia` agrega la misma anotación de diferido que usa en las otras dos
filas, o el hilo principal construye el fondo reusado y cita la línea.

---

## LO QUE ESTÁ BIEN — lo que el próximo ciclo no tiene que volver a hacer

- **417/417 tests en verde** (`npm test`, verificado por mí de nuevo) y **`npm run check`:
  0 errores, 0 advertencias** — incluidos los 11 de `movimiento.test.ts`, los 22 de
  `cinta.test.ts` y las 8 líneas nuevas de `CNT-13` adentro de `voz.test.ts`.
- **Cero tics de plantilla nuevos fuera de `FIND-39`**: sin pastilla cápsula, sin barra
  lateral fuera de la excepción de `.parrafo--leyenda/testimonio`, sin `blur`/`glow`/
  `backdrop-filter`, sin sombra difusa — las seis `box-shadow` del repo son todas de offset
  plano. `estilos.test.ts` (16/16) lo guarda a máquina.
- **El guardián del movimiento hace su trabajo**: cero tiempo o curva sueltos fuera de
  `tokens.css`, cada una de las siete animaciones catalogada con su equivalente quieto, y
  el corte de `prefers-reduced-motion` dejó de ser la guillotina `*` universal —
  `--duracion-toque` sobrevive, verificado con un test dedicado. El P3 abierto desde el
  2026-08-24 queda cerrado.
- **Las tres pantallas de registro 3 (Bulacio, Olavarría, la muerte del Indio) tienen doble
  candado**: `SLUGS_GRAVES` es una única fuente de verdad reusada por `arte.ts`,
  `[slug].astro` y el interruptor de cinta — sin atmósfera, sin cinta, sin capitular,
  verificado leyendo las tres implementaciones.
- **`ADR-04` (la cama de cinta) cumple sus candados**: apagada por defecto, cero archivos,
  se calla ante cualquier `<audio>` del documento, un solo `AudioContext` compartido
  (confirmado con `grep` propio: solo `audio/contexto.ts` construye uno, más la excepción
  documentada de `diagnostico-audio.ts`), y sus 12 constantes coinciden valor por valor con
  `ARQ-cama-de-cinta.md`.
- **Ningún molinete nuevo**: la portada no bloquea el toque (`pointer-events: none` en las
  capas decorativas), la acción principal es tocable desde el primer cuadro en el código
  revisado, y el sitio degrada sin JavaScript (el tránsito es CSS puro, el umbral cae a
  portada completa y quieta).
- **Propiedad de carpetas respetada** salvo el caso de `FIND-38`: los `.md` nuevos están en
  la carpeta de su rol dueño, y el código lo escribe el hilo principal como corresponde.

---

## LAS CUATRO PREGUNTAS DE `T-193`

**1. ¿Algo se movió para llamar la atención sobre sí mismo?**
No, sobre elementos tocables: ningún botón, casete, tarjeta o interruptor tiene rebote,
brillo o escala propia — verificado leyendo `sitio.css` y `juego.css` enteros y con
`movimiento.test.ts`. La única animación de entrada individual es la mosca, con precedente
de catorce ciclos. Aparte, y sin ser la misma pregunta: `FIND-39` muestra que el mecanismo
del umbral —atmósfera, no un elemento— sí reproduce el patrón de fundido que la regla de
marca nombra como el tic número uno a evitar.

**2. ¿Algo se retrasó abajo del dedo?**
A nivel de código, no: ninguna animación de entrada vive sobre `.casete`, `#jugar` ni una
opción de juego, y no hay override de `pointer-events` que intercepte el toque durante el
tránsito. **Pero esto no se pudo confirmar tocando un dispositivo real** — es exactamente
lo que impide el límite del entorno descrito arriba. Sigue pendiente.

**3. ¿Alguien que apaga el movimiento perdió información?**
No. `movimiento.test.ts` prueba en las dos direcciones (todo lo catalogado se apaga por el
mecanismo correcto, y nada fuera del catálogo queda animado), `--duracion-toque` sobrevive
al corte, y las tres pantallas graves nunca tuvieron atmósfera que perder. Es el defecto
que este mismo ciclo se propuso cerrar (el P3 del 2026-08-24), y quedó cerrado.

**4. ¿Se siente un lugar, o se siente una web con animaciones?**

> ### 🟡 Veredicto: pesa hacia "lugar", pero no se puede firmar todavía.
>
> A favor: las ocho líneas de `CNT-13` son imágenes físicas y no genéricas, el sonido es
> diegético y pensado para no sonar a interfaz, y las tres pantallas graves quedan
> deliberadamente mudas — eso da la sensación de salas distintas, no de una plantilla
> aplicada pareja. En contra, y es lo que baja la nota: **la pieza que más pesa en esta
> pregunta —el cruce entre pantallas— no se vio funcionando en ningún momento de esta
> revisión** (límite del entorno), y `FIND-38` es exactamente la clase de grieta por la que
> un sitio deja de sentirse un lugar entero: el mapa de qué pantalla es de qué ciclo ya no
> coincidía con el código al cerrar, en el mismo ciclo que construyó infraestructura
> específica para evitar ese error. Un lugar no se declara por la atmósfera que tiene: se
> declara por si sus límites se sostienen. Hoy uno no se sostuvo.

---

## PENDIENTE DE VERIFICAR EN UNA PANTALLA DE VERDAD

1. Ver el cruce completo entre pantallas (paso-sale/paso-entra, `@view-transition`, la
   hondura del tránsito) funcionando de punta a punta, con la pestaña visible.
2. Confirmar con el dedo, no con el ojo, que el botón/casete/opción responde desde el
   primer cuadro durante el umbral y durante el tránsito (pregunta 2 de arriba).
3. Prender la cinta, jugar una vuelta completa con sonido y confirmar que se calla y vuelve
   sola, con audio de hardware real, no solo con los 22 tests unitarios de `cinta.test.ts`.
4. Ver el umbral completo de la portada a 375×812 y decidir si los 520 ms de `FIND-44` se
   sienten como una sola cosa o como una espera.
5. Después de que se resuelva `FIND-38`: confirmar que `quiz.astro` y
   `adivinar-el-tema.astro` quedaron coherentes (revertidos o con la excepción ratificada
   por escrito) y que nada del ciclo 10 se perdió en el camino.
6. Activar "reducir movimiento" en el sistema operativo del teléfono (no en las devtools) y
   jugar una vuelta entera verificando que no falta ninguna confirmación.
