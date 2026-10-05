A. Decisión de diseño

1. Los once títulos de casete, el título de la carátula y el h1 de cada juego quedan sin sombra. Un título que sale con una sola tinta no tiene segundo color que pueda quedar fuera de registro, así que el eco desaparece. Hoy hay siete tintas de eco en nueve casetes: dos se ven marrón casi negro (A1 y A5) y una no se ve, crema sobre crema (A4).
2. En lugar del eco, cada pieza sale de una misma almohadilla de goma medio seca. Faltan puntos de tinta (la "sal") y hay zonas donde la mano aflojó (la "presión", que baja a 0,8 y nunca menos). Los huecos se juntan justo donde aflojó. La letra es `--fondo` pleno, sin filete y sin `color-mix`, así que se mantiene nítida a 1×.
3. La etiqueta pasa a ser papel viejo: manchas de humedad con borde de marea en escalones duros, más pecas, pintadas con `--papel-borde` y con un techo de 0,18. No se agrega ningún hex.
4. El sello de acción pierde su `box-shadow` de eco. El relleno sale moteado de la misma almohadilla, y el filete de 2 px y la letra quedan enteros, que es como imprime un sello de goma. La pista y "EN LA COCINA" están escritas a mano y no se gastan. La bajada es cuerpo de texto y no lleva textura.
5. La coherencia sale del mapa de variantes que ya existe. Cada disco fija `--semilla`, y el casete del portal, su carátula y el h1 de su juego heredan el mismo golpe sin cambiar una línea de marcado. Se queda con la propuesta "sello" (24,5 puntos). No tenía bloqueantes, y los defectos que marcaron los jueces se resuelven en B.

Injertos y arreglos sobre "sello", ya probados en un prototipo con Archivo Black real en Chrome a 1× y 3×, y medidos con sharp:
- De "tipos":
  - Sal y presión van en un solo SVG, acopladas con k3 = −16. Así hay una sola capa de máscara, sin `mask-composite` y sin la diferencia de prefijos.
  - El desgaste del h1 escala con la letra (tesela al doble).
- De "mimeo":
  - El papel va en escalones discretos, sin nube continua.
  - Se suma `texturas.test.ts` con sharp, que mide la cobertura de verdad.
  - La letra del título va en tinta plena.
- De los jueces:
  - Las texturas leen el canal alfa de feTurbulence, no el R.
  - Todas las teselas van en px enteros y con `viewBox`.
  - El tope del papel baja de 0,30 a 0,18 para que la pista aguante el grano global.
  - El "pronto" se arregla con la opacidad incluida en la cuenta.
  - Ningún par de reglas de igual especificidad queda repartido entre `sitio.css` y `juego.css`.

Medido en Chromium, dibujando cada SVG en un canvas:
- `--textura-tinta`: 3,55 % de huecos (librsvg da 3,50), peor bloque de 12 px 19,4 %, 9,4 % de la tinta entre 0,8 y 0,9.
- Costura de la tesela: con la región 0/0/1/1 el borde da 29 saltos contra un máximo de 47 adentro; sin la región, 91 contra 49.
- librsvg no cose las teselas: da lo mismo con región o sin ella. Por eso la costura se controla con un chequeo estático y no rasterizando.

Prototipo de referencia (no va al repo), en C:/Users/santi/AppData/Local/Temp/claude/C--Users-santi-Proyectos-InstanciadorProyectos-RicotaArcade/52dfba30-4949-4ce7-a4bb-dc9786518d2d/scratchpad/d63/:
- proto.html (antes y después), final-x3.png, final-x1-crop.png, c-h.png (h1).
- gen.mjs genera los tokens; contraste.mjs y umbrales.mjs tienen las cuentas.

B. Cambios por archivo (base: C:/Users/santi/Proyectos/InstanciadorProyectos/RicotaArcade-fondo)

Paso 0, antes de tocar nada:
- `sitio.css` tiene D-62 sin commitear, de otra sesión. Siguiendo la memoria "guardar antes de mejorar" y "avisar antes de commitear", primero se guarda D-62 tal cual, en su propio commit, avisándole al usuario.
- D-63 está libre: fetch del 2026-10-05, ninguna rama remota la tiene. La T- de la deuda del lienzo es T-411, también libre.

B.1 src/styles/tokens.css

