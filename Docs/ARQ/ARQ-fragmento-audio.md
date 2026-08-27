# ARQ — Fragmento de audio: formato, nombre, lugar y presupuesto

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `D-02`, `D-03`, `D-06`, `D-09`,
> `D-14`, `D-22`, `D-23`, `D-24`, **`D-26`**, `US-02`, `BR-02`, `RES-03`, `RES-20`,
> `CNT-01` (sección A, revisión 2026-08-24), **`FIND-33` de `REV-08`**,
> `.claude/rules/codigo-juegos.md`,
> `Docs/SUGERENCIAS/HILO-para-arquitectura-escalera-de-seis-y-modo-buscador.md`,
> `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`.
> Produce: **`CTR-01` v3**.
> Última actualización: **2026-08-27 (revisión 5, cierre de `FIND-33` de `REV-08`)**.

---

## Nota de versionado: por qué v2 adentro del mismo archivo

El método de este rol versiona el archivo (`-v1`, `-v2`) cuando un cambio invalida
decisiones previas. Acá el contrato pasa a **v2** y el archivo **no** se parte en dos, por
dos razones:

1. `T-104` nombra este archivo como entregable, y `CTR-01` se cita por número desde el
   código, desde `CTR-03`, desde `CNT-01` y desde tres decisiones. Un `-v2` en la ruta
   dejaría todas esas citas apuntando a un documento congelado.
2. La trazabilidad se resuelve igual de bien y más barato: **la redacción vieja no se borra,
   queda citada dentro de cada sección revisada**, con fecha y motivo. Es como ya venían
   trabajando `CTR-01.3` y `CTR-01.9` en la revisión 3.

*Alternativa descartada:* `ARQ-fragmento-audio-v2.md` con el v1 congelado al lado. Se
descarta por lo de arriba y porque duplicaría las siete secciones que **no** cambian.

**Y por qué esto pasa a v3 el 2026-08-27, con el mismo criterio.** `D-26` movió el número
del que cuelgan la duración, el peso, la RAM y el último escalón, y sumó un segundo camino
de producción que la v2 no contemplaba. Eso invalida números de la v2, así que sube la
versión; el archivo sigue sin partirse y la redacción vieja sigue citada donde estaba.
**`CTR-03` no sube de versión por esto** y tiene su motivo escrito en su propia nota: allá
lo que cambia son dos literales de un rango, no la forma del dato, y `contratoVersion: 2`
está escrito en `src/data/adivinar-tema.json` y en los dos scripts que lo producen.

---

## Lo que hay que leer antes que cualquier número: **los dos regímenes**

Desde `D-26` (2026-08-26) este contrato describe **un artefacto que se produce por dos
caminos distintos**, y casi todo el desacuerdo posible entre lo que dice acá y lo que hay
en disco sale de no saber cuál de los dos miraste.

| | **Régimen A — el generador** | **Régimen B — la ingesta (vigente hoy)** |
|---|---|---|
| Script | `scripts/generar-fragmentos.mjs` | `scripts/ingerir-fragmentos.mjs` |
| De dónde sale el audio | los discos del usuario, recortados con ffmpeg (`D-23`) | 95 fragmentos **ya recortados a mano**, PR #8 (`D-26`) |
| Necesita ffmpeg | sí | **no** |
| Duración | la que pida `D` (ver abajo) | **10,06 s medidos**, los 95 iguales |
| Bitrate | **96 kbps** CBR, forzado con `-b:a 96k` | **64 kbps** CBR |
| Canales / rate | mono y 44.100 Hz, forzados con `-ac 1 -ar 44100` | **el contrato los sigue exigiendo**; `D-26` los declara mono, pero el ingestor no mide ni canales ni rate (deuda 6) |
| Normalización | `loudnorm` (con la deuda 3) | **ninguna**: el archivo entra como vino |
| Cómo mide la duración | `ffprobe` | los frames del mp3, `bytes × 8 ÷ bitrate` — exacto en CBR |
| Qué escribe | los mp3 **y** el manifiesto | **solo** el manifiesto |

**Los dos conviven a propósito, y ninguno está deprecado.** El régimen A es el camino que
`D-26` nombra explícitamente como vuelta atrás: es el único que puede volver a poner
fragmentos de 15 s en disco. El régimen B existe porque en la máquina donde se terminó el
juego no hay ffmpeg, y porque el usuario pidió terminarlo con el material que había.

> **Al que corra el generador viejo y vea que salen fragmentos de 10 s: no rompiste nada.**
> `generar-fragmentos.mjs` **no tiene el 15 escrito**: importa `DURACION_FRAGMENTO_SEG` de
> `src/lib/tema/escalera.ts`, que hoy vale 10 por `D-26`. Si querés fragmentos de 15, la
> constante se mueve **antes** de generar. El orden está en `CTR-01.3`, con lo que pasa si
> lo hacés al revés.

**Todo número de duración de este contrato se escribe como fórmula alrededor de `D`**, que
es `DURACION_FRAGMENTO_SEG`, la única fuente (`escalera.ts`). Hoy `D = 10`. Con `D = 15`
—que es el régimen que `D-24` había fijado y que sigue siendo válido— las mismas fórmulas
devuelven los números de la v2. Es a propósito: **el contrato tiene que quedar legible en
los dos regímenes**, no pisar el de 15 como si nunca hubiera existido.

---

## Qué cambió en la revisión 5 (2026-08-27), en una tabla

Cierra `FIND-33` de `REV-08`: el contrato fijaba 14,90–15,15 s y escalera a 15, y contra
`src/data/adivinar-tema.json` eso daba "DESALINEADO" en los 95 fragmentos. **El código ya
estaba bien** (`escalera.ts` sigue `D-26` desde el 2026-08-26); el que quedó viejo era este
documento, que es exactamente el reparto de `D-12`.

| Sección | Antes (2026-08-24, revisión 4) | Ahora (2026-08-27, `FIND-33`) | Por qué |
|---|---|---|---|
| — | Un solo camino de producción | **Dos regímenes**, tabla de arriba | `D-26`, PR #8 |
| `CTR-01.1` | Bitrate **96 kbps** CBR, valor único | **64–96 kbps** CBR según régimen | Los 95 reales son de 64 |
| `CTR-01.3` | Máximo 15,0 s · ventana **14,90–15,15** | Máximo **10,0 s** · ventana **9,90–10,40**, las dos derivadas de `D` | `D-26` |
| `CTR-01.5` | 180 KB · 2,9 MB por buffer · **8,6 MB** residentes | **80 KB · 1,9 MB · 6,0 MB** | Recalculado sobre 10 s y 64 kbps |
| `CTR-01.6` | Un comando | **Dos**, uno por régimen | `ingerir-fragmentos.mjs` |
| `CTR-01.7` | `duration` 14,90–15,15 · `size` ≤ 210.000 fijos | Ventana y tope **derivados de `D` y del bitrate** | Un tope de 96 kbps no sirve para medir un archivo de 64 |
| `CTR-01.9` | Paso 6 = **15 s** | Paso 6 = **10 s**, con la condición para volver a 15 | `D-26` |
| Deudas | Cuatro | **Seis**: el docblock del generador y la verificación que le falta al ingestor | Encontradas al escribir esta revisión |

Lo que **no** cambió: mp3, 44.100 Hz, mono, sin metadatos, sin fades en el archivo,
`public/audio/fragmentos/<slug>.mp3`, los cuatro campos del manifiesto, los cinco primeros
escalones de la escalera, la tabla de puntaje (es de `producto`) y el principio de que los
datos guardan el slug y nunca la ruta. *El rate y los canales siguen siendo exigencia del
contrato; lo que esta revisión agrega es que en el régimen B nadie los está comprobando
(deuda 6).*

---

## Qué cambió en la revisión 4, en una tabla

| Sección | Antes (2026-08-19, revisión 3) | Ahora (2026-08-24, `T-104`) | Por qué |
|---|---|---|---|
| `CTR-01.1` | Excepción de estéreo por cancelación de fase | Retirada: el fragmento es mono, siempre | El generador fuerza `-ac 1` y el manifiesto no tiene dónde declarar `canales` |
| `CTR-01.2` | `inicioEnTemaSeg` por tema | Retirado del dato: el recorte arranca en el segundo 0, sin excepciones | El generador no toma `-ss` y el manifiesto no guarda el campo |
| `CTR-01.3` | Máximo **10,0 s** | Máximo **15,0 s**, ventana 14,90–15,15 | `CNT-01` sección A, revisión 2026-08-24 (`T-101`) |
| `CTR-01.4` | Slug con doble guion para colisiones | Slug de guion simple; la colisión **rompe el build** | `slugDeTitulo()` nunca produce `--`; `catalogo()` falla ruidoso |
| `CTR-01.5` | 120 KB por archivo · 1,8 MB por buffer · 5,3 MB residentes | **180 KB · 2,6–2,9 MB · 7,9–8,6 MB** | Recalculado sobre 15 s y sobre el rate real del `AudioContext` |
| `CTR-01.6` | Dos comandos de `ffmpeg` a mano, máster en `~/RicotaArcade-masters/` | `npm run generar-fragmentos`, máster = la discografía del usuario (`D-23`) | El paso manual dejó de existir |
| `CTR-01.7` | ≤ 10,10 s · ≤ 140.000 bytes · script pendiente | ≤ 15,15 s · ≤ 210.000 bytes · **ya corre adentro del generador** | Escala con la duración; el script pendiente se escribió |
| `CTR-01.8` | Objeto `fragmento` con siete campos, `credito` obligatorio | **Entrada de manifiesto de cuatro campos**; el crédito se **deriva** de `RES-20` en build | `D-24`: el banco de ítems dejó de existir |
| `CTR-01.9` | Cinco pasos, 0,1 / 0,5 / 2 / 5 / 10 | **Seis pasos: 0,1 · 0,5 · 2 · 4 · 8 · 15** | `D-24`, y el código ya corre así |

