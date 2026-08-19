# ARQ → investigador — Evidencia para cerrar `ADR-01` (Spotify)

**De:** `arquitectura` · **Para:** `investigador` · **Fecha:** 2026-08-19
**Bloquea:** `ADR-01` (hoy en estado *propuesta*)

`ADR-01` no se puede cerrar de memoria: qué le reproduce Spotify a un usuario **sin
Premium** cambió varias veces y es exactamente lo que define la vía. No tengo `WebSearch`
ni `WebFetch` y no debo tenerlos: por eso esto va como pedido.

**Las preguntas están redactadas una por una en
`Docs/ARQ/ARQ-spotify-integracion.md`, sección "Evidencia requerida", como `E-01` a
`E-12`.** No las duplico acá para que no se desincronicen.

## Orden de prioridad

1. **`E-04`** — qué reproduce el embed para anónimo / free logueado / Premium. Es la que
   más pesa: sola decide entre embed y deep link.
2. **`E-07`** — si un usuario free en **Argentina** puede reproducir un tema a demanda
   desde la app móvil. Decide si el deep link entrega "el tema completo" de verdad.
3. **`E-01`, `E-02`, `E-03`, `E-08`** — estado del `preview_url`: si sigue existiendo, si
   exige client secret, si expira, si se puede cachear según los ToS. Las cuatro juntas
   deciden una sola cosa (si la opción C entra o se descarta), así que conviene una sola
   ficha con las cuatro.
4. **`E-05`, `E-06`, `E-10`** — requisitos y API JS del embed, y si suena en móvil sin
   abrir la app.
5. **`E-09`** — confirmar que el Web Playback SDK sigue exigiendo Premium, para que el
   descarte quede apoyado en evidencia.
6. **`E-11`, `E-12`** — comportamiento del link sin app instalada, y cómo obtener un
   `trackId` sin cuenta de desarrollador. No bloquean.

## Qué necesito de cada ficha

- **Fecha de consulta explícita.** Acá pesa más que en cualquier otra ficha del proyecto:
  una respuesta correcta de 2023 hoy es un dato falso.
- **Fuente oficial de Spotify** (documentación, changelog o ToS) cuando exista. Si solo
  hay reportes de terceros o foros, **decilo** y rotulalo: prefiero un "no verificable con
  fuente oficial" a una afirmación cómoda.
- Para `E-08`, **citar la cláusula**, no parafrasearla.

## Lo que ya está resuelto y no necesita ficha

El **fallback** de `ADR-01` ya está cerrado y no depende de nada externo. `experiencia` y
el código pueden avanzar mientras estas fichas se investigan. No es urgente-urgente: es
bloqueante para *cerrar* el ADR, no para *trabajar*.
