# ARQ — Integración con Spotify

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `D-02`, `D-03`, `D-04`, `D-08`,
> `D-09`, `D-10`, `RES-01`, `RES-09`, `RES-25`, `RES-26`, `US-02`, `BR-06`,
> `.claude/rules/codigo-juegos.md`. Produce: `ADR-01`.
> Última actualización: 2026-08-19 (revisión 3, tras `RES-26`).

---

## ADR-01 — Vía de integración con Spotify para dar acceso al tema

- **Fecha:** 2026-08-19 · **Revisión 2:** incorporando `RES-01` · **Revisión 3:**
  2026-08-19, incorporando `RES-26`.
- **Estado:** **propuesta**, con **cuatro de cinco opciones cerradas** y **una sola
  pregunta abierta**. No bloquea construir; bloquea publicar el enlace.
- **Consume:** `D-02` (sin backend), `D-03` (motor híbrido), `D-08` (el jugador no tiene
  Premium), `D-09` (criterios no negociables), `D-10` (difusión), `RES-01`
  (`Docs/INVESTIGACION/INV-01-fichas-iniciales.md`), `RES-26`
  (`Docs/INVESTIGACION/INV-22-imagenes-tapas-y-spotify.md`), `BR-06`
  (`Docs/PRODUCTO/PRD-promesa-spotify.md`).

> **Cambio de título en la revisión 3.** Este ADR se llamaba "…para escuchar el tema
> **completo**". `BR-06` retiró esa promesa: la v1 promete **acceso** al tema, no
> reproducción íntegra. El título citaba una promesa que ya no existe.

### Estado en una mirada — leé esto primero

| | |
|---|---|
| **Descartadas con evidencia** | **C** (`preview_url`) y **D** (Web Playback SDK), por `RES-01`. **A** (embed), por `RES-26` — descarte **contractual**, no técnico. No se reabren salvo por la condición escrita en cada una. |
| **En disputa** | **B** (deep link) contra **E** (ninguna integración). No hay tercera. |
| **Lo único que falta** | **`E-13`**: ¿un deep link simple cuenta como "acceder a la Spotify Platform"? Una pregunta, y decide entre B y E. |
| **Valor de trabajo, marcado** | **B**. `experiencia` y `contenido` pueden construir contra B hoy: es una hoja que se poda en un commit si `E-13` vuelve en contra. |
| **Ya cerrado y usable hoy** | El **fallback** (revisado en esta revisión: la cascada perdió el escalón del embed) y el dato que consume el JSON: `trackId`, igual en B y sin desperdicio en E. |
| **Presupuesto** | **Cero bytes de Spotify en toda la sesión**, no solo durante la partida. Ver "Consecuencias". |
| **Estado de `producto`** | La alerta de la revisión 2 **está resuelta**: `BR-06` existe y aguanta este hallazgo sin cambios. Lo nuevo va como propuesta cruzada, no como alerta abierta. |

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
  considera aceptado por el solo uso, en un proyecto cuyo riesgo número uno ya es derechos
  y cuya publicación ya está bloqueada por un gate de derechos real (`CLAUDE.md`, sección
  6). Construir cuatro juegos encima de una cláusula que dice "no hagas juegos" es
  exactamente el error que la cláusula describe.

**Condición de reapertura, y es una sola:** prueba escrita de que la Policy no alcanza al
uso del embed por un sitio sin fines de lucro (`E-14`). Aun así, A volvería **solo** si
además `E-04` resultara favorable, y `E-04` está anulada porque nadie la va a investigar.
La reapertura es remota y está bien que lo sea.

**Lo que queda archivado, no borrado, por si A vuelve:** el requisito duro de `RES-01`(c) —
el iframe necesita **`allow="encrypted-media"`** o reproduce menos de 30 segundos en
silencio. Es el error silencioso perfecto y sería una lástima perderlo del registro.

#### Opción B — Deep link a Spotify — **la candidata**

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
- **No verificado, y es lo único que falta (`E-13`):** que un link pelado no cuente como
  "usar o acceder a la Spotify Platform". `RES-26` lo llama **discutible** y tiene razón en
  llamarlo así. **Es una lectura razonable, no un hecho, y no la trato como hecho.** Sobre
  el link simple no hay pronunciamiento conocido en ninguna de las dos direcciones.
- **Exige:** un `trackId` por tema en el JSON.

#### Opción E — Ninguna integración: la revelación cierra en el fragmento propio

La nombro porque, descartadas A, C y D, **es la única alternativa real que le queda a B**, y
un ADR con una sola opción no es una decisión. No es una opción nueva: es el tercer escalón
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

