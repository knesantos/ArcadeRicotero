# ESTADO — RicotaArcade

> **Lo único que sobrevive al reinicio de contexto.** Se actualiza al final de cada
> sesión. Si esto y el disco no coinciden, manda el disco: corregí este archivo.
>
> Regla: un estado **nunca baja por inferencia**. Solo el usuario degrada un estado.

**Última actualización:** 2026-08-25
**Ciclo actual:** **9 — EN CURSO.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-9.md`, tareas `T-128`..`T-160` (`T-148` cancelado). **Cinco
frentes en dos tramos**: el juego nuevo por letras (`US-07`), `US-03` que sale entero, el
quiz que pasa a vidas, el botón de corrección, y la pulida de escritorio más los recortes
reales.

> ### ✅ TRAMO A CERRADO (2026-08-25) — el quiz ya se juega por vidas
>
> **Diez tareas hechas y verificadas.** `npm test` **251/251** (eran 224), `npm run check`
> 0 errores, build de **148 páginas**, y la partida jugada entera en el navegador.
>
> | Tarea | Qué quedó |
> |---|---|
> | `T-128` | **`D-25`**: `US-03` sale con letras de fuente única. La decisión escrita, con sus tres mitigaciones y qué la revierte |
> | `T-129` | **`BR-19`**: 3 vidas · escalón por pozo (10/15/15, **no** 10/10/10) · tres desenlaces |
> | `T-130` | **`US-07` + `BR-20`**: "Sacalo por la letra", escalera 1/2/4/8 versos, piso **60**, fuera del "Listo" de la v1 |
> | `T-132` | **`ADR-02` v2**: tres formas de link (`marcador`/`recorrido`/`identidad`). Salda la deuda de `dos-ejes` |
> | `T-134` | **`UX-07`**: vidas, escalón y retirada en pantalla. Ningún par de color nuevo |
> | `T-136` | **`CNT-10`**: los tres encabezados comparten la imagen de la vida como luz |
> | `T-142` | **`vidas.ts`** + 22 tests. **Aditivo: `ronda.ts` y `tramo.ts` intactos** |
> | `T-143` | La isla del quiz. Arregla `FIND-28` |
> | `T-149` | **`BR-21`**: el sitio promete solo lo que puede verificar con un comando |
> | `T-155` | **`IDEA-13`**: Supabase separado en tres, con el choque contra `D-14` nombrado |
>
> **Verificado jugando, no deducido:** derrota (`DERROTA` · "Se te apagaron las tres
> vidas." · "Pregunta 3 de 40 · nivel Fácil"), retirada (`RETIRADA` · "Pregunta 12 de 40" ·
> "Vidas al cerrar: 3 de 3"), y el aviso `NIVEL MEDIA` apareciendo **una sola vez**, en la
> pregunta 11.
>
> ### 🔴 `FIND-28` — un defecto vivo que se encontró y se arregló en el mismo ciclo
>
> `leerDesafio()` devolvía el campo `g` y **el quiz nunca lo miraba**. Reproducido en el
> navegador: `/quiz/?g=tapa&p=10&t=10&n=Fulano` pintaba *"Fulano sacó 10/10"* — desafío de
> otro juego, puntaje imposible en una ronda de 8. **Estaba en producción.** Arreglado en la
> firma (`leerDesafio(query, juegoPropio)`, segundo parámetro obligatorio) para que la clase
> entera de bug sea imposible, no improbable.
>
> De paso salió otra: el tuit de `US-02` decía "160 de 400" y su propio link "3 de 4". El
> tope de `t` subió de 100 a 9999 y ahora los dos dicen lo mismo.
>
> ### 🔜 Para retomar: el tramo B, entero
>
> `T-131` `T-133` `T-135` `T-137` `T-138` `T-139` `T-140` `T-141` `T-144` `T-145`, más
> `T-146` (`REV-08`), `T-147` (`ESTADO.md`) y el frente E (`T-157`..`T-160`, escritorio).
> **Empezar por `T-131`** (`arquitectura`, `CTR-04`), que es la que destraba `US-03`.
>
> **Dos cosas que esperan al usuario, ninguna urgente:**
> 1. **Una casilla de correo** para el botón de corrección (`T-153`). El repo no tiene
>    ninguna, y poner un Gmail personal en un `mailto:` de un sitio público es entregárselo
>    a los raspadores de spam.
> 2. **Si el lobo va igual al casete de la Redondopedia.** Se frenó porque ese casete es
>    `variante: 'historia'` y por `D-19` viste *Gulp!*; el lobo es de *Lobo suelto*. Además
>    el perro que está hoy es un personaje fichado de *Un baión*. Queda en `T-160`.

> ### `T-134` cerrada — `UX-07`, cómo se ven las tres vidas y el escalón
>
> `Docs/UX/UX-07-quiz-por-vidas.md` (nuevo). Sobre `BR-19`: cabecera con vidas (tres
> sellos lleno/tachado + "VIDAS", tinta compartida con el error `--acento-4` a propósito
> — es la única causa posible de perder una) y etiqueta ambiente de nivel ("MEDIA ·
> 4/15", reemplaza el viejo "N de 8"); aviso puntual de escalón una sola vez por salto
> (borde `--acento-2`, arriba del enunciado, sin pantalla nueva); botón de retirada fijo
> en una esquina superior, lejos del pulgar, con confirmación de dos pasos que muestra
> "hasta dónde llegaste" antes de decidir; tres pantallas de resultado (victoria
> `--acento-3`/✔, derrota `--acento-4`/✕, retirada `--acento`, sin símbolo, única con el
> widget de vidas). **Ningún par de color nuevo** para `contraste.test.ts`: todo reusa
> tokens ya testeados. Deja pendiente para quien la retome: `UX-01` queda con su sección
> de "N de 8" y el tramo de tres niveles desactualizada para el quiz (sigue vigente para
> `US-04`) — no se editó por estar fuera del alcance de `T-134`.
>
> **Siguiente para este frente:** `T-136` (`contenido`, `CNT-10`, el texto exacto de todo
> lo nuevo) y `T-132` (`arquitectura`, `ADR-02`, el payload del link para los tres
> desenlaces) — las dos ya pueden arrancar. `T-143` (hilo principal, la isla del quiz
> pasa a vidas) espera a `T-142`, `T-134` (esta), `T-136` y `T-132`.

> ### 🚀 El sitio está desplegado
>
> Lo confirmó el usuario el 2026-08-25. **Cada cambio del ciclo 9 sale a la calle**, el
> quiz que pasa a vidas incluido. Deja de haber red.
>
> ### Lo que el ciclo 9 va a hacer, y lo que no
>
> Tres pedidos del usuario en una frase, y **tres decisiones suyas** que los acotan:
>
> 1. **`US-07` — adiviná el tema por la letra.** Juego nuevo. El usuario eligió que
>    **conviva** con el de audio en vez de reemplazarlo, así que **`US-02` sigue en 0/30 y
>    la v1 no cierra en este ciclo**. Queda a un solo juego, y ese juego necesita ffmpeg.
> 2. **`US-03` sale entero, con fuente única.** El candado de `CTR-04` (dos fuentes o
>    confirmación de oído) se abre por decisión del usuario: *"salen con los temas que ya
>    tenemos, si hay que cambiar algo lo veo jugando el juego"*. Se toma por escrito en
>    `D-25`, con los versos de menor riesgo (`T-138`) y con la fuente a la vista del
>    jugador (`T-145`), que es el mecanismo de "lo veo jugando".
> 3. **El quiz pasa a 3 vidas**, con escalón cada 10 preguntas, se queda en difícil al
>    acabarse los niveles, y ganás si agotás el banco.
> 4. **Un botón para corregir** en los tres juegos, como componente compartido porque se
>    expande a todo el sitio. Ver el frente D más abajo.
>
> ### 🔴 Lo que medí al planificar, y cambia lo que se puede prometer
>
> - **Solapamiento cero entre fuentes de letra.** Cada tema tiene **una sola** fuente
>   (cifraclub 78 · lacuerda 21 · letras.com 5) y los 149 archivos crudos de
>   `TemasRedo/cancionero/data` son **uno por tema**. La vía "dos fuentes" de `CTR-04` no
>   estaba difícil: estaba **cerrada**. Por eso hizo falta `D-25`.
> - **El banco tiene exactamente 10 fáciles**, y el escalón que pidió el usuario dura 10
>   preguntas. Sin cambiar nada, **toda partida mostraría el banco entero de fáciles** —
>   la "vidriera fija" que `BR-01` punto 3 existe para impedir, y que el ciclo 7 ya tuvo
>   que arreglar una vez. Lo cierra `producto` en `T-129`.
> - **`armarRonda` lo comparten los cuatro juegos** (quiz, tapa, letra, tema). La máquina
>   de vidas es **aditiva** (`src/lib/quiz/vidas.ts`): quien edite `ronda.ts` rompe tres
>   juegos que hoy andan.
>
> ### 🆕 El cuarto pedido: el botón de corrección (frente D)
>
> *"agreguemos un boton o algo como para dejar un comentario para corregir... es mas como
> para construir conocimiento entre todos. Esto para estos juegos pero se expandira a todo
> el sitio"*. **Es la pieza que le faltaba a `D-25`**: `US-03` sale con fuente única, y el
> usuario dijo que lo iba a validar jugando. Esto le da con qué.
>
> **El transporte cambió a mitad de la planificación y manda la segunda versión:** *"la idea
> no es que se vea la correccion primero, sino que nos llegue a nosotros, luego se podria
> extender con una base de datos gratis de supabase"*. Así que **no va por issue de GitHub**
> —eso costaba abrir el repo y exigir cuenta, dos costos que se pagaban para que *se viera*—
> sino por mail y portapapeles: cero infraestructura, cero cuenta, molinete abierto.
> **`T-148` quedó `[CANCELADO]`** por eso.
>
> **`CTR-10` deja el transporte detrás de una interfaz**, así que el salto a Supabase no va a
> tocar el botón. La propuesta de alcance de ese salto está en
> `Docs/SUGERENCIAS/HILO-para-producto-supabase-scores-y-correcciones.md` y **no es menor**:
> *puntajes* y *jugadores* son ranking global y cuentas de usuario, las dos en Fuera de
> alcance y las dos rozando `D-14`. Queda como `IDEA-13` (`T-155`), sin empezar.
>
> ### 🟢 Medido de paso: el repo es privado, y abrirlo no expondría nada nuevo
>
> `gh repo view` → `PRIVATE`, con issues habilitados. El `.gitignore` ya excluye `*.pdf`,
> `*.epub`, `*.wav` y `*.mp3`, así que **el memoir del Indio no está versionado**. Lo que sí
> está —71 tapas y el corpus de letras— **ya lo publica el sitio desplegado**. Queda medido
> para cuando haga falta.
>
> ### El riesgo del ciclo
>
> **`US-03` y `US-07` salen del mismo corpus de fuente única, y no corren el mismo
> riesgo.** En `US-03` el jugador escribe la palabra que falta: si la transcripción está
> mal, **el juego le marca error al que se sabe el tema**. En `US-07` adivina cuál es el
> tema, y una palabra mal no cambia de qué tema se trata. Por eso uno sale sin discusión y
> el otro sale con `D-25` encima.

---

**Ciclo 8 — CERRADO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-8.md`, tareas
`T-113`..`T-127`. `npm test` **224/224**, `npm run check` 0 errores, build de **148
páginas**. Dos pedidos del usuario en la misma frase, y uno de los dos se cayó.

> ### El quinto juego se juega: `/juegos/dos-ejes/`
>
> **"¿Qué tipo de ricotero sos?"** — `IDEA-09` promovida a `US-06` (`T-115`) con los ejes
> que fijó el usuario: `luz ↔ oscuridad` y `orden ↔ caos`. Diez preguntas, cuatro
> cuadrantes, **una identidad y ningún puntaje**. Verificado jugándolo a 375×812: sirve las
> diez, el rombo pinta, el punto cae en la cara correcta, y **no hay un solo dígito en la
> pantalla de resultado**.
>
> **`US-06` queda fuera del "Listo" de la v1**, y lo decidió `producto` con argumento:
> `D-05` fijó cuatro juegos en el kickoff y no se redefine el contrato porque apareció una
> quinta idea buena. Entra al sitio igual, como la Redondopedia.
>
> ### 🔴 Spotify está cerrado, y no por dificultad técnica
>
> `RES-51` (`INV-25`) lo cierra en negativo, en tres escalones: **el número de
> reproducciones nunca existió** en la API pública; el índice `popularity` que sí existía
> **lo removieron en febrero de 2026**; y la única modalidad que lo conserva exige
> organización legal registrada y **250.000 usuarios activos por mes**. No hay frase que el
> sitio pueda escribir con un número de Spotify, porque no hay número.
>
> **YouTube sí** (`RES-52`, `INV-26`), y mejor de lo esperado: hay canal Topic, y los
> términos **autorizan explícitamente** guardar y mostrar el conteo (Developer Policies
> III.E.4) a cambio de mantenerlo fresco y atribuir. `BR-18` fijó qué se promete: **el
> orden, no la cifra**, refresco cada 180 días, y nunca sumar YouTube con Spotify.
>
> **Falta la clave**, y es lo único que falta de este frente:
> `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`. Sin clave el script no falla:
> deja los 105 temas declarados y dice el comando.
>
> ### Lo que este ciclo le dio a la v1, que es una sola cosa y estaba trabada
>
> `BR-18` (f) cerró el hueco que el ciclo 7 dejó abierto: **"fácil" en `US-02` pasa a ser el
> top-8 del ranking de YouTube**, no un campo manual ni un umbral fijo que se corrompería
> solo. La cuota de fáciles vuelve a ser medible.
>
> ### El banco del test tardó tres vueltas, y las tres hicieron falta
>
> `T-121` lo escribió. Dos revisiones independientes: `revisor` no encontró nada
> bloqueante, y una pasada adversarial encontró que **el eje `luz-oscuridad` medía cuatro
> cosas distintas** —con sorteo de 5 sobre 10, la misma persona caía en polos opuestos
> según qué cinco le tocaran— y que **`CU-1` nombraba pertenencia** y **`CU-3` se llamaba
> como el hincha de San Lorenzo**. Rehecho en `T-126`.
>
> La segunda pasada encontró que **la asimetría no se había cerrado: se había mudado de
> eje** — ocho de diez opciones de `oscuridad` eran *no hacer lo que hace `luz`*, y como
> extraversión es un rasgo socialmente premiado, el test tenía un lado bueno. Cerrado en
> `T-127`: hoy ninguna opción de `oscuridad` es una negación.
>
> **Está en `REV-07` y vale como vara:** dos ciclos seguidos, la pasada adversarial encontró
> lo que la verificación no, y las dos veces por el mismo motivo — **el defecto no estaba en
> ningún ítem, estaba en el conjunto.**
>
> ### Lo que el usuario trajo a mitad de ciclo
>
> - **La tapa real de *La mosca y la sopa*** reemplaza a la contratapa que el sitio usaba.
>   ⚠ `RES-44` sigue diciendo que es un rediseño; su evidencia para esa fila es la más floja
>   de las 35 (fetch 403, snippet). **El pie no le acredita nada a Rocambole** hasta que
>   alguien vuelva a mirarlo — pedido en `Docs/SUGERENCIAS/HILO-para-investigador-tapa-de-la-mosca.md`.
> - **Tres recortes reales**: la mosca (17 KB), Lupus el lobo (48 KB) y el ojo de buey de
>   *Último bondi* (29 KB). Ninguno necesitó código: el mapa `RECORTE_REAL` ya los esperaba.
> - **El "Viste (disco)" del portal, afuera** — la mezcla `D-19` se ve en el color.
>
> ### Dos verificaciones nuevas, las dos por huecos que encontró una revisión
>
> 1. **`voz.test.ts` no miraba el banco del test.** 44 cadenas visibles sin auditar en un
>    proyecto cuya postura es que se audita a máquina lo auditable. Ya las mira.
> 2. **El schema de `dos-ejes` no tenía tarea asignada en el plan.** Lo notó `arquitectura`;
>    era un hueco mío.
>
> ### Deuda declarada
>
> - **21 temas de lacuerda.net** afuera del banco de letras: fuente nueva sin ficha. Pedido
>   escrito. El generador tiene el mapa en una constante.
> - **`RES-48` tiene una cita falsa** sobre el origen de *Mi perro dinamita*. La Redondopedia
>   ya está corregida contra el memoir; la ficha no, y es de `investigador`.
> - **No queda rastro de la banda en las 20 preguntas** del test — es lo que `US-06` pide,
>   pero `producto` no lo confirmó de frente. Anotado en `CNT-09`.
> - **`ADR-02`** (link compartido) lleva puntaje y este juego no tiene.
> - Los tres hallazgos abiertos de `REV-06` y la cuota de fáciles de `US-02`.
>
> **Rangos consumidos por el ciclo 8:** `T-113`..`T-127`, `RES-51`, `RES-52`, `US-06`,
> `BR-17`, `BR-18`, `CTR-07`, `CTR-08`, `UX-06`, `CNT-09`, `REV-07`, `FIND-25`..`FIND-27`.
> Libres: `T-128`+, `D-25`+, `RES-53`+, `CNT-10`+, `REV-08`+, `UX-07`+, `BR-19`+,
> `IDEA-12`+.

---

