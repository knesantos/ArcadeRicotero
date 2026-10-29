# INV-200: la llave de silencio del iPhone y el motor de "Adiviná el tema"

> Pedida por el hilo principal el 2026-10-06, por un pedido del usuario: *"Investiga la forma
> de que el boton de silencio de iphone no silencie el juego adivina el tema"*. Problema: en
> iPhone con la llave lateral (o el Action button) en silencio, los fragmentos del reveal no
> suenan. El motor es `src/lib/tema/audio.ts`, con Web Audio sobre el `AudioContext` compartido
> de `src/lib/audio/contexto.ts`. El tema completo sí suena, porque va por `<audio controls>`.
>
> **Consume:** `ADR-04` (el contexto compartido), `D-14` (molinetes abiertos).
> **Afecta:** `D-66` (la decisión que sale de acá), `arquitectura` (dónde se asigna),
> `experiencia` (`UX-22` y `UX-24` mencionan la llave) y `revisor` (la prueba en dispositivo).
> **Fecha de consulta de todo lo de esta ficha: 2026-10-06.**
>
> **Escrita por `investigador`; pegada por el hilo principal**, porque el rol es de solo lectura.
>
> **Lo que esta ficha NO decide:** nada. Informa. Lo que se decidió está en `D-66`.

**Cómo leer los rótulos de fuente.**
- **abierta**: se leyó la página o el archivo.
- **solo buscador**: el host estaba bloqueado y solo se vio título o resumen del resultado de
  búsqueda.
- Certeza: **confirmado por fuente primaria** (código de WebKit, documentación de Apple,
  borrador del W3C, MDN) / **por fuente secundaria** (blogs, PRs de terceros, resúmenes del
  buscador) / **no verificado**.
- El código de WebKit es el de la rama `main` consultada el 2026-10-06. El que corre en un iOS
  16.4 a 26 puede diferir.
- **Nada de esta ficha se probó en un iPhone.** Todo "suena con la llave en silencio" sale del
  código de WebKit, de la documentación de Apple y de reportes de terceros.

| Ficha | Hallazgo | Certeza |
|---|---|---|
| `RES-200` | Web Audio sale como "ambient" (obedece la llave) y `<audio>` como "playback" (no) | primaria |
| `RES-201` | `navigator.audioSession` desde 16.4. `playback` mapea a la categoría que ignora la llave y, según la documentación, pausa la música ajena | primaria para API, valores y mapeo. Secundaria para el efecto en dispositivo |
| `RES-202` | Cuándo asignarla, bugs conocidos, WebView y PWA | mixta, casi todo no verificado |
| `RES-203` | Solo existe en WebKit. Asignar sin guarda tira `TypeError` | primaria |
| `RES-204` | Repuesto con `<audio>` mudo: qué hace cada librería | primaria sobre el código. No verificado en versiones de iOS |
| `RES-205` | Cobertura de iOS ≥ 16.4 | Apple primaria (solo iOS 26). El resto no verificado |
| `RES-206` | `MediaStreamAudioDestinationNode` hacia `<audio>` | no verificado |

---

## `RES-200`: Web Audio sale en la categoría "ambient", que obedece la llave. `<audio>` y `<video>` salen en "playback", que no

Consultado el **2026-10-06**. Certeza: **confirmado por fuente primaria** (puntos 1 a 4 y 7).
Los puntos 5 y 6 son **secundarios**.

**Lo que dicen las fuentes**

1. **Código de WebKit (abierta).** `MediaSessionManagerCocoa::updateSessionState` elige la
   categoría de la sesión con esta cadena, en este orden:
   - `categoryOverride`, si existe.
   - Captura de micrófono: `PlayAndRecord`.
   - Video audible: `MediaPlayback`.
   - Audio o video audible: `MediaPlayback`.
   - Recién al final, `else if (webAudioCount)`: `AmbientSound`.
   - URL: https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WebCore/platform/audio/cocoa/MediaSessionManagerCocoa.mm
2. **Código de WebKit (abierta).** `AudioSessionIOS.mm` traduce `AmbientSound` a
   `AVAudioSessionCategoryAmbient` y `MediaPlayback` a `AVAudioSessionCategoryPlayback`. El
   archivo no usa `MixWithOthers` en ningún lado. URL:
   https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WebCore/platform/audio/ios/AudioSessionIOS.mm