### Inclinación provisoria (no es la decisión)

**B sola**, y por eliminación otra vez, no por mérito. La cascada "A + B" de la revisión 2
se cae entera: el escalón primario está prohibido.

Lo que cambió de fondo entre la revisión 2 y esta: antes elegíamos **entre dos formas de
integrar**; ahora elegimos **si integramos**. Es una pregunta más chica en superficie y más
grande en consecuencias, porque del lado del "no" no hay plan B técnico: hay un botón menos.

### Fallback cuando Spotify no está disponible — **revisado en la revisión 3**

Sigue **cerrado**, sigue sin depender de evidencia externa. Lo que cambió es la cascada, que
perdió el escalón del embed. El principio y los puntos 1 a 3 están intactos.

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

**De catorce preguntas, queda bloqueando una: `E-13`.**

| ID | Tema | Estado tras `RES-26` |
|---|---|---|
| **`E-13`** | ¿Un deep link simple es "acceder a la Spotify Platform"? | **BLOQUEA — la única.** Nueva en la revisión 3. Decide entre B y E |
| `E-14` | ¿La Policy tiene excepción escrita para uso sin fines de lucro / fan site? | **Abierta, no bloquea.** Solo sirve como condición de reapertura de A. Nueva en la revisión 3 |
| `E-04` | Qué reproduce el embed sin Premium | **ANULADA por `RES-26`.** Ver abajo |
| `E-05`, `E-06`, `E-10` | Requisitos, API JS y comportamiento móvil del embed | **ANULADAS.** Eran "cómo implementar A". Sin A, no tienen objeto |
| `E-07` | Free en Argentina, ¿tema a demanda? | **Degradada: abierta, ya no bloquea.** Ver abajo |
| `E-12` | Obtener un `trackId` sin cuenta de dev | **Abierta, no bloquea, pero ahora importa más.** Acoplada a `E-13` |
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

#### `E-12` — sube de prioridad por un motivo nuevo

Era "abierta, nunca bloqueó". Ahora importa más, porque este ADR agrega una restricción dura
—**no registrar una app de desarrollador**, ver Consecuencias— y con eso desaparece el atajo
de "sacamos los IDs por la API y listo". Los `trackId` van a tener que salir de una acción
de usuario común: copiar el link desde la app o la web.

**Y esa acción es la misma pregunta que `E-13`**, aplicada a la obtención en vez de a la
publicación. Si copiar un link como usuario común no es acceder a la Platform, `E-12` se
responde sola con `E-13`. Las dejo acopladas para que `investigador` no las investigue por
separado.

### Criterio de cierre — reescrito, y con la autocrítica de por qué hubo que reescribirlo

Sigo escribiéndolo **antes** de que llegue la evidencia. Funcionó dos veces: forzó el
descarte de C sin renegociar nada.

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
| `E-13`: **no hay pronunciamiento y no lo va a haber** — el desenlace más probable | Deja de ser pregunta técnica y pasa a ser **decisión de riesgo**, que **no es mía**: se resuelve en la nota de derechos de `contenido` junto al resto de la exposición legal, y la asume el usuario, que es el expuesto. **Mi recomendación para esa rama, marcada como recomendación y no como decisión: B**, por los tres motivos de abajo |
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
- **Fácil:** revertir. B es un `<a href>` condicionado a un campo opcional. Si `E-13` vuelve
  en contra, se borra el componente y no queda deuda.
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
  hay diseño que la elimine; solo la decisión de correrla o no. Va a la nota de derechos.
- **Lo que dejó de ser difícil:** "garantizar el tema completo dentro del sitio" ya no
  figura como problema. `BR-06` lo retiró de las promesas y `RES-26` cerró la única vía que
  quedaba de intentarlo. El tema deja de estar abierto en los dos frentes a la vez.

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

### Qué NO decide este ADR

- Cómo se ve la revelación, dónde va el botón y qué dice: `experiencia` (`UX-XX`).
- La redacción de la promesa al jugador: `producto` (`BR-06`, ya escrita).
- Si el deep link es legalmente prudente de correr sin pronunciamiento: **nota de derechos
  de `contenido`**, con la recomendación de arriba como insumo, no como veredicto.
- Si `US-04` puede usar tapas: **no cambia por esto**. Spotify queda fuera de esa discusión;
  el derecho moral del autor vivo sigue abierto y es de `contenido`.
- La numeración exacta de las cláusulas de la Policy para citarla formalmente: `contenido`
  la tiene que confirmar antes de escribirla en la nota de derechos.
