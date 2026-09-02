# UX-22 — La imprenta de Rocambole

> **v2 — corrección tras refutación adversarial, 2026-09-01:** dos revisores leyeron esta
> hoja contra el código ya construido y contra `ADR-05`/`CNT-14`; esta versión cierra los
> catorce hallazgos mayores (pasada muda, sello de crédito en la estampa en vez de en un
> pie roto, techo de 1200 ms justificado, geometría del zoom que se abre, el barrido de
> cada pasada, y las contradicciones internas de `§4`, `§6` y `§8`) y los menores que
> correspondían; el detalle de qué se aceptó y qué no queda en el reporte del encargo, no
> acá — acá solo queda el texto ya corregido.
>
> **v3 — resuelve `FIND-51` de `REV-11`, 2026-09-02:** agrega `§1.4`. El ciclo 12 hizo que,
> al revelar, la vista se desplace sola hacia el premio (la estampa) en vez de hacia el
> botón "Seguí", sin que ninguna hoja lo ratificara. Queda ratificado, acotado a dos
> condiciones que el código de hoy no cumple del todo — una ya construida en
> `partida-tapa.ts` y ausente en `partida-tema.ts`. No reabre el resto de `REV-11`:
> `FIND-46`, `FIND-48`, `FIND-49` y `FIND-50` son de otros roles.

