# ARQ — Contrato del dataset de popularidad por tema

> Rol dueño: `arquitectura`. Consume: `RES-51` (`INV-25`), `RES-52` (`INV-26`), `RES-20`,
> `RES-26`, **`BR-18`** (`T-116`, cerrada el mismo día), `US-02`, `D-06`, `D-12`, `D-13`,
> `D-14`, `D-15`, `D-22`, `D-23`, `D-24`, `CTR-03` (manifiesto de audio), `CTR-05` (molde de
> contrato con auditoría), `CTR-06` (el cancionero y su slug), `src/lib/letra/temas.ts`,
> `src/lib/esquemas.test.ts`, `.claude/rules/codigo-juegos.md`.
> Produce: **`CTR-07`**. Tarea: `T-117` del ciclo 8.
> Fecha: 2026-08-24.

---

## CTR-07 — Contrato de `src/data/popularidad.json`

- **Estado:** vigente, **sin valores abiertos**. `BR-18` cerró en `T-116` las tres preguntas
  que este contrato tenía que aguantar sin conocer: qué se muestra, cada cuánto se refresca y
  qué pasa con un tema sin video canónico. El contrato se escribió antes de esa regla y
  **entró entera sin cambiarle la forma al archivo**: lo único que se movió fue un número del
  envoltorio. El mapa de qué respondió cada apartado está en `CTR-07.8`. **Desde el
  2026-09-23 este dataset ya no define los Fáciles de `US-02`**: los define `CTR-19`, y la
  enmienda está al principio de `CTR-07.8`.
- **Para quién:** para quien escriba `scripts/ingerir-popularidad.mjs` y el JSON en `T-118`;
  para quien ponga el orden en pantalla en `T-119`; y para `revisor`, que tiene que poder
  rechazar una entrada sin preguntarle a nadie.
- **Qué resuelve.** El pedido era "cantidad de escuchas en Spotify y en YouTube". Después de
  las dos fichas queda **una sola plataforma y un solo número**: `RES-51` cerró Spotify en
  negativo —no hay reproducciones en la API pública y el índice `popularity` fue removido en
  febrero de 2026 para las apps que este proyecto puede tener— y `RES-52` dejó YouTube en pie
  con permiso escrito para guardar y mostrar el conteo. Este contrato fija cómo se guarda ese
  número **sin que pueda publicarse sin decir de qué video es y de qué día**.

**Lo que este dataset no es.** No es un banco de ítems de juego: no tiene `us`, no tiene
`dificultad`, no tiene opciones ni respuesta correcta, y por eso tampoco tiene la clave
`juego` que llevan `CTR-02`, `CTR-03`, `CTR-04` y `CTR-05`. Es una **medición de un tercero
sobre los temas del sitio**, y la cruzan varias pantallas.

---

### CTR-07.1 — Archivo, envoltorio y presupuestos

| | |
|---|---|
| Archivo de datos | `src/data/popularidad.json` (lo nombra el plan del ciclo en `T-118`; no lo cambio) |
| Copia corrible | `src/data/_schema/popularidad.schema.json` — **la aplica el hilo principal en `T-118`**, con el bloque normativo de `CTR-07.9` |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Quién lo escribe | `scripts/ingerir-popularidad.mjs`, en dos modos (`CTR-07.4`). **No se edita a mano.** |
| Presupuesto de tamaño | ≤ **60 KB**. 105 entradas × ~400 bytes ≈ **42 KB** |
| Presupuesto de cliente | **0 KB.** Este archivo no entra a ninguna isla — ver abajo |

```json
{
  "contrato": "CTR-07",
  "contratoVersion": 1,
  "fuente": "youtube",
  "actualizado": "2026-08-24",
  "vigenciaDias": 180,
  "nota": "Vistas de YouTube por tema. Cada numero viaja con su video y su fecha. No se mezcla con ninguna otra plataforma (RES-52 f, BR-18 e).",
  "temas": [ ... ]
}
```

**`fuente` es `const: "youtube"`, no un enum.** Un archivo, una plataforma. Es la forma más
barata de hacer cumplir el punto 5 de este contrato (`CTR-07.7`): en un archivo donde la
plataforma se declara una vez a nivel archivo, **no hay dónde escribir un segundo número**, y
`additionalProperties: false` cierra la puerta a inventarle un `total` al lado.

*Alternativa descartada:* `fuente` como enum de dos valores, previendo que Spotify vuelva. Un
enum invita a que alguien reuse este schema para otra plataforma sin pasar por una decisión, y
`RES-51` dice que la vía de Spotify no está difícil, está cerrada. Si algún día vuelve, es un
contrato nuevo y **dos rankings separados**, nunca uno mezclado.

*Alternativa descartada:* meter las vistas como un campo más de `src/data/cancionero.json`
(`CTR-06`). Son dos cosas con vidas distintas: el cancionero lo reescribe entero
`ingerir-cancionero.mjs` desde el material del usuario, y este dataset se refresca contra una
API con su propia cadencia. Compartir archivo significa que un refresco de vistas reescribe la
letra de 104 temas, y que una re-ingesta del cancionero borra las mediciones. Ninguna de las
dos es un riesgo teórico: las dos son un `writeFileSync` del archivo entero.

**Por qué el presupuesto de cliente es cero.** El sitio es estático (`D-15`) y este JSON se lee
**en build**, no en el navegador: la página sale con el orden ya resuelto en el HTML. Ninguna
isla de `src/scripts/` importa `src/data/popularidad.json`. Si `experiencia` pide ordenar del
lado del cliente, se le arma un **payload derivado** con tres campos por tema —`slug`,
`vistas`, `medido`— que son ~4 KB; el bloque `video` no tiene nada que hacer en un celular.
Es el mismo criterio de ventana de `CTR-05.1`: lo que el jugador nunca ve, nunca se baja.

---

### CTR-07.2 — El número no viaja solo: es una medición con fecha

Este es el punto que el contrato existe para hacer cumplir. Un conteo de vistas **no es un
hecho estable**: es lo que decía un contador el día que se lo miró. El sitio es estático, así
que el número se pide una vez, se guarda y envejece.

**La regla, y el schema la hace cumplir:** las vistas viven dentro de un objeto `medicion` que
tiene **dos campos obligatorios y ninguno opcional**.

```json
"medicion": { "vistas": 12345678, "medido": "2026-08-24" }
```

No hay `vistas` a nivel entrada. No hay `medicion` sin `medido`. Un número suelto no valida, y
no valida por construcción: para publicar una cifra sin fecha habría que agregarle una clave al
schema, que es una decisión de `arquitectura`, no un descuido de una corrida.

**Es el mecanismo de `D-14` aplicado a una medición.** Los rótulos `hecho` / `leyenda` /
`testimonio` no se usan acá, y conviene decir por qué antes de que alguien los busque: esas tres
casillas clasifican **afirmaciones sobre la banda**, y esto no afirma nada sobre la banda —
afirma qué mostraba un contador de un tercero. Su rótulo son otras tres piezas, y son igual de
inseparables:

| Pieza | Campo | Sin ella, la frase que el sitio escribe es |
|---|---|---|
| Qué plataforma | `fuente` (archivo) | "el más escuchado" — falso, es el más visto en un lado |
| De qué video | `video` (entrada) | "las vistas del tema" — lo que `RES-52` prohíbe expresamente |
| De qué día | `medicion.medido` | un número presentado como si fuera de hoy |

**Y el orden también caduca.** `BR-18` (b) decidió que el titular es la **posición** y no la
cifra —una cifra absoluta queda vieja al día siguiente y este proyecto trabaja en ráfagas
irregulares—, y eso **no afloja nada de lo de arriba**: el orden entre dos temas parejos se da
vuelta con el tiempo igual que el número, así que la fecha sigue siendo obligatoria. Un ranking
sin fecha es la misma mentira con menos dígitos.

