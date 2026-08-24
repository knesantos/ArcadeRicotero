# ARQ — Fragmento de audio: formato, nombre, lugar y presupuesto

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `D-02`, `D-03`, `D-06`, `D-09`,
> `D-14`, `D-22`, `D-23`, `D-24`, `US-02`, `BR-02`, `RES-03`, `RES-20`,
> `CNT-01` (sección A, revisión 2026-08-24), `.claude/rules/codigo-juegos.md`,
> `Docs/SUGERENCIAS/HILO-para-arquitectura-escalera-de-seis-y-modo-buscador.md`,
> `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`.
> Produce: **`CTR-01` v2**.
> Última actualización: **2026-08-24 (revisión 4, `T-104` del ciclo 7)**.

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

---

## Qué cambió en esta revisión, en una tabla

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

Lo que **no** cambió: mp3, 44.100 Hz, mono, 96 kbps CBR, sin metadatos, sin fades en el
archivo, `public/audio/fragmentos/<slug>.mp3`, y el principio de que los datos guardan el
slug y nunca la ruta.

---

## CTR-01 — Contrato del fragmento de audio del reveal progresivo

- **Fecha de esta versión:** 2026-08-24 · **v2**
- **Estado:** **vigente, sin números abiertos, y ahora describe un juego construido.**
  `US-02` está jugable; lo que este documento hace es dejar de contradecirlo y fijar los
  cuatro números que el hilo principal calculó a mano mientras lo construía.
- **Para quién es:** para el generador (`scripts/generar-fragmentos.mjs`), para el motor
  de audio (`src/lib/tema/audio.ts`) y para quien produzca los archivos desde su máquina.
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
| Bitrate | **96 kbps CBR** | Mono a 96 kbps suena bien, y CBR permite calcular el presupuesto con una regla de tres. |
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
- **WAV sin comprimir** — 15 s en mono a 44,1 kHz / 16 bits son ~1,3 MB por tema. Con 104
  temas es un repositorio de 135 MB para nada.

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

### CTR-01.3 — Duración máxima — **cerrada en 15,0 s**

- **Duración objetivo: 15,0 segundos.**
- **Ventana de validación del archivo: 14,90 s a 15,15 s.** Un MP3 no dura lo que uno le
  pide: la trama son 1.152 muestras (≈ 26,1 ms) y el encoder agrega padding, así que el
  archivo se pasa o se queda corto por unas décimas. Un archivo de 15,04 s **está bien**,
  no lo vuelvas a exportar.
- **Malla más ancha en el build: ≥ 14,85 s.** `indexarFragmentos()` rechaza un fragmento
  que le devolvería silencio al último escalón, y usa un piso más flojo que el del
  generador. No es una incoherencia: son dos mallas con dos trabajos distintos. La fina es
  la de producción (`CTR-01.7`); la ancha es la que impide que el sitio publique un
  fragmento inservible aunque lo haya generado otra herramienta.
- **Si un tema del catálogo dura menos que la escalera**, su fragmento no valida, no se
  genera y ese tema no entra al pozo. Sigue apareciendo en el buscador, porque el buscador
  ofrece los 105 (`CTR-03.3`).

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

**Qué pasa si el número vuelve a moverse.** Cambia esto, la escalera de `CTR-01.9` por su
regla de recálculo, los dos literales de tolerancia de `CTR-01.7` y la constante
`DURACION_FRAGMENTO_SEG` de `src/lib/tema/escalera.ts`. **Ningún dato migra**: los seis
pasos salen del mismo archivo y el manifiesto se regenera con un comando. El material de
origen vive en la máquina del usuario (`D-23`), así que re-exportar los 104 es una corrida
del generador, no volver a conseguir cien temas.

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
  fragmento son 15 s, el entero es la grabación completa. El manifiesto los distingue con
  el booleano `entero`, y ese booleano es el mapa de `CTR-03.6`.

