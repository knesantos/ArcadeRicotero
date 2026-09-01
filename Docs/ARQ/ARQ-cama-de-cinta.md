# ARQ — La cama de cinta: ruido sintetizado, apagada por defecto

> Rol dueño: `arquitectura`. **Produce: `ADR-04`.** Fecha: **2026-09-01**.
>
> **Consume** — leído para escribir esto, no citado de memoria: `CLAUDE.md` (la postura y
> las seis reglas), `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`,
> `ORQ-plan-ciclo-11.md` (`T-189`, y la doctrina "el movimiento es del lugar"), `D-02`
> (islas, sin backend), `D-09` (sin muro de entrada), `D-14` (molinetes abiertos, riesgo
> asumido), `D-15` (estático en Vercel; `localStorage` como única persistencia), `D-19` (la
> mezcla por disco), `D-22` y `D-23` (el audio en dos niveles), `D-26` (la escalera en 10 s),
> `D-29` (ninguna isla importa un módulo de Node), `CTR-01` v3 (`ARQ-fragmento-audio.md`,
> presupuesto de precarga), `UX-03` (jugar sin auriculares), `Docs/IDS.md`.
>
> **Y el código, que para esta decisión es la fuente más dura que hay:**
> `src/lib/tema/audio.ts` (entero), `src/lib/tema/audio.test.ts`,
> `src/scripts/diagnostico-audio.ts`, `src/pages/diagnostico-audio.astro`,
> `src/lib/sitio/aparato.ts`, `src/lib/islas.test.ts`, `src/styles/tokens.css:203-210`, y
> `src/scripts/partida-tema.ts` **leído y no tocado: es del ciclo 10**.
>
> **Resuelve:** `T-189`. **No resuelve, y no se mete:** el interruptor y su texto, que son de
> `experiencia` (`UX-21`, `T-190`), y la construcción, que es del hilo principal (`T-191`).

---

## De dónde sale cada afirmación de este documento

Tres orígenes, y están marcados uno por uno más abajo. Sin esto, dentro de dos meses no se
distingue lo medido de lo elegido:

| Marca | Qué significa |
|---|---|
| **medido en el repo** | se verificó leyendo el archivo, con ruta y línea. No hace falta ficha: está en disco |
| **criterio propio del rol** | lo decide `arquitectura` acá. Se puede discutir; no se puede citar como hecho externo |
| **pendiente de ficha** | dato del mundo de afuera. **No lo afirmo**: va a `investigador` como `RES-XX` del rango libre (`RES-54`+) |

Y una advertencia sobre el otro tipo de afirmación, la que este proyecto cuida de verdad:
**este documento no dice nada sobre la obra de la banda.** La cama no imita una grabación,
no reproduce un fondo de ningún disco y no cita nada. Imita **un aparato**: una cinta
corriendo. Es la diferencia entre el lenguaje del casete que ya usa el sistema de marca y
usar material ajeno — y es la razón por la que `D-14` no tiene por dónde agarrar esta pieza.

---

## ADR-04 — La cama de cinta

- **Estado:** **aceptada**, sin números abiertos. No depende de ninguna ficha pendiente:
  las tres que pido abajo cambiarían el texto de un aviso, no el diseño.
- **Contexto.** El ciclo 11 quiere que el sitio se sienta un lugar. El sonido es la palanca
  de inmersión más grande que queda y también la más fácil de arruinar: un sitio que hace
  ruido sin que se lo pidan es lo primero que se cierra. `T-189` pide una cama de aire
  —ruido de cinta— **sintetizada**: cero archivos, cero peso transferido, cero derechos que
  discutir. Y pide que no pise el único audio que este sitio tiene que servir bien, que es
  el fragmento de 0,1 s de `US-02`, el escalón que `CTR-01.5` existe para sostener.
- **Decisión, en una línea:** la cama es un grafo de Web Audio de **once nodos**, alimentado
  por un **bucle de ruido generado en memoria**, colgado del **mismo `AudioContext`** que ya
  usa el motor de fragmentos, **apagado por defecto**, y **mudo mientras cualquier cosa del
  documento esté sonando** — y eso último se decide **en la capa de audio**, no en la
  pantalla de ningún juego.

### Los cinco candados, antes de los detalles

Si algún día alguien quiere aflojar uno, que sepa cuál está aflojando:

1. **Apagada por defecto.** La primera visita no oye nada. La preferencia se guarda recién
   cuando alguien la prende con el dedo.
2. **Cero archivos.** No hay mp3, no hay módulo de worklet, no hay respuesta de impulso.
   `0 bytes` de red, siempre, prendida o apagada.
3. **Muda cuando algo suena.** Fragmento, tema entero o lo que agregue un juego futuro.
4. **No lleva información.** Ningún estado del sitio se comunica con la cama. Apagarla no
   pierde nada — que es la regla 4 de la doctrina del ciclo, aplicada al oído.
5. **Un solo `AudioContext`.** El segundo contexto es un defecto, no una alternativa.

---

## ADR-04.1 — Cómo se sintetiza: el grafo, con nombre y número

**Que suene a cinta corriendo y no a estática de televisor es un problema de filtro, no de
fuente.** El ruido blanco crudo tiene energía plana hasta arriba y eso es exactamente el
sonido de una pantalla sin señal. Una cinta corriendo tiene tres cosas que la estática no
tiene: **el ancho de banda recortado** (el siseo se muere antes de los agudos), **un
arrastre grave** que dice que algo está girando, y **un bamboleo lento** que dice que lo que
gira es mecánico y no perfecto. Las tres se consiguen con biquads y dos osciladores.

*(Todo este apartado es **criterio propio del rol**: los valores están elegidos para ser
afinables de oído, no medidos contra ninguna referencia. Lo que **no** es afinable son las
prohibiciones del final y el techo de ganancia.)*

