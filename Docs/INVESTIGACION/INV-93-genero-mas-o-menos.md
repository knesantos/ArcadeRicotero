# INV-93 — El género "más o menos"/"mayor o menor" con números: cómo lo resuelven los que ya lo hicieron

> Pedido del hilo principal, ráfaga "Más o menos" (`IDEA-11` promovida a `US-10`, `D-48`,
> 2026-09-25). El usuario amplió el pedido el mismo día: preguntas de número de **toda
> naturaleza** sobre la banda —años, integrantes, duración, veces tocado en vivo, palabras
> en una letra—, no solo el conteo de palabras que la primera versión de `D-48` resolvía
> para el cancionero. Esta ficha investiga el género para informar esa extensión: no decide
> nada, `arquitectura` y `producto` deciden con esto en la mano.
>
> **Consume:** `D-48` (la mecánica ya construida para "en cuántos temas aparece la
> palabra": cadena, una sola categoría, una sola unidad, racha, sin empates en pantalla,
> distancia que se achica), `src/lib/mas-o-menos/conteo.ts`,
> `Docs/SUGERENCIAS/HILO-para-contenido-mas-o-menos-las-palabras.md`.
>
> **Numeración de este archivo:** `RES-93` a `RES-98`, el rango que `Docs/IDS.md` reserva
> para esta ráfaga. No usé ningún número fuera de ese rango.
>
> Fecha de consulta de todo lo que sigue: **2026-09-25**.
>
> **Escrita por `investigador`; pegada por el hilo principal**, porque el rol es de solo
> lectura y no tiene con qué escribir en su propia carpeta.

---