**Alternativa descartada** (de la v1, sigue valiendo): IDs numéricos (`trk-001.mp3`).
Con slug, un archivo mal emparejado se nota leyendo la carpeta; con números hace falta una
planilla, y la planilla es un segundo lugar donde el nombre puede mentir.

---

### CTR-01.5 — Presupuesto de precarga — **recalculado sobre 15 s**

El paso de 0,1 s tiene que ser honesto: cuando el jugador toca, suena. Eso no se consigue
optimizando la descarga, se consigue teniendo el buffer decodificado antes.

> **Revisado el 2026-08-24 (`T-104`).** La v1 calculaba sobre 10,0 s: 120 KB por archivo,
> 1,8 MB por buffer, 5,3 MB residentes, 2 MB de red por partida de 10 rondas. El hilo
> principal recalculó a mano ~2,6 MB por buffer y ~8 MB de ventana, y construyó con eso.
> **Se confirma esa cuenta y se le agrega el caso peor que faltaba** — el rate del
> `AudioContext`, que la v1 mencionaba en `CTR-01.1` y después no usaba en la aritmética.

**Las cuentas, con el caso peor escrito:**

| Concepto | Cuenta | Total |
|---|---|---|
| Archivo MP3 (15 s, mono, 96 kbps) | 12 KB/s × 15 s | **≈ 180 KB** |
| `AudioBuffer` con `AudioContext` a 44,1 kHz | 15 × 44.100 × 4 bytes (Float32) × 1 canal | **≈ 2,6 MB** |
| `AudioBuffer` con `AudioContext` a **48 kHz** | 15 × 48.000 × 4 × 1 | **≈ 2,9 MB** |
| 3 buffers residentes, caso normal | 3 × 2,6 MB | **≈ 7,9 MB** |
| 3 buffers residentes, **caso peor** | 3 × 2,9 MB | **≈ 8,6 MB** |
| Si no se descartara nada: 20 buffers | 20 × 2,9 MB | ≈ 58 MB — **inaceptable en gama baja** |

**Por qué aparece el caso peor y por qué es el número que manda.** `decodeAudioData`
devuelve el buffer al **rate del `AudioContext`**, no al del archivo. En una parte de los
celulares ese rate es 48 kHz, así que el mismo mp3 de 44,1 kHz ocupa un 9 % más de RAM del
que dice la cuenta ingenua. El techo del contrato es **8,6 MB**, no 7,9. Sigue entrando de
sobra en un celular de gama baja, y por eso el reveal de 0,1 s puede prometer que suena.

**El costo real de la precarga es la RAM, no la red:** un fragmento pesa 180 KB en la red y
2,9 MB en memoria, dieciséis veces más. Esa proporción no depende de la duración: depende
de que el mp3 comprima y el `AudioBuffer` no.

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
4. **Presupuesto de red por vuelta: ≤ 1 MB de fragmentos.** Una vuelta son 4 temas
   (`LARGO_RONDA = 4`): 4 × 180 KB = **720 KB**, con margen para una quinta. Si un
   fragmento se pasa de **210.000 bytes**, algo se rompió en la exportación.
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

**El comando:**

```bash
npm run generar-fragmentos -- "<carpeta con los discos>"
npm run generar-fragmentos -- "<carpeta con los discos>" --enteros
```

**Los parámetros que fija este contrato**, y que el generador tiene que respetar:

| Nivel | Duración | Codificación | Destino |
|---|---|---|---|
| Fragmento | `-t 15` (de `DURACION_FRAGMENTO_SEG`) | `libmp3lame`, `-b:a 96k`, `-ar 44100`, `-ac 1`, `-map_metadata -1` | `public/audio/fragmentos/<slug>.mp3` |
| Tema entero (`D-22`) | completo | `libmp3lame`, `-b:a 128k`, `-ar 44100`, `-ac 2`, `-map_metadata -1` | `public/audio/temas/<slug>.mp3` |

**Normalización: `loudnorm` a `I=-14:TP=-1:LRA=11`, medido sobre el tema completo.**
Emparejar volúmenes importa de verdad: si un fragmento entra al doble de fuerte que el
anterior, el paso de 0,1 s deja de ser comparable entre temas, y al revelar se escucha el
salto contra el tema entero.

