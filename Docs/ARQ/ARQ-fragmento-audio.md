# ARQ — Fragmento de audio: formato, nombre, lugar y presupuesto

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `D-02`, `D-03`, `D-06`, `D-07`,
> `D-09`, `US-02`, `BR-02`, `RES-03`, `.claude/rules/codigo-juegos.md`,
> `Docs/SUGERENCIAS/PRD-para-arquitectura-pasos-reveal-audio.md`, `CNT-01` (sección A).
> Produce: `CTR-01`.
> Última actualización: 2026-08-19 (revisión 3, `T-10`: `CNT-01` cerró la duración máxima
> en **10,0 s**; se recalcularon la escalera de `CTR-01.9`, el presupuesto de `CTR-01.5`,
> la verificación de `CTR-01.7` y se reservó el campo de crédito en `CTR-01.8`).

---

## CTR-01 — Contrato del fragmento de audio del reveal progresivo

- **Fecha:** 2026-08-19
- **Estado:** **vigente y sin números abiertos.** El último que quedaba —la duración
  máxima— lo cerró `contenido` en `CNT-01`, sección A, y quedó asentado en `CTR-01.3`.
- **Para quién es esto:** para el usuario, que va a bajar los temas de YouTube y
  recortarlos (`D-06`). El audio **no existe todavía**, así que esta spec llega antes que
  el material: es lo que le dice qué recortar y cómo. Y para quien escriba el motor de
  audio, que tiene acá los números que `.claude/rules/codigo-juegos.md` le prohíbe
  inventar a ojo.

Si algo de acá te resulta molesto de cumplir, decilo antes de recortar cien temas, no
después.

---

### CTR-01.1 — Formato del archivo

| Parámetro | Valor | Por qué |
|---|---|---|
| Contenedor / códec | **MP3 (MPEG-1 Layer III)** | Es el único formato que `decodeAudioData` decodifica en **todos** los navegadores móviles sin excepción, incluido Safari en iOS. Y lo exporta cualquier herramienta que el usuario ya tenga. |
| Sample rate | **44.100 Hz** | Es el rate de origen de casi todo el material. Remuestrear agrega un paso y un modo de falla; el navegador ya remuestrea solo al rate de su `AudioContext`. |
| Canales | **1 (mono)** por defecto | El jugador escucha por el parlante del celular o por un auricular suelto: la imagen estéreo casi no aporta y mono baja el archivo a la mitad. |
| Bitrate | **96 kbps CBR** | Mono a 96 kbps suena bien. CBR y no VBR porque el presupuesto de más abajo se calcula con una regla de tres, no con una estimación. |
| Metadatos | **ninguno** (`-map_metadata -1`) | Un tag con el título del video de YouTube dentro de un archivo de un repo público es exactamente lo que no queremos (`D-06`). |
| Fades | **ninguno en el archivo** | Un fade-in de 50 ms convierte el reveal de 0,1 s en silencio. El motor aplica un fade-out **al cortar** para evitar el click, de `mín(15 ms, 10 % del paso)`; eso es del motor, no del archivo. El tope proporcional existe por el paso 1: 15 ms fijos sobre 100 ms se comerían el 15 % del reveal más corto. |

**Alternativas descartadas:**

- **Opus en WebM** — el más chico con diferencia. Descartado porque el soporte de Opus en
  `decodeAudioData` de Safari/iOS no es algo que pueda afirmar sin ficha, y el precio de
  equivocarse es que la mitad de los celulares no puedan jugar el juego de audio. `D-09`
  dice que la velocidad de carga **no** es bloqueante, así que no hay ninguna razón para
  pagar un riesgo de compatibilidad a cambio de kilobytes.
- **AAC en `.m4a`** — un 20–30 % más chico a igual calidad. Descartado por el mismo motivo
  y con menos premio: el ahorro no compra nada que nos importe hoy.
- **WAV sin comprimir** — descartado: 10 s en mono a 44,1 kHz / 16 bits son ~0,9 MB por
  tema. Con cien temas es un repositorio de 90 MB para nada.
- **Estéreo** — descartado como default por lo de arriba. **Excepción permitida:** si al
  pasar un tema a mono se te desaparece un instrumento (cancelación de fase, pasa en
  algunas mezclas anchas de los 80), guardá **ese** tema en estéreo y anotá
  `"canales": 2` en su ficha del JSON. Es una excepción por archivo, no un cambio de
  contrato.

