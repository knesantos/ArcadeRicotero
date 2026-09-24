# ORQ — Plan del ciclo 16: el fichín se prueba solo

> **Escrito por el hilo principal** con `/ciclo`, el 2026-09-22, a pedido del usuario:
> *"hace un ciclo bien grande, para probar las nuevas capacidades del opus 5.5. Que las
> tareas sean creativas y complejas."* Y a mitad de la planificación: *"Guardemos los
> setlist que encuentre también"*.
>
> Arranca sobre `main` en `1478ae7`, **con el árbol limpio**. `ESTADO.md` decía que el ciclo
> 15 estaba sin commitear y ya no era cierto: el commit `1478ae7` lo guardó entero.
>
> **Dos decisiones del usuario, tomadas antes de cortar nada**, y escritas al abrir:
> **`D-44`** —el pixel lo dibuja el hilo principal, como código— y **`D-45`** —"Fácil" en
> `US-02` es lo más tocado en vivo según setlist.fm, y los setlists se guardan enteros—.
>
> **Consume:** `US-09`, `BR-01`, `BR-18`, `BR-23`..`BR-28`, `D-14`, `D-27`, `D-38`..`D-45`,
> `ADR-08`, `CTR-07`, `CTR-15`..`CTR-17`, `UX-27`..`UX-30`, `CNT-18`, `RES-05`, `RES-20`,
> `RES-61`, `RES-64`, `ORQ-plan-ciclo-15.md`, `REV-14`, y el addendum de
> `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`.
>
> **Rango** (`Docs/IDS.md`, fila del 2026-09-22): `T-261`..`T-290`, `BR-29`, `ADR-09`,
> `CTR-18`, `CTR-19`, `UX-31`+, `CNT-21`+, `RES-73`+ (archivo `INV-73`), `REV-15`,
> `FIND-71`+, `IDEA-15`+. El plan usa `T-261`..`T-280`.

## 0. La idea del ciclo, en un párrafo

Skayboy y Poligirl tiene **un nivel** y el piso pide **seis listos**. Lo que traba los cinco
que faltan no es dibujarlos: es que `BR-25` exige, por cada nivel, que se pase solo, que
ninguna acción pida dos dedos a la vez, que el que espera quede a salvo y que la paridad esté
contada — y hoy **las cuatro cosas solo las puede probar una persona con un teléfono**. Seis
niveles son doce partidas, y cada vez que alguien afine la gravedad, otras doce. Este ciclo
construye **una máquina que juega sola**: busca sobre la simulación pura de `mundo.ts` el
camino de una persona con un dedo por vez, lo graba al lado del nivel, y el build lo vuelve a
jugar en cada `npm test`. Con eso los niveles se diseñan con una prueba en la mano en vez de
con una esperanza, y al teléfono le queda lo que solo un pulgar sabe: si se siente bien.
Alrededor de eso, lo que el juego necesita para que haya algo que probar —los mecanismos, los
cinco niveles, el arte— y, en paralelo, la puerta que `BR-28` tenía cerrada.

## 1. Lo medido antes de cortar nada

Medido hoy, 2026-09-22, sobre el árbol en `1478ae7`.

| Qué | Cómo | Cuánto |
|---|---|---|
| El sitio | `npm test` | **673/673** en verde, 17,9 s |
| Niveles | `src/data/skayboy.json` | **1**, `NIV-01`, en `borrador`, `verificaciones` las dos en `false` |
| Mecanismos en el mundo | `mundo.ts:231` | `=` y `n` existen en la leyenda y **no hacen nada**: la caja frena como sólido quieto |
| Solución grabada | `rg "solucion\|traza" src/lib/skayboy src/data/skayboy.json` | **ninguna** |
| Velocidad de la simulación pura | `paso()` sobre `NIV-01`, `dt = 1/60`, 200.000 cuadros | **~217.000 cuadros por segundo** en esta máquina |
| Paso de la isla | `partida-skayboy.ts:343` | **variable**: `paso(mundo, …, k.dt())` |
| Tintas del pixel | `grep -c -- "--px-" src/styles/tokens.css` | **0** de 16 |
| Carpeta de sprites | `public/sprites/` | **no existe** |
| Popularidad | `src/data/popularidad.json` | **105 temas, 0 mediciones**: todos `sin-video` |
| Fáciles de `US-02` | `BR-18` (f) contra lo anterior | **0 de 8**, y por `BR-28` eso cierra la puerta a un noveno juego |
| Temas con fragmento | `src/data/adivinar-tema.json` | **95** — es el pool del que salen los 8 |

