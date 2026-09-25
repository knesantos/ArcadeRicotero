# UX-27 — La convención del pixel, y dónde está la frontera

> Rol dueño: `experiencia`. Ciclo 15, primera versión 2026-09-16, **enmendada el
> 2026-09-18 en `§6` (`T-229`)**: `CTR-15.2` midió la hoja con `sharp` y el resultado es
> `N = 1` — no hay píxel nativo que medir. `§6` queda reescrito para ese resultado, cierra
> `FIND-56` (la carpeta) del lado de acá y deja corregidas las dos menciones de píxel sin
> unidad que traía `§2`. Lo viejo no se borra: queda citado donde hace falta explicar qué
> cambió.
>
> **Consume:** `D-41` entero (pixel adentro, imprenta afuera — los cuatro puntos y las tres
> consecuencias), `D-42` (los muñecos tienen cara, en caricatura declarada; el tono es la
> baranda; las cabezas de perfil son retrato y no sprite), `D-38` barandas 1 y 3 (el muñeco
> nunca dice "yo"; nada narra la relación real), `D-19` (la mezcla, la base que no rota),
> `D-21` (el velo plano como mecanismo de contraste sobre imagen), `D-32` (el movimiento es
> del lugar), `D-40` (se juega solo o de a dos), `UX-04` (sistema visual, el piso de
> legibilidad, el mecanismo de crédito), `UX-22` (la imprenta: papel, registro corrido,
> rodillo, chapa), `RES-64.3` (las insignias de Skay, fichadas), `RES-64.5` (la SG roja),
> `RES-64.7` (qué decidía Poli), `IDEA-14` (la ficha entera, sobre todo "el choque
> principal: el arte, y un hueco de propiedad"), `public/arte/README.md` (el contrato del
> collage, que a partir de acá deja de ser el único), `public/arte/ensayo/README.md` (los
> tres hallazgos del 2026-09-11), `src/styles/tokens.css` (leído: las diez paletas de
> disco, `--papel`, `--velo-tapa`, `--textura-grano`, `--toque-min`, `--radio`),
> `.claude/rules/diseno-marca.md` (el circuito y la tabla anti-slop). **Sumado en la
> enmienda del 2026-09-18:** `CTR-15.1`, `CTR-15.2` y `CTR-15.5` (la hoja medida con
> `sharp`, el desenlace `N = 1` y la carpeta), `Docs/REVISIONES/REV-14-ciclo-15.md`
> (`FIND-56`, `FIND-68`), `ORQ-plan-ciclo-15.md §1.1` y `§3` fila `T-229`.
>
> **Resuelve:** la consecuencia 1 de `D-41` (escribir la convención del pixel al lado de la
> del recorte y decir cuál rige dónde) y su consecuencia 3 (el contraste adentro del área,
> que hoy no tiene vara). Cierra el punto 1 de "A resolver antes de promoverla" de
> `IDEA-14` en lo que era mío: la convención. **No** cierra quién dibuja los niveles — eso
> sigue sin dueño y lo nombro al final.
>
> El texto listo para pegar en `public/arte/README.md` —que no es mi carpeta— está en
> `Docs/SUGERENCIAS/UX-para-hilo-principal-readme-del-pixel.md`. Lo pega el hilo principal.

---

## 1. La frontera, dibujada en palabras

`D-41` la nombró y dejó el dibujo pendiente: *"el área de juego es un recorte con borde, no
un canvas a sangre"*. Esto es el dibujo.

La metáfora manda y es de `D-41`: **un fichín son dos objetos pegados.** El tubo muestra
píxeles; el mueble está serigrafiado y despintado. Acá el tubo es el área de juego y el
mueble es todo lo demás.

### 1.1 Las tres capas del borde, de afuera hacia adentro

| # | Capa | Qué es | Medida |
|---|---|---|---|
| 1 | **La chapa** | `--papel`, la misma tinta de etiqueta de casete que ya usa el collage (`UX-22 §2.2`). Es el mueble. Lleva el borde de tijera y el registro corrido de `UX-22 §8` | 4 px CSS arriba y a los costados · **24 px abajo** |
| 2 | **El bisel** | Una línea plana de `--fondo` — la clave, la tinta del sitio entero — entre la chapa y el área. Es el marco del tubo, y es **la línea que se ve** cuando alguien pregunta dónde termina un idioma y empieza el otro | 4 px CSS, los cuatro lados |
| 3 | **El área** | Pixel art. Nada más | 480 × 288 px CSS (ver `§2`) |

