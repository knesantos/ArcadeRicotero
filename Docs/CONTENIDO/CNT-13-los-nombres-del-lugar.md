# CNT-13 — Los nombres del lugar

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-01
- **Estado:** cierra `T-184` del ciclo 11. Insumo directo de `T-188` (hilo principal, que
  cablea estas líneas en `src/lib/sitio/copy.ts` y en el `copy.ts` de cada juego — archivos
  que esta pieza **no toca**, por regla del encargo).
- **Consume:** `Docs/ORQ/ORQ-plan-ciclo-11.md` (`T-184`, `T-188`, la doctrina de arriba —
  "el movimiento es del lugar, no del elemento" — y el mapa de conflictos que prohíbe tocar
  `sitio.css` y `copy.ts` en esta tarea), `.claude/rules/voz-ricotera.md` (§4.1, 4.2, 4.3,
  4.6, §5 "la regla de las dos líneas", §8 lo que audita `voz.test.ts`),
  `Docs/CONTENIDO/CNT-02-guia-tono.md` (la jerga va en el tono, nunca en la barrera),
  `Docs/DECISIONES.md` `D-14` (molinetes abiertos), `D-17` (voseo, sin anglicismos), `D-19`
  (la mezcla — cada sección viste un disco), `src/lib/sitio/copy.ts` entero,
  `src/lib/{quiz,tema,letra,tapa,por-la-letra}/copy.ts` (los `PANTALLA_0` de los cinco
  juegos), `src/lib/sitio/arte.ts` (`DETALLE_POR_VARIANTE`, para no chocar con el mapa
  sección→disco que es de `experiencia`), `src/pages/index.astro`,
  `src/pages/letras-y-acordes/index.astro`, `src/pages/redondopedia/index.astro`,
  `src/lib/voz.test.ts` (las siete reglas auditadas a máquina). Busqué la doctrina nueva de
  `experiencia` (`UX-20`/`UX-20` "el sitio como lugar", `T-176`) y **todavía no existe en
  disco** al momento de escribir esto — `Docs/IDS.md` línea 38 ya renombró el hueco a
  `UX-20`+ por la colisión con el `UX-20` del ciclo 10 (zoom de tapas), pero el archivo en
  sí no está escrito. Trabajé directo de la doctrina tal como la redactó `ORQ-plan-ciclo-11`,
  que es la fuente que sí tengo.
- **Resuelve:** `T-184`.

## 0. Qué es esto, y qué no es

Ocho renglones nuevos, uno por lugar. Ninguno reemplaza el título de un casete, la bajada
que ya explica la mecánica, o el botón — eso ya está escrito, ya lo audita `voz.test.ts`, y
no es mío tocarlo. Lo que agrego es la **línea que canta** en la regla de las dos líneas de
`voz-ricotera.md` §5: la que ya existe en cada pantalla (título, subtítulo de mecánica,
botón) sigue siendo la que **nombra**. Mi renglón no informa nada — dice dónde estás parado,
con una imagen física, y se calla.

No decido dónde vive en el HTML, con qué tipografía ni con qué velocidad aparece: eso es de
`T-188` (cableado), de `T-181`/`T-186` (la atmósfera de `sitio.css`) y en última instancia
de `UX-20`/`UX-20`, que todavía no está escrita. Tampoco toco el mapa sección→disco — es de
`experiencia` (`UX-04`, extendido por `D-19`) — aunque lo leí (`DETALLE_POR_VARIANTE` en
`arte.ts`) para no escribir una imagen que le pegue en contra al disco que ya viste cada
lugar.

**Nada de lo que sigue necesita ficha `RES-XX`.** No hay una sola afirmación verificable
sobre la banda en estos ocho renglones — son tono, no hecho. Todo lo marco como criterio
propio del rol, apoyado en las reglas ya escritas de `voz-ricotera.md` y `CNT-02`.

## 1. El inventario: por qué son ocho lugares y no seis

`ORQ-plan-ciclo-11.md` habla de "las seis líneas" en `T-184` y `T-188` — es la estimación
que hizo quien escribió el plan, antes de que alguien fuera a `copy.ts` a contar. Fui, y
conté. Esto es lo que hay:

