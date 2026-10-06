# CNT → producto — `BR-38`: ¿«compartir escena» se mide por hoja o por momento?

> `contenido`, vuelta 2 de `REV-20` (2026-10-06). No edito `Docs/PRODUCTO/`, dejo la propuesta acá.
> Consume: `BR-38` («La gente de la noche»), `D-62` punto 1 y punto 2, `CNT-31` §14.3 y
> `src/data/dos-ejes.json` (`EJ-051`, `EJ-048`, `EJ-049`).
> **Estado: resuelta (2026-10-06):** `producto` decidió en `BR-38`, «La gente de la noche», que la escena es la hoja (`6b1beeb`; `PRD-para-contenido-br38-escena-es-la-hoja.md`). Antes decía: **Estado: abierta.** Nada bloquea el banco; el texto de `EJ-051` queda como está.
>
> **Numeración de `REV-20` (2026-10-06, ronda final).** Este caso no lleva ID: en la lista de `REV-20` es uno de los «sin consenso» (un verificador dijo real y el otro no), y decide `producto`. No es ningún `FIND-1xx` de los que circulan; si se pasa a ficha, el número lo asigna el hilo (desde `FIND-131`).
>
> **Vocabulario, para que no se mezcle (ronda final).** Una *hoja* es un ítem: su enunciado y sus opciones, con el sello y la línea que canta de su momento. Un *momento* son las dos hojas que la noche saca de él, una de cada eje. «Por ítem» y «por hoja» son lo mismo; la alternativa es «por momento». `EJ-051` y el porro (`EJ-048`) o la merca (`EJ-049`) son hojas distintas del mismo momento.

## Qué pasa

`BR-38` dice: *«Un chico y lo que se toma o se fuma no comparten escena. El padre y su hija
están en la escena de la canción, no en la de la ronda. Es lectura de `producto`, por la
misma razón del veto 6; la lee `REV-20`.»*

El banco la leyó **por ítem**: `EJ-051` (*Un padre y su hija grande cantan a dúo.*) y `EJ-048`
(el porro) o `EJ-049` (humo y merca) son **hojas distintas** del mismo momento, *Cuando suena*,
y salen en la misma noche 2 veces de cada 9 (1/3 de `EJ-051` por 2/3 de `EJ-048` o `EJ-049`).
La escena de `EJ-051` —enunciado, sello, línea que canta— no trae nada que se tome ni se fume.

Dos verificadores de `REV-20` leyeron distinto la misma letra: uno dijo que `BR-38` ya separa
por ítem con este mismo caso (su frase siguiente habla de «la escena de la canción» y «la de la
ronda»), el otro que la frase pone al padre y a su hija fuera de la escena de la ronda aunque
la hija sea adulta. **`BR-38` no dice «por ítem» ni «por momento»**, y la frase misma dice que es
lectura de `producto`. En la primera mano yo escribí que la letra ya lo contestaba; era más de
lo que da.

## La propuesta

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `Docs/PRODUCTO/PRD-alcance-v1.md`, `BR-38`, «La gente de la noche», segundo punto | «Un chico y lo que se toma o se fuma no comparten escena. El padre y su hija están en la escena de la canción, no en la de la ronda. Es lectura de `producto`…» | Una línea que diga la unidad, con una de las dos formas. **Por hoja:** «*comparten escena* = salen en la misma hoja (enunciado, sello y línea que canta); dos hojas del mismo momento no comparten escena». **Por momento:** «*comparten escena* = salen en el mismo momento», y, en ese caso, si cuenta un padre con su hija adulta | Es lo único que falta para que la próxima lectura no lo reabra. Con la unidad escrita, `revisor` lo lee contra una regla y no contra dos lecturas de la misma frase |

## Qué hace `contenido` en cada caso

| Si `producto` lee | `EJ-051` | Costo |
|---|---|---|
| **Por hoja** | No cambia | Ninguno. Es lo que hay |
| **Por momento, y lo que molesta es la edad** (*grande* puede ser la hija mayor, una nena) | *Un padre y su hija adulta cantan a dúo. La canción se te pega.* (14 palabras, 62 caracteres, conserva el *te* y el *a dúo*; el argumento completo de por qué *hija de treinta* no entra está en `CNT-31` §14.3) | Una palabra de formulario en un enunciado: *adulta* no es de la voz del sitio. Pasa las guardas de `banco.test.ts` (solo mira el enunciado en largos y vetos de la noche) |
| **Por momento, y lo que molesta es que el padre y su hija compartan momento con la ronda** | La escena pasa a la vereda (el único momento sin nada que se tome ni se fume), con su nena en los hombros, y se escribe otra de orden-caos para *Cuando suena* | Cambia lo que mide un id en dos momentos: es la salida cara, la de la vuelta 7 de `CNT-31` §12 |

## Cómo se verifica

```
rg -n "comparten escena" Docs/PRODUCTO/PRD-alcance-v1.md
node --test src/lib/dos-ejes/banco.test.ts
```