> **Enmendado el 2026-09-23, respuesta a `Docs/SUGERENCIAS/HILO-para-experiencia-lo-que-la-paleta-del-pixel-no-decide.md §2`: de qué tinta es el aire del área, y de cuál el sólido.** Ningún documento lo decía y hacía falta para que el bisel siguiera siendo la línea que se ve. **Decisión: `β` — el aire es `--px-luz`, el sólido es `--px-clave`.** El motivo que pesa es justo este punto 2: con `α` (aire = clave) el bisel (`--px-clave`) queda contra un aire del mismo color — contraste 1,00:1, se funde y `§1.1` pierde la línea de frontera que esta sección declara imprescindible. Con `β` el bisel queda a 14,94:1 contra el aire, la lectura que este documento pide. Las otras dos filas de la tabla del traspaso confirman la elección y no la contradicen: el sombrero de Skayboy pierde separación de tinta contra el aire (1,24:1) pero mantiene el contorno obligatorio de `§5.2`, que es el mecanismo con el que este documento ya resuelve todo lo que no se distingue por tinta; y `UX-31 §5`, escrito el mismo día con `CTR-16.10.8`, ya da por sentado que el sólido comparte familia con la compuerta cerrada (`--px-clave`, "la misma familia que un sólido") — es decir, ya estaba escrito para `β` sin que nadie lo hubiera declarado con nombre. Queda así: **`--px-clave` es el sólido del área — paredes, piso, y el sólido `#` de la grilla. `--px-luz` es el aire — todo lo que no es sólido, terreno pintado ni sprite.**

**La chapa de abajo es más ancha porque ahí vive el pie de homenaje de `D-42`**, en registro
3, que pasó de conveniente a obligatorio. No es un pie de página que se cae abajo de todo:
es la placa atornillada al mueble, que es donde un fichín de verdad dice quién lo fabricó.
Lo redacta `contenido`; la medida la fijo yo acá para que entre sin empujar el área.

### 1.2 Las cuatro cosas que hacen visible la frontera

1. **El grano se corta en el bisel.** `--textura-grano` cubre todo el sitio y **no entra al
   área**. Afuera hay ruido de serigrafía; adentro el único ruido es el trama del propio
   dibujo. Ese corte es la señal más barata y la más clara.
2. **El área es el único recorte del sitio que no se pega torcido.** Todo lo demás lleva
   rotación leve (`sitio.css` ya tiene sus `rotate(-1.6deg)` y compañía) y `UX-22 §8` le
   suma el eco de segunda tinta. Acá no: **un pixel art rotado deja de ser pixel art**, se
   le ensucian los bordes y se vuelve un archivo mal escalado. La imperfección vive en la
   chapa —borde de tijera, registro corrido del rótulo, rodillo— y el tubo queda derecho.
   Un mueble despintado con el tubo derecho es exactamente cómo se ve un fichín viejo.
3. **Ningún sprite sale del área y ningún sello de goma entra.** Es el punto 4 de `D-41`
   sin matices: la chapa no lleva un ícono pixelado, el área no lleva un rótulo de imprenta.
   **La mosca no vuela por encima del área** — es lo único vivo del sitio (`D-32`) y sigue
   viva afuera.
4. **Adentro no hay texto.** Ni uno. Ver `§5`: es la mitad del mecanismo de contraste.

### 1.3 Qué vive de cada lado

| Adentro (pixel) | Afuera (imprenta, `UX-22`) |
|---|---|
| Tiles de cielo y de infierno, la puerta, el coleccionable | El marco, la chapa y el pie de homenaje |
| Los dos personajes y sus poses | Las dos columnas de mando y sus teclas (`UX-28`) |
| La entrada por donde se vuelve al fallar (`UX-29`) | El título del juego, el reloj, la tarjeta al compartir |
| El dither, el contorno, la grilla visible | El grano, el rodillo, los sellos de goma, la rotación |

---

## 2. La grilla, con números

**La unidad es el tile lógico, no el píxel de CSS.** Todo lo de abajo está en píxeles
lógicos salvo donde diga CSS.

| Cosa | Medida | Por qué ese número |
|---|---|---|
| **Tile** | **16 × 16 nativos** | Es el tamaño del pixel art de 8 bits de toda la vida, y es lo que la hoja que trajo el usuario ya dibuja de hecho: sus figuras miden alrededor de 24 px de alto nativos |
| **Área de juego** | **15 × 9 tiles = 240 × 144 nativos** | El ancho sale de lo que sobra en un teléfono en horizontal con dos columnas de mando y el peor caso de muescas (`UX-28 §1`). El alto sale de que la chapa del pie entre sin empujar nada |
| **Celda de personaje** | **16 × 24 nativos** (1 tile de ancho, 1,5 de alto) | La figura ocupa 14 × 22 nativos adentro de la celda, con 1 px nativo de aire a cada lado para que el contorno no toque el borde de la celda |
| **Escala en teléfono** | **×2** | El personaje queda en **32 × 48 px CSS**. `IDEA-14` pedía "legible a 32 px" y el ensayo del 2026-09-11 midió que "a 48 px las dos se leen". Los dos números caen adentro de esta celda, y no lo busqué: salió |
| **Escala en escritorio** | ×3 o ×4, el mayor entero que entre | `UX-10`. Nunca ×2,5 |

### 2.1 La regla del escalado, que no se negocia

- **`image-rendering: pixelated`** en el área y en cualquier `<img>` de pixel art.
- **Múltiplos enteros y nada más.** Ni `transform: scale(1.5)`, ni `background-size:
  cover`, ni `width: 100%` sobre un PNG de sprite. Un píxel de 16 tiene que medir 32 px CSS
  exactos, o mide 16, o mide 48.
