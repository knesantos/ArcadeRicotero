# ARQ — Las separaciones de tapa: la imprenta, en archivos

> Rol dueño: `arquitectura`. **Produce: `ADR-05` + `CTR-12`.** Fecha: **2026-09-01**.
> Versión: **v2 — enmendada el 2026-09-02 por `ADR-05.9`**, que **ratifica el papel como
> cuarta zona** y pone `ADR-05.1` (las reglas 3 a 6 — eran cinco y ahora son seis) y
> `CTR-12` (§3, §4, §5, §6) a describir lo que el taller hace de verdad. **Resuelve `FIND-49` de `REV-11`.** Cada párrafo
> enmendado está marcado; lo que decía antes, palabra por palabra, está en `ADR-05.9`.
>
> **Por qué se enmienda acá y no hay un `-v2.md`.** Este rol versiona en archivo aparte
> cuando el cambio **invalida** la decisión previa, y esta no se invalidó: `ADR-05` sigue
> entero —tres PNG pre-teñidos, máscaras disjuntas, tinta plana, color leído de
> `tokens.css`, ruta por convención de slug, el taller fuera del build—. Lo que cayó son
> tres números que nunca tuvieron una línea de justificación y una cláusula que no sostenía
> nada. Un archivo nuevo dejaría huérfanas las referencias que ya apuntan a esta ruta desde
> `scripts/generar-pasadas.mjs`, `src/lib/tapa/pasadas.test.ts`, `ORQ-plan-ciclo-12.md` y
> las dos sugerencias del ciclo, y eso cuesta más trazabilidad de la que ahorra.
>
> **Consume** — leído para escribir esto, no citado de memoria: `CLAUDE.md` (la postura y
> las reglas), `.claude/rules/diseno-marca.md` (el circuito diseño → tokens → test, la
> tabla anti-slop, "el único archivo del repo donde vive un hex"),
> `.claude/rules/voz-ricotera.md` (los tres registros),
> `Docs/ORQ/ORQ-plan-ciclo-12.md` (`T-197` y las siete cosas que cambian),
> `Docs/UX/UX-20-el-sitio-como-lugar.md` (los cuatro límites, lo que nunca se mueve),
> `Docs/UX/UX-04-sistema-visual.md` ("Tapas reales en toda la pantalla": las tres formas,
> el piso de legibilidad, el mecanismo de crédito, el tope de 60 KB),
> `Docs/DECISIONES.md` `D-04`, `D-12`, `D-14`, `D-15`, `D-17`, `D-19`, `D-21`, `D-22`,
> `D-26`, `D-29`, `D-31`, `D-32`, `ADR-03` y `ADR-04` (los dos ADR del ciclo 11, por
> formato y por precedente), `CTR-01` (`ARQ-fragmento-audio.md`: el presupuesto de audio),
> `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md` (`RES-06`),
> `Docs/INVESTIGACION/INV-44-tapas-coveralia.md` (`RES-44`, la auditoría de edición de las
> 35 imágenes), `Docs/INVESTIGACION/INV-07-tipografia-lettering-tapas.md` (`RES-37`, el
> muestreo de las paletas), `public/arte/README.md`.
>
> **Y el código, que para esta decisión es la fuente más dura que hay:**
> `src/styles/tokens.css` entero, `scripts/generar-tapas.mjs` entero,
> `src/lib/sitio/arte.ts` entero, `src/lib/tema/paleta.ts`, `src/lib/letra/discos.ts`,
> `src/lib/estilos.test.ts` (el guardián del velo, líneas 95-113),
> `src/scripts/partida-tema.ts` (`cerrarTema`, `pintarRevelacion`, `avanzar`,
> `pintarResultado`, líneas 703-919), `src/lib/tema/copy.ts`, `src/data/tapa.json`,
> `package.json`, `.gitignore`.
>
> **Consumido de más para la enmienda del 2026-09-02** (`ADR-05.9`), y todo leído, no
> recordado: `Docs/INVESTIGACION/INV-54-serigrafia.md` (`RES-54` entero, que llegó),
> `Docs/SUGERENCIAS/HILO-para-arquitectura-el-papel-de-la-estampa.md`,
> `scripts/generar-pasadas.mjs` entero, `scripts/pasadas-manifiesto.json` entero (las diez
> corridas reales), `src/lib/tapa/pasadas.ts`, `src/lib/tapa/pasadas.test.ts` entero, y el
> bloque de la imprenta de `src/styles/juego.css` (líneas 2225-2330: `.estampa-papel`,
> `.pasada`, y el arreglo de `FIND-48`).
>
> **Resuelve:** `T-197` y **`FIND-49`** (`REV-11`, ciclo 12). **Habilita:** `T-199` (el
> taller), `T-200` (la estampa), `T-203` (dala vuelta), `T-202` (la sala), `T-206` (el zoom
> que se abre).
>
> **No resuelve, y no se mete:** cómo se ve la impresión, cuánto dura cada pasada y qué se
> estampa y qué no — eso es `UX-22` (`T-195`, `experiencia`); las palabras — `CNT-14`
> (`T-198`, `contenido`).
>
> **`RES-54` llegó, y el desacople funcionó** (`T-196`, fichada el 2026-09-01, pegada el
> 02): el orden es **clara → media → clave, la clave última**, por la convención fotográfica
> del oficio (`RES-54.1`-`.4`, `.9`) y **no** por la del bloque-contorno-primero de la
> xilografía (`RES-54.8`). Se cambió un retraso de CSS. **Cero archivos regenerados**, que
> es exactamente lo que compró la disjunción de `ADR-05.1` (hoy regla 6; antes de la
> enmienda, regla 5). Ojo con el rótulo que manda sobre
> todo el sitio: ese orden es *"así se imprime una serigrafía"*, nunca *"así imprimía
> Rocambole esta tapa"* — y dos de las diez tapas fueron aerografía, no serigrafía
> (`RES-54.12`).

---

## De dónde sale cada afirmación de este documento

Tres orígenes, marcados uno por uno. Sin esto, dentro de dos meses no se distingue lo
medido de lo elegido:

| Marca | Qué significa |
|---|---|
| **medido en el repo** | se verificó leyendo el archivo, con ruta y línea, o lo midió el hilo principal hoy y lo dejó por escrito en el encargo. Está en disco |
| **criterio propio del rol** | lo decide `arquitectura` acá. Se puede discutir; no se puede citar como hecho externo |
| **pendiente de ficha** | dato del mundo de afuera. **No lo afirmo**: va a `investigador` como `RES-XX` |

Y la advertencia que este proyecto cuida de verdad: **todo lo que este documento dice
sobre la obra o la técnica de Rocambole sale de `RES-06` o de `RES-44`, y nada más.** Que
trabaja *"artesanal, con rodillo y serigrafía; también aerografía, grabado, collage e
ilustración"* es `RES-06`. Que la contratapa de `lobo-suelto-cordero-atado-cd1` trae el
tracklist de 13 temas que coincide exacto con `RES-20` es `RES-44`. **Cómo se imprime una
serigrafía —en qué orden y por qué la clave va última— es `RES-54`, que llegó el
2026-09-01**, y se cita por número donde se usa.

**Lo que `RES-54` fue a buscar y no encontró, que importa tanto como lo que trajo:**
`RES-54.13` dice con todas las letras que **ninguna fuente da un número de tintas ni un
orden que Rocambole haya usado en una tapa**. Así que la separación en tres tintas más el
papel **sigue siendo criterio propio de este rol**, apoyado en que tres a cinco tintas es
lo verosímil en un taller de afiches (`RES-54.14`, guía de taller, no cifra dura). No es
una reconstrucción de su método, y ninguna pieza del sitio puede decir que lo sea.

Los contrastes de color que aparecen más abajo son **cálculo a mano sobre los valores de
`tokens.css`, no una corrida** (`D-12`: este rol no tiene con qué correr nada). Están para
que quien construya no los rehaga, y el que manda es el que imprima el taller.

---

## ADR-05 — Las separaciones de tapa

- **Estado:** **aceptada y construida**, **enmendada el 2026-09-02** por `ADR-05.9` (el
  papel es la cuarta zona). El pendiente que tenía —`RES-54`, el orden de las pasadas— se
  cerró sin tocar un archivo, que era la apuesta de la disjunción (`ADR-05.1`, regla 6).
- **Contexto.** El ciclo 12 quiere que la tapa **se imprima** al acertar: tres pasadas de
  tinta con los colores medidos de esa tapa, la foto que se fija encima, y una sola tinta
  —la clave— cuando el tema se escapó. El material ya está: las diez fichas de 320 px
  existen en `public/tapas/`, las diez traseras existen como máster en
  `Docs/INVESTIGACION/TapasDiscos/`, y las veinte tintas medidas de `RES-37` viven en
  `tokens.css` (**medido en el repo**). Lo que no existe es la forma de que una isla que
  corre en el navegador reciba esa tapa separada en tintas sin bajarse medio disco, sin
  tocar `src/data/adivinar-tema.json`, sin romper `estilos.test.ts` y sin que un hex
  aparezca fuera de `tokens.css`.
- **Y el riesgo que ordena todo, que el propio plan del ciclo escribió:** que la estampa se
  vuelva "un efecto de impresión" de biblioteca. Lo que la separa de eso son tres cosas
  **verificables**, y la primera es de este documento: **que los colores sean los medidos
  de esa tapa y no una paleta.** Todo el diseño de abajo está torcido hacia que eso se
  pueda probar con un test y no con un ojo.
- **Decisión, en una línea:** cada tapa llega al navegador como **tres PNG con alfa,
  pre-teñidos en build con los colores que el taller lee de `tokens.css`**, del mismo
  tamaño que su ficha, con **máscaras disjuntas** y **tinta plana** (alfa 0 o 255), servidos
  por **convención de nombre desde el slug del disco** — sin un campo nuevo en ningún JSON,
  sin un schema tocado, y con un guardián que **falla el build si el color de un archivo
  dejó de ser el del token**.

### Los siete candados, antes de los detalles

Si alguien afloja uno, que sepa cuál. **El séptimo lo agrega la enmienda del 2026-09-02**
(`ADR-05.9`) y es el que paga el papel: eran seis:

1. **El color sale de `tokens.css` y de ningún otro lado.** El taller lo lee y lo hornea.
   Nadie copia un hex a mano, ni al script, ni al test, ni al CSS.