**Ciclo 7 — CERRADO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-7.md`, tareas
`T-97`..`T-112`. `npm test` **212/212**, `npm run check` 0 errores, build de 147 páginas.

> ### Lo que cerró el ciclo
>
> - **`US-01` cumplió su piso: 40/40.** Entraron las 10 preguntas de `letras` (`CNT-08`),
>   con el reparto exacto que pide `producto`: 10 por categoría, 10 fáciles / 15 medias /
>   15 difíciles. **Es el tercer juego con el piso cumplido**, después de `US-04` y `US-05`.
> - **Cuatro deudas entre roles, saldadas.** `RES-49` (cifraclub, `INV-23`), `RES-50`
>   (Vercel y los mp3, `INV-24`), `BR-02` reescrita sobre la mecánica real de `US-02`, y
>   `CTR-01`/`CTR-03` puestos al día con el juego construido. `CNT-01` fijó el fragmento en
>   **15,0 s**. `IDEA-11` entró al backlog.
> - **El cancionero se rehizo y entró entero.** El usuario lo regeneró con tres fuentes
>   (cifraclub 78, lacuerda.net 20, letras.com 5). **104/105 temas, 101 con letra** — eran
>   96. Cinco temas que solo tenían tablatura ahora tienen versos.
> - **El banco de `US-03` pasó de 226 candidatos sobre 13 temas a 1.784 sobre 80.** La hoja
>   de escucha ahora reparte 24 versos en **24 temas distintos** y 8/8/8 por nivel.
>
> ### 🔴 Los tres defectos que el ciclo encontró, y ninguno estaba en el plan
>
> **1. El quiz servía solo preguntas fáciles.** `armarRonda` llenaba la ronda desde el pozo
> más fácil hasta completar el largo. Con 10 fáciles y una ronda de 8, **toda partida era
> ocho fáciles**: 300 rondas simuladas dieron 2.400 preguntas y **las 2.400 fáciles**. Las
> 15 medias y las 15 difíciles no salían nunca, y la categoría `letras` recién cerrada era
> inalcanzable. **El banco tenía 40 preguntas y el jugador veía 10.** Cumplía `BR-01` al pie
> de la letra y traicionaba las tres razones por las que `BR-01` existe. Arreglado con la
> mezcla derivada del piso (2/3/3 en una ronda de 8) y cinco tests.
>
> **2. Ningún schema se corría.** `banco.ts` decía que la validación la hacía "la
> verificación", y no existía ningún comando que la hiciera — el mismo defecto que el ciclo
> 6 ya había encontrado en `letra.schema.json`. Ahora corre (`src/lib/esquemas.test.ts`) y
> encontró tres cosas al primer intento: acordes mal ingeridos, la notación latina de
> lacuerda.net sin convertir, y el patrón de id del banco de letras topeado en tres dígitos.
>
> **3. Un `testimonio` de la Redondopedia citaba una ficha que no lo dice.** El artículo
> `mi-perro-dinamita` atribuía a `RES-22` que el tema nació de un verso de Poli. Se leyó el
> memoir directo: **no está**. El origen real —una prueba de sonido, con Semilla arrancando
> una línea de bajo— explica además por qué él firma como tercer autor. Corregido, con la
> página citada.
>
> ### Lo que sigue faltando, y no lo puede hacer un programa
>
> - **`US-02` no tiene un solo fragmento.** `npm run generar-fragmentos -- "<carpeta>"`,
>   con ffmpeg, que en esta máquina no está. Y ojo: **`producto` subió el piso de 20 a 30**
>   (`T-99`), así que los pisos de la v1 ahora son **40 / 30 / 15 / 10**. Sube la vara.
> - **`US-03` sigue en 0 `listo` sobre 1.784 candidatos.** `npm run hoja-de-escucha` deja
>   24 versos con el minuto en blanco. Con 15 confirmados el juego se prende solo.
>
> ### Deuda declarada
>
> **21 temas de lacuerda.net quedan afuera del banco de letras**: es fuente nueva y no tiene
> ficha. Pedido en `Docs/SUGERENCIAS/HILO-para-investigador-fichar-lacuerda.md`. El
> generador tiene el mapa en una constante (`FICHA_POR_SITIO`): cuando exista, es una línea.
>
> **Tres hallazgos abiertos de `REV-06`** (`FIND-22`..`FIND-24`), todos no bloqueantes.
> `FIND-24` es de `producto`: si `QZ-038` se queda en `letras` o migra a `historia`.
>
> **`RES-48` tiene una cita falsa**: dice "ya en `RES-22`" sobre el origen de *Mi perro
> dinamita*, y `RES-22` no lo dice. La Redondopedia ya está corregida; **la ficha no**, y es
> de `investigador`.
>
> **`arquitectura` dejó una pregunta abierta para `producto`** sobre la cuota de fáciles de
> `US-02`, que ya no tiene dónde vivir con el manifiesto nuevo. Está en
> `Docs/SUGERENCIAS/HILO-para-producto-cuota-de-faciles-en-us02.md`.
>
> **Rangos consumidos por el ciclo 7:** `T-97`..`T-112`, `RES-49`, `RES-50`, `CNT-08`,
> `REV-06`, `FIND-22`..`FIND-24`. `T-103` y `T-105` se cancelaron y sus números no se
> reutilizan. Libres: `T-113`+, `D-25`+, `RES-51`+, `CNT-09`+, `REV-07`+, `UX-06`+,
> `BR-17`+, `IDEA-12`+.

---

**Ciclo 6:** **construido, a la espera de una confirmación humana.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-6.md`, tareas `T-82`..`T-96`. **El usuario trajo el material que
faltaba** —149 JSON con letra y acordes, raspados con scraper propio de cifraclub y
letras.com— y eso desbloqueó de un saque los tres frentes que esperaban versos.

> ### Lo que quedó andando
>
> - **`/letras-y-acordes/`: la sección nueva.** 104 de los 105 temas de `RES-20`
>   (falta *Sushi*, instrumental), **ordenados por disco y cada disco vestido con su
>   propia paleta real** (`RES-37`, las diez, no las cuatro de `D-19`). Cada disco muestra
>   su **tracklist entero**: lo que no tenemos aparece tachado y con el motivo.
> - **Ficha por tema** con los acordes alineados sobre la sílaba, **transporte** (±6
>   semitonos, respeta bemoles) y **"bajar solo"** (autoscroll con velocidad).
> - **Armá tu cancionero**: elegís temas y bajás **un HTML autocontenido** con índice,
>   acordes y autoscroll. **Cero recursos externos** — abre sin internet. Verificado.
> - **La Redondopedia enlaza la letra** de sus 6 artículos `tema`.
> - **147 páginas** (eran 35), **135 tests** (eran 77), `tsc` limpio.
>
> ### 🔴 Lo único que falta, y no lo puede hacer un programa
>
> **El juego de completar la letra NO está jugable, a propósito.** Hay **226 versos
> candidatos** en `src/data/letra.json`, todos `borrador`. `CTR-04` no deja jugar un verso
> sin dos fuentes de letra o **confirmación de oído contra el disco**, y ponerle `listo` a
> un verso que nadie escuchó sería la mentira que `CLAUDE.md` declara como lo único
> estricto: si la respuesta está mal, **el juego le marca error justo al que se sabe el
> tema**.
>
> **Y no hay atajo por la otra puerta:** letras.com aportó 14 temas con letra y cifraclub
> 82, con **solapamiento cero**, así que hoy ningún ítem puede llegar a `listo` por "dos
> fuentes". Alguien tiene que escuchar. Medido el 2026-08-23.
>
> **Para prenderlo, y ya cuesta veinte minutos en vez de una semana:**
>
> 1. `npm run hoja-de-escucha` — deja **24 versos** elegidos en
>    `src/data/letra-confirmaciones.json` con el minuto en blanco (`_:__`), repartidos
>    entre 13 temas y los tres niveles de `BR-03`, y con el verso anotado al lado.
> 2. Se escucha, se reemplaza cada `_:__` por el minuto (`"1:24"`). Quién / fecha / dónde
>    salen una sola vez de `porDefecto`; **el minuto no tiene defecto y por eso no se
>    autocompleta.**
> 3. `npm run generar-letra`. Con 15 confirmados se cumple el piso de `US-03` y la pantalla
>    se prende sola: los dos estados ya están escritos y el banco decide cuál sale.
>
> ### Tres hallazgos del ciclo, que eran defectos viejos
>
> 1. **`leerTemas()` cortaba mal 6 de los 105 títulos** — se le pegaba la prosa de la nota
>    que sigue en `RES-20`. El cruce de `D-13` daba 83/105 y rechazaba temas legítimos.
>    Con el arreglo y una tabla de alias: **104/105**. Cubierto por `temas.test.ts`.
> 2. **`banco.ts` leía mal `BR-03`**: sumaba los dos lados del contexto y los comparaba
>    contra el número de una sola columna de la tabla, así que un ítem fácil correcto
>    (2 antes + 2 después) era rechazado. El schema lo tenía bien. No se notó antes porque
>    el banco estaba vacío.
> 3. **Seis temas no eran instrumentales**: la fuente les transcribió solo la tablatura.
>    `contenido` pasó de booleano a tres estados (`letra` / `instrumental` /
>    `solo-tablatura`) para no decir algo falso sobre la obra.
>
> ### Deuda declarada
>
> **El banco sale de 14 temas, no de 96.** Solo letras.com tiene ficha (`RES-23`);
> cifraclub, que aportó 82 temas, no tiene ninguna. Pedido concreto a `investigador` en
> `Docs/SUGERENCIAS/HILO-para-investigador-fichar-cifraclub.md`. El generador tiene la
> fuente en una constante: cuando la ficha exista, son dos líneas.
>
> **Rangos consumidos por el ciclo 6:** `T-82`..`T-96`, `CTR-06`. Consumidos por la sesión
> suelta del 2026-08-23: `D-23`. Pedidos y sin escribir: `RES-49` (cifraclub), `RES-50`
> (límites de Vercel). Libres: `T-97`+, `D-24`+, `RES-51`+, `CNT-08`+, `REV-06`+, `UX-06`+,
> `BR-16`+.

---

## Sesión suelta del 2026-08-24 — la auditoría de detalles, y la figura encadenada

No es un ciclo: es una skill nueva pasada por el portal y el quiz, y un recorte que trajo
el usuario.

**La skill.** `pbakaus/impeccable` (246K instalaciones), instalada global y enlazada a
Claude Code. Es la que caza los 64 patrones de interfaz genérica de IA — el mismo enemigo
que `.claude/rules/diseno-marca.md` ya tenía escrito con nombre y apellido. Se corrió su
comando `audit` sobre `index.astro` y `quiz.astro`. Informe completo, con la medición de
cada hallazgo, en `Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md`.

> Ojo con el detector: necesita `htmlparser2`, `css-select`, `css-tree` y `domutils` en el
> directorio de la skill. Sin ellos avisa `DEGRADED` y cae a expresiones regulares, que no
> evalúa variables CSS ni contraste computado. Están instaladas; si se reinstala la skill,
> hay que volver a ponerlas o el resultado limpio es un subconteo.

**Diagnóstico: 15/20.** El detector devuelve **limpio** sobre el HTML construido, que no es
común. Lo que bajaba la nota no era el sistema visual: era la deriva entre el sistema y lo
que el JavaScript crea en tiempo de ejecución.

**Los cuatro P1, arreglados y verificados en pantalla:**

1. **`.primario` era una regla con alcance de página, así que no alcanzaba a los botones
   que crea una isla.** El `SEGUÍ` del quiz salía como botón nativo gris —medido:
   `rgb(240,240,240)`, `2px outset`, 59 × 48— sobre fondo de tinta. Es `FIND-15` otra vez.
   Ahora es componente global en `juego.css` con `--tinte-accion`, que **se hereda por el
   árbol del DOM**. Alcanzó a siete botones en cuatro juegos: `dos-ejes` y
   `completar-la-letra` ni siquiera tenían la regla.
2. **Se fue el auto-avance.** Medido: el panel de feedback duraba **1.577 ms** con una
   explicación de seis segundos de lectura, y eso pasaba en **22 de los 40 ítems**. Ahora
   toda pregunta espera el dedo con `SEGUÍ`, como `UX-01` v2 ya había hecho para los ítems
   con rótulo. Sale de paso una violación de WCAG 2.2.1 (Nivel A).
3. **El foco ya no se cae al `<body>`** en cada cambio de pantalla, y el panel de feedback
   es `role="status"`. Regiones vivas en la página: 0 → 1.
4. **El link que manda `COMPARTÍ` tiene tarjeta.** Open Graph, ícono y `theme-color` en las
   **148 páginas**. `public/tarjeta.png`, `icono-180.png` y `favicon.svg` los genera
   `npm run generar-marca-social` **leyendo los colores de `tokens.css`**.

**Los siete P2, también:** la categoría dejó de imprimirse cruda (se leía `MITOLOGIA`, sin
tilde); el resultado tiene salida al arcade (era un callejón sin salida); el puntaje y el
tramo pasaron a letra de marca (eran `system-ui`); la escala tipográfica de la portada del
quiz se abrió a 20 / 28 / 38; `color-scheme: dark` y `::selection`; y las imágenes declaran
medidas —leídas del archivo en build por `medidas()`— y cargan diferido.

> **Un hallazgo se corrigió a la baja.** El informe decía "salto de maquetado"; lo medí
> después y **el CLS del portal es 0**, y ya lo era. Las imágenes del casete tienen ancho y
> alto fijos por CSS y las otras dos están fuera de flujo. Lo que faltaba de verdad era el
> `loading="lazy"`.

**Quedan abiertos:** los nueve P3, la misma jerarquía plana en `adivinar-la-tapa.astro`
(20 / 24 / 33,6 px — apareció al pasar el detector por las cuatro páginas de juego), y los
`.primario` con alcance que sobreviven en `adivinar-el-tema` y `adivinar-la-tapa`.

### 🟡 La figura encadenada entró a la portada, y le falta la ficha

El usuario trajo `Docs/UX/OktubreCadena.png` y pidió que reemplace al perro al lado del
título del portal. Hecho, y es también la imagen de la tarjeta al compartir.

**Pero `public/arte/README.md` decía que esa pieza no se usaba hasta tener ficha**, y la
razón no es de derechos: `INV-02` reporta que la figura encadenada **no estaba en el arte
del vinilo de *Oktubre* del 86** y que se difundió con la reedición en CD — "reportado, con
buena base, verificar antes de usar".

Resolución, sin frenar la pieza ni afirmar el dato: **se muestra y no se le atribuye
disco.** No entra en `tapasUsadas`, así que el crédito del pie no la nombra; el texto de la
tarjeta acredita a Rocambole —eso sí está firme— sin nombrar el álbum. Ficha pedida en
`Docs/SUGERENCIAS/HILO-para-investigador-figura-encadenada.md`, donde los tres desenlaces
posibles sirven, y uno de ellos es una pregunta de quiz de primer nivel.

**Verificación:** build de 148 páginas, `npm test` **224/224**, `npm run check` 0 errores.
Detector limpio sobre el HTML construido. En el navegador: sin desborde a 320, 375 y
1280 px; 24 pares de texto con el peor en 4,67:1; ningún objetivo táctil bajo 48 px.

---

## Sesión suelta del 2026-08-23 — el audio, y el candado de las letras

No es un ciclo: son dos preguntas del usuario resueltas de punta a punta.

**`D-23` — los 2,5 GB no entran al repo.** El usuario trajo el número que faltaba desde
`D-22`: la discografía completa que tiene pesa 2,5 GB. Contra las ~7,2 h de `RES-20` eso
da ~770 kbps promedio — **no es mp3, es lossless o casi**, y el mismo catálogo a 128 kbps
son ~400 MB. Decidido: los 2,5 GB se quedan en la máquina como material de trabajo, y al
sitio va un derivado en **dos niveles** — fragmento de `CTR-01` para los 104 temas
(**12,5 MB** en total) y tema entero solo para los que un juego revela (~40, ~160 MB).
**Se descartó guardar medio tema** (idea del usuario) por aritmética: `US-02` necesita 15
segundos, no dos minutos, y medio tema pesa doce veces más que el fragmento para el mismo
juego. Queda pedida `RES-50` a `investigador` en
`Docs/SUGERENCIAS/HILO-para-investigador-limites-de-vercel-para-audio.md`: **la única
pregunta que puede mover algo es si Vercel Hobby banca ~180 MB de mp3 en el repo.** La
decisión no depende de la respuesta, solo dónde viven los archivos.

**Tres candados nuevos en el juego de las letras, porque no había ninguno.** La regla de
`CTR-04` que decide si el juego miente —para estar en `listo`, o te escucharon o tenés dos
fichas de letra— **vivía solo en `letra.schema.json`, que ningún test corría.** Ahora:

1. Está en `src/lib/letra/banco.ts` y rompe el build. Seis tests nuevos.
2. `generar-letra` **aborta sin escribir** ante una confirmación que no es una escucha:
   minuto vacío, `"si"`, `"1:60"`, fecha inválida, `donde` inventado, id inexistente.
3. **Guardián de ids.** Los ids son posicionales (`CL-001`...): un banco regenerado los
   corre y una confirmación se mudaría **en silencio** a un verso que nadie escuchó. La
   hoja guarda el verso como huella y el generador compara.

**Dos defectos del banco, encontrados al mirarlo:** el banco bajó de **313 a 226**
candidatos y es una mejora — **79 repetidos** (el mismo verso de estribillo entraba una
vez por repetición) y **8 sin verso alrededor** (la `Invocación` de *Lobo suelto* daba tres
ítems cuyo enunciado entero era `____ !`; ese tema salió completo).

**Verificado:** `npm test` → 135/135. `npm run check` → 0 errores.

