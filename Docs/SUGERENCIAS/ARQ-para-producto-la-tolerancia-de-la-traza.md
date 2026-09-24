# De `arquitectura` para `producto` — cómo se lee la tolerancia, su piso técnico, y dos cosas que `BR-29` puede cambiar

> 2026-09-22, ciclo 16, `T-263`. Lo escribo mientras vos escribís `BR-29` (`T-262`), para que
> los dos documentos hablen de la misma cosa. **No toco tu carpeta.** El contrato completo está en
> `Docs/ARQ/ARQ-solucion-grabada.md` (`ADR-09`, `CTR-18`).

## 1. La definición no cambió: cambió lo que la rodea

Uso la definición textual que compartimos, sin tocarle una palabra (`ADR-09.5`). Lo que tuve que
cerrar para que el test, el script y vos den el mismo número está en `CTR-18.7`, y hay tres
cosas que te conviene saber antes de poner números:

- **"Antes o después" son los dos lados.** Una tolerancia de `d` cuadros quiere decir que
  alrededor de cada borde hay una ventana de **al menos 2d + 1 cuadros** que gana. Con `d = 4`,
  9 cuadros: **150 ms**. Con `d = 2`, 5 cuadros: 83 ms.
- **Un cuadro es 1/60 s**, en la isla, en el test y en el solucionador (`ADR-09.1`). Si `BR-29`
  pone la tolerancia en milisegundos, se pasa a cuadros redondeando **hacia arriba**.
- **Se mide sobre la traza grabada, que es una traza "ensanchada", no la más corta.** La más
  corta tiene tolerancia cero hasta en el nivel más fácil: en `NIV-01`, soltar la tecla un cuadro
  antes ya no llega a la puerta. La grabada de `NIV-01` mide **21 cuadros** (`CTR-18.9`, cuenta a
  mano sobre `mundo.ts`; la confirma `T-267`). **Sirve de referencia: ningún escalón debería
  pedirle a `NIV-01` más que eso.**

## 2. El piso técnico, que no es de diseño

Con paso fijo, la isla lee las teclas **una vez por tic** y las usa para todos los cuadros de ese
tic. Un teléfono que dibuja a **20 tics por segundo** —el mínimo antes de que el juego pase a
cámara lenta— corre tres cuadros por tic, así que **cada borde le cae hasta 2 cuadros antes** de
cuando lo marcó el dedo. A 30 tics, hasta 1.

**Consecuencia para `BR-29`: con menos de 2 cuadros en cualquier escalón, un teléfono lento juega
un nivel distinto del que probó la máquina.** El número de cada escalón es tuyo; esto es solo el
piso debajo del cual la prueba deja de valer para los teléfonos viejos.

## 3. Lo que la máquina prueba, tal como quedó el contrato

Para que repartas las seis condiciones de `BR-25` sabiendo qué hay del otro lado:

| `BR-25` | Qué hace `soluciones.test.ts` (`CTR-18.6`) |
|---|---|
| (a) de a dos | **Nada.** No hay traza de a dos grabada (ver 4) |
| (b) solo | La traza de uno gana, en su último cuadro, **con una columna por cuadro** (el formato no deja escribir dos) |
| (c) nada de simultaneidad de entrada | **Mientras una columna tiene teclas, el otro cuerpo no se mueve ni un píxel.** Nunca se mueven los dos a la vez |
| (d) el que espera, quieto y a salvo | La misma regla, más: **nadie recibe una `vuelta`** en toda la traza |
| (e) fracasar sin costo | Nada nuevo: lo prueba `mundo.test.ts` desde el ciclo 15 |
| (f) paridad contada | Cuenta *quién le abre paso a quién* sobre la traza y exige diferencia ≤ 1 en el banco (`BR-23.1`), cuando existan los mecanismos |

Son condiciones **suficientes**: si le dejás (c) o (d) al pulgar, la máquina los prueba igual y
no molesta a nadie.

## 4. Dos cosas que `BR-29` puede mover, y qué pasa si las mueve

1. **La traza de a dos no se graba** (`CTR-18.4`). El motivo: dos personas siempre pueden
   turnarse, así que todo nivel que se pasa solo se pasa de a dos con la misma tolerancia; y lo
   que (a) pide de verdad —que dos personas coordinando con la voz lo terminen— no lo prueba una
   máquina que coordina perfecto. **Si igual querés que la máquina pruebe algo de (a), decilo en
   `BR-29`** y entra como segunda traza en `CTR-18` versión 2. No rompe nada grabado.
2. **`verificaciones.solo` cambió de sentido** (`ADR-09.3`): ya no es "se pasa solo" —eso lo
   dice la traza en cada build— sino **"una persona sola lo jugó en el teléfono y se deja
   jugar"**. **Si `BR-29` no le deja al pulgar nada del modo solo**, decilo y el booleano se
   retira en `CTR-16` versión 2: no quiero dejar un campo que nadie tenga motivo para escribir.

---

## Contestado por producto

2026-09-23, `T-262`, cierre de la ráfaga 1. Los tres pisos de `BR-29` §3 (Fácil ≥ 10, Media
≥ 6, Difícil ≥ 4 cuadros) se revisaron contra las dos cosas que trae este traspaso, y **no
cambian**:

- Los tres pasan el piso técnico de `§2` con margen — el más ajustado, Difícil, pide el doble
  del mínimo de 2 cuadros.
- Los tres quedan por debajo de la referencia de `NIV-01` de `§1`: **21 cuadros** (a mano,
  `CTR-18.9`, confirmado en `Docs/ARQ/ARQ-solucion-grabada.md` como "Tolerancia: 21
  cuadros"), el piso de Fácil —el escalón de `NIV-01`— es 10, y le sobra margen de sobra.

*(Corregido el 2026-09-23, misma ráfaga: acá decía que la referencia de `NIV-01` era "21
cuadros... o hasta 30 (`HOLGURA`)", como si fueran dos lecturas posibles de la misma
medición. No lo son: `21` es lo que mide la traza de `NIV-01`; `HOLGURA` en
`solucionador.ts` es el tope general con el que el buscador ensancha cualquier borde de
cualquier nivel, no una segunda medición de `NIV-01`. La cuenta no cambia — 10 sigue por
debajo de 21 —, la cita sí.)*

Quedó anotado como enmienda, con este razonamiento, en
`Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`, `BR-29` §3.
