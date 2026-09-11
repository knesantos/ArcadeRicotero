# Ensayo — Skayboy y Poligirl

> Hecho el **2026-09-11** por el hilo principal, a pedido del usuario, sobre el
> relevamiento `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md` y la ficha `IDEA-14`
> (`Docs/PRODUCTO/PRD-backlog-ideas.md`).
>
> **Esto no es una pieza de producción y no promueve `IDEA-14`.** `BR-16` sigue en pie: la
> idea no tiene criterio Given/When/Then ni piso de ítems, así que no traza `T-XX`. Acá no
> hay página del sitio, ni isla, ni copy, ni motor, ni física. Hay cuatro archivos para
> mirar.
>
> Vive en `public/` y **no en `src/pages/`** a propósito: una ruta nueva de Astro entra al
> censo de `rutas-sonoras.ts`, y cuando esto se dibujó ese código del ciclo 14 todavía estaba
> sin commitear. Un ensayo no toca trabajo ajeno en vuelo. (El ciclo 14 quedó guardado
> después, en `dde6a59`.)

## Qué hay

| Archivo | Qué es |
|---|---|
| `index.html` | La lámina para mirar. Se abre en `/arte/ensayo/index.html` con el sitio andando |
| `ensayo-pantalla.svg` | La pantalla armada, 812×375 — el teléfono en horizontal, que es como `IDEA-14` se juega |
| `skayboy.svg` | La figura quieta, sola |
| `poligirl.svg` | La otra, al mismo peso |

## La pregunta que contesta, y la que no

**Contesta una sola:** si un sprite se puede dibujar en el idioma de este sitio sin caer en
el vector liso que veta `public/arte/README.md`. La respuesta es que sí, y el mecanismo es
que el borde no sea una curva limpia: `feTurbulence` + `feDisplacementMap` desplazan el
contorno, que es como se rompe un papel recortado a mano. Lo demás es lo de siempre —
silueta cerrada, tinta plana, huecos de recorte, nada perfectamente derecho (`UX-04`).

**No contesta:** cuánto dura un nivel, si el esquema de dos manos funciona en la mano, ni si
el juego cierra en dos o tres minutos. Eso se mide jugando, no mirando.

## Los tres hallazgos, que valen más que el dibujo

1. **`sharp` no puede rasterizar esto.** Medido el 2026-09-11: se rasterizaron las dos
   figuras a 256×384 con el `sharp` que el repo ya tiene como dependencia transitiva de
   Astro, y librsvg **no implementa `feDisplacementMap`** — devolvió la silueta plana, sin
   borde, con el grano convertido en un rectángulo gris. Los PNG se borraron. El sprite que
   llegue al teléfono tiene que ir rasterizado igual (es lo que manda el README de
   `public/arte/`), pero **el paso de rasterizar necesita un motor con filtros SVG**: un
   navegador, o la herramienta del usuario en su máquina, como los recortes de audio de
   `D-06`. Hoy el repo no tiene con qué hacerlo desatendido.
2. **Sobre el piso claro la figura casi desaparece.** La tinta marfil está calibrada para
   `--fondo`, que es tinta oscura. El cielo es papel claro, y ahí el contraste se cae. No lo
   puede cazar `contraste.test.ts`, que mide pares declarados en CSS y acá el fondo es una
   superficie dibujada. Es el mismo problema que `D-21` resolvió para las tapas con un velo
   plano, y hay que resolverlo antes de dibujar un nivel: o las figuras llevan contorno, o
   los dos terrenos no pueden ser los dos claros.
3. **A 48 px las dos se leen, pero no igual de bien.** El sombrero y la SG roja le dan a
   Skayboy una silueta reconocible en miniatura; la mata de pelo de Poligirl se empasta más y
   lo que la salva es el oro del llavero. Si la paridad de `D-38` va en serio, esa diferencia
   se corrige en el dibujo, no en el tamaño.

## Lo que es propuesta y no hallazgo

**El llavero de Poligirl no está fichado.** El sombrero Panamá y la SG roja de Skay sí
(`RES-64.3`, `RES-64.5`): son cosas que él exhibe ante cámaras. Las llaves salen de su rol
documentado —negociaba contratos, manejaba la seguridad de los recitales, decidía cómo se
entraba (`RES-64.7`)— cruzado con el molinete, que es la figura rectora del sitio. **Ninguna
pantalla puede decir "Poli llevaba llaves porque…":** eso sería inventar el porqué, que es lo
único que `CLAUDE.md` declara estricto. Confirmarlas o cambiarlas es de `experiencia`.

Lo mismo con **el reparto**: en la lámina Skayboy camina la brasa y Poligirl la luz, y es
para poder mirar el contraste. No es una afirmación sobre ninguno de los dos.

## Las barandas que ya cumple

- **`D-38` baranda 2 — por insignia, no por parecido.** Ninguna de las dos figuras tiene
  cara: los anteojos son una barra. Cuanto más se parece el sprite a la insignia que ellos
  mismos exhiben, más lejos queda del derecho a la imagen.
- **`D-38` baranda 1 — el muñeco no habla.** No hay bocadillo, no hay primera persona, no hay
  frase con firma.
- **Paridad:** mismo lienzo, misma altura de cabeza a piso, mismo grosor de línea, misma
  cantidad de huecos de recorte. El sitio publica sobre Poli, rotulado `hecho`, que fue *"un
  pilar, con el mismo rango que la voz y la guitarra"*.
- **Anti-slop (`diseno-marca.md`):** sello de goma de esquina casi viva en vez de pastilla de
  999px, tinta plana sin degradados, borde rasgado, sombra ninguna.

## Si esto se tira a la basura

Se borra la carpeta y no se rompe nada: ningún archivo del sitio la importa, ninguna ruta la
referencia, y `npm test` no la mira.