**Dos de esas filas deciden el diseño del ciclo:**

1. **217.000 cuadros por segundo** quiere decir que una búsqueda que expande de a seis
   cuadros prueba unas 36.000 jugadas por segundo. Un nivel de 15 × 9 tiles se resuelve fuera
   de línea en segundos, y **el build no busca: repite la traza grabada**, que son unos pocos
   miles de cuadros por nivel. El solucionador no le agrega tiempo a `npm test`.
2. **La isla corre a paso variable** y la prueba correría a paso fijo. Sin arreglar eso, la
   máquina prueba una física y el teléfono corre otra parecida. Ver `T-263` y `T-267`.

## 2. Las tareas

| ID | Rol | Qué | Archivos | Verifica con | [P] |
|---|---|---|---|---|---|
| `T-261` | `experiencia` | **La pantalla deja de estar muda.** `UX-28 §2` rehecho: elige una de las cuatro salidas del addendum para el banco sin nivel listo, sube las teclas de vertical arriba del borde y renumera la `§2.2` doble | `Docs/UX/UX-28-la-pantalla-y-las-dos-puertas.md` (y `UX-27 §5.1` si gana *"el mueble apagado no es el área"*) | `rg -n "^#+ .*2\.2" Docs/UX/UX-28-la-pantalla-y-las-dos-puertas.md` devuelve **una** línea. La tabla de alturas de 812×375, 812×354 y 375×812 **la rehace a máquina `T-271`** en el navegador | **[P]** |
| `T-262` | `producto` | **`BR-29`: qué prueba la máquina y qué prueba el pulgar.** Reparte las seis condiciones de `BR-25` entre la traza grabada y la partida en el teléfono, y fija en **cuadros** la tolerancia mínima de cada escalón | `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md` | `rg -n "^## BR-29" Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`. Que la tabla tenga las seis filas con una columna *"la prueba"* sin celdas vacías, y que la tolerancia sea un número y no un adjetivo, lo mira `revisor` | **[P]** |
| `T-263` | `arquitectura` | **`ADR-09` + `CTR-18`: la solución grabada.** Formato de la traza, paso fijo en la isla y en la prueba, qué pasa cuando alguien afina la gravedad, y qué significa desde ahora `verificaciones.solo` | `Docs/ARQ/ARQ-solucion-grabada.md` (nuevo) | `rg -n "^## (ADR-09\|CTR-18)" Docs/ARQ/ARQ-solucion-grabada.md` devuelve dos. El ejemplo de traza del documento **lo pega y lo valida `T-267`** | **[P]** |
| `T-264` | `arquitectura` | **`CTR-16.10`: los mecanismos del escalón Media.** Palanca, placa, compuerta y caja: qué abre qué, `sostenido`, la compuerta con `id` propio, y con qué tintas se dibujan sin pedir la 17 | `Docs/ARQ/ARQ-schema-niveles.md` | `rg -n "CTR-16\.10" Docs/ARQ/ARQ-schema-niveles.md`; `rg -n "PUE-" Docs/ARQ/` solo devuelve líneas de enmienda — **cierra la `BAJA` de `mecanismo.abre`** que dejó el ciclo 15 | **[P]** |
| `T-265` | `experiencia` | **`UX-31`: la gramática de los seis niveles.** Qué enseña cada uno, cuánta distancia, qué se ve desde la entrada, qué molinete rechaza a quién (`UX-30`), la paridad programada nivel por nivel y cuánto tiene que durar | `Docs/UX/UX-31-los-seis-niveles.md` (nuevo) | Sin comando propio: que la paridad programada sume diferencia ≤ 1 (`BR-23.1`) **lo recuenta a máquina `T-277`** sobre las trazas; que cada nivel enseñe una cosa sola lo mira `revisor` | **[P]** |
| `T-266` | hilo principal | **El solucionador.** Búsqueda sobre `mundo.ts` que encuentra la traza de una persona sola —una columna por vez— y la de dos, y mide cuántos cuadros de margen tiene cada salto | `src/lib/skayboy/solucionador.ts`, `solucionador.test.ts`, `scripts/resolver-niveles.mjs` | `node --test src/lib/skayboy/solucionador.test.ts`: resuelve `NIV-01` de las dos maneras, y contra una sala con la puerta tapiada **contesta "sin solución" dentro de su presupuesto** (rojo, no cuelga). `node scripts/resolver-niveles.mjs` imprime traza, segundos y tolerancia | **[P]** |
| `T-267` | hilo principal | **Lo que la máquina prueba es lo que corre en el teléfono.** La traza entra al dato con el formato de `CTR-18`, la isla pasa a paso fijo, y `soluciones.test.ts` repite cada traza exigiendo victoria, una columna por cuadro y que el que espera nunca vuelva a la entrada | `src/data/skayboy.json` (`NIV-01`), `src/data/_schema/skayboy.schema.json`, `src/lib/skayboy/soluciones.test.ts`, `src/scripts/partida-skayboy.ts`, `motor.test.ts` | `npm test` en verde; y **rojo tres veces a mano**: la traza recortada un cuadro, dos columnas apretadas en el mismo cuadro de la traza de uno, y `GRAVEDAD` +10 % — la traza deja de ganar y el test nombra el nivel | dep. `T-262`, `T-263`, `T-266` |
| `T-268` | hilo principal | **La cadena del pixel**: las 16 `--px-*` nacen en la hoja 03 del lienzo, bajan a `tokens.css` y se testean a 3:1 contra `--px-clave`; la imprenta pasa una grilla de texto a PNG y el auditor la controla. Era `T-238` + `T-243` | lienzo de marca, `src/styles/tokens.css`, `src/lib/contraste.test.ts`, `scripts/imprimir-pixel.mjs`, `scripts/auditar-paleta-pixel.mjs` | `node --test src/lib/contraste.test.ts`; `node scripts/auditar-paleta-pixel.mjs` sale **0** sobre `public/sprites/` vacía y **≠ 0** con una tinta 17, con un píxel a alfa 128 y con un nombre `--px-` que no existe | **[P]**, dep. el usuario aprueba la paleta |
| `T-269` | `investigador` | **`RES-73`+: los recitales en setlist.fm.** Cuántos hay y cuántos traen temas, cobertura por época contra `RES-05`, términos y licencia del dato, la vía para bajarlos, y cómo aparecen escritos los títulos contra los 105 de `RES-20` | `Docs/INVESTIGACION/INV-73-recitales-setlistfm.md` (lo pega el hilo principal) | Sin comando: URL y fecha por afirmación, lo mira `revisor`. Lo único cruzable —cuántos recitales con temas— **lo vuelve a contar `T-279`** sobre el archivo bajado | **[P]** |
| `T-270` | `contenido` | **`CNT-21`: lo que la pantalla dice de nuevo.** Los seis nombres de nivel, y la línea de vertical que a ×1 deja de ser cierta (`CNT-18`, *"De costado se ve el doble de grande"*) | `Docs/CONTENIDO/CNT-21-los-seis-nombres.md` (nuevo); `CNT-18` marcada como enmendada | Diferido a donde aterriza cada cosa: la línea la audita `node --test src/lib/voz.test.ts` cuando entra a `copy.ts` (`T-271`); los nombres, el `pattern` de 8 palabras de `skayboy.schema.json` cuando entran al dato (`T-277`). `voz.test.ts` **no mira el dato**, así que anglicismos y fórmulas de folleto en los nombres, y que ninguno explique la mecánica, los mira `revisor` | dep. `T-261`, `T-265` |
| `T-271` | hilo principal | **El mueble entra entero**, en las dos orientaciones y con el banco vacío: `skayboy.css` y la página aplican `UX-28 §2` rehecho | `src/styles/skayboy.css`, `src/pages/juegos/skayboy-y-poligirl.astro`, `src/lib/skayboy/copy.ts` | `npm run build`; `node --test src/lib/estilos.test.ts`; **medido en el navegador** a 812×375, 812×354 y 375×812: `teclasFuera 0`, y en `dist/` la pantalla sin nivel listo **dice qué es** | dep. `T-261`, `T-270` |
| `T-272` | hilo principal | **Los mecanismos existen en el mundo**: palanca, placa, compuerta y caja empujable en `mundo.ts`, con el schema que los declara | `src/lib/skayboy/mundo.ts`, `niveles.ts`, `mundo.test.ts`, `src/data/_schema/skayboy.schema.json` | `node --test src/lib/skayboy/mundo.test.ts` con tres rojos: la placa sin nadie encima cierra, la caja no atraviesa un sólido, **un cuerpo no empuja ni carga a otro** (`BR-23.4`). Y `node scripts/resolver-niveles.mjs` resuelve solo una sala de prueba con **caja sobre placa**: la `alternativaSolo` de `CTR-16.6`, probada en vez de escrita | dep. `T-264`, `T-266`, `T-267` |
| `T-273` | `arquitectura` | **`CTR-19`: el archivo de los recitales.** Un recital por entrada —fecha, lugar, ciudad, temas en orden, fuente con URL y fecha de consulta—, los títulos resueltos contra los 105, y cómo la cuenta alimenta el corte de Fáciles sin mezclarse con `CTR-07.7` | `Docs/ARQ/ARQ-schema-recitales.md` (nuevo) | `rg -n "^## CTR-19" Docs/ARQ/ARQ-schema-recitales.md`; trae el schema para pegar, **que corre `T-279`** | dep. `T-269` |
| `T-274` | `producto` | **`BR-18` apartado (h): la vara de Fáciles pasa a lo más tocado en vivo** (`D-45`). Qué dice el rótulo, y si los tercios de `D-27` de "Sacalo por la letra" se alimentan de lo mismo — con el usuario | `Docs/PRODUCTO/PRD-alcance-v1.md` | `rg -n "^### h\)" Docs/PRODUCTO/PRD-alcance-v1.md`; el apartado (f) queda **marcado como enmendado, no borrado**. La respuesta sobre `D-27` la mira `revisor` | dep. `T-269` |
| `T-275` | hilo principal | **Los muñecos** (`D-44`): Skayboy y Poligirl dibujados como grilla de texto, 16 × 24 por cuadro, con los mismos estados y los mismos cuadros | `src/arte/pixel/skayboy.txt`, `poligirl.txt`, `public/sprites/skayboy.v1.{png,json}`, `poligirl.v1.{png,json}`, `src/lib/skayboy/atlas.test.ts` | `node scripts/imprimir-pixel.mjs`; auditor en **0**; `node --test src/lib/skayboy/atlas.test.ts` en rojo si a uno le falta un cuadro que el otro tiene (`BR-23.2`). **La hoja de contacto** —color, y blanco y negro a 32 × 48 CSS para `BR-23.3`— la mira `revisor` y **la aprueba el usuario** | dep. `T-268`; **[P]** con `T-276` |
| `T-276` | hilo principal | **La sala**: sólido, cielo, infierno, tesoro, las dos puertas, palanca, placa, compuerta y caja, dibujados como grilla | `src/arte/pixel/sala.txt`, `public/sprites/sala.v1.{png,json}`, `src/lib/skayboy/sala.test.ts` | Auditor en **0**; `node --test src/lib/skayboy/sala.test.ts`: cada `tipo` de `CTR-16.4` y `CTR-16.10` tiene su tile. Que cielo e infierno se distingan **por forma y no solo por tinta** (`UX-27 §5.2`) lo mira `revisor` en la hoja de contacto | dep. `T-264`, `T-268`; **[P]** con `T-275` |
| `T-277` | hilo principal | **Los cinco niveles**: `NIV-02`..`NIV-06` según `UX-31`, con el nombre de `CNT-21`, cada uno con sus dos trazas grabadas y en `borrador` | `src/data/skayboy.json` | `npm test` (`soluciones.test.ts` verde para los seis); `node scripts/resolver-niveles.mjs --todos`: tolerancia ≥ la de `BR-29` en cada escalón, escalones **2/2/2**, ningún mecanismo nuevo en el 3 y **paridad contada sobre las trazas con diferencia ≤ 1** | dep. `T-265`, `T-267`, `T-270`, `T-272` |
| `T-278` | hilo principal | **La isla dibuja**: los dos atlas, la sala, las compuertas y la caja. Se va la tinta plana de reemplazo | `src/scripts/partida-skayboy.ts`, `src/lib/skayboy/motor.test.ts` | `node --test src/lib/skayboy/motor.test.ts` (sigue en rojo si aparece texto, fuente o audio del motor); `npm run build`; **captura** en el navegador a 812×375 de un nivel Media con los dos muñecos, una compuerta y la caja | dep. `T-272`, `T-275`, `T-276` |
| `T-279` | hilo principal | **Los recitales entran al sitio** (`D-45`): se bajan por la vía de `RES-73`, se guardan enteros en `recitales.json` y el corte de Fáciles lee de ahí | `scripts/ingerir-recitales.mjs`, `src/data/recitales.json`, `src/data/_schema/recitales.schema.json`, `src/lib/recitales.ts`, `src/lib/tema/catalogo.ts`, `src/lib/escalonar.test.ts` | `npm test`: `esquemas.test.ts` valida `recitales.json`; `escalonar.test.ts` **cuenta 8 Fáciles en `US-02`**; rojo con un título fuera de los 105 (no suma y el test lo nombra). El total de recitales coincide con el de `RES-73` | dep. `T-273`, `T-274` |
| `T-281` | `investigador` | **Agregada el 2026-09-23 por la enmienda de `D-45`.** Las fuentes de setlists **cuya licencia deja guardarlos**: MusicBrainz (eventos con setlist), Wikipedia, sitios de fans que lo declaren. Por fuente: licencia textual, cuántos recitales con temas, y cómo se escriben los títulos contra los 105 | `Docs/INVESTIGACION/INV-76-setlists-abiertos.md` (`RES-76`+; lo pega el hilo principal) | Sin comando: licencia con URL y fecha por fuente, lo mira `revisor`. Lo cruzable —cuántos recitales trae cada fuente— **lo recuenta `T-279`** al construir el archivo | **[P]** |
| `T-280` | `revisor` | **El cierre**: las 19 tareas contra su criterio, el barrido de vocabulario retirado que dejó pendiente `T-252`, y los comandos | **No escribe**: `REV-15` lo pega el hilo principal (`FIND-66`) | `npm test`, `npm run check`, `npm run build`, el validador del instanciador; `rg` de `T-252` más `botón de cambio\|doble de grande`; las dos hojas de contacto; las tres entregas sin comando (`UX-31`, `CNT-21`, `RES-73`) | dep. todo |