**La cifra se guarda igual, y no es contradictorio con `BR-18`.** Que la pantalla titule con la
posición es una decisión de qué se muestra; el dato guardado tiene que ser el número, porque el
orden **se deriva de él en build** y porque un orden guardado no se puede auditar ni volver a
calcular (`CTR-07.7`). Lo que `BR-18` (b) descarta es la cifra como titular, no la cifra como
dato.

*Alternativa descartada:* una sola fecha a nivel archivo (`actualizado`) y nada por entrada. Es
más chico y es lo que uno escribe si supone que todas las mediciones salen de la misma corrida.
No todas salen de la misma corrida: un tema que se resuelve tarde, uno cuyo video dejó de
responder, o una corrida cortada a la mitad dejan entradas de días distintos bajo una fecha
única que las cubre a todas. `actualizado` se queda igual —es la fecha de la última corrida—
pero **es un resumen, no la fuente de verdad**: la fecha que vale para una cifra es la que está
al lado de esa cifra.

---

### CTR-07.3 — De qué video es el número

`RES-52` fija el criterio y lo rotula como criterio, no como hallazgo: **el canal Topic es lo
más cercano a canónico** —lo arma YouTube desde el distribuidor, no un fan— y para el tema que
no esté ahí hay que declarar qué video y qué canal se usó. Textual de la ficha: *"Lo que no se
puede hacer nunca es reportar 'las vistas del tema' sin decir de cuál video."*

El bloque `video` es lo que convierte esa frase en algo que falla en la validación.

```json
"video": {
  "id": "XXXXXXXXXXX",
  "canal": "topic",
  "canalId": "UCv6PTVMYCpYJDBK4YiJz_4g",
  "canalNombre": "Patricio Rey y sus Redonditos de Ricota - Topic",
  "titulo": "Ji Ji Ji",
  "duracionSeg": 254,
  "resolucion": "manual",
  "resuelto": "2026-08-24"
}
```

| Campo | Oblig. | Qué es |
|---|---|---|
| `id` | sí | El `videoId`. **Es lo único que hace falta para refrescar** (`CTR-07.4`) |
| `canal` | sí | Enum `topic` · `banda` · `otro`. Ver abajo |
| `canalId` | sí | El id del canal, para que "Topic" no sea una palabra que alguien escribió |
| `canalNombre` | sí | El nombre tal como se lee en YouTube. Es lo que la pantalla atribuye |
| `titulo` | sí | El título del video, no el del tema. Es lo que deja ver a ojo que no es un vivo |
| `duracionSeg` | no | Si la resolución la trajo. Un video de nueve minutos para un tema de cuatro es otra versión |
| `resolucion` | sí | Cómo se llegó a este id: `listado-de-canal` · `busqueda` · `manual`. Ver `CTR-07.4` |
| `resuelto` | sí | Cuándo se decidió que este video es el del tema |
| `justificacion` | **sí si `canal` no es `topic`** | Por qué este video y no otro. 20–300 caracteres |

**Los tres valores de `canal`, y qué obliga cada uno:**

- **`topic`** — el canal autogenerado, `UCv6PTVMYCpYJDBK4YiJz_4g` según `RES-52`. Es el único
  que no exige justificación, porque la justificación es el criterio de la ficha.
- **`banda`** — el canal "Patricio Rey y sus Redonditos de Ricota"
  (`UCDW0pY-_DgxqnXOB-6CiEcA`). Exige justificación: `RES-52` dejó **sin resolver** si ese
  canal tiene insignia de verificación, así que hoy no se puede afirmar que sea oficial.
- **`otro`** — cualquier otro canal. Exige justificación, y la entrada queda marcada para que
  `revisor` la mire una por una.

**Quién elige el video cuando no hay Topic no soy yo: es `contenido`, y `BR-18` (c) ya le dejó
el criterio escrito** — canal oficial de la banda antes que subida de fans, audio de estudio
antes que vivo o lyric video. El contrato le da dónde escribirlo (`canal`, `canalNombre`,
`justificacion`) y le prohíbe no escribirlo.

> **`sin-video` no significa "no está en el canal Topic".** `BR-18` (c) es explícito: un tema
> fuera del Topic **se queda en el ranking** con su video declarado al lado. `sin-video` es el
> caso límite —no existe **ningún** video ubicable para ese tema— y ahí sí queda afuera, sin
> número inventado y sin cero falso. Usar `sin-video` para "no lo encontré en el Topic" es
> exactamente el error que esta línea existe para prevenir, y no lo caza ninguna máquina: el
> comando (2) imprime los `sin-video` con su motivo para que se lean de un vistazo.

**Lo que el schema garantiza es que la declaración exista; que sea cierta la mira una
persona.** Ningún patrón de texto sabe si `titulo` es el estudio o un vivo de Huracán. Por eso
el comando (2) de `CTR-07.11` imprime, en una línea por entrada, todo lo que no es Topic:
mismo mecanismo que `CTR-05.4` usó con los recortes de tapa, y por la misma razón — cuando la
máquina no puede, se le deja la lista servida al que sí puede.

**Los dos patrones de id son un supuesto declarado, con salida barata.** `video.id` valida
contra `^[A-Za-z0-9_-]{11}$` y `canalId` contra `^UC[A-Za-z0-9_-]{22}$`. `RES-52` no ficha el
formato de los ids: lo que sostiene el segundo patrón son los **dos ids de canal que la propia
ficha trae**, y el primero es la forma que tienen los ids de video hoy. No están ahí para
verificar nada profundo — están para que no entre una URL entera pegada en el campo `id`, que
es el error que de verdad se comete. Si algún día un id legítimo no valida, **manda el id que
devuelve la API** y el patrón se afloja: es una línea, y ningún dato cargado se pierde.

**La URL no se guarda: se arma.** `https://www.youtube.com/watch?v=<id>`, igual que `CTR-05.4`
arma la ruta de la imagen desde el nombre pelado. Guardar la URL entera son 105 repeticiones
del mismo prefijo y un lugar más donde el dato puede contradecirse a sí mismo.

**Un tema sin video canónico no se borra ni se inventa.** Va con `estado: "sin-video"` y un
`motivo` que diga que se buscó y no se encontró. Qué hace la pantalla con eso lo decide
`producto` (`CTR-07.8`), y el dataset lo representa igual en cualquiera de los casos.

---

### CTR-07.4 — La trampa de cuota decide la forma: dos fases, no una

`RES-52` (c) trae el número que manda acá: `videos.list` cuesta **1 unidad** y acepta **50 ids
por llamada**; `search.list` cuesta **100 unidades**. Ciento cinco búsquedas son **10.500
unidades sobre una cuota diaria de 10.000** — más que el día entero, en una sola corrida.

**Consecuencia, y es de contrato:** el `videoId` es un dato **estable y con criterio adentro**,
y las vistas son un dato **perecedero y automático**. El archivo los separa en dos bloques y el
script los toca en dos modos distintos.

| | Fase 1 — resolver | Fase 2 — refrescar |
|---|---|---|
| Comando | `node scripts/ingerir-popularidad.mjs --resolver` | `node scripts/ingerir-popularidad.mjs` |
| Qué escribe | **solo el bloque `video`** y `estado` | **solo `medicion`** y `actualizado` |
| Cuántas veces | una vez por tema, y después nunca | cada vez que la medición vence |
| Costo | alto por la vía fichada, y quizá no (ver abajo) | 105 ids ÷ 50 = **3 llamadas, 3 unidades** |

**La separación no depende de que resolver sea caro**, y conviene decirlo ahora que hay una
hipótesis de que podría no serlo: aunque los ids salieran gratis, en el bloque `video` hay una
**decisión declarada** —cuál es "el" video de ese tema— y en `medicion` no hay ninguna. Una
corrida automática puede pisar un número; no puede pisar un criterio.