2. **Tinta plana.** Alfa 0 o 255, nunca intermedia. Un degradado adentro de una pasada es
   el primer tic de la tabla anti-slop, y acá además es verificable a máquina.
3. **Una tinta por archivo.** Todos los píxeles visibles de una separación tienen
   exactamente el mismo RGB. Es lo que hace que "el color es el medido" sea una aserción y
   no una impresión.
4. **Nada se pide antes de que el tema se cierre.** Durante la partida el presupuesto de
   red es del audio (`CTR-01`). La estampa llega después de la respuesta.
5. **Un archivo que falta no rompe la pantalla.** Degrada por capa, y el botón no se mueve
   un píxel (`UX-20` §1.3).
6. **El corrimiento de registro no se hornea.** Los tres archivos comparten el mismo marco,
   perfectamente registrados. El registro imperfecto lo pone el CSS con `--registro`
   (`T-207`), que es lo único que se puede apagar bajo `prefers-reduced-motion`.
7. **La estampa se apoya siempre en una superficie opaca de `--papel`** (`ADR-05.9`). Desde
   que el papel es una zona de verdad, las tres tintas **no cubren la imagen entera**: hay
   hasta un 20 % de la tapa que no lleva tinta y muestra el soporte. Si esa superficie
   falta, o es translúcida, o es de otro color, el papel deja de ser papel y pasa a ser un
   agujero por el que se ve lo que haya detrás — que en esta pantalla es una tapa velada.
   **Ya pasó una vez:** es `FIND-48` de `REV-11`, arreglado con `isolation: isolate` en
   `.estampa-papel` (**medido en el repo**, `juego.css:2294`). Un candado nace de un golpe.

---

## ADR-05.1 — Qué es cada archivo: tres tintas, una clave y el papel

*(Todo este apartado es **criterio propio del rol**, salvo donde se cita `RES-06` o
`RES-54`. **Enmendado el 2026-09-02**: reglas 3, 4 y 5, y la cuarta fila de la tabla. El
detalle del cambio y lo que decía antes están en `ADR-05.9`.)*

Una separación es una máscara: qué parte de la tapa imprime esa tinta. Se saca de la propia
ficha, y **las tres reparten casi toda la imagen: lo que queda es el papel**.

| Zona | Qué lleva | Con qué tinta | Archivo |
|---|---|---|---|
| clara | las zonas luminosas, sin llegar a las más blancas | el **más luminoso** de los dos colores medidos del disco | `<slug>-clara.png` |
| media | los medios | el **menos luminoso** de los dos | `<slug>-media.png` |
| clave | las sombras | **`--fondo`**: la tinta del sitio, la base que `D-19` dice que no rota nunca | `<slug>-clave.png` |
| **papel** | **lo más blanco de la tapa** | **ninguna: es `--papel`, el soporte** | **ninguno** |

**La cuarta zona no produce archivo, y ahí está la mitad de su gracia.** No se sirve, no se
baja, no pesa y no puede faltar: es lo que se ve donde las tres máscaras no imprimen. El
color es `--papel` (`#ede4ce`), un token que ya existía y que el taller ya leía para avisar
las pasadas mudas — **el papel no agrega ni un hex, ni un token, ni un byte de red**.

**La clave es `--fondo` y no un negro nuevo, por dos motivos que van juntos.** El primero
es de regla: un `#000000` sería un hex nuevo, y el único lugar del repo donde vive un hex
es `tokens.css` (`diseno-marca.md`) — meter un negro puro para la clave sería inventar un
color con coartada, que es exactamente lo que el bloque de las diez paletas de `tokens.css`
prohíbe por escrito. El segundo es de sentido: la clave es **la única tinta que no rota**,
igual que la base de `D-19`. Cada tapa aporta sus dos colores; el negro es del sitio.

### Las seis reglas de la separación

1. **Se saca de la ficha, no del máster.** `public/tapas/<slug>.jpg`, la misma imagen de
   320 px que después se fija encima. Dos motivos: **registro exacto** (una máscara sacada
   del máster y reducida no cae en el mismo píxel que la foto que ya sirve el sitio) y
   **una sola fuente de verdad** — si mañana cambia la ficha, cambian las pasadas, y el
   guardián lo detecta (`CTR-12`, el manifiesto).
2. **Luminancia perceptual, la misma que usa el resto del sitio.** Se calcula la luminancia
   relativa de WCAG —la que ya computa `contraste.test.ts`— y se la vuelve a codificar con
   la curva sRGB, para que 0 sea negro, 1 sea blanco y 0,5 caiga donde el ojo pone el medio.
   El sitio tiene **una sola** definición de "qué tan claro es esto"; esta no es la segunda.
3. **Mediana y después suavizado, antes del umbral** *(enmendada)*. Primero un filtro de
   mediana (`MEDIANA`), que saca el ruido del JPEG **sin comerse los bordes**, y recién
   después un desenfoque leve (`SIGMA_SUAVIZADO`). Sin nada de eso el umbral persigue el
   ruido y el borde sale hecho pelusa; con las dos cosas sale en bloques. **Es la diferencia
   entre una serigrafía y un filtro**: `RES-06` dice que el trabajo es de rodillo y
   serigrafía, y una serigrafía tiene bordes duros de forma grande, no granulados. La
   mediana es la que permite que el sigma **baje** de 1,4 a 0,9: se limpia el ruido sin
   ablandar la forma, que es justo lo que un desenfoque más fuerte hacía mal.
4. **Los dos cortes salen de la propia tapa, con un tope absoluto cada uno** *(enmendada)*.
   No hay tres umbrales: hay dos, y los dos son percentiles del histograma de esa tapa
   **acotados por un valor duro**. La **clave** se lleva el `CUOTA_CLAVE` más oscuro, y
   además **todo lo que esté por debajo de `PISO_CLAVE` va a la clave aunque sea más que la
   cuota** — sin ese piso, en una tapa con un negro plano grande el percentil se agota
   adentro del negro y **el ruido del JPEG sobre ese negro se va a la tinta clara**, que fue
   exactamente cómo *Oktubre* perdió el fondo. El **papel** se queda con el `CUOTA_PAPEL`
   más luminoso, y además **nada por encima de `TECHO_PAPEL` lleva tinta nunca**: los
   blancos de la tapa son siempre el soporte. Con umbrales fijos e iguales para las diez,
   *Cordero atado* —casi negra— imprimiría una sola pasada y *Gulp!* no tendría casi clave.
   Con percentiles solos, las tapas con grandes planos se desarman. Los topes absolutos son
   los que hacen que **cada tapa entregue sus tintas sola** sin diez juegos de números a
   mano.
5. **En el medio manda el color, no la luz** *(enmendada)*. Cada píxel que quedó entre la
   clave y el papel va **a la tinta más cercana de las dos**, por distancia en RGB. Es lo
   que hace una separación de tintas planas de verdad, y es lo que le devuelve a *Oktubre*
   el rojo de las letras y las banderas, que un corte por luminancia repartía entre las dos
   pantallas. **Esto no crea una segunda definición de "qué tan claro es esto"** —la
   luminancia de la regla 2 sigue siendo la única, y sigue siendo la que corta la clave y el
   papel—: la distancia en RGB responde otra pregunta, "a cuál de estas dos tintas se
   parece". Es una métrica barata y no perceptual, y se la banca **porque el conjunto de
   entrada está cerrado**: son diez tapas fijas, todas miradas de a una. Si una tinta queda
   con menos de `MINIMO_TINTA` del medio, el reparto por color no dijo nada útil y **el
   medio se parte por luminancia**, que es el repuesto. Pasa en cinco de los diez discos, y
   el manifiesto lo declara disco por disco (`repartoPorLuz`).
6. **Las máscaras son disjuntas, y lo que no imprimen es papel** *(enmendada: antes decía
   que sumaban la imagen entera)*. Ningún píxel pertenece a dos pasadas. **Y esta es la
   regla que desacopló este documento de `RES-54`:** con máscaras disjuntas, **el resultado
   final es el mismo cualquiera sea el orden de impresión**, así que `RES-54` pudo decir que
   la clave va última y no se regeneró un solo archivo — se cambió un retraso en el CSS.
   Sigue valiendo con la composición real, que es `multiply` sobre el papel: multiplicar es
   conmutativo, y donde las máscaras no se pisan cada píxel recibe una sola tinta. Con
   máscaras acumulativas (cada tinta imprimiendo también lo más oscuro que ella), el orden
   quedaría horneado en los archivos y una ficha de `investigador` habría costado treinta
   regeneraciones. **Lo que no vale es dejar que el papel crezca sin límite:** por encima de
   `TECHO_PAPEL` de cobertura la estampa se lee a medio imprimir, y eso lo topea el guardián
   (`CTR-12` §5, caso 11).

**Consecuencia visible de la disjunción, y es la correcta:** con el registro corrido dos
píxeles, en un borde queda una hendija de papel y en el de enfrente un solapamiento de
tintas. Eso **es** un registro imperfecto de verdad; la alternativa acumulativa nunca
muestra papel y por eso se ve más limpia y menos impresa.

### Tinta plana: alfa 0 o 255, nunca en el medio

La máscara no lleva medio tono. Una serigrafía sin trama es tinta plana, y `diseno-marca.md`
veta los degradados decorativos en cualquier forma. El beneficio de fondo es que **se puede
probar**: el guardián abre el PNG y afirma que no existe un solo píxel con alfa intermedia.
Un "efecto de impresión" de biblioteca no pasa ese test; una separación de verdad sí.

El costo, declarado: el borde de cada pasada es un escalón de píxel, sin suavizado. A 320
px sobre una pantalla de teléfono es exactamente la aspereza que se busca, y el suavizado
del punto 3 garantiza que ese escalón siga una curva y no un ruido.

---

## ADR-05.2 — De dónde salen los colores: el taller lee `tokens.css`

`diseno-marca.md` dice que `tokens.css` es el único archivo del repo donde puede vivir un
hex, y que el circuito es **lienzo → `tokens.css` → test**, nunca al revés. Un taller que
tuviera su propia tabla de colores rompería ese circuito en silencio: el día que `RES-37`
remuestree una tapa, el sitio cambiaría de color y la estampa no.

