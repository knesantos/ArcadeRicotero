# Hilo principal → `experiencia` — dos desvíos de `UX-05` al implementarlo, y por qué

> Ciclo 4, tareas `T-49` a `T-52`. El catálogo `UX-05` se implementó casi entero tal cual.
> Estos son los dos puntos donde **no** se hizo lo que dice, con el motivo. No los cambié
> en tu archivo porque `Docs/UX/` es tuya: si estás de acuerdo, corregí el catálogo; si no,
> decilo y se revierte el código.

---

## 1. La sección `letras` no sale del frontal de *La mosca y la sopa*

**Qué dice `UX-05`.** Tres filas (casete del portal, categoría `letras` del quiz, y la
propia pantalla de completar la letra) sacan su recorte de `la-mosca-y-la-sopa-frontal.jpg`:
"el rótulo amarillo en diagonal con el nombre del disco y la mosca dibujada junto a la
firma".

**El problema.** Ese archivo **no es arte de Rocambole**. `RES-44` lo auditó como rediseño
confirmado, y el hilo principal lo verificó mirando la imagen: es una foto de recital sobre
un campo rojo con el título estampado. No están el gato momificado ni los cerdos y peces que
`RES-06` y `RES-22` documentan como el arte real de ese disco.

Tu descripción del rótulo amarillo diagonal es correcta — está en esa imagen. El asunto es
que la imagen entera es la equivocada, así que el recorte heredaba el defecto. Y como `D-21`
obliga a acreditar toda tapa a Rocambole, recortar de ahí habría significado **firmarle a
Rocambole un trabajo que no es suyo**: una afirmación falsa, de la misma familia que una
respuesta de quiz mal puesta.

**Qué se hizo en su lugar.** Los tres recortes de `letras` salen de
`la-mosca-y-la-sopa-trasera.jpg`, que **sí** es el collage real — se ve el edificio
neoclásico, el chico con la caja de cartón en la cabeza y la olla con el cucharón. El motivo
elegido es la olla, que es el objeto que le da nombre al disco y que **vos ya habías elegido**
para la pantalla de completar la letra. O sea: se extendió tu propia decisión a las otras dos
filas, en vez de inventar una nueva.

**Consecuencia que te toca a vos:** las tres filas del catálogo cambian de archivo máster, y
conviene que digan que el motivo es la contratapa.

**Consecuencia que le toca a `contenido`:** la ficha de *La mosca y la sopa* en la
Redondopedia ahora muestra la contratapa (`scripts/generar-tapas.mjs` la genera desde ahí), y
su pie debería decirlo. Queda anotado aparte.

---

## 2. El fondo de *Oktubre* va anclado abajo, no detrás de la cabecera del portal

**Qué dice `UX-05`.** La cabecera del portal (`marca-grande` + bajada) lleva de fondo velado
la franja de banderas rojas de *Oktubre*.

**El problema, y es de tu propio `UX-04`.** La marca grande se escribe en `--marca-rojo`.
Sobre tapa velada, ese rojo da **3,38:1** contra el peor caso — por debajo del 4,5:1 que vos
misma fijaste como piso en `UX-04`. Y no se arregla subiendo el velo: al 92 % sigue dando
4,10:1, y a esa altura la foto ya no se ve. O sea que la fila pedía poner una tapa justo
detrás del único texto del sitio que no puede ir encima de una.

Está verificado y quedó como test: `contraste.test.ts`, "D-21: el rojo de marca no se usa
como texto sobre tapa velada".

**Qué se hizo en su lugar.** El recorte real de banderas ocupa la franja **fija de abajo**,
que es donde `public/arte/README.md` ya ubicaba a la multitud con banderas dibujada — de
hecho la reemplaza. La cabecera queda limpia y `--marca-rojo` sigue sobre `--fondo`, que es
el par testeado. Verificado en el navegador: la caja de la marca no toca la de la banda.

**Lo que sigue en pie de tu fila:** el portal viste *Oktubre* y con ese mismo recorte. Lo
único que cambió es dónde cae.

---

## 3. Un dato tuyo que la implementación confirmó, y que conviene que anotes

Los másters son más chicos de lo que el catálogo supone. Los frontales miden **953×953** y
las traseras **1181×929**. Con eso, **ningún** recorte del catálogo llega a los 480 px de
detalle ni a los 640 px de fondo que pide `UX-04`: el más grande queda en 591 px y el más
chico —la bandera suelta de Oktubre— en **210 px**.

El script no agranda a propósito (agrandar una foto es hacerla papilla) y avisa por consola
cuál quedó corto. En pantalla se ven bien porque el destino real es chico: 34 px en el casete,
96 px en la ficha de artículo. Pero el número de `UX-04` hoy es inalcanzable con este material,
y conviene que el documento diga el techo real en vez de un objetivo que nunca se cumple.

Lo mismo con el tope de 60 KB del fondo: **ninguno lo roza**, el más pesado quedó en 53 KB.
