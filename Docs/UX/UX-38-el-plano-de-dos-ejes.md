# UX-38 — El plano de dos ejes vuelve al resultado: un recorte de papel, relativo, sobre la grilla

> Rol dueño: `experiencia`. 2026-10-05, rama `ciclo-18/que-ricotero-sos`. Pedido del usuario,
> mirando el resultado en su teléfono (textual): *"Me gustan las explicaciones pero quiero que
> esté el gráfico también, queda lindo ver que está en un plano de dos ejes."*
>
> **Qué enmienda.** `UX-36` (lo que decía del plano: "el rombo se va", "ningún punto en el plano", "la
> tarjeta no lo muestra") y `D-57` punto 7 (la grilla pasaba a ser **el** plano). La grilla de las
> cuatro maneras **no se toca**: el plano se suma arriba, no la reemplaza. La enmienda a `D-57` la
> registra el hilo principal en `Docs/DECISIONES.md`; yo dejé las cinco marcas en `UX-36` (cabecera,
> `§5.3`, `§5.6`, `§5.8` y `§6.2`: `§8.2`).
>
> **Consume:** `D-57` punto 7 y sus enmiendas, `D-33`, `D-14`, `D-17`, `D-19`, `D-21`, `D-58`,
> `US-06` (criterios 3 y 4c), `BR-17`, `BR-37`, `CTR-08` v2.5 (`disposicion`, `relacion`),
> `UX-36` entera (`§0.5`, `§2.3`, `§5`, `§6.2`, `§8`, `§12`), `UX-06` §4 (el rombo viejo),
> `UX-35` §4.4, `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`, `tokens.css`,
> `juego.css` (bloque `.ejes-*`), `partida-dos-ejes.ts`, `partida.ts`, `copy.ts`,
> `estilos.test.ts`, `contraste.test.ts`, `partida.test.ts`, `taller.ts`.
>
> **Resuelve:** la parte de pantalla de `US-06` c3 (el plano, sin jerarquía) y c4c (la manera de
> quien te mandó el enlace, punteada, también acá). **No resuelve:** el CSS ni la isla (hilo
> principal), ninguna cadena (**no hay cadena nueva**: `§1.2`), el motor (`disposicion()` ya
> devuelve todo lo que hace falta).
>
> **Lo que no pude hacer, dicho antes que nada.** Esta sesión no tuvo shell: no abrí `bc27cd4`
> (`git show`) ni corrí nada (`D-12`). **El rombo viejo lo conozco por `UX-06` §4 y por `D-57`, no
> por su código.** Los números de abajo son de tres clases, como en `UX-35` y `UX-36`: **leído**
> (de otro documento o de un comentario del CSS, y lo cito), **cuenta** (mía, de tokens, cuerpos y
> medidas ya medidas; sin correr nada) y **por medir** (va a `§10`). Los píxeles son a 375 × 667
> salvo que diga otra cosa. Las anchuras de letra son cuenta: *Archivo Black* minúscula ≈ 0,586 em
> por carácter (leído: «Ronda en cualquier» mide 270 px a 1,6 rem, comentario de `juego.css`) y la
> rotulada en mayúsculas de 0,75 rem ≈ 11 px por carácter (leído: «OSCURIDAD» ≈ 100 px, `REV-19`).
> **Las cuentas de esta hoja han quedado cortas antes** (`UX-36` §10.1: portada 576 contra 590
> medido): ninguna de las de `§4` se da por buena sin `§10`.

---

## 0. Lo que hay, y qué se hace

**Hoy**, el resultado es la última hoja (nombre, sello de polos, línea que nombra, bajada), los dos
botones y, debajo, "Las cuatro maneras": una grilla de dos por dos **relativa** con cada celda que
abre su explicación (`UX-36` §5.3). **Hasta el ciclo 18** había un rombo con un punto (`UX-06` §4).
`D-57` punto 7 lo sacó por dos razones: dejaba las dos caras de luz siempre arriba (una jerarquía) y
el punto podía leerse como una medida.

**Lo que se hace.** Vuelve un plano, **no el rombo**: un recorte de papel pegado con dos ejes en
cruz, los cuatro cuadrantes con su nombre, los cuatro extremos con su polo en palabras y la tuya
marcada. Va **debajo de los botones, arriba de la grilla**, **relativo** (la tuya siempre en el mismo
lugar), **sin punto**, escrito en HTML y escondido al lector de pantalla. **No viaja** en la tarjeta ni
en la vista previa. Las razones, una por una, en `§1` a `§6`.

**No hay brief de arte original.** Es papel, tinta y CSS, como el resto del juego (`UX-36` §0.2): no
hay pieza que producir.

### 0.1 El flujo, de punta a punta (`US-06` c3, c4c)

| # | Pantalla | Qué pasa |
|---|---|---|
| 1 | La última hoja | Igual que hoy (`UX-36` §5.1). El foco cae en el nombre; **el plano nunca toma el foco** |
| 2 | Los dos botones | **Compartí** y **Empezá otra noche**, arriba del pliegue. **No se mueven** (`§3`) |
| 3 | Un deslizamiento | "Las cuatro maneras", su línea que canta y, si vino un enlace, la línea de contraste |
| 4 | **El plano** (nuevo) | Se mira. No se toca: no suma ninguna decisión ni ningún toque |
| 5 | La grilla | Se toca una celda y se abre su explicación (sin cambios) |
| 6 | "Bajá la tarjeta" y "← Volvé al fichín" | Igual; **quedan ≈ 330 px más abajo** (`§3.2`) |

- **Acertar y fallar no existen** (`D-33`): el plano no festeja, no se anima y no marca ninguna manera
  como mejor.
- **Compartir no cambia:** viaja la tarjeta de la identidad y el enlace a la postal (`UX-36` §6.1).
  El plano no viaja (`§6`).
- **Si el plano no se puede armar**, no se pinta y nada más cambia: el nombre, los botones y la
  grilla no dependen de él (es un dibujo redundante, `§5`). No debe poder romper `pintarResultado()`.
- **Tiempo:** el plano queda **fuera del camino de los dos minutos** (que termina en Compartí). Es
  lectura opcional, ≈ 5 a 10 s (cuenta) para quien baja. La noche sigue en ≈ 1:20–2:05 (`UX-36` §1.1).
- **La primera pantalla sin muro no se toca:** el plano vive solo en el resultado, nunca en la
  portada ni en la postal.

---

## 1. Qué es el gráfico (decisión 1)

### 1.1 Qué muestra

Un recorte de papel con **dos ejes que se cruzan** (luz–oscuridad y orden–caos), **cuatro
cuadrantes** con su nombre, **cuatro extremos** con su polo en palabras, **la tuya marcada** y, si
vino un enlace, **la de quien te lo mandó, punteada**.

Boceto sin escala, para quien salió «Mesa larga a las nueve» (`CU-1`) y cuya postal venía con
«Mochila liviana, sin mapa» (`CU-4`, la opuesta). Los renglones de los polos del medio interrumpen el
eje horizontal; el eje vertical va de un polo al otro:

```
                                   LUZ
                               con la gente
                                    │
    ┏━━━━━━━━━━━━━━━━━━━━━┓         │
    ┃ ESTA NOCHE          ┃         │    Ronda en
    ┃ Mesa larga          ┃         │    cualquier esquina
    ┃ a las nueve         ┃         │
    ┗━━━━━━━━━━━━━━━━━━━━━┛         │
 ORDEN ─────────────────────────────┼────────────────────────── CAOS
 con plan                           │             sobre la marcha
                                    │
    Radio bajita,                   │   ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐
    misma hora                      │   ┆ QUIEN TE LO MANDÓ ┆
                                    │   ┆ Mochila liviana,  ┆
                                    │   ┆ sin mapa          ┆
                                    │   └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘
                                    │
                                OSCURIDAD
                               con lo propio
```

Quien salió «Mochila liviana, sin mapa» ve el mismo dibujo con **OSCURIDAD arriba, CAOS a la
izquierda** y su nombre en el cuadrante de arriba a la izquierda (`§2`).

### 1.2 De dónde sale cada cosa (ninguna cadena nueva)

| Elemento | Qué es | Cadena |
|---|---|---|
| Polo de arriba y de abajo | El eje de luz–oscuridad: primero el tuyo, arriba | `EJES[renglones[0]]` y `EJES[renglones[1]]`, y debajo `POLOS[…]` (`copy.ts`) |
| Polo de la izquierda y de la derecha | El eje de orden–caos: primero el tuyo, a la izquierda | `EJES[columnas[0]]` y `[1]`, y debajo `POLOS[…]` |
| Cuadrantes | Las cuatro maneras, en el orden de `disposicion().celdas` | `celdas[k].nombre` (el banco) |
| Sello de la tuya | Borde grueso y sólido, más el sello | `RESULTADO.tuya` ("Esta noche") |
| Sello de la del amigo | Borde punteado, más el sello | `RESULTADO.suya` ("Quien te lo mandó") |
| Los ejes | Dos líneas que se cruzan en el centro | Ninguna: son borde |

Son las mismas cadenas que la grilla de abajo ya usa (`EJES`, `POLOS`, `RESULTADO.tuya`,
`RESULTADO.suya`, los nombres del banco), así que **`voz.test.ts` y `banco.test.ts` ya las vigilan** y
no hay nada que pedirle a `contenido`. El rótulo de cada polo va en **dos renglones** (el polo en
rotulada y mayúsculas, sus palabras debajo) y no en uno con " · " como los márgenes de la grilla. La
razón es la franja del eje horizontal, donde los dos rótulos van lado a lado: "ORDEN · con plan" (≈ 117 px)
y "CAOS · sobre la marcha" (≈ 150) suman ≈ 267, y a 320 de ancho hay ≈ 248 útiles; en dos renglones miden
≈ 60 y ≈ 96 y entran siempre. Los de arriba y abajo van igual, para que los cuatro sean la misma pieza.

**Registro:** todo es registro 3 (rótulos y nombres de cosa): seco, sin imagen, sin suspensivos. La
línea que canta ya está arriba ("Cuatro puntas de la misma hoja.") y ahora tiene su hoja delante.

### 1.3 ¿Hay un punto? No

Hay un recuadro y un sello **en el cuadrante**, no un punto **dentro** de él. Tres razones:

1. **Un punto invita a mirar a qué distancia queda del eje y de la esquina**, que es justo lo que
   `BR-17` y el criterio 3 de `US-06` no dejan mostrar ("ningún grado dentro de la manera"). `resolverCuadrante`
   no devuelve números (`CTR-08.6`), así que el punto no podría mover nada, y un punto que no puede
   moverse solo aparenta una medición. Es lo que ya decía `D-57` punto 7.
2. **En un plano relativo no informaría nada:** la tuya cae en el mismo lugar para las cuatro personas
   (`§2`). El punto sería idéntico en los cuatro casos.
3. **El idioma del sitio para "esta" es el borde más el sello**, y la grilla ya lo usa. Una sola marca
   para las dos figuras: lo grueso es tuyo, lo punteado es del otro, y el sello lo dice con letras.

**Si el usuario igual lo pide:** un punto de 12 px en `--fondo`, siempre en el centro de la caja del
nombre **de su** cuadrante y de ningún otro, jamás con una posición calculada. No lo recomiendo; con
el sello alcanza.

### 1.4 Lo que el gráfico no tiene

Ningún número, ninguna escala, **ninguna marca regular sobre un eje** (una raya cada tantos píxeles es
una escala), ninguna punta de flecha (dice "más hacia acá"), ningún relleno por cuadrante (el relleno
distinto pesa distinto), ningún degradado, ningún punto, ningún nombre más grande que otro, ninguna
animación. Los cuatro cuadrantes miden lo mismo y llevan la misma letra.

---

## 2. La orientación (decisión 2): relativa, con la tuya arriba a la izquierda

### 2.1 Las cinco opciones

| Opción | Cómo queda | Qué rompe | Veredicto |
|---|---|---|---|
| **A.** Cruz de siempre, igual para todos | Luz arriba y oscuridad abajo, orden a un lado y caos al otro (cualquier variante) | **La misma** manera cae arriba a la izquierda para las cuatro personas posibles y otra abajo a la derecha: la jerarquía del rombo con otro dibujo | No |
| **B.** Igual para todos, **luz–oscuridad en el horizontal** | Luz a la izquierda, oscuridad a la derecha; orden arriba, caos abajo | La jerarquía **se muda de eje, no se va**: orden queda arriba y caos abajo, y «Mochila liviana, sin mapa» (oscuridad + caos) cae abajo a la derecha, **última en cualquier orden de lectura, para siempre**. A un cuarto de la gente el plano le dice "de última" | No |
| **C.** El rombo, girado | Los polos en las puntas y las maneras en las caras | Es el que `D-57` punto 7 sacó. Girarlo 45° más deja una *manera* (no un polo) en la punta de arriba | No |
| **D.** **Relativo: la tuya siempre en el mismo lugar** | Es la grilla, dibujada como plano | La tuya es la primera: una jerarquía, pero **personal**, que rota con la persona y que la grilla ya aceptó | **Sí** |
| **E.** Relativo con la tuya en otro lugar (arriba a la derecha, o en el origen) | — | Arriba a la derecha es "lo mejor" de toda matriz de dos por dos, y el origen sugiere el cero: las dos se leen como una medida. Además rompe el orden de la grilla | No |

**Por qué no hay una absoluta buena.** Un plano con ejes tiene un arriba, un abajo, una izquierda y
una derecha, y cualquier asignación fija deja una manera en cada lugar para siempre. Que el ojo lea
primero arriba y a la izquierda no se arregla girando el dibujo. El criterio 3 de `US-06` dice que
*nada en la pantalla jerarquiza una manera sobre las otras tres*; una absoluta cumple eso para una
persona de cada cuatro y se lo incumple a las otras tres.

**Lo que el usuario quiere sí se cumple.** Pidió *ver que está en un plano de dos ejes*: dos ejes, cuatro
lugares y el tuyo marcado, y eso lo da el plano relativo entero. Lo que se pierde es **"el mismo
dibujo para todos"**: dos amigos con resultados opuestos ven planos espejados. **Lo que no se pierde:**
la comparación con quien te mandó el enlace, porque su cuadrante sale punteado en su lugar relativo,
y la línea de contraste ya lo dice con palabras (`CNT-29`).

### 2.2 Cómo queda armado

- **Horizontal: orden–caos.** **Vertical: luz–oscuridad.** Es la grilla: columnas = polos de orden–caos,
  renglones = polos de luz–oscuridad (`disposicion().columnas` y `.renglones`).
- **Tu polo, a la izquierda (orden–caos) y arriba (luz–oscuridad).** `renglones[0]` y `columnas[0]`
  son siempre los tuyos (`partida.test.ts`, líneas 206–227, ya lo ata).
- **Los cuadrantes, en el orden de `disposicion().celdas`:**

  | Lugar | Cuál | Comparte contigo |
  |---|---|---|
  | Arriba a la izquierda | **La tuya** (`celdas[0]`) | todo |
  | Arriba a la derecha | `celdas[1]` | tu polo de luz–oscuridad (tu mismo renglón) |
  | Abajo a la izquierda | `celdas[2]` | tu polo de orden–caos (tu misma columna) |
  | Abajo a la derecha | `celdas[3]` | nada: la opuesta |

- **Por qué arriba a la izquierda.** (1) **Es el mismo orden que la grilla de abajo**: el ojo salta de una
  figura a la otra con una sola regla ("la tuya primero"), y `disposicion()` ya lo devuelve así: cero
  código de motor nuevo. (2) Es donde empieza la lectura y **es el único rincón sin sentido de "mejor"**
  (arriba a la derecha es el de las matrices de consultor, abajo a la izquierda es el origen). Lo que
  deja a cada polo sin extremo fijo no es el rincón, es ser relativo (`§2.3`).

### 2.3 La prueba de que ningún polo ni ninguna manera tiene lugar fijo

Entre los cuatro planos posibles, **cada manera ocupa cada lugar exactamente una vez** (un cuadrado
latino de 4 × 4), y **cada polo está arriba en dos de los cuatro planos y abajo en los otros dos** (lo
mismo a izquierda y derecha). Es una guarda más fuerte que la que existe hoy (`partida.test.ts` solo
mira que cada manera pueda ser *la primera*): ver `§8`.

---

## 3. Dónde va (decisión 3): debajo de los botones, arriba de la grilla

### 3.1 El orden

Dentro de la sección "Las cuatro maneras" (`section.ejes-cuatro`), de arriba abajo:

1. el título, `h3` "Las cuatro maneras";
2. la línea que canta, "Cuatro puntas de la misma hoja.";
3. si vino un enlace, **la línea de contraste** (`UX-36` §5.4: no se mueve);
4. **el plano** (nuevo);
5. la grilla de las cuatro maneras (con sus rótulos y sus celdas que se abren).

Todo cuelga de `pintarResultado()` **después** de `.ejes-acciones`: el plano nunca está en el flujo
entre la hoja y los botones.

**Por qué no en la última hoja, ni entre la hoja y los botones.** El recorte mide ≈ 300 px (`§4.3`) y la
holgura de la pantalla a 375 × 667 es de 66 (`UX-36` §5.6). Con el plano antes de los botones, "Compartí"
terminaría en ≈ 850 y "Empezá otra noche" en ≈ 920 (cuenta: 531 y 601, más el recorte y su aire): los
dos bajo el pliegue, y es justo lo que `UX-36` §5.4 ya evitó con la línea de contraste.
**Por qué no después de la grilla:** el usuario pidió el gráfico *además* de las explicaciones, y un
dibujo que se mira por primera vez después de leer cuatro bajadas ya no orienta nada.

### 3.2 Qué mueve (cuenta, sobre `UX-36` §5.6 y §5.7)

| Ventana | "Compartí" termina | "Empezá otra noche" termina | Con el plano | Dónde empieza el recorte |
|---|---|---|---|---|
| 375 × 667, peor caso (nombre de tres renglones, línea de dos, bajada de cuatro) | ≈ 531 | ≈ 601 | **igual** | ≈ 704: bajo el pliegue |
| 375 × 667, caso típico (nombre de dos, línea de una, bajada de cuatro) | ≈ 467 | ≈ 537 | **igual** | ≈ 640: asoma ≈ 27 px |
| 360 × 640 | ≈ 556 | — | **igual** | bajo el pliegue |
| **320 × 568, peor caso** | ≈ 555 a 579 (cuenta mía; `UX-36` no la hizo) | ≈ 625 a 649 | **igual** | bajo el pliegue |
| 1366 × 657 (la mesa) | ≈ 481 | ≈ 551 | **igual** | ≈ 654: en el borde |

- **"Igual" no es una medición: es una construcción.** El plano está *después* de los botones en el
  DOM y en el flujo, así que nada de lo que está arriba depende de él. La verificación es una A/B
  (`§10.1`): el borde de abajo de los dos botones, con el plano y sin él, **no cambia ni un píxel**.
- **Lo que sí se mueve** es lo que está *debajo*: "Bajá la tarjeta" y "← Volvé al fichín" bajan
  **≈ 326 px** (300 de recorte y 24 de aire) a 375, **≈ 352** si hay un amigo en otra celda, **≈ 400** si es la misma,
  y **≈ 386 a 466** a 320 (`§4.3`). Costo asumido: son las dos acciones que no están en el camino
  (la gente que cierra, cierra; el botón de volver del navegador sigue donde estaba).
- **A 320 × 568 el "Compartí" del peor caso ya queda al borde del pliegue sin el plano** (≈ 555–579
  contra 568, cuenta). `UX-36` §1.2 solo prometió 375 × 667 y 360 × 640. **No es culpa del plano ni lo
  arregla**; lo dejo escrito porque la pregunta lo nombró. La palanca, si se quiere, es la que `UX-36`
  §1.2 ya fijó: el aire de la hoja, nunca la bajada. **Por medir.**
- **El plano casi no se ve en la primera pantalla, y es a propósito:** primero Compartí. El título de
  la sección y, en el caso típico, el borde de arriba del recorte asoman como invitación a bajar (el
  mismo argumento de `UX-36` §5.7 para la mesa).

---

## 4. Cómo se ve (decisión 4)

### 4.1 Qué objeto es

**Un recorte de papel pegado con cinta**, el mismo idioma de la etiqueta de la tapa: no una "tarjeta",
no una superficie elevada (`diseno-marca.md`). Papel liso (las rayas cruzarían las letras: `UX-36` §2.3),
los ejes dibujados a tinta, un trozo de cinta arriba.

| Objeto | Papel y tinta | Borde | Sombra | Giro | Letra |
|---|---|---|---|---|---|
| **El recorte** | `--papel`, liso; tinta `--fondo` | **`--linea` en `--apoyo-disco`** (el borde de la tapa, `D-21`), esquina 3 px | Dura de 4 px en `--borde` | **+0,5°** (la última hoja va a −0,5°: dos manos distintas) | — |
| **La cinta** | `--papel` al 30 % (la de la etiqueta, 72 × 22, −4°) | — | — | −4° | — |
| **Los ejes** | `--papel-tenue`, 2 px | — | — | — | — |
| **Polo, renglón del eje** | `--papel-tenue` | — | — | — | rotulada 0,75 rem, mayúsculas, `letter-spacing: 0.08em` |
| **Polo, sus palabras** | `--papel-tenue` | — | — | — | `--fuente` 0,8 rem |
| **Nombre del cuadrante** | `--fondo` | — | — | — | rotulada 0,8 rem, centrada, `text-wrap: balance` |
| **Sello** (tuya / del amigo) | `currentColor` = `--fondo` | 2 px, esquina 3 px; **punteado** el del amigo | — | −1,5° (como el sello de polos) | rotulada 0,75 rem, mayúsculas |
| **La tuya** | sin relleno | **`--linea` (3 px) sólido** en `--fondo`, esquina 3 px | — | — | — |
| **La del amigo** | sin relleno | 2 px **punteado** en `--fondo` | — | — | — |
| **La misma** | sin relleno | `--linea` **punteado** y los dos sellos (como en la grilla) | — | — | — |

**Dos cosas que decido y que se ven distinto que en la grilla.**

- **La marca va en `--fondo` y no en el cuero.** En la grilla la tuya lleva el cuero (`--tinta-disco`)
  sobre el fondo oscuro. Sobre el papel el cuero da **≈ 2,3 : 1** (cuenta mía) y no llega a los 3 : 1 de un
  gráfico; la tinta del papel (`--fondo`) da ≈ 15 : 1. Lo que hace de canal es la forma (grueso, punteado,
  nada) más el sello, igual que en la grilla: **ninguna marca se apoya en el color** (`diseno-marca.md`).
- **El borde del recorte es el topo de *Luzbelito*.** Es lo que trae la paleta del disco a esta pieza
  (`D-19`: cada sección viste la suya), como en la tapa; el interior es papel y tinta.

**Sin esquinero.** La hoja final lleva el del libro; el plano es un recorte suelto y no necesita otra
pieza: una imagen menos que bajar, y el crédito sigue saliendo una sola vez (`UX-36` §2.5).

### 4.2 Cómo se arma (estructura, para el hilo)

HTML, no SVG: igual que la grilla (`D-57` punto 7: "texto HTML, no un SVG escalado"). Un SVG escala su
texto con la caja, y a 288 px de ancho los 12 px se vuelven 10; en HTML la letra es en `rem` y el nombre
se parte solo con `text-wrap: balance`.

1. `div.ejes-plano` con `aria-hidden="true"`: el recorte (borde, sombra, cinta, giro).
2. Polo de arriba: `EJES[renglones[0]]` y, debajo, `POLOS[…]`.
3. `div.ejes-plano-cruz`: una cuadrícula de dos columnas y dos filas **iguales** (`1fr 1fr`: crecen juntas),
   con la franja del eje horizontal en el medio. Adentro:
   - los dos ejes: **dos elementos vacíos que solo llevan borde** (`border-top` y `border-right`), no
     fondo (`§4.4`);
   - los cuatro cuadrantes, **en el orden de `disposicion().celdas`**, con `--tuya` y `--suya` donde
     correspondan, cada uno con su sello (si lo lleva) arriba del nombre;
   - los dos polos de los costados (`columnas[0]` a la izquierda, `columnas[1]` a la derecha), **sobre
     el eje horizontal, con el fondo del papel** para interrumpirlo.
4. Polo de abajo: `EJES[renglones[1]]` y `POLOS[…]`.

**Una sola llamada a `disposicion()`** que alimente a la grilla y al plano: así las dos figuras no pueden
discrepar. (Hoy `grilla()` la llama adentro; hay que subirla a `pintarResultado()` y pasarla.)

**Nombres de clase** (los sugiero; el hilo los ajusta): `.ejes-plano`, `.ejes-plano-cruz`,
`.ejes-plano-eje`, `.ejes-plano-polo`, `.ejes-plano-cuadrante`, `--tuya`, `--suya`, `.ejes-plano-sellos`.
**Las dos modificadoras entran a `ESTADOS_EJES`** (`estilos.test.ts`, `§8`).

### 4.3 Las medidas (cuenta; **por medir**)

**Relleno** del recorte: 12 px por lado. Cada cuadrante: 3 px de margen, 4 px de relleno, 3 px de borde
**en los cuatro** (transparente en los no marcados, y el del amigo, que es de 2 px, se completa con 1 px de
relleno: así ninguno cambia de tamaño al marcarse), `min-height: 5rem` (80 px). Cada fila crece al mayor de
sus dos cuadrantes y las dos filas, al mayor de las dos.

**A 375 × 667**, el recorte (sin amigo):

| Tramo | Alto | Acumulado |
|---|---|---|
| Borde del recorte (3 + 3) | 6 | 6 |
| Relleno de arriba | 12 | 18 |
| Polo de arriba: renglón del eje (14) + palabras (17) | 31 | 49 |
| Aire | 8 | 57 |
| Fila de arriba (`min-height`) | 80 | 137 |
| Franja del eje horizontal: polos de los costados, dos renglones | 34 | 171 |
| Fila de abajo | 80 | 251 |
| Aire | 8 | 259 |
| Polo de abajo | 31 | 290 |
| Relleno de abajo | 12 | **302** |

La caja del cuadrante marcado, la que más alto sale: 6 de borde + 8 de relleno + sello de un renglón
(20) + 4 + nombre de dos renglones (33) + 6 de margen = 77, **cabe en los 80**.

**Por ventana** (cuenta):

| Ventana | Ancho útil del nombre | Nombre, peor caso | Fila | Recorte | Con amigo / la misma |
|---|---|---|---|---|---|
| **375** | ≈ 131 | 2 renglones («cualquier esquina» mide ≈ 128: **al borde**) | 80 | ≈ **302** | ≈ 328 / ≈ 376 |
| **360** | ≈ 124 | 3 (`CU-2`) | ≈ 94 | ≈ 330 | ≈ 356 / ≈ 404 |
| **320** | ≈ 104 | 3 (`CU-2` y `CU-4`); el sello «Esta noche» pasa a dos renglones | ≈ 110 | ≈ 362 | ≈ 388 / **≈ 442** |
| **Mesa ≥ 64 rem** | ≈ 168 (recorte a 26 rem) | 2 | 80 | ≈ 302 | ≈ 328 / ≈ 376 |

- **El sello del amigo ("QUIEN TE LO MANDÓ", ≈ 170 px: cuenta con los 11 px por carácter que midió
  `REV-19`; los ≈ 143 de `UX-36` §5.3 eran cuenta y quedan cortos) se parte en dos renglones adentro de su
  rectángulo**, como en la grilla: `inline-block`, `max-width: 100%`, `text-wrap: balance`. Si la medición real da más de lo de arriba, las palancas son, en este
  orden: el `min-height` de las filas, el aire entre cuadrantes, el relleno del recorte. **Nunca la
  letra**: 12 px es el piso (`UX-36` §8.4).
- **Las cuatro filas y las cuatro columnas miden lo mismo siempre**, aunque la tuya lleve sello y las
  otras no: `1fr 1fr` en las dos direcciones y el `min-height`. La tuya no puede salir más grande.

**Tamaños de letra**, todos ≥ 12 px: renglón del eje y sellos 0,75 rem (12 px); palabras de los polos y
nombres 0,8 rem (12,8 px). Los nombres van a 0,8 y no a los 0,95 de la grilla porque a 375 el nombre más
largo tiene que entrar en dos renglones (a 0,85 mide ≈ 136 contra 131 útiles). La grilla de abajo trae
los mismos nombres a 0,95 rem: el plano orienta y la grilla lee.

**En la mesa (≥ 64 rem)**, `max-width: 26rem` (416 px), **centrado**: es un recorte pegado, no una
columna. **La letra no crece** (`UX-35` §4.4): crece el aire, no el cuerpo. Sin hover ni `:active`:
no se parece a un control, y el cursor no cambia. La carátula de la izquierda y su lista no se tocan.

**Debajo de 18 rem (288 px)**, que ningún teléfono real mide (lo alcanza solo el zoom del navegador), el
plano se va (`display: none`): la grilla lo dice todo y el criterio de reflujo de WCAG pide 320.

### 4.4 Cuatro trampas del CSS

1. **`border-left` rompe el build.** `estilos.test.ts` toma `border-left` y `border-inline-start` por
   barra lateral de acento fuera de `.parrafo--` (líneas 98–121). El eje vertical **no** se dibuja con el
   borde izquierdo de un cuadrante: es un elemento propio, con `border-right`.
2. **El papel invierte la tinta.** La sección "Las cuatro maneras" es `--texto` sobre `--fondo`; adentro
   del recorte el par es `--fondo` sobre `--papel`. Si el recorte hereda el color de la sección, queda
   crema sobre crema (≈ 1,1 : 1, cuenta). Hay que **fijar `color: var(--fondo)` en el recorte** (como `.ejes-hoja`).
   Y **`--texto-tenue` no entra al papel** (1,78 : 1, `tokens.css`): lo tenue de acá es `--papel-tenue`.
3. **Los ejes, con borde y no con fondo.** En modo de contraste forzado (Windows) el navegador pisa los
   fondos y respeta los bordes: una línea hecha con `background` desaparece, una hecha con `border`
   no. También sirve para el punteado.
4. **El cuero no entra al papel**, ni como línea ni como texto (≈ 2,3 : 1). No hay par nuevo en
   `contraste.test.ts` y no tiene que haber (`§5`).

### 4.5 Qué disco viste

*Luzbelito*, como todo el juego: el **topo** (`--apoyo-disco`) en el borde del recorte; el resto es papel y
tinta. No hay cuero, ni rojo, ni acento: no se disfraza el acierto ni el error porque no existen.

---

## 5. Accesibilidad (decisión 5): el plano se esconde al lector de pantalla

**`aria-hidden="true"` en todo el recorte. No hay `role="img"` ni `aria-label`, y por eso no hay cadena
para `contenido`.** La razón es de redundancia, y la verifiqué punto por punto:

| Qué dice el plano | Dónde ya lo oye el lector |
|---|---|
| Los dos polos de **tu** manera, en palabras | La hoja: el sello de polos ("Luz · Orden") y la línea que nombra ("Con la gente, con plan."), que lee el foco al caer en el nombre |
| Los cuatro nombres, y cuál es la tuya | La grilla: la lista dice "Las cuatro maneras, con la tuya primero" y cada celda empieza por su sello ("Esta noche") y su nombre |
| Los polos de cada una de las otras tres | La grilla, al abrir cada celda (la línea que nombra) |
| La de quien te mandó el enlace, y qué comparten | La grilla (su sello "Quien te lo mandó") y la línea de contraste, que dice "Con la tuya comparte: …" |
| La disposición en dos ejes | Es un dato **visual**: el orden de la grilla ("la tuya primero, luego la que comparte tu polo de luz–oscuridad…") y las líneas de arriba lo cuentan con palabras |

- **No se lee dos veces ni una:** recorrido lineal desde "Empezá otra noche" → título → línea que canta
  → [contraste] → **la lista de la grilla**. El plano no aparece. Es lo que `UX-36` §8.4 ya hacía con los
  rótulos de columna y de renglón de la grilla (`aria-hidden`).
- **Si algún día deja de ser redundante** (por ejemplo, si la hoja dejara de decir los polos en
  palabras), el plano pasa a `role="img"` con un `aria-label` que diga los dos polos de la manera. **Hoy no.**
- **Nada enfocable adentro:** ni `a`, ni `button`, ni `tabindex`. El orden de tabulación de `UX-36` §8.1 no
  cambia.
- **Ningún estado solo con color:** el plano **no usa color** para marcar. Los canales son el borde
  (grueso, punteado, ninguno), el sello con letras y el lugar (arriba a la izquierda). Se entiende
  igual en blanco y negro y con el contraste forzado.
- **Contraste, ningún par nuevo:** `--fondo` sobre `--papel` (≈ 15 : 1, `UX-36` §4.2) y `--papel-tenue`
  sobre `--papel` (5,39 : 1, `tokens.css`; ya están en `contraste.test.ts`). Los ejes, que son gráfico
  y no texto, usan `--papel-tenue`: 5,39 : 1, sobre los 3 : 1 que pide un componente gráfico.
- **Letra ≥ 12 px** en todo, y sin alto fijo: los nombres se parten, no se cortan, y llevan
  `overflow-wrap: anywhere` para que el texto del sistema al 200 % rompa una palabra antes que
  desbordar. **Por medir** (`§10.4`).
- **Movimiento:** ninguno. No hay nada que reducir.
- **Falso apoyo:** un recuadro grueso parece tocable. Ni el recuadro ni nada del plano responde a un
  toque, y el cursor no cambia. Si la gente toca el cuadrante esperando que abra su explicación, es una
  señal de producto (`§9`), no un defecto de accesibilidad.

---

## 6. La tarjeta y la vista previa (decisión 6): no

**El plano no entra en la tarjeta de 1080 × 1350 ni en la vista previa de 1200 × 630.**
`VERSION_DEL_DIBUJO` se queda en **3**, el taller no se toca y `tarjetas.test.ts` sigue en verde sin
regenerar nada. `UX-36` §6.2 ("Lo que no muestra: el plano") **sigue valiendo**. Cinco razones:

1. **No hay lugar sin sacar algo que el usuario quiere.** El plano a un cuerpo legible en la tarjeta
   (30 px, el piso de `UX-36` §6.2) mide ≈ 550 a 600 px de alto (cuenta: cuadrantes de 400 × 160, tres
   franjas de polos de dos renglones). La hoja mide hoy 769 y el tope es 860; con el plano pasaría de
   ≈ 1300, y arranca en y = 230 sobre una tarjeta de 1350. Entraría solo **sacando la bajada** (que es la
   explicación que al usuario le gusta) **y el libro** (la única pieza de arte), y ni así.
2. **En la miniatura no se lee.** Una tarjeta en un chat se ve a un tercio: los nombres de 30 px quedan
   en 10, y compiten con el nombre grande (80 px → ≈ 27). `UX-36` §6.2 dice que lo único que se tiene
   que leer en la miniatura es el nombre y "ME SALIÓ".
3. **Lo ve otra persona, y el plano es relativo.** A quien recibe la tarjeta le llegaría el plano
   *de quien la mandó*, con su manera arriba a la izquierda: cuatro tarjetas de cuatro amigos serían cuatro
   dibujos espejados que no se pueden poner una al lado de otra. **El argumento más fuerte a favor del
   plano absoluto es justo este**, y por eso lo anoto: en la tarjeta la absoluta serviría y la relativa
   estorba. Pero un mismo dibujo con dos orientaciones según el soporte es peor que cualquiera de las dos
   (`§2`).
4. **Cuesta una versión del dibujo, cuatro tarjetas, cuatro vistas y el manifiesto** (`VERSION_DEL_DIBUJO`
   sube a 4, el taller mide y falla si algo no entra) por un adorno que ya está en la pantalla.
5. **La postal y la portada tampoco lo llevan:** el plano es del resultado.

---

## 7. Lo que el resultado sigue sin tener

Ningún número, ningún puntaje, ningún "más", ningún grado dentro de la manera, ninguna frase que
defina a la persona, ninguna comparación con una noche anterior, ninguna animación (`UX-36` §5.8). **La
única frase de `UX-36` que cambia es "ningún punto en el plano"**: sigue cierta (el plano no lleva punto, `§1.3`),
pero ya no es cierto que no haya plano.

---

## 8. Guardas, y qué actualizar

### 8.1 Para el hilo principal (qué tiene que vigilar un test)

| # | Qué | Dónde | Estado |
|---|---|---|---|
| G1 | **Cada manera ocupa cada lugar una sola vez entre los cuatro planos**, y **cada polo queda arriba (y a la izquierda) en dos de los cuatro**. Para cada posición `p` de 0 a 3, el conjunto de `disposicion(BANCO, c.id).celdas[p].id` sobre los cuatro `c` tiene 4 elementos; y `renglones[0]` toma cada polo dos veces | `partida.test.ts`, junto al de la línea 206 (que hoy solo mira `p = 0`) | **Nuevo**: 6 líneas |
| G2 | El plano usa `disposicion()` **y ninguna otra función**: no hay una tabla `CU-1 → arriba` en el código (segunda fuente de verdad, `codigo-juegos.md`) | Revisión del diff | Lectura |
| G3 | `ESTADOS_EJES` suma `.ejes-plano-cuadrante--tuya` y `.ejes-plano-cuadrante--suya`: sin ellas, si el CSS pierde la regla, la marca desaparece y nada falla | `estilos.test.ts`, línea 603 | **Nuevo**: 2 entradas |
| G4 | **Ningún `font-size` en `rem` menor a 0,75 en una regla cuyo selector empiece con `.ejes-`** (protege al plano, a la grilla y al resto del bloque; hoy ninguna lo viola: lo leí regla por regla) | `estilos.test.ts` | **Nuevo**: ≈ 10 líneas |
| G5 | Ningún `border-left` ni `border-inline-start` en el plano (lo atrapa el test de las líneas 98–121) y ningún hex (línea 92) | `estilos.test.ts` | **Ya existe** |
| G6 | El plano lleva `aria-hidden="true"` y no crea `a`, `button` ni `tabindex`: que la fuente de la isla, en la función que lo arma, contenga `aria-hidden` y ninguna de las tres | `estilos.test.ts` o un test de la isla, por regex | **Nuevo**, opcional: es frágil; si no se hace, queda en `§10.4` |
| G7 | **A/B de los botones:** el borde de abajo de "Compartí" y de "Empezá otra noche" es idéntico con y sin el plano, a 375 × 667, 360 × 640 y 320 × 568 | Medición (`§10.1`) | A mano |
| G8 | El taller no se enteró: `VERSION_DEL_DIBUJO` sigue en **3** y `altoDeLaHojaDeLaTarjeta` en **769** | `tarjetas.test.ts` | **Ya existe**; si falla, algo se coló |
| G9 | Ningún par nuevo en `contraste.test.ts` | `contraste.test.ts` | **Ya existe** (la lista no cambia) |
| G10 | Ninguna cadena nueva: `voz.test.ts` no cambia | `voz.test.ts` | **Ya existe** |

### 8.2 Qué actualizar en otros documentos

| Dónde | Qué | Quién |
|---|---|---|
| `Docs/UX/UX-36` | Cinco marcas de enmienda que **ya dejé puestas** en esta tanda: cabecera, `§5.3`, `§5.6`, `§5.8`, `§6.2` | `experiencia` (hecho) |
| `Docs/DECISIONES.md`, `D-57` punto 7 | Enmienda: *"El plano vuelve, a pedido del usuario del 2026-10-05, relativo y sin punto, **arriba** de la grilla, que se queda. Es HTML, no SVG."* La frase "sin punto, sin graduación" sigue cierta | hilo principal |
| El lienzo "Sistema de marca" (hojas 08 componentes y 09 pantallas) | Falta el recorte del plano. `diseno-marca.md` pide cambiar el diseño **primero**, y el lienzo vive afuera del repo | hilo principal / usuario |
| `ESTADO.md` | Una línea: `UX-38`, el plano; todo lo marcado "por medir" abierto | hilo principal |

---

## 9. Lo que descarté, y lo que queda abierto

### 9.1 Descartado

| Idea | Por qué no |
|---|---|
| **Reemplazar la grilla por el plano** | El usuario dijo "me gustan las explicaciones": las bajadas viven en la grilla |
| **Un solo dibujo que sea las dos cosas** (los cuadrantes del plano son las celdas que se abren) | Una celda abierta crece (la bajada son ≈ 8 a 9 renglones a 150 px, cuenta) y deforma el cruce; además el `summary` pide ≥ 72 px y el ancho de media celda lo ahoga |
| **Un plano que se toca** (un cuadrante abre su celda de la grilla y baja a ella) | Es lo más tentador. Pide botones adentro de algo que está escondido al lector de pantalla (`§5`), una segunda forma de abrir lo mismo y el control de `details` desde afuera. **Primero se mide si la gente lo toca** (`§9.2`) |
| **Un punto** | `§1.3` |
| **El plano absoluto** | `§2` |
| **SVG** | La letra escalaría por debajo de 12 px (`§4.2`) |
| **El recorte en tinta clara sobre `--fondo`** (sin papel) | Los pares ya existen (`--texto`, `--texto-tenue`), pero queda el mismo material que la grilla de abajo, y dos figuras iguales apiladas se leen como una lista larga. El papel lo vuelve un objeto y deja la marca en `--fondo` (15 : 1) |
| **Papel cuadriculado** | Las líneas cruzan la letra (`UX-36` §2.3) y una cuadrícula regular es una escala (`§1.4`) |
| **Puntas de flecha o rayitas en los ejes** | Una marca regular es una escala; una flecha dice "más hacia acá" |
| **Esquinero del libro en el recorte** | Ya está en la hoja final; una imagen menos |
| **Una línea nueva debajo del plano ("La tuya, arriba a la izquierda.")** | El sello ya lo dice, y no hay cadena que valga más que el dibujo. Si los planos espejados confunden a alguien, es una línea de `contenido`, no ahora |
| **El plano en la tarjeta y en la vista previa** | `§6` |
| **Dos paños en la mesa** (la hoja a un lado, el plano al otro) | `UX-36` §5.7 ya lo midió con la grilla: celdas de 183 px y el nombre en tres renglones. Sigue una sola columna |

### 9.2 Abierto

1. **La orientación es la decisión del usuario si no le cierra.** Es lo que `D-57` punto 7 y `US-06` c3
   cerraron, y lo que más se aparta del rombo (el mismo dibujo para todos). Si después de verlo prefiere
   el absoluto, el costo es `§2.1`, opción B: una de las cuatro maneras queda última para siempre, y eso
   reabre el criterio 3. Es una decisión suya y no mía.
2. **¿Alguien toca un cuadrante esperando que abra?** Por medir con gente real. Si pasa, el plano
   tocable (`§9.1`) entra como `UX-38` v2.
3. **La letra de 12 a 12,8 px sobre papel girado +0,5°** en un Android de baja densidad: por medir. Si
   no se lee, el recorte se pone a 0° (el cuerpo no se toca).
4. **Todas las cuentas de `§3` y `§4`**, con la advertencia de la cabecera: la rotulada real es más
   ancha que la de repuesto (`D-58`) y `UX-36` §10.1 ya midió 14 px más de lo contado. La que más me
   preocupa es **«cualquier esquina» a 375 (128 contra 131)**: si no entra, el nombre pasa a tres
   renglones y la fila a ≈ 94 (≈ +28 en el recorte).
5. **El primer renglón del pedido no habla de esto** ("Esta creo que es vieja pero no va, nunca cansa
   el volumen") y no lo traté. Si era sobre otra cosa, falta que el usuario la repita.

---

## 10. Checklist (lo corre quien implemente o `revisor`, `D-12`)

### 10.0 Comandos

```
rg -n "^# UX-38" Docs/UX/
node --test src/lib/contraste.test.ts
node --test src/lib/estilos.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/dos-ejes/partida.test.ts src/lib/dos-ejes/tarjetas.test.ts
npm test
rg -n "ejes-plano" src/styles/juego.css | rg "border-left|border-inline-start|#[0-9a-fA-F]{3,6}"
```

La última línea **no debe devolver nada**. `npm test` en verde; el número lo da la corrida.

### 10.1 Medidas, a 375 × 667 · 360 × 640 · 320 × 568 · 1366 × 657

- [ ] **A/B:** `document.querySelector('.ejes-acciones .secundario').getBoundingClientRect().bottom` y el de "Compartí", con y sin el plano: **idénticos** en las cuatro ventanas.
- [ ] El plano está **después** de `.ejes-acciones` en el DOM y después de la línea de contraste, antes de `.ejes-grilla`.
- [ ] Alto del recorte (`offsetHeight`, no `getBoundingClientRect`: está torcido): ≈ 302 a 375, ≈ 362 a 320, sin amigo. Si pasa de 330 a 375 o de 400 a 320, se aplican las palancas de `§4.3` en ese orden.
- [ ] Las dos filas miden lo mismo y las dos columnas miden lo mismo (`offsetHeight`/`offsetWidth` de los cuatro cuadrantes), **con la tuya marcada, con el amigo y con la misma**.
- [ ] «Ronda en cualquier esquina» a 375: dos renglones, o tres si no entra (anotar cuál).
- [ ] El sello «Quien te lo mandó» se parte **adentro** de su rectángulo, sin borde cortado, a 320.
- [ ] Sin desplazamiento horizontal: `scrollWidth <= innerWidth` a 320, 360 y 375, con la tuya, con el amigo y con la misma.
- [ ] En la mesa, el recorte mide ≤ 26 rem y está centrado; "Compartí" y "Empezá otra noche" terminan donde `UX-36` §5.7.
- [ ] Debajo de 18 rem el plano no se ve y la grilla sí.

### 10.2 La orientación

- [ ] La tuya está arriba a la izquierda **en las cuatro** (`CU-1` a `CU-4`, uno por uno): su nombre es el del `h2` de la hoja.
- [ ] El polo de arriba es el primero de "LUZ · ORDEN" del sello de polos de la hoja, y el de la izquierda, el segundo.
- [ ] Los cuatro nombres del plano son los de la grilla, el mismo conjunto.
- [ ] Con un enlace (`/juegos/dos-ejes/cu-2/` y `?g=dos-ejes&r=CU-2`): el cuadrante de `CU-2` sale punteado y con "Quien te lo mandó"; con la misma manera, grueso, punteado y los dos sellos; con `r=CU-9`, nada.
- [ ] La línea de contraste y la posición de la celda punteada dicen lo mismo (`partida.test.ts`, la línea 242, lo ata).

### 10.3 Lo que no tiene

- [ ] `/\d/.test(document.querySelector('.ejes-plano').textContent)` es `false`.
- [ ] Sin punto, sin flecha, sin marcas en los ejes, sin degradado, sin relleno, sin sombra difusa, sin animación ni transición.
- [ ] Ningún cuadrante más grande ni de otra letra que otro.
- [ ] No hay vela, óvalo, figura ni la palabra LUZBELITO (el plano no trae ninguna imagen).
- [ ] El pie acredita *Luzbelito* una sola vez (`UX-36` §2.5): no hay imagen nueva.

### 10.4 Accesibilidad

- [ ] `.ejes-plano[aria-hidden="true"]` y `document.querySelectorAll('.ejes-plano a, .ejes-plano button, .ejes-plano [tabindex]').length === 0`.
- [ ] Con VoiceOver o TalkBack, el recorrido lineal desde "Empezá otra noche" pasa por el título, la línea que canta, [el contraste] y la lista de la grilla, **sin pasar por el plano**.
- [ ] Todo texto del plano ≥ 12 px: `[...document.querySelectorAll('.ejes-plano *')].filter(e => e.childElementCount === 0 && e.textContent.trim()).every(e => parseFloat(getComputedStyle(e).fontSize) >= 12)`.
- [ ] Contraste forzado (Windows) activado: los ejes y los bordes de la tuya y del amigo se ven.
- [ ] Texto del sistema al 200 %: sin desplazamiento horizontal y sin letra cortada.
- [ ] El `h2` del nombre sigue recibiendo el foco al pintar el resultado.

### 10.5 En un teléfono real (lo que ninguna máquina ve)

- [ ] El recorte, a la intemperie con el brillo alto: ¿se leen los polos en `--papel-tenue` y los ejes?
- [ ] ¿La gente toca el cuadrante y espera algo? (`§9.2`, punto 2)
- [ ] Dos personas con resultados opuestos, con el teléfono al lado: ¿entienden que los planos están espejados, o creen que alguno está mal?
- [ ] ¿Se lee más pobre alguna de las cuatro maneras en el plano? Es de `REV-19`, pero acá se nota.