**Decisión: el taller parsea `src/styles/tokens.css` y saca de ahí los tres valores que
necesita por disco** — `--disco-<slug>-tinta`, `--disco-<slug>-apoyo` y `--fondo`. Nada se
copia a mano, ni al script, ni al guardián, que hace el mismo parseo y compara contra los
píxeles del archivo.

### Cuál de los dos colores va a la clara: lo decide la luminancia, en build

**La regla:** el más luminoso de los dos a la clara, el otro a la media. No es una
preferencia estética: es la única asignación que conserva el orden tonal de la foto. Al
revés, las zonas claras se imprimen con el color oscuro y la tapa se lee como un negativo
— la gente reconoce el disco por su tono, no solo por su forma.

**Y se decide en build, no en una tabla**, porque el rol de `-tinta` y `-apoyo` en
`tokens.css` es "acento" y "borde/relleno", **no** "claro" y "oscuro": en dos de los diez
discos el `-apoyo` es el más luminoso. Cálculo a mano sobre `tokens.css` (no corrida,
`D-12`) — la luminancia relativa de cada par:

| Disco | `-tinta` | `-apoyo` | A la **clara** | A la **media** |
|---|---|---|---|---|
| `gulp` | `#df5744` · 0,229 | `#e6e4bd` · 0,760 | **apoyo** (crema) | tinta (rojo) |
| `oktubre` | `#f8360d` · 0,227 | `#9a9490` · 0,301 | **apoyo** (gris) | tinta (rojo) |
| `un-baion-para-el-ojo-idiota` | `#579ec5` | `#457eb1` | tinta (celeste) | apoyo (azul) |
| `bang-bang-estas-liquidado` | `#aeb9b4` | `#927051` | tinta (ceniza) | apoyo (ocre) |
| `la-mosca-y-la-sopa` | `#ce5c29` · 0,209 | `#114b58` · 0,059 | tinta (naranja) | apoyo (petróleo) |
| `lobo-suelto` | `#f28b16` · 0,374 | `#0b7792` · 0,153 | tinta (naranja) | apoyo (petróleo) |
| `cordero-atado` | `#f28b16` · 0,374 | `#030d0b` · 0,003 | tinta (naranja) | apoyo (negro) |
| `luzbelito` | `#af9178` | `#69635c` | tinta (cuero) | apoyo (topo) |
| `ultimo-bondi-a-finisterre` | `#8f8b84` | `#74726e` | tinta (plata) | apoyo (acero) |
| `momo-sampler` | `#cedae2` | `#656f70` | tinta (plata) | apoyo (peltre) |

Que *Gulp!* imprima los claros en crema y los medios en el rojo del título manuscrito, y
*Oktubre* los claros en el gris que el propio Rocambole contó que agregó (`tokens.css`,
comentario de `RES-37`) y los medios en el rojo de la bandera, **es la tapa**. Si alguien
lo hubiera puesto en una tabla a mano, habría escrito lo contrario.

### Las tres pasadas mudas, que existen y no son un defecto

*(Enmendado el 2026-09-02: **eran dos y son tres**. La tercera la encontró el refutador de
este rol y la confirmó la corrida del taller. El número está en el manifiesto.)*

Tres casos reales, encontrados calculando, que el taller tiene que **avisar** y **no
convertir en error**:

1. **La clara de `gulp` es del color del papel.** `--papel` es `#ede4ce` y el apoyo de
   *Gulp!* es `#e6e4bd`: contraste **1,02:1**. La pasada existe y no se ve. **Y en
   serigrafía eso es exactamente lo que pasa: el blanco de una serigrafía es el papel que
   no se imprimió.** No es una falla, es la técnica; la tapa queda leyéndose en rojo y
   negro sobre crema, que es *Gulp!*.
2. **La media de `cordero-atado` es del color de la clave.** El apoyo es `#030d0b` y
   `--fondo` es `#14100e`: contraste **1,04:1**. La estampa de *Cordero atado* se lee como
   naranja sobre negro, que es la tapa.
3. **La clara de `momo-sampler` también es del color del papel.** La tinta es `#cedae2`
   contra `#ede4ce`: contraste **1,12:1** (**medido en el repo**: el aviso está en
   `pasadas-manifiesto.json`). *Momo* es una tapa casi entera oscura —su clave cubre el
   **81 %**— y lo poco claro que tiene se lee como papel apenas frío. Es la misma técnica
   del caso 1, en la tapa donde menos se nota.

**Regla:** si una tinta queda a menos de **1,5:1** del papel o de la clave, el taller lo
imprime en la lista de avisos con el número, y sigue. **Emite las tres pasadas siempre**,
también las mudas: la alternativa —no emitirlas— convierte "existen los 40 archivos" en
"existen entre 34 y 40", que es un invariante mucho peor y obliga a la isla a saber cuáles
faltan. El costo es un archivo de pocos KB que no pinta nada, en dos discos de diez.

### Cómo falla el build si falta un token

Sin excepciones y sin repuesto, porque un color inventado es peor que un build roto:

| Caso | Qué hace el taller |
|---|---|
| Falta `--disco-<slug>-tinta` o `-apoyo` | **error**, nombra el token y el disco. No escribe nada de ese disco |
| Falta `--fondo` | **error**: sin clave no hay estampa ni fallo |
| El valor no es un hex de seis dígitos (`#abc`, `rgb()`, `color-mix()`, `var()`) | **error**, nombra el token y el valor leído. No se expande, no se interpreta |
| Falta `public/tapas/<slug>.jpg` | **error**, y dice el comando que la produce (`node scripts/generar-tapas.mjs`) |
| Falta el máster de la trasera | **error**, nombra el archivo esperado |

**No corta en el primer error: junta todos, no escribe nada de los discos afectados y
termina con código distinto de cero.** Una corrida tiene que decir todo lo que está mal,
no lo primero. Es lo contrario del criterio de `generar-tapas.mjs`, que trata los másters
faltantes como avisos (**medido en el repo**, línea 187): allá un derivado que falta deja
una pantalla sin adorno; acá deja un juego sin premio y un guardián en rojo.

---

## ADR-05.3 — PNG pre-teñido, no máscara en tiempo de ejecución

La alternativa obvia es servir **una** máscara en escala de grises por pasada y teñirla en
el navegador con `mask-image` más un fondo del color del token. Se descarta, y los motivos
importan más que la conclusión:

1. **No ahorra un solo archivo.** Son las mismas treinta máscaras; lo único que cambia es
   dónde se aplica el color. El argumento de peso, que es el único que la haría atractiva,
   no existe.
2. **Mueve trabajo al teléfono, que es el aparato que este proyecto defiende.** Tres capas
   enmascaradas del tamaño de la estampa, compuestas cada cuadro mientras corre la
   animación, en un celular de gama baja. `D-31` ya pagó una vez el precio de subestimar
   qué cuesta componer de más.
3. **El soporte de `mask-image` y sus prefijos es pendiente de ficha. No lo afirmo** — y el
   diseño está hecho para que la pregunta no haga falta: un PNG con alfa lo dibuja
   cualquier cosa que dibuje el sitio de hoy.
4. **Y el que decide todo: rompe la verificación.** Con la máscara teñida en CSS, "el color
   es el medido de esa tapa" se prueba leyendo una hoja de estilos, o sea, no se prueba:
   se comprueba que alguien escribió `var(--disco-...)`. Con el PNG pre-teñido, el guardián
   **abre el archivo y mira los píxeles**. El riesgo declarado del ciclo es que la imprenta
   sea un efecto de biblioteca; la única defensa que no depende de un ojo es esta.

**Lo que se paga, y hay que decirlo de frente: el color queda horneado.** Si `RES-37`
remuestrea una tapa y alguien cambia `tokens.css`, el sitio cambia de color y las treinta
imágenes no. La mitigación es la razón por la que el guardián compara píxel contra token:
**ese desfasaje no queda en silencio, deja el build en rojo con el nombre del disco.** Un
hex movido sin correr el taller es un error, y se entera solo.

---

## ADR-05.4 — Dónde viven y cómo los encuentra una isla

```
public/tapas/pasadas/<slug>-clara.png     320×320, PNG RGBA          30 archivos
public/tapas/pasadas/<slug>-media.png
public/tapas/pasadas/<slug>-clave.png
public/tapas/trasera/<slug>.jpg           320 px de lado largo       10 archivos
scripts/pasadas-manifiesto.json           lo lee el guardián, no el sitio
```

`<slug>` es uno de los diez de `src/lib/letra/discos.ts` — el mismo que ya usan el schema,
la Redondopedia, los tokens y `claseDisco` (**medido en el repo**).

### La convención, y por qué no hay un campo nuevo en ningún JSON

`src/scripts/partida-tema.ts` corre en el navegador y no puede leer un directorio.
`arte.ts` sí puede, pero importa `node:fs` y por eso solo sirve en build (**medido en el
repo**, línea 10). Entonces la ruta se **arma**, no se busca, y el insumo es un dato que la
isla ya tiene: `tema.disco` es el slug (`partida-tema.ts:766`, `claseDisco(tema.disco)`).

**Módulo hoja nuevo: `src/lib/tapa/pasadas.ts`.** Importa únicamente
`../letra/discos.ts`, que no importa nada — el mismo patrón exacto de `tema/paleta.ts`, y
la razón es la misma: `D-29` y `src/lib/islas.test.ts`. Vive en `tapa/` porque ahí vive su
guardián según el plan (`T-199`) y porque lo usan los dos juegos que muestran tapas.

```ts
export const PASADAS = ['clara', 'media', 'clave'] as const;
export type Pasada = (typeof PASADAS)[number];

/** `/tapas/pasadas/<slug>-<pasada>.png`, o null si el slug no es uno de los diez. */
export function rutaPasada(slug: string, pasada: Pasada): string | null;
/** `/tapas/trasera/<slug>.jpg`, o null. */
export function rutaTrasera(slug: string): string | null;
/** `/tapas/<slug>.jpg`, o null. La misma que `arte.ts:tapa()` devuelve en build. */
export function rutaFicha(slug: string): string | null;
```

