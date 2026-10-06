# El despiece: qué recortar de cada tapa y dónde se pega

> Guía para producir los recortes del collage. Cada pieza que está **fichada** sale de
> un elemento confirmado de esa tapa (`RES-06`, `RES-20`, `RES-22`); las **genéricas**
> son iconografía revolucionaria/popular suelta, habilitada por `UX-04`, que se dibuja
> nueva. Regla madre de `UX-04`: **piezas sueltas, nunca la composición entera de una
> tapa** — y el esclavo encadenado de *Oktubre* no se usa hasta que su ficha se
> verifique.
>
> **Cómo se cambia una pieza:** recortá, guardá el archivo con el nombre exacto de la
> tabla en esta carpeta (`public/arte/`), y listo — las páginas lo levantan solas en el
> próximo build (`src/lib/sitio/arte.ts`). Mientras el recorte real no exista, queda el
> dibujo de reemplazo (`.svg`) o un hueco vacío. Los originales de las tapas viven en
> `Docs/INVESTIGACION/TapasDiscos/`.
>
> Formato: PNG con fondo transparente, borde tipo tijera (irregular, con grano — nunca
> vector liso). Tamaño orientativo: 400–800 px del lado largo alcanza.

## Ojo: este README manda sobre el collage, y el collage no es todo el sitio

`D-41` partió el arte en dos idiomas, y este archivo describe **uno solo**. La metáfora es
la regla: un fichín son dos cosas pegadas, un tubo de píxeles adentro de un mueble
serigrafiado. La frontera se ve, y los dos idiomas no se mezclan en la misma pieza.

| | El collage | El pixel |
|---|---|---|
| **Dónde rige** | Todo el sitio: portal, Redondopedia, casetes, fichas de disco, tarjeta compartible. Y en el juego de plataformas, el **marco**: chapa, bisel, rótulos, pie | Solo **adentro del área de juego** de ese juego |
| **Carpeta** | `public/arte/` — esta | **`public/sprites/`** |
| **Borde** | Tijera: irregular, con grano. Nunca vector liso | Duro, de píxel. El grano acá es suciedad |
| **Tamaño** | 400–800 px del lado largo, y se escala | Nativo y exacto: celda de **16 × 24 nativos** (32 × 48 CSS a ×2) |
| **Color** | Libre, dentro de la paleta de la sección | **16 tintas para toda el área**, las `--px-*` de `tokens.css`, y ninguna más |
| **Alfa** | Todo el rango: el borde rasgado lo necesita | **Binario**: 0 o 255, nada en el medio |
| **Quién lo fija** | `UX-04` y este archivo | `UX-27`, y el contrato `CTR-15` de `arquitectura` |

**Entonces la línea de "borde tipo tijera — nunca vector liso" del encabezado es del
collage y no viaja.** Aplicársela a un sprite lo arruina: a 16 px de ancho, un borde con
grano es ruido, y un alfa intermedio deja un halo que el auditor de paleta rechaza.

Al revés también: un recorte de tapa cuantizado a 16 colores no es pixel art, es un
recorte roto. **La hoja que trajo el usuario** (`skayboy_poligirl.png`) vive en `Docs/UX/pixel-master/` —salió
de esta carpeta el 2026-10-01 porque se publicaba sin que la pidiera ninguna pantalla— y **es
referencia de pose, insignia y tono — no es la fuente de los píxeles**: se midió y no está
sobre grilla, así que los sprites de producción se redibujan, no se recortan. El circuito
entero está en `UX-27`.

Lo que se audita a máquina: `node scripts/auditar-paleta-pixel.mjs` mira `public/sprites/`
y falla si aparece un color fuera de las 16 o un alfa intermedio. Esta carpeta no pasa por
ahí, y no tiene que pasar.

## Ya cableadas en el código (con reemplazo dibujado mientras tanto)