**Lado A del portal — `JUEGOS` en `copy.ts`, cinco casetes, los cinco con `href` propio:**
"Preguntas ricoteras" (`/quiz/`), "Adiviná el tema" (`/juegos/adivinar-el-tema/`), "Sacalo
por la letra" (`/juegos/adivinar-por-la-letra/`), "Completá la letra"
(`/juegos/completar-la-letra/`), "Adiviná la tapa" (`/juegos/adivinar-la-tapa/`). Estos son
"los cinco juegos" que pide el encargo, tal cual están en `copy.ts`, sin que yo tenga que
elegir cuál es el quinto.

**Lado B — dos casetes más, también con `href` propio:** `CASETE_CANCIONERO`
(`/letras-y-acordes/`) y `CASETE_REDONDOPEDIA` (`/redondopedia/`).

**Y el portal mismo**, que es un lugar también — la sala de entrada, no una lámina de
lanzamiento a las otras.

Total: **ocho**. Y hay un noveno candidato que **descarto por completo**, con el motivo
abajo.

### El noveno candidato, y por qué no tiene renglón

`src/pages/juegos/dos-ejes.astro` existe, tiene su propio `copy.ts`
(`src/lib/dos-ejes/copy.ts`, con `PANTALLA_0.titulo: '¿Qué tipo de ricotero sos?'`) y un
banco de contenido entero (`src/data/dos-ejes.json`, ya auditado por `voz.test.ts`). Es el
test de dos ejes de `US-06`/`US-07` que se menciona en el propio `voz.test.ts`. **Pero no
está en `JUEGOS`, no está en ningún otro casete del portal, y no hay un solo `href` que
apunte a `/juegos/dos-ejes/` en todo `src/pages/` ni en `src/lib/sitio/copy.ts`** — lo
comprobé con una búsqueda de texto sobre los dos, y el único archivo donde aparece
"dos-ejes" en una ruta es el suyo propio.

Es una sala sin puerta: se llega escribiendo la URL a mano, no jugando el sitio. Escribirle
un renglón de "dónde estás parado" a un lugar donde nadie entra caminando es exactamente el
"nombre de relleno" que el encargo pide evitar — nadie lo va a leer nunca, porque nadie va a
estar ahí. No es mío abrirle la puerta: eso es una fila de portal (casete nuevo o enlace
existente), y no es contenido de tono. Dejo la propuesta en
`Docs/SUGERENCIAS/CNT-para-hilo-principal-puerta-dos-ejes.md`, sin renglón adjunto — el día
que alguien le ponga puerta, este documento vuelve a abrirse y se le escribe el noveno.

**Sobre las "seis líneas" del plan:** quedan en ocho. Se lo dejo anotado a quien corra
`T-188` para que ajuste la verificación de esa tarea (dice "las seis líneas nuevas" y son
ocho) — no es mío editar `Docs/ORQ/`, así que lo digo acá y en el reporte de esta ráfaga.

## 2. El método

Cada renglón cumple, sin excepción:

- **Ocho palabras o menos** (`voz-ricotera.md` 4.1: el verso mediano de los 104 temas tiene
  cinco).
- **Registro 1**: segunda persona o imperativo, nunca la explicación de qué botón tocar.
- **Una imagen física y barata**: cuerpo, objeto, animal o plata (4.3) — nunca color, nunca
  psicodelia de utilería.
- **No repite ni una palabra del título del casete o del `h1` de esa pantalla.** El título
  ya dice qué es; el renglón dice dónde estás parado adentro de eso.
- **Sin jerga forzada.** Ninguno usa "che", "viste", "digamos" ni "posta" — el Indio los usa
  9, 15 y 3 veces en 192.000 palabras, y meterlos para sonar de acá es lo que menos suena a
  él. Tampoco metí jerga ricotera de utilería ("guita", "quilombo", etc.): con ocho palabras
  y una imagen concreta, sobraba.
- **Cero épica de tribuna, cero psicodelia de utilería, cero anglicismo, cero emoji, cero
  puntos suspensivos** (con ocho palabras, un suspensivo es puro relleno).
- **Un solo intruso como máximo en todo el conjunto**, y decidí no usar ninguno. La regla
  4.5 de `voz-ricotera.md` dice "puede traer", no "tiene que traer" — con ocho lugares
  distintos ya hay variedad de objeto e imagen; forzar una marca o un nombre propio en algún
  renglón solo para cumplir la cuota hubiera sido el guiño que `CNT-02` prohíbe: uno que
  separa en vez de sumar.

## 3. Las ocho piezas

