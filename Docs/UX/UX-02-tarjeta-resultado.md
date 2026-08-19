# UX-02 — La tarjeta de resultado compartible

> Rol dueño: `experiencia`. Consume `UX-01` (de dónde sale el resultado), `Docs/BRIEF.md`
> (`D-10`: hay difusión real, el resultado es puerta de entrada, no final de partida) y
> `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-01`).

**Resuelve:** BRIEF, PENDIENTE "Qué formato tiene el resultado compartible — dueño
`experiencia`, es puerta de entrada, no adorno (`D-10`)". Entrada b del BRIEF (se lo pasa
un amigo con su resultado). `US-01` deja explícitamente fuera de su alcance "el copy
exacto de la pantalla de resultado y el mecanismo de compartir" — es lo que se resuelve
acá, sobre el resultado que fija su criterio 1 (aciertos sobre 8).

## Por qué es puerta de entrada y no un final

`D-10` cambia el orden de diseño: no pienso esta pantalla como "lo último que ve el que
ya jugó", la pienso como "lo primero que ve el que todavía no jugó" — porque en un
timeline de Twitter, ese es su público real. Todo lo que decido acá se juzga con esa
vara: ¿un desconocido que ve solo esta imagen, sin contexto, entiende de qué se trata y
quiere tocarla?

## Qué muestra

- El puntaje agregado ("7/8"), grande, legible en miniatura de timeline.
- El nivel/tramo visual del resultado (el mismo de tres niveles de `UX-01`, con arte
  propio por nivel — ver brief de arte en `UX-04`).
- Copy corto de desafío, tono fan a fan: algo en la línea de *"¿Vos cuánto sacás?"*
  (texto final de `contenido`).
- La marca del sitio (nombre + ícono rocambolesco), para que se identifique como pieza
  de RicotaArcade y no como una captura de pantalla suelta.

## Qué NO muestra (para no spoilear)

- **Ninguna pregunta ni ninguna opción de respuesta.** Ni siquiera la categoría de la
  pregunta que se falló. Si la tarjeta mostrara "falló en Letras", el que la recibe ya
  llega con una pista que no debería tener antes de jugar.
- **Ningún dato personal del jugador.** Sin campo de nombre, sin foto, sin usuario. Cero
  fricción para generarla, y no hace falta: quien la comparte ya lo hace desde su propia
  cuenta de Twitter o su propio chat, así que la autoría queda puesta por el canal, no
  por la tarjeta.
- **Ningún desglose por categoría.** Aunque el quiz mida por historia/discos/letras/
  mitología, la tarjeta no lo desglosa — un desglose completo es casi un mapa de qué
  preguntas había.

## Formato (spec de diseño, no de implementación)

| Propiedad | Valor |
|---|---|
| Proporción de la imagen | 1200×630 (la que Twitter expande en el timeline como Card grande) |
| Jerarquía tipográfica | Puntaje en el tamaño más grande de toda la pieza; el resto, secundario |
| Contraste | Alto — tiene que leerse en el thumbnail chico del timeline, no solo en la vista expandida |
| Texto del tweet prefil | Corto, con el puntaje adentro y el link — ej. *"Saqué 7/8 en el arcade ricotero. ¿Vos cuánto sacás?"* (redacción final de `contenido`) |

La implementación técnica de esos metadatos (`og:image`, `twitter:card`, generación de
la imagen en el momento) es del hilo principal / `arquitectura`. Acá dejo qué tiene que
mostrar la pieza, no cómo se genera.

## Cómo se ve en un timeline de Twitter

Un desconocido, sin haber jugado nunca, tiene que poder mirar solo la imagen (sin
siquiera leer el tweet) y entender tres cosas en menos de dos segundos: que es un juego,
que alguien sacó un puntaje, y que él también puede jugarlo. Si la imagen necesita el
texto del tweet para explicarse, está mal cortada.

## Camino de vuelta (el que la recibe)

1. Toca el link de la tarjeta (desde el tweet o desde el chat de un amigo).
2. Cae en `UX-01`, Pantalla 0, **Variante B**: mismo layout de siempre, con el desafío
   como subtítulo. Un tap, arranca a jugar — sin muro también para el que llega
   desafiado.
3. Juega su partida completa (mismo flujo de `UX-01`, primera pregunta fácil incluida:
   el desafío no salta ese paso).
4. En su propia pantalla de resultado, la comparación aparece como copy adicional, no
   como pantalla nueva: *"vos: 8/8 — le ganaste a Fulano (7/8)"* o *"todavía no lo
   alcanzás, dale una más"* (redacción final de `contenido`).
5. De ahí sale su propio botón "COMPARTIR", que genera su propia tarjeta — así el ciclo
   de difusión se repite sin que yo tenga que diseñar un caso especial para "el
   desafiado que gana" versus "el que recién llega".

## Bloqueos que dejo anotados

- Cómo viaja el puntaje del desafiante dentro del link (para poder mostrar "Fulano sacó
  7/8" en la Variante B) es una pieza técnica sin backend — propuesta en
  `Docs/SUGERENCIAS/UX-para-arquitectura-formato-link-resultado.md`.
- Los tres niveles de resultado y sus cortes de puntaje exactos son de `producto`.
- El copy final (título de cada nivel, texto del tweet prefil, mensaje de comparación)
  es de `contenido`.