## RES-93 — The Higher Lower Game: la mecánica exacta de la familia que le da nombre al género

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-93.1` | Se muestran **dos cartas/ítems lado a lado**. El de la izquierda ya trae su número visible (el "ancla"); el de la derecha está oculto y hay que decidir si su valor es mayor o menor. Un solo tap por ronda: `Higher` o `Lower` | https://www.higherorlowergame.com/how-to-play · https://playhigherlower.com/how-to-play | verificado, dos fuentes independientes coinciden |
| `RES-93.2` | **Encadena por diseño: el ítem recién revelado pasa a ser el nuevo ancla** de la próxima comparación. El texto lo dice explícito: tras acertar, "el juego continúa con una nueva comparación" y el contador de racha sube — la comparación siguiente usa el valor que se acaba de destapar, no vuelve a un ancla fija | https://playhigherlower.com/how-to-play | verificado |
| `RES-93.3` | **Puntaje = largo de la racha, sin bonos ni multiplicadores.** Cada acierto suma 1. Vara de referencia que da el propio sitio: 5-10 es normal, 15+ por encima del promedio, 30+ "excelente" | https://www.higherorlowergame.com/how-to-play | verificado |
| `RES-93.4` | **Termina en el primer error, siempre.** No hay vidas ni margen: "si adivinás mal, se termina el juego". No hay presión de tiempo — el reloj no corre, solo la decisión importa | https://www.higherlowergame.com/how-to-play | verificado |
| `RES-93.5` | **Empates: no hay una convención única en el género.** Encontré cuatro reglas distintas según la variante: empate = pierde el jugador (la más citada como "regla casual"), empate = "push" (se redescarta sin penalidad, la racha sigue), empate = gana el jugador (convención de casino), y "depende de lo que acuerden antes de jugar" en variantes de mesa/drinking-game. **No hay una fuente única y autorizada del sitio original que fije la regla** — es el punto más disperso de todo lo investigado | (síntesis de varias fuentes de reglas de variantes, ninguna es la fuente primaria del sitio) | **débil — sin fuente primaria unívoca, tratar como zona gris del género, no como dato firme** |
| `RES-93.6` | **Autoría del sitio original, sin poder confirmar el nombre que trajo el pedido.** No encontré ninguna fuente que vincule a "Ben Hutchins" con higherlowergame.com. Lo que sí aparece, y de fuentes que se contradicen entre sí: la página "Sobre nosotros" de la versión vigente (`higherorlowergame.com`, reformada de "STATTOGORIES" en 2024) se atribuye a un tal Gareth Evans desde 2015; y por separado, una nota de la prensa de marketing (*The Drum*) atribuye una versión de app con más de 500 millones de partidas a un estudio de Manchester, Code Computerlove, hacia 2016-2017. Son dos linajes distintos del mismo concepto (comparar métricas con Higher/Lower), no necesariamente la misma autoría | https://www.higherorlowergame.com/about-us · https://www.thedrum.com/news/2017/03/16/code-computerlove-s-higher-lower-game-hits-more-half-billion-plays-it-adds-amazon | **no verificado — dos atribuciones que no se reconcilian, y ninguna es "Ben Hutchins"** |

---

## RES-94 — Los derivados: categorías separadas (nunca mezclan unidad dentro de una racha), y el conteo animado

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-94.1` | **Los derivados existen como "modos" separados, no como una racha que salta de categoría.** `higherorlowergame.com` lista más de 100 modos (películas por rating, Google Trends por volumen, streams de música, población por país, estadísticas deportivas); `moreorless.io` lista 60+ (tamaño de país, seguidores de Instagram, oyentes mensuales de Spotify, valor de mercado de jugadores de fútbol, salarios de la NBA, peso de animales, altura de montañas). **En ningún caso encontrado la racha mezcla unidades**: mientras jugás, el ítem A y el ítem B siempre comparten la misma unidad (siempre dólares, siempre oyentes, siempre habitantes) — lo que cambia de modo a modo es la categoría entera, no dentro de una partida | https://www.higherorlowergame.com/ · https://moreorless.io/games · https://www.higherorlowergame.com/spotify/monthly-listeners/ · https://www.higherorlowergame.com/football/market-value/ | verificado por inspección de los listados de modos; no encontré ningún modo "mixto" que alterne unidades dentro de la misma racha |
| `RES-94.2` | Existe **leaderboard** (tabla de mejores puntajes) al menos para el modo Spotify de `higherorlowergame.com` — confirma que el género sostiene comparación social además de la racha personal, aunque no encontré detalle de si se comparte por enlace/imagen o solo queda adentro del sitio | https://www.higherorlowergame.com/spotify/monthly-listeners/leaderboard | verificado que la página existe; sin detalle del mecanismo de compartir |
| `RES-94.3` | **El "conteo que sube" al revelar es un patrón de implementación genérico de la web** (la técnica se llama "odometer effect": cada dígito rueda como el cuentakilómetros de un auto, con librerías estándar como `CountUp.js` u `Odometer.js`), no una decisión de diseño documentada específicamente para el género higher/lower. No encontré ninguna fuente de diseño (posts de autores, análisis) que explique **por qué** eligieron esa animación en particular para el suspenso — es una técnica genérica de "número que crece" que estos sitios adoptan, igual que la adoptan dashboards y páginas de estadísticas que no tienen nada que ver con juegos | https://frontendmasters.com/blog/the-odometer-effect-in-css/ · https://www.cssscript.com/customizable-count-updown-animations-pure-javascript-countup-js/ | verificado como técnica, **no verificado como decisión de diseño razonada** — es una suposición a partir de que existe la librería, no un hallazgo con fuente que discuta el efecto |

---

