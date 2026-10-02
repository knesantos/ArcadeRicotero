# El diseño manda: sistema de marca de Arcade Ricotero

Esta regla la escribe el hilo principal y obliga a **todo el que toque una pantalla,
un color, una fuente o un componente** — hilo principal incluido.

## Dónde vive el diseño

La fuente de verdad es el lienzo **"Sistema de marca Arcade Ricotero"**:
https://claude.ai/code/artifact/59acd1de-80ab-4074-b1ba-b75da05cb134

Las hojas: 01 marca · 02 voz · 03 paleta · 04 tipografía · 05 tapas (paletas reales
medidas + la mezcla `D-19`) · 06 iconografía · 07 línea y textura · 08 componentes ·
09 pantallas · 10 tarjeta compartible · 11 entrega · 12 movimiento y aire · 14 el pixel
del fichín. La 13 (la imprenta) la nombra `tokens.css` y nunca llegó al lienzo, y la 15
(la mesa, `D-54`) está escrita en `Docs/SUGERENCIAS/lienzo-hoja-15-la-mesa.dc.html` y
falta pegarla (`T-319`).

Su espejo en el código es **`src/styles/tokens.css`**: el único archivo del repo donde
puede vivir un hex, una familia tipográfica o una medida de marca.

## El circuito de cambio — siempre en este orden

1. **Se cambia en el diseño** (el lienzo), donde se ve el efecto en todas las piezas.
2. Se refleja en `src/styles/tokens.css` (valores) y, si cambió estructura, en
   `src/styles/juego.css` (estados y componentes — sin hex, solo `var(--...)`).
3. Se corre la verificación: `node --test src/lib/contraste.test.ts` tiene que pasar.
   Si el par nuevo se usa como texto, **se agrega al test** — un color sin par testeado
   no existe.

Nunca al revés: un color suelto en un componente es un defecto, aunque se vea bien.

## Las reglas duras (no las relaja nadie)

- **La mezcla (`D-19`)**: cada parte viste la paleta real de un disco — portada=Oktubre,
  historia=Gulp!, mitología=Lobo suelto, letras=La mosca y la sopa, discos=Último bondi,
  resultado=Gulp!+logo. Los valores exactos son los `--cat-*` y `--marca-rojo` de
  `tokens.css`, muestreados de las tapas reales (`RES-37`).
- **La base no rota nunca**: fondo de tinta, grano, zona pulgar (`--toque-min` ≥ 48 px),
  contraste AA. Lo que rota por sección es el acento y la letra grande.
- **El texto largo va siempre en `--fuente`** (la legible del sistema): enunciados,
  opciones, explicaciones (`UX-01`). Las letras de disco gritan títulos cortos.
- **Acierto (`--acento-3`), error (`--acento-4`) y los rótulos de leyenda/testimonio no
  se disfrazan de ningún disco.** Y ningún estado se comunica solo con color.
- **Voz (`D-17`)**: sin anglicismos en todo lo que se lee, voseo en cada botón.

## Las fuentes reales

Viven en `public/fuentes/` y se declaran solo en `tokens.css`:

| Variable | Fuente | Origen | Ojo |
|---|---|---|---|
| `--fuente-titular` | Oktubre Calco v0.3 | calco propio de la tapa (`RES-43`) | solo A B C D E I K O R T U — **sin acentos ni Ñ** |
| `--fuente-marca-firma` | Patricio Rey Fan | digitalización fan, B. Zavala (`RES-42`) | sin acentos |
| `--fuente-rotulada` | Archivo Black | autoalojada | completa, es el repuesto de todo |
| `--fuente` | pila del sistema | — | todo el texto largo |

**Deuda declarada**: las letras con tilde (JUGÁ, SEGUÍ, MITOLOGÍA) todavía no existen en
las fuentes de disco — hasta derivarlas, esas palabras van en `--fuente-rotulada`. No
"resolver" esto escribiendo sin tilde: `D-17` no negocia el voseo.

## Prohibido: la estética genérica de IA ("slop")

Pedido directo del usuario (2026-08-21, corrida anti-slop): **nada en este sitio puede
verse como la interfaz por defecto que genera una IA.** Cada elemento se resuelve en el
idioma del proyecto — sello de goma, cinta adhesiva, papel con renglones, tinta plana,
rotación a mano, borde grueso de serigrafía (`RES-06`) — o no se resuelve. La lista de
tics vetados, con su reemplazo:

| Tic genérico (vetado) | En su lugar |
|---|---|
| **Barra de acento en el borde izquierdo de una tarjeta** (el caso que motivó la regla) | Borde completo teñido por el disco de la sección, título en la tinta, rotación leve |
| Pastilla cápsula (`border-radius: 999px`) como chip por defecto | Sello de goma: rectángulo de esquina casi viva (3px), borde fino, mayúsculas rotuladas, apenas torcido |
| Superficie "elevada" (card gris sobre fondo gris) como forma de separar | La pieza se recorta por borde grueso y cinta, como recorte pegado — y la tinta queda sobre `--fondo`, que es el par testeado |
| Sombra difusa de elevación, glow, glassmorphism/blur | Sombra dura desplazada (offset plano, como papel sobre papel) o nada |
| Degradados decorativos, texto en gradiente | Tinta plana de los tokens |
| **Velo que se desvanece** (`linear-gradient(var(--velo-tapa), transparent)`) — pasa el test de `D-21` por subcadena y deja media foto desnuda debajo del texto | El velo es **plano**, dos paradas idénticas. Lo que se desvanece es el alfa de la capa entera, con máscara. `estilos.test.ts` lo mira desde el ciclo 13 |
| **Máscara de gradiente liso como borde de una capa** — es el mismo aerógrafo con otro nombre | La máscara se cruza con la textura, como hace `.rodillo`: en la mitad exterior de la franja de desgaste la única alfa que existe es la de `--textura-rodillo`. Es la racleta levantando, no un fundido (`D-34`) |
| Hover que "levanta" o infla la tarjeta, micro-rebotes | Cambio de tinta o de borde; el único movimiento decorativo del sitio es la mosca |
| Emoji o ícono de librería como decoración de UI | Ya lo vetaba `UX-04`; los símbolos funcionales testeados (✔ ✕ en opciones, ◆ leyenda, ❝ testimonio) no son decoración y se quedan |
| Esquinas redondeadas uniformes en todo | `--radio` queda para lo tocable grande (botones, casetes); lo chico va a 3px de estampa |
| En el texto visible: fórmula pulida de IA — "no es solo X, es Y", "¡Y listo!", entusiasmo de folleto, cada ítem de lista arrancando con negrita-título | La voz la fijan `CNT-02` y `D-17`: rioplatense, directa, jerga en el tono |

**Única excepción declarada a la barra lateral:** la sangría de cita de los párrafos
rotulados de la Redondopedia (`.parrafo--leyenda`, `.parrafo--testimonio`) — es
tipografía editorial clásica y el mecanismo visual de `BR-08`, con símbolo y etiqueta
además del borde.

**Se audita a máquina lo auditable:** `estilos.test.ts` falla el build si vuelve una
pastilla 999px o una barra lateral fuera de la excepción. Lo demás lo audita el ojo de
quien revisa, con esta tabla como vara.

## Si algo de esta regla te queda chico

Propuesta en `Docs/SUGERENCIAS/`, como siempre. El mapa sección→disco es en última
instancia de `experiencia` (`UX-04`); los valores, del lienzo; el circuito, de esta regla.
