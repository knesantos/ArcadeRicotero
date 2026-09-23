# INV-60 — Skayboy y Poligirl: el juego original, el motor, las dos personas reales y el teléfono

> Pedido del usuario, 2026-09-11, textual: *"Agrega a ideas y comencemos a desarrollar un
> juego que sea como un fireboy y watergirl que se llame skayboy y poligirl. Comenza la
> investigacion para construir el juego."* Skay Beilinson es el guitarrista de la banda;
> "la Negra Poli" (Carmen Castro) fue la mánager histórica.
>
> **Responde:** si la mecánica se puede clonar, qué mecánica es exactamente, qué motor
> libre se adopta y bajo qué licencia, qué hay ya hecho y libre, qué pasa con usar el
> nombre y la figura de dos personas reales vivas, y cómo se juega de a dos en un solo
> teléfono. Es el relevamiento previo que `BR-15` consecuencia 1 manda hacer **antes** y
> no después.
>
> **Consume:** `BR-15`, `BR-16` (`PRD-backlog-ideas.md`), `D-14`, `D-17`, `D-18`, `D-19`,
> `D-32`, `D-33`, `D-35`, `D-37`, `ADR-07` + `CTR-14` (`ARQ-rocola.md`), `RES-04`,
> `RES-09` (`INV-02`), `RES-20` (`INV-20`), `RES-37`, `RES-50` (`INV-24`), `UX-04`,
> `UX-07`, `UX-20`, `UX-22`.
>
> **Numeración:** `RES-60` … `RES-65`, el rango reservado para esta sesión en
> `Docs/IDS.md` (fila del 2026-09-11, junto con `IDEA-14`). Los sub-hallazgos van
> `RES-60.1`, `RES-60.2`, y así.
>
> **Aviso de método.** Se relevaron nueve frentes y **cada uno pasó después por una ronda
> de refutación adversarial** — cuatro de ellos por dos rondas, con refutadores
> independientes que fueron a la fuente primaria a voltear lo que la ficha original
> afirmaba. Lo que se cayó está abajo con el estado corregido y contando qué lo volteó;
> eso es lo que hace útil este archivo. Tres cosas cambiaron de signo hacia arriba (la
> marca de EE.UU. se pudo resolver, la licencia de Planck.js se cerró, apareció el
> precedente de facto que la primera ronda no encontró) y dos hacia abajo (la
> co-titularidad de Erks S.A. baja de verificado a reportado, y el cálculo que cerraba la
> puerta al control simultáneo solo vale en vertical).
>
> **Seis frentes son hechos externos y son fichas `RES-`. Tres no lo son:** el ancla
> ricotera, los choques contra las reglas del repo y el costo de construir la pieza son
> **mediciones sobre este repositorio**, y van al final, en tres secciones sin número
> `RES-`, porque una ficha `RES-` es un hecho externo con fuente y URL, y eso no lo es.

---

## RES-60 — El juego original y el estado legal de clonar la mecánica

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-60.1` | *Fireboy & Watergirl* lo creó **Oslo Albet**, desarrollador indie, no un estudio. Primera entrega, *Forest Temple*, **19-nov-2009**, en Flash, migrada después a HTML5. Siete entregas. Hay ports oficiales a iOS, Android y Steam — no es solo un juego web | https://en.wikipedia.org/wiki/Fireboy_and_Watergirl · https://play.google.com/store/apps/details?id=com.osloalbet.fb | 2026-09-11 | verificado; reforzado en refutación: los paquetes `com.osloalbet.fb` y `com.osloalbet.fairytales` están publicados bajo la cuenta de desarrollador Oslo Albet |
| `RES-60.2` | **"FIREBOY AND WATERGIRL" es marca registrada viva en EE.UU.**: USPTO Reg. 5972596, serie 88515026, clase 009, registrada **2020-01-28**, estado LIVE/REGISTRATION, con Section 8 aceptada el **2026-06-01**. El titular es **"Yucel, Metin"**, individuo de Ankara, Turquía — **no** Oslo Albet | https://tsdr.uspto.gov/statusview/sn88515026 · https://trademarks.justia.com/885/15/fireboy-and-88515026.html | 2026-09-11 | **verificado** — la ficha original lo dejó "sin resolver, riesgo alto" porque Justia devolvía 403; la refutación fue a TSDR y lo cerró |
| `RES-60.3` | Contexto de `60.2`: el mismo Metin Yucel publica su propia app *Fireboy and Watergirl: Online* (`com.myappz.firegirlWaterboy`, 10M+ descargas), con un ID de paquete ajeno a la línea oficial de Oslo Albet. El nombre circula usado por apps no oficiales sin litigio conocido | https://apps.apple.com/il/developer/metin-yucel | 2026-09-11 | reportado — dato de contexto, no de blindaje |
| `RES-60.4` | **Tetris Holding v. Xio Interactive** (D.N.J., 2012): la corte separó lo no protegible (la mecánica y las reglas: bloques que caen, rotación, game over por acumulación) de lo protegible (la expresión audiovisual concreta: tablero 20×10, sombra de caída, vista de la próxima pieza, colores, el tablero lleno al perder). Xio perdió porque copió también esa expresión, casi literal | https://en.wikipedia.org/wiki/Tetris_Holding,_LLC_v._Xio_Interactive,_Inc. | 2026-09-11 | verificado en cinco fuentes independientes más. **Dos matices que la ficha original no marcaba:** es sentencia de distrito, no vinculante fuera de esa jurisdicción, y es la **única** de las cuatro causas relevadas acá que falló a favor del titular original |
| `RES-60.5` | **Spry Fox v. LOLApps/6Waves** (W.D. Wash., 2012): el clon cambió nombre y tema visual (osos → yetis) pero mantuvo casi idéntica la jerarquía de progresión, y la corte dejó avanzar la demanda por el *look and feel* combinado. Terminó en acuerdo: **no hay sentencia de fondo**. Vale como advertencia, no como regla | https://en.wikipedia.org/wiki/Spry_Fox,_LLC_v._Lolapps,_Inc. | 2026-09-11 | verificado |
| `RES-60.6` | **Tres causas donde ganó el clon**, cada una verificada por separado contra fuente propia: *Atari v. Amusement World* (1982, Asteroids vs. Meteors), *Data East v. Epyx* (1988 — Data East ganó en primera instancia y el 9º Circuito revocó: ganó el clon en apelación), *Capcom v. Data East* (1994, por merger y *scènes à faire*). Las mecánicas de género no son protegibles por sí solas | Justia, Wikipedia y Quimbee, caso por caso | 2026-09-11 | **verificado** — la ficha original lo tenía "reportado" apoyado en una sola nota secundaria; la refutación lo subió verificando los tres |
| `RES-60.7` | **Ley 11.723, art. 1, texto vigente** (párrafo incorporado por la Ley 25.036, 1998): *"La protección del derecho de autor abarcará la expresión de ideas, procedimientos, métodos de operación y conceptos matemáticos pero no esas ideas, procedimientos, métodos y conceptos en sí."* | https://www.argentina.gob.ar/normativa/nacional/42755/actualizacion | 2026-09-11 | **verificado** — la ficha original decía que era "el mismo principio aplicado por analogía"; es texto positivo argentino desde 1998, no analogía |
| `RES-60.8` | **Precedente de facto, el que la primera ronda buscó y no encontró:** *Fire and Water* (silvergames.com) y *Fire and Water Unblocked* replican la mecánica central exacta —dos personajes elementales, control dual simultáneo, uno esquiva fuego y el otro agua— bajo nombre propio, y están online hace años sin incidente legal documentado. El segundo se describe a sí mismo como inspirado en "los conocidos juegos flash Fireboy and Watergirl" | silvergames.com · lolschool.freetls.fastly.net | 2026-09-11 | reportado — riesgo bajo. **Volteó el "sin fuente" de la ficha original hacia arriba:** no es vacío neutro, es evidencia positiva de tolerancia del género |
| `RES-60.9` | *Ridiculous Fishing* (Vlambeer) vs. *Ninja Fishing* (Gamenauts, 2013): clon casi idéntico de la mecánica con nombre y arte propios. Hubo escándalo público y negociación directa, **nunca demanda**, y la razón documentada es explícita: *"game mechanics were not eligible for copyright protection"*. Otro género, pero es el caso más cercano de "mecánica clonada, nombre y arte distintos, sin litigio" | https://www.gamedeveloper.com/business/fishing-the-ios-clone-market-and-patent-copyright · https://en.wikipedia.org/wiki/Ridiculous_Fishing | 2026-09-11 | reportado |
| `RES-60.10` | No se encontró **ningún** reclamo, DMCA o demanda pública contra un clon rebautizado de *Fireboy & Watergirl*. Lo que abunda es una red de portales espejo (fireboynwatergirl.com, fireboy-and-watergirl.io, dualplayergames.com, gamaverse.com) que alojan **el juego original con el mismo nombre** — eso es distribución, no clon. Esos sitios tienen sus propias páginas de DMCA | — | 2026-09-11 | **sin fuente** — ausencia de evidencia, matizada por `60.8` y `60.9`, que le ponen dos ejemplos concretos y longevos a favor |
| `RES-60.11` | Convenio de Berna: el copyright de EE.UU. sobre el arte y el código de *Fireboy & Watergirl* rige en Argentina igual, no haya o no jurisprudencia local. El vacío de jurisprudencia argentina no es vacío legal | — | — | criterio propio |

**Lectura para el proyecto, que es criterio propio y no hallazgo.** La mecánica —dos
personajes controlados a la vez, cada uno inmune a un elemento y muerto por el otro,
cooperando para llegar a una salida— es una regla de juego, y toda la doctrina relevada,
de 1982 a 2012, coincide en que eso no es lo que protege el copyright. Lo protegible, sin
excepción en ningún caso, es la expresión concreta: el nombre, los sprites, la paleta, el
layout literal de cada nivel, el código. El nombre ya está resuelto: "Skayboy y Poligirl"
no tiene superposición fonética ni visual con la marca de `RES-60.2`, y el test de marca
es de confusión de nombre, no de parecido de mecánica — así que el riesgo de esa marca
sobre **este** proyecto es bajo, aunque la marca esté viva y activa. La distancia de arte
que la doctrina pide la construye `D-19` casi sin buscarla: no es un recoloreado, es otro
sistema visual con otra fuente. Lo que queda en pie sin fisuras es la advertencia de
`RES-60.4` y `RES-60.5`: no clonar el layout concreto de los "temples" oficiales ni la
expresión visual, porque ahí, y solo ahí, un caso falló distinto. Y no escribir la cadena
"Fireboy and Watergirl" en ningún lado: ni en texto visible, ni en metadata, ni en
comentarios del código.

---

## RES-61 — Inventario de mecánicas y elementos del original

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-61.1` | Fireboy es inmune a la lava y muere en el agua; Watergirl al revés; el charco verde mata a los dos por igual | https://jayisgames.com/review/fireboy-and-watergirl-the-forest-temple.php · https://official-fireboy-watergirl.fandom.com/wiki/Fireboy_%26_Watergirl_III_in_The_Forest_Temple_Again | 2026-09-11 | verificado, corroborado además por una fuente ajena a las de la ficha original |
| `RES-61.2` | **Condición de victoria, y es el corazón del juego:** los dos personajes tienen que estar parados en su puerta de salida **al mismo tiempo**. No alcanza con que cada uno llegue por separado. Cita de la fuente: *"Fireboy must stand… and Watergirl must stand… at the exact same time"* | https://jayisgames.com/review/fireboy-and-watergirl-the-forest-temple.php · https://en.wikipedia.org/wiki/Fireboy_and_Watergirl | 2026-09-11 | verificado, dos fuentes independientes adicionales |
| `RES-61.3` | Cada personaje tiene su propia puerta de salida, marcada con su color y su símbolo | https://jayisgames.com/review/fireboy-and-watergirl-4-in-the-crystal-temple.php | 2026-09-11 | verificado |
| `RES-61.4` | El puzzle base son palancas y botones o placas de presión: uno los activa para abrirle paso al otro (plataforma, puerta, trampa) | https://jayisgames.com/review/fireboy-and-watergirl-the-forest-temple.php · https://www.coolmathgames.com/blog/fireboy-and-watergirl-differences-from-game-to-game | 2026-09-11 | verificado |
| `RES-61.5` | Cajas empujables que sirven de escalón o de tapón de trampa; en *Crystal Temple* algunas pasan por los portales | https://jayisgames.com/review/fireboy-and-watergirl-4-in-the-crystal-temple.php · https://omnigames.blog/fireboy-and-watergirl-1-2-3-4-5-6 | 2026-09-11 | verificado |
| `RES-61.6` | Plataformas móviles y ascensores activados por palanca o botón | https://omnigames.blog/fireboy-and-watergirl-1-2-3-4-5-6 | 2026-09-11 | reportado |
| `RES-61.7` | Diamantes rojos (solo Fireboy) y azules (solo Watergirl), coleccionable opcional por nivel; en los niveles de diamante aparece uno verde o blanco, más grande, que levanta cualquiera de los dos | flashgaming.fandom.com · official-fireboy-watergirl.fandom.com, vía búsqueda | 2026-09-11 | verificado — el término "green/white diamond" aparece literal en fuente independiente, ya no depende de la wiki que devolvía 402 |
| `RES-61.8` | **El puntaje no es de estrellas:** es rango por letra A/B/C/D, y exige terminar bajo un tiempo objetivo que fija el propio nivel **y** haber juntado todos los diamantes. Falta cualquiera de las dos cosas, baja el rango | https://jayisgames.com/review/fireboy-and-watergirl-2-the-light-temple.php · https://jayisgames.com/review/fireboy-and-watergirl-4-in-the-crystal-temple.php | 2026-09-11 | verificado en lo esencial. **Corrección de alcance:** el umbral concreto que circula en búsquedas ("menos de 30 segundos = rango B aunque falte una gema") pertenece a *Fireboy & Watergirl 7: And Friends*, de 2026, no a las entregas 1 a 5. No hay fuente que fije el umbral de *Forest* ni de *Light Temple*: es decisión de diseño abierta, no dato a clonar |
| `RES-61.9` | Controles del original: Fireboy con las flechas (arriba salta), Watergirl con A/D y W | https://jayisgames.com/review/fireboy-and-watergirl-the-forest-temple.php · coolmathgames · foros de Steam de *Elements* | 2026-09-11 | verificado, tres fuentes independientes sin ninguna que lo contradiga |
| `RES-61.10` | **No hay IA de compañero.** El modo de un jugador es la misma persona manejando los dos personajes con las dos manos sobre el mismo teclado | https://jayisgames.com/review/fireboy-and-watergirl-the-forest-temple.php | 2026-09-11 | verificado, con la instrucción práctica de qué mano va con qué set de teclas |
| `RES-61.11` | Juego 1, *Forest Temple*, 19-nov-2009: **32 niveles** (17 normales + 6 de movimiento simultáneo + 9 de diamantes) | https://jayisgames.com/review/fireboy-and-watergirl-the-forest-temple.php | 2026-09-11 | verificado, número por número, por búsqueda cruzada independiente |
| `RES-61.12` | Juego 2, *Light Temple*: rayos de luz, espejos que los desvían a 90°, cajas-espejo empujables, detectores que activan mecanismos, salas a oscuras donde solo se ve el brillo de los personajes. 40 niveles | https://jayisgames.com/review/fireboy-and-watergirl-2-the-light-temple.php | 2026-09-11 | verificado |
| `RES-61.13` | Juego 3 oficial, *Ice Temple*, 5-abr-2012: hielo y nieve con **fricción distinta por personaje** — Fireboy resbala pero no trepa pendientes nevadas, Watergirl se frena pero sí trepa —, más luces que congelan agua o derriten hielo. 37 niveles (20+6+11). Dato extra que la ficha original no capturó: **ninguno de los dos puede saltar parado sobre nieve o hielo** | https://rawg.io/games/fireboy-watergirl-3-the-ice-temple · https://omnigames.blog/fireboy-and-watergirl-1-2-3-4-5-6 | 2026-09-11 | verificado |
| `RES-61.14` | Juego 4, *Crystal Temple*: portales de dos colores que teletransportan personajes y cajas; niveles con diamante plateado obligatorio antes de salir. 39 niveles (0 a 38, los cuatro primeros son tutorial) | https://jayisgames.com/review/fireboy-and-watergirl-4-in-the-crystal-temple.php | 2026-09-11 | verificado |
| `RES-61.15` | Juego 5, *Elements*: siete reinos (bosque, fuego, luz, cristal, hielo, viento, agua) en 62 niveles (49 + 13 de diamante blanco); el reino de viento suma ventiladores que empujan hacia arriba | https://www.coolmathgames.com/blog/fireboy-and-watergirl-differences-from-game-to-game · https://www.speedrun.com/faw5/levels | 2026-09-11 | reportado |
| `RES-61.16` | **Hay dos entregas oficiales más, que la primera ronda no relevó:** *Fireboy & Watergirl 6: Fairy Tales* (6-oct-2021, hadas arrastrables con el mouse que abren puertas y mueven palancas) y *7: And Friends* (2026), que **rompe el molde de dos personajes**: suma hasta tres amigos jugables, para cinco personajes y tres jugadores simultáneos | búsqueda 2026-09-11; ficha de Google Play de *Fairy Tales* | 2026-09-11 | reportado — importa si algún ciclo futuro quiere sumar más integrantes de la banda como personaje |
| `RES-61.17` | *"Fireboy & Watergirl III in The Forest Temple Again"* **no es oficial**: es un fangame chino de Fei Cheng, 9-nov-2010. El juego 3 oficial es *Ice Temple*. Ojo si se usa como referencia de cronología o de mecánicas | official-fireboy-watergirl.fandom.com, vía resumen de búsqueda | 2026-09-11 | verificado por acceso indirecto pero consistente (mismo autor, misma fecha, misma mecánica heredada) |
| `RES-61.18` | No se encontró ninguna fuente que confirme cuerdas o vides como elemento de nivel en ninguna entrega. Puede que directamente no exista | — | 2026-09-11 | sin fuente |

