# UX-38 — El plano de dos ejes vuelve al resultado: un recorte de papel, fijo, sobre la grilla

> Rol dueño: `experiencia`. **v1.1 — 2026-10-05 — la versión construida; al día el 2026-10-06
> tras `REV-20` (texto del lector, `T-352`, `G10`, lo medido) y puesta al día otra vez en su ronda final
> (`T-351` cerrada, el texto del lector armado en `textoDelPlano()`, las fechas de las medidas).** Rama
> `ciclo-18/que-ricotero-sos`. La v1 del mismo día especificaba el plano **relativo**; el usuario
> eligió el **fijo** y el hilo principal lo construyó (commits `09585bf`, `2fc87b8`, `4296283`).
> Esta versión describe lo que hay, contesta la crítica adversarial de la v1 (quince puntos, `§11`) y
> **no borra la historia**: lo que la v1 recomendaba sigue escrito donde estaba, marcado `[v1]`.
>
> Pedidos del usuario, textuales:
>
> 1. *"Me gustan las explicaciones pero quiero que esté el gráfico también, queda lindo ver que
>    está en un plano de dos ejes."* (mirando el resultado en su teléfono)
> 2. *"B, el fijo como el rombo viejo."* (`D-62` enmienda 3, después de mirar las dos versiones lado
>    a lado.) **Ojo con la letra:** la "B" es la de esa comparación. En la tabla de `§2.4` de esta
>    hoja, el plano fijo con Luz arriba y Orden a la izquierda es la **opción A**; la B de esa tabla
>    (luz–oscuridad en el horizontal) no se construyó.
>
> **Qué enmienda.** `UX-36` (lo que decía del plano: "el rombo se va", "ningún punto en el plano",
> "la tarjeta no lo muestra"), `D-57` punto 7 (la grilla pasaba a ser **el** plano) y, por decisión del
> usuario, el criterio 3 de `US-06` en lo que toca al plano (lo enmienda `producto`, `D-62` enmienda 3).
> La grilla de las cuatro maneras **no se toca**: el plano se suma arriba, no la reemplaza. Las marcas
> de enmienda en `UX-36` están al día con esta versión (cabecera, `§5.3`, `§5.6`, `§5.8`, `§6.2`).
>
> **Consume:** `D-62` y sus tres enmiendas, `D-57` punto 7, `D-33`, `D-14`, `D-17`, `D-19`, `D-21`,
> `D-58`, `US-06` (criterios 3, 4c y 9), `BR-17`, `BR-37`, `BR-38`, `CTR-08` v2.5 (`disposicion`, `relacion`),
> `UX-36` entera, `UX-06` §4 (el rombo viejo), `UX-35` §4.4, `REV-19` (las alturas medidas), `REV-20`,
> `CNT-31` §13 (el texto del lector), la crítica adversarial de la v1, `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`, `tokens.css`,
> `juego.css` (bloque `.ejes-plano*`), `partida-dos-ejes.ts` (`plano()`, `grilla()`), `partida.ts`
> (`PLANO_FIJO`, `planoFijo()`, `disposicion()`), `copy.ts` (`RESULTADO.altPlano`, `.lugares`,
> `textoDelPlano()`), `estilos.test.ts`, `contraste.test.ts`, `partida.test.ts`, `isla.test.ts`,
> `copy.test.ts`.
>
> **Resuelve:** la parte de pantalla de `US-06` c3 (el plano), c4c (la manera de quien te mandó el
> enlace, punteada, también acá) y el criterio 9 (las siete condiciones del plano, de la enmienda
> tercera de `producto`). **No resuelve:** el CSS ni la isla (hilo principal), el motor, ni el texto que
> lee el lector de pantalla: lo propuso el hilo y lo confirmó `contenido` (`T-352`, **cerrada**,
> `CNT-31` §13); hoy lo arma `textoDelPlano()` (`copy.ts`, `798cd54`).
>
> **Qué cambió de la v1 a la v1.1**
>
> | Sección | v1 | v1.1 |
> |---|---|---|
> | `§0`, `§1` | Plano relativo, sin cadena nueva, escondido al lector | Fijo; dos cadenas nuevas (`altPlano`, `lugares`); `role="img"` |
> | `§2` | "La orientación: relativa" | **"Lo que se eligió y lo que cuesta"**; la tabla de opciones queda como historia (`§2.4`); por qué conviven plano y grilla (`§2.2`) |
> | `§3.2`, `§4.3` | Cuentas | **Medidas** (REV-19 y las del hilo); la cuenta de la v1 se deja al lado y se marca como errada |
> | `§4.2`–`§4.4` | Geometría sin especificar | La geometría construida, y seis trampas del CSS (dos nuevas) |
> | `§5` | `aria-hidden`; una fila de la tabla era falsa | `role="img"` con su texto; tabla corregida |
> | `§6` | Razón 3: "es relativo" | Razón 3 invertida; la decisión de no ponerlo en la tarjeta se sostiene por las otras cuatro |
> | `§8`, `§10` | Guardas y checklist a futuro | Con su estado real: lo hecho, lo medido por el hilo, lo que falta |
> | `§9.2` | Cinco abiertos (el 5, el volumen) | El volumen sale (`D-62` enmienda 1); entran los costos de lo fijo |
> | `§11` | — | **Nuevo:** la crítica, punto por punto, y "Lo que se discutió" |
> | `§1.2`, `§5`, `§8`, `§9.2`, `§10` | *(2026-10-06, tras `REV-20`)* El texto del lector de la primera propuesta del hilo (punto y coma, «La tuya»), `T-352` abierta, `G10` sin guarda, casi nada tildado | El texto construido (puntos entre polo y polo, «Tu manera»), `T-352` cerrada, `G10` hecho (`copy.test.ts`), lo que `REV-20` midió tildado y lo que falta, con dueño |
> | `§1.2`, `§4.2`, `§5`, `§8`, `§10` | *(2026-10-06, ronda final de `REV-20`)* `T-351` abierta (el plano por pegar en las hojas 08 y 09 del lienzo); el texto del lector armado a mano en la isla y en `copy.test.ts`; `copy.test.ts` con seis tests; medidas del hilo y de `REV-20` fechadas el 2026-10-06; «14 avisos» | `T-351` **cerrada** (hoja 16 del lienzo); `textoDelPlano()` arma el texto en un solo lugar y `copy.test.ts` tiene **ocho** tests; las medidas son del **2026-10-05**; **0 avisos y 14 hints** |
>
> **Ronda final de `REV-20` (2026-10-06): qué se arregló en esta hoja y qué dice de los hallazgos.**
>
> - **`FIND-120` de `REV-20`** es esta hoja: decía «la versión construida» y describía lo anterior (el texto
>   del lector con punto y coma y «La tuya», `T-352` abierta, `G10` sin guarda, `§8.2` sin tildar). La puesta
>   al día del mismo día (`650f9a9`) lo cerró; esta ronda sigue desde ahí. *(Numeración: el lente de
>   pantalla lo había numerado `FIND-121`; en la definitiva es `FIND-120`. La hoja no citaba ningún `FIND`
>   hasta esta nota.)* El criterio 9 de `US-06` ya está en «Consume».
> - **`T-351` está cerrada** (`2a8d943`): el plano se pegó en el lienzo **como hoja 16**, debajo de la 08 en
>   la página Aplicación; **no entró en la 08 y la 09** como pedía la ficha de `§8.2`, que queda abajo como
>   se escribió, marcada.
> - **El texto del lector se arma en `textoDelPlano()`** (`copy.ts`, `798cd54`), una sola función que usan
>   la isla y `copy.test.ts`; `copy.test.ts` tiene **ocho tests** y uno ata el orden de `RESULTADO.lugares`
>   con el de `planoFijo().celdas`. El límite que `REV-20` anotó como diferido («el test arma a mano los
>   argumentos») ya no existe (`§8.1`, G10).
> - **Las fechas.** Las medidas que esta hoja llama **(hilo)** y las que marca `(REV-20)` se tomaron el
>   **2026-10-05**; `REV-20` se escribió entre el 05 y el 06. Donde esta hoja decía «`REV-20`, 2026-10-06»
>   para una medida, está corregido; **las puestas al día del texto sí son del 06**.
> - **`npm run check`: 0 errores, 0 avisos y 14 hints** (no «14 avisos»): los hints son de `aparato.ts`,
>   `diagnostico-audio.ts` y los `is:inline` de las páginas; ninguno es del plano (`§10.0`).
>
> Los hashes de commit de esta nota me los pasó el hilo; yo no corrí `git`.
>
> **Lo que no pude hacer, dicho antes que nada.** Esta sesión tampoco tuvo shell (`D-12`): no corrí
> nada, ni `git show`. Leí el **árbol de trabajo** (`partida-dos-ejes.ts`, `juego.css`, `partida.ts`,
> `copy.ts` y los tres tests), no los commits. **Los números de pantalla de esta versión son de cuatro
> clases:** **leído** (del código, de un test o de `REV-19`, y lo cito), **(hilo)** (lo midió el hilo con
> Playwright y me lo pasó; yo no lo corrí), **cuenta** (mía, sin correr nada) y **por medir** (va a
> `§10`). Los píxeles de pantalla son a 375 × 667 salvo que diga otra cosa. **Las cuentas de ancho de
> letra de la v1 ya no se usan:** erraron, y no siempre para el mismo lado (`§4.3`). Donde una cuenta mía y una
> medida del hilo chocan, vale la medida.

---

## 0. Lo que hay, y qué se hace

**Antes del plano**, el resultado es la última hoja (nombre, sello de polos, línea que nombra,
bajada), los dos botones y, debajo, "Las cuatro maneras": una grilla de dos por dos **relativa** con
cada celda que abre su explicación (`UX-36` §5.3). **Hasta el ciclo 18** había un rombo con un punto
(`UX-06` §4). `D-57` punto 7 lo sacó por dos razones: dejaba las dos caras de luz siempre arriba (una
jerarquía) y el punto podía leerse como una medida.