- **El archivo se entrega a ×1.** No se guarda un PNG ya agrandado: agrandar es trabajo del
  navegador y guardarlo agrandado multiplica el peso por cuatro sin agregar información.
- **El área no crece con la pantalla.** Tiene tamaño fijo por escala. Lo que crece cuando
  hay más lugar son las columnas de mando y el aire alrededor (`UX-28 §1.3`). Si el área
  creciera libre habría que elegir entre romper la grilla y recortar el nivel, y las dos
  opciones son peores que dejar aire.

---

## 3. El alfa y el formato

La hoja que trajo el usuario tiene el alfa lleno: el verde azulado del fondo (~`#186877`,
medido por el hilo principal el 2026-09-16) es píxel opaco, no transparencia. La regla de
producción no cambia aunque el circuito que la cumple sí cambió (`§6`): sale de la hoja
como referencia y no como fuente, así que el alfa nunca hereda su fondo opaco. La regla que
queda escrita para siempre es esta:

- **PNG-32 con alfa binario: 0 o 255, nunca un valor intermedio.** Un píxel al 40 % de alfa
  es antialias con otro nombre, y con `pixelated` se ve como un borde sucio que nadie
  pidió. Con el circuito de `§6`, el binario sale solo: la celda nace transparente y el
  fondo nunca se dibuja, así que no hay alfa intermedio que forzar después.
- **Los tiles van opacos enteros.** El alfa es de los sprites, no del terreno.
- **Nada de canal alfa para hacer sombras.** Si hace falta una sombra, es un color de la
  paleta, no una opacidad.
- **Sin perfil de color, sin metadatos.** Un PNG de sprite con perfil ICC pesa más y puede
  cambiar de color según el navegador; acá el color es el que dice la paleta.

---

## 4. La paleta acotada: 15 colores, y cuatro no se eligen

> **Enmendado el 2026-09-23: el número bajó de 16 a 15.** `D-41` pedía "paleta acotada" y
> no daba el número; la primera versión de este documento fijó 16. `§4.1.2` le sacó su
> tinta propia a la puerta (la franja de Objetos pasa de 2 a 1) y esa ranura se usa entera
> para separar `--px-poli-2` de `--px-skay-2` (`§4.1.1`), no para agregar una tinta nueva:
> el total real es **15**, y de acá para abajo cada mención suelta queda corregida a ese
> número.

`D-41` pide "paleta acotada" y no da el número. **El número es 15 para toda el área, no 15
por escena**: no hay paleta por nivel ni por atlas, y el nivel 2 no declara otras quince
(`CTR-15.4`, `FIND-68`). Se reparten así, y el reparto es la mitad de la decisión:

| Franja | Cuántos | Qué son |
|---|---|---|
| Fijos | **2** | `--px-clave` (alias de `--fondo`, la tinta del sitio: es el contorno de todo, y desde la enmienda de `§1.1` es también el **sólido** del área) y `--px-luz` (alias de `--papel`; ya no es "la luz máxima" — ver la enmienda de abajo — y es el **aire** del área) |
| Terreno | **6** | Tres por elemento: el ancla del disco más dos escalones **más claros**. Ver `§4.1` |
| Personajes | **3 y 3** | La paridad de `D-38` convertida en número: ninguno de los dos tiene un color más que el otro. Enmendado en `§4.1.1`: `--px-skay-2` y `--px-poli-2` dejan de ser casi duplicados |
| Objetos | **1** | *(Enmendado el 2026-09-23, `§4.1.2`)* El coleccionable. La puerta deja de tener tinta propia |

> **Enmendado el 2026-09-23: `--px-luz` no puede seguir siendo "la luz máxima", respuesta a `HILO-para-experiencia-lo-que-la-paleta-del-pixel-no-decide.md §1`.** La crema de *Gulp!* (`#e6e4bd`, el ancla del cielo) está a 1,024:1 del papel (`#ede4ce`) — casi el mismo gris, 226 contra 228 — y entre las dos no entran los dos escalones más claros que `§4.1` exige. **Se toma la salida 1, la única medida:** la luz máxima real del área es el blanco medido de *Gulp!* (`--px-blanco-gulp`, `#ffffff`, `RES-37`), y ahí termina la rampa del cielo (ver `§4.1`). `--px-luz` (el papel, `#ede4ce`) se queda en la paleta —sigue siendo uno de los dos fijos, sigue siendo el **aire** del área (`§1.1`)— pero pasa a ser un **casi duplicado declarado** del ancla del cielo (1,024:1, ΔE00 6,7 contra `--disco-gulp-apoyo`), no la cima de ninguna rampa. Cielo e infierno se siguen distinguiendo en gris, 1,92:1, ΔL* 22,5 — eso no lo mueve esta enmienda.