> Rol dueño: `experiencia`. `T-195`, ciclo 12, frente A.
>
> **Consume:** `Docs/ORQ/ORQ-plan-ciclo-12.md` entero (la idea "el sitio no se dibuja, se
> imprime", la corrección de doctrina que pide, las siete cosas que cambian, la fila
> exacta de `T-195` y el mapa de conflictos de `partida-tema.ts`/`juego.css`/`tokens.css`);
> `Docs/UX/UX-20-el-sitio-como-lugar.md` entera (la doctrina de `D-32`, los cuatro
> límites con número de su `§1`, el mapa de atmósfera de su `§2`, lo que nunca se mueve de
> su `§3`, el catálogo de tokens de su `§4`, la tabla de `prefers-reduced-motion` de su
> `§5`, los tres síntomas de fallo de su `§6`); `Docs/DECISIONES.md` `D-14` (molinetes
> abiertos), `D-17` (voseo, sin infinitivo), `D-19` (la mezcla, la base que no rota),
> `D-21` (las tapas reales entran a cualquier pantalla, baja resolución + crédito
> siempre), `D-32` (el movimiento es del lugar, no del elemento); `.claude/rules/
> diseno-marca.md` (el circuito lienzo→`tokens.css`, la tabla anti-slop completa, la
> excepción de barra lateral); `.claude/rules/voz-ricotera.md` (los tres registros, la
> regla de las dos líneas, lo que audita `voz.test.ts`); `Docs/UX/UX-04-sistema-visual.md`
> (las tres formas de tapa real, el piso de legibilidad, el mecanismo de crédito por tipo
> de pantalla, qué colores no tienen su par testeado contra el velo); `Docs/UX/UX-05-
> tapas-en-pantalla.md` (el catálogo por pantalla, el sello de esquina en detalle, el
> crédito de "adiviná el tema" hoy en pie de página); `Docs/UX/UX-13-zoom-de-tapas.md`
> (los diez encuadres, la excepción de agrandado, el punto pendiente de su `§4` — "qué
> pasa al revelar" — que este documento cierra); `Docs/UX/UX-03-reveal-audio-sin-
> auriculares.md` y `Docs/UX/UX-21-el-interruptor-de-cinta.md` (para no chocar con la
> cinta ambiente, que es otra pieza); `public/arte/README.md` y `public/arte/casete.svg`
> (el despiece, qué está prohibido, la forma del cassette dibujado); `Docs/INVESTIGACION/
> INV-02-banda-cultura-estetica.md` `RES-06` (Rocambole: rodillo, serigrafía, aerografía,
> grabado, collage — técnica confirmada, orden de pasadas NO confirmado); y el código,
> leído entero antes de escribir: `src/styles/tokens.css` (las diez paletas de disco
> `--disco-*-tinta`/`-apoyo`, `--papel`/`--papel-borde`, `--velo-tapa*`, `--textura-grano`,
> el bloque de movimiento completo, el corte de `prefers-reduced-motion`);
> `src/scripts/partida-tema.ts` (`cerrarTema`, `pintarRevelacion`, `avanzar`,
> `pintarResultado`, `alternarSonido`, `frenar`, `pintarBarra`, el booleano `sonando`);
> `src/lib/tema/copy.ts` (`REVELACION`, `RESULTADO`, `TARJETA`); `src/lib/tema/audio.ts`
> (`Reproductor.sonar`, siempre desde el arranque del archivo, `D-26`); `src/lib/tema/
> paleta.ts` (`claseDisco`, por qué es una clase y no un color); `src/lib/letra/
> discos.ts` (los diez slugs); `src/lib/sitio/arte.ts` (`fondoTapa`, `discosDe`,
> `DISCO_DE`); `src/lib/sitio/copy.ts` (`PORTAL.creditoTapas`, ya soporta N discos);
> `src/pages/juegos/adivinar-el-tema.astro` (el pie de página con crédito, hoy estático y
> fijo en Lobo suelto); `src/pages/juegos/adivinar-la-tapa.astro` y
> `src/scripts/partida-tapa.ts` (el `figcaption.credito-tapa` **por ítem**, que ya existe
> y ya resuelve el crédito de una tapa que cambia ronda a ronda); `src/lib/movimiento.
> test.ts` (las tres reglas, el mecanismo `token`/`regla`/`recorrido`); `src/lib/
> contraste.test.ts` (qué pares están testeados hoy: `fondo`/`papel`, cada `disco-*-tinta`
> contra `fondo`, ninguno contra `papel`); `src/lib/estilos.test.ts` (el test de "ningún
> estado se comunica solo con color"); y `Docs/SUGERENCIAS/HILO-para-experiencia-desvios-
> del-ciclo-11.md`, leída para contexto — **no la cierro acá**: son preguntas abiertas
> sobre `UX-20`/`UX-21` (el umbral de la portada, el fundido del paso, el interruptor
> durante la partida) y mi tarea es `UX-22`, no una revisión de esas dos hojas. El patrón
> que uso en el `§1` de este documento —techo del paso vs. techo del total— resuelve la
> misma familia de pregunta que el punto 1 y el punto 3 de esa hoja dejan abierta para el
> umbral del portal, pero no la doy por cerrada ahí: la cierra quien la tenga asignada.
>
> **Resuelve:** `T-195`. Fija la corrección de doctrina que pide el ciclo 12 —el acierto
> como único grito, con techo propio—, el mecanismo completo de la estampa (orden, papel,
> registro, mezcla), qué pasa con el fondo, el audio, el objeto que se da vuelta, la cinta
> que gira, la letra de cada disco, el registro imperfecto de toda la página, el rodillo,
> la tirada como afiche, y el zoom que se abre en "Adiviná la tapa". Cada tarea de los
> frentes B, C, D y E del plan (`T-199`..`T-208`) cita un apartado de acá y no necesita
> volver a preguntar. Fija nombres de token. Donde además ilustro un valor concreto (los
> 2 px y los 0,4° de `§2.3`/`§8`) es criterio de referencia para quien lo lleve al lienzo,
> no el valor final: el que manda nace ahí y después vive en `tokens.css`, en el orden que
> fija `.claude/rules/diseno-marca.md`. Los techos de tiempo (400/1200 ms) son otra cosa:
> son un límite que esta hoja sí fija, no un valor de token — dentro de ese límite, el
> número exacto de cada token también nace en el lienzo.

## Cómo leer este documento

Es la hermana de `UX-20`, no su reemplazo. `UX-20` sigue rigiendo entera: los cuatro
límites de su `§1`, el mapa de atmósfera de su `§2`, lo que nunca se mueve de su `§3`. Lo
que este documento agrega es **una única excepción, acotada y con techo propio**, más
seis piezas nuevas que no son movimiento de cámara sino manipulación de un objeto o
señal de un aparato — y por eso necesitaban su propia hoja en vez de una fila más en la
tabla de `UX-20 §2`.

Sobre las fuentes: **todo lo que afirmo sobre la técnica real de una serigrafía —el
orden de las pasadas, por qué la clave va última— es criterio general del oficio, no un
hallazgo sobre Rocambole puntual.** `RES-06` confirma que Rocambole trabaja con rodillo y
serigrafía entre otras técnicas; no confirma en qué orden imprime sus tapas, y no tiene
por qué: eso lo trae `RES-54` (`T-196`, en paralelo con esta tarea). El orden que uso acá
—clara, media, clave, y la clave última porque es el detalle que tiene que quedar nítido
encima de todo lo demás— **ya está en el propio plan del ciclo**, así que no es una
propuesta mía: es un dato que adopto y que `RES-54` viene a respaldar con fuente. Si
`RES-54` trae una corrección, esta hoja se actualiza; hasta entonces, el orden es el que
sigue.

Todo lo demás de este documento —los números de tiempo, la decisión de no corregir el
registro, dónde vive el crédito, qué letra usa cada disco— es **criterio propio de
`experiencia`**, apoyado en decisiones ya tomadas (`D-14`, `D-17`, `D-19`, `D-21`, `D-32`)
y en el código real, citado con archivo.

---

## 1. La doctrina corregida: el acierto es el único grito

`.claude/rules/voz-ricotera.md §7` ya lo decía del texto: *"solo grita el acierto, que es
un grito de verdad"*. `D-32` dice del movimiento: *"nada se mueve para llamar la atención
sobre sí mismo; lo que se mueve es la cámara."* Las dos reglas conviven sin roce en
cualquier pantalla del sitio salvo una: el momento en que "adiviná el tema" revela qué
tapa acabás de ganar. Ahí el ciclo 11 dejó una ficha de texto, sobria y correcta, y el
ciclo 12 la reemplaza por un objeto que se imprime delante tuyo. Eso son varios pasos
seguidos —tinta clara, tinta media, tinta clave, la foto que se fija— y `UX-20 §1.1` topea
**cualquier paso** en 400 ms. Hace falta una excepción, y tiene que tener técho propio
para no ser una puerta abierta a que cualquier otra pantalla se sienta con derecho a
pasarse de los 400 ms porque "esto también es un premio".

### 1.1 El techo, con número

| # | Qué mide | Número | Por qué |
|---|---|---|---|
| A | Cualquiera de los cuatro compases de la estampa (tinta clara, tinta media, tinta clave, el fijado de la foto) | **≤ 400 ms cada uno** | Es el mismo techo de `UX-20 §1.1`. Ninguna pasada individual se comporta distinto de cualquier otro paso del sitio — lo que cambia es que acá hay **cuatro**, no uno |
| B | La secuencia entera, de que arranca la tinta clara a que la foto queda fija | **≤ 1200 ms en total, con la fórmula 3 × `--escalon-pasada` + `--duracion-pasada`** | Es la excepción real, y es la única del sitio |
| C | El fallo: la clave sola | **1 compás, ≤ 400 ms** | No necesita excepción — es un solo paso, dentro del límite normal de `§1.1`. Lo anoto acá para que quede junto a su contraparte, no porque rompa nada |

**De dónde sale la fórmula de B, y por qué no son 1600 ms.** Los cuatro compases no
corren uno atrás del otro: cada uno arranca con un retraso de un `--escalon-pasada` desde
el anterior (la racleta de la media entra mientras la clara todavía está terminando de
barrer), así que el total no es "cuatro compases × 400 ms" sino **el arranque del último
compás (3 × `--escalon-pasada`) más su propia duración (`--duracion-pasada`)**. Con los
valores que ya viven en `tokens.css` (`--escalon-pasada: 240ms`, `--duracion-pasada:
300ms`) da 3 × 240 + 300 = **1020 ms**, debajo del techo.

**Por qué 1200 ms no rompe el argumento de `UX-20 §1.1` sobre el umbral de "esto tarda"
(~1.000 ms).** No es que acá se tolere una espera más larga: es que **no hay espera**.
`§1.2` de este apartado ya lo fija y lo repito acá porque es la base de todo el techo:
`Seguí` es tocable desde el cuadro cero de la revelación, con la tinta que esté
imprimiéndose atrás. Nadie necesita que la estampa termine para seguir jugando — así que
los 1020 ms (o el techo de 1200) no son tiempo que alguien tenga que esperar, son la
duración de un contenido que corre en paralelo con una pantalla que ya es interactiva
por completo. El umbral de "esto tarda" de `UX-20` mide percepción de demora frente a una
acción bloqueada; acá no hay ninguna acción bloqueada que medir.

**Por qué esta es la única excepción que D-32 tolera, y no un precedente.** El resto del
sitio se mueve porque *la cámara* se mueve: el aire, el fondo, la tinta de un tránsito. Acá
lo que se mueve **es la respuesta del juego volviéndose visible**, con la misma lógica que
`D-32` ya usa para no considerar decoración al vuelo de la mosca —*"hace catorce ciclos
que está ahí y es lo único vivo del sitio"*—: la estampa es la sala convirtiéndose en el
disco que sacaste, no un elemento reclamando aplausos. Un botón que se imprime pidiendo
que lo mires es slop. Una tapa entera que se imprime porque la ganaste es el premio. La
diferencia no es de ánimo, es de **qué información transporta el movimiento**: acá
transporta cuál es la respuesta, en el único lugar del sitio donde "cuál es la respuesta"
es además "qué se ve".

### 1.2 Lo que la excepción NO toca

Las otras tres reglas de `UX-20 §1` siguen intactas, sin excepción ni matiz:

- **§1.2 (2 capas de fondo, máximo).** La estampa **no es una capa de fondo**: es
  contenido, es el premio mismo, vive en primer plano dentro de la ficha de revelación.
  El techo de 2 capas sigue contando únicamente el grano + la tapa velada detrás de toda
  la pantalla (`§3` de este documento amplía esto). Con la sala vuelta el disco (`§3`),
  siguen siendo exactamente 2. La imagen que se imprime en la estampa es una tercera
  imagen real en pantalla, y está bien que lo sea — no compite por el mismo presupuesto
  que un fondo atmosférico porque no es atmósfera.
- **§1.3 (0 ms hasta que lo tocable responde).** El botón "Seguí" (o "Mirá cómo te fue" en
  el último tema) sigue siendo tocable **desde el cuadro cero de la revelación**, esté la
  tinta que esté imprimiéndose atrás. Nadie espera 1200 ms para poder avanzar. Es la misma
  regla que ya cumple `pintarRevelacion` hoy (el botón se agrega y recibe foco apenas
  arranca la función, no al final de ninguna animación) y **T-200 no la puede romper**:
  gatear "Seguí" detrás de que termine la estampa es exactamente el molinete con forma de
  animación que `§1.3` prohíbe por nombre.
- **§1.4 (8 % de deriva máxima).** No aplica: la estampa no tiene parallax, no se desplaza
  con el dedo. Queda anotado para que quede claro que no lo necesita, no que se lo saltea.

### 1.3 El fallo: la clave sola

Al fallar (se gastaron los seis intentos), la estampa muestra **una sola tinta: la
clave**, sin clara ni media ni foto. Es lo que una imprenta te deja ver cuando no pagaste
el color — la silueta del detalle, en negro, sobre el mismo papel. Un compás, el mismo
techo de 400 ms que cualquier otra pasada individual, sin excepción de total porque no
hay total que exceder: es un solo paso.

**Por qué la clave y no cualquier otra de las tres tintas.** Porque es la única que no
depende de qué tan saturado sea el disco: es la tinta universal de esta pieza (`§2`
explica de dónde sale su color exacto), así que el fallo se ve consistente entre las diez
tapas — no hay un disco "más generoso" al fallar porque su tinta clara sea más vistosa. Y
porque leyéndolo así, el fallo cuenta la misma historia con cualquier disco: te faltó
plata para el color, acá tenés el trazo.

### 1.4 A dónde mira la pantalla al revelar — resuelve `FIND-51`

`REV-11` encontró un movimiento que esta hoja nunca fijó: al responder, `Seguí` recibe el
foco sin arrastrar la vista (`focus({ preventScroll: true })`) y la vista, en cambio, se
va sola hacia el premio (`scrollIntoView({ block: 'start' })` sobre la estampa en
`partida-tema.ts:897-898`, sobre la figura en `partida-tapa.ts:153-154`). Antes, enfocar
`Seguí` se llevaba la pantalla hasta el botón y **la tapa quedaba impresa fuera de
vista** — el ciclo 12 entero se organiza alrededor de que eso no pase. Es un intercambio
razonado por escrito en el propio código, no un descuido, pero ninguna hoja de
`experiencia` lo había ratificado. Lo ratifico, con dos condiciones.

**Por qué se ratifica: son dos ejes distintos, y `UX-20 §1.3` mide solo uno.** `§1.3` de
esa hoja topea en 0 ms **cuánto tarda en responder** la acción principal, y eso se sigue
cumpliendo a la letra — `Seguí` ya tiene el foco y su `addEventListener` puesto desde el
primer cuadro de la revelación, tocarlo o apretar `Enter` responde de inmediato. Lo que
`FIND-51` señala es otro eje, **dónde queda parado** ese control después de que la
pantalla se movió sola — algo que hasta este ciclo no pasaba nunca: ningún paso anterior
del sitio desplazaba el viewport sin que el dedo lo pidiera. `UX-20 §1` no lo mide porque
no existía; esta hoja lo fija ahora, acá, sin tocar ninguno de los cuatro límites de
`UX-20 §1`.

**El argumento a favor es el mismo que sostiene todo `§1`:** la estampa es el premio, el
único grito del sitio, y un premio impreso fuera de la vista no es un premio. Para quien
navega con teclado, con switch o con lector de pantalla el cambio es una mejora sin
costo — el foco ya está en `Seguí`, nadie recorre nada de más con `Tab`. El costo es del
pulgar, y el dato medido lo acota: a 375×812, con la figura a 320 px más su crédito, el
panel de devolución arranca cerca del borde de abajo — el botón queda a **un
desplazamiento corto**, no a media pantalla, y en la misma dirección en la que la persona
ya venía leyendo. Un gesto de pulgar, no una búsqueda con las dos manos.

**Condición 1 — la excepción vale solo cuando hay premio de verdad.** Si el disco no es
uno de los diez y no hay estampa que imprimir, no hay premio que mirar, y la pantalla
tiene que volver al comportamiento genérico de cualquier otra revelación de texto del
sitio (el que ya usan el quiz y "sacalo por la letra", `partida.ts:335`): el foco se lleva
la vista consigo, sin `preventScroll` — `seguir.focus()`, sin más. **`partida-tapa.ts` ya
cumple esto**: el `if (seImprimio) {...} else { seguir.focus(); }` de sus líneas 152-157
es exactamente esta condición. **`partida-tema.ts` no lo cumple**: `pintarRevelacion`
llama `revelacion.scrollIntoView({ block: 'start' })` siempre, aunque `armarEstampa` haya
devuelto `null` porque el tema es de un disco fuera de los diez — en ese caso no hay nada
que mirar y la pantalla igual se desplaza sola, sin ninguna razón que lo justifique. No es
una lectura válida de esta excepción, es el defecto que la deja sin acotar: pido que se
corrija para que el par `preventScroll`/`scrollIntoView` corra únicamente cuando
`armarEstampa` no devolvió `null`, calcado del patrón que `partida-tapa.ts` ya tiene.

**Condición 2 — la vista apunta al premio, no al panel entero.** Lo que hay que mirar es
la imagen, no la ficha completa de revelación con su título, su costo y lo que venga
después. `partida-tapa.ts` ya apunta bien: `scrollIntoView` corre sobre
`.figura-tapa-juego`, no sobre `zonaPartida`. `partida-tema.ts` apunta a `revelacion`, el
contenedor entero — hoy la diferencia práctica es chica porque la estampa es casi el
primer hijo de ese contenedor, pero es la regla incorrecta: si algún día se agrega
contenido antes de la estampa, el blanco tiene que seguir siendo la imagen, no lo que la
precede. Pido que apunte al elemento que devuelve `armarEstampa`, no a `revelacion`.

**Lo que esta hoja no fija.** Un techo en píxeles o en porcentaje de viewport para la
distancia entre el premio y `Seguí`. No lo invento: el dato de `REV-11` es sobre "Adiviná
la tapa" con un panel liviano, y no cubre el caso más cargado de ninguna de las dos
pantallas — un tema con reproductor del tema entero *y* enlace a la letra, o una tapa con
explicación larga *y* sello de leyenda o testimonio, todo apilado entre la imagen y el
botón. Antes de dar esto por cerrado del todo, quien construya mide esos dos casos a
375×812 con las condiciones 1 y 2 ya aplicadas, y confirma que "Seguí" sigue quedando a un
desplazamiento corto. Si no lo está, la salida no es agrandar el número de esta hoja: es
acortar el panel — por ejemplo, moviendo el reproductor o el enlace a la letra a después
de `Seguí` — antes de tocar esta regla otra vez.

---

## 2. Cómo se imprime la estampa: orden, papel, registro, mezcla

### 2.1 El objeto, separado del texto que ya existe

**La estampa es un objeto nuevo dentro de la ficha de revelación, no un cambio de fondo
de toda la ficha.** El título del tema, la línea de disco/año/pista, los puntos y el
costo (`REVELACION.ficha`, `REVELACION.puntos`, `REVELACION.costo`) **siguen exactamente
donde están hoy**, con la misma tinta de disco sobre `--fondo`, **y sobre nada más** —es
el único par testeado (`contraste.test.ts`: las tintas de disco *no* llegan a AA sobre
`--fondo-elevado`; el naranja quemado de *La mosca y la sopa* da 4,32:1, debajo del piso.
Si algún día la ficha de revelación se apoyara sobre el fondo elevado, el título en tinta
de disco perdería su contraste, así que esta hoja no lo pide ni lo va a pedir). Lo que se muda a papel es
únicamente la imagen: un rectángulo nuevo, del porte de una etiqueta de casete, que es
donde vive la impresión.

**Por qué esta separación no es un capricho, es la única forma de no romper contraste.**
Si todo el panel de revelación pasara a fondo `--papel` (claro), el título en la tinta del
disco —elegida para leerse sobre `--fondo` **oscuro**— perdería su contraste de un
plumazo, y ese par no está testeado contra `--papel` en ningún lado. Mantener el texto en
su fondo de siempre y mudar solo la imagen evita inventar un par nuevo de un lado, y del
otro respeta lo que `UX-04` ya advirtió sobre `--acento` y el velo: **un color elegido
para un fondo no se reusa gratis sobre otro fondo.**

### 2.2 El orden de las pasadas, y sobre qué

Sobre `--papel` (el mismo papel de etiqueta de casete que ya usa el collage, `tokens.css`
— **no** uno nuevo), en este orden, cada una un compás de la escalera del `§1.1`:

1. **Tinta clara.**
2. **Tinta media.**
3. **Tinta clave** (negra).
4. **El fijado**: la foto real.

Cada una de las tres pasadas de tinta **no es un rectángulo liso**: es la misma foto de
320 px separada por tono — la zona clara de la imagen entintada con la tinta clara, la
zona media con la media, el detalle oscuro con la clave — así que apilarlas de verdad
**arma** la imagen en vez de sugerirla. No hay una cuarta imagen escondida detrás: al
completarse la pasada clave, lo que hay en pantalla ya es una reproducción reconocible de
la tapa, en hasta tres tonos planos, como una serigrafía barata de verdad — "hasta tres"
porque en dos de los diez discos una de las tintas es muda (ver más abajo). **"El fijado"
es que, recién ahí, la foto real —la misma ficha JPEG de `public/tapas/<slug>.jpg` que ya
existe hoy y no hay que generar de nuevo— entra encima a color completo**, con el mismo
verbo que usa un revelado fotográfico: se fija, deja de ser provisoria, no cambia más.

**Cada pasada llega por un barrido, nunca por un fundido.** Es la racleta arrastrando la
tinta de un borde de la estampa al otro —un `clip-path` que avanza—, y la opacidad no
entra en ninguna de las cuatro animaciones de este apartado. No es un detalle de
implementación: es la corrección que `REV-10` (`FIND-39`) ya dejó escrita sobre el umbral
de la portada del ciclo 11 —*"el fundido de entrada es el tic de plantilla número
uno"*— y acá se aplica desde el primer cuadro para no repetir el mismo defecto en la
pieza central de este ciclo. El fijado de la foto usa el mismo mecanismo: entra de arriba
a abajo por barrido, como la hoja que sale de la prensa, no por opacidad.

**Las tres pasadas se apilan sobre `--papel`, y esa pila tiene que quedar aislada del
resto de la página.** `mix-blend-mode: multiply` (`§2.4`) mezcla con lo que hay *debajo en
el mismo contexto de apilamiento*, y sin `isolation: isolate` en el contenedor de la
estampa esa mezcla podría filtrarse contra lo que sea que esté detrás en el documento, no
solo contra `--papel`. Es una condición de construcción, no una decisión de diseño nueva,
pero queda dicha acá porque es la que hace que "tinta translúcida sobre papel" sea
literalmente eso y no una mezcla accidental con el resto de la pantalla.

**De dónde sale el color de cada pasada — el principio, no el algoritmo.** El algoritmo
exacto de separación es de `ADR-05` (`T-197`); lo que fijo acá es la regla que esa
conversión tiene que respetar:

- **Clara y media** salen de `--disco-<slug>-tinta` y `--disco-<slug>-apoyo`, **ordenados
  por luminancia real, no por cuál de los dos ya pasa contraste como texto**. El más
  claro de los dos es la pasada clara; el más oscuro, la media. No hay un texto legible
  encima de la imagen en este uso —es relleno de una máscara, no una palabra— así que el
  criterio AA de `contraste.test.ts` **no aplica acá**: esos dos colores no necesitan un
  par nuevo testeado, y no lo tienen que tener.
- **Clave es siempre `--fondo`**, la tinta base del sitio entero, para los diez discos por
  igual. No es un color medido de cada tapa — es la tinta universal de la imprenta, la
  misma con la que el sitio entero ya escribe sobre `--papel` (`contraste.test.ts`: "tinta
  sobre papel de etiqueta", el par `fondo`/`papel`, **ya testeado**). Es la razón por la
  que el fallo (`§1.3`, una sola tinta clave) no necesita ningún par de contraste nuevo:
  reusa exactamente ese.

**La pasada muda, y por qué se imprime igual.** En dos de los diez discos, uno de los dos
colores medidos casi no se distingue de lo que tiene detrás: la clara de *Gulp!* es del
color del papel (`--papel` `#ede4ce` contra su apoyo `#e6e4bd`, 1,02:1) y la media de
*Cordero atado* es del color de la clave (su apoyo `#030d0b` contra `--fondo` `#14100e`,
1,04:1) — los dos casos, con cálculo y número, ya están en `ADR-05.2`, que fija el umbral:
por debajo de **1,5:1** contra el papel o contra la clave, una tinta es **muda**. No
cambia el ritmo de la impresión: **se imprime en el mismo compás y con el mismo tiempo que
las demás**, no se saltea y no se acelera la secuencia para esos dos discos. Dos motivos,
uno de cada lado: el tiempo de la impresión es del lugar, no del contenido (`§1.1`), así
que dos discos no pueden imprimir más rápido que los otros ocho sin que el ritmo mismo se
vuelva una pista sobre qué disco es; y en serigrafía real una tinta muda **no es una
falla**, es lo que pasa cuando una tapa tiene poco contraste entre dos de sus zonas — la
técnica se sigue viendo, solo que con menos escalones visibles. *Gulp!* se lee en rojo y
negro sobre crema; *Cordero atado*, naranja sobre negro. Las dos siguen siendo la tapa.

### 2.3 El registro corrido

Cada una de las tres pasadas de tinta se imprime con un desvío fijo respecto de las
otras: **2 px de corrimiento y ~0,4° de rotación**, siempre en la misma dirección (no
aleatorio pasada a pasada — es una sola imprenta un poco desalineada, no tres tiradas
independientes). Es la imperfección real de una serigrafía barata: ninguna pasada cae
exactamente donde cayó la anterior.

**El registro no se corrige nunca, ni siquiera al fijar la foto.** Dos razones, y son la
misma que la del `§8` de este documento (el registro imperfecto de toda la página): una
serigrafía real no se corrige después de impresa —eso sería falsear la técnica que se
está citando—, y además es gratis: en cuanto la foto real se fija encima a color
completo, tapa el desvío de las tres tintas de abajo sin que nadie tenga que animar una
corrección. El desvío queda, técnicamente, debajo de la foto para siempre; nadie lo vuelve
a ver, y nadie tuvo que programar que desapareciera.

### 2.4 La mezcla: `mix-blend-mode: multiply`

Las tres pasadas de tinta se apilan con `mix-blend-mode: multiply` sobre `--papel`. Es la
forma correcta de simular tinta real: cada capa solo puede oscurecer lo que tiene debajo,
nunca aclararlo — igual que la tinta de verdad no puede imprimir "más clara que el papel".
La cuarta capa (la foto real, a color completo) va **sin** `multiply`, en opacidad normal:
no es tinta, es la fotografía que ya terminó de imprimirse.

### 2.5 El crédito

**No lleva un sello propio en la estampa.** El crédito a Rocambole (Ricardo Cohen) de la
tapa que se imprimió lo cubre el mecanismo que ya existe para esta pantalla: el pie de
página (`footer.pie-sitio`, `credito-tapas`, `PORTAL.creditoTapas`) que hoy dice
"Arte de tapa: Lobo suelto — Rocambole (Ricardo Cohen)" de forma **estática**, calculada
en build a partir del fondo fijo de la sección. Con la estampa —y con la sala volviéndose
el disco, `§3`— ese pie **tiene que dejar de ser estático**: `T-200`/`T-202` lo recalculan
en el navegador, sumando cada disco que efectivamente se imprimió o vistió el fondo
durante la sesión, deduplicado, con el mismo patrón de texto que `PORTAL.creditoTapas` ya
soporta para más de un disco. No hace falta un mecanismo nuevo — el que hay ya sabe listar
varios nombres; lo que falta es que alguien lo llame de nuevo cuando cambia lo que hay en
pantalla, en vez de solo una vez en build.

---

## 3. La sala se vuelve el disco

Al acertar, `.tapa-fondo` —hoy siempre la tapa de Lobo suelto, fija, porque toda la
pantalla de "adiviná el tema" viste mitología (`D-19`)— pasa a mostrar **la ficha de 320
px del disco que acabás de sacar**, velada igual que hoy (mismo `--velo-tapa`, cero
archivos nuevos: es la misma ficha que ya usa la Redondopedia). Dura hasta que arranca el
tema siguiente; ahí vuelve a Lobo suelto.

**Duración del cambio: `--duracion-paso` (200 ms), la misma que ya gobierna cualquier
cruce de pantalla (`ADR-03 §6.2`).** No hace falta un token nuevo: es exactamente el
mismo gesto de cámara —un lugar reemplazando a otro— aplicado a un fondo en vez de a una
pantalla entera, así que reusa el nombre que ya existe en vez de inventar uno con el
mismo significado.

**Al fallar, no cambia.** La sala se queda en Lobo suelto. Es la aplicación literal de
`§1.3` del ciclo 11: el estado de error nunca se tiñe con el disco del lugar, y acá el
"disco del lugar" en el momento del fallo sigue siendo el de la sección (mitología), no
un disco que nunca sacaste.

**Por qué esto no rompe el techo de 2 capas.** Antes y después del cambio siguen siendo
exactamente dos capas: grano (constante) + una tapa velada (que cambia de cuál tapa es,
no de cuántas hay). `UX-20 §1.2` prohíbe **acumular** una tercera capa real, no
**reemplazar** cuál es la segunda. Es la misma distinción que ya usa el mapa de `UX-20
§2` cuando dice que la ficha del tema revelado (adentro de la estampa, `§2` de este
documento) es contenido, no fondo: acá pasa lo mismo con la capa de atrás.

**El crédito, otra vez.** Ver `§2.5`: mientras la sala viste el disco acertado, el pie de
página tiene que decirlo, sumado a lo que ya diga por la estampa — un solo pie, un solo
recálculo, todos los discos que aparecieron esa sesión en una sola línea.

---

## 4. El acierto suena entero

**Solo si la persona tuvo el audio prendido en algún momento de ese tema** —es decir, si
tocó "Escuchá" al menos una vez antes de arriesgar—, al acertar el fragmento de diez
segundos reales (`D-26`) arranca solo, con `reproductor.sonar()`, y corre en paralelo con
la estampa imprimiéndose. Si nunca tocó "Escuchá" en ese tema —contestó a ciegas, por
ejemplo reconociendo el título por otra vía—, **no suena nada**: el molinete de `UX-03` no
se da vuelta después de jugarse. Quien jugó sin pedir sonido no recibe sonido que no
pidió.

**Al fallar, nunca suena nada automático**, tuviera el audio prendido o no. Es la
aplicación literal del `§1` de este documento: el acierto es el único grito, y eso
incluye el grito sonoro, no solo el visual. El botón "Escuchalo entero" (para el tema
completo en mp3, `D-22`) sigue disponible después, como hoy — esto no lo toca, es otro
sonido, a pedido explícito.

**El gesto que habilita la reproducción es el mismo tap que responde.** Los navegadores
móviles exigen un gesto explícito antes de reproducir audio (`UX-03` ya lo aprovecha para
el aviso de entrada); acá el gesto es el mismo toque en "Arriesgá" o el Enter que dispara
`arriesgar()` — no hace falta un segundo gesto ni una confirmación aparte.

**Convivencia con el casete que gira (`§6`).** Si el casete ya estaba visible en pantalla
—porque la persona usó "Escuchá" en algún paso de ese tema, que es exactamente la misma
condición que habilita este punto—, sigue en su lugar y sus carretes vuelven a girar
mientras suenan estos diez segundos, con el mismo mecanismo de `sonando`/`alTerminar` que
ya usa `alternarSonido`. No aparece un casete de la nada solo para este momento: si nunca
lo usaste, nunca lo viste, y por eso tampoco suena nada al acertar.

---

## 5. Dala vuelta

La estampa impresa es un objeto: se toca y se da vuelta, y aparece la trasera real de esa
tapa (la que `T-197`/`T-199` dejan como cuarta forma de `D-21`), con la pista que sacaste
estampada como sello.

**El giro 3D está permitido, y no es una excepción a la tabla anti-slop.** Esa tabla veta
el *hover* que levanta una tarjeta y el micro-rebote — dos formas de que un elemento se
mueva **sin que nadie lo haya tocado**, para llamar la atención sobre sí mismo. Este giro
es lo contrario en las dos cosas que importan: **lo inicia la persona con un tap
explícito**, y no reclama nada — es la respuesta de un objeto físico a una acción física
(dar vuelta un disco), el mismo tipo de manipulación que ya justifica el `120 ms` del
borde de `.opcion` como información y no como atmósfera. Girar un objeto que se acaba de
imprimir para ver la contratapa es, literalmente, lo que hace cualquiera con un disco
real en la mano.

**Duración: un paso — token nuevo, `--duracion-giro`, mismo techo de `UX-20 §1.1` (≤ 400
ms).** No reuso `--duracion-paso`: ese token está atado semánticamente al tránsito entre
documentos (`ADR-03`) y a su propio techo más chico (200 ms); esto es una manipulación
local, adentro de la misma pantalla, y merece su propio nombre aunque comparta la misma
lógica de techo. **No es la excepción del `§1` de este documento** — es un paso normal,
uno solo, dentro del límite de siempre.

**Equivalente sin movimiento: cambio directo.** Con `prefers-reduced-motion: reduce`, no
hay rotación — la cara visible cambia de frente a dorso (o viceversa) en el mismo cuadro,
sin interpolación. Ninguna información se pierde: lo que había para ver de un lado y del
otro sigue exactamente igual, solo que sin el giro de por medio.

**Nombre accesible.** El control es un `<button type="button">` (no un `div` con
`onclick`), con `aria-pressed` (`false` mostrando el frente, `true` mostrando el dorso) —
mismo patrón que ya usa el interruptor de la cinta (`UX-21 §4`). El texto del `aria-label`
y de cualquier rótulo visible lo redacta `contenido` en `CNT-14` (`T-198`), pero tiene que
ser un par de imperativos voseados, sin infinitivo y sin puntos suspensivos —el molde que
ya anticipa el propio plan del ciclo: **"Dala vuelta"** para mostrar el dorso, **"Volvé a
la tapa"** para volver al frente. Los dos pasan las siete reglas de `voz.test.ts` tal como
están escritos acá (ninguno pasa las ocho palabras, ninguno es infinitivo, ninguno lleva
"...").

**El crédito en el dorso.** La trasera es una tapa real (`D-21`): lleva el mismo crédito
que la estampa, cubierto por el mismo pie de página recalculado del `§2.5` — no hace
falta una segunda línea de crédito por mostrar la otra cara del mismo disco.

---

## 6. La cinta gira

El casete de `public/arte/casete.svg`, en línea dentro de la pantalla de partida (no como
imagen de fondo), con sus dos carretes girando **mientras suena el fragmento** —tanto
durante `alternarSonido()` en cualquier paso de la escalera como durante el "acierto suena
entero" del `§4`— y quietos apenas frena, por cualquier motivo: se terminó el fragmento,
se tocó "Pará", se gastó un intento.

**Es señal diegética, y es información, no atmósfera.** `UX-03` ya identificó el problema
que esto resuelve: quien no escucha nada —volumen bajo, llave de silencio del iPhone,
auriculares que no responden— no tiene forma de saber si el silencio es del sitio o del
aparato. Ver los carretes girar es la confirmación visual de que el sitio **está**
sonando, aunque el oído no lo reciba. Por eso esta pieza no entra en la lista de "lo que
nunca se mueve" del `§12`: no es decoración, es la contraparte visual de un evento sonoro
real, con el mismo estatus que el borde de `.opcion` (información, no clima).

**Solo los carretes giran, no la carcasa entera.** El cassette dibujado se queda quieto;
lo que gira son las dos ruedas dentadas (los `circle` de `casete.svg`, hoy sin `id`
propio — quien construya `T-204` necesita inlinear el SVG o agregarle identificadores a
esas dos piezas, porque un `<img src="casete.svg">` no deja animar partes internas por
separado). Girar la carcasa entera leería como un ícono bailando, que es justo lo que la
tabla anti-slop prohíbe con otro nombre.

**Duración: token nuevo, `--duracion-carrete`, una vuelta completa del carrete.** Es una
animación en bucle mientras `sonando === true`, mecanismo `regla` en el vocabulario de
`movimiento.test.ts` (como `vuelo-de-mosca`): no se apaga bajando su duración a cero —
quedaría girando rapidísimo—, se apaga con `animation: none` bajo `prefers-reduced-
motion`.

**Dónde vive:** junto al botón "Escuchá"/"Pará" (`botonEscuchar`), en la misma fila —
nunca reemplazando ese botón ni corriéndolo de la zona donde ya está, y sin retrasar en
absoluto cuándo ese botón (o el buscador, o "Arriesgá") se vuelven tocables (`UX-20
§1.3`).

**El equivalente con movimiento reducido: una palabra, siempre presente.** No solo bajo
`prefers-reduced-motion` — **la palabra vive ahí siempre**, para quien tiene el movimiento
prendido y para quien no. Con movimiento prendido, la persona ve girar los carretes **y**
lee la palabra; con movimiento apagado, ve solo la palabra, quieta, junto al casete
congelado. Así ninguna información depende de que el movimiento esté habilitado, que es
exactamente el objetivo de `UX-20 §5`. La palabra la escribe `contenido` en `CNT-14`
(`T-198`); yo fijo dónde va —una línea chica, `--fuente-rotulada`, `--texto-tenue`, pegada
al casete, presente solo mientras `sonando === true` y ausente el resto del tiempo— y la
condición que no se negocia: **la presencia o ausencia de la palabra es la señal, nunca
un cambio de color del borde del casete sin acompañarla.** Cambiar solo el tinte del
cassette para decir "está sonando" sería exactamente el defecto que ya audita
`estilos.test.ts` para acierto y error, aplicado acá.

---

## 7. El disco en sus letras

Donde el nombre de un disco aparece como rótulo corto y grande —el caption de la
estampa una vez fijada la foto, y el `h1` de la ficha de disco de la Redondopedia
(`§9`)—, se escribe en la letra real de ese disco si existe, y en `--fuente-rotulada` si
no:

| Disco | Letra |
|---|---|
| Oktubre | `--fuente-titular` (Oktubre Calco) |
| Lobo suelto | `--fuente-marca-firma`... no — **`Lobo Suelto Fan`** (ver nota) |
| Cordero atado | `Lobo Suelto Fan` (mismo alfabeto, `RES-36`: es un solo sistema diseñado para los dos volúmenes) |
| Los otros siete | `--fuente-rotulada` (Archivo Black) |

**Nota sobre la fuente de Lobo suelto/Cordero atado:** `tokens.css` la declara como
`'Lobo Suelto Fan'` (`@font-face`, línea 26-30) — no hay una variable `--fuente-*` que la
nombre todavía porque hasta este ciclo nadie la usaba fuera del alfabeto de mitología
suelto en otras piezas. `T-207`/`T-200` agregan la variable que falta (ver `§13`,
catálogo de tokens) en vez de escribir el nombre de familia a mano en un componente —eso
sería el mismo defecto que un hex suelto, aplicado a tipografía.

**Confirmación de coherencia con la deuda declarada en `diseno-marca.md`.** Esa regla dice
que las letras con tilde (JUGÁ, SEGUÍ, MITOLOGÍA) no existen todavía en las fuentes de
disco, y que mientras tanto esas palabras van en `--fuente-rotulada` — nunca se les saca
la tilde para que entren. Los tres nombres de esta tabla no chocan con esa deuda: **OKTUBRE**,
**LOBO SUELTO** y **CORDERO ATADO** no llevan ni un acento ni una Ñ, así que entran
enteros en sus letras reales sin tocar ninguna tilde. La regla no se relaja acá — simplemente
no hace falta relajarla, porque ninguno de los tres nombres la pone a prueba.

---

## 8. El registro imperfecto en toda la página

El mismo desvío que describe `§2.3` —2 px de corrimiento, ~0,4° de rotación, siempre en
la misma dirección— se aplica, como recurso permanente y **estático**, a la letra grande
de todo el sitio: la marca, los títulos de casete, el `h1` de cada juego, los títulos de
artículo de la Redondopedia. Detrás de la tinta real de ese texto (la que ya está
testeada y se queda exactamente igual), aparece un eco del mismo texto, corrido y
rotado, en el color de **apoyo** del disco de esa sección (`--cat-*-apoyo` o
`--disco-*-apoyo`, según corresponda).

**Es estático: no es movimiento.** No entra al catálogo del `§13` como duración ni pasa
por el corte de `prefers-reduced-motion` — no hay nada que apagar porque nunca estuvo
animado. Es tipografía con una segunda tinta fantasma detrás, igual que una imprenta
barata que no calzó bien el segundo color.

**No hace falta un par nuevo en `contraste.test.ts`.** El eco no es la tinta que se lee:
va **detrás** de la tinta real (que sigue siendo la que ya pasa AA sobre su fondo de
siempre), a modo de sombra de registro — el mismo estatus que ya tienen los colores
`-apoyo` en `tokens.css` ("NO se usa como texto, no entra al test"). Nadie lee el eco
para enterarse de nada: lee la tinta de encima, que no cambió.

**No confundir con las rotaciones que ya existen en `sitio.css`.** Los `rotate(-1.6deg)`,
`rotate(-2deg)`, etc. que ya usan las estampas de goma (`.casete-accion`, `.categoria`,
etc.) son un recurso distinto —un objeto entero, torcido, pegado— y no se tocan. El
registro de este `§8` es una **sombra de segunda tinta**, más sutil (0,4° contra 1,6-3°),
y vive solo detrás de letra grande, nunca en un objeto de goma entero.

### Dónde sí, dónde no

| Se aplica | No se aplica, nunca |
|---|---|
| Marca del sitio (`.marca`, `.marca-grande`) | Cuerpo de texto: enunciados, opciones, párrafos, ficha de disco/año/pista |
| Título de casete, subtítulo corto que canta (registro 1) | `LEYENDA` / `TESTIMONIO`, cualquier rótulo de registro 3 |
| `h1` de cada juego | Estados de acierto (`--acento-3`) o error (`--acento-4`) |
| Título de artículo de la Redondopedia (`h1` del artículo) | Las tres pantallas graves: Bulacio, Olavarría, la muerte del Indio — ni la letra grande de esas páginas lleva registro |

---

## 9. El rodillo y la ficha estampada, quieta

**El rodillo (`--textura-rodillo`).** Una textura SVG nueva, alfa únicamente —mismo
principio que `--textura-grano` (turbulencia sin color propio, se apoya sobre cualquier
fondo)—, pero con un patrón de arrastre horizontal en vez de grano fino: la marca que deja
un rodillo entintado al pasar, no la de una hoja de papel fotográfico. Se usa como
separador horizontal, delgado, entre grupos lógicos de una página larga: en el portal,
entre la franja de marca y la lista de casetes (o entre el grupo de los cuatro juegos y el
casete de la Redondopedia, si el maquetado ya los separa así); en el índice de la
Redondopedia, entre categorías si el índice las agrupa por tipo, o cada tanto si no. La
posición exacta la elige `T-208` mirando el maquetado real de cada página — lo que no se
negocia es que sea **una textura, coloreada por `currentColor` del lugar donde vive**, y
nunca una `<hr>` lisa ni un degradado (la tabla anti-slop lo prohíbe por nombre).

**No lleva crédito.** Es un motivo genérico de la técnica —como `casete.svg`, per el
propio `public/arte/README.md`—, no un recorte de ninguna tapa puntual: no hace falta
firmarlo.

**La ficha de disco de la Redondopedia, estampada — y quieta.** Cada uno de los diez
artículos de disco (`UX-05 §7a`) gana el mismo lenguaje visual —papel, sello de crédito,
sombra de registro (`§8`)— alrededor de la imagen que ya muestra hoy. **Lo que no gana es
la separación en tres tintas.** La estampa por pasadas tiene sentido donde hay una acción
de imprimir para mirar —el reveal de "adiviná el tema", el zoom que se abre en "adiviná
la tapa" (`§11`)—; acá el disco ya está impreso hace rato, así que lo que se estampa es
**el marco** (papel, sello, sombra de registro), no la fotografía de adentro, que sigue
siendo el mismo JPEG a color completo que ya existe. Reprocesar diez imágenes más en tres
tonos para una pantalla que no las anima sería trabajo sin premio.

**Por qué queda quieta, sin discusión.** `UX-20 §2` ya lo dijo para toda la Redondopedia:
*"un artículo no se mueve"*. Nada de este ciclo lo revisa. La ficha se ve como recién
impresa —papel, registro, sello— pero llegó así desde el primer cuadro: ni pasadas, ni
fijado, ni ninguna de las duraciones del `§13` la tocan.

---

## 10. La tirada como afiche

El resumen de la vuelta (`pintarResultado`, la lista `<ol class="resumen">` de los cuatro
temas) gana dos cosas: **cada tema lleva su tapa como estampa chica** —a color, las tres
tintas ya fijas con la foto encima, si lo sacaste; en una sola tinta (la clave, igual que
el `§1.3`) si no lo sacaste— reemplazando o acompañando al símbolo ✔/✕ que ya existe (el
símbolo se queda: sigue siendo la señal que no depende de color). Y la lista entera se
maqueta como un afiche de recital: el número grande (el tiempo, que ya es el protagonista
de esta pantalla) arriba, la lista de temas debajo con la tipografía y el pegado
ligeramente torcido que ya usa el resto del collage del sitio (`RES-06`: Rocambole hizo
afiches además de tapas, es la misma mano).

**Qué es un afiche acá, y qué no.** Es **maquetado y tipografía**: jerarquía de tamaño
(el tiempo domina, el detalle es la lista), una leve rotación por ítem (el mismo recurso
que ya usan las estampas de goma del sitio, no uno nuevo), y las cuatro tapas chicas como
las estampas que serían el sello del sobre de un recital real. **No es una imagen nueva**:
no hay un fondo fotográfico de afiche, no hay una composición que citar de ningún afiche
real de la banda —`RES-06` confirma que Rocambole hizo afiches, no describe uno puntual
que este sitio pudiera citar sin inventar—, y **no se anima**: es un layout estático, la
misma regla del `§9` para la ficha de disco. El "afiche" es un lenguaje de maquetado, no
un artefacto gráfico prestado.

**Las cuatro estampas chicas no llevan crédito propio.** Cuentan para el pie de página
recalculado (`§2.5`): cada disco que aparece en el resumen suma su nombre a esa línea
si todavía no estaba, mismo mecanismo, una sola vez por disco aunque aparezca en el
fondo, en la estampa grande y en el resumen.

---

## 11. El zoom se abre en "Adiviná la tapa"

Cierra la pieza que `UX-13 §4` dejó pendiente por escrito: *"el premio del formato splash
es ver la obra entera después de adivinar por un pedazo, y hoy no se puede [...] es la
pieza que falta [...] cuando exista, esta tabla no cambia: se le agrega la ruta del
entero al lado de la del zoom."* Al acertar, el recorte fijo con el que se jugó (uno de
los diez encuadres catalogados en `UX-13 §3`, entre 210 y 591 px del máster) **se abre**:
el resto de la tapa llega por las mismas pasadas del `§2` de este documento —clara, media,
clave, fijado— hasta completar la tapa entera. Al fallar, la clave sola (`§1.3`), también
sobre el recorte: nunca se completa la tapa de un ítem que no se acertó.

