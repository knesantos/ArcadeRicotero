# INV-21 — Fuente de letras y estructura de *Fuimos reyes*

> Tercera tanda de la sesión paralela de investigación, 2026-08-19. Dos encargos concretos
> del usuario: sacar la discografía y cronología de *Fuimos reyes* desde el lector web, y
> usar letras.com como fuente de letras.
>
> Consume: `RES-20` (tracklists), `RES-03` (marco de derechos), `BR-03`.
> Afecta: `US-03` (completar la letra), `CNT-01`.
>
> **Numeración:** rango `RES-20`–`RES-29`. Consume `RES-23` y `RES-24`.
>
> **Las dos fichas dan resultado negativo o parcial.** Ninguna de las dos entrega lo que se
> pidió, y en los dos casos el motivo es del lado de la fuente, no del método.
>
> ⚠ **Leé el final antes de actuar sobre `RES-23`.** El usuario, con la objeción sobre la
> mesa, **decidió usar letras.com igual**, con fundamento y con cinco mitigaciones. La
> sección "Decisión del usuario sobre `RES-23`" cierra este archivo. La ficha describe el
> riesgo; la decisión lo acepta acotado. **No son contradictorias: conviven a propósito.**

---

## RES-23 — letras.com no sirve como fuente de letras para este proyecto