3. **Apple, Audio Session Programming Guide, tabla B-1 (documento de archivo, abierta).**
   - Ambient y Solo Ambient: silenciadas por la llave Ring/Silent y por el bloqueo de pantalla.
   - Playback: no silenciada por ninguna de las dos.
   - Playback "interrumpe el audio de apps no mezclables": sí, por defecto.
   - URL: https://developer.apple.com/library/archive/documentation/Audio/Conceptual/AudioSessionProgrammingGuide/AudioSessionCategoriesandModes/AudioSessionCategoriesandModes.html
4. **MDN (abierta, repo `mdn/content`).** Cuando el tipo es `auto`, "an `AudioContext` defaults
   to `ambient`". URL: https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/audio_session_api/index.md
5. **Bugs de WebKit (solo buscador; abrir antes de citar textual).**
   - 132096, "[iOS] Manage AudioSession category according to media type": WebAudio y
     `<audio>`/`<video>` quedan en categorías distintas. https://bugs.webkit.org/show_bug.cgi?id=132096
   - 237322 (marzo de 2022), "webaudio api is muted when the iOS ringer is muted", cerrado como
     RESOLVED CONFIGURATION CHANGED. https://bugs.webkit.org/show_bug.cgi?id=237322
   - 252746: el resumen dice que Web Audio nació para efectos cortos y de baja latencia y por eso
     se lo mapeó a "ambient", para que mezcle con la música. No se pudo confirmar quién lo
     escribió. https://bugs.webkit.org/show_bug.cgi?id=252746
   - 262781: un comentario de Alexey Proskuryakov lo describe como "by design".
     https://bugs.webkit.org/show_bug.cgi?id=262781
6. **Foros de Apple, abril de 2020 (abierta).** Personal de Apple: el interruptor controla el
   audio "regardless of volume". Y: "it's possible this behavior changed between iOS 12 and iOS
   13, and iOS is now honoring the mute switch". URL: https://developer.apple.com/forums/thread/126136
7. **Todo WebKit en iPhone (abierta).** App Store Review Guideline 2.5.6: las apps que navegan
   la web "must use the appropriate WebKit framework and WebKit JavaScript". Hay una excepción
   por entitlement de motor alternativo para la UE y Japón. URL:
   https://developer.apple.com/app-store/review/guidelines/

**Lectura de `investigador`** (no la dice la fuente)
- La premisa del pedido es correcta, con un matiz. La categoría es de la sesión de la página y
  la decide lo que suena en ese momento. Mientras un `<audio>` o `<video>` audible esté
  reproduciendo, la sesión es Playback y Web Audio viaja adentro. Por eso `<audio controls>`
  suena con la llave y los fragmentos no, y por eso el truco del `<audio>` mudo funciona. Es
  lectura del código, no prueba en dispositivo.
- Chrome y Firefox en iPhone usan WebKit por regla de Apple. Si hoy hay navegadores con motor
  propio en iPhone en la UE o Japón, no se verificó.
- No hay fecha firme de cuándo Web Audio empezó a obedecer la llave. Apple dice iOS 13, con un
  "es posible". El bug 251532 lo rotula REGRESSION de iOS 16.3 en WKWebView. No cambia la
  solución.

---

## `RES-201`: `navigator.audioSession` salió habilitada en Safari/iOS 16.4. `type = 'playback'` mapea a la categoría que ignora la llave y, según la documentación, pausa la música de otras apps

Consultado el **2026-10-06**. Certeza: **primaria** para exposición, valores y mapeo.
**Secundaria** para "suena con la llave en silencio" en dispositivo. **No verificado en
dispositivo** para "pausa a Spotify".

**Lo que dicen las fuentes**

1. **Versión.**
   - PR de WebKit #8770, bug 250764, "Enable AudioSession Web API by default, but only a reduced
     subset". Mergeado el 2023-01-19, autor youennf, revisor eric-carlson. Expone
     `navigator.audioSession` y `.type`, y deja `state` y los eventos detrás de otra bandera.
     (abierta) https://github.com/WebKit/WebKit/pull/8770
   - Soporte experimental inicial: PR #7190, mergeado el 2022-12-08. Según el resumen introduce
     `categoryOverride`. (abierta) https://github.com/WebKit/WebKit/pull/7190
   - MDN browser-compat-data: Safari `16.4`. Safari iOS espeja a Safari. `experimental: true`,
     `standard_track: true`. (abierta)
     https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/AudioSession.json y
     https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/Navigator.json