| Archivo | Pieza | De dónde | Cómo recortar | Dónde se pega |
|---|---|---|---|---|
| `mosca.png` (hoy `mosca.svg`) | La mosca | *La mosca y la sopa* (fichado: RES-06, RES-22) | La mosca sola, en silueta cerrada: sin sopa, sin fondo | Vuela por el portal con vuelo errático (animación `vuelo-de-mosca`), y desde `D-49` revolotea alrededor del mouse o del toque (`src/scripts/mosca.ts`). **Para que mire para donde vuela, el recorte tiene que tener la cabeza para arriba** |
| `multitud-oktubre.png` ✅ **recorte puesto** (2026-10-04, `D-63`; reemplaza al pedido `multitud-banderas.png` y a su dibujo `banderas.svg`, que salió) | La gente mirando, con las banderas | *Oktubre* (fichado: RES-06), desde una versión estirada a 16:9 que trajo el usuario (`Docs/INVESTIGACION/TapasDiscos/oktubre-frontal-ancha.webp`). **Los costados de ese máster no son de Rocambole**: la tapa cuadrada cae más o menos entre x=257 y x=987 | Debajo del wordmark, todo el ancho. Lo saca `node scripts/generar-multitud.mjs`: el negro pasa a transparente y lo demás se reimprime en `--papel` y el rojo de la bandera. **Sin el esclavo encadenado.** Nunca el wordmark | Piso del pie de imprenta del portal, de borde a borde, a tinta plena y sin texto encima. El fondo del portal es negro liso |
| `multitud-lejos-clara.png`, `-roja.png`, `-silueta.png` ✅ **máscaras puestas** (2026-10-05, `D-63` enmienda 1) | La multitud que se ve de lejos, con las banderas rojas | *Oktubre* (fichado: RES-06), del frente **original** (`Docs/INVESTIGACION/TapasDiscos/oktubre-frontal.jpg`, Rocambole entero) | De las banderas para abajo, en espejo para que el mosaico no tenga costura. Alfa sola: lo claro, lo rojo y la silueta de la gente. Las saca `node scripts/generar-multitud.mjs` | Los dos planos fijos del portal que se acercan al bajar (`.plano-gente`). La tinta la pone `sitio.css` desde `tokens.css` |
| `oktubre-cadena.png` | La figura encadenada | Arte de Rocambole. **De qué disco: sin ficha** — ver "Lo que NO va acá" | Ya vino calcada del usuario: estarcido blanco sobre transparente, 388×303 | Portada del portal, junto a la marca, y la tarjeta al compartir (`public/tarjeta.png`, la genera `npm run generar-marca-social`). **No se le atribuye álbum en ningún texto** |
| `perro.png` (hoy `perro.svg`) | El perro | *Un baión* (fichado: RES-06, RES-22 — "en toda la mitología solariana hay un perro") | El perro solo, sin televisor ni muñeco. Borde grueso tipo serigrafía | Personaje de portada: asoma junto a la marca. **Nunca junto a televisor + muñeco en la misma pantalla** (recompondría la tapa) |
| `lobo-recortado.png` ✅ **recorte real puesto** (reemplaza a `lobo-lupus.png`, mismo lobo peor cortado: aquel venía en paleta y sin alfa limpio, y desde el 2026-10-01 vive en `Docs/UX/recortes-master/`) | Lupus el Lobo | *Lobo suelto* (fichado: RES-20 — álbum conceptual sobre Lupus y Rulo) | La figura del lobo, silueta cerrada | Pantalla de adivinar el tema (sección mitología) y ficha del disco en la Redondopedia |
| `muneco-antifaz.png` ✅ **recorte puesto** (2026-10-01, cortado del máster frontal) | El muñeco con antifaz | *Un baión* (fichado: RES-06, RES-22) | La figura entera del muñeco (collares, antifaz, chupete), sin televisor ni perro | Ficha de *Un baión* en la Redondopedia, como calco apenas rotado |
| `mosca-rotulo.png` ✅ **recorte puesto** (2026-10-01) | El rótulo de la tapa, con la mosca adentro | *La mosca y la sopa* (frente real) | El rectángulo negro de letras amarillas, con un hilo del rojo de la tapa como margen de tijera | Ficha de *La mosca y la sopa* en la Redondopedia. Reemplaza al gato, que no está en ninguna de las cuatro imágenes del disco del repo |
| `gato-momificado.png` (sin imagen en el repo: queda pedido) | El gato momificado | *La mosca y la sopa* (fichado: RES-06, RES-22 — era un gato real) | El gato solo, borde rasgado tipo papel viejo | Si llega la imagen, vuelve a la ficha de *La mosca y la sopa* en lugar del rótulo |
| `luzbelito-vela.png` ✅ **recorte real puesto** (llegó como `tapas/recortes/luz-belito-recortado.png`) | La cabeza con vela | *Luzbelito* (fichado: RES-06 — tapa ganadora del premio ACE) | La cabeza con la vela encendida, hasta donde termina la llama. Ojo: la explicación del nombre (luz + vela) es **leyenda**, no la presentes como hecho | Ficha de *Luzbelito* en la Redondopedia |
| `bondi-interplanetario.png` | El bondi interplanetario | *Último bondi* (fichado: RES-22 — la cúpula inspirada en la caja de Chivas Regal, testimonio del Indio) | La nave completa con su cúpula, sin el paisaje | Ficha de *Último bondi*, y el casete de "Adiviná la tapa" en el portal (la sección discos viste *Último bondi*, `D-19`); a futuro, cruza lento el fondo de la sección discos |
| `cordero-rulo.png` ✅ **recorte real puesto** (llegó como `tapas/recortes/cordero-recortado.png`) | Rulo el Cordero | *Cordero atado* (fichado: RES-20) | La figura del cordero, mismo tratamiento de borde que el lobo (funcionan en par) | Ficha de *Cordero atado*. **Prohibido usar el par lobo/cordero como código de acierto/error** (regla de marca) |
| `momo-medallon.png` ✅ **recorte real puesto** (llegó como `tapas/recortes/momo-recortado.png`) | El medallón de Momo | *Momo Sampler* (la tapa entera es ese medallón) | El medallón solo, sin el campo negro de alrededor | Ficha de *Momo Sampler* en la Redondopedia, y el casete de "Sacalo por la letra" en el portal (ese juego viste *Momo Sampler*, `UX-08`). El casete del portal pega este mismo recorte. (Hubo un `tapas/detalle/momo-medallon.jpg`, la foto recortada del máster; no lo mostraba ninguna pantalla y salió el 2026-10-01) |
| `casete.svg` | El cassette dibujado | Genérico (dibujo original, se queda así) | — | Pantalla de adivinar la tapa, y repuesto de un casete del portal cuya tapa no esté generada. **Ya no viste ningún casete del portal** (`D-49`): cada uno lleva una tapa entera, un detalle o un recorte de tapa, y ninguno repite |

