# INV-03 — Spotify Free en Argentina: reproducción a demanda (`E-07`)

> Producida por `investigador` el 2026-08-19, tarea `T-13` del ciclo 1.
> Escrita por el hilo principal: `investigador` es read-only por diseño.
>
> Consume: `ADR-01`, `RES-01`, `D-08`. Desbloquea: `ADR-01` (parcialmente).
> Numeración: `RES-10`, del rango reservado a la sesión principal en `Docs/IDS.md`.

---

## RES-10 — Reproducción a demanda en Spotify Free, móvil, Argentina

**Contexto de la pregunta.** `ADR-01` descartó con evidencia el `preview_url` y el Web
Playback SDK (`RES-01`). Quedan el embed y el deep link, y **el deep link es el único
camino que queda al tema completo**. Si un usuario free no puede reproducir a demanda,
ninguna vía cumple lo que el brief prometía. De ahí el peso de esta ficha.

### (a) El modelo cambió en septiembre de 2025 — fuente primaria

- **Hallazgo:** el 15-sep-2025 Spotify anunció tres funciones para el plan gratuito —
  **Pick & Play** (tocar y elegir cualquier canción), **Search & Play** (buscarla y
  reproducirla al instante) y **Share & Play**— que **rompen el modelo histórico de "solo
  shuffle" en móvil**. El comunicado dice "rolling out globally" y **no nombra países
  excluidos ni incluidos**.
  URL: https://newsroom.spotify.com/2025-09-15/free-experience-updates-features-tips/
  Consultado: 2026-08-19 · **verificado — fuente primaria (Spotify Newsroom)**
- **Lo que el comunicado NO dice, y hay que no leerle de más:** no confirma Argentina por
  nombre, no distingue Android de iOS para esta función, y **no aclara si aplica al
  reproductor web** o solo a la app móvil. Esa última omisión es la que más importa acá,
  porque el reproductor web es justamente el destino del deep link cuando el jugador no
  tiene la app instalada.

### (b) Hay un cupo diario, y su valor no se divulgó — secundario consistente

- **Hallazgo:** TechCrunch, Music Business Worldwide y Ghacks (15 al 17-sep-2025) coinciden
  en tres cosas: la función es **solo app móvil**, hay una **asignación diaria de "tiempo
  on-demand"** cuyo valor exacto **Spotify no reveló**, y **al agotarse se vuelve a
  shuffle**, con saltos limitados por hora.
  URLs: https://techcrunch.com/2025/09/15/spotify-will-now-let-free-users-pick-and-play-tracks/
  · https://www.musicbusinessworldwide.com/spotify-scraps-shuffle-restriction-for-users-of-free-tier/
  · https://www.ghacks.net/2025/09/17/spotify-free-users-can-now-search-and-play-tracks/
  Consultado: 2026-08-19 · **secundario periodístico — varios medios independientes
  coinciden, pero no es fuente oficial**
- Ninguna de esas notas menciona Argentina ni Latinoamérica, ni diferencia plataformas para
  esta función: tratan el cambio como uniforme y global.

### (c) Tensión sin resolver con el soporte oficial vigente

- **Hallazgo:** el artículo de soporte de Spotify sobre shuffle, consultado hoy, **todavía
  dice que en móvil gratuito Smart Shuffle está siempre activo**, y no menciona Pick & Play
  ni la posibilidad de elegir tema a demanda.
  URL: https://support.spotify.com/co/article/shuffle/
  Consultado: 2026-08-19 · **verificado que el texto dice eso**, sin fecha de última
  edición visible
- **No se puede resolver la contradicción con lo que hay.** Puede ser documentación sin
  actualizar, o puede describir el estado *después* de agotar el cupo diario, que sí vuelve
  a shuffle. Queda como **alerta, no como hecho firme en ninguna de las dos direcciones**.

### (d) `E-11` — el deep link sin la app instalada

- Lo cubierto por `RES-01`(d) sigue vigente: Spotify documenta el deep link como **patrón
  recomendado** (universal link con fallback al navegador o webview), no como
  comportamiento garantizado por el sistema operativo.
- **Sobre si el reproductor web exige login antes de sonar:** no se encontró fuente
  primaria. Lo disponible es material secundario de bajo valor —blogs de instrucciones, no
  soporte oficial— que dice que la web pide iniciar sesión para el tema completo y que sin
  cuenta solo suenan previews. **Coincide con la leyenda técnica ya rotulada en
  `RES-01`(c), pero no la asciende a verificada.**
  Consultado: 2026-08-19 · **no verificable con fuente oficial — rotulado como empírico**

---

## Respuesta a `E-07`, con sus límites

**Sí, con condiciones.** Post 15-sep-2025, un usuario free en móvil puede elegir y
reproducir un tema puntual, pero con un **cupo diario no divulgado** que al agotarse lo
devuelve a shuffle.

Tres cosas que **no** quedaron confirmadas, y conviene no darlas por ciertas:

1. **Que Argentina esté incluida.** El comunicado dice "global" sin excepciones nombradas,
   así que la inferencia razonable es que sí. Es **inferencia, no confirmación directa**.
2. **Que el reproductor web herede la capacidad on-demand.** Es el destino real del deep
   link cuando no hay app instalada, y ninguna fuente lo distingue de la app.
3. **Cuánto dura el cupo diario.** Spotify no lo reveló ni a la prensa ni en el comunicado.

## Qué significa esto para el proyecto

- **`ADR-01`:** el deep link **no queda descartado**, que era el peor escenario posible.
  Pero tampoco queda confirmado como camino garantizado al tema completo: el cupo diario
  y la incógnita del reproductor web mantienen la incertidumbre. `arquitectura` decide si
  esto alcanza para cerrar, o si necesita además la prueba empírica del usuario.
- **`BR-06` de `producto` queda reforzada, no contradicha.** La regla promete *acceso* al
  tema y no *reproducción íntegra*, y esta ficha muestra exactamente por qué esa fue la
  redacción correcta: aun con la respuesta a favor, el cupo diario haría de "escuchá el
  tema completo" una promesa que falla para el jugador que ya usó su cuota ese día.
- **La prueba empírica del usuario sigue valiendo la pena**, y ahora es más específica:
  abrir el deep link desde un celular en Argentina **sin sesión Premium**, y anotar si el
  tema suena a demanda o entra en shuffle.

## Sin resolver

- Si Argentina está explícitamente en el rollout de Pick & Play.
- Si el reproductor web tiene la misma capacidad on-demand que la app, o sigue atado a
  shuffle y login.
- La duración del cupo diario de tiempo on-demand.
- La contradicción entre el comunicado del 15-sep-2025 y el artículo de soporte vigente.