**Lo que se hizo.** Vuelve un plano, **no el rombo**: un recorte de papel pegado con dos ejes en
cruz, los cuatro cuadrantes con su nombre, los cuatro extremos con su polo en palabras y la tuya
marcada. Va **debajo de los botones, arriba de la grilla**, **fijo** (Luz arriba y Orden a la
izquierda, el mismo dibujo para todos: `D-62` enmienda 3), **sin punto**, escrito en HTML y leído por
el lector de pantalla como **una imagen con su texto** (`role="img"`). **No viaja** en la tarjeta ni
en la vista previa. Las razones, una por una, en `§1` a `§6`.

**No hay brief de arte original.** Es papel, tinta y CSS, como el resto del juego (`UX-36` §0.2): no
hay pieza que producir.

### 0.1 El flujo, de punta a punta (`US-06` c3, c4c)

| # | Pantalla | Qué pasa |
|---|---|---|
| 1 | La última hoja | Igual que antes (`UX-36` §5.1). El foco cae en el nombre; **el plano nunca toma el foco** |
| 2 | Los dos botones | **Compartí** y **Empezá otra noche**, donde `REV-19` los midió. **No se mueven** (`§3.2`, hilo) |
| 3 | Un deslizamiento | "Las cuatro maneras", su línea que canta y, si vino un enlace, la línea de contraste |
| 4 | **El plano** (nuevo) | Se mira. No se toca: no suma ninguna decisión ni ningún toque. La tuya está en su rincón, con su sello; si vino un enlace, la otra, punteada |
| 5 | La grilla | Se toca una celda y se abre su explicación (sin cambios) |
| 6 | "Bajá la tarjeta" y "← Volvé al fichín" | Igual; **quedan entre 327 y 378 px más abajo, más el aire** (`§3.2`) |

- **Acertar y fallar no existen** (`D-33`): el plano no festeja, no se anima y no marca ninguna manera
  como mejor.
- **Compartir no cambia:** viaja la tarjeta de la identidad y el enlace a la postal (`UX-36` §6.1).
  El plano no viaja (`§6`).
- **Si el plano no se puede armar**, no se pinta y nada más cambia. Está construido así: `plano(id)`
  se llama dentro de un `try/catch` en `grilla()`, que cuelga de `pintarResultado()` **después** de
  `.ejes-acciones`; el nombre, los botones y la grilla no dependen de él.
- **Tiempo:** el plano queda **fuera del camino de los dos minutos** (que termina en Compartí). Es
  lectura opcional, ≈ 5 a 10 s (cuenta) para quien baja. La noche sigue en ≈ 1:20–2:05 (`UX-36` §1.1).
- **La primera pantalla sin muro no se toca:** el plano vive solo en el resultado, nunca en la
  portada ni en la postal.

---

## 1. Qué es el gráfico (decisión 1)

### 1.1 Qué muestra

Un recorte de papel con **dos ejes que se cruzan** (luz–oscuridad vertical, orden–caos horizontal),
**cuatro cuadrantes** con su nombre, **cuatro extremos** con su polo en palabras, **la tuya marcada**
y, si vino un enlace, **la de quien te lo mandó, punteada**.

Boceto sin escala, para quien salió «Mesa larga a las nueve» (`CU-1`) y cuya postal venía con
«Mochila liviana, sin mapa» (`CU-4`, la opuesta). **El eje horizontal corre entero**; los polos de
los costados lo montan (el polo arriba de la línea, sus palabras abajo), y el eje vertical llega a los
polos de arriba y de abajo:

```
                          LUZ
                      con la gente
                           │
    ┏━━━━━━━━━━━━━━━━━┓    │
    ┃ ESTA NOCHE      ┃    │       Ronda en
    ┃ Mesa larga      ┃    │       cualquier esquina
    ┃ a las nueve     ┃    │
    ┗━━━━━━━━━━━━━━━━━┛    │
  ORDEN                    │                     CAOS
 ──────────────────────────┼──────────────────────────
  con plan                 │          sobre la marcha
                           │
     Radio bajita,         │    ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
     misma hora            │    ┆ QUIEN TE LO    ┆
                           │    ┆ MANDÓ          ┆
                           │    ┆ Mochila liviana┆
                           │    ┆ sin mapa       ┆
                           │    └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
                           │
                      OSCURIDAD
                      con lo propio
```

**El dibujo es el mismo para las cuatro maneras.** Lo único que cambia de una persona a otra es dónde
están el sello "Esta noche" y, si vino un enlace, el punteado (`§2.1`, los cuatro rincones).

> `[v1]` El boceto de la v1 interrumpía el eje horizontal con los polos del medio y movía los
> polos según quién jugaba. Lo primero lo cambió el hilo al construir (`§4.3`); lo segundo, el usuario
> (`§2`).

### 1.2 De dónde sale cada cosa

| Elemento | Qué es | Cadena |
|---|---|---|
| Polo de arriba y de abajo | El eje de luz–oscuridad | `EJES[renglones[0]]` y `[1]`, y debajo `POLOS[…]` (`copy.ts`), con `renglones` de `planoFijo()`: luz, oscuridad |
| Polo de la izquierda y de la derecha | El eje de orden–caos | `EJES[columnas[0]]` y `[1]`, y debajo `POLOS[…]`, con `columnas` de `planoFijo()`: orden, caos |
| Cuadrantes | Las cuatro maneras, en el orden de `planoFijo().celdas` | `celdas[k].nombre` (el banco) |
| Sello de la tuya | Borde grueso y sólido, más el sello | `RESULTADO.tuya` ("Esta noche") |
| Sello de la del amigo | Borde punteado, más el sello | `RESULTADO.suya` ("Quien te lo mandó") |
| Los ejes | Dos líneas que se cruzan en el centro | Ninguna: son borde |
| **Lo que oye el lector (nuevo)** | Los dos ejes, sus polos y dónde cae la tuya | `textoDelPlano(banco, id, suyoId)` (`copy.ts`), que arma `RESULTADO.altPlano(…)` con `RESULTADO.lugares` y los polos de `planoFijo()` |

Las cadenas de las cinco primeras filas son las mismas que la grilla ya usa, así que `voz.test.ts` y
`banco.test.ts` ya las vigilan. **La última fila trae dos cadenas nuevas** (la v1 prometía que no habría ninguna; `§5` dice
por qué hubo que romper la promesa): las propuso el hilo y **`contenido` las confirmó (`T-352`,
cerrada; `CNT-31` §13)**, `altPlano` con dos cambios sobre la primera propuesta (`§5`) y `lugares` sin
cambios. `voz.test.ts` no llega a `altPlano` (la llama con un comodín, recibe un objeto y el `catch` lo
traga), pero **`copy.test.ts` la vigila** en veinte casos, con ocho tests (`§8.1`, G10).

El rótulo de cada polo va en **dos renglones** (el polo en rotulada y mayúsculas, sus palabras debajo)
y no en uno con " · " como los márgenes de la grilla. La razón sigue siendo la franja del eje
horizontal, donde los dos rótulos van lado a lado: en un renglón sumaban ≈ 267 px contra ≈ 248 útiles a
320 (cuenta de la v1); en dos entran siempre. Los de arriba y abajo van igual, para que los cuatro sean
la misma pieza.

**Registro:** todo es registro 3 (rótulos y nombres de cosa): seco, sin imagen, sin suspensivos. La
línea que canta ya está arriba ("Cuatro puntas de la misma hoja.") y ahora tiene su hoja delante.

### 1.3 ¿Hay un punto? No

Hay un recuadro y un sello **en el cuadrante**, no un punto **dentro** de él. Tres razones, la segunda
reescrita para el plano fijo:

1. **Un punto invita a mirar a qué distancia queda del eje y de la esquina**, que es justo lo que
   `BR-17` y el criterio 3 de `US-06` no dejan mostrar ("ningún grado dentro de la manera").
   `resolverCuadrante` no devuelve números (`CTR-08.6`), así que el punto no podría mover nada, y un
   punto que no puede moverse solo aparenta una medición. Es lo que ya decía `D-57` punto 7.
2. `[v1]` *"En un plano relativo no informaría nada."* **Ya no vale tal cual:** en el plano fijo, el
   lugar de un punto sí diría algo. Pero lo que diría es el cuadrante, que ya dicen el borde y el
   sello; de *cuánto* no puede decir nada. Un punto sería la misma información con apariencia de
   medida.
3. **El idioma del sitio para "esta" es el borde más el sello**, y la grilla ya lo usa. Una sola marca
   para las dos figuras: lo grueso es tuyo, lo punteado es del otro, y el sello lo dice con letras.

**Es la pregunta que más probablemente vuelva.** El rombo viejo tenía punto y el usuario pidió el
plano *"como el rombo viejo"*. La enmienda 3 ya dejó escrito que el punto no vuelve (`BR-17`); si el
usuario lo pide, es otra decisión suya.

**Si igual se pide**, corrijo lo que la v1 proponía ("en el centro de la caja del nombre", que cae
encima de la letra): el único punto coherente es de 12 px en `--fondo`, **fijo en el centro de su
cuadrante y fuera de la caja del nombre**, jamás con una posición calculada. Es lo que hacía el rombo
y lo que `D-57` sacó; no dice más que el borde. No lo recomiendo.

### 1.4 Lo que el gráfico no tiene

Ningún número, ninguna escala, **ninguna marca regular sobre un eje** (una raya cada tantos píxeles es
una escala), ninguna punta de flecha (dice "más hacia acá"), ningún relleno por cuadrante (el relleno
distinto pesa distinto), ningún degradado, ningún punto, ningún nombre más grande que otro, ninguna
animación. Los cuatro cuadrantes miden lo mismo y llevan la misma letra.

---

## 2. La orientación (decisión 2): fija, por decisión del usuario

### 2.1 Lo que se eligió y lo que cuesta

**Lo que se eligió.** Luz arriba y Orden a la izquierda, **el mismo dibujo para todos** (`D-62` enmienda
3). Está en `PLANO_FIJO` y `planoFijo()` de `partida.ts`; cada manera tiene su rincón por sus dos
polos, el mismo para todos, y la tuya se marca donde cae:

| Rincón | Manera | Polos |
|---|---|---|
| Arriba a la izquierda | `CU-1` «Mesa larga a las nueve» | Luz + Orden |
| Arriba a la derecha | `CU-2` «Ronda en cualquier esquina» | Luz + Caos |
| Abajo a la izquierda | `CU-3` «Radio bajita, misma hora» | Oscuridad + Orden |
| Abajo a la derecha | `CU-4` «Mochila liviana, sin mapa» | Oscuridad + Caos |

**Lo que se gana.**

- **Lo que pidió el usuario**: *ver que está en un plano de dos ejes* y dónde cayó. En el relativo, la
  tuya caía siempre en el mismo lugar y el dibujo solo cambiaba de rótulos.
- **Dos amigos con resultados opuestos miran el mismo mapa.** Y la línea de contraste (`CNT-29`) se
  vuelve visible: compartir un polo es estar en la misma fila o en la misma columna.
- El lector puede decir un lugar que significa lo mismo para todos (`§5`).

**Lo que cuesta, sin vueltas.**

- **«Mesa larga a las nueve» queda siempre en el rincón donde empieza la lectura, y «Mochila liviana,
  sin mapa» queda siempre en el último, en cualquier orden de lectura.** Para un cuarto de la gente,
  el plano pone su manera "de última", para siempre. Es la jerarquía de lugar que `D-57` punto 7 le
  había sacado al rombo; vuelve por decisión del usuario, que vio las dos versiones.
- **Luz arriba suma una segunda lectura** (arriba, bien) a una palabra que ya la empujaba: `UX-36` §5.3
  anotó que "Oscuridad" se leía triste.
- **Reabre el criterio 3 de `US-06`** ("nada jerarquiza una manera sobre las otras tres"): lo enmienda
  `producto`, con el plano exceptuado. No es mío.
- **Lo que lo acota, y sigue intacto:** ningún número, escala ni punto (`§1.4`); los cuatro nombres con
  la misma letra y el mismo cuadrante; el sello dice "Esta noche" y no "estás acá"; y la grilla de
  abajo, que sigue siendo de cada uno (`§2.2`).
- **Si alguien lee el rincón como "mejor" o "peor" no se sabe**: va a `§9.2` y a `§10.5`, con gente real.

### 2.2 Por qué conviven un plano fijo y una grilla relativa

**El plano es el mapa (el mismo para todos: dónde cayó cada uno); la grilla es la lista (la tuya
primero: para leer).** Cada una hace un trabajo que la otra no podría: la lista no puede ser un mapa
sin fijar a nadie, y el mapa no puede ser una lista sin dejar de ser mapa. La grilla sigue
`disposicion()`, que no se tocó; el plano sigue `planoFijo()`. Lo dejó escrito `D-62` enmienda 3
("si el usuario la quiere fija también, es otro pedido").

**El costo de que convivan:** en una misma pantalla hay dos reglas de lugar. «Mochila liviana» puede
estar abajo a la derecha en el plano y arriba a la izquierda en la grilla. Lo que une las dos figuras
es el sello "Esta noche", que está en las dos. Si no alcanza, es un hallazgo de teléfono real
(`§9.2`, `§10.5`).

### 2.3 La prueba del cuadrado latino: ahora vale para la grilla

Entre las cuatro grillas posibles, **cada manera ocupa cada lugar exactamente una vez** (un cuadrado
latino de 4 × 4), y **cada polo está arriba en dos de las cuatro y abajo en las otras dos** (lo mismo a
izquierda y derecha). Lo vigila `partida.test.ts` (*"la grilla relativa no le da a nada un lugar fijo
(UX-38 §2.3)"*). **Del plano ya no se afirma esto** —es fijo— y se vigila lo contrario: que no
dependa de quién juega (`§8`, G1b).

### 2.4 La historia: las cinco opciones de la v1

`[v1]` Esto es lo que se pesó antes de que el usuario viera nada. Se deja entero; la última columna es
lo que pasó.

| Opción | Cómo queda | Qué rompe | Veredicto `[v1]` | Qué pasó |
|---|---|---|---|---|
| **A.** Cruz de siempre, igual para todos | Luz arriba y oscuridad abajo, orden a un lado y caos al otro (cualquier variante) | **La misma** manera cae arriba a la izquierda para las cuatro personas posibles y otra abajo a la derecha: la jerarquía del rombo con otro dibujo | No | **Elegida** por el usuario ("B, el fijo": Luz arriba, Orden a la izquierda). Se construyó |
| **B.** Igual para todos, **luz–oscuridad en el horizontal** | Luz a la izquierda, oscuridad a la derecha; orden arriba, caos abajo | La jerarquía **se muda de eje, no se va**: «Mochila liviana, sin mapa» (oscuridad + caos) cae abajo a la derecha, **última en cualquier orden de lectura, para siempre** | No | No se construyó. (Su costo es el mismo que el de la A, `§2.1`) |
| **C.** El rombo, girado | Los polos en las puntas y las maneras en las caras | Es el que `D-57` punto 7 sacó. Girarlo 45° más deja una *manera* en la punta de arriba | No | Sin cambios |
| **D.** **Relativo: la tuya siempre en el mismo lugar** | Es la grilla, dibujada como plano | La tuya es la primera: una jerarquía, pero **personal**, que rota con la persona y que la grilla ya aceptó | **Sí** (mi recomendación) | Se construyó y se mostró al lado de la fija. **No la eligió.** Lo que recomendaba sigue vivo en la grilla |
| **E.** Relativo con la tuya en otro lugar | — | Arriba a la derecha es "lo mejor" de toda matriz de dos por dos, y el origen sugiere el cero | No | Sin cambios |

`[v1]` *"Por qué no hay una absoluta buena. Un plano con ejes tiene un arriba, un abajo, una izquierda
y una derecha, y cualquier asignación fija deja una manera en cada lugar para siempre."* **Sigue
siendo cierto, y es exactamente lo que el usuario aceptó.** La crítica adversarial dio en el punto:
el relativo no mostraba dónde estabas, que es lo que se había pedido (`§11.2`, punto 1).

---

## 3. Dónde va (decisión 3): debajo de los botones, arriba de la grilla

### 3.1 El orden

Dentro de la sección "Las cuatro maneras" (`section.ejes-cuatro`), de arriba abajo:

1. el título, `h3` "Las cuatro maneras";
2. la línea que canta, "Cuatro puntas de la misma hoja.";
3. si vino un enlace, **la línea de contraste** (`UX-36` §5.4: no se mueve);
4. **el plano** (nuevo), dentro de un `try/catch`;
5. la grilla de las cuatro maneras (con sus rótulos y sus celdas que se abren).

Todo cuelga de `pintarResultado()` **después** de `.ejes-acciones`: el plano nunca está en el flujo
entre la hoja y los botones.

**Por qué no entre la hoja y los botones.** El recorte mide entre 327 y 378 px (`§4.3`, hilo): con el
plano antes de los botones, "Compartí" (538 medido en `REV-19`) terminaría pasados los 860 y "Empezá otra
noche" (611) pasados los 930, a 375 × 667 (cuenta sobre `REV-19`): los dos bajo el pliegue, y es justo lo
que `UX-36` §5.4 ya evitó con la línea de contraste.

**Por qué no después de la grilla.** `[v1]` decía: *"un dibujo que se mira por primera vez después de
leer cuatro bajadas ya no orienta nada"*. **Ese argumento era flojo**: las celdas arrancan cerradas y
la grilla cerrada mide ≈ 230 px (cuenta del crítico), no cuatro bajadas. Lo que sostiene la posición
es otra cosa: el plano es el mapa que la lista despliega, y cada celda que se abre (≈ 8 a 9 renglones,
`§9.1`) aleja más el plano si va abajo. **La posición no se le preguntó al usuario**; la fijó la v1 y
`D-62` enmienda 2 la recoge. Queda abierta en `§9.2`.

### 3.2 Qué mueve

**Lo medido en `REV-19`** (leído; `getBoundingClientRect().bottom` del botón), **sin plano**:

| Ventana | "Compartí" termina | "Empezá otra noche" termina | Con el plano |
|---|---|---|---|
| 375 × 667 | 538 | 611 | **igual** (hilo) |
| 360 × 640 | 562 | 635 | **igual** (hilo) |
| 320 × 568 | 562 | 635 | **igual** (hilo) |
| 1366 × 657 (la mesa) | 506 | 579 | **igual** (hilo) |

- **"Igual" ahora es una medida, y también sigue siendo una construcción:** el hilo midió los dos botones
  con y sin plano, en cinco ventanas (375, 360, 320, 1366 y 1440) y cuatro maneras, y **no se movieron**.
  Además el plano está *después* de los botones en el DOM y en el flujo, así que nada de lo que está
  arriba depende de él.
- `[v1]` Las cuentas de la v1 (531 y 601 a 375; 555 a 579 a 320; 481 y 551 en la mesa) quedaron
  reemplazadas por las de `REV-19`. La v1 decía que a 320 nadie había calculado el "Compartí": ya estaba
  medido (562).
- **Lo que sí se mueve** es lo que está *debajo*, y la v1 lo contó mal: no son solo "Bajá la tarjeta" y
  "← Volvé al fichín". **Baja la grilla entera**, que es lo que el usuario dijo que le gusta. Baja lo que
  mide el recorte (327 a 378 a 375; 331 a 436 a 320; `§4.3`) **más 24 px de aire arriba y 24 abajo**
  (`--espacio-3`; los márgenes pueden colapsar con los vecinos: sin medir). Costo asumido: la gente que
  cierra, cierra; el botón de volver del navegador sigue donde estaba.
- **El plano no asoma en la primera pantalla en ninguna ventana** (cuenta del crítico sobre `REV-19`: el
  recorte empieza en ≈ 715 a 740 a 375 y en ≈ 685 a 710 en la mesa; no medido). `[v1]` *"Asoma ≈ 27 px como
  invitación a bajar"* **se cae**. Lo que asoma en la mesa es el título de la sección (cuenta de
  `UX-36` §5.7: ≈ 591 de 657; con lo medido en `REV-19`, unos 28 px más abajo). Es a propósito: primero
  Compartí.