## Para producir cuando quieras sumar (todavía sin hueco en el código)

| Archivo | Pieza | De dónde | Dónde iría |
|---|---|---|---|
| `banda-superheroes.png` | La banda superhéroes (fichado: RES-22 — primera aparición de la banda en una tapa) | *Último bondi* | Era el sticker de *Momo Sampler* hasta el 2026-09-02; se lo quedó el medallón del propio disco. Sigue sirviendo para la ficha de *Último bondi* si alguna vez se quiere dos piezas ahí |
| `televisor.png` | El televisor (el "ojo idiota", fichado RES-06/RES-22) | *Un baión* | El reveal de adivinar el tema se vería dentro de su pantalla. Nunca junto a perro + muñeco |
| `cerdos-y-peces.png` | Un cerdo y un pez (guiño a la revista de Symns — testimonio) | *La mosca y la sopa* | Orlas de las tarjetas de la sección letras |
| `bandera-suelta.png` | Bandera flameando (genérica, dibujo original) | — | Transición entre preguntas del quiz |
| `estrella-panfleto.png` | Estrella de estampa serigráfica (genérica, dibujo original) | — | Viñetas y separadores de la Redondopedia |
| `puno-en-alto.png` | Puño en alto (símbolo de protesta genérico, `UX-04`) | — | Sello de esquina de la tarjeta compartible |

## Lo que NO va acá

- **Tapas enteras.** Van en `public/tapas/` (baja resolución, generadas con
  `node scripts/generar-tapas.mjs`), no acá. Aparecen en las fichas de disco de la
  Redondopedia, en "Adiviná la tapa" y, desde `D-49`, pegadas en tres casetes del portal
  (*Oktubre*, *¡Bang! ¡Bang!* y *La mosca y la sopa*). `D-21` ya las había habilitado en
  cualquier pantalla, con crédito y en baja.
- ~~**El esclavo encadenado de Oktubre.**~~ **Cambió el 2026-08-24: la pieza entró.** El
  usuario trajo el calco (`oktubre-cadena.png`) y pidió ponerlo en la portada del portal.
  Lo que sigue prohibido no es la imagen: es **decir de qué disco sale**. `INV-02` reportó
  que esta figura no estaba en el arte del vinilo del 86 y que se difundió con la reedición
  en CD, y ese hallazgo está en "reportado, no verificado". Entonces la pieza se muestra,
  se acredita a Rocambole —eso sí está firme— y **no se le atribuye álbum** en ningún lado:
  ni en el crédito del pie, ni en el texto de la tarjeta al compartir, ni como respuesta de
  una pregunta. Ficha pedida en
  `Docs/SUGERENCIAS/HILO-para-investigador-figura-encadenada.md`.
