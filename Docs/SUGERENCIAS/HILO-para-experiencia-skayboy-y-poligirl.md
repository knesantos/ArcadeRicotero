# Del hilo principal para `experiencia` — la pregunta que define si Skayboy y Poligirl existe

> Escrito el 2026-09-11, después del relevamiento de nueve frentes que quedó en
> `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md` (`RES-60`..`RES-65` más tres mediciones
> sobre el repo). La idea se guardó como `IDEA-14` en `Docs/PRODUCTO/PRD-backlog-ideas.md`.
>
> **Esto no es una tarea.** `IDEA-14` no está promovida (`BR-16`) y no traza `T-XX`
> (`Docs/IDS.md`). Es el traspaso de las cuatro preguntas que el relevamiento midió, no
> pudo contestar, y que son tuyas por propiedad: `UX-04` (sistema visual y mapa
> sección→disco), el recorrido de una partida, y la zona de pulgar.

> ## ⚠ Actualización del mismo día: el usuario contestó dos de las cuatro
>
> Escrito arriba antes de preguntarle. **Las respuestas llegaron el 2026-09-11 y cambian las
> secciones 1 y 3**, así que están marcadas adentro y no borradas — el fundamento de lo que
> se descartó sigue sirviendo.
>
> - **Sección 1 — se juega de a dos, en horizontal.** El usuario eligió conservar el corazón
>   cooperativo, contra la recomendación de esta hoja.
> - **Sección 3 — el par es cielo / infierno.** No fuego/agua.
> - Además hay dos decisiones nuevas que te tocan: **`D-38`** (se pueden dibujar, con tres
>   barandas, una de ellas es tuya) y **`D-39`** (el juego suena entero).

## 1. La pregunta grande: ¿un pulgar alternando, o dos manos?

> ✅ **CONTESTADA, 2026-09-11: dos personas, teléfono en horizontal.** Cada uno agarra una
> punta y usa los botones de su lado. Es contra lo que recomendaba esta hoja. Lo que eso te
> deja sobre la mesa, y no es poco: **no hay precedente de un plataformas de salto fino con
> ese esquema** —los títulos encontrados son minijuegos de duelo o carrera (`RES-65.8`)—;
> el sitio **no fija orientación** hoy y habría que decidir si la fija; y hay que resolver
> **dos** zonas de pulgar con `--toque-min` ≥ 48 px cada una sin tapar el nivel, en un
> viewport de ~812×375. Lo que se gana: los niveles pueden pedir movimiento simultáneo, que
> es el género de verdad. Lo que **no** se toca: son dos personas en un aparato, no dos
> aparatos, así que "sin backend" queda intacto.

Lo que se midió antes de preguntar (`RES-65`), que sigue siendo el fundamento:

- **El propio juego que se clona ya contestó esto para móvil**, y su FAQ lo dice textual:
  en un teléfono se juega **de a uno, alternando personaje con un ícono** (`RES-65.1`).
  No es una analogía forzada: es el mismo problema resuelto por quien lo inventó.
- *The Lost Vikings* y *Trine* muestran que el botón de cambio aguanta puzzle y acción
  (`RES-65.3`, `RES-65.4`). *Ibb & Obb* muestra el fracaso del camino opuesto: su modo de
  control simultáneo para una persona tiene un trofeo llamado "Brain Damage" (`RES-65.2`).
- **Lo que NO está cerrado es el horizontal.** El cálculo que decía "dos mandos no entran"
  solo se hizo en vertical, 375×812. En horizontal el viewport pasa a ~812×375, hay
  precedente de género —*Galaxus*: cada uno agarra una punta del teléfono y usa los botones
  de su lado— y `Base.astro` **no bloquea landscape** (`RES-65.10`).
- Dos teléfonos queda descartado con fundamento doble: no hay camino de cero
  infraestructura para que se encuentren (`RES-65.9`) y choca con el "sin backend" de
  `CLAUDE.md`.

**Lo que se pierde si se elige el botón de cambio, y conviene que esté escrito antes:**
desaparece el corazón cooperativo en tiempo real, y ningún puzzle puede depender de
movimiento simultáneo. El personaje en pausa tiene que quedar siempre en posición segura.
Eso convierte la promesa de "clon de Fireboy & Watergirl" en "plataformas de un jugador con
dos personajes alternables" — y esa diferencia de expectativa es de `producto`, no tuya,
pero nace de tu decisión.

## 2. Poligirl no puede ser la compañera de Skayboy

Medido adentro del repo, no opinado: `src/data/redondopedia.json` publica sobre `la-negra-poli`,
**rotulado `hecho`**, que fue *"no una colaboradora ni una acompañante: un pilar, con el
mismo rango que la voz y la guitarra"*.

Si el juego le da a Poligirl menos habilidades, menos pantalla o el rol de apoyo, el sitio
se contradice a sí mismo sobre una persona viva.

