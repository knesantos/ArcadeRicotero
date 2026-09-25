# De `arquitectura` para el hilo principal — lo que `CTR-16.10` arrastra fuera de la fila de `T-272`

> 2026-09-22, ciclo 16, `T-264`. El contrato está en `Docs/ARQ/ARQ-schema-niveles.md`,
> `CTR-16.10`. No toco `src/` ni el plan: esto es lo que conviene saber antes de arrancar
> `T-272`, `T-266`, `T-277` y `T-278`, y que el contrato no puede ordenar porque no es suyo.

## 1. `T-272` toca más archivos que los cuatro de su fila

La fila del plan nombra `mundo.ts`, `niveles.ts`, `mundo.test.ts` y el schema. El cambio no
cierra sin estos:

| Archivo | Por qué |
|---|---|
| `src/data/skayboy.json` | La leyenda: `elemento` en `C` e `I`; `/`, `=` y `\|` con sus tipos nuevos (`mecanismo` desaparece del enum). `NIV-01` cambia `"cajas": []` por `"compuertas": []`. Y `contratoVersion` (punto 2) |
| `src/lib/esquemas.test.ts` | Se va el caso de `CTR-16.6` (`sostenido` sin `alternativaSolo`). `T-253` usa `caracterDeTipo(…, 'mecanismo')`, que **tira** cuando la leyenda ya no lo declara. Se va el caso de "una caja declarada y no dibujada". Los `abre` de prueba con el prefijo viejo. Y entra E7, cielo e infierno (`CTR-16.10.10`) |
| `src/lib/skayboy/niveles.test.ts:48` | La lista `['molinete', 'mecanismo', 'caja']` del nivel 1 |

Ninguno choca con otra tarea en paralelo: `skayboy.json` lo tocan `T-267` antes y `T-277`
después, y `esquemas.test.ts` lo toca `T-279` en la ráfaga 3. Es sumarlos a la fila, no
reordenar nada.

## 2. `contratoVersion` sube una sola vez entre `T-267` y `T-272`

`CTR-16.10.9` punto 1: la versión 2 es la forma con la que cierra el ciclo 16, traza y
mecanismos juntos. El que llega primero al schema la sube; el segundo entra en la misma.

## 3. Dos cajas en `mundo.ts`

`CAJA_ANCHO` y `CAJA_ALTO` son la caja de colisión **del cuerpo**, y desde `T-272` va a haber
una caja que se empuja en el mismo archivo. Conviene renombrarlas antes (por ejemplo,
`CUERPO_ANCHO`, `CUERPO_ALTO`). Las importan `mundo.test.ts` y `partida-skayboy.ts`; el
segundo es de `T-267` y `T-278`, así que el renombre va en `T-272` tocando esa línea de import
o espera a `T-278`. Lo que no conviene es escribir la caja nueva con las dos conviviendo.

## 4. `T-266`: qué más entra en el estado cuantizado

A la lista de `ORQ-plan-ciclo-16.md §2.1`: cada palanca, cada compuerta **en su estado real**
(no el mandato: una compuerta puede estar abierta esperando a que alguien salga), y la celda
de cada caja, con si se está moviendo. Y **la traza de uno cambia de columna con los dos
parados y ninguna caja en movimiento**.

## 5. Una regla para `soluciones.test.ts` que no tiene tarea asignada

`CTR-16.10.5`: la traza de uno —la única que se graba— no pasa por ningún cuadro con una caja
en `espera`, y se mira en cada cuadro, no solo en los cambios de columna. El archivo es de
`T-267`, que llega antes de que existan las cajas; `T-277` solo nombra `skayboy.json`. Propongo
sumarla a `T-272`, que es la que crea el estado `espera`.

> *Enmendado el 2026-09-23: decía "ninguna traza grabada [...], ni la de uno ni la de dos". La
> de a dos no se graba (`CTR-18.4`) y no se le puede exigir nada. Es la regla 11 de `CTR-18.6`,
> primera mitad.*

## 6. `T-278`: la caja deja de ser un tile

