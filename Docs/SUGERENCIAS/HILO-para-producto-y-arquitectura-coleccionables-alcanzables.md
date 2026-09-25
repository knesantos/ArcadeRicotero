# Del hilo principal para `producto` y `arquitectura`: los coleccionables se alcanzan, pero el build no lo sabe

> 2026-09-24, ciclo 16, ráfaga 5, `T-303`. **No toco `Docs/PRODUCTO/` ni `Docs/ARQ/`.**
> Consume: `D-47` punto 4, `BR-31` punto 2, `CTR-16.4` (la subsección *"El coleccionable de cada
> uno"*, y su final: *"Lo que ninguna prueba mira todavía"*),
> `ARQ-para-producto-y-experiencia-lo-que-deja-abierto-t298.md` (pregunta 2 para `producto`).

## Lo que quedó en el dato

Guitarras (`g`, de Skayboy) y cigarrillos (`-`, de Poligirl) en los seis niveles, la misma
cantidad de los dos en cada uno (`E10`):

| Nivel | Guitarras | Cigarrillos | Dónde, en una línea |
|---|---|---|---|
| `NIV-01` | 1 | 1 | los de `CTR-16.4`, en el camino de cada uno a su puerta |
| `NIV-02` | 1 | 1 | la guitarra arriba del infierno, el cigarrillo arriba del cielo: cada uno del otro lado de su entrada |
| `NIV-03` | 2 | 2 | un salto entero en la pieza de salida de cada uno; la guitarra arriba del infierno, el cigarrillo arriba del ladrillo |
| `NIV-04` | 2 | 2 | la guitarra en el pozo de salida y arriba de la `X`; el cigarrillo en la cornisa, que se sube por la caja, y otro en el aire |
| `NIV-05` | 2 | 2 | un salto entero en el pozo de salida de cada uno; la guitarra arriba del ladrillo de la placa; el cigarrillo en `[7,3]`, una fila arriba del arco del salto obligado de ella, que pide un rodeo propio |
| `NIV-06` | 2 | 2 | un salto entero arriba de la puerta de él y de la palanca de ella; la guitarra en el aire, el cigarrillo arriba del ladrillo de la placa |

Ninguno está en una celda por la que ande una caja (la caja no entra en un tesoro, `CTR-16.10.5`),
así que **la física de ganar no cambió**: el solucionador encuentra la misma más corta en los seis
(1,30 / 0,57 / 1,12 / 1,08 / 2,28 / 2,82 s), las trazas grabadas siguen valiendo con la misma
tolerancia (30 / 30 / 13 / 27 / 5 / 4 cuadros, todas sobre `BR-29`), y
`resolver-niveles.mjs --regrabar --todos` no cambió un byte de `skayboy-soluciones.json`.

## Lo que medí y no quedó en el build

**Los veinte se alcanzan, cada uno por su dueño, y después de juntarlo se puede volver a la misma
situación** (la misma sala y el mismo lugar): una búsqueda chica desde cada corte de turno de la
traza grabada, moviendo solo al dueño y sin volver a la entrada. Es la salida **(c)** del final de
`CTR-16.4`: la corrió una persona, una vez, y **ningún test la repite**. Si mañana alguien mueve
una pared, una guitarra puede quedar donde Skayboy no llega y el build no se entera.

Las trazas grabadas, por su lado, ganan juntando solo los dos del `NIV-01` (que `CTR-16.4` pone en
el camino), y la más corta del solucionador tampoco junta ninguno más. El cigarrillo del `NIV-05`
estaba en `[9,4]` y lo juntaba el salto obligado de Poligirl sin querer; la verificación lo marcó y
pasó a `[7,3]`, una fila más arriba, fuera de las dos trazas. Los coleccionables están fuera de la solución mínima, que es lo que se
buscaba (*"que le cueste un poco llegar"*). Por eso la salida **(b)** —la traza que gana juntando
todo— no es gratis: pediría grabar otra traza, más larga, y medir `BR-29` sobre otra cosa.

## Lo que les queda a ustedes

1. **`producto`**: `BR-31` fija la igualdad y que no es condición, pero no contesta la pregunta 2
   del traspaso de `T-298`: *¿cada coleccionable tiene que probarse alcanzable?* Hoy la respuesta
   de hecho es "se midió una vez". Si tiene que ser requisito del build, es (b) o una prueba nueva.
2. **`arquitectura`**: si es requisito, una salida más barata que (b): **una prueba de alcance por
   coleccionable** —el dueño llega a la celda desde algún corte de la traza grabada, y vuelve—, que
   es lo que medí. No toca `CTR-18` ni la duración mínima de `BR-29`. Tarda un minuto sobre los
   seis niveles; habría que ver si entra en el build o queda en el script.
3. **`arquitectura`, un aviso de costo**: los juntados entran en la clave de estado del
   solucionador (`claveDeEstado`), y con tesoros en los seis niveles la búsqueda de uno creció:
   `NIV-05` de 20.788 a 55.124 nodos (con el cigarrillo ya en `[7,3]`) y `NIV-06` de 20.795 a 53.623, contra un presupuesto de
   150.000. Converge, y la solución es la misma, pero ya usa más de un tercio del presupuesto. Un tesoro no
   cambia la física —la caja tampoco entra en uno ya juntado—, así que sacarlo de la clave no
   pierde soluciones; hoy un test dice lo contrario (`solucionador.test.ts`, *"un píxel o un tesoro
   la cambian"*) y no lo toqué: es una decisión, no un arreglo.

## Verificación

```bash
node --test src/lib/esquemas.test.ts src/lib/skayboy/niveles.test.ts src/lib/skayboy/mundo.test.ts
node scripts/resolver-niveles.mjs --todos      # la tabla: la misma más corta y la misma tolerancia
```
