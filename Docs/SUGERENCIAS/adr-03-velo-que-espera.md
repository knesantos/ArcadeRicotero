# Propuesta para `arquitectura`: `ADR-03` y el velo del bestiario que espera (`D-91`, `T-530`)

De: hilo principal (constructor de `T-530`). Para: `arquitectura`. Fecha: 2026-11-15.

## Qué roza

`ADR-03` dice que el paso entre pantallas no tiene JavaScript: es `@view-transition { navigation:
auto; }` y nada más, y donde el navegador no lo soporta se ve el sitio de siempre. El velo de
llegada del bestiario (`D-90`, octava ronda) respetaba eso al pie: una animación de CSS de 900 ms.

El usuario pidió que el velo sea un loader de verdad (*"no hace de loader, nunca termina de cargar
y además a veces como que se traba y ni muestra el loader"*). Eso no se puede hacer sin que alguien
avise cuándo la escena está lista, y ese alguien es la isla.

## Qué se hizo

- El velo de llegada **queda quieto hasta que la isla lo suelta** (`data-listo`, que pone
  `src/scripts/bestiario/llegada.ts` cuando lo de la primera pantalla está decodificado).
- Al tocar un cartel del cruce o «Al plano», la isla pone en la página que se deja **la hoja del
  destino** (`.velo-de-salida`), sin frenar la navegación (`preventDefault` no aparece; lo vigila
  `velos.test.ts`).

## Qué queda intacto de `ADR-03`

- No hay enrutador de cliente: cada pantalla sigue siendo un documento nuevo, y el tránsito entre
  documentos sigue siendo el `@view-transition` de `tokens.css`. El test de `movimiento.test.ts`
  que lo vigila no cambió.
- **Sin JavaScript el velo se va enseguida**, como antes: un `<noscript>` en
  `VeloDeLlegada.astro` lo suelta.
- **Si la isla falla, nadie queda adentro**: un error de script lo suelta, la isla tiene un tope
  de 6 s (`ESPERA.tope`) y, si la isla ni llegó a cargar, la hoja de estilo corta el velo sola a los
  7 s (`--respaldo-velo`). El velo nunca agarra toques (`pointer-events: none`).
- La hoja de salida se retira sola a los 5 s si la página siguiente no llega, y al volver con
  «atrás» (`pageshow`).

## Qué se propone anotar en `ADR-03`

Una línea en §6: *"El velo del bestiario (`D-91`) es la única pieza del paso entre pantallas que
la isla toca: lo suelta cuando la escena está lista y pone la hoja de salida al tocar un cartel. No
enruta, no frena la navegación, y tiene respaldo de CSS y de `<noscript>`."*

`velos.test.ts` decía que ninguna isla nombra el velo; ese test se cambió a propósito por los
cuatro `D-91` de ese archivo.
