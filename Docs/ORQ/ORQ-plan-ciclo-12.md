# ORQ — Plan del ciclo 12: la imprenta de Rocambole

> **Escrito por el hilo principal** con `/ciclo`, el 2026-09-01, a pedido del usuario:
> *"otro ciclo de ui/UX inmersivo, aún más creativo e innovador. Tomá la mística y la
> estética ricotera de Rocambole y aplicala a toda la página. Sobre todo en el juego de
> adiviná el tema: debe sorprenderte la tapa del disco cuando adivinás."*
>
> Arranca sobre `ciclo-11/el-sitio-como-lugar` (`df58d06`), con el árbol limpio y sin otra
> sesión escribiendo el repo. Los rangos están reservados en `Docs/IDS.md`.

## Lo primero: qué hizo el ciclo 11 y qué le falta

El ciclo 11 convirtió el sitio en **un lugar**: se entra, se pasa de una sala a otra, el
aire se mueve. Lo hizo con una doctrina —*el movimiento es del lugar, no del elemento*
(`D-32`)— que dejó una cosa deliberadamente afuera: **el premio**. Hoy, cuando alguien
saca un tema, la revelación es una ficha de texto. El título en la tinta del disco, la
pista, los puntos, un botón. Correcto, sobrio, y **la tapa no aparece**. El jugador se lleva
el nombre del disco y no el disco.

Y hay un dato de material que hace esto peor de lo que parece: **las diez tapas ya están
en el repo**, en `public/tapas/`, a 320 px, con crédito, y con la paleta de cada una medida
píxel por píxel (`RES-37`) viviendo en `tokens.css`. Están las traseras también, como
másters. Todo el material de Rocambole está bajado, fichado y pagado en horas de trabajo,
**y el momento en que más se lo necesita no lo usa**.

## La idea que ordena el ciclo

`RES-06` dice cómo trabaja Rocambole, textual: *"artesanal, con rodillo y serigrafía;
también aerografía, grabado, collage e ilustración"*. El ciclo 11 tomó el collage (los
casetes, la cinta adhesiva, el papel). Este toma **la serigrafía**.

> ### El sitio no se dibuja: se imprime.
>
> Una serigrafía no aparece: **se estampa por pasadas**, un color por vez, con el registro
> apenas corrido, sobre papel. Ese es el gesto de este ciclo. La tapa que sacaste no "se
> muestra": **se imprime delante tuyo**, tinta clara, tinta media, tinta clave, y recién
> ahí la foto se fija. Con los colores medidos de esa tapa, sobre el papel de etiqueta que
> el sitio ya tiene. Y si no la sacaste, te la dejamos **en una sola tinta** — el negro de
> la clave, sobre el papel — que es lo que una imprenta te da cuando no pagaste el color.

De ahí sale la corrección a la doctrina del ciclo 11, que `UX-22` tiene que fijar:

> **El acierto es el único grito del sitio.** `voz-ricotera.md` §7 ya lo decía del texto
> —*"solo grita el acierto, que es un grito de verdad"*— y este ciclo lo extiende al
> movimiento: la revelación es el único momento en que algo puede durar más de un paso y
> ocupar la pantalla, porque no es un elemento pidiendo aplausos: **es la sala volviéndose
> el disco.**

Lo que no cambia, y hay que decirlo antes de que alguien lo afloje: **los cuatro límites de
`UX-20` siguen** (nada bloquea, nada retrasa el dedo, nada pisa un par testeado, con el
movimiento apagado el sitio dice lo mismo). El botón de seguir está desde el cuadro cero.
Los rótulos y los estados no se estampan. Las tres pantallas de registro 3 no entran.

## Las siete cosas que cambian

1. **La tapa se imprime al acertar.** Tres pasadas de tinta —separadas en build, con los
   colores medidos de cada tapa— y la foto que se fija encima, sobre papel de etiqueta,
   con el crédito estampado como sello. Al fallar, la clave sola: una tinta.
2. **El acierto suena entero.** Si tuviste el audio prendido en ese tema, el fragmento de
   diez segundos arranca solo al acertar y la impresión pasa **con la música**. Quien jugó
   a ciegas no recibe sonido que no pidió.
3. **La sala se vuelve el disco.** Al acertar, el fondo velado de la pantalla —hoy siempre
   Lobo suelto— pasa a ser la tapa que sacaste, en el tiempo de un paso. Al tema siguiente
   vuelve. Cero archivos nuevos: es la misma ficha de 320 px, velada.
