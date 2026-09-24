# CNT-18 — El resto del texto de la pantalla del juego

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-18
- **Estado:** propuesta, lista para cablear.
- **Consume:** `Docs/ARQ/ARQ-motor-de-juego.md` `ADR-08.2` ("Qué se ve si el motor no
  carga"), `Docs/UX/UX-28-la-pantalla-y-las-dos-puertas.md` §2.1 (las seis teclas), §4 (la
  línea de vertical), `Docs/UX/UX-29-el-fracaso-no-es-la-muerte.md` §5 (el aviso accesible,
  solo si hace falta) y §6 (la lista de palabras prohibidas), `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`
  `BR-23` punto 5 (el reparto de columnas todavía no está fijado), `BR-24` (el fracaso no
  se narra como muerte), `Docs/SUGERENCIAS/PRD-para-contenido-pie-de-homenaje-y-palabras-vetadas.md`
  §2 y §3, `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md` §2, §3 y §4,
  `.claude/rules/voz-ricotera.md` (registro 1 y registro 3, la regla de las dos líneas),
  `.claude/rules/diseno-marca.md` (voseo en cada botón).
- **Resuelve:** `T-233`.

## 1. Las seis teclas: nombre accesible, sin texto visible

`UX-27 §1.3` pone las columnas de mando y sus teclas del lado de la imprenta, no del
pixel, y `UX-28 §2.1`/`§3` las representa por forma y por relleno del sello — nunca por una
palabra escrita encima. Lo que hace falta acá no es un rótulo impreso: es el **nombre
accesible** (`aria-label`) de cada tecla, para quien usa lector de pantalla, tal como lo
pide `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md` §4: *"llevan nombre
accesible aunque no lleven texto visible"*.