---

### CTR-01.2 — Dónde empieza el recorte

- El fragmento arranca en el **inicio del tema** (segundo 0 del máster). Si el tema abre
  con silencio, ruido de sala o cuenta, arrancá en el **primer ataque musical**.
- **No te vuelvas loco con los milisegundos de silencio de cabeza.** El motor los descarta
  solo (ver `CTR-01.5`, detección de `t0`).
- Si `producto` o `contenido` deciden que algún tema conviene recortarlo desde otro punto
  (un estribillo, un riff), el contrato lo soporta: se anota en `inicioEnTemaSeg`. **Cuál
  es el punto no lo decido yo** — es regla de juego.

---

### CTR-01.3 — Duración máxima — **cerrada**

- **Duración máxima: 10,0 segundos.** Recortá con este número.
- **Tolerancia de validación: 10,10 s.** Un MP3 no puede durar cualquier cosa: la trama
  son 1.152 muestras (≈ 26,1 ms), así que el archivo siempre se pasa un poco de lo pedido.
  Un archivo de 10,04 s **está bien**, no lo vuelvas a exportar.

**De dónde sale el número y de quién es.** Lo fijó **`contenido` en `CNT-01`, sección A ·
Cantidad** (nota de derechos, 2026-08-19), que es quien tiene la pelota de esa decisión:
la duración del fragmento no es solo una variable técnica, es **la** variable de exposición
a derechos del audio — cuanto más largo, más superficie. Yo había dejado 15,0 s como cifra
provisoria para que el usuario pudiera empezar a recortar sin esperar; `CNT-01` bajó el
número a 10,0 s y esta sección lo asienta. **Ya no es provisorio: tiene dueño, tiene
fundamento y está escrito en la carpeta de quien lo decidió.**

**El fundamento, tal como lo razonó `CNT-01` — importa no deformarlo.** Los 10,0 s son
**precaución editorial propia de `contenido`, explícitamente sin respaldo legal**. No son
un límite derivado de la ley. En concreto, `CNT-01` descartó las dos referencias que
circulaban:

1. **Descartó el cálculo por compases.** `RES-03` verificó con fuente primaria que en
   Argentina no hay *fair use* y que el derecho de cita del Art. 10 de la Ley 11.723 topea
   la cita musical en **8 compases**
   (<https://servicios.infoleg.gob.ar/infolegInternet/anexos/40000-44999/42755/texact.htm>,
   consultado 2026-08-19). Los ~16 s que yo saqué de ahí asumían **120 BPM**, y el tempo
   real de cada tema **no está fichado**: es dato de la sesión de investigación de la
   banda, que no existe hoy. Sostener un número único para todo el banco sobre esa
   aritmética sería tratar una estimación sobre un supuesto como si fuera un techo
   verificado. 8 compases no son segundos.
2. **Descartó tratar el Art. 10 como zona segura.** El artículo exige fin **didáctico o
   científico** y "las partes indispensables", y un juego de adivinanzas no encaja ahí de
   forma obvia. Si esa lectura es correcta, el derecho de cita ni siquiera aplicaría y los
   8 compases dejarían de ser un techo relevante. `RES-03` además marca que **ninguna
   fuente consultada dice que un fan site sin fines de lucro quede cubierto**: zona gris
   declarada, no un paraguas.

Con el tempo por tema desconocido y la aplicabilidad del Art. 10 en duda, `CNT-01` decidió
no quedarse pegado a los 15–16 s que circulaban (mi cifra provisoria, la cuenta de
compases, los 30 s de preview de Spotify) porque **ninguna de esas referencias es una zona
segura confirmada**. 10,0 s deja margen frente a temas de tempo rápido sin inventar el
tempo de ninguno, y todavía sostiene los 5 pasos de `CTR-01.9`.

> **Que quede dicho sin ambigüedad: la ley no dice 10 segundos.** Nadie puede citar esta
> sección como si un fragmento de 10 s estuviera legalmente permitido. La pregunta legal de
> fondo sigue abierta en `CNT-01` y pedida a `investigador`. Este número reduce exposición;
> no la elimina, y **no habilita publicar** — el gate de `D-07` sigue en pie.

Si la investigación de derechos obliga a bajar más, cambia **solo** este número y la
escalera de `CTR-01.9`, que se recalcula con la regla escrita ahí. Nada más del contrato se
toca (y por eso el máster en WAV de acá abajo no es opcional).