4. **Dala vuelta.** La tapa impresa es un objeto: se toca y se da vuelta, y aparece la
   trasera real con la pista que sacaste estampada como sello. Nadie que tenga un disco en
   la mano deja de darlo vuelta.
5. **La cinta gira.** Un casete dibujado —el que ya está en `public/arte/`— cuyos carretes
   giran mientras suena el fragmento. Es diegético y es **información**: quien no escucha
   nada ve que el sitio sí está sonando, y sabe que el problema es su aparato (`UX-03`).
6. **El disco en sus propias letras.** Las cuatro fuentes fan que el sitio ya aloja
   cubren, verificado glifo por glifo, tres nombres: OKTUBRE en el calco de *Oktubre*, LOBO
   SUELTO y CORDERO ATADO en la de *Lobo suelto*. Esos tres se estampan con su letra; los
   otros siete, en la rotulada. No se inventa una letra que no existe.
7. **La imprenta en toda la página.** El registro imperfecto —la segunda tinta corrida dos
   píxeles— en la letra grande de todo el sitio; el rodillo como separador de sección; el
   zoom de "Adiviná la tapa" que **se abre** al acertar y deja ver la tapa entera
   imprimiéndose; y la ficha de disco de la Redondopedia estampada, quieta.

## Lo que este ciclo no hace, y por qué

- **No toca el adentro del quiz ni de "Completá la letra".** Ahí el premio es la
  explicación, no una imagen, y un ciclo que imprime tapas no tiene nada que imprimirles.
- **No mete sonido nuevo.** Ni golpe de acierto, ni sello, ni clic. El ciclo 11 lo decidió
  y sigue: la única voz del sitio es la cinta, y el único sonido de un juego es su tema.
- **No cambia la tarjeta que se comparte.** `D-21` dice que una tapa afuera del sitio viaja
  sin su crédito; lo que se imprime acá se imprime adentro.
- **No se le pide a nadie una tapa que no está.** Las diez frontales existen; las traseras
  existen como máster. Lo que falte se declara, no se dibuja.

---

## Las tareas

### Frente A — la imprenta: doctrina, ficha, contrato y palabras