**El módulo construido creció dos funciones más, y las ratifico acá mismo** (enmienda del
2026-09-02, para que el contrato no le quede corto al código): **`estampaDe(slug)`**, que
devuelve las cuatro rutas de una tapa juntas en vez de que cada isla las arme de a una, y
**`slugDeRecorte(archivo)`**, que es la prosa de más abajo —"el slug sale de sacarle el
sufijo `-zoom`"— convertida en función y por lo tanto testeable contra el banco entero. Las
dos respetan el invariante de acá abajo: `null` ante lo desconocido. Y `Estampa` carga
además `letra` y `nombreEstampado`: **el módulo los transporta, pero esos strings son de
`CNT-14` §2.7, no míos** — qué disco se escribe en su propia letra y con qué tildes lo
decide `contenido`, y lo verifica el caso 20.

**Devolver `null` ante un slug desconocido es la parte importante**, y es el criterio que
ya escribió `paleta.ts` para su caso: un disco que no está en la lista no arma una ruta
inventada que después va a dar 404. La pantalla pinta la revelación de siempre y listo.

**Para "Adiviná la tapa" (`T-206`) tampoco hace falta tocar `src/data/tapa.json` ni
`CTR-05`:** el ítem trae `imagen.archivo` con la forma `<slug>-zoom` (**medido en el
repo**: `tapa.json`, y la tabla `JUEGO` de `generar-tapas.mjs` que la produce), así que el
slug sale de sacarle el sufijo `-zoom`, y si lo que queda no es uno de los diez,
`rutaPasada` devuelve `null` y el juego sigue como hoy. **Ningún schema cambia en este
ciclo.**

Alternativa descartada: **agregarle a cada ítem un campo con la ruta de sus pasadas.**
Sería 105 líneas de JSON tocadas en `adivinar-tema.json`, un schema nuevo, una versión de
contrato, y una segunda fuente de verdad sobre algo que ya se deduce del slug. Un dato que
se puede derivar no se guarda.

---

## ADR-05.5 — Qué pasa cuando un archivo falta

Una isla no puede preguntar si un archivo existe: se entera cuando la imagen falla. La
regla, en orden de gravedad, y **ninguno de los tres casos mueve un píxel del botón**:

| Falta | Qué se ve |
|---|---|
| Una de las tres pasadas | **Degrada por capa**: se saca esa capa y se estampan las otras dos. Una tapa a dos tintas es una tapa a dos tintas, no un error |
| Las tres | Queda la foto sola (la ficha), que es el estado final de la estampa igual |
| También la ficha | La revelación de hoy: título, ficha de texto, puntos, botón. **El juego no pierde nada de lo que ya daba** |
| La trasera, al tocar | El objeto no gira y el control se retira. Las palabras son de `CNT-14`, en registro 3 |

**Lo que `RES-54` agregó a esta tabla, y no la cambia pero la ordena** (enmienda del
2026-09-02): las tres pérdidas no valen lo mismo. *"La clave sola —sin color— sigue siendo
una imagen legible; las tintas clara y media solas, sin la clave, no lo son"* (`INV-54`).
Así que **la capa que no puede faltar es la clave**: sin ella quedan dos manchas de color
sobre papel. Es el mismo hecho que sostiene el piso de `MINIMO_CLAVE` y la pantalla de
fallo. No cambia el mecanismo —las tres se piden juntas y cada una degrada sola—, pero si
alguna vez hay que elegir un orden de pedido, la clave va primera.

**Las tres condiciones técnicas que hacen que eso sea cierto y no una intención:**

1. **La caja de la estampa tiene proporción declarada** (`aspect-ratio`, la de la ficha) y
   reserva su lugar antes de que llegue una imagen. Sin eso, cada capa que llega empuja el
   botón `Seguí` hacia abajo y el dedo toca lo que no quería. Es `UX-20` §1.3 aplicado a
   una imagen, y es el defecto más probable de toda la construcción.
2. **Cada `<img>` se crea con su manejador de error puesto**, y el manejador **saca el
   nodo**. Nunca queda el ícono de imagen rota: eso es la interfaz por defecto del
   navegador metida adentro de una pantalla que se pelea con la interfaz por defecto.
3. **La estampa se suma a una revelación que ya está pintada entera.** El texto, los
   puntos y el botón se pintan en el mismo cuadro que hoy (`pintarRevelacion`,
   `partida-tema.ts:753`); las capas aparecen cuando resuelven. **Nada espera a una
   imagen**, y si una llega tarde aparece en su lugar sin animación. El acierto puede ser
   el único grito del sitio, pero no puede ser una espera.

---

## ADR-05.6 — La trasera: es una ficha más, la de la otra cara

El encargo la llamaba "cuarta forma de `D-21`". **No hace falta una forma nueva, y es
mejor que no la haya:** `UX-04` ya define la **ficha** como "la tapa entera en baja, 320 px
del lado largo, con crédito visible junto a la imagen". Una contratapa a 320 px es
exactamente eso, aplicado a la otra cara. Así hereda sin escribir una línea el tope de
resolución de `D-04`, el mecanismo de crédito y la prohibición de la foto a sangre. **Si
`experiencia` quiere nombrarla aparte en `UX-04`, es su hoja; el contrato no lo necesita.**

### De qué máster sale cada una, con ficha y sin inventar

`RES-44` audita las 35 imágenes una por una, y el caso que el encargo marcaba como dudoso
ya está resuelto ahí (**leído en `INV-44`, filas 59 y 63**):

- `lobo-suelto-cordero-atado-cd1-trasera` → **vol. 1, *Lobo suelto***: "CD 51067" ×2,
  tracklist de **13** = `RES-20` exacto, veredicto **original confirmada**.
- `lobo-suelto-cordero-atado-cd2-trasera` → **vol. 2, *Cordero atado***: "CD 51167" ×2,
  tracklist de **12** = `RES-20` exacto, **original confirmada**.

Así que **`lobo-suelto` ← cd1, `cordero-atado` ← cd2**, que además es el mismo reparto que
`generar-tapas.mjs` ya usa para los frontales y para los zooms (**medido en el repo**,
`FICHAS` y `JUEGO`). No es una decisión nueva: es la que ya está tomada, con ficha detrás.
**Ojo con lo que `RES-44` sí deja cruzado y no toca a nadie acá:** los archivos `-cd`
(la cara del disco) de los dos volúmenes tienen los catálogos intercambiados. Esta
decisión no usa ningún archivo `-cd`.

Las diez traseras existen (**medido en el repo**: `Docs/INVESTIGACION/TapasDiscos/`, 1181×929).

### La advertencia de edición, que es la única regla estricta que le queda al proyecto

`RES-44` marca **siete de estas diez traseras como "reedición confirmada"** o no
determinable: llevan catálogo y sello (`P. Rey Discos`, `Del Cielito`, barcodes) que no
corresponden a la edición original. Eso **no impide mostrarlas** —`D-21` prohíbe una sola
cosa, usar una imagen de edición no confirmada **como respuesta correcta**, y la trasera
acá no es una respuesta: es el objeto que ya ganaste— **pero prohíbe una cosa concreta**:

> **La pantalla no puede afirmar año, sello ni edición a partir de la trasera.** El año y
> el disco los sigue diciendo el catálogo de temas, que es dato fichado. Si algún texto de
> la vuelta dijera "esta es la edición de 1985" leyéndolo del inlay, el juego le estaría
> marcando error al que se sabe el disco, que es lo único que este proyecto declaró
> estricto (`CLAUDE.md`, `D-14`).

Y la excepción de crédito que ya existe y hay que arrastrar: **para `la-mosca-y-la-sopa`,
el pie no se le acredita a Rocambole** mientras `RES-44` siga diciendo que ese frontal es
un rediseño (**medido en el repo**: comentario de `generar-tapas.mjs`, y
`Docs/SUGERENCIAS/HILO-para-investigador-tapa-de-la-mosca.md`). Vale igual para su estampa.

### Se pide recién al tocar

El "dala vuelta" **no precarga nada**: el `<img>` de la trasera **se crea adentro del
manejador del toque**, no antes. No es `preload="none"` sobre un nodo que ya está —eso solo
vale para medios—, es no tener el nodo. Quien nunca da vuelta la tapa **no baja un byte**
de las diez traseras. Es el mismo criterio con el que `pintarRevelacion` sirve el tema
entero hoy (`partida-tema.ts:795`, `audio.preload = 'none'`, **medido en el repo**).

---

## ADR-05.7 — La sala se vuelve el disco: el velo alcanza, y hay un agujero en el guardián

`T-202` quiere que al acertar el fondo velado de la pantalla pase a ser la tapa que
sacaste, reusando la ficha de 320 px. **Ratifico que el velo de `UX-04` alcanza aunque la
imagen se estire, y no hace falta un token nuevo, ni un par nuevo en `contraste.test.ts`,
ni un archivo nuevo.** El argumento es de una línea:

> Lo que `contraste.test.ts` mide no es una tapa: es **el velo compuesto sobre blanco
> puro**, el peor caso matemático posible (`UX-04`, "El piso de legibilidad"). **Estirar
> una imagen no puede producir un píxel más claro que el blanco puro**, así que una ficha
> escalada a cualquier tamaño sigue estando por debajo del peor caso que ya está testeado.
> El velo no protege contra la definición de la imagen: protege contra su luminancia.

Con dos condiciones que sí son duras:

1. **Se reemplaza, no se apila.** La tapa del disco ocupa el lugar de `lobo-tiras`, no se
   suma. `UX-20` §1.2 topea en dos capas —grano + un recorte real— y ese techo existe
   justamente porque tres capas dejan de tener un peor caso auditable.
2. **La ficha se baja una sola vez.** Es la misma URL que usa la foto que se fija en la
   estampa. Una descarga, dos usos.

### El agujero, que hay que cerrar en el mismo commit

`estilos.test.ts` verifica que ninguna tapa entre de fondo sin velo, y lo hace buscando la
cadena **`/tapas/fondo/`** dentro del bloque de declaraciones (**medido en el repo**, línea
106). La ficha vive en `/tapas/<slug>.jpg` — **fuera de ese patrón** — y encima la va a
poner la isla, en tiempo de ejecución, donde ningún test de CSS mira. Traducido: **si
`T-202` se construye tal cual, la única tapa de fondo del sitio que se pone desde
JavaScript sería la única que nadie audita.**

La forma de cerrarlo sin inventar nada:

- **La isla nunca escribe una imagen de fondo en línea.** Escribe una **variable**:
  `estilo.setProperty('--tapa-de-la-sala', 'url("/tapas/gulp.jpg")')`. Quien pone la imagen
  es una regla de `juego.css`, y **esa regla lleva el velo en el mismo bloque**, como todas
  las demás.