### 2.1 Lo que tiene que saber quien arranque `T-266`

No es una receta —el formato lo fija `T-263`—, es lo que la medición de `§1` ya dice:

- **Jugadas gruesas, no cuadro por cuadro.** Cada jugada es una combinación de las tres
  teclas de **una** columna sostenida N cuadros (N chico: 4 a 8). Con 217.000 cuadros por
  segundo, una expansión cuesta microsegundos.
- **El estado se cuantiza para no repetir**: posición redondeada al píxel nativo, velocidad
  vertical en cubos, `enSuelo`, los tesoros juntados y el estado de cada compuerta. Dos
  estados iguales en ese sentido son el mismo nodo.
- **La traza de uno cambia de columna solo con los dos parados en el piso.** Es lo que hace
  la persona sola —suelta a uno donde está a salvo y agarra al otro— y achica el espacio de
  búsqueda en órdenes de magnitud. Y de paso **prueba `BR-25` (d) por construcción**: si el
  que espera se hubiera quedado en un lugar que lo devuelve, la traza no existiría.
- **La tolerancia es la vara de "nada de precisión fina".** Para cada salto de la traza, el
  solucionador corre la misma traza adelantando y atrasando ese salto de a un cuadro hasta
  que deja de ganar. El número de cuadros que aguanta es la tolerancia. `BR-29` dice cuánto
  pide cada escalón.