**Y acá está la parte importante para vos, que vas a recortar:**

> **Guardá el máster de cada tema en WAV, fuera del repositorio.**
> `~/RicotaArcade-masters/` o donde quieras, pero **nunca dentro del repo**, y con el
> repo ignorándolo.

Dos razones. Una: **ya pasó una vez.** La nota de derechos bajó el máximo de 15 a 10 s
antes de que existiera un solo archivo; la próxima vez puede decir 8 y con los másters
guardados eso es volver a exportar cien archivos con un comando, sin ellos es volver a
bajar cien temas de YouTube. `CNT-01` trata el máster WAV como **condición de trabajo, no
sugerencia**, y este contrato dice lo mismo. Dos: los másters son temas completos bajados
de YouTube (`D-06`, riesgo abierto) y **no tienen por qué estar nunca en un repositorio
público**.

La escalera de 5 pasos que consume este máximo está en **`CTR-01.9`**.

---

### CTR-01.4 — Nombre y lugar del archivo

**Nombre:** `<slug-del-tema>.mp3`

- Minúsculas, ASCII puro. Sin acentos, sin eñes (`ñ` → `n`), sin puntuación, sin espacios.
- Espacios y separadores → guion medio.
- Colisión (mismo título en dos discos, versión en vivo): sufijo `--<slug-del-disco>`.

```
ji-ji-ji.mp3
un-poco-de-amor-frances.mp3
todo-un-palo.mp3
ji-ji-ji--en-directo.mp3
```

**Alternativa descartada:** IDs numéricos (`trk-001.mp3`). Descartada porque el que recorta
es una persona que tiene que emparejar cien archivos con cien canciones a mano, y con
números eso es una planilla más y un error silencioso garantizado. Con el slug, un archivo
mal pegado se nota leyendo la carpeta.

**Lugar:** `public/audio/fragmentos/<slug>.mp3`

- Va en `public/` y **no** en `src/assets/` porque en Astro los assets de `src/` pasan por
  el pipeline y salen con el nombre hasheado. El fragmento se pide en runtime por una URL
  armada desde un string del JSON, así que necesita una ruta estable y predecible.
  `public/` se sirve tal cual.
- **El JSON guarda el slug, no la ruta.** El motor arma
  `/audio/fragmentos/${slug}.mp3`. Si mañana la carpeta se mueve, cambia una constante y
  no cien entradas de datos.

**Fuera del repo:** `~/RicotaArcade-masters/<slug>.wav` — los másters normalizados de
`CTR-01.6`.

---

### CTR-01.5 — Presupuesto de precarga

El reveal de 0,1 s tiene que ser **honesto**: cuando el jugador toca, suena. Eso no se
consigue optimizando la descarga, se consigue teniendo el buffer ya decodificado en
memoria **antes** de que arranque la ronda.

**Reglas duras del motor:**

1. **La ronda no arranca hasta que el `AudioBuffer` del tema en juego esté decodificado.**
   Nada de mostrar un botón de play que todavía no puede sonar. Si hay que esperar, se
   muestra que se está esperando — cómo se muestra es de `experiencia`.
2. **Ventana de precarga: el tema en juego + 2 por adelantado.** Se descargan y decodifican
   los siguientes mientras el jugador piensa. **Nunca se precarga el banco entero.**