**Cinco reglas sobre esas dos fases, todas verificables:**

1. **El modo por omisión es el barato.** Correr el script sin argumentos refresca; resolver hay
   que pedirlo. La operación cara y difícil de deshacer nunca puede ser la que sale de tipear
   el comando de memoria.
2. **El refresco no escribe el bloque `video`, ni agrega ni borra entradas.** Si después de un
   refresco `git diff` muestra un cambio dentro de `video`, eso es un defecto del script, no un
   dato nuevo. Es la línea de defensa del activo caro: perder los 105 ids cuesta más de una
   cuota diaria recuperarlos.
3. **Ninguna corrida puede llamar a `search.list` a escala.** No es una recomendación de ahorro:
   105 búsquedas no entran en un día. Resolver un id que falta es trabajo de la fase 1 —a mano o
   por listado, ver abajo—, nunca del refresco, y nunca una búsqueda por tema.
4. **Un video que dejó de responder no se borra.** La entrada pasa a `estado: "sin-medir"` con
   su `motivo`, **conserva el `video.id`** y pierde la `medicion`. Que decida una persona si el
   video se cayó, si cambió de dueño o si hubo un error de red. Es el mismo mecanismo con el que
   `CTR-05` deja un ítem en `borrador` en vez de perderlo.
5. **`statistics.viewCount` puede no venir** —un canal puede ocultar el contador—, y eso también
   es `sin-medir` con motivo. No es cero. Un cero inventado es el peor dato posible en un
   ranking: pone al tema último con cara de dato.

**Cómo se llena la fase 1: dos vías, y el contrato no elige ninguna.** El dataset que sale es
el mismo, así que esto no es materia de contrato — pero sí lo es que quede registrado **por
cuál vía entró cada id**, y para eso está `video.resolucion`:

| `resolucion` | Qué fue | Costo |
|---|---|---|
| `listado-de-canal` | Se listó el canal Topic y se cruzaron los títulos contra los 105 de `RES-20` | barato, **si la vía existe** |
| `busqueda` | Se buscó el tema y alguien eligió el resultado | 100 unidades por tema (`RES-52` c) |
| `manual` | Alguien abrió YouTube, miró y pegó el id | tiempo, no cuota |

**El campo es obligatorio y vale la línea que cuesta.** Las tres vías no son igual de
confiables: un listado de canal puede traer remasters, duplicados o un tema con otro nombre, y
una búsqueda elige entre resultados que compiten. Si mañana se descubre que una de las tres
metió mal veinte entradas, `resolucion` es lo que permite **re-auditar ese lote y solo ese
lote** en vez de los 105. Es el mismo servicio que presta `credito.origen` en `CTR-05.4`:
registrar de dónde salió algo no lo valida, pero hace que se pueda encontrar en diez segundos.

> **La vía barata todavía no está fichada.** El hilo principal dejó una hipótesis razonable —
> listar la playlist de subidas del canal Topic costaría del orden de 3 llamadas en vez de
> 10.500 unidades, y devolvería id y título juntos, que es justo lo que hace falta para cruzar
> por la puerta de `D-13`. **No la escribo como parte del contrato porque `RES-52` no la
> cubre**, y un ADR no se escribe de memoria. Queda pedida como ficha en `CTR-07.13`. El
> contrato ya la acepta: si la vía existe, la fase 1 se vuelve barata y el archivo no cambia
> una coma.

*Alternativa descartada:* **dos archivos**, uno con el mapeo tema→video y otro con las
mediciones. Es la forma que mejor expresa "esto es caro y esto es descartable", y la descarté
por dos costos concretos: son dos envoltorios y dos schemas para 105 filas, y aparece una unión
por `slug` que se puede romper —una medición huérfana, un video sin medición— que hoy no puede
existir porque es el mismo objeto. La protección que daba el archivo aparte la da la regla 2, y
la regla 2 se comprueba con `git diff`, que es más barato que un join.

*Alternativa descartada:* **resolver en la misma corrida que refresca**, tomando el primer
resultado de búsqueda del que no tenga id. Es cómodo y es exactamente lo que revienta la cuota;
además elige "el" video sin que nadie mire, que es lo único que `RES-52` prohíbe de plano.

---

### CTR-07.5 — Dónde ocurre la llamada

**En la máquina del usuario, a mano, y en ningún otro lado.** Ni en el build de Vercel, ni en el
navegador del jugador, ni en un endpoint propio. El sitio **nunca** llama a YouTube: consume un
JSON commiteado. Es el mismo patrón que `D-06` y `D-23` ya usan para el audio.

Y de esto sale la única regla de secretos que el contrato necesita: la clave de Google Cloud se
lee del ambiente (`YOUTUBE_API_KEY`), **no entra al repo, no entra al JSON y no se le sirve a
nadie**. Una clave que viaja al cliente es una cuota que quema cualquiera.

*Alternativa descartada:* **llamar en build.** Mantiene el dato más fresco sin que nadie corra
nada, y a cambio ata cada despliegue a la cuota y a un secreto configurado en el CI, hace que un
corte de la API rompa un deploy que no tiene nada que ver, y vuelve el build no reproducible —
dos builds del mismo commit dan sitios distintos. La frescura se compra con `CTR-07.6`, que es
más barato.

*Alternativa descartada:* **llamar desde el navegador.** Expone la clave, le mete al jugador una
llamada a un tercero antes de ver la pantalla, y contradice `.claude/rules/codigo-juegos.md`, que
ya prohíbe llamadas de terceros durante la partida.

*Alternativa descartada:* **un proxy propio que guarde la clave.** Es un backend, y el backend
está fuera de alcance desde el brief (`D-02`, `D-15`).

---

### CTR-07.6 — Refrescar es una obligación contractual, no una buena idea

`RES-52` (d) es el hallazgo que habilita todo esto: las **Developer Policies III.E.4** autorizan
**explícitamente** guardar por más de 30 días las *"statistics provided through other YouTube API
services, such as the number of views for a video"*. Con dos obligaciones que la ficha marca como
no decorativas:

1. *"Esfuerzos razonables"* para que el dato guardado sea consistente con el actual.
2. **Atribuir a YouTube como fuente**, con sus Brand Features.

**Cómo se cumple la primera — tres mecanismos, y ninguno depende de que alguien se acuerde:**

- **El archivo declara su propio plazo.** `vigenciaDias` en el envoltorio, entero de 1 a 365.
  Vale **180**, y ya no es provisorio: lo fijó `BR-18` (d), que descartó 30 —una promesa que
  este proyecto rompe seguido, y una promesa que se rompe seguido es peor que no hacerla— y 365,
  que ya estaba señalado como piso de falla. El plazo es **dato y no código**: si algún día se
  revisa, se cambia un número en el JSON y no se toca ni el schema ni el test. Y la verificación
  que pide `BR-18` es literalmente esa resta: *"hoy menos la fecha de medición guardada,
  comparado contra 180"*.
- **Vencido el plazo, el test falla.** `node --test` se pone en rojo cuando la medición más vieja
  pasa de `vigenciaDias`. El arreglo es una corrida de tres unidades de cuota, hecha por la misma
  persona que ve el rojo. El rojo **no frena el despliegue**: Vercel corre `astro build`, no los
  tests, así que el sitio no se cae por una medición vieja — el rojo es presión sobre el que
  trabaja, no un cerrojo sobre el sitio. **Y es exactamente el disparador que `BR-18` (d) pide**:
  *"antes de publicar cualquier cambio que toque el banco de contenido"*, refrescar es parte
  obligatoria de esa ráfaga. Un compromiso de calendario en un proyecto sin calendario necesita
  algo que lo despierte, y lo único que se corre en toda ráfaga es `npm test`.