| Lugar | Renglón | Palabras | Por qué éste y no otro |
|---|---|---|---|
| **El portal** | *"Estás en la puerta, con las dos cintas."* | 8 | El portal ya se llama a sí mismo casetera grabada en casa, lado A / lado B (`PORTAL.ladoA`, `PORTAL.ladoB`). El renglón no inventa una imagen nueva: pone al que llega parado justo ahí, con el objeto de la sección en la mano, antes de elegir un lado. |
| **Preguntas ricoteras** (quiz) | *"Se te cae una moneda en la ranura."* | 8 | Es un arcade: la moneda es la imagen más barata y más física que tiene el género, y **plata** es una de las cuatro categorías que pide 4.3. No compite con el `h1` ("Entrá, sepas lo que sepas"), que ya hace el trabajo de invitar. |
| **Adiviná el tema** | *"La aguja te tiembla sobre el surco."* | 7 | Es el juego de oído: la aguja de un vinilo a punto de tocar el surco es la imagen física exacta del momento antes de escuchar, sin decir "escuchá" — eso ya lo dice `PARTIDA.escuchar`. |
| **Sacalo por la letra** | *"Un papel arrugado te pesa en el bolsillo."* | 8 | El juego se juega con un verso suelto, no con el tema entero: un papel arrugado en el bolsillo es esa misma idea — un pedazo de algo más grande que tenés encima — sin usar la palabra "letra", que ya está en el título. |
| **Completá la letra** | *"Te falta un diente en la sonrisa."* | 7 | La mecánica es literalmente algo que falta. Un diente de menos es la versión física de esa falta, y trae la ternura metida adentro de lo feo que pide 4.4 — no es prolijo, pero tampoco es trágico. Evité repetir "en la punta de la lengua", que ya usa el subtítulo de mecánica. |
| **Adiviná la tapa** | *"Tenés tinta fresca pegada en los dedos."* | 7 | El juego es sobre el arte de Rocambole. En vez de nombrarlo (ya lo nombra el subtítulo: "Rocambole dibujó"), la tinta en los dedos es la huella física de haber estado cerca de un cuadro recién pintado. |
| **Letras y acordes** (cancionero) | *"Tenés la guitarra cruzada en las piernas."* | 7 | Es la sección donde se arma el cancionero para tocar, no solo para leer. La guitarra en las piernas es el cuerpo en postura de tocar, antes de la primera nota — coherente con "armá tu cancionero" del botón de esa página, sin repetirlo. |
| **La Redondopedia** | *"Tenés todo el archivo tirado en el piso."* | 8 | Es una enciclopedia que se arma con `RES-XX`, testimonios y leyendas rotuladas — un archivo, no una biblioteca prolija. Tirado en el piso es desprolijo a propósito: es la imagen de estar en medio de la investigación, no la de un estante ordenado. |

## 4. Los descartes

**Portal —** *"Entrá, que la casetera te espera."* Descartado: repite casi textual el
arranque de `PORTAL.bajada` ("Entrá, que los molinetes van abiertos"), que ya está en la
misma pantalla. Dos líneas que abren igual son una redundancia, no un refuerzo. Y "te
espera" personifica un objeto de un modo genérico que no suma nada concreto.

**Preguntas ricoteras —** *"Estás por sentarte frente a la máquina."* Descartado: "la
máquina" es una imagen de arcade genérico, la que podría estar en cualquier sitio de
trivia del mundo. No dice nada ricotero ni nada físico específico — es la clase de frase
que se siente hecha por default, justo lo que la corrida anti-slop sacó del resto del
sitio. La moneda cayendo en la ranura es más chica y más concreta.

**Adiviná el tema —** *"Escuchá con el oído bien pegado."* Descartado: empieza con un
imperativo que hace el trabajo de instrucción de mecánica, que ya lo hace `PARTIDA.escuchar`
("Escuchá") en la misma pantalla. El renglón tiene que decir dónde estás, no reforzar qué
botón tocar — si lo hace, está compitiendo con la línea que nombra en vez de acompañarla.

**Completá la letra —** *"Un hueco te espera en el verso."* Descartado por dos motivos:
"hueco" es el nombre del campo interno del propio código (`hueco: '________'` en
`letra/copy.ts`) y una ausencia no es un cuerpo, un objeto, un animal ni plata — es un
concepto abstracto disfrazado de imagen. El diente que falta es lo mismo dicho con algo que
se puede tocar.

