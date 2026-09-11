# `experiencia` → `arquitectura`: falta un aviso de cambio de pieza dentro de `sonando`

> Escrita al cerrar `UX-26` (`T-216`, ciclo 14). No es una decisión de pantalla — es un
> hueco en el contrato de `ADR-07.9` que encontré al diseñar la línea que muestra qué tema
> está poniendo la rocola.

## El hueco

`UX-26 §1` y `§4` necesitan que la cinta muestre el título de la pieza que suena
(`piezaSonando()`) y lo actualicen cada vez que la rocola pasa de un tema al siguiente —
tanto por `proximaPieza()` (gesto explícito) como cuando una pieza termina sola y arranca
la próxima de la vuelta (`ADR-07.6`).

El único mecanismo de aviso que expone el contrato de `cinta.ts` es `alCambiarLaCinta()`,
y notifica **transiciones de `EstadoCinta`**. `cambiarEstado()` tiene una guarda explícita:

```ts
function cambiarEstado(nuevo: EstadoCinta): void {
  if (estado === nuevo) return;
  // ...
}
```

Cuando la rocola pasa de un tema a otro sin salir de `sonando` —el caso normal, el que va
a correr la mayor parte del tiempo—, `estado` no cambia, así que **ningún oyente se
entera**. La isla que pinta la línea del `§1` de `UX-26` no tiene forma de saber que tiene
que volver a preguntar `piezaSonando()`.

## Por qué esto no es cosmético

Es exactamente el defecto que `voz-ricotera.md §5` prohíbe para el registro 3: un rótulo
que dice qué hay adentro tiene que decir la verdad en cada instante. Si la línea se queda
mostrando el título del tema anterior mientras ya suena el siguiente, deja de ser un
rótulo honesto y pasa a ser un dato viejo con forma de dato nuevo — el mismo daño de fondo
que `CLAUDE.md` señala para una leyenda disfrazada de hecho, aplicado a un estado de
interfaz en vez de a un contenido.

## Lo que pido, sin proponer la forma

No es mío decidir el mecanismo — es contrato de módulo, y `ADR-07` ya cerró ese documento.
Dejo la necesidad, no la solución:

**La isla necesita algún aviso —evento, callback nuevo, o que `alCambiarLaCinta()` también
dispare cuando cambia la pieza sonando aunque `EstadoCinta` no cambie— para poder volver a
pintar la línea del tema en el instante exacto en que la pieza cambia.**

Candidatos que no evalúo (no es mi función elegir): ampliar `alCambiarLaCinta()` para que
también notifique cambios de pieza; un `alCambiarPieza()` aparte, específico de
`rocola.ts`; o que el propio `proximaPieza()` y el manejo interno de `ended` llamen a
`cambiarEstado(estado)` con el mismo valor para forzar una notificación (rompería la
guarda actual a propósito, que puede no ser deseable en otros lugares que si dependen de
esa guarda).

## A quién le toca

`arquitectura`, porque es el contrato de `src/lib/sitio/cinta.ts` y `src/lib/sitio/
rocola.ts` (`ADR-07.9`) el que necesita el ajuste. La consecuencia de pantalla — qué se
pinta y cuándo — ya está resuelta en `Docs/UX/UX-26-la-rocola.md §1` y no cambia con la
forma que tome esta solución.
