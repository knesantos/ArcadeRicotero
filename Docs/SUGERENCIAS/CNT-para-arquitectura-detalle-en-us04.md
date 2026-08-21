# CNT → arquitectura — Dos huecos de CTR-05 que aparecieron al cerrar el piso de `US-04`

> `contenido`, `T-54` (cierre), ciclo 4. No edito `Docs/ARQ/` ni `src/data/_schema/`, dejo
> la propuesta acá. Consume: `Docs/ARQ/ARQ-schema-adivinar-tapa.md` (`CTR-05`),
> `scripts/generar-tapas.mjs` (tal como quedó después de `T-49`), `public/tapas/`,
> `Docs/INVESTIGACION/INV-44-tapas-coveralia.md`.

## Qué pasó

Para cargar el décimo ítem (`TP-010`, *La mosca y la sopa*) usé
`imagen.archivo: "la-mosca-y-la-sopa"` con `encuadre: "entera"`, que resuelve a
`public/tapas/la-mosca-y-la-sopa.jpg`. Ese archivo **hoy sale de
`la-mosca-y-la-sopa-trasera.jpg`** (la contratapa, con el collage real de Rocambole), no
del frontal — `generar-tapas.mjs` ya lo dejó así, con un comentario propio pidiéndole a
`contenido` que el pie de esa imagen diga que es la contratapa. Lo hice: la honestidad
completa vive en `imagen.edicion` y en `explicacion`, porque `CTR-05.2` dice que el
enunciado fijo de pantalla lo escribe `experiencia`, no `contenido` — no tengo dónde
escribirlo más cerca de la pregunta.

De paso encontré un segundo problema, más grave, revisando si podía usar en cambio un
`encuadre: "detalle"` (para `TP-010` o para completar el pool con un segundo encuadre de
otro disco, como preveía `CTR-05.10`).

## Hueco 1 — la ruta de `detalle` que describe `CTR-05.4` ya no es la que existe

`CTR-05.4` dice que `encuadre: "detalle"` resuelve a `public/tapas/<archivo>-detalle.jpg`
(plano, mismo slug que la ficha entera). Lo que `T-49` entregó es otra cosa:
`public/tapas/detalle/<nombre>.jpg` y `public/tapas/fondo/<nombre>.jpg` — **subcarpeta**, y
`<nombre>` es un nombre libre por recorte (`mosca-olla`, `bondi-circuito`,
`gulp-pincelada`...), no el slug del disco con un sufijo.

Con la regla de `CTR-05.4` tal como está escrita, **ningún ítem con `encuadre: "detalle"`
puede resolver a un archivo real hoy**: el schema lo valida igual (el patrón de `archivo`
no mira el disco) pero el chequeo de archivo de `CTR-05.9` (comando 1) va a marcar
`FALTA EL ARCHIVO` en cualquiera. Por eso no usé `detalle` para nada en esta ráfaga —
ninguna de las dos salidas que tenía para elegir (`mosca-olla.jpg` o un segundo recorte de
otro disco ya apto) llegaba a un archivo real bajo la regla vigente.

**Pido:** actualizar `CTR-05.4` para que la ruta de `detalle` sea
`public/tapas/detalle/<archivo>.jpg`, y aclarar si `archivo` puede o no ser un nombre
distinto del slug del disco (`mosca-olla` en vez de `la-mosca-y-la-sopa`) para ese caso —
hoy el enum `disco` ata la imagen a un título, pero el nombre de archivo de un recorte no
tiene por qué llevar el slug completo.

## Hueco 2 — no hay forma de declarar que una imagen es la contratapa, no la tapa

`imagen.encuadre` distingue `entera`/`detalle` (recortado o no) pero no distingue
frontal/trasera. Para *La mosca y la sopa* eso importa: la única imagen jugable que existe
es la contratapa, y el schema no tiene dónde decirlo salvo en texto libre (`edicion`,
`explicacion`) que **no llega al enunciado fijo que ve el jugador antes de responder**
(ese lo escribe `experiencia`, `CTR-05.2`).

**Pido:** evaluar un campo opcional en `imagen` (algo como `cara: "frontal" | "trasera"`,
con default `frontal` para no tocar los 9 ítems que ya cargué) que sea legible por
`experiencia` para decidir si el enunciado fijo necesita una variante cuando `cara` no es
`frontal`. Si no se justifica un campo nuevo por un solo ítem, lo entiendo — pero entonces
dejo asentado que la honestidad de `TP-010` depende de que el copy fijo de
`experiencia` no prometa "la tapa" de forma que contradiga lo que se ve.

## Qué hice mientras tanto, para no bloquear el piso

Cargué `TP-010` con `encuadre: "entera"` (no `"detalle"`, por el hueco 1) y toda la
honestidad de "esto es la contratapa, no la tapa" en `imagen.edicion` y `explicacion`.
`auditoria: "reedicion confirmada"` (coincide con el veredicto de `RES-44` sobre
`la-mosca-y-la-sopa-trasera.jpg`, que sí encontró el motivo compatible con el arte real de
Rocambole, a diferencia del frontal). Queda una `notaInterna` en el ítem con el mismo
señalamiento, por si `revisor` o `experiencia` lo leen primero que a esta propuesta.
