# UX-27 — La convención del pixel, y dónde está la frontera

> Rol dueño: `experiencia`. Ciclo 15, 2026-09-16.
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
> `.claude/rules/diseno-marca.md` (el circuito y la tabla anti-slop).
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
| **Tile** | **16 × 16** | Es el tamaño del pixel art de 8 bits de toda la vida, y es lo que la hoja que trajo el usuario ya dibuja de hecho: sus figuras miden alrededor de 24 px de alto nativos |
| **Área de juego** | **15 × 9 tiles = 240 × 144** | El ancho sale de lo que sobra en un teléfono en horizontal con dos columnas de mando y el peor caso de muescas (`UX-28 §1`). El alto sale de que la chapa del pie entre sin empujar nada |
| **Celda de personaje** | **16 × 24** (1 tile de ancho, 1,5 de alto) | La figura ocupa 14 × 22 adentro de la celda, con 1 px de aire a cada lado para que el contorno no toque el borde de la celda |
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
medido por el hilo principal el 2026-09-16) es píxel opaco, no transparencia. Eso hay que
arreglarlo al recortar, y la regla que queda escrita para siempre es esta:

- **PNG-32 con alfa binario: 0 o 255, nunca un valor intermedio.** Un píxel al 40 % de alfa
  es antialias con otro nombre, y con `pixelated` se ve como un borde sucio que nadie
  pidió. Después de recortar, el alfa se fuerza a binario con umbral en la mitad.
- **Los tiles van opacos enteros.** El alfa es de los sprites, no del terreno.
- **Nada de canal alfa para hacer sombras.** Si hace falta una sombra, es un color de la
  paleta, no una opacidad.
- **Sin perfil de color, sin metadatos.** Un PNG de sprite con perfil ICC pesa más y puede
  cambiar de color según el navegador; acá el color es el que dice la paleta.

---

## 4. La paleta acotada: 16 colores, y cuatro no se eligen

`D-41` pide "paleta acotada" y no da el número. **El número es 16 por escena**, repartidos
así, y el reparto es la mitad de la decisión:

| Franja | Cuántos | Qué son |
|---|---|---|
| Fijos | **2** | `--px-clave` (alias de `--fondo`, la tinta del sitio: es el contorno de todo) y `--px-luz` (alias de `--papel`, la luz máxima) |
| Terreno | **6** | Tres por elemento: el ancla del disco más dos escalones **más claros**. Ver `§4.1` |
| Personajes | **3 y 3** | La paridad de `D-38` convertida en número: ninguno de los dos tiene un color más que el otro |
| Objetos | **2** | La puerta y el coleccionable |

**Los 16 hex viven en `tokens.css`**, con prefijo `--px-`, y los dos fijos se declaran como
alias (`--px-clave: var(--fondo)`) para no duplicar un hex. Eso mantiene en pie lo que dice
`.claude/rules/diseno-marca.md` —un hex solo puede vivir en `tokens.css`— sin inventarle una
excepción al pixel art. El PNG es la reproducción de esa lista, no su origen.

### 4.1 La sombra más oscura de cada rampa **es la clave**

No hay un cuarto escalón oscuro. Cada rampa de terreno es: el ancla medida de la tapa, dos
escalones más claros, y la clave como sombra. Tiene tres efectos, y el tercero es el que
importa:

1. Ahorra dos colores de los 16.
2. Hace que el terreno y el contorno compartan tinta, que es cómo se ve una serigrafía de
   dos tintas y no un degradado de cuatro.
3. **Ningún color del área queda cerca de la clave.** Eso es lo que hace auditable el `§5`.

