# CNT-14 — Las palabras de la imprenta

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-01 — **corrección puntual 2026-09-02, en §2.2**, por `FIND-50`
  (`REV-11`, ciclo 12): se retira el sello de crédito de la estampa (`ROCAMBOLE` /
  `BAJA RESOLUCIÓN`) porque `UX-22` §2.5 fijó que la estampa **no** lleva sello propio —
  exactamente la condición de reapertura que esta misma pieza había dejado escrita en su
  cabecera y que nadie ejecutó a tiempo. Detalle completo en §2.2.
- **Estado:** cierra `T-198` del ciclo 12, frente A. Insumo directo de `T-200`..`T-206`
  (hilo principal, que cablea estas líneas en `src/lib/tema/copy.ts` y en
  `src/lib/tapa/copy.ts` — archivos que esta pieza **no toca**, por regla del encargo).
- **Consume:** `Docs/ORQ/ORQ-plan-ciclo-12.md` entero (la idea "el sitio no se dibuja, se
  imprime", las siete cosas que cambian, la fila de `T-198`), `.claude/rules/
  diseno-marca.md` (el componente "sello de goma", la tabla anti-slop), `.claude/rules/
  voz-ricotera.md` (§4.1–4.6, §5 "la regla de las dos líneas", §7 tabla anti-slop, §8 lo
  que audita `voz.test.ts`), `Docs/DECISIONES.md` `D-14` (molinetes abiertos, ningún dato
  dudoso como respuesta correcta), `D-17` (voseo, sin anglicismos), `D-19` (la mezcla —
  la tinta real de cada disco), `D-21` (tapas reales en cualquier pantalla: baja
  resolución y crédito, no negociables), `D-32` (el movimiento es del lugar, los cuatro
  límites, el acierto como único grito), `Docs/UX/UX-04-sistema-visual.md` §"Tapas reales
  en toda la pantalla" (las tres formas, el patrón de crédito, el piso de legibilidad),
  `Docs/CONTENIDO/CNT-02-guia-tono.md` (la jerga va en el tono, nunca en la barrera),
  `Docs/CONTENIDO/CNT-13-los-nombres-del-lugar.md` (formato, método, cómo se relaciona con
  `voz.test.ts` — precedente directo de esta pieza), `src/styles/tokens.css` entero (las
  diez paletas `--disco-<slug>-tinta/-apoyo`, el bloque de movimiento y su corte bajo
  `prefers-reduced-motion`), `src/scripts/partida-tema.ts` (`cerrarTema`, `pintarRevelacion`,
  `avanzar`, `pintarResultado`, líneas ~700–930), `src/scripts/partida-tapa.ts` (`responder`,
  el mecanismo de `encuadre === 'detalle'`), `src/lib/tema/copy.ts` y `src/lib/tapa/copy.ts`
  enteros, `public/arte/README.md` (el despiece de recortes, qué está prohibido —el esclavo
  encadenado sigue sin álbum atribuido), `public/arte/casete.svg` (la carcasa, las dos
  ruedas dentadas, la etiqueta), `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`
  `RES-06` (Rocambole: rodillo, serigrafía, aerografía, grabado, collage — técnica real,
  no inventada), `src/lib/letra/discos.ts` (los diez slugs) y `src/lib/voz.test.ts` entero
  (las siete reglas auditadas a máquina, para no escribir nada que el build vaya a
  rechazar).

  **Dos piezas paralelas de este mismo frente A no existen todavía en disco al momento de
  escribir esto:** `UX-22` (`T-195`, `experiencia`) y `RES-54` (`T-196`, `investigador`).
  Mismo caso que `CNT-13` con `UX-20` en el ciclo 11: trabajé directo de la doctrina tal
  como la redactó `ORQ-plan-ciclo-12.md`, que es la fuente que sí tengo. Ninguna de las
  líneas de acá depende de un dato técnico de `RES-54` (el orden real de las pasadas de
  una serigrafía) — uso "tinta" y "clave" como vocabulario genérico de imprenta, ya
  presente en la prosa del propio plan, no como una afirmación verificable sobre cómo
  imprime nadie. Si `UX-22` termina fijando algo que contradiga una de estas líneas, se
  reabre esta pieza — no antes.

  **Y eso pasó: `UX-22` aterrizó y su §2.5 contradice de frente el sello de crédito que
  escribí en §2.2.** No se reabrió sola — hizo falta `FIND-50` de `REV-11` (ciclo 12) para
  notarlo. Queda corregido ahí, con fecha y motivo.

- **Resuelve:** `T-198`.

## 0. Qué es esto, y qué no es

**Siete renglones** (más un criterio sin texto propio, el punto 7). Eran nueve hasta la
corrección del 2026-09-02: los dos que se cayeron eran el sello de crédito de la estampa,
retirado en §2.2 porque `UX-22` §2.5 dice que la estampa no lleva uno propio — el detalle
completo, ahí. Ninguno de los siete que quedan reemplaza el título de una pantalla, el
subtítulo de mecánica o un botón que ya existe y que `CNT-05`/`CNT-13`/el hilo principal ya
escribieron — eso sigue igual, y sigue siendo lo que **nombra**. Lo que agrego acá son las
palabras nuevas que la imprenta necesita para tener voz: el grito de la tinta, el control
que da vuelta el objeto, el sello de la pista en la trasera, el estado de la cinta sin
movimiento, y el título del afiche en el que se convierte el resultado.

**Nada de lo que sigue necesita ficha `RES-XX` nueva.** Es tono y forma, no un hecho
verificable sobre la banda. Donde toco algo que sí tiene ficha detrás —qué técnicas usa
Rocambole, qué discos llevan tilde en su título real— lo cito explícito.

No decido layout, tipografía, tiempos de aparición ni el mecanismo de `pointerdown` del
control que da vuelta la estampa: eso es de `T-199`..`T-206` (hilo principal) y de
`UX-22` (`experiencia`). Tampoco toco el mapa disco→sección de `D-19`, aunque lo uso para
no escribir algo que le pegue en contra a la tinta real de cada tapa.

## 1. El método, igual que `CNT-13` con un techo más

Cada renglón nuevo cumple:

- **Registro explícito** (`voz-ricotera.md` §5): 1 (canta), 2 (cuenta) o 3 (rotula). Los
  siete de acá son 1 o 3 — no hay prosa larga que requiera el 2.
- **Techo de palabras** según el tipo: 8 para toda línea que canta (4.1), sin techo
  formal pero sí brevedad de sello (una o dos palabras en mayúsculas) para lo que rotula.
- **Imagen física cuando el registro es 1** (4.3): cuerpo, objeto, animal o plata — nunca
  color suelto ni psicodelia de utilería. Donde el registro es 3, **no** hace falta
  imagen: `voz-ricotera.md` §5 lo dice explícito — "seco, sin imagen, sin chiste".
- **Intruso:** ninguno de los siete trae uno. Mismo argumento que `CNT-13` §2: la regla
  4.5 dice "puede traer", no "tiene que traer", y con siete piezas ya hay variedad de
  imagen (tinta, un objeto que se da vuelta, pared, cinta) sin forzar una marca o un
  nombre propio que solo cumpliría cuota.
- **No explica el truco** (4.6, y la fila de `voz-ricotera.md` §7 "explicar el chiste en
  la línea siguiente"): donde el efecto visual ya dice algo (la tapa se imprime en
  colores, la tapa se imprime en una tinta), el texto no repite en palabras lo que el ojo
  ya vio. Es el criterio que más pesa en el punto 4.1 de abajo.
- **Contra las siete reglas de `voz.test.ts` §8**, una por una, al cierre de cada punto.

---

## 2. Las siete piezas

### 2.1 El acierto y el fallo de "Adiviná el tema" — la metáfora de la tinta

**El acierto se queda como está: `REVELACION.acerto = '¡La sacaste!'`. Sin cambios.**

Por qué no le meto la metáfora de la tinta: el acierto ya es, por `D-32`, "el único grito
del sitio" — un grito de verdad, no una explicación. La impresión en colores **ya es** la
metáfora; ponerla también en palabras es exactamente la fila que veta
`voz-ricotera.md` §7, *"explicar el chiste en la línea siguiente"* — el ojo ve la tapa
estamparse en sus colores reales, y si el texto encima le agrega "en tinta" o "a todo
color" está subtitulando un chiste que ya se entendió solo. `¡La sacaste!` es corto (2
palabras), registro 1, sin anglicismo, sin infinitivo, sin puntos suspensivos: pasa las
siete reglas igual que antes porque no cambió una letra.

**El fallo cambia. De `'Se te escapó.'` a:**

> **`Se te escapó, en una tinta sola.`**

Registro 1 (canta, áspera y cariñosa a la vez: "se te escapó" ya tenía el tono justo —
algo que se te fue de las manos, no un regaño). 7 palabras. Imagen física: **tinta**, una
sustancia concreta (4.3), no un adjetivo de color. Es distinta de la frase de referencia
del encargo (no la copio: extiendo la frase que ya existía en vez de escribir una nueva
desde cero, que es lo que ya venía haciendo bien). No hay intruso. Pasa las siete reglas:
sin anglicismo, sin fórmula de folleto, no nombra a nadie en tercera persona, no arranca
con un infinitivo de la lista vetada (arranca con "Se"), 7 palabras (no es un título de
casete así que no hay techo de 8 formal, pero igual entra), sin puntos suspensivos.

**Por qué "una tinta" y no "un color" o "en gris":** `RES-06` fichó que Rocambole trabaja
con rodillo y serigrafía — una técnica real donde cada color es una pasada separada y
faltar una pasada dejaba literalmente el papel con menos tinta encima, no con un color
distinto. "Una tinta" nombra la causa real del efecto (te faltó pagar el resto de las
pasadas) en vez de describir el resultado con un adjetivo ("gris", "sin color") que
suena a estado técnico de pantalla apagada, no a objeto de imprenta.

### 2.2 El crédito de la estampa — reabierto, sin sello propio (`FIND-50`)

**Esta sección se reescribe entera el 2026-09-02.** Lo que sigue abajo, entre líneas, es
lo que decía antes y por qué quedó mal — lo dejo a la vista porque es la evidencia de la
propia condición de reapertura que esta pieza se había puesto: *"si `UX-22` termina
fijando algo que contradiga una de estas líneas, se reabre esta pieza."* Pasó, y el
código ya lo sabía antes que este documento: `src/lib/tema/copy.ts` nunca tuvo
`REVELACION.credito.autor` ni `.resolucion`, la estampa no lleva sello, y estas dos
cadenas quedaron como texto muerto hasta que `FIND-50` (`REV-11`) lo marcó.

**Lo que decía, y por qué estaba mal.** Escribí un sello propio para la estampa —dos
renglones, `ROCAMBOLE` / `BAJA RESOLUCIÓN`, con el componente "sello de goma" de
`diseno-marca.md`— razonando que `PARTIDA.credito` (la frase de figcaption de "adiviná la
tapa") no le servía a un objeto que se imprime en vez de una foto con pie. El razonamiento
sobre la forma era correcto; la solución, no: `UX-22` §2.5 resuelve el mismo problema **sin
agregar un sello nuevo en ningún lado**, y esa es la que manda porque es de quien decide
dónde vive cada pieza en la pantalla, no de quien escribe las palabras.

**Lo que dice ahora.** `D-21` sigue exactamente igual de estricto —**crédito obligatorio,
baja resolución declarada, en cualquier pantalla donde aparezca una tapa**—, pero el
mecanismo que lo cumple acá no es un sello en la estampa: es el pie de página que ya existe
(`footer.pie-sitio`, `credito-tapas`, `PORTAL.creditoTapas` en `src/lib/sitio/copy.ts`),
que `T-200`/`T-202` recalculan en el navegador sumando cada disco que se imprimió o vistió
el fondo durante la sesión, deduplicado (`UX-22` §2.5 y §3). Es el mismo mecanismo que ya
sostiene el crédito de esta pantalla hoy —hasta ahora estático, fijo en Lobo suelto— y que
la trasera de la estampa (`UX-22` §5) reusa sin agregar una segunda línea.

**No hace falta escribir ninguna palabra nueva para esto.** `PORTAL.creditoTapas` ya arma
la frase para uno o para varios discos —*"En esta pantalla, arte de la tapa de..."* /
*"...de las tapas de X, Y y Z, en baja resolución"*— y ya está en producción. Vive en
`sitio/copy.ts`, no en `tema/copy.ts`: no es un campo que esta pieza tenga que llenar, y
el propio archivo ya deja anotado que es candidato a que `contenido` lo revise algún día
con su vara — eso queda como pendiente aparte, no como parte de esta corrección. Retirar
el sello no deja ningún hueco: la estampa se imprime sin firma propia, y el pie de página
dice de dónde salió cada tapa que apareció en la sesión, crédito incluido.

**Queda cancelado, y el nombre no se reutiliza:** `REVELACION.credito.autor` y
`REVELACION.credito.resolucion` (§3, filas marcadas `[CANCELADO]`). Si algún día la
estampa necesita un sello propio por otro motivo, es una pieza nueva con su propio
criterio — no la reapertura de esta.

> Lo que decía la versión retirada, para que quede el rastro:
>
> `ROCAMBOLE`
> `BAJA RESOLUCIÓN`
>
> — dos renglones, registro 3, mayúsculas de sello, sin "(Ricardo Cohen)" siguiendo el
> precedente de `PARTIDA.credito`. El razonamiento de por qué no llevaba paréntesis con el
> nombre real sigue siendo válido en general; simplemente ya no aplica a nada, porque no
> hay sello que lo lleve.

### 2.3 "Dala vuelta" / "Volvé a la tapa" — el control que gira la estampa

El propio plan del ciclo ya usa "Dala vuelta" como nombre de la pieza (`ORQ-plan-ciclo-12`,
punto 4 de las siete cosas que cambian): lo adopto tal cual, porque ya es el término que
el hilo principal fijó y cambiarlo sería inventar una sinonimia que nadie pidió.

> **`Dala vuelta`** — nombre accesible del control cuando se está viendo la tapa (frente).
> **`Volvé a la tapa`** — nombre accesible del control cuando se está viendo la trasera.

Registro 1, imperativo voseado (`D-17`). 2 y 4 palabras. Imagen física: girar un objeto
con la mano — literal, no hace falta metáfora porque la acción es exactamente eso. "Dala"
concuerda en género con "la tapa"/"la estampa" (femenino), coherente con el propio plan.
Ninguna de las dos arranca con un infinitivo de la lista vetada por `voz.test.ts`
("dala" y "volvé" son formas conjugadas, no "dar"/"volver"). Sin anglicismo (nada de
"flip" ni "toggle"), sin punto suspensivo.

**Van como `aria-label`, no como texto siempre visible** — es una decisión de dónde vive
el control, no mía (`T-203`), pero dejo la advertencia: `voz.test.ts` tiene un test
puntual (*"ninguna isla escribe a mano un placeholder ni un aria-label"*) que exige que
cualquier `aria-label` salga de un `copy.ts`, nunca escrito a mano en el script de la
isla. Estas dos líneas tienen que vivir en `tema/copy.ts` desde el día uno, no
cablearse directo en `partida-tema.ts`, o el test las va a agarrar igual que agarró el
caso real de "Link copiado" que cuenta el propio archivo del test.

### 2.4 El sello de la trasera — la pista

> **`` (n) => `PISTA ${n}` ``** — ejemplo: `PISTA 7`.

Registro 3, seco, mayúsculas de sello — mismo criterio que `2.2`. Uso "PISTA" y no
"TEMA" ni "TRACK" porque **"pista" ya es la palabra del sitio para esto**:
`REVELACION.ficha` ya arma `"${disco} (${anio}), pista ${pista}"` con esa palabra exacta,
así que el sello no inventa vocabulario nuevo, lo estampa en mayúsculas. Nada de "track"
(sería el anglicismo que `D-17` prohíbe y que `voz.test.ts` ya audita).

### 2.5 El estado de la cinta sin movimiento — "sonando" / "quieta"

> **`SONANDO`** — mientras el fragmento suena.
> **`QUIETA`** — cuando no suena.

Registro 3, sello, una palabra cada una. Elijo "SONANDO" porque es, literalmente, el
nombre del estado que el propio plan usa para describir la condición del carrete
("los carretes giran solo mientras `sonando`", `ORQ-plan-ciclo-12`, verificación de
`T-204`) — reusar la palabra que ya nombra la variable es la misma disciplina que
`2.4` aplicó con "pista": no inventar un sinónimo donde ya hay un nombre. Elijo "QUIETA"
por el mismo motivo, en espejo: la propia descripción de `T-204` dice que los carretes
quedan "quietos al frenar". "Quieta" concuerda con "la cinta", que es el sujeto real del
casete (`public/arte/casete.svg` es "un cassette", pero lo que gira es la cinta adentro).
Ninguna de las dos es un infinitivo, ninguna es un anglicismo, ninguna necesita imagen
física porque el registro 3 no la pide.

### 2.6 El pie de la tirada — el afiche del resultado

> **`Tu vuelta quedó pegada en la pared.`**

Registro 1, canta, 7 palabras. Nombra la vuelta sin nombrarla con la palabra "resultado"
ni "resumen" — la nombra con la imagen de lo que le pasa a un afiche real después de un
recital: queda pegado, torcido, en una pared. Es la misma imagen que ya pidió `T-205`
("pegado torcido") llevada a palabras, y conecta con el vocabulario que el propio juego
ya usa para "ronda jugada" (`RESULTADO.denuevo = 'Otra vuelta'` ya dice "vuelta", no
invento el sustantivo). No reemplazo `RESULTADO.detalle` (`'Los temas de esta vuelta'`,
registro 3, que sigue nombrando la lista que viene debajo) — esta línea es la que canta,
al lado o arriba de la que nombra, siguiendo la regla de las dos líneas. **Dónde vive
exactamente en el HTML del afiche es de `T-205`**, no mío.

**Sobre `TARJETA.pieAcierto` / `pieFallo` — decido que quedan igual, sin cambios.** Hoy
dicen `"${disco} · ${audio} de audio · ${tiempo}"` y `"${disco} · no salió · ${tiempo}"`:
son registro 3, seco, y no compiten con la estampa chica que `T-205` va a poner al lado
de cada renglón — son su equivalente en texto, el mismo trabajo que ya hace el `alt` de
una imagen. Cambiarlas para "hacerlas más lindas" ahora que hay una tapa de fondo sería
la fórmula exacta que `CLAUDE.md` prohíbe: decorar lo que ya cumple su función. Además
`TARJETA` la comparten dos juegos y alimenta la tarjeta compartible (`D-30`), así que
tocarla acá sin necesidad real arrastra un efecto a un lugar que este ciclo declaró
explícitamente afuera (`ORQ-plan-ciclo-12`, "Qué quedó afuera": *"la tarjeta compartida
con la tapa"*).

### 2.7 El disco en sus propias letras — criterio, no copy

No es un renglón de texto nuevo: es una regla de **cómo se escribe** el texto que ya
existe (el nombre del disco), y la dejo escrita porque el encargo la pide con nombre.

**Regla:** el nombre de un disco, cuando se estampa en su propia letra reconstruida
(`Oktubre Calco`, `Lobo Suelto Fan`), va **siempre en mayúsculas** — es la única forma en
que esas fuentes existen, calcadas del lettering real de la tapa, que es mayúscula — y
**sin tilde únicamente en los tres discos cuyo título real no la lleva**:

| Disco | Cómo se estampa | Por qué |
|---|---|---|
| *Oktubre* | `OKTUBRE` | El título real no lleva tilde — es una palabra deformada a propósito (con K), no "Octubre" con acento |
| *Lobo suelto* | `LOBO SUELTO` | Ninguna de las dos palabras lleva tilde en el título real |
| *Cordero atado* | `CORDERO ATADO` | Ídem |

**Esto no se extiende a los otros siete discos.** *Último bondi a Finisterre* sí lleva
tilde en su título real (`Último`), *Gulp!* lleva el signo de exclamación que ninguna
fuente fan cubre — y ninguno de los dos tiene una fuente propia reconstruida: van en
`--fuente-rotulada` (Archivo Black), que sí tiene el alfabeto completo con tildes, así
que ahí el nombre **se escribe completo, con su tilde real**, nunca recortado para que
entre en una letra que no le pertenece. La regla "sin tilde" es una excepción acotada a
tres discos por una limitación de archivo de fuente (`RES-42`, `RES-43`: los calcos no
tienen glifo de tilde), no un criterio de estilo que valga para el resto del sitio — y
`D-17` ya lo dice para cualquier otro caso: *"no se le saca la tilde para que entre"*.

---

## 3. La tabla completa

Para que `T-200`..`T-206` la transcriban a `src/lib/tema/copy.ts` (bloque `REVELACION` y
`RESULTADO`) y a `src/lib/tapa/copy.ts` (bloque `PARTIDA`). Los nombres de campo son
sugerencia, no mandato — el nombre final es de quien cablea (mismo criterio que `CNT-13`
§6). **Las dos filas `[CANCELADO]` no se transcriben a ningún lado** — quedan en la tabla,
sin reutilizar el nombre de campo, por la misma regla de `Docs/IDS.md` que un ítem
cancelado se marca y se queda donde está en vez de desaparecer.

| Archivo | Campo sugerido | Valor | Registro | Palabras | Estado |
|---|---|---|---|---|---|
| `tema/copy.ts` | `REVELACION.acerto` | `¡La sacaste!` | 1 | 2 | **Sin cambios** |
| `tema/copy.ts` | `REVELACION.fallo` | `Se te escapó, en una tinta sola.` | 1 | 7 | **Modifica** (antes: `Se te escapó.`) |
| `tema/copy.ts` | `REVELACION.credito.autor` | `ROCAMBOLE` | 3 | 1 | **[CANCELADO]** — ver §2.2, `FIND-50` |
| `tema/copy.ts` | `REVELACION.credito.resolucion` | `BAJA RESOLUCIÓN` | 3 | 2 | **[CANCELADO]** — ver §2.2, `FIND-50` |
| `tema/copy.ts` | `REVELACION.girar` | `Dala vuelta` | 1 | 2 | **Nuevo** (`aria-label`, ver `2.3`) |
| `tema/copy.ts` | `REVELACION.volverATapa` | `Volvé a la tapa` | 1 | 4 | **Nuevo** (`aria-label`) |
| `tema/copy.ts` | `REVELACION.pista` | `(n) => \`PISTA ${n}\`` | 3 | — | **Nuevo** |
| `tema/copy.ts` | `REVELACION.sonando` | `SONANDO` | 3 | 1 | **Nuevo** |
| `tema/copy.ts` | `REVELACION.quieta` | `QUIETA` | 3 | 1 | **Nuevo** |
| `tema/copy.ts` | `RESULTADO.afiche` | `Tu vuelta quedó pegada en la pared.` | 1 | 7 | **Nuevo** |
| `tema/copy.ts` | `TARJETA.pieAcierto` / `pieFallo` | sin cambio de texto | 3 | — | **Queda igual** |
| `tapa/copy.ts` | `PARTIDA.ok` | `¡La tenías!` | 1 | 2 | **Sin cambios** |
| `tapa/copy.ts` | `PARTIDA.enClave` | `en una tinta.` | 1 | 3 | **Nuevo** — se agrega a la composición de fallo: `` `${PARTIDA.no} ${PARTIDA.eraLa} ${correcta.texto}, ${PARTIDA.enClave}` `` → *"No era esa. Era Oktubre, en una tinta."* |
| — (criterio, no campo) | Nombre del disco en su letra | Mayúsculas siempre; sin tilde solo en `OKTUBRE`, `LOBO SUELTO`, `CORDERO ATADO` | 1 (título) | — | **Criterio**, ver `2.7` |

**Vocabulario compartido a propósito entre los dos juegos:** "en una tinta" aparece
igual en `2.1` (tema) y en `PARTIDA.enClave` (tapa) — es el mismo efecto visual
(`T-200` reusado por `T-206`), así que es la misma frase, no dos formas de decir lo
mismo. Un sitio que imprime dos veces el mismo defecto con dos palabras distintas se
siente como dos equipos que no se hablaron.

---

## 4. Bloqueos y pendientes

- **Ninguna ficha `RES-XX` pendiente para esta pieza.** Las siete líneas que quedan son
  tono y forma; lo único que cita una ficha es `2.1` (`RES-06`, por qué "una tinta" y no
  "un color") y `2.7` (`RES-42`/`RES-43`, por qué la excepción de tildes es de tres discos
  y no de más).
- **`UX-22` ya aterrizó (`RES-54` seguía pendiente al momento de esta corrección).** La
  parte que sí tocaba a esta pieza —el crédito de la estampa— ya se resolvió en `2.2`.
  Ninguna otra línea de acá depende de un dato que `RES-54` pueda traer: si confirma un
  orden de pasadas distinto al que imagina el plan, no cambia una palabra de este
  documento, que no describe un orden técnico, solo usa "tinta" y "clave" como sustantivos.
- **`REVELACION.girar` / `volverATapa` tienen que nacer en `copy.ts`, no en el script de
  la isla** — lo marco en `2.3` porque `voz.test.ts` ya tiene el test puntual que agarra
  justo ese defecto, y ya pasó una vez con "Link copiado" y con el placeholder del
  buscador de `US-07`.
- **`REVELACION.credito.autor` / `.resolucion` no se cablean.** Quedaban pendientes de
  `T-200`/`T-203` decidir su marcado exacto; ese pendiente se cierra solo, por cancelación
  del campo entero (`2.2`), no porque alguien haya resuelto la forma.

## Cómo se verifica

Hoy, a mano: cada una de las siete líneas contra las siete reglas de `voz.test.ts` §8 —
ninguna trae anglicismo, ninguna es fórmula de folleto, ninguna nombra a la gente como
"fans" o "usuarios", ninguna es un botón en infinitivo (`Dala`, `Volvé`, `Se` no están en
la lista vetada), las dos líneas que cantan entran en 8 palabras, ninguna lleva puntos
suspensivos.

Una vez que `T-200`..`T-206` las cableen en los dos `copy.ts`:

```
node --test src/lib/voz.test.ts
```

tiene que seguir en verde con las siete cadenas nuevas adentro del recorrido de
`VISIBLE` — `cadenas()` ya barre `tema/copy.ts` y `tapa/copy.ts`, así que las va a
encontrar solas apenas existan, sin que haya que tocar el propio test. Lo único que sí
necesita atención manual de quien cablee: agregar `REVELACION.girar` y
`REVELACION.volverATapa` a la lista de `aria-label` que arma la isla, para que el test de
"ningún `aria-label` escrito a mano" tenga qué agarrar en el lugar correcto.