**La Redondopedia —** *"Estás en el sótano de los archivos."* Descartado: "sótano" inventa
una arquitectura que el sitio no construyó en ningún otro lugar — no hay sótano en la
mitología visual de la Redondopedia, y meterlo ahí es la estética genérica de "archivo
secreto" que no es de acá. El piso, sin sótano, es más pobre y más físico, y no inventa un
edificio que no existe.

## 5. La prueba de los molinetes

Tapo el renglón que canta en cada lugar y miro qué queda: el título, el subtítulo de
mecánica (si lo hay) y el botón — todo eso **ya existía antes de esta pieza y no lo toqué**.
La pregunta es si eso solo alcanza.

| Lugar | Qué queda sin mi renglón | ¿Pasa? |
|---|---|---|
| Portal | `h1` "ARCADE RICOTERO" + `PORTAL.bajada` ("Entrá, que los molinetes van abiertos...") + los ocho casetes con su título y botón | **Sí.** El portal ya se explica solo; mi renglón es atmósfera pura, nunca la única fuente de "qué es esto". |
| Preguntas ricoteras | `h1` "Entrá, sepas lo que sepas." + subtítulo "Preguntas de historia, discos, letras y mitología ricotera." + botón "JUGÁ" | **Sí.** |
| Adiviná el tema | `h1` "Adiviná el tema" + subtítulo de mecánica + botón "Empezá" | **Sí.** |
| Sacalo por la letra | `h1` "Sacalo por la letra" + subtítulo + botón "JUGÁ" | **Sí.** |
| Completá la letra | `h1` "Completá la letra" + subtítulo + botón "Empezá" (o, sin banco, `SIN_BANCO.titulo` "Todavía no" + su explicación) | **Sí**, en los dos estados de la pantalla. |
| Adiviná la tapa | `h1` "Adiviná la tapa" + subtítulo + botón "Empezá" | **Sí.** |
| Letras y acordes | `h1` "Letras y acordes" + el párrafo de `index.astro` ("Los diez discos completos, en orden...") + botón "Armá tu cancionero" | **Sí.** |
| La Redondopedia | `h1` "LA REDONDOPEDIA" + `REDONDOPEDIA.bajada` + la explicación de rótulos + los enlaces a cada artículo | **Sí.** |

Pasan los ocho, y no por casualidad: el diseño de esta pieza fue justamente **no tocar la
línea que nombra**. Si algún renglón hubiera terminado siendo la única pista de dónde
está parado el jugador, habría estado haciendo un trabajo que no le toca — y volvía a la
mesa de dibujo. No hizo falta: los ocho lugares ya tenían su "nombra" resuelto por
`CNT-05`, `T-166`/`T-167` y el resto del copy existente; lo único que faltaba era quien
cantara.

## 6. Lo que le queda a quien cablee esto (`T-188`)

- Ninguno de los ocho renglones reemplaza texto existente en `copy.ts`. Se agregan como
  campo nuevo (sugiero un nombre parejo entre los ocho, por ejemplo `dondeEstas`, en
  `PORTAL`, en cada `PANTALLA_0` de juego, y en `CASETE_CANCIONERO`/`CASETE_REDONDOPEDIA`
  o en el copy que arme `letras-y-acordes/index.astro` y `redondopedia/index.astro` — la
  forma exacta de cablearlo es de `T-188`, no mía).
- Van **ocho**, no seis — ver §1. Si `T-188` corre con la verificación tal como está
  escrita en `ORQ-plan-ciclo-11.md` ("las seis líneas nuevas"), va a contar mal: son ocho
  cadenas nuevas que tienen que aparecer en `voz.test.ts` una vez cableadas.
- `dos-ejes` queda **afuera** hasta que tenga puerta. No hay renglón para cablear ahí.
- Los ocho ya los medí a mano contra las siete reglas de `voz-ricotera.md` §8 (la tabla de
  arriba). Una vez que estén adentro de un módulo de `copy.ts`, van a caer solos bajo
  `node --test src/lib/voz.test.ts` sin que nadie tenga que revisarlos de nuevo a ojo.

## 7. Bloqueos y pendientes

- **Ninguna ficha `RES-XX` pendiente.** Todo el contenido de esta pieza es tono, no hecho
  verificable.
- **La puerta de `dos-ejes`:** propuesta dejada en
  `Docs/SUGERENCIAS/CNT-para-hilo-principal-puerta-dos-ejes.md`, sin renglón — no es mío
  resolver si entra al portal.