- **Convención, para que la máquina pueda encontrarlas:** toda propiedad personalizada que
  transporte la URL de una tapa se llama **`--tapa-*`**. Ninguna otra cosa usa ese prefijo.
- **`estilos.test.ts` extiende su patrón** de `/tapas/fondo/` a `/tapas/` **o**
  `var(--tapa-`. Es una línea de test y cubre las dos vías. Lo escribe el hilo principal en
  `T-200`/`T-202`; acá queda el requisito.

Y una regla de borde, para que el velo no tenga que crecer: **sobre la estampa no va
texto.** El título, los puntos y el crédito van al lado o abajo, sobre `--fondo`, que es el
par testeado de siempre. Si `experiencia` quiere texto encima de la tapa impresa, eso
necesita velo y par testeado, y es una vuelta a `UX-04`, no una decisión de construcción.

---

## ADR-05.8 — El presupuesto

Cuatro números sobre la mesa, todos del repo: el sitio pesaba **11 KB comprimidos por
visita** (`D-15`); un fondo de tapa puede pesar hasta **60 KB** y el más pesado del
catálogo pesa **53 KB** (`UX-04`); las fichas de 320 px pesan hoy entre **6 y 34 KB**
(medición del hilo principal); y **un fragmento de audio pesa ≈80 KB, con 320 KB por vuelta**
(`CTR-01.5`, **medido en el repo**).

| Concepto | Tope | Por qué ese número |
|---|---|---|
| Una separación | **20 KB** | El caso peor teórico de una máscara de 320×320 sin comprimir es 12,8 KB (un bit por píxel); 20 KB deja margen para una tapa muy picada y **no deja margen para una imagen mal hecha** |
| Las tres de un disco | **48 KB** | Juntas tienen que costar **menos que un solo fondo de `UX-04`**. Es el techo que ya existía, aplicado a la pieza nueva |
| Una trasera | **40 KB** | Es una ficha: las diez frontales van de 6 a 34 KB. Se busca la calidad más alta que entre en el tope, como ya hace `escribirBajoTope` en `generar-tapas.mjs` |
| **Una revelación con acierto** | **≤ 82 KB** | tres pasadas (≤48) + la ficha (≤34), que además sirve a la estampa y a la sala. **Es lo que pesa un fragmento de audio del mismo tema**, y llega **después** de la respuesta, no antes |
| Una revelación con fallo | **≤ 20 KB** | la clave sola. El que no la sacó no paga el color, que es la decisión del juego |
| Una vuelta de cuatro temas | ≤ 328 KB, y menos si se repite disco | contra 320 KB de audio que la misma vuelta ya baja. **La estampa no es lo que hace pesada esta pantalla** |
| Los 40 archivos en el repo | ~500 KB versionados | `.gitignore` no excluye `public/tapas/` (**medido en el repo**): se versionan, como las fichas de hoy |

**Y la regla que ordena todo el presupuesto: nada de esto se pide antes de que el tema se
cierre.** Ni precarga, ni `<link rel=preload>`, ni bajar la tapa del tema mientras suena el
fragmento. Durante la partida el ancho de banda es del audio (`CTR-01`), y el reveal
progresivo de 0,1 s es lo único de este sitio que no puede esperar.

---

## ADR-05.9 — Enmienda del 2026-09-02: el papel es la cuarta zona

- **Estado:** **aceptada**. Resuelve **`FIND-49`** de `REV-11` y contesta
  `Docs/SUGERENCIAS/HILO-para-arquitectura-el-papel-de-la-estampa.md`.
- **La pregunta que llegó:** el taller construido introduce una cuarta zona —papel sin
  imprimir, hasta el 20 % de la tapa— que el contrato no contempla. ¿Es una decisión de
  arquitectura que faltaba escribir, o es un error del taller?
- **La respuesta: es una decisión, y la ratifico.** El que estaba mal era el contrato.

### Qué decía este documento antes de hoy, para que se pueda leer dentro de dos meses

> **Regla 4.** *"Los umbrales son percentiles de la propia tapa, no números fijos. La clara
> se lleva el 25 % más luminoso, la media el 40 % siguiente, la clave el 35 % restante."*
>
> **Regla 5.** *"Las tres máscaras son disjuntas **y suman la imagen entera**."*
>
> Y en `CTR-12` §3 vivían `CUOTA_CLARA` `0.25`, `CUOTA_MEDIA` `0.40` y
> `TOLERANCIA_COBERTURA` `0.12`; en §5, el caso 11 pedía *"ninguno transparente en las
> tres"* y el caso 12, *"la cobertura de cada pasada cae dentro de su cuota"*.

### Las cuatro razones de la ratificación

**1. La cláusula que se cae ya se contradecía con el propio `ADR-05`.** `ADR-05.2` escribió,
para explicar la pasada muda de *Gulp!*: *"en serigrafía eso es exactamente lo que pasa: el
blanco de una serigrafía es el papel que no se imprimió"*. Y la regla 5 decía que las tres
tintas suman la imagen entera — o sea, que **no hay un solo píxel de papel en ninguna de las
diez tapas**. Las dos frases no pueden ser ciertas juntas. Se cae la que no tenía nada
detrás.

**2. Ahora hay ficha, y la ficha dice papel.** `RES-54.2` describe la secuencia de una
serigrafía multicolor **sobre soporte claro** así: *"blanco (si aplica) → amarillo →
magenta → cian → negro/clave, siempre último"*. **"Si aplica"** es el punto: el blanco es
una tinta más solo cuando el soporte no es blanco. Sobre papel claro —que es lo que esta
pieza simula, y el token existe: `--papel`— el blanco **es** el soporte. La versión 2 del
taller, la que obedecía la regla 5 al pie, tuvo que imprimir la multitud de *Oktubre* con
la tinta gris `#9a9490` porque no le quedaba dónde poner el blanco; el resultado, dicho por
quien lo miró, fue barro.

**3. Lo que la regla 5 iba a comprar se compró igual.** Su motivo declarado era uno solo:
que el orden de impresión no quede horneado en los archivos, para que `RES-54` no costara
treinta regeneraciones. **La disjunción es lo que compra eso, y la disjunción no se tocó.**
La prueba llegó sola: `RES-54` se fichó el 2026-09-01 diciendo clave última, y se cambió un
retraso de CSS. Cero archivos. La cláusula "suman la imagen entera" viajaba de garrón en
esa oración, sin hacer trabajo.

**4. Y la razón que convierte esto en una decisión y no en un ajuste de gusto: el piso de
la clave es el contrato de la pantalla de fallo.** `ADR-05.8` ya había decidido que al que
no acertó se le imprime **la clave sola**. `RES-54.3` dice que la clave es la que *"sostiene
el registro de las demás"*, y la lectura de `INV-54` lo dice para este juego con todas las
letras: *"la clave sola —sin color— sigue siendo una imagen legible; las tintas clara y
media solas, sin la clave, no lo son"*. Con el reparto viejo —35 % con tolerancia ±12— la
clave podía bajar al 23 % y **la pantalla de fallo quedaba ilegible sin que ningún test se
quejara**. `PISO_CLAVE` y el mínimo del guardián no son estética: son lo que sostiene la
lectura de "te faltó el color".

### Los números, medidos sobre las diez tapas

**Medido en el repo**, `scripts/pasadas-manifiesto.json`, corrida del 2026-09-02:

| Disco | clave | papel | el medio se repartió por |
|---|---|---|---|
| `gulp` | 48,9 % | 15,5 % | color |
| `oktubre` | 67,1 % | 12,8 % | color |
| `un-baion-para-el-ojo-idiota` | 34,7 % | 13,9 % | color |
| `bang-bang-estas-liquidado` | 34,1 % | 13,8 % | **luz** (ceniza y ocre se pisan) |
| `la-mosca-y-la-sopa` | 34,0 % | **8,3 %** | **luz** |
| `lobo-suelto` | 34,1 % | 13,0 % | color |
| `cordero-atado` | 35,1 % | 13,9 % | color |
| `luzbelito` | 36,5 % | 14,0 % | **luz** (cuero y topo se pisan) |
| `ultimo-bondi-a-finisterre` | 35,6 % | 13,9 % | **luz** (plata y acero se pisan) |
| `momo-sampler` | **80,6 %** | 13,9 % | **luz** |

Y los pesos, que sobran contra el presupuesto de `ADR-05.8` y por eso **no se toca ni un
tope**: la pasada más pesada es `gulp-media` con **10,4 KB** (tope 20) y el disco más pesado
es `ultimo-bondi-a-finisterre` con **25,7 KB** las tres (tope 48). Quedan escritos acá para
que una regeneración futura que duplique el peso se lea como lo que sería —una regresión— y
no como "entra en el tope".

**Lo que estos números dicen y hay que leer:** el papel se mueve poco (8 a 16 %) porque
`CUOTA_PAPEL` manda casi siempre; la clave se mueve muchísimo (34 a 81 %) porque `PISO_CLAVE`
la deja crecer en las tapas oscuras, que es lo correcto — *Momo Sampler* **es** casi toda
negra. Por eso el guardián topea el papel y **pone piso a la clave, sin techo**: los dos
controles miran hacia el único lado por donde esto se rompe.

### Lo que no cambia, y conviene decirlo porque es casi todo

Los seis candados originales, la decisión de `ADR-05` en una línea, `ADR-05.3` (PNG
pre-teñido), `ADR-05.4` (la convención de ruta), `ADR-05.5` (degradar por capa), `ADR-05.6`
(la trasera), `ADR-05.7` (el velo y `--tapa-*`) y `ADR-05.8` (el presupuesto entero, con
sus topes intactos). **Ni un archivo se regenera por esta enmienda**: los cuarenta que hay
en `public/` ya cumplen lo que este apartado ratifica.

### Lo que se paga, dicho de frente

1. **La composición pasa a ser tinta sobre papel, y eso tiene un corolario que no puedo
   esconder.** Las pasadas se apilan con `mix-blend-mode: multiply` sobre `--papel`
   (**medido en el repo**, `juego.css:2314`), así que **el color que se ve en pantalla es la
   tinta multiplicada por el papel, no la tinta**. Lo que el candado 1 promete y el guardián
   prueba es sobre **el archivo**: ahí el píxel lleva el hex medido de `RES-37`, exacto.
   Sobre el vidrio lo tiñe el soporte, como lo tiñe el papel de verdad. Si alguien alguna
   vez necesita que el color de pantalla sea el medido sin más, lo que hay que sacar es el
   `multiply`, no el test.