Insertar después de `--textura-rodillo` (línea ~157):

  /* La almohadilla (`D-63`, hoja 07). Las tapas de los juegos —el título del casete, el de la
     carátula, el h1 de cada juego y el macizo del sello— salen de la misma almohadilla de goma
     medio seca: le falta tinta en puntos (la sal) y en zonas donde la mano aflojó (la presión),
     y los huecos se juntan justo ahí (k3 = −16). Alfa sola, como el grano: se usan como
     MÁSCARA y la tinta la pone el lugar.
     - Sal: fractal 0,75 cortado casi binario (pendiente −40). La perilla es k4: 37,8 da 3,5 %
       de huecos de ~1 px; cada +0,4 saca ~0,6 puntos.
     - Presión: fractal 0,035 × 0,055, una zona cada letra y media. La tabla '0.8 1' es PISO: la
       tinta puede faltar, nunca aguarse por debajo de 0,8. `contraste.test.ts` la lee de acá.
     - La región 0/0/1/1 del filtro no es decorativa: sin ella stitchTiles cose contra el 120 %
       por defecto y la tesela deja costura (Chromium: 91 saltos en el borde contra 49 adentro;
       con la región, 29). El viewBox deja escalar la tesela sin cambiar el dibujo.
     Medido el 2026-10-05 en Chromium y librsvg: 3,5 % de huecos, peor bloque de 12 px 19 %,
     9 % de la tinta entre 0,8 y 0,9. `texturas.test.ts` lo vuelve a medir. */
  --textura-tinta: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='t' x='0' y='0' width='1' height='1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed='11' stitchTiles='stitch' result='g'/%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035 0.055' numOctaves='2' seed='7' stitchTiles='stitch' result='m'/%3E%3CfeComposite in='g' in2='m' operator='arithmetic' k2='-40' k3='-16' k4='37.8' result='sal'/%3E%3CfeColorMatrix in='m' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -8 5.8'/%3E%3CfeComponentTransfer result='presion'%3E%3CfeFuncA type='table' tableValues='0.8 1'/%3E%3C/feComponentTransfer%3E%3CfeComposite in='sal' in2='presion' operator='in'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23t)'/%3E%3C/svg%3E");

  /* La misma sal, sin la presión: para el h1 de cada juego, que es tinta de color sobre el
     negro y no tiene margen para aclararse ("Completá la letra" da 4,67:1 pleno). Saca puntos
     enteros y no le cambia el color a ninguno, así que ningún par AA se mueve. Mismos seeds y
     mismos k que --textura-tinta: es la misma almohadilla. */
  --textura-tinta-sal: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cfilter id='s' x='0' y='0' width='1' height='1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed='11' stitchTiles='stitch' result='g'/%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035 0.055' numOctaves='2' seed='7' stitchTiles='stitch' result='m'/%3E%3CfeComposite in='g' in2='m' operator='arithmetic' k2='-40' k3='-16' k4='37.8'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23s)'/%3E%3C/svg%3E");

  /* El papel viejo de la etiqueta (`D-63`): manchas de humedad con borde de marea —escalones
     duros (discrete), nunca un fundido— y pecas. Se pinta con `--papel-borde`, sin hex nuevo.
     El último tableValues es el TECHO de toda la etiqueta: 0,18 deja la pista A1… en 4,55:1
     con el grano de pantalla encima. Más alto y `contraste.test.ts` falla.
     Medido: 87 % limpio, 13 % manchado, 1,3 % en el techo. */
  --textura-papel-viejo: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Cfilter id='v' x='0' y='0' width='1' height='1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.018' numOctaves='4' seed='7' stitchTiles='stitch' result='n'/%3E%3CfeColorMatrix in='n' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 -1.55'/%3E%3CfeComponentTransfer result='manchas'%3E%3CfeFuncA type='discrete' tableValues='0 0 0.4 0.7 1'/%3E%3C/feComponentTransfer%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.09' numOctaves='2' seed='11' stitchTiles='stitch' result='p'/%3E%3CfeColorMatrix in='p' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 14 -10.1' result='pecas'/%3E%3CfeComposite in='manchas' in2='pecas' operator='arithmetic' k2='1' k3='1'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0.18'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23v)'/%3E%3C/svg%3E");

Comentario de `--tinta-registro` (245-251): cambiar "Cada parte del sitio la pisa" por "La pisan la marca, los artículos de la Redondopedia, la ficha y el gabinete de Skayboy. Desde `D-63` los casetes y los juegos no: sus títulos se sellan con una tinta". `--registro` y `--registro-angulo` se quedan, porque `movimiento.test.ts:140-141`, la estampa y Skayboy los usan.

No se agrega `--peso-sello` ni ningún hex. `--textura-grano` y `--textura-rodillo` no se tocan (ver F).

B.2 src/styles/sitio.css

a) `.casete-etiqueta` (909-924): sumar `position: relative;` e `isolation: isolate;`. Lo demás queda igual: papel, renglones, padding, radio y `rotate(-0.4deg)`.

b) `.casete-titulo` (926-935) queda completo así:

  .casete-titulo {
    display: block;
    font-family: var(--fuente-rotulada);
    /* Es un <strong>: sin esto el navegador engorda Archivo Black, que tiene un peso solo
       (la negrita falsa que `D-54` les sacó a los h1). */
    font-weight: normal;
    font-size: 0.95rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    /* La almohadilla (`D-63`). Tinta plena: lo que falta lo saca la máscara, nunca un gris.
       Con el interlineado heredado (1,4) la caja tiene aire de sobra para la tilde. */
    -webkit-mask-image: var(--textura-tinta);
    mask-image: var(--textura-tinta);
    -webkit-mask-size: 240px 240px;
    mask-size: 240px 240px;
    -webkit-mask-position: calc(var(--golpe, 0) * -61px) calc(var(--golpe, 0) * -37px);
    mask-position: calc(var(--golpe, 0) * -61px) calc(var(--golpe, 0) * -37px);
  }

Las medias de 64 y 80 rem (2082-2084 y 2108-2110) solo cambian el `font-size` y no se tocan.

c) `.casete-accion` (973-985):
- Borrar el comentario "La tinta del sello no llega pareja…" y la línea de `box-shadow`.
- Sumar `position: relative;` e `isolation: isolate;`.
- El `background` se queda: es el repuesto si no hay máscara.