- **La fecha se ve en pantalla.** Un número viejo con su fecha al lado sigue siendo honesto; un
  número viejo sin fecha es la falla que `CLAUDE.md` llama la única estricta, en su versión
  medida.

*Alternativa descartada:* que el vencimiento **solo imprima un aviso**. `CTR-05` usó un aviso
impreso para una deuda que dependía de otro rol, y ahí correspondía. Acá no depende de nadie: el
que ve el rojo es el que tiene la clave y el comando. Un aviso que aparece en medio de la salida
de un comando que se corre por otra cosa es, en la práctica, un aviso que nadie lee — y "esfuerzos
razonables" con un aviso que nadie lee es una frase, no un esfuerzo.

*Alternativa descartada:* refrescar en cada build. Está descartada en `CTR-07.5` por otras
razones, y conviene ver que también fallaría acá: un despliegue que no ocurre no refresca nada, y
este sitio puede pasar semanas sin desplegar.

**Cómo se cumple la segunda.** El contrato garantiza que el dato para atribuir **exista y llegue
a la pantalla**: `fuente` dice la plataforma, `video.canalNombre` dice el canal y
`medicion.medido` dice el día. De ahí sale el requisito no funcional, y es duro porque no sale
del gusto de nadie sino de los términos:

> **RNF-CTR-07-A.** Toda pantalla que muestre un número o un orden salido de este archivo tiene
> que mostrar, en el mismo bloque y sin interacción: que es de **YouTube**, de qué **canal**, y
> la **fecha de medición**. Si las tres no entran, no entra el número.

Cómo se ve eso es de `experiencia`, y que se cumpla lo verifica `revisor` — igual que el crédito
a Rocambole en `CTR-05`. **Lo que no puedo escribir es qué exigen las Brand Features**
(si hace falta el logo, en qué tamaño, con qué color): `RES-52` nombra la obligación pero no la
detalla, y esto no se escribe de memoria. **El piso es la atribución en texto.** Si `experiencia`
quiere usar el logo, antes hace falta una ficha — queda pedido en `CTR-07.13`.

---

### CTR-07.7 — Prohibido mezclar plataformas, y prohibido guardar derivados

`RES-52` (f) es explícito y está verificado por ausencia: vistas de YouTube y escuchas de
Spotify **no son comparables** —umbrales de validación distintos, definiciones distintas de qué
cuenta como reproducción— y ninguna fuente las equipara. Equipararlas sería una invención del
sitio.

> **Regla dura.** Este dataset no suma, no promedia ni combina métricas de plataformas
> distintas, **aunque algún día vuelva el dato de Spotify**. Si vuelve, es otro archivo, otro
> contrato y **dos rankings separados**. Un tercer número que sea la mezcla de los dos no existe
> y no se puede fabricar sin mentir.

Cómo lo hace cumplir el schema, que es lo que lo diferencia de un párrafo con buenas
intenciones: `fuente` es `const` a nivel archivo, y `additionalProperties: false` está en los
cuatro niveles del documento. **No hay dónde poner el segundo número.** Para agregarlo hay que
tocar el schema, y tocar el schema es una tarea de `arquitectura` con la ficha en la mano.

**Y por la misma puerta se cierra otra cosa: acá no se guarda nada derivado.** Ni `rank`, ni
`posicion`, ni `indice`, ni `popularidad0a100`, ni un booleano `esPopular`, ni un cubo
`facil`/`dificil`. Tres razones:

1. **Un derivado congela una decisión adentro de un dato que se refresca.** El orden sale de
   `vistas` en build, en una línea. Guardado, queda viejo en el instante en que un refresco
   cambia dos cifras, y nadie lo nota porque el archivo igual valida.
2. **Un índice guardado no se puede auditar.** El número tiene procedencia —video, fecha,
   plataforma—; un `7` no tiene ninguna. Es, además, exactamente la forma del dato que `RES-51`
   dice que Spotify removió: un índice sin unidades del que nadie puede decir qué mide.
3. **El corte de "fácil" es una regla de negocio, no un dato — y `BR-18` (f) lo confirmó por su
   cuenta.** La regla quedó así: dentro del pool de temas **con fragmento de audio producido**,
   "Fácil" son los **8 de mayor posición** en el ranking, *"recalculado en cada refresco"*.
   `producto` descartó el umbral fijo de vistas con un argumento que este contrato comparte: las
   vistas solo suben, así que un corte fijo **se corrompe solo** con los años sin que nadie lo
   toque. Una posición no. Y una posición recalculada es, por definición, algo que se computa —
   guardarla sería la contradicción exacta de la regla que la pidió.

---

### CTR-07.8 — Lo que decidió `BR-18`, y qué tocó cada respuesta en el dataset

> **Enmendado el 2026-09-23 por `CTR-19`** (`Docs/ARQ/ARQ-schema-recitales.md`, `T-273`),
> después de `D-45` enmendada y `BR-18` (h). **Este dataset ya no define los Fáciles de
> `US-02`.** El orden sale ahora del conteo citado de setlist.fm (`src/data/setlistfm.json`,
> `CTR-19.3`), y `catalogo()` deja de leer este archivo (`CTR-19.5`). Tres lecturas de este
> documento quedan viejas y se dejan como estaban:
>
> - La fila **f** de la tabla de abajo y los dos puntos de *"una consecuencia nueva"* (una
>   entrada sin `medicion` no entra al top-8; el top-8 es sobre el pool con fragmento). La
>   segunda regla sigue valiendo, ahora en `CTR-19.5`.
> - El punto 3 de `CTR-07.7`, que cita `BR-18` (f) como la regla vigente del corte.
> - El último punto de *Consecuencias* (*"Este dataset toca la v1"*) y el chequeo 9 de
>   `CTR-07.11`.
>
> **Lo que no cambia:** `CTR-07.7` sigue entero. Las vistas y el conteo en vivo son dos
> archivos, dos contratos y dos órdenes, y ninguna firma los recibe juntos (`CTR-19.5`). Si la
> clave de YouTube llega, este dataset vuelve a medir, pero **no recupera el corte sin una
> decisión nueva** (`D-45` consecuencia 1). Sigue alimentando la regla de tercios de `D-27` para
> `US-07`, mientras el usuario no elija la salida B de `BR-18` (h).

El contrato se escribió mientras `T-116` corría, hecho para aguantar cualquiera de las
respuestas. `BR-18` cerró, y esta tabla es el saldo:

| Apartado de `BR-18` | Qué decidió | Qué tocó acá |
|---|---|---|
| **b** — cifra u orden | El titular es la **posición**; la cifra, si va, va chica y con su fecha | **Nada de la forma.** La cifra se guarda igual porque el orden se deriva de ella (`CTR-07.2`) |
| **d** — cadencia | **180 días** desde la fecha de medición | **`vigenciaDias`: 30 → 180.** Un número del envoltorio |
| **c** — tema sin Topic | **Se queda en el ranking** con el video declarado; solo cae si no hay ningún video ubicable | **Nada.** `canal`+`justificacion` ya lo cubrían, y `sin-video` era ya el caso límite (`CTR-07.3`) |
| **c** — quién elige ese video | **`contenido`**, con criterio escrito (oficial antes que fan, estudio antes que vivo) | Nada. El contrato da los campos, no el criterio |
| **a** y **e** — Spotify | Nada de Spotify, **ni siquiera estimado** | Nada. `fuente` es `const` y no hay dónde escribirlo (`CTR-07.7`) |
| **f** — fáciles de `US-02` | **Top-8 por posición** dentro del pool con fragmento | Nada del dato. Confirma que el ranking se computa y no se guarda |

