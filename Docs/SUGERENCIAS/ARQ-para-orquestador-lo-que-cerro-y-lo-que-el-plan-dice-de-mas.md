# De `arquitectura` para `orquestador` — qué cerró de `REV-14` y cuatro números que el plan dejó viejos

> 2026-09-16, después de `REV-14`. Corto a propósito: es el estado de las tareas mías y las
> cadenas del plan que quedaron desactualizadas por lo que cerré. **No toco tu carpeta.**

## Lo que quedó cerrado en `Docs/ARQ/`

| Tarea del plan | Estado | Dónde mirarlo |
|---|---|---|
| `T-228` — el desenlace medido del módulo del píxel y la regla de fondo | **cerrada** | `CTR-15.2` declara `N = 1` con los números de tu `§1.1`, mata los otros dos desenlaces, y `CTR-15.4` reemplaza "coincidencia exacta de color" por "el alfa sale del dibujo, no de la hoja" |
| `T-230` — una sola geometría y una sola carpeta | **cerrada** | `ADR-08.3`, `CTR-15.3` y `CTR-16.2` dicen **240 × 144 nativos · 15 × 9 tiles · celda 16 × 24 nativos**, que es `UX-27 §2`. Carpeta: **`public/sprites/`**, confirmada contra `D-41` punto 4, con la corrección de `UX-27` pedida en `ARQ-para-experiencia-la-carpeta-y-el-recorte-a-mano.md` |
| `T-236` — `CTR-17` y `CTR-16.4` alineados con `UX-29` | **cerrada** | `CTR-17.1` quedó en **tres** efectos; `CTR-16.4` cambió `tipo:"letal"`/`mata` por `tipo:"molinete"`/`devuelve` |
| `FIND-58` y `FIND-60`, que no tenían tarea | **cerrados en la misma pasada** | `CTR-16.3` perdió `inmuneA` entero; `CTR-15.4` bajó a **16 tintas para toda el área** y el JSON del atlas pasa a declarar **nombres de token**, no hexadecimales |
| `T-231` — la puerta del nivel 1 (`FIND-59`) | **sigue abierta, y no la toqué** | Es tuya con `producto`. Dejé el choque **marcado** en `CTR-16.5`, con el costo de cada salida escrito, para que la conversación no empiece de cero |

## Cuatro cadenas del plan que quedaron viejas

1. **`T-246`, columna de salida:** dice `public/<la carpeta que gane en T-230>/`. Ya ganó:
   **`public/sprites/`**.
2. **`T-236`, criterio de aceptación:** dice *"`CTR-17.1` queda en cuatro efectos"*. Son
   **tres** — `muerte` lo saca `FIND-57` y `cambio` lo saca `D-43` consecuencia 1, que el
   plan todavía no podía conocer.
3. **`T-245`:** *"los cuatro efectos sintetizados de `CTR-17`"* → **tres**: salto, tesoro,
   puerta. Y su criterio *"el fracaso no dispara nada"* ahora tiene respaldo en el contrato,
   no solo en `UX-29`.
4. **`T-243`, el auditor de paleta:** se escribe contra **16** tintas (`UX-27 §4`) y escanea
   **`public/sprites/`**. Y le agrego un requisito que sale de `FIND-60`: como el JSON del
   atlas declara nombres `--px-*` y no hexadecimales, el script tiene que **resolverlos
   contra `src/styles/tokens.css`** y fallar si un nombre no existe ahí. Es una línea más y
   cierra el circuito de `diseno-marca.md` (un hex vive en un solo archivo).

## Una tarea que el plan no tiene y `FIND-58` dejó pedida

`CTR-16.4` pide, además del schema, **un caso de prueba propio en `src/lib/esquemas.test.ts`**
que cuente los molinetes: exactamente uno que devuelva solo a `skayboy`, uno que devuelva solo
a `poligirl`, y uno que devuelva a los dos. **JSON Schema no sabe contar propiedades de un
objeto por su contenido**, así que esa regla no entra en el `.schema.json` y, si nadie la
escribe a mano, no la verifica nada. Son cuatro líneas de JavaScript y su lugar natural es
`T-242`, que ya toca ese archivo.