> **Defecto encontrado en esta revisión, y es de producción, no de contrato.** El generador
> corre `-i <tema> -af loudnorm=... -t 15 <salida>` en **una sola pasada**. Con `-t` en la
> salida, `ffmpeg` deja de leer la entrada apenas completa los 15 s: `loudnorm` en una
> pasada es un normalizador **dinámico** y nunca ve el resto del tema. O sea que la
> normalización se hace **sobre los primeros 15 segundos**, que es exactamente lo que la
> v1 advertía que no había que hacer: una intro tranquila se levanta hasta emparejarla con
> un estribillo, se comprime la dinámica y el fragmento queda más fuerte que el mp3 entero
> que suena al revelar.
>
> **Propuesta de corrección para el hilo principal (`T-107` o después). No bloquea nada, y
> hoy es gratis: no hay un solo fragmento generado.** Dos pasadas, que es lo que la v1
> conseguía con el máster intermedio:
>
> ```bash
> # (1) medir sobre el tema entero
> ffmpeg -i "<tema>" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -
> # (2) aplicar la medición y recién ahí recortar
> ffmpeg -i "<tema>" \
>   -af loudnorm=I=-14:TP=-1:LRA=11:measured_I=<I>:measured_TP=<TP>:measured_LRA=<LRA>:measured_thresh=<thresh>:offset=<offset>:linear=true \
>   -t 15 -codec:a libmp3lame -b:a 96k -ar 44100 -ac 1 -map_metadata -1 \
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

**Ya no es un pendiente.** La v1 dejaba pedido un `scripts/validar_fragmentos.py` que nunca
se escribió; la verificación está **adentro del generador**, corriendo sobre cada archivo
apenas se produce. Suelta, sobre un archivo cualquiera:

```bash
ffprobe -v error \
  -show_entries stream=codec_name,sample_rate,channels \
  -show_entries format=duration,size \
  -of default=nw=1 "public/audio/fragmentos/todo-un-palo.mp3"