d) Lo que todavía no salió (998-1014):
- `.casete--pronto { opacity: 0.82; }` pasa a ser `.casete--pronto .casete-arte { opacity: 0.82; }`. Con la opacidad sobre el casete entero, la pista hoy ya está en 4,53 y con la mancha bajaba de AA. Se apaga la pieza, no el papel.
- En `.casete-pronto`:
  - `color: var(--papel-tenue);`, que hoy es `--texto-tenue` y da 1,72:1.
  - `border: 2px dashed var(--papel-tenue);`
  - Queda como lápiz, igual que la pista: lo escrito a mano va en papel-tenue y lo impreso en tinta.

e) Bloque nuevo, inmediatamente después de d):

  /* La almohadilla, segunda parte (`D-63`): el papel viejo de la etiqueta y el macizo del
     sello. Las dos van en @supports A PROPÓSITO: sin máscara, el ::before del papel sería un
     rectángulo pleno de --papel-borde (la pista caería a 3,66:1), y el del sello taparía el
     relleno de repuesto. El filete y la letra del sello no se enmascaran nunca: el canto de la
     goma imprime entero, y es lo que sostiene la forma del botón contra el papel. */
  @supports (mask-image: none) or (-webkit-mask-image: none) {
    .casete-etiqueta::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: inherit;
      pointer-events: none;
      background: var(--papel-borde);
      -webkit-mask-image: var(--textura-papel-viejo);
      mask-image: var(--textura-papel-viejo);
      -webkit-mask-size: 320px 320px;
      mask-size: 320px 320px;
      -webkit-mask-position: calc(var(--golpe, 0) * -83px) calc(var(--golpe, 0) * -131px);
      mask-position: calc(var(--golpe, 0) * -83px) calc(var(--golpe, 0) * -131px);
    }
    .casete-accion {
      background: transparent;
    }
    .casete-accion::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background: var(--tinte-sello, var(--tinte));
      -webkit-mask-image: var(--textura-tinta);
      mask-image: var(--textura-tinta);
      -webkit-mask-size: 240px 240px;
      mask-size: 240px 240px;
      -webkit-mask-position: calc(var(--golpe, 0) * -97px - 120px) calc(var(--golpe, 0) * -53px - 70px);
      mask-position: calc(var(--golpe, 0) * -97px - 120px) calc(var(--golpe, 0) * -53px - 70px);
    }
  }

f) Mapa de variantes (1016-1055):
- Sacar todos los `--tinta-registro` de `.casete--*` y `.juego--*` (líneas 1023-1026, 1040, 1047 y 1054). Después del cambio no los lee nadie: `.marca`, `.marca-grande` y Skayboy fijan el suyo, y `.papel-ficha` vive solo bajo `.articulo--*`. Los de `.articulo--*` (1602-1605) y `.cocina--*` (CSS muerto) no se tocan.
- Sumar `--semilla` con el número de pista del lado A:

  .casete--marca, .juego--marca { --tinte: var(--marca-rojo); --semilla: 1; }
  .casete--historia, .juego--historia { --tinte: var(--cat-historia); --semilla: 4; }
  .casete--discos, .juego--discos { --tinte: var(--cat-discos); --semilla: 8; }
  .casete--letras, .juego--letras { --tinte: var(--cat-letras); --semilla: 6; }
  .casete--mitologia, .juego--mitologia { --tinte: var(--cat-mitologia); --semilla: 3; }
  momo: --semilla: 5 (junto a --tinte y --tinte-sello)
  baion: --semilla: 9
  bang: --semilla: 7
  luzbelito: --semilla: 2

- Ajustar los comentarios de baion, bang y luzbelito, que dicen "y el apoyo para el registro".
- Después del mapa:

  /* El golpe: dónde apretó la mano (`D-63`). Se declara en la pieza y no en :root porque un
     var() se resuelve donde se declara: en :root --semilla no existe todavía. El lado B es
     el mismo disco con otro golpe. Pasos de 61/37 px sobre 240 y de 83/131 sobre 320: los
     once golpes (1-9, 14, 16) caen en lugares distintos de la tesela. Determinista: una
     etiqueta impresa no cambia al recargar. */
  .casetera--b .casete { --semilla-lado: 10; }
  .casete, .caratula, .pantalla { --golpe: calc(var(--semilla, 0) + var(--semilla-lado, 0)); }

g) Registro (1607-1638):
- El selector queda en `.marca-grande, .articulo:not(.articulo--grave) h1`.
- Al comentario se le suma un párrafo: "Desde `D-63` la tapa de un juego (el título del casete, el de la carátula, el h1 de cada juego) no lleva eco: se imprime con una sola tinta, y una tinta sola no puede quedar fuera de registro. El registro queda donde hay dos tintas de verdad: la marca de Oktubre, el artículo y la estampa".

h) Apagado, después de e) y de f) para que gane por orden:

  /* Alto contraste y colores forzados: tinta lisa y papel limpio (`D-63`). forced-colors apaga
     text-shadow solo, pero NO mask-image: si nadie lo hace a mano, la máscara sigue. */
  @media (forced-colors: active), (prefers-contrast: more) {
    .casete-titulo {
      -webkit-mask-image: none;
      mask-image: none;
    }
    .casete-etiqueta::before,
    .casete-accion::before {
      content: none;
    }
    .casete-accion {
      background: var(--tinte-sello, var(--tinte));
    }
  }

En `sitio.css` no se escribe ningún selector `.caratula-*` con pseudoelemento.

B.3 src/styles/juego.css

