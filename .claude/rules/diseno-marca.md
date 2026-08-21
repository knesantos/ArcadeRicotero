# El diseño manda: sistema de marca de Arcade Ricotero

Esta regla la escribe el hilo principal y obliga a **todo el que toque una pantalla,
un color, una fuente o un componente** — hilo principal incluido.

## Dónde vive el diseño

La fuente de verdad es el lienzo **"Sistema de marca Arcade Ricotero"**:
https://claude.ai/code/artifact/59acd1de-80ab-4074-b1ba-b75da05cb134

Once hojas: 01 marca · 02 voz · 03 paleta · 04 tipografía · 05 tapas (paletas reales
medidas + la mezcla `D-19`) · 06 iconografía · 07 línea y textura · 08 componentes ·
09 pantallas · 10 tarjeta compartible · 11 entrega.

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

## Si algo de esta regla te queda chico

Propuesta en `Docs/SUGERENCIAS/`, como siempre. El mapa sección→disco es en última
instancia de `experiencia` (`UX-04`); los valores, del lienzo; el circuito, de esta regla.
