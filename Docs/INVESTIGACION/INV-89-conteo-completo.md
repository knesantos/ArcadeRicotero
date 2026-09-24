# INV-89 — El conteo completo de veces tocado en vivo (setlist.fm), para `D-46`

> **Corregida el 2026-09-24** tras una verificación cruzada sobre la entrega anterior de
> esta misma ficha. Pedido del hilo principal, tarea `T-282` del ciclo 16. Responde a
> `D-46` (al final de `Docs/DECISIONES.md`): la dificultad de todo juego con canciones se
> infiere del conteo citado de veces tocado en vivo, y para partir el catálogo en tercios
> hace falta el conteo de **todos** los temas que lista la página de estadísticas, no solo
> el top-25 de `RES-74` (`INV-73`).
>
> **Consume:** `D-46`, `D-45` (y su enmienda), `RES-73` a `RES-75` (`INV-73`), `RES-76` a
> `RES-88` (`INV-76`), `RES-20`.
>
> **Afecta:** `CTR-19` (`T-284`, el conteo completo entra al contrato), `T-285` (la
> dificultad inferida en `popularidad.ts`/`en-vivo.ts`), `BR-30` (`T-283`, qué juegos usan
> esto).
>
> **Numeración de este archivo:** `RES-89` a `RES-92`, siguiente libre después de `INV-76`
> (que cerró en `RES-88`). `RES-92` es nuevo en esta pasada: documenta la verificación
> cruzada y una corrección real sobre `RES-90`/`RES-91`.
>
> Fecha de consulta de todo lo que sigue: **2026-09-24**. URL única fuente:
> https://www.setlist.fm/stats/patricio-rey-y-sus-redonditos-de-ricota-bd615a2.html
>
> **Escrita por `investigador`; pegada por el hilo principal**, porque el rol es de solo
> lectura y no tiene con qué escribir en su propia carpeta.

---

## RES-89 — Método, cobertura y confianza del conteo

| # | Hallazgo | Estado |
|---|---|---|
| `RES-89.1` | La página de estadísticas trae una tabla de "most played songs" **rankeada y numerada de forma explícita hasta el puesto 147** (el último con número propio es "¡Lobo ¿estás?!", 1 vez). Cada puesto 1-146 tiene un conteo **decreciente y distinto** (101 → 2); el 147 ya cae a empate en 1 | verificado |
| `RES-89.2` | Los **25 primeros coinciden exactamente**, título y número, con `RES-74` (`INV-73`): mismo orden, mismos 25 valores (101, 93, 90, 80, 71, 69, 68, 61, 58, 57, 55, 53, 52, 50, 49, 49, 47, 46, 45, 44, 44, 43, 41, 41, 41) | verificado, re-confirmado en `RES-92` |
| `RES-89.3` | **Verificación cruzada puntual** (pedido de cita literal, no resumen) sobre tres títulos de la mitad de la tabla: "Hercules mío" → **dos entradas distintas en la página real**: la propia banda (3 veces) y un cover de Vivi Tellas (1 vez, con el link `stats/songs/vivi-tellas-...`); "Espejismo" → 3, coincide con la tabla principal; "Sheriff" → 3, coincide. Confirma que la tabla numerada 1-146 es fiable, y expone que **algunos títulos comparten nombre entre la banda y un cover de otro artista** — hay que leer la etiqueta `(... cover)` antes de sumar | verificado, con el matiz anotado |
| `RES-89.4` | **Más allá del puesto 147**, la página sigue listando títulos empatados en 1 reproducción **sin numerarlos individualmente**, en **orden alfabético**. Pude extraer **51 de esos títulos**. En `RES-92` confirmé, releyendo literalmente los últimos 15 títulos de toda la página, que el orden alfabético de la cola es real (W→N descendente) y que **"Willy Crook Saxophone Solo" es el último título de la tabla completa** — coincide con la verificación cruzada externa que recibió esta ficha | confianza alta en orden y límite final; confianza media en que sean *todos* los de 1 reproducción (ver Sin resolver) |
| `RES-89.5` | La herramienta reportó alguna vez un total de "246 títulos en toda la página" al cierre de una pasada resumida. **Sigue sin tomarse como hallazgo verificado.** En `RES-92` volví a intentarlo dos veces más pidiendo texto literal (no resumen): la página **no tiene, en ningún lugar visible, un contador-resumen del tipo "X distinct songs"** cerca del encabezado — el único número grande visible es "256", que es la cantidad total de *setlists* (recitales, ya documentado en `INV-73`/`INV-76`), no de canciones distintas. Pedir a `WebFetch` el conteo exacto de filas de toda la tabla volvió a fallar, citando "contenido demasiado extenso para contar con certeza" | **no verificado, confirmado que no es verificable con este método** |