```
cintaRuido        AudioBuffer mono, 3 s, generado con Math.random() y cruzado en los bordes
   │
ruido             AudioBufferSourceNode · loop = true · playbackRate 1
   │   ▲
   │   └── profundidadFlutter  GainNode 0,003  ←  flutter  OscillatorNode 'sine' 5,3 Hz
   │                                   (entra a ruido.playbackRate: el temblor rápido)
   ├──────────────────────────────┐
   ▼                              ▼
siseo                          arrastre
BiquadFilter 'lowpass'         BiquadFilter 'lowpass'
1400 Hz · Q 0,4                70 Hz · Q 1,2
   │                              │
   ▼                              ▼
piso                          nivelArrastre
BiquadFilter 'highpass'        GainNode 0,5
120 Hz · Q 0,7                    │
   │                              │
   └──────────────┬───────────────┘
                  ▼
            respiracion   GainNode 1
                  ▲
                  └── profundidadBamboleo GainNode 0,15 ← bamboleo OscillatorNode 'sine' 0,27 Hz
                  ▼
            volumenCama   GainNode 0        ← el ÚNICO que se rampa
                  ▼
            ctx.destination
```

**Los cuatro detalles que hacen la diferencia entre esto y una estática con volumen bajo:**

1. **`siseo` a 1400 Hz es lo que saca el televisor.** Doce decibeles por octava para arriba
   de ahí, y el ruido pasa de "pantalla sin señal" a "cinta". Si alguien sube ese número por
   arriba de ~2500 Hz, vuelve el televisor: es el valor que más manda del grafo.
2. **`arrastre` es la mitad del truco y la que nadie pone.** Es la misma fuente de ruido
   filtrada a 70 Hz: no se escucha como sonido, se escucha como que **algo está girando**.
   Sin esa rama, la cama es aire; con ella, es un aparato.
3. **`bamboleo` no toca nunca el `GainNode` maestro, y esto es una regla y no una
   preferencia.** Una entrada conectada a un `AudioParam` **se suma** al valor que fija la
   automatización: si el oscilador entrara a `volumenCama.gain`, con la cama en cero seguiría
   sumando ±0,15 y **"callada" no sería silencio**. Por eso hay dos gains: `respiracion`
   respira, `volumenCama` manda. El maestro en 0 es cero absoluto.
4. **El bucle no puede delatarse.** `cintaRuido` dura **3 s** con los últimos **250 ms**
   cruzados sobre el arranque al generarlo (si no, hay un clic por vuelta), y
   `BAMBOLEO_HZ = 0,27` da un período de ~3,7 s que **no es múltiplo ni divisor de 3**. Si
   alguien pone el bamboleo en 0,333 Hz, el bucle se vuelve audible como patrón y la cama
   pasa a llamar la atención sobre sí misma — que es justo lo que la doctrina del ciclo
   prohíbe.

### Las constantes, con nombre, para que ninguna quede suelta en el código

`.claude/rules/diseno-marca.md` prohíbe un hex suelto en un componente y `T-177` va a
prohibir una duración suelta. Mismo criterio acá: **ningún número de audio se escribe dos
veces**. Viven al principio de `src/lib/sitio/cinta.ts`:

| Constante | Valor | Qué pasa si se mueve |
|---|---|---|
| `GANANCIA_CAMA` | `0.05` | el volumen de la cama. **Techo duro: `0.08`** — ver `ADR-04.9` |
| `LARGO_BUCLE_SEG` | `3` | **no pasa de `4`**: arriba de eso se rompe el presupuesto de RAM |
| `CRUCE_SEG` | `0.25` | menos que esto y el bucle chasquea |
| `SISEO_HZ` | `1400` | arriba de ~2500 vuelve el televisor |
| `PISO_HZ` | `120` | saca el barro que tapa el arrastre |
| `ARRASTRE_HZ` | `70` · `NIVEL_ARRASTRE` `0.5` | el motor. Sin esta rama es aire, no aparato |
| `BAMBOLEO_HZ` | `0.27` · `PROFUNDIDAD_BAMBOLEO` `0.15` | no puede ser múltiplo ni divisor de `LARGO_BUCLE_SEG` |
| `FLUTTER_HZ` | `5.3` · `PROFUNDIDAD_FLUTTER` `0.003` | más profundidad y suena a cinta rota, que es un chiste, no una atmósfera |
| `BAJADA_SEG` | `0.02` | ver `ADR-04.3`: **no sube**, el paso 1 dura 0,1 s |
| `SUBIDA_SEG` | `1.2` | volver tiene que no notarse |
| `ESPERA_PARA_VOLVER_SEG` | `6` | ver `ADR-04.3` |

### Prohibido adentro de este grafo

- **`ConvolverNode`** (reverb): necesita una respuesta de impulso, o sea **un archivo**.
- **`AudioWorkletNode`**: `audioWorklet.addModule()` toma una URL, o sea **otro archivo**, y
  una vía de falla nueva. Si alguien sostiene que hay forma sin archivo, que traiga ficha.
- **`ScriptProcessorNode`**: corre en el hilo principal y le roba cuadros al juego. Todo el
  motivo por el que `audio.ts` usa buffers decodificados es no pelear por ese hilo
  (`src/lib/tema/audio.ts:6-16`, **medido en el repo**).
- **`AnalyserNode` con bucle de cuadros**: ver `ADR-04.3`, no sirve para lo que parece servir.
- **Cualquier evento sonoro puntual**: clic, golpe de acierto, barrido al cambiar de
  pantalla. La cama es continua o no es. `ORQ-plan-ciclo-11` ya lo dejó fuera de alcance por
  escrito ("ni golpes de acierto, ni clics, ni voz") y acá queda como prohibición técnica:
  **nada se conecta a este grafo desde un evento de interfaz.**