2. **Banderas hoy.** (abierta, `UnifiedWebPreferences.yaml`, rama `main`)
   - `DOMAudioSessionEnabled` ("AudioSession API"): status `mature`, `true` por defecto. Solo es
     `false` en WebKitLegacy.
   - `DOMAudioSessionFullEnabled`: status `testable`, `false` en todas las plataformas. Ahí viven
     `state` y `onstatechange`.
   - Coincide con el bug 283417 (2024-11-20, Safari 18.1.1, solo buscador): "Safari seems to
     implement only `type` for now". https://bugs.webkit.org/show_bug.cgi?id=283417
3. **Valores válidos.** `auto` (el predeterminado), `playback`, `transient`, `transient-solo`,
   `ambient`, `play-and-record`.
   - Fuentes: el IDL de WebKit, el explainer del W3C
     https://github.com/w3c/audio-session/blob/main/explainer.md, el borrador
     https://raw.githubusercontent.com/w3c/audio-session/main/index.bs y MDN
     https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/audiosession/type/index.md.
     Todas abiertas.
4. **Mapeo en WebKit.** (abierta, `DOMAudioSession.cpp`)
   https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WebCore/Modules/audiosession/DOMAudioSession.cpp
   - `auto` pasa a `None`: no hay override.
   - `playback` pasa a `MediaPlayback`.
   - `transient` pasa a `AmbientSound`.
   - `transient-solo` pasa a `SoloAmbientSound`.
   - `ambient` pasa a `AmbientSound`.
   - `play-and-record` pasa a `PlayAndRecord`.
   - En la tabla de Apple (`RES-200`, punto 3), Ambient y Solo Ambient son las silenciadas por la
     llave.
   - El bug 264473 (solo buscador) se titula "no sound from HTMLAudioElement when
     `navigator.audioSession.type` is set to transient or transient-solo". Es coherente con ese
     mapeo.
5. **Efecto de `playback` sobre otras apps.**
   - Borrador del W3C: un tipo exclusivo activo "can pause the audio of another tab or another
     application".
   - MDN: `playback` "is an exclusive type that will pause other playback audio on the device".
   - WebKit: no hay `MixWithOthers` (`RES-200`, punto 2). Apple: Playback interrumpe por defecto
     el audio no mezclable.
   - El explainer del W3C aclara que el audio de Web Audio y WebRTC no entra en su lógica de foco
     automático.
6. **Efecto sobre Web Audio.** `categoryOverride` es lo primero de la cadena de `RES-200`,
   punto 1. Un override en `playback` deja a Web Audio en la categoría Playback.
7. **Terceros (abiertas, secundarias).** Al menos ocho repos de GitHub, todos PRs de 2026,
   hacen `navigator.audioSession.type = 'playback'` para saltar la llave.
   - Lista: https://github.com/tucktuck22/ski-game/pull/24,
     https://github.com/sinaida-space/infinite-voidsong/pull/24,
     https://github.com/AriSweedler-at/hyperagent-web-apps/pull/128,
     https://github.com/pajew-ski/open-entrainer/pull/3,
     https://github.com/sammcj/smcleod/pull/664,
     https://github.com/zophiezlan/spectral-synth/pull/46,
     https://github.com/unfoldingWord/tc-mobile/pull/1116,
     https://github.com/freaxnx01/game-kit-racer/issues/12.
   - Ninguno adjunta una prueba reproducible. `tc-mobile` dice expresamente "no device testing".
     `smcleod` afirma que está confirmado en iOS 26 Safari, sin evidencia.

**Contradicción entre fuentes.** Varias fuentes secundarias dicen "desde iOS 17": los PRs de
`hyperagent-web-apps` y `open-entrainer`, y los resúmenes del buscador. Otras dicen "16.4":
`ski-game`, `spectral-synth`, `tc-mobile`. La fuente primaria dice 16.4 para la **exposición**
de la API (PR del 2023-01-19 más MDN). No se encontró fuente primaria que diga desde qué versión
`playback` afecta a Web Audio. El mecanismo de override existe desde diciembre de 2022. "Desde
iOS 17" queda **no verificado**: puede venir de un comentario del bug 237322 que no se pudo
abrir.