**Lectura para el proyecto, que es criterio propio y no hallazgo.** El esqueleto está
corroborado en lo que manda: inmunidad cruzada, victoria simultánea, puerta por personaje,
palancas, cajas, rango por letra, controles. Para una primera versión alcanza con el set de
*Forest Temple* —charcos de los tres tipos, palancas y botones, cajas, plataformas, puerta
doble—; espejos, portales, hielo y viento son ampliación de un ciclo posterior, no
bloqueo, porque cada entrega suma sin reemplazar. Dos avisos antes de que `arquitectura`
fije nada. Uno: el rango por letra con tiempo objetivo es más trabajo de tuning que un
cronómetro, y el número no se puede copiar de ningún lado (`RES-61.8`); si se simplifica a
tiempo más diamantes sin letra, hay que decirlo explícito y no prometer un puntaje que no
está. Dos: la wiki del fandom devolvió 402 en fetch directo en las dos rondas, así que todo
lo que viene de ahí es resumen de búsqueda; si alguna mecánica fina termina siendo central,
conviene una relectura por otra vía antes de tallarla en un `CTR-`.

---

## RES-62 — Motores 2D libres candidatos y sus licencias

Todas las licencias de esta sección se leyeron en el **archivo `LICENSE` crudo del repo**,
y las de riesgo alto se releyeron después por una segunda vía independiente (el CDN del
paquete npm publicado, el campo `license` de `package.json`, el registro de npm). Ninguna
cambió de tipo entre rondas.

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-62.1` | **Phaser: MIT**, Copyright (c) 2026 Richard Davey, Phaser Studio Inc. | https://raw.githubusercontent.com/phaserjs/phaser/master/LICENSE.md · https://cdn.jsdelivr.net/npm/phaser@4.2.1/LICENSE.md | 2026-09-11 | verificado, letra por letra, por tres vías. Nota menor: `phaser.io/download/license`, página de marketing, muestra "2024" sin el nombre del autor — es una fuente secundaria desactualizada, no el archivo primario |
| `RES-62.2` | Phaser: el `latest` de npm hoy es **v4.2.1** (2026-07-09). Import completo: 1.370.217 B crudos, **~347 KB gzip**. Hay herramienta oficial de custom-build para recortar por tree-shaking. Física AABB apta para plataformas; el InputManager maneja touch nativo | https://bundlephobia.com/package/phaser | 2026-09-11 | verificado |
| `RES-62.3` | Phaser v3 cerró en **3.90.0** (2025-05-23), declarada última de la línea v3, **congelada sin bugs mayores conocidos, no abandonada**. v4.0.0 salió el 2026-04-10 con el renderer WebGL reescrito entero: cinco meses de vida al día de hoy | https://phaser.io/news/2026/04/migrating-from-phaser-3-to-phaser-4-what-you-need-to-know · GitHub Releases | 2026-09-11 | verificado |
| `RES-62.4` | ~~**Kaplay: MIT**, Copyright (c) 2025 KAPLAY Team~~ **🔴 REFUTADA el 2026-09-18 por `RES-70` (`INV-61`) para la versión que se instala.** Sigue siendo cierta para `master`, que es lo que esta URL apunta — y ahí está el problema: **`3001.0.19` no sale de `master`**. El tag trae un `LICENSE.md` con una cláusula anti-IA agregada que `master` ya no tiene. La ficha leyó bien un archivo que no era el que importaba | https://raw.githubusercontent.com/kaplayjs/kaplay/master/LICENSE ⚠ **rama, no tag** | 2026-09-11 | ~~verificado~~ → **refutada**, ver `RES-70` … `RES-70.5` |
| `RES-62.5` | Kaplay: `latest` = **3001.0.19**, **cero dependencias**, 183.583 B crudos / **~65 KB gzip**. Input táctil nativo (`onTouchStart`/`Move`/`End`), que además mapea a click por defecto. Física por componentes (`area`, `body`, `solid`), no rígida. El `next` es `4000.0.0-alpha.27.1` y **no** es el `latest`: la rama estable sigue siendo 3001.x | https://bundlephobia.com/package/kaplay · https://registry.npmjs.org/kaplay | 2026-09-11 | verificado, dist-tags confirmados en el registro |
| `RES-62.6` | Kaboom.js, el proyecto original de Replit, está **sin mantenimiento** por decisión de sus autores — el propio paquete npm dice *"Kaboom is no longer maintained. Please use KAPLAY…"*. Kaplay es el fork comunitario, creado el 21-may-2024 después de que Replit discontinuara el proyecto | https://github.com/kaplayjs/kaplay/blob/master/CHANGELOG.md · kaplayjs.com/presskit | 2026-09-11 | verificado |
| `RES-62.7` | **LittleJS: MIT**, Copyright (c) 2021 Frank Force. **Confirmada el 2026-09-18 en el tarball publicado** (`RES-71`), que es donde había que mirarla — y ahí apareció además lo que faltaba: **el paquete vendoriza Box2D bajo licencia zlib** (`RES-71.1`). zlib es permisiva y no dispara la condición 4, pero "LittleJS: MIT" a secas estaba incompleto | https://raw.githubusercontent.com/KilledByAPixel/LittleJS/main/LICENSE ⚠ **rama** · https://unpkg.com/littlejsengine@1.18.29/LICENSE ✅ **tarball** | 2026-09-11, re-verificada 2026-09-18 | verificado, **ampliado por `RES-71.1`** |
| `RES-62.8` | LittleJS: cero dependencias, ~~**~46 KB gzip** (145.891 B crudos)~~ — **el peso envejeció: medido el 2026-09-18 sobre el tarball de `1.18.29`, el módulo ESM minificado da 62 KB gzip** (249 KB crudos), y con eso el motor deja de ser "19 KB más liviano" que Kaplay: la diferencia real contra los 66,8 KB medidos en bundle es de menos de 5 KB (`INV-61`, sección `RES-71`) — el más liviano de los motores completos. Trae ejemplo oficial *Platformer* con salto, escaleras, cajas y enemigos. Documentado como funcional en táctil, con plugin de touch-gamepad con deadzone sumado en agosto de 2026. Último commit confirmado por API: **2026-09-05**; release v1.18.26 del **2026-08-16** (la API manda: una lectura del HTML renderizado dio 2024 por error). Desfasaje menor: npm resuelve 1.18.29 y GitHub Releases 1.18.26 | https://github.com/KilledByAPixel/LittleJS/releases · api.github.com | 2026-09-11 | verificado |
| `RES-62.9` | **Excalibur.js: BSD 2-Clause**, Copyright (c) 2013 Erik Onarheim. **Corrección:** la cláusula 2 exige reproducir el aviso de copyright y las condiciones *"in the documentation and/or other materials provided with the distribution"*. Eso **es** una obligación de atribución, prácticamente la misma que impone MIT. Ninguna de las dos exige crédito visible en la interfaz; las dos se cumplen con un archivo o página de créditos | https://raw.githubusercontent.com/excaliburjs/Excalibur/main/LICENSE.md | 2026-09-11 | **verificado con corrección** — la ficha original decía "sin cláusula de atribución, compatible con un sitio sin créditos", y eso fusiona dos cosas distintas. Es *sin créditos en pantalla*, no *sin créditos* |
| `RES-62.10` | Excalibur: última versión **0.32.0** (2025-12-23), **~142 KB gzip**. Trae física de cuerpo rígido, más pesada de lo que un clon simple necesita. El sistema de Pointer unifica mouse, touch y stylus y soporta multitouch, pero la documentación registra un bug histórico de eventos táctiles en móvil que se resolvió fijando `touch-action: none` a mano | https://bundlephobia.com/package/excalibur · GitHub Releases | 2026-09-11 | verificado |
| `RES-62.11` | **melonJS: MIT**, Copyright Olivier Biot / AltByte Pte Ltd, 2011-2023 | https://raw.githubusercontent.com/melonjs/melonJS/master/LICENSE.md | 2026-09-11 | verificado |
| `RES-62.12` | melonJS: la versión `latest` es **inconsistente entre cinco fuentes automatizadas** — 18.1.0 (libraries.io), 19.7.1 y 19.8.0 (búsqueda y perfil npm, las dos "publicada hace pocos días"), 20.4.0 (Bundlephobia y `registry.npmjs.org/melonjs/latest`), con una fecha de release de 2024-09-09 que no cuadra con ser la última. Para 20.4.0: 851.681 B crudos / **~246 KB gzip**, el más pesado de los 2D nativos | https://bundlephobia.com/package/melonjs | 2026-09-11 | reportado — la inconsistencia **se agravó** en la refutación: cuatro números en la primera ronda, cinco en la segunda |
| `RES-62.13` | **PlayCanvas: MIT**, Copyright (c) 2011-2026 PlayCanvas Ltd. Versión 2.22.1. **~600 KB gzip** (2.415.039 B crudos): es un motor 3D WebGL/WebGPU completo, y el núcleo de render es difícil de evitar aun usándolo para 2D | https://bundlephobia.com/package/playcanvas · registry.npmjs.org | 2026-09-11 | verificado en licencia y versión; la fecha exacta del release no se confirmó |
| `RES-62.14` | **Matter.js: MIT**, Liam Brummitt and contributors. Última versión 0.20.0 (2024-06-23). **El estancamiento es peor de lo reportado:** el repo tiene `pushed_at` = 2024-08-17 y la lista completa de tags no pasa de 0.20.0 — no hay rama activa oculta ni release sin publicar | https://raw.githubusercontent.com/liabru/matter-js/master/LICENSE · api.github.com | 2026-09-11 | verificado |
| `RES-62.15` | **Planck.js: MIT**, Copyright (c) Erin Catto, Ali Shakiba. Versión 1.5.0 (2026-04-07), ~46 KB gzip. Confirmado por **cinco vías coincidentes**: `LICENSE.txt` crudo por GitHub raw y por unpkg, `package.json`, `registry.npmjs.org/planck/latest` y búsqueda cruzada. El "zlib" que citan Wikipedia y cdnjs corresponde al Box2D original y al paquete legado `planck-js` (0.1.x–0.3.x), **no** al paquete `planck` 1.x vigente | https://github.com/piqnt/planck.js/blob/master/LICENSE.txt | 2026-09-11 | **verificado** — la ficha original lo dejó "riesgo alto, sin resolver" por una contradicción entre fuentes secundarias. Ya no hace falta que nadie abra el archivo a mano |
| `RES-62.16` | Matter.js y Planck.js **no son motores de juego**: son solo física de cuerpo rígido. Sin renderer, sin sprites, sin cámara, sin carga de assets, sin input táctil. Adoptarlos obliga a escribir el resto del motor a mano, que es exactamente lo que `BR-15` dice que no se hace | — | — | criterio propio |
| `RES-62.17` | **Tiled**, la aplicación editor: **GPL v2** (`LICENSE.GPL`, encabezado estándar de la FSF). **libtiled**, la librería C++ que parsea sus mapas: **BSD 2-Clause**. El `COPYING` del repo lista "GPL-2.0-or-later AND BSD-2-Clause" según componente | https://raw.githubusercontent.com/mapeditor/tiled/master/LICENSE.GPL | 2026-09-11 | verificado |
| `RES-62.18` | **LDtk: MIT** de punta a punta, app y formato, Copyright Sébastien Benard / Deepnight Games. Exporta un JSON documentado y también TMX. Es pay-what-you-want incluyendo gratis, uso comercial incluido | https://raw.githubusercontent.com/deepnight/ldtk/master/LICENSE · https://deepnight.itch.io/ldtk | 2026-09-11 | verificado |

**Lectura para el proyecto, que es criterio propio y no hallazgo.** Filtrando por lo que
este sitio puede usar sin pelearse con `BR-15`: PlayCanvas queda afuera por peso, aunque su
licencia esté impecable. Matter.js y Planck.js quedan afuera por `RES-62.16`, no por
licencia — las dos son MIT limpias. melonJS queda afuera por peso y porque cinco fuentes
den cinco versiones distintas es en sí una señal. Excalibur queda afuera por la física de
cuerpo rígido que este juego no necesita y por el historial de bug táctil, **no** por la
cláusula de créditos, que es la misma obligación que MIT. Quedan tres: **Kaplay
(~65 KB gzip, cero dependencias, modelo por componentes que mapea casi literal a "dos
personajes + plataformas + zonas que matan + puerta cooperativa"), LittleJS (~46 KB, con
ejemplo de plataformas ya armado, API más manual) y Phaser pineado a 3.90.0** (el más
pesado, el de comunidad más grande, y con la v4 de cinco meses y renderer nuevo como
argumento para no tomar el `latest` por defecto). Ese es el orden. Dos cosas que este
ranking no midió y que son de `arquitectura`: ninguno se probó dentro de una isla de Astro
con salida estática, y los números de peso son de import completo, así que el margen a
favor de los livianos probablemente sea mayor, no menor. Y un dato del repo que pesa en la
comparación: `package.json` declara **una sola dependencia de producción, `astro`**, y hoy
no hay ni un paquete de npm del lado del cliente — el motor sería el primero.

---

## RES-63 — Qué hay ya hecho y libre: clones, plantillas y editores de nivel

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-63.1` | `hadigghazi/FireBoy-and-WaterGirl` (Phaser + p5.js, corre en navegador, con carpeta de niveles): **no tiene LICENSE**. Confirmado con el campo oficial de la API de GitHub (`license: null`), no mirando el árbol de archivos a ojo | https://api.github.com/repos/hadigghazi/FireBoy-and-WaterGirl | 2026-09-11 | verificado |
| `RES-63.2` | `abidtalukder/fireboy-and-Watergirl`: Processing (Java), de escritorio, **sin LICENSE** (`license: null` en la API). Descartado por plataforma antes que por licencia | https://api.github.com/repos/abidtalukder/fireboy-and-Watergirl | 2026-09-11 | verificado |
| `RES-63.3` | `ctallum/MagmaBoy-and-HydroGirl-Game`: Python/Pygame, de escritorio, **sin LICENSE** (`license: null` en la API) | https://api.github.com/repos/ctallum/MagmaBoy-and-HydroGirl-Game | 2026-09-11 | verificado |
| `RES-63.4` | Tres repos más, abiertos en la refutación y no en la ficha original (`hady-awayda`, `RyanChakov`, `pavel-skala`): **ninguno tiene LICENSE**. El único con MIT que apareció (`rodrigorcz/FireBoy-and-WaterGirl`) está escrito en Assembly y no corre en navegador | github.com, repo por repo | 2026-09-11 | verificado — el patrón se sostiene, aunque no es un barrido exhaustivo de todos los forks |
| `RES-63.5` | **No existe un clon web completo adoptable bajo `BR-15`.** El camino es motor genérico más arte propio, no repo-clon vestido | — | — | criterio propio |
| `RES-63.6` | LittleJS trae, textual en su README, *"Import level editor data from Tiled or other JSON"*, y el ejemplo *Little Platformer*. **No** trae mecánica cooperativa de dos personajes: hay que construirla | https://github.com/KilledByAPixel/LittleJS | 2026-09-11 | verificado |
| `RES-63.7` | `ourcade/sidescrolling-platformer-template-phaser3`: **MIT**, Phaser 3.50 + Matter Physics, **6 commits** — actividad mínima, y no se confirmó si trae niveles de ejemplo cargados | https://github.com/ourcade/sidescrolling-platformer-template-phaser3 | 2026-09-11 | verificado |
| `RES-63.8` | **REFUTADO Y CERRADO — la pregunta de si un mapa TMX/JSON hereda la GPL de Tiled tiene respuesta explícita, en tres lugares que la ficha original no buscó.** (a) El pie de la página oficial del formato TMX: *"The TMX Map Format by mapeditor.org is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License"* — la licencia del formato está separada de la del programa. (b) El foro oficial de Tiled, hilo "License of maps created with Tiled": *"Your maps are your own work and copyright, they are not 'works based on the program'"*. (c) La FAQ del GPL de la FSF, entrada `GPLOutput`: *"copyright law does not give you any say in the use of the output people make from their data using your program"* | https://doc.mapeditor.org/en/stable/reference/tmx-map-format/ · https://discourse.mapeditor.org/t/license-of-maps-created-with-tiled/7887 · https://www.gnu.org/licenses/gpl-faq.html#GPLOutput | 2026-09-11 | **verificado**, con dos reservas: la entrada de la FSF se confirmó por cita de buscador porque gnu.org rechazó la conexión desde estas herramientas, y ninguna de las tres es una declaración formal del titular del copyright de Tiled. **El riesgo baja de alto a bajo:** la ficha original decía que era zona gris y recomendaba esquivar Tiled por eso, y esa premisa es falsa |
| `RES-63.9` | Kenney.nl (Platformer Kit y packs relacionados): tilesets **CC0**, según varias fuentes de búsqueda coincidentes; no se leyó la página de licencia primaria. No se usaría como arte final por `diseno-marca.md`, pero sirve de vara: hay arte libre de sobra para este género, así que el costo real del juego es vestirlo | https://kenney.nl/assets/platformer-kit | 2026-09-11 | reportado |
| `RES-63.10` | "SunnyLand" (itch.io), pack CC0 con proyecto Phaser armado: dato tomado de un resumen de búsqueda, sin abrir la página | — | 2026-09-11 | sin fuente |