- **A 320 × 568, "Empezá otra noche" ya queda bajo el pliegue sin el plano** (635 contra 568, `REV-19`), y
  el "Compartí" del peor caso (nombre de tres renglones, línea de dos, bajada de cuatro) puede pasarlo:
  `ESTADO.md` anota 562 a 646. Es de antes del plano y no lo empeora. La palanca, si se quiere, es la que
  `UX-36` §1.2 ya fijó: el aire de la hoja, nunca la bajada.

---

## 4. Cómo se ve (decisión 4)

### 4.1 Qué objeto es

**Un recorte de papel pegado con cinta**, el mismo idioma de la etiqueta de la tapa: no una "tarjeta",
no una superficie elevada (`diseno-marca.md`). Papel liso (las rayas cruzarían las letras: `UX-36` §2.3),
los ejes dibujados a tinta, un trozo de cinta arriba. Esto es lo construido (leído en `juego.css`):

| Objeto | Papel y tinta | Borde | Sombra | Giro | Letra |
|---|---|---|---|---|---|
| **El recorte** | `--papel`, liso; tinta `--fondo` | `--linea` (3 px) en `--apoyo-disco` (el borde de la tapa, `D-21`), esquina 3 px | Dura de 4 px en `--borde` | **+0,5°** (la última hoja va a −0,5°: dos manos distintas) | — |
| **La cinta** | `--papel` al 30 %, 72 × 22 | — | — | −4° | — |
| **Los ejes** | Borde de 2 px en `--papel-tenue` (dos elementos vacíos) | (ese borde) | — | — | — |
| **Polo, renglón del eje** | `--papel-tenue` | — | — | — | rotulada 0,75 rem, mayúsculas, `letter-spacing: 0.08em` |
| **Polo, sus palabras** | `--papel-tenue` | — | — | — | `--fuente` 0,8 rem |
| **Nombre del cuadrante** | `--fondo` | — | — | — | rotulada 0,8 rem, centrada, `text-wrap: balance` |
| **Sello** (tuya / del amigo) | `currentColor` = `--fondo` | 2 px, esquina 3 px; **punteado** el del amigo | — | **0°** | rotulada 0,75 rem, mayúsculas |
| **Cuadrante sin marca** | — | **ninguno**; 7 px de relleno | — | — | — |
| **La tuya** | sin relleno | `--linea` (3 px) **sólido** en `--fondo`, esquina 3 px; 4 px de relleno | — | — | — |
| **La del amigo** | sin relleno | 2 px **punteado** en `--fondo`; 5 px de relleno | — | — | — |
| **La misma** | sin relleno | `--linea` **punteado**; 4 px de relleno; los dos sellos (como en la grilla) | — | — | — |

- **Sellos rectos** (`[v1]` decía −1,5°, "como el sello de polos"; el crítico señaló que los de la grilla van
  rectos). El hilo los dejó rectos: dos sellos iguales en la misma pantalla.
- **La marca va en `--fondo` y no en el cuero.** En la grilla la tuya lleva el cuero (`--tinta-disco`) sobre
  el fondo oscuro. Sobre el papel el cuero da **2,32 : 1** y no llega a los 3 : 1 de un gráfico; la tinta
  del papel (`--fondo`) da **14,94 : 1** (cuentas mías; el crítico las rehízo y coinciden, igual que
  `--papel-tenue` sobre `--papel`: 5,39, y `--texto` sobre `--papel`: 1,10). Lo que hace de canal es la
  forma (grueso, punteado, nada) más el sello: **ninguna marca se apoya en el color**.
- **El borde del recorte es el topo de *Luzbelito*.** Es lo que trae la paleta del disco a esta pieza
  (`D-19`: cada sección viste la suya), como en la tapa; el interior es papel y tinta.
- **Sin esquinero.** La hoja final lleva el del libro; el plano es un recorte suelto y no necesita otra
  pieza: una imagen menos que bajar, y el crédito sigue saliendo una sola vez (`UX-36` §2.5).

### 4.2 Cómo se arma (lo construido)

HTML, no SVG: igual que la grilla (`D-57` punto 7: "texto HTML, no un SVG escalado"). Un SVG escala su
texto con la caja, y a 288 px de ancho los 12 px se vuelven 10; en HTML la letra es en `rem` y el nombre
se parte solo con `text-wrap: balance`.

1. `div.ejes-plano` con `role="img"` y `aria-label` = `textoDelPlano(banco, id, suyo?.id)` (que llama a
   `RESULTADO.altPlano(…)`; `partida-dos-ejes.ts`): el recorte (borde, sombra, cinta, giro).
2. Polo de arriba (`.ejes-plano-polo--arriba`): `.ejes-plano-polo-eje` (`EJES[…]`) y `.ejes-plano-polo-dice`
   (`POLOS[…]`).
3. `div.ejes-plano-cruz`: una cuadrícula de **dos columnas `minmax(0, 1fr)`** con `column-gap: 10px` y
   **tres filas `1fr auto 1fr`** (la de en medio es la franja del eje horizontal), `margin: 8px 0`. Adentro,
   en este orden:
   - los dos ejes, **dos `span` vacíos con posición absoluta y solo borde** (`border-right` el vertical,
     `border-top` el horizontal); el vertical está al 50 % y sale 8 px por arriba y por abajo, así que
     **llega a los polos**; el horizontal corre de lado a lado;
   - los cuatro cuadrantes, en el orden de `planoFijo().celdas`, `--arriba` en la fila 1 y `--abajo` en la
     3, con `--tuya` y `--suya` donde correspondan; si los llevan, `.ejes-plano-sellos` va arriba del nombre;
   - los dos polos de los costados (`columnas[0]` en la columna 1, `columnas[1]` en la 2), en la fila del
     medio, **montados sobre el eje**: el polo arriba de la línea, sus palabras abajo.
4. Polo de abajo.

**Una sola fuente de los lugares:** el plano sale de `planoFijo(banco)` y no escribe ningún polo a mano;
la grilla sigue con su única `disposicion(banco, …)`. Las dos modificadoras entran a `ESTADOS_EJES`.
**Y una sola fuente del texto del lector** *(2026-10-06, `798cd54`)*: `textoDelPlano()` (`copy.ts`) lo arma
con los lugares de `planoFijo()`, y lo llaman la isla y `copy.test.ts`; antes se armaba dos veces, y una
de las dos podía cambiar sola.

### 4.3 Las medidas

**Lo construido** (leído): relleno del recorte 12 px; cuadrante con `margin: 3px`, **7 px entre el borde de
fuera y el contenido** (relleno solo, o borde más relleno: `§4.1`), `gap: 4px` y `min-height: 5rem` (80 px);
polos de los costados con `gap: 8px` y `margin: 6px 0`; `max-width: min(26rem, calc(100% - 0,5rem))` en
**todas** las anchuras, centrado; `display: none` bajo 18 rem. Sin regla propia en la mesa.

**Lo medido** (hilo; `offsetHeight` del recorte, no `getBoundingClientRect`, porque está torcido):

| Ventana | Alto del recorte | Ancho | `[v1]` Mi cuenta, sin amigo / con amigo / la misma |
|---|---|---|---|
| **375 × 667** | **327** sin amigo · **331** con amigo en otra celda · **378** con la misma | — | 302 / 328 / 376 |
| **360 × 640** | 327 a 334 | — | 330 / 356 / 404 |
| **320 × 568** | 331 a 362 · **436** con la misma | — | 362 / 388 / 442 |
| **1366 y 1440** | 327 a 378 | **416** (26 rem) | 302 / 328 / 376 |
| Tableta (de 26 rem a 64 rem) | Igual que la mesa **por construcción** (mismo tope, mismo ancho); sin medir | 416 | — (`§11`, punto 15) |

- **La cuenta de la v1 erró, y no siempre para el mismo lado.** A 375 acertó con amigo (328 contra 331) y
  con la misma (376 contra 378), pero erró el caso base: 302 contra 327, 25 px corta. Le faltaban los márgenes
  de los cuadrantes (+12 según el crítico: 314) y ≈ 13 más que no pude descomponer, porque no hay medida por
  tramo. A 320 quedó larga con amigo (388 contra un máximo medido de 362 sin la misma) y casi exacta con la
  misma (442 contra 436). **Ninguna cuenta de ancho de letra de esta hoja se vuelve a usar.** La tabla de
  tramos de la v1 se quita.
- **No se aplicó ninguna de las palancas de la v1** (el `min-height`, el aire, el relleno del recorte): lo
  medido cabe.
- **En los 40 casos** (cinco ventanas × cuatro maneras × con y sin amigo), el hilo midió (hilo): Luz arriba y
  Orden a la izquierda; la tuya en su rincón; las dos filas iguales y las dos columnas iguales; sin
  desborde; nada bajo 12 px; nada enfocable adentro.
- **El peso**: 327 a 378 px, y 436 en el caso más apretado (320, la misma). El rombo que el usuario recuerda
  medía ≈ 215 según el crítico (cifra que no verifiqué: no conozco el rombo por su código). Es un costo real
  y está en `§11.2`, punto 5.
- **El sello "Quien te lo mandó"** se parte adentro de su rectángulo: `inline-block`, `max-width: 100%`,
  `text-wrap: balance`, `overflow-wrap: anywhere`. Que a 320 quede sin borde cortado se mira en captura
  (`§10.1`).
- **Tamaños de letra**, todos ≥ 12 px: renglón del eje y sellos 0,75 rem (12 px); palabras de los polos y
  nombres 0,8 rem (12,8 px). Los nombres van a 0,8 y no a los 0,95 de la grilla porque a 375 el nombre más
  largo tiene que caber en dos renglones; la grilla de abajo trae los mismos nombres a 0,95 rem: el plano
  orienta y la grilla lee. **La letra nunca es la palanca**: 12 px es el piso (`UX-36` §8.4, y lo guarda
  `estilos.test.ts`).
- **En la mesa (≥ 64 rem)**: el recorte mide ≤ 26 rem (416 px), **centrado**: es un recorte pegado, no una
  columna. **La letra no crece** (`UX-35` §4.4): crece el aire, no el cuerpo. Sin hover ni `:active`: no se
  parece a un control, y el cursor no cambia.