- **La duración mínima sale gratis**: la traza más corta de a uno, en segundos, es el piso de
  cuánto dura el nivel. Es la mitad medida de la pregunta que `INV-60` dejó *"sin resolver"*.
  La otra mitad —cuánto tarda una persona— es del teléfono.

### 2.2 Por qué `T-268` junta dos tareas del ciclo 15

`T-238` y `T-243` eran una fila cada una y ninguna se podía cerrar sin la otra: una paleta sin
auditor es una lista de deseos, y un auditor sin paleta no tiene contra qué comparar. Suma la
imprenta porque es la tercera pieza de la misma cadena —de un nombre de tinta a un píxel
impreso— y porque `T-275` y `T-276` no pueden ser paralelas si la imprenta la escribe la
primera que llegue.

**Ojo con una cosa que `T-264` y `T-276` tienen que respetar:** `UX-27 §4` reparte las 16
tintas en fijos, terreno, personajes y objetos, y **objetos son dos: la puerta y el
coleccionable**. Palanca, placa, compuerta y caja no tienen tinta propia y no pueden pedir la
17. Se dibujan con las del terreno y la clave, y se distinguen por forma (`UX-27 §5.2`).

### 2.3 Lo que cambió después de la ráfaga 1

**`D-45` se enmendó el 2026-09-23** (`RES-73`): los términos de setlist.fm solo dan licencia
para *ver* y prohíben los bots, y su API prohíbe guardar lo que devuelve. Tres filas cambian:

- **`T-273`** contrata **dos piezas**: el conteo por tema que publica la página de estadísticas
  de setlist.fm, citado con URL y fecha, y el archivo de recitales, armado solo desde fuentes
  cuya licencia lo permite. Una no se deriva de la otra. Pasa a depender también de `T-281`.
- **`T-279`** construye las dos, y **los 8 Fáciles salen del conteo citado**, no de contar
  setlists guardados. Ningún script baja páginas de setlist.fm.
- **`T-281`** es nueva: la búsqueda de esas fuentes abiertas.

`T-281` usa un número del margen que reservó `Docs/IDS.md`. Quedan libres `T-282`..`T-290`.

**Y `T-268` cambió dos números.** La paleta no fue a la hoja 03 sino a una **hoja 14 nueva** (la 13 ya la nombraba `tokens.css` para la imprenta)
("El pixel del fichín", versión 14 del lienzo), como se hizo con la 12 de movimiento: la 03 es
la paleta del sitio, y esta es la de adentro del mueble (`D-41`). Y son **15 tintas, no 16**:
`experiencia` le sacó la tinta a la puerta (`UX-27 §4.1.2`). Donde esta tabla dice "16", lee 15.

### 2.4 Lo que abre `D-46`, y entra a la ráfaga 3

El 2026-09-24 el usuario aprobó la paleta y los dibujos, y contestó la pregunta de `D-27`
más amplio de lo que se le preguntó: *"La dificultad de todo lo que sea con canciones sale
de ahí"* (`D-46`). Cuatro tareas nuevas, del margen de `Docs/IDS.md`:

| ID | Rol | Qué | Archivos | Verifica con | [P] |
|---|---|---|---|---|---|
| `T-282` | `investigador` | **El conteo completo.** Todos los temas que lista la página de estadísticas de setlist.fm, no solo los 25 primeros de `RES-74`, con URL y fecha. Números citados, vistos, no bajados con un bot (`RES-73.1`) | `Docs/INVESTIGACION/INV-89-conteo-completo.md` (`RES-89`+; lo pega el hilo principal) | Sin comando: cada número con su página. Lo cruzable —que los 25 primeros coincidan con `RES-74`— lo recuenta `T-285` | **[P]** |
| `T-283` | `producto` | **`BR-30`: qué juegos son "con canciones" y cómo usa cada uno la dificultad.** `US-02` y `US-07` seguro; `US-03`, `US-08` y las preguntas del quiz que son sobre temas, una por una. Qué pasa con los tercios de `D-27` cuando la medida es el conteo | `Docs/PRODUCTO/PRD-alcance-v1.md` (y los PRD de cada juego que cambie) | `rg -n "^## BR-30"`; una fila por juego del sitio, sin celdas vacías — lo mira `revisor` | **[P]** |
| `T-284` | `arquitectura` | **Los contratos que cambian con `D-46`**: el conteo completo en `CTR-19`, y cada banco que pasa de dificultad escrita a mano a inferida (`CTR-03`, `CTR-04`, `CTR-09`, `CTR-07` retirado de la dificultad) | `Docs/ARQ/ARQ-schema-recitales.md` y los `ARQ-schema-*` que toque | `rg` de cada `CTR` enmendado; los fragmentos de schema validan con `ajv` | dep. `T-283` |
| `T-285` | hilo principal | **La dificultad inferida del conteo, en cada juego con canciones**: `src/lib/popularidad.ts` (la regla de tercios de `D-27`, una sola vez) leyendo el conteo, y cada banco que `BR-30` nombre | `src/lib/popularidad.ts`, `src/lib/en-vivo.ts`, los bancos, sus tests | `npm test`: la dificultad de cada juego sale del conteo, un tema sin conteo es difícil, y ningún juego mezcla el conteo con las vistas (`CTR-07.7`) — cada regla vista en rojo | dep. `T-282`, `T-284` |

## 3. Pasada de conflictos