**Conclusión de cobertura:** el conteo **confiable y completo** son los **147 puestos numerados** (conteo ≥ 1, todos con número de ranking propio y valor distinto o el primer empate). La cola de títulos empatados en 1 reproducción más allá del 147 **existe, está alfabetizada y tiene un final confirmado** ("Willy Crook Saxophone Solo"), pero no se pudo extraer completa con la misma confianza que el resto — ver "Sin resolver".

---

## RES-90 — El conteo completo (198 títulos obtenidos, título tal como aparece en la página)

Va como lista estructurada (`conteo` de esta entrega) y como anexo en tabla al final de
este texto. **147 con ranking numerado propio** (confianza alta) + **51 de la cola
empatada en 1 reproducción** (confianza alta en el listado, ver `RES-89.4`) = **198**.

**Corrección de esta pasada:** el ítem de la cola que antes decía "'Olé olé olé olé,
Patricio Rey' (posible duplicado del anterior, sin resolver)" se renombra a "'Olé olé olé
olé, Patricio Rey' (Lange Jojo cover)" — es un título distinto, no un duplicado. Ver
`RES-92`. El valor (1 vez) no cambia, el total de 198 tampoco.

---

## RES-91 — Cruce contra el catálogo de 105/104 (`RES-20`, `src/data/cancionero.json`)

Método: los 104 títulos de `src/data/cancionero.json` (falta *Sushi*, instrumental, ya
explicado y cerrado en la nota del hilo principal sobre `INV-73`) contra los 198 títulos
de `RES-90`, a ojo por coincidencia textual con tolerancia a tilde/mayúscula/guion —
mismo criterio que ya usó `RES-75`.

- **Coinciden directo o con variante trivial de grafía** (mismo criterio que `RES-75`):
  la inmensa mayoría de los puestos 1-146 con conteo ≥ 2. Variantes puntuales, del mismo
  tipo que ya documentó `RES-75`: "Ñam fri **fruli** fali fru" (catálogo: "frufi"),
  "Barbazul **vs.**" (catálogo: "versus"), "Semen **Up**" (catálogo: "Semen-**Up**"),
  "**Fusilados por la Cruz Roja**" (catálogo: minúscula en "cruz roja"), "¡**Cruz
  diablo!**" (catálogo: sin el ¡ inicial), "**Fanfarría** del cabrío" (catálogo:
  "Fanfarria", sin tilde), "**Nuotatori profesionisti**" (catálogo: "professionisti", con
  doble s), "¡**Me matan limón!**" (catálogo: "Me matan, **Limón**!"), "**Esto es
  to-to-todo amigos!**" (catálogo: con el ¡ inicial), "¡**Lobo ¿estás?!**" (catálogo:
  "¡¿Lobo estás?!", el orden de los signos cambia).
- **Caso "Mariposa Pontiac" / "Rock del país" — confirmado sistemático, ya no aislado.**
  Aparecen **las tres formas**: "Mariposa Pontiac" solo (puesto 22, 43), "Rock del país"
  solo (puesto 34, 37), y "Mariposa Pontiac / Rock del país" combinado (puesto 77, 10) —
  y en la cola, incluso un combinado de cuatro. El catálogo solo tiene el combinado
  "Mariposa Pontiac - Rock del país" (una entrada). **No lo resuelvo yo** — es trabajo de
  ingesta (`T-285`/`T-284`).
