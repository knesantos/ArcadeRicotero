# De `arquitectura` para `producto`: "Completá la letra" con el conteo

> 2026-09-24, ciclo 16, ráfaga 4, `T-287`. Leí `BR-30`, `BR-03` y `US-03`, enmendadas por
> `T-286`, antes de escribir el contrato. **No toco tu carpeta.** El contrato es `CTR-04.14`, en
> `Docs/ARQ/ARQ-schema-completar-letra.md`. **Ninguno de los dos puntos frena `T-288`:** la
> forma del dato no cambia, se resuelvan como se resuelvan.
>
> **Respondida el mismo día** (`Docs/SUGERENCIAS/PRD-para-arquitectura-us-03-criterio-2-resuelto.md`):
> opción A para el punto 1, y el punto 2 corregido en la tabla de `BR-30`. Retiré la consulta 3
> y el comando (6) de `CTR-04.12`. El punto 3 ya está medido: 19 `listo`, 11 / 4 / 4
> (`CTR-04.14`, "Lo que dio de verdad").

## 1. 🔴 `US-03` criterio 2 no puede cumplirse con el nivel por tema

`US-03` criterio 2: *"nunca se introduce un tema completamente nuevo solo en modo difícil; la
dificultad escala mostrando menos letra del mismo universo de temas de la partida, no cambiando
de tema (pedido explícito del usuario en `/kickoff`)"*. `Docs/BRIEF.md`, "Listo de la v1",
punto 3, dice lo mismo: *"La dificultad escala mostrando menos letra, no cambiando de tema"*.

`BR-30` hace que todos los ítems de un tema tengan el nivel del tema. Entonces un tema Difícil
tiene **solo** ítems Difíciles, y la partida lo presenta por primera vez pelado: sin título,
sin disco, sin un verso alrededor. La dificultad sube cambiando de tema. Con los `listo` de
hoy, *Dr. Saturno* y *Es hora de levantarse querido* (3 veces cada uno en `RES-90`) cumplen el
criterio porque tienen un ítem Fácil al lado. Después de `T-288`, no.

**Cómo se coló:** `T-286`, en el argumento 1 de *"`BR-03`: el contexto sigue al nivel"*, cita
el brief así: *"la dificultad escala mostrando menos letra... fácil da contexto, difícil da un
verso pelado."* Los puntos suspensivos ocupan justo el lugar de *"no cambiando de tema"*. No
creo que haya sido a propósito, pero es la frase que choca.

**Las dos cosas las pidió el usuario.** Lo que necesito es que quede escrito cuál manda:

- **A. La precisión de `D-46` reemplaza el *"no cambiando de tema"*.** Se enmienda el
  criterio 2 (marcado, sin borrar): la dificultad escala mostrando menos letra y yendo de los
  temas más tocados a los menos tocados. Yo retiro la consulta 3 de `CTR-04.12`, que hoy dejé
  en suspenso.
- **B. El criterio 2 se conserva.** Eso sería una regla de la ronda (que un Difícil solo entre
  si su tema ya apareció en la partida). Con el nivel por tema **no tiene con qué cumplirse**,
  porque un tema Difícil no tiene ítems más fáciles. Habría que reabrir el acople de `T-286`.

Mi lectura, y la decisión es tuya: **A**. La precisión es del 2026-09-24, es explícita y
nombra este juego. Pero no es obvia para dejarla sin preguntar: el *"no cambiando de tema"*
figura en el brief como pedido del `/kickoff`. Si lo llevás al usuario, alcanza con una
pregunta: *"¿Completá la letra puede subir de dificultad cambiando de tema, de los más tocados
a los menos tocados?"*.

## 2. El "hoy" de `US-03` en `BR-30` no era manual

La tabla de `BR-30` dice, en la columna *"Cómo decide hoy"*: *"Manual: `contenido` etiqueta
cada hueco (`BR-01`)"*. Y *"Qué pasa con un ítem que tenía dificultad a mano"* dice: *"Los
ítems `listo` de hoy tienen `dificultad` escrita a mano por `contenido`"*.

**En el código no es así.** `scripts/generar-letra.mjs` pone el nivel según cuántos versos
tiene el hueco alrededor **dentro de su estrofa**: 2 y 2 da `facil`, 1 y 1 da `media`, y si
no, `dificil` (el bloque que empieza en *"BR-03: el contexto lo fija el nivel"*, leído el
2026-09-24). `contenido` elige qué verso se promueve (`src/data/letra-confirmaciones.json`,
`fuenteUnica.items`), y ese archivo nunca tuvo un campo de nivel. Al elegir el verso,
`contenido` elegía el nivel de rebote.

Una redacción posible para la celda: *"Automática por posición: el generador ponía el nivel
según los versos que el hueco tenía alrededor dentro de su estrofa; `contenido` elegía qué
verso promover, y con eso el nivel de rebote"*. Y en la taxonomía de `BR-01` (*"asignada por
`contenido` al cargarlo"*), `US-03` necesita la misma excepción que ya tiene `US-02`. No
cambia la decisión. Cambia la premisa de que alguien pierde una etiqueta escrita a mano: no
había ninguna.

## 3. Lo que va a dar, para que no sorprenda

Esto es una lectura indicativa, no una medición (`CTR-04.14`). Con los bordes de `US-07`, los
21 `listo` pasan de 17 / 2 / 2 a **13 / 4 / 4**, así que la cuota de 4 Fáciles queda con
margen. **Diez cambian de nivel.** Los números de verdad los imprime el generador en `T-288`.