**Que un cambio de tres decisiones de producto haya movido un solo entero es el punto.** Era
lo que la tarea pedía —un contrato que aguante cualquiera de las respuestas— y el mecanismo que
lo permitió se puede nombrar: **el dataset guarda la medición, no la conclusión.** Todo lo que
`producto` decidió es sobre conclusiones —qué se titula, cada cuánto, quién entra al ranking—, y
ninguna conclusión vive en este archivo.

**Y hay una consecuencia nueva que antes no existía: este dataset dejó de alimentar una sola
pantalla.** `BR-18` (f) hace que el orden que sale de acá defina la cuota de fáciles de `US-02`,
que es una de las cuatro historias del "Listo" de la v1 (`D-05`). Dos cosas que eso obliga:

1. **Una entrada sin `medicion` no puede entrar al top-8**, porque no tiene posición. Si un tema
   con fragmento producido queda `sin-video` o `sin-medir`, la cuota de fáciles se calcula sobre
   un pool más chico y **nadie se entera**. Por eso el comando (2) cruza `adivinar-tema.json`
   contra este archivo e imprime los temas con audio que no tienen número. No lo puede ver el
   schema: son dos archivos.
2. **El top-8 es sobre el pool con fragmento, no sobre los 105.** Es de `BR-18` y lo anoto acá
   porque es el error de lectura más fácil de cometer cuando se escriba la consulta en build:
   los ocho más vistos del catálogo no son los ocho más vistos de los que suenan.

**Lo que sigue sin ser mío, y tampoco es de `producto`:** si el riesgo de `RES-26` —la política
de Spotify que prohíbe los juegos— toca en algo a este frente. **No toca**: acá no se llama a
Spotify ni se guarda un dato suyo. Queda anotado porque las dos fichas del ciclo lo mencionan y
conviene que el que lea esto dentro de dos meses no vuelva a abrir la pregunta.

**Lo que no decido y tampoco es de `producto`:** si el riesgo de `RES-26` —la política de
Spotify que prohíbe los juegos— toca en algo a este frente. **No toca**: acá no se llama a
Spotify ni se guarda un dato suyo. Queda anotado porque las dos fichas del ciclo lo mencionan y
conviene que el que lea este contrato dentro de dos meses no vuelva a abrir la pregunta.

---

### CTR-07.9 — El schema, para pegar y correr