---

## ADR-04.2 — Quién es dueño del `AudioContext`

**Hoy lo crea `Reproductor.despertar()`, en privado** (`src/lib/tema/audio.ts:93-115`,
**medido en el repo**): `private ctx: AudioContext | null`, construido con
`window.AudioContext ?? webkitAudioContext` adentro del gesto de `Empezá`.

**Un segundo contexto para la cama es un error**, y no por elegancia:

1. Duplica un ciclo de vida que costó dos defectos reportados por el usuario aprender a
   manejar — `suspended` al nacer en el celular, `interrupted` en Safari después de una
   llamada, el buffer mudo de una muestra que destraba iOS (`audio.ts:117-150`,
   `audio.test.ts:143-196`, **medido en el repo**). Todo eso habría que escribirlo otra vez.
2. Un contexto no puede callar al otro. La regla de convivencia de `ADR-04.3` se vuelve
   imposible de garantizar.
3. **Cuántos contextos simultáneos tolera un iPhone es pendiente de ficha** — no lo afirmo.
   El diseño está hecho para que la respuesta no importe: con uno solo, la pregunta no se
   hace.

**Decisión:** el contexto se muda a un módulo hoja nuevo, **`src/lib/audio/contexto.ts`**,
que **no importa nada** (D-29 lo exige: `src/lib/islas.test.ts` recorre el grafo de
importaciones desde `src/scripts/` y falla si aparece un `node:*`). Ni `audio.ts` ni
`cinta.ts` son dueños: **los dos lo piden prestado**.

```ts
/** El contexto compartido. Lo crea el primero que lo pide, DESDE ADENTRO DE UN GESTO. */
export function contextoDeAudio(): AudioContext | null;
/** El que ya existe, sin crear ninguno. Para mirar sin tocar. */
export function contextoVivo(): AudioContext | null;
/** resume() + el buffer mudo que destraba iOS. Solo desde un gesto. */
export function despertarSalida(): Promise<AudioContextState | null>;
```

**Quién lo crea primero, en la práctica:** el que llegue. Si la persona prende la cinta en la
portada, lo crea la cinta y el juego se lo encuentra ya corriendo — que es **mejor** que hoy,
porque `Empezá` deja de tener que despertarlo. Si entra derecho al juego, lo crea
`despertar()` como siempre y la cinta se cuelga del que hay.

**Dos cosas que el hilo principal tiene que hacer sí o sí al mudarlo** (`T-191`):

- **`Reproductor` deja de construir el contexto y pasa a pedirlo.** El bloque
  `audio.ts:93-115` se reemplaza por `contextoDeAudio()`; el resto de `despertar()`
  —`resume()` con su `.catch`, `desbloquear()`— **no se toca**. Es la parte del motor que ya
  está probada y que arregló el celular del usuario: no es candidata a refactor decorativo.
- **`contexto.ts` expone `reiniciarAudioParaPruebas()`, y sin eso las pruebas se
  contaminan.** `audio.test.ts` instala dobles globales y arma un `Reproductor` nuevo por
  caso (`audio.test.ts:57-116`, **medido en el repo**); con un singleton en ámbito de módulo,
  el contexto del primer caso sobrevive al segundo y `assert.equal(e.registro.mudos, 1)`
  empieza a medir otra cosa. `restaurar()` tiene que llamarlo.

**El `<audio>` del diagnóstico y el del reveal no entran a este reparto.**
`src/scripts/diagnostico-audio.ts:148` construye su propio contexto **a propósito**: mide un
contexto recién nacido, es una herramienta, y esa página no se enlaza desde ningún lado
(`diagnostico-audio.astro:9`, **medido en el repo**). Queda como la **única** excepción
escrita, y `ADR-04.10` la verifica con un `grep`.

---

## ADR-04.3 — La regla de convivencia: dos oídos, ninguno en la pantalla

**El requisito duro:** cuando suena un fragmento, la cama se calla — y eso tiene que cumplirse
**sin tocar `src/scripts/partida-tema.ts`**, que lo está editando otro agente en el ciclo 10.
O sea: el silencio se decide **escuchando el propio grafo**, no la pantalla del juego.

Leyendo el código aparece que **una sola vía no alcanza**, y este es el hallazgo que ordena
todo el apartado:

| Qué suena hoy | Por dónde sale | ¿Lo ve un `AnalyserNode` del grafo? |
|---|---|---|
| El fragmento, camino bueno | `AudioBufferSourceNode` → `ctx.destination` (`audio.ts:281-291`) | sí |
| El fragmento, camino de repuesto | `new Audio()` **nunca insertado en el documento** (`audio.ts:299-311`) | **no**: no pasa por Web Audio |
| El tema entero al revelar (`D-22`) | `<audio controls>` creado por la isla y **agregado al DOM** (`partida-tema.ts:792-798`) | **no**: tampoco pasa por el grafo |

**Todo medido en el repo.** Y de ahí sale la primera alternativa descartada: **un `Analyser`
midiendo nivel no sirve**, porque se le escapan dos de las tres vías —justo las dos que
usan `<audio>`— y además obliga a un bucle de cuadros permanente. Se descarta por incompleto,
no por caro.

**La decisión: dos oídos, los dos adentro de la capa de audio.**

### Oído 1 — el token de la salida (cubre el motor de fragmentos, sus dos caminos)

Vive en `src/lib/audio/contexto.ts`, que es el punto donde el motor y la cama ya se encuentran:

```ts
/** El motor avisa que va a usar la salida. Devuelve cómo soltarla. Idempotente. */
export function tomarLaSalida(quien: string, topeSeg: number): () => void;
export function salidaOcupada(): boolean;
export function alCambiarLaSalida(oyente: (ocupada: boolean) => void): () => void;
```

- Lo llama **`Reproductor.sonar()`**, una sola vez, al principio —donde ya está el
  `desbloquear()` de `audio.ts:240`—, y lo suelta en `terminar()` y en `detener()`. Son tres
  líneas en `audio.ts`, que **no es archivo del ciclo 10**. `partida-tema.ts` no se entera de
  nada y no cambia una coma.
- **Cubre el camino de repuesto**, que es lo que el `Analyser` no podía: el token no pregunta
  por dónde sale el sonido, pregunta si el motor está sonando.
- **`topeSeg` es la red de seguridad y copia una que ya existe.** `sonarConRepuesto()` arma un
  corte por temporizador de `limite + 5` segundos "para que el botón no se trabe"
  (`audio.ts:346-348`, **medido en el repo**). Mismo criterio: un token que se filtra deja la
  cama muda para siempre, así que se suelta solo. `tomarLaSalida('fragmento', limite + 5)`.
- El contador se aprieta a cero si alguien suelta de más. Nunca negativo.

### Oído 2 — el escucha del documento (cubre el tema entero y todo lo que venga)

Vive en `src/lib/sitio/cinta.ts` y solo se registra **mientras la cama está prendida**:

```ts
document.addEventListener('play',    tomarNota, true);
document.addEventListener('playing', tomarNota, true);
document.addEventListener('pause',   soltarNota, true);
document.addEventListener('ended',   soltarNota, true);
```

- **`true` no es opcional: los eventos de medios no burbujean.** Sin fase de captura, un
  `<audio>` que suena tres niveles más abajo no llega nunca al documento.
- Cubre el reproductor del reveal **sin que la isla lo sepa**, y cubre cualquier `<audio>` o
  `<video>` que agregue un juego futuro. Es la parte que hace que esta regla no envejezca.
- Los elementos vivos se guardan en un `Set`. **Antes de decidir volver**, se barre:
  `m.paused || m.ended || !m.isConnected` sale del conjunto. Sin ese barrido, un `<audio>`
  que la pantalla borra mientras suena —el juego reemplaza la pantalla al seguir— deja la
  cama muda para siempre, y nadie sabría por qué.
- **No hay encuesta.** Ni `setInterval`, ni `requestAnimationFrame`. El barrido corre en el
  mismo evento que ya despertó la pregunta.

### La curva: baja en 20 ms, vuelve en 1,2 s, y no antes de 6 s

| Momento | Qué hace `volumenCama.gain` | Por qué ese número |
|---|---|---|
| Algo empieza a sonar | rampa a **0 en 20 ms**, programada en el mismo cuadro | **El paso 1 del reveal dura 0,1 s** (`escalera.ts`, `D-26`). Con una bajada de 120 ms la cama estaría encima del escalón entero, que es justo el que `CTR-01.5` existe para que suene honesto. Con 20 ms hay un quinto del escalón y es inaudible. **Cortar a cero seco no sirve**: un ruido cortado en seco chasquea |
| El juego nunca espera | `sonar()` **no aguarda** a la cama | Ni un milisegundo abajo del dedo. El límite 2 de la doctrina del ciclo |
| Se libera la salida | arranca un temporizador de **6 s** | Los seis escalones y el tipeo del buscador llegan en ráfagas de pocos segundos. Con una espera corta, la cama respira para adentro y para afuera alrededor de cada toque, y eso se nota **más** que no tenerla |
| Pasaron los 6 s y sigue libre | rampa a `GANANCIA_CAMA` en **1,2 s** | Volver tiene que no notarse |

*Criterio propio del rol, los cuatro.* El único que no se toca sin volver a pensar todo es
el de 20 ms: cuelga de la escalera de `D-26`, no del gusto de nadie.

---

## ADR-04.4 — La política de autoreproducción, y qué ve la gente si igual queda trabado

**Ningún navegador deja sonar nada sin un gesto**, y este proyecto ya construyó todo alrededor
de eso: `despertar()` se llama desde el `click` de `Empezá` (`partida-tema.ts:185-188`) y el
buffer mudo de una muestra existe porque en iOS `resume()` solo no alcanza (`audio.ts:117-127`,
**medido en el repo**).

**El interruptor de la cinta ES ese gesto.** Y no hay ninguno más: la cama no se prende en
ningún otro lado.

### Los tres casos, con lo que pasa en cada uno

**1. La persona toca el interruptor y todo sale bien.** `contextoDeAudio()` (crea si no
había) → `despertarSalida()` → grafo → rampa de subida. Estado `sonando`. La preferencia se
guarda.

**2. La persona toca el interruptor y el contexto queda `suspended` igual.** Pasa de verdad:
`diagnostico-audio.ts:69-79` reconoce siete navegadores incrustados —WhatsApp, Instagram,
Facebook, Telegram, TikTok, X, LINE— porque "esas ventanas recortan el audio de maneras que
el navegador de verdad no" (**medido en el repo**). Entonces:

- **Un intento y nada más.** No se reintenta, no se encuesta, y **no se deja armado un
  escucha del próximo toque**. Un sitio que se guarda un intento para soltarlo cuando toques
  otra cosa es exactamente el truco que la política de autoreproducción existe para impedir.
- **La preferencia no se guarda como prendida.** Nunca se recuerda algo que no llegó a pasar.
- **El grafo se desarma entero.** Cero nodos vivos.
- **Estado `bloqueada`**, y el interruptor lo muestra. *El texto es de `experiencia` (`UX-21`)
  y de `contenido`; lo que fija este ADR es el registro*: **registro 3, seco** —dice qué hay
  adentro y se calla—, sin suspensivos y sin chiste, como manda `voz-ricotera.md` §5. Dejé
  una propuesta de redacción en
  `Docs/SUGERENCIAS/ARQ-para-experiencia-estados-de-la-cinta.md`; la decide `UX-21`.