2. **Una dependencia nueva entre el archivo y la pantalla**, que es el candado 7. Antes las
   tres capas se bastaban; ahora hay un cuarto color que **no viaja en ningún archivo** y lo
   tiene que poner el CSS. Si mañana la estampa se apoya en otra superficie, el papel se
   vuelve un agujero. Por eso pasa a haber un caso de test (`CTR-12` §5, caso 19).
3. **Un invariante más flojo, a cambio de que sea verdad.** "Ningún píxel transparente en
   las tres" era barato de testear y falso; "no más de `TECHO_PAPEL` de cobertura sin tinta"
   es un tope y hay que elegirlo. Se eligió en **20 %**, con las diez tapas entre 8 y 16:
   deja cuatro puntos de aire y **no deja pasar una estampa a medio imprimir**.
4. **El papel no tiene piso, y está bien.** Una tapa sin blancos imprime sin papel — *La
   mosca y la sopa* ya está en 8,3 % — y eso es la tapa hablando, no un defecto. La cuarta
   zona existe cuando la tapa la tiene.
5. **Un borde que hay que conocer:** si alguien subiera `CUOTA_CLAVE` y `CUOTA_PAPEL` hasta
   cruzarlos, el medio quedaría vacío y **la clara y la media saldrían en blanco**. No es
   silencioso: lo caza el caso 10 (`una pasada no puede ser un archivo vacío`). La salida es
   bajar una de las dos cuotas, **nunca aflojar el test**.

---

# CTR-12 — El contrato de las separaciones

Lo que sigue es lo que `T-199` tiene que producir y lo que
`src/lib/tapa/pasadas.test.ts` tiene que hacer cumplir. Un incumplimiento acá es un build
en rojo, no una discusión.

## 1. Los 40 archivos

| Ruta | Cantidad | Formato | Medidas | Tope |
|---|---|---|---|---|
| `public/tapas/pasadas/<slug>-clara.png` | 10 | PNG RGBA | las de su ficha (hoy 320×320) | 20 KB |
| `public/tapas/pasadas/<slug>-media.png` | 10 | PNG RGBA | ídem | 20 KB |
| `public/tapas/pasadas/<slug>-clave.png` | 10 | PNG RGBA | ídem | 20 KB |
| `public/tapas/trasera/<slug>.jpg` | 10 | JPEG | 320 px de **lado largo**, proporción del máster | 40 KB |

Los diez `<slug>` son los de `DISCOS`. **La trasera no se recorta a cuadrado**: recortar
sería elegir qué parte de la contratapa se ve, y eso es del catálogo de `experiencia`
(`UX-05`), no del taller.

## 2. El perfil del PNG, y por qué está acotado

**8 bits por canal, color type 6 (RGBA), sin entrelazado, sin paleta.** No es un detalle de
codificación: es lo que permite que el guardián **abra el archivo y mire los píxeles con
`node:zlib` y nada más**. Si el taller emitiera PNG con paleta o WebP, el guardián
necesitaría una dependencia para verificar la única afirmación que el riesgo del ciclo pide
verificar, y "el color es el medido" volvería a ser una promesa.

Si algún día un archivo no entra en su tope, **la salida no es cambiar de formato**: es
subir el suavizado, revisar la ficha, o volver a este documento.

## 3. Las constantes del taller, con nombre

Mismo criterio que `ADR-04.1` y que `D-32`: ningún número se escribe dos veces ni queda
suelto. Viven al principio de `scripts/generar-pasadas.mjs`.

**Enmendada el 2026-09-02** (`ADR-05.9`): esta tabla describe el taller que hay, no el que
se había imaginado. Lo que decía antes está citado en `ADR-05.9`.

| Constante | Valor | Qué pasa si se mueve |
|---|---|---|
| `MEDIANA` | `3` | el filtro que saca el ruido del JPEG sin comerse el borde. Es lo que permite que el sigma sea bajo |
| `SIGMA_SUAVIZADO` | `0.9` | menos, y el borde persigue lo que la mediana no limpió; **techo `3.0`**, arriba de eso la tapa deja de reconocerse |
| `CUOTA_CLAVE` | `0.34` | la fracción más oscura que se lleva la clave, como percentil de esa tapa |
| `PISO_CLAVE` | `44` | **luminancia absoluta (0..255)**: todo lo más oscuro que esto va a la clave aunque pase la cuota. Sin esto, el ruido sobre un negro plano se va a la tinta clara |
| `CUOTA_PAPEL` | `0.14` | la fracción más luminosa que queda sin tinta |
| `TECHO_PAPEL` | `218` | **luminancia absoluta**: nada más claro que esto lleva tinta nunca. Es "el blanco es el papel", hecho número |
| `MINIMO_TINTA` | `0.06` | si el reparto por color deja una tinta con menos que esto del medio, el medio se parte por luminancia |
| `MIN_CONTRASTE_ENTRE_TINTAS` | `1.5` | por debajo, la pasada es **muda** y se avisa. No es error (`ADR-05.2`) |
| `TOPE_KB_PASADA` | `20` | por archivo. La real más pesada mide 10,4 |
| `TOPE_KB_PASADAS` | `48` | por disco, las tres juntas. El disco real más pesado mide 25,7 |
| `TOPE_KB_TRASERA` | `40` | por archivo |
| `ANCHO` | `320` | el ancho de la separación. **Nunca agranda** (`withoutEnlargement`): sale de la ficha, que ya mide 320 |
| `ANCHO_TRASERA` | `320` | lado largo. `D-04`: el máster no llega al sitio |

**Y las dos del guardián**, que son del contrato y no del taller — a propósito: si el
guardián leyera las constantes del script, no estaría verificando nada, estaría copiando.

| Constante (en `pasadas.test.ts`) | Valor | Qué afirma |
|---|---|---|
| `MAXIMO_PAPEL` | `0.20` | ninguna estampa deja sin tinta más de un quinto de la tapa (`ADR-05.9`) |
| `MINIMO_CLAVE` | `0.30` | la clave siempre sostiene el dibujo, y con eso la pantalla de fallo se lee (`RES-54.3`) |

## 4. El manifiesto: una declaración que se verifica, no una verdad

`scripts/pasadas-manifiesto.json`, escrito por el taller. **No lo baja nadie: no está en
`public/`.** Por disco: los dos hex usados y a qué pasada fue cada uno, la cobertura de
cada máscara, los bytes de cada archivo, los avisos de pasada muda, y el **hash corto
(SHA-1, 8 dígitos) de la ficha de la que salieron**.

**Y tres campos más desde la enmienda** (`ADR-05.9`), porque lo que no está declarado no se
puede comprobar: **`papel`**, la fracción que quedó sin tinta; **`repartoPorLuz`**, si el
medio se repartió por color o cayó al repuesto por luminancia (regla 5); y el bloque
**`trasera`** con su máster, sus bytes, su calidad y sus medidas. Que el manifiesto diga
`repartoPorLuz` importa más de lo que parece: es el único lugar donde queda escrito que en
cinco de los diez discos el reparto por color no alcanzó, y **es el número que hay que mirar
si algún día se cambia una tinta en `tokens.css`**.

El hash es lo único que el guardián no podría deducir solo, y cierra el agujero que ningún
otro control cubre: **una ficha regenerada con pasadas viejas.** El test recalcula el hash
de `public/tapas/<slug>.jpg` con `node:crypto` y compara. Todo lo demás del manifiesto se
vuelve a medir contra los archivos: **el manifiesto no se cree, se comprueba.**

## 5. Qué mira `src/lib/tapa/pasadas.test.ts`

Cada caso cierra un apartado. Sin esto, el `ADR-05` es una opinión.

| # | Caso | Cierra |
|---|---|---|
| 1 | **Existen los 40 archivos**, uno por disco y por pasada, más las diez traseras | `CTR-12.1` |
| 2 | Ninguna pasada pasa **20 KB**; las tres de un disco no pasan **48 KB**; ninguna trasera pasa **40 KB** | `ADR-05.8` |
| 3 | Cada PNG tiene **alfa**: IHDR con bit depth 8, color type 6, entrelazado 0 | `CTR-12.2` |
| 4 | Las medidas de cada pasada **son las de su ficha**, leídas del archivo con `medidas()` de `arte.ts` — no un 320 escrito a mano | `ADR-05.1` |
| 5 | **Una sola tinta por archivo:** entre los píxeles con alfa > 0 hay un único RGB | candado 3 |
| 6 | **Ese RGB es el del token**, con el taller y el test parseando `tokens.css` cada uno por su lado, y **±2 por canal** de tolerancia de redondeo | `ADR-05.2`, y es **el test del riesgo del ciclo** |
| 7 | **La asignación clara/media respeta la luminancia:** la clara es el más luminoso de los dos tokens del disco, recalculado por el test | `ADR-05.2` |
| 8 | La clave de los diez discos es **`--fondo`** | `ADR-05.1` |
| 9 | **Tinta plana:** no existe un solo píxel con alfa distinta de 0 y de 255 | candado 2 |
| 10 | Hay al menos un píxel opaco y al menos uno transparente. **Una pasada no puede ser un rectángulo lleno ni un archivo vacío** | `ADR-05.1` |
| 11 | **Disjuntas, y el papel topeado** *(enmendado)*: ningún píxel opaco en dos pasadas, y lo que no lleva tinta **no pasa de `MAXIMO_PAPEL`** | `ADR-05.9` |
| 12 | **La clave cubre al menos `MINIMO_CLAVE`** *(enmendado)*. No hay cuota para la clara ni para la media: el reparto lo manda la tapa, y que no queden vacías ya lo dice el caso 10 | `ADR-05.9`, `RES-54.3` |
| 13 | El hash de ficha del manifiesto coincide con el de `public/tapas/<slug>.jpg` | `CTR-12.4` |
| 14 | `rutaPasada`/`rutaTrasera`/`rutaFicha` devuelven **`null`** para un slug que no está en `DISCOS`, y para `''` | `ADR-05.4` |
| 15 | `rutaFicha(slug)` devuelve **lo mismo** que `arte.ts:tapa(slug)` para los diez. Dos convenciones de ruta que se separan en silencio es un 404 esperando | `ADR-05.4` |
| 16 | `src/lib/tapa/pasadas.ts` **no importa `node:*`** ni nada que lo arrastre (lo cubre `islas.test.ts`, se corre igual) | `D-29` |
| 20 | El nombre estampado de cada disco y **cuáles tres tienen letra propia** son los que fijó `CNT-14` §2.7, y los tres calcados **solo usan glifos que su fuente tiene** | `ADR-05.4`, `diseno-marca.md` |
| 21 | `slugDeRecorte` saca el disco de un `<slug>-zoom`, y **todo ítem `listo` con encuadre `detalle` de `tapa.json` delata su disco** | `ADR-05.4`, `T-206` |
| 22 | El taller y `discos.ts` **listan los mismos diez discos**: el `.mjs` repite la lista y esto es lo que impide que se separen | `ADR-05.4` |

