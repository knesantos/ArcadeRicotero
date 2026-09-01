# ORQ — Plan del ciclo 11: el sitio deja de mostrarse y empieza a habitarse

> **Escrito por el hilo principal** con `/ciclo`, el 2026-09-01, a pedido del usuario:
> *"todo de mejora completa de ui/ux; que toda la página sea una experiencia inmersiva, que
> cada paso se sienta como meterse en un universo mitológico misterioso"*.
>
> **Este ciclo convive con el 10, que ya está planificado y lo está corriendo otro agente.**
> El mapa de conflictos está más abajo y no es decorativo: se leyó antes de cortar las
> tareas, y hay filas que están cortadas como están *para no pisar al otro*.

## Lo primero, porque es lo que ordena el ciclo entero

**El sitio está bien vestido y no se camina.** Eso no es una impresión: es una medición de
dos líneas.

```
grep -rn "transition|animation|@keyframes" src/styles src/pages src/layouts src/scripts
```

Devuelve **dos resultados en todo el repo**:

| Dónde | Qué | Qué es |
|---|---|---|
| `src/styles/juego.css:104` | `transition: border-color 120ms, background-color 120ms` | la respuesta al toque de una opción — **información**, no adorno |
| `src/styles/sitio.css:147` | `animation: vuelo-de-mosca 17s` | lo único vivo del sitio |

Todo lo demás —trece plantillas, cinco juegos, la Redondopedia entera, el cancionero—
**aparece de golpe, ya formado, como una lámina**. Se pasa de una pantalla a la otra con un
parpadeo de documento nuevo. La marca, el grano, el collage y las diez paletas de disco
hacen un trabajo enorme para construir un mundo, y después el mundo no se mueve ni respira.

Y hay un tercer dato que este ciclo tiene que arreglar antes de tocar nada:

**`src/styles/tokens.css:205-210` apaga el movimiento con una guillotina.** El corte de
`prefers-reduced-motion` lleva `*, *::before, *::after` a `0.01ms`, así que apaga la mosca
—perfecto— y también apaga los 120 ms de `.opcion`, **que son la única confirmación de que
el sitio recibió tu dedo**. La auditoría `impeccable` lo dejó anotado como P3 el 2026-08-24
y sigue abierto. Reducir movimiento no es borrar la respuesta al toque.

**No hay un solo token de movimiento en `tokens.css`.** Ni una duración, ni una curva. Las
dos que existen están escritas a mano en su componente, que es exactamente lo que la regla
de marca prohíbe para un color y todavía no dice para un tiempo.

## La línea que separa "inmersivo" de "slop", y es la que hace este ciclo

El pedido tiene una trampa adentro, y conviene escribirla antes que las tareas: **casi todo
lo que una IA hace cuando le piden "inmersivo" está vetado por `.claude/rules/diseno-marca.md`.**
El resplandor, el desenfoque, el degradado, la tarjeta que se levanta al pasar el dedo, el
héroe que aparece con fundido, el micro-rebote — la tabla de tics vetados los nombra uno por
uno. Un ciclo de inmersión hecho sin doctrina termina siendo la corrida anti-slop al revés.

La doctrina que este ciclo propone, y que `T-176` tiene que fijar o corregir:

> ### El movimiento es del lugar, no del elemento.
>
> Nada acá se mueve para llamar la atención sobre sí mismo. Lo que se mueve es **la cámara**:
> el aire, el fondo, la tinta, el paso de una pantalla a la otra. Un botón que rebota es un
> botón pidiendo aplausos. Una sala que respira es un lugar.

De esa línea salen los cuatro límites, y ninguno es negociable:

1. **Nada bloquea.** No hay pantalla de carga, ni intro, ni "espere". `D-14`: los molinetes
   van abiertos, y una animación que hay que aguantar es un molinete nuevo.
2. **Nada retrasa el dedo.** La acción principal es tocable desde el primer cuadro. Las
   sesiones son de dos o tres minutos: medio segundo robado en cada paso es media sesión.
3. **Nada se mueve encima de un par testeado.** El velo, el grano y las capas de fondo no
   pasan por detrás de un texto sin su número de contraste. `contraste.test.ts` manda.
4. **Con el movimiento apagado, el sitio dice lo mismo.** No menos información: la misma,
   dicha sin movimiento. Es la regla de los molinetes aplicada a quien marea.