Lo que **no** cambió *en aquella revisión*: mp3, 44.100 Hz, mono, 96 kbps CBR, sin
metadatos, sin fades en el archivo, `public/audio/fragmentos/<slug>.mp3`, y el principio de
que los datos guardan el slug y nunca la ruta. *(De esa lista, los 96 kbps sí se movieron
después: ver la revisión 5, arriba.)*

---

## CTR-01 — Contrato del fragmento de audio del reveal progresivo

- **Fecha de esta versión:** 2026-08-27 · **v3**
- **Estado:** **vigente, sin números abiertos, y describe un juego construido y con audio
  real en disco** — 95 fragmentos, que es lo que la v2 todavía no tenía.
- **Para quién es:** para los dos productores (`scripts/generar-fragmentos.mjs` y
  `scripts/ingerir-fragmentos.mjs`), para el motor de audio (`src/lib/tema/audio.ts`) y
  para quien produzca los archivos desde su máquina.
- **Qué NO es:** una habilitación para publicar. Bajo `D-14` no hace falta ninguna: si
  llega un reclamo se baja el fragmento puntual. El gate de `D-07` que citaba la v1 ya no
  existe como cerrojo.

---

### CTR-01.1 — Formato del archivo

| Parámetro | Valor | Por qué |
|---|---|---|
| Contenedor / códec | **MP3 (MPEG-1 Layer III)** | Es el único formato que `decodeAudioData` decodifica en todos los navegadores móviles, Safari de iOS incluido. |
| Sample rate | **44.100 Hz** | Es el rate de origen de casi todo el material. El navegador remuestrea solo al rate de su `AudioContext`, y eso tiene consecuencia de RAM: ver `CTR-01.5`. |
| Canales | **1 (mono), sin excepción** | El jugador escucha por el parlante del celular. Mono baja el archivo y la RAM a la mitad. |
| Bitrate | **64–96 kbps CBR**, según el régimen que produjo el archivo | CBR permite calcular el presupuesto con una regla de tres, y es lo que hace que el ingestor pueda medir la duración sin ffmpeg. Ver la nota de abajo antes de usar cualquiera de los dos números. |
| Metadatos | **ninguno** (`-map_metadata -1`) | Un tag con el nombre del archivo de origen adentro de un repo público no aporta nada y cuenta de más. |
| Fades | **ninguno en el archivo** | Un fade-in de 50 ms convierte el paso de 0,1 s en silencio. El fade-out al cortar es del motor: ver la deuda 2 más abajo. |

> **Revisado el 2026-08-24 (`T-104`): se retira la excepción de estéreo.** La v1 permitía
> guardar un tema en estéreo si al pasarlo a mono se le caía un instrumento por
> cancelación de fase, anotando `"canales": 2` en su ficha del JSON. **Ese JSON ya no
> existe**: el manifiesto de `CTR-03` tiene cuatro campos y ninguno es `canales`; el
> generador pasa `-ac 1` fijo; y la verificación de `CTR-01.7` rechaza cualquier archivo
> que no tenga un canal, así que un estéreo hecho a mano se marcaría como falla y la
> siguiente corrida con `--rehacer` lo pisaría.
>
> **Revisado el 2026-08-27 (`FIND-33`): el bitrate deja de ser un número y pasa a ser un
> rango con dos valores nombrados.** La v2 pedía **96 kbps** y podía permitirse un valor
> único porque el único productor era ffmpeg con `-b:a 96k`. Los 95 fragmentos que trajo el
> PR #8 vienen a **64 kbps** mono CBR, y `D-26` los aceptó: entre el material real y el
> ideal, ganó el que existe.
>
> - **Régimen A → 96 kbps.** No baja: el generador lo tiene forzado y no hay motivo para
>   tocarlo el día que vuelva a correr.
> - **Régimen B → 64 kbps.** Es lo que hay, y no se rehace: rehacerlo cuesta exactamente lo
>   mismo que volver a 15 s —ffmpeg y los másters— así que si algún día se paga ese precio,
>   se pagan las dos cosas juntas y de una.
> - **Debajo de 64 no baja, y eso sí es contrato.** Un archivo a 48 o 32 kbps mono no entra
>   sin declararse acá primero.
>
> **Lo que se sabe y lo que no, sin adornar.** Que 64 kbps en un canal es, *por canal*, la
> misma tasa que los 128 kbps estéreo del tema entero de `D-22`, es aritmética. **Cómo
> suena no está fichado**: nadie midió artefactos ni reportó ninguno, y el paso 1 son 0,1 s
> donde el timbre es todo lo que hay. Si alguien escucha un fragmento y le suena a teléfono,
> **eso es un motivo legítimo para regenerar por el régimen A**, y no hace falta ninguna
> ficha para decidirlo: se escucha y se decide.

> **Consecuencia asumida:** si aparece un tema que en mono se desarma, hoy el contrato no
> lo soporta y el fragmento va a sonar peor que el original. Se acepta porque no hay
> ningún caso reportado —no hay un solo fragmento generado todavía— y porque el precio de
> mantener la excepción es un campo por archivo, una rama en el generador y el doble de
> RAM en el peor caso del presupuesto. El día que aparezca el primer tema afectado, la
> excepción vuelve con nombre y apellido: una fila de excepciones en el generador y el
> campo `canales` en el manifiesto. **No se resuelve guardando el archivo a mano.**

**Alternativas descartadas** (se mantienen de la v1, siguen valiendo):

- **Opus en WebM** — el más chico con diferencia. Descartado porque el soporte de Opus en
  `decodeAudioData` de Safari/iOS no está fichado y el precio de equivocarse es que la
  mitad de los celulares no pueda jugar el juego de audio. `D-09` sacó la velocidad de
  carga de los no negociables, así que no hay nada que comprar con esos kilobytes.
- **AAC en `.m4a`** — 20–30 % más chico. Mismo motivo, menos premio.
- **WAV sin comprimir** — 10 s en mono a 44,1 kHz / 16 bits son ~0,9 MB por tema (1,3 MB si
  se vuelve a 15). Con 104 temas es un repositorio de 90 a 135 MB para nada.

---

### CTR-01.2 — Dónde empieza el recorte

- **El fragmento arranca en el segundo 0 del archivo de origen. Sin excepciones.**
- Si el tema abre con silencio, ruido de sala o cuenta, **ese silencio entra al
  fragmento** y se come parte del paso 1. La mitigación está declarada como deuda 1.

> **Revisado el 2026-08-24 (`T-104`): se retira `inicioEnTemaSeg`.** La v1 decía "arrancá
> en el primer ataque musical" y guardaba el desplazamiento en un campo del ítem, para que
> `producto` o `contenido` pudieran mover el punto de recorte de un tema puntual. Las tres
> patas de esa redacción se cayeron: el que recorta ya no es una persona sino
> `scripts/generar-fragmentos.mjs`, que no acepta un `-ss` por tema; el manifiesto de
> `CTR-03` no tiene el campo; y no hay banco de ítems donde anotarlo.
>
> **Qué se pierde y qué no.** Se pierde el ajuste por tema. No se pierde la propiedad que
> justificaba el campo —que el paso 1 suene a música y no a silencio—, que pasa a
> resolverse en el motor con `t0` (deuda 1) y, mientras tanto, con el chequeo humano que
> el generador imprime al terminar: escuchar los primeros 100 ms de tres o cuatro
> fragmentos.
>
> **Cuándo vuelve:** cuando aparezca el primer tema cuyo arranque real esté a más de ~300 ms
> del byte cero y `t0` no alcance. Ahí es una tabla de excepciones en el generador
> —`slug → segundos`— y no un campo del manifiesto: es un parámetro de producción, no un
> dato del sitio.

---

### CTR-01.3 — Duración — **hoy `D` = 10,0 s (`D-26`), y los 15,0 s siguen escritos**

**`D` es `DURACION_FRAGMENTO_SEG`, de `src/lib/tema/escalera.ts`. Es la única fuente, y
todo lo de abajo se deriva de ella.**

- **Duración objetivo: `D`. Hoy `D = 10,0 s`.**
- **Ventana del contrato —lo que puede entrar al manifiesto—: `D − 0,10` a `D + 0,40`.**
  Con `D = 10`: **9,90 s a 10,40 s**. Los 95 fragmentos reales miden **10,06 s** y entran
  con 0,16 s de margen abajo y 0,34 arriba.
- **Malla fina de producción (`CTR-01.7`, la que corre el generador): `D − 0,10` a
  `D + 0,15`.** Con `D = 10`: 9,90 a 10,15.
- **Malla ancha del build (`indexarFragmentos()`): `≥ D − 0,15`.** Con `D = 10`: **9,85 s**.
- **Si un tema del catálogo dura menos que la escalera**, su fragmento no valida, no entra
  al manifiesto y ese tema no entra al pozo. Sigue apareciendo en el buscador, porque el
  buscador ofrece los 105 (`CTR-03.3`).

**Las tres mallas, instanciadas en los dos regímenes:**