*(Los casos 20-22 los agrega la enmienda: ya existían en el guardián y faltaban en el
contrato. No se reusan los números 11 y 12, que quedaron enmendados en su lugar.)*

**Y tres que no son de este archivo pero son de este contrato**, en
`src/lib/estilos.test.ts`:

| # | Caso | Cierra |
|---|---|---|
| 17 | El patrón del guardián del velo pasa de `/tapas/fondo/` a `/tapas/` **o** `var(--tapa-` | `ADR-05.7` |
| 18 | Ninguna isla escribe `style.backgroundImage` con una ruta de tapa: la imagen entra por `--tapa-*` | `ADR-05.7` |
| 19 | **La superficie donde se apilan las pasadas declara `background: var(--papel)` y es opaca.** Concreto y greppable: el bloque `.estampa-papel` de `juego.css` lleva `background: var(--papel)` y `isolation: isolate`, y ninguno de los dos se puede borrar | **candado 7**, `ADR-05.9`, y es la vuelta de `FIND-48` |

**El caso 19 es nuevo y lo escribe el hilo principal**, no este rol (`D-12`). Es el único
trabajo de código que genera esta enmienda, y es de una línea de test: sin él, el color de
la cuarta zona —el único que no viaja en ningún archivo— es lo único de toda la estampa que
nadie audita. Es la misma forma exacta del agujero que `ADR-05.7` encontró para el velo.

## 6. Lo prohibido, en una lista para revisar

1. Un hex de disco escrito fuera de `tokens.css` — en el taller, en el guardián o en el CSS.
2. Un color de clave que no sea `--fondo`.
3. Alfa intermedia en una separación.
4. Más de un RGB adentro de una separación.
5. El corrimiento de registro horneado en el archivo.
6. Pedir una pasada, una ficha o una trasera **antes** de que el tema se cierre.
7. Una imagen de fondo escrita en línea desde una isla.
8. Texto encima de la estampa sin velo y sin par testeado.
9. Un campo nuevo en `adivinar-tema.json` o en `tapa.json` para llegar a estos archivos.
10. Que el taller corra dentro de `npm run build` (ver el apartado siguiente).
11. Afirmar año, sello o edición a partir de una trasera (`ADR-05.6`).
12. Emitir menos de tres pasadas por disco, aunque una sea muda.
13. **Apilar las pasadas sobre cualquier cosa que no sea una superficie opaca de `--papel`.**
    Sin ella el papel no es papel: es un agujero (candado 7, `FIND-48`).
14. **Una cuarta tinta blanca para imprimir los blancos.** Sería un hex nuevo fuera de
    `tokens.css` y, encima, al revés de la técnica: sobre soporte claro el blanco se imprime
    *"si aplica"* (`RES-54.2`), y acá no aplica.
15. **Dejar sin tinta más de `MAXIMO_PAPEL` de la tapa**, o que la clave baje de
    `MINIMO_CLAVE`. Lo primero se ve a medio imprimir; lo segundo deja ilegible la pantalla
    de fallo, que es la clave sola.

## 7. El taller no entra al build, y esto no es una preferencia

`sharp` **no está declarado en `package.json`** — ni en `dependencies` ni en
`devDependencies` (**medido en el repo**). `generar-tapas.mjs` ya vive así: se corre a mano
y sus salidas se versionan. `generar-pasadas.mjs` hereda ese régimen entero, y la razón es
dura: **el despliegue estático de `D-15` no puede depender de una herramienta que el repo
no declara.** Un `npm run build` en Vercel que necesite `sharp` es un sitio que deja de
publicarse el día que alguien limpie `node_modules`.

Que el comando entre a `package.json` como `generar-pasadas` está bien —los otros nueve
generadores están ahí— **mientras no se lo cuelgue de `build`**.

---

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **`mask-image` en tiempo de ejecución, con máscaras en gris** | No ahorra archivos, mueve composición al teléfono, depende de un soporte que no tengo fichado, y **rompe la única verificación que prueba que el color es el medido**. Ver `ADR-05.3` |
| **Máscaras acumulativas (cada tinta imprime también lo más oscuro)** | Hornea el orden de impresión en los archivos: el día que llegue `RES-54` habría que regenerar treinta. Y con tinta opaca, lo que queda debajo no se ve: es peso por nada |
| **Umbrales fijos iguales para las diez tapas** | *Cordero atado* es casi negra y *Gulp!* casi crema: con un número fijo, una imprime una sola pasada y la otra casi ninguna clave. Obligaría a afinar diez juegos de números a mano, y a reafinarlos cada vez que se regenere una ficha |
| **Alfa con medio tono (la máscara lleva la luminancia adentro)** | Es un degradado con otro nombre, y `diseno-marca.md` los veta. Además la separación dejaría de ser probable a máquina: "una tinta plana" es una aserción, "un degradado del color correcto" no |
| **Separar desde el máster de 953 px y reducir** | Rompe el registro con la foto que se fija encima —la ficha no es una reducción exacta de la máscara— y crea una segunda fuente de verdad sobre la misma tapa |
| **WebP o AVIF con alfa** | Pesan menos y **no los puede abrir el guardián sin una dependencia**. El ahorro es de pocos KB sobre un presupuesto que ya entra; el costo es dejar de poder probar el color |
| **PNG con paleta (dos colores + `tRNS`)** | Mismo argumento: pesaría la mitad y complicaría el decodificador del guardián con otro camino (PLTE, `tRNS`, profundidades menores a 8). El peso no es el problema de esta pieza |
| **Un campo `tapa`/`pasadas` en el JSON de cada juego** | 105 ítems tocados, un schema nuevo, una versión de contrato y una segunda verdad sobre algo que se deduce del slug |
| **Un manifiesto que la isla lea en el navegador para saber qué archivos existen** | Un pedido de red más, en la pantalla que menos lo necesita, para evitar un 404 que ya está manejado por capa (`ADR-05.5`) |
| **Generar las pasadas en el build de Astro (a demanda)** | Ata el despliegue a `sharp` (apartado 7), y convierte cuarenta archivos deterministas en trabajo repetido en cada publicación |
| **Sumar las dos formas nuevas a `generar-tapas.mjs`** | Ese script produce lo que ya funciona y trata los faltantes como avisos; el taller nuevo tiene que **fallar**. Dos políticas de error en un archivo terminan siendo una sola, la más floja |
| **No emitir las pasadas mudas** (`gulp` clara, `cordero-atado` media, `momo-sampler` clara) | Convierte "existen los 40" en "existen entre 33 y 40" y obliga a la isla a saber cuáles faltan. El ahorro es de tres archivos de pocos KB |
| **Un negro propio para la clave** | Un hex nuevo fuera del circuito del lienzo, para reemplazar a un token que ya existe y que además es la base que `D-19` dice que no rota |
| **Recortar la trasera a cuadrado en build** | Elegir qué parte de la contratapa se ve es del catálogo de `experiencia` (`UX-05`), no del taller |
| **Precargar las pasadas del tema en curso mientras se juega** | Compite con el fragmento de audio, que es lo único de este sitio que no puede esperar (`CTR-01`, `D-26`) |

**Y las que descartó la enmienda del 2026-09-02** (`ADR-05.9`), que son las salidas que
tenía enfrente en vez de ratificar el papel:

| Alternativa | Por qué no |
|---|---|
| **Sostener el contrato y corregir el taller: que las tres tintas vuelvan a cubrir la imagen entera** | Es la versión 2 del taller, y ya se probó sobre las diez tapas: la multitud de *Oktubre* se imprime con la tinta gris porque no queda dónde poner el blanco. Y contradice al propio `ADR-05.2`, que ya había escrito que el blanco de una serigrafía es el papel |
| **Una cuarta tinta blanca, `<slug>-blanca.png`** | Un hex nuevo fuera de `tokens.css` para pintar de blanco algo que ya es del color del papel; diez archivos más y ~10 % más de peso por disco; y al revés de la técnica, que sobre soporte claro imprime blanco solo *"si aplica"* (`RES-54.2`) |
| **Dejar el papel sin techo, puro percentil** | El tope es lo único que separa "una serigrafía tiene papel" de "esta estampa no terminó de imprimirse". Sin número, la diferencia queda en el ojo de quien mire, que es exactamente lo que el riesgo del ciclo pide no hacer |
| **Repartir el medio siempre por luminancia** (sin la tinta más cercana) | Es la versión 2 otra vez para las tapas de dos tintas separadas en color: *Oktubre* pierde el rojo. El reparto por color sirve en cinco de los diez, y en los otros cinco el repuesto por luz entra solo |
| **Repartir el medio siempre por color** (sin el repuesto de `MINIMO_TINTA`) | En cinco discos las dos tintas están tan cerca —plata y acero, cuero y topo— que una se queda con casi todo y la otra sale un archivo casi vacío. El repuesto es lo que garantiza tres tintas visibles |
| **Un `-v2.md` del documento entero** | El cambio no invalida `ADR-05`: invalida tres números. Un archivo nuevo dejaría huérfanas las referencias del taller, del guardián, del plan del ciclo y de las dos sugerencias, para preservar una historia que esta enmienda preserva citando lo que decía |
| **Aflojar el guardián para que pase lo que salga del taller** | Es la salida que convierte un contrato en un acta. Los dos números del guardián (`MAXIMO_PAPEL`, `MINIMO_CLAVE`) están **elegidos con aire contra lo medido**, no calcados de la corrida: si mañana una tapa se va a 25 % de papel, tiene que romper |

