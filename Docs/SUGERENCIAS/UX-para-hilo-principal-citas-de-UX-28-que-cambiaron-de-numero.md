# `UX-28 §2.2` se partió en dos números — estas citas quedan mirando al lugar viejo

> **De:** `experiencia`. **Para:** el hilo principal. **Fecha:** 2026-09-22 (`T-261`).
>
> `UX-28` tenía dos secciones numeradas `§2.2` (el hallazgo lo dejó anotado el propio
> addendum de `HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`, "dos cosas
> sueltas"). Las renombré: **`§2.2` queda para "El agarre"** (no se movió, y es donde
> apunta casi todo el repo) y **la sección del alto pasa a ser `§2.3`** (reescrita, además
> — corregí una cuenta que no cerraba; el detalle está en el propio `§2.3`).
>
> `rg -n "UX-28 §2\.2"` sobre el repo entero da ocho citas afuera de este mismo archivo
> (este documento se cita a sí mismo varias veces más, al explicar el cambio, pero esas no
> cuentan: son sobre el cambio, no citas viejas que corregir). Cinco siguen apuntando bien
> porque hablan del agarre; tres quedaron mirando al lugar viejo porque hablaban del alto.
> No las edito yo: son código y `ESTADO.md`, y ninguna de las dos es mi carpeta.

## Las que siguen apuntando bien (no tocar)

Hablan del agarre — "de dónde cae el pulgar de la mano que agarra" — que es exactamente
`§2.2` hoy, sin cambios:

- `src/styles/skayboy.css:263` — el comentario sobre `.mando-piso`.
- `src/styles/skayboy.css:465` (aprox., adentro del bloque `@media (min-width: 720px) and
  (max-height: 500px)`, el párrafo que explica por qué se sacó la bajada del casete).
- `src/pages/juegos/skayboy-y-poligirl.astro:69` — el comentario sobre `PISO`.
- `Docs/CONTENIDO/CNT-19-el-nombre.md:77` — ya dice "`UX-28 §2.2`, 'el agarre'" con todas
  las letras, así que esa cita es la más a prueba de este cambio de todas.
- `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md:49` —
  también sobre el agarre. Es un traspaso ya cerrado (lo cierra `UX-28 §2.3` y `§2.6`); no
  hace falta tocarlo, queda como registro histórico.

## Las que quedaron mirando mal — pasan de `§2.2` a `§2.3`

Hablan del alto, no del agarre:

- **`src/styles/skayboy.css:486`** (dentro del comentario sobre el rótulo de carga
  tomando el renglón de la marca): dice *"Es interino: el reparto de este alto es de
  `experiencia` (`UX-28 §2.2`)"*. Con esta ráfaga deja de ser interino — `UX-28 §2.3` y
  `§2.6` lo resuelven de fondo, no como remiendo — así que conviene actualizar el
  comentario entero, no solo el número. `T-271` ya va a tocar este archivo para meter el
  reparto nuevo, así que es el lugar natural para corregirlo de paso.
- **`ESTADO.md:126`** — *"Cerrado por `experiencia` el 2026-09-22 (`UX-28 §2.2`, nueva)"*.
- **`ESTADO.md:135`** — *"...está en `UX-28 §2.2`"*.

Las dos de `ESTADO.md` describen un cierre que esta misma ráfaga corrigió (la cuenta de
126 px de sobra a ×1 estaba mal — ver `UX-28 §2.3`, "El dato que le faltaba a la cuenta").
Conviene que el bloque de `ESTADO.md` que las contiene se actualice entero cuando se
cierre la ráfaga 1, no solo el número de sección.

## Siguiente

`hilo principal`, al cerrar la ráfaga o al ejecutar `T-271`: actualizar las dos citas de
arriba y, en `ESTADO.md`, reflejar que el reparto de `§2.2`/`§2.3` ya no es un empate
técnico de 3 px sino un diseño que cierra en las cinco medidas de `UX-28 §2.5`.
