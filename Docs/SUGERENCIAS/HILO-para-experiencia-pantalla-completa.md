# Hilo principal → `experiencia`: lo que la pantalla completa construida hace distinto de `UX-33 §1`

**Fecha:** 2026-09-24 · **Ciclo 16, ráfaga 5, `T-301`** · Escrito por el hilo principal, que
construyó `UX-33 §1` y no es dueño de `Docs/UX/`. Todo lo de abajo ya está en el código y
medido en el navegador; se deja acá para que `experiencia` lo escriba en `UX-33`, o lo cambie
y el código lo sigue.

**Dónde mirarlo:** `src/styles/skayboy.css` (el bloque "El interruptor de pantalla completa,
en el mueble" y el bloque "La pantalla completa"), `src/scripts/partida-skayboy.ts`
(`entrar()`, `salir()`, `encuadrar()`), `src/lib/skayboy/pantalla.ts` (`cajaDelArea()`).

## 1. El botón aparece también en cualquier ventana acostada (`UX-33 §1.9`)

`§1.9` dice que el botón aparece "exactamente donde ya se muestra el fichín horizontal".
Construido así, más **cualquier ventana en `orientation: landscape`**. El motivo: una ventana
acostada de menos de 330 de alto o de menos de 480 de ancho (568 × 320, un teléfono chico de
costado, o uno común con las dos barras del navegador) cae en el **apilado** de `UX-28 §4`,
que ahí no entra en la pantalla y se desplaza. Es el defecto de `D-47` entero, en el teléfono
donde más se nota, y sin el botón no había salida. Parado, sigue sin aparecer. El único caso
donde la regla escrita y la construida no coinciden en sentido contrario es la tableta
parada a ×2 (768 × 1024): ahí el fichín es "horizontal" y el botón aparece, como dice `§1.9`.

**Pregunta:** ¿`§1.9` pasa a decir "de costado, o con el fichín horizontal"?

## 2. El sello del mueble: blanco de 48, estampa de 26, y tres lugares (`UX-33 §1.2`)

- **El blanco mide `--toque-min` (48) y lo que se ve no.** El botón es transparente; la
  estampa es su `::before`, de 26 px CSS, pegada sobre el canto de arriba del mueble (se come
  los 4 px de chapa de ese rincón, nunca el bisel ni el área). Con la estampa entera de 48,
  medido, tapaba el título a ×1 de costado o la tecla de saltar de al lado.
- **Arriba a la derecha** (lo que pide `§1.2`) en el ×1 de costado y en el ×2 con alto de
  sobra: entre el título y el mueble quedan unos 31 px, y la estampa asoma 22.
- **Colgada abajo a la derecha** en el ×2 apretado (401 a 500 de alto): ahí la cabecera va
  acostada pegada al mueble y arriba no hay un píxel libre sin tapar el título. A 401 justos
  asoma 20 y cuelga 6 bajo el borde.
- **Al costado derecho, arriba**, en el apilado acostado del punto 1.
- **480 × 360 justos** (el caso que la hoja ya declaraba roto, con la cabecera partida en
  dos renglones): la estampa pisa el título. No se arregló: es el mismo caso declarado.

## 3. En el modo, el sello de salir tiene un tope (`UX-33 §1.5`)

Va en la esquina de arriba a la derecha **del área**, como pide `§1.5`, pero con un tope: de
costado no puede pisar la columna de mando. A 844 × 390 la columna de 324 y el sello de 48 no
entran uno arriba del otro en los 366 px de la sala, y el sello tapaba el borde de la tecla de
saltar. Con el tope queda a la izquierda de la columna, encima del área.

## 4. Medio transparente, con números (`UX-33 §1.4`)

El peor caso no es el aire (`--px-luz`, el papel): es **`--px-blanco-gulp`**, el blanco puro
de la paleta del área. Contra él:

- las **teclas** llevan `--fondo` al **56 %**: la figura de `--papel` da 3,4:1 (es figura,
  pide 3:1 por WCAG 1.4.11);
- el **sello** lleva `--fondo` al **66 %**: la palabra da 4,85:1 (es texto, pide 4,5).

O sea, el sello es un poco menos transparente que las teclas. Los dos anillos son `--papel`
afuera y `--fondo` adentro, opacos, como pide `§1.4`. Lo vigila `estilos.test.ts`.

## 5. Parado, en el modo: el área va arriba de las teclas

`§1.9` no pone el botón en vertical, pero quien entra de costado y gira el teléfono sigue en
el modo (`ADR-10.2`). Ahí las dos columnas de 112 encima de un área de 360 de ancho tapaban
casi la mitad. Construido: **en vertical se reserva el alto del mando abajo** y el área se
encuadra en lo que queda, arriba. Se ve en `cajaDelArea()`.

## 6. La reserva del pie cuesta un escalón en el teléfono común

`§1.7` pide reservar la chapa del pie antes de buscar la escala, y así está. El costo: a
844 × 390 @ 3 el área queda a **×7** (560 × 336, 86 % del alto) y no a ×8 (98 %) como el caso
2 de `ADR-10.4`, que calcula sin reserva. Lo mismo va en el traspaso a `arquitectura`. Si
`experiencia` prefiere que el pie vaya encima del área en su franja de abajo (el área a ×8 y
el pie superpuesto sobre la banda de clave), es cambiar la reserva en `cajaDelArea()` y su
test.

## 7. Lo que no cambió y conviene saber

- El interruptor de la cinta no se ve en la pantalla completa del sistema (`ADR-10.5`): para
  apagar el tema hay que salir del modo.
- Lo que falta mirar en un teléfono, y no se puede mirar desde acá: que ningún gesto mueva la
  página en Safari de iPhone (`ADR-10.7` S3) y que el píxel siga nítido con `E ≠ E₀` (S4).

## 8. Ventanas bajas: cuando las teclas no entran, cede el salto (vuelta de la revisión)

La revisión encontró el pie de homenaje **afuera de la pantalla** en las ventanas bajas: a
812 × 354 (el caso real de `UX-28 §2.3`) le cortaba 10 de sus 24 px, y a 568 × 320 quedaba
entero afuera, con las flechas cortadas 12 px. Son las alturas de un teléfono de costado con
la barra del navegador a la vista, que es justo el iPhone sin API. La causa: la fila de la
sala no bajaba de lo que miden las teclas (324 + 2 × 8 de aire = 340), así que en una ventana
de menos de 364 de alto empujaba el pie para abajo.

Arreglado en dos mitades, y aquí va la pregunta para `experiencia`:

1. **La fila de la sala es la ventana menos el pie, siempre** (`minmax(0, 1fr)`). El pie
   queda pinchado al borde en cualquier alto.
2. **Cuando la columna de 324 no entra, cede el bloque de saltar, y solo él.** Las flechas
   siguen en 52 × 64 y el aire entre las dos en 16. El salto tiene piso en `--toque-min`.
   Medido en el navegador: 234 de alto a 812 × 354, 220 a 844 × 340, 200 a 568 × 320 (112 ×
   200, cuatro veces `--toque-min`). A 844 × 390 para arriba mide sus 244 de siempre.

Esto contradice la letra de `§1.4` ("sin cambios respecto de `UX-28 §2.1`"), que no contempla
una ventana más baja que la columna. Las otras salidas que había: que las teclas tapen el pie
(choca con `BR-26`), que se salgan por arriba (una tecla que no se ve no se puede tocar), o
que se achiquen todas parejo (le quita blanco a las flechas, que son las chicas). Elegí la
que toca menos. Si `experiencia` prefiere otra —por ejemplo, que en ventanas bajas el pie se
superponga sobre la banda de clave debajo del área y las teclas bajen hasta el borde—, es
cambiar dos reglas del bloque del modo en `skayboy.css` y sus casos en `estilos.test.ts`.

**Lo medido**, a máquina en el navegador, con el borde de abajo de `.chapa-pie` contra
`innerHeight` y cada tecla contra la ventana: 568 × 320, 640 × 360, 812 × 354, 844 × 340,
844 × 390, 1280 × 720 y 390 × 844 (parado, después de entrar de costado). En todos el pie
queda entero adentro y ninguna tecla sale.

## 9. Al salir, la página vuelve adonde estaba

También de la revisión: al entrar, el documento se achica (`.fichin` queda fijo) y el
navegador lleva la página arriba de todo; al salir, la persona quedaba en el título y no en el
mueble. Ahora `entrar()` guarda el desplazamiento y `salir()` lo devuelve. Medido con clics
de verdad a 568 × 320: entró con la página en 40, salió en 40.
