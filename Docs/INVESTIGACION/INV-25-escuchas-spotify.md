# INV-25 — las escuchas de Spotify: la vía está cerrada

> Ficha pedida por el hilo principal, tarea `T-113` del ciclo 8. Cubre **Spotify**; lo de
> YouTube va aparte, en `RES-52` (`INV-26`).
>
> Consume: `RES-01` (estado de las APIs), `RES-09` (catálogo en Spotify desde 2017),
> `RES-26` (la política prohíbe los juegos), `RES-20` (los 105 temas).
> Afecta: `CTR-07`, `ADR-01`, y el frente de popularidad del ciclo 8.
>
> **Escrita por `investigador` en `T-113`; pegada por el hilo principal**, porque el rol es
> de solo lectura y no puede escribir en su propia carpeta.

---

## RES-51 — no hay número de reproducciones, y desde 2026 tampoco hay popularidad

Consultado el **2026-08-24**. **La respuesta es negativa y es firme.**

### 1) Reproducciones reales: nunca existieron en la API pública

La API pública de Spotify **jamás** expuso un contador de reproducciones. Está pedido desde
2018 en un issue oficial que sigue abierto y sin resolver
(`github.com/spotify/web-api/issues/981`).

Lo único que existió fue **`popularity`**, un índice **0–100**: *"The value will be between
0 and 100, with 100 being the most popular"*. Lo calcula un algoritmo sobre volumen de
reproducciones y qué tan recientes son. Dos detalles que importan:

- Las copias del mismo tema (single, álbum, recopilado) **se puntúan por separado**:
  *"Duplicate tracks… are rated independently"*.
- No es en tiempo real: *"the value may lag actual popularity by a few days"*.

URL: `developer.spotify.com/documentation/web-api/reference/get-track` · **verificado**

### 2) Y ese índice tampoco está disponible: lo sacaron en 2026

**Esto es lo que cierra la vía.** El changelog oficial de febrero de 2026 marca textual
`[REMOVED] "popularity"` en los objetos **Track, Album y Artist** para las apps en
**Development Mode** — desde el **11-feb-2026** para Client IDs nuevos y el **9-mar-2026**
para los existentes.

URL: `developer.spotify.com/documentation/web-api/references/changes/february-2026` ·
**verificado**

### 3) Y no hay forma de salir de Development Mode

- Desde el **6-feb-2026**, Development Mode exige que el dueño de la app tenga **cuenta
  Premium**, tope de 5 usuarios autorizados, y *"acceso limitado a un subconjunto de
  endpoints"*.
  URL: `developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security`
- **Extended Quota Mode** —el único que conservaría `popularity`— exige, desde el
  **15-may-2025**, una **organización legal registrada** y **250.000 usuarios activos
  mensuales**.
  URL: `developer.spotify.com/blog/2025-04-15-updating-the-criteria-for-web-api-extended-access`

**Un fan site sin fines de lucro que ven veinte personas no califica, y no va a calificar.**
Consultado: 2026-08-24 · **verificado**

### 4) Credenciales y límites — quedan anotados por si algún día vuelve

El flujo sería **Client Credentials** (server-to-server, sin datos de usuario), y encaja con
lo que el proyecto necesita: se corre **una sola vez desde la máquina del usuario**, la
clave nunca entra al repo ni se le sirve al jugador.

Los límites Spotify no los publica: documenta solo el mecanismo —ventana móvil de 30
segundos, `429` con `Retry-After`— y que desde julio de 2026 el cupo se cuenta **por cuenta
de developer**, no por Client ID. Las estimaciones de comunidad rondan las 180 solicitudes
por minuto: **no verificado, es empírico de terceros**. Para una corrida de 105 temas sería
irrelevante de todos modos.

### 5) Resolver un tema a "su" track: no hay solución programática

No existe endpoint de resolución canónica. `Search` no devuelve "el" resultado: el mismo
tema vuelve con distintos `track_id` según edición, compilado o versión en vivo. Y
`Track Relinking` resuelve **disponibilidad por mercado**, no cuál copia es la canción.

Con 105 temas en 10 discos más recopilados, esto exigiría **criterio manual** —tomar el
track del álbum de estudio original— y no hay atajo.

URL: `developer.spotify.com/documentation/web-api/concepts/track-relinking` ·
`github.com/spotify/web-api/issues/219` · **verificado como problema abierto**

### 6) La colisión de `RES-26`, re-verificada hoy

`developer.spotify.com/policy`, Sección III, sigue diciendo textual *"Do not create a game,
including trivia quizzes"*, dentro de la lista de lo que **no** se debe construir.

Y se chequeó específicamente lo que el encargo pedía: **la cláusula no distingue** entre
usar contenido de Spotify y usar metadata o datos derivados, ni entre "el juego usa la API"
y "el sitio que aloja el juego la usa". Es una prohibición amplia, sin esas excepciones
escritas.

Consultado: 2026-08-24 · **verificado — misma cita que `RES-26`, fecha renovada**

### Un tracker de terceros, y por qué no sirve para esto

Existe **kworb.net**, que estima streams a partir de apariciones en el chart Top 200.
**No cubre el catálogo completo**: casi con seguridad deja afuera a la mayoría de los temas
oscuros — que son exactamente los que este pedido quiere poder identificar. Rotulado como
**leyenda**: circula, no es fuente oficial, y para este fin además no alcanza.

URL: `kworb.net/spotify/artist/6byQKddO1b34lXC2ZEjehQ.html` · Consultado: 2026-08-24

---

## La frase que el sitio podría escribir sin mentir

**Ninguna, porque no hay ningún número que mostrar.**

Hoy no existe vía pública, gratuita ni paga, accesible para un fan site, que entregue
reproducciones ni popularidad de Spotify por tema.

Si el sitio quiere distinguir el conocido del oscuro, tiene que ser **con otro criterio**:
las vistas de YouTube (`RES-52`, que sí se puede) o una curaduría editorial de `contenido`
rotulada como criterio propio — nunca como dato de Spotify.

---

## Sin resolver

- Si el *"subconjunto de endpoints"* de Development Mode recorta `Search` en algo más que
  el `limit` (de 50 a 10). No se encontró un listado endpoint por endpoint.
- La cadencia exacta de actualización de `popularity`. Irrelevante mientras el campo esté
  removido; queda anotado por si vuelve.

## Siguiente

- **`arquitectura`**: esta ficha cierra **en negativo** la vía Spotify para "veces
  escuchado". Hay que decidir si el frente se reformula sobre YouTube y criterio editorial,
  o se cae. Y si toca algo más de `ADR-01`.
- **`producto`**: la promesa de "ordenar por popularidad" hay que reescribirla antes de
  ponerla en ninguna historia. **Es el mismo patrón que `BR-06`**, cuando la promesa de
  "escuchar el tema completo vía Spotify" resultó no cumplible y hubo que redactarla de
  nuevo en vez de sostenerla.