- **Debajo de 18 rem (288 px)**, que ningún teléfono real mide (lo alcanza solo el zoom del navegador), el
  plano se va (`display: none`): la grilla lo dice todo y el criterio de reflujo de WCAG pide 320. **Entre
  288 y 320 px no hay medida.**

### 4.4 Seis trampas del CSS

1. **`border-left` rompe el build.** `estilos.test.ts` toma `border-left` y `border-inline-start` por
   barra lateral de acento fuera de `.parrafo--`. El eje vertical **no** se dibuja con el borde izquierdo
   de un cuadrante: es un elemento propio, con `border-right`.
2. **El papel invierte la tinta.** La sección "Las cuatro maneras" es `--texto` sobre `--fondo`; adentro
   del recorte el par es `--fondo` sobre `--papel`. Si el recorte hereda el color de la sección, queda
   crema sobre crema (1,10 : 1). `.ejes-plano` **fija `color: var(--fondo)`**. Y **`--texto-tenue` no
   entra al papel** (1,78 : 1, `tokens.css`): lo tenue de acá es `--papel-tenue`.
3. **Los ejes, con borde y no con fondo.** En modo de contraste forzado (Windows) el navegador pisa los
   fondos y respeta los bordes: una línea hecha con `background` desaparece, una hecha con `border` no.
   También sirve para el punteado.
4. **El cuero no entra al papel**, ni como línea ni como texto (2,32 : 1). No hay par nuevo en
   `contraste.test.ts` y no tiene que haber (`§5`).
5. **`[v1 → v1.1]` El lugar del borde se guarda con relleno, no con un borde transparente.** La v1 ponía
   `3px solid transparent` en los cuatro cuadrantes para que ninguno cambiara de tamaño al marcarse. Pero en
   el contraste forzado un borde transparente se **pinta**: los dos cuadrantes sin marca habrían salido con
   el mismo recuadro grueso que la tuya, y solo habría quedado el sello. Ahora: sin marca, 7 px de relleno;
   la tuya, 3 de borde y 4 de relleno; la del amigo, 2 y 5; la misma, 3 y 4. Mismo tamaño, sin borde donde
   no hay marca. (Lo señaló la crítica, punto 2.)
6. **`[v1 → v1.1]` `1fr` no es `minmax(0, 1fr)`.** `1fr` equivale a `minmax(auto, 1fr)`: con el texto del
   sistema al 200 %, una palabra del sello ("NOCHE", "MANDÓ") mide más que la columna a 320, la ensancha, la
   tuya sale más grande que las otras y el eje puesto al 50 % deja de caer entre las dos. Las columnas son
   `minmax(0, 1fr)`, los ejes están al 50 % y el texto lleva `overflow-wrap: anywhere`. (Crítica, punto 4.)

### 4.5 Qué disco viste

*Luzbelito*, como todo el juego: el **topo** (`--apoyo-disco`) en el borde del recorte; el resto es papel y
tinta. No hay cuero, ni rojo, ni acento: no se disfraza el acierto ni el error porque no existen.

---

## 5. Accesibilidad (decisión 5): el plano es una imagen con su texto

**`role="img"` en el recorte y un `aria-label` que arma `textoDelPlano()`** (`copy.ts`) con
`RESULTADO.altPlano(…)` y los lugares de `RESULTADO.lugares`. Para `CU-1` con una postal de `CU-4`, el lector
dice (texto de `copy.ts`, `CNT-31` §13):

> Dos ejes en cruz. Arriba, Luz, con la gente. Abajo, Oscuridad, con lo propio. A la izquierda, Orden, con
> plan. A la derecha, Caos, sobre la marcha. Tu manera, arriba a la izquierda: Mesa larga a las nueve. La de
> quien te lo mandó, abajo a la derecha: Mochila liviana, sin mapa.

Sin enlace, la última oración no está; con la misma manera dice «La de quien te lo mandó es la misma.»
Con la tuya en `CU-2` («Tu manera, arriba a la derecha: Ronda en cualquier esquina.») el texto mide 37
palabras sin enlace, 51 con `CU-4` de enlace y 46 con la misma (cuenta de `CNT-31` §13). Registro 3: seco,
sin imagen, sin dígitos ni «mejor», «peor», «primera», «última» ni «más» (condición 6 del criterio 9 de
`US-06`).

**Cadena nueva, confirmada por `contenido` (`T-352`, cerrada; `CNT-31` §13), con dos cambios sobre la primera
propuesta del hilo, que esta hoja había transcrito:**

- **Un punto entre polo y polo, no punto y coma.** Cada polo ya lleva dos comas, y con punto y coma el
  oído puede pegar «abajo» al polo de arriba. Es juicio de `contenido`, **sin oírlo en un lector real**: si
  en uno real se oye bien con punto y coma, se vuelve atrás sin tocar nada más (`§10.4`).
- **«Tu manera», no «La tuya».** La cadena no tenía antecedente: suelta, cuando el lector salta de imagen
  en imagen, quedaba colgada. «Manera» es la palabra de «Las cuatro maneras» y le da apoyo a «La de quien
  te lo mandó» y a «es la misma». Cuesta cero palabras.

Lo vigila `copy.test.ts` (`§8.1`, G10): ocho tests sobre veinte casos, sin dígitos, sin comparaciones, sin
`;`, `!` ni suspensivos, con los dos ejes enteros y el nombre de la tuya; y uno ata cada lugar de
`RESULTADO.lugares` al rincón donde `planoFijo()` pone la celda. **Lo que ninguna máquina dijo** es cómo suena
leída por un lector de pantalla real, y si los cuatro polos se oyen como cuatro frases (`§10.4`).

`[v1]` La v1 decía lo contrario: *"`aria-hidden="true"`… no hay `role="img"` ni `aria-label`, y por eso no
hay cadena para `contenido`"*, y lo justificaba con una tabla de redundancia. **La tabla tenía una fila
falsa**, y el resto no alcanzaba:

| Qué dice el plano | Dónde lo oye el lector sin el plano |
|---|---|
| Los dos polos de **tu** manera, en palabras | La hoja: el sello de polos ("Luz · Orden") y la línea que nombra, que lee el foco al caer en el nombre. **Cierto** |
| Los cuatro nombres, y cuál es la tuya | La grilla: la lista dice "Las cuatro maneras, con la tuya primero" (`altGrilla`) y cada celda empieza por su sello. **Cierto** |
| La de quien te mandó, y qué comparten | La grilla (su sello) y la línea de contraste. **Cierto** |
| **La disposición en dos ejes** | La v1 decía que el orden de la grilla *"la tuya primero, luego la que comparte tu polo de luz–oscuridad…"* lo cuenta con palabras. **Es falso:** esa cadena no existe. `altGrilla` dice solo "Las cuatro maneras, con la tuya primero.", y los rótulos de polo de la grilla son `aria-hidden`. **En ninguna parte** |
| **Dónde cae la tuya en el plano** | **En ninguna parte** |

Con el plano escondido, quien usa lector de pantalla nunca oye que hay dos ejes ni dónde cae la tuya, que
es exactamente lo que el usuario pidió ver. El rombo viejo sí lo decía (`altPlano`, con `role="img"`). Con el
plano como imagen, el lector dice **una vez** lo único que los demás no dicen.

- **Recorrido lineal:** "Empezá otra noche" → título → línea que canta → [contraste] → **el plano (una
  imagen, una lectura)** → la lista de la grilla. Los hijos del plano no se leen por separado.
- **Nada enfocable adentro:** ni `a`, ni `button`, ni `tabindex`. El orden de tabulación de `UX-36` §8.1 no
  cambia. Lo guarda `isla.test.ts`.
- **Ningún estado solo con color:** el plano **no usa color** para marcar. Los canales son el borde (grueso,
  punteado, ninguno), el sello con letras y el lugar. Se entiende igual en blanco y negro y, por la trampa 5
  de `§4.4`, con el contraste forzado.
- **Contraste, ningún par nuevo:** `--fondo` sobre `--papel` (14,94 : 1) y `--papel-tenue` sobre `--papel`
  (5,39 : 1); ya están en `contraste.test.ts`. Los ejes, que son gráfico y no texto, usan `--papel-tenue`:
  5,39 : 1, sobre los 3 : 1 que pide un componente gráfico.
- **Letra ≥ 12 px** en todo, y sin alto fijo: los nombres se parten, no se cortan, y llevan
  `overflow-wrap: anywhere`. Texto al 200 %: **por medir** (`§10.4`).
- **Movimiento:** ninguno. No hay nada que reducir.
- **Falso apoyo:** un recuadro grueso parece tocable. Ni el recuadro ni nada del plano responde a un toque, y
  el cursor no cambia. Si la gente toca el cuadrante esperando que abra su explicación, es una señal de
  producto (`§9.2`), no un defecto de accesibilidad.

---

## 6. La tarjeta y la vista previa (decisión 6): no

**El plano no entra en la tarjeta de 1080 × 1350 ni en la vista previa de 1200 × 630.**
`VERSION_DEL_DIBUJO` se queda en **3**, el taller no se toca y `tarjetas.test.ts` sigue en verde sin
regenerar nada. `UX-36` §6.2 ("Lo que no muestra: el plano") **sigue valiendo**. Cinco razones; **la 3
cambió de signo con el plano fijo**:

1. **No hay lugar sin sacar algo que el usuario quiere.** El plano a un cuerpo legible en la tarjeta (30 px,
   el piso de `UX-36` §6.2) mide ≈ 550 a 600 px de alto (cuenta de la v1: cuadrantes de 400 × 160, tres
   franjas de polos de dos renglones). La hoja mide hoy 769 y el tope es 860; con el plano pasaría de
   ≈ 1300, y arranca en y = 230 sobre una tarjeta de 1350. Entraría solo **sacando la bajada** (que es la
   explicación que al usuario le gusta) **y el libro** (la única pieza de arte), y ni así.
2. **En la miniatura no se lee.** Una tarjeta en un chat se ve a un tercio: los nombres de 30 px quedan en
   10, y compiten con el nombre grande (80 px → ≈ 27). `UX-36` §6.2 dice que lo único que se tiene que leer
   en la miniatura es el nombre y "ME SALIÓ".
