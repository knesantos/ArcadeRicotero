# CNT-07 — Pie de *La mosca y la sopa*, y tono de tapas en tres artículos

- **Fecha:** 2026-08-22
- **Estado:** cerrado. Responde `Docs/SUGERENCIAS/HILO-para-contenido-pie-de-la-mosca-y-tono.md`
  (ciclo 4, `T-49`/`T-52`), tarea `T-76` del ciclo 5.
- **Consume:** `RES-44` (`Docs/INVESTIGACION/INV-44-tapas-coveralia.md`), `D-14`, `D-21`,
  `CNT-01` (sección B, ya corregida con el mismo hallazgo), `CNT-04`, `CNT-06`, `UX-05`,
  `src/pages/redondopedia/[slug].astro`, `src/data/redondopedia.json`, `src/data/tapa.json`
  (ítem `TP-010`), `src/lib/sitio/arte.ts`, `scripts/generar-tapas.mjs`.
- **No edita** ninguno de esos archivos: es el único que esta tarea me habilita a escribir.
  Los textos de abajo quedan listos para que se cableen en una tarea de código o en mi
  propia próxima tarea de contenido, como ya se hizo con la pieza equivalente de `CNT-06`.

## 1. El pie de la ficha de *La mosca y la sopa*

**El pie no cambia para los otros nueve discos.** Revisé `FICHAS` en
`scripts/generar-tapas.mjs`: los nueve usan de verdad su `-frontal.jpg` como imagen de
ficha (incluidos `lobo-suelto` y `cordero-atado`, que muestran el frontal del CD1 y del
CD2 respectivamente — dos frontales reales, no una tapa y su reverso). Para esos nueve
"Tapa: Rocambole (Ricardo Cohen), en baja resolución." sigue siendo cierto tal cual está.
No lo toco. (Aparte, quedó a la vista una nota ya existente en `tapa.json` sobre
`un-baion-para-el-ojo-idiota` — autoría compartida con Semilla Bucciarelli sin resolver,
marcada para `revisor` — pero es del banco del juego, no de esta ficha, y no es la tarea
de hoy.)

**Para `la-mosca-y-la-sopa`, la ficha sale de la `-trasera.jpg`** (así lo resolvió
`generar-tapas.mjs` desde el ciclo anterior). El pie genérico dice "Tapa" cuando lo que se
ve es la contratapa, y por `D-14` un rótulo que no dice la verdad sobre lo que hay adentro
no se sostiene aunque el costo sea chico. Texto de reemplazo, solo para este slug:

> **"Contratapa: Rocambole (Ricardo Cohen), en baja resolución. El frontal que circula de
> este disco no es suyo: es un rediseño posterior (RES-44)."**

Por qué este texto y no otro: dice qué cara es (primera palabra, no al final, para que no
se lea como aclaración menor), mantiene el crédito y la resolución tal cual el resto del
sitio, y agrega la razón en una sola cláusula corta en vez de una nota al pie aparte —
nadie tiene que hacer clic para enterarse de que no es lo que parece.

**La segunda mitad: esto es materia de artículo, no solo de pie.** Que la única cara
frontal disponible de este disco sea ajena a Rocambole es, en sí, un dato de la historia
de la tapa — más interesante que el trámite de corregir un rótulo. Va como nuevo segmento
de `cuerpo` en la ficha de `redondopedia.json`, **rotulado hecho**, insertado inmediatamente
después del segmento de testimonio que ya cuenta las tres ideas superpuestas de Rocambole
(gato momificado, cerdos y peces, la noticia de los jubilados) y antes del segmento sobre
"Mi perro dinamita":

> **Texto:** "La portada que describe ese testimonio —con el gato momificado y los cerdos
> y peces— no es la que se puede mostrar acá: la única cara frontal que circula hoy de
> este disco es un rediseño posterior, con una foto de recital y el título estampado
> encima, sin ninguno de esos elementos. La cara que sí se puede acreditar con seguridad a
> Rocambole es la contratapa, con la olla y el cucharón que le dan nombre al disco — la
> imagen que acompaña esta ficha."
> **Rótulo:** hecho
> **Fuente:** RES-44

Por qué esta redacción: conecta explícitamente con el testimonio anterior en vez de
repetir sus datos (evita que el lector piense que son dos anécdotas distintas), no
especula sobre quién hizo el rediseño ni cuándo — `RES-44` no lo dice y no lo invento—, y
cierra explicando por qué la ficha muestra lo que muestra, que es la pregunta que a
cualquier fan que reconozca el frontal "raro" le va a quedar picando.

**Descarté** escribir el segmento como "leyenda" — no lo es, es un hallazgo verificado de
`RES-44`, no un rumor que circula sin fuente. También descarté ponerlo primero en el
cuerpo, antes de los diez temas: la ficha abre con el disco en sí (temas, sello, fecha), no
con un problema de archivo de imagen, así que el orden narrativo lo deja donde el lector ya
tiene el contexto del testimonio para entenderlo.

## 2. La exclusión por tono en tres artículos: confirmado, se mantiene, sin sumar ninguno

