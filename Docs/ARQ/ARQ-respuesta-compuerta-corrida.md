# ARQ — Respuesta al traspaso de la compuerta corrida (`T-226`)

> Rol dueño: `arquitectura`. **Fecha:** 2026-09-22. **No produce IDs nuevos**: es la
> respuesta punto por punto a `Docs/SUGERENCIAS/HILO-para-arquitectura-la-compuerta-del-motor-corrida.md`
> (hilo principal, 2026-09-18), §5. Las decisiones viven en `ADR-08` (`ARQ-motor-de-juego.md`)
> y en `ADR-07.10` (`ARQ-rocola.md`); acá solo se dice dónde quedó cada cosa.
>
> **Consume:** el traspaso, `ADR-08` … `ADR-08.11`, `ADR-07.10`, `BR-15`, `RES-70` (`INV-61`).
>
> **Los números de línea son de la lectura del 2026-09-22.** `ARQ-motor-de-juego.md` tiene
> cambios sin commitear de otra sesión: si se mueve, se busca por el ancla de la columna
> "Ancla para `rg`", no por el número.

---

## Los cuatro pedidos de §5

| # | Pedido | Estado | Dónde | Ancla para `rg` |
|---|---|---|---|---|
| 1 | **Decisión de la condición 4** (A, B o C) | ✅ **hecho.** Salida **A**, elegida por el usuario el 2026-09-18: Kaplay `3001.0.19` se queda y se corrige el rótulo. B y C descartadas por escrito, con motivo | `ARQ-motor-de-juego.md:159-182` (tabla en `:165-169`, fila A en `:167`); cabecera de `ADR-08` en `:66-71`; condición 4 de `ADR-08.1` apunta a la salida en `:201` | `elegida por el usuario` |
| 2 | **Rótulo corregido en `ADR-08`** | ✅ **hecho.** La línea de decisión dice "MIT con una cláusula anti-IA agregada — no es MIT a secas, no está en SPDX y no la aprobó OSI (`RES-70`)"; la tabla de finalistas lo repite; el rótulo viejo sobrevive solo dentro de la cita de enmienda. `ADR-08.11` punto 12 prohíbe volver a escribir "Kaplay: MIT" a secas | `ARQ-motor-de-juego.md:80-83` (línea de decisión), `:85-109` (enmienda), `:119` (tabla), `:669-670` (prohibición); regla de método "el tag, nunca la rama" en `:49-60` | `cláusula anti-IA` |
| 3a | **`ADR-08.2` punto 3 con la línea del cierre del audio** | ✅ **hecho.** El punto dice "no hay flag, hay una línea que la isla escribe sí o sí" y trae el bloque con `void k.audioCtx.close()`; la enmienda cita las 29 opciones del init. Además nació `ADR-08.2.1`, que declara la excepción y sus cuatro condiciones | `ARQ-motor-de-juego.md:239-250` (punto 3 y línea), `:269-281` (enmienda), `:283-323` (`ADR-08.2.1`) | `audioCtx\.close` |
| 3b | **`ADR-08.1` condición 5 sin la salida imposible** | ✅ **hecho.** La columna de consecuencia conserva lo que estaba escrito ("Se recortaba uso de API…") y lo marca: "la primera mitad de esa salida no existe". La subsección de la sorpresa deja las dos palancas reales: sacar peso de la isla o del dato del nivel | `ARQ-motor-de-juego.md:202` (fila), `:204-216` (subsección y enmienda); repetido en `ADR-08.10` `:630` | `no se tree-shakea` |
| 4 | **`ADR-08.10` con los números medidos** | ✅ **hecho.** Vara 116,3 KB bruto / 50,9 KB gzip en 27 chunks (y 298,4 / 117,8 con el humo); chunk 182,1 KB bruto / 66,8 KB gzip; margen 23,2 KB gzip; motor en un solo chunk y una sola página de 152; tiempo hasta jugable 114 ms con rótulo ⚠ "escritorio, falta teléfono" (no ✅, no ❓). Se sumó el ❓ nuevo del contexto del motor en Safari de iOS | `ARQ-motor-de-juego.md:613-626` (enmienda y vara), `:630` (chunk y margen), `:631` (no compartido), `:638` (114 ms), `:639` (iOS) | `50,9 KB gzip`, `114 ms` |

**Los cuatro ya estaban hechos en `ARQ-motor-de-juego.md` antes de esta sesión.** Esta
respuesta no le agrega ni le saca una línea a ese archivo.

---

## Lo que el traspaso preguntaba de paso (§3.1, último párrafo)

> *"Si eso te parece demasiado para `ADR-07.10` punto 7, decilo vos: la excepción es tuya."*

**Respuesta: es excepción, la segunda y última, y ya está escrita en los dos lados.**

