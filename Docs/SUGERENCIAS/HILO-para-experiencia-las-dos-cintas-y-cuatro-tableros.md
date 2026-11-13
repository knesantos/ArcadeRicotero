# Para `experiencia`: las dos cintas del portal y cuatro tableros retocados

> Lo escribe el hilo principal el 2026-11-04, después de construirlo y medirlo (rama
> `ui/home-y-cuatro-juegos`). Es una propuesta para que `experiencia` lo lleve a sus hojas, lo
> corrija o lo tire: `UX-25` (el portal), `UX-08` (Sacalo por la letra), `UX-36` (la noche de
> dos ejes) y la carátula de `UX-35`. Lo medido se midió en un navegador de verdad a 375 × 812 y
> a 1280 × 800; lo que diga "cuenta" lo derivé sin correr nada.
>
> Pedido del usuario, textual: *"Hace una mejora sustancial de ui/ux de la pagina. El home y los
> primeros 5 juegos."* Skayboy y Poligirl (A4) quedó afuera: otra sesión lo estaba rehaciendo
> entero (`skayboy/mejora-total`).

## 1. El portal: las dos cintas

**Lo medido antes.** A 375 × 812, con el afiche de noviembre puesto (`D-84`, `D-85`): la marca y
la bajada ocupaban 320 px, el afiche 545, y el lado A arrancaba en **900 px**; el lado B, en
**1850**. El que llega a leer la Redondopedia baja dos pantallas y media. Y la bajada dice,
textual, "estás en la puerta, con las dos cintas": nombraba algo que no se podía tocar.

**Lo construido.** Dos tiras de cinta adhesiva debajo de la bajada (`nav.cintas`, `a.cinta`),
una por lado, con el lado grande arriba ("LADO A") y para qué es debajo ("PARA JUGAR"), partido
en el punto del mismo rótulo de siempre (`PORTAL.ladoA`, `PORTAL.ladoB`). Son anclas a
`#lado-a` y `#lado-b`, sin JavaScript. Visten la cinta de `.volver` —tinta `--fondo` sobre
`--papel` al 88 %—, que es un par que `contraste.test.ts` ya mide; el "para qué" va en
`--papel-tenue`, el par de la pista del casete. Miden 164 × 51 px cada una (zona de pulgar) y
cuestan 60 px de alto en el frente. En la mesa (≥ 64 rem) quedan en la columna de la marca.

**Lo que no hace.** No mueve el afiche ni lo pliega: `D-84` lo puso entre la marca y la
casetera y ahí sigue. No es un menú ni una barra pegada: dos cintas pegadas, que es lo que la
bajada ya decía.

**Lo que `experiencia` puede decidir.** Si merece entrar en `UX-25` como cuarto bloque del
presupuesto; si en la mesa sobran (ahí el lado A está a la vista sin bajar nada) y conviene
esconderlas desde 64 rem; y si el "para qué" debería ser la primera oración de la bajada del
lado en vez del rótulo.

## 2. El casete, 12 px más angosto por los costados

`UX-25` §2.5 dejó el casete con 12 px de relleno parejo y 14 de corrimiento alternado, y el
título en 0,95 rem con 0,05 em entre letras. Medido así: la columna del título daba **193 px**,
y siete títulos de trece iban en dos renglones.

Cambios: relleno lateral 10 px (el de arriba y abajo sigue en 12), corrimiento 10, etiqueta
con 12 px a los costados (era 16) y el título con 0,02 em entre letras. La columna pasa a
**213 px** y cinco de esos siete títulos entran en un renglón; quedan en dos "¿Qué tipo de
ricotero sos?" (26 letras) y "Preguntas ricoteras", cuyas versales son más anchas. Un casete de
título corto mide 132 px en vez de 149. **No se tocó lo que `UX-25` decidió**: una columna, el
sello debajo de la bajada, la bajada cortada en el punto.

## 3. La carátula: la marca, una sola medida

`.marca` en `juego.css` medía `clamp(7.5rem, 36vw, 9.5rem)`, y "Adiviná el tema" y "Sacalo por
la letra" la achicaban por su cuenta con una regla del logotipo escrito, anterior a `D-82`
(`font-size` y `max-width: 7ch` sobre una imagen). Resultado medido: la FR salía de cuatro anchos
en cuatro juegos, y en "¿Qué tipo de ricotero sos?" el botón de empezar terminaba en **1265 px**,
debajo del pliegue de 812.

