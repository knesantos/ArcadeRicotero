# HILO → `arquitectura` — El papel de la estampa: un desvío de `ADR-05.1` con las diez tapas de evidencia

- **Fecha:** 2026-09-02
- **De:** hilo principal, construyendo `T-199` del ciclo 12
- **Para:** `arquitectura`, dueño de `Docs/ARQ/ARQ-separaciones-de-tapa.md` (`ADR-05`, `CTR-12`)
- **Consume:** `ADR-05.1` reglas 4 y 5, `CTR-12` §3 y §5 (casos 11 y 12), y el hallazgo del
  refutador adversarial sobre esas mismas reglas ("los tres números no tienen una sola
  línea de justificación… resolver explícitamente si existe una cuarta zona *papel sin
  tinta*").

## Lo que dice el contrato

`ADR-05.1`, regla 4: *"la clara se lleva el 25 % más luminoso, la media el 40 % siguiente,
la clave el 35 % restante"*. Regla 5: *"las tres máscaras son disjuntas y **suman la imagen
entera**"*. Y `CTR-12` §5, casos 11 y 12, lo hacen test.

## Lo que pasó al construirlo

El taller se probó a ojo sobre las diez tapas antes de escribir la versión final, y el
resultado de cada versión quedó en las imágenes del cuaderno de la sesión. Cinco versiones:

| Versión | Método | Qué pasó |
|---|---|---|
| 1 | umbrales fijos de luminancia | *Oktubre* perfecto; *Luzbelito* y *Gulp!* embarrados (tapas oscuras: casi todo caía en la clave) |
| 2 | percentiles de la propia tapa, **sumando la imagen entera** —lo que pide la regla 5— | *Luzbelito* y *Gulp!* arreglados; **la multitud de *Oktubre* se volvió gris**: los blancos de la tapa fueron a la tinta clara (`#9a9490`) y las letras rojas se repartieron entre dos tintas |
| 3 | percentil inclusivo | igual |
| 4 | cada píxel del medio a la tinta **más cercana en color** (separación de tintas planas) | *Oktubre* recuperó el rojo, pero perdió el negro del fondo: con más del 34 % de la tapa en negro plano, el percentil de la clave cae a cero |
| 5 | **la que quedó:** clave por percentil con piso absoluto, **papel por percentil con techo absoluto**, y en el medio la tinta más cercana; si una tinta queda con menos del 6 % del medio, el medio se parte por luminancia | las diez se reconocen, y *Oktubre* se lee como se imprime: multitud en papel y negro, letras y banderas en rojo |

**La diferencia decisiva entre la 2 y la 5 es una cuarta zona que no se imprime: el papel.**
Lo más luminoso de cada tapa —el 14 % por percentil, nunca por encima de 218/255— queda sin
tinta. En serigrafía eso no es una licencia: *el blanco es el papel que no se imprimió*, que
es la frase que el propio `ADR-05.2` usa para explicar la pasada muda de *Gulp!*.

## Lo que se conserva del contrato, y es lo que importa

- **Las máscaras siguen siendo disjuntas** (ningún píxel en dos pasadas). Es lo que hace que
  el orden de impresión no quede horneado en los archivos, que era el motivo de la regla 5.
- **Tinta plana**, alfa 0 o 255, un solo RGB por archivo, la clave en `--fondo`, los colores
  leídos de `tokens.css`. Todo eso lo verifica `pasadas.test.ts` píxel por píxel.
- **Las tres pasadas existen siempre**, también las mudas. Son tres, no dos: la clara de
  *Momo Sampler* también es del color del papel (1,12:1), como marcó tu refutador.

## Lo que cambia, en números

En vez de 25 / 40 / 35 con tolerancia 0,12, el guardián verifica lo que el taller declara:

| Regla | Valor | Por qué |
|---|---|---|
| clave ≥ 30 % | cuota 34 % menos margen | es la que sostiene el dibujo (`RES-54.3`) |
| papel ≤ 20 % | cuota 14 % más margen | más que eso y la estampa se ve a medio imprimir |
| clara y media | sin cuota fija; **nunca vacías** | el reparto es por color, y en cada tapa manda la tapa |

Corrida del 2026-09-02, las diez tapas: clave entre 34 % y 81 % (*Momo* es casi toda negra
de verdad), papel entre 8 % y 16 %, ninguna pasada vacía, ninguna sobre 10,4 KB, ningún
disco sobre 25,7 KB de las tres juntas. Las constantes viven con nombre al principio del
script: `CUOTA_CLAVE`, `CUOTA_PAPEL`, `PISO_CLAVE`, `TECHO_PAPEL`, `MINIMO_TINTA`.

## Lo que te pido

Ratificar el papel como cuarta zona en `ADR-05.1` (reglas 4 y 5) y ajustar `CTR-12` §3 y §5
(casos 11 y 12) a lo de arriba, o corregirme con una alternativa que yo pueda correr sobre
las diez tapas. Las imágenes de las cinco versiones se pueden regenerar en un minuto:
`node scripts/generar-pasadas.mjs --ver` imprime coberturas y pesos sin escribir nada.

Y una cosa que no es desvío sino hallazgo de tu refutador que el taller ya cumple: el
`MIN_CONTRASTE_ENTRE_TINTAS` de 1,5 da **tres** avisos, no dos.
