# ARQ — Integración con Spotify

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `D-02`, `D-03`, `D-04`, `D-08`,
> `D-09`, `D-10`, **`D-14`**, `RES-01`, `RES-09`, `RES-25`, `RES-26`, `US-02`, `BR-06`,
> `.claude/rules/codigo-juegos.md`. Produce: `ADR-01`.
> Última actualización: 2026-08-19 (**revisión 4: cierre en B bajo `D-14`**, `T-31` del
> ciclo 3).

---

## ADR-01 — Vía de integración con Spotify para dar acceso al tema

- **Fecha:** 2026-08-19 · **Revisión 2:** incorporando `RES-01` · **Revisión 3:**
  2026-08-19, incorporando `RES-26` · **Revisión 4:** 2026-08-19, cierre bajo `D-14`.
- **Estado:** **ACEPTADA** — **opción B, deep link**. Ya no bloquea nada: ni construir, ni
  publicar el enlace.
- **Motivo del cierre:** **`D-14`**, y no evidencia nueva. Ver "Decisión" más abajo, que es
  la sección que hay que leer si esto se relee en dos meses.
- **Consume:** `D-02` (sin backend), `D-03` (motor híbrido), `D-08` (el jugador no tiene
  Premium), `D-09` (criterios no negociables), `D-10` (difusión), **`D-14`** (la postura:
  fan site sin fines de lucro, el riesgo se asume, si llega un reclamo se da de baja),
  `RES-01` (`Docs/INVESTIGACION/INV-01-fichas-iniciales.md`), `RES-26`
  (`Docs/INVESTIGACION/INV-22-imagenes-tapas-y-spotify.md`), `BR-06`
  (`Docs/PRODUCTO/PRD-promesa-spotify.md`).

> **Cambio de título en la revisión 3.** Este ADR se llamaba "…para escuchar el tema
> **completo**". `BR-06` retiró esa promesa: la v1 promete **acceso** al tema, no
> reproducción íntegra. El título citaba una promesa que ya no existe.

### Estado en una mirada — leé esto primero

| | |
|---|---|
| **Decidido** | **B — deep link `https://open.spotify.com/track/<trackId>`.** Estado **aceptada**. Se cierra por `D-14`, no porque haya aparecido evidencia. |
| **Descartadas con evidencia** | **C** (`preview_url`) y **D** (Web Playback SDK), por `RES-01`. **A** (embed), por `RES-26` — descarte **contractual**, no técnico. No se reabren salvo por la condición escrita en cada una. |
| **La alternativa que perdió** | **E** (ninguna integración). No murió: queda como **destino de la reversión**, ya escrita y lista para tomar el control en un commit. |
| **`E-13`** | **NO respondida. No bloqueante bajo `D-14`.** Sigue sin haber pronunciamiento sobre si un link pelado es "acceder a la Spotify Platform". Lo que cambió es que el proyecto decidió que puede absorber el peor desenlace. |
| **Disparador de reversión** | Reclamo de Spotify → se borra el `<a>`, el fallback toma el control, el juego no se toca. Ver "Reversión". |
| **Ya cerrado y usable hoy** | El **fallback** (revalidado en esta revisión, sigue coherente) y el dato que consume el JSON: `trackId`. |
| **Presupuesto** | **Cero bytes de Spotify en toda la sesión**, no solo durante la partida. Ver "Consecuencias" y "Lo que este ADR le exige al código". |
| **Estado de `producto`** | `BR-06` **no se toca**: promete acceso y describe exactamente un deep link. La rama B era la única que no la obligaba a reescribirse. |

### Contexto

`D-03` ya decidió *que* Spotify entra: los fragmentos propios resuelven el reveal
progresivo y Spotify aparece **solo al revelar la respuesta**. Lo que falta es *cómo*.

Tres cosas acotaban el espacio desde la revisión 1, y siguen vigentes:

1. **`D-08`: el jugador no tiene Premium.** El usuario sí y puede probar, pero una vía que
   funcione solo para él no es una vía.
2. **Sin backend (`D-02`).** No hay dónde guardar un client secret ni dónde refrescar un
   token.
3. **`D-09`: sin muro de entrada.** Ninguna vía puede pedir login *antes* de terminar la
   partida.

**La revisión 3 agrega una cuarta, y es de otra naturaleza:**

4. **Eje contractual (`RES-26`).** La **Spotify Developer Policy** dice textualmente:
   **"Do not create a game, including trivia quizzes."**
   <https://developer.spotify.com/policy> — consultado 2026-08-19, verificado en dos
   fetches independientes más una confirmación por búsqueda.
   RicotaArcade son cuatro juegos y `US-01` es literalmente un quiz de trivia. Este eje
   **no mide qué tan bien funciona una opción: mide si tenemos derecho a usarla.** Una
   opción puede ganar en los cuatro criterios anteriores y morir acá igual.

*Sobre la numeración:* `RES-26` la ubica en la sección III, cláusula 2, pero avisa que **la
numeración salió del resumidor de la herramienta, no de lectura directa; el texto sí está
verificado**. Mi argumento se apoya en el texto, no en el número, así que el hueco no lo
debilita. Quien vaya a **citarla formalmente** —`contenido`, en la nota de derechos— tiene
que confirmar la numeración antes.

Y una que no acota, y conviene repetirlo: **la velocidad de carga no es bloqueante**
(`D-09`).

### Espacio de opciones

#### Opción A — Embed de Spotify en un iframe — **DESCARTADA (`RES-26`)**

`https://open.spotify.com/embed/track/<trackId>` dentro de un `<iframe>`. Era la opción
que ganaba en experiencia: el jugador no se iba del sitio, la sesión corta y el bucle de
compartir (`D-10`) sobrevivían.

**Se descarta por contrato, no por comportamiento.** La cadena, con cada eslabón rotulado
por lo que es:

1. **Verificado (`RES-26`, fuente primaria):** la Developer Policy dice *"Do not create a
   game, including trivia quizzes."*