3. **Techo de buffers decodificados residentes: 3.** Al entrar el cuarto, se descarta el
   menos usado. Este es el número que importa de verdad y por eso va con la cuenta:

   | Concepto | Cuenta | Total |
   |---|---|---|
   | Archivo MP3 (10 s, mono, 96 kbps) | 12 KB/s × 10 s | **≈ 120 KB** |
   | `AudioBuffer` decodificado en RAM | 10 s × 44.100 × 4 bytes (Float32) × 1 canal | **≈ 1,8 MB** |
   | 3 buffers residentes | 3 × 1,8 MB | **≈ 5,3 MB** |
   | 20 buffers residentes (lo que pasa si no se descarta nada) | 20 × 1,8 MB | ≈ 35 MB — **inaceptable en gama baja** |

   **Recalculado con los 10,0 s de `CTR-01.3` (`CNT-01`).** Con los 15 s provisorios
   anteriores eran 180 KB por archivo, 2,6 MB por buffer y **7,9 MB residentes**;
   bajar la duración por derechos abarató el presupuesto un tercio sin que el motor cambie
   una línea. Los 5,3 MB son el argumento de que el reveal de 0,1 s puede ser **honesto**
   en un celular de gama baja: tres temas decodificados y listos para sonar entran de
   sobra, así que nunca hace falta mostrar un botón de play que todavía no suena.

   El costo real de la precarga sigue siendo la **RAM del decodificado**, no la descarga:
   un fragmento pesa 120 KB en la red y 1,8 MB en memoria, catorce veces más. Esa
   proporción **no depende de la duración** — depende de que el MP3 comprima y el
   `AudioBuffer` no. Es el número que se olvida y es el que tira la pestaña abajo en un
   celular viejo.

   **Un tema en estéreo por la excepción de fase (`CTR-01.1`) cuesta el doble de RAM**
   —3,5 MB— porque el `AudioBuffer` guarda un Float32 por canal; en la red pesa igual,
   porque los 96 kbps son los mismos. Con un estéreo entre los tres residentes son ~7 MB:
   sigue por debajo de los 7,9 MB que costaba el presupuesto anterior en mono. Por eso la
   excepción se banca de a uno o dos temas y no como default.

4. **Presupuesto de red por partida de 10 rondas: ≤ 2 MB de audio.** Con 120 KB por tema
   son 1,2 MB. **El techo se queda en 2 MB aunque la duración haya bajado**: es un techo de
   alarma, no un objetivo móvil, y el margen que sobra es lo que permite sumar una ronda o
   un segundo fragmento por tema sin renegociar nada. Si un fragmento se pasa de **140 KB**,
   algo se rompió en el pipeline de exportación.
5. **Se decodifica de a uno.** Nada de disparar cinco `decodeAudioData` juntos y hacer
   tironear la animación.
6. **Detección de `t0`.** Después de decodificar, el motor busca la primera muestra por
   encima de **-50 dBFS** dentro de los primeros 300 ms y la toma como origen. Todas las
   duraciones del reveal se miden desde ahí. Esto existe por una razón concreta: el
   encoder de MP3 mete un retardo de hasta ~1.100 muestras (≈ 25 ms) al principio del
   archivo, y 25 ms de silencio dentro de un reveal de 100 ms es un cuarto del reveal.
   Con `t0`, el 0,1 s es 0,1 s de música de verdad — y de paso el usuario no tiene que
   recortar con precisión de milisegundo.
7. **Objetivo, no gate:** desde que se pide un fragmento hasta que está listo para sonar,
   **≤ 500 ms** en 4G. Es un objetivo medible, **no** un criterio bloqueante: `D-09` sacó
   la velocidad de carga de los no negociables y no la voy a volver a meter por la ventana.

---

### CTR-01.6 — Cómo recortar, en dos comandos

`ffmpeg`, gratis, en Windows/Mac/Linux. **Paso 1 una vez por tema; paso 2 cada vez que
cambie la duración máxima.**

**Paso 1 — máster normalizado (fuera del repo).** Emparejar volúmenes importa: si un
fragmento entra el doble de fuerte que el anterior, el juego se vuelve desagradable y el
reveal de 0,1 s deja de ser comparable entre temas.

```bash
ffmpeg -i "tema-bajado.m4a" \
  -af loudnorm=I=-14:TP=-1:LRA=11 \
  -ar 44100 -ac 1 \
  "~/RicotaArcade-masters/ji-ji-ji.wav"
```

`I=-14` LUFS es el estándar de las plataformas de streaming. Se normaliza sobre el **tema
completo**, no sobre el recorte: si normalizás un recorte de una intro tranquila, el
motor te la levanta hasta reventar.

**Paso 2 — el fragmento que sí va al repo.**

```bash
ffmpeg -i "~/RicotaArcade-masters/ji-ji-ji.wav" \
  -t 10 \
  -codec:a libmp3lame -b:a 96k -ar 44100 -ac 1 \
  -map_metadata -1 \
  "public/audio/fragmentos/ji-ji-ji.mp3"
```

Si el tema arranca con silencio o cuenta, agregá `-ss <segundos>` **antes de `-t`** y
anotá ese mismo número en `inicioEnTemaSeg`.

---

### CTR-01.7 — Verificación

**Por archivo:**

```bash
ffprobe -v error \
  -show_entries stream=codec_name,sample_rate,channels \
  -show_entries format=duration,size \
  -of default=nw=1 "public/audio/fragmentos/ji-ji-ji.mp3"
```

