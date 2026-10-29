# Para quien haga las figuras del bestiario: la prioridad del usuario

> De: hilo principal · 2026-10-18 · Depende de: `D-73` y `src/data/bestiario.json`
> Prioridad fijada por el usuario en el chat, el 2026-10-18.

Hoy tienen figura propia siete bestias: el lobo, el cordero, el perro, Luzbelito, Momo, Pierre y la
drácula, esta última en el PR #56. Las otras 113 son ojos en lo oscuro, o el glifo del mapa en las
regiones que todavía no tienen escena. El usuario eligió **27 que pasan primero a diseño detallado**.

## Las que se pueden hacer ya: el fondo está hecho (7)

| Fondo | Bestia (`id`) |
|---|---|
| Pastura | `aquella-solitaria-vaca-cubana` |
| Techos / baldío | `el-negro-atila` · `limon` (ver abajo) |
| Infierno | `el-diablo-que-mea-en-todas-partes` |
| Bajo inundado | `el-rato-molhado` |
| Prisión (PR #56) | Barbazul · `el-esclavo-sensible-y-chillon` (después de integrar el #56, o sobre esa rama) |

## Las que esperan su fondo: en curso en el worktree `bestiario-fondos` (20)

| Fondo | Bestia |
|---|---|
| Galpón | La bestia pop · Patricio Rey (la silla vacía) · Los redonditos de ricota |
| Árbol | El monito que trepa (ver abajo) · El ángel de la soledad |
| Cybersiberia | El Capitán Buscapina · El Rey Garufa · La Divina TV Führer · El pac-man |
| Astilleros | El pibe de los astilleros · La rana rubia · La hija del fletero · La Gran Lady · La pequeña novia del carioca |
| Mesa | El caníbal · El caníbal desdentado · La mosca |
| Ruta | El zumba · La Mariposa Pontiac · El héroe del whisky |

## Dos pedidos de diseño puntuales del usuario

**Limón.** Es *un limón colombiano que corre por las chapas*, con el bloque atrás. La figura es la
fruta, no una persona: hoy la ficha dice `{"f": "persona", "ropa": "remera", "pose": "corre"}`, y eso
cambia. La historia que lo une al "Limón" de Pablo Escobar, Álvaro de Jesús Agudelo, muerto en los
techos de Medellín, entra como `cuenta`. Rótulo, cotejado el 2026-10-18:

- **`testimonio`, con ficha `RES-21`**: el propio Indio, en *Recuerdos que mienten un poco*
  (cap. sobre *Luzbelito*, sección 15, p. ~367 del PDF), dice que el tema *"narra en primera persona
  el final del narco Pablo Escobar"*, con el Bloque de Búsqueda persiguiéndolo a él y a su ladero
  por los tejados. Es su versión, y el libro avisa que lo es, así que va como testimonio y no como hecho.
- **`hecho`**: que existió un "Limón", Álvaro de Jesús Agudelo, chofer y custodio de Escobar, que
  murió con él el 2-dic-1993. Fuente: https://en.wikipedia.org/wiki/El_Lim%C3%B3n.
- Ojo con el disco: el tema es la pista 8 de ***Luzbelito* (1996)**, no de *Lobo suelto* (`INV-20`,
  `RES-170`). Sale casi tres años después de la muerte, así que la cronología cierra.
- La frase del hijo de Escobar que trae La Gaceta (`RES-170`) es de segunda mano y no se vio la
  entrevista original: no se usa.

De paso: `RES-170` pone como **hecho** que el tema cuenta los últimos minutos de Escobar. Según la
regla de `D-14`, eso es testimonio del Indio. Lo tiene que revisar `contenido` en la pregunta 059 de
`CNT-41`, si es la que lo usa.

**El monito que trepa.** Es una animación en dos tiempos. Arranca a media altura del tronco, como dice
la estampa de hoy, con el culito tapado. Sube, y al subir se le ve el culito. Es el verso hecho
movimiento: *"Cuanto más alto trepa el monito / El culo más se le ve"*. La cola enrulada ya está en
el dibujo.

## Lo que esto toca de otros

- `contenido`: el `dibujo`, la `estampa` y la `cuenta` de `limon` en `bestiario.json`.
- `investigador`: la ficha de la leyenda de Limón.
- `experiencia`: cómo entra cada figura en su recinto, con el régimen de `D-73`.