**No es un mecanismo nuevo: reusa entero el del `§1`/`§2`.** El punto es del encuadre que
ya tenías mirando (el que eligió `UX-13`) hacia afuera, no un mecanismo distinto —los
mismos techos de tiempo, el mismo papel, el mismo registro, la misma regla de que "Seguí"
sigue tocable desde el cuadro cero.

**Convivencia con `UX-13`.** `UX-13 §2` fija la única excepción de todo el sitio a "nunca
agrandar" —el zoom del enunciado agranda un recorte de hasta 210 px a lo que ocupe en
pantalla, porque en un juego de zoom el grano es el género—. Esa excepción sigue rigiendo
mientras se juega. Lo que cambia al acertar es que **deja de haber zoom**: la tapa entera
se imprime a su tamaño de ficha real (320 px, sin agrandar), así que la excepción de
`UX-13` no se extiende al resultado — el resultado es una ficha normal, del tamaño que
cualquier otra ficha del sitio.

**Convivencia con el crédito, y por qué acá no hace falta ningún mecanismo nuevo.** Esta
pantalla **ya** resuelve su crédito, y lo resuelve mejor que el resto del sitio para este
caso puntual: cada ítem trae su propio `figcaption.credito-tapa`
(`partida-tapa.ts`, `PARTIDA.credito(item.imagen.credito.autor)`), pegado a la misma
`<figure>` que contiene la imagen. Cuando el recorte se abre a la tapa entera, la
`<figure>` sigue siendo la misma, y el `figcaption` sigue siendo el mismo — no hay que
mover nada ni recalcular nada, solo confirmar que `T-206` no lo borra ni lo reemplaza al
cambiar el contenido de adentro.

