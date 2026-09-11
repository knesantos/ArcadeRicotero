# REV-13 — Revisión del ciclo 14: la rocola, el pie corto y las dos pantallas

> Rol dueño: `revisor`. `T-225`. Fecha: **2026-09-11**.
>
> **Nota de autoría, y es una salvedad real.** Los hallazgos, la evidencia y los veredictos
> son de `revisor`, que revisó con contexto fresco y sin haber construido nada. **El archivo
> lo transcribió el hilo principal**, porque el rol no tiene `Write` ni `Edit` — solo lectura,
> `grep` y consola. Es la misma figura que `D-12` ya describe para los roles que escriben y no
> pueden correr su propia verificación, invertida: acá el que verifica no puede escribir.
> Quien dude de una línea, que vuelva a correr los comandos: están todos abajo.
>
> **Consumo:** `ORQ-plan-ciclo-14.md`, `ARQ-rocola.md` (`ADR-07`, `CTR-14`), `CNT-16`,
> `UX-24`, `UX-25`, `UX-26`, `D-37`, y el código de los diecisiete archivos que el ciclo tocó.

---

## Lo que quedó verificado, y no es poco

Esto importa tanto como los hallazgos: un informe que solo lista problemas no deja saber qué
se miró y salió bien.

### El riesgo número uno del ciclo: **sin hallazgos**

Era que la rocola le soplara la respuesta a alguien jugando. Se verificó de cuatro formas y
las cuatro dieron bien:

- `RUTAS_CON_ROCOLA` y `PAGINAS_DECLARADAS` (`src/lib/sitio/rutas-sonoras.ts`) clasifican
  correctamente **las catorce páginas** de `src/pages/`.
- **El censo rompe el build de verdad.** Se probó creando
  `src/pages/prueba-revisor-temporal.astro`, corriendo `node --test
  src/lib/sitio/rutas-sonoras.test.ts` —falla con el nombre del archivo— y borrándolo.
- `Base.astro` imprime la siembra **solo en las rutas de rocola**. Los seis juegos y el quiz
  no pasan por ese layout y nunca la importan.
- `prenderRocola()` **vuelve a mirar la ruta por su cuenta**. Los dos candados son reales:
  ninguno es decorativo.

### Lo verificable, corrido

| Comando | Resultado |
|---|---|
| `npm test` | **574/574** |
| `npm run check` | 0 errores, 0 warnings |
| `npm run build` | 151 páginas |
| `node --test src/lib/islas.test.ts` | 4/4 (`D-29`) |
| `grep -rn "decodeAudioData" src/` | solo `tema/audio.ts:208` y `diagnostico-audio.ts:208` — **ausente en `rocola.ts`**, que es lo que `ADR-07.4` exige |

La aparición en `diagnostico-audio.ts` es una excepción preexistente de `ADR-04.2`, anterior
a este ciclo. No es un hallazgo.

### Lo demás que salió bien

- **Los tres casos de `cinta.test.ts` de las líneas 691, 717 y 932 están intactos byte por
  byte**, como `ADR-07.3` exige.
- **`D-21` condición 1 se sigue cumpliendo.** `data-tapas` y `.credito-pantalla` en
  `PieImprenta.astro` coinciden con lo que busca `creditoDePantalla()` en `partida-tema.ts`, y
  el `<details>` es nativo: **funciona sin JavaScript**.
- **El crédito del portal bajando de ocho discos a uno es correcto**, no una pérdida: los
  casetes usan dibujo original en SVG, no fotos de tapa. La pantalla acredita lo que
  realmente usa, que es exactamente lo que pide la condición.
- `voz.test.ts` ya audita las cadenas nuevas: `PORTAL.pie`, `creditosRotulo`,
  `creditosCuerpo`, `CINTA.suena`/`ponerTema`/`otroTema`, `PANTALLA_0.elegiDisco`.
- `.cinta-pieza`, `.cinta-accion`, `.pozos-abrir` y `.pie-creditos-abrir` **no usan pastilla
  de 999 px ni barra lateral**: pasan la tabla de tics vetados de `diseno-marca.md`.

---

## Los hallazgos

### `FIND-52` — El casete del portal no recibió cuatro de las cinco medidas de `UX-25` · **Media**

- **Criterio incumplido:** `UX-25` §2.3, §2.4 y §2.5.
- **Evidencia:** el commit `dde6a59` sacó la tapa chica y cortó la bajada en el punto, pero
  **no tocó una sola regla `.casete*` de `src/styles/sitio.css`** — el diff de ese archivo
  estaba vacío en esa zona. `.casete-pie` seguía con `grid-column: 1 / -1`, o sea una fila
  entera del grid para un sello, que era justamente lo que §2.3 mandaba sacar.
