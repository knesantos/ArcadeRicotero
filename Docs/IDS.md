# Identificadores trazables — RicotaArcade

> Un requisito sin ID no existe. Un entregable que no cita los IDs de los que depende no
> es trazable, y dentro de dos meses nadie va a saber por qué está ahí.

## Convención

`<PREFIJO>-<número de 2 dígitos>` — ej. `US-01`, `ADR-03`, `RES-07`, `T-14`.
Se numera correlativo por prefijo y **no se reutiliza** un número, ni aunque el ítem se
cancele. Un ID cancelado se marca `[CANCELADO]` y se queda donde está.

### Reserva de rangos cuando hay dos sesiones a la vez

"Correlativo" supone **un solo contador**, y eso deja de ser cierto en cuanto dos sesiones
de Claude trabajan sobre el mismo repo sin verse. Las dos miran el disco, las dos ven que
el último es `RES-03`, y las dos escriben un `RES-04` distinto. El daño no es el archivo
duplicado —eso se ve— sino la cita: una pregunta del quiz que diga "fuente: `RES-04`" queda
ambigua para siempre, y ese prefijo es justo el que sostiene el criterio no negociable
"ningún dato falso".

**Regla: antes de abrir una segunda sesión sobre este repo, reservá el rango por escrito
acá abajo.** Cuesta una línea y es la única defensa, porque una sesión no puede preguntarle
a la otra qué número tomó.