**Lectura para el proyecto, que es criterio propio y no hallazgo.** No hay atajo: los clones
web no tienen licencia y los que tienen licencia no corren en navegador, así que `BR-15`
aplica en su forma más literal. De los candidatos, LittleJS, Kaplay y LDtk pasan el filtro
con evidencia leída en el archivo, no en la etiqueta de la página. LDtk sigue siendo la
opción más simple como editor de niveles —MIT sin nada que explicar, y su JSON se versiona
en el repo igual que el resto de los datos, que es lo que pide `CLAUDE.md`—, pero **la razón
cambia**: no es que Tiled tenga licencia ambigua, es que LDtk es un archivo menos que
interpretar. Si a `arquitectura` le conviniera Tiled por otra cosa (soporte de tilesets,
por ejemplo), `RES-63.8` lo saca de la lista negra. Y ningún motor trae la mecánica de dos
personajes con elementos excluyentes lista para usar: eso se construye encima de
cualquiera, así que no desempata entre ellos.

---

## RES-64 — Skay Beilinson y la Negra Poli: hechos, y el derecho al nombre y a la imagen

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-64.1` | Skay Beilinson es **Eduardo Federico Beilinson**, nacido el **15-ene-1952** en La Plata. Cofundador y guitarrista de Patricio Rey; desde 2002 lidera Skay y Los Fakires, donde canta, compone y toca la primera guitarra | https://es.wikipedia.org/wiki/Skay_Beilinson + Infobae, Río Negro, La Nación, CMTV | 2026-09-11 | verificado, más de tres fuentes independientes |
| `RES-64.2` | **Skay está vivo y en plena actividad.** Gira 2026 con Los Fakires: Córdoba 24-ene, Temperley 23-may, Rosario 6-jun y 4-jul, Bolívar 20-jun, **Hipódromo de La Plata 25-jul** (mudado del Estadio Atenas por demanda de entradas), Posadas 7-ago. Tiene 74 años | https://www.eldestapeweb.com/cultura/entradas-skay-beilinson-plata-2026-precios-fecha-cuando-toca-2026722154945 · fmlaboca.com.ar · 0221 · misionesonline.net | 2026-09-11 | verificado — seis fuentes independientes coincidentes en fecha, lugar y motivo del cambio de sede. Es la confirmación más sólida de todo el lote |
| `RES-64.3` | Rasgos visuales fichados, no de memoria: sombrero Panamá beige, pelo gris largo atado que cae por debajo del sombrero, anteojos de marco negro con cristales amarillos o lentes oscuros sobre un rostro alargado, camisa estampada algo abierta, amuleto colgante, a veces vincha. La Nación (25-jul-2020) lo describe *"fiel a su Gibson SG roja"* | https://www.lanacion.com.ar/lifestyle/moda-skay-beilinson-como-icono-rockero-nid2404628/ · https://www.elcordillerano.com.ar/noticias/2013/10/21/8910-skay-beilinson-brindo-un-show-memorable-en-puerto-rock | 2026-09-11 | verificado |
| `RES-64.4` | Postura en escena: *"anfitrión humilde y hasta tímido"*, presenta las canciones y poco más, siempre con una sonrisa; la guitarra es su vía de conexión. La Nación describe además que en la era de estadios su *"expresión corporal parecía endemoniada"*. No se contradicen: son épocas distintas, y para caricaturizar hay que elegir cuál | mismas dos URLs de `64.3` | 2026-09-11 | verificado |
| `RES-64.5` | La guitarra es una **Gibson SG roja** — eso lo confirman todas las fuentes. El modelo y el año **no** son hecho: Wikipedia en inglés dice 1968 con vibrato Maestro; Equipboard y Desprolijo dicen SG Standard 1970 | https://en.wikipedia.org/wiki/Skay_Beilinson · https://equipboard.com/pros/skay-beilinson · https://desprolijo.substack.com/p/apuntes-sobre-la-guitarra-de-skay | 2026-09-11 | reportado — "SG roja" sí es hecho; el año no |
| `RES-64.6` | "La Negra Poli" es **Carmen Castro**, nacida el **15-nov-1950** en Buenos Aires. Representante, productora y empresaria musical. La fecha sale de una sola fuente fuerte | https://es.wikipedia.org/wiki/Negra_Poli | 2026-09-11 | reportado — fuente única; lo único adicional que apareció es un posteo en redes que podría estar citando a la propia Wikipedia |
| `RES-64.7` | **Qué decidía Poli**, que es lo que un juego querría caricaturizar: fue la mánager histórica. Negociaba contratos, supervisaba la seguridad de los recitales, manejaba la logística de las giras y rechazó sistemáticamente las ofertas de las multinacionales. Estableció el modelo de autogestión de la banda | https://www.perfil.com/noticias/protagonistas/carmen-la-negra-poli-castro-el-pilar-clave-en-la-vida-amorosa-y-profesional-del-indio-solari.phtml · https://www.rionegro.com.ar/redes/quien-es-la-negra-poly-la-mujer-clave-detras-del-fenomeno-del-indio-solari-y-los-redondos-4599361/ · https://www.infobae.com/cultura/2026/06/05/las-memorias-del-indio-solari-los-redondos-la-pelea-con-skay-y-la-negra-poli-y-las-muertes-en-sus-shows/ | 2026-09-11 | verificado, tres fuentes independientes |
| `RES-64.8` | El propio Indio lo confirma en su memoir, citado por Infobae: *"De pronto me sorprendió que Poli estuviese ahí, dispuesta a hacerse cargo de la parte administrativa y burocrática"*. Es la fuente más cercana a primaria sobre su rol | https://www.infobae.com/cultura/2026/06/05/las-memorias-del-indio-solari-los-redondos-la-pelea-con-skay-y-la-negra-poli-y-las-muertes-en-sus-shows/ | 2026-09-11 | verificado |
| `RES-64.9` | **Poli está viva.** No hay reporte de fallecimiento —se buscó explícitamente—, las notas de junio de 2026 hablan de ella en presente y sigue como mánager de La saga de Sayweke, la banda de su hijo Claudio Quartero | https://es.wikipedia.org/wiki/Negra_Poli | 2026-09-11 | reportado |
| `RES-64.10` | Poli y Skay son pareja: se conocieron alrededor de **1969** y ella es su compañera de vida y su mánager; una fuente independiente de Wikipedia la llama explícitamente "su esposo… el músico Skay Beilinson". El **casamiento fechado en 2023** sale solo del infobox de Wikipedia ("Skay Beilinson (2023-presente)"), sin cita propia | https://es.wikipedia.org/wiki/Negra_Poli · https://www.rionegro.com.ar/redes/quien-es-la-negra-poly-la-mujer-clave-detras-del-fenomeno-del-indio-solari-y-los-redondos-4599361/ | 2026-09-11 | el vínculo de pareja, verificado; la **fecha** de casamiento, reportada. No se reporta como hecho fechado |
| `RES-64.11` | **LEYENDA — el vínculo amoroso de Poli con el Indio no es un hecho.** Perfil (5-jun-2026) lo afirma sin rodeos: *"la relación amorosa se consolidó…"*, *"estabilidad afectiva absoluta"*, ubicando el inicio "a mediados de la década de 1970". Wikipedia, Río Negro, El Cordillerano y una nota biográfica adicional ubican a **Skay** como la pareja desde 1969. Y El Cordillerano, la misma semana, **admite que la versión que conecta a Poli con la pelea Indio–Skay circula sin fuente** ("versiones cruzadas", "lecturas de los fanáticos") | https://www.perfil.com/noticias/protagonistas/carmen-la-negra-poli-castro-el-pilar-clave-en-la-vida-amorosa-y-profesional-del-indio-solari.phtml · https://www.elcordillerano.com.ar | 2026-09-11 | **leyenda** — no es una leyenda difusa: es una contradicción frontal entre dos medios grandes, publicada por los dos en los días inmediatos a la muerte del Indio, o sea en la ventana de mayor especulación posible. El juego no puede apoyarse en ningún vínculo sentimental, bajo ningún concepto |
| `RES-64.12` | **REFUTADO — baja de "verificado" a "reportado".** Que la marca "Patricio Rey y sus Redonditos de Ricota" esté registrada en el INPI a nombre de Solari, Skay y Carmen Castro **por partes iguales**, y que Erks S.A. (1992) tenga a Solari de presidente, Skay de vicepresidente y Poli de directora, viene de **un solo artículo** (Infobae, 8-jun-2026), replicado el mismo día o la misma semana por ocho o nueve medios con la redacción casi palabra por palabra. Ninguno cita expediente, partida ni acta del INPI. No se pudo contrastar contra la base pública del organismo | https://www.infobae.com/sociedad/policiales/2026/06/08/lunes-que-va-a-pasar-con-la-fortuna-del-indio-solari/ | 2026-09-11 | **reportado — fuente única, plausible, no primaria.** Se dice "una investigación periodística, no contrastada en el registro público, dice que…", no "está confirmado que…" |
| `RES-64.13` | Respaldo independiente y más viejo de lo de arriba, por otro camino: la cobertura de **2020** del conflicto real entre Solari y Skay/Poli por la subida no autorizada de la discografía a streaming menciona a Erks S.A. y a los tres socios. Da soporte a que la sociedad existe y a que los tres comparten la gestión de derechos — **y muestra que estas tres personas concretas sí reclaman entre sí por usos no autorizados de su propia marca compartida** | lacapital.com.ar · diariojornada.com.ar · minutouno.com, cobertura de 2020 | 2026-09-11 | reportado. Pesa más para calibrar el riesgo de este juego que la ausencia de reclamos contra fan art ajeno |
| `RES-64.14` | **Ley 11.723, art. 31** (texto oficial): *"El retrato fotográfico de una persona no puede ser puesto en el comercio sin el consentimiento expreso de la persona misma"*. Excepciones: fines científicos, didácticos y en general culturales, o hechos de interés público o desarrollados en público. **Art. 35:** a los veinte años de la muerte ya no hace falta consentimiento. Este artículo habla de **retrato fotográfico** y de **puesto en el comercio** | https://www.argentina.gob.ar/normativa/nacional/ley-11723-42755/texto | 2026-09-11 | verificado, texto primario |
| `RES-64.15` | **CCyC art. 53:** *"Para captar o reproducir la imagen o la voz de una persona, de cualquier modo que se haga, es necesario su consentimiento"*, salvo a) participación en actos públicos; b) interés científico, cultural o educacional prioritario con precauciones para evitar daño innecesario; c) ejercicio regular del derecho de informar sobre acontecimientos de interés general. Muerto el titular consienten los herederos; pasados veinte años, la reproducción no ofensiva es libre | https://codigocivilonline.com.ar/articulo-53/ | 2026-09-11 | verificado, texto primario. La frase clave —"de cualquier modo que se haga"— está, y **no** menciona fin comercial |
| `RES-64.16` | **CCyC art. 71 inc. c — el artículo escrito para este caso exacto:** puede ejercer acción en defensa de su nombre *"aquel cuyo nombre es usado para la designación de cosas o personajes de fantasía, si ello le causa perjuicio material o moral, para que cese el uso"*. Se puede reclamar reparación de daños y el juez puede ordenar publicar la sentencia. La doctrina señala que el Código vigente **eliminó el requisito de malicia** del régimen anterior. Lo único que sigue exigiendo es el **perjuicio**. No pide lucro | https://codigocivilonline.com.ar/articulo-71/ · https://universojus.com/ccc-comentado-infojus/interpretacion-art-71 | 2026-09-11 | verificado, texto primario verbatim |
| `RES-64.17` | **CCyC art. 72:** *"El seudónimo notorio goza de la tutela del nombre"*. Consecuencia directa: "Skay" y "la Negra Poli" no son apodos sin protección, son seudónimos notorios y arrastran la tutela del art. 71, inciso c incluido. **Usar el apodo no baja el riesgo: lo sube**, porque es justo aquello por lo que se los identifica sin confusión | https://leyes-ar.com/codigo_civil_y_comercial/72.htm | 2026-09-11 | verificado, texto primario verbatim |
| `RES-64.18` | **La parodia no es una defensa legislada en Argentina.** La 11.723 la menciona solo en el art. 25, y para lo contrario de lo que se supone: reconoce derecho de coautor a quien parodia una obra **con autorización** del autor. No hay excepción de parodia, caricatura ni homenaje. El proyecto 0735-D-2016 en Diputados pide reformarlo por eso mismo. "Es una parodia cariñosa" es un argumento de tono, no jurídico | https://www.argentina.gob.ar/normativa/nacional/ley-11723-42755/texto · https://www.diputados.gob.ar/comisiones/permanentes/ccultura/proyecto.html?exp=0735-D-2016 | 2026-09-11 | verificado, las dos por fuente oficial |
| `RES-64.19` | Fallos citables sobre parodia, vía nota de doctrina sin firma y **no verificados en fuente judicial**: (a) *Japan Tobacco c/ Massalin Particulares*, CNCiv.Com.Fed. Sala I, permisivo — el uso en tono de parodia "no era denigratorio, ni peyorativo"; (b) *Noverazco c/ Televisión Federal S.A.*, misma Sala, restrictivo — un sketch paródico fue "uso marcario atípico" y hubo resarcimiento por daño moral, pesando que la televisora lucraba; (c) *AGEA c/ Castañeda*, Sala III — ante la mera referencia sin engaño ni competencia desleal, prima la libertad de expresión. **El eje que separa (a) y (c) de (b) es denigración y lucro** | https://abogados.com.ar/uso-de-marca-ajena-en-tono-de-parodia/33624 | 2026-09-11 | reportado |
| `RES-64.20` | Lectura del texto del art. 53, y es lo que rompe la intuición de "como no hay lucro no pasa nada": el 53 dice "de cualquier modo que se haga" y **no** exige fin comercial, a diferencia del "puesto en el comercio" del art. 31. Un dibujo que hace reconocible a la persona es reproducción de imagen. La excepción a) cubre al Skay que toca en un escenario, no a un personaje inventado que corre por un nivel. No se encontró doctrina fetcheable que lo diga con estas palabras | — | — | criterio propio |
| `RES-64.21` | No se encontró **ningún** antecedente de reclamo contra fan art, juegos de fans o merchandising no oficial de esta banda. Tampoco se encontró ningún juego de fans de los Redondos. Lo que sí se ve es merchandising no oficial vendiéndose con lucro en MercadoLibre sin reclamo visible | https://listado.mercadolibre.com.ar/remeras-los-redonditos-de-ricota | 2026-09-11 | **sin fuente** — es "no hay caso conocido", no "conviven sin problema" |

**Lectura para el proyecto, que es criterio propio y no hallazgo.** Lo primero no es
jurídico: **las dos personas están vivas** (`64.1`, `64.2`, `64.9`) y, con el nivel de
confianza que `64.12` permite, comparten con el Indio la gestión de los derechos de todo lo
demás que el sitio usa. Todo el andamiaje de `D-14` —si llega un reclamo se baja— está
calibrado para el reclamo de un titular de obra, a quien bajar el sitio le devuelve lo
suyo. Acá el reclamante posible sería un hombre de 74 años que salió a tocar en agosto y su
mujer de 75, y lo que estaría en juego es su nombre. Bajar el sitio no le devuelve nada a
quien se sintió mal representado. Es la misma excepción que `BR-15` consecuencia 1 ya
escribió para la licencia del motor, entrando por otra puerta: **hay un segundo chequeo
previo que `BR-15` no previó.**

Segundo: "sin fines de lucro no pasa nada" es medio cierto y por eso peligroso. Es cierto
para el art. 31, que se dispara con el retrato fotográfico puesto en el comercio (`64.14`);
un dibujo gratis no lo activa. No es cierto para el art. 53 (`64.15`, `64.20`). Y es
directamente falso para el que importa: el art. 71 inc. c está redactado para el nombre de
una persona usado "para la designación de cosas o personajes de fantasía" y solo exige
perjuicio, sin lucro y sin malicia (`64.16`). El art. 72 remata (`64.17`). Y la parodia no
es escudo (`64.18`).

Dicho eso, ninguno de esos artículos se dispara solo. El 71 inc. c exige perjuicio, y de
los tres fallos de `64.19` el que terminó mal combinaba lucro y tono denigratorio. Un juego
gratis, sin publicidad, que los dibuja con los atributos que ellos mismos convirtieron en
emblema público, es el escenario de menor perjuicio imaginable. **El riesgo real no es que
demanden: es que lo vean y les moleste.** Eso no lo mide un abogado, lo mide el tono.

Dónde está la línea entre homenaje y ventriloquia, para este caso y por escrito antes de
dibujar nada. Un sprite que corre y salta **no habla**, así que un personaje jugable no es,
en sí, lo que veta `voz-ricotera.md` §1. La línea se cruza en cuatro momentos. **Uno,**
cuando el personaje dice "yo": un bocadillo, un cartel de victoria en primera persona, una
línea con su firma es la cita de utilería que envenena el rótulo entero. El muñeco puede
gruñir, no puede opinar. **Dos,** cuando el personaje hace algo que se lee como biográfico:
que resuelvan un nivel juntos es mecánica; que se peleen, se separen, que uno abandone al
otro o que aparezca un tercero ausente es contar la historia real de tres personas, una de
las cuales murió hace tres meses (`RES-04`). Un juego que pone a Skay y Poli como dupla,
sin el Indio, publicado en 2026, se puede leer como tomar partido en una pelea real. **Tres,**
la diferencia entre insignia y retrato: sombrero, pelo atado y SG roja (`64.3`, `64.5`) son
cosas que él exhibe ante cámaras todas las noches; cuanto más se parezca el sprite a la
insignia y menos a la cara, más lejos queda del derecho a la imagen. **Cuatro,** la
asimetría: Skay sube a un escenario; Poli construyó cincuenta años de perfil bajo
deliberado, y su método era el aislamiento mediático (`64.7`). La ley no distingue; el
criterio sí. Y el único dato jugoso que circula sobre ella está contradicho entre fuentes
(`64.11`).

El sitio ya sabe hacer esto bien: en la Redondopedia el Indio habla citado, rotulado y con
ficha. El equivalente acá es que Skayboy y Poligirl sean muñecos declaradamente muñecos
—hechos de sombrero, guitarra y molinete—, con un pie en registro 3 que diga que es un
homenaje de fans, que no es oficial, y que ni Eduardo Beilinson ni Carmen Castro tuvieron
nada que ver. Ese pie no es trámite: es lo mismo que hace el rótulo `LEYENDA` con un dato
sin fuente.

**Lo que este frente pide, y no es una recomendación de estilo:** que el usuario escriba
una `D-XX` que autorice explícitamente el uso del nombre y la caricatura de personas reales
vivas, con el texto de que el criterio de `D-14` **no alcanza** para este caso. Sin esa
`D-XX`, la idea se guarda como `IDEA-14` y no se promueve (`BR-16`). Si se toma, tres
barandas que salen de lo relevado: (a) el personaje nunca dice "yo" ni lleva texto
atribuido; (b) el diseño va por insignia, no por parecido facial; (c) nada narra la
relación real entre Skay, Poli y el Indio, ni por mecánica ni por texto. Y la salida más
barata, que conserva casi todo el chiste: que la dupla se nombre por sus emblemas y no por
sus nombres — la mecánica de dos personajes que se necesitan para abrir una puerta es,
además, literalmente los molinetes de `D-14`. Los nombres concretos son de `contenido`
(`CNT-02`, `D-17`).

---

## RES-65 — Cooperativo en un solo teléfono: qué patrones existen y cuál entra acá

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-65.1` | **El FAQ oficial del juego que se clona dice, textual:** *"When playing on a mobile device the game is played as a single player game. You will need to switch between the characters and to control each one of them separately."* En móvil se alterna tocando un ícono; no se mueven los dos a la vez | https://www.fireboynwatergirl.com/?p=page&id=3 | 2026-09-11 | verificado con fetch directo en vivo. Búsquedas adicionales no encontraron ninguna versión móvil oficial con multitouch simultáneo, ni en el App Store ni en la versión "Online" |
| `RES-65.2` | *Ibb & Obb* (co-op de plataformas con gravedad espejada) tiene modo de un jugador con **control simultáneo** de ambos personajes, un stick cada uno, y las reseñas coinciden en que es extremadamente difícil y no recomendado — el trofeo se llama "Brain Damage" | https://gamefaqs.gamespot.com/pc/792624-ibb-and-obb/reviews/161684 · GameRevolution · Co-Optimus · foros de Steam | 2026-09-11 | verificado. Es el fracaso simétrico: un co-op diseñado para dos personas moviéndose a la vez se rompe cuando una sola cubre los dos roles |
| `RES-65.3` | *The Lost Vikings*: patrón de origen del botón de cambio — un jugador maneja tres personajes de a uno, cambia con L/R, y el que no está activo queda quieto donde lo dejaste | https://strategywiki.org/wiki/The_Lost_Vikings/Controls | 2026-09-11 | verificado |
| `RES-65.4` | *Trine*: cambio de personaje instantáneo con un solo botón, bien recibido en reseñas. Confirma que el patrón aguanta acción en tiempo real, no solo puzzle estático | https://www.gamespot.com/reviews/trine-review/1900-6213054/ | 2026-09-11 | reportado |
| `RES-65.5` | Se menciona en agregadores que *Pico Park* tiene "modo solo con cambio de personaje", pero la fuente es débil (wikis y blogs, no documentación del estudio) y no se pudo confirmar con una segunda fuente de peso | https://en.wikipedia.org/wiki/Pico_Park | 2026-09-11 | **leyenda** |
| `RES-65.6` | Material Design fija el piso de un target táctil en **48×48 dp** (~9 mm). Coincide exactamente con el `--toque-min` ≥ 48 px que este proyecto ya usa: no cambia nada, confirma que el piso propio está alineado al estándar | https://m2.material.io/design/usability/accessibility.html | 2026-09-11 | verificado |
| `RES-65.7` | Devlog de un desarrollador (no estándar de industria) que implementó un d-pad táctil desde cero: lo dimensiona en **18% del ancho × 12% del alto**, no en px fijos, y explícitamente para **un** jugador — no dice nada sobre compartir pantalla | https://www.aaronbell.com/mobile-touch-controls-from-scratch/ | 2026-09-11 | reportado |
| `RES-65.8` | El género "dos personas, un solo teléfono" existe y se publica (*SplitFire* en itch.io, *DUAL!* y *2 Player Games: Split Screen* en Google Play, *Galaxus* en itch.io). Pero los títulos encontrados son minijuegos de duelo o carrera, **no plataformeros de salto y física fina** | https://sebthecat.itch.io/splitfire | 2026-09-11 | verificado. Generalizar "esto sirve para un plataformas" sería criterio propio, no algo que las fuentes confirmen |
| `RES-65.9` | WebRTC permite datachannel peer-to-peer sin servidor de juego, y anda bien en la misma WiFi. Pero **incluso los ejemplos "sin servidor de señalización" necesitan algún canal** para intercambiar oferta y respuesta: copiar y pegar a mano, QR o un relay liviano. No existe camino de cero infraestructura para que dos teléfonos se encuentren solos | https://webrtchacks.com/datachannel-multiplayer-game/ · Nabto · webrtc.org | 2026-09-11 | verificado por dos fuentes independientes. Y choca de frente con el "sin backend" de `CLAUDE.md`, así que el descarte está doblemente fundado |
| `RES-65.10` | **CORREGIDO.** El cálculo de que dos d-pads de ~150×150 px más un botón por jugador no dejan margen para ver el nivel **solo vale en vertical** (375×812). En horizontal el viewport efectivo pasa a ~812×375 y hay precedente de género documentado: *Galaxus* describe su esquema como *"each player grabs one end of the phone and uses the buttons on their side of the screen"*. El sitio **no fija orientación** (el viewport meta de `Base.astro` no bloquea landscape) | https://itch.io — ficha de *Galaxus* | 2026-09-11 | criterio propio, corregido en refutación: la ficha original generalizaba a "la mecánica dual no entra", y solo había probado vertical |