| Malla | Regla | `D = 10` (hoy) | `D = 15` (si se regenera) | Qué protege |
|---|---|---|---|---|
| Producción | `D − 0,10` … `D + 0,15` | 9,90 – 10,15 | 14,90 – 15,15 | que ffmpeg haya hecho lo que se le pidió |
| **Contrato / manifiesto** | **`D − 0,10` … `D + 0,40`** | **9,90 – 10,40** | 14,90 – 15,40 | que lo que se publica sirva para los seis pasos y entre en el presupuesto |
| Build | `≥ D − 0,15` | ≥ 9,85 | ≥ 14,85 | que el paso 6 no devuelva silencio |

**Por qué la ventana es asimétrica, que es la única parte que hay que entender:**

- **Abajo, diez centésimas, y no puede ser más.** Un archivo más corto que el paso 6 le
  devuelve **silencio** al jugador que gastó cinco intentos para llegar ahí. Un MP3 no dura
  lo que uno le pide —la trama son 1.152 muestras, ≈ 26,1 ms, y el encoder agrega padding—
  así que 0,10 s son unas cuatro tramas: todo lo que el formato puede desviarse por su
  cuenta. Más abajo de eso ya no es el formato: es un recorte mal hecho.
- **Arriba, cuarenta, y tampoco es flojera.** Que sobre audio **no rompe nada**: el motor
  reproduce `[0, segundos del paso]` y nunca llega al final del archivo. Así que el techo
  no protege al jugador, protege el **presupuesto de `CTR-01.5`**, que es proporcional a la
  duración. 0,40 s son unas quince tramas: alcanzan para un recorte hecho a ojo en un
  editor y no alcanzan para que se cuele un archivo que apuntaba a otra duración. Con el
  techo ahí, tres buffers residentes siguen entrando en **6,0 MB**.
- **Por qué el techo se afloja respecto de la v2**, que pedía `D + 0,15` también para el
  manifiesto: entonces había un solo productor —ffmpeg con `-t`— y ±0,15 describía bien el
  error del formato. Ahora hay **una mano recortando en un editor**, y una mano no acierta
  a la trama. El régimen A conserva su malla fina; la del contrato tiene que aceptar a los
  dos, o rechazaría material bueno.

> **Revisado el 2026-08-27 (`FIND-33` de `REV-08`): el máximo baja de 15,0 a 10,0 s, y esto
> es reversible por diseño.** La v2 fijaba 15,0 s con la ventana 14,90–15,15, y contra
> `src/data/adivinar-tema.json` eso daba "DESALINEADO" en los 95 fragmentos. **El que estaba
> viejo era el contrato, no el código.**
>
> **Qué pasó, entero.** `D-24` fijó la escalera de seis pasos terminando en 15 s y `D-23`
> dimensionó los fragmentos igual. Lo que llegó fue otra cosa: el **PR #8** trajo **95
> fragmentos recortados a mano de 10,06 s**, a 64 kbps mono CBR, con el pedido del usuario
> de terminar el juego con ellos. Y no era opinable: `indexarFragmentos()` **rechaza el
> manifiesto entero** si un fragmento dura menos que el último paso —ese chequeo existe
> justamente para que el escalón más caro no devuelva silencio—, así que con la escalera en
> 15 el juego se quedaba sin pozo y el build se caía. `D-26` (2026-08-26) bajó la escalera a
> 10 y `DURACION_FRAGMENTO_SEG` con ella: *entre una escalera que promete 15 y reproduce 10,
> y una que promete 10 y cumple, gana la que no miente.*
>
> **Los 15,0 s no se borran de este documento, y el motivo no es sentimental.** `D-26` se
> declaró reversible y nombró el camino: regenerar con `generar-fragmentos.mjs`. Este
> contrato tiene que dejar los dos regímenes legibles para que dentro de seis meses se
> entienda **por qué hay 10 y no 15** —porque el material real mide 10, no porque alguien
> haya preferido 10— y **qué haría falta para volver**. Eso está en el recuadro de abajo.
>
> **Y lo que la v2 decía del número de `contenido` sigue valiendo, corrido de lugar.**
> `CNT-01` sección A, revisión del 2026-08-24 (`T-101`), subió el techo editorial de 10,0 a
> **15,0 s**: eso es un **techo**, no un objetivo. Los 10,0 de hoy están **por debajo** de
> él, así que `D-26` no lo contradice ni le pide permiso a nadie. El día que se vuelva a
> 15,0 se vuelve a tocar ese techo, y ahí el dueño del número sigue siendo `contenido`.

**Lo que hay que hacer para volver a 15, en orden, y qué pasa si el orden se invierte:**

1. `src/lib/tema/escalera.ts`: `DURACION_FRAGMENTO_SEG = 15` y el paso 6 de `ESCALERA` a
   `15` con su etiqueta. **Dos líneas.**
2. `src/lib/tema/escalera.test.ts`: la fila `[6, 10]` de la tabla escrita a mano, y el
   ancho del último tramo. Es la verificación, no el dato.
3. Recién ahí, con ffmpeg y los másters:
   `npm run generar-fragmentos -- "<carpeta con los discos>" --rehacer`. El generador lee
   `D` de `escalera.ts`, recorta los 15 s, y **reescribe el manifiesto solo**.
4. Este contrato: **nada**. Todo lo que depende de la duración está escrito como fórmula
   alrededor de `D`, y las tablas ya traen la columna de `D = 15` calculada.
5. `CTR-03.8`: **dos literales**, `minimum` y `maximum` del bloque de schema, que están
   marcados ahí como la instancia de `D − 0,10` y `D + 0,40`. Es el único lugar del
   proyecto donde la ventana está escrita con números y no con la regla, y tiene su motivo
   explicado en esa sección.

> **Si invertís el orden 1 y 3, generás otra vez fragmentos de 10** —el generador no tiene
> el 15 escrito, lo lee de la constante—. **Y si hacés el 1 sin el 3, el build se cae:** 95
> fragmentos de 10,06 s contra un paso 6 de 15 s hacen que `indexarFragmentos()` tire
> `CatalogoInvalido` en el primero, con el mensaje "el último paso sonaría a silencio". No
> es un accidente feo: es el chequeo funcionando. **No hay estado intermedio jugable entre
> los dos regímenes**, y por eso conviene moverlos de a uno y en este orden.

> **Revisado el 2026-08-24 (`T-104`).** La v1 fijaba **10,0 s** citando `CNT-01` sección A
> del 2026-08-19. Ese número quedó viejo antes de que existiera un archivo: `D-23`
> (2026-08-23) escribió *"los 15 s de `CTR-01`"* al partir el audio en dos niveles, y
> `D-24` lo confirmó al fijar la escalera de seis pasos que termina en 15 s.
>
> **De quién es el número nuevo.** De `contenido`, igual que el viejo. `CNT-01` sección A,
> **revisión del 2026-08-24, tarea `T-101` del ciclo 7**, sube el techo de 10,0 a 15,0 s.
> Este contrato lo asienta y no lo discute: la duración del fragmento es la variable de
> exposición del audio, y esa decisión tiene dueño.
>
> **El matiz, y no se deforma.** `CNT-01` dejó escrito que los 15,0 s caen por debajo del
> orden de magnitud de los 8 compases del Art. 10 de la Ley 11.723 (~16 s a 120 BPM,
> `RES-03`), y **rotuló esa coincidencia como corroboración débil, no como fundamento**:
> el tempo real de cada tema no está fichado, `RES-11` sostiene que la excepción de cita
> cubre la obra y no el fonograma, y que un juego de trivia entre en "fin didáctico" sigue
> sin criterio. Los 15,0 s son **precaución editorial de `contenido`, explícitamente sin
> respaldo legal**, elegidos por una necesidad de mecánica.
>
> **Nadie cita esta sección como si 15 segundos estuvieran permitidos.** No lo están ni lo
> dejan de estar: la pregunta legal sigue abierta y el encuadre es el de `D-14` — fan site
> sin fines de lucro, y si llega un reclamo se baja el fragmento puntual.

**Qué pasa si el número vuelve a moverse.** Se mueve `D` y **nada más de este documento**:
la ventana, el peso, la RAM y el paso 6 están escritos como fórmulas alrededor de ella.
Fuera del documento, la lista numerada del recuadro de arriba. **Ningún dato migra**:
los seis pasos salen del mismo archivo de audio y el manifiesto lo reescribe un script. El
material de origen vive en la máquina del usuario (`D-23`), así que re-exportar los 104 es
una corrida del generador, no volver a conseguir cien temas — lo único que hace falta y hoy
no está es **ffmpeg**, que es la razón entera por la que existe el régimen B.

---

### CTR-01.4 — Nombre y lugar del archivo

**Nombre:** `<slug-del-tema>.mp3`, donde el slug lo produce `slugDeTitulo()`
(`src/lib/texto.ts`) a partir del título tal como lo escribe `RES-20`.

- Minúsculas, ASCII puro. Sin tildes, sin eñes, sin puntuación, sin espacios.
- Todo lo que no es letra ni número se colapsa en **un** guion medio.
- Patrón: `^[a-z0-9]+(-[a-z0-9]+)*$`.