a) La marca (3636-3650): no cambia nada de lo que se ve. Al comentario de 3644-3647 se le saca "y el apoyo de cada disco es para el título del juego".

b) Las líneas 3651-3663 (comentario y regla del eco) se reemplazan por:

  /* El h1 de cada juego, de la misma almohadilla que su casete (`D-63`).

     Hasta `D-63` llevaba el eco de segunda tinta en el apoyo de su disco (`D-54`, `REV-18`):
     siete colores de eco en nueve juegos, y en Skayboy un crema que se leía como un segundo
     título. Ahora lleva solo la sal: tinta de color sobre el negro, sin margen para aclararse
     (la presión dejaría "Completá la letra" en 3,39:1). La tesela va al doble que en el casete
     porque la letra mide el doble, y el golpe es el del casete (`--golpe`, en `sitio.css`). */
  .pantalla h1 {
    -webkit-mask-image: var(--textura-tinta-sal);
    mask-image: var(--textura-tinta-sal);
    -webkit-mask-size: 480px 480px;
    mask-size: 480px 480px;
    -webkit-mask-position: calc(var(--golpe, 0) * -122px) calc(var(--golpe, 0) * -74px);
    mask-position: calc(var(--golpe, 0) * -122px) calc(var(--golpe, 0) * -74px);
  }

c) `.pantalla > h1` (3703-3717): sumar el colchón y su compensación.

    padding-block: 0.1em;   /* la máscara recorta en la caja: con 1,04 de interlínea, la tilde
                               de ADIVINÁ y la ¿ caen afuera (hhea de iOS 0,878/0,21) */
    margin: -0.1em 0 calc(var(--espacio-1) - 0.1em);   /* y esto la anula: el renglón no se mueve */

En `body > main:has(> .caratula) > .pantalla > h1` (4063-4066), `margin-top` pasa a `calc(var(--espacio-1) - 0.1em)`.

d) Carátula en el teléfono (3746-3804): no se toca. `.caratula-etiqueta` sigue en `display: contents`, y fuera de la media de 64 rem no se declara ningún `::before` de la etiqueta: `display: contents` no suprime los pseudoelementos.

e) Dentro de la `@media (min-width: 64rem)` existente (3811-4089):
- En `.caratula-etiqueta` (3939-3955), sumar `position: relative;` e `isolation: isolate;`.
- En `.caratula-titulo` (3970-3979), cambiar `margin` y sumar lo siguiente:

      margin: 0.15em 0 -0.05em;
      padding-block: 0.05em;   /* 1,15 de interlínea deja 0,02 em sobre la Á con hhea: se cierra acá */
      -webkit-mask-image: var(--textura-tinta);
      mask-image: var(--textura-tinta);
      -webkit-mask-size: 240px 240px;
      mask-size: 240px 240px;
      -webkit-mask-position: calc(var(--golpe, 0) * -61px) calc(var(--golpe, 0) * -37px);
      mask-position: calc(var(--golpe, 0) * -61px) calc(var(--golpe, 0) * -37px);

  Sigue sin `text-shadow`. Es un `<p>`, así que el peso ya es normal.
- Bloque anidado nuevo, dentro de la misma media:

    @supports (mask-image: none) or (-webkit-mask-image: none) {
      .caratula-etiqueta::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        pointer-events: none;
        background: var(--papel-borde);
        -webkit-mask-image: var(--textura-papel-viejo);
        mask-image: var(--textura-papel-viejo);
        -webkit-mask-size: 320px 320px;
        mask-size: 320px 320px;
        -webkit-mask-position: calc(var(--golpe, 0) * -83px) calc(var(--golpe, 0) * -131px);
        mask-position: calc(var(--golpe, 0) * -83px) calc(var(--golpe, 0) * -131px);
      }
    }

f) Apagado, después del cierre de la media de 64 rem:

  @media (forced-colors: active), (prefers-contrast: more) {
    .pantalla h1,
    .caratula-titulo {
      -webkit-mask-image: none;
      mask-image: none;
    }
    .caratula-etiqueta::before {
      content: none;
    }
  }

B.4 src/styles/skayboy.css
- En `.juego-skayboy .pantalla h1` (73-80), borrar `--tinta-registro: var(--disco-gulp-apoyo);`.
- Reescribir el comentario de 65-72: el título viste Gulp! y la sal se la pone `.pantalla h1` en `juego.css` (`D-63`). Ya no lleva eco. Va en la rotulada por la deuda del calco.
- Sumar la regla nueva `.juego-skayboy { --semilla: 4; }`. Su `<main>` no tiene clase `juego--`, la clase está en el `body`, y `.pantalla` la hereda.
- `.gabinete` (171-177) y `.fin-nivel` (1492) no se tocan: son `box-shadow` de objeto con su propia `--tinta-registro`.

B.5 Marcado y SVG
- Ningún cambio en index.astro, Caratula.astro, caratula.ts ni Base.astro.
- No hay `<svg>` en línea ni `filter: url(#…)`.

B.6 Lo que no se toca
- `.marca`, `.marca-grande` y `.caratula-marca`: son las dos tintas de Oktubre, y ahí el registro es literal.
- El h1 de artículo de la Redondopedia, `.estampa-disco`, `.papel-ficha`, `.estampa-papel` y `.ejes-tapa-etiqueta`.
- `.casete-arte--entera`: su sombra es de recorte, no de letra (D-49).
- `.primario` y su canto, la bajada, la pista, el grano global, la tarjeta compartible y la lámina.