**Ciclo anterior:** **5 — EN CURSO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-5.md`: 17 tareas,
`T-64`..`T-80`. **Foco: el sitio sale a la calle y el quiz se viste.** Lo segundo es la
mitad del pedido del ciclo 4 que quedó sin hacer (`UX-05` §2, siete superficies).
**Los versos siguen sin transcribirse y es deliberado:** son material de origen, como los
recortes de audio de `US-02`, y entran por la mano del usuario. El ciclo deja lista toda la
maquinaria de `US-03` alrededor, y le pregunta a `producto` si un artículo `tema` se
sostiene sin citar verso — si dice que sí, `US-05` llega a 35/35 sin un solo verso.

> ✅ **`T-71` (`experiencia`) — cerrada.** `UX-04` pasa a v4 y `UX-05` a v2. Confirmados
> los dos desvíos que reportó el hilo principal (`Docs/SUGERENCIAS/HILO-para-experiencia-
> desvios-de-UX-05.md`): `letras` sale entera de la trasera de *La mosca y la sopa* (tres
> filas corregidas), y el fondo de Oktubre queda anclado en la franja inferior del portal,
> nunca detrás de la cabecera. Los números de 480/640 px bajaron al techo real del
> material (másters 953×953/1181×929 px, catálogo real 210–591 px, destino real 34–96 px);
> el tope de 60 KB queda igual, con nota de que hoy nadie lo roza (máximo real 53 KB).
> **Hallazgo propio, no pedido:** el mismo problema del desvío 2 (texto sin par testeado
> sobre velo) iba a repetirse en dos pantallas que el ciclo 4 no llegó a construir —
> `--marca-rojo` en la presentación del quiz y `--acento` (tramo medio, ~4,48:1 calculado a
> mano) en el resultado —, así que `UX-05` v2 ya las deja acotadas antes de que `T-72` las
> construya. `UX-05` §2 suma el mecanismo del "sello de esquina" en detalle (dónde cae, qué
> tamaño, cómo convive con el pulgar) para que `T-72`..`T-74` lo lean y no vuelvan a
> preguntar. Queda anotado y sin resolver, fuera de la carpeta de `experiencia`: la ficha
> de disco de *La mosca y la sopa* en la Redondopedia todavía muestra el mismo frontal que
> `RES-44` descartó — es de código (`generar-tapas.mjs`) y de `contenido` (el texto de esa
> ficha), no algo que UX pueda mover sola.

> **Ciclo 4 — CERRADO.** Las 20 tareas `T-44`..`T-63`, más los hallazgos de las
dos revisiones, corregidos y verificados. **Las tapas reales entraron al sitio y hay un
segundo juego jugable**: `US-04` (adivinar la tapa) cerró su piso en 10/10 y se juega de
punta a punta. La Redondopedia pasó de 26 a **29 de 35** artículos. **77 tests**, `tsc`
limpio, build de **35 páginas**. Repo en **https://github.com/knesantos/ArcadeRicotero**.
Los ciclos 1, 2 y 3 también están cerrados. **Ningún ciclo tiene nada abierto.**

> 🔴 **Y algo peor que faltaba código: no hay repositorio git.** 55 archivos de trabajo de
> dos ciclos completos, sin un solo commit y sin respaldo. Lo encontró `orquestador` al
> planificar. Es `T-28` y va **antes que todo lo demás**.

> 🟢 **LEER PRIMERO — `D-14` reencuadra el proyecto entero.** Lo decidió el usuario el
> 2026-08-19 con toda la evidencia legal sobre la mesa, y **manda sobre cualquier cautela
> que este archivo o cualquier otro haya escrito antes**.
>
> **Es un fan site sin fines de lucro, de poco volumen, hecho para divertirse.** Tres cosas:
> **(1) El riesgo se asume.** Si llega un reclamo, **se da de baja y listo**. El gate de
> publicación de `D-07` **ya no existe**; `CNT-01` pasó de cerrojo a **mapa** de qué se usa.
> Nada espera permiso.
> **(2) El conocimiento popular vale.** No hay mucho oficial **y no debería importarnos** —
> y no es una excusa: `RES-23` verificó que la fuente autorizada de letras no existe ni
> existió, y `RES-21` que el memoir se declara "apenas mi versión". Se dejó de exigir fuente.
> **(3) Abrir los molinetes.** Nada se le niega a nadie por no tener con qué entrar: ni
> cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas"
> del alcance eran la misma decisión y ahora tienen nombre.
>
> **Lo único estricto que queda**, y no es legal: que **la respuesta correcta sea correcta**
> — si el dato está mal, el juego le marca error al que se sabe el tema. La defensa no es
> verificar: es **rotular bien**, en las tres casillas que el schema ya hace cumplir.

> **Lo que queda para el ciclo 3, en orden de valor.** `letras` es la única categoría en
> cero y ahora tiene fuente (`D-13`): son las 10 que faltan para el piso de 40 de `US-01`.
> `US-02` y `US-03` tienen contrato o insumo pero **ningún ítem cargado**, y `US-04`
> tampoco. Del lado de derechos, las **8 preguntas legales bajaron a 4**: `RES-11` a
> `RES-14` respondieron audio, tapas y cita de versos. **`ADR-01` ya no espera `E-04`:
> `RES-26` lo volvió irrelevante** — ver abajo.

> ✅ **RESUELTO — el bloqueo de alcance por falta de letras se desarmó. No hay que tocar el
> piso de `US-01` ni la definición de "Listo".**
>
> La versión anterior de este aviso decía: `RES-23` descartó letras.com, no hay otra fuente,
> la categoría `letras` no se puede escribir, el piso de 40 no se alcanza por aritmética
> (techo 30/40), y `US-03` queda bloqueado entero. **Esa cadena partía de una premisa que el
> usuario dio por cerrada el 2026-08-19: que hacía falta una fuente autorizada.**
>
> **Decisión del usuario, con la objeción de `RES-23` sobre la mesa:** se usan letras.com y
> **bestiarioredondo** igual. Fundamento: *la banda tiene una mística de pocas cosas
> oficiales*, y la investigación lo respalda — no hay sitio oficial de letras, nunca lo
> hubo, el memoir no las trae (`RES-21`), y la banda se construyó sin multinacional, sin TV
> y sin publicitar recitales (`RES-07`). **Esperar una fuente oficial es esperar algo que la
> banda deliberadamente nunca produjo.**
>
> El riesgo de `RES-23` sigue siendo real y se acepta acotado, con cinco mitigaciones. Dos
> importan de verdad: **cruzar todo contra los 105 temas de `RES-20`** —obligatorio, gratis,
> y mata el único error demostrado de la fuente, las 149 entradas contaminadas con material
> del Indio solista y de Skay— y **confirmar de oído contra el disco**, que es realista
> porque `BR-03` muestra 2/1/0 versos: el piso de `US-03` necesita **~30 versos**, no 15
> letras enteras. Detalle en la sección final de `INV-21-letras-y-fuimos-reyes.md`.
>
> ✅ **Ya está registrado como `D-13`.** El hilo principal le asignó el número, y de paso
> quedó escrita en `Docs/IDS.md` la regla que faltaba: **el prefijo `D-` lo escribe solo la
> sesión principal**; una sesión paralela deja la propuesta sin número y espera. No haberlo
> numerado desde allá fue lo correcto.
>
> **`D-14` fue más lejos que esto:** ya no se trata solo de las letras. El conocimiento
> popular es fuente legítima para todo el proyecto.

> ⚠ **Dos sesiones escriben este archivo.** El encabezado quedó desfasado de su propia
> bitácora porque las dos sesiones lo actualizan y ninguna ve a la otra. **Manda el disco y
> manda la bitácora**, que es acumulativa: si el encabezado dice algo que la bitácora
> contradice, gana la bitácora. `Docs/EQUIPO.md` dice que `ESTADO.md` es del hilo
> principal, pero eso se escribió cuando había un solo hilo principal.

> ⚠ **La sesión paralela de investigación abrió una segunda tanda.** Entregó
> `RES-04`..`RES-09` en `INV-02-banda-cultura-estetica.md` (rango consumido entero) y ahora
> `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`, porque el usuario consiguió los
> libros. **Esta sesión sigue numerando en `RES-10`..`RES-19`**; `RES-04`..`RES-09` están
> quemados y `RES-20`..`RES-29` son de la otra. Reserva completa en `Docs/IDS.md`.

> 🔴 **Y trajo un dato que nadie tenía: el Indio Solari murió el 5 de junio de 2026**
> (`RES-04`, dos fuentes independientes). Todo el repo se escribió hoy hablando de la banda
> sin saberlo. **No cambia el alcance ni los cuatro juegos.** Deja dos cosas por decidir, en
> `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`.

## Sesión suelta del 2026-08-23 (2) — la voz del sitio, medida

El usuario pidió **analizar a fondo cómo habla y escribe el Indio** para que el sitio no
tenga texto genérico y para que los juegos se presenten *como si fueran un tema*. Era la
idea que estaba guardada desde el 21 en
`Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md`: **se tomó**, y ese
archivo ahora cierra con lo que se resolvió y lo que queda.

**Regla nueva: `.claude/rules/voz-ricotera.md`**, con el mismo estatuto que
`diseno-marca.md` — obliga a todos, roles incluidos. Los números salen de medir dos corpus
que ya estaban en el repo, **sin salir a la web**: el memoir (`RES-21`, 192.464 palabras) y
las letras de los 104 temas del cancionero (2.958 versos).

**Los tres hallazgos que más corrigen la intuición:**

1. **No es el porteño de la caricatura.** En 192.464 palabras dice *che* **9** veces,
   *viste* **15**, *digamos* **3**. Meter esas muletillas para sonar argentino es
   exactamente lo que no suena a él.
2. **Dice "la gente"** (333) y casi nunca "el público" (39) ni "los fans" (**2**).
3. **Declara la duda todo el tiempo** (*creo que* 81, *no sé* 71, *puede ser* 41) y **no
   tiene épica militante** (*lucha* 6, *resistencia* 7). El sitio no arenga: rodea, atenúa
   y avisa cuando no sabe — que es, de casualidad perfecta, el mecanismo que Wikipedia no
   puede usar y que `D-20` fue a buscar para la Redondopedia.

**Tres registros, y mezclarlos es el defecto:** *el que canta* (títulos, casetes, botones;
techo de 8 palabras, que es el percentil 90 del verso), *el que cuenta* (Redondopedia,
explicaciones; oración de ~13 palabras) y *el que rotula* (leyenda, testimonio, errores,
avisos, y los tres temas de `CNT-04`/`CNT-06`), que va **seco y sin voz**.

**La línea que no se cruza, escrita antes que nada:** el sitio escribe como aprendió
escuchándolo, **nunca se hace pasar por él**. Murió hace once semanas (`RES-04`) y, sobre
todo, una frase inventada con su firma envenenaría el rótulo `testimonio`, que es lo único
que el sitio promete de verdad.

**El test que faltaba existe: `src/lib/voz.test.ts`**, seis pruebas sobre las cadenas
visibles de los cinco módulos de copy. Encontró **once botones en infinitivo** —que `D-17`
no permite— y se corrigieron: `COMPARTIR`→`COMPARTÍ`, `JUGAR DE NUEVO`→`JUGÁ DE NUEVO`,
`VOLVER`→`VOLVÉ`, y los `Empezar`/`Seguir`/`Volver` de `letra` y `tapa`. **185/185 en
verde.** `CNT-05` (de `contenido`) y `UX-01`/`UX-02`/`UX-04`/`UX-05` (de `experiencia`)
todavía citan el texto viejo: quedó anotado en la sugerencia, no se tocaron.

**El barrido se aplicó**, con las dos decisiones del usuario tomadas en la misma sesión:
la Redondopedia va con **prosa con voz y rótulo seco**, y el copy nuevo entra en **las
superficies que presentan** — portada, los seis casetes, la pantalla 0 de cada juego y los
tramos del resultado. **No se tocó nada de adentro de la partida**: enunciados, opciones e
instrucciones siguen bajo `CNT-02` y `UX-01`, donde entender va antes que sonar.

Ahora cada casete abre con un verso de ocho palabras o menos y explica después — "Ocho
preguntas y ninguna piadosa", "Lo tenés en la punta de la lengua", "Rocambole dibujó; vos
ponés el disco", "El hecho como hecho, la leyenda como leyenda" —, y la portada arranca con
"Entrá, que los molinetes van abiertos". Verificado en el sitio construido (147 páginas,
sin errores de consola). **186/186 tests, `tsc` con 0 errores.**

## Sesión suelta del 2026-08-23 (3) — "Adiviná el tema" salió de la cocina

El usuario trajo el juego que quiere **calcado**: https://lessgames.com/songless. Pidió el
relevamiento antes que el código —*"no hay que reinventar la rueda"*— y tres cosas
concretas: elegir **todos los temas o por disco**, **autocompletado** para no perder el
tiempo tipeando, y que el **botón de escuchar sea fácil y rápido**. Y la escalera:
**0,1 · 0,5 · 2 · 4 · 8 · 15 segundos**.

**El mapa está en `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`**, jugado y
medido con el navegador, no mirado de costado: la escalera se sacó apretando *Skip* cinco
veces y leyendo la etiqueta; los anchos de la barra, del CSS; la búsqueda difusa, probando
`zzzzq` y viendo que ofrece temas de ZZ Top. Trae la tabla de qué se copió y qué **no**, y
por qué.

### Lo que quedó andando

**`/juegos/adivinar-el-tema/` se juega.** Pantalla nueva de punta a punta, verificada en el
navegador a 390×844 y a 412×860:

- **Elegís el pozo**: todos los discos, o uno. Los discos sin audio salen apagados y con
  el motivo escrito, no escondidos.
- **Seis renglones de intento**, visibles desde el arranque: la escalera se ve antes de
  gastarla. **Errar abre el escalón siguiente** — es el corazón del juego, y es lo
  contrario de lo que decía `BR-02`.
- **Barra de seis tramos**, cada uno del ancho de lo que *ese* paso agrega. El último se
  come la mitad, porque de 8 a 15 hay siete segundos nuevos.
- **Un solo botón grande que cambia de nombre**: con la caja vacía dice *Pasá*; con un tema
  elegido dice *Arriesgá*. Mismo lugar, mismo pulgar.
- **El buscador**, que es la pieza que el usuario marcó como importante. Perdona tildes,
  espacios (`jijiji` = `Ji ji ji`), empezar por el medio del título y letras salteadas
  (`vncdrs` → *Vencedores vencidos*). **La lista se abre para arriba**, que es lo único que
  el teclado del celular no tapa. Ofrece **los 105 títulos**, no los que tienen audio: si
  ofreciera solo los jugables, el desplegable sería la respuesta.
- **El reveal** da tema, disco, año, pista, puntos, el enlace a la letra y los acordes, y
  el tema entero si el archivo existe (`D-22`).
- **185 tests en verde**, `npm run check` sin errores, 147 páginas.

### 🔴 Lo único que falta, y es un archivo, no una decisión

**No hay audio.** `public/audio/` no existe y el manifiesto está vacío, así que la portada
dice que no hay con qué jugar y da el comando. **La pantalla no se rompe: lo declara.**

Para prenderlo, con la discografía que el usuario ya tiene en la máquina (`D-23`):

```
npm run generar-fragmentos -- "<carpeta con los discos>"
```

Empareja cada archivo con los 105 de `RES-20` por la misma puerta de `D-13` que usa el
cancionero —**lo que no resuelve se informa y no se genera**—, corre los dos comandos de
`CTR-01.6` (`loudnorm` sobre el tema entero, después el recorte a 96 kbps mono) y verifica
la tabla de `CTR-01.7` archivo por archivo. Con `--enteros` deja además el tema completo
para el reveal.

**Necesita ffmpeg y en esta máquina no está.** `winget install Gyan.FFmpeg`, o pasarle la
ruta con `--ffmpeg=`.

### Lo que hay que corregir, y no es del hilo principal

- **`BR-02` quedó al revés de lo que el juego hace** (intento único vs. seis intentos con
  desbloqueo) y le falta la sexta fila de puntaje. Pedido en
  `HILO-para-producto-mecanica-y-escalera-de-us02.md`. **La tabla que puse —100/80/60/40/
  20/10— es provisoria.**
- **`CTR-01.9` sigue con cinco pasos y 10 s.** `D-23` ya había escrito los 15 s; el máximo
  de `CTR-01.3` sale de `CNT-01` y quien tiene que confirmarlo es `contenido`. Pedido en
  `HILO-para-arquitectura-escalera-de-seis-y-modo-buscador.md`, junto con el
  `modoRespuesta: "buscador"` que cierra `CTR-03.5` con un valor que no estaba en la lista.
- **`D-23` tiene un número viejo, y a favor:** dice 12,5 MB para los 104 fragmentos, pero
  eso son 120 KB cada uno, que es el peso de **10** segundos. A 15 s son ~180 KB → **~19 MB**.

### Dos hallazgos al costado

1. **La letra de la firma no tiene acentos** (`RES-42`), así que el botón `Compartí` salía
   partido a la mitad de la palabra — se veía roto de verdad, no en teoría. Resuelto como
   la regla de marca ya mandaba: la palabra va en `--fuente-rotulada` y **no** se le saca la
   tilde (`D-17` no negocia el voseo). Clase `.primario.firma.con-tilde`, que se borra el
   día que los acentos existan.
2. **Los `<style>` de un `.astro` tienen alcance y no llegan a lo que crea el JavaScript.**
   Por eso el botón de compartir salía angosto — en este juego **y en el quiz**. Se movió
   la caja de `.primario.firma` a `juego.css`; ahora los dos empatan con el botón de abajo.

**Rangos consumidos por esta sesión:** `D-24`. Libres: `T-97`+, `D-25`+, `RES-51`+,
`CNT-08`+, `REV-06`+, `UX-06`+, `BR-16`+.

---

## Próximo paso

**Empezar el ciclo 9 por `T-128`, `T-129` y `T-130`**, que son las tres que arrancan sin
depender de nada: la decisión `D-25`, la regla del quiz por vidas (`BR-19`) y la historia
del juego nuevo (`US-07`). Plan entero en `Docs/ORQ/ORQ-plan-ciclo-9.md`.

Estado de los pisos, medido el 2026-08-25 contra los JSON del repo:

| Historia | Piso | Hoy | Qué falta |
|---|---|---|---|
| `US-01` Quiz | 40 | **40** ✅ | pasa a vidas en el ciclo 9 |
| `US-02` Adiviná el tema *(audio)* | 30 | **0** | **ffmpeg y los mp3** — lo único que separa a la v1 de cerrar |
| `US-03` Completá la letra | 15 | **0** de 1.784 | lo destraba el ciclo 9 (`D-25`) |
| `US-04` Adiviná la tapa | 10 | **10** ✅ | — |
| `US-05` Redondopedia | 35 | **35** ✅ | — |
| `US-06` Dos ejes *(fuera de v1)* | — | 28 | — |
| `US-07` Por la letra *(nuevo)* | a fijar | 0 | lo construye el ciclo 9 |

**Lo que no toca el ciclo 9 y sigue esperándote:** los fragmentos de audio de `US-02`
(ffmpeg **no está instalado en esta máquina** — verificado el 2026-08-25) y la clave de
YouTube (`popularidad.json` tiene los **105 temas en `sin-video`**).

> ⚠ **Lo que sigue abajo de esta línea quedó del ciclo 4 y está desactualizado.** Se deja
> por trazabilidad: los pisos que menciona son los viejos (40/20/15/10, hoy 40/30/15/10),
> "desplegar en Vercel" ya está hecho, y la Redondopedia ya cerró su piso de 35. **No
> tomes ninguna instrucción de acá para abajo sin cruzarla con el encabezado.**

### Histórico — el próximo paso tal como se escribió en el ciclo 4

**Correr `/ciclo` para el ciclo 5.** El ciclo 4 cerró entero. Hay **dos juegos jugables**
(el quiz y adivinar la tapa) y las tapas reales visten el sitio.

**Lo que más acerca el "Listo" de la v1, en orden:**

1. **Las letras, que son un solo frente aunque parezcan tres.** `US-03` (completar la
   letra) tiene contrato desde `T-62` (`CTR-04`), las 10 preguntas de `letras` cierran el
   piso de 40 de `US-01`, y los 6 artículos `tema` cierran el piso de 35 de `US-05`. Las
   tres cosas esperan el mismo insumo: **versos**. `RES-45` evaluó la fuente que trajiste
   (redondossubtitulados) y `BR-12` ya fijó que un artículo `tema` lleva versos citados y
   análisis, no la letra entera. Falta que alguien vaya a buscar el material.
2. **`US-02` (adivinar el tema) sigue esperándote a vos.** `CTR-03` pide `origen` y
   `fechaCorte` por ítem, y esos campos salen de recortar los mp3. Ningún rol puede
   inventarlos.
3. **Desplegar en Vercel.** Nada lo bloquea desde `D-14` y `D-15`, y ahora el sitio tiene
   algo que mostrar.

**Lo que el ciclo 4 dejó afuera a propósito, y conviene que el 5 decida:** la sección 2 de
`UX-05` — las **siete superficies del quiz** que el catálogo viste con tapas (fondo en la
presentación y en el resultado, detalle por categoría, y el sello de esquina para el
crédito en una isla que no tiene pie). El plan del ciclo 4 nunca las cubrió: sus tareas de
aplicación eran el portal, las pantallas en la cocina y la Redondopedia. No es un olvido
ahora, es una tarea del ciclo 5 — o una fila que `experiencia` retira del catálogo.

**Rangos:** el ciclo 4 consumió `T-44`..`T-63`, `D-21`, `RES-44`..`RES-46`, `CTR-04`,
`CTR-05`, `BR-12`, `CNT-06`, `UX-05`, `REV-05`.

> ⚠ **Ojo con `D-22`: lo tomó la otra sesión, no este ciclo.** Esta línea decía que estaba
> libre y para cuando el ciclo 5 arrancó ya estaba escrito — es exactamente el choque de
> numeración que `Docs/IDS.md` avisa que pasa cuando dos sesiones escriben el mismo repo, y
> pasó igual. **`D-22` es "los temas enteros se alojan en el sitio, en mp3"**, y no es un
> detalle: saca "alojar los temas completos" de Fuera de alcance, baja a Spotify de promesa
> a extra, y mete un problema nuevo que es el peso (unas 7,2 horas de audio, entre 300 MB y
> 1 GB según bitrate). Su propia consecuencia 4 dice que **los límites de Vercel para ese
> volumen no están fichados y conviene chequearlos antes y no después** — o sea que hace
> falta un `RES-XX` antes de subir el primer mp3.

Consumido por el ciclo 5 hasta ahora: `T-64`..`T-68`, `T-70`, `T-71`, `T-76`, `T-77`, `T-81`,
`RES-47`, `RES-48`, `BR-14`, `BR-15`, `CNT-07`. Libres: `T-82`+, `D-23`+, `RES-49`,
`CNT-08`+, `REV-06`+, `UX-06`+, `BR-16`+.
**Actualización 2026-08-22:** `D-22` ya está tomado (los mp3 enteros) — el próximo libre es
**`D-23`**. También se consumieron `BR-15`/`BR-16` e `IDEA-01`..`IDEA-10` (backlog de
ideas), y el ciclo 5 tiene reservados `BR-13`/`BR-14` para `T-66`/`T-67`.

> 🆕 **La Redondopedia ya está construida y navegable con 26 de los 35 artículos del piso**
> (sesión 2026-08-21 — ver bitácora). El sitio entero tiene esqueleto: portal collage en
> `/`, el quiz mudado a `/quiz/` (los links de desafío viejos redirigen solos), tres
> pantallas "en la cocina" para los juegos que faltan, y `/redondopedia/` con portada e
> índice por tipo. Lo que falta para el piso de `US-05`: los 6 `tema` (esperan la carga de
> letras con el filtro de `D-13`) y Bulacio y Olavarría (esperan la relectura de `CNT-04`,
> `BR-10` — por eso `hito` está en 5/7). De las tres dependencias del PRD, el hilo
> principal dejó **versiones v0 andando** y una propuesta por rol en `Docs/SUGERENCIAS/`:
> el contrato de colección con rótulo por afirmación vive en `src/lib/redondopedia.ts` +
> `src/data/redondopedia.json` (formalizar: `arquitectura`), el patrón de lectura y el
> rótulo visual en prosa viven en `src/styles/sitio.css` (bendecir: `experiencia`), y el
> chequeo del grafo de `BR-09` corre como test (`npm test`, sin huérfanos ni callejones).

Tres frentes, y el primero es el que más acerca el "Listo":

1. **Los otros tres juegos no tienen un solo ítem.** `US-02` (adivinar el tema) tiene
   contrato (`CTR-03`) pero necesita que **vos recortes los primeros mp3** — `origen` y
   `fechaCorte` no son inventables. `US-03` (completar la letra) tiene fuente desde `D-13`
   pero le falta el schema `CTR-04`. `US-04` (adivinar la tapa) necesita `CTR-05` y las
   imágenes.
2. **`letras` sigue en 0/10** y son las 10 que faltan para el piso de 40 de `US-01`.
3. **Desplegar.** No hay nada que lo bloquee: `D-14` sacó el gate y `D-15` eligió Vercel
   con salida estática. Conectar el repo y listo.

**Hay un brand system en curso en otra sesión.** Cuando aterrice, reemplaza los valores de
`src/styles/tokens.css` y **no hace falta tocar `src/styles/juego.css`**: ese archivo no
tiene un solo color literal, todo sale de variables. Ojo con una cosa: hay un test que
exige **WCAG AA en 12 pares de color**, así que cualquier paleta nueva tiene que pasarlo.

Lo que sigue después, por orden de valor:

1. **Actuar sobre `REV-01`.** `revisor` encontró que `CNT-01` está **desactualizada
   respecto de investigación que ya existe**: 4 de las 11 preguntas de derechos tienen
   respuesta en `RES-06` y `RES-09`, y la nota las trata como si siguieran en cero
   (`FIND-01` a `FIND-04`). Se arregla leyendo, sin investigar nada. Dueño: `contenido`.
2. ~~**La decisión de alcance de `producto`** sobre el piso de `US-01`.~~ **YA NO HACE
   FALTA.** Partía de que no había fuente de letras; el usuario decidió las fuentes y el
   piso de 40 vuelve a ser alcanzable. Ver el bloque ✅ del encabezado. Lo que sí queda para
   `contenido` es **cargar los versos aplicando el filtro de los 105 temas de `RES-20`**.
3. **⚠ `ADR-01` cambió de eje y conviene mirarlo antes de escribir integración.**
   `RES-26` encontró que la **Spotify Developer Policy III.2 dice textualmente *"Do not
   create a game, including trivia quizzes."*** Verificado en dos fetches independientes.
   Eso **compromete la opción A (embed)** por contrato, no por dificultad técnica, y
   **vuelve irrelevante `E-04`**: aunque la prueba diera que el embed reproduce el tema
   entero sin Premium, seguiría prohibido. **Podés sacar esa prueba de tu lista.**
   La opción B (deep link) probablemente sobrevive —`RES-09` verificó que el catálogo está
   en Spotify oficialmente desde 2017— pero **falta responder una sola pregunta: si un deep
   link simple cuenta como "acceder a la Spotify Platform"**. Esa pregunta reemplaza a
   `E-04`. Propuesta para `arquitectura` y `producto` en
   `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md`.
   La prueba de `E-07` que sí sigue teniendo sentido: abrir un deep link desde el celular
   sin Premium y anotar si suena a demanda o entra en shuffle.

**Cerrado del ciclo 1:** las 14 tareas, `T-01` a `T-14`, más los seis hallazgos de
`REV-01` y los dos de `REV-02`. Nada quedó abierto de ese ciclo.

Si querés avanzar por otro lado en vez de seguir el plan, hay **tres frentes que no se
bloquean entre sí**:

1. **`investigador`** — quedan las dos preguntas de `ADR-01` (`E-04`: qué reproduce el
   embed de Spotify para alguien sin Premium; `E-07`: si un usuario free en Argentina puede
   escuchar un tema a demanda). **Los tracklists ya no están pendientes** (`RES-20`: los
   diez discos, 105 temas), ni las referencias de Rocambole (`RES-06`), y 4 de las 11
   preguntas de derechos quedaron respondidas entera o parcialmente (`RES-06`, `RES-09`).
   **La fuente de letras también quedó decidida** (ver el bloque ✅ del encabezado): ya no
   es un pendiente de investigación sino de carga.
2. **`contenido`** — es, por lejos, el rol con más material sin usar: schema (`CTR-02`),
   tono (`CNT-02`), discografía (`RES-02`), **cronología (`RES-05`), mitología rotulada
   (`RES-08`), tracklists con autoría (`RES-20`)** y las memorias del Indio en PDF
   (`RES-21`). Tres preguntas ya vienen casi servidas: "Ji ji ji" y su leyenda desmentida
   por el autor (`RES-08`), la letra impresa en el sobre de *Oktubre* de un tema que no
   está en el disco (`RES-22`), y los dos únicos temas con un tercer autor (`RES-20`).
   Antes del primer lote tiene que fijar el límite editorial sobre Bulacio y Olavarría
   (`RES-07`) — y ojo que el capítulo 14 del memoir se llama "Walter David Bulacio".
3. **Vos** — dos cosas, las dos cortas:
   - Ya podés recortar audio siguiendo `CTR-01` (`Docs/ARQ/ARQ-fragmento-audio.md`,
     secciones `CTR-01.6` y `CTR-01.7`). **No te saltees guardar el máster en WAV fuera
     del repo:** es lo único que hace barato bajar la duración si la nota de derechos lo
     pide.
   - **Podés desbloquear `ADR-01` vos mismo en cinco minutos.** `E-04` pregunta qué
     reproduce el embed de Spotify para alguien sin Premium, y no aparece en ninguna
     fuente primaria. Como tenés Premium, la prueba es directa: abrí
     `https://open.spotify.com/embed/track/<trackId>` de cualquier tema en una ventana de
     incógnito (sin sesión) y después con tu sesión iniciada, y anotá si suena el tema
     entero o se corta a los 30 segundos. `ADR-01` ya dejó dicho que eso vale como
     **observación fechada del proyecto**, un escalón por debajo de una fuente y rotulada
     como tal.

