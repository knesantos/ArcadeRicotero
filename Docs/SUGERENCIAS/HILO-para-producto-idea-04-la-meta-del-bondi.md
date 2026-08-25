# Para `producto`: `IDEA-04` ya tiene meta — hay que llegar a tomar el bondi

> De: hilo principal · Fecha: 2026-08-23, **corregida y ampliada el 2026-08-24** ·
> Consume: pedidos directos del usuario (2026-08-23 la meta, 2026-08-24 el tema),
> `PRD-backlog-ideas.md` (`IDEA-04`, `BR-15`, `BR-16`), `RES-20`, `RES-37`, `D-19`, `D-14`,
> `D-22`, `.claude/rules/diseno-marca.md`, y el cancionero del repo
> (`src/data/cancionero.json`).
> **Estado:** sigue sin empezar y sigue sin ser alcance de la v1.
>
> ⚠ **Esta ficha se escribió con un dato mal medido y el usuario lo corrigió al día
> siguiente.** La versión del 23 decía que *Finisterre* no aparece en ninguna letra. Es
> falso: aparece en **Gualicho**, que es justamente el tema que el usuario eligió para el
> juego. Lo que estaba midiendo era el corpus del repo, y el corpus **no tiene la letra de
> Gualicho**. Corregido abajo, con el detalle de qué falta y cuánto.

---

## Lo primero, porque cambia qué hay que hacer con esto

El usuario pidió *"agrega otro juego que sea como un mario de plataformas simple pero que
sea que hay que llegar a tomar el último bondi a Finisterre"*. **Ese juego ya está
guardado: es `IDEA-04`**, del 2026-08-22, escrita entonces con la frase original —
*"Plataformas ultimo bondi a finisterre"*.

Así que no abrí `IDEA-12`. Un ID nuevo para la misma idea es exactamente lo que
`Docs/IDS.md` está para evitar, y además rompería la cuenta de ideas guardadas. Lo que
llegó hoy **no es otro juego: es lo que a `IDEA-04` le faltaba**, que era la meta. Abajo
va la actualización para pegar en la ficha.

Si al usuario le interesaba un segundo plataformas distinto, esto se separa después y ahí
sí toma número propio.

---

## Lo que la meta resuelve, y no es poco

La ficha de `IDEA-04` tenía tres cosas abiertas. **La meta cierra la primera y abarata la
segunda**, sin que nadie tenga que decidir nada:

**1. "Largo de nivel contra la sesión de dos o tres minutos."** Estaba escrito como el
choque principal. Un plataformas se corta en niveles cortos o no entra, y cortarlo es una
decisión arbitraria que siempre queda pareciendo un límite puesto de afuera. Con la meta,
el límite deja de ser arbitrario: **el bondi se va**. La cuenta regresiva no es un número
en la esquina de la pantalla, es el micro con el motor en marcha al final del tramo. Es lo
que pide `diseno-marca.md` — cada elemento se resuelve en el idioma del proyecto o no se
resuelve —, y de paso el juego se autocorta en la duración que el sitio necesita.

**2. Los controles táctiles se pueden abaratar hasta un botón.** Si el verbo es *correr a
alcanzar algo que ya está arrancando*, el género natural no es el Mario de explorar: es el
de correr hacia adelante y saltar. **Un botón, una mano, cero cruceta.** No lo decido yo
—es de `experiencia`—, pero conviene tenerlo sobre la mesa porque es la diferencia entre
un control que en un celular funciona y uno que hay que pelear.

**3. El final perdido es mejor que el final ganado, y es gratis.** "El último" quiere decir
que no hay otro. Si no llegás, no hay reintento adentro de la ficción: te quedaste a pie.
Eso es una pantalla de derrota que no necesita ni chiste ni consuelo, y encaja con lo que
`voz-ricotera.md` llama registro 3 — decir qué pasó y callarse.

---

## Lo que verifiqué antes de escribir esto

**El ancla estaba bien y sigue bien**, pero conviene precisarla porque la frase del usuario
suena a título de tema y no lo es:

- ***Último bondi a Finisterre* es un disco, no una canción.** 18-nov-1998, Patricio Rey
  Discos, 10 temas (`RES-20`). Los diez están cargados en el cancionero y **ninguno se
  llama como el disco**: van de *Las increíbles andanzas del Capitán Buscapina en
  Cybersiberia* a *¡Esto es to-to-todo amigos!*. No es un problema para la idea —el ancla
  es el disco y está verificada—, pero que nadie escriba después "el tema *Último bondi a
  Finisterre*", porque no existe.
- ~~**La palabra *bondi* aparece una sola vez en todo el cancionero**, y no es en ese
  disco.~~ ~~***Finisterre* no aparece nunca en las letras.** Cero apariciones.~~
  **Las dos frases estaban mal y las corrigió el usuario el 2026-08-24.** Lo que medí fue
  el corpus, no las letras, y lo dije como si fuera lo segundo. Ver la sección de abajo: el
  bondi a Finisterre está en la letra de *Gualicho*, y el corpus del repo no la tiene.
  Lo único que sigue en pie de esa medición es lo de *El lobo caído* (**Lobo suelto**,
  1993): ahí hay una línea sobre perder el bondi, y es la única aparición de la palabra en
  lo que el corpus **sí** trae.