---

## 12. Lo que nunca se estampa

Extiende `UX-20 §3` con lo que la imprenta agrega, sin tocar nada de lo que ya estaba:

1. **Los rótulos** (`LEYENDA`, `TESTIMONIO`, la ficha `RES-`, `.marca-rotulo`,
   `.articulo-tipo`) siguen sin atmósfera de ningún tipo — y ahora, explícito: **tampoco
   llevan registro imperfecto (`§8`)**. Un rótulo con una sombra de segunda tinta detrás
   deja de leerse como el piso firme que sostiene el misterio.
2. **Los estados de acierto y error** (`--acento-3`, `--acento-4`) no se imprimen, no
   llevan papel de fondo ni registro. Siguen siendo símbolo + color + borde, sin
   disfrazarse del disco de la sección ni de la tinta de ningún disco puntual.
3. **Los símbolos funcionales** (✔, ✕, ◆, ❝) siguen estáticos, sin pasada ni sombra de
   registro.
4. **Las tres pantallas de registro 3** —Bulacio, Olavarría, la muerte del Indio— **la
   pantalla entera**, otra vez: sin papel, sin pasadas, sin registro imperfecto en su
   letra grande (aunque el resto de la Redondopedia sí lo tenga desde `§9`), sin rodillo
   como separador aunque el índice que lleva a ellas sí lo use. Es la misma fila de
   `UX-20 §3.4`, ahora también a prueba de imprenta.