2. **Verificado (`RES-26`, cita de los Developer Terms):** *"If you use or otherwise access
   the Spotify Platform, you will be deemed to have accepted the Developer Agreement."*
   O sea: la aceptación no requiere firmar nada, se deduce del uso.
3. **Verificado (fuente primaria que ya estaba en la revisión 2):** el embed es un producto
   documentado en el sitio de desarrolladores, con su propia guía de implementación y su
   propia Embed IFrame API.
   <https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting> —
   consultado 2026-08-19.
4. **Inferencia, y es la única del argumento:** que el embed sea "la Spotify Platform" a
   los efectos del punto 2. La sostengo por el punto 3: Spotify lo documenta como producto
   para desarrolladores, con requisitos de integración dirigidos a desarrolladores.

**Lo que NO distingue a A de B, y hay que decirlo para no engañarse:** el dominio. Las dos
cuelgan de `open.spotify.com`. Si el argumento fuera "es un dominio de desarrollo", sería
falso y se caería solo. Lo que distingue al embed es que **es un producto de integración
documentado para desarrolladores**; el link pelado es lo que produce el botón de compartir
de cualquier usuario común. Esa diferencia es todo lo que separa a A de B, y por eso B
todavía respira.

**Por qué alcanza para descartar sin tener el 100% de certeza.** No es miedo, es asimetría
de costos, y la escribo para que se pueda auditar:

- **Si me equivoco descartando A:** perdemos un reproductor cuyo valor esperado ya era bajo
  antes de `RES-26`. La revisión 2 lo decía con estas palabras: la pregunta ya no era "cuál
  es la mejor" sino "**el embed suma algo sobre el link, o es peso muerto**". Y `BR-06`
  después retiró la promesa de reproducción dentro del sitio, que era su único diferencial
  real. Perdemos poco, y lo recuperamos en un commit porque el dato del JSON es el mismo.
- **Si me equivoco usándolo:** el proyecto queda en incumplimiento de un acuerdo que se
  considera aceptado por el solo uso, en un proyecto cuyo riesgo número uno ya es derechos.
  Construir cuatro juegos encima de una cláusula que dice "no hagas juegos" es exactamente
  el error que la cláusula describe.
  > **Corrección de la revisión 4, y no es un detalle.** Este párrafo decía además *"y cuya
  > publicación ya está bloqueada por un gate de derechos real"*. **Ese gate no existe más**
  > (`D-14`): lo saco en vez de dejarlo, porque un lector futuro podría actuar sobre un
  > cerrojo muerto. **El descarte de A no se cae con él:** nunca se apoyó en el gate, se
  > apoya en la asimetría de costos —perdemos poco si erramos descartándolo, mucho si
  > erramos usándolo— y esa asimetría es más marcada todavía que la del link, porque un
  > embed no se revierte borrando un `<a>`. Ver "Qué NO autoriza este cierre".

**Condición de reapertura, y es una sola:** prueba escrita de que la Policy no alcanza al
uso del embed por un sitio sin fines de lucro (`E-14`). Aun así, A volvería **solo** si
además `E-04` resultara favorable, y `E-04` está anulada porque nadie la va a investigar.
La reapertura es remota y está bien que lo sea.

**Lo que queda archivado, no borrado, por si A vuelve:** el requisito duro de `RES-01`(c) —
el iframe necesita **`allow="encrypted-media"`** o reproduce menos de 30 segundos en
silencio. Es el error silencioso perfecto y sería una lástima perderlo del registro.

#### Opción B — Deep link a Spotify — **ELEGIDA (revisión 4, por `D-14`)**

Un link `https://open.spotify.com/track/<trackId>` que abre la app de Spotify si está
instalada, o el reproductor web si no.

- **Gana:** cero peso, cero JS, cero cookies de terceros, cero riesgo de que un bloqueador
  lo rompa. Y ahora, lo principal: **es la única opción que no es evidentemente un producto
  de la Spotify Platform.** Es la URL pública de una ficha de catálogo. `RES-09` verificó
  que el catálogo de la banda está publicado ahí oficialmente desde el 28-jul-2017 vía The
  Orchard, titular Erks S.A.: el destino es real y es el oficial.
- **Pierde:** saca al jugador de nuestra pantalla. `BR-06` ya absorbió este costo: el botón
  aparece **después** de revelar, cuando la ronda cerró, así que corta un gesto opcional
  posterior, no una partida en curso.
- **Pierde, dato de `RES-01`(d):** abrir la app **no está garantizado**. Spotify lo
  documenta como **patrón recomendado**, no como comportamiento asegurado por el sistema
  operativo.
  <https://developer.spotify.com/documentation/ios/tutorials/content-linking> — consultado
  2026-08-19. Consecuencia de diseño, ya incorporada a `BR-06`: **no se le puede prometer
  al jugador "abrí la app"**.
- **No verificado, y sigue sin verificarse (`E-13`):** que un link pelado no cuente como
  "usar o acceder a la Spotify Platform". `RES-26` lo llama **discutible** y tiene razón en
  llamarlo así. **Es una lectura razonable, no un hecho, y no la trato como hecho** — ni
  ahora que la opción está elegida. Sobre el link simple no hay pronunciamiento conocido en
  ninguna de las dos direcciones. Lo que cambió en la revisión 4 no es esto: es quién paga
  si la lectura está mal, y cuánto. Ver "Decisión".
- **Exige:** un `trackId` por tema en el JSON.

#### Opción E — Ninguna integración: la revelación cierra en el fragmento propio — **NO ELEGIDA, pero viva como destino de reversión**

La nombro porque, descartadas A, C y D, **es la única alternativa real que le queda a B**, y
un ADR con una sola opción no es una decisión.

> **Revisión 4.** E pierde, pero **no se archiva**: es exactamente el estado al que vuelve
> el sitio si se dispara la reversión (ver "Reversión"). Que la alternativa perdedora sea
> también el plan de contingencia, ya escrita y ya implementada como escalón 2 del
> fallback, es lo que hace que elegir B sea barato. No es una opción nueva: es el tercer escalón
del fallback —que ya está cerrado y escrito— promovido a primario.