De dónde salen las dos anclas: `UX-30`. En una línea, para no obligar a abrir otro archivo:
infierno = `--disco-gulp-tinta` (#df5744), cielo = `--disco-gulp-apoyo` (#e6e4bd).

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

### 5.3 La vara corrible: la clave contra los 16

Como no puedo testear cada píxel, testeo lo mismo que `D-21` testeó del velo: **el peor
caso, acotado por construcción.**

> **Ningún color de los 16 queda por debajo de 3:1 contra `--px-clave`.**

Por qué 3:1 y no 4,5:1: no es texto, es una línea de contorno de un píxel separando dos
superficies. 3:1 es el umbral que WCAG usa para elementos gráficos y para texto grande, y es
el que corresponde acá. Y por qué el test alcanza: `§4.1` ya prohibió el escalón oscuro, así
que ningún color puede acercarse a la clave sin que el test lo cace primero.

**Dos comandos, y los corre el hilo principal o `revisor`, no yo** (`D-12`):

```
node --test src/lib/contraste.test.ts     # los 16 --px-* contra --px-clave, umbral 3:1
node scripts/auditar-paleta-pixel.mjs     # ningún PNG del área trae un color fuera de los 16
```

El segundo no existe todavía y es barato: leer los PNG de `public/arte/pixel/`, juntar los
colores distintos y fallar si aparece uno que no esté en la lista de `tokens.css`, o si hay
un píxel con alfa intermedio. **Un color de más en un PNG es el mismo defecto que un hex
suelto en un componente**, y hasta que ese script exista el área no tiene auditor.

---

## 6. Cómo se recorta la hoja que trajo el usuario

`public/arte/skayboy_poligirl.png` (1299 × 725) **es una hoja de concepto, no un atlas** y
no se usa como está. Lo que trae, medido el 2026-09-16: el fondo verde azulado es opaco, las
poses no están en grilla, cada una tiene su tamaño, y hay texto pegado adentro de la imagen
—los dos encabezados y las cuatro etiquetas.

**El orden del recorte, que es también el orden en que se pierde lo que no va:**

1. **Fuera el texto.** Los encabezados y las cuatro etiquetas no llegan a producción de
   ninguna forma. Ninguna de esas palabras se muestra nunca en el sitio (ver `§7`).
2. **Fuera el fondo.** Se saca el verde azulado por color y se fuerza el alfa a binario
   (`§3`). Ojo con los píxeles del borde: si la hoja trae halo, se recorta el halo, no se
   lo suaviza.
3. **Se mide el píxel nativo** antes de tocar nada: el bloque repetido más chico de la
   imagen. Ese es el píxel real del dibujo, y la hoja está ampliada respecto de él.
4. **Se reduce a ×1 por vecino más cercano** hasta ese píxel nativo. Nunca bilineal, nunca
   "suavizar".
5. **Recién ahí se pone en grilla**, cada pose centrada en su celda de 16 × 24, con el pie
   de la figura apoyado en el borde de abajo de la celda — el pie es lo que tiene que caer
   siempre en el mismo lugar, no el centro del cuerpo.
6. **Se ajusta a la paleta** de `§4`: cada color de la hoja se reemplaza por el más cercano
   de los 16, y si algo no entra, se cambia la paleta a propósito y se anota. No se agrega
   un color número 17 en silencio.
7. **Sale un PNG por personaje**, con sus poses en fila, a ×1, en `public/arte/pixel/`.

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

**La palabra "fedora" nunca llega al sitio**: está pegada adentro de la hoja de concepto y
el paso 1 de `§6` la recorta antes que nada. La discrepancia es interna y muere acá.

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
| Un decimoséptimo color | `§4`, y el script del `§5.3` lo caza |
| Barra de vida, marcador, cartel de nivel, cualquier texto | `§5.1` |
| Partículas, brillos, chispas de recompensa | El único grito del sitio es el acierto y ya tiene su forma (`UX-22 §1`) |
| Un tile con borde redondeado | `--radio` es para lo tocable grande. Un píxel no tiene radio |
| El par lobo/cordero como código de nada | Lo prohíbe `public/arte/README.md` desde antes y en un juego de dos personajes es lo primero a lo que va la mano |
| Emoji, ícono de librería, corazón de vida | `UX-04`, y acá encima sería de otro idioma |

---

## 10. Cómo se verifica

Comandos que dejo escritos y **corre otro** (`D-12`):

```
node --test src/lib/contraste.test.ts       # los 16 --px-* contra la clave, 3:1
node scripts/auditar-paleta-pixel.mjs       # colores fuera de paleta y alfa intermedio  (no existe todavía)
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