Y la contracara, que es lo que de verdad hace el universo mitológico: **el misterio lo
sostiene el rótulo frío.** `LEYENDA`, `TESTIMONIO`, la ficha `RES-` y las tres pantallas de
registro 3 (Bulacio, Olavarría, la muerte del Indio) **no se decoran, no se atmosferan y no
entran a este ciclo**. Un sitio donde todo es niebla no tiene misterio: tiene humo. El
misterio necesita que en algún lugar haya piso firme, y ese piso es el rótulo.

## Las cinco cosas que cambian, en una línea cada una

1. **El umbral.** La portada llega en un tiempo: el grano se asienta, la franja de banderas
   sube, la marca se estampa como un sello de goma. El contenido está desde el cuadro cero.
2. **El tránsito.** Ir de la portada a un juego deja de ser un documento nuevo y pasa a ser
   un paso adentro: la tinta se hace más honda cuando entrás y más clara cuando volvés.
3. **La atmósfera.** Cada lugar tiene su clima —su disco, su velo, su recorte de fondo—, así
   que moverse por el sitio se siente como cambiar de sala, no de pestaña.
4. **La voz del lugar.** Una cama de cinta **sintetizada** (cero archivos, cero derechos,
   cero peso), **apagada por defecto**, que se prende con el botón de play del casete y se
   calla sola cuando suena un fragmento.
5. **La mosca cruza.** Es lo único vivo del sitio y hoy se reinicia en cada pantalla. Pasa a
   sobrevivir el tránsito: la misma mosca, no una mosca nueva por página.

---

## Mapa de conflictos con el ciclo 10 — leer antes de tocar un archivo

El ciclo 10 (`T-161`..`T-175`) está planificado y lo corre otro agente. **Estos archivos son
suyos y ninguna tarea de este ciclo los edita:**

`src/scripts/partida-tema.ts` · `src/data/adivinar-tema.json` · `src/data/quiz.json` ·
`src/data/cancionero.json` · `src/data/tapa.json` · `src/data/popularidad.json` ·
`src/data/_schema/*` · `src/lib/esquemas.test.ts` · `src/lib/voz.test.ts` ·
`src/pages/quiz.astro` · `Docs/PRODUCTO/PRD-alcance-v1.md` · `Docs/UX/UX-05-tapas-en-pantalla.md` ·
`scripts/ingerir-fragmentos.mjs` · `Docs/ARQ/ARQ-schema-adivinar-tema.md`

> ### Corrección del 2026-09-01, con el ciclo 10 ya corriendo
>
> Este mapa se escribió leyendo el plan del otro ciclo. Al empezar a construir se miró
> `git status`, que es lo que dice la verdad, y aparecieron **dos cosas que el plan del 10
> no anticipaba**:
>
> 1. **`src/pages/juegos/adivinar-el-tema.astro` también es suyo.** No figuraba en ninguna
>    fila del ciclo 10 y está modificado. Se suma a la lista de arriba: `T-182` lo deja
>    afuera igual que al quiz.
> 2. **`UX-13` ya estaba tomado.** Las dos sesiones planificaron el mismo día, las dos
>    vieron que el último documento de `experiencia` era `UX-12`, y las dos escribieron un
>    `UX-13` distinto — allá el zoom de tapas, acá "el sitio como lugar". **Este ciclo se
>    corre a `UX-20`+**, y la reserva quedó anotada en `Docs/IDS.md`, que es donde
>    corresponde. También aparecieron `src/lib/escalonar.ts` y `src/lib/popularidad.ts`,
>    archivos nuevos del otro ciclo: ninguna tarea de acá los toca.
>
> La lección es del método y ya estaba escrita en `Docs/IDS.md`: **entre dos sesiones que no
> se ven, el disco manda sobre el plan.** Antes de escribir un archivo nuevo, `git status`.

