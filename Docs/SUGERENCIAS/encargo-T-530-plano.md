# Encargo `T-530` (`D-91`), tanda 6: el plano del bestiario

Escrito por el hilo principal el 2026-11-17. Sigue a los encargos de las tandas 1 a 5: todo lo de ahí
vale acá. Las trece regiones ya pasaron por las rondas; lo único del bestiario que nadie tocó es **el
plano**, `src/pages/redondopedia/bestiario.astro`: la portada, el mundo redondo visto de arriba
(`lib/bestiario/mapa.ts`, `figuras.ts`), el acercamiento y la lupa (`scripts/bestiario.ts`), el
recorrido de recintos y el índice. Es lo primero que ve la gente, y la puerta a todo lo que mejoramos.

## Qué dejó la tanda 5 (la prisión, dos vueltas)

2516 tests en verde. La prisión se hundió sin perder el grabado: la escalera que baja, el arco de las
cárceles, el haz de la ventana en rayos de gubia con polvo, las galerías altas con manos en los
barrotes, la rata. La cadena del puente volvió a quieta porque como péndulo no se leía. Lección que
se suma: **lo que se mueve y no se lee en la tira de seis cuadros vuelve a quieto, no se agranda.**

## Qué es distinto acá

El plano no es un ambiente que se camina de costado: es **un mapa que se mira desde arriba y en el
que se entra**. La inmersión no viene de capas en fuga sino de:

- **Que el mundo redondo se sienta un lugar y no un diagrama**: el disco como objeto (vinilo, plato,
  mesa de arena), lo que pasa en cada porción de lejos —humo del galpón, la ruta con el bondi que
  da la vuelta, el agua del bajo, la nieve de Cybersiberia— y que cada porción ya anuncie lo que
  ahora hay adentro después de las cinco tandas.
- **La llegada**: qué ve el que entra por un enlace en el teléfono en la primera pantalla
  (~96–416), y cuánto tarda en saber qué hacer (registro de `voz-ricotera.md` §5, la regla de las
  dos líneas).
- **El acercamiento** a una región: hoy acerca el SVG; puede tener profundidad (niebla que se abre,
  el plano que se inclina, la región que se despega) **sin** convertirse en un efecto de folleto.
- **El paso del plano a la región** (`VeloDeLlegada`, `velos.ts`): que entrar a una región se
  sienta como bajar a ella, no como cambiar de página.

## Lo que no se toca

- **Coordinación con `T-529`**: los recintos del recorrido usan `escenas.ts` y
  `escenas-entornos.ts`, que esa rama reescribe. No los edites, ni `rig-*.ts`, `recintos.ts`,
  `elenco.ts`, `vivos.ts`. Esa rama sí cambia `sitio.css` (60 líneas): si tocás ese archivo,
  hacelo en un bloque nuevo, lejos de lo suyo (`git diff main...origin/claude/bestiario-rocambole-3238c6 -- src/styles/sitio.css`).
- **Las tres capas** del encabezado de la página: el índice sin JavaScript se lee entero, y lo
  pesado llega cuando se acerca (`T-445`, `carga.ts`). Arriba de todo sigue bajando solo el monte.
- `diseno-marca.md` entero: sin sombras, sin degradé decorativo fuera del arte impreso, el título en
  la letra de *Lobo suelto*, nada de movimiento que "levante".

## Al cerrar cada vuelta

Lo de siempre: hojas antes/después (antes = una captura del plano en main, que vas a sacar en esta
vuelta) a 430×860 y a 1280×800, la de quedarse quieto, la del acercamiento a dos regiones, memoria
rama/main (techo +20 %), cuadros con control en banda, visto separado de escrito, y tu top 5 para la
vuelta siguiente o si ya está para cerrar.