- **Gana:** exposición contractual cero. Ninguna duda sobre si aceptamos un acuerdo sin
  querer.
- **Pierde:** el jugador que quiere escuchar el tema entero se queda sin puente. Tendría que
  buscarlo por su cuenta.
- **Cuánto cuesta si hay que caer acá:** poco, y esto es lo importante. **Se cae el botón,
  no el juego.** La revelación ya está diseñada para estar completa sin Spotify (ver
  fallback, punto 1). El `trackId` cargado no se desperdicia: sigue siendo un identificador
  estable del tema.
- **Qué obliga:** `producto` tendría que reabrir `BR-06`, que hoy promete acceso vía
  Spotify. Es lo único que se rompe, y es de `producto`, no mío.

#### Opción C — `preview_url` de la Web API — **DESCARTADA (`RES-01`)**

La idea era hornear el `preview_url` (un MP3 de ~30 s) en `src/data/*.json` y reproducirlo
con un `<audio>` común. Habría sido la más linda de diseñar. **`E-01` volvió desfavorable:**

- Desde el **27 de noviembre de 2024**, Spotify restringió `preview_url` para aplicaciones
  **nuevas**. RicotaArcade sería una app nueva.
  <https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api> — consultado
  2026-08-19.
- El campo figura como **`Nullable, Deprecated`** en `Get Track`.
  <https://developer.spotify.com/documentation/web-api/reference/get-track> — consultado
  2026-08-19.

Mi tabla de criterio de cierre decía: *"Cualquiera de `E-01`, `E-02`, `E-03`, `E-08`
desfavorable → C descartada, sin más vueltas"*. Se cumplió sin renegociarla.

*Nota de la revisión 3:* C, además, era la que **más** dependía de la Platform — API,
credenciales y cuenta de desarrollador. Si `RES-01` no la hubiera matado, `RES-26` la
mataba igual.

#### Opción D — Web Playback SDK — **DESCARTADA (`RES-01`)**

Era la técnicamente superior y por eso valía descartarla bien. **`E-09` respondida:** el SDK
exige suscripción **Premium del usuario final**.
<https://developer.spotify.com/documentation/web-playback-sdk> — consultado 2026-08-19.
Choca con `D-08` y, por el login OAuth previo, con `D-09`.

*Nota de la revisión 3:* misma observación que en C. El SDK es Platform sin discusión
posible; hoy tendría dos causas de muerte independientes.

### Decisión — **B sola, aceptada** (revisión 4)

**Se elige B: un deep link `https://open.spotify.com/track/<trackId>`, que aparece recién
después de revelar la respuesta.** Por eliminación otra vez, no por mérito: la cascada
"A + B" de la revisión 2 se cayó entera cuando `RES-26` prohibió el escalón primario.

#### Por qué se puede cerrar ahora, dicho con precisión

**No cierro porque `E-13` se haya respondido. No se respondió.** No apareció ninguna fuente
nueva entre la revisión 3 y esta: sigue sin haber pronunciamiento conocido de Spotify sobre
si un link pelado a una ficha de catálogo cuenta como "usar o acceder a la Spotify
Platform", y sigue siendo tan discutible como lo dejó `RES-26`.

**Lo que cambió no es la evidencia: es la postura del proyecto.** `D-14` estableció que
RicotaArcade es un fan site sin fines de lucro, de poco volumen, hecho para divertirse, y
que **si llega un reclamo se da de baja y listo**. Bajo ese encuadre, `E-13` deja de ser
bloqueante — no porque se haya vuelto menos incierta, sino porque **el peor desenlace de
equivocarse es que Spotify pida que se saque el link, y sacarlo cuesta borrar un `<a>`**.

Esta es la misma lógica con la que **no** cerré antes, y conviene que se lea así: mantener
el ADR en propuesta mientras la única salida era "afirmar que linkear es contractualmente
limpio" era correcto, porque eso habría sido vender una lectura razonable como hecho
verificado. Es el mismo criterio con el que no cerré sobre la leyenda técnica de `E-04`, y
lo sostengo. Lo que destraba el cierre no es que la afirmación se haya vuelto verdadera:
es que **ya no hace falta afirmarla** para decidir.

#### Que esto lo cierre `arquitectura` y no otro rol

Mi propia tabla de criterio de cierre (revisión 3) tenía la fila: *"no hay pronunciamiento
y no lo va a haber — el desenlace más probable → deja de ser pregunta técnica y pasa a ser
decisión de riesgo, que no es mía: la asume el usuario"*. **La regla se escribió antes de
conocer el desenlace y se cumplió tal cual.** El usuario asumió esa decisión de riesgo el
mismo día, para todo el proyecto, en `D-14`. Con la decisión de riesgo tomada afuera, lo
único que quedaba de mi lado era la parte técnica —qué se construye, qué se borra si hay
que borrar— y eso sí es mío. La recomendación que había dejado marcada para esa rama era B,
y no cambió.

#### Qué NO autoriza este cierre

- **No dice que linkear sea contractualmente limpio.** Dice que el proyecto acepta la duda.
- **No reabre A.** El embed tiene un descarte propio, por texto verificado (`RES-26`), y una
  condición de reapertura propia (`E-14`) que `D-14` no toca. `D-14` cambia cuánto riesgo se
  corre, no qué dice la Policy; y el embed no es reversible con la misma facilidad que un
  link, así que la asimetría de costos que lo mató sigue en pie.
- **No habilita registrar una app de desarrollador.** Esa restricción sigue dura y sin
  excepciones (ver "Consecuencias").
- **No habilita traer imágenes de dominios de Spotify.** Ídem.

### Reversión — el disparador, escrito antes de necesitarlo

Una decisión barata de revertir solo es barata si el procedimiento está escrito de
antemano. Este es el procedimiento completo.