- **Qué faltaba, una por una:** `padding` de `.casete` 16 → 12 px; `.casete-titulo` 1,05 →
  0,95rem; `.casete-baja` 0,85rem/1,35 → 0,8rem/1,3; y el sello bajando adentro de
  `.casete-etiqueta` en vez de ocupar fila propia.
- **Consecuencia medida:** explica el desvío del casete (198 px contra los 136 de la hoja) y,
  en cascada, el del portal (2021 px contra 1486).

> **Corregido el 2026-09-11 por el hilo principal.** Las cuatro medidas aplicadas, más el
> movimiento del sello adentro de `.casete-etiqueta` en `index.astro` — sin eso, con la fila
> del grid sacada, el sello caía a la columna del dibujo. **Medido después:** el casete pasó
> de 198 a **174 px** (la mayoría en 150) y el portal de 2021 a **1751 px (2,16 pantallas)**.
> Sigue sin llegar a los 136/1486 de la hoja: ver `FIND-53`, que es la misma clase de
> problema.

### `FIND-53` — `UX-25` §5 fija un techo que su propio token vuelve imposible · **Baja**

- **Criterio incumplido:** ninguno del código. **Es un defecto de la hoja**, no de lo
  construido.
- **Evidencia:** `--alto-pie-imprenta: clamp(8.5rem, 22vh, 13rem)` (`tokens.css:270`, único
  uso en `sitio.css`). A 812 px de alto de ventana, `22vh ≈ 179 px`; y **el piso del `clamp`
  es 8,5rem = 136 px**, así que el pie no puede bajar de ahí *sea cual sea el texto*.
  `UX-25` §5 pide ≤ 120 px sin reconciliarlo con ese token, que la propia hoja lista en su
  sección de consumo.
- **Veredicto:** confirma que los 179 px del pie construido **no son un defecto del pie**. El
  texto sí hizo lo suyo — bajó de 379 a 42 caracteres.
- **Dueño:** `experiencia`, para corregir `UX-25` §5 contra su propio token, o para llevar el
  cambio del token al lienzo como pide `diseno-marca.md`.

### `FIND-54` — `ADR-07.8` describe un mecanismo que el código no tiene, y dos casos sin prueba · **Media**

- **Criterio incumplido:** `ADR-07.8` y la tabla de veinte casos de `ARQ-rocola.md`.
- **Evidencia:** el ADR dice que `debeCallarse()` *"se parte en dos preguntas, una por
  modo"*. `src/lib/sitio/cinta.ts:552-558` sigue siendo **una función única** que calla la
  cama por `document.hidden` sin distinguir modo. El efecto que el ADR busca —la rocola sigue,
  la cama se calla— **sí ocurre**, pero por otro camino: la rocola tiene su propio `gain` y su
  propio elemento, así que nunca pasó por esa pregunta.
- **Y los casos 17 (`document.hidden`) y 19 (`ROCOLA_HABILITADA = false`) no tenían ninguna
  prueba**, aunque la tabla de `ADR-07` los lista.

> **Resuelto en dos mitades, el 2026-09-11.** Los **casos 17 y 19 ya tienen prueba** en
> `rocola.test.ts` (ahora 20/20): el 19 fija la forma del literal y que se mire antes de
> construir nada; el 17 fija que **la rocola no tenga ningún escucha de visibilidad**, que es
> lo que hace que esconder la pantalla no pueda tocarla.
>
> **La mitad de la descripción queda para `arquitectura`**, en
> `Docs/SUGERENCIAS/HILO-para-arquitectura-el-mecanismo-de-ADR-07-8.md`: el comportamiento es
> el correcto y está probado, así que **no se reescribió el código para que calce con la
> prosa**. Lo que hay que corregir es la prosa.

---

## Los tres desvíos de presupuesto, resueltos

El hilo principal los había declarado antes de esta revisión. El veredicto, uno por uno:

| Desvío | Veredicto |
|---|---|
| El pie en 179 px y no ≤120 | **Defecto del presupuesto**, no del pie (`FIND-53`) |
| El casete en 198 px y no 136 | **Era mitad y mitad**: faltaban cuatro medidas (`FIND-52`, corregido → 174) y el resto es tipografía que la hoja no presupuestó bien |
| El portal en 2,49 pantallas | Se seguía del anterior; con `FIND-52` corregido quedó en **2,16** |

---

## Lo que esta revisión no pudo mirar

**El navegador.** `revisor` tiene lectura, `grep` y consola, y nada más. Todo lo medido a
375×812 —los altos, el scroll, que la rocola no suene en una pantalla de juego— lo verificó el
hilo principal y está en `ESTADO.md` y en la sección 7 de `ORQ-plan-ciclo-14.md`. Esta
revisión no encontró ninguna contradicción entre esos números y el código, pero **no los
volvió a medir**.