- **No pertenecen al catálogo de 105, clasificados como en `RES-75`:**
  - *inédito*: "Un tal Brigitte Bardot" (puesto 4, 80) y "Nene nena" (puesto 7, 68), ya
    confirmados por `RES-75`; y sus apariciones combinadas en la cola, más "Ese gordo
    tramposo" suelto (puesto 30, 39).
  - *cover/colaboración*: "Monólogo (Enrique Symns cover)", "Mi mamá alemana (Vivi Tellas
    cover)", "Monólogo (Sergio 'Mufercho' Martínez cover)", "Imperialismo espacial (La
    Cofradía de la Flor Solar cover)", "Hercules mío" en su forma de la cola (cover de
    Vivi Tellas, `RES-89.3`), y **"Olé olé olé olé, Patricio Rey" (Lange Jojo cover, 1
    vez) — reclasificado acá en esta pasada, antes estaba en "sin resolver"** (`RES-92`).
  - *intro/cinta/interludio, no es canción*: "Patricio Disco Show", "Patricio Super
    Show", "Instrumental Jam", "Skay Guitar Solo", "Willy Crook Saxophone Solo",
    "Palabras iniciales por Mufercho", "Presentacion".
  - *cántico de cancha / himno*: "'Pongan huevo Los Redondos'", "'Vamos Redondos, con
    huevo vaya al frente'", "'Vamos Los Redo'", **"Olé olé olé olé, Patricio Rey" de la
    banda misma, 2 veces (versión no-cover)**, "Himno Nacional Argentino".
  - *tradicional/cover tocado "con el público"* (coincide con lo que ya vio `RES-77` de
    MusicBrainz): "Es un sentimiento" (puesto 41, 31), "Desde el alma" (cola, 1), "Cuando
    calienta el sol" (cola, 1).
  - **El resto de la cola de 1 reproducción y algunos sueltos del cuerpo principal (por
    ejemplo "Blues del noticiero" 32, "El regreso de Mao" 29, "Roxana Porchelana" 29, "Mi
    genio amor" 10, "Pura suerte" 12, y ~35 títulos más de la cola) siguen sin
    clasificar**: no están en el catálogo de 104/105 y no hay de dónde sacar si son
    covers, inéditos o variantes de grafía sin resolver.

---

## RES-92 — Verificación cruzada (segunda pasada, 2026-09-24) y una corrección real

| # | Hallazgo | Estado |
|---|---|---|
| `RES-92.1` | Re-consulté los 12 puntos de control de la verificación cruzada recibida (puestos 1, 4, 8, 25, 48, 68, 77, 89, 133, 143, 147, y "Willy Crook Saxophone Solo"): **los 12 siguen coincidiendo exacto** con `RES-90`. Cierro esta verificación cruzada como confirmada, sin cambios sobre esos valores | verificado, cerrado |
| `RES-92.2` | **Corrección real.** El ítem de la cola que `RES-90` original marcaba como "posible duplicado, sin resolver" de "Olé olé olé olé, Patricio Rey" **no es un duplicado**: es un **cover de Lange Jojo**, con su propia página de estadísticas (`stats/songs/lange-jojo-bd46976.html`) y **1 reproducción**. La entrada de la banda misma tiene **2 reproducciones**. Son dos temas distintos con el mismo título, igual que ya pasaba con "Hercules mío" (`RES-89.3`) | verificado |
| `RES-92.3` | La posición numérica que devolvió `WebFetch` para "Olé olé olé olé, Patricio Rey" en esta pasada (147) **no coincide** con la posición ya verificada en la pasada anterior (143, confirmada en `RES-92.1` entre los 12 puntos de control). El título y el conteo (2 veces) son consistentes entre ambas lecturas; **la posición numérica no lo es**. Confirma, de nuevo, que pedirle a `WebFetch` un número de puesto de forma directa es el método frágil ya señalado en la verificación cruzada recibida — acá quedan **las dos lecturas de posición sin promediar**: 143 (verificada contra los 12 puntos de control) y 147 (esta pasada, no confirmada) | dos lecturas, sin promediar — priorizo 143 por estar dentro del set de 12 puntos re-verificados |
| `RES-92.4` | Intento adicional de fijar el total exacto de títulos de la tabla (`RES-89.5`): confirmado que **no hay contador-resumen visible en la página** con el total de canciones distintas; el único número grande cercano al encabezado es "256", que es la cantidad de *setlists*, no de canciones. Pedir el conteo exacto de filas volvió a fallar por el mismo motivo que documentó la verificación cruzada recibida ("contenido demasiado extenso"). **Sigue sin verificarse** | no verificado, ya no es cuestión de reintentar con este método |

---

## Sin resolver

- **El total exacto de títulos de la página** (¿246, u otro número?) sigue sin verificar.
  Esta pasada agotó lo que se puede hacer con `WebFetch`: no hay contador-resumen en la
  página y pedir el conteo de filas exacto falla dos de dos veces por "extensión". Si
  `T-284`/`T-285` necesitan el total exacto, hace falta parsear el HTML crudo con un
  script — fuera del alcance de las herramientas de `investigador`.
- **La cola completa de 1 reproducción.** El límite final está confirmado ("Willy Crook
  Saxophone Solo") y el orden alfabético también, pero no hay garantía de que los 51
  títulos extraídos sean *todos* los que hay entre "¿Adónde van?" y "Willy Crook..." —
  podría haber huecos en el medio del alfabeto que no se pidieron explícitamente.
- **La suma correcta para "Mariposa Pontiac" / "Rock del país"** cuando se combinan contra
  el catálogo — es una decisión de ingesta, no un hallazgo mío.
- **~35 títulos sin clasificar** (ni catálogo, ni inédito, ni cover, ni cántico
  confirmado) — quedaron listados en el anexo, sin fuente para decidir su naturaleza.
- **Nota metodológica para pasadas futuras** (no afecta ningún valor de esta ficha):
  pedirle a `WebFetch` "decime el título del puesto N" de forma directa es poco fiable
  (desvíos de posición documentados en la verificación recibida y en `RES-92.3`). Pedir
  copia literal contigua de un tramo, o buscar un título puntual y su conteo, da
  resultados consistentes — ese es el método a usar en `T-284`/futuras pasadas.
- El desvío de 256 vs. 255 recitales y el resto de lo que ya dejó abierto `INV-73`/`INV-76`
  sigue igual: esta ficha no lo tocó.

## Siguiente

- **`arquitectura`** (`T-284`, `CTR-19`): el conteo de 147 puestos numerados + 51 de cola
  (198 en total) es la base para los tercios de `D-46`; decidir si el total exacto de la
  página (sin verificar) importa para el reparto o si alcanza con lo ya confiable.
- **hilo principal** (`T-285`): construir el cruce título→slug con el criterio de
  normalización de `RES-75` contra este conteo; el caso "Mariposa Pontiac"/"Rock del país"
  necesita una regla explícita.
- **`producto`** (`T-283`, `BR-30`): con el conteo completo en la mano, confirmar que
  ningún juego "con canciones" necesita distinguir "sin conteo" de "conteo = 1 de baja
  confianza" para tercios.

---

## Anexo — la tabla completa (rank, título tal como aparece en setlist.fm, veces)

**Puestos 1-147, ranking numerado explícito — confianza alta:**

1. Jijiji — 101 · 2. Ñam fri fruli fali fru — 93 · 3. Vamos las bandas — 90 · 4. Un tal
Brigitte Bardot — 80 · 5. Nadie es perfecto — 71 · 6. Divina TV. Führer — 69 · 7. Nene
nena — 68 · 8. Nueva Roma — 61 · 9. Mi perro dinamita — 58 · 10. La bestia pop — 57 · 11.
Aquella solitaria vaca cubana — 55 · 12. La parabellum del buen psicópata — 53 · 13. Unos
pocos peligros sensatos — 52 · 14. Ya nadie va a escuchar tu remera — 50 · 15. Queso ruso
— 49 · 16. Rock para los dientes — 49 · 17. Ella debe estar tan linda — 47 · 18. Barbazul
vs. el amor letal — 46 · 19. Roto y mal parado — 45 · 20. El pibe de los astilleros — 44 ·
21. Maldición, va a ser un día hermoso — 44 · 22. Mariposa Pontiac — 43 · 23. Masacre en
el puticlub — 41 · 24. Música para pastillas — 41 · 25. Semen Up — 41 · 26. Fusilados por
la Cruz Roja — 40 · 27. Héroe del whisky — 40 · 28. Todo preso es político — 40 · 29. Yo
no me caí del cielo — 40 · 30. Ese gordo tramposo — 39 · 31. Nuestro amo juega al esclavo
— 39 · 32. Un pacman en el Savoy — 39 · 33. Criminal Mambo — 37 · 34. Rock del país — 37 ·
35. Un ángel para tu soledad — 36 · 36. Un poco de amor francés — 36 · 37. Vencedores
vencidos — 34 · 38. Rock para el negro Atila — 33 · 39. Blues del noticiero — 32 · 40.
Todo un palo — 32 · 41. Es un sentimiento — 31 · 42. El regreso de Mao — 29 · 43. Roxana
Porchelana — 29 · 44. Superlógico — 29 · 45. Susanita — 29 · 46. El infierno está
encantador esta noche — 26 · 47. Monólogo (Enrique Symns cover) — 26 · 48. Toxi-taxi — 26
· 49. El arte del buen comer — 24 · 50. El lobo caído — 24 · 51. Motor psico — 23 · 52.
Preso en mi ciudad — 23 · 53. Juguetes perdidos — 22 · 54. Noticias de ayer — 22 · 55.
Ropa sucia — 20 · 56. Blues de la libertad — 19 · 57. Salando las heridas — 19 · 58.
Botija rapado — 18 · 59. Buenas noticias — 18 · 60. Te voy a atornillar — 18 · 61. Shopping
Disco-Zen — 17 · 62. Tarea fina — 17 · 63. Yo caníbal — 17 · 64. ¡Cruz diablo! — 16 · 65.
Caña seca y un membrillo — 15 · 66. Canción para naufragios — 13 · 67. La dicha no es una
cosa alegre — 13 · 68. Patricio Disco Show — 13 · 69. Pierre, el vitricida — 13 · 70.
Blues de la artillería — 12 · 71. Ladrón de mi cerebro — 12 · 72. Pura suerte — 12 · 73.
Esa estrella era mi lujo — 11 · 74. Fanfarría del cabrío — 11 · 75. Luzbelito y las
sirenas — 11 · 76. Patricio Super Show — 11 · 77. Mariposa Pontiac / Rock del país — 10 ·
78. Mi genio amor — 10 · 79. De estos polvos futuros lodos — 9 · 80. Mi mamá alemana (Vivi
Tellas cover) — 9 · 81. Monólogo (Sergio "Mufercho" Martínez cover) — 9 · 82. Nuotatori
profesionisti — 9 · 83. Perdiendo el tiempo — 9 · 84. Rock de las abejas — 9 · 85. El
hombre eléctrico — 8 · 86. Ella baila con todos — 8 · 87. Instrumental Jam — 8 · 88. Las
increíbles andanzas del Capitán Buscapina en Cybersiberia — 8 · 89. Rock yugular — 8 · 90.
Cua-cua amén — 7 · 91. Estás frito angelito — 7 · 92. Etiqueta negra — 7 · 93. Fuegos de
octubre — 7 · 94. Alien Duce — 6 · 95. Desde el alma — 6 · 96. Drogocop — 6 · 97. El árbol
del Gran Bonete — 6 · 98. Esto es to-to-todo amigos! — 6 · 99. Las piernas de Dolores — 6
· 100. Lavi-Rap — 6 · 101. Pogo — 6 · 102. Quema el celo — 6 · 103. Sorpresa de Shangai —
6 · 104. Vals de los Redondos — 6 · 105. ¡Me matan limón! — 5 · 106. Crazy jazz — 5 · 107.
El bazar de Wakeman y Fripp — 5 · 108. Rodando — 5 · 109. Scaramanzia — 5 · 110. "Pongan
huevo Los Redondos" — 4 · 111. Bajo las palmeras (El reggae de Patricio) — 4 · 112. Estopa
dulce estopa — 4 · 113. Gualicho — 4 · 114. Imperialismo espacial (La Cofradía de la Flor
Solar cover) — 4 · 115. La hija del fletero — 4 · 116. Skay Guitar Solo — 4 · 117. "Vamos
Redondos, con huevo vaya al frente" — 3 · 118. Dr. Saturno — 3 · 119. Es hora de
levantarse querido ¿Dormiste bien? — 3 · 120. Espejismo — 3 · 121. Gran lady — 3 · 122.
Hercules mío — 3 · 123. Hidromedusa — 3 · 124. Intermedio — 3 · 125. La murga de los
renegados — 3 · 126. Morta punto com — 3 · 127. Murga de la Virgencita — 3 · 128. Murga
purga — 3 · 129. Pensando como una acelga — 3 · 130. Pool, averna y papusa — 3 · 131. Rato
molhado — 3 · 132. Recitador de Averno — 3 · 133. Sheriff — 3 · 134. Templo de Momo — 3 ·
135. Una piba con la remera de Greenpeace... — 3 · 136. "Vamos Los Redo" — 2 · 137. A toda
velocidad — 2 · 138. Blues del gallo malo — 2 · 139. Kazachok — 2 · 140. La pequeña novia
del carioca — 2 · 141. Monona blues (Merca para vender) — 2 · 142. Mujeres aburridas — 2 ·
143. Olé olé olé olé, Patricio Rey — 2 · 144. Perra dinamita — 2 · 145. Por fin por fin —
2 · 146. Solita, dejala solita — 2 · 147. ¡Lobo ¿estás?! — 1.

**Cola de 1 reproducción sin número propio — confianza alta, orden alfabético confirmado,
final de la tabla confirmado, 51 títulos:**
¿Adónde van? · ¿Cuándo habrá libertad? · "Somos todos Redonditos, Redonditos de Ricota" ·
A rocanrolear · Aurora · Ballet ricotero · Blossom · Blues del veraneo · Cabaret ·
Caminaré · Crisis punk · Cuando calienta el sol · Dime lo que hay que hacer · El gordo
tramposo / Un tal Brigitte Bardot · El petiso orejudo · El súper sport · Espiroqueta ·
Fruli mi dulce · Hercules mío (cover de Vivi Tellas, distinto del de la banda) · Hernando's
hideaway · Himno Nacional Argentino · Honolulu · Jackie Wild · La momia · La partita di
pallone · La plegaria garchante · Las mañanitas · Magic Circus · Mama · Mariposa Pontiac /
Rock del país / Ese gordo tramposo / Un tal Brigitte Bardot · Me vuelvo cada día más loca ·
Mejor no hablar de ciertas cosas · Mensaje primaveral · Monólogo: No hay juicio · Mucha fe
· Nene, no comprendo tus ambiciones · Noche en Bahía (Noche serena en el mar) · "Olé olé
olé olé, Patricio Rey" (Lange Jojo cover — confirmado en `RES-92`, no es duplicado) ·
Omar Emir · Orgasmos telepáticos · Palabras iniciales por Mufercho · Petit Suisse ·
Presentacion · Rock 18 · Sentimiento de blues · Swin de los años 50 · Tiempo del corazón ·
Tomalo de mi espera · Tristezas de un vendedor callejero · Una canción diferente · Willy
Crook Saxophone Solo.