**Disparador:** llega un reclamo de Spotify —correo, aviso, takedown, cualquier forma— que
objete el enlace. **No hace falta evaluar si tiene razón.** El proyecto ya decidió en `D-14`
que no discute: se cumple.

**Qué se hace, en orden:**

1. **Se borra el componente del botón** y el punto donde se lo invoca. Es una hoja: nada
   depende de él.
2. **El fallback toma el control solo.** El escalón 2 de la cascada —"solo fragmento
   propio"— ya es el camino que recorre hoy cualquier ítem sin `trackId`, así que no es
   código nuevo ni código sin probar: es el camino que ya corre en producción para una parte
   del banco.
3. **No se toca `src/data/*.json`.** Los `trackId` se quedan donde están: son identificadores
   estables del tema y no cuesta nada dejarlos. Si el reclamo pidiera explícitamente que no
   figuren, se los saca sin que ningún ítem deje de ser válido — el campo es opcional en
   `CTR-02` y en `CTR-03`.
4. **No se cae ningún juego, ni una pregunta, ni una partida.** La revelación está diseñada
   para estar completa sin Spotify (fallback, punto 1).
5. **`producto` reabre `BR-06`**, que es lo único que se rompe, y es de `producto`. Queda
   avisado acá para que no lo descubra después.

**Costo total estimado de la reversión: un commit que borra un archivo y una línea.** Eso es
lo que hace defendible correr el riesgo, y por eso lo escribo como paso numerado y no como
tranquilizante. Si algún día revertir cuesta más que esto, **es señal de que alguien acopló
algo al botón que no debía**, y hay que revisar la implementación, no la decisión.

### Fallback cuando Spotify no está disponible — **revalidado en la revisión 4, sin cambios**

Sigue **cerrado**, sigue sin depender de evidencia externa. La revisión 3 le sacó el escalón
del embed; la revisión 4 **no le toca nada**, y eso hay que justificarlo en vez de darlo por
sentado, porque ahora B es la única vía y un fallback pensado para dos vías podría haber
quedado torcido. Lo verifiqué punto por punto:

- **La cascada de dos escalones sigue teniendo sentido** con B como única vía. Los dos
  escalones existen porque el `trackId` es opcional, no porque hubiera dos integraciones:
  con link (escalón 1) o sin link (escalón 2). Elegir B no elimina el escalón 2 — al
  contrario, hoy **el escalón 2 es el único que corre**, porque hay 0 de 30 ítems con
  `trackId` (H-28 del ciclo 3). El camino sin Spotify no es teórico: es el que se está
  usando.
- **La partida sigue sin depender de Spotify para nada**, y con B es más cierto que antes:
  el único artefacto es un `<a href>` que se renderiza **después** de revelar y que el
  jugador toca si quiere. No hay red, ni JS, ni espera, ni detección, ni estado.
- **Un tercer escalón sería inventado.** No hay nada entre "hay link" y "no hay link".

El principio y los puntos 1 a 7 están intactos.

Implementa el **criterio 3 de `US-02`**: si el jugador no tiene la app, igual ve el
resultado del ítem y cierra la partida, sin enlace roto de por medio.

**Principio: Spotify es aditivo. La partida nunca depende de él.**

1. **La revelación está completa sin Spotify.** La respuesta correcta, la explicación, la
   fuente y el puntaje son datos locales. Si Spotify falla, no falta información: falta una
   comodidad.
2. **El fragmento propio queda siempre re-reproducible en la revelación.** Es audio nuestro,
   ya descargado y decodificado. Es el piso: siempre hay algo para escuchar.
3. **`spotify` es un campo opcional del JSON.** Un ítem sin `trackId` es un ítem válido y
   jugable. Ningún validador rechaza un tema por no estar en Spotify.
4. **Cascada de degradación**, ahora de dos escalones: `deep link` → `solo fragmento
   propio`. *(Revisión 3: el escalón `embed` se elimina con la opción A.)*
5. **Nada que detectar por tiempo.** *(Revisión 3: los 3.000 ms de espera de carga del
   iframe quedan sin objeto. Un link no carga: está o no está el `trackId`, y eso se sabe en
   tiempo de build. Un problema menos y una regla menos que implementar.)*
6. **Avanzar de ronda nunca espera a Spotify.** Ni un botón deshabilitado, ni un modal
   bloqueante. Es "sin muro de entrada" (`D-09`) traducido al plano técnico.
7. **Nada de Spotify durante la partida**, y ahora **tampoco después**: sin embed no hay
   script, ni iframe, ni llamada, ni cookie de terceros en ningún momento de la sesión. El
   único artefacto es un `<a href>` que el jugador toca si quiere. *(Revisión 3: esto
   endurece `.claude/rules/codigo-juegos.md` en vez de solo confirmarla.)*

**Lo que el fallback NO cubre:** el jugador sin auriculares o con el celular en silencio —
el **criterio 2 de `US-02`**. *Supuesto de arquitectura:* no hay API web confiable para
detectar auriculares ni volumen del sistema, así que ese criterio **se cumple avisando, no
detectando**, y el aviso es diseño de `experiencia`. Si alguien quiere discutir el supuesto,
que pida ficha; no lo voy a resolver con código porque no se puede.

### Las Design Guidelines y `US-04` — **verificado que NO aplica, y lo digo con todas las letras**

`RES-26` levanta una segunda capa, independiente de la cláusula de juegos. Las Design
Guidelines dicen textualmente:

> *"Artwork must be kept in its original form. Don't animate or distort it in any way. This
> includes applying overlays and blurring."* · *"Don't crop the artwork in any way."* ·
> *"Don't overlay images or text on top of the artwork."*
> <https://developer.spotify.com/documentation/design> — consultado 2026-08-19, verificado.

Y observa, con razón, que el reveal progresivo de `US-04` es mecánicamente eso: recortar,
superponer y desenfocar.

**Conclusión: no aplica al caso de `US-04`, y por lo tanto no hay alarma acá.** El
razonamiento tiene dos pasos y ninguno es una interpretación forzada:

1. **Estas guías rigen el display de arte obtenido de Spotify.** Son las condiciones de
   presentación atadas al permiso que Spotify da sobre el contenido que sirve. No son una
   regla sobre imágenes en general, ni Spotify podría imponerla: `RES-25` es contundente en
   que Spotify no es fuente de licencia y no transfiere ningún derecho sobre la obra de
   Rocambole.
2. **RicotaArcade no toma arte de Spotify, y ya está decidido que no lo va a tomar.** `D-04`
   fija que las tapas salen de otro lado, en baja resolución y con crédito. `RES-25`
   descarta la Spotify Web API como vía de obtención en firme y señala al Cover Art Archive
   como conducto técnico si el gate de derechos se abre.

Sin arte de Spotify no hay arte de Spotify que presentar mal. **La mecánica de `US-04` no
está condicionada por Spotify.** No dejo la alarma abierta porque no corresponde, y dejarla
abierta tendría un costo: `producto` y `experiencia` rediseñarían un juego por una
restricción que no los alcanza.

**Restricción que este ADR impone para que la conclusión se mantenga verdadera** — es una
regla de arquitectura sobre el origen de los assets, y es barata:

> **Ninguna imagen del sitio puede provenir de un dominio de Spotify** (`i.scdn.co` y
> similares), ni por hotlink ni por copia local. El día que alguien tome una tapa de ahí
> como atajo, las Design Guidelines pasan a aplicar y esta sección deja de ser cierta.

Si esa regla tiene que volverse validación de schema, va a un `CTR-XX` cuando `contenido`
defina el campo de imagen. Hoy alcanza con dejarla escrita.

**Lo que esta conclusión NO dice, y me importa que no se lea de más:** no digo que `US-04`
esté habilitado. La pregunta de si recortar y desenfocar una tapa toca el **derecho moral**
de un autor vivo sigue abierta —`INV-22`, "Sin resolver", punto 3— y es ley argentina, no
contrato de Spotify. Esa es de `contenido` en la nota de derechos, con `producto` y
`experiencia` como afectados. Lo único que hice acá fue **sacar a Spotify de esa
conversación**, que estaba metido por error. El gate de derechos sigue donde estaba.

### Evidencia — qué falta y qué ya no

**De catorce preguntas, no queda ninguna bloqueando. Ninguna se respondió en la revisión 4:
la última dejó de bloquear por decisión.**

| ID | Tema | Estado tras la revisión 4 |
|---|---|---|
| **`E-13`** | ¿Un deep link simple es "acceder a la Spotify Platform"? | **ABIERTA — SIN RESPUESTA — NO BLOQUEANTE BAJO `D-14`.** No se respondió y probablemente no se responda. Dejó de bloquear porque el proyecto asumió el peor desenlace, no porque haya evidencia. **No la marques como respondida** |
| `E-14` | ¿La Policy tiene excepción escrita para uso sin fines de lucro / fan site? | **Abierta, no bloquea.** Solo sirve como condición de reapertura de A. Ojo: `D-14` **no** la responde — que nosotros seamos sin fines de lucro no es lo mismo que que la Policy tenga una excepción escrita |
| `E-04` | Qué reproduce el embed sin Premium | **ANULADA por `RES-26`.** Ver abajo |
| `E-05`, `E-06`, `E-10` | Requisitos, API JS y comportamiento móvil del embed | **ANULADAS.** Eran "cómo implementar A". Sin A, no tienen objeto |
| `E-07` | Free en Argentina, ¿tema a demanda? | **Degradada: abierta, ya no bloquea.** Ver abajo |
| `E-12` | Obtener un `trackId` sin cuenta de dev | **CERRADA en la revisión 4, por la vía barata:** se copia el link desde la app o la web de Spotify, como cualquier usuario. Es observación del proyecto, no ficha. Ver abajo |
| `E-01` | ¿Sigue vivo `preview_url`? | Respondida — **desfavorable**, descarta C |
| `E-09` | ¿El SDK exige Premium? | Respondida — confirma el descarte de D |
| `E-11` | Deep link sin la app instalada | Cubierta por `RES-01`(d) para lo que necesitamos |
| `E-02`, `E-03`, `E-08` | Client secret, expiración y ToS del `preview_url` | **ANULADAS.** Sin C, no tienen objeto |

#### `E-04` — anulada, y por qué esto es un ahorro real

`E-04` preguntaba qué reproduce el embed a un usuario sin Premium. Era la pregunta que más
pesaba en la revisión 2: la inclinación entera dependía de ella.

**Deja de importar, y el motivo es limpio: ninguna respuesta cambia ninguna decisión.**
Supongamos el mejor caso posible, el que más favorecía a A: que el embed le reproduzca el
tema entero a un visitante anónimo. **Seguiría prohibido igual.** `RES-26` no dice que el
embed funcione mal; dice que no tenemos derecho a integrarlo en un sitio de juegos. Una
pregunta cuya respuesta más favorable no mueve la decisión no es evidencia pendiente: es
curiosidad.

**Consecuencia operativa, y es concreta: el usuario puede tachar la prueba empírica de su
lista.** La revisión 2 le pedía abrir el embed en incógnito, contar segundos, repetir con
sesión Premium y anotar con fecha. **Ese trabajo ya no hay que hacerlo.** Mismo tratamiento
que recibieron `E-02`, `E-03` y `E-08` cuando murió C: anuladas, no pendientes.

Con `E-04` se van también `E-05`, `E-06` y `E-10`, que eran detalles de implementación del
embed.

#### `E-07` — degradada de bloqueante a informativa, y corrijo lo que escribí antes

La revisión 2 decía que `E-07` **"pesa más que antes"**. **Eso ya no es cierto y lo corrijo
en vez de dejarlo.** Dos motivos, ninguno de los cuales existía cuando lo escribí:

1. **`BR-06` se publicó en el medio y absorbió los dos desenlaces.** Promete *acceso* al
   tema, no reproducción, y su propio texto argumenta por qué ninguna respuesta de `E-07` la
   obliga a reescribirse. La pregunta perdió su consecuencia de producto.
2. **Ya no distingue entre opciones.** Antes había dos vías cuyo valor relativo dependía de
   la respuesta. Hoy la disputa es B contra E, y qué reproduce la app de Spotify cuando el
   jugador llega **no cambia si tenemos o no derecho a mandarlo ahí**. Es ortogonal a
   `E-13`.

Sigue siendo útil responderla, pero para otra cosa: para que `experiencia` sepa qué
expectativa generar con el copy del botón. **No para cerrar este ADR.**

#### `E-13` — qué la reabriría

Cerrar como "no bloqueante" no es cerrar como "olvidada". Hay dos hechos que la vuelven a
poner sobre la mesa, y **cualquiera de los dos alcanza**:

1. **Si el proyecto dejara de ser sin fines de lucro** —publicidad, donaciones atadas al
   sitio, venta de algo, patrocinio— **`D-14` deja de aplicar tal como está escrita**. Toda
   su fuerza viene de "fan site sin fines de lucro, de poco volumen"; sin eso, el peor
   desenlace ya no es "sacá el link" y la pregunta vuelve a ser bloqueante. Este ADR se
   reabre **antes** de que el cambio de modelo se haga efectivo, no después.
2. **Si Spotify se pronunciara** en cualquier dirección —una cláusula nueva, una aclaración
   pública, un caso conocido, o el reclamo directo del disparador de reversión—. Si el
   pronunciamiento es favorable, `E-13` se responde y este cierre se vuelve retroactivamente
   sólido en vez de asumido. Si es desfavorable, se dispara la reversión y el destino es E.

Un tercer motivo que **no** la reabre, y lo digo para que nadie pierda una ráfaga: que
alguien encuentre una opinión de un foro o un blog. `RES-26` ya dejó claro que sobre el link
simple no hay pronunciamiento conocido; una opinión no es un pronunciamiento y no mueve
nada. Si aparece una fuente primaria, es ficha `RES-XX` de `investigador`.

#### `E-12` — cerrada por la vía barata

Era "abierta, nunca bloqueó", y la revisión 3 la había subido de prioridad porque este ADR
prohíbe registrar una app de desarrollador y con eso desaparecía el atajo de "sacamos los
IDs por la API y listo".

**Se cierra sin ficha, porque la respuesta no necesita investigación: los `trackId` se
copian a mano desde la app o la web de Spotify, con la misma acción de compartir que hace
cualquier usuario.** Es lento y es suficiente: son unas pocas decenas de temas, se cargan
una vez, y el dato no caduca. Es observación del proyecto, no hecho externo verificado, y
por eso no pido ficha: no hay nada que verificar en "copiar y pegar un link funciona".

Queda acoplada a `E-13` en lo conceptual —copiar un link como usuario común es la misma
acción de usuario común que publicarlo— y hereda su encuadre: **misma duda, mismo peor
desenlace, mismo `D-14`**. Consecuencia operativa: el `trackId` es **entrada manual del
usuario**, así que un ID mal copiado es el modo de falla realista, no un ID inventado.
`CTR-03.7` ya lo dice y sigue vigente: **antes que un ID plausible, el campo se omite.**

### Criterio de cierre — reescrito, y con la autocrítica de por qué hubo que reescribirlo

Sigo escribiéndolo **antes** de que llegue la evidencia. Funcionó dos veces: forzó el
descarte de C sin renegociar nada.

> **Revisión 4 — y esta es la mejor prueba de que servía.** La tabla previó el desenlace
> "no hay pronunciamiento y no lo va a haber", lo llamó **el más probable**, y dijo qué
> hacer con él: pasarlo a decisión de riesgo del usuario, con B como recomendación. Cuando
> ese desenlace efectivamente ocurrió, no hubo nada que discutir ni que reinterpretar: el
> cierre estaba escrito de antemano y solo faltaba que alguien tomara la decisión de riesgo.
> **Escribir el criterio antes convierte un juicio difícil en un trámite**, que es
> exactamente para lo que sirve.

**Pero la tabla de la revisión 2 falló, y el modo de falla vale más que la tabla.** No falló
porque una fila diera mal: falló porque **una tabla de criterios solo sabe elegir entre las
opciones que enumeraste, y no te protege de que una opción sea eliminada por una dimensión
que no enumeraste.** Las tres filas de `E-04` presuponían que el eje de decisión era
"¿cuánto reproduce el embed?". `RES-26` no contestó ninguna de esas filas: retiró a A del
tablero por un eje que la tabla no tenía.

**Regla que me llevo para la próxima tabla de criterio de este proyecto:** además de las
filas de "si la evidencia dice X", incluir siempre una fila de **"si aparece un
impedimento contractual o legal sobre una opción"**, aunque en el momento no se vea de
dónde podría venir. Costaba dos líneas y me habría ahorrado esta reescritura.

| Si la evidencia dice… | Entonces `ADR-01` cierra en… |
|---|---|
| `E-13`: el link pelado **no** es acceso a la Platform | **B sola.** ADR cerrado. `BR-06` queda como está, sin tocar una palabra |
| `E-13`: el link pelado **sí** es acceso a la Platform, o una fuente competente dice que la Policy alcanza al linkeo | **E: sin integración.** Se poda el botón, la revelación cierra en el fragmento propio, y `producto` reabre `BR-06`. **No se toca ningún juego** |
| `E-13`: **no hay pronunciamiento y no lo va a haber** — el desenlace más probable | **← ESTA ES LA FILA QUE SE APLICÓ, el 2026-08-19.** Deja de ser pregunta técnica y pasa a ser **decisión de riesgo**, que **no es mía**: la asume el usuario, que es el expuesto. **`D-14` la asumió, para todo el proyecto.** Mi recomendación marcada para esa rama era **B**, por los tres motivos de abajo, y es lo que se decidió. Registro de que la regla se escribió antes de conocer el desenlace y se cumplió sin renegociarla — la tercera vez en este ADR |
| `E-14`: aparece excepción escrita para uso sin fines de lucro | A **puede** reabrirse, pero solo si además se responde `E-04`, que está anulada. En los hechos: no se reabre |
| `E-07`: el free en Argentina no puede escuchar a demanda | **Nada.** Cambia el copy del botón, no la arquitectura ni `BR-06`. *(Revisión 3: esta fila resistió el hallazgo — decía "cambia lo que le prometemos, no la arquitectura", y sigue siendo exacta.)* |
| ~~`E-04`: el embed da tema completo a free logueado / 30 s a todos / nada sin sesión~~ | **INVALIDADAS por `RES-26`.** Las tres filas elegían variantes de A. La opción que seleccionaban ya no existe. Se quedan acá como registro de la falla descrita arriba |
| ~~`E-01`+`E-02`+`E-03`+`E-08` todas favorables → se suma C~~ | **Aplicada al revés** el 2026-08-19: `E-01` desfavorable, **C descartada**. Registro de que la regla se escribió antes de conocer la respuesta y se cumplió |

**Los tres motivos de la recomendación de la rama del medio**, para que se pueda discutir el
razonamiento y no solo la conclusión: (a) el link es el mismo que produce el botón de
compartir de la app para cualquier usuario, y esa es una acción de usuario, no de
desarrollador —**esto conviene verificarlo dentro de `E-13`**, no lo doy por hecho—; (b)
`BR-06` no depende de que el link exista para ser verdadera sobre el resto; (c) es una hoja:
se quita en un commit, después de publicado, sin tocar datos ni juegos. La exposición es
acotada y reversible, que es lo contrario de la del embed.

**Nada de esto cambia el fallback.** Y ninguno de los desenlaces cambia el dato que consume
el JSON: en todos es el `trackId`. **`contenido` puede cargar IDs hoy sin riesgo de trabajo
perdido**, incluso en la rama E.

### Consecuencias

- **Fácil:** construir hoy. La revelación se implementa entera contra el contrato "Spotify es
  aditivo y opcional". Con A muerta, el escalón primario de la cascada es el link, que es
  trivial. Nadie queda esperando.
- **Fácil:** revertir. B es un `<a href>` condicionado a un campo opcional. Si se dispara la
  reversión, se borra el componente y no queda deuda. El procedimiento completo, numerado,
  está en la sección "Reversión" — y **mantenerlo barato es un requisito de implementación**,
  no una expectativa.
- **Ganancia inesperada, y es la mejor noticia de esta revisión:** el presupuesto de
  terceros baja a **cero bytes de Spotify en toda la sesión**, no solo durante la partida.
  Sin iframe no hay JS de terceros, ni cookies de terceros, ni bloqueadores que rompan nada,
  ni caja de tamaño ajeno en el diseño. Para celulares de gama baja —que es el caso que este
  proyecto tiene que aguantar— esto es una mejora real, no una consolación.
- **Se libera a `experiencia` de un problema que tenía asignado.** La revisión 2 la obligaba
  a "reservarle lugar a un iframe que no puede estilar, y además diseñar la variante sin
  él". **Ese trabajo desaparece: solo queda la variante sin él**, que ahora es la única. Es
  un botón nuestro, con nuestro estilo. Lo dejo dicho acá porque es trabajo que alguien
  podría estar por hacer al pedo.
- **Restricción dura, nueva y no negociable: nadie registra una app de desarrollador de
  Spotify para este proyecto.** Registrarse es la forma más explícita posible de aceptar el
  Developer Agreement, que es justamente el instrumento cuya aplicabilidad estamos tratando
  de no gatillar. Antes "no hace falta cuenta de dev" era una comodidad; ahora es una regla.
- **Restricción dura sobre assets:** ninguna imagen desde dominios de Spotify. Ver la sección
  de Design Guidelines.
- **Difícil, y no lo resuelve la arquitectura:** la exposición contractual residual de B. No
  hay diseño que la elimine; solo la decisión de correrla o no. **Esa decisión ya se tomó en
  `D-14`: se corre.** Lo que va a la nota de derechos de `contenido` ya no es una pregunta
  abierta, es una entrada del mapa: qué se usa (un link a la ficha pública del tema), de
  dónde salió (la URL de compartir de Spotify, copiada a mano) y la respuesta de una línea
  si alguien pregunta.
- **Lo que dejó de ser difícil:** "garantizar el tema completo dentro del sitio" ya no
  figura como problema. `BR-06` lo retiró de las promesas y `RES-26` cerró la única vía que
  quedaba de intentarlo. El tema deja de estar abierto en los dos frentes a la vez.

### Lo que este ADR le exige al código — **requisitos, no comentarios**

Con el ADR aceptado, esto deja de ser contexto y pasa a ser especificación. Aplica a
**`T-42`** (el compartir del quiz, donde el botón de Spotify sale de `BR-06`) y a `US-02`
cuando llegue. **Cada punto es verificable con un grep sobre `dist/`**, a propósito: un
requisito que nadie puede comprobar es una preferencia.

**`RQ-B1` — La URL, y ninguna otra.** El destino es exactamente
`https://open.spotify.com/track/<trackId>`, armado a partir de `spotify.trackId` del ítem.
Nada de dominios alternativos, nada de `spotify:track:` como `href` primario, nada de
parámetros agregados (ni `si=`, ni `utm_`, ni nada que parezca telemetría nuestra).

**`RQ-B2` — Es un `<a href>` y nada más.** Prohibido: `<iframe>`, `<script>` de Spotify,
`fetch`, oEmbed, Embed IFrame API, y cualquier SDK. Si la implementación necesita JS de
Spotify para funcionar, está mal hecha o dejó de ser B.

**`RQ-B3` — Atributos obligatorios:** `target="_blank"` y **`rel="noopener noreferrer"`**.
`noopener` porque un `target="_blank"` sin él le entrega `window.opener` a la pestaña
destino; es higiene básica y no se discute. `noreferrer` porque **no hay ningún motivo para
mandarle a un tercero la URL desde la que salió el jugador** — y en este caso, además, la
URL lleva el puntaje (`ADR-02`). Los dos juntos, en ese orden, en el mismo atributo.