> ### Segunda corrección, más tarde el mismo día: **el quiz entró, y este mapa quedó viejo**
>
> A mitad del ciclo, el otro agente **cerró el 10 entero y lo commiteó**. Desde ese momento
> `quiz.astro` y `adivinar-el-tema.astro` dejaron de ser de nadie, y este ciclo los tocó:
> las dos pantallas recibieron su renglón de `CNT-13` y la isla del interruptor, como las
> otras seis. **No hubo conflicto** —el trabajo del otro ciclo ya estaba en `git`— pero
> durante unas horas este mapa dijo que no se tocaban mientras se tocaban, y eso lo encontró
> `REV-10` leyendo el plan contra el disco.
>
> **Queda corregido acá y no en un comentario suelto**, porque el defecto no era el código:
> era que el documento que ordena el ciclo había dejado de describirlo. Las dos filas que
> hablaban de dejar el quiz afuera —`T-182` y la nota de `UX-21` §1— **valían mientras el
> ciclo 10 estaba abierto y dejaron de valer cuando cerró.** Lo que no cambió ni un
> milímetro es el motivo por el que el mapa existía: `ADR-03` eligió un mecanismo que no
> necesita tocar ninguna pantalla, así que el tránsito habría alcanzado al quiz igual sin
> abrirlo nunca.

Tres consecuencias concretas, y están adentro de las tareas:

- **`T-182` deja el quiz afuera a propósito.** Los cinco juegos entran a la gramática del
  tránsito; `quiz.astro` entra después, porque lo tiene `T-167`. Queda anotado como deuda
  con dueño, no como olvido.
- **`voz.test.ts` se corre, nunca se edita.** Todo texto nuevo de este ciclo pasa por el
  auditor que hay hoy; si hiciera falta una regla nueva, va como propuesta y espera.
- **`ESTADO.md` lo escriben los dos ciclos** (`T-175` allá, `T-194` acá). **El que llegue
  segundo lo relee antes de escribir.** Es el único archivo verdaderamente compartido.

Dos carpetas se comparten sin pisarse porque los archivos son distintos: `Docs/ARQ/`
(`T-161`/`T-172` allá, `T-180`/`T-189` acá) y `Docs/UX/` (`UX-05` allá, `UX-20`/`UX-21` acá).

---

## Las tareas

### Frente A — la doctrina y el sistema

Sin esto, lo demás es decoración suelta: cuatro tareas que fijan la vara, los valores y el
guardián **antes** de que se mueva la primera cosa.

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-176` | `experiencia` | **`UX-20` — "El sitio como lugar"**: la doctrina de arriba, adoptada o corregida, y el **mapa de atmósfera por sección** que extiende `D-19` (hoy rota el acento y la letra; falta que rote el clima). Incluye qué **nunca** se mueve: rótulos, estados, y las tres pantallas de registro 3 | `Docs/UX/UX-20-el-sitio-como-lugar.md` *(nuevo)* | cada tarea de los frentes B, C y D puede citar un apartado suyo, y `T-193` la usa de vara | `[P]` |
| `T-177` | hilo principal | **Los tokens de movimiento y de aire**, con el circuito en orden: primero la **hoja 12 del lienzo**, después `tokens.css`. Duraciones nombradas, la curva de la cinta, los velos de profundidad. Ni un tiempo suelto en un componente, igual que ningún hex | lienzo (hoja 12 nueva), `src/styles/tokens.css` | `node --test src/lib/contraste.test.ts` verde y el lienzo tiene la hoja antes que el archivo | tras `T-176` |
| `T-178` | hilo principal | **El corte de `prefers-reduced-motion` deja de ser una guillotina.** Apaga lo decorativo —la mosca, el umbral, el tránsito— y **conserva la respuesta al toque** de `.opcion`. Es el P3 abierto del 2026-08-24 | `src/styles/tokens.css`, `src/styles/juego.css` | con movimiento reducido: la mosca quieta, y el borde de la opción sigue cambiando al tocar | tras `T-177` |
| `T-179` | hilo principal | **El guardián del movimiento**: falla el build si aparece una duración o una curva fuera de `tokens.css`, si una animación no tiene su equivalente quieto, o si vuelve el `*` global del corte de movimiento | `src/lib/movimiento.test.ts` *(nuevo)* | `node --test src/lib/movimiento.test.ts` verde, con un caso por cada una de las tres reglas | tras `T-178` |

### Frente B — el tránsito: cada paso

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-180` | `arquitectura` | **`ADR-03` — cómo se pasa de una pantalla a la otra.** El efecto es lo de menos: lo que hay que resolver son **las islas de partida, el audio sonando, el foco y el botón de atrás**. Tres candidatas: (A) `@view-transition` de CSS entre documentos — cero JS, no toca ninguna isla, se ignora sola donde no hay soporte; (B) `<ClientRouter/>` de Astro — más control y **pone en riesgo las islas**, que ya tienen guardián (`islas.test.ts`); (C) pintado a mano por pantalla. Alternativas descartadas y consecuencias, como siempre | `Docs/ARQ/ARQ-transito-entre-pantallas.md` *(nuevo)* | la decisión dice **qué le pasa a una partida en curso** y si `islas.test.ts` sigue alcanzando | `[P]` |
| `T-181` | hilo principal | **El tránsito del cascarón**: portal ↔ lectura, por la puerta que abrió `ADR-03`. La tinta se hace más honda al entrar y más clara al volver — el paso se siente, no se mira | `src/layouts/Base.astro`, `src/styles/sitio.css` | `npm test` y `npm run check` verdes; a 375×812 el atrás del navegador vuelve sin parpadeo | tras `T-177` y `T-180` |
| `T-182` | hilo principal | **Las cinco puertas de los juegos** entran con la misma gramática sin romper sus islas. **`quiz.astro` queda afuera a propósito** — lo tiene `T-167` del ciclo 10 | `src/pages/juegos/*.astro` (los cinco), `src/styles/juego.css` | `node --test src/lib/islas.test.ts` verde y **una vuelta jugada entera en cada uno de los cinco** | tras `T-181` |
| `T-183` | hilo principal | **La mosca sobrevive el paso.** Es lo único vivo del sitio y hoy renace en cada pantalla; pasa a cruzar de una a la otra sin volver a empezar el vuelo | `src/layouts/Base.astro`, `src/styles/sitio.css` | se la ve cruzar de la portada a la Redondopedia; con movimiento reducido sigue quieta | tras `T-181` |