## RES-95 — Los formatos de TV: la encuesta-con-número-de-referencia es el precedente real de "mayor o menor sobre un número dado"

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-95.1` | **Card Sharks (EE.UU.) tiene dos mecánicas distintas cosidas juntas, y las dos importan acá.** La mitad de "cartas" es orden relativo (as alto, dos bajo: "¿la próxima es más alta o más baja?", cuatro aciertos ganan la ronda). Pero **antes** de tocar las cartas hay una mitad de **encuesta**: se le pregunta algo a 100 personas, un jugador **tira un número** como respuesta, y el otro jugador adivina si el número real es **mayor o menor que ese número tirado** — quien acierta juega primero. Esta segunda mitad es "más o menos sobre un número de referencia" con **cualquier pregunta que tenga respuesta numérica**, sin que importe la unidad | https://tropedia.fandom.com/wiki/Card_Sharks · https://tvtropes.org/pmwiki/pmwiki.php/Series/CardSharks | verificado, dos fuentes coinciden |
| `RES-95.2` | **Play Your Cards Right (Reino Unido, la versión de Bruce Forsyth) usa la misma estructura de encuesta.** Ejemplo textual citado: *"le preguntamos a 100 [tal grupo]: ¿cuántas dijeron que sí?"* — una pareja tira un número, la otra dice si el real es mayor o menor, y quien acierta controla el tablero de cartas siguiente | https://retro-hen.com/2016/03/05/higher-lower/ · https://www.ukgameshows.com/ukgs/Play_Your_Cards_Right | verificado |
| `RES-95.3` | **No encontré ningún formato argentino o hispano verificable llamado "¿Más o menos?" o "Mayor o menor" con esta mecánica de encuesta.** Busqué directamente y no apareció ningún programa de TV argentino con ese nombre y esa estructura — lo que sí existe y es real es **"100 argentinos dicen"**, pero es el formato *Family Feud* puro (adivinar qué respondió la mayoría de una encuesta a 100 personas), **sin el paso de "mayor o menor que un número tirado"**. Son primos, no el mismo juego: la pregunta es "¿qué dijeron?", no "¿es más o menos que X?" | (búsqueda sin resultado positivo) · https://prezi.com/p/v8vbjzmvzovv/100-argentinos-dicen/ | **"Mayor o menor" argentino: no encontrado, no verificado.** "100 argentinos dicen": verificado como formato distinto |

**Por qué importa para el punto 4 del pedido:** esta es la fuente real, con historial de décadas en TV, del diseño **(b)** que planteaba el pedido — "sobre/bajo un número de referencia, cualquier pregunta con respuesta numérica". No es una intuición sin precedente: es literalmente la mitad de la mecánica de dos formatos de juego de mesa/TV que llevan corriendo desde 1978 (EE.UU.) y 1979 (Reino Unido), con revivals recientes.

---

## RES-96 — Wits & Wagers: el precedente real de "números de naturalezas distintas en la misma partida, sin encadenar"

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-96.1` | **Cada pregunta es independiente, no encadena con la anterior.** Todos los jugadores responden la misma pregunta numérica (puede ser cualquier cosa: años, alturas, cantidades — no hay restricción de unidad de una pregunta a la siguiente porque nunca se comparan dos preguntas entre sí, cada una se resuelve sola) | https://en.wikipedia.org/wiki/Wits_and_Wagers · https://www.ultraboardgames.com/wits-and-wagers/game-rules.php | verificado |
| `RES-96.2` | **Gana el número más cercano al real sin pasarse** ("reglas *Precio Justo*"). Ejemplo citado textual: si la respuesta real es 14, "12" gana sobre "15" (que se pasó) | https://no-rolls-barred.fandom.com/wiki/Wits_%26_Wagers_(game) · https://officialgamerules.org/game-rules/wits-and-wagers/ | verificado |
| `RES-96.3` | Después de que cada jugador escribe su número, se **apuesta** sobre cuál de todos los números escritos (propio o ajeno) va a ganar — hay una capa social de apuesta encima de la estimación individual, no solo acertar | https://www.boardgamehalv.com/how-to-play-wits-and-wagers/ | verificado |

**Por qué importa:** es el mejor ejemplo real de un juego de trivia numérica que **no necesita que las preguntas compartan unidad** entre sí, porque nunca las enfrenta una contra otra — cada pregunta se juzga contra su propia respuesta real, con tolerancia ("el más cerca sin pasarse"), no contra otra pregunta.

---

