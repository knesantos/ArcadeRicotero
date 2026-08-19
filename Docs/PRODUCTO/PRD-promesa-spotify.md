# PRD — Qué promete la v1 sobre escuchar el tema en Spotify

> Rol dueño: `producto`. Consume: `Docs/BRIEF.md` ("Listo de la v1"), `Docs/ARQ/ARQ-spotify-integracion.md`
> (`ADR-01`, sección "Lo que esto le manda a `producto`"), `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`
> (`RES-01`), `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md` (`RES-09`), `D-08`, `D-09`.
> Produce: `BR-06`. No edita `Docs/ARQ/` ni `Docs/BRIEF.md` — el hilo principal aplica el
> cambio de brief que se pide al final de este archivo.

## El problema

`Docs/BRIEF.md`, en "Listo de la v1", promete como requisito transversal a los cuatro
juegos que al revelar la respuesta el jugador **"puede escuchar el tema completo vía
Spotify"**.

`RES-01` verificó con fuente primaria que las dos vías que garantizarían eso dentro del
sitio están descartadas: `preview_url` restringido para apps nuevas desde el 27-nov-2024
(C), y el Web Playback SDK exige Premium del jugador, que `D-08` fija que no tiene (D). De
las dos que quedan, el embed probablemente entrega un preview corto a un usuario sin
sesión Premium (leyenda técnica con buena base empírica, no hecho verificado — no la trato
como tal), y el deep link saca al jugador del sitio hacia la app, sin garantía de que un
usuario free en Argentina pueda reproducir a demanda (`E-07`, sin responder todavía).

Lo que sí está confirmado y no es el problema: `RES-09` verifica que el catálogo completo
de la banda está en Spotify desde 2017 vía The Orchard (titular Erks S.A.). El tema
**existe** en la plataforma. El problema es exclusivamente **con qué medio lo reproduce
un jugador sin Premium dentro de nuestro sitio**, no si el tema está disponible.

## Las tres salidas que dejó `ADR-01`, y cuál elijo

`ADR-01` deja tres salidas sobre la mesa sin elegir ninguna, y aclara que dejar la frase
del brief tal cual **no** es una de ellas:

1. Reformular la promesa a algo verificable: "se puede saltar al tema en Spotify".
2. Aceptar el preview dentro del sitio como lo que la v1 entrega, y decirlo así.
3. Declarar que la escucha completa depende de la sesión propia del jugador, y tratarla
   como mejora para el que la tiene, no como requisito de la v1.

**Elijo la salida 1.** Motivos:

- **No depende de evidencia que todavía falta.** `ADR-01` mismo dice que esta salida "es
  honesta con cualquiera de los dos desenlaces de `E-04` y no depende de `E-07`". Las
  otras dos sí quedan atadas a esa evidencia: la (2) asume que el resultado va a ser
  siempre preview corto (podría no serlo si el jugador tiene sesión propia), y la (3)
  convierte en condicional algo que puede resolverse con una promesa simple.
- **Cumple "sin muro de entrada" (`D-09`) sin ambigüedad.** No pide login, no pide
  Premium, no depende de tener la app instalada — si no la tiene, cae al navegador
  (`RES-01`(d)).