5. **Nuevo de este ciclo: la tarjeta que se comparte.** `D-21` ya lo dice para cualquier
   tapa real —afuera del sitio viaja sin su crédito—, y el plan del ciclo lo repite en su
   sección "qué queda afuera": la tarjeta no gana estampa ni registro. Sigue siendo la
   pieza de `UX-02`, sin tocar.
6. **Nuevo de este ciclo: el juego de dos ejes (`¿Qué tipo de ricotero sos?`).**
   `UX-20 §2` ya decidió que se queda en una sola capa de fondo, a propósito, porque
   ningún resultado es mejor que otro. La misma razón lo saca de la imprenta: estampar un
   resultado con la tapa de un disco sugeriría que hace falta reconocerlo para que el
   resultado "valga", que es justo lo que este juego no pide.

---

## 13. El catálogo de nombres de token

Solo nombres — el valor va primero al lienzo, después a `tokens.css`, por el circuito de
`.claude/rules/diseno-marca.md`. Todos entran al catálogo de `movimiento.test.ts` salvo
los dos marcados como estáticos.

### Movimiento (tiempo)

| Token | Para qué sirve | Techo (`§1.1`/`§5`) | Mecanismo bajo movimiento reducido |
|---|---|---|---|
| `--duracion-pasada` | Cada uno de los cuatro compases de la estampa: clara, media, clave, fijado (`§2.2`). Se reusa igual en el fallo, una sola vez (`§1.3`) | ≤ 400 ms cada uno | `token`: se apaga a 0, la estampa aparece completa desde el cuadro cero |
| `--escalon-pasada` | El corrimiento entre el arranque de una pasada y la siguiente — mismo rol que `--escalon-umbral` ya cumple para el umbral de la portada | El total de las cuatro (3 × este token + `--duracion-pasada`) no pasa de 1200 ms (`§1.1`) | `token`: se apaga a 0 |
| `--duracion-giro` | Cuánto dura "dala vuelta" (`§5`) | ≤ 400 ms, techo normal de `UX-20 §1.1` — no es la excepción del `§1` | `token`: se apaga a 0, el objeto cambia de cara sin interpolar |
| `--duracion-carrete` | Una vuelta completa del carrete mientras suena el fragmento (`§6`) | Sin techo de tiempo — es un bucle mientras dura el sonido, no un paso | `regla`: `animation: none` en su selector; la palabra de `§6` sigue presente sin depender de esto |