C. Tests

C.1 src/lib/estilos.test.ts

1) Se enmienda "UX-22 §8: el registro imperfecto…" (269-303):
- Sacar `'.pantalla h1'` y `'.casete-titulo'` de `PERMITIDOS`, con un comentario: "salieron por `D-63`: la tapa de un juego se sella, no se registra".
- El test sigue en verde porque quedan `.marca-grande`, `.marca`, `.caratula-marca`, el h1 de artículo y `.estampa-disco`.
- Rojo posible: alguien vuelve a poner `.casete-titulo` en la regla del eco.

2) Helper nuevo, `bloques(css)`. Recorre las llaves con una pila de preludios y devuelve `{ selector, cuerpo, dentro: string[] }`, donde `dentro` son los `@media` y `@supports` que lo envuelven. Lleva su "ese control sabe encontrar": una hoja inventada con `@media` y un `@supports` anidado tiene que devolver los dos preludios.

3) Test nuevo: "D-63: la tapa de un juego no lleva sombra".
- Toda regla de HOJAS con algún ítem de selector que termine en `.casete-titulo`, `.caratula-titulo`, `.pantalla h1`, `.pantalla > h1` o `.casete-accion` no puede declarar `text-shadow` ni `box-shadow` distintos de `none`.
- Rojo posible: alguien le devuelve el `box-shadow` de eco al sello, o le pone `text-shadow: 0 0 1px` al título (esa sombra no la ve el test del registro).

4) Test nuevo: "D-63: la almohadilla tiene lista cerrada".
- `var(--textura-tinta)` (regex con el paréntesis de cierre, para no confundirlo con `-sal`) solo puede aparecer en `.casete-titulo`, `.caratula-titulo` y `.casete-accion::before`.
- `var(--textura-tinta-sal)` solo en `.pantalla h1`.
- `var(--textura-papel-viejo)` solo en `.casete-etiqueta::before` y `.caratula-etiqueta::before`.
- Además, cada selector permitido tiene al menos una regla con las dos formas: `-webkit-mask-image: var(…)` y `mask-image: var(…)`.
- Rojo posible: la sal llega a `.casete-baja`, a `.casete-pista` o a un rótulo LEYENDA, o se pierde la forma `-webkit-` y el título queda liso en un Android viejo.

5) Test nuevo: "D-63: cada máscara tiene su apagado en la misma hoja".
- En cada hoja, cada selector de la lista del punto 4 tiene que aparecer dentro de un `@media` cuyo preludio nombre `forced-colors` y `prefers-contrast`, con `mask-image: none` o `content: none`.
- Tiene que ser la misma hoja: entre hojas el orden de carga no está garantizado (ver 7).
- Rojo posible: alguien borra el bloque de apagado de `juego.css` y en colores forzados la máscara sigue comiendo la letra.

6) Test nuevo: "D-63: el papel viejo y el macizo del sello van dentro de @supports".
- Todo bloque con `var(--textura-papel-viejo)` o con selector `.casete-accion::before` tiene en `dentro` un `@supports`.
- Rojo posible: el `::before` del papel queda afuera, y en un navegador sin máscara la etiqueta se pinta pareja de `--papel-borde` y la pista cae a 3,66:1.

7) Test nuevo: "D-63: la carátula del teléfono no tiene papel encima".
- En `juego.css`, todo bloque cuyo selector nombre `.caratula-etiqueta::before` o `::after` está dentro de `@media (min-width: 64rem)`, salvo que declare solo `content: none`.
- En `sitio.css` no hay ningún selector `.caratula-…::before/::after`.
- Rojo posible: el pseudo declarado fuera de la media pinta una mancha absoluta sobre la calcomanía, donde la pista corta va en `--texto-tenue` y queda en ~1,5:1. Además depende del orden entre hojas: las páginas importan juego y después sitio, Vite sirve sitio primero en el build, y en dev es al revés.

8) Test nuevo: "el título del casete pide la rotulada en su peso".
- La regla `.casete-titulo` de `sitio.css` que declara la rotulada tiene `font-weight: normal|400`. Es el gemelo de 1248-1260.
- Rojo posible: alguien borra la línea y el `<strong>` vuelve a engordar Archivo Black.

9) Opcional: `.casete-pronto` no usa `--texto-tenue`.

C.2 src/lib/texturas.test.ts (nuevo, con sharp, que ya es devDependency y usa `multitud.test.ts`)

Lee `tokens.css` y extrae cada `--textura-[a-z-]+: url("data:image/svg+xml,…")`.

Para todas las texturas, `grano` y `rodillo` incluidas:
- no hay `#` crudo y todo `%` va seguido de dos hex;
- `decodeURIComponent` no falla;
- empieza con `<svg` y termina con `</svg>`;
- cada `url(#x)` tiene su `id='x'`;
- después de decodificar no queda ningún `#` fuera de `url(#…)`, ni `rgb(` ni `fill=`;
- rasterizado con sharp a density 72, no sale vacío.

Solo para las tres de D-63, chequeo estático:
- el `<filter>` tiene `x='0' y='0' width='1' height='1'`;
- todo `feTurbulence` tiene `stitchTiles='stitch'`;
- el `<svg>` tiene `viewBox`;
- motivo, en comentario: librsvg no cose (con y sin región da igual) y Chromium sí (medido: 29 saltos contra 91), así que la costura no se puede medir rasterizando con sharp.