**3. El caso peor, que no se puede detectar: el iPhone en silencio.** La llave lateral apaga
el audio de Web Audio **con el contexto en `running` y sin dejar rastro**, y
`src/lib/sitio/aparato.ts:14-16` lo dice con todas las letras: *"No hay ninguna API que diga
si esa llave está puesta. Ni una."* (**medido en el repo**). O sea: el interruptor va a decir
prendida y no se va a oír nada. **La cama no puede resolverlo y no lo intenta.** Ya existe el
aviso de la llave para quien tiene iPhone (`partida-tema.ts:161-183`) y existe
`/diagnostico-audio`. Que `UX-21` decida si el interruptor se apoya en eso: es su pantalla.

### Y en la página siguiente, con la preferencia ya guardada

Cada documento nuevo es un contexto nuevo. La regla:

- **La cama no construye nada al cargar.** Si `contextoVivo()` no existe o no está `running`,
  se queda quieta.
- **Se rearma con el primer toque de la página**, y con uno solo:
  `document.addEventListener('pointerdown', …, { once: true, capture: true })` más el
  equivalente de teclado. **No es autoreproducción**: la persona ya declaró que quiere la
  cinta, y esto es lo mínimo para que la preferencia signifique algo cuando se cambia de
  pantalla. Si ahí tampoco arranca → `bloqueada`, y no se intenta más en esa página.
- **Cuánto de esto hace falta depende de `ADR-03`** (`T-180`, mismo rol, decisión
  independiente): si el tránsito termina siendo entre documentos, esto corre en cada página;
  si termina siendo con enrutador de Astro, el contexto sobrevive y la cama no se corta nunca.
  **No decido eso acá** y el diseño funciona en los dos casos.

---

## ADR-04.5 — Dónde se recuerda la preferencia, y con qué clave

Sin cuentas, sin backend, sin nada que viaje: `D-15` deja `localStorage` como única
persistencia del proyecto, y **hoy no hay una sola clave escrita en `src/`** (verificado por
búsqueda, **medido en el repo**). Así que esta es la primera y fija el espacio de nombres.

| | |
|---|---|
| **Clave** | **`arcade.cinta`** |
| Valores | `'1'` prendida · `'0'` apagada. **Cualquier otra cosa es apagada**: un valor corrupto no es una preferencia |
| Ausente | apagada. Es el default y no se escribe hasta que alguien toque el interruptor |
| Espacio de nombres | **`arcade.` para toda clave futura del sitio** (`D-16`: el producto es Arcade Ricotero). Un `localStorage` compartido con otros sitios en `localhost` es motivo suficiente |
| Si `localStorage` tira | **se traga y se sigue**, con la preferencia en memoria por lo que dure la página. Safari en privado y las ventanas incrustadas lo hacen; que la cama rompa el sitio por no poder guardar un `'1'` sería ridículo |

**No se guarda nada más.** Ni volumen, ni cuántas veces se prendió, ni cuándo. No hay
analítica (`D-10`) y una cama de aire no necesita historia.

---

## ADR-04.6 — El contrato del módulo `src/lib/sitio/cinta.ts`

Lo escribe el hilo principal en `T-191`. Esto es lo que tiene que exponer y lo que tiene
prohibido:

```ts
/** El apagado de emergencia. Ver ADR-04.7. Literal, para que se pueda grepear. */
export const CAMA_HABILITADA = true;

/** Cuatro estados, y ninguno más. El interruptor se pinta con esto. */
export type EstadoCinta = 'apagada' | 'sonando' | 'callada' | 'bloqueada';

/** ¿Se puede ofrecer? Habilitada, con Web Audio, y en el navegador. */
export function cintaDisponible(): boolean;

/** Qué está pasando ahora. Barato: no crea nada, no toca el contexto. */
export function estadoDeLaCinta(): EstadoCinta;

/** SOLO desde adentro de un gesto. Crea el grafo, guarda la preferencia si salió. */
export function prenderCinta(): Promise<EstadoCinta>;

/** Baja en BAJADA_SEG, desarma el grafo, desregistra los escuchas, guarda '0'. */
export function apagarCinta(): void;

/** Para que el interruptor se entere de 'callada' y de 'bloqueada'. Devuelve cómo darse de baja. */
export function alCambiarLaCinta(oyente: (estado: EstadoCinta) => void): () => void;
```

**`callada` es un estado visible a propósito:** si la cama se calla sola y el interruptor
sigue diciendo prendida, la persona toca el interruptor pensando que se rompió. `UX-21`
decide cómo se ve; el módulo se lo tiene que poder decir.

### Lo que este módulo NO puede importar, y por qué

| Prohibido | Motivo |
|---|---|
| **Cualquier `node:*`, directo o a tres saltos** | `D-29`. `src/lib/islas.test.ts` recorre el grafo entero desde `src/scripts/` y falla; una isla muerta deja la pantalla dibujada y sin responder |
| `src/lib/letra/temas.ts`, `tema/catalogo.ts` y todo lo que lea `RES-20` | son los que traen `node:fs`. Es el defecto exacto de `D-29`, que llegó por `paleta.ts` sin una línea de Node propia |
| `src/lib/tema/audio.ts` | **dirección única**: `audio.ts → contexto.ts ← cinta.ts`. La cama no conoce al motor de fragmentos y el motor no conoce la cama. Si se cruzan, la regla de convivencia pasa a depender de quién cargó primero |
| Cualquier `src/data/*.json` | la cama no tiene datos. Cero bytes es cero bytes |