## RES-97 — Timeline y Wikitrivia: encadenan, pero solo porque la unidad siempre es "año" aunque el tema cambie

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-97.1` | **Timeline (juego de mesa):** cada carta trae un evento/invento distinto (un tema completamente distinto al de la carta anterior) pero **la unidad que se compara siempre es el año**. Se coloca una carta en la fila según dónde creés que va cronológicamente y recién ahí se revela la fecha impresa; si quedó mal ubicada, se descarta y se saca otra | https://boardgamegeek.com/boardgame/128664/timeline | verificado |
| `RES-97.2` | **Wikitrivia (versión digital del mismo concepto):** arrastrás una tarjeta a su lugar en una línea de tiempo ya construida; **el margen de error se va achicando a medida que se llenan los huecos** ("las suposiciones generales alcanzan al principio, después los huecos se estrechan"). Tres vidas, se acaba el juego al perder la tercera | https://www.vice.com/en/article/i-cant-stop-playing-this-wikipedia-history-game/ · https://en.wikipedia.org/wiki/Wikitrivia | verificado |

**Por qué importa:** esto confirma que la opción **(d)** del pedido (ordenar en una línea cuando la unidad es el año) es real y funciona — pero funciona **porque la unidad nunca cambia** (siempre año), aunque el contenido de cada tarjeta sea de un tema distinto. No es lo mismo que mezclar años contra cantidad-de-integrantes en la misma línea.

---

## RES-98 — La familia Wordle-numérica: revelan sin animación de suspenso, y la familia de "estimar con tolerancia" (Estimathon)

| # | Hallazgo | URL | Estado |
|---|---|---|---|
| `RES-98.1` | **Costcodle:** adivinás el precio de un producto de Costco en 6 intentos; cada intento da una **flecha** (más caro / más barato) y un aviso si estás muy cerca (5% de margen = ganás). **No hay conteo animado**: el feedback es instantáneo, una flecha o un color, y el suspenso lo arma la escasez de intentos (6), no el movimiento en pantalla | https://www.dailydle.org/games/costcodle · https://github.com/KermWasTaken/costcodle | verificado |
| `RES-98.2` | **Yeardle / Jaardle (adivinar el año de un hecho histórico):** arrancás con pistas parciales, tenés varios intentos, feedback de más-antiguo/más-reciente por intento — misma estructura que Costcodle pero con años en vez de precios. Tampoco hay animación de conteo: la revelación es por intentos sucesivos con feedback estático | https://jaardle.com/ · https://histordle.com/yeardle/ | verificado |
| `RES-98.3` | **Estimathon (competencia de estimación, no un juego casual pero es el extremo más riguroso del género):** cada pregunta puede ser de **cualquier magnitud u orden** (no hay restricción de unidad entre preguntas), la respuesta no es un número exacto sino un **intervalo**, y el puntaje castiga el error doblando la penalización por cada pregunta mal cubierta o en blanco — gana quien tiene el puntaje más bajo | https://estimathon.com/how-to-play | verificado |

**Respuesta directa al punto 7 del pedido:** el género **se divide en dos familias** respecto al reveal. La familia "Higher/Lower Game" (cadena de a pares) sí suele usar un conteo animado tipo odómetro — pero es una técnica genérica de web, no algo que encontré razonado como decisión de diseño (ver `RES-94.3`). La familia "Wordle diario con números" (Costcodle, Yeardle, Jaardle) **revela de golpe, sin animación de movimiento**, y arma el suspenso con la escasez de intentos y el feedback de dirección (flecha/color), no con el número subiendo. Esta segunda familia es compatible sin fricción con la regla de "solo se mueve la mosca" de `diseno-marca.md`.

---

## Qué significa para Más o menos

Tres diseños posibles, bien distintos entre sí. Ninguno lo decido yo — dejo ventajas, riesgos y una recomendación con el porqué.

### Diseño A — Cadena con ancla, una sola categoría por partida (el Higher/Lower Game clásico)

Se elige una categoría al empezar la partida (por ejemplo "años de show en vivo" o, como construyó la primera versión de `D-48`, "en cuántos temas aparece la palabra") y se encadena: el valor recién revelado es el ancla del próximo par, la racha sube con cada acierto, termina en el primer error. Misma unidad todo el rato, sin empates en pantalla, distancia que se achica con la racha.

- **A favor:** un solo tap por ronda, motor ya construido y probado para el caso de palabras, altísimo ajuste a partidas de 2-3 minutos, patrón reconocible (todo el mundo que jugó un Higher/Lower entiende esto sin instrucciones).
- **En contra:** para cumplir el pedido ampliado del usuario ("años, integrantes, duración, veces tocado, todo junto") esto obliga a **una categoría por partida**, no una mezcla dentro de la misma racha. Si el catálogo de una categoría tiene pocos ítems, la cadena se corta rápido por falta de material, no por error del jugador.

### Diseño B — Sobre/bajo un número de referencia, pregunta por pregunta (Card Sharks / Play Your Cards Right)

Cada pregunta es independiente: se plantea un enunciado con un número de referencia ("¿Los Redondos tocaron en vivo Jijiji más o menos de 90 veces?") y el jugador responde mayor o menor que ese número. No hay cadena ni ancla que viaje de una pregunta a la siguiente, así que **cada pregunta puede ser de una naturaleza de número totalmente distinta** de la anterior sin que eso rompa nada — es el diseño que mejor resuelve el pedido textual de mezclar años, integrantes, duraciones y conteos en la misma partida.

- **A favor:** es el único de los tres que cumple sin parches "números de naturalezas distintas" (confirmado con precedente real de décadas, `RES-95`). No necesita un dataset grande por categoría — alcanza con una pregunta bien armada por hito. Reveal sin animación de movimiento (mostrar el número real y un ✔/✕, como ya hace el quiz del sitio) — cero fricción con `diseno-marca.md`.
- **En contra:** el peso de la dificultad recae en elegir un número de referencia lo bastante cerca del real para que no sea obvio (si el año de referencia es "1970" y la respuesta es de los ochenta, no hay gracia). También pierde el gancho de "cadena que sube" si el puntaje pasa a ser aciertos sobre N preguntas.

### Diseño C — Estimar con tolerancia, sin binario (Wits & Wagers / Estimathon)

En vez de mayor/menor, el jugador elige (o desliza) un número entre varias opciones y gana si cae más cerca del real sin pasarse, o dentro de un margen. Funciona con cualquier magnitud sin restricción de unidad entre preguntas, igual que el Diseño B.

- **A favor:** más rico que un binario, deja mostrar "qué tan cerca estuviste" como feedback (más generoso con el que casi la sabe — coherente con "nunca un muro").
- **En contra:** exige más interacción que un tap, más carga cognitiva y más tiempo por pregunta — choca de frente con "partidas de dos o tres minutos, sesión corta en el celular". Es el diseño del género que peor calza con el resto del sitio.

### Recomendación

**Diseño B.** Es el único que resuelve el pedido tal como lo dijo el usuario —números de naturalezas bien distintas en la misma partida— sin forzar el género a hacer algo que ningún ejemplo real hace (mezclar unidades dentro de una cadena, `RES-94.1`). Tiene precedente real de décadas (`RES-95`), no exige un dataset grande por categoría, y su reveal instantáneo con ✔/✕ es gratis en términos de `diseno-marca.md`.

**Ojo con la tensión con la primera versión de `D-48`:** la mecánica construida para "en cuántos temas aparece la palabra" es el Diseño A. Si se va al Diseño B, **no se descarta ese trabajo**: "palabras" puede quedar como una categoría más dentro de una partida de Diseño B ("¿la palabra *perro* aparece en más o menos de 5 temas?"). Esa reconciliación es de `arquitectura` y `producto`.

## Sin resolver

- **Empates en el Higher Lower Game original:** no hay una regla única documentada por una fuente primaria (`RES-93.5`).
- **Autoría de higherlowergame.com:** "Ben Hutchins" no se pudo verificar; las dos atribuciones encontradas no se reconcilian (`RES-93.6`). No bloquea nada de diseño.
- **"Mayor o menor" como programa de TV argentino:** no encontrado (`RES-95.3`). Si `contenido` quiere citarlo como referencia cultural local, no hay con qué respaldarlo.
- **Por qué el Higher Lower Game usa conteo animado:** sin fuente de diseño (`RES-94.3`). Lo que sí tiene fuente es que la familia Wordle-numérica prescinde de esa animación (`RES-98`).
- **Cómo se comparte en el género:** solo se confirmó un leaderboard (`RES-94.2`).