---

## El tema del juego es *Gualicho*, y eso ancla la idea entera

El usuario lo decidió el 2026-08-24: **el tema del juego es *Gualicho*, y en la letra
alguien se cuelga del bondi a Finisterre.**

Es la pieza que faltaba, y no es decoración:

- **El destino deja de ser un título de disco y pasa a estar cantado.** Hasta ayer, "el
  último bondi a Finisterre" era el nombre del álbum y nada más — un rótulo del que colgar
  un juego. Con *Gualicho*, el bondi está adentro de una canción, y el juego deja de
  ilustrar una tapa para ilustrar un verso.
- **El verbo del juego sale de la letra.** No es *tomar* el bondi: es **colgarse**. Un
  plataformas cuyo objetivo es colgarse de algo que ya está en movimiento es un juego más
  claro y más difícil de confundir con cualquier otro, y no lo inventó nadie acá.
- ***Gualicho* es la pista 4 de ese mismo disco** (`RES-20`), así que el tema, la tapa y la
  paleta de `tokens.css` (`RES-37`, `D-19`) son todos la misma cosa. De las cinco ideas de
  clon, **`IDEA-04` es ahora la única que tiene su música decidida**, y no por descarte.
- **Y con `D-22` esa música existe en el repo**, o va a existir: el sitio aloja los temas
  enteros en mp3. Eso convierte la consecuencia 3 de `BR-15` —música de fondo en loop
  durante una partida, que hoy no cubre ningún ADR— de pregunta abstracta en pregunta
  concreta, con un archivo y un tema con nombre. Sigue siendo de `arquitectura`, pero ya se
  puede formular bien.

### El problema que apareció al ir a buscar el verso

**La letra de *Gualicho* no está en el repo.** No es que esté incompleta: no hay una sola
línea cantada. El archivo la marca `contenido: "letra"` y trae tres líneas tipadas como
letra que son cifrado de acordes, no letra. Medido el 2026-08-24 sobre
`src/data/cancionero.json`.

No es un caso aislado y el patrón es incómodamente preciso — **es el disco de esta idea el
que está peor cubierto de los diez**:

| Pista | Tema | Líneas cantadas |
|---|---|---|
| 3 | El árbol del gran bonete | **1 de 4** |
| 4 | **Gualicho** | **0 de 3** |
| 5 | Pogo | **0 de 24** (es una tablatura entera) |

Las otras seis con letra están completas, y *Scaramanzia* está bien declarada como solo
tablatura. Los tres agujeros vienen de cifraclub, que fue la fuente de 82 de los 104 temas.

**Por qué esto le importa a `producto` y no solo a quien cargue datos:** es el mismo agujero
que bloquea `IDEA-11` (ahí el conteo de palabras **es** la respuesta correcta) y el que
`US-03` ya está pagando con sus 226 versos en `borrador`. Tres frentes, una sola deuda.
Y hay un cuarto, más chico y ya visible: `/letras-y-acordes/gualicho/` es hoy una página
que promete la letra de un tema y muestra tres líneas de acordes. La invariante que debería
atajarlo existe —`banco.ts` no deja declarar `letra` con cero versos— pero cuenta como
verso cualquier línea tipada `letra`, así que el cifrado pasa el control.

**Y hay un hecho que hace falta y que yo no puedo traer:** qué es Finisterre y por qué se
llama así el disco. Cualquier cosa que el juego diga sobre eso —hacia dónde va el bondi, si
el destino es un lugar real, qué significaba para la banda— necesita ficha `RES-XX` de
`investigador`, que es el único rol que sale a la web. Mientras no exista, el juego puede
usar el nombre (es el título del disco, está verificado) pero **no puede afirmar qué
significa**. Si termina siendo relato de fans, entra rotulado como leyenda y entra igual
(`D-14`).

---

## Lo que sigue abierto, y ahora es lo único caro

**`BR-15` sigue aplicando entera:** el motor de un plataformas 2D no se escribe, se adopta
uno genérico y se lo viste. Con eso, lo que queda por resolver es lo de siempre y en este
orden:

1. **Motor candidato y su licencia**, ficha `RES-XX` por motor (`BR-15`, consecuencia 1).
   Es lo único de todo el backlog que conviene chequear antes y no después, porque acá el
   que reclamaría es el autor del motor y bajar el sitio no le devuelve nada.
2. **El skin, que es la mitad cara** (`BR-15`, consecuencia 2), y en un plataformas es la
   más cara de las cinco ideas de clon: son sprites, tiles, un personaje que corre y salta,
   y un tramo entero de escenario. Lo que ya está resuelto es el color: la paleta de la
   tapa está muestreada y vive en `tokens.css` como los `--cat-*` de "Último bondi"
   (`RES-37`, `D-19`).