**Lo único que puede importar es `src/lib/audio/contexto.ts`.** Que a su vez no importa nada.

---

## ADR-04.7 — El apagado de emergencia

**Una línea, en `src/lib/sitio/cinta.ts`:**

```ts
export const CAMA_HABILITADA = false;
```

Y con eso: `cintaDisponible()` devuelve `false`, el interruptor no se dibuja, `prenderCinta()`
devuelve `'apagada'` sin crear un nodo, no se registra ni un escucha, y la preferencia
guardada se ignora sin borrarse —el día que se vuelva a prender, la persona que la tenía
prendida la sigue teniendo—.

Es un literal y no un valor calculado **para que se pueda encontrar con un `grep` y cambiar
sin entender el módulo**. Alternativa descartada: una variable de entorno de Astro. Se
descarta porque obliga a mirar la configuración del despliegue para saber si el sitio hace
ruido, y porque el sitio es estático: el interruptor tiene que estar en el código, donde se
lee.

---

## ADR-04.8 — Movimiento reducido no aplica, pero hay tres preferencias que sí mandan

`src/styles/tokens.css:203-210` apaga animaciones y transiciones bajo
`prefers-reduced-motion: reduce` con el selector universal (**medido en el repo**; `T-178`
va a arreglar que eso también apague la respuesta al toque de `.opcion`). **Esa consulta no
dice nada sobre el sonido y la cama no la lee** — en ninguna de las dos direcciones:

- **No apaga la cama.** Reducir movimiento es una molestia vestibular, no auditiva. Usarla
  como sustituto sería adivinarle a la persona una preferencia que no declaró, y **sacarle
  algo que sí pidió con el dedo**. Molinete al revés.
- **No la prende, obvio, ni la esconde.** Que `UX-21` decida cómo presenta el interruptor bajo
  movimiento reducido; el módulo nunca lo decide solo.
- **Y no hace falta que la lea**, que es el punto de fondo: la regla 4 de la doctrina dice
  que con el movimiento apagado el sitio tiene que decir **lo mismo**. La cama **no dice
  nada** — candado 4 de `ADR-04`. Apagarla no cuesta información porque no lleva ninguna.

**La preferencia análoga existe, y son tres, en este orden de autoridad:**

1. **La declarada — el interruptor.** Es el análogo exacto: una preferencia que la persona
   expresa **una vez** y que el sitio no vuelve a preguntar (`ADR-04.5`). La diferencia con
   `prefers-reduced-motion` es de quién la guarda, no de qué es.
2. **La de atención — `document.visibilityState`.** Página escondida (otra pestaña, otra
   aplicación, teléfono bloqueado) = cama muda en `BAJADA_SEG`, y vuelve al volver. Es
   exactamente lo que el juego ya hace con el fragmento en `partida-tema.ts:133-139`
   (**medido en el repo**): *"el audio de un tema escondido no se escucha igual"*. Un sitio
   que sigue siseando en el bolsillo es el peor final posible de esta pieza.
3. **La del sistema — el contexto que se va de `running`.** Una llamada, Siri, otra
   aplicación tomando el audio: Safari deja el contexto en `interrupted` y `audio.test.ts`
   ya lo cubre (**medido en el repo**). **La cama no pelea**: no llama a `resume()` fuera de
   un gesto y no reintenta. Si el sistema lo devuelve solo, se entera por `statechange` y
   vuelve con su rampa lenta.

**Si algún día el navegador expone una preferencia de "menos estímulo sonoro"**, la cama la
respeta y gana sobre todo lo anterior. **Hoy no afirmo que exista ni que no**: es pendiente
de ficha (`RES-XX` del rango libre, ver los pendientes).

---

## ADR-04.9 — El presupuesto: RAM, red, hilo

`CTR-01.5` fija el techo de audio residente en **6,0 MB** (tres buffers de fragmento en el
caso peor, contexto a 48 kHz). La cama suma **una** línea a esa cuenta y no puede sumar más:

| Concepto | Cuenta | Total |
|---|---|---|
| `cintaRuido`, mono Float32, 3 s a 48 kHz | `3 × 48.000 × 4 bytes` | **≈ 0,55 MB** |
| **Techo del contrato** | `LARGO_BUCLE_SEG` no pasa de `4` → `4 × 48.000 × 4` | **≤ 0,77 MB** |
| Nodos vivos (11) | dos osciladores, cuatro biquads, cuatro gains, una fuente | despreciable |
| **Audio residente total del sitio** | 6,0 MB de `CTR-01.5` + la cama | **≤ 7,0 MB** |

- **Red: 0 bytes. Siempre.** Es la mitad del sentido de esta pieza y es lo que la hace
  gratis en el peso, en el tiempo de carga y en derechos.
- **El buffer se genera una vez por página, la primera vez que se prende**, y se conserva
  mientras dure la página aunque se apague: son ~144.000 llamadas a `Math.random()`,
  milisegundos, y regenerarlo en cada toque del interruptor sería trabajo por nada.
- **Nunca se genera si la cama está apagada.** Primera visita = 0 nodos, 0 MB, 0 bytes.
- **No entra al LRU de `CTR-01.5`.** Es otra línea del presupuesto, no un cuarto buffer: si
  entrara al `Map` de `audio.ts`, el desalojo podría llevarse la cama o —peor— la cama podría
  desalojar el fragmento que está por sonar, que es el defecto que `audio.ts:159-175` ya tuvo
  una vez (**medido en el repo**).
- **Ganancia: `0.05`, techo duro `0.08`.** No hay control de volumen en la v1: hay
  interruptor. Nadie puede exponer un control que pase de `0.08` sin volver a este ADR.