### Aire y superficie (estático — no entra al catálogo de duraciones)

| Token | Para qué sirve |
|---|---|
| `--registro` | El corrimiento en px de la segunda tinta/pasada (`§2.3`, `§8`). Un solo valor, reusado en los dos lugares |
| `--registro-angulo` | La rotación en grados que acompaña a `--registro` |
| `--textura-rodillo` | El SVG de rodillo entintado, alfa únicamente, separador de sección (`§9`) |
| `--fuente-lobo-suelto` | La variable que falta para nombrar `'Lobo Suelto Fan'` sin escribir el nombre de familia a mano en un componente (`§7`) |

**Ninguno de los cuatro tokens de tiempo es `--duracion-paso` ni `--duracion-toque`
reusado con otro nombre.** Cada uno gobierna un gesto semánticamente distinto —una
impresión, un giro de objeto, un bucle mientras suena algo— y por eso tiene su propio
nombre, siguiendo el mismo criterio que ya separó `--duracion-paso` de `--duracion-
umbral` en el ciclo 11: cosas que se parecen en el número no tienen por qué compartir el
nombre si gobiernan cosas distintas.

---

## 14. `prefers-reduced-motion`, pieza por pieza

Extiende la tabla de `UX-20 §5` con lo que este ciclo agrega. El corte sigue operando por
familia de token (nunca por selector universal), y `--duracion-toque` sigue siendo la
única duración que el corte no toca.