| Rango | Reservado para | Desde | Estado |
|---|---|---|---|
| `RES-04` … `RES-09` | Primera sesión paralela de investigación sobre la banda | 2026-08-19 | **cerrada — rango consumido entero** (`INV-02-banda-cultura-estetica.md`) |
| `RES-10` … `RES-19` | Sesión principal. Primera: `RES-10`, `E-07` de `ADR-01` (`T-13` del ciclo 1) | 2026-08-19 | activa |
| `RES-20` … `RES-29` | **Segunda sesión paralela de investigación, en curso.** Si estás en esa sesión, **tomá de acá**: `RES-10`+ ya está reclamado por la principal | 2026-08-19 | **activa** |
| `RES-30` … `RES-43` | Sesión del sistema de marca (tipografía, lettering y paletas de tapas) | 2026-08-21 | **cerrada — rango consumido entero** (`INV-07-tipografia-lettering-tapas.md`) |
| `RES-44` … `RES-49` | **Ciclo 4.** `RES-44` es la auditoría de edición de las tapas (`T-47`), `RES-45` la fuente de letras (`T-60`) | 2026-08-21 | **activa** |
| `BR-13`, `BR-14` | **Ciclo 5**, tareas `T-66` y `T-67` de `producto`, ambas en `PRD-redondopedia.md` | 2026-08-22 | **activa** |
| `BR-15`, `BR-16` + `IDEA-01` … `IDEA-10` | **Sesión del backlog de ideas** (`PRD-backlog-ideas.md`). Tomó 15 y 16 salteando 13 y 14 porque el ciclo 5 ya los tenía reservados — ver nota abajo | 2026-08-22 | **cerrada — rango consumido entero** |
| `IDEA-11` | **Sesión del 2026-08-23.** Idea del usuario guardada como ficha en `Docs/SUGERENCIAS/HILO-para-producto-idea-11-mayor-o-menor.md`, todavía sin pegar en `PRD-backlog-ideas.md` — la carpeta es de `producto` | 2026-08-23 | **cerrada — pegada en el PRD por `T-100` del ciclo 7** |
| `T-97` … `T-107` · `RES-49`, `RES-50` · `CNT-08` · `REV-06` | **Ciclo 7** (`ORQ-plan-ciclo-7.md`). `RES-49` y `RES-50` salen del rango del ciclo 4, que estaba abierto y las tenía pedidas | 2026-08-24 | **cerrada — `T-103` y `T-105` canceladas, sus números no se reutilizan** |
| — | ⚠ **Hay otra sesión escribiendo este repo el 2026-08-24** y no reservó rango: dejó `Docs/SUGERENCIAS/HILO-para-producto-idea-04-la-meta-del-bondi.md`. No tomó IDs nuevos (reusa `IDEA-04`), así que no chocó — pero es el caso que esta tabla existe para evitar | 2026-08-24 | **abierta** |
| `T-161` … `T-175` · `CTR-11` · `RES-53` · `REV-09` · **`UX-13`, `UX-14`** | **Ciclo 10** (`ORQ-plan-ciclo-10.md`), en una sesión que corre en paralelo a la del ciclo 11 | 2026-09-01 | **activa** |
| `T-176` … `T-194` · `ADR-03`, `ADR-04` · `CNT-13` · `D-32` · `REV-10` · **`UX-20` … `UX-24`** | **Ciclo 11** (`ORQ-plan-ciclo-11.md`), la sesión de inmersión. **Toma `UX-20`+ y no `UX-15`+ a propósito:** el ciclo 10 avanza sobre el contador de `UX-` a su propio ritmo y las dos sesiones no se ven. Un bloque lejano cuesta lo mismo y no se pisa | 2026-09-01 | **activa** |
| `T-195` … `T-210` · `UX-22` · `RES-54` (archivo `INV-54`) · `ADR-05`, `CTR-12` · `CNT-14` · `D-33` · `REV-11`, `FIND-46`+ | **Ciclo 12** (`ORQ-plan-ciclo-12.md`), la imprenta de Rocambole. Sesión única, sobre `ciclo-11/el-sitio-como-lugar`. `UX-22` es el primer número libre del bloque que reservó el ciclo 11 | 2026-09-01 | **cerrada — rango consumido entero.** `T-195`..`T-210` usadas, ninguna cancelada. `REV-11` llegó hasta `FIND-51` |
| `IDEA-14` · `RES-60` … `RES-69` (archivo `INV-60`) · `D-38`, `D-39`, `D-40` | **Sesión de "Skayboy y Poligirl"** (2026-09-11), el juego tipo *Fireboy & Watergirl* que pidió el usuario: guardar la idea y arrancar el relevamiento. Toma `RES-60`+ y **no** `RES-56`+ a propósito: el ciclo 14 llegó primero y ya reservó `RES-56`+ en `ORQ-plan-ciclo-14.md`. Un bloque lejano cuesta lo mismo y no se pisa | 2026-09-11 | **activa** |
| `T-226` … `T-260` · `D-41`, `D-42`, `D-43` · `US-09` · `BR-23`+ · `ADR-08` · `CTR-15`+ · `UX-27`+ · `CNT-17`+ · `REV-14`, `FIND-55`+ · `RES-70`+ | **Ciclo 15: Skayboy y Poligirl se construye** (`ORQ-plan-ciclo-15.md`), abierto el 2026-09-16 cuando el usuario trajo la hoja de sprites. Arranca sobre `main` en `d4f44fe`. Reparto por rol para que los tres escriban en paralelo sin mirarse: `producto` toma `US-09`/`BR-23`+, `arquitectura` `ADR-08`/`CTR-15`+, `experiencia` `UX-27`+, `orquestador` `T-226`+. **Ampliado a `T-260` el mismo día**, cuando `REV-14` obligó a sumar tareas que el plan no tenía: `FIND-58` y `FIND-60` no las cubría ninguna | 2026-09-16 | **cerrada el 2026-09-22 por absorción.** Usadas `T-226`..`T-254`; **`T-255`..`T-260` quedan quemadas**. Lo que no se hizo pasa al ciclo 16 con número nuevo: `T-238`+`T-243` → `T-268`, `T-246` → `T-275`/`T-276`, `T-250`+`T-252` → `T-280`, y `T-249` queda como partida del usuario |
| `T-261` … `T-290` · `D-44`, `D-45` · `BR-29` · `ADR-09` · `CTR-18`, `CTR-19` · `UX-31`+ · `CNT-21`+ · `RES-73`+ (archivo `INV-73`) · `REV-15`, `FIND-71`+ · `IDEA-15`+ | **Ciclo 16: el fichín se prueba solo** (`ORQ-plan-ciclo-16.md`), abierto el 2026-09-22 sobre `main` en `1478ae7`. `D-44` y `D-45` las escribió el hilo principal al abrir, con las dos decisiones del usuario. El plan usa `T-261`..`T-285` (`T-281` entró el 2026-09-23 con la enmienda de `D-45`; `T-282`..`T-285` el 2026-09-24 con `D-46`, y `T-286`..`T-288` el mismo día con su precisión para `US-03`). **Ampliado a `T-295` el 2026-09-24** para la ráfaga 4, que cierra `REV-15`: `T-289`..`T-295`; **y a `T-310` el mismo día** para la ráfaga 5 (`D-47`): `T-296`..`T-304`. `D-47`, `BR-31`, `UX-33`, `CNT-22`, `ADR-10` los toma la ráfaga 5. **`RES-73`..`RES-75` los tomó `INV-73`, `RES-76`..`RES-88` los tomó `INV-76`; `T-282` escribe desde `RES-89` en `INV-89`.** `D-46` es la del 2026-09-24; `BR-30` es de `T-283`. **`REV-15` va por `FIND-79`** (tercera pasada, la ráfaga 5) | 2026-09-22 | **activa** |
| `D-48` · `US-10` · `BR-32`, `BR-33` · `CTR-20` · `UX-34` · `CNT-25` · `REV-16`, `FIND-80`+ · `RES-93`..`RES-98` (archivo `INV-93`, el género) · `RES-100`..`RES-139` (archivo `INV-100`, los números de la banda) | **"Más o menos" (`IDEA-11` promovida), 2026-09-25.** Pedido del usuario: *"tomá un juego barato del estado que no esté hecho y resolvelo completamente"*. Rama `ciclo-16/mas-o-menos`. Una ráfaga sin plan de `orquestador`: el reparto por rol está en las consecuencias de `D-48`, y cada rol toma solo su número. **El mismo día el usuario amplió el juego**: preguntas de número de todo tipo, no solo las letras. `RES-99` queda salteado: lo usa un fixture de `letra/banco.test.ts` | 2026-09-25 | **cerrada.** Usados todos los reservados; `RES-93`..`RES-98` y `RES-100`..`RES-105` (`RES-106`..`RES-139` quedan libres para una segunda ronda de `INV-100`). `REV-16` llegó hasta `FIND-85` |
| `D-51`, `D-52`, `D-53` · `BR-34`, `BR-35` · `CNT-26`, `CNT-27`, `CNT-28`, `CNT-29` · `RES-140`..`RES-149` (archivos `INV-140`, `INV-141`) · `REV-17`, `FIND-86`+ | **"Lo que nadie puede encontrar"**, 2026-10-01. Pedido del usuario: resolver el relevamiento de otro agente e integrarlo al sitio (`D-51`). Sin plan de `orquestador`: cada rol tomó solo su número. `RES-140` es Spotify; `RES-141` lacuerda.net (provisional); `RES-142`..`RES-145` quedaron **[CANCELADOS]**: eran el cotejo de la letra y la red del entorno no lo dejó correr | 2026-10-01 | **activa** |
| `T-311` … `T-330` · `D-54` · `UX-35` · `REV-18`, `FIND-99`+ | **Ciclo 17: la mesa y la carátula** (`ORQ-plan-ciclo-17.md`), abierto el 2026-10-02 sobre `main` en `039bebd`, rama `ciclo-17/escritorio`. Pedido del usuario: *"un ciclo entero y complejo de mejora visual de desktop para el home y todos los juegos. Debe quedar profesional y lindo en ambas formas desktop y mobile"*. Sesión única; `D-54` la escribe el hilo principal al abrir | 2026-10-02 | **cerrada el mismo día.** Usados `T-311`..`T-319` (`T-319` es del usuario: el lienzo), `D-54`, `UX-35`, `REV-18` con `FIND-99`..`FIND-110`. **`T-320`..`T-330` quedan quemadas** |
| `D-55` | **Skayboy sin botones en la computadora**, 2026-10-02, al cerrar el ciclo 17. Pedido del usuario: *"En desktop que no muestre los botones de skauboy y poligirl"*. Sin plan propio: lo hizo el hilo principal en la misma rama | 2026-10-02 | **cerrada** |
| `T-351` … `T-370` · `D-62` (se escribió `D-59` y se renumeró al integrar, el 2026-10-05: el `D-59` del dominio llegó antes a `main`) · `BR-38` · `CNT-31`+ · `UX-38` (sumado el 2026-10-05, por el plano de dos ejes: `UX-37` lo tomó `D-61`) · `RES-172` … `RES-199` (archivo `INV-172`) · `REV-20`, `FIND-119` … `FIND-131` (`FIND-128` y `FIND-129` **quemados**: los lentes de `REV-20` numeraron por su cuenta y circularon con otro sentido; `FIND-130` y `FIND-131`, la portada a 320, antes y después de `D-67`) · `T-351` (el plano en el lienzo, hoja 16: hecha), `T-352` (el texto del lector: hecha), `T-353` (la orientación: la decidió el usuario) | **Ciclo 19: la noche ricotera entera** (`D-62`), abierto el 2026-10-04 sobre `main` en `93f292a`, rama `ciclo-18/que-ricotero-sos` (reabierta desde `main` después del PR #28). Pedido del usuario: *"las preguntas más ricoteras: el recital ricotero es barro, sucio, drogas, reviente, y también familia, amigos, amor"*. Sin plan de `orquestador`: el reparto está en `D-62`. El plano de dos ejes volvió a pedido del usuario (`D-62` enmiendas 2 y 3) | 2026-10-04 | **activa** (integrada a `main` el 2026-10-05 y el 2026-10-06, PR #41; `REV-20` cerrada el 2026-10-06, `FIND-132` y `FIND-133` cerrados en papeles después: ver `ESTADO.md`) |
| `D-56` | **La analítica de Vercel**, 2026-10-02. Pedido del usuario: *"Activa el web analitics de vercel en el repo"*. La anotó tarde el ciclo 18: no tenía fila | 2026-10-02 | **cerrada** |
| `T-331` … `T-350` · `D-57`, `D-58` · `BR-36`, `BR-37` · `CTR-08` v2 (sin número nuevo; `CTR-21` solo si nace un contrato aparte) · `UX-36` · `CNT-29` (ya reservado por la fila de `D-51`) y `CNT-30`+ · `RES-150` … `RES-171` (archivo `INV-150`) · `REV-19`, `FIND-111`+ · `IDEA-16`+ | **Ciclo 18: "¿Qué tipo de ricotero sos?"** (`ORQ-plan-ciclo-18.md`), abierto el 2026-10-04 sobre `main` en `bc27cd4`, rama `ciclo-18/que-ricotero-sos`. Pedido del usuario: *"un ciclo entero de mejora importante sobre el juego de qué tipo de ricotero sos, mejora artística, de preguntas, de resultado y de otras cosas"*. Sesión única; `D-57` la escribe el hilo principal al abrir | 2026-10-04 | **cerrada el mismo día.** Usados `T-331`..`T-346`, `D-57` (con siete enmiendas) y `D-58`, `BR-36`, `BR-37`, `CTR-08` v2 (con su enmienda 1; no hizo falta `CTR-21`), `UX-36`, `CNT-29` y `CNT-30`, `RES-150`..`RES-171`, `REV-19` con `FIND-111`..`FIND-118`. **`T-347`..`T-350` quedan quemadas**; `CNT-31`+, `FIND-119`+ e `IDEA-16`+ no se usaron y quedan libres. `REV-19` la hizo el hilo principal por falta de cupo de subagentes (`FIND-117`) |
| `D-59` | **El dominio**, 2026-10-04. Pedido del usuario: *"investigá dónde y cómo comprar lo más barato posible el dominio"*, y después *"metelo en Vercel"*. Sin plan propio: lo hizo el hilo principal en la rama `dominio/fichinricotero` | 2026-10-04 | **cerrada** |
| `D-60` | **El sitio se llama Fichín Ricotero**, 2026-10-04. Pedido del usuario: *"Vamos a cambiar el nombre de la pagina por fichin ricotero [...] arcade ricotero no se podia comprar el dominio"*. Sin plan propio: lo hizo el hilo principal en la rama `nombre/fichin-ricotero`. Toma `D-60` porque `D-59` quedó tomado dos veces (la rama `dominio/fichinricotero` y la reserva del ciclo 19) | 2026-10-04 | **cerrada** |
| `D-61` · `UX-37` · `CNT-40` · `BR-40` · `T-401` … `T-410` · `REV-21`, `FIND-140`+ | **Skayboy y Poligirl: el menú, el paso entre niveles y el mando del teléfono**, 2026-10-04. Pedido del usuario: *"Hacé una sesión entera agregándole menú, paso entre niveles y corrigiendo la jugabilidad de las teclas en mobile"*. Sin plan de `orquestador`: `D-61` la escribe el hilo principal, y cada rol toma solo su número (`experiencia` `UX-37`, `contenido` `CNT-40` —el `CNT-29` sigue reservado para lo suyo—, `producto` `BR-40`). `T-401`+ son las tareas que queden abiertas. **Se escribió como `D-56` · `UX-36` · `CNT-30` · `BR-36` · `T-331`+ · `REV-19` y se renumeró al integrar**: el ciclo 18 llegó antes a `main` con esos números. Se tomó un bloque lejano porque `D-59` y `D-60` ya los tienen otras ramas (el dominio, el ciclo 19 y el nombre del sitio) y el ciclo 19 reserva `T-351`..`T-370`, `BR-38`, `CNT-31`+ y `REV-20` | 2026-10-04 | **activa** |
| `D-63` | **El fondo del portal es negro liso y la gente de *Oktubre* mira desde el final de la página**, 2026-10-04. Pedido del usuario, con la imagen adjunta: *"Usemos esta imagen de fondo de la pagina, sin la parte de las letras de oktubre, un fondo negro y sobre el final de la pagina las personas mirando"*. Sin plan propio: lo hizo el hilo principal en la rama `diseno/fondo-multitud`, sobre `main` en `76ba9d3`. **Se escribió `D-62` y se renumeró al integrar, el 2026-10-05**: el `D-62` de la noche ricotera (el ciclo 19, que también venía renumerado) llegó antes a `main`. Corren con él las dos que quedan propuestas en `Docs/SUGERENCIAS/`: el sello de las tapas pasa a `D-64` y las letras de disco a `D-65`, sin reservar todavía | 2026-10-04 | **cerrada** |
| `D-64`, `D-65` | **La sombra sale de todos lados y las tapas se sellan; la letra de la banda escribe el título de cada juego**, 2026-10-05. Pedidos del usuario: *"Saquemosle la sombra a las letras de las tapas de los juegos [...] algo asi como tinta en papel viejo"*, *"Sisi saquemos la sombra de todos lados, no me gusta. Ademas hay que usar la tipografia de los discos en mas lados"*. Sin plan de `orquestador`: lo hizo el hilo principal en la rama `diseno/la-multitud-se-acerca`, con un panel de diseño (tres propuestas y tres jueces) para el sello y un subagente para sacar las sombras de `juego.css` y sus hermanas. Los números los proponían los documentos de `Docs/SUGERENCIAS/` desde el 2026-10-05 y nadie los tomó en el medio | 2026-10-05 | **cerrada** |
| `D-66` · `RES-200` … `RES-206` (archivo `INV-200`) | **La llave de silencio del iPhone no apaga "Adiviná el tema"**, 2026-10-06. Pedido del usuario: *"Investiga la forma de que el boton de silencio de iphone no silencie el juego adivina el tema. Analiza el resultado y desarrolla la solucion e integrala si no rompe nada"*. Sin plan propio: lo hizo el hilo principal en la rama `audio/llave-de-silencio`, sobre `main` en `1357203`. **Saltea `D-64` y `D-65` a propósito**: los nombran las dos propuestas de `Docs/SUGERENCIAS/` (el sello de las tapas y las letras de disco), que siguen sin reservar | 2026-10-06 | **cerrada** |
| `D-67` | **Lobo suelto y la letra que viste *Luzbelito* escriben el título de su juego**, 2026-10-06. Pedidos del usuario: *"vamos a seguir integrando las otras dos que no estan en el sistema, la de lobo suelto y la otra que es medio luz belito"*, *"dale, seguí con lobo suelto y la de luzbelito"*. Sin plan de `orquestador`: lo hizo el hilo principal en la rama `tipografia/lobo-y-luzbelito`, sobre `main` en `8bb84ab`, en el worktree `../RicotaArcade-fondo` | 2026-10-06 | **cerrada** |
| `D-68` | **El orden de los juegos en el portal**, 2026-10-06. Pedido del usuario: *"que queden en este orden: Adivina el tema, que tipo de ricotero sos, sacalo por la letra, skayboy y poligirl, completa la letra, preguntas y desp como esta"*. Lo hizo el hilo principal sobre `main` en `3f0c84c` | 2026-10-06 | **cerrada** |
| `D-69` | **"Ponelos en fila" se reparte de a una, las filas las nombra el que juega, y entran los 105 temas**, 2026-10-10. Pedidos del usuario: *"Dejemos al usuario poder editar las categorias por lo que el quiera y agregar. Agreguemos el tierlist de TODOS LOS TEMAS con nombre y disco"*, *"que el juego se vea mas lindo y sea mas divertido y facil de jugar"*, y que suene el recorte de cada tema (y de un tema del disco, en las fichas de disco). Sin plan de `orquestador`: lo hizo el hilo principal en la rama `ponelos/filas-propias`, sobre `main` en `41292f9`. Antes de tomar el número se miraron las ramas remotas: ninguna traía un `D-69` | 2026-10-10 | **cerrada** |
| `D-70` | **"Ponelos en fila" sube al A6 del portal, en el lugar de "Preguntas ricoteras"**, 2026-10-10. Pedido del usuario: *"cambia el lugar de ponelos en fila por el de preguntas ricoteras en el home"*. Lo hizo el hilo principal en la misma rama que `D-69` | 2026-10-10 | **cerrada** |
| `D-71` · `CNT-41` · `T-412` … `T-420` · `REV-22`, `FIND-141`+ | **Preguntas ricoteras se rehace entero (ciclo 20)**, 2026-10-15. Pedido del usuario: *"Hace un ciclo entero mejorando la ui/ux del juego de preguntas ricoteras [...] hoy esta muy duro y feo. Mejoremos el banco de preguntas"*. Sin plan de `orquestador`: `D-71` la escribe el hilo principal, `contenido` toma `CNT-41`, y `T-412`+ son las tareas que queden abiertas (`T-411` ya lo tenía la deuda del lienzo). El ciclo 19 fue la noche ricotera (`D-62`) | 2026-10-15 | **activa** |
| `D-72` · `IDEA-16` · `US-11`, `US-12` · `T-421` … `T-430` · `REV-23`, `FIND-153`+ | **Los recitales en pantalla ("En vivo", `IDEA-15`) y "Armá tu recital" (`IDEA-16`)**, 2026-10-15. Pedido del usuario: *"Hace la idea 15, hace al mismo tiempo el juego de CREAR tu propio recital"*. Sin plan de `orquestador`: `D-72` la escribe el hilo principal en la rama `ciclo-21/recitales`, sobre `main` en `afbe3ff`. `IDEA-16` era de la reserva del ciclo 18, que no la usó. `US-11` y `US-12` quedan para que `producto` escriba las dos historias; `T-421`+ son las tareas abiertas. Antes de tomar los números se miraron las tres ramas remotas sin integrar: ninguna usa `D-72` | 2026-10-15 | **activa** |
| `D-73` (y sus enmiendas: el zoológico, `T-435` … `T-437`; el aerógrafo, `T-438`, `T-439`; los recortes de las tapas, `T-440`, `T-441`; el perro, Luzbelito y Momo, `T-442`, `T-443`; el gordo Pierre, sin tareas nuevas, en `ciclo-23/bestiario` sobre `348ff26`; el camino con cruces, la séptima, `T-470` … `T-475`; la drácula con tacones, la octava, `T-444`, `T-445`, en `ciclo-24/bestiario` sobre `b30b481`; la carga de a una, la novena, que cierra `T-445`, en la misma rama; las dos de `ciclo-24` se escribieron como séptima y octava y se renumeraron al integrar, porque el camino llegó antes a `main`; los seis entornos, la décima, que cierra `T-443`, en `bestiario/fondos-rocambole`; Barbazul, la undécima, que cierra `T-444`, en `ciclo-25/bestiario` sobre `82c4453`) · `T-431` … `T-440` · `RES-340` … `RES-342` (archivo `INV-340`) | **El bestiario redondo** (`/redondopedia/bestiario/`), 2026-10-16. Pedido del usuario: *"Analiza diseña y construi el bestiario redondo. Arma una lista de TODOS los personajes que son parte de la mitologia de los redondos"*. Sin plan de `orquestador`: `D-73` la escribe el hilo principal en la rama `ciclo-22/bestiario`, sobre `main` en `fdaea84`. `RES-340`..`RES-342` los buscó `investigador` y los pasó al archivo el hilo principal. Se saltearon `RES-300`..`RES-337` porque los tiene `INV-300`, sin commitear en otra carpeta. Antes de tomar los números se miraron `origin/main` y las ramas remotas: ninguna usa `D-73`, `T-431`+ ni `RES-340`+ | 2026-10-16 | **activa** |
| `T-425` · `RES-207` … `RES-239` (archivo `INV-425`) | **Listas de recitales enteras con licencia abierta** (tarea `T-425` de `D-72`), 2026-10-15: Discogs (CC0 en sus volcados) con 29 grabaciones y el Fandom (CC BY-SA) como pista para los huecos. La escribió una sesión aparte; la ficha y esta fila se trajeron a `ciclo-21/recitales`, donde se cargaron las listas de Discogs. El próximo `RES-` libre es `RES-240` | 2026-10-15 | **activa** |
| `T-470` … `T-475` | **El camino con cruces** (`D-73`, séptima enmienda; se escribió como novena y se renumeró al integrar, porque llegó a `main` antes que las dos de `ciclo-24/bestiario`), 2026-10-18: cada región del bestiario es una página que se camina de costado bajando, con un cruce al final. Lo hizo el hilo principal en la rama `bestiario/camino-con-cruces`, sobre `main` en `159b1bc`. Toma un bloque lejano a propósito: la drácula (`ciclo-24/bestiario`) usa `T-444` y `T-445`, la Redondopedia (`diseno/redondopedia-inmersiva`, `D-75`) `T-450` … `T-453`, y la sesión de los fondos de los entornos (`bestiario/fondos-rocambole`) corre al mismo tiempo. Se escribió como `T-450`+ y se renumeró antes del primer commit, al enterarse del choque con la Redondopedia | 2026-10-18 | **activa.** Usadas `T-470` … `T-474`; `T-475` libre |
| `T-480` | **El negro Atila** (`D-73`, duodécima enmienda), 2026-10-18: el Atila a aerógrafo de *Lobo suelto* en la medianera del baldío. Lo hizo el hilo principal en la rama `bestiario/negro-atila`, sobre `main` en `45777d4`. Toma `T-480` y no `T-476`: hay otras sesiones haciendo personajes al mismo tiempo (Limón, Barbazul), y se deja el hueco para ellas | 2026-10-18 | **activa** |
| `D-73`, decimotercera enmienda · `RES-360` (archivo `INV-360`) | **La vaca cubana, a plumín, con la tele hecha satélite** (`D-73`), 2026-10-18. Pedido del usuario: *"Hace otro ciclo sobre el bestiario redondo. Agrega otro personaje y pulilo a fondo"*, y *"hace la vaca cubana"*. La escribe el hilo principal en la rama `ciclo-26/bestiario`, sobre `main` en `c1355e0`. Se escribió como duodécima (la (10) es de los entornos, #57, y la (11) de Barbazul, `ciclo-25/bestiario`) y se renumeró a decimotercera al juntar `main` en `352ef3a`, porque el negro Atila (#60) llegó antes con la (12). `RES-360` lo buscó `investigador` y lo pasó al archivo el hilo principal; se saltearon `RES-343` … `RES-359` para dejar lugar a las sesiones de Barbazul, Limón y el negro Atila, abiertas al mismo tiempo. Sin tareas nuevas | 2026-10-18 | **activa** |
| `D-74` | **El sitio se muda a una cuenta Hobby de Vercel**, 2026-10-17. Pedido del usuario: *"Estoy pensando mudar el proyecto de vercel a una cuenta free para poder usar mi cuenta pro en otro proyecto de mayor importancia"*. La escribe el hilo principal en la rama `vercel/hobby`, sobre `main` en `76cf504`. Antes de tomar el número se miraron `origin/main` y las ramas remotas: la última es `D-73` | 2026-10-17 | **cerrada** |
| `D-75` · `UX-39` (lo escribió `experiencia` con `T-451`) · `T-450` … `T-453` (`T-450` y `T-451` hechas el 2026-10-17) | **La Redondopedia de noche** (`D-75`), 2026-10-17. Pedido del usuario: *"Hace una pulida extrema de ui/ux a la redondopedia, debe sentirse inmersiva, misteriosa y mistica"*. Sin plan de `orquestador`: `D-75` la escribe el hilo principal en la rama `diseno/redondopedia-inmersiva`, sobre `main` en `83f6172`. Los números se acordaron con las dos sesiones del bestiario que corrían a la vez: el ciclo 24 del bestiario usa `T-444` … `T-449`, así que este empieza en `T-450` | 2026-10-17 | **activa** |
| `D-76` · `T-481` … `T-483` | **Al bestiario se entra caminando, el camino es la pantalla entera, y suena** (`D-76`), 2026-10-18. Pedido del usuario: *"El entorno caminable debe ser lo principal del bestiario"* y *"que se escuchen otras cosas, pasos, sonidos de los personajes, ruidos del entorno"*. La escribe el hilo principal en la rama `bestiario/entorno-primero`, sobre `main` en `46d36d1`. Es decisión aparte y no enmienda de `D-73`, porque cuatro ramas esperaban enmiendas de `D-73`. Antes de tomar los números se miraron `origin/main`, las ramas remotas y los worktrees: `T-476` y `T-480` estaban tomadas, así que arranca en `T-481` | 2026-10-18 | **activa** |


> **El caso que esta tabla existe para evitar pasó igual, el 2026-09-01, y quedó anotado
> porque es la mejor evidencia que tiene esta sección.** Las dos sesiones planificaron su
> ciclo el mismo día leyendo el mismo disco: las dos vieron que el último documento de
> `experiencia` era `UX-12`, y **las dos escribieron un `UX-13` distinto** — el zoom de
> tapas del ciclo 10 y "el sitio como lugar" del ciclo 11. Se detectó porque la sesión del
> ciclo 11 miró `git status` antes de dar nada por cerrado, no porque nadie avisara. La del
> ciclo 11 se corrió a `UX-20`+; la del 10 se queda con `UX-13` y `UX-14`, que ya estaban
> escritos. **Reservar el rango cuesta una línea; descubrirlo después cuesta renombrar
> archivos y arreglar citas.**

### Los nombres de archivo son otro contador compartido

Mismo problema, un nivel más arriba, y ya mordió: el plan del ciclo 1 le asignó a una tarea
el archivo `INV-02`, que la sesión paralela ya había tomado.

**Regla: el número del archivo `INV-` espeja el rango de fichas que contiene.** Así el
nombre delata de qué sesión vino y las dos pueden escribir en `Docs/INVESTIGACION/` sin
mirarse.

| Archivo | Fichas | Sesión |
|---|---|---|
| `INV-01`, `INV-02`, `INV-03` | `RES-01`..`RES-10` | histórico, anterior a esta regla |
| `INV-04`, `INV-05` | `RES-11`..`RES-14` | principal |
| `INV-20`, `INV-21`, `INV-22` | `RES-20`..`RES-29` | segunda paralela |
| `INV-06`, `INV-07` | `RES-15`, `RES-19`, `RES-30`..`RES-43` | sesión del sistema de marca |
| `INV-44`, `INV-45` | `RES-44`..`RES-49` | ciclo 4 |

Los tres primeros no se renombran: hay citas apuntándoles y renombrar rompe más de lo que
ordena. De `INV-04` en adelante vale la regla.

### El prefijo `D-` también necesita reserva

`Docs/DECISIONES.md` es archivo de raíz y **cualquier sesión puede querer escribir en él**.
Pasó el 2026-08-19: la sesión paralela tenía que registrar una decisión del usuario, vio que
`D-12` era el último, y **no asignó `D-13` a propósito** — porque la principal podía estar
tomando el mismo número en ese momento. Dejó la propuesta en `Docs/SUGERENCIAS/` y esperó.
Fue lo correcto.

**Regla: el prefijo `D-` lo escribe únicamente la sesión principal.** Una sesión paralela
que necesite registrar una decisión deja la propuesta en `Docs/SUGERENCIAS/` con el
fundamento y las alternativas ya redactadas, y **sin número**. La principal le asigna el ID.
Es más barato que partir el rango, porque las decisiones son pocas y casi siempre las toma
el usuario en la sesión donde está mirando.

Aplica al mismo problema con cualquier prefijo. En el ciclo 1 se reservaron además
`BR-04`/`BR-05`/`BR-06` entre tres tareas de `producto`, y `FIND-01`..`FIND-09` contra
`FIND-10`+ entre las dos revisiones. El detalle vive en
`Docs/ORQ/ORQ-plan-ciclo-1.md`, secciones 0.2 y 0.3.

**Y el 2026-08-22 la colisión de `BR-` pasó de verdad, esta vez con final feliz.** La sesión
del backlog de ideas leyó el disco, vio `BR-12` como último, y escribió `BR-13` y `BR-14`.
Al ir a cerrar chequeó `git status` y encontró que otra sesión estaba escribiendo el ciclo 5
en el mismo momento: `T-66` y `T-67` ya tenían esos dos números reservados, uno de ellos ya
escrito en `PRD-redondopedia.md`. Renumeró lo suyo a `BR-15`/`BR-16` antes de terminar.

Dos cosas que deja esa mordida, y valen más que la anécdota:
1. **Mirar el disco no alcanza: hay que mirar `git status`.** El trabajo de la otra sesión
   puede estar sin commitear y por lo tanto invisible para cualquier búsqueda de IDs que
   solo mire el árbol de trabajo de un archivo por vez.
2. **Reservar antes es más barato que renumerar después.** Acá salió gratis porque los
   `BR-13`/`BR-14` recién nacidos no tenían todavía ninguna cita apuntándoles. Un día más y
   habría habido tareas y revisiones citándolos.

Cuando una sesión termina, **su rango no se libera**: los números consumidos quedan
consumidos y los libres del rango se dan por quemados. Es más barato saltear seis números
que arriesgar una cita ambigua.

Los nombres de archivo llevan su propio prefijo de carpeta (`PRD-`, `ARQ-`, `INV-`,
`CNT-`, `UX-`, `REV-`, `ORQ-`), que **no es lo mismo** que el prefijo de los IDs que
contienen. Un archivo `Docs/PRODUCTO/PRD-quiz-juego1.md` puede contener varias historias
`US-XX` y reglas `BR-XX` adentro.

## Prefijos en uso

| Prefijo archivo | Prefijo ID | Qué identifica | Rol dueño | Dónde vive |
|---|---|---|---|---|
| `PRD-` | `US-` | Historia de usuario con criterio Given/When/Then | `producto` | `Docs/PRODUCTO/` |
| `PRD-` | `BR-` | Regla de negocio (ej. cómo puntúa el reveal de audio) | `producto` | `Docs/PRODUCTO/` |
| `PRD-` | `IDEA-` | Idea guardada sin compromiso: sin criterio Given/When/Then y sin piso de ítems | `producto` | `Docs/PRODUCTO/PRD-backlog-ideas.md` |
| `ARQ-` | `ADR-` | Decisión de arquitectura, con alternativas descartadas | `arquitectura` | `Docs/ARQ/` |
| `ARQ-` | `CTR-` | Contrato o schema (ej. el JSON de un juego) | `arquitectura` | `Docs/ARQ/` |
| `INV-` | `RES-` | Ficha de hallazgo con URL y fecha, o leyenda rotulada | `investigador` | `Docs/INVESTIGACION/` |
| `CNT-` | `CNT-` | Pieza de contenido: pregunta, distractor, nota de derechos | `contenido` | `Docs/CONTENIDO/` |
| `UX-` | `UX-` | Flujo, pantalla o pieza de sistema visual | `experiencia` | `Docs/UX/` |
| `REV-` | `FIND-` | Hallazgo de revisión, con criterio incumplido y evidencia | `revisor` | `Docs/REVISIONES/` |
| `ORQ-` | `T-` | Tarea ejecutable de un ciclo, con dueño y verificación | `orquestador` | `Docs/ORQ/` |

## Reglas

- Todo entregable arranca listando los IDs que consume.
- Toda tarea `T-XX` traza a al menos un requisito (`US-XX`, `BR-XX`) o a un hallazgo
  (`FIND-XX`). Una tarea sin origen es trabajo que nadie pidió.
- **Un `IDEA-XX` no es un requisito y no traza tareas.** Es una idea guardada a pedido del
  usuario, sin criterio de aceptación y sin piso de ítems, y por eso `orquestador` no puede
  cortarle un `T-XX`. Para entrar a un ciclo se promueve antes a `US-XX` (`BR-16`); al
  promoverse, el `IDEA-XX` no se borra: se marca *promovida a `US-XX`* y se queda donde
  está, igual que un ID cancelado.
- Todo hallazgo `FIND-XX` cita el ID del criterio que se incumple.
- Toda pregunta del banco de `contenido` que afirme un dato verificable cita la ficha
  `RES-XX` que lo respalda, o lleva la marca explícita de leyenda.
- Al cerrar un ciclo, verificá con `/coherencia` que no haya IDs citados que no existan.