Un fragmento **pasa** si cumple las cinco:

| # | Criterio | Valor esperado |
|---|---|---|
| 1 | `codec_name` | `mp3` |
| 2 | `sample_rate` | `44100` |
| 3 | `channels` | `1` (o `2` con la excepción de fase anotada en el JSON) |
| 4 | `duration` | ≤ `10.10` |
| 5 | `size` | ≤ `140000` bytes |

**Y una que ninguna herramienta puede hacer por vos:** escuchá los primeros 100 ms. Si no
se oye nada, el recorte arranca en silencio y hay que correrlo.

**Pendiente:** un `scripts/validar_fragmentos.py` que corra esto sobre la carpeta entera y
lo cruce contra el JSON. No lo escribo yo — no implemento código — pero el criterio de
aceptación es exactamente la tabla de arriba.

---

### CTR-01.8 — Cómo se describe el fragmento en el JSON

Este objeto lo consume `CTR-02` y cualquier contrato de juego que use audio.

```json
"fragmento": {
  "archivo": "ji-ji-ji",
  "duracionSeg": 10.0,
  "inicioEnTemaSeg": 0,
  "canales": 1,
  "origen": "youtube",
  "fechaCorte": "2026-08-20",
  "credito": {
    "tema": "<título exacto del tema>",
    "disco": "<disco al que pertenece>",
    "anio": 0
  }
}
```

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| `archivo` | string, slug de `CTR-01.4` | sí | Sin extensión y sin ruta. El motor arma la URL. |
| `duracionSeg` | number, ≤ máximo de `CTR-01.3` (**10,0**) | sí | Duración real del archivo. |
| `inicioEnTemaSeg` | number ≥ 0 | sí | Desde dónde del tema original se recortó. Trazabilidad y derechos. |
| `canales` | 1 \| 2 | sí | `2` solo con la excepción de fase de `CTR-01.1`. |
| `origen` | string | sí | De dónde salió el material. Hoy es `"youtube"` en todos (`D-06`). Cuando la investigación de derechos pregunte "¿de dónde salió este audio?", la respuesta tiene que estar en el dato, no en la memoria de alguien. |
| `fechaCorte` | `AAAA-MM-DD` | sí | Cuándo se produjo. |
| `credito` | objeto | **sí** | El crédito visible que `CNT-01` exige. Ver abajo. |
| `credito.tema` | string no vacío | sí | Título del tema. |
| `credito.disco` | string no vacío | sí | Disco al que pertenece. |
| `credito.anio` | integer | sí | Año del disco. Clave sin `ñ` a propósito: las claves del JSON son ASCII, como los slugs de `CTR-01.4`. |

El ejemplo va con marcadores y no con un tema real **a propósito**: los tres valores del
crédito son hechos de la banda y salen de una ficha (`RES-02` para discografía, o la que
corresponda), nunca de memoria (`D-09`). Un crédito equivocado es un dato falso publicado
al lado de material de terceros: el peor lugar posible para adivinar.

**Por qué el crédito es obligatorio y por qué vive acá.** `CNT-01`, sección A · Crédito, lo
respondió sin rodeos: **sí va crédito visible junto a cada fragmento**, como mínimo tema,
disco y año, porque un fragmento sin firma se parece más a una reproducción suelta que a
una cita. Eso es una obligación de derechos, no un adorno de la interfaz, así que la pongo
donde no se pueda saltear: **dentro del objeto del fragmento y como campo requerido.** Si
el crédito viviera suelto en la pantalla, publicar un fragmento sin firmar sería un olvido;
acá es un JSON que no valida.

Tres consecuencias que dejo dichas para que nadie las descubra tarde:

- **Este objeto es la fuente canónica de tema/disco/año para cualquier juego con audio.**
  El contrato de `US-02` (`CTR-03`, todavía sin escribir) **no** vuelve a declarar esos tres
  campos: los lee de acá. Un tema con dos títulos distintos en el mismo archivo es el tipo
  de incoherencia que después nadie sabe cuál es la buena.
- **No agrega filtración de la respuesta.** En "adivinar el tema" el título viaja al cliente
  igual desde antes: el archivo se pide como `/audio/fragmentos/ji-ji-ji.mp3` (`CTR-01.4`),
  así que el que abre la pestaña de red ya lo tiene. **Cuándo** se muestra el crédito —solo
  al revelar, nunca antes— es de `experiencia`, y no es un problema nuevo que traiga
  este campo.
