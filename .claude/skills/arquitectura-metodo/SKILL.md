---
name: arquitectura-metodo
description: Método para escribir decisiones ADR-XX y contratos CTR-XX de RicotaArcade, con alternativas descartadas y consecuencias explícitas. Usar cuando el rol arquitectura tenga que resolver el motor de audio, la vía de Spotify o el schema de un JSON de datos.
argument-hint: [decisión técnica a resolver]
---

<objetivo>
Convertir una tensión técnica ("hay dos formas de hacer esto y las dos cuestan algo") en
un `ADR-XX` que alguien pueda leer en dos meses y entender por qué se eligió lo que se
eligió, sin tener que reconstruir la conversación.
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/BRIEF.md` — el motor de audio híbrido y la integración con Spotify ya están
  decididos como dirección; tu trabajo es la vía exacta, no si se hace.
- `Docs/PRODUCTO/` — qué juegos y qué piso de ítems exige cada decisión técnica.
- `Docs/INVESTIGACION/` — fichas `RES-XX` sobre el estado real de las APIs de terceros.
</contexto>

<procedimiento>
1. Nombrá la decisión en una línea: qué hay que elegir, no qué hay que construir.
2. Listá las alternativas reales, no una alternativa de paja fácil de descartar.
3. Si la decisión depende de un hecho externo no verificado (estado del `preview_url`
   de Spotify, límites del Web Playback SDK), **no lo busques vos**: escribí la ficha
   que necesitás y pedísela a `investigador`. El `ADR-XX` queda `propuesta` hasta que
   llegue.
4. Elegí y escribí las consecuencias: qué se vuelve fácil, qué se vuelve difícil, qué
   presupuesto de precarga o de tamaño de archivo le impone a `contenido`.
5. Si la decisión define la forma de un JSON, escribila como `CTR-XX`: el schema
   completo, con los campos obligatorios (fuente y rótulo de leyenda incluidos) y un
   ejemplo válido.
</procedimiento>

<criterios_de_calidad>
- Toda alternativa descartada lleva el motivo puntual, no "es peor".
- Todo contrato `CTR-XX` es lo bastante preciso para que `revisor` valide un JSON contra
  él sin preguntar nada.
- Ningún ADR se apoya en un supuesto sobre una API externa sin ficha `RES-XX` que lo
  respalde.

Transversales a todo el proyecto:
- Cada afirmación tiene fundamento: un ID de otro rol, una fuente con fecha, o la marca
  explícita *supuesto*.
- Nada de relleno. Si una sección no aporta una decisión, se borra.
- Escribí para el vos de dentro de tres meses, que no se acuerda de nada.
</criterios_de_calidad>

<validacion>
Pedile a alguien (o a vos mismo en frío) que intente adivinar la alternativa descartada
sin leerla. Si no puede, la sección de alternativas está incompleta.

Y siempre: ningún placeholder sin resolver, ningún ID referenciado que no exista.
</validacion>

<entregable>
Un archivo `ARQ-<tema>.md` en `Docs/ARQ/` por decisión o contrato, con `ADR-XX` o
`CTR-XX` nuevos.

Al terminar, actualizá `ESTADO.md` y reportá en el chat, en máximo 10 líneas: qué
archivos tocaste, qué IDs creaste, y qué rol necesita esto ahora.
</entregable>