Cuatro documentos, cuatro dueños, en paralelo. Ninguno toca código.

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-195` | `experiencia` | **`UX-22` — "La imprenta de Rocambole"**: el acierto como único grito (su techo propio de duración, distinto del paso de `UX-20`), la revelación por pasadas como movimiento *del lugar*, la sala que se vuelve el disco, el registro imperfecto en la letra grande (dónde sí y dónde no), los carretes como señal diegética, "dala vuelta" como manipulación del que juega. Qué no se estampa nunca. El equivalente quieto de cada pieza | `Docs/UX/UX-22-la-imprenta-de-rocambole.md` *(nuevo)* | cada tarea de B, C, D y E cita un apartado; `T-209` la usa de vara | `[P]` |
| `T-196` | `investigador` | **`RES-54`**: cómo se imprime una serigrafía de verdad —orden de las pasadas, registro, por qué la clave va última— con URL y fecha, para que el orden de las capas no sea inventado. Y lo que haya sobre el proceso de Rocambole con las tapas, si existe; si no, decirlo | `Docs/INVESTIGACION/INV-54-serigrafia.md` *(nuevo)* | la ficha fija el orden de pasadas o rotula que no hay fuente | `[P]` |
| `T-197` | `arquitectura` | **`ADR-05` + `CTR-12` — las separaciones**: dónde viven los derivados, cómo se obtienen los colores (de `tokens.css`, único lugar con hex), qué recibe la isla (convención por slug, sin tocar el JSON), tope de peso por archivo y por revelación, la trasera como cuarta forma de `D-21`, y por qué PNG pre-teñido y no máscaras en tiempo de ejecución | `Docs/ARQ/ARQ-separaciones-de-tapa.md` *(nuevo)* | el contrato dice qué archivo falta si falta, y qué pasa en pantalla cuando falta | `[P]` |
| `T-198` | `contenido` | **`CNT-14` — las palabras de la imprenta**: lo que dice el acierto y el fallo con la metáfora de la tinta, el sello de crédito (registro 3, seco), "dala vuelta" / "volvé a la tapa", la palabra que reemplaza al giro con movimiento reducido, el pie de la tirada. Ocho palabras o menos, voseo, un intruso como mucho | `Docs/CONTENIDO/CNT-14-las-palabras-de-la-imprenta.md` *(nuevo)* | las líneas pasan las siete reglas de `src/lib/voz.test.ts` | `[P]` |

### Frente B — la tapa se imprime

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-199` | hilo principal | **El taller**: `scripts/generar-pasadas.mjs` separa cada ficha de 320 px en tres tintas —clara, media, clave— con los colores de su disco leídos de `tokens.css`, y emite la trasera a 320 px. Con su guardián: existen las 40 piezas, ninguna pasa el tope, y los colores son los del token | `scripts/generar-pasadas.mjs` *(nuevo)*, `public/tapas/pasadas/*` *(nuevo)*, `public/tapas/trasera/*` *(nuevo)*, `src/lib/tapa/pasadas.test.ts` *(nuevo)* | `node --test src/lib/tapa/pasadas.test.ts` verde y el peso impreso por archivo | tras `T-197` |
| `T-200` | hilo principal | **La estampa**: la revelación de "Adiviná el tema" imprime la tapa por pasadas sobre papel, con el registro corrido, la foto que se fija, el crédito como sello y el nombre del disco en su letra donde existe. Fallo = clave sola. Movimiento reducido = estado final directo. Tokens nuevos en el lienzo primero, y las animaciones en el catálogo de `movimiento.test.ts` | `src/scripts/partida-tema.ts`, `src/styles/juego.css`, `src/styles/tokens.css`, `src/lib/tema/copy.ts`, `src/lib/movimiento.test.ts` | `npm test` verde, y una vuelta jugada a 375×812 con acierto y con fallo | tras `T-199`, `T-195`, `T-198` |
| `T-201` | hilo principal | **El acierto suena entero**: si el audio estuvo prendido en ese tema, el fragmento de diez segundos arranca solo al acertar y la estampa pasa con la música. A ciegas, silencio | `src/scripts/partida-tema.ts` | acertar tras escuchar → suenan los 10 s; acertar sin haber escuchado → nada suena | tras `T-200` |
| `T-202` | hilo principal | **La sala se vuelve el disco**: al acertar, `.tapa-fondo` pasa a la ficha del disco velada, en `--duracion-paso`; al tema siguiente vuelve a Lobo suelto. Cero archivos nuevos | `src/scripts/partida-tema.ts`, `src/styles/juego.css` | `node --test src/lib/contraste.test.ts` verde (el velo es el peor caso ya testeado) | tras `T-200` |
| `T-203` | hilo principal | **Dala vuelta**: la estampa se toca y muestra la trasera real con la pista estampada como sello. Carga la trasera recién al tocar. Movimiento reducido = cambio sin giro | `src/scripts/partida-tema.ts`, `src/styles/juego.css` | la trasera no se baja hasta el toque (red de la consola), y el sello dice la pista real | tras `T-199`, `T-200` |

### Frente C — la cinta y la tirada

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-204` | hilo principal | **La cinta gira**: el casete de `public/arte/casete.svg`, en línea, con los carretes girando mientras el reproductor suena y quietos al frenar. Con movimiento reducido, la palabra de `CNT-14` en su lugar. Es la señal para quien no escucha nada | `src/scripts/partida-tema.ts`, `src/styles/juego.css`, `src/lib/movimiento.test.ts` | los carretes giran solo mientras `sonando`; con movimiento reducido aparece la palabra | tras `T-195` |
| `T-205` | hilo principal | **La tirada como afiche**: el resumen de la vuelta lleva cada tapa como estampa chica —a color si la sacaste, en una tinta si no— y se maqueta como afiche de recital: el tiempo grande, los cuatro temas como lista de temas, pegado torcido | `src/scripts/partida-tema.ts`, `src/styles/juego.css` | las cuatro estampas cargan a 32 px y el resumen no desborda a 320 | tras `T-200` |

### Frente D — el zoom se abre

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-206` | hilo principal | **"Adiviná la tapa" imprime lo que faltaba**: al acertar, el recorte de zoom se abre y el resto de la tapa llega por pasadas hasta la tapa entera; al fallar, la clave. Reusa todo lo de `T-200`. Es el "mostrar la tapa entera al revelar" que el ciclo 10 dejó afuera, y la ruta sale por convención del slug del disco, sin tocar el JSON ni el schema | `src/scripts/partida-tapa.ts`, `src/styles/juego.css`, `src/lib/tapa/copy.ts` | una vuelta jugada entera; `node --test src/lib/esquemas.test.ts` sin cambios | tras `T-200` |