**Lectura para el proyecto, que es criterio propio y no hallazgo.** El patrón de botón de
cambio —alternar personaje, el inactivo queda quieto y a salvo— es el único con precedente
real y comprobado para una sola persona en una pantalla chica, y no es una analogía
forzada: es literalmente cómo la versión móvil oficial del juego que se va a clonar
resuelve este mismo problema (`RES-65.1`). *Lost Vikings* y *Trine* muestran que aguanta
puzzle y acción. *Ibb & Obb* muestra el fracaso del camino opuesto. El multijugador entre
dos teléfonos se descarta por `RES-65.9`, con fundamento técnico y de regla, no por
capricho.

Qué se pierde al elegirlo, y conviene decirlo antes: el corazón cooperativo en tiempo real
—dos personas viendo reaccionar a sus personajes al mismo obstáculo en el mismo instante—
desaparece, y los niveles hay que diseñarlos para que **ningún** puzzle dependa de
movimiento simultáneo, con el personaje en pausa siempre en posición segura. Eso cambia la
promesa de "clon de Fireboy & Watergirl" a "plataformas de un jugador con dos personajes
alternables", y esa diferencia de expectativa es de `producto` y `contenido`, no de este
frente. Lo que **no** está cerrado es el horizontal (`RES-65.10`): ahí hay precedente de
género para dos personas en un teléfono, y es de `experiencia` decidir si se explora o se
descarta — pero se decide con el dato, no con un cálculo que solo midió vertical.