Bandas medidas, a density 72, donde 1 px = 1 px CSS con `mask-size` igual a la tesela:
- tinta:
  - huecos (alfa < 0,5) entre 2 % y 6 % (hoy 3,50);
  - alfa en [0,5, 0,78) ≤ 1,5 % (hoy 0,50: solo el borde de los huecos, no tinta aguada);
  - peor bloque de 12×12 ≤ 25 % (hoy 19,4);
  - media ≥ 0,92 (hoy 0,946).
- sal:
  - huecos entre 2 % y 6 % (hoy 3,43);
  - alfa intermedia entre 0,05 y 0,95 ≤ 3 % (hoy 1,47).
- papel:
  - alfa máxima ≤ tope + 1/255, con el tope leído del último `tableValues`;
  - cobertura (alfa > 0,02) entre 6 % y 30 % (hoy 12,7): ni invisible ni velo.

Rojo posible:
- un `%23` mal escapado deja la máscara vacía y el título desaparece;
- alguien baja k4 a 36 y los huecos pasan del 6 %;
- se borra la región del filtro.

C.3 src/lib/contraste.test.ts

Test nuevo: "D-63: la tinta de sello y la mano, sobre el papel viejo y con el grano encima". Es el mismo patrón que `--peso-pasada`.

Helpers:
- `textura(nombre)` decodifica el data-URI;
- `tablas(svg)` devuelve los `tableValues` de cada `feFuncA type='table'`;
- `mezclar(frente, fondo, alfa)` en sRGB, como `pisoDePasada`;
- `grano` sale de `sitio.css` con `/\.con-grano::after\s*\{[^}]*opacity:\s*([\d.]+)/`, hoy 0,13.

Cuentas:
- `tope` = máximo de la última tabla de `--textura-papel-viejo` = 0,18.
- `papelPeor` = mezclar(papel-borde, papel, tope) = #e7ddc6.
- `presión` = mínimo de la tabla de `--textura-tinta` = 0,8.
- `conGrano(c)` = mezclar('#000000', c, grano).

Pares que tienen que dar 4,5:1 o más:

| Par | Hoy |
|---|---|
| Título: conGrano(mezclar(fondo, papelPeor, presión)) contra conGrano(papelPeor) | 7,04 |
| Bajada: conGrano(fondo) contra conGrano(papelPeor) | 10,64 |
| Pista y "en la cocina": conGrano(papel-tenue) contra conGrano(papelPeor) | 4,55 |

Para los nueve sellos, `fondo` contra mezclar(tinta, papelPeor, presión). Va sin grano, que es la convención de los pares de sello que ya existen:
- marca-rojo 5,67;
- disco-luzbelito-tinta 7,63;
- cat-mitologia 8,51;
- cat-historia 6,10;
- disco-momo-sampler-tinta 13,45;
- cat-letras 5,81;
- disco-bang-bang-estas-liquidado-tinta 10,17;
- cat-discos 6,86;
- disco-un-baion-para-el-ojo-idiota-tinta 7,54.

En todos el relleno gastado sube el contraste respecto del pleno.

Rojo posible:
- el tope del papel sube a 0,20 y la pista con grano da 4,499;
- la presión baja a 0,6 y el título con grano da 4,09;
- alguien sube el grano global a 0,16.

C.4 Verificación

La corre el hilo principal: los roles que escriben no pueden correrla (D-12).

  node --test src/lib/estilos.test.ts src/lib/contraste.test.ts src/lib/texturas.test.ts src/lib/movimiento.test.ts src/lib/voz.test.ts
  npm test
  npm run build

`movimiento.test.ts` y `voz.test.ts` no cambian: no hay `@keyframes` ni textos nuevos.

D. Papeles

D.1 Docs/DECISIONES.md, al final

## D-63 — Las tapas de los juegos se sellan: sale el eco, entra la tinta gastada sobre papel viejo

- **Fecha:** 2026-10-05
- **Estado:** aceptada — pedido directo del usuario, con la captura del Lado A, textual:
  *"Saquemosle la sombra a las letras de las tapas de los juegos, busquemos un efecto mas de
  impresion vieja sobre papel o sello, algo asi como tinta en papel viejo o eso. Ponete en rol de
  diseñador. Ademas que queden todas coherentes."* Lo hizo el hilo principal en la rama
  `diseno/fondo-multitud`, después de guardar `D-62`.
- **Consume y enmienda:** `D-33` consecuencia 1 (el registro deja el título de casete y el h1 de
  juego), `D-54` punto 5 y consecuencias (se retira "el eco del título en el apoyo" de `REV-18` /
  `FIND-109`; el título único de los ocho juegos sigue), `UX-22` §8 (propuesta a `experiencia`
  en `Docs/SUGERENCIAS/HILO-para-experiencia-la-tapa-se-sella.md`), `UX-04` (la textura de
  serigrafía en la rotulada, que pedía "nunca vector limpio"), hoja 07 del lienzo.
- **Lo que había.** El título de cada casete llevaba el eco de `UX-22` §8 en el apoyo de su disco,
  y los apoyos se eligieron para ir sobre el negro, no sobre papel. En nueve casetes había siete
  ecos distintos: dos marrón casi negro (A1 y A5, que no fijaban apoyo), uno crema sobre crema
  que no se veía (A4, 1,02:1), y el resto petróleo, topo, ocre, acero o azul. La carátula, que es
  la misma etiqueta, ya iba sin eco. El h1 de cada juego repetía el mapa, con el crema de Gulp!
  en Skayboy leyéndose como un segundo título (14,59:1).