**Cuidado con la palabra "paridad", que es donde el relevamiento se contradijo solo.** No es
simetría de habilidades — el género entero existe porque los personajes son asimétricos, uno
cruza lo que el otro no. Es **paridad de peso, de pantalla y de agencia**. Que sean
distintos es la mecánica; que uno valga menos es el defecto.

## 3. El par elemental, que decide terreno, paleta y niveles

> ✅ **CONTESTADA, 2026-09-11: cielo / infierno.** La familia más alta del catálogo, con dos
> títulos propios —«El infierno está encantador esta noche» y «Yo no me caí del cielo», los
> dos de *Gulp!*— más «Cruz diablo!» y «Un ángel para tu soledad». Y arriba/abajo es la
> geometría nativa de un plataformas: no te obliga a distinguir dos tintas de piso de un
> vistazo en un teléfono, que era el problema de luz/oscuridad.
>
> **Lo que arrastra, y es tuyo junto con `contenido`:** el nombre del juego deja de calcar
> el par del original. "Skayboy y Poligirl" ya no se explica por fuego/agua. Si se queda
> igual, se queda porque suena bien — y eso hay que poder decirlo sin que parezca un
> descuido.

El fundamento de por qué se descartó fuego/agua, que conviene no perder: el nombre calca el
original y arrastra ese par, pero medido sobre `src/data/cancionero.json` con la regla de
conteo declarada (2913 versos útiles), `agua` aparece **una vez** en todo el catálogo. Los
cuatro pares candidatos con su respaldo real están en la sección "el ancla ricotera" de
`INV-60`.

Lo tuyo empieza después de la elección: **qué se ve**.
El relevamiento ya encontró verso propio para el escenario («Templo de Momo»: *"Un galpon de
luz, es el templo del momo"*), para el coleccionable («Juguetes perdidos»: *"Y un par de
sienes ardientes / Que son todo el tesoro"*) y para la puerta con el guardia adentro
—«Queso ruso»: *"que cuidan por vos las puertas del nuevo cielo"*—, que es justo la figura
que `D-14` invierte.

## 4. La paleta, y el callejón que no era tal

`D-19` parecía dejar sin disco libre a un juego nuevo. El repo lo desmiente dos veces:
*La mosca y la sopa* ya viste dos lugares a la vez, y *Luzbelito* viste `dos-ejes` sin ser
variante de casete. Lo que sí es cierto: **Un baión no está libre** —ya tinta la sección del
cancionero y un pie, y es el ancla de `IDEA-02`—. El mapa sección→disco es tuyo (`UX-04`).

## 5. El hueco de propiedad que nadie nombró, y es el más caro

**De los siete roles, ninguno es dueño del diseño de niveles ni de la producción de
sprites.** Y hay una incompatibilidad declarada por escrito: `public/arte/README.md` manda
*"PNG con fondo transparente, borde tipo tijera (irregular, con grano — nunca vector liso)"*,
y un sprite legible a 32 px pide exactamente lo contrario; el borde rasgado a ese tamaño es
ruido. Las 13 piezas que hay hoy son recortes de collage de 400–800 px: **cero sprites**.

Hasta que declares una convención nueva y la agregues a ese README —que es donde vive el
contrato del arte—, el formato del proyecto y el que el género necesita no cierran. No es
cantidad de piezas: es que la regla escrita dice una cosa y el juego pide otra.

Y una prohibición de ese mismo README que en un juego de dos personajes es lo primero a lo
que va a ir la mano: **"prohibido usar el par lobo/cordero como código de acierto/error"**.

## 6. Tres cosas chicas que van a aparecer igual

- **El teclado.** Es como se juega el género original, es gratis en escritorio y no cuesta
  una sola pieza de arte. `UX-10` lo dejó explícitamente afuera del ciclo 9 por pedido del
  usuario. Nadie lo nombró mientras tres frentes discutían mandos de pulgar.
- **Cómo se enseña la mecánica sin tutorial.** Los molinetes exigen que el que llega sin
  idea juegue igual; el original enseña con cuatro niveles de tutorial; `D-32` límite 3
  prohíbe una pantalla previa. Tres reglas que se cruzan y nadie las cruzó.
- **Qué se comparte al terminar.** `src/lib/tarjeta/` existe, todos los juegos terminan en
  una tarjeta, y el commit `c913d80` acaba de cambiar qué se comparte. Ningún frente
  preguntó qué comparte un plataformas.

## 7. Lo que propongo que se haga primero, y no es diseñar el juego

Un personaje quieto y un tile, dibujados a mano, puestos en pantalla dentro del cascarón que
ya existe —`<main id="app">` con las tres `<section class="pantalla">`—, **sin motor y sin
física**. Ese experimento no necesita licencia, ni música, ni paleta cerrada, ni excepción a
`D-32`, y contesta la única pregunta que ninguna ficha puede contestar: **si esa pantalla se
ve como este sitio**. Si se ve como cualquier plataformas de plantilla, el motor no lo va a
arreglar, y se gastó un día en vez de un ciclo.