---

## ADR-04.10 — Qué queda prohibido, en una lista para revisar

1. Un segundo `AudioContext` fuera de `contexto.ts` (excepción única y escrita:
   `src/scripts/diagnostico-audio.ts`).
2. Tocar `src/scripts/partida-tema.ts` para que la cama se calle.
3. Que la cama suene un evento de interfaz: acierto, error, clic, cambio de pantalla.
4. Que algo del sitio dependa de escuchar la cama.
5. Bajar del volumen con menos de 20 ms de rampa, o cortar a cero seco.
6. Reintentar contra la política de autoreproducción, o dejar armado un intento escondido.
7. Guardar la preferencia como prendida cuando el navegador la bloqueó.
8. Encuestar: `setInterval`, `requestAnimationFrame` o un `Analyser` para saber si algo suena.
9. Un archivo: mp3, worklet, respuesta de impulso. Cero.
10. Un número de audio escrito fuera de las constantes de `ADR-04.1`.

---

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **Un mp3 de ruido en bucle con `<audio loop>`** | Es un archivo: peso, una petición, y una pieza más que alguien tiene que producir. Y encima empeora la convivencia: un `<audio>` propio activaría el oído 2 de `ADR-04.3` y la cama se callaría a sí misma |
| **`AudioWorklet` con un generador propio** | `addModule()` toma una URL, o sea un archivo, o sea el candado 2 roto. Y suma una vía de falla en el mismo lugar donde este proyecto ya se comió dos defectos |
| **`ScriptProcessorNode`** | Corre en el hilo principal y le roba cuadros al juego. Es lo contrario de por qué `audio.ts` usa buffers decodificados |
| **Un `AudioContext` propio para la cama** | No puede callar al del motor, duplica un ciclo de vida caro (`suspended`/`interrupted`/buffer mudo) y agrega una pregunta sobre iOS que hoy nadie tiene fichada. Ver `ADR-04.2` |
| **Que la cama se calle porque la pantalla del juego se lo dice** | Es lo que `T-189` prohíbe explícitamente —`partida-tema.ts` es del ciclo 10— y además envejece mal: cada juego nuevo tendría que acordarse de avisar. La capa de audio ya sabe lo que necesita saber |
| **Un `AnalyserNode` midiendo el nivel de la salida** | Se le escapan las dos vías que usan `<audio>` (el repuesto del motor y el tema entero del reveal), que son justo la mitad del problema. Y obliga a un bucle de cuadros permanente. Descartada por incompleta |
| **Ruido blanco crudo, sin filtros** | Es el sonido de un televisor sin señal. La identidad de esta pieza está en el filtro, no en la fuente |
| **Sumarle reverb (`Convolver`) para "espacio"** | Necesita un archivo de impulso, y encima la mete en el terreno del efecto que se hace notar. La cama es aire, no un ambiente diseñado |
| **Chasquidos y saltos ocasionales de cinta gastada** | Es un evento puntual: llama la atención sobre sí mismo, que es lo único que la doctrina del ciclo prohíbe de plano. Y a la tercera vuelta se vuelve un tic |
| **Prendida por defecto, con un botón para apagarla** | Rompe la política de autoreproducción, rompe el candado 1, y es la razón número uno por la que alguien cierra una pestaña. Un sitio que hace ruido sin permiso le pide algo a la gente antes de dejarla entrar |
| **Recordar la preferencia en la URL o en el enlace compartido** | El resultado compartible es la puerta de entrada del sitio (`D-10`): que un enlace de X llegue con el sonido decidido por otro es exactamente lo que no |
| **Que la cama cambie con el disco de cada sección (`D-19`)** | Tentador y descartado por ahora: la mezcla rota el acento y la letra, no la base, y la cama es base. Si `experiencia` lo quiere, es una vuelta a este ADR con `UX-20` en la mano, no una constante más |

---

## Consecuencias

**Lo que se vuelve fácil:**

- El sitio gana una capa de atmósfera que **no pesa un byte** y que no toca `D-14` ni de
  costado: no hay obra ajena adentro de un `Math.random()` filtrado.
- El `AudioContext` pasa a tener dueño escrito. Hoy vive privado adentro de una clase y
  cualquier pieza nueva de sonido tendría que crear el segundo.
- La regla de convivencia queda hecha para lo que venga: cualquier juego futuro que agregue
  un `<audio>` al documento calla la cama **sin escribir una línea**.
- Si la cama molesta, se saca en una línea y sin build roto.

**Lo que se paga:**

- **Se toca `src/lib/tema/audio.ts`, que es el archivo más sensible del repo**: es el que
  falló dos veces en el celular del usuario. La mitigación es de alcance: se cambia de dónde
  sale el contexto y se agregan tres líneas de token; `resume()`, `desbloquear()`, el LRU y
  el camino de repuesto **no se tocan**, y `audio.test.ts` tiene que seguir verde sin
  cambiarle un `assert`.
- **Aparece una carpeta nueva, `src/lib/audio/`**, con un solo archivo hoja. Es a propósito:
  no puede vivir en `tema/` (la cama no es del juego de temas) ni en `sitio/` (el motor de
  fragmentos no debería importar nada de `sitio/`).
- **Nada de esto se puede auditar del todo a máquina.** Que la cama *suene* a cinta y no a
  televisor lo decide un oído, igual que el resto del ciclo 11. Los tests fijan la lógica y
  las prohibiciones; el timbre se afina moviendo cinco constantes.

---

## Lo que no decido yo

- **El interruptor**: dónde vive, qué forma tiene, qué dice prendido, apagado y bloqueado.
  Es `UX-21` (`T-190`, `experiencia`). Le dejé los cuatro estados y una propuesta de
  redacción en `Docs/SUGERENCIAS/ARQ-para-experiencia-estados-de-la-cinta.md`.