### Frente C — la atmósfera: dónde estás

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-184` | `contenido` | **`CNT-13` — los nombres del lugar.** Una línea por sección que dice **dónde estás**, en registro 1 y de ocho palabras para abajo. Es lo que convierte "otra pantalla" en "otra sala", y lo hacen las palabras, no los degradados | `Docs/CONTENIDO/CNT-13-los-nombres-del-lugar.md` *(nuevo)* | las ocho líneas pasan las siete reglas que ya audita `src/lib/voz.test.ts` (se corre, no se edita) | `[P]` |
| `T-185` | hilo principal | **El umbral.** La portada llega en un tiempo: el grano se asienta, la franja sube, la marca se estampa. **Una vez por visita**, y el `JUGÁ` es tocable desde el primer cuadro | `src/pages/index.astro`, `src/styles/sitio.css` | a 375×812 el botón responde antes de que termine el umbral; con movimiento reducido la portada aparece entera y quieta | tras `T-177` |
| `T-186` | hilo principal | **La profundidad de cada lugar**: dos capas de fondo —recorte real velado y grano— que se corren distinto al desplazar, con el velo de su disco. Dos capas, no cinco, y solo traslación | `src/styles/sitio.css`, `src/lib/sitio/arte.ts` | `node --test src/lib/contraste.test.ts` verde y **cero desborde horizontal** a 320, 375 y 1280 | tras `T-185` |
| `T-187` | hilo principal | **La lectura también es un lugar**: el artículo de la Redondopedia abre como página de fanzine —capitular en la letra rotulada, la atmósfera de su disco— y **los rótulos de `BR-08` quedan exactamente como están**, fríos | `src/pages/redondopedia/[slug].astro`, `src/styles/sitio.css` | `node --test src/lib/redondopedia.test.ts` y `estilos.test.ts` verdes; el bloque de leyenda no cambió ni un píxel | tras `T-186` |
| `T-188` | hilo principal | **Los nombres entran a la pantalla**: las ocho líneas de `CNT-13` se cablean donde vive el texto del sitio y se ven en cada lugar | `src/lib/sitio/copy.ts`, `src/styles/sitio.css` | `node --test src/lib/voz.test.ts` verde con las ocho líneas nuevas adentro | tras `T-184` y `T-186` |

### Frente D — la voz del lugar

El sonido es la palanca de inmersión más grande que tiene el sitio y también la más fácil de
arruinar. Va con tres candados: **apagado por defecto, sin archivo, y mudo cuando el juego
suena.**

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-189` | `arquitectura` | **`ADR-04` — la cama de cinta.** Ruido **sintetizado** con Web Audio: cero archivos, cero derechos (`D-14` no tiene ni por dónde agarrarlo), cero peso. Un solo `AudioContext` compartido con el motor de fragmentos, y la regla de convivencia escrita: **cuando suena un fragmento, la cama se calla**. Qué pasa si el navegador bloquea el audio | `Docs/ARQ/ARQ-cama-de-cinta.md` *(nuevo)* | dice quién es dueño del `AudioContext` y cómo se apaga sola sin tocar `partida-tema.ts` | `[P]` |
| `T-190` | `experiencia` | **`UX-21` — el interruptor.** Dónde vive, qué forma tiene (**el botón de play del casete**, no una pastilla), qué dice prendido y apagado, y por qué apagado es el default. Molinetes: el sitio es idéntico sin él | `Docs/UX/UX-21-el-interruptor-de-cinta.md` *(nuevo)* | el texto del interruptor pasa `node --test src/lib/voz.test.ts`, y `UX-21` dice qué pasa con `UX-03` (jugar sin auriculares) | tras `T-176` |
| `T-191` | hilo principal | **La cama, construida**: apagada por defecto, recordada en el propio navegador, muda mientras suena un fragmento, y se va con un toque. **Sin tocar `partida-tema.ts`**: se calla escuchando el grafo de audio, no la pantalla | `src/lib/sitio/cinta.ts` *(nuevo)*, `src/lib/tema/audio.ts`, `src/styles/sitio.css` | con la cama prendida, una vuelta de "Adiviná el tema" **no la pisa** ni se pisa; `npm test` verde | tras `T-189` y `T-190` |