Draft 2020-12, igual que los otros cinco. **Texto normativo:** este bloque es el contrato; la
copia que `T-118` escriba en `src/data/_schema/popularidad.schema.json` tiene que ser idéntica,
y si alguna vez difieren, manda este bloque. **No puedo escribir ese archivo** (`T-117` toca un
solo documento) ni correr nada (`D-12`): lo aplica el hilo principal.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/popularidad/1",
  "title": "CTR-07 — Popularidad por tema, medida en YouTube",
  "description": "Una medicion con fecha, no un hecho. Cada numero declara de que video y de que dia es. Una plataforma por archivo: no se suma ni se promedia con ninguna otra (RES-52 f). Lo escribe scripts/ingerir-popularidad.mjs; no se edita a mano.",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "contratoVersion", "fuente", "actualizado", "vigenciaDias", "temas"],
  "properties": {
    "contrato": { "const": "CTR-07" },
    "contratoVersion": { "const": 1 },
    "fuente": {
      "const": "youtube",
      "comment": "Const y no enum: un archivo, una plataforma. Si vuelve el dato de Spotify (hoy cerrado, RES-51) es otro contrato y otro ranking."
    },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "vigenciaDias": {
      "type": "integer",
      "minimum": 1,
      "maximum": 365,
      "comment": "Plazo que se dan las mediciones antes de considerarse vencidas (Developer Policies III.E.4). Lo fija BR-18 (d) en 180: descarto 30 por incumplible en un proyecto de rafagas y 365 por ser el piso de falla ya señalado."
    },
    "nota": { "type": "string", "maxLength": 400 },
    "temas": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/entrada" }
    }
  },
  "$defs": {
    "entrada": {
      "type": "object",
      "additionalProperties": false,
      "required": ["slug", "disco", "estado"],
      "properties": {
        "slug": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$", "maxLength": 90 },
        "disco": {
          "enum": [
            "gulp", "oktubre", "un-baion-para-el-ojo-idiota", "bang-bang-estas-liquidado",
            "la-mosca-y-la-sopa", "lobo-suelto", "cordero-atado", "luzbelito",
            "ultimo-bondi-a-finisterre", "momo-sampler"
          ]
        },
        "estado": { "enum": ["medido", "sin-medir", "sin-video", "retirado"] },
        "video": { "$ref": "#/$defs/video" },
        "medicion": { "$ref": "#/$defs/medicion" },
        "motivo": { "type": "string", "minLength": 10, "maxLength": 300 }
      },
      "allOf": [
        {
          "comment": "medido = hay video y hay numero con fecha. Es el corazon del contrato.",
          "if": { "required": ["estado"], "properties": { "estado": { "const": "medido" } } },
          "then": { "required": ["video", "medicion"] }
        },
        {
          "comment": "sin-medir = el id esta resuelto y el numero no se pudo tomar. Se conserva el id y se dice por que.",
          "if": { "required": ["estado"], "properties": { "estado": { "const": "sin-medir" } } },
          "then": { "required": ["video", "motivo"], "not": { "required": ["medicion"] } }
        },
        {
          "comment": "sin-video = se busco y no hay video declarable. Sin motivo no se distingue de 'nadie lo cargo todavia'.",
          "if": { "required": ["estado"], "properties": { "estado": { "const": "sin-video" } } },
          "then": {
            "required": ["motivo"],
            "allOf": [
              { "not": { "required": ["video"] } },
              { "not": { "required": ["medicion"] } }
            ]
          }
        },
        {
          "comment": "retirado = fuera de circulacion. No conserva numero: el refresco no lo toca y una cifra que no se refresca se pudre en el archivo.",
          "if": { "required": ["estado"], "properties": { "estado": { "const": "retirado" } } },
          "then": { "required": ["motivo"], "not": { "required": ["medicion"] } }
        }
      ]
    },
    "video": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "canal", "canalId", "canalNombre", "titulo", "resolucion", "resuelto"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[A-Za-z0-9_-]{11}$",
          "comment": "Supuesto declarado (CTR-07.3): esta para que no entre una URL pegada, no para verificar el id."
        },
        "canal": { "enum": ["topic", "banda", "otro"] },
        "canalId": { "type": "string", "pattern": "^UC[A-Za-z0-9_-]{22}$" },
        "canalNombre": { "type": "string", "minLength": 2, "maxLength": 120 },
        "titulo": { "type": "string", "minLength": 1, "maxLength": 200 },
        "duracionSeg": { "type": "integer", "minimum": 1, "maximum": 7200 },
        "resolucion": {
          "enum": ["listado-de-canal", "busqueda", "manual"],
          "comment": "Por que via entro este id. Sirve para re-auditar un lote entero si una de las tres resulta poco confiable (CTR-07.4)."
        },
        "resuelto": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
        "justificacion": { "type": "string", "minLength": 20, "maxLength": 300 }
      },
      "allOf": [
        {
          "comment": "Fuera del canal Topic hay que decir por que este video y no otro (RES-52 b).",
          "if": { "required": ["canal"], "properties": { "canal": { "enum": ["banda", "otro"] } } },
          "then": { "required": ["justificacion"] }
        }
      ]
    },
    "medicion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["vistas", "medido"],
      "comment": "Los dos campos son obligatorios: no existe una cifra sin su fecha.",
      "properties": {
        "vistas": {
          "type": "integer",
          "minimum": 0,
          "comment": "Entero. La API devuelve viewCount como string; lo parsea el script, no el consumidor."
        },
        "medido": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" }
      }
    }
  }
}
```

**Lo que el schema NO puede verificar**, y va a los comandos de `CTR-07.11` o a `revisor`:

1. Que los `slug` sean únicos. `uniqueItems` compara objetos enteros y no sirve.
2. Que el `slug` sea uno de los **105 temas de `RES-20`** y que su `disco` sea el que dice la
   ficha. Es la condición dura de `D-13` y **no se puede meter en el schema** sin copiar 105
   slugs, que sería una segunda verdad al lado de la ficha — exactamente lo que
   `src/lib/letra/temas.ts` se niega a hacer, y con razón.
3. Que dos temas distintos no apunten al **mismo `video.id`**.
4. Que ninguna fecha esté en el futuro y que `medicion.medido` no sea anterior a
   `video.resuelto`.
5. Que la medición esté **dentro de `vigenciaDias`**. Un schema no sabe qué día es hoy.
6. Que el video sea de veras ese tema, y no un vivo, un cover o un lyric video de un fan.
   Ningún patrón de texto mira un video.
7. Que la pantalla **atribuya** (RNF-CTR-07-A). El contrato garantiza que el dato esté.
8. Que un refresco no haya tocado el bloque `video` (regla 2 de `CTR-07.4`). Eso es `git diff`.
9. Que **todo tema con fragmento de audio producido tenga número**. Es lo que `BR-18` (f)
   necesita para el top-8 de `US-02`, y son dos archivos distintos: lo cruza el comando (2).

---

### CTR-07.10 — Ejemplo canónico, hecho para que un copiar-pegar reviente

> Misma convención que `CTR-03.9` y `CTR-05.8`: **todo valor que hoy no existe se escribe de
> forma que no valide.** Acá lo que no existe es la resolución de los ids: nadie los tiene
> todavía, así que `video.id` está puesto como texto que el patrón rechaza.

```json
{
  "slug": "ji-ji-ji",
  "disco": "oktubre",
  "estado": "medido",
  "video": {
    "id": "<el videoId, SALE DE LA RESOLUCION DE T-118 — no inventar>",
    "canal": "topic",
    "canalId": "UCv6PTVMYCpYJDBK4YiJz_4g",
    "canalNombre": "Patricio Rey y sus Redonditos de Ricota - Topic",
    "titulo": "<el titulo del video tal como esta en YouTube>",
    "resolucion": "<listado-de-canal, busqueda o manual — lo sabe la corrida que lo resolvio>",
    "resuelto": "2026-08-24"
  },
  "medicion": {
    "vistas": 0,
    "medido": "2026-08-24"
  }
}
```

Qué es verdadero acá y con qué ficha: **`ji-ji-ji` es un tema de *Oktubre*** según `RES-20`, y
**`UCv6PTVMYCpYJDBK4YiJz_4g` es el canal Topic de la banda** según `RES-52` (a), que además
verificó en dos temas la etiqueta *"Provided to YouTube by Patricio Rey Discos"*. Lo que **no**
está establecido es qué video corresponde a este tema ni cuántas vistas tiene: eso sale de la
fase 1 y de la fase 2, y por eso el `id` no valida.

El `"vistas": 0` del ejemplo es deliberado y es una trampa que conviene ver: **0 valida contra
el schema** y es el valor que un script escribiría si le llega una respuesta vacía. Por eso la
regla 5 de `CTR-07.4` dice que una medición que no vino es `sin-medir` con motivo, y **nunca un
cero**. El schema no puede distinguir un tema que nadie escuchó de una llamada que falló; el
script sí, y tiene que hacerlo.

---

### CTR-07.11 — Casos de prueba y comandos

**No tengo con qué correr nada (`D-12`) y no lo voy a simular.** Lo de abajo lo corre el hilo
principal o `revisor`. Para cerrar `T-117` alcanza con el bloque de casos de prueba, que no
necesita que `src/data/popularidad.json` exista; los otros se corren en `T-118` y `T-119`.

**Lo primero, y es una línea:** agregar `'popularidad'` al arreglo de
`src/lib/esquemas.test.ts` (hoy `['quiz', 'letra', 'tapa', 'cancionero']`). Ese archivo es la
verificación que el ciclo 7 estrenó y es la que hace que un schema **se corra de verdad contra
los datos**. Un contrato que nadie ejecuta es una intención; hasta que esa línea exista, este
documento no está cerrado.

```bash
# (0) La verificacion que cierra T-118. Corre TODOS los schemas contra los datos reales.
npm test
node --test src/lib/esquemas.test.ts
```

Los casos de prueba del schema, que son el criterio de verificación de `T-117`:

| # | Caso | Se espera |
|---|---|---|
| 1 | Entrada `medido` completa | **valida** |
| 2 | `medicion` sin `medido` — el número sin su fecha | **rechaza** |
| 3 | `medicion` sin `vistas` | rechaza |
| 4 | `vistas` como string (`"12345"`) | rechaza |
| 5 | `vistas` negativo | rechaza |
| 6 | `vistas` a nivel entrada, fuera de `medicion` | rechaza |
| 7 | `estado: "medido"` sin `video` | rechaza |
| 8 | `estado: "medido"` sin `medicion` | rechaza |
| 9 | `canal: "otro"` sin `justificacion` | rechaza |
| 10 | `canal: "otro"` con `justificacion` | **valida** |
| 11 | `estado: "sin-video"` con `motivo` y sin `video` | **valida** |
| 12 | `estado: "sin-video"` con bloque `video` | rechaza |
| 13 | `estado: "sin-video"` sin `motivo` | rechaza |
| 14 | `estado: "sin-medir"` conservando `medicion` | rechaza |
| 15 | `estado: "retirado"` conservando `medicion` | rechaza |
| 16 | Campo `spotify` en la entrada | rechaza |
| 17 | Campo `rank` o `indice` en la entrada | rechaza |
| 18 | `fuente: "spotify"` a nivel archivo | rechaza |
| 19 | `video.id` con una URL entera pegada | rechaza |
| 20 | `canalId` que no arranca con `UC` | rechaza |
| 21 | `disco` inventado | rechaza |
| 22 | Archivo sin `vigenciaDias` | rechaza |
| 23 | `video.resolucion` con un valor inventado | rechaza |
| 24 | `video` sin `resolucion` | rechaza |

Los casos 2, 7, 16, 17 y 18 son los cinco que corresponden uno a uno con los cinco puntos que
este contrato tenía que resolver. Si alguno de esos cinco valida, el contrato no sirve.

```bash
# (1) Casos de prueba del schema. Bash, no PowerShell. Necesita `pip install jsonschema`.
#     Lo corre el hilo principal o `revisor`. NO lo corre `arquitectura` (D-12).
python - <<'PY'
import copy, json, jsonschema
S = json.load(open('src/data/_schema/popularidad.schema.json', encoding='utf-8'))
BASE = {
  "contrato": "CTR-07", "contratoVersion": 1, "fuente": "youtube",
  "actualizado": "2026-08-24", "vigenciaDias": 180,
  "temas": [{
    "slug": "ji-ji-ji", "disco": "oktubre", "estado": "medido",
    "video": {
      "id": "AAAAAAAAAAA", "canal": "topic",
      "canalId": "UCv6PTVMYCpYJDBK4YiJz_4g",
      "canalNombre": "Patricio Rey y sus Redonditos de Ricota - Topic",
      "titulo": "CASO DE PRUEBA", "resolucion": "manual",
      "resuelto": "2026-08-24"},
    "medicion": {"vistas": 1234, "medido": "2026-08-24"}}]}
JUST = "Caso de prueba: por que este video y no otro, en mas de veinte caracteres."

def caso(n, nombre, muta, espera, nivel="item"):
    d = copy.deepcopy(BASE)
    muta(d["temas"][0] if nivel == "item" else d)
    try:
        jsonschema.validate(d, S); real = "valida"
    except jsonschema.ValidationError:
        real = "rechaza"
    print(("OK " if real == espera else "MAL"), n, nombre, "->", real)