**Lectura de `investigador`**
- Es consecuencia directa del código y de la tabla de Apple que `playback` saque a Web Audio de
  la categoría silenciable. Falta la prueba en un iPhone real.
- Lo esperable es que el primer sonido de la página pause a Spotify o Música. El tema completo en
  `<audio controls>` ya está en Playback y ya debería hacerlo hoy.
- No se sabe si la pausa ocurre al asignar el tipo o al primer sonido. En iOS, cambiar la
  categoría no interrumpe a nadie y activar la sesión sí. Es inferencia, no verificado.
- `transient` y `ambient` no sirven: siguen siendo `AmbientSound`. `play-and-record` fuerza el
  modo de grabación y WebKit le agrega opciones de Bluetooth: riesgo de ruteo, por ejemplo hacia
  auriculares, pero es inferencia.

---

## `RES-202`: cuándo asignarla, bugs conocidos y WebView/PWA: casi todo sin fuente firme

Consultado el **2026-10-06**. Certeza: la lectura del código es **primaria**. Los bugs son
**secundarios** (solo buscador). WebView, PWA y regresiones de iOS 17, 18 y 26: **no
verificado**.

**Lo que dicen las fuentes**

1. **Orden: ¿antes o después de crear o reanudar el contexto?**
   - `AudioSession::setCategoryOverride` aplica `setCategory` en el momento, si el override no
     es `None`. (abierta)
     https://raw.githubusercontent.com/WebKit/WebKit/main/Source/WebCore/platform/audio/AudioSession.cpp
   - `AudioSessionIOS::setCategory` se niega a cambiar la categoría mientras haya override:
     loguea "override set, NOT changing".
   - `updateSessionState` mira el override primero (`RES-200`, punto 1).
   - Ningún documento oficial habla del orden.
   - Los PRs de terceros la ponen **antes** de crear el `AudioContext`. `ski-game#24`: "before
     the AudioContext exists". `infinite-voidsong#24`: "before the AudioContext is created".
     Ninguno prueba que después falle.
2. **Gesto de usuario.** `DOMAudioSession::setType` no chequea gesto ni visibilidad en el código
   leído. Solo lanza `InvalidStateError` si no hay documento o página. `AudioContext.resume()`
   sigue necesitando gesto, como ya maneja `contexto.ts`.
3. **Permissions Policy.** `setType` no hace nada, sin error, si el documento no tiene permitido
   el feature `microphone`. El getter devuelve `auto`. En una página de primer nivel como la del
   sitio no aplica. En un iframe de otro origen sin `allow="microphone"` el tipo se ignora.
4. **Bugs de WebKit relacionados (solo buscador).**

| Bug | Qué es | Dato |
|---|---|---|
| 283417 | `navigator.audioSession.state` es `undefined` | 2024-11-20, Safari 18.1.1. Safari implementa solo `type`. |
| 264473 | `<audio>` sin sonido con `transient` y `transient-solo` | iOS 17, fecha no confirmada. No afecta a `playback`. |
| 251532 | "REGRESSION (iOS 16.3): WebAudio muted when the silent switch is ON and when app goes to background" | WKWebView, 2023-02-01, RESOLVED INVALID. |
| 276687 | Web Audio queda en silencio, con el contexto en `running` y el reloj avanzando, al volver de segundo plano o cerrar otra pestaña con audio | 2024-07-16. Estado NEW en el resumen. Estado de hoy desconocido. |

5. **WebView, PWA instalada, WhatsApp e Instagram.** No se encontró fuente. Dato de contexto: la
   bandera está encendida por defecto en WKWebView (solo WebKitLegacy la tiene apagada). Eso
   dice que la API existe ahí, no que el audio de la app anfitriona deje a WebKit mandar. Un
   resumen del buscador asocia a la PWA instalada un reporte de que el Web Audio deja de sonar al
   volver del segundo plano y mejora con `resume()` en `visibilitychange`, pero ese bug no se
   pudo abrir.