```

Un fragmento **pasa** si cumple las cinco:

| # | Criterio | Valor esperado | Antes (v1) |
|---|---|---|---|
| 1 | `codec_name` | `mp3` | igual |
| 2 | `sample_rate` | `44100` | igual |
| 3 | `channels` | `1` — **sin la excepción de estéreo** | `1` o `2` con excepción |
| 4 | `duration` | entre `14.90` y `15.15` | ≤ `10.10` |
| 5 | `size` | ≤ `210000` bytes | ≤ `140000` |

**El tope de peso, confirmado y no inventado:** 96 kbps × 15 s son 180.000 bytes; los
210.000 dejan un 17 % de margen para el padding del encoder y la trama final. Es la misma
proporción que tenía la v1 (140.000 sobre 120.000). El generador lo tiene como
`TOPE_BYTES = 210_000`.

**Y la que ninguna herramienta hace por vos:** escuchá los primeros 100 ms de tres o cuatro
fragmentos. Si no se oye nada, ese tema arranca con silencio. El generador lo imprime como
recordatorio al terminar, que es lo máximo que una máquina puede hacer con esta condición.

---

### CTR-01.8 — Cómo se describen los fragmentos en los datos — **v2**

> **Reescrita el 2026-08-24 (`T-104`).** La v1 declaraba un objeto `fragmento` de siete
> campos —`archivo`, `duracionSeg`, `inicioEnTemaSeg`, `canales`, `origen`, `fechaCorte` y
> un `credito` obligatorio con tema, disco y año— que vivía adentro de cada ítem del banco
> de `CTR-03`. **Ese banco ya no existe** (`D-24`): no hay ítems, hay una lista de archivos.

**La entrada del manifiesto, entera:**

```json
{ "slug": "todo-un-palo", "titulo": "Todo un palo", "duracionSeg": 15.02, "entero": false }
```

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| `slug` | string, patrón de `CTR-01.4` | sí | Sin extensión y sin ruta. El motor arma la URL. Tiene que resolver contra uno de los 105 de `RES-20` o el build falla. |
| `titulo` | string | sí | El título tal como lo escribe `RES-20`. **No lo lee el juego**: está para que el manifiesto y el mapa de derechos de `CTR-03.6` se lean sin cruzar dos archivos. |
| `duracionSeg` | number, ventana de `CTR-01.3` | sí | La duración **medida** con `ffprobe`, no la pedida. |
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
y ahora son **por corrida**. El origen es uno solo y está en `D-23` (la discografía del
usuario); la fecha es el campo `actualizado` del manifiesto, que el generador escribe con
la fecha de la corrida. Si algún día un fragmento suelto viniera de otro lado, hay que
volver a ponerle `origen` a la entrada — y ahí es una fila más en el generador.
*Alternativa descartada:* conservar los dos campos igual, escritos por el generador. Se
descarta porque serían idénticos en las 104 entradas y un dato que nunca varía no informa:
informa el que lo escribió, y ese es `D-23`.

---

### CTR-01.9 — La escalera del reveal: **seis pasos**, de 0,1 a 15 segundos

> **Reescrita el 2026-08-24 (`T-104`).** La v1 fijaba **cinco** pasos —0,1 / 0,5 / 2,0 /
> 5,0 / 10,0— derivados de un máximo de 10 s. `D-24` fijó seis, con el juego de referencia
> medido a mano (`HILO-mapa-del-juego-de-referencia.md`, seis pulsaciones y la etiqueta
> leída después de cada una). El código ya corre así desde el 2026-08-23, en
> `src/lib/tema/escalera.ts`, con la tabla escrita a mano en `escalera.test.ts`. **Esta
> sección deja de contradecirlo: ese test ya no es una tabla huérfana.**

| Paso | Duración | Qué llega a escucharse |
|---|---|---|
| 1 | **0,1 s** | Un golpe. Un acorde, un redoblante, el arranque de un riff. Solo el que se lo sabe de memoria. |
| 2 | **0,5 s** | Timbre y ataque: se distingue guitarra de teclado y cómo suena la grabación. |
| 3 | **2 s** | Una figura rítmica o melódica entera. Acá se reconoce un riff conocido. |
| 4 | **4 s** | Una frase musical completa. Normalmente toda la intro. |
| 5 | **8 s** | La intro y lo que sigue. En la mayoría ya entró la voz. |
| 6 | **15 s** | El fragmento entero (`CTR-01.3`). |

**El puntaje no es de este contrato.** Es de `producto` (`BR-02`, reescrita en `T-99`).
`D-24` lo dejó provisorio en 100 · 80 · 60 · 40 · 20 · 10, con cero solo por no sacarla, y
`escalera.ts` guarda los dos números juntos porque el motor los necesita juntos. **Si la
tabla de puntaje cambia, cambia ese archivo y no cambia este.**

**La mecánica tampoco es de este contrato, pero lo condiciona:** con `D-24`, cada error o
cada `Pasá` abre el escalón siguiente. Seis escalones, seis intentos. Lo que eso le exige
al audio es lo único que me toca: **los seis pasos salen del mismo `AudioBuffer`**, el
motor reproduce `[0, segundos del paso]`, y por eso seis pasos cuestan lo mismo que uno.
Si `producto` quisiera ocho, el costo de audio seguiría siendo el mismo.

**Por qué esta curva.** Los saltos son ×5, ×4, ×2, ×2 y ×1,875: **una escalera que duplica
desde el paso 3**. Cada escalón da el doble de lo que había, así que la sensación de "me
están dando más" no se apaga. En incrementos crudos agrega 0,4 / 1,5 / 2 / 4 / 7 segundos:
cada tramo entrega más audio nuevo que el anterior, y por eso la barra del juego dibuja
tramos proporcionales a lo que **agrega** cada paso y no a su duración total.

**La propiedad que justificaba la escalera vieja se conserva, y conviene verlo escrito.**
La v1 exigía que ningún salto fuera mayor que el anterior —si no, el escalón más caro
regala más que el barato—. Los saltos nuevos son `5 ≥ 4 ≥ 2 ≥ 2 ≥ 1,875`: **no crecientes**.
La escalera de seis no rompe la regla de la de cinco; lo que rompe es la fórmula
`paso 4 = M × 0,5`, que queda retirada.

**Regla de recálculo si el máximo cambia a `M` (nueva, para seis pasos):**

- Pasos 1 a 5 —0,1 / 0,5 / 2 / 4 / 8— **no cambian**.
- Paso 6 = `M`.
- **Rango válido: `10,0 s ≤ M ≤ 16,0 s`.** El techo sale del chequeo de saltos no
  crecientes: `M/8 ≤ 2` exige `M ≤ 16`. El piso es de utilidad: con `M < 10` el último
  escalón agrega menos de un cuarto de audio nuevo y deja de ser un escalón.
- **Si `M` cae fuera del rango, la que se toca es la cantidad de pasos, y eso es de
  `producto`** (`BR-02`). Con `M = 8` sobra un escalón; con `M = 20` el último regala más
  que los cinco anteriores juntos.
- **Chequeo obligatorio, una línea de aritmética:** cada salto menor o igual al anterior.
  Si no da, la escalera se rediseña entera; no se parchea moviendo el último.

**Alternativas descartadas:**

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

### Lo que el código todavía no cumple — cuatro deudas declaradas

No están acá para que alguien las descubra tarde. Ninguna bloquea: el juego se juega.
`arquitectura` no implementa (`D-12`); esto es lo que le queda pedido al hilo principal, en
orden de lo que más se nota.

| # | Deuda | Qué exige el contrato | Qué hace el código | Se nota como | Costo |
|---|---|---|---|---|---|
| 1 | **`t0`** (`CTR-01.5`, regla 7) | Medir desde la primera muestra sobre -50 dBFS | Reproduce `[0, segundos]` desde el byte cero | El paso 1 puede ser silencio en un tema de arranque suave, y se gasta un intento | Detectar `t0` al decodificar y pasarlo como `offset` en `start()` |
| 2 | **Fade-out al cortar** (`CTR-01.1`) | `mín(15 ms, 10 % del paso)` para evitar el click | Corta en seco al final de cada paso | Un chasquido al final de cada escucha, seis por tema | Un `GainNode` con rampa antes del corte |
| 3 | **`loudnorm` de dos pasadas** (`CTR-01.6`) | Medir sobre el tema completo | Mide sobre los primeros 15 s, en pasada única | Intros tranquilas infladas, salto de volumen contra el tema entero | Una invocación más de `ffmpeg` por tema, en el generador |
| 4 | **Esperar la descarga en vuelo** (`CTR-01.5`, regla 1) | No caer al repuesto mientras el buffer viene en camino | Si no hay buffer, va derecho a `<audio>` | El paso 1 impreciso en el primer tema si el jugador es rápido | En `sonar()`, esperar la promesa de `enVuelo` para ese slug |

**La 3 es la más barata de pagar hoy y la más cara mañana:** no hay ni un fragmento
generado, así que corregirla ahora no cuesta re-exportar nada.

---

### Consecuencias

- **El contrato y el juego dicen lo mismo por primera vez desde `D-24`.** La tabla escrita
  a mano en `escalera.test.ts` deja de ser la única fuente de la escalera; ahora es la
  verificación de que el código sigue al contrato, que es su lugar correcto.
- **El presupuesto que le impone al motor:** 3 buffers residentes (**≤ 8,6 MB** de RAM en
  el caso peor), ventana de 2 adelantados, ≤ 1 MB de fragmentos por vuelta, el tema entero
  con `preload="none"`, y el buffer del tema en curso decodificado antes que cualquier otro.
- **Lo que le impone al que produce el audio:** una carpeta con los discos y un comando. El
  emparejamiento contra `RES-20` es la única puerta, y lo que no empareja no se genera.
- **Lo que le impone a `experiencia`:** el crédito —título, disco, año— tiene lugar en la
  pantalla del reveal y ya está; y la barra de seis tramos dibuja lo que **agrega** cada
  paso. Nada nuevo en esta revisión.
- **Difícil de revertir:** el formato. 104 archivos en mp3 son 104 archivos. Se sigue
  eligiendo el formato aburrido y compatible antes que el eficiente.
- **Fácil de revertir:** la duración y la escalera. Una constante, una regla de recálculo y
  una corrida del generador. El material de origen no se toca nunca.
- **Lo que este contrato no resuelve:** si Spotify se queda como enlace externo al revelar
  o se retira del todo. Es de `ADR-01`, sigue abierto, y hoy el código no lo usa — que es
  la opción conservadora.

---

### Cómo se verifica que el contrato y el código dicen lo mismo

`arquitectura` no tiene con qué correr esto (`D-12`). **Lo corre el hilo principal en
`T-107`.** Las tres primeras líneas comparan **los números de este documento** contra el
código; no son el test del código contra sí mismo.

```bash
# (1) CTR-01.3 y CTR-01.9: los seis pasos, los 15 s y los seis intentos
node -e "import('./src/lib/tema/escalera.ts').then(m=>{const c=[0.1,0.5,2,4,8,15];const v=m.ESCALERA.map(p=>p.segundos);const ok=JSON.stringify(v)===JSON.stringify(c)&&m.DURACION_FRAGMENTO_SEG===15&&m.INTENTOS===6;console.log(ok?'OK CTR-01.3/.9 = codigo':'DESALINEADO: '+JSON.stringify(v)+' / '+m.DURACION_FRAGMENTO_SEG+' / '+m.INTENTOS)})"