3. `[v1]` *"Lo ve otra persona, y el plano es relativo… en la tarjeta la absoluta serviría y la relativa
   estorba."* **Ya no es un argumento a favor de no.** Con el plano fijo, cuatro tarjetas de cuatro amigos
   serían el mismo mapa con la marca en otro rincón: poner el plano en la tarjeta hoy sí tendría sentido, y
   hasta sería lo más compartible del juego. Esta razón se invierte; la decisión se sostiene por las otras
   cuatro. **Si el usuario lo pide, es `UX-38` v2**; no se hace sin pedido.
4. **Cuesta una versión del dibujo, cuatro tarjetas, cuatro vistas y el manifiesto** (`VERSION_DEL_DIBUJO`
   sube a 4, el taller mide y falla si algo no entra) por un adorno que ya está en la pantalla.
5. **La postal y la portada tampoco lo llevan:** el plano es del resultado.

---

## 7. Lo que el resultado sigue sin tener

Ningún número, ningún puntaje, ningún "más", ningún grado dentro de la manera, ninguna frase que defina a
la persona, ninguna comparación con una noche anterior, ninguna animación (`UX-36` §5.8). **La única frase de
`UX-36` que cambia es "ningún punto en el plano"**: sigue cierta (el plano no lleva punto, `§1.3`), pero ya
no es cierto que no haya plano. Y desde la enmienda 3 hay un lugar que no es de cada uno: el del plano.

---

## 8. Guardas, y qué actualizar

### 8.1 Para el hilo principal (qué vigila un test) — con su estado real

| # | Qué | Dónde | Estado |
|---|---|---|---|
| G1 | **Cada manera ocupa cada lugar una sola vez entre las cuatro grillas**, y cada polo queda arriba (y a la izquierda) en dos de las cuatro | `partida.test.ts`, *"la grilla relativa no le da a nada un lugar fijo (UX-38 §2.3)"* | **Hecho**, y vale para la **grilla** (`§2.3`) |
| G1b | **El plano es fijo:** `planoFijo()` devuelve luz/oscuridad arriba-abajo y orden/caos izquierda-derecha, las celdas en ese orden, las cuatro distintas, y no recibe el resultado (`planoFijo.length === 1`) | `partida.test.ts`, *"el plano es fijo: Luz arriba, Orden a la izquierda, para todos (D-62 enmienda 3)"* | **Hecho** (nuevo en v1.1) |
| G2 | **Una sola fuente** (reescrita: la v1 decía "ninguna tabla"). El plano sale de `planoFijo(banco)`, no escribe `'luz'`, `'oscuridad'`, `'orden'` ni `'caos'` a mano, y la grilla calcula `disposicion(banco` una sola vez. La única tabla de lugares es `PLANO_FIJO`, en el motor | `isla.test.ts`, *"el plano es una imagen con su texto…"* | **Hecho** |
| G3 | `ESTADOS_EJES` suma `.ejes-plano-cuadrante--tuya` y `--suya` | `estilos.test.ts`, líneas 616–617 | **Hecho** |
| G4 | **Ninguna regla `.ejes-*` pide menos de 0,75 rem** (en `rem` ni en `px`) | `estilos.test.ts`, *"ninguna letra del test de dos ejes baja de 12 px"* y su control | **Hecho** |
| G5 | Ningún `border-left` ni `border-inline-start` en el plano, y ningún hex | `estilos.test.ts` | **Ya existía** |
| G6 | El plano es `role="img"` con `textoDelPlano(banco, id, suyo?.id)` y no crea `a`, `button`, `tabindex` ni punto | `isla.test.ts` | **Hecho** (cambió: la v1 pedía `aria-hidden`; y con `798cd54` el test mira `textoDelPlano(…)`, que llama a `RESULTADO.altPlano`, y no la llamada directa) |
| G7 | **A/B de los botones:** el borde de abajo de "Compartí" y de "Empezá otra noche" es idéntico con y sin plano | Medición | **Hecho** (hilo, cinco ventanas), **a mano**: no es un test. Repetir si cambia algo encima del plano |
| G8 | El taller no se enteró: `VERSION_DEL_DIBUJO` sigue en 3 y `altoDeLaHojaDeLaTarjeta` en 769 | `tarjetas.test.ts` | **Ya existe** |
| G9 | Ningún par nuevo en `contraste.test.ts` | `contraste.test.ts` | **Ya existe** |
| G10 | **Las cadenas del plano se auditan con los datos de verdad** | `copy.test.ts` (`src/lib/dos-ejes/`) | **Hecho** (`3b4ae32`, y `798cd54` lo completó; la v1.1 decía "No": lo corrige `REV-20`). `voz.test.ts` **sigue sin llegar a `altPlano`**: `cadenasDeFunciones()` la llama con un número y con "X", recibe un objeto, `p.tuya.lugar` lanza un `TypeError` y el `catch` lo traga (*"una función que no aguanta el comodín no se audita"*). Lo que cubre el hueco es `copy.test.ts`: **ocho tests** sobre **veinte casos** (las cuatro maneras como la tuya, sin enlace, con la misma y con cada una de las otras tres): sin dígitos ni «mejor», «peor», «primera», «última» ni «más»; sin `;`, `!` ni suspensivos; los dos ejes enteros y el nombre de la tuya; la del enlace; sin anglicismos ni «los fans»; **cada lugar de `RESULTADO.lugares` dice el rincón donde `planoFijo()` pone esa celda** (ata el orden: si alguien cruza dos cadenas, el lector diría un rincón equivocado y ningún otro test se pondría en rojo); y una manera que no está en el plano **falla fuerte**. `RESULTADO.lugares` también lo audita `voz.test.ts` (es un arreglo de cadenas). **Límite que `REV-20` anotó como diferido, cerrado en `798cd54`:** `copy.test.ts` armaba a mano los argumentos (`lo()`), y si `plano()` cambiaba cómo los arma, el test no se enteraba. Ahora el armado vive en `textoDelPlano(banco, id, suyoId)` (`copy.ts`), que llaman la isla y `lo()`; `isla.test.ts` mira que `plano()` la llame con `banco, id, suyo?.id` (G6) y no arme el texto a mano. Origen del hueco: `Docs/SUGERENCIAS/UX-para-contenido-altplano-sin-auditoria.md` (resuelta) |

### 8.2 Qué actualizar en otros documentos

| Dónde | Qué | Quién |
|---|---|---|
| `Docs/UX/UX-36` | Las marcas de enmienda, al día con el plano fijo (cabecera, `§5.3`, `§5.6`, `§5.8`, `§6.2`) | `experiencia` (hecho en v1.1) |
| `Docs/DECISIONES.md`, `D-62` enmiendas 2 y 3 | Ya están. La enmienda 2 ya no dice "escondido al lector": dice `role="img"` con `altPlano` (corregido al integrar, 2026-10-06) | hilo principal (hecho) |
| `US-06`, criterio 3 | El plano queda exceptuado por decisión del usuario (`D-62` enmienda 3); el criterio 9 trae las siete condiciones | `producto` (**hecho**, enmienda «2026-10-05 (tercera)», `717515c`) |
| `T-352` | `contenido` confirma `altPlano` y `lugares`; y se cubre el agujero de `G10` | **Cerrada.** `contenido` (`CNT-31` §13) + hilo (`copy.test.ts`). Queda abierto solo oírla en un lector real: `§10.4` |
| `Docs/SUGERENCIAS/HILO-para-contenido-el-texto-del-plano.md` | Decía que el orden de los lugares es el de `disposicion().celdas` y que la orientación estaba abierta (`T-353`). Es `planoFijo().celdas` y `T-353` cerró | hilo principal (**resuelta**, así marcada en la propia sugerencia) |
| **El lienzo "Sistema de marca"** (hojas 08 y 09, como pedía esta ficha) | **`T-351`.** `diseno-marca.md` pide cambiar el diseño **primero**; acá se construyó antes. Era deuda con nombre, como `T-319`. **Cerrada el 2026-10-06 (`2a8d943`): el plano se pegó en el lienzo como hoja 16, «el plano de dos ejes», debajo de la 08 en la página Aplicación; no entró en la 08 y la 09.** La ficha de abajo queda como se escribió. `diseno-marca.md` ya nombra la hoja 16 | hilo principal (**hecho**) |
| `ESTADO.md` | `UX-38` v1.1 hecho y al día el 2026-10-06; `T-352` y `T-351` cerradas. Abierto solo lo de aparato real de `§10.4` y `§10.5`, con el dueño de `UX-36` `§12.6` *(esta fila decía «Abiertos: `T-351` (el lienzo) y…»)* | hilo principal |

**Ficha para el lienzo (`T-351`) — `[cerrada]`: se pegó como hoja 16 (`2a8d943`), no como las hojas 08 y 09 de abajo.**
*Hoja 08, componentes:* "recorte del plano" (`--papel`, tinta `--fondo`,
borde `--linea` en `--apoyo-disco`, sombra dura de 4 px, +0,5°, cinta de 72 × 22 a −4°) con los cuatro
estados del cuadrante (sin marca, la tuya, la del amigo, la misma: todos con 7 px entre el borde de fuera y
el contenido), el polo en dos renglones (rotulada 0,75 y palabras 0,8) y el eje de 2 px en `--papel-tenue`.
*Hoja 09, pantallas:* el resultado con el plano entre la línea que canta (o la de contraste) y la grilla, y
las cuatro maneras, **cada una en su rincón del mismo mapa**.

---

## 9. Lo que descarté, y lo que queda abierto

### 9.1 Descartado