---

## Consecuencias

**Lo que se vuelve fácil:**

- El premio del juego pasa a ser **el disco**, y no cuesta un schema, un campo, ni una
  decisión de contenido: una función que arma una ruta con un slug que la isla ya tenía.
- "Adiviná la tapa" (`T-206`) hereda todo gratis: mismos archivos, mismo módulo, misma
  convención, y por fin muestra la tapa entera al revelar — lo que el ciclo 10 dejó afuera.
- Si `RES-37` remuestrea una tapa, el sitio y la estampa **no pueden desincronizarse en
  silencio**: el build queda en rojo con el nombre del disco.
- Si `RES-54` dice que el orden de las pasadas es otro, se cambia un retraso en el CSS.
  Cero archivos regenerados. **Ya pasó**, el 2026-09-01: dijo clave última y costó eso.
- **El papel sale gratis.** La cuarta zona no tiene archivo, no tiene token nuevo, no tiene
  hex nuevo y no pesa: es lo que se ve donde las tres máscaras no imprimen (`ADR-05.9`).

**Lo que se paga:**

- **Cuarenta archivos más en el repo**, ~500 KB versionados, y un taller más que hay que
  acordarse de correr cuando cambia una ficha. La mitigación es el hash del manifiesto:
  olvidarse deja de ser silencioso.
- **El color queda horneado** (`ADR-05.3`). Es el precio de poder probarlo.
- **El guardián tiene que decodificar un PNG a mano**, con `node:zlib`. Son unas setenta
  líneas de test que nadie va a querer escribir, y son las que sostienen la afirmación más
  cara del ciclo.
- **Tres tapas imprimen dos tintas visibles en vez de tres** —*Gulp!*, *Cordero atado* y
  *Momo Sampler*—, y no hay nada que arreglar: es lo que da la paleta medida de esas tapas.
- **La estampa quedó atada a apoyarse en `--papel`** (candado 7). Es la única dependencia
  que la enmienda agrega, y es la que paga que la cuarta zona no cueste un archivo.
- **Lo que se ve en pantalla es la tinta multiplicada por el papel, no la tinta.** El hex
  medido está exacto en el archivo, que es donde el guardián lo prueba; sobre el vidrio lo
  tiñe el soporte, como el papel de verdad (`ADR-05.9`).
- **Nada de esto prueba que la estampa se vea a serigrafía.** Los tests fijan el material y
  las prohibiciones; que parezca impresa lo decide un ojo, con `UX-22` de vara y `REV-11`
  de juez.

---

## Lo que no decido yo

- **Cómo se ve y cuánto dura la impresión**, qué se estampa y qué no, y el equivalente
  quieto de cada pieza: `UX-22` (`T-195`, `experiencia`). Le dejé en
  `Docs/SUGERENCIAS/ARQ-para-experiencia-limites-de-la-estampa.md` las cuatro cosas de este
  documento que le llegan como restricción.
- **Las palabras**: `CNT-14` (`T-198`, `contenido`). Tres que este documento genera y no
  escribe: qué dice la pantalla cuando la trasera no llega, cómo se nombra el crédito de la
  estampa, y el crédito de *La mosca y la sopa*, que **no lleva el nombre de Rocambole**
  mientras `RES-44` siga en pie.
- **El sello de crédito tiene que nombrar el disco que se estampó.** Es la condición 1 de
  `D-21` (*el crédito dice qué tapas se usaron en esa pantalla*), y hoy la pantalla de
  "Adiviná el tema" viste un solo disco fijo. El mecanismo ya está definido en `UX-04`
  (sello de esquina en islas de partida); lo que cambia es que el texto pasa a depender del
  tema. Lo construye `T-200`.
- **El orden de las pasadas**: era `RES-54` (`T-196`) y **llegó** — clara → media → clave,
  la clave última, por convención del oficio (`RES-54.1`-`.4`, `.9`). No lo escribí de
  memoria y no lo escribo ahora tampoco: se cita la ficha.
- **La construcción y la verificación**: hilo principal (`T-199`..`T-206`) y `revisor`.
  Este rol no tiene con qué correr un comando (`D-12`).

## Pendientes de ficha — para `investigador`

Ninguno frena esta decisión.

1. ~~**`RES-54`, ya pedida en `T-196`**~~ — **cerrada el 2026-09-01**. Costó un retraso de
   CSS y cero archivos, que era la apuesta.
2. **Soporte real de `mask-image` y sus prefijos** en los navegadores de gama baja. Hoy no
   lo afirmo en ninguna dirección; el diseño está hecho para que no importe. Serviría el
   día que alguien quiera reabrir `ADR-05.3`.
3. **Cómo separaba Rocambole sus propias tapas** — cuántas tintas, con qué criterio, cuánto
   papel dejaba. **`investigador` ya lo buscó y no lo encontró** (`RES-54.13`, con todas las
   letras: ninguna fuente da un número de tintas ni un orden), así que sigue abierta pero
   **por dos vías que no son web**: la entrevista de Clarín del 18-jun-1999 contra el
   original, y el libro *Solos y de noche*. Mientras tanto, la separación en tres tintas más
   el papel es **criterio propio de este rol** apoyado en `RES-06` y `RES-54.14`, y ninguna
   pieza del sitio puede decir que así imprimía él.
4. **Nuevo, y no frena nada:** si aparece algo sobre **cuánto papel deja un afiche
   serigrafiado de edición limitada**, el techo del 20 % pasa de criterio propio a número
   con respaldo. Hoy sale de mirar diez tapas, y está escrito como tal.

---

## Cómo se verifica

Lo corre el hilo principal o `revisor` (`D-12`: yo no tengo con qué). En este orden.

**Antes de construir nada — la línea de base, que tiene que dar exactamente esto:**

```powershell
# Las diez fichas estan y son de las que salen las pasadas.
Get-ChildItem public\tapas\*.jpg | Select-Object Name, Length
# Los veinte tokens de disco + --fondo + --papel viven en tokens.css y en ningun otro lado.
Select-String -Path src\styles\*.css -Pattern '--disco-.*-(tinta|apoyo):'
# Cero hex fuera de tokens.css (tiene que seguir en cero despues de todo el ciclo).
node --test src/lib/estilos.test.ts
```

**Después de `T-199` (el taller):**

```bash
node scripts/generar-tapas.mjs        # primero: las pasadas salen de las fichas
node scripts/generar-pasadas.mjs      # imprime KB, cobertura y avisos por disco
node --test src/lib/tapa/pasadas.test.ts
node --test src/lib/islas.test.ts     # D-29: pasadas.ts no arrastra node:*
```

La corrida del taller tiene que terminar con **código 0**, cuarenta archivos, y
**exactamente tres avisos de pasada muda** *(enmendado el 2026-09-02: decía dos)* — `gulp`
clara contra el papel (1,02:1), `cordero-atado` media contra la clave (1,04:1) y
`momo-sampler` clara contra el papel (1,12:1). **Un cuarto aviso es un dato nuevo: se mira
antes de seguir.**

**Para verificar la enmienda `ADR-05.9`. La corre el hilo principal, no este rol (`D-12`), y
no hay que regenerar nada: los cuarenta archivos que están ya cumplen lo que se ratificó.**

```bash
# 1. El guardián tiene que seguir pasando tal como está, sin tocar un archivo.
node --test src/lib/tapa/pasadas.test.ts

# 2. El taller, sin escribir nada, tiene que imprimir los mismos numeros de ADR-05.9:
#    clave entre 34 % y 81 %, papel entre 8 % y 16 %, tres avisos de pasada muda,
#    ninguna pasada sobre 10,4 KB, ningun disco sobre 25,7 KB las tres.
node scripts/generar-pasadas.mjs --ver

# 3. Cuando este escrito el caso 19 (candado 7): el bloque .estampa-papel de juego.css
#    conserva `background: var(--papel)` y `isolation: isolate`.
node --test src/lib/estilos.test.ts
```

Si (1) pasa y (2) imprime otros números, **lo que cambió es una ficha, no el contrato**: hay
que mirar el `hashFicha` del manifiesto antes que cualquier otra cosa.

**Después de `T-200`..`T-203` (la estampa, la sala, la trasera):**

```bash
npm test
npm run check
npm run build
node --test src/lib/contraste.test.ts
node --test src/lib/movimiento.test.ts
node --test src/lib/estilos.test.ts
```

**A ojo, en un teléfono de verdad a 375×812, que es lo que ninguna máquina hace:**

1. Una vuelta con **acierto**: la tapa se imprime, el botón `Seguí` **está desde el primer
   cuadro y no se mueve** cuando llegan las capas.
2. Una vuelta con **fallo**: **una sola tinta**, y se lee como una decisión del juego, no
   como una imagen a medio cargar. Es la pregunta que `REV-11` va a hacer.
3. **En la pestaña de red:** al abrir el juego no se pide ni una pasada; al cerrar el tema
   se piden tres; **la trasera recién aparece cuando se toca la tapa**.
4. Con la red estrangulada a 3G: la revelación se lee entera antes de que llegue una sola
   imagen.
5. Con **`prefers-reduced-motion`** activo: la estampa aparece terminada, sin secuencia, y
   dice lo mismo (`UX-20` §5).
6. *Gulp!* y *Cordero atado*, de a una: **se reconocen igual** aunque impriman dos tintas.
7. Con `public/tapas/pasadas/` renombrada a mano: la revelación cae a la foto sola y
   después al texto, **sin un solo ícono de imagen rota y sin que el botón se corra**.
8. **El papel se lee como papel, no como un agujero** (`ADR-05.9`, candado 7): donde la
   tapa no lleva tinta se ve el crema de `--papel`, nunca la tapa velada del fondo. *Gulp!*
   es la prueba más fácil —es la que más papel deja, 15,5 %— y *Oktubre* la que más importa:
   la multitud tiene que leerse en papel y negro, **no en gris**.
9. **Ninguna de las diez se lee a medio imprimir.** Es la pregunta que la enmienda deja
   abierta al ojo: el número topea el 20 %, pero que el 15 % de *Gulp!* sea "una serigrafía"
   y no "una imagen que no cargó" lo dice `REV-11`, no el guardián.