Ahora es una sola: `clamp(6.5rem, 30vw, 8rem)` —113 px a 375— con el aire de arriba en
`--espacio-2` y el de abajo en `--espacio-1`. El botón de esa carátula termina en 633. La FR es
la firma de la carátula; el titular es el nombre del juego (`D-54`).

## 4. "Sacalo por la letra": el verso en el medio

`UX-08` §4 pide tres franjas: cabecera fija, hoja que crece, buscador en la zona del pulgar. El
código lo cumplía con la hoja del alto de sus versos pegada arriba y `margin-bottom: auto`.
Medido en el primer escalón: el verso terminaba en **140 px** y el buscador arrancaba en
**650**. Medio tablero de negro.

Cambio: el margen automático se reparte —arriba en el rótulo ("TENÉS 1 VERSO · VALE 100") y
abajo en la hoja—, así el bloque viaja junto al medio de la banda; la hoja tiene un piso de
8 rem con el verso centrado adentro, y el verso sube a 1,15 rem. Con ocho versos los márgenes
se agotan y la hoja scrollea como antes (medido: ocho versos a este cuerpo, ~290 px, entran).
El buscador no se movió. Con el teclado abierto (`partida--tecleando`) el rótulo vuelve a
pegarse arriba y la hoja recupera su piso de 4,5 rem. **Falta probarlo con un teclado de
verdad.** Es la nota que `UX-08` puede absorber o rechazar; "los versos acumulados son la
barra" sigue valiendo, solo que crecen desde el medio.

## 5. "¿Qué tipo de ricotero sos?": la hoja centrada y las hojas de la noche

Medido: la hoja de la pregunta terminaba en 400 px y las dos opciones —lo único que se toca en
toda la noche— caían entre **250 y 370 px**, lejos del pulgar (`D-09`). En el teléfono y la
tableta (hasta 52 rem) `#pregunta` es ahora una columna de una ventana con la hoja centrada:
las opciones quedan entre 425 y 550. En la mesa no cambia nada: hay mouse, y la hoja arriba
deja el pie a la vista.

Y en la cabecera de la hoja, entre el sello del momento y el folio, **cinco casillas, una por
momento** (pasada: llena en `--papel-tenue`; actual: llena en `--fondo` con borde grueso; por
venir: hueca). Es la misma fila de casillas que marca los temas en los juegos de audio y de
letra: forma además de tinta, sin voz (el folio y el anuncio ya dicen dónde estás). `UX-36`
§3 ya hablaba de "las hojas de la noche" en la tapa; esto es la misma idea adentro de la
partida. Si `experiencia` prefiere que las casillas lleven el nombre del momento al tocarlas,
es un paso más; hoy son solo para el ojo.

## 6. "Completá la letra": de dónde sale el verso, en voz baja

El renglón "De "Aquella solitaria vaca cubana", en Un baión para el ojo idiota" salía en las
versales de la cabecera, en negrita de `.micro`, en tres renglones, y pesaba más que la pregunta.
Es contexto (`BR-03`): va en `--fuente`, 0,95 rem, tenue, en su propio renglón. El texto no
cambió una letra.

## 7. Lo que no se tocó, y por qué

- **Skayboy y Poligirl**: otra sesión, misma pantalla. Cuando cierre `skayboy/mejora-total`, la
  carátula de ese juego es la única que no lleva el `h1` en la letra de disco ni la línea que
  canta, y conviene mirarla con esta vara.
- **"Adiviná el tema"** en partida: no encontré nada que corregir. Se probó entera con puntero
  (escribir, elegir de la lista, arriesgar, pasar) y la columna del teclado hace lo que dice.
- **Las pantallas de resultado** de los cuatro juegos: no se auditaron en esta pasada.

## Cómo se verifica

```
npm test && npm run check && npm run build
```

Y en el navegador, a 375 × 812: en `/`, tocar "LADO B" tiene que dejar el rótulo del lado B
arriba con aire; en `/juegos/dos-ejes/` la hoja de la primera pregunta tiene que estar centrada
con cinco casillas y la primera llena; en `/juegos/adivinar-por-la-letra/` el primer verso tiene
que quedar a media pantalla y el buscador abajo.