- **El formato en pantalla no lo fijo yo.** `CNT-01` dejó abierto si el crédito suma
  intérprete, si va superpuesto o en un pie, y si tiene que decir explícitamente que el
  fragmento salió de YouTube y no es material oficial. Los datos ya alcanzan para las tres
  variantes —`origen` está en el objeto desde la primera versión—; la redacción es de
  `contenido` y el layout de `experiencia`.

---

### CTR-01.9 — La escalera del reveal: los 5 pasos en segundos

Responde el pedido de `producto` en
`Docs/SUGERENCIAS/PRD-para-arquitectura-pasos-reveal-audio.md`. `BR-02` fijó **5 pasos** y
su puntaje (100/80/60/40/20); acá van los segundos.

| Paso | Duración desde `t0` | Puntos (`BR-02`) | Qué llega a escucharse |
|---|---|---|---|
| 1 | **0,10 s** | 100 | Un golpe. Un acorde, un redoblante, el arranque de un riff. Solo el que se lo sabe de memoria. |
| 2 | **0,50 s** | 80 | Timbre y ataque: ya se distingue guitarra de teclado, y cómo suena la grabación. |
| 3 | **2,0 s** | 60 | Una figura rítmica o melódica entera. Acá se reconoce un riff conocido. |
| 4 | **5,0 s** | 40 | Una frase musical completa. Normalmente toda la intro. |
| 5 | **10,0 s** | 20 | El fragmento entero (`CTR-01.3`). En la mayoría de los temas ya entró la voz. |

> **Recalculada en `T-10`** porque `CNT-01` bajó el máximo de 15,0 a 10,0 s. Antes era
> 0,1 / 0,5 / 2,0 / 6,0 / 15,0. **Siguen siendo 5 pasos y siguen valiendo 100/80/60/40/20:
> `BR-02` no se toca.**

**Primero, la respuesta a la pregunta que dejó `producto`:** el presupuesto de precarga
**no limita la cantidad de pasos**. Los 5 salen del **mismo archivo**, no de 5 recortes
distintos: el motor reproduce `[t0, t0 + duración del paso]` sobre el `AudioBuffer` que ya
tiene decodificado. Cinco pasos cuestan exactamente lo mismo que uno. Si `producto` quisiera
siete, tampoco cambiaría nada del costo. **`BR-02` no hay que renumerarla.**

**Y verificado de nuevo ahora que el máximo bajó: `BR-02` sigue sin necesitar un solo
cambio.** Lo comprobé leyendo la regla, no de memoria. `BR-02` está escrita a propósito sin
segundos: dice "5 pasos fijos, del fragmento más corto (arranca en 0,1 seg) al fragmento más
largo disponible", delega la duración exacta en `arquitectura`, y su tabla de puntaje nombra
el último escalón como "Paso 5 (fragmento completo)" en vez de dar una cifra. Los dos únicos
números que `BR-02` fija de su lado —los 0,1 s del paso 1 y los 100/80/60/40/20— siguen
intactos. Bajar el máximo de 15 a 10 s cambia **qué** es "el fragmento completo", no la
regla que lo nombra. Nada que pedirle a `producto` por esta vía.

**Por qué esta curva.** Los saltos son ×5, ×4, ×2,5 y ×2: geométrica con razón que
**desacelera hasta el final**. Al principio lo que importa es la proporción (de 0,1 a 0,5 s
se quintuplica la información); al final importan los segundos absolutos, porque a los 5 s
ya escuchaste la intro y lo que sumás es contenido nuevo, no resolución. En incrementos
crudos la escalera agrega 0,4 / 1,5 / 3,0 / 5,0 s: cada tramo da más que el anterior, y
ninguno da un salto que se sienta de otro juego.

Una escalera lineal (2-4-6-8-10) haría inútiles los primeros pasos: a los 2 s ya reconocés
casi cualquier tema y el puntaje de 100 no lo ganaría nadie. Una puramente geométrica
(0,1-0,32-1,0-3,2-10) daría los mismos escalones útiles con números que nadie puede leer en
pantalla.