**Veredicto: el detalle sí molesta ahí, y la lista queda como está** —
`muerte-del-indio`, `walter-bulacio`, `olavarria-2017`, sin agregar ni sacar ningún slug.

Por qué sí molesta, con la misma vara de `CNT-04`/`CNT-06`: el problema que esas dos piezas
identificaron no es exclusivo del formato multiple choice — es más general, "que la muerte
de una persona con nombre no se trate como ocasión para un adorno". `CNT-06` ya mostró que
en prosa el riesgo cambia de forma (no hay puntaje ni "ganador", pero sí hay lenguaje que
puede convertir el hecho en clímax narrativo) y sigue exigiendo sobriedad. Un recorte
decorativo de tapa —collage, pincelada, tira de historieta según el disco que le toque a
la sección— es tinta festiva por diseño: es exactamente el mismo lenguaje visual que viste
el resto de la Redondopedia, y ponerlo pegado al título de "Walter Bulacio" u "Olavarría
2017" es la versión visual de lo que `CNT-06` ya vetó en texto: tratar la muerte como una
pieza más de la mitología ricotera en vez de un hecho con peso propio. La distancia entre
"no explotar en prosa" (`CNT-06`) y "no decorar el título" es chica, y las tres piezas
tironean para el mismo lado que ya empujó `experiencia` al implementarlo.

**Repasé los 29 artículos para ver si falta alguno, y no encontré ninguno más que
califique:**

- Ningún otro `hito` es una muerte real de una persona con nombre. `la-separacion` y
  `huracan-93-94` y `debut-en-obras` y `la-formacion` son hitos de la banda sin una muerte
  puntual detrás — el criterio de `CNT-04`/`CNT-06` no aplica ahí en absoluto.
- Los cinco `persona` (`indio-solari`, `skay-beilinson`, `la-negra-poli`,
  `semilla-bucciarelli`, `rocambole`) son biografías: aunque `indio-solari` seguramente
  mencione su muerte como parte del relato de una vida entera, el artículo no está
  *centrado* en la muerte — es lo contrario de `muerte-del-indio`, que sí lo está por
  título y por objeto. Aplicarles la exclusión sería tratar cualquier biografía de alguien
  fallecido como si fuera un obituario, que no es lo que es una ficha de persona en esta
  enciclopedia. No entra.
- Ninguna de las tres `leyenda` (`la-leyenda-de-ji-ji-ji`, `patricio-rey`,
  `los-mitos-del-indio`) ni los cuatro `concepto` tratan una muerte real con nombre propio.
  No entra ninguno.

**Si concluyera lo contrario** —que el detalle no molesta— la lista se sacaría entera de
`arte.ts` y `detalleArticulo` dejaría de necesitar el `SIN_DETALLE_POR_TONO`. No es el caso:
la opción conservadora que implementó `experiencia` queda confirmada como la correcta, no
como un placeholder a la espera de esta ficha.

## 3. La deuda de `src/lib/tapa/copy.ts`: no la tomo en esta tarea, queda para una `CNT-XX` propia

El pedido de decidir "ahora o después" lo resuelvo por **después, en una tarea con su
propio archivo**. Tres razones, ninguna es evasiva:

1. Esta tarea me habilita un solo archivo (`CNT-07-pies-y-tono-de-tapas.md`) con un
   alcance ya nombrado en su título — pies y tono de tapas de la Redondopedia. El copy de
   "adivinar la tapa" es otro juego, otro público de decisiones (qué dice la pantalla de
   inicio, cómo se nombra un acierto, cómo se pide "seguir") y merece su propio documento
   con su propio criterio de estilo, igual que `CNT-05` lo tiene para el quiz — no un
   apéndice de tres líneas colgado de un documento que ya cerró su tema.
2. No hay urgencia que lo fuerce: el criterio prestado del hilo principal ya sigue `CNT-02`
   y `D-17` y hoy funciona bien — está anotado como deuda, no como algo roto.
3. Mezclar los dos en el mismo archivo generaría el mismo problema que la regla de
   propiedad de carpetas busca evitar: un documento cuyo nombre no dice de qué trata todo
   lo que contiene.

**Queda pedido, para una próxima ráfaga:** `CNT-08` (o el número que corresponda al
abrirse), donde `src/lib/tapa/copy.ts` se transcribe desde el documento nuevo y deja de
ser criterio prestado — el mismo mecanismo que ya usó `CNT-05` con el quiz.

## SIGUIENTE

- El pie de `la-mosca-y-la-sopa` y el nuevo segmento de `cuerpo` quedan listos para
  cablear: el primero en `src/pages/redondopedia/[slug].astro` (condicional por slug sobre
  la línea 89), el segundo en `src/data/redondopedia.json` (nuevo objeto en el array
  `cuerpo` de ese artículo, en la posición indicada arriba). Ninguno de los dos lo hago yo
  en esta tarea porque el único archivo habilitado es este.
- `SIN_DETALLE_POR_TONO` en `src/lib/sitio/arte.ts` queda confirmado sin cambios — la nota
  de código que decía "queda pendiente que lo confirme `contenido`" ya puede borrarse.
- Cuando se planifique, `orquestador` puede abrir la tarea de `CNT-08` (copy de "adivinar
  la tapa") como frente propio.