**`RQ-B4` — Cero bytes de Spotify antes del tap, y cero después dentro del sitio.**
Prohibidos también: `<link rel="preconnect">`, `dns-prefetch`, `prefetch`, `preload` o
cualquier otra pista de recurso apuntando a un dominio de Spotify. Son requests reales a
Spotify que ocurren **sin que el jugador haya decidido nada**, y romperían la única
propiedad que hace defendible a B: que hasta el tap no existe ninguna relación con Spotify.
El presupuesto es literal: **cero bytes de Spotify en toda la sesión**, salvo que el jugador
toque el link — y ahí ya se fue del sitio.

**`RQ-B5` — Sin `trackId`, no hay botón.** Si `spotify` o `spotify.trackId` falta, está
vacío o no cumple el patrón de `CTR-02`/`CTR-03`, **el botón no se renderiza**. No se
renderiza deshabilitado, no se renderiza gris, no se renderiza con un `href` vacío ni
apuntando a una búsqueda. Es el escalón 2 del fallback y hoy es el caso de los 30 ítems del
banco: **el camino sin botón es el camino normal**, no el degradado. Un enlace roto es peor
que ningún enlace (`US-02`, criterio 3).

**`RQ-B6` — El botón aparece después de revelar, y nunca bloquea.** No existe antes de la
revelación, y avanzar de ronda jamás espera por él: ni deshabilitado, ni modal, ni foco
robado (fallback, punto 6).

**`RQ-B7` — Ningún asset de Spotify.** El botón es nuestro, con nuestro estilo y con el copy
que fijen `producto`/`experiencia`. **No se descarga, no se hotlinkea y no se copia al repo
ningún logo, ícono ni imagen de un dominio de Spotify** (`i.scdn.co` y similares). Es la
misma restricción de la sección de Design Guidelines, aplicada al botón.

**`RQ-B8` — Aislado en un solo archivo.** El botón vive en su propio componente y se invoca
desde un solo lugar. Es lo que hace verdadero el paso 1 de "Reversión": borrar el archivo y
la invocación tiene que alcanzar. **Si borrarlo rompe otra cosa, el requisito está
incumplido**, aunque el sitio compile.

Si alguna de estas reglas parece mal, **no se cambia en el código**: propuesta en
`Docs/SUGERENCIAS/` y decide `arquitectura`. Es la misma regla que `ADR-02` ya fijó para
`T-37`.

### Lo que esto le manda a `producto`

**La alerta de la revisión 2 está cerrada.** `producto` la tomó y produjo `BR-06`
(`Docs/PRODUCTO/PRD-promesa-spotify.md`), que reformuló la promesa a *acceso* en vez de
*reproducción*. Lo dejo registrado porque el ADR arrastraba una alerta que ya no
corresponde.

**Y `BR-06` aguanta `RES-26` sin cambios.** Lo verifiqué contra su texto, no de memoria:
promete "acceso directo para escuchar ese tema en Spotify —abre la app si está instalada, o
la reproduce en la web de Spotify si no—", que describe **exactamente un deep link** y
**ningún reproductor embebido**. `RES-26` mata el embed; `BR-06` nunca lo prometió. La
redacción se hizo a prueba de `E-04` y `E-07`, y resultó estar a prueba de un eje que nadie
había previsto. Vale decirlo: eso no fue suerte, fue prometer solo lo que se podía cumplir.

Lo nuevo —una precisión chica en el disparador de reapertura de `BR-06`— va como propuesta
cruzada en `Docs/SUGERENCIAS/ARQ-para-producto-spotify-contractual.md`. No lo decido yo.

**Revisión 4: `BR-06` no se toca.** Mi propia tabla decía que la rama B la deja intacta, y
el cierre cayó en esa rama. `BR-06` promete acceso y describe un deep link; eso es
exactamente lo que se aceptó. **`producto` no tiene nada que hacer con este cierre**, salvo
saber que si algún día se dispara la reversión, `BR-06` es lo único que se rompe (paso 5).

### Qué NO decide este ADR

- Cómo se ve la revelación, dónde va el botón y qué dice: `experiencia` (`UX-XX`).
- La redacción de la promesa al jugador: `producto` (`BR-06`, ya escrita).
- Si el deep link es legalmente prudente de correr sin pronunciamiento: **eso ya no es una
  pregunta abierta — `D-14` decidió correrlo.** Lo que queda para la nota de derechos de
  `contenido` no es un veredicto sino una entrada del mapa: el deep link como superficie,
  con su origen y su respuesta de una línea. Ese es `T-32`, y es de `contenido`.
- Si `US-04` puede usar tapas: **no cambia por esto**. Spotify queda fuera de esa discusión;
  el derecho moral del autor vivo sigue abierto y es de `contenido`.
- La numeración exacta de las cláusulas de la Policy para citarla formalmente: `contenido`
  la tiene que confirmar antes de escribirla en la nota de derechos.

### Deuda que deja este cierre, en mi propia carpeta

**`CTR-03.7` quedó desactualizado y no lo toco acá**, porque `T-31` autoriza un solo
archivo. Dice textualmente que `trackId` *"es el mismo dato para las dos opciones que siguen
vivas en `ADR-01` (embed y deep link) […] gane la que gane cuando cierren `E-04` y `E-07`"*.
Hoy: el embed está descartado (`RES-26`), `E-04` está anulada y `E-07` no decide nada. **El
requisito de fondo no cambia** —el campo sigue siendo opcional y el `trackId` sigue siendo
el dato correcto—, así que no hay riesgo de que alguien construya mal; lo que hay es una
frase que confunde a quien la lea. Se arregla en una edición de una línea, en la próxima
tarea que abra `ARQ-schema-adivinar-tema.md`. Lo anoto para que no se pierda.