- **`src/data/skayboy.json` lo tocan `T-267` y `T-277`.** En fila: `T-267` le pone la traza a
  `NIV-01` y fija el formato; `T-277` suma cinco niveles con ese formato ya probado.
- **`skayboy.schema.json` lo tocan `T-267` y `T-272`.** En fila, y en ese orden: la traza
  primero porque los mecanismos tienen que entrar a un schema que ya sabe grabar soluciones.
- **`partida-skayboy.ts` y `motor.test.ts` los tocan `T-267` (el paso fijo) y `T-278` (el
  dibujo).** `T-278` depende de `T-272`, que depende de `T-267`: la fila ya está forzada.
- **`copy.ts` lo toca solo `T-271`** (la línea de vertical). Los nombres de `CNT-21` viven en
  el dato —el campo `nombre` de `CTR-16.5`— y los pone `T-277`. Una sola mano por archivo.
- **`ARQ-schema-niveles.md` lo toca solo `T-264`**; `T-263` escribe en un archivo nuevo. Por
  eso las dos de `arquitectura` son paralelas aunque sean del mismo rol.
- **`T-261` y `T-265` son de `experiencia` y paralelas**: dos archivos, y ninguna lee la
  salida de la otra.
- **`T-275` y `T-276` escriben tests distintos** (`atlas.test.ts`, `sala.test.ts`) a propósito:
  un archivo de test compartido las hacía secuenciales.
- **`T-269` → `T-273` → `T-279` y `T-269` → `T-274` → `T-279`.** El frente de los recitales es
  una sola cadena con dos ramas de papel en el medio, y no toca un archivo del frente del
  juego.
- **`T-266` es paralela a `T-263` aunque `T-267` dependa de las dos**: el solucionador busca
  sobre `mundo.ts`, que ya existe; lo que depende del formato es grabar la traza, y eso es
  `T-267`.

**Corte de ráfagas sugerido.**

1. **Ráfaga 1 — el papel y los cimientos, nueve en paralelo:** `T-261`, `T-262`, `T-263`,
   `T-264`, `T-265`, `T-269` (seis roles escribiendo a la vez, sin tocarse un archivo) y, en el
   hilo principal, `T-266` y `T-268`.
2. **Ráfaga 2 — el juego aprende:** `T-267`, `T-270`, `T-271`, `T-272`, `T-273`, `T-274`,
   `T-275`, `T-276`.
3. **Ráfaga 3 — los seis niveles, el dibujo y los recitales:** `T-277`, `T-278`, `T-279`.
4. **Cierre:** `T-280`, y después el teléfono (`§4` punto 3).

## 4. Lo que es tuyo y no lo puede hacer ningún rol

1. **Aprobar la paleta** en la hoja 03 del lienzo, antes de que `T-268` la baje a
   `tokens.css`. El circuito de `diseno-marca.md` manda que nazca ahí.
2. **Aprobar las dos hojas de contacto** (`T-275`, `T-276`). Es la condición de `D-44`: el que
   dibuja no se aprueba solo.
3. **La partida en el teléfono**, que era `T-249`: lo que `BR-29` le deje al pulgar —como
   mínimo la condición (a), dos personas a la vez, y afinar la gravedad y la velocidad—. Con
   eso `deDos` pasa a `true`, los niveles pasan a `listo` y producción los sirve. **Si al
   afinar se rompe una traza, el build lo dice** y `scripts/resolver-niveles.mjs` la regraba.
4. **Los temas enteros** (`D-39`), que sigue siendo lo que hace que el juego suene:
   `npm run generar-fragmentos -- "<carpeta de los discos>" --enteros`.
5. **Si `RES-73` dice que setlist.fm pide clave**, sacarla. Es gratis para uso sin fines de
   lucro, y es el único punto donde este frente puede volver a esperarte.

## 5. Qué NO entra al ciclo 16

- **El recorrido: la tarjeta (`BR-27`), el avance guardado (criterio 9) y cuánto cuesta el
  reloj** (el PENDIENTE de `producto` en `PRD-skayboy-y-poligirl.md`). Las tres hablan del
  juego entero, no de un nivel, y necesitan seis niveles y un dibujo que mostrar. Y la del
  reloj va primero, porque decide qué dice la tarjeta. Son el ciclo 17.