| Pieza | Con movimiento reducido | Qué pasa con la información |
|---|---|---|
| La estampa (clara, media, clave, fijado — `§2`) | **Se apaga.** El papel, las tres tintas y la foto aparecen juntas, completas, desde el primer cuadro | Ninguna: la respuesta (qué tapa era) se lee igual, sin el proceso de impresión de por medio |
| El fallo (clave sola — `§1.3`) | **Se apaga.** La tinta clave aparece directa | Ninguna: sigue diciendo "te faltó el color", solo que sin la pasada visible |
| La sala se vuelve el disco (`§3`) | **Se apaga** (mismo corte que ya lleva `--duracion-paso` a 0 bajo `UX-20 §5`) | Ninguna: el fondo cambia igual, instantáneo en vez de con transición |
| Dala vuelta (`§5`) | **Se apaga.** Cambio directo de frente a dorso | Ninguna: las dos caras siguen siendo accesibles con el mismo tap, sin el giro |
| La cinta gira (`§6`) | **Se apaga** (`animation: none` en los carretes) | Ninguna: la palabra junto al casete (`§6`) es la señal, y está presente en los dos modos, no solo en este |
| El zoom que se abre (`§11`) | **Se apaga.** La tapa entera aparece completa, sin la secuencia de pasadas | Ninguna: sigue siendo la misma información — cuál era la tapa — sin el proceso |
| El registro imperfecto (`§8`) y el rodillo (`§9`) | **No aplica.** Nunca estuvieron animados — son estáticos por diseño, no hay nada que apagar | — |
| La tirada como afiche (`§10`) y la ficha de disco estampada (`§9`) | **No aplica**, mismo motivo | — |

