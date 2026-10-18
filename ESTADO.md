# ESTADO — RicotaArcade

> **Lo único que sobrevive al reinicio de contexto.** Se actualiza al final de cada
> sesión. Si esto y el disco no coinciden, manda el disco: corregí este archivo.
>
> Regla: un estado **nunca baja por inferencia**. Solo el usuario degrada un estado.

**Última actualización:** 2026-10-18

> ## 🎨 LOS SEIS ENTORNOS, CADA UNO EN SU TAPA (2026-10-18) — décima enmienda de `D-73`
>
> **En `main` desde el PR #57 (rama `bestiario/fondos-rocambole`), fusión `46d36d1`.** Pedido del
> usuario: *"Armá un fondo bien rocambole para cada uno de los entornos del bestiario redondo"*, con el camino
> scrolleable en mente.
>
> - **Cierra `T-443`**: el galpón (*En directo*), el árbol del gran bonete (*Luzbelito*), Cybersiberia (*Último
>   bondi*, con nieve), los astilleros (*Cordero atado*, disco 2), la mesa (*La mosca y la sopa*, con la mosca
>   pintada: `T-442`) y la ruta (el surco del disco, con los cuatro fierros que pasan) son recintos de noche a
>   aerógrafo, con los colores medidos en las tapas. La prisión la hizo la rama de la drácula.
> - **Mejorados**: el infierno tiene piso de damero de salón de baile; el templo, serpentinas y papel picado.
> - **Listos para el camino**: cada capa es `(ancho, alto)`, los hitos en el piso, la geometría en
>   `rig-entornos.ts`, y `luzQueAsoma` para anunciar cada región desde la vecina.
> - **Verde:** `npm test` (1687), `npm run check`, `npm run build`. Visto en el navegador del panel a 375 y 800 px, y con la
>   carga de a una.
> - **Entró después** del camino (PR #54, enmienda 7), la drácula y la carga de a una (PR #56, enmiendas 8 y 9)
>   y la Redondopedia de noche (PR #55, `D-75`). Las escenas nuevas pasan por `enEspera` como las demás: se arman
>   cuando el recinto se acerca.

> ## 🌑 LA REDONDOPEDIA DE NOCHE (2026-10-17) — `D-75`
>
> **En `main` desde el PR #55 (rama `diseno/redondopedia-inmersiva`), fusión `b6e9957`.** Pedido
> del usuario: *"Hace una pulida extrema
> de ui/ux a la redondopedia, debe sentirse inmersiva, misteriosa y mistica. Al mismo tiempo debe ser
> facil de leer y que leyendo algo te de ganas de seguir con otra cosa"*.
>
> - **El lugar:** cada artículo trae su tapa velada subiendo desde arriba de la ventana, detrás del
>   título, y se pierde en la tinta antes del cuerpo. Un disco trae la suya; los demás, la de su
>   categoría; los tres graves, nada. Pasar de un artículo a otro corre la cámara de una tapa a la otra
>   (el nombre `lugar` de `ADR-03`, sin sumar uno). La portada usa la misma capa con *Gulp!*.
> - **El título en la letra de la banda** (Redonditos de Ricota Fan), si entra entero, en la tinta de
>   su disco y con sal. *Luzbelito* y Los Decoradores van en la rotulada, *Oktubre* en `--texto` sobre
>   su tapa, y los graves como siempre.
> - **Los hilos del pie:** "Seguí por acá" con tarjetas que traen el gancho, si hay leyenda, quién da
>   testimonio y los minutos; "Pará la oreja", una leyenda de otro artículo con su rótulo (solo las que
>   *se cuentan*, nunca de un grave); y "También anda por", los artículos que lo nombran.
> - **La portada:** una leyenda por noche, la clave de rótulos en tres renglones, los saltos a cada
>   parte, los diez discos con su tapa y su año, y lo leído apagado.
> - **La lectura:** el cuerpo a 17 px. Nada se mueve adentro del cuerpo, y los rótulos no se tocaron.
> - **Verde:** `npm test` (1668), `npm run check` y `npm run build`. Mirado a 375 px y a 1366 px.
> - **En el lienzo** (`T-450`, hecha): hoja 17, "La Redondopedia de noche", versión 20, en la
>   página Aplicación, debajo de la 11.
> - **`UX-39` escrita** (`T-451`, hecha por `experiencia`), con la enmienda de `UX-20` §2. De sus
>   huecos se cerraron A1, A2, A7 y la excepción de `:visited` (en `diseno-marca.md`).
> - **Abierto, sin trabar:** `T-452`, los ganchos, la ronda de la oreja, los "los fans" de la prosa
>   y los ganchos alrededor de los graves (`contenido`, `UX-39` A6); `T-453`, probarlo en un iPhone con
>   los criterios M1 a M7 de `UX-39` §10; que En vivo tome el lugar (`UX-39` A4). La propuesta está en
>   `Docs/SUGERENCIAS/HILO-para-experiencia-y-contenido-d75-la-redondopedia-de-noche.md`.

> ## 🦇 LA DRÁCULA CON TACONES, TALLADA COMO OKTUBRE, Y LA CARGA DE A UNA (2026-10-18) — octava y novena enmiendas de `D-73`, ciclo 24
>
> **En `main` desde el PR #56 (rama `ciclo-24/bestiario`).** Pedido del
> usuario, el mismo de Pierre: *"Agrega otro personaje y pulilo a fondo, se creativo que quede como uno de
> rocambole"*; eligió *"Otro más, encima del #52"*.
>
> - **La prisión de Barbazul es el sexto recinto de noche**: un pasillo de celdas **tallado como la gente de la
>   tapa de *Oktubre*** (`grabado.ts`: la plancha negra, la luz sacada a gubia, motas de prensa). Por la ventana
>   enrejada se ve **la gente de la tapa de verdad**, y sus cinco banderas, recortadas de ahí, flamean afuera.
> - **La drácula con tacones** (*"Preso en mi ciudad"*), tallada en la misma técnica y recortada en trece piezas.
>   Taconea por el pasillo; tocada, **abre la capa como dos puertas de papel** y el forro es el rojo de las
>   banderas. La jaula vacía de la fiera se toca: la puerta chirría.
> - **Verde:** `npm test` (1668, ya con el camino), `npm run check`, `npm run build`. Visto a 375 y 1024 px; la capa abierta, con
>   movimiento reducido simulado (con el panel oculto el navegador frena los cuadros).
> - **Y la carga de a una (`T-445`, novena enmienda de `D-73`)**: cada escena de noche y cada retrato del índice
>   esperan en un `<noscript>` (`carga.ts`) y la isla los arma a una pantalla y media. Al abrir, la página bajaba
>   59 piezas y 1673 kB; ahora, arriba de todo, solo el monte: 10 piezas, 466 kB. Sin JavaScript se ve todo igual.
> - **Abierto:** `T-444` (Barbazul), `T-431`, `T-435`, `T-437`/`T-439` (la mitad que pide un teléfono), `T-443`
>   (seis recintos; la sesión de `bestiario/fondos-rocambole` está con los fondos de esos seis: sus escenas tienen
>   que pasar por `enEspera`).
> - **Al integrar, con el camino ya en `main` (PR #54)**: las dos enmiendas se escribieron como séptima y octava y pasaron
>   a octava y novena. La ficha vive en `FichaBestia.astro`, que comparte el camino: sus retratos esperan solo si la página
>   lo pide (`espera`), y lo pide la del bestiario. `recintoDeLaDracula` toma los ayudantes de `scripts/bestiario/articular.ts`.
>   `bestiario/fondos-rocambole` tenía su enmienda como (9): ahora le toca la (10).

> ## 🌲 EL CAMINO CON CRUCES: EL BESTIARIO SE CAMINA (2026-10-18) — `D-73`, enmienda 7
>
> **Integrada a `main` con el PR #54**, desde la rama `bestiario/camino-con-cruces` sobre `159b1bc`. La fusionó Claude a
> pedido del usuario (*"integra a main"*). Se escribió como novena enmienda de `D-73` y se renumeró a séptima al integrar,
> porque llegó antes que la drácula y la carga de a una (`ciclo-24/bestiario`), que pasan a octava y novena.
> Pedido del usuario: que los entornos estén conectados y sea una aventura scrolleable donde aparecen
> los personajes y se elige con flechas adónde ir. Se investigaron cinco formas y eligió, textual: *"Dale con
> el camino con cruces: una página por región, scroll que camina de costado y flechas en el cruce. Arrancá por el monte
> y la pastura como prueba."*
>
> - **`/redondopedia/bestiario/el-monte/` y `/la-pastura/`**: bajar camina la escena de costado (lejos 0,45, piso 1,
>   frente 1,3; un píxel de bajar es un píxel de caminar). Los ojos se encienden al llegar, el lobo asoma cuando lo
>   tenés cerca y te sigue con la cabeza, y en la pastura el lobo y el cordero viven como en su recinto. Al final, el
>   cruce: un cartel por región vecina con la flecha según el plano redondo; las que todavía no se caminan llevan a
>   su recinto ("EN EL PLANO"). El recinto del monte suma la puerta "Entrá caminando".
> - **Lo que tocó de lo existente:** la lógica del lobo y el cordero pasó a `scripts/bestiario/pastura.ts` (la usan
>   las dos islas), la ficha a `components/bestiario/FichaBestia.astro`, `arte.ts` separa `claroDeLaPastura()`, y la
>   imprenta imprime también `PIEZAS_CAMINO` (cuatro piezas, 567 kB).
> - **Molinetes:** sin JavaScript o con movimiento reducido, la escena es una tira que se corre con el dedo, con todo a
>   la vista y los títeres en pose quieta.
> - **Verde:** `npm test` (1662), `npm run check` y `npm run build`. Probado en el navegador a 390 px y a 1280 px:
>   caminar, el lobo que asoma, tocar al cordero, abrir la ficha, la libreta, ir y volver por el cruce, la vista sin
>   JavaScript y la de movimiento reducido.
> - **Coordinado con la sesión de los fondos** (`bestiario/fondos-rocambole`): arma el arte de seis entornos con
>   funciones `(ancho, alto = 640)` según la especificación del camino, para que cada tramo nuevo las use (`T-470`).
> - **Abierto, sin trabar:** `T-470` (los otros tramos), `T-471` (teléfono de verdad), `T-472` (`experiencia`),
>   `T-473` (el recinto del monte sin JavaScript dibuja los títeres enormes, defecto previo) y `T-474` (lienzo).
> - **`ciclo-24/bestiario` (la drácula y la carga de a una) choca al integrar**: las dos ramas tocan `bestiario.astro` y
>   `scripts/bestiario.ts`, y como esta entró primero, acomoda aquella: la ficha de `FichaBestia.astro` tiene que dibujar los
>   retratos con `enEspera(...)` de `carga.ts`, y el test que cuenta tres `enEspera(` en `bestiario.astro` se ajusta;
>   `recintoDeLaDracula` importa `partes`, `girar`, `parpado`, `hacia` y `suave` de `scripts/bestiario/articular.ts`.

> ## 📼 EL BESTIARIO ENTRA A LA HOME (2026-10-17) — casete B3 del lado B
>
> **En `main` desde el PR #53 (rama `portal/bestiario-en-la-home`).** Pedido del usuario: *"Sumá el bestiario a la home, en
> el lado B, con la voz y el diseño del resto de los casetes"*. Hasta hoy se llegaba solo desde la portada de la
> Redondopedia.
>
> - **El casete**: «Bestiario redondo», B3, después de la Redondopedia. Canta *"El lobo afuera, el cordero atado al
>   palo."*, viste *Lobo suelto* (`mitologia`) con el cordero recortado de *Cordero atado* (la pieza que no usaba
>   nadie, `D-49`), y el sello dice «RECORRÉ».
> - **Un solo lado B**: `LADO_B` en `sitio/copy.ts` lo leen el portal, la carátula de cada juego (que ahora lista el
>   B3) y los tests. En la compu los dos lados van de a tres por renglón.
> - **Verde:** `npm test` (1653), `npm run check`, `npm run build`. Visto a 375, 900 y 1440 px.

> ## 🍾 EL GORDO PIERRE, A PINCEL SECO (2026-10-17) — sexta enmienda de `D-73`, ciclo 23
>
> **En `main` desde el PR #52 (rama `ciclo-23/bestiario`).** Pedido del usuario: *"Agrega otro personaje y pulilo a
> fondo, se creativo que quede como uno de rocambole"*.
>
> - **El bajo inundado es el quinto recinto de noche**: la Esquina del Sol con el agua adentro (`RES-340`), en
>   el crayón de *Un baión* —la pared y el agua son la contratapa misma—. El agua entra por el vidrio roto de la
>   puerta, afuera llueve, y en el escenario quedaron el bafle, el micrófono y el bombo con un sol pintado.
> - **El gordo Pierre**, inventado en la estética de *Gulp!*, su disco: pincel seco y fotocopia (`pincel.ts`),
>   en claroscuro, recortado en papel como un títere de seis piezas. La etiqueta de la botella es el «gulp.» de
>   la contratapa, lo único de él que sale de una tapa. Flota, se empina la botella, y tocado se ríe hasta que
>   tose; se refleja en el agua y le hace ondas.
> - **Pulida**: la isla ya no se lleva el aerógrafo al teléfono (33,6 → 22,1 kB, y un test lo vigila).
> - **Verde:** `npm test`, `npm run check`, `npm run build`. Visto a 375 y 1280 px en el navegador del panel.
>   Falta en un teléfono de verdad (`T-437`, `T-439`): con el panel oculto no se pudieron medir los cuadros.
> - **Abierto:** `T-443` (siete recintos con figuras del plano), `T-442` (la mosca), `T-435` (las tintas nuevas
>   al lienzo), `T-431` (que `contenido` lea la estampa de Pierre).

> ## 🏠 EL SITIO SE MUDÓ A UNA CUENTA HOBBY DE VERCEL (2026-10-17) — `D-74`
>
> Pedido del usuario: liberar la cuenta Pro para otro proyecto. **Hecho y verificado en vivo:** el proyecto
> `arcade-ricotero` vive ahora en otra cuenta de Vercel, equipo Hobby `knesantos`, y despliega `main` desde
> GitHub. `fichinricotero.com.ar` pasó con *Verify & Claim*; NIC sigue delegando a `ns1/ns2.vercel-dns.com`.
> El proyecto viejo del Pro está borrado.
>
> - **Murió `arcade-ricotero.vercel.app`** (404). La dirección de Vercel nueva es `arcade-ricotero-ochre.vercel.app`.
> - **El repo es público desde el 2026-10-17.** Con el repo privado, Vercel Hobby frenó la vista previa del PR #51
>   aunque el commit lo firmaba `knesantos`. En repos públicos no hace ese chequeo. Detalle en `D-74`.
> - **Pendiente del usuario:** borrar el TXT `_vercel`, confirmar Analytics *Enabled* en Hobby y probar un
>   despliegue del otro proyecto del Pro.

> ## 🔧 LA PULIDA DEL BESTIARIO (2026-10-16) — quinta enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Recorrido entero a 375 y 1280 px. El bocadillo ya no se va
> de la pantalla en las escenas anchas; cada escena de noche arranca mirando a su protagonista y avisa que se
> desliza; en la compu entran enteras; las fichas de los cinco de tapa muestran su recorte; el índice sigue el
> orden del recorrido y cada recinto tiene "Volvé al plano". **Verde:** `npm test` (1647), `npm run check`,
> `npm run build`. Pendiente igual que antes: `T-437`/`T-439` (teléfono real, carga diferida de imágenes).

> ## 🕯️ TRES MÁS DE TAPA: EL PERRO, LUZBELITO Y MOMO (2026-10-16) — cuarta enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"Elegí otras 3 bestias y continuá
> haciéndolas"*.
>
> - **El perro de *Un baión*** ("ese perro que sigue allí") entra por el borde del baldío, rayado a crayón, y ladra.
> - **Luzbelito**, la cabeza con la vela de su tapa, en su piedra del infierno; el fuego es la pincelada de *Gulp!*
>   teñida de brasa. La llama titila.
> - **El medallón de Momo** cuelga en su templo, negro y plata, bajo una guirnalda de focos; se mece y gira al tocarlo.
> - Los demás de esos recintos, ojos en lo oscuro. Van cuatro recintos de noche de doce.
> - **Verde:** `npm test` (1646), `npm run check`, `npm run build`. Visto a 375 px con el reloj de reemplazo (panel
>   oculto); los tres responden al toque.
> - **Abierto:** `T-442` (la mosca), `T-443` (los ocho recintos que quedan).

> ## 🐺 EL LOBO Y EL CORDERO SON LAS TAPAS (2026-10-16) — tercera enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"Animados se refiere a que se muevan, no
> estilo cartoon. Deben ser lo más fiel posible al diseño real"*.
>
> - **Recortados de los frentes del disco doble** (`recortes.ts`, `scripts/recortar-bestiario.mjs`), no redibujados:
>   el lobo es el busto de la tapa y acecha asomándose desde lo oscuro detrás de la pastura; el cordero es la
>   criatura entera de su tapa y camina con sus dos patas, atado al palo.
> - **Inventado, en la estética**: el monte, la pastura, el lomo que completa al cordero donde la tapa lo corta, los
>   párpados y los ojos de los demás bichos.
> - **Verde:** `npm test` (1645), `npm run check`, `npm run build`. Visto a 375 px con un reloj de reemplazo (el panel
>   estaba oculto). Falta en un teléfono de verdad (`T-437`, `T-439`).
> - **Abierto:** `T-440` (los demás recintos con este criterio), `T-441` (la cadena del lobo suelta).

> ## 🌑 EL MONTE DE NOCHE, A AERÓGRAFO (2026-10-16) — segunda enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"Que sea el arte más oscuro, no
> tan infantil [...] que se note más que se basa en arte de Rocambole [...] Más espacio."*
>
> - **Técnica nueva**: aerógrafo en SVG (`aerografo.ts`, `arte.ts`) impreso una vez con `sharp` a
>   `public/bestiario/*.webp` (`npm run imprimir-bestiario`, 20 piezas, 272 kB). Sin contornos. El navegador solo
>   mueve las piezas.
> - **El recinto del monte**: de noche, 900 × 640, se recorre de costado en el teléfono. Lobo y cordero
>   redibujados a aerógrafo desde las tapas; los demás bichos son ojos que miran desde lo oscuro.
> - **Verde:** `npm test` (1644), `npm run check`, `npm run build`. Visto a 375 px con un reloj de reemplazo
>   (el panel estaba oculto). Falta en un teléfono de verdad (`T-437`, `T-439`).
> - **Abierto:** `T-438`, los demás recintos con el mismo método; `T-435`, las tintas al lienzo.

> ## 🐑 EL BESTIARIO SE VUELVE ZOOLÓGICO (2026-10-16) — enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"personajes con diseños lindos,
> al estilo rocambole, animados y viviendo en su entorno [...] algo asi como un zoologico"*.
>
> - **El recorrido**: el mapa redondo es el plano de la entrada; abajo, doce recintos en scroll, cada uno con
>   su cartel. Tocar un bicho lo hace reaccionar y decir su verso en un bocadillo; desde ahí, la ficha.
> - **Recinto 1, terminado**: el monte de tiras dentadas en sepia (contratapa de *Lobo suelto*) y la pastura
>   naranja de *Cordero atado*. El lobo y el cordero son títeres por piezas, fieles a las tapas
>   (`titeres.ts`): el lobo ronda la pastura del lado del cordero, el cordero pasta y huye hasta que la soga
>   lo frena, y se lo puede arrastrar sin que salga del círculo.
> - **Los otros once recintos**, con las figuras de la primera vuelta, que respiran y saltan, hasta que les
>   llegue su arte (`T-436`).
> - **Verde:** `npm test` (1643), `npm run check`, `npm run build`. Visto a 375 px. La animación se comprobó
>   con un reloj de reemplazo, porque el panel del navegador estaba oculto: el lobo rodea y el cordero huye
>   con la soga tensa. Falta verla en un teléfono (`T-437`).
> - **Abierto:** `T-435` (las tintas nuevas al lienzo), `T-436` (el arte de los demás recintos), `T-437`.

> ## 🐺 EL BESTIARIO REDONDO (2026-10-16) — `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`); la rama `ciclo-22/bestiario` salió de `fdaea84`.** Se trabajó en un worktree
> (`.claude/worktrees/bestiario`) para no mezclarse con la vuelta de `INV-300`, que sigue sin commitear en la
> carpeta principal. Pedido del usuario: *"Analiza diseña y construi el bestiario redondo. Arma una lista de
> TODOS los personajes que son parte de la mitologia de los redondos [...] que se puede recorrer desde arriba
> y entrar a ver el entorno mas en detalle"*.
>
> - **La página** (`/redondopedia/bestiario/`, puerta en la portada de la Redondopedia): **120 bichos y
>   personajes** sacados de las 104 letras, más Patricio Rey y los buñuelos, que son del mito. Cada uno con el
>   verso exacto de su tema, cotejado a máquina contra `cancionero.json` (`bestiario.test.ts`), su estampa y,
>   cuando hay, lo que se cuenta rotulado.
> - **El mundo redondo**: un mapa circular visto desde arriba, con el galpón de Patricio Rey en el medio, once
>   regiones alrededor y la ruta del último bondi por el borde. La pastura es un claro adentro del monte: el
>   cordero atado al palo y el lobo suelto acechando en el borde. El bajo inundado del gordo Pierre (botella,
>   puerta con el vidrio roto) toca el infierno por las sirenas y el barro. Se toca una región y la cámara baja;
>   de cerca se viaja a la de al lado; cada bestia abre su ficha, suena diez segundos del tema y queda anotada en
>   el teléfono.
> - **El gordo Pierre tiene historia** (`RES-340`, `INV-340`): la noche de lluvia en La Esquina del Sol con la
>   sala inundada y el vidrio de una puerta roto (testimonio del Indio), la versión donde Pierre lo niega
>   (testimonio) y la del dueño del bar (leyenda).
> - **Verde:** `npm test` (1639), `npm run check` y `npm run build`. Visto en el navegador a 375 px y en
>   escritorio: entrar por un rótulo, viajar por "Al lado", abrir una ficha desde el mapa y desde la barra,
>   escuchar, cerrar con Escape, volver al mapa, y la libreta.
> - **Abierto, sin trabar** (`D-73`): `T-431` que `contenido` lea las estampas; `T-432` que `investigador`
>   confirme de primera mano la noche de La Esquina del Sol en el memoir; `T-433` que `experiencia` diga si hace
>   falta arrastrar el mapa con el dedo; `T-434` probarlo en un iPhone.

> ## 🎤 LOS RECITALES EN PANTALLA Y "ARMÁ TU RECITAL" (2026-10-15) — `D-72`, ciclo 21
>
> **Integrada a `main` el 2026-10-16 con el PR #47 (fusión `d5f5837`)**, desde la rama `ciclo-21/recitales`
> sobre `afbe3ff`. La fusionó Claude a pedido del usuario (*"Integrá el PR #47 a main"*). Pedido del usuario: *"Hace la idea
> 15, hace al mismo tiempo el juego de CREAR tu propio recital. Esta muy bueno aprovechar los recortes de
> temas para cuando aparece en pantalla mostrarlo."*
>
> - **"En vivo"** (`/redondopedia/en-vivo/`, `IDEA-15`): **27 listas enteras**, por año y plegadas: las dos de
>   MusicBrainz (Concordia, diciembre de 1995) y 25 de Discogs (casetes piratas de 1987 a 2000, `INV-425`),
>   estas con el sello "SIN REVISAR" que pidió el usuario. Cada una con su rótulo de fuente y licencia y los
>   bises que marca la fuente; lo que más aparece en las 256 listas de setlist.fm, con su rótulo; y el
>   índice de 40 noches con el enlace a cada lista. Cada tema con recorte suena al tocarlo, y cada lista
>   entera suena de corrido, diez segundos por tema. Puerta aparte arriba de la portada de la Redondopedia.
> - **"Armá tu recital"** (`/juegos/arma-tu-recital/`, A10, viste *Oktubre*, `IDEA-16`): **una expresión de
>   deseo, hoy** (enmienda de `D-72`). Elegís un estadio o un teatro de todo el país
>   (`lugares-recital.json`), un descampado en la localidad que escribas, o escribís el lugar; armás la
>   lista con los 105 —con buscador y la tira de tapas, en orden, con hasta cuatro bises— y cada tema
>   suena al sumarlo, con el "SUENA" siempre a la vista en el pie. Al cerrar, la noche suena entera marcando el renglón. Dice
>   cuánto dura con las duraciones de los discos. Sin puntaje (`BR-22`). Se comparte como dirección y como
>   hoja (la lámina de "Ponelos en fila", con la tinta de *Oktubre* y un tema por renglón), y se baja.
> - **Lo que tocó de lo existente:** la quinta forma de link en `desafio.ts` (fuera de la unión), dos campos
>   opcionales en la lámina, el permiso de t8 para que solo "En vivo" lea las listas enteras (`CTR-19.8`), y
>   las tildes del texto de `cambios` de `recitales.json`, que ahora se lee.
> - **Revisión independiente** (`REV-23`, `FIND-153`..`FIND-168`): ninguna alta; cuatro medias (foco al cambiar
>   de pantalla y al sumar, la lista que seguía sonando, la lista guardada que se borraba) y doce bajas, entre
>   ellas rótulos de "En vivo" que afirmaban más de lo que dicen los datos. Se arreglaron todas.
> - **Verde:** `npm test` (1628), `npm run check` y `npm run build`. Jugado en el navegador a 375 px y en
>   escritorio: armar, mover a los bises, cerrar, escuchar la noche, abrir el link en limpio, la hoja.
> - **Abierto, sin trabar:** de Discogs, confirmar el volcado CC0 y los "datos restringidos", y las fechas en
>   disputa; el Fandom no entra hasta confirmar su licencia (`INV-425`, "Sin resolver"). `T-427`, que `investigador` confirme los nombres de los 34 estadios y teatros
>   y `contenido` lea la lista; `T-421`..`T-425`, los documentos de cada rol, con la propuesta en
>   `Docs/SUGERENCIAS/HILO-para-todos-d72-los-recitales.md`; `T-426`, probarlo en un iPhone (la noche
>   sonando de corrido y el pie con la barra de Safari). Lo que más le sumaría a "En vivo": más listas
>   enteras con licencia abierta (`T-425`, `investigador`).

> ## ❓ PREGUNTAS RICOTERAS SE REHACE ENTERO: SE SIENTE COMO UN FICHÍN (2026-10-15) — `D-71`, ciclo 20
>
> **Integrada a `main` el 2026-10-15 con el PR #45 (fusión `e6c3139`)**, desde la rama `ciclo-20/preguntas-ricoteras`
> sobre `243495d`. La fusionó Claude a pedido del usuario (*"Integrá el PR #45 a main"*). Pedido del usuario:
> *"Hace un ciclo entero mejorando la ui/ux del juego de preguntas ricoteras. Que la mejora sea total de
> como se siente, hoy esta muy duro y feo. Mejoremos el banco de preguntas, como estan escritas las
> preguntas todo."* (El ciclo 19 fue la noche ricotera, `D-62`.)
>
> - **La pantalla** (`partida.ts`, bloque `D-71` de `juego.css`): tablero con las tres fichas, el `Nº` y
>   un riel por escalón; "Cerrá la partida" arriba a la derecha; la pregunta como recorte con cinta en
>   la tinta de su categoría; opciones con letra (y teclas 1–4 / A–D con el foco en la partida); la
>   respuesta con el grito estampado, la racha (3, 5, 10 al hilo), la correcta escrita grande y **la
>   tapa del disco**; `SEGUÍ` pegado abajo; el resultado con el `Nº` grande y **la planilla** pregunta
>   por pregunta, que también viaja al compartir (◆ ✕). La lógica de `BR-19` no se tocó; lo nuevo que
>   lee la partida vive en `src/lib/quiz/recorrido.ts`, con tests.
> - **El banco** (`CNT-41`): 44 preguntas, 14 fácil / 15 media / 15 difícil, 11 por categoría. 19
>   retiradas, 22 reescritas, 23 nuevas (`QZ-044`..`QZ-066`), tres con verso. Los fáciles los saca el
>   que fue a una previa. 23 ítems traen `disco` (campo nuevo de `CTR-02`, y `fuentes` acepta `RES-`
>   de tres dígitos).
> - **Revisión independiente** (`REV-22`, `FIND-141`..`FIND-152`): una alta (`QZ-064` ponía en Tandil
>   la conferencia de prensa que el memoir ubica en Olavarría, 1997), dos medias y nueve bajas. Se
>   arreglaron todas. `voz.test.ts` ahora audita el banco del quiz y conoce «show».
> - **Verde:** `npm test`, `npm run check` y `npm run build`. Jugado en el navegador a 375 px y a
>   1024 px.
> - **Abierto, sin trabar:** `T-412` (`experiencia`: `UX-01`/`UX-07` y la hoja 09 del lienzo) y
>   `T-413` (`arquitectura`: asentar `disco` y el patrón de `fuentes` en `CTR-02`), nota en
>   `Docs/SUGERENCIAS/HILO-para-experiencia-y-arquitectura-d71-el-quiz.md`. `investigador`: RES-05 y
>   N-016 (Olavarría o Tandil), matizar RES-07, la advertencia de Patricia Rey, y los pedidos de
>   `CNT-41` §6. Probarlo en un teléfono de verdad (la barra del `SEGUÍ` con la de Safari).

> ## 🃏 PONELOS EN FILA SE REPARTE DE A UNA, CON FILAS PROPIAS Y LOS 105 TEMAS (2026-10-10) — `D-69`, `D-70`
>
> **Integrada a `main` el 2026-10-10 con el PR #43 (fusión `2ffdf4c`)**, desde la rama `ponelos/filas-propias`
> sobre `41292f9`. La fusionó Claude a pedido del usuario (*"cuando termine integra todo a main"*). Pedidos del usuario:
> editar y sumar las filas, una tier list de *todos* los temas con su disco, que se vea más lindo y sea
> más fácil y divertido, que más fichas está bien, y que suene el recorte de cada tema (en una ficha de
> disco, temas de ese disco, uno detrás de otro).
>
> - **El mazo:** abajo va la que sigue (carta grande con tapa, disco y pista) y un botón por fila. Un toque
>   y viene la próxima. Están Salteala, Elegí otra (con filtro por disco), Mezclá el mazo y Deshacé. Una
>   ficha puesta se toca para moverla.
> - **Filas propias:** de dos a siete. Se renombran en el lugar, se guardan en el navegador y viajan en el
>   link (versión 2 del empaquetado, `#o=2…&f=…`, con lista blanca). Con las de siempre, el link es el
>   de antes.
> - **"Todos los temas"** (los 105) va primero. Se guarda una partida por conjunto: abrirlo de nuevo sigue donde
>   quedó, y la elección ofrece "Te quedó a medias".
> - **Suena** el recorte de 10 s al tocarte una ficha, y se apaga desde las herramientas. La lámina va de 2
>   a 7 filas y se estira de alto antes que cortar un tema.
> - **En el portal sube al A6** (`D-70`), en el lugar de "Preguntas ricoteras", que pasa al A7.
> - **Revisión independiente:** de trece hallazgos se confirmaron siete (foco, nombres accesibles, el
>   disco que seguía sonando, media letra en un nombre de fila) y se arreglaron todos.
> - **Verde:** `npm test`, `npm run check` y `npm run build`. Probado en el navegador a 375 px y a
>   1400 px.
> - **Pendiente:** los documentos de rol que quedaron atrás (`UX-23`, `ADR-06`, `CTR-13`,
>   `PRD-ponelos-en-fila`). La propuesta para cada uno está en
>   `Docs/SUGERENCIAS/HILO-para-todos-d69-ponelos-mazo-y-filas.md`. Y probarlo en un iPhone de verdad:
>   el audio que arranca solo y el mazo pegado abajo con la barra de Safari.

> ## 🔢 EL PORTAL CAMBIA DE ORDEN (2026-10-06) — `D-68`
>
> Pedido del usuario. El lado A queda: Adiviná el tema, ¿Qué tipo de ricotero sos?, Sacalo por la
> letra, Skayboy y Poligirl, Completá la letra, Preguntas ricoteras, y después Ponelos en fila,
> Adiviná la tapa y Más o menos, como estaban. Solo se movió el arreglo `JUEGOS` de `copy.ts`: la
> pista de cada carátula sale del mismo índice y acompaña sola.

> ## 🔤 LOBO SUELTO Y LA LETRA DE LUZBELITO ENTRAN AL SISTEMA (2026-10-06) — `D-67`
>
> **Rama `tipografia/lobo-y-luzbelito`, sobre `main` en `8bb84ab`**, en el worktree
> `../RicotaArcade-fondo` (reusado). Pedido del usuario: *"vamos a seguir integrando las otras dos
> que no estan en el sistema, la de lobo suelto y la otra que es medio luz belito"*.
>
> - **"La otra" es Redonditos de Ricota**, de Zavala (la del zip del mismo nombre). No es la letra de
>   la tapa de *Luzbelito*: la viste porque se le parece. Por eso no escribe el nombre del disco en
>   la estampa.
> - **Las dos se derivaron con material propio** (`scripts/derivar-lobo-suelto.py`,
>   `scripts/derivar-redonditos.py`): Lobo suma Á É Í Ó Ú . , ! ¡ y recupera la Ñ de Zavala;
>   Redonditos, Á É Í Ó Ú Ñ . , ! ? ¡ ¿, escalada a la mayúscula del sistema. Las dos suben al
>   renglón.
> - **Dónde escriben:** Lobo, el título de "Adiviná el tema" (sin sal); Redonditos, el título de
>   "¿Qué tipo de ricotero sos?", el nombre de cada manera, "Las cuatro maneras" y el membrete de la
>   hoja. La letra viaja con la variante (`--fuente-disco` en `sitio.css`).
> - **Pendiente:** las postales de dos ejes siguen con el nombre en la rotulada (hay que pasar el
>   taller a la letra y regenerar los PNG; se esperó a que `ciclo-18/que-ricotero-sos` entre), la
>   hoja 04 del lienzo y la fila de las letras de Zavala en `CNT-01` (sugerencia para `contenido`).

> ## 🔀 CLAUDE FUSIONA CUANDO SE LO PEDÍS (2026-10-06)
>
> Pedido del usuario, textual: *"mergealo vos, vamos a dejar escrita la regla para que puedas
> tambien"*. El PR #38 (la multitud que se acerca, `D-64`, `D-65`) lo fusionó Claude. Desde ahora
> hay permiso en `.claude/settings.json` (`Bash(gh pr merge *)`) y una regla,
> `.claude/rules/integrar.md`, que dice cuándo: **solo si el usuario lo pide en el chat**, con
> `main` adentro de la rama, todo verde y los checks del PR en verde; siempre `--merge`, nunca
> `--admin`, `--squash` ni borrar la rama.

> ## 🖨 LA MULTITUD SE ACERCA, LA SOMBRA SALE DE TODOS LADOS, LAS TAPAS SE SELLAN (2026-10-05) — `D-63` enmienda 1, `D-64`, `D-65`
>
> **Rama `diseno/la-multitud-se-acerca`, sobre `main` en `8989416`**, en el worktree
> `../RicotaArcade-fondo` (reusado: la rama del fondo ya estaba integrada). Pedidos del usuario,
> en orden: *"Saquemosle la sombra a las letras de las tapas de los juegos, busquemos un efecto mas
> de impresion vieja sobre papel o sello [...] que queden todas coherentes"*; *"Sisi saquemos la
> sombra de todos lados, no me gusta. Ademas hay que usar la tipografia de los discos en mas
> lados"*; y *"Continua lo que falta, me gustaria que mientras vas bajando en la pagina en el fondo
> se vean banderas rojas y gente [...] como si ir para abajo fuese acercase a la multitud"*.
>
> - **La multitud se acerca** (`D-63` enmienda 1): dos planos fijos detrás del portal, hechos con el
>   frente original de *Oktubre* (banderas y gente, en espejo). Arriba se ve chica y lejos; al
>   bajar crece y sube la fila más cercana; al final llegan las caras grandes del pie, y cada fila
>   tapa a la de atrás. Sin JavaScript, atado al desplazamiento; quieto con movimiento reducido.
> - **Sin sombra en ningún lado** (`D-64`): 41 sombras, sobre letras y sobre objetos. Los botones se
>   hunden y se aclaran; los estados que se decían con sombra se dicen con borde.
> - **Las tapas se sellan** (`D-64`): el título del casete y el de la carátula en tinta de sello
>   gastada, la etiqueta en papel viejo, el sello de acción moteado, y el golpe de cada disco igual
>   en el casete, la carátula y el título de su juego. Lo eligió un panel de tres diseñadores y tres
>   jueces.
> - **La letra de la banda** (`D-65`): Patricio Rey Fan escribe el título de cada juego (menos el de
>   Skayboy, que va chico en su cabecera) y el botón de compartir, con Á É Í Ó Ú ¿ ? ¡ ! . , derivadas de la propia letra
>   (`scripts/derivar-patricio-rey.py`). El título del casete sigue en la rotulada: a 15 px la letra
>   de la banda no se lee.
> - **`npm test` corre en Windows**: el patrón iba entre comillas simples y `cmd` no las saca, así
>   que corría cero tests y daba verde. Ahora van dobles, que andan en los dos. Y el test de la isla
>   de dos ejes ya no falla con los finales de línea de Windows.
>
> **Verificado:** `npm test` 1562/1562 en Windows, `check` 0/0, build 160. Tests nuevos con su rojo
> visto: los planos de la multitud (techo y piso de tinta, máscaras, silueta), "ninguna sombra en
> ningún lado", `texturas.test.ts`, la etiqueta sobre el papel viejo, y la cobertura de Patricio
> Rey. Mirado en el navegador a 1440×900 y 375×812: el portal arriba, al medio y al final, los
> casetes, la carátula y el título de los juegos.
>
> **Abierto, sin trabar:**
> - `experiencia`: `UX-05`, `UX-20`, `UX-22` §8, §9 y §13 y `UX-25` describen lo que ya no está
>   (nota en `Docs/SUGERENCIAS/HILO-para-experiencia-sin-sombra-y-letras.md`). El lienzo tampoco
>   tiene nada de esto.
> - El título en Patricio Rey en el teléfono se lee con esfuerzo si no se conoce la letra: si al
>   usuario le molesta, la salida es dejarlo solo en la mesa.
> - El efecto de la multitud en el teléfono es más tenue que en la computadora: los casetes tapan
>   los planos, y la tinta tiene el techo del contraste.

> ## 👥 LA GENTE MIRA DESDE EL FINAL DEL PORTAL (2026-10-04) — `D-63`
>
> **Rama `diseno/fondo-multitud`, sobre `main` en `76ba9d3`, integrada a `main` con un PR** a
> pedido del usuario (*"para y subi e integra todo lo que hayas hecho, despues seguimos"*).
> Pedido, con la imagen adjunta:
> *"Usemos esta imagen de fondo de la pagina, sin la parte de las letras de oktubre, un fondo
> negro y sobre el final de la pagina las personas mirando."*
>
> - **El fondo del portal es negro liso.** Sale la franja fija de banderas (`oktubre-banderas`,
>   velada al 86 %) y su dibujo de repuesto `banderas.svg`.
> - **La gente de *Oktubre* es el piso del pie de imprenta del portal**, de borde a borde y abajo
>   del crédito, a tinta plena: `public/arte/multitud-oktubre.png` (1280×368, 64 KB), en
>   `--papel` y el rojo de la bandera sobre transparente. Lo produce
>   `node scripts/generar-multitud.mjs` desde el máster
>   `Docs/INVESTIGACION/TapasDiscos/oktubre-frontal-ancha.webp` (la imagen del usuario).
> - En el teléfono, piso de 14 rem: se ve el centro de la tapa. La deriva de `UX-20` §1.4 pasó a
>   la gente, corriendo al revés.
>
> **Verificado:** `npm test` 1515/1515 (3 nuevos en `multitud.test.ts`, con su rojo visto),
> `check` 0/0, build 160. Mirado en el navegador a 1440×900 y a 375×812: la gente al final, sin
> desborde de costado, el crédito nombra *Oktubre*; el quiz y "Adiviná el tema" siguen con su
> pasada.
>
> **Abierto, sin trabar:** `experiencia` tiene que poner al día `UX-05` (fila de `/`), `UX-20`
> §2 y `UX-25` §4; el lienzo no tiene esto. Los costados del máster no son de Rocambole (están
> anotados en `D-63` y en `public/arte/README.md`).

> ## 🍺 LA NOCHE RICOTERA ENTERA, Y EL PLANO FIJO QUE VUELVE (2026-10-05) — `D-62`, ciclo 19
>
> Pedido del usuario, textual: *"el recital ricotero es barro, sucio, drogas reviente y también
> es familia amigos amor, es todo eso, pero lo primero no puede faltar tampoco, un choripán, un
> pancho una birra un porro hasta cocaína debe ser parte del recital, la previa ir un rato antes
> a escabiar o no eso es un recital ricotero"*. Después, mirando el sitio publicado: *"nunca
> cansa el volumen"*, *"quiero que esté el gráfico también, queda lindo ver que está en un plano
> de dos ejes"*, y entre las dos versiones del plano: *"B, el fijo como el rombo viejo"*. Rama
> `ciclo-18/que-ricotero-sos`, integrada a `main` el 2026-10-05 a pedido del usuario (*"pará y
> subí e integrá todo lo que hayas hecho, después seguimos"*), y otra vez el 2026-10-06 con el
> PR #41, con todo lo de abajo (*"integrá todo"*).
>
> **El número.** Se escribió como `D-59` y se renumeró a **`D-62`** al integrar: el `D-59` del
> dominio llegó antes a `main`. Los commits de la rama dicen `D-59`; el repo, `D-62`.
>
> **Lo que hay:**
> - **`D-62`**: la escena es la ricotera entera (barro, chori, birra, porro, merca como paisaje;
>   familia, amigos y amor de terceros); la opción es de quien juega. Lo que se toma o se fuma
>   nunca separa los polos, y se suma un **quinto lugar** a la prueba: *el que no toma ni fuma*.
>   **Enmienda 1**: la música nunca molesta. **Enmienda 2**: vuelve el plano de dos ejes, arriba
>   de la grilla que se queda. **Enmienda 3**: el plano es **fijo** (Luz arriba, Orden a la
>   izquierda, para todos), elegido por el usuario con el costo a la vista.
> - **`INV-172`** (`RES-172`..`RES-194`): la noche real, casi todo **leyenda** (sin páginas
>   abiertas: la red bloqueó los diarios; el memoir no está en el disco).
> - **`BR-38`** y `US-06` enmendada dos veces (`producto`): la tercera exceptúa al plano del
>   criterio 3 y suma el **criterio 9**. **`CNT-31`** (`contenido`): los 30 enunciados, las
>   cinco líneas que cantan, las cuatro bajadas; casete y lugar con barro y chori; §13 confirma el
>   texto del lector (`T-352`). **`UX-38` v1.1** (`experiencia`): el plano construido, con la
>   crítica respondida.
> - **El plano** (`planoFijo()` en `partida.ts`, `plano()` en la isla, `.ejes-plano*`): recorte
>   de papel, ejes en cruz, los cuatro polos, las cuatro maneras, la tuya con borde y sello, la
>   del amigo punteada, `role="img"` con `RESULTADO.altPlano`. La grilla de abajo sigue relativa.
>   Medido a 375, 360, 320, 1366 y 1440, con y sin amigo, las cuatro maneras: sin desborde, filas
>   y columnas iguales, nada bajo 12 px; los botones no se movieron. No viaja en la tarjeta.
> - **Guardas**: `banco.test.ts` (vetos de la noche con *la música que molesta*, vetos de las
>   opciones, el consumo nunca de un solo lado, cada celda trae lo sucio), `partida.test.ts` (el
>   plano fijo; el cuadrado latino de la grilla), `isla.test.ts`, `estilos.test.ts` (piso de 12 px
>   en `.ejes-*`), `copy.test.ts` (el texto del lector en veinte casos).
> - **`npm test` corre todo**: el glob iba sin comillas y corría 332 tests. Hoy, con `main`
>   adentro (`D-63` a `D-67`), **1575 en verde**; `check` sin errores, `build` de 160 páginas.
> - **El plano está en el lienzo** del sistema de marca como **hoja 16** (`T-351`, versión 19 del
>   lienzo), debajo de la 08 en la página Aplicación.
>
> **`REV-20` está cerrada** (`Docs/REVISIONES/REV-20-la-noche-ricotera.md`, 2026-10-06; los votos
> en `REV-20-votos.json`). Tres lentes con dos verificadores adversariales cada una, un crítico de
> completitud y una ronda final. **Ningún hallazgo alto.** `FIND-119` … `FIND-133` (`FIND-128` y
> `FIND-129` quemados): todo cerrado. `FIND-132` y `FIND-133`, cifras de `UX-36`/`UX-38`, se
> cerraron en papeles después del cierre (abajo).
> - `EJ-049` (`FIND-119`) quedó «Festejo con el resto» / «Canto para adentro», en dos vueltas.
> - La portada a 320 × 568 se rompió dos veces y se arregló dos veces: el lugar nuevo del casete
>   («Traés barro en las zapatillas.», `FIND-130`) y la letra del título de `D-67` (`FIND-131`:
>   16 px de aire bajo 22 rem). Hoy «Empezá la noche» termina en 562.
> - Guardas nuevas de la revisión: la música que molesta en más formas y en primera persona, los
>   trapos fuera de las opciones, el consumo como verbo, la merca fuera de lo que define una
>   manera o un momento, ningún número; `textoDelPlano()` en un solo lugar y el orden de los
>   rincones atado.
> - La excepción de las líneas que cantan (sin segunda persona) está en `voz-ricotera.md` §5.
>
> **Después del cierre**, una última ronda de papeles (`1afb263`, `619b2b2`, `7e772a3`, `0c38b56`)
> cerró en papeles `FIND-132` y `FIND-133` y lo que el cierre le dejaba a cada rol. Su verificador
> dejó cinco detalles de redacción, todos bajos, que quedan anotados acá y no se abrió otra vuelta:
> - `contenido` (`CNT-31`): todavía dice que `producto` no decidió `EJ-051` (decidió en `6b1beeb`:
>   la escena es la hoja) y que el peso del costo de `CU-4` lo dice `producto` (ya dijo: cuenta la
>   forma, decide `contenido`); y cita «ficha 15/16/17» donde `REV-20` dice «Sin consenso».
> - `experiencia` (`UX-36` §5.6, `UX-38` §3.2): «Compartí» a 320 termina en 568,4 en las cuatro
>   maneras (en `CU-1` y `CU-3` por 0,4 px), no «justo en el borde».
> - `producto` (`BR-38`): el «Léase» del veto 1 deja afuera «el pogo» que la tabla trae, y la cita
>   «`REV-20` 2(c)» para los chicos en las bajadas no lo respalda (es cierto, pero por otra lectura).
>
> **Lo que decide el usuario:** si «Compartí» tiene que entrar a 320 × 568 en el resultado (hoy
> no, en ninguna manera, y es de antes de este ciclo); `EJ-040` («Me dejo llevar» con los Redondos
> sonando) y el costo de `CU-4` («averiguarlo en el celular»), que `contenido` dejó como están;
> y el teléfono real (lector de pantalla, la portada a 320, el brillo, Safari y Android), y si la
> noche suena ricotera. La hoja 15 del lienzo (la mesa) sigue pendiente (`T-319`), y antes hay
> que sacarle el canto.

> ## 🌐 EL DOMINIO: FICHINRICOTERO.COM.AR, ANDANDO (2026-10-05) — `D-59`
>
> **El sitio vive en `https://fichinricotero.com.ar`.** El usuario compró el dominio en NIC
> Argentina (`arcadericotero.com.ar` quedó trabado en revisión manual, "banquinado"; la sospecha
> es *arca*), lo agregó en Vercel con `www` redirigiendo, y delegó en NIC a `ns1.vercel-dns.com` y
> `ns2.vercel-dns.com`. Cuando el usuario confirmó que andaba, la rama
> `dominio/fichinricotero` se fusionó con `main` (que ya traía `D-60` y `D-61`) y se integró.
>
> **Lo que cambió en el código:** `site` de `astro.config.mjs` apunta al dominio nuevo, así que
> `og:url` y `og:image` salen de ahí; las tarjetas del taller de "¿Qué tipo de ricotero sos?" se
> volvieron a dibujar con la marca de `D-60` y este dominio; los enlaces del hilo de Twitter en
> `main` apuntan al dominio nuevo.
>
> **Lo que queda:**
> 1. `arcade-ricotero.vercel.app` sigue respondiendo y no redirige: los enlaces viejos andan.
>    Si se quiere una sola dirección, se configura en Vercel (Settings → Domains).
> 2. El hilo con el nombre nuevo (rama `difusion/hilo-twitter`) **choca con esta integración** en
>    `hilo.md` y `hilo.json`: acá cambiaron las direcciones, allá el nombre. Al integrarlo, quedan
>    las dos cosas.
> 3. **Renovar en NIC antes del 2027-10-04** ($8.500 hoy; 45 días de gracia). Si se deja vencer,
>    el sitio sigue en `arcade-ricotero.vercel.app` volviendo `site` atrás.

> ## 🕹 SKAYBOY Y POLIGIRL: EL MENÚ, EL PASO ENTRE NIVELES Y EL PULGAR (2026-10-04) — `D-61`
>
> Pedido del usuario, textual: *"Hacé una sesión entera agregándole menú, paso entre niveles y
> corrigiendo la jugabilidad de las teclas en mobile de skayboy y poligirl. Además ponele en el
> home al lado de Adiviná el tema. La idea es que tenga un botón para ponerse en pantalla completa,
> y que en la misma pantalla completa estén los controles medio transparentes para jugar dentro de
> la pantalla completa. Agregá el menú para jugar y ver qué niveles hay y eso."* Sin plan de
> `orquestador`: `D-61` la escribió el hilo principal, y cada rol tomó su número (`IDS.md`).
>
> **Lo que hay:**
> - **El menú** (`menu.ts`, `UX-37` §3): abre al entrar —el botón grande juega el nivel que
>   corresponde, tocable en el primer cuadro— y desde la partida con el sello `MENÚ` del mueble,
>   que la pone en pausa (el mundo no avanza). **Los seis niveles abiertos** (`D-61` punto 2,
>   `BR-40`), cada uno con número, nombre de `CNT-21` y sello `PASADO` / `ACÁ ESTÁS`. Ocupa la
>   región del tubo y los mandos, medida por `regionDelMenu()`: parado, la zona de las teclas con
>   el nivel dibujado arriba; de costado, la franja del tubo; en el modo, la sala. **Nunca el pie
>   de homenaje ni la cabecera.**
> - **La tarjeta de fin de nivel**, en la banda de arriba del área (las puertas están abajo):
>   `NIVEL 2 DE 6 · PASADO`, el que sigue (con lugar), y Repetí / Elegí otro / Seguí. A ×1 va
>   compacta. El toque sobre el área sigue valiendo; `#seguir-juego` salió de la tabulación.
> - **El rótulo de entrada**: `NIVEL 3 DE 6` y el nombre, 2,6 s, sin tomar toques.
> - **El pulgar rueda** (`dedos.ts`): la columna captura el dedo y la tecla sale por geometría
>   (sin franjas muertas); subir de una flecha a saltar sin levantar **salta y sigue para ese
>   lado**. Toques más cortos que un tic no se pierden (`pulsadas`). La tecla se hunde sin
>   transición. Las notebooks táctiles conservan los botones (`any-pointer: coarse`).
> - **La pantalla completa en cualquier posición**: el sello aparece también parado y dice el
>   verbo (`PANTALLA COMPLETA` / `SALÍ`, `CNT-40`); el menú tiene el mismo botón con la frase
>   entera. De costado, las teclas medio transparentes encima, como ya estaba.
> - **La portada**: el casete pasa de A9 a **A4**, después de "Adiviná el tema".
> - Papeles: `D-61` (con sus precisiones del mismo día), `UX-37` (y pies en `UX-27`, `UX-28`,
>   `UX-32`, `UX-33`), `CNT-40` (enmienda `CNT-22` §1), `BR-40` (enmienda `US-09` criterios 3 y 9 y
>   `BR-31` §3), enmiendas de `ADR-10` y `CTR-16.11.2`; traspaso en
>   `Docs/SUGERENCIAS/HILO-para-todos-skayboy-menu-y-mando.md`.
>
> **Verificado:** `npm test` 1448/1448 (43 nuevas: `dedos.test.ts`, `menu.test.ts`, y casos en
> `modo-pantalla.test.ts` y `estilos.test.ts`), `check` 0/0, build 156. La isla pesa 15,4 KB
> comprimida y con el motor suma 83,8 (techo de 90, `ADR-08.10`). Medido en el panel del
> navegador del escritorio, con emulación: parado 375×667 y 375×812, acostado 740×360, 568×320 y
> 812×375, escritorio con mouse, y la pantalla completa parada y acostada (740×360 y 568×320). El
> nivel 1 se jugó y se ganó de punta a punta (avance guardado, baile, contador, tarjeta, Seguí, el
> rótulo del 2, el menú en pausa). El pulgar se probó con eventos de puntero: rueda entre flechas,
> lleva la dirección al saltar, suelta todo lejos de la columna. El pie de homenaje no se cruza
> con ninguna capa en ningún reparto (medido, y lo prueba `menu.test.ts`).
>
> **Revisión adversarial** (cuatro lentes en paralelo: la máquina de estados de la isla, el dedo,
> el CSS por tamaño, la lógica y los textos): 25 hallazgos distintos. La verificación cruzada se
> cortó a mitad por el límite de la sesión; los que quedaron sin veredicto los verificó el hilo
> contra el código y el navegador. **Corregidos:** la tarjeta del sexto se rompía a ×1 y en la
> grilla ancha ("Volvé al primero"); en el modo a 568×320 la regleta se apilaba y la tarjeta tapaba
> `SALÍ`; la tarjeta no escondía el rótulo, se comía el toque de seguir con su cuerpo, robaba el
> foco (y un Enter repetido salteaba el nivel) y se montaba sobre los bloques de saltar en el modo;
> el rótulo quedaba debajo de los sellos en el modo; `aria-modal` y un `inert` de más le escondían
> al lector el volver y el pie; el foco volvía al canvas (kaplay lo enfocaba) o se caía al `body`;
> `Escape` sostenido hacía titilar el menú; el `aria-pressed` contradecía el nombre nuevo; `PASADO`
> iba en el verde del acierto; el eco del menú pintaba 2 px sobre el pie; dos recortes con "…" en
> rótulos; el sello se salía 5 px de la ventana a 568; con mouse a ×1 de costado la regleta tapaba
> el título; el menú parado tapaba la firma y los créditos del sitio; `:active` mostraba teclas que
> el mando ya había soltado. **Descartados con razón:** que la ficha muestre el dígito y no
> `MENU.numero` (ver abierto), y que `#seguir-juego` sin tabulación deje sin camino al teclado (lo
> tiene: Tab a la tarjeta, o Enter con el foco suelto).
>
> **Abierto, sin trabar:**
> - `T-401` (usuario): **el lienzo**. El menú, la tarjeta, el rótulo y los sellos no tienen hoja;
>   el circuito de `diseno-marca.md` se invirtió otra vez, como con `T-319`. Ningún color nuevo:
>   todo sale de tokens y pares que ya mide `contraste.test.ts`.
> - `T-402` (`revisor`): **`REV-21` formal** contra `UX-37` §10, con contexto fresco. La revisión
>   de esta sesión la hicieron agentes de propósito general, no el rol.
> - `T-403` (`experiencia`): `UX-35` y `UX-04` todavía dicen A9 para Skayboy; y la leyenda de
>   `D-55` sigue sin entrar a `UX-28` §2 y `UX-35` §5.
> - `T-404` (`arquitectura`): las filas de `menu.ts` y `dedos.ts` en `CTR-16.8` y `ADR-08.10`, y
>   reabrir `hastaDonde()` frente a `pasadosDeLaFila()` (`CTR-16.11.1` y `.3`).
> - `T-405` (`contenido` y `experiencia`): la ficha muestra el dígito ("3") y `CNT-40` §1.1 pide
>   `MENU.numero` ("Nivel 3"); en la fila de seis cuadrados no entra. Que lo decida `CNT-40`.
> - Sigue sin existir la pieza compartible de `BR-27`: "Volvé al primero" en el sexto es el parche
>   de `BR-40` punto 7.
>   (Los números se renumeraron al integrar —era `D-56`, `UX-36`, `CNT-30`, `BR-36`, `T-331`+—
>   porque el ciclo 18 llegó antes a `main` con esos; ver `IDS.md`.)
> - **Sube como PR a `main`** desde la rama `skayboy/menu-y-mando-sobre-main`, encima del ciclo 18
>   y de "Fichín Ricotero" (`D-60`), a pedido del usuario.
>
> **Del usuario:** jugarlo en un teléfono de verdad, con el pulgar (`T-249` sigue abierta, y ahora
> mide también el arrastre de dirección y la pantalla completa parada en Android, que gira sola);
> y decidir si "al lado de Adiviná el tema" tiene que ser literal también en tres columnas (ver
> `D-61`, precisiones).

> ## 🕹 EL SITIO SE LLAMA FICHÍN RICOTERO (2026-10-04) — `D-60`
>
> Pedido del usuario, textual: *"Vamos a cambiar el nombre de la pagina por fichin ricotero.
> Hace los cambios pertinentes. Esto se debe a que arcade ricotero no se podia comprar el
> dominio. Dale que sale hoy la pagina al publico"*. Rama `nombre/fichin-ricotero`, sobre
> `main` en `93f292a` (con el ciclo 18 adentro), **integrada a `main` con el PR #29
> (`8913ce1`) y publicada**: verificado en `arcade-ricotero.vercel.app` el título, la marca y
> la fuente v0.4.
>
> **Lo que hay:**
> - **El nombre** en todo lo que se ve: las cuatro formas de la marca (`FICHÍN RICOTERO`), los
>   dos pinceles, las nueve tarjetas del taller de "¿Qué tipo de ricotero sos?" (regeneradas),
>   pestañas, `og:site_name`, `aria-label`, ícono, textos para compartir ("en el fichín
>   ricotero"), *Volvé al fichín* y la cinta *← AL FICHÍN*, las imágenes que bajan los dos
>   pinceles (`fichin-ricotero-*.png`).
> - **Oktubre Calco v0.4**: la F, la H, la N y la Í, derivadas de las letras calcadas con
>   booleanas (`scripts/derivar-oktubre-calco.py`, reproducible byte a byte). La marca queda
>   entera en la letra de la tapa. Métricas sin tocar; el acento se probó en
>   Chromium/Windows, HTML y canvas.
> - **`fuentes.test.ts`** (el de `D-58`) suma un lector de WOFF y tres casos: si la marca, un
>   pincel, el taller o una página piden una letra que el calco no tiene, falla.
> - **Lo que no cambió, a propósito:** la clave `arcade.` de `localStorage`, las clases, los
>   `$id`, el repo, el proyecto de Vercel (`arcade-ricotero`) y **el dominio**: `site` sigue en
>   `arcade-ricotero.vercel.app` porque `fichinricotero.com.ar` todavía no resuelve DNS. Eso
>   lo cambia `D-59` (rama `dominio/fichinricotero`) cuando responda por HTTPS.
>
> **Abierto, sin trabar:**
> - **Del usuario:** delegar `fichinricotero.com.ar` en NIC Argentina a los servidores de
>   nombres de Vercel y sumar el dominio al proyecto `arcade-ricotero`. Hasta entonces el
>   dominio no carga y `D-59` no puede entrar.
> - **`D-59` está reservado dos veces** (la rama del dominio y el ciclo 19). Uno renumera.
>   *[Resuelto 2026-10-05: el ciclo 19 pasó a `D-62` al integrar.]*
> - El trabajo de Skayboy del menú y el pulgar ya está renumerado sobre `origin/main`, en la
>   rama local `skayboy/menu-y-mando-sobre-main` (`e50110b`: `D-61`, `UX-37`, `CNT-40`,
>   `BR-40`, `T-401`…`T-410`), sin subir. Contra esta rama choca solo como texto: el final de
>   `DECISIONES.md` e `IDS.md`, este bloque, y las líneas de la marca en
>   `skayboy-y-poligirl.astro`.
> - Los roles: `Docs/SUGERENCIAS/HILO-para-todos-el-sitio-se-llama-fichin-ricotero.md`.
> - El hilo de difusión en `main` sigue diciendo Arcade Ricotero: el nombre nuevo está en el
>   commit `be7b9e2` de `difusion/hilo-twitter`, sin PR (el #26 se integró antes). Sus
>   capturas muestran la marca vieja: se sacan de nuevo con esto publicado.

> ## 🌙 "¿QUÉ TIPO DE RICOTERO SOS?" REHECHO: UNA NOCHE Y EL LIBRO DE *LUZBELITO* (2026-10-04) — `D-57`, ciclo 18
>
> **Rama `ciclo-18/que-ricotero-sos`, sobre `main` en `bc27cd4`, integrada a `main`** a pedido del
> usuario (*"integrá todo a main"*) con el **PR #27** (merge `c7ef2de`), con el deploy de vista
> previa de Vercel en verde. Pedido del usuario: *"Hacé un ciclo entero de mejora importante sobre
> el juego de qué tipo de ricotero sos, mejora artística, de preguntas, de resultado y de otras
> cosas que analices que se puedan mejorar"*. Plan en `ORQ-plan-ciclo-18.md` (`T-331`..`T-346`,
> todas hechas). Decisión madre: `D-57`, con siete enmiendas escritas al construir.
>
> **La idea:** el test deja de ser veinte preguntas sueltas y pasa a ser **una noche de recital en
> cinco momentos** (la previa, la ida, la vereda, *Cuando suena*, la vuelta), una pregunta de cada
> eje por momento. El resultado no dice "sos": dice **"Esta noche te salió"** una de cuatro
> maneras con nombre de cosa y sin persona —«Mesa larga a las nueve», «Ronda en cualquier
> esquina», «Radio bajita, misma hora», «Mochila liviana, sin mapa»—, con los dos polos traducidos
> (*con la gente* / *con lo propio*, *con plan* / *sobre la marcha*). Todo viste **el libro de
> *Luzbelito***: la portada es la tapa cerrada, cada pregunta una hoja, el resultado la última.
>
> **Lo que hay:**
> - **El banco** (`CNT-30`, `src/data/dos-ejes.json` v2): 30 escenas `EJ-029`..`EJ-058`, tres por
>   celda momento × eje; las 28 viejas, retiradas. Pasó **cuatro vueltas de lectura adversarial**
>   contra `BR-36` (la frontera entre escena y credencial) y la prueba de los cuatro lugares (*nunca
>   fui*, *sin plata*, *silla de ruedas*, *volviendo de noche sin compañía*). La enmienda 7 de
>   `D-57` cortó la oscilación de la luz: puede suponer a alguien, nunca un parentesco ni un
>   desconocido, y teléfono en un tercio como mucho.
> - **El motor** (`partida.ts`, `CTR-08` v2): la noche en orden, otra noche sin repetir escenas en la
>   visita (`BR-37`), la grilla de dos por dos **relativa** (la tuya primero) y la relación con quien
>   te mandó el enlace, atadas por test.
> - **El toque**: se confirma y se bloquea (`aria-disabled`, `aria-pressed`), la siguiente hoja
>   llega a los 600 ms de `--pausa-eleccion` (que el movimiento reducido no apaga), el foco va al
>   enunciado y al nombre, una sola región viva en el HTML, teclas 1/2/Retroceso sin repetición, y
>   "Volvé a la anterior" sin `pushState`.
> - **El arte** (`UX-36`): la tapa en tres capas recortadas del frente (mármol, lomo, esquinero),
>   **sin el óvalo, la figura ni la palabra LUZBELITO** (`RES-168`); la hoja lisa con el canto de
>   las que faltan; el sello del momento que se apoya cuando cambia (el único movimiento); la
>   última hoja con la marca en dos renglones.
> - **Compartir**: una **tarjeta de 1080 × 1350 por manera** y una **postal por manera**
>   (`/juegos/dos-ejes/cu-1/`..`cu-4/`, con su vista previa), fabricadas por un taller en Node
>   (`npm run generar-dos-ejes`, versión 3) que mide cada renglón con las fuentes reales y falla si
>   algo no entra. Cancelar la hoja de compartir ya no copia nada.
> - **`D-58`, para todo el sitio**: la rotulada (`archivo-black.woff2`) era un recorte sin la A-Z y
>   cada título caía a una letra de reemplazo. Ahora es la completa, con su guarda.
> - **Guardas nuevas**: `banco.test.ts` (vetos, delatores, la firma de un polo por raíz, que ninguna
>   opción diga la traducción de su polo ni apunte a un nombre o una bajada), los once rojos del
>   schema (`esquemas.test.ts`), `isla.test.ts`, `tarjetas.test.ts` (huella, medidas, letras de cada
>   fuente) y `fuentes.test.ts`.
>
> **Verificado:** `node --test 'src/**/*.test.ts'` **1466/1466** (`npm test` corre 325 de esos),
> `check` 0/0, build **160** páginas. En el navegador, sobre el build: tres toques seguidos dan una
> respuesta, tres noches dan 30 escenas distintas, compartir anda en cinco variantes de
> `navigator` y sin red, y los botones entran a 375 × 667 (portada 590, postales 626 y 650,
> resultado 538 y 611) y a 320 × 568 (portada 565).
>
> **`REV-19`** (`Docs/REVISIONES/REV-19-la-noche.md`): `FIND-111`..`FIND-118`, cuatro cerrados.
> **La hizo el hilo principal, no `revisor`**: los subagentes se quedaron sin cupo hasta el 8 de
> octubre, a mitad de la vuelta 4 del banco. Lo que el hilo escribió en carpetas ajenas está
> marcado ("hilo principal") en cada `notaInterna`, en `CNT-30` §13, `CNT-01` (nota y §H) y
> `CNT-29` §4.
>
> **Pendiente, por orden:**
> 1. **Del usuario — `FIND-115`:** la carátula y el pie de este juego siguen mostrando el medallón
>    con la vela (`luzbelito-vela.png`), que `RES-168` pide no usar como pieza. `D-57` punto 9 lo dejó
>    fuera a propósito. Propuesta de `UX-36` §11.1: el casete A2 viste la tira del libro.
> 2. **Cuando vuelva el cupo — `FIND-117`:** `contenido` relee los ítems marcados "hilo principal"
>    (`EJ-041`, `047`, `052`, `053`, `054`, el crédito) y `revisor` relee `REV-19` con el encargo de
>    `T-344`.
> 3. **`FIND-118`:** `UX-36`, el estado de `ORQ-plan-ciclo-18.md` y `ADR-02` v2 enmienda 2 no dicen
>    lo que el código ya hace. Escrito en
>    `Docs/SUGERENCIAS/HILO-para-experiencia-orquestador-y-arquitectura-lo-que-dejo-REV-19.md`.
> 4. **`FIND-116`:** el costo de `CU-4` (*averiguarlo en el celular*) pesa menos que el de `CU-1`.
> 5. **La fecha de *Luzbelito*** (`RES-167`): 7 de octubre o 1 de agosto de 1996. La Redondopedia y
>    el afiche de octubre dicen una sola; está en
>    `Docs/SUGERENCIAS/HILO-para-investigador-y-contenido-la-fecha-de-luzbelito.md`. Por eso la
>    tarjeta dice solo el año.
> 6. **El posteo 5 del hilo de Twitter** (`difusion/hilo-twitter/`) describe el rombo y los nombres
>    viejos: quedó desfasado y no se rehízo.
> 7. **El lienzo** ("Sistema de marca Arcade Ricotero") no tiene el libro: la tapa en tres capas, la
>    hoja con canto y la tarjeta nueva nacieron en `UX-36` y en el código. Falta su hoja.
> 8. **En un teléfono real** (`UX-36` §12.6, y lo que `REV-19` deja sin máquina): una noche con
>    cronómetro, compartir con archivo en iOS y Android, el sello a pleno sol, NVDA o JAWS con las
>    teclas 1 y 2, y si alguna manera se lee más pobre.
> 9. El verso de cierre de «Juguetes perdidos» (`CL-1000`) sigue en `borrador`: entra solo si el
>    usuario lo confirma de oído y lo quiere (`D-57` punto 9).

> ## 📊 LA ANALÍTICA DE VERCEL (2026-10-02) — `D-56`
>
> Pedido del usuario: *"Activa el web analitics de vercel en el repo"*. Hecho en `main`, sin
> commitear todavía.
>
> - `@vercel/analytics` 2.0.1, pineado exacto, entra por la isla `src/scripts/analitica.ts`,
>   enganchada en `components/Cabeza.astro`: las 156 páginas la llevan, quiz incluido. Solo
>   corre en el sitio publicado.
> - No va con el `<Analytics />` del paquete: mete una etiqueta propia en el `<head>` y saca
>   al cuerpo las etiquetas de la tarjeta compartida. Detalle en `D-56`.
> - `islas.test.ts` lo suma a `PAQUETES_DE_CLIENTE`; `estilos.test.ts`, al censo de `ISLAS`.
>
> **Verificado:** `npm test` 1405/1405, `check` 0/0, build 156. En `astro preview` la isla
> pega `/_vercel/insights/script.js` en el `<head>` del portal, del quiz, de Skayboy y de la
> Redondopedia; las etiquetas `og:` siguen en la cabeza. El 404 de ese script en local es lo
> esperado: lo sirve Vercel.
>
> **Del usuario:** tener activado Web Analytics en el proyecto de Vercel (la pantalla de "Get
> Started" dice que sí), desplegar, y entrar al sitio publicado: los datos aparecen a los
> pocos segundos, con el bloqueador apagado.

> ## 🪑 LA MESA Y LA CARÁTULA: EL SITIO EN UNA PANTALLA ANCHA (2026-10-02) — `D-54`, ciclo 17
>
> **Rama `ciclo-17/escritorio`, sobre `main` en `039bebd`, integrada a `main`** a pedido del
> usuario (*"Luego integra todo"*) con el **PR #24**. Pedido: *"Hacé un ciclo entero y complejo de mejora visual de
> desktop para el home y todos los juegos. Debe quedar profesional y lindo en ambas formas
> desktop y mobile."* Y al final: *"dale, aplicá todo y cerrá el ciclo"*. Plan en
> `ORQ-plan-ciclo-17.md` (`T-311`..`T-319`); `T-311`..`T-318` cerradas, `T-319` es del usuario.
>
> **La idea:** en el teléfono la hoja va en la mano; en la computadora se apoya en una mesa, al
> lado de **la carátula del casete** que se tocó en el portal — la misma pieza de tapa, el mismo
> número de pista, el mismo disco, sacados del mismo dato (`JUEGOS`).
>
> **Lo que hay:**
> - **La carátula** (`components/Caratula.astro`, `lib/sitio/caratula.ts`) en los ocho juegos
>   menos Skayboy, como último hijo de `main`. Desde 64 rem es la columna izquierda, pegajosa y
>   con tope de alto: marca, pieza, etiqueta de papel, y la lista de temas A y B (la navegación
>   entre juegos), que **se va en partida** (y en la elección de "Ponelos"). En "Adiviná la
>   tapa" la pieza también se va en partida: es una respuesta (`piezaSopla`). En el teléfono es
>   una calcomanía en la esquina de la cabecera (pieza + "A3") que se va con la cabecera.
> - **El portal en la mesa** (`--ancho-mesa`, 76 rem): frente en dos columnas (marca y afiche),
>   lado A en tres por tres, lado B centrado; desde 80 rem la pieza a 84 px y la bajada entera.
>   Desde 46 rem la casetera deja de pisarse y el noveno se centra.
> - **Un título y un botón para los ocho juegos**: la rotulada en su peso (los ocho tenían
>   negrita falsa) en la tinta del disco, con el eco en su apoyo; el botón en la tinta del disco
>   con canto que se hunde. Tres juegos pasan del rojo de la marca a su disco (dos ejes, letra,
>   tapa).
> - **Skayboy entra entero**: la cabecera se acuesta en un renglón y los cortes de ×3/×4 la
>   cuentan (620/760 de alto). Cierra el traspaso de `T-271`.
> - **"Ponelos en fila" en dos paños** desde 80 rem; **"Sacalo por la letra"** con el buscador
>   pegado a los versos en la mesa.
> - Seis medidas nuevas en `tokens.css` (`--ancho-hoja`, `--ancho-tablero`,
>   `--ancho-tablero-amplio`, `--ancho-caratula`, `--ancho-mesa`, `--aire-mesa`).
> - **Skayboy sin botones en la computadora** (`D-55`, pedido al cerrar): con mouse las dos
>   columnas llevan una leyenda —quién es y sus tres teclas, que se encienden al apretarlas—;
>   sin mouse los botones siguen. Los botones quedan en el documento y el teclado los aprieta.
> - Papeles: `D-54`, `D-55`, `UX-35` (y enmiendas de `UX-10`, `UX-28` §5, `UX-04`), `REV-18` cerrada,
>   y la hoja 15 del lienzo escrita (`Docs/SUGERENCIAS/lienzo-hoja-15-la-mesa.dc.html`).
>
> **Verificado:** `npm test` 1405/1405 (18 nuevos en `caratula.test.ts`, `estilos.test.ts` y
> `contraste.test.ts`, cada uno con su rojo visto), `check` 0/0, build 156, validador `APTA`.
> Medido en Chrome sin cabeza por CDP a 1920, 1440, 1366 (768 y 657), 1280, 1100, 1024, 980, 812,
> 768, 720, 375 y 320, en portada, partida y resultado: los ocho botones de arranque entran a
> 1366×657, Skayboy sin teclas afuera en 21 tamaños (12 vueltos a medir después del último
> ajuste), la carátula se desplaza por dentro donde no
> entra, renglones táctiles de 51 px. `REV-18` (revisor, contexto fresco) comparó el teléfono
> contra el `HEAD` de antes: el portal da idéntico.
>
> **`REV-18`: 12 hallazgos (`FIND-99`..`FIND-110`), cuatro MEDIA.** Los once del hilo principal
> cerrados y vueltos a medir; `FIND-110` (el método de medición del checklist) lo cerró
> `experiencia` en `UX-35` §7.
>
> **Abierto, sin trabar:**
> - **El lienzo** (`T-319`): pegar la hoja 15 exige republicar el lienzo entero (2,5 MB, con el
>   editor adentro). Lo decide el usuario.
> - `experiencia`: sumar la leyenda de teclas de `D-55` a `UX-28` §2 y `UX-35` §5.
> - `contenido` puede revisar la cadena "Los casetes" (`CARATULA.lista`), que escribió el hilo
>   principal; `arquitectura` puede nombrar la cuarta portadora de `marca` en `ADR-03` §6.3.
> - Las páginas de lectura (Redondopedia, cancionero) no se tocaron: el pedido nombró el portal
>   y los juegos. Los atajos de teclado en los juegos de cuatro opciones quedan como idea.
>
> **Del usuario:** mirarlo en una computadora con mouse y en el teléfono, y si se republica el
> lienzo con la hoja 15.

> ## ⌨️ SKAYBOY CON EL TECLADO, Y EL USUARIO CONFIRMA LOS NIVELES (2026-10-02) — `D-53`
>
> **Rama `claude/busy-cannon-sfkwxd`, reiniciada sobre `main` en `2c398a9`** (el PR #22, que
> integró todo lo de abajo, ya está mergeado). Pedido del usuario: *"que en desktop se pueda
> jugar con awsd y las flechitas. Confirmo que los niveles son jugables"*.
>
> - **W A D para Skayboy, las flechas para Poligirl** (`D-43` decide quién es quién). Cada tecla
>   aprieta el mismo botón del mando que el dedo; el mapa vive en `lib/skayboy/teclado.ts`, con
>   sus tests. Con mouse, cada botón muestra su tecla; en el teléfono, no. Ctrl/Alt/Cmd no
>   aprietan nada, las flechas no desplazan la página, y al perder el foco se suelta todo.
> - **Los niveles, confirmados por el usuario**: se cierran las notas de excepción de `D-51`
>   en el PRD y en `CTR-16.7` (sin afirmar que fue de a dos, que no lo dijo).
>
> **Verificado:** `npm test` 1387/1387 (6 nuevos en `teclado.test.ts`, dos con su rojo visto
> antes de cablear), `check` 0/0, build 156, y en Chromium de escritorio: D hunde la tecla de
> Skayboy y lo mueve, las flechas mueven a Poligirl, al soltar no queda nada apretado, Ctrl+D no
> aprieta nada, las flechas no desplazan la página; a 812×375 táctil la letra no aparece.
> `producto` y `arquitectura` cerraron sus notas de excepción con la cita del usuario, y las dos
> dejan dicho que **`deDos` sigue sin probar que se jugó de a dos**: la confirmación dice
> "jugables", no con cuántas personas. `ADR-08.10` suma la línea del teclado.
>
> **Del usuario:** nada nuevo; lo de abajo sigue.

> ## 🚪 LO QUE NADIE PODÍA ENCONTRAR, ADENTRO DEL SITIO (2026-10-01, noche) — `D-51`
>
> **Rama `claude/busy-cannon-sfkwxd`, sobre `main` en `2678050`** (con el #21 de Oktubre ya
> adentro). Pedido del usuario sobre un relevamiento de otro agente: *"Resolvé todo de la mejor
> forma y dejalo integrado en el sitio."* Dos cosas las decidió él, a pregunta: **publicar
> Skayboy ya** y **la casilla de corrección**, que dio él.
>
> **Lo que quedó integrado:**
> - **"¿Qué tipo de ricotero sos?"** con casete A2 (*Luzbelito*, la cabeza con la vela),
>   renglón del lugar (`Una vela te alumbra media cara.`), bajada de `CNT-26`, compartir como
>   identidad y lectura del desafío al llegar.
> - **Skayboy y Poligirl publicado**: seis niveles `listo` (`deDos: true` = el usuario se hizo
>   cargo), casete A9 vistiendo *Gulp!* con el "Gulp." del sobre. Producción siembra los seis.
> - **Casilla de corrección conectada** (partida en el código; un test vigila que no quede
>   escrita entera) y **botón al pie de cada artículo de la Redondopedia**, con un selector
>   "Qué parte" (el artículo, cada dato, cada párrafo) que manda texto, rótulo y ubicación
>   como pide `CTR-10` §2.1. El transporte de mail es una fábrica con sus tres tests.
> - **"Adiviná el tema" lee su desafío**; **tapa, letra y dos ejes comparten** (módulo nuevo
>   `scripts/compartir.ts`, texto y enlace, sin tarjeta).
> - **Spotify**: 7 preguntas del quiz con ID de 5 temas verificados (`INV-140`).
> - **"Más o menos"**: 44 datos `listo`, 16/16/12 (+9: entraron 10 de los 18 pendientes y
>   `REV-17` hizo retirar `MM-40`, cuyo objeto la cita no respalda; `CNT-25` §2).
> - **Redondopedia 38/38**: las tres bandas de después como `concepto` (`BR-34`, `BR-35`,
>   `CNT-28`), con siete enlaces de entrada que cuida `redondopedia.test.ts`.
> - **Calcomanías**: el muñeco del antifaz (*Un baión*) y el rótulo con la mosca (*La mosca y la
>   sopa*; el gato momificado no está en ninguna imagen del repo).
> - **"Ponelos en fila" con filas nuevas** (`D-52`, elegidas por el usuario): EN EL POGO ·
>   SALTANDO · CABECEANDO · QUIETITO. Mismos números de fila: los enlaces viejos abren igual.
> - **El bondi del casete de "Adiviná la tapa"**, recortado al contorno: quedaba chiquito (pedido
>   del usuario en la misma sesión).
> - **Peso muerto, ~4,9 MB menos publicados**: video duplicado, cinco derivados de tapa sin
>   pantalla, la fuente *Redonditos Fan*, la copia de "en la cocina". La hoja de Skayboy, el
>   lobo-lupus y el ensayo se mudaron a `Docs/UX/` (no se borraron).
> - **"Completá la letra" de 21 a 72 versos** (24/23/25, 39 temas): selección curada de fuente
>   única ampliada bajo `D-25` (`CNT-27`), ahora que la corrección llega por mail. Salió
>   `CL-601` (respuesta sin tilde). Seis temas pasan de 8 versos visibles (`CTR-04.4`,
>   precaución). `contenido` dejó dos propuestas en
>   `Docs/SUGERENCIAS/CNT-para-hilo-principal-anotaciones-y-erratas-que-pasan-el-filtro.md`
>   (endurecer el filtro y vetar distractores con erratas), sin tratar.
>
> **Lo que la red no dejó:** el cotejo de dos fuentes de la letra. lacuerda.net (la única
> independiente de cifraclub/letras.com, que son de Studio Sol) está bloqueada por la política
> de red del entorno; `RES-142`..`RES-145` quedaron cancelados (`INV-141`). Los lotes se
> regeneran desde `letra.json` cuando se habilite `acordes.lacuerda.net`.
>
> **`REV-17`, cerrada el 2026-10-02:** trece hallazgos (`FIND-86`..`FIND-98`), doce cerrados
> (`Docs/REVISIONES/REV-17-lo-que-nadie-podia-encontrar.md`, con la tabla de cierre). Ninguno
> le marcaba error al que sabe. Queda abierto `FIND-98` (el largo del portal, `experiencia`).
>
> **Verificado al cerrar:** `npm test` 1381/1381 (eran 1373; cada test nuevo con su rojo
> visto), `check` 0/0, **build 156**, y en la vista previa a 375 px: los nueve casetes sin desborde,
> los cinco desafíos al llegar (y uno de otro juego o con un cuadrante inventado no pinta nada),
> dos ejes y tapa compartiendo, la corrección con "Mandá por mail" en la Redondopedia, las dos
> calcomanías, Skayboy cargando sus seis niveles en el build de producción. `revisor` con
> `REV-17` en curso.
>
> **Del usuario, y solo del usuario:**
> - Los **temas enteros en mp3** (`npm run generar-fragmentos -- "<carpeta>" --enteros`) y los
>   9 temas sin fragmento (*Cordero atado* y "Pianito").
> - Abrir en un navegador los dos IDs de Spotify ambiguos (*Mi perro dinamita*, *La bestia
>   pop*, `INV-140`) si quiere su botón.
> - Si quiere el cotejo de la letra: habilitar `acordes.lacuerda.net` en el acceso de red.
>
> **Abierto, sin trabar:** el largo del portal con once casetes (`FIND-98`, `experiencia`,
> `UX-25`); sacar `temaFijo` de `skayboy.json` (resto de la cinta: `arquitectura` ya dijo qué
> toca, `contratoVersion: 4`); `CNT-29` (renglón del lugar de Skayboy y la comparación al
> volver de dos ejes); Skayboy no comparte (la pieza de `BR-27` no está diseñada); `MM-40`
> espera la nota de Infobae; las propuestas de `contenido` sobre el filtro de la letra
> (`Docs/SUGERENCIAS/CNT-para-hilo-principal-anotaciones-y-erratas-que-pasan-el-filtro.md`).
> Ojo de `arquitectura`: corregir un nivel publicado de Skayboy lo devuelve a `borrador`
> (`CTR-16.7` pone `deDos: false` al tocar la grilla) y lo saca del sitio.

> ## 🍂 OKTUBRE, LA MOSCA QUE SE ACERCA, Y SIN CINTA (2026-10-01)
>
> **Rama `ciclo-16/mas-o-menos`, sobre `0ebfa8f`** (la mezcla con `main` que trajo el #18 y el
> #19). **Integrado a `main` con el PR #21** (`2678050`). Dos pedidos
> del usuario el mismo día, registrados en `D-49` y `D-50`:
>
> 1. *"Entramos en OKTUBRE, el mes del disco, hagamos que la página refleje esto. […] que la
>    mosca en desktop vuele alrededor del mouse […] y en mobile que vuele como ahora pero si
>    el usuario toca trate de ir a volar alrededor de donde toca. Que todas las entradas de
>    juegos del home tengan un detalle o un disco entero, no el svg del cassete, cada uno
>    diferente."* → `D-49`.
> 2. *"Saquemos lo de la cinta en todos lados, en el juego de adivinar el tema a veces salta
>    sola y hace un ruido blanco molesto."* → `D-50`.
>
> **Lo que hay:**
> - **El afiche de octubre** en el portal: sello OKTUBRE, estampa "EL 4 CUMPLE 40" (cambia el
>   4 y el 5, y cuenta los años con la fecha del teléfono), y un almanaque con **los seis de
>   los diez discos que salieron en octubre** (*Oktubre*, *¡Bang! ¡Bang!*, *La mosca y la
>   sopa*, *Lobo suelto*, *Cordero atado*, *Luzbelito*), sacados de las fichas rotuladas
>   `hecho` por `lib/sitio/oktubre.ts`. Solo se ve en octubre, decidido en la cabeza del
>   portal antes del primer cuadro. El botón abre "Adiviná el tema" con *Oktubre* elegido
>   (`?disco=oktubre`, nuevo en `partida-tema.ts`).
> - **Los nueve casetes** con una pieza de tapa distinta: tres tapas enteras, tres detalles,
>   tres recortes; ninguno con el casete dibujado ni con el perro. `portal.test.ts` falla si
>   vuelve un dibujo, si dos repiten, o si una pieza no acredita su disco (`D-21`).
> - **La mosca**: física pura en `lib/sitio/mosca.ts` (10 tests, con rojo visto), isla en
>   `scripts/mosca.ts`. Con mouse revolotea a 26–110 px del puntero; con el dedo, un toque
>   (no un arrastre) la lleva ~4,5 s y vuelve al recorrido de CSS sin salto.
> - **La cinta, afuera**: interruptor, cama, rocola, púa y rutas sonoras borrados con sus
>   tests. El audio de los juegos no cambió. Skayboy suena con sus tres efectos, sin tema
>   fijo y **sin forma de callarse** (decisión abierta para `experiencia`).
>
> **Verificado:** `npm test` 1373/1373 (eran 1442: se fueron los tests de la cinta y entraron
> 21 nuevos), `check` 0/0, build 153, validador `APTA`. En la vista previa a 375 px: el
> afiche, los nueve casetes, el crédito con los ocho discos, el botón que llega con *Oktubre*
> elegido y 9 temas, ninguna `.cinta` en ninguna pantalla, Skayboy cargando en el build.
> La mosca se midió con eventos sintéticos (el panel oculto no da cuadros de animación).
>
> **Abierto, sin trabar:**
> - **El lienzo** (hojas 08 y 09) no muestra el afiche ni los tres materiales del casete. No
>   entró ningún token nuevo, pero es estructura nueva y el circuito de `diseno-marca.md`
>   pide que empiece en el diseño.
> - `Docs/SUGERENCIAS/HILO-para-todos-se-saco-la-cinta.md`: cada rol marca sin vigencia lo
>   suyo (`ADR-04`, `ADR-07`, `UX-21`, `UX-26`, `CNT-20`…), y `arquitectura` decide si se
>   borra el campo `temaFijo` de `skayboy.json`.
> - Si el dev server tira 504 en `kaplay.js` después de un build, se reinicia `astro dev`.
>
> **Del usuario:** el commit, y probar la mosca con un mouse de verdad y en el teléfono.

> ## 🔢 "MÁS O MENOS": EL JUEGO NUEVO, `US-10` (2026-09-25, tarde)
>
> **Rama `ciclo-16/mas-o-menos`, sobre `ciclo-16/lo-barato-que-se-ve` en `4345b66`.** Pedido
> del usuario: *"tomá un juego barato del estado que no esté hecho y resolvelo completamente"*.
> Se tomó `IDEA-11`, la otra barata del backlog (`IDEA-09` ya era `US-06`). A mitad de camino
> el usuario lo amplió: *"que sean preguntas con respuesta de número pero diferentes, no todo
> sobre las letras, sino cuántos integrantes son, cuántos años tocaron… investigá el juego"*.
>
> **Qué es (`D-48`, reescrita ese mismo día):** una pregunta con respuesta de número y una
> referencia de la misma unidad —un número que pone el juego, u otro dato con su número a la
> vista—; el jugador dice **Más** o **Menos** (para años, **Antes** o **Después**). Hasta el
> primer error; el puntaje es la racha. Siete familias que rotan como un mazo: la banda, la
> gente, los recitales (35 datos a mano de `INV-100`), y los discos, lo que dura, en vivo y las
> palabras (derivados en build de `RES-20`, `setlistfm.json` y el cancionero: ~230 más). Las
> palabras se cuentan **en cuántos temas**, no cuántas veces: *criminal* suma 37 en un solo tema
> porque cifraclub escribió cada vuelta del estribillo.
>
> **El papel, entero:** `INV-93` (el género: el *Higher Lower Game*, la encuesta de *Card
> Sharks*, los diarios numéricos que revelan de golpe) · `INV-100` (111 números con fuente,
> con nota del hilo principal sobre las filas que no sirven) · `US-10`, `BR-32`, `BR-33` y una
> enmienda de `BR-18` (b) acotada a `US-10` (`PRD-mas-o-menos.md`) · `CTR-20` con schema e
> invariantes `i1`..`i24` · `UX-34` (viste *Un baión para el ojo idiota*, el único disco
> libre) · `CNT-25` · `IDEA-11` marcada promovida.
>
> **El código:** `src/lib/mas-o-menos/` (conteo, referencia por escalones de racha con bordes
> que nunca regalan la respuesta, partida con bolsa de familias, pozo, copy),
> `leerDuraciones`/`leerDiscos` en `letra/temas.ts`, la isla, la página, el casete del portal
> y el renglón del lugar, y `npm run medir-mas-o-menos` para mirar el pozo a ojo.
>
> **`REV-16`, cerrada el mismo día:** seis hallazgos (`FIND-80`..`FIND-85`), los seis
> cerrados. Los dos `ALTA` eran de veracidad: **MM-01** preguntaba "tocando por primera vez"
> en 1976 y `RES-05` solo dice "origen" (el primer show es el Lozanazo, 1977), y **MM-23**
> ("cuántos años se llevan el Indio y Skay") da 2 o 3 según el día del año; `contenido` los
> reformuló. `revisor` recontó a mano las 20 palabras y los otros 33 datos: coinciden. Se
> sumaron los 14 rojos del schema (con mutación vista) y, por la enmienda de `BR-18` (b), la
> caja de referencia de un par de setlist.fm dice fuente y fecha **sin enlace**: la página de
> estadísticas lista todos los conteos, y un enlace antes de responder regalaría la respuesta.
>
> **Verificado al cerrar:** `npm test` 1439/1439, `check` 0/0, build 153, validador `APTA`, y
> jugado en la vista previa a 375 px (pares de en vivo con fuente y fecha, años con
> Antes/Después, el desplegable de temas de una palabra, el resultado, el desafío de un
> amigo, el casete en el portal).
>
> **Abierto, sin trabar:**
> - La fila de *Un baión* en el mapa sección→disco de `UX-04` (el mismo pendiente que dejaron
>   `UX-06` y `UX-23`).
> - `RES-106`..`RES-139` libres, por si se quiere una segunda ronda de números (las tres
>   bandas de después de la separación, `RES-47`).
> - **Integrado a `main` el 2026-09-25**, a pedido del usuario (*"mergeá el #18 y después
>   este"*): primero el #18 (ráfagas 4 y 5), después el #20 (este juego, con los tres commits
>   de "lo barato que se ve", que no tenían PR propio). Para mergear el #20 hubo que traer
>   `main`, que ya tenía el #19 (el pulido de arte): cuatro conflictos, resueltos quedándose
>   con los dos lados (la portada, el casete de Momo, `ESTADO`) y, en el botón de "Adiviná
>   el tema", con el de `main`, que ya traía el arreglo de la negrita falsa. Sobre la mezcla:
>   `npm test` 1442/1442, check 0/0, build 153, validador `APTA`, portal y juego mirados en la
>   vista previa.
> - **Lo que el usuario puede revertir:** si prefiere "cuántas veces" en vez de "en cuántos
>   temas" para las palabras, `D-48` dice qué cuesta.
>
> **Del usuario:** jugarlo en el teléfono, y el push y el PR.

> ## 🧹 LO BARATO QUE SE VE: SIETE ARREGLOS EN LO PUBLICADO (2026-09-25)
>
> **Rama `ciclo-16/lo-barato-que-se-ve`, sobre `main` en `b1a5bb4`** (o sea, encima de las
> ráfagas 4 y 5 del PR #18). Pedido del usuario: analizar el estado y resolver lo más barato
> que más valor le agregue a la página. Se jugó el sitio publicado en un teléfono emulado y se
> cruzó con una clasificación de los 121 traspasos (39 abiertos, 82 resueltos en disco). Todo
> lo de abajo toca lo que la gente ya ve, nada de Skayboy.
>
> 1. **La portada decía "EN LA COCINA" de "Completá la letra"**, uno de los cuatro juegos de la
>    v1, mientras su página ya se jugaba. Ahora el portal le pregunta al banco con el mismo
>    `cargarBanco()` que la página (`src/lib/sitio/portal.ts`).
> 2. **Los discos sin tildes.** La cabecera de la letra y el cancionero armado decían "ULTIMO
>    BONDI A FINISTERRE" o "GULP" pelado. Hay un solo mapa de títulos, en `letra/discos.ts`.
> 3. **Los distractores de la letra se delataban solos** (11 de 19 ítems): "GUITARRA", "tiem",
>    mayúsculas mezcladas, tildes perdidas. Filtros y forma nuevos en `generar-letra.mjs`.
> 4. **La respuesta a la vista en su contexto** (5 de 19): se descartan esos huecos. `contenido`
>    eligió 7 reemplazos (`CNT-23`): **21 `listo`, 9 fáciles, 7 medias y 5 difíciles** (antes
>    19, con 11 / 4 / 4). La semilla del sorteo pasó a ser la huella del verso, así un
>    `--reanclar` ya no vuelve a sortear todo el banco.
> 5. **Un verso roto que salía como pista**: "para ,l mi viejo" (*Maldición…*) era una `é` en
>    cp850. Arreglado en el dato y como errata en `ingerir-cancionero.mjs`.
> 6. **Créditos de tapa** (`CNT-24`): `TP-007`/`TP-008` firman "Rocambole, Semilla y
>    Meroyuela" (cierra `FIND-21` de `REV-05`), y la ficha de disco de la Redondopedia ya no
>    dice "Rocambole" fijo en los diez: *La mosca y la sopa* dice "autoría sin confirmar".
> 7. **Negrita falsa** en los botones de "Adiviná el tema" y "Adiviná la tapa" (Archivo Black
>    tiene un solo peso). `estilos.test.ts` la mira en todo el sitio.
>
> **Verificado:** `npm test` 1364/1364 (23 nuevos, cada uno con su rojo visto), `check` 0/0,
> build 152, validador `APTA`, y la vista previa del build jugada a 375 px. Traspasos:
> `HILO-para-contenido-y-arquitectura-los-distractores-se-delataban.md` (la tabla final de los
> 21, y la diferencia entre `CTR-04.8` y lo que hace el script).
>
> **Lo que quedó recomendado y no se hizo, por no ser barato:** la puerta de "¿Qué tipo de
> ricotero sos?" en la portada (terminado, sin enlace; pide `experiencia` por el largo del
> portal de `UX-25` y el casete Luzbelito, y `contenido` por la copia); fichar lacuerda.net (21
> temas afuera de la letra); limpiar las letras de *La bestia pop* y *Criminal mambo*, que
> quedaron afuera del pozo.

> ## 📝 EL MISMO PULIDO, EN "SACALO POR LA LETRA" (2026-09-25)
>
> **Pedido del usuario:** *"dale, hacé lo mismo con sacalo por la letra"*, después del pulido
> de "Adiviná el tema" de abajo.
>
> **Integrado a `main` el 2026-09-25**, a pedido del usuario (*"integralo"*), después de
> traer `main` con el ciclo 16 adentro (PR #16 y #17). El único choque fue este archivo; el
> código se mezcló solo —`main` cambió cómo se arma la vuelta (`armarVuelta`,
> `armarRonda`) y el pulido cambió cómo se ve— y se verificó sobre la mezcla:
> **`node --test 'src/**/*.test.ts'` 1085 en verde**, `npm run check` 0 errores, build 152,
> y los recorridos de los dos juegos y del portal en el navegador sobre el build.
>
> **Verificación:** `node --test 'src/**/*.test.ts'` **676 en verde** (3 nuevos, de la
> escalera de versos) · `npm run check` 0 errores · `npm run build` **152 páginas** · los
> dos juegos recorridos enteros sobre el build a 390×664, 360×740 y 1280×860, sin
> desborde lateral.
>
> ### Lo común pasó a un módulo: `src/scripts/sacar-temas.ts`
>
> La tapa impresa por pasadas, su crédito (`D-21`), las casillas de la vuelta, la
> escalerita, la vibración del acierto y **el modo teclado** vivían solo en la isla de
> audio. Ahora los usan las dos. Está declarado en el censo de `estilos.test.ts` como
> tablero propio, con sus estados (`partida--tecleando`, `vuelta-casilla--*`,
> `escalerita-paso--*`), que salieron de `ESTADOS_TEMA`.
>
> ### Qué cambió en el juego
>
> - **Portada:** chapa de puntajes (1 · 2 · 4 · 8 versos → 100 · 80 · 60 · 40) y JUGÁ con
>   canto en el peltre de Momo.
> - **Partida:** casillas de la vuelta; "Tenés 4 versos · Vale 60"; **"Pasá (+2 versos)"**
>   y "Mirá cuál era" en el último; lo ya arriesgado tachado en la lista; Enter elige el
>   primero. **La hoja de versos es papel** (tinta del fondo sobre `--papel`, par testeado,
>   renglones en el borde del papel): el lugar del juego ya decía "un papel arrugado te pesa
>   en el bolsillo". **Diverge de `UX-08` §4** (que pedía el gris elevado): queda para que
>   `experiencia` lo ratifique.
> - **Con teclado:** acá lo que no se puede perder son los versos. La hoja y la lista **se
>   reparten el alto** (la hoja nunca baja de dos renglones) y la hoja vuelve sola al verso
>   nuevo. Si el foco llega sin teclado, la cabecera vuelve (consulta de contenedor).
> - **Revelación:** sellos "¡Lo sacaste!" / "+60", vibración, y **la tapa del disco impresa
>   por pasadas**, que este juego no tenía. Por eso el pie ya no se esconde con el tema
>   revelado: el crédito de la tapa vive ahí (la regla del pie lo había dejado escrito).
> - **Resultado:** "1 de 5 temas · 60 de 500 puntos", estampitas y escalerita de 4.
>
> ### 🔴 Un defecto que se había colado en el pulido anterior, cerrado
>
> El sello "¡La sacaste!" se pintaba sobre `.revelacion.ok .micro`, que **también existe en
> este juego**: acá ocupaba el renglón entero y, torcido, desbordaba la pantalla por el
> costado. Ahora el sello mide lo que dice (`width: fit-content`) y los dos juegos lo llevan
> en el mismo renglón de cabeza. Medido: 390 de ancho en los dos.
>
> ### Lo que queda
>
> | Qué | Dueño |
> |---|---|
> | Probar los dos modos teclado en un iPhone y un Android de verdad | usuario |
> | Ratificar la hoja de papel contra `UX-08` §4, y pasar la regla, los sellos y la escalerita al lienzo (hoja 08) | `experiencia` |

> ## 🎛 PULIDO DE ARTE: EL PORTAL Y "ADIVINÁ EL TEMA" (2026-09-24)
>
> **Pedido del usuario, textual:** *"pulido intenso y mejora de arte del home y el juego de
> adivinar el tema, debe quedar impecable en mobile [...] fácil de jugar, lindo de ver y
> satisfactorio de ganar [...] tené en cuenta la UX como que para escribir necesitan
> teclado. Mejoremos la barra de tiempo en el juego, se ve muy ai slop."*
>
> **Verificación:** `node --test 'src/**/*.test.ts'` **673 en verde** · `npm run check` 0
> errores (los mismos 15 avisos menores de antes) · `npm run build` **152 páginas** ·
> recorrido entero medido en el navegador sobre el build, a 390×664, 360×740 y 1280×860.
> Ojo: `npm test` a secas corre 154, porque el `**` del script no lo expande el `sh` de
> este contenedor; la cuenta de 673 es con el patrón entre comillas.
>
> ### La barra de tiempo dejó de ser una barra
>
> Las seis cajitas grises con relleno naranja y borde petróleo eran la barra de progreso
> por defecto de cualquier reproductor. Ahora es **una tira de papel impresa como una
> regla, que sale del casete**: cada escalón es un tramo separado por un corte de tinta,
> con rayitas cada medio segundo; lo que todavía no te dimos está **tramado**, lo que te
> dimos es papel limpio, y lo que escuchaste queda **entintado** en el naranja de Lobo
> suelto con `multiply`. Una **aguja** corre mientras suena y se para en el tope. Los seis
> números van abajo (antes faltaban 0,1 y 0,5) y el del tope se estampa. La tecla de
> escuchar tiene canto, se hunde al tocarla y **queda trabada mientras suena**, como el
> PLAY de una casetera.
>
> ### Con el teclado abierto, la pantalla es otra (`partida--tecleando`)
>
> En un teléfono el teclado tapaba justo lo que se usa: lista, caja y botón. Ahora, con el
> foco en la caja y puntero táctil, la partida ocupa **exactamente la ventana visual**
> (`visualViewport`) como columna pegada arriba del teclado: tecla + regla compacta, el
> último intento, la lista (lo único que cede alto), la caja y el botón. **El teclado no se
> cierra al tocar un botón de la partida** (`mousedown` prevenido): errar deja escribir de
> nuevo en el acto mientras suena el escalón nuevo; acertar lo cierra. Enter ("Ir") elige
> la primera sugerencia y, con un tema elegido, arriesga. Lo ya arriesgado queda tachado y
> sin poder elegirse ("Ya lo probaste"). **Medido en emulación, no en un iPhone real.**
>
> ### Lo demás
>
> - **Portada del juego:** la chapa de puntajes en papel (audio / vale) reemplaza la mitad
>   de la bajada que contaba la escalera en prosa.
> - **Partida:** casillas de la vuelta en la cabecera (llena, tachada, la que va);
>   renglones numerados con el audio de cada intento; "Vale 100"; **"Pasá (+0,4 s)"**
>   dice cuánto audio compra, y en el último intento dice "Mirá cuál era".
> - **El acierto:** "¡La sacaste!" y "+100" son sellos que caen y apoyan
>   (`sello-golpe`, en el compás de `--duracion-pasada`, en `ANIMACIONES`), más un toque de
>   vibración donde hay motor. Errar no se mueve ni vibra.
> - **Resultado:** "3 de 4 temas · 260 de 400 puntos" y una **escalerita** por tema con lo
>   que pasó en cada escalón (tachada, raya, llena), distinta por forma.
> - **Portal:** el sello JUGÁ se leía a **1,95:1** (tinta del disco sobre papel): ahora es
>   un sello lleno, `--fondo` sobre la tinta del disco, par ya testeado. Los casetes de
>   "Sacalo por la letra" y "Adiviná la tapa" pegan el recorte real de su disco (medallón
>   de Momo, bondi) en vez del casete dibujado; cada casete lleva su número de pista (A1…
>   B2); tocar un casete da señal. **El crédito del pie ahora nombra los discos de los
>   recortes** (antes el lobo y la mosca no se acreditaban): `discoDeRecorte` en `arte.ts`.
>
> ### Lo que queda, con dueño
>
> | Qué | Dueño |
> |---|---|
> | **Probar el modo teclado en un iPhone y un Android de verdad** (la emulación no abre teclado; se simuló achicando la ventana) | usuario |
> | Reflejar la regla, los sellos del acierto y la escalerita en la hoja 08 del lienzo (no se tocó ningún hex ni token: todo sale de `tokens.css`) | `experiencia` |
> | `.arriesgar` y `.seguir` tienen canto solo en este juego (`.juego-tema`): "sacalo por la letra" comparte las clases y no se tocó | `experiencia` |
> | `escalera.ts` perdió `tramosConEtiqueta` y `PISO_ETIQUETA_PCT` (los seis números entran por ancho mínimo); suma `etiquetaDeRegla`, `extraAlPasar` y `formatoSegundos`, con test | — |

> ## 📱 EL USUARIO JUGÓ EN SU TELÉFONO: `D-47` Y LA RÁFAGA 5 (2026-09-24, tarde)
>
> **PR para probar: https://github.com/knesantos/ArcadeRicotero/pull/18** (rama
> `ciclo-16/pantalla-completa-y-victoria`, ráfagas 4 y 5). El #17 ya está mergeado en `main`
> (`e5a2692`), junto con el #16, la auditoría de prompts; `main` local los integró en `b56dfaa`.
> La vista previa de Vercel siembra los borradores (`nivelesASembrar`) y está detrás del login
> de Vercel.
>
> **Lo que dijo después de jugar el nivel 1:** los controles se sienten bien; **el scroll
> horizontal rompe los controles**; quiere pantalla completa con los controles medio
> transparentes encima, los seis niveles en fila, una victoria donde los dos bailen, y
> guitarras para Skay y cigarrillos para Poli. Todo en **`D-47`**, que enmienda la
> prohibición de festejo de `BR-23`: **cada uno baila su propio baile, sin gestos de pareja.**
>
> **Ráfaga 4 cerrada y revisada** (`T-295`, "Segunda pasada" al final de `REV-15`): los siete
> `FIND-71`..`FIND-77` cerrados en disco, `npm test` 1161/1161, check 0/0, build 152, auditor
> 0, validador `APTA`. "Adiviná el tema" reparte 8/56/31; "Completá la letra" saca su nivel
> del conteo (el contexto sigue al nivel, `BR-30`/`CTR-04.14`); la sala tiene puerta abierta
> (`sala.v2`, `UX-32`) y el botón `#seguir-juego`. Dos anclas de la letra quedaron en
> `fuenteUnica.enEspera` hasta que `contenido` elija versos nuevos
> (`HILO-para-contenido-dos-anclas-sin-vecinos.md`).
>
> **Papel de la ráfaga 5 cerrado:** `BR-31`, `UX-33`, `CTR-16.4` (v3: un tesoro por personaje),
> `CTR-16.11` (el avance, `arcade.skayboy.avance`), `CTR-15.7` (`baila`, 4 cuadros a 8/s),
> `ADR-10` (`ARQ-pantalla-completa.md`) y `CNT-22`, verificados y alineados.
>
> **Código de la ráfaga 5 cerrado y revisado** (`T-300`..`T-304`, "Tercera pasada" de `REV-15`;
> `FIND-78` y `FIND-79` cerrados por el hilo principal ahí mismo). `npm test` 1341/1341, check
> 0/0, build 152, auditor 0 (7 PNG), validador `APTA`.
>
> - **Pantalla completa** (`ADR-10`, `UX-33 §1`): el sello de la esquina entra y sale; sin
>   scroll ni zoom; la del sistema se pide sobre `.fichin` donde existe, y en iPhone el modo
>   ocupa la ventana. `pantalla.ts` (encuadre entero) y `modo-pantalla.ts` (el modo, jugable en
>   Node).
> - **Victoria bailada** (`UX-33 §2`): `baila`, 4 cuadros a 8/s, coreografías distintas, sin
>   moverse; el contador «1 guitarra» / «1 cigarrillo» solo ahí; el toque sigue. **Al ganar el
>   sexto, el toque vuelve a `NIV-01`**: la pieza compartible de `BR-27` todavía no existe
>   (traspaso a `producto` y `experiencia`).
> - **La fila y el avance** (`CTR-16.11`): `arcade.skayboy.avance`, `avance.ts`.
> - **Guitarras y cigarrillos** (`CTR-16.4` v3): 1/1, 1/1, 2/2, 2/2, 2/2, 2/2; solo el dueño
>   junta el suyo; trazas regrabadas. Atlas `skayboy.v2`, `poligirl.v2`, `sala.v3`.
> - **Hoja del baile para el usuario:** `hoja-baile.png` (scratchpad de la sesión). Espera su
>   aprobación (`D-44`), igual que la hoja 14.
>
> **Abierto, sin trabar:** la puerta abierta queda detrás del muñeco (traspaso a
> `experiencia`); si cada coleccionable tiene que probarse alcanzable en el build (traspaso a
> `producto`/`arquitectura`); `E11` de `CTR-16.10.10` no está en `niveles.ts`; el sello muestra
> el estado («PANTALLA NORMAL») con el molde de la cinta, y hay que ver en el teléfono si se
> entiende que se toca para agrandar.

> ## ✅ CICLO 16, RÁFAGA 3 CERRADA Y REVISADA: `REV-15` (2026-09-24)
>
> **`npm test` 1081/1081 (eran 673 al abrir el ciclo) · `npm run check` 0/0 · build 152 ·
> validador `APTA` · auditor de paleta 0.** Todo commiteado en `main` y cada commit de código
> probado en un worktree limpio. El último de código es `3fe5dc6`. **No se hizo push.**
>
> ### Lo que ya es juego
>
> - **Seis niveles de Skayboy y Poligirl**, en `borrador`, cada uno con su traza grabada
>   que `npm test` vuelve a jugar: escalones 2/2/2, tolerancia sobre la de su escalón,
>   paridad contada. Los mecanismos (palanca, placa, compuerta, caja) andan en el mundo.
> - **La isla dibuja con los sprites aprobados.** Para verlo: `npm run dev` y
>   `/juegos/skayboy-y-poligirl/?nivel=NIV-04` (el parámetro solo existe en desarrollo).
> - **"Adiviná el tema" tiene 8 Fáciles por conteo en vivo** y **"Sacalo por la letra"
>   saca la dificultad del conteo en tercios** (`D-46`). `popularidad.ts` ya no existe.
>
> ### `REV-15`: un `ALTA` y seis `BAJA`
>
> **`FIND-71` (`ALTA`):** en "Adiviná el tema" `BR-30` ya decidió tercios para Media y
> Difícil, pero el código sigue con 8/82/5 y `CTR-19.14` lo lista como abierto. `FIND-72` a
> `FIND-77` son colas chicas: traspasos a `arquitectura`, un comentario falso, una
> justificación de `NIV-03` y dos evasiones que el auditor de la isla no caza.
>
> ### El usuario, hoy
>
> - **"Completá la letra" también sale del conteo** (precisión de `D-46`). Es `T-286` a
>   `T-288` (`ORQ-plan-ciclo-16.md §2.4`).
>
> ### Próximo paso: la ráfaga 4 (`ORQ-plan-ciclo-16.md §2.5`)
>
> `T-286`..`T-288` ("Completá la letra"), `T-289`/`T-290` (que ganar se vea: hoy la sala no
> tiene puerta abierta), `T-291`/`T-292` (`FIND-71`), `T-293`/`T-294` (las colas de
> `REV-15`) y `T-295` (la revisión). Rango ampliado a `T-295` en `Docs/IDS.md`.
>
> **Lanzada el 2026-09-24 a las ~13:45 como el workflow `wf_46a0a8b5-004`.** Si se corta,
> se retoma con `resumeFromRunId` y lo terminado vuelve de caché. Al terminar: pegar la
> "Segunda pasada" que devuelve `T-295` al final de `REV-15`, commitear probando en un
> worktree limpio, y mirar en el navegador que ganar se vea (`?nivel=NIV-01`).
>
> ### 🔴 Lo que es del usuario
>
> | Qué | Traba |
> |---|---|
> | **Jugar los seis niveles en un teléfono**, de a dos y solo | que pasen a `listo` y producción los sirva |
> | Los temas enteros: `npm run generar-fragmentos -- "<carpeta>" --enteros` | que el juego suene (`D-39`) |
> | Push a GitHub | nada: `main` local tiene todo |

> ## 🕹 CICLO 16, RÁFAGA 2 CASI CERRADA, Y TRES COMMITS EN MAIN (2026-09-24)
>
> ### Lo que decidió el usuario hoy
>
> - **Aprobó la paleta del pixel (hoja 14 del lienzo) y los dibujos.** Ya están en
>   `tokens.css` (15 `--px-*`) y en `public/sprites/` (tres atlas; el auditor los da en regla).
>   La hoja del pixel es la **14, no la 13**: `tokens.css` ya llamaba hoja 13 a la imprenta.
> - **`D-46`: la dificultad de todo juego con canciones sale del conteo de veces tocado en
>   vivo.** Enmienda `D-27`. Abre `T-282`..`T-285` (`ORQ-plan-ciclo-16.md §2.4`).
> - **"Commitea e integra a main"**. Hecho en tres tandas, cada una probada en un worktree
>   limpio con `node_modules` enlazado (740 tests, `tsc` 0, build 152):
>   `49d955d` los documentos · `b6559aa` el pixel (paleta, imprenta, auditor, muñecos, sala,
>   atlas) · `6bebbfe` la pantalla. **No se hizo push.**
>
> ### Después, todo el código entró (2026-09-24, mañana)
>
> `0f4c99e` + `149ea16` los recitales y los 8 Fáciles de `US-02` (`T-279`; el segundo commit
> suma dos archivos que el primero olvidó: **la prueba en worktree limpio lo cazó**, sin eso
> `0f4c99e` no compila solo) · `fa928ea` el motor (`T-266`, `T-267`, `T-272`). Los tres
> probados en limpio: **952/952, `tsc` 0, build 152.** **`BR-28` queda levantada**: un test
> cuenta los 8 Fáciles.
>
> ### 🔴 El límite semanal de uso cortó la noche (2026-09-24, ~01:30 a 04:00)
>
> Fallaron tres agentes con *"You've hit your weekly limit"*: `T-272` (a un import del final:
> `CUERPO_ALTO` en `solucionador.ts`, que completó el hilo principal), la coherencia de la
> ráfaga 2 y `T-284`. Se volvieron a lanzar en la ráfaga 3. **Su verificación adversarial de
> `T-272` corre ahí**: `fa928ea` está verde pero nadie que no lo armó lo miró todavía.
>
> ### `BR-30`, y una lectura que el usuario tiene que confirmar
>
> `producto` decidió que **"Sacalo por la letra" (`US-07`) pasa a dificultad por conteo en
> vivo, en tercios**, y que **el quiz y "Completá la letra" (`US-03`) no pasan**: ahí la
> dificultad mide otra cosa (lo oscuro del dato, el contexto del hueco). El usuario dijo
> *"todo lo que sea con canciones"*. **Preguntarle si esa lectura le cierra.**
>
> ### 🔴 Se trabó dos veces, y cómo se ve
>
> 1. **2026-09-23, 16:03 → 19:05: corte general.** Los seis agentes activos quedaron quietos
>    181-182 minutos y volvieron juntos. Máquina suspendida o red caída. Tres agentes se
>    relanzaron desde cero solos.
> 2. **`T-272` (los mecanismos): dos instancias colgadas** esperando una respuesta del modelo
>    que no volvió (184 y 45 minutos), cortadas y relanzadas. La tercera avanza. Pausas de 4 a
>    6 minutos con esfuerzo `max` son normales, no colgadas.
>
> **Cómo diagnosticarlo sin adivinar:** en
> `~/.claude/projects/<proyecto>/<sesión>/subagents/workflows/<run>/` cada agente tiene su
> `agent-*.jsonl` con timestamps (UTC). Un hueco igual en todos a la vez es un corte general;
> un hueco en uno solo que termina en *"Request interrupted"* es una llamada colgada.
>
> ### Lo hecho en la ráfaga 2 (verificado)
>
> | Tarea | Qué quedó |
> |---|---|
> | `T-267` | Traza grabada en `src/data/skayboy-soluciones.json`, `soluciones.ts`, paso fijo `CUADRO_SEG` en la isla, CTR-16 v2 sin `verificaciones.solo` |
> | `T-270` | `CNT-21`: los seis nombres; la línea de vertical se queda y solo aparece donde es verdad |
> | `T-271` | **La pantalla entra y ya no está muda.** Medido en el navegador sobre producción: 812×375 y 375×812 sin teclas afuera, rótulo visible fuera del área |
> | `T-273`, `T-274` | `CTR-19` (el conteo citado y el archivo de recitales) y `BR-18 (h)` |
> | `T-275`, `T-276` | Los muñecos y la sala, dibujados como texto, aprobados, impresos |
> | `T-281` | `INV-76`: **la única fuente abierta es MusicBrainz (CC0), con 2 recitales** con setlist (8 y 9-dic-1995) |
>
> ### Corriendo al escribir esto: la ráfaga 3 y el cierre, en un workflow
>
> Verificar `T-272` → `T-277` (los cinco niveles) y `T-278` (la isla dibuja con los atlas) en
> paralelo; `T-284` (contratos de `D-46`) → `T-285` (la dificultad de `US-07` por conteo); la
> coherencia de las ráfagas 2 y 3; y `T-280`, que devuelve el texto de `REV-15` para pegar.
> `T-282` (`INV-89`, el conteo completo: 198 títulos) y `T-283` (`BR-30`) ya cerraron.
>
> **Si esto se corta:** el workflow es `wf_e717167e-b84`, y se retoma con
> `resumeFromRunId`; lo terminado vuelve de caché.

> ## 🤖 CICLO 16, RÁFAGA 1 CERRADA: LA MÁQUINA YA JUEGA SOLA (2026-09-23)
>
> **`npm test` 746 en verde (eran 673) · `tsc --noEmit` 0 errores · `npm run build` 152
> páginas.** **Nada commiteado todavía**: son ~30 archivos, y el usuario no pidió commit.
>
> ### Cómo se trabajó
>
> Dos workflows: **34 agentes** para las nueve tareas —cada una verificada por alguien que no
> la armó, corregida por su dueño y reverificada— más una pasada de coherencia cruzada; y
> **18 agentes** para cerrar lo que esa pasada dejó. Lo que sigue está verificado contra el
> disco. **La pasada de coherencia se equivocó una vez**: dio por coincidente la palanca de
> `UX-31` con `CTR-16.10.2` y eran opuestas. La cazó la lectura del hilo principal, no la
> máquina: ojo con eso en la ráfaga 2.
>
> ### Lo cerrado
>
> | Tarea | Qué quedó |
> |---|---|
> | `T-261` | `UX-28 §2.3`–`§2.6` y `§4.1`. **El rótulo de carga vive afuera del mueble**, la cabecera entra en la columna del mueble a ×1, el vertical baja las teclas arriba del borde, tabla de alturas para cinco tamaños. La `§2.2` doble quedó una sola. La línea de `CNT-18` "el doble" **solo es verdad** con ancho > 400 y alto ≥ 720 |
> | `T-262` | **`BR-29`**: (a) solo el teléfono; (b)(c)(d)(f) la traza; (e) el motor. Tolerancia mínima **Fácil ≥ 10, Media ≥ 6, Difícil ≥ 4 cuadros**. **`verificaciones.solo` se retira**: queda solo `deDos` |
> | `T-263` | **`ADR-09` + `CTR-18`** (`ARQ-solucion-grabada.md`). **Paso fijo de 1/60 en la isla** con acumulador. La traza vive en **`src/data/skayboy-soluciones.json`**, con schema propio, y no viaja al teléfono. Se graba una traza **ensanchada**, no la más corta (la más corta tiene tolerancia 0 hasta en `NIV-01`) |
> | `T-264` | **`CTR-16.10`**: la palanca **por sentido** (derecha activa, izquierda en reposo, saltarla no la mueve), la placa, la compuerta como **tramo vertical de sólido a sólido**, la caja. `C` es cielo e `I` infierno, **ahora lo dice el dato**. Regla 3 de `CTR-16.5`: cada entrada tiene piso. `T-253` aceptado |
> | `T-265` | **`UX-31`**: los seis niveles en boceto, escalones 1/1/2/2/3/3, **paridad programada 3 a 3**. Tres bocetos rediseñados cuando se vio que la palanca no es permanente |
> | `T-266` | **El solucionador** (`src/lib/skayboy/solucionador.ts` + `scripts/resolver-niveles.mjs`). **`NIV-01`: 119 nodos en 25 ms**; de uno 1,79 s (la más corta 1,29 s), tolerancia **30**; de a dos 0,64 s. 25 tests, cada guarda vista en rojo por mutación |
> | `T-268` (mitad) | **La imprenta y el auditor del pixel** (`scripts/imprimir-pixel.mjs`, `scripts/auditar-paleta-pixel.mjs`, `src/lib/pixel/`, 49 tests). El formato de los `.txt` se puede copiar del encabezado de `fuente.ts` y funciona |
> | `T-269` | **`INV-73`** (`RES-73`..`RES-75`). **La condición de `D-45` se cumple**: top sin empate en el puesto 8 (Jijiji 101 · Ñam fri fruli fali fru 93 · Vamos las bandas 90 · …). Dos del top-8 son inéditos fuera de los 105; filtrando, los 8 salen bajando al puesto 10 |
>
> ### 🔑 Dos decisiones nuevas
>
> - **`D-45` enmendada (el usuario, 2026-09-23).** Los términos de setlist.fm dan licencia **para
>   ver** y prohíben bots; su API prohíbe guardar lo que devuelve. Entonces: **los Fáciles salen
>   del conteo citado** de su página de estadísticas, y **los setlists enteros se guardan solo de
>   fuentes cuya licencia lo permite**. Las busca **`T-281`**, nueva, de `investigador`.
> - **`experiencia` decidió la paleta del pixel** (`UX-27`, `UX-30`): **el aire es la luz y el
>   sólido es la clave** (con el aire en la clave, el bisel se fundía a 1,00:1); **15 tintas, no
>   16**: la puerta va por forma, como los mecanismos; la luz máxima es el blanco de *Gulp!*.
>
> ### 🎨 La hoja 13 del lienzo, esperando tu visto bueno
>
> **"13 · El pixel del fichín"** se publicó en el lienzo (versión 14). Son las **15 tintas** con
> su contraste contra la clave, las baldosas de muestra, la prueba en gris y la maqueta del aire.
> **Una elección es del hilo principal y conviene que la mires:** las pieles de Skay y Poli
> estaban a ΔE00 0,79. Se movieron **las dos**, cada una a menos de 7 de lo que muestra la hoja y
> en sentidos opuestos (Skay `#c39c76`, Poli `#feb471`), para que ninguna de las dos personas
> cargue sola con el cambio. **Nada baja a `tokens.css` hasta que apruebes.**
>
> ### Lo que la ráfaga 2 tiene que saber, además de su fila
>
> - **`T-267`** también: `CUADRO_SEG` en `mundo.ts`, el acumulador de paso fijo en la isla,
>   `skayboy-soluciones.json` con su schema, el flag `--regrabar`. Y la tolerancia de `NIV-01`:
>   `CTR-18.9` dice 21 (cuenta a mano) y la herramienta mide 30 (`BAJA`, la cierra `T-267`).
> - **`T-272`** toca más que su fila: la leyenda de `skayboy.json`, `esquemas.test.ts`,
>   `niveles.test.ts:48`, y la regla 3 de entradas con piso. Traspaso:
>   `Docs/SUGERENCIAS/ARQ-para-hilo-principal-lo-que-arrastra-ctr-16-10.md`.
> - **Al bajar la paleta**: `src/lib/pixel/tokens.ts` tiene `TOPE_DE_TINTAS = 16` y ahora son 15.
> - **Citas viejas de `UX-28 §2.2`** en `skayboy.css:486` y en este archivo: hablan del alto, que
>   ahora es `§2.3` (`UX-para-hilo-principal-citas-de-UX-28-que-cambiaron-de-numero.md`).
> - **`T-273` y `T-279` cambiaron** con la enmienda de `D-45`: dos piezas, el conteo citado y el
>   archivo de recitales, y ningún script baja páginas de setlist.fm (`ORQ-plan-ciclo-16.md §2.3`).
>
> ### Próximo paso: la ráfaga 2
>
> `T-267`, `T-270`, `T-271`, `T-272`, `T-273`, `T-274`, `T-275`, `T-276` y `T-281`. Los dibujos
> (`T-275`, `T-276`) pueden empezar con la paleta en borrador, pero **no entran al atlas** sin tu
> visto bueno a la hoja 13.
>
> ### 🔴 Lo que espera al usuario
>
> | Qué | Traba |
> |---|---|
> | **Mirar y aprobar la hoja 13 del lienzo** (15 tintas, las dos pieles) | que la paleta baje a `tokens.css`, y con ella el arte |
> | **Commitear** las ~30 piezas de la ráfaga 1 | nada las respalda hoy |
> | La partida en el teléfono (ex `T-249`) | que los niveles pasen a `listo` |
> | Los temas enteros: `npm run generar-fragmentos -- "<carpeta>" --enteros` | que el juego suene (`D-39`) |

> ## 🤖 CICLO 16 PLANIFICADO: EL FICHÍN SE PRUEBA SOLO (2026-09-22)
>
> **Plan en `Docs/ORQ/ORQ-plan-ciclo-16.md`: veinte tareas, `T-261`..`T-280`, nada
> construido todavía.** Arranca sobre `main` en `1478ae7` con el árbol limpio y `npm test` en
> **673/673**.
>
> ### Las dos decisiones del usuario, ya escritas
>
> - **`D-44` — el pixel lo dibuja el hilo principal, como código.** Grillas de texto en las 16
>   tintas `--px-*`, impresas a PNG por script y controladas por el auditor de paleta. La
>   hoja del usuario pasa a ser referencia. **Nada entra al atlas sin una hoja de contacto que
>   el usuario vio.** Justificado en `Docs/EQUIPO.md`, sin rol nuevo.
> - **`D-45` — "Fácil" en `US-02` es lo más tocado en vivo**, según los setlists de
>   setlist.fm, y **los setlists se guardan enteros** (pedido textual: *"Guardemos los setlist
>   que encuentre también"*) en `src/data/recitales.json`. Condición: que `RES-73` muestre
>   cobertura suficiente; si no, vuelve al usuario. **La puerta de `BR-28` al noveno juego se
>   abre cuando un test cuente los 8 Fáciles (`T-279`), no cuando se escribió la decisión.**
>
> ### La idea del ciclo
>
> Skayboy y Poligirl tiene un nivel y el piso pide seis listos. **Una máquina que juega sola**
> (`T-266`): busca sobre la simulación pura de `mundo.ts` el camino de una persona con un dedo
> por vez, lo graba al lado del nivel, y `npm test` lo vuelve a jugar. Convierte cuatro de las
> seis condiciones de `BR-25` en algo que corre el build; al teléfono le queda lo que solo un
> pulgar sabe. Medido antes de cortar: **la simulación corre a ~217.000 cuadros por segundo**,
> así que buscar es cosa de segundos y repetir la traza no le suma nada a `npm test`.
>
> **Hallazgo de la planificación, y es el riesgo número uno:** la isla corre a **paso
> variable** (`partida-skayboy.ts:343`, `k.dt()`). Sin pasarla a paso fijo, la máquina
> probaría otra física. Lo decide `T-263` (`ADR-09`) y lo aplica `T-267`.
>
> ### El ciclo 15 queda cerrado por absorción
>
> `T-255`..`T-260` quemados. `T-238`+`T-243` → **`T-268`** (la cadena del pixel), `T-246` →
> **`T-275`**/**`T-276`** (los muñecos, la sala), `T-250`+`T-252` → **`T-280`** (el cierre).
> `T-249` sigue siendo tuya: la partida en el teléfono.
>
> ### Próximo paso: la ráfaga 1
>
> Nueve tareas en paralelo: `T-261` (la pantalla deja de estar muda), `T-262` (`BR-29`),
> `T-263` (`ADR-09`/`CTR-18`), `T-264` (`CTR-16.10`, los mecanismos), `T-265` (`UX-31`, la
> gramática de los seis niveles), `T-269` (`RES-73`, los recitales), y en el hilo principal
> `T-266` (el solucionador) y `T-268` (la cadena del pixel).
>
> ### 🔴 Lo que espera al usuario
>
> | Qué | Traba |
> |---|---|
> | **Aprobar la paleta de 16 en la hoja 03 del lienzo** | `T-268`, y con ella todo el arte |
> | **Aprobar las dos hojas de contacto** | que el dibujo entre al juego (`D-44`) |
> | **La partida en el teléfono** (ex `T-249`) | que los seis niveles pasen a `listo` y producción los sirva |
> | **Los temas enteros**: `npm run generar-fragmentos -- "<carpeta>" --enteros` | que el juego suene (`D-39`) |
> | Si `RES-73` dice que setlist.fm pide clave, sacarla (es gratis) | `T-279` |

> ## 🕹 CICLO 15 CONSTRUIDO: EL MOTOR DECIDIDO Y TRECE TAREAS CERRADAS (2026-09-22)
>
> **`npm test` 673 en verde · `npm run check` 0 errores · `npm run build` 152 páginas ·
> validador `APTA`.** Eran 578 tests al abrir la ráfaga: **entraron 78 pruebas nuevas.**
>
> ~~**Nada está commiteado.**~~ **Corregido el 2026-09-22 al abrir el ciclo 16: ya estaba
> guardado.** El commit `1478ae7` ("Ciclo 15 construido") tiene las ~35 piezas y el árbol
> quedó limpio. Manda el disco.
>
> ### 🔑 Las dos decisiones del usuario, tomadas
>
> 1. **El motor se queda: `kaplay@3001.0.19`, salida A.** La compuerta `ADR-08.1` falló la
>    condición 4 —la licencia no es MIT, trae una cláusula anti-IA— y el usuario eligió
>    **quedarse y corregir el rótulo**, que era lo que de verdad estaba mal. La restricción
>    prohíbe entrenar modelos con el código; no toca lo que hace este sitio.
> 2. **El nombre queda: `Skayboy y Poligirl`.** Confirmado sabiendo que el par cambió de
>    fuego/agua a cielo/infierno. `CNT-19` quedó cerrada.
>
> ### Cómo se trabajó, porque cambia lo que hay que revisar
>
> **Dos sesiones en paralelo sobre el mismo árbol**, con reparto acordado por mensaje y sin
> pisarse un archivo. Y un **workflow de 13 agentes** que cerró ocho tareas de una pasada.
> Todo lo que sigue está verificado contra el disco, no contra lo que reportó cada agente.
>
> ### Lo cerrado
>
> | Tarea | Qué quedó |
> |---|---|
> | `T-226` | La compuerta corrida entera: 4 de 5 condiciones pasan. Resultado en `Docs/SUGERENCIAS/HILO-para-arquitectura-la-compuerta-del-motor-corrida.md` |
> | `T-227` | **`INV-61`** (`RES-70`..`RES-72`). `RES-62.4` refutada, `RES-62.7`/`.8` ampliadas |
> | `T-229` | `UX-27` reescrito. Cierra `FIND-56`, `FIND-68`, `FIND-70` |
> | `T-232`..`T-235` | **`CNT-17`..`CNT-20`** |
> | `T-237` | `public/arte/README.md` con la frontera de `D-41` |
> | `T-239` | La ruta, `copy.ts`, y el cuarto modo `tema-fijo` en el censo |
> | `T-240` | **El marco impreso.** Medido en el navegador: ancho 720 exacto, área 480×288, alto 324, teclas 52×64 y 112×244. Clavó `UX-28 §2` |
> | `T-241` | **Los auditores dejaron de estar ciegos.** Lista blanca `PAQUETES_DE_CLIENTE` y los dos escáneres de estética **barriendo del disco**, no una lista a mano |
> | `T-242`/`T-251`/`T-253` | El schema, el dato del nivel 1 en `borrador`, y los casos que un schema no puede: contar molinetes, y el nivel 1 que no se puede perder |
> | `T-244` | El modo `tema-fijo` en `cinta.ts` y `rocola.ts`: no sortea y no autoarranca |
> | `T-245` | Los **tres** efectos sintetizados, cero bytes en `public/` |
> | `T-254` | **`mundo.ts`: la simulación pura, sin motor ni arte.** Y `niveles.test.ts` con la mitad lógica de `T-248` |
> | `ADR-08` | Reescrito con el rótulo corregido, la compuerta cerrada, y **`ADR-08.2.1`**, que declara el `AudioContext` del motor como segunda excepción de `ADR-07.10` punto 7 |
>
> ### Las guardas nuevas, probadas en rojo a mano
>
> No se le creyó a ningún agente. Se rompieron y se vieron fallar: **hex, `999px` y
> `border-left`** en la hoja nueva (`estilos.test.ts`), **tiempo y curva sueltos**
> (`movimiento.test.ts`), y **un paquete de npm no declarado** en una isla
> (`islas.test.ts`). Las tres en rojo, las tres restauradas.
>
> ### 🔴 El defecto que encontró el ojo, arreglado y con deuda declarada
>
> **A 812 × 375 el mueble se iba 101 px fuera de la pantalla.** Las cuatro teclas de
> dirección —donde cae el pulgar de la mano que agarra— quedaban invisibles: había que
> scrollear para poder correr. La bajada del casete, acostada, se comía 136 px de los 51
> que hay. **Arreglado**: mueble de y=48 a y=372, `teclasFuera: 0`.
>
> **Pero entraba por tres píxeles y el aire había quedado en cero.** Y a 354 útiles (375
> menos la barra de gesto, el caso que `UX-28 §2` ya citaba) 48 de cabecera + 324 de mueble
> = 372 no entraba: faltaban 18, y ningún margen los resolvía porque ni la cabecera
> (`--toque-min`) ni el mueble (área + imprenta invariantes) tenían margen legal para
> achicarse.
>
> **Cerrado por `experiencia` el 2026-09-22 (`UX-28 §2.2`, nueva):** ni la cabecera ni el
> mueble se tocan — **la escala baja un escalón entero** cuando el alto no le alcanza a
> ×2, el mismo mecanismo que `§4` ya usaba en vertical. A ×1 el mueble mide 180: 48 +
> 180 = 228, y sobran 126 contra el peor caso. El umbral queda en `min-height: 330px` a
> `max-height: 400px` para ×1, y `min-height: 401px` a `max-height: 500px` para el ×2 con
> los remiendos que ya existían. **Falta implementarlo en `skayboy.css`**: mover el piso de
> la regla que fuerza `--escala: 2`, sumar la franja `330–400` en `--escala: 1`, y correr
> `min-height: 401px` en la franja que ya esconde la bajada. Ningún hex nuevo, tres
> selectores tocados. El detalle completo, con la tabla de umbrales y por qué se
> descartaron las otras dos salidas del traspaso, está en `UX-28 §2.2`.
>
> ### La verificación adversarial, y los dos `ALTA` que encontró
>
> Cuatro lentes independientes —contratos, guardas, estética, completitud— revisaron lo
> construido **sin haberlo armado**. Dos hallazgos graves, y el primero lo vieron las cuatro
> por separado, que es lo que lo hace indiscutible:
>
> - **🔴 `ALTA` — el rótulo de carga se pinta ADENTRO del área de juego.** `.rotulo-carga`
>   vive en `.recorte`, el mismo contenedor que el `<canvas>`, con `inset: 0`. Y `UX-27 §5.1`
>   no admite excepción: *"Adentro del área no hay texto. Ninguno. Ni rótulos"*; `ADR-08.2`
>   punto 4 lo repite. **Es un defecto del hilo principal** —se escribió en `T-239` y `T-240`
>   lo conservó—, y **quedó abierto a propósito**: lo toma `T-247` junto con la isla, porque
>   toca los mismos dos archivos y el rótulo hay que sacarlo igual cuando el motor dibuje.
>   Ojo al moverlo: la pantalla horizontal entra por tres píxeles.
> - **🔴 `ALTA` — `tema-fijo` no leía el tema del dato.** `rocola.ts` lo tenía escrito en una
>   constante mientras `skayboy.json` decía `temaFijo: null`, contra `ADR-08.9`, que manda
>   que el tema lo declare el dato. **Arreglado a medias y con la atadura puesta**: el dato ya
>   trae `nam-fri-frufi-fali-fru`, y una prueba nueva en `rocola.test.ts` **rompe el build si
>   el dato y el código nombran temas distintos** (probada en rojo). El arreglo de fondo —que
>   la página siembre el tema y `rocola.ts` deje de conocer a un juego por su nombre— entra
>   con `T-247`.
>
> ### Lo que la verificación dejó abierto, con dueño
>
> | Gravedad | Qué | Dónde |
> |---|---|---|
> | `MEDIA` | `cinta.ts:231` solo pinta el renglón de qué suena si el modo es `rocola`, y `ADR-08.9` promete "mismo rótulo de `UX-26`" también para `tema-fijo` | `T-247` |
> | `MEDIA` | **El reparto de `devuelve` está invertido** entre el ejemplo de `CTR-16.4` y el dato real. Dos lentes lo vieron. Manda `UX-30` | `arquitectura` |
> | `MEDIA` | `T-253` es condicional —"si `arquitectura` prefiere que no exista, se cancela"— y **ningún documento registra esa aceptación**. El test existe igual | `arquitectura` |
> | `BAJA` | `mecanismo.abre` acepta `^PUE-\d{2}$` y no hay ninguna puerta con ese `id`: las puertas son los caracteres `A`/`B` de la grilla | `arquitectura` |
>
> Y lo que **no** encontró, que también es resultado: **cero tics de estética genérica de IA,
> cero hex fuera de `tokens.css`, cero anglicismos, cero infinitivos en botón, cero
> suspensivos en rótulo.** La lente de estética pasó limpia.
>
> ### `T-247` cerrada: **el juego se juega**
>
> La isla existe y el nivel 1 se pasa de punta a punta, verificado en el navegador a
> 812 × 375: dos personajes, tesoros, las dos puertas, y **uno solo en su puerta no gana**.
> `partida-skayboy.ts` escucha las seis teclas con `pointerdown`/`pointerup` **y captura**
> —contando punteros por tecla, que es lo que hace falta con cuatro dedos encima—, llama a
> `paso()` una vez por cuadro y dibuja con tinta plana. El motor entra con `import()` y
> **solo si hay nivel sembrado**. `motor.test.ts` suma 16 casos, cada uno probado en rojo.
>
> **Y apareció que el `close()` era la mitad del arreglo.** Kaplay hace `suspend()` al
> esconderse la pestaña y `resume()` al volver, **sobre el contexto ya cerrado**, y cada
> vuelta tira `InvalidStateError`. Se mide en el navegador. El arreglo es `backgroundAudio:
> true` en el init, que saltea esas dos llamadas sin encender nada. Está puesto y exigido por
> test. **`ADR-08.2.1` todavía no lo dice** — es de `arquitectura`.
>
> ### La pantalla muda, arreglada — y las dos `MEDIA`, cerradas
>
> **El rótulo ya no está oculto en horizontal: toma el renglón de la marca** mientras el
> motor no dibuja, así que se lee *"Skayboy y Poligirl / Acá va el juego."* sin gastar un
> píxel de alto. Cuando el motor arranca, la isla lo esconde y la marca vuelve sola. Medido:
> `teclasFuera 0`, `maxBottom 372`. **Es interino**: la decisión de fondo sigue siendo de
> `experiencia` (ver el addendum del traspaso).
>
> - **`cinta.ts` ya pinta el renglón de `UX-26` en `tema-fijo`**, sin la acción de poner otro
>   tema —`D-39` no sortea— y escondiéndose si no hay pieza. Verificado en el navegador: el
>   botón existe pero sale con `hidden`, y el rótulo de pieza también.
> - **El `devuelve` invertido, cerrado por `arquitectura`**: mandan el dato y `UX-30`. Quedó
>   anotado que **en ningún lado del contrato está escrito que `C` sea cielo**: sale solo de
>   las iniciales, que es una convención sin declarar.
> - **`ADR-08.2.1` suma la condición 5, `backgroundAudio: true`.** El `close()` era la mitad:
>   Kaplay hace `suspend()`/`resume()` **sobre el contexto ya cerrado** cada vez que la
>   pestaña se esconde y vuelve, y tira `InvalidStateError`. Medido en el navegador, no
>   deducido.
>
> ### 🔴 El tema del juego no suena, y no es un defecto de código
>
> `D-39` dice que este juego **suena entero**, y hoy no suena: el pedido de
> `/audio/temas/nam-fri-frufi-fali-fru.mp3` devuelve **404**. La causa no es el código —
> **`public/audio/temas/` está vacía**, y su propio README lo explica: los temas enteros
> *"no salen de este repo y ningún rol los puede producir"*. Los pone el usuario:
>
> ```
> npm run generar-fragmentos -- "<ruta a los discos>" --enteros
> ```
>
> **La degradación es digna y se verificó**: la cama ya está sonando por debajo y el tema se
> cuelga arriba; si no baja, `alRendirseLaRocola()` deja la cama. El rótulo dice "CINTA
> SONANDO" y **es verdad** —suena la cama—, y el renglón de pieza se esconde en vez de
> nombrar un tema que no está. Nada miente. Pero **`D-39` no se cumple hasta que el archivo
> exista**, y son ~3-4 MB que solo el usuario tiene.
>
> ### 🔴 El hallazgo que queda abierto, y es el que más importa
>
> **En lo publicado, en horizontal, la pantalla del juego está muda.** El rótulo salió del
> área —mi `ALTA` bien resuelto— pero **afuera no había lugar**, así que quedó
> `clip-path: inset(50%)`: solo para lector de pantalla. Y como en producción el banco sale
> con `"niveles":[]` (correcto, `NIV-01` sigue en `borrador` hasta `T-249`), **el motor nunca
> baja**: el rótulo no es un cartel de 114 ms, es el estado permanente.
>
> Lo que ve el que entra, medido en `dist/`: **un rectángulo negro de 480 × 288, seis teclas
> que no hacen nada, y ni una palabra.** Eso es un molinete de los que `D-14` nombra.
>
> **No es un defecto de CSS y por eso no lo arreglé:** medido, el gabinete tiene **4 px
> libres** (324 = 296 de área + 24 de chapa del pie). Son **tres reglas que juntas no se
> pueden cumplir** en horizontal — `UX-27 §5.1` (adentro del área no hay texto), `ADR-08.2`
> (hay un rótulo y es lo que se mira), `UX-28 §2` (el reparto, que no deja un píxel). Las
> cuatro salidas posibles están escritas en
> `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`, addendum
> del 2026-09-22. **Es de `experiencia`.**
>
> ### Lo demás que dejó `T-247`, sin dueño todavía
>
> - **En vertical (375 × 812) las teclas de dirección quedan abajo del borde**: se ven los
>   dos bloques de saltar y hay que scrollear para correr. Mismo defecto que ya se arregló en
>   horizontal, en la otra orientación.
> - **`UX-28` tiene dos secciones numeradas `§2.2`** (`:117` el agarre, `:135` la nueva del
>   alto). Dos ramas con el mismo número es cómo nació `FIND-55`.
> - La `§2.2` nueva baja a ×1 cuando el alto no alcanza, y si se aplica **la línea de
>   `CNT-18` "De costado se ve el doble de grande" pasa a mentir** (`UX-28 §4` dice que el
>   doble es lo único que esa línea promete). Arrastra a `contenido`.
>
> ### 🔴 Lo que espera al usuario
>
> | Qué | Traba |
> |---|---|
> | **Commitear las ~35 piezas** | Nada las respalda hoy |
> | **Los 16 `--px-*` en el lienzo** (`T-238`) | `T-243` (auditor de paleta) y `T-246` (los atlas) |
> | **Quién dibuja los sprites** | Sigue sin dueño. La hoja que hay **no es fuente de píxeles**: se midió que no está sobre grilla, se redibuja |
> | **`T-249`**: jugar el nivel 1 en un teléfono | Es la planilla de `BR-25` y **no la puede correr ningún rol ni agente** |
>
> ### Próximo paso
>
> **`T-247`, la isla**: llamar a `paso()` una vez por cuadro, dibujar, escuchar las seis
> teclas con `pointerdown`/`pointerup` **con captura** (el repo no tiene ningún control que
> se mantenga apretado todavía), y el caso de `motor.test.ts` que exige
> `void k.audioCtx.close()`. Con eso el nivel 1 se puede jugar y se abre `T-249`.

> ## 🕹 CICLO 15 EN EJECUCIÓN: LA COMPUERTA SE CORRIÓ Y FALLÓ POR LA LICENCIA (2026-09-19)
>
> **Se dejó de planificar y se empezó a construir.** El plan del ciclo 15 estaba entero en
> papel desde el 16; esta ráfaga ejecutó **nueve tareas** y dejó **una decisión del usuario
> trabando el motor**. `npm test` cierra en **578 en verde**, `npm run check` en 0 errores y
> `npm run build` en 152 páginas.
>
> ### 🔴 Lo primero, porque bloquea: `T-226` falló la condición 4 y hay que decidir
>
> La compuerta de `ADR-08.1` se corrió entera. **Cuatro condiciones pasan, una falla.**
>
> | # | Condición | Resultado |
> |---|---|---|
> | 1 | Entra en isla de Astro y el sitio construye | ✅ y además **dibuja en el navegador**, no solo compila |
> | 2 | Sin `eval()` ni `new Function()` | ✅ cero coincidencias en los tres bundles |
> | 3 | Tipos propios, `npm run check` sin tocar `tsconfig` | ✅ 0 errores |
> | 4 | Nada con licencia ajena adentro | 🔴 **falla, y por donde nadie miraba** |
> | 5 | Peso bajo el techo de 90 KB gzip | ✅ **66,8 KB**, pero ver abajo |
>
> **`kaplay@3001.0.19` no es MIT.** Su `LICENSE.md` trae tres restricciones anti-IA
> agregadas, y su `package.json` **declara `"license": "MIT"`** igual — el metadato
> contradice al archivo del mismo paquete, así que una auditoría automática no ve nada.
>
> **El matiz que cambia la lectura (`RES-70.3`): el proyecto ya había sacado esa cláusula.**
> El revert a MIT plano es de mayo de 2025, pero ocurrió en `master` y en la línea `4000.x`,
> **no** en la rama 3001.x, que se tagueó un mes después arrastrando la versión vieja. No es
> una postura: es una rama que quedó atrás.
>
> **`RES-62.4` quedó refutada, y la lección es transferible:** consultó
> `.../kaplay/`**`master`**`/LICENSE`, donde la afirmación *es* cierta. Leyó bien el archivo
> equivocado. **Una licencia se lee en el tag de la versión que se instala, nunca en la
> rama** — y el campo `license` del `package.json` no es una fuente.
>
> **Las tres salidas están escritas con su costo** en
> `Docs/SUGERENCIAS/HILO-para-arquitectura-la-compuerta-del-motor-corrida.md` §2: **(A)**
> quedarse y corregir el rótulo, **(B)** caer a LittleJS, **(C)** el alfa, que el propio
> `ADR-08` veta. **Dato para B: LittleJS hoy mide 62 KB gzip, no los ~46 fichados** — el
> ahorro de peso que justificaba tenerlo de repuesto ya no existe (menos de 5 KB).
> `BR-15` consecuencia 1 saca esto de la órbita de `D-14`: **hay que decidirlo antes, y es
> del usuario.** Traba `T-241`, `T-247` y `T-248`.
>
> ### Los tres hallazgos que la compuerta no buscaba y encontró igual
>
> - **🔴 El audio del motor no se apaga por opción.** `ADR-08.2` punto 3 dice "apagado" como
>   si hubiera un flag: **ninguna de las 29 opciones del init toca el audio**, y el init hace
>   `a.audio = sa()` incondicionalmente. Verificado en el navegador: aparece un
>   `AudioContext` en estado **`running`**, contra `ADR-07.10` punto 7. **Hay mitigación
>   probada**: `void k.audioCtx.close()` después del init lo deja en `closed` y **el motor
>   sigue dibujando**. Hay que escribirla en el contrato y testearla en `T-247`.
> - **El motor no se tree-shakea.** El humo mínimo —un rectángulo— pesa 66,8 KB gzip contra
>   los ~65 del import completo. **La salida que `ADR-08.1` condición 5 dejaba escrita ("se
>   recorta uso de API hasta entrar") no existe**: no hay API que recortar. Margen real
>   contra el techo: **23,2 KB gzip** para isla, lógica y datos.
> - **`islas.test.ts` se quedó ciego.** Su comentario afirma que "este proyecto no tiene
>   ningún paquete de npm del lado del cliente", y eso dejó de ser cierto: con el humo puesto
>   **ninguna prueba dijo una palabra** del `import kaplay`. Lo tapa `T-241`; hasta entonces,
>   cualquier isla puede importar cualquier cosa. Lo que **sí** funcionó fue el censo: los
>   únicos dos rojos fueron los de la página sin declarar.
>
> ### Y un hueco de `ADR-08.10` quedó medido
>
> **Tiempo hasta jugable: 114 ms** (escritorio, servidor local — **no es el número del
> teléfono**, es el piso). `D-32` límite 3 pide 0 ms, así que el rótulo estático de
> `ADR-08.2` deja de ser precaución. **La vara del bundle, rehecha:** el sitio sin el motor
> son **116,3 KB bruto / 50,9 KB gzip** en 27 chunks, no los "113 KB" que circulaban. El
> motor **no se comparte**: vive en un chunk, cargado por una sola página.
>
> ### Las nueve tareas cerradas
>
> | Tarea | Qué quedó |
> |---|---|
> | `T-226` | La compuerta corrida entera. Resultado y pedidos a `arquitectura` en el traspaso de `Docs/SUGERENCIAS/` |
> | `T-227` | **`INV-61`** con `RES-70`..`RES-72`. `RES-62.4` marcada refutada en `INV-60`, y `RES-62.7`/`RES-62.8` ampliadas (LittleJS vendoriza Box2D bajo zlib; su peso envejeció) |
> | `T-229` | `UX-27` reescrito por `experiencia` para una hoja que no está sobre grilla. **Cierra `FIND-56`, `FIND-68` y `FIND-70`** |
> | `T-232`..`T-235` | **`CNT-17`..`CNT-20`** de `contenido`: el pie de homenaje, el texto de la pantalla, el nombre y el tema que suena (`nam-fri-frufi-fali-fru`, de *Gulp!*, verificado en el cancionero) |
> | `T-237` | `public/arte/README.md` con la frontera de `D-41`: qué idioma rige dónde, y que su "borde tipo tijera" **no viaja** al pixel |
> | `T-239` | **La ruta existe y se ve.** `src/lib/skayboy/copy.ts`, la página, y el cuarto modo `tema-fijo` en el censo. Verificado en el navegador a 375 px, sin errores de consola |
> | `T-252` | El barrido corrido: 14 líneas sobreviven y **las 14 son enmiendas o citas históricas**, ninguna es regla viva |
>
> **`voz.test.ts` ahora audita `skayboy`**: los textos de `contenido` pasaron las siete
> reglas de verdad, no a ojo. Registrarlo en `MODULOS` fue parte de `T-239` — la lección de
> `dos-ejes`, que pasó un ciclo pareciendo auditado sin estarlo.
>
> ### 🔴 Las cuatro cosas que esperan al usuario
>
> | Qué | Por qué traba |
> |---|---|
> | **La licencia del motor** (A, B o C) | `T-241`, `T-247`, `T-248`. Es lo único que impide seguir con el juego |
> | **El nombre**, `Skayboy y Poligirl` | `CNT-19` lo deja pendiente: se eligió cuando el par era fuego/agua y hoy es cielo/infierno. `contenido` argumenta que no hace falta cambiarlo —promete una dupla, no un elemento— pero la confirmación no está |
> | **Los 16 `--px-*` en el lienzo** (`T-238`) | Traba `T-243` (el auditor de paleta) y `T-246` (los atlas) |
> | **Quién dibuja los sprites** | Sigue sin dueño. Y la hoja que hay **no sirve de fuente de píxeles**: se redibuja sobre grilla |
>
> ### Próximo paso
>
> **Contestar la licencia.** Con eso destrabado, la fila es `T-241` (los auditores, que hoy
> están ciegos), `T-242` + `T-251` + `T-253` (el schema y sus tres casos, los tres en el
> mismo archivo y en fila), `T-240` (el marco impreso) y `T-244`/`T-245` (la cinta y los
> tres efectos). Nada de eso necesita un sprite: el plan se cortó así a propósito.

> ## 🕹 CICLO 15 PLANIFICADO Y REVISADO, SIN CONSTRUIR (2026-09-16)
>
> **El usuario trajo la hoja de sprites y pidió seguir.** Textual: *"Agregue los sprites
> continua con el siguiente ciclo"*. Lo que hay es **el ciclo entero en papel**: la historia
> promovida, el motor elegido, los contratos, la pantalla, el plan y dos rondas de revisión.
> **Cero código.** `npm test` sigue en 578, que son los mismos de antes.
>
> **Plan completo en `Docs/ORQ/ORQ-plan-ciclo-15.md`** — `T-226`..`T-253`.
>
> ### Lo que trajo el usuario, medido
>
> `public/arte/skayboy_poligirl.png`: 1299×725, RGBA **con el alfa lleno** (el fondo verde
> azulado es píxel opaco, no transparencia). Poses por personaje: quieto de frente, de perfil,
> mirando a la derecha, corriendo, saltando, cayendo. Más dos cabezas de perfil y una guitarra.
>
> **🔴 No se puede recortar a máquina, y eso es lo más caro que dejó el ciclo.** Los rótulos y
> sus flechas puentean los sprites: la banda del personaje masculino sale como **un solo bloque
> de 1072 px**. Enmascarar el crema de las cajas no alcanza — las que puentean son las flechas,
> oscuras, dentro del rango de la tinta. Y `arquitectura` midió después que **no hay grilla
> latente** (N = 1). Los dos hechos juntos dicen que los sprites de producción hay que
> **redibujarlos sobre grilla, no recortarlos**. La hoja sirve de referencia de pose, insignia
> y tono, que es lo valioso — no es la fuente de los píxeles.
>
> **Lo barato es del usuario:** reexportar sin anotaciones, con fondo transparente y sobre
> grilla. Eso tira abajo todo el trabajo de recorte a mano. Conviene pedirlo antes de gastarlo.
>
> También apareció `public/arte/bondiAfinisterreAnimado.mp4` (3,2 MB): es para `IDEA-04`, otro
> juego. No es de este ciclo.
>
> ### Las tres decisiones del usuario, escritas
>
> - **`D-41` — pixel adentro, imprenta afuera.** El área de juego es pixel art; el marco, el
>   pie, los rótulos y los casetes siguen siendo la imprenta de `UX-22`. La metáfora es la
>   regla: un fichín son dos cosas pegadas, un tubo de píxeles adentro de un mueble
>   serigrafiado. La frontera se ve, y los dos idiomas no se mezclan en la misma pieza.
> - **`D-42` — enmienda la baranda 2 de `D-38`: los muñecos tienen cara.** La baranda no era un
>   principio, era **una estimación de riesgo**, y estaba escrita como tal. `RES-64` no se movió
>   una coma; lo que se movió es dónde está el perjuicio: **el nombre ya está en el título del
>   juego**, así que la cara no agrega identificación que el nombre no haya dado. Ahora el tono
>   es la baranda —nunca denigrante, ridiculizante ni sexualizado— y **el pie de homenaje pasó a
>   ser obligatorio**.
> - **`D-43` — no hay botón de cambio.** Cada columna de mando maneja siempre al mismo
>   personaje; el que no tiene un dedo encima se queda quieto y a salvo. Con dos personas se
>   usan las dos columnas a la vez; con una, una y después la otra. **Eso es el botón de cambio,
>   sin botón y sin nada que aprender** — y de paso cumple la consecuencia 3 de `D-40`, que
>   exigía que el que llega solo no elija un modo. Lo propuso `UX-28` con mejor argumento que la
>   decisión original; se enmendó con número porque `D-42` acababa de fijar esa regla.
>
> ### Las cuatro entregas
>
> | Rol | Qué |
> |---|---|
> | `producto` | **`US-09`** en `PRD-skayboy-y-poligirl.md`, nueve criterios Given/When/Then y piso. `BR-23`..`BR-28`. **`IDEA-14` queda marcada como promovida**, no borrada |
> | `arquitectura` | **`ADR-08`: el motor es Kaplay 3001.0.19**, pineado exacto, MIT, cero dependencias — **con compuerta**: cinco condiciones que no se pueden verificar desde un documento, cada una con su comando y su consecuencia. Si falla, se cae a LittleJS. Más `CTR-15` (atlas), `CTR-16` (niveles) y `CTR-17` (efectos) |
> | `experiencia` | `UX-27` (convención del pixel), `UX-28` (la pantalla y las dos puertas), `UX-29` (el fracaso no es la muerte), `UX-30` (cielo e infierno en la mezcla) |
> | `orquestador` | El plan. **Cortó tres cuartas partes de las tareas para que se construyan sin un solo sprite** — ruta, censo, marco, teclas, schema, sonido, auditores. Si el arte no llega, el ciclo entrega igual |
>
> ### 🔑 El piso del juego no es el cierre del ciclo, y está escrito
>
> **El ciclo 15 cierra con UN nivel jugable, no con los seis de `BR-25`. `US-09` no queda
> cumplida al cerrar.** Lo declaró `orquestador` en el §6 "Qué NO entra" y el revisor lo
> confirmó como lo que hace que esto sea un ciclo y no un deseo. **No lo aflojes en la
> ejecución.**
>
> ### Dos rondas de revisión, y la segunda es la que importa
>
> `REV-14` encontró **once hallazgos, cuatro ALTA, todos de coherencia entre roles** — cuatro
> roles escribiendo el mismo día sin verse. Los peores: **dos geometrías vigentes para la misma
> pantalla** (416×192 contra 240×144, y los dos escribiendo "32×48" con distinto significado),
> el fracaso sonando en un contrato y mudo en el otro, la puerta del nivel 1, y dos que **ningún
> rol vio**: un schema que nombra terrenos que él mismo no declara, y dos topes de paleta.
>
> **El desempate lo fijó el hilo principal antes de mandar a arreglar**, o se arreglaba dos
> veces y distinto: **lo que el jugador ve y oye lo fija `experiencia`; dónde viven los archivos
> y qué forma tienen lo fija `arquitectura`.** En la geometría ganó la UX y no por jerarquía: a
> 812×375 menos las dos columnas de mando, el área jugable ronda los 480 px, que es 240 a escala
> 2×. Los 416 nativos no entran.
>
> **Segunda pasada: siete cerrados y verificados en disco, uno cerrado mal, uno a medias, dos
> abiertos, cinco nuevos.** Los números ya no están en disputa: **área 240×144 nativos · 15×9
> tiles de 16 · celda 16×24 nativos (32×48 CSS a ×2) · caja 10×20 · 16 tintas ·
> `public/sprites/`**.
>
> ### 🔴 Lo que queda abierto al retomar
>
> | Qué | Dueño |
> |---|---|
> | **`FIND-59` cerrado mal:** la puerta se decidió (el nivel 1 tiene **las dos**), pero `ARQ-schema-niveles.md`:279-287 sigue diciendo "sigue abierto, no lo cierro yo", y el plan ya marca `T-231` cerrada. Es el archivo que se lee antes de escribir el primer nivel | `arquitectura`, una tijera |
> | **`FIND-56`:** `UX-27` sigue mandando `public/arte/pixel/` contra `public/sprites/`. Tiene tarea (`T-229`) | `experiencia` |
> | **`FIND-66`:** el plan todavía le da a `revisor` el archivo de `REV-14`, y `revisor` es read-only | `orquestador`, tres renglones |
> | **`FIND-69`:** el texto que `T-237` va a pegar en `public/arte/README.md` manda la carpeta vieja, y el barrido de `T-252` no mira `Docs/SUGERENCIAS/` | quien ejecute `T-237` |
> | `FIND-68` (alcance de la paleta: "por escena" contra "toda el área") y `FIND-70` (un renglón sin aclarar nativo/CSS) | `experiencia` |
> | **Quién dibuja los niveles y los sprites: sigue sin dueño.** De los siete roles, ninguno produce arte | usuario / `Docs/EQUIPO.md` |
> | **`BR-28`:** si al cerrar el ciclo 15 `US-02` sigue en 0 de 8 Fáciles, el ciclo 16 **no abre un noveno juego** hasta que llegue la `YT_API_KEY` o se retire la cuota por escrito | usuario |
>
> ### Próximo paso
>
> **`T-226`, la compuerta del motor, y va sola y primera:** instalar Kaplay pineado y probar que
> entra en una isla de Astro con salida estática, contra CSP y contra `npm run check`. Es el
> primer paquete de terceros que va a correr en el teléfono de la gente y cambia tres cosas a la
> vez — árbol de dependencias, la premisa de `islas.test.ts` y la superficie de una CSP. Si
> falla, se cae a LittleJS y media planificación se reescribe. **Es del hilo principal**, no de
> `revisor`: se corrigió en `FIND-61`.

> ## 🎮 SKAYBOY Y POLIGIRL — IDEA GUARDADA Y RELEVADA, NADA CONSTRUIDO (2026-09-11)
>
> **Ráfaga aparte de la del ciclo 14**, sobre el mismo árbol. El usuario pidió: *"Agrega a
> ideas y comencemos a desarrollar un juego que sea como un fireboy y watergirl que se llame
> skayboy y poligirl. Comenza la investigacion para construir el juego."*
>
> **No se tocó una sola línea de `src/`.** Lo que hay es documentación: la idea guardada, el
> relevamiento, dos decisiones del usuario y dos traspasos. `IDEA-14` **no está promovida**
> (`BR-16`), así que no traza `T-XX` y no hay nada que construir todavía.
>
> ### Lo que quedó en disco
>
> | Archivo | Qué es |
> |---|---|
> | `Docs/PRODUCTO/PRD-backlog-ideas.md` | **`IDEA-14`**, escrita por `producto`. Fila en el Resumen, pregunta abierta 4, encabezado y PENDIENTE al día |
> | `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md` | El relevamiento: **`RES-60`..`RES-65`** más tres mediciones sobre el repo (el ancla ricotera, los choques, el costo de la pieza). 763 líneas |
> | `Docs/DECISIONES.md` | **`D-38`** (se pueden dibujar dos personas vivas, con tres barandas), **`D-39`** (este juego suena entero) y **`D-40`** (un acompañante también es un molinete: se puede jugar solo) |
> | `public/arte/ensayo/` | **El ensayo dibujado**: `ensayo-pantalla.svg` a 812×375, `skayboy.svg`, `poligirl.svg`, la lámina `index.html` y su `README.md`. Vive en `public/` y **no en `src/pages/`** a propósito: una ruta nueva entra al censo de `rutas-sonoras.ts`, y cuando se dibujó ese código todavía estaba sin commitear |
> | `Docs/SUGERENCIAS/HILO-para-experiencia-skayboy-y-poligirl.md` | Lo que quedó con nombre de `experiencia` |
> | `Docs/SUGERENCIAS/HILO-para-arquitectura-el-motor-y-el-sonido-del-juego.md` | Lo que quedó con nombre de `arquitectura` |
> | `Docs/IDS.md` | La fila de reserva: `IDEA-14`, `RES-60`..`RES-69`, `D-38`, `D-39` |
>
> ### Cómo se relevó, porque el método importa más que el resultado
>
> Nueve frentes en paralelo —cinco a la web por el rol `investigador`, cuatro midiendo sobre
> el repo—, y **cada uno pasó después por refutación adversarial**: los cuatro caros, por dos
> refutadores independientes que fueron a la fuente primaria a voltear lo que la ficha
> afirmaba. Tres hallazgos cambiaron de signo hacia arriba y dos hacia abajo. **Lo que se
> cayó quedó escrito con el estado corregido**, que es lo que hace útil al archivo.
>
> Se cayeron, entre otras cosas: tres conteos del cancionero inflados hasta siete veces
> (`\bmar\b` en JavaScript matchea "María", porque la í no es carácter de palabra), la
> co-titularidad de Erks S.A. —de verificado a **reportado**, fuente única replicada— y el
> cálculo que cerraba la puerta al control simultáneo, que solo valía en vertical.
>
> ### Las cinco respuestas del usuario, que cierran el diseño grueso
>
> 1. **El par es cielo / infierno**, no fuego / agua. `agua` aparece **una vez** en los 2913
>    versos del cancionero; cielo/infierno tiene dos títulos propios y arriba/abajo es la
>    geometría nativa de un plataformas. **Consecuencia: el nombre deja de calcar el par del
>    juego de origen** y hay que poder explicarlo. Es de `contenido`.
> 2. **Se juega de a dos, en un teléfono en horizontal.** Contra la recomendación del
>    relevamiento (un pulgar alternando, que es como lo resuelve la versión móvil oficial del
>    juego de origen). No toca "sin backend": son dos personas en un aparato.
> 3. **`D-38`**: se autoriza el nombre y la caricatura. Nace porque `D-14` **no alcanzaba** —
>    el "si llega un reclamo se baja" está calibrado para el titular de una obra, y a alguien
>    que se sintió mal representado bajar el sitio no le devuelve nada.
> 4. **`D-39`**: suena entero. Es la **primera excepción a `D-37`**, escrita el mismo día.
> 5. **`D-40`**: además hay camino para uno solo, con botón de cambio de personaje. Lo levantó
>    `producto` y es la mejor objeción de toda la ráfaga: **si el juego pide una segunda
>    persona, el que llega solo por un enlace no juega**, y eso tiene la forma de un molinete
>    aunque `D-14` no nombre a un acompañante. Cuesta caro: cada nivel tiene que ser resoluble
>    de las dos maneras, así que queda **prohibido por construcción** el puzzle que exige
>    simultaneidad sin segunda solución.
>
> ### 🔴 La deuda que abrió `D-39`, con nombre
>
> **`dos-ejes` pidió esa misma excepción con ese mismo argumento** —"no tiene respuesta
> correcta, no hay nada que soplar"— y `D-37` se la negó por escrito, en su propia tabla. Hoy
> hay dos pantallas con el mismo fundamento y distinta respuesta. O el criterio se vuelve a
> escribir diciendo qué las separa, o el noveno juego llega con la discusión que `D-37`
> existe para cerrar. Está anotada en las consecuencias de `D-39`.
>
> ### Lo que bloquea de verdad, y no es el motor
>
> El motor dejó de ser bloqueo: `RES-62` trae **ocho licencias leídas en el archivo `LICENSE`
> crudo** —Kaplay (MIT, ~65 KB), LittleJS (MIT, ~46 KB), Phaser pineado a 3.90.0— y sirve
> igual a `IDEA-02`, `IDEA-03`, `IDEA-04` y `IDEA-07`. Falta **nombrar** un candidato, no
> fichar otro. Y Tiled salió de la lista negra: un mapa no hereda la GPL del editor.
>
> Lo que sí bloquea:
>
> - **El arte, y es un choque escrito contra otro escrito.** `public/arte/README.md` manda
>   *"PNG con fondo transparente, borde tipo tijera — nunca vector liso"*, y un sprite legible
>   a 32 px pide lo contrario. Las 13 piezas que hay hoy son recortes de collage: **cero
>   sprites**. Peor: **de los siete roles, ninguno es dueño del diseño de niveles ni de la
>   producción de sprites.**
> - ~~**La pregunta abierta 4 del PRD**: si el juego pide una segunda persona, el que llega
>   solo no juega.~~ **CONTESTADA el mismo día, `D-40`:** hay camino para uno solo. Lo que
>   deja abierto es el costo — cada nivel resoluble de las dos maneras.
> - **El riesgo 4 del brief está corriendo:** `US-02` sigue con **0 de 8 ítems Fáciles**
>   (falta la `YT_API_KEY`, `BR-18` apartado g). Este sería el juego número ocho.
>
> ### ✅ El ensayo se hizo, y dejó tres hallazgos
>
> El usuario pidió hacerlo en la misma ráfaga. Está en `public/arte/ensayo/`, se mira en
> `/arte/ensayo/index.html` con el sitio andando, y **no promueve `IDEA-14`**: no hay página
> del sitio, ni isla, ni copy, ni motor, ni física.
>
> **Lo que contestó, que era la única pregunta:** sí, un sprite se puede dibujar en el idioma
> del sitio sin caer en el vector liso que veta `public/arte/README.md`. El mecanismo es que
> el borde no sea una curva limpia — `feTurbulence` + `feDisplacementMap` desplazan el
> contorno, que es como se rompe un papel recortado a mano.
>
> **Los tres hallazgos:**
>
> 1. **`sharp` no puede rasterizar esto.** Medido: librsvg **no implementa
>    `feDisplacementMap`** y devolvió la silueta plana, sin borde, con el grano vuelto un
>    rectángulo gris. Los PNG se borraron. El sprite que llegue al teléfono va rasterizado
>    igual, pero **ese paso necesita un motor con filtros SVG** — un navegador, o la
>    herramienta del usuario, como los recortes de audio de `D-06`. Hoy el repo no tiene con
>    qué hacerlo desatendido.
> 2. **Sobre el piso claro la figura casi desaparece.** La tinta marfil está calibrada para
>    `--fondo`, que es tinta oscura; el cielo es papel claro. No lo caza `contraste.test.ts`,
>    que mide pares declarados en CSS y acá el fondo es una superficie dibujada. O las figuras
>    llevan contorno, o los dos terrenos no pueden ser los dos claros.
> 3. **A 48 px las dos se leen, pero no igual de bien.** El sombrero y la SG le dan a Skayboy
>    una silueta reconocible en miniatura; la mata de pelo de Poligirl se empasta y la salva
>    el oro del llavero. Si la paridad de `D-38` va en serio, eso se corrige en el dibujo.
>
> **Y una cosa que es propuesta, no hallazgo:** el llavero de Poligirl **no está fichado**. El
> sombrero y la SG de Skay sí (`RES-64.3`, `RES-64.5`). Las llaves salen de su rol documentado
> cruzado con el molinete. Ninguna pantalla puede decir *"Poli llevaba llaves porque…"*.
> Confirmarlas o cambiarlas es de `experiencia`.
>
> ### Próximo paso, si se retoma esto
>
> Mirar el ensayo y decidir. Lo que desbloquea si el dibujo convence no es el motor: es **la
> convención de sprites en `public/arte/README.md`**, que es de `experiencia` y es el bloqueo
> real. Después, nombrar el motor (`RES-62` ya sirve el orden) y recién ahí promover a
> `US-XX` con piso y criterio (`BR-16`).
>
> Lectura de piso, **no compromiso**: seis niveles, 2/2/2. Un nivel no se consume como un
> ítem —repetirlo *es* el juego—, pero `BR-01` exige tres escalones y un escalón de un nivel
> es un muro.

> ## 🎛 CICLO 14 CONSTRUIDO — LA CINTA PONE TEMAS (2026-09-11)
>
> **`T-212`..`T-225` cerradas.** `npm test` **574/574** (eran 526), `npm run check` 0 errores,
> `npm run build` 151 páginas, validador `APTA`. Verificado en el navegador a 375×812.
>
> ### Lo que hay ahora que no había
>
> - **La rocola** (`ADR-07`, `D-37`): prender la cinta en el portal, el cancionero o la
>   Redondopedia pone **un tema de los Redondos al azar**, con filtro de casete propio
>   (cuerpo, brillo y un `DelayNode` modulado que le arrastra la afinación 0,26 %) sobre la
>   cama sintetizada de `ADR-04`, que sigue corriendo abajo. Entre pieza y pieza cae **la
>   púa** (`src/lib/sitio/pua.ts`): golpe, barrido y surco con polvo, sintetizados, cero
>   archivos. Hoy suenan los **95 recortes enteros** —los diez segundos completos, no la
>   escalera de `D-26`— porque no hay ni un tema entero en disco; cuando los haya, salen
>   primero y los recortes después.
> - **El mapa de rutas** (`src/lib/sitio/rutas-sonoras.ts`): lista blanca con censo. Cinco
>   rutas ponen temas, ocho quedan en cama (el quiz y los siete juegos), cuatro mudas del
>   todo (los tres graves y `/diagnostico-audio/`). **Un juego nuevo nace mudo**, y una
>   página que nadie clasificó **rompe el build**.
> - **El pie corto**: *"Sitio hecho por ricoteros, para ricoteros."* — 42 caracteres contra
>   379. Lo demás se mudó a un `<details>` nativo, sin JavaScript.
>
> ### Lo medido, antes y después, a 375×812
>
> | Qué | Antes | Ahora |
> |---|---|---|
> | Portal | 2396 px (2,95 pantallas) | **2021 px (2,49)** |
> | Portada de "adiviná el tema" | 1591 px (1,96) | **883 px (1,09)** |
> | Los once pozos | 693 px | **111 px** |
> | Pie de imprenta | 227 px | **179 px** |
> | Texto del pie | 379 caracteres | **42** |
>
> ### ✅ `REV-13` cerró la revisión, y corrigió dos cosas mías
>
> `revisor` miró con contexto fresco (`Docs/REVISIONES/REV-13-ciclo-14.md`). **El riesgo
> número uno quedó sin hallazgos**: verificó el mapa ruta por ruta contra el código, probó el
> censo creando y borrando una página, y confirmó que los dos candados de la ruta son reales
> y ninguno es decorativo. También que los tres casos de `cinta.test.ts` (691/717/932) están
> intactos byte por byte y que `D-21` se sigue cumpliendo sin JavaScript.
>
> Tres hallazgos, dos corregidos el mismo día:
>
> - **`FIND-52` (corregido).** Al portal le faltaban **cuatro de las cinco medidas de
>   `UX-25`**: yo había sacado la tapa chica y cortado la bajada, pero no toqué una sola regla
>   `.casete*` de `sitio.css`. Aplicadas: `padding` 16→12, título 1,05→0,95rem, bajada
>   0,85/1,35→0,8/1,3, y el sello bajando adentro de `.casete-etiqueta` en vez de ocupar una
>   fila entera del grid. **Casete de 198 a 174 px; portal de 2021 a 1751 (2,16 pantallas).**
> - **`FIND-54` (corregido a medias, a propósito).** Los casos **17 y 19** de los veinte de
>   `ADR-07` no tenían prueba. Ya la tienen (`rocola.test.ts`, 20/20). La otra mitad —que
>   `ADR-07.8` describe un mecanismo que el código no tiene, aunque el comportamiento sea el
>   correcto— quedó como propuesta para `arquitectura`: **no reescribí la función que decide
>   si el reveal de `US-02` se oye limpio para que calce con un párrafo.**
> - **`FIND-53` (no es mío).** `UX-25` §5 pide un pie de ≤120 px, y
>   `--alto-pie-imprenta: clamp(8.5rem, 22vh, 13rem)` tiene **piso de 136**. El techo era
>   imposible sea cual sea el texto. Es de `experiencia`.
>
> Al cerrar: `npm test` **576/576**, `check` 0 errores, `build` 151 páginas.
>
> ### ⚠ Lo que quedó corto contra el presupuesto, y por qué
>
> **Son desvíos reales, no redondeos.** El que retome tiene que saberlos:
>
> 1. **El pie mide 179 px, no los ≤120 de `UX-25` §5.** `REV-13`/`FIND-53` lo cerró: el techo
>    era **imposible**, porque `--alto-pie-imprenta` tiene piso de 136 px. El texto sí hizo lo
>    suyo, de 379 a 42 caracteres. Defecto del presupuesto, no del pie.
> 2. **El casete quedó en 174 px, no en los 136 de `UX-25` §2.5** — después de corregir
>    `FIND-52`. Lo que no baja es el título en letra de display, y eso es tipografía de marca.
> 3. **El portal quedó en 1751 px (2,16 pantallas), no en las 1,83** de `UX-25` §1. Bajó
>    **645 px**, casi una pantalla entera.
>
> ### Dos defectos encontrados construyendo, que ninguna hoja preveía
>
> - **`.gitignore` tiraba los temas enteros al vacío.** Ignoraba `*.mp3` con una sola
>   excepción, `fragmentos/`. Correr `--enteros` los dejaba en disco, a la vista, y **no
>   llegaba ni uno a producción**, sin error y sin aviso. Esperaba desde que se tomó `D-22`.
> - **La flecha entre los dos motores de audio se cruzó**, y el test que `ADR-04` había
>   dejado puesto lo cazó. La salida no fue aflojar el candado: las dos rutas de audio
>   bajaron a `src/lib/audio/rutas-de-audio.ts`, una hoja que no importa nada.
>
> ### Lo que sigue sin estar, y no es un olvido
>
> **No hay un solo tema entero en `public/audio/temas/`.** El mecanismo está y la puerta
> quedó abierta; los archivos salen de tus discos, igual que los recortes (`D-23`):
> `npm run generar-fragmentos -- "<carpeta>" --enteros`. El README de esa carpeta lo explica.
>
> Rangos consumidos: `T-212`..`T-225`, `D-37`, `ADR-07`, `CTR-14`, `UX-24`..`UX-26`, `CNT-16`,
> `REV-13`. Pedidas a `investigador` y sin responder: `RES-56`, `RES-57`, `RES-58` — ninguna
> frena nada, las tres tienen repuesto declarado en `ADR-07`.

> ## 📋 EL PLAN DEL CICLO 14, COMO SE ESCRIBIÓ (2026-09-10)
>
> **Plan completo en `Docs/ORQ/ORQ-plan-ciclo-14.md`.** Catorce tareas, `T-212`..`T-225`,
> cortadas en tres ráfagas. Nada construido todavía: esto es el plan, no el resultado.
>
> **Lo pidió el usuario en una ráfaga**, y son dos frentes que no se parecen: pulir la UX
> del portal y de "adiviná el tema" hasta dejarla para producción (sin scroll para ver los
> temas, sin espacio muerto, con el pie achicado a *"sitio hecho por ricoteros para
> ricoteros"*), y **convertir la cinta en una rocola** que ponga un tema de los Redondos al
> azar con filtro vintage, caiga a los recortes enteros cuando no haya temas, y meta un
> ruido de cambio de disco entre uno y otro.
>
> ### Lo que se midió antes de planificar (2026-09-10, `npm run dev`, 375×812)
>
> | Qué | Dónde | Cuánto |
> |---|---|---|
> | El portal mide casi tres pantallas | `/` | **2396 px** = 2,95 pantallas, 8 casetes de ~210 px |
> | El pie se come un cuarto de la ventana | `.pie-imprenta` | **227 px** y **379 caracteres** |
> | La portada del juego no entra | `/juegos/adivinar-el-tema/` | **1591 px** = 1,96 pantallas; 693 px son los 11 pozos |
> | Durante la partida, el bloque más grande no juega | `#partida` | la partida entra justa, pero **208 px (25,6 %)** son pie |
> | La lista de temas nace con scroll adentro | `.sugerencias` | `scrollHeight` **318 px** en una caja de **240**: entran 4,5 de 6 |
> | La revelación desborda | al cerrar un tema | **622 px** llevan el documento a **1169** = 1,44 pantallas |
> | No hay un solo tema entero | `public/audio/temas/` | la carpeta no existe; `"entero": true` aparece **0 veces** |
>
> ### Las tres cosas que hay que decidir antes de construir
>
> 1. **La rocola afloja dos de los cinco candados de `ADR-04`**: el 2 ("cero archivos") cae
>    entero, y el 4 ("no lleva información") también. `D-14` y `D-22` lo cubren, pero el
>    argumento de que la cinta era una pieza intocable **se termina acá**, y queda escrito.
> 2. **Los recortes SON la respuesta de `US-02`.** Una rocola que suene en
>    `/juegos/adivinar-el-tema/` le sopla la respuesta al que está jugando; el tema entero
>    hace lo mismo en `completar-la-letra` y en `adivinar-por-la-letra`. **El mapa de rutas
>    mudas es parte de la decisión, no del código**, y es el riesgo número uno del ciclo.
> 3. **El pie corto choca con `D-21` condición 1** (la pantalla nombra qué tapas usó). La
>    línea corta se hace igual; lo que decide `CNT-16` es **a dónde se muda el crédito**, no
>    si se borra.
>
> ### La trampa que ya está en el repo, para el que construya
>
> `cinta.ts` barre los `<audio>` del documento para callarse cuando algo suena (`ADR-04.3`,
> fijado en `cinta.test.ts:691`, `:717` y `:932`). **Una rocola que ponga temas por un
> `<audio>` se calla a sí misma en el primer segundo.** Y `tema/audio.ts` decodifica a
> `AudioBuffer`: un tema de cuatro minutos así son decenas de MB de RAM en un teléfono. La
> rocola transmite, no decodifica.
>
> ### Lo que NO entra, y conviene saberlo antes de empezar
>
> **Los temas enteros mismos.** Entra el mecanismo (`T-219` abre la puerta con `--enteros`),
> pero los archivos salen de los discos que tenés en la máquina, igual que los recortes
> (`D-23`). Hasta que los cargues, la rocola pone **recortes enteros** — que es la caída que
> el propio pedido nombra.
>
> Rangos consumidos por el plan: `T-212`..`T-225`. Reservados: `D-37`, `ADR-07`,
> `UX-24`..`UX-26`, `CNT-16`, `REV-13`.
>
> ### `T-215` (`UX-25`) entregado — `experiencia`, 2026-09-11
>
> `Docs/UX/UX-25-el-portal-mas-corto.md`. Presupuesto de píxeles por bloque para el
> portal: de 2396 px a **~1486 px (1,83 pantallas)**, con los ocho casetes puestos. La
> pieza que más pesa: el casete baja de ~210-252 px a **136 px**, sacándole la tapa
> chica (real, `D-21`/`UX-05` — decisión propia, `D-21` lo permite pero no lo exige, y
> el casete ya dice de qué disco es con el color) y mostrando **solo la primera oración**
> de la bajada de cada casete (corte por template en el punto que el texto ya tiene, sin
> `line-clamp` ni "…" — `voz-ricotera.md §3.7` reserva el suspensivo para la Redondopedia).
> Corrida la prueba de las dos líneas en los ocho casetes: los ocho pasan tapando la
> bajada. Efecto colateral para otra tarea: sin la tapa chica, `tapasUsadas` en
> `index.astro` pasa de acreditar ocho o nueve discos a acreditar uno solo
> (`oktubre-banderas`), lo que achica el crédito del pie de arriba — anotado para
> `T-224`, no construido acá. **Asume pie ≤ 120 px** (el propio techo de `T-220`, no
> uno nuevo); si `CNT-16` entrega más largo, el presupuesto no cierra. No toca el umbral
> ni el tránsito. No contradice `UX-10` (el corte de 46rem no se toca). Pendiente:
> `UX-05` va a quedar desactualizado en la fila de casetes del portal — no se corrige acá
> (una sola hoja por tarea), queda para quien retome esa ficha.
>
> ### `T-214` (`UX-24`) entregado — `experiencia`, 2026-09-11
>
> `Docs/UX/UX-24-la-portada-en-una-pantalla.md`. Presupuesto de píxeles para las tres
> pantallas de "adiviná el tema": portada, partida y revelación.
>
> - **Portada:** de 1591 px (1,96 pantallas) a **≤ 812 px**. La pieza que lo permite: los
>   11 pozos dejan de ser una lista vertical de 693 px y pasan a ser **"Todos los discos"
>   solo y preseleccionado + un `<details>`/`<summary>` plegado** con los otros diez en
>   grilla de 2 columnas — 119 px en vez de 693. El resto de la portada (`h1`, bajada,
>   aviso de sonido, arranque) queda igual; lo único que se achica son los márgenes de la
>   cabecera y la marca. Pide al pie ≤ 205 px — el de hoy (208) casi alcanza solo, y con
>   el de `CNT-16` (< 120) sobran ~85 px de margen.
> - **Sugerencias sin scroll:** se queda en 6 ítems (no baja a 5); sube `.sugerencias` de
>   15rem a 21rem y trunca título/disco a una línea para que el alto de cada ítem sea fijo
>   (~56 px) y 6 × 56 = 336 entre debajo del nuevo tope. Con el teclado abierto el cálculo
>   da 447-527 px libres arriba de la caja de texto contra 336 que hacen falta — sin
>   aparato real para confirmarlo (`D-12`), comando dejado para `revisor`.
> - **Revelación:** no toca el mecanismo de `UX-22 §1.4` (`scrollIntoView({block:'end'})`,
>   ya construido). Solo mide: 622 px hoy, ~722 con el reproductor de tema entero que
>   todavía no existe, ~780-812 en el peor caso (título de disco largo a dos líneas) —
>   siempre ≤ 812, así que el panel entero sigue entrando sin scroll por construcción.
> - **Pie durante la partida:** decisión de no tocar nada. `D-35` ya hace que un pie más
>   chico achique el documento en vez de dejar un hueco — no hace falta que el tablero
>   crezca para "llenar" lo que el pie deja libre.
> - Bloqueos: el texto exacto del `<summary>` y la bajada acortada a dos líneas quedan
>   para quien construya `T-221`, con `voz-ricotera.md` como vara.
>
> ### `T-216` (`UX-26`) entregado — `experiencia`, 2026-09-11
>
> `Docs/UX/UX-26-la-rocola.md`. Consume `ADR-07` (entregado en la misma ráfaga por
> `arquitectura`) y resuelve lo que le dejó pendiente: qué se ve cuando la rocola pone un
> tema (candado 4 de `ADR-04` caído), el crédito de lo que suena, el control de "poné
> otro", los cuatro estados de `UX-21` revisados y el hueco del primer arranque.
>
> - **Se ve el título del tema + si es recorte o completo. Nunca el disco.** El riesgo que
>   `ADR-07` dejó explícito para acá —leer un título en el portal y que sea la respuesta de
>   un juego treinta segundos después— se resuelve con un cálculo, no con prudencia
>   genérica: nombrar el disco filtraría sobre solo **10 discos** (`tapa.json`, contados a
>   mano), casi diez veces más específico que nombrar el tema sobre **95 recortes**
>   (`adivinar-tema.json`). Por eso el disco no se nombra nunca y el tema sí.
> - **El crédito no necesita mecanismo nuevo.** `D-21` es de tapas (imágenes con problema
>   de edición); la música ya la acredita `PORTAL.pie` de forma incondicional en toda
>   pantalla (`PieImprenta.astro:104`). Único pedido a `contenido`: que `CNT-16` no le saque
>   esa frase al pie al reescribirlo.
> - **El control de "poné otro" existe, en dos formas:** `PONÉ UN TEMA` (sube de cama a
>   rocola sin apagar nada — resuelve el caso de `ADR-07.8` en que `rearmarCinta()` arma
>   siempre en cama) y `PONÉ OTRO TEMA` (`proximaPieza()`, solo con una pieza sonando de
>   verdad). Viven debajo de la cabecera, nunca compiten por su renglón.
> - **El hueco del primer arranque no lleva indicador de carga** (sería "cargando", vetado
>   por `voz.test.ts`, o un ícono vetado por `diseno-marca.md`): la cama+púa ya suenan de
>   verdad durante la espera, y la línea del tema aparece recién cuando hay algo cierto que
>   mostrar. Si falla tres veces seguidas, cae a `cama` sola, sin ningún aviso de error.
> - Las tres cadenas nuevas (`ponerTema`, `otroTema`, la función `suena`) verificadas a
>   mano contra las siete reglas de `voz.test.ts`.
> - **Bloqueo dejado en `Docs/SUGERENCIAS/UX-para-arquitectura-cambio-de-pieza.md`:**
>   `alCambiarLaCinta()` no dispara cuando la rocola pasa de un tema a otro sin salir de
>   `sonando` (la guarda `if (estado === nuevo) return`), así que la isla no tiene forma de
>   saber que tiene que repintar el título — hace falta un aviso nuevo en el contrato de
>   `cinta.ts`/`rocola.ts`, y no es decisión de pantalla.

> ## ✅ `US-08` — "Ponelos en fila": el séptimo juego, construido y andando (2026-09-03)
>
> **Lo pidió el usuario directo, en una ráfaga**, con estas palabras: *"Arma completamente
> el juego de armar tierlist y poder compartirlas. Tierlists de temas, temas por album,
> albumes y otros mas que se te ocurran, investiga como funcionan en la web y como armar el
> tipico, no reinventes la rueda."* Se investigó primero —el formato canónico, el arrastre
> en táctil, cómo se comparte, qué rankean los fans— y con eso se decidió, se documentó y
> se construyó, todo en la misma sesión.
>
> **Estado: jugable de punta a punta, verificado en el navegador a 375×812 y en
> escritorio.** `npm test` en verde, `npm run check` con 0 errores, build de 151 páginas.
>
> **Qué es.** Se elige qué repartir entre **15 conjuntos** —los diez discos, las diez
> tapas, los que abren, los que cierran, doce temas sorteados, y el tracklist de cada uno de
> los diez discos— y se reparten las fichas en **cuatro filas que son lugares de un
> recital**: `CONTRA LA VALLA` · `EN EL MEDIO` · `ATRÁS DE TODO` · `EN LA VEREDA`, más la
> bandeja `SIN UBICAR`. Al final se comparte: una **lámina PNG** de 1080×1350 (con las tapas
> reales dibujadas cuando el conjunto es de discos) y una **dirección** que reconstruye la
> lista exacta.
>
> **Las tres decisiones que lo definen, todas en `D-36`:**
>
> 1. **Las filas no tienen color.** La rampa rojo→verde del formato le diría al que jugó al
>    quiz que la fila de arriba está bien — y `--acento-3` y `--acento-4` son acierto y
>    error, reservados. Se distinguen por nombre, posición y contador. Lo audita
>    `estilos.test.ts`.
> 2. **Son lugares, no notas.** S/A/B/C/D/F son notas de boletín anglosajón y "F" es *fail*.
>    Un lugar ordena sin calificar.
> 3. **Se toca, no se arrastra.** Ningún motor dispara `dragstart` con el dedo: "arrastrar
>    en el celular" es escribir un motor propio con cuatro trampas, encima de una vía sin
>    arrastre que hay que escribir igual (WCAG 2.5.7, `D-09`, `D-14`). El arrastre nativo
>    queda como agregado para quien tiene mouse, llamando a la misma función.
>
> **Lo que se escribió:**
>
> | Qué | Dónde |
> |---|---|
> | `US-08` + `BR-22` (sin resultado correcto), piso de 14 conjuntos | `Docs/PRODUCTO/PRD-ponelos-en-fila.md` |
> | `ADR-06` (la cuarta forma `reparto`) + `CTR-13` (el conjunto ordenable) | `Docs/ARQ/ARQ-reparto-compartido.md` |
> | `UX-23` (las tres pantallas, tocar-tocar, la tabla anti-slop del género) | `Docs/UX/UX-23-ponelos-en-fila.md` |
> | `D-36` (por qué no hay colores de fila, y por qué no se arrastra) | `Docs/DECISIONES.md` |
> | El motor, el empaquetado, los conjuntos, la lámina | `src/lib/ponelos/`, `src/lib/desafio.ts` |
> | La isla, el pincel de la lámina, la página | `src/scripts/partida-ponelos.ts`, `src/scripts/lamina.ts`, `src/pages/juegos/ponelos-en-fila.astro` |
>
> **`ADR-06`, en una línea:** el reparto viaja en el **fragmento** (`#o=1.<conjunto>.<carga>`)
> con `g=ponelos` en la query, tres bits por ficha en base64url. Los diez discos dan **6
> caracteres**, el disco más largo **7**, los 105 temas **54** — la dirección entera de una
> lista terminada mide ~70. El fragmento no viaja al servidor ni entra en ningún registro;
> lo que se pierde a cambio es la previsualización del enlace, y por eso **la imagen es el
> previsualizador**. Verificado ida y vuelta en el navegador: un link armado en una partida
> reconstruye exactamente las mismas cuatro filas.
>
> **Dos cosas que se encontraron construyendo, y que valen más que el juego:**
>
> - **`voz.test.ts` no tenía `tier`, `list` ni `top` en el glosario de `D-17`.** O sea que
>   "tier list" **pasaba el build**. Entraron los tres, con límites de palabra para que
>   `list` no toque "lista" ni `top` toque "tope".
> - **`.ficha` ya existía**: es la tarjeta lateral de un artículo de la Redondopedia. El
>   choque se descubrió con el tablero ya dibujado, viendo las tapas de los discos salir con
>   papel rayado y cinta adhesiva que nadie les había puesto. Las del juego se llaman
>   `.pieza`. **Ningún test miraba las colisiones de nombre de clase entre secciones**, y
>   sigue sin mirarlas.
>
> **`revisor` lo revisó al cerrar, y encontró tres cosas — las tres arregladas:**
>
> - **`FIND-52` (alta):** "Los diez discos" y "Las diez tapas" se armaban **idénticos**, con
>   las mismas diez tapas y de diferencia el título. Dos conjuntos que son el mismo dejaban
>   el piso contando catorce donde había trece. Arreglado siguiendo `CTR-13.2`: `discos` va
>   sin tapa (título y año) y `tapas` con tapa, así los dos comparten las fichas y son
>   preguntas distintas — uno ordena el disco, el otro ordena el dibujo.
> - **`FIND-53` (media):** el test que debía atajarlo miraba **la coherencia interna del
>   código con sí mismo** —"si el formato dice tapa, que haya imagen"— y por eso pasaba en
>   verde con los dos conjuntos gemelos. Ahora compara contra la tabla del contrato, y hay
>   una guarda nueva que falla si dos conjuntos cualesquiera son idénticos.
> - **`FIND-54` (media):** los cuatro nombres de fila viven en `filas.ts` y no en `copy.ts`,
>   así que **`voz.test.ts` no los miraba** — justo las cuatro cadenas que `BR-22` prohíbe
>   jerarquizar. Entraron al barrido con un recolector aparte, como el banco de dos ejes, y
>   se sumó la guarda que `BR-22` necesitaba y que ninguna de las siete reglas de la voz
>   cubría: **ningún texto visible del juego puede calificar** (mejor, peor, nivel, podio…).
>
> Las tres guardas nuevas se probaron **rompiendo el código a propósito** y comprobando que
> fallan. Al hacerlo apareció una cuarta cosa, que no había visto nadie: la guarda de
> `BR-22` tenía un byte de control adentro de su expresión regular en vez de un ``, así
> que **no podía coincidir con nada**. Estaba viva por casualidad, como un test verde que no
> mira. Reparada, y verificada contra las cuatro palabras que sí tiene que atrapar.
>
> **Lo que queda abierto, en `Docs/SUGERENCIAS/HILO-para-arquitectura-y-producto-el-conjunto-sorteado.md`:**
> el conjunto sorteado (`az-<semilla>`) es un quinceavo que ningún documento nombra —hay que
> decidir si entra al piso y agregarlo a `CTR-13`—, y la página manda **el catálogo** en vez
> de los conjuntos armados, que es lo que hace posible reconstruir un sorteo ajeno. Y sigue
> abierto de `UX-23`: **`UX-04` no tiene la fila de *¡Bang! ¡Bang!… Estás liquidado*** en el
> mapa sección→disco, aunque el código ya la tiene en los tres lugares donde el mapa vive.

**Ciclo actual:** **13 — EN CURSO (2026-09-02).** Sin plan de `orquestador`: lo pidió el
usuario directo, en una ráfaga, y se trabajó contra una auditoría medida en vez de contra
una lista de `T-`. El pedido, textual: *"Sigamos puliendo el ui/UX, que no quede duro ni
cortado, que los fondos se integren bien. Se agregaron nuevos recortes y videos a las
carpetas donde están las tapas, también usemos las pasadas que quedaron buenas para
fondos."*

`npm test` **456/456** (eran 437 al cerrar el 12), `npm run check` limpio, build de **150
páginas**, validador `APTA` con los dos avisos de siempre. Rama `ciclo-13/que-no-corte`.

> ## 🧹 LIMPIEZA DE LAS LETRAS (2026-09-02, misma ráfaga del ciclo 13)
>
> Pedido del usuario, textual: *"Hace una limpieza de las letras. Hay algunos acordes
> metidos en las letras, algunas tienen mensajes que no son del tema como saludos o cosas
> asi, o en la letra dice [Instrumental] y rompe el juego de las letras."*
>
> ### Por qué el filtro que ya existía no alcanzaba
>
> `anotacion.ts` mira **un renglón** y le busca una firma. Sirve para `(X4)` y para
> `GUITARRA:`, y no puede servir para esto, porque el ruido que quedaba **no viene suelto**:
> el que sube una cifra escribe un párrafo entero en la columna de la letra y la fuente lo
> parte en renglones cortos. En *Salando las heridas*, `Compases`, `El bajo` y `Que va
> cambiando` no tienen ninguna firma propia — son tres frases castellanas cualquiera. Pegadas
> a `Hay que tocar acordes`, no hay duda de qué son. **El contexto era la evidencia que
> nadie estaba mirando.**
>
> ### Lo que hay ahora
>
> - **`src/lib/cancionero/taller.ts`**: clasifica **por bloque**. Un renglón cae solo si
>   trae señal fuerte; el bloque entero cae si tiene al menos una fuerte y el 60 % de sus
>   renglones acompaña. El bloque lo cortan el renglón en blanco y la tablatura, que es
>   exactamente como se ve el párrafo en la página de origen.
> - **177 renglones despegados de la letra** en 53 temas, **nada borrado**: pasan a
>   `t: "anotacion"`, se siguen viendo en `/letras-y-acordes/` con su estilo, y salen de los
>   bancos de `US-03` y `US-07`. El registro completo, con el motivo de cada uno, en
>   **`src/data/cancionero-notas.json`** — mismo criterio que la cuarentena de `D-13`.
> - **Los 27 `\r` de `san-telmo`** se limpian en la ingesta. Viajaban hasta el HTML.
> - **`san-telmo` pasó a `solo-tablatura`**, que es lo que siempre fue: lo único que la
>   ingesta contaba como verso ahí eran el título de la página, `MELODIA.  (acordeon)`, un
>   `FIN.` y la acotación del que lo subió.
> - **`sinEtiquetaFinal`**: corta la etiqueta pegada al final de un verso cantado
>   (`"Ay, ay, ay que risa le da! Riff 1"`). Antes ese renglón entraba con la basura puesta;
>   descartarlo entero habría perdido ocho renglones del estribillo de *Luzbelito y las
>   sirenas*. `VERSION_FILTRO` subió a **7** por esto y por la re-ingesta.
> - **`npm run generar-letra -- --reanclar`**: los ids de `letra.json` son posicionales, así
>   que cualquier cambio del filtro corre las 21 anclas curadas de `T-138` y el guardián
>   aborta —con razón—. El atajo mueve el ancla al id nuevo **solo si el verso elegido sigue
>   existiendo, idéntico y en un único ítem**: se conserva la decisión de `contenido`, que es
>   lo que se eligió; el número nunca fue el dato. Las 21 se movieron limpias.
>
> ### El precio, medido y no supuesto
>
> Se revisaron **los 177 renglones uno por uno** contra el corpus: ninguno es un verso
> cantado. Dos falsos positivos aparecieron en la primera pasada y los dos se arreglaron con
> regla, no con excepción: `"Un killer riff en su contestador"` (de *Pool, Averna y papusa*
> — `riff` cantado adentro de una frase larga ya no alcanza para marcar) y las ocho líneas de
> *Luzbelito*. Queda **uno declarado**: en *Sorpresa de Shangai*, `"¿A quien le importa?"`
> comparte renglón con una nota separada por sangría ancha, y el renglón entero cae. Es un
> verso corto y genérico que los juegos ya descartaban por otra regla.
>
> **Un `\b` de JavaScript es ASCII**, y lo agarró el test: `distorsión`, `compás` y `Acá`
> terminan en una letra que `\b` no considera palabra, así que media docena de reglas nunca
> enganchaban. Ahora los bordes cuentan la tilde (`INI`/`FIN` en `taller.ts`).
>
> ### Lo que queda sabido y no resuelto
>
> - **El raspador de origen se come palabras cantadas cuando coinciden con una cifra
>   latina.** `"A brillar mi amor"` quedó como `"A brillar E amor"` (*mi* → `E`), `"LA linda
>   jaula"` como `"A  linda jaula"`, y `"SOLO DE SAXO"` como `"G  O DE SAXO"`. **Esto no es
>   ruido del transcriptor: es letra rota, y esta limpieza no lo toca** — el arreglo es en
>   `TemasRedo`, afuera del repo. Mientras tanto hay versos con un agujero en el medio.
> - **`la-bestia-pop` quedó con 1 verso utilizable** y salió del banco de `US-07` (89 → 88
>   temas, piso 60 igual cumplido). No es una pérdida: esa página de cifraclub es casi toda
>   taller de guitarra, y lo poco de letra que tiene está mangleado por lo de arriba.
>
> ## 🖨 EL CICLO 13: LA HOJA TERMINA, Y LA TINTA SE ACABA EN VEZ DE CORTARSE
>
> **La doctrina quedó en `D-34` y `D-35`.** La primera dice *una capa de fondo es una
> pasada, no un campo*: tiene dirección, principio y final, los extremos se apagan en mota,
> y si la pasada sigue de largo por un lado ese lado no se desgasta. La segunda dice que
> **toda pantalla termina en un pie de imprenta y el crédito de `D-21` vive ahí**, porque la
> tapa y su crédito son el mismo componente y no se pueden escribir por separado.
>
> ### Lo que estaba pasando, medido y no recordado
>
> Antes de tocar nada, a 375×812:
>
> | Qué | Dónde | Cuánto |
> |---|---|---|
> | **"Completá la letra" era injugable** | `#partida` y `#resultado` sin `sobre-tapa`, y el único `main` estático de los seis | Al tocar "Empezá" la tapa velada se pintaba **encima del juego entero**: pantalla en blanco |
> | Opciones con viñeta y de distinto ancho | `.opciones` como `<ul>` en dos de los cuatro juegos | 120, 226, 76 y 117 px, sangradas 40 |
> | El pie flotando con negro debajo | `/juegos/dos-ejes/` | **337 px**, el 41 % de la ventana |
> | Desplazamiento muerto | `adivinar-la-tapa` y `dos-ejes`, en `100vh` | 32 px que no llevan a ningún lado |
> | La franja del portal cortaba en línea recta | `.tapa-fondo--portal`, y=568 | de x=0 a x=375 |
> | La tapa de fondo estirada al alto del documento | `adivinar-el-tema`: 343×1513 sobre un archivo de 591×381 | se veía **el 14,6 % de la foto, ampliada 4×** |
> | El rótulo de fuente de las fichas, ilegible | `.ficha .fuente-chip`, `--texto-tenue` sobre `--papel` | **1,78:1** a 11,5 px |
> | La ficha desbordaba el papel | `white-space: nowrap` + columnas `auto 1fr` | `dd` de **589 px** en una tarjeta de 345 |
> | Y la página entera se arrastraba de costado | el mismo `nowrap`, en la prosa | chip de **981 px**, documento a 997 |
> | Cinco pantallas sin ningún fondo | quiz, dos-ejes, por-la-letra y las dos de cancionero | tres **declaraban por escrito el disco que no vestían** |
> | Dos `.tapa-fondo` en la misma página | `/redondopedia/` | el tránsito de `ADR-03` **apagado en silencio** |
>
> ### Lo que hay ahora que no había
>
> - **El pie de imprenta**, en las trece rutas: costura de rodillo, la `-media` de la
>   serigrafía de su disco como máscara sobre tinta plana, una figura recortada cortada
>   contra el borde derecho, y el crédito impreso encima. Componente:
>   `src/components/PieImprenta.astro`.
> - **El desgaste**: ninguna capa de fondo corta. Dos capas de máscara —núcleo transparente
>   hasta el 55 % y encima la veta de `--textura-rodillo`—, **sin `mask-composite`**, así
>   que un motor que no lo entienda no puede arruinarlo.
> - **Los tres recortes que trajo el usuario**, con el nombre que el despiece pedía desde
>   hace ciclos: `cordero-rulo.png`, `luzbelito-vela.png` y `momo-medallon.png`. De 393 KB a
>   89 KB. Los másteres en `Docs/UX/recortes-master/`, afuera de `public/`.
> - **El casete del portal se pisa con el de al lado** y la cinta adhesiva cruza la costura.
>   Antes los siete medían 345 px y arrancaban en x=14 o 15: una lista, no un collage.
>
> ### Los dos guardianes nuevos, y el segundo es el que importa
>
> - `contraste.test.ts` mezcla `--peso-pasada` con las diez tintas y falla si alguna deja el
>   crédito por debajo de AA. **Y falla también por lo contrario**: si el salto sobre el
>   fondo baja de 12 niveles de 255. Una atmósfera que puede leerse como nada no es
>   sutileza, es relleno con coartada.
> - `estilos.test.ts` cierra dos agujeros: el velo que se desvanece —que **pasaba el test
>   viejo por subcadena** y dejaba media foto desnuda bajo el texto— y la máscara, que era
>   una vía nueva para que un archivo de `/tapas/` llegue a pantalla sin que nadie la mire.
>
> ### Cómo se decidió, porque importa para la próxima
>
> No se eligió la dirección a ojo. Ocho auditores midieron el repo por dimensión, tres
> direcciones independientes se desarrollaron hasta el hueso, y cuatro jueces —doctrina,
> build, móvil y pedido— las puntuaron por separado. Ganó *el pie de imprenta* (8,5 · 8 · 8
> · 8). **Perdió, y es el hallazgo que más ahorró: vestir cada pantalla con la `-clave` de
> su disco a sangre completa** (4,5 · 3 · 4 · 4). Se veía bien en el prototipo y estaba mal
> por tres razones verificables: las diez claves están teñidas con el valor de `--fondo`
> (`ADR-05.1`), son la silueta de la composición **entera** de una tapa —que
> `public/arte/README.md` prohíbe por escrito—, y son la carta que el sitio se guarda para
> el acierto (`D-33`).
>
> ### 🔴 LO QUE FALTA, Y NECESITA UN TELÉFONO EN LA MANO
>
> 1. **La costura y el desgaste en un teléfono real**, no en el emulador: `mask-composite`
>    saca la capa del camino rápido en varios motores móviles, y la franja del portal además
>    se traslada con `animation-timeline: scroll()`.
> 2. **Que las trece pantallas no terminen todas igual.** Es el riesgo más caro de una regla
>    de composición uniforme y el único sin guardián. Lo que las separa es la tinta, el
>    dibujo de la pasada y la figura. Si al pasar de una a otra se lee como plantilla, la
>    salida es variar el encuadre de la pasada (`mask-position`), no agregar adornos.
> 3. **La pasada al sol.** Con `--peso-pasada: 18%` el piso salta 33 niveles en el rojo de
>    Lobo suelto. Si en Luzbelito o en Último bondi no se ve, esos dos van sin pasada — **no
>    se sube el peso**: para eso está el test.
> 4. Ver el cruce entre pantallas de punta a punta con la pestaña visible, que sigue
>    pendiente del ciclo 11 y ahora vuelve a ser posible en `/redondopedia/`.
>
> ### Lo que queda sabido y no resuelto
>
> - **El video de Último bondi no entró, y está escrito por qué**: 3.114 KB son 52 veces el
>   techo por derivado, y su índice está en el último 0,2 % del archivo (sin `faststart` no
>   se pinta un cuadro hasta bajar los 3 MB). El máster quedó en `Docs/UX/video-master/`, y
>   el comando de recodificado, el rótulo en registro 3 y dónde iría están en
>   `Docs/SUGERENCIAS/HILO-para-experiencia-y-contenido-video-ultimo-bondi.md`. **Esta
>   máquina no tiene `ffmpeg`.** El rótulo es la parte que no se puede saltear: el dibujo es
>   de Rocambole, el movimiento no, y el crédito de tapa a secas mentiría.
> - **Momo Sampler es el único disco cuya banda va casi sin pasada**: su `-media` cubre el
>   2,73 % de la lámina. Esa pantalla se sostiene con la costura y con el medallón.
> - **Oktubre es el único sin figura**: la única pieza calcada que hay de ese disco es la
>   figura encadenada, y el despiece prohíbe atribuirle álbum *"ni en el crédito del pie"*.
> - **Tres discos siguen sin entrada en `STICKER_DISCO`** —Gulp!, Oktubre y ¡Bang! ¡Bang!—.
>   Es deuda de decisión de `experiencia`, no de archivo.
> - **Los dos cortes horizontales siguen ahí**: el verso largo de `.cancion` termina en un
>   píxel seco contra el borde de su caja, y el último ítem visible de `.sugerencias` se
>   parte contra su borde. La receta del desgaste sirve para los dos con los ejes dados
>   vuelta; no se aplicó porque sobre una hoja de acordes una máscara al final del scroll
>   apaga los últimos caracteres, y eso hay que mirarlo con la guitarra en la mano.
> - **En las pantallas más cortas (`/quiz`, `/juegos/dos-ejes`) sigue habiendo ~200 px de
>   aire entre el botón y la franja.** Ya no es un rectángulo muerto —la hoja termina—, pero
>   si alguna vez molesta, la salida es de maquetado y no de fondo.


**Ciclo anterior:** **12 — CERRADO (2026-09-02).** Plan en `Docs/ORQ/ORQ-plan-ciclo-12.md`,
tareas `T-195`..`T-210`, las dieciséis cerradas y ninguna cancelada. Lo pidió el usuario el
2026-09-01: *"otro ciclo de ui/UX inmersivo, aún más creativo; tomá la mística y la estética
de Rocambole y aplicala a toda la página; sobre todo en adiviná el tema, que te sorprenda la
tapa cuando adivinás"*. **La idea: el sitio no se dibuja, se imprime.** La doctrina quedó en
`D-33` — *el acierto es el único grito del sitio*— y la hoja que la fija, en `UX-22`.

`npm test` **437/437** (eran 417 al cerrar el 11), `npm run check` limpio, build de **150
páginas**. La corrida del taller (`node scripts/generar-pasadas.mjs --ver`) sale con código 0
y los números que `ADR-05.9` ratificó.

**Qué hay ahora que no había:** la tapa que sacás **se imprime delante tuyo** por tres
pasadas de tinta con los colores medidos de ese disco (`RES-37`), en el orden en que se
imprime una serigrafía de verdad (`RES-54`), sobre papel y con el registro corrido; al fallar
llega en **una sola tinta**. La sala se vuelve el disco que acertaste. El acierto suena
entero, pero solo si prendiste el audio en ese tema. La estampa **se da vuelta** y muestra la
trasera real con la pista estampada como sello —y la trasera no se baja hasta que la tocás—.
Los carretes del casete giran mientras corre el fragmento. El resumen de la vuelta se maqueta
como afiche, con las cuatro tapas chicas. En "Adiviná la tapa" el zoom **se abre** a la tapa
entera: es la pieza que `UX-13 §4` había dejado escrita como pendiente. Y la imprenta salió
de los juegos: el registro imperfecto vive detrás de la letra grande de todo el sitio, el
rodillo separa las secciones del portal y del índice, y la ficha de disco de la Redondopedia
está estampada — quieta, porque un artículo no se mueve.

> **Cómo se trabajó, porque importa para la próxima.** El ciclo lo construyó una sesión que
> se quedó sin contexto antes de guardar nada: `T-195`..`T-204` estaban en el árbol, sin
> commitear y sin `ESTADO.md` al día. La sesión siguiente guardó eso primero, tal cual estaba
> (`d3efb56`), y recién después terminó lo que faltaba. **Lo primero que hay que hacer con
> trabajo ajeno sin commitear es guardarlo, no mejorarlo.**

> **`REV-11` — los seis hallazgos, y dónde quedó cada uno.** La ficha está en
> `Docs/REVISIONES/REV-11-la-imprenta.md`. Veredicto: 🟡 en las dos preguntas duras del plan
> (*¿sorprende la tapa?* y *¿la imprenta se volvió plantilla?*), con el límite declarado de
> que `revisor` no tiene pantalla para mirar.
>
> - **`FIND-46` (mayor) — CERRADO.** El crédito del pie no acumulaba: recalculaba la lista
>   desde el `data-tapas` estático en cada tema y perdía el disco anterior, contra lo que
>   pide `UX-22 §2.5`. Ahora vive en un `Set` de la sesión que no saca a nadie. Verificado a
>   mano: acertar un tema de Oktubre deja "Lobo suelto y Oktubre" en el pie, y lo sigue
>   diciendo en el tema siguiente.
> - **`FIND-47` (bloqueante) — CERRADO.** `T-205` estaba declarada cerrada en el commit y no
>   estaba construida: el resumen no llevaba las tapas ni usaba `RESULTADO.afiche`.
>   Construida y verificada a 375×812 y a 320 px sin desborde.
> - **`FIND-48` (mayor) — CERRADO.** Faltaba `isolation: isolate`, que `UX-22 §2.2` exige por
>   nombre: sin eso el `multiply` de las tintas no se detiene en el papel. Agregado en
>   `.estampa-papel` y en `.estampita`.
> - **`FIND-49` (mayor) — CERRADO por `arquitectura`.** Ratificó **el papel como cuarta
>   zona** en `ADR-05.9`, y encontró que el equivocado era el contrato, no el taller: su
>   regla 5 contradecía a su propio `ADR-05.2`. De paso enmendó tres desvíos que el hallazgo
>   no listaba. El hilo principal construyó el candado 7 (caso 19 de `estilos.test.ts`) y
>   corrió la verificación entera, en verde.
> - **`FIND-50` (menor) — CERRADO por `contenido`.** Retiró el sello de crédito de `CNT-14
>   §2.2` en vez de reescribirlo: `UX-22 §2.5` no pide un sello con otra forma, pide que no
>   exista ninguno.
> - **`FIND-51` (menor) — CERRADO por `experiencia`, con una vuelta de corrección.**
>   Ratificó en `UX-22 §1.4` el scroll que al revelar lleva la vista al premio en vez de al
>   botón. La medición que pidió tumbó su primera condición —en "Adiviná la tapa", ítem
>   `oktubre`, "Seguí" quedaba 457 px (56 % de la pantalla) debajo del pliegue—, así que
>   `§1.4` pasó a v4: el `scrollIntoView` apunta con `block: 'end'` al bloque que **termina**
>   en el botón. Construido y verificado: el botón entra entero en los cuatro casos, con 6 a
>   19 px de sobra.

> **Lo que este ciclo deja sabido y no resuelto, para el próximo.** La v4 de `UX-22 §1.4`
> eligió, con todos los datos sobre la mesa, que **entre ver el premio y que el botón nunca
> falte, gana el botón**. La consecuencia medida: en el ítem más cargado de "Adiviná la tapa"
> —`oktubre`, con explicación larga y sello de leyenda— la pantalla queda parada en el panel
> y **la tapa se imprime arriba del pliegue, fuera de vista**. No es un defecto, es la
> jerarquía que `experiencia` fijó a propósito y dejó escrita; pero es exactamente el
> problema que el ciclo 12 vino a resolver, reaparecido en un caso de borde. Si alguna vez se
> quiere las dos cosas, la salida no es el scroll: es el maquetado —mover la figura abajo de
> las opciones al revelar—, que es la opción 3 que `experiencia` descartó por tamaño.

**Ciclo 11 — CERRADO.** El ciclo 10 también, y en el mismo día, en dos sesiones
que no se veían. Plan del 11 en `Docs/ORQ/ORQ-plan-ciclo-11.md`, tareas `T-176`..`T-194`.
`npm test` **417/417** (eran 372), `npm run check` limpio, build de **150 páginas**.

> ## 🎞 EL CICLO 11: EL SITIO DEJÓ DE MOSTRARSE Y EMPEZÓ A HABITARSE
>
> Lo pediste así: *"todo de mejora completa de ui/ux; que toda la página sea una experiencia
> inmersiva, que cada paso se sienta como meterse en un universo mitológico misterioso"*.
>
> **El punto de partida, medido y no recordado:** todo el sitio tenía **dos movimientos**
> —los 120 ms del borde de una opción y el vuelo de la mosca— y **ni un solo token de
> movimiento**. El mundo estaba construido y no se movía.
>
> **La trampa que traía el pedido, y es lo que ordenó el ciclo entero:** casi todo lo que se
> hace cuando piden "inmersivo" ya estaba vetado en este repo. El resplandor, el desenfoque,
> el degradado, la tarjeta que se levanta, el héroe que aparece con fundido. Un ciclo de
> inmersión sin doctrina era la corrida anti-slop al revés. Por eso la vara se escribió
> **antes** de mover nada: `UX-20` (de `experiencia`), y de ahí salió **`D-32`**:
>
> > **El movimiento es del lugar, no del elemento.** Lo que se mueve es la cámara: el aire,
> > el fondo, la tinta, el paso de una pantalla a la otra. Un botón que rebota es un botón
> > pidiendo aplausos; una sala que respira es un lugar.
>
> ### Lo que hay ahora que antes no estaba
>
> | Qué | Dónde | Cuánto pesa |
> |---|---|---|
> | **El tránsito entre pantallas.** Ir de la portada a un juego dejó de ser un documento nuevo: la tinta se hunde y vuelve. `@view-transition` de CSS entre documentos (`ADR-03`) | `tokens.css`, una sola adhesión para las 150 páginas | **cero JavaScript**, y donde el navegador no lo soporta no pasa nada |
> | **El umbral.** La portada llega en un tiempo: el grano se asienta, la figura baja, la marca termina de apoyar. **Una vez por visita** | `index.astro`, `sitio.css` | 0 ms de retraso del dedo |
> | **La cama de cinta.** Ruido de cinta **sintetizado** en el navegador, apagado por defecto, que se calla sola cuando suena un fragmento (`ADR-04`, `UX-21`) | `audio/contexto.ts`, `sitio/cinta.ts`, `scripts/cinta.ts` | **cero archivos de audio**; 2,4 KB comprimidos de módulo |
> | **Los nombres del lugar.** Ocho renglones que dicen dónde estás parado (`CNT-13`) | `LUGARES` en `sitio/copy.ts`, ocho pantallas | ocho cadenas |
> | **La capitular de la Redondopedia** y la deriva de la franja del portal | `sitio.css` | — |
>
> ### Los tres arreglos que el ciclo trajo de arrastre, y valen tanto como lo nuevo
>
> 1. **El corte de `prefers-reduced-motion` dejó de ser una guillotina.** Era un `*` con
>    `!important` que apagaba todo, **incluida la respuesta al toque**. Ahora opera por
>    familia de token: se apaga la cámara, nunca el dedo. Era un P3 abierto desde el 24-ago.
> 2. **`completar-la-letra` mostraba la marca sin ningún estilo.** `.marca` estaba definida
>    en el alcance de cinco páginas y esa no la tenía: el nombre del sitio salía en la letra
>    por defecto del navegador. Nadie lo había visto. Ahora es componente global.
> 3. **El portal bajaba 109 KB de más** en recortes sobredimensionados (`oktubre-cadena.png`
>    pesaba 113 KB para un hueco de 132 px). `scripts/optimizar-arte.mjs` los ajusta al
>    triple del hueco real, y la letra titular se pide con `preload`: el título ya no
>    parpadea de Arial Black a la calcada en cada carga fría.
>
> ### Y un guardián nuevo, porque el movimiento era lo único sin auditor
>
> `src/lib/movimiento.test.ts` falla el build si aparece una duración o una curva fuera de
> `tokens.css`, si una animación no declara su equivalente quieto, si vuelve el `*` global,
> si alguien mete un enrutador de cliente, o si aparece un cuarto nombre de tránsito.
>
> ### 🟡 `REV-10` CIERRA EN AMARILLO, Y EL MOTIVO NO ES EL CÓDIGO
>
> `Docs/REVISIONES/REV-10-el-sitio-como-lugar.md`. Ocho hallazgos, `FIND-38`..`FIND-45`.
> **Los que tenían arreglo están arreglados**; los que son de `experiencia` quedaron como
> propuesta en `Docs/SUGERENCIAS/HILO-para-experiencia-desvios-del-ciclo-11.md`.
>
> **`FIND-39`, el que más duele y el mejor encontrado:** el umbral del grano y de la figura
> **eran el fundido de entrada que el comentario de al lado decía no usar**. El grano
> arrancaba en `opacity: 0` y la figura en `0.35`: fundido y deslizamiento, el tic de
> plantilla número uno, adentro del ciclo escrito para que eso no pasara. Arreglado: ninguno
> de los tres sub-pasos toca la opacidad, lo que llega **no aparece, se apoya**.
>
> **`FIND-38`:** el plan decía que este ciclo no tocaba `quiz.astro` ni
> `adivinar-el-tema.astro`, y los tocó. **No hubo conflicto** —el otro agente había cerrado y
> commiteado el ciclo 10 a mitad de camino, así que los archivos ya eran de nadie— pero el
> documento que ordena el ciclo dejó de describirlo, y eso lo encontró la revisión leyendo el
> plan contra el disco. Corregido en el plan, con la fecha y el motivo.
>
> **La cuarta pregunta —¿se siente un lugar, o una web con animaciones?— quedó en 🟡:**
> *"pesa hacia lugar, pero no se puede firmar todavía"*. Y el argumento es bueno: *"un lugar
> no se declara por la atmósfera que tiene, se declara por si sus límites se sostienen"*.
>
> ### 🔴 LO QUE FALTA, Y NECESITA UN TELÉFONO EN LA MANO
>
> **El cruce entre pantallas no se vio funcionando.** El navegador de la sesión mantiene el
> documento en `visibilityState: "hidden"` y Chrome **saltea las transiciones de vista en
> documentos escondidos**. Sí está verificado que las dos reglas existen y se aplican (leídas
> del CSSOM), que los tres nombres resuelven de los dos lados de una navegación, y que el
> navegador soporta el mecanismo. Falta ver el cruce.
>
> La lista completa está al final de `REV-10`. Las seis, en orden:
>
> 1. Ver el cruce entre pantallas de punta a punta, con la pestaña visible.
> 2. Confirmar **con el dedo** que el botón responde durante el umbral y durante el paso.
> 3. Prender la cinta y jugar una vuelta con sonido de verdad: que se calle y que vuelva.
> 4. Ver el umbral a 375×812 y decidir si los 520 ms se sienten como una cosa o como espera.
> 5. Que `quiz.astro` y `adivinar-el-tema.astro` quedaron coherentes.
> 6. Prender "reducir movimiento" **en el sistema operativo del teléfono**, no en las
>    devtools, y jugar una vuelta entera sin que falte una sola confirmación.
>
> ### Y dos defectos que encontró la refutación adversarial de la cama, ya arreglados
>
> Ninguno lo había encontrado una prueba. Los encontró alguien leyendo con la consigna de
> **refutar**, no de confirmar:
>
> - **Dos toques que se pisaban armaban dos camas**, y la segunda dejaba a la primera sonando
>   sin apagador. El candado estaba del lado equivocado del `await`.
> - **Frenar un fragmento antes de que volviera el contexto no frenaba nada:** el sonido
>   arrancaba igual cuando la promesa resolvía, y —peor, desde este ciclo— con la salida ya
>   declarada libre, así que la cama volvía a subir encima. La mitad vieja de ese defecto
>   **ya estaba en el repo desde antes**: tocar "Escuchar" y "Parar" rápido con el teléfono
>   volviendo de una llamada hacía sonar el fragmento igual.
>
> Los dos con su caso de regresión: `cinta.test.ts` y `audio.test.ts`.
>
> **Y uno que quedó anotado y no se arregló, porque es de otro juego y está latente:** el
> reproductor del tema entero de `US-02` **sigue sonando en la pantalla de resultado** si
> alguien toca "Seguí" mientras suena. Hoy no se nota porque todavía no hay temas enteros
> alojados (`D-22`); el día que los haya, se nota.

> ### Las dos sesiones del 2026-09-01, y lo que dejaron aprendido
>
> Los ciclos 10 y 11 se planificaron el mismo día, leyendo el mismo disco, sin verse. Las
> dos vieron que el último documento de `experiencia` era `UX-12` y **las dos escribieron un
> `UX-13` distinto**. Lo detectó la sesión del 11 mirando `git status` antes de dar nada por
> cerrado, no porque nadie avisara. El zoom de tapas se quedó con `UX-13`; el ciclo 11 se
> corrió a **`UX-20`+** y la reserva quedó en `Docs/IDS.md`, que es donde corresponde.
> **Ningún otro archivo se pisó de los dos lados.**

**Ciclo 10: CERRADO en una ráfaga.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-10.md`. **Catorce de quince tareas hechas**; la que falta es
`T-165`, la clave de YouTube, que es tuya. `npm test` **372/372** (eran 352), `npm run
check` limpio, build de **150 páginas**.

> ### ✅ LA v1 SE PUEDE DECLARAR, Y EL MOTIVO POR EL QUE NO SE PODÍA NO ERA CÓDIGO
>
> `REV-09` (`Docs/REVISIONES/REV-09-cierre-v1.md`) abrió en 🟡 y cerró en 🟢.
>
> **El defecto que motivó el ciclo, arreglado:** `US-02` armaba la vuelta con un
> Fisher-Yates sobre los 95 temas y **la palabra `dificultad` no aparecía una sola vez en
> el archivo**. Era `FIND-29` —lo que `REV-08` encontró en `US-07`— vivo en un juego de la
> v1. Ahora el catálogo estampa el nivel en build desde las escuchas (`CTR-03.11`) y la
> vuelta escalona.
>
> **El hallazgo que no esperaba, y era el que bloqueaba de verdad (`FIND-35`):** tres de
> los criterios de aceptación de la v1 describían **un producto que ya no existe**.
> `US-02` c3 condicionaba a Spotify, que `D-22` sacó; `US-03` c3 y `US-04` c3 condicionaban
> al cerrojo de derechos, que `D-14` sacó — y el sitio está publicado desde hace días con
> los dos juegos adentro. **Contra esa vara la v1 no se podía ni aprobar ni rechazar.**
> Los tres están reescritos, con su redacción vieja citada.
>
> **El segundo (`FIND-34`):** `US-02` y `US-03` llegaron a su piso el 27-ago y **nadie
> prendió su guarda**. Eran los dos únicos pisos sin test de no regresión, y el archivo
> seguía diciendo "Hoy: 0". Borrar un mp3 los bajaba en silencio. Ya están prendidas.
>
> ### 🔴 Las dos salvedades con las que se declara — no se declara ignorándolas
>
> 1. **`US-02` no escalona todavía**, y su mínimo de 8 Fáciles es 0. El mecanismo está
>    puesto y verificado; falta el insumo. `BR-18` apartado **(g)** decide por escrito que
>    eso **no frena** el "Listo", y el argumento no es "es poca cosa": es que `US-02`
>    tiene una **segunda rampa que los otros tres no tienen** —los seis pasos de `D-24`,
>    donde errar abre más audio—, así que el orden de los ítems no es su único molinete
>    abierto. La decisión vale mientras se cumplan tres condiciones corribles, listadas ahí.
> 2. **`FIND-37`: nada de este ciclo lo miró alguien que no lo hubiera construido.** Las
>    quince tareas y la revisión salieron de la misma mano, incluidas decisiones que son de
>    `producto`, `arquitectura` y `experiencia`. Está declarado en `REV-09` y es lo único
>    que separa a la v1 de estar cerrada del todo. **Si hay que correr `revisor` de verdad
>    sobre algo, es sobre `src/lib/escalonar.ts` y `catalogo().dificultad`.**

**Ciclo 11: PLANIFICADO, sin empezar, y corre en paralelo al 10.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-11.md`, tareas `T-176`..`T-194`. Lo pidió el usuario el 2026-09-01:
*"toda la página una experiencia inmersiva, que cada paso se sienta como meterse en un
universo mitológico misterioso"*. Empieza por `T-176`, `T-180`, `T-184` y `T-189`.

> **Los dos ciclos conviven a propósito y no comparten ningún archivo salvo `ESTADO.md`.**
> El plan del 11 abre con el mapa de conflictos: los archivos del ciclo 10 —`partida-tema.ts`,
> `quiz.astro`, `voz.test.ts`, los JSON de banco, los schemas, `PRD-alcance-v1.md`, `UX-05`—
> **no los toca ninguna tarea del 11**. `T-182` deja el quiz afuera del tránsito hasta que
> cierre `T-167`, y eso es deuda anotada, no olvido. **El que llegue segundo a `ESTADO.md`
> (`T-175` o `T-194`) lo relee antes de escribir.**
>
> El punto de partida del 11 también está medido, no recordado: **todo el sitio tiene dos
> movimientos** —los 120 ms de `.opcion` en `juego.css:104` y el vuelo de la mosca en
> `sitio.css:147`—, no hay un solo token de movimiento en `tokens.css`, y el corte de
> `prefers-reduced-motion` (`tokens.css:205`) apaga también la respuesta al toque, que es
> información. La doctrina que el ciclo propone, y que `UX-13` fija o corrige: **el
> movimiento es del lugar, no del elemento.**

**Ciclo 9: cerrado entero** (`T-128`..`T-160`, `T-148` cancelado). Los cinco frentes, más
`REV-08` y la puesta al día.

> ### 🔴 EL CICLO 10 ARRANCA CON UN DEFECTO YA MEDIDO (2026-09-01)
>
> **Los cinco pisos de la v1 están cumplidos y la v1 no está lista.** `US-02` incumple una
> regla que su propia historia declara por escrito, y está verificado en el código, no
> deducido del tablero:
>
> `src/scripts/partida-tema.ts:196-202` arma la vuelta con un Fisher-Yates sobre los 95
> temas y corta cuatro. **La palabra `dificultad` no aparece una sola vez en ese archivo**,
> y `src/data/adivinar-tema.json` no tiene el campo en ninguno de sus 95 ítems. Es
> `FIND-29` —el defecto que `REV-08` encontró en `US-07`— vivo en un juego de la v1.
>
> `PRD-alcance-v1.md` le exige a `US-02` **mínimo 8 de nivel Fácil**, definidos por
> `BR-18` (f) desde el ranking de YouTube. Hoy son **0**, y `BR-01` no se cumple: la
> primera pregunta sale del azar.
>
> **Y el segundo hallazgo del mismo tirón:** `adivinar-tema.json` es el **único banco de
> juego sin schema**. `src/lib/esquemas.test.ts` valida siete archivos y ese no está.
> Los 95 ítems del banco más grande de la v1 son los únicos que nadie valida a máquina.
>
> **Sigue esperándote la clave de YouTube.** `popularidad.json` tiene los 105 temas en
> `sin-video` y cero mediciones. Un comando prende el escalonamiento de `US-02` y `US-07`
> a la vez, sin tocar código:
> `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`
> El ciclo 10 **no se cuelga de eso**: el frente A degrada a barajado declarado, como
> `US-07`. Lo que cambia no es que el juego escalone, es que deje de decir ✅ sobre un
> criterio que no cumple.

> ### ✅ "ADIVINÁ LA TAPA" AHORA ES UN JUEGO DE ZOOM (2026-08-28)

> `npm test` **352/352** · `npm run check` limpio · guarda en `src/lib/tapa/encuadre.test.ts`
> · diez zooms nuevos por `scripts/generar-tapas.mjs`.
>
> Salió auditando el quiz y terminó en otra cosa. **El defecto:** abrí los diez masters de
> a uno y **ocho de las diez tapas traen el título impreso en la cara frontal**, mientras
> ocho de los diez ítems mostraban la tapa entera. El juego promete reconocer una tapa y se
> ganaba **leyendo**. En `TP-007` y `TP-008` era doble: las dos tapas del álbum doble
> imprimen los dos títulos, así que descartaban dos opciones de cuatro.
>
> Las únicas dos que **no** imprimen el título: `gulp` —lo manuscrito es «Patricio Rey y
> sus Redonditos de Ricota», el nombre de la banda— y `bang-bang`, sin una sola letra.
>
> ### El usuario cortó por lo sano, y quedó mejor que el arreglo que yo había hecho
>
> Mi primera pasada fue recortar solo los `media`/`dificil` y dejar enteras las faciles. El
> pedido fue otro: *"que funcione como los juegos splash — no mostrar la tapa entera sino
> un zoom alto como para que sea difícil"*. **Ninguna tapa se muestra entera**, y de paso
> el defecto muere solo: si el título no entra en el recorte, no hay nada que leer.
>
> **Lo que escalona ahora es el lado del zoom, no si hay recorte:**
>
> | nivel | zoom | del master | qué se ve |
> |---|---|---|---|
> | `facil` | 0,40 | ~381 px | un motivo entero — la multitud de *Oktubre*, el óvalo de *Luzbelito* |
> | `media` | 0,26 | ~248 px | una parte — el muñeco con antifaz, las caras en la cúpula |
> | `dificil` | 0,22 | ~210 px | un rasgo suelto — los colmillos, un ojo verde, la olla |
>
> Los diez centros están mirados uno por uno contra el master: ninguno cae sobre el título.
> Verificado a 375×812 — los diez llegan 480×480, se dibujan 326×326, 32 px de scroll en
> toda la pantalla, sin errores de consola.
>
> ### 🔴 Tres deudas declaradas, no tapadas
>
> 1. **`UX-05` no tiene esta forma.** El script dice *«Si cambia el catálogo, cambia esta
>    tabla — no al revés»* y acá fui al revés. Todo —zooms y centros— en
>    `Docs/SUGERENCIAS/HILO-para-experiencia-tapas-sin-titulo.md` para que `experiencia`
>    los adopte o los corrija.
> 2. **Reemplacé una regla del contrato.** `tapa.schema.json` decía *`encuadre: "detalle"`
>    ⟹ `dificultad ∈ {media, dificil}`*, que codificaba el modelo viejo y **bloqueaba
>    justamente los tres faciles**. Ahora dice: `estado: "listo"` ⟹ `encuadre === "detalle"`.
>    Es más fuerte, y el `$comment` de la regla cuenta por qué. Es de `arquitectura`.
> 3. **Esta forma agranda, y es la única del script que lo hace.** Un `dificil` sale de
>    210 px a 480 y se ve blando. En un juego de zoom eso es el género — pero negarse a
>    agrandar habría topeado en silencio cuán fuerte podía ser el zoom.
>
> ### 🔜 La pieza que falta, y es de `experiencia` + `arquitectura`
>
> **Mostrar la tapa entera al revelar**, que es el premio del formato splash: adivinás por
> un pedazo y al acertar ves la obra. Hoy no se puede — `aPayload` manda una sola ruta.
> También arreglaría que las explicaciones de `TP-002` y `TP-007`, que hablan del alfabeto
> del título, quedaron señalando algo que ya no está en pantalla.

> ### ✅ EL BANCO DEL QUIZ PASÓ POR UNA AUDITORÍA DE FUGAS (2026-08-28)

> `npm test` **349/349** · `npm run check` limpio · guarda nueva en `src/lib/quiz/fugas.test.ts`.
>
> Lo levantó el usuario jugando, con dos ejemplos que alcanzaban: *"de qué provincia del
> **norte** era"* con una sola provincia del norte entre las opciones, y *"tocó dos veces en
> **años consecutivos**, una fue el 93"*, que deja 1992 y 1994 y nada más. La auditoría
> encontró **catorce ítems con fuga sobre cuarenta**, en seis formas distintas:
>
> | Forma | Qué pasa | Ítems |
> |---|---|---|
> | La pregunta nombra una clase y solo una opción pertenece | «del norte», «del Ejército», «una mujer», «del oeste» | `QZ-018` `QZ-016` `QZ-022` `QZ-012` |
> | La pregunta define la respuesta | «el balneario más clásico y masivo» = Mar del Plata | `QZ-011` |
> | Eco entre el enunciado y una sola opción | «detalle canino» → jauría · «el gato» → gatos | `QZ-013` `QZ-028` `QZ-017` `QZ-015` |
> | Se elimina por lógica, sin saber el dato | tres distractores contradecían la premisa | `QZ-029` `QZ-020` |
> | Atajo que evita el dato preguntado | elegir el año más nuevo · «años consecutivos» · «el anteúltimo» | `QZ-024` `QZ-021` `QZ-026` |
> | Distractor muerto o correcta más específica | Sony Music en 1985 · la única con marca propia | `QZ-003` `QZ-030` `QZ-031` `QZ-014` `QZ-023` |
>
> ### 🔴 Lo que no se veía leyendo un ítem: la fuga entre ítems
>
> **Nueve ítems contestaban la pregunta de otro.** La explicación de `QZ-018` traía la cita
> con la que se responde `QZ-020`. El enunciado de `QZ-019` decía *Salta*, que es la
> respuesta de `QZ-018`. `QZ-005` cerraba con *«Momo Sampler (2000)»* y `QZ-006` pregunta
> justo ese año. `QZ-007` decía *«dos años después de Oktubre»* y `QZ-002` pregunta qué
> disco es de 1986.
>
> Solo importa cuando `BR-01` puede servir al que regala **primero** — facil antes que
> media antes que dificil. Con ese filtro quedaban ocho pares reales y nueve menciones
> inocentes; los ocho se arreglaron y las nueve están en la lista blanca del test, cada una
> con el motivo escrito.
>
> ### 🔴 El segundo hallazgo: el banco tenía un molinete cerrado
>
> **Diez de cuarenta ítems solo los podía contestar quien leyó *Recuerdos que mienten un
> poco*, y dos de esos diez estaban en `facil`** — o sea, `BR-01` abría la partida con
> ellos. Es exactamente el muro que `D-14` prohíbe, montado sin querer. Además `historia`
> tenía cinco ítems de memoir sobre diez, tres de ellos anécdotas de tapa de Rocambole:
> la categoría se había vuelto «la del libro» y no tenía **ni una pregunta sobre de dónde
> salió la banda**.
>
> ### El reparto por nivel también mentía
>
> | | Antes | Ahora |
> |---|---|---|
> | Faciles de `letras` | **0** de 10 (8 eran dificiles) | 2 |
> | Faciles que salían de `mitologia` | 5 de 10 — media partida abría con una leyenda | 3 de 10 |
> | Categorías que podían abrir una partida | 3 de 4 | **4 de 4** |
> | Ítems de memoir en `facil` | 2 | **0** |
>
> **Retirados tres, entran tres.** `QZ-027` (el muñeco de Marilú) por `QZ-041`, la banda en
> La Plata y La Cofradía de la Flor Solar. `QZ-034` porque su respuesta era «Todo un palo»,
> igual que `QZ-038` — dos ítems con la misma respuesta y el segundo sale gratis. `QZ-037`
> por ser el gemelo débil de `QZ-029` (los dos, el sobre interno de *Oktubre*). Los tres
> quedan en el archivo como `retirado`, con el motivo en `notaInterna`.
>
> ### Lo que ahora se audita a máquina — `src/lib/quiz/fugas.test.ts`
>
> Cinco guardas: fuga entre ítems con lista blanca justificada · la correcta no es la más
> larga más seguido que el azar · dos opciones nunca dicen lo mismo · toda categoría tiene
> al menos dos faciles para poder abrir una partida · ningún ítem `facil` depende del
> memoir. **Lo que sigue sin poder auditarse es la fuga semántica dentro de un ítem** —
> «de qué provincia del norte» con una sola del norte. Eso lo agarra el ojo, con la tabla
> de arriba como vara.
>
> ### 🔜 Queda abierto, y no es mío
>
> 1. **`QZ-007` afirma que *Un baión* salió por Wormo y `RES-20` dice Del Cielito.** No lo
>    resolví: saqué el sello del texto visible y dejé la contradicción anotada. Es de
>    `investigador`.
> 2. **`QZ-025` (Bulacio) mantiene su fuga a propósito.** La Corte Interamericana es la
>    única de las cuatro que aplica a un caso argentino, así que se acierta con civismo y
>    sin saber nada de la banda. No lo toqué porque el ítem es la copia literal del ejemplo
>    de `CNT-04`, que es decisión editorial de `contenido`. La salida que la propia regla
>    habilita —preguntar cuánto tardó la Justicia argentina, veinte años— la tiene que
>    elegir `contenido`, no yo.
> 3. **`adivinar-la-tapa` tiene el mismo problema sin auditar:** nueve de diez ítems usan
>    la tapa entera, y casi todas las tapas traen el título impreso. No lo miré a fondo.

> ### ✅ "SACALO POR LA LETRA" PASÓ POR SU CICLO ESTÉTICO (`D-30`, `D-31`)
>
> `npm test` **344/344** · `npm run check` limpio · build de **150 páginas** · detector de
> diseño en cero.
>
> El análisis se hizo con seis críticos independientes y un escéptico por dimensión:
> **31 hallazgos sobrevivieron y 14 se cayeron refutados**, y cuatro de los tumbados eran
> ideas mías —agrandar el verso, dibujarle una barra al juego, mostrar los versos que
> faltaban al revelar, sacarle las mayúsculas al copy—. Las cuatro las había decidido
> `UX-08` en contra, con argumento escrito. Buena lección: **antes de "mejorar" una
> pantalla, leer si el rol dueño ya decidió eso.**
>
> ### 🔴 El hallazgo grande: la spec estaba escrita y sin construir
>
> `UX-08` §4 especificaba la hoja de versos con todas las letras —recorte pegado, borde
> completo, fondo elevado, esquina de estampa, filete por verso— y en `juego.css` había
> **tres propiedades de layout y ninguna de dibujo**. El juego se había construido, el
> tablero decía ✅, y la mitad visual de la pieza central no entró nunca. Está en `D-31`.
>
> **Lo medido a 375×812, antes y después:**
>
> | | Antes | Ahora |
> |---|---|---|
> | La hoja con **un** verso | 545 px de recorte casi vacío | 63 px, y crece a 106 → 216 → 385 |
> | Scroll durante la partida | 945 px contra 812 de ventana | 812 exactos |
> | Salto horizontal al empezar | 7 px (el desborde invocaba la barra) | 0 |
> | **Al revelar, los versos** | se aplastaban de 515 px a **59** | quedan enteros |
> | **El buscador al revelar** | vivo, 174 px arriba de la respuesta | escondido y apagado |
> | Contraste del botón principal | **3,66:1** (usaba un token `-apoyo`) | 13,29:1 |
> | Colores de tapa que usaba | uno, y en el borde de otro disco | los diez, por tema |
>
> ### Tres agujeros que la medición encontró y el ojo no
>
> 1. **Repuntuación.** Al acertar, el buscador quedaba vivo con el tema correcto todavía
>    elegido: otro toque en `Arriesgá` **volvía a sumar cien puntos** y apilaba un segundo
>    panel. Por el otro camino —agotar los intentos— pasaba lo mismo con `Pasá`.
> 2. **`chips.hidden` no escondía nada**: `.chips` declara `display: flex` y le gana al
>    atributo. Una lista vacía se llevaba su renglón en el tablero que pelea el espacio por
>    píxel. Ahora hay un test que exige la regla `[hidden]` a todo lo que declare `display`.
> 3. **Cuatro cadenas visibles escritas a mano en la isla**, fuera de todo auditor — el
>    mismo defecto que dejó `"Link copiado."` tres ciclos en producción. Una de ellas,
>    `"Borrar lo escrito"`, en infinitivo y en los dos juegos: solo la lee quien no ve la
>    pantalla, así que nadie la había mirado nunca. Ya hay test que lo caza.
>
> ### Lo que NO se hizo, y por qué
>
> **No se portó el reloj** (`D-30`). El hermano se escucha y éste se lee: en el cuarto
> escalón hay que leer ocho versos, así que un cronómetro mide velocidad de lectura y
> castiga al lector lento por leer. El número grande son **los versos que gastaste**, que
> es la moneda de `BR-20` y el equivalente exacto del "cuánto audio te hizo falta".
>
> **No se generó `momo-medallon.jpg`.** De las cuatro piezas que un fondo de tapa necesita
> (el jpg, la regla `.tapa-fondo--*` con su velo, la entrada en `DISCO_DE` y el
> `position: relative`), esta página tenía **solo el nombre**: se sacó el cableado muerto.
> Poner la tapa sin las otras tres deja una tapa sin firma, contra la condición 1 de `D-21`.
>
> **La tarjeta compartible ahora es compartida** por los dos juegos (`lib/tarjeta/plan.ts`),
> y no sabe de qué juego es: recibe el nombre, el token que lo viste y un número grande con
> su rótulo. Acá ese número son versos; allá, minutos.
>
> ### Dos cosas que quedan abiertas y no son mías
>
> - **El `h1` del quiz tiene diez palabras** (*"Entrá a jugar con los Redondos, sepas lo
>   que sepas."*) y la regla de las ocho es de `voz-ricotera.md`. No lo toqué: es copy de
>   otro juego y decisión de `producto`. Por eso `voz.test.ts` **todavía no audita los
>   títulos de portada** — cerrar ese hueco rompe el build hasta que esa línea se recorte.
> - **Un verso del banco viene corrupto**: *"Pintan mal las cosas para ,l mi viejo"* sale
>   así desde `cancionero.json` (`maldicion-va-a-ser-un-dia-hermoso`). Es 1 de 712 y tiene
>   dueño y mecanismo — la vía de corrección de `D-25`.
>
> Los dos quedaron pedidos en `Docs/SUGERENCIAS/HILO-para-producto-y-contenido-huecos-US-07.md`.

> ### ✅ "ADIVINÁ EL TEMA" PASÓ POR LA PULIDA ESTÉTICA, Y ENTRÓ EL RELOJ (`D-28`)
>
> `npm test` **334/334** · `npm run check` limpio · build de **150 páginas** · detector de
> diseño en cero.
>
> El usuario pidió *"un ciclo completamente estético"* sobre `US-02` y, adentro del mismo
> pedido, algo que no es estético: **"más que el puntaje es importante y divertido saber en
> cuánto tiempo y qué temas adivinó"**. Las tres bifurcaciones se consultaron y eligió las
> tres recomendadas: reloj callado, tarjeta vertical, revelación con el color del disco.
>
> **Lo que se midió antes de tocar nada, a 375×812**, porque el diagnóstico a ojo se
> equivoca:
>
> | | Antes | Ahora |
> |---|---|---|
> | Los seis renglones de intento, vacíos | **192 px** (24% de la pantalla) | 58 px |
> | Dónde caía la revelación | y=489, con la hoja en 963 | y=301, y entra en el pliegue |
> | Alto de la hoja en escritorio | 32 px de scroll que no llevaban a nada | 900 exactos |
> | Colores de tapa usados por este juego | **cero de diez** | los diez |
>
> **Los cuatro cambios que valen:**
>
> 1. **El tema revelado viste la tinta real de su disco.** Los diez valores de `RES-37` ya
>    estaban en `tokens.css`, pasaban AA y este juego no usaba ninguno. Ahora Oktubre se
>    revela en rojo Oktubre. No contradice `D-19` —la base no rota, la sección sigue siendo
>    Lobo suelto—, es el precedente del cancionero llevado acá.
> 2. **La barra es una regla graduada.** La escalera se anunciaba de a un escalón por vez,
>    así que su forma no se veía: para saber que después de 0,1 vienen 0,5, 2, 4, 8 y 10
>    había que gastarlos. Ahora los números están escritos abajo de sus tramos — los cuatro
>    que tienen lugar, y quién tiene lugar lo decide `tramosConEtiqueta()`, que está testeado.
> 3. **El reloj**, con dos reglas que lo hacen honesto: para con la pestaña escondida, y
>    mide el tema y no la ficha. Doce pruebas en `reloj.ts`.
> 4. **La tarjeta compartible**, 1080×1350, dibujada en canvas con las letras reales del
>    sitio y los colores leídos de `tokens.css` — cero hex nuevos. El plan vive en
>    `lib/tema/tarjeta.ts` con test; el pincel, en `scripts/tarjeta-tema.ts`.
>
> ### 🔴 Y un defecto mío que ningún test podía ver — `D-29`
>
> `paleta.ts` importó la lista de discos de `letra/temas.ts`, que **importa `node:fs`**. En
> el navegador la isla muere entera: la portada queda dibujada y no responde a un solo toque.
>
> **Pasaron los tres controles.** `npm test` (en Node existe `fs`), `npm run check` (los
> tipos estaban bien) y `npm run build` (la página es estática y sale igual). Lo agarró
> abrir la página.
>
> Ahora hay `src/lib/islas.test.ts`: recorre el grafo de importaciones desde cada archivo de
> `src/scripts/` y falla si en el camino aparece un `node:*`. **No mira el archivo, mira todo
> lo que alcanza** — `paleta.ts` no tenía una línea de Node y sin embargo lo traía. De paso
> encontró que hay que exceptuar los `import type`, o acusa a `completar-la-letra` de algo
> que no hace: *un guardián que grita por algo que no pasa se termina apagando.*
>
> **Queda pedido a `producto`:** `Docs/SUGERENCIAS/HILO-para-producto-reloj-y-tarjeta-US-02.md`
> — los criterios de `US-02` no nombran el tiempo, y hoy el juego lo mide y lo comparte.

> ### `D-27` — la dificultad sale de las escuchas, no de una etiqueta a mano
>
> Cerrando `FIND-29`, la salida obvia era pedirle a `contenido` **89 juicios a mano** de
> "qué tan conocido es este tema". El usuario eligió la otra: **inferirla de la
> popularidad**, con los temas sin escucha como `dificil`.
>
> No es una idea nueva del proyecto — `BR-18` (f) ya había hecho esto para `US-02`, porque
> una etiqueta manual de "qué tan conocido es" se corrompe sola. Y acá encaja mejor que
> allá: en este juego **"qué tan conocido es el tema" no es un proxy de la dificultad, es
> la dificultad**.
>
> **🔴 Y lo que produce hoy hay que decirlo: los 89 quedaron en `dificil`.**
> `popularidad.json` tiene los 105 temas en `sin-video` y **cero mediciones** — la clave de
> YouTube nunca se cargó. Así que el juego **sigue sin escalonar**.
>
> La diferencia con antes no es de funcionamiento, es de honestidad: antes el barajado era
> **accidental** (nadie había conectado la dificultad) y ahora es la **consecuencia
> declarada** de que falta un dato. El generador lo grita en cada corrida en vez de dejar
> que el tablero diga ✅.
>
> **Un comando lo prende, y destraba `US-02` y `US-07` de una sola vez:**
> `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`

> ### 🔴 `REV-08`: cuatro hallazgos bloqueantes, y cómo verificar mal
>
> **La revisión encontró lo que la verificación no, por tercer ciclo seguido y por el mismo
> motivo**: el defecto no estaba en ningún ítem, estaba en el conjunto. Está en `REV-08`,
> `FIND-29`..`FIND-33`. Los cuatro bloqueantes están arreglados.
>
> **`FIND-29` — el peor.** *"Sacalo por la letra"* repartía la ronda con `barajar(banco)`
> sobre los 89 temas, **sin mirar `dificultad` en ningún punto del archivo**. El que llega
> sin saber nada podía recibir el tema más oscuro del catálogo como primera pregunta: el
> muro de entrada exacto que `D-09` y `BR-01` existen para impedir, en un juego que el
> tablero ya daba por cumplido. Ahora escalona; mientras `contenido` no cargue la curaduría
> de `CTR-09.7`, degrada a barajado **declarado** en vez de accidental.
>
> **`FIND-30` y `FIND-31` — el filtro dejaba pasar cifra como verso.** Mi regla pedía que
> **todas** las palabras fueran acordes, y una sola palabra suelta salvaba el renglón. Seis
> vueltas de endurecimiento contra el corpus real (`VERSION_FILTRO` 1 → 6).
>
> ### 🔴 La lección, que vale más que el arreglo: verifiqué el filtro contra sí mismo
>
> Corrí `motivoDescarteVerso()` sobre un banco que **ese mismo filtro había generado** y me
> dio cero ruido — obviamente. Recién una auditoría con un heurístico **independiente**
> encontró seis patrones más. **Toda verificación de contenido generado tiene que hacerse
> con un método distinto del que generó**, o no verifica nada.
>
> Y en el camino casi me como un pedazo del cancionero: la regla "acorde + palabra de
> estructura" mataba *"Mi bajo continuo suena mal"* y *"Toco la guitarra en el balcón"* —
> porque **`Mi` y `La` son a la vez acordes y palabras corrientes**. Por eso las listas
> quedaron partidas en dura y blanda.
>
> **`FIND-32`** — el botón de corrección faltaba en el quiz, el juego con más ítems del
> sitio. `BR-21` lo pedía en los tres. Ya está.
>
> **Y un defecto mío que la revisión no vio:** la selección de `T-138` **no tenía el
> guardián de anclas** que sí tenían las confirmaciones de oído. Los ids son posicionales,
> así que cada endurecimiento del filtro los corre y la curaduría se mudaría sola a versos
> que nadie eligió — y bajo `D-25` esos ítems van **directo a la pantalla sin cotejar**.
> Ahora cada selección lleva su verso como ancla y el generador aborta si no coincide.
> **Disparó tres veces durante esta tanda**, que es exactamente lo que tenía que hacer.
>
> ⚠ **Lo que queda estructural, para el próximo ciclo:** los ids posicionales (`CL-NNN`)
> hacen que cada cambio de filtro invalide la curaduría entera. La curaduría es sobre el
> **verso**, no sobre el id. Un id derivado del contenido lo cerraría de raíz.

> ### ✅ ESCRITORIO (`UX-10`): el defecto no era el ancho
>
> Medí el sitio a 1440 px antes de pedirle nada a `experiencia`, y el diagnóstico
> intuitivo estaba mal en las dos puntas: **el portal no tenía el problema** (su grilla
> llenaba en dos columnas) y **la Redondopedia ya estaba bien** (66 caracteres por línea,
> dentro del rango cómodo). Lo que sí era cierto: el contenido y los juegos quedaban en
> una tira de **544 px con 448 px de vacío a cada lado**.
>
> **Y `UX-10` encontró el defecto de verdad, que no era de tamaño:** *ningún elemento
> clicable del sitio tenía `:hover`.* Con mouse, la única señal de que algo era un botón
> era hacer clic y ver qué pasaba.
>
> **Dos cortes, separados a propósito:** uno de **ancho** (46rem — un valor que
> `cancionero.css` ya tenía escrito e inerte, tapado por el tope de afuera) y otro de
> **capacidad** (`hover: hover and pointer: fine`), porque lo que falta saber es si hay
> mouse, no si la pantalla es angosta.
>
> Verificado: el cancionero y el portal ensanchan a **736 px** (dos columnas de 360 en vez
> de 264), el artículo y el tablero de juego se quedan en 34rem **con fundamento** —el uno
> protege la medida de línea, el otro ya está calibrado y agrandarlo solo agrega recorrido
> de mouse—, y **el celular no se movió**: una columna de 343 px, sin desborde.
>
> De paso salió una asimetría: `completar-la-letra` y `adivinar-por-la-letra` **no tenían
> ningún `max-width`**, mientras los otros cuatro juegos lo repetían a mano. Ahora es una
> sola regla en `.pantalla`.

> ### ✅ EL BOTÓN DE CORRECCIÓN, Y DOS DEFECTOS QUE APARECIERON MIDIENDO (2026-08-27)
>
> `npm test` **276/276** · `npm run check` limpio · build de **149 páginas**.
>
> **El frente D cerró.** `CTR-10` (payload de once campos, dos transportes detrás de una
> interfaz), `CNT-12` (todo registro 3), `UX-09` (dónde vive) y el componente enganchado
> en `US-03` y `US-07`.
>
> **Lo que protege el diseño, y se audita a máquina:** `src/lib/correccion/armar.ts` **no
> puede tocar el navegador** —ni `navigator`, ni `Date`, ni `location`— y hay un test que
> **lee el fuente** para comprobarlo. `BR-21` fija que al que corrige no se le pide nada, y
> un módulo que no puede leer el navegador no puede filtrarlo ni por accidente. El
> renderizador es lista blanca, no un recorrido del objeto: un campo de más no se imprime.
> Verificado jugando: el mensaje sale completo y accionable, **sin una sola traza de la
> persona**.
>
> **Sin casilla configurada el mail no existe** —ni botón muerto, ni `mailto:` hacia
> ningún lado— y la cadena termina siempre en el texto a la vista, que no puede fallar.
> Nadie queda sin poder corregir (`D-14`). Prenderlo es una línea en `destino.ts`.
>
> ### 🔴 Los dos defectos que aparecieron midiendo, no leyendo
>
> 1. **En "Sacalo por la letra", el buscador caía 16 px abajo del pliegue** a 375×812 con
>    los 8 versos del último escalón — justo lo que las tres franjas de `UX-08` existen para
>    evitar. Eran el `padding` del `body`, y `min-height` dejaba crecer la columna en vez de
>    obligar a la hoja a scrollear. Ahora cierra en 812 exacto.
> 2. **`"Link copiado."` llevaba tres ciclos en producción** en el quiz, escondido del
>    auditor de voz **por estar escrito a mano en la isla en vez de en un `copy.ts`**.
>    `D-17` veta ese anglicismo. El auditor lo cazó recién cuando sumé los módulos nuevos.
>    *La lección, para el próximo: una cadena visible fuera de un `copy.ts` es una cadena
>    que nadie audita.*
>
> ### La decisión del lobo, resuelta en contra de ponerlo
>
> `UX-12` cerró lo que yo había frenado, y con un argumento mejor que el mío: **`D-19`
> gobierna paleta y letra grande por sección, no qué personaje suelto acompaña la
> pantalla** — eso es `UX-04`, anterior a la mezcla. Y el perro está fichado (`RES-06`,
> `RES-22`) como **transversal a toda la obra**, no como propiedad de *Un baión*; de hecho
> `STICKER_DISCO` le asigna a ese disco el muñeco, no el perro. **El lobo se queda donde
> está y no hizo falta tocar código.**

> ### ✅ LA v1 CUMPLE SUS CINCO PISOS (2026-08-27)
>
> `npm test` **264/264** · `npm run check` limpio · build de **149 páginas**.
>
> | Historia | Piso | Hoy | |
> |---|---|---|---|
> | `US-01` Quiz *(ahora por vidas)* | 40 | **40** | ✅ |
> | `US-02` Adiviná el tema *(audio)* | 30 | **95** | ✅ |
> | `US-03` Completá la letra | 15 | **21** | ✅ |
> | `US-04` Adiviná la tapa | 10 | **10** | ✅ |
> | `US-05` Redondopedia | 35 | **35** | ✅ |
> | `US-06` Dos ejes *(fuera de v1)* | — | 28 | ✅ |
> | `US-07` Sacalo por la letra *(nuevo, fuera de v1)* | 60 | **89** | ✅ |
>
> **Lo que destrabó el audio.** El PR #8 trajo 95 fragmentos recortados a mano; se
> renombraron al slug canónico y `scripts/ingerir-fragmentos.mjs` escribió el manifiesto
> **sin ffmpeg**, midiendo la duración en los frames del mp3. `D-26` bajó el último paso
> de la escalera de 15 s a 10 — no era opinable: `catalogo.ts` rechaza el manifiesto si un
> fragmento dura menos que el escalón más caro. Entre prometer 15 y reproducir 10, o
> prometer 10 y cumplir, gana la que no miente.
>
> **Lo que destrabó las letras.** `CTR-04` pasó a v2 en una sola corrida (schema,
> `banco.ts`, tests y generador): `cotejo` con tres regímenes excluyentes, cada uno
> verificado contra su evidencia. Lo que quedó estricto ya no es la verificación sino **el
> rastro**: por qué vía está `listo` cada ítem, sin que un régimen se pueda disfrazar de
> otro. `T-138` eligió 21 versos de bajo riesgo y el panel muestra **quién transcribió el
> verso, con su enlace** — el mecanismo de "lo veo jugando" de `D-25`.
>
> **`US-07` nació entero:** `CNT-11` como filtro corrible (`filtro.ts`, 10 tests con los
> patrones de ruido reales del corpus), la escalera 1/2/4/8, el generador (93 de 104
> temas; los 11 que faltan quedan afuera **con el motivo escrito**) y la página, que viste
> Momo Sampler. **744 versos y ninguno delata su título** — verificado sobre el banco.
>
> **Verificado jugando, no deducido:** el quiz por vidas hasta perder y retirándose;
> "Queso ruso" acertado con 0,1 s de audio; "den la [alarma]" de *Vencedores vencidos*;
> y "Drogocop" sacado en el paso 4 con la escalera duplicando 1→2→4→8.
>
> ### 🔜 Para retomar
>
> Queda el **frente E** (`T-157`..`T-160`): la pulida de escritorio y la regla de que todo
> ícono de repuesto termine siendo un recorte real. Más `T-146` (`REV-08`, la revisión del
> ciclo) y `T-147`.
>
> **Tres cosas esperan al usuario:**
> 1. **Una casilla de correo** para el botón de corrección (`T-153`, sin empezar).
> 2. **Si el lobo va al casete de la Redondopedia**, pisando la mezcla `D-19`.
> 3. **El arte de Momo Sampler** (`momo-medallon`): no existe, y la pantalla de `US-07`
>    se pinta igual solo con el color — `UX-08` dejó el brief pedido.

> ### ✅ TRAMO A CERRADO (2026-08-25) — el quiz ya se juega por vidas
>
> **Diez tareas hechas y verificadas.** `npm test` **251/251** (eran 224), `npm run check`
> 0 errores, build de **148 páginas**, y la partida jugada entera en el navegador.
>
> | Tarea | Qué quedó |
> |---|---|
> | `T-128` | **`D-25`**: `US-03` sale con letras de fuente única. La decisión escrita, con sus tres mitigaciones y qué la revierte |
> | `T-129` | **`BR-19`**: 3 vidas · escalón por pozo (10/15/15, **no** 10/10/10) · tres desenlaces |
> | `T-130` | **`US-07` + `BR-20`**: "Sacalo por la letra", escalera 1/2/4/8 versos, piso **60**, fuera del "Listo" de la v1 |
> | `T-132` | **`ADR-02` v2**: tres formas de link (`marcador`/`recorrido`/`identidad`). Salda la deuda de `dos-ejes` |
> | `T-134` | **`UX-07`**: vidas, escalón y retirada en pantalla. Ningún par de color nuevo |
> | `T-136` | **`CNT-10`**: los tres encabezados comparten la imagen de la vida como luz |
> | `T-142` | **`vidas.ts`** + 22 tests. **Aditivo: `ronda.ts` y `tramo.ts` intactos** |
> | `T-143` | La isla del quiz. Arregla `FIND-28` |
> | `T-149` | **`BR-21`**: el sitio promete solo lo que puede verificar con un comando |
> | `T-155` | **`IDEA-13`**: Supabase separado en tres, con el choque contra `D-14` nombrado |
>
> **Verificado jugando, no deducido:** derrota (`DERROTA` · "Se te apagaron las tres
> vidas." · "Pregunta 3 de 40 · nivel Fácil"), retirada (`RETIRADA` · "Pregunta 12 de 40" ·
> "Vidas al cerrar: 3 de 3"), y el aviso `NIVEL MEDIA` apareciendo **una sola vez**, en la
> pregunta 11.
>
> ### 🔴 `FIND-28` — un defecto vivo que se encontró y se arregló en el mismo ciclo
>
> `leerDesafio()` devolvía el campo `g` y **el quiz nunca lo miraba**. Reproducido en el
> navegador: `/quiz/?g=tapa&p=10&t=10&n=Fulano` pintaba *"Fulano sacó 10/10"* — desafío de
> otro juego, puntaje imposible en una ronda de 8. **Estaba en producción.** Arreglado en la
> firma (`leerDesafio(query, juegoPropio)`, segundo parámetro obligatorio) para que la clase
> entera de bug sea imposible, no improbable.
>
> De paso salió otra: el tuit de `US-02` decía "160 de 400" y su propio link "3 de 4". El
> tope de `t` subió de 100 a 9999 y ahora los dos dicen lo mismo.
>
> ### 🔜 Para retomar: el tramo B, entero
>
> `T-131` `T-133` `T-135` `T-137` `T-138` `T-139` `T-140` `T-141` `T-144` `T-145`, más
> `T-146` (`REV-08`), `T-147` (`ESTADO.md`) y el frente E (`T-157`..`T-160`, escritorio).
> **Empezar por `T-131`** (`arquitectura`, `CTR-04`), que es la que destraba `US-03`.
>
> **Dos cosas que esperan al usuario, ninguna urgente:**
> 1. **Una casilla de correo** para el botón de corrección (`T-153`). El repo no tiene
>    ninguna, y poner un Gmail personal en un `mailto:` de un sitio público es entregárselo
>    a los raspadores de spam.
> 2. **Si el lobo va igual al casete de la Redondopedia.** Se frenó porque ese casete es
>    `variante: 'historia'` y por `D-19` viste *Gulp!*; el lobo es de *Lobo suelto*. Además
>    el perro que está hoy es un personaje fichado de *Un baión*. Queda en `T-160`.

> ### `T-134` cerrada — `UX-07`, cómo se ven las tres vidas y el escalón
>
> `Docs/UX/UX-07-quiz-por-vidas.md` (nuevo). Sobre `BR-19`: cabecera con vidas (tres
> sellos lleno/tachado + "VIDAS", tinta compartida con el error `--acento-4` a propósito
> — es la única causa posible de perder una) y etiqueta ambiente de nivel ("MEDIA ·
> 4/15", reemplaza el viejo "N de 8"); aviso puntual de escalón una sola vez por salto
> (borde `--acento-2`, arriba del enunciado, sin pantalla nueva); botón de retirada fijo
> en una esquina superior, lejos del pulgar, con confirmación de dos pasos que muestra
> "hasta dónde llegaste" antes de decidir; tres pantallas de resultado (victoria
> `--acento-3`/✔, derrota `--acento-4`/✕, retirada `--acento`, sin símbolo, única con el
> widget de vidas). **Ningún par de color nuevo** para `contraste.test.ts`: todo reusa
> tokens ya testeados. Deja pendiente para quien la retome: `UX-01` queda con su sección
> de "N de 8" y el tramo de tres niveles desactualizada para el quiz (sigue vigente para
> `US-04`) — no se editó por estar fuera del alcance de `T-134`.
>
> **Siguiente para este frente:** `T-136` (`contenido`, `CNT-10`, el texto exacto de todo
> lo nuevo) y `T-132` (`arquitectura`, `ADR-02`, el payload del link para los tres
> desenlaces) — las dos ya pueden arrancar. `T-143` (hilo principal, la isla del quiz
> pasa a vidas) espera a `T-142`, `T-134` (esta), `T-136` y `T-132`.

> ### 🚀 El sitio está desplegado
>
> Lo confirmó el usuario el 2026-08-25. **Cada cambio del ciclo 9 sale a la calle**, el
> quiz que pasa a vidas incluido. Deja de haber red.
>
> ### Lo que el ciclo 9 va a hacer, y lo que no
>
> Tres pedidos del usuario en una frase, y **tres decisiones suyas** que los acotan:
>
> 1. **`US-07` — adiviná el tema por la letra.** Juego nuevo. El usuario eligió que
>    **conviva** con el de audio en vez de reemplazarlo, así que **`US-02` sigue en 0/30 y
>    la v1 no cierra en este ciclo**. Queda a un solo juego, y ese juego necesita ffmpeg.
> 2. **`US-03` sale entero, con fuente única.** El candado de `CTR-04` (dos fuentes o
>    confirmación de oído) se abre por decisión del usuario: *"salen con los temas que ya
>    tenemos, si hay que cambiar algo lo veo jugando el juego"*. Se toma por escrito en
>    `D-25`, con los versos de menor riesgo (`T-138`) y con la fuente a la vista del
>    jugador (`T-145`), que es el mecanismo de "lo veo jugando".
> 3. **El quiz pasa a 3 vidas**, con escalón cada 10 preguntas, se queda en difícil al
>    acabarse los niveles, y ganás si agotás el banco.
> 4. **Un botón para corregir** en los tres juegos, como componente compartido porque se
>    expande a todo el sitio. Ver el frente D más abajo.
>
> ### 🔴 Lo que medí al planificar, y cambia lo que se puede prometer
>
> - **Solapamiento cero entre fuentes de letra.** Cada tema tiene **una sola** fuente
>   (cifraclub 78 · lacuerda 21 · letras.com 5) y los 149 archivos crudos de
>   `TemasRedo/cancionero/data` son **uno por tema**. La vía "dos fuentes" de `CTR-04` no
>   estaba difícil: estaba **cerrada**. Por eso hizo falta `D-25`.
> - **El banco tiene exactamente 10 fáciles**, y el escalón que pidió el usuario dura 10
>   preguntas. Sin cambiar nada, **toda partida mostraría el banco entero de fáciles** —
>   la "vidriera fija" que `BR-01` punto 3 existe para impedir, y que el ciclo 7 ya tuvo
>   que arreglar una vez. Lo cierra `producto` en `T-129`.
> - **`armarRonda` lo comparten los cuatro juegos** (quiz, tapa, letra, tema). La máquina
>   de vidas es **aditiva** (`src/lib/quiz/vidas.ts`): quien edite `ronda.ts` rompe tres
>   juegos que hoy andan.
>
> ### 🆕 El cuarto pedido: el botón de corrección (frente D)
>
> *"agreguemos un boton o algo como para dejar un comentario para corregir... es mas como
> para construir conocimiento entre todos. Esto para estos juegos pero se expandira a todo
> el sitio"*. **Es la pieza que le faltaba a `D-25`**: `US-03` sale con fuente única, y el
> usuario dijo que lo iba a validar jugando. Esto le da con qué.
>
> **El transporte cambió a mitad de la planificación y manda la segunda versión:** *"la idea
> no es que se vea la correccion primero, sino que nos llegue a nosotros, luego se podria
> extender con una base de datos gratis de supabase"*. Así que **no va por issue de GitHub**
> —eso costaba abrir el repo y exigir cuenta, dos costos que se pagaban para que *se viera*—
> sino por mail y portapapeles: cero infraestructura, cero cuenta, molinete abierto.
> **`T-148` quedó `[CANCELADO]`** por eso.
>
> **`CTR-10` deja el transporte detrás de una interfaz**, así que el salto a Supabase no va a
> tocar el botón. La propuesta de alcance de ese salto está en
> `Docs/SUGERENCIAS/HILO-para-producto-supabase-scores-y-correcciones.md` y **no es menor**:
> *puntajes* y *jugadores* son ranking global y cuentas de usuario, las dos en Fuera de
> alcance y las dos rozando `D-14`. Queda como `IDEA-13` (`T-155`), sin empezar.
>
> ### 🟢 Medido de paso: el repo es privado, y abrirlo no expondría nada nuevo
>
> `gh repo view` → `PRIVATE`, con issues habilitados. El `.gitignore` ya excluye `*.pdf`,
> `*.epub`, `*.wav` y `*.mp3`, así que **el memoir del Indio no está versionado**. Lo que sí
> está —71 tapas y el corpus de letras— **ya lo publica el sitio desplegado**. Queda medido
> para cuando haga falta.
>
> ### El riesgo del ciclo
>
> **`US-03` y `US-07` salen del mismo corpus de fuente única, y no corren el mismo
> riesgo.** En `US-03` el jugador escribe la palabra que falta: si la transcripción está
> mal, **el juego le marca error al que se sabe el tema**. En `US-07` adivina cuál es el
> tema, y una palabra mal no cambia de qué tema se trata. Por eso uno sale sin discusión y
> el otro sale con `D-25` encima.

---

**Ciclo 8 — CERRADO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-8.md`, tareas
`T-113`..`T-127`. `npm test` **224/224**, `npm run check` 0 errores, build de **148
páginas**. Dos pedidos del usuario en la misma frase, y uno de los dos se cayó.

> ### El quinto juego se juega: `/juegos/dos-ejes/`
>
> **"¿Qué tipo de ricotero sos?"** — `IDEA-09` promovida a `US-06` (`T-115`) con los ejes
> que fijó el usuario: `luz ↔ oscuridad` y `orden ↔ caos`. Diez preguntas, cuatro
> cuadrantes, **una identidad y ningún puntaje**. Verificado jugándolo a 375×812: sirve las
> diez, el rombo pinta, el punto cae en la cara correcta, y **no hay un solo dígito en la
> pantalla de resultado**.
>
> **`US-06` queda fuera del "Listo" de la v1**, y lo decidió `producto` con argumento:
> `D-05` fijó cuatro juegos en el kickoff y no se redefine el contrato porque apareció una
> quinta idea buena. Entra al sitio igual, como la Redondopedia.
>
> ### 🔴 Spotify está cerrado, y no por dificultad técnica
>
> `RES-51` (`INV-25`) lo cierra en negativo, en tres escalones: **el número de
> reproducciones nunca existió** en la API pública; el índice `popularity` que sí existía
> **lo removieron en febrero de 2026**; y la única modalidad que lo conserva exige
> organización legal registrada y **250.000 usuarios activos por mes**. No hay frase que el
> sitio pueda escribir con un número de Spotify, porque no hay número.
>
> **YouTube sí** (`RES-52`, `INV-26`), y mejor de lo esperado: hay canal Topic, y los
> términos **autorizan explícitamente** guardar y mostrar el conteo (Developer Policies
> III.E.4) a cambio de mantenerlo fresco y atribuir. `BR-18` fijó qué se promete: **el
> orden, no la cifra**, refresco cada 180 días, y nunca sumar YouTube con Spotify.
>
> **Falta la clave**, y es lo único que falta de este frente:
> `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`. Sin clave el script no falla:
> deja los 105 temas declarados y dice el comando.
>
> ### Lo que este ciclo le dio a la v1, que es una sola cosa y estaba trabada
>
> `BR-18` (f) cerró el hueco que el ciclo 7 dejó abierto: **"fácil" en `US-02` pasa a ser el
> top-8 del ranking de YouTube**, no un campo manual ni un umbral fijo que se corrompería
> solo. La cuota de fáciles vuelve a ser medible.
>
> ### El banco del test tardó tres vueltas, y las tres hicieron falta
>
> `T-121` lo escribió. Dos revisiones independientes: `revisor` no encontró nada
> bloqueante, y una pasada adversarial encontró que **el eje `luz-oscuridad` medía cuatro
> cosas distintas** —con sorteo de 5 sobre 10, la misma persona caía en polos opuestos
> según qué cinco le tocaran— y que **`CU-1` nombraba pertenencia** y **`CU-3` se llamaba
> como el hincha de San Lorenzo**. Rehecho en `T-126`.
>
> La segunda pasada encontró que **la asimetría no se había cerrado: se había mudado de
> eje** — ocho de diez opciones de `oscuridad` eran *no hacer lo que hace `luz`*, y como
> extraversión es un rasgo socialmente premiado, el test tenía un lado bueno. Cerrado en
> `T-127`: hoy ninguna opción de `oscuridad` es una negación.
>
> **Está en `REV-07` y vale como vara:** dos ciclos seguidos, la pasada adversarial encontró
> lo que la verificación no, y las dos veces por el mismo motivo — **el defecto no estaba en
> ningún ítem, estaba en el conjunto.**
>
> ### Lo que el usuario trajo a mitad de ciclo
>
> - **La tapa real de *La mosca y la sopa*** reemplaza a la contratapa que el sitio usaba.
>   ⚠ `RES-44` sigue diciendo que es un rediseño; su evidencia para esa fila es la más floja
>   de las 35 (fetch 403, snippet). **El pie no le acredita nada a Rocambole** hasta que
>   alguien vuelva a mirarlo — pedido en `Docs/SUGERENCIAS/HILO-para-investigador-tapa-de-la-mosca.md`.
> - **Tres recortes reales**: la mosca (17 KB), Lupus el lobo (48 KB) y el ojo de buey de
>   *Último bondi* (29 KB). Ninguno necesitó código: el mapa `RECORTE_REAL` ya los esperaba.
> - **El "Viste (disco)" del portal, afuera** — la mezcla `D-19` se ve en el color.
>
> ### Dos verificaciones nuevas, las dos por huecos que encontró una revisión
>
> 1. **`voz.test.ts` no miraba el banco del test.** 44 cadenas visibles sin auditar en un
>    proyecto cuya postura es que se audita a máquina lo auditable. Ya las mira.
> 2. **El schema de `dos-ejes` no tenía tarea asignada en el plan.** Lo notó `arquitectura`;
>    era un hueco mío.
>
> ### Deuda declarada
>
> - **21 temas de lacuerda.net** afuera del banco de letras: fuente nueva sin ficha. Pedido
>   escrito. El generador tiene el mapa en una constante.
> - **`RES-48` tiene una cita falsa** sobre el origen de *Mi perro dinamita*. La Redondopedia
>   ya está corregida contra el memoir; la ficha no, y es de `investigador`.
> - **No queda rastro de la banda en las 20 preguntas** del test — es lo que `US-06` pide,
>   pero `producto` no lo confirmó de frente. Anotado en `CNT-09`.
> - **`ADR-02`** (link compartido) lleva puntaje y este juego no tiene.
> - Los tres hallazgos abiertos de `REV-06` y la cuota de fáciles de `US-02`.
>
> **Rangos consumidos por el ciclo 8:** `T-113`..`T-127`, `RES-51`, `RES-52`, `US-06`,
> `BR-17`, `BR-18`, `CTR-07`, `CTR-08`, `UX-06`, `CNT-09`, `REV-07`, `FIND-25`..`FIND-27`.
> Libres: `T-128`+, `D-25`+, `RES-53`+, `CNT-10`+, `REV-08`+, `UX-07`+, `BR-19`+,
> `IDEA-12`+.

---

**Ciclo 7 — CERRADO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-7.md`, tareas
`T-97`..`T-112`. `npm test` **212/212**, `npm run check` 0 errores, build de 147 páginas.

> ### Lo que cerró el ciclo
>
> - **`US-01` cumplió su piso: 40/40.** Entraron las 10 preguntas de `letras` (`CNT-08`),
>   con el reparto exacto que pide `producto`: 10 por categoría, 10 fáciles / 15 medias /
>   15 difíciles. **Es el tercer juego con el piso cumplido**, después de `US-04` y `US-05`.
> - **Cuatro deudas entre roles, saldadas.** `RES-49` (cifraclub, `INV-23`), `RES-50`
>   (Vercel y los mp3, `INV-24`), `BR-02` reescrita sobre la mecánica real de `US-02`, y
>   `CTR-01`/`CTR-03` puestos al día con el juego construido. `CNT-01` fijó el fragmento en
>   **15,0 s**. `IDEA-11` entró al backlog.
> - **El cancionero se rehizo y entró entero.** El usuario lo regeneró con tres fuentes
>   (cifraclub 78, lacuerda.net 20, letras.com 5). **104/105 temas, 101 con letra** — eran
>   96. Cinco temas que solo tenían tablatura ahora tienen versos.
> - **El banco de `US-03` pasó de 226 candidatos sobre 13 temas a 1.784 sobre 80.** La hoja
>   de escucha ahora reparte 24 versos en **24 temas distintos** y 8/8/8 por nivel.
>
> ### 🔴 Los tres defectos que el ciclo encontró, y ninguno estaba en el plan
>
> **1. El quiz servía solo preguntas fáciles.** `armarRonda` llenaba la ronda desde el pozo
> más fácil hasta completar el largo. Con 10 fáciles y una ronda de 8, **toda partida era
> ocho fáciles**: 300 rondas simuladas dieron 2.400 preguntas y **las 2.400 fáciles**. Las
> 15 medias y las 15 difíciles no salían nunca, y la categoría `letras` recién cerrada era
> inalcanzable. **El banco tenía 40 preguntas y el jugador veía 10.** Cumplía `BR-01` al pie
> de la letra y traicionaba las tres razones por las que `BR-01` existe. Arreglado con la
> mezcla derivada del piso (2/3/3 en una ronda de 8) y cinco tests.
>
> **2. Ningún schema se corría.** `banco.ts` decía que la validación la hacía "la
> verificación", y no existía ningún comando que la hiciera — el mismo defecto que el ciclo
> 6 ya había encontrado en `letra.schema.json`. Ahora corre (`src/lib/esquemas.test.ts`) y
> encontró tres cosas al primer intento: acordes mal ingeridos, la notación latina de
> lacuerda.net sin convertir, y el patrón de id del banco de letras topeado en tres dígitos.
>
> **3. Un `testimonio` de la Redondopedia citaba una ficha que no lo dice.** El artículo
> `mi-perro-dinamita` atribuía a `RES-22` que el tema nació de un verso de Poli. Se leyó el
> memoir directo: **no está**. El origen real —una prueba de sonido, con Semilla arrancando
> una línea de bajo— explica además por qué él firma como tercer autor. Corregido, con la
> página citada.
>
> ### Lo que sigue faltando, y no lo puede hacer un programa
>
> - **`US-02` no tiene un solo fragmento.** `npm run generar-fragmentos -- "<carpeta>"`,
>   con ffmpeg, que en esta máquina no está. Y ojo: **`producto` subió el piso de 20 a 30**
>   (`T-99`), así que los pisos de la v1 ahora son **40 / 30 / 15 / 10**. Sube la vara.
> - **`US-03` sigue en 0 `listo` sobre 1.784 candidatos.** `npm run hoja-de-escucha` deja
>   24 versos con el minuto en blanco. Con 15 confirmados el juego se prende solo.
>
> ### Deuda declarada
>
> **21 temas de lacuerda.net quedan afuera del banco de letras**: es fuente nueva y no tiene
> ficha. Pedido en `Docs/SUGERENCIAS/HILO-para-investigador-fichar-lacuerda.md`. El
> generador tiene el mapa en una constante (`FICHA_POR_SITIO`): cuando exista, es una línea.
>
> **Tres hallazgos abiertos de `REV-06`** (`FIND-22`..`FIND-24`), todos no bloqueantes.
> `FIND-24` es de `producto`: si `QZ-038` se queda en `letras` o migra a `historia`.
>
> **`RES-48` tiene una cita falsa**: dice "ya en `RES-22`" sobre el origen de *Mi perro
> dinamita*, y `RES-22` no lo dice. La Redondopedia ya está corregida; **la ficha no**, y es
> de `investigador`.
>
> **`arquitectura` dejó una pregunta abierta para `producto`** sobre la cuota de fáciles de
> `US-02`, que ya no tiene dónde vivir con el manifiesto nuevo. Está en
> `Docs/SUGERENCIAS/HILO-para-producto-cuota-de-faciles-en-us02.md`.
>
> **Rangos consumidos por el ciclo 7:** `T-97`..`T-112`, `RES-49`, `RES-50`, `CNT-08`,
> `REV-06`, `FIND-22`..`FIND-24`. `T-103` y `T-105` se cancelaron y sus números no se
> reutilizan. Libres: `T-113`+, `D-25`+, `RES-51`+, `CNT-09`+, `REV-07`+, `UX-06`+,
> `BR-17`+, `IDEA-12`+.

---

**Ciclo 6:** **construido, a la espera de una confirmación humana.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-6.md`, tareas `T-82`..`T-96`. **El usuario trajo el material que
faltaba** —149 JSON con letra y acordes, raspados con scraper propio de cifraclub y
letras.com— y eso desbloqueó de un saque los tres frentes que esperaban versos.

> ### Lo que quedó andando
>
> - **`/letras-y-acordes/`: la sección nueva.** 104 de los 105 temas de `RES-20`
>   (falta *Sushi*, instrumental), **ordenados por disco y cada disco vestido con su
>   propia paleta real** (`RES-37`, las diez, no las cuatro de `D-19`). Cada disco muestra
>   su **tracklist entero**: lo que no tenemos aparece tachado y con el motivo.
> - **Ficha por tema** con los acordes alineados sobre la sílaba, **transporte** (±6
>   semitonos, respeta bemoles) y **"bajar solo"** (autoscroll con velocidad).
> - **Armá tu cancionero**: elegís temas y bajás **un HTML autocontenido** con índice,
>   acordes y autoscroll. **Cero recursos externos** — abre sin internet. Verificado.
> - **La Redondopedia enlaza la letra** de sus 6 artículos `tema`.
> - **147 páginas** (eran 35), **135 tests** (eran 77), `tsc` limpio.
>
> ### 🔴 Lo único que falta, y no lo puede hacer un programa
>
> **El juego de completar la letra NO está jugable, a propósito.** Hay **226 versos
> candidatos** en `src/data/letra.json`, todos `borrador`. `CTR-04` no deja jugar un verso
> sin dos fuentes de letra o **confirmación de oído contra el disco**, y ponerle `listo` a
> un verso que nadie escuchó sería la mentira que `CLAUDE.md` declara como lo único
> estricto: si la respuesta está mal, **el juego le marca error justo al que se sabe el
> tema**.
>
> **Y no hay atajo por la otra puerta:** letras.com aportó 14 temas con letra y cifraclub
> 82, con **solapamiento cero**, así que hoy ningún ítem puede llegar a `listo` por "dos
> fuentes". Alguien tiene que escuchar. Medido el 2026-08-23.
>
> **Para prenderlo, y ya cuesta veinte minutos en vez de una semana:**
>
> 1. `npm run hoja-de-escucha` — deja **24 versos** elegidos en
>    `src/data/letra-confirmaciones.json` con el minuto en blanco (`_:__`), repartidos
>    entre 13 temas y los tres niveles de `BR-03`, y con el verso anotado al lado.
> 2. Se escucha, se reemplaza cada `_:__` por el minuto (`"1:24"`). Quién / fecha / dónde
>    salen una sola vez de `porDefecto`; **el minuto no tiene defecto y por eso no se
>    autocompleta.**
> 3. `npm run generar-letra`. Con 15 confirmados se cumple el piso de `US-03` y la pantalla
>    se prende sola: los dos estados ya están escritos y el banco decide cuál sale.
>
> ### Tres hallazgos del ciclo, que eran defectos viejos
>
> 1. **`leerTemas()` cortaba mal 6 de los 105 títulos** — se le pegaba la prosa de la nota
>    que sigue en `RES-20`. El cruce de `D-13` daba 83/105 y rechazaba temas legítimos.
>    Con el arreglo y una tabla de alias: **104/105**. Cubierto por `temas.test.ts`.
> 2. **`banco.ts` leía mal `BR-03`**: sumaba los dos lados del contexto y los comparaba
>    contra el número de una sola columna de la tabla, así que un ítem fácil correcto
>    (2 antes + 2 después) era rechazado. El schema lo tenía bien. No se notó antes porque
>    el banco estaba vacío.
> 3. **Seis temas no eran instrumentales**: la fuente les transcribió solo la tablatura.
>    `contenido` pasó de booleano a tres estados (`letra` / `instrumental` /
>    `solo-tablatura`) para no decir algo falso sobre la obra.
>
> ### Deuda declarada
>
> **El banco sale de 14 temas, no de 96.** Solo letras.com tiene ficha (`RES-23`);
> cifraclub, que aportó 82 temas, no tiene ninguna. Pedido concreto a `investigador` en
> `Docs/SUGERENCIAS/HILO-para-investigador-fichar-cifraclub.md`. El generador tiene la
> fuente en una constante: cuando la ficha exista, son dos líneas.
>
> **Rangos consumidos por el ciclo 6:** `T-82`..`T-96`, `CTR-06`. Consumidos por la sesión
> suelta del 2026-08-23: `D-23`. Pedidos y sin escribir: `RES-49` (cifraclub), `RES-50`
> (límites de Vercel). Libres: `T-97`+, `D-24`+, `RES-51`+, `CNT-08`+, `REV-06`+, `UX-06`+,
> `BR-16`+.

---

## Sesión suelta del 2026-08-24 — la auditoría de detalles, y la figura encadenada

No es un ciclo: es una skill nueva pasada por el portal y el quiz, y un recorte que trajo
el usuario.

**La skill.** `pbakaus/impeccable` (246K instalaciones), instalada global y enlazada a
Claude Code. Es la que caza los 64 patrones de interfaz genérica de IA — el mismo enemigo
que `.claude/rules/diseno-marca.md` ya tenía escrito con nombre y apellido. Se corrió su
comando `audit` sobre `index.astro` y `quiz.astro`. Informe completo, con la medición de
cada hallazgo, en `Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md`.

> Ojo con el detector: necesita `htmlparser2`, `css-select`, `css-tree` y `domutils` en el
> directorio de la skill. Sin ellos avisa `DEGRADED` y cae a expresiones regulares, que no
> evalúa variables CSS ni contraste computado. Están instaladas; si se reinstala la skill,
> hay que volver a ponerlas o el resultado limpio es un subconteo.

**Diagnóstico: 15/20.** El detector devuelve **limpio** sobre el HTML construido, que no es
común. Lo que bajaba la nota no era el sistema visual: era la deriva entre el sistema y lo
que el JavaScript crea en tiempo de ejecución.

**Los cuatro P1, arreglados y verificados en pantalla:**

1. **`.primario` era una regla con alcance de página, así que no alcanzaba a los botones
   que crea una isla.** El `SEGUÍ` del quiz salía como botón nativo gris —medido:
   `rgb(240,240,240)`, `2px outset`, 59 × 48— sobre fondo de tinta. Es `FIND-15` otra vez.
   Ahora es componente global en `juego.css` con `--tinte-accion`, que **se hereda por el
   árbol del DOM**. Alcanzó a siete botones en cuatro juegos: `dos-ejes` y
   `completar-la-letra` ni siquiera tenían la regla.
2. **Se fue el auto-avance.** Medido: el panel de feedback duraba **1.577 ms** con una
   explicación de seis segundos de lectura, y eso pasaba en **22 de los 40 ítems**. Ahora
   toda pregunta espera el dedo con `SEGUÍ`, como `UX-01` v2 ya había hecho para los ítems
   con rótulo. Sale de paso una violación de WCAG 2.2.1 (Nivel A).
3. **El foco ya no se cae al `<body>`** en cada cambio de pantalla, y el panel de feedback
   es `role="status"`. Regiones vivas en la página: 0 → 1.
4. **El link que manda `COMPARTÍ` tiene tarjeta.** Open Graph, ícono y `theme-color` en las
   **148 páginas**. `public/tarjeta.png`, `icono-180.png` y `favicon.svg` los genera
   `npm run generar-marca-social` **leyendo los colores de `tokens.css`**.

**Los siete P2, también:** la categoría dejó de imprimirse cruda (se leía `MITOLOGIA`, sin
tilde); el resultado tiene salida al arcade (era un callejón sin salida); el puntaje y el
tramo pasaron a letra de marca (eran `system-ui`); la escala tipográfica de la portada del
quiz se abrió a 20 / 28 / 38; `color-scheme: dark` y `::selection`; y las imágenes declaran
medidas —leídas del archivo en build por `medidas()`— y cargan diferido.

> **Un hallazgo se corrigió a la baja.** El informe decía "salto de maquetado"; lo medí
> después y **el CLS del portal es 0**, y ya lo era. Las imágenes del casete tienen ancho y
> alto fijos por CSS y las otras dos están fuera de flujo. Lo que faltaba de verdad era el
> `loading="lazy"`.

**Quedan abiertos:** los nueve P3, la misma jerarquía plana en `adivinar-la-tapa.astro`
(20 / 24 / 33,6 px — apareció al pasar el detector por las cuatro páginas de juego), y los
`.primario` con alcance que sobreviven en `adivinar-el-tema` y `adivinar-la-tapa`.

### 🟡 La figura encadenada entró a la portada, y le falta la ficha

El usuario trajo `Docs/UX/OktubreCadena.png` y pidió que reemplace al perro al lado del
título del portal. Hecho, y es también la imagen de la tarjeta al compartir.

**Pero `public/arte/README.md` decía que esa pieza no se usaba hasta tener ficha**, y la
razón no es de derechos: `INV-02` reporta que la figura encadenada **no estaba en el arte
del vinilo de *Oktubre* del 86** y que se difundió con la reedición en CD — "reportado, con
buena base, verificar antes de usar".

Resolución, sin frenar la pieza ni afirmar el dato: **se muestra y no se le atribuye
disco.** No entra en `tapasUsadas`, así que el crédito del pie no la nombra; el texto de la
tarjeta acredita a Rocambole —eso sí está firme— sin nombrar el álbum. Ficha pedida en
`Docs/SUGERENCIAS/HILO-para-investigador-figura-encadenada.md`, donde los tres desenlaces
posibles sirven, y uno de ellos es una pregunta de quiz de primer nivel.

**Verificación:** build de 148 páginas, `npm test` **224/224**, `npm run check` 0 errores.
Detector limpio sobre el HTML construido. En el navegador: sin desborde a 320, 375 y
1280 px; 24 pares de texto con el peor en 4,67:1; ningún objetivo táctil bajo 48 px.

---

## Sesión suelta del 2026-08-23 — el audio, y el candado de las letras

No es un ciclo: son dos preguntas del usuario resueltas de punta a punta.

**`D-23` — los 2,5 GB no entran al repo.** El usuario trajo el número que faltaba desde
`D-22`: la discografía completa que tiene pesa 2,5 GB. Contra las ~7,2 h de `RES-20` eso
da ~770 kbps promedio — **no es mp3, es lossless o casi**, y el mismo catálogo a 128 kbps
son ~400 MB. Decidido: los 2,5 GB se quedan en la máquina como material de trabajo, y al
sitio va un derivado en **dos niveles** — fragmento de `CTR-01` para los 104 temas
(**12,5 MB** en total) y tema entero solo para los que un juego revela (~40, ~160 MB).
**Se descartó guardar medio tema** (idea del usuario) por aritmética: `US-02` necesita 15
segundos, no dos minutos, y medio tema pesa doce veces más que el fragmento para el mismo
juego. Queda pedida `RES-50` a `investigador` en
`Docs/SUGERENCIAS/HILO-para-investigador-limites-de-vercel-para-audio.md`: **la única
pregunta que puede mover algo es si Vercel Hobby banca ~180 MB de mp3 en el repo.** La
decisión no depende de la respuesta, solo dónde viven los archivos.

**Tres candados nuevos en el juego de las letras, porque no había ninguno.** La regla de
`CTR-04` que decide si el juego miente —para estar en `listo`, o te escucharon o tenés dos
fichas de letra— **vivía solo en `letra.schema.json`, que ningún test corría.** Ahora:

1. Está en `src/lib/letra/banco.ts` y rompe el build. Seis tests nuevos.
2. `generar-letra` **aborta sin escribir** ante una confirmación que no es una escucha:
   minuto vacío, `"si"`, `"1:60"`, fecha inválida, `donde` inventado, id inexistente.
3. **Guardián de ids.** Los ids son posicionales (`CL-001`...): un banco regenerado los
   corre y una confirmación se mudaría **en silencio** a un verso que nadie escuchó. La
   hoja guarda el verso como huella y el generador compara.

**Dos defectos del banco, encontrados al mirarlo:** el banco bajó de **313 a 226**
candidatos y es una mejora — **79 repetidos** (el mismo verso de estribillo entraba una
vez por repetición) y **8 sin verso alrededor** (la `Invocación` de *Lobo suelto* daba tres
ítems cuyo enunciado entero era `____ !`; ese tema salió completo).

**Verificado:** `npm test` → 135/135. `npm run check` → 0 errores.

**Ciclo anterior:** **5 — EN CURSO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-5.md`: 17 tareas,
`T-64`..`T-80`. **Foco: el sitio sale a la calle y el quiz se viste.** Lo segundo es la
mitad del pedido del ciclo 4 que quedó sin hacer (`UX-05` §2, siete superficies).
**Los versos siguen sin transcribirse y es deliberado:** son material de origen, como los
recortes de audio de `US-02`, y entran por la mano del usuario. El ciclo deja lista toda la
maquinaria de `US-03` alrededor, y le pregunta a `producto` si un artículo `tema` se
sostiene sin citar verso — si dice que sí, `US-05` llega a 35/35 sin un solo verso.

> ✅ **`T-71` (`experiencia`) — cerrada.** `UX-04` pasa a v4 y `UX-05` a v2. Confirmados
> los dos desvíos que reportó el hilo principal (`Docs/SUGERENCIAS/HILO-para-experiencia-
> desvios-de-UX-05.md`): `letras` sale entera de la trasera de *La mosca y la sopa* (tres
> filas corregidas), y el fondo de Oktubre queda anclado en la franja inferior del portal,
> nunca detrás de la cabecera. Los números de 480/640 px bajaron al techo real del
> material (másters 953×953/1181×929 px, catálogo real 210–591 px, destino real 34–96 px);
> el tope de 60 KB queda igual, con nota de que hoy nadie lo roza (máximo real 53 KB).
> **Hallazgo propio, no pedido:** el mismo problema del desvío 2 (texto sin par testeado
> sobre velo) iba a repetirse en dos pantallas que el ciclo 4 no llegó a construir —
> `--marca-rojo` en la presentación del quiz y `--acento` (tramo medio, ~4,48:1 calculado a
> mano) en el resultado —, así que `UX-05` v2 ya las deja acotadas antes de que `T-72` las
> construya. `UX-05` §2 suma el mecanismo del "sello de esquina" en detalle (dónde cae, qué
> tamaño, cómo convive con el pulgar) para que `T-72`..`T-74` lo lean y no vuelvan a
> preguntar. Queda anotado y sin resolver, fuera de la carpeta de `experiencia`: la ficha
> de disco de *La mosca y la sopa* en la Redondopedia todavía muestra el mismo frontal que
> `RES-44` descartó — es de código (`generar-tapas.mjs`) y de `contenido` (el texto de esa
> ficha), no algo que UX pueda mover sola.

> **Ciclo 4 — CERRADO.** Las 20 tareas `T-44`..`T-63`, más los hallazgos de las
dos revisiones, corregidos y verificados. **Las tapas reales entraron al sitio y hay un
segundo juego jugable**: `US-04` (adivinar la tapa) cerró su piso en 10/10 y se juega de
punta a punta. La Redondopedia pasó de 26 a **29 de 35** artículos. **77 tests**, `tsc`
limpio, build de **35 páginas**. Repo en **https://github.com/knesantos/ArcadeRicotero**.
Los ciclos 1, 2 y 3 también están cerrados. **Ningún ciclo tiene nada abierto.**

> 🔴 **Y algo peor que faltaba código: no hay repositorio git.** 55 archivos de trabajo de
> dos ciclos completos, sin un solo commit y sin respaldo. Lo encontró `orquestador` al
> planificar. Es `T-28` y va **antes que todo lo demás**.

> 🟢 **LEER PRIMERO — `D-14` reencuadra el proyecto entero.** Lo decidió el usuario el
> 2026-08-19 con toda la evidencia legal sobre la mesa, y **manda sobre cualquier cautela
> que este archivo o cualquier otro haya escrito antes**.
>
> **Es un fan site sin fines de lucro, de poco volumen, hecho para divertirse.** Tres cosas:
> **(1) El riesgo se asume.** Si llega un reclamo, **se da de baja y listo**. El gate de
> publicación de `D-07` **ya no existe**; `CNT-01` pasó de cerrojo a **mapa** de qué se usa.
> Nada espera permiso.
> **(2) El conocimiento popular vale.** No hay mucho oficial **y no debería importarnos** —
> y no es una excusa: `RES-23` verificó que la fuente autorizada de letras no existe ni
> existió, y `RES-21` que el memoir se declara "apenas mi versión". Se dejó de exigir fuente.
> **(3) Abrir los molinetes.** Nada se le niega a nadie por no tener con qué entrar: ni
> cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas"
> del alcance eran la misma decisión y ahora tienen nombre.
>
> **Lo único estricto que queda**, y no es legal: que **la respuesta correcta sea correcta**
> — si el dato está mal, el juego le marca error al que se sabe el tema. La defensa no es
> verificar: es **rotular bien**, en las tres casillas que el schema ya hace cumplir.

> **Lo que queda para el ciclo 3, en orden de valor.** `letras` es la única categoría en
> cero y ahora tiene fuente (`D-13`): son las 10 que faltan para el piso de 40 de `US-01`.
> `US-02` y `US-03` tienen contrato o insumo pero **ningún ítem cargado**, y `US-04`
> tampoco. Del lado de derechos, las **8 preguntas legales bajaron a 4**: `RES-11` a
> `RES-14` respondieron audio, tapas y cita de versos. **`ADR-01` ya no espera `E-04`:
> `RES-26` lo volvió irrelevante** — ver abajo.

> ✅ **RESUELTO — el bloqueo de alcance por falta de letras se desarmó. No hay que tocar el
> piso de `US-01` ni la definición de "Listo".**
>
> La versión anterior de este aviso decía: `RES-23` descartó letras.com, no hay otra fuente,
> la categoría `letras` no se puede escribir, el piso de 40 no se alcanza por aritmética
> (techo 30/40), y `US-03` queda bloqueado entero. **Esa cadena partía de una premisa que el
> usuario dio por cerrada el 2026-08-19: que hacía falta una fuente autorizada.**
>
> **Decisión del usuario, con la objeción de `RES-23` sobre la mesa:** se usan letras.com y
> **bestiarioredondo** igual. Fundamento: *la banda tiene una mística de pocas cosas
> oficiales*, y la investigación lo respalda — no hay sitio oficial de letras, nunca lo
> hubo, el memoir no las trae (`RES-21`), y la banda se construyó sin multinacional, sin TV
> y sin publicitar recitales (`RES-07`). **Esperar una fuente oficial es esperar algo que la
> banda deliberadamente nunca produjo.**
>
> El riesgo de `RES-23` sigue siendo real y se acepta acotado, con cinco mitigaciones. Dos
> importan de verdad: **cruzar todo contra los 105 temas de `RES-20`** —obligatorio, gratis,
> y mata el único error demostrado de la fuente, las 149 entradas contaminadas con material
> del Indio solista y de Skay— y **confirmar de oído contra el disco**, que es realista
> porque `BR-03` muestra 2/1/0 versos: el piso de `US-03` necesita **~30 versos**, no 15
> letras enteras. Detalle en la sección final de `INV-21-letras-y-fuimos-reyes.md`.
>
> ✅ **Ya está registrado como `D-13`.** El hilo principal le asignó el número, y de paso
> quedó escrita en `Docs/IDS.md` la regla que faltaba: **el prefijo `D-` lo escribe solo la
> sesión principal**; una sesión paralela deja la propuesta sin número y espera. No haberlo
> numerado desde allá fue lo correcto.
>
> **`D-14` fue más lejos que esto:** ya no se trata solo de las letras. El conocimiento
> popular es fuente legítima para todo el proyecto.

> ⚠ **Dos sesiones escriben este archivo.** El encabezado quedó desfasado de su propia
> bitácora porque las dos sesiones lo actualizan y ninguna ve a la otra. **Manda el disco y
> manda la bitácora**, que es acumulativa: si el encabezado dice algo que la bitácora
> contradice, gana la bitácora. `Docs/EQUIPO.md` dice que `ESTADO.md` es del hilo
> principal, pero eso se escribió cuando había un solo hilo principal.

> ⚠ **La sesión paralela de investigación abrió una segunda tanda.** Entregó
> `RES-04`..`RES-09` en `INV-02-banda-cultura-estetica.md` (rango consumido entero) y ahora
> `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`, porque el usuario consiguió los
> libros. **Esta sesión sigue numerando en `RES-10`..`RES-19`**; `RES-04`..`RES-09` están
> quemados y `RES-20`..`RES-29` son de la otra. Reserva completa en `Docs/IDS.md`.

> 🔴 **Y trajo un dato que nadie tenía: el Indio Solari murió el 5 de junio de 2026**
> (`RES-04`, dos fuentes independientes). Todo el repo se escribió hoy hablando de la banda
> sin saberlo. **No cambia el alcance ni los cuatro juegos.** Deja dos cosas por decidir, en
> `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`.

## Sesión suelta del 2026-08-23 (2) — la voz del sitio, medida

El usuario pidió **analizar a fondo cómo habla y escribe el Indio** para que el sitio no
tenga texto genérico y para que los juegos se presenten *como si fueran un tema*. Era la
idea que estaba guardada desde el 21 en
`Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md`: **se tomó**, y ese
archivo ahora cierra con lo que se resolvió y lo que queda.

**Regla nueva: `.claude/rules/voz-ricotera.md`**, con el mismo estatuto que
`diseno-marca.md` — obliga a todos, roles incluidos. Los números salen de medir dos corpus
que ya estaban en el repo, **sin salir a la web**: el memoir (`RES-21`, 192.464 palabras) y
las letras de los 104 temas del cancionero (2.958 versos).

**Los tres hallazgos que más corrigen la intuición:**

1. **No es el porteño de la caricatura.** En 192.464 palabras dice *che* **9** veces,
   *viste* **15**, *digamos* **3**. Meter esas muletillas para sonar argentino es
   exactamente lo que no suena a él.
2. **Dice "la gente"** (333) y casi nunca "el público" (39) ni "los fans" (**2**).
3. **Declara la duda todo el tiempo** (*creo que* 81, *no sé* 71, *puede ser* 41) y **no
   tiene épica militante** (*lucha* 6, *resistencia* 7). El sitio no arenga: rodea, atenúa
   y avisa cuando no sabe — que es, de casualidad perfecta, el mecanismo que Wikipedia no
   puede usar y que `D-20` fue a buscar para la Redondopedia.

**Tres registros, y mezclarlos es el defecto:** *el que canta* (títulos, casetes, botones;
techo de 8 palabras, que es el percentil 90 del verso), *el que cuenta* (Redondopedia,
explicaciones; oración de ~13 palabras) y *el que rotula* (leyenda, testimonio, errores,
avisos, y los tres temas de `CNT-04`/`CNT-06`), que va **seco y sin voz**.

**La línea que no se cruza, escrita antes que nada:** el sitio escribe como aprendió
escuchándolo, **nunca se hace pasar por él**. Murió hace once semanas (`RES-04`) y, sobre
todo, una frase inventada con su firma envenenaría el rótulo `testimonio`, que es lo único
que el sitio promete de verdad.

**El test que faltaba existe: `src/lib/voz.test.ts`**, seis pruebas sobre las cadenas
visibles de los cinco módulos de copy. Encontró **once botones en infinitivo** —que `D-17`
no permite— y se corrigieron: `COMPARTIR`→`COMPARTÍ`, `JUGAR DE NUEVO`→`JUGÁ DE NUEVO`,
`VOLVER`→`VOLVÉ`, y los `Empezar`/`Seguir`/`Volver` de `letra` y `tapa`. **185/185 en
verde.** `CNT-05` (de `contenido`) y `UX-01`/`UX-02`/`UX-04`/`UX-05` (de `experiencia`)
todavía citan el texto viejo: quedó anotado en la sugerencia, no se tocaron.

**El barrido se aplicó**, con las dos decisiones del usuario tomadas en la misma sesión:
la Redondopedia va con **prosa con voz y rótulo seco**, y el copy nuevo entra en **las
superficies que presentan** — portada, los seis casetes, la pantalla 0 de cada juego y los
tramos del resultado. **No se tocó nada de adentro de la partida**: enunciados, opciones e
instrucciones siguen bajo `CNT-02` y `UX-01`, donde entender va antes que sonar.

Ahora cada casete abre con un verso de ocho palabras o menos y explica después — "Ocho
preguntas y ninguna piadosa", "Lo tenés en la punta de la lengua", "Rocambole dibujó; vos
ponés el disco", "El hecho como hecho, la leyenda como leyenda" —, y la portada arranca con
"Entrá, que los molinetes van abiertos". Verificado en el sitio construido (147 páginas,
sin errores de consola). **186/186 tests, `tsc` con 0 errores.**

## Sesión suelta del 2026-08-23 (3) — "Adiviná el tema" salió de la cocina

El usuario trajo el juego que quiere **calcado**: https://lessgames.com/songless. Pidió el
relevamiento antes que el código —*"no hay que reinventar la rueda"*— y tres cosas
concretas: elegir **todos los temas o por disco**, **autocompletado** para no perder el
tiempo tipeando, y que el **botón de escuchar sea fácil y rápido**. Y la escalera:
**0,1 · 0,5 · 2 · 4 · 8 · 15 segundos**.

**El mapa está en `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`**, jugado y
medido con el navegador, no mirado de costado: la escalera se sacó apretando *Skip* cinco
veces y leyendo la etiqueta; los anchos de la barra, del CSS; la búsqueda difusa, probando
`zzzzq` y viendo que ofrece temas de ZZ Top. Trae la tabla de qué se copió y qué **no**, y
por qué.

### Lo que quedó andando

**`/juegos/adivinar-el-tema/` se juega.** Pantalla nueva de punta a punta, verificada en el
navegador a 390×844 y a 412×860:

- **Elegís el pozo**: todos los discos, o uno. Los discos sin audio salen apagados y con
  el motivo escrito, no escondidos.
- **Seis renglones de intento**, visibles desde el arranque: la escalera se ve antes de
  gastarla. **Errar abre el escalón siguiente** — es el corazón del juego, y es lo
  contrario de lo que decía `BR-02`.
- **Barra de seis tramos**, cada uno del ancho de lo que *ese* paso agrega. El último se
  come la mitad, porque de 8 a 15 hay siete segundos nuevos.
- **Un solo botón grande que cambia de nombre**: con la caja vacía dice *Pasá*; con un tema
  elegido dice *Arriesgá*. Mismo lugar, mismo pulgar.
- **El buscador**, que es la pieza que el usuario marcó como importante. Perdona tildes,
  espacios (`jijiji` = `Ji ji ji`), empezar por el medio del título y letras salteadas
  (`vncdrs` → *Vencedores vencidos*). **La lista se abre para arriba**, que es lo único que
  el teclado del celular no tapa. Ofrece **los 105 títulos**, no los que tienen audio: si
  ofreciera solo los jugables, el desplegable sería la respuesta.
- **El reveal** da tema, disco, año, pista, puntos, el enlace a la letra y los acordes, y
  el tema entero si el archivo existe (`D-22`).
- **185 tests en verde**, `npm run check` sin errores, 147 páginas.

### 🔴 Lo único que falta, y es un archivo, no una decisión

**No hay audio.** `public/audio/` no existe y el manifiesto está vacío, así que la portada
dice que no hay con qué jugar y da el comando. **La pantalla no se rompe: lo declara.**

Para prenderlo, con la discografía que el usuario ya tiene en la máquina (`D-23`):

```
npm run generar-fragmentos -- "<carpeta con los discos>"
```

Empareja cada archivo con los 105 de `RES-20` por la misma puerta de `D-13` que usa el
cancionero —**lo que no resuelve se informa y no se genera**—, corre los dos comandos de
`CTR-01.6` (`loudnorm` sobre el tema entero, después el recorte a 96 kbps mono) y verifica
la tabla de `CTR-01.7` archivo por archivo. Con `--enteros` deja además el tema completo
para el reveal.

**Necesita ffmpeg y en esta máquina no está.** `winget install Gyan.FFmpeg`, o pasarle la
ruta con `--ffmpeg=`.

### Lo que hay que corregir, y no es del hilo principal

- **`BR-02` quedó al revés de lo que el juego hace** (intento único vs. seis intentos con
  desbloqueo) y le falta la sexta fila de puntaje. Pedido en
  `HILO-para-producto-mecanica-y-escalera-de-us02.md`. **La tabla que puse —100/80/60/40/
  20/10— es provisoria.**
- **`CTR-01.9` sigue con cinco pasos y 10 s.** `D-23` ya había escrito los 15 s; el máximo
  de `CTR-01.3` sale de `CNT-01` y quien tiene que confirmarlo es `contenido`. Pedido en
  `HILO-para-arquitectura-escalera-de-seis-y-modo-buscador.md`, junto con el
  `modoRespuesta: "buscador"` que cierra `CTR-03.5` con un valor que no estaba en la lista.
- **`D-23` tiene un número viejo, y a favor:** dice 12,5 MB para los 104 fragmentos, pero
  eso son 120 KB cada uno, que es el peso de **10** segundos. A 15 s son ~180 KB → **~19 MB**.

### Dos hallazgos al costado

1. **La letra de la firma no tiene acentos** (`RES-42`), así que el botón `Compartí` salía
   partido a la mitad de la palabra — se veía roto de verdad, no en teoría. Resuelto como
   la regla de marca ya mandaba: la palabra va en `--fuente-rotulada` y **no** se le saca la
   tilde (`D-17` no negocia el voseo). Clase `.primario.firma.con-tilde`, que se borra el
   día que los acentos existan.
2. **Los `<style>` de un `.astro` tienen alcance y no llegan a lo que crea el JavaScript.**
   Por eso el botón de compartir salía angosto — en este juego **y en el quiz**. Se movió
   la caja de `.primario.firma` a `juego.css`; ahora los dos empatan con el botón de abajo.

**Rangos consumidos por esta sesión:** `D-24`. Libres: `T-97`+, `D-25`+, `RES-51`+,
`CNT-08`+, `REV-06`+, `UX-06`+, `BR-16`+.

---

## Próximo paso

> ⚠ **El ciclo 14 cerró el 2026-09-11.** Ver el bloque 🎛 del encabezado. Lo que dejó
> pendiente, por orden de valor:
>
> 1. **Cargar los temas enteros**, que es lo único que le falta a la rocola para hacer lo que
>    el pedido decía: `npm run generar-fragmentos -- "<carpeta>" --enteros`. Sin eso suenan
>    los recortes, que es la caída declarada, no un defecto.
> 2. **Decidir los tres desvíos de presupuesto** del bloque de arriba (el pie en 179, el
>    casete en 198, el portal en 2,49 pantallas). Los tres se resuelven tocando tipografía o
>    el token de la franja, y las dos cosas son del lienzo y de `experiencia`, no del que
>    construye.
> 3. **Leer `REV-13`** (`Docs/REVISIONES/`), la revisión del ciclo.
>
> **Lo de abajo sigue valiendo como pendientes sueltos, no como el próximo paso.**

**El ciclo 10 cerró. Lo que sigue es tuyo, y son dos comandos y una decisión.**

1. **La clave de YouTube** (`T-165`, lo único del ciclo 10 que quedó sin hacer). Enciende
   el escalonamiento real de `US-02` **y** de `US-07` sin tocar una línea de código, y con
   eso se cae la salvedad 1 de arriba:
   `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`
2. **Una casilla de correo** para el botón de corrección (`T-153` del ciclo 9). Prenderla
   es una línea en `src/lib/correccion/destino.ts`. Sin ella nadie queda sin poder
   corregir: la cadena termina en el texto a la vista.
3. **Si querés que `revisor` mire el frente A de verdad** antes de dar la v1 por cerrada
   (`FIND-37`). Es la salvedad 2.

**Y si el próximo ciclo es de crecer y no de cerrar**, lo que está esperando con ficha
escrita es: la tapa entera al revelar (`experiencia` + `arquitectura`), los ids
posicionales `CL-NNN` de `US-03` (`arquitectura`, deuda estructural de `REV-08`), Supabase
(`IDEA-13`) y las once ideas de juego de `PRD-backlog-ideas.md`.

Estado de los pisos, medido el **2026-09-01** contra los JSON del repo:

| Historia | Piso | Hoy | Qué falta |
|---|---|---|---|
| `US-01` Quiz *(por vidas)* | 40 | **40** ✅ | el `h1` de portada tiene diez palabras y la regla topea en ocho (`T-166`) |
| `US-02` Adiviná el tema *(audio)* | 30 | **95** ✅ | 🔴 **el piso está y el criterio no**: 0 Fáciles de los 8 que pide, sin escalonar y sin schema (frente A) |
| `US-03` Completá la letra | 15 | **21** ✅ | — |
| `US-04` Adiviná la tapa | 10 | **10** ✅ | dos explicaciones señalan el título, que el zoom sacó de pantalla (`T-173`) |
| `US-05` Redondopedia | 35 | **35** ✅ | — |
| `US-06` Dos ejes *(fuera de v1)* | — | 28 | — |
| `US-07` Sacalo por la letra *(fuera de v1)* | 60 | **89** ✅ | sin escalonar hasta que corra la clave de YouTube (`D-27`) |

**Contando ítems, la v1 está.** Lo que falta es que `US-02` cumpla `BR-01`, y que una
revisión que no construyó las piezas lo confirme — eso es el ciclo 10 entero.

**Lo que sigue esperándote, y no lo puede hacer ningún rol:**

1. **La clave de YouTube** (`T-165`). Prende el escalonamiento de `US-02` y `US-07` con un
   comando. Es lo que más rinde por minuto en todo el proyecto.
2. **Una casilla de correo** para el botón de corrección (`T-153` del ciclo 9, sin empezar).
   Sin ella el mail no existe y la cadena termina en el texto a la vista: nadie queda sin
   poder corregir, así que no bloquea la v1.
3. **El arte de Momo Sampler** (`momo-medallon`): la pantalla de `US-07` se pinta solo con
   el color. `UX-08` dejó el brief pedido.

> ⚠ **Lo que sigue abajo de esta línea quedó del ciclo 4 y está desactualizado.** Se deja
> por trazabilidad: los pisos que menciona son los viejos (40/20/15/10, hoy 40/30/15/10),
> "desplegar en Vercel" ya está hecho, y la Redondopedia ya cerró su piso de 35. **No
> tomes ninguna instrucción de acá para abajo sin cruzarla con el encabezado.**

### Histórico — el próximo paso tal como se escribió en el ciclo 4

**Correr `/ciclo` para el ciclo 5.** El ciclo 4 cerró entero. Hay **dos juegos jugables**
(el quiz y adivinar la tapa) y las tapas reales visten el sitio.

**Lo que más acerca el "Listo" de la v1, en orden:**

1. **Las letras, que son un solo frente aunque parezcan tres.** `US-03` (completar la
   letra) tiene contrato desde `T-62` (`CTR-04`), las 10 preguntas de `letras` cierran el
   piso de 40 de `US-01`, y los 6 artículos `tema` cierran el piso de 35 de `US-05`. Las
   tres cosas esperan el mismo insumo: **versos**. `RES-45` evaluó la fuente que trajiste
   (redondossubtitulados) y `BR-12` ya fijó que un artículo `tema` lleva versos citados y
   análisis, no la letra entera. Falta que alguien vaya a buscar el material.
2. **`US-02` (adivinar el tema) sigue esperándote a vos.** `CTR-03` pide `origen` y
   `fechaCorte` por ítem, y esos campos salen de recortar los mp3. Ningún rol puede
   inventarlos.
3. **Desplegar en Vercel.** Nada lo bloquea desde `D-14` y `D-15`, y ahora el sitio tiene
   algo que mostrar.

**Lo que el ciclo 4 dejó afuera a propósito, y conviene que el 5 decida:** la sección 2 de
`UX-05` — las **siete superficies del quiz** que el catálogo viste con tapas (fondo en la
presentación y en el resultado, detalle por categoría, y el sello de esquina para el
crédito en una isla que no tiene pie). El plan del ciclo 4 nunca las cubrió: sus tareas de
aplicación eran el portal, las pantallas en la cocina y la Redondopedia. No es un olvido
ahora, es una tarea del ciclo 5 — o una fila que `experiencia` retira del catálogo.

**Rangos:** el ciclo 4 consumió `T-44`..`T-63`, `D-21`, `RES-44`..`RES-46`, `CTR-04`,
`CTR-05`, `BR-12`, `CNT-06`, `UX-05`, `REV-05`.

> ⚠ **Ojo con `D-22`: lo tomó la otra sesión, no este ciclo.** Esta línea decía que estaba
> libre y para cuando el ciclo 5 arrancó ya estaba escrito — es exactamente el choque de
> numeración que `Docs/IDS.md` avisa que pasa cuando dos sesiones escriben el mismo repo, y
> pasó igual. **`D-22` es "los temas enteros se alojan en el sitio, en mp3"**, y no es un
> detalle: saca "alojar los temas completos" de Fuera de alcance, baja a Spotify de promesa
> a extra, y mete un problema nuevo que es el peso (unas 7,2 horas de audio, entre 300 MB y
> 1 GB según bitrate). Su propia consecuencia 4 dice que **los límites de Vercel para ese
> volumen no están fichados y conviene chequearlos antes y no después** — o sea que hace
> falta un `RES-XX` antes de subir el primer mp3.

Consumido por el ciclo 5 hasta ahora: `T-64`..`T-68`, `T-70`, `T-71`, `T-76`, `T-77`, `T-81`,
`RES-47`, `RES-48`, `BR-14`, `BR-15`, `CNT-07`. Libres: `T-82`+, `D-23`+, `RES-49`,
`CNT-08`+, `REV-06`+, `UX-06`+, `BR-16`+.
**Actualización 2026-08-22:** `D-22` ya está tomado (los mp3 enteros) — el próximo libre es
**`D-23`**. También se consumieron `BR-15`/`BR-16` e `IDEA-01`..`IDEA-10` (backlog de
ideas), y el ciclo 5 tiene reservados `BR-13`/`BR-14` para `T-66`/`T-67`.

> 🆕 **La Redondopedia ya está construida y navegable con 26 de los 35 artículos del piso**
> (sesión 2026-08-21 — ver bitácora). El sitio entero tiene esqueleto: portal collage en
> `/`, el quiz mudado a `/quiz/` (los links de desafío viejos redirigen solos), tres
> pantallas "en la cocina" para los juegos que faltan, y `/redondopedia/` con portada e
> índice por tipo. Lo que falta para el piso de `US-05`: los 6 `tema` (esperan la carga de
> letras con el filtro de `D-13`) y Bulacio y Olavarría (esperan la relectura de `CNT-04`,
> `BR-10` — por eso `hito` está en 5/7). De las tres dependencias del PRD, el hilo
> principal dejó **versiones v0 andando** y una propuesta por rol en `Docs/SUGERENCIAS/`:
> el contrato de colección con rótulo por afirmación vive en `src/lib/redondopedia.ts` +
> `src/data/redondopedia.json` (formalizar: `arquitectura`), el patrón de lectura y el
> rótulo visual en prosa viven en `src/styles/sitio.css` (bendecir: `experiencia`), y el
> chequeo del grafo de `BR-09` corre como test (`npm test`, sin huérfanos ni callejones).

Tres frentes, y el primero es el que más acerca el "Listo":

1. **Los otros tres juegos no tienen un solo ítem.** `US-02` (adivinar el tema) tiene
   contrato (`CTR-03`) pero necesita que **vos recortes los primeros mp3** — `origen` y
   `fechaCorte` no son inventables. `US-03` (completar la letra) tiene fuente desde `D-13`
   pero le falta el schema `CTR-04`. `US-04` (adivinar la tapa) necesita `CTR-05` y las
   imágenes.
2. **`letras` sigue en 0/10** y son las 10 que faltan para el piso de 40 de `US-01`.
3. **Desplegar.** No hay nada que lo bloquee: `D-14` sacó el gate y `D-15` eligió Vercel
   con salida estática. Conectar el repo y listo.

**Hay un brand system en curso en otra sesión.** Cuando aterrice, reemplaza los valores de
`src/styles/tokens.css` y **no hace falta tocar `src/styles/juego.css`**: ese archivo no
tiene un solo color literal, todo sale de variables. Ojo con una cosa: hay un test que
exige **WCAG AA en 12 pares de color**, así que cualquier paleta nueva tiene que pasarlo.

Lo que sigue después, por orden de valor:

1. **Actuar sobre `REV-01`.** `revisor` encontró que `CNT-01` está **desactualizada
   respecto de investigación que ya existe**: 4 de las 11 preguntas de derechos tienen
   respuesta en `RES-06` y `RES-09`, y la nota las trata como si siguieran en cero
   (`FIND-01` a `FIND-04`). Se arregla leyendo, sin investigar nada. Dueño: `contenido`.
2. ~~**La decisión de alcance de `producto`** sobre el piso de `US-01`.~~ **YA NO HACE
   FALTA.** Partía de que no había fuente de letras; el usuario decidió las fuentes y el
   piso de 40 vuelve a ser alcanzable. Ver el bloque ✅ del encabezado. Lo que sí queda para
   `contenido` es **cargar los versos aplicando el filtro de los 105 temas de `RES-20`**.
3. **⚠ `ADR-01` cambió de eje y conviene mirarlo antes de escribir integración.**
   `RES-26` encontró que la **Spotify Developer Policy III.2 dice textualmente *"Do not
   create a game, including trivia quizzes."*** Verificado en dos fetches independientes.
   Eso **compromete la opción A (embed)** por contrato, no por dificultad técnica, y
   **vuelve irrelevante `E-04`**: aunque la prueba diera que el embed reproduce el tema
   entero sin Premium, seguiría prohibido. **Podés sacar esa prueba de tu lista.**
   La opción B (deep link) probablemente sobrevive —`RES-09` verificó que el catálogo está
   en Spotify oficialmente desde 2017— pero **falta responder una sola pregunta: si un deep
   link simple cuenta como "acceder a la Spotify Platform"**. Esa pregunta reemplaza a
   `E-04`. Propuesta para `arquitectura` y `producto` en
   `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md`.
   La prueba de `E-07` que sí sigue teniendo sentido: abrir un deep link desde el celular
   sin Premium y anotar si suena a demanda o entra en shuffle.

**Cerrado del ciclo 1:** las 14 tareas, `T-01` a `T-14`, más los seis hallazgos de
`REV-01` y los dos de `REV-02`. Nada quedó abierto de ese ciclo.

Si querés avanzar por otro lado en vez de seguir el plan, hay **tres frentes que no se
bloquean entre sí**:

1. **`investigador`** — quedan las dos preguntas de `ADR-01` (`E-04`: qué reproduce el
   embed de Spotify para alguien sin Premium; `E-07`: si un usuario free en Argentina puede
   escuchar un tema a demanda). **Los tracklists ya no están pendientes** (`RES-20`: los
   diez discos, 105 temas), ni las referencias de Rocambole (`RES-06`), y 4 de las 11
   preguntas de derechos quedaron respondidas entera o parcialmente (`RES-06`, `RES-09`).
   **La fuente de letras también quedó decidida** (ver el bloque ✅ del encabezado): ya no
   es un pendiente de investigación sino de carga.
2. **`contenido`** — es, por lejos, el rol con más material sin usar: schema (`CTR-02`),
   tono (`CNT-02`), discografía (`RES-02`), **cronología (`RES-05`), mitología rotulada
   (`RES-08`), tracklists con autoría (`RES-20`)** y las memorias del Indio en PDF
   (`RES-21`). Tres preguntas ya vienen casi servidas: "Ji ji ji" y su leyenda desmentida
   por el autor (`RES-08`), la letra impresa en el sobre de *Oktubre* de un tema que no
   está en el disco (`RES-22`), y los dos únicos temas con un tercer autor (`RES-20`).
   Antes del primer lote tiene que fijar el límite editorial sobre Bulacio y Olavarría
   (`RES-07`) — y ojo que el capítulo 14 del memoir se llama "Walter David Bulacio".
3. **Vos** — dos cosas, las dos cortas:
   - Ya podés recortar audio siguiendo `CTR-01` (`Docs/ARQ/ARQ-fragmento-audio.md`,
     secciones `CTR-01.6` y `CTR-01.7`). **No te saltees guardar el máster en WAV fuera
     del repo:** es lo único que hace barato bajar la duración si la nota de derechos lo
     pide.
   - **Podés desbloquear `ADR-01` vos mismo en cinco minutos.** `E-04` pregunta qué
     reproduce el embed de Spotify para alguien sin Premium, y no aparece en ninguna
     fuente primaria. Como tenés Premium, la prueba es directa: abrí
     `https://open.spotify.com/embed/track/<trackId>` de cualquier tema en una ventana de
     incógnito (sin sesión) y después con tu sesión iniciada, y anotá si suena el tema
     entero o se corta a los 30 segundos. `ADR-01` ya dejó dicho que eso vale como
     **observación fechada del proyecto**, un escalón por debajo de una fuente y rotulada
     como tal.

## Tablero

| Ítem | Rol | Estado | Nota |
|---|---|---|---|
| Historias, pisos de ítems y reglas de negocio de los 4 juegos | `producto` | hecho | `US-01`..`US-04`, `BR-01`..`BR-03` en `Docs/PRODUCTO/PRD-alcance-v1.md`. Pisos: **40 / 30 / 15 / 10** — el de `US-02` subió de 20 a 30 en `T-99` (ciclo 7) |
| `T-01` — `BR-04`: opciones por pregunta | `producto` | hecho | **4 opciones**, mismo número para `US-01` y `US-04`. Fundamento: con 3 el azar sube a 33% y vacía "premiar al que sabe"; con 5 cede "jugable con el pulgar". `CTR-02.5` pasa de valor de trabajo a **confirmado** sin editar `Docs/ARQ/` |
| `ADR-01` — vía de integración con Spotify | `arquitectura` | **en curso** | `Docs/ARQ/ARQ-spotify-integracion.md`, revisión 2. **C y D descartadas con evidencia** (`RES-01`). Quedan A (embed) contra B (deep link), y solo faltan `E-04` y `E-07`. **El fallback ya está cerrado**, así que no frena a nadie |
| `CTR-01` — fragmento de audio | `arquitectura` | hecho | MP3 mono 44,1 kHz 96 kbps, máx **10,0 s — cerrado por `CNT-01`, ya no es valor de trabajo** (`T-09` + `T-10`). Escalera del reveal **0,1 / 0,5 / 2,0 / 5,0 / 10,0 s**; precarga recalculada a **5,3 MB**. Crédito (tema/disco/año) ahora es campo **obligatorio**: publicar audio sin firmar no valida. `BR-02` sobrevive sin cambios |
| `T-02` — `BR-05`: cortes de los tramos de resultado | `producto` | hecho | **30% y 70%**. El corte de abajo se separó a propósito del 25% del azar, para que "medio" no se llene de respuestas tiradas al voleo. Los 9 resultados posibles de una ronda de 8 caen 3 en cada tramo |
| `T-03` — `BR-06`: qué promete la v1 sobre Spotify | `producto` | hecho | `Docs/PRODUCTO/PRD-promesa-spotify.md`. Promete **acceso** al tema, no reproducción íntegra. Redactada para que ningún desenlace de `E-04` ni `E-07` obligue a reescribirla. **El brief ya fue corregido** |
| `T-04` — schema corrible del quiz | `arquitectura` | hecho | `src/data/_schema/quiz.schema.json`. **Verificado por el hilo principal contra 8 casos** (`D-12`): rechaza ítem sin fuente, leyenda sin rótulo, 3 o 5 opciones, fuente con formato inválido, y ninguna opción correcta |
| `CNT-03` — criterios sobre las discrepancias | `contenido` | hecho | `Docs/CONTENIDO/CNT-03-criterios-discografia.md`. Vedó el sello de *Luzbelito* y el conteo pelado de álbumes. **Ojo: `RES-20` resolvió lo de *Luzbelito* después — el veto se puede levantar** |
| `RES-10` — Spotify free a demanda en Argentina | `investigador` | hecho | `Docs/INVESTIGACION/INV-03-spotify-free-argentina.md`. **Sí se puede elegir tema desde sep-2025, pero con cupo diario no divulgado.** Sin confirmación por país ni para el reproductor web |
| `CTR-02` — schema del banco del quiz | `arquitectura` | hecho | `Docs/ARQ/ARQ-schema-quiz.md`. **Desbloquea a `contenido`.** Convierte dos criterios blandos en validaciones de máquina (ver abajo) |
| `ADR-02` — formato del link de resultado compartido | `arquitectura` | hecho | `Docs/ARQ/ARQ-link-resultado-compartido.md`. **Ojo `UX-02`:** la vista previa del tuit no puede llevar el puntaje |
| `CTR-03`..`CTR-05` — schemas de `US-02`, `US-03`, `US-04` | `arquitectura` | pendiente | No se escribieron a medias a propósito. `US-01` es P0 y era lo que desbloqueaba |
| `RES-01` — estado real de las APIs de Spotify | `investigador` | hecho | `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`. `preview_url` restringido desde el 27-nov-2024; el SDK exige Premium |
| `RES-02` — discografía de estudio | `investigador` | hecho | Nueve álbumes con año y sello, cruzados en tres fuentes. **Trae tres discrepancias sin promediar** — leerlas antes de escribir preguntas |
| `RES-03` — marco de derechos en Argentina | `investigador` | hecho | No hay *fair use* en Argentina; el derecho de cita topea en **8 compases** de música y 1000 palabras de texto (Art. 10, Ley 11.723) |
| Referencias visuales de Rocambole | `investigador` | **hecho** | `RES-06` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. Técnica, íconos, origen de cada tapa y su postura sobre uso libre. **Levanta el bloqueo de `UX-04`** |
| `RES-04` — muerte del Indio Solari | `investigador` | hecho | **Murió el 5-jun-2026.** Dos fuentes independientes. Nadie lo había registrado. Ver la alerta arriba |
| `RES-05` — cronología verificada de la banda | `investigador` | hecho | Formación, hitos, recitales grandes, último show y separación. **Corrige el "Huracán en el 89" del BRIEF: fue 93 y 94** |
| `RES-07` — cultura ricotera (misa, aguante, autogestión) | `investigador` | hecho | Insumo de tono y de sistema visual. **Trae un límite editorial a decidir**: Bulacio y Olavarría son muertes reales |
| `RES-08` — mitología ricotera rotulada | `investigador` | hecho | "Ji Ji Ji" y su leyenda **desmentida por el propio Indio en 2007**. Insumo directo de la categoría mitología |
| `RES-09` — titularidad de derechos y catálogo en streaming | `investigador` | hecho | **Erks S.A.** (Indio/Skay/Poli, 1992). Catálogo completo en Spotify desde el 28-jul-2017 vía The Orchard. **Le sirve a `ADR-01`** |
| `RES-20` — tracklists de los 10 discos | `investigador` | **hecho** | `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`. **105 temas** con duración y autoría por tema. **Desbloquea `US-02` y `US-03`.** Resuelve el sello de *Luzbelito*; trae 3 discrepancias nuevas sin promediar |
| `RES-21` — el memoir del Indio como fuente | `investigador` | hecho | PDF del usuario en `Docs/INVESTIGACION/`. Mapa de los 27 capítulos. **El propio libro se declara "apenas mi versión", no verdad unívoca** — usarlo como *testimonio rotulado*, tercera categoría además de hecho y leyenda |
| `RES-22` — correcciones a `INV-02` desde fuente primaria | `investigador` | hecho | **Corrige `RES-05`** (Patricio Rey: el personaje es invento, pero Rocambole dijo que existía y vivía en Salta). Confirma `RES-08`. **Sube 3 tapas de "reportado" a testimonio** y cubre el hueco de *Último bondi* |
| `RES-23` — letras.com como fuente de letras | `investigador` | hecho, **con decisión del usuario encima** | `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md`. La ficha responde la pregunta 9 en negativo: contribución abierta, sin licencia declarada, 149 temas contra los 105 reales. **Pero el usuario decidió usarla igual** (mística de pocas cosas oficiales) con 5 mitigaciones. **No escales esto a bloqueo de alcance sin leer la sección final del archivo** |
| `RES-24` — *Fuimos reyes*: estructura y límite del preview | `investigador` | hecho | El lector web está topeado en **1%**: la sección "Discografía" figura en el índice pero **no carga**. Sí quedó el **mapa completo de los 20 capítulos**. Si el usuario consigue el libro, **abrir primero "Discografía"**: resuelve las tres discrepancias vivas de una |
| `RES-25` — de dónde salen las tapas: 6 vías | `investigador` | hecho | `Docs/INVESTIGACION/INV-22-imagenes-tapas-y-spotify.md`. **Ocho vías descartadas**; solo Cover Art Archive queda como conducto técnico, y **no mejora la posición legal, solo no la empeora**. **bestiarioredondo no tiene tapas** (su unidad es la canción) y no declara licencia. **Ninguna vía resuelve el derecho** |
| ⚠ `RES-26` — Spotify prohíbe los juegos por contrato | `investigador` | **hecho — decisivo** | Developer Policy III.2 textual: *"Do not create a game, including trivia quizzes."* Verificado en dos fetches independientes. **Compromete la opción A de `ADR-01` y anula `E-04`.** Propuesta en `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md` |
| `CNT-01` — nota de derechos | `contenido` | **esbozo, al día** | `Docs/CONTENIDO/CNT-01-nota-derechos.md`. Duración cerrada en 10 s (`T-09`) y los seis hallazgos de `REV-01` incorporados: ya refleja `RES-06` y `RES-09`, y **"obra registrada" bajó de `[x]` a supuesto heredado** (`FIND-05`). **El gate de `D-07` sigue cerrado**: faltan las 8 preguntas legales de fondo, que ninguna ficha responde todavía |
| `CNT-02` — guía de tono | `contenido` | hecho | Regla central: la jerga va en el tono, nunca en la barrera. Cuatro pares bien/mal |
| Primer lote de preguntas del quiz | `contenido` | **hecho** | `src/data/quiz.json`, **15 preguntas** `QZ-001`..`QZ-015` (10 `discos` + 5 `mitologia`). **Validado por el hilo principal: `OK 15 items, sin fuente: 0`**, 6 fáciles / 6 medias / 3 difíciles. Faltan 25 para el piso de `US-01` |
| `REV-01` — revisión de la nota de derechos | `revisor` | hecho | `Docs/REVISIONES/REV-01-nota-derechos.md`. `FIND-01`..`FIND-06`. **Veredicto: el gate sigue cerrado**, pero no porque la nota mienta — porque está desactualizada respecto de `RES-06` y `RES-09` |
| `REV-02` — revisión del lote del quiz | `revisor` | hecho | `Docs/REVISIONES/REV-02-lote-quiz.md`. `FIND-10` (bloqueante) y `FIND-11`. **14 de 15 preguntas bien citadas.** `FIND-10` se resolvió con `RES-20`, que llegó durante la revisión: la respuesta era correcta, faltaba la cita que la hace única |
| Corrección de `FIND-10` y `FIND-11` | `contenido` | hecho | `QZ-005` cita `RES-02` + `RES-20`; `QZ-001` y `QZ-006` pasaron a `media`; `QZ-011` y `QZ-012` sumaron pista real. **Revalidado por el hilo principal: `OK 15 items, sin fuente: 0`**, máximo de enunciado 163/180. Ambos hallazgos cerrados |
| `UX-01`..`UX-04` — flujo del quiz, tarjeta compartible, reveal sin auriculares, sistema visual | `experiencia` | hecho | En `Docs/UX/`. Citan los IDs reales de `producto`, no supuestos |
| Plan del ciclo 1 | `orquestador` | hecho | `Docs/ORQ/ORQ-plan-ciclo-1.md`. 14 tareas, pasada de conflictos escrita, reservas de ID por la sesión paralela |
| Primera revisión de coherencia | `revisor` | pendiente | `T-11` y `T-12` del ciclo 1. Ya hay siete entregables para revisar |
| Reserva de rangos de ID entre sesiones | hilo principal | hecho | `Docs/IDS.md`, sección "Reserva de rangos". **Cierra `T-14` antes de que arranque el ciclo** |
| `US-05` + `BR-07`..`BR-11` — la Redondopedia | `producto` | hecho | `Docs/PRODUCTO/PRD-redondopedia.md`, consume `D-20`. Seis tipos de artículo, piso **35**, navegación sin huérfanos verificable (`BR-09`), rotulado granular en prosa (`BR-08`), Bulacio y Olavarría como artículos propios con contingencia (`BR-10`), orden de recorte interno (`BR-11`). Tres dependencias señaladas: `arquitectura`, `experiencia`, `contenido` |
| Esqueleto del sitio: portal, rutas y collage | hilo principal | **hecho** | Portal en `/` (lado A juegos, lado B lectura), quiz en `/quiz/` con redirección de desafíos viejos, 3 pantallas "en la cocina", `Base.astro`, `sitio.css` sin un hex, recortes reemplazables en `public/arte/` con despiece fundado en `RES-06`/`RES-22` (README de esa carpeta). Tokens nuevos `--papel` y `--textura-grano` — **deuda: aterrizarlos en el lienzo, hoja 07** |
| Redondopedia v1 — primera tanda cargada | hilo principal | **hecho, 26/35** | `src/data/redondopedia.json`: 10 `disco` + 5 `persona` + 5 `hito` + 4 `concepto` + 2 `leyenda`, desde las fichas `RES-` vía redacción + verificación adversarial (21 hallazgos, 5 bloqueantes, todos corregidos — el patrón repetido: inflar "Patricio Rey Discos" a "sello propio de la banda" sin ficha). `BR-08` como segmentos con rótulo+fuente; `BR-09` como test. Faltan 6 `tema` (`D-13`) y Bulacio/Olavarría (`CNT-04`) |
| Tapas reales bajadas y en las fichas de disco | hilo principal | hecho | 35 imágenes de Coveralia (frontal/trasera/CD/interior según disponibilidad) en `Docs/INVESTIGACION/TapasDiscos/`; bajas de 320 px en `public/tapas/` (`node scripts/generar-tapas.mjs`) — solo en artículos `disco`, con crédito a Rocambole (`BR-07`, `D-04`, `UX-04`) |

> ⚠ **Este Tablero es histórico y algunas filas quedaron viejas.** Las conocidas al
> 2026-08-25: la Redondopedia dice 26/35 y **cerró en 35/35**; `CTR-03`..`CTR-05` figuran
> pendientes y **están escritos**; `ADR-01` figura en curso y `RES-51` lo cerró en
> negativo. **Para el estado real de los pisos, mirá la tabla de "Próximo paso".**

Estados posibles: `pendiente` · `en curso` · `bloqueado` · `hecho` · `cancelado`

## Ideas guardadas — no se hacen ahora

> Pedidos del usuario registrados a propósito **fuera** del ciclo en curso. No son
> bloqueos ni tareas: son cosas que van a pasar, todavía sin fecha. Las dos primeras siguen
> sin ID, con su propuesta en `Docs/SUGERENCIAS/`; las diez ideas de juegos del 2026-08-22
> ya tienen ID propio — ver abajo.

| Idea | Origen | Dueños cuando se tome | Puntero |
|---|---|---|---|
| **Que el sitio intente hablar como el Indio.** Analizar a fondo letras, entrevistas y demás archivo para destilar una guía de voz por encima de `CNT-02` y `D-17`. El usuario la marcó como idea futura, con esas palabras | usuario, 2026-08-21 | `investigador` junta el corpus (única puerta a la web), `contenido` destila la guía | `Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md` |
| **Las bandas ricoteras de después de la separación entran a la Redondopedia.** El usuario nombró tres: *La Kermesse Redonda*, *Indio y los Fundamentalistas del Aire Acondicionado* y *Skay y los Fakires*. **Que entran no está en discusión**; falta ficha que verifique los nombres y decisión de `producto` sobre tipo y piso | usuario, 2026-08-21 | `investigador` (ficha), `producto` (tipo + piso), `contenido` (escribe) | `Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md` |

### Las ideas de juegos guardadas — `IDEA-01`..`IDEA-11`

El usuario tiró diez ideas de una y pidió **guardarlas todas sin empezar ninguna**. Esas
diez están en `Docs/PRODUCTO/PRD-backlog-ideas.md`, cada una con su ancla ricotera verificada contra
los 105 temas de `RES-20` y con el choque que tiene contra lo ya decidido.

| ID | Idea | Tipo |
|---|---|---|
| `IDEA-01` | Separar los temas en pistas y adivinar | original (probable modo de `US-02`) |
| `IDEA-02` | Doom gore — *Masacre en el puticlub* | clon vestido |
| `IDEA-03` | Crazy Toxi-Taxi | clon vestido |
| `IDEA-04` | Plataformas: colgarse del último bondi, con *Gualicho* de fondo | clon vestido |
| `IDEA-05` | Dibujá tu bandera y colgala | original |
| `IDEA-06` | Zoológico de los personajes | original (probable tipo nuevo de `US-05`) |
| `IDEA-07` | Un Pacman en el Savoy | clon vestido |
| `IDEA-08` | Letras y acordes | original, no es juego |
| `IDEA-09` | Test de dos ejes: qué tipo de ricotero sos | original |
| `IDEA-10` | Guitar Hero ricotero | clon vestido |
| `IDEA-11` | Mayor o menor: qué palabra se dice más en el cancionero | original (género conocido, motor mínimo) |
| `IDEA-13` | Supabase: correcciones, puntajes, jugadores | infraestructura, no es juego |
| `IDEA-14` | Skayboy y Poligirl: dos personajes, una puerta, cielo e infierno | clon vestido — **relevada a fondo el 2026-09-11**, ver el bloque del principio de este archivo |
| `IDEA-15` | Los recitales en pantalla | original — **hecha el 2026-10-15** ("En vivo", `D-72`) |
| `IDEA-16` | Armá tu propio recital, con los recortes | original — **hecha el 2026-10-15** (`D-72`) |

Dos reglas nuevas salieron de ahí: **`BR-15`** (los clones se adoptan vestidos, no se
escriben — instrucción transversal del usuario) y **`BR-16`** (una idea no entra a un ciclo
sin promoverse antes a `US-XX`). Prefijo `IDEA-` registrado en `Docs/IDS.md`.

> **Al día el 2026-10-15 (`D-72`).** Lo que de esta tabla ya está en el sitio: `IDEA-08` (Letras y
> acordes), `IDEA-09` (`US-06`, ¿Qué tipo de ricotero sos?), `IDEA-11` (`US-10`, Más o menos), `IDEA-14`
> (`US-09`, Skayboy y Poligirl), `IDEA-15` (los recitales en pantalla, "En vivo") e `IDEA-16` ("Armá tu
> recital"). Las dos ideas sin ID de más arriba también: la voz del Indio es `.claude/rules/voz-ricotera.md`
> y las tres bandas de después de la separación tienen su artículo en la Redondopedia. Siguen sin empezar
> `IDEA-01` a `IDEA-07`, `IDEA-10` e `IDEA-13`.

**Nada de esto es alcance de la v1 y nada de esto está empezado.** Tres preguntas quedaron
abiertas al usuario, listadas al final del PRD: qué es "el gordo Pier" (no figura en los
105), qué es "la tumba del Indio" de `IDEA-05`, y cuál de las tres salidas de audio quiere
para `IDEA-10`.

**`IDEA-11` llegó después, el 2026-08-23**, y todavía **no está pegada en el PRD**: la
carpeta es de `producto`, así que la ficha entera quedó como propuesta en
`Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md`, con el número ya reservado
en `Docs/IDS.md`. El usuario pidió textual *"no hay que desarrollarlo ahora, agregalo como
idea"*. Es de las dos más baratas del backlog —el corpus ya está en el repo desde el ciclo
6— y no toca `BR-03` ni `BR-12` porque muestra palabras sueltas, no versos. **Su único
choque es serio y está medido:** el conteo es la respuesta correcta, y hoy el cancionero
trae anotación de cifra adentro de líneas tipadas como letra, así que la palabra más
cantada de los Redondos da `riff` (306). Sin limpiar eso, el juego le marca error al que
se sabe el tema.

**`IDEA-04` recibió su meta el 2026-08-23** y tampoco está pegada todavía en el PRD:
ficha actualizada en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`.
El usuario pidió "un mario de plataformas simple pero que hay que llegar a tomar el último
bondi a Finisterre" — **no es un juego nuevo, es `IDEA-04` con lo que le faltaba**, así que
no se abrió ID nuevo. La meta **cierra el choque principal que la ficha tenía escrito**: el
que corta el nivel es el bondi que arranca, no un límite puesto de afuera, y de paso empuja
los controles hacia un solo botón. Sigue abierto lo caro: motor 2D con licencia (`BR-15`) y
el skin, que en un plataformas es el más caro de los cinco clones.

**Y el 2026-08-24 el usuario le puso tema: *Gualicho*** (pista 4 del mismo disco), donde el
bondi a Finisterre está cantado y donde alguien se **cuelga** de él — que es el verbo del
juego. Con eso `IDEA-04` es **la única de las cinco ideas de clon con su música decidida**, y
con `D-22` el archivo existe. **Al ir a buscar el verso apareció un agujero:** la letra de
*Gualicho* no está en el repo —cero líneas cantadas, tres líneas de cifrado tipadas como
letra— y en el mismo disco *Pogo* está igual y *El árbol del gran bonete* casi. Los tres son
de cifraclub. Es la misma deuda que bloquea `IDEA-11` y que `US-03` ya paga con sus 226
versos en borrador.


## Bloqueos abiertos

- **`ADR-01` espera evidencia, no trabajo.** Solo `E-04` y `E-07`; `E-02`, `E-03` y `E-08`
  quedaron **anuladas** (no pendientes) al descartarse la opción C. No frena construir: el
  fallback está cerrado y `US-02` criterio 3 queda cubierto igual.
  ~~**`E-07` es ahora la pregunta que más pesa:** con C y D descartadas, el deep link es el
  único camino que queda al tema completo, así que si un usuario free en Argentina no
  puede reproducir a demanda, **ninguna vía cumple la promesa del brief**.~~
  ✅ **LEVANTADO por `D-22` (2026-08-22): el sitio aloja los temas enteros en mp3.** El deep
  link dejó de ser el único camino al tema completo, así que `E-07` y `E-04` dejan de decidir
  si la promesa se cumple. **En su lugar quedan tres preguntas nuevas, y son de peso y de
  infraestructura, no de Spotify:** dónde viven ~7,2 horas de audio (entre 300 MB y 1 GB
  según bitrate), si van adentro del repo que Vercel construye, y cuáles son los límites de
  Vercel para ese volumen — lo último **sin ficha**, y es lo único que conviene chequear
  antes de subir el primer archivo. Detalle en `D-22` y en
  `Docs/SUGERENCIAS/HILO-para-arquitectura-audio-alojado.md`.
- **`CNT-01` no puede pasar de esbozo a cerrable** hasta que `investigador` responda las
  11 preguntas de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`. **Esto es lo que
  bloquea publicar** (`D-07`). No bloquea nada más.
- **`CTR-01.3` tiene un número abierto:** la duración máxima del fragmento, 15 s como
  valor de trabajo, la confirma la nota de derechos. Dato nuevo de `RES-03`: el techo del
  derecho de cita musical son 8 compases, que a 120 BPM en 4/4 son unos 16 s — el valor
  técnico y el límite legal quedaron cerca por caminos independientes.
- ~~**`UX-04` no tiene referencias reales de Rocambole fichadas.**~~ **LEVANTADO** por
  `RES-06`: técnica (rodillo, serigrafía, aerografía, grabado, collage), origen de cada
  tapa, y la frase que ordena el criterio — *"yo no ilustraba la poesía o la música, sino
  que era una parte integrante del mensaje"*. `experiencia` puede cerrar el brief de arte.
- ~~**No hay tracklists por disco.**~~ **LEVANTADO** por `RES-20`
  (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`): **los diez discos, 105 temas**, con
  duraciones y autoría por tema. `US-02` (piso 20) y `US-03` (piso 15) tienen de sobra.
- **Sigue abierto, y ahora con las dos vías fáciles descartadas: el texto de las letras
  para `US-03`.** El PDF del memoir no sirve (cita versos sueltos dentro de la
  conversación), y **`RES-23` descartó letras.com**: es de contribución abierta, sin
  licencia declarada — o sea, exactamente la "fuente de fans sin respaldo" que `contenido`
  pidió evitar en su pregunta 9. Además lista **149 temas contra los 105 reales**, mezclando
  material del Indio solista y de Skay. **La fuente correcta es el arte de los discos**, y
  el volumen es chico: `BR-03` muestra 2/1/0 versos, así que el piso de `US-03` necesita
  del orden de 30 versos, no 15 letras enteras. Techo legal sin cambios (`RES-03`).
- **Filtro obligatorio para `US-02` y `US-03`:** todo tema que entre tiene que estar en los
  **105 de `RES-20`**. Si no está, no es de Patricio Rey.

## Decisiones pendientes

> **Limpiado el 2026-09-01 (`T-175`).** Esta sección tenía trece entradas y **siete ya
> estaban resueltas**, algunas hacía dos semanas — con la de "cerrá esto antes del primer
> lote" todavía puesta sobre lotes que ya se cargaron enteros. Una lista de pendientes con
> mayoría de resueltos no se lee: se saltea. Las resueltas se van con su resolución
> anotada, en una tabla, para no perder la traza.

### Lo que sigue abierto

- **Cómo contar *Lobo suelto, cordero atado*** (¿9 o 10 discos?). Wikipedia en español le
  da un artículo a cada volumen y a la vez los llama álbum doble. **Sigue siendo trampa** y
  `CNT-03` la veda como pregunta. Dueño: `contenido`.
- **La fecha de *Gulp!* tiene tres versiones** (22-abr / 20-jul / agosto de 1985). El año
  sí es firme. Misma familia que la anterior, mismo dueño.
- **El sello de *Un baión*.** `RES-02` dice Wormo, `RES-20` dice Del Cielito, y `RES-44`
  dice Wormo con reedición en Del Cielito. **Probablemente no sea contradicción sino dos
  ediciones**, y la evidencia cruzada está armada en
  `Docs/SUGERENCIAS/HILO-para-investigador-sello-de-un-baion.md`. Falta la ficha `RES-53`.
  Dueño: `investigador`, que es la única puerta a la web. **No hay nada roto en pantalla**:
  la Redondopedia ya declara la discrepancia de frente.
- **Bajo qué tipo entran las bandas post-separación**, y qué le hace eso al piso de 35 de
  la Redondopedia. `BR-07` tiene seis tipos y ninguno es `banda`. Que entren lo decidió el
  usuario; el cómo, no. Dueño: `producto`.
- **Qué se hace con "Huracán en el 89"** en `Docs/BRIEF.md` y `CLAUDE.md`. En el 89 fue el
  debut en Obras; Huracán fue 93 y 94 (`RES-05`). Como frase retórica no rompe nada; el
  riesgo es que alguien la convierta en pregunta. Dueño: vos, porque son archivos de raíz.
- **`ADR-01`, vía primaria de Spotify.** Formalmente abierto y **materialmente muerto**:
  `RES-26` mostró que la Developer Policy prohíbe los juegos y `D-22` sacó a Spotify del
  camino sirviendo los mp3. Queda para cerrarlo por escrito, no para decidirlo.

### Lo que se resolvió y seguía figurando acá

| Decía | Cómo se resolvió |
|---|---|
| La promesa de "escuchar el tema completo vía Spotify" | **`D-22`**: el sitio sirve los temas enteros en mp3. `BR-06` ya lo había reformulado y `US-02` c3 quedó reescrito hoy (`FIND-35`) |
| Cantidad de opciones por pregunta | **`BR-04`, `T-01` del ciclo 1**: cuatro. Cerrado antes del primer lote, como pedía |
| Cortes de puntaje de los tres tramos | **`BR-05`, `T-02`**: 30% y 70% |
| El sello de *Luzbelito* | **`RES-20`**: Del Cielito, cuarta fuente coincidente |
| Cierre de la nota de derechos antes de publicar | **`D-14`** sacó el cerrojo. `CNT-01` sigue existiendo pero **como mapa, no como gate** |
| Límite editorial sobre Bulacio y Olavarría | **`CNT-04`** y **`CNT-06`**. Y `QZ-025` se reformuló hoy (`T-169`) porque se acertaba con civismo |
| Si el sitio menciona que el Indio murió, y dónde | **`CNT-06`** y la Redondopedia, en registro 3 |

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 2026-08-19 | Proyecto instanciado. Roster de 7 roles, ampliación justificada en `Docs/EQUIPO.md`. |
| 2026-08-19 | `/kickoff`: entrevista de 16 preguntas. `Docs/BRIEF.md` reescrito entero, `D-05`..`D-10` registradas. Confirmados los 4 juegos y el tono; **corregidos** tres supuestos: el usuario no tiene material de audio propio (`D-06`), sí hay difusión por Twitter (`D-10`), y el gate de derechos se partió en construir contra publicar (`D-07`). |
| 2026-08-19 | `producto` fijó `US-01`..`US-04`, `BR-01`..`BR-03` y los pisos 40/20/15/10. |
| 2026-08-19 | `experiencia` entregó `UX-01`..`UX-04`. La tarjeta compartible pasó a pieza de primera clase por `D-10`. |
| 2026-08-19 | `contenido` entregó `CNT-01` (nota de derechos, esbozo) y `CNT-02` (guía de tono), y dejó 11 preguntas para `investigador`. |
| 2026-08-19 | `arquitectura` entregó `ADR-01` (propuesta, con el fallback ya cerrado), `CTR-01`, `CTR-02` y `ADR-02`. |
| 2026-08-19 | `investigador` entregó `RES-01`..`RES-03`. **Dos hallazgos pesados:** `preview_url` está restringido para apps nuevas desde el 27-nov-2024, y los términos de YouTube prohíben descargar, lo que **contradice la premisa con que se tomó `D-06`**. Registrado como actualización de `D-06`; la decisión sigue siendo del usuario y sigue en pie. |
| 2026-08-19 | `ADR-01` revisión 2: incorporó `RES-01` y **descartó las opciones C y D con evidencia**. Quedan embed contra deep link, faltando solo `E-04` y `E-07`. |
| 2026-08-19 | `CLAUDE.md` mandaba correr `scripts/validar_instancia.py`, que no existe en este repo. Corregido a la ruta real del instanciador y registrado como `D-11`. Validación: **APTA**, 0 errores, 1 aviso esperado (7 roles). |
| 2026-08-19 | Chequeo de coherencia de IDs: **sin referencias colgadas**. Los únicos IDs citados y no definidos son los ejemplos de `Docs/IDS.md` y `CTR-03`, que es referencia hacia adelante marcada pendiente. |
| 2026-08-19 | `/ciclo`: `orquestador` cortó el **ciclo 1** en 14 tareas (`Docs/ORQ/ORQ-plan-ciclo-1.md`), con la pasada de conflictos escrita y no mental. Meta del ciclo: 15 de las 40 preguntas del piso de `US-01`. Encontró de paso un hueco de propiedad: **`src/data/_schema/` no tiene dueño declarado**, y sin ese archivo la validación del banco no es corrible — resuelto como `T-04`. |
| 2026-08-19 | Arrancó una **segunda sesión en paralelo** sobre hechos de la banda. Se reservaron rangos de ID en `Docs/IDS.md` para que dos sesiones que no se ven no escriban el mismo número: `RES-04`..`RES-09` para la sesión paralela, `RES-10`+ para esta. Cierra `T-14` antes de que el ciclo arranque. |
| 2026-08-19 | **`T-01` cerrada.** `BR-04`: 4 opciones por pregunta, igual para `US-01` y `US-04`. Era el gate interno del ciclo: destrabó `T-04`, `T-06`, `T-07`, `T-08` y `T-12`. `CTR-02.5` queda confirmado sin tocar `Docs/ARQ/`. |
| 2026-08-19 | **Sesión paralela de investigación cerrada.** Barrido amplio sobre la banda pedido por el usuario: `RES-04`..`RES-09` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. Consumió su rango entero sin excederlo. **El hallazgo grande: el Indio Solari murió el 5-jun-2026** y ningún documento del repo lo registraba — alerta y decisiones en `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`. De paso: **levantó el bloqueo de `UX-04`** (`RES-06`), respondió 4 de las 11 preguntas de derechos de `contenido`, y encontró que **el catálogo está en Spotify oficialmente desde el 28-jul-2017**, lo que refuerza el deep link en `ADR-01`. Corrigió además el ejemplo "Huracán en el 89" del BRIEF: fue 1993 y 1994. |
| 2026-08-19 | **Segunda tanda de la sesión de investigación: fuentes primarias.** El usuario consiguió los libros y puso *Recuerdos que mienten un poco* en PDF dentro de `Docs/INVESTIGACION/`. Salieron `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`. **`RES-20` levanta el bloqueo más grande: los tracklists de los diez discos, 105 temas con duración y autoría** — `US-02` y `US-03` ya tienen de dónde sacar ítems, y de paso queda respondida la pregunta 8 de `contenido` (la autoría es Solari–Beilinson salvo dos temas que suman a Bucciarelli). **`RES-22` corrige `RES-05`:** yo había escrito que Patricio Rey nunca existió como persona; el memoir muestra que Rocambole declaró lo contrario y que el Indio no lo desmiente. Se resolvió además el sello de *Luzbelito* (Del Cielito, cuarta fuente). |
| 2026-08-19 | **Ciclo 1 cerrado: las 14 tareas.** `BR-04`/`BR-05`/`BR-06` de `producto`; `CTR-01` con la duración cerrada en 10 s y la escalera recalculada, `CTR-02`, `ADR-02` y el schema corrible de `arquitectura`; `CNT-01` sección A, `CNT-03` y **las primeras 15 preguntas** de `contenido`; `RES-10` de `investigador`; y las dos primeras revisiones del proyecto. Banco validado: `OK 15 items, sin fuente: 0`. |
| 2026-08-19 | **Las dos revisiones encontraron cosas reales, que es el punto.** `REV-01`: la nota de derechos no miente, pero está desactualizada respecto de fichas que ya llegaron (`FIND-01`..`FIND-04`), y afirmaba con casilla marcada que Rocambole tiene "obra registrada" sin ninguna ficha que lo respalde (`FIND-05`) — corregido también en su origen, `D-04`. `REV-02`: `QZ-005` era bloqueante porque su respuesta no era única con la evidencia de entonces (`FIND-10`); **`RES-20` llegó durante la revisión y la resolvió**, así que se arregló agregando la cita, no borrando la pregunta. |
| 2026-08-19 | **`D-12`, la lección estructural del ciclo.** Cuatro de los siete roles no tienen herramienta de ejecución, así que no pueden correr las verificaciones que sus propias tareas exigen. Se decidió **no darles `Bash`** —el que fabrica no se autocertifica— sino **rutear** la verificación al hilo principal o a `revisor`. La evidencia que cerró la discusión llegó el mismo día: `contenido` reforzó dos enunciados, los validó a mano, reportó que estaban bien, y **habían quedado en 242 y 277 caracteres contra un tope de 180**, rompiendo el schema. Corregidos a 155 y 163. |
| 2026-08-19 | Tercera confirmación de que la reserva de rangos funciona: las dos revisiones respetaron `FIND-01`..`FIND-09` y `FIND-10`+ sin colisionar, igual que las fichas `RES-` entre las tres sesiones. |
| 2026-08-19 | **Tercera tanda de investigación: `RES-23` y `RES-24`** en `INV-21-letras-y-fuimos-reyes.md`. Las dos dan resultado negativo o parcial, y el motivo es de la fuente. **`RES-23` descarta letras.com** como fuente de letras: es de contribución abierta y sin licencia declarada —la "fuente de fans sin respaldo" que `contenido` pidió evitar— y además lista **149 temas contra los 105 reales**, mezclando material del Indio solista y de Skay. La pregunta 9 queda **respondida en negativo** y la casilla de letras de `CNT-01` sigue abierta. **`RES-24`**: el lector web de *Fuimos reyes* está topeado en **1%** y la sección "Discografía" figura en el índice pero no carga; no se buscó otra vía porque el libro está a la venta. Sí quedó el **mapa de los 20 capítulos**, que dice dónde mirar cuando el libro esté: el cap. 8 puede cerrar la fecha de *Gulp!*, el 4 lo de Patricio Rey, y la sección "Discografía" del final las tres discrepancias vivas de una sola vez. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 2** en `Docs/ORQ/ORQ-plan-ciclo-2.md`, 13 tareas `T-15`..`T-27`. Dos gates en vez de uno: el limite editorial sobre muertes reales (`T-15`) y la categoria **testimonio** en el schema (`T-16`), que corren en paralelo. Meta: llegar a **30 preguntas**, no a 40. |
| 2026-08-19 | **Hallazgo de alcance: el piso de `US-01` ya no se puede cerrar.** Sin fuente de letras (`RES-23`), y con un piso definido como 10 por categoria sobre 40, el techo real es **30/40** por aritmetica. Decision para `producto`: sostener la cuota, bajar el piso, o esperar la fuente. Toca la definicion de "Listo" de la v1, y bloquea `US-03` entero. |
| 2026-08-19 | Segunda leccion de concurrencia, ahora entre **sesiones** y no entre roles: el encabezado de este archivo quedo diciendo "ciclo 1 en curso" cuando su propia bitacora ya registraba el cierre. Se fijo en `Docs/EQUIPO.md` el orden de autoridad — **disco > bitacora > tablero** — y la regla de agregar a la bitacora y reconciliar el tablero, nunca borrar una fila ajena. |
| 2026-08-19 | **El usuario revirtió la conclusión práctica de `RES-23`, y eso desarmó un bloqueo de alcance.** Con la objeción sobre la mesa decidió usar letras.com y **bestiarioredondo** igual, porque *la banda tiene una mística de pocas cosas oficiales* — fundamento que la investigación respalda: no hay sitio oficial de letras, nunca lo hubo, el memoir no las trae (`RES-21`), y la banda se construyó sin multinacional, sin TV y sin publicitar recitales (`RES-07`). **Consecuencia: el aviso de "el piso de `US-01` no se alcanza por aritmética, techo 30/40" quedó sin premisa y se retiró.** No hay que tocar el piso ni la definición de "Listo". El riesgo de verso mal transcripto se acepta acotado con 5 mitigaciones; las dos que importan son cruzar todo contra los 105 temas de `RES-20` (obligatorio, gratis, mata las 149 entradas contaminadas) y confirmar de oído los ~30 versos que `BR-03` realmente necesita. **Falta el `D-XX`**: no lo numeré desde la sesión paralela porque no hay reserva del prefijo `D-`; propuesta en `Docs/SUGERENCIAS/INV-para-hilo-principal-decision-fuentes-letras.md`. |
| 2026-08-19 | **Ciclo 2, doce de trece tareas cerradas.** Los dos gates primero, como pedia el plan: `CNT-04` (`T-15`) fijo el limite editorial sobre muertes reales antes de escribir una sola pregunta de historia, y la categoria **`testimonio`** (`T-16`..`T-18`) entro al schema de forma **aditiva y verificada**: los 25 items previos validan sin tocarlos, y el schema rechaza las ocho formas de llenarla mal que probe. Banco: **30 preguntas**, `discos` 10/10, `mitologia` 10/10, `historia` 10/10, **10 faciles** que cumplen `BR-01`. |
| 2026-08-19 | **Cuatro fichas legales nuevas, `RES-11` a `RES-14`** (`INV-04`, `INV-05`), y dos corrigen cosas que el proyecto daba por buenas. **`RES-11`: el derecho de cita del Art. 10 cubre la obra, no el fonograma** — el Art. 5 bis le da al fonograma derecho aparte, con otro titular y 70 anios, y el proyecto recorta el master. Los "8 compases" regulan otra cosa. **`RES-13`: la baja resolucion no tiene efecto juridico verificado** (la ley dice "en cualquier forma", sin excepcion por calidad), y la declaracion publica de Rocambole no es licencia: el Art. 53 exige formalidad registral. **`FIND-05` tenia razon.** |
| 2026-08-19 | **Dos defectos encontrados por el equipo, no por el hilo principal.** `arquitectura` calculo que `BR-02` x `BR-04` le daba **70 puntos esperados a quien no reconoce nada**, con piso 40, y volvia inalcanzables el paso 5 y la rama de 0 — lo escalo en vez de decidirlo. `producto` lo arreglo con **intento unico por item**: baja a 25 esperados, piso 0, y las dos ramas vuelven a ocurrir. Y `arquitectura` senialo que **`sensibleA` no tiene valor para texto de libro**, asi que una cita del memoir es invisible para el gate de `D-07`: pedido abierto a `contenido`. |
| 2026-08-19 | **Corrida de investigación sobre imágenes de tapas: `RES-25` y `RES-26`** en `INV-22-imagenes-tapas-y-spotify.md`. Seis vías en paralelo con refutación adversarial; 10 agentes, 0 errores. **`RES-25`: ocho vías descartadas.** Solo Cover Art Archive sobrevive como conducto técnico, y **no mejora la posición legal, solo no la empeora** (*"use the images at your own risk"*). La distinción que ordena todo: **contenedor ≠ contenido** — ninguna base de datos puede licenciar arte que no le pertenece, así que sacar la tapa de Discogs o de Spotify **no lava nada**. **bestiarioredondo no aporta tapas**: su unidad es la canción, no el disco, no declara licencia, el propietario del Drive está oculto y **no se pudo descartar generación por IA**. Dos refutaciones útiles: el `life-span` de MusicBrainz contradice `RES-05`, y **la tapa de *Oktubre* del CAA sale de un CD de 1993 en EE.UU., no del LP argentino de 1986**. **`RES-26` es el hallazgo grande y no es sobre imágenes:** la Spotify Developer Policy III.2 dice textualmente *"Do not create a game, including trivia quizzes."* **Compromete la opción A (embed) de `ADR-01` y vuelve irrelevante `E-04`** —aunque la prueba diera bien, seguiría prohibido—; la opción B (deep link) probablemente sobrevive pero no está verificado. Propuesta para `arquitectura` y `producto` en `Docs/SUGERENCIAS/`. |
| 2026-08-19 | **Ciclo 2 cerrado: las 13 tareas, mas los tres hallazgos de `REV-03`.** El bloqueante (`FIND-12`) era transcripcion textual del memoir con etiqueta de parafrasis encima, en `QZ-027` y `QZ-028` — `revisor` lo cazo comparando contra el PDF. Corregido y **reverificado por el hilo principal contra las 194.131 palabras del libro**: el tramo calcado mas largo bajo de **62 a 41 caracteres**, ninguno llega a 9 palabras, y los que quedan son el titulo de una cancion, una marca y una frase generica. Banco final: **30 preguntas**, tres categorias en 10/10, 10 faciles. |
| 2026-08-19 | **`ADR-01` revision 3 — el eje de la decision cambio y no era tecnico.** `RES-26` (sesion paralela, encontrado **de casualidad** buscando imagenes de tapas) trajo la Spotify Developer Policy III.2: *"Do not create a game, including trivia quizzes."* `arquitectura` **descarto la opcion A (embed) por contrato**, anulo `E-04`, `E-05`, `E-06` y `E-10` — el usuario puede tachar la prueba de incognito de su lista — y degrado `E-07` a no bloqueante corrigiendo su propia frase de la revision 2. Queda `E-13`: si un deep link simple cuenta como acceder a la Spotify Platform. **Las Design Guidelines NO aplican a `US-04`**: rigen arte que venga de Spotify, y `D-04` fija otro origen. |
| 2026-08-19 | Autocritica que vale guardar, de `arquitectura`: su tabla de criterio de cierre —escrita **antes** de la evidencia, y que funciono dos veces— no fallo en ninguna fila. Fallo en algo que una tabla no puede cubrir: **solo elige entre las opciones enumeradas, y no protege de que una opcion sea retirada por un eje que nadie habia considerado.** |
| 2026-08-19 | **`D-14` reencuadra el proyecto entero, por decision del usuario y con toda la evidencia legal sobre la mesa.** Tres cosas: **(1)** el riesgo se asume — fan site sin fines de lucro, poco publico, **si llega un reclamo se da de baja y listo**; el gate de publicacion de `D-07` deja de existir y `CNT-01` pasa de cerrojo a **mapa**. **(2)** el conocimiento popular es contenido legitimo: **no hay mucho oficial y no deberia importarnos**, y eso no es una excusa sino un hallazgo (`RES-23`, `RES-21`). **(3)** **abrir los molinetes** — nada se le niega a nadie por no tener con que entrar: ni cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas" del alcance resultaron ser la misma decision y ahora tienen nombre. |
| 2026-08-19 | Lo unico que `D-14` **no** relaja: que la respuesta correcta de una pregunta sea correcta — no por lo legal, sino porque si el dato esta mal **el juego le marca error al que se sabe el tema**. La defensa deja de ser "verificar todo" y pasa a ser **rotular bien**: hecho, leyenda o testimonio. El sistema de tres casillas que el schema ya hace cumplir resulto ser exactamente el mecanismo que esta postura necesitaba — **se construyo para dejar entrar el relato, no para filtrarlo.** Actualizados `CLAUDE.md`, `Docs/BRIEF.md` y `.claude/rules/contenido-json.md`. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 3** en `Docs/ORQ/ORQ-plan-ciclo-3.md`, 16 tareas `T-28`..`T-43`. **El ciclo es construir el quiz.** Despues de dos ciclos estaba todo especificado —30 preguntas validadas, `CTR-02`, `CTR-03`, `UX-01`, `UX-02`, `UX-04`, seis reglas `BR-`— y **no habia una sola linea de codigo**. `D-14` saco el ultimo motivo para esperar. Se formalizo ademas en `Docs/EQUIPO.md` quien escribe el codigo: **el hilo principal**, por la misma razon de `D-12` — los cuatro roles que escriben no pueden ejecutar nada, y no se construye software sin correrlo. |
| 2026-08-19 | **Hallazgo al planificar: el repo no estaba bajo git.** 55 archivos de dos ciclos completos, sin un solo commit ni respaldo. Es `T-28` y va antes que todo. |
| 2026-08-19 | Tres huecos mas que encontro `orquestador` leyendo contra el encuadre nuevo: **`CNT-01` sigue redactada como cerrojo** y contradice al BRIEF (`T-32`); **`UX-01` no dice donde se ve el rotulo** de leyenda o testimonio, asi que 15 de los 30 items llegarian a pantalla con cara de hecho verificado — la ultima milla de todo el sistema de rotulado (`T-30`); y **ocho cadenas de copy** que `UX-01` y `UX-02` delegaron a `contenido` y nadie escribio (`T-29`). |
| 2026-08-19 | **Ciclo 3 cerrado: las 16 tareas `T-28`..`T-43`, mas los siete hallazgos de `REV-04`.** El proyecto paso de cero lineas de codigo a **un quiz jugable**: Astro con salida estatica, cinco reglas de negocio como funciones puras con test, cuatro pantallas, y el repo en **github.com/knesantos/ArcadeRicotero**. 47 tests, `tsc` limpio, build OK. |
| 2026-08-19 | **El defecto que solo aparecio jugando: en 25 de los 30 items la respuesta correcta era la primera opcion.** Tocando siempre arriba se sacaba **83%** sin saber nada — mucho peor que lo que discutio `BR-04`, que eligio 4 opciones en vez de 3 para bajar el azar de 33% a 25%. No lo agarro nadie porque en el JSON cada item se lee bien por separado: el patron solo existe en el conjunto. Arreglado barajando al servir; medido en el navegador, ahora rinde 28%. Y `revisor` encontro despues que **`CTR-02.3` ya lo exigia por escrito** desde el ciclo 1: no fue un parche, fue implementar un requisito que nadie habia ejecutado. |
| 2026-08-19 | **`REV-04`, primera revision de codigo. El riesgo del ciclo no se materializo donde se temia.** `BR-01`, `BR-04`, `BR-05`, `ADR-01` y `ADR-02` coinciden con los documentos numero por numero. Se materializo en tres puntos que **pasaban en apariencia**: el test de contraste medía tokens que la pantalla nunca usaba (`FIND-15`, bloqueante — el juego corria sin senal de acierto, error ni rotulo), el payload mandaba mas de `testimonio` de lo aprobado (`FIND-16`), y una cadena de `CNT-05` se reemplazo por texto inventado (`FIND-17`). Los siete cerrados y verificados. |
| 2026-08-19 | Nota de proceso: **`tsc --noEmit` no se estaba corriendo.** El hilo principal reporto `T-34` como verificada habiendo corrido solo `node --test`. Cuando se corrio (`FIND-19`), encontro que el arreglo de `FIND-16` estaba incompleto — el tipo seguia prometiendo campos que ya no se mandaban. **El comando que no se corria era el que iba a atrapar el arreglo a medias del otro hallazgo.** |
| 2026-08-19 | `D-15`: hosting en **Vercel con salida estatica pura**. El usuario tiene Vercel Pro y Supabase Pro pagas, y aun asi el sitio se disena para el tier gratuito — si la suscripcion desaparece, sigue en linea sin cambiar una linea. **Supabase queda disponible y sin usar**: contradice "sin backend" (`D-02`), su tier gratuito pausa proyectos por inactividad, y sobre todo **una cuenta de usuario es literalmente un molinete**, que es lo unico que `D-14` prohibe por nombre. |
| 2026-08-19 | **`RES-15` (`INV-06`): como asegurar costo cero en Vercel, verificado contra la documentacion oficial.** Corrige una intuicion razonable del usuario: **no alcanza con no activar Speed Insights ni Analytics**, porque lo que decide es **el scope**. En Hobby no hay cargo posible —al agotar un cupo el recurso se frena, no se factura—; en un equipo Pro se cobra el excedente de transferencia y edge requests aunque no se toque ningun add-on. Contraintuitivo: **el tope de gasto (Spend Management) solo existe en Pro**, en Hobby no existe porque no hace falta. **Accion pendiente del usuario:** verificar en Settings -> General a que scope pertenece el proyecto. |
| 2026-08-20 | **Sistema de marca, como lienzo de diez hojas** ("Sistema de marca Arcade Ricotero", https://claude.ai/code/artifact/59acd1de-80ab-4074-b1ba-b75da05cb134). Fija lo que `UX-04` dejó abierto a propósito: paleta con doce pares de contraste calculados (peor: 5,58:1, pasa AA), dos familias tipográficas, diez estenciles originales con textura de serigrafía, y componentes con las clases que `partida.ts` ya escribe. La simbología con respaldo: perro (`RES-06`/`RES-22`), bandera y estrella (`RES-06`, capa simbólica), molinete (`D-14`), la misa (`RES-04`). `Docs/UX/` no se tocó: propuesta en `Docs/SUGERENCIAS/HILO-para-experiencia-sistema-de-marca.md` con las tres diferencias contra `UX-04` (error a rojo, aparece un oro, azul reservado a testimonio). |
| 2026-08-20 | **`D-16`: el producto se llama Arcade Ricotero.** Decisión directa del usuario. Lo visible ya cambió: `<title>` de `index.astro` (verificado en `dist/`, build OK, `tsc` limpio, 47/47 tests). Las ~50 menciones en prosa interna migran sin apuro; el `$id` de los schemas es contrato de `arquitectura` y espera a ese rol. |
| 2026-08-20 | **`D-17`: regla de voz — sin anglicismos, en español, argentino y ricotero.** Decisión directa del usuario, convertida en hoja 02 del sistema de marca: tres obligaciones y glosario (feedback→devolución, reveal→revelado, display→rotulada, quiz→preguntas/trivia). Barrido hecho: el copy visible ya estaba limpio; lo inglés vive en identificadores de código, que se renombran solo si el costo lo justifica. |
| 2026-08-20 | **Pedido del usuario en curso: tipografías reales de los discos y más simbología real.** `investigador` está buscando fuentes hechas por fans sobre el lettering de las tapas (descarga, licencia, qué tapa imitan). Si aparece alguna usable, cambia la hoja 04 del sistema de marca y la decisión estética vuelve a `experiencia` (`D-04`). El rediseño "más oscuro, más rocambolesco" ya entró al lienzo: base `#0D0A07`, viñeta, desregistro de tinta. |
| 2026-08-20 | **`RES-30`..`RES-32` (`INV-07`): la tipografía de las tapas, investigada — y el hallazgo es un "no hay" que vale más que un "sí".** El usuario pidió usar "las fuentes de los Redondos"; `investigador` verificó que **no existe ninguna fuente descargable derivada del lettering real** — lo que circula es un "se parece a" comercial (Big George NF) sugerido por un fan y dos falsos positivos por nombre. Lo verificado de verdad (`RES-31`): Rocambole **dibujó a mano** la letra de *Oktubre*, "sovieticoide" con una B invertida, con oficio de cartelista y sin archivo digital. Consecuencia en el sistema de marca (hoja 04): se imita el **método** (letra de cartelista con borde comido), no la letra; la vía auténtica futura es lettering original encargado. De paso, `RES-31` es pregunta de trivia lista para el juego de tapas (nota para `contenido`). Pendiente manual: los listados de MercadoLibre y el tipoblog de Cátedra Cosgaya bloquearon el acceso automatizado. La hoja 01 sumó además el **detalle real fichado**: los diez discos con año (`RES-02`/`RES-20`) y los hitos Obras 89 / Huracán 93-94 (`RES-05`). |
| 2026-08-20 | **`RES-33`..`RES-35` (`INV-07`, segunda tanda): la letra de cada tapa, nueve corridas en paralelo.** El usuario precisó el pedido: conseguir la tipografía de cada disco. Resultado: **ninguna tapa usa una tipografía comercial confirmada.** Dos verificadas con el método real — *Gulp!* es manuscrito de Rocambole **con un tubito de plasticola relleno de esmalte sintético**, serigrafiado en tres pasadas (`RES-33`, tres fuentes); *Oktubre* confirma `RES-31` con fuentes nuevas. Seis tapas **sin datos** (las fuentes describen el concepto, nunca la letra) y *Lobo suelto* en conflicto (`RES-35`: "alfabeto de Semilla Bucciarelli" vía Cosgaya sin acceso directo, contra un "Rey Garufa" de foro sin fundamento). El lienzo sumó la **hoja 05 — Tapas, letra por letra**: cada disco con su estado y, donde hay evidencia, una equivalente de trabajo de Google Fonts (Pacifico para el manuscrito de *Gulp!*, Stalinist One para el constructivismo de *Oktubre* — criterio propio, marcado). Pendiente: el tipoblog de Cátedra Cosgaya bloquea intermitente (7 de 9 corridas) — reintento dedicado en curso. |
| 2026-08-20 | **`RES-36` (`INV-07`, tercera tanda): la entrevista de Clarín del 18-jun-1999, leída entera en el navegador de la sesión** — el fetch automatizado daba 403, el navegador real entró. Rocambole recorre las nueve tapas: **resuelve *Lobo suelto*** (*"las tipografías corresponden a un alfabeto creado por el bajista Semilla Bucciarelli"* — el único disco con letra de otro redondo; "Rey Garufa" descartado como ruido de foro), confirma *Gulp!* con la voz del autor ("serigrafía con las letras en plasticola de color") y *Oktubre* ("parece soviética al estar invertida una letra"). Las otras seis tapas: la fuente más completa que existe **no aborda la letra** — el sin-datos queda firme. La Cátedra Cosgaya está caída a nivel servidor (rechaza incluso navegador real); ya no se espera. Hoja 05 del lienzo actualizada: tres verificadas, seis sin datos firmes, cero tipografías comerciales. |
| 2026-08-20 | **`D-18`: tipografía fiel y estética real por disco — nada de símiles.** El usuario rechazó los equivalentes de Google Fonts ("parecen parodias") y fijó el rumbo: reconstruir la letra real de cada tapa (fiel, desde fotos si no existe ya digitalizada) y aplicar la estética real de cada disco al lienzo. **`RES-37`: las paletas de las nueve tapas, muestreadas por conteo de píxeles** sobre las imágenes del Cover Art Archive (el conducto de `RES-25`), verificadas a ojo contra grilla de contacto — *Lobo suelto* naranja/petróleo/negro, *Gulp!* negro/rojo/crema, *La mosca* naranja quemado/rojo ladrillo/petróleo (discrepancia con el recuerdo del usuario anotada: puede ser de edición o de contratapa). Hoja 05 del lienzo rehecha con las paletas medidas. **En curso:** barrido en tres frentes — fuentes ya digitalizadas, herramientas foto-a-fuente con su método, y mapa de contratapas/sobres/afiches/folletos por disco. |
| 2026-08-20 | **`RES-38`..`RES-41` (`INV-07`, cuarta tanda): el camino a la letra real, cerrado como plan.** Segunda caza más profunda: **sigue sin existir digitalización fiel** (siete lugares verificados) y los tres señuelos quedaron fichados con nombre para que nadie los use de base (Big George NF, un STL de Cults3D, un CDR anónimo). **Flujo foto→fuente a costo cero** documentado: Inkscape + FontForge en 7 pasos, con el método de glifos faltantes de los revivals serios; lo caro es tiempo de diseño, no plata. **Plan por disco:** Oktubre ALTA, Lobo suelto ALTA (alfabeto-sistema de Semilla; crédito "Visiones: Rocambole, Semilla y Meroyuela"), Gulp! MEDIA (falta el insert que nadie describió). **El hallazgo de campo:** el hilo principal abrió Discogs en el navegador y vio la contratapa argentina de *Oktubre* de primera mano — tracklist y créditos completos en el mismo lettering a mano, casi el abecedario en minúscula (`RES-41`). Hoja 05 del lienzo ampliada con el plan. **Dos llaves quedan en manos del usuario:** el álbum de Facebook de Rocambole "Tipografías originales para afiche" (pide login) y sus discos físicos escaneados a 300–600 dpi, que son el paso 1 del flujo. |
| 2026-08-20 | **`RES-42` y `RES-43` (`INV-07`, quinta tanda): las fuentes aparecieron, y la primera calcada es nuestra.** El usuario trajo cinco fuentes a `Docs/INVESTIGACION/Tipografia/`: tres son **digitalizaciones fan del lettering real** de Benjamín Zavala (ffonts.net, sin licencia declarada) — el logo del PR coronado, el lettering "Redonditos" y **el alfabeto de Semilla** de *Lobo suelto* — y dos se descartaron (dingbats de logos; una grunge genérica renombrada). Corrige el negativo de `RES-38`: la caza pasó por ffonts.net y no las vio; el usuario a mano sí. **Y la titular de *Oktubre* se calcó hoy de la tapa misma** (`RES-43`): siete letras con la B espejada, trazadas de la imagen real con potrace + fontTools hasta un OTF de verdad (`Tipografia/OktubreCalco-v0.2.otf`), verificado lado a lado contra el original y renderizando en Chrome. Las cuatro están **incrustadas en la hoja 05 del lienzo** con espécimen y crédito. Siguiente en el tablero: la minúscula de la contratapa de *Oktubre* (corpus ya ubicado) y auditar la fidelidad de las tres fan contra las tapas. |
| 2026-08-21 | **`D-19`: la mezcla ricotera — cada pantalla viste un disco, la base no rota.** Pedido textual del usuario: mezcla de toda la cultura y los discos, manteniendo el caos de la banda. Para hacerlo sin inventar ya estaba todo: paletas medidas (`RES-37`), fuentes fan (`RES-42`), calco propio (`RES-43`). **La titular ganó cuatro letras derivadas** (A C D I, compuestas de las reales con el mismo gesto constructivista de la B espejada — `OktubreCalco-v0.3.otf`) y ahora escribe **ARCADE RICOTERO** completo: es el título del sitio en el lienzo. Mapa inicial en la hoja 05: portada=Oktubre, historia=Gulp!, mitología=Lobo suelto, letras=La mosca, discos=Último bondi, resultado=Gulp!+logo. Las tres pantallas de la hoja 09 quedaron vestidas cada una de su disco. Tres reglas ordenan el caos (base fija, texto largo siempre legible, acierto/error/rótulos no se disfrazan) y una deuda declarada: las fuentes no traen acentos todavía. |
| 2026-08-21 | **`D-20`: la Redondopedia — enciclopedia ricotera navegable, quinto frente del producto.** Decisión directa del usuario: sumar al sitio una sección estilo Wikipedia — historia completa, biografías, letras, los casos reales (Bulacio, Olavarría), cultura — navegable por enlaces entre artículos. Cinco cláusulas: no toca el "Listo" de la v1 (los cuatro juegos de `D-05` siguen intactos); estática sin backend (`D-02`); el rotulado hecho/leyenda/testimonio se extiende a la prosa — **la ventaja sobre Wikipedia es justamente poder contar la leyenda como leyenda**; el insumo inicial son las fichas `RES-` ya escritas; y "que la gente sume data" queda para el futuro (la vía arranca en la propia D-20: GitHub o buzón, nunca un login). Fuerza dos pendientes que venían pateándose: cómo cuenta el sitio la muerte del Indio (`RES-04`) y `CNT-04` releído para artículos enteros. |
| 2026-08-21 | **`producto` entregó la Redondopedia como historia trazable: `US-05` y `BR-07`..`BR-11`** en `Docs/PRODUCTO/PRD-redondopedia.md`. Seis tipos de artículo (disco, tema, persona, hito, concepto, leyenda — el séptimo "tapa/arte" descartado: vive dentro de `disco` y de Rocambole como `persona`) con campos mínimos por tipo. **Piso: 35 artículos** (10/5/7/4/3/6), alcanzable sin investigación nueva porque el insumo ya está en más de cuarenta fichas `RES-`. "Navegar como en Wikipedia" convertido en criterio corrible (`BR-09`: cero huérfanos, cero callejones, todo alcanzable desde la portada por BFS — el script lo debe `arquitectura`, lo corre quien tenga `Bash`, `D-12`). El rotulado de `D-14` se vuelve **granular**: por afirmación dentro del párrafo, no un campo único por ítem (`BR-08`). **`BR-10` da vuelta el techo de `CNT-04` para este formato:** Bulacio y Olavarría entran como artículos propios — la restricción nació de un problema del multiple choice que la prosa no tiene — con contingencia declarada (si `contenido` al releer concluye lo contrario, el piso de `hito` baja de 7 a 6). La muerte del Indio (`RES-04`) entra como `hito` propio. Orden de recorte interno: cae primero `tema` (letras completas, lo más caro y expuesto), `disco` y `persona` no caen nunca — son el esqueleto. Verificado por el hilo principal: IDs sin colisión, trazabilidad a `D-20` completa, propiedad de carpetas respetada (la petición a `arquitectura` fue por `Docs/SUGERENCIAS/`, sin número, como manda `Docs/IDS.md`). |
| 2026-08-21 | **El usuario aportó una fuente nueva, sin evaluar: https://redondossubtitulados.com/** — pidió registrarla y nada más, para que una futura sesión de investigación la trabaje. Puntero en `Docs/SUGERENCIAS/HILO-para-investigador-fuente-redondossubtitulados.md` con el checklist de evaluación (qué contiene, licencia, cruce contra los 105 de `RES-20`, para qué frente rinde — candidatas obvias: letras de `US-03` y el tipo `tema` de la Redondopedia). **Nadie entró al sitio todavía; no es citable hasta que exista su ficha `RES-XX`.** |
| 2026-08-21 | **Segunda fuente aportada por el usuario, sin evaluar: Coveralia** (https://www.coveralia.com/caratulas-de/patricio-rey-y-sus-redonditos-de-ricota.php) — "todas las tapas y discos y contratapas". Verificado: **no está entre las ocho vías que `RES-25` descartó**, es evaluación nueva. Puntero en `Docs/SUGERENCIAS/HILO-para-investigador-fuente-coveralia.md` con el contexto que importa: la doctrina contenedor≠contenido ya está cerrada (la evaluación útil es de corpus, no legal), **lo que podría valer oro son las contratapas** para el plan de letra fiel de `D-18` (`RES-41`: el insert de *Gulp!* y la minúscula de *Oktubre* son los faltantes), y la trampa de ediciones que `RES-25` ya cazó (el *Oktubre* del CAA es un CD yanqui del 93, no el LP argentino del 86 — anotar edición por imagen). Podría destrabar también la discrepancia de paleta de *La mosca* (`RES-37`) y las imágenes de `US-04`. **Sin ficha `RES-XX`, no citable.** |
| 2026-08-21 | **El sistema de marca aterrizó en el código, y el diseño quedó como fuente de verdad.** Rama `diseno/mezcla-ricotera` → PR → main. Lo que cambió: `tokens.css` reescrito con los valores del lienzo (base de tinta, estados, los `--cat-*` de la mezcla `D-19` con las paletas reales de `RES-37`, `--marca-rojo` de Oktubre) + las **cinco fuentes autoalojadas** en `public/fuentes/` (el calco de Oktubre, dos fan de Zavala, Archivo Black — 39 KB total, cero CDN); la portada viste Oktubre (`index.astro`: la marca en la titular calcada, JUGÁ en el rojo de la tapa); `partida.ts` ganó las dos palabras que faltaban (`categoria--X` para que las cuatro tintas pinten, y `firma` para que COMPARTIR lleve el lettering del logo); `juego.css` sumó la mezcla sin un solo hex. **El test de contraste subió de 12 a 17 pares** y pasa todo: build OK, `tsc` limpio, 47/47. Y la regla nueva `.claude/rules/diseno-marca.md` fija el circuito para todos los roles: **se cambia en el diseño, se refleja en `tokens.css`, se corre el test — nunca al revés.** Deuda declarada ahí mismo: las fuentes de disco no traen acentos todavía. |
| 2026-08-21 | **El sitio ganó esqueleto: portal collage-cassette, rutas navegables y las pantallas de lo que viene.** Pedido directo del usuario: índice lindo, link a cada juego, estética de cassette vintage con recortes de discos pegados en collage — siempre sobre Rocambole. Lo construido: portal en `/` como cassette grabado en casa (lado A los cuatro juegos, lado B la Redondopedia; cada casete viste su disco por `D-19` y las etiquetas son papel con renglones — par `tinta sobre papel` sumado al test AA, ahora 18 pares); el quiz **mudado a `/quiz/`** sin romper `ADR-02` (los links de desafío viejos a `/?g=...` redirigen conservando la query — verificado en el navegador con `n=Che`); tres pantallas "en la cocina" honestas (la de adivinar el tema promete acceso al tema, no reproducción completa — `BR-06`); `Base.astro` + `sitio.css` (cero hex, todo `var()`, grano de serigrafía como token). **Sistema de recortes reemplazables:** `public/arte/` trae 5 dibujos de reemplazo originales (mosca, multitud con banderas, perro, lobo, cassette) y un README con el **despiece de 15 piezas fundado en `RES-06`/`RES-22`** — qué recortar de cada tapa, cómo y dónde se pega; cuando el usuario deje el PNG real con el nombre acordado, el build lo levanta solo (`src/lib/sitio/arte.ts`). Deuda de circuito declarada: `--papel` y `--textura-grano` entraron a `tokens.css` sin pasar antes por el lienzo — propuesta a `experiencia` para saldarla. |
| 2026-08-21 | **La Redondopedia salió del papel: 26 de los 35 artículos del piso, escritos desde las fichas y verificados contra ellas.** Corrida de 14 agentes en tres fases: inventario de las fichas (`INV-01`, `INV-02`, `INV-20` + guías `CNT-02`/`CNT-04`), redacción por tipo (10 `disco` — En directo excluido por ser vivo —, 5 `persona`, 5 `hito`, 4 `concepto`, 2 `leyenda`), y **verificación adversarial que encontró 21 problemas, 5 bloqueantes, todos corregidos antes de integrar**. El patrón de los bloqueantes vale como lección: tres artículos inflaban "Patricio Rey Discos" a "el sello propio de la banda" (ninguna ficha lo dice — suposición inferida del nombre, disfrazada de hecho), y dos resúmenes presentaban el testimonio de Rocambole sobre la prensa como hecho pelado. `BR-08` quedó implementado en la forma de los datos: el cuerpo es una lista de segmentos y cada uno lleva rótulo y fuente en el punto exacto (leyenda con tiza y rombo, testimonio con celeste y comillas — los códigos del quiz, que no se disfrazan de disco). `BR-09` es test corrible: cero huérfanos, cero callejones (la única excepción usada es la declarada para `leyenda`), enlaces `[[slug\|texto]]` todos resueltos. Discrepancias en paralelo como pide `US-05` criterio 5 (la fecha de *Gulp!* con sus tres versiones, cada una con fuente). Faltantes para el piso: los 6 `tema` (esperan letras con filtro `D-13`) y Bulacio/Olavarría (`CNT-04`, `BR-10`). Tests **54/54**, `tsc` limpio, build de 32 páginas. |
| 2026-08-21 | **Las tapas de Coveralia, bajadas y en uso acotado.** Pedido directo del usuario sobre el puntero que él mismo trajo: 35 imágenes (frontal, trasera y CD/interior donde existen, los 11 títulos) en `Docs/INVESTIGACION/TapasDiscos/` como másters fuera del sitio, y **bajas de 320 px** generadas a `public/tapas/` con `scripts/generar-tapas.mjs` (repetible). Dónde aparecen: **solo en las fichas `disco` de la Redondopedia** con crédito a Rocambole (`BR-07` las pide; `D-04` las quiere en baja) — el resto del collage sigue siendo recortes y dibujos propios, porque `UX-04` prohíbe la tapa entera como fondo decorativo. Nota para `investigador`: la ficha de evaluación de Coveralia sigue pendiente (`HILO-para-investigador-fuente-coveralia.md`); esto fue ejecución del pedido del usuario, no evaluación de corpus — la trampa de ediciones que avisó `RES-25` queda por auditar imagen por imagen. |
| 2026-08-21 | Nota de proceso: el test de estilos fallaba en Windows por finales de línea CRLF del checkout (buscaba `\n}\n` literal) — venía fallando también sobre `main`, no lo introdujo esta sesión. Normalizado al leer en `estilos.test.ts`, que además ahora audita `sitio.css` en la regla de cero hex fuera de `tokens.css`. |
| 2026-08-21 | **Corrida anti-slop, por pedido directo del usuario: nada en el sitio puede verse como la interfaz por defecto de una IA.** La regla quedó escrita para todos en `.claude/rules/diseno-marca.md` (tabla de tics vetados con su reemplazo en el idioma del proyecto — sello, cinta, papel, tinta plana, rotación) y **lo auditable se audita a máquina**: `estilos.test.ts` falla el build si vuelve una pastilla 999px o una barra de acento lateral fuera de la cita rotulada. Lo barrido, detectado con una caza de 3 agentes más el ojo propio: la **barra de acento a la izquierda de las tarjetas** (el caso que motivó el pedido — `.tarjeta-articulo` y `.feedback` pasan a borde completo teñido), **siete pastillas cápsula** convertidas a sello de goma de esquina casi viva, `--radio` de 14px a **4px** (papel cortado, no burbuja — deuda de lienzo anotada), los `style=` inline de la plantilla de artículo movidos a clases, y las **superficies "elevadas"** de las piezas del collage reemplazadas por recorte de borde grueso — que además arregla un defecto real: `cat-letras` sobre `--fondo-elevado` daba **4,32:1, abajo de AA**; sobre `--fondo` todos los pares pasan. En texto: la coletilla "entre los emblemas" repetida en siete discos destemplada, el redoble de tambor antes del dato y la honestidad declamada de tres cierres pasados a tinta seca, y dos cadenas de `CNT-05` corregidas — la gorda: **"¡Con la gorra bien puesta!" premiaba con la policía** ("la gorra" en la tribuna) y era jerga inventada; ahora "¡De una la sacaste!". Propuestas a `experiencia` y `contenido` actualizadas. 55/55 tests, build OK. |
| 2026-08-21 | **Ciclo 4 planificado: `T-44`..`T-63`, 20 tareas, en `Docs/ORQ/ORQ-plan-ciclo-4.md`.** Pedido del usuario que ordena el ciclo: integrar las tapas reales a la página —recortarlas, usar detalles, usarlas de fondo— más seguir con los juegos, la página y la Redondopedia. El corte encontró que **el pedido choca de frente con una regla vigente**: `UX-04` dice textualmente que las tapas reales van "nunca como fondo decorativo de otra pantalla", así que el ciclo arranca registrando `D-21` (`T-44`) y reescribiendo esa fila (`T-45`) — construir antes de eso sería construir contra una regla. El foco es doble y no casual: las tapas entran al sitio y de paso se cierra **`US-04` (adivinar la tapa) de 0/10 a 10/10**, el único de los tres juegos que faltan cuya materia prima ya está en el repo. La Redondopedia va de 26/35 a **29/35** (los 2 `hito` de Bulacio y Olavarría más la tercera `leyenda`). **Riesgo declarado del ciclo:** que la foto de fondo con velo oscuro y texto encima traiga de vuelta el slop que costó una corrida entera sacar, y que rompa los pares AA — mitigado con el velo como token testeado, recorte pegado en vez de imagen a sangre, y una regla más en `estilos.test.ts`. **Cambio de alcance declarado:** `BR-07` pedía "letra completa" en los artículos `tema`; `T-61` le pide a `producto` que lo corrija a versos citados más análisis, alineado con el techo de cita de `RES-03` y con los 2/1/0 versos de `BR-03`. El piso de 6 no se toca. Quedó afuera `US-02` entero (los recortes de audio los produce el usuario), la carga de letras (el insumo todavía no está en el repo — se llevan las tres tareas que destraban el ciclo 5) y desplegar en Vercel (va primero en el 5, con las tapas ya adentro). Rangos reservados en `Docs/IDS.md`: `RES-44`..`RES-49`. |
| 2026-08-21 | **El usuario dejó guardada una idea futura: que el sitio intente hablar como el Indio.** Analizar a fondo letras, entrevistas y demás archivo, y destilar de ahí una guía de voz que se apoye encima de `CNT-02` y `D-17`, no que las reemplace. **Pidió explícitamente que no se haga ahora.** Puntero en `Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md`, con las tres preguntas que hay que contestar antes de escribir copy: si el sitio habla *como* él o *citándolo* (escribir frases nuevas con la voz de una persona real que murió el 5-jun-2026, `RES-04`, no es lo mismo que citar testimonio rotulado); dónde aplica y dónde no (un botón críptico es un molinete cerrado, `D-14`); y que no termine en imitación de manual, que es el slop de `.claude/rules/diseno-marca.md` pero en el texto. |
| 2026-08-21 | **Pedido del usuario: las bandas ricoteras nacidas después de la separación son parte de la cultura y van a la Redondopedia.** Nombró tres — *La Kermesse Redonda*, *Indio y los Fundamentalistas del Aire Acondicionado*, *Skay y los Fakires* — transcriptas tal cual, **sin verificar por nadie**: los nombres exactos, las fechas y qué es cada una las fija una ficha `RES-XX`, porque la web tiene una sola puerta. Que entran no se discute; falta que `producto` decida bajo qué tipo (`BR-07` tiene seis y ninguno es `banda`) y qué le pasa al piso de 35 (`BR-11` es el orden de recorte). **La trampa señalada en la propuesta:** artículo sí, ítem de juego no — el filtro de los **105 temas de `RES-20`** existe justo para que no se mezcle material solista con el de la banda, y meterlo en un juego le marcaría error al que se sabe cuál es cuál. Nada de esto es del ciclo 4. |
| 2026-08-21 | **Ciclo 4 EJECUTADO y cerrado: las 20 tareas `T-44`..`T-63`.** Pedido del usuario: integrar las tapas reales a la página —recortarlas, usarlas de fondo— más seguir con los juegos, la página y la Redondopedia. **Lo primero que apareció fue un choque:** `UX-04` decía textualmente que las tapas reales van *"nunca como fondo decorativo de otra pantalla"*, o sea exactamente lo prohibido era lo pedido. Se registró `D-21` (las tapas entran a toda la pantalla, con cuatro condiciones: crédito, legibilidad como token testeado, la forma del proyecto y baja resolución) y recién después `experiencia` reescribió la fila y escribió `UX-05`, el catálogo pantalla por pantalla. **Resultado en el sitio:** 16 derivados nuevos generados desde los másters (`scripts/generar-tapas.mjs` ahora produce ficha, detalle y fondo), el portal con la franja de banderas de *Oktubre* y un recorte por casete, las pantallas en la cocina y la cabecera de la Redondopedia con fondo velado, y las fichas de artículo con su detalle por sección. **El velo es prueba, no promesa:** `--velo-tapa` (86%) y `--velo-tapa-titular` (75%) con seis tests que miden el **peor compuesto posible** —el velo sobre un píxel blanco puro—, más una regla en `estilos.test.ts` que falla el build si una tapa entra de fondo sin velo. |
| 2026-08-21 | **Y el ciclo 4 dejó un segundo juego jugable: `US-04` (adiviná la tapa), 10/10.** `arquitectura` escribió `CTR-05`, `contenido` cargó el banco y el hilo principal el juego, que **reusa el armado de ronda del quiz en vez de copiarlo** — copiarlo habría copiado también el defecto que ese archivo arregla (la correcta caía primera en 25 de 30 ítems). El portal ya lo anuncia con JUGÁ. La Redondopedia pasó de 26 a **29 de 35**: los dos `hito` de Bulacio y Olavarría —habilitados por el veredicto de `contenido` en `CNT-06`— y la tercera `leyenda`. Se cerraron además `CTR-04` (schema de completar la letra), `BR-12` (un artículo `tema` lleva versos citados y análisis, no la letra entera), `RES-44` (auditoría de edición de las 35 imágenes y evaluación de Coveralia) y `RES-45` (la fuente de letras que trajo el usuario). **77 tests, `tsc` limpio, build de 35 páginas.** |
| 2026-08-21 | **Tres cosas que el ciclo 4 encontró y que valen como lección.** (1) **La imagen de *La mosca y la sopa* no era de Rocambole:** el frontal que se había bajado es un rediseño con una foto de recital. Lo detectó `contenido` al no poder cargar el décimo ítem y lo confirmó el hilo principal mirándola. La contratapa sí trae el collage real, así que de ahí salen ahora la ficha de ese disco y los recortes de la sección `letras`. (2) **Una invariante propia rompió el build de más:** rechazaba toda reedición como respuesta correcta, cuando `RES-44` solo la veta *si la pregunta depende de la edición*. Se relajó a lo indefendible —"no determinable"— y quedó como test. (3) **`UX-05` mandaba poner *Oktubre* detrás de la marca grande**, que es el único texto del sitio que no llega a AA sobre tapa velada (3,38:1, y al 92% de velo sigue sin llegar). El fondo va anclado abajo. Las dos desviaciones quedaron en `Docs/SUGERENCIAS/` esperando a `experiencia`; `revisor` las revisó y las dio por bien resueltas y bien documentadas. |
| 2026-08-21 | **Las dos revisiones del ciclo encontraron nueve hallazgos y los importantes se corrigieron en la misma ráfaga.** El más serio: **`TP-010` mostraba la contratapa con el título del disco impreso y legible en la propia imagen** —la respuesta escrita adentro de la pregunta, y encima rotulado difícil—. Se cambió al recorte de la olla, que no lleva texto. También: `TP-002` mezclaba un hecho verificado con una afirmación reportada y ahora la lleva rotulada como leyenda; `CNT-01` seguía diciendo que las tapas se usaban en un solo juego y que venían del Cover Art Archive, y quedó al día; y **el crédito por pantalla de la condición 1 de `D-21` estaba implementado genérico** — ahora cada página declara qué tapas usa y el pie las nombra. `REV-05` quedó escrita con los cinco hallazgos de `US-04`, tres de ellos abiertos y con dueño (`arquitectura`: la ruta de `detalle` en `CTR-05.4`, la ventana de precarga, y el crédito compartido de *Lobo suelto*/*Cordero atado*). |
| 2026-08-21 | **El lienzo de marca se actualizó de verdad, y con eso el circuito de `.claude/rules/diseno-marca.md` quedó cumplido por primera vez.** La regla manda diseño → tokens → test y nunca al revés, pero el lienzo es un artefacto publicado que lleva su propio editor adentro: la sesión frenó y le preguntó al usuario antes de tocarlo, porque republicarlo reescribe lo que él edita a mano. Confirmó que nunca lo había editado. Se extrajeron las once hojas, se le agregó a la **hoja 05** la sección de `D-21` (las tres formas con su tamaño y su regla, los dos velos con su peor caso medido, el rojo de marca marcado como prohibido sobre tapa velada, el mecanismo de crédito y lo que sigue vetado), y se volvió a publicar en la misma URL con las otras diez hojas intactas. Queda anotado el techo real del material, que el catálogo no sabía: los frontales miden 953×953, así que **ningún recorte llega a los 480/640 px que pide `UX-04`** — el generador no agranda y avisa cuál quedó corto. |
| 2026-08-22 | **Diez ideas de juegos guardadas como `IDEA-01`..`IDEA-10`, sin empezar ninguna** (`Docs/PRODUCTO/PRD-backlog-ideas.md`). El usuario las tiró de una y pidió explícitamente guardarlas sin desarrollar. Se les creó prefijo propio en vez de escribirlas como `US-`: un `US-XX` acá es un contrato con Given/When/Then y piso, y forzarlo sobre diez ideas sin comprometer habría sido inventarles alcance. Cada título quedó **verificado contra los 105 temas de `RES-20`** antes de escribirlo — *Masacre en el puticlub* (Un baión, 1988), *Toxi-Taxi* (La mosca y la sopa, 1991), *Un Pacman en el Savoy* (¡Bang! ¡Bang!, 1989), *Último bondi a Finisterre* (1998), *Gran Lady* y *Rock para el negro Atila* (Lobo suelto vol. 1, 1993). **Dos reglas nuevas:** `BR-15` (la instrucción transversal del usuario — los clones se adoptan de un genérico y se visten, no se escriben; con las tres consecuencias que arrastra: licencia del motor, el skin es la parte cara, y la música de fondo en loop no está cubierta por ningún ADR) y `BR-16` (una idea no entra a un ciclo sin promoverse antes a `US-XX`). **Tres cosas quedaron abiertas y ninguna la puede contestar la sesión:** "el gordo Pier" no figura en los 105 —lo más cercano es *Pierre, el vitricida*, Gulp! 1985—, "la tumba del Indio" de `IDEA-05` no se dio ni por cierta ni por falsa, y `IDEA-10` (Guitar Hero) tiene bloqueo estructural de audio con tres salidas posibles. Ninguna de las diez es alcance de la v1: `US-02` y `US-03` siguen sin un solo ítem cargado. |
| 2026-08-22 | **`D-22`: los temas enteros se alojan en el sitio, en mp3.** Decisión directa del usuario — *"Vamos a alojar temas enteros en .mp3 seguro."* **Sacó de Fuera de alcance la línea más estable que tenía el proyecto**, y el motivo no fue una concesión: esa línea contradecía a `D-14`, porque el tema completo era lo único que el sitio le negaba al jugador sin Premium, y los molinetes van abiertos. Corregidos los dos lugares que quedaban diciendo lo contrario (`Docs/BRIEF.md` y `CLAUDE.md`, alcance y motor de audio). **Lo que se cayó:** `E-07` —que `ESTADO.md` tenía como "la pregunta que más pesa"— y `E-04` dejan de decidir si la promesa se cumple; Spotify baja de vía a extra; `BR-06` quedó describiendo un sitio que ya no existe y lleva aviso, sin reescribirse todavía porque depende de si Spotify se queda. **Lo que se cayó del lado bueno:** `IDEA-10` (Guitar Hero) era la única de las diez con bloqueo estructural y el bloqueo era exactamente este — desbloqueada el mismo día, aunque ahora le falta de dónde sale la partitura. **Lo que apareció en su lugar, y es aritmética:** contra las duraciones de `RES-20` (94 de 105 temas, 385 min fichados) el catálogo son **~7,2 horas de audio** — ~300 MB a 96 kbps, ~400 MB a 128, ~600 MB a 192, ~1 GB a 320. El problema pasó de ser de alcance a ser de peso e infraestructura: dónde viven los archivos, si van adentro del repo que Vercel construye, y los límites de Vercel para ese volumen, **que no están fichados y es lo único que conviene chequear antes de subir el primer archivo** (`RES-15` ya descartó el susto de la factura: en Hobby no hay cargo posible). Se le dejó a `arquitectura` todo junto en `Docs/SUGERENCIAS/HILO-para-arquitectura-audio-alojado.md`, incluida la consecuencia que más horas ahorra: si los pasos del reveal se derivan del mp3 entero, el recorte manual de `D-06` casi desaparece. |
| 2026-08-23 | **La voz del sitio dejó de ser intuición y pasó a estar medida** (`.claude/rules/voz-ricotera.md`). Se tomó la idea guardada del 21. Dos corpus del propio repo: el memoir (`RES-21`, 192.464 palabras) y las letras de los 104 temas (2.958 versos). Lo que salió: el verso mediano son **5 palabras** y el 90% no pasa de 8 — de ahí el techo de las líneas grandes; la letra le habla a alguien (*tu/tus* 146 contra *mi/mis* 115) y prefiere el cuerpo a los colores (75 contra 17); y el habla es corta (oración mediana de 13 palabras), rodea en vez de definir (*una especie de* 49, *más bien* 55) y **declara la duda** (*creo que* 81, *no sé* 71). Los tres antídotos contra la imitación: *che* 9 / *viste* 15 / *digamos* 3 en 192 mil palabras; *los fans* 2 contra *la gente* 333; y épica militante casi nula (*lucha* 6). **La regla prohíbe expresamente que el sitio se haga pasar por él**: una frase inventada con su firma rompería el rótulo `testimonio`, que es la promesa que sostiene todo lo demás (`D-14`). Nació también `src/lib/voz.test.ts` —lo que la sugerencia del 21 marcaba como inexistente—: seis pruebas sobre el copy visible, que encontraron y corrigieron **once botones en infinitivo** contra `D-17`. 185/185. **Y el barrido entró el mismo día**, con las dos decisiones del usuario: la Redondopedia va con prosa con voz y rótulo seco (registro 2 + 3), y el copy nuevo alcanza solo a las superficies que presentan — portada, seis casetes, pantalla 0 y tramos de resultado—, nunca a lo que hay que entender para jugar. 186/186. |
| 2026-08-23 | **`IDEA-11` guardada, sin empezar: mayor o menor con las palabras del cancionero.** Idea del usuario —arrancás con una palabra y su cantidad de apariciones en la discografía, y vas diciendo si la siguiente se dice más o menos, sumando racha—, con la instrucción explícita de guardarla y no desarrollarla. Ficha completa en `Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md` (la carpeta del PRD es de `producto`), número reservado en `Docs/IDS.md`. **No aplica `BR-15`** aunque el género exista: el motor son dos botones, lo caro es el dato — igual que `IDEA-09`. **Lo que la vuelve barata:** el corpus ya está en el repo desde el ciclo 6, no necesita audio, ni imagen, ni ficha de `investigador`, ni motor con licencia; y no roza `BR-03`/`BR-12` porque muestra palabras y números, nunca versos. **Lo que la frena, medido hoy sobre `src/data/cancionero.json`:** de los 104 temas, 96 tienen letra, y contando en crudo las líneas tipadas `t: "letra"` la palabra más frecuente da **`riff` 306 veces** y la segunda `guitarra` 156 — son anotaciones de la cifra viajando adentro de la letra (cifraclub aportó 88 de los 104). Filtrando lo que parece anotación se caen 1.070 líneas y quedan 2.858, con al menos una sucia en 80 temas, y **todavía queda basura arriba**. Como el conteo **es** la respuesta correcta, sin limpiar el corpus el juego rompe lo único estricto de `CLAUDE.md`. Esa limpieza es la misma deuda que ya arrastran `IDEA-08` y `US-03`: se paga una vez y sirve para las tres. |
| 2026-08-23 | **`IDEA-04` dejó de ser un género y pasó a tener meta: hay que llegar a tomar el último bondi.** El usuario lo pidió como "otro juego" —*"un mario de plataformas simple pero que hay que llegar a tomar el último bondi a Finisterre"*— y **no se abrió ID nuevo a propósito**: es la misma idea del 22, que estaba guardada con la frase pelada *"Plataformas ultimo bondi a finisterre"*. Un ID nuevo para la misma idea es justo lo que `Docs/IDS.md` evita. Ficha actualizada en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md` (la carpeta del PRD es de `producto`). **Lo que la meta resuelve sola:** el choque principal de la ficha era "largo de nivel contra la sesión de dos o tres minutos", y ahora el que corta el nivel es el bondi que arranca — la cuenta regresiva es el micro, no un número en la esquina, que es lo que pide `diseno-marca.md`. Además empuja los controles hacia un solo botón (correr a alcanzar algo que ya se está yendo) y regala la pantalla de derrota: "el último" quiere decir que no hay otro, y quedarse a pie no necesita ni chiste ni consuelo. **Tres precisiones verificadas hoy contra el cancionero:** *Último bondi a Finisterre* es un **disco, no un tema** —los diez temas están cargados y ninguno lleva ese título—, la palabra *bondi* aparece **una sola vez** en los 96 temas con letra y es en *El lobo caído* (Lobo suelto, 1993), ~~y *Finisterre* **no aparece nunca**~~ — **mal medido, y lo corrigió el usuario el 2026-08-24: lo que medí fue el corpus del repo y lo escribí como si fuera un hecho sobre las letras. *Finisterre* está cantado en *Gualicho*, cuya letra el repo no tiene.** Queda pedido a `investigador`: qué es Finisterre, porque el juego puede usar el nombre del disco pero no afirmar qué significa hasta que haya `RES-XX`. Sigue sin empezar, sigue fuera de la v1, y sigue con lo caro abierto: motor 2D con licencia (`BR-15`) y el skin, el más caro de los cinco clones. |
| 2026-08-24 | **`IDEA-04` tiene tema: *Gualicho*, y el tema corrigió un dato que yo había medido mal el día anterior.** El usuario avisó que el bondi a Finisterre está cantado ahí. **Mi frase del 23 —"*Finisterre* no aparece nunca en las letras"— era falsa, y el modo de fallar vale más que el dato:** medí el corpus del repo y lo escribí como si fuera un hecho sobre las canciones. Es exactamente lo que `CLAUDE.md` llama poner una leyenda disfrazada de dato, con el agravante de que la fuente era un archivo propio. Corregido en la bitácora del 23 y en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`. **Lo que el tema aporta a la idea:** el destino deja de ser un título de tapa y pasa a estar cantado; el verbo del juego sale de la letra —no es *tomar* el bondi, es **colgarse**—; *Gualicho* es la pista 4 del mismo disco, así que tema, tapa y paleta (`RES-37`, `D-19`) son la misma cosa; y con `D-22` el mp3 existe, lo que vuelve concreta la consecuencia 3 de `BR-15` (música de fondo en loop, sin ADR que la cubra). **`IDEA-04` es hoy la única de las cinco ideas de clon con su música decidida.** **El agujero que apareció al ir a buscar el verso, medido sobre `src/data/cancionero.json`:** *Gualicho* está marcado `contenido: "letra"` y **no tiene una sola línea cantada** —sus tres líneas tipadas `letra` son cifrado—; en el mismo disco *Pogo* tiene 0 de 24 (es una tablatura entera) y *El árbol del gran bonete* 1 de 4. Los otros seis con letra están completos y *Scaramanzia* está bien declarada como solo tablatura. Los tres agujeros vienen de cifraclub, fuente de 82 de los 104 temas. **Y hay un defecto vivo, chico pero visible:** `/letras-y-acordes/gualicho/` promete la letra de un tema y muestra tres líneas de acordes. La invariante de `src/lib/cancionero/banco.ts` que debería atajarlo existe pero cuenta como verso cualquier línea tipada `letra`, así que el cifrado le pasa por al lado. |
| 2026-08-24 | **Auditoría de detalles con la skill `impeccable`** sobre el portal y el quiz: 15/20, 4 P1 y 7 P2, todos arreglados y verificados en pantalla el mismo día. El grueso: `.primario` era una regla con alcance de página y los botones que crea el JavaScript salían sin estilo (siete botones en cuatro juegos); el auto-avance de 1,2 s se comía la explicación en 22 de 40 ítems; el foco se caía al `<body>` en cada cambio de pantalla; y el link de `COMPARTÍ` no tenía tarjeta. Informe en `Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md`. Entró además la figura encadenada a la portada, **sin atribuirle disco** hasta que haya ficha. |
| 2026-08-27 | **`T-133`: `CTR-09`, el schema del banco de `US-07`** (`Docs/ARQ/ARQ-schema-adivinar-por-la-letra.md`). El banco es `src/data/por-la-letra.json`, un ítem **por tema**, con la ventana de **8 versos** que revela la escalera de `BR-20` y **ni un dato de la escalera**: los pasos se cortan con `slice(0, 1|2|4|8)`. Sin `id` posicional —la identidad es el slug, que sale de `RES-20` y no se corre—, sin `estado` y sin distractores. El schema **sí** se baja a `src/data/_schema/por-la-letra.schema.json` (al revés que `CTR-03.8`, con el motivo escrito) y entra a `esquemas.test.ts` con un token. **El enganche de `CNT-11`**: una función `ventanaValida()` que devuelve el motivo del descarte, más `filtro.version` en el envoltorio comparado contra `VERSION_FILTRO` — así un banco generado con la regla vieja no se puede hacer pasar por filtrado. La dificultad manual va a `src/data/por-la-letra-curaduria.json` (de `contenido`, keyed por slug) y un tema sin etiqueta **entra igual** como `sin-clasificar`, para no repetir el pozo de tres ciclos de `US-03`. **Hallazgo medido de paso: `sirveComoVerso("[A  G]")` devuelve `true`** — está en `letra.json` como contexto de `CL-265` y `CL-266`. En `US-03` era un renglón feo; en `US-07` sería el enunciado entero del paso 1. Tapado por schema en `CTR-09.4`; el arreglo de fondo, en `Docs/SUGERENCIAS/ARQ-para-hilo-principal-verso-de-acordes.md`. |
| 2026-09-01 | **`/ciclo` planificó el ciclo 10** (`Docs/ORQ/ORQ-plan-ciclo-10.md`, `T-161`..`T-175`, dos tramos). Es un ciclo de **cierre**: no agrega un juego, un ítem ni una pantalla — mira lo construido contra lo escrito. **Lo que lo motiva salió de medir, no de recordar: los cinco pisos de la v1 están cumplidos y la v1 no está lista.** `src/scripts/partida-tema.ts:196-202` arma la vuelta de `US-02` con un Fisher-Yates sobre los 95 temas y corta cuatro; **la palabra `dificultad` no aparece una sola vez en el archivo** y `adivinar-tema.json` no tiene el campo en ninguno de sus 95 ítems. Es `FIND-29` —el defecto que `REV-08` encontró en `US-07`— **vivo en un juego de la v1**, donde pesa más porque `US-07` está fuera del "Listo" por `D-05`. Contra eso, `PRD-alcance-v1.md` le exige a `US-02` **mínimo 8 de nivel Fácil** por `BR-18` (f): hoy son 0 y `BR-01` no se cumple. **Segundo hallazgo del mismo tirón:** `adivinar-tema.json` es el **único banco de juego sin schema** — `esquemas.test.ts` valida siete archivos y ese no está, así que los 95 ítems del banco más grande de la v1 son los únicos que nadie valida a máquina. El frente A (`T-161`..`T-165`) cierra las dos cosas y **está construido para andar con cero mediciones**: degrada a barajado declarado como `US-07`, así que el ciclo no se cuelga de la clave de YouTube. Cierra `T-174` (`REV-09`), la revisión que declara la v1 o dice qué falta. |
| 2026-09-01 | **Ciclo 10 hecho entero en una ráfaga: `T-161`..`T-175`, catorce de quince** (falta `T-165`, la clave de YouTube, que es del usuario). `npm test` **372/372** (eran 352), `check` limpio, build de 150 páginas. **El defecto que lo motivó:** `US-02` armaba la vuelta con un Fisher-Yates sobre los 95 temas y `dificultad` no aparecía una sola vez en el archivo — `FIND-29` vivo en un juego de la v1. **La salida resultó más chica y mejor ubicada que la que yo había planificado, y porque `arquitectura` ya la había escrito hace un ciclo:** *"sería un dato nuevo y no iría en el manifiesto — iría en el catálogo, al lado de `RES-20`"*. Así que `CTR-03` revisión 4 (`CTR-03.11`) pone la dificultad en `catalogo()`, derivada en build de las escuchas, **sin tocar el archivo de datos**; `CTR-03.8` —la decisión de no bajar el schema a archivo— se re-evaluó y **se ratificó**, porque el campo nuevo tampoco se carga a mano. **Mi plan decía que `adivinar-tema.json` era "el único banco sin contrato" y era falso:** tiene `CTR-03` y la falta del `.schema.json` es una decisión con tres motivos escritos. De paso, dos reglas que estaban duplicándose se unificaron: `repartirPorPopularidad` (`D-27`) pasó a `src/lib/popularidad.ts` y el escalonado de `BR-01` a `src/lib/escalonar.ts`, que ahora comparten `US-02` y `US-07` — `ronda.ts` no se tocó. **`REV-09` abrió en 🟡 y cerró en 🟢**, con cuatro hallazgos: `FIND-34` (los pisos de `US-02` y `US-03` llegaron el 27-ago y nadie prendió su guarda), `FIND-35` (tres criterios de aceptación de la v1 describían un producto que ya no existe: Spotify y el cerrojo de derechos que `D-22` y `D-14` retiraron), `FIND-36` y `FIND-37`. **Lo demás del ciclo:** el `h1` del quiz bajó de diez palabras a cinco —*"Entrá, sepas lo que sepas."*— y con eso `voz.test.ts` audita los seis `h1` de portada, hueco que llevaba un ciclo abierto; `QZ-025` (Bulacio) dejó de acertarse con civismo y pasó al ángulo que `CNT-04` ya fichaba, el tiempo que tardó la Justicia; el verso `",l mi viejo"` se arregló en `cancionero.json` **y un barrido independiente encontró de paso cuatro candidatos de `US-03` cuyo "verso" es prosa del transcriptor de cifraclub — ninguno llegó a `listo`**; `UX-13` adoptó los diez zooms de tapas que el hilo principal había elegido sin `experiencia`; `CTR-05.5` ratificó la regla de `encuadre` que se le había reemplazado sin ser su dueño; y tres explicaciones de tapa que hablaban del título dejaron de señalar algo que el zoom sacó de pantalla — `TP-001` además **llamaba "título" al nombre de la banda**, verificado abriendo la imagen. **La deuda de método, declarada y no tapada (`FIND-37`): las quince tareas y la revisión salieron de la misma mano**, incluidas decisiones de `producto`, `arquitectura` y `experiencia`. Es la tercera vez en tres ciclos que el proyecto tropieza con lo mismo. |
| 2026-09-24 | **Auditoría de prompts (`/claude-api prompt-audit`): los agentes y las skills estaban en el 19 de agosto.** Los 7 agentes y las 11 skills no se habían tocado desde que entraron al repo, y le seguían diciendo a cada rol cosas que `D-05`, `D-14`, `D-19`, `D-21`, `D-22` y `ADR-01` ya habían dado vuelta: que la nota de derechos bloquea publicar, que Spotify es la vía al tema completo y `ADR-01` sigue abierta, que las tapas van solo en su juego, que los juegos 3 y 4 están por confirmarse. Además, cuatro agentes y cinco skills mandaban al rol a escribir `ESTADO.md`, que `Docs/EQUIPO.md` reserva al hilo principal. Y `revisor` y `coherencia` tenían un tope de líneas que le recorta la cobertura a un modelo que lo cumple al pie de la letra. **Aplicados 14 hallazgos** (9 de confianza alta, 5 media) en 20 archivos de `.claude/` y en `CLAUDE.md`, que además perdió los tres avisos que corregían su propio párrafo: ahora dice lo vigente y apunta a `PRD-alcance-v1.md` para los pisos. Informe completo, con lo que se marcó y no se tocó, en `Docs/SUGERENCIAS/HILO-auditoria-prompts-ia.md`. **Pendiente:** correr el validador de instancia (`D-11`), que no está en el contenedor donde se hizo esto, y mirar en la próxima delegación real que ningún rol toque `ESTADO.md` y que `revisor` traiga todos los hallazgos. |
