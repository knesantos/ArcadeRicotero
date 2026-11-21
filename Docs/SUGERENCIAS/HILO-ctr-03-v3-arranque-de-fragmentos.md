# Pedido a `arquitectura`: `CTR-03` pasa a v3 (arranque medido de cada fragmento)

**De:** hilo principal, ronda R2 de la pulida de jugabilidad (`T-533`), 2026-11-20.
**Para:** `arquitectura` (`Docs/ARQ/ARQ-schema-adivinar-tema.md`). El código ya está; falta
que el contrato lo diga. La decisión `D-` la numera el hilo principal al integrar.

## Qué cambió en `src/data/adivinar-tema.json`

- `contratoVersion: 3`.
- Bloque nuevo `medicion`: `{ medido, umbralDb, ventanaMs, con }`.
- Por fragmento, tres campos nuevos:
  - `inicioSeg` (número, o `null`): dónde está el primer sonido real del mp3.
  - `sorteo` (booleano): si el tema puede salir sorteado.
  - `motivo` (solo si `sorteo` es `false`): `sin-arranque` o `arranque-tardio`.

Ninguno se escribe a mano: los pone `npm run medir-fragmentos` con la regla de
`src/lib/tema/arranque.ts`, y `src/lib/tema/arranque.test.ts` falla si el manifiesto no
coincide con las envolventes guardadas en `scripts/fragmentos-envolvente.json`, o si un mp3
cambió sin volver a medir (sha1).

## Las reglas que el contrato tendría que recoger

1. **Arranque:** el primer instante desde el que la décima del paso 1 promedia −30 dBFS,
   arranca sobre −30 y tiene 6 de sus 10 ventanas de 10 ms sobre −40.
2. **Sorteo:** entra si hay arranque y después de él queda lo que dura el penúltimo paso (8 s).
3. **Ventana de cada paso** (`ventana()` en `escalera.ts`): arranca en `inicioSeg` y dura lo
   que el paso promete, y nunca se corre hacia atrás: ningún paso suena audio anterior a
   `inicioSeg`. Los cinco pasos con número entran siempre (la regla 2 lo garantiza). El sexto
   no tiene número: es **"el resto"**, de `inicioSeg` al final del fragmento, con la misma
   etiqueta para todos los temas para que no sea pista (`D-26`, corregido en la auditoría de
   `T-533`; antes el sexto sonaba `[0, 10]` con la entrada muda adentro).
4. **El corte de dificultad no cambia de pozo:** se sigue calculando sobre todos los
   fragmentos (`BR-30`), entren o no al sorteo. `Catalogo.faciles` cuenta solo los jugables.
5. `catalogo.ts` rompe el build si un fragmento con `sorteo: true` no cumple la regla 2.

## Lo que queda afuera, a propósito

- El manifiesto sigue listando los 95 archivos: `pisos.test.ts` y las otras pantallas que lo
  leen (`en-vivo`, `ponelos-en-fila`, `arma-tu-recital`, bestiario) no cambian.
- Esas pantallas siguen sonando desde el segundo 0. Si quieren el arranque, `inicioSeg` está.