> **Revisado el 2026-08-24 (`T-104`): se retira el sufijo `--<slug-del-disco>` para
> colisiones.** La v1 resolvía dos títulos iguales en dos discos con un doble guion, y el
> schema de `CTR-03` aceptaba `-{1,2}` por eso. El código no lo hace y no lo puede hacer:
> `slugDeTitulo()` nunca emite dos guiones seguidos, así que ese patrón describía un
> nombre que nada produce.
>
> **Qué resuelve la colisión ahora, y es mejor:** `catalogo()` recorre los 105 títulos de
> `RES-20`, y si dos dan el mismo slug **rompe el build** nombrando los dos temas, porque
> un archivo taparía al otro. La v1 confiaba en que la persona que recortaba se acordara
> del sufijo; la v2 no deja que el sitio construya. Hoy los 105 dan 105 slugs distintos.

**Lugar:** `public/audio/fragmentos/<slug>.mp3` — y, desde `D-23`,
`public/audio/temas/<slug>.mp3` para el tema entero del reveal.

- Van en `public/` y no en `src/assets/` porque el pipeline de Astro hashea los nombres, y
  la URL se arma en runtime desde un string.
- **Los datos guardan el slug, nunca la ruta.** El motor arma
  `/audio/fragmentos/${slug}.mp3` desde `CARPETA_FRAGMENTOS`, una constante de
  `src/lib/tema/audio.ts`. Si la carpeta se muda, cambia una línea.
- **Los dos niveles son dos superficies distintas de derechos** (`D-22`, `D-23`): el
  fragmento son `D` segundos —hoy 10—, el entero es la grabación completa. El manifiesto
  los distingue con el booleano `entero`, y ese booleano es el mapa de `CTR-03.6`. **Hoy
  `public/audio/temas/` está vacío**: los 95 son fragmento y ninguno tiene entero, así que
  la superficie publicada es la chica.

**Alternativa descartada** (de la v1, sigue valiendo): IDs numéricos (`trk-001.mp3`).
Con slug, un archivo mal emparejado se nota leyendo la carpeta; con números hace falta una
planilla, y la planilla es un segundo lugar donde el nombre puede mentir.

---

### CTR-01.5 — Presupuesto de precarga — **recalculado sobre 10 s y 64 kbps**

El paso de 0,1 s tiene que ser honesto: cuando el jugador toca, suena. Eso no se consigue
optimizando la descarga, se consigue teniendo el buffer decodificado antes.

> **Revisado el 2026-08-24 (`T-104`).** La v1 calculaba sobre 10,0 s: 120 KB por archivo,
> 1,8 MB por buffer, 5,3 MB residentes, 2 MB de red por partida de 10 rondas. El hilo
> principal recalculó a mano ~2,6 MB por buffer y ~8 MB de ventana, y construyó con eso.
> **Se confirma esa cuenta y se le agrega el caso peor que faltaba** — el rate del
> `AudioContext`, que la v1 mencionaba en `CTR-01.1` y después no usaba en la aritmética.

> **Recalculado el 2026-08-27 (`FIND-33`), sobre `D = 10` y los 64 kbps del régimen B.** La
> revisión 4 calculaba sobre 15 s a 96 kbps: 180 KB por archivo, 2,9 MB por buffer, 8,6 MB
> residentes. **Todos esos números bajan un tercio, y ninguno bajó porque se optimizara
> algo:** bajaron porque el fragmento dura dos tercios de lo que se había planeado. Si se
> vuelve al régimen de 15 s, vuelven tal cual — por eso están en la última columna.

**Las cuentas, con el caso peor escrito y con la columna de la vuelta atrás:**

| Concepto | Cuenta (`D = 10`) | Total | Con `D = 15` |
|---|---|---|---|
| Archivo MP3, **régimen B** (10,06 s, mono, 64 kbps) | 8 KB/s × 10,06 s | **≈ 80 KB** | — |
| Archivo MP3, régimen A (mono, 96 kbps) | 12 KB/s × 10 s | ≈ 120 KB | ≈ 180 KB |
| `AudioBuffer` con `AudioContext` a 44,1 kHz | 10 × 44.100 × 4 bytes (Float32) × 1 canal | **≈ 1,8 MB** | ≈ 2,6 MB |
| `AudioBuffer` con `AudioContext` a **48 kHz** | 10 × 48.000 × 4 × 1 | **≈ 1,9 MB** | ≈ 2,9 MB |
| 3 buffers residentes, caso normal | 3 × 1,8 MB | **≈ 5,3 MB** | ≈ 7,9 MB |
| 3 buffers residentes, **caso peor del contrato** (techo de la ventana, 10,40 s, a 48 kHz) | 3 × 10,40 × 48.000 × 4 | **≈ 6,0 MB** | ≈ 8,9 MB |
| Si no se descartara nada: 20 buffers | 20 × 1,9 MB | ≈ 38 MB — **inaceptable en gama baja** | ≈ 58 MB |

**Por qué aparece el caso peor y por qué es el número que manda.** `decodeAudioData`
devuelve el buffer al **rate del `AudioContext`**, no al del archivo. En una parte de los
celulares ese rate es 48 kHz, así que el mismo mp3 de 44,1 kHz ocupa un 9 % más de RAM del
que dice la cuenta ingenua. Y el archivo puede llegar al techo de la ventana de `CTR-01.3`.
El techo del contrato es **6,0 MB**, no 5,3. Entra de sobra en un celular de gama baja, y
por eso el reveal de 0,1 s puede prometer que suena.

**El costo real de la precarga es la RAM, no la red, y con 64 kbps la desproporción es
peor:** un fragmento pesa **80 KB** en la red y **1,9 MB** en memoria, **veinticuatro veces
más**. Bajar el bitrate abarata la descarga y **no descuenta un solo byte de RAM**: el
`AudioBuffer` es Float32 crudo y solo depende de los segundos y del rate. Es la trampa más
fácil de comerse acá — "los archivos son más chicos, entonces entran más" es falso.

**Reglas duras del motor:**

1. **La ronda arranca sin esperar, y el que espera es el sonido.** El clic de `Empezá`
   despierta el `AudioContext` —los celulares exigen un gesto— y dispara la descarga del
   primer tema. La pantalla no se bloquea: bloquear una vuelta de dos minutos contra una
   descarga es cerrar un molinete en una conexión mala.
   > *Revisado el 2026-08-24.* La v1 decía "la ronda no arranca hasta que el `AudioBuffer`
   > esté decodificado". Se relaja a propósito, y con una condición nueva que sí es dura:
   > **si el buffer del tema en juego viene en camino, el motor espera esa descarga antes
   > de caer al repuesto `<audio>`** (deuda 4). Sin esa condición, el jugador rápido pierde
   > el escalón de 100 puntos por un motivo técnico y sin enterarse.
2. **Ventana de precarga: el tema en juego + 2 por adelantado.** Es
   `VENTANA_PRECARGA = 2`. **Nunca se precarga el pozo entero**: puede tener 105 temas y
   eso no cambia un byte de la cuenta de arriba.
3. **Techo de buffers decodificados residentes: 3**, con descarte del menos usado
   (`MAX_BUFFERS = 3`, un `Map` que conserva orden de inserción y renueva el que suena).
   Con la vuelta de 4 temas de hoy, el techo se toca una sola vez y descarta uno.
4. **Presupuesto de red por vuelta: ≤ 1 MB de fragmentos**, y el techo no se mueve aunque
   la duración baje. Una vuelta son 4 temas (`LARGO_RONDA = 4`): con el régimen B,
   4 × 80 KB = **320 KB**; con el A a 10 s, 480 KB; con el A a 15 s, 720 KB. Los tres
   entran, y el más caro de los tres es el que fija el techo. El tope por archivo está en
   `CTR-01.7` y depende del bitrate: no hay un número único que sirva para 64 y para 96.
   > *Revisado el 2026-08-27.* La revisión 4 escribía "si un fragmento se pasa de 210.000
   > bytes, algo se rompió". Ese número es 96 kbps × 15 s más margen: contra un archivo de
   > 64 kbps no mide nada —un fragmento de 26 segundos pasaría—. Ver `CTR-01.7`.
   > *Revisado el 2026-08-24.* La v1 topeaba en 2 MB por "partida de 10 rondas", que era una
   > partida que nunca existió: `D-24` la dejó en cuatro temas.
5. **El tema entero queda fuera de este presupuesto, y no por olvido.** El mp3 completo del
   reveal (`D-22`, ~4 MB a 128 kbps) se sirve con `preload="none"`: cuesta **cero** hasta
   que el jugador toca play, y para entonces la partida ya terminó. **Lo que no puede pasar
   es que se precargue**: eso multiplicaría por cinco el tráfico de una vuelta para algo
   que la mayoría no va a tocar.
6. **El tema en juego se decodifica solo y primero; los dos adelantados pueden ir en
   paralelo.**
   > *Revisado el 2026-08-24.* La v1 decía "se decodifica de a uno". El código espera el
   > del tema en curso y recién después dispara los dos siguientes sin esperarlos. Se
   > acepta y se escribe así: lo que la regla protegía era el camino crítico —que una
   > decodificación adelantada le robe cuadros a la que el jugador está esperando—, y ese
   > orden lo garantiza el `await` del primero. Dos decodificaciones de fondo no son cinco.
7. **`t0`: el origen de las duraciones.** Todas las duraciones del reveal se miden desde la
   primera muestra por encima de **-50 dBFS** dentro de los primeros 300 ms del buffer, no
   desde el byte cero. Existe porque el encoder mete hasta ~25 ms de retardo y porque el
   recorte ya no puede corregirse por tema (`CTR-01.2`). **Hoy no está implementado**:
   deuda 1.
