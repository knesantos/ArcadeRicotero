# Propuesta de `investigador` para `arquitectura` y `producto` — Spotify prohíbe los juegos por contrato

- **Fecha:** 2026-08-19
- **Origen:** `RES-26`, en `Docs/INVESTIGACION/INV-22-imagenes-tapas-y-spotify.md`.
- **Por qué va como propuesta:** el hallazgo es mío, pero **la decisión no**. `ADR-01` es de
  `arquitectura` y `BR-06` es de `producto`.
- **Apareció de casualidad:** salió investigando de dónde sacar imágenes de tapas, no
  buscando esto.

## El hecho

**Spotify Developer Policy, sección III, cláusula 2, textual:**

> "Do not create a game, including trivia quizzes."

URL: https://developer.spotify.com/policy · Consultado: 2026-08-19 · **verificado en dos
fetches independientes más una confirmación por búsqueda.**

RicotaArcade es cuatro juegos y `US-01` es literalmente un quiz de trivia.

Hay una segunda capa, independiente: las Design Guidelines prohíben por nombre recortar,
superponer y desenfocar el arte de tapa — que es, mecánicamente, lo que hace el reveal
progresivo de `US-04`.

## Qué decidir, y de quién es

### `arquitectura` — `ADR-01` tiene un argumento nuevo y decisivo

La decisión estaba entre **A (embed)** y **B (deep link)**, esperando `E-04` y `E-07`.
Esta ficha las separa por un eje que no se había considerado — **no técnico, contractual**:

- **A (embed) queda gravemente comprometida.** El embed es un producto de la Spotify
  Platform y cae bajo la Developer Policy. Un sitio de juegos que lo integra hace
  exactamente lo que III.2 prohíbe. **Y `E-04` deja de importar**: aunque la prueba empírica
  del usuario diera que el embed reproduce el tema entero sin Premium, seguiría prohibido.
- **B (deep link) probablemente sobrevive.** Un `open.spotify.com/track/...` es una URL
  pública; **discutiblemente no es "usar la Spotify Platform"**. Y `RES-09` ya verificó que
  el catálogo está publicado ahí oficialmente desde el 28-jul-2017, así que el destino es
  real.

**Lo que falta para cerrar, y es una sola pregunta:** *¿un deep link simple cuenta como
"acceder a la Spotify Platform"?* Los Developer Terms dicen *"If you use or otherwise access
the Spotify Platform, you will be deemed to have accepted the Developer Agreement"*. Sobre
el link pelado no hay pronunciamiento. **Esa pregunta reemplaza a `E-04` en orden de
importancia.**

> **Sugerencia operativa:** `E-04` puede darse por **anulada**, no por pendiente — igual que
> pasó con `E-02`, `E-03` y `E-08` cuando se descartó la opción C. Ya no cambia la decisión.
> El usuario puede dejar de tener esa prueba en su lista.

### `producto` — revisar `BR-06`

Según el tablero, `BR-06` promete **acceso** al tema y no reproducción íntegra, y fue
redactada para que ningún desenlace de `E-04` ni `E-07` obligue a reescribirla. **Si eso es
así, aguanta este hallazgo sin cambios** — que sería una muy buena señal sobre cómo se
redactó.

Lo que sí conviene chequear: que la redacción **no describa un reproductor embebido dentro
del sitio**, porque esa vía queda cerrada por contrato y no por dificultad técnica.

## Lo que NO está verificado

Dicho para que nadie construya sobre arena:

1. **Si la prohibición tiene excepción escrita para uso sin fines de lucro, educativo o de
   fan site.** No se encontró ninguna, **pero no se leyó la Policy cláusula por cláusula**.
2. **Si el deep link simple cae bajo la Policy.** Es la pregunta que decide si B sobrevive.
3. Los hilos del foro oficial donde personal de Spotify aclara el alcance **devolvieron
   HTTP 403**. Hay sustancia por búsqueda, no cita textual de un moderador.
4. La **numeración** de las cláusulas viene del resumidor de la herramienta, no de lectura
   directa. **El texto está verificado; la numeración hay que confirmarla** antes de citarla
   formalmente en una nota de derechos.

## Lo que pido

Que `arquitectura` incorpore esto a `ADR-01` como revisión 3 y decida si cierra en B, y que
`producto` chequee `BR-06` contra el punto de arriba. **No es urgente para construir** —el
fallback de `ADR-01` está cerrado y el banco de preguntas no depende de esto— pero **sí
antes de escribir una sola línea de integración con Spotify**, porque el trabajo iría a la
opción equivocada.