# (2) CTR-01.5 y CTR-01.7: las cuatro constantes del presupuesto y el tope de peso
node -e "import('node:fs').then(({readFileSync})=>{const a=readFileSync('src/lib/tema/audio.ts','utf8'),p=readFileSync('src/scripts/partida-tema.ts','utf8'),g=readFileSync('scripts/generar-fragmentos.mjs','utf8');const c=[[/MAX_BUFFERS = 3\b/,'3 buffers'],[/VENTANA_PRECARGA = 2\b/,'ventana 2'],[/LARGO_RONDA = 4\b/,'vuelta de 4'],[/TOPE_BYTES = 210_000/,'tope 210000'],[/'-b:a', '96k'/,'96 kbps'],[/'-ac', '1'/,'mono']];const s=a+p+g;const mal=c.filter(([r])=>!r.test(s)).map(([,n])=>n);console.log(mal.length?'DESALINEADO: '+mal.join(', '):'OK CTR-01.5/.6/.7 = codigo')})"

# (3) CTR-01.4: el patron de slug del contrato es el que produce el codigo
node -e "Promise.all([import('./src/lib/texto.ts')]).then(([t])=>{const p=/^[a-z0-9]+(-[a-z0-9]+)*$/;const casos=['Todo un palo','Un poco de amor frances','Jijiji'];const mal=casos.filter(c=>!p.test(t.slugDeTitulo(c)));console.log(mal.length?'DESALINEADO: '+mal.join(', '):'OK CTR-01.4 = codigo')})"

# (4) la escalera y el cruce del manifiesto contra los 105, con los tests que ya existen
node --test src/lib/tema/escalera.test.ts src/lib/tema/catalogo.test.ts

# (5) un archivo suelto contra la tabla de CTR-01.7 (cuando exista audio)
ffprobe -v error -show_entries stream=codec_name,sample_rate,channels -show_entries format=duration,size -of default=nw=1 "public/audio/fragmentos/todo-un-palo.mp3"
```

**Qué no verifica ninguna máquina:** que los primeros 100 ms suenen (oído), que el fragmento
no esté inflado por la pasada única de `loudnorm` (oído, hasta que se pague la deuda 3), y
que el techo de 15,0 s siga siendo el que `contenido` quiere (es de `CNT-01`, no de acá).
