# HILO → arquitectura, experiencia, contenido, producto: se sacó la cinta (`D-50`)

**De:** hilo principal · **Fecha:** 2026-10-01 · **Origen:** pedido del usuario, textual:
*"Saquemos lo de la cinta en todos lados, en el juego de adivinar el tema a veces salta sola
y hace un ruido blanco molesto."*

## Qué pasó

El interruptor de la cinta, la cama de ruido y la rocola salieron del código el 2026-10-01.
El porqué —la preferencia guardada para siempre, el rearme que la prendía con el primer
toque de cualquier pantalla, la cama que volvía sola seis segundos después de cada
fragmento— está en `D-50`. El audio de los juegos no cambió; Skayboy suena con sus tres
efectos y ya no tiene tema fijo ni forma de callarse.

## Qué se le pide a cada uno

Que marque como **sin vigencia por `D-50`** lo suyo que describe la cinta como presente. No
hace falta reescribir nada: alcanza con la línea de estado, como se hizo con `D-37`.

- **`arquitectura`:** `ARQ-cama-de-cinta.md` (`ADR-04`), `ARQ-rocola.md` (`ADR-07`,
  `CTR-14`), `ARQ-motor-de-juego.md` (`ADR-08.9`), `ARQ-efectos-de-sonido.md` (`CTR-17.5`),
  `ARQ-schema-niveles.md` (el campo `temaFijo`, que sigue en `skayboy.json` y en su schema
  pero ya no lo lee ningún código: decidir si se borra). Menciones de paso en
  `ARQ-transito-entre-pantallas`, `ARQ-pantalla-completa`, `ARQ-respuesta-compuerta-corrida`,
  `ARQ-separaciones-de-tapa` y `ARQ-solucion-grabada`.
- **`experiencia`:** `UX-21` (el interruptor) y `UX-26` (la rocola). Menciones en `UX-22`,
  `UX-23`, `UX-28`, `UX-30` y `UX-33`. **Y una decisión que queda abierta:** si Skayboy
  necesita un control propio para callarse. Hoy no lo tiene; `soltarEfectos()` quedó en
  `src/lib/skayboy/sonido.ts` para ese día.
- **`contenido`:** `CNT-20` (el tema que suena) y la mención en `CNT-22`.
- **`producto`:** `PRD-backlog-ideas.md` y `PRD-skayboy-y-poligirl.md`, donde mencionen la
  cinta o el tema fijo.

Los planes de ciclo (`ORQ-plan-ciclo-11`, `-14`, `-15`), las revisiones (`REV-10`, `REV-13`)
y los quince traspasos de `Docs/SUGERENCIAS/` que hablan de la cinta son historia: no hace
falta tocarlos.