**Lo que NO se encontró** (ausencia de evidencia, no evidencia de ausencia)
- Ningún reporte de que `type = 'playback'` no tome efecto hasta recrear el contexto.
- Ninguna regresión específica de `playback` en iOS 17, 18 o 26.
- Ninguna fuente sobre que se pierda la asignación al ir a segundo plano.

**Lectura de `investigador`**
- Por el código, asignarla vale en cualquier momento. La práctica de terceros es antes de crear
  el contexto, y poner el tipo antes cuesta cero.
- El estado `interrupted` del contexto (llamada, segundo plano) ya lo maneja `contexto.ts`. Nada
  de esto lo cambia.

---

## `RES-203`: la API solo existe en WebKit. Asignarla sin guarda tira `TypeError`, no es un "no pasa nada"

Consultado el **2026-10-06**. Certeza: **primaria** (compat-data de MDN y semántica del
lenguaje).

**Lo que dicen las fuentes**
- MDN browser-compat-data (abierta): `AudioSession` y `Navigator.audioSession` tienen Chrome y
  Edge `version_added: false`. Firefox, escritorio y Android, `"preview"`, o sea solo builds de
  prueba. Safari 16.4. `experimental: true`, `standard_track: true`. URLs en `RES-201`, punto 1.
- Estado de la especificación: Editor's Draft en `index.bs` (abierta). El índice del buscador
  también muestra versiones Working Draft de noviembre de 2024 en `w3.org/TR/audio-session/`,
  que no se pudieron abrir.

**Lectura de `investigador`**
- Donde `navigator.audioSession` es `undefined` (Chrome Android, Firefox estable),
  `navigator.audioSession.type = 'playback'` tira `TypeError`. Es la semántica de JavaScript.
- Hace falta guarda (`'audioSession' in navigator`) y conviene envolver la asignación en
  `try/catch`, porque el setter puede lanzar `InvalidStateError` (`RES-202`, punto 2).
- Esa guarda y esa lectura van adentro de la función, nunca al cargar el módulo, como ya exige
  el criterio de `contexto.ts` para que se pueda probar.

---

## `RES-204`: el repuesto con `<audio>` mudo: qué hace cada librería, efectos colaterales y licencia

Consultado el **2026-10-06**. Certeza: **primaria** sobre lo que hace el código de cada librería
y su licencia. **No verificado** el umbral de versión de iOS, la batería y el efecto sobre música
ajena.

**`unmute-ios-audio` (feross)** (abierta) https://github.com/feross/unmute-ios-audio
- Detecta iOS con `navigator.maxTouchPoints > 0 && AudioContext != null`, sin mirar versión ni
  user agent.
- Escucha nueve eventos de activación: `auxclick`, `click`, `contextmenu`, `dblclick`,
  `keydown`, `keyup`, `mousedown`, `mouseup`, `touchend`.
- Crea un `<audio>` con un WAV silencioso generado en base64, con `audio.loop = true` y
  `x-webkit-airplay="deny"`. Lo toca y **no lo pausa ni lo saca** después de desbloquear, así
  que el audio mudo sigue sonando en loop.
- Además crea un `AudioContext` y dispara un buffer de una muestra
  (`createBuffer(1, 1, 22050)`).
- Saca los listeners recién cuando ambos caminos quedaron en `allowed`. No tiene manejo de
  visibilidad.
- Licencia: **MIT**, Feross Aboukhadijeh.
- Último commit visible: 2020-10-21 (v3.3.0). No hay releases en GitHub.
- Issues abiertos:
  - #10 (2021-05-17): el reportante dice que la v3.1.0 anda en iOS 12.5.3 y que la v3.2 y la
    v3.3 fallan en iOS 14.5. Sin respuesta visible.
  - #11 (2021-05-25): el sitio aparece como fuente de reproducción en la pantalla bloqueada. Sin
    respuesta.
  - #15 (2024-09-26): "nolonger needed since iOS 17", con un único enlace al bug 237322.

**`unmute` (swevans)** (abierta) https://github.com/swevans/unmute
- Usa un `<audio>` con un MP3 silencioso de 0,01 s en data URI, con `loop = true`,
  `controls = false`, `x-webkit-airplay="deny"` y `disableRemotePlayback = true`.
