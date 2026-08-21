# Propuesta del hilo principal para `experiencia` — el portal collage y dos deudas de circuito

> Contexto: el usuario pidió (2026-08-21) el esqueleto navegable del sitio con estética
> de collage de cassette — recortes de tapas pegados unos sobre otros, la mosca volando,
> la gente con banderas de fondo. El hilo principal lo construyó aplicando `UX-04` (las
> técnicas fichadas de Rocambole: collage, serigrafía, grano — `RES-06`) y la mezcla
> `D-19`. Estas decisiones de diseño son en última instancia tuyas (`UX-04`, y el mapa
> sección→disco es tuyo por la regla de marca): esto documenta qué se decidió para que lo
> bendigas o lo corrijas.

## Lo que se decidió y dónde vive

- **La metáfora del portal:** un cassette grabado en casa. Lado A los juegos, lado B la
  lectura. Cada "casete" es una tarjeta con etiqueta de papel (tinta sobre papel, con
  renglones), cinta adhesiva y rotación leve alternada. `src/styles/sitio.css`.
- **Mapa de vestimenta aplicado (extiende `D-19`):** preguntas ricoteras=Oktubre (marca),
  adivinar el tema=Lobo suelto, completar la letra=La mosca y la sopa, adivinar la
  tapa=Último bondi, Redondopedia=Gulp!. En la Redondopedia los tipos heredan:
  hito/persona=historia, disco=discos, concepto/leyenda=mitología. **Esto es lo más
  opinable de todo — el mapa es tuyo.**
- **El rótulo visual de `BR-08` en prosa** (tu pendiente del PRD): el párrafo leyenda se
  corre con borde tiza a rayas y el rombo ◆ de siempre; el testimonio con celeste y ❝ más
  "Lo contó [quien]"; el hecho lleva su ficha `RES` al final en chip chico. Mismos
  códigos del quiz — no se disfrazan de disco, como manda la regla de marca.
- **Recortes reemplazables:** los huecos del collage están cableados
  (`src/lib/sitio/arte.ts`) y el **despiece de 15 piezas** con fundamento de ficha está
  en `public/arte/README.md` (qué recortar de cada tapa, dónde se pega, qué está
  prohibido — ej. recomponer perro+televisor+muñeco de *Un baión*, o usar el esclavo de
  *Oktubre* que sigue sin verificar). Mientras tanto hay 5 dibujos de reemplazo propios.
- **Movimiento:** una sola pieza animada (la mosca, vuelo errático en loop de 17 s, se
  congela con `prefers-reduced-motion`); todo lo demás estático. Zona pulgar respetada:
  la acción principal de cada pantalla es un bloque abajo (`.accion-abajo`).

## Agregado 2026-08-21: la corrida anti-slop también tocó componentes tuyos

Pedido directo del usuario: eliminar todo tic de interfaz genérica de IA. La regla nueva
quedó en `.claude/rules/diseno-marca.md` (sección "Prohibido: la estética genérica de
IA") y parte se audita a máquina en `estilos.test.ts`. Lo que cambió en componentes que
derivan de la hoja 08 del lienzo, para que lo bendigas o lo corrijas:

- **Chips**: `.categoria`, `.insignia` y `.spotify` pasaron de pastilla cápsula
  (`border-radius: 999px`) a sello de esquina casi viva (3px). Los símbolos ◆/❝ y el
  borde de forma quedaron intactos.
- **`.feedback`**: la barra lateral de acento (el callout genérico) pasó a borde
  completo teñido por el estado. La señal no-cromática la siguen dando las palabras del
  micro (B1/B2) y los símbolos ✔/✕ de las opciones.
- **`--radio` bajó de 14px a 4px** (papel cortado, no burbuja). Es un token: falta
  reflejarlo en el lienzo, hoja 03/07.
- **Las piezas del collage perdieron la superficie "elevada"**: `.casete`, `.cocina` y
  `.tarjeta-articulo` van con fondo transparente y se recortan por borde grueso y cinta.
  Además de sacar el tic, arregla un dato duro: `cat-letras` sobre `--fondo-elevado` da
  **4,32:1 y no llega a AA**; sobre `--fondo` (5,03:1+) todos los pares pasan y ya están
  testeados.

## Las dos deudas de circuito (la regla de marca las exige)

1. **Dos tokens entraron a `tokens.css` sin pasar antes por el lienzo:** `--papel`
   (#ede4ce, etiqueta de cassette; par `tinta sobre papel` ya en el test AA, 18 pares) y
   `--textura-grano` (ruido SVG embebido, solo alfa). El circuito dice diseño→código,
   nunca al revés: falta agregarlos a la hoja 07 (línea y textura) del lienzo, junto con
   la metáfora cassette. Hasta entonces, esta es la anotación que la regla pide.
2. **La hoja 09 (pantallas) no muestra el portal.** Si el lienzo suma una pantalla de
   portal collage, el circuito queda cerrado del todo.