### Frente E — la deuda vieja que es de este ciclo

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-192` | hilo principal | **Los P3 de pulido del portal**, abiertos desde el 2026-08-24 y que son de esta materia: `preload` de la titular (el `h1` más grande del sitio parpadea de Arial Black a la calcada en cada carga fría) y los originales sobredimensionados (560 px para un hueco de 57). **Los P3 que viven en `quiz.astro` no entran** | `src/components/Cabeza.astro`, `src/styles/sitio.css`, `public/arte/*` | el título no parpadea en carga fría a 375×812 y el peso del portal no sube | tras `T-186` |

### Cierre

| `T-XX` | Rol | Qué | Archivos | Verifica con | `[P]` |
|---|---|---|---|---|---|
| `T-193` | `revisor` | **`REV-10`**: el ciclo entero contra `UX-20` y contra las dos reglas del repo, **en un celular de verdad**. Tres preguntas duras: ¿algo se movió para llamar la atención sobre sí mismo? ¿algo se retrasó abajo del dedo? ¿alguien que apaga el movimiento perdió información? Y la cuarta, que es la del pedido: **¿se siente un lugar, o se siente una web con animaciones?** | `Docs/REVISIONES/REV-10-el-sitio-como-lugar.md` *(nuevo)* | hallazgos `FIND-` con evidencia y el criterio incumplido, y un veredicto explícito sobre la cuarta pregunta | tras todo |
| `T-194` | hilo principal | **`D-32`** queda escrito: *el movimiento es del lugar, no del elemento*, con lo que se probó y lo que se descartó. Y `ESTADO.md` al día — **releyéndolo antes**, que lo escribe también `T-175` del ciclo 10 | `Docs/DECISIONES.md`, `ESTADO.md` | `D-32` cita las tareas que la probaron, y `ESTADO.md` no pisa lo que dejó el otro ciclo | último |

**`[P]` al arrancar:** `T-176`, `T-180`, `T-184`, `T-189`. Cuatro dueños distintos, cuatro
archivos nuevos, ninguna dependencia — y ninguno de los cuatro toca un archivo del ciclo 10.

## La pasada de conflictos

- **`T-190` no es `[P]` aunque parezca**: es de `experiencia` como `T-176`, en otro archivo,
  pero el interruptor tiene que obedecer una doctrina que todavía no existe. Va después.
- **`T-181`, `T-183`, `T-185`, `T-186`, `T-187`, `T-188` y `T-192` tocan `sitio.css`.** Son
  siete tareas sobre la misma hoja: **ninguna es `[P]` entre sí**, y por eso el frente B y el
  C están cortados como cadenas y no como abanicos. Es la restricción real de este ciclo.
- **`T-182` y `T-191` no chocan** —`juego.css` contra `sitio.css`— pero cuelgan de cadenas
  distintas, así que pueden avanzar en paralelo si hay con qué.
- **`T-177` y `T-178` tocan `tokens.css`** uno detrás del otro, nunca a la vez.
- **Con el ciclo 10:** cero archivos compartidos salvo `ESTADO.md`, tratado arriba.

## Los dos tramos

| Tramo | Tareas | Por qué van juntas |
|---|---|---|
| **A** | `T-176`..`T-183` | La doctrina, los tokens, el guardián y el tránsito. Es el tramo que decide si esto es un lugar o son animaciones: si el frente B no cierra, el resto es maquillaje |
| **B** | `T-184`..`T-194` | La atmósfera, los nombres, el sonido, la deuda vieja y la revisión |

Diecinueve tareas. El ciclo 8 fueron quince y el 9 treinta y una, que hubo que partir en dos.
Este está más cerca del 8, y el frente D se puede soltar entero sin romper nada si hay que
achicar.

## Qué quedó afuera, y por qué

- **El adentro de la partida.** El ritmo entre pregunta, respuesta y explicación es el paso
  que más se repite en todo el sitio, y es justo donde el movimiento se convierte en molinete
  más rápido: cualquier tiempo de más se paga cuarenta veces por vuelta. La doctrina se prueba
  primero afuera. Si `REV-10` dice que funciona, el adentro es el ciclo siguiente.
- **`quiz.astro`.** Del otro agente hasta que cierre `T-167`. Entra después, en una tarea de
  una fila, y queda anotado en `ESTADO.md` para que no se pierda.
- **Las fuentes de disco sin tildes.** La deuda declarada de `diseno-marca.md` (JUGÁ, SEGUÍ,
  MITOLOGÍA no existen en las letras calcadas) es tipográfica, no de inmersión, y arrastra
  trabajo de derivar glifos. No la resuelve un ciclo que mueve la cámara.
- **El escritorio.** `UX-10` existe y el sitio es móvil primero. La atmósfera en pantalla
  grande es una mejora real y merece su propia pasada, con `experiencia` decidiendo qué hace
  el aire cuando sobra ancho.
- **Que el sitio recuerde por dónde anduviste.** Una marca tenue en el casete ya jugado sería
  continuidad de verdad, pero toca `producto`: es una regla nueva y roza `D-14`. Va como idea,
  no como fila.
- **Sonido que no sea la cama.** Ni golpes de acierto, ni clics, ni voz. La cama es una capa
  de aire; un sitio que hace ruido cuando lo tocás es otra cosa, y esa otra cosa no se pidió.

## El riesgo del ciclo

**Que la inmersión se convierta en el slop que el proyecto pasó un ciclo entero sacándose de
encima, y que nadie lo note hasta `T-193`.**

El movimiento es lo único de este repo que **no se puede auditar a máquina**. El contraste
tiene test, los estilos tienen test, la voz tiene test — y por eso el sitio está limpio. Pero
ningún test puede decir si una transición se siente como entrar a un lugar o como una web de
plantilla. `T-179` puede exigir que la duración salga de un token; no puede opinar sobre si
la duración está bien.

**La mitigación es de orden, y es la misma que salvó a la corrida anti-slop:** la vara se
escribe antes (`T-176`), no después. Cuando `T-193` revise, no va a estar decidiendo si le
gusta: va a estar midiendo contra un documento que se escribió sin ver el resultado.

**Y el riesgo de al lado, más barato de nombrar y más caro de arreglar:** que el tránsito le
robe medio segundo al dedo. Este sitio promete partidas de dos o tres minutos; el paso más
repetido es tocar y ver. Si `ADR-03` elige mal, la inmersión se paga en la moneda que el
proyecto declaró más cara. Por eso `T-180` es de `arquitectura` y no una línea de CSS
adentro de otra tarea.

## Rangos

Consume `T-176`..`T-194`, `UX-20`, `UX-21`, `CNT-13`, `ADR-03`, `ADR-04`, `D-32`, `REV-10`.
Los `FIND-` de `REV-10` van **después** de los que consuma `REV-09` en el ciclo 10.

Quedan libres: `T-195`+, `D-33`+, `RES-54`+, `US-08`+, `BR-22`+, `CTR-12`+, `UX-25`+,
`CNT-14`+, `REV-11`+, `IDEA-14`+.