- **Es coherente con el bucle de la sesión.** El botón de Spotify aparece recién después
  de revelar, cuando la ronda ya cerró (`ADR-01`, fallback: "nada de Spotify durante la
  partida"). Que el jugador se vaya a otra app en ese momento no corta una partida en
  curso — corta un gesto opcional posterior al cierre, que es distinto.
- **Una promesa modesta que se cumple es mejor que una promesa grande que no.** El brief
  mismo describe un público que nota cuando algo no cierra (riesgo 3). Prometer "el tema
  completo" y entregar 30 segundos es el tipo de fricción que ese público detecta primero.

Descarto la (2) porque fija como entrega definitiva un resultado (preview corto) que ni
siquiera está confirmado como el comportamiento por defecto — sería aceptar una leyenda
técnica como si fuera la única salida posible. Descarto la (3) porque agrega una
condicional ("depende de tu sesión") que la salida 1 ya cubre de forma más simple: no
promete nada que no pueda cumplir para nadie.

## BR-06 — Qué le promete la v1 al jugador al revelar la respuesta, sobre Spotify

**Al revelar la respuesta, la v1 le ofrece al jugador un acceso directo para escuchar ese
tema en Spotify —abre la app si está instalada, o la reproduce en la web de Spotify si
no— sin prometer ni garantizar que suene completo sin salir del sitio.**

Con esa única oración alcanza para que `experiencia` escriba el botón: algo del orden de
"Escuchalo en Spotify" o "Abrir en Spotify", nunca "Escuchá el tema completo acá" ni
ninguna variante que prometa reproducción íntegra **dentro** de RicotaArcade.

**Lo que la promesa no cambia, y ya estaba resuelto en otro lado:**
- El fragmento propio sigue siendo, según el fallback de `ADR-01`, lo único que la
  partida garantiza sin depender de terceros — `BR-06` no lo reemplaza, convive con él.
- La vía técnica exacta (embed, deep link, o ambos en cascada) la elige `arquitectura` en
  `ADR-01`; `BR-06` no la fija, solo acota qué puede prometerse pase lo que pase.
- Si el jugador tiene su propia sesión (Premium o free) y consigue escuchar el tema
  entero, eso es una mejora que ocurre igual, no algo que la v1 necesite garantizar para
  considerarse "lista".

**Por qué esta redacción no hay que reescribirla cuando llegue `E-07` (condicional
explícito y verificable):**

`BR-06` no afirma "el tema suena entero" ni "el tema suena corto": afirma que existe un
**acceso** al tema en Spotify, sin comprometerse con cuánto reproduce. Sea cual sea el
resultado de `E-07` —que un free en Argentina pueda o no reproducir a demanda— la
oración de arriba sigue siendo verdadera y sigue siendo lo único que se promete:

- Si `E-07` responde que sí puede reproducir a demanda: el deep link efectivamente lleva
  al tema completo para ese jugador. `BR-06` no necesita decir esto porque no lo
  prometía como garantía; el jugador simplemente lo recibe como bonus.
- Si `E-07` responde que no (shuffle/radio únicamente en modo free): el deep link igual
  cumple `BR-06` tal como está escrita — "acceso directo al tema en Spotify" sigue siendo
  cierto aunque la app no lo reproduzca a demanda; sigue llevando a la ficha del tema.
- Lo mismo aplica al desenlace de `E-04` sobre el embed: gane preview corto o tema
  completo, `BR-06` no se rompe en ningún caso porque nunca prometió el resultado, solo
  el acceso.

La única situación que obligaría a reabrir `BR-06` es que alguna vía deje de ofrecer
*ningún* acceso al tema (por ejemplo, que el deep link deje de resolver). Eso no es un
resultado de evidencia esperado por `ADR-01`, es una falla de disponibilidad de Spotify
como servicio, y ya está cubierta por el fallback ("solo fragmento propio") sin tocar
esta regla.

## La frase del brief a corregir

`Docs/BRIEF.md`, sección "Listo de la v1", dice hoy:

> Transversal a los cuatro: al revelar la respuesta se puede **escuchar el tema completo
> vía Spotify**, y cada juego llega a revisión con un **piso de ítems** que fija
> `producto`.

Reemplazar por (el hilo principal aplica el cambio, no yo):

> Transversal a los cuatro: al revelar la respuesta el jugador tiene acceso directo para
> **escuchar el tema en Spotify** —la v1 no garantiza que suene completo sin salir del
> sitio—, y cada juego llega a revisión con un **piso de ítems** que fija `producto`.

## Qué NO decide este archivo

- Si la vía primaria es el embed, el deep link, o los dos en cascada: `ADR-01`,
  `arquitectura`.
- Dónde va el botón, su copy exacto, y cómo se comunica visualmente la degradación:
  `experiencia`.
- Si hay implicancias de derechos en usar el embed o el deep link: `contenido`, nota de
  derechos.