## Tablero

| Ítem | Rol | Estado | Nota |
|---|---|---|---|
| Historias, pisos de ítems y reglas de negocio de los 4 juegos | `producto` | hecho | `US-01`..`US-04`, `BR-01`..`BR-03` en `Docs/PRODUCTO/PRD-alcance-v1.md`. Pisos: **40 / 30 / 15 / 10** — el de `US-02` subió de 20 a 30 en `T-99` (ciclo 7) |
| `T-01` — `BR-04`: opciones por pregunta | `producto` | hecho | **4 opciones**, mismo número para `US-01` y `US-04`. Fundamento: con 3 el azar sube a 33% y vacía "premiar al que sabe"; con 5 cede "jugable con el pulgar". `CTR-02.5` pasa de valor de trabajo a **confirmado** sin editar `Docs/ARQ/` |
| `ADR-01` — vía de integración con Spotify | `arquitectura` | **en curso** | `Docs/ARQ/ARQ-spotify-integracion.md`, revisión 2. **C y D descartadas con evidencia** (`RES-01`). Quedan A (embed) contra B (deep link), y solo faltan `E-04` y `E-07`. **El fallback ya está cerrado**, así que no frena a nadie |
| `CTR-01` — fragmento de audio | `arquitectura` | hecho | MP3 mono 44,1 kHz 96 kbps, máx **10,0 s — cerrado por `CNT-01`, ya no es valor de trabajo** (`T-09` + `T-10`). Escalera del reveal **0,1 / 0,5 / 2,0 / 5,0 / 10,0 s**; precarga recalculada a **5,3 MB**. Crédito (tema/disco/año) ahora es campo **obligatorio**: publicar audio sin firmar no valida. `BR-02` sobrevive sin cambios |
| `T-02` — `BR-05`: cortes de los tramos de resultado | `producto` | hecho | **30% y 70%**. El corte de abajo se separó a propósito del 25% del azar, para que "medio" no se llene de respuestas tiradas al voleo. Los 9 resultados posibles de una ronda de 8 caen 3 en cada tramo |
| `T-03` — `BR-06`: qué promete la v1 sobre Spotify | `producto` | hecho | `Docs/PRODUCTO/PRD-promesa-spotify.md`. Promete **acceso** al tema, no reproducción íntegra. Redactada para que ningún desenlace de `E-04` ni `E-07` obligue a reescribirla. **El brief ya fue corregido** |
| `T-04` — schema corrible del quiz | `arquitectura` | hecho | `src/data/_schema/quiz.schema.json`. **Verificado por el hilo principal contra 8 casos** (`D-12`): rechaza ítem sin fuente, leyenda sin rótulo, 3 o 5 opciones, fuente con formato inválido, y ninguna opción correcta |
| `CNT-03` — criterios sobre las discrepancias | `contenido` | hecho | `Docs/CONTENIDO/CNT-03-criterios-discografia.md`. Vedó el sello de *Luzbelito* y el conteo pelado de álbumes. **Ojo: `RES-20` resolvió lo de *Luzbelito* después — el veto se puede levantar** |
| `RES-10` — Spotify free a demanda en Argentina | `investigador` | hecho | `Docs/INVESTIGACION/INV-03-spotify-free-argentina.md`. **Sí se puede elegir tema desde sep-2025, pero con cupo diario no divulgado.** Sin confirmación por país ni para el reproductor web |
| `CTR-02` — schema del banco del quiz | `arquitectura` | hecho | `Docs/ARQ/ARQ-schema-quiz.md`. **Desbloquea a `contenido`.** Convierte dos criterios blandos en validaciones de máquina (ver abajo) |
| `ADR-02` — formato del link de resultado compartido | `arquitectura` | hecho | `Docs/ARQ/ARQ-link-resultado-compartido.md`. **Ojo `UX-02`:** la vista previa del tuit no puede llevar el puntaje |
| `CTR-03`..`CTR-05` — schemas de `US-02`, `US-03`, `US-04` | `arquitectura` | pendiente | No se escribieron a medias a propósito. `US-01` es P0 y era lo que desbloqueaba |
| `RES-01` — estado real de las APIs de Spotify | `investigador` | hecho | `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`. `preview_url` restringido desde el 27-nov-2024; el SDK exige Premium |
| `RES-02` — discografía de estudio | `investigador` | hecho | Nueve álbumes con año y sello, cruzados en tres fuentes. **Trae tres discrepancias sin promediar** — leerlas antes de escribir preguntas |
| `RES-03` — marco de derechos en Argentina | `investigador` | hecho | No hay *fair use* en Argentina; el derecho de cita topea en **8 compases** de música y 1000 palabras de texto (Art. 10, Ley 11.723) |
| Referencias visuales de Rocambole | `investigador` | **hecho** | `RES-06` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. Técnica, íconos, origen de cada tapa y su postura sobre uso libre. **Levanta el bloqueo de `UX-04`** |
| `RES-04` — muerte del Indio Solari | `investigador` | hecho | **Murió el 5-jun-2026.** Dos fuentes independientes. Nadie lo había registrado. Ver la alerta arriba |
| `RES-05` — cronología verificada de la banda | `investigador` | hecho | Formación, hitos, recitales grandes, último show y separación. **Corrige el "Huracán en el 89" del BRIEF: fue 93 y 94** |
| `RES-07` — cultura ricotera (misa, aguante, autogestión) | `investigador` | hecho | Insumo de tono y de sistema visual. **Trae un límite editorial a decidir**: Bulacio y Olavarría son muertes reales |
| `RES-08` — mitología ricotera rotulada | `investigador` | hecho | "Ji Ji Ji" y su leyenda **desmentida por el propio Indio en 2007**. Insumo directo de la categoría mitología |
| `RES-09` — titularidad de derechos y catálogo en streaming | `investigador` | hecho | **Erks S.A.** (Indio/Skay/Poli, 1992). Catálogo completo en Spotify desde el 28-jul-2017 vía The Orchard. **Le sirve a `ADR-01`** |
| `RES-20` — tracklists de los 10 discos | `investigador` | **hecho** | `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`. **105 temas** con duración y autoría por tema. **Desbloquea `US-02` y `US-03`.** Resuelve el sello de *Luzbelito*; trae 3 discrepancias nuevas sin promediar |
| `RES-21` — el memoir del Indio como fuente | `investigador` | hecho | PDF del usuario en `Docs/INVESTIGACION/`. Mapa de los 27 capítulos. **El propio libro se declara "apenas mi versión", no verdad unívoca** — usarlo como *testimonio rotulado*, tercera categoría además de hecho y leyenda |
| `RES-22` — correcciones a `INV-02` desde fuente primaria | `investigador` | hecho | **Corrige `RES-05`** (Patricio Rey: el personaje es invento, pero Rocambole dijo que existía y vivía en Salta). Confirma `RES-08`. **Sube 3 tapas de "reportado" a testimonio** y cubre el hueco de *Último bondi* |
| `RES-23` — letras.com como fuente de letras | `investigador` | hecho, **con decisión del usuario encima** | `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md`. La ficha responde la pregunta 9 en negativo: contribución abierta, sin licencia declarada, 149 temas contra los 105 reales. **Pero el usuario decidió usarla igual** (mística de pocas cosas oficiales) con 5 mitigaciones. **No escales esto a bloqueo de alcance sin leer la sección final del archivo** |
| `RES-24` — *Fuimos reyes*: estructura y límite del preview | `investigador` | hecho | El lector web está topeado en **1%**: la sección "Discografía" figura en el índice pero **no carga**. Sí quedó el **mapa completo de los 20 capítulos**. Si el usuario consigue el libro, **abrir primero "Discografía"**: resuelve las tres discrepancias vivas de una |
| `RES-25` — de dónde salen las tapas: 6 vías | `investigador` | hecho | `Docs/INVESTIGACION/INV-22-imagenes-tapas-y-spotify.md`. **Ocho vías descartadas**; solo Cover Art Archive queda como conducto técnico, y **no mejora la posición legal, solo no la empeora**. **bestiarioredondo no tiene tapas** (su unidad es la canción) y no declara licencia. **Ninguna vía resuelve el derecho** |
| ⚠ `RES-26` — Spotify prohíbe los juegos por contrato | `investigador` | **hecho — decisivo** | Developer Policy III.2 textual: *"Do not create a game, including trivia quizzes."* Verificado en dos fetches independientes. **Compromete la opción A de `ADR-01` y anula `E-04`.** Propuesta en `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md` |
| `CNT-01` — nota de derechos | `contenido` | **esbozo, al día** | `Docs/CONTENIDO/CNT-01-nota-derechos.md`. Duración cerrada en 10 s (`T-09`) y los seis hallazgos de `REV-01` incorporados: ya refleja `RES-06` y `RES-09`, y **"obra registrada" bajó de `[x]` a supuesto heredado** (`FIND-05`). **El gate de `D-07` sigue cerrado**: faltan las 8 preguntas legales de fondo, que ninguna ficha responde todavía |
| `CNT-02` — guía de tono | `contenido` | hecho | Regla central: la jerga va en el tono, nunca en la barrera. Cuatro pares bien/mal |
| Primer lote de preguntas del quiz | `contenido` | **hecho** | `src/data/quiz.json`, **15 preguntas** `QZ-001`..`QZ-015` (10 `discos` + 5 `mitologia`). **Validado por el hilo principal: `OK 15 items, sin fuente: 0`**, 6 fáciles / 6 medias / 3 difíciles. Faltan 25 para el piso de `US-01` |
| `REV-01` — revisión de la nota de derechos | `revisor` | hecho | `Docs/REVISIONES/REV-01-nota-derechos.md`. `FIND-01`..`FIND-06`. **Veredicto: el gate sigue cerrado**, pero no porque la nota mienta — porque está desactualizada respecto de `RES-06` y `RES-09` |
| `REV-02` — revisión del lote del quiz | `revisor` | hecho | `Docs/REVISIONES/REV-02-lote-quiz.md`. `FIND-10` (bloqueante) y `FIND-11`. **14 de 15 preguntas bien citadas.** `FIND-10` se resolvió con `RES-20`, que llegó durante la revisión: la respuesta era correcta, faltaba la cita que la hace única |
| Corrección de `FIND-10` y `FIND-11` | `contenido` | hecho | `QZ-005` cita `RES-02` + `RES-20`; `QZ-001` y `QZ-006` pasaron a `media`; `QZ-011` y `QZ-012` sumaron pista real. **Revalidado por el hilo principal: `OK 15 items, sin fuente: 0`**, máximo de enunciado 163/180. Ambos hallazgos cerrados |
| `UX-01`..`UX-04` — flujo del quiz, tarjeta compartible, reveal sin auriculares, sistema visual | `experiencia` | hecho | En `Docs/UX/`. Citan los IDs reales de `producto`, no supuestos |
| Plan del ciclo 1 | `orquestador` | hecho | `Docs/ORQ/ORQ-plan-ciclo-1.md`. 14 tareas, pasada de conflictos escrita, reservas de ID por la sesión paralela |
| Primera revisión de coherencia | `revisor` | pendiente | `T-11` y `T-12` del ciclo 1. Ya hay siete entregables para revisar |
| Reserva de rangos de ID entre sesiones | hilo principal | hecho | `Docs/IDS.md`, sección "Reserva de rangos". **Cierra `T-14` antes de que arranque el ciclo** |
| `US-05` + `BR-07`..`BR-11` — la Redondopedia | `producto` | hecho | `Docs/PRODUCTO/PRD-redondopedia.md`, consume `D-20`. Seis tipos de artículo, piso **35**, navegación sin huérfanos verificable (`BR-09`), rotulado granular en prosa (`BR-08`), Bulacio y Olavarría como artículos propios con contingencia (`BR-10`), orden de recorte interno (`BR-11`). Tres dependencias señaladas: `arquitectura`, `experiencia`, `contenido` |
| Esqueleto del sitio: portal, rutas y collage | hilo principal | **hecho** | Portal en `/` (lado A juegos, lado B lectura), quiz en `/quiz/` con redirección de desafíos viejos, 3 pantallas "en la cocina", `Base.astro`, `sitio.css` sin un hex, recortes reemplazables en `public/arte/` con despiece fundado en `RES-06`/`RES-22` (README de esa carpeta). Tokens nuevos `--papel` y `--textura-grano` — **deuda: aterrizarlos en el lienzo, hoja 07** |
| Redondopedia v1 — primera tanda cargada | hilo principal | **hecho, 26/35** | `src/data/redondopedia.json`: 10 `disco` + 5 `persona` + 5 `hito` + 4 `concepto` + 2 `leyenda`, desde las fichas `RES-` vía redacción + verificación adversarial (21 hallazgos, 5 bloqueantes, todos corregidos — el patrón repetido: inflar "Patricio Rey Discos" a "sello propio de la banda" sin ficha). `BR-08` como segmentos con rótulo+fuente; `BR-09` como test. Faltan 6 `tema` (`D-13`) y Bulacio/Olavarría (`CNT-04`) |
| Tapas reales bajadas y en las fichas de disco | hilo principal | hecho | 35 imágenes de Coveralia (frontal/trasera/CD/interior según disponibilidad) en `Docs/INVESTIGACION/TapasDiscos/`; bajas de 320 px en `public/tapas/` (`node scripts/generar-tapas.mjs`) — solo en artículos `disco`, con crédito a Rocambole (`BR-07`, `D-04`, `UX-04`) |

> ⚠ **Este Tablero es histórico y algunas filas quedaron viejas.** Las conocidas al
> 2026-08-25: la Redondopedia dice 26/35 y **cerró en 35/35**; `CTR-03`..`CTR-05` figuran
> pendientes y **están escritos**; `ADR-01` figura en curso y `RES-51` lo cerró en
> negativo. **Para el estado real de los pisos, mirá la tabla de "Próximo paso".**

