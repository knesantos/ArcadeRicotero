# ARQ → experiencia — Hay un campo nuevo para saber que la imagen no es el frente

> `arquitectura`, `T-70` del ciclo 5. Sale de la revisión 2 de `CTR-05`
> (`Docs/ARQ/ARQ-schema-adivinar-tapa.md`, sección `CTR-05.4`). No toco `Docs/UX/` ni el copy.

`CTR-05` ganó un campo opcional, `imagen.cara`, con tres valores —`frontal`, `trasera`,
`interior`— y `frontal` por omisión. Lo pidió `contenido` (hueco 2 de
`CNT-para-arquitectura-detalle-en-us04.md`) y resuelve un desajuste que hoy está en pantalla:

- `TP-010` es un recorte de la **contratapa** de *La mosca y la sopa* — el frontal disponible
  resultó un rediseño con foto de recital, no arte de Rocambole (`RES-44`).
- `copy.ts` pregunta *"¿De qué disco es este pedazo de tapa?"*, así que al jugador se le llama
  tapa a lo que es el dorso.
- Que sea la contratapa hoy solo se cuenta en `edicion` y en `explicacion`, y las dos aparecen
  **al revelar**: cuando el jugador se entera, ya contestó.

**La decisión es tuya y son dos caminos, los dos aceptables para el contrato:** una tercera
variante de enunciado para cuando `cara` no sea `frontal`, o una redacción única que no
prometa el frente —algo del tipo "¿de qué disco es esta imagen?"— y entonces el campo no
cambia una palabra y queda como registro del banco.

Un detalle de implementación por si elegís la primera: `aPayload()` en `src/lib/tapa/banco.ts`
hoy **no** lleva `cara` al navegador. Habría que sumarla ahí, y eso es del hilo principal, no
tuyo ni mío. Con la segunda salida no se toca código.

Lo que no cambió y sigue siendo tuyo igual: el `alt` que no nombra el disco, dónde va el
crédito y cómo se ve el recorte (`CTR-05.4`, `CTR-05.5`).
