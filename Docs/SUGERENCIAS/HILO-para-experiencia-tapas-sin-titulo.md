# HILO → `experiencia` — el juego de tapas pasa a zoom, y `UX-05` no lo tiene

- **Fecha:** 2026-08-28 · escribe el hilo principal
- **Para:** `experiencia`, dueña de `UX-05-tapas-en-pantalla.md` y de `UX-04`
- **Y una línea para `arquitectura`:** al final, sobre el contrato.
- **Toca:** `scripts/generar-tapas.mjs` (tabla `JUEGO`), `src/data/tapa.json` (los diez
  ítems), `src/data/_schema/tapa.schema.json` (una regla)
- **No edité `UX-05`.** Es tuyo. Esto es la deuda escrita.

## Cómo se llegó acá, en dos pasos

**Paso 1 — el defecto.** Auditando el banco del quiz salió, de rebote, que `US-04` tenía
uno peor. Abrí los diez masters de a uno:

| Tapa | ¿Imprime el título del disco? |
|---|---|
| Gulp! | **No** — dice «Patricio Rey y sus Redonditos de Ricota», el nombre de la banda |
| ¡Bang! ¡Bang!… | **No** — la cara frontal no tiene una sola letra |
| Las otras ocho | **Sí** |

Y ocho de los diez ítems mostraban la tapa entera. El juego promete reconocer una tapa y
se ganaba **leyendo**. En `TP-007` y `TP-008` era doble: las dos tapas del álbum doble
imprimen los dos títulos, así que descartaban dos de las cuatro opciones.

**Paso 2 — el usuario cortó por lo sano.** Pidió, textual:

> *"El adivinar las tapas debe funcionar como los juegos splash: no mostrar la tapa entera
> sino un zoom alto como para que sea difícil."*

Eso cambia el juego de reconocer una tapa a reconocer un pedazo, y de paso mata el defecto
entero: si el título no entra en el recorte, no hay nada que leer.

## Lo que quedó implementado

`ZOOM` en `generar-tapas.mjs`: el lado del recorte es una fracción del lado corto del
master y **sale de la dificultad del ítem**. Eso es lo que hace que `BR-01` escalone de
verdad, y no solo por qué tapa toque:

| nivel | zoom | del master | qué se ve |
|---|---|---|---|
| `facil` | 0,40 | ~381 px | un motivo entero |
| `media` | 0,26 | ~248 px | una parte de un motivo |
| `dificil` | 0,22 | ~210 px | un rasgo suelto |

Los diez centros, mirados uno por uno contra el master:

| ítem | nivel | centro | qué cae adentro |
|---|---|---|---|
| `gulp` | facil | `[0.42, 0.33]` | el manuscrito verde «Patricio Rey» |
| `oktubre` | facil | `[0.50, 0.83]` | la multitud de caras grises y las banderas |
| `luzbelito` | facil | `[0.50, 0.52]` | el óvalo dorado con el busto |
| `un-baion…` | media | `[0.72, 0.35]` | el muñeco con antifaz y chupete |
| `bang-bang…` | media | `[0.80, 0.33]` | la cara bajo el sombrero ocre |
| `ultimo-bondi…` | media | `[0.50, 0.50]` | las caras de superhéroe en la cúpula |
| `lobo-suelto` | dificil | `[0.53, 0.47]` | los dos colmillos y el hocico partido |
| `cordero-atado` | dificil | `[0.68, 0.28]` | el ojo verde entre las plumas azules |
| `momo-sampler` | dificil | `[0.57, 0.48]` | la cara de piedra del medallón |
| `la-mosca-y-la-sopa` | dificil | `[0.79, 0.50]` | la olla con el cucharón |

Verificado a 375×812: los diez llegan como 480×480 y se dibujan a 326×326, con 32 px de
scroll en toda la pantalla. Sin errores de consola.

## Tres decisiones discutibles, que son tuyas

1. **`UX-05` no tiene esta forma.** El script dice, textual: *«Si cambia el catálogo,
   cambia esta tabla — no al revés»*, y acá fui al revés. Lo hice porque el pedido era
   explícito y esto es reversible, pero el catálogo manda: los centros y los zooms de
   arriba están para que los adoptes o los corrijas.
2. **Esta forma agranda, y es la única del script que lo hace.** El resto respeta el
   `NUNCA AGRANDA` de `UX-04`. Acá no: negarse a agrandar sería topear en silencio cuán
   fuerte puede ser el zoom, que es justo lo que se pidió. Un `dificil` sale de 210 px a
   480 y se ve blando. En un juego de zoom eso es el género, no un defecto — pero si
   preferís nitidez sobre dureza, se sube el zoom de `dificil` a 0,32 y se pierde dificultad.
3. **Dos explicaciones quedaron hablando de algo que ya no está en pantalla.** `TP-002`
   habla del alfabeto del título de *Oktubre* y `TP-007` del alfabeto de *Lobo suelto*, y
   en los dos el zoom cae lejos del título. Reescribí la de `TP-007` para que se sostenga
   sola; la de `TP-002` la dejé, porque una explicación es un dato del disco y no
   necesariamente una descripción del recorte.

## Lo que arreglaría el punto 3, y es la pieza que falta

**Mostrar la tapa entera al revelar.** Es lo que hacen los juegos de splash y es el premio
natural del formato: adivinás por un pedazo, y al acertar ves la obra completa. Hoy no se
puede: `aPayload` en `src/lib/tapa/banco.ts` manda **una sola ruta**. Con `imagen.archivo`
volviendo a ser el slug del disco, las dos rutas salen del mismo dato —
`/tapas/detalle/<slug>-zoom.jpg` para jugar y `/tapas/<slug>.jpg` para revelar — así que es
un cambio chico, pero toca el contrato y la pantalla: es tuyo y de `arquitectura`, no mío.

## Para `arquitectura` — una regla del contrato que reemplacé

`tapa.schema.json` tenía: *`encuadre: "detalle"` ⟹ `dificultad ∈ {media, dificil}`*.
Codificaba el modelo viejo, donde el recorte era la excepción y la tapa entera el caso
normal, así que un recorte no podía ser lo más fácil. **Bloqueaba justamente los tres
faciles.** La reemplacé por la que expresa el modelo nuevo:

> `estado: "listo"` ⟹ `imagen.encuadre === "detalle"` — ninguna tapa se juega entera.

Es más fuerte que la anterior y deja el escalonamiento donde ahora vive de verdad: en el
lado del zoom, no en si hay recorte. El `$comment` de la regla cuenta esto mismo. Si
preferís otra redacción, es tu contrato.

## Dos cosas que no son de nadie de los dos

- **`TP-008` acredita la tapa del vol. 2 a Rocambole y `RES-44` dice que el arte es de
  Semilla Bucciarelli.** El `enum` de `credito.autor` ni siquiera permite escribirlo.
- **`la-mosca-y-la-sopa` sigue con la contradicción abierta** de
  `HILO-para-investigador-tapa-de-la-mosca.md`. Dato nuevo: el archivo
  `la-mosca-y-la-sopa-frontal-real.jpg` es **la misma obra** que el `-frontal`, en más
  resolución. O sea que el que se llama «real» no contradice al que `RES-44` llamó
  rediseño: son el mismo.

## Cómo se verifica

```bash
node --test src/lib/tapa/encuadre.test.ts
```

Tres guardas: ningún ítem muestra la tapa entera, la imagen que juega es un zoom del
generador y no un recorte decorativo, y el archivo que el ítem promete existe en disco.
**Lo que ningún test puede ver es que el recorte no caiga sobre el título**: eso hay que
mirarlo, y los diez están mirados.