Estados posibles: `pendiente` · `en curso` · `bloqueado` · `hecho` · `cancelado`

## Ideas guardadas — no se hacen ahora

> Pedidos del usuario registrados a propósito **fuera** del ciclo en curso. No son
> bloqueos ni tareas: son cosas que van a pasar, todavía sin fecha. Las dos primeras siguen
> sin ID, con su propuesta en `Docs/SUGERENCIAS/`; las diez ideas de juegos del 2026-08-22
> ya tienen ID propio — ver abajo.

| Idea | Origen | Dueños cuando se tome | Puntero |
|---|---|---|---|
| **Que el sitio intente hablar como el Indio.** Analizar a fondo letras, entrevistas y demás archivo para destilar una guía de voz por encima de `CNT-02` y `D-17`. El usuario la marcó como idea futura, con esas palabras | usuario, 2026-08-21 | `investigador` junta el corpus (única puerta a la web), `contenido` destila la guía | `Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md` |
| **Las bandas ricoteras de después de la separación entran a la Redondopedia.** El usuario nombró tres: *La Kermesse Redonda*, *Indio y los Fundamentalistas del Aire Acondicionado* y *Skay y los Fakires*. **Que entran no está en discusión**; falta ficha que verifique los nombres y decisión de `producto` sobre tipo y piso | usuario, 2026-08-21 | `investigador` (ficha), `producto` (tipo + piso), `contenido` (escribe) | `Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md` |

### Las ideas de juegos guardadas — `IDEA-01`..`IDEA-11`

El usuario tiró diez ideas de una y pidió **guardarlas todas sin empezar ninguna**. Esas
diez están en `Docs/PRODUCTO/PRD-backlog-ideas.md`, cada una con su ancla ricotera verificada contra
los 105 temas de `RES-20` y con el choque que tiene contra lo ya decidido.

| ID | Idea | Tipo |
|---|---|---|
| `IDEA-01` | Separar los temas en pistas y adivinar | original (probable modo de `US-02`) |
| `IDEA-02` | Doom gore — *Masacre en el puticlub* | clon vestido |
| `IDEA-03` | Crazy Toxi-Taxi | clon vestido |
| `IDEA-04` | Plataformas: colgarse del último bondi, con *Gualicho* de fondo | clon vestido |
| `IDEA-05` | Dibujá tu bandera y colgala | original |
| `IDEA-06` | Zoológico de los personajes | original (probable tipo nuevo de `US-05`) |
| `IDEA-07` | Un Pacman en el Savoy | clon vestido |
| `IDEA-08` | Letras y acordes | original, no es juego |
| `IDEA-09` | Test de dos ejes: qué tipo de ricotero sos | original |
| `IDEA-10` | Guitar Hero ricotero | clon vestido |
| `IDEA-11` | Mayor o menor: qué palabra se dice más en el cancionero | original (género conocido, motor mínimo) |

Dos reglas nuevas salieron de ahí: **`BR-15`** (los clones se adoptan vestidos, no se
escriben — instrucción transversal del usuario) y **`BR-16`** (una idea no entra a un ciclo
sin promoverse antes a `US-XX`). Prefijo `IDEA-` registrado en `Docs/IDS.md`.

**Nada de esto es alcance de la v1 y nada de esto está empezado.** Tres preguntas quedaron
abiertas al usuario, listadas al final del PRD: qué es "el gordo Pier" (no figura en los
105), qué es "la tumba del Indio" de `IDEA-05`, y cuál de las tres salidas de audio quiere
para `IDEA-10`.

**`IDEA-11` llegó después, el 2026-08-23**, y todavía **no está pegada en el PRD**: la
carpeta es de `producto`, así que la ficha entera quedó como propuesta en
`Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md`, con el número ya reservado
en `Docs/IDS.md`. El usuario pidió textual *"no hay que desarrollarlo ahora, agregalo como
idea"*. Es de las dos más baratas del backlog —el corpus ya está en el repo desde el ciclo
6— y no toca `BR-03` ni `BR-12` porque muestra palabras sueltas, no versos. **Su único
choque es serio y está medido:** el conteo es la respuesta correcta, y hoy el cancionero
trae anotación de cifra adentro de líneas tipadas como letra, así que la palabra más
cantada de los Redondos da `riff` (306). Sin limpiar eso, el juego le marca error al que
se sabe el tema.

**`IDEA-04` recibió su meta el 2026-08-23** y tampoco está pegada todavía en el PRD:
ficha actualizada en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`.
El usuario pidió "un mario de plataformas simple pero que hay que llegar a tomar el último
bondi a Finisterre" — **no es un juego nuevo, es `IDEA-04` con lo que le faltaba**, así que
no se abrió ID nuevo. La meta **cierra el choque principal que la ficha tenía escrito**: el
que corta el nivel es el bondi que arranca, no un límite puesto de afuera, y de paso empuja
los controles hacia un solo botón. Sigue abierto lo caro: motor 2D con licencia (`BR-15`) y
el skin, que en un plataformas es el más caro de los cinco clones.

**Y el 2026-08-24 el usuario le puso tema: *Gualicho*** (pista 4 del mismo disco), donde el
bondi a Finisterre está cantado y donde alguien se **cuelga** de él — que es el verbo del
juego. Con eso `IDEA-04` es **la única de las cinco ideas de clon con su música decidida**, y
con `D-22` el archivo existe. **Al ir a buscar el verso apareció un agujero:** la letra de
*Gualicho* no está en el repo —cero líneas cantadas, tres líneas de cifrado tipadas como
letra— y en el mismo disco *Pogo* está igual y *El árbol del gran bonete* casi. Los tres son
de cifraclub. Es la misma deuda que bloquea `IDEA-11` y que `US-03` ya paga con sus 226
versos en borrador.


## Bloqueos abiertos

- **`ADR-01` espera evidencia, no trabajo.** Solo `E-04` y `E-07`; `E-02`, `E-03` y `E-08`
  quedaron **anuladas** (no pendientes) al descartarse la opción C. No frena construir: el
  fallback está cerrado y `US-02` criterio 3 queda cubierto igual.
  ~~**`E-07` es ahora la pregunta que más pesa:** con C y D descartadas, el deep link es el
  único camino que queda al tema completo, así que si un usuario free en Argentina no
  puede reproducir a demanda, **ninguna vía cumple la promesa del brief**.~~
  ✅ **LEVANTADO por `D-22` (2026-08-22): el sitio aloja los temas enteros en mp3.** El deep
  link dejó de ser el único camino al tema completo, así que `E-07` y `E-04` dejan de decidir
  si la promesa se cumple. **En su lugar quedan tres preguntas nuevas, y son de peso y de
  infraestructura, no de Spotify:** dónde viven ~7,2 horas de audio (entre 300 MB y 1 GB
  según bitrate), si van adentro del repo que Vercel construye, y cuáles son los límites de
  Vercel para ese volumen — lo último **sin ficha**, y es lo único que conviene chequear
  antes de subir el primer archivo. Detalle en `D-22` y en
  `Docs/SUGERENCIAS/HILO-para-arquitectura-audio-alojado.md`.
- **`CNT-01` no puede pasar de esbozo a cerrable** hasta que `investigador` responda las
  11 preguntas de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`. **Esto es lo que
  bloquea publicar** (`D-07`). No bloquea nada más.
- **`CTR-01.3` tiene un número abierto:** la duración máxima del fragmento, 15 s como
  valor de trabajo, la confirma la nota de derechos. Dato nuevo de `RES-03`: el techo del
  derecho de cita musical son 8 compases, que a 120 BPM en 4/4 son unos 16 s — el valor
  técnico y el límite legal quedaron cerca por caminos independientes.
- ~~**`UX-04` no tiene referencias reales de Rocambole fichadas.**~~ **LEVANTADO** por
  `RES-06`: técnica (rodillo, serigrafía, aerografía, grabado, collage), origen de cada
  tapa, y la frase que ordena el criterio — *"yo no ilustraba la poesía o la música, sino
  que era una parte integrante del mensaje"*. `experiencia` puede cerrar el brief de arte.