3. **Qué es el bondi, y es una decisión de `experiencia` que vale la pena tomar temprano.**
   La tapa de ese disco es la nave interplanetaria que propuso Rocambole (`INV-20`). Un
   colectivo de línea y una nave son dos juegos con dos estéticas distintas, y el proyecto
   ya tiene medio camino hecho hacia la segunda.
4. **Música de fondo durante la partida:** sigue sin decisión que la cubra, para esta y
   para los otros cuatro clones. Dueño `arquitectura` (`BR-15`, consecuencia 3).

---

## Ficha actualizada, para pegar en `PRD-backlog-ideas.md`

Reemplaza el bloque de `IDEA-04`. Lo de antes no se pierde: se le agrega la meta y se
tacha lo que quedó resuelto.

### IDEA-04 — Plataformas: llegar a tomar el último bondi a Finisterre

**Tal cual la dijo el usuario**, en tres tandas:
1. *"Plataformas ultimo bondi a finisterre"* (2026-08-22) — la idea.
2. *"como un mario de plataformas simple pero que sea que hay que llegar a tomar el último
   bondi a Finisterre"* (2026-08-23) — la meta.
3. *"el tema del juego es «gualicho»"* (2026-08-24), señalando el verso donde alguien se
   cuelga del bondi a Finisterre — el tema y el verbo.

**Tipo:** clon vestido (`BR-15`).
**Ancla, verificada:** **Último bondi a Finisterre**, 18-nov-1998, Patricio Rey Discos, 10
temas (`RES-20`). Es un **disco**, no un tema: ninguna de las diez canciones lleva ese
título. La tapa tiene ficha propia: Rocambole propuso la nave interplanetaria y convenció
al resto (`INV-20`, sección de tapas).

**El tema, que es lo que llegó el 2026-08-24: *Gualicho*, pista 4 de ese mismo disco.** Es
donde el bondi a Finisterre está cantado y no solo impreso en la tapa, y es de donde sale el
verbo del juego: no es *tomar* el bondi, es **colgarse**. Tema, tapa y paleta quedan siendo
lo mismo, y con `D-22` la música existe como archivo.

**La meta, que es lo que llegó el 2026-08-23:** el nivel termina cuando te colgás del bondi,
y el bondi se va. No hay otro — de eso se trata "el último". Perderlo es el final perdido,
y quedarse a pie es toda la pantalla de derrota que hace falta.

**Lo que ya está hecho:** la paleta de esa tapa está muestreada y vive en `tokens.css` como
los `--cat-*` de "Último bondi" (`RES-37`, `D-19`). El skin arranca con la mitad resuelta,
que es más de lo que puede decir cualquier otra de las cinco.

**A resolver antes de promoverla:**
- ~~Largo de nivel contra la sesión de dos o tres minutos: un plataformas se corta en
  niveles cortos o no entra.~~ **Resuelto por la meta:** el que corta el nivel es el bondi
  que arranca, y la cuenta regresiva es el micro, no un número en la esquina.
- Controles táctiles. Sigue abierto, pero la meta empuja hacia un solo botón de salto con
  avance automático: el verbo es alcanzar algo que ya se está yendo. Decide `experiencia`.
- **Qué es el bondi**: ¿un colectivo de línea o la nave de la tapa? Decide `experiencia`.
- Motor 2D candidato + licencia (`BR-15`).
- ~~Música de fondo: no hay decisión que la cubra.~~ **El tema está elegido (*Gualicho*) y
  con `D-22` el archivo existe.** Lo que queda es cómo suena adentro de una partida —loop,
  corte, qué pasa cuando el jugador pierde—, y eso sigue siendo de `arquitectura`. Es la
  única de las cinco ideas de clon que llegó a este punto.
- **Falta la letra de *Gualicho* en el repo.** Cero líneas cantadas hoy. Si el juego va a
  mostrar el verso en algún lado —pantalla de título, final, pantalla de derrota— antes hay
  que cargarla, y de paso arreglar las otras dos del disco (*Pogo*, *El árbol del gran
  bonete*). Es la misma deuda de `IDEA-11` y `US-03`.
- **Qué es Finisterre**: sin ficha. El juego puede usar el nombre del disco; no puede
  afirmar qué significa hasta que haya `RES-XX`. Si es relato de fans, entra rotulado como
  leyenda (`D-14`).

**Fila del resumen, actualizada:**

| ID | Idea | Tipo | Reutiliza | Choque principal |
|---|---|---|---|---|
| `IDEA-04` | Plataformas: colgarse del último bondi, con *Gualicho* de fondo | clon vestido | paleta de la tapa en `tokens.css`, el mp3 del tema (`D-22`) | ~~largo de nivel~~; ~~música~~; motor + licencia; el skin es el más caro de los cinco; falta la letra de *Gualicho* |