def sinvideo(i):
    i["estado"] = "sin-video"; i.pop("video"); i.pop("medicion")
    i["motivo"] = "No esta en el canal Topic y no hay otro video declarable."

caso(1, "entrada medido completa", lambda i: None, "valida")
caso(2, "numero sin fecha", lambda i: i["medicion"].pop("medido"), "rechaza")
caso(3, "medicion sin vistas", lambda i: i["medicion"].pop("vistas"), "rechaza")
caso(4, "vistas como string", lambda i: i["medicion"].__setitem__("vistas", "12345"), "rechaza")
caso(5, "vistas negativo", lambda i: i["medicion"].__setitem__("vistas", -1), "rechaza")
caso(6, "vistas fuera de medicion", lambda i: i.__setitem__("vistas", 999), "rechaza")
caso(7, "medido sin video", lambda i: i.pop("video"), "rechaza")
caso(8, "medido sin medicion", lambda i: i.pop("medicion"), "rechaza")
caso(9, "canal otro sin justificacion", lambda i: i["video"].__setitem__("canal", "otro"), "rechaza")
caso(10, "canal otro con justificacion", lambda i: (i["video"].__setitem__("canal", "otro"), i["video"].__setitem__("justificacion", JUST)), "valida")
caso(11, "sin-video con motivo", sinvideo, "valida")
caso(12, "sin-video con bloque video", lambda i: (sinvideo(i), i.__setitem__("video", copy.deepcopy(BASE["temas"][0]["video"]))), "rechaza")
caso(13, "sin-video sin motivo", lambda i: (sinvideo(i), i.pop("motivo")), "rechaza")
caso(14, "sin-medir conservando medicion", lambda i: (i.__setitem__("estado", "sin-medir"), i.__setitem__("motivo", "El contador no vino en la respuesta de la API.")), "rechaza")
caso(15, "retirado conservando medicion", lambda i: (i.__setitem__("estado", "retirado"), i.__setitem__("motivo", "Sale de circulacion por decision de contenido.")), "rechaza")
caso(16, "campo spotify", lambda i: i.__setitem__("spotify", {"popularity": 70}), "rechaza")
caso(17, "campo rank derivado", lambda i: i.__setitem__("rank", 3), "rechaza")
caso(18, "fuente spotify", lambda d: d.__setitem__("fuente", "spotify"), "rechaza", "archivo")
caso(19, "id con URL pegada", lambda i: i["video"].__setitem__("id", "https://www.youtube.com/watch?v=AAAAAAAAAAA"), "rechaza")
caso(20, "canalId sin UC", lambda i: i["video"].__setitem__("canalId", "v6PTVMYCpYJDBK4YiJz_4g"), "rechaza")
caso(21, "disco inventado", lambda i: i.__setitem__("disco", "el-regreso-de-patricio-rey"), "rechaza")
caso(22, "archivo sin vigenciaDias", lambda d: d.pop("vigenciaDias"), "rechaza", "archivo")
caso(23, "resolucion inventada", lambda i: i["video"].__setitem__("resolucion", "me-lo-dijo-un-amigo"), "rechaza")
caso(24, "video sin resolucion", lambda i: i["video"].pop("resolucion"), "rechaza")
PY
```

```bash
# (2) El archivo real: schema + slugs unicos + fechas + reparto por estado + los que no son
#     Topic, servidos en una linea para que los lea una persona. Se corre en T-118 y T-119.
python - <<'PY'
import json, datetime, jsonschema
d = json.load(open('src/data/popularidad.json', encoding='utf-8'))
s = json.load(open('src/data/_schema/popularidad.schema.json', encoding='utf-8'))
jsonschema.validate(d, s)
hoy = datetime.date.today()
temas, vids, noTopic = d['temas'], {}, []
assert len({t['slug'] for t in temas}) == len(temas), 'slug repetido'
for t in temas:
    v, m = t.get('video'), t.get('medicion')
    if v:
        if v['id'] in vids: print('MISMO VIDEO EN DOS TEMAS', t['slug'], vids[v['id']], v['id'])
        vids[v['id']] = t['slug']
        if datetime.date.fromisoformat(v['resuelto']) > hoy: print('FECHA FUTURA', t['slug'])
        if v['canal'] != 'topic':
            noTopic.append((t['slug'], v['canal'], v['canalNombre'], v['titulo']))
    if m:
        if datetime.date.fromisoformat(m['medido']) > hoy: print('MEDICION FUTURA', t['slug'])
        if v and m['medido'] < v['resuelto']: print('MEDIDO ANTES DE RESUELTO', t['slug'])
from collections import Counter
print('entradas:', len(temas), Counter(t['estado'] for t in temas))
print('por via de resolucion:', Counter(t['video']['resolucion'] for t in temas if 'video' in t))
if noTopic:
    print('FUERA DEL CANAL TOPIC — que el video sea el del tema NO lo ve la maquina (CTR-07.3).')
    print('Los elige `contenido` con el criterio de BR-18 (c). Una linea por entrada:')
    for x in noTopic: print('  ', ' | '.join(x))
# sin-video NO es "no esta en el Topic" (BR-18 c): es que no hay ningun video ubicable.
for t in temas:
    if t['estado'] == 'sin-video': print('SIN VIDEO — queda afuera del ranking:', t['slug'], '|', t['motivo'])
# BR-18 (f): el top-8 de faciles de US-02 sale de la posicion en este ranking, y un tema
# con fragmento y sin numero no tiene posicion. Si el manifiesto esta vacio no imprime nada.
try:
    frag = {f['slug'] for f in json.load(open('src/data/adivinar-tema.json', encoding='utf-8'))['fragmentos']}
except FileNotFoundError:
    frag = set()
conNumero = {t['slug'] for t in temas if 'medicion' in t}
huerfanos = sorted(frag - conNumero)
if huerfanos:
    print('CON AUDIO Y SIN NUMERO — no pueden entrar al top-8 de US-02 (BR-18 f):', ', '.join(huerfanos))
PY

# (3) Vigencia: cuantos dias tiene la medicion mas vieja contra el plazo del archivo.
python -c "import json,datetime;d=json.load(open('src/data/popularidad.json',encoding='utf-8'));f=[datetime.date.fromisoformat(t['medicion']['medido']) for t in d['temas'] if 'medicion' in t];print('sin mediciones') if not f else print('mas vieja:',(datetime.date.today()-min(f)).days,'dias | plazo:',d['vigenciaDias'],'|','VENCIDO' if (datetime.date.today()-min(f)).days>d['vigenciaDias'] else 'al dia')"