- ~~**No hay tracklists por disco.**~~ **LEVANTADO** por `RES-20`
  (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`): **los diez discos, 105 temas**, con
  duraciones y autoría por tema. `US-02` (piso 20) y `US-03` (piso 15) tienen de sobra.
- **Sigue abierto, y ahora con las dos vías fáciles descartadas: el texto de las letras
  para `US-03`.** El PDF del memoir no sirve (cita versos sueltos dentro de la
  conversación), y **`RES-23` descartó letras.com**: es de contribución abierta, sin
  licencia declarada — o sea, exactamente la "fuente de fans sin respaldo" que `contenido`
  pidió evitar en su pregunta 9. Además lista **149 temas contra los 105 reales**, mezclando
  material del Indio solista y de Skay. **La fuente correcta es el arte de los discos**, y
  el volumen es chico: `BR-03` muestra 2/1/0 versos, así que el piso de `US-03` necesita
  del orden de 30 versos, no 15 letras enteras. Techo legal sin cambios (`RES-03`).
- **Filtro obligatorio para `US-02` y `US-03`:** todo tema que entre tiene que estar en los
  **105 de `RES-20`**. Si no está, no es de Patricio Rey.

## Decisiones pendientes

- **La promesa del brief "escuchar el tema completo vía Spotify" probablemente no se
  cumpla** para un jugador sin Premium. Sale de `RES-01` y `ADR-01` la escaló. Es decisión
  de **`producto`**, no de `arquitectura`: o se reformula la promesa (por ejemplo "saltar
  al tema en Spotify"), o se acepta un preview dentro del sitio, o se declara que depende
  de la sesión del jugador. **Toca la definición de "Listo" de la v1.**
- Vía primaria de `ADR-01`: A (embed) contra B (deep link). Dueños: `investigador` trae
  `E-04` y `E-07`, `arquitectura` decide.
- **Cantidad de opciones por pregunta.** `CTR-02` usa 4 como valor de trabajo (2×2 apto
  para el pulgar). Dueño: `producto`, con una `BR-XX`. **Cerralo antes del primer lote**,
  o hay que rehacer preguntas.
- Cortes de puntaje de los tres tramos de resultado del quiz, que `UX-01` y `UX-02` usan
  para elegir el arte. Dueño: `producto`.
- ✅ **Resuelto por `RES-20`: el sello de *Luzbelito* es Del Cielito Records** — cuarta
  fuente coincidente, contra Wikipedia en inglés. `contenido` puede usarlo.
- ⚠ **Sigue abierto y ahora con más evidencia en contra: cómo contar *Lobo suelto, cordero
  atado*.** Wikipedia en español le da **un artículo a cada volumen** y a la vez los llama
  álbum doble. **Sigue siendo trampa.** Se suma una tercera: **la fecha de *Gulp!* tiene
  tres versiones** (22-abr / 20-jul / agosto de 1985). El año sí es firme.
- Redacción original de esta decisión (queda por trazabilidad):
  Cómo contar *Lobo suelto, cordero atado* (¿9 o 10 discos?) y qué sello lleva *Luzbelito*.
  Las dos discrepancias de `RES-02`. Dueño: `contenido`. **No usar ninguna de las dos como
  pregunta de quiz hasta resolverlas** — son trampas con dos respuestas defendibles.
- Cierre de la nota de derechos antes de publicar. Dueño: `contenido` + vos.
- **Límite editorial sobre las dos muertes.** Walter Bulacio (1991) y Olavarría (2017) son
  hitos centrales de la historia de la banda y a la vez muertes de personas con nombre
  (`RES-07`). La categoría "historia" del quiz va a chocar con esto. Dueño: `contenido`.
  **Decidilo antes del primer lote**, no después de tener cuarenta preguntas escritas.
- **Si el sitio menciona en algún lado que el Indio murió, y dónde.** Sale de `RES-04`.
  Dueño: `contenido`, con `producto` si toca la definición de "Listo" (probablemente no).
- **Bajo qué tipo entran las bandas ricoteras de después de la separación, y qué le hace
  eso al piso de 35.** `BR-07` tiene seis tipos y ninguno es `banda`: o se agrega el tipo,
  o van como un `concepto` de cultura, o van adentro de `la-separacion` / `indio-solari` /
  `skay-beilinson`. Dueño: **`producto`**. Que entren lo decidió el usuario; el cómo, no.
  **Y con una línea que hay que escribir igual: material de esas bandas puede ser artículo,
  pero no ítem de juego** mientras `US-01`..`US-04` sigan definidos sobre los 105 temas de
  `RES-20`. Propuesta en
  `Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md`.
- **Qué se hace con "Huracán en el 89".** `Docs/BRIEF.md` y `CLAUDE.md` lo usan como
  ejemplo del fan que sabe, pero en 1989 no hubo Huracán: fue 1993 y 1994 (`RES-05`). Como
  frase retórica no rompe nada; el riesgo es que alguien la convierta en pregunta. Dueño:
  vos, porque son archivos de raíz.

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 2026-08-19 | Proyecto instanciado. Roster de 7 roles, ampliación justificada en `Docs/EQUIPO.md`. |
| 2026-08-19 | `/kickoff`: entrevista de 16 preguntas. `Docs/BRIEF.md` reescrito entero, `D-05`..`D-10` registradas. Confirmados los 4 juegos y el tono; **corregidos** tres supuestos: el usuario no tiene material de audio propio (`D-06`), sí hay difusión por Twitter (`D-10`), y el gate de derechos se partió en construir contra publicar (`D-07`). |
| 2026-08-19 | `producto` fijó `US-01`..`US-04`, `BR-01`..`BR-03` y los pisos 40/20/15/10. |
| 2026-08-19 | `experiencia` entregó `UX-01`..`UX-04`. La tarjeta compartible pasó a pieza de primera clase por `D-10`. |
| 2026-08-19 | `contenido` entregó `CNT-01` (nota de derechos, esbozo) y `CNT-02` (guía de tono), y dejó 11 preguntas para `investigador`. |
| 2026-08-19 | `arquitectura` entregó `ADR-01` (propuesta, con el fallback ya cerrado), `CTR-01`, `CTR-02` y `ADR-02`. |
| 2026-08-19 | `investigador` entregó `RES-01`..`RES-03`. **Dos hallazgos pesados:** `preview_url` está restringido para apps nuevas desde el 27-nov-2024, y los términos de YouTube prohíben descargar, lo que **contradice la premisa con que se tomó `D-06`**. Registrado como actualización de `D-06`; la decisión sigue siendo del usuario y sigue en pie. |
| 2026-08-19 | `ADR-01` revisión 2: incorporó `RES-01` y **descartó las opciones C y D con evidencia**. Quedan embed contra deep link, faltando solo `E-04` y `E-07`. |
| 2026-08-19 | `CLAUDE.md` mandaba correr `scripts/validar_instancia.py`, que no existe en este repo. Corregido a la ruta real del instanciador y registrado como `D-11`. Validación: **APTA**, 0 errores, 1 aviso esperado (7 roles). |
| 2026-08-19 | Chequeo de coherencia de IDs: **sin referencias colgadas**. Los únicos IDs citados y no definidos son los ejemplos de `Docs/IDS.md` y `CTR-03`, que es referencia hacia adelante marcada pendiente. |
| 2026-08-19 | `/ciclo`: `orquestador` cortó el **ciclo 1** en 14 tareas (`Docs/ORQ/ORQ-plan-ciclo-1.md`), con la pasada de conflictos escrita y no mental. Meta del ciclo: 15 de las 40 preguntas del piso de `US-01`. Encontró de paso un hueco de propiedad: **`src/data/_schema/` no tiene dueño declarado**, y sin ese archivo la validación del banco no es corrible — resuelto como `T-04`. |
| 2026-08-19 | Arrancó una **segunda sesión en paralelo** sobre hechos de la banda. Se reservaron rangos de ID en `Docs/IDS.md` para que dos sesiones que no se ven no escriban el mismo número: `RES-04`..`RES-09` para la sesión paralela, `RES-10`+ para esta. Cierra `T-14` antes de que el ciclo arranque. |
| 2026-08-19 | **`T-01` cerrada.** `BR-04`: 4 opciones por pregunta, igual para `US-01` y `US-04`. Era el gate interno del ciclo: destrabó `T-04`, `T-06`, `T-07`, `T-08` y `T-12`. `CTR-02.5` queda confirmado sin tocar `Docs/ARQ/`. |
| 2026-08-19 | **Sesión paralela de investigación cerrada.** Barrido amplio sobre la banda pedido por el usuario: `RES-04`..`RES-09` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. Consumió su rango entero sin excederlo. **El hallazgo grande: el Indio Solari murió el 5-jun-2026** y ningún documento del repo lo registraba — alerta y decisiones en `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`. De paso: **levantó el bloqueo de `UX-04`** (`RES-06`), respondió 4 de las 11 preguntas de derechos de `contenido`, y encontró que **el catálogo está en Spotify oficialmente desde el 28-jul-2017**, lo que refuerza el deep link en `ADR-01`. Corrigió además el ejemplo "Huracán en el 89" del BRIEF: fue 1993 y 1994. |
| 2026-08-19 | **Segunda tanda de la sesión de investigación: fuentes primarias.** El usuario consiguió los libros y puso *Recuerdos que mienten un poco* en PDF dentro de `Docs/INVESTIGACION/`. Salieron `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`. **`RES-20` levanta el bloqueo más grande: los tracklists de los diez discos, 105 temas con duración y autoría** — `US-02` y `US-03` ya tienen de dónde sacar ítems, y de paso queda respondida la pregunta 8 de `contenido` (la autoría es Solari–Beilinson salvo dos temas que suman a Bucciarelli). **`RES-22` corrige `RES-05`:** yo había escrito que Patricio Rey nunca existió como persona; el memoir muestra que Rocambole declaró lo contrario y que el Indio no lo desmiente. Se resolvió además el sello de *Luzbelito* (Del Cielito, cuarta fuente). |
| 2026-08-19 | **Ciclo 1 cerrado: las 14 tareas.** `BR-04`/`BR-05`/`BR-06` de `producto`; `CTR-01` con la duración cerrada en 10 s y la escalera recalculada, `CTR-02`, `ADR-02` y el schema corrible de `arquitectura`; `CNT-01` sección A, `CNT-03` y **las primeras 15 preguntas** de `contenido`; `RES-10` de `investigador`; y las dos primeras revisiones del proyecto. Banco validado: `OK 15 items, sin fuente: 0`. |
| 2026-08-19 | **Las dos revisiones encontraron cosas reales, que es el punto.** `REV-01`: la nota de derechos no miente, pero está desactualizada respecto de fichas que ya llegaron (`FIND-01`..`FIND-04`), y afirmaba con casilla marcada que Rocambole tiene "obra registrada" sin ninguna ficha que lo respalde (`FIND-05`) — corregido también en su origen, `D-04`. `REV-02`: `QZ-005` era bloqueante porque su respuesta no era única con la evidencia de entonces (`FIND-10`); **`RES-20` llegó durante la revisión y la resolvió**, así que se arregló agregando la cita, no borrando la pregunta. |
| 2026-08-19 | **`D-12`, la lección estructural del ciclo.** Cuatro de los siete roles no tienen herramienta de ejecución, así que no pueden correr las verificaciones que sus propias tareas exigen. Se decidió **no darles `Bash`** —el que fabrica no se autocertifica— sino **rutear** la verificación al hilo principal o a `revisor`. La evidencia que cerró la discusión llegó el mismo día: `contenido` reforzó dos enunciados, los validó a mano, reportó que estaban bien, y **habían quedado en 242 y 277 caracteres contra un tope de 180**, rompiendo el schema. Corregidos a 155 y 163. |
| 2026-08-19 | Tercera confirmación de que la reserva de rangos funciona: las dos revisiones respetaron `FIND-01`..`FIND-09` y `FIND-10`+ sin colisionar, igual que las fichas `RES-` entre las tres sesiones. |
| 2026-08-19 | **Tercera tanda de investigación: `RES-23` y `RES-24`** en `INV-21-letras-y-fuimos-reyes.md`. Las dos dan resultado negativo o parcial, y el motivo es de la fuente. **`RES-23` descarta letras.com** como fuente de letras: es de contribución abierta y sin licencia declarada —la "fuente de fans sin respaldo" que `contenido` pidió evitar— y además lista **149 temas contra los 105 reales**, mezclando material del Indio solista y de Skay. La pregunta 9 queda **respondida en negativo** y la casilla de letras de `CNT-01` sigue abierta. **`RES-24`**: el lector web de *Fuimos reyes* está topeado en **1%** y la sección "Discografía" figura en el índice pero no carga; no se buscó otra vía porque el libro está a la venta. Sí quedó el **mapa de los 20 capítulos**, que dice dónde mirar cuando el libro esté: el cap. 8 puede cerrar la fecha de *Gulp!*, el 4 lo de Patricio Rey, y la sección "Discografía" del final las tres discrepancias vivas de una sola vez. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 2** en `Docs/ORQ/ORQ-plan-ciclo-2.md`, 13 tareas `T-15`..`T-27`. Dos gates en vez de uno: el limite editorial sobre muertes reales (`T-15`) y la categoria **testimonio** en el schema (`T-16`), que corren en paralelo. Meta: llegar a **30 preguntas**, no a 40. |
| 2026-08-19 | **Hallazgo de alcance: el piso de `US-01` ya no se puede cerrar.** Sin fuente de letras (`RES-23`), y con un piso definido como 10 por categoria sobre 40, el techo real es **30/40** por aritmetica. Decision para `producto`: sostener la cuota, bajar el piso, o esperar la fuente. Toca la definicion de "Listo" de la v1, y bloquea `US-03` entero. |
| 2026-08-19 | Segunda leccion de concurrencia, ahora entre **sesiones** y no entre roles: el encabezado de este archivo quedo diciendo "ciclo 1 en curso" cuando su propia bitacora ya registraba el cierre. Se fijo en `Docs/EQUIPO.md` el orden de autoridad — **disco > bitacora > tablero** — y la regla de agregar a la bitacora y reconciliar el tablero, nunca borrar una fila ajena. |
| 2026-08-19 | **El usuario revirtió la conclusión práctica de `RES-23`, y eso desarmó un bloqueo de alcance.** Con la objeción sobre la mesa decidió usar letras.com y **bestiarioredondo** igual, porque *la banda tiene una mística de pocas cosas oficiales* — fundamento que la investigación respalda: no hay sitio oficial de letras, nunca lo hubo, el memoir no las trae (`RES-21`), y la banda se construyó sin multinacional, sin TV y sin publicitar recitales (`RES-07`). **Consecuencia: el aviso de "el piso de `US-01` no se alcanza por aritmética, techo 30/40" quedó sin premisa y se retiró.** No hay que tocar el piso ni la definición de "Listo". El riesgo de verso mal transcripto se acepta acotado con 5 mitigaciones; las dos que importan son cruzar todo contra los 105 temas de `RES-20` (obligatorio, gratis, mata las 149 entradas contaminadas) y confirmar de oído los ~30 versos que `BR-03` realmente necesita. **Falta el `D-XX`**: no lo numeré desde la sesión paralela porque no hay reserva del prefijo `D-`; propuesta en `Docs/SUGERENCIAS/INV-para-hilo-principal-decision-fuentes-letras.md`. |
| 2026-08-19 | **Ciclo 2, doce de trece tareas cerradas.** Los dos gates primero, como pedia el plan: `CNT-04` (`T-15`) fijo el limite editorial sobre muertes reales antes de escribir una sola pregunta de historia, y la categoria **`testimonio`** (`T-16`..`T-18`) entro al schema de forma **aditiva y verificada**: los 25 items previos validan sin tocarlos, y el schema rechaza las ocho formas de llenarla mal que probe. Banco: **30 preguntas**, `discos` 10/10, `mitologia` 10/10, `historia` 10/10, **10 faciles** que cumplen `BR-01`. |
| 2026-08-19 | **Cuatro fichas legales nuevas, `RES-11` a `RES-14`** (`INV-04`, `INV-05`), y dos corrigen cosas que el proyecto daba por buenas. **`RES-11`: el derecho de cita del Art. 10 cubre la obra, no el fonograma** — el Art. 5 bis le da al fonograma derecho aparte, con otro titular y 70 anios, y el proyecto recorta el master. Los "8 compases" regulan otra cosa. **`RES-13`: la baja resolucion no tiene efecto juridico verificado** (la ley dice "en cualquier forma", sin excepcion por calidad), y la declaracion publica de Rocambole no es licencia: el Art. 53 exige formalidad registral. **`FIND-05` tenia razon.** |
| 2026-08-19 | **Dos defectos encontrados por el equipo, no por el hilo principal.** `arquitectura` calculo que `BR-02` x `BR-04` le daba **70 puntos esperados a quien no reconoce nada**, con piso 40, y volvia inalcanzables el paso 5 y la rama de 0 — lo escalo en vez de decidirlo. `producto` lo arreglo con **intento unico por item**: baja a 25 esperados, piso 0, y las dos ramas vuelven a ocurrir. Y `arquitectura` senialo que **`sensibleA` no tiene valor para texto de libro**, asi que una cita del memoir es invisible para el gate de `D-07`: pedido abierto a `contenido`. |
| 2026-08-19 | **Corrida de investigación sobre imágenes de tapas: `RES-25` y `RES-26`** en `INV-22-imagenes-tapas-y-spotify.md`. Seis vías en paralelo con refutación adversarial; 10 agentes, 0 errores. **`RES-25`: ocho vías descartadas.** Solo Cover Art Archive sobrevive como conducto técnico, y **no mejora la posición legal, solo no la empeora** (*"use the images at your own risk"*). La distinción que ordena todo: **contenedor ≠ contenido** — ninguna base de datos puede licenciar arte que no le pertenece, así que sacar la tapa de Discogs o de Spotify **no lava nada**. **bestiarioredondo no aporta tapas**: su unidad es la canción, no el disco, no declara licencia, el propietario del Drive está oculto y **no se pudo descartar generación por IA**. Dos refutaciones útiles: el `life-span` de MusicBrainz contradice `RES-05`, y **la tapa de *Oktubre* del CAA sale de un CD de 1993 en EE.UU., no del LP argentino de 1986**. **`RES-26` es el hallazgo grande y no es sobre imágenes:** la Spotify Developer Policy III.2 dice textualmente *"Do not create a game, including trivia quizzes."* **Compromete la opción A (embed) de `ADR-01` y vuelve irrelevante `E-04`** —aunque la prueba diera bien, seguiría prohibido—; la opción B (deep link) probablemente sobrevive pero no está verificado. Propuesta para `arquitectura` y `producto` en `Docs/SUGERENCIAS/`. |
| 2026-08-19 | **Ciclo 2 cerrado: las 13 tareas, mas los tres hallazgos de `REV-03`.** El bloqueante (`FIND-12`) era transcripcion textual del memoir con etiqueta de parafrasis encima, en `QZ-027` y `QZ-028` — `revisor` lo cazo comparando contra el PDF. Corregido y **reverificado por el hilo principal contra las 194.131 palabras del libro**: el tramo calcado mas largo bajo de **62 a 41 caracteres**, ninguno llega a 9 palabras, y los que quedan son el titulo de una cancion, una marca y una frase generica. Banco final: **30 preguntas**, tres categorias en 10/10, 10 faciles. |
| 2026-08-19 | **`ADR-01` revision 3 — el eje de la decision cambio y no era tecnico.** `RES-26` (sesion paralela, encontrado **de casualidad** buscando imagenes de tapas) trajo la Spotify Developer Policy III.2: *"Do not create a game, including trivia quizzes."* `arquitectura` **descarto la opcion A (embed) por contrato**, anulo `E-04`, `E-05`, `E-06` y `E-10` — el usuario puede tachar la prueba de incognito de su lista — y degrado `E-07` a no bloqueante corrigiendo su propia frase de la revision 2. Queda `E-13`: si un deep link simple cuenta como acceder a la Spotify Platform. **Las Design Guidelines NO aplican a `US-04`**: rigen arte que venga de Spotify, y `D-04` fija otro origen. |
| 2026-08-19 | Autocritica que vale guardar, de `arquitectura`: su tabla de criterio de cierre —escrita **antes** de la evidencia, y que funciono dos veces— no fallo en ninguna fila. Fallo en algo que una tabla no puede cubrir: **solo elige entre las opciones enumeradas, y no protege de que una opcion sea retirada por un eje que nadie habia considerado.** |
| 2026-08-19 | **`D-14` reencuadra el proyecto entero, por decision del usuario y con toda la evidencia legal sobre la mesa.** Tres cosas: **(1)** el riesgo se asume — fan site sin fines de lucro, poco publico, **si llega un reclamo se da de baja y listo**; el gate de publicacion de `D-07` deja de existir y `CNT-01` pasa de cerrojo a **mapa**. **(2)** el conocimiento popular es contenido legitimo: **no hay mucho oficial y no deberia importarnos**, y eso no es una excusa sino un hallazgo (`RES-23`, `RES-21`). **(3)** **abrir los molinetes** — nada se le niega a nadie por no tener con que entrar: ni cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas" del alcance resultaron ser la misma decision y ahora tienen nombre. |
| 2026-08-19 | Lo unico que `D-14` **no** relaja: que la respuesta correcta de una pregunta sea correcta — no por lo legal, sino porque si el dato esta mal **el juego le marca error al que se sabe el tema**. La defensa deja de ser "verificar todo" y pasa a ser **rotular bien**: hecho, leyenda o testimonio. El sistema de tres casillas que el schema ya hace cumplir resulto ser exactamente el mecanismo que esta postura necesitaba — **se construyo para dejar entrar el relato, no para filtrarlo.** Actualizados `CLAUDE.md`, `Docs/BRIEF.md` y `.claude/rules/contenido-json.md`. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 3** en `Docs/ORQ/ORQ-plan-ciclo-3.md`, 16 tareas `T-28`..`T-43`. **El ciclo es construir el quiz.** Despues de dos ciclos estaba todo especificado —30 preguntas validadas, `CTR-02`, `CTR-03`, `UX-01`, `UX-02`, `UX-04`, seis reglas `BR-`— y **no habia una sola linea de codigo**. `D-14` saco el ultimo motivo para esperar. Se formalizo ademas en `Docs/EQUIPO.md` quien escribe el codigo: **el hilo principal**, por la misma razon de `D-12` — los cuatro roles que escriben no pueden ejecutar nada, y no se construye software sin correrlo. |
| 2026-08-19 | **Hallazgo al planificar: el repo no estaba bajo git.** 55 archivos de dos ciclos completos, sin un solo commit ni respaldo. Es `T-28` y va antes que todo. |
| 2026-08-19 | Tres huecos mas que encontro `orquestador` leyendo contra el encuadre nuevo: **`CNT-01` sigue redactada como cerrojo** y contradice al BRIEF (`T-32`); **`UX-01` no dice donde se ve el rotulo** de leyenda o testimonio, asi que 15 de los 30 items llegarian a pantalla con cara de hecho verificado — la ultima milla de todo el sistema de rotulado (`T-30`); y **ocho cadenas de copy** que `UX-01` y `UX-02` delegaron a `contenido` y nadie escribio (`T-29`). |
| 2026-08-19 | **Ciclo 3 cerrado: las 16 tareas `T-28`..`T-43`, mas los siete hallazgos de `REV-04`.** El proyecto paso de cero lineas de codigo a **un quiz jugable**: Astro con salida estatica, cinco reglas de negocio como funciones puras con test, cuatro pantallas, y el repo en **github.com/knesantos/ArcadeRicotero**. 47 tests, `tsc` limpio, build OK. |
| 2026-08-19 | **El defecto que solo aparecio jugando: en 25 de los 30 items la respuesta correcta era la primera opcion.** Tocando siempre arriba se sacaba **83%** sin saber nada — mucho peor que lo que discutio `BR-04`, que eligio 4 opciones en vez de 3 para bajar el azar de 33% a 25%. No lo agarro nadie porque en el JSON cada item se lee bien por separado: el patron solo existe en el conjunto. Arreglado barajando al servir; medido en el navegador, ahora rinde 28%. Y `revisor` encontro despues que **`CTR-02.3` ya lo exigia por escrito** desde el ciclo 1: no fue un parche, fue implementar un requisito que nadie habia ejecutado. |
| 2026-08-19 | **`REV-04`, primera revision de codigo. El riesgo del ciclo no se materializo donde se temia.** `BR-01`, `BR-04`, `BR-05`, `ADR-01` y `ADR-02` coinciden con los documentos numero por numero. Se materializo en tres puntos que **pasaban en apariencia**: el test de contraste medía tokens que la pantalla nunca usaba (`FIND-15`, bloqueante — el juego corria sin senal de acierto, error ni rotulo), el payload mandaba mas de `testimonio` de lo aprobado (`FIND-16`), y una cadena de `CNT-05` se reemplazo por texto inventado (`FIND-17`). Los siete cerrados y verificados. |
| 2026-08-19 | Nota de proceso: **`tsc --noEmit` no se estaba corriendo.** El hilo principal reporto `T-34` como verificada habiendo corrido solo `node --test`. Cuando se corrio (`FIND-19`), encontro que el arreglo de `FIND-16` estaba incompleto — el tipo seguia prometiendo campos que ya no se mandaban. **El comando que no se corria era el que iba a atrapar el arreglo a medias del otro hallazgo.** |
| 2026-08-19 | `D-15`: hosting en **Vercel con salida estatica pura**. El usuario tiene Vercel Pro y Supabase Pro pagas, y aun asi el sitio se disena para el tier gratuito — si la suscripcion desaparece, sigue en linea sin cambiar una linea. **Supabase queda disponible y sin usar**: contradice "sin backend" (`D-02`), su tier gratuito pausa proyectos por inactividad, y sobre todo **una cuenta de usuario es literalmente un molinete**, que es lo unico que `D-14` prohibe por nombre. |
| 2026-08-19 | **`RES-15` (`INV-06`): como asegurar costo cero en Vercel, verificado contra la documentacion oficial.** Corrige una intuicion razonable del usuario: **no alcanza con no activar Speed Insights ni Analytics**, porque lo que decide es **el scope**. En Hobby no hay cargo posible —al agotar un cupo el recurso se frena, no se factura—; en un equipo Pro se cobra el excedente de transferencia y edge requests aunque no se toque ningun add-on. Contraintuitivo: **el tope de gasto (Spend Management) solo existe en Pro**, en Hobby no existe porque no hace falta. **Accion pendiente del usuario:** verificar en Settings -> General a que scope pertenece el proyecto. |
| 2026-08-20 | **Sistema de marca, como lienzo de diez hojas** ("Sistema de marca Arcade Ricotero", https://claude.ai/code/artifact/59acd1de-80ab-4074-b1ba-b75da05cb134). Fija lo que `UX-04` dejó abierto a propósito: paleta con doce pares de contraste calculados (peor: 5,58:1, pasa AA), dos familias tipográficas, diez estenciles originales con textura de serigrafía, y componentes con las clases que `partida.ts` ya escribe. La simbología con respaldo: perro (`RES-06`/`RES-22`), bandera y estrella (`RES-06`, capa simbólica), molinete (`D-14`), la misa (`RES-04`). `Docs/UX/` no se tocó: propuesta en `Docs/SUGERENCIAS/HILO-para-experiencia-sistema-de-marca.md` con las tres diferencias contra `UX-04` (error a rojo, aparece un oro, azul reservado a testimonio). |
| 2026-08-20 | **`D-16`: el producto se llama Arcade Ricotero.** Decisión directa del usuario. Lo visible ya cambió: `<title>` de `index.astro` (verificado en `dist/`, build OK, `tsc` limpio, 47/47 tests). Las ~50 menciones en prosa interna migran sin apuro; el `$id` de los schemas es contrato de `arquitectura` y espera a ese rol. |
| 2026-08-20 | **`D-17`: regla de voz — sin anglicismos, en español, argentino y ricotero.** Decisión directa del usuario, convertida en hoja 02 del sistema de marca: tres obligaciones y glosario (feedback→devolución, reveal→revelado, display→rotulada, quiz→preguntas/trivia). Barrido hecho: el copy visible ya estaba limpio; lo inglés vive en identificadores de código, que se renombran solo si el costo lo justifica. |
| 2026-08-20 | **Pedido del usuario en curso: tipografías reales de los discos y más simbología real.** `investigador` está buscando fuentes hechas por fans sobre el lettering de las tapas (descarga, licencia, qué tapa imitan). Si aparece alguna usable, cambia la hoja 04 del sistema de marca y la decisión estética vuelve a `experiencia` (`D-04`). El rediseño "más oscuro, más rocambolesco" ya entró al lienzo: base `#0D0A07`, viñeta, desregistro de tinta. |
| 2026-08-20 | **`RES-30`..`RES-32` (`INV-07`): la tipografía de las tapas, investigada — y el hallazgo es un "no hay" que vale más que un "sí".** El usuario pidió usar "las fuentes de los Redondos"; `investigador` verificó que **no existe ninguna fuente descargable derivada del lettering real** — lo que circula es un "se parece a" comercial (Big George NF) sugerido por un fan y dos falsos positivos por nombre. Lo verificado de verdad (`RES-31`): Rocambole **dibujó a mano** la letra de *Oktubre*, "sovieticoide" con una B invertida, con oficio de cartelista y sin archivo digital. Consecuencia en el sistema de marca (hoja 04): se imita el **método** (letra de cartelista con borde comido), no la letra; la vía auténtica futura es lettering original encargado. De paso, `RES-31` es pregunta de trivia lista para el juego de tapas (nota para `contenido`). Pendiente manual: los listados de MercadoLibre y el tipoblog de Cátedra Cosgaya bloquearon el acceso automatizado. La hoja 01 sumó además el **detalle real fichado**: los diez discos con año (`RES-02`/`RES-20`) y los hitos Obras 89 / Huracán 93-94 (`RES-05`). |
| 2026-08-20 | **`RES-33`..`RES-35` (`INV-07`, segunda tanda): la letra de cada tapa, nueve corridas en paralelo.** El usuario precisó el pedido: conseguir la tipografía de cada disco. Resultado: **ninguna tapa usa una tipografía comercial confirmada.** Dos verificadas con el método real — *Gulp!* es manuscrito de Rocambole **con un tubito de plasticola relleno de esmalte sintético**, serigrafiado en tres pasadas (`RES-33`, tres fuentes); *Oktubre* confirma `RES-31` con fuentes nuevas. Seis tapas **sin datos** (las fuentes describen el concepto, nunca la letra) y *Lobo suelto* en conflicto (`RES-35`: "alfabeto de Semilla Bucciarelli" vía Cosgaya sin acceso directo, contra un "Rey Garufa" de foro sin fundamento). El lienzo sumó la **hoja 05 — Tapas, letra por letra**: cada disco con su estado y, donde hay evidencia, una equivalente de trabajo de Google Fonts (Pacifico para el manuscrito de *Gulp!*, Stalinist One para el constructivismo de *Oktubre* — criterio propio, marcado). Pendiente: el tipoblog de Cátedra Cosgaya bloquea intermitente (7 de 9 corridas) — reintento dedicado en curso. |
| 2026-08-20 | **`RES-36` (`INV-07`, tercera tanda): la entrevista de Clarín del 18-jun-1999, leída entera en el navegador de la sesión** — el fetch automatizado daba 403, el navegador real entró. Rocambole recorre las nueve tapas: **resuelve *Lobo suelto*** (*"las tipografías corresponden a un alfabeto creado por el bajista Semilla Bucciarelli"* — el único disco con letra de otro redondo; "Rey Garufa" descartado como ruido de foro), confirma *Gulp!* con la voz del autor ("serigrafía con las letras en plasticola de color") y *Oktubre* ("parece soviética al estar invertida una letra"). Las otras seis tapas: la fuente más completa que existe **no aborda la letra** — el sin-datos queda firme. La Cátedra Cosgaya está caída a nivel servidor (rechaza incluso navegador real); ya no se espera. Hoja 05 del lienzo actualizada: tres verificadas, seis sin datos firmes, cero tipografías comerciales. |
| 2026-08-20 | **`D-18`: tipografía fiel y estética real por disco — nada de símiles.** El usuario rechazó los equivalentes de Google Fonts ("parecen parodias") y fijó el rumbo: reconstruir la letra real de cada tapa (fiel, desde fotos si no existe ya digitalizada) y aplicar la estética real de cada disco al lienzo. **`RES-37`: las paletas de las nueve tapas, muestreadas por conteo de píxeles** sobre las imágenes del Cover Art Archive (el conducto de `RES-25`), verificadas a ojo contra grilla de contacto — *Lobo suelto* naranja/petróleo/negro, *Gulp!* negro/rojo/crema, *La mosca* naranja quemado/rojo ladrillo/petróleo (discrepancia con el recuerdo del usuario anotada: puede ser de edición o de contratapa). Hoja 05 del lienzo rehecha con las paletas medidas. **En curso:** barrido en tres frentes — fuentes ya digitalizadas, herramientas foto-a-fuente con su método, y mapa de contratapas/sobres/afiches/folletos por disco. |
| 2026-08-20 | **`RES-38`..`RES-41` (`INV-07`, cuarta tanda): el camino a la letra real, cerrado como plan.** Segunda caza más profunda: **sigue sin existir digitalización fiel** (siete lugares verificados) y los tres señuelos quedaron fichados con nombre para que nadie los use de base (Big George NF, un STL de Cults3D, un CDR anónimo). **Flujo foto→fuente a costo cero** documentado: Inkscape + FontForge en 7 pasos, con el método de glifos faltantes de los revivals serios; lo caro es tiempo de diseño, no plata. **Plan por disco:** Oktubre ALTA, Lobo suelto ALTA (alfabeto-sistema de Semilla; crédito "Visiones: Rocambole, Semilla y Meroyuela"), Gulp! MEDIA (falta el insert que nadie describió). **El hallazgo de campo:** el hilo principal abrió Discogs en el navegador y vio la contratapa argentina de *Oktubre* de primera mano — tracklist y créditos completos en el mismo lettering a mano, casi el abecedario en minúscula (`RES-41`). Hoja 05 del lienzo ampliada con el plan. **Dos llaves quedan en manos del usuario:** el álbum de Facebook de Rocambole "Tipografías originales para afiche" (pide login) y sus discos físicos escaneados a 300–600 dpi, que son el paso 1 del flujo. |
| 2026-08-20 | **`RES-42` y `RES-43` (`INV-07`, quinta tanda): las fuentes aparecieron, y la primera calcada es nuestra.** El usuario trajo cinco fuentes a `Docs/INVESTIGACION/Tipografia/`: tres son **digitalizaciones fan del lettering real** de Benjamín Zavala (ffonts.net, sin licencia declarada) — el logo del PR coronado, el lettering "Redonditos" y **el alfabeto de Semilla** de *Lobo suelto* — y dos se descartaron (dingbats de logos; una grunge genérica renombrada). Corrige el negativo de `RES-38`: la caza pasó por ffonts.net y no las vio; el usuario a mano sí. **Y la titular de *Oktubre* se calcó hoy de la tapa misma** (`RES-43`): siete letras con la B espejada, trazadas de la imagen real con potrace + fontTools hasta un OTF de verdad (`Tipografia/OktubreCalco-v0.2.otf`), verificado lado a lado contra el original y renderizando en Chrome. Las cuatro están **incrustadas en la hoja 05 del lienzo** con espécimen y crédito. Siguiente en el tablero: la minúscula de la contratapa de *Oktubre* (corpus ya ubicado) y auditar la fidelidad de las tres fan contra las tapas. |
| 2026-08-21 | **`D-19`: la mezcla ricotera — cada pantalla viste un disco, la base no rota.** Pedido textual del usuario: mezcla de toda la cultura y los discos, manteniendo el caos de la banda. Para hacerlo sin inventar ya estaba todo: paletas medidas (`RES-37`), fuentes fan (`RES-42`), calco propio (`RES-43`). **La titular ganó cuatro letras derivadas** (A C D I, compuestas de las reales con el mismo gesto constructivista de la B espejada — `OktubreCalco-v0.3.otf`) y ahora escribe **ARCADE RICOTERO** completo: es el título del sitio en el lienzo. Mapa inicial en la hoja 05: portada=Oktubre, historia=Gulp!, mitología=Lobo suelto, letras=La mosca, discos=Último bondi, resultado=Gulp!+logo. Las tres pantallas de la hoja 09 quedaron vestidas cada una de su disco. Tres reglas ordenan el caos (base fija, texto largo siempre legible, acierto/error/rótulos no se disfrazan) y una deuda declarada: las fuentes no traen acentos todavía. |
| 2026-08-21 | **`D-20`: la Redondopedia — enciclopedia ricotera navegable, quinto frente del producto.** Decisión directa del usuario: sumar al sitio una sección estilo Wikipedia — historia completa, biografías, letras, los casos reales (Bulacio, Olavarría), cultura — navegable por enlaces entre artículos. Cinco cláusulas: no toca el "Listo" de la v1 (los cuatro juegos de `D-05` siguen intactos); estática sin backend (`D-02`); el rotulado hecho/leyenda/testimonio se extiende a la prosa — **la ventaja sobre Wikipedia es justamente poder contar la leyenda como leyenda**; el insumo inicial son las fichas `RES-` ya escritas; y "que la gente sume data" queda para el futuro (la vía arranca en la propia D-20: GitHub o buzón, nunca un login). Fuerza dos pendientes que venían pateándose: cómo cuenta el sitio la muerte del Indio (`RES-04`) y `CNT-04` releído para artículos enteros. |
| 2026-08-21 | **`producto` entregó la Redondopedia como historia trazable: `US-05` y `BR-07`..`BR-11`** en `Docs/PRODUCTO/PRD-redondopedia.md`. Seis tipos de artículo (disco, tema, persona, hito, concepto, leyenda — el séptimo "tapa/arte" descartado: vive dentro de `disco` y de Rocambole como `persona`) con campos mínimos por tipo. **Piso: 35 artículos** (10/5/7/4/3/6), alcanzable sin investigación nueva porque el insumo ya está en más de cuarenta fichas `RES-`. "Navegar como en Wikipedia" convertido en criterio corrible (`BR-09`: cero huérfanos, cero callejones, todo alcanzable desde la portada por BFS — el script lo debe `arquitectura`, lo corre quien tenga `Bash`, `D-12`). El rotulado de `D-14` se vuelve **granular**: por afirmación dentro del párrafo, no un campo único por ítem (`BR-08`). **`BR-10` da vuelta el techo de `CNT-04` para este formato:** Bulacio y Olavarría entran como artículos propios — la restricción nació de un problema del multiple choice que la prosa no tiene — con contingencia declarada (si `contenido` al releer concluye lo contrario, el piso de `hito` baja de 7 a 6). La muerte del Indio (`RES-04`) entra como `hito` propio. Orden de recorte interno: cae primero `tema` (letras completas, lo más caro y expuesto), `disco` y `persona` no caen nunca — son el esqueleto. Verificado por el hilo principal: IDs sin colisión, trazabilidad a `D-20` completa, propiedad de carpetas respetada (la petición a `arquitectura` fue por `Docs/SUGERENCIAS/`, sin número, como manda `Docs/IDS.md`). |
| 2026-08-21 | **El usuario aportó una fuente nueva, sin evaluar: https://redondossubtitulados.com/** — pidió registrarla y nada más, para que una futura sesión de investigación la trabaje. Puntero en `Docs/SUGERENCIAS/HILO-para-investigador-fuente-redondossubtitulados.md` con el checklist de evaluación (qué contiene, licencia, cruce contra los 105 de `RES-20`, para qué frente rinde — candidatas obvias: letras de `US-03` y el tipo `tema` de la Redondopedia). **Nadie entró al sitio todavía; no es citable hasta que exista su ficha `RES-XX`.** |
| 2026-08-21 | **Segunda fuente aportada por el usuario, sin evaluar: Coveralia** (https://www.coveralia.com/caratulas-de/patricio-rey-y-sus-redonditos-de-ricota.php) — "todas las tapas y discos y contratapas". Verificado: **no está entre las ocho vías que `RES-25` descartó**, es evaluación nueva. Puntero en `Docs/SUGERENCIAS/HILO-para-investigador-fuente-coveralia.md` con el contexto que importa: la doctrina contenedor≠contenido ya está cerrada (la evaluación útil es de corpus, no legal), **lo que podría valer oro son las contratapas** para el plan de letra fiel de `D-18` (`RES-41`: el insert de *Gulp!* y la minúscula de *Oktubre* son los faltantes), y la trampa de ediciones que `RES-25` ya cazó (el *Oktubre* del CAA es un CD yanqui del 93, no el LP argentino del 86 — anotar edición por imagen). Podría destrabar también la discrepancia de paleta de *La mosca* (`RES-37`) y las imágenes de `US-04`. **Sin ficha `RES-XX`, no citable.** |
| 2026-08-21 | **El sistema de marca aterrizó en el código, y el diseño quedó como fuente de verdad.** Rama `diseno/mezcla-ricotera` → PR → main. Lo que cambió: `tokens.css` reescrito con los valores del lienzo (base de tinta, estados, los `--cat-*` de la mezcla `D-19` con las paletas reales de `RES-37`, `--marca-rojo` de Oktubre) + las **cinco fuentes autoalojadas** en `public/fuentes/` (el calco de Oktubre, dos fan de Zavala, Archivo Black — 39 KB total, cero CDN); la portada viste Oktubre (`index.astro`: la marca en la titular calcada, JUGÁ en el rojo de la tapa); `partida.ts` ganó las dos palabras que faltaban (`categoria--X` para que las cuatro tintas pinten, y `firma` para que COMPARTIR lleve el lettering del logo); `juego.css` sumó la mezcla sin un solo hex. **El test de contraste subió de 12 a 17 pares** y pasa todo: build OK, `tsc` limpio, 47/47. Y la regla nueva `.claude/rules/diseno-marca.md` fija el circuito para todos los roles: **se cambia en el diseño, se refleja en `tokens.css`, se corre el test — nunca al revés.** Deuda declarada ahí mismo: las fuentes de disco no traen acentos todavía. |
| 2026-08-21 | **El sitio ganó esqueleto: portal collage-cassette, rutas navegables y las pantallas de lo que viene.** Pedido directo del usuario: índice lindo, link a cada juego, estética de cassette vintage con recortes de discos pegados en collage — siempre sobre Rocambole. Lo construido: portal en `/` como cassette grabado en casa (lado A los cuatro juegos, lado B la Redondopedia; cada casete viste su disco por `D-19` y las etiquetas son papel con renglones — par `tinta sobre papel` sumado al test AA, ahora 18 pares); el quiz **mudado a `/quiz/`** sin romper `ADR-02` (los links de desafío viejos a `/?g=...` redirigen conservando la query — verificado en el navegador con `n=Che`); tres pantallas "en la cocina" honestas (la de adivinar el tema promete acceso al tema, no reproducción completa — `BR-06`); `Base.astro` + `sitio.css` (cero hex, todo `var()`, grano de serigrafía como token). **Sistema de recortes reemplazables:** `public/arte/` trae 5 dibujos de reemplazo originales (mosca, multitud con banderas, perro, lobo, cassette) y un README con el **despiece de 15 piezas fundado en `RES-06`/`RES-22`** — qué recortar de cada tapa, cómo y dónde se pega; cuando el usuario deje el PNG real con el nombre acordado, el build lo levanta solo (`src/lib/sitio/arte.ts`). Deuda de circuito declarada: `--papel` y `--textura-grano` entraron a `tokens.css` sin pasar antes por el lienzo — propuesta a `experiencia` para saldarla. |
| 2026-08-21 | **La Redondopedia salió del papel: 26 de los 35 artículos del piso, escritos desde las fichas y verificados contra ellas.** Corrida de 14 agentes en tres fases: inventario de las fichas (`INV-01`, `INV-02`, `INV-20` + guías `CNT-02`/`CNT-04`), redacción por tipo (10 `disco` — En directo excluido por ser vivo —, 5 `persona`, 5 `hito`, 4 `concepto`, 2 `leyenda`), y **verificación adversarial que encontró 21 problemas, 5 bloqueantes, todos corregidos antes de integrar**. El patrón de los bloqueantes vale como lección: tres artículos inflaban "Patricio Rey Discos" a "el sello propio de la banda" (ninguna ficha lo dice — suposición inferida del nombre, disfrazada de hecho), y dos resúmenes presentaban el testimonio de Rocambole sobre la prensa como hecho pelado. `BR-08` quedó implementado en la forma de los datos: el cuerpo es una lista de segmentos y cada uno lleva rótulo y fuente en el punto exacto (leyenda con tiza y rombo, testimonio con celeste y comillas — los códigos del quiz, que no se disfrazan de disco). `BR-09` es test corrible: cero huérfanos, cero callejones (la única excepción usada es la declarada para `leyenda`), enlaces `[[slug\|texto]]` todos resueltos. Discrepancias en paralelo como pide `US-05` criterio 5 (la fecha de *Gulp!* con sus tres versiones, cada una con fuente). Faltantes para el piso: los 6 `tema` (esperan letras con filtro `D-13`) y Bulacio/Olavarría (`CNT-04`, `BR-10`). Tests **54/54**, `tsc` limpio, build de 32 páginas. |
| 2026-08-21 | **Las tapas de Coveralia, bajadas y en uso acotado.** Pedido directo del usuario sobre el puntero que él mismo trajo: 35 imágenes (frontal, trasera y CD/interior donde existen, los 11 títulos) en `Docs/INVESTIGACION/TapasDiscos/` como másters fuera del sitio, y **bajas de 320 px** generadas a `public/tapas/` con `scripts/generar-tapas.mjs` (repetible). Dónde aparecen: **solo en las fichas `disco` de la Redondopedia** con crédito a Rocambole (`BR-07` las pide; `D-04` las quiere en baja) — el resto del collage sigue siendo recortes y dibujos propios, porque `UX-04` prohíbe la tapa entera como fondo decorativo. Nota para `investigador`: la ficha de evaluación de Coveralia sigue pendiente (`HILO-para-investigador-fuente-coveralia.md`); esto fue ejecución del pedido del usuario, no evaluación de corpus — la trampa de ediciones que avisó `RES-25` queda por auditar imagen por imagen. |
| 2026-08-21 | Nota de proceso: el test de estilos fallaba en Windows por finales de línea CRLF del checkout (buscaba `\n}\n` literal) — venía fallando también sobre `main`, no lo introdujo esta sesión. Normalizado al leer en `estilos.test.ts`, que además ahora audita `sitio.css` en la regla de cero hex fuera de `tokens.css`. |
| 2026-08-21 | **Corrida anti-slop, por pedido directo del usuario: nada en el sitio puede verse como la interfaz por defecto de una IA.** La regla quedó escrita para todos en `.claude/rules/diseno-marca.md` (tabla de tics vetados con su reemplazo en el idioma del proyecto — sello, cinta, papel, tinta plana, rotación) y **lo auditable se audita a máquina**: `estilos.test.ts` falla el build si vuelve una pastilla 999px o una barra de acento lateral fuera de la cita rotulada. Lo barrido, detectado con una caza de 3 agentes más el ojo propio: la **barra de acento a la izquierda de las tarjetas** (el caso que motivó el pedido — `.tarjeta-articulo` y `.feedback` pasan a borde completo teñido), **siete pastillas cápsula** convertidas a sello de goma de esquina casi viva, `--radio` de 14px a **4px** (papel cortado, no burbuja — deuda de lienzo anotada), los `style=` inline de la plantilla de artículo movidos a clases, y las **superficies "elevadas"** de las piezas del collage reemplazadas por recorte de borde grueso — que además arregla un defecto real: `cat-letras` sobre `--fondo-elevado` daba **4,32:1, abajo de AA**; sobre `--fondo` todos los pares pasan. En texto: la coletilla "entre los emblemas" repetida en siete discos destemplada, el redoble de tambor antes del dato y la honestidad declamada de tres cierres pasados a tinta seca, y dos cadenas de `CNT-05` corregidas — la gorda: **"¡Con la gorra bien puesta!" premiaba con la policía** ("la gorra" en la tribuna) y era jerga inventada; ahora "¡De una la sacaste!". Propuestas a `experiencia` y `contenido` actualizadas. 55/55 tests, build OK. |
| 2026-08-21 | **Ciclo 4 planificado: `T-44`..`T-63`, 20 tareas, en `Docs/ORQ/ORQ-plan-ciclo-4.md`.** Pedido del usuario que ordena el ciclo: integrar las tapas reales a la página —recortarlas, usar detalles, usarlas de fondo— más seguir con los juegos, la página y la Redondopedia. El corte encontró que **el pedido choca de frente con una regla vigente**: `UX-04` dice textualmente que las tapas reales van "nunca como fondo decorativo de otra pantalla", así que el ciclo arranca registrando `D-21` (`T-44`) y reescribiendo esa fila (`T-45`) — construir antes de eso sería construir contra una regla. El foco es doble y no casual: las tapas entran al sitio y de paso se cierra **`US-04` (adivinar la tapa) de 0/10 a 10/10**, el único de los tres juegos que faltan cuya materia prima ya está en el repo. La Redondopedia va de 26/35 a **29/35** (los 2 `hito` de Bulacio y Olavarría más la tercera `leyenda`). **Riesgo declarado del ciclo:** que la foto de fondo con velo oscuro y texto encima traiga de vuelta el slop que costó una corrida entera sacar, y que rompa los pares AA — mitigado con el velo como token testeado, recorte pegado en vez de imagen a sangre, y una regla más en `estilos.test.ts`. **Cambio de alcance declarado:** `BR-07` pedía "letra completa" en los artículos `tema`; `T-61` le pide a `producto` que lo corrija a versos citados más análisis, alineado con el techo de cita de `RES-03` y con los 2/1/0 versos de `BR-03`. El piso de 6 no se toca. Quedó afuera `US-02` entero (los recortes de audio los produce el usuario), la carga de letras (el insumo todavía no está en el repo — se llevan las tres tareas que destraban el ciclo 5) y desplegar en Vercel (va primero en el 5, con las tapas ya adentro). Rangos reservados en `Docs/IDS.md`: `RES-44`..`RES-49`. |
| 2026-08-21 | **El usuario dejó guardada una idea futura: que el sitio intente hablar como el Indio.** Analizar a fondo letras, entrevistas y demás archivo, y destilar de ahí una guía de voz que se apoye encima de `CNT-02` y `D-17`, no que las reemplace. **Pidió explícitamente que no se haga ahora.** Puntero en `Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md`, con las tres preguntas que hay que contestar antes de escribir copy: si el sitio habla *como* él o *citándolo* (escribir frases nuevas con la voz de una persona real que murió el 5-jun-2026, `RES-04`, no es lo mismo que citar testimonio rotulado); dónde aplica y dónde no (un botón críptico es un molinete cerrado, `D-14`); y que no termine en imitación de manual, que es el slop de `.claude/rules/diseno-marca.md` pero en el texto. |
| 2026-08-21 | **Pedido del usuario: las bandas ricoteras nacidas después de la separación son parte de la cultura y van a la Redondopedia.** Nombró tres — *La Kermesse Redonda*, *Indio y los Fundamentalistas del Aire Acondicionado*, *Skay y los Fakires* — transcriptas tal cual, **sin verificar por nadie**: los nombres exactos, las fechas y qué es cada una las fija una ficha `RES-XX`, porque la web tiene una sola puerta. Que entran no se discute; falta que `producto` decida bajo qué tipo (`BR-07` tiene seis y ninguno es `banda`) y qué le pasa al piso de 35 (`BR-11` es el orden de recorte). **La trampa señalada en la propuesta:** artículo sí, ítem de juego no — el filtro de los **105 temas de `RES-20`** existe justo para que no se mezcle material solista con el de la banda, y meterlo en un juego le marcaría error al que se sabe cuál es cuál. Nada de esto es del ciclo 4. |
| 2026-08-21 | **Ciclo 4 EJECUTADO y cerrado: las 20 tareas `T-44`..`T-63`.** Pedido del usuario: integrar las tapas reales a la página —recortarlas, usarlas de fondo— más seguir con los juegos, la página y la Redondopedia. **Lo primero que apareció fue un choque:** `UX-04` decía textualmente que las tapas reales van *"nunca como fondo decorativo de otra pantalla"*, o sea exactamente lo prohibido era lo pedido. Se registró `D-21` (las tapas entran a toda la pantalla, con cuatro condiciones: crédito, legibilidad como token testeado, la forma del proyecto y baja resolución) y recién después `experiencia` reescribió la fila y escribió `UX-05`, el catálogo pantalla por pantalla. **Resultado en el sitio:** 16 derivados nuevos generados desde los másters (`scripts/generar-tapas.mjs` ahora produce ficha, detalle y fondo), el portal con la franja de banderas de *Oktubre* y un recorte por casete, las pantallas en la cocina y la cabecera de la Redondopedia con fondo velado, y las fichas de artículo con su detalle por sección. **El velo es prueba, no promesa:** `--velo-tapa` (86%) y `--velo-tapa-titular` (75%) con seis tests que miden el **peor compuesto posible** —el velo sobre un píxel blanco puro—, más una regla en `estilos.test.ts` que falla el build si una tapa entra de fondo sin velo. |
| 2026-08-21 | **Y el ciclo 4 dejó un segundo juego jugable: `US-04` (adiviná la tapa), 10/10.** `arquitectura` escribió `CTR-05`, `contenido` cargó el banco y el hilo principal el juego, que **reusa el armado de ronda del quiz en vez de copiarlo** — copiarlo habría copiado también el defecto que ese archivo arregla (la correcta caía primera en 25 de 30 ítems). El portal ya lo anuncia con JUGÁ. La Redondopedia pasó de 26 a **29 de 35**: los dos `hito` de Bulacio y Olavarría —habilitados por el veredicto de `contenido` en `CNT-06`— y la tercera `leyenda`. Se cerraron además `CTR-04` (schema de completar la letra), `BR-12` (un artículo `tema` lleva versos citados y análisis, no la letra entera), `RES-44` (auditoría de edición de las 35 imágenes y evaluación de Coveralia) y `RES-45` (la fuente de letras que trajo el usuario). **77 tests, `tsc` limpio, build de 35 páginas.** |
| 2026-08-21 | **Tres cosas que el ciclo 4 encontró y que valen como lección.** (1) **La imagen de *La mosca y la sopa* no era de Rocambole:** el frontal que se había bajado es un rediseño con una foto de recital. Lo detectó `contenido` al no poder cargar el décimo ítem y lo confirmó el hilo principal mirándola. La contratapa sí trae el collage real, así que de ahí salen ahora la ficha de ese disco y los recortes de la sección `letras`. (2) **Una invariante propia rompió el build de más:** rechazaba toda reedición como respuesta correcta, cuando `RES-44` solo la veta *si la pregunta depende de la edición*. Se relajó a lo indefendible —"no determinable"— y quedó como test. (3) **`UX-05` mandaba poner *Oktubre* detrás de la marca grande**, que es el único texto del sitio que no llega a AA sobre tapa velada (3,38:1, y al 92% de velo sigue sin llegar). El fondo va anclado abajo. Las dos desviaciones quedaron en `Docs/SUGERENCIAS/` esperando a `experiencia`; `revisor` las revisó y las dio por bien resueltas y bien documentadas. |
| 2026-08-21 | **Las dos revisiones del ciclo encontraron nueve hallazgos y los importantes se corrigieron en la misma ráfaga.** El más serio: **`TP-010` mostraba la contratapa con el título del disco impreso y legible en la propia imagen** —la respuesta escrita adentro de la pregunta, y encima rotulado difícil—. Se cambió al recorte de la olla, que no lleva texto. También: `TP-002` mezclaba un hecho verificado con una afirmación reportada y ahora la lleva rotulada como leyenda; `CNT-01` seguía diciendo que las tapas se usaban en un solo juego y que venían del Cover Art Archive, y quedó al día; y **el crédito por pantalla de la condición 1 de `D-21` estaba implementado genérico** — ahora cada página declara qué tapas usa y el pie las nombra. `REV-05` quedó escrita con los cinco hallazgos de `US-04`, tres de ellos abiertos y con dueño (`arquitectura`: la ruta de `detalle` en `CTR-05.4`, la ventana de precarga, y el crédito compartido de *Lobo suelto*/*Cordero atado*). |
| 2026-08-21 | **El lienzo de marca se actualizó de verdad, y con eso el circuito de `.claude/rules/diseno-marca.md` quedó cumplido por primera vez.** La regla manda diseño → tokens → test y nunca al revés, pero el lienzo es un artefacto publicado que lleva su propio editor adentro: la sesión frenó y le preguntó al usuario antes de tocarlo, porque republicarlo reescribe lo que él edita a mano. Confirmó que nunca lo había editado. Se extrajeron las once hojas, se le agregó a la **hoja 05** la sección de `D-21` (las tres formas con su tamaño y su regla, los dos velos con su peor caso medido, el rojo de marca marcado como prohibido sobre tapa velada, el mecanismo de crédito y lo que sigue vetado), y se volvió a publicar en la misma URL con las otras diez hojas intactas. Queda anotado el techo real del material, que el catálogo no sabía: los frontales miden 953×953, así que **ningún recorte llega a los 480/640 px que pide `UX-04`** — el generador no agranda y avisa cuál quedó corto. |
| 2026-08-22 | **Diez ideas de juegos guardadas como `IDEA-01`..`IDEA-10`, sin empezar ninguna** (`Docs/PRODUCTO/PRD-backlog-ideas.md`). El usuario las tiró de una y pidió explícitamente guardarlas sin desarrollar. Se les creó prefijo propio en vez de escribirlas como `US-`: un `US-XX` acá es un contrato con Given/When/Then y piso, y forzarlo sobre diez ideas sin comprometer habría sido inventarles alcance. Cada título quedó **verificado contra los 105 temas de `RES-20`** antes de escribirlo — *Masacre en el puticlub* (Un baión, 1988), *Toxi-Taxi* (La mosca y la sopa, 1991), *Un Pacman en el Savoy* (¡Bang! ¡Bang!, 1989), *Último bondi a Finisterre* (1998), *Gran Lady* y *Rock para el negro Atila* (Lobo suelto vol. 1, 1993). **Dos reglas nuevas:** `BR-15` (la instrucción transversal del usuario — los clones se adoptan de un genérico y se visten, no se escriben; con las tres consecuencias que arrastra: licencia del motor, el skin es la parte cara, y la música de fondo en loop no está cubierta por ningún ADR) y `BR-16` (una idea no entra a un ciclo sin promoverse antes a `US-XX`). **Tres cosas quedaron abiertas y ninguna la puede contestar la sesión:** "el gordo Pier" no figura en los 105 —lo más cercano es *Pierre, el vitricida*, Gulp! 1985—, "la tumba del Indio" de `IDEA-05` no se dio ni por cierta ni por falsa, y `IDEA-10` (Guitar Hero) tiene bloqueo estructural de audio con tres salidas posibles. Ninguna de las diez es alcance de la v1: `US-02` y `US-03` siguen sin un solo ítem cargado. |
| 2026-08-22 | **`D-22`: los temas enteros se alojan en el sitio, en mp3.** Decisión directa del usuario — *"Vamos a alojar temas enteros en .mp3 seguro."* **Sacó de Fuera de alcance la línea más estable que tenía el proyecto**, y el motivo no fue una concesión: esa línea contradecía a `D-14`, porque el tema completo era lo único que el sitio le negaba al jugador sin Premium, y los molinetes van abiertos. Corregidos los dos lugares que quedaban diciendo lo contrario (`Docs/BRIEF.md` y `CLAUDE.md`, alcance y motor de audio). **Lo que se cayó:** `E-07` —que `ESTADO.md` tenía como "la pregunta que más pesa"— y `E-04` dejan de decidir si la promesa se cumple; Spotify baja de vía a extra; `BR-06` quedó describiendo un sitio que ya no existe y lleva aviso, sin reescribirse todavía porque depende de si Spotify se queda. **Lo que se cayó del lado bueno:** `IDEA-10` (Guitar Hero) era la única de las diez con bloqueo estructural y el bloqueo era exactamente este — desbloqueada el mismo día, aunque ahora le falta de dónde sale la partitura. **Lo que apareció en su lugar, y es aritmética:** contra las duraciones de `RES-20` (94 de 105 temas, 385 min fichados) el catálogo son **~7,2 horas de audio** — ~300 MB a 96 kbps, ~400 MB a 128, ~600 MB a 192, ~1 GB a 320. El problema pasó de ser de alcance a ser de peso e infraestructura: dónde viven los archivos, si van adentro del repo que Vercel construye, y los límites de Vercel para ese volumen, **que no están fichados y es lo único que conviene chequear antes de subir el primer archivo** (`RES-15` ya descartó el susto de la factura: en Hobby no hay cargo posible). Se le dejó a `arquitectura` todo junto en `Docs/SUGERENCIAS/HILO-para-arquitectura-audio-alojado.md`, incluida la consecuencia que más horas ahorra: si los pasos del reveal se derivan del mp3 entero, el recorte manual de `D-06` casi desaparece. |
| 2026-08-23 | **La voz del sitio dejó de ser intuición y pasó a estar medida** (`.claude/rules/voz-ricotera.md`). Se tomó la idea guardada del 21. Dos corpus del propio repo: el memoir (`RES-21`, 192.464 palabras) y las letras de los 104 temas (2.958 versos). Lo que salió: el verso mediano son **5 palabras** y el 90% no pasa de 8 — de ahí el techo de las líneas grandes; la letra le habla a alguien (*tu/tus* 146 contra *mi/mis* 115) y prefiere el cuerpo a los colores (75 contra 17); y el habla es corta (oración mediana de 13 palabras), rodea en vez de definir (*una especie de* 49, *más bien* 55) y **declara la duda** (*creo que* 81, *no sé* 71). Los tres antídotos contra la imitación: *che* 9 / *viste* 15 / *digamos* 3 en 192 mil palabras; *los fans* 2 contra *la gente* 333; y épica militante casi nula (*lucha* 6). **La regla prohíbe expresamente que el sitio se haga pasar por él**: una frase inventada con su firma rompería el rótulo `testimonio`, que es la promesa que sostiene todo lo demás (`D-14`). Nació también `src/lib/voz.test.ts` —lo que la sugerencia del 21 marcaba como inexistente—: seis pruebas sobre el copy visible, que encontraron y corrigieron **once botones en infinitivo** contra `D-17`. 185/185. **Y el barrido entró el mismo día**, con las dos decisiones del usuario: la Redondopedia va con prosa con voz y rótulo seco (registro 2 + 3), y el copy nuevo alcanza solo a las superficies que presentan — portada, seis casetes, pantalla 0 y tramos de resultado—, nunca a lo que hay que entender para jugar. 186/186. |
| 2026-08-23 | **`IDEA-11` guardada, sin empezar: mayor o menor con las palabras del cancionero.** Idea del usuario —arrancás con una palabra y su cantidad de apariciones en la discografía, y vas diciendo si la siguiente se dice más o menos, sumando racha—, con la instrucción explícita de guardarla y no desarrollarla. Ficha completa en `Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md` (la carpeta del PRD es de `producto`), número reservado en `Docs/IDS.md`. **No aplica `BR-15`** aunque el género exista: el motor son dos botones, lo caro es el dato — igual que `IDEA-09`. **Lo que la vuelve barata:** el corpus ya está en el repo desde el ciclo 6, no necesita audio, ni imagen, ni ficha de `investigador`, ni motor con licencia; y no roza `BR-03`/`BR-12` porque muestra palabras y números, nunca versos. **Lo que la frena, medido hoy sobre `src/data/cancionero.json`:** de los 104 temas, 96 tienen letra, y contando en crudo las líneas tipadas `t: "letra"` la palabra más frecuente da **`riff` 306 veces** y la segunda `guitarra` 156 — son anotaciones de la cifra viajando adentro de la letra (cifraclub aportó 88 de los 104). Filtrando lo que parece anotación se caen 1.070 líneas y quedan 2.858, con al menos una sucia en 80 temas, y **todavía queda basura arriba**. Como el conteo **es** la respuesta correcta, sin limpiar el corpus el juego rompe lo único estricto de `CLAUDE.md`. Esa limpieza es la misma deuda que ya arrastran `IDEA-08` y `US-03`: se paga una vez y sirve para las tres. |
| 2026-08-23 | **`IDEA-04` dejó de ser un género y pasó a tener meta: hay que llegar a tomar el último bondi.** El usuario lo pidió como "otro juego" —*"un mario de plataformas simple pero que hay que llegar a tomar el último bondi a Finisterre"*— y **no se abrió ID nuevo a propósito**: es la misma idea del 22, que estaba guardada con la frase pelada *"Plataformas ultimo bondi a finisterre"*. Un ID nuevo para la misma idea es justo lo que `Docs/IDS.md` evita. Ficha actualizada en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md` (la carpeta del PRD es de `producto`). **Lo que la meta resuelve sola:** el choque principal de la ficha era "largo de nivel contra la sesión de dos o tres minutos", y ahora el que corta el nivel es el bondi que arranca — la cuenta regresiva es el micro, no un número en la esquina, que es lo que pide `diseno-marca.md`. Además empuja los controles hacia un solo botón (correr a alcanzar algo que ya se está yendo) y regala la pantalla de derrota: "el último" quiere decir que no hay otro, y quedarse a pie no necesita ni chiste ni consuelo. **Tres precisiones verificadas hoy contra el cancionero:** *Último bondi a Finisterre* es un **disco, no un tema** —los diez temas están cargados y ninguno lleva ese título—, la palabra *bondi* aparece **una sola vez** en los 96 temas con letra y es en *El lobo caído* (Lobo suelto, 1993), ~~y *Finisterre* **no aparece nunca**~~ — **mal medido, y lo corrigió el usuario el 2026-08-24: lo que medí fue el corpus del repo y lo escribí como si fuera un hecho sobre las letras. *Finisterre* está cantado en *Gualicho*, cuya letra el repo no tiene.** Queda pedido a `investigador`: qué es Finisterre, porque el juego puede usar el nombre del disco pero no afirmar qué significa hasta que haya `RES-XX`. Sigue sin empezar, sigue fuera de la v1, y sigue con lo caro abierto: motor 2D con licencia (`BR-15`) y el skin, el más caro de los cinco clones. |
| 2026-08-24 | **`IDEA-04` tiene tema: *Gualicho*, y el tema corrigió un dato que yo había medido mal el día anterior.** El usuario avisó que el bondi a Finisterre está cantado ahí. **Mi frase del 23 —"*Finisterre* no aparece nunca en las letras"— era falsa, y el modo de fallar vale más que el dato:** medí el corpus del repo y lo escribí como si fuera un hecho sobre las canciones. Es exactamente lo que `CLAUDE.md` llama poner una leyenda disfrazada de dato, con el agravante de que la fuente era un archivo propio. Corregido en la bitácora del 23 y en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`. **Lo que el tema aporta a la idea:** el destino deja de ser un título de tapa y pasa a estar cantado; el verbo del juego sale de la letra —no es *tomar* el bondi, es **colgarse**—; *Gualicho* es la pista 4 del mismo disco, así que tema, tapa y paleta (`RES-37`, `D-19`) son la misma cosa; y con `D-22` el mp3 existe, lo que vuelve concreta la consecuencia 3 de `BR-15` (música de fondo en loop, sin ADR que la cubra). **`IDEA-04` es hoy la única de las cinco ideas de clon con su música decidida.** **El agujero que apareció al ir a buscar el verso, medido sobre `src/data/cancionero.json`:** *Gualicho* está marcado `contenido: "letra"` y **no tiene una sola línea cantada** —sus tres líneas tipadas `letra` son cifrado—; en el mismo disco *Pogo* tiene 0 de 24 (es una tablatura entera) y *El árbol del gran bonete* 1 de 4. Los otros seis con letra están completos y *Scaramanzia* está bien declarada como solo tablatura. Los tres agujeros vienen de cifraclub, fuente de 82 de los 104 temas. **Y hay un defecto vivo, chico pero visible:** `/letras-y-acordes/gualicho/` promete la letra de un tema y muestra tres líneas de acordes. La invariante de `src/lib/cancionero/banco.ts` que debería atajarlo existe pero cuenta como verso cualquier línea tipada `letra`, así que el cifrado le pasa por al lado. |
| 2026-08-24 | **Auditoría de detalles con la skill `impeccable`** sobre el portal y el quiz: 15/20, 4 P1 y 7 P2, todos arreglados y verificados en pantalla el mismo día. El grueso: `.primario` era una regla con alcance de página y los botones que crea el JavaScript salían sin estilo (siete botones en cuatro juegos); el auto-avance de 1,2 s se comía la explicación en 22 de 40 ítems; el foco se caía al `<body>` en cada cambio de pantalla; y el link de `COMPARTÍ` no tenía tarjeta. Informe en `Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md`. Entró además la figura encadenada a la portada, **sin atribuirle disco** hasta que haya ficha. |
| 2026-08-27 | **`T-133`: `CTR-09`, el schema del banco de `US-07`** (`Docs/ARQ/ARQ-schema-adivinar-por-la-letra.md`). El banco es `src/data/por-la-letra.json`, un ítem **por tema**, con la ventana de **8 versos** que revela la escalera de `BR-20` y **ni un dato de la escalera**: los pasos se cortan con `slice(0, 1|2|4|8)`. Sin `id` posicional —la identidad es el slug, que sale de `RES-20` y no se corre—, sin `estado` y sin distractores. El schema **sí** se baja a `src/data/_schema/por-la-letra.schema.json` (al revés que `CTR-03.8`, con el motivo escrito) y entra a `esquemas.test.ts` con un token. **El enganche de `CNT-11`**: una función `ventanaValida()` que devuelve el motivo del descarte, más `filtro.version` en el envoltorio comparado contra `VERSION_FILTRO` — así un banco generado con la regla vieja no se puede hacer pasar por filtrado. La dificultad manual va a `src/data/por-la-letra-curaduria.json` (de `contenido`, keyed por slug) y un tema sin etiqueta **entra igual** como `sin-clasificar`, para no repetir el pozo de tres ciclos de `US-03`. **Hallazgo medido de paso: `sirveComoVerso("[A  G]")` devuelve `true`** — está en `letra.json` como contexto de `CL-265` y `CL-266`. En `US-03` era un renglón feo; en `US-07` sería el enunciado entero del paso 1. Tapado por schema en `CTR-09.4`; el arreglo de fondo, en `Docs/SUGERENCIAS/ARQ-para-hilo-principal-verso-de-acordes.md`. |