- Lo mantiene sonando **solo mientras la página está visible**, y en iOS solo si
  `document.hasFocus()`.
- Reanuda los `AudioContext` en la interacción y los pausa cuando la página se oculta.
- Opciones: `allowBackgroundPlayback` (por defecto `false`) y `forceIOSBehavior` (por defecto
  `false`).
- Detecta iOS por user agent, más `maxTouchPoints > 0` para los iPad que se hacen pasar por Mac.
- Licencia: **MIT**, Spencer Evans, 2020. README actualizado el 2021-11-23. 21 commits, 155
  estrellas, no figura archivado.
- Issues abiertos: #8 (2022-11-07), la demo no reanuda el audio al volver de otra pestaña. #10
  (2024-09-26), el mismo "no longer needed since iOS 17" apuntando al mismo bug.
- El README admite dos molestias:
  - El canal puede quedar silenciado al volver de otra pestaña hasta que la persona toque algo.
  - Con `allowBackgroundPlayback` iOS muestra controles en la pantalla bloqueada que "don't do
    anything meaningful".

**Umbral de versión de iOS.** Ninguna de las dos documenta desde qué iOS hace falta un `<audio>`
mudo en loop y no alcanza tocarlo una vez. Las dos lo loopean desde su diseño, en 2019 y 2020.
Hay un dato indirecto, **secundario** y de fecha dudosa: Jeremy Keith, en el post "Web Audio API
update on iOS", cuenta que el truco de un mp3 mudo de un segundo dejó de funcionar y que el Web
Audio "plays for one second and then stops". Un resumen de búsqueda lo fecha el 2023-02-22; la
página no se abrió. La fecha coincide con iOS 16.3 (enero de 2023). Es una correlación, no una
causa confirmada. https://adactio.com/journal/19929 (solo buscador)

**Efectos colaterales**
- Pantalla bloqueada o Centro de control: hay un reporte (feross #11) y la advertencia del README
  de swevans. `x-webkit-airplay="deny"` y `disableRemotePlayback` son los intentos de ocultarlo.
  No se verificó cuánto lo logran en iOS 16.4 a 26.
- Batería: sin fuente.
- Música de otras apps: ningún README lo menciona. Por la cadena de `RES-200`, un `<audio>`
  audible pone la sesión en Playback, que por defecto interrumpe el audio no mezclable.
  Inferencia, no verificado.
- Un `<audio>` con `muted` probablemente no cuenta como audible para WebKit, porque la condición
  del código incluye `session.isAudible()`. Las dos librerías usan una pista real con volumen.
  Inferencia.

---

## `RES-205`: cobertura. Apple solo publica iOS 26. No hay dato firme de la cola vieja

Consultado el **2026-10-06**. Certeza: **primaria** para lo de Apple. Lo demás, **no
verificado**.

**Lo que dicen las fuentes**
1. **Apple (abierta), medido el 2026-06-07.** iOS 26 corre en el **86%** de los dispositivos
   presentados en los últimos cuatro años y en el **79%** de todos los dispositivos. La página no
   desglosa iOS 18 ni anteriores. https://developer.apple.com/support/app-store/ (un resumen de
   búsqueda da 74% y 66% para el 2026-02-12, solo buscador.)
2. **StatCounter (solo buscador, host bloqueado; las cifras son del resumen del buscador).**
   - Mundo, julio de 2026: 26.5 con 62,6%, 18.7 con 10,57%, 26.3 con 2,92%, 26.2 con 2,51%, 26.4
     con 2,49%, 18.6 con 2,11%. https://gs.statcounter.com/ios-version-market-share/
   - Argentina, julio de 2026: 26.5 con 74,58%, 18.7 con 7,76%, 26.3 con 2,82%, 26.2 con 2,18%,
     18.6 con 1,87% y **16.7 con 1,59%**.
     https://gs.statcounter.com/ios-version-market-share/all/argentina
   - Argentina, junio de 2026, vistas "mobile" y "mobile y tablet": aparece un bucket rotulado
     **"iOS 11.0"** con 6,78% a 7,15%.
     https://gs.statcounter.com/ios-version-market-share/mobile/argentina
