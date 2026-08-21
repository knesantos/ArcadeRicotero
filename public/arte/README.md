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

## Ya cableadas en el código (con reemplazo dibujado mientras tanto)

| Archivo | Pieza | De dónde | Cómo recortar | Dónde se pega |
|---|---|---|---|---|
| `mosca.png` (hoy `mosca.svg`) | La mosca | *La mosca y la sopa* (fichado: RES-06, RES-22) | La mosca sola, en silueta cerrada: sin sopa, sin fondo | Vuela por el portal con vuelo errático (animación `vuelo-de-mosca`); también en la pantalla de completar la letra |
| `multitud-banderas.png` (hoy `banderas.svg`) | La multitud con banderas | *Oktubre* (fichado: RES-06) | Franja horizontal con gente y banderas: borde superior siguiendo siluetas, borde inferior rasgado. **Sin el esclavo encadenado.** Nunca la tapa entera | Fondo del portal y de la portada de la Redondopedia, anclada abajo, opacidad baja, fija |
| `perro.png` (hoy `perro.svg`) | El perro | *Un baión* (fichado: RES-06, RES-22 — "en toda la mitología solariana hay un perro") | El perro solo, sin televisor ni muñeco. Borde grueso tipo serigrafía | Personaje de portada: asoma junto a la marca. **Nunca junto a televisor + muñeco en la misma pantalla** (recompondría la tapa) |
| `lobo-lupus.png` (hoy `lobo.svg`) | Lupus el Lobo | *Lobo suelto* (fichado: RES-20 — álbum conceptual sobre Lupus y Rulo) | La figura del lobo, silueta cerrada | Pantalla de adivinar el tema (sección mitología) y ficha del disco en la Redondopedia |
| `muneco-antifaz.png` | El muñeco con antifaz | *Un baión* (fichado: RES-06, RES-22) | La figura entera del muñeco (collares, antifaz, chupete), sin televisor ni perro | Ficha de *Un baión* en la Redondopedia, como calco apenas rotado |
| `gato-momificado.png` | El gato momificado | *La mosca y la sopa* (fichado: RES-06, RES-22 — era un gato real) | El gato solo, borde rasgado tipo papel viejo | Ficha de *La mosca y la sopa* en la Redondopedia |
| `luzbelito-vela.png` | La cabeza con vela | *Luzbelito* (fichado: RES-06 — tapa ganadora del premio ACE) | La cabeza con la vela encendida, hasta donde termina la llama. Ojo: la explicación del nombre (luz + vela) es **leyenda**, no la presentes como hecho | Ficha de *Luzbelito* en la Redondopedia |
| `bondi-interplanetario.png` | El bondi interplanetario | *Último bondi* (fichado: RES-22 — la cúpula inspirada en la caja de Chivas Regal, testimonio del Indio) | La nave completa con su cúpula, sin el paisaje | Ficha de *Último bondi*; a futuro, cruza lento el fondo de la sección discos |
| `cordero-rulo.png` | Rulo el Cordero | *Cordero atado* (fichado: RES-20) | La figura del cordero, mismo tratamiento de borde que el lobo (funcionan en par) | Ficha de *Cordero atado*. **Prohibido usar el par lobo/cordero como código de acierto/error** (regla de marca) |
| `banda-superheroes.png` | La banda superhéroes | *Último bondi* (fichado: RES-22 — primera aparición de la banda en una tapa) | El grupo de figuras como bloque único en silueta | Ficha de *Momo Sampler*/*Último bondi* en la Redondopedia |
| `casete.svg` | El cassette dibujado | Genérico (dibujo original, se queda así) | — | Casetes del portal y pantalla de adivinar la tapa |

## Para producir cuando quieras sumar (todavía sin hueco en el código)

| Archivo | Pieza | De dónde | Dónde iría |
|---|---|---|---|
| `televisor.png` | El televisor (el "ojo idiota", fichado RES-06/RES-22) | *Un baión* | El reveal de adivinar el tema se vería dentro de su pantalla. Nunca junto a perro + muñeco |
| `cerdos-y-peces.png` | Un cerdo y un pez (guiño a la revista de Symns — testimonio) | *La mosca y la sopa* | Orlas de las tarjetas de la sección letras |
| `bandera-suelta.png` | Bandera flameando (genérica, dibujo original) | — | Transición entre preguntas del quiz |
| `estrella-panfleto.png` | Estrella de estampa serigráfica (genérica, dibujo original) | — | Viñetas y separadores de la Redondopedia |
| `puno-en-alto.png` | Puño en alto (símbolo de protesta genérico, `UX-04`) | — | Sello de esquina de la tarjeta compartible |

## Lo que NO va acá

- **Tapas enteras.** Van en `public/tapas/` (baja resolución, generadas con
  `node scripts/generar-tapas.mjs`) y solo aparecen donde el contrato lo permite:
  fichas de disco de la Redondopedia y, a futuro, el juego de adivinar la tapa.
- **El esclavo encadenado de Oktubre.** Sigue "reportado, no verificado" (`RES-06`);
  hasta que una ficha lo confirme, no se recorta.