- **La discrepancia "seis" vs. "ocho" líneas** en `T-184`/`T-188` de
  `Docs/ORQ/ORQ-plan-ciclo-11.md`: no es mío editar esa carpeta; queda anotada acá y en el
  reporte de esta ráfaga para que `orquestador` o el hilo principal la ajuste.
- **`UX-20`/`UX-20` ("el sitio como lugar")** todavía no existe en disco al cierre de esta
  pieza — trabajé de la doctrina tal como está en `ORQ-plan-ciclo-11.md` directamente. Si
  esa doctrina cambia algo del mapa sección→disco al escribirse, ningún renglón de acá
  depende de un disco específico como para tener que reescribirse — son imágenes físicas
  universales (moneda, aguja, papel, diente, tinta, guitarra, archivo, puerta), no colores
  ni motivos de tapa.

## Cómo se verifica

Hoy, a mano: cada uno de los ocho renglones de la tabla del §3 contra las siete reglas
auditadas por `src/lib/voz.test.ts` §8 — anglicismo, fórmula de folleto, "la gente" vs.
"los fans/usuarios" (no aplica, ninguno nombra al jugador en tercera persona), botón en
infinitivo (no aplica, no son botones, pero ninguno arranca con un verbo de la lista de
todos modos), largo de ocho palabras, puntos suspensivos en un texto corto. Los ocho pasan.

Una vez que `T-188` los cablee en un `copy.ts`, la verificación real y corrible es:

```
node --test src/lib/voz.test.ts
```

tiene que seguir en verde con las ocho cadenas nuevas adentro del recorrido de `VISIBLE`
(la función `cadenas()` que ya barre `sitio.ts`, `quiz/copy.ts`, `tema/copy.ts`,
`letra/copy.ts`, `tapa/copy.ts` y `por-la-letra/copy.ts` las va a encontrar solas apenas
existan, sin que haya que tocar el propio test).

## 8. Reapertura del 2026-10-01 — el renglón de `dos-ejes` (`CNT-26`)

> Apartado agregado. Las secciones 1 a 7 quedan como estaban; donde algo de ellas deja de valer,
> lo dice este apartado.

El 2026-10-01 `dos-ejes` consiguió puerta: un casete en el lado A del portal. Se cae la razón del
descarte de §1 (*"una sala sin puerta"*), se cumple la condición que dejé escrita en
`Docs/SUGERENCIAS/CNT-para-hilo-principal-puerta-dos-ejes.md` (*"se reabre y se le agrega el
renglón"*) y se escribe con el método de §2.

| Lugar | Renglón | Palabras | Por qué éste y no otro |
|---|---|---|---|
| **¿Qué tipo de ricotero sos?** (`dos-ejes`) | *"Una vela te alumbra media cara."* | 6 | La vela es la del recorte de *Luzbelito* con que viste el casete (`UX-06` §5). Alumbra *media* cara, que es mitad y mitad: no le da signo bueno ni malo a la luz ni a la oscuridad antes de la primera pregunta (`BR-17`). No nombra ninguno de los cuatro cuadrantes ni los dos ejes. |

Pasa los seis criterios de §2 y la prueba de §5 (tapado el renglón, el `h1`, el subtítulo y el
botón alcanzan). El detalle, los descartes y la comparación con el provisional que ya estaba
pegado en el código están en `CNT-26` §1.1.

**Lo que este apartado corrige de lo anterior:**

1. **§1 y §6, tercer punto** (*"`dos-ejes` queda afuera"*): deja de valer. Hoy hay renglón.
2. **El número.** La sugerencia de septiembre lo llamó "el noveno" porque se escribió cuando había
   ocho. Hoy hay diez renglones en `LUGARES`: a los ocho de esta pieza se sumaron `ponelos`
   (`US-08`) y `masOMenos` (`CNT-25` §3.1). Éste es el **undécimo**.
3. **§6, cuarto punto, y "Cómo se verifica"** decían que los renglones iban a *"caer solos"* bajo
   `voz.test.ts`. Es cierto para anglicismos, fórmulas de folleto, cómo se nombra a la gente y
   botón en infinitivo. **No lo es para el largo de ocho palabras:** esa regla corre sobre una
   lista explícita (`grandes`) y `LUGARES` no está en ella. Ningún renglón de los once está medido
   por una máquina; los medí a mano. Propuesta al hilo principal en `CNT-26` §6, punto 2.