**Los 15 hex viven en `tokens.css`**, con prefijo `--px-`, y los dos fijos se declaran como
alias (`--px-clave: var(--fondo)`) para no duplicar un hex. Eso mantiene en pie lo que dice
`.claude/rules/diseno-marca.md` —un hex solo puede vivir en `tokens.css`— sin inventarle una
excepción al pixel art. El PNG es la reproducción de esa lista, no su origen.

### 4.1 La sombra más oscura de cada rampa **es la clave**

No hay un cuarto escalón oscuro. Cada rampa de terreno es: el ancla medida de la tapa, dos
escalones más claros, y la clave como sombra. Tiene tres efectos, y el tercero es el que
importa:

1. Ahorra dos colores de los 15.
2. Hace que el terreno y el contorno compartan tinta, que es cómo se ve una serigrafía de
   dos tintas y no un degradado de cuatro.
3. **Ningún color del área queda cerca de la clave.** Eso es lo que hace auditable el `§5`.

De dónde salen las dos anclas: `UX-30`. En una línea, para no obligar a abrir otro archivo:
infierno = `--disco-gulp-tinta` (#df5744), cielo = `--disco-gulp-apoyo` (#e6e4bd).

> **Enmendado el 2026-09-23: la rampa del cielo ya no sube hacia `--px-luz`.** Con la luz máxima
> corregida (arriba), los dos escalones más claros del cielo son **crema al 50 % sobre el
> blanco de *Gulp!*** (`#f3f2de`) y **el blanco de *Gulp!*** (`--px-blanco-gulp`, `#ffffff`).
> La rampa completa del cielo: `--disco-gulp-apoyo` (#e6e4bd, ancla) → `#f3f2de` → `#ffffff`.
> La rampa del infierno no cambia: su ancla (#df5744) está lejos del papel y nunca chocó con
> la luz. Los 6 colores de terreno siguen siendo 6 — `--px-blanco-gulp` ocupa el lugar que
> antes hubiera sido un segundo casi-duplicado de `--px-luz`, no una tinta nueva de más.

### 4.1.1 Las pieles gemelas: se libera la ranura

`--px-skay-2` y `--px-poli-2` estaban a ΔE00 0,79 — la hoja les daba la misma piel, y a ese
nivel de parecido en un personaje de 14 px son el mismo color con otro nombre. **Se libera la
ranura.** El cupo que se gana en `§4.1.2` (la puerta deja de pedir tinta propia) es lo que
permite que `--px-poli-2` deje de derivarse del mismo cálculo que `--px-skay-2` y reciba un
hex propio, medible, sin que el área pase de 15 colores. La paridad de conteo no se toca —
sigue siendo 3 y 3 — lo que cambia es que las tres de cada uno dejan de tener un casi
duplicado entre sí. El hex exacto es de quien produce la paleta (`§4`, "el PNG es la
reproducción de esa lista, no su origen"); lo que fija acá es que la ranura **se usa**, no
que se descarta.

### 4.1.2 La puerta deja de tener tinta propia

`--disco-lobo-suelto-apoyo` vestía un disco que el contenido de este juego no nombra
(`UX-30 §2`, la regla de que un disco solo viste lo que el contenido hereda) y la propuesta
de `T-268` la reemplazaba por un hex elegido sin disco (`#b9549b`). **Se descartan las dos.**
La puerta se dibuja **por forma, con `--px-clave` y `--px-luz`** — el mismo tratamiento que
`CTR-16.10.8` ya le fija a la palanca, la placa, la compuerta y la caja, y por el mismo
motivo: es una pieza que la paridad de `BR-23` exige sin un `de` que la vuelva "de uno de los
dos" (`CTR-16.4`: `"tipo": "puerta"` con `"de": "skayboy"` o `"de": "poligirl"` ya declara el
dueño en el **dato**; pintarla además con una tinta propia sería el mismo dato dicho dos
veces, uno de los cuales sobra). La cima abierta de la puerta contra el marco cerrado se lee
por **forma**, no por color, igual que el resto del área (`§5.2`). Esto libera la ranura de
`Objetos` (de 2 a 1: queda solo el coleccionable) y es lo que financia `§4.1.1`.

### 4.2 Lo que la paleta le prohíbe a los personajes

- **El pelo de Poligirl no es la clave.** Es un negro azulado un escalón por encima. Si el
  pelo fuera la tinta del contorno, el contorno dejaría de separarla del terreno y la figura
  se empastaría — que es, textual, el hallazgo 3 del ensayo del 2026-09-11 (*"la mata de
  pelo de Poligirl se empasta más"*). La regla de contorno de `§5` lo arregla en el dibujo,
  no en el tamaño, que es lo que ese ensayo pedía.
- **La camisa psicodélica de la hoja se resuelve con dither, no con colores nuevos.** A 14
  px de ancho el torso son ocho píxeles: una estampa de dos colores alternados lee como
  estampado, y siete colores leen como suciedad. La psicodelia entra por el trama, no por la
  cantidad.
- **Ni `--acento-3` ni `--acento-4` entran al área.** El verde de acierto y el rojo de error
  son información de juego del sitio entero y no se disfrazan de terreno (`D-19`, tercera
  regla). Y hay una colisión concreta que conviene ver antes de que muerda: el rojo del
  infierno (#df5744) y el rojo de error (#ff4b4b) son dos rojos parecidos. Adentro del área,
  **el rojo es un lugar, nunca un estado**.

---

## 5. El contraste sobre superficie dibujada — el mecanismo que debía `D-41`

El problema, tal como lo dejó `D-41` consecuencia 3: `contraste.test.ts` mide pares
declarados en CSS, y adentro del área el fondo es un tileset que cambia píxel a píxel.
`D-21` resolvió el mismo problema para las tapas acotando el **peor caso** con un velo
plano. Acá no hace falta velo, porque hay algo que una foto no tiene: **la superficie es
dibujada, así que el conjunto de fondos posibles es finito y lo declaro yo.**

El mecanismo es de tres partes y las tres son condiciones, no recomendaciones.

### 5.1 Adentro del área no hay texto. Ninguno.

Ni rótulos, ni contador, ni nombre de personaje, ni cartel de nivel, ni el reloj. Todo lo
que se lee vive afuera, sobre `--fondo` o sobre `--papel`, con los pares que
`contraste.test.ts` ya testea. Esto borra de un saque el 90 % del problema: si no hay texto
sobre el tileset, no hay contraste de texto que medir.

Es además la lectura literal de `D-41` punto 4 —los dos idiomas no se mezclan en la misma
pieza— y la única forma de que el área no termine con una barra de vida y un marcador
encima, que es la interfaz por defecto de cualquier plataformas de plantilla.

### 5.2 Lo que sí tiene que distinguirse adentro se distingue por contorno, no por color

**Todo sprite y todo borde de tile lleva contorno de 1 px lógico en la clave.** Sin
excepción: personajes, puerta, coleccionable, el borde superior de cada plataforma.

Es la misma doctrina que `estilos.test.ts` ya hace cumplir afuera —ningún estado se comunica
solo con color— aplicada adentro, y es lo que contesta el hallazgo 2 del ensayo (*"sobre el
piso claro la figura casi desaparece… o las figuras llevan contorno, o los dos terrenos no
pueden ser los dos claros"*). **Llevan contorno**, y por eso los dos terrenos sí pueden
convivir.

### 5.3 La vara corrible: la clave contra los 15

Como no puedo testear cada píxel, testeo lo mismo que `D-21` testeó del velo: **el peor
caso, acotado por construcción.**

> **Ningún color de los 15 queda por debajo de 3:1 contra `--px-clave`.**

Por qué 3:1 y no 4,5:1: no es texto, es una línea de contorno de un píxel separando dos
superficies. 3:1 es el umbral que WCAG usa para elementos gráficos y para texto grande, y es
el que corresponde acá. Y por qué el test alcanza: `§4.1` ya prohibió el escalón oscuro, así
que ningún color puede acercarse a la clave sin que el test lo cace primero.

**Dos comandos, y los corre el hilo principal o `revisor`, no yo** (`D-12`):

```
node --test src/lib/contraste.test.ts     # los 15 --px-* contra --px-clave, umbral 3:1
node scripts/auditar-paleta-pixel.mjs     # ningún PNG del área trae un color fuera de los 15
```

El segundo no existe todavía y es barato: leer los PNG de `public/sprites/`, juntar los
colores distintos y fallar si aparece uno que no esté en la lista de `tokens.css`, o si hay
un píxel con alfa intermedio. **Un color de más en un PNG es el mismo defecto que un hex
suelto en un componente**, y hasta que ese script exista el área no tiene auditor.

---

## 6. Cómo se produce el sprite: ya no es un recorte, es un dibujo nuevo con la hoja al lado

> **Enmendado el 2026-09-18 (`T-229`, ciclo 15, cierra `FIND-56` y responde a `REV-14`).**
> Esta sección medía un píxel nativo y cuantizaba la pieza a partir de él, como si la hoja
> estuviera ampliada de forma pareja sobre una grilla real. **Eso dejó de ser cierto:**
> `CTR-15.2` corrió el comando con `sharp` sobre `public/arte/skayboy_poligirl.png` y el
> resultado es **`N = 1`** — no hay ningún módulo que se repita. No es que el píxel nativo
> sea difícil de medir: **no existe.** La versión de abajo es el circuito que sí se puede
> correr con ese resultado adentro, y de paso quedan corregidas las dos líneas que todavía
> nombraban la carpeta vieja: la que manda ahora, la única, es `public/sprites/`
> (`CTR-15.5`, `FIND-56`).

`public/arte/skayboy_poligirl.png` (1299 × 725) **es una hoja de concepto, no un atlas.**
Lo que trae, medido con `sharp` el 2026-09-16 (`CTR-15.2`, `ORQ-plan-ciclo-15.md §1.1`): el
fondo verde azulado es opaco —el alfa está lleno, no es transparencia— **y no es un solo
color**: un bloque liso de 40 × 40 trae 52 tintas alrededor de `rgb(23,110,119)`, la hoja
entera tiene 108.705 colores, y con tolerancia de color cambian 1221 de 1298 columnas y 679
de 724 filas repartidas parejo en todas las fases de grilla probadas (`N` = 2 a 16). **La
hoja tiene estética de píxel; no está dibujada sobre una grilla de píxel.** Sumado a que los
rótulos y sus flechas puentean los sprites —la banda del personaje masculino sale como una
sola pieza de 1072 px, y enmascarar el crema de las cajas no mejoró nada (`CTR-15.1`)—, el
recorte automático no es una opción hoy. Lo que sigue no separa: **dibuja de nuevo, usando
la hoja como modelo de pose, insignia y tono** (`CTR-15.2`), nunca como fuente de píxeles.

**Nada de esto es transparencia mal leída.** El verde azulado del fondo tiene alfa 255 en
todo el lienzo: si se carga la hoja tal cual, cada figura llega adentro de un rectángulo
opaco. Separar el fondo por eso no alcanza — es justo el problema que resuelve `§6.2` más
abajo.

### 6.1 Los siete pasos, corribles con lo que hay

1. **Recorte grueso, a mano, por pose.** No hay tijera automática que separe una figura de
   sus rótulos y flechas: se recorta a mano un rectángulo generoso alrededor de cada pose,
   fondo incluido. Este recorte **no es el sprite**, es la lámina de trabajo del paso 4 —y
   es también el punto donde quedan afuera los dos encabezados y las cuatro etiquetas de la
   hoja: ninguna de esas palabras se dibuja de nuevo en el paso 4, así que ninguna llega a
   producción (ver `§7` y `§8.1`).
2. **Una máscara de fondo por umbral de tolerancia, y se usa una sola vez, para mirar — no
   para producir.** El fondo no es un color exacto: es un halo de tintas alrededor de
   `rgb(23,110,119)`, sobre un lienzo con el alfa lleno. Un umbral de distancia de color al
   verde azulado separa "probablemente fondo" de "probablemente tinta" y da un contorno
   aproximado de la figura, rápido de mirar sin ir píxel por píxel. **Esa máscara no se
   guarda ni se usa como alfa de producción**: con tolerancia aparecen píxeles a medio
   camino —halos—, que es exactamente lo que `§3` prohíbe (alfa binario, 0 o 255, nunca un
   valor intermedio). Sirve para ver la silueta un momento; se descarta después.
3. **No hay píxel nativo que medir, y no se busca uno.** La versión anterior de este paso
   decía "medí el bloque repetido más chico de la imagen": ese bloque no existe (`N = 1`,
   `CTR-15.2`). El tamaño de destino no se descubre mirando la hoja: **ya está decidido**,
   es la celda de **16 × 24 px nativos** de `§2`, fija de antemano y la misma para los dos
   personajes.
4. **Se redibuja la pose adentro de la celda, píxel por píxel.** Con el recorte del paso 1
   y la máscara del paso 2 al lado como referencia de silueta, postura e insignia —nunca
   como fuente de píxeles—, se dibuja de nuevo, del tamaño final, con las 15 tintas de
   `§4`. No hay un paso posterior de "buscar el color más cercano" porque nunca se parte de
   un color fuera de esa lista: se dibuja directamente con ellas. **Esto es dibujo, no un
   paso técnico, y tiene dueño** (`CTR-15.2`): cuesta lo que cuesta dibujar una figura de 14
   × 22 px nativos, no lo que cuesta correr un script.
5. **El alfa nace binario porque el fondo nunca se dibuja.** No hay nada que "sacar": la
   celda arranca transparente y se queda así salvo donde hay tinta. Es la misma regla de
   `§3` mirada del lado de adentro: no hace falta un paso de recorte de fondo si el fondo
   nunca existió en el archivo nuevo.
6. **El pie ancla la celda.** Centrado en el ancho, apoyado en el borde de abajo — es lo
   que tiene que caer siempre en el mismo lugar, no el centro del cuerpo, igual para las dos
   figuras.
7. **Sale un PNG por personaje**, con sus poses redibujadas en fila, a ×1, sin escalar, en
   **`public/sprites/`** — fuera de `public/arte/`, porque una subcarpeta adentro de la casa
   del collage es la pieza compartida que `D-41` punto 4 prohíbe (`CTR-15.5`, `FIND-56`).

### 6.2 Qué se pierde en el camino, y por qué se acepta igual

- **La hoja deja de ser la fuente de los píxeles.** Pasa a ser referencia de pose, insignia
  y tono (`CTR-15.2`) —que es muchísimo, y es lo caro del trabajo— pero ningún píxel del
  sprite final sale de copiar un píxel de la hoja. Si el usuario reexporta la hoja sobre una
  grilla real, este circuito se cae solo y vuelve a haber un recorte mecánico (`CTR-15.1`).
- **El detalle fino del dibujo original no entra.** La hoja tiene degradados y bordes
  suavizados que una celda de 16 × 24 nativos con 15 tintas no puede sostener: lo que se
  traduce a este tamaño es la forma, no la textura. Donde la hoja pedía una estampa
  psicodélica en la camisa, `§4.2` ya resolvió que entra por dither, no por copiar el
  degradado.
- **La silueta es una interpretación, no una copia exacta.** Redibujar a mano sobre una
  celda fija no reproduce la hoja píxel por píxel: reproduce lo que se lee de ella a ese
  tamaño. Es el mismo motivo por el que `§10` audita "que la silueta se lea igual de bien…
  tapando el color" en vez de comparar contra la hoja pixel a pixel — no hay con qué
  comparar.
- **Esto deja de correrse solo.** Es dibujo, cuesta lo que cuesta dibujar, y no hay script
  que lo repita si algo cambia: una pose nueva o una corrección de paleta se vuelve a
  dibujar a mano. Es el mismo aviso que ya dejó `CTR-15.2`: *"no es un paso técnico, es
  dibujo, y tiene dueño."*

Lo único de la hoja que **no** pasa por este circuito son las dos cabezas de perfil: son
retrato, no sprite (`D-42` precisión 3), y **no entran a producción en este ciclo**. No hay
ninguna pantalla que las necesite: la chapa lleva texto, no caras.

---

## 7. El inventario: lo que la hoja trae y lo que falta

| Pose | ¿Está en la hoja? | Qué hago con ella |
|---|---|---|
| Quieto de frente 3/4 | Sí, los dos | **Es la pose de esperar** (`UX-28 §4`): el personaje que no tiene un dedo encima mira a cámara |
| Quieto de perfil | Sí, los dos | Es la pose de estar en juego, quieto. Mira hacia donde va a ir |
| Quieto mirando a la derecha | Sí, los dos | Espejado da el otro lado. No se dibujan los dos lados |
| Corriendo | Sí, un cuadro | **Falta el ciclo.** Un cuadro solo no camina: hacen falta 4 (contacto, paso, contacto, paso) o el personaje patina |
| Saltando | Sí, los dos | Entra tal cual |
| Cayendo | Sí, los dos, **y no son equivalentes** | Ver abajo. La de Skayboy no entra |
| Empujando / arrastrando | No | Hace falta si el nivel tiene una palanca o una caja. Lo decide el diseño de nivel, que sigue sin dueño |
| Muerte | **No, y es una suerte** | No se dibuja nunca. `UX-29` |
| Cabezas de perfil | Sí | Retrato, no sprite. Fuera de este ciclo |
| Guitarra suelta | Sí | **No va en el sprite jugable.** Ver `§8.2` |

**La pose de caída de Skayboy no entra a producción.** En la hoja está dibujado invertido,
con el sombrero abajo y los pies arriba; la de Poligirl está derecha, con los brazos
abiertos. Dos motivos y ninguno es de gusto:

1. **Un señor de 74 años dado vuelta en el aire es ridiculizante**, y `D-42` puso el tono
   como la baranda que reemplaza a la de la insignia: *"lo que no puede ser, nunca, es
   denigrante, ridiculizante ni sexualizado"*. La caída invertida es la única pieza de la
   hoja que toca ese borde.
2. **Rompe la paridad.** Uno cae con dignidad y el otro da una voltereta. `D-38` consecuencia
   2 y la sección 2 de `HILO-para-experiencia-skayboy-y-poligirl.md` piden paridad de peso,
   de pantalla y de agencia; la dignidad al caer es agencia.

**Se redibuja la caída de Skayboy con el molde de la de Poligirl**: derecho, brazos
abiertos. Es un cuadro, y es el cambio más barato de toda la lista.

---

## 8. Las insignias, y la discrepancia del sombrero

### 8.1 Fedora contra Panamá: manda la ficha, y cuesta un color

La hoja rotula *"Sombrero Fedora"* y dibuja un sombrero marrón de fieltro con cinta de
colores. `RES-64.3` fichó, con dos fuentes, un **sombrero Panamá beige**.

**Se queda el Panamá, y no se redibuja el sprite.** A 16 px de ancho la diferencia legible
entre un Panamá y un fedora no es la copa: **es el color**. Un Panamá es paja clara con
cinta oscura; el de la hoja es fieltro oscuro con cinta clara. Entonces la corrección es un
cambio de dos colores de la paleta, no un dibujo nuevo: la copa se va al beige de paja, la
cinta se va a la clave.

Y de paso arregla algo que necesito para otra cosa: **un sombrero claro le da a Skayboy la
silueta que se lee sobre el terreno oscuro**, que es la mitad del criterio de reparto de
`UX-30 §3`.

**La palabra "fedora" nunca llega al sitio**: está pegada adentro de la hoja de concepto,
que desde `§6` es solo referencia y nunca la fuente de los píxeles — el sprite de
producción se redibuja entero en el paso 4 y no copia texto de ningún lado. La discrepancia
es interna y muere acá.

### 8.2 Ni la guitarra ni ningún objeto en la mano

La hoja trae una guitarra suelta al lado de Skayboy y **nada equivalente del lado de
Poligirl**. Tres razones para que ningún objeto vaya en el sprite jugable:

1. **Paridad.** Un personaje con objeto y el otro sin objeto es exactamente el defecto que
   la sección 2 del traspaso nombra: *"que sean distintos es la mecánica; que uno valga
   menos es el defecto"*. Y el objeto de Poligirl no existe: el llavero que propuso el
   ensayo **no está fichado** y el propio ensayo lo dice.
2. **Legibilidad.** Una guitarra cruzada sobre un cuerpo de 14 px rompe la silueta, que es
   lo único que identifica a la figura en miniatura.
3. **Tono.** Un tipo corriendo y saltando con la guitarra colgada es una imagen de comedia,
   y el tono es la baranda (`D-42`).

**Dónde sí va la guitarra:** afuera, en la chapa, como sello impreso junto al pie de
homenaje. Ahí es insignia —lo que `RES-64.5` ficha como suyo— y no utilería. Y ahí la
paridad se resuelve con un segundo sello del mismo tamaño, que es lo que le pido a
`investigador` en `Docs/SUGERENCIAS/UX-para-investigador-sombrero-y-insignias.md`: **qué
objeto de Carmen Castro está fichado**, para no inventarle uno.

### 8.3 Lo que el sprite no hace, nunca

Sale de `D-38` barandas 1 y 3, que `D-42` dejó intactas:

- **No habla.** Sin bocadillo, sin cartel en primera persona, sin frase con firma. Puede
  gruñir; no puede opinar. Un sprite que corre y salta no es ventriloquia — un sprite con un
  globo de diálogo sí.
- **No se toca con el otro de manera que cuente algo.** Que uno le haga de escalón al otro
  es mecánica. Un abrazo, un beso, una pelea, un empujón, uno abandonando al otro: eso narra
  la vida real de tres personas y está prohibido por `D-38` baranda 3.
- **No hay un tercer personaje.** Ni de espaldas, ni de sombra, ni como estatua del fondo.

---

## 9. Lo que queda prohibido adentro del área

Es la tabla anti-slop de `.claude/rules/diseno-marca.md` traducida al otro idioma. No la
contradice: la misma regla, dicha para pixel art.

| Prohibido adentro | Por qué, y qué va en su lugar |
|---|---|
| Degradado de píxeles hecho a mano para simular un fundido | Es el aerógrafo con otro nombre, el mismo que veta `D-34`. Va **dither**: trama regular de dos colores de la paleta |
| Glow, resplandor, halo alrededor de una figura | Contorno de clave (`§5.2`) |
| Sombra difusa debajo del personaje | Una sombra de un color plano de la paleta, o nada |
| Escalado no entero, o `pixelated` ausente | `§2.1` |
| Un decimosexto color | `§4`, y el script del `§5.3` lo caza |
| Barra de vida, marcador, cartel de nivel, cualquier texto | `§5.1` |
| Partículas, brillos, chispas de recompensa | El único grito del sitio es el acierto y ya tiene su forma (`UX-22 §1`) |
| Un tile con borde redondeado | `--radio` es para lo tocable grande. Un píxel no tiene radio |
| El par lobo/cordero como código de nada | Lo prohíbe `public/arte/README.md` desde antes y en un juego de dos personajes es lo primero a lo que va la mano |
| Emoji, ícono de librería, corazón de vida | `UX-04`, y acá encima sería de otro idioma |

---

## 10. Cómo se verifica

Comandos que dejo escritos y **corre otro** (`D-12`):

```
node --test src/lib/contraste.test.ts       # los 15 --px-* contra la clave, 3:1
node scripts/auditar-paleta-pixel.mjs       # escanea public/sprites/: color fuera de paleta y alfa intermedio  (no existe todavía)
node --test src/lib/estilos.test.ts         # que el área no se comunique solo con color
npm test                                    # todo lo demás
```

Lo que **no** se puede auditar a máquina y lo mira el ojo de quien revisa, con este
documento de vara:

1. Que el grano se corte en el bisel y no se filtre adentro.
2. Que el área esté derecha y la chapa torcida, y no al revés.
3. Que la silueta de los dos se lea igual de bien a 32 × 48 px CSS, tapando el color.
4. Que ningún sprite lleve algo en la mano.

---

## 11. Lo que este documento no cierra, con nombre

- **Quién dibuja los niveles y los sprites.** `IDEA-14` punto 1 dice que el bloqueo es la
  convención *o* el dueño. **Yo cierro la convención; el dueño sigue sin existir.** De los
  siete roles ninguno produce arte, y eso lo resuelve el hilo principal en `Docs/EQUIPO.md`
  o lo resuelve el usuario produciendo, como ya hizo con esta hoja.
- **Con qué se rasteriza.** El ensayo midió que `sharp` no puede (librsvg no implementa
  `feDisplacementMap`). **Para el pixel art el problema desaparece**: no hay filtros SVG,
  son PNG dibujados a mano. El circuito de rasterizado solo hace falta si alguna pieza del
  área naciera como SVG, y con esta convención ninguna nace así.
- **El motor.** De `arquitectura` (`RES-62` ya sirvió el orden). Lo único que le pido está
  en `Docs/SUGERENCIAS/UX-para-arquitectura-el-area-de-juego.md`.