- **El texto visible**: de `contenido` y `experiencia`, bajo `voz-ricotera.md`. Lo único que
  fija este ADR es que el aviso de `bloqueada` va en **registro 3**.
- **La construcción**: `T-191`, hilo principal. Y la verificación la corre él o `revisor`
  (`D-12`): este rol no tiene con qué correr un comando.

## Pendientes de ficha — para `investigador`, del rango libre (`RES-54`+)

Ninguna frena esta decisión. Las tres cambiarían el texto de un aviso o confirmarían una
elección ya tomada, no el diseño:

1. **¿Existe una preferencia de sistema para reducir estímulo sonoro** expuesta a la web
   (consulta de medios o API), y dónde funciona? Hoy la cama no lee ninguna y lo dice.
2. **¿Cuántos `AudioContext` simultáneos tolera Safari en iOS y qué pasa al pasarse?** El
   diseño de un solo contexto hace que la respuesta no importe; sirve para saber si el
   `<audio>` del reveal, el del diagnóstico y el contexto compartido conviven sin sorpresas.
3. **¿Hay forma de correr un `AudioWorklet` sin servir un archivo de módulo?** Si la hay,
   vuelve a abrirse la alternativa que descarté por el candado 2.

---

## Cómo se verifica

**Lo que se puede correr hoy, antes de que exista una línea de `cinta.ts`** — es la línea de
base de `ADR-04.2` y tiene que dar exactamente dos resultados, en `audio.ts` y en
`diagnostico-audio.ts`:

```bash
grep -rn "new AudioContext\|webkitAudioContext\|new Ctor()" src/lib src/scripts
```

**Después de `T-191`, ese mismo comando no puede nombrar ningún archivo fuera de
`src/lib/audio/contexto.ts` y `src/scripts/diagnostico-audio.ts`.** Es la verificación más
barata de todo este documento y la que atrapa el error más caro.

**Los tests, con los mismos dobles de `AudioContext` que ya usa `audio.test.ts:22-116`:**

```bash
node --test src/lib/audio/contexto.test.ts   # nuevo, T-191
node --test src/lib/sitio/cinta.test.ts      # nuevo, T-191
node --test src/lib/tema/audio.test.ts       # NO se le toca un assert: tiene que seguir verde
node --test src/lib/islas.test.ts            # D-29: cinta.ts no arrastra node:*
npm test && npm run check
```

**Los casos que esos dos archivos nuevos tienen que cubrir** —cada uno cierra un apartado de
este ADR, y sin ellos el ADR es una opinión—:

| # | Caso | Cierra |
|---|---|---|
| 1 | Dos llamadas a `contextoDeAudio()` devuelven **el mismo objeto** | `ADR-04.2` |
| 2 | `reiniciarAudioParaPruebas()` deja el módulo sin contexto (y `audio.test.ts` sigue contando **un** buffer mudo por caso) | `ADR-04.2` |
| 3 | `tomarLaSalida()` dos veces y soltar una: la salida **sigue ocupada**. Soltar la misma dos veces **no** la libera de más | `ADR-04.3` |
| 4 | Pasado `topeSeg`, la salida se libera sola aunque nadie la haya soltado | `ADR-04.3` |
| 5 | Con la salida ocupada, `volumenCama.gain` queda programado a **0 dentro de los 20 ms** y **no vuelve antes de 6 s** de liberada | `ADR-04.3` |
| 6 | Un `<audio>` que dispara `play` en el documento calla la cama; si se lo saca del DOM sin `pause`, el barrido lo suelta y la cama vuelve | `ADR-04.3` |
| 7 | Con `resume()` que rechaza: `prenderCinta()` devuelve `'bloqueada'`, **no** escribe `arcade.cinta` y deja **cero nodos** vivos | `ADR-04.4` |
| 8 | Con `localStorage` que tira al escribir, `prenderCinta()` igual devuelve `'sonando'` | `ADR-04.5` |
| 9 | `arcade.cinta` con un valor raro (`'si'`, `''`, `'2'`) se lee como **apagada** | `ADR-04.5` |
| 10 | Con `CAMA_HABILITADA = false`: `cintaDisponible()` es `false` y `prenderCinta()` no crea un solo nodo | `ADR-04.7` |
| 11 | Con `document.hidden`, la cama se calla; al volver visible, vuelve | `ADR-04.8` |

**Lo que ninguna máquina puede verificar, y lo corre una persona en un teléfono de verdad**
(`D-12`: no soy yo):

1. Prender la cinta en la portada y **no reconocer un televisor**. Si suena a estática, el
   número a mover es `SISEO_HZ`, y después `NIVEL_ARRASTRE`.
2. Con la cinta prendida, una vuelta entera de "Adiviná el tema": **el escalón de 0,1 s tiene
   que sonar igual que con la cinta apagada**. Si se nota la cama abajo, `BAJADA_SEG` no está
   haciendo su trabajo.
3. Tocar "Escuchá" seis veces seguidas: **la cama no puede entrar y salir entre toque y
   toque**. Si respira, `ESPERA_PARA_VOLVER_SEG` quedó corto.
4. Revelar un tema con el reproductor del tema entero y darle play: **la cama se calla**. Es
   el oído 2, y es el que ningún test de Node prueba de verdad.
5. Bloquear el teléfono treinta segundos con la cinta prendida: **silencio**. Desbloquear:
   vuelve.
6. Escuchar tres minutos seguidos sin tocar nada: **el bucle no se tiene que oír como bucle**.
   Si aparece un patrón, el sospechoso es `BAMBOLEO_HZ` contra `LARGO_BUCLE_SEG`.
