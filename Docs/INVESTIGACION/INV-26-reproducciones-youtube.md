# INV-26 — las reproducciones de YouTube como dato del sitio

> Ficha pedida por el hilo principal, tarea `T-114` del ciclo 8. Cubre **YouTube**; lo de
> Spotify va aparte, en `RES-51` (`INV-25`).
>
> Consume: `RES-09` (titularidad y distribución), `RES-11`/`D-06` (los términos de YouTube
> prohíben descargar), `RES-20` (los 105 temas).
> Afecta: `CTR-07`, `US-02`, y el frente de popularidad del ciclo 8.
>
> **Escrita por `investigador` en `T-114`; pegada por el hilo principal**, porque el rol es
> de solo lectura y no puede escribir en su propia carpeta.

---

## El problema, que es distinto del de Spotify

En Spotify un tema es *un* track. En YouTube un tema son **muchos videos**: el audio
oficial, el vivo, el lyric video, la subida de fans, el audio con la tapa fija. **Un conteo
de vistas no dice nada si no se dice de qué video es.** Por eso la pregunta central de esta
ficha no fue cuántas vistas hay, sino quién decide cuál es "el" video.

---

## RES-52 — se puede, con un canónico defendible y un rótulo que diga de qué video habla

Consultado el **2026-08-24**.

### a) Los canales: no hay uno de Erks, pero sí hay un Topic

- **No existe** un canal con el nombre "Erks S.A." (la titular, `RES-09`).
- Existe un canal **"Patricio Rey y sus Redonditos de Ricota"**
  (`youtube.com/channel/UCDW0pY-_DgxqnXOB-6CiEcA`).
- Y existe un canal **Topic autogenerado por YouTube**, "Patricio Rey y sus Redonditos de
  Ricota - Topic" (`youtube.com/channel/UCv6PTVMYCpYJDBK4YiJz_4g`). Los canales Topic los
  arma YouTube a partir del catálogo que entra por distribución digital / Content ID — no
  los sube un fan.
- Los audios de ese canal llevan la etiqueta **"Provided to YouTube by Patricio Rey
  Discos"** — verificado en dos temas. Es el sello histórico, bajo el paraguas de Erks S.A.
  desde 1992 (`RES-09`).

Consultado: 2026-08-24 · **verificado**

### b) Cuál es "el" video, y quién lo decide

**No hay fuente que confirme** que el canal Topic tenga los 105 temas de `RES-20` uno por
uno con audio limpio. Así que esto es un **criterio**, no un hallazgo, y va rotulado como
tal:

> **El canal Topic es lo más cercano a canónico** que hay, porque nace del distribuidor y
> no de un fan — es el equivalente en YouTube del track de Spotify. Para el tema que no
> esté ahí, hay que **declarar explícitamente qué video y qué canal se usó**.
>
> Lo que no se puede hacer nunca es reportar "las vistas del tema" sin decir de cuál video.

Consultado: 2026-08-24 · **criterio de `investigador`, no hallazgo puro**

### c) La API: barata para leer, carísima para buscar

`videos.list` con `part=statistics` devuelve `statistics.viewCount`. Cuesta **1 unidad por
llamada** y acepta **hasta 50 ids por llamada**. La cuota gratuita por defecto es de
**10.000 unidades por día** por proyecto, y hace falta una clave gratuita de Google Cloud
Console.

**Y acá está la trampa, que decide cómo se implementa esto:** si no se conoce el `videoId`
de antemano y hay que buscarlo, `search.list` cuesta **100 unidades por llamada**. Ciento
cinco búsquedas son **10.500 unidades** — más que la cuota diaria entera, en una sola
corrida.

O sea: **los ids se resuelven una vez y se guardan**; después, refrescar las vistas de los
105 temas cuesta 3 llamadas y 3 unidades.

URL: `developers.google.com/youtube/v3/docs/videos/list` ·
`developers.google.com/youtube/v3/getting-started` · Consultado: 2026-08-24 · **verificado**

### d) Los términos **sí** dejan guardar y mostrar el número

Este es el hallazgo que más cambia el frente, porque la intuición del proyecto apuntaba al
revés.

La prohibición de descargar que fichó `RES-11` es sobre **contenido audiovisual**, y no
aplica a leer y guardar una métrica por API. Las **Developer Policies**, sección III.E.4
("Refreshing, Storing, and Displaying API Data"), **autorizan explícitamente** guardar por
más de 30 días las *"statistics provided through other YouTube API services, such as the
number of views for a video"*.

**Con dos obligaciones que hay que cumplir y no son decorativas:**

1. Usar *"esfuerzos razonables"* para que el dato guardado sea consistente con el actual, y
   reflejar los cambios de vistas *"lo más rápido posible"*.
2. **Atribuir a YouTube como fuente**, con sus Brand Features.

URL: `developers.google.com/youtube/terms/developer-policies` · Consultado: 2026-08-24 ·
**verificado**

> **Lo que esto le exige al sitio, dicho claro:** un JSON congelado en agosto y nunca más
> tocado **no cumple** el punto 1. Hace falta que refrescar sea barato y que se haga — y por
> suerte lo es: 3 unidades de cuota, una vez que los ids están guardados.

### e) Cada cuánto cambia el número — sin fuente primaria

**No hay documento oficial de Google** con la cadencia de actualización del contador
público. Las fuentes secundarias que hay (blogs de SEO y de analítica, no Google) coinciden
en que el número público tiene una demora de validación de horas, a veces 24–48 h en picos,
y que no es tiempo real como lo que ve el dueño del canal en YouTube Studio.

**Rotulado como leyenda**, en el sentido de `D-14`: circula y es consistente entre fuentes,
pero no está confirmado por el que sabe. Consultado: 2026-08-24 · **no verificado en fuente
primaria**

### f) Vistas de YouTube y escuchas de Spotify **no** son comparables

Umbrales de validación distintos, definiciones distintas de qué cuenta como reproducción
válida, universos de usuario distintos. **Ninguna fuente los declara equivalentes.**

Consultado: 2026-08-24 · **verificado por ausencia** — no es que alguien lo desmienta: es
que nadie los equipara, y equipararlos sería una invención del sitio.

> **Consecuencia dura para la interfaz:** el sitio **no puede sumar ni promediar** las dos
> cifras. Van como **dos rankings separados**, o no van.

---

## La frase que el sitio puede escribir sin mentir

> *"X reproducciones en YouTube (video de [canal], al [fecha]) — no es el único video del
> tema, y no se compara con las escuchas de Spotify."*

---

## Sin resolver

- **Si el canal no-Topic tiene insignia de verificación oficial.** YouTube la dibuja con
  JavaScript y no se puede leer desde afuera. Hay que mirarlo a ojo en el navegador.
- **La cadencia exacta de actualización del contador.** Google no la documenta; lo de (e)
  queda como estimación de terceros.

## Siguiente

- **`arquitectura`**: (c) y (d) dicen que la consulta se puede hacer **una sola vez desde la
  máquina del usuario** —el mismo patrón de `D-06` y `D-23`— sin tocar cuota ni términos,
  **siempre que no dependa de `search.list` a escala**. Los ids se resuelven una vez y se
  guardan; el refresco después es trivial. Y (d) obliga a que el refresco exista.
- **`contenido`**: (a) y (b) fijan el criterio de video canónico —Topic primero, declarar la
  fuente si no está—, y (f) prohíbe que la pantalla sume o promedie YouTube con Spotify.