---

## Medición sobre el repo — el ancla ricotera: qué son los dos elementos

> Las tres secciones que siguen **no son fichas `RES-`**, y no llevan número. Una ficha
> `RES-` es un hecho externo con fuente y URL; esto es medición sobre este repositorio,
> reproducible corriendo lo mismo de nuevo, y por eso va aparte.

**Regla de conteo, declarada antes de cualquier número.** Corpus: `src/data/cancionero.json`
— 104 temas, 12.164 líneas (`letra` 5490, `tab` 5389, `anotacion` 1188, `instrumental` 97).
Líneas con `t: "letra"` y texto no vacío: **2923, en 100 temas**. `motivoAnotacion()` de
`src/lib/cancionero/anotacion.ts` descarta **cero** de esas 2923 — el campo `t` del JSON ya
es la salida de ese clasificador. El filtro que de verdad manda para `US-03` no es ese sino
`sirveComoVerso()`, que descarta 10 más (corpus 2913). Recontado el 2026-09-11 por el hilo
principal.

**Los conteos van por línea distinta además de por ocurrencia, y con la regex a la vista.**
Si no, no son reproducibles — que es exactamente lo que `IDEA-11` ya pidió por escrito.

| Palabra | Ocurrencias | Líneas distintas | Temas | Nota |
|---|---|---|---|---|
| `agua` | 1 | 1 | 1 | «Gualicho»: "son como agua bendita" |
| `mar` | 1 | 1 | 1 | «Blues de la libertad»: "Es mar gruesa y oscuridad" |
| `hielo` | 1 | 1 | 1 | «Tarea fina» |
| `brasa(s)` | 2 | 2 | 2 | «Tarea fina», «Juguetes perdidos» |
| `helado` | 0 | — | — | — |
| `suelto` | 0 | — | — | — |
| `atado` | 1 | 1 | 1 | «Un ángel para tu soledad»: "Atado con doble cordel" |
| `fuego(s)` | 33 | 13 | 9 | 4 líneas distintas son «Roto y mal parado» |
| `diamantes` | 1 | 1 | 1 | «Buenas noticias» |
| `molinete(s)` | 0 | — | — | palabra del proyecto (`D-14`), no de la banda |
| `sol` | 24 | 19 | 9 | casi todas el **acorde** Sol, no el sol |