| Idea | Por qué no |
|---|---|
| **Reemplazar la grilla por el plano** | El usuario dijo "me gustan las explicaciones": las bajadas viven en la grilla |
| **Un solo dibujo que sea las dos cosas** (los cuadrantes del plano son las celdas que se abren) | Una celda abierta crece (la bajada son ≈ 8 a 9 renglones a 150 px, cuenta) y deforma el cruce; además el `summary` pide ≥ 72 px y el ancho de media celda lo ahoga |
| **Un plano que se toca** (un cuadrante abre su celda de la grilla y baja a ella) | Es lo más tentador. Pide botones adentro de algo que ahora es una imagen para el lector (`§5`), una segunda forma de abrir lo mismo y el control de `details` desde afuera. **Primero se mide si la gente lo toca** (`§9.2`) |
| **Un punto** | `§1.3` |
| **El plano absoluto** | `[v1]` Descartado por `§2`. **`[v1.1]` Es el construido:** lo eligió el usuario (`D-62` enmienda 3). El costo, en `§2.1`; la razón de la v1, en `§2.4` |
| **El plano relativo** | `[v1]` Era mi recomendación. Se construyó, se mostró y no se eligió. Vive en la grilla (`§2.2`) |
| **SVG** | La letra escalaría por debajo de 12 px (`§4.2`) |
| **El recorte en tinta clara sobre `--fondo`** (sin papel) | Los pares ya existen, pero queda el mismo material que la grilla de abajo, y dos figuras iguales apiladas se leen como una lista larga. El papel lo vuelve un objeto y deja la marca en `--fondo` (14,94 : 1) |
| **Papel cuadriculado** | Las líneas cruzan la letra (`UX-36` §2.3) y una cuadrícula regular es una escala (`§1.4`) |
| **Puntas de flecha o rayitas en los ejes** | Una marca regular es una escala; una flecha dice "más hacia acá" |
| **Esquinero del libro en el recorte** | Ya está en la hoja final; una imagen menos |
| **Una línea nueva debajo del plano** (la v1 la proponía como "La tuya, arriba a la izquierda.") | El sello ya lo dice, y para el lector lo dice `altPlano`. Con el plano fijo, además, la frase ya no sería cierta para todos |
| **El plano en la tarjeta y en la vista previa** | `§6` |
| **Dos paños en la mesa** (la hoja a un lado, el plano al otro) | `UX-36` §5.7 ya lo midió con la grilla: celdas de 183 px y el nombre en tres renglones. Sigue una sola columna |
| **El eje horizontal cortado por los polos de los costados** (`[v1]`) | El hilo lo cambió al construir: corre entero y los polos lo montan. Cortarlo dejaba un brazo más largo que el otro ("Orden" contra "sobre la marcha") y la cruz parecía corrida (`§11.1`, punto 11) |
| **Plano compacto de ≈ 200 px, solo con sellos y polos**; **sacar los rótulos de polo de la grilla mientras esté el plano**; **reservar el renglón del sello en los cuatro cuadrantes** | Propuestas de la crítica, no aplicadas: `§11.2` |

### 9.2 Abierto

1. **¿Alguien lee el rincón como "mejor" o "peor"?** Es el costo aceptado de la enmienda 3 (`§2.1`). Por
   medir con gente real: «Mochila liviana, sin mapa» siempre en el último rincón.
2. **¿Alguien toca un cuadrante esperando que abra?** Por medir con gente real. Si pasa, el plano tocable
   (`§9.1`) entra como `UX-38` v2.
3. **¿Confunden las dos reglas de lugar?** Tu manera en un rincón del plano y arriba a la izquierda en la
   grilla (`§2.2`). El sello "Esta noche" es el puente; si no alcanza, se ve en un teléfono.
4. **El peso y la posición** (`§3.1`, `§11.2`): 327 a 378 px arriba de las explicaciones. Si en un teléfono
   real la gente no baja hasta la grilla, las palancas, en este orden: (a) sacar los rótulos de polo de la
   grilla (ahorra ≈ 50 a 60 px, cuenta del crítico) —toca la grilla, que el usuario pidió que se quede—;
   (b) pasar el plano debajo de la grilla; (c) el plano compacto. Ninguna se hace sin verlo.
5. **La letra de 12 a 12,8 px sobre papel girado +0,5°** en un Android de baja densidad: por medir. Si no se
   lee, el recorte se pone a 0° (el cuerpo no se toca).
6. **Lo que ninguna máquina vio:** un teléfono real, un lector de pantalla real, el texto del sistema real
   (el ajuste del navegador o del sistema) y el contraste forzado de Windows real. Las medidas son de
   Playwright con Chromium: `REV-20` (medido el 2026-10-05) emuló el contraste forzado y midió la tableta y 300 px de
   ancho, y entraron; **todas sus medidas de texto son con DejaVu Sans**, la pila del sistema de Linux, más
   ancha que Roboto o San Francisco. Safari de iPhone y un Android de gama baja no están medidos, y la
   rotulada real y el texto del sistema cambian el ancho. Todo en `§10`; el dueño, en `UX-36` `§12.6`.

---

## 10. Checklist (lo corre quien implemente o `revisor`, `D-12`)

`[x]` = ya lo midió o lo leyó alguien (se dice quién). `[ ]` = falta. Lo marcado `(REV-20)` lo midió la
lente de pantalla de `REV-20` **el 2026-10-05** (esta hoja decía el 06; el 06 es la fecha en que `REV-20`
se escribió y esta hoja se puso al día) con Chromium (Playwright) y DejaVu Sans, sobre el build
servido, **igual que lo marcado `(hilo)`, que es del mismo día**: **no reemplaza a un aparato real**, y lo que
depende del aparato queda `[ ]` con su dueño (`§10.5`).

### 10.0 Comandos

```
rg -n "^# UX-38" Docs/UX/
node --test src/lib/contraste.test.ts
node --test src/lib/estilos.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/dos-ejes/partida.test.ts src/lib/dos-ejes/isla.test.ts src/lib/dos-ejes/tarjetas.test.ts
node --test src/lib/dos-ejes/copy.test.ts
npm test
```

`npm test` en verde; el número lo da la corrida (`REV-20`, medido el 2026-10-05: **1531**, con los seis tests
de `copy.test.ts` que el 1525 del hilo todavía no tenía; `npm run check` con **0 errores, 0 avisos y 14
hints**, que no son del plano —son de `aparato.ts`, `diagnostico-audio.ts` y los `is:inline` de las
páginas—; `npm run build` de 160 páginas). **Desde `798cd54`, `copy.test.ts` tiene ocho tests** y el 1531
deja de ser el número de la suite: el de hoy lo da la corrida del hilo, no esta hoja. `[v1]` Esta lista traía una línea más, `rg -n "ejes-plano" … | rg "border-left|…|#[0-9a-f]{3,6}"`,
**que no servía**: `rg "ejes-plano"` devuelve las líneas con el selector, nunca las declaraciones, así que
el segundo `rg` no encontraba nada pasara lo que pasara. La guarda de verdad es `estilos.test.ts` (G5), que
mira el CSS regla por regla. La quito. (Leí a mano el bloque `.ejes-plano*`: ningún hex ni `border-left`.)

### 10.1 Medidas, a 375 × 667 · 360 × 640 · 320 × 568 · 1366 × 657 · 1440

- [x] **A/B:** el borde de abajo de "Compartí" y de "Empezá otra noche", con y sin plano, **idénticos** (hilo).
- [x] El plano está **después** de `.ejes-acciones` y de la línea de contraste, y antes de `.ejes-grilla` (leído: `grilla()`).
- [x] Alto del recorte (`offsetHeight`): `§4.3` (hilo). Ninguna palanca de la v1 hizo falta.
- [x] Las dos filas miden lo mismo y las dos columnas miden lo mismo, con la tuya marcada, con el amigo y con la misma (hilo).
- [x] Sin desplazamiento horizontal (hilo).
- [x] En la mesa, el recorte mide ≤ 26 rem: ancho 416 (hilo). Centrado: leído en el CSS (`margin: … auto`).
- [x] «Ronda en cualquier esquina» a 375: **dos renglones**; a 320: **tres** (`REV-20`).
- [x] El sello «Quien te lo mandó» se parte **adentro** de su rectángulo, sin borde cortado, a 320 (`REV-20`, captura).
- [x] Debajo de 18 rem el plano no se ve: `display: none`, medido a 280 px (`REV-20`). Que la grilla se vea a ese ancho no se miró aparte.
- [x] **Tableta** (768 × 1024 y 1024 × 768): 416 de ancho, sin desborde (`REV-20`).
- [ ] **De 288 a 320 px:** `REV-20` midió 300 (260 de ancho, sin desborde); el resto del tramo, sin medir.

### 10.2 El lugar de cada una

- [x] **Luz arriba y Orden a la izquierda en las cuatro** (`CU-1` a `CU-4`, una por una), y la tuya en su rincón (hilo; y `partida.test.ts`, G1b).
- [x] El nombre del cuadrante marcado como "Esta noche" es el del `h2` de la hoja, en las cuatro (`REV-20`: 36 casos, cuatro maneras × tres ventanas × sin amigo, otra celda y la misma).
- [x] Los cuatro nombres del plano son los del banco (los mismos de la grilla), en el orden `CU-1` a `CU-4` (`REV-20`).
- [x] Con y sin enlace: el cuadrante del amigo sale punteado y con "Quien te lo mandó"; con la misma manera, grueso, punteado y los dos sellos (hilo, 40 casos).
- [x] Con `r=CU-9`, `g=quiz&r=CU-2`, `g=dos-ejes&r=CU-9`, `g=dos-ejes&r=` y sin parámetros: ningún cuadrante punteado y ningún error; `g=dos-ejes&r=CU-2` sí pone el punteado y la línea de contraste (`REV-20`).
- [x] La línea de contraste y la posición del punteado dicen lo mismo en el mapa fijo (`REV-20`: los cuatro casos, la misma, luz–oscuridad, orden–caos y la opuesta).

### 10.3 Lo que no tiene

- [x] `/\d/.test(document.querySelector('.ejes-plano').textContent)` es `false`, y lo mismo con el `aria-label` (`REV-20`; el `aria-label`, además, en `copy.test.ts`).
- [x] Sin punto, sin flecha, sin marcas en los ejes, sin degradado, sin relleno por cuadrante, sin sombra difusa, sin animación ni transición (leído en el CSS y en `plano()`).
- [x] Ningún cuadrante más grande ni de otra letra que otro (hilo: filas y columnas iguales; CSS: una sola regla de letra).
- [x] No hay vela, óvalo, figura ni imagen (leído: `plano()` no crea ninguna).
- [x] El pie acredita *Luzbelito* una sola vez (`UX-36` §2.5): dentro del `details` «Mirá los créditos» (`REV-20`).