Responde la **pregunta 9** de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`, que
pedía textualmente: *"Fuente confiable del texto exacto de cada letra a citar (para no
transcribir de oído ni de una fuente de fans sin respaldo)"*.

**La respuesta es que letras.com es, precisamente, una fuente de fans sin respaldo.**

### Lo que encontré

- **Hallazgo:** el sitio lista **149 canciones** atribuidas a Patricio Rey y sus Redonditos
  de Ricota, ordenadas alfabéticamente y por más escuchadas, con una sección de discografía
  que en esa vista muestra solo cuatro álbumes.
  URL: https://www.letras.com/los-redonditos-de-ricota/
  Consultado: 2026-08-19 · **verificado**
- **Hallazgo:** el sitio **invita a los usuarios a enviar letras, correcciones y
  traducciones**. El contenido es de contribución abierta.
  Consultado: 2026-08-19 · **verificado**
- **Hallazgo:** en el pie figura un aviso genérico de copyright del sitio y la escala del
  catálogo (millones de canciones). **No aparece ninguna documentación de licencia con
  editoriales musicales, ni mención de acuerdos tipo entidad de gestión.**
  Consultado: 2026-08-19 · **verificado — ausencia constatada, no inferida**

### Los dos problemas, en orden de gravedad

1. **No tiene respaldo declarado.** Es exactamente lo que `contenido` pidió evitar. Una
   letra tomada de ahí es una transcripción de un fan anónimo: puede estar bien, puede
   tener un verso cambiado, y **no hay forma de saberlo desde el sitio**. Para el juego 3
   eso es fatal de una manera muy concreta: si el jugador tiene que completar un verso y el
   verso está mal transcripto, **el juego marca error a quien sabe la letra de verdad**. Es
   el peor error posible según el criterio no negociable 1.
2. **149 canciones contra 105.** `RES-20` fijó que los diez discos de estudio suman **105
   temas**. El sitio agrupa bajo el mismo nombre material del **Indio solista, de Los
   Fundamentalistas y de Skay**, más versiones en vivo y variantes de título. **Casi 45
   entradas de más.** Quien cargue ítems desde ahí sin cruzar contra `RES-20` va a meter en
   el quiz de Patricio Rey temas que no son de Patricio Rey.

### Qué hacer en su lugar

- **La fuente correcta sigue siendo el arte de los discos**, como dijo `contenido` desde el
  principio. No es un problema de volumen: **`BR-03` muestra 2, 1 o 0 versos** según
  dificultad. Para el piso de `US-03` (15 ítems) hacen falta **del orden de 30 versos en
  total**, no quince letras enteras.
- **`RES-20` es el filtro obligatorio.** Cualquier tema que entre a `US-02` o `US-03` tiene
  que estar en la lista de 105. Si no está, no es de Patricio Rey.
- **letras.com sí sirve para una cosa:** para *localizar* en qué tema está un verso que uno
  recuerda a medias. Como buscador, bien. Como fuente citable, no.
- **`CNT-01` no puede cerrar la casilla de letras con esta ficha.** La pregunta 9 queda
  **respondida en negativo**: la fuente propuesta no califica. La casilla sigue abierta.

### Nota sobre el alcance de esta ficha

Verifiqué la **naturaleza y confiabilidad de la fuente**, que es lo que la pregunta 9
pedía. **No volqué letras al repo.** Además del criterio del proyecto, hay un motivo de
orden: el gate de `D-07` bloquea publicar hasta que `CNT-01` cierre, y la casilla de letras
es justamente una de las que esta ficha deja abiertas. Cargar el texto antes de eso sería
construir sobre la casilla que todavía no cerró.

Cuando `contenido` cargue los versos, el techo ya está fijado y hay margen de sobra:
`RES-03` da **1000 palabras** de cita y `BR-03` usa dos versos por ítem.

---

## RES-24 — *Fuimos reyes*: el preview no da la discografía, pero sí el mapa completo

### Lo que se pidió y por qué no salió

El usuario pasó dos links al lector de `reader.digitalbooks.pro` para sacar la discografía
y la cronología. **No están accesibles.**

- **Hallazgo:** el lector es una SPA (plataforma **Amabook**); el contenido vive en un
  iframe que sirve archivos `redonditos-N.html`. `WebFetch` solo devuelve el cascarón, así
  que la verificación se hizo abriendo el lector en un navegador real.
  Consultado: 2026-08-19 · **verificado**
- **Hallazgo:** el preview está topeado en **1%** del libro y solo expone el material
  preliminar: portadilla, legales y la dedicatoria de los autores. El indicador de progreso
  marca 1% y la interfaz ofrece botones **"Buy"** y **"Bookshop"**.
  Consultado: 2026-08-19 · **verificado**
- **Hallazgo:** el índice **lista** "Fuentes consultadas", "Bibliografía" y "Discografía",
  pero **hacer clic en ellos no carga nada**: el iframe se queda en la página preliminar.
  Están en el índice, no en el preview.
  Consultado: 2026-08-19 · **verificado**

**No fui a buscar esas páginas por otra vía.** El libro está a la venta y el preview es
justamente el límite que el editor puso; adivinar URLs para saltarlo sería sacar de atrás
del mostrador lo que la vitrina no muestra. **Para tener la discografía de este libro hay
que tener el libro.**

### Lo que sí quedó, y sirve

El índice completo cargó entero. Es un **mapa de dónde está cada cosa**, que le ahorra a
`contenido` abrir el libro al voleo cuando el usuario lo consiga.

**Estructura:** prólogo de Mariana Enríquez ("Una historia de amor, locura y muerte"),
introducción, dos partes con un intermezzo, epílogo, y las tres secciones de referencia del
final.

| Primera parte | Segunda parte |
|---|---|
| 1. Caldo de cultivo | 12. Patricio, rey de la selva |
| 2. Paz, amor y ERP | 13. El sonido y la furia |
| 3. La nave de los locos | **14. Huracán** |
| **4. El nacimiento de Patricio Rey** | 15. La cola del diablo |
| 5. Salta-La Plata-Buenos Aires | 16. Un eléctrico ardor |
| 6. Contacto en Excursionistas | 17. Dolores dulces |
| 7. Cambio de piel | 18. River Plate, tu grato nombre |
| **8. Gulp!: el nacimiento de la pyme** | 19. El carnaval crepuscular |
| **9. En el mes de octubre** | 20. El abrazo partido |
| **10. El baión de la transversalidad** | Epílogo. Apenas un suspiro |
| 11. Pasión, locura y muerte | Fuentes consultadas · Bibliografía · **Discografía** |

### Cómo se cruza con lo que ya está fichado

Los títulos de capítulo son datos, y confirman que el libro cubre justo los huecos abiertos:

- **Cap. 4, "El nacimiento de Patricio Rey"** — es el capítulo que puede cerrar la
  corrección de `RES-22`: si Patricio Rey fue solo un personaje inventado o si hubo un
  Pancho Silva detrás. Hoy eso está como leyenda con fuente identificable.
- **Cap. 8, "Gulp!: el nacimiento de la pyme"** — puede cerrar **la fecha de *Gulp!***, que
  `RES-20` dejó con tres versiones en circulación. Es la discrepancia más fácil de resolver
  de las tres.
- **Caps. 9 y 10** — *Oktubre* y *Un baión*, los dos discos con más material de tapa
  pendiente de verificación en `RES-06`.
- **Cap. 14, "Huracán"** — el capítulo de los recitales que el BRIEF citaba mal (`RES-05`:
  fue 1993 y 1994, no 1989).
- **"Discografía"** al final — es la sección que confirmaría o corregiría `RES-02` y
  `RES-20` desde una fuente editada y no colaborativa. **Es la más valiosa del libro para
  este proyecto**, y es la que el preview no da.

> **Recomendación operativa:** si el usuario consigue *Fuimos reyes* en papel o en una
> edición completa, **la sección "Discografía" del final es lo primero que hay que abrir**,
> no el capítulo 1. Resuelve de un saque la fecha de *Gulp!*, el conteo de *Lobo suelto* y
> el sello de cada disco, que son las tres discrepancias vivas del proyecto.

---

## Estado de las preguntas de `contenido` después de esta tanda

| # | Pregunta | Estado |
|---|---|---|
| 3 | Titular de derechos de cada tema | **parcial** — `RES-09`: Erks S.A.; falta SADAIC |
| 4 | Titularidad de las tapas | abierta |
| 5 | Postura de Rocambole | **respondida** — `RES-06` |
| 6 | Listado de tapas por disco | **parcial** — `RES-06` + `RES-22` |
| 8 | Autoría de las letras | **respondida** — `RES-20` (Solari–Beilinson, dos excepciones) |
| **9** | **Fuente confiable del texto de las letras** | **respondida en negativo — `RES-23`** |
| 10 | Marca registrada | **parcial** — `RES-09`: INPI vía Erks; faltan las clases |
| 11 | Política pública sobre fan sites | abierta |
| 1, 2, 7 | Uso permitido de audio, YouTube, cita de versos | abiertas — `RES-03` da el marco general |

## Sin resolver

- **El texto de las letras.** Sin fuente citable. Sale del arte de los discos.
- **La sección Discografía de *Fuimos reyes***. Requiere el libro.
- **Las tres discrepancias de `RES-20`**: fecha de *Gulp!*, conteo de *Lobo suelto*,
  duraciones del vol. 2.
- **El esclavo de *Oktubre***, todavía en "reportado" desde `RES-06`.

---

## Decisión del usuario sobre `RES-23` — se usan igual, con mitigaciones

**Fecha:** 2026-08-19. **Planteada la objeción de `RES-23`, el usuario decidió seguir
adelante.** Queda registrado acá porque una ficha que termina en "no sirve" y una decisión
que dice "usalo igual" tienen que convivir en el mismo lugar, o dentro de dos meses nadie
entiende por qué el banco cita una fuente que la investigación había descartado.

### La decisión y su fundamento

> Usar letras.com y **bestiarioredondo** como fuentes de letras. Razón dada: *la banda
> tiene una mística de pocas cosas oficiales*, y no va a aparecer una fuente autorizada.

**El fundamento es correcto y esta investigación lo respalda**, aunque yo no lo había
formulado así:

- No existe sitio oficial de letras de la banda. No lo hubo nunca.
- El memoir del Indio **no trae letras completas** (`RES-21`): cita versos sueltos dentro
  de la conversación.
- La única fuente con autoridad es **el arte de los discos**, que es material físico y
  offline.
- La banda construyó su fenómeno **sin multinacional, sin TV y sin publicitar sus
  recitales** (`RES-07`). Que no haya un canon digital oficial no es un descuido: es
  coherente con cómo funcionó siempre.

Esperar una fuente oficial es esperar algo que la banda deliberadamente nunca produjo.
**Exigir un estándar de verificación que la propia banda hizo imposible bloquearía `US-03`
para siempre.**

### Lo que la decisión NO disuelve

El riesgo de `RES-23` sigue existiendo y hay que mirarlo de frente: **si un verso está mal
transcripto, el juego le marca error justo al que se sabe la letra.** Es el fallo más caro
posible frente a este público. La decisión **acepta** ese riesgo, no lo elimina.

La buena noticia es que es barato de acotar, porque el volumen es chico.

### Las cinco mitigaciones, de la más barata a la más cara

1. **Cruzar todo contra los 105 temas de `RES-20`. Obligatorio y gratis.** Mata por
   completo el problema de las 149 entradas: sin esto entran al quiz de Patricio Rey temas
   del Indio solista y de Skay. **Es el único error concreto y demostrado que hoy tiene la
   fuente, y se resuelve con una comparación de listas.**
2. **Dos fuentes que coincidan.** Si letras.com y otro sitio dan el mismo verso, la
   probabilidad de error cae mucho. Sigue sin ser autoridad, pero deja de ser un solo fan
   anónimo.
3. **Empezar por los temas más conocidos.** Un error en un verso de "Ji ji ji" o "Todo un
   palo" lo caza cualquiera; uno en un tema lateral puede quedar años. Además `US-03` no
   necesita rarezas: necesita que el jugador reconozca.
4. **Marcar la fuente en el JSON de cada ítem.** Así una corrección futura es trazable y no
   hay que auditar el banco entero. `CTR-02` ya exige el campo `fuentes`.
5. **Confirmar de oído contra el disco.** Es lo único que cierra de verdad, y **es
   realista**: `BR-03` muestra 2, 1 o 0 versos, así que el piso de `US-03` (15 ítems)
   necesita **del orden de 30 versos**. Eso se verifica en una tarde escuchando, no en un
   proyecto de investigación.

**Con la mitigación 1 aplicada y la 5 hecha sobre 30 versos, el riesgo real queda casi en
cero.** Lo que `RES-23` decía sigue siendo cierto —la fuente no tiene respaldo— pero deja
de importar en la práctica, porque el volumen es tan chico que se puede verificar a mano.

### Pendiente para el hilo principal

Esto **merece un `D-XX` en `Docs/DECISIONES.md`**: es una decisión de proyecto, con
alternativa descartada (esperar fuente oficial) y consecuencia asumida (riesgo de verso mal
transcripto, acotado por las cinco mitigaciones). **No le pongo número desde acá**: `D-12`
es el último usado y no hay reserva del prefijo `D-` entre sesiones, así que asignarlo yo
arriesga exactamente la colisión que `Docs/IDS.md` existe para evitar. Que lo numere el
hilo principal.

### Sobre bestiarioredondo como fuente

Se suma como fuente por decisión del usuario. **Ojo con una cosa:** por los nombres de
archivo de su Drive —títulos de temas, uno por pieza— parece ser **obra ilustrada original**
sobre las canciones, no una transcripción de letras ni arte de Rocambole. Si es así, sirve
como **fuente iconográfica**, no como fuente del texto de las letras. Está siendo
investigado en la corrida de imágenes; ver la ficha de imágenes cuando cierre.