**Tres números de la primera ronda eran falsos, y el mecanismo del error es lo reutilizable.**
Se reportó "MAR 7 / 6 / 6": la regex contaba substrings y se comía *maravilla*, *marines*,
*marea*, *martirio*, *marfiles*, *mariposa*, *Martín*, *María*. Ojo con esto, porque el
`\b` de JavaScript es ASCII: `\bmar\b` **sí** matchea "María", porque la `í` no es carácter
de palabra para el motor. Lo mismo pasaba con LUZ, inflada de 28 a 37 por el acorde `SOl`.
Un conteo publicado con siete veces el valor real es, en este proyecto, el defecto que no se
perdona, aunque la dirección de la lectura no cambie.

**Las familias amplias no son reproducibles y no se citan hasta rehacerlas.** La primera
ronda reportó INFIERNO-CIELO 69/51/30, OSCURIDAD 49/35/23, PRESO-SUELTO 40/32/18, LUZ
37/30/22, FUEGO 71 (sin líneas distintas), AGUA 27 (sin líneas distintas). La refutación
recontó OSCURIDAD en 51/37/24, LUZ en 28, la familia FUEGO en 67/24/14 —y sin «Roto y mal
parado», 23/19/13— y mostró que la columna "líneas distintas" estaba en blanco justo para
las dos familias que la ficha descartaba. Ninguna familia declaró su lista de palabras. **El
orden de magnitud se sostiene; los números puntuales no se citan en ningún documento hasta
que alguien los rehaga con la regex declarada al lado.**

**El límite duro de todos los pares, y es lo que más caro sale si no queda escrito.** En los
105 títulos de `RES-20` y en los 2913 versos **no hay un solo título ni un solo verso que
asocie a Skay con un elemento ni a Poli con otro**. "skay" aparece dos veces en líneas
tipadas `letra` y las dos son notas del transcriptor sobre cómo toca la guitarra; "poli"
solo dentro de "político" y "polizón". `BR-15` pide ancla verificada, y el ancla existe para
**el elemento**, no para **la persona**. Quién es inmune a qué es criterio del sitio y se
declara como criterio del sitio. Una pantalla que diga "Skayboy es inmune a X **porque** Y"
está inventando el porqué, y eso cae bajo lo único que `CLAUDE.md` declara estricto.

**Los cuatro pares candidatos, con su respaldo real.**

- **A — fuego / agua** (el del juego de origen). Ancla de fuego: «Fuegos de octubre»
  (*Oktubre* 1986, pista 1), **que no tiene letra transcripta en el repo**. Ancla de agua:
  «Nuotatori professionisti» (*Luzbelito* 1996, pista 5), "Cuando la marea los quiere tapar
  en el corazón de la noche" — el mismo tema trae "Como lenguas de fuego que arrastran", así
  que el par no está separado ni ahí. **El argumento que lo voltea no es el fuego, es el
  agua: una ocurrencia en todo el catálogo.**
- **B — brasas / hielo.** Un solo verso con los dos opuestos juntos, escrito por ellos:
  «Tarea fina» (*La mosca y la sopa* 1991, pista 6), "Que echa hielo y brasas en mi
  corazón", y "Soplando brasas en tu cora__zón" en «Juguetes perdidos». **Pero son 3
  ocurrencias en 2 temas.** La primera ronda descartó A por flaco y recomendó B, que es más
  flaco todavía. Una vara o la otra, no una por candidato.
- **C — luz / oscuridad.** El único que aguanta la medición independiente, y el ancla está
  en el tema más conocido: «Ji ji ji» (*Oktubre* 1986, pista 7) está construido sobre eso —
  "En blanca noche", "Y no prendas la luz", "Los ojos ciegos bien abiertos", "Vas en la
  oscura". Cierra en «Juguetes perdidos»: "Cuando la noche es más oscura / Se viene el día
  en tu cora__zón". **Como terreno letal sería ilegible** —nadie distingue de un vistazo un
  charco de sombra de un charco de noche en un teléfono—, así que rinde como clima del
  nivel, no como piso que mata.
- **D — atado / suelto.** El único par de opuestos que la banda declaró ella misma: *Lobo
  suelto, cordero atado*, álbum doble del 4-oct-1993, dos volúmenes el mismo día, dos tapas
  opuestas, Lupus el Lobo y Rulo el Cordero. **En las letras no vive:** `suelto` 0, `atado`
  1. Vive en la tapa y el título. Eso no lo descalifica, pero cambia el trabajo: es diseño
  de niveles y arte de tapa, no cita de versos.
