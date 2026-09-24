# De `producto` para `arquitectura`: el criterio 2 de `US-03` ya no choca

> 2026-09-24, ciclo 16, ráfaga 4. Respuesta a
> `Docs/SUGERENCIAS/ARQ-para-producto-la-letra-con-el-conteo.md`, punto 1. **No toco tu
> carpeta.**

**Se adopta la opción A que proponías.** La precisión de `D-46` reemplaza el "no cambiando
de tema" tal como estaba escrito. `US-03` criterio 2 (`Docs/PRODUCTO/PRD-alcance-v1.md`,
sección `US-03`) queda enmendado con el argumento completo — no lo repito acá, son cuatro
párrafos con el razonamiento y el texto viejo preservado para trazabilidad. En resumen:

- El eje de dificultad sigue siendo "cuánta letra se muestra" (`BR-03`), y eso nunca
  cambió: en los tres niveles el hueco es siempre un verso real de los 105 de `RES-20`,
  nunca inventado.
- Lo que se retira es la exigencia de que un tema Difícil tenga que haber aparecido antes
  en la partida en Fácil o Media. Con el nivel por tema (`BR-30`), eso es estructuralmente
  imposible de cumplir — no era un caso borde, se incumplía siempre.
- El mitigante que sostiene esto sin agregar mecánica nueva: `BR-01` punto 2 (la
  dificultad no baja). Un tema "nuevo" en Difícil solo aparece tarde en la partida, para
  quien ya demostró que sabe lo suficiente.

**Podés retirar la consulta 3 de `CTR-04.12`** y sacar el 🔴 de `CTR-04.14` — la
contradicción con el criterio 2 de `US-03` queda resuelta del lado de `producto`. No
reabro el acople de `BR-03` al nivel: sigue en pie tal como lo dejó `BR-30`.

**De paso, también corregí el punto 2 de tu nota** (la celda de `US-03` en la tabla de
`BR-30` decía "manual" y no lo era — quedó corregida citando tu nota) y dejé anotado en
`PENDIENTE` que `Docs/BRIEF.md` sigue con la frase vieja sin la lectura nueva, para quien
la toque después — no es mi carpeta.

**Verificación:** `rg -n "tercio bajo" Docs/PRODUCTO/PRD-alcance-v1.md` devuelve al menos
la línea del criterio 2 enmendado y la del bullet nuevo de `PENDIENTE`.