- **El noveno juego.** `IDEA-04`, el bondi a Finisterre, es el candidato natural y **la puerta
  de `BR-28` se abre recién cuando `T-279` cuente los 8 Fáciles** (`D-45` consecuencia 2), no
  al empezar. Conviene igual que espere: hereda el motor, el solucionador —un plataformas con
  meta es exactamente lo que busca— y la cadena del pixel, y construido después de este ciclo
  cuesta la mitad.
- **El sonido de los mecanismos.** `CTR-17` tiene tres efectos. Si `T-264` decide que una
  palanca tiene que sonar, es una enmienda de `CTR-17` en el ciclo 17.
- **Los recitales en pantalla.** Una página de recitales en la Redondopedia, o un juego de
  "qué se tocó en Huracán en el 93", son lo que `D-45` consecuencia 5 deja abierto sin
  cruzar. `IDEA-15` queda reservado en `Docs/IDS.md` para que `producto` lo guarde.
- **Las bandas de después de la separación en la Redondopedia.** Pedido del usuario que sigue
  esperando desde el 2026-08-21, con ficha (`INV-47`). No entra por el tope de filas de este
  plan, no por falta de lugar en el disco: **no toca un solo archivo de este ciclo**, así que
  es la mejor candidata para una sesión paralela con su rango reservado.
- **La deuda de `D-39`** con `dos-ejes`, que sigue anotada donde está.
- **Declarar cumplida `US-09`.** El ciclo cierra con seis niveles probados a máquina y en
  `borrador`. Pasan a `listo` con el punto 3 de `§4`, y no antes.

## 6. Los riesgos del ciclo

**El riesgo número uno: que la máquina pruebe algo distinto de lo que se juega.** Tres formas
de que pase, y cada una tiene su guarda en una tarea:

1. **La física de la prueba no es la del teléfono** (`§1`: la isla corre a paso variable). Si
   no se cierra, una traza ganadora es una afirmación sobre otro juego. Lo cierra `T-263`
   decidiendo el paso fijo y `T-267` aplicándolo en la isla.
2. **La traza gana con un salto al cuadro exacto** que ningún pulgar da. Es un nivel resoluble
   que igual es un muro. Lo cierra la tolerancia: `T-266` la mide, `T-262` la exige por
   escalón y `T-277` no deja entrar un nivel que no la cumple.
3. **La máquina encuentra un atajo que el diseño no pensó** —un salto por encima de una
   compuerta, una caja usada de escalón—. No es un defecto de la máquina: es un defecto del
   nivel que sin ella nadie veía hasta la partida número cuarenta. Por eso el que diseña los
   niveles es el que tiene el solucionador en la mano (`T-277`), y no otro rol a ciegas.

**Los otros cuatro, en orden:**

- **El solucionador no converge en un nivel.** Con jugadas gruesas y cambio de columna solo
  en el piso no debería, y si pasa es una señal y no un fracaso: un nivel con tanto espacio de
  estados pide precisión o esconde el camino, y el que se corrige es el nivel.
- **El dibujo de dos personas vivas.** `D-38` y `D-42` rigen igual para el que dibuja, y la
  hoja de contacto es el único punto donde eso se mira antes de que entre. Si no convence, la
  isla sigue en tinta plana y no se rompe nada.
- **setlist.fm puede no alcanzar.** Los recitales de los ochenta casi seguro están poco
  cargados, así que el top va a tirar hacia el repertorio de los noventa. No es mentira si el
  rótulo dice lo que mide; sí lo sería si dijera "los más conocidos". Y si la cobertura no
  alcanza para ordenar ocho sin que decida el azar, `D-45` vuelve al usuario.
- **El hilo principal es el cuello de botella.** Doce de las veinte tareas son suyas. Por eso
  la ráfaga 1 le da a los seis roles algo para hacer en paralelo, y por eso las del hilo
  principal están cortadas para que la mitad no dependa de ningún papel (`T-266`, `T-268`).

## 7. Lo que este plan no toca

**`ESTADO.md`** lo actualiza el hilo principal al cerrar esta planificación y otra vez al
cerrar cada ráfaga. **`Docs/DECISIONES.md`**, `Docs/EQUIPO.md` y `Docs/IDS.md` ya se tocaron al
abrir: `D-44`, `D-45`, la sección del pixel en `EQUIPO.md` y la reserva del rango.

**El próximo paso:** la ráfaga 1. Seis roles en paralelo más `T-266` y `T-268` en el hilo
principal — y, antes de `T-268`, que apruebes la paleta en el lienzo.
