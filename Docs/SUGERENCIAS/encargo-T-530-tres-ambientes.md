# Encargo `T-530` (`D-91`): tres ambientes del bestiario, pulidos al máximo, y un velo que sea loader

Escrito por el hilo principal el 2026-11-15 para el agente que construye (Fable). Se trabaja en
el worktree `.claude/worktrees/bestiario-tres-ambientes`, rama `worktree-bestiario-tres-ambientes`.

## El pedido del usuario, textual

> *"Hacé una auditoría sobre el bestiario ricotero, buscá cosas que no se vean bien, ambientes
> mejorables y diseños que se puedan mejorar [...] Quiero mejorar la inmersión. Que se pueda hacer
> zoom, que tenga más misterio y efectos, nieblas, mejores animaciones, una mejora total manteniendo
> la esencia y el alma y el diseño rocambolesco ante todo pero darle músculo [...] hacer las vueltas
> en 3 ambientes máximo [...] pulirlos al máximo y luego pasar a otros tres. [...] Los loaders están
> muy bien pero no hace de loader, nunca termina de cargar y además a veces como que se traba y ni
> muestra el loader."*

Esto ya tuvo un ciclo (`D-90`, ocho rondas, trece regiones a la vez). Este es distinto: **tres
regiones, varias vueltas, hasta que estén terminadas de verdad**. Profundidad, no amplitud.

## Antes de tocar nada, leé

1. `.claude/rules/bestiario-inmersion.md` — **entera**. Es lo aprendido en `D-90`, en parte escrito
   por vos. Es ley: lo soplado se imprime, el teléfono solo mueve `transform`/`opacity`, el tope del
   quinto, nada fijo sobre la cara de un bicho, la luz toca con el filo, una capa de pantalla entera
   cuesta 2–5 ms.
2. `.claude/rules/diseno-marca.md` (cero sombras, tokens solo en `tokens.css`, velo plano, máscara
   cruzada con textura) y `.claude/rules/voz-ricotera.md` (si escribís algo que se lee).
3. `D-90` y sus enmiendas en `Docs/DECISIONES.md`, `D-73` por encima.
4. El código: `src/lib/bestiario/aire.ts`, `arte-aire.ts`, `arte-suelo.ts`, `velos.ts`,
   `arte-velos.ts`, `escena-monte.ts`, `escenas-camino.ts`, `escenas-entornos.ts`, `lupa.ts`,
   `src/scripts/camino.ts`, `src/scripts/bestiario/*.ts`, `scripts/imprimir-bestiario.mjs`,
   `src/pages/redondopedia/bestiario/[region].astro`, y las reglas `.velo-de-llegada` de
   `src/styles/sitio.css`.

## Las tres regiones de esta tanda: el monte, la pastura y la ruta

Lo que el hilo principal vio en las capturas a 430×860 (están en el scratchpad, te paso las rutas):

- **El monte** (`el-monte`, *Lobo suelto*): es la puerta del bestiario y la región más vista, y es la
  más floja. La línea de árboles de arriba es **un serrucho repetido**, dientes iguales a la misma
  altura: se lee como una estantería, no como un monte. Todo es barro marrón de un solo valor, sin
  profundidad entre el fondo y el piso. Los bichos quedan chicos en el tercio de abajo y la mitad de
  arriba de cada pantalla es serrucho. Al llegar se ve un fantasma de la lista del cruce (“Elegí para
  dónde seguir”) antes de que arranque la isla.
- **La pastura** (`la-pastura`): **usa el mismo serrucho y el mismo barro** que el monte; no tiene
  identidad propia. La primera pantalla no tiene ningún bicho. El claro del cordero tendría que ser
  un lugar distinto: pasto, alambrado, el cielo abierto, algo de *“el cordero”* y no del monte.
- **La ruta** (`la-ruta`, *Último bondi*): la noche está bien armada (postes, cables, el pueblito,
  el cielo con estrellas) pero es **plana y vacía**: una ruta derecha, pasto parejo, nada que se
  pierda en la distancia. Los faros son la gran oportunidad.

## Qué es “pulido al máximo” en estas tres

Mantené el alma: el aerógrafo de Rocambole con grano, la tinta de la tapa de cada región, el
misterio, lo rocambolesco. Y dale músculo. Ideas para que tomes, descartes o superes — **sos vos el
que tiene que sorprender**:

- **Profundidad de verdad**: planos que se separan por valor y por niebla (lo lejano más claro y
  frío, lo cercano oscuro y caliente), siluetas recortadas que no se repiten, un horizonte que
  respira. El monte necesita árboles con personalidad — troncos torcidos, ramas como manos, algún
  árbol que sea casi una cara — y no dientes.
- **Niebla con cuerpo**: bancos que se mueven a distintas velocidades según el plano, que se abren
  al caminar y se cierran detrás, que dejan ver y tapan. Niebla baja que lame el piso en la pastura,
  bruma de ruta que se traga los postes de a uno.
- **Misterio**: lo que se ve a medias, lo que cambia si volvés, lo que aparece solo si te quedás o
  si hacés zoom. Una silueta que no estaba. Unos faros a lo lejos que nunca llegan. Ojos en el monte
  que se corren de árbol. El lobo que se adivina antes de verse.