3. **Qué equipos quedan abajo de 16.4 (secundaria).**
   - Tope de iOS 15: iPhone 6s, 6s Plus, SE de 1.ª generación, 7 y 7 Plus.
     https://www.imore.com/my-iphone-compatible-ios-16
   - iPhone 8, 8 Plus y X: tope iOS 16. https://9to5mac.com/2023/06/05/ios-17-compatible-iphone/
   - iOS 17 pide A12 o posterior.

**Lectura de `investigador`** (estimación, no dato)
- Los equipos que no pueden tener la API son los de tope iOS 15 y los que se quedaron en 16.0 a
  16.3. Los iPhone 8 y X en 16.7.x sí la tienen.
- Todo lo que aparece en las cifras de StatCounter, salvo el bucket "iOS 11.0", es 16.4 o más.
  La estimación es que la cola sin API es de un dígito bajo, pero **no hay cifra publicada** y no
  se puede respaldar.
- El bucket "iOS 11.0" no se sabe interpretar. Puede ser un artefacto de detección de user agent.
  Si fuera real, esos equipos no tienen la API, pero tampoco correrían el sitio. Quien tenga
  acceso a StatCounter debería abrir la página y mirarlo.

---

## `RES-206`: sacar Web Audio por `MediaStreamAudioDestinationNode` hacia un `<audio>.srcObject`. No hay fuente seria

Consultado el **2026-10-06**. Certeza: **no verificado**.

**Lo que se encontró**
- Un único PR de terceros,
  https://github.com/Forthehopefulromantics/subliminally/pull/23 (abierta), conecta once puntos
  del grafo a un `MediaStreamDestination` hacia un `<audio>`, con el argumento "Web Audio plays
  in the ambient category… a media element plays in playback". No dice versión de iOS, no mide
  latencia y no declara prueba en dispositivo. Mantiene `ctx.destination` como respaldo si
  `createMediaStreamDestination` falla.
- Un issue de 2018, https://github.com/WebAudio/web-audio-api/issues/1722 (abierta, cerrado sin
  resolver): en iOS 11 Safari un stream de `createMediaStreamDestination` no sonaba en ningún
  montaje probado.

**Lectura de `investigador`**
- Por la cadena de `RES-200`, un `<audio>` con un stream audible debería llevar la sesión a
  Playback. Es inferencia, sin prueba.
- No se encontró ninguna medición de latencia ni de problemas en iOS 16.4 a 26. Para el reveal
  desde 0,1 s la latencia es el dato que importa, y no existe.

---

## Sin resolver

- **Prueba en iPhone real.** Nadie tiene prueba reproducible de `type = 'playback'` con Web Audio
  y la llave en silencio en iOS 16.4, 17, 18 y 26. Hace falta un dispositivo.
- **Pausa de música ajena.** No se sabe si ocurre al asignar el tipo o al primer sonido, ni si
  afecta a Spotify y a Música igual.
- **Orden de asignación.** El código dice que vale en cualquier momento. La práctica de terceros
  es antes. Sin prueba de que después falle.
- **WebView de WhatsApp o Instagram y PWA instalada.** Sin fuente.
- **Bugs de WebKit.** `bugs.webkit.org` no abrió. Para citar textualmente los bugs 237322,
  252746, 262781, 251532, 264473, 283417 y 276687 hay que abrirlos. El comentario de 237322
  puede resolver el "desde iOS 17".
- **StatCounter.** Cifras vía buscador y el bucket "iOS 11.0" sin explicar.
- **Post de Keith.** La fecha no se confirmó abriendo la página.
- **Action button en modo silencio.** No se verificó que se comporte igual que la llave. El
  mecanismo es la categoría de AVAudioSession, que no distingue entre las dos. Inferencia.
- **Hosts bloqueados por el proxy de egreso**, para que quien tenga acceso los cierre:
  `bugs.webkit.org`, `auto-bugs.webkit.org`, `developer.mozilla.org` (páginas; el repo
  `mdn/content` sí abrió), `www.w3.org`, `w3.org/TR`, `webkit.org`, `caniuse.com`,
  `gs.statcounter.com`, `trac.webkit.org`, `adactio.com`, `news.ycombinator.com`, `bugnet.io`,
  `huddee.com`, `nattog.dev`, `audjust.com`, `jordaneldredge.com`.