8. **Objetivo, no gate:** desde que se pide un fragmento hasta que puede sonar, ≤ 500 ms en
   4G. `D-09` sacó la velocidad de carga de los no negociables y no vuelve por acá.

---

### CTR-01.6 — Cómo se produce el fragmento

> **Revisado el 2026-08-24 (`T-104`).** La v1 daba dos comandos de `ffmpeg` para correr a
> mano, tema por tema, sobre un máster en WAV guardado en `~/RicotaArcade-masters/` y
> bajado de YouTube (`D-06`). Cambiaron las tres cosas: **`D-23`** dejó la discografía del
> usuario (2,5 GB, calidad de archivo) como material de trabajo en su máquina, así que
> **ese es el máster** y no hay que fabricar ninguno ni bajar nada; y el recorte lo hace
> `scripts/generar-fragmentos.mjs`, que empareja los archivos contra los 105 de `RES-20`
> por la puerta de `D-13`.
>
> **Consecuencia sobre el origen del material, y hay que decirla:** el fragmento ya **no
> sale de YouTube**. Sale de la discografía que el usuario tiene. `CNT-01` sección A
> todavía describe la vía vieja ("se bajan de YouTube con un conversor a mp3 y se recortan
> desde un máster en WAV"); eso es archivo de `contenido` y se le reporta, no se toca acá.

> **Revisado el 2026-08-27 (`FIND-33`): hay un segundo camino, y no reemplaza al primero.**
> `scripts/ingerir-fragmentos.mjs` (PR #8, `D-26`) **no produce audio**: mira qué mp3 hay en
> `public/audio/fragmentos/`, los cruza contra los 105 de `RES-20`, mide la duración
> leyendo los frames del mp3 —sin ffmpeg— y escribe el manifiesto. Existe porque en la
> máquina donde se terminó el juego no hay ffmpeg y los 95 fragmentos ya venían recortados.
> **Es el camino vigente**; el generador es el que puede volver a 15 s.

**Los dos comandos:**

```bash
# Régimen A — produce los mp3 desde los discos del usuario. Necesita ffmpeg.
npm run generar-fragmentos -- "<carpeta con los discos>"
npm run generar-fragmentos -- "<carpeta con los discos>" --enteros
npm run generar-fragmentos -- "<carpeta con los discos>" --rehacer   # pisa lo que ya está

# Régimen B — no produce nada: describe lo que ya está en public/audio/fragmentos/.
npm run ingerir-fragmentos
```

**Los parámetros que fija este contrato**, y que el régimen A tiene que respetar:

| Nivel | Duración | Codificación | Destino |
|---|---|---|---|
| Fragmento | `-t D` (**lee `DURACION_FRAGMENTO_SEG`**, hoy 10) | `libmp3lame`, `-b:a 96k`, `-ar 44100`, `-ac 1`, `-map_metadata -1` | `public/audio/fragmentos/<slug>.mp3` |
| Tema entero (`D-22`) | completo | `libmp3lame`, `-b:a 128k`, `-ar 44100`, `-ac 2`, `-map_metadata -1` | `public/audio/temas/<slug>.mp3` |

**Lo que el régimen B no puede fijar, y hay que decirlo:** los archivos ya existen, así que
el ingestor **no elige** duración, bitrate, canales ni rate — los **acepta**, y lo único
que puede hacer es dejar afuera al que no cumpla. Hoy comprueba que sea MPEG-1 Layer III y
que el slug resuelva contra `RES-20`; **no mira `sample_rate` ni `channels`**, y eso es la
deuda 6. Lo que sí garantiza es lo mismo que el otro: **un mp3 cuyo nombre no sea uno de los
105 no entra al manifiesto**, que es la puerta de `D-13` aplicada al audio.

**Normalización: `loudnorm` a `I=-14:TP=-1:LRA=11`, medido sobre el tema completo — y esto
es del régimen A solamente.** Emparejar volúmenes importa de verdad: si un fragmento entra
al doble de fuerte que el anterior, el paso de 0,1 s deja de ser comparable entre temas, y
al revelar se escucha el salto contra el tema entero. **Los 95 del régimen B no están
normalizados por nadie**: entraron como vinieron. Si hay saltos de volumen entre temas, hoy
no los corrige ninguna herramienta y se detectan escuchando, igual que los 100 ms del paso 1.

> **Defecto encontrado en la revisión 4, y es de producción, no de contrato.** El generador
> corre `-i <tema> -af loudnorm=... -t D <salida>` en **una sola pasada**. Con `-t` en la
> salida, `ffmpeg` deja de leer la entrada apenas completa los `D` segundos: `loudnorm` en
> una pasada es un normalizador **dinámico** y nunca ve el resto del tema. O sea que la
> normalización se hace **sobre los primeros `D` segundos**, que es exactamente lo que la
> v1 advertía que no había que hacer: una intro tranquila se levanta hasta emparejarla con
> un estribillo, se comprime la dinámica y el fragmento queda más fuerte que el mp3 entero
> que suena al revelar.
>
> **Propuesta de corrección para el hilo principal. No bloquea nada y sigue siendo gratis**,
> aunque ya no por el motivo de la revisión 4: entonces no había un solo fragmento
> generado; hoy hay 95, pero **no los produjo el generador** (`D-26`), así que corregir el
> script sigue sin obligar a rehacer nada. Dos pasadas, que es lo que la v1 conseguía con el
> máster intermedio:
>
> ```bash
> # (1) medir sobre el tema entero
> ffmpeg -i "<tema>" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -
> # (2) aplicar la medición y recién ahí recortar
> ffmpeg -i "<tema>" \
>   -af loudnorm=I=-14:TP=-1:LRA=11:measured_I=<I>:measured_TP=<TP>:measured_LRA=<LRA>:measured_thresh=<thresh>:offset=<offset>:linear=true \
>   -t <D, hoy 10> -codec:a libmp3lame -b:a 96k -ar 44100 -ac 1 -map_metadata -1 \
>   "public/audio/fragmentos/<slug>.mp3"
> ```
>
> *Alternativa descartada:* dejar la pasada única y aceptar el resultado. Se descarta
> porque el defecto se oye —y se oye peor justo en los temas de intro tranquila, que son
> los más lindos de adivinar en 0,1 s— y porque el arreglo cuesta una invocación más de
> `ffmpeg` por tema en un script que ya corre `ffprobe` por tema.
>
> *Alternativa descartada:* volver al máster WAV intermedio de la v1. Se descarta porque
> duplica en disco 7,2 horas de audio para nada: `D-23` ya garantiza que el material de
> origen está en la máquina y no se pierde.

---

### CTR-01.7 — Verificación de un fragmento

**Ya no es un pendiente, y desde el 2026-08-27 tampoco es una sola.** La v1 dejaba pedido un
`scripts/validar_fragmentos.py` que nunca se escribió; la verificación vive **adentro de los
productores**, y cada régimen comprueba lo que puede: el A, las cinco condiciones con
`ffprobe`; el B, **la primera** —que sea un MPEG-1 Layer III legible— y nada más: **mide**
la duración y la escribe, pero quien la hace cumplir es el build y el comando (1) de
`CTR-03.10`, y los criterios 2, 3 y 5 no los mira nadie (deuda 6). Suelta, sobre un archivo
cualquiera y **solo si hay ffmpeg** —hoy no lo hay, ver el comando sin ffmpeg más abajo—:

```bash
ffprobe -v error \
  -show_entries stream=codec_name,sample_rate,channels \
  -show_entries format=duration,size \
  -of default=nw=1 "public/audio/fragmentos/todo-un-palo.mp3"
```

Un fragmento **pasa** si cumple las cinco:

| # | Criterio | Valor esperado (`D = 10`) | Quién lo comprueba hoy |
|---|---|---|---|
| 1 | `codec_name` | `mp3` | régimen A con `ffprobe` · régimen B leyendo el header del frame |
| 2 | `sample_rate` | `44100` | **solo el régimen A** — el ingestor no lo mira (deuda 6) |
| 3 | `channels` | `1` — **sin la excepción de estéreo** | **solo el régimen A** — ídem (deuda 6) |
| 4 | `duration` | **`9.90` a `10.15`** (malla fina) · el manifiesto acepta hasta `10.40` | régimen A con su malla fina · en el B **la mide el ingestor y la hacen cumplir el build y el comando (1) de `CTR-03.10`** |
| 5 | `size` | ≤ `(bitrate ÷ 8) × techo de la ventana × 1,15` | **solo el régimen A**, con `TOPE_BYTES` — ver el recuadro de abajo antes de darle importancia |

**El tope de peso ya no es un literal, y el motivo es que hay dos bitrates.** La regla:

| Bitrate | Cuenta (`D = 10`, techo 10,40 s) | Tope | Lo que pesan los reales |
|---|---|---|---|
| 96 kbps (régimen A) | 12.000 B/s × 10,40 × 1,15 | **≈ 145.000 bytes** | — |
| 64 kbps (régimen B) | 8.000 B/s × 10,40 × 1,15 | **≈ 96.000 bytes** | **≈ 80 KB** los 95 |
| 96 kbps con `D = 15` | 12.000 B/s × 15,40 × 1,15 | ≈ 210.000 bytes | — |

**Por qué un tope único no sirve:** 210.000 bytes contra un archivo de 64 kbps deja pasar
**26 segundos** de audio. El tope tiene que salir del bitrate del archivo que estás
mirando, no del que el contrato prefiere.

> **Y por qué igual no hay que correr a cambiar `TOPE_BYTES = 210_000` en el generador.**
> Mientras el archivo sea **CBR** —y las dos vías lo son— **el peso y la duración son
> proporcionales**: la ventana de duración ya acota el peso, y el tope de bytes es una red
> de seguridad para el VBR y para el archivo corrupto. El 210.000 que el generador tiene
> escrito quedó dimensionado para 15 s: hoy es flojo, no es falso, y no deja pasar nada que
> la malla de duración no atrape primero. Se deja como está a propósito, para no tocar
> código por un número que no manda (`D-12`). **El que atrapa un archivo inflado es el
> criterio 4, no el 5.**

**Los criterios 2 y 3 en el régimen B, sin ffmpeg.** Los 95 del PR #8 se declararon mono y
el ingestor no lo verifica. Esto lee el primer frame de cada mp3 y agrupa lo que encuentra
—no toca ningún archivo, solo mira—. Lo corre `revisor` o el hilo principal (`D-12`):

```bash
node -e "import('node:fs').then(({readdirSync,readFileSync})=>{const R=[44100,48000,32000],M=['estereo','joint','dual','mono'],B=[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320];const d='public/audio/fragmentos';const c=new Map();for(const f of readdirSync(d).filter(x=>x.endsWith('.mp3'))){const b=readFileSync(d+'/'+f);let i=0;for(;i<Math.min(b.length-4,4096);i++){if(b[i]===0xff&&(b[i+1]&0xe0)===0xe0&&((b[i+1]>>3)&3)===3&&((b[i+1]>>1)&3)===1&&B[(b[i+2]>>4)&15])break;}const k=B[(b[i+2]>>4)&15]+' kbps · '+R[(b[i+2]>>2)&3]+' Hz · '+M[(b[i+3]>>6)&3];c.set(k,(c.get(k)??0)+1);}for(const [k,n] of c)console.log(n+' archivos: '+k)})"
```

**Lo que este contrato espera que imprima:** `95 archivos: 64 kbps · 44100 Hz · mono`. **Si
sale otra cosa, no se toca ni un archivo:** se anota acá como hallazgo y se decide, porque
un rate de 48.000 o un estéreo encubierto cambian el presupuesto de `CTR-01.5` (y el
estéreo lo duplica). El contrato no afirma hoy ese resultado — lo declara pendiente en la
deuda 6, que es distinto de darlo por bueno.

**Y la que ninguna herramienta hace por vos:** escuchá los primeros 100 ms de tres o cuatro
fragmentos. Si no se oye nada, ese tema arranca con silencio. El generador lo imprime como
recordatorio al terminar, que es lo máximo que una máquina puede hacer con esta condición.
Con los 95 del régimen B **no consta que ese chequeo se haya hecho**: el ingestor no lo
imprime y el recorte fue anterior a esta revisión. Cuatro fragmentos y treinta segundos lo
saldan.

---

### CTR-01.8 — Cómo se describen los fragmentos en los datos — **v2**

> **Reescrita el 2026-08-24 (`T-104`).** La v1 declaraba un objeto `fragmento` de siete
> campos —`archivo`, `duracionSeg`, `inicioEnTemaSeg`, `canales`, `origen`, `fechaCorte` y
> un `credito` obligatorio con tema, disco y año— que vivía adentro de cada ítem del banco
> de `CTR-03`. **Ese banco ya no existe** (`D-24`): no hay ítems, hay una lista de archivos.

**La entrada del manifiesto, entera:**

```json
{ "slug": "todo-un-palo", "titulo": "Todo un palo", "duracionSeg": 10.06, "entero": false }
```

*(Esa entrada es real: está tal cual en `src/data/adivinar-tema.json`. Con el régimen de
15 s decía `15.02`, y volvería a decir algo así el día que se regenere.)*

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| `slug` | string, patrón de `CTR-01.4` | sí | Sin extensión y sin ruta. El motor arma la URL. Tiene que resolver contra uno de los 105 de `RES-20` o el build falla. |
| `titulo` | string | sí | El título tal como lo escribe `RES-20`. **No lo lee el juego**: está para que el manifiesto y el mapa de derechos de `CTR-03.6` se lean sin cruzar dos archivos. |
| `duracionSeg` | number, ventana de `CTR-01.3` | sí | La duración **medida**, no la pedida: con `ffprobe` en el régimen A, con los frames del mp3 en el B. Dos decimales. |
| `entero` | boolean | sí | `true` si además existe `public/audio/temas/<slug>.mp3` (`D-22`, `D-23`). Marca una superficie de derechos mayor. |

**El crédito ya no es un campo: se deriva en build, y eso es más fuerte, no más débil.**
`CNT-01` exige crédito visible junto a cada fragmento —tema, disco y año como mínimo— y la
v1 lo garantizaba haciendo el campo obligatorio en el JSON. Ahora lo garantiza la
construcción: `catalogo()` toma el slug, lo resuelve contra los 105 temas de `RES-20` y
saca de ahí el título, el disco y la pista, más el año de la ficha del disco. Tres
consecuencias:

1. **No existe un fragmento sin crédito.** Un archivo cuyo slug no resuelve no llega a la
   pantalla: rompe el build con el nombre del archivo culpable. La v1 dependía de que
   nadie olvidara un campo; la v2 no tiene el campo que olvidar.
2. **No existe una segunda copia del título que pueda contradecir a la ficha.** Es la
   propiedad que `CTR-03.3` buscaba, llevada hasta el final: el `titulo` del manifiesto es
   documentación, y si difiere de `RES-20` el que manda es `RES-20`, que es de donde el
   juego lee.
3. **La pantalla ya lo muestra.** Al revelar, el juego imprime título, disco, año y pista.
   Cuándo se muestra —solo al revelar— es de `experiencia`.

**Lo que se perdió, dicho sin adornos:** `origen` y `fechaCorte` eran datos **por archivo**
y ahora son **por corrida**. La fecha es el campo `actualizado` del manifiesto, que el
script escribe con la fecha de la corrida. Si algún día un fragmento suelto viniera de otro
lado, hay que volver a ponerle `origen` a la entrada — y ahí es una fila más en el script.

> **Revisado el 2026-08-27 (`FIND-33`): "el origen es uno solo" dejó de ser cierto, y el
> campo sigue sin volver.** La revisión 4 podía decir que el origen era la discografía del
> usuario (`D-23`) y punto. Desde `D-26` hay **dos**: los 95 de hoy vienen recortados a mano
> por la vía del PR #8. **No se agrega `origen` por entrada igual**, porque hoy vuelve a
> valer lo mismo por otro camino: **el origen es uno solo por corrida**, el script que la
> escribió lo sabe, y quedó dicho en el campo `nota` del manifiesto —que nombra a los dos
> scripts— y en `CTR-01.6`. El campo volvería recién el día que una **misma** corrida mezcle
> archivos de las dos vías, y ese día se declara acá primero.
*Alternativa descartada:* conservar los dos campos igual, escritos por el generador. Se
descarta porque serían idénticos en las 104 entradas y un dato que nunca varía no informa:
informa el que lo escribió, y ese es `D-23`.

---

### CTR-01.9 — La escalera del reveal: **seis pasos**, de 0,1 a `D` segundos (hoy 10)

> **Reescrita el 2026-08-24 (`T-104`).** La v1 fijaba **cinco** pasos —0,1 / 0,5 / 2,0 /
> 5,0 / 10,0— derivados de un máximo de 10 s. `D-24` fijó seis, con el juego de referencia
> medido a mano (`HILO-mapa-del-juego-de-referencia.md`, seis pulsaciones y la etiqueta
> leída después de cada una). El código ya corre así desde el 2026-08-23, en
> `src/lib/tema/escalera.ts`, con la tabla escrita a mano en `escalera.test.ts`. **Esta
> sección deja de contradecirlo: ese test ya no es una tabla huérfana.**

| Paso | Duración | Con `D = 15` | Qué llega a escucharse |
|---|---|---|---|
| 1 | **0,1 s** | 0,1 s | Un golpe. Un acorde, un redoblante, el arranque de un riff. Solo el que se lo sabe de memoria. |
| 2 | **0,5 s** | 0,5 s | Timbre y ataque: se distingue guitarra de teclado y cómo suena la grabación. |
| 3 | **2 s** | 2 s | Una figura rítmica o melódica entera. Acá se reconoce un riff conocido. |
| 4 | **4 s** | 4 s | Una frase musical completa. Normalmente toda la intro. |
| 5 | **8 s** | 8 s | La intro y lo que sigue. En la mayoría ya entró la voz. |
| 6 | **10 s** (`D-26`) | 15 s | El fragmento entero (`CTR-01.3`). **Es el único paso que se mueve con `D`.** |

> **Revisado el 2026-08-27 (`FIND-33`): el paso 6 baja de 15 a 10, y los cinco de arriba no
> se tocan.** `D-26` lo decidió el 2026-08-26 con los 95 fragmentos de 10,06 s en disco. El
> código ya estaba así —`escalera.ts` y su test citan `D-26` desde ese día—; el que
> contradecía era este documento, y eso es lo que `FIND-33` vino a marcar.
>
> **La propiedad dura de la escalera se conserva. La blanda no.** Los saltos nuevos son
> `×5 · ×4 · ×2 · ×2 · ×1,25`: **siguen siendo no crecientes**, que es la regla que este
> contrato declaró innegociable —si un salto fuera mayor que el anterior, el escalón más
> caro regalaría más que el barato—. Lo que se pierde es lo que `D-24` había buscado y
> `D-26` da por perdido de frente: **el último ya no duplica**. De 8 a 10 hay 2 segundos
> nuevos; de 8 a 15 había 7.
>
> **Y hay una consecuencia visible que conviene ver escrita, porque no está en ningún
> número:** la barra de seis tramos dibuja **lo que agrega** cada paso, así que con `D = 10`
> los anchos son `1% · 4% · 15% · 20% · 40% · 20%` — **el tramo más ancho pasa a ser el 5, no
> el 6**. Con `D = 15` eran `0,7% · 2,7% · 10% · 13,3% · 26,7% · 46,7%` y la barra
> culminaba. `anchosDeTramos()` lo calcula solo y no hay nada que arreglar en el código; lo
> que cambia es **cómo se lee** la barra. Si eso pide un ajuste de dibujo, es de
> `experiencia` (`UX-04`) y no lo decide este contrato: acá queda anotado el hecho.

**El puntaje no es de este contrato.** Es de `producto` (`BR-02`, reescrita en `T-99`).
`D-24` lo dejó provisorio en 100 · 80 · 60 · 40 · 20 · 10, con cero solo por no sacarla, y
`escalera.ts` guarda los dos números juntos porque el motor los necesita juntos. **Si la
tabla de puntaje cambia, cambia ese archivo y no cambia este.**

**La mecánica tampoco es de este contrato, pero lo condiciona:** con `D-24`, cada error o
cada `Pasá` abre el escalón siguiente. Seis escalones, seis intentos. Lo que eso le exige
al audio es lo único que me toca: **los seis pasos salen del mismo `AudioBuffer`**, el
motor reproduce `[0, segundos del paso]`, y por eso seis pasos cuestan lo mismo que uno.
Si `producto` quisiera ocho, el costo de audio seguiría siendo el mismo.

**Por qué esta curva.** Los saltos son ×5, ×4, ×2, ×2 y **×1,25** (eran ×1,875 con `D = 15`):
**una escalera que duplica desde el paso 3 y se achata en el último**. Hasta el paso 5, cada
escalón da el doble de lo que había, así que la sensación de "me están dando más" no se
apaga; el sexto ya no. En incrementos crudos agrega 0,4 / 1,5 / 2 / 4 / **2** segundos —con
`D = 15` eran 0,4 / 1,5 / 2 / 4 / 7—, así que **la propiedad de "cada tramo entrega más
audio nuevo que el anterior" se cumple hasta el paso 5 y se cae en el 6**. La barra sigue
dibujando lo que **agrega** cada paso y no su duración total: eso no cambia, cambia el
dibujo que sale.

**La propiedad que justificaba la escalera vieja se conserva, y conviene verlo escrito.**
La v1 exigía que ningún salto fuera mayor que el anterior —si no, el escalón más caro
regala más que el barato—. Los saltos son `5 ≥ 4 ≥ 2 ≥ 2 ≥ 1,25`: **no crecientes**, con
`D = 10` y con `D = 15`. La escalera de seis no rompe la regla de la de cinco; lo que rompe
es la fórmula `paso 4 = M × 0,5`, que queda retirada.

**Regla de recálculo si el máximo cambia a `M` (nueva, para seis pasos):**

- Pasos 1 a 5 —0,1 / 0,5 / 2 / 4 / 8— **no cambian**.
- Paso 6 = `M`.
- **Rango válido: `10,0 s ≤ M ≤ 16,0 s`.** El techo sale del chequeo de saltos no
  crecientes: `M/8 ≤ 2` exige `M ≤ 16`. El piso es de utilidad: con `M < 10` el último
  escalón agrega menos de un cuarto de audio nuevo y deja de ser un escalón.

> **`D-26` no ensanchó esta regla: la usó en su extremo.** El rango lo escribió la revisión
> 4, cuando `M` valía 15 y nadie sospechaba de los 10. Que dos días después el material real
> obligara a `M = 10` y **el 10 ya estuviera adentro del rango** es la mejor noticia que
> tiene esta sección: la regla aguantó su primer cambio sin retocarse.
>
> **Pero está en el borde, y el borde tiene sentido literal.** Con `M = 10` el paso 6 agrega
> 2 s sobre los 8 que ya había: **exactamente un cuarto**, que es el punto donde este
> contrato ya decía "debajo de acá deja de ser un escalón". Está adentro por nada. **Ese
> "por nada" es el argumento escrito para regenerar a 15 el día que aparezca ffmpeg** — no
> el que suene mejor ni el que dure más, sino que el escalón más caro del juego vuelva a
> pagar lo que promete. Mientras tanto paga poco, y `D-26` prefiere que pague poco y de
> verdad antes que mucho y en silencio.
- **Si `M` cae fuera del rango, la que se toca es la cantidad de pasos, y eso es de
  `producto`** (`BR-02`). Con `M = 8` sobra un escalón; con `M = 20` el último regala más
  que los cinco anteriores juntos.
- **Chequeo obligatorio, una línea de aritmética:** cada salto menor o igual al anterior.
  Si no da, la escalera se rediseña entera; no se parchea moviendo el último.

**Alternativas descartadas al bajar a 10 (2026-08-27, sobre `D-26`):**

- **Dejar el paso 6 en 15 y que el motor recorte solo.** Era lo más barato: `audio.ts` hace
  `Math.min(segundos, DURACION_FRAGMENTO_SEG)`, así que un paso de 15 sobre un archivo de 10
  **no falla, no avisa y suena 10**. Se descarta justamente por eso: la etiqueta diría
  "15 s", el jugador gastaría el escalón más caro y recibiría lo mismo que en el anterior.
  Es un rótulo que miente sobre lo que hay adentro, que es la única cosa que este proyecto
  no negocia (`D-14`). **Y ni siquiera era posible:** `indexarFragmentos()` rechaza el
  manifiesto entero antes de que el motor llegue a recortar nada.
- **Bajar solo `DURACION_FRAGMENTO_SEG` y dejar la escalera en 15.** Misma mentira con dos
  archivos en vez de uno, y el build igual se cae.
- **Dejar afuera del pozo a los fragmentos de 10 y esperar los de 15.** El juego se quedaba
  con cero temas jugables por tiempo indefinido, esperando ffmpeg. `US-02` pide 30.
- **Quitar el sexto paso y volver a cinco** (0,1 / 0,5 / 2 / 4 / 10). Defendible en
  aritmética —el salto ×2,5 sigue siendo no creciente— pero la cantidad de pasos es de
  `producto` (`BR-02`) y son también los intentos por tema: cambiarla de acá sería decidir
  por otro rol una mecánica que el usuario fijó mirando el juego de referencia.

**Alternativas descartadas al fijar los seis pasos (2026-08-24, siguen valiendo):**

- **Quedarse en cinco pasos y estirar el último a 15 s** (0,1 / 0,5 / 2 / 5 / 15). Se
  descarta: el salto final sería ×3 contra un ×2,5 anterior, o sea acelerando justo en el
  escalón que más pesa, y contradice `D-24`, que fijó seis con el juego a la vista.
- **Escalera lineal (2,5 / 5 / 7,5 / 10 / 12,5 / 15).** Se descarta: a los 2,5 s se
  reconoce casi cualquier tema y los escalones caros no los usaría nadie.
- **Escalera puramente geométrica desde 0,1** (0,1 / 0,29 / 0,84 / 2,4 / 7 / 20). Mismos
  escalones útiles con números que nadie puede leer en una etiqueta.
- **Derivar los pasos de recortes distintos**, uno por escalón. Se descarta por lo obvio:
  seis archivos por tema, seis veces la red, y ninguna ventaja.

**Lo que el motor tiene que garantizar en el paso 1:** que los 100 ms sean 100 ms de
música. Hoy se miden desde el byte cero del archivo (deuda 1).

---

### Lo que el código todavía no cumple — seis deudas declaradas

No están acá para que alguien las descubra tarde. Ninguna bloquea: el juego se juega.
`arquitectura` no implementa (`D-12`); esto es lo que le queda pedido al hilo principal, en
orden de lo que más se nota.

| # | Deuda | Qué exige el contrato | Qué hace el código | Se nota como | Costo |
|---|---|---|---|---|---|
| 1 | **`t0`** (`CTR-01.5`, regla 7) | Medir desde la primera muestra sobre -50 dBFS | Reproduce `[0, segundos]` desde el byte cero | El paso 1 puede ser silencio en un tema de arranque suave, y se gasta un intento | Detectar `t0` al decodificar y pasarlo como `offset` en `start()` |
| 2 | **Fade-out al cortar** (`CTR-01.1`) | `mín(15 ms, 10 % del paso)` para evitar el click | Corta en seco al final de cada paso | Un chasquido al final de cada escucha, seis por tema | Un `GainNode` con rampa antes del corte |
| 3 | **`loudnorm` de dos pasadas** (`CTR-01.6`) | Medir sobre el tema completo | Régimen A: mide sobre los primeros `D` s, en pasada única. **Régimen B: no normaliza nada** | Intros tranquilas infladas (A); saltos de volumen entre temas (B) | Una invocación más de `ffmpeg` por tema, en el generador. En el B no tiene arreglo sin ffmpeg |
| 4 | **Esperar la descarga en vuelo** (`CTR-01.5`, regla 1) | No caer al repuesto mientras el buffer viene en camino | Si no hay buffer, va derecho a `<audio>` | El paso 1 impreciso en el primer tema si el jugador es rápido | En `sonar()`, esperar la promesa de `enVuelo` para ese slug |
| 5 | **El docblock de `generar-fragmentos.mjs`** (`CTR-01.6`) | Que el script diga lo que hace | Su cabecera dice "15 s" y "**Lo único que cambia es la duración: 15 s en vez de 10**", pero el código importa `DURACION_FRAGMENTO_SEG`: hoy generaría **10 s** | El próximo que lo lea va a creer que el script contradice a `D-26`, y puede "arreglarlo" poniéndole un 15 a mano | Dos líneas de comentario. **No se toca la aritmética: leer la constante es lo correcto** |
| 6 | **`sample_rate` y `channels` sin verificar en el régimen B** (`CTR-01.7`, criterios 2 y 3) | 44.100 Hz y mono | `ingerir-fragmentos.mjs` solo comprueba MPEG-1 Layer III y saca el bitrate | Un archivo a 48 kHz o en estéreo entra al sitio sin que nadie lo note, y el estéreo **duplica** el presupuesto de RAM | El comando de `CTR-01.7`, o cuatro líneas en el ingestor leyendo el mismo header que ya lee |

**La 3 sigue siendo la más barata de pagar hoy y la más cara mañana:** los 95 fragmentos que
hay **no los produjo el generador**, así que arreglarlo ahora no obliga a re-exportar nada.

**La 5 y la 6 son de esta revisión**, y las dos salieron de leer los dos scripts uno al lado
del otro para escribir la tabla de regímenes. Ninguna bloquea: el juego se juega con los 95.

---

### Consecuencias

- **El contrato y el juego vuelven a decir lo mismo, que es lo que `FIND-33` pedía.** Entre
  el 2026-08-26 y hoy el código estuvo bien y el documento mal: `escalera.ts` seguía `D-26`
  y acá seguía escrito 15. La tabla escrita a mano en `escalera.test.ts` es la verificación
  de que el código sigue al contrato, que es su lugar correcto.
- **El presupuesto que le impone al motor:** 3 buffers residentes (**≤ 6,0 MB** de RAM en
  el caso peor, contra los 8,6 MB de la revisión 4), ventana de 2 adelantados, ≤ 1 MB de
  fragmentos por vuelta —hoy se usan **320 KB**—, el tema entero con `preload="none"`, y el
  buffer del tema en curso decodificado antes que cualquier otro.
- **Lo que le impone al que produce el audio:** por el régimen A, una carpeta con los discos
  y un comando; por el B, dejar los mp3 en `public/audio/fragmentos/` con el nombre correcto
  y correr el ingestor. El emparejamiento contra `RES-20` es la única puerta en los dos, y
  lo que no empareja no entra al manifiesto.
- **Lo que este contrato deja abierto y no es suyo:** hoy hay **95 fragmentos y ningún tema
  entero** en disco. La promesa de `D-22` —que el sitio sirva el tema completo al revelar—
  no está cumplida en el material, y eso no lo cierra `arquitectura`: el contrato ya tiene
  el nivel 2 escrito y el booleano que lo declara.
- **Lo que le impone a `experiencia`:** el crédito —título, disco, año— tiene lugar en la
  pantalla del reveal y ya está; y la barra de seis tramos dibuja lo que **agrega** cada
  paso. Nada nuevo en esta revisión.
- **Difícil de revertir:** el formato. 104 archivos en mp3 son 104 archivos. Se sigue
  eligiendo el formato aburrido y compatible antes que el eficiente.
- **Fácil de revertir:** la duración y la escalera. Una constante, una regla de recálculo y
  una corrida del generador. El material de origen no se toca nunca. **`D-26` lo demostró
  en la práctica:** el cambio de 15 a 10 fueron dos líneas de `escalera.ts`, una fila de su
  test y ningún dato migrado. Volver a 15 cuesta lo mismo más ffmpeg, y el paso a paso está
  en `CTR-01.3`.
- **Lo que este contrato no resuelve:** si Spotify se queda como enlace externo al revelar
  o se retira del todo. Es de `ADR-01`, sigue abierto, y hoy el código no lo usa — que es
  la opción conservadora.

---

### Cómo se verifica que el contrato y el código dicen lo mismo

`arquitectura` no tiene con qué correr esto (`D-12`). **Lo corre el hilo principal o
`revisor`.** Las tres primeras líneas comparan **los números de este documento** contra el
código; no son el test del código contra sí mismo.

```bash
# (1) CTR-01.3 y CTR-01.9: los seis pasos, los 10 s de D-26 y los seis intentos
#     (con fragmentos de 15 s, la lista termina en 15 y la constante vale 15)
node -e "import('./src/lib/tema/escalera.ts').then(m=>{const c=[0.1,0.5,2,4,8,10];const v=m.ESCALERA.map(p=>p.segundos);const ok=JSON.stringify(v)===JSON.stringify(c)&&m.DURACION_FRAGMENTO_SEG===10&&m.INTENTOS===6;console.log(ok?'OK CTR-01.3/.9 = codigo':'DESALINEADO: '+JSON.stringify(v)+' / '+m.DURACION_FRAGMENTO_SEG+' / '+m.INTENTOS)})"

# (1b) la atadura que D-26 no puede romper: el paso 6 nunca pide mas que el fragmento
node -e "import('./src/lib/tema/escalera.ts').then(m=>{const u=m.ESCALERA[m.ESCALERA.length-1].segundos;console.log(u<=m.DURACION_FRAGMENTO_SEG?'OK el paso 6 ('+u+' s) entra en el fragmento ('+m.DURACION_FRAGMENTO_SEG+' s)':'DESALINEADO: el paso 6 pide '+u+' s y el fragmento dura '+m.DURACION_FRAGMENTO_SEG)})"

# (2) CTR-01.5 y CTR-01.7: las cuatro constantes del presupuesto y el tope de peso
#     TOPE_BYTES sigue en 210.000 a proposito: ver el recuadro de CTR-01.7
node -e "import('node:fs').then(({readFileSync})=>{const a=readFileSync('src/lib/tema/audio.ts','utf8'),p=readFileSync('src/scripts/partida-tema.ts','utf8'),g=readFileSync('scripts/generar-fragmentos.mjs','utf8');const c=[[/MAX_BUFFERS = 3\b/,'3 buffers'],[/VENTANA_PRECARGA = 2\b/,'ventana 2'],[/LARGO_RONDA = 4\b/,'vuelta de 4'],[/TOPE_BYTES = 210_000/,'tope 210000'],[/'-b:a', '96k'/,'96 kbps'],[/'-ac', '1'/,'mono']];const s=a+p+g;const mal=c.filter(([r])=>!r.test(s)).map(([,n])=>n);console.log(mal.length?'DESALINEADO: '+mal.join(', '):'OK CTR-01.5/.6/.7 = codigo')})"

# (3) CTR-01.4: el patron de slug del contrato es el que produce el codigo
node -e "Promise.all([import('./src/lib/texto.ts')]).then(([t])=>{const p=/^[a-z0-9]+(-[a-z0-9]+)*$/;const casos=['Todo un palo','Un poco de amor frances','Jijiji'];const mal=casos.filter(c=>!p.test(t.slugDeTitulo(c)));console.log(mal.length?'DESALINEADO: '+mal.join(', '):'OK CTR-01.4 = codigo')})"

# (4) la escalera y el cruce del manifiesto contra los 105, con los tests que ya existen
node --test src/lib/tema/escalera.test.ts src/lib/tema/catalogo.test.ts

# (5) un archivo suelto contra la tabla de CTR-01.7 — necesita ffmpeg, que hoy no esta
ffprobe -v error -show_entries stream=codec_name,sample_rate,channels -show_entries format=duration,size -of default=nw=1 "public/audio/fragmentos/todo-un-palo.mp3"

# (6) lo mismo SIN ffmpeg, sobre los 95: bitrate, rate y canales del primer frame
#     Esperado por este contrato: "95 archivos: 64 kbps · 44100 Hz · mono" (deuda 6)
node -e "import('node:fs').then(({readdirSync,readFileSync})=>{const R=[44100,48000,32000],M=['estereo','joint','dual','mono'],B=[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320];const d='public/audio/fragmentos';const c=new Map();for(const f of readdirSync(d).filter(x=>x.endsWith('.mp3'))){const b=readFileSync(d+'/'+f);let i=0;for(;i<Math.min(b.length-4,4096);i++){if(b[i]===0xff&&(b[i+1]&0xe0)===0xe0&&((b[i+1]>>3)&3)===3&&((b[i+1]>>1)&3)===1&&B[(b[i+2]>>4)&15])break;}const k=B[(b[i+2]>>4)&15]+' kbps · '+R[(b[i+2]>>2)&3]+' Hz · '+M[(b[i+3]>>6)&3];c.set(k,(c.get(k)??0)+1);}for(const [k,n] of c)console.log(n+' archivos: '+k)})"
```

**Qué no verifica ninguna máquina:** que los primeros 100 ms suenen (oído), que los
fragmentos del régimen B estén parejos de volumen entre sí (oído, y sin herramienta que lo
arregle), que el de 64 kbps no suene a teléfono en el paso 1 (oído — y si suena, eso es
motivo para regenerar), y que el techo editorial de `CNT-01` siga siendo el que `contenido`
quiere. **Los 10,0 s de hoy están debajo de ese techo**, así que ninguna de las dos cosas se
pisa.