- **La lupa que premia**: con zoom, que haya cosas que solo se ven de cerca (una inscripción en un
  tronco, un bicho chiquito, un detalle de la letra escondido). Hoy con la lupa al máximo la imagen
  se ve blanda: si podés, un segundo tamaño impreso para lo que se mira de cerca.
- **Animaciones**: viento que pasa por el pasto en ola, ramas que se mecen con peso, la luz de los
  faros que barre y prende el filo de lo que toca, polillas en el haz.
- **Que cada región se distinga de un vistazo** en una captura chica: si tapás el cartel y no sabés
  dónde estás, no está terminada.

Las tres son exteriores de noche: aprovechalo para que compartan un lenguaje (cielo, niebla,
viento) **sin compartir el dibujo**.

## El velo que tiene que ser loader (arreglo, va primero)

Diagnóstico del hilo principal, medido con Edge sin ventana a 430×860:

1. **El velo no se ve al llegar**: en la captura de `DOMContentLoaded` no aparece en ninguna de las
   trece regiones. Es `background: var(--velo)` sin color debajo: hasta que el webp se decodifica es
   transparente. Y dura un tiempo fijo (900 ms) contado desde que se estila.
2. **No espera a nada**: cada región baja de 100 a 160 webp; en local se asienta a los 3,5–4,8 s.
   En un teléfono con 4G, bastante más. El velo ya se fue y la gente ve la región armarse de a
   pedazos: *“nunca termina de cargar”*.
3. **“Se traba y ni muestra el loader”**: al tocar un cartel o «Al plano», la página que se deja no
   hace nada hasta que llega la siguiente: no hay respuesta inmediata al toque.

Lo que tiene que quedar (el cómo es tuyo):

- **Tapa desde el primer cuadro**, con tinta sólida debajo de la hoja impresa (de `tokens.css`), y
  la hoja encima cuando llega.
- **Espera a lo que importa**: el piso, el fondo lejano y las capas de la primera pantalla
  decodificados (`img.decode()` o equivalente) y la isla arrancada (sin el fantasma de la lista).
  Mientras espera, **muestra que está cargando** con algo de la región — una mano de su tapa, no una
  barra de progreso genérica ni un spinner. Si hay texto, registro 3 de `voz-ricotera.md`: seco.
- **Nunca deja a nadie adentro** (`ADR-03`, molinetes abiertos): si la isla falla o no hay
  JavaScript, el velo se va solo por CSS a los pocos segundos (un retardo de respaldo), y siempre hay
  un tope aunque la red sea mala. Con movimiento reducido, corte sin animación.
- **Responde al toque al irse**: al tocar un cartel o «Al plano», la hoja de la región de destino
  (ya prefetcheada) entra en la página que se deja. Mirá `@view-transition { navigation: auto; }`
  (transición entre documentos) como camino principal, con lo que haga falta para los navegadores
  que no la tienen.
- **Va en las trece regiones y en el plano**, no solo en las tres de la tanda: es un arreglo.
- Anotá el cambio de `ADR-03` como propuesta en `Docs/SUGERENCIAS/` si lo que hacés lo roza; no
  edites `Docs/ARQ/`.

## Cómo es cada vuelta

1. Construís. Primero los arreglos de lo que se vio mal, después lo nuevo.
2. Reimprimís solo lo tuyo (`node scripts/imprimir-bestiario.mjs --solo <piezas>`; mirá los flags).
3. Corrés, desde el worktree, con el `node_modules` del checkout principal (no instales nada):
   - `node --test` como lo corre `npm test` (mirá `package.json`): tienen que pasar los ~2470.
   - `node ../../../node_modules/astro/astro.js check --root .`
   - `node ../../../node_modules/astro/astro.js build --root .`
4. **Mirás**: el hilo principal tiene un servidor de vista previa en `http://localhost:4381` sobre el
   `dist/` de este worktree (rearrancá el build y queda servido). Tenés dos scripts en el scratchpad:
   `auditar.mjs` (capturas por región con Edge sin ventana: `node auditar.mjs <salida> el-monte,la-pastura,la-ruta`,
   con `--compu` para 1280×800 y `--lento` para red de 4G) y `hoja.mjs` (hoja de contacto). Mirá tus
   capturas antes de entregar. El perfil de Edge va adentro del scratchpad (ya lo hace el script).
5. Nuevos tests donde se pueda medir (el velo tiene que tener los suyos: que tape con tinta, que
   tenga el respaldo de CSS, que exista en las trece y en el plano).
6. **Commits chicos**, archivo por archivo (`git add <archivo>`, **nunca** `-a` ni `.`: hay archivos
   de `.claude/` modificados que no son tuyos). Mensaje en castellano, terminado en
   `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`.
7. No toques `src/lib/bestiario/elenco.ts` ni `src/scripts/bestiario/vivos.ts`: otra sesión está
   sumando bestias ahí (`T-529`). Si una de tus regiones necesita mover un bicho, decilo.
8. No escribas en `ESTADO.md` ni en `Docs/DECISIONES.md`: eso lo hace el hilo principal.

## Qué devolvés al cerrar cada vuelta (corto)

- Qué hiciste, región por región, separando **lo visto** en tus capturas de **lo escrito**.
- Rutas de 2–4 hojas de contacto que muestren el antes y el después en la misma posición.
- Tests, check, build: números.
- Lo que no te convence de lo tuyo.
- **Tu top 5 para la vuelta siguiente**, en estas mismas tres regiones.
