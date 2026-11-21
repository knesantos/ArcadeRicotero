# ESTADO â€” RicotaArcade

> **Lo Ãºnico que sobrevive al reinicio de contexto.** Se actualiza al final de cada
> sesiÃ³n. Si esto y el disco no coinciden, manda el disco: corregÃ­ este archivo.
>
> Regla: un estado **nunca baja por inferencia**. Solo el usuario degrada un estado.

**Ãšltima actualizaciÃ³n:** 2026-11-20

> ## ðŸŽ¯ LA PULIDA DE JUGABILIDAD, RONDAS 0 A 4 (2026-11-19/21) â€” `REV-24`, `T-531`..`T-535`
>
> **Criterio nuevo del usuario (2026-11-21), manda sobre todo lo de abajo:** *"no me gustarÃ­a que por querer integrar a los que
> no saben nada empeoremos los juegos, prefiero que sea mÃ¡s de nicho, si entrÃ¡s es porque te gustan los Redondos"*. El molinete
> es acceso (sin cuenta, sin login), **no dificultad**. `T-535` se construyÃ³ antes de ese criterio: **estÃ¡ commiteado en
> commits separados y pendiente de que el usuario elija quÃ© se queda** (`bbb867e`..`fbba020`). Va hacia el novato, y por eso
> estÃ¡ en duda: la frase "Te falta escuchar disco" sacada de los errores del quiz (`0e0eecc`), el titular del resultado del
> tema que cambia el tiempo por la cuenta cuando sacaste poco (`b24c1c0`), y las puertas a la Redondopedia en la derrota.
> Neutro (dice la verdad): las 8 dificultades del quiz reclasificadas (5 suben a media, 3 bajan a fÃ¡cil) y el casete del quiz,
> que prometÃ­a "ocho preguntas". Sin crÃ­tico fresco de esta ronda: se frenÃ³ por el criterio nuevo. Sale en el artifact de revisiÃ³n.
>
> **Sin integrar**: rama `worktree-pulida-jugabilidad`, sobre `main` en `7d0a22d`. Pedido del usuario del 2026-11-19 (la idea estÃ¡
> anotada en "Ideas guardadas" del `ESTADO.md` del checkout principal, todavÃ­a sin commitear ahÃ­): siete perfiles critican los cuatro juegos; Opus orquesta y audita, Fable construye, un crÃ­tico fresco
> juega cada ronda.
>
> - **Ronda 0 (`T-531`, `REV-24`)**: tres crÃ­ticos Sonnet, siete perfiles anotados por separado, en el build real a 375Ã—812.
>   Hallazgos, plan de rondas y el arranque medido de los 95 mp3 en `Docs/REVISIONES/REV-24-pulida-jugabilidad/`.
> - **R1, CompletÃ¡ la letra (`T-532`)**: los distractores de los listos se eligieron a mano para que suenen a la palabra (misma
>   clase, nÃºmero, gÃ©nero, sÃ­labas, rima): `src/data/letra-distractores.json`, que manda sobre `generar-letra.mjs` (una corrida
>   ya no la pisa; sin curar o con `baja`, el verso queda en borrador). **69 listos** (piso de `US-03`: 15); bajaron `CL-274`,
>   `CL-1158` y `CL-1213` (la respuesta se completaba sola). Una ronda ya no trae dos versos del mismo tema (`armarRonda` con
>   `grupo`; el quiz sin cambios, medido en 6000 rondas idÃ©nticas).
> - **R2, AdivinÃ¡ el tema (`T-533`)**: cada corte arranca en su primer sonido real (âˆ’30 dB; `inicioSeg` en el manifiesto v3,
>   medido con `npm run medir-fragmentos`, envolventes en el repo y test que las recalcula). **88 temas en el sorteo**: salen
>   `sheriff`, `susanita`, `criminal-mambo`, `murga-de-la-virgencita`, `gualicho`, `el-lobo-caido` y `dr-saturno` hasta que se
>   recorten de los masters. El sexto paso es **"el resto"** (desde el arranque, igual para todos). "PasÃ¡ (+0,4 s)" pasÃ³ a "Dame
>   0,4 s mÃ¡s"; el que no puede poner sonido tiene una salida a *AdivinÃ¡ la tapa*, tocable (48 px).
> - **R3, lector de pantalla y doble toque (`T-534`)**, cortado para no chocar con `pulida/juegos-ui` (rama **local** de otra
>   sesiÃ³n que rediseÃ±a las cuatro `partida-*.ts` y **ya trae** `role="status"` en el acierto/error de letra y tapa y el hueco de
>   la letra leÃ­do "falta una palabra": eso no se hizo acÃ¡). EntrÃ³: los 10 recortes de *AdivinÃ¡ la tapa* con descripciÃ³n para quien
>   no ve, sin nombrar el disco (`CTR-05` v2, test que falla si regala el tÃ­tulo); la guarda del rebote (`src/lib/sitio/rebote.ts`:
>   400 ms sin clic de puntero sobre las opciones nuevas en quiz y tapa; teclado y lector pasan siempre), y el tema que anuncia el
>   errado y la revelaciÃ³n (`anunciar.ts`). Enganches en las islas: 2, 3 y 6 lÃ­neas. El crÃ­tico fresco probÃ³ el rebote a 50, 300 y
>   500 ms; corregido despuÃ©s `TP-008` ("pelaje" empujaba al lobo). **Hasta que entre `pulida/juegos-ui`, la tapa y la letra
>   siguen sin anunciar el acierto en esta rama.** Al fusionar las dos: choques triviales en `partida-tapa.ts` (el alt, y la lista
>   se llama `listaEl` allÃ¡) y en el `append` de `partida.ts`; los tests de enganche fallan si se pierde alguna lÃ­nea.
> - **Descartado, con el porquÃ©**: los distractores sinÃ³nimos (*toalla* por *esponja*, *aguantar* por *soportar*) **se quedan**:
>   engaÃ±an al que no sabe y nunca al que sabe. Medido: ningÃºn distractor se canta en el mismo tema despuÃ©s de las mismas palabras.
> - **Verde:** `npm test` 2689 con **1 rojo ajeno** (`D-91/t6` de `aire.test.ts`, del bestiario: falla igual en `main`), `astro
>   check` 0 errores, `astro build` 200 pÃ¡ginas. Visto a 375 px en la vista previa; **no oÃ­do en un telÃ©fono**.
> - **Para sus dueÃ±os**: Montevideo 1989/1990 (`TP-005` contra `QZ-066`), `TP-010` y `QZ-053` en
>   `Docs/SUGERENCIAS/HILO-para-investigador-y-contenido-pulida-jugabilidad.md`; CTR-03 v3 y la curadurÃ­a de letra, en sus
>   `HILO-` para `arquitectura` y `contenido`. **Falta un `D-`** que registre "el resto" y la curadurÃ­a que manda sobre el generador.
> - **El top 5 que queda**, en orden: (1) el foco al cambiar de pantalla en letra, tapa y tema (queda en BODY y el lector pierde el
>   lugar), mejor hecho **sobre** `pulida/juegos-ui` una vez integrada; (2) `T-535` los molinetes del que llega sin idea ("Te falta escuchar
>   disco", las fÃ¡ciles que no lo son, el tiempo en grande en el resultado del tema, una salida visible en cada partida); (3)
>   `T-536` el que vuelve: preferir lo no visto, guardado en el navegador; (4) ganancia por fragmento (hay 15 dB entre temas;
>   rescata `dr-saturno`); (5) el "EscuchÃ¡" que queda en â–¶ sin texto al enfocar el buscador (toca `juego.css`, que otra sesiÃ³n
>   tiene abierto en `pulida/juegos-ui`).

> ## ðŸ”¦ EL BESTIARIO, REGIÃ“N POR REGIÃ“N, Y EL PLANO CON SUS TÃTERES (2026-11-17) â€” `D-91`, `T-530`
>
> **Sin integrar**: rama `worktree-bestiario-tres-ambientes`, sobre `main` en `57bdae8` (con `main` fusionado en `bea8712`). Pedido
> del usuario: *"hacer las vueltas en 3 ambientes mÃ¡ximo [...] pulirlos al mÃ¡ximo y luego pasar a otros tres"* y *"pasa a otro
> entorno [...] hasta que hayan sido auditados todos al menos 1 vez"*. ConstruyÃ³ Fable; el hilo principal auditÃ³ cada vuelta con
> capturas antes y despuÃ©s.
>
> - **Las trece regiones pasaron al menos una vuelta**, de a tres: monte, pastura y ruta (4 vueltas); galpÃ³n, infierno y mesa (5);
>   astilleros, Cybersiberia y Ã¡rbol (4); techos, bajo y templo (3); la prisiÃ³n (2). El velo de llegada ahora sÃ­ es carga.
> - **El plano** (4 vueltas): dos tÃ­teres por zona (*"maximo 2"*, pedido del usuario), los trece protagonistas redibujados en cartÃ³n
>   recortado con pose propia, nubes solo por el borde, la llegada en una lÃ­nea y el contador, y el cielo que se cierra al tocar una regiÃ³n.
> - **No toca lo de `T-529`** (rama `claude/bestiario-rocambole-3238c6`): ni los recintos que esa rama reescribiÃ³ ni `figuras.ts`.
>   Tests afirman que los lugares de sus tÃ­teres siguen libres. Cuando se integre, reimprimir sus pisos y mirar los tÃ­teres contra lo nuevo.
> - **Memoria** de imÃ¡genes, contra `main`: entre +1,0 % (Cybersiberia) y +13,1 % (el plano); techo propio +20 %.
> - **Verde:** `npm test` 2523, `astro check` 0 errores, `astro build` 200 pÃ¡ginas.
> - **Visto en capturas, no en un telÃ©fono real.** Falta: las trece segundas figuras del plano, el cierre de nubes visto con un toque
>   real, una mediciÃ³n de cuadros con la PC tranquila (el control casi nunca cayÃ³ en banda).

> ## ðŸŽª DIEZ ROCAMBOLESCAS: OPUS PLANIFICA Y CRITICA, FABLE DIBUJA (2026-11-16) â€” `D-73` enmienda 29, `T-529`
>
> **Sin integrar**: rama `claude/bestiario-rocambole-3238c6`, sobre `main` en `57bdae8`, PR abierto. Pedido del usuario: *"Hace otra
> sesion de diseÃ±o de bestias con opus como planificador y criticdor y fable como diseÃ±ador. Que sea bien creativo y rocambolesco."*
> Diez que eran ojos o una cosa pintada pasan a tÃ­tere: la **fiera mÃ¡s fiera** (no se dibuja: un collar de pÃºas flotando en la jaula
> abierta) y el **pajarito del Lavi-rap** (flaco, pelado, con el precio mÃ¡s grande que Ã©l) en la prisiÃ³n; el **perro manso** (xilofÃ³n
> de costillas numeradas) y el **gato que llamÃ¡s con silbidos** (linyera en una seÃ±al de tren) en los techos; el **Ã¡ngel guardiÃ¡n**
> (la lona tendida mirando una percha vacÃ­a) en el Ã¡rbol; los **camellos prestigiosos** (venden nieve en la nieve) en Cybersiberia;
> el **as del Club ParÃ­s** (un naipe que cabe en la valija) en los astilleros; el **Sheriff** (tiro al blanco sin AlÃ­ BabÃ¡) en el
> templo; los **nenes de oro** (dos trofeos de nataciÃ³n) en el bajo, y el **animal que no late** (embalsamado con una radio en el
> pecho) en el monte.
>
> - El hilo principal (Opus) eligiÃ³, encargÃ³, pidiÃ³ dos o tres ideas por bestia, eligiÃ³ la mÃ¡s fuerte y criticÃ³ a PNG en dos vueltas.
>   Tres subagentes Fable dibujaron, animaron e imprimieron. Lo compartido lo integrÃ³ el hilo principal.
> - Se reimprimieron `prision-lejos`, `arbol-piso`, `arbol-lejos`, `cyber-piso`, `astillero-piso` y sus caminos. Del monte no se
>   reimprimiÃ³ nada: lo estÃ¡ rehaciendo otra sesiÃ³n (`D-91`, `T-530`).
> - **Visto**: cada una a PNG de cerca, en su recinto, en el camino y en la tira del toque, y las diez en el HTML armado con todas sus
>   piezas. **No visto**: vivas en el navegador (el panel quedÃ³ trabado) ni en un telÃ©fono de verdad.
> - **Verde:** `npm test` 2537, `npm run check` 0 errores, `npm run build` 200 pÃ¡ginas. `elenco.test.ts` pasa de 70 a 80.
> - **Falta** (`T-529`): mirarlas vivas y en un telÃ©fono, que `contenido` lea las diez estampas, las tintas al lienzo, el roce del tren
>   del gato con el Atila, los nenes chicos en el bajo. `prision-jaula.webp` y `prision-puerta.webp`, sin uso, se borraron con el OK del usuario.

> ## ðŸ§¨ DOS REELS DE TÃTERES QUE JUEGAN (2026-11-16) â€” `D-81`
>
> **Integrada en `main` el 2026-11-16** (PR #115, commit de fusiÃ³n `bea8712`), desde la rama `difusion/reels-titeres`, sobre `main` en `57bdae8`. Pedido del usuario: *"videos de difusion que utilicen
> las marionetas y fondos del bestiario pero con una historia [...] mostrar el juego de adivinar el tema con alguna marioneta jugando,
> errando y festejando"*, *"sin mostrar los nombres se entiendan que bestias son"* y *"armar un video de 0 con esos diseÃ±os"*.
>
> - **`DIF-16`, La mecha corta** (`public/redes/DIF-16.mp4`, 21 s): el perro de la mecha juega a AdivinÃ¡ el tema en el baldÃ­o; cada
>   error le quema un pedazo de cola, acierta *Juguetes perdidos* a los 2 s, explota de contento, vuelve tiznado y aÃºlla.
> - **`DIF-17`, El duelo** (`public/redes/DIF-17.mp4`, 20,5 s): el lobo se asoma detrÃ¡s del monte y erra dos veces de apurado; el
>   cordero cierra los ojos, saca *Todo un palo* a los 2 s, se le corta la soga y se va saltando. Los intentos llevan la cara de cada uno.
> - **CÃ³mo**: no se graba el sitio. `npm run reels -- mecha|duelo DIF-XX` compone de cero con las piezas impresas (`public/bestiario/`)
>   y las poses de los propios rigs (`marcas()` de `rig-dinamita.ts`, `explosion()` de la conducta, `lobo()`/`cordero()` de
>   `titeres.ts`). La pantalla del juego es `scripts/reels/juego.mjs`; los ruidos (teclas, "no era", acierto, estallido, soga) los hace
>   ffmpeg. `grabar({ local: true })` sirve todo desde `public/`: **no hace falta `astro dev`**, solo `NAVEGADOR` y `FFMPEG`.
> - NingÃºn cartel nombra a los bichos; el rÃ³tulo DINAMITA de los cartuchos es del dibujo y queda.
> - **Pulida** (pedido del usuario: *"al final el perro dinamita cambia de modelo raro"*, *"que parezca de un celular"*): al terminar la
>   explosiÃ³n la pose ya no vuelve de golpe a la de antes (la mecha corta y prendida y el tizne que se borraba en un cuadro); queda
>   entera, apagada y con el tizne yÃ©ndose. El tipeo es de telÃ©fono: ritmo con tropiezos, unas letras y el toque en la sugerencia
>   que se abre arriba de la caja, y un tic de teclado por letra en tres alturas, mÃ¡s el de la sugerencia y el del botÃ³n.
> - **Calendario**: `DIF-16` (19/11) y `DIF-17` (21/11) en borrador; `redes validar` OK. **Verde:** `npm test` 2470, `npm run check`.
> - **Falta**: el visto bueno del usuario a los videos y los textos, y subirlos a mano (la cola no sube video).

> ## ðŸ‘ DIEZ BESTIAS MÃS EN EL ELENCO (2026-11-13) â€” `D-73` enmienda 28, `T-528`
>
> **Integrada en `main` el 2026-11-14** (PR #112, commit de fusiÃ³n `3f2f872`), desde la rama `claude/bestiario-diez-ffa47e`, sobre `main` en `8b0d80a`. Pedido del usuario: *"Volve a
> arrancar otra sesion de al menos 10 bestias nuevas."* Diez que eran ojos en lo oscuro o una cosa pintada pasan a tÃ­tere, una por
> regiÃ³n, empezando por el galpÃ³n: la **fuente de buÃ±uelos** (el galpÃ³n), el **hÃ©roe del whisky** (la ruta, viaja en el trÃ¡nsito en
> lugar de la imagen del camiÃ³n), el **rebaÃ±o** (la pastura), el **angelito frito** (el Ã¡rbol), las **almejas** (los astilleros), el
> **lobo caÃ­do** (el monte), **Mister Ed y Huesito** (el templo), los **buitres de la tele** (Cybersiberia), la **hormiga dormida**
> (la mesa) y los **nÃ¡ufragos** (el bajo). Quedaron afuera el infierno, la prisiÃ³n y los techos.
>
> - Las dibujaron tres subagentes Sonnet a la vez en el mismo worktree, con un encargo comÃºn; el hilo principal auditÃ³ sus capturas y
>   devolviÃ³ una segunda vuelta a cada uno (el lobo caÃ­do parecÃ­a una rata, la hormiga una araÃ±a, los buitres flotaban, entre otras).
> - Se sacaron sus siluetas de los pisos y se reimprimieron galpÃ³n, Ã¡rbol, astilleros, Cybersiberia y mesa, con su camino. En el
>   templo, Mister Ed ocupaba el hueco de las velas: se corrieron los ojos de la bailarina y la tanda de adelante en `ofrendas.ts`.
> - **Visto**: las diez, vivas en el sitio armado, en su tramo del camino, en el telÃ©fono emulado (430Ã—860); cada una a PNG de
>   cerca, en el recinto y en la tira del toque. **No visto**: en un telÃ©fono de verdad, ni el toque de cada una en el navegador.
> - **Verde:** `npm test` 2470, `npm run check` 0 errores, `npm run build` 200 pÃ¡ginas. `elenco.test.ts` pasa de 60 a 70.
> - **Falta** (`T-528`): un telÃ©fono de verdad, que `contenido` lea las diez estampas, los diez bloques de tintas al lienzo, el torso
>   del hÃ©roe, sumarlas a `mirada.ts` y los vecinos que reaccionan al toque ajeno.

> ## ðŸ”€ OCHO PR A `main`, POR CADENA (2026-11-13)
>
> Pedido del usuario: *"mete todo a main."* Entraron los ocho PR abiertos, siguiendo `.claude/rules/integrar.md`:
>
> - **Portal y juegos**: el #105 apuntaba a la rama del #104, y el #104 a la del #100. Se fusionÃ³ `main` en la punta
>   (`116ab89`, choques de `ESTADO.md` y `DECISIONES.md`, quedaron los dos lados), entrÃ³ el #105 a su base, el #104 a `main`
>   (`390223d`) y GitHub cerrÃ³ el #100 como fusionado.
> - **Bestiario**: el #109 y el #110 apuntaban a la rama del #108. Chocaban en `sitio.css` (quedaron las dos tandas de
>   reglas) y en tres pisos impresos, que se reimprimieron con `imprimir-bestiario --solo` sobre el cÃ³digo junto. Entraron
>   el #109 y el #110 a su base y el #108 a `main` (`34e2d48`).
> - **Los #101 y #103**, solo de `ESTADO.md`, con `main` adentro (`5665517`).
> - **Verde** en cada punta: 2272 y 2398 tests, `check` y `build`. Checks de Vercel en verde en cada PR.
> - **Falta**: mirar en un telÃ©fono los tres pisos reimpresos, que juntan dos rondas distintas por primera vez.

> ## ðŸŒ«ï¸ EL BESTIARIO CON MÃšSCULO: RESUMEN DE LAS OCHO RONDAS (2026-11-13) â€” `D-90`, `T-527`
>
> **En `main` el 2026-11-13**: el PR #110 entrÃ³ a la rama del #108 (fusiÃ³n `a26a495`) y el #108 a `main` (`34e2d48`). Rama `bestiario/inmersion`, cortada de `bestiario/cinco-sin-diseno` (PR #108) en
> `9fa0b93`. Pedido del usuario: *"busca cosas que no se vean bien, ambientes mejorables y diseÃ±os que se puedan mejorar [...] Quiero
> mejorar la inmersiÃ³n. Que se pueda hacer zoom, que tenga mÃ¡s misterio y efectos, nieblas, mejores animaciones, una mejora total
> manteniendo la esencia y el alma y el diseÃ±o rocambolesco ante todo, pero darle mÃºsculo."* Se hizo en ocho rondas, cada una
> auditada. Todo lo soplado se imprime (`scripts/imprimir-bestiario.mjs`): el telÃ©fono solo mueve imÃ¡genes con `transform` y `opacity`.
>
> **QuÃ© cambiÃ³**
>
> - **El aire, en las trece regiones** (`lib/bestiario/aire.ts`, `arte-aire.ts`): capas impresas entre las del camino. La bruma de
>   atrÃ¡s del piso, la niebla del medio (de **jirones rasgados**, ninguno mÃ¡s ancho que un telÃ©fono, y que **se abre al paso**) y lo
>   pegado a la cÃ¡mara fuera de foco. Cada regiÃ³n con **la mano de su tapa**: aerÃ³grafo con grano, crayÃ³n en el bajo y los techos,
>   gubia en la prisiÃ³n, tinta plana en la mesa. Ropa tendida en los techos, barrotes limados en la prisiÃ³n, ceniza en el infierno,
>   nevisca en Cybersiberia, hojas en el Ã¡rbol, y en el templo las ofrendas en el piso: velas en dos filas, platitos y flores, puestas en los huecos entre los bichos segÃºn los datos de la escena (rondas 6 a 8).
> - **La lupa** (`lib/bestiario/lupa.ts`, `scripts/bestiario/pellizco.ts`): pellizco, Ctrl + ruedita, doble toque, `+` `âˆ’` `0` y dos
>   sellos donde hay mouse, en los trece caminos y en el plano. Tope 2,6; la vuelta es **"MirÃ¡ todo"**. Caminar sigue siendo el scroll
>   del navegador (`D-77`) y el toque que abre la ficha (`T-522`) no cambia.
> - **El piso ya no es liso** (`arte-suelo.ts`, en el monte, la pastura, Cybersiberia, los astilleros, la ruta y, desde la ronda 6,
>   el Ã¡rbol, la mesa y el galpÃ³n): charcos que reflejan
>   roto lo de atrÃ¡s, raÃ­ces, piedras, costillares, hielo, chapas, cadenas, latas. Todo apoyado (mancha, tierra, distancia) y en
>   escorzo. Se imprime adentro del piso: no son capas.
> - **La luz** (`LUCES`): una forma impresa por regiÃ³n que se mueve. El cono de sodio de los astilleros, la brasa del infierno, el haz
>   de la cÃ¡mara de Cybersiberia, los faros del bondi, el reflejo del pucho de Pierre, el farol de los techos, el reflector de la
>   prisiÃ³n, un foco del templo y el seguidor del galpÃ³n. El haz ya no es de regla: canto cortado a mano y vetas adentro (ronda 6). En los
>   astilleros, la prisiÃ³n y los techos **toca a los bichos**: desde la ronda 6 les prende **el canto de cada pieza**, impreso (82
>   imÃ¡genes `filo-de-*`); la medialuna genÃ©rica queda para los pintados en el piso. En la ronda 7 se engrosÃ³ y en la prisiÃ³n pasÃ³ al
>   rojo de las banderas: la drÃ¡cula se ve prendida, clara. En los astilleros el cono se inclinÃ³ y cruza al botija, cuyo canto va en tiza
>   clara (ronda 8): de cerca se distingue, a tamaÃ±o de telÃ©fono es un hilo.
> - **El misterio**: los **ojos sin dueÃ±o** (`ACECHOS`) se abren si te quedÃ¡s quieto cinco o seis segundos y se apagan si los mirÃ¡s;
>   y lejos, muy cada tanto, **cruza algo** (`VIDAS`): un pÃ¡jaro, un murciÃ©lago, una estrella, un barquito de papel.
> - **Los tÃ­teres miran** (`scripts/bestiario/mirada.ts`): el lobo suelto (en el monte y en la pastura), las lobas, Pierre, Momo y
>   Luzbelito saben dÃ³nde estÃ¡ el dedo o el mouse, respiran con peso, y lo que cuelga llega despuÃ©s. Desde la ronda 6 tambiÃ©n
>   Barbazul, la drÃ¡cula y LimÃ³n.
> - **El aire suena** (`entorno.ts`): viento con la ventisca y con la racha, el zumbido del tubo que titila, el chisporroteo de la
>   brasa. Bajito y con el botÃ³n de siempre.
> - **La tiza**: el aro punteado amarillo del bicho que habla es una vuelta de tiza irregular; el foco del teclado, la misma en oro.
> - **Rendimiento**: Cybersiberia andaba a 12 cuadros por segundo con la CPU Ã—4 por una animaciÃ³n previa adentro del piso (la
>   nevada); mudada a capa, alrededor de 50. Las capas se pintan una vez por cuadro; lo que no se ve no se mueve (el elenco y los
>   tÃ­teres grandes); y hay un **alivio** que apaga la bruma de atrÃ¡s y despuÃ©s la luz si los cuadros vienen lentos (`?liviano=1` o
>   `2` lo fuerza para mirarlo).
> - **El velo de llegada** (ronda 8, `lib/bestiario/velos.ts`): cada regiÃ³n, y el plano, llega tapada por una hoja impresa con su firma
>   (la niebla del monte, la reja de la prisiÃ³n que se corre, el telÃ³n del galpÃ³n, el agua del bajo que baja) y la hoja se va en 900 ms.
>   Es CSS solo, sin JavaScript (`ADR-03`), no frena el toque, y con movimiento reducido es un corte. No espera a que la regiÃ³n
>   termine de cargar: es un tiempo fijo. Visto en el telÃ©fono emulado y en una navegaciÃ³n de verdad; no en un telÃ©fono ni con red lenta.
> - **Los techos sin ahogar** (ronda 7): lo que tapaba todo eran los rayones de crayÃ³n del telÃ³n del recinto, previos a esta rama
>   (`baldio-lejos`). QuedÃ³ menos de la mitad, y solo apretados alrededor de los faroles.
> - **Arreglos encontrados auditando**: el halo del camello, las losas del monte, el pie del farol, el horizonte de cinta del monte,
>   los techos. Un test mide en la imagen impresa que nada de adelante tape mÃ¡s de un quinto del alto.
>
> **Verde:** `npm test` 2350 (los 2294 de antes y 56 nuevos: 4 de `velos.test.ts`, 37 de `aire.test.ts`, 10 de `lupa.test.ts`, 5 de `mirada.test.ts`),
> `npm run check` 0 errores, `npm run build` 200 pÃ¡ginas. Dos tests anteriores cambiaron a propÃ³sito: el tope de peso del aire por regiÃ³n subiÃ³ de 520 a 560 kB
> (ronda 3) y el test de la losa del monte pasÃ³ a ser el tope del quinto para todas las regiones (ronda 4). Medido con la CPU Ã—4 en Edge sin
> ventana: el monte, 9,9 ms de hilo principal y 60 cuadros por segundo; Cybersiberia, entre 12,7 y 15,4 ms y unos 50. En la ronda 6
> cambiaron otros cuatro tests a propÃ³sito (la nevada, el tope de filos, la cuenta de miradas, el incienso; detalle en `D-90`), y
> Cybersiberia se volviÃ³ a medir tres veces con la mÃ¡quina cargada: mediana 21,0 ms, contra 15,4 de la escena pelada ese mismo dÃ­a.
>
> **QuÃ© falta**
>
> - **Un telÃ©fono de verdad.** Todo se mirÃ³ en Edge sin ventana, con dedos emulados. Sin probar: el pellizco en **iOS**, la mirada
>   con el dedo, si el alivio se dispara solo cuando tiene que, y cuÃ¡nto le cuesta todo a un equipo flojo.
> - **Escucharlo.** El sonido del aire se escribiÃ³ y se probÃ³ que no rompe, pero no se escuchÃ³: hay que ajustarlo de oÃ­do.
> - **El lienzo de marca.** Nada de esto estÃ¡ pegado en el lienzo. La lista de lo que hay que pasar (24 puntos, de las cinco rondas)
>   estÃ¡ en `Docs/SUGERENCIAS/lienzo-el-aire-y-la-lupa.md`. No hay tintas nuevas en `tokens.css`.
> - **Cybersiberia no bajÃ³ de 12 ms** con la CPU Ã—4. En la ronda 6 se fundieron la nevada y la ventisca en una capa y la regiÃ³n
>   arranca en alivio 1: no alcanzÃ³ (mediana 21,0 ms, mÃ¡quina cargada). Lo que cuesta es la nieve de pantalla entera. No se toca mÃ¡s hasta
>   medir en un telÃ©fono; quÃ© hacer si ahÃ­ pasa de 16 ms estÃ¡ escrito en `D-90`, sÃ©ptima enmienda.
> - **El templo, sin medir bien.** Con la CPU Ã—4 gastaba 1,4 veces lo que el monte; se le sacÃ³ el humo que bajaba y quedÃ³ en 1,1,
>   pero las dos tandas se midieron con la mÃ¡quina cargada. Falta medirlo con la mÃ¡quina libre.
> - **Lo que frenÃ³ a un reciÃ©n llegado** (paseo de la ronda 8, sin arreglar; lista en `D-90`): el mapa empieza debajo del pliegue, las
>   zonas del oeste del plano se pisan al tocar, la primera pantalla del monte y la pastura no tiene bichos, Â«Al planoÂ» mide 35 de alto,
>   y con la lupa al mÃ¡ximo la imagen se ve blanda.
> - **El doble toque** ahora tiene 520 ms y 44 px y cuenta desde que se apoya el dedo: seis de seis con la mÃ¡quina cargada, emulado.
> - Un segundo tamaÃ±o impreso para la lupa; atar los ojos a una mata de adelante.
> - Integrada con el #109: los tres pisos que las dos ramas reimprimÃ­an (`astillero-piso`, `camino-astillero-piso`,
>   `camino-ruta-piso`) se volvieron a imprimir con el cÃ³digo junto. Detalle y nÃºmeros en `D-90` y sus siete enmiendas.

> ## ðŸ¸ CINCO MÃS, DIBUJADOS POR UN FABLE Y AUDITADOS: LA RANA RUBIA, EL BORREGO, LA LIEBRE MUERTA, EL TAXI PARANORMAL Y EL POLIZÃ“N (2026-11-13) â€” `D-73` (27)
>
> **En `main` el 2026-11-13**: PR #109 a la rama del #108 (fusiÃ³n `a0656f4`) y de ahÃ­ a `main` con el #108 (`34e2d48`). Rama
> `bestiario/cinco-de-fable`, sobre `bestiario/cinco-sin-diseno`. Pedido del usuario: que el hilo principal elija bestias sin diseÃ±o (*"al menos 5"*), se las encargue a un
> Fable con libertad para ser rocambolesco, critique lo que vuelve y se lo devuelva. Una por regiÃ³n flaca y sin repetir bicho.
>
> - **La rana rubia** (astilleros): peluca, reposera y reflector de papel de aluminio, toma sol de noche; tocada croa y se come la mosca.
> - **El borrego** (pastura): el vellÃ³n es un disfraz con cierre; tocado "caen los disfraces" y quedan los cortes del carnicero a puntos.
> - **La liebre muerta** (monte, mudada al borde de abajo del claro): se hace la muerta y le sale mal; tocada se pone tiesa.
> - **El taxi paranormal** (ruta, capa `delante`): volcado, negro y amarillo, el cartel al revÃ©s, el diablo colgando del baÃºl; tocado levita.
> - **El polizÃ³n del remolque** (bajo): el bote con corona de muerto; a oscuras es una sombra con dos ojos; tocado lo destapan.
> - **Dos vueltas**: la auditorÃ­a sobre las tiras de seis cuadros pidiÃ³ cinco arreglos (el taxi no se leÃ­a, la cabeza del polizÃ³n
>   flotaba fuera del casco, al borrego se le abrÃ­a la nuca, los anteojos de la rana eran una mata, la oreja de la liebre un cuerno).
> - **Lo aprendido quedÃ³ escrito** en `.claude/rules/bestiario-bestias.md` (flexible, maÃ±as con su caso, tambiÃ©n para mejorar las ya
>   hechas). Es la Â§13 pendiente de `bestiario-inmersion.md`, que vive sin commitear en la rama `bestiario/inmersion` (`D-90`): al
>   integrar las dos, esa Â§13 pasa a apuntar acÃ¡.
> - **Verde** (corrido por el hilo principal): `npm test` (2329 de 2329), `npm run check` (0 errores, 0 avisos), `npm run build` (200 pÃ¡ginas).
> - **Falta**: verlos en el navegador y en un telÃ©fono (solo se miraron en PNG); bajar las matas de `camino-ruta-frente` en el tramo
>   del taxi; vecinos que reaccionan; sumarlos a `mirada.ts`; que `contenido` lea las cinco estampas; pasar las tintas al lienzo.

> ## ðŸ• CINCO QUE SEGUÃAN SIN DISEÃ‘O: EL REY GARUFA, EL JOVEN LOBO, EL REO SEMENTAL, EL MOSCÃ“N ZUMBÃ“N Y EL OVEJERO (2026-11-05) â€” `D-73` (26), `T-526`
>
> **En `main` el 2026-11-13** por el PR #108 (fusiÃ³n `34e2d48`), rama `bestiario/cinco-sin-diseno`, sobre `main` en `9fe6a91`. Pedido del usuario: *"Elegi 5 bestias ricoteras sin
> diseÃ±os y haceles uno bien rocambolesco con su animacion y detalles de la letra. Que sea bien detallado y pulido."* Se eligiÃ³ una
> por regiÃ³n flaca de tÃ­teres, empezando por la pastura, que no tenÃ­a ninguno del elenco.
>
> - **Cybersiberia**: el Rey Garufa, el fiestero con el frac de la noche anterior, la corona de lata y el corazÃ³n de verdad entre las
>   manos, que late y gotea; vaga por la nieve siguiendo sus huellas y, tocado, lo ofrece. Su silueta saliÃ³ de `cyberPiso()`.
> - **Monte**: el joven lobo, sentado en el crÃ¡ter de un volcÃ¡n chico, quemÃ¡ndose de adentro: la brasa en el pecho, llamas en el lomo,
>   la cola que humea; tocado se yergue, aÃºlla, el volcÃ¡n hace erupciÃ³n y le sube un corazÃ³n de humo. En el camino baja 116 con el volcÃ¡n.
> - **PrisiÃ³n**: el reo semental en la celda grande de la izquierda, agarrado a la reja, un toro de preso que suda; tocado se licÃºa
>   entero, baja con los puÃ±os en los barrotes, queda hecho un charco a rayas con los ojos flotando y se vuelve a armar.
> - **Mesa**: el moscÃ³n zumbÃ³n, el vaso boca abajo del piso hecho tÃ­tere, con el moscÃ³n adentro que nunca sale del vidrio; tocado se
>   vuelve loco, le pega al vaso, lo empaÃ±a, cae de espaldas y patalea. El vaso saliÃ³ de `mesaPiso()`.
> - **Pastura**: el ovejero, echado en un manto negro con el rayado a pluma de *Un baiÃ³n*, el plato con los restos que no tocÃ³ y el ojo
>   en el cordero; tocado se para, se eriza, ladra tres veces y patea el plato. **La pastura entra al elenco**: sus capas se dibujan en
>   el recinto del monte y en el claro del camino.
> - Cinco bloques de tintas medidas en su tapa (`tokens.css`), cinco en `sitio.css`, cinco conductas, cinco tests de 7, estampas
>   nuevas en `bestiario.json`, `elenco.test.ts` de 50 a 55. Detalle en `D-73` (26).
> - **Verde:** `npm test` (2294), `npm run check`, `npm run build` (200 pÃ¡ginas). Cada uno mirado a PNG en su recinto y en su tramo
>   del camino (visor del scratchpad: la escena entera con sharp), y la pÃ¡gina construida de Cybersiberia carga las piezas sin un
>   error de consola.
> - **Falta**: verlos en un telÃ©fono de verdad; que `contenido` lea las cinco estampas; pasar las tintas al lienzo (`T-526`).

> ## ðŸŽ›ï¸ LAS DOS CINTAS Y CUATRO TABLEROS: UNA PASADA DE UI/UX AL PORTAL Y A LOS PRIMEROS JUEGOS (2026-11-04)
>
> **En `main` el 2026-11-13**: PR #105 a la rama del #104 (fusiÃ³n `80e1ea3`) y de ahÃ­ a `main` con el #104 (`390223d`). Rama
> `ui/home-y-cuatro-juegos`, encima de `modo/ultimo-bondi`, porque toca el mismo `index.astro`. Pedido del usuario: *"Hace una mejora
> sustancial de ui/ux de la pagina. El home y los primeros 5 juegos."* Se recorriÃ³ todo a 375 Ã— 812 y a 1280 Ã— 800
> en un navegador de verdad antes de tocar nada, y se midiÃ³ cada cambio. **Skayboy y Poligirl (A4) quedÃ³ afuera a
> propÃ³sito:** otra sesiÃ³n lo estaba rehaciendo entero en este mismo checkout (`skayboy/mejora-total`), y dos manos
> sobre un mismo archivo son un choque seguro. Lo que entrÃ³:
>
> - **Las dos cintas del portal** (`index.astro`, `sitio.css`, `PORTAL.cintas`): la bajada decÃ­a "estÃ¡s en la
>   puerta, con las dos cintas" y las dos cintas estaban a pantalla y media de scroll, detrÃ¡s del afiche del mes
>   (el lado A arrancaba en 900 px y el lado B en 1850). Ahora son dos tiras de cinta adhesiva debajo de la bajada
>   â€”LADO A Â· para jugar, LADO B Â· para leerâ€” que saltan a cada lado (`#lado-a`, `#lado-b`). Anclas, sin
>   JavaScript; el afiche sigue donde `D-84` lo puso.
> - **Los casetes, mÃ¡s angostos por los costados**: 10 px de relleno lateral, 10 de corrimiento y 12 en la
>   etiqueta (eran 12, 14 y 16), y el tÃ­tulo con 0,02 em de aire entre letras en vez de 0,05. La columna del tÃ­tulo
>   pasÃ³ de 193 a 213 px y cinco tÃ­tulos que iban en dos renglones entran en uno; quedan en dos "Â¿QuÃ© tipo de
>   ricotero sos?" y "Preguntas ricoteras". La hoja del portal mide 3147 px en vez de 3207 con las cintas puestas.
> - **La marca de las carÃ¡tulas, una sola medida** (`.marca` en `juego.css`): de 36vw a 30vw (113 px a 375), y
>   se sacaron las reglas propias de "AdivinÃ¡ el tema" y "Sacalo por la letra", que venÃ­an del logotipo escrito
>   anterior a `D-82`. La FR salÃ­a de cuatro tamaÃ±os en cuatro juegos. En "Â¿QuÃ© tipo de ricotero sos?" el botÃ³n
>   de empezar bajaba a 1265 px, fuera del pliegue; ahora termina en 633.
> - **"Sacalo por la letra"**: el botÃ³n de la carÃ¡tula dice *JugÃ¡* y no *JUGÃ* (era el Ãºnico de los cuatro en
>   versales). En la partida, el rÃ³tulo y la hoja de versos se centran en la banda (margen automÃ¡tico arriba del
>   rÃ³tulo y abajo de la hoja), la hoja tiene un piso de 8 rem con el verso centrado adentro, y el verso va a
>   1,15 rem: antes el verso terminaba en 140 px y el buscador arrancaba en 650, con negro en el medio. Con ocho
>   versos los mÃ¡rgenes se agotan y la hoja scrollea como antes; el buscador no se moviÃ³ de la zona del pulgar.
> - **"Â¿QuÃ© tipo de ricotero sos?"**: la hoja de la pregunta va centrada en la pantalla del telÃ©fono y la tableta
>   (hasta 52 rem; en la mesa queda arriba), asÃ­ las dos opciones caen en la zona de la mano en vez de entre 250 y
>   370 px. Y en la cabecera de la hoja, **las hojas de la noche**: cinco casillas, una por momento â€”pasada,
>   actual, por venirâ€”, la misma fila que marca los temas en los juegos de audio y de letra (`ejes-noche` en
>   `partida-dos-ejes.ts`, registrada en `estilos.test.ts`).
> - **"CompletÃ¡ la letra"**: de dÃ³nde sale el verso ("De "Jijiji", en Oktubre") va en la letra de lectura, tenue y
>   en su renglÃ³n; iba en versales de rÃ³tulo, en negrita, tres renglones, y gritaba mÃ¡s que la pregunta.
> - **"AdivinÃ¡ el tema"**: solo la marca pareja. Se probÃ³ la partida entera con puntero de verdad (escribir, elegir
>   de la lista, arriesgar) y anda.
> - **Verde:** `npm test` (2239), `npm run check` (0 errores), `npm run build` (200 pÃ¡ginas). Mirado en el navegador a
>   375 Ã— 812 y 1280 Ã— 800.
> - **Falta**: probarlo en un telÃ©fono de verdad (el teclado abierto en "Sacalo por la letra" con la hoja
>   centrada, y las cintas con el dedo); que `experiencia` lea la propuesta en
>   `Docs/SUGERENCIAS/HILO-para-experiencia-las-dos-cintas-y-cuatro-tableros.md` y la lleve a sus hojas
>   (`UX-25`, `UX-08`, `UX-36`); la pasada equivalente sobre Skayboy, cuando cierre `skayboy/mejora-total`.

> ## ðŸŽ® SKAYBOY Y POLIGIRL: DOCE NIVELES, EL MENÃš CON PLANO Y UN CIGARRILLO QUE SE ENTIENDE (2026-11-04) â€” `D-86`, `T-525`
>
> **Integrada en `main` el 2026-11-04** (PR #106, commit de fusiÃ³n `0c3a73d`), desde la rama `skayboy/mejora-total` sobre `main` en `90583d6`. Pedido del usuario: *"Hace una mejora total
> del juego Skay boy y poli girl, mejora el menu, arma mas niveles, basate en los niveles reales de fireboy y water girl.
> Hay que mejorar el cigarrillo de poli, no se entiende del todo bien que es."*
>
> - **El cigarrillo** (`sala.txt`, atlas `sala.v4`): acostado, tubo en luz con contorno, filtro y brasa en la tinta de
>   objetos, humo de clave. Antes era un palito de un pÃ­xel en diagonal.
> - **El menÃº**: cada ficha lleva el plano del nivel en miniatura (`planoDelNivel()`, `menu.ts`, un SVG de 15 Ã— 9 con
>   las tintas del pixel) y la lista dice "Pasaste N de M". La grilla entra de dos a cuatro por renglÃ³n.
> - **Seis niveles nuevos**, `NIV-07` a `NIV-12`, escalÃ³n 3, **`listo`** por decisiÃ³n del usuario (*"Pasalos a listo"*,
>   sin jugarlos de a dos en un telÃ©fono, como en `D-51`): entran a producciÃ³n con el PR. Cada uno tiene su traza de uno
>   grabada (`skayboy-soluciones.json`) con tolerancia de 4 a 30 cuadros; lo que costÃ³ dibujarlos estÃ¡ en `D-86`.
> - **El ensanchador del solucionador** suma tres candidatas (`D-86`); los 30 tests de `solucionador.test.ts` en verde.
> - **Verde:** `npm test`, `npm run check`, `npm run build`. Mirado en el navegador a 375Ã—812 y 1280Ã—800.
> - **Falta**: jugarlos en un telÃ©fono de verdad; que `contenido` ratifique o cambie los seis
>   nombres (`CNT-21` tiene seis, no doce); la hoja del lienzo del cigarrillo nuevo.

> ## ðŸšŒ NOVIEMBRE SE SUBE AL ÃšLTIMO BONDI: EL PRIMER MODO DEL PORTAL (2026-11-02) â€” `D-85`, `T-524`
>
> **En `main` el 2026-11-13** por el PR #104 (fusiÃ³n `390223d`), rama `modo/ultimo-bondi`, encima de `portal/almanaque` (PR #100)
> con `main` adentro. Pedido del usuario: un home en modo *Un baiÃ³n para el
> ojo idiota*, inmersivo como la multitud de *Oktubre*, "el 7 de noviembre". El BaiÃ³n saliÃ³ el 9 de mayo de 1988 (`RES-20`,
> reconfirmado por `investigador`); el usuario eligiÃ³ *"Ãšltimo bondi, sin HuracÃ¡n"*.
>
> - **El afiche de noviembre es *Ãšltimo bondi*** (18-nov-1998): estampa "EL 18 CUMPLE 28", sello ÃšLTIMO BONDI como la chapita
>   de la tapa, *"Agarrate del pasamanos, que arranca."*, botÃ³n ADIVINÃ TEMAS DEL BONDI. Reemplaza al HURACÃN de `D-84`, y las
>   noches del 93 salen del almanaque de noviembre (`fuera`).
> - **El modo**: el ojo de buey de la tapa cuelga del afiche (cortado del master, el vidrio se corre al bajar), los tacos son
>   boletos picados, la chapa de la nave (`.casco`, `lib/sitio/casco.ts`) reemplaza a la multitud detrÃ¡s de todo y avanza al
>   bajar, y al final de la hoja espera "ÃšLTIMA PARADA Â· FINISTERRE".
> - **Verde:** `npm test` (2239), `npm run check`, `npm run build` (200 pÃ¡ginas). Mirado en el navegador a 375Ã—812 y 1280Ã—800.
> - **Falta**: la hoja del lienzo (la 18 todavÃ­a muestra HURACÃN), probarlo en un telÃ©fono de verdad, y el modo BaiÃ³n para mayo
>   (`T-521`): el boceto quedÃ³ en la rama local `modo/baion-ojo-idiota`.
> ## ðŸ’ EL BESTIARIO: LA TIERRA DEL REY Y LA COLA DEL MONITO (2026-10-30) â€” `T-523`
>
> **En `main`** por el PR #102 (fusiÃ³n `90583d6`), rama `bestiario/ux-navegar`, encima de `T-522`. Lo integrÃ³ Claude a pedido del usuario (*"SÃ­, integralo"*), con `main` sin moverse desde la rama y todo verde. Pedido del usuario: *"otra corrida de pulida,
> enfocandote en retoques en los diseÃ±os y animaciones, por ejemplo que el rey de esta jungla la pila de tierra salga del
> piso, que al monito no se le separe la cola del cuerpo al subir, cosas asi"*. Se filmaron los 60 tÃ­teres de las trece
> regiones cuadro por cuadro, quietos y tocados (Edge sin ventana, una hoja por regiÃ³n), y de cerca los mÃ¡s articulados.
>
> - **El rey flotaba** en el camino del monte: los tÃ­teres venÃ­an con la altura de la ladera del recinto (pie en y 278) y
>   el borde del piso del camino estÃ¡ en y â‰ˆ 305, asÃ­ que el montÃ­culo quedaba delante de los troncos, sin tierra abajo.
>   Ahora cada tramo largo puede bajar a sus tÃ­teres (`bajan` en `camino.ts`, `dyDe` en `capasCorridas`): el rey 62, tu
>   animal 56 y las lobas 30. El montÃ­culo sale del piso y tu animal camina sobre Ã©l. En el plano no cambia nada: ahÃ­ la
>   ladera es la del dibujo.
> - **La cola del monito se despegaba**: iba dibujada encima del lomo, y al levantarla para trepar su raÃ­z quedaba como
>   un cabo suelto pegado a la espalda. Ahora va entre el culo y el lomo (`arte-monito.ts`): tapa el culo y nace debajo
>   del pelo. Levantada gira âˆ’116Â° (antes âˆ’138Â°, que la escondÃ­a entera detrÃ¡s de la espalda) y el rulo âˆ’40Â°: asoma por el
>   flanco haciendo equilibrio.
> - **Revisado y dejado como estÃ¡** (es del diseÃ±o): la correa de tu animal que se va al cielo, el cable rosa del telÃ©fono
>   de la hija del fletero que se mete en el agua, el lobo suelto que asoma de lo oscuro con el borde soplado, el jocker
>   que se vuelve carta.
> - **Verde:** `npm test` (2226, uno nuevo en `camino.test.ts` y uno en `monito.test.ts`), `npm run check`, `npm run build`
>   (200 pÃ¡ginas). Tocados de nuevo el rey, tu animal, las lobas y el monito: abren su ficha.
> - **Falta**: probarlo en un telÃ©fono de verdad.

> ## ðŸ§­ EL BESTIARIO: QUE SE PUEDA TOCAR A TODOS (2026-10-30) â€” `T-522`
>
> **En `main`** por el PR #102 (fusiÃ³n `90583d6`), rama `bestiario/ux-navegar`, sobre `main` en `4dd4640`. Pedido del usuario: *"mejoras del bestiario
> redondo, enfocada en la ui/ux. Que se pueda navegar correctamente, todas las bestias son visibles y estan correctamente
> ubicadas, no se molestan entre si, las fichas no molestan, que los sonidos andan bien y los recortes tambien"*. Se
> recorrieron las trece regiones con un navegador de verdad (Edge sin ventana, 375Ã—812 y 1280Ã—800): una tira de capturas
> por regiÃ³n y un toque a cada uno de los 122 bichos, midiendo si se ve, si se puede tocar, dÃ³nde abre la ficha y si suena.
>
> - **El toque que se perdÃ­a** (`scripts/camino.ts`): el dedo bajaba y subÃ­a sobre el bicho, pero el navegador mandaba el
>   clic al `<svg>` del piso; la ficha se abrÃ­a y el mismo clic, por "tocar afuera", la cerraba en el acto. Pasaba sobre
>   todo despuÃ©s de cerrar otra ficha y contra el borde. Ahora el bicho donde el dedo bajÃ³ y subiÃ³ es el tocado, el
>   toque al lado (a menos de 34 px) va al mÃ¡s cercano, y ese clic no cierra la ficha. **De 122, abren 120 en la prueba
>   en serie**; los otros dos (la polilla y el gato que llamÃ¡s con silbidos) abren tocados sueltos: la prueba los perdÃ­a
>   porque vuelan o porque LimÃ³n les pasa por encima.
> - **La cÃ¡mara cortaba el piso** (`lib/bestiario/camara.ts`, `APOYO`): agrandaba la escena desde el medio y los bichos del
>   piso quedaban con los pies afuera (los perros del baldÃ­o, los nÃ¡ufragos, el taxi, el pac-man). Ahora agranda desde
>   cerca del piso y el vaivÃ©n baja la escena; el corte se lo come el cielo. El Ã¡rbol, con el seÃ±or de los cielos sentado
>   arriba de la copa (dibujado en la imagen impresa), queda centrado (`apoyo` del tramo).
> - **El cartel se aparta**: con un bicho debajo del nombre de la regiÃ³n (el seÃ±or de los cielos, la lechuza, el gavilÃ¡n),
>   el cartel se aclara y deja pasar el toque.
> - **El cruce del monte y la pastura** se tragaba los toques de abajo (la liebre muerta, el rebaÃ±o): ahora solo se tocan
>   los carteles. En el monte, el rey de esta jungla y tu animal se corrieron antes del final (y los ojos del joven
>   lobo), porque la columna de carteles les quedaba encima.
> - **Las fichas de gesto largo**: el que no se cayÃ³ del cielo abrÃ­a la ficha a los 6,9 s, el del anzuelo a los 4,5 y el
>   perro dinamita a los 3,3. ParecÃ­a que el toque no andaba. Ahora ninguna espera mÃ¡s de 1,6 s (`ESPERA_MAXIMA`); el
>   gesto sigue detrÃ¡s y, cuando el tÃ­tere termina, no reabre la ficha ni corta el tema.
> - **El bocadillo solo se lee** (`sitio.css`): en la compu aparecÃ­a al pasar el mouse justo encima del bicho y se comÃ­a el clic.
> - **El panel tÃ¡ctil de costado** ya no pelea con la escena que se corrÃ­a sola.
> - **Sonido y recortes**: los 101 bichos con recorte propio suenan al abrir su ficha, sin un solo 404 de imagen ni de audio
>   en las trece regiones.
> - **Verde:** `npm test` (2224, seis nuevos en `camino.test.ts` y uno en `camara.test.ts`), `npm run check` (0 errores),
>   `npm run build` (200 pÃ¡ginas).
> - **Falta**: probarlo en un telÃ©fono de verdad; los scripts de la recorrida quedaron en el scratchpad de la sesiÃ³n, no en
>   el repo.

> ## ðŸ”Š EL BESTIARIO ADENTRO DE X: EL SONIDO QUE SE COLGABA Y LAS FICHAS (2026-10-29) â€” `T-519`
>
> **En `main` por el PR #99** (fusiÃ³n `4dd4640`), rama `x-bestiario-sonido`; lo integrÃ³ Claude a pedido del usuario (*"SÃ­, integralo"*). Pedido del usuario, probando el posteo: *"no suena correctamente, se cuelga
> el sonido, a veces no suena una bestia y queda todo en silencio, aÃºn estÃ¡n muy grandes las fichas"*.
>
> - **La rocola ya no se cuelga** (`scripts/rocola.ts`): un recorte que no avanza (7 s para arrancar, 3,5 s trabado) se da
>   por terminado. Antes un `<audio>` trabado bajando no terminaba ni daba error, y el bestiario dejaba el recital de fondo
>   bajado esperÃ¡ndolo: todo en silencio. Vale tambiÃ©n para "ArmÃ¡ tu recital" y "En vivo", que usan la misma rocola.
> - **El recital se despierta** (`scripts/camino.ts`): la escucha de toques ya no se suelta con el primero que anda. Cada
>   toque, con el sonido pedido, despierta el contexto si se durmiÃ³, y al terminar de hablar una bestia se intenta un
>   `resume()`. En el celular el `<audio>` de la bestia puede dejar el Web Audio del recital suspendido.
> - **Las fichas, chicas adentro de X** (`camino.css`): contra el borde derecho, de 17 rem de ancho como mucho (en el
>   recuadro de 340 bajÃ³ de 329 px a 190), y con mouse la cruz de 20 px en vez de 48.
> - **Verde:** `npm test` (2217), `npm run check`, `npm run build` (200 pÃ¡ginas). La ficha medida en un iframe de 340 con mouse.
> - **No verificado**: el sonido en el celular adentro de X, que es donde se colgaba. Ninguna de las dos causas se pudo
>   reproducir acÃ¡; los dos arreglos cubren las dos que el cÃ³digo dejaba abiertas.

> ## ðŸ“… EL ALMANAQUE DEL PORTAL: UN MES, UN AFICHE (2026-10-29) â€” `D-84`
>
> **En `main` el 2026-11-13**, adentro del PR #104 (fusiÃ³n `390223d`; GitHub cerrÃ³ el #100 como fusionado): rama `portal/almanaque`, sobre `main` en `b0b0bc2`. Pedido del usuario: *"Actualicemos la portada de la
> pÃ¡gina, quedÃ³ vieja de oktubre, que quede hasta el fin del mes, pero ya pensemos otra cosa."* y, sobre la propuesta
> (`Docs/SUGERENCIAS/HILO-para-todos-el-almanaque-del-portal.md`), *"SÃ­, armalo"*. `T-520`.
>
> - **El afiche se apaga solo el 1.Âº de noviembre** con la fecha del telÃ©fono (`D-49` punto 2): no hubo que tocar nada
>   para que quede hasta fin de mes.
> - **El afiche de octubre pasa a ser el almanaque del portal**: una tabla mes â†’ afiche (`ALMANAQUE` en `copy.ts`),
>   prendida por la fecha de quien mira (`data-mes` y `data-afiche` en la cabeza, con la lista de meses inyectada
>   desde el build) y con las fechas sacadas de las fichas de disco e hito (`lib/sitio/almanaque.ts`, solo `hecho`).
>   El mismo componente (`.afiche`, antes `.oktubre`); por mes rotan la tinta, la letra del sello y los textos.
> - **Noviembre: HURACÃN** (19 y 20-11-1993, "EL 19 CUMPLE 33"), tinta de *Lobo suelto*, sello en la letra de la banda;
>   seis tacos (la separaciÃ³n 2-2001, *Momo* 17, *Ãšltimo bondi* 18, HuracÃ¡n 19 y 20, el Lozanazo 26); botÃ³n Â«MIRÃ QUÃ‰
>   SE TOCÃ“ EL 19Â» a la lista de esa noche en "En vivo", que ahora se ancla por fecha (`lista-1993-11-19`, con `-2` si
>   dos cargas comparten noche) y se abre sola al llegar por el `#`.
> - **Diciembre: CINCUENTA** (la fundaciÃ³n del 28-12-1976, `leyenda`), tinta de *Gulp!*, con el rÃ³tulo â—† LEYENDA pegado
>   a la estampa â€”la Ãºnica leyenda que entra, declarada y testeadaâ€”; cuatro tacos; botÃ³n Â«LEÃ‰ CÃ“MO EMPEZÃ“Â».
> - **Los meses de duelo no tienen afiche nunca**; mayo, cuando se construya (`T-521`, reservada).
> - `contenido` leyÃ³ las lÃ­neas (dos recortes y el botÃ³n de noviembre); `experiencia` escribiÃ³ `UX-40`; la **hoja 18**
>   del lienzo estÃ¡ pegada (versiÃ³n 22, pÃ¡gina AplicaciÃ³n, debajo de la 16).
> - **Verde:** `npm test` (2225), `npm run check` (0 errores), `npm run build` (200 pÃ¡ginas). Visto en el panel a
>   375Ã—812 (los tres afiches, forzando `data-mes`) y a 1280Ã—800 (el afiche al lado de la cabecera), y el ancla de En vivo
>   abriendo la lista del 19 con sus 21 temas.
> - **Falta**: mirar el afiche de noviembre en un telÃ©fono de verdad el 1.Âº; `T-521` (mayo); un `DIF-` para la semana del
>   17 al 20 de noviembre (`difusion`).

> ## ðŸ“º ADENTRO DE X, SIN SCROLL (2026-10-29) â€” `T-518`
>
> **En `main` por el PR #97** (fusiÃ³n `7d28bc9`), rama `x-sin-scroll`. Lo integrÃ³ Claude a pedido del usuario (*"SÃ­,
> integralo"*), con `main` sin moverse desde la rama y todo verde. El usuario lo probÃ³ en un posteo de verdad: **el reproductor anda** (en la compu y
> en el celular, sin aprobaciÃ³n de X). Pero en la compu X dibuja el recuadro de unos **340 Ã— 340** â€”no los 480 Ã— 720 de
> las etiquetasâ€” sin dejar bajar, y no se llegaba a la caja de escribir; en el celular lo abre en una ventana de unos
> **370 Ã— 560**. Pedido textual: *"rediseÃ±arlo para que sea mÃ­nimo el de x"*, *"que sea todo sin scroll"*, y del bestiario
> *"que se note que sea un scroll lateral en celu y en la compu scroll para abajo"* y *"todos los textos bastante mÃ¡s
> chicos, en la compu tapan demasiado"*.
>
> - **Los dos juegos** (`juego.css`, "Adentro de X" â†’ "Sin scroll"): cada pantalla es la ventana entera, con el botÃ³n
>   abajo. Lo que no entra se va (los once pozos, el aviso de antes de arrancar, la lista de temas del resultado, el plano
>   de las cuatro maneras); lo que hace falta para jugar queda. En "AdivinÃ¡ el tema" la partida es una grilla: la caja a lo
>   ancho y **"EscuchÃ¡" y "PasÃ¡" lado a lado**, y las sugerencias se abren encima de la cinta. Con alto de celular vuelve
>   la escalera de intentos. Un escalÃ³n mÃ¡s chico para `max-height: 30rem` (la compu).
> - **El aviso de "abrilo aparte"** del navegador incrustado ya no sale adentro del reproductor (`partida-tema.ts`).
> - **La franja**, mÃ¡s baja: la FR en el mÃ­nimo de 48 px (`D-82`) y la salida en cinta chica (`sitio.css`).
> - **El bestiario**: el aviso de caminar quedaba **tapado por la franja**; ahora va arriba. Adentro de X con mouse dice
>   *"BajÃ¡ con la ruedita para caminar."* (`CAMINO.ruedita`), y la ruedita ya caminaba. Todo el texto de las dos pantallas
>   del bestiario baja al 87,5 % (al 70 % con mouse); el toque no, que va en pÃ­xeles. "â† AL PLANO" abre **el plano solo**,
>   cuadrado y del tamaÃ±o de la ventana, sin los 24.000 px de la portada.
> - **Verde:** `npm test` (2217), `npm run check`, `npm run build` (200 pÃ¡ginas). Medido a 340 Ã— 340 y 370 Ã— 560 pantalla
>   por pantalla (portada, partida, sugerencias, revelaciÃ³n con el reproductor del tema entero, resultado; las tres de la
>   noche; el camino y el plano), y la ruedita probada en un iframe de 340 con mouse.
> - **Falta**: mirarlo de nuevo en un posteo (X guarda la tarjeta en cachÃ©: agregarle `?v=2` a la direcciÃ³n), y las
>   postales `cu-N` de la noche, que usan la misma hoja pero no se recorrieron una por una.

> ## ðŸ”€ SEIS PR A `main`, EN ORDEN Y CON `main` ADENTRO (2026-10-29)
>
> Pedido del usuario: *"mergea todo a main resolviendo conflictos y mergeando en orden"*. Lo hizo el hilo principal en el
> checkout principal, rama por rama y por nÃºmero de PR, como pide `.claude/rules/integrar.md`: `main` adentro de cada
> rama, `npm test`, `npm run check` y `npm run build` en verde en la rama fusionada, y `gh pr merge --merge`.
>
> - **#31** (`difusion/hilo-fichin`, fusiÃ³n `4aa505f`): el hilo de los 40 de *Oktubre*. `hilo.md`, `hilo.json` y la foto 05
>   chocaban: quedÃ³ la rama, que tiene las fotos con FICHÃN RICOTERO y los alt que las describen (`main` tenÃ­a la 05 con
>   ARCADE RICOTERO y el mismo texto menos la nota del DNS).
> - **#78** (`difusion/reels`, fusiÃ³n `ad718cf`): los tres reels y el generador; `puppeteer-core` entra al lockfile.
> - **#82** (`bestiario/luzbelito-macizo`, fusiÃ³n `961f9d1`): Luzbelito macizo, sin choques.
> - **#92** (`claude/bestiario-en-x-9ae3b4`, fusiÃ³n `c0e460d`): el bestiario adentro de X. **`T-516` pasÃ³ a `T-517`** en
>   `ESTADO.md` y en los siete archivos de `src` que lo nombran: el `T-516` de las cinco de la noche (#93) llegÃ³ antes a
>   `main`. Anotado en su entrada y en `Docs/IDS.md`; los commits de la rama siguen diciendo `T-516`.
> - **#94** (fusiÃ³n `6f75ced`) y **#95** (fusiÃ³n `959e0fd`): los dos `ESTADO.md` que anotaban la entrada a `main` del #91 y
>   del #93. Chocaban en la entrada de la pulida: quedÃ³ el texto del #94, que es el mÃ¡s completo.
> - El #93 (las cinco de la noche, fusiÃ³n `ac0c6f6`) lo fusionÃ³ otra sesiÃ³n minutos antes de empezar esto.
> - Cada choque de `ESTADO.md` se resolviÃ³ dejando las dos entradas, cada una en su fecha. De paso, la entrada de `D-78`
>   decÃ­a "sin integrar" y el #68 estaba en `main` desde el 2026-10-20: corregida.
> - **Falta**: quitar los worktrees `.claude/worktrees/reels` y `.claude/worktrees/bestiario-en-x-9ae3b4` (sus ramas ya
>   estÃ¡n en `main`), y lo que cada entrada integrada dice en su propio "Falta".

> ## ðŸ¦ CINCO QUE ERAN OJOS EN LA PROFUNDIDAD DE LA NOCHE: EL REY DE ESTA JUNGLA, EL AHOGADO Y SU FIEL FANTASMA, EL PICHÃ“N, EL CLUB DE MANTIS Y EL QUE NO SE CAYÃ“ DEL CIELO (2026-10-29) â€” `D-73` (25)
>
> **En `main`** por el PR #93 (fusiÃ³n `ac0c6f6`), desde la rama `bestiario/cinco-noche`, nacida sobre `bestiario/siete-mas` (`49351b3`, la vigesimocuarta, que entrÃ³
> a `main` por el #88), con `main` adentro. `T-516` (se escribiÃ³ como `T-514` y se renumerÃ³: `T-514` y `T-515` ya eran de la pulida, `D-83`). Pedido del usuario: cinco bestias que hoy sean ojos en la profundidad de la noche, con vida,
> animaciÃ³n y detalles Ãºnicos. Se eligiÃ³ una por recinto entre los que menos tÃ­teres tienen (el infierno ya no tiene ojos).
>
> - **Monte**: el rey de esta jungla, un leÃ³n viejo enterrado hasta los ojos entre las flores, con la cruz de la etiqueta negra, la
>   corona de lata y el patÃ­n; tocado asoma, ruge sin voz, crecen las flores, rueda el patÃ­n y se vuelve a hundir.
> - **Bajo**: el ahogado y su fiel fantasma, dos en un tÃ­tere a la izquierda del bote; tocados Ã©l se va a pique, la sÃ¡bana hace BU y
>   se zambulle detrÃ¡s, y vuelven los dos chorreando.
> - **PrisiÃ³n**: el pichÃ³n en el alfÃ©izar de la ventana, detrÃ¡s de la reja (capa `atras`), con la pizarrita de los tiros que esquivÃ³;
>   tocado, fogonazo, salta, vuelan plumas, queda un agujero nuevo en la piedra y hace la raya. SaliÃ³ chico y se agrandÃ³ al doble:
>   sus ojos se corrieron a [506, 289].
> - **Mesa**: el club de mantis, tres seÃ±oras con servilleta que se hamacan y siguen con la pseudopupila al macho que llega con un
>   clavel; tocadas, Ã‘AC. Se sacaron las tres mantis pintadas del piso (`mesa-piso` y `camino-mesa-piso` reimpresos).
> - **Techos**: el que no se cayÃ³ del cielo, sentado en el filo de la chapa con el vaso que nunca se vuelca; tocado se cae, queda
>   colgado de una mano, se sube y brinda.
> - Alrededor: `esclavo.test.ts` ahora pide solo al esclavo en la capa `atras` de la prisiÃ³n (se le metÃ­a el pichÃ³n); las cinco
>   estampas se acortaron al tope de 320 caracteres del schema.
> - **Verde:** `npm test` (2209), `npm run check` (0 errores), `npm run build` (180 pÃ¡ginas). Vistos vivir y responder al toque en
>   la pÃ¡gina de cada recinto, con la ficha abierta.
> - **Falta**: `T-516` (telÃ©fono de verdad, que `contenido` lea las estampas, las tintas al lienzo).

> ## âœ¨ LA PULIDA DEL BESTIARIO: EL PRIMER PASO, LOS SELLOS QUE SE ASIENTAN Y EL ANOTADO A LA VISTA (2026-10-29) â€” `D-83`
>
> **En `main`** por el PR #91 (fusiÃ³n `5c90072`), desde la rama `bestiario/pulida` (worktree `.claude/worktrees/pulida-bestiario`),
> sobre `bestiario/siete-mas` en `49351b3` (PR #88): trae adentro las siete mÃ¡s. Lo integrÃ³ Claude a pedido del usuario
> (*"Integralo"*), con `main` adentro (`a16f417`) y todo verde en la rama fusionada: `npm test` (2169), `npm run check`,
> `npm run build` (186 pÃ¡ginas). Pedido del usuario: *"Hace una pulida entera del
> bestiario redondo. Mejora diseÃ±os, mejora inmersion, animaciones y todo lo que haga mas inmersivo y pulido al sitio."*
>
> - **Lo que se vio antes de tocar**: en el telÃ©fono, al entrar al monte no habÃ­a ningÃºn bicho a la vista (las lobas arrancan
>   en el pÃ­xel 398 de una pantalla de 375) ni ninguna pista de que se camina de costado, con el tablero plegado; en el camino
>   la libreta vivÃ­a plegada y nada decÃ­a que un toque anotaba; el bocadillo y la hoja aparecÃ­an de golpe; en la compu la
>   escena no se agarraba con el mouse.
> - **El primer paso**: al llegar por el principio, la cÃ¡mara camina sola el 30 % de la vista (150 px como mucho) en 1,6 s y
>   se para; cualquier gesto lo corta y con movimiento reducido no se da (`PRIMER_PASO` en `camara.ts`, con test).
> - **La invitaciÃ³n a caminar**: hasta que la mano camine por primera vez, Â«DeslizÃ¡ de costado para caminarÂ» es un sello
>   flotando abajo de la escena, con la flecha del cruce; se va con el primer trecho caminado y queda anotado en el telÃ©fono
>   (`fichin-bestiario-sabe-caminar`). Solo donde no hay mouse.
> - **Los sellos se asientan** (`--duracion-sello`, 220 ms, a cero con movimiento reducido; `movimiento.test.ts` las conoce):
>   el bocadillo gira desde su punta, la hoja baja los Ãºltimos diez pÃ­xeles, el Â«AnotadoÂ» nuevo cae como golpe de sello y la
>   libreta se vuelve a sellar cuando la cuenta sube.
> - **Lo anotado se ve donde se anota**: la hoja de la ficha lleva el sello Â«AnotadoÂ» y Â«Anotaste n de 122Â» al lado del
>   sello de clase (`scripts/bestiario/sellos.ts`, compartido por las dos islas).
> - **La escena se agarra con el mouse** (`grab`/`grabbing`): seis pÃ­xeles ya son arrastre, y el clic que lo cierra no toca
>   a nadie.
> - **Precarga** del piso y de lo lejano desde la cabeza del documento; chips, acciones, rÃ³tulos del plano y botones del
>   camino responden en `--duracion-toque`.
> - **Verde:** `npm test` (2165), `npm run check` (0 errores), `npm run build` (180 pÃ¡ginas). Visto en el panel a 375Ã—812 y
>   a 1280Ã—800, con el panel a la vista (escondido no corre `requestAnimationFrame`).
> - **Falta**: `T-514` (telÃ©fono de verdad: la inercia de iOS, el sello sobre la barra de Safari), `T-515` (el sello de
>   invitaciÃ³n y el renglÃ³n de la hoja al lienzo, hoja 08).

> ## ðŸƒ SIETE MÃS QUE ERAN OJOS: EL DIABLO DE MUCHOS CUERNOS, LA PRINCESITA SAPITO, LA TIPA RAPAZ, EL RATÃ“N, LA POLILLA, EL BOTIJA Y EL JOCKER (2026-10-29) â€” `D-73` (24)
>
> **En `main`** por el PR #88 (fusiÃ³n `49351b3`), desde la rama `bestiario/siete-mas`, nacida sobre `bestiario/siete` (`2dd328b`), con `main` ya adentro (la vigesimotercera entrÃ³ por el #86).
> `T-513`. Pedido del usuario: otras siete bestias sin diseÃ±o complejo, rocambolescas, con buenos detalles y animaciÃ³n acorde.
>
> - **Infierno**: el diablo de muchos cuernos, portero de levita; tocado se cuenta los cuernos y le brota otro.
> - **Cybersiberia**: la princesita sapito en su trono de nieve; tocada pone la trompa, puf, y sigue sapo.
> - **Mesa**: la tipa rapaz; tocada se queda con la billetera del mantel y brinda.
> - **Techos**: el ratÃ³n de canaleta; tocado huele al gato, se esconde y vuelve a asomar el hocico.
> - **Templo**: la polilla colgada de la guirnalda, con su foco; tocada se da contra el vidrio e insiste.
> - **Astilleros**: el botija rapado en la planchada; tocado salta al ferry y Â«Â¡ZafÃ³!Â».
> - **Ãrbol**: el jocker burlÃ³n colgado de la rama; tocado se da vuelta como un naipe.
> - Se sacaron del piso las siluetas de la princesita, la tipa, el botija y el jocker (reimpresos).
> - **Verde:** `npm test` (2164), `npm run check`, `npm run build`.
> - **Falta**: `T-513` (telÃ©fono de verdad, que `contenido` lea las estampas, las tintas al lienzo).

> ## ðŸ“º EL BESTIARIO ADENTRO DE X, A PRUEBA (2026-10-29) â€” `T-517`
>
> **En `main`** por el PR #92 (fusiÃ³n `c0e460d`), desde la rama `claude/bestiario-en-x-9ae3b4`. Lo integrÃ³ Claude a pedido
> del usuario (*"mergea todo a main"*), con `main` adentro (`32ba1f0`) y todo verde en la rama fusionada: `npm test`
> (2217), `npm run check`, `npm run build` (186 pÃ¡ginas). Pedido del usuario: sumar el bestiario redondo a la vÃ­a de la
> Player Card de `T-513`. (`T-514` y `T-515` los toma la rama `bestiario/pulida`.) Se escribiÃ³ como `T-516` y **se
> renumerÃ³ a `T-517` al integrar**: el `T-516` de las cinco de la noche (`D-73`, 25) llegÃ³ antes a `main` por el #93;
> los commits de la rama todavÃ­a dicen `T-516`.
>
> - **Puentes**: `/en-x/bestiario/` y una por cada regiÃ³n que se camina (`/en-x/bestiario/<regiÃ³n>/`), en `PUENTES` de
>   `lib/en-x.ts`. La del bestiario **entra por el monte** (`ENTRADA`, como la puerta de la Redondopedia, `D-76`) y no por
>   el plano, que en el recuadro no se ve sin bajar. Sin puente por bestia: ninguna tiene vista previa propia, y la bestia
>   viaja en el `#` de la regiÃ³n, que la puente le pasa al bestiario en un navegador.
> - **Modo incrustado**: `Base` acepta `incrustable="<secciÃ³n>"`: pone la franja y le pasa a `Cabeza` la prop nueva
>   `adentro`, para que los enlaces de esa secciÃ³n y los `#` **se queden en el recuadro** (pasar de regiÃ³n a regiÃ³n es el
>   paseo, no una salida); el resto sigue abriÃ©ndose afuera. En el camino a pantalla entera queda "â† AL PLANO" arriba y la
>   franja baja a la esquina de abajo (`camino.css`). Las reglas comunes de la franja pasaron de `juego.css` a `sitio.css`,
>   que el bestiario sÃ­ carga.
> - **`localStorage`**: ya iba envuelto; probado en un marco donde tira, en el build: la isla anda y anota en memoria.
> - **Compartir**: el bestiario no tiene "CompartÃ­"; no hay nada que cambiar.
> - **Verde:** `npm test` (2111), `npm run check`, `npm run build`. Probado incrustado a 360 Ã— 540 y 480 Ã— 720: la escena se
>   ve sin scroll, la animaciÃ³n corre en el iframe, tocar una bestia abre la ficha, y los juegos de `T-513` siguen igual.
> - **Falta**: lo mismo que `T-513`, mirarlo en un posteo real. Al fusionar con la pulida ya en `main`, `[region].astro`,
>   `camino.css` y `sitio.css` se fusionaron solos; el build y los tests pasaron, pero nadie volviÃ³ a mirar el recuadro.

> ## ðŸ“º DOS JUEGOS PARA JUGAR ADENTRO DE X, A PRUEBA (2026-10-28) â€” `T-513`
>
> **En `main` desde el PR #89** (commit de fusiÃ³n `3fe3bcf`), rama `worktree-difusion-x-player`. Lo integrÃ³ Claude a pedido
> del usuario (*"Cuando termines metelo a main asi lo puedo probar."*). Pedido del usuario: investigar las "miniapps" de X
> y armar *"para noche ricotera y adivina el tema"*. El bestiario como miniapp de X lo hace otra sesiÃ³n, rama
> `bestiario-en-x`.
>
> - **Lo que encontrÃ³ `investigador`** (sin ficha `RES` todavÃ­a; no pudo abrir developer.x.com): X **no tiene miniapps**. La
>   Ãºnica vÃ­a es la **Player Card** (`twitter:card=player`, un iframe dentro del posteo), pensada para video y audio. SegÃºn sus
>   foros pide aprobaciÃ³n manual, no se ve en el timeline y puede no verse en el celular.
> - **QuÃ© hay**: siete pÃ¡ginas puente en `/en-x/` (`[...juego].astro`): "AdivinÃ¡ el tema", "Â¿QuÃ© tipo de ricotero sos?" y
>   sus cuatro postales. Llevan la Player Card y mandan al juego a quien las abre, con el desafÃ­o de la direcciÃ³n. El iframe
>   carga el juego de siempre con `?incrustado`: `Cabeza` (`incrustable`) le pone `html.incrustado` y `<base target="_blank">`.
>   TamaÃ±o apostado: 480 Ã— 720 (`REPRODUCTOR` en `lib/en-x.ts`).
> - **El modo incrustado** (`juego.css`, secciÃ³n "Adentro de X"): la cabecera y la marca grande se cambian por la franja de
>   `FranjaEnX.astro` (FR chica + "SEGUÃ EN EL FICHÃN"), asÃ­ a 360 Ã— 540 entran el tÃ­tulo y el botÃ³n de empezar sin
>   scroll; en "AdivinÃ¡ el tema" la escalera de intentos se pliega con poco alto y en el resultado suben el puntaje y
>   "CompartÃ­". **"CompartÃ­" adentro de X postea** (`scripts/en-x.ts`): abre el posteo ya escrito con **la puente** como
>   direcciÃ³n (la postal de la manera que saliÃ³, en dos ejes), asÃ­ el posteo nuevo tambiÃ©n se juega adentro.
> - **Verde:** `npm test` (2013), `npm run check`, `npm run build`. Los dos juegos se jugaron enteros a 360 Ã— 540 y 480 Ã— 720,
>   con el posteo de X armado y la puente probada con un desafÃ­o.
> - **Falta**: publicar, pegar el enlace en un posteo real y mirarlo en iOS, Android y web. Si X no lo muestra, se
>   queda la tarjeta grande de siempre. Que `investigador` deje la ficha `RES` con lo que el posteo confirme.
> ## ðŸ SIETE QUE ERAN OJOS: EL CHIVATO, LOS GALLOS, LA ANGUILA, LA LECHUZA, EL ANZUELO, LA PIBA Y LAS LOBAS (2026-10-28) â€” `D-73` (23)
>
> **En `main`** por el PR #86 (fusiÃ³n `b1677df`), desde la rama `bestiario/siete`.
> `T-512`. Pedido del usuario: otras siete bestias sin diseÃ±o complejo, rocambolescas, con buenos detalles y animaciÃ³n acorde.
>
> - **PrisiÃ³n**: el chivato murguero con la oreja en la reja; tocado canta la delaciÃ³n y se le vuela la lista.
> - **Templo**: los gallos sofocados, borrachos de fin de fiesta; tocados, riÃ±a de opereta y abrazo.
> - **Bajo**: la anguila en el barro, que ondula de verdad; tocada salta y el barro se la traga.
> - **Ãrbol**: la lechuza que circula, con el pito de vigilante; tocada da la vuelta al Ã¡rbol mirÃ¡ndote.
> - **Astilleros**: el que mordiÃ³ el anzuelo, colgado de la caÃ±a; tocado se zafa y vuelve a morder.
> - **Ruta**: la piba con la remera (ballena, sin logo), que finge que duerme; tocada ronca de mentira y espÃ­a.
> - **Monte**: las antiguas lobas; tocadas reviven, aÃºllan a dÃºo, trotan y se vuelven a echar.
> - Se sacaron del piso las siluetas pintadas de la lechuza, el pescado y la piba (reimpresos).
> - **Verde:** `npm test` (2105), `npm run check`, `npm run build`. Vistos vivir y responder al toque en la pÃ¡gina de cada recinto.
> - **Falta**: `T-512` (telÃ©fono de verdad, que `contenido` lea las estampas, las tintas al lienzo, el retrato de la desencarnada).

> ## ðŸ“º CINCO QUE ERAN OJOS: EL ALIEN DUCE, LAS SIRENAS, EL AMORCITO, EL GATO MATÃ“N Y MANDINGA (2026-10-28) â€” `D-73` (22)
>
> **En `main`** por el PR #84 (fusiÃ³n `84a4b09`), desde la rama `bestiario/cinco-mas`. `T-511`. Pedido del usuario: cinco bestias
> sin diseÃ±o complejo, rocambolescas, con animaciones complejas y los detalles de la letra; una tenÃ­a que ser el Alien Duce.
>
> - **Cybersiberia**: **el Alien Duce**, adentro de la pantalla de la tele, con el crÃ¡neo de bola de espejos que tira puntos de
>   luz; tocado se aplasta contra el vidrio, escupe el ticket del evangelio hasta la nieve, lo chupa y lo escupe en un bollo.
> - **El bajo** (tenÃ­a uno solo): **las sirenas**, la gata linda y la llena con el botÃ­n, que cantan, colean y se zambullen; y
>   **el amorcito**, colgada de su ventana rota con el vidrio entre los dientes y el sifÃ³n; tocada muerde, Â¡Ã‘AM!, y cabalga.
> - **Los techos**: **el gato matÃ³n**, la cana con sirena y matraca de ocasiÃ³n; tocado sale de operativo y salta al ratÃ³n.
> - **El infierno**: **Mandinga**, un tÃ­tere de sombra con varillas; tocado saluda, su sombra crece en la pared, encandila y se va.
> - Los ojos del ratÃ³n bajaron a la chapa; `rato.test.ts` mira al rato solo.
> - **Verde:** `npm test` (2046), `npm run check`, `npm run build`. Vistos vivir y responder al toque en la pÃ¡gina de cada recinto.
> - **Falta**: `T-511` (verlos en un telÃ©fono de verdad, que `contenido` lea las estampas, las tintas al lienzo).

> ## â›“ï¸ EL ESCLAVO ENCADENADO, EN LA PRISIÃ“N (2026-10-24) â€” `D-73` (21)
>
> **En `main` desde el PR #81** (commit de fusiÃ³n `1938397`), rama `bestiario/esclavo-encadenado`. Lo integrÃ³ Claude a pedido
> del usuario (*"Integralo a main."*). `T-510`. Pedido del usuario, con la imagen: *"DiseÃ±a e implementa una bestia del bestiario
> redondo que sea esta, usa la imagen de base, es uno de los de la tapa de oktubre, es importante."*
>
> - **Bestia nueva**, `el-esclavo-encadenado`: el estarcido de Rocambole que trajo el usuario, **sin redibujar**, cortado en
>   siete piezas. Se arrodilla adelante de la celda de los reos, entre la jaula vacÃ­a y la reja. Verso: *"Casi ya no llora,
>   Â¡atrapado en libertad!"* (*Preso en mi ciudad*).
> - **Tocado rompe la cadena**: tirÃ³n, chispa roja, la cadena sale despedida hacia la jaula, ruge; y la cadena vuelve al puÃ±o.
> - **El disco va como leyenda** en la ficha (`INV-02`: no venÃ­a en el vinilo del 86, se difundiÃ³ con el CD; sin ficha).
> - **CÃ³mo**: `scripts/preparar-encadenado.mjs` saca la silueta maciza del mÃ¡ster; la imprenta suma `href="master:â€¦"`. No se
>   tocaron `recortes.ts` ni `recortar-bestiario.mjs`, que otra sesiÃ³n tiene sin commitear (Luzbelito macizo).
> - **Verde:** `npm test` (2009), `npm run check`, `npm run build`. Visto en un iframe de telÃ©fono y cuadro por cuadro.
> - **Falta**: verlo en un telÃ©fono de verdad, que `contenido` lea estampa y leyenda.

> ## ðŸ•¯ï¸ LUZBELITO, MACIZO (2026-10-24) â€” `D-73`, pulida
>
> **En `main`** por el PR #82 (fusiÃ³n `961f9d1`), desde la rama `bestiario/luzbelito-macizo`, sobre `main` en `a206ce2`. Lo
> integrÃ³ Claude a pedido del usuario (*"mergea todo a main"*), con `main` adentro (`3915e4c`) y todo verde en la rama
> fusionada: `npm test` (2215), `npm run check`, `npm run build` (186 pÃ¡ginas). Pedido del usuario: el
> busto de Luzbelito *"estÃ¡ como mal cortado y se transparenta mucho"*.
>
> - **Por quÃ© pasaba:** el busto se separaba del Ã³valo negro por luminosidad, y la sombra de la cara y del cuello es casi igual
>   de oscura que el fondo: quedaba lleno de agujeros por donde se veÃ­a el fuego, con restos del pie y del marco abajo.
> - **El arreglo:** `recortes.ts` suma la opciÃ³n `macizo` (la silueta se separa por distancia al negro verdoso del Ã³valo, se le
>   tapan los agujeros y queda la pieza mÃ¡s grande; solo se sopla el canto) y `scripts/recortar-bestiario.mjs` la imprime. El
>   polÃ­gono ahora corta en la base del busto. Segunda pasada, a pedido (*"el lente izquierdo corta mal"*): el lente oscuro del
>   antiparras, del mismo verde negro que el Ã³valo, va dibujado a mano (`incluye`), y al canto se le pela el ribete del fondo
>   que dejaba un contorno oscuro (`pelar`). Tercera (*"todavÃ­a no se recorta bien el lente, generalo"*): el lente ya no se
>   corta, **se repinta** encima de la tapa (`pintado`, `lenteDeLuzbelito` en `recortes.ts`): vidrio oval con aro, soplado de
>   lo hondo a la luz de la vela, con el brillo y el grano, en tintas nuevas (`âŸ¨el lente de LuzbelitoâŸ©` en `tokens.css`).
>   **Falta pasar esas cuatro tintas al lienzo.** Se reimprimiÃ³ solo `luzbelito-real-busto.webp`; los demÃ¡s recortes salen iguales.
> - **Verde:** `npm test` (2002), `npm run check`, `npm run build`. Visto en la escena del infierno y en la ficha, sobre el fuego.
> - **Falta:** pasar las cuatro tintas del lente al lienzo.

> ## ðŸ›©ï¸ CINCO DEL FONDO: ZIPPO, EL DIABLO MÃS VELOZ, EL SANTO FUMADOR, EL COLGADO Y LA SEÃ‘ORA (2026-10-24) â€” `D-73` (20)
>
> **En `main` desde el PR #79** (commit de fusiÃ³n `7e76bf7`), rama `bestiario/cinco-del-fondo`. Lo integrÃ³ Claude a pedido del
> usuario (*"Integralo a main."*). `T-509`. Pedido
> del usuario: cinco bestias sin diseÃ±o complejo, pulidas, con su animaciÃ³n y el arte rocambolesco, con los detalles de la letra.
>
> - **Infierno** (tenÃ­a uno solo): **Zippo**, la cabeza es el encendedor, en su avioneta hecha migas; tocado, picada en rizo
>   cabeza abajo y risa de azufre. **El diablo mÃ¡s veloz**, cabrÃ­o que arrastra los pies; tocado, en un parpadeo patea la Caja
>   de los Truenos y vuelve arrastrÃ¡ndose.
> - **Templo**: **el santo fumador**, de plata, dormido en su anda con el pucho; tocado, desfila.
> - **Ãrbol**: **el que duerme colgado**, de la rama soldada, soÃ±ando angelitos gangsters de tiza; tocado, se despierta.
> - **Ruta** (tenÃ­a uno solo): **la bella seÃ±ora desencarnada**, calavera con mantilla; tocada, se le viene el dÃ­a en el pecho.
> - Se sacaron sus siluetas pintadas del piso del Ã¡rbol y de la ruta (reimpresos), y se corrieron los ojos del sheriff y la
>   murga en el templo.
> - **Verde:** `npm test` (2002), `npm run check`, `npm run build`. Vistos animar en el servidor de desarrollo.
> - **Falta**: `T-509` (verlas en un telÃ©fono de verdad, que `contenido` lea las estampas, las tintas al lienzo).

> ## ðŸŽžï¸ TRES REELS EN EL CALENDARIO (2026-10-24) â€” `D-81`
>
> **En `main`** por el PR #78 (fusiÃ³n `ad718cf`), desde la rama `difusion/reels`. Lo integrÃ³ Claude a pedido del usuario
> (*"mergea todo a main"*), con `main` adentro (`606a086`) y todo verde en la rama fusionada: `npm test` (2215),
> `npm run check`, `npm run build` (186 pÃ¡ginas). Pedido del usuario: *"Armate unos buenos reels ricoteros sobre los juegos
> adivina el tema, sacalo por la letra y el bestiario redondo. Que se entienda lo que son pero no muestren de mas"*.
>
> - **Los reels** (`public/redes/DIF-13/14/15.mp4`, 1080x1920, 15 a 20 s): AdivinÃ¡ el tema sube la escalera
>   0,1-0,5-2-4 s de *Juguetes perdidos* y el tema sigue bajo el cartel, sin decir cuÃ¡l es; Sacalo por la letra tacha
>   ocho versos con fibra y deja una palabra de cada uno; el bestiario camina, con su reloj de verdad, la prisiÃ³n de
>   Barbazul y la pastura del lobo, el cordero y la vaca (pedido del usuario: *"son bestias reconocibles y entornos
>   lindos"*; el infierno de la primera versiÃ³n era "media pila"). Los carteles cuentan temas y bichos desde los JSON.
> - **El generador** (`npm run reels -- <tema|letra|bestiario> DIF-XX`, `scripts/reels/`): graba cuadro por cuadro
>   con `puppeteer-core` contra `astro dev`. Necesita `NAVEGADOR` (chrome-headless-shell: Edge sin ventana no levanta en
>   esta PC) y `FFMPEG`; estÃ¡ en la cabecera de `motor.mjs`. **Grabar desde un checkout limpio**: el dev server sirve lo
>   que haya sin commitear, y el bestiario mostrarÃ­a bichos sin publicar.
> - **El calendario**: `DIF-13` a `DIF-15` en borrador (3, 5 y 7 de noviembre). La pieza acepta `video`;
>   `redes cola` no sube video todavÃ­a y frena: los reels van a mano con el lote.
> - **Verde:** `npm test` (1959), `npm run check`, `npm run redes -- validar`. **Falta**: el visto bueno del usuario
>   a los textos, y verlos subidos en Instagram (puede silenciar el audio de los temas; si hay reclamo, se baja, `D-14`).

> ## ðŸ§¨ MI PERRO DINAMITA, CON MECHA Y EXPLOSIÃ“N (2026-10-23) â€” `D-73`, decimonovena vuelta
>
> **En `main` desde el PR #76** (commit de fusiÃ³n `7fb4e33`), rama `bestiario/tres-del-fondo`, junto con la decimoctava de
> abajo. Lo integrÃ³ Claude a pedido del usuario (*"Integralo a main."*). `T-508`. Pedido del usuario: *"DiseÃ±a, e integra bien pulido y bien rocambolesco al perro dinamita"* y *"que
> tenga una buena animacion y explosion"*.
>
> - **El dibujo** (`arte-dinamita.ts`, 16 piezas, 120 kB): el cuerpo es un atado de tres cartuchos con alambre, la
>   cola es la mecha y del cuello para adelante es un callejero flaco con la trufa que le arde. Soplado en las tintas
>   de *La mosca y la sopa*, medidas con sharp (`âŸ¨mi perro dinamitaâŸ©` en `tokens.css`), con el rÃ³tulo torcido de esa
>   tapa diciendo DINAMITA.
> - **La conducta** (`scripts/bestiario/dinamita.ts`): solo trota por el baldÃ­o, se da vuelta, jadea, olfatea, aÃºlla
>   y le chisporrotea la mecha. Tocado, la mecha se quema, tiembla y explota: fogonazo, estrella del BUM, esquirlas,
>   humo y sacudÃ³n de cÃ¡mara. Vuela en pedazos, se rearma tiznado, se marea, se sacude y aÃºlla. DespuÃ©s se abre la
>   ficha. Con movimiento reducido pasa a la pose del aullido.
> - **Verde:** `npm test` (1958, con los 10 de `dinamita.test.ts`), `npm run check`, `npm run build`. Probado en
>   la pÃ¡gina del baldÃ­o en un iframe con rAF reemplazado.
> - **Falta**: verlo en un telÃ©fono de verdad.

> ## ðŸª“ TRES BESTIAS MÃS EN LOS ENTORNOS FLACOS: EL VERDUGO, EL DR. SATURNO Y TU ANIMAL (2026-10-23) â€” `D-73` (18)
>
> **En `main` desde el PR #76** (commit de fusiÃ³n `7fb4e33`), rama `bestiario/tres-del-fondo`. Pedido del usuario: tres bestias rocambolescas y misteriosas, en
> los entornos con menos personajes detallados. Se contÃ³ entorno por entorno: el monte (1 de 8), la mesa (2 de 12) y el templo
> (2 de 11).
>
> - **El verdugo que cena distinguido** (mesa, *Jijiji*): tallado como *Oktubre* y recortado en papel. Cena solo; tocado, brinda.
> - **El Dr. Saturno** (templo, *Momo sampler*): aerÃ³grafo violeta, flota, con el anillo y tres lunitas. Tocado, da un turno.
> - **Tu animal** (monte, *Gulp!*): pincel seco petrÃ³leo, se esconde y quedan los ojos; la correa se va del monte. Tocado, se
>   muestra. Es el primero del elenco en el monte: el monte y su tramo del camino ya llaman al elenco.
> - **Verde:** `npm test` (1948), `npm run check` (0 errores), `npm run build` (180 pÃ¡ginas). En el sitio servido, las tres
>   escenas arman los tÃ­teres. **No se vieron animar**: el panel estaba oculto.
> - **Falta**: `T-506` (verlos en un telÃ©fono de verdad) y `T-507` (las tintas al lienzo; que `contenido` lea las estampas).

> ## ðŸ‘‘ LA MARCA: LA FR CORONADA, EN EL SITIO Y EN UN ARTIFACT (2026-10-23) â€” `D-82`
>
> **En `main` desde el PR #74** (commit de fusiÃ³n `74c426b`), rama `difusion/redes`, junto con las redes de abajo. Lo integrÃ³ Claude a pedido del usuario (*"Integralo a main cuando los checks estÃ©n en verde"*).
>
> - **El logo**: homenaje al PR coronado, con la F en el lugar de la P y la misma corona del original,
>   vectorizada de la referencia de `RES-42`. `python scripts/generar-logo.py` deja cinco SVG en `public/marca/`.
> - **El sitio la usa**: portada, hoja de cada juego, mesa del escritorio y cabecera de regreso; favicon,
>   Ã­cono de inicio y tarjeta para compartir (`npm run generar-marca-social`). Visto en el navegador a 375
>   px y a 1366.
> - **El sistema de marca**: https://claude.ai/artifact/49r6PNWPk241GcQBfNWbZL (privado).
> - **Las redes ya la usan**: la foto de perfil y el banner de X.
> - **Falta**: pegarla en la hoja 01 del lienzo, y verla en un telÃ©fono de verdad.

> ## ðŸ“£ LAS REDES: EL ROL `difusion`, LAS PIEZAS Y LA COLA EN BUFFER (2026-10-23) â€” `D-81`
>
> **En `main` desde el PR #74** (commit de fusiÃ³n `74c426b`), rama `difusion/redes`. Pedido del usuario: armar
> Instagram y X *"de la forma mÃ¡s automÃ¡tica y simple"*. Metricool quedÃ³ afuera porque no le gustÃ³.
>
> - **Rol nuevo, el octavo:** `difusion`, con carpeta `Docs/DIFUSION/` y prefijo `DIF-`. Escribe
>   borradores, no publica. Justificado en `Docs/EQUIPO.md`, "El octavo rol".
> - **`/redes`**: hace la semana entera. `difusion` escribe, se imprimen las piezas y el usuario dice
>   que sÃ­. DespuÃ©s se cargan en la cola de Buffer, cada una a su hora.
> - **`npm run redes -- â€¦`**: `validar`, `piezas`, `perfil`, `lote`, `canales` y `cola`. Las piezas
>   salen de Edge sin ventana, con los tokens y las letras reales, a `public/redes/`. Ya estÃ¡n
>   impresos la foto de perfil, el banner de X y `DIF-10` â€¦ `DIF-12`.
> - **Verde:** `npm test` (1921), `npm run check`, `npm run build`, y el validador del instanciador da
>   `APTA` con un aviso (8 roles).
> - **Falta**:
>   - **que el usuario abra las cuentas** (Instagram creador, X y Buffer Free) y deje la clave de
>     Buffer en `.env`. El paso a paso estÃ¡ en `DIF-01`;
>   - aprobar `DIF-10` â€¦ `DIF-12`, integrar el sitio con las piezas y correr `/redes cola`;
>   - **ver si Buffer Free deja publicar en X** (`RES-402`). Si no deja, el camino B estÃ¡ en `D-81`;
>   - el hilo de doce posteos de la rama `difusion/hilo-fichin` entrÃ³ a `main` por el PR #31 (fusiÃ³n `4aa505f`,
>     2026-10-29): `difusion` lo puede pasar al calendario.

> ## ðŸŽ¥ LA CÃMARA QUE CAMINA, LA FICHA QUE NO TAPA Y EL PLANO PINTADO ZONA POR ZONA (2026-10-23) â€” `D-79` (2.Âª vuelta) y `D-80`
>
> **En `main` desde el PR #72** (commit de fusiÃ³n `2bd7fbb`), rama `bestiario/sonido-y-portal`, junto con la entrada y los ruidos de abajo. Lo integrÃ³ Claude a pedido del usuario (*"commiteÃ¡ e integrÃ¡ todo a main"*).
>
> - **El plano**: cada una de las doce zonas tiene su escena a aerÃ³grafo (`arte-mapa-*.ts`). Va de
>   borde a borde en el telÃ©fono y hasta 52 rem en la compu. El molinete es ahora uno de cancha, y el
>   rÃ³tulo del monte ya no queda debajo del de la pastura.
> - **La cÃ¡mara del camino** (`camara.ts`): el vaivÃ©n de los pasos, la inercia, el respirar, los
>   sacudones (el meteorito de la vaca, el grito del pibe, el bombo y el vidrio), el retumbo de la ruta,
>   el acercarse al tocar y la entrada. Nada de esto se mueve con movimiento reducido.
> - **La ficha** se abre donde no tapa al bicho (`hoja.ts`): arriba o abajo en el telÃ©fono, de costado
>   en la compu.
> - **Los encimados**: la vaca se corriÃ³ lejos del cordero, y el templo, los techos, la prisiÃ³n y el
>   bajo se ensancharon a 1400â€“1500, con los bichos repartidos.
> - **Verde:** `npm test` (1854), `npm run check`, `npm run build`. Probado en el navegador con un
>   iframe.
> - **Falta**:
>   - verlo en un telÃ©fono de verdad;
>   - darles claro en la tierra pintada del plano a los seis bichos nuevos del #69 y el #70.

> ## ðŸšª LA ENTRADA DEL BESTIARIO Y LOS RUIDOS DESDE ARCHIVOS (2026-10-23) â€” `D-79`
>
> **En `main` desde el PR #72** (commit de fusiÃ³n `2bd7fbb`), rama `bestiario/sonido-y-portal`. Pedido del usuario: mejores ruidos en el bestiario
> (pasos, agua, botellas rotas), y un plano rocambolesco, *"como si estuvieras parado en la entrada de un
> mundo misterioso con un mapa"*.
>
> - **La entrada**: el plano va clavado en un cartel, en la puerta de un mundo de noche.
>   - Cuatro piezas a aerÃ³grafo (`arte-portal.ts`): el horizonte del mundo redondo, el arco de hierro,
>     el molinete abierto y el farol.
>   - La tierra del plano ahora va soplada.
>   - Un sello Â«ESTÃS ACÃÂ» sobre la ruta.
> - **Los ruidos**: `entorno.ts` toca archivos del manifiesto `EFECTOS`. Si un archivo falta, suena la
>   sÃ­ntesis, que tambiÃ©n se mejorÃ³: pasos por suelo, chapoteo, vidrio, la sala de cada regiÃ³n y fondos
>   en bucle. Se oye todo junto en `/diagnostico-bestiario/`.
> - **Verde:** `npm test` (1838), `npm run check`, `npm run build`. Visto en el panel a 375 px y en escritorio.
> - **Falta**:
>   - **bajar los archivos**: todavÃ­a no hay ninguno. Los candidatos estÃ¡n en `RES-371`, y cada uno se
>     baja con el OK del usuario;
>   - oÃ­r la sÃ­ntesis nueva en un telÃ©fono.

> ## ðŸª° TRES MÃS, ELEGIDOS POR EL HILO: EL ÃNGEL DE LA SOLEDAD, EL PAC-MAN Y LA MOSCA (2026-10-22) â€” decimosÃ©ptima enmienda de `D-73`
>
> **En `main` desde el PR #70** (commit de fusiÃ³n `274a6d4`), rama `bestiario/seis`, que saliÃ³ de `bestiario/tres` y entrÃ³
> despuÃ©s del #69. Lo integrÃ³ Claude a pedido del usuario (*"IntegrÃ¡ todo a main"*). Pedido del usuario: *"Agrega al bestiario con su diseÃ±o, animacion y todo bien
> pulido a 3 bestias que elijas vos."*
>
> - **El Ã¡ngel de la soledad** (Ã¡rbol): soplado en el sepia de la contratapa de *Lobo suelto*, con las plumas hechas de los
>   dientes serruchados de sus mÃ¡scaras. Envuelto en las alas como en una capa; ataja el huevo que se cae del nido, lo
>   escucha, no le cree y lo tira de vuelta. Tocado, abre las alas para recibirte y abraza el aire.
> - **El pac-man** (Cybersiberia): el Ãºnico del bestiario de pixel, en las tintas del fichÃ­n, con el resplandor a aerÃ³grafo.
>   Juega una partida sola en la fila de puntos: lo persigue un fantasma, se muere si lo arrinconan, se lo come con la
>   pastilla. Tocado, le da el hambre.
> - **La mosca** (mesa): el recorte de la mosca del rÃ³tulo de *La mosca y la sopa*, con su canto de papel. Vuela en ochos
>   sobre la olla y se posa en el borde, en el cucharÃ³n y en la sopa (hace anillos), y se frota las patas. Tocada, se te
>   viene encima y se va por detrÃ¡s de la oreja.
> - **Alrededor**: el elenco son diecisÃ©is; salen del piso la silueta del Ã¡ngel, la fila del pac-man y la mosca pintada;
>   bloques de tintas nuevos del Ã¡ngel y la mosca; cuentas con testimonio del memoir (pp. 293, 304, 324).
> - **Verde:** `npm test` (1898), `npm run check`, `npm run build` (179 pÃ¡ginas). En el panel a 375 px, los tres se arman,
>   el toque hace el gesto y abre la ficha. **Sin ver a velocidad real**: el panel estaba oculto y frenaba el reloj.
> - **Abierto:** `T-504` (verlos en un telÃ©fono de verdad), `T-505` (cotejar las pÃ¡ginas del memoir), `T-431`, `T-435`, `T-500`.

> ## ðŸ– TRES MÃS: LA HIJA DEL FLETERO, EL BUEN PSICÃ“PATA Y PORCO REX (2026-10-22) â€” decimosexta enmienda de `D-73`
>
> **En `main` desde el PR #69** (commit de fusiÃ³n `a188412`), rama `bestiario/tres`, sobre `main` en `0be8dc6`. Lo integrÃ³
> Claude a pedido del usuario (*"IntegrÃ¡ todo a main"*).
> Pedido del usuario: *"agrega al bestiario [...] La hija del fletero, El buen Piscopata (que suene el inicio del tema [...])
> y otro que elijas vos. Que sean bien rocambolescos"*.
>
> - **La hija del fletero** (astilleros): grisalla como la mujer del tubo del interior de *Lobo suelto*, con el rosa del
>   tubo como Ãºnico color. En la popa del ferry, hablando por un tubo cuyo cable rizado se mete en el agua; le llegan
>   descargas por el cable y se le para el pelo. Tocada, te mira y la descarga baja al muelle.
> - **El buen psicÃ³pata** (nuevo, en el baldÃ­o): el hombre de la gorra de la tapa de *Bang! Bang!*, a guache, mirando el
>   fusilamiento de la tapa de verdad en un caballete, con el perro de la parabellum que tira saltos mortales. Tocado, el
>   perro dispara una banderita *BANG* y Ã©l te saluda con la gorra.
> - **Porco Rex** (elegido por el hilo principal, Cybersiberia): un chancho rey en postal virtual de *Ãšltimo bondi*, con
>   corona remachada y los anteojos de la banda. Trota, resopla, se revuelca en el barro; tocado, se para y hace los cuernos.
> - **Alrededor**: el elenco son trece; el baldÃ­o llama al elenco; salen las siluetas viejas de la hija y del chancho;
>   en estos tres **la ficha espera al gesto** (1â€“1,2 s) y **el psicÃ³pata va desde el arranque del tema** (enmiendas a `D-78`).
> - **Verde:** `npm test` (1871), `npm run check`, `npm run build` (179 pÃ¡ginas). En el panel a 375 px, andando los tres.
> - **Falta, y no se puede desde acÃ¡:** cortar el arranque de *La parabellum* (`T-502`): el mÃ¡ster no estÃ¡ en esta
>   mÃ¡quina. Con la carpeta de los discos: `npm run sincronizar-bestiario -- "<carpeta>" --ids=el-buen-psicopata`.
>   Hasta entonces suena como los que no tienen recorte.
> - **Abierto:** `T-502`, `T-503` (cotejar las pÃ¡ginas del memoir), `T-431`, `T-435`, `T-437`/`T-439`/`T-490`.

> ## ðŸŽµ EL VERSO SUENA DONDE SE LEE (2026-10-20) â€” `D-78`
>
> **En `main`** por el PR #68 (fusiÃ³n `0be8dc6`, 2026-10-20), desde la rama `multimedia/redondos-letras-sincronizadas`. Pedido
> del usuario: que el "Escuchar" de la ficha
> arranque en el verso que muestra, de forma automÃ¡tica y sin tocar la discografÃ­a.
>
> - **`npm run sincronizar-bestiario -- "<carpeta de discos>"`**: busca el segundo del verso en LRCLIB (solo el nÃºmero,
>   cotejando la duraciÃ³n con el mÃ¡ster), corta 10 s y los deja en `public/audio/bestiario/<id>.mp3`. Manifiesto en
>   `src/data/bestiario-sincro.json`. Los discos se le pasan como carpetas al script, viven fuera del repo
>   y solo se leen. ffmpeg se instalÃ³ con winget.
> - **Las once bestias con tÃ­tere sincronizadas.** El canÃ­bal sale de una copia aparte de *Lobo suelto*, porque la
>   carpeta de discos principal no tiene *Yo canÃ­bal*.
> - **Verde:** `npm test` (1831), `npm run check`, `npm run build`.
> - **Corrido para todas:** 103 de 118 sincronizadas; las 15 que faltan estÃ¡n en `sinSincronizar` con su motivo
>   (6 sin mÃ¡ster en las carpetas, 9 con el verso que no aparece en LRCLIB).
> - **Sin oÃ­r:** ningÃºn recorte todavÃ­a, empezando por los siete que coinciden por debajo del 100 % (el Morta, entre ellos).
> - **Segunda vuelta:** tocar un bicho abre la ficha directo y, en el camino con sonido, suena su recorte; el verso aparece
>   con el mouse encima o solo (una de cada cinco que aparecen). Sin el botÃ³n "AbrÃ­ la ficha". **Sin probar en el navegador.**

> ## ðŸŽ­ EL ELENCO DE DIEZ, UNO POR ENTORNO (2026-10-19) â€” decimoquinta enmienda de `D-73`
>
> **Rama `bestiario/diez`** (worktree `.claude/worktrees/bestiario-diez`), sobre `main` en `4072abd` (con el #65 adentro).
> Pedido del usuario: *"orquestar la creaciÃ³n y diseÃ±o pulido al mÃ¡ximo al estilo rocambole [de] al menos 10
> personajes/bestias mÃ¡s [...] dividir lo mÃ¡s posible en entornos que tengan menos personajes"*.
>
> - **Diez tÃ­teres nuevos, uno por entorno**: la bestia pop (galpÃ³n), el monito que trepa (Ã¡rbol, con la animaciÃ³n en dos
>   tiempos que pidiÃ³ el usuario), el CapitÃ¡n Buscapina (Cybersiberia), el pibe de los astilleros, el canÃ­bal (mesa), la
>   Mariposa Pontiac (ruta: el primer fierro que es tÃ­tere), el diablo que mea (infierno), el rato molhado (bajo), el
>   Morta (templo) y el esclavo sensible y chillÃ³n (prisiÃ³n). Cada uno en la tÃ©cnica de su tapa, con tintas medidas,
>   conducta que sale de la letra y el verso hecho gesto al tocarlo.
> - **CÃ³mo**: una base (`elenco.ts`, `scripts/bestiario/vivos.ts`) con diez lugares, y diez subagentes Opus en paralelo,
>   cada uno en su rama `elenco/<slug>`. Cada personaje vive en sus archivos (`arte-`, `rig-`, `scripts/bestiario/`,
>   `<slug>.test.ts`) y entra solo en su recinto y en su camino. **Cierra `T-492`.**
> - **Arreglado al integrar**: el bocadillo del camino ya no queda debajo del tablero; el galpÃ³n arranca mirando a la bestia.
> - **Verde:** `npm test` (1825), `npm run check`, `npm run build`. En el panel a 375 px: los diez se arman y se mueven en el
>   bestiario sin errores; la bestia pop andando en su camino; la ficha del Morta con su retrato.
> - **Sin ver**: la animaciÃ³n de cada uno en un telÃ©fono de verdad y los cuadros por segundo (`T-490`, `T-437`, `T-439`).
> - **Abierto:** `T-500` (los sonidos del elenco), `T-501` (cotejar las pÃ¡ginas del memoir que citan), `T-431`, `T-435`.

> ## ðŸª§ EL CAMINO LIVIANO: LA PUERTA, EL RENGLÃ“N CHICO Y LOS POSTES (2026-10-18) â€” enmienda de `D-77`
>
> **En `main` desde el PR #66** (commit de fusiÃ³n `c79cb82`), rama `bestiario/camino-liviano`. Pedido del usuario, mirÃ¡ndolo en el telÃ©fono: *"se ven muy grandes los textos y tapan a los
> personajes"*, *"que suene de una"*, *"lo mismo para las fichas"* y *"que los carteles estÃ©n arriba del camino"*.
>
> - **Arriba, un renglÃ³n chico**: la salida y el nombre. Tocar el nombre despliega lo demÃ¡s; caminar lo pliega.
> - **La puerta**: con el sonido pedido se entra con un toque (Â«TocÃ¡ y entrÃ¡ con sonidoÂ»), que es el que deja
>   sonar, como el "JugÃ¡" de "AdivinÃ¡ el tema". Deslizar no cuenta como toque. Â«EntrÃ¡ sin sonidoÂ» lo apaga.
> - **La ficha y la lista flotan mÃ¡s chicas** (42 % y 46 % del alto), con la figura al costado.
> - **En los once cruces nuevos, cada cartel va en un poste al final de su picada**, frente a la luz de su disco,
>   y se corre con el piso. Se reimprimieron las once piezas de cruce. El monte y la pastura siguen en columna.
> - **Verde:** `npm test` (1707), `npm run check`, `npm run build`. Visto en el panel a 375Ã—812 y 1280Ã—800.
> - **Abierto:** `T-490` (oÃ­rlo en un telÃ©fono de verdad), picadas para el monte y la pastura.

> ## ðŸ§­ LOS TRECE ENTORNOS, CONECTADOS Y DE COSTADO (2026-10-18) â€” `D-77`
>
> **En `main` desde el PR #65** (rama `bestiario/todo-caminable`, worktree `.claude/worktrees/camino-todo`), sobre
> `main` en `cc58d47`, que no se habÃ­a movido. Lo integrÃ³ Claude a pedido del usuario (*"IntegrÃ¡ el PR #65 a main"*). Pedido del usuario: *"Todos los entornos deben ser caminables y conectados. En mÃ³vil que haya que
> scrollear para el lado donde avanzÃ¡s, no para abajo"*, *"siempre en pantalla completa"*, *"que la ficha sea una
> ficha flotando sin tapar toda la pantalla"* y *"si entrÃ¡s al bestiario ya estÃ¡s caminando y con el sonido activado"*.
>
> - **Las trece regiones tienen su camino**, y desde el monte se llega a todas y se vuelve (lo mira el test). El
>   monte y la pastura, como estaban; los seis entornos de la dÃ©cima vuelta, pintados a 2400 con paralaje; los cinco
>   recintos de tÃ­teres, enteros y a pantalla completa (son chicos por naturaleza: no se caminan, se recorren).
> - **Cada uno termina en un cruce**: la noche se come el borde de la escena y la picada se abre hacia la luz de cada
>   vecina. Todos los carteles llevan a otro camino.
> - **Se avanza de costado**: en el telÃ©fono, el scroll de costado del navegador; en la compu, la ruedita y las flechas.
> - **La ficha y la lista flotan** abajo, sin tapar la escena entera. Caminando, el tablero se achica al nombre.
> - **Se entra con el sonido pedido**, que suena con el primer toque, y cada regiÃ³n tiene su receta de ruidos.
> - **Por dentro**: la vida de los recintos pasÃ³ a `scripts/bestiario/recintos.ts` (la usan las dos islas), y el piso
>   de cada tramo lo arma `lib/bestiario/escenas-camino.ts`. Los rÃ³tulos del plano llevan a caminar.
> - **Verde:** `npm test` (1707), `npm run check`, `npm run build`. Visto en el panel a 375Ã—812 y 1280Ã—800.
> - **Abierto:** `T-490` (telÃ©fono de verdad y oÃ­rlo), `T-491` (el plano como galerÃ­a o solo mapa), `T-493` (lienzo).
>   `T-492` lo cerrÃ³ el elenco de diez.

> ## ðŸ‹ LIMÃ“N, POR LAS CHAPAS DEL BALDÃO (2026-10-18) â€” decimocuarta enmienda de `D-73`
>
> **En `main` desde el PR #63** (rama `bestiario/limon`, worktree `.claude/worktrees/bestiario-limon`), con `main`
> juntado en `250fb04` (hasta el #62, la vaca). El usuario eligiÃ³ 27 bestias para dibujar con mÃ¡s detalle
> (`Docs/SUGERENCIAS/HILO-para-bestiario-prioridad-de-figuras.md`) y empezÃ³ por LimÃ³n: *"un limÃ³n colombiano que corre
> por las chapas"*.
>
> - **LimÃ³n es un limÃ³n verde a crayÃ³n**, como el perro de *Un baiÃ³n*: rayones que dan la vuelta a la fruta, teÃ±idos
>   por la luz del farol. Es un tÃ­tere de siete piezas con zapatillas, y corre mirando para atrÃ¡s.
> - **Por los techos viene el bloque**: dos linternas barren los techos y lo persiguen de punta a punta de la chapa
>   que remata la medianera. AllÃ¡ jadea; tocado, salta.
> - **Comparte el baldÃ­o con el negro Atila** (#60): la chapa estÃ¡ en el mismo canto por donde Ã©l camina, delante
>   de Ã©l, y LimÃ³n corre delante de los dos. La sirena es del Atila; las linternas, de LimÃ³n.
> - **La ficha cuenta lo de Escobar con su rÃ³tulo**: testimonio del Indio en el memoir (`RES-21`) y hecho que el
>   LimÃ³n existiÃ³ (`RES-170`). El tema es de *Luzbelito* (1996), no de *Lobo suelto*.
> - Se escribiÃ³ como (10), pasÃ³ a la (11) y quedÃ³ en la (14) al juntar `main`.

> ## ðŸ„ LA VACA CUBANA, A PLUMÃN, CON LA TELE HECHA SATÃ‰LITE (2026-10-18) â€” decimotercera enmienda de `D-73`
>
> **En `main` desde el PR #62 (rama `ciclo-26/bestiario`), fusiÃ³n `250fb04`**; worktree `.claude/worktrees/bestiario-26`, sobre `main`
> en `c1355e0` y con `main` juntado en `e07fe38` (hasta el #61, Barbazul). Pedido del usuario: *"Hace otro ciclo
> sobre el bestiario redondo. Agrega otro personaje y pulilo a fondo, se creativo que qeude como uno de
> rocambole"*, y *"hace la vaca cubana"*.
>
> - **La vaca** (`arte-vaca.ts`, tÃ©cnica nueva en `plumin.ts`): plumÃ­n sobre aguada como el frente de *Un
>   baiÃ³n*, su disco, con las tintas medidas en la tapa (`--bestia-vaca-*`). Ojo humano vivo que sigue al
>   satÃ©lite. Vive en la punta de la pastura, en el recinto del monte y en el camino (`escena-vaca.ts`).
> - **El cielo**: la tele de la tapa hecha satÃ©lite cruza por arriba; tocada la vaca, se le cae un pedazo
>   prendido fuego (la llama de la contratapa, recortada de la tapa) al lado. Rumia con el bolo que sube
>   por el pescuezo, pasta, espanta moscas; al golpe, el cordero bala y el lobo se esconde
>   (`scripts/bestiario/vaca.ts`, desde `pastura.ts`).
> - **La historia** (`RES-360`, `INV-360`): el Indio cuenta en el memoir que a la vaca le cayÃ³ un pedazo de
>   satÃ©lite; un memo del Departamento de Estado de 1961 confirma, *segÃºn se informÃ³*, una vaca cubana muerta
>   por los restos del Thor-Ablestar del 30-nov-1960. Va en la ficha con los tres rÃ³tulos.
> - **Verde:** `npm test` (1691), `npm run check` y `npm run build`, en la rama con `main` adentro.
> - **Sin ver en el navegador**: la sesiÃ³n quedÃ³ aislada en el worktree y no pudo sumar su servidor al
>   `launch.json` de la carpeta principal. Antes del PR hay que mirarla a 375 px: la rumia, el satÃ©lite, la
>   caÃ­da y el camino de la pastura.
> - **Abierto:** `T-431`, `T-435`, `T-437`/`T-439` (ver la enmienda).
> ## ðŸ—ï¸ BARBAZUL, TALLADO, CON LA BARBA DE OTRA PLANCHA (2026-10-18) â€” enmienda (11) de `D-73`, ciclo 25
>
> **En main desde el PR #61** (rama `ciclo-25/bestiario`), fusiÃ³n `e07fe38`. Sacada
> de `ciclo-24/bestiario` (PR #56) en `82c4453`. Pedido del usuario, el de las dos vueltas anteriores: *"Agrega otro personaje y pulilo a
> fondo, se creativo que qeude como uno de rocambole"*.
>
> - **Barbazul recibe en la entrada de la prisiÃ³n** (`T-444`): tallado como el barbudo de la contratapa
>   de *Oktubre* (`arte-barbazul.ts`), y **la barba es otra plancha, azul y corrida de registro**. Mira a
>   la drÃ¡cula cuando pasa, se alisa la barba, sacude el manojo. Tocado, hace la reverencia del anfitriÃ³n
>   y al fondo se le entreabre el cuarto: la luz roja corre por el piso hasta sus pies. La llave chiquita
>   del manojo tiene la mancha del cuento.
> - **Verde:** `npm test` (1698), `npm run check`, `npm run build`, en la rama fusionada. Visto a 375 y 1280 px; la reverencia,
>   con movimiento reducido simulado (con el panel oculto el navegador casi no avanza cuadros).
> - **Para integrar** (`integrar.md`): si `main` se moviÃ³, juntarlo de nuevo. La (11) va despuÃ©s de la (10) de los
>   entornos (#57), que ya estÃ¡ en `main`; si otra rama llega antes con la (11), se renumera esta.
> - **Abierto:** `T-431`, `T-435` (el azul nuevo al lienzo), `T-437`/`T-439`.

> ## ðŸ§¥ EL NEGRO ATILA (2026-10-18) â€” duodÃ©cima enmienda de `D-73`
>
> **En main desde el PR #60** (rama `bestiario/negro-atila`, worktree `.claude/worktrees/bestiario-atila`), que entrÃ³ con `main` adentro
> en `168a1bd` (los seis entornos, PR #57, y el camino como puerta, PR #59). Pedido del usuario: *"Hace a El negro Atila para el bestiario redondo, diseÃ±alo como rocambole [...] chisotos y acido"*.
>
> - **A aerÃ³grafo, como la tapa de *Lobo suelto***: la cara partida en luz y sombra, el ojo ojeroso, la
>   bufanda acanalada como el pecho del lobo. Camina por la medianera del baldÃ­o, hundido en el gabÃ¡n,
>   mascando el frÃ­o (vaho). Cuando pasa la sirena de ocasiÃ³n se tira del otro lado y lo delata el vaho.
> - **Tocado, abre el gabÃ¡n**: relojes, cucharitas, el eslabÃ³n de la cadena del lobo, la dentadura del canÃ­bal
>   desdentado y la sirena de la cana. Tres testimonios del memoir (`RES-21`, p. 321).
> - **Verificado**: tests, una simulaciÃ³n de la conducta y el panel a 375 px, que estaba oculto: **la animaciÃ³n no
>   se vio correr** (`T-480`).

> ## ðŸ‘£ AL BESTIARIO SE ENTRA CAMINANDO, Y SUENA (2026-10-18) â€” `D-76`
>
> **En main desde el PR #59** (rama `bestiario/entorno-primero`), fusiÃ³n `168a1bd`.
> Pedido del usuario: *"El entorno caminable debe ser lo principal del bestiario [...] que para salir debas tocar
> algo"* y *"que se escuchen otras cosas, pasos, sonidos de los personajes, ruidos del entorno"*.
>
> - **La puerta es el monte.** La home y la Redondopedia llevan al camino. El plano queda a un toque ("Al plano").
> - **Pantalla entera.** Andando, el camino es la pÃ¡gina: no hay nada abajo del cruce, no rebota, y se sale tocando.
>   La lista de fichas se abre con "MirÃ¡ la lista". Sin JavaScript, todo igual que antes.
> - **Suena, si lo prendÃ©s.** Recortes del disco del entorno, de lejos y filtrados: *Lobo suelto* en el monte,
>   *Cordero atado* en la pastura. MÃ¡s pasos atados al scroll, viento, grillos, una lechuza y el cencerro, todo
>   sintetizado, sin archivos.
> - **QuÃ© se graba, quÃ© se baja y quÃ© se sintetiza**, regiÃ³n por regiÃ³n: `Docs/SUGERENCIAS/HILO-sonidos-del-bestiario.md`.
>   La risa del gordo Pierre la grabÃ¡s vos; los animales y los cristales, de Freesound CC0.
> - **Abierto:**
>   - `T-481`: el verso de cada personaje. Faltan el minuto de cada verso y los temas enteros en disco.
>   - `T-482`: los sonidos grabados y los bajados.
>   - `T-483`: probarlo en un telÃ©fono de verdad.
> - **Verde:** `npm test` (1691), `npm run check`, `npm run build`. Visto en el panel a 375Ã—812.

> ## ðŸŽ¨ LOS SEIS ENTORNOS, CADA UNO EN SU TAPA (2026-10-18) â€” dÃ©cima enmienda de `D-73`
>
> **En `main` desde el PR #57 (rama `bestiario/fondos-rocambole`), fusiÃ³n `46d36d1`.** Pedido del
> usuario: *"ArmÃ¡ un fondo bien rocambole para cada uno de los entornos del bestiario redondo"*, con el camino
> scrolleable en mente.
>
> - **Cierra `T-443`**: el galpÃ³n (*En directo*), el Ã¡rbol del gran bonete (*Luzbelito*), Cybersiberia (*Ãšltimo
>   bondi*, con nieve), los astilleros (*Cordero atado*, disco 2), la mesa (*La mosca y la sopa*, con la mosca
>   pintada: `T-442`) y la ruta (el surco del disco, con los cuatro fierros que pasan) son recintos de noche a
>   aerÃ³grafo, con los colores medidos en las tapas. La prisiÃ³n la hizo la rama de la drÃ¡cula.
> - **Mejorados**: el infierno tiene piso de damero de salÃ³n de baile; el templo, serpentinas y papel picado.
> - **Listos para el camino**: cada capa es `(ancho, alto)`, los hitos en el piso, la geometrÃ­a en
>   `rig-entornos.ts`, y `luzQueAsoma` para anunciar cada regiÃ³n desde la vecina.
> - **Verde:** `npm test` (1687), `npm run check`, `npm run build`. Visto en el navegador del panel a 375 y 800 px, y con la
>   carga de a una.
> - **EntrÃ³ despuÃ©s** del camino (PR #54, enmienda 7), la drÃ¡cula y la carga de a una (PR #56, enmiendas 8 y 9)
>   y la Redondopedia de noche (PR #55, `D-75`). Las escenas nuevas pasan por `enEspera` como las demÃ¡s: se arman
>   cuando el recinto se acerca.

> ## ðŸŒ‘ LA REDONDOPEDIA DE NOCHE (2026-10-17) â€” `D-75`
>
> **En `main` desde el PR #55 (rama `diseno/redondopedia-inmersiva`), fusiÃ³n `b6e9957`.** Pedido
> del usuario: *"Hace una pulida extrema
> de ui/ux a la redondopedia, debe sentirse inmersiva, misteriosa y mistica. Al mismo tiempo debe ser
> facil de leer y que leyendo algo te de ganas de seguir con otra cosa"*.
>
> - **El lugar:** cada artÃ­culo trae su tapa velada subiendo desde arriba de la ventana, detrÃ¡s del
>   tÃ­tulo, y se pierde en la tinta antes del cuerpo. Un disco trae la suya; los demÃ¡s, la de su
>   categorÃ­a; los tres graves, nada. Pasar de un artÃ­culo a otro corre la cÃ¡mara de una tapa a la otra
>   (el nombre `lugar` de `ADR-03`, sin sumar uno). La portada usa la misma capa con *Gulp!*.
> - **El tÃ­tulo en la letra de la banda** (Redonditos de Ricota Fan), si entra entero, en la tinta de
>   su disco y con sal. *Luzbelito* y Los Decoradores van en la rotulada, *Oktubre* en `--texto` sobre
>   su tapa, y los graves como siempre.
> - **Los hilos del pie:** "SeguÃ­ por acÃ¡" con tarjetas que traen el gancho, si hay leyenda, quiÃ©n da
>   testimonio y los minutos; "ParÃ¡ la oreja", una leyenda de otro artÃ­culo con su rÃ³tulo (solo las que
>   *se cuentan*, nunca de un grave); y "TambiÃ©n anda por", los artÃ­culos que lo nombran.
> - **La portada:** una leyenda por noche, la clave de rÃ³tulos en tres renglones, los saltos a cada
>   parte, los diez discos con su tapa y su aÃ±o, y lo leÃ­do apagado.
> - **La lectura:** el cuerpo a 17 px. Nada se mueve adentro del cuerpo, y los rÃ³tulos no se tocaron.
> - **Verde:** `npm test` (1668), `npm run check` y `npm run build`. Mirado a 375 px y a 1366 px.
> - **En el lienzo** (`T-450`, hecha): hoja 17, "La Redondopedia de noche", versiÃ³n 20, en la
>   pÃ¡gina AplicaciÃ³n, debajo de la 11.
> - **`UX-39` escrita** (`T-451`, hecha por `experiencia`), con la enmienda de `UX-20` Â§2. De sus
>   huecos se cerraron A1, A2, A7 y la excepciÃ³n de `:visited` (en `diseno-marca.md`).
> - **Abierto, sin trabar:** `T-452`, los ganchos, la ronda de la oreja, los "los fans" de la prosa
>   y los ganchos alrededor de los graves (`contenido`, `UX-39` A6); `T-453`, probarlo en un iPhone con
>   los criterios M1 a M7 de `UX-39` Â§10; que En vivo tome el lugar (`UX-39` A4). La propuesta estÃ¡ en
>   `Docs/SUGERENCIAS/HILO-para-experiencia-y-contenido-d75-la-redondopedia-de-noche.md`.

> ## ðŸ¦‡ LA DRÃCULA CON TACONES, TALLADA COMO OKTUBRE, Y LA CARGA DE A UNA (2026-10-18) â€” octava y novena enmiendas de `D-73`, ciclo 24
>
> **En `main` desde el PR #56 (rama `ciclo-24/bestiario`).** Pedido del
> usuario, el mismo de Pierre: *"Agrega otro personaje y pulilo a fondo, se creativo que quede como uno de
> rocambole"*; eligiÃ³ *"Otro mÃ¡s, encima del #52"*.
>
> - **La prisiÃ³n de Barbazul es el sexto recinto de noche**: un pasillo de celdas **tallado como la gente de la
>   tapa de *Oktubre*** (`grabado.ts`: la plancha negra, la luz sacada a gubia, motas de prensa). Por la ventana
>   enrejada se ve **la gente de la tapa de verdad**, y sus cinco banderas, recortadas de ahÃ­, flamean afuera.
> - **La drÃ¡cula con tacones** (*"Preso en mi ciudad"*), tallada en la misma tÃ©cnica y recortada en trece piezas.
>   Taconea por el pasillo; tocada, **abre la capa como dos puertas de papel** y el forro es el rojo de las
>   banderas. La jaula vacÃ­a de la fiera se toca: la puerta chirrÃ­a.
> - **Verde:** `npm test` (1668, ya con el camino), `npm run check`, `npm run build`. Visto a 375 y 1024 px; la capa abierta, con
>   movimiento reducido simulado (con el panel oculto el navegador frena los cuadros).
> - **Y la carga de a una (`T-445`, novena enmienda de `D-73`)**: cada escena de noche y cada retrato del Ã­ndice
>   esperan en un `<noscript>` (`carga.ts`) y la isla los arma a una pantalla y media. Al abrir, la pÃ¡gina bajaba
>   59 piezas y 1673 kB; ahora, arriba de todo, solo el monte: 10 piezas, 466 kB. Sin JavaScript se ve todo igual.
> - **Abierto:** `T-444` (Barbazul), `T-431`, `T-435`, `T-437`/`T-439` (la mitad que pide un telÃ©fono), `T-443`
>   (seis recintos; la sesiÃ³n de `bestiario/fondos-rocambole` estÃ¡ con los fondos de esos seis: sus escenas tienen
>   que pasar por `enEspera`).
> - **Al integrar, con el camino ya en `main` (PR #54)**: las dos enmiendas se escribieron como sÃ©ptima y octava y pasaron
>   a octava y novena. La ficha vive en `FichaBestia.astro`, que comparte el camino: sus retratos esperan solo si la pÃ¡gina
>   lo pide (`espera`), y lo pide la del bestiario. `recintoDeLaDracula` toma los ayudantes de `scripts/bestiario/articular.ts`.
>   `bestiario/fondos-rocambole` tenÃ­a su enmienda como (9): ahora le toca la (10).

> ## ðŸŒ² EL CAMINO CON CRUCES: EL BESTIARIO SE CAMINA (2026-10-18) â€” `D-73`, enmienda 7
>
> **Integrada a `main` con el PR #54**, desde la rama `bestiario/camino-con-cruces` sobre `159b1bc`. La fusionÃ³ Claude a
> pedido del usuario (*"integra a main"*). Se escribiÃ³ como novena enmienda de `D-73` y se renumerÃ³ a sÃ©ptima al integrar,
> porque llegÃ³ antes que la drÃ¡cula y la carga de a una (`ciclo-24/bestiario`), que pasan a octava y novena.
> Pedido del usuario: que los entornos estÃ©n conectados y sea una aventura scrolleable donde aparecen
> los personajes y se elige con flechas adÃ³nde ir. Se investigaron cinco formas y eligiÃ³, textual: *"Dale con
> el camino con cruces: una pÃ¡gina por regiÃ³n, scroll que camina de costado y flechas en el cruce. ArrancÃ¡ por el monte
> y la pastura como prueba."*
>
> - **`/redondopedia/bestiario/el-monte/` y `/la-pastura/`**: bajar camina la escena de costado (lejos 0,45, piso 1,
>   frente 1,3; un pÃ­xel de bajar es un pÃ­xel de caminar). Los ojos se encienden al llegar, el lobo asoma cuando lo
>   tenÃ©s cerca y te sigue con la cabeza, y en la pastura el lobo y el cordero viven como en su recinto. Al final, el
>   cruce: un cartel por regiÃ³n vecina con la flecha segÃºn el plano redondo; las que todavÃ­a no se caminan llevan a
>   su recinto ("EN EL PLANO"). El recinto del monte suma la puerta "EntrÃ¡ caminando".
> - **Lo que tocÃ³ de lo existente:** la lÃ³gica del lobo y el cordero pasÃ³ a `scripts/bestiario/pastura.ts` (la usan
>   las dos islas), la ficha a `components/bestiario/FichaBestia.astro`, `arte.ts` separa `claroDeLaPastura()`, y la
>   imprenta imprime tambiÃ©n `PIEZAS_CAMINO` (cuatro piezas, 567 kB).
> - **Molinetes:** sin JavaScript o con movimiento reducido, la escena es una tira que se corre con el dedo, con todo a
>   la vista y los tÃ­teres en pose quieta.
> - **Verde:** `npm test` (1662), `npm run check` y `npm run build`. Probado en el navegador a 390 px y a 1280 px:
>   caminar, el lobo que asoma, tocar al cordero, abrir la ficha, la libreta, ir y volver por el cruce, la vista sin
>   JavaScript y la de movimiento reducido.
> - **Coordinado con la sesiÃ³n de los fondos** (`bestiario/fondos-rocambole`): arma el arte de seis entornos con
>   funciones `(ancho, alto = 640)` segÃºn la especificaciÃ³n del camino, para que cada tramo nuevo las use (`T-470`).
> - **Abierto, sin trabar:** `T-470` (los otros tramos), `T-471` (telÃ©fono de verdad), `T-472` (`experiencia`),
>   `T-473` (el recinto del monte sin JavaScript dibuja los tÃ­teres enormes, defecto previo) y `T-474` (lienzo).
> - **`ciclo-24/bestiario` (la drÃ¡cula y la carga de a una) choca al integrar**: las dos ramas tocan `bestiario.astro` y
>   `scripts/bestiario.ts`, y como esta entrÃ³ primero, acomoda aquella: la ficha de `FichaBestia.astro` tiene que dibujar los
>   retratos con `enEspera(...)` de `carga.ts`, y el test que cuenta tres `enEspera(` en `bestiario.astro` se ajusta;
>   `recintoDeLaDracula` importa `partes`, `girar`, `parpado`, `hacia` y `suave` de `scripts/bestiario/articular.ts`.

> ## ðŸ“¼ EL BESTIARIO ENTRA A LA HOME (2026-10-17) â€” casete B3 del lado B
>
> **En `main` desde el PR #53 (rama `portal/bestiario-en-la-home`).** Pedido del usuario: *"SumÃ¡ el bestiario a la home, en
> el lado B, con la voz y el diseÃ±o del resto de los casetes"*. Hasta hoy se llegaba solo desde la portada de la
> Redondopedia.
>
> - **El casete**: Â«Bestiario redondoÂ», B3, despuÃ©s de la Redondopedia. Canta *"El lobo afuera, el cordero atado al
>   palo."*, viste *Lobo suelto* (`mitologia`) con el cordero recortado de *Cordero atado* (la pieza que no usaba
>   nadie, `D-49`), y el sello dice Â«RECORRÃ‰Â».
> - **Un solo lado B**: `LADO_B` en `sitio/copy.ts` lo leen el portal, la carÃ¡tula de cada juego (que ahora lista el
>   B3) y los tests. En la compu los dos lados van de a tres por renglÃ³n.
> - **Verde:** `npm test` (1653), `npm run check`, `npm run build`. Visto a 375, 900 y 1440 px.

> ## ðŸ¾ EL GORDO PIERRE, A PINCEL SECO (2026-10-17) â€” sexta enmienda de `D-73`, ciclo 23
>
> **En `main` desde el PR #52 (rama `ciclo-23/bestiario`).** Pedido del usuario: *"Agrega otro personaje y pulilo a
> fondo, se creativo que quede como uno de rocambole"*.
>
> - **El bajo inundado es el quinto recinto de noche**: la Esquina del Sol con el agua adentro (`RES-340`), en
>   el crayÃ³n de *Un baiÃ³n* â€”la pared y el agua son la contratapa mismaâ€”. El agua entra por el vidrio roto de la
>   puerta, afuera llueve, y en el escenario quedaron el bafle, el micrÃ³fono y el bombo con un sol pintado.
> - **El gordo Pierre**, inventado en la estÃ©tica de *Gulp!*, su disco: pincel seco y fotocopia (`pincel.ts`),
>   en claroscuro, recortado en papel como un tÃ­tere de seis piezas. La etiqueta de la botella es el Â«gulp.Â» de
>   la contratapa, lo Ãºnico de Ã©l que sale de una tapa. Flota, se empina la botella, y tocado se rÃ­e hasta que
>   tose; se refleja en el agua y le hace ondas.
> - **Pulida**: la isla ya no se lleva el aerÃ³grafo al telÃ©fono (33,6 â†’ 22,1 kB, y un test lo vigila).
> - **Verde:** `npm test`, `npm run check`, `npm run build`. Visto a 375 y 1280 px en el navegador del panel.
>   Falta en un telÃ©fono de verdad (`T-437`, `T-439`): con el panel oculto no se pudieron medir los cuadros.
> - **Abierto:** `T-443` (siete recintos con figuras del plano), `T-442` (la mosca), `T-435` (las tintas nuevas
>   al lienzo), `T-431` (que `contenido` lea la estampa de Pierre).

> ## ðŸ  EL SITIO SE MUDÃ“ A UNA CUENTA HOBBY DE VERCEL (2026-10-17) â€” `D-74`
>
> Pedido del usuario: liberar la cuenta Pro para otro proyecto. **Hecho y verificado en vivo:** el proyecto
> `arcade-ricotero` vive ahora en otra cuenta de Vercel, equipo Hobby `knesantos`, y despliega `main` desde
> GitHub. `fichinricotero.com.ar` pasÃ³ con *Verify & Claim*; NIC sigue delegando a `ns1/ns2.vercel-dns.com`.
> El proyecto viejo del Pro estÃ¡ borrado.
>
> - **MuriÃ³ `arcade-ricotero.vercel.app`** (404). La direcciÃ³n de Vercel nueva es `arcade-ricotero-ochre.vercel.app`.
> - **El repo es pÃºblico desde el 2026-10-17.** Con el repo privado, Vercel Hobby frenÃ³ la vista previa del PR #51
>   aunque el commit lo firmaba `knesantos`. En repos pÃºblicos no hace ese chequeo. Detalle en `D-74`.
> - **Pendiente del usuario:** borrar el TXT `_vercel`, confirmar Analytics *Enabled* en Hobby y probar un
>   despliegue del otro proyecto del Pro.

> ## ðŸ”§ LA PULIDA DEL BESTIARIO (2026-10-16) â€” quinta enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Recorrido entero a 375 y 1280 px. El bocadillo ya no se va
> de la pantalla en las escenas anchas; cada escena de noche arranca mirando a su protagonista y avisa que se
> desliza; en la compu entran enteras; las fichas de los cinco de tapa muestran su recorte; el Ã­ndice sigue el
> orden del recorrido y cada recinto tiene "VolvÃ© al plano". **Verde:** `npm test` (1647), `npm run check`,
> `npm run build`. Pendiente igual que antes: `T-437`/`T-439` (telÃ©fono real, carga diferida de imÃ¡genes).

> ## ðŸ•¯ï¸ TRES MÃS DE TAPA: EL PERRO, LUZBELITO Y MOMO (2026-10-16) â€” cuarta enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"ElegÃ­ otras 3 bestias y continuÃ¡
> haciÃ©ndolas"*.
>
> - **El perro de *Un baiÃ³n*** ("ese perro que sigue allÃ­") entra por el borde del baldÃ­o, rayado a crayÃ³n, y ladra.
> - **Luzbelito**, la cabeza con la vela de su tapa, en su piedra del infierno; el fuego es la pincelada de *Gulp!*
>   teÃ±ida de brasa. La llama titila.
> - **El medallÃ³n de Momo** cuelga en su templo, negro y plata, bajo una guirnalda de focos; se mece y gira al tocarlo.
> - Los demÃ¡s de esos recintos, ojos en lo oscuro. Van cuatro recintos de noche de doce.
> - **Verde:** `npm test` (1646), `npm run check`, `npm run build`. Visto a 375 px con el reloj de reemplazo (panel
>   oculto); los tres responden al toque.
> - **Abierto:** `T-442` (la mosca), `T-443` (los ocho recintos que quedan).

> ## ðŸº EL LOBO Y EL CORDERO SON LAS TAPAS (2026-10-16) â€” tercera enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"Animados se refiere a que se muevan, no
> estilo cartoon. Deben ser lo mÃ¡s fiel posible al diseÃ±o real"*.
>
> - **Recortados de los frentes del disco doble** (`recortes.ts`, `scripts/recortar-bestiario.mjs`), no redibujados:
>   el lobo es el busto de la tapa y acecha asomÃ¡ndose desde lo oscuro detrÃ¡s de la pastura; el cordero es la
>   criatura entera de su tapa y camina con sus dos patas, atado al palo.
> - **Inventado, en la estÃ©tica**: el monte, la pastura, el lomo que completa al cordero donde la tapa lo corta, los
>   pÃ¡rpados y los ojos de los demÃ¡s bichos.
> - **Verde:** `npm test` (1645), `npm run check`, `npm run build`. Visto a 375 px con un reloj de reemplazo (el panel
>   estaba oculto). Falta en un telÃ©fono de verdad (`T-437`, `T-439`).
> - **Abierto:** `T-440` (los demÃ¡s recintos con este criterio), `T-441` (la cadena del lobo suelta).

> ## ðŸŒ‘ EL MONTE DE NOCHE, A AERÃ“GRAFO (2026-10-16) â€” segunda enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"Que sea el arte mÃ¡s oscuro, no
> tan infantil [...] que se note mÃ¡s que se basa en arte de Rocambole [...] MÃ¡s espacio."*
>
> - **TÃ©cnica nueva**: aerÃ³grafo en SVG (`aerografo.ts`, `arte.ts`) impreso una vez con `sharp` a
>   `public/bestiario/*.webp` (`npm run imprimir-bestiario`, 20 piezas, 272 kB). Sin contornos. El navegador solo
>   mueve las piezas.
> - **El recinto del monte**: de noche, 900 Ã— 640, se recorre de costado en el telÃ©fono. Lobo y cordero
>   redibujados a aerÃ³grafo desde las tapas; los demÃ¡s bichos son ojos que miran desde lo oscuro.
> - **Verde:** `npm test` (1644), `npm run check`, `npm run build`. Visto a 375 px con un reloj de reemplazo
>   (el panel estaba oculto). Falta en un telÃ©fono de verdad (`T-437`, `T-439`).
> - **Abierto:** `T-438`, los demÃ¡s recintos con el mismo mÃ©todo; `T-435`, las tintas al lienzo.

> ## ðŸ‘ EL BESTIARIO SE VUELVE ZOOLÃ“GICO (2026-10-16) â€” enmienda de `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`).** Pedido del usuario: *"personajes con diseÃ±os lindos,
> al estilo rocambole, animados y viviendo en su entorno [...] algo asi como un zoologico"*.
>
> - **El recorrido**: el mapa redondo es el plano de la entrada; abajo, doce recintos en scroll, cada uno con
>   su cartel. Tocar un bicho lo hace reaccionar y decir su verso en un bocadillo; desde ahÃ­, la ficha.
> - **Recinto 1, terminado**: el monte de tiras dentadas en sepia (contratapa de *Lobo suelto*) y la pastura
>   naranja de *Cordero atado*. El lobo y el cordero son tÃ­teres por piezas, fieles a las tapas
>   (`titeres.ts`): el lobo ronda la pastura del lado del cordero, el cordero pasta y huye hasta que la soga
>   lo frena, y se lo puede arrastrar sin que salga del cÃ­rculo.
> - **Los otros once recintos**, con las figuras de la primera vuelta, que respiran y saltan, hasta que les
>   llegue su arte (`T-436`).
> - **Verde:** `npm test` (1643), `npm run check`, `npm run build`. Visto a 375 px. La animaciÃ³n se comprobÃ³
>   con un reloj de reemplazo, porque el panel del navegador estaba oculto: el lobo rodea y el cordero huye
>   con la soga tensa. Falta verla en un telÃ©fono (`T-437`).
> - **Abierto:** `T-435` (las tintas nuevas al lienzo), `T-436` (el arte de los demÃ¡s recintos), `T-437`.

> ## ðŸº EL BESTIARIO REDONDO (2026-10-16) â€” `D-73`, ciclo 22
>
> **En `main` desde el PR #49 (`fca4682`); la rama `ciclo-22/bestiario` saliÃ³ de `fdaea84`.** Se trabajÃ³ en un worktree
> (`.claude/worktrees/bestiario`) para no mezclarse con la vuelta de `INV-300`, que sigue sin commitear en la
> carpeta principal. Pedido del usuario: *"Analiza diseÃ±a y construi el bestiario redondo. Arma una lista de
> TODOS los personajes que son parte de la mitologia de los redondos [...] que se puede recorrer desde arriba
> y entrar a ver el entorno mas en detalle"*.
>
> - **La pÃ¡gina** (`/redondopedia/bestiario/`, puerta en la portada de la Redondopedia): **120 bichos y
>   personajes** sacados de las 104 letras, mÃ¡s Patricio Rey y los buÃ±uelos, que son del mito. Cada uno con el
>   verso exacto de su tema, cotejado a mÃ¡quina contra `cancionero.json` (`bestiario.test.ts`), su estampa y,
>   cuando hay, lo que se cuenta rotulado.
> - **El mundo redondo**: un mapa circular visto desde arriba, con el galpÃ³n de Patricio Rey en el medio, once
>   regiones alrededor y la ruta del Ãºltimo bondi por el borde. La pastura es un claro adentro del monte: el
>   cordero atado al palo y el lobo suelto acechando en el borde. El bajo inundado del gordo Pierre (botella,
>   puerta con el vidrio roto) toca el infierno por las sirenas y el barro. Se toca una regiÃ³n y la cÃ¡mara baja;
>   de cerca se viaja a la de al lado; cada bestia abre su ficha, suena diez segundos del tema y queda anotada en
>   el telÃ©fono.
> - **El gordo Pierre tiene historia** (`RES-340`, `INV-340`): la noche de lluvia en La Esquina del Sol con la
>   sala inundada y el vidrio de una puerta roto (testimonio del Indio), la versiÃ³n donde Pierre lo niega
>   (testimonio) y la del dueÃ±o del bar (leyenda).
> - **Verde:** `npm test` (1639), `npm run check` y `npm run build`. Visto en el navegador a 375 px y en
>   escritorio: entrar por un rÃ³tulo, viajar por "Al lado", abrir una ficha desde el mapa y desde la barra,
>   escuchar, cerrar con Escape, volver al mapa, y la libreta.
> - **Abierto, sin trabar** (`D-73`): `T-431` que `contenido` lea las estampas; `T-432` que `investigador`
>   confirme de primera mano la noche de La Esquina del Sol en el memoir; `T-433` que `experiencia` diga si hace
>   falta arrastrar el mapa con el dedo; `T-434` probarlo en un iPhone.

> ## ðŸ“š UNA VUELTA ENTERA DE INVESTIGACIÃ“N PARA LA REDONDOPEDIA (2026-10-15) â€” `INV-300`
>
> **En `main` desde el PR #64 (rama `investigacion/inv-300-wiki`).** QuedÃ³ sin commitear en la carpeta principal hasta el 2026-10-18, cuando se guardÃ³ tal cual. Pedido del usuario:
> *"Hace una vuelta entera de buscar mas informacion en la wiki para la web y juegos"* (la wiki es la
> Redondopedia).
>
> - **La wiki de fans se lee entera** (`RES-300`): el 402 de `RES-86` era de la herramienta, no del sitio.
>   Por la API salen 329 artÃ­culos, con 99 recitales con lista (1978â€“2001), 63 temas, 14 inÃ©ditos y 11
>   personas. Cotejado contra Wikipedia y el memoir: lo que se confirma va como hecho o testimonio, y el
>   resto como leyenda, porque la wiki se contradice sola (`RES-301`).
> - **Lo que mÃ¡s le falta a la Redondopedia:** Sidotti y Dawi (ninguno de los dos tiene artÃ­culo), los
>   inÃ©ditos, *En directo*, los monologuistas, Racing 98, River 2000, OlavarrÃ­a 97 con Tandil, y la
>   Ãºltima noche en CÃ³rdoba. La lista va en `Docs/SUGERENCIAS/HILO-para-contenido-y-arquitectura-inv300-la-wiki.md`.
> - **Cierra dudas abiertas:** `RES-308` (OlavarrÃ­a *y* Tandil: la conferencia de prensa fue por la
>   prohibiciÃ³n de OlavarrÃ­a, y el recital terminÃ³ en Tandil), y `RES-235`/`RES-236` de `INV-425`.
> - **Primer lote escrito (2026-10-16, `CNT-42`):** `walter-sidotti`, `sergio-dawi` y
>   `temas-fuera-de-los-discos` (los inÃ©ditos), y la correcciÃ³n de `semilla-bucciarelli`: tocÃ³ el bajo
>   desde 1982 y no desde 1987 (`RES-337`). La Redondopedia queda en 41 artÃ­culos. La frase "la favorita
>   de muchos" sobre *Mi genio amor* es de Marcelo Figueras, el entrevistador del memoir, no del Indio:
>   corregida en el artÃ­culo, en `INV-300` y en `CNT-42`. Verde: `npm test` (1628) y los tests de la
>   Redondopedia y de la voz despuÃ©s del Ãºltimo cambio. Visto a 375 px.
> - **Abierto, sin trabar:** que `contenido` siga con Crook, Fargo, Ãbalos, Jolivet, los monologuistas
>   y los hitos (*En directo* como disco nÃºmero 11 choca con el test que fija diez discos: es una
>   decisiÃ³n de `producto`); que `arquitectura` decida si las 99
>   listas CC-BY-SA entran a `recitales.json` (pasarÃ­a entero a BY-SA, `CTR-19.8`). Los scripts que
>   regeneran todo estÃ¡n en `Docs/INVESTIGACION/INV-300/`.

> ## ðŸŽ¤ LOS RECITALES EN PANTALLA Y "ARMÃ TU RECITAL" (2026-10-15) â€” `D-72`, ciclo 21
>
> **Integrada a `main` el 2026-10-16 con el PR #47 (fusiÃ³n `d5f5837`)**, desde la rama `ciclo-21/recitales`
> sobre `afbe3ff`. La fusionÃ³ Claude a pedido del usuario (*"IntegrÃ¡ el PR #47 a main"*). Pedido del usuario: *"Hace la idea
> 15, hace al mismo tiempo el juego de CREAR tu propio recital. Esta muy bueno aprovechar los recortes de
> temas para cuando aparece en pantalla mostrarlo."*
>
> - **"En vivo"** (`/redondopedia/en-vivo/`, `IDEA-15`): **27 listas enteras**, por aÃ±o y plegadas: las dos de
>   MusicBrainz (Concordia, diciembre de 1995) y 25 de Discogs (casetes piratas de 1987 a 2000, `INV-425`),
>   estas con el sello "SIN REVISAR" que pidiÃ³ el usuario. Cada una con su rÃ³tulo de fuente y licencia y los
>   bises que marca la fuente; lo que mÃ¡s aparece en las 256 listas de setlist.fm, con su rÃ³tulo; y el
>   Ã­ndice de 40 noches con el enlace a cada lista. Cada tema con recorte suena al tocarlo, y cada lista
>   entera suena de corrido, diez segundos por tema. Puerta aparte arriba de la portada de la Redondopedia.
> - **"ArmÃ¡ tu recital"** (`/juegos/arma-tu-recital/`, A10, viste *Oktubre*, `IDEA-16`): **una expresiÃ³n de
>   deseo, hoy** (enmienda de `D-72`). ElegÃ­s un estadio o un teatro de todo el paÃ­s
>   (`lugares-recital.json`), un descampado en la localidad que escribas, o escribÃ­s el lugar; armÃ¡s la
>   lista con los 105 â€”con buscador y la tira de tapas, en orden, con hasta cuatro bisesâ€” y cada tema
>   suena al sumarlo, con el "SUENA" siempre a la vista en el pie. Al cerrar, la noche suena entera marcando el renglÃ³n. Dice
>   cuÃ¡nto dura con las duraciones de los discos. Sin puntaje (`BR-22`). Se comparte como direcciÃ³n y como
>   hoja (la lÃ¡mina de "Ponelos en fila", con la tinta de *Oktubre* y un tema por renglÃ³n), y se baja.
> - **Lo que tocÃ³ de lo existente:** la quinta forma de link en `desafio.ts` (fuera de la uniÃ³n), dos campos
>   opcionales en la lÃ¡mina, el permiso de t8 para que solo "En vivo" lea las listas enteras (`CTR-19.8`), y
>   las tildes del texto de `cambios` de `recitales.json`, que ahora se lee.
> - **RevisiÃ³n independiente** (`REV-23`, `FIND-153`..`FIND-168`): ninguna alta; cuatro medias (foco al cambiar
>   de pantalla y al sumar, la lista que seguÃ­a sonando, la lista guardada que se borraba) y doce bajas, entre
>   ellas rÃ³tulos de "En vivo" que afirmaban mÃ¡s de lo que dicen los datos. Se arreglaron todas.
> - **Verde:** `npm test` (1628), `npm run check` y `npm run build`. Jugado en el navegador a 375 px y en
>   escritorio: armar, mover a los bises, cerrar, escuchar la noche, abrir el link en limpio, la hoja.
> - **Abierto, sin trabar:** de Discogs, confirmar el volcado CC0 y los "datos restringidos", y las fechas en
>   disputa; el Fandom no entra hasta confirmar su licencia (`INV-425`, "Sin resolver"). `T-427`, que `investigador` confirme los nombres de los 34 estadios y teatros
>   y `contenido` lea la lista; `T-421`..`T-425`, los documentos de cada rol, con la propuesta en
>   `Docs/SUGERENCIAS/HILO-para-todos-d72-los-recitales.md`; `T-426`, probarlo en un iPhone (la noche
>   sonando de corrido y el pie con la barra de Safari). Lo que mÃ¡s le sumarÃ­a a "En vivo": mÃ¡s listas
>   enteras con licencia abierta (`T-425`, `investigador`).

> ## â“ PREGUNTAS RICOTERAS SE REHACE ENTERO: SE SIENTE COMO UN FICHÃN (2026-10-15) â€” `D-71`, ciclo 20
>
> **Integrada a `main` el 2026-10-15 con el PR #45 (fusiÃ³n `e6c3139`)**, desde la rama `ciclo-20/preguntas-ricoteras`
> sobre `243495d`. La fusionÃ³ Claude a pedido del usuario (*"IntegrÃ¡ el PR #45 a main"*). Pedido del usuario:
> *"Hace un ciclo entero mejorando la ui/ux del juego de preguntas ricoteras. Que la mejora sea total de
> como se siente, hoy esta muy duro y feo. Mejoremos el banco de preguntas, como estan escritas las
> preguntas todo."* (El ciclo 19 fue la noche ricotera, `D-62`.)
>
> - **La pantalla** (`partida.ts`, bloque `D-71` de `juego.css`): tablero con las tres fichas, el `NÂº` y
>   un riel por escalÃ³n; "CerrÃ¡ la partida" arriba a la derecha; la pregunta como recorte con cinta en
>   la tinta de su categorÃ­a; opciones con letra (y teclas 1â€“4 / Aâ€“D con el foco en la partida); la
>   respuesta con el grito estampado, la racha (3, 5, 10 al hilo), la correcta escrita grande y **la
>   tapa del disco**; `SEGUÃ` pegado abajo; el resultado con el `NÂº` grande y **la planilla** pregunta
>   por pregunta, que tambiÃ©n viaja al compartir (â—† âœ•). La lÃ³gica de `BR-19` no se tocÃ³; lo nuevo que
>   lee la partida vive en `src/lib/quiz/recorrido.ts`, con tests.
> - **El banco** (`CNT-41`): 44 preguntas, 14 fÃ¡cil / 15 media / 15 difÃ­cil, 11 por categorÃ­a. 19
>   retiradas, 22 reescritas, 23 nuevas (`QZ-044`..`QZ-066`), tres con verso. Los fÃ¡ciles los saca el
>   que fue a una previa. 23 Ã­tems traen `disco` (campo nuevo de `CTR-02`, y `fuentes` acepta `RES-`
>   de tres dÃ­gitos).
> - **RevisiÃ³n independiente** (`REV-22`, `FIND-141`..`FIND-152`): una alta (`QZ-064` ponÃ­a en Tandil
>   la conferencia de prensa que el memoir ubica en OlavarrÃ­a, 1997), dos medias y nueve bajas. Se
>   arreglaron todas. `voz.test.ts` ahora audita el banco del quiz y conoce Â«showÂ».
> - **Verde:** `npm test`, `npm run check` y `npm run build`. Jugado en el navegador a 375 px y a
>   1024 px.
> - **Abierto, sin trabar:** `T-412` (`experiencia`: `UX-01`/`UX-07` y la hoja 09 del lienzo) y
>   `T-413` (`arquitectura`: asentar `disco` y el patrÃ³n de `fuentes` en `CTR-02`), nota en
>   `Docs/SUGERENCIAS/HILO-para-experiencia-y-arquitectura-d71-el-quiz.md`. `investigador`: RES-05 y
>   N-016 (OlavarrÃ­a o Tandil), matizar RES-07, la advertencia de Patricia Rey, y los pedidos de
>   `CNT-41` Â§6. Probarlo en un telÃ©fono de verdad (la barra del `SEGUÃ` con la de Safari).

> ## ðŸƒ PONELOS EN FILA SE REPARTE DE A UNA, CON FILAS PROPIAS Y LOS 105 TEMAS (2026-10-10) â€” `D-69`, `D-70`
>
> **Integrada a `main` el 2026-10-10 con el PR #43 (fusiÃ³n `2ffdf4c`)**, desde la rama `ponelos/filas-propias`
> sobre `41292f9`. La fusionÃ³ Claude a pedido del usuario (*"cuando termine integra todo a main"*). Pedidos del usuario:
> editar y sumar las filas, una tier list de *todos* los temas con su disco, que se vea mÃ¡s lindo y sea
> mÃ¡s fÃ¡cil y divertido, que mÃ¡s fichas estÃ¡ bien, y que suene el recorte de cada tema (en una ficha de
> disco, temas de ese disco, uno detrÃ¡s de otro).
>
> - **El mazo:** abajo va la que sigue (carta grande con tapa, disco y pista) y un botÃ³n por fila. Un toque
>   y viene la prÃ³xima. EstÃ¡n Salteala, ElegÃ­ otra (con filtro por disco), MezclÃ¡ el mazo y DeshacÃ©. Una
>   ficha puesta se toca para moverla.
> - **Filas propias:** de dos a siete. Se renombran en el lugar, se guardan en el navegador y viajan en el
>   link (versiÃ³n 2 del empaquetado, `#o=2â€¦&f=â€¦`, con lista blanca). Con las de siempre, el link es el
>   de antes.
> - **"Todos los temas"** (los 105) va primero. Se guarda una partida por conjunto: abrirlo de nuevo sigue donde
>   quedÃ³, y la elecciÃ³n ofrece "Te quedÃ³ a medias".
> - **Suena** el recorte de 10 s al tocarte una ficha, y se apaga desde las herramientas. La lÃ¡mina va de 2
>   a 7 filas y se estira de alto antes que cortar un tema.
> - **En el portal sube al A6** (`D-70`), en el lugar de "Preguntas ricoteras", que pasa al A7.
> - **RevisiÃ³n independiente:** de trece hallazgos se confirmaron siete (foco, nombres accesibles, el
>   disco que seguÃ­a sonando, media letra en un nombre de fila) y se arreglaron todos.
> - **Verde:** `npm test`, `npm run check` y `npm run build`. Probado en el navegador a 375 px y a
>   1400 px.
> - **Pendiente:** los documentos de rol que quedaron atrÃ¡s (`UX-23`, `ADR-06`, `CTR-13`,
>   `PRD-ponelos-en-fila`). La propuesta para cada uno estÃ¡ en
>   `Docs/SUGERENCIAS/HILO-para-todos-d69-ponelos-mazo-y-filas.md`. Y probarlo en un iPhone de verdad:
>   el audio que arranca solo y el mazo pegado abajo con la barra de Safari.

> ## ðŸ”¢ EL PORTAL CAMBIA DE ORDEN (2026-10-06) â€” `D-68`
>
> Pedido del usuario. El lado A queda: AdivinÃ¡ el tema, Â¿QuÃ© tipo de ricotero sos?, Sacalo por la
> letra, Skayboy y Poligirl, CompletÃ¡ la letra, Preguntas ricoteras, y despuÃ©s Ponelos en fila,
> AdivinÃ¡ la tapa y MÃ¡s o menos, como estaban. Solo se moviÃ³ el arreglo `JUEGOS` de `copy.ts`: la
> pista de cada carÃ¡tula sale del mismo Ã­ndice y acompaÃ±a sola.

> ## ðŸ”¤ LOBO SUELTO Y LA LETRA DE LUZBELITO ENTRAN AL SISTEMA (2026-10-06) â€” `D-67`
>
> **Rama `tipografia/lobo-y-luzbelito`, sobre `main` en `8bb84ab`**, en el worktree
> `../RicotaArcade-fondo` (reusado). Pedido del usuario: *"vamos a seguir integrando las otras dos
> que no estan en el sistema, la de lobo suelto y la otra que es medio luz belito"*.
>
> - **"La otra" es Redonditos de Ricota**, de Zavala (la del zip del mismo nombre). No es la letra de
>   la tapa de *Luzbelito*: la viste porque se le parece. Por eso no escribe el nombre del disco en
>   la estampa.
> - **Las dos se derivaron con material propio** (`scripts/derivar-lobo-suelto.py`,
>   `scripts/derivar-redonditos.py`): Lobo suma Ã Ã‰ Ã Ã“ Ãš . , ! Â¡ y recupera la Ã‘ de Zavala;
>   Redonditos, Ã Ã‰ Ã Ã“ Ãš Ã‘ . , ! ? Â¡ Â¿, escalada a la mayÃºscula del sistema. Las dos suben al
>   renglÃ³n.
> - **DÃ³nde escriben:** Lobo, el tÃ­tulo de "AdivinÃ¡ el tema" (sin sal); Redonditos, el tÃ­tulo de
>   "Â¿QuÃ© tipo de ricotero sos?", el nombre de cada manera, "Las cuatro maneras" y el membrete de la
>   hoja. La letra viaja con la variante (`--fuente-disco` en `sitio.css`).
> - **Pendiente:** las postales de dos ejes siguen con el nombre en la rotulada (hay que pasar el
>   taller a la letra y regenerar los PNG; se esperÃ³ a que `ciclo-18/que-ricotero-sos` entre), la
>   hoja 04 del lienzo y la fila de las letras de Zavala en `CNT-01` (sugerencia para `contenido`).

> ## ðŸ”€ CLAUDE FUSIONA CUANDO SE LO PEDÃS (2026-10-06)
>
> Pedido del usuario, textual: *"mergealo vos, vamos a dejar escrita la regla para que puedas
> tambien"*. El PR #38 (la multitud que se acerca, `D-64`, `D-65`) lo fusionÃ³ Claude. Desde ahora
> hay permiso en `.claude/settings.json` (`Bash(gh pr merge *)`) y una regla,
> `.claude/rules/integrar.md`, que dice cuÃ¡ndo: **solo si el usuario lo pide en el chat**, con
> `main` adentro de la rama, todo verde y los checks del PR en verde; siempre `--merge`, nunca
> `--admin`, `--squash` ni borrar la rama.

> ## ðŸ–¨ LA MULTITUD SE ACERCA, LA SOMBRA SALE DE TODOS LADOS, LAS TAPAS SE SELLAN (2026-10-05) â€” `D-63` enmienda 1, `D-64`, `D-65`
>
> **Rama `diseno/la-multitud-se-acerca`, sobre `main` en `8989416`**, en el worktree
> `../RicotaArcade-fondo` (reusado: la rama del fondo ya estaba integrada). Pedidos del usuario,
> en orden: *"Saquemosle la sombra a las letras de las tapas de los juegos, busquemos un efecto mas
> de impresion vieja sobre papel o sello [...] que queden todas coherentes"*; *"Sisi saquemos la
> sombra de todos lados, no me gusta. Ademas hay que usar la tipografia de los discos en mas
> lados"*; y *"Continua lo que falta, me gustaria que mientras vas bajando en la pagina en el fondo
> se vean banderas rojas y gente [...] como si ir para abajo fuese acercase a la multitud"*.
>
> - **La multitud se acerca** (`D-63` enmienda 1): dos planos fijos detrÃ¡s del portal, hechos con el
>   frente original de *Oktubre* (banderas y gente, en espejo). Arriba se ve chica y lejos; al
>   bajar crece y sube la fila mÃ¡s cercana; al final llegan las caras grandes del pie, y cada fila
>   tapa a la de atrÃ¡s. Sin JavaScript, atado al desplazamiento; quieto con movimiento reducido.
> - **Sin sombra en ningÃºn lado** (`D-64`): 41 sombras, sobre letras y sobre objetos. Los botones se
>   hunden y se aclaran; los estados que se decÃ­an con sombra se dicen con borde.
> - **Las tapas se sellan** (`D-64`): el tÃ­tulo del casete y el de la carÃ¡tula en tinta de sello
>   gastada, la etiqueta en papel viejo, el sello de acciÃ³n moteado, y el golpe de cada disco igual
>   en el casete, la carÃ¡tula y el tÃ­tulo de su juego. Lo eligiÃ³ un panel de tres diseÃ±adores y tres
>   jueces.
> - **La letra de la banda** (`D-65`): Patricio Rey Fan escribe el tÃ­tulo de cada juego (menos el de
>   Skayboy, que va chico en su cabecera) y el botÃ³n de compartir, con Ã Ã‰ Ã Ã“ Ãš Â¿ ? Â¡ ! . , derivadas de la propia letra
>   (`scripts/derivar-patricio-rey.py`). El tÃ­tulo del casete sigue en la rotulada: a 15 px la letra
>   de la banda no se lee.
> - **`npm test` corre en Windows**: el patrÃ³n iba entre comillas simples y `cmd` no las saca, asÃ­
>   que corrÃ­a cero tests y daba verde. Ahora van dobles, que andan en los dos. Y el test de la isla
>   de dos ejes ya no falla con los finales de lÃ­nea de Windows.
>
> **Verificado:** `npm test` 1562/1562 en Windows, `check` 0/0, build 160. Tests nuevos con su rojo
> visto: los planos de la multitud (techo y piso de tinta, mÃ¡scaras, silueta), "ninguna sombra en
> ningÃºn lado", `texturas.test.ts`, la etiqueta sobre el papel viejo, y la cobertura de Patricio
> Rey. Mirado en el navegador a 1440Ã—900 y 375Ã—812: el portal arriba, al medio y al final, los
> casetes, la carÃ¡tula y el tÃ­tulo de los juegos.
>
> **Abierto, sin trabar:**
> - `experiencia`: `UX-05`, `UX-20`, `UX-22` Â§8, Â§9 y Â§13 y `UX-25` describen lo que ya no estÃ¡
>   (nota en `Docs/SUGERENCIAS/HILO-para-experiencia-sin-sombra-y-letras.md`). El lienzo tampoco
>   tiene nada de esto.
> - El tÃ­tulo en Patricio Rey en el telÃ©fono se lee con esfuerzo si no se conoce la letra: si al
>   usuario le molesta, la salida es dejarlo solo en la mesa.
> - El efecto de la multitud en el telÃ©fono es mÃ¡s tenue que en la computadora: los casetes tapan
>   los planos, y la tinta tiene el techo del contraste.

> ## ðŸ‘¥ LA GENTE MIRA DESDE EL FINAL DEL PORTAL (2026-10-04) â€” `D-63`
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
>   del crÃ©dito, a tinta plena: `public/arte/multitud-oktubre.png` (1280Ã—368, 64 KB), en
>   `--papel` y el rojo de la bandera sobre transparente. Lo produce
>   `node scripts/generar-multitud.mjs` desde el mÃ¡ster
>   `Docs/INVESTIGACION/TapasDiscos/oktubre-frontal-ancha.webp` (la imagen del usuario).
> - En el telÃ©fono, piso de 14 rem: se ve el centro de la tapa. La deriva de `UX-20` Â§1.4 pasÃ³ a
>   la gente, corriendo al revÃ©s.
>
> **Verificado:** `npm test` 1515/1515 (3 nuevos en `multitud.test.ts`, con su rojo visto),
> `check` 0/0, build 160. Mirado en el navegador a 1440Ã—900 y a 375Ã—812: la gente al final, sin
> desborde de costado, el crÃ©dito nombra *Oktubre*; el quiz y "AdivinÃ¡ el tema" siguen con su
> pasada.
>
> **Abierto, sin trabar:** `experiencia` tiene que poner al dÃ­a `UX-05` (fila de `/`), `UX-20`
> Â§2 y `UX-25` Â§4; el lienzo no tiene esto. Los costados del mÃ¡ster no son de Rocambole (estÃ¡n
> anotados en `D-63` y en `public/arte/README.md`).

> ## ðŸº LA NOCHE RICOTERA ENTERA, Y EL PLANO FIJO QUE VUELVE (2026-10-05) â€” `D-62`, ciclo 19
>
> Pedido del usuario, textual: *"el recital ricotero es barro, sucio, drogas reviente y tambiÃ©n
> es familia amigos amor, es todo eso, pero lo primero no puede faltar tampoco, un choripÃ¡n, un
> pancho una birra un porro hasta cocaÃ­na debe ser parte del recital, la previa ir un rato antes
> a escabiar o no eso es un recital ricotero"*. DespuÃ©s, mirando el sitio publicado: *"nunca
> cansa el volumen"*, *"quiero que estÃ© el grÃ¡fico tambiÃ©n, queda lindo ver que estÃ¡ en un plano
> de dos ejes"*, y entre las dos versiones del plano: *"B, el fijo como el rombo viejo"*. Rama
> `ciclo-18/que-ricotero-sos`, integrada a `main` el 2026-10-05 a pedido del usuario (*"parÃ¡ y
> subÃ­ e integrÃ¡ todo lo que hayas hecho, despuÃ©s seguimos"*), y otra vez el 2026-10-06 con el
> PR #41, con todo lo de abajo (*"integrÃ¡ todo"*).
>
> **El nÃºmero.** Se escribiÃ³ como `D-59` y se renumerÃ³ a **`D-62`** al integrar: el `D-59` del
> dominio llegÃ³ antes a `main`. Los commits de la rama dicen `D-59`; el repo, `D-62`.
>
> **Lo que hay:**
> - **`D-62`**: la escena es la ricotera entera (barro, chori, birra, porro, merca como paisaje;
>   familia, amigos y amor de terceros); la opciÃ³n es de quien juega. Lo que se toma o se fuma
>   nunca separa los polos, y se suma un **quinto lugar** a la prueba: *el que no toma ni fuma*.
>   **Enmienda 1**: la mÃºsica nunca molesta. **Enmienda 2**: vuelve el plano de dos ejes, arriba
>   de la grilla que se queda. **Enmienda 3**: el plano es **fijo** (Luz arriba, Orden a la
>   izquierda, para todos), elegido por el usuario con el costo a la vista.
> - **`INV-172`** (`RES-172`..`RES-194`): la noche real, casi todo **leyenda** (sin pÃ¡ginas
>   abiertas: la red bloqueÃ³ los diarios; el memoir no estÃ¡ en el disco).
> - **`BR-38`** y `US-06` enmendada dos veces (`producto`): la tercera exceptÃºa al plano del
>   criterio 3 y suma el **criterio 9**. **`CNT-31`** (`contenido`): los 30 enunciados, las
>   cinco lÃ­neas que cantan, las cuatro bajadas; casete y lugar con barro y chori; Â§13 confirma el
>   texto del lector (`T-352`). **`UX-38` v1.1** (`experiencia`): el plano construido, con la
>   crÃ­tica respondida.
> - **El plano** (`planoFijo()` en `partida.ts`, `plano()` en la isla, `.ejes-plano*`): recorte
>   de papel, ejes en cruz, los cuatro polos, las cuatro maneras, la tuya con borde y sello, la
>   del amigo punteada, `role="img"` con `RESULTADO.altPlano`. La grilla de abajo sigue relativa.
>   Medido a 375, 360, 320, 1366 y 1440, con y sin amigo, las cuatro maneras: sin desborde, filas
>   y columnas iguales, nada bajo 12 px; los botones no se movieron. No viaja en la tarjeta.
> - **Guardas**: `banco.test.ts` (vetos de la noche con *la mÃºsica que molesta*, vetos de las
>   opciones, el consumo nunca de un solo lado, cada celda trae lo sucio), `partida.test.ts` (el
>   plano fijo; el cuadrado latino de la grilla), `isla.test.ts`, `estilos.test.ts` (piso de 12 px
>   en `.ejes-*`), `copy.test.ts` (el texto del lector en veinte casos).
> - **`npm test` corre todo**: el glob iba sin comillas y corrÃ­a 332 tests. Hoy, con `main`
>   adentro (`D-63` a `D-67`), **1575 en verde**; `check` sin errores, `build` de 160 pÃ¡ginas.
> - **El plano estÃ¡ en el lienzo** del sistema de marca como **hoja 16** (`T-351`, versiÃ³n 19 del
>   lienzo), debajo de la 08 en la pÃ¡gina AplicaciÃ³n.
>
> **`REV-20` estÃ¡ cerrada** (`Docs/REVISIONES/REV-20-la-noche-ricotera.md`, 2026-10-06; los votos
> en `REV-20-votos.json`). Tres lentes con dos verificadores adversariales cada una, un crÃ­tico de
> completitud y una ronda final. **NingÃºn hallazgo alto.** `FIND-119` â€¦ `FIND-133` (`FIND-128` y
> `FIND-129` quemados): todo cerrado. `FIND-132` y `FIND-133`, cifras de `UX-36`/`UX-38`, se
> cerraron en papeles despuÃ©s del cierre (abajo).
> - `EJ-049` (`FIND-119`) quedÃ³ Â«Festejo con el restoÂ» / Â«Canto para adentroÂ», en dos vueltas.
> - La portada a 320 Ã— 568 se rompiÃ³ dos veces y se arreglÃ³ dos veces: el lugar nuevo del casete
>   (Â«TraÃ©s barro en las zapatillas.Â», `FIND-130`) y la letra del tÃ­tulo de `D-67` (`FIND-131`:
>   16 px de aire bajo 22 rem). Hoy Â«EmpezÃ¡ la nocheÂ» termina en 562.
> - Guardas nuevas de la revisiÃ³n: la mÃºsica que molesta en mÃ¡s formas y en primera persona, los
>   trapos fuera de las opciones, el consumo como verbo, la merca fuera de lo que define una
>   manera o un momento, ningÃºn nÃºmero; `textoDelPlano()` en un solo lugar y el orden de los
>   rincones atado.
> - La excepciÃ³n de las lÃ­neas que cantan (sin segunda persona) estÃ¡ en `voz-ricotera.md` Â§5.
>
> **DespuÃ©s del cierre**, una Ãºltima ronda de papeles (`1afb263`, `619b2b2`, `7e772a3`, `0c38b56`)
> cerrÃ³ en papeles `FIND-132` y `FIND-133` y lo que el cierre le dejaba a cada rol. Su verificador
> dejÃ³ cinco detalles de redacciÃ³n, todos bajos, que quedan anotados acÃ¡ y no se abriÃ³ otra vuelta:
> - `contenido` (`CNT-31`): todavÃ­a dice que `producto` no decidiÃ³ `EJ-051` (decidiÃ³ en `6b1beeb`:
>   la escena es la hoja) y que el peso del costo de `CU-4` lo dice `producto` (ya dijo: cuenta la
>   forma, decide `contenido`); y cita Â«ficha 15/16/17Â» donde `REV-20` dice Â«Sin consensoÂ».
> - `experiencia` (`UX-36` Â§5.6, `UX-38` Â§3.2): Â«CompartÃ­Â» a 320 termina en 568,4 en las cuatro
>   maneras (en `CU-1` y `CU-3` por 0,4 px), no Â«justo en el bordeÂ».
> - `producto` (`BR-38`): el Â«LÃ©aseÂ» del veto 1 deja afuera Â«el pogoÂ» que la tabla trae, y la cita
>   Â«`REV-20` 2(c)Â» para los chicos en las bajadas no lo respalda (es cierto, pero por otra lectura).
>
> **Lo que decide el usuario:** si Â«CompartÃ­Â» tiene que entrar a 320 Ã— 568 en el resultado (hoy
> no, en ninguna manera, y es de antes de este ciclo); `EJ-040` (Â«Me dejo llevarÂ» con los Redondos
> sonando) y el costo de `CU-4` (Â«averiguarlo en el celularÂ»), que `contenido` dejÃ³ como estÃ¡n;
> y el telÃ©fono real (lector de pantalla, la portada a 320, el brillo, Safari y Android), y si la
> noche suena ricotera. La hoja 15 del lienzo (la mesa) sigue pendiente (`T-319`), y antes hay
> que sacarle el canto.

> ## ðŸŒ EL DOMINIO: FICHINRICOTERO.COM.AR, ANDANDO (2026-10-05) â€” `D-59`
>
> **El sitio vive en `https://fichinricotero.com.ar`.** El usuario comprÃ³ el dominio en NIC
> Argentina (`arcadericotero.com.ar` quedÃ³ trabado en revisiÃ³n manual, "banquinado"; la sospecha
> es *arca*), lo agregÃ³ en Vercel con `www` redirigiendo, y delegÃ³ en NIC a `ns1.vercel-dns.com` y
> `ns2.vercel-dns.com`. Cuando el usuario confirmÃ³ que andaba, la rama
> `dominio/fichinricotero` se fusionÃ³ con `main` (que ya traÃ­a `D-60` y `D-61`) y se integrÃ³.
>
> **Lo que cambiÃ³ en el cÃ³digo:** `site` de `astro.config.mjs` apunta al dominio nuevo, asÃ­ que
> `og:url` y `og:image` salen de ahÃ­; las tarjetas del taller de "Â¿QuÃ© tipo de ricotero sos?" se
> volvieron a dibujar con la marca de `D-60` y este dominio; los enlaces del hilo de Twitter en
> `main` apuntan al dominio nuevo.
>
> **Lo que queda:**
> 1. `arcade-ricotero.vercel.app` sigue respondiendo y no redirige: los enlaces viejos andan.
>    Si se quiere una sola direcciÃ³n, se configura en Vercel (Settings â†’ Domains).
> 2. El hilo con el nombre nuevo (rama `difusion/hilo-twitter`) **choca con esta integraciÃ³n** en
>    `hilo.md` y `hilo.json`: acÃ¡ cambiaron las direcciones, allÃ¡ el nombre. Al integrarlo, quedan
>    las dos cosas.
> 3. **Renovar en NIC antes del 2027-10-04** ($8.500 hoy; 45 dÃ­as de gracia). Si se deja vencer,
>    el sitio sigue en `arcade-ricotero.vercel.app` volviendo `site` atrÃ¡s.

> ## ðŸ•¹ SKAYBOY Y POLIGIRL: EL MENÃš, EL PASO ENTRE NIVELES Y EL PULGAR (2026-10-04) â€” `D-61`
>
> Pedido del usuario, textual: *"HacÃ© una sesiÃ³n entera agregÃ¡ndole menÃº, paso entre niveles y
> corrigiendo la jugabilidad de las teclas en mobile de skayboy y poligirl. AdemÃ¡s ponele en el
> home al lado de AdivinÃ¡ el tema. La idea es que tenga un botÃ³n para ponerse en pantalla completa,
> y que en la misma pantalla completa estÃ©n los controles medio transparentes para jugar dentro de
> la pantalla completa. AgregÃ¡ el menÃº para jugar y ver quÃ© niveles hay y eso."* Sin plan de
> `orquestador`: `D-61` la escribiÃ³ el hilo principal, y cada rol tomÃ³ su nÃºmero (`IDS.md`).
>
> **Lo que hay:**
> - **El menÃº** (`menu.ts`, `UX-37` Â§3): abre al entrar â€”el botÃ³n grande juega el nivel que
>   corresponde, tocable en el primer cuadroâ€” y desde la partida con el sello `MENÃš` del mueble,
>   que la pone en pausa (el mundo no avanza). **Los seis niveles abiertos** (`D-61` punto 2,
>   `BR-40`), cada uno con nÃºmero, nombre de `CNT-21` y sello `PASADO` / `ACÃ ESTÃS`. Ocupa la
>   regiÃ³n del tubo y los mandos, medida por `regionDelMenu()`: parado, la zona de las teclas con
>   el nivel dibujado arriba; de costado, la franja del tubo; en el modo, la sala. **Nunca el pie
>   de homenaje ni la cabecera.**
> - **La tarjeta de fin de nivel**, en la banda de arriba del Ã¡rea (las puertas estÃ¡n abajo):
>   `NIVEL 2 DE 6 Â· PASADO`, el que sigue (con lugar), y RepetÃ­ / ElegÃ­ otro / SeguÃ­. A Ã—1 va
>   compacta. El toque sobre el Ã¡rea sigue valiendo; `#seguir-juego` saliÃ³ de la tabulaciÃ³n.
> - **El rÃ³tulo de entrada**: `NIVEL 3 DE 6` y el nombre, 2,6 s, sin tomar toques.
> - **El pulgar rueda** (`dedos.ts`): la columna captura el dedo y la tecla sale por geometrÃ­a
>   (sin franjas muertas); subir de una flecha a saltar sin levantar **salta y sigue para ese
>   lado**. Toques mÃ¡s cortos que un tic no se pierden (`pulsadas`). La tecla se hunde sin
>   transiciÃ³n. Las notebooks tÃ¡ctiles conservan los botones (`any-pointer: coarse`).
> - **La pantalla completa en cualquier posiciÃ³n**: el sello aparece tambiÃ©n parado y dice el
>   verbo (`PANTALLA COMPLETA` / `SALÃ`, `CNT-40`); el menÃº tiene el mismo botÃ³n con la frase
>   entera. De costado, las teclas medio transparentes encima, como ya estaba.
> - **La portada**: el casete pasa de A9 a **A4**, despuÃ©s de "AdivinÃ¡ el tema".
> - Papeles: `D-61` (con sus precisiones del mismo dÃ­a), `UX-37` (y pies en `UX-27`, `UX-28`,
>   `UX-32`, `UX-33`), `CNT-40` (enmienda `CNT-22` Â§1), `BR-40` (enmienda `US-09` criterios 3 y 9 y
>   `BR-31` Â§3), enmiendas de `ADR-10` y `CTR-16.11.2`; traspaso en
>   `Docs/SUGERENCIAS/HILO-para-todos-skayboy-menu-y-mando.md`.
>
> **Verificado:** `npm test` 1448/1448 (43 nuevas: `dedos.test.ts`, `menu.test.ts`, y casos en
> `modo-pantalla.test.ts` y `estilos.test.ts`), `check` 0/0, build 156. La isla pesa 15,4 KB
> comprimida y con el motor suma 83,8 (techo de 90, `ADR-08.10`). Medido en el panel del
> navegador del escritorio, con emulaciÃ³n: parado 375Ã—667 y 375Ã—812, acostado 740Ã—360, 568Ã—320 y
> 812Ã—375, escritorio con mouse, y la pantalla completa parada y acostada (740Ã—360 y 568Ã—320). El
> nivel 1 se jugÃ³ y se ganÃ³ de punta a punta (avance guardado, baile, contador, tarjeta, SeguÃ­, el
> rÃ³tulo del 2, el menÃº en pausa). El pulgar se probÃ³ con eventos de puntero: rueda entre flechas,
> lleva la direcciÃ³n al saltar, suelta todo lejos de la columna. El pie de homenaje no se cruza
> con ninguna capa en ningÃºn reparto (medido, y lo prueba `menu.test.ts`).
>
> **RevisiÃ³n adversarial** (cuatro lentes en paralelo: la mÃ¡quina de estados de la isla, el dedo,
> el CSS por tamaÃ±o, la lÃ³gica y los textos): 25 hallazgos distintos. La verificaciÃ³n cruzada se
> cortÃ³ a mitad por el lÃ­mite de la sesiÃ³n; los que quedaron sin veredicto los verificÃ³ el hilo
> contra el cÃ³digo y el navegador. **Corregidos:** la tarjeta del sexto se rompÃ­a a Ã—1 y en la
> grilla ancha ("VolvÃ© al primero"); en el modo a 568Ã—320 la regleta se apilaba y la tarjeta tapaba
> `SALÃ`; la tarjeta no escondÃ­a el rÃ³tulo, se comÃ­a el toque de seguir con su cuerpo, robaba el
> foco (y un Enter repetido salteaba el nivel) y se montaba sobre los bloques de saltar en el modo;
> el rÃ³tulo quedaba debajo de los sellos en el modo; `aria-modal` y un `inert` de mÃ¡s le escondÃ­an
> al lector el volver y el pie; el foco volvÃ­a al canvas (kaplay lo enfocaba) o se caÃ­a al `body`;
> `Escape` sostenido hacÃ­a titilar el menÃº; el `aria-pressed` contradecÃ­a el nombre nuevo; `PASADO`
> iba en el verde del acierto; el eco del menÃº pintaba 2 px sobre el pie; dos recortes con "â€¦" en
> rÃ³tulos; el sello se salÃ­a 5 px de la ventana a 568; con mouse a Ã—1 de costado la regleta tapaba
> el tÃ­tulo; el menÃº parado tapaba la firma y los crÃ©ditos del sitio; `:active` mostraba teclas que
> el mando ya habÃ­a soltado. **Descartados con razÃ³n:** que la ficha muestre el dÃ­gito y no
> `MENU.numero` (ver abierto), y que `#seguir-juego` sin tabulaciÃ³n deje sin camino al teclado (lo
> tiene: Tab a la tarjeta, o Enter con el foco suelto).
>
> **Abierto, sin trabar:**
> - `T-401` (usuario): **el lienzo**. El menÃº, la tarjeta, el rÃ³tulo y los sellos no tienen hoja;
>   el circuito de `diseno-marca.md` se invirtiÃ³ otra vez, como con `T-319`. NingÃºn color nuevo:
>   todo sale de tokens y pares que ya mide `contraste.test.ts`.
> - `T-402` (`revisor`): **`REV-21` formal** contra `UX-37` Â§10, con contexto fresco. La revisiÃ³n
>   de esta sesiÃ³n la hicieron agentes de propÃ³sito general, no el rol.
> - `T-403` (`experiencia`): `UX-35` y `UX-04` todavÃ­a dicen A9 para Skayboy; y la leyenda de
>   `D-55` sigue sin entrar a `UX-28` Â§2 y `UX-35` Â§5.
> - `T-404` (`arquitectura`): las filas de `menu.ts` y `dedos.ts` en `CTR-16.8` y `ADR-08.10`, y
>   reabrir `hastaDonde()` frente a `pasadosDeLaFila()` (`CTR-16.11.1` y `.3`).
> - `T-405` (`contenido` y `experiencia`): la ficha muestra el dÃ­gito ("3") y `CNT-40` Â§1.1 pide
>   `MENU.numero` ("Nivel 3"); en la fila de seis cuadrados no entra. Que lo decida `CNT-40`.
> - Sigue sin existir la pieza compartible de `BR-27`: "VolvÃ© al primero" en el sexto es el parche
>   de `BR-40` punto 7.
>   (Los nÃºmeros se renumeraron al integrar â€”era `D-56`, `UX-36`, `CNT-30`, `BR-36`, `T-331`+â€”
>   porque el ciclo 18 llegÃ³ antes a `main` con esos; ver `IDS.md`.)
> - **Sube como PR a `main`** desde la rama `skayboy/menu-y-mando-sobre-main`, encima del ciclo 18
>   y de "FichÃ­n Ricotero" (`D-60`), a pedido del usuario.
>
> **Del usuario:** jugarlo en un telÃ©fono de verdad, con el pulgar (`T-249` sigue abierta, y ahora
> mide tambiÃ©n el arrastre de direcciÃ³n y la pantalla completa parada en Android, que gira sola);
> y decidir si "al lado de AdivinÃ¡ el tema" tiene que ser literal tambiÃ©n en tres columnas (ver
> `D-61`, precisiones).

> ## ðŸ•¹ EL SITIO SE LLAMA FICHÃN RICOTERO (2026-10-04) â€” `D-60`
>
> Pedido del usuario, textual: *"Vamos a cambiar el nombre de la pagina por fichin ricotero.
> Hace los cambios pertinentes. Esto se debe a que arcade ricotero no se podia comprar el
> dominio. Dale que sale hoy la pagina al publico"*. Rama `nombre/fichin-ricotero`, sobre
> `main` en `93f292a` (con el ciclo 18 adentro), **integrada a `main` con el PR #29
> (`8913ce1`) y publicada**: verificado en `arcade-ricotero.vercel.app` el tÃ­tulo, la marca y
> la fuente v0.4.
>
> **Lo que hay:**
> - **El nombre** en todo lo que se ve: las cuatro formas de la marca (`FICHÃN RICOTERO`), los
>   dos pinceles, las nueve tarjetas del taller de "Â¿QuÃ© tipo de ricotero sos?" (regeneradas),
>   pestaÃ±as, `og:site_name`, `aria-label`, Ã­cono, textos para compartir ("en el fichÃ­n
>   ricotero"), *VolvÃ© al fichÃ­n* y la cinta *â† AL FICHÃN*, las imÃ¡genes que bajan los dos
>   pinceles (`fichin-ricotero-*.png`).
> - **Oktubre Calco v0.4**: la F, la H, la N y la Ã, derivadas de las letras calcadas con
>   booleanas (`scripts/derivar-oktubre-calco.py`, reproducible byte a byte). La marca queda
>   entera en la letra de la tapa. MÃ©tricas sin tocar; el acento se probÃ³ en
>   Chromium/Windows, HTML y canvas.
> - **`fuentes.test.ts`** (el de `D-58`) suma un lector de WOFF y tres casos: si la marca, un
>   pincel, el taller o una pÃ¡gina piden una letra que el calco no tiene, falla.
> - **Lo que no cambiÃ³, a propÃ³sito:** la clave `arcade.` de `localStorage`, las clases, los
>   `$id`, el repo, el proyecto de Vercel (`arcade-ricotero`) y **el dominio**: `site` sigue en
>   `arcade-ricotero.vercel.app` porque `fichinricotero.com.ar` todavÃ­a no resuelve DNS. Eso
>   lo cambia `D-59` (rama `dominio/fichinricotero`) cuando responda por HTTPS.
>
> **Abierto, sin trabar:**
> - **Del usuario:** delegar `fichinricotero.com.ar` en NIC Argentina a los servidores de
>   nombres de Vercel y sumar el dominio al proyecto `arcade-ricotero`. Hasta entonces el
>   dominio no carga y `D-59` no puede entrar.
> - **`D-59` estÃ¡ reservado dos veces** (la rama del dominio y el ciclo 19). Uno renumera.
>   *[Resuelto 2026-10-05: el ciclo 19 pasÃ³ a `D-62` al integrar.]*
> - El trabajo de Skayboy del menÃº y el pulgar ya estÃ¡ renumerado sobre `origin/main`, en la
>   rama local `skayboy/menu-y-mando-sobre-main` (`e50110b`: `D-61`, `UX-37`, `CNT-40`,
>   `BR-40`, `T-401`â€¦`T-410`), sin subir. Contra esta rama choca solo como texto: el final de
>   `DECISIONES.md` e `IDS.md`, este bloque, y las lÃ­neas de la marca en
>   `skayboy-y-poligirl.astro`.
> - Los roles: `Docs/SUGERENCIAS/HILO-para-todos-el-sitio-se-llama-fichin-ricotero.md`.
> - El hilo de difusiÃ³n entrÃ³ a `main` por el **PR #31** (rama `difusion/hilo-fichin`, fusiÃ³n
>   `4aa505f`, 2026-10-29): el texto con el nombre nuevo y el tono de los 40 de *Oktubre*, y las
>   capturas vueltas a sacar con FICHÃN RICOTERO publicado. Sus enlaces van a
>   `fichinricotero.com.ar`, que el 4 de octubre todavÃ­a no resolvÃ­a DNS.

> ## ðŸŒ™ "Â¿QUÃ‰ TIPO DE RICOTERO SOS?" REHECHO: UNA NOCHE Y EL LIBRO DE *LUZBELITO* (2026-10-04) â€” `D-57`, ciclo 18
>
> **Rama `ciclo-18/que-ricotero-sos`, sobre `main` en `bc27cd4`, integrada a `main`** a pedido del
> usuario (*"integrÃ¡ todo a main"*) con el **PR #27** (merge `c7ef2de`), con el deploy de vista
> previa de Vercel en verde. Pedido del usuario: *"HacÃ© un ciclo entero de mejora importante sobre
> el juego de quÃ© tipo de ricotero sos, mejora artÃ­stica, de preguntas, de resultado y de otras
> cosas que analices que se puedan mejorar"*. Plan en `ORQ-plan-ciclo-18.md` (`T-331`..`T-346`,
> todas hechas). DecisiÃ³n madre: `D-57`, con siete enmiendas escritas al construir.
>
> **La idea:** el test deja de ser veinte preguntas sueltas y pasa a ser **una noche de recital en
> cinco momentos** (la previa, la ida, la vereda, *Cuando suena*, la vuelta), una pregunta de cada
> eje por momento. El resultado no dice "sos": dice **"Esta noche te saliÃ³"** una de cuatro
> maneras con nombre de cosa y sin persona â€”Â«Mesa larga a las nueveÂ», Â«Ronda en cualquier
> esquinaÂ», Â«Radio bajita, misma horaÂ», Â«Mochila liviana, sin mapaÂ»â€”, con los dos polos traducidos
> (*con la gente* / *con lo propio*, *con plan* / *sobre la marcha*). Todo viste **el libro de
> *Luzbelito***: la portada es la tapa cerrada, cada pregunta una hoja, el resultado la Ãºltima.
>
> **Lo que hay:**
> - **El banco** (`CNT-30`, `src/data/dos-ejes.json` v2): 30 escenas `EJ-029`..`EJ-058`, tres por
>   celda momento Ã— eje; las 28 viejas, retiradas. PasÃ³ **cuatro vueltas de lectura adversarial**
>   contra `BR-36` (la frontera entre escena y credencial) y la prueba de los cuatro lugares (*nunca
>   fui*, *sin plata*, *silla de ruedas*, *volviendo de noche sin compaÃ±Ã­a*). La enmienda 7 de
>   `D-57` cortÃ³ la oscilaciÃ³n de la luz: puede suponer a alguien, nunca un parentesco ni un
>   desconocido, y telÃ©fono en un tercio como mucho.
> - **El motor** (`partida.ts`, `CTR-08` v2): la noche en orden, otra noche sin repetir escenas en la
>   visita (`BR-37`), la grilla de dos por dos **relativa** (la tuya primero) y la relaciÃ³n con quien
>   te mandÃ³ el enlace, atadas por test.
> - **El toque**: se confirma y se bloquea (`aria-disabled`, `aria-pressed`), la siguiente hoja
>   llega a los 600 ms de `--pausa-eleccion` (que el movimiento reducido no apaga), el foco va al
>   enunciado y al nombre, una sola regiÃ³n viva en el HTML, teclas 1/2/Retroceso sin repeticiÃ³n, y
>   "VolvÃ© a la anterior" sin `pushState`.
> - **El arte** (`UX-36`): la tapa en tres capas recortadas del frente (mÃ¡rmol, lomo, esquinero),
>   **sin el Ã³valo, la figura ni la palabra LUZBELITO** (`RES-168`); la hoja lisa con el canto de
>   las que faltan; el sello del momento que se apoya cuando cambia (el Ãºnico movimiento); la
>   Ãºltima hoja con la marca en dos renglones.
> - **Compartir**: una **tarjeta de 1080 Ã— 1350 por manera** y una **postal por manera**
>   (`/juegos/dos-ejes/cu-1/`..`cu-4/`, con su vista previa), fabricadas por un taller en Node
>   (`npm run generar-dos-ejes`, versiÃ³n 3) que mide cada renglÃ³n con las fuentes reales y falla si
>   algo no entra. Cancelar la hoja de compartir ya no copia nada.
> - **`D-58`, para todo el sitio**: la rotulada (`archivo-black.woff2`) era un recorte sin la A-Z y
>   cada tÃ­tulo caÃ­a a una letra de reemplazo. Ahora es la completa, con su guarda.
> - **Guardas nuevas**: `banco.test.ts` (vetos, delatores, la firma de un polo por raÃ­z, que ninguna
>   opciÃ³n diga la traducciÃ³n de su polo ni apunte a un nombre o una bajada), los once rojos del
>   schema (`esquemas.test.ts`), `isla.test.ts`, `tarjetas.test.ts` (huella, medidas, letras de cada
>   fuente) y `fuentes.test.ts`.
>
> **Verificado:** `node --test 'src/**/*.test.ts'` **1466/1466** (`npm test` corre 325 de esos),
> `check` 0/0, build **160** pÃ¡ginas. En el navegador, sobre el build: tres toques seguidos dan una
> respuesta, tres noches dan 30 escenas distintas, compartir anda en cinco variantes de
> `navigator` y sin red, y los botones entran a 375 Ã— 667 (portada 590, postales 626 y 650,
> resultado 538 y 611) y a 320 Ã— 568 (portada 565).
>
> **`REV-19`** (`Docs/REVISIONES/REV-19-la-noche.md`): `FIND-111`..`FIND-118`, cuatro cerrados.
> **La hizo el hilo principal, no `revisor`**: los subagentes se quedaron sin cupo hasta el 8 de
> octubre, a mitad de la vuelta 4 del banco. Lo que el hilo escribiÃ³ en carpetas ajenas estÃ¡
> marcado ("hilo principal") en cada `notaInterna`, en `CNT-30` Â§13, `CNT-01` (nota y Â§H) y
> `CNT-29` Â§4.
>
> **Pendiente, por orden:**
> 1. **Del usuario â€” `FIND-115`:** la carÃ¡tula y el pie de este juego siguen mostrando el medallÃ³n
>    con la vela (`luzbelito-vela.png`), que `RES-168` pide no usar como pieza. `D-57` punto 9 lo dejÃ³
>    fuera a propÃ³sito. Propuesta de `UX-36` Â§11.1: el casete A2 viste la tira del libro.
> 2. **Cuando vuelva el cupo â€” `FIND-117`:** `contenido` relee los Ã­tems marcados "hilo principal"
>    (`EJ-041`, `047`, `052`, `053`, `054`, el crÃ©dito) y `revisor` relee `REV-19` con el encargo de
>    `T-344`.
> 3. **`FIND-118`:** `UX-36`, el estado de `ORQ-plan-ciclo-18.md` y `ADR-02` v2 enmienda 2 no dicen
>    lo que el cÃ³digo ya hace. Escrito en
>    `Docs/SUGERENCIAS/HILO-para-experiencia-orquestador-y-arquitectura-lo-que-dejo-REV-19.md`.
> 4. **`FIND-116`:** el costo de `CU-4` (*averiguarlo en el celular*) pesa menos que el de `CU-1`.
> 5. **La fecha de *Luzbelito*** (`RES-167`): 7 de octubre o 1 de agosto de 1996. La Redondopedia y
>    el afiche de octubre dicen una sola; estÃ¡ en
>    `Docs/SUGERENCIAS/HILO-para-investigador-y-contenido-la-fecha-de-luzbelito.md`. Por eso la
>    tarjeta dice solo el aÃ±o.
> 6. **El posteo 5 del hilo de Twitter** (`difusion/hilo-twitter/`) describe el rombo y los nombres
>    viejos: quedÃ³ desfasado y no se rehÃ­zo.
> 7. **El lienzo** ("Sistema de marca Arcade Ricotero") no tiene el libro: la tapa en tres capas, la
>    hoja con canto y la tarjeta nueva nacieron en `UX-36` y en el cÃ³digo. Falta su hoja.
> 8. **En un telÃ©fono real** (`UX-36` Â§12.6, y lo que `REV-19` deja sin mÃ¡quina): una noche con
>    cronÃ³metro, compartir con archivo en iOS y Android, el sello a pleno sol, NVDA o JAWS con las
>    teclas 1 y 2, y si alguna manera se lee mÃ¡s pobre.
> 9. El verso de cierre de Â«Juguetes perdidosÂ» (`CL-1000`) sigue en `borrador`: entra solo si el
>    usuario lo confirma de oÃ­do y lo quiere (`D-57` punto 9).

> ## ðŸ“Š LA ANALÃTICA DE VERCEL (2026-10-02) â€” `D-56`
>
> Pedido del usuario: *"Activa el web analitics de vercel en el repo"*. Hecho en `main`, sin
> commitear todavÃ­a.
>
> - `@vercel/analytics` 2.0.1, pineado exacto, entra por la isla `src/scripts/analitica.ts`,
>   enganchada en `components/Cabeza.astro`: las 156 pÃ¡ginas la llevan, quiz incluido. Solo
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
> Started" dice que sÃ­), desplegar, y entrar al sitio publicado: los datos aparecen a los
> pocos segundos, con el bloqueador apagado.

> ## ðŸª‘ LA MESA Y LA CARÃTULA: EL SITIO EN UNA PANTALLA ANCHA (2026-10-02) â€” `D-54`, ciclo 17
>
> **Rama `ciclo-17/escritorio`, sobre `main` en `039bebd`, integrada a `main`** a pedido del
> usuario (*"Luego integra todo"*) con el **PR #24**. Pedido: *"HacÃ© un ciclo entero y complejo de mejora visual de
> desktop para el home y todos los juegos. Debe quedar profesional y lindo en ambas formas
> desktop y mobile."* Y al final: *"dale, aplicÃ¡ todo y cerrÃ¡ el ciclo"*. Plan en
> `ORQ-plan-ciclo-17.md` (`T-311`..`T-319`); `T-311`..`T-318` cerradas, `T-319` es del usuario.
>
> **La idea:** en el telÃ©fono la hoja va en la mano; en la computadora se apoya en una mesa, al
> lado de **la carÃ¡tula del casete** que se tocÃ³ en el portal â€” la misma pieza de tapa, el mismo
> nÃºmero de pista, el mismo disco, sacados del mismo dato (`JUEGOS`).
>
> **Lo que hay:**
> - **La carÃ¡tula** (`components/Caratula.astro`, `lib/sitio/caratula.ts`) en los ocho juegos
>   menos Skayboy, como Ãºltimo hijo de `main`. Desde 64 rem es la columna izquierda, pegajosa y
>   con tope de alto: marca, pieza, etiqueta de papel, y la lista de temas A y B (la navegaciÃ³n
>   entre juegos), que **se va en partida** (y en la elecciÃ³n de "Ponelos"). En "AdivinÃ¡ la
>   tapa" la pieza tambiÃ©n se va en partida: es una respuesta (`piezaSopla`). En el telÃ©fono es
>   una calcomanÃ­a en la esquina de la cabecera (pieza + "A3") que se va con la cabecera.
> - **El portal en la mesa** (`--ancho-mesa`, 76 rem): frente en dos columnas (marca y afiche),
>   lado A en tres por tres, lado B centrado; desde 80 rem la pieza a 84 px y la bajada entera.
>   Desde 46 rem la casetera deja de pisarse y el noveno se centra.
> - **Un tÃ­tulo y un botÃ³n para los ocho juegos**: la rotulada en su peso (los ocho tenÃ­an
>   negrita falsa) en la tinta del disco, con el eco en su apoyo; el botÃ³n en la tinta del disco
>   con canto que se hunde. Tres juegos pasan del rojo de la marca a su disco (dos ejes, letra,
>   tapa).
> - **Skayboy entra entero**: la cabecera se acuesta en un renglÃ³n y los cortes de Ã—3/Ã—4 la
>   cuentan (620/760 de alto). Cierra el traspaso de `T-271`.
> - **"Ponelos en fila" en dos paÃ±os** desde 80 rem; **"Sacalo por la letra"** con el buscador
>   pegado a los versos en la mesa.
> - Seis medidas nuevas en `tokens.css` (`--ancho-hoja`, `--ancho-tablero`,
>   `--ancho-tablero-amplio`, `--ancho-caratula`, `--ancho-mesa`, `--aire-mesa`).
> - **Skayboy sin botones en la computadora** (`D-55`, pedido al cerrar): con mouse las dos
>   columnas llevan una leyenda â€”quiÃ©n es y sus tres teclas, que se encienden al apretarlasâ€”;
>   sin mouse los botones siguen. Los botones quedan en el documento y el teclado los aprieta.
> - Papeles: `D-54`, `D-55`, `UX-35` (y enmiendas de `UX-10`, `UX-28` Â§5, `UX-04`), `REV-18` cerrada,
>   y la hoja 15 del lienzo escrita (`Docs/SUGERENCIAS/lienzo-hoja-15-la-mesa.dc.html`).
>
> **Verificado:** `npm test` 1405/1405 (18 nuevos en `caratula.test.ts`, `estilos.test.ts` y
> `contraste.test.ts`, cada uno con su rojo visto), `check` 0/0, build 156, validador `APTA`.
> Medido en Chrome sin cabeza por CDP a 1920, 1440, 1366 (768 y 657), 1280, 1100, 1024, 980, 812,
> 768, 720, 375 y 320, en portada, partida y resultado: los ocho botones de arranque entran a
> 1366Ã—657, Skayboy sin teclas afuera en 21 tamaÃ±os (12 vueltos a medir despuÃ©s del Ãºltimo
> ajuste), la carÃ¡tula se desplaza por dentro donde no
> entra, renglones tÃ¡ctiles de 51 px. `REV-18` (revisor, contexto fresco) comparÃ³ el telÃ©fono
> contra el `HEAD` de antes: el portal da idÃ©ntico.
>
> **`REV-18`: 12 hallazgos (`FIND-99`..`FIND-110`), cuatro MEDIA.** Los once del hilo principal
> cerrados y vueltos a medir; `FIND-110` (el mÃ©todo de mediciÃ³n del checklist) lo cerrÃ³
> `experiencia` en `UX-35` Â§7.
>
> **Abierto, sin trabar:**
> - **El lienzo** (`T-319`): pegar la hoja 15 exige republicar el lienzo entero (2,5 MB, con el
>   editor adentro). Lo decide el usuario.
> - `experiencia`: sumar la leyenda de teclas de `D-55` a `UX-28` Â§2 y `UX-35` Â§5.
> - `contenido` puede revisar la cadena "Los casetes" (`CARATULA.lista`), que escribiÃ³ el hilo
>   principal; `arquitectura` puede nombrar la cuarta portadora de `marca` en `ADR-03` Â§6.3.
> - Las pÃ¡ginas de lectura (Redondopedia, cancionero) no se tocaron: el pedido nombrÃ³ el portal
>   y los juegos. Los atajos de teclado en los juegos de cuatro opciones quedan como idea.
>
> **Del usuario:** mirarlo en una computadora con mouse y en el telÃ©fono, y si se republica el
> lienzo con la hoja 15.

> ## âŒ¨ï¸ SKAYBOY CON EL TECLADO, Y EL USUARIO CONFIRMA LOS NIVELES (2026-10-02) â€” `D-53`
>
> **Rama `claude/busy-cannon-sfkwxd`, reiniciada sobre `main` en `2c398a9`** (el PR #22, que
> integrÃ³ todo lo de abajo, ya estÃ¡ mergeado). Pedido del usuario: *"que en desktop se pueda
> jugar con awsd y las flechitas. Confirmo que los niveles son jugables"*.
>
> - **W A D para Skayboy, las flechas para Poligirl** (`D-43` decide quiÃ©n es quiÃ©n). Cada tecla
>   aprieta el mismo botÃ³n del mando que el dedo; el mapa vive en `lib/skayboy/teclado.ts`, con
>   sus tests. Con mouse, cada botÃ³n muestra su tecla; en el telÃ©fono, no. Ctrl/Alt/Cmd no
>   aprietan nada, las flechas no desplazan la pÃ¡gina, y al perder el foco se suelta todo.
> - **Los niveles, confirmados por el usuario**: se cierran las notas de excepciÃ³n de `D-51`
>   en el PRD y en `CTR-16.7` (sin afirmar que fue de a dos, que no lo dijo).
>
> **Verificado:** `npm test` 1387/1387 (6 nuevos en `teclado.test.ts`, dos con su rojo visto
> antes de cablear), `check` 0/0, build 156, y en Chromium de escritorio: D hunde la tecla de
> Skayboy y lo mueve, las flechas mueven a Poligirl, al soltar no queda nada apretado, Ctrl+D no
> aprieta nada, las flechas no desplazan la pÃ¡gina; a 812Ã—375 tÃ¡ctil la letra no aparece.
> `producto` y `arquitectura` cerraron sus notas de excepciÃ³n con la cita del usuario, y las dos
> dejan dicho que **`deDos` sigue sin probar que se jugÃ³ de a dos**: la confirmaciÃ³n dice
> "jugables", no con cuÃ¡ntas personas. `ADR-08.10` suma la lÃ­nea del teclado.
>
> **Del usuario:** nada nuevo; lo de abajo sigue.

> ## ðŸšª LO QUE NADIE PODÃA ENCONTRAR, ADENTRO DEL SITIO (2026-10-01, noche) â€” `D-51`
>
> **Rama `claude/busy-cannon-sfkwxd`, sobre `main` en `2678050`** (con el #21 de Oktubre ya
> adentro). Pedido del usuario sobre un relevamiento de otro agente: *"ResolvÃ© todo de la mejor
> forma y dejalo integrado en el sitio."* Dos cosas las decidiÃ³ Ã©l, a pregunta: **publicar
> Skayboy ya** y **la casilla de correcciÃ³n**, que dio Ã©l.
>
> **Lo que quedÃ³ integrado:**
> - **"Â¿QuÃ© tipo de ricotero sos?"** con casete A2 (*Luzbelito*, la cabeza con la vela),
>   renglÃ³n del lugar (`Una vela te alumbra media cara.`), bajada de `CNT-26`, compartir como
>   identidad y lectura del desafÃ­o al llegar.
> - **Skayboy y Poligirl publicado**: seis niveles `listo` (`deDos: true` = el usuario se hizo
>   cargo), casete A9 vistiendo *Gulp!* con el "Gulp." del sobre. ProducciÃ³n siembra los seis.
> - **Casilla de correcciÃ³n conectada** (partida en el cÃ³digo; un test vigila que no quede
>   escrita entera) y **botÃ³n al pie de cada artÃ­culo de la Redondopedia**, con un selector
>   "QuÃ© parte" (el artÃ­culo, cada dato, cada pÃ¡rrafo) que manda texto, rÃ³tulo y ubicaciÃ³n
>   como pide `CTR-10` Â§2.1. El transporte de mail es una fÃ¡brica con sus tres tests.
> - **"AdivinÃ¡ el tema" lee su desafÃ­o**; **tapa, letra y dos ejes comparten** (mÃ³dulo nuevo
>   `scripts/compartir.ts`, texto y enlace, sin tarjeta).
> - **Spotify**: 7 preguntas del quiz con ID de 5 temas verificados (`INV-140`).
> - **"MÃ¡s o menos"**: 44 datos `listo`, 16/16/12 (+9: entraron 10 de los 18 pendientes y
>   `REV-17` hizo retirar `MM-40`, cuyo objeto la cita no respalda; `CNT-25` Â§2).
> - **Redondopedia 38/38**: las tres bandas de despuÃ©s como `concepto` (`BR-34`, `BR-35`,
>   `CNT-28`), con siete enlaces de entrada que cuida `redondopedia.test.ts`.
> - **CalcomanÃ­as**: el muÃ±eco del antifaz (*Un baiÃ³n*) y el rÃ³tulo con la mosca (*La mosca y la
>   sopa*; el gato momificado no estÃ¡ en ninguna imagen del repo).
> - **"Ponelos en fila" con filas nuevas** (`D-52`, elegidas por el usuario): EN EL POGO Â·
>   SALTANDO Â· CABECEANDO Â· QUIETITO. Mismos nÃºmeros de fila: los enlaces viejos abren igual.
> - **El bondi del casete de "AdivinÃ¡ la tapa"**, recortado al contorno: quedaba chiquito (pedido
>   del usuario en la misma sesiÃ³n).
> - **Peso muerto, ~4,9 MB menos publicados**: video duplicado, cinco derivados de tapa sin
>   pantalla, la fuente *Redonditos Fan*, la copia de "en la cocina". La hoja de Skayboy, el
>   lobo-lupus y el ensayo se mudaron a `Docs/UX/` (no se borraron).
> - **"CompletÃ¡ la letra" de 21 a 72 versos** (24/23/25, 39 temas): selecciÃ³n curada de fuente
>   Ãºnica ampliada bajo `D-25` (`CNT-27`), ahora que la correcciÃ³n llega por mail. SaliÃ³
>   `CL-601` (respuesta sin tilde). Seis temas pasan de 8 versos visibles (`CTR-04.4`,
>   precauciÃ³n). `contenido` dejÃ³ dos propuestas en
>   `Docs/SUGERENCIAS/CNT-para-hilo-principal-anotaciones-y-erratas-que-pasan-el-filtro.md`
>   (endurecer el filtro y vetar distractores con erratas), sin tratar.
>
> **Lo que la red no dejÃ³:** el cotejo de dos fuentes de la letra. lacuerda.net (la Ãºnica
> independiente de cifraclub/letras.com, que son de Studio Sol) estÃ¡ bloqueada por la polÃ­tica
> de red del entorno; `RES-142`..`RES-145` quedaron cancelados (`INV-141`). Los lotes se
> regeneran desde `letra.json` cuando se habilite `acordes.lacuerda.net`.
>
> **`REV-17`, cerrada el 2026-10-02:** trece hallazgos (`FIND-86`..`FIND-98`), doce cerrados
> (`Docs/REVISIONES/REV-17-lo-que-nadie-podia-encontrar.md`, con la tabla de cierre). Ninguno
> le marcaba error al que sabe. Queda abierto `FIND-98` (el largo del portal, `experiencia`).
>
> **Verificado al cerrar:** `npm test` 1381/1381 (eran 1373; cada test nuevo con su rojo
> visto), `check` 0/0, **build 156**, y en la vista previa a 375 px: los nueve casetes sin desborde,
> los cinco desafÃ­os al llegar (y uno de otro juego o con un cuadrante inventado no pinta nada),
> dos ejes y tapa compartiendo, la correcciÃ³n con "MandÃ¡ por mail" en la Redondopedia, las dos
> calcomanÃ­as, Skayboy cargando sus seis niveles en el build de producciÃ³n. `revisor` con
> `REV-17` en curso.
>
> **Del usuario, y solo del usuario:**
> - Los **temas enteros en mp3** (`npm run generar-fragmentos -- "<carpeta>" --enteros`) y los
>   9 temas sin fragmento (*Cordero atado* y "Pianito").
> - Abrir en un navegador los dos IDs de Spotify ambiguos (*Mi perro dinamita*, *La bestia
>   pop*, `INV-140`) si quiere su botÃ³n.
> - Si quiere el cotejo de la letra: habilitar `acordes.lacuerda.net` en el acceso de red.
>
> **Abierto, sin trabar:** el largo del portal con once casetes (`FIND-98`, `experiencia`,
> `UX-25`); sacar `temaFijo` de `skayboy.json` (resto de la cinta: `arquitectura` ya dijo quÃ©
> toca, `contratoVersion: 4`); `CNT-29` (renglÃ³n del lugar de Skayboy y la comparaciÃ³n al
> volver de dos ejes); Skayboy no comparte (la pieza de `BR-27` no estÃ¡ diseÃ±ada); `MM-40`
> espera la nota de Infobae; las propuestas de `contenido` sobre el filtro de la letra
> (`Docs/SUGERENCIAS/CNT-para-hilo-principal-anotaciones-y-erratas-que-pasan-el-filtro.md`).
> Ojo de `arquitectura`: corregir un nivel publicado de Skayboy lo devuelve a `borrador`
> (`CTR-16.7` pone `deDos: false` al tocar la grilla) y lo saca del sitio.

> ## ðŸ‚ OKTUBRE, LA MOSCA QUE SE ACERCA, Y SIN CINTA (2026-10-01)
>
> **Rama `ciclo-16/mas-o-menos`, sobre `0ebfa8f`** (la mezcla con `main` que trajo el #18 y el
> #19). **Integrado a `main` con el PR #21** (`2678050`). Dos pedidos
> del usuario el mismo dÃ­a, registrados en `D-49` y `D-50`:
>
> 1. *"Entramos en OKTUBRE, el mes del disco, hagamos que la pÃ¡gina refleje esto. [â€¦] que la
>    mosca en desktop vuele alrededor del mouse [â€¦] y en mobile que vuele como ahora pero si
>    el usuario toca trate de ir a volar alrededor de donde toca. Que todas las entradas de
>    juegos del home tengan un detalle o un disco entero, no el svg del cassete, cada uno
>    diferente."* â†’ `D-49`.
> 2. *"Saquemos lo de la cinta en todos lados, en el juego de adivinar el tema a veces salta
>    sola y hace un ruido blanco molesto."* â†’ `D-50`.
>
> **Lo que hay:**
> - **El afiche de octubre** en el portal: sello OKTUBRE, estampa "EL 4 CUMPLE 40" (cambia el
>   4 y el 5, y cuenta los aÃ±os con la fecha del telÃ©fono), y un almanaque con **los seis de
>   los diez discos que salieron en octubre** (*Oktubre*, *Â¡Bang! Â¡Bang!*, *La mosca y la
>   sopa*, *Lobo suelto*, *Cordero atado*, *Luzbelito*), sacados de las fichas rotuladas
>   `hecho` por `lib/sitio/oktubre.ts`. Solo se ve en octubre, decidido en la cabeza del
>   portal antes del primer cuadro. El botÃ³n abre "AdivinÃ¡ el tema" con *Oktubre* elegido
>   (`?disco=oktubre`, nuevo en `partida-tema.ts`).
> - **Los nueve casetes** con una pieza de tapa distinta: tres tapas enteras, tres detalles,
>   tres recortes; ninguno con el casete dibujado ni con el perro. `portal.test.ts` falla si
>   vuelve un dibujo, si dos repiten, o si una pieza no acredita su disco (`D-21`).
> - **La mosca**: fÃ­sica pura en `lib/sitio/mosca.ts` (10 tests, con rojo visto), isla en
>   `scripts/mosca.ts`. Con mouse revolotea a 26â€“110 px del puntero; con el dedo, un toque
>   (no un arrastre) la lleva ~4,5 s y vuelve al recorrido de CSS sin salto.
> - **La cinta, afuera**: interruptor, cama, rocola, pÃºa y rutas sonoras borrados con sus
>   tests. El audio de los juegos no cambiÃ³. Skayboy suena con sus tres efectos, sin tema
>   fijo y **sin forma de callarse** (decisiÃ³n abierta para `experiencia`).
>
> **Verificado:** `npm test` 1373/1373 (eran 1442: se fueron los tests de la cinta y entraron
> 21 nuevos), `check` 0/0, build 153, validador `APTA`. En la vista previa a 375 px: el
> afiche, los nueve casetes, el crÃ©dito con los ocho discos, el botÃ³n que llega con *Oktubre*
> elegido y 9 temas, ninguna `.cinta` en ninguna pantalla, Skayboy cargando en el build.
> La mosca se midiÃ³ con eventos sintÃ©ticos (el panel oculto no da cuadros de animaciÃ³n).
>
> **Abierto, sin trabar:**
> - **El lienzo** (hojas 08 y 09) no muestra el afiche ni los tres materiales del casete. No
>   entrÃ³ ningÃºn token nuevo, pero es estructura nueva y el circuito de `diseno-marca.md`
>   pide que empiece en el diseÃ±o.
> - `Docs/SUGERENCIAS/HILO-para-todos-se-saco-la-cinta.md`: cada rol marca sin vigencia lo
>   suyo (`ADR-04`, `ADR-07`, `UX-21`, `UX-26`, `CNT-20`â€¦), y `arquitectura` decide si se
>   borra el campo `temaFijo` de `skayboy.json`.
> - Si el dev server tira 504 en `kaplay.js` despuÃ©s de un build, se reinicia `astro dev`.
>
> **Del usuario:** el commit, y probar la mosca con un mouse de verdad y en el telÃ©fono.

> ## ðŸ”¢ "MÃS O MENOS": EL JUEGO NUEVO, `US-10` (2026-09-25, tarde)
>
> **Rama `ciclo-16/mas-o-menos`, sobre `ciclo-16/lo-barato-que-se-ve` en `4345b66`.** Pedido
> del usuario: *"tomÃ¡ un juego barato del estado que no estÃ© hecho y resolvelo completamente"*.
> Se tomÃ³ `IDEA-11`, la otra barata del backlog (`IDEA-09` ya era `US-06`). A mitad de camino
> el usuario lo ampliÃ³: *"que sean preguntas con respuesta de nÃºmero pero diferentes, no todo
> sobre las letras, sino cuÃ¡ntos integrantes son, cuÃ¡ntos aÃ±os tocaronâ€¦ investigÃ¡ el juego"*.
>
> **QuÃ© es (`D-48`, reescrita ese mismo dÃ­a):** una pregunta con respuesta de nÃºmero y una
> referencia de la misma unidad â€”un nÃºmero que pone el juego, u otro dato con su nÃºmero a la
> vistaâ€”; el jugador dice **MÃ¡s** o **Menos** (para aÃ±os, **Antes** o **DespuÃ©s**). Hasta el
> primer error; el puntaje es la racha. Siete familias que rotan como un mazo: la banda, la
> gente, los recitales (35 datos a mano de `INV-100`), y los discos, lo que dura, en vivo y las
> palabras (derivados en build de `RES-20`, `setlistfm.json` y el cancionero: ~230 mÃ¡s). Las
> palabras se cuentan **en cuÃ¡ntos temas**, no cuÃ¡ntas veces: *criminal* suma 37 en un solo tema
> porque cifraclub escribiÃ³ cada vuelta del estribillo.
>
> **El papel, entero:** `INV-93` (el gÃ©nero: el *Higher Lower Game*, la encuesta de *Card
> Sharks*, los diarios numÃ©ricos que revelan de golpe) Â· `INV-100` (111 nÃºmeros con fuente,
> con nota del hilo principal sobre las filas que no sirven) Â· `US-10`, `BR-32`, `BR-33` y una
> enmienda de `BR-18` (b) acotada a `US-10` (`PRD-mas-o-menos.md`) Â· `CTR-20` con schema e
> invariantes `i1`..`i24` Â· `UX-34` (viste *Un baiÃ³n para el ojo idiota*, el Ãºnico disco
> libre) Â· `CNT-25` Â· `IDEA-11` marcada promovida.
>
> **El cÃ³digo:** `src/lib/mas-o-menos/` (conteo, referencia por escalones de racha con bordes
> que nunca regalan la respuesta, partida con bolsa de familias, pozo, copy),
> `leerDuraciones`/`leerDiscos` en `letra/temas.ts`, la isla, la pÃ¡gina, el casete del portal
> y el renglÃ³n del lugar, y `npm run medir-mas-o-menos` para mirar el pozo a ojo.
>
> **`REV-16`, cerrada el mismo dÃ­a:** seis hallazgos (`FIND-80`..`FIND-85`), los seis
> cerrados. Los dos `ALTA` eran de veracidad: **MM-01** preguntaba "tocando por primera vez"
> en 1976 y `RES-05` solo dice "origen" (el primer show es el Lozanazo, 1977), y **MM-23**
> ("cuÃ¡ntos aÃ±os se llevan el Indio y Skay") da 2 o 3 segÃºn el dÃ­a del aÃ±o; `contenido` los
> reformulÃ³. `revisor` recontÃ³ a mano las 20 palabras y los otros 33 datos: coinciden. Se
> sumaron los 14 rojos del schema (con mutaciÃ³n vista) y, por la enmienda de `BR-18` (b), la
> caja de referencia de un par de setlist.fm dice fuente y fecha **sin enlace**: la pÃ¡gina de
> estadÃ­sticas lista todos los conteos, y un enlace antes de responder regalarÃ­a la respuesta.
>
> **Verificado al cerrar:** `npm test` 1439/1439, `check` 0/0, build 153, validador `APTA`, y
> jugado en la vista previa a 375 px (pares de en vivo con fuente y fecha, aÃ±os con
> Antes/DespuÃ©s, el desplegable de temas de una palabra, el resultado, el desafÃ­o de un
> amigo, el casete en el portal).
>
> **Abierto, sin trabar:**
> - La fila de *Un baiÃ³n* en el mapa secciÃ³nâ†’disco de `UX-04` (el mismo pendiente que dejaron
>   `UX-06` y `UX-23`).
> - `RES-106`..`RES-139` libres, por si se quiere una segunda ronda de nÃºmeros (las tres
>   bandas de despuÃ©s de la separaciÃ³n, `RES-47`).
> - **Integrado a `main` el 2026-09-25**, a pedido del usuario (*"mergeÃ¡ el #18 y despuÃ©s
>   este"*): primero el #18 (rÃ¡fagas 4 y 5), despuÃ©s el #20 (este juego, con los tres commits
>   de "lo barato que se ve", que no tenÃ­an PR propio). Para mergear el #20 hubo que traer
>   `main`, que ya tenÃ­a el #19 (el pulido de arte): cuatro conflictos, resueltos quedÃ¡ndose
>   con los dos lados (la portada, el casete de Momo, `ESTADO`) y, en el botÃ³n de "AdivinÃ¡
>   el tema", con el de `main`, que ya traÃ­a el arreglo de la negrita falsa. Sobre la mezcla:
>   `npm test` 1442/1442, check 0/0, build 153, validador `APTA`, portal y juego mirados en la
>   vista previa.
> - **Lo que el usuario puede revertir:** si prefiere "cuÃ¡ntas veces" en vez de "en cuÃ¡ntos
>   temas" para las palabras, `D-48` dice quÃ© cuesta.
>
> **Del usuario:** jugarlo en el telÃ©fono, y el push y el PR.

> ## ðŸ§¹ LO BARATO QUE SE VE: SIETE ARREGLOS EN LO PUBLICADO (2026-09-25)
>
> **Rama `ciclo-16/lo-barato-que-se-ve`, sobre `main` en `b1a5bb4`** (o sea, encima de las
> rÃ¡fagas 4 y 5 del PR #18). Pedido del usuario: analizar el estado y resolver lo mÃ¡s barato
> que mÃ¡s valor le agregue a la pÃ¡gina. Se jugÃ³ el sitio publicado en un telÃ©fono emulado y se
> cruzÃ³ con una clasificaciÃ³n de los 121 traspasos (39 abiertos, 82 resueltos en disco). Todo
> lo de abajo toca lo que la gente ya ve, nada de Skayboy.
>
> 1. **La portada decÃ­a "EN LA COCINA" de "CompletÃ¡ la letra"**, uno de los cuatro juegos de la
>    v1, mientras su pÃ¡gina ya se jugaba. Ahora el portal le pregunta al banco con el mismo
>    `cargarBanco()` que la pÃ¡gina (`src/lib/sitio/portal.ts`).
> 2. **Los discos sin tildes.** La cabecera de la letra y el cancionero armado decÃ­an "ULTIMO
>    BONDI A FINISTERRE" o "GULP" pelado. Hay un solo mapa de tÃ­tulos, en `letra/discos.ts`.
> 3. **Los distractores de la letra se delataban solos** (11 de 19 Ã­tems): "GUITARRA", "tiem",
>    mayÃºsculas mezcladas, tildes perdidas. Filtros y forma nuevos en `generar-letra.mjs`.
> 4. **La respuesta a la vista en su contexto** (5 de 19): se descartan esos huecos. `contenido`
>    eligiÃ³ 7 reemplazos (`CNT-23`): **21 `listo`, 9 fÃ¡ciles, 7 medias y 5 difÃ­ciles** (antes
>    19, con 11 / 4 / 4). La semilla del sorteo pasÃ³ a ser la huella del verso, asÃ­ un
>    `--reanclar` ya no vuelve a sortear todo el banco.
> 5. **Un verso roto que salÃ­a como pista**: "para ,l mi viejo" (*MaldiciÃ³nâ€¦*) era una `Ã©` en
>    cp850. Arreglado en el dato y como errata en `ingerir-cancionero.mjs`.
> 6. **CrÃ©ditos de tapa** (`CNT-24`): `TP-007`/`TP-008` firman "Rocambole, Semilla y
>    Meroyuela" (cierra `FIND-21` de `REV-05`), y la ficha de disco de la Redondopedia ya no
>    dice "Rocambole" fijo en los diez: *La mosca y la sopa* dice "autorÃ­a sin confirmar".
> 7. **Negrita falsa** en los botones de "AdivinÃ¡ el tema" y "AdivinÃ¡ la tapa" (Archivo Black
>    tiene un solo peso). `estilos.test.ts` la mira en todo el sitio.
>
> **Verificado:** `npm test` 1364/1364 (23 nuevos, cada uno con su rojo visto), `check` 0/0,
> build 152, validador `APTA`, y la vista previa del build jugada a 375 px. Traspasos:
> `HILO-para-contenido-y-arquitectura-los-distractores-se-delataban.md` (la tabla final de los
> 21, y la diferencia entre `CTR-04.8` y lo que hace el script).
>
> **Lo que quedÃ³ recomendado y no se hizo, por no ser barato:** la puerta de "Â¿QuÃ© tipo de
> ricotero sos?" en la portada (terminado, sin enlace; pide `experiencia` por el largo del
> portal de `UX-25` y el casete Luzbelito, y `contenido` por la copia); fichar lacuerda.net (21
> temas afuera de la letra); limpiar las letras de *La bestia pop* y *Criminal mambo*, que
> quedaron afuera del pozo.

> ## ðŸ“ EL MISMO PULIDO, EN "SACALO POR LA LETRA" (2026-09-25)
>
> **Pedido del usuario:** *"dale, hacÃ© lo mismo con sacalo por la letra"*, despuÃ©s del pulido
> de "AdivinÃ¡ el tema" de abajo.
>
> **Integrado a `main` el 2026-09-25**, a pedido del usuario (*"integralo"*), despuÃ©s de
> traer `main` con el ciclo 16 adentro (PR #16 y #17). El Ãºnico choque fue este archivo; el
> cÃ³digo se mezclÃ³ solo â€”`main` cambiÃ³ cÃ³mo se arma la vuelta (`armarVuelta`,
> `armarRonda`) y el pulido cambiÃ³ cÃ³mo se veâ€” y se verificÃ³ sobre la mezcla:
> **`node --test 'src/**/*.test.ts'` 1085 en verde**, `npm run check` 0 errores, build 152,
> y los recorridos de los dos juegos y del portal en el navegador sobre el build.
>
> **VerificaciÃ³n:** `node --test 'src/**/*.test.ts'` **676 en verde** (3 nuevos, de la
> escalera de versos) Â· `npm run check` 0 errores Â· `npm run build` **152 pÃ¡ginas** Â· los
> dos juegos recorridos enteros sobre el build a 390Ã—664, 360Ã—740 y 1280Ã—860, sin
> desborde lateral.
>
> ### Lo comÃºn pasÃ³ a un mÃ³dulo: `src/scripts/sacar-temas.ts`
>
> La tapa impresa por pasadas, su crÃ©dito (`D-21`), las casillas de la vuelta, la
> escalerita, la vibraciÃ³n del acierto y **el modo teclado** vivÃ­an solo en la isla de
> audio. Ahora los usan las dos. EstÃ¡ declarado en el censo de `estilos.test.ts` como
> tablero propio, con sus estados (`partida--tecleando`, `vuelta-casilla--*`,
> `escalerita-paso--*`), que salieron de `ESTADOS_TEMA`.
>
> ### QuÃ© cambiÃ³ en el juego
>
> - **Portada:** chapa de puntajes (1 Â· 2 Â· 4 Â· 8 versos â†’ 100 Â· 80 Â· 60 Â· 40) y JUGÃ con
>   canto en el peltre de Momo.
> - **Partida:** casillas de la vuelta; "TenÃ©s 4 versos Â· Vale 60"; **"PasÃ¡ (+2 versos)"**
>   y "MirÃ¡ cuÃ¡l era" en el Ãºltimo; lo ya arriesgado tachado en la lista; Enter elige el
>   primero. **La hoja de versos es papel** (tinta del fondo sobre `--papel`, par testeado,
>   renglones en el borde del papel): el lugar del juego ya decÃ­a "un papel arrugado te pesa
>   en el bolsillo". **Diverge de `UX-08` Â§4** (que pedÃ­a el gris elevado): queda para que
>   `experiencia` lo ratifique.
> - **Con teclado:** acÃ¡ lo que no se puede perder son los versos. La hoja y la lista **se
>   reparten el alto** (la hoja nunca baja de dos renglones) y la hoja vuelve sola al verso
>   nuevo. Si el foco llega sin teclado, la cabecera vuelve (consulta de contenedor).
> - **RevelaciÃ³n:** sellos "Â¡Lo sacaste!" / "+60", vibraciÃ³n, y **la tapa del disco impresa
>   por pasadas**, que este juego no tenÃ­a. Por eso el pie ya no se esconde con el tema
>   revelado: el crÃ©dito de la tapa vive ahÃ­ (la regla del pie lo habÃ­a dejado escrito).
> - **Resultado:** "1 de 5 temas Â· 60 de 500 puntos", estampitas y escalerita de 4.
>
> ### ðŸ”´ Un defecto que se habÃ­a colado en el pulido anterior, cerrado
>
> El sello "Â¡La sacaste!" se pintaba sobre `.revelacion.ok .micro`, que **tambiÃ©n existe en
> este juego**: acÃ¡ ocupaba el renglÃ³n entero y, torcido, desbordaba la pantalla por el
> costado. Ahora el sello mide lo que dice (`width: fit-content`) y los dos juegos lo llevan
> en el mismo renglÃ³n de cabeza. Medido: 390 de ancho en los dos.
>
> ### Lo que queda
>
> | QuÃ© | DueÃ±o |
> |---|---|
> | Probar los dos modos teclado en un iPhone y un Android de verdad | usuario |
> | Ratificar la hoja de papel contra `UX-08` Â§4, y pasar la regla, los sellos y la escalerita al lienzo (hoja 08) | `experiencia` |

> ## ðŸŽ› PULIDO DE ARTE: EL PORTAL Y "ADIVINÃ EL TEMA" (2026-09-24)
>
> **Pedido del usuario, textual:** *"pulido intenso y mejora de arte del home y el juego de
> adivinar el tema, debe quedar impecable en mobile [...] fÃ¡cil de jugar, lindo de ver y
> satisfactorio de ganar [...] tenÃ© en cuenta la UX como que para escribir necesitan
> teclado. Mejoremos la barra de tiempo en el juego, se ve muy ai slop."*
>
> **VerificaciÃ³n:** `node --test 'src/**/*.test.ts'` **673 en verde** Â· `npm run check` 0
> errores (los mismos 15 avisos menores de antes) Â· `npm run build` **152 pÃ¡ginas** Â·
> recorrido entero medido en el navegador sobre el build, a 390Ã—664, 360Ã—740 y 1280Ã—860.
> Ojo: `npm test` a secas corre 154, porque el `**` del script no lo expande el `sh` de
> este contenedor; la cuenta de 673 es con el patrÃ³n entre comillas.
>
> ### La barra de tiempo dejÃ³ de ser una barra
>
> Las seis cajitas grises con relleno naranja y borde petrÃ³leo eran la barra de progreso
> por defecto de cualquier reproductor. Ahora es **una tira de papel impresa como una
> regla, que sale del casete**: cada escalÃ³n es un tramo separado por un corte de tinta,
> con rayitas cada medio segundo; lo que todavÃ­a no te dimos estÃ¡ **tramado**, lo que te
> dimos es papel limpio, y lo que escuchaste queda **entintado** en el naranja de Lobo
> suelto con `multiply`. Una **aguja** corre mientras suena y se para en el tope. Los seis
> nÃºmeros van abajo (antes faltaban 0,1 y 0,5) y el del tope se estampa. La tecla de
> escuchar tiene canto, se hunde al tocarla y **queda trabada mientras suena**, como el
> PLAY de una casetera.
>
> ### Con el teclado abierto, la pantalla es otra (`partida--tecleando`)
>
> En un telÃ©fono el teclado tapaba justo lo que se usa: lista, caja y botÃ³n. Ahora, con el
> foco en la caja y puntero tÃ¡ctil, la partida ocupa **exactamente la ventana visual**
> (`visualViewport`) como columna pegada arriba del teclado: tecla + regla compacta, el
> Ãºltimo intento, la lista (lo Ãºnico que cede alto), la caja y el botÃ³n. **El teclado no se
> cierra al tocar un botÃ³n de la partida** (`mousedown` prevenido): errar deja escribir de
> nuevo en el acto mientras suena el escalÃ³n nuevo; acertar lo cierra. Enter ("Ir") elige
> la primera sugerencia y, con un tema elegido, arriesga. Lo ya arriesgado queda tachado y
> sin poder elegirse ("Ya lo probaste"). **Medido en emulaciÃ³n, no en un iPhone real.**
>
> ### Lo demÃ¡s
>
> - **Portada del juego:** la chapa de puntajes en papel (audio / vale) reemplaza la mitad
>   de la bajada que contaba la escalera en prosa.
> - **Partida:** casillas de la vuelta en la cabecera (llena, tachada, la que va);
>   renglones numerados con el audio de cada intento; "Vale 100"; **"PasÃ¡ (+0,4 s)"**
>   dice cuÃ¡nto audio compra, y en el Ãºltimo intento dice "MirÃ¡ cuÃ¡l era".
> - **El acierto:** "Â¡La sacaste!" y "+100" son sellos que caen y apoyan
>   (`sello-golpe`, en el compÃ¡s de `--duracion-pasada`, en `ANIMACIONES`), mÃ¡s un toque de
>   vibraciÃ³n donde hay motor. Errar no se mueve ni vibra.
> - **Resultado:** "3 de 4 temas Â· 260 de 400 puntos" y una **escalerita** por tema con lo
>   que pasÃ³ en cada escalÃ³n (tachada, raya, llena), distinta por forma.
> - **Portal:** el sello JUGÃ se leÃ­a a **1,95:1** (tinta del disco sobre papel): ahora es
>   un sello lleno, `--fondo` sobre la tinta del disco, par ya testeado. Los casetes de
>   "Sacalo por la letra" y "AdivinÃ¡ la tapa" pegan el recorte real de su disco (medallÃ³n
>   de Momo, bondi) en vez del casete dibujado; cada casete lleva su nÃºmero de pista (A1â€¦
>   B2); tocar un casete da seÃ±al. **El crÃ©dito del pie ahora nombra los discos de los
>   recortes** (antes el lobo y la mosca no se acreditaban): `discoDeRecorte` en `arte.ts`.
>
> ### Lo que queda, con dueÃ±o
>
> | QuÃ© | DueÃ±o |
> |---|---|
> | **Probar el modo teclado en un iPhone y un Android de verdad** (la emulaciÃ³n no abre teclado; se simulÃ³ achicando la ventana) | usuario |
> | Reflejar la regla, los sellos del acierto y la escalerita en la hoja 08 del lienzo (no se tocÃ³ ningÃºn hex ni token: todo sale de `tokens.css`) | `experiencia` |
> | `.arriesgar` y `.seguir` tienen canto solo en este juego (`.juego-tema`): "sacalo por la letra" comparte las clases y no se tocÃ³ | `experiencia` |
> | `escalera.ts` perdiÃ³ `tramosConEtiqueta` y `PISO_ETIQUETA_PCT` (los seis nÃºmeros entran por ancho mÃ­nimo); suma `etiquetaDeRegla`, `extraAlPasar` y `formatoSegundos`, con test | â€” |

> ## ðŸ“± EL USUARIO JUGÃ“ EN SU TELÃ‰FONO: `D-47` Y LA RÃFAGA 5 (2026-09-24, tarde)
>
> **PR para probar: https://github.com/knesantos/ArcadeRicotero/pull/18** (rama
> `ciclo-16/pantalla-completa-y-victoria`, rÃ¡fagas 4 y 5). El #17 ya estÃ¡ mergeado en `main`
> (`e5a2692`), junto con el #16, la auditorÃ­a de prompts; `main` local los integrÃ³ en `b56dfaa`.
> La vista previa de Vercel siembra los borradores (`nivelesASembrar`) y estÃ¡ detrÃ¡s del login
> de Vercel.
>
> **Lo que dijo despuÃ©s de jugar el nivel 1:** los controles se sienten bien; **el scroll
> horizontal rompe los controles**; quiere pantalla completa con los controles medio
> transparentes encima, los seis niveles en fila, una victoria donde los dos bailen, y
> guitarras para Skay y cigarrillos para Poli. Todo en **`D-47`**, que enmienda la
> prohibiciÃ³n de festejo de `BR-23`: **cada uno baila su propio baile, sin gestos de pareja.**
>
> **RÃ¡faga 4 cerrada y revisada** (`T-295`, "Segunda pasada" al final de `REV-15`): los siete
> `FIND-71`..`FIND-77` cerrados en disco, `npm test` 1161/1161, check 0/0, build 152, auditor
> 0, validador `APTA`. "AdivinÃ¡ el tema" reparte 8/56/31; "CompletÃ¡ la letra" saca su nivel
> del conteo (el contexto sigue al nivel, `BR-30`/`CTR-04.14`); la sala tiene puerta abierta
> (`sala.v2`, `UX-32`) y el botÃ³n `#seguir-juego`. Dos anclas de la letra quedaron en
> `fuenteUnica.enEspera` hasta que `contenido` elija versos nuevos
> (`HILO-para-contenido-dos-anclas-sin-vecinos.md`).
>
> **Papel de la rÃ¡faga 5 cerrado:** `BR-31`, `UX-33`, `CTR-16.4` (v3: un tesoro por personaje),
> `CTR-16.11` (el avance, `arcade.skayboy.avance`), `CTR-15.7` (`baila`, 4 cuadros a 8/s),
> `ADR-10` (`ARQ-pantalla-completa.md`) y `CNT-22`, verificados y alineados.
>
> **CÃ³digo de la rÃ¡faga 5 cerrado y revisado** (`T-300`..`T-304`, "Tercera pasada" de `REV-15`;
> `FIND-78` y `FIND-79` cerrados por el hilo principal ahÃ­ mismo). `npm test` 1341/1341, check
> 0/0, build 152, auditor 0 (7 PNG), validador `APTA`.
>
> - **Pantalla completa** (`ADR-10`, `UX-33 Â§1`): el sello de la esquina entra y sale; sin
>   scroll ni zoom; la del sistema se pide sobre `.fichin` donde existe, y en iPhone el modo
>   ocupa la ventana. `pantalla.ts` (encuadre entero) y `modo-pantalla.ts` (el modo, jugable en
>   Node).
> - **Victoria bailada** (`UX-33 Â§2`): `baila`, 4 cuadros a 8/s, coreografÃ­as distintas, sin
>   moverse; el contador Â«1 guitarraÂ» / Â«1 cigarrilloÂ» solo ahÃ­; el toque sigue. **Al ganar el
>   sexto, el toque vuelve a `NIV-01`**: la pieza compartible de `BR-27` todavÃ­a no existe
>   (traspaso a `producto` y `experiencia`).
> - **La fila y el avance** (`CTR-16.11`): `arcade.skayboy.avance`, `avance.ts`.
> - **Guitarras y cigarrillos** (`CTR-16.4` v3): 1/1, 1/1, 2/2, 2/2, 2/2, 2/2; solo el dueÃ±o
>   junta el suyo; trazas regrabadas. Atlas `skayboy.v2`, `poligirl.v2`, `sala.v3`.
> - **Hoja del baile para el usuario:** `hoja-baile.png` (scratchpad de la sesiÃ³n). Espera su
>   aprobaciÃ³n (`D-44`), igual que la hoja 14.
>
> **Abierto, sin trabar:** la puerta abierta queda detrÃ¡s del muÃ±eco (traspaso a
> `experiencia`); si cada coleccionable tiene que probarse alcanzable en el build (traspaso a
> `producto`/`arquitectura`); `E11` de `CTR-16.10.10` no estÃ¡ en `niveles.ts`; el sello muestra
> el estado (Â«PANTALLA NORMALÂ») con el molde de la cinta, y hay que ver en el telÃ©fono si se
> entiende que se toca para agrandar.

> ## âœ… CICLO 16, RÃFAGA 3 CERRADA Y REVISADA: `REV-15` (2026-09-24)
>
> **`npm test` 1081/1081 (eran 673 al abrir el ciclo) Â· `npm run check` 0/0 Â· build 152 Â·
> validador `APTA` Â· auditor de paleta 0.** Todo commiteado en `main` y cada commit de cÃ³digo
> probado en un worktree limpio. El Ãºltimo de cÃ³digo es `3fe5dc6`. **No se hizo push.**
>
> ### Lo que ya es juego
>
> - **Seis niveles de Skayboy y Poligirl**, en `borrador`, cada uno con su traza grabada
>   que `npm test` vuelve a jugar: escalones 2/2/2, tolerancia sobre la de su escalÃ³n,
>   paridad contada. Los mecanismos (palanca, placa, compuerta, caja) andan en el mundo.
> - **La isla dibuja con los sprites aprobados.** Para verlo: `npm run dev` y
>   `/juegos/skayboy-y-poligirl/?nivel=NIV-04` (el parÃ¡metro solo existe en desarrollo).
> - **"AdivinÃ¡ el tema" tiene 8 FÃ¡ciles por conteo en vivo** y **"Sacalo por la letra"
>   saca la dificultad del conteo en tercios** (`D-46`). `popularidad.ts` ya no existe.
>
> ### `REV-15`: un `ALTA` y seis `BAJA`
>
> **`FIND-71` (`ALTA`):** en "AdivinÃ¡ el tema" `BR-30` ya decidiÃ³ tercios para Media y
> DifÃ­cil, pero el cÃ³digo sigue con 8/82/5 y `CTR-19.14` lo lista como abierto. `FIND-72` a
> `FIND-77` son colas chicas: traspasos a `arquitectura`, un comentario falso, una
> justificaciÃ³n de `NIV-03` y dos evasiones que el auditor de la isla no caza.
>
> ### El usuario, hoy
>
> - **"CompletÃ¡ la letra" tambiÃ©n sale del conteo** (precisiÃ³n de `D-46`). Es `T-286` a
>   `T-288` (`ORQ-plan-ciclo-16.md Â§2.4`).
>
> ### PrÃ³ximo paso: la rÃ¡faga 4 (`ORQ-plan-ciclo-16.md Â§2.5`)
>
> `T-286`..`T-288` ("CompletÃ¡ la letra"), `T-289`/`T-290` (que ganar se vea: hoy la sala no
> tiene puerta abierta), `T-291`/`T-292` (`FIND-71`), `T-293`/`T-294` (las colas de
> `REV-15`) y `T-295` (la revisiÃ³n). Rango ampliado a `T-295` en `Docs/IDS.md`.
>
> **Lanzada el 2026-09-24 a las ~13:45 como el workflow `wf_46a0a8b5-004`.** Si se corta,
> se retoma con `resumeFromRunId` y lo terminado vuelve de cachÃ©. Al terminar: pegar la
> "Segunda pasada" que devuelve `T-295` al final de `REV-15`, commitear probando en un
> worktree limpio, y mirar en el navegador que ganar se vea (`?nivel=NIV-01`).
>
> ### ðŸ”´ Lo que es del usuario
>
> | QuÃ© | Traba |
> |---|---|
> | **Jugar los seis niveles en un telÃ©fono**, de a dos y solo | que pasen a `listo` y producciÃ³n los sirva |
> | Los temas enteros: `npm run generar-fragmentos -- "<carpeta>" --enteros` | que el juego suene (`D-39`) |
> | Push a GitHub | nada: `main` local tiene todo |

> ## ðŸ•¹ CICLO 16, RÃFAGA 2 CASI CERRADA, Y TRES COMMITS EN MAIN (2026-09-24)
>
> ### Lo que decidiÃ³ el usuario hoy
>
> - **AprobÃ³ la paleta del pixel (hoja 14 del lienzo) y los dibujos.** Ya estÃ¡n en
>   `tokens.css` (15 `--px-*`) y en `public/sprites/` (tres atlas; el auditor los da en regla).
>   La hoja del pixel es la **14, no la 13**: `tokens.css` ya llamaba hoja 13 a la imprenta.
> - **`D-46`: la dificultad de todo juego con canciones sale del conteo de veces tocado en
>   vivo.** Enmienda `D-27`. Abre `T-282`..`T-285` (`ORQ-plan-ciclo-16.md Â§2.4`).
> - **"Commitea e integra a main"**. Hecho en tres tandas, cada una probada en un worktree
>   limpio con `node_modules` enlazado (740 tests, `tsc` 0, build 152):
>   `49d955d` los documentos Â· `b6559aa` el pixel (paleta, imprenta, auditor, muÃ±ecos, sala,
>   atlas) Â· `6bebbfe` la pantalla. **No se hizo push.**
>
> ### DespuÃ©s, todo el cÃ³digo entrÃ³ (2026-09-24, maÃ±ana)
>
> `0f4c99e` + `149ea16` los recitales y los 8 FÃ¡ciles de `US-02` (`T-279`; el segundo commit
> suma dos archivos que el primero olvidÃ³: **la prueba en worktree limpio lo cazÃ³**, sin eso
> `0f4c99e` no compila solo) Â· `fa928ea` el motor (`T-266`, `T-267`, `T-272`). Los tres
> probados en limpio: **952/952, `tsc` 0, build 152.** **`BR-28` queda levantada**: un test
> cuenta los 8 FÃ¡ciles.
>
> ### ðŸ”´ El lÃ­mite semanal de uso cortÃ³ la noche (2026-09-24, ~01:30 a 04:00)
>
> Fallaron tres agentes con *"You've hit your weekly limit"*: `T-272` (a un import del final:
> `CUERPO_ALTO` en `solucionador.ts`, que completÃ³ el hilo principal), la coherencia de la
> rÃ¡faga 2 y `T-284`. Se volvieron a lanzar en la rÃ¡faga 3. **Su verificaciÃ³n adversarial de
> `T-272` corre ahÃ­**: `fa928ea` estÃ¡ verde pero nadie que no lo armÃ³ lo mirÃ³ todavÃ­a.
>
> ### `BR-30`, y una lectura que el usuario tiene que confirmar
>
> `producto` decidiÃ³ que **"Sacalo por la letra" (`US-07`) pasa a dificultad por conteo en
> vivo, en tercios**, y que **el quiz y "CompletÃ¡ la letra" (`US-03`) no pasan**: ahÃ­ la
> dificultad mide otra cosa (lo oscuro del dato, el contexto del hueco). El usuario dijo
> *"todo lo que sea con canciones"*. **Preguntarle si esa lectura le cierra.**
>
> ### ðŸ”´ Se trabÃ³ dos veces, y cÃ³mo se ve
>
> 1. **2026-09-23, 16:03 â†’ 19:05: corte general.** Los seis agentes activos quedaron quietos
>    181-182 minutos y volvieron juntos. MÃ¡quina suspendida o red caÃ­da. Tres agentes se
>    relanzaron desde cero solos.
> 2. **`T-272` (los mecanismos): dos instancias colgadas** esperando una respuesta del modelo
>    que no volviÃ³ (184 y 45 minutos), cortadas y relanzadas. La tercera avanza. Pausas de 4 a
>    6 minutos con esfuerzo `max` son normales, no colgadas.
>
> **CÃ³mo diagnosticarlo sin adivinar:** en
> `~/.claude/projects/<proyecto>/<sesiÃ³n>/subagents/workflows/<run>/` cada agente tiene su
> `agent-*.jsonl` con timestamps (UTC). Un hueco igual en todos a la vez es un corte general;
> un hueco en uno solo que termina en *"Request interrupted"* es una llamada colgada.
>
> ### Lo hecho en la rÃ¡faga 2 (verificado)
>
> | Tarea | QuÃ© quedÃ³ |
> |---|---|
> | `T-267` | Traza grabada en `src/data/skayboy-soluciones.json`, `soluciones.ts`, paso fijo `CUADRO_SEG` en la isla, CTR-16 v2 sin `verificaciones.solo` |
> | `T-270` | `CNT-21`: los seis nombres; la lÃ­nea de vertical se queda y solo aparece donde es verdad |
> | `T-271` | **La pantalla entra y ya no estÃ¡ muda.** Medido en el navegador sobre producciÃ³n: 812Ã—375 y 375Ã—812 sin teclas afuera, rÃ³tulo visible fuera del Ã¡rea |
> | `T-273`, `T-274` | `CTR-19` (el conteo citado y el archivo de recitales) y `BR-18 (h)` |
> | `T-275`, `T-276` | Los muÃ±ecos y la sala, dibujados como texto, aprobados, impresos |
> | `T-281` | `INV-76`: **la Ãºnica fuente abierta es MusicBrainz (CC0), con 2 recitales** con setlist (8 y 9-dic-1995) |
>
> ### Corriendo al escribir esto: la rÃ¡faga 3 y el cierre, en un workflow
>
> Verificar `T-272` â†’ `T-277` (los cinco niveles) y `T-278` (la isla dibuja con los atlas) en
> paralelo; `T-284` (contratos de `D-46`) â†’ `T-285` (la dificultad de `US-07` por conteo); la
> coherencia de las rÃ¡fagas 2 y 3; y `T-280`, que devuelve el texto de `REV-15` para pegar.
> `T-282` (`INV-89`, el conteo completo: 198 tÃ­tulos) y `T-283` (`BR-30`) ya cerraron.
>
> **Si esto se corta:** el workflow es `wf_e717167e-b84`, y se retoma con
> `resumeFromRunId`; lo terminado vuelve de cachÃ©.

> ## ðŸ¤– CICLO 16, RÃFAGA 1 CERRADA: LA MÃQUINA YA JUEGA SOLA (2026-09-23)
>
> **`npm test` 746 en verde (eran 673) Â· `tsc --noEmit` 0 errores Â· `npm run build` 152
> pÃ¡ginas.** **Nada commiteado todavÃ­a**: son ~30 archivos, y el usuario no pidiÃ³ commit.
>
> ### CÃ³mo se trabajÃ³
>
> Dos workflows: **34 agentes** para las nueve tareas â€”cada una verificada por alguien que no
> la armÃ³, corregida por su dueÃ±o y reverificadaâ€” mÃ¡s una pasada de coherencia cruzada; y
> **18 agentes** para cerrar lo que esa pasada dejÃ³. Lo que sigue estÃ¡ verificado contra el
> disco. **La pasada de coherencia se equivocÃ³ una vez**: dio por coincidente la palanca de
> `UX-31` con `CTR-16.10.2` y eran opuestas. La cazÃ³ la lectura del hilo principal, no la
> mÃ¡quina: ojo con eso en la rÃ¡faga 2.
>
> ### Lo cerrado
>
> | Tarea | QuÃ© quedÃ³ |
> |---|---|
> | `T-261` | `UX-28 Â§2.3`â€“`Â§2.6` y `Â§4.1`. **El rÃ³tulo de carga vive afuera del mueble**, la cabecera entra en la columna del mueble a Ã—1, el vertical baja las teclas arriba del borde, tabla de alturas para cinco tamaÃ±os. La `Â§2.2` doble quedÃ³ una sola. La lÃ­nea de `CNT-18` "el doble" **solo es verdad** con ancho > 400 y alto â‰¥ 720 |
> | `T-262` | **`BR-29`**: (a) solo el telÃ©fono; (b)(c)(d)(f) la traza; (e) el motor. Tolerancia mÃ­nima **FÃ¡cil â‰¥ 10, Media â‰¥ 6, DifÃ­cil â‰¥ 4 cuadros**. **`verificaciones.solo` se retira**: queda solo `deDos` |
> | `T-263` | **`ADR-09` + `CTR-18`** (`ARQ-solucion-grabada.md`). **Paso fijo de 1/60 en la isla** con acumulador. La traza vive en **`src/data/skayboy-soluciones.json`**, con schema propio, y no viaja al telÃ©fono. Se graba una traza **ensanchada**, no la mÃ¡s corta (la mÃ¡s corta tiene tolerancia 0 hasta en `NIV-01`) |
> | `T-264` | **`CTR-16.10`**: la palanca **por sentido** (derecha activa, izquierda en reposo, saltarla no la mueve), la placa, la compuerta como **tramo vertical de sÃ³lido a sÃ³lido**, la caja. `C` es cielo e `I` infierno, **ahora lo dice el dato**. Regla 3 de `CTR-16.5`: cada entrada tiene piso. `T-253` aceptado |
> | `T-265` | **`UX-31`**: los seis niveles en boceto, escalones 1/1/2/2/3/3, **paridad programada 3 a 3**. Tres bocetos rediseÃ±ados cuando se vio que la palanca no es permanente |
> | `T-266` | **El solucionador** (`src/lib/skayboy/solucionador.ts` + `scripts/resolver-niveles.mjs`). **`NIV-01`: 119 nodos en 25 ms**; de uno 1,79 s (la mÃ¡s corta 1,29 s), tolerancia **30**; de a dos 0,64 s. 25 tests, cada guarda vista en rojo por mutaciÃ³n |
> | `T-268` (mitad) | **La imprenta y el auditor del pixel** (`scripts/imprimir-pixel.mjs`, `scripts/auditar-paleta-pixel.mjs`, `src/lib/pixel/`, 49 tests). El formato de los `.txt` se puede copiar del encabezado de `fuente.ts` y funciona |
> | `T-269` | **`INV-73`** (`RES-73`..`RES-75`). **La condiciÃ³n de `D-45` se cumple**: top sin empate en el puesto 8 (Jijiji 101 Â· Ã‘am fri fruli fali fru 93 Â· Vamos las bandas 90 Â· â€¦). Dos del top-8 son inÃ©ditos fuera de los 105; filtrando, los 8 salen bajando al puesto 10 |
>
> ### ðŸ”‘ Dos decisiones nuevas
>
> - **`D-45` enmendada (el usuario, 2026-09-23).** Los tÃ©rminos de setlist.fm dan licencia **para
>   ver** y prohÃ­ben bots; su API prohÃ­be guardar lo que devuelve. Entonces: **los FÃ¡ciles salen
>   del conteo citado** de su pÃ¡gina de estadÃ­sticas, y **los setlists enteros se guardan solo de
>   fuentes cuya licencia lo permite**. Las busca **`T-281`**, nueva, de `investigador`.
> - **`experiencia` decidiÃ³ la paleta del pixel** (`UX-27`, `UX-30`): **el aire es la luz y el
>   sÃ³lido es la clave** (con el aire en la clave, el bisel se fundÃ­a a 1,00:1); **15 tintas, no
>   16**: la puerta va por forma, como los mecanismos; la luz mÃ¡xima es el blanco de *Gulp!*.
>
> ### ðŸŽ¨ La hoja 13 del lienzo, esperando tu visto bueno
>
> **"13 Â· El pixel del fichÃ­n"** se publicÃ³ en el lienzo (versiÃ³n 14). Son las **15 tintas** con
> su contraste contra la clave, las baldosas de muestra, la prueba en gris y la maqueta del aire.
> **Una elecciÃ³n es del hilo principal y conviene que la mires:** las pieles de Skay y Poli
> estaban a Î”E00 0,79. Se movieron **las dos**, cada una a menos de 7 de lo que muestra la hoja y
> en sentidos opuestos (Skay `#c39c76`, Poli `#feb471`), para que ninguna de las dos personas
> cargue sola con el cambio. **Nada baja a `tokens.css` hasta que apruebes.**
>
> ### Lo que la rÃ¡faga 2 tiene que saber, ademÃ¡s de su fila
>
> - **`T-267`** tambiÃ©n: `CUADRO_SEG` en `mundo.ts`, el acumulador de paso fijo en la isla,
>   `skayboy-soluciones.json` con su schema, el flag `--regrabar`. Y la tolerancia de `NIV-01`:
>   `CTR-18.9` dice 21 (cuenta a mano) y la herramienta mide 30 (`BAJA`, la cierra `T-267`).
> - **`T-272`** toca mÃ¡s que su fila: la leyenda de `skayboy.json`, `esquemas.test.ts`,
>   `niveles.test.ts:48`, y la regla 3 de entradas con piso. Traspaso:
>   `Docs/SUGERENCIAS/ARQ-para-hilo-principal-lo-que-arrastra-ctr-16-10.md`.
> - **Al bajar la paleta**: `src/lib/pixel/tokens.ts` tiene `TOPE_DE_TINTAS = 16` y ahora son 15.
> - **Citas viejas de `UX-28 Â§2.2`** en `skayboy.css:486` y en este archivo: hablan del alto, que
>   ahora es `Â§2.3` (`UX-para-hilo-principal-citas-de-UX-28-que-cambiaron-de-numero.md`).
> - **`T-273` y `T-279` cambiaron** con la enmienda de `D-45`: dos piezas, el conteo citado y el
>   archivo de recitales, y ningÃºn script baja pÃ¡ginas de setlist.fm (`ORQ-plan-ciclo-16.md Â§2.3`).
>
> ### PrÃ³ximo paso: la rÃ¡faga 2
>
> `T-267`, `T-270`, `T-271`, `T-272`, `T-273`, `T-274`, `T-275`, `T-276` y `T-281`. Los dibujos
> (`T-275`, `T-276`) pueden empezar con la paleta en borrador, pero **no entran al atlas** sin tu
> visto bueno a la hoja 13.
>
> ### ðŸ”´ Lo que espera al usuario
>
> | QuÃ© | Traba |
> |---|---|
> | **Mirar y aprobar la hoja 13 del lienzo** (15 tintas, las dos pieles) | que la paleta baje a `tokens.css`, y con ella el arte |
> | **Commitear** las ~30 piezas de la rÃ¡faga 1 | nada las respalda hoy |
> | La partida en el telÃ©fono (ex `T-249`) | que los niveles pasen a `listo` |
> | Los temas enteros: `npm run generar-fragmentos -- "<carpeta>" --enteros` | que el juego suene (`D-39`) |

> ## ðŸ¤– CICLO 16 PLANIFICADO: EL FICHÃN SE PRUEBA SOLO (2026-09-22)
>
> **Plan en `Docs/ORQ/ORQ-plan-ciclo-16.md`: veinte tareas, `T-261`..`T-280`, nada
> construido todavÃ­a.** Arranca sobre `main` en `1478ae7` con el Ã¡rbol limpio y `npm test` en
> **673/673**.
>
> ### Las dos decisiones del usuario, ya escritas
>
> - **`D-44` â€” el pixel lo dibuja el hilo principal, como cÃ³digo.** Grillas de texto en las 16
>   tintas `--px-*`, impresas a PNG por script y controladas por el auditor de paleta. La
>   hoja del usuario pasa a ser referencia. **Nada entra al atlas sin una hoja de contacto que
>   el usuario vio.** Justificado en `Docs/EQUIPO.md`, sin rol nuevo.
> - **`D-45` â€” "FÃ¡cil" en `US-02` es lo mÃ¡s tocado en vivo**, segÃºn los setlists de
>   setlist.fm, y **los setlists se guardan enteros** (pedido textual: *"Guardemos los setlist
>   que encuentre tambiÃ©n"*) en `src/data/recitales.json`. CondiciÃ³n: que `RES-73` muestre
>   cobertura suficiente; si no, vuelve al usuario. **La puerta de `BR-28` al noveno juego se
>   abre cuando un test cuente los 8 FÃ¡ciles (`T-279`), no cuando se escribiÃ³ la decisiÃ³n.**
>
> ### La idea del ciclo
>
> Skayboy y Poligirl tiene un nivel y el piso pide seis listos. **Una mÃ¡quina que juega sola**
> (`T-266`): busca sobre la simulaciÃ³n pura de `mundo.ts` el camino de una persona con un dedo
> por vez, lo graba al lado del nivel, y `npm test` lo vuelve a jugar. Convierte cuatro de las
> seis condiciones de `BR-25` en algo que corre el build; al telÃ©fono le queda lo que solo un
> pulgar sabe. Medido antes de cortar: **la simulaciÃ³n corre a ~217.000 cuadros por segundo**,
> asÃ­ que buscar es cosa de segundos y repetir la traza no le suma nada a `npm test`.
>
> **Hallazgo de la planificaciÃ³n, y es el riesgo nÃºmero uno:** la isla corre a **paso
> variable** (`partida-skayboy.ts:343`, `k.dt()`). Sin pasarla a paso fijo, la mÃ¡quina
> probarÃ­a otra fÃ­sica. Lo decide `T-263` (`ADR-09`) y lo aplica `T-267`.
>
> ### El ciclo 15 queda cerrado por absorciÃ³n
>
> `T-255`..`T-260` quemados. `T-238`+`T-243` â†’ **`T-268`** (la cadena del pixel), `T-246` â†’
> **`T-275`**/**`T-276`** (los muÃ±ecos, la sala), `T-250`+`T-252` â†’ **`T-280`** (el cierre).
> `T-249` sigue siendo tuya: la partida en el telÃ©fono.
>
> ### PrÃ³ximo paso: la rÃ¡faga 1
>
> Nueve tareas en paralelo: `T-261` (la pantalla deja de estar muda), `T-262` (`BR-29`),
> `T-263` (`ADR-09`/`CTR-18`), `T-264` (`CTR-16.10`, los mecanismos), `T-265` (`UX-31`, la
> gramÃ¡tica de los seis niveles), `T-269` (`RES-73`, los recitales), y en el hilo principal
> `T-266` (el solucionador) y `T-268` (la cadena del pixel).
>
> ### ðŸ”´ Lo que espera al usuario
>
> | QuÃ© | Traba |
> |---|---|
> | **Aprobar la paleta de 16 en la hoja 03 del lienzo** | `T-268`, y con ella todo el arte |
> | **Aprobar las dos hojas de contacto** | que el dibujo entre al juego (`D-44`) |
> | **La partida en el telÃ©fono** (ex `T-249`) | que los seis niveles pasen a `listo` y producciÃ³n los sirva |
> | **Los temas enteros**: `npm run generar-fragmentos -- "<carpeta>" --enteros` | que el juego suene (`D-39`) |
> | Si `RES-73` dice que setlist.fm pide clave, sacarla (es gratis) | `T-279` |

> ## ðŸ•¹ CICLO 15 CONSTRUIDO: EL MOTOR DECIDIDO Y TRECE TAREAS CERRADAS (2026-09-22)
>
> **`npm test` 673 en verde Â· `npm run check` 0 errores Â· `npm run build` 152 pÃ¡ginas Â·
> validador `APTA`.** Eran 578 tests al abrir la rÃ¡faga: **entraron 78 pruebas nuevas.**
>
> ~~**Nada estÃ¡ commiteado.**~~ **Corregido el 2026-09-22 al abrir el ciclo 16: ya estaba
> guardado.** El commit `1478ae7` ("Ciclo 15 construido") tiene las ~35 piezas y el Ã¡rbol
> quedÃ³ limpio. Manda el disco.
>
> ### ðŸ”‘ Las dos decisiones del usuario, tomadas
>
> 1. **El motor se queda: `kaplay@3001.0.19`, salida A.** La compuerta `ADR-08.1` fallÃ³ la
>    condiciÃ³n 4 â€”la licencia no es MIT, trae una clÃ¡usula anti-IAâ€” y el usuario eligiÃ³
>    **quedarse y corregir el rÃ³tulo**, que era lo que de verdad estaba mal. La restricciÃ³n
>    prohÃ­be entrenar modelos con el cÃ³digo; no toca lo que hace este sitio.
> 2. **El nombre queda: `Skayboy y Poligirl`.** Confirmado sabiendo que el par cambiÃ³ de
>    fuego/agua a cielo/infierno. `CNT-19` quedÃ³ cerrada.
>
> ### CÃ³mo se trabajÃ³, porque cambia lo que hay que revisar
>
> **Dos sesiones en paralelo sobre el mismo Ã¡rbol**, con reparto acordado por mensaje y sin
> pisarse un archivo. Y un **workflow de 13 agentes** que cerrÃ³ ocho tareas de una pasada.
> Todo lo que sigue estÃ¡ verificado contra el disco, no contra lo que reportÃ³ cada agente.
>
> ### Lo cerrado
>
> | Tarea | QuÃ© quedÃ³ |
> |---|---|
> | `T-226` | La compuerta corrida entera: 4 de 5 condiciones pasan. Resultado en `Docs/SUGERENCIAS/HILO-para-arquitectura-la-compuerta-del-motor-corrida.md` |
> | `T-227` | **`INV-61`** (`RES-70`..`RES-72`). `RES-62.4` refutada, `RES-62.7`/`.8` ampliadas |
> | `T-229` | `UX-27` reescrito. Cierra `FIND-56`, `FIND-68`, `FIND-70` |
> | `T-232`..`T-235` | **`CNT-17`..`CNT-20`** |
> | `T-237` | `public/arte/README.md` con la frontera de `D-41` |
> | `T-239` | La ruta, `copy.ts`, y el cuarto modo `tema-fijo` en el censo |
> | `T-240` | **El marco impreso.** Medido en el navegador: ancho 720 exacto, Ã¡rea 480Ã—288, alto 324, teclas 52Ã—64 y 112Ã—244. ClavÃ³ `UX-28 Â§2` |
> | `T-241` | **Los auditores dejaron de estar ciegos.** Lista blanca `PAQUETES_DE_CLIENTE` y los dos escÃ¡neres de estÃ©tica **barriendo del disco**, no una lista a mano |
> | `T-242`/`T-251`/`T-253` | El schema, el dato del nivel 1 en `borrador`, y los casos que un schema no puede: contar molinetes, y el nivel 1 que no se puede perder |
> | `T-244` | El modo `tema-fijo` en `cinta.ts` y `rocola.ts`: no sortea y no autoarranca |
> | `T-245` | Los **tres** efectos sintetizados, cero bytes en `public/` |
> | `T-254` | **`mundo.ts`: la simulaciÃ³n pura, sin motor ni arte.** Y `niveles.test.ts` con la mitad lÃ³gica de `T-248` |
> | `ADR-08` | Reescrito con el rÃ³tulo corregido, la compuerta cerrada, y **`ADR-08.2.1`**, que declara el `AudioContext` del motor como segunda excepciÃ³n de `ADR-07.10` punto 7 |
>
> ### Las guardas nuevas, probadas en rojo a mano
>
> No se le creyÃ³ a ningÃºn agente. Se rompieron y se vieron fallar: **hex, `999px` y
> `border-left`** en la hoja nueva (`estilos.test.ts`), **tiempo y curva sueltos**
> (`movimiento.test.ts`), y **un paquete de npm no declarado** en una isla
> (`islas.test.ts`). Las tres en rojo, las tres restauradas.
>
> ### ðŸ”´ El defecto que encontrÃ³ el ojo, arreglado y con deuda declarada
>
> **A 812 Ã— 375 el mueble se iba 101 px fuera de la pantalla.** Las cuatro teclas de
> direcciÃ³n â€”donde cae el pulgar de la mano que agarraâ€” quedaban invisibles: habÃ­a que
> scrollear para poder correr. La bajada del casete, acostada, se comÃ­a 136 px de los 51
> que hay. **Arreglado**: mueble de y=48 a y=372, `teclasFuera: 0`.
>
> **Pero entraba por tres pÃ­xeles y el aire habÃ­a quedado en cero.** Y a 354 Ãºtiles (375
> menos la barra de gesto, el caso que `UX-28 Â§2` ya citaba) 48 de cabecera + 324 de mueble
> = 372 no entraba: faltaban 18, y ningÃºn margen los resolvÃ­a porque ni la cabecera
> (`--toque-min`) ni el mueble (Ã¡rea + imprenta invariantes) tenÃ­an margen legal para
> achicarse.
>
> **Cerrado por `experiencia` el 2026-09-22 (`UX-28 Â§2.2`, nueva):** ni la cabecera ni el
> mueble se tocan â€” **la escala baja un escalÃ³n entero** cuando el alto no le alcanza a
> Ã—2, el mismo mecanismo que `Â§4` ya usaba en vertical. A Ã—1 el mueble mide 180: 48 +
> 180 = 228, y sobran 126 contra el peor caso. El umbral queda en `min-height: 330px` a
> `max-height: 400px` para Ã—1, y `min-height: 401px` a `max-height: 500px` para el Ã—2 con
> los remiendos que ya existÃ­an. **Falta implementarlo en `skayboy.css`**: mover el piso de
> la regla que fuerza `--escala: 2`, sumar la franja `330â€“400` en `--escala: 1`, y correr
> `min-height: 401px` en la franja que ya esconde la bajada. NingÃºn hex nuevo, tres
> selectores tocados. El detalle completo, con la tabla de umbrales y por quÃ© se
> descartaron las otras dos salidas del traspaso, estÃ¡ en `UX-28 Â§2.2`.
>
> ### La verificaciÃ³n adversarial, y los dos `ALTA` que encontrÃ³
>
> Cuatro lentes independientes â€”contratos, guardas, estÃ©tica, completitudâ€” revisaron lo
> construido **sin haberlo armado**. Dos hallazgos graves, y el primero lo vieron las cuatro
> por separado, que es lo que lo hace indiscutible:
>
> - **ðŸ”´ `ALTA` â€” el rÃ³tulo de carga se pinta ADENTRO del Ã¡rea de juego.** `.rotulo-carga`
>   vive en `.recorte`, el mismo contenedor que el `<canvas>`, con `inset: 0`. Y `UX-27 Â§5.1`
>   no admite excepciÃ³n: *"Adentro del Ã¡rea no hay texto. Ninguno. Ni rÃ³tulos"*; `ADR-08.2`
>   punto 4 lo repite. **Es un defecto del hilo principal** â€”se escribiÃ³ en `T-239` y `T-240`
>   lo conservÃ³â€”, y **quedÃ³ abierto a propÃ³sito**: lo toma `T-247` junto con la isla, porque
>   toca los mismos dos archivos y el rÃ³tulo hay que sacarlo igual cuando el motor dibuje.
>   Ojo al moverlo: la pantalla horizontal entra por tres pÃ­xeles.
> - **ðŸ”´ `ALTA` â€” `tema-fijo` no leÃ­a el tema del dato.** `rocola.ts` lo tenÃ­a escrito en una
>   constante mientras `skayboy.json` decÃ­a `temaFijo: null`, contra `ADR-08.9`, que manda
>   que el tema lo declare el dato. **Arreglado a medias y con la atadura puesta**: el dato ya
>   trae `nam-fri-frufi-fali-fru`, y una prueba nueva en `rocola.test.ts` **rompe el build si
>   el dato y el cÃ³digo nombran temas distintos** (probada en rojo). El arreglo de fondo â€”que
>   la pÃ¡gina siembre el tema y `rocola.ts` deje de conocer a un juego por su nombreâ€” entra
>   con `T-247`.
>
> ### Lo que la verificaciÃ³n dejÃ³ abierto, con dueÃ±o
>
> | Gravedad | QuÃ© | DÃ³nde |
> |---|---|---|
> | `MEDIA` | `cinta.ts:231` solo pinta el renglÃ³n de quÃ© suena si el modo es `rocola`, y `ADR-08.9` promete "mismo rÃ³tulo de `UX-26`" tambiÃ©n para `tema-fijo` | `T-247` |
> | `MEDIA` | **El reparto de `devuelve` estÃ¡ invertido** entre el ejemplo de `CTR-16.4` y el dato real. Dos lentes lo vieron. Manda `UX-30` | `arquitectura` |
> | `MEDIA` | `T-253` es condicional â€”"si `arquitectura` prefiere que no exista, se cancela"â€” y **ningÃºn documento registra esa aceptaciÃ³n**. El test existe igual | `arquitectura` |
> | `BAJA` | `mecanismo.abre` acepta `^PUE-\d{2}$` y no hay ninguna puerta con ese `id`: las puertas son los caracteres `A`/`B` de la grilla | `arquitectura` |
>
> Y lo que **no** encontrÃ³, que tambiÃ©n es resultado: **cero tics de estÃ©tica genÃ©rica de IA,
> cero hex fuera de `tokens.css`, cero anglicismos, cero infinitivos en botÃ³n, cero
> suspensivos en rÃ³tulo.** La lente de estÃ©tica pasÃ³ limpia.
>
> ### `T-247` cerrada: **el juego se juega**
>
> La isla existe y el nivel 1 se pasa de punta a punta, verificado en el navegador a
> 812 Ã— 375: dos personajes, tesoros, las dos puertas, y **uno solo en su puerta no gana**.
> `partida-skayboy.ts` escucha las seis teclas con `pointerdown`/`pointerup` **y captura**
> â€”contando punteros por tecla, que es lo que hace falta con cuatro dedos encimaâ€”, llama a
> `paso()` una vez por cuadro y dibuja con tinta plana. El motor entra con `import()` y
> **solo si hay nivel sembrado**. `motor.test.ts` suma 16 casos, cada uno probado en rojo.
>
> **Y apareciÃ³ que el `close()` era la mitad del arreglo.** Kaplay hace `suspend()` al
> esconderse la pestaÃ±a y `resume()` al volver, **sobre el contexto ya cerrado**, y cada
> vuelta tira `InvalidStateError`. Se mide en el navegador. El arreglo es `backgroundAudio:
> true` en el init, que saltea esas dos llamadas sin encender nada. EstÃ¡ puesto y exigido por
> test. **`ADR-08.2.1` todavÃ­a no lo dice** â€” es de `arquitectura`.
>
> ### La pantalla muda, arreglada â€” y las dos `MEDIA`, cerradas
>
> **El rÃ³tulo ya no estÃ¡ oculto en horizontal: toma el renglÃ³n de la marca** mientras el
> motor no dibuja, asÃ­ que se lee *"Skayboy y Poligirl / AcÃ¡ va el juego."* sin gastar un
> pÃ­xel de alto. Cuando el motor arranca, la isla lo esconde y la marca vuelve sola. Medido:
> `teclasFuera 0`, `maxBottom 372`. **Es interino**: la decisiÃ³n de fondo sigue siendo de
> `experiencia` (ver el addendum del traspaso).
>
> - **`cinta.ts` ya pinta el renglÃ³n de `UX-26` en `tema-fijo`**, sin la acciÃ³n de poner otro
>   tema â€”`D-39` no sorteaâ€” y escondiÃ©ndose si no hay pieza. Verificado en el navegador: el
>   botÃ³n existe pero sale con `hidden`, y el rÃ³tulo de pieza tambiÃ©n.
> - **El `devuelve` invertido, cerrado por `arquitectura`**: mandan el dato y `UX-30`. QuedÃ³
>   anotado que **en ningÃºn lado del contrato estÃ¡ escrito que `C` sea cielo**: sale solo de
>   las iniciales, que es una convenciÃ³n sin declarar.
> - **`ADR-08.2.1` suma la condiciÃ³n 5, `backgroundAudio: true`.** El `close()` era la mitad:
>   Kaplay hace `suspend()`/`resume()` **sobre el contexto ya cerrado** cada vez que la
>   pestaÃ±a se esconde y vuelve, y tira `InvalidStateError`. Medido en el navegador, no
>   deducido.
>
> ### ðŸ”´ El tema del juego no suena, y no es un defecto de cÃ³digo
>
> `D-39` dice que este juego **suena entero**, y hoy no suena: el pedido de
> `/audio/temas/nam-fri-frufi-fali-fru.mp3` devuelve **404**. La causa no es el cÃ³digo â€”
> **`public/audio/temas/` estÃ¡ vacÃ­a**, y su propio README lo explica: los temas enteros
> *"no salen de este repo y ningÃºn rol los puede producir"*. Los pone el usuario:
>
> ```
> npm run generar-fragmentos -- "<ruta a los discos>" --enteros
> ```
>
> **La degradaciÃ³n es digna y se verificÃ³**: la cama ya estÃ¡ sonando por debajo y el tema se
> cuelga arriba; si no baja, `alRendirseLaRocola()` deja la cama. El rÃ³tulo dice "CINTA
> SONANDO" y **es verdad** â€”suena la camaâ€”, y el renglÃ³n de pieza se esconde en vez de
> nombrar un tema que no estÃ¡. Nada miente. Pero **`D-39` no se cumple hasta que el archivo
> exista**, y son ~3-4 MB que solo el usuario tiene.
>
> ### ðŸ”´ El hallazgo que queda abierto, y es el que mÃ¡s importa
>
> **En lo publicado, en horizontal, la pantalla del juego estÃ¡ muda.** El rÃ³tulo saliÃ³ del
> Ã¡rea â€”mi `ALTA` bien resueltoâ€” pero **afuera no habÃ­a lugar**, asÃ­ que quedÃ³
> `clip-path: inset(50%)`: solo para lector de pantalla. Y como en producciÃ³n el banco sale
> con `"niveles":[]` (correcto, `NIV-01` sigue en `borrador` hasta `T-249`), **el motor nunca
> baja**: el rÃ³tulo no es un cartel de 114 ms, es el estado permanente.
>
> Lo que ve el que entra, medido en `dist/`: **un rectÃ¡ngulo negro de 480 Ã— 288, seis teclas
> que no hacen nada, y ni una palabra.** Eso es un molinete de los que `D-14` nombra.
>
> **No es un defecto de CSS y por eso no lo arreglÃ©:** medido, el gabinete tiene **4 px
> libres** (324 = 296 de Ã¡rea + 24 de chapa del pie). Son **tres reglas que juntas no se
> pueden cumplir** en horizontal â€” `UX-27 Â§5.1` (adentro del Ã¡rea no hay texto), `ADR-08.2`
> (hay un rÃ³tulo y es lo que se mira), `UX-28 Â§2` (el reparto, que no deja un pÃ­xel). Las
> cuatro salidas posibles estÃ¡n escritas en
> `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`, addendum
> del 2026-09-22. **Es de `experiencia`.**
>
> ### Lo demÃ¡s que dejÃ³ `T-247`, sin dueÃ±o todavÃ­a
>
> - **En vertical (375 Ã— 812) las teclas de direcciÃ³n quedan abajo del borde**: se ven los
>   dos bloques de saltar y hay que scrollear para correr. Mismo defecto que ya se arreglÃ³ en
>   horizontal, en la otra orientaciÃ³n.
> - **`UX-28` tiene dos secciones numeradas `Â§2.2`** (`:117` el agarre, `:135` la nueva del
>   alto). Dos ramas con el mismo nÃºmero es cÃ³mo naciÃ³ `FIND-55`.
> - La `Â§2.2` nueva baja a Ã—1 cuando el alto no alcanza, y si se aplica **la lÃ­nea de
>   `CNT-18` "De costado se ve el doble de grande" pasa a mentir** (`UX-28 Â§4` dice que el
>   doble es lo Ãºnico que esa lÃ­nea promete). Arrastra a `contenido`.
>
> ### ðŸ”´ Lo que espera al usuario
>
> | QuÃ© | Traba |
> |---|---|
> | **Commitear las ~35 piezas** | Nada las respalda hoy |
> | **Los 16 `--px-*` en el lienzo** (`T-238`) | `T-243` (auditor de paleta) y `T-246` (los atlas) |
> | **QuiÃ©n dibuja los sprites** | Sigue sin dueÃ±o. La hoja que hay **no es fuente de pÃ­xeles**: se midiÃ³ que no estÃ¡ sobre grilla, se redibuja |
> | **`T-249`**: jugar el nivel 1 en un telÃ©fono | Es la planilla de `BR-25` y **no la puede correr ningÃºn rol ni agente** |
>
> ### PrÃ³ximo paso
>
> **`T-247`, la isla**: llamar a `paso()` una vez por cuadro, dibujar, escuchar las seis
> teclas con `pointerdown`/`pointerup` **con captura** (el repo no tiene ningÃºn control que
> se mantenga apretado todavÃ­a), y el caso de `motor.test.ts` que exige
> `void k.audioCtx.close()`. Con eso el nivel 1 se puede jugar y se abre `T-249`.

> ## ðŸ•¹ CICLO 15 EN EJECUCIÃ“N: LA COMPUERTA SE CORRIÃ“ Y FALLÃ“ POR LA LICENCIA (2026-09-19)
>
> **Se dejÃ³ de planificar y se empezÃ³ a construir.** El plan del ciclo 15 estaba entero en
> papel desde el 16; esta rÃ¡faga ejecutÃ³ **nueve tareas** y dejÃ³ **una decisiÃ³n del usuario
> trabando el motor**. `npm test` cierra en **578 en verde**, `npm run check` en 0 errores y
> `npm run build` en 152 pÃ¡ginas.
>
> ### ðŸ”´ Lo primero, porque bloquea: `T-226` fallÃ³ la condiciÃ³n 4 y hay que decidir
>
> La compuerta de `ADR-08.1` se corriÃ³ entera. **Cuatro condiciones pasan, una falla.**
>
> | # | CondiciÃ³n | Resultado |
> |---|---|---|
> | 1 | Entra en isla de Astro y el sitio construye | âœ… y ademÃ¡s **dibuja en el navegador**, no solo compila |
> | 2 | Sin `eval()` ni `new Function()` | âœ… cero coincidencias en los tres bundles |
> | 3 | Tipos propios, `npm run check` sin tocar `tsconfig` | âœ… 0 errores |
> | 4 | Nada con licencia ajena adentro | ðŸ”´ **falla, y por donde nadie miraba** |
> | 5 | Peso bajo el techo de 90 KB gzip | âœ… **66,8 KB**, pero ver abajo |
>
> **`kaplay@3001.0.19` no es MIT.** Su `LICENSE.md` trae tres restricciones anti-IA
> agregadas, y su `package.json` **declara `"license": "MIT"`** igual â€” el metadato
> contradice al archivo del mismo paquete, asÃ­ que una auditorÃ­a automÃ¡tica no ve nada.
>
> **El matiz que cambia la lectura (`RES-70.3`): el proyecto ya habÃ­a sacado esa clÃ¡usula.**
> El revert a MIT plano es de mayo de 2025, pero ocurriÃ³ en `master` y en la lÃ­nea `4000.x`,
> **no** en la rama 3001.x, que se tagueÃ³ un mes despuÃ©s arrastrando la versiÃ³n vieja. No es
> una postura: es una rama que quedÃ³ atrÃ¡s.
>
> **`RES-62.4` quedÃ³ refutada, y la lecciÃ³n es transferible:** consultÃ³
> `.../kaplay/`**`master`**`/LICENSE`, donde la afirmaciÃ³n *es* cierta. LeyÃ³ bien el archivo
> equivocado. **Una licencia se lee en el tag de la versiÃ³n que se instala, nunca en la
> rama** â€” y el campo `license` del `package.json` no es una fuente.
>
> **Las tres salidas estÃ¡n escritas con su costo** en
> `Docs/SUGERENCIAS/HILO-para-arquitectura-la-compuerta-del-motor-corrida.md` Â§2: **(A)**
> quedarse y corregir el rÃ³tulo, **(B)** caer a LittleJS, **(C)** el alfa, que el propio
> `ADR-08` veta. **Dato para B: LittleJS hoy mide 62 KB gzip, no los ~46 fichados** â€” el
> ahorro de peso que justificaba tenerlo de repuesto ya no existe (menos de 5 KB).
> `BR-15` consecuencia 1 saca esto de la Ã³rbita de `D-14`: **hay que decidirlo antes, y es
> del usuario.** Traba `T-241`, `T-247` y `T-248`.
>
> ### Los tres hallazgos que la compuerta no buscaba y encontrÃ³ igual
>
> - **ðŸ”´ El audio del motor no se apaga por opciÃ³n.** `ADR-08.2` punto 3 dice "apagado" como
>   si hubiera un flag: **ninguna de las 29 opciones del init toca el audio**, y el init hace
>   `a.audio = sa()` incondicionalmente. Verificado en el navegador: aparece un
>   `AudioContext` en estado **`running`**, contra `ADR-07.10` punto 7. **Hay mitigaciÃ³n
>   probada**: `void k.audioCtx.close()` despuÃ©s del init lo deja en `closed` y **el motor
>   sigue dibujando**. Hay que escribirla en el contrato y testearla en `T-247`.
> - **El motor no se tree-shakea.** El humo mÃ­nimo â€”un rectÃ¡nguloâ€” pesa 66,8 KB gzip contra
>   los ~65 del import completo. **La salida que `ADR-08.1` condiciÃ³n 5 dejaba escrita ("se
>   recorta uso de API hasta entrar") no existe**: no hay API que recortar. Margen real
>   contra el techo: **23,2 KB gzip** para isla, lÃ³gica y datos.
> - **`islas.test.ts` se quedÃ³ ciego.** Su comentario afirma que "este proyecto no tiene
>   ningÃºn paquete de npm del lado del cliente", y eso dejÃ³ de ser cierto: con el humo puesto
>   **ninguna prueba dijo una palabra** del `import kaplay`. Lo tapa `T-241`; hasta entonces,
>   cualquier isla puede importar cualquier cosa. Lo que **sÃ­** funcionÃ³ fue el censo: los
>   Ãºnicos dos rojos fueron los de la pÃ¡gina sin declarar.
>
> ### Y un hueco de `ADR-08.10` quedÃ³ medido
>
> **Tiempo hasta jugable: 114 ms** (escritorio, servidor local â€” **no es el nÃºmero del
> telÃ©fono**, es el piso). `D-32` lÃ­mite 3 pide 0 ms, asÃ­ que el rÃ³tulo estÃ¡tico de
> `ADR-08.2` deja de ser precauciÃ³n. **La vara del bundle, rehecha:** el sitio sin el motor
> son **116,3 KB bruto / 50,9 KB gzip** en 27 chunks, no los "113 KB" que circulaban. El
> motor **no se comparte**: vive en un chunk, cargado por una sola pÃ¡gina.
>
> ### Las nueve tareas cerradas
>
> | Tarea | QuÃ© quedÃ³ |
> |---|---|
> | `T-226` | La compuerta corrida entera. Resultado y pedidos a `arquitectura` en el traspaso de `Docs/SUGERENCIAS/` |
> | `T-227` | **`INV-61`** con `RES-70`..`RES-72`. `RES-62.4` marcada refutada en `INV-60`, y `RES-62.7`/`RES-62.8` ampliadas (LittleJS vendoriza Box2D bajo zlib; su peso envejeciÃ³) |
> | `T-229` | `UX-27` reescrito por `experiencia` para una hoja que no estÃ¡ sobre grilla. **Cierra `FIND-56`, `FIND-68` y `FIND-70`** |
> | `T-232`..`T-235` | **`CNT-17`..`CNT-20`** de `contenido`: el pie de homenaje, el texto de la pantalla, el nombre y el tema que suena (`nam-fri-frufi-fali-fru`, de *Gulp!*, verificado en el cancionero) |
> | `T-237` | `public/arte/README.md` con la frontera de `D-41`: quÃ© idioma rige dÃ³nde, y que su "borde tipo tijera" **no viaja** al pixel |
> | `T-239` | **La ruta existe y se ve.** `src/lib/skayboy/copy.ts`, la pÃ¡gina, y el cuarto modo `tema-fijo` en el censo. Verificado en el navegador a 375 px, sin errores de consola |
> | `T-252` | El barrido corrido: 14 lÃ­neas sobreviven y **las 14 son enmiendas o citas histÃ³ricas**, ninguna es regla viva |
>
> **`voz.test.ts` ahora audita `skayboy`**: los textos de `contenido` pasaron las siete
> reglas de verdad, no a ojo. Registrarlo en `MODULOS` fue parte de `T-239` â€” la lecciÃ³n de
> `dos-ejes`, que pasÃ³ un ciclo pareciendo auditado sin estarlo.
>
> ### ðŸ”´ Las cuatro cosas que esperan al usuario
>
> | QuÃ© | Por quÃ© traba |
> |---|---|
> | **La licencia del motor** (A, B o C) | `T-241`, `T-247`, `T-248`. Es lo Ãºnico que impide seguir con el juego |
> | **El nombre**, `Skayboy y Poligirl` | `CNT-19` lo deja pendiente: se eligiÃ³ cuando el par era fuego/agua y hoy es cielo/infierno. `contenido` argumenta que no hace falta cambiarlo â€”promete una dupla, no un elementoâ€” pero la confirmaciÃ³n no estÃ¡ |
> | **Los 16 `--px-*` en el lienzo** (`T-238`) | Traba `T-243` (el auditor de paleta) y `T-246` (los atlas) |
> | **QuiÃ©n dibuja los sprites** | Sigue sin dueÃ±o. Y la hoja que hay **no sirve de fuente de pÃ­xeles**: se redibuja sobre grilla |
>
> ### PrÃ³ximo paso
>
> **Contestar la licencia.** Con eso destrabado, la fila es `T-241` (los auditores, que hoy
> estÃ¡n ciegos), `T-242` + `T-251` + `T-253` (el schema y sus tres casos, los tres en el
> mismo archivo y en fila), `T-240` (el marco impreso) y `T-244`/`T-245` (la cinta y los
> tres efectos). Nada de eso necesita un sprite: el plan se cortÃ³ asÃ­ a propÃ³sito.

> ## ðŸ•¹ CICLO 15 PLANIFICADO Y REVISADO, SIN CONSTRUIR (2026-09-16)
>
> **El usuario trajo la hoja de sprites y pidiÃ³ seguir.** Textual: *"Agregue los sprites
> continua con el siguiente ciclo"*. Lo que hay es **el ciclo entero en papel**: la historia
> promovida, el motor elegido, los contratos, la pantalla, el plan y dos rondas de revisiÃ³n.
> **Cero cÃ³digo.** `npm test` sigue en 578, que son los mismos de antes.
>
> **Plan completo en `Docs/ORQ/ORQ-plan-ciclo-15.md`** â€” `T-226`..`T-253`.
>
> ### Lo que trajo el usuario, medido
>
> `public/arte/skayboy_poligirl.png`: 1299Ã—725, RGBA **con el alfa lleno** (el fondo verde
> azulado es pÃ­xel opaco, no transparencia). Poses por personaje: quieto de frente, de perfil,
> mirando a la derecha, corriendo, saltando, cayendo. MÃ¡s dos cabezas de perfil y una guitarra.
>
> **ðŸ”´ No se puede recortar a mÃ¡quina, y eso es lo mÃ¡s caro que dejÃ³ el ciclo.** Los rÃ³tulos y
> sus flechas puentean los sprites: la banda del personaje masculino sale como **un solo bloque
> de 1072 px**. Enmascarar el crema de las cajas no alcanza â€” las que puentean son las flechas,
> oscuras, dentro del rango de la tinta. Y `arquitectura` midiÃ³ despuÃ©s que **no hay grilla
> latente** (N = 1). Los dos hechos juntos dicen que los sprites de producciÃ³n hay que
> **redibujarlos sobre grilla, no recortarlos**. La hoja sirve de referencia de pose, insignia
> y tono, que es lo valioso â€” no es la fuente de los pÃ­xeles.
>
> **Lo barato es del usuario:** reexportar sin anotaciones, con fondo transparente y sobre
> grilla. Eso tira abajo todo el trabajo de recorte a mano. Conviene pedirlo antes de gastarlo.
>
> TambiÃ©n apareciÃ³ `public/arte/bondiAfinisterreAnimado.mp4` (3,2 MB): es para `IDEA-04`, otro
> juego. No es de este ciclo.
>
> ### Las tres decisiones del usuario, escritas
>
> - **`D-41` â€” pixel adentro, imprenta afuera.** El Ã¡rea de juego es pixel art; el marco, el
>   pie, los rÃ³tulos y los casetes siguen siendo la imprenta de `UX-22`. La metÃ¡fora es la
>   regla: un fichÃ­n son dos cosas pegadas, un tubo de pÃ­xeles adentro de un mueble
>   serigrafiado. La frontera se ve, y los dos idiomas no se mezclan en la misma pieza.
> - **`D-42` â€” enmienda la baranda 2 de `D-38`: los muÃ±ecos tienen cara.** La baranda no era un
>   principio, era **una estimaciÃ³n de riesgo**, y estaba escrita como tal. `RES-64` no se moviÃ³
>   una coma; lo que se moviÃ³ es dÃ³nde estÃ¡ el perjuicio: **el nombre ya estÃ¡ en el tÃ­tulo del
>   juego**, asÃ­ que la cara no agrega identificaciÃ³n que el nombre no haya dado. Ahora el tono
>   es la baranda â€”nunca denigrante, ridiculizante ni sexualizadoâ€” y **el pie de homenaje pasÃ³ a
>   ser obligatorio**.
> - **`D-43` â€” no hay botÃ³n de cambio.** Cada columna de mando maneja siempre al mismo
>   personaje; el que no tiene un dedo encima se queda quieto y a salvo. Con dos personas se
>   usan las dos columnas a la vez; con una, una y despuÃ©s la otra. **Eso es el botÃ³n de cambio,
>   sin botÃ³n y sin nada que aprender** â€” y de paso cumple la consecuencia 3 de `D-40`, que
>   exigÃ­a que el que llega solo no elija un modo. Lo propuso `UX-28` con mejor argumento que la
>   decisiÃ³n original; se enmendÃ³ con nÃºmero porque `D-42` acababa de fijar esa regla.
>
> ### Las cuatro entregas
>
> | Rol | QuÃ© |
> |---|---|
> | `producto` | **`US-09`** en `PRD-skayboy-y-poligirl.md`, nueve criterios Given/When/Then y piso. `BR-23`..`BR-28`. **`IDEA-14` queda marcada como promovida**, no borrada |
> | `arquitectura` | **`ADR-08`: el motor es Kaplay 3001.0.19**, pineado exacto, MIT, cero dependencias â€” **con compuerta**: cinco condiciones que no se pueden verificar desde un documento, cada una con su comando y su consecuencia. Si falla, se cae a LittleJS. MÃ¡s `CTR-15` (atlas), `CTR-16` (niveles) y `CTR-17` (efectos) |
> | `experiencia` | `UX-27` (convenciÃ³n del pixel), `UX-28` (la pantalla y las dos puertas), `UX-29` (el fracaso no es la muerte), `UX-30` (cielo e infierno en la mezcla) |
> | `orquestador` | El plan. **CortÃ³ tres cuartas partes de las tareas para que se construyan sin un solo sprite** â€” ruta, censo, marco, teclas, schema, sonido, auditores. Si el arte no llega, el ciclo entrega igual |
>
> ### ðŸ”‘ El piso del juego no es el cierre del ciclo, y estÃ¡ escrito
>
> **El ciclo 15 cierra con UN nivel jugable, no con los seis de `BR-25`. `US-09` no queda
> cumplida al cerrar.** Lo declarÃ³ `orquestador` en el Â§6 "QuÃ© NO entra" y el revisor lo
> confirmÃ³ como lo que hace que esto sea un ciclo y no un deseo. **No lo aflojes en la
> ejecuciÃ³n.**
>
> ### Dos rondas de revisiÃ³n, y la segunda es la que importa
>
> `REV-14` encontrÃ³ **once hallazgos, cuatro ALTA, todos de coherencia entre roles** â€” cuatro
> roles escribiendo el mismo dÃ­a sin verse. Los peores: **dos geometrÃ­as vigentes para la misma
> pantalla** (416Ã—192 contra 240Ã—144, y los dos escribiendo "32Ã—48" con distinto significado),
> el fracaso sonando en un contrato y mudo en el otro, la puerta del nivel 1, y dos que **ningÃºn
> rol vio**: un schema que nombra terrenos que Ã©l mismo no declara, y dos topes de paleta.
>
> **El desempate lo fijÃ³ el hilo principal antes de mandar a arreglar**, o se arreglaba dos
> veces y distinto: **lo que el jugador ve y oye lo fija `experiencia`; dÃ³nde viven los archivos
> y quÃ© forma tienen lo fija `arquitectura`.** En la geometrÃ­a ganÃ³ la UX y no por jerarquÃ­a: a
> 812Ã—375 menos las dos columnas de mando, el Ã¡rea jugable ronda los 480 px, que es 240 a escala
> 2Ã—. Los 416 nativos no entran.
>
> **Segunda pasada: siete cerrados y verificados en disco, uno cerrado mal, uno a medias, dos
> abiertos, cinco nuevos.** Los nÃºmeros ya no estÃ¡n en disputa: **Ã¡rea 240Ã—144 nativos Â· 15Ã—9
> tiles de 16 Â· celda 16Ã—24 nativos (32Ã—48 CSS a Ã—2) Â· caja 10Ã—20 Â· 16 tintas Â·
> `public/sprites/`**.
>
> ### ðŸ”´ Lo que queda abierto al retomar
>
> | QuÃ© | DueÃ±o |
> |---|---|
> | **`FIND-59` cerrado mal:** la puerta se decidiÃ³ (el nivel 1 tiene **las dos**), pero `ARQ-schema-niveles.md`:279-287 sigue diciendo "sigue abierto, no lo cierro yo", y el plan ya marca `T-231` cerrada. Es el archivo que se lee antes de escribir el primer nivel | `arquitectura`, una tijera |
> | **`FIND-56`:** `UX-27` sigue mandando `public/arte/pixel/` contra `public/sprites/`. Tiene tarea (`T-229`) | `experiencia` |
> | **`FIND-66`:** el plan todavÃ­a le da a `revisor` el archivo de `REV-14`, y `revisor` es read-only | `orquestador`, tres renglones |
> | **`FIND-69`:** el texto que `T-237` va a pegar en `public/arte/README.md` manda la carpeta vieja, y el barrido de `T-252` no mira `Docs/SUGERENCIAS/` | quien ejecute `T-237` |
> | `FIND-68` (alcance de la paleta: "por escena" contra "toda el Ã¡rea") y `FIND-70` (un renglÃ³n sin aclarar nativo/CSS) | `experiencia` |
> | **QuiÃ©n dibuja los niveles y los sprites: sigue sin dueÃ±o.** De los siete roles, ninguno produce arte | usuario / `Docs/EQUIPO.md` |
> | **`BR-28`:** si al cerrar el ciclo 15 `US-02` sigue en 0 de 8 FÃ¡ciles, el ciclo 16 **no abre un noveno juego** hasta que llegue la `YT_API_KEY` o se retire la cuota por escrito | usuario |
>
> ### PrÃ³ximo paso
>
> **`T-226`, la compuerta del motor, y va sola y primera:** instalar Kaplay pineado y probar que
> entra en una isla de Astro con salida estÃ¡tica, contra CSP y contra `npm run check`. Es el
> primer paquete de terceros que va a correr en el telÃ©fono de la gente y cambia tres cosas a la
> vez â€” Ã¡rbol de dependencias, la premisa de `islas.test.ts` y la superficie de una CSP. Si
> falla, se cae a LittleJS y media planificaciÃ³n se reescribe. **Es del hilo principal**, no de
> `revisor`: se corrigiÃ³ en `FIND-61`.

> ## ðŸŽ® SKAYBOY Y POLIGIRL â€” IDEA GUARDADA Y RELEVADA, NADA CONSTRUIDO (2026-09-11)
>
> **RÃ¡faga aparte de la del ciclo 14**, sobre el mismo Ã¡rbol. El usuario pidiÃ³: *"Agrega a
> ideas y comencemos a desarrollar un juego que sea como un fireboy y watergirl que se llame
> skayboy y poligirl. Comenza la investigacion para construir el juego."*
>
> **No se tocÃ³ una sola lÃ­nea de `src/`.** Lo que hay es documentaciÃ³n: la idea guardada, el
> relevamiento, dos decisiones del usuario y dos traspasos. `IDEA-14` **no estÃ¡ promovida**
> (`BR-16`), asÃ­ que no traza `T-XX` y no hay nada que construir todavÃ­a.
>
> ### Lo que quedÃ³ en disco
>
> | Archivo | QuÃ© es |
> |---|---|
> | `Docs/PRODUCTO/PRD-backlog-ideas.md` | **`IDEA-14`**, escrita por `producto`. Fila en el Resumen, pregunta abierta 4, encabezado y PENDIENTE al dÃ­a |
> | `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md` | El relevamiento: **`RES-60`..`RES-65`** mÃ¡s tres mediciones sobre el repo (el ancla ricotera, los choques, el costo de la pieza). 763 lÃ­neas |
> | `Docs/DECISIONES.md` | **`D-38`** (se pueden dibujar dos personas vivas, con tres barandas), **`D-39`** (este juego suena entero) y **`D-40`** (un acompaÃ±ante tambiÃ©n es un molinete: se puede jugar solo) |
> | `public/arte/ensayo/` | **El ensayo dibujado**: `ensayo-pantalla.svg` a 812Ã—375, `skayboy.svg`, `poligirl.svg`, la lÃ¡mina `index.html` y su `README.md`. Vive en `public/` y **no en `src/pages/`** a propÃ³sito: una ruta nueva entra al censo de `rutas-sonoras.ts`, y cuando se dibujÃ³ ese cÃ³digo todavÃ­a estaba sin commitear |
> | `Docs/SUGERENCIAS/HILO-para-experiencia-skayboy-y-poligirl.md` | Lo que quedÃ³ con nombre de `experiencia` |
> | `Docs/SUGERENCIAS/HILO-para-arquitectura-el-motor-y-el-sonido-del-juego.md` | Lo que quedÃ³ con nombre de `arquitectura` |
> | `Docs/IDS.md` | La fila de reserva: `IDEA-14`, `RES-60`..`RES-69`, `D-38`, `D-39` |
>
> ### CÃ³mo se relevÃ³, porque el mÃ©todo importa mÃ¡s que el resultado
>
> Nueve frentes en paralelo â€”cinco a la web por el rol `investigador`, cuatro midiendo sobre
> el repoâ€”, y **cada uno pasÃ³ despuÃ©s por refutaciÃ³n adversarial**: los cuatro caros, por dos
> refutadores independientes que fueron a la fuente primaria a voltear lo que la ficha
> afirmaba. Tres hallazgos cambiaron de signo hacia arriba y dos hacia abajo. **Lo que se
> cayÃ³ quedÃ³ escrito con el estado corregido**, que es lo que hace Ãºtil al archivo.
>
> Se cayeron, entre otras cosas: tres conteos del cancionero inflados hasta siete veces
> (`\bmar\b` en JavaScript matchea "MarÃ­a", porque la Ã­ no es carÃ¡cter de palabra), la
> co-titularidad de Erks S.A. â€”de verificado a **reportado**, fuente Ãºnica replicadaâ€” y el
> cÃ¡lculo que cerraba la puerta al control simultÃ¡neo, que solo valÃ­a en vertical.
>
> ### Las cinco respuestas del usuario, que cierran el diseÃ±o grueso
>
> 1. **El par es cielo / infierno**, no fuego / agua. `agua` aparece **una vez** en los 2913
>    versos del cancionero; cielo/infierno tiene dos tÃ­tulos propios y arriba/abajo es la
>    geometrÃ­a nativa de un plataformas. **Consecuencia: el nombre deja de calcar el par del
>    juego de origen** y hay que poder explicarlo. Es de `contenido`.
> 2. **Se juega de a dos, en un telÃ©fono en horizontal.** Contra la recomendaciÃ³n del
>    relevamiento (un pulgar alternando, que es como lo resuelve la versiÃ³n mÃ³vil oficial del
>    juego de origen). No toca "sin backend": son dos personas en un aparato.
> 3. **`D-38`**: se autoriza el nombre y la caricatura. Nace porque `D-14` **no alcanzaba** â€”
>    el "si llega un reclamo se baja" estÃ¡ calibrado para el titular de una obra, y a alguien
>    que se sintiÃ³ mal representado bajar el sitio no le devuelve nada.
> 4. **`D-39`**: suena entero. Es la **primera excepciÃ³n a `D-37`**, escrita el mismo dÃ­a.
> 5. **`D-40`**: ademÃ¡s hay camino para uno solo, con botÃ³n de cambio de personaje. Lo levantÃ³
>    `producto` y es la mejor objeciÃ³n de toda la rÃ¡faga: **si el juego pide una segunda
>    persona, el que llega solo por un enlace no juega**, y eso tiene la forma de un molinete
>    aunque `D-14` no nombre a un acompaÃ±ante. Cuesta caro: cada nivel tiene que ser resoluble
>    de las dos maneras, asÃ­ que queda **prohibido por construcciÃ³n** el puzzle que exige
>    simultaneidad sin segunda soluciÃ³n.
>
> ### ðŸ”´ La deuda que abriÃ³ `D-39`, con nombre
>
> **`dos-ejes` pidiÃ³ esa misma excepciÃ³n con ese mismo argumento** â€”"no tiene respuesta
> correcta, no hay nada que soplar"â€” y `D-37` se la negÃ³ por escrito, en su propia tabla. Hoy
> hay dos pantallas con el mismo fundamento y distinta respuesta. O el criterio se vuelve a
> escribir diciendo quÃ© las separa, o el noveno juego llega con la discusiÃ³n que `D-37`
> existe para cerrar. EstÃ¡ anotada en las consecuencias de `D-39`.
>
> ### Lo que bloquea de verdad, y no es el motor
>
> El motor dejÃ³ de ser bloqueo: `RES-62` trae **ocho licencias leÃ­das en el archivo `LICENSE`
> crudo** â€”Kaplay (MIT, ~65 KB), LittleJS (MIT, ~46 KB), Phaser pineado a 3.90.0â€” y sirve
> igual a `IDEA-02`, `IDEA-03`, `IDEA-04` y `IDEA-07`. Falta **nombrar** un candidato, no
> fichar otro. Y Tiled saliÃ³ de la lista negra: un mapa no hereda la GPL del editor.
>
> Lo que sÃ­ bloquea:
>
> - **El arte, y es un choque escrito contra otro escrito.** `public/arte/README.md` manda
>   *"PNG con fondo transparente, borde tipo tijera â€” nunca vector liso"*, y un sprite legible
>   a 32 px pide lo contrario. Las 13 piezas que hay hoy son recortes de collage: **cero
>   sprites**. Peor: **de los siete roles, ninguno es dueÃ±o del diseÃ±o de niveles ni de la
>   producciÃ³n de sprites.**
> - ~~**La pregunta abierta 4 del PRD**: si el juego pide una segunda persona, el que llega
>   solo no juega.~~ **CONTESTADA el mismo dÃ­a, `D-40`:** hay camino para uno solo. Lo que
>   deja abierto es el costo â€” cada nivel resoluble de las dos maneras.
> - **El riesgo 4 del brief estÃ¡ corriendo:** `US-02` sigue con **0 de 8 Ã­tems FÃ¡ciles**
>   (falta la `YT_API_KEY`, `BR-18` apartado g). Este serÃ­a el juego nÃºmero ocho.
>
> ### âœ… El ensayo se hizo, y dejÃ³ tres hallazgos
>
> El usuario pidiÃ³ hacerlo en la misma rÃ¡faga. EstÃ¡ en `public/arte/ensayo/`, se mira en
> `/arte/ensayo/index.html` con el sitio andando, y **no promueve `IDEA-14`**: no hay pÃ¡gina
> del sitio, ni isla, ni copy, ni motor, ni fÃ­sica.
>
> **Lo que contestÃ³, que era la Ãºnica pregunta:** sÃ­, un sprite se puede dibujar en el idioma
> del sitio sin caer en el vector liso que veta `public/arte/README.md`. El mecanismo es que
> el borde no sea una curva limpia â€” `feTurbulence` + `feDisplacementMap` desplazan el
> contorno, que es como se rompe un papel recortado a mano.
>
> **Los tres hallazgos:**
>
> 1. **`sharp` no puede rasterizar esto.** Medido: librsvg **no implementa
>    `feDisplacementMap`** y devolviÃ³ la silueta plana, sin borde, con el grano vuelto un
>    rectÃ¡ngulo gris. Los PNG se borraron. El sprite que llegue al telÃ©fono va rasterizado
>    igual, pero **ese paso necesita un motor con filtros SVG** â€” un navegador, o la
>    herramienta del usuario, como los recortes de audio de `D-06`. Hoy el repo no tiene con
>    quÃ© hacerlo desatendido.
> 2. **Sobre el piso claro la figura casi desaparece.** La tinta marfil estÃ¡ calibrada para
>    `--fondo`, que es tinta oscura; el cielo es papel claro. No lo caza `contraste.test.ts`,
>    que mide pares declarados en CSS y acÃ¡ el fondo es una superficie dibujada. O las figuras
>    llevan contorno, o los dos terrenos no pueden ser los dos claros.
> 3. **A 48 px las dos se leen, pero no igual de bien.** El sombrero y la SG le dan a Skayboy
>    una silueta reconocible en miniatura; la mata de pelo de Poligirl se empasta y la salva
>    el oro del llavero. Si la paridad de `D-38` va en serio, eso se corrige en el dibujo.
>
> **Y una cosa que es propuesta, no hallazgo:** el llavero de Poligirl **no estÃ¡ fichado**. El
> sombrero y la SG de Skay sÃ­ (`RES-64.3`, `RES-64.5`). Las llaves salen de su rol documentado
> cruzado con el molinete. Ninguna pantalla puede decir *"Poli llevaba llaves porqueâ€¦"*.
> Confirmarlas o cambiarlas es de `experiencia`.
>
> ### PrÃ³ximo paso, si se retoma esto
>
> Mirar el ensayo y decidir. Lo que desbloquea si el dibujo convence no es el motor: es **la
> convenciÃ³n de sprites en `public/arte/README.md`**, que es de `experiencia` y es el bloqueo
> real. DespuÃ©s, nombrar el motor (`RES-62` ya sirve el orden) y reciÃ©n ahÃ­ promover a
> `US-XX` con piso y criterio (`BR-16`).
>
> Lectura de piso, **no compromiso**: seis niveles, 2/2/2. Un nivel no se consume como un
> Ã­tem â€”repetirlo *es* el juegoâ€”, pero `BR-01` exige tres escalones y un escalÃ³n de un nivel
> es un muro.

> ## ðŸŽ› CICLO 14 CONSTRUIDO â€” LA CINTA PONE TEMAS (2026-09-11)
>
> **`T-212`..`T-225` cerradas.** `npm test` **574/574** (eran 526), `npm run check` 0 errores,
> `npm run build` 151 pÃ¡ginas, validador `APTA`. Verificado en el navegador a 375Ã—812.
>
> ### Lo que hay ahora que no habÃ­a
>
> - **La rocola** (`ADR-07`, `D-37`): prender la cinta en el portal, el cancionero o la
>   Redondopedia pone **un tema de los Redondos al azar**, con filtro de casete propio
>   (cuerpo, brillo y un `DelayNode` modulado que le arrastra la afinaciÃ³n 0,26 %) sobre la
>   cama sintetizada de `ADR-04`, que sigue corriendo abajo. Entre pieza y pieza cae **la
>   pÃºa** (`src/lib/sitio/pua.ts`): golpe, barrido y surco con polvo, sintetizados, cero
>   archivos. Hoy suenan los **95 recortes enteros** â€”los diez segundos completos, no la
>   escalera de `D-26`â€” porque no hay ni un tema entero en disco; cuando los haya, salen
>   primero y los recortes despuÃ©s.
> - **El mapa de rutas** (`src/lib/sitio/rutas-sonoras.ts`): lista blanca con censo. Cinco
>   rutas ponen temas, ocho quedan en cama (el quiz y los siete juegos), cuatro mudas del
>   todo (los tres graves y `/diagnostico-audio/`). **Un juego nuevo nace mudo**, y una
>   pÃ¡gina que nadie clasificÃ³ **rompe el build**.
> - **El pie corto**: *"Sitio hecho por ricoteros, para ricoteros."* â€” 42 caracteres contra
>   379. Lo demÃ¡s se mudÃ³ a un `<details>` nativo, sin JavaScript.
>
> ### Lo medido, antes y despuÃ©s, a 375Ã—812
>
> | QuÃ© | Antes | Ahora |
> |---|---|---|
> | Portal | 2396 px (2,95 pantallas) | **2021 px (2,49)** |
> | Portada de "adivinÃ¡ el tema" | 1591 px (1,96) | **883 px (1,09)** |
> | Los once pozos | 693 px | **111 px** |
> | Pie de imprenta | 227 px | **179 px** |
> | Texto del pie | 379 caracteres | **42** |
>
> ### âœ… `REV-13` cerrÃ³ la revisiÃ³n, y corrigiÃ³ dos cosas mÃ­as
>
> `revisor` mirÃ³ con contexto fresco (`Docs/REVISIONES/REV-13-ciclo-14.md`). **El riesgo
> nÃºmero uno quedÃ³ sin hallazgos**: verificÃ³ el mapa ruta por ruta contra el cÃ³digo, probÃ³ el
> censo creando y borrando una pÃ¡gina, y confirmÃ³ que los dos candados de la ruta son reales
> y ninguno es decorativo. TambiÃ©n que los tres casos de `cinta.test.ts` (691/717/932) estÃ¡n
> intactos byte por byte y que `D-21` se sigue cumpliendo sin JavaScript.
>
> Tres hallazgos, dos corregidos el mismo dÃ­a:
>
> - **`FIND-52` (corregido).** Al portal le faltaban **cuatro de las cinco medidas de
>   `UX-25`**: yo habÃ­a sacado la tapa chica y cortado la bajada, pero no toquÃ© una sola regla
>   `.casete*` de `sitio.css`. Aplicadas: `padding` 16â†’12, tÃ­tulo 1,05â†’0,95rem, bajada
>   0,85/1,35â†’0,8/1,3, y el sello bajando adentro de `.casete-etiqueta` en vez de ocupar una
>   fila entera del grid. **Casete de 198 a 174 px; portal de 2021 a 1751 (2,16 pantallas).**
> - **`FIND-54` (corregido a medias, a propÃ³sito).** Los casos **17 y 19** de los veinte de
>   `ADR-07` no tenÃ­an prueba. Ya la tienen (`rocola.test.ts`, 20/20). La otra mitad â€”que
>   `ADR-07.8` describe un mecanismo que el cÃ³digo no tiene, aunque el comportamiento sea el
>   correctoâ€” quedÃ³ como propuesta para `arquitectura`: **no reescribÃ­ la funciÃ³n que decide
>   si el reveal de `US-02` se oye limpio para que calce con un pÃ¡rrafo.**
> - **`FIND-53` (no es mÃ­o).** `UX-25` Â§5 pide un pie de â‰¤120 px, y
>   `--alto-pie-imprenta: clamp(8.5rem, 22vh, 13rem)` tiene **piso de 136**. El techo era
>   imposible sea cual sea el texto. Es de `experiencia`.
>
> Al cerrar: `npm test` **576/576**, `check` 0 errores, `build` 151 pÃ¡ginas.
>
> ### âš  Lo que quedÃ³ corto contra el presupuesto, y por quÃ©
>
> **Son desvÃ­os reales, no redondeos.** El que retome tiene que saberlos:
>
> 1. **El pie mide 179 px, no los â‰¤120 de `UX-25` Â§5.** `REV-13`/`FIND-53` lo cerrÃ³: el techo
>    era **imposible**, porque `--alto-pie-imprenta` tiene piso de 136 px. El texto sÃ­ hizo lo
>    suyo, de 379 a 42 caracteres. Defecto del presupuesto, no del pie.
> 2. **El casete quedÃ³ en 174 px, no en los 136 de `UX-25` Â§2.5** â€” despuÃ©s de corregir
>    `FIND-52`. Lo que no baja es el tÃ­tulo en letra de display, y eso es tipografÃ­a de marca.
> 3. **El portal quedÃ³ en 1751 px (2,16 pantallas), no en las 1,83** de `UX-25` Â§1. BajÃ³
>    **645 px**, casi una pantalla entera.
>
> ### Dos defectos encontrados construyendo, que ninguna hoja preveÃ­a
>
> - **`.gitignore` tiraba los temas enteros al vacÃ­o.** Ignoraba `*.mp3` con una sola
>   excepciÃ³n, `fragmentos/`. Correr `--enteros` los dejaba en disco, a la vista, y **no
>   llegaba ni uno a producciÃ³n**, sin error y sin aviso. Esperaba desde que se tomÃ³ `D-22`.
> - **La flecha entre los dos motores de audio se cruzÃ³**, y el test que `ADR-04` habÃ­a
>   dejado puesto lo cazÃ³. La salida no fue aflojar el candado: las dos rutas de audio
>   bajaron a `src/lib/audio/rutas-de-audio.ts`, una hoja que no importa nada.
>
> ### Lo que sigue sin estar, y no es un olvido
>
> **No hay un solo tema entero en `public/audio/temas/`.** El mecanismo estÃ¡ y la puerta
> quedÃ³ abierta; los archivos salen de tus discos, igual que los recortes (`D-23`):
> `npm run generar-fragmentos -- "<carpeta>" --enteros`. El README de esa carpeta lo explica.
>
> Rangos consumidos: `T-212`..`T-225`, `D-37`, `ADR-07`, `CTR-14`, `UX-24`..`UX-26`, `CNT-16`,
> `REV-13`. Pedidas a `investigador` y sin responder: `RES-56`, `RES-57`, `RES-58` â€” ninguna
> frena nada, las tres tienen repuesto declarado en `ADR-07`.

> ## ðŸ“‹ EL PLAN DEL CICLO 14, COMO SE ESCRIBIÃ“ (2026-09-10)
>
> **Plan completo en `Docs/ORQ/ORQ-plan-ciclo-14.md`.** Catorce tareas, `T-212`..`T-225`,
> cortadas en tres rÃ¡fagas. Nada construido todavÃ­a: esto es el plan, no el resultado.
>
> **Lo pidiÃ³ el usuario en una rÃ¡faga**, y son dos frentes que no se parecen: pulir la UX
> del portal y de "adivinÃ¡ el tema" hasta dejarla para producciÃ³n (sin scroll para ver los
> temas, sin espacio muerto, con el pie achicado a *"sitio hecho por ricoteros para
> ricoteros"*), y **convertir la cinta en una rocola** que ponga un tema de los Redondos al
> azar con filtro vintage, caiga a los recortes enteros cuando no haya temas, y meta un
> ruido de cambio de disco entre uno y otro.
>
> ### Lo que se midiÃ³ antes de planificar (2026-09-10, `npm run dev`, 375Ã—812)
>
> | QuÃ© | DÃ³nde | CuÃ¡nto |
> |---|---|---|
> | El portal mide casi tres pantallas | `/` | **2396 px** = 2,95 pantallas, 8 casetes de ~210 px |
> | El pie se come un cuarto de la ventana | `.pie-imprenta` | **227 px** y **379 caracteres** |
> | La portada del juego no entra | `/juegos/adivinar-el-tema/` | **1591 px** = 1,96 pantallas; 693 px son los 11 pozos |
> | Durante la partida, el bloque mÃ¡s grande no juega | `#partida` | la partida entra justa, pero **208 px (25,6 %)** son pie |
> | La lista de temas nace con scroll adentro | `.sugerencias` | `scrollHeight` **318 px** en una caja de **240**: entran 4,5 de 6 |
> | La revelaciÃ³n desborda | al cerrar un tema | **622 px** llevan el documento a **1169** = 1,44 pantallas |
> | No hay un solo tema entero | `public/audio/temas/` | la carpeta no existe; `"entero": true` aparece **0 veces** |
>
> ### Las tres cosas que hay que decidir antes de construir
>
> 1. **La rocola afloja dos de los cinco candados de `ADR-04`**: el 2 ("cero archivos") cae
>    entero, y el 4 ("no lleva informaciÃ³n") tambiÃ©n. `D-14` y `D-22` lo cubren, pero el
>    argumento de que la cinta era una pieza intocable **se termina acÃ¡**, y queda escrito.
> 2. **Los recortes SON la respuesta de `US-02`.** Una rocola que suene en
>    `/juegos/adivinar-el-tema/` le sopla la respuesta al que estÃ¡ jugando; el tema entero
>    hace lo mismo en `completar-la-letra` y en `adivinar-por-la-letra`. **El mapa de rutas
>    mudas es parte de la decisiÃ³n, no del cÃ³digo**, y es el riesgo nÃºmero uno del ciclo.
> 3. **El pie corto choca con `D-21` condiciÃ³n 1** (la pantalla nombra quÃ© tapas usÃ³). La
>    lÃ­nea corta se hace igual; lo que decide `CNT-16` es **a dÃ³nde se muda el crÃ©dito**, no
>    si se borra.
>
> ### La trampa que ya estÃ¡ en el repo, para el que construya
>
> `cinta.ts` barre los `<audio>` del documento para callarse cuando algo suena (`ADR-04.3`,
> fijado en `cinta.test.ts:691`, `:717` y `:932`). **Una rocola que ponga temas por un
> `<audio>` se calla a sÃ­ misma en el primer segundo.** Y `tema/audio.ts` decodifica a
> `AudioBuffer`: un tema de cuatro minutos asÃ­ son decenas de MB de RAM en un telÃ©fono. La
> rocola transmite, no decodifica.
>
> ### Lo que NO entra, y conviene saberlo antes de empezar
>
> **Los temas enteros mismos.** Entra el mecanismo (`T-219` abre la puerta con `--enteros`),
> pero los archivos salen de los discos que tenÃ©s en la mÃ¡quina, igual que los recortes
> (`D-23`). Hasta que los cargues, la rocola pone **recortes enteros** â€” que es la caÃ­da que
> el propio pedido nombra.
>
> Rangos consumidos por el plan: `T-212`..`T-225`. Reservados: `D-37`, `ADR-07`,
> `UX-24`..`UX-26`, `CNT-16`, `REV-13`.
>
> ### `T-215` (`UX-25`) entregado â€” `experiencia`, 2026-09-11
>
> `Docs/UX/UX-25-el-portal-mas-corto.md`. Presupuesto de pÃ­xeles por bloque para el
> portal: de 2396 px a **~1486 px (1,83 pantallas)**, con los ocho casetes puestos. La
> pieza que mÃ¡s pesa: el casete baja de ~210-252 px a **136 px**, sacÃ¡ndole la tapa
> chica (real, `D-21`/`UX-05` â€” decisiÃ³n propia, `D-21` lo permite pero no lo exige, y
> el casete ya dice de quÃ© disco es con el color) y mostrando **solo la primera oraciÃ³n**
> de la bajada de cada casete (corte por template en el punto que el texto ya tiene, sin
> `line-clamp` ni "â€¦" â€” `voz-ricotera.md Â§3.7` reserva el suspensivo para la Redondopedia).
> Corrida la prueba de las dos lÃ­neas en los ocho casetes: los ocho pasan tapando la
> bajada. Efecto colateral para otra tarea: sin la tapa chica, `tapasUsadas` en
> `index.astro` pasa de acreditar ocho o nueve discos a acreditar uno solo
> (`oktubre-banderas`), lo que achica el crÃ©dito del pie de arriba â€” anotado para
> `T-224`, no construido acÃ¡. **Asume pie â‰¤ 120 px** (el propio techo de `T-220`, no
> uno nuevo); si `CNT-16` entrega mÃ¡s largo, el presupuesto no cierra. No toca el umbral
> ni el trÃ¡nsito. No contradice `UX-10` (el corte de 46rem no se toca). Pendiente:
> `UX-05` va a quedar desactualizado en la fila de casetes del portal â€” no se corrige acÃ¡
> (una sola hoja por tarea), queda para quien retome esa ficha.
>
> ### `T-214` (`UX-24`) entregado â€” `experiencia`, 2026-09-11
>
> `Docs/UX/UX-24-la-portada-en-una-pantalla.md`. Presupuesto de pÃ­xeles para las tres
> pantallas de "adivinÃ¡ el tema": portada, partida y revelaciÃ³n.
>
> - **Portada:** de 1591 px (1,96 pantallas) a **â‰¤ 812 px**. La pieza que lo permite: los
>   11 pozos dejan de ser una lista vertical de 693 px y pasan a ser **"Todos los discos"
>   solo y preseleccionado + un `<details>`/`<summary>` plegado** con los otros diez en
>   grilla de 2 columnas â€” 119 px en vez de 693. El resto de la portada (`h1`, bajada,
>   aviso de sonido, arranque) queda igual; lo Ãºnico que se achica son los mÃ¡rgenes de la
>   cabecera y la marca. Pide al pie â‰¤ 205 px â€” el de hoy (208) casi alcanza solo, y con
>   el de `CNT-16` (< 120) sobran ~85 px de margen.
> - **Sugerencias sin scroll:** se queda en 6 Ã­tems (no baja a 5); sube `.sugerencias` de
>   15rem a 21rem y trunca tÃ­tulo/disco a una lÃ­nea para que el alto de cada Ã­tem sea fijo
>   (~56 px) y 6 Ã— 56 = 336 entre debajo del nuevo tope. Con el teclado abierto el cÃ¡lculo
>   da 447-527 px libres arriba de la caja de texto contra 336 que hacen falta â€” sin
>   aparato real para confirmarlo (`D-12`), comando dejado para `revisor`.
> - **RevelaciÃ³n:** no toca el mecanismo de `UX-22 Â§1.4` (`scrollIntoView({block:'end'})`,
>   ya construido). Solo mide: 622 px hoy, ~722 con el reproductor de tema entero que
>   todavÃ­a no existe, ~780-812 en el peor caso (tÃ­tulo de disco largo a dos lÃ­neas) â€”
>   siempre â‰¤ 812, asÃ­ que el panel entero sigue entrando sin scroll por construcciÃ³n.
> - **Pie durante la partida:** decisiÃ³n de no tocar nada. `D-35` ya hace que un pie mÃ¡s
>   chico achique el documento en vez de dejar un hueco â€” no hace falta que el tablero
>   crezca para "llenar" lo que el pie deja libre.
> - Bloqueos: el texto exacto del `<summary>` y la bajada acortada a dos lÃ­neas quedan
>   para quien construya `T-221`, con `voz-ricotera.md` como vara.
>
> ### `T-216` (`UX-26`) entregado â€” `experiencia`, 2026-09-11
>
> `Docs/UX/UX-26-la-rocola.md`. Consume `ADR-07` (entregado en la misma rÃ¡faga por
> `arquitectura`) y resuelve lo que le dejÃ³ pendiente: quÃ© se ve cuando la rocola pone un
> tema (candado 4 de `ADR-04` caÃ­do), el crÃ©dito de lo que suena, el control de "ponÃ©
> otro", los cuatro estados de `UX-21` revisados y el hueco del primer arranque.
>
> - **Se ve el tÃ­tulo del tema + si es recorte o completo. Nunca el disco.** El riesgo que
>   `ADR-07` dejÃ³ explÃ­cito para acÃ¡ â€”leer un tÃ­tulo en el portal y que sea la respuesta de
>   un juego treinta segundos despuÃ©sâ€” se resuelve con un cÃ¡lculo, no con prudencia
>   genÃ©rica: nombrar el disco filtrarÃ­a sobre solo **10 discos** (`tapa.json`, contados a
>   mano), casi diez veces mÃ¡s especÃ­fico que nombrar el tema sobre **95 recortes**
>   (`adivinar-tema.json`). Por eso el disco no se nombra nunca y el tema sÃ­.
> - **El crÃ©dito no necesita mecanismo nuevo.** `D-21` es de tapas (imÃ¡genes con problema
>   de ediciÃ³n); la mÃºsica ya la acredita `PORTAL.pie` de forma incondicional en toda
>   pantalla (`PieImprenta.astro:104`). Ãšnico pedido a `contenido`: que `CNT-16` no le saque
>   esa frase al pie al reescribirlo.
> - **El control de "ponÃ© otro" existe, en dos formas:** `PONÃ‰ UN TEMA` (sube de cama a
>   rocola sin apagar nada â€” resuelve el caso de `ADR-07.8` en que `rearmarCinta()` arma
>   siempre en cama) y `PONÃ‰ OTRO TEMA` (`proximaPieza()`, solo con una pieza sonando de
>   verdad). Viven debajo de la cabecera, nunca compiten por su renglÃ³n.
> - **El hueco del primer arranque no lleva indicador de carga** (serÃ­a "cargando", vetado
>   por `voz.test.ts`, o un Ã­cono vetado por `diseno-marca.md`): la cama+pÃºa ya suenan de
>   verdad durante la espera, y la lÃ­nea del tema aparece reciÃ©n cuando hay algo cierto que
>   mostrar. Si falla tres veces seguidas, cae a `cama` sola, sin ningÃºn aviso de error.
> - Las tres cadenas nuevas (`ponerTema`, `otroTema`, la funciÃ³n `suena`) verificadas a
>   mano contra las siete reglas de `voz.test.ts`.
> - **Bloqueo dejado en `Docs/SUGERENCIAS/UX-para-arquitectura-cambio-de-pieza.md`:**
>   `alCambiarLaCinta()` no dispara cuando la rocola pasa de un tema a otro sin salir de
>   `sonando` (la guarda `if (estado === nuevo) return`), asÃ­ que la isla no tiene forma de
>   saber que tiene que repintar el tÃ­tulo â€” hace falta un aviso nuevo en el contrato de
>   `cinta.ts`/`rocola.ts`, y no es decisiÃ³n de pantalla.

> ## âœ… `US-08` â€” "Ponelos en fila": el sÃ©ptimo juego, construido y andando (2026-09-03)
>
> **Lo pidiÃ³ el usuario directo, en una rÃ¡faga**, con estas palabras: *"Arma completamente
> el juego de armar tierlist y poder compartirlas. Tierlists de temas, temas por album,
> albumes y otros mas que se te ocurran, investiga como funcionan en la web y como armar el
> tipico, no reinventes la rueda."* Se investigÃ³ primero â€”el formato canÃ³nico, el arrastre
> en tÃ¡ctil, cÃ³mo se comparte, quÃ© rankean los fansâ€” y con eso se decidiÃ³, se documentÃ³ y
> se construyÃ³, todo en la misma sesiÃ³n.
>
> **Estado: jugable de punta a punta, verificado en el navegador a 375Ã—812 y en
> escritorio.** `npm test` en verde, `npm run check` con 0 errores, build de 151 pÃ¡ginas.
>
> **QuÃ© es.** Se elige quÃ© repartir entre **15 conjuntos** â€”los diez discos, las diez
> tapas, los que abren, los que cierran, doce temas sorteados, y el tracklist de cada uno de
> los diez discosâ€” y se reparten las fichas en **cuatro filas que son lugares de un
> recital**: `CONTRA LA VALLA` Â· `EN EL MEDIO` Â· `ATRÃS DE TODO` Â· `EN LA VEREDA`, mÃ¡s la
> bandeja `SIN UBICAR`. Al final se comparte: una **lÃ¡mina PNG** de 1080Ã—1350 (con las tapas
> reales dibujadas cuando el conjunto es de discos) y una **direcciÃ³n** que reconstruye la
> lista exacta.
>
> **Las tres decisiones que lo definen, todas en `D-36`:**
>
> 1. **Las filas no tienen color.** La rampa rojoâ†’verde del formato le dirÃ­a al que jugÃ³ al
>    quiz que la fila de arriba estÃ¡ bien â€” y `--acento-3` y `--acento-4` son acierto y
>    error, reservados. Se distinguen por nombre, posiciÃ³n y contador. Lo audita
>    `estilos.test.ts`.
> 2. **Son lugares, no notas.** S/A/B/C/D/F son notas de boletÃ­n anglosajÃ³n y "F" es *fail*.
>    Un lugar ordena sin calificar.
> 3. **Se toca, no se arrastra.** NingÃºn motor dispara `dragstart` con el dedo: "arrastrar
>    en el celular" es escribir un motor propio con cuatro trampas, encima de una vÃ­a sin
>    arrastre que hay que escribir igual (WCAG 2.5.7, `D-09`, `D-14`). El arrastre nativo
>    queda como agregado para quien tiene mouse, llamando a la misma funciÃ³n.
>
> **Lo que se escribiÃ³:**
>
> | QuÃ© | DÃ³nde |
> |---|---|
> | `US-08` + `BR-22` (sin resultado correcto), piso de 14 conjuntos | `Docs/PRODUCTO/PRD-ponelos-en-fila.md` |
> | `ADR-06` (la cuarta forma `reparto`) + `CTR-13` (el conjunto ordenable) | `Docs/ARQ/ARQ-reparto-compartido.md` |
> | `UX-23` (las tres pantallas, tocar-tocar, la tabla anti-slop del gÃ©nero) | `Docs/UX/UX-23-ponelos-en-fila.md` |
> | `D-36` (por quÃ© no hay colores de fila, y por quÃ© no se arrastra) | `Docs/DECISIONES.md` |
> | El motor, el empaquetado, los conjuntos, la lÃ¡mina | `src/lib/ponelos/`, `src/lib/desafio.ts` |
> | La isla, el pincel de la lÃ¡mina, la pÃ¡gina | `src/scripts/partida-ponelos.ts`, `src/scripts/lamina.ts`, `src/pages/juegos/ponelos-en-fila.astro` |
>
> **`ADR-06`, en una lÃ­nea:** el reparto viaja en el **fragmento** (`#o=1.<conjunto>.<carga>`)
> con `g=ponelos` en la query, tres bits por ficha en base64url. Los diez discos dan **6
> caracteres**, el disco mÃ¡s largo **7**, los 105 temas **54** â€” la direcciÃ³n entera de una
> lista terminada mide ~70. El fragmento no viaja al servidor ni entra en ningÃºn registro;
> lo que se pierde a cambio es la previsualizaciÃ³n del enlace, y por eso **la imagen es el
> previsualizador**. Verificado ida y vuelta en el navegador: un link armado en una partida
> reconstruye exactamente las mismas cuatro filas.
>
> **Dos cosas que se encontraron construyendo, y que valen mÃ¡s que el juego:**
>
> - **`voz.test.ts` no tenÃ­a `tier`, `list` ni `top` en el glosario de `D-17`.** O sea que
>   "tier list" **pasaba el build**. Entraron los tres, con lÃ­mites de palabra para que
>   `list` no toque "lista" ni `top` toque "tope".
> - **`.ficha` ya existÃ­a**: es la tarjeta lateral de un artÃ­culo de la Redondopedia. El
>   choque se descubriÃ³ con el tablero ya dibujado, viendo las tapas de los discos salir con
>   papel rayado y cinta adhesiva que nadie les habÃ­a puesto. Las del juego se llaman
>   `.pieza`. **NingÃºn test miraba las colisiones de nombre de clase entre secciones**, y
>   sigue sin mirarlas.
>
> **`revisor` lo revisÃ³ al cerrar, y encontrÃ³ tres cosas â€” las tres arregladas:**
>
> - **`FIND-52` (alta):** "Los diez discos" y "Las diez tapas" se armaban **idÃ©nticos**, con
>   las mismas diez tapas y de diferencia el tÃ­tulo. Dos conjuntos que son el mismo dejaban
>   el piso contando catorce donde habÃ­a trece. Arreglado siguiendo `CTR-13.2`: `discos` va
>   sin tapa (tÃ­tulo y aÃ±o) y `tapas` con tapa, asÃ­ los dos comparten las fichas y son
>   preguntas distintas â€” uno ordena el disco, el otro ordena el dibujo.
> - **`FIND-53` (media):** el test que debÃ­a atajarlo miraba **la coherencia interna del
>   cÃ³digo con sÃ­ mismo** â€”"si el formato dice tapa, que haya imagen"â€” y por eso pasaba en
>   verde con los dos conjuntos gemelos. Ahora compara contra la tabla del contrato, y hay
>   una guarda nueva que falla si dos conjuntos cualesquiera son idÃ©nticos.
> - **`FIND-54` (media):** los cuatro nombres de fila viven en `filas.ts` y no en `copy.ts`,
>   asÃ­ que **`voz.test.ts` no los miraba** â€” justo las cuatro cadenas que `BR-22` prohÃ­be
>   jerarquizar. Entraron al barrido con un recolector aparte, como el banco de dos ejes, y
>   se sumÃ³ la guarda que `BR-22` necesitaba y que ninguna de las siete reglas de la voz
>   cubrÃ­a: **ningÃºn texto visible del juego puede calificar** (mejor, peor, nivel, podioâ€¦).
>
> Las tres guardas nuevas se probaron **rompiendo el cÃ³digo a propÃ³sito** y comprobando que
> fallan. Al hacerlo apareciÃ³ una cuarta cosa, que no habÃ­a visto nadie: la guarda de
> `BR-22` tenÃ­a un byte de control adentro de su expresiÃ³n regular en vez de un ``, asÃ­
> que **no podÃ­a coincidir con nada**. Estaba viva por casualidad, como un test verde que no
> mira. Reparada, y verificada contra las cuatro palabras que sÃ­ tiene que atrapar.
>
> **Lo que queda abierto, en `Docs/SUGERENCIAS/HILO-para-arquitectura-y-producto-el-conjunto-sorteado.md`:**
> el conjunto sorteado (`az-<semilla>`) es un quinceavo que ningÃºn documento nombra â€”hay que
> decidir si entra al piso y agregarlo a `CTR-13`â€”, y la pÃ¡gina manda **el catÃ¡logo** en vez
> de los conjuntos armados, que es lo que hace posible reconstruir un sorteo ajeno. Y sigue
> abierto de `UX-23`: **`UX-04` no tiene la fila de *Â¡Bang! Â¡Bang!â€¦ EstÃ¡s liquidado*** en el
> mapa secciÃ³nâ†’disco, aunque el cÃ³digo ya la tiene en los tres lugares donde el mapa vive.

**Ciclo actual:** **13 â€” EN CURSO (2026-09-02).** Sin plan de `orquestador`: lo pidiÃ³ el
usuario directo, en una rÃ¡faga, y se trabajÃ³ contra una auditorÃ­a medida en vez de contra
una lista de `T-`. El pedido, textual: *"Sigamos puliendo el ui/UX, que no quede duro ni
cortado, que los fondos se integren bien. Se agregaron nuevos recortes y videos a las
carpetas donde estÃ¡n las tapas, tambiÃ©n usemos las pasadas que quedaron buenas para
fondos."*

`npm test` **456/456** (eran 437 al cerrar el 12), `npm run check` limpio, build de **150
pÃ¡ginas**, validador `APTA` con los dos avisos de siempre. Rama `ciclo-13/que-no-corte`.

> ## ðŸ§¹ LIMPIEZA DE LAS LETRAS (2026-09-02, misma rÃ¡faga del ciclo 13)
>
> Pedido del usuario, textual: *"Hace una limpieza de las letras. Hay algunos acordes
> metidos en las letras, algunas tienen mensajes que no son del tema como saludos o cosas
> asi, o en la letra dice [Instrumental] y rompe el juego de las letras."*
>
> ### Por quÃ© el filtro que ya existÃ­a no alcanzaba
>
> `anotacion.ts` mira **un renglÃ³n** y le busca una firma. Sirve para `(X4)` y para
> `GUITARRA:`, y no puede servir para esto, porque el ruido que quedaba **no viene suelto**:
> el que sube una cifra escribe un pÃ¡rrafo entero en la columna de la letra y la fuente lo
> parte en renglones cortos. En *Salando las heridas*, `Compases`, `El bajo` y `Que va
> cambiando` no tienen ninguna firma propia â€” son tres frases castellanas cualquiera. Pegadas
> a `Hay que tocar acordes`, no hay duda de quÃ© son. **El contexto era la evidencia que
> nadie estaba mirando.**
>
> ### Lo que hay ahora
>
> - **`src/lib/cancionero/taller.ts`**: clasifica **por bloque**. Un renglÃ³n cae solo si
>   trae seÃ±al fuerte; el bloque entero cae si tiene al menos una fuerte y el 60 % de sus
>   renglones acompaÃ±a. El bloque lo cortan el renglÃ³n en blanco y la tablatura, que es
>   exactamente como se ve el pÃ¡rrafo en la pÃ¡gina de origen.
> - **177 renglones despegados de la letra** en 53 temas, **nada borrado**: pasan a
>   `t: "anotacion"`, se siguen viendo en `/letras-y-acordes/` con su estilo, y salen de los
>   bancos de `US-03` y `US-07`. El registro completo, con el motivo de cada uno, en
>   **`src/data/cancionero-notas.json`** â€” mismo criterio que la cuarentena de `D-13`.
> - **Los 27 `\r` de `san-telmo`** se limpian en la ingesta. Viajaban hasta el HTML.
> - **`san-telmo` pasÃ³ a `solo-tablatura`**, que es lo que siempre fue: lo Ãºnico que la
>   ingesta contaba como verso ahÃ­ eran el tÃ­tulo de la pÃ¡gina, `MELODIA.  (acordeon)`, un
>   `FIN.` y la acotaciÃ³n del que lo subiÃ³.
> - **`sinEtiquetaFinal`**: corta la etiqueta pegada al final de un verso cantado
>   (`"Ay, ay, ay que risa le da! Riff 1"`). Antes ese renglÃ³n entraba con la basura puesta;
>   descartarlo entero habrÃ­a perdido ocho renglones del estribillo de *Luzbelito y las
>   sirenas*. `VERSION_FILTRO` subiÃ³ a **7** por esto y por la re-ingesta.
> - **`npm run generar-letra -- --reanclar`**: los ids de `letra.json` son posicionales, asÃ­
>   que cualquier cambio del filtro corre las 21 anclas curadas de `T-138` y el guardiÃ¡n
>   aborta â€”con razÃ³nâ€”. El atajo mueve el ancla al id nuevo **solo si el verso elegido sigue
>   existiendo, idÃ©ntico y en un Ãºnico Ã­tem**: se conserva la decisiÃ³n de `contenido`, que es
>   lo que se eligiÃ³; el nÃºmero nunca fue el dato. Las 21 se movieron limpias.
>
> ### El precio, medido y no supuesto
>
> Se revisaron **los 177 renglones uno por uno** contra el corpus: ninguno es un verso
> cantado. Dos falsos positivos aparecieron en la primera pasada y los dos se arreglaron con
> regla, no con excepciÃ³n: `"Un killer riff en su contestador"` (de *Pool, Averna y papusa*
> â€” `riff` cantado adentro de una frase larga ya no alcanza para marcar) y las ocho lÃ­neas de
> *Luzbelito*. Queda **uno declarado**: en *Sorpresa de Shangai*, `"Â¿A quien le importa?"`
> comparte renglÃ³n con una nota separada por sangrÃ­a ancha, y el renglÃ³n entero cae. Es un
> verso corto y genÃ©rico que los juegos ya descartaban por otra regla.
>
> **Un `\b` de JavaScript es ASCII**, y lo agarrÃ³ el test: `distorsiÃ³n`, `compÃ¡s` y `AcÃ¡`
> terminan en una letra que `\b` no considera palabra, asÃ­ que media docena de reglas nunca
> enganchaban. Ahora los bordes cuentan la tilde (`INI`/`FIN` en `taller.ts`).
>
> ### Lo que queda sabido y no resuelto
>
> - **El raspador de origen se come palabras cantadas cuando coinciden con una cifra
>   latina.** `"A brillar mi amor"` quedÃ³ como `"A brillar E amor"` (*mi* â†’ `E`), `"LA linda
>   jaula"` como `"A  linda jaula"`, y `"SOLO DE SAXO"` como `"G  O DE SAXO"`. **Esto no es
>   ruido del transcriptor: es letra rota, y esta limpieza no lo toca** â€” el arreglo es en
>   `TemasRedo`, afuera del repo. Mientras tanto hay versos con un agujero en el medio.
> - **`la-bestia-pop` quedÃ³ con 1 verso utilizable** y saliÃ³ del banco de `US-07` (89 â†’ 88
>   temas, piso 60 igual cumplido). No es una pÃ©rdida: esa pÃ¡gina de cifraclub es casi toda
>   taller de guitarra, y lo poco de letra que tiene estÃ¡ mangleado por lo de arriba.
>
> ## ðŸ–¨ EL CICLO 13: LA HOJA TERMINA, Y LA TINTA SE ACABA EN VEZ DE CORTARSE
>
> **La doctrina quedÃ³ en `D-34` y `D-35`.** La primera dice *una capa de fondo es una
> pasada, no un campo*: tiene direcciÃ³n, principio y final, los extremos se apagan en mota,
> y si la pasada sigue de largo por un lado ese lado no se desgasta. La segunda dice que
> **toda pantalla termina en un pie de imprenta y el crÃ©dito de `D-21` vive ahÃ­**, porque la
> tapa y su crÃ©dito son el mismo componente y no se pueden escribir por separado.
>
> ### Lo que estaba pasando, medido y no recordado
>
> Antes de tocar nada, a 375Ã—812:
>
> | QuÃ© | DÃ³nde | CuÃ¡nto |
> |---|---|---|
> | **"CompletÃ¡ la letra" era injugable** | `#partida` y `#resultado` sin `sobre-tapa`, y el Ãºnico `main` estÃ¡tico de los seis | Al tocar "EmpezÃ¡" la tapa velada se pintaba **encima del juego entero**: pantalla en blanco |
> | Opciones con viÃ±eta y de distinto ancho | `.opciones` como `<ul>` en dos de los cuatro juegos | 120, 226, 76 y 117 px, sangradas 40 |
> | El pie flotando con negro debajo | `/juegos/dos-ejes/` | **337 px**, el 41 % de la ventana |
> | Desplazamiento muerto | `adivinar-la-tapa` y `dos-ejes`, en `100vh` | 32 px que no llevan a ningÃºn lado |
> | La franja del portal cortaba en lÃ­nea recta | `.tapa-fondo--portal`, y=568 | de x=0 a x=375 |
> | La tapa de fondo estirada al alto del documento | `adivinar-el-tema`: 343Ã—1513 sobre un archivo de 591Ã—381 | se veÃ­a **el 14,6 % de la foto, ampliada 4Ã—** |
> | El rÃ³tulo de fuente de las fichas, ilegible | `.ficha .fuente-chip`, `--texto-tenue` sobre `--papel` | **1,78:1** a 11,5 px |
> | La ficha desbordaba el papel | `white-space: nowrap` + columnas `auto 1fr` | `dd` de **589 px** en una tarjeta de 345 |
> | Y la pÃ¡gina entera se arrastraba de costado | el mismo `nowrap`, en la prosa | chip de **981 px**, documento a 997 |
> | Cinco pantallas sin ningÃºn fondo | quiz, dos-ejes, por-la-letra y las dos de cancionero | tres **declaraban por escrito el disco que no vestÃ­an** |
> | Dos `.tapa-fondo` en la misma pÃ¡gina | `/redondopedia/` | el trÃ¡nsito de `ADR-03` **apagado en silencio** |
>
> ### Lo que hay ahora que no habÃ­a
>
> - **El pie de imprenta**, en las trece rutas: costura de rodillo, la `-media` de la
>   serigrafÃ­a de su disco como mÃ¡scara sobre tinta plana, una figura recortada cortada
>   contra el borde derecho, y el crÃ©dito impreso encima. Componente:
>   `src/components/PieImprenta.astro`.
> - **El desgaste**: ninguna capa de fondo corta. Dos capas de mÃ¡scara â€”nÃºcleo transparente
>   hasta el 55 % y encima la veta de `--textura-rodillo`â€”, **sin `mask-composite`**, asÃ­
>   que un motor que no lo entienda no puede arruinarlo.
> - **Los tres recortes que trajo el usuario**, con el nombre que el despiece pedÃ­a desde
>   hace ciclos: `cordero-rulo.png`, `luzbelito-vela.png` y `momo-medallon.png`. De 393 KB a
>   89 KB. Los mÃ¡steres en `Docs/UX/recortes-master/`, afuera de `public/`.
> - **El casete del portal se pisa con el de al lado** y la cinta adhesiva cruza la costura.
>   Antes los siete medÃ­an 345 px y arrancaban en x=14 o 15: una lista, no un collage.
>
> ### Los dos guardianes nuevos, y el segundo es el que importa
>
> - `contraste.test.ts` mezcla `--peso-pasada` con las diez tintas y falla si alguna deja el
>   crÃ©dito por debajo de AA. **Y falla tambiÃ©n por lo contrario**: si el salto sobre el
>   fondo baja de 12 niveles de 255. Una atmÃ³sfera que puede leerse como nada no es
>   sutileza, es relleno con coartada.
> - `estilos.test.ts` cierra dos agujeros: el velo que se desvanece â€”que **pasaba el test
>   viejo por subcadena** y dejaba media foto desnuda bajo el textoâ€” y la mÃ¡scara, que era
>   una vÃ­a nueva para que un archivo de `/tapas/` llegue a pantalla sin que nadie la mire.
>
> ### CÃ³mo se decidiÃ³, porque importa para la prÃ³xima
>
> No se eligiÃ³ la direcciÃ³n a ojo. Ocho auditores midieron el repo por dimensiÃ³n, tres
> direcciones independientes se desarrollaron hasta el hueso, y cuatro jueces â€”doctrina,
> build, mÃ³vil y pedidoâ€” las puntuaron por separado. GanÃ³ *el pie de imprenta* (8,5 Â· 8 Â· 8
> Â· 8). **PerdiÃ³, y es el hallazgo que mÃ¡s ahorrÃ³: vestir cada pantalla con la `-clave` de
> su disco a sangre completa** (4,5 Â· 3 Â· 4 Â· 4). Se veÃ­a bien en el prototipo y estaba mal
> por tres razones verificables: las diez claves estÃ¡n teÃ±idas con el valor de `--fondo`
> (`ADR-05.1`), son la silueta de la composiciÃ³n **entera** de una tapa â€”que
> `public/arte/README.md` prohÃ­be por escritoâ€”, y son la carta que el sitio se guarda para
> el acierto (`D-33`).
>
> ### ðŸ”´ LO QUE FALTA, Y NECESITA UN TELÃ‰FONO EN LA MANO
>
> 1. **La costura y el desgaste en un telÃ©fono real**, no en el emulador: `mask-composite`
>    saca la capa del camino rÃ¡pido en varios motores mÃ³viles, y la franja del portal ademÃ¡s
>    se traslada con `animation-timeline: scroll()`.
> 2. **Que las trece pantallas no terminen todas igual.** Es el riesgo mÃ¡s caro de una regla
>    de composiciÃ³n uniforme y el Ãºnico sin guardiÃ¡n. Lo que las separa es la tinta, el
>    dibujo de la pasada y la figura. Si al pasar de una a otra se lee como plantilla, la
>    salida es variar el encuadre de la pasada (`mask-position`), no agregar adornos.
> 3. **La pasada al sol.** Con `--peso-pasada: 18%` el piso salta 33 niveles en el rojo de
>    Lobo suelto. Si en Luzbelito o en Ãšltimo bondi no se ve, esos dos van sin pasada â€” **no
>    se sube el peso**: para eso estÃ¡ el test.
> 4. Ver el cruce entre pantallas de punta a punta con la pestaÃ±a visible, que sigue
>    pendiente del ciclo 11 y ahora vuelve a ser posible en `/redondopedia/`.
>
> ### Lo que queda sabido y no resuelto
>
> - **El video de Ãšltimo bondi no entrÃ³, y estÃ¡ escrito por quÃ©**: 3.114 KB son 52 veces el
>   techo por derivado, y su Ã­ndice estÃ¡ en el Ãºltimo 0,2 % del archivo (sin `faststart` no
>   se pinta un cuadro hasta bajar los 3 MB). El mÃ¡ster quedÃ³ en `Docs/UX/video-master/`, y
>   el comando de recodificado, el rÃ³tulo en registro 3 y dÃ³nde irÃ­a estÃ¡n en
>   `Docs/SUGERENCIAS/HILO-para-experiencia-y-contenido-video-ultimo-bondi.md`. **Esta
>   mÃ¡quina no tiene `ffmpeg`.** El rÃ³tulo es la parte que no se puede saltear: el dibujo es
>   de Rocambole, el movimiento no, y el crÃ©dito de tapa a secas mentirÃ­a.
> - **Momo Sampler es el Ãºnico disco cuya banda va casi sin pasada**: su `-media` cubre el
>   2,73 % de la lÃ¡mina. Esa pantalla se sostiene con la costura y con el medallÃ³n.
> - **Oktubre es el Ãºnico sin figura**: la Ãºnica pieza calcada que hay de ese disco es la
>   figura encadenada, y el despiece prohÃ­be atribuirle Ã¡lbum *"ni en el crÃ©dito del pie"*.
> - **Tres discos siguen sin entrada en `STICKER_DISCO`** â€”Gulp!, Oktubre y Â¡Bang! Â¡Bang!â€”.
>   Es deuda de decisiÃ³n de `experiencia`, no de archivo.
> - **Los dos cortes horizontales siguen ahÃ­**: el verso largo de `.cancion` termina en un
>   pÃ­xel seco contra el borde de su caja, y el Ãºltimo Ã­tem visible de `.sugerencias` se
>   parte contra su borde. La receta del desgaste sirve para los dos con los ejes dados
>   vuelta; no se aplicÃ³ porque sobre una hoja de acordes una mÃ¡scara al final del scroll
>   apaga los Ãºltimos caracteres, y eso hay que mirarlo con la guitarra en la mano.
> - **En las pantallas mÃ¡s cortas (`/quiz`, `/juegos/dos-ejes`) sigue habiendo ~200 px de
>   aire entre el botÃ³n y la franja.** Ya no es un rectÃ¡ngulo muerto â€”la hoja terminaâ€”, pero
>   si alguna vez molesta, la salida es de maquetado y no de fondo.


**Ciclo anterior:** **12 â€” CERRADO (2026-09-02).** Plan en `Docs/ORQ/ORQ-plan-ciclo-12.md`,
tareas `T-195`..`T-210`, las diecisÃ©is cerradas y ninguna cancelada. Lo pidiÃ³ el usuario el
2026-09-01: *"otro ciclo de ui/UX inmersivo, aÃºn mÃ¡s creativo; tomÃ¡ la mÃ­stica y la estÃ©tica
de Rocambole y aplicala a toda la pÃ¡gina; sobre todo en adivinÃ¡ el tema, que te sorprenda la
tapa cuando adivinÃ¡s"*. **La idea: el sitio no se dibuja, se imprime.** La doctrina quedÃ³ en
`D-33` â€” *el acierto es el Ãºnico grito del sitio*â€” y la hoja que la fija, en `UX-22`.

`npm test` **437/437** (eran 417 al cerrar el 11), `npm run check` limpio, build de **150
pÃ¡ginas**. La corrida del taller (`node scripts/generar-pasadas.mjs --ver`) sale con cÃ³digo 0
y los nÃºmeros que `ADR-05.9` ratificÃ³.

**QuÃ© hay ahora que no habÃ­a:** la tapa que sacÃ¡s **se imprime delante tuyo** por tres
pasadas de tinta con los colores medidos de ese disco (`RES-37`), en el orden en que se
imprime una serigrafÃ­a de verdad (`RES-54`), sobre papel y con el registro corrido; al fallar
llega en **una sola tinta**. La sala se vuelve el disco que acertaste. El acierto suena
entero, pero solo si prendiste el audio en ese tema. La estampa **se da vuelta** y muestra la
trasera real con la pista estampada como sello â€”y la trasera no se baja hasta que la tocÃ¡sâ€”.
Los carretes del casete giran mientras corre el fragmento. El resumen de la vuelta se maqueta
como afiche, con las cuatro tapas chicas. En "AdivinÃ¡ la tapa" el zoom **se abre** a la tapa
entera: es la pieza que `UX-13 Â§4` habÃ­a dejado escrita como pendiente. Y la imprenta saliÃ³
de los juegos: el registro imperfecto vive detrÃ¡s de la letra grande de todo el sitio, el
rodillo separa las secciones del portal y del Ã­ndice, y la ficha de disco de la Redondopedia
estÃ¡ estampada â€” quieta, porque un artÃ­culo no se mueve.

> **CÃ³mo se trabajÃ³, porque importa para la prÃ³xima.** El ciclo lo construyÃ³ una sesiÃ³n que
> se quedÃ³ sin contexto antes de guardar nada: `T-195`..`T-204` estaban en el Ã¡rbol, sin
> commitear y sin `ESTADO.md` al dÃ­a. La sesiÃ³n siguiente guardÃ³ eso primero, tal cual estaba
> (`d3efb56`), y reciÃ©n despuÃ©s terminÃ³ lo que faltaba. **Lo primero que hay que hacer con
> trabajo ajeno sin commitear es guardarlo, no mejorarlo.**

> **`REV-11` â€” los seis hallazgos, y dÃ³nde quedÃ³ cada uno.** La ficha estÃ¡ en
> `Docs/REVISIONES/REV-11-la-imprenta.md`. Veredicto: ðŸŸ¡ en las dos preguntas duras del plan
> (*Â¿sorprende la tapa?* y *Â¿la imprenta se volviÃ³ plantilla?*), con el lÃ­mite declarado de
> que `revisor` no tiene pantalla para mirar.
>
> - **`FIND-46` (mayor) â€” CERRADO.** El crÃ©dito del pie no acumulaba: recalculaba la lista
>   desde el `data-tapas` estÃ¡tico en cada tema y perdÃ­a el disco anterior, contra lo que
>   pide `UX-22 Â§2.5`. Ahora vive en un `Set` de la sesiÃ³n que no saca a nadie. Verificado a
>   mano: acertar un tema de Oktubre deja "Lobo suelto y Oktubre" en el pie, y lo sigue
>   diciendo en el tema siguiente.
> - **`FIND-47` (bloqueante) â€” CERRADO.** `T-205` estaba declarada cerrada en el commit y no
>   estaba construida: el resumen no llevaba las tapas ni usaba `RESULTADO.afiche`.
>   Construida y verificada a 375Ã—812 y a 320 px sin desborde.
> - **`FIND-48` (mayor) â€” CERRADO.** Faltaba `isolation: isolate`, que `UX-22 Â§2.2` exige por
>   nombre: sin eso el `multiply` de las tintas no se detiene en el papel. Agregado en
>   `.estampa-papel` y en `.estampita`.
> - **`FIND-49` (mayor) â€” CERRADO por `arquitectura`.** RatificÃ³ **el papel como cuarta
>   zona** en `ADR-05.9`, y encontrÃ³ que el equivocado era el contrato, no el taller: su
>   regla 5 contradecÃ­a a su propio `ADR-05.2`. De paso enmendÃ³ tres desvÃ­os que el hallazgo
>   no listaba. El hilo principal construyÃ³ el candado 7 (caso 19 de `estilos.test.ts`) y
>   corriÃ³ la verificaciÃ³n entera, en verde.
> - **`FIND-50` (menor) â€” CERRADO por `contenido`.** RetirÃ³ el sello de crÃ©dito de `CNT-14
>   Â§2.2` en vez de reescribirlo: `UX-22 Â§2.5` no pide un sello con otra forma, pide que no
>   exista ninguno.
> - **`FIND-51` (menor) â€” CERRADO por `experiencia`, con una vuelta de correcciÃ³n.**
>   RatificÃ³ en `UX-22 Â§1.4` el scroll que al revelar lleva la vista al premio en vez de al
>   botÃ³n. La mediciÃ³n que pidiÃ³ tumbÃ³ su primera condiciÃ³n â€”en "AdivinÃ¡ la tapa", Ã­tem
>   `oktubre`, "SeguÃ­" quedaba 457 px (56 % de la pantalla) debajo del pliegueâ€”, asÃ­ que
>   `Â§1.4` pasÃ³ a v4: el `scrollIntoView` apunta con `block: 'end'` al bloque que **termina**
>   en el botÃ³n. Construido y verificado: el botÃ³n entra entero en los cuatro casos, con 6 a
>   19 px de sobra.

> **Lo que este ciclo deja sabido y no resuelto, para el prÃ³ximo.** La v4 de `UX-22 Â§1.4`
> eligiÃ³, con todos los datos sobre la mesa, que **entre ver el premio y que el botÃ³n nunca
> falte, gana el botÃ³n**. La consecuencia medida: en el Ã­tem mÃ¡s cargado de "AdivinÃ¡ la tapa"
> â€”`oktubre`, con explicaciÃ³n larga y sello de leyendaâ€” la pantalla queda parada en el panel
> y **la tapa se imprime arriba del pliegue, fuera de vista**. No es un defecto, es la
> jerarquÃ­a que `experiencia` fijÃ³ a propÃ³sito y dejÃ³ escrita; pero es exactamente el
> problema que el ciclo 12 vino a resolver, reaparecido en un caso de borde. Si alguna vez se
> quiere las dos cosas, la salida no es el scroll: es el maquetado â€”mover la figura abajo de
> las opciones al revelarâ€”, que es la opciÃ³n 3 que `experiencia` descartÃ³ por tamaÃ±o.

**Ciclo 11 â€” CERRADO.** El ciclo 10 tambiÃ©n, y en el mismo dÃ­a, en dos sesiones
que no se veÃ­an. Plan del 11 en `Docs/ORQ/ORQ-plan-ciclo-11.md`, tareas `T-176`..`T-194`.
`npm test` **417/417** (eran 372), `npm run check` limpio, build de **150 pÃ¡ginas**.

> ## ðŸŽž EL CICLO 11: EL SITIO DEJÃ“ DE MOSTRARSE Y EMPEZÃ“ A HABITARSE
>
> Lo pediste asÃ­: *"todo de mejora completa de ui/ux; que toda la pÃ¡gina sea una experiencia
> inmersiva, que cada paso se sienta como meterse en un universo mitolÃ³gico misterioso"*.
>
> **El punto de partida, medido y no recordado:** todo el sitio tenÃ­a **dos movimientos**
> â€”los 120 ms del borde de una opciÃ³n y el vuelo de la moscaâ€” y **ni un solo token de
> movimiento**. El mundo estaba construido y no se movÃ­a.
>
> **La trampa que traÃ­a el pedido, y es lo que ordenÃ³ el ciclo entero:** casi todo lo que se
> hace cuando piden "inmersivo" ya estaba vetado en este repo. El resplandor, el desenfoque,
> el degradado, la tarjeta que se levanta, el hÃ©roe que aparece con fundido. Un ciclo de
> inmersiÃ³n sin doctrina era la corrida anti-slop al revÃ©s. Por eso la vara se escribiÃ³
> **antes** de mover nada: `UX-20` (de `experiencia`), y de ahÃ­ saliÃ³ **`D-32`**:
>
> > **El movimiento es del lugar, no del elemento.** Lo que se mueve es la cÃ¡mara: el aire,
> > el fondo, la tinta, el paso de una pantalla a la otra. Un botÃ³n que rebota es un botÃ³n
> > pidiendo aplausos; una sala que respira es un lugar.
>
> ### Lo que hay ahora que antes no estaba
>
> | QuÃ© | DÃ³nde | CuÃ¡nto pesa |
> |---|---|---|
> | **El trÃ¡nsito entre pantallas.** Ir de la portada a un juego dejÃ³ de ser un documento nuevo: la tinta se hunde y vuelve. `@view-transition` de CSS entre documentos (`ADR-03`) | `tokens.css`, una sola adhesiÃ³n para las 150 pÃ¡ginas | **cero JavaScript**, y donde el navegador no lo soporta no pasa nada |
> | **El umbral.** La portada llega en un tiempo: el grano se asienta, la figura baja, la marca termina de apoyar. **Una vez por visita** | `index.astro`, `sitio.css` | 0 ms de retraso del dedo |
> | **La cama de cinta.** Ruido de cinta **sintetizado** en el navegador, apagado por defecto, que se calla sola cuando suena un fragmento (`ADR-04`, `UX-21`) | `audio/contexto.ts`, `sitio/cinta.ts`, `scripts/cinta.ts` | **cero archivos de audio**; 2,4 KB comprimidos de mÃ³dulo |
> | **Los nombres del lugar.** Ocho renglones que dicen dÃ³nde estÃ¡s parado (`CNT-13`) | `LUGARES` en `sitio/copy.ts`, ocho pantallas | ocho cadenas |
> | **La capitular de la Redondopedia** y la deriva de la franja del portal | `sitio.css` | â€” |
>
> ### Los tres arreglos que el ciclo trajo de arrastre, y valen tanto como lo nuevo
>
> 1. **El corte de `prefers-reduced-motion` dejÃ³ de ser una guillotina.** Era un `*` con
>    `!important` que apagaba todo, **incluida la respuesta al toque**. Ahora opera por
>    familia de token: se apaga la cÃ¡mara, nunca el dedo. Era un P3 abierto desde el 24-ago.
> 2. **`completar-la-letra` mostraba la marca sin ningÃºn estilo.** `.marca` estaba definida
>    en el alcance de cinco pÃ¡ginas y esa no la tenÃ­a: el nombre del sitio salÃ­a en la letra
>    por defecto del navegador. Nadie lo habÃ­a visto. Ahora es componente global.
> 3. **El portal bajaba 109 KB de mÃ¡s** en recortes sobredimensionados (`oktubre-cadena.png`
>    pesaba 113 KB para un hueco de 132 px). `scripts/optimizar-arte.mjs` los ajusta al
>    triple del hueco real, y la letra titular se pide con `preload`: el tÃ­tulo ya no
>    parpadea de Arial Black a la calcada en cada carga frÃ­a.
>
> ### Y un guardiÃ¡n nuevo, porque el movimiento era lo Ãºnico sin auditor
>
> `src/lib/movimiento.test.ts` falla el build si aparece una duraciÃ³n o una curva fuera de
> `tokens.css`, si una animaciÃ³n no declara su equivalente quieto, si vuelve el `*` global,
> si alguien mete un enrutador de cliente, o si aparece un cuarto nombre de trÃ¡nsito.
>
> ### ðŸŸ¡ `REV-10` CIERRA EN AMARILLO, Y EL MOTIVO NO ES EL CÃ“DIGO
>
> `Docs/REVISIONES/REV-10-el-sitio-como-lugar.md`. Ocho hallazgos, `FIND-38`..`FIND-45`.
> **Los que tenÃ­an arreglo estÃ¡n arreglados**; los que son de `experiencia` quedaron como
> propuesta en `Docs/SUGERENCIAS/HILO-para-experiencia-desvios-del-ciclo-11.md`.
>
> **`FIND-39`, el que mÃ¡s duele y el mejor encontrado:** el umbral del grano y de la figura
> **eran el fundido de entrada que el comentario de al lado decÃ­a no usar**. El grano
> arrancaba en `opacity: 0` y la figura en `0.35`: fundido y deslizamiento, el tic de
> plantilla nÃºmero uno, adentro del ciclo escrito para que eso no pasara. Arreglado: ninguno
> de los tres sub-pasos toca la opacidad, lo que llega **no aparece, se apoya**.
>
> **`FIND-38`:** el plan decÃ­a que este ciclo no tocaba `quiz.astro` ni
> `adivinar-el-tema.astro`, y los tocÃ³. **No hubo conflicto** â€”el otro agente habÃ­a cerrado y
> commiteado el ciclo 10 a mitad de camino, asÃ­ que los archivos ya eran de nadieâ€” pero el
> documento que ordena el ciclo dejÃ³ de describirlo, y eso lo encontrÃ³ la revisiÃ³n leyendo el
> plan contra el disco. Corregido en el plan, con la fecha y el motivo.
>
> **La cuarta pregunta â€”Â¿se siente un lugar, o una web con animaciones?â€” quedÃ³ en ðŸŸ¡:**
> *"pesa hacia lugar, pero no se puede firmar todavÃ­a"*. Y el argumento es bueno: *"un lugar
> no se declara por la atmÃ³sfera que tiene, se declara por si sus lÃ­mites se sostienen"*.
>
> ### ðŸ”´ LO QUE FALTA, Y NECESITA UN TELÃ‰FONO EN LA MANO
>
> **El cruce entre pantallas no se vio funcionando.** El navegador de la sesiÃ³n mantiene el
> documento en `visibilityState: "hidden"` y Chrome **saltea las transiciones de vista en
> documentos escondidos**. SÃ­ estÃ¡ verificado que las dos reglas existen y se aplican (leÃ­das
> del CSSOM), que los tres nombres resuelven de los dos lados de una navegaciÃ³n, y que el
> navegador soporta el mecanismo. Falta ver el cruce.
>
> La lista completa estÃ¡ al final de `REV-10`. Las seis, en orden:
>
> 1. Ver el cruce entre pantallas de punta a punta, con la pestaÃ±a visible.
> 2. Confirmar **con el dedo** que el botÃ³n responde durante el umbral y durante el paso.
> 3. Prender la cinta y jugar una vuelta con sonido de verdad: que se calle y que vuelva.
> 4. Ver el umbral a 375Ã—812 y decidir si los 520 ms se sienten como una cosa o como espera.
> 5. Que `quiz.astro` y `adivinar-el-tema.astro` quedaron coherentes.
> 6. Prender "reducir movimiento" **en el sistema operativo del telÃ©fono**, no en las
>    devtools, y jugar una vuelta entera sin que falte una sola confirmaciÃ³n.
>
> ### Y dos defectos que encontrÃ³ la refutaciÃ³n adversarial de la cama, ya arreglados
>
> Ninguno lo habÃ­a encontrado una prueba. Los encontrÃ³ alguien leyendo con la consigna de
> **refutar**, no de confirmar:
>
> - **Dos toques que se pisaban armaban dos camas**, y la segunda dejaba a la primera sonando
>   sin apagador. El candado estaba del lado equivocado del `await`.
> - **Frenar un fragmento antes de que volviera el contexto no frenaba nada:** el sonido
>   arrancaba igual cuando la promesa resolvÃ­a, y â€”peor, desde este cicloâ€” con la salida ya
>   declarada libre, asÃ­ que la cama volvÃ­a a subir encima. La mitad vieja de ese defecto
>   **ya estaba en el repo desde antes**: tocar "Escuchar" y "Parar" rÃ¡pido con el telÃ©fono
>   volviendo de una llamada hacÃ­a sonar el fragmento igual.
>
> Los dos con su caso de regresiÃ³n: `cinta.test.ts` y `audio.test.ts`.
>
> **Y uno que quedÃ³ anotado y no se arreglÃ³, porque es de otro juego y estÃ¡ latente:** el
> reproductor del tema entero de `US-02` **sigue sonando en la pantalla de resultado** si
> alguien toca "SeguÃ­" mientras suena. Hoy no se nota porque todavÃ­a no hay temas enteros
> alojados (`D-22`); el dÃ­a que los haya, se nota.

> ### Las dos sesiones del 2026-09-01, y lo que dejaron aprendido
>
> Los ciclos 10 y 11 se planificaron el mismo dÃ­a, leyendo el mismo disco, sin verse. Las
> dos vieron que el Ãºltimo documento de `experiencia` era `UX-12` y **las dos escribieron un
> `UX-13` distinto**. Lo detectÃ³ la sesiÃ³n del 11 mirando `git status` antes de dar nada por
> cerrado, no porque nadie avisara. El zoom de tapas se quedÃ³ con `UX-13`; el ciclo 11 se
> corriÃ³ a **`UX-20`+** y la reserva quedÃ³ en `Docs/IDS.md`, que es donde corresponde.
> **NingÃºn otro archivo se pisÃ³ de los dos lados.**

**Ciclo 10: CERRADO en una rÃ¡faga.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-10.md`. **Catorce de quince tareas hechas**; la que falta es
`T-165`, la clave de YouTube, que es tuya. `npm test` **372/372** (eran 352), `npm run
check` limpio, build de **150 pÃ¡ginas**.

> ### âœ… LA v1 SE PUEDE DECLARAR, Y EL MOTIVO POR EL QUE NO SE PODÃA NO ERA CÃ“DIGO
>
> `REV-09` (`Docs/REVISIONES/REV-09-cierre-v1.md`) abriÃ³ en ðŸŸ¡ y cerrÃ³ en ðŸŸ¢.
>
> **El defecto que motivÃ³ el ciclo, arreglado:** `US-02` armaba la vuelta con un
> Fisher-Yates sobre los 95 temas y **la palabra `dificultad` no aparecÃ­a una sola vez en
> el archivo**. Era `FIND-29` â€”lo que `REV-08` encontrÃ³ en `US-07`â€” vivo en un juego de la
> v1. Ahora el catÃ¡logo estampa el nivel en build desde las escuchas (`CTR-03.11`) y la
> vuelta escalona.
>
> **El hallazgo que no esperaba, y era el que bloqueaba de verdad (`FIND-35`):** tres de
> los criterios de aceptaciÃ³n de la v1 describÃ­an **un producto que ya no existe**.
> `US-02` c3 condicionaba a Spotify, que `D-22` sacÃ³; `US-03` c3 y `US-04` c3 condicionaban
> al cerrojo de derechos, que `D-14` sacÃ³ â€” y el sitio estÃ¡ publicado desde hace dÃ­as con
> los dos juegos adentro. **Contra esa vara la v1 no se podÃ­a ni aprobar ni rechazar.**
> Los tres estÃ¡n reescritos, con su redacciÃ³n vieja citada.
>
> **El segundo (`FIND-34`):** `US-02` y `US-03` llegaron a su piso el 27-ago y **nadie
> prendiÃ³ su guarda**. Eran los dos Ãºnicos pisos sin test de no regresiÃ³n, y el archivo
> seguÃ­a diciendo "Hoy: 0". Borrar un mp3 los bajaba en silencio. Ya estÃ¡n prendidas.
>
> ### ðŸ”´ Las dos salvedades con las que se declara â€” no se declara ignorÃ¡ndolas
>
> 1. **`US-02` no escalona todavÃ­a**, y su mÃ­nimo de 8 FÃ¡ciles es 0. El mecanismo estÃ¡
>    puesto y verificado; falta el insumo. `BR-18` apartado **(g)** decide por escrito que
>    eso **no frena** el "Listo", y el argumento no es "es poca cosa": es que `US-02`
>    tiene una **segunda rampa que los otros tres no tienen** â€”los seis pasos de `D-24`,
>    donde errar abre mÃ¡s audioâ€”, asÃ­ que el orden de los Ã­tems no es su Ãºnico molinete
>    abierto. La decisiÃ³n vale mientras se cumplan tres condiciones corribles, listadas ahÃ­.
> 2. **`FIND-37`: nada de este ciclo lo mirÃ³ alguien que no lo hubiera construido.** Las
>    quince tareas y la revisiÃ³n salieron de la misma mano, incluidas decisiones que son de
>    `producto`, `arquitectura` y `experiencia`. EstÃ¡ declarado en `REV-09` y es lo Ãºnico
>    que separa a la v1 de estar cerrada del todo. **Si hay que correr `revisor` de verdad
>    sobre algo, es sobre `src/lib/escalonar.ts` y `catalogo().dificultad`.**

**Ciclo 11: PLANIFICADO, sin empezar, y corre en paralelo al 10.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-11.md`, tareas `T-176`..`T-194`. Lo pidiÃ³ el usuario el 2026-09-01:
*"toda la pÃ¡gina una experiencia inmersiva, que cada paso se sienta como meterse en un
universo mitolÃ³gico misterioso"*. Empieza por `T-176`, `T-180`, `T-184` y `T-189`.

> **Los dos ciclos conviven a propÃ³sito y no comparten ningÃºn archivo salvo `ESTADO.md`.**
> El plan del 11 abre con el mapa de conflictos: los archivos del ciclo 10 â€”`partida-tema.ts`,
> `quiz.astro`, `voz.test.ts`, los JSON de banco, los schemas, `PRD-alcance-v1.md`, `UX-05`â€”
> **no los toca ninguna tarea del 11**. `T-182` deja el quiz afuera del trÃ¡nsito hasta que
> cierre `T-167`, y eso es deuda anotada, no olvido. **El que llegue segundo a `ESTADO.md`
> (`T-175` o `T-194`) lo relee antes de escribir.**
>
> El punto de partida del 11 tambiÃ©n estÃ¡ medido, no recordado: **todo el sitio tiene dos
> movimientos** â€”los 120 ms de `.opcion` en `juego.css:104` y el vuelo de la mosca en
> `sitio.css:147`â€”, no hay un solo token de movimiento en `tokens.css`, y el corte de
> `prefers-reduced-motion` (`tokens.css:205`) apaga tambiÃ©n la respuesta al toque, que es
> informaciÃ³n. La doctrina que el ciclo propone, y que `UX-13` fija o corrige: **el
> movimiento es del lugar, no del elemento.**

**Ciclo 9: cerrado entero** (`T-128`..`T-160`, `T-148` cancelado). Los cinco frentes, mÃ¡s
`REV-08` y la puesta al dÃ­a.

> ### ðŸ”´ EL CICLO 10 ARRANCA CON UN DEFECTO YA MEDIDO (2026-09-01)
>
> **Los cinco pisos de la v1 estÃ¡n cumplidos y la v1 no estÃ¡ lista.** `US-02` incumple una
> regla que su propia historia declara por escrito, y estÃ¡ verificado en el cÃ³digo, no
> deducido del tablero:
>
> `src/scripts/partida-tema.ts:196-202` arma la vuelta con un Fisher-Yates sobre los 95
> temas y corta cuatro. **La palabra `dificultad` no aparece una sola vez en ese archivo**,
> y `src/data/adivinar-tema.json` no tiene el campo en ninguno de sus 95 Ã­tems. Es
> `FIND-29` â€”el defecto que `REV-08` encontrÃ³ en `US-07`â€” vivo en un juego de la v1.
>
> `PRD-alcance-v1.md` le exige a `US-02` **mÃ­nimo 8 de nivel FÃ¡cil**, definidos por
> `BR-18` (f) desde el ranking de YouTube. Hoy son **0**, y `BR-01` no se cumple: la
> primera pregunta sale del azar.
>
> **Y el segundo hallazgo del mismo tirÃ³n:** `adivinar-tema.json` es el **Ãºnico banco de
> juego sin schema**. `src/lib/esquemas.test.ts` valida siete archivos y ese no estÃ¡.
> Los 95 Ã­tems del banco mÃ¡s grande de la v1 son los Ãºnicos que nadie valida a mÃ¡quina.
>
> **Sigue esperÃ¡ndote la clave de YouTube.** `popularidad.json` tiene los 105 temas en
> `sin-video` y cero mediciones. Un comando prende el escalonamiento de `US-02` y `US-07`
> a la vez, sin tocar cÃ³digo:
> `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`
> El ciclo 10 **no se cuelga de eso**: el frente A degrada a barajado declarado, como
> `US-07`. Lo que cambia no es que el juego escalone, es que deje de decir âœ… sobre un
> criterio que no cumple.

> ### âœ… "ADIVINÃ LA TAPA" AHORA ES UN JUEGO DE ZOOM (2026-08-28)

> `npm test` **352/352** Â· `npm run check` limpio Â· guarda en `src/lib/tapa/encuadre.test.ts`
> Â· diez zooms nuevos por `scripts/generar-tapas.mjs`.
>
> SaliÃ³ auditando el quiz y terminÃ³ en otra cosa. **El defecto:** abrÃ­ los diez masters de
> a uno y **ocho de las diez tapas traen el tÃ­tulo impreso en la cara frontal**, mientras
> ocho de los diez Ã­tems mostraban la tapa entera. El juego promete reconocer una tapa y se
> ganaba **leyendo**. En `TP-007` y `TP-008` era doble: las dos tapas del Ã¡lbum doble
> imprimen los dos tÃ­tulos, asÃ­ que descartaban dos opciones de cuatro.
>
> Las Ãºnicas dos que **no** imprimen el tÃ­tulo: `gulp` â€”lo manuscrito es Â«Patricio Rey y
> sus Redonditos de RicotaÂ», el nombre de la bandaâ€” y `bang-bang`, sin una sola letra.
>
> ### El usuario cortÃ³ por lo sano, y quedÃ³ mejor que el arreglo que yo habÃ­a hecho
>
> Mi primera pasada fue recortar solo los `media`/`dificil` y dejar enteras las faciles. El
> pedido fue otro: *"que funcione como los juegos splash â€” no mostrar la tapa entera sino
> un zoom alto como para que sea difÃ­cil"*. **Ninguna tapa se muestra entera**, y de paso
> el defecto muere solo: si el tÃ­tulo no entra en el recorte, no hay nada que leer.
>
> **Lo que escalona ahora es el lado del zoom, no si hay recorte:**
>
> | nivel | zoom | del master | quÃ© se ve |
> |---|---|---|---|
> | `facil` | 0,40 | ~381 px | un motivo entero â€” la multitud de *Oktubre*, el Ã³valo de *Luzbelito* |
> | `media` | 0,26 | ~248 px | una parte â€” el muÃ±eco con antifaz, las caras en la cÃºpula |
> | `dificil` | 0,22 | ~210 px | un rasgo suelto â€” los colmillos, un ojo verde, la olla |
>
> Los diez centros estÃ¡n mirados uno por uno contra el master: ninguno cae sobre el tÃ­tulo.
> Verificado a 375Ã—812 â€” los diez llegan 480Ã—480, se dibujan 326Ã—326, 32 px de scroll en
> toda la pantalla, sin errores de consola.
>
> ### ðŸ”´ Tres deudas declaradas, no tapadas
>
> 1. **`UX-05` no tiene esta forma.** El script dice *Â«Si cambia el catÃ¡logo, cambia esta
>    tabla â€” no al revÃ©sÂ»* y acÃ¡ fui al revÃ©s. Todo â€”zooms y centrosâ€” en
>    `Docs/SUGERENCIAS/HILO-para-experiencia-tapas-sin-titulo.md` para que `experiencia`
>    los adopte o los corrija.
> 2. **ReemplacÃ© una regla del contrato.** `tapa.schema.json` decÃ­a *`encuadre: "detalle"`
>    âŸ¹ `dificultad âˆˆ {media, dificil}`*, que codificaba el modelo viejo y **bloqueaba
>    justamente los tres faciles**. Ahora dice: `estado: "listo"` âŸ¹ `encuadre === "detalle"`.
>    Es mÃ¡s fuerte, y el `$comment` de la regla cuenta por quÃ©. Es de `arquitectura`.
> 3. **Esta forma agranda, y es la Ãºnica del script que lo hace.** Un `dificil` sale de
>    210 px a 480 y se ve blando. En un juego de zoom eso es el gÃ©nero â€” pero negarse a
>    agrandar habrÃ­a topeado en silencio cuÃ¡n fuerte podÃ­a ser el zoom.
>
> ### ðŸ”œ La pieza que falta, y es de `experiencia` + `arquitectura`
>
> **Mostrar la tapa entera al revelar**, que es el premio del formato splash: adivinÃ¡s por
> un pedazo y al acertar ves la obra. Hoy no se puede â€” `aPayload` manda una sola ruta.
> TambiÃ©n arreglarÃ­a que las explicaciones de `TP-002` y `TP-007`, que hablan del alfabeto
> del tÃ­tulo, quedaron seÃ±alando algo que ya no estÃ¡ en pantalla.

> ### âœ… EL BANCO DEL QUIZ PASÃ“ POR UNA AUDITORÃA DE FUGAS (2026-08-28)

> `npm test` **349/349** Â· `npm run check` limpio Â· guarda nueva en `src/lib/quiz/fugas.test.ts`.
>
> Lo levantÃ³ el usuario jugando, con dos ejemplos que alcanzaban: *"de quÃ© provincia del
> **norte** era"* con una sola provincia del norte entre las opciones, y *"tocÃ³ dos veces en
> **aÃ±os consecutivos**, una fue el 93"*, que deja 1992 y 1994 y nada mÃ¡s. La auditorÃ­a
> encontrÃ³ **catorce Ã­tems con fuga sobre cuarenta**, en seis formas distintas:
>
> | Forma | QuÃ© pasa | Ãtems |
> |---|---|---|
> | La pregunta nombra una clase y solo una opciÃ³n pertenece | Â«del norteÂ», Â«del EjÃ©rcitoÂ», Â«una mujerÂ», Â«del oesteÂ» | `QZ-018` `QZ-016` `QZ-022` `QZ-012` |
> | La pregunta define la respuesta | Â«el balneario mÃ¡s clÃ¡sico y masivoÂ» = Mar del Plata | `QZ-011` |
> | Eco entre el enunciado y una sola opciÃ³n | Â«detalle caninoÂ» â†’ jaurÃ­a Â· Â«el gatoÂ» â†’ gatos | `QZ-013` `QZ-028` `QZ-017` `QZ-015` |
> | Se elimina por lÃ³gica, sin saber el dato | tres distractores contradecÃ­an la premisa | `QZ-029` `QZ-020` |
> | Atajo que evita el dato preguntado | elegir el aÃ±o mÃ¡s nuevo Â· Â«aÃ±os consecutivosÂ» Â· Â«el anteÃºltimoÂ» | `QZ-024` `QZ-021` `QZ-026` |
> | Distractor muerto o correcta mÃ¡s especÃ­fica | Sony Music en 1985 Â· la Ãºnica con marca propia | `QZ-003` `QZ-030` `QZ-031` `QZ-014` `QZ-023` |
>
> ### ðŸ”´ Lo que no se veÃ­a leyendo un Ã­tem: la fuga entre Ã­tems
>
> **Nueve Ã­tems contestaban la pregunta de otro.** La explicaciÃ³n de `QZ-018` traÃ­a la cita
> con la que se responde `QZ-020`. El enunciado de `QZ-019` decÃ­a *Salta*, que es la
> respuesta de `QZ-018`. `QZ-005` cerraba con *Â«Momo Sampler (2000)Â»* y `QZ-006` pregunta
> justo ese aÃ±o. `QZ-007` decÃ­a *Â«dos aÃ±os despuÃ©s de OktubreÂ»* y `QZ-002` pregunta quÃ©
> disco es de 1986.
>
> Solo importa cuando `BR-01` puede servir al que regala **primero** â€” facil antes que
> media antes que dificil. Con ese filtro quedaban ocho pares reales y nueve menciones
> inocentes; los ocho se arreglaron y las nueve estÃ¡n en la lista blanca del test, cada una
> con el motivo escrito.
>
> ### ðŸ”´ El segundo hallazgo: el banco tenÃ­a un molinete cerrado
>
> **Diez de cuarenta Ã­tems solo los podÃ­a contestar quien leyÃ³ *Recuerdos que mienten un
> poco*, y dos de esos diez estaban en `facil`** â€” o sea, `BR-01` abrÃ­a la partida con
> ellos. Es exactamente el muro que `D-14` prohÃ­be, montado sin querer. AdemÃ¡s `historia`
> tenÃ­a cinco Ã­tems de memoir sobre diez, tres de ellos anÃ©cdotas de tapa de Rocambole:
> la categorÃ­a se habÃ­a vuelto Â«la del libroÂ» y no tenÃ­a **ni una pregunta sobre de dÃ³nde
> saliÃ³ la banda**.
>
> ### El reparto por nivel tambiÃ©n mentÃ­a
>
> | | Antes | Ahora |
> |---|---|---|
> | Faciles de `letras` | **0** de 10 (8 eran dificiles) | 2 |
> | Faciles que salÃ­an de `mitologia` | 5 de 10 â€” media partida abrÃ­a con una leyenda | 3 de 10 |
> | CategorÃ­as que podÃ­an abrir una partida | 3 de 4 | **4 de 4** |
> | Ãtems de memoir en `facil` | 2 | **0** |
>
> **Retirados tres, entran tres.** `QZ-027` (el muÃ±eco de MarilÃº) por `QZ-041`, la banda en
> La Plata y La CofradÃ­a de la Flor Solar. `QZ-034` porque su respuesta era Â«Todo un paloÂ»,
> igual que `QZ-038` â€” dos Ã­tems con la misma respuesta y el segundo sale gratis. `QZ-037`
> por ser el gemelo dÃ©bil de `QZ-029` (los dos, el sobre interno de *Oktubre*). Los tres
> quedan en el archivo como `retirado`, con el motivo en `notaInterna`.
>
> ### Lo que ahora se audita a mÃ¡quina â€” `src/lib/quiz/fugas.test.ts`
>
> Cinco guardas: fuga entre Ã­tems con lista blanca justificada Â· la correcta no es la mÃ¡s
> larga mÃ¡s seguido que el azar Â· dos opciones nunca dicen lo mismo Â· toda categorÃ­a tiene
> al menos dos faciles para poder abrir una partida Â· ningÃºn Ã­tem `facil` depende del
> memoir. **Lo que sigue sin poder auditarse es la fuga semÃ¡ntica dentro de un Ã­tem** â€”
> Â«de quÃ© provincia del norteÂ» con una sola del norte. Eso lo agarra el ojo, con la tabla
> de arriba como vara.
>
> ### ðŸ”œ Queda abierto, y no es mÃ­o
>
> 1. **`QZ-007` afirma que *Un baiÃ³n* saliÃ³ por Wormo y `RES-20` dice Del Cielito.** No lo
>    resolvÃ­: saquÃ© el sello del texto visible y dejÃ© la contradicciÃ³n anotada. Es de
>    `investigador`.
> 2. **`QZ-025` (Bulacio) mantiene su fuga a propÃ³sito.** La Corte Interamericana es la
>    Ãºnica de las cuatro que aplica a un caso argentino, asÃ­ que se acierta con civismo y
>    sin saber nada de la banda. No lo toquÃ© porque el Ã­tem es la copia literal del ejemplo
>    de `CNT-04`, que es decisiÃ³n editorial de `contenido`. La salida que la propia regla
>    habilita â€”preguntar cuÃ¡nto tardÃ³ la Justicia argentina, veinte aÃ±osâ€” la tiene que
>    elegir `contenido`, no yo.
> 3. **`adivinar-la-tapa` tiene el mismo problema sin auditar:** nueve de diez Ã­tems usan
>    la tapa entera, y casi todas las tapas traen el tÃ­tulo impreso. No lo mirÃ© a fondo.

> ### âœ… "SACALO POR LA LETRA" PASÃ“ POR SU CICLO ESTÃ‰TICO (`D-30`, `D-31`)
>
> `npm test` **344/344** Â· `npm run check` limpio Â· build de **150 pÃ¡ginas** Â· detector de
> diseÃ±o en cero.
>
> El anÃ¡lisis se hizo con seis crÃ­ticos independientes y un escÃ©ptico por dimensiÃ³n:
> **31 hallazgos sobrevivieron y 14 se cayeron refutados**, y cuatro de los tumbados eran
> ideas mÃ­as â€”agrandar el verso, dibujarle una barra al juego, mostrar los versos que
> faltaban al revelar, sacarle las mayÃºsculas al copyâ€”. Las cuatro las habÃ­a decidido
> `UX-08` en contra, con argumento escrito. Buena lecciÃ³n: **antes de "mejorar" una
> pantalla, leer si el rol dueÃ±o ya decidiÃ³ eso.**
>
> ### ðŸ”´ El hallazgo grande: la spec estaba escrita y sin construir
>
> `UX-08` Â§4 especificaba la hoja de versos con todas las letras â€”recorte pegado, borde
> completo, fondo elevado, esquina de estampa, filete por versoâ€” y en `juego.css` habÃ­a
> **tres propiedades de layout y ninguna de dibujo**. El juego se habÃ­a construido, el
> tablero decÃ­a âœ…, y la mitad visual de la pieza central no entrÃ³ nunca. EstÃ¡ en `D-31`.
>
> **Lo medido a 375Ã—812, antes y despuÃ©s:**
>
> | | Antes | Ahora |
> |---|---|---|
> | La hoja con **un** verso | 545 px de recorte casi vacÃ­o | 63 px, y crece a 106 â†’ 216 â†’ 385 |
> | Scroll durante la partida | 945 px contra 812 de ventana | 812 exactos |
> | Salto horizontal al empezar | 7 px (el desborde invocaba la barra) | 0 |
> | **Al revelar, los versos** | se aplastaban de 515 px a **59** | quedan enteros |
> | **El buscador al revelar** | vivo, 174 px arriba de la respuesta | escondido y apagado |
> | Contraste del botÃ³n principal | **3,66:1** (usaba un token `-apoyo`) | 13,29:1 |
> | Colores de tapa que usaba | uno, y en el borde de otro disco | los diez, por tema |
>
> ### Tres agujeros que la mediciÃ³n encontrÃ³ y el ojo no
>
> 1. **RepuntuaciÃ³n.** Al acertar, el buscador quedaba vivo con el tema correcto todavÃ­a
>    elegido: otro toque en `ArriesgÃ¡` **volvÃ­a a sumar cien puntos** y apilaba un segundo
>    panel. Por el otro camino â€”agotar los intentosâ€” pasaba lo mismo con `PasÃ¡`.
> 2. **`chips.hidden` no escondÃ­a nada**: `.chips` declara `display: flex` y le gana al
>    atributo. Una lista vacÃ­a se llevaba su renglÃ³n en el tablero que pelea el espacio por
>    pÃ­xel. Ahora hay un test que exige la regla `[hidden]` a todo lo que declare `display`.
> 3. **Cuatro cadenas visibles escritas a mano en la isla**, fuera de todo auditor â€” el
>    mismo defecto que dejÃ³ `"Link copiado."` tres ciclos en producciÃ³n. Una de ellas,
>    `"Borrar lo escrito"`, en infinitivo y en los dos juegos: solo la lee quien no ve la
>    pantalla, asÃ­ que nadie la habÃ­a mirado nunca. Ya hay test que lo caza.
>
> ### Lo que NO se hizo, y por quÃ©
>
> **No se portÃ³ el reloj** (`D-30`). El hermano se escucha y Ã©ste se lee: en el cuarto
> escalÃ³n hay que leer ocho versos, asÃ­ que un cronÃ³metro mide velocidad de lectura y
> castiga al lector lento por leer. El nÃºmero grande son **los versos que gastaste**, que
> es la moneda de `BR-20` y el equivalente exacto del "cuÃ¡nto audio te hizo falta".
>
> **No se generÃ³ `momo-medallon.jpg`.** De las cuatro piezas que un fondo de tapa necesita
> (el jpg, la regla `.tapa-fondo--*` con su velo, la entrada en `DISCO_DE` y el
> `position: relative`), esta pÃ¡gina tenÃ­a **solo el nombre**: se sacÃ³ el cableado muerto.
> Poner la tapa sin las otras tres deja una tapa sin firma, contra la condiciÃ³n 1 de `D-21`.
>
> **La tarjeta compartible ahora es compartida** por los dos juegos (`lib/tarjeta/plan.ts`),
> y no sabe de quÃ© juego es: recibe el nombre, el token que lo viste y un nÃºmero grande con
> su rÃ³tulo. AcÃ¡ ese nÃºmero son versos; allÃ¡, minutos.
>
> ### Dos cosas que quedan abiertas y no son mÃ­as
>
> - **El `h1` del quiz tiene diez palabras** (*"EntrÃ¡ a jugar con los Redondos, sepas lo
>   que sepas."*) y la regla de las ocho es de `voz-ricotera.md`. No lo toquÃ©: es copy de
>   otro juego y decisiÃ³n de `producto`. Por eso `voz.test.ts` **todavÃ­a no audita los
>   tÃ­tulos de portada** â€” cerrar ese hueco rompe el build hasta que esa lÃ­nea se recorte.
> - **Un verso del banco viene corrupto**: *"Pintan mal las cosas para ,l mi viejo"* sale
>   asÃ­ desde `cancionero.json` (`maldicion-va-a-ser-un-dia-hermoso`). Es 1 de 712 y tiene
>   dueÃ±o y mecanismo â€” la vÃ­a de correcciÃ³n de `D-25`.
>
> Los dos quedaron pedidos en `Docs/SUGERENCIAS/HILO-para-producto-y-contenido-huecos-US-07.md`.

> ### âœ… "ADIVINÃ EL TEMA" PASÃ“ POR LA PULIDA ESTÃ‰TICA, Y ENTRÃ“ EL RELOJ (`D-28`)
>
> `npm test` **334/334** Â· `npm run check` limpio Â· build de **150 pÃ¡ginas** Â· detector de
> diseÃ±o en cero.
>
> El usuario pidiÃ³ *"un ciclo completamente estÃ©tico"* sobre `US-02` y, adentro del mismo
> pedido, algo que no es estÃ©tico: **"mÃ¡s que el puntaje es importante y divertido saber en
> cuÃ¡nto tiempo y quÃ© temas adivinÃ³"**. Las tres bifurcaciones se consultaron y eligiÃ³ las
> tres recomendadas: reloj callado, tarjeta vertical, revelaciÃ³n con el color del disco.
>
> **Lo que se midiÃ³ antes de tocar nada, a 375Ã—812**, porque el diagnÃ³stico a ojo se
> equivoca:
>
> | | Antes | Ahora |
> |---|---|---|
> | Los seis renglones de intento, vacÃ­os | **192 px** (24% de la pantalla) | 58 px |
> | DÃ³nde caÃ­a la revelaciÃ³n | y=489, con la hoja en 963 | y=301, y entra en el pliegue |
> | Alto de la hoja en escritorio | 32 px de scroll que no llevaban a nada | 900 exactos |
> | Colores de tapa usados por este juego | **cero de diez** | los diez |
>
> **Los cuatro cambios que valen:**
>
> 1. **El tema revelado viste la tinta real de su disco.** Los diez valores de `RES-37` ya
>    estaban en `tokens.css`, pasaban AA y este juego no usaba ninguno. Ahora Oktubre se
>    revela en rojo Oktubre. No contradice `D-19` â€”la base no rota, la secciÃ³n sigue siendo
>    Lobo sueltoâ€”, es el precedente del cancionero llevado acÃ¡.
> 2. **La barra es una regla graduada.** La escalera se anunciaba de a un escalÃ³n por vez,
>    asÃ­ que su forma no se veÃ­a: para saber que despuÃ©s de 0,1 vienen 0,5, 2, 4, 8 y 10
>    habÃ­a que gastarlos. Ahora los nÃºmeros estÃ¡n escritos abajo de sus tramos â€” los cuatro
>    que tienen lugar, y quiÃ©n tiene lugar lo decide `tramosConEtiqueta()`, que estÃ¡ testeado.
> 3. **El reloj**, con dos reglas que lo hacen honesto: para con la pestaÃ±a escondida, y
>    mide el tema y no la ficha. Doce pruebas en `reloj.ts`.
> 4. **La tarjeta compartible**, 1080Ã—1350, dibujada en canvas con las letras reales del
>    sitio y los colores leÃ­dos de `tokens.css` â€” cero hex nuevos. El plan vive en
>    `lib/tema/tarjeta.ts` con test; el pincel, en `scripts/tarjeta-tema.ts`.
>
> ### ðŸ”´ Y un defecto mÃ­o que ningÃºn test podÃ­a ver â€” `D-29`
>
> `paleta.ts` importÃ³ la lista de discos de `letra/temas.ts`, que **importa `node:fs`**. En
> el navegador la isla muere entera: la portada queda dibujada y no responde a un solo toque.
>
> **Pasaron los tres controles.** `npm test` (en Node existe `fs`), `npm run check` (los
> tipos estaban bien) y `npm run build` (la pÃ¡gina es estÃ¡tica y sale igual). Lo agarrÃ³
> abrir la pÃ¡gina.
>
> Ahora hay `src/lib/islas.test.ts`: recorre el grafo de importaciones desde cada archivo de
> `src/scripts/` y falla si en el camino aparece un `node:*`. **No mira el archivo, mira todo
> lo que alcanza** â€” `paleta.ts` no tenÃ­a una lÃ­nea de Node y sin embargo lo traÃ­a. De paso
> encontrÃ³ que hay que exceptuar los `import type`, o acusa a `completar-la-letra` de algo
> que no hace: *un guardiÃ¡n que grita por algo que no pasa se termina apagando.*
>
> **Queda pedido a `producto`:** `Docs/SUGERENCIAS/HILO-para-producto-reloj-y-tarjeta-US-02.md`
> â€” los criterios de `US-02` no nombran el tiempo, y hoy el juego lo mide y lo comparte.

> ### `D-27` â€” la dificultad sale de las escuchas, no de una etiqueta a mano
>
> Cerrando `FIND-29`, la salida obvia era pedirle a `contenido` **89 juicios a mano** de
> "quÃ© tan conocido es este tema". El usuario eligiÃ³ la otra: **inferirla de la
> popularidad**, con los temas sin escucha como `dificil`.
>
> No es una idea nueva del proyecto â€” `BR-18` (f) ya habÃ­a hecho esto para `US-02`, porque
> una etiqueta manual de "quÃ© tan conocido es" se corrompe sola. Y acÃ¡ encaja mejor que
> allÃ¡: en este juego **"quÃ© tan conocido es el tema" no es un proxy de la dificultad, es
> la dificultad**.
>
> **ðŸ”´ Y lo que produce hoy hay que decirlo: los 89 quedaron en `dificil`.**
> `popularidad.json` tiene los 105 temas en `sin-video` y **cero mediciones** â€” la clave de
> YouTube nunca se cargÃ³. AsÃ­ que el juego **sigue sin escalonar**.
>
> La diferencia con antes no es de funcionamiento, es de honestidad: antes el barajado era
> **accidental** (nadie habÃ­a conectado la dificultad) y ahora es la **consecuencia
> declarada** de que falta un dato. El generador lo grita en cada corrida en vez de dejar
> que el tablero diga âœ….
>
> **Un comando lo prende, y destraba `US-02` y `US-07` de una sola vez:**
> `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`

> ### ðŸ”´ `REV-08`: cuatro hallazgos bloqueantes, y cÃ³mo verificar mal
>
> **La revisiÃ³n encontrÃ³ lo que la verificaciÃ³n no, por tercer ciclo seguido y por el mismo
> motivo**: el defecto no estaba en ningÃºn Ã­tem, estaba en el conjunto. EstÃ¡ en `REV-08`,
> `FIND-29`..`FIND-33`. Los cuatro bloqueantes estÃ¡n arreglados.
>
> **`FIND-29` â€” el peor.** *"Sacalo por la letra"* repartÃ­a la ronda con `barajar(banco)`
> sobre los 89 temas, **sin mirar `dificultad` en ningÃºn punto del archivo**. El que llega
> sin saber nada podÃ­a recibir el tema mÃ¡s oscuro del catÃ¡logo como primera pregunta: el
> muro de entrada exacto que `D-09` y `BR-01` existen para impedir, en un juego que el
> tablero ya daba por cumplido. Ahora escalona; mientras `contenido` no cargue la curadurÃ­a
> de `CTR-09.7`, degrada a barajado **declarado** en vez de accidental.
>
> **`FIND-30` y `FIND-31` â€” el filtro dejaba pasar cifra como verso.** Mi regla pedÃ­a que
> **todas** las palabras fueran acordes, y una sola palabra suelta salvaba el renglÃ³n. Seis
> vueltas de endurecimiento contra el corpus real (`VERSION_FILTRO` 1 â†’ 6).
>
> ### ðŸ”´ La lecciÃ³n, que vale mÃ¡s que el arreglo: verifiquÃ© el filtro contra sÃ­ mismo
>
> CorrÃ­ `motivoDescarteVerso()` sobre un banco que **ese mismo filtro habÃ­a generado** y me
> dio cero ruido â€” obviamente. ReciÃ©n una auditorÃ­a con un heurÃ­stico **independiente**
> encontrÃ³ seis patrones mÃ¡s. **Toda verificaciÃ³n de contenido generado tiene que hacerse
> con un mÃ©todo distinto del que generÃ³**, o no verifica nada.
>
> Y en el camino casi me como un pedazo del cancionero: la regla "acorde + palabra de
> estructura" mataba *"Mi bajo continuo suena mal"* y *"Toco la guitarra en el balcÃ³n"* â€”
> porque **`Mi` y `La` son a la vez acordes y palabras corrientes**. Por eso las listas
> quedaron partidas en dura y blanda.
>
> **`FIND-32`** â€” el botÃ³n de correcciÃ³n faltaba en el quiz, el juego con mÃ¡s Ã­tems del
> sitio. `BR-21` lo pedÃ­a en los tres. Ya estÃ¡.
>
> **Y un defecto mÃ­o que la revisiÃ³n no vio:** la selecciÃ³n de `T-138` **no tenÃ­a el
> guardiÃ¡n de anclas** que sÃ­ tenÃ­an las confirmaciones de oÃ­do. Los ids son posicionales,
> asÃ­ que cada endurecimiento del filtro los corre y la curadurÃ­a se mudarÃ­a sola a versos
> que nadie eligiÃ³ â€” y bajo `D-25` esos Ã­tems van **directo a la pantalla sin cotejar**.
> Ahora cada selecciÃ³n lleva su verso como ancla y el generador aborta si no coincide.
> **DisparÃ³ tres veces durante esta tanda**, que es exactamente lo que tenÃ­a que hacer.
>
> âš  **Lo que queda estructural, para el prÃ³ximo ciclo:** los ids posicionales (`CL-NNN`)
> hacen que cada cambio de filtro invalide la curadurÃ­a entera. La curadurÃ­a es sobre el
> **verso**, no sobre el id. Un id derivado del contenido lo cerrarÃ­a de raÃ­z.

> ### âœ… ESCRITORIO (`UX-10`): el defecto no era el ancho
>
> MedÃ­ el sitio a 1440 px antes de pedirle nada a `experiencia`, y el diagnÃ³stico
> intuitivo estaba mal en las dos puntas: **el portal no tenÃ­a el problema** (su grilla
> llenaba en dos columnas) y **la Redondopedia ya estaba bien** (66 caracteres por lÃ­nea,
> dentro del rango cÃ³modo). Lo que sÃ­ era cierto: el contenido y los juegos quedaban en
> una tira de **544 px con 448 px de vacÃ­o a cada lado**.
>
> **Y `UX-10` encontrÃ³ el defecto de verdad, que no era de tamaÃ±o:** *ningÃºn elemento
> clicable del sitio tenÃ­a `:hover`.* Con mouse, la Ãºnica seÃ±al de que algo era un botÃ³n
> era hacer clic y ver quÃ© pasaba.
>
> **Dos cortes, separados a propÃ³sito:** uno de **ancho** (46rem â€” un valor que
> `cancionero.css` ya tenÃ­a escrito e inerte, tapado por el tope de afuera) y otro de
> **capacidad** (`hover: hover and pointer: fine`), porque lo que falta saber es si hay
> mouse, no si la pantalla es angosta.
>
> Verificado: el cancionero y el portal ensanchan a **736 px** (dos columnas de 360 en vez
> de 264), el artÃ­culo y el tablero de juego se quedan en 34rem **con fundamento** â€”el uno
> protege la medida de lÃ­nea, el otro ya estÃ¡ calibrado y agrandarlo solo agrega recorrido
> de mouseâ€”, y **el celular no se moviÃ³**: una columna de 343 px, sin desborde.
>
> De paso saliÃ³ una asimetrÃ­a: `completar-la-letra` y `adivinar-por-la-letra` **no tenÃ­an
> ningÃºn `max-width`**, mientras los otros cuatro juegos lo repetÃ­an a mano. Ahora es una
> sola regla en `.pantalla`.

> ### âœ… EL BOTÃ“N DE CORRECCIÃ“N, Y DOS DEFECTOS QUE APARECIERON MIDIENDO (2026-08-27)
>
> `npm test` **276/276** Â· `npm run check` limpio Â· build de **149 pÃ¡ginas**.
>
> **El frente D cerrÃ³.** `CTR-10` (payload de once campos, dos transportes detrÃ¡s de una
> interfaz), `CNT-12` (todo registro 3), `UX-09` (dÃ³nde vive) y el componente enganchado
> en `US-03` y `US-07`.
>
> **Lo que protege el diseÃ±o, y se audita a mÃ¡quina:** `src/lib/correccion/armar.ts` **no
> puede tocar el navegador** â€”ni `navigator`, ni `Date`, ni `location`â€” y hay un test que
> **lee el fuente** para comprobarlo. `BR-21` fija que al que corrige no se le pide nada, y
> un mÃ³dulo que no puede leer el navegador no puede filtrarlo ni por accidente. El
> renderizador es lista blanca, no un recorrido del objeto: un campo de mÃ¡s no se imprime.
> Verificado jugando: el mensaje sale completo y accionable, **sin una sola traza de la
> persona**.
>
> **Sin casilla configurada el mail no existe** â€”ni botÃ³n muerto, ni `mailto:` hacia
> ningÃºn ladoâ€” y la cadena termina siempre en el texto a la vista, que no puede fallar.
> Nadie queda sin poder corregir (`D-14`). Prenderlo es una lÃ­nea en `destino.ts`.
>
> ### ðŸ”´ Los dos defectos que aparecieron midiendo, no leyendo
>
> 1. **En "Sacalo por la letra", el buscador caÃ­a 16 px abajo del pliegue** a 375Ã—812 con
>    los 8 versos del Ãºltimo escalÃ³n â€” justo lo que las tres franjas de `UX-08` existen para
>    evitar. Eran el `padding` del `body`, y `min-height` dejaba crecer la columna en vez de
>    obligar a la hoja a scrollear. Ahora cierra en 812 exacto.
> 2. **`"Link copiado."` llevaba tres ciclos en producciÃ³n** en el quiz, escondido del
>    auditor de voz **por estar escrito a mano en la isla en vez de en un `copy.ts`**.
>    `D-17` veta ese anglicismo. El auditor lo cazÃ³ reciÃ©n cuando sumÃ© los mÃ³dulos nuevos.
>    *La lecciÃ³n, para el prÃ³ximo: una cadena visible fuera de un `copy.ts` es una cadena
>    que nadie audita.*
>
> ### La decisiÃ³n del lobo, resuelta en contra de ponerlo
>
> `UX-12` cerrÃ³ lo que yo habÃ­a frenado, y con un argumento mejor que el mÃ­o: **`D-19`
> gobierna paleta y letra grande por secciÃ³n, no quÃ© personaje suelto acompaÃ±a la
> pantalla** â€” eso es `UX-04`, anterior a la mezcla. Y el perro estÃ¡ fichado (`RES-06`,
> `RES-22`) como **transversal a toda la obra**, no como propiedad de *Un baiÃ³n*; de hecho
> `STICKER_DISCO` le asigna a ese disco el muÃ±eco, no el perro. **El lobo se queda donde
> estÃ¡ y no hizo falta tocar cÃ³digo.**

> ### âœ… LA v1 CUMPLE SUS CINCO PISOS (2026-08-27)
>
> `npm test` **264/264** Â· `npm run check` limpio Â· build de **149 pÃ¡ginas**.
>
> | Historia | Piso | Hoy | |
> |---|---|---|---|
> | `US-01` Quiz *(ahora por vidas)* | 40 | **40** | âœ… |
> | `US-02` AdivinÃ¡ el tema *(audio)* | 30 | **95** | âœ… |
> | `US-03` CompletÃ¡ la letra | 15 | **21** | âœ… |
> | `US-04` AdivinÃ¡ la tapa | 10 | **10** | âœ… |
> | `US-05` Redondopedia | 35 | **35** | âœ… |
> | `US-06` Dos ejes *(fuera de v1)* | â€” | 28 | âœ… |
> | `US-07` Sacalo por la letra *(nuevo, fuera de v1)* | 60 | **89** | âœ… |
>
> **Lo que destrabÃ³ el audio.** El PR #8 trajo 95 fragmentos recortados a mano; se
> renombraron al slug canÃ³nico y `scripts/ingerir-fragmentos.mjs` escribiÃ³ el manifiesto
> **sin ffmpeg**, midiendo la duraciÃ³n en los frames del mp3. `D-26` bajÃ³ el Ãºltimo paso
> de la escalera de 15 s a 10 â€” no era opinable: `catalogo.ts` rechaza el manifiesto si un
> fragmento dura menos que el escalÃ³n mÃ¡s caro. Entre prometer 15 y reproducir 10, o
> prometer 10 y cumplir, gana la que no miente.
>
> **Lo que destrabÃ³ las letras.** `CTR-04` pasÃ³ a v2 en una sola corrida (schema,
> `banco.ts`, tests y generador): `cotejo` con tres regÃ­menes excluyentes, cada uno
> verificado contra su evidencia. Lo que quedÃ³ estricto ya no es la verificaciÃ³n sino **el
> rastro**: por quÃ© vÃ­a estÃ¡ `listo` cada Ã­tem, sin que un rÃ©gimen se pueda disfrazar de
> otro. `T-138` eligiÃ³ 21 versos de bajo riesgo y el panel muestra **quiÃ©n transcribiÃ³ el
> verso, con su enlace** â€” el mecanismo de "lo veo jugando" de `D-25`.
>
> **`US-07` naciÃ³ entero:** `CNT-11` como filtro corrible (`filtro.ts`, 10 tests con los
> patrones de ruido reales del corpus), la escalera 1/2/4/8, el generador (93 de 104
> temas; los 11 que faltan quedan afuera **con el motivo escrito**) y la pÃ¡gina, que viste
> Momo Sampler. **744 versos y ninguno delata su tÃ­tulo** â€” verificado sobre el banco.
>
> **Verificado jugando, no deducido:** el quiz por vidas hasta perder y retirÃ¡ndose;
> "Queso ruso" acertado con 0,1 s de audio; "den la [alarma]" de *Vencedores vencidos*;
> y "Drogocop" sacado en el paso 4 con la escalera duplicando 1â†’2â†’4â†’8.
>
> ### ðŸ”œ Para retomar
>
> Queda el **frente E** (`T-157`..`T-160`): la pulida de escritorio y la regla de que todo
> Ã­cono de repuesto termine siendo un recorte real. MÃ¡s `T-146` (`REV-08`, la revisiÃ³n del
> ciclo) y `T-147`.
>
> **Tres cosas esperan al usuario:**
> 1. **Una casilla de correo** para el botÃ³n de correcciÃ³n (`T-153`, sin empezar).
> 2. **Si el lobo va al casete de la Redondopedia**, pisando la mezcla `D-19`.
> 3. **El arte de Momo Sampler** (`momo-medallon`): no existe, y la pantalla de `US-07`
>    se pinta igual solo con el color â€” `UX-08` dejÃ³ el brief pedido.

> ### âœ… TRAMO A CERRADO (2026-08-25) â€” el quiz ya se juega por vidas
>
> **Diez tareas hechas y verificadas.** `npm test` **251/251** (eran 224), `npm run check`
> 0 errores, build de **148 pÃ¡ginas**, y la partida jugada entera en el navegador.
>
> | Tarea | QuÃ© quedÃ³ |
> |---|---|
> | `T-128` | **`D-25`**: `US-03` sale con letras de fuente Ãºnica. La decisiÃ³n escrita, con sus tres mitigaciones y quÃ© la revierte |
> | `T-129` | **`BR-19`**: 3 vidas Â· escalÃ³n por pozo (10/15/15, **no** 10/10/10) Â· tres desenlaces |
> | `T-130` | **`US-07` + `BR-20`**: "Sacalo por la letra", escalera 1/2/4/8 versos, piso **60**, fuera del "Listo" de la v1 |
> | `T-132` | **`ADR-02` v2**: tres formas de link (`marcador`/`recorrido`/`identidad`). Salda la deuda de `dos-ejes` |
> | `T-134` | **`UX-07`**: vidas, escalÃ³n y retirada en pantalla. NingÃºn par de color nuevo |
> | `T-136` | **`CNT-10`**: los tres encabezados comparten la imagen de la vida como luz |
> | `T-142` | **`vidas.ts`** + 22 tests. **Aditivo: `ronda.ts` y `tramo.ts` intactos** |
> | `T-143` | La isla del quiz. Arregla `FIND-28` |
> | `T-149` | **`BR-21`**: el sitio promete solo lo que puede verificar con un comando |
> | `T-155` | **`IDEA-13`**: Supabase separado en tres, con el choque contra `D-14` nombrado |
>
> **Verificado jugando, no deducido:** derrota (`DERROTA` Â· "Se te apagaron las tres
> vidas." Â· "Pregunta 3 de 40 Â· nivel FÃ¡cil"), retirada (`RETIRADA` Â· "Pregunta 12 de 40" Â·
> "Vidas al cerrar: 3 de 3"), y el aviso `NIVEL MEDIA` apareciendo **una sola vez**, en la
> pregunta 11.
>
> ### ðŸ”´ `FIND-28` â€” un defecto vivo que se encontrÃ³ y se arreglÃ³ en el mismo ciclo
>
> `leerDesafio()` devolvÃ­a el campo `g` y **el quiz nunca lo miraba**. Reproducido en el
> navegador: `/quiz/?g=tapa&p=10&t=10&n=Fulano` pintaba *"Fulano sacÃ³ 10/10"* â€” desafÃ­o de
> otro juego, puntaje imposible en una ronda de 8. **Estaba en producciÃ³n.** Arreglado en la
> firma (`leerDesafio(query, juegoPropio)`, segundo parÃ¡metro obligatorio) para que la clase
> entera de bug sea imposible, no improbable.
>
> De paso saliÃ³ otra: el tuit de `US-02` decÃ­a "160 de 400" y su propio link "3 de 4". El
> tope de `t` subiÃ³ de 100 a 9999 y ahora los dos dicen lo mismo.
>
> ### ðŸ”œ Para retomar: el tramo B, entero
>
> `T-131` `T-133` `T-135` `T-137` `T-138` `T-139` `T-140` `T-141` `T-144` `T-145`, mÃ¡s
> `T-146` (`REV-08`), `T-147` (`ESTADO.md`) y el frente E (`T-157`..`T-160`, escritorio).
> **Empezar por `T-131`** (`arquitectura`, `CTR-04`), que es la que destraba `US-03`.
>
> **Dos cosas que esperan al usuario, ninguna urgente:**
> 1. **Una casilla de correo** para el botÃ³n de correcciÃ³n (`T-153`). El repo no tiene
>    ninguna, y poner un Gmail personal en un `mailto:` de un sitio pÃºblico es entregÃ¡rselo
>    a los raspadores de spam.
> 2. **Si el lobo va igual al casete de la Redondopedia.** Se frenÃ³ porque ese casete es
>    `variante: 'historia'` y por `D-19` viste *Gulp!*; el lobo es de *Lobo suelto*. AdemÃ¡s
>    el perro que estÃ¡ hoy es un personaje fichado de *Un baiÃ³n*. Queda en `T-160`.

> ### `T-134` cerrada â€” `UX-07`, cÃ³mo se ven las tres vidas y el escalÃ³n
>
> `Docs/UX/UX-07-quiz-por-vidas.md` (nuevo). Sobre `BR-19`: cabecera con vidas (tres
> sellos lleno/tachado + "VIDAS", tinta compartida con el error `--acento-4` a propÃ³sito
> â€” es la Ãºnica causa posible de perder una) y etiqueta ambiente de nivel ("MEDIA Â·
> 4/15", reemplaza el viejo "N de 8"); aviso puntual de escalÃ³n una sola vez por salto
> (borde `--acento-2`, arriba del enunciado, sin pantalla nueva); botÃ³n de retirada fijo
> en una esquina superior, lejos del pulgar, con confirmaciÃ³n de dos pasos que muestra
> "hasta dÃ³nde llegaste" antes de decidir; tres pantallas de resultado (victoria
> `--acento-3`/âœ”, derrota `--acento-4`/âœ•, retirada `--acento`, sin sÃ­mbolo, Ãºnica con el
> widget de vidas). **NingÃºn par de color nuevo** para `contraste.test.ts`: todo reusa
> tokens ya testeados. Deja pendiente para quien la retome: `UX-01` queda con su secciÃ³n
> de "N de 8" y el tramo de tres niveles desactualizada para el quiz (sigue vigente para
> `US-04`) â€” no se editÃ³ por estar fuera del alcance de `T-134`.
>
> **Siguiente para este frente:** `T-136` (`contenido`, `CNT-10`, el texto exacto de todo
> lo nuevo) y `T-132` (`arquitectura`, `ADR-02`, el payload del link para los tres
> desenlaces) â€” las dos ya pueden arrancar. `T-143` (hilo principal, la isla del quiz
> pasa a vidas) espera a `T-142`, `T-134` (esta), `T-136` y `T-132`.

> ### ðŸš€ El sitio estÃ¡ desplegado
>
> Lo confirmÃ³ el usuario el 2026-08-25. **Cada cambio del ciclo 9 sale a la calle**, el
> quiz que pasa a vidas incluido. Deja de haber red.
>
> ### Lo que el ciclo 9 va a hacer, y lo que no
>
> Tres pedidos del usuario en una frase, y **tres decisiones suyas** que los acotan:
>
> 1. **`US-07` â€” adivinÃ¡ el tema por la letra.** Juego nuevo. El usuario eligiÃ³ que
>    **conviva** con el de audio en vez de reemplazarlo, asÃ­ que **`US-02` sigue en 0/30 y
>    la v1 no cierra en este ciclo**. Queda a un solo juego, y ese juego necesita ffmpeg.
> 2. **`US-03` sale entero, con fuente Ãºnica.** El candado de `CTR-04` (dos fuentes o
>    confirmaciÃ³n de oÃ­do) se abre por decisiÃ³n del usuario: *"salen con los temas que ya
>    tenemos, si hay que cambiar algo lo veo jugando el juego"*. Se toma por escrito en
>    `D-25`, con los versos de menor riesgo (`T-138`) y con la fuente a la vista del
>    jugador (`T-145`), que es el mecanismo de "lo veo jugando".
> 3. **El quiz pasa a 3 vidas**, con escalÃ³n cada 10 preguntas, se queda en difÃ­cil al
>    acabarse los niveles, y ganÃ¡s si agotÃ¡s el banco.
> 4. **Un botÃ³n para corregir** en los tres juegos, como componente compartido porque se
>    expande a todo el sitio. Ver el frente D mÃ¡s abajo.
>
> ### ðŸ”´ Lo que medÃ­ al planificar, y cambia lo que se puede prometer
>
> - **Solapamiento cero entre fuentes de letra.** Cada tema tiene **una sola** fuente
>   (cifraclub 78 Â· lacuerda 21 Â· letras.com 5) y los 149 archivos crudos de
>   `TemasRedo/cancionero/data` son **uno por tema**. La vÃ­a "dos fuentes" de `CTR-04` no
>   estaba difÃ­cil: estaba **cerrada**. Por eso hizo falta `D-25`.
> - **El banco tiene exactamente 10 fÃ¡ciles**, y el escalÃ³n que pidiÃ³ el usuario dura 10
>   preguntas. Sin cambiar nada, **toda partida mostrarÃ­a el banco entero de fÃ¡ciles** â€”
>   la "vidriera fija" que `BR-01` punto 3 existe para impedir, y que el ciclo 7 ya tuvo
>   que arreglar una vez. Lo cierra `producto` en `T-129`.
> - **`armarRonda` lo comparten los cuatro juegos** (quiz, tapa, letra, tema). La mÃ¡quina
>   de vidas es **aditiva** (`src/lib/quiz/vidas.ts`): quien edite `ronda.ts` rompe tres
>   juegos que hoy andan.
>
> ### ðŸ†• El cuarto pedido: el botÃ³n de correcciÃ³n (frente D)
>
> *"agreguemos un boton o algo como para dejar un comentario para corregir... es mas como
> para construir conocimiento entre todos. Esto para estos juegos pero se expandira a todo
> el sitio"*. **Es la pieza que le faltaba a `D-25`**: `US-03` sale con fuente Ãºnica, y el
> usuario dijo que lo iba a validar jugando. Esto le da con quÃ©.
>
> **El transporte cambiÃ³ a mitad de la planificaciÃ³n y manda la segunda versiÃ³n:** *"la idea
> no es que se vea la correccion primero, sino que nos llegue a nosotros, luego se podria
> extender con una base de datos gratis de supabase"*. AsÃ­ que **no va por issue de GitHub**
> â€”eso costaba abrir el repo y exigir cuenta, dos costos que se pagaban para que *se viera*â€”
> sino por mail y portapapeles: cero infraestructura, cero cuenta, molinete abierto.
> **`T-148` quedÃ³ `[CANCELADO]`** por eso.
>
> **`CTR-10` deja el transporte detrÃ¡s de una interfaz**, asÃ­ que el salto a Supabase no va a
> tocar el botÃ³n. La propuesta de alcance de ese salto estÃ¡ en
> `Docs/SUGERENCIAS/HILO-para-producto-supabase-scores-y-correcciones.md` y **no es menor**:
> *puntajes* y *jugadores* son ranking global y cuentas de usuario, las dos en Fuera de
> alcance y las dos rozando `D-14`. Queda como `IDEA-13` (`T-155`), sin empezar.
>
> ### ðŸŸ¢ Medido de paso: el repo es privado, y abrirlo no expondrÃ­a nada nuevo
>
> `gh repo view` â†’ `PRIVATE`, con issues habilitados. El `.gitignore` ya excluye `*.pdf`,
> `*.epub`, `*.wav` y `*.mp3`, asÃ­ que **el memoir del Indio no estÃ¡ versionado**. Lo que sÃ­
> estÃ¡ â€”71 tapas y el corpus de letrasâ€” **ya lo publica el sitio desplegado**. Queda medido
> para cuando haga falta.
>
> ### El riesgo del ciclo
>
> **`US-03` y `US-07` salen del mismo corpus de fuente Ãºnica, y no corren el mismo
> riesgo.** En `US-03` el jugador escribe la palabra que falta: si la transcripciÃ³n estÃ¡
> mal, **el juego le marca error al que se sabe el tema**. En `US-07` adivina cuÃ¡l es el
> tema, y una palabra mal no cambia de quÃ© tema se trata. Por eso uno sale sin discusiÃ³n y
> el otro sale con `D-25` encima.

---

**Ciclo 8 â€” CERRADO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-8.md`, tareas
`T-113`..`T-127`. `npm test` **224/224**, `npm run check` 0 errores, build de **148
pÃ¡ginas**. Dos pedidos del usuario en la misma frase, y uno de los dos se cayÃ³.

> ### El quinto juego se juega: `/juegos/dos-ejes/`
>
> **"Â¿QuÃ© tipo de ricotero sos?"** â€” `IDEA-09` promovida a `US-06` (`T-115`) con los ejes
> que fijÃ³ el usuario: `luz â†” oscuridad` y `orden â†” caos`. Diez preguntas, cuatro
> cuadrantes, **una identidad y ningÃºn puntaje**. Verificado jugÃ¡ndolo a 375Ã—812: sirve las
> diez, el rombo pinta, el punto cae en la cara correcta, y **no hay un solo dÃ­gito en la
> pantalla de resultado**.
>
> **`US-06` queda fuera del "Listo" de la v1**, y lo decidiÃ³ `producto` con argumento:
> `D-05` fijÃ³ cuatro juegos en el kickoff y no se redefine el contrato porque apareciÃ³ una
> quinta idea buena. Entra al sitio igual, como la Redondopedia.
>
> ### ðŸ”´ Spotify estÃ¡ cerrado, y no por dificultad tÃ©cnica
>
> `RES-51` (`INV-25`) lo cierra en negativo, en tres escalones: **el nÃºmero de
> reproducciones nunca existiÃ³** en la API pÃºblica; el Ã­ndice `popularity` que sÃ­ existÃ­a
> **lo removieron en febrero de 2026**; y la Ãºnica modalidad que lo conserva exige
> organizaciÃ³n legal registrada y **250.000 usuarios activos por mes**. No hay frase que el
> sitio pueda escribir con un nÃºmero de Spotify, porque no hay nÃºmero.
>
> **YouTube sÃ­** (`RES-52`, `INV-26`), y mejor de lo esperado: hay canal Topic, y los
> tÃ©rminos **autorizan explÃ­citamente** guardar y mostrar el conteo (Developer Policies
> III.E.4) a cambio de mantenerlo fresco y atribuir. `BR-18` fijÃ³ quÃ© se promete: **el
> orden, no la cifra**, refresco cada 180 dÃ­as, y nunca sumar YouTube con Spotify.
>
> **Falta la clave**, y es lo Ãºnico que falta de este frente:
> `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`. Sin clave el script no falla:
> deja los 105 temas declarados y dice el comando.
>
> ### Lo que este ciclo le dio a la v1, que es una sola cosa y estaba trabada
>
> `BR-18` (f) cerrÃ³ el hueco que el ciclo 7 dejÃ³ abierto: **"fÃ¡cil" en `US-02` pasa a ser el
> top-8 del ranking de YouTube**, no un campo manual ni un umbral fijo que se corromperÃ­a
> solo. La cuota de fÃ¡ciles vuelve a ser medible.
>
> ### El banco del test tardÃ³ tres vueltas, y las tres hicieron falta
>
> `T-121` lo escribiÃ³. Dos revisiones independientes: `revisor` no encontrÃ³ nada
> bloqueante, y una pasada adversarial encontrÃ³ que **el eje `luz-oscuridad` medÃ­a cuatro
> cosas distintas** â€”con sorteo de 5 sobre 10, la misma persona caÃ­a en polos opuestos
> segÃºn quÃ© cinco le tocaranâ€” y que **`CU-1` nombraba pertenencia** y **`CU-3` se llamaba
> como el hincha de San Lorenzo**. Rehecho en `T-126`.
>
> La segunda pasada encontrÃ³ que **la asimetrÃ­a no se habÃ­a cerrado: se habÃ­a mudado de
> eje** â€” ocho de diez opciones de `oscuridad` eran *no hacer lo que hace `luz`*, y como
> extraversiÃ³n es un rasgo socialmente premiado, el test tenÃ­a un lado bueno. Cerrado en
> `T-127`: hoy ninguna opciÃ³n de `oscuridad` es una negaciÃ³n.
>
> **EstÃ¡ en `REV-07` y vale como vara:** dos ciclos seguidos, la pasada adversarial encontrÃ³
> lo que la verificaciÃ³n no, y las dos veces por el mismo motivo â€” **el defecto no estaba en
> ningÃºn Ã­tem, estaba en el conjunto.**
>
> ### Lo que el usuario trajo a mitad de ciclo
>
> - **La tapa real de *La mosca y la sopa*** reemplaza a la contratapa que el sitio usaba.
>   âš  `RES-44` sigue diciendo que es un rediseÃ±o; su evidencia para esa fila es la mÃ¡s floja
>   de las 35 (fetch 403, snippet). **El pie no le acredita nada a Rocambole** hasta que
>   alguien vuelva a mirarlo â€” pedido en `Docs/SUGERENCIAS/HILO-para-investigador-tapa-de-la-mosca.md`.
> - **Tres recortes reales**: la mosca (17 KB), Lupus el lobo (48 KB) y el ojo de buey de
>   *Ãšltimo bondi* (29 KB). Ninguno necesitÃ³ cÃ³digo: el mapa `RECORTE_REAL` ya los esperaba.
> - **El "Viste (disco)" del portal, afuera** â€” la mezcla `D-19` se ve en el color.
>
> ### Dos verificaciones nuevas, las dos por huecos que encontrÃ³ una revisiÃ³n
>
> 1. **`voz.test.ts` no miraba el banco del test.** 44 cadenas visibles sin auditar en un
>    proyecto cuya postura es que se audita a mÃ¡quina lo auditable. Ya las mira.
> 2. **El schema de `dos-ejes` no tenÃ­a tarea asignada en el plan.** Lo notÃ³ `arquitectura`;
>    era un hueco mÃ­o.
>
> ### Deuda declarada
>
> - **21 temas de lacuerda.net** afuera del banco de letras: fuente nueva sin ficha. Pedido
>   escrito. El generador tiene el mapa en una constante.
> - **`RES-48` tiene una cita falsa** sobre el origen de *Mi perro dinamita*. La Redondopedia
>   ya estÃ¡ corregida contra el memoir; la ficha no, y es de `investigador`.
> - **No queda rastro de la banda en las 20 preguntas** del test â€” es lo que `US-06` pide,
>   pero `producto` no lo confirmÃ³ de frente. Anotado en `CNT-09`.
> - **`ADR-02`** (link compartido) lleva puntaje y este juego no tiene.
> - Los tres hallazgos abiertos de `REV-06` y la cuota de fÃ¡ciles de `US-02`.
>
> **Rangos consumidos por el ciclo 8:** `T-113`..`T-127`, `RES-51`, `RES-52`, `US-06`,
> `BR-17`, `BR-18`, `CTR-07`, `CTR-08`, `UX-06`, `CNT-09`, `REV-07`, `FIND-25`..`FIND-27`.
> Libres: `T-128`+, `D-25`+, `RES-53`+, `CNT-10`+, `REV-08`+, `UX-07`+, `BR-19`+,
> `IDEA-12`+.

---

**Ciclo 7 â€” CERRADO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-7.md`, tareas
`T-97`..`T-112`. `npm test` **212/212**, `npm run check` 0 errores, build de 147 pÃ¡ginas.

> ### Lo que cerrÃ³ el ciclo
>
> - **`US-01` cumpliÃ³ su piso: 40/40.** Entraron las 10 preguntas de `letras` (`CNT-08`),
>   con el reparto exacto que pide `producto`: 10 por categorÃ­a, 10 fÃ¡ciles / 15 medias /
>   15 difÃ­ciles. **Es el tercer juego con el piso cumplido**, despuÃ©s de `US-04` y `US-05`.
> - **Cuatro deudas entre roles, saldadas.** `RES-49` (cifraclub, `INV-23`), `RES-50`
>   (Vercel y los mp3, `INV-24`), `BR-02` reescrita sobre la mecÃ¡nica real de `US-02`, y
>   `CTR-01`/`CTR-03` puestos al dÃ­a con el juego construido. `CNT-01` fijÃ³ el fragmento en
>   **15,0 s**. `IDEA-11` entrÃ³ al backlog.
> - **El cancionero se rehizo y entrÃ³ entero.** El usuario lo regenerÃ³ con tres fuentes
>   (cifraclub 78, lacuerda.net 20, letras.com 5). **104/105 temas, 101 con letra** â€” eran
>   96. Cinco temas que solo tenÃ­an tablatura ahora tienen versos.
> - **El banco de `US-03` pasÃ³ de 226 candidatos sobre 13 temas a 1.784 sobre 80.** La hoja
>   de escucha ahora reparte 24 versos en **24 temas distintos** y 8/8/8 por nivel.
>
> ### ðŸ”´ Los tres defectos que el ciclo encontrÃ³, y ninguno estaba en el plan
>
> **1. El quiz servÃ­a solo preguntas fÃ¡ciles.** `armarRonda` llenaba la ronda desde el pozo
> mÃ¡s fÃ¡cil hasta completar el largo. Con 10 fÃ¡ciles y una ronda de 8, **toda partida era
> ocho fÃ¡ciles**: 300 rondas simuladas dieron 2.400 preguntas y **las 2.400 fÃ¡ciles**. Las
> 15 medias y las 15 difÃ­ciles no salÃ­an nunca, y la categorÃ­a `letras` reciÃ©n cerrada era
> inalcanzable. **El banco tenÃ­a 40 preguntas y el jugador veÃ­a 10.** CumplÃ­a `BR-01` al pie
> de la letra y traicionaba las tres razones por las que `BR-01` existe. Arreglado con la
> mezcla derivada del piso (2/3/3 en una ronda de 8) y cinco tests.
>
> **2. NingÃºn schema se corrÃ­a.** `banco.ts` decÃ­a que la validaciÃ³n la hacÃ­a "la
> verificaciÃ³n", y no existÃ­a ningÃºn comando que la hiciera â€” el mismo defecto que el ciclo
> 6 ya habÃ­a encontrado en `letra.schema.json`. Ahora corre (`src/lib/esquemas.test.ts`) y
> encontrÃ³ tres cosas al primer intento: acordes mal ingeridos, la notaciÃ³n latina de
> lacuerda.net sin convertir, y el patrÃ³n de id del banco de letras topeado en tres dÃ­gitos.
>
> **3. Un `testimonio` de la Redondopedia citaba una ficha que no lo dice.** El artÃ­culo
> `mi-perro-dinamita` atribuÃ­a a `RES-22` que el tema naciÃ³ de un verso de Poli. Se leyÃ³ el
> memoir directo: **no estÃ¡**. El origen real â€”una prueba de sonido, con Semilla arrancando
> una lÃ­nea de bajoâ€” explica ademÃ¡s por quÃ© Ã©l firma como tercer autor. Corregido, con la
> pÃ¡gina citada.
>
> ### Lo que sigue faltando, y no lo puede hacer un programa
>
> - **`US-02` no tiene un solo fragmento.** `npm run generar-fragmentos -- "<carpeta>"`,
>   con ffmpeg, que en esta mÃ¡quina no estÃ¡. Y ojo: **`producto` subiÃ³ el piso de 20 a 30**
>   (`T-99`), asÃ­ que los pisos de la v1 ahora son **40 / 30 / 15 / 10**. Sube la vara.
> - **`US-03` sigue en 0 `listo` sobre 1.784 candidatos.** `npm run hoja-de-escucha` deja
>   24 versos con el minuto en blanco. Con 15 confirmados el juego se prende solo.
>
> ### Deuda declarada
>
> **21 temas de lacuerda.net quedan afuera del banco de letras**: es fuente nueva y no tiene
> ficha. Pedido en `Docs/SUGERENCIAS/HILO-para-investigador-fichar-lacuerda.md`. El
> generador tiene el mapa en una constante (`FICHA_POR_SITIO`): cuando exista, es una lÃ­nea.
>
> **Tres hallazgos abiertos de `REV-06`** (`FIND-22`..`FIND-24`), todos no bloqueantes.
> `FIND-24` es de `producto`: si `QZ-038` se queda en `letras` o migra a `historia`.
>
> **`RES-48` tiene una cita falsa**: dice "ya en `RES-22`" sobre el origen de *Mi perro
> dinamita*, y `RES-22` no lo dice. La Redondopedia ya estÃ¡ corregida; **la ficha no**, y es
> de `investigador`.
>
> **`arquitectura` dejÃ³ una pregunta abierta para `producto`** sobre la cuota de fÃ¡ciles de
> `US-02`, que ya no tiene dÃ³nde vivir con el manifiesto nuevo. EstÃ¡ en
> `Docs/SUGERENCIAS/HILO-para-producto-cuota-de-faciles-en-us02.md`.
>
> **Rangos consumidos por el ciclo 7:** `T-97`..`T-112`, `RES-49`, `RES-50`, `CNT-08`,
> `REV-06`, `FIND-22`..`FIND-24`. `T-103` y `T-105` se cancelaron y sus nÃºmeros no se
> reutilizan. Libres: `T-113`+, `D-25`+, `RES-51`+, `CNT-09`+, `REV-07`+, `UX-06`+,
> `BR-17`+, `IDEA-12`+.

---

**Ciclo 6:** **construido, a la espera de una confirmaciÃ³n humana.** Plan en
`Docs/ORQ/ORQ-plan-ciclo-6.md`, tareas `T-82`..`T-96`. **El usuario trajo el material que
faltaba** â€”149 JSON con letra y acordes, raspados con scraper propio de cifraclub y
letras.comâ€” y eso desbloqueÃ³ de un saque los tres frentes que esperaban versos.

> ### Lo que quedÃ³ andando
>
> - **`/letras-y-acordes/`: la secciÃ³n nueva.** 104 de los 105 temas de `RES-20`
>   (falta *Sushi*, instrumental), **ordenados por disco y cada disco vestido con su
>   propia paleta real** (`RES-37`, las diez, no las cuatro de `D-19`). Cada disco muestra
>   su **tracklist entero**: lo que no tenemos aparece tachado y con el motivo.
> - **Ficha por tema** con los acordes alineados sobre la sÃ­laba, **transporte** (Â±6
>   semitonos, respeta bemoles) y **"bajar solo"** (autoscroll con velocidad).
> - **ArmÃ¡ tu cancionero**: elegÃ­s temas y bajÃ¡s **un HTML autocontenido** con Ã­ndice,
>   acordes y autoscroll. **Cero recursos externos** â€” abre sin internet. Verificado.
> - **La Redondopedia enlaza la letra** de sus 6 artÃ­culos `tema`.
> - **147 pÃ¡ginas** (eran 35), **135 tests** (eran 77), `tsc` limpio.
>
> ### ðŸ”´ Lo Ãºnico que falta, y no lo puede hacer un programa
>
> **El juego de completar la letra NO estÃ¡ jugable, a propÃ³sito.** Hay **226 versos
> candidatos** en `src/data/letra.json`, todos `borrador`. `CTR-04` no deja jugar un verso
> sin dos fuentes de letra o **confirmaciÃ³n de oÃ­do contra el disco**, y ponerle `listo` a
> un verso que nadie escuchÃ³ serÃ­a la mentira que `CLAUDE.md` declara como lo Ãºnico
> estricto: si la respuesta estÃ¡ mal, **el juego le marca error justo al que se sabe el
> tema**.
>
> **Y no hay atajo por la otra puerta:** letras.com aportÃ³ 14 temas con letra y cifraclub
> 82, con **solapamiento cero**, asÃ­ que hoy ningÃºn Ã­tem puede llegar a `listo` por "dos
> fuentes". Alguien tiene que escuchar. Medido el 2026-08-23.
>
> **Para prenderlo, y ya cuesta veinte minutos en vez de una semana:**
>
> 1. `npm run hoja-de-escucha` â€” deja **24 versos** elegidos en
>    `src/data/letra-confirmaciones.json` con el minuto en blanco (`_:__`), repartidos
>    entre 13 temas y los tres niveles de `BR-03`, y con el verso anotado al lado.
> 2. Se escucha, se reemplaza cada `_:__` por el minuto (`"1:24"`). QuiÃ©n / fecha / dÃ³nde
>    salen una sola vez de `porDefecto`; **el minuto no tiene defecto y por eso no se
>    autocompleta.**
> 3. `npm run generar-letra`. Con 15 confirmados se cumple el piso de `US-03` y la pantalla
>    se prende sola: los dos estados ya estÃ¡n escritos y el banco decide cuÃ¡l sale.
>
> ### Tres hallazgos del ciclo, que eran defectos viejos
>
> 1. **`leerTemas()` cortaba mal 6 de los 105 tÃ­tulos** â€” se le pegaba la prosa de la nota
>    que sigue en `RES-20`. El cruce de `D-13` daba 83/105 y rechazaba temas legÃ­timos.
>    Con el arreglo y una tabla de alias: **104/105**. Cubierto por `temas.test.ts`.
> 2. **`banco.ts` leÃ­a mal `BR-03`**: sumaba los dos lados del contexto y los comparaba
>    contra el nÃºmero de una sola columna de la tabla, asÃ­ que un Ã­tem fÃ¡cil correcto
>    (2 antes + 2 despuÃ©s) era rechazado. El schema lo tenÃ­a bien. No se notÃ³ antes porque
>    el banco estaba vacÃ­o.
> 3. **Seis temas no eran instrumentales**: la fuente les transcribiÃ³ solo la tablatura.
>    `contenido` pasÃ³ de booleano a tres estados (`letra` / `instrumental` /
>    `solo-tablatura`) para no decir algo falso sobre la obra.
>
> ### Deuda declarada
>
> **El banco sale de 14 temas, no de 96.** Solo letras.com tiene ficha (`RES-23`);
> cifraclub, que aportÃ³ 82 temas, no tiene ninguna. Pedido concreto a `investigador` en
> `Docs/SUGERENCIAS/HILO-para-investigador-fichar-cifraclub.md`. El generador tiene la
> fuente en una constante: cuando la ficha exista, son dos lÃ­neas.
>
> **Rangos consumidos por el ciclo 6:** `T-82`..`T-96`, `CTR-06`. Consumidos por la sesiÃ³n
> suelta del 2026-08-23: `D-23`. Pedidos y sin escribir: `RES-49` (cifraclub), `RES-50`
> (lÃ­mites de Vercel). Libres: `T-97`+, `D-24`+, `RES-51`+, `CNT-08`+, `REV-06`+, `UX-06`+,
> `BR-16`+.

---

## SesiÃ³n suelta del 2026-08-24 â€” la auditorÃ­a de detalles, y la figura encadenada

No es un ciclo: es una skill nueva pasada por el portal y el quiz, y un recorte que trajo
el usuario.

**La skill.** `pbakaus/impeccable` (246K instalaciones), instalada global y enlazada a
Claude Code. Es la que caza los 64 patrones de interfaz genÃ©rica de IA â€” el mismo enemigo
que `.claude/rules/diseno-marca.md` ya tenÃ­a escrito con nombre y apellido. Se corriÃ³ su
comando `audit` sobre `index.astro` y `quiz.astro`. Informe completo, con la mediciÃ³n de
cada hallazgo, en `Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md`.

> Ojo con el detector: necesita `htmlparser2`, `css-select`, `css-tree` y `domutils` en el
> directorio de la skill. Sin ellos avisa `DEGRADED` y cae a expresiones regulares, que no
> evalÃºa variables CSS ni contraste computado. EstÃ¡n instaladas; si se reinstala la skill,
> hay que volver a ponerlas o el resultado limpio es un subconteo.

**DiagnÃ³stico: 15/20.** El detector devuelve **limpio** sobre el HTML construido, que no es
comÃºn. Lo que bajaba la nota no era el sistema visual: era la deriva entre el sistema y lo
que el JavaScript crea en tiempo de ejecuciÃ³n.

**Los cuatro P1, arreglados y verificados en pantalla:**

1. **`.primario` era una regla con alcance de pÃ¡gina, asÃ­ que no alcanzaba a los botones
   que crea una isla.** El `SEGUÃ` del quiz salÃ­a como botÃ³n nativo gris â€”medido:
   `rgb(240,240,240)`, `2px outset`, 59 Ã— 48â€” sobre fondo de tinta. Es `FIND-15` otra vez.
   Ahora es componente global en `juego.css` con `--tinte-accion`, que **se hereda por el
   Ã¡rbol del DOM**. AlcanzÃ³ a siete botones en cuatro juegos: `dos-ejes` y
   `completar-la-letra` ni siquiera tenÃ­an la regla.
2. **Se fue el auto-avance.** Medido: el panel de feedback duraba **1.577 ms** con una
   explicaciÃ³n de seis segundos de lectura, y eso pasaba en **22 de los 40 Ã­tems**. Ahora
   toda pregunta espera el dedo con `SEGUÃ`, como `UX-01` v2 ya habÃ­a hecho para los Ã­tems
   con rÃ³tulo. Sale de paso una violaciÃ³n de WCAG 2.2.1 (Nivel A).
3. **El foco ya no se cae al `<body>`** en cada cambio de pantalla, y el panel de feedback
   es `role="status"`. Regiones vivas en la pÃ¡gina: 0 â†’ 1.
4. **El link que manda `COMPARTÃ` tiene tarjeta.** Open Graph, Ã­cono y `theme-color` en las
   **148 pÃ¡ginas**. `public/tarjeta.png`, `icono-180.png` y `favicon.svg` los genera
   `npm run generar-marca-social` **leyendo los colores de `tokens.css`**.

**Los siete P2, tambiÃ©n:** la categorÃ­a dejÃ³ de imprimirse cruda (se leÃ­a `MITOLOGIA`, sin
tilde); el resultado tiene salida al arcade (era un callejÃ³n sin salida); el puntaje y el
tramo pasaron a letra de marca (eran `system-ui`); la escala tipogrÃ¡fica de la portada del
quiz se abriÃ³ a 20 / 28 / 38; `color-scheme: dark` y `::selection`; y las imÃ¡genes declaran
medidas â€”leÃ­das del archivo en build por `medidas()`â€” y cargan diferido.

> **Un hallazgo se corrigiÃ³ a la baja.** El informe decÃ­a "salto de maquetado"; lo medÃ­
> despuÃ©s y **el CLS del portal es 0**, y ya lo era. Las imÃ¡genes del casete tienen ancho y
> alto fijos por CSS y las otras dos estÃ¡n fuera de flujo. Lo que faltaba de verdad era el
> `loading="lazy"`.

**Quedan abiertos:** los nueve P3, la misma jerarquÃ­a plana en `adivinar-la-tapa.astro`
(20 / 24 / 33,6 px â€” apareciÃ³ al pasar el detector por las cuatro pÃ¡ginas de juego), y los
`.primario` con alcance que sobreviven en `adivinar-el-tema` y `adivinar-la-tapa`.

### ðŸŸ¡ La figura encadenada entrÃ³ a la portada, y le falta la ficha

El usuario trajo `Docs/UX/OktubreCadena.png` y pidiÃ³ que reemplace al perro al lado del
tÃ­tulo del portal. Hecho, y es tambiÃ©n la imagen de la tarjeta al compartir.

**Pero `public/arte/README.md` decÃ­a que esa pieza no se usaba hasta tener ficha**, y la
razÃ³n no es de derechos: `INV-02` reporta que la figura encadenada **no estaba en el arte
del vinilo de *Oktubre* del 86** y que se difundiÃ³ con la reediciÃ³n en CD â€” "reportado, con
buena base, verificar antes de usar".

ResoluciÃ³n, sin frenar la pieza ni afirmar el dato: **se muestra y no se le atribuye
disco.** No entra en `tapasUsadas`, asÃ­ que el crÃ©dito del pie no la nombra; el texto de la
tarjeta acredita a Rocambole â€”eso sÃ­ estÃ¡ firmeâ€” sin nombrar el Ã¡lbum. Ficha pedida en
`Docs/SUGERENCIAS/HILO-para-investigador-figura-encadenada.md`, donde los tres desenlaces
posibles sirven, y uno de ellos es una pregunta de quiz de primer nivel.

**VerificaciÃ³n:** build de 148 pÃ¡ginas, `npm test` **224/224**, `npm run check` 0 errores.
Detector limpio sobre el HTML construido. En el navegador: sin desborde a 320, 375 y
1280 px; 24 pares de texto con el peor en 4,67:1; ningÃºn objetivo tÃ¡ctil bajo 48 px.

---

## SesiÃ³n suelta del 2026-08-23 â€” el audio, y el candado de las letras

No es un ciclo: son dos preguntas del usuario resueltas de punta a punta.

**`D-23` â€” los 2,5 GB no entran al repo.** El usuario trajo el nÃºmero que faltaba desde
`D-22`: la discografÃ­a completa que tiene pesa 2,5 GB. Contra las ~7,2 h de `RES-20` eso
da ~770 kbps promedio â€” **no es mp3, es lossless o casi**, y el mismo catÃ¡logo a 128 kbps
son ~400 MB. Decidido: los 2,5 GB se quedan en la mÃ¡quina como material de trabajo, y al
sitio va un derivado en **dos niveles** â€” fragmento de `CTR-01` para los 104 temas
(**12,5 MB** en total) y tema entero solo para los que un juego revela (~40, ~160 MB).
**Se descartÃ³ guardar medio tema** (idea del usuario) por aritmÃ©tica: `US-02` necesita 15
segundos, no dos minutos, y medio tema pesa doce veces mÃ¡s que el fragmento para el mismo
juego. Queda pedida `RES-50` a `investigador` en
`Docs/SUGERENCIAS/HILO-para-investigador-limites-de-vercel-para-audio.md`: **la Ãºnica
pregunta que puede mover algo es si Vercel Hobby banca ~180 MB de mp3 en el repo.** La
decisiÃ³n no depende de la respuesta, solo dÃ³nde viven los archivos.

**Tres candados nuevos en el juego de las letras, porque no habÃ­a ninguno.** La regla de
`CTR-04` que decide si el juego miente â€”para estar en `listo`, o te escucharon o tenÃ©s dos
fichas de letraâ€” **vivÃ­a solo en `letra.schema.json`, que ningÃºn test corrÃ­a.** Ahora:

1. EstÃ¡ en `src/lib/letra/banco.ts` y rompe el build. Seis tests nuevos.
2. `generar-letra` **aborta sin escribir** ante una confirmaciÃ³n que no es una escucha:
   minuto vacÃ­o, `"si"`, `"1:60"`, fecha invÃ¡lida, `donde` inventado, id inexistente.
3. **GuardiÃ¡n de ids.** Los ids son posicionales (`CL-001`...): un banco regenerado los
   corre y una confirmaciÃ³n se mudarÃ­a **en silencio** a un verso que nadie escuchÃ³. La
   hoja guarda el verso como huella y el generador compara.

**Dos defectos del banco, encontrados al mirarlo:** el banco bajÃ³ de **313 a 226**
candidatos y es una mejora â€” **79 repetidos** (el mismo verso de estribillo entraba una
vez por repeticiÃ³n) y **8 sin verso alrededor** (la `InvocaciÃ³n` de *Lobo suelto* daba tres
Ã­tems cuyo enunciado entero era `____ !`; ese tema saliÃ³ completo).

**Verificado:** `npm test` â†’ 135/135. `npm run check` â†’ 0 errores.

**Ciclo anterior:** **5 â€” EN CURSO.** Plan en `Docs/ORQ/ORQ-plan-ciclo-5.md`: 17 tareas,
`T-64`..`T-80`. **Foco: el sitio sale a la calle y el quiz se viste.** Lo segundo es la
mitad del pedido del ciclo 4 que quedÃ³ sin hacer (`UX-05` Â§2, siete superficies).
**Los versos siguen sin transcribirse y es deliberado:** son material de origen, como los
recortes de audio de `US-02`, y entran por la mano del usuario. El ciclo deja lista toda la
maquinaria de `US-03` alrededor, y le pregunta a `producto` si un artÃ­culo `tema` se
sostiene sin citar verso â€” si dice que sÃ­, `US-05` llega a 35/35 sin un solo verso.

> âœ… **`T-71` (`experiencia`) â€” cerrada.** `UX-04` pasa a v4 y `UX-05` a v2. Confirmados
> los dos desvÃ­os que reportÃ³ el hilo principal (`Docs/SUGERENCIAS/HILO-para-experiencia-
> desvios-de-UX-05.md`): `letras` sale entera de la trasera de *La mosca y la sopa* (tres
> filas corregidas), y el fondo de Oktubre queda anclado en la franja inferior del portal,
> nunca detrÃ¡s de la cabecera. Los nÃºmeros de 480/640 px bajaron al techo real del
> material (mÃ¡sters 953Ã—953/1181Ã—929 px, catÃ¡logo real 210â€“591 px, destino real 34â€“96 px);
> el tope de 60 KB queda igual, con nota de que hoy nadie lo roza (mÃ¡ximo real 53 KB).
> **Hallazgo propio, no pedido:** el mismo problema del desvÃ­o 2 (texto sin par testeado
> sobre velo) iba a repetirse en dos pantallas que el ciclo 4 no llegÃ³ a construir â€”
> `--marca-rojo` en la presentaciÃ³n del quiz y `--acento` (tramo medio, ~4,48:1 calculado a
> mano) en el resultado â€”, asÃ­ que `UX-05` v2 ya las deja acotadas antes de que `T-72` las
> construya. `UX-05` Â§2 suma el mecanismo del "sello de esquina" en detalle (dÃ³nde cae, quÃ©
> tamaÃ±o, cÃ³mo convive con el pulgar) para que `T-72`..`T-74` lo lean y no vuelvan a
> preguntar. Queda anotado y sin resolver, fuera de la carpeta de `experiencia`: la ficha
> de disco de *La mosca y la sopa* en la Redondopedia todavÃ­a muestra el mismo frontal que
> `RES-44` descartÃ³ â€” es de cÃ³digo (`generar-tapas.mjs`) y de `contenido` (el texto de esa
> ficha), no algo que UX pueda mover sola.

> **Ciclo 4 â€” CERRADO.** Las 20 tareas `T-44`..`T-63`, mÃ¡s los hallazgos de las
dos revisiones, corregidos y verificados. **Las tapas reales entraron al sitio y hay un
segundo juego jugable**: `US-04` (adivinar la tapa) cerrÃ³ su piso en 10/10 y se juega de
punta a punta. La Redondopedia pasÃ³ de 26 a **29 de 35** artÃ­culos. **77 tests**, `tsc`
limpio, build de **35 pÃ¡ginas**. Repo en **https://github.com/knesantos/ArcadeRicotero**.
Los ciclos 1, 2 y 3 tambiÃ©n estÃ¡n cerrados. **NingÃºn ciclo tiene nada abierto.**

> ðŸ”´ **Y algo peor que faltaba cÃ³digo: no hay repositorio git.** 55 archivos de trabajo de
> dos ciclos completos, sin un solo commit y sin respaldo. Lo encontrÃ³ `orquestador` al
> planificar. Es `T-28` y va **antes que todo lo demÃ¡s**.

> ðŸŸ¢ **LEER PRIMERO â€” `D-14` reencuadra el proyecto entero.** Lo decidiÃ³ el usuario el
> 2026-08-19 con toda la evidencia legal sobre la mesa, y **manda sobre cualquier cautela
> que este archivo o cualquier otro haya escrito antes**.
>
> **Es un fan site sin fines de lucro, de poco volumen, hecho para divertirse.** Tres cosas:
> **(1) El riesgo se asume.** Si llega un reclamo, **se da de baja y listo**. El gate de
> publicaciÃ³n de `D-07` **ya no existe**; `CNT-01` pasÃ³ de cerrojo a **mapa** de quÃ© se usa.
> Nada espera permiso.
> **(2) El conocimiento popular vale.** No hay mucho oficial **y no deberÃ­a importarnos** â€”
> y no es una excusa: `RES-23` verificÃ³ que la fuente autorizada de letras no existe ni
> existiÃ³, y `RES-21` que el memoir se declara "apenas mi versiÃ³n". Se dejÃ³ de exigir fuente.
> **(3) Abrir los molinetes.** Nada se le niega a nadie por no tener con quÃ© entrar: ni
> cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas"
> del alcance eran la misma decisiÃ³n y ahora tienen nombre.
>
> **Lo Ãºnico estricto que queda**, y no es legal: que **la respuesta correcta sea correcta**
> â€” si el dato estÃ¡ mal, el juego le marca error al que se sabe el tema. La defensa no es
> verificar: es **rotular bien**, en las tres casillas que el schema ya hace cumplir.

> **Lo que queda para el ciclo 3, en orden de valor.** `letras` es la Ãºnica categorÃ­a en
> cero y ahora tiene fuente (`D-13`): son las 10 que faltan para el piso de 40 de `US-01`.
> `US-02` y `US-03` tienen contrato o insumo pero **ningÃºn Ã­tem cargado**, y `US-04`
> tampoco. Del lado de derechos, las **8 preguntas legales bajaron a 4**: `RES-11` a
> `RES-14` respondieron audio, tapas y cita de versos. **`ADR-01` ya no espera `E-04`:
> `RES-26` lo volviÃ³ irrelevante** â€” ver abajo.

> âœ… **RESUELTO â€” el bloqueo de alcance por falta de letras se desarmÃ³. No hay que tocar el
> piso de `US-01` ni la definiciÃ³n de "Listo".**
>
> La versiÃ³n anterior de este aviso decÃ­a: `RES-23` descartÃ³ letras.com, no hay otra fuente,
> la categorÃ­a `letras` no se puede escribir, el piso de 40 no se alcanza por aritmÃ©tica
> (techo 30/40), y `US-03` queda bloqueado entero. **Esa cadena partÃ­a de una premisa que el
> usuario dio por cerrada el 2026-08-19: que hacÃ­a falta una fuente autorizada.**
>
> **DecisiÃ³n del usuario, con la objeciÃ³n de `RES-23` sobre la mesa:** se usan letras.com y
> **bestiarioredondo** igual. Fundamento: *la banda tiene una mÃ­stica de pocas cosas
> oficiales*, y la investigaciÃ³n lo respalda â€” no hay sitio oficial de letras, nunca lo
> hubo, el memoir no las trae (`RES-21`), y la banda se construyÃ³ sin multinacional, sin TV
> y sin publicitar recitales (`RES-07`). **Esperar una fuente oficial es esperar algo que la
> banda deliberadamente nunca produjo.**
>
> El riesgo de `RES-23` sigue siendo real y se acepta acotado, con cinco mitigaciones. Dos
> importan de verdad: **cruzar todo contra los 105 temas de `RES-20`** â€”obligatorio, gratis,
> y mata el Ãºnico error demostrado de la fuente, las 149 entradas contaminadas con material
> del Indio solista y de Skayâ€” y **confirmar de oÃ­do contra el disco**, que es realista
> porque `BR-03` muestra 2/1/0 versos: el piso de `US-03` necesita **~30 versos**, no 15
> letras enteras. Detalle en la secciÃ³n final de `INV-21-letras-y-fuimos-reyes.md`.
>
> âœ… **Ya estÃ¡ registrado como `D-13`.** El hilo principal le asignÃ³ el nÃºmero, y de paso
> quedÃ³ escrita en `Docs/IDS.md` la regla que faltaba: **el prefijo `D-` lo escribe solo la
> sesiÃ³n principal**; una sesiÃ³n paralela deja la propuesta sin nÃºmero y espera. No haberlo
> numerado desde allÃ¡ fue lo correcto.
>
> **`D-14` fue mÃ¡s lejos que esto:** ya no se trata solo de las letras. El conocimiento
> popular es fuente legÃ­tima para todo el proyecto.

> âš  **Dos sesiones escriben este archivo.** El encabezado quedÃ³ desfasado de su propia
> bitÃ¡cora porque las dos sesiones lo actualizan y ninguna ve a la otra. **Manda el disco y
> manda la bitÃ¡cora**, que es acumulativa: si el encabezado dice algo que la bitÃ¡cora
> contradice, gana la bitÃ¡cora. `Docs/EQUIPO.md` dice que `ESTADO.md` es del hilo
> principal, pero eso se escribiÃ³ cuando habÃ­a un solo hilo principal.

> âš  **La sesiÃ³n paralela de investigaciÃ³n abriÃ³ una segunda tanda.** EntregÃ³
> `RES-04`..`RES-09` en `INV-02-banda-cultura-estetica.md` (rango consumido entero) y ahora
> `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`, porque el usuario consiguiÃ³ los
> libros. **Esta sesiÃ³n sigue numerando en `RES-10`..`RES-19`**; `RES-04`..`RES-09` estÃ¡n
> quemados y `RES-20`..`RES-29` son de la otra. Reserva completa en `Docs/IDS.md`.

> ðŸ”´ **Y trajo un dato que nadie tenÃ­a: el Indio Solari muriÃ³ el 5 de junio de 2026**
> (`RES-04`, dos fuentes independientes). Todo el repo se escribiÃ³ hoy hablando de la banda
> sin saberlo. **No cambia el alcance ni los cuatro juegos.** Deja dos cosas por decidir, en
> `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`.

## SesiÃ³n suelta del 2026-08-23 (2) â€” la voz del sitio, medida

El usuario pidiÃ³ **analizar a fondo cÃ³mo habla y escribe el Indio** para que el sitio no
tenga texto genÃ©rico y para que los juegos se presenten *como si fueran un tema*. Era la
idea que estaba guardada desde el 21 en
`Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md`: **se tomÃ³**, y ese
archivo ahora cierra con lo que se resolviÃ³ y lo que queda.

**Regla nueva: `.claude/rules/voz-ricotera.md`**, con el mismo estatuto que
`diseno-marca.md` â€” obliga a todos, roles incluidos. Los nÃºmeros salen de medir dos corpus
que ya estaban en el repo, **sin salir a la web**: el memoir (`RES-21`, 192.464 palabras) y
las letras de los 104 temas del cancionero (2.958 versos).

**Los tres hallazgos que mÃ¡s corrigen la intuiciÃ³n:**

1. **No es el porteÃ±o de la caricatura.** En 192.464 palabras dice *che* **9** veces,
   *viste* **15**, *digamos* **3**. Meter esas muletillas para sonar argentino es
   exactamente lo que no suena a Ã©l.
2. **Dice "la gente"** (333) y casi nunca "el pÃºblico" (39) ni "los fans" (**2**).
3. **Declara la duda todo el tiempo** (*creo que* 81, *no sÃ©* 71, *puede ser* 41) y **no
   tiene Ã©pica militante** (*lucha* 6, *resistencia* 7). El sitio no arenga: rodea, atenÃºa
   y avisa cuando no sabe â€” que es, de casualidad perfecta, el mecanismo que Wikipedia no
   puede usar y que `D-20` fue a buscar para la Redondopedia.

**Tres registros, y mezclarlos es el defecto:** *el que canta* (tÃ­tulos, casetes, botones;
techo de 8 palabras, que es el percentil 90 del verso), *el que cuenta* (Redondopedia,
explicaciones; oraciÃ³n de ~13 palabras) y *el que rotula* (leyenda, testimonio, errores,
avisos, y los tres temas de `CNT-04`/`CNT-06`), que va **seco y sin voz**.

**La lÃ­nea que no se cruza, escrita antes que nada:** el sitio escribe como aprendiÃ³
escuchÃ¡ndolo, **nunca se hace pasar por Ã©l**. MuriÃ³ hace once semanas (`RES-04`) y, sobre
todo, una frase inventada con su firma envenenarÃ­a el rÃ³tulo `testimonio`, que es lo Ãºnico
que el sitio promete de verdad.

**El test que faltaba existe: `src/lib/voz.test.ts`**, seis pruebas sobre las cadenas
visibles de los cinco mÃ³dulos de copy. EncontrÃ³ **once botones en infinitivo** â€”que `D-17`
no permiteâ€” y se corrigieron: `COMPARTIR`â†’`COMPARTÃ`, `JUGAR DE NUEVO`â†’`JUGÃ DE NUEVO`,
`VOLVER`â†’`VOLVÃ‰`, y los `Empezar`/`Seguir`/`Volver` de `letra` y `tapa`. **185/185 en
verde.** `CNT-05` (de `contenido`) y `UX-01`/`UX-02`/`UX-04`/`UX-05` (de `experiencia`)
todavÃ­a citan el texto viejo: quedÃ³ anotado en la sugerencia, no se tocaron.

**El barrido se aplicÃ³**, con las dos decisiones del usuario tomadas en la misma sesiÃ³n:
la Redondopedia va con **prosa con voz y rÃ³tulo seco**, y el copy nuevo entra en **las
superficies que presentan** â€” portada, los seis casetes, la pantalla 0 de cada juego y los
tramos del resultado. **No se tocÃ³ nada de adentro de la partida**: enunciados, opciones e
instrucciones siguen bajo `CNT-02` y `UX-01`, donde entender va antes que sonar.

Ahora cada casete abre con un verso de ocho palabras o menos y explica despuÃ©s â€” "Ocho
preguntas y ninguna piadosa", "Lo tenÃ©s en la punta de la lengua", "Rocambole dibujÃ³; vos
ponÃ©s el disco", "El hecho como hecho, la leyenda como leyenda" â€”, y la portada arranca con
"EntrÃ¡, que los molinetes van abiertos". Verificado en el sitio construido (147 pÃ¡ginas,
sin errores de consola). **186/186 tests, `tsc` con 0 errores.**

## SesiÃ³n suelta del 2026-08-23 (3) â€” "AdivinÃ¡ el tema" saliÃ³ de la cocina

El usuario trajo el juego que quiere **calcado**: https://lessgames.com/songless. PidiÃ³ el
relevamiento antes que el cÃ³digo â€”*"no hay que reinventar la rueda"*â€” y tres cosas
concretas: elegir **todos los temas o por disco**, **autocompletado** para no perder el
tiempo tipeando, y que el **botÃ³n de escuchar sea fÃ¡cil y rÃ¡pido**. Y la escalera:
**0,1 Â· 0,5 Â· 2 Â· 4 Â· 8 Â· 15 segundos**.

**El mapa estÃ¡ en `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`**, jugado y
medido con el navegador, no mirado de costado: la escalera se sacÃ³ apretando *Skip* cinco
veces y leyendo la etiqueta; los anchos de la barra, del CSS; la bÃºsqueda difusa, probando
`zzzzq` y viendo que ofrece temas de ZZ Top. Trae la tabla de quÃ© se copiÃ³ y quÃ© **no**, y
por quÃ©.

### Lo que quedÃ³ andando

**`/juegos/adivinar-el-tema/` se juega.** Pantalla nueva de punta a punta, verificada en el
navegador a 390Ã—844 y a 412Ã—860:

- **ElegÃ­s el pozo**: todos los discos, o uno. Los discos sin audio salen apagados y con
  el motivo escrito, no escondidos.
- **Seis renglones de intento**, visibles desde el arranque: la escalera se ve antes de
  gastarla. **Errar abre el escalÃ³n siguiente** â€” es el corazÃ³n del juego, y es lo
  contrario de lo que decÃ­a `BR-02`.
- **Barra de seis tramos**, cada uno del ancho de lo que *ese* paso agrega. El Ãºltimo se
  come la mitad, porque de 8 a 15 hay siete segundos nuevos.
- **Un solo botÃ³n grande que cambia de nombre**: con la caja vacÃ­a dice *PasÃ¡*; con un tema
  elegido dice *ArriesgÃ¡*. Mismo lugar, mismo pulgar.
- **El buscador**, que es la pieza que el usuario marcÃ³ como importante. Perdona tildes,
  espacios (`jijiji` = `Ji ji ji`), empezar por el medio del tÃ­tulo y letras salteadas
  (`vncdrs` â†’ *Vencedores vencidos*). **La lista se abre para arriba**, que es lo Ãºnico que
  el teclado del celular no tapa. Ofrece **los 105 tÃ­tulos**, no los que tienen audio: si
  ofreciera solo los jugables, el desplegable serÃ­a la respuesta.
- **El reveal** da tema, disco, aÃ±o, pista, puntos, el enlace a la letra y los acordes, y
  el tema entero si el archivo existe (`D-22`).
- **185 tests en verde**, `npm run check` sin errores, 147 pÃ¡ginas.

### ðŸ”´ Lo Ãºnico que falta, y es un archivo, no una decisiÃ³n

**No hay audio.** `public/audio/` no existe y el manifiesto estÃ¡ vacÃ­o, asÃ­ que la portada
dice que no hay con quÃ© jugar y da el comando. **La pantalla no se rompe: lo declara.**

Para prenderlo, con la discografÃ­a que el usuario ya tiene en la mÃ¡quina (`D-23`):

```
npm run generar-fragmentos -- "<carpeta con los discos>"
```

Empareja cada archivo con los 105 de `RES-20` por la misma puerta de `D-13` que usa el
cancionero â€”**lo que no resuelve se informa y no se genera**â€”, corre los dos comandos de
`CTR-01.6` (`loudnorm` sobre el tema entero, despuÃ©s el recorte a 96 kbps mono) y verifica
la tabla de `CTR-01.7` archivo por archivo. Con `--enteros` deja ademÃ¡s el tema completo
para el reveal.

**Necesita ffmpeg y en esta mÃ¡quina no estÃ¡.** `winget install Gyan.FFmpeg`, o pasarle la
ruta con `--ffmpeg=`.

### Lo que hay que corregir, y no es del hilo principal

- **`BR-02` quedÃ³ al revÃ©s de lo que el juego hace** (intento Ãºnico vs. seis intentos con
  desbloqueo) y le falta la sexta fila de puntaje. Pedido en
  `HILO-para-producto-mecanica-y-escalera-de-us02.md`. **La tabla que puse â€”100/80/60/40/
  20/10â€” es provisoria.**
- **`CTR-01.9` sigue con cinco pasos y 10 s.** `D-23` ya habÃ­a escrito los 15 s; el mÃ¡ximo
  de `CTR-01.3` sale de `CNT-01` y quien tiene que confirmarlo es `contenido`. Pedido en
  `HILO-para-arquitectura-escalera-de-seis-y-modo-buscador.md`, junto con el
  `modoRespuesta: "buscador"` que cierra `CTR-03.5` con un valor que no estaba en la lista.
- **`D-23` tiene un nÃºmero viejo, y a favor:** dice 12,5 MB para los 104 fragmentos, pero
  eso son 120 KB cada uno, que es el peso de **10** segundos. A 15 s son ~180 KB â†’ **~19 MB**.

### Dos hallazgos al costado

1. **La letra de la firma no tiene acentos** (`RES-42`), asÃ­ que el botÃ³n `CompartÃ­` salÃ­a
   partido a la mitad de la palabra â€” se veÃ­a roto de verdad, no en teorÃ­a. Resuelto como
   la regla de marca ya mandaba: la palabra va en `--fuente-rotulada` y **no** se le saca la
   tilde (`D-17` no negocia el voseo). Clase `.primario.firma.con-tilde`, que se borra el
   dÃ­a que los acentos existan.
2. **Los `<style>` de un `.astro` tienen alcance y no llegan a lo que crea el JavaScript.**
   Por eso el botÃ³n de compartir salÃ­a angosto â€” en este juego **y en el quiz**. Se moviÃ³
   la caja de `.primario.firma` a `juego.css`; ahora los dos empatan con el botÃ³n de abajo.

**Rangos consumidos por esta sesiÃ³n:** `D-24`. Libres: `T-97`+, `D-25`+, `RES-51`+,
`CNT-08`+, `REV-06`+, `UX-06`+, `BR-16`+.

---

## PrÃ³ximo paso

> âš  **El ciclo 14 cerrÃ³ el 2026-09-11.** Ver el bloque ðŸŽ› del encabezado. Lo que dejÃ³
> pendiente, por orden de valor:
>
> 1. **Cargar los temas enteros**, que es lo Ãºnico que le falta a la rocola para hacer lo que
>    el pedido decÃ­a: `npm run generar-fragmentos -- "<carpeta>" --enteros`. Sin eso suenan
>    los recortes, que es la caÃ­da declarada, no un defecto.
> 2. **Decidir los tres desvÃ­os de presupuesto** del bloque de arriba (el pie en 179, el
>    casete en 198, el portal en 2,49 pantallas). Los tres se resuelven tocando tipografÃ­a o
>    el token de la franja, y las dos cosas son del lienzo y de `experiencia`, no del que
>    construye.
> 3. **Leer `REV-13`** (`Docs/REVISIONES/`), la revisiÃ³n del ciclo.
>
> **Lo de abajo sigue valiendo como pendientes sueltos, no como el prÃ³ximo paso.**

**El ciclo 10 cerrÃ³. Lo que sigue es tuyo, y son dos comandos y una decisiÃ³n.**

1. **La clave de YouTube** (`T-165`, lo Ãºnico del ciclo 10 que quedÃ³ sin hacer). Enciende
   el escalonamiento real de `US-02` **y** de `US-07` sin tocar una lÃ­nea de cÃ³digo, y con
   eso se cae la salvedad 1 de arriba:
   `YT_API_KEY=... npm run ingerir-popularidad -- --resolver`
2. **Una casilla de correo** para el botÃ³n de correcciÃ³n (`T-153` del ciclo 9). Prenderla
   es una lÃ­nea en `src/lib/correccion/destino.ts`. Sin ella nadie queda sin poder
   corregir: la cadena termina en el texto a la vista.
3. **Si querÃ©s que `revisor` mire el frente A de verdad** antes de dar la v1 por cerrada
   (`FIND-37`). Es la salvedad 2.

**Y si el prÃ³ximo ciclo es de crecer y no de cerrar**, lo que estÃ¡ esperando con ficha
escrita es: la tapa entera al revelar (`experiencia` + `arquitectura`), los ids
posicionales `CL-NNN` de `US-03` (`arquitectura`, deuda estructural de `REV-08`), Supabase
(`IDEA-13`) y las once ideas de juego de `PRD-backlog-ideas.md`.

Estado de los pisos, medido el **2026-09-01** contra los JSON del repo:

| Historia | Piso | Hoy | QuÃ© falta |
|---|---|---|---|
| `US-01` Quiz *(por vidas)* | 40 | **40** âœ… | el `h1` de portada tiene diez palabras y la regla topea en ocho (`T-166`) |
| `US-02` AdivinÃ¡ el tema *(audio)* | 30 | **95** âœ… | ðŸ”´ **el piso estÃ¡ y el criterio no**: 0 FÃ¡ciles de los 8 que pide, sin escalonar y sin schema (frente A) |
| `US-03` CompletÃ¡ la letra | 15 | **21** âœ… | â€” |
| `US-04` AdivinÃ¡ la tapa | 10 | **10** âœ… | dos explicaciones seÃ±alan el tÃ­tulo, que el zoom sacÃ³ de pantalla (`T-173`) |
| `US-05` Redondopedia | 35 | **35** âœ… | â€” |
| `US-06` Dos ejes *(fuera de v1)* | â€” | 28 | â€” |
| `US-07` Sacalo por la letra *(fuera de v1)* | 60 | **89** âœ… | sin escalonar hasta que corra la clave de YouTube (`D-27`) |

**Contando Ã­tems, la v1 estÃ¡.** Lo que falta es que `US-02` cumpla `BR-01`, y que una
revisiÃ³n que no construyÃ³ las piezas lo confirme â€” eso es el ciclo 10 entero.

**Lo que sigue esperÃ¡ndote, y no lo puede hacer ningÃºn rol:**

1. **La clave de YouTube** (`T-165`). Prende el escalonamiento de `US-02` y `US-07` con un
   comando. Es lo que mÃ¡s rinde por minuto en todo el proyecto.
2. **Una casilla de correo** para el botÃ³n de correcciÃ³n (`T-153` del ciclo 9, sin empezar).
   Sin ella el mail no existe y la cadena termina en el texto a la vista: nadie queda sin
   poder corregir, asÃ­ que no bloquea la v1.
3. **El arte de Momo Sampler** (`momo-medallon`): la pantalla de `US-07` se pinta solo con
   el color. `UX-08` dejÃ³ el brief pedido.

> âš  **Lo que sigue abajo de esta lÃ­nea quedÃ³ del ciclo 4 y estÃ¡ desactualizado.** Se deja
> por trazabilidad: los pisos que menciona son los viejos (40/20/15/10, hoy 40/30/15/10),
> "desplegar en Vercel" ya estÃ¡ hecho, y la Redondopedia ya cerrÃ³ su piso de 35. **No
> tomes ninguna instrucciÃ³n de acÃ¡ para abajo sin cruzarla con el encabezado.**

### HistÃ³rico â€” el prÃ³ximo paso tal como se escribiÃ³ en el ciclo 4

**Correr `/ciclo` para el ciclo 5.** El ciclo 4 cerrÃ³ entero. Hay **dos juegos jugables**
(el quiz y adivinar la tapa) y las tapas reales visten el sitio.

**Lo que mÃ¡s acerca el "Listo" de la v1, en orden:**

1. **Las letras, que son un solo frente aunque parezcan tres.** `US-03` (completar la
   letra) tiene contrato desde `T-62` (`CTR-04`), las 10 preguntas de `letras` cierran el
   piso de 40 de `US-01`, y los 6 artÃ­culos `tema` cierran el piso de 35 de `US-05`. Las
   tres cosas esperan el mismo insumo: **versos**. `RES-45` evaluÃ³ la fuente que trajiste
   (redondossubtitulados) y `BR-12` ya fijÃ³ que un artÃ­culo `tema` lleva versos citados y
   anÃ¡lisis, no la letra entera. Falta que alguien vaya a buscar el material.
2. **`US-02` (adivinar el tema) sigue esperÃ¡ndote a vos.** `CTR-03` pide `origen` y
   `fechaCorte` por Ã­tem, y esos campos salen de recortar los mp3. NingÃºn rol puede
   inventarlos.
3. **Desplegar en Vercel.** Nada lo bloquea desde `D-14` y `D-15`, y ahora el sitio tiene
   algo que mostrar.

**Lo que el ciclo 4 dejÃ³ afuera a propÃ³sito, y conviene que el 5 decida:** la secciÃ³n 2 de
`UX-05` â€” las **siete superficies del quiz** que el catÃ¡logo viste con tapas (fondo en la
presentaciÃ³n y en el resultado, detalle por categorÃ­a, y el sello de esquina para el
crÃ©dito en una isla que no tiene pie). El plan del ciclo 4 nunca las cubriÃ³: sus tareas de
aplicaciÃ³n eran el portal, las pantallas en la cocina y la Redondopedia. No es un olvido
ahora, es una tarea del ciclo 5 â€” o una fila que `experiencia` retira del catÃ¡logo.

**Rangos:** el ciclo 4 consumiÃ³ `T-44`..`T-63`, `D-21`, `RES-44`..`RES-46`, `CTR-04`,
`CTR-05`, `BR-12`, `CNT-06`, `UX-05`, `REV-05`.

> âš  **Ojo con `D-22`: lo tomÃ³ la otra sesiÃ³n, no este ciclo.** Esta lÃ­nea decÃ­a que estaba
> libre y para cuando el ciclo 5 arrancÃ³ ya estaba escrito â€” es exactamente el choque de
> numeraciÃ³n que `Docs/IDS.md` avisa que pasa cuando dos sesiones escriben el mismo repo, y
> pasÃ³ igual. **`D-22` es "los temas enteros se alojan en el sitio, en mp3"**, y no es un
> detalle: saca "alojar los temas completos" de Fuera de alcance, baja a Spotify de promesa
> a extra, y mete un problema nuevo que es el peso (unas 7,2 horas de audio, entre 300 MB y
> 1 GB segÃºn bitrate). Su propia consecuencia 4 dice que **los lÃ­mites de Vercel para ese
> volumen no estÃ¡n fichados y conviene chequearlos antes y no despuÃ©s** â€” o sea que hace
> falta un `RES-XX` antes de subir el primer mp3.

Consumido por el ciclo 5 hasta ahora: `T-64`..`T-68`, `T-70`, `T-71`, `T-76`, `T-77`, `T-81`,
`RES-47`, `RES-48`, `BR-14`, `BR-15`, `CNT-07`. Libres: `T-82`+, `D-23`+, `RES-49`,
`CNT-08`+, `REV-06`+, `UX-06`+, `BR-16`+.
**ActualizaciÃ³n 2026-08-22:** `D-22` ya estÃ¡ tomado (los mp3 enteros) â€” el prÃ³ximo libre es
**`D-23`**. TambiÃ©n se consumieron `BR-15`/`BR-16` e `IDEA-01`..`IDEA-10` (backlog de
ideas), y el ciclo 5 tiene reservados `BR-13`/`BR-14` para `T-66`/`T-67`.

> ðŸ†• **La Redondopedia ya estÃ¡ construida y navegable con 26 de los 35 artÃ­culos del piso**
> (sesiÃ³n 2026-08-21 â€” ver bitÃ¡cora). El sitio entero tiene esqueleto: portal collage en
> `/`, el quiz mudado a `/quiz/` (los links de desafÃ­o viejos redirigen solos), tres
> pantallas "en la cocina" para los juegos que faltan, y `/redondopedia/` con portada e
> Ã­ndice por tipo. Lo que falta para el piso de `US-05`: los 6 `tema` (esperan la carga de
> letras con el filtro de `D-13`) y Bulacio y OlavarrÃ­a (esperan la relectura de `CNT-04`,
> `BR-10` â€” por eso `hito` estÃ¡ en 5/7). De las tres dependencias del PRD, el hilo
> principal dejÃ³ **versiones v0 andando** y una propuesta por rol en `Docs/SUGERENCIAS/`:
> el contrato de colecciÃ³n con rÃ³tulo por afirmaciÃ³n vive en `src/lib/redondopedia.ts` +
> `src/data/redondopedia.json` (formalizar: `arquitectura`), el patrÃ³n de lectura y el
> rÃ³tulo visual en prosa viven en `src/styles/sitio.css` (bendecir: `experiencia`), y el
> chequeo del grafo de `BR-09` corre como test (`npm test`, sin huÃ©rfanos ni callejones).

Tres frentes, y el primero es el que mÃ¡s acerca el "Listo":

1. **Los otros tres juegos no tienen un solo Ã­tem.** `US-02` (adivinar el tema) tiene
   contrato (`CTR-03`) pero necesita que **vos recortes los primeros mp3** â€” `origen` y
   `fechaCorte` no son inventables. `US-03` (completar la letra) tiene fuente desde `D-13`
   pero le falta el schema `CTR-04`. `US-04` (adivinar la tapa) necesita `CTR-05` y las
   imÃ¡genes.
2. **`letras` sigue en 0/10** y son las 10 que faltan para el piso de 40 de `US-01`.
3. **Desplegar.** No hay nada que lo bloquee: `D-14` sacÃ³ el gate y `D-15` eligiÃ³ Vercel
   con salida estÃ¡tica. Conectar el repo y listo.

**Hay un brand system en curso en otra sesiÃ³n.** Cuando aterrice, reemplaza los valores de
`src/styles/tokens.css` y **no hace falta tocar `src/styles/juego.css`**: ese archivo no
tiene un solo color literal, todo sale de variables. Ojo con una cosa: hay un test que
exige **WCAG AA en 12 pares de color**, asÃ­ que cualquier paleta nueva tiene que pasarlo.

Lo que sigue despuÃ©s, por orden de valor:

1. **Actuar sobre `REV-01`.** `revisor` encontrÃ³ que `CNT-01` estÃ¡ **desactualizada
   respecto de investigaciÃ³n que ya existe**: 4 de las 11 preguntas de derechos tienen
   respuesta en `RES-06` y `RES-09`, y la nota las trata como si siguieran en cero
   (`FIND-01` a `FIND-04`). Se arregla leyendo, sin investigar nada. DueÃ±o: `contenido`.
2. ~~**La decisiÃ³n de alcance de `producto`** sobre el piso de `US-01`.~~ **YA NO HACE
   FALTA.** PartÃ­a de que no habÃ­a fuente de letras; el usuario decidiÃ³ las fuentes y el
   piso de 40 vuelve a ser alcanzable. Ver el bloque âœ… del encabezado. Lo que sÃ­ queda para
   `contenido` es **cargar los versos aplicando el filtro de los 105 temas de `RES-20`**.
3. **âš  `ADR-01` cambiÃ³ de eje y conviene mirarlo antes de escribir integraciÃ³n.**
   `RES-26` encontrÃ³ que la **Spotify Developer Policy III.2 dice textualmente *"Do not
   create a game, including trivia quizzes."*** Verificado en dos fetches independientes.
   Eso **compromete la opciÃ³n A (embed)** por contrato, no por dificultad tÃ©cnica, y
   **vuelve irrelevante `E-04`**: aunque la prueba diera que el embed reproduce el tema
   entero sin Premium, seguirÃ­a prohibido. **PodÃ©s sacar esa prueba de tu lista.**
   La opciÃ³n B (deep link) probablemente sobrevive â€”`RES-09` verificÃ³ que el catÃ¡logo estÃ¡
   en Spotify oficialmente desde 2017â€” pero **falta responder una sola pregunta: si un deep
   link simple cuenta como "acceder a la Spotify Platform"**. Esa pregunta reemplaza a
   `E-04`. Propuesta para `arquitectura` y `producto` en
   `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md`.
   La prueba de `E-07` que sÃ­ sigue teniendo sentido: abrir un deep link desde el celular
   sin Premium y anotar si suena a demanda o entra en shuffle.

**Cerrado del ciclo 1:** las 14 tareas, `T-01` a `T-14`, mÃ¡s los seis hallazgos de
`REV-01` y los dos de `REV-02`. Nada quedÃ³ abierto de ese ciclo.

Si querÃ©s avanzar por otro lado en vez de seguir el plan, hay **tres frentes que no se
bloquean entre sÃ­**:

1. **`investigador`** â€” quedan las dos preguntas de `ADR-01` (`E-04`: quÃ© reproduce el
   embed de Spotify para alguien sin Premium; `E-07`: si un usuario free en Argentina puede
   escuchar un tema a demanda). **Los tracklists ya no estÃ¡n pendientes** (`RES-20`: los
   diez discos, 105 temas), ni las referencias de Rocambole (`RES-06`), y 4 de las 11
   preguntas de derechos quedaron respondidas entera o parcialmente (`RES-06`, `RES-09`).
   **La fuente de letras tambiÃ©n quedÃ³ decidida** (ver el bloque âœ… del encabezado): ya no
   es un pendiente de investigaciÃ³n sino de carga.
2. **`contenido`** â€” es, por lejos, el rol con mÃ¡s material sin usar: schema (`CTR-02`),
   tono (`CNT-02`), discografÃ­a (`RES-02`), **cronologÃ­a (`RES-05`), mitologÃ­a rotulada
   (`RES-08`), tracklists con autorÃ­a (`RES-20`)** y las memorias del Indio en PDF
   (`RES-21`). Tres preguntas ya vienen casi servidas: "Ji ji ji" y su leyenda desmentida
   por el autor (`RES-08`), la letra impresa en el sobre de *Oktubre* de un tema que no
   estÃ¡ en el disco (`RES-22`), y los dos Ãºnicos temas con un tercer autor (`RES-20`).
   Antes del primer lote tiene que fijar el lÃ­mite editorial sobre Bulacio y OlavarrÃ­a
   (`RES-07`) â€” y ojo que el capÃ­tulo 14 del memoir se llama "Walter David Bulacio".
3. **Vos** â€” dos cosas, las dos cortas:
   - Ya podÃ©s recortar audio siguiendo `CTR-01` (`Docs/ARQ/ARQ-fragmento-audio.md`,
     secciones `CTR-01.6` y `CTR-01.7`). **No te saltees guardar el mÃ¡ster en WAV fuera
     del repo:** es lo Ãºnico que hace barato bajar la duraciÃ³n si la nota de derechos lo
     pide.
   - **PodÃ©s desbloquear `ADR-01` vos mismo en cinco minutos.** `E-04` pregunta quÃ©
     reproduce el embed de Spotify para alguien sin Premium, y no aparece en ninguna
     fuente primaria. Como tenÃ©s Premium, la prueba es directa: abrÃ­
     `https://open.spotify.com/embed/track/<trackId>` de cualquier tema en una ventana de
     incÃ³gnito (sin sesiÃ³n) y despuÃ©s con tu sesiÃ³n iniciada, y anotÃ¡ si suena el tema
     entero o se corta a los 30 segundos. `ADR-01` ya dejÃ³ dicho que eso vale como
     **observaciÃ³n fechada del proyecto**, un escalÃ³n por debajo de una fuente y rotulada
     como tal.

## Tablero

| Ãtem | Rol | Estado | Nota |
|---|---|---|---|
| Historias, pisos de Ã­tems y reglas de negocio de los 4 juegos | `producto` | hecho | `US-01`..`US-04`, `BR-01`..`BR-03` en `Docs/PRODUCTO/PRD-alcance-v1.md`. Pisos: **40 / 30 / 15 / 10** â€” el de `US-02` subiÃ³ de 20 a 30 en `T-99` (ciclo 7) |
| `T-01` â€” `BR-04`: opciones por pregunta | `producto` | hecho | **4 opciones**, mismo nÃºmero para `US-01` y `US-04`. Fundamento: con 3 el azar sube a 33% y vacÃ­a "premiar al que sabe"; con 5 cede "jugable con el pulgar". `CTR-02.5` pasa de valor de trabajo a **confirmado** sin editar `Docs/ARQ/` |
| `ADR-01` â€” vÃ­a de integraciÃ³n con Spotify | `arquitectura` | **en curso** | `Docs/ARQ/ARQ-spotify-integracion.md`, revisiÃ³n 2. **C y D descartadas con evidencia** (`RES-01`). Quedan A (embed) contra B (deep link), y solo faltan `E-04` y `E-07`. **El fallback ya estÃ¡ cerrado**, asÃ­ que no frena a nadie |
| `CTR-01` â€” fragmento de audio | `arquitectura` | hecho | MP3 mono 44,1 kHz 96 kbps, mÃ¡x **10,0 s â€” cerrado por `CNT-01`, ya no es valor de trabajo** (`T-09` + `T-10`). Escalera del reveal **0,1 / 0,5 / 2,0 / 5,0 / 10,0 s**; precarga recalculada a **5,3 MB**. CrÃ©dito (tema/disco/aÃ±o) ahora es campo **obligatorio**: publicar audio sin firmar no valida. `BR-02` sobrevive sin cambios |
| `T-02` â€” `BR-05`: cortes de los tramos de resultado | `producto` | hecho | **30% y 70%**. El corte de abajo se separÃ³ a propÃ³sito del 25% del azar, para que "medio" no se llene de respuestas tiradas al voleo. Los 9 resultados posibles de una ronda de 8 caen 3 en cada tramo |
| `T-03` â€” `BR-06`: quÃ© promete la v1 sobre Spotify | `producto` | hecho | `Docs/PRODUCTO/PRD-promesa-spotify.md`. Promete **acceso** al tema, no reproducciÃ³n Ã­ntegra. Redactada para que ningÃºn desenlace de `E-04` ni `E-07` obligue a reescribirla. **El brief ya fue corregido** |
| `T-04` â€” schema corrible del quiz | `arquitectura` | hecho | `src/data/_schema/quiz.schema.json`. **Verificado por el hilo principal contra 8 casos** (`D-12`): rechaza Ã­tem sin fuente, leyenda sin rÃ³tulo, 3 o 5 opciones, fuente con formato invÃ¡lido, y ninguna opciÃ³n correcta |
| `CNT-03` â€” criterios sobre las discrepancias | `contenido` | hecho | `Docs/CONTENIDO/CNT-03-criterios-discografia.md`. VedÃ³ el sello de *Luzbelito* y el conteo pelado de Ã¡lbumes. **Ojo: `RES-20` resolviÃ³ lo de *Luzbelito* despuÃ©s â€” el veto se puede levantar** |
| `RES-10` â€” Spotify free a demanda en Argentina | `investigador` | hecho | `Docs/INVESTIGACION/INV-03-spotify-free-argentina.md`. **SÃ­ se puede elegir tema desde sep-2025, pero con cupo diario no divulgado.** Sin confirmaciÃ³n por paÃ­s ni para el reproductor web |
| `CTR-02` â€” schema del banco del quiz | `arquitectura` | hecho | `Docs/ARQ/ARQ-schema-quiz.md`. **Desbloquea a `contenido`.** Convierte dos criterios blandos en validaciones de mÃ¡quina (ver abajo) |
| `ADR-02` â€” formato del link de resultado compartido | `arquitectura` | hecho | `Docs/ARQ/ARQ-link-resultado-compartido.md`. **Ojo `UX-02`:** la vista previa del tuit no puede llevar el puntaje |
| `CTR-03`..`CTR-05` â€” schemas de `US-02`, `US-03`, `US-04` | `arquitectura` | pendiente | No se escribieron a medias a propÃ³sito. `US-01` es P0 y era lo que desbloqueaba |
| `RES-01` â€” estado real de las APIs de Spotify | `investigador` | hecho | `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`. `preview_url` restringido desde el 27-nov-2024; el SDK exige Premium |
| `RES-02` â€” discografÃ­a de estudio | `investigador` | hecho | Nueve Ã¡lbumes con aÃ±o y sello, cruzados en tres fuentes. **Trae tres discrepancias sin promediar** â€” leerlas antes de escribir preguntas |
| `RES-03` â€” marco de derechos en Argentina | `investigador` | hecho | No hay *fair use* en Argentina; el derecho de cita topea en **8 compases** de mÃºsica y 1000 palabras de texto (Art. 10, Ley 11.723) |
| Referencias visuales de Rocambole | `investigador` | **hecho** | `RES-06` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. TÃ©cnica, Ã­conos, origen de cada tapa y su postura sobre uso libre. **Levanta el bloqueo de `UX-04`** |
| `RES-04` â€” muerte del Indio Solari | `investigador` | hecho | **MuriÃ³ el 5-jun-2026.** Dos fuentes independientes. Nadie lo habÃ­a registrado. Ver la alerta arriba |
| `RES-05` â€” cronologÃ­a verificada de la banda | `investigador` | hecho | FormaciÃ³n, hitos, recitales grandes, Ãºltimo show y separaciÃ³n. **Corrige el "HuracÃ¡n en el 89" del BRIEF: fue 93 y 94** |
| `RES-07` â€” cultura ricotera (misa, aguante, autogestiÃ³n) | `investigador` | hecho | Insumo de tono y de sistema visual. **Trae un lÃ­mite editorial a decidir**: Bulacio y OlavarrÃ­a son muertes reales |
| `RES-08` â€” mitologÃ­a ricotera rotulada | `investigador` | hecho | "Ji Ji Ji" y su leyenda **desmentida por el propio Indio en 2007**. Insumo directo de la categorÃ­a mitologÃ­a |
| `RES-09` â€” titularidad de derechos y catÃ¡logo en streaming | `investigador` | hecho | **Erks S.A.** (Indio/Skay/Poli, 1992). CatÃ¡logo completo en Spotify desde el 28-jul-2017 vÃ­a The Orchard. **Le sirve a `ADR-01`** |
| `RES-20` â€” tracklists de los 10 discos | `investigador` | **hecho** | `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`. **105 temas** con duraciÃ³n y autorÃ­a por tema. **Desbloquea `US-02` y `US-03`.** Resuelve el sello de *Luzbelito*; trae 3 discrepancias nuevas sin promediar |
| `RES-21` â€” el memoir del Indio como fuente | `investigador` | hecho | PDF del usuario en `Docs/INVESTIGACION/`. Mapa de los 27 capÃ­tulos. **El propio libro se declara "apenas mi versiÃ³n", no verdad unÃ­voca** â€” usarlo como *testimonio rotulado*, tercera categorÃ­a ademÃ¡s de hecho y leyenda |
| `RES-22` â€” correcciones a `INV-02` desde fuente primaria | `investigador` | hecho | **Corrige `RES-05`** (Patricio Rey: el personaje es invento, pero Rocambole dijo que existÃ­a y vivÃ­a en Salta). Confirma `RES-08`. **Sube 3 tapas de "reportado" a testimonio** y cubre el hueco de *Ãšltimo bondi* |
| `RES-23` â€” letras.com como fuente de letras | `investigador` | hecho, **con decisiÃ³n del usuario encima** | `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md`. La ficha responde la pregunta 9 en negativo: contribuciÃ³n abierta, sin licencia declarada, 149 temas contra los 105 reales. **Pero el usuario decidiÃ³ usarla igual** (mÃ­stica de pocas cosas oficiales) con 5 mitigaciones. **No escales esto a bloqueo de alcance sin leer la secciÃ³n final del archivo** |
| `RES-24` â€” *Fuimos reyes*: estructura y lÃ­mite del preview | `investigador` | hecho | El lector web estÃ¡ topeado en **1%**: la secciÃ³n "DiscografÃ­a" figura en el Ã­ndice pero **no carga**. SÃ­ quedÃ³ el **mapa completo de los 20 capÃ­tulos**. Si el usuario consigue el libro, **abrir primero "DiscografÃ­a"**: resuelve las tres discrepancias vivas de una |
| `RES-25` â€” de dÃ³nde salen las tapas: 6 vÃ­as | `investigador` | hecho | `Docs/INVESTIGACION/INV-22-imagenes-tapas-y-spotify.md`. **Ocho vÃ­as descartadas**; solo Cover Art Archive queda como conducto tÃ©cnico, y **no mejora la posiciÃ³n legal, solo no la empeora**. **bestiarioredondo no tiene tapas** (su unidad es la canciÃ³n) y no declara licencia. **Ninguna vÃ­a resuelve el derecho** |
| âš  `RES-26` â€” Spotify prohÃ­be los juegos por contrato | `investigador` | **hecho â€” decisivo** | Developer Policy III.2 textual: *"Do not create a game, including trivia quizzes."* Verificado en dos fetches independientes. **Compromete la opciÃ³n A de `ADR-01` y anula `E-04`.** Propuesta en `Docs/SUGERENCIAS/INV-para-arquitectura-y-producto-spotify-prohibe-juegos.md` |
| `CNT-01` â€” nota de derechos | `contenido` | **esbozo, al dÃ­a** | `Docs/CONTENIDO/CNT-01-nota-derechos.md`. DuraciÃ³n cerrada en 10 s (`T-09`) y los seis hallazgos de `REV-01` incorporados: ya refleja `RES-06` y `RES-09`, y **"obra registrada" bajÃ³ de `[x]` a supuesto heredado** (`FIND-05`). **El gate de `D-07` sigue cerrado**: faltan las 8 preguntas legales de fondo, que ninguna ficha responde todavÃ­a |
| `CNT-02` â€” guÃ­a de tono | `contenido` | hecho | Regla central: la jerga va en el tono, nunca en la barrera. Cuatro pares bien/mal |
| Primer lote de preguntas del quiz | `contenido` | **hecho** | `src/data/quiz.json`, **15 preguntas** `QZ-001`..`QZ-015` (10 `discos` + 5 `mitologia`). **Validado por el hilo principal: `OK 15 items, sin fuente: 0`**, 6 fÃ¡ciles / 6 medias / 3 difÃ­ciles. Faltan 25 para el piso de `US-01` |
| `REV-01` â€” revisiÃ³n de la nota de derechos | `revisor` | hecho | `Docs/REVISIONES/REV-01-nota-derechos.md`. `FIND-01`..`FIND-06`. **Veredicto: el gate sigue cerrado**, pero no porque la nota mienta â€” porque estÃ¡ desactualizada respecto de `RES-06` y `RES-09` |
| `REV-02` â€” revisiÃ³n del lote del quiz | `revisor` | hecho | `Docs/REVISIONES/REV-02-lote-quiz.md`. `FIND-10` (bloqueante) y `FIND-11`. **14 de 15 preguntas bien citadas.** `FIND-10` se resolviÃ³ con `RES-20`, que llegÃ³ durante la revisiÃ³n: la respuesta era correcta, faltaba la cita que la hace Ãºnica |
| CorrecciÃ³n de `FIND-10` y `FIND-11` | `contenido` | hecho | `QZ-005` cita `RES-02` + `RES-20`; `QZ-001` y `QZ-006` pasaron a `media`; `QZ-011` y `QZ-012` sumaron pista real. **Revalidado por el hilo principal: `OK 15 items, sin fuente: 0`**, mÃ¡ximo de enunciado 163/180. Ambos hallazgos cerrados |
| `UX-01`..`UX-04` â€” flujo del quiz, tarjeta compartible, reveal sin auriculares, sistema visual | `experiencia` | hecho | En `Docs/UX/`. Citan los IDs reales de `producto`, no supuestos |
| Plan del ciclo 1 | `orquestador` | hecho | `Docs/ORQ/ORQ-plan-ciclo-1.md`. 14 tareas, pasada de conflictos escrita, reservas de ID por la sesiÃ³n paralela |
| Primera revisiÃ³n de coherencia | `revisor` | pendiente | `T-11` y `T-12` del ciclo 1. Ya hay siete entregables para revisar |
| Reserva de rangos de ID entre sesiones | hilo principal | hecho | `Docs/IDS.md`, secciÃ³n "Reserva de rangos". **Cierra `T-14` antes de que arranque el ciclo** |
| `US-05` + `BR-07`..`BR-11` â€” la Redondopedia | `producto` | hecho | `Docs/PRODUCTO/PRD-redondopedia.md`, consume `D-20`. Seis tipos de artÃ­culo, piso **35**, navegaciÃ³n sin huÃ©rfanos verificable (`BR-09`), rotulado granular en prosa (`BR-08`), Bulacio y OlavarrÃ­a como artÃ­culos propios con contingencia (`BR-10`), orden de recorte interno (`BR-11`). Tres dependencias seÃ±aladas: `arquitectura`, `experiencia`, `contenido` |
| Esqueleto del sitio: portal, rutas y collage | hilo principal | **hecho** | Portal en `/` (lado A juegos, lado B lectura), quiz en `/quiz/` con redirecciÃ³n de desafÃ­os viejos, 3 pantallas "en la cocina", `Base.astro`, `sitio.css` sin un hex, recortes reemplazables en `public/arte/` con despiece fundado en `RES-06`/`RES-22` (README de esa carpeta). Tokens nuevos `--papel` y `--textura-grano` â€” **deuda: aterrizarlos en el lienzo, hoja 07** |
| Redondopedia v1 â€” primera tanda cargada | hilo principal | **hecho, 26/35** | `src/data/redondopedia.json`: 10 `disco` + 5 `persona` + 5 `hito` + 4 `concepto` + 2 `leyenda`, desde las fichas `RES-` vÃ­a redacciÃ³n + verificaciÃ³n adversarial (21 hallazgos, 5 bloqueantes, todos corregidos â€” el patrÃ³n repetido: inflar "Patricio Rey Discos" a "sello propio de la banda" sin ficha). `BR-08` como segmentos con rÃ³tulo+fuente; `BR-09` como test. Faltan 6 `tema` (`D-13`) y Bulacio/OlavarrÃ­a (`CNT-04`) |
| Tapas reales bajadas y en las fichas de disco | hilo principal | hecho | 35 imÃ¡genes de Coveralia (frontal/trasera/CD/interior segÃºn disponibilidad) en `Docs/INVESTIGACION/TapasDiscos/`; bajas de 320 px en `public/tapas/` (`node scripts/generar-tapas.mjs`) â€” solo en artÃ­culos `disco`, con crÃ©dito a Rocambole (`BR-07`, `D-04`, `UX-04`) |

> âš  **Este Tablero es histÃ³rico y algunas filas quedaron viejas.** Las conocidas al
> 2026-08-25: la Redondopedia dice 26/35 y **cerrÃ³ en 35/35**; `CTR-03`..`CTR-05` figuran
> pendientes y **estÃ¡n escritos**; `ADR-01` figura en curso y `RES-51` lo cerrÃ³ en
> negativo. **Para el estado real de los pisos, mirÃ¡ la tabla de "PrÃ³ximo paso".**

Estados posibles: `pendiente` Â· `en curso` Â· `bloqueado` Â· `hecho` Â· `cancelado`

## Ideas guardadas â€” no se hacen ahora

> Pedidos del usuario registrados a propÃ³sito **fuera** del ciclo en curso. No son
> bloqueos ni tareas: son cosas que van a pasar, todavÃ­a sin fecha. Las dos primeras siguen
> sin ID, con su propuesta en `Docs/SUGERENCIAS/`; las diez ideas de juegos del 2026-08-22
> ya tienen ID propio â€” ver abajo.

| Idea | Origen | DueÃ±os cuando se tome | Puntero |
|---|---|---|---|
| **Que el sitio intente hablar como el Indio.** Analizar a fondo letras, entrevistas y demÃ¡s archivo para destilar una guÃ­a de voz por encima de `CNT-02` y `D-17`. El usuario la marcÃ³ como idea futura, con esas palabras | usuario, 2026-08-21 | `investigador` junta el corpus (Ãºnica puerta a la web), `contenido` destila la guÃ­a | `Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md` |
| **Las bandas ricoteras de despuÃ©s de la separaciÃ³n entran a la Redondopedia.** El usuario nombrÃ³ tres: *La Kermesse Redonda*, *Indio y los Fundamentalistas del Aire Acondicionado* y *Skay y los Fakires*. **Que entran no estÃ¡ en discusiÃ³n**; falta ficha que verifique los nombres y decisiÃ³n de `producto` sobre tipo y piso | usuario, 2026-08-21 | `investigador` (ficha), `producto` (tipo + piso), `contenido` (escribe) | `Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md` |

### Las ideas de juegos guardadas â€” `IDEA-01`..`IDEA-11`

El usuario tirÃ³ diez ideas de una y pidiÃ³ **guardarlas todas sin empezar ninguna**. Esas
diez estÃ¡n en `Docs/PRODUCTO/PRD-backlog-ideas.md`, cada una con su ancla ricotera verificada contra
los 105 temas de `RES-20` y con el choque que tiene contra lo ya decidido.

| ID | Idea | Tipo |
|---|---|---|
| `IDEA-01` | Separar los temas en pistas y adivinar | original (probable modo de `US-02`) |
| `IDEA-02` | Doom gore â€” *Masacre en el puticlub* | clon vestido |
| `IDEA-03` | Crazy Toxi-Taxi | clon vestido |
| `IDEA-04` | Plataformas: colgarse del Ãºltimo bondi, con *Gualicho* de fondo | clon vestido |
| `IDEA-05` | DibujÃ¡ tu bandera y colgala | original |
| `IDEA-06` | ZoolÃ³gico de los personajes | original (probable tipo nuevo de `US-05`) |
| `IDEA-07` | Un Pacman en el Savoy | clon vestido |
| `IDEA-08` | Letras y acordes | original, no es juego |
| `IDEA-09` | Test de dos ejes: quÃ© tipo de ricotero sos | original |
| `IDEA-10` | Guitar Hero ricotero | clon vestido |
| `IDEA-11` | Mayor o menor: quÃ© palabra se dice mÃ¡s en el cancionero | original (gÃ©nero conocido, motor mÃ­nimo) |
| `IDEA-13` | Supabase: correcciones, puntajes, jugadores | infraestructura, no es juego |
| `IDEA-14` | Skayboy y Poligirl: dos personajes, una puerta, cielo e infierno | clon vestido â€” **relevada a fondo el 2026-09-11**, ver el bloque del principio de este archivo |
| `IDEA-15` | Los recitales en pantalla | original â€” **hecha el 2026-10-15** ("En vivo", `D-72`) |
| `IDEA-16` | ArmÃ¡ tu propio recital, con los recortes | original â€” **hecha el 2026-10-15** (`D-72`) |

Dos reglas nuevas salieron de ahÃ­: **`BR-15`** (los clones se adoptan vestidos, no se
escriben â€” instrucciÃ³n transversal del usuario) y **`BR-16`** (una idea no entra a un ciclo
sin promoverse antes a `US-XX`). Prefijo `IDEA-` registrado en `Docs/IDS.md`.

> **Al dÃ­a el 2026-10-15 (`D-72`).** Lo que de esta tabla ya estÃ¡ en el sitio: `IDEA-08` (Letras y
> acordes), `IDEA-09` (`US-06`, Â¿QuÃ© tipo de ricotero sos?), `IDEA-11` (`US-10`, MÃ¡s o menos), `IDEA-14`
> (`US-09`, Skayboy y Poligirl), `IDEA-15` (los recitales en pantalla, "En vivo") e `IDEA-16` ("ArmÃ¡ tu
> recital"). Las dos ideas sin ID de mÃ¡s arriba tambiÃ©n: la voz del Indio es `.claude/rules/voz-ricotera.md`
> y las tres bandas de despuÃ©s de la separaciÃ³n tienen su artÃ­culo en la Redondopedia. Siguen sin empezar
> `IDEA-01` a `IDEA-07`, `IDEA-10` e `IDEA-13`.

**Nada de esto es alcance de la v1 y nada de esto estÃ¡ empezado.** Tres preguntas quedaron
abiertas al usuario, listadas al final del PRD: quÃ© es "el gordo Pier" (no figura en los
105), quÃ© es "la tumba del Indio" de `IDEA-05`, y cuÃ¡l de las tres salidas de audio quiere
para `IDEA-10`.

**`IDEA-11` llegÃ³ despuÃ©s, el 2026-08-23**, y todavÃ­a **no estÃ¡ pegada en el PRD**: la
carpeta es de `producto`, asÃ­ que la ficha entera quedÃ³ como propuesta en
`Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md`, con el nÃºmero ya reservado
en `Docs/IDS.md`. El usuario pidiÃ³ textual *"no hay que desarrollarlo ahora, agregalo como
idea"*. Es de las dos mÃ¡s baratas del backlog â€”el corpus ya estÃ¡ en el repo desde el ciclo
6â€” y no toca `BR-03` ni `BR-12` porque muestra palabras sueltas, no versos. **Su Ãºnico
choque es serio y estÃ¡ medido:** el conteo es la respuesta correcta, y hoy el cancionero
trae anotaciÃ³n de cifra adentro de lÃ­neas tipadas como letra, asÃ­ que la palabra mÃ¡s
cantada de los Redondos da `riff` (306). Sin limpiar eso, el juego le marca error al que
se sabe el tema.

**`IDEA-04` recibiÃ³ su meta el 2026-08-23** y tampoco estÃ¡ pegada todavÃ­a en el PRD:
ficha actualizada en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`.
El usuario pidiÃ³ "un mario de plataformas simple pero que hay que llegar a tomar el Ãºltimo
bondi a Finisterre" â€” **no es un juego nuevo, es `IDEA-04` con lo que le faltaba**, asÃ­ que
no se abriÃ³ ID nuevo. La meta **cierra el choque principal que la ficha tenÃ­a escrito**: el
que corta el nivel es el bondi que arranca, no un lÃ­mite puesto de afuera, y de paso empuja
los controles hacia un solo botÃ³n. Sigue abierto lo caro: motor 2D con licencia (`BR-15`) y
el skin, que en un plataformas es el mÃ¡s caro de los cinco clones.

**Y el 2026-08-24 el usuario le puso tema: *Gualicho*** (pista 4 del mismo disco), donde el
bondi a Finisterre estÃ¡ cantado y donde alguien se **cuelga** de Ã©l â€” que es el verbo del
juego. Con eso `IDEA-04` es **la Ãºnica de las cinco ideas de clon con su mÃºsica decidida**, y
con `D-22` el archivo existe. **Al ir a buscar el verso apareciÃ³ un agujero:** la letra de
*Gualicho* no estÃ¡ en el repo â€”cero lÃ­neas cantadas, tres lÃ­neas de cifrado tipadas como
letraâ€” y en el mismo disco *Pogo* estÃ¡ igual y *El Ã¡rbol del gran bonete* casi. Los tres son
de cifraclub. Es la misma deuda que bloquea `IDEA-11` y que `US-03` ya paga con sus 226
versos en borrador.


## Bloqueos abiertos

- **`ADR-01` espera evidencia, no trabajo.** Solo `E-04` y `E-07`; `E-02`, `E-03` y `E-08`
  quedaron **anuladas** (no pendientes) al descartarse la opciÃ³n C. No frena construir: el
  fallback estÃ¡ cerrado y `US-02` criterio 3 queda cubierto igual.
  ~~**`E-07` es ahora la pregunta que mÃ¡s pesa:** con C y D descartadas, el deep link es el
  Ãºnico camino que queda al tema completo, asÃ­ que si un usuario free en Argentina no
  puede reproducir a demanda, **ninguna vÃ­a cumple la promesa del brief**.~~
  âœ… **LEVANTADO por `D-22` (2026-08-22): el sitio aloja los temas enteros en mp3.** El deep
  link dejÃ³ de ser el Ãºnico camino al tema completo, asÃ­ que `E-07` y `E-04` dejan de decidir
  si la promesa se cumple. **En su lugar quedan tres preguntas nuevas, y son de peso y de
  infraestructura, no de Spotify:** dÃ³nde viven ~7,2 horas de audio (entre 300 MB y 1 GB
  segÃºn bitrate), si van adentro del repo que Vercel construye, y cuÃ¡les son los lÃ­mites de
  Vercel para ese volumen â€” lo Ãºltimo **sin ficha**, y es lo Ãºnico que conviene chequear
  antes de subir el primer archivo. Detalle en `D-22` y en
  `Docs/SUGERENCIAS/HILO-para-arquitectura-audio-alojado.md`.
- **`CNT-01` no puede pasar de esbozo a cerrable** hasta que `investigador` responda las
  11 preguntas de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`. **Esto es lo que
  bloquea publicar** (`D-07`). No bloquea nada mÃ¡s.
- **`CTR-01.3` tiene un nÃºmero abierto:** la duraciÃ³n mÃ¡xima del fragmento, 15 s como
  valor de trabajo, la confirma la nota de derechos. Dato nuevo de `RES-03`: el techo del
  derecho de cita musical son 8 compases, que a 120 BPM en 4/4 son unos 16 s â€” el valor
  tÃ©cnico y el lÃ­mite legal quedaron cerca por caminos independientes.
- ~~**`UX-04` no tiene referencias reales de Rocambole fichadas.**~~ **LEVANTADO** por
  `RES-06`: tÃ©cnica (rodillo, serigrafÃ­a, aerografÃ­a, grabado, collage), origen de cada
  tapa, y la frase que ordena el criterio â€” *"yo no ilustraba la poesÃ­a o la mÃºsica, sino
  que era una parte integrante del mensaje"*. `experiencia` puede cerrar el brief de arte.
- ~~**No hay tracklists por disco.**~~ **LEVANTADO** por `RES-20`
  (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`): **los diez discos, 105 temas**, con
  duraciones y autorÃ­a por tema. `US-02` (piso 20) y `US-03` (piso 15) tienen de sobra.
- **Sigue abierto, y ahora con las dos vÃ­as fÃ¡ciles descartadas: el texto de las letras
  para `US-03`.** El PDF del memoir no sirve (cita versos sueltos dentro de la
  conversaciÃ³n), y **`RES-23` descartÃ³ letras.com**: es de contribuciÃ³n abierta, sin
  licencia declarada â€” o sea, exactamente la "fuente de fans sin respaldo" que `contenido`
  pidiÃ³ evitar en su pregunta 9. AdemÃ¡s lista **149 temas contra los 105 reales**, mezclando
  material del Indio solista y de Skay. **La fuente correcta es el arte de los discos**, y
  el volumen es chico: `BR-03` muestra 2/1/0 versos, asÃ­ que el piso de `US-03` necesita
  del orden de 30 versos, no 15 letras enteras. Techo legal sin cambios (`RES-03`).
- **Filtro obligatorio para `US-02` y `US-03`:** todo tema que entre tiene que estar en los
  **105 de `RES-20`**. Si no estÃ¡, no es de Patricio Rey.

## Decisiones pendientes

> **Limpiado el 2026-09-01 (`T-175`).** Esta secciÃ³n tenÃ­a trece entradas y **siete ya
> estaban resueltas**, algunas hacÃ­a dos semanas â€” con la de "cerrÃ¡ esto antes del primer
> lote" todavÃ­a puesta sobre lotes que ya se cargaron enteros. Una lista de pendientes con
> mayorÃ­a de resueltos no se lee: se saltea. Las resueltas se van con su resoluciÃ³n
> anotada, en una tabla, para no perder la traza.

### Lo que sigue abierto

- **CÃ³mo contar *Lobo suelto, cordero atado*** (Â¿9 o 10 discos?). Wikipedia en espaÃ±ol le
  da un artÃ­culo a cada volumen y a la vez los llama Ã¡lbum doble. **Sigue siendo trampa** y
  `CNT-03` la veda como pregunta. DueÃ±o: `contenido`.
- **La fecha de *Gulp!* tiene tres versiones** (22-abr / 20-jul / agosto de 1985). El aÃ±o
  sÃ­ es firme. Misma familia que la anterior, mismo dueÃ±o.
- **El sello de *Un baiÃ³n*.** `RES-02` dice Wormo, `RES-20` dice Del Cielito, y `RES-44`
  dice Wormo con reediciÃ³n en Del Cielito. **Probablemente no sea contradicciÃ³n sino dos
  ediciones**, y la evidencia cruzada estÃ¡ armada en
  `Docs/SUGERENCIAS/HILO-para-investigador-sello-de-un-baion.md`. Falta la ficha `RES-53`.
  DueÃ±o: `investigador`, que es la Ãºnica puerta a la web. **No hay nada roto en pantalla**:
  la Redondopedia ya declara la discrepancia de frente.
- **Bajo quÃ© tipo entran las bandas post-separaciÃ³n**, y quÃ© le hace eso al piso de 35 de
  la Redondopedia. `BR-07` tiene seis tipos y ninguno es `banda`. Que entren lo decidiÃ³ el
  usuario; el cÃ³mo, no. DueÃ±o: `producto`.
- **QuÃ© se hace con "HuracÃ¡n en el 89"** en `Docs/BRIEF.md` y `CLAUDE.md`. En el 89 fue el
  debut en Obras; HuracÃ¡n fue 93 y 94 (`RES-05`). Como frase retÃ³rica no rompe nada; el
  riesgo es que alguien la convierta en pregunta. DueÃ±o: vos, porque son archivos de raÃ­z.
- **`ADR-01`, vÃ­a primaria de Spotify.** Formalmente abierto y **materialmente muerto**:
  `RES-26` mostrÃ³ que la Developer Policy prohÃ­be los juegos y `D-22` sacÃ³ a Spotify del
  camino sirviendo los mp3. Queda para cerrarlo por escrito, no para decidirlo.

### Lo que se resolviÃ³ y seguÃ­a figurando acÃ¡

| DecÃ­a | CÃ³mo se resolviÃ³ |
|---|---|
| La promesa de "escuchar el tema completo vÃ­a Spotify" | **`D-22`**: el sitio sirve los temas enteros en mp3. `BR-06` ya lo habÃ­a reformulado y `US-02` c3 quedÃ³ reescrito hoy (`FIND-35`) |
| Cantidad de opciones por pregunta | **`BR-04`, `T-01` del ciclo 1**: cuatro. Cerrado antes del primer lote, como pedÃ­a |
| Cortes de puntaje de los tres tramos | **`BR-05`, `T-02`**: 30% y 70% |
| El sello de *Luzbelito* | **`RES-20`**: Del Cielito, cuarta fuente coincidente |
| Cierre de la nota de derechos antes de publicar | **`D-14`** sacÃ³ el cerrojo. `CNT-01` sigue existiendo pero **como mapa, no como gate** |
| LÃ­mite editorial sobre Bulacio y OlavarrÃ­a | **`CNT-04`** y **`CNT-06`**. Y `QZ-025` se reformulÃ³ hoy (`T-169`) porque se acertaba con civismo |
| Si el sitio menciona que el Indio muriÃ³, y dÃ³nde | **`CNT-06`** y la Redondopedia, en registro 3 |

## BitÃ¡cora

| Fecha | QuÃ© pasÃ³ |
|---|---|
| 2026-08-19 | Proyecto instanciado. Roster de 7 roles, ampliaciÃ³n justificada en `Docs/EQUIPO.md`. |
| 2026-08-19 | `/kickoff`: entrevista de 16 preguntas. `Docs/BRIEF.md` reescrito entero, `D-05`..`D-10` registradas. Confirmados los 4 juegos y el tono; **corregidos** tres supuestos: el usuario no tiene material de audio propio (`D-06`), sÃ­ hay difusiÃ³n por Twitter (`D-10`), y el gate de derechos se partiÃ³ en construir contra publicar (`D-07`). |
| 2026-08-19 | `producto` fijÃ³ `US-01`..`US-04`, `BR-01`..`BR-03` y los pisos 40/20/15/10. |
| 2026-08-19 | `experiencia` entregÃ³ `UX-01`..`UX-04`. La tarjeta compartible pasÃ³ a pieza de primera clase por `D-10`. |
| 2026-08-19 | `contenido` entregÃ³ `CNT-01` (nota de derechos, esbozo) y `CNT-02` (guÃ­a de tono), y dejÃ³ 11 preguntas para `investigador`. |
| 2026-08-19 | `arquitectura` entregÃ³ `ADR-01` (propuesta, con el fallback ya cerrado), `CTR-01`, `CTR-02` y `ADR-02`. |
| 2026-08-19 | `investigador` entregÃ³ `RES-01`..`RES-03`. **Dos hallazgos pesados:** `preview_url` estÃ¡ restringido para apps nuevas desde el 27-nov-2024, y los tÃ©rminos de YouTube prohÃ­ben descargar, lo que **contradice la premisa con que se tomÃ³ `D-06`**. Registrado como actualizaciÃ³n de `D-06`; la decisiÃ³n sigue siendo del usuario y sigue en pie. |
| 2026-08-19 | `ADR-01` revisiÃ³n 2: incorporÃ³ `RES-01` y **descartÃ³ las opciones C y D con evidencia**. Quedan embed contra deep link, faltando solo `E-04` y `E-07`. |
| 2026-08-19 | `CLAUDE.md` mandaba correr `scripts/validar_instancia.py`, que no existe en este repo. Corregido a la ruta real del instanciador y registrado como `D-11`. ValidaciÃ³n: **APTA**, 0 errores, 1 aviso esperado (7 roles). |
| 2026-08-19 | Chequeo de coherencia de IDs: **sin referencias colgadas**. Los Ãºnicos IDs citados y no definidos son los ejemplos de `Docs/IDS.md` y `CTR-03`, que es referencia hacia adelante marcada pendiente. |
| 2026-08-19 | `/ciclo`: `orquestador` cortÃ³ el **ciclo 1** en 14 tareas (`Docs/ORQ/ORQ-plan-ciclo-1.md`), con la pasada de conflictos escrita y no mental. Meta del ciclo: 15 de las 40 preguntas del piso de `US-01`. EncontrÃ³ de paso un hueco de propiedad: **`src/data/_schema/` no tiene dueÃ±o declarado**, y sin ese archivo la validaciÃ³n del banco no es corrible â€” resuelto como `T-04`. |
| 2026-08-19 | ArrancÃ³ una **segunda sesiÃ³n en paralelo** sobre hechos de la banda. Se reservaron rangos de ID en `Docs/IDS.md` para que dos sesiones que no se ven no escriban el mismo nÃºmero: `RES-04`..`RES-09` para la sesiÃ³n paralela, `RES-10`+ para esta. Cierra `T-14` antes de que el ciclo arranque. |
| 2026-08-19 | **`T-01` cerrada.** `BR-04`: 4 opciones por pregunta, igual para `US-01` y `US-04`. Era el gate interno del ciclo: destrabÃ³ `T-04`, `T-06`, `T-07`, `T-08` y `T-12`. `CTR-02.5` queda confirmado sin tocar `Docs/ARQ/`. |
| 2026-08-19 | **SesiÃ³n paralela de investigaciÃ³n cerrada.** Barrido amplio sobre la banda pedido por el usuario: `RES-04`..`RES-09` en `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`. ConsumiÃ³ su rango entero sin excederlo. **El hallazgo grande: el Indio Solari muriÃ³ el 5-jun-2026** y ningÃºn documento del repo lo registraba â€” alerta y decisiones en `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`. De paso: **levantÃ³ el bloqueo de `UX-04`** (`RES-06`), respondiÃ³ 4 de las 11 preguntas de derechos de `contenido`, y encontrÃ³ que **el catÃ¡logo estÃ¡ en Spotify oficialmente desde el 28-jul-2017**, lo que refuerza el deep link en `ADR-01`. CorrigiÃ³ ademÃ¡s el ejemplo "HuracÃ¡n en el 89" del BRIEF: fue 1993 y 1994. |
| 2026-08-19 | **Segunda tanda de la sesiÃ³n de investigaciÃ³n: fuentes primarias.** El usuario consiguiÃ³ los libros y puso *Recuerdos que mienten un poco* en PDF dentro de `Docs/INVESTIGACION/`. Salieron `RES-20`..`RES-22` en `INV-20-fuentes-primarias.md`. **`RES-20` levanta el bloqueo mÃ¡s grande: los tracklists de los diez discos, 105 temas con duraciÃ³n y autorÃ­a** â€” `US-02` y `US-03` ya tienen de dÃ³nde sacar Ã­tems, y de paso queda respondida la pregunta 8 de `contenido` (la autorÃ­a es Solariâ€“Beilinson salvo dos temas que suman a Bucciarelli). **`RES-22` corrige `RES-05`:** yo habÃ­a escrito que Patricio Rey nunca existiÃ³ como persona; el memoir muestra que Rocambole declarÃ³ lo contrario y que el Indio no lo desmiente. Se resolviÃ³ ademÃ¡s el sello de *Luzbelito* (Del Cielito, cuarta fuente). |
| 2026-08-19 | **Ciclo 1 cerrado: las 14 tareas.** `BR-04`/`BR-05`/`BR-06` de `producto`; `CTR-01` con la duraciÃ³n cerrada en 10 s y la escalera recalculada, `CTR-02`, `ADR-02` y el schema corrible de `arquitectura`; `CNT-01` secciÃ³n A, `CNT-03` y **las primeras 15 preguntas** de `contenido`; `RES-10` de `investigador`; y las dos primeras revisiones del proyecto. Banco validado: `OK 15 items, sin fuente: 0`. |
| 2026-08-19 | **Las dos revisiones encontraron cosas reales, que es el punto.** `REV-01`: la nota de derechos no miente, pero estÃ¡ desactualizada respecto de fichas que ya llegaron (`FIND-01`..`FIND-04`), y afirmaba con casilla marcada que Rocambole tiene "obra registrada" sin ninguna ficha que lo respalde (`FIND-05`) â€” corregido tambiÃ©n en su origen, `D-04`. `REV-02`: `QZ-005` era bloqueante porque su respuesta no era Ãºnica con la evidencia de entonces (`FIND-10`); **`RES-20` llegÃ³ durante la revisiÃ³n y la resolviÃ³**, asÃ­ que se arreglÃ³ agregando la cita, no borrando la pregunta. |
| 2026-08-19 | **`D-12`, la lecciÃ³n estructural del ciclo.** Cuatro de los siete roles no tienen herramienta de ejecuciÃ³n, asÃ­ que no pueden correr las verificaciones que sus propias tareas exigen. Se decidiÃ³ **no darles `Bash`** â€”el que fabrica no se autocertificaâ€” sino **rutear** la verificaciÃ³n al hilo principal o a `revisor`. La evidencia que cerrÃ³ la discusiÃ³n llegÃ³ el mismo dÃ­a: `contenido` reforzÃ³ dos enunciados, los validÃ³ a mano, reportÃ³ que estaban bien, y **habÃ­an quedado en 242 y 277 caracteres contra un tope de 180**, rompiendo el schema. Corregidos a 155 y 163. |
| 2026-08-19 | Tercera confirmaciÃ³n de que la reserva de rangos funciona: las dos revisiones respetaron `FIND-01`..`FIND-09` y `FIND-10`+ sin colisionar, igual que las fichas `RES-` entre las tres sesiones. |
| 2026-08-19 | **Tercera tanda de investigaciÃ³n: `RES-23` y `RES-24`** en `INV-21-letras-y-fuimos-reyes.md`. Las dos dan resultado negativo o parcial, y el motivo es de la fuente. **`RES-23` descarta letras.com** como fuente de letras: es de contribuciÃ³n abierta y sin licencia declarada â€”la "fuente de fans sin respaldo" que `contenido` pidiÃ³ evitarâ€” y ademÃ¡s lista **149 temas contra los 105 reales**, mezclando material del Indio solista y de Skay. La pregunta 9 queda **respondida en negativo** y la casilla de letras de `CNT-01` sigue abierta. **`RES-24`**: el lector web de *Fuimos reyes* estÃ¡ topeado en **1%** y la secciÃ³n "DiscografÃ­a" figura en el Ã­ndice pero no carga; no se buscÃ³ otra vÃ­a porque el libro estÃ¡ a la venta. SÃ­ quedÃ³ el **mapa de los 20 capÃ­tulos**, que dice dÃ³nde mirar cuando el libro estÃ©: el cap. 8 puede cerrar la fecha de *Gulp!*, el 4 lo de Patricio Rey, y la secciÃ³n "DiscografÃ­a" del final las tres discrepancias vivas de una sola vez. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 2** en `Docs/ORQ/ORQ-plan-ciclo-2.md`, 13 tareas `T-15`..`T-27`. Dos gates en vez de uno: el limite editorial sobre muertes reales (`T-15`) y la categoria **testimonio** en el schema (`T-16`), que corren en paralelo. Meta: llegar a **30 preguntas**, no a 40. |
| 2026-08-19 | **Hallazgo de alcance: el piso de `US-01` ya no se puede cerrar.** Sin fuente de letras (`RES-23`), y con un piso definido como 10 por categoria sobre 40, el techo real es **30/40** por aritmetica. Decision para `producto`: sostener la cuota, bajar el piso, o esperar la fuente. Toca la definicion de "Listo" de la v1, y bloquea `US-03` entero. |
| 2026-08-19 | Segunda leccion de concurrencia, ahora entre **sesiones** y no entre roles: el encabezado de este archivo quedo diciendo "ciclo 1 en curso" cuando su propia bitacora ya registraba el cierre. Se fijo en `Docs/EQUIPO.md` el orden de autoridad â€” **disco > bitacora > tablero** â€” y la regla de agregar a la bitacora y reconciliar el tablero, nunca borrar una fila ajena. |
| 2026-08-19 | **El usuario revirtiÃ³ la conclusiÃ³n prÃ¡ctica de `RES-23`, y eso desarmÃ³ un bloqueo de alcance.** Con la objeciÃ³n sobre la mesa decidiÃ³ usar letras.com y **bestiarioredondo** igual, porque *la banda tiene una mÃ­stica de pocas cosas oficiales* â€” fundamento que la investigaciÃ³n respalda: no hay sitio oficial de letras, nunca lo hubo, el memoir no las trae (`RES-21`), y la banda se construyÃ³ sin multinacional, sin TV y sin publicitar recitales (`RES-07`). **Consecuencia: el aviso de "el piso de `US-01` no se alcanza por aritmÃ©tica, techo 30/40" quedÃ³ sin premisa y se retirÃ³.** No hay que tocar el piso ni la definiciÃ³n de "Listo". El riesgo de verso mal transcripto se acepta acotado con 5 mitigaciones; las dos que importan son cruzar todo contra los 105 temas de `RES-20` (obligatorio, gratis, mata las 149 entradas contaminadas) y confirmar de oÃ­do los ~30 versos que `BR-03` realmente necesita. **Falta el `D-XX`**: no lo numerÃ© desde la sesiÃ³n paralela porque no hay reserva del prefijo `D-`; propuesta en `Docs/SUGERENCIAS/INV-para-hilo-principal-decision-fuentes-letras.md`. |
| 2026-08-19 | **Ciclo 2, doce de trece tareas cerradas.** Los dos gates primero, como pedia el plan: `CNT-04` (`T-15`) fijo el limite editorial sobre muertes reales antes de escribir una sola pregunta de historia, y la categoria **`testimonio`** (`T-16`..`T-18`) entro al schema de forma **aditiva y verificada**: los 25 items previos validan sin tocarlos, y el schema rechaza las ocho formas de llenarla mal que probe. Banco: **30 preguntas**, `discos` 10/10, `mitologia` 10/10, `historia` 10/10, **10 faciles** que cumplen `BR-01`. |
| 2026-08-19 | **Cuatro fichas legales nuevas, `RES-11` a `RES-14`** (`INV-04`, `INV-05`), y dos corrigen cosas que el proyecto daba por buenas. **`RES-11`: el derecho de cita del Art. 10 cubre la obra, no el fonograma** â€” el Art. 5 bis le da al fonograma derecho aparte, con otro titular y 70 anios, y el proyecto recorta el master. Los "8 compases" regulan otra cosa. **`RES-13`: la baja resolucion no tiene efecto juridico verificado** (la ley dice "en cualquier forma", sin excepcion por calidad), y la declaracion publica de Rocambole no es licencia: el Art. 53 exige formalidad registral. **`FIND-05` tenia razon.** |
| 2026-08-19 | **Dos defectos encontrados por el equipo, no por el hilo principal.** `arquitectura` calculo que `BR-02` x `BR-04` le daba **70 puntos esperados a quien no reconoce nada**, con piso 40, y volvia inalcanzables el paso 5 y la rama de 0 â€” lo escalo en vez de decidirlo. `producto` lo arreglo con **intento unico por item**: baja a 25 esperados, piso 0, y las dos ramas vuelven a ocurrir. Y `arquitectura` senialo que **`sensibleA` no tiene valor para texto de libro**, asi que una cita del memoir es invisible para el gate de `D-07`: pedido abierto a `contenido`. |
| 2026-08-19 | **Corrida de investigaciÃ³n sobre imÃ¡genes de tapas: `RES-25` y `RES-26`** en `INV-22-imagenes-tapas-y-spotify.md`. Seis vÃ­as en paralelo con refutaciÃ³n adversarial; 10 agentes, 0 errores. **`RES-25`: ocho vÃ­as descartadas.** Solo Cover Art Archive sobrevive como conducto tÃ©cnico, y **no mejora la posiciÃ³n legal, solo no la empeora** (*"use the images at your own risk"*). La distinciÃ³n que ordena todo: **contenedor â‰  contenido** â€” ninguna base de datos puede licenciar arte que no le pertenece, asÃ­ que sacar la tapa de Discogs o de Spotify **no lava nada**. **bestiarioredondo no aporta tapas**: su unidad es la canciÃ³n, no el disco, no declara licencia, el propietario del Drive estÃ¡ oculto y **no se pudo descartar generaciÃ³n por IA**. Dos refutaciones Ãºtiles: el `life-span` de MusicBrainz contradice `RES-05`, y **la tapa de *Oktubre* del CAA sale de un CD de 1993 en EE.UU., no del LP argentino de 1986**. **`RES-26` es el hallazgo grande y no es sobre imÃ¡genes:** la Spotify Developer Policy III.2 dice textualmente *"Do not create a game, including trivia quizzes."* **Compromete la opciÃ³n A (embed) de `ADR-01` y vuelve irrelevante `E-04`** â€”aunque la prueba diera bien, seguirÃ­a prohibidoâ€”; la opciÃ³n B (deep link) probablemente sobrevive pero no estÃ¡ verificado. Propuesta para `arquitectura` y `producto` en `Docs/SUGERENCIAS/`. |
| 2026-08-19 | **Ciclo 2 cerrado: las 13 tareas, mas los tres hallazgos de `REV-03`.** El bloqueante (`FIND-12`) era transcripcion textual del memoir con etiqueta de parafrasis encima, en `QZ-027` y `QZ-028` â€” `revisor` lo cazo comparando contra el PDF. Corregido y **reverificado por el hilo principal contra las 194.131 palabras del libro**: el tramo calcado mas largo bajo de **62 a 41 caracteres**, ninguno llega a 9 palabras, y los que quedan son el titulo de una cancion, una marca y una frase generica. Banco final: **30 preguntas**, tres categorias en 10/10, 10 faciles. |
| 2026-08-19 | **`ADR-01` revision 3 â€” el eje de la decision cambio y no era tecnico.** `RES-26` (sesion paralela, encontrado **de casualidad** buscando imagenes de tapas) trajo la Spotify Developer Policy III.2: *"Do not create a game, including trivia quizzes."* `arquitectura` **descarto la opcion A (embed) por contrato**, anulo `E-04`, `E-05`, `E-06` y `E-10` â€” el usuario puede tachar la prueba de incognito de su lista â€” y degrado `E-07` a no bloqueante corrigiendo su propia frase de la revision 2. Queda `E-13`: si un deep link simple cuenta como acceder a la Spotify Platform. **Las Design Guidelines NO aplican a `US-04`**: rigen arte que venga de Spotify, y `D-04` fija otro origen. |
| 2026-08-19 | Autocritica que vale guardar, de `arquitectura`: su tabla de criterio de cierre â€”escrita **antes** de la evidencia, y que funciono dos vecesâ€” no fallo en ninguna fila. Fallo en algo que una tabla no puede cubrir: **solo elige entre las opciones enumeradas, y no protege de que una opcion sea retirada por un eje que nadie habia considerado.** |
| 2026-08-19 | **`D-14` reencuadra el proyecto entero, por decision del usuario y con toda la evidencia legal sobre la mesa.** Tres cosas: **(1)** el riesgo se asume â€” fan site sin fines de lucro, poco publico, **si llega un reclamo se da de baja y listo**; el gate de publicacion de `D-07` deja de existir y `CNT-01` pasa de cerrojo a **mapa**. **(2)** el conocimiento popular es contenido legitimo: **no hay mucho oficial y no deberia importarnos**, y eso no es una excusa sino un hallazgo (`RES-23`, `RES-21`). **(3)** **abrir los molinetes** â€” nada se le niega a nadie por no tener con que entrar: ni cuenta, ni login, ni Premium, ni saber lo suficiente. `D-08`, `D-09` y el "sin cuentas" del alcance resultaron ser la misma decision y ahora tienen nombre. |
| 2026-08-19 | Lo unico que `D-14` **no** relaja: que la respuesta correcta de una pregunta sea correcta â€” no por lo legal, sino porque si el dato esta mal **el juego le marca error al que se sabe el tema**. La defensa deja de ser "verificar todo" y pasa a ser **rotular bien**: hecho, leyenda o testimonio. El sistema de tres casillas que el schema ya hace cumplir resulto ser exactamente el mecanismo que esta postura necesitaba â€” **se construyo para dejar entrar el relato, no para filtrarlo.** Actualizados `CLAUDE.md`, `Docs/BRIEF.md` y `.claude/rules/contenido-json.md`. |
| 2026-08-19 | `/ciclo`: plan del **ciclo 3** en `Docs/ORQ/ORQ-plan-ciclo-3.md`, 16 tareas `T-28`..`T-43`. **El ciclo es construir el quiz.** Despues de dos ciclos estaba todo especificado â€”30 preguntas validadas, `CTR-02`, `CTR-03`, `UX-01`, `UX-02`, `UX-04`, seis reglas `BR-`â€” y **no habia una sola linea de codigo**. `D-14` saco el ultimo motivo para esperar. Se formalizo ademas en `Docs/EQUIPO.md` quien escribe el codigo: **el hilo principal**, por la misma razon de `D-12` â€” los cuatro roles que escriben no pueden ejecutar nada, y no se construye software sin correrlo. |
| 2026-08-19 | **Hallazgo al planificar: el repo no estaba bajo git.** 55 archivos de dos ciclos completos, sin un solo commit ni respaldo. Es `T-28` y va antes que todo. |
| 2026-08-19 | Tres huecos mas que encontro `orquestador` leyendo contra el encuadre nuevo: **`CNT-01` sigue redactada como cerrojo** y contradice al BRIEF (`T-32`); **`UX-01` no dice donde se ve el rotulo** de leyenda o testimonio, asi que 15 de los 30 items llegarian a pantalla con cara de hecho verificado â€” la ultima milla de todo el sistema de rotulado (`T-30`); y **ocho cadenas de copy** que `UX-01` y `UX-02` delegaron a `contenido` y nadie escribio (`T-29`). |
| 2026-08-19 | **Ciclo 3 cerrado: las 16 tareas `T-28`..`T-43`, mas los siete hallazgos de `REV-04`.** El proyecto paso de cero lineas de codigo a **un quiz jugable**: Astro con salida estatica, cinco reglas de negocio como funciones puras con test, cuatro pantallas, y el repo en **github.com/knesantos/ArcadeRicotero**. 47 tests, `tsc` limpio, build OK. |
| 2026-08-19 | **El defecto que solo aparecio jugando: en 25 de los 30 items la respuesta correcta era la primera opcion.** Tocando siempre arriba se sacaba **83%** sin saber nada â€” mucho peor que lo que discutio `BR-04`, que eligio 4 opciones en vez de 3 para bajar el azar de 33% a 25%. No lo agarro nadie porque en el JSON cada item se lee bien por separado: el patron solo existe en el conjunto. Arreglado barajando al servir; medido en el navegador, ahora rinde 28%. Y `revisor` encontro despues que **`CTR-02.3` ya lo exigia por escrito** desde el ciclo 1: no fue un parche, fue implementar un requisito que nadie habia ejecutado. |
| 2026-08-19 | **`REV-04`, primera revision de codigo. El riesgo del ciclo no se materializo donde se temia.** `BR-01`, `BR-04`, `BR-05`, `ADR-01` y `ADR-02` coinciden con los documentos numero por numero. Se materializo en tres puntos que **pasaban en apariencia**: el test de contraste medÃ­a tokens que la pantalla nunca usaba (`FIND-15`, bloqueante â€” el juego corria sin senal de acierto, error ni rotulo), el payload mandaba mas de `testimonio` de lo aprobado (`FIND-16`), y una cadena de `CNT-05` se reemplazo por texto inventado (`FIND-17`). Los siete cerrados y verificados. |
| 2026-08-19 | Nota de proceso: **`tsc --noEmit` no se estaba corriendo.** El hilo principal reporto `T-34` como verificada habiendo corrido solo `node --test`. Cuando se corrio (`FIND-19`), encontro que el arreglo de `FIND-16` estaba incompleto â€” el tipo seguia prometiendo campos que ya no se mandaban. **El comando que no se corria era el que iba a atrapar el arreglo a medias del otro hallazgo.** |
| 2026-08-19 | `D-15`: hosting en **Vercel con salida estatica pura**. El usuario tiene Vercel Pro y Supabase Pro pagas, y aun asi el sitio se disena para el tier gratuito â€” si la suscripcion desaparece, sigue en linea sin cambiar una linea. **Supabase queda disponible y sin usar**: contradice "sin backend" (`D-02`), su tier gratuito pausa proyectos por inactividad, y sobre todo **una cuenta de usuario es literalmente un molinete**, que es lo unico que `D-14` prohibe por nombre. |
| 2026-08-19 | **`RES-15` (`INV-06`): como asegurar costo cero en Vercel, verificado contra la documentacion oficial.** Corrige una intuicion razonable del usuario: **no alcanza con no activar Speed Insights ni Analytics**, porque lo que decide es **el scope**. En Hobby no hay cargo posible â€”al agotar un cupo el recurso se frena, no se facturaâ€”; en un equipo Pro se cobra el excedente de transferencia y edge requests aunque no se toque ningun add-on. Contraintuitivo: **el tope de gasto (Spend Management) solo existe en Pro**, en Hobby no existe porque no hace falta. **Accion pendiente del usuario:** verificar en Settings -> General a que scope pertenece el proyecto. |
| 2026-08-20 | **Sistema de marca, como lienzo de diez hojas** ("Sistema de marca Arcade Ricotero", https://claude.ai/code/artifact/59acd1de-80ab-4074-b1ba-b75da05cb134). Fija lo que `UX-04` dejÃ³ abierto a propÃ³sito: paleta con doce pares de contraste calculados (peor: 5,58:1, pasa AA), dos familias tipogrÃ¡ficas, diez estenciles originales con textura de serigrafÃ­a, y componentes con las clases que `partida.ts` ya escribe. La simbologÃ­a con respaldo: perro (`RES-06`/`RES-22`), bandera y estrella (`RES-06`, capa simbÃ³lica), molinete (`D-14`), la misa (`RES-04`). `Docs/UX/` no se tocÃ³: propuesta en `Docs/SUGERENCIAS/HILO-para-experiencia-sistema-de-marca.md` con las tres diferencias contra `UX-04` (error a rojo, aparece un oro, azul reservado a testimonio). |
| 2026-08-20 | **`D-16`: el producto se llama Arcade Ricotero.** DecisiÃ³n directa del usuario. Lo visible ya cambiÃ³: `<title>` de `index.astro` (verificado en `dist/`, build OK, `tsc` limpio, 47/47 tests). Las ~50 menciones en prosa interna migran sin apuro; el `$id` de los schemas es contrato de `arquitectura` y espera a ese rol. |
| 2026-08-20 | **`D-17`: regla de voz â€” sin anglicismos, en espaÃ±ol, argentino y ricotero.** DecisiÃ³n directa del usuario, convertida en hoja 02 del sistema de marca: tres obligaciones y glosario (feedbackâ†’devoluciÃ³n, revealâ†’revelado, displayâ†’rotulada, quizâ†’preguntas/trivia). Barrido hecho: el copy visible ya estaba limpio; lo inglÃ©s vive en identificadores de cÃ³digo, que se renombran solo si el costo lo justifica. |
| 2026-08-20 | **Pedido del usuario en curso: tipografÃ­as reales de los discos y mÃ¡s simbologÃ­a real.** `investigador` estÃ¡ buscando fuentes hechas por fans sobre el lettering de las tapas (descarga, licencia, quÃ© tapa imitan). Si aparece alguna usable, cambia la hoja 04 del sistema de marca y la decisiÃ³n estÃ©tica vuelve a `experiencia` (`D-04`). El rediseÃ±o "mÃ¡s oscuro, mÃ¡s rocambolesco" ya entrÃ³ al lienzo: base `#0D0A07`, viÃ±eta, desregistro de tinta. |
| 2026-08-20 | **`RES-30`..`RES-32` (`INV-07`): la tipografÃ­a de las tapas, investigada â€” y el hallazgo es un "no hay" que vale mÃ¡s que un "sÃ­".** El usuario pidiÃ³ usar "las fuentes de los Redondos"; `investigador` verificÃ³ que **no existe ninguna fuente descargable derivada del lettering real** â€” lo que circula es un "se parece a" comercial (Big George NF) sugerido por un fan y dos falsos positivos por nombre. Lo verificado de verdad (`RES-31`): Rocambole **dibujÃ³ a mano** la letra de *Oktubre*, "sovieticoide" con una B invertida, con oficio de cartelista y sin archivo digital. Consecuencia en el sistema de marca (hoja 04): se imita el **mÃ©todo** (letra de cartelista con borde comido), no la letra; la vÃ­a autÃ©ntica futura es lettering original encargado. De paso, `RES-31` es pregunta de trivia lista para el juego de tapas (nota para `contenido`). Pendiente manual: los listados de MercadoLibre y el tipoblog de CÃ¡tedra Cosgaya bloquearon el acceso automatizado. La hoja 01 sumÃ³ ademÃ¡s el **detalle real fichado**: los diez discos con aÃ±o (`RES-02`/`RES-20`) y los hitos Obras 89 / HuracÃ¡n 93-94 (`RES-05`). |
| 2026-08-20 | **`RES-33`..`RES-35` (`INV-07`, segunda tanda): la letra de cada tapa, nueve corridas en paralelo.** El usuario precisÃ³ el pedido: conseguir la tipografÃ­a de cada disco. Resultado: **ninguna tapa usa una tipografÃ­a comercial confirmada.** Dos verificadas con el mÃ©todo real â€” *Gulp!* es manuscrito de Rocambole **con un tubito de plasticola relleno de esmalte sintÃ©tico**, serigrafiado en tres pasadas (`RES-33`, tres fuentes); *Oktubre* confirma `RES-31` con fuentes nuevas. Seis tapas **sin datos** (las fuentes describen el concepto, nunca la letra) y *Lobo suelto* en conflicto (`RES-35`: "alfabeto de Semilla Bucciarelli" vÃ­a Cosgaya sin acceso directo, contra un "Rey Garufa" de foro sin fundamento). El lienzo sumÃ³ la **hoja 05 â€” Tapas, letra por letra**: cada disco con su estado y, donde hay evidencia, una equivalente de trabajo de Google Fonts (Pacifico para el manuscrito de *Gulp!*, Stalinist One para el constructivismo de *Oktubre* â€” criterio propio, marcado). Pendiente: el tipoblog de CÃ¡tedra Cosgaya bloquea intermitente (7 de 9 corridas) â€” reintento dedicado en curso. |
| 2026-08-20 | **`RES-36` (`INV-07`, tercera tanda): la entrevista de ClarÃ­n del 18-jun-1999, leÃ­da entera en el navegador de la sesiÃ³n** â€” el fetch automatizado daba 403, el navegador real entrÃ³. Rocambole recorre las nueve tapas: **resuelve *Lobo suelto*** (*"las tipografÃ­as corresponden a un alfabeto creado por el bajista Semilla Bucciarelli"* â€” el Ãºnico disco con letra de otro redondo; "Rey Garufa" descartado como ruido de foro), confirma *Gulp!* con la voz del autor ("serigrafÃ­a con las letras en plasticola de color") y *Oktubre* ("parece soviÃ©tica al estar invertida una letra"). Las otras seis tapas: la fuente mÃ¡s completa que existe **no aborda la letra** â€” el sin-datos queda firme. La CÃ¡tedra Cosgaya estÃ¡ caÃ­da a nivel servidor (rechaza incluso navegador real); ya no se espera. Hoja 05 del lienzo actualizada: tres verificadas, seis sin datos firmes, cero tipografÃ­as comerciales. |
| 2026-08-20 | **`D-18`: tipografÃ­a fiel y estÃ©tica real por disco â€” nada de sÃ­miles.** El usuario rechazÃ³ los equivalentes de Google Fonts ("parecen parodias") y fijÃ³ el rumbo: reconstruir la letra real de cada tapa (fiel, desde fotos si no existe ya digitalizada) y aplicar la estÃ©tica real de cada disco al lienzo. **`RES-37`: las paletas de las nueve tapas, muestreadas por conteo de pÃ­xeles** sobre las imÃ¡genes del Cover Art Archive (el conducto de `RES-25`), verificadas a ojo contra grilla de contacto â€” *Lobo suelto* naranja/petrÃ³leo/negro, *Gulp!* negro/rojo/crema, *La mosca* naranja quemado/rojo ladrillo/petrÃ³leo (discrepancia con el recuerdo del usuario anotada: puede ser de ediciÃ³n o de contratapa). Hoja 05 del lienzo rehecha con las paletas medidas. **En curso:** barrido en tres frentes â€” fuentes ya digitalizadas, herramientas foto-a-fuente con su mÃ©todo, y mapa de contratapas/sobres/afiches/folletos por disco. |
| 2026-08-20 | **`RES-38`..`RES-41` (`INV-07`, cuarta tanda): el camino a la letra real, cerrado como plan.** Segunda caza mÃ¡s profunda: **sigue sin existir digitalizaciÃ³n fiel** (siete lugares verificados) y los tres seÃ±uelos quedaron fichados con nombre para que nadie los use de base (Big George NF, un STL de Cults3D, un CDR anÃ³nimo). **Flujo fotoâ†’fuente a costo cero** documentado: Inkscape + FontForge en 7 pasos, con el mÃ©todo de glifos faltantes de los revivals serios; lo caro es tiempo de diseÃ±o, no plata. **Plan por disco:** Oktubre ALTA, Lobo suelto ALTA (alfabeto-sistema de Semilla; crÃ©dito "Visiones: Rocambole, Semilla y Meroyuela"), Gulp! MEDIA (falta el insert que nadie describiÃ³). **El hallazgo de campo:** el hilo principal abriÃ³ Discogs en el navegador y vio la contratapa argentina de *Oktubre* de primera mano â€” tracklist y crÃ©ditos completos en el mismo lettering a mano, casi el abecedario en minÃºscula (`RES-41`). Hoja 05 del lienzo ampliada con el plan. **Dos llaves quedan en manos del usuario:** el Ã¡lbum de Facebook de Rocambole "TipografÃ­as originales para afiche" (pide login) y sus discos fÃ­sicos escaneados a 300â€“600 dpi, que son el paso 1 del flujo. |
| 2026-08-20 | **`RES-42` y `RES-43` (`INV-07`, quinta tanda): las fuentes aparecieron, y la primera calcada es nuestra.** El usuario trajo cinco fuentes a `Docs/INVESTIGACION/Tipografia/`: tres son **digitalizaciones fan del lettering real** de BenjamÃ­n Zavala (ffonts.net, sin licencia declarada) â€” el logo del PR coronado, el lettering "Redonditos" y **el alfabeto de Semilla** de *Lobo suelto* â€” y dos se descartaron (dingbats de logos; una grunge genÃ©rica renombrada). Corrige el negativo de `RES-38`: la caza pasÃ³ por ffonts.net y no las vio; el usuario a mano sÃ­. **Y la titular de *Oktubre* se calcÃ³ hoy de la tapa misma** (`RES-43`): siete letras con la B espejada, trazadas de la imagen real con potrace + fontTools hasta un OTF de verdad (`Tipografia/OktubreCalco-v0.2.otf`), verificado lado a lado contra el original y renderizando en Chrome. Las cuatro estÃ¡n **incrustadas en la hoja 05 del lienzo** con espÃ©cimen y crÃ©dito. Siguiente en el tablero: la minÃºscula de la contratapa de *Oktubre* (corpus ya ubicado) y auditar la fidelidad de las tres fan contra las tapas. |
| 2026-08-21 | **`D-19`: la mezcla ricotera â€” cada pantalla viste un disco, la base no rota.** Pedido textual del usuario: mezcla de toda la cultura y los discos, manteniendo el caos de la banda. Para hacerlo sin inventar ya estaba todo: paletas medidas (`RES-37`), fuentes fan (`RES-42`), calco propio (`RES-43`). **La titular ganÃ³ cuatro letras derivadas** (A C D I, compuestas de las reales con el mismo gesto constructivista de la B espejada â€” `OktubreCalco-v0.3.otf`) y ahora escribe **ARCADE RICOTERO** completo: es el tÃ­tulo del sitio en el lienzo. Mapa inicial en la hoja 05: portada=Oktubre, historia=Gulp!, mitologÃ­a=Lobo suelto, letras=La mosca, discos=Ãšltimo bondi, resultado=Gulp!+logo. Las tres pantallas de la hoja 09 quedaron vestidas cada una de su disco. Tres reglas ordenan el caos (base fija, texto largo siempre legible, acierto/error/rÃ³tulos no se disfrazan) y una deuda declarada: las fuentes no traen acentos todavÃ­a. |
| 2026-08-21 | **`D-20`: la Redondopedia â€” enciclopedia ricotera navegable, quinto frente del producto.** DecisiÃ³n directa del usuario: sumar al sitio una secciÃ³n estilo Wikipedia â€” historia completa, biografÃ­as, letras, los casos reales (Bulacio, OlavarrÃ­a), cultura â€” navegable por enlaces entre artÃ­culos. Cinco clÃ¡usulas: no toca el "Listo" de la v1 (los cuatro juegos de `D-05` siguen intactos); estÃ¡tica sin backend (`D-02`); el rotulado hecho/leyenda/testimonio se extiende a la prosa â€” **la ventaja sobre Wikipedia es justamente poder contar la leyenda como leyenda**; el insumo inicial son las fichas `RES-` ya escritas; y "que la gente sume data" queda para el futuro (la vÃ­a arranca en la propia D-20: GitHub o buzÃ³n, nunca un login). Fuerza dos pendientes que venÃ­an pateÃ¡ndose: cÃ³mo cuenta el sitio la muerte del Indio (`RES-04`) y `CNT-04` releÃ­do para artÃ­culos enteros. |
| 2026-08-21 | **`producto` entregÃ³ la Redondopedia como historia trazable: `US-05` y `BR-07`..`BR-11`** en `Docs/PRODUCTO/PRD-redondopedia.md`. Seis tipos de artÃ­culo (disco, tema, persona, hito, concepto, leyenda â€” el sÃ©ptimo "tapa/arte" descartado: vive dentro de `disco` y de Rocambole como `persona`) con campos mÃ­nimos por tipo. **Piso: 35 artÃ­culos** (10/5/7/4/3/6), alcanzable sin investigaciÃ³n nueva porque el insumo ya estÃ¡ en mÃ¡s de cuarenta fichas `RES-`. "Navegar como en Wikipedia" convertido en criterio corrible (`BR-09`: cero huÃ©rfanos, cero callejones, todo alcanzable desde la portada por BFS â€” el script lo debe `arquitectura`, lo corre quien tenga `Bash`, `D-12`). El rotulado de `D-14` se vuelve **granular**: por afirmaciÃ³n dentro del pÃ¡rrafo, no un campo Ãºnico por Ã­tem (`BR-08`). **`BR-10` da vuelta el techo de `CNT-04` para este formato:** Bulacio y OlavarrÃ­a entran como artÃ­culos propios â€” la restricciÃ³n naciÃ³ de un problema del multiple choice que la prosa no tiene â€” con contingencia declarada (si `contenido` al releer concluye lo contrario, el piso de `hito` baja de 7 a 6). La muerte del Indio (`RES-04`) entra como `hito` propio. Orden de recorte interno: cae primero `tema` (letras completas, lo mÃ¡s caro y expuesto), `disco` y `persona` no caen nunca â€” son el esqueleto. Verificado por el hilo principal: IDs sin colisiÃ³n, trazabilidad a `D-20` completa, propiedad de carpetas respetada (la peticiÃ³n a `arquitectura` fue por `Docs/SUGERENCIAS/`, sin nÃºmero, como manda `Docs/IDS.md`). |
| 2026-08-21 | **El usuario aportÃ³ una fuente nueva, sin evaluar: https://redondossubtitulados.com/** â€” pidiÃ³ registrarla y nada mÃ¡s, para que una futura sesiÃ³n de investigaciÃ³n la trabaje. Puntero en `Docs/SUGERENCIAS/HILO-para-investigador-fuente-redondossubtitulados.md` con el checklist de evaluaciÃ³n (quÃ© contiene, licencia, cruce contra los 105 de `RES-20`, para quÃ© frente rinde â€” candidatas obvias: letras de `US-03` y el tipo `tema` de la Redondopedia). **Nadie entrÃ³ al sitio todavÃ­a; no es citable hasta que exista su ficha `RES-XX`.** |
| 2026-08-21 | **Segunda fuente aportada por el usuario, sin evaluar: Coveralia** (https://www.coveralia.com/caratulas-de/patricio-rey-y-sus-redonditos-de-ricota.php) â€” "todas las tapas y discos y contratapas". Verificado: **no estÃ¡ entre las ocho vÃ­as que `RES-25` descartÃ³**, es evaluaciÃ³n nueva. Puntero en `Docs/SUGERENCIAS/HILO-para-investigador-fuente-coveralia.md` con el contexto que importa: la doctrina contenedorâ‰ contenido ya estÃ¡ cerrada (la evaluaciÃ³n Ãºtil es de corpus, no legal), **lo que podrÃ­a valer oro son las contratapas** para el plan de letra fiel de `D-18` (`RES-41`: el insert de *Gulp!* y la minÃºscula de *Oktubre* son los faltantes), y la trampa de ediciones que `RES-25` ya cazÃ³ (el *Oktubre* del CAA es un CD yanqui del 93, no el LP argentino del 86 â€” anotar ediciÃ³n por imagen). PodrÃ­a destrabar tambiÃ©n la discrepancia de paleta de *La mosca* (`RES-37`) y las imÃ¡genes de `US-04`. **Sin ficha `RES-XX`, no citable.** |
| 2026-08-21 | **El sistema de marca aterrizÃ³ en el cÃ³digo, y el diseÃ±o quedÃ³ como fuente de verdad.** Rama `diseno/mezcla-ricotera` â†’ PR â†’ main. Lo que cambiÃ³: `tokens.css` reescrito con los valores del lienzo (base de tinta, estados, los `--cat-*` de la mezcla `D-19` con las paletas reales de `RES-37`, `--marca-rojo` de Oktubre) + las **cinco fuentes autoalojadas** en `public/fuentes/` (el calco de Oktubre, dos fan de Zavala, Archivo Black â€” 39 KB total, cero CDN); la portada viste Oktubre (`index.astro`: la marca en la titular calcada, JUGÃ en el rojo de la tapa); `partida.ts` ganÃ³ las dos palabras que faltaban (`categoria--X` para que las cuatro tintas pinten, y `firma` para que COMPARTIR lleve el lettering del logo); `juego.css` sumÃ³ la mezcla sin un solo hex. **El test de contraste subiÃ³ de 12 a 17 pares** y pasa todo: build OK, `tsc` limpio, 47/47. Y la regla nueva `.claude/rules/diseno-marca.md` fija el circuito para todos los roles: **se cambia en el diseÃ±o, se refleja en `tokens.css`, se corre el test â€” nunca al revÃ©s.** Deuda declarada ahÃ­ mismo: las fuentes de disco no traen acentos todavÃ­a. |
| 2026-08-21 | **El sitio ganÃ³ esqueleto: portal collage-cassette, rutas navegables y las pantallas de lo que viene.** Pedido directo del usuario: Ã­ndice lindo, link a cada juego, estÃ©tica de cassette vintage con recortes de discos pegados en collage â€” siempre sobre Rocambole. Lo construido: portal en `/` como cassette grabado en casa (lado A los cuatro juegos, lado B la Redondopedia; cada casete viste su disco por `D-19` y las etiquetas son papel con renglones â€” par `tinta sobre papel` sumado al test AA, ahora 18 pares); el quiz **mudado a `/quiz/`** sin romper `ADR-02` (los links de desafÃ­o viejos a `/?g=...` redirigen conservando la query â€” verificado en el navegador con `n=Che`); tres pantallas "en la cocina" honestas (la de adivinar el tema promete acceso al tema, no reproducciÃ³n completa â€” `BR-06`); `Base.astro` + `sitio.css` (cero hex, todo `var()`, grano de serigrafÃ­a como token). **Sistema de recortes reemplazables:** `public/arte/` trae 5 dibujos de reemplazo originales (mosca, multitud con banderas, perro, lobo, cassette) y un README con el **despiece de 15 piezas fundado en `RES-06`/`RES-22`** â€” quÃ© recortar de cada tapa, cÃ³mo y dÃ³nde se pega; cuando el usuario deje el PNG real con el nombre acordado, el build lo levanta solo (`src/lib/sitio/arte.ts`). Deuda de circuito declarada: `--papel` y `--textura-grano` entraron a `tokens.css` sin pasar antes por el lienzo â€” propuesta a `experiencia` para saldarla. |
| 2026-08-21 | **La Redondopedia saliÃ³ del papel: 26 de los 35 artÃ­culos del piso, escritos desde las fichas y verificados contra ellas.** Corrida de 14 agentes en tres fases: inventario de las fichas (`INV-01`, `INV-02`, `INV-20` + guÃ­as `CNT-02`/`CNT-04`), redacciÃ³n por tipo (10 `disco` â€” En directo excluido por ser vivo â€”, 5 `persona`, 5 `hito`, 4 `concepto`, 2 `leyenda`), y **verificaciÃ³n adversarial que encontrÃ³ 21 problemas, 5 bloqueantes, todos corregidos antes de integrar**. El patrÃ³n de los bloqueantes vale como lecciÃ³n: tres artÃ­culos inflaban "Patricio Rey Discos" a "el sello propio de la banda" (ninguna ficha lo dice â€” suposiciÃ³n inferida del nombre, disfrazada de hecho), y dos resÃºmenes presentaban el testimonio de Rocambole sobre la prensa como hecho pelado. `BR-08` quedÃ³ implementado en la forma de los datos: el cuerpo es una lista de segmentos y cada uno lleva rÃ³tulo y fuente en el punto exacto (leyenda con tiza y rombo, testimonio con celeste y comillas â€” los cÃ³digos del quiz, que no se disfrazan de disco). `BR-09` es test corrible: cero huÃ©rfanos, cero callejones (la Ãºnica excepciÃ³n usada es la declarada para `leyenda`), enlaces `[[slug\|texto]]` todos resueltos. Discrepancias en paralelo como pide `US-05` criterio 5 (la fecha de *Gulp!* con sus tres versiones, cada una con fuente). Faltantes para el piso: los 6 `tema` (esperan letras con filtro `D-13`) y Bulacio/OlavarrÃ­a (`CNT-04`, `BR-10`). Tests **54/54**, `tsc` limpio, build de 32 pÃ¡ginas. |
| 2026-08-21 | **Las tapas de Coveralia, bajadas y en uso acotado.** Pedido directo del usuario sobre el puntero que Ã©l mismo trajo: 35 imÃ¡genes (frontal, trasera y CD/interior donde existen, los 11 tÃ­tulos) en `Docs/INVESTIGACION/TapasDiscos/` como mÃ¡sters fuera del sitio, y **bajas de 320 px** generadas a `public/tapas/` con `scripts/generar-tapas.mjs` (repetible). DÃ³nde aparecen: **solo en las fichas `disco` de la Redondopedia** con crÃ©dito a Rocambole (`BR-07` las pide; `D-04` las quiere en baja) â€” el resto del collage sigue siendo recortes y dibujos propios, porque `UX-04` prohÃ­be la tapa entera como fondo decorativo. Nota para `investigador`: la ficha de evaluaciÃ³n de Coveralia sigue pendiente (`HILO-para-investigador-fuente-coveralia.md`); esto fue ejecuciÃ³n del pedido del usuario, no evaluaciÃ³n de corpus â€” la trampa de ediciones que avisÃ³ `RES-25` queda por auditar imagen por imagen. |
| 2026-08-21 | Nota de proceso: el test de estilos fallaba en Windows por finales de lÃ­nea CRLF del checkout (buscaba `\n}\n` literal) â€” venÃ­a fallando tambiÃ©n sobre `main`, no lo introdujo esta sesiÃ³n. Normalizado al leer en `estilos.test.ts`, que ademÃ¡s ahora audita `sitio.css` en la regla de cero hex fuera de `tokens.css`. |
| 2026-08-21 | **Corrida anti-slop, por pedido directo del usuario: nada en el sitio puede verse como la interfaz por defecto de una IA.** La regla quedÃ³ escrita para todos en `.claude/rules/diseno-marca.md` (tabla de tics vetados con su reemplazo en el idioma del proyecto â€” sello, cinta, papel, tinta plana, rotaciÃ³n) y **lo auditable se audita a mÃ¡quina**: `estilos.test.ts` falla el build si vuelve una pastilla 999px o una barra de acento lateral fuera de la cita rotulada. Lo barrido, detectado con una caza de 3 agentes mÃ¡s el ojo propio: la **barra de acento a la izquierda de las tarjetas** (el caso que motivÃ³ el pedido â€” `.tarjeta-articulo` y `.feedback` pasan a borde completo teÃ±ido), **siete pastillas cÃ¡psula** convertidas a sello de goma de esquina casi viva, `--radio` de 14px a **4px** (papel cortado, no burbuja â€” deuda de lienzo anotada), los `style=` inline de la plantilla de artÃ­culo movidos a clases, y las **superficies "elevadas"** de las piezas del collage reemplazadas por recorte de borde grueso â€” que ademÃ¡s arregla un defecto real: `cat-letras` sobre `--fondo-elevado` daba **4,32:1, abajo de AA**; sobre `--fondo` todos los pares pasan. En texto: la coletilla "entre los emblemas" repetida en siete discos destemplada, el redoble de tambor antes del dato y la honestidad declamada de tres cierres pasados a tinta seca, y dos cadenas de `CNT-05` corregidas â€” la gorda: **"Â¡Con la gorra bien puesta!" premiaba con la policÃ­a** ("la gorra" en la tribuna) y era jerga inventada; ahora "Â¡De una la sacaste!". Propuestas a `experiencia` y `contenido` actualizadas. 55/55 tests, build OK. |
| 2026-08-21 | **Ciclo 4 planificado: `T-44`..`T-63`, 20 tareas, en `Docs/ORQ/ORQ-plan-ciclo-4.md`.** Pedido del usuario que ordena el ciclo: integrar las tapas reales a la pÃ¡gina â€”recortarlas, usar detalles, usarlas de fondoâ€” mÃ¡s seguir con los juegos, la pÃ¡gina y la Redondopedia. El corte encontrÃ³ que **el pedido choca de frente con una regla vigente**: `UX-04` dice textualmente que las tapas reales van "nunca como fondo decorativo de otra pantalla", asÃ­ que el ciclo arranca registrando `D-21` (`T-44`) y reescribiendo esa fila (`T-45`) â€” construir antes de eso serÃ­a construir contra una regla. El foco es doble y no casual: las tapas entran al sitio y de paso se cierra **`US-04` (adivinar la tapa) de 0/10 a 10/10**, el Ãºnico de los tres juegos que faltan cuya materia prima ya estÃ¡ en el repo. La Redondopedia va de 26/35 a **29/35** (los 2 `hito` de Bulacio y OlavarrÃ­a mÃ¡s la tercera `leyenda`). **Riesgo declarado del ciclo:** que la foto de fondo con velo oscuro y texto encima traiga de vuelta el slop que costÃ³ una corrida entera sacar, y que rompa los pares AA â€” mitigado con el velo como token testeado, recorte pegado en vez de imagen a sangre, y una regla mÃ¡s en `estilos.test.ts`. **Cambio de alcance declarado:** `BR-07` pedÃ­a "letra completa" en los artÃ­culos `tema`; `T-61` le pide a `producto` que lo corrija a versos citados mÃ¡s anÃ¡lisis, alineado con el techo de cita de `RES-03` y con los 2/1/0 versos de `BR-03`. El piso de 6 no se toca. QuedÃ³ afuera `US-02` entero (los recortes de audio los produce el usuario), la carga de letras (el insumo todavÃ­a no estÃ¡ en el repo â€” se llevan las tres tareas que destraban el ciclo 5) y desplegar en Vercel (va primero en el 5, con las tapas ya adentro). Rangos reservados en `Docs/IDS.md`: `RES-44`..`RES-49`. |
| 2026-08-21 | **El usuario dejÃ³ guardada una idea futura: que el sitio intente hablar como el Indio.** Analizar a fondo letras, entrevistas y demÃ¡s archivo, y destilar de ahÃ­ una guÃ­a de voz que se apoye encima de `CNT-02` y `D-17`, no que las reemplace. **PidiÃ³ explÃ­citamente que no se haga ahora.** Puntero en `Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md`, con las tres preguntas que hay que contestar antes de escribir copy: si el sitio habla *como* Ã©l o *citÃ¡ndolo* (escribir frases nuevas con la voz de una persona real que muriÃ³ el 5-jun-2026, `RES-04`, no es lo mismo que citar testimonio rotulado); dÃ³nde aplica y dÃ³nde no (un botÃ³n crÃ­ptico es un molinete cerrado, `D-14`); y que no termine en imitaciÃ³n de manual, que es el slop de `.claude/rules/diseno-marca.md` pero en el texto. |
| 2026-08-21 | **Pedido del usuario: las bandas ricoteras nacidas despuÃ©s de la separaciÃ³n son parte de la cultura y van a la Redondopedia.** NombrÃ³ tres â€” *La Kermesse Redonda*, *Indio y los Fundamentalistas del Aire Acondicionado*, *Skay y los Fakires* â€” transcriptas tal cual, **sin verificar por nadie**: los nombres exactos, las fechas y quÃ© es cada una las fija una ficha `RES-XX`, porque la web tiene una sola puerta. Que entran no se discute; falta que `producto` decida bajo quÃ© tipo (`BR-07` tiene seis y ninguno es `banda`) y quÃ© le pasa al piso de 35 (`BR-11` es el orden de recorte). **La trampa seÃ±alada en la propuesta:** artÃ­culo sÃ­, Ã­tem de juego no â€” el filtro de los **105 temas de `RES-20`** existe justo para que no se mezcle material solista con el de la banda, y meterlo en un juego le marcarÃ­a error al que se sabe cuÃ¡l es cuÃ¡l. Nada de esto es del ciclo 4. |
| 2026-08-21 | **Ciclo 4 EJECUTADO y cerrado: las 20 tareas `T-44`..`T-63`.** Pedido del usuario: integrar las tapas reales a la pÃ¡gina â€”recortarlas, usarlas de fondoâ€” mÃ¡s seguir con los juegos, la pÃ¡gina y la Redondopedia. **Lo primero que apareciÃ³ fue un choque:** `UX-04` decÃ­a textualmente que las tapas reales van *"nunca como fondo decorativo de otra pantalla"*, o sea exactamente lo prohibido era lo pedido. Se registrÃ³ `D-21` (las tapas entran a toda la pantalla, con cuatro condiciones: crÃ©dito, legibilidad como token testeado, la forma del proyecto y baja resoluciÃ³n) y reciÃ©n despuÃ©s `experiencia` reescribiÃ³ la fila y escribiÃ³ `UX-05`, el catÃ¡logo pantalla por pantalla. **Resultado en el sitio:** 16 derivados nuevos generados desde los mÃ¡sters (`scripts/generar-tapas.mjs` ahora produce ficha, detalle y fondo), el portal con la franja de banderas de *Oktubre* y un recorte por casete, las pantallas en la cocina y la cabecera de la Redondopedia con fondo velado, y las fichas de artÃ­culo con su detalle por secciÃ³n. **El velo es prueba, no promesa:** `--velo-tapa` (86%) y `--velo-tapa-titular` (75%) con seis tests que miden el **peor compuesto posible** â€”el velo sobre un pÃ­xel blanco puroâ€”, mÃ¡s una regla en `estilos.test.ts` que falla el build si una tapa entra de fondo sin velo. |
| 2026-08-21 | **Y el ciclo 4 dejÃ³ un segundo juego jugable: `US-04` (adivinÃ¡ la tapa), 10/10.** `arquitectura` escribiÃ³ `CTR-05`, `contenido` cargÃ³ el banco y el hilo principal el juego, que **reusa el armado de ronda del quiz en vez de copiarlo** â€” copiarlo habrÃ­a copiado tambiÃ©n el defecto que ese archivo arregla (la correcta caÃ­a primera en 25 de 30 Ã­tems). El portal ya lo anuncia con JUGÃ. La Redondopedia pasÃ³ de 26 a **29 de 35**: los dos `hito` de Bulacio y OlavarrÃ­a â€”habilitados por el veredicto de `contenido` en `CNT-06`â€” y la tercera `leyenda`. Se cerraron ademÃ¡s `CTR-04` (schema de completar la letra), `BR-12` (un artÃ­culo `tema` lleva versos citados y anÃ¡lisis, no la letra entera), `RES-44` (auditorÃ­a de ediciÃ³n de las 35 imÃ¡genes y evaluaciÃ³n de Coveralia) y `RES-45` (la fuente de letras que trajo el usuario). **77 tests, `tsc` limpio, build de 35 pÃ¡ginas.** |
| 2026-08-21 | **Tres cosas que el ciclo 4 encontrÃ³ y que valen como lecciÃ³n.** (1) **La imagen de *La mosca y la sopa* no era de Rocambole:** el frontal que se habÃ­a bajado es un rediseÃ±o con una foto de recital. Lo detectÃ³ `contenido` al no poder cargar el dÃ©cimo Ã­tem y lo confirmÃ³ el hilo principal mirÃ¡ndola. La contratapa sÃ­ trae el collage real, asÃ­ que de ahÃ­ salen ahora la ficha de ese disco y los recortes de la secciÃ³n `letras`. (2) **Una invariante propia rompiÃ³ el build de mÃ¡s:** rechazaba toda reediciÃ³n como respuesta correcta, cuando `RES-44` solo la veta *si la pregunta depende de la ediciÃ³n*. Se relajÃ³ a lo indefendible â€”"no determinable"â€” y quedÃ³ como test. (3) **`UX-05` mandaba poner *Oktubre* detrÃ¡s de la marca grande**, que es el Ãºnico texto del sitio que no llega a AA sobre tapa velada (3,38:1, y al 92% de velo sigue sin llegar). El fondo va anclado abajo. Las dos desviaciones quedaron en `Docs/SUGERENCIAS/` esperando a `experiencia`; `revisor` las revisÃ³ y las dio por bien resueltas y bien documentadas. |
| 2026-08-21 | **Las dos revisiones del ciclo encontraron nueve hallazgos y los importantes se corrigieron en la misma rÃ¡faga.** El mÃ¡s serio: **`TP-010` mostraba la contratapa con el tÃ­tulo del disco impreso y legible en la propia imagen** â€”la respuesta escrita adentro de la pregunta, y encima rotulado difÃ­cilâ€”. Se cambiÃ³ al recorte de la olla, que no lleva texto. TambiÃ©n: `TP-002` mezclaba un hecho verificado con una afirmaciÃ³n reportada y ahora la lleva rotulada como leyenda; `CNT-01` seguÃ­a diciendo que las tapas se usaban en un solo juego y que venÃ­an del Cover Art Archive, y quedÃ³ al dÃ­a; y **el crÃ©dito por pantalla de la condiciÃ³n 1 de `D-21` estaba implementado genÃ©rico** â€” ahora cada pÃ¡gina declara quÃ© tapas usa y el pie las nombra. `REV-05` quedÃ³ escrita con los cinco hallazgos de `US-04`, tres de ellos abiertos y con dueÃ±o (`arquitectura`: la ruta de `detalle` en `CTR-05.4`, la ventana de precarga, y el crÃ©dito compartido de *Lobo suelto*/*Cordero atado*). |
| 2026-08-21 | **El lienzo de marca se actualizÃ³ de verdad, y con eso el circuito de `.claude/rules/diseno-marca.md` quedÃ³ cumplido por primera vez.** La regla manda diseÃ±o â†’ tokens â†’ test y nunca al revÃ©s, pero el lienzo es un artefacto publicado que lleva su propio editor adentro: la sesiÃ³n frenÃ³ y le preguntÃ³ al usuario antes de tocarlo, porque republicarlo reescribe lo que Ã©l edita a mano. ConfirmÃ³ que nunca lo habÃ­a editado. Se extrajeron las once hojas, se le agregÃ³ a la **hoja 05** la secciÃ³n de `D-21` (las tres formas con su tamaÃ±o y su regla, los dos velos con su peor caso medido, el rojo de marca marcado como prohibido sobre tapa velada, el mecanismo de crÃ©dito y lo que sigue vetado), y se volviÃ³ a publicar en la misma URL con las otras diez hojas intactas. Queda anotado el techo real del material, que el catÃ¡logo no sabÃ­a: los frontales miden 953Ã—953, asÃ­ que **ningÃºn recorte llega a los 480/640 px que pide `UX-04`** â€” el generador no agranda y avisa cuÃ¡l quedÃ³ corto. |
| 2026-08-22 | **Diez ideas de juegos guardadas como `IDEA-01`..`IDEA-10`, sin empezar ninguna** (`Docs/PRODUCTO/PRD-backlog-ideas.md`). El usuario las tirÃ³ de una y pidiÃ³ explÃ­citamente guardarlas sin desarrollar. Se les creÃ³ prefijo propio en vez de escribirlas como `US-`: un `US-XX` acÃ¡ es un contrato con Given/When/Then y piso, y forzarlo sobre diez ideas sin comprometer habrÃ­a sido inventarles alcance. Cada tÃ­tulo quedÃ³ **verificado contra los 105 temas de `RES-20`** antes de escribirlo â€” *Masacre en el puticlub* (Un baiÃ³n, 1988), *Toxi-Taxi* (La mosca y la sopa, 1991), *Un Pacman en el Savoy* (Â¡Bang! Â¡Bang!, 1989), *Ãšltimo bondi a Finisterre* (1998), *Gran Lady* y *Rock para el negro Atila* (Lobo suelto vol. 1, 1993). **Dos reglas nuevas:** `BR-15` (la instrucciÃ³n transversal del usuario â€” los clones se adoptan de un genÃ©rico y se visten, no se escriben; con las tres consecuencias que arrastra: licencia del motor, el skin es la parte cara, y la mÃºsica de fondo en loop no estÃ¡ cubierta por ningÃºn ADR) y `BR-16` (una idea no entra a un ciclo sin promoverse antes a `US-XX`). **Tres cosas quedaron abiertas y ninguna la puede contestar la sesiÃ³n:** "el gordo Pier" no figura en los 105 â€”lo mÃ¡s cercano es *Pierre, el vitricida*, Gulp! 1985â€”, "la tumba del Indio" de `IDEA-05` no se dio ni por cierta ni por falsa, y `IDEA-10` (Guitar Hero) tiene bloqueo estructural de audio con tres salidas posibles. Ninguna de las diez es alcance de la v1: `US-02` y `US-03` siguen sin un solo Ã­tem cargado. |
| 2026-08-22 | **`D-22`: los temas enteros se alojan en el sitio, en mp3.** DecisiÃ³n directa del usuario â€” *"Vamos a alojar temas enteros en .mp3 seguro."* **SacÃ³ de Fuera de alcance la lÃ­nea mÃ¡s estable que tenÃ­a el proyecto**, y el motivo no fue una concesiÃ³n: esa lÃ­nea contradecÃ­a a `D-14`, porque el tema completo era lo Ãºnico que el sitio le negaba al jugador sin Premium, y los molinetes van abiertos. Corregidos los dos lugares que quedaban diciendo lo contrario (`Docs/BRIEF.md` y `CLAUDE.md`, alcance y motor de audio). **Lo que se cayÃ³:** `E-07` â€”que `ESTADO.md` tenÃ­a como "la pregunta que mÃ¡s pesa"â€” y `E-04` dejan de decidir si la promesa se cumple; Spotify baja de vÃ­a a extra; `BR-06` quedÃ³ describiendo un sitio que ya no existe y lleva aviso, sin reescribirse todavÃ­a porque depende de si Spotify se queda. **Lo que se cayÃ³ del lado bueno:** `IDEA-10` (Guitar Hero) era la Ãºnica de las diez con bloqueo estructural y el bloqueo era exactamente este â€” desbloqueada el mismo dÃ­a, aunque ahora le falta de dÃ³nde sale la partitura. **Lo que apareciÃ³ en su lugar, y es aritmÃ©tica:** contra las duraciones de `RES-20` (94 de 105 temas, 385 min fichados) el catÃ¡logo son **~7,2 horas de audio** â€” ~300 MB a 96 kbps, ~400 MB a 128, ~600 MB a 192, ~1 GB a 320. El problema pasÃ³ de ser de alcance a ser de peso e infraestructura: dÃ³nde viven los archivos, si van adentro del repo que Vercel construye, y los lÃ­mites de Vercel para ese volumen, **que no estÃ¡n fichados y es lo Ãºnico que conviene chequear antes de subir el primer archivo** (`RES-15` ya descartÃ³ el susto de la factura: en Hobby no hay cargo posible). Se le dejÃ³ a `arquitectura` todo junto en `Docs/SUGERENCIAS/HILO-para-arquitectura-audio-alojado.md`, incluida la consecuencia que mÃ¡s horas ahorra: si los pasos del reveal se derivan del mp3 entero, el recorte manual de `D-06` casi desaparece. |
| 2026-08-23 | **La voz del sitio dejÃ³ de ser intuiciÃ³n y pasÃ³ a estar medida** (`.claude/rules/voz-ricotera.md`). Se tomÃ³ la idea guardada del 21. Dos corpus del propio repo: el memoir (`RES-21`, 192.464 palabras) y las letras de los 104 temas (2.958 versos). Lo que saliÃ³: el verso mediano son **5 palabras** y el 90% no pasa de 8 â€” de ahÃ­ el techo de las lÃ­neas grandes; la letra le habla a alguien (*tu/tus* 146 contra *mi/mis* 115) y prefiere el cuerpo a los colores (75 contra 17); y el habla es corta (oraciÃ³n mediana de 13 palabras), rodea en vez de definir (*una especie de* 49, *mÃ¡s bien* 55) y **declara la duda** (*creo que* 81, *no sÃ©* 71). Los tres antÃ­dotos contra la imitaciÃ³n: *che* 9 / *viste* 15 / *digamos* 3 en 192 mil palabras; *los fans* 2 contra *la gente* 333; y Ã©pica militante casi nula (*lucha* 6). **La regla prohÃ­be expresamente que el sitio se haga pasar por Ã©l**: una frase inventada con su firma romperÃ­a el rÃ³tulo `testimonio`, que es la promesa que sostiene todo lo demÃ¡s (`D-14`). NaciÃ³ tambiÃ©n `src/lib/voz.test.ts` â€”lo que la sugerencia del 21 marcaba como inexistenteâ€”: seis pruebas sobre el copy visible, que encontraron y corrigieron **once botones en infinitivo** contra `D-17`. 185/185. **Y el barrido entrÃ³ el mismo dÃ­a**, con las dos decisiones del usuario: la Redondopedia va con prosa con voz y rÃ³tulo seco (registro 2 + 3), y el copy nuevo alcanza solo a las superficies que presentan â€” portada, seis casetes, pantalla 0 y tramos de resultadoâ€”, nunca a lo que hay que entender para jugar. 186/186. |
| 2026-08-23 | **`IDEA-11` guardada, sin empezar: mayor o menor con las palabras del cancionero.** Idea del usuario â€”arrancÃ¡s con una palabra y su cantidad de apariciones en la discografÃ­a, y vas diciendo si la siguiente se dice mÃ¡s o menos, sumando rachaâ€”, con la instrucciÃ³n explÃ­cita de guardarla y no desarrollarla. Ficha completa en `Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md` (la carpeta del PRD es de `producto`), nÃºmero reservado en `Docs/IDS.md`. **No aplica `BR-15`** aunque el gÃ©nero exista: el motor son dos botones, lo caro es el dato â€” igual que `IDEA-09`. **Lo que la vuelve barata:** el corpus ya estÃ¡ en el repo desde el ciclo 6, no necesita audio, ni imagen, ni ficha de `investigador`, ni motor con licencia; y no roza `BR-03`/`BR-12` porque muestra palabras y nÃºmeros, nunca versos. **Lo que la frena, medido hoy sobre `src/data/cancionero.json`:** de los 104 temas, 96 tienen letra, y contando en crudo las lÃ­neas tipadas `t: "letra"` la palabra mÃ¡s frecuente da **`riff` 306 veces** y la segunda `guitarra` 156 â€” son anotaciones de la cifra viajando adentro de la letra (cifraclub aportÃ³ 88 de los 104). Filtrando lo que parece anotaciÃ³n se caen 1.070 lÃ­neas y quedan 2.858, con al menos una sucia en 80 temas, y **todavÃ­a queda basura arriba**. Como el conteo **es** la respuesta correcta, sin limpiar el corpus el juego rompe lo Ãºnico estricto de `CLAUDE.md`. Esa limpieza es la misma deuda que ya arrastran `IDEA-08` y `US-03`: se paga una vez y sirve para las tres. |
| 2026-08-23 | **`IDEA-04` dejÃ³ de ser un gÃ©nero y pasÃ³ a tener meta: hay que llegar a tomar el Ãºltimo bondi.** El usuario lo pidiÃ³ como "otro juego" â€”*"un mario de plataformas simple pero que hay que llegar a tomar el Ãºltimo bondi a Finisterre"*â€” y **no se abriÃ³ ID nuevo a propÃ³sito**: es la misma idea del 22, que estaba guardada con la frase pelada *"Plataformas ultimo bondi a finisterre"*. Un ID nuevo para la misma idea es justo lo que `Docs/IDS.md` evita. Ficha actualizada en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md` (la carpeta del PRD es de `producto`). **Lo que la meta resuelve sola:** el choque principal de la ficha era "largo de nivel contra la sesiÃ³n de dos o tres minutos", y ahora el que corta el nivel es el bondi que arranca â€” la cuenta regresiva es el micro, no un nÃºmero en la esquina, que es lo que pide `diseno-marca.md`. AdemÃ¡s empuja los controles hacia un solo botÃ³n (correr a alcanzar algo que ya se estÃ¡ yendo) y regala la pantalla de derrota: "el Ãºltimo" quiere decir que no hay otro, y quedarse a pie no necesita ni chiste ni consuelo. **Tres precisiones verificadas hoy contra el cancionero:** *Ãšltimo bondi a Finisterre* es un **disco, no un tema** â€”los diez temas estÃ¡n cargados y ninguno lleva ese tÃ­tuloâ€”, la palabra *bondi* aparece **una sola vez** en los 96 temas con letra y es en *El lobo caÃ­do* (Lobo suelto, 1993), ~~y *Finisterre* **no aparece nunca**~~ â€” **mal medido, y lo corrigiÃ³ el usuario el 2026-08-24: lo que medÃ­ fue el corpus del repo y lo escribÃ­ como si fuera un hecho sobre las letras. *Finisterre* estÃ¡ cantado en *Gualicho*, cuya letra el repo no tiene.** Queda pedido a `investigador`: quÃ© es Finisterre, porque el juego puede usar el nombre del disco pero no afirmar quÃ© significa hasta que haya `RES-XX`. Sigue sin empezar, sigue fuera de la v1, y sigue con lo caro abierto: motor 2D con licencia (`BR-15`) y el skin, el mÃ¡s caro de los cinco clones. |
| 2026-08-24 | **`IDEA-04` tiene tema: *Gualicho*, y el tema corrigiÃ³ un dato que yo habÃ­a medido mal el dÃ­a anterior.** El usuario avisÃ³ que el bondi a Finisterre estÃ¡ cantado ahÃ­. **Mi frase del 23 â€”"*Finisterre* no aparece nunca en las letras"â€” era falsa, y el modo de fallar vale mÃ¡s que el dato:** medÃ­ el corpus del repo y lo escribÃ­ como si fuera un hecho sobre las canciones. Es exactamente lo que `CLAUDE.md` llama poner una leyenda disfrazada de dato, con el agravante de que la fuente era un archivo propio. Corregido en la bitÃ¡cora del 23 y en `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`. **Lo que el tema aporta a la idea:** el destino deja de ser un tÃ­tulo de tapa y pasa a estar cantado; el verbo del juego sale de la letra â€”no es *tomar* el bondi, es **colgarse**â€”; *Gualicho* es la pista 4 del mismo disco, asÃ­ que tema, tapa y paleta (`RES-37`, `D-19`) son la misma cosa; y con `D-22` el mp3 existe, lo que vuelve concreta la consecuencia 3 de `BR-15` (mÃºsica de fondo en loop, sin ADR que la cubra). **`IDEA-04` es hoy la Ãºnica de las cinco ideas de clon con su mÃºsica decidida.** **El agujero que apareciÃ³ al ir a buscar el verso, medido sobre `src/data/cancionero.json`:** *Gualicho* estÃ¡ marcado `contenido: "letra"` y **no tiene una sola lÃ­nea cantada** â€”sus tres lÃ­neas tipadas `letra` son cifradoâ€”; en el mismo disco *Pogo* tiene 0 de 24 (es una tablatura entera) y *El Ã¡rbol del gran bonete* 1 de 4. Los otros seis con letra estÃ¡n completos y *Scaramanzia* estÃ¡ bien declarada como solo tablatura. Los tres agujeros vienen de cifraclub, fuente de 82 de los 104 temas. **Y hay un defecto vivo, chico pero visible:** `/letras-y-acordes/gualicho/` promete la letra de un tema y muestra tres lÃ­neas de acordes. La invariante de `src/lib/cancionero/banco.ts` que deberÃ­a atajarlo existe pero cuenta como verso cualquier lÃ­nea tipada `letra`, asÃ­ que el cifrado le pasa por al lado. |
| 2026-08-24 | **AuditorÃ­a de detalles con la skill `impeccable`** sobre el portal y el quiz: 15/20, 4 P1 y 7 P2, todos arreglados y verificados en pantalla el mismo dÃ­a. El grueso: `.primario` era una regla con alcance de pÃ¡gina y los botones que crea el JavaScript salÃ­an sin estilo (siete botones en cuatro juegos); el auto-avance de 1,2 s se comÃ­a la explicaciÃ³n en 22 de 40 Ã­tems; el foco se caÃ­a al `<body>` en cada cambio de pantalla; y el link de `COMPARTÃ` no tenÃ­a tarjeta. Informe en `Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md`. EntrÃ³ ademÃ¡s la figura encadenada a la portada, **sin atribuirle disco** hasta que haya ficha. |
| 2026-08-27 | **`T-133`: `CTR-09`, el schema del banco de `US-07`** (`Docs/ARQ/ARQ-schema-adivinar-por-la-letra.md`). El banco es `src/data/por-la-letra.json`, un Ã­tem **por tema**, con la ventana de **8 versos** que revela la escalera de `BR-20` y **ni un dato de la escalera**: los pasos se cortan con `slice(0, 1|2|4|8)`. Sin `id` posicional â€”la identidad es el slug, que sale de `RES-20` y no se correâ€”, sin `estado` y sin distractores. El schema **sÃ­** se baja a `src/data/_schema/por-la-letra.schema.json` (al revÃ©s que `CTR-03.8`, con el motivo escrito) y entra a `esquemas.test.ts` con un token. **El enganche de `CNT-11`**: una funciÃ³n `ventanaValida()` que devuelve el motivo del descarte, mÃ¡s `filtro.version` en el envoltorio comparado contra `VERSION_FILTRO` â€” asÃ­ un banco generado con la regla vieja no se puede hacer pasar por filtrado. La dificultad manual va a `src/data/por-la-letra-curaduria.json` (de `contenido`, keyed por slug) y un tema sin etiqueta **entra igual** como `sin-clasificar`, para no repetir el pozo de tres ciclos de `US-03`. **Hallazgo medido de paso: `sirveComoVerso("[A  G]")` devuelve `true`** â€” estÃ¡ en `letra.json` como contexto de `CL-265` y `CL-266`. En `US-03` era un renglÃ³n feo; en `US-07` serÃ­a el enunciado entero del paso 1. Tapado por schema en `CTR-09.4`; el arreglo de fondo, en `Docs/SUGERENCIAS/ARQ-para-hilo-principal-verso-de-acordes.md`. |
| 2026-09-01 | **`/ciclo` planificÃ³ el ciclo 10** (`Docs/ORQ/ORQ-plan-ciclo-10.md`, `T-161`..`T-175`, dos tramos). Es un ciclo de **cierre**: no agrega un juego, un Ã­tem ni una pantalla â€” mira lo construido contra lo escrito. **Lo que lo motiva saliÃ³ de medir, no de recordar: los cinco pisos de la v1 estÃ¡n cumplidos y la v1 no estÃ¡ lista.** `src/scripts/partida-tema.ts:196-202` arma la vuelta de `US-02` con un Fisher-Yates sobre los 95 temas y corta cuatro; **la palabra `dificultad` no aparece una sola vez en el archivo** y `adivinar-tema.json` no tiene el campo en ninguno de sus 95 Ã­tems. Es `FIND-29` â€”el defecto que `REV-08` encontrÃ³ en `US-07`â€” **vivo en un juego de la v1**, donde pesa mÃ¡s porque `US-07` estÃ¡ fuera del "Listo" por `D-05`. Contra eso, `PRD-alcance-v1.md` le exige a `US-02` **mÃ­nimo 8 de nivel FÃ¡cil** por `BR-18` (f): hoy son 0 y `BR-01` no se cumple. **Segundo hallazgo del mismo tirÃ³n:** `adivinar-tema.json` es el **Ãºnico banco de juego sin schema** â€” `esquemas.test.ts` valida siete archivos y ese no estÃ¡, asÃ­ que los 95 Ã­tems del banco mÃ¡s grande de la v1 son los Ãºnicos que nadie valida a mÃ¡quina. El frente A (`T-161`..`T-165`) cierra las dos cosas y **estÃ¡ construido para andar con cero mediciones**: degrada a barajado declarado como `US-07`, asÃ­ que el ciclo no se cuelga de la clave de YouTube. Cierra `T-174` (`REV-09`), la revisiÃ³n que declara la v1 o dice quÃ© falta. |
| 2026-09-01 | **Ciclo 10 hecho entero en una rÃ¡faga: `T-161`..`T-175`, catorce de quince** (falta `T-165`, la clave de YouTube, que es del usuario). `npm test` **372/372** (eran 352), `check` limpio, build de 150 pÃ¡ginas. **El defecto que lo motivÃ³:** `US-02` armaba la vuelta con un Fisher-Yates sobre los 95 temas y `dificultad` no aparecÃ­a una sola vez en el archivo â€” `FIND-29` vivo en un juego de la v1. **La salida resultÃ³ mÃ¡s chica y mejor ubicada que la que yo habÃ­a planificado, y porque `arquitectura` ya la habÃ­a escrito hace un ciclo:** *"serÃ­a un dato nuevo y no irÃ­a en el manifiesto â€” irÃ­a en el catÃ¡logo, al lado de `RES-20`"*. AsÃ­ que `CTR-03` revisiÃ³n 4 (`CTR-03.11`) pone la dificultad en `catalogo()`, derivada en build de las escuchas, **sin tocar el archivo de datos**; `CTR-03.8` â€”la decisiÃ³n de no bajar el schema a archivoâ€” se re-evaluÃ³ y **se ratificÃ³**, porque el campo nuevo tampoco se carga a mano. **Mi plan decÃ­a que `adivinar-tema.json` era "el Ãºnico banco sin contrato" y era falso:** tiene `CTR-03` y la falta del `.schema.json` es una decisiÃ³n con tres motivos escritos. De paso, dos reglas que estaban duplicÃ¡ndose se unificaron: `repartirPorPopularidad` (`D-27`) pasÃ³ a `src/lib/popularidad.ts` y el escalonado de `BR-01` a `src/lib/escalonar.ts`, que ahora comparten `US-02` y `US-07` â€” `ronda.ts` no se tocÃ³. **`REV-09` abriÃ³ en ðŸŸ¡ y cerrÃ³ en ðŸŸ¢**, con cuatro hallazgos: `FIND-34` (los pisos de `US-02` y `US-03` llegaron el 27-ago y nadie prendiÃ³ su guarda), `FIND-35` (tres criterios de aceptaciÃ³n de la v1 describÃ­an un producto que ya no existe: Spotify y el cerrojo de derechos que `D-22` y `D-14` retiraron), `FIND-36` y `FIND-37`. **Lo demÃ¡s del ciclo:** el `h1` del quiz bajÃ³ de diez palabras a cinco â€”*"EntrÃ¡, sepas lo que sepas."*â€” y con eso `voz.test.ts` audita los seis `h1` de portada, hueco que llevaba un ciclo abierto; `QZ-025` (Bulacio) dejÃ³ de acertarse con civismo y pasÃ³ al Ã¡ngulo que `CNT-04` ya fichaba, el tiempo que tardÃ³ la Justicia; el verso `",l mi viejo"` se arreglÃ³ en `cancionero.json` **y un barrido independiente encontrÃ³ de paso cuatro candidatos de `US-03` cuyo "verso" es prosa del transcriptor de cifraclub â€” ninguno llegÃ³ a `listo`**; `UX-13` adoptÃ³ los diez zooms de tapas que el hilo principal habÃ­a elegido sin `experiencia`; `CTR-05.5` ratificÃ³ la regla de `encuadre` que se le habÃ­a reemplazado sin ser su dueÃ±o; y tres explicaciones de tapa que hablaban del tÃ­tulo dejaron de seÃ±alar algo que el zoom sacÃ³ de pantalla â€” `TP-001` ademÃ¡s **llamaba "tÃ­tulo" al nombre de la banda**, verificado abriendo la imagen. **La deuda de mÃ©todo, declarada y no tapada (`FIND-37`): las quince tareas y la revisiÃ³n salieron de la misma mano**, incluidas decisiones de `producto`, `arquitectura` y `experiencia`. Es la tercera vez en tres ciclos que el proyecto tropieza con lo mismo. |
| 2026-09-24 | **AuditorÃ­a de prompts (`/claude-api prompt-audit`): los agentes y las skills estaban en el 19 de agosto.** Los 7 agentes y las 11 skills no se habÃ­an tocado desde que entraron al repo, y le seguÃ­an diciendo a cada rol cosas que `D-05`, `D-14`, `D-19`, `D-21`, `D-22` y `ADR-01` ya habÃ­an dado vuelta: que la nota de derechos bloquea publicar, que Spotify es la vÃ­a al tema completo y `ADR-01` sigue abierta, que las tapas van solo en su juego, que los juegos 3 y 4 estÃ¡n por confirmarse. AdemÃ¡s, cuatro agentes y cinco skills mandaban al rol a escribir `ESTADO.md`, que `Docs/EQUIPO.md` reserva al hilo principal. Y `revisor` y `coherencia` tenÃ­an un tope de lÃ­neas que le recorta la cobertura a un modelo que lo cumple al pie de la letra. **Aplicados 14 hallazgos** (9 de confianza alta, 5 media) en 20 archivos de `.claude/` y en `CLAUDE.md`, que ademÃ¡s perdiÃ³ los tres avisos que corregÃ­an su propio pÃ¡rrafo: ahora dice lo vigente y apunta a `PRD-alcance-v1.md` para los pisos. Informe completo, con lo que se marcÃ³ y no se tocÃ³, en `Docs/SUGERENCIAS/HILO-auditoria-prompts-ia.md`. **Pendiente:** correr el validador de instancia (`D-11`), que no estÃ¡ en el contenedor donde se hizo esto, y mirar en la prÃ³xima delegaciÃ³n real que ningÃºn rol toque `ESTADO.md` y que `revisor` traiga todos los hallazgos. |