### Frente E — la imprenta en toda la página

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-207` | hilo principal | **El registro imperfecto**: la segunda tinta corrida `--registro` (2 px) en la letra grande de todo el sitio —marca, títulos de casete, `h1` de juego, títulos de artículo—, siempre en el apoyo del disco de la sección, nunca en texto de cuerpo. Estático. Con su guardián | `src/styles/tokens.css`, `src/styles/sitio.css`, `src/styles/juego.css`, `src/lib/estilos.test.ts` | `contraste.test.ts` intacto y el test nuevo falla si la sombra toca un párrafo | tras `T-195` |
| `T-208` | hilo principal | **El rodillo y la ficha estampada**: `--textura-rodillo` como separador de sección del portal y del índice de la Redondopedia, y la tapa de la ficha de disco con el mismo papel, sello de crédito y registro que la estampa del juego — **quieta**, porque `UX-20` §2 dice que un artículo no se mueve | `src/styles/tokens.css`, `src/styles/sitio.css`, `src/pages/redondopedia/[slug].astro` | `estilos.test.ts` y `redondopedia.test.ts` verdes | tras `T-207` |

### Cierre

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-209` | `revisor` | **`REV-11`**: el ciclo contra `UX-22`, `UX-20`, las dos reglas del repo y `D-21`. Las tres preguntas duras del ciclo 11 y dos nuevas: **¿sorprende la tapa?** y **¿la imprenta se volvió plantilla?** — la sombra dura corrida es la única sombra que la regla permite, y también es la más fácil de convertir en tic | `Docs/REVISIONES/REV-11-la-imprenta.md` *(nuevo)* | hallazgos `FIND-46`+ con evidencia y veredicto sobre las dos preguntas nuevas | tras todo |
| `T-210` | hilo principal | **`D-33`** escrito —*el acierto es el único grito*— y `ESTADO.md` al día | `Docs/DECISIONES.md`, `ESTADO.md` | `D-33` cita las tareas que la probaron | último |

**`[P]` al arrancar:** `T-195`, `T-196`, `T-197`, `T-198`. Cuatro dueños, cuatro archivos
nuevos, cero código.

## La pasada de conflictos

- **`T-200`..`T-205` tocan `partida-tema.ts` y `juego.css`.** Van en cadena, no en abanico.
  Es la restricción real del ciclo, igual que `sitio.css` lo fue en el 11.
- **`T-206` (tapa) y `T-207` (registro) no chocan con la cadena del tema** salvo en
  `juego.css`, así que van después de `T-200` y no a la vez.
- **`tokens.css` lo tocan `T-200`, `T-207` y `T-208`**, uno detrás del otro, y siempre con
  el lienzo primero (`diseno-marca.md`).
- **Nadie toca `audio.ts`.** El acierto que suena entero usa `sonar()` tal como está: desde
  el arranque del archivo, que es lo que su comentario ya defiende.

## Qué quedó afuera, y por qué

- **La tarjeta compartida con la tapa.** `D-21`: afuera del sitio la tapa viaja sin crédito.
- **La onda del fragmento dibujada en la cinta.** Es lo que hace cualquier reproductor, y
  la cinta que gira ya dice lo mismo sin parecerse a un reproductor.
- **La letra del disco para los siete que no la tienen.** Las fuentes fan cubren tres
  nombres; los otros siete van en la rotulada. Inventarles una letra sería decir algo sobre
  la tapa que nadie calcó.
- **El escritorio.** Sigue siendo su propia pasada.

## El riesgo del ciclo

**Que la estampa se vuelva un efecto.** Una tapa que aparece por capas con offset es, en
manos de una plantilla, un "efecto de impresión" que hay en cualquier biblioteca. Lo que la
separa de eso son tres cosas que se pueden verificar y que `T-209` va a verificar: que los
colores sean **los medidos de esa tapa** y no una paleta; que el orden de las pasadas sea
**el de una serigrafía de verdad** (`RES-54`) y no el que queda lindo; y que la clave sola
del fallo sea **una decisión del juego** —te faltó el color— y no un estado a medio cargar.

**Y el riesgo de al lado:** el peso. Diez tapas por tres tintas más diez traseras son
cuarenta archivos nuevos en `public/`. Por revelación se bajan tres, y la trasera solo al
tocar. `ADR-05` fija el tope y `pasadas.test.ts` lo hace cumplir; si un archivo lo pasa, el
build lo dice antes de que lo diga un celular con 3G.

## Rangos

Consume `T-195`..`T-210`, `UX-22`, `RES-54`, `ADR-05`, `CTR-12`, `CNT-14`, `D-33`,
`REV-11`, `FIND-46`+.

Quedan libres: `T-211`+, `D-34`+, `RES-55`+, `US-08`+, `BR-22`+, `CTR-13`+, `UX-23`+,
`CNT-15`+, `REV-12`+, `IDEA-14`+, `ADR-06`+.