- **El candidato que nadie propuso, y que la propia medición corona: cielo / infierno.** Es
  la familia más alta del catálogo, tiene dos títulos («El infierno está encantador esta
  noche», *Gulp!* #10; «Yo no me caí del cielo», *Gulp!* #6) más «Cruz diablo!» y «Un ángel
  para tu soledad», y **arriba/abajo es la geometría nativa de un plataformas**. No exige
  distinguir dos tintas de terreno a la primera.

**Títulos con elemento o par opuesto: la lista de 18 está bien verificada uno por uno contra
`leerTemas()` sobre `INV-20`, pero no es completa.** Faltan, por orden de importancia:
«Vencedores vencidos» (*Un baión para el ojo idiota* 1988, #5) — un par de opuestos entero
dentro de un título, el caso más directo del catálogo; «Nuestro amo juega al esclavo»
(*¡Bang! ¡Bang!…* 1989, #9) — amo/esclavo, y encima sobre roles que se invierten; «Rato
molhado» (*Momo Sampler* 2000, #11) — portugués, "mojado", el elemento agua en un título.
Menores: «Caña seca y un membrillo», «Esa estrella era mi lujo», «Estás frito angelito», y
el propio «Luzbelito».

**Escenario, coleccionable y puerta ya tienen verso propio.** El galpón: «Templo de Momo»
(*Momo Sampler* 2000, #1), "Un galpon de luz, es el templo del momo". El tesoro: «Juguetes
perdidos» (*Luzbelito* 1996, #11), "Y un par de sienes ardientes / Que son todo el tesoro".
La puerta, con el guardia adentro, que es la figura que `D-14` invierte: «Queso ruso» (*La
mosca y la sopa* 1991, #10), "que cuidan por vos las puertas del nuevo cielo". Y la casa ya
tiene su idioma para el nivel: `UX-22`, "el sitio no se dibuja, se imprime" — la plancha de
serigrafía y los dos elementos como las dos tintas de la pasada.

**Antes de que cualquiera de esos versos llegue a una pantalla hace falta una regla de
transcripción declarada.** El corpus trae "Su llave arrojo" sin tilde y "cora__zón" /
"sole__dad" con artefacto de la fuente en seis renglones. Pegar lo corregido es publicar una
enmienda silenciosa de la fuente; pegar el original es publicar el error de tipeo del
transcriptor. Alguien tiene que decidir cuál, y firmarlo.

**Huecos de letra medidos con `sirveComoVerso()`:** ocho temas de los 105 sin letra
utilizable — «Sushi» (el único ausente del JSON), «Pianito - Jam» y «Capricho Magyar»
(instrumentales), «Soga de Caín» y «San Telmo» (solo tablatura), «Pogo» (1 verso),
«Invocación» (1 línea distinta, "¡Lobo!"), y «Fuegos de octubre», que declara contenido
"letra" y cuyas 8 líneas distintas son ruido de cifra. En el borde: «Drogocop» (7) y «Una
piba con la remera de Greenpeace» (8, de las cuales 4 son leyenda de tablatura). Dos de esos
huecos le pegan justo a candidatos de este juego: «Fuegos de octubre» ancla el fuego y
«Invocación» es el tema que más aporta a la familia del lobo.

**Suciedad residual y el proceso que ya existe:** entre 59 renglones de cifrado puro
(criterio conservador) y 151 contando los de un solo token, sobre 2913 — entre 2% y 5%. No
hace falta decidir si se limpia: **ya está decidido**. `src/data/cancionero-notas.json`
registra los renglones despegados por `src/lib/cancionero/taller.ts` y
`src/data/cancionero-cuarentena.json` los temas apartados por `D-13`. Lo que falta es otra
pasada del proceso, y le pega a `US-03` más que a este juego.

**El nombre, medido:** "Skayboy" y "Poligirl" no son títulos; "boy" y "girl" dan 0 en los
105 títulos y en los versos. El chiste del nombre es nuestro, no de la banda — a diferencia
de «Toxi-Taxi» (`IDEA-03`), donde el chiste se arma solo. **Pero hay precedente de que un
videojuego entre al vocabulario del catálogo:** «Un Pacman en el Savoy», *¡Bang! ¡Bang!…
Estás liquidado* (1989), pista 4.

**Y el riesgo sobre personas reales, medido adentro del repo.** Los artículos
`skay-beilinson` y `la-negra-poli` existen en `src/data/redondopedia.json` como tipo
`persona`, y **ninguno de los dos está en `SLUGS_GRAVES`** (que tiene tres: la muerte del
Indio, Walter Bulacio, Olavarría 2017). O sea que el sitio ya decidió que no son material de
registro 3. Y el artículo de Poli publica, **rotulado hecho**: *"No una colaboradora ni una
acompañante: un pilar, con el mismo rango que la voz y la guitarra"*. Consecuencia dura para
el diseño: **Poligirl no puede ser la compañera de Skayboy.** Si el juego le da menos
habilidades, menos pantalla o el rol de apoyo, contradice lo que el propio sitio publicó
como hecho sobre una persona viva. Paridad mecánica exacta o el par no cierra. Con una
corrección de redacción: el artículo dice, y `RES-09` dice, que los tres socios tienen
**partes iguales del nombre del grupo** — no escribir "dos tercios de la titularidad", que
es una compresión de dos cosas distintas (marca y obra).

---

## Medición sobre el repo — contra qué reglas choca este juego

**Lo que está bloqueado de verdad, y ninguna de las dos cosas es de derechos.**

1. **La licencia del motor** (`BR-15` consecuencia 1). Era el único chequeo previo, y este
   dossier lo hace: `RES-62` trae tres candidatos con el archivo `LICENSE` leído crudo. Lo
   que sigue faltando no es una ficha, es que `producto` y `experiencia` **nombren un
   candidato** — sin candidato no hay nada que fichar, y con candidato el chequeo es leer un
   archivo, no abrir un frente.
2. **El criterio 2 del BRIEF, que el propio BRIEF declara bloqueante** ("si uno se rompe,
   bloquea todo lo demás"): *"Jugable con el pulgar. Una mano, parado, en movimiento. Nada
   de precisión fina"*, con `--toque-min: 48px` (40 usos en las cuatro hojas) y un test
   propio en `estilos.test.ts`. Un plataformas de timing pega de frente. **Tiene salida
   escrita, y es el precedente de `IDEA-04`:** en
   `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md` los controles táctiles
   ya están inclinados a "un solo botón de salto con avance automático". El camino es cambiar
   el verbo hasta que el control sea un botón.

**Lo que NO está bloqueado y la primera ronda dio por bloqueado.** El co-op: *Fireboy &
Watergirl* es, desde 2009, un juego de **un teclado en la misma máquina**, y su FAQ dice que
se juega solo alternando (`RES-65.1`). Así que "multijugador en tiempo real" y "backend",
que están en Fuera de alcance, **no se tocan**. La pregunta que hay que hacerle al usuario
no es "un aparato o dos": es "un pulgar maneja a los dos, o se alternan".

**El movimiento: `D-32` no dejó un hueco, decide en contra — y ya tiene excepción.** Su
letra es *"nada se mueve para llamar la atención sobre sí mismo; lo que se mueve es la
cámara"*, y su último bullet deja fuera un **tránsito** de pantalla puntual, no la doctrina
adentro de la partida. Sus límites dicen "400 ms el paso más largo — y 200 ms el cruce entre
pantallas", así que los 200 ms son `--duracion-paso`, el cruce, no el techo general. Y
convive desde antes con `--duracion-vuelo: 17s`, la mosca, comentada en `tokens.css` como
"lo unico vivo del sitio". **`D-33` ya es la excepción declarada y ejercida** (el acierto,
≤400 ms por pasada, ≤1200 ms la secuencia). O sea: el conflicto no es doctrinal, es de
trámite — hace falta una decisión escrita que extienda la excepción al movimiento de
partida, con techo propio, como hizo `D-33` con el acierto. No se interpreta: se escribe.

**El audio: hoy el juego nace prohibido, no indeciso.** `ADR-07.2` dice *"Una pantalla de
juego no pone temas. Ninguna. Sin excepción, y sin discutir juego por juego si su respuesta
es soplable"*, y **`D-37` punto 4 lo repite como decisión, no como criterio de un ADR**. Son
**siete** rutas declaradas `cama`, no ocho: `/quiz/` más las seis de `src/pages/juegos/`
(`adivinar-el-tema`, `adivinar-la-tapa`, `adivinar-por-la-letra`, `completar-la-letra`,
`dos-ejes`, `ponelos-en-fila`) — el comentario de `rutas-sonoras.test.ts` dice "las ocho
pantallas donde se juega" y su propio array tiene siete. Una ruta nueva **nace muda sola**,
porque `modoEnRuta()` devuelve `cama` por defecto. Y el argumento de que "este es el primer
juego donde el fundamento no aplica" **es falso**: `dos-ejes` ya figura en la tabla del
propio `ADR-07.2` como "sin respuesta correcta · nada que soplar" y se le puso `cama` igual.
Es el tercero de esa clase, no el primero. Levantarlo no es una enmienda de `arquitectura`:
es una `D-XX` del usuario, contra `D-37`. Y esto importa porque **la mitad del pedido
original de `BR-15` era "un skin y música redonda"**.

**Los auditores con lista a mano, que es el hueco silencioso.** Ninguno rompe el build si
alguien no los extiende:

- `MODULOS` de `src/lib/voz.test.ts`: **ocho entradas** (sitio, quiz, tema, letra, tapa,
  por-la-letra, correccion, ponelos) y **nueve** módulos de copy importados —
  `dos-ejes/copy.ts` está fuera del barrido ahora mismo, y se audita por un recolector
  aparte sobre su JSON. Un `src/lib/skayboy/copy.ts` que nadie agregue pasa el build con
  anglicismos y botones en infinitivo adentro. Ya pasó dos veces: "Link copiado" estuvo tres
  ciclos en producción.
- Los bloques por juego de `estilos.test.ts`: hay cuatro (`JS`, `JS_TEMA`, `JS_LETRA`,
  `JS_PONELOS`) para **siete** islas. `partida-letra.ts`, `partida-tapa.ts` y
  `partida-dos-ejes.ts` no tienen el par de tests recíprocos: `FIND-15` ya se está
  repitiendo en silencio.
- El array literal de `esquemas.test.ts`: `['quiz','letra','tapa','cancionero','popularidad','dos-ejes','por-la-letra']`.
- `ANIMACIONES` de `movimiento.test.ts`: 11 entradas cerradas, con su mecanismo de apagado.
- `RUTAS_DE_JUEGO` y la lista de h1 grandes de `voz.test.ts`, que enumera cada título por
  nombre — los títulos de casete entran solos vía `sitio.JUEGOS`, el h1 no.

**El agujero de auditoría más barato no es el canvas: es una hoja de CSS nueva.**
`movimiento.test.ts` escanea `tokens.css`, `juego.css`, `sitio.css` y `cancionero.css`, y
`estilos.test.ts` repite esos mismos literales. Un `src/styles/skayboy.css` se escapa de
**los dos** sin tocar canvas: sin chequeo de `@keyframes`, sin tiempos ni curvas sueltas,
sin 999px, sin barra lateral. Y el canvas sigue siendo un hueco real: los dos auditores
miran CSS, no JavaScript, y **no hay un solo `matchMedia('prefers-reduced-motion')` en JS de
cliente**, así que un bucle de `requestAnimationFrame` ni se audita ni se apaga.

**`D-19` y la paleta: no es el callejón sin salida que parecía.** La premisa "un juego, un
disco propio" ya la desmiente el repo dos veces: `la-mosca-y-la-sopa` viste dos lugares a la
vez (el juego de letras y el cancionero), y `luzbelito` viste `dos-ejes` **sin ser variante
de casete** (no está en la unión del `interface Casete`, vive solo como bloque de
`juego.css`). Lo que sí es cierto: **Un baión no está libre** — ya tinta la sección del
cancionero (`juego.css:538`) y un pie (`sitio.css:1370`), y es el ancla de `IDEA-02`
(«Masacre en el puticlub» es el tema 1 de ese disco). Y su supuesto choque con
`--rotulo-testimonio` no es una colisión de hex: `#579ec5` contra `#6fc7ff` son dos celestes
distintos, y el "choca" es un juicio escrito en un comentario de `sitio/copy.ts`. Cordero
atado sí comparte hex exacto con Lobo suelto (`#f28b16`). El mapa sección→disco es de
`experiencia` (`UX-04`).

**El arte: la regla operativa no es `D-18`.** `D-18` trata de retirar los equivalentes
tipográficos y muestrear las paletas reales, y acota el uso de la letra reconstruida a los
títulos. Lo que gobierna un juego de tiles hechos con recortes de tapa es el README de
`public/arte/`: *"piezas sueltas, nunca la composición entera de una tapa"*, *"PNG con fondo
transparente, borde tipo tijera (irregular, con grano — nunca vector liso)"* — y una
prohibición que en un juego de dos personajes es lo primero a lo que va a ir la mano:
**"Prohibido usar el par lobo/cordero como código de acierto/error"**.

**Estado de la ráfaga, para no pisar a nadie.** El ciclo 14 está **en vuelo**, con archivos
modificados y sin trackear en el árbol —`rocola.ts`, `pua.ts`, `rutas-sonoras.ts` y sus
tests, `ARQ-rocola.md`, `UX-24`/`25`/`26`, `CNT-16`, `public/audio/temas/`— y `npm test` en
**574/574** verde. Es trabajo ajeno sin commitear: se guarda tal cual antes de empezar nada
encima. Este dossier midió sobre ese árbol en movimiento, y por eso mismo la primera ronda
no vio `D-37`, que se escribió el mismo día.

**Y la pregunta de una línea que va antes que todo lo demás, y que nadie hizo:** ¿esto es
`IDEA-04` con otros personajes, o un segundo plataformas? En
`Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md` este proyecto ya tiene un
plataformas con meta (colgarse del bondi que ya arranca), tema («Gualicho», pista 4 de
*Último bondi*), verbo, paleta muestreada y controles resueltos. Adentro de ese archivo está
el precedente escrito: *"no abrí `IDEA-12`. Un ID nuevo para la misma idea es exactamente lo
que `Docs/IDS.md` está para evitar"*. Si la respuesta es "es el mismo", media recomendación
de este dossier se cae sola.

---

## Medición sobre el repo — qué cuesta construir la pieza

**El molde firme son cinco archivos, más un origen de datos.** (a) la página
`src/pages/juegos/<juego>.astro`; (b) la isla `src/scripts/partida-<juego>.ts`; (c) el copy
`src/lib/<juego>/copy.ts`; (d) la lógica pura `src/lib/<juego>/*.ts`; (e) su test al lado.
El origen de datos tiene **dos formas ya transitadas**: JSON propio más schema propio (quiz,
letra, tapa, dos-ejes, por-la-letra) o derivado en build de un JSON que ya existe (ponelos,
que **no tiene** ni `src/data/ponelos.json` ni schema, y arma su catálogo en el frontmatter
desde `lib/letra/temas.ts` y `lib/cancionero/banco.ts`). «Adiviná el tema» tiene JSON sin
schema. **Para un plataformas solo sirve la primera forma: un nivel no se deriva de nada.**

**La página es un cascarón mudo.** `adivinar-la-tapa.astro` son 114 líneas: frontmatter que
importa `tokens.css` + `juego.css` + `sitio.css`, `Cabeza.astro`, `PieImprenta.astro`, el
copy y el JSON; `<main id="app">` con tres `<section class="pantalla sobre-tapa">`
(`#portada` visible, `#partida` y `#resultado` con `hidden`); el banco viajando como
`<script type="application/json">`; y dos `<script>` sueltos, uno que importa la isla y otro
que importa `cinta.ts`. **Dos piezas del molde que hay que calcar y que es fácil perder:**
`fondoTapa()`/`discosDe()` con el `<div class="tapa-fondo">` y el cálculo de `tapasUsadas`, y
el `<PieImprenta disco="…" tapas={tapasUsadas} />` — es por ahí que se cumple la condición 1
de `D-21`. Y su `<style>` scoped tiene **cuatro** reglas, no tres: `h1`, `.tenue`,
`.pantalla[hidden]` y `.primario` (verificado el 2026-09-11). Sin esa cuarta, la página sale
sin botón.

**Lo que dibuja la isla va en `juego.css`, no en el `<style>` de la página**, y está escrito
en el repo como defecto ya cobrado (`juego.css`, bloque de dos-ejes): *"el estilo de un
`.astro` tiene alcance y no llega a lo que crea el JavaScript"*.

**Lo que rompe el build si falta:** el censo de `rutas-sonoras.ts` (declarar la página en
`PAGINAS_DECLARADAS`, y la fila correspondiente en el mapa `ejemplo` del test —
`RUTAS_DE_JUEGO` en cambio **no** se compara contra el disco y olvidarlo no pone nada en
rojo); `islas.test.ts`; las reglas globales de `estilos.test.ts` (hex suelto, pastilla
999px, barra lateral fuera de la excepción, velo de tapa, imagen de fondo en línea);
`ANIMACIONES` de `movimiento.test.ts`; y el veto por nombre a `ClientRouter`,
`astro:transitions`, `astro:page-load`, `transition:persist` y `startViewTransition`, que es
un filtro barato para descartar temprano un motor que quiera ser SPA.

**El guardián de islas protege menos de lo que parece.** `islas.test.ts` recorre el grafo
desde `src/scripts/` contando solo importaciones **relativas** de valor y busca
`from 'node:…'`. No mira adentro de `node_modules` —su comentario dice textual que *"un
paquete de node_modules es problema del empaquetador, y este proyecto no tiene ninguno del
lado del cliente"*—, no agarra `fs` o `path` sin el prefijo `node:`, ni `require()`, ni
`import()` dinámico, y salta en silencio cualquier ruta que no resuelva. Adoptar un motor
invalida su premisa.

**Lo que se reusa tal cual y no hay que dibujar de nuevo:** el cascarón (`body > main`,
`max-width: 34rem`, el pie por flex del body), `.cabecera`, `.primario`, `.secundario`,
`.opcion`/`.opciones` con su rejilla a partir de 24rem, `.feedback.ok`/`.no` con símbolo
además de color, `.insignia--leyenda`/`--testimonio`, `.micro`, `.explicacion`, el bloque de
`:hover`, el foco `:focus-visible` con `--acento-2`, el grano y el rodillo (SVG embebidos sin
color propio), `Cabeza.astro` y `PieImprenta.astro`.

**Tokens (`tokens.css`, 478 líneas, único lugar del repo donde vive un hex):** los `--cat-*`
de `D-19` y `--marca-rojo`; diez pares `--disco-<slug>-tinta`/`-apoyo`, con la regla de que
`-tinta` lleva texto y pasa AA y `-apoyo` es borde y relleno y nunca texto; `--toque-min`
48px (40 usos), `--espacio-1/2/3/4`, `--radio` 4px, `--linea` 3px. **Hay cinco `@font-face`
y solo cuatro variables que las usen:** `'Redonditos Fan'` (`/fuentes/redonditos.woff`,
línea 32) está cargada en todas las páginas y no tiene ningún `--fuente-*` que la nombre
(verificado el 2026-09-11). O es deuda que se borra, o es justo la letra del juego nuevo.
Cualquiera de las dos es una decisión que hoy no está tomada.

**El arte es el costo real, y antes de contarlo hay que declarar el formato.** `public/arte/`
tiene **13 piezas** más el README, 268 KB, y **cero sprites**: son recortes de collage de
400-800 px del lado largo, PNG con alfa y borde rasgado, y cinco de las trece son SVG
declarados como dibujo de reemplazo. Un ciclo de caminata a 32 px pide lo contrario de lo que
el README manda ("nunca vector liso"), y el borde rasgado se vuelve ruido ilegible a ese
tamaño. **La cuenta de 42 piezas para un solo nivel jugable** —7 por personaje, 5 de
tileset, 6 de charcos animados a dos cuadros, 4 de salidas, 3 de coleccionables, 5 de
mecanismos, 3 de mandos de pulgar, casete y fondo— **es una cuenta con criterio, no una
medición**, y no incluye los niveles dos en adelante. Pero el problema anterior no es la
cantidad: es que el formato declarado del proyecto y el que un plataformas necesita son
incompatibles por escrito hasta que `experiencia` declare una convención nueva y la agregue
al README, que es donde vive el contrato del arte.

**El peso no es el problema, y el número que hay que rehacer es otro.** `dist/` pesa 13 MB en
476 archivos (audio 7,5 MB, letras-y-acordes 1,9 MB de HTML, tapas 1,4 MB), y el sitio entero
descarga **113 KB de JavaScript** sin comprimir en 27 archivos, con la isla más grande en
24,2 KB. **Pero ese `dist/` es del 3 de septiembre** y no tiene adentro las ~2.000 líneas de
cliente del ciclo 14 que entran por `cinta.ts`, que importa cada página de juego: antes de
comparar el tamaño de un motor contra esa vara hay que correr `npm run build` de nuevo.
Contra Vercel Hobby (1M edge requests/mes, 100 GB de transferencia, `RES-15`; y `RES-50`, que
dice que para el despliegue por git no hay número oficial de tamaño y que ~180 MB no molestan)
el arte de un plataformas es despreciable: lo que aprieta son los temas enteros que `D-22`
habilitó.

**Tres cosas que la receta no nombra y van a aparecer el día que fallen.** Una:
`npm run check` es `astro check && tsc --noEmit`, así que un paquete sin tipos obliga a
escribir un `.d.ts` propio o a aflojar el `tsconfig`, y aflojarlo es un cambio global sobre
los 45 archivos de test. Dos: **el contraste sobre una superficie dibujada**.
`contraste.test.ts` mide pares texto/fondo leyendo el CSS de verdad; en un plataformas el
fondo del puntaje o del aviso es el tileset, que cambia píxel a píxel. No hay par testeable,
y hace falta un mecanismo —como el velo plano que `D-21` inventó para las tapas—, no una
excepción. Tres: **el teclado**, que es como se juega el género original, es gratis en
escritorio, no cuesta una sola pieza de arte, y no está en ninguna receta.

**La verificación, que `D-12` deja en manos de quien pueda correrla:** `npm test` (45
archivos, 574 pruebas, ~16-19 s), `npm run check`, `npm run build`, y abrir la página en un
navegador — `islas.test.ts` existe porque un juego entero se murió con los tres comandos en
verde.

**Y el orden que conviene, que no es empezar por el motor:** un solo personaje quieto y un
tile, dibujados a mano, puestos en pantalla dentro del cascarón, sin motor y sin física. Ese
experimento no necesita licencia, ni música, ni paleta, ni excepción a `D-32`, y contesta la
única pregunta que ninguna ficha puede contestar: si esa pantalla se ve como este sitio. Si
se ve como cualquier plataformas de plantilla, el motor no lo va a arreglar, y se gastó un
día en vez de un ciclo.

---

## Dato al costado, para quien mantiene `RES-09`

`RES-09` (`INV-02-banda-cultura-estetica.md`) fija como **verificado** el reparto de Erks
S.A. y las partes iguales del nombre, citando el mismo artículo de Infobae del 8-jun-2026
que `RES-64.12` acaba de bajar a "reportado — fuente única". Y el artículo `la-negra-poli`
de `src/data/redondopedia.json` publica ese dato **rotulado `hecho`**, con fuente `RES-09`,
en el resumen, en dos fichas de datos y en el cuerpo ("Un tercio para la voz, un tercio para
la guitarra, un tercio para ella"). No es un dato que el sitio muestre como respuesta
correcta de ninguna pregunta, así que no dispara lo único que `CLAUDE.md` declara estricto —
pero es un rótulo `hecho` sobre la propiedad de dos personas vivas apoyado en una sola
investigación periodística replicada. Alguien tiene que decidir si se contrasta contra el
padrón público del INPI o si se afloja el rótulo. No es de este frente.

---

## Sin resolver

- **Cuál clon se prueba primero, y si este es `IDEA-04` con otros personajes.** `producto` ya
  escribió que `IDEA-07` (Pacman) es "el que menos arriesga" para probar `BR-15` de punta a
  punta, y `IDEA-04` ya es un plataformas con meta, tema, verbo y paleta. La pregunta va
  antes que cualquier otra cosa de este dossier.
- **Si el co-op es de un pulgar alternando o de dos manos.** No lo contesta el repo ni las
  fuentes: lo contesta el usuario, y cambia el diseño entero.
- **El horizontal.** `RES-65.10` lo dejó abierto con precedente de género a favor; nadie lo
  evaluó contra `--toque-min` ni contra la zona de pulgar. Es de `experiencia`.
- **Duración de un nivel para un jugador no experto.** Dos versiones sin cerrar: la primera
  ronda no encontró fuente y solo tiene la meta de rango A (30-45 s en *Light Temple*, que
  no sirve de proxy); una refutación reportó "uno a tres minutos" citando el FAQ del juego y
  su ficha del App Store, que son páginas descriptivas, no una medición. No se promedia.
- **Modelo y año de la Gibson SG:** 1968 con vibrato Maestro contra SG Standard 1970.
  Contradicción abierta (`RES-64.5`). "SG roja" sí es hecho.
- **Fecha de nacimiento de Carmen Castro y el casamiento de 2023:** los dos salen de
  Wikipedia y nada más. Si algún día uno de esos datos es respuesta correcta de un quiz,
  hace falta otra fuente; hoy no lo es.
- **Registro de marca de "Fireboy and Watergirl" en INPI Argentina o EUIPO:** no se buscó. No
  cambia la recomendación porque el proyecto no usa ese nombre, pero queda abierto.
- **Si el copyright de código y arte de *Fireboy & Watergirl* está registrado ante el US
  Copyright Office** (distinto del trademark): no cambia la protección, que es automática,
  pero sí la facilidad de litigar daños estatutarios en EE.UU.
- **Jurisprudencia argentina sobre el art. 71 inc. c aplicado a un videojuego o a un
  personaje con nombre real:** no se encontró. Lo más cercano llega vía nota de doctrina, no
  vía fuente judicial (`RES-64.19`). Y dos PDF de doctrina que habrían cerrado `RES-64.20`
  (Villalba Díaz por la SCBA, y el de la Municipalidad de Merlo) vuelven binarios por
  WebFetch.
- **El padrón del INPI para Erks S.A.** (`RES-64.12` y el dato al costado sobre `RES-09`).
- **La versión `latest` real de melonJS** (`RES-62.12`): cinco fuentes, cinco números. Si
  alguna vez se reconsidera, correr `npm view melonjs version` directo.
- **Tamaño real de un build recortado** de Phaser v4 con su custom-build, o mínimo de Kaplay
  y LittleJS con solo los módulos de este juego. Los números publicados son de import
  completo.
- **Código de terceros vendorizado adentro de los paquetes de motor**, con licencia propia:
  `BR-15` dice que se chequea "la licencia del motor", y eso debería incluir lo que el motor
  trae adentro, no solo el `LICENSE` de la raíz. No se miró.
- **Licencia de los assets de demo** que traen LittleJS y Kaplay: el motor es MIT, el arte de
  ejemplo puede no serlo. Irrelevante si todo se viste con arte propio, relevante si alguien
  copia un ejemplo tal cual como punto de partida.
- **Si alguno de los motores usa `eval()` o `new Function()`** de forma que choque con una
  CSP estricta en Vercel, y si corren sin fricción dentro de una isla de Astro con salida
  estática (Vite/ESM). Es de `arquitectura`, y condiciona si la recomendación de motor es
  viable en la práctica.
- **Cómo se audita el anti-slop adentro de un `<canvas>`.** Los dos auditores del repo miran
  CSS; ahí adentro no hay vara corrible y hoy no hay regla escrita que la reemplace.
- **Si el juego suena.** `ADR-07.2` y `D-37` punto 4 lo prohíben hoy para toda pantalla de
  juego. Falta una `D-XX` del usuario, no una enmienda de `arquitectura`.
- **Qué registro rige la muerte del avatar.** Un plataformas mata al jugador seguido; el
  sitio ya obliga a registro 3 para Bulacio, Olavarría y la muerte del Indio. Nadie preguntó
  qué registro rige la muerte repetida del muñeco de alguien que está vivo, ni si conviene
  que el fracaso sea otra cosa que muerte.
- **Si un plataformas difícil cierra un molinete.** `D-14`, `D-08` y `D-09` nombran cuenta,
  login, Premium y "saber lo suficiente", y `UX-07` ya escribió que "alguien con motricidad
  reducida tiene que poder acertarlo igual que cualquier botón grande". Lo que **no** tiene
  doctrina es la **presión de tiempo** y la **entrada sostenida**: un `--toque-min` de 48 px
  no dice nada de un control que se mantiene apretado.
- **La traducción de «Nuotatori professionisti»** (italiano, "nadadores profesionales") la
  puso quien relevó, sin fuente citada. Si se usa como ancla en un documento, que la fiche
  `investigador`.
- **Las familias de palabras del cancionero:** ninguna declaró su regex, así que los conteos
  amplios no son reproducibles y no se citan hasta rehacerlos por línea distinta y con la
  lista al lado.
- **La pregunta que no la contesta ninguna ficha y va a decidir esto más que la ley:** qué se
  siente al ver a dos personas vivas convertidas en muñecos. Esa la contesta el usuario.