### 10.4 Accesibilidad

- [x] `.ejes-plano[role="img"]` con `aria-label` de `altPlano(…)`, y cero `a`, `button` o `[tabindex]` adentro (leído; `isla.test.ts`; hilo).
- [x] Todo texto del plano ≥ 12 px (hilo; G4).
- [ ] **Con VoiceOver o TalkBack**, el recorrido lineal desde "Empezá otra noche" pasa por el título, la línea que canta, [el contraste], **el plano (una sola lectura que dice los dos ejes y el lugar de la tuya)** y la lista de la grilla. *Falta; dueño en `UX-36` `§12.6`.*
- [x] El `aria-label` dice, en los doce casos (cuatro maneras × sin enlace, otra y la misma, a 375), el texto de `§5`, sin mejor/peor/primera/última/más; el lugar de la tuya y el de la del enlace coinciden con el dibujo (`REV-20`).
- [ ] **Que la etiqueta suene bien leída en voz alta**, en las cuatro maneras, y que los cuatro polos se oigan como cuatro frases separadas; si con punto y coma sonara mejor, se vuelve atrás (`§5`). *Falta: es lo único de `T-352` que queda abierto; dueño en `UX-36` `§12.6`.*
- [x] **Contraste forzado, emulado** (`forced-colors: active`, 375 y 320): los ejes, el borde sólido de la tuya, el punteado del amigo y los sellos se ven, y **los cuadrantes sin marca no muestran borde** (`REV-20`; `§4.4`, trampa 5).
- [ ] **Contraste forzado en Windows real.** *Falta; dueño en `UX-36` `§12.6`.*
- [ ] **Texto del sistema al 200 %:** sin desplazamiento horizontal, sin letra cortada, y el eje del medio sigue cayendo entre las dos columnas (`§4.4`, trampa 6). `REV-20` lo emuló con `html { font-size: 200% }`, que **no es fiel** (los `@media` en `rem` no cambian): el plano quedó contenido (ningún hijo fuera del recorte, ejes a 0,0 px del centro), pero la grilla de abajo se pasó de ancho (457 contra 375) y a 320 desbordó la imagen del pie. **No es hallazgo hasta probarlo con el ajuste real** del navegador o del sistema. *Falta; dueño en `UX-36` `§12.6`.*
- [x] El `h2` del nombre recibe el foco al pintar el resultado; "Empezá otra noche" deja ningún plano viejo y uno nuevo (`REV-20`).

### 10.5 En un teléfono real (lo que ninguna máquina ve)

**Dueño de esta lista y de las filas `[ ]` de aparato real de `§10.4`: el mismo que fija `UX-36` `§12.6`**
(el usuario, que es quien tiene el teléfono; `revisor` anota lo que vea en la próxima `REV`).

- [ ] El recorte a la intemperie con el brillo alto: ¿se leen los polos en `--papel-tenue` y los ejes?
- [ ] ¿La gente toca el cuadrante y espera algo? (`§9.2`, punto 2)
- [ ] Dos personas con resultados opuestos, con el teléfono al lado: ¿hablan de un **mapa** donde cada una cayó, o de quién quedó arriba? (`§9.2`, punto 1)
- [ ] ¿Se confunde alguien porque su manera está en un rincón del plano y arriba a la izquierda en la grilla? (`§9.2`, punto 3)
- [ ] ¿Se lee más pobre alguna de las cuatro maneras? Ahora se nota más en la que cae abajo a la derecha (`REV-19` lo miró en la grilla).
- [ ] ¿La gente baja hasta la grilla, o se queda en el plano? (`§9.2`, punto 4)

---

## 11. Lo que se discutió: la crítica adversarial, punto por punto

Un crítico leyó la v1 y no editó nada. **Confirmó lo básico:** dos ejes que se cruzan, sin punto, sin
cadena, sin hex, los pares de color existen. Rehízo mis cuentas de contraste (14,94; 5,39; 2,32; 1,10) y
coinciden; confirmó el cuadrado latino de `§2.3` y que los botones no se mueven porque el plano va después.
Quince puntos, de alta a baja.

### 11.1 Lo que se corrigió (el código ya lo había resuelto, o la hoja estaba mal)

| # | Gravedad | Qué decía la crítica | Cómo quedó |
|---|---|---|---|
| 2 | Media | El borde transparente de los cuadrantes se pinta con contraste forzado: la tuya perdía su forma | Relleno en lugar de borde: 7 / 3+4 / 2+5 / 3+4 (`§4.1`, `§4.4` trampa 5). El checklist ahora pide mirar que los sin marca no muestren borde |
| 3 | Media | La tabla que justificaba esconder el plano tenía un dato falso | Era falso (`§5`). El plano pasó a `role="img"` con `RESULTADO.altPlano(…)`. Cadena nueva: `T-352` (cerrada, `§5`) |
| 4 | Media | Geometría sin especificar; `1fr` ensancha la columna de la tuya al 200 % | `minmax(0, 1fr)`, `column-gap: 10px`, ejes absolutos al 50 %, el vertical llega a los polos, `overflow-wrap: anywhere` (`§4.2`, trampa 6). El hilo lo resolvió con ejes absolutos; el crítico proponía tres columnas con el eje en la del medio |
| 6 | Media | Faltaba el costo de las explicaciones que bajan | Escrito en `§3.2`: baja la grilla entera. La otra mitad (preguntar la posición) no se aplicó: `§11.2` |
| 7 | Media | El circuito de `diseno-marca.md` va al revés | Lo reconozco: deuda con nombre, `T-351`, como `T-319`. La ficha para pegar, en `§8.2`. **Pagada el 2026-10-06:** `T-351` cerrada (`2a8d943`), hoja 16 del lienzo |
| 8 | Baja | `§3.2` usaba cuentas donde `REV-19` ya había medido | Reemplazadas por `REV-19` (`§3.2`). Se cae el "asoma ≈ 27 px" |
| 9 | Baja | La tabla de alturas omitía los márgenes | La cuenta se descarta; valen las medidas del hilo (`§4.3`) |
| 11 | Baja | Los dos brazos del eje horizontal se ven de distinto largo | Ya no hay brazos: el eje corre entero y los polos lo montan (`§1.1`, `§4.2`). Distinto de la propuesta del crítico (rótulos del mismo ancho) |
| 13 | Baja | `§9.2.5` (el volumen) estaba vieja | Sacada. Se resolvió en `D-62` enmienda 1 y la guarda *"la música que molesta"* de `banco.test.ts` |
| 14 | Baja | "Las cuatro filas…"; sellos −1,5° contra rectos; el `try/catch` sin especificar | "Dos filas y dos columnas"; sellos rectos; `try/catch` solo alrededor de `plano(id)`, dentro de `grilla()` (`§0.1`, `§3.1`, `§4.1`) |
| 15 | Baja | Faltaba el tramo de 22 a 64 rem | `max-width: min(26rem, …)` en todas las anchuras, sin regla propia en la mesa. La tableta es igual a la mesa por construcción; sin medir (`§4.3`) |

**Corrección propia, que la crítica no vio:** el comando `rg` del checklist no servía (`§10.0`).

### 11.2 Lo que no se aplicó, y por qué

**Punto 1 (alta) — el plano relativo no muestra dónde estás.** La crítica tenía razón en el fondo y la
v1 lo había admitido en su propio `§1.3`: en un plano relativo la tuya cae siempre en el mismo lugar y el
dibujo solo cambia de rótulos, así que no puede mostrar *dónde cayó* cada uno. Proponía tres cosas: preguntarle
al usuario con dos capturas lado a lado, que la orientación sea una sola llave, y reescribir G2 como "una
sola fuente". **Las tres pasaron:** el hilo le mostró las dos versiones, el usuario eligió el fijo, `PLANO_FIJO`
es la única tabla (en el motor) y G2 está reescrita. No quedó nada por aplicar: **lo resolvió el usuario**, y
con él perdió mi recomendación.

**Punto 5 (media) — es otra grilla con una cruz encima, y pesa demasiado.** El recorte mide entre 327 y
378 px (436 en el peor caso) contra ≈ 215 del rombo (cifra del crítico). **No lo apliqué** por tres razones:
(a) el usuario pidió *el gráfico y las explicaciones*, no uno en lugar del otro; (b) el plano compacto, con
solo sellos y polos, deja rincones sin nombre: un rincón vacío es una pregunta, y la respuesta estaría 16 px
más abajo; (c) sacar los rótulos de polo de la grilla es tocar la grilla, que el usuario pidió que se quede.
**Concedo que el peso es real**, y que "ya está dicho por tercera vez" también. Quedó como palanca ordenada
en `§9.2`, punto 4: se usa si un teléfono real dice que pesa.

**Punto 6 (media), la mitad que falta — ofrecer las dos posiciones al usuario.** Se escribió el costo, pero la
posición (arriba de la grilla) no se le preguntó: el usuario eligió la orientación, no el lugar. Se queda donde
la fijó la v1 y `D-62` enmienda 2; se reabre con lo que diga el teléfono (`§9.2`, punto 4).

**Punto 10 (baja) — el nombre de la tuya queda más bajo que el de su vecina.** Con el contenido centrado en
vertical, el sello empuja el nombre de la tuya hacia abajo (≈ 12 px, cuenta: la mitad del sello más el hueco)
y los dos nombres del renglón no quedan alineados. **Aceptado.** Reservar el renglón del sello en los cuatro
cuadrantes agranda las cuatro filas (cuenta: ≈ 24 px por fila donde el contenido ya llena el mínimo, que es a
320 y cuando la misma lleva dos sellos); a 375 con un solo sello el `min-height` probablemente lo absorbería,
pero no está medido. Entre un desalineo de 12 px y un plano más alto justo donde ya apretaba, el hilo eligió el
desalineo. Queda como palanca si en el teléfono se nota.

**Punto 12 (baja) — el punto de repuesto está mal puesto.** El crítico tenía razón: "en el centro de la caja del
nombre" cae encima de la letra, y un punto en el centro del cuadrante es lo que hacía el rombo y lo que `D-57`
sacó. **No hay punto** (`§1.3`); lo único que se corrigió es el repuesto, por si el usuario lo pide.