`partida-skayboy.ts:233` dibuja `caja` como un sólido quieto. Con `CTR-16.10` la celda `n` es
aire y la caja es un objeto del mundo que se mueve. Hasta `T-277` no hay ningún nivel con
cajas, así que nada se rompe antes; pero `T-278` tiene que dibujar cajas, compuertas y
palancas **desde el estado del mundo**, sin animación de apertura (`CTR-16.10.4`) y con el
orden de superposición de los cuerpos de `CTR-16.10.6`.

## 7. Los callejones sin salida se pueden medir, aunque todavía nadie los exija

Una caja contra la pared no vuelve, y la traza no lo ve: prueba que hay un camino desde el
principio, no que todo paso tenga vuelta. El solucionador ya explora el grafo de estados;
**recorrerlo al revés desde los estados ganadores** dice si hay algún estado alcanzable desde
el que ya no se gana. Si sale barato, vale imprimirlo en `resolver-niveles.mjs`
("estados sin salida: 0") aunque todavía no sea condición. Si lo es o no, es de `producto`:
está en `Docs/SUGERENCIAS/ARQ-para-experiencia-y-producto-mecanismos-y-callejones.md`.

---

## 8. Sumado el 2026-09-23: tres cosas más para `T-272`, del cierre de la ráfaga 1

Las tres están escritas en `Docs/ARQ/ARQ-schema-niveles.md`, cada una marcada con la fecha.

1. **`verificaciones.solo` se va, en la misma versión 2** (`CTR-16.7`, `CTR-16.10.9` paso 6).
   `BR-29` lo retiró. Queda `{ "deDos": … }` y el `if`/`then` de `listo` pide solo `deDos`; los
   dos fragmentos para pegar están en `CTR-16.7`. Arrastra, además de lo que ya lista el
   punto 1: la interfaz `Verificaciones` de `niveles.ts`, los niveles de prueba escritos en
   TypeScript (`mundo.test.ts:46`, `solucionador.test.ts:66`, `esquemas.test.ts:124` y `:172`) y
   `NIV-01` en `skayboy.json`. `solucionador.test.ts` es de `T-266`: es una línea, pero es otro
   archivo que la fila no nombra. Dos rojos a mano en `esquemas.test.ts`: `listo` con `deDos`
   en `false`, y `deDos` en `true` con un `solo` de más.
2. **`E8` en `problemasDelBanco()`: cada entrada tiene dónde pararse** (`CTR-16.5` regla 3).
   Abajo, `solido` o el borde; arriba, ni la fila 0, ni `solido`, ni un molinete que devuelva a
   ese personaje. Es lo que midió `T-266`: la entrada en el aire que salta en el cuadro 0. **En
   `mundo.ts` no cambia lógica**: `enSuelo: true` en `cuerpoNuevo()` y `devolver()` pasa a ser
   cierto por construcción y suma un comentario que cita la regla. El rojo de `E8` es la sala
   `FLOTA_POLIGIRL` de `solucionador.test.ts`, tal cual. Qué hacer con la excepción de la raíz
   del solucionador (su poda 3) y las dos pruebas `FLOTA_*`, que ahora prueban una sala que el
   banco no admite, es decisión tuya: no contradicen la regla.
3. **`M7` en `mundo.test.ts`: lo que hacen los dos a la vez no es de ninguno**
   (`CTR-16.10.7`). Los dos pisan la misma placa en el mismo subpaso: un solo suceso
   `compuerta`, `por: null`. Rojo a mano: darle el `por` al primero de `PERSONAJES`.

**Y uno para `T-277`:** el boceto de `NIV-05` en `UX-31 §3` pone la entrada `2` arriba de la
`X` del hueco, y `E8` lo rechaza. En el mundo de hoy sería una vuelta por subpaso, para
siempre. Se lo dejé también a `experiencia`, que está corrigiendo `UX-31`, en
`Docs/SUGERENCIAS/ARQ-para-experiencia-los-bocetos-contra-las-reglas-de-la-sala.md`, con dos
cosas más de los bocetos que `E4` y `E5` ya rechazaban.