# (4) Que el JSON no entre a ninguna isla (presupuesto de cliente = 0, CTR-07.1)
grep -rn "popularidad.json\|data/popularidad" src/scripts/ || echo "OK: ninguna isla lo importa"
```

**Y lo que python no puede hacer, que es un test de node y lo escribe `T-118`** en
`src/lib/popularidad/banco.test.ts`. Son cinco aserciones y no hay que inventarlas:

1. Cada `slug` está entre los 105 de `RES-20` y su `disco` coincide con el de la ficha —
   `leerTemas()` y `slugDeTitulo()` de `src/lib/letra/temas.ts`. **Es la condición de `D-13`** y
   es la única que impide que entre un tema del Indio solista o de Skay.
2. `actualizado` es igual a la `medido` más reciente del archivo.
3. Toda entrada `medido` tiene su `medicion.medido` **dentro de `vigenciaDias`** contra la fecha
   de hoy. **Este es el que falla en rojo** cuando la medición vence (`CTR-07.6`).
4. Ninguna entrada `retirado` o `sin-video` conserva un número (lo cubre el schema; el test lo
   deja dicho en el lenguaje del proyecto).
5. La cuenta de entradas es ≤ 105 y ninguna se repite.

| # | Chequeo | Quién |
|---|---|---|
| 1 | Schema completo contra el dato real | `esquemas.test.ts`, comando (0) |
| 2 | Casos de prueba del schema | comando (1) |
| 3 | Slugs únicos, ids no repetidos, fechas coherentes | comando (2) |
| 4 | `slug` y `disco` contra `RES-20` (`D-13`) | test de node, aserción 1 |
| 5 | Vigencia de la medición | test de node, aserción 3; comando (3) para mirarlo a mano |
| 6 | Que el video sea el del tema y no un vivo o un cover | **`revisor`**, con la lista del comando (2) |
| 7 | Que la pantalla atribuya: YouTube, canal y fecha (RNF-CTR-07-A) | **`revisor`**, en `T-119` |
| 8 | Que un refresco no haya tocado el bloque `video` | `git diff` después de correr el script |
| 9 | Que ningún tema con fragmento se quede sin número (`BR-18` f) | comando (2), cruce con `adivinar-tema.json` |
| 10 | Que un `sin-video` sea de verdad "no hay ningún video", y no "no está en el Topic" | **`revisor`**, con los motivos que imprime el comando (2) |

---

### CTR-07.12 — Claves y numeración: no hay prefijo nuevo

**La clave de una entrada es el `slug` del tema, y no se inventa un `PO-NNN`.** Los bancos de
juego tienen prefijo propio (`QZ-`, `TM-`, `TP-`) porque un ítem es una pieza nueva que alguien
escribió. Acá no hay pieza nueva: hay un tema que **ya tiene identidad** —el slug derivado del
título canónico de `RES-20`, el mismo que usan `CTR-06` y `CTR-03`— y un dato colgado de él.
Un segundo identificador para la misma cosa es una segunda verdad que se puede desincronizar, y
la desincronización sería silenciosa.

**Una entrada por tema, como máximo 105.** Un tema con dos videos declarados no existe en este
contrato: elegir cuál es "el" video es justamente la decisión que `RES-52` obliga a tomar y a
declarar. Si algún día se quisiera guardar más de uno —el estudio y el vivo— es `CTR-07` v2, no
un array que aparece un día.

---

### Consecuencias

- **`T-118` no puede escribir una cifra sin fecha ni un video sin canal.** No hay tilde que
  marcar: hay un objeto con dos campos requeridos y un `if/then` por estado.
- **`T-118` tiene tres entregables, no uno:** el script con sus dos modos, el JSON, y la línea
  que agrega `'popularidad'` a `src/lib/esquemas.test.ts`. Sin la tercera, el schema no se corre.
- **Fácil:** cambiar la cadencia de refresco. Es un entero del envoltorio y lo decide `producto`
  — `BR-18` (d) lo puso en 180 y moverlo no invalida un solo dato cargado.
- **Fácil:** sacar un tema del ranking. `estado: "retirado"` con motivo; la entrada se queda.
- **Fácil:** refrescar. Tres llamadas, tres unidades de cuota, un comando.
- **Caro, y a propósito:** resolver los ids. Es el modo que hay que pedir explícitamente, y el
  refresco no lo puede disparar solo.
- **Difícil, y asumido: el schema no mira el video.** Puede garantizar que la entrada declare de
  cuál habla; no puede ver que sea un vivo de 1997. Ese es el chequeo 6 y es de `revisor`.
- **`experiencia` hereda un requisito duro** que no sale del gusto de nadie sino de los términos
  de YouTube: RNF-CTR-07-A, las tres piezas juntas o no va el número.
- **Este dataset toca la v1, y eso es nuevo desde `BR-18` (f).** El orden que sale de acá define
  la cuota de fáciles de `US-02`, una de las cuatro historias del "Listo" (`D-05`). Lo que el
  contrato aporta es el número y su fecha; el top-8 se computa en build sobre el pool con
  fragmento, y **no** se guarda acá.
- **`contenido` hereda una tarea que antes no tenía nombre:** elegir el video de cada tema que no
  esté en el canal Topic, con el criterio de `BR-18` (c), y escribir la `justificacion`. El
  contrato le exige el campo; el criterio ya se lo dio `producto`.

### Qué NO decide este contrato

- **Qué promete el sitio con este dato** —cifra u orden, cadencia, qué pasa con un tema sin
  video—: `producto`, y ya está decidido en **`BR-18`**. El mapa apartado por apartado está en
  `CTR-07.8`.
- **Qué video se declara cuando el tema no está en el canal Topic**: `contenido`, con el criterio
  de `BR-18` (c). Yo fijo que haya que declararlo y que sin justificación no valide.
- **Dónde se ve el orden, cómo se ve y con qué palabras**: `experiencia` y `contenido`. La frase
  que se puede escribir sin mentir ya la dejó `RES-52`, y el registro que le toca es el 3.
- **Si el ranking se muestra por disco, por época o entero**: `producto` y `experiencia`.
- **Qué video es el de cada tema**: sale de la resolución de `T-118` mirando el canal Topic, y lo
  audita `revisor`. Yo fijo qué hay que declarar, no cuál es.
- **`ADR-01` no se toca acá.** Después de `D-22` y `D-23`, `ADR-01` es sobre dónde viven los mp3
  y con qué bitrate. Este dataset no toca audio: no descarga nada de YouTube (`RES-11`, `D-06`
  siguen valiendo), solo lee un contador.

### CTR-07.13 — Lo que quedó sin fichar, y por eso no está escrito acá

Tres cosas que este contrato **no** afirma porque no hay ficha, con lo que habría que preguntar.
Ninguna bloquea `T-118`:

1. **Qué exigen las Brand Features de YouTube para atribuir.** `RES-52` (d) nombra la obligación
   sin detallarla. El piso que fija RNF-CTR-07-A es texto; si `experiencia` quiere el logo, antes
   hace falta la ficha.
2. **Si listar el canal Topic es una vía barata para resolver los 105 ids.** Es la pregunta que
   más plata cuesta de las tres y la dejo redactada como se la pediría a `investigador`, con la
   hipótesis del hilo principal adentro y **rotulada como hipótesis**:

   > `RES-52` ficha dos métodos y nada más: `videos.list` (1 unidad, hasta 50 ids) y
   > `search.list` (100 unidades). Con eso, resolver 105 temas por búsqueda son ~10.500
   > unidades, más que la cuota diaria entera. **Hipótesis sin verificar:** todo canal de
   > YouTube tendría una playlist de subidas, y listarla con `playlistItems.list` costaría 1
   > unidad por página de 50 — o sea unas 3 llamadas para el canal entero, devolviendo id y
   > título juntos, que es justo lo que hace falta para cruzar contra los 105 de `RES-20` por
   > la puerta de `D-13`. **Las tres preguntas concretas:** (a) ¿existe y es accesible esa
   > playlist para el canal Topic `UCv6PTVMYCpYJDBK4YiJz_4g`? (b) ¿cuánto cuesta `playlistItems.list`
   > según la documentación de cuota? (c) ¿el canal tiene los 105 temas, y con qué títulos?

   **Si la respuesta es que sí, la fase 1 se vuelve barata y el archivo no cambia una coma** —
   solo cambia qué valor lleva `video.resolucion`. Si es que no, se resuelve a mano y también
   entra. Por eso el contrato no elige (`CTR-07.4`).
3. **Si pedir más de una `part` en la misma llamada cambia el costo de cuota.** La ficha midió
   `part=statistics`. Si el script termina pidiendo también el título o la duración en la misma
   llamada, que la primera corrida **mida la cuota consumida** y, si no da 3 unidades para 105
   temas, eso es una ficha nueva y no una sorpresa.