Cada columna trae las mismas tres teclas (`UX-28 §2.1`): dirección izquierda, dirección
derecha, saltar. Van con el mismo nombre accesible en las dos columnas — **no invento a qué
personaje corresponde cada lado**, porque esa asignación es de `experiencia` y todavía no
está fijada en ningún documento (`BR-23` punto 5: *"esta regla la obliga a escribirla y
fundamentarla, no a dejarla como salió"*). Nombrar acá "la tecla de Skayboy" sería tomar esa
decisión por la puerta de atrás.

> **`Andá a la izquierda`**
> **`Andá a la derecha`**
> **`Saltá`**

Imperativo voseado, nunca infinitivo (`D-17`): "Saltá", nunca "Saltar" — es el ejemplo que
la propia `experiencia` dejó escrito en su traspaso, y lo mismo vale para las otras dos.

**Y dos nombres de grupo**, para que quien usa lector de pantalla distinga una columna de
la otra sin que yo tenga que nombrar personajes:

> **`Mando izquierdo`**
> **`Mando derecho`**

## 2. La línea de vertical

> **Enmendada el 2026-09-23 (`CNT-21`, ciclo 16, ráfaga 2).** Esta sección daba la frase de
> abajo por cierta sin condición, en todos los tamaños. `UX-28 §4.1` se enmendó el mismo día
> que se escribió esto (segunda enmienda, `T-261`) y encontró que **"el doble" solo es
> verdad cuando el ancho vertical supera 400 px CSS y el alto llega a 720, las dos a la
> vez** — y en los dos tamaños verticales que `UX-28 §2.5` mide (375 × 812 y 375 × 667) esa
> condición nunca se cumple. La frase de abajo **no cambió** — sigue siendo la que se usa,
> igual, registro 3, ocho palabras — pero ahora va condicionada: se muestra solo cuando se
> cumplen las dos cosas a la vez, y en el resto de los casos **no aparece nada**, decisión y
> argumento completos en `CNT-21 §2`. El párrafo original queda abajo sin editar, como
> registro de qué se pensaba antes de la enmienda.

`UX-28 §4`: quien entra con el teléfono parado juega igual, a la mitad de tamaño, y una
línea en la chapa avisa que de costado se ve más grande — sin pedir nada, informando una
ganancia.

> **`De costado se ve el doble de grande.`**

Registro 3: informa un dato, no da una orden ("girá el teléfono" sería un molinete,
`D-14`). Ocho palabras, no es imperativa porque no hace falta serlo — el molde de
`experiencia` decía "imperativa o no, con el dato adentro", y acá el dato solo (el doble de
tamaño) alcanza sin pedir nada.

## 3. El rótulo estático de `ADR-08.2`

Lo que ve la persona en el recorte del área de juego mientras el motor todavía no arrancó
— y lo que queda si el `import` falla del todo, porque `ADR-08.2` dice que en ese caso "el
rótulo queda". Por eso el texto tiene que ser cierto en los dos casos a la vez: ni promete
que ya está por arrancar, ni asume que va a fallar.

> **`Acá va el juego.`**

Cuatro palabras, registro 3, sin imagen, sin promesa de tiempo ("cargando" prometería una
espera que puede no cumplirse si el `import` falla). Dice qué hay ahí y se calla, que es
exactamente lo que pide la fila de `T-233` en el plan: *"que el rótulo estático diga qué
hay ahí sin prometer nada"*.

## 4. El aviso accesible de `UX-29 §5`

`UX-29` deja esto como **la única excepción posible** a que el fracaso no diga nada: si un
lector de pantalla necesita anunciar que el personaje volvió a la entrada. No es un texto
que se vea nunca en pantalla — solo lo escucha quien usa asistencia.

> **`De vuelta en la entrada.`**

- **Registro 3**, una sola línea.
- **Nombra el lugar, no a la persona**: dice "la entrada", no nombra a ningún personaje ni,
  mucho menos, a Eduardo Beilinson o a Carmen Castro (`D-38` baranda 3, intacta).
- **Ni el verbo morir ni sus parientes**, ni "caer", "perder" o "fallar" como estado —
  cumple la lista vetada de `BR-24` punto 1 y la barredora de `UX-29 §9`.
- Sin emoción, sin imagen, sin punto suspensivo.

## 5. Verificación a mano contra las siete reglas de `voz.test.ts` §8

| Cadena | 1. Anglicismo | 2. Folleto | 3. Infinitivo | 4/5. Largo | 6. "la gente" | 7. Suspensivos |
|---|---|---|---|---|---|---|
| `Andá a la izquierda` | ninguno ✓ | ninguna ✓ | "Andá", no está en el set ✓ | 4 palabras ✓ | no aplica ✓ | no lleva ✓ |
| `Andá a la derecha` | ninguno ✓ | ninguna ✓ | "Andá" ✓ | 4 palabras ✓ | no aplica ✓ | no lleva ✓ |
| `Saltá` | ninguno ✓ | ninguna ✓ | "Saltá", no "Saltar" ✓ | 1 palabra ✓ | no aplica ✓ | no lleva ✓ |
| `Mando izquierdo` | ninguno ✓ | ninguna ✓ | "Mando" no es verbo ✓ | 2 palabras ✓ | no aplica ✓ | no lleva ✓ |
| `Mando derecho` | ninguno ✓ | ninguna ✓ | "Mando" ✓ | 2 palabras ✓ | no aplica ✓ | no lleva ✓ |
| `De costado se ve el doble de grande.` | ninguno ✓ | ninguna ✓ | "De" ✓ | 8 palabras ✓ | no aplica ✓ | no lleva ✓ |
| `Acá va el juego.` | ninguno ✓ | ninguna ✓ | "Acá" ✓ | 4 palabras ✓ | no aplica ✓ | no lleva ✓ (y aunque llevara, tiene ≤4 palabras: sin ellas pasa igual) |
| `De vuelta en la entrada.` | ninguno ✓ | ninguna ✓ | "De" ✓ | 5 palabras ✓ | no aplica ✓ | no lleva ✓ |

Ninguna de las ocho contiene *vida*, *muerte*, *moriste*, *perdiste* ni *game over*
(`BR-24`, `UX-29 §9`), ni el nombre del juego de origen (`RES-60`).

## 6. Nombres de campo sugeridos

Sugerencia, no mandato:

| Campo sugerido | Valor |
|---|---|
| `TECLA_IZQUIERDA` | `Andá a la izquierda` |
| `TECLA_DERECHA` | `Andá a la derecha` |
| `TECLA_SALTO` | `Saltá` |
| `MANDO_IZQUIERDO` | `Mando izquierdo` |
| `MANDO_DERECHO` | `Mando derecho` |
| `LINEA_VERTICAL` | `De costado se ve el doble de grande.` |
| `ROTULO_CARGA` | `Acá va el juego.` |
| `AVISO_ENTRADA` | `De vuelta en la entrada.` |

## 7. Qué no tiene comando y se mira a ojo

Según `Docs/ORQ/ORQ-plan-ciclo-15.md` §3 (fila `T-233`): **que el rótulo estático diga qué
hay ahí sin prometer nada no tiene comando: lo mira `revisor`** en `T-250`, con este
documento como vara (§3 de esta nota razona por qué "Acá va el juego." no promete nada).

Lo que sí corre solo, y recién cuando el texto aterrice en el código (`T-239`, la fila del
plan lo llama "comando diferido"):

- El infinitivo en cualquiera de las ocho cadenas: `node --test src/lib/voz.test.ts`.
- La lista prohibida de `BR-24` y la barredora de `UX-29 §9` sobre el copy y la isla:
  `rg -in "vida|muerte|moriste|perdiste|game over" src/lib/skayboy/ src/scripts/partida-skayboy.ts`,
  sin resultados.

Y algo que no tiene comando y no está en la tabla del plan pero conviene dejarlo escrito:
que la asignación de columna a personaje (§1, `BR-23` punto 5) siga sin decidirse acá es a
propósito. El día que `experiencia` la fije, las dos etiquetas de grupo (`MANDO_IZQUIERDO`
/ `MANDO_DERECHO`) pueden pasar a nombrar al personaje si se quiere más contexto — no hace
falta reabrir esta nota para eso, alcanza con que quien cablee use el nombre que
corresponda.

## Bloqueos

Ninguno. No hace falta ficha `RES-XX`: es texto funcional e instructivo, no un dato
verificable sobre la banda.

## Siguiente

`hilo principal` necesita las ocho cadenas de esta nota para `src/lib/skayboy/copy.ts`
(`T-239`), el rótulo estático adentro del recorte impreso (`T-239`/`T-240`), y las seis
teclas con su `aria-label` en la isla (`T-247`).