| Dónde | Estado |
|---|---|
| `ADR-08.2.1` (`ARQ-motor-de-juego.md:283-323`) | ✅ la declara, con tres razones y cuatro condiciones |
| `ADR-08.11` punto 1 (`ARQ-motor-de-juego.md:651-654`) | ✅ reformula la prohibición: no que nazca, que **siga vivo** |
| **`ADR-07.10` punto 7** (`ARQ-rocola.md:729`, enmienda en `:731-740`) | ✅ **hecho hoy, 2026-09-22.** La línea original queda como se escribió ("excepción única"); debajo, una enmienda rotulada con fecha dice que son dos y apunta a `ADR-08.2.1`, `ADR-08.11` punto 1 y `ADR-08.8` |

---

## Pendientes chicos, anotados y no editados

`ARQ-motor-de-juego.md` está sin commitear en otra sesión, así que lo de abajo **no se tocó**.
Ninguno cambia una decisión; los tres son redacción que envejeció.

| # | Qué | Dónde | Qué falta |
|---|---|---|---|
| P1 | `ADR-08.2` punto 3 **cita** el texto viejo de `ADR-07.10` punto 7: *"excepción única `diagnostico-audio.ts`"* | `ARQ-motor-de-juego.md:241-242` | Desde hoy esa cita tiene una enmienda debajo. Agregado mínimo sugerido al final de la cita: *"— enmendado el 2026-09-22 a dos excepciones, ver `ADR-08.2.1`"*. Sin eso, el que lee `ADR-08.2` cree que la regla sigue diciendo "única" |
| P2 | La cabecera dice "Última actualización: 2026-09-16" | `ARQ-motor-de-juego.md:28` | La segunda enmienda (2026-09-18, `:34-42`) ya lo cubre en el texto; falta solo que la fecha de la línea 28 lo diga |
| P3 | `ADR-04` tiene la misma frase que acabo de enmendar en `ADR-07.10`: "la **única** excepción" y "excepción única y escrita: `diagnostico-audio.ts`" | `ARQ-cama-de-cinta.md:225` y `:521-522` | Misma enmienda rotulada que `ADR-07.10` punto 7, apuntando a `ADR-08.2.1`. Está en mi carpeta y no la hice porque este pedido acotaba a `ADR-07.10`: queda para la próxima ráfaga de `arquitectura` |

**Hechos el 2026-09-22, en una segunda ráfaga** (la otra sesión liberó `ARQ-motor-de-juego.md`):

- **P1 ✅** — la cita de `ADR-08.2` punto 3 queda textual; al lado, una aclaración rotulada
  con fecha dice que son dos excepciones y apunta a `ADR-08.2.1` y a `ARQ-rocola.md:731-740`.
- **P2 ✅** — "Última actualización: 2026-09-22" con la línea de qué cambió; la fecha vieja
  (2026-09-16) queda escrita debajo como versión anterior de esa línea.
- **P3 ✅** — `ARQ-cama-de-cinta.md`: las dos frases originales quedan como se escribieron,
  cada una con una enmienda rotulada debajo (tras `:226` y tras `:522`), apuntando a
  `ADR-08.2.1`. La verificación de abajo sigue devolviendo 225 y 521: son la línea original,
  no el pendiente.

**Fuera de mi carpeta, para que no se pierda:** el caso de `motor.test.ts` que se cae si
falta el `close()` es de `T-247` (`ADR-08.8`, `ARQ-motor-de-juego.md:525`). Contrato escrito;
lo implementa el hilo principal.

---

## Cómo se verifica

`arquitectura` no corre comandos (`D-12`); los corre `revisor`, `orquestador` o el hilo principal.

```bash
# La enmienda de ADR-07.10 punto 7: tiene que aparecer la línea original (729) y la enmienda.
rg -n "diagnostico-audio|ADR-08.2.1" Docs/ARQ/ARQ-rocola.md

# Todos los que apuntan a la excepción del motor.
rg -n "ADR-08.2.1" Docs/ARQ/

# Los ocho anclajes de la enmienda del 2026-09-18 en ADR-08 (pedidos 2 a 4).
rg -n "RES-70|cláusula anti-IA|audioCtx\.close|no se tree-shakea|66,8 KB gzip|50,9 KB gzip|114 ms|nunca en la rama" Docs/ARQ/ARQ-motor-de-juego.md

# P1-P3 resueltos: "única" sigue en las líneas originales, y cada una tiene su enmienda al lado.
rg -n "única|unica" Docs/ARQ/ARQ-motor-de-juego.md Docs/ARQ/ARQ-cama-de-cinta.md
rg -n "Enmendado el 2026-09-22|aclaración del 2026-09-22" Docs/ARQ/
```