**La prueba que queda para quien construya:** con `prefers-reduced-motion: reduce`
prendido, jugar una vuelta completa de "adiviná el tema" con al menos un acierto y al
menos un fallo, y confirmar que en ningún momento hay que esperar a que algo termine para
poder tocar "Seguí" — es la misma prueba que `UX-20 §5` ya pide, extendida a las piezas
nuevas de esta hoja.

---

## 15. Cómo se reconoce que fallamos

Los tres síntomas de `UX-20 §6` siguen rigiendo tal cual (un elemento con animación
propia que nadie más comparte, un paso que pasa los 400 ms sin ser el techo de este
documento, y que el movimiento apagado diga menos que el prendido). Un cuarto, propio de
esta hoja:

4. **La imprenta se volvió plantilla.** Se prueba mirando dos discos revelados uno al
   lado del otro (o dos capturas del mismo build). Si las tres tintas de un disco se ven
   parecidas a las de otro disco —si cambiás el slug y solo cambia un tinte mientras los
   otros dos quedan genéricos, o si la clara y la media no son las medidas de esa tapa en
   `tokens.css` sino una paleta puesta a ojo—, la separación dejó de leer datos y pasó a
   ser un efecto de librería con nombre ricotero encima. Y si el orden de las pasadas
   —una vez que llegue `RES-54`— no es el que trae esa ficha, es lo mismo con otro
   síntoma: una imprenta de mentira, con las luces de una de verdad.

---

## Cómo se verifica

Nada de esta hoja es código, así que no hay comando propio. Lo que sí es corrible, y
queda para quien construya (`D-12`):

- **`§1`, `§13`, `§14` (techos, tokens, corte de movimiento reducido):**
  `node --test src/lib/movimiento.test.ts` en verde, con los cuatro tokens nuevos de
  tiempo en la lista de `pedidos` y las animaciones de la estampa, el giro y el carrete
  en `ANIMACIONES`, cada una con su mecanismo declarado.
- **`§2`, `§8` (que no aparezca ningún par de contraste nuevo sin testear):**
  `node --test src/lib/contraste.test.ts` sigue en verde sin agregar ningún par —esta
  hoja está escrita a propósito para no necesitar ninguno nuevo (`§2.2` explica por
  qué). Si alguien termina necesitando uno, es señal de que se apartó de esta hoja, no
  de que faltó actualizarla.
- **`§6`, `§10` (ningún estado solo con color):** el mismo tipo de test que ya corre
  `estilos.test.ts` para acierto/error/rótulos, extendido a que la palabra del casete
  (`§6`) esté presente en el JavaScript de la isla, no solo sugerida por un color de
  borde.
- **`§9`, `§12` (lo que nunca se estampa, y lo que queda quieto):** a simple ojo, con
  `prefers-reduced-motion` prendido y apagado, las tres pantallas graves de la
  Redondopedia y la ficha de cada disco se ven exactamente iguales entre las dos
  corridas.
- **`§15` (el síntoma nuevo):** poner dos discos revelados uno al lado del otro y
  confirmar que las tres tintas de cada uno salen de sus propios `--disco-*-tinta`/
  `-apoyo` en `tokens.css`, no de una paleta compartida — es la vara de `REV-11`
  (`T-209`).
- **`§1.4` (a dónde apunta el scroll automático):** dos condiciones, ninguna se audita
  con un test de esta hoja (`D-12`, no invento uno solo para esto). **Condición 1**, en
  código: `partida-tema.ts` tiene que envolver su `seguir.focus({ preventScroll: true })`
  + `revelacion.scrollIntoView(...)` en el mismo tipo de rama que ya usa
  `partida-tapa.ts:152-157` (`if (armarEstampa(...) devolvió algo) {...} else {
  seguir.focus(); }`) — un `grep` sobre las dos funciones alcanza para confirmarlo.
  **Condición 2**, también en código: el `scrollIntoView` de `partida-tema.ts` tiene que
  correr sobre el elemento que devuelve `armarEstampa`, no sobre `revelacion`. Y con el
  dedo, a 375×812: jugar el caso más cargado de cada juego (tema con reproductor entero +
  enlace a la letra; tapa con explicación larga + sello) y confirmar que "Seguí" sigue a
  un desplazamiento corto de la vista, no a media pantalla — si no lo está, se acorta el
  panel, no se reabre el número de esta hoja.