**Alternativa descartada — aplicar al pie de la letra la regla que yo mismo había escrito.**
La versión anterior decía `paso 4 = M × 0,4`, que con `M = 10` da **4,0 s** y la escalera
`0,1 / 0,5 / 2,0 / 4,0 / 10,0`. La descarto: sus saltos son ×5, ×4, **×2 y ×2,5**, o sea
desacelera y después vuelve a acelerar justo en el último escalón, que es el que más pesa —
el paso 4 sumaría 2 s y el paso 5 sumaría 6, tres veces más. Esa regla reproducía la
proporción `6/15` de la escalera vieja, no la propiedad que justificaba su forma. **Arreglo
la regla, no el caso particular**, así que abajo queda corregida para cualquier `M` futuro.

**Regla de recálculo si el máximo cambia a `M` (corregida en `T-10`):**

- Pasos 1, 2 y 3 (0,1 / 0,5 / 2,0) **no cambian** mientras `8,0 s ≤ M ≤ 16,0 s`.
- Paso 4 = `M × 0,5`, redondeado a media unidad.
- Paso 5 = `M`.
- **Chequeo obligatorio, una línea de aritmética:** cada salto tiene que ser menor o igual
  al anterior. Con los pasos 1–3 fijos los saltos son `5`, `4`, `M/4` y `2`, así que la
  condición se cumple exactamente en el rango `8,0 ≤ M ≤ 16,0`. Ahí está el porqué del
  rango de arriba: no es un número al gusto.
- Ejemplo con `M = 8,0 s` → **0,1 / 0,5 / 2,0 / 4,0 / 8,0** (saltos 5, 4, 2, 2 — el caso
  límite, todavía válido).
- Si `M < 8,0 s`, la escalera **no se parchea moviendo solo el paso 4**: con el paso 3
  clavado en 2,0 s el chequeo falla, así que hay que rediseñar los cinco pasos y volver a
  correrlo. Es trabajo mío, no de `producto`, y no cambia `BR-02`.
- Si `M < 4,0 s`, cinco escalones dentro de cuatro segundos no describen nada distinto uno
  del otro. **Ahí sí hay que hablar con `producto`**, porque lo que se estaría tocando es la
  cantidad de pasos, que es de ellos.

**Lo que el motor tiene que garantizar en el paso 1:** los 100 ms se miden desde `t0`
(`CTR-01.5`, regla 6), no desde el byte cero del archivo. Sin eso, el paso 1 es hasta un
cuarto de silencio y el puntaje de 100 se vuelve una lotería.

---

### Consecuencias

- **Ya no queda nada abierto para empezar a recortar.** El contrato entero está cerrado:
  formato, punto de inicio, duración (10,0 s), nombre, lugar y verificación. No hay que
  esperar a `ADR-01` ni a ninguna ficha para producir los cien archivos.
- **El único número frágil sigue siendo la duración, y por eso el máster no es opcional.**
  Bajó una vez (15 → 10) antes de que existiera un archivo; si la investigación legal
  pendiente obliga a bajarla otra vez, con los másters de `CTR-01.6` es re-exportar con un
  comando. **Si el usuario se saltea el paso del máster, esa facilidad desaparece y hay que
  volver a bajar cien temas de YouTube.** Es la única parte del contrato donde saltarse un
  paso duele de verdad después.
- **Difícil:** cambiar de formato más adelante. Cien archivos ya recortados en MP3 son
  cien archivos. Por eso elegí el formato aburrido y compatible en vez del eficiente.
- **Presupuesto que le impone a quien escriba el motor:** 3 buffers residentes (**≈ 5,3 MB**
  de RAM, no 7,9), 1 decodificación por vez, `t0` detectado, fade-out de 15 ms al cortar, y
  la ronda no arranca sin el buffer listo.
- **Lo que le impone a `contenido`:** siete campos por fragmento —los seis de antes más
  `credito`, con sus tres subcampos—, y ninguno inventable a ojo: `origen` y `fechaCorte`
  los sabe solo quien recortó, y `credito` sale de una ficha.
- **Lo que le impone a `experiencia`:** el crédito (tema, disco, año) tiene que tener un
  lugar en la pantalla del juego de audio. El dato ahora existe y es obligatorio; dónde se
  muestra, no. Es lo único de este contrato que necesita diseño antes de publicar.
- **Lo que este contrato NO resuelve:** nada de acá habilita publicar. Los 10,0 s reducen
  exposición, no la eliminan, y el gate de `D-07` lo levanta la nota de derechos cuando
  `investigador` responda las preguntas legales que `CNT-01` dejó abiertas.