- **Decisión.** La tapa de un juego se imprime con una tinta. Una tinta sola no puede quedar
  fuera de registro, así que el eco se va del título de casete, del de la carátula y del h1 de
  cada juego. En su lugar, las piezas salen de la misma almohadilla de goma medio seca:
  - le faltan puntos de tinta (la sal) y zonas donde la mano aflojó (la presión, de 1 a 0,8);
  - los huecos se juntan donde aflojó;
  - la etiqueta es papel viejo: manchas de humedad en escalones duros y pecas, en
    `--papel-borde`, con techo 0,18;
  - el sello de acción pierde su eco y su macizo sale moteado de la misma almohadilla, con el
    filete y la letra enteros;
  - el h1 lleva solo la sal, porque es tinta de color sobre el negro y no tiene margen para
    aclararse.
  Lo único que cambia de un casete a otro es dónde apretó la mano: `--semilla` en el mapa de
  variantes, más el lado. Por eso el casete del portal, su carátula y el h1 de su juego tienen
  el mismo golpe.
- **Cómo.**
  - Tres texturas en `tokens.css`: `--textura-tinta`, `--textura-tinta-sal` y
    `--textura-papel-viejo`. Son alfa sola y van como máscara, con región de filtro 0/0/1/1
    para que la tesela cosa.
  - En `sitio.css` y `juego.css`: máscara sobre el mismo nodo de texto (nada se lee dos veces),
    papel y macizo en `::before` dentro de `@supports`, apagado en `forced-colors` y
    `prefers-contrast: more` en cada hoja.
  - `font-weight: normal` en `.casete-titulo`: el `<strong>` le ponía negrita falsa a Archivo
    Black.
  - "En la cocina" y la pista pasan a `--papel-tenue`: lo escrito a mano no se gasta.
  - La opacidad del casete pendiente pasa a la pieza: la pista ya estaba en 4,53:1.
- **Alternativas descartadas.**
  - **El eco en una sola tinta para todos.** Es coherente, pero sigue siendo una sombra, y el
    pedido es sacarla.
  - **La fotocopia** (tóner con motas). El tóner seco no es tinta ni sello, y las motas negras
    detrás de la bajada se leían como tildes y puntos.
  - **Letterpress con mancha amarilla** (`#e5d5b0`). Era un hex nuevo, y la pista bajaba de AA
    con el grano.
  - **Filtro SVG con desplazamiento.** Es el único que come el contorno, pero Safari ablanda el
    texto y depende del DPR.
  - **Tinta al 90-95 % con filete de 0,5 px.** A 1× agrisa y ablanda el borde.
  - **Fuente gastada.** Todas las A se gastarían igual.
- **Consecuencias.**
  - Salen `.casete-titulo` y `.pantalla h1` de la lista cerrada del registro.
  - Entra `texturas.test.ts`, que rasteriza cada textura con sharp y acota la cobertura: una
    máscara rota borraría el título.
  - Entra un par nuevo en `contraste.test.ts`: tinta, mano y sellos sobre el papel peor, con el
    grano encima. La pista queda en 4,55:1, y por eso el techo del papel no puede subir de 0,18.
  - El sello de Momo es plata, más clara que el papel, y casi no muestra el desgaste. Es lo que
    hace una tinta clara sobre papel claro, y se acepta así.
  - La marca, el h1 de artículo y la estampa conservan el registro.
  - Queda pendiente pegar la almohadilla en la hoja 07 del lienzo (`T-411`, como `T-319`).
    Pegarla exige republicar el lienzo, y eso lo decide el usuario.
  - Hallazgo aparte: `--textura-grano` y `--textura-rodillo` no tienen la región de filtro y
    pueden dejar costura cada 140 y 240 px.

Además:
- IDS.md: una fila para D-63 y T-411.
- ESTADO.md: al cerrar la ráfaga.

D.2 Docs/SUGERENCIAS/HILO-para-experiencia-la-tapa-se-sella.md (UX-22 es de `experiencia`)

- §8, primer párrafo: la lista pasa a ser "la marca, los títulos de artículo de la Redondopedia, la estampa", con la nota "desde D-63 el título de casete, el de la carátula y el h1 de cada juego se sellan con una tinta".
- Tabla de "Dónde sí, dónde no": la fila "Título de casete…" y la fila "h1 de cada juego" pasan a la columna de no, con el motivo "una sola tinta, D-63".
- §8.1 nuevo, "La almohadilla":
  - Va en: título de casete, título de carátula, h1 de juego (solo la sal) y macizo del sello, con el filete y la letra intactos.
  - Nunca va en: cuerpo de texto, la pista ni "en la cocina" (son mano), rótulos de registro 3, acierto o error, ni los tres artículos graves.
  - La regla de oficio: "la tinta puede faltar, nunca aguarse por debajo de 0,8".
- §13: catalogar `--textura-tinta`, `--textura-tinta-sal` y `--textura-papel-viejo` como estáticos.

D.3 Comentarios a actualizar

sitio.css 1016-1021 y 1607-1632; tokens.css 245-251; juego.css 3644-3647 y 3651-3660; skayboy.css 65-72.

E. Qué mirar en el navegador para aceptar o ajustar

