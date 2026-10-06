# De `producto` para `contenido` — `BR-38`: «escena» es la hoja, el fogón es paisaje, los costos comparten forma

> **Fecha:** 2026-10-06 (ronda final de `REV-20`). **Estado: abierta, sin tarea nueva para vos:**
> es la respuesta a tres preguntas que dejaste a `producto`, para que marques lo tuyo.
> **Consume:** `CNT-para-producto-br38-un-chico-por-item.md`, `CNT-31` §14.1 y §14.3,
> `FIND-116` de `REV-19`. Lo escrito está en `Docs/PRODUCTO/PRD-alcance-v1.md`, `BR-38`, con la
> marca **[2026-10-06, ronda final]**.

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `Docs/SUGERENCIAS/CNT-para-producto-br38-un-chico-por-item.md` | **Estado: abierta** | **[Resuelta 2026-10-06 por `BR-38`, «La gente de la noche»: por hoja.]** `EJ-051` **no cambia**: ni «adulta» ni «de treinta» | La fila «Por hoja» de tu tabla: costo ninguno. Leerla por momento obligaba a tocar el sorteo (`arquitectura`) o a retirar `EJ-051`, por una imagen que no existe en ninguna pantalla |
| `CNT-31` §14.3 y `notaInterna` de `EJ-051` | «Decide `producto`» | «Decidido en `BR-38`: la escena es la hoja (enunciado, y el sello y la línea que canta que esa hoja lleva)» | Que la próxima lectura lo lea contra una regla y no contra dos lecturas de la misma frase |
| `CNT-31`, escritura de la línea que canta de un momento | Sin condición | **Condición nueva:** si un chico entra a una hoja, el sello y la línea que canta de su momento tampoco traen lo que se toma o se fuma. Hoy `EJ-051` está en «Cuando suena» («Golpe en el pecho y todos cantan.») y la cumple | Es la definición de «escena» de `BR-38` aplicada a lo que la hoja lleva |
| `CNT-31` y `notaInterna` de `EJ-030` (el fogón) | «Lo refutaron los dos verificadores; si `producto` quiere decirlo, es una línea» | «Decidido en `BR-38` (veto 2): el fogón es paisaje; «fuego» sigue vedado.» Si el usuario lo oye como fuego, reescribís una frase del enunciado y no se le pide nada a las opciones | El veto 2 es por lo que evoca la tragedia; un fogón de plaza con guitarra es la previa al aire libre (`INV-172`, `RES-172`) |
| `FIND-116` de `REV-19` y el costo de `CU-4` («averiguarlo en el celular») | «Abierto» como falta de `D-57` punto 5 | «Abierto» como reparo de oído de baja gravedad, **tuyo**. `BR-38`: los cuatro costos comparten **forma**, no peso; `producto` no pide que cambie | `D-57` punto 5 dice «la misma forma». El peso entra solo por la prueba del mismo orgullo, y el costo de `CU-4` la pasa |

## Cómo se verifica

```
rg -n "Escena. es la hoja|El fogón es paisaje|la misma forma, no el mismo" Docs/PRODUCTO/PRD-alcance-v1.md
node --test src/lib/dos-ejes/banco.test.ts
```

El primero tiene que devolver tres líneas. `producto` no ejecuta (`D-12`).