Dónde mirar:
- Portal a 375×812 en DPR 3 (`--force-device-scale-factor=3`), a 1024 y a 1440. Los once casetes, lado B incluido (golpes 16 y 14).
- Carátula a 1280 o más en los nueve juegos.
- El h1 de cada juego a 375 (26-34 px) y a 1440 (2,6 rem). Las cuatro portadas sobre tapa velada: adivinar-el-tema, adivinar-por-la-letra, adivinar-la-tapa y la portada de completar-la-letra.
- Skayboy.
- Todo dos veces: en `astro dev` y en `build` + `preview`, porque el orden entre hojas se invierte.

Casetes críticos:
- A2, ¿QUÉ TIPO DE RICOTERO SOS?: la ¿ y la É no se cortan, ni en dos renglones ni en la carátula.
- A6, Completá la letra: la Á, el sello letras (el par más justo), el h1 naranja con sal.
- A3, A8 y A9: la Á de ADIVINÁ y MÁS sin recorte en el h1.
- A5, Momo: el sello plata casi liso es lo esperado.
- A4: sin eco crema ni en el casete ni en el h1 rojo de Skayboy.
- A1: el rojo de marca moteado.
- La carátula del teléfono, la calcomanía: sin manchas ni renglones encima.

Criterio de aceptación:
- A un brazo de distancia los once títulos se leen como tinta de sello sobre papel, todos con la misma mano, y ninguno con sombra.
- Ninguna letra pierde un trazo entero.
- El papel se ve tocado pero no sucio.
- Nada se mueve: el layout es idéntico al de antes, píxel a píxel, salvo el título del casete, que queda más fino por el `font-weight` (puede reflujar un renglón).

Perillas y rangos (si se toca un valor, se corre `texturas.test.ts` y `contraste.test.ts`):
- Sal, k4 en `--textura-tinta` y `--textura-tinta-sal` (siempre el mismo valor en las dos): 37,8. El rango es de 37,0 (5,1 % de huecos) a 38,2 (2,9 %). Más desgaste, bajarlo.
- Presión:
  - umbral pk (el 5,8 de la `feColorMatrix`): de 5,4 (11 % de la tinta bajo 0,85, más manchado) a 6,2 (2 %);
  - piso de `tableValues`: 0,8, entre 0,7 y 0,9 (con 0,6 falla el test);
  - frecuencia 0,035 × 0,055: subirla achica las zonas.
- h1, `mask-size`: 480 px. El rango es de 400 a 720 px enteros. Más grande, huecos más gruesos.
- Papel:
  - tope 0,18 (el techo duro es 0,19; menos de 0,12 casi no se ve);
  - mb −1,55: −1,45 da más manchas y −1,75 menos;
  - pecas pb −10,1: −9,8 da más.
- Corrimiento del sello (−120 / −70 px): solo si un JUGÁ cae en una zona muy hueca.

Controles técnicos:
- DevTools, Rendering, Paint flashing mientras se desplaza el portal: sin destellos sobre los títulos.
- Layers: los títulos no tienen capa propia.
- Emular `forced-colors: active` y `prefers-contrast: more`: tinta lisa, papel limpio y sello lleno.
- Performance con la CPU 6× más lenta: primera pintura con y sin la receta.

F. Riesgos abiertos

1. Safari y Firefox no están medidos. feTurbulence está especificado y las texturas leen el alfa, que es lo más estable entre motores, pero hay que mirarlo en un iPhone y en un Android con DPR 2,625 o 2,75: densidad de huecos, costura y nitidez del texto enmascarado dentro de un padre girado.
2. Si una textura se rompe, el título desaparece: una máscara que no carga cuenta como negro transparente. Lo cubre `texturas.test.ts`. No hay CSP que bloquee `data:`, y las texturas actuales ya lo prueban.
3. El papel viejo queda sutil por construcción. Lo frena la pista en `--papel-tenue`, que con el grano tiene 0,05 de margen. Si el usuario quiere más envejecido, el camino es una tinta de pista más oscura o un tono de mancha más amarillo, y los dos son color nuevo: pasan primero por el lienzo.
4. El lienzo queda atrás del código (T-411). Es el mismo caso que D-54 con la hoja 15.
5. La marca (`.marca`, `.marca-grande`, `.caratula-marca`) sigue con eco. Si "las letras de las tapas" incluía la marca para el usuario, es una línea por selector, pero contradice D-33 y conviene preguntarle.
6. El h1 se puede separar del resto: se puede revertir solo b) y c) de juego.css y B.4 sin romper nada, a costa de que la puerta y el juego dejen de compartir tratamiento.
7. Cosméticos:
   - la selección de texto queda moteada;
   - en Windows a 1× la máscara pasa el texto a suavizado en grises;
   - no hay que agregar `will-change` ni animar el `transform` de `.casete` o `.caratula`, porque el texto enmascarado se ablanda.
8. Costo estimado, no medido en un teléfono: tres teselas compartidas, unos 6 MB a DPR 3. Hay 33 cajas con máscara en el portal, todas estáticas, que se pintan una vez.
9. D-62 sigue sin commitear en el mismo worktree y toca sitio.css. Se guarda primero, en un commit propio, avisándole al usuario antes.
10. Hallazgo para otra tarea: `--textura-grano` y `--textura-rodillo` no tienen la región de filtro. Es probable que la costura se vea en `.rodillo` y en `.pasada-pie`.