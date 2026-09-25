# ARQ — Los recitales: lo que se cita de setlist.fm y lo que se guarda entero

> Rol dueño: `arquitectura`. **Produce: `CTR-19`** (`CTR-19.1` … `CTR-19.16`) y dos requisitos no
> funcionales, `RNF-CTR-19-A` y `RNF-CTR-19-B`. Tarea `T-273` del ciclo 16. Fecha: 2026-09-23.
>
> **Enmendado el 2026-09-24 por `T-284` (ciclo 16, ráfaga 3), después de `D-46` y `BR-30`.**
> Decía `CTR-19.1` … `CTR-19.14`. Entran tres cosas: el **conteo completo** de `RES-90` en lugar
> del top-25 de `RES-74`, una **tercera forma de línea** (`grafiaDe`, `CTR-19.2`) y la **segunda
> regla que sale del conteo, los tercios de `US-07`** (`CTR-19.15`). El cruce completo, caso por
> caso, está en `CTR-19.16`. Cada apartado tocado dice al principio qué decía antes. Consume
> además: `D-46`, `BR-30`, `RES-89` a `RES-92` (`INV-89`), `CTR-09`,
> `scripts/generar-por-la-letra.mjs`, `src/data/por-la-letra.json`, `src/lib/en-vivo.ts`.
>
> **Consume:** `D-13`, `D-14`, `D-27`, **`D-45` y su enmienda del 2026-09-23**, `BR-01`,
> `BR-18` (a), (b), (d), (f), (g) y **(h)** (lo escribe `T-274` en paralelo; lo leí en disco el
> 2026-09-23), `BR-28`, `US-02`, `RES-20`, `RES-25`, `RES-52` (d), **`RES-73`, `RES-74`,
> `RES-75`** (`INV-73`, con la nota del hilo principal sobre *Sushi*), `CTR-03.11`, `CTR-07`
> (`.1`, `.2`, `.3`, `.4`, `.5`, `.6`, `.7`, `.8`), `ORQ-plan-ciclo-16.md` (§2, §2.3, §5, §6),
> `src/lib/popularidad.ts`, `src/lib/tema/catalogo.ts`, `src/lib/letra/temas.ts`
> (`resolverTema`, `ALIAS`), `src/lib/texto.ts`, `src/lib/escalonar.ts`,
> `src/scripts/partida-tema.ts`, `src/pages/juegos/adivinar-el-tema.astro`,
> `src/lib/esquemas.test.ts`, `src/data/adivinar-tema.json`.
>
> **Otros dos escriben en paralelo, y este contrato tiene que aguantar lo que digan:** `RES-76`+
> (`T-281`, `investigador`: qué fuentes abiertas de setlists hay y con qué licencia) y el
> apartado (h) de `BR-18` (`T-274`, `producto`). Lo que depende de ellos figura como hueco con
> dueño en `CTR-19.14`. Ninguno de los dos cambia la forma de los archivos.

---

## CTR-19 — Los recitales: dos piezas que no se derivan una de la otra

- **Estado:** vigente. **La pieza 1 no tiene nada abierto**: lo que necesita ya está fichado en
  `RES-73`..`RES-75`. **La pieza 2 tiene la forma cerrada** y un solo punto que es *supuesto*:
  la tabla de qué licencia entra en qué archivo (`CTR-19.8`). Esa tabla no se escribe de memoria
  y queda pedida como ficha. Si la ficha dice menos de lo que supone la tabla, la tabla se
  afloja y la forma del archivo no cambia.
- **Enmienda del 2026-09-24 al estado.** Decía que la pieza 1 no tenía nada abierto. Con el conteo
  completo le quedan dos huecos declarados, ninguno bloqueante: la cola de 51 títulos en 1 puede
  tener huecos (`RES-89.4`), y eso ya lo dice `completo: false`; y cuatro inconsistencias chicas de
  la ficha, pedidas a `investigador` (`CTR-19.16`, último punto).
- **Para quién:** para `T-279`, que construye los dos archivos, sus schemas, el corte y el
  cambio de `catalogo.ts`. Y para `revisor`, que tiene que poder rechazar una línea o un recital
  sin preguntarle a nadie.
- **Qué resuelve.** `D-45` enmendada separó en dos lo que el usuario había pedido junto. **El
  orden de los Fáciles** sale de un número que publica setlist.fm, y el sitio lo **cita**. **Los
  setlists enteros** se guardan solo desde fuentes cuya licencia lo permite, y el sitio los
  **redistribuye** con esa licencia. Citar y redistribuir son dos regímenes distintos. Este
  contrato los pone en dos archivos para que no se mezclen.

---

### CTR-19.1 — Dos archivos, separados por licencia y no por tema

| | Pieza 1 — lo citado | Pieza 2 — el archivo |
|---|---|---|
| Archivo | `src/data/setlistfm.json` | `src/data/recitales.json` |
| Schema | `src/data/_schema/setlistfm.schema.json` (`CTR-19.10`) | `src/data/_schema/recitales.schema.json` (`CTR-19.11`) |
| Qué guarda | cuántas veces figura cada tema en la página de estadísticas de setlist.fm, y un índice opcional de enlaces a sus recitales | recitales con los temas en orden, de fuentes abiertas |
| Régimen | **citado, no licenciado.** setlist.fm da licencia para ver (`RES-73.1`): el sitio cita un número con su página y su fecha, y enlaza | **licenciado.** Se redistribuye bajo la licencia de salida que declara el archivo (`CTR-19.8`) |
| Fuente | una sola, `const` | varias; cada recital nombra la suya, y cada fuente trae su licencia textual |
| Quién lo escribe | a mano, desde una ficha `RES-`. **Ningún script lee setlist.fm** (`ORQ-plan-ciclo-16.md §2.3`) | `scripts/ingerir-recitales.mjs`, por la vía que fiche `RES-76`+ |
| Cómo envejece | vence, porque es una medición (`CTR-19.6`) | se acumula: un recital de 1993 no cambia |
| Qué alimenta | el corte de Fáciles de `US-02` (`CTR-19.5`) y **los tercios de `US-07`** (`CTR-19.15`) | **nada en este ciclo.** Ningún módulo lo lee en build (`CTR-19.8`, regla 4) |
| Presupuesto de tamaño | ≤ **80 KB** (conteo ~25 KB con 198 líneas; índice de hasta 256 enlaces × ~230 B) | ≤ **400 KB** (256 recitales × ~1,2 KB, con margen para dos versiones de algunos) |
| Presupuesto de cliente | **0 KB.** Se lee en build. Al navegador llegan solo la `dificultad`, que ya viaja con cada tema, y la fecha de consulta para el rótulo | **0 KB** |

> **Enmendada el 2026-09-24 (`T-284`).** La fila *Qué alimenta* de la pieza 1 decía solo *"el
> corte de Fáciles de `US-02` (`CTR-19.5`)"*, y la de tamaño *"conteo ~2 KB"*, que eran 25
> líneas. Con 198 líneas y una `nota` en las que no cruzan, el bloque ronda los 25 KB: entra en el
> techo de 80 sin moverlo. **El presupuesto de cliente no cambia**: `US-07` recibe el nivel ya
> escrito en su banco, no el conteo (`CTR-19.15`).

**Por qué se separan por licencia y no por tema.** Tres razones, y cada una alcanza sola:

1. **Un archivo con licencia de salida no puede contener nada que el sitio no pueda licenciar.**
   Si entra un solo recital CC BY-SA, el archivo entero sale bajo CC BY-SA (`CTR-19.8`). El
   índice de setlist.fm (fecha, lugar, página) y sus conteos no son del sitio. Dentro de ese
   archivo, el sitio estaría ofreciendo bajo BY-SA algo que setlist.fm solo le deja ver. Nadie
   puede licenciar lo que no le pertenece: `RES-25` lo dijo de las tapas, y acá pasa lo mismo.
2. **Envejecen distinto.** El conteo se refresca entero cada tanto y el archivo suma recitales de
   a uno. Es el mismo argumento de `CTR-07.1` para no meter las vistas en el cancionero: si
   comparten archivo, un refresco reescribe lo que no tenía que tocar.
3. **"Una pieza no sale de la otra" se vuelve comprobable.** Con dos archivos alcanza con buscar
   texto: el código del corte no nombra `recitales.json` (`CTR-19.13`, t8).

*Alternativa descartada:* **un solo `recitales.json` con un bloque `conteo`** al lado de
`recitales`. Es lo que pedía el plan antes de la enmienda y lo que uno escribe primero. Cae por la
razón 1: la licencia se declara por archivo, y el conteo y el índice de setlist.fm quedarían
dentro de una licencia que no les corresponde.

*Alternativa descartada:* **sacar el conteo de la pieza 2**, contando los setlists guardados. Era
la forma original de `D-45` punto 2, y la enmienda la reemplazó por tres motivos. La cobertura de
las fuentes abiertas se desconoce (`T-281` la está buscando) y casi seguro es distinta de la de
setlist.fm. El corte cambiaría cada vez que entra un recital. Y la cifra sería una cuenta del
sitio sobre una base propia, no un dato citado: el "tercer número que nadie publicó" que
`CTR-07.7` prohíbe fabricar.

*Alternativa descartada:* **meter el conteo en `popularidad.json`** como segunda fuente. `CTR-07.7`
lo impide con `fuente: const "youtube"`, y `D-45` consecuencia 1 lo confirma: otro archivo, otro
contrato, otra cuenta.

---

### CTR-19.2 — El cruce de títulos: una sola puerta, la de `D-13`

**La regla es `resolverTema()` de `src/lib/letra/temas.ts`, sin tocarla.** Primero mira el mapa
`ALIAS`, donde están los casos que alguien decidió a mano. Después normaliza con
`normalizarDuro()`, que saca tildes, puntuación y espacios: `Semen Up` es `Semen-Up`,
`¡Cruz diablo!` es lo mismo con o sin `¡`. Es la puerta de `D-13` hecha función, y la usan ya el
cancionero y el manifiesto de audio.

**Se cruza contra los 105 de `RES-20`** (`leerTemas()`), no contra los 104 de `cancionero.json`.
El "104 contra 105" que `INV-73` dejó sin resolver no existe: el tema que falta en el cancionero es
*Sushi*, que es instrumental, y la ficha lo incluye (nota del hilo principal en `INV-73`).

*Alternativa descartada:* **la normalización que propone `RES-75`** (minúsculas, sin tildes, sin
`¡¿`, `vs.`→`versus`, y el slugify). Hace casi lo mismo que `normalizarDuro()`, y en un solo caso
hace más: el `vs.`→`versus`. Volver regla general ese único caso sería escribir un segundo
normalizador que decide distinto que el primero sobre cualquier título de cualquier fuente. Dos
puertas son dos verdades. El `vs.` entra como alias.

> **Enmendado el 2026-09-24 (`T-284`).** La tabla de abajo cuenta las 25 líneas de `RES-74` y se
> deja como estaba. Sobre las 198 de `RES-90` hacen falta **tres filas más** —*Nuotatori
> profesionisti*, *Es hora de levantarse querido ¿Dormiste bien?* y *Rock del país*—, con su
> motivo en `CTR-19.16`.

**Lo que necesita hoy `ALIAS`, contado sobre las 25 líneas de `RES-74`:** dos filas nuevas y una
que ya existía.

| Título en setlist.fm | Título en `RES-20` | Por qué no alcanza la normalización | Estado |
|---|---|---|---|
| `Ñam fri fruli fali fru` | `Ñam fri frufi fali fru` | cambia una letra (`RES-75`). Manda `RES-20` | **nueva** |
| `Barbazul vs. el amor letal` | `Barbazul versus el amor letal` | abreviatura (`RES-75`) | **nueva**. La que ya existe es `Barba Azul vs.`, de otra fuente, y `ALIAS` compara el título exacto |
| `Mariposa Pontiac` | `Mariposa Pontiac - Rock del país` | la fuente nombra solo la primera mitad de un tema compuesto | **ya existe** |

Las otras 20 líneas del catálogo resuelven solas. Los sobrenombres de época de `RES-75` (*Camila*,
*Pituca*) entran a `ALIAS` **cuando aparezcan en un dato**, no antes. `temas.test.ts` ya prueba que
ningún alias sobra frente a la normalización, y un alias que no resuelve nada en ningún archivo es
una fila que nadie puede discutir con un caso concreto.

**Lo que no cruza se declara, no se tira.** `D-45` pidió los setlists enteros, así que un tema
fuera del catálogo se guarda en su lugar con una de cinco clases:

| `fuera` | Qué es | De dónde sale |
|---|---|---|
| `inedito` | tocado en vivo y nunca en los diez discos: demos, piezas anteriores a *Gulp!*, lo que solo salió en discos en vivo | `RES-75` |
| `cover` | tema ajeno o colaboración | `RES-75` |
| `intro` | **no es un tema**: cinta o grabación que suena antes de que entre la banda, presentación, solo o zapada. *Enmendado el 2026-09-24: decía solo "cinta o grabación que suena antes de que entre la banda"; `RES-91` pone en la misma clase "intro/cinta/interludio, no es canción" (*Skay Guitar Solo*, *Instrumental Jam*). El valor del enum no cambia* | `RES-75`, `RES-91` |
| `cantico` | lo que canta la gente, no la banda | `RES-75` |
| `sin-identificar` | todavía nadie sabe qué es. **Exige `nota`** con lo que se sabe | este contrato: sin esta clase, un título raro frena la ingesta entera o termina en una clase que no le corresponde |

**El slug se guarda, y se verifica.** Cada línea lleva el `slug` que devuelve la puerta o la clase
`fuera`, nunca las dos. El test recalcula `resolverTema()` sobre cada `titulo`: exige que dé
exactamente el `slug` guardado y que las líneas `fuera` sigan sin resolver. Si mañana alguien suma
un alias y un título que era `sin-identificar` pasa a resolver, el test se pone en rojo y lo nombra.

*Alternativa descartada:* **guardar solo el título y calcular el slug en build**, que es lo que
`CTR-07.7` pide para todo lo derivable. Acá no aplica, por dos motivos. Las clases `fuera` son
decisiones de una persona y hay que guardarlas igual. Y la pieza 2 se redistribuye (`CTR-19.8`):
un archivo que solo se entiende corriendo el código del sitio no le sirve al que lo baja. El riesgo
que `CTR-07.7` evita, un dato guardado que se desactualiza sin que nadie lo note, lo cubre el
recálculo en cada `npm test`.

**Un número por línea y una línea por slug.** En la pieza 1, si dos títulos publicados resuelven al
mismo tema (*Rock para el negro Atila* y *Camila*, el día que aparezcan los dos), el test falla y
los nombra. **No se suman.** Sumarlos supone que nunca figuran los dos en el mismo setlist, y eso
el sitio no lo sabe: la suma sería un número del sitio, no de setlist.fm. Una de las dos líneas
pasa a `fuera: "sin-identificar"` con una `nota` que diga a qué tema corresponde y por qué no
cuenta. El costo queda declarado: el tema se queda con el número de una sola de sus grafías.

> **Enmendado el 2026-09-24 (`T-284`): la grafía que no cuenta lleva `grafiaDe`, no
> `sin-identificar`.** Lo que dice el párrafo de arriba era una hipótesis y dejó de serlo:
> *Mariposa Pontiac - Rock del país* figura de tres formas (`RES-91`). La salida que fijaba no se
> puede cumplir y además mentiría. **No se puede cumplir** porque *Mariposa Pontiac / Rock del
> país* resuelve sola por `normalizarDuro()`, y t1 pone en rojo una línea `fuera` que resuelve.
> **Mentiría** porque `sin-identificar` dice que nadie sabe qué es, y de estas líneas se sabe.
>
> **La regla nueva:** entre las líneas que resuelven al mismo tema, **la que más figura lleva el
> `slug`**. Las otras llevan `grafiaDe: "<ese slug>"` y una `nota` obligatoria, y no suman. Se queda
> la mayor porque es el número que la página sostiene: el tema está, como mínimo, en esos setlists.
> La suma sería un máximo, y la página tampoco lo sostiene, porque dos grafías pueden estar en el
> mismo setlist. **Una línea `grafiaDe` no entra a ningún reparto ni sube ningún techo**
> (`CTR-19.5` paso 2, `CTR-19.15` paso 1). Se sabe de qué tema es, y ese tema ya tiene su número.
> Queda el costo que el párrafo de arriba ya declaraba, ahora con un número de ejemplo. *Mariposa
> Pontiac* cuenta 43, no 43 + 37 + 10.
>
> *Alternativa descartada:* **sacar el alias `Mariposa Pontiac`** para que solo resuelva la forma
> combinada. Lo usan el cancionero y el manifiesto de audio, que titulan la primera mitad sola, y
> la cifra que quedaría (10) es la más chica de las tres. *Alternativa descartada:* **una sexta
> clase `fuera`**. `fuera` quiere decir fuera del catálogo, y estas líneas son del catálogo.

**Medleys y temas partidos (pieza 2).** Cada tema es una entrada. `pegadoAlAnterior: true` indica
que se tocó sin corte después del anterior: un medley, un enganche, o un tema compuesto del
catálogo que la fuente parte en dos. Nunca va en el primer tema. Dos entradas seguidas con el
mismo `slug` solo tienen sentido con `pegadoAlAnterior`; sin él, el comando (2) las muestra para
que las revise una persona.

---

### CTR-19.3 — Pieza 1: el conteo citado

> **Enmendado el 2026-09-24 (`T-284`, `D-46`).** El bloque pasa a ser **el conteo completo de
> `RES-90`**: `consultado: "2026-09-24"`, `ficha: "RES-90"`, **198 líneas** (los 147 puestos
> numerados y los 51 títulos de la cola en 1), `completo: false`. Lo de abajo describía el top-25 y
> queda como estaba. Cambian tres lecturas:
>
> 1. **`completo`** decía *"si la página publica todos los temas tocados o solo un top"*. Ahora dice
>    **si el bloque tiene todas las líneas que publica la página**. La página publica todos los
>    temas, pero `RES-89.4` no garantiza que la cola esté completa, y el total de la página no se
>    pudo verificar (`RES-89.5`, `RES-92.4`). Por eso queda en **`false`**. La lectura de siempre
>    sigue igual: un tema que no figura tiene como mucho lo que la última línea, que ahora es
>    **1**. No es cero. El *"246 títulos"* de `RES-89.5` no se usa en ningún lado.
> 2. **"Son 25"** (en *Cómo se escribe*) pasa a 198. Se siguen copiando a mano desde el anexo de
>    `INV-89` y en su orden: los puestos 1 a 147 y después la cola, en orden alfabético como en la
>    página. `t2` pasa igual (`veces` no sube). **Ninguna regla depende del orden dentro de un
>    empate** (`CTR-19.5` paso 3, `CTR-19.15` paso 4). Por eso la discrepancia de puesto de
>    `RES-92.3` (143 o 147) no llega al dato: el puesto no se guarda.
> 3. **El `titulo` es el de la página. Lo que aclara la ficha va a `nota`.** En la cola hay dos
>    títulos que traen pegada una aclaración de `investigador`: *Hercules mío (cover de Vivi Tellas,
>    distinto del de la banda)* y *"Olé olé olé olé, Patricio Rey" (Lange Jojo cover — confirmado en
>    `RES-92`…)*. El `titulo` es el nombre sin la aclaración, y la aclaración va a `nota`. **La
>    clase `fuera` sale de la ficha** (`RES-75`, `RES-91`), nunca de lo que recuerde quien copia.
>    Lo que la ficha no clasifica va como `sin-identificar`, con esta nota: *"Fuera de los 105 de
>    RES-20; la ficha no dice si es inédito, cover o variante (RES-91)."*

```json
"conteo": {
  "pagina": "https://www.setlist.fm/stats/patricio-rey-y-sus-redonditos-de-ricota-bd615a2.html",
  "consultado": "2026-09-22",
  "ficha": "RES-74",
  "vigenciaDias": 180,
  "setlistsCargados": 256,
  "completo": false,
  "temas": [ { "titulo": "Jijiji", "veces": 101, "slug": "jijiji" } ]
}
```

| Campo | Qué es | Por qué así |
|---|---|---|
| `pagina` | la URL completa de la página de estadísticas | el patrón solo acepta `setlist.fm/stats/`: un conteo sacado de otra página no es este dato |
| `consultado` | el día en que se leyó | **una fecha para todo el bloque**; ver más abajo |
| `ficha` | la `RES-` que lo transcribió | el número tiene que poder rastrearse hasta alguien que lo leyó |
| `vigenciaDias` | cuánto vale antes de refrescarse | `CTR-19.6` |
| `setlistsCargados` | el total que declara la página | **256**, lo que dice la página de la que sale el conteo. El 255 de la paginación sigue sin resolver en `RES-74` y no se usa acá |
| `completo` | si la página publica todos los temas tocados o solo un top | hoy `false`: `RES-74` leyó un top-25 |
| `temas[]` | una línea por título publicado, **en el orden de la página** | `titulo` tal cual, `veces`, y `slug` o `fuera` |

**Qué significa `veces`, y es lo que el rótulo no puede estirar:** cuántas veces figura el título
en los setlists que la gente cargó en setlist.fm. **No es cuántas veces lo tocó la banda.** La
página cubre 256 recitales cargados; `RES-74` estima sobre una muestra que alrededor del 8% no trae
temas; y la banda tocó más recitales de los que alguien cargó. Es la misma rebaja de promesa que
`BR-18` (a) aplicó a YouTube: de "el más escuchado" a "el más visto en un video".

**`completo: false` significa que no figurar no es cero.** Si la página publica un top, un tema
que no aparece figura, como mucho, tantas veces como la última línea (hoy, 41). El corte de
`CTR-19.5` usa ese techo. Un cero en su lugar diría algo que la página no dice: es el "cero falso"
que prohíbe `CTR-07.4`, regla 5.

**Una sola fecha, no una por línea.** Es lo contrario de lo que eligió `CTR-07.2`, y a propósito.
Allá eran 105 llamadas que podían caer en días distintos; acá es **una página que se lee una
vez**. La regla que lo sostiene: **en cada refresco se reescribe el bloque entero**, con la misma
fecha en todas las líneas. *Alternativa descartada:* una fecha por línea, para poder refrescar una
sola. Si en un mismo orden hay cifras de días distintos, un tema puede subir de puesto solo porque
se leyó un mes después, y el orden deja de medir lo que dice medir.

**No se guarda `puesto`, ni `rank`, ni el corte.** El orden ya está en el arreglo y los Fáciles se
calculan (`CTR-19.5`). El conteo sí se guarda, y eso no contradice `CTR-07.7`: es una medición que
publica un tercero, como las vistas, no una conclusión del sitio.

**Cómo se escribe:** a mano, copiando las líneas de la ficha. Son 25. *Alternativa descartada:*
que el build lea la ficha, como `leerTemas()` lee `RES-20`. Sería una sola fuente de verdad, y
por eso tienta. Pero `INV-73` ya cambió de forma en su primera ronda de corrección, y un parser
sobre texto escrito para personas se rompe con la próxima. `RES-20` es una lista numerada estable;
esto no lo es.

---

### CTR-19.4 — Pieza 1: el índice de enlaces

Es opcional. Es lo que la enmienda de `D-45` deja guardar de setlist.fm además del conteo:
**fecha, lugar y la página**. Nada más. El lugar va en dos campos, `lugar` y `ciudad`, con la
misma forma que en la pieza 2, para que las dos se puedan unir sin traducir nada. No es un dato
de más: es el mismo "lugar" que nombra la enmienda, en dos columnas.

- **Nunca los temas, y nunca cuántos temas.** El schema no tiene dónde escribirlos
  (`additionalProperties: false`). La columna "Temas" del anexo de `INV-73` no se copia aunque
  esté a mano: `RES-74` avisa que salió de un modelo chico que resumía el HTML, y es la columna
  menos confiable de la ficha (dice 13 en casi todas las filas).
- **Crece solo con fichas.** Hoy son las 40 filas del anexo de `INV-73`. Completar las 26 páginas
  del listado sería recorrer setlist.fm entero, que es justo lo que restringe `RES-73.1`. Si el
  usuario lo quiere, lo pide explícitamente, y no lo hace un script.
- **Se une con la pieza 2 por fecha**, sin copiar nada de un lado al otro. Un recital de una
  fuente abierta y su página en setlist.fm comparten `fecha` (y `orden`, si hubo dos ese día).
  Así una pantalla futura puede ofrecer "ver en setlist.fm" al lado de un setlist abierto.

---

### CTR-19.5 — El corte de Fáciles: cómo lo lee el build sin tocar las vistas

**La regla es de `D-45` punto 1 y de `BR-18` (h)**: dentro del pozo con fragmento de audio, los 8
títulos de mayor conteo citado que resuelven a un slug del catálogo. Este apartado define dónde
vive, qué hace cuando no alcanza y cómo se evita que se mezcle con YouTube.

**Dónde vive: en un módulo nuevo y puro, `src/lib/en-vivo.ts`**, sin `node:fs` y sin importar
ningún JSON:

```ts
export interface LineaCitada {
  readonly titulo: string;
  readonly veces: number;
  readonly slug?: string;
  readonly fuera?: string;
}
export interface ConteoCitado {
  readonly pagina: string;
  readonly consultado: string;
  readonly completo: boolean;
  readonly temas: readonly LineaCitada[];
}
export interface CorteEnVivo {
  readonly porSlug: ReadonlyMap<string, NivelDificultad>; // solo los del pozo
  readonly faciles: number;       // 8 si el corte está determinado
  readonly conConteo: number;     // temas del pozo con una línea publicada
  readonly determinado: boolean;
  readonly motivo: string | null; // si no está determinado: los dos nombres y los dos números
}
export function repartirEnVivo(
  pozo: ReadonlySet<string>,
  conteo: ConteoCitado | null,
  cuota = 8,
): CorteEnVivo;
```

**El algoritmo (normativo):**

1. `L` son las líneas con `slug` dentro del `pozo`, de mayor a menor `veces`. El orden es estable:
   a igual número, queda el orden de la página.
2. `techo(m)` es lo máximo que puede tener un tema que **no** quedó entre los primeros `m` de `L`
   y que podría estar por encima. Es el mayor de tres valores: (a) la línea siguiente de `L`,
   `L[m]`, **o 0 si `L` no tiene más líneas**; (b) si `completo` es `false`, la **última línea
   publicada** de todo el conteo, porque un tema que no figura tiene como mucho eso; (c) la mayor
   línea `sin-identificar`, o 0 si no hay, porque podría ser un tema del pozo publicado con otro
   nombre. Las líneas `inedito`, `cover`, `intro` y `cantico` no suben el techo: se sabe que no
   son del pozo.
3. **Los Fáciles son los primeros `m` de `L`**, con `m` el mayor valor entre 0 y
   `min(cuota, |L|)` tal que `L[m-1].veces > techo(m)` (`m = 0` siempre cumple). La desigualdad es
   estricta: **un empate en el borde no lo decide el azar ni el orden del arreglo.**
4. `determinado` vale `m === cuota`. Si no, `motivo` dice por qué, por ejemplo: *"La bestia pop
   (57) empata con Aquella solitaria vaca cubana (57) en el puesto 8"*, *"hay 6 temas del pozo con
   conteo y la cuota es 8"*, o *"«X» (sin identificar) figura 60 veces, arriba del corte"*.
5. **Media y Difícil**: `media` son las líneas de `L` que no quedaron en Fácil, y `dificil` los
   temas del pozo sin línea publicada. Más abajo se explica por qué esta regla y de quién es.
6. Con `conteo === null`, todo el pozo queda en `dificil`, con `faciles: 0` y
   `motivo: "sin conteo"`. Es la misma degradación declarada de hoy, con otro insumo.

**Si no alcanza, no se pasa en silencio a otro criterio (`D-45`).** Con `determinado: false` la
página se arma igual, con los Fáciles que sí quedan separados (esos son indiscutibles), y **el test
se pone en rojo** con el `motivo` (`CTR-19.13`, t5). El sitio no se rompe por un empate en un
número de un tercero: se le avisa a quien trabaja, que decide con el usuario.

**Lo que da hoy**, como lectura derivada de `RES-74` y no como lista fija: *Jijiji* 101, *Ñam fri
frufi fali fru* 93, *Vamos las bandas* 90, *Nadie es perfecto* 71, *Divina TV. Führer* 69, *Nueva
Roma* 61, *Mi perro dinamita* 58, *La bestia pop* 57. El techo del puesto 8 es
`max(55, 41, 0) = 55`, de *Aquella solitaria vaca cubana*. Como `57 > 55`, el corte está
**determinado**. Los 23 títulos del top que resuelven están todos en el pozo de 95
(`adivinar-tema.json`), así que el reparto queda en **8 Fáciles, 15 Media y 72 Difícil**. *Un tal
Brigitte Bardot* (80) y *Nene nena* (68) son `inedito` y no entran (`RES-75`).

> **Con el conteo completo (enmienda del 2026-09-24, `T-284`).** Los 8 Fáciles son los mismos. El
> techo del puesto 8 pasa a `max(55, 1, 32) = 55`. La última línea publicada es ahora 1, y el
> `sin-identificar` más alto es *Blues del noticiero*, con 32. Como `57 > 55`, el corte **sigue
> determinado**. Lo que se mueve mucho es el resto: de los 95 temas del pozo, 90 tienen línea y 5
> no (*Invocación*, *Capricho Magyar*, *Sushi*, *Soga de Caín* y *San Telmo*). Con la regla del
> paso 5, el reparto pasa de **8 / 15 / 72 a 8 / 82 / 5**. `BR-30` esperaba que el desvío hacia
> Difícil *"se corrigiera solo"*, y lo que pasa es que se da vuelta hacia Media. Es una cuenta hecha
> a mano sobre la ficha y la confirma `T-285`. Cambiar la regla es de `producto`, y la pregunta
> quedó en `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-conteo-completo-mueve.md`. Cambiar el
> código sigue siendo tocar una línea (paso 5).

**Media y Difícil: la extensión de lo que ya decidió el usuario, hasta que `BR-18` (h) diga otra
cosa.** El apartado (h) fija los 8 Fáciles y no dice cómo se reparte el resto; `US-02` dice "resto
repartido en Media/Difícil". La regla de arriba es la única que se puede escribir sin inventar un
número. *"Sin escucha por ahora es difícil"* es `D-27` con las palabras del usuario; acá
"escucha" pasa a ser "figura en lo que publicó la página". Cambiarla es tocar **una línea** de
`repartirEnVivo()`: si `producto` elige otra regla, cambia esa línea y ningún dato. Queda
preguntado en `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-corte-en-vivo-deja-abierto.md`.

**Cómo lo lee `catalogo()`**: el tercer parámetro deja de ser la lista de vistas y pasa a ser el
conteo.

```ts
export function catalogo(
  manifiesto: Manifiesto,
  temasConLetra: readonly TemaConLetra[] = [],
  conteo: ConteoCitado | null = null,
): Catalogo;
```

`Catalogo.medidos` se reemplaza por lo que devuelve el corte: `faciles`, `conConteo`,
`corteDeterminado` y `conteoConsultado`. Este último es la fecha, para el rótulo, y es lo único
nuevo que viaja al navegador (diez bytes). **La lectura que `medidos` tenía se hereda en
`faciles`:** `faciles === 0` significa "este juego no escalona", que es lo que `CTR-03.11`
punto 3 pedía poder leer desde afuera. `BR-18` (g) condición 3 cita `catalogo().medidos === 0`
por nombre; la cita pasa a `catalogo().faciles === 0` y la corrige `producto` (traspaso de
`CTR-19.14`). `catalogo()` arma el pozo con los temas `jugable` y le
pasa ese conjunto a `repartirEnVivo()`: **el corte se hace sobre el pozo, no sobre los 105**, que
es el error de lectura que ya señalaba `CTR-07.8`. La página `adivinar-el-tema.astro` importa
`setlistfm.json` y pasa su `conteo`. **Deja de importar `popularidad.json`.** El tipo
`NivelDificultad` se puede importar como tipo desde donde vive hoy; la guarda t8 mira el dato y la
regla, no el tipo.

**Cómo se evita mezclarlo con las vistas.** No con una advertencia, sino con dos cosas que revisa
un test:

- **`catalogo()` recibe un conteo o nada.** Ninguna firma acepta vistas y conteo a la vez, así que
  no hay dónde sumarlos ni desempatar uno con el otro. Es `D-45` consecuencia 1 escrita como tipo:
  si llega la clave de YouTube, las vistas no recuperan el corte sin tocar esta firma, y tocarla es
  una decisión.
- **Aislamiento por texto** (`CTR-19.13`, t8): `src/lib/tema/catalogo.ts`, `src/lib/en-vivo.ts`
  y `adivinar-el-tema.astro` no nombran `popularidad.json`, ni `repartirPorPopularidad`, ni
  `recitales.json`.

> **Enmendado el 2026-09-24 (`T-284`).** El párrafo que sigue quedó contestado. `D-46` eligió la
> salida B, y más amplia de lo que se preguntaba. Los tercios de `US-07` leen el conteo, pero
> **no desde `popularidad.ts`**: viven en `en-vivo.ts` como `repartirEnTercios()` (`CTR-19.15`).
> `repartirPorPopularidad()` se retira, `NivelDificultad` se muda a `en-vivo.ts` y
> `src/lib/popularidad.ts` deja de existir. Lo que el párrafo decía que la salida B *"no
> resuelve"*, que el conteo era un top-25, lo resolvió `RES-90`. Lo que sigue en pie es *"una sola
> fuente por llamada"*: `repartirEnTercios()` recibe un `ConteoCitado` y nada más.

**`src/lib/popularidad.ts` no se toca**, salvo su comentario, que hoy dice que lo usa
`catalogo.ts`. Lo mismo con tres comentarios que quedarían mintiendo: el encabezado de
`catalogo.ts` (la fila *"La dificultad de cada tema"* nombra `popularidad.json`), el de
`adivinar-el-tema.astro` (líneas 40–42) y el de `partida-tema.ts:220` (*"mientras
`popularidad.json` no tenga mediciones los 95 caen en `dificil`"*). Sigue siendo la regla de `D-27` para `US-07`, alimentada por YouTube. **La pregunta
de `D-45` consecuencia 3** (si los tercios de "Sacalo por la letra" pasan a leer el conteo) es del
usuario: `BR-18` (h) plantea una salida A y una B. Este contrato aguanta las dos sin cambiar un
campo. Con la A no se mueve nada. Con la B, `generar-por-la-letra.mjs` recibe el mismo
`ConteoCitado` y la regla de tercios se escribe contra `LineaCitada`, **con una sola fuente por
llamada**: nunca una lista que mezcle vistas y conteos. Lo que la B no resuelve es que hoy el
conteo es un top-25 (`completo: false`). Con tercios sobre 23 temas y el resto en Difícil el
reparto sale, pero no es el juego que imaginó `D-27`. `producto` ya lo dice en (h).

---

### CTR-19.6 — Refrescar el conteo

**`vigenciaDias: 180`, por `BR-18` (d)**, que dice *"ningún número queda circulando con más de 180
días desde su fecha de medición"*, y el apartado (h) está dentro de `BR-18`. Conviene aclarar que
**el motivo original de los 180 días no se traslada**: salió de la obligación de "esfuerzos
razonables" de YouTube (`RES-52` d), y setlist.fm no pide nada parecido para un número citado
(`RES-73` no lo menciona). Lo que sí se traslada es el principio: un orden con fecha vieja es
honesto, pero un orden que nunca se refresca deja de medir lo que dice. Una banda que no toca desde
2001 cambia poco en seis meses, así que **`producto` puede alargar el plazo** tocando solo ese
entero.

**Cuando vence el plazo, el test se pone en rojo** (`CTR-19.13`, t4), igual que en `CTR-07.6` y
por la misma razón: lo único que se corre en todas las ráfagas es `npm test`. **No frena el
despliegue**, porque Vercel corre `astro build`, no los tests.

**Refrescar es leer una página, no correr un script:**

1. `investigador` lee la página de estadísticas (una página, a ojo, como se hizo `RES-74`) y deja
   una ficha **nueva**, con número `RES-` propio. No se reescribe `RES-74`, que es lo que se leyó
   el 2026-09-22.
2. El hilo principal reescribe el bloque `conteo` **entero**: todas las líneas, con la fecha y la
   ficha nuevas.
3. `npm test` recalcula el cruce, la vigencia y el corte. Si falta un alias, el título nuevo pone
   t1 en rojo con su nombre.

*Alternativa descartada:* **un script que lea la página de estadísticas.** Son 25 números cada seis
meses, contra términos que prohíben los bots (`RES-73.1`, `RES-73.2`). El plan ya lo cerró
(`§2.3`: ningún script baja páginas de setlist.fm) y el test t9 lo vigila.

> **Enmendado el 2026-09-24 (`T-284`).** Donde dice *"25 números"* ahora son 198. El descarte no
> cambia: son más líneas para copiar a mano, no un motivo para usar un bot. Y a cada refresco se le
> suma **un cuarto paso**: volver a correr `npm run generar-por-la-letra`. El banco de `US-07`
> guarda el nivel ya calculado junto con la ficha y la fecha del conteo que usó (`CTR-09.7`,
> enmendado). Si el conteo cambia y el banco no, t14 se pone en rojo (`CTR-19.13`).

---

### CTR-19.7 — Pieza 2: el archivo de recitales

```json
{
  "contrato": "CTR-19",
  "pieza": "recitales",
  "contratoVersion": 1,
  "actualizado": "AAAA-MM-DD",
  "licencia": { "id": "cc-by-sa-4.0", "url": "https://creativecommons.org/licenses/by-sa/4.0/" },
  "cambios": "…",
  "fuentes": [ … ],
  "recitales": [ … ]
}
```

**Cada recital lleva:** `fecha` (`AAAA-MM-DD`; si la fuente no da más, se acepta `AAAA-MM` o
`AAAA`), `orden` (de 2 a 9, solo si la misma fuente trae más de un recital con la misma `fecha`;
con una fecha parcial como `1985` eso pasa seguido), `lugar` y `ciudad` como los
escribe la fuente, `fuente` (el `id` de una de las `fuentes`), `url` (la página de **ese** recital
en la fuente), `consultado`, `completitud`, y `temas` en el orden de la fuente, cada uno con
`titulo` tal cual y `slug` o `fuera` (`CTR-19.2`).

**Cada recital tiene sus cuatro datos de fuente sin repetirlos 256 veces.** El pedido era que cada
recital tuviera nombre de fuente, URL, licencia textual y fecha de consulta, y los tiene. La `url`
y `consultado` son del recital. El `nombre` y la `licencia` (con su texto, su URL, su fecha y la
ficha que la verificó) los alcanza a través de `fuente`. *Alternativa descartada:* copiar la
licencia en cada recital. Serían 256 copias del mismo párrafo y 256 lugares donde dos copias pueden
empezar a decir cosas distintas; es el argumento de `CTR-07.3` para armar la URL en vez de
guardarla.

**`completitud` es el rótulo del recital**: `completa`, `parcial` o `sin-declarar`, según **lo que
la fuente diga de sí misma**. Si no dice nada, va `sin-declarar`, no `completa`. Importa el día que
alguien quiera preguntar *"¿qué no se tocó en Huracán en el 93?"*: con un setlist parcial, esa
pregunta le marca error al que sabe la respuesta.

**Los rótulos `hecho` / `leyenda` / `testimonio` no se usan a nivel recital**, por la misma razón
que `CTR-07.2` no los usa con las vistas: el archivo no afirma que la banda tocó eso, afirma **qué
dice cada fuente**. Elegir casilla recital por recital sería repetir 256 veces una decisión sin
información nueva. Cuando un banco de juego o un artículo use un recital, **ese** ítem elige su
casilla y cita la fuente del recital.

**La clave es (`fecha`, `orden`, `fuente`)**, y eso permite que **un mismo recital figure dos
veces**, una por fuente. Si dos fuentes traen el recital de Huracán del 19-11-1993 y no coinciden,
quedan las dos versiones: no se promedian ni se elige una, que es la práctica del proyecto desde
`INV-73`. *Alternativa descartada:* una entrada por recital, fusionando fuentes. La fusión sería un
setlist que nadie publicó, armado por el sitio y bajo dos licencias a la vez.

**No se crea un archivo vacío.** `recitales` y `fuentes` piden al menos un elemento. Si `RES-76`+
no trae ninguna fuente usable, **`recitales.json` no existe** y `esquemas.test.ts` no lo nombra,
que es la regla que ese archivo ya se impone (*"un archivo entra a esta lista cuando existen el
schema y el dato"*). La pieza 1 no depende de esto: los Fáciles salen igual.

**Quién lo escribe: `scripts/ingerir-recitales.mjs`**, que corre en la máquina del usuario, a mano,
nunca en el build ni en el navegador (`CTR-07.5`, por los mismos motivos). La vía para cada fuente
la fija `RES-76`+. Sea cual sea la vía, este contrato le exige al script cuatro cosas:

1. **Reescribe el archivo entero y ordenado** por `fecha`, `orden` y `fuente`, para que `git diff`
   muestre solo lo que cambió.
2. **Resuelve con `resolverTema()`** y deja `slug` o `fuera`. Lo que no resuelve y nadie clasificó
   va como `sin-identificar`, con `nota`. Nunca descarta un tema: el pedido es el setlist entero.
3. **No toca setlist.fm**, ni la página ni la API. El test t9 lo vigila.
4. **Imprime cuántos recitales trajo de cada fuente**, para que `revisor` lo compare con lo que
   contó `RES-76`+.

---

### CTR-19.8 — Las licencias: qué entra y qué exige del archivo entero

> **Todo este apartado es *supuesto* hasta que haya ficha.** De las fuentes probables, el proyecto
> conoce la licencia de una sola: `RES-25` registró que **MusicBrainz licencia sus datos como
> CC0**, pero eso se refiere al registro en general, no a sus setlists de eventos en particular.
> Ninguna ficha del repo establece qué exige CC BY-SA para atribuir, si pide indicar los cambios,
> qué licencias pueden convivir en un mismo archivo ni hasta dónde llega el "compartir igual", y
> no lo escribo de memoria como si lo estuviera. Quedó pedido en
> `Docs/SUGERENCIAS/ARQ-para-investigador-lo-que-la-licencia-exige-del-archivo.md`. **Lo que
> sigue está diseñado para la lectura más estricta**: si la ficha dice menos, se afloja la tabla y
> los campos no cambian.

**Regla 1: un archivo, una licencia de salida.** `licencia.id` declara bajo qué licencia se ofrece
`recitales.json` entero. Si entra un solo recital CC BY-SA, todo el archivo pasa a CC BY-SA 4.0,
no entrada por entrada. **Por qué entero:** el trabajo del sitio (cruzar títulos, juntar fuentes
en una estructura) recorre todas las entradas, y la lectura prudente es que el archivo es una sola
obra adaptada. **No cuesta nada**: el sitio no tiene nada que proteger en este dato, y dejar que
otro lo reuse es abrir un molinete más (`D-14`).

**Regla 2: qué fuente entra en qué salida.** El test t11 hace cumplir la tabla. Una fuente que no
entra pone el test en rojo con su nombre.

| Salida (`licencia.id`) | Entran | No entran |
|---|---|---|
| `cc0-1.0` | `cc0`, `dominio-publico` | todo lo que pida atribución: el sitio no puede renunciar a ella en nombre de otro |
| `cc-by-4.0` | lo anterior, `cc-by` (cualquier versión), `permiso-escrito` con `redistribuible` | `cc-by-sa` y todas las `-nc` |
| **`cc-by-sa-4.0`** | lo anterior, más **`cc-by-sa` 3.0 y 4.0** | todas las `-nc` |
| `cc-by-nc-sa-4.0` | `cc0`, `dominio-publico`, `cc-by`, `cc-by-nc`, `cc-by-nc-sa` 3.0 y 4.0, `permiso-escrito` con `redistribuible` | `cc-by-sa` |

- **La salida es la más abierta que aceptan todas las fuentes.** Declarar una más cerrada de lo
  necesario no rompe ninguna licencia, pero cierra un molinete sin motivo. El comando (2) lo
  muestra.
- **Si `T-281` trae a la vez fuentes BY-SA y NC-SA**, no hay salida que acepte las dos. No se
  elige en silencio: es `CTR-19` v2, con un segundo archivo, y el usuario decide qué va en cada
  uno.
- **`permiso-escrito`** es el sitio de fans que dice "usalo citando". Entra solo si su texto
  permite **redistribuir**, no solo usar, y eso se declara con `redistribuible: true` y la ficha que
  lo leyó. Que el texto diga eso lo revisa `revisor`: ningún patrón sabe leer una frase legal.
- **setlist.fm no entra por ninguna fila.** El schema rechaza cualquier URL que lo nombre, sea en
  `sitio`, en la licencia o en un recital.

**Regla 3: la atribución viaja con el archivo.** Si alguien copia `recitales.json` solo (del repo,
o de una versión futura servida en `dist/`), el archivo lleva todo lo necesario para atribuir: la
`licencia` del archivo; `cambios`, que dice qué le hizo el sitio a lo que tomó; por cada fuente, su
`nombre`, `sitio`, licencia textual con URL y, si la pide, su `atribucion`; y por cada recital, la
`url` de su página. No depende de que haya una página que lo muestre.

**Regla 4: el "compartir igual" termina en el borde del archivo.** En este ciclo **ningún módulo
del sitio lee `recitales.json` en build**: ni `catalogo.ts`, ni una página, ni una isla (t8). Así
la licencia no alcanza a nada más, y el corte de Fáciles no puede salir de acá. El día que una
pantalla lo use (`IDEA-15`, fuera de este ciclo por `ORQ-plan-ciclo-16.md §5`), cruza este borde
con `RNF-CTR-19-B` y con la ficha contestada.

**Dónde vive la tabla: `src/lib/recitales.ts`.** El plan le asigna ese archivo a `T-279` desde
antes de la enmienda, cuando iba a derivar el conteo de los setlists guardados. Con la enmienda
ese trabajo pasó a `en-vivo.ts` (`CTR-19.5`), y a `recitales.ts` le queda lo de la pieza 2 que
tienen que compartir el script y el test:

- **La tabla de la regla 2 como dato**, una sola vez. El script la usa para elegir la salida más
  abierta antes de escribir y el test la usa para rechazar. Dos copias de una regla es el modo de
  falla del motivo 3 de `CTR-03.8`.
- **Una función que devuelve la salida más abierta** para un conjunto de fuentes, o `null` si no
  hay salida posible (BY-SA con NC-SA: `CTR-19` v2).
- **Una función que junta los problemas del archivo** en una lista de textos, cada uno con el
  recital o la fuente que lo causa: los de t10, t11 y t12. Recibe el archivo ya leído y el
  resolvedor de títulos como parámetros.

Es **puro, como `en-vivo.ts`**: sin `node:fs` y sin importar ningún JSON. Lo importan solo
`scripts/ingerir-recitales.mjs` y `src/lib/recitales.test.ts`. Ninguna página, isla ni
`catalogo.ts` (t8). Si `recitales.json` no llega a existir (`CTR-19.7`), tampoco existe este
módulo.

---

### CTR-19.9 — Los rótulos, en registro 3

`D-45` punto 3 y `BR-18` (h) fijan la promesa; este apartado fija qué datos tienen que estar para
cumplirla. **El texto exacto es de `contenido` y dónde va es de `experiencia`.** La línea de
referencia está para mostrar que las piezas caben en registro 3
(`.claude/rules/voz-ricotera.md` §5: seco, dice qué hay adentro y nada más), no para pegarla tal
cual.

> **RNF-CTR-19-A — el conteo.** Toda pantalla que muestre un número, un orden o un "más tocado"
> que salga de `setlistfm.json` muestra en el mismo bloque, sin que haya que tocar nada: **qué
> mide** (cuántas veces figura el tema en los setlists que carga la gente), **de dónde sale**
> (setlist.fm, con enlace a `conteo.pagina`) y **la fecha de consulta**. Si se muestra el número,
> va chico, nunca como titular (`BR-18` b), y dice **"figura N veces"**, nunca "se tocó N veces"
> (`CTR-19.3`). Nunca dice "el más popular" ni "el más escuchado" (`D-45` punto 3). Si las tres
> piezas no entran, no entra el número.
>
> Referencia: *"Lo más tocado en vivo, según los setlists que carga la gente en setlist.fm.
> Consultado el 22-09-2026."*

**Si la pantalla solo usa el nivel** (ordena la vuelta, o dice "Fácil" sin número ni puesto), el
rótulo alcanza con **una vez por pantalla**, no al lado de cada tema. Hoy la vuelta de `US-02` no
muestra el nivel, así que este requisito no le pide nada a la isla hasta que `experiencia` decida
mostrarlo.

> **Enmendado el 2026-09-24 (`BR-30`, `T-284`).** `RNF-CTR-19-A` rige igual para toda pantalla
> de `US-07` que muestre un nivel, un número o un puesto salido del conteo. Es el mismo dato con
> otra regla. Para rotular no hace falta importar `setlistfm.json` en la página: el banco trae
> `conteo.consultado` (`CTR-09.1`, enmendado). Hoy `US-07` no muestra el nivel, así que no le pide
> nada a la isla.

> **RNF-CTR-19-B — los recitales.** Toda pantalla que muestre un recital de `recitales.json`
> muestra en el mismo bloque, sin que haya que tocar nada: el **nombre de la fuente** con enlace a
> la **página de ese recital**, la **licencia de la fuente** con su enlace, la **nota de
> cambios**, y la **licencia bajo la que el sitio ofrece ese bloque** (la de `licencia.id`). Si el
> recital es `parcial` o `sin-declarar`, lo dice. Hoy no hay ninguna pantalla así
> (`ORQ-plan-ciclo-16.md §5`); el requisito queda escrito para la primera.

---

### CTR-19.10 — Schema de la pieza 1, para pegar

Draft 2020-12, como los demás. **Es texto normativo:** `T-279` lo copia idéntico a
`src/data/_schema/setlistfm.schema.json`, y si alguna vez difieren, manda este bloque.

> **Enmendado el 2026-09-24 (`T-284`). `T-285` copia este bloque entero sobre el archivo.** Hay tres
> cambios, y ninguno invalida el archivo de `RES-74`. Por eso `contratoVersion` sigue en 1 y el
> `$id` no cambia.
> (1) `linea` suma una tercera forma, `grafiaDe`, con `nota` obligatoria (`CTR-19.2`). Antes el
> `oneOf` tenía dos ramas (`slug` o `fuera`), cada una con un `not` de la otra.
> (2) El `comment` de `completo` decía *"false = la pagina publica un top. Un tema que no figura
> tiene como mucho el conteo de la ultima linea: no es cero."* Ahora dice lo de `CTR-19.3`.
> (3) La `description` y el `comment` de `linea` nombran las dos reglas y la grafía.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/setlistfm/1",
  "title": "CTR-19 pieza 1 — Lo que el sitio cita de setlist.fm",
  "description": "Citado, no licenciado (RES-73.1): numeros con su pagina y su fecha, y enlaces. Nunca la lista de temas de un recital (D-45 enmendada). Se escribe a mano desde una ficha RES; ningun script lee setlist.fm. Alimenta el corte de US-02 (CTR-19.5) y los tercios de US-07 (CTR-19.15), por D-46.",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "pieza", "contratoVersion", "fuente", "conteo"],
  "properties": {
    "contrato": { "const": "CTR-19" },
    "pieza": { "const": "citado" },
    "contratoVersion": { "const": 1 },
    "fuente": {
      "const": "setlist.fm",
      "comment": "Const y no enum, como CTR-07: un archivo, una fuente. Un conteo de otra fuente es otro archivo y otro orden, nunca una suma (CTR-07.7)."
    },
    "nota": { "type": "string", "maxLength": 400 },
    "conteo": { "$ref": "#/$defs/conteo" },
    "indice": {
      "type": "array",
      "items": { "$ref": "#/$defs/enlace" },
      "comment": "Opcional. Fecha, lugar, ciudad y la pagina. Sin temas y sin cuantos temas (CTR-19.4)."
    }
  },
  "$defs": {
    "fecha": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "fechaDeRecital": { "type": "string", "pattern": "^\\d{4}(-\\d{2}(-\\d{2})?)?$" },
    "ficha": { "type": "string", "pattern": "^RES-\\d{2,3}$" },
    "slug": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$", "maxLength": 90 },
    "fuera": { "enum": ["inedito", "cover", "intro", "cantico", "sin-identificar"] },
    "conteo": {
      "type": "object",
      "additionalProperties": false,
      "required": ["pagina", "consultado", "ficha", "vigenciaDias", "setlistsCargados", "completo", "temas"],
      "properties": {
        "pagina": { "type": "string", "pattern": "^https://www\\.setlist\\.fm/stats/[a-z0-9-]+\\.html$" },
        "consultado": { "$ref": "#/$defs/fecha" },
        "ficha": { "$ref": "#/$defs/ficha" },
        "vigenciaDias": {
          "type": "integer",
          "minimum": 1,
          "maximum": 730,
          "comment": "180 por BR-18 (d). Lo puede mover producto sin tocar el schema (CTR-19.6)."
        },
        "setlistsCargados": { "type": "integer", "minimum": 1 },
        "completo": {
          "type": "boolean",
          "comment": "true solo si el bloque tiene TODAS las lineas que publica la pagina (CTR-19.3). false = puede faltar alguna (un top, o una cola transcripta con huecos): un tema que no figura tiene como mucho el conteo de la ultima linea, no cero."
        },
        "temas": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/linea" } }
      }
    },
    "linea": {
      "type": "object",
      "additionalProperties": false,
      "required": ["titulo", "veces"],
      "comment": "Una linea publicada: el titulo tal cual, cuantas veces figura, y una sola de tres: a que tema del catalogo resuelve (slug), de que tema es otra grafia (grafiaDe), o por que no es del catalogo (fuera).",
      "properties": {
        "titulo": { "type": "string", "minLength": 1, "maxLength": 120 },
        "veces": { "type": "integer", "minimum": 1 },
        "slug": { "$ref": "#/$defs/slug" },
        "grafiaDe": {
          "$ref": "#/$defs/slug",
          "comment": "Otra forma de nombrar un tema que ya tiene su linea con slug: cuenta la grafia que mas figura. No suma, no entra a ningun reparto y no sube ningun techo (CTR-19.2)."
        },
        "fuera": { "$ref": "#/$defs/fuera" },
        "nota": { "type": "string", "minLength": 10, "maxLength": 200 }
      },
      "oneOf": [
        { "required": ["slug"], "not": { "anyOf": [{ "required": ["fuera"] }, { "required": ["grafiaDe"] }] } },
        { "required": ["grafiaDe", "nota"], "not": { "anyOf": [{ "required": ["slug"] }, { "required": ["fuera"] }] } },
        { "required": ["fuera"], "not": { "anyOf": [{ "required": ["slug"] }, { "required": ["grafiaDe"] }] } }
      ],
      "if": { "required": ["fuera"], "properties": { "fuera": { "const": "sin-identificar" } } },
      "then": { "required": ["nota"] }
    },
    "enlace": {
      "type": "object",
      "additionalProperties": false,
      "required": ["fecha", "lugar", "ciudad", "url", "ficha"],
      "properties": {
        "fecha": { "$ref": "#/$defs/fechaDeRecital" },
        "orden": { "type": "integer", "minimum": 2, "maximum": 9 },
        "lugar": { "type": "string", "minLength": 2, "maxLength": 120 },
        "ciudad": { "type": "string", "minLength": 2, "maxLength": 80 },
        "url": {
          "type": "string",
          "pattern": "^https://www\\.setlist\\.fm/setlist/[a-z0-9-]+/\\d{4}/[a-z0-9-]+\\.html$"
        },
        "ficha": { "$ref": "#/$defs/ficha" }
      }
    }
  }
}
```

---

### CTR-19.11 — Schema de la pieza 2, para pegar

Tiene el mismo carácter normativo. `T-279` lo copia a
`src/data/_schema/recitales.schema.json` **solo si** va a existir `recitales.json`
(`CTR-19.7`).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/recitales/1",
  "title": "CTR-19 pieza 2 — Recitales enteros, de fuentes cuya licencia deja guardarlos",
  "description": "Un recital por fuente y por fecha, con los temas en el orden de la fuente, cruzados contra los 105 de RES-20. Cada fuente declara su licencia textual y la ficha que la verifico. Nada de setlist.fm (D-45 enmendada). Lo escribe scripts/ingerir-recitales.mjs; no se edita a mano.",
  "type": "object",
  "additionalProperties": false,
  "required": ["contrato", "pieza", "contratoVersion", "actualizado", "licencia", "cambios", "fuentes", "recitales"],
  "properties": {
    "contrato": { "const": "CTR-19" },
    "pieza": { "const": "recitales" },
    "contratoVersion": { "const": 1 },
    "actualizado": { "$ref": "#/$defs/fecha" },
    "licencia": { "$ref": "#/$defs/licenciaDelArchivo" },
    "cambios": {
      "type": "string",
      "minLength": 40,
      "maxLength": 400,
      "comment": "Que le hizo el sitio a lo que tomo de las fuentes. Viaja con el archivo (CTR-19.8, regla 3)."
    },
    "nota": { "type": "string", "maxLength": 400 },
    "fuentes": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/fuente" } },
    "recitales": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/recital" } }
  },
  "$defs": {
    "fecha": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "fechaDeRecital": { "type": "string", "pattern": "^\\d{4}(-\\d{2}(-\\d{2})?)?$" },
    "ficha": { "type": "string", "pattern": "^RES-\\d{2,3}$" },
    "slug": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$", "maxLength": 90 },
    "fuera": { "enum": ["inedito", "cover", "intro", "cantico", "sin-identificar"] },
    "idFuente": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$", "maxLength": 40 },
    "urlAbierta": {
      "type": "string",
      "pattern": "^https://",
      "maxLength": 300,
      "not": { "pattern": "setlist\\.fm" },
      "comment": "De setlist.fm el sitio cita, no guarda (D-45 enmendada). Esta pieza no puede nombrarlo."
    },
    "licenciaDelArchivo": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "url"],
      "properties": {
        "id": { "enum": ["cc0-1.0", "cc-by-4.0", "cc-by-sa-4.0", "cc-by-nc-sa-4.0"] },
        "url": { "type": "string", "pattern": "^https://creativecommons\\.org/" }
      }
    },
    "fuente": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "nombre", "sitio", "licencia", "ficha"],
      "properties": {
        "id": { "$ref": "#/$defs/idFuente" },
        "nombre": { "type": "string", "minLength": 2, "maxLength": 80 },
        "sitio": { "$ref": "#/$defs/urlAbierta" },
        "licencia": { "$ref": "#/$defs/licenciaDeFuente" },
        "atribucion": { "type": "string", "minLength": 10, "maxLength": 300 },
        "ficha": { "$ref": "#/$defs/ficha" }
      }
    },
    "licenciaDeFuente": {
      "type": "object",
      "additionalProperties": false,
      "required": ["familia", "textual", "url", "consultada"],
      "properties": {
        "familia": {
          "enum": ["cc0", "dominio-publico", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa", "permiso-escrito"]
        },
        "version": { "enum": ["1.0", "2.0", "2.5", "3.0", "4.0"] },
        "textual": {
          "type": "string",
          "minLength": 20,
          "maxLength": 800,
          "comment": "Copiado de la fuente, no parafraseado. Lo que dice lo lee revisor contra la ficha."
        },
        "url": { "$ref": "#/$defs/urlAbierta" },
        "consultada": { "$ref": "#/$defs/fecha" },
        "redistribuible": {
          "const": true,
          "comment": "Solo para permiso-escrito: el texto deja redistribuir, no solo usar (CTR-19.8)."
        }
      },
      "allOf": [
        {
          "if": { "required": ["familia"], "properties": { "familia": { "enum": ["cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"] } } },
          "then": { "required": ["version"] }
        },
        {
          "if": { "required": ["familia"], "properties": { "familia": { "const": "permiso-escrito" } } },
          "then": { "required": ["redistribuible"] }
        }
      ]
    },
    "recital": {
      "type": "object",
      "additionalProperties": false,
      "required": ["fecha", "lugar", "ciudad", "fuente", "url", "consultado", "completitud", "temas"],
      "properties": {
        "fecha": { "$ref": "#/$defs/fechaDeRecital" },
        "orden": { "type": "integer", "minimum": 2, "maximum": 9 },
        "lugar": { "type": "string", "minLength": 2, "maxLength": 120 },
        "ciudad": { "type": "string", "minLength": 2, "maxLength": 80 },
        "fuente": { "$ref": "#/$defs/idFuente" },
        "url": { "$ref": "#/$defs/urlAbierta" },
        "consultado": { "$ref": "#/$defs/fecha" },
        "completitud": {
          "enum": ["completa", "parcial", "sin-declarar"],
          "comment": "Lo que la fuente dice de si misma. Si no dice nada: sin-declarar, nunca completa."
        },
        "temas": { "type": "array", "minItems": 1, "maxItems": 60, "items": { "$ref": "#/$defs/tema" } },
        "nota": { "type": "string", "minLength": 10, "maxLength": 300 }
      }
    },
    "tema": {
      "type": "object",
      "additionalProperties": false,
      "required": ["titulo"],
      "properties": {
        "titulo": { "type": "string", "minLength": 1, "maxLength": 120 },
        "slug": { "$ref": "#/$defs/slug" },
        "fuera": { "$ref": "#/$defs/fuera" },
        "pegadoAlAnterior": { "const": true },
        "nota": { "type": "string", "minLength": 10, "maxLength": 200 }
      },
      "oneOf": [
        { "required": ["slug"], "not": { "required": ["fuera"] } },
        { "required": ["fuera"], "not": { "required": ["slug"] } }
      ],
      "if": { "required": ["fuera"], "properties": { "fuera": { "const": "sin-identificar" } } },
      "then": { "required": ["nota"] }
    }
  }
}
```

**Lo que ninguno de los dos schemas puede ver**, y por eso queda para los tests de `CTR-19.13`:
que el `slug` sea el que devuelve `resolverTema()` y esté entre los 105 (t1, t10); que las `veces`
bajen en el orden de la página (t2); que un slug no esté en dos líneas (t3); la vigencia (t4); el
corte (t5, t6); que cada `fuente` citada exista y cada fuente declarada se use (t12); la unicidad
de (`fecha`, `orden`, `fuente`) (t12); la compatibilidad de licencias entre fuentes y archivo
(t11); y que el texto de un `permiso-escrito` diga de verdad lo que declara `redistribuible`
(`revisor`).

---

### CTR-19.12 — Ejemplos

> **Enmendado el 2026-09-24 (`T-284`).** El ejemplo de abajo **ya no es el archivo real**: es el
> de `RES-74`. Sigue validando con el schema enmendado, y por eso queda como caso c1. El archivo real
> lo copia `T-285` del anexo de `INV-89` con las reglas de `CTR-19.3` y `CTR-19.16`. Acá no se
> pegan las 198 líneas, porque serían una segunda copia de la ficha, y la que manda es la ficha.
> Estas son las cuatro formas de línea que el archivo nuevo tiene que poder decir, tomadas del
> anexo:
>
> ```json
> { "titulo": "Mariposa Pontiac", "veces": 43, "slug": "mariposa-pontiac-rock-del-pais" },
> { "titulo": "Rock del país", "veces": 37, "grafiaDe": "mariposa-pontiac-rock-del-pais", "nota": "Segunda mitad del tema compuesto; cuenta la grafia que mas figura (Mariposa Pontiac, 43). No se suma (CTR-19.2, RES-91)." },
> { "titulo": "Blues del noticiero", "veces": 32, "fuera": "sin-identificar", "nota": "Fuera de los 105 de RES-20; la ficha no dice si es inédito, cover o variante (RES-91)." },
> { "titulo": "Mariposa Pontiac / Rock del país", "veces": 10, "grafiaDe": "mariposa-pontiac-rock-del-pais", "nota": "El tema compuesto con su nombre entero; cuenta la grafia que mas figura (Mariposa Pontiac, 43). No se suma (CTR-19.2, RES-91)." },
> { "titulo": "Hercules mío", "veces": 1, "fuera": "cover", "nota": "Cover de Vivi Tellas, distinto del Hercules mío de la banda (RES-89.3)." }
> ```
>
> El bloque `conteo` del archivo nuevo lleva `"consultado": "2026-09-24"`, `"ficha": "RES-90"`,
> `"setlistsCargados": 256` y `"completo": false`. `vigenciaDias` sigue en 180, y el índice no se
> toca (sigue en `RES-74`).

**Pieza 1: el archivo real, completo, para pegar.** Todo valor sale de `RES-74` (consultado el
2026-09-22) y de `RES-75`. Los slugs son los que devuelve `resolverTema()` más los dos alias de
`CTR-19.2`, y los 23 están en `adivinar-tema.json`. **Este ejemplo valida, y tiene que validar**:
no hay nada inventado que marcar. El índice trae dos de las 40 filas del anexo de `INV-73`, a modo
de muestra.

```json
{
  "contrato": "CTR-19",
  "pieza": "citado",
  "contratoVersion": 1,
  "fuente": "setlist.fm",
  "nota": "Cuantas veces figura cada tema en los setlists que carga la gente en setlist.fm, citado de su pagina de estadisticas. No es cuantas veces lo toco la banda.",
  "conteo": {
    "pagina": "https://www.setlist.fm/stats/patricio-rey-y-sus-redonditos-de-ricota-bd615a2.html",
    "consultado": "2026-09-22",
    "ficha": "RES-74",
    "vigenciaDias": 180,
    "setlistsCargados": 256,
    "completo": false,
    "temas": [
      { "titulo": "Jijiji", "veces": 101, "slug": "jijiji" },
      { "titulo": "Ñam fri fruli fali fru", "veces": 93, "slug": "nam-fri-frufi-fali-fru" },
      { "titulo": "Vamos las bandas", "veces": 90, "slug": "vamos-las-bandas" },
      { "titulo": "Un tal Brigitte Bardot", "veces": 80, "fuera": "inedito", "nota": "Demo de RCA de 1982, nunca entro a los diez discos (RES-75)." },
      { "titulo": "Nadie es perfecto", "veces": 71, "slug": "nadie-es-perfecto" },
      { "titulo": "Divina TV. Führer", "veces": 69, "slug": "divina-tv-fuhrer" },
      { "titulo": "Nene nena", "veces": 68, "fuera": "inedito", "nota": "Demo de RCA de 1982, nunca entro a los diez discos (RES-75)." },
      { "titulo": "Nueva Roma", "veces": 61, "slug": "nueva-roma" },
      { "titulo": "Mi perro dinamita", "veces": 58, "slug": "mi-perro-dinamita" },
      { "titulo": "La bestia pop", "veces": 57, "slug": "la-bestia-pop" },
      { "titulo": "Aquella solitaria vaca cubana", "veces": 55, "slug": "aquella-solitaria-vaca-cubana" },
      { "titulo": "La parabellum del buen psicópata", "veces": 53, "slug": "la-parabellum-del-buen-psicopata" },
      { "titulo": "Unos pocos peligros sensatos", "veces": 52, "slug": "unos-pocos-peligros-sensatos" },
      { "titulo": "Ya nadie va a escuchar tu remera", "veces": 50, "slug": "ya-nadie-va-a-escuchar-tu-remera" },
      { "titulo": "Queso ruso", "veces": 49, "slug": "queso-ruso" },
      { "titulo": "Rock para los dientes", "veces": 49, "slug": "rock-para-los-dientes" },
      { "titulo": "Ella debe estar tan linda", "veces": 47, "slug": "ella-debe-estar-tan-linda" },
      { "titulo": "Barbazul vs. el amor letal", "veces": 46, "slug": "barbazul-versus-el-amor-letal" },
      { "titulo": "Roto y mal parado", "veces": 45, "slug": "roto-y-mal-parado" },
      { "titulo": "El pibe de los astilleros", "veces": 44, "slug": "el-pibe-de-los-astilleros" },
      { "titulo": "Maldición, va a ser un día hermoso", "veces": 44, "slug": "maldicion-va-a-ser-un-dia-hermoso" },
      { "titulo": "Mariposa Pontiac", "veces": 43, "slug": "mariposa-pontiac-rock-del-pais" },
      { "titulo": "Masacre en el puticlub", "veces": 41, "slug": "masacre-en-el-puticlub" },
      { "titulo": "Música para pastillas", "veces": 41, "slug": "musica-para-pastillas" },
      { "titulo": "Semen Up", "veces": 41, "slug": "semen-up" }
    ]
  },
  "indice": [
    {
      "fecha": "1993-11-19",
      "lugar": "Estadio Huracán",
      "ciudad": "Buenos Aires",
      "url": "https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1993/estadio-huracan-buenos-aires-argentina-2bd25062.html",
      "ficha": "RES-74"
    },
    {
      "fecha": "1993-11-20",
      "lugar": "Estadio Huracán",
      "ciudad": "Buenos Aires",
      "url": "https://www.setlist.fm/setlist/patricio-rey-y-sus-redonditos-de-ricota/1993/estadio-huracan-buenos-aires-argentina-2bc7143a.html",
      "ficha": "RES-74"
    }
  ]
}
```

**Pieza 2: el esqueleto, armado para que al copiarlo no valide.** Misma convención que `CTR-03.9` y
`CTR-07.10`: todo valor que hoy no existe se escribe de forma que el schema lo rechace. Hoy no
existe ninguna fuente fichada (`RES-76`+ está en curso) y no se inventa un setlist. Lo único real
es la fecha, que figura en `RES-74`; el resto falla contra los patrones (`sitio`, `url`, `ficha`,
`consultada`, `slug`).

```json
{
  "contrato": "CTR-19",
  "pieza": "recitales",
  "contratoVersion": 1,
  "actualizado": "<AAAA-MM-DD de la corrida, lo escribe el script>",
  "licencia": { "id": "cc-by-sa-4.0", "url": "https://creativecommons.org/licenses/by-sa/4.0/" },
  "cambios": "Los titulos se cruzaron contra los 105 temas de los diez discos y se les agrego el slug del catalogo; los que no cruzan quedan marcados fuera de catalogo, con su clase. Fecha, lugar, ciudad y orden de los temas, como los da cada fuente.",
  "fuentes": [
    {
      "id": "<id corto de la fuente>",
      "nombre": "<nombre de la fuente, como pide ser citada>",
      "sitio": "<URL de la fuente, de RES-76+>",
      "licencia": {
        "familia": "cc-by-sa",
        "version": "4.0",
        "textual": "<el texto de la licencia, copiado de la fuente, sin parafrasear>",
        "url": "<URL donde esta ese texto>",
        "consultada": "<AAAA-MM-DD, de RES-76+>"
      },
      "ficha": "<RES-76 o la que corresponda>"
    }
  ],
  "recitales": [
    {
      "fecha": "1993-11-19",
      "lugar": "<como lo escribe la fuente>",
      "ciudad": "<como la escribe la fuente>",
      "fuente": "<el id de arriba>",
      "url": "<URL de la pagina de ESTE recital en la fuente>",
      "consultado": "<AAAA-MM-DD>",
      "completitud": "sin-declarar",
      "temas": [
        { "titulo": "<primer tema, tal como lo da la fuente>", "slug": "<lo que devuelve resolverTema(), no a mano>" },
        { "titulo": "<un tema que no cruza>", "fuera": "sin-identificar", "nota": "<lo que se sabe de el>" }
      ]
    }
  ]
}
```

La frase de `cambios` es una propuesta: puede quedar así si `RES-76`+ no pide otra forma.

---

### CTR-19.13 — Qué verifica el test, y cómo se corre

**`arquitectura` no tiene con qué ejecutar (`D-12`).** Todo esto lo escribe y lo corre `T-279`, y
lo vuelve a correr `revisor` en `T-280`.

**Primero, dos líneas en `src/lib/esquemas.test.ts`:** `'setlistfm'` en la lista de archivos, que
entra con el dato en `T-279`, y `'recitales'` **solo si** el archivo existe (`CTR-19.7`).

**Los casos del schema**, cada uno con su control en verde al lado, como ya hace ese archivo:

| # | Caso | Se espera |
|---|---|---|
| c1 | el ejemplo de la pieza 1 de `CTR-19.12`, tal cual | **valida** |
| c2 | línea sin `veces` | rechaza |
| c3 | `veces: 0` | rechaza |
| c4 | línea con `slug` y `fuera` a la vez | rechaza |
| c5 | línea sin `slug` y sin `fuera` | rechaza |
| c6 | `fuera: "sin-identificar"` sin `nota` | rechaza |
| c7 | línea con `puesto` | rechaza: es un derivado |
| c8 | línea con `vistas` | rechaza: es otra plataforma |
| c9 | `fuente: "youtube"` | rechaza |
| c10 | conteo sin `consultado` | rechaza |
| c11 | `pagina` que no es `/stats/` | rechaza |
| c12 | enlace del índice con `temas` | **rechaza**: es la regla de la enmienda |
| c13 | enlace con URL que no es de setlist.fm | rechaza |
| c14 | pieza 2 mínima: una fuente `cc-by-sa` 4.0 completa y un recital con un tema | **valida** |
| c15 | recital sin `fuente` | rechaza |
| c16 | recital sin `consultado` | rechaza |
| c17 | recital con `url` de setlist.fm | **rechaza** |
| c18 | fuente con `sitio` de setlist.fm | **rechaza** |
| c19 | licencia de fuente sin `textual` | rechaza |
| c20 | `cc-by-sa` sin `version` | rechaza |
| c21 | `permiso-escrito` sin `redistribuible` | **rechaza** |
| c22 | `familia: "todos-los-derechos"` | rechaza |
| c23 | recital con `temas: []` | rechaza |
| c24 | tema con `slug` y `fuera` | rechaza |
| c25 | archivo sin `licencia` | rechaza |
| c26 | archivo sin `cambios` | rechaza |
| c27 | recital con un campo `veces` | rechaza: la cuenta no se guarda en esta pieza |

Los casos c7, c8, c12, c17, c18 y c21 corresponden a las seis reglas que este contrato existe para
hacer cumplir. Si alguno valida, el contrato no sirve.

**Los tests de node**, por archivo:

| # | Qué afirma | Archivo | Rojo cuando |
|---|---|---|---|
| t1 | cada `slug` es `slugDeTitulo(resolverTema(titulo).titulo)`, y cada línea `fuera` sigue sin resolver | `src/lib/en-vivo.test.ts` | una línea no cruza o apunta afuera de los 105, **y el mensaje la nombra**; es el rojo que pide `T-279` |
| t2 | `veces` no sube en el orden del arreglo | ídem | la transcripción desordenó la página |
| t3 | ningún `slug` en dos líneas | ídem | dos grafías del mismo tema (`CTR-19.2`) |
| t4 | `hoy − consultado ≤ vigenciaDias` | ídem | venció el conteo (`CTR-19.6`) |
| t5 | **con el pozo real** (`adivinar-tema.json`), `repartirEnVivo()` da `determinado` y **8 Fáciles** | ídem, o `escalonar.test.ts` como pide el plan | empate o faltante en el borde; el mensaje es el `motivo` |
| t6 | el azar no decide: con un conteo sintético con empate en 8/9, `faciles` da 7 y `motivo` nombra a los dos; con `completo: false` y el octavo igual a la última línea, no queda determinado; con un `sin-identificar` arriba del corte, tampoco | ídem | la regla de `CTR-19.5` paso 3 se aflojó |
| t7 | lo de afuera no suma: una línea `inedito` con el conteo más alto no entra, y un slug fuera del pozo tampoco | ídem | el filtro va después del corte y no antes (`BR-18` h) |
| t8 | aislamiento: `src/lib/tema/catalogo.ts`, `src/lib/en-vivo.ts` y `src/pages/juegos/adivinar-el-tema.astro` no nombran `popularidad.json`, `repartirPorPopularidad` ni `recitales.json`; fuera de los tests, ningún `.ts` ni `.astro` de `src/` nombra `recitales.json`; y fuera de los tests, ninguno importa `recitales.ts` (`CTR-19.8`) | ídem | alguien mezcló las vistas o sacó el corte de la pieza 2 |
| t9 | ningún `.ts`, `.mjs` ni `.astro` de `scripts/` o `src/` (tests excluidos) contiene una URL de setlist.fm (`https?://[a-z.]*setlist\.fm`). Solo `src/data/setlistfm.json` las tiene | ídem | un script empezó a leer setlist.fm |
| t10 | como t1, sobre cada tema de cada recital | `src/lib/recitales.test.ts` (solo si el archivo existe) | ídem t1 |
| t11 | cada fuente entra en la salida declarada según la tabla de `CTR-19.8`, y `licencia.url` es la de esa salida | ídem | una fuente no entra; el mensaje nombra la fuente y la salida |
| t12 | cada `recital.fuente` existe en `fuentes` y cada fuente se usa; (`fecha`, `orden`, `fuente`) no se repite; `pegadoAlAnterior` nunca va en el primer tema; ninguna fecha de consulta está en el futuro; y la fecha del recital es anterior a su consulta | ídem | integridad del archivo |

> **Enmendado el 2026-09-24 (`T-284`).** Todo lo de este apartado se escribe y se corre en
> **`T-285`**, que es del hilo principal. Cambian dos tests, se reemplaza uno y entran cinco casos
> de schema y tres tests.
>
> - **t1** decía *"cada `slug` es `slugDeTitulo(resolverTema(titulo).titulo)`, y cada línea
>   `fuera` sigue sin resolver"*. Ahora suma una condición: una línea `grafiaDe` **resuelve
>   exactamente a su `grafiaDe`** por la puerta de `D-13`, existe una línea `slug` con ese slug, y
>   esa línea tiene `veces` ≥ la de la grafía. El juicio de que *Rock del país* es ese tema vive en
>   `ALIAS`, donde se discute leyendo una lista, y no en el dato.
> - **t3** mantiene la regla. Cambia el mensaje de `problemasDelConteo()`: decía *"Una de las dos
>   pasa a fuera sin-identificar con una nota"*, y ahora dice *"la de menos veces pasa a `grafiaDe`
>   con una nota"*.
> - **"Los 25 números son los de `RES-74`"** (test de `en-vivo.test.ts`, chequeo 8) se reemplaza
>   por **"los 198 son los del anexo de `RES-90`, título por título"**. Se lee el anexo de `INV-89`
>   (puestos `N. Título — veces` separados por ` · `, y la cola con `veces` 1). Las dos aclaraciones
>   de la cola se comparan contra `titulo` + `nota`, como fija `CTR-19.3` punto 3. El test del
>   índice sigue leyendo `INV-73`.
>
> | # | Caso del schema de la pieza 1 | Se espera |
> |---|---|---|
> | c28 | línea `grafiaDe` con `nota` | **valida** |
> | c29 | `grafiaDe` sin `nota` | rechaza |
> | c30 | `grafiaDe` y `slug` a la vez | rechaza |
> | c31 | `grafiaDe` y `fuera` a la vez | rechaza |
> | c32 | `grafiaDe` que no tiene forma de slug (`"Mariposa Pontiac"`) | rechaza |
>
> | # | Qué afirma | Archivo | Rojo cuando |
> |---|---|---|---|
> | t13 | `repartirEnTercios()` con conteos inventados: seis temas distintos dan 2/2/2; un tema sin línea es `dificil` y no ocupa lugar en los tercios; **un empate en un borde baja entero** y no depende del orden del arreglo; todo empatado da todo `dificil`; las líneas `grafiaDe`, `fuera` y `sin-identificar` no entran; con `completo: false`, un tema con la cifra de la última línea no queda arriba de uno sin línea; con `conteo === null`, todo `dificil` | `src/lib/en-vivo.test.ts` | la regla de `CTR-19.15` se aflojó, y cada caso con su control en verde |
> | t14 | **el banco de `US-07` es el que da la regla**: su `conteo` (ficha y fecha) es igual al de `setlistfm.json`; y para cada ítem, `dificultad` es la que da `repartirEnTercios(<slugs del banco>, conteo)` y `dificultadSegun` es `sin-conteo` exactamente cuando el tema no tiene línea | `src/lib/por-la-letra/banco.test.ts` (nuevo) | se refrescó el conteo y el banco no se regeneró, o alguien tocó un nivel a mano. El mensaje dice `npm run generar-por-la-letra` |
> | t15 | aislamiento: fuera de los tests, ningún `.ts`, `.mjs` ni `.astro` de `src/` o `scripts/` nombra `repartirPorPopularidad`, y `scripts/generar-por-la-letra.mjs` no nombra `popularidad.json` | `src/lib/en-vivo.test.ts`, junto a t8 | alguien volvió a sacar la dificultad de las vistas (`D-46` consecuencia 3, `CTR-07.7`) |
>
> t5 no cambia: con el pozo real siguen saliendo 8 Fáciles determinados. **No hay test del
> 8 / 82 / 5 de `US-02`**, porque ese número depende de una regla que `producto` puede cambiar. Lo
> muestra el comando (1).

**Y los que ya existen, que tienen que seguir en verde con los alias nuevos:**
`src/lib/letra/temas.test.ts` (cada alias apunta a uno de los 105 y ninguno sobra) y
`src/lib/tema/catalogo.test.ts`. En este último, **los dos tests de tercios con vistas se
reescriben** para el corte en vivo: con conteo aparecen 8 Fáciles sin tocar código, y el tema que
figura más veces es Fácil. `popularidad.test.ts` queda como está, porque prueba la regla de `US-07`.

```bash
# (0) Todo, y los de este contrato por nombre.
npm test
node --test src/lib/esquemas.test.ts src/lib/en-vivo.test.ts src/lib/escalonar.test.ts src/lib/tema/catalogo.test.ts src/lib/letra/temas.test.ts
node --test src/lib/recitales.test.ts   # solo si existe recitales.json

# (1) El cruce, línea por línea, para leerlo contra la ficha. Marca lo que no coincide con
#     resolverTema() y lo que no tiene fragmento. Esperado con el ejemplo de CTR-19.12: ninguna marca.
#     Enmendado 2026-09-24 (T-284): imprime y compara también las líneas grafiaDe; antes una
#     grafía salía como "fuera:undefined" con marca. Con RES-90, las únicas marcas esperadas son
#     "(sin fragmento)" en los temas con línea que no están en el pozo de US-02.
node -e "Promise.all([import('./src/lib/letra/temas.ts'),import('./src/lib/texto.ts'),import('node:fs')]).then(([t,x,{readFileSync}])=>{const c=JSON.parse(readFileSync('src/data/setlistfm.json','utf8')).conteo;const pozo=new Set(JSON.parse(readFileSync('src/data/adivinar-tema.json','utf8')).fragmentos.map(f=>f.slug));for(const l of c.temas){const r=t.resolverTema(l.titulo);const s=r?x.slugDeTitulo(r.titulo):null;console.log(String(l.veces).padStart(4),l.titulo,'->',l.slug??(l.grafiaDe?'grafia de:'+l.grafiaDe:'fuera:'+l.fuera),s===(l.slug??l.grafiaDe??null)?'':'  <<< resolverTema dice: '+s,l.slug&&!pozo.has(l.slug)?'  (sin fragmento)':'')}console.log('consultado',c.consultado,'| vigencia',c.vigenciaDias,'dias | completo',c.completo,'| ficha',c.ficha)})"

# (2) La pieza 2, resumida para revisor: salida, fuentes con su licencia y cuántos recitales trae
#     cada una (se compara con RES-76+), temas fuera de catálogo por clase, completitud.
node -e "import('node:fs').then(({readFileSync,existsSync})=>{if(!existsSync('src/data/recitales.json'))return console.log('recitales.json no existe: estado valido si RES-76+ no trajo fuentes (CTR-19.7)');const d=JSON.parse(readFileSync('src/data/recitales.json','utf8'));const por={},fuera={},comp={};for(const r of d.recitales){por[r.fuente]=(por[r.fuente]??0)+1;comp[r.completitud]=(comp[r.completitud]??0)+1;for(const x of r.temas)if(x.fuera)fuera[x.fuera]=(fuera[x.fuera]??0)+1}console.log('salida:',d.licencia.id,'| recitales:',d.recitales.length);for(const f of d.fuentes)console.log(' ',f.id,'|',f.licencia.familia,f.licencia.version??'','|',por[f.id]??0,'recitales | ficha',f.ficha);console.log('fuera de catalogo:',fuera);console.log('completitud:',comp)})"

# (3) Este documento.
rg -n "^## CTR-19" Docs/ARQ/ARQ-schema-recitales.md
```

| # | Chequeo | Quién |
|---|---|---|
| 1 | Schemas contra los datos y los 27 casos | `esquemas.test.ts` |
| 2 | Cruce, orden, unicidad y vigencia del conteo | t1–t4 |
| 3 | **8 Fáciles determinados sobre el pozo real** (abre la puerta de `BR-28`) | t5 |
| 4 | Que el azar y lo de afuera no decidan | t6, t7 |
| 5 | Que no se mezclen las vistas ni se derive de la pieza 2 | t8 |
| 6 | Que nadie lea setlist.fm con una máquina | t9, y el schema en la pieza 2 |
| 7 | Integridad y licencias de la pieza 2 | t10–t12 |
| 8 | Que los números sean los de la ficha | **`revisor`**, con el comando (1) al lado de `RES-74` |
| 9 | Que el texto de cada licencia diga lo que declara la `familia`, y un `permiso-escrito` deje redistribuir | **`revisor`**, contra `RES-76`+ |
| 10 | Que la cantidad de recitales por fuente sea la que contó la ficha | **`revisor`**, con el comando (2) |
| 11 | Que la pantalla rotule (`RNF-CTR-19-A`, `-B`) | **`revisor`**, cuando haya pantalla |

---

### CTR-19.14 — Lo que queda abierto, con dueño

Nada de esto frena `T-279`. Todo tiene un valor por defecto escrito arriba.

1. **Qué exigen las licencias de la pieza 2.** Afecta solo a la tabla de `CTR-19.8`. Dueño:
   `investigador`, con el pedido en
   `Docs/SUGERENCIAS/ARQ-para-investigador-lo-que-la-licencia-exige-del-archivo.md`. Si `T-281`
   ya lo contesta, alcanza con que la ficha lo diga. **Si `T-281` trae una fuente con una
   familia que el enum no tiene** (una licencia de base de datos, una propia del sitio), el schema
   la rechaza a propósito. Entra con `CTR-19` v2 y la ficha en la mano, y **no se mapea a la
   familia más parecida**: ese mapeo sería una lectura legal hecha por el script.
2. **Media y Difícil de `US-02`, el plazo del conteo y cuatro citas de `BR-18` que este contrato
   deja viejas** (tres en (h) y una en (g)). Dueño: `producto`, en
   `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-corte-en-vivo-deja-abierto.md`. Mientras tanto
   rige lo que dicen `CTR-19.5` y `CTR-19.6`.
3. **🔴 Con 8 Fáciles, cada vuelta de `US-02` con todos los discos sale de esos mismos 8
   temas.** `escalonar()` llena la vuelta desde el nivel más fácil hasta completar el largo, y la
   vuelta es de 4 (`partida-tema.ts:68`, `escalonar(pozo(), LARGO_RONDA)` en la línea 225). Con
   todos los discos (`pozo(cat, null)`) las cuatro canciones de cada vuelta salen siempre de esos
   8, y los otros 87 temas del pozo no suenan nunca. Con un disco elegido no pasa con el conteo
   de hoy: ningún disco tiene más de 2 de los 8 (`gulp`, `oktubre` y `la-mosca-y-la-sopa`
   tienen 2 cada uno, según el `disco` de `popularidad.json`), así que la vuelta de 4 mezcla
   niveles. Es la "vidriera fija" de `BR-01` punto 3,
   pasada de un ítem a toda la vuelta. **No lo causa este contrato**, porque `escalonar()` hace lo
   mismo con cualquier fuente; pero hoy está tapado porque todo es Difícil, y aparece el día que
   `T-279` cuente los 8. Dueño de la regla: `producto`; del código: el hilo principal. Está en el
   mismo traspaso a `producto`.
4. ~~**Salida A o B de `D-27`.** Dueño: el usuario, como dice `BR-18` (h). El contrato aguanta las
   dos (`CTR-19.5`).~~ **[CERRADO 2026-09-24 por `D-46`]**: el usuario eligió la B, y más amplia.
   Los tercios están en `CTR-19.15`.
5. **Los dos alias nuevos** en `src/lib/letra/temas.ts`. Dueño: el hilo principal en `T-279`. Los
   respalda `RES-75`.

*Enmienda del 2026-09-24 (`T-284`): se suman 6 a 8.*

6. **Media y Difícil de `US-02` con el conteo completo: 8 / 82 / 5** (`CTR-19.5`, enmienda). Dueño:
   `producto`, en `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-conteo-completo-mueve.md`. Mientras
   tanto rige el paso 5.
7. **Cuatro inconsistencias chicas de `INV-89`.** Ninguna cambia un número de los que se usan.
   Dueño: `investigador`, en `Docs/SUGERENCIAS/ARQ-para-investigador-lo-que-el-conteo-completo-deja-suelto.md`.
   Mientras tanto manda el anexo (`CTR-19.16`).
8. **Los tres alias nuevos** en `src/lib/letra/temas.ts` (`CTR-19.16`). Dueño: el hilo principal,
   en `T-285`. Los respaldan `RES-90`, `RES-91` y dos filas que ya existen.

---

### CTR-19.15 — Los tercios de `US-07`: la segunda regla que sale del conteo — *nuevo, 2026-09-24*

**La decisión en una línea.** La dificultad de "Sacalo por la letra" la calcula
**`repartirEnTercios()`**, en `src/lib/en-vivo.ts` y al lado del corte de `US-02`, sobre el pozo del
banco y con el conteo citado. **La usa un solo lugar**: `scripts/generar-por-la-letra.mjs`, que
escribe el resultado en el banco (`CTR-09.7`, enmendado).

**Qué regla es.** Es la de `D-27` con la medida de `D-46`, y no se inventa nada. Los temas del pozo
que tienen línea se ordenan por `veces` y se parten en tercios. Un tema sin línea es `dificil` y no
ocupa lugar en los tercios (*"sin escucha por ahora es difícil"*, con *escucha* leído igual que en
`CTR-19.5`). Este apartado agrega una sola cosa: **qué pasa con un empate en el borde**. Con las
vistas de YouTube casi no pasaba. Con conteos chicos es lo normal: en el anexo de `RES-90` hay
empates en 49, 44, 41, 40, 39 y 36, todos dentro de los 30 primeros.

```ts
// src/lib/en-vivo.ts — junto a repartirEnVivo(), compartiendo el paso 1
export type NivelDificultad = 'facil' | 'media' | 'dificil'; // se muda acá desde popularidad.ts

export interface TerciosEnVivo {
  /** Todo el pozo: cada tema del banco con su nivel. */
  readonly porSlug: ReadonlyMap<string, NivelDificultad>;
  /** Temas del pozo con una línea `slug`: sobre estos se parten los tercios. */
  readonly conConteo: number;
  /** Temas del pozo sin línea. Son `dificil` (D-27) y se nombran para que el log los muestre. */
  readonly sinConteo: readonly string[];
  readonly porNivel: Readonly<Record<NivelDificultad, number>>;
}

export function repartirEnTercios(
  pozo: ReadonlySet<string>,
  conteo: ConteoCitado | null,
): TerciosEnVivo;
```

`LineaCitada` suma `readonly grafiaDe?: string`.

**El algoritmo (normativo):**

1. `L` son las líneas con `slug` dentro del `pozo`. Es el mismo paso 1 de `CTR-19.5`, escrito **una
   sola vez** en una función interna que usan las dos reglas. Las líneas `grafiaDe` y `fuera` no
   entran.
2. `sinConteo` son los temas del pozo que no están en `L`, y quedan `dificil`. Con `conteo === null`
   o con `L` vacío, todo el pozo queda `dificil`.
3. `t = ⌈|L| / 3⌉`, lo mismo que hacía la regla de las vistas a la que reemplaza.
4. Para cada línea ℓ de `L`, **`alcance(ℓ)` es cuántos temas del pozo figuran al menos tantas veces
   como ℓ**, contando a ℓ. Si `completo` es `false` y ℓ no supera la última línea publicada, se
   suman los de `sinConteo`, porque un tema que no figura puede tener hasta esa cifra (`CTR-19.3`).
5. Si `alcance(ℓ) ≤ t`, es `facil`. Si `alcance(ℓ) ≤ 2t`, es `media`. Si no, `dificil`.

**Por qué el paso 4 y no el puesto en el arreglo.** Es la regla de `CTR-19.5` aplicada a tres
franjas: **un tema queda arriba solo si supera estrictamente a todo lo que quedó abajo**. Un grupo
empatado en el borde baja entero y nunca se parte. Tampoco depende del orden del arreglo: dentro de
un empate la página ordena por abecedario, y el abecedario no mide nada.

*Alternativa descartada:* **el puesto con orden estable**, que es lo que hace hoy
`repartirPorPopularidad()`. Partiría un empate por orden alfabético. *Queso ruso* y *Rock para los
dientes* figuran 49 veces cada uno: si el borde cayera ahí, uno sería Fácil y el otro no por la
letra con que empieza.
*Alternativa descartada:* **que el empate suba entero** (el ranking de competencia). Es igual de
determinista y le da más Fáciles al pozo. Se descarta por coherencia: el corte de `US-02` ya eligió
tener un Fácil menos antes que uno dudoso (`CTR-19.5` paso 3). Si dos reglas del mismo módulo
resolvieran el mismo caso al revés, el sitio tendría dos criterios de "Fácil".
*Alternativa descartada:* **que los `sin-identificar` suban el techo, como en `US-02`.** Allá el
techo protege una cuota fija de 8 contra un tema del pozo publicado con otro nombre. Acá no hay
cuota, y un techo global aplicado a tres franjas deja vacía la del medio: con *Blues del noticiero*
en 32, ningún tema por debajo de 33 podría quedar en Media. Además hoy no hace falta: **los 88 temas
del pozo tienen su línea**, así que ningún `sin-identificar` puede ser uno de ellos con otro nombre.
Y si fuera otra grafía, tampoco sumaría (`CTR-19.2`). Si mañana un tema del pozo se queda sin línea,
cae en `dificil`, que es la salida prudente de `D-27`, y el generador lo nombra.

**El costo que se acepta.** Si todo el pozo empatara, todo quedaría `dificil`. No es un caso real, y
es lo que corresponde decir: ningún tema se tocó más que otro. **La regla no garantiza el piso de 15
Fáciles** de `US-07` (`BR-30`): lo mide. El generador imprime `porNivel`, y el comando (2) de
`CTR-09.11` ya lo compara con 15.

**Lo que da hoy.** Es una lectura derivada de `RES-90` y de `src/data/por-la-letra.json` (88
ítems), contada a mano y a confirmar con t14. Con los tres alias de `CTR-19.16`, los 88 tienen
línea y `t = 30`. Los dos bordes caen limpios: *Todo un palo* (32) contra *Superlógico* y *Susanita*
(29), y *Perdiendo el tiempo* y *Nuotatori professionisti* (9) contra tres temas en 8. Resultado:
**30 Fácil, 30 Media, 28 Difícil y ninguno sin conteo.** Sin los alias daría 29 / 29 / 30, con
*Nuotatori professionisti* y *¡Es hora de levantarse querido!* en Difícil por falta de dato.

> **Nota del 2026-09-24, segunda vuelta de `T-284`.** `BR-30` todavía dice que el pozo es de
> *"piso de 60, hoy"* y que los tercios dan *"~20 por franja"*. El pozo real es de **88**, y lo
> midió `revisor` contando `items` de `por-la-letra.json`. **Manda este apartado**: el generador
> calcula sobre el pozo que hay, no sobre un número escrito. El 60 sigue siendo el **piso**
> de `US-07`, no el tamaño del pozo. La corrección de `BR-30` es de `producto` y está pedida en
> `Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-conteo-completo-mueve.md` §2.

**Quién la usa y quién no.** La usa **solo `scripts/generar-por-la-letra.mjs`**. No la usa
`catalogo.ts`: `US-02` sigue con el corte de 8 (`BR-30`). Tampoco el quiz ni `US-03` (`BR-30`).
Ninguna página ni isla la importa, porque el nivel llega al navegador ya escrito en el banco.

**Por qué en `en-vivo.ts` y no en `popularidad.ts`**, que es donde la ponía el plan (`T-285`):

1. `en-vivo.ts` ya tiene el tipo del conteo (`ConteoCitado`) y la guarda t8, que prueba buscando
   texto que ahí no se nombran las vistas. Las dos reglas que salen del conteo comparten el paso 1 y
   la guarda.
2. `popularidad.ts` está hecho sobre la medición de YouTube (`TemaMedido`, `medicion.vistas`). Para
   que lea el conteo habría que hacer una de dos cosas. Una es una firma que acepte vistas y conteo,
   que es lo que prohíbe `CTR-07.7`. La otra es reescribirlo entero con un nombre que dice lo que
   `D-45` punto 3 y `D-46` consecuencia 4 no dejan decir: que el tema es *popular*.

**`repartirPorPopularidad()` se retira, con su test.** No la usa nadie más. Dejarla sería dejar una
regla que no rige y un comentario que dice que la usa `generar-por-la-letra.mjs`. `NivelDificultad`
se muda a `en-vivo.ts` (la importan `catalogo.ts` y `en-vivo.ts`, nadie más) y **`src/lib/popularidad.ts`
deja de existir**. **Se quedan `popularidad.json`, su schema, `ingerir-popularidad.mjs` y `CTR-07`**:
son el dato de un ranking de vistas que puede volver por separado (`D-45` consecuencia 1), no una
regla de dificultad.
*Alternativa descartada:* **dejarla guardada sin uso.** Una función que saca la dificultad de las
vistas es justo lo que alguien volvería a enchufar el día que llegue la clave, y `D-46` consecuencia
3 dice que para eso hace falta una decisión nueva. t15 lo vigila.

**Lo que toca `T-285` por este apartado:** `en-vivo.ts` (la función, el tipo y el campo `grafiaDe`),
`problemasDelConteo()` (t1 y t3), `catalogo.ts` (de dónde importa el tipo), borrar
`popularidad.ts` y `popularidad.test.ts`, y cuatro comentarios que quedarían mintiendo: el
encabezado de `en-vivo.ts` (*"La cuota de BR-01 para US-02"* sigue, pero el módulo ya no es solo
de `US-02`), el de `generar-por-la-letra.mjs`, `partida-por-la-letra.ts:167` (*"mientras
`popularidad.json` no tenga mediciones…"*) y el de `catalogo.ts:43`.

---

### CTR-19.16 — El cruce del conteo completo contra los 105 — *nuevo, 2026-09-24*

Se hizo a mano con la puerta de `D-13` (`ALIAS` y después `normalizarDuro()`), sobre el anexo de
`INV-89` y los tracklists de `RES-20`. Lo recuenta t1 en `T-285`. **Si t1 no da esto, manda t1**, y
este apartado se corrige.

| Qué resulta | Líneas | Qué se guarda |
|---|---|---|
| Resuelve y cuenta | **99** | `slug`: 99 de los 105 temas tienen su número |
| Es otra grafía de un tema que ya cuenta | **2** | `grafiaDe` y `nota`: *Rock del país* (37), *Mariposa Pontiac / Rock del país* (10) |
| No es del catálogo, y la ficha lo clasifica | **26** | `fuera`: 5 `inedito`, 9 `cover`, 7 `intro`, 5 `cantico` |
| No es del catálogo, y la ficha no lo clasifica | **71** | `fuera: "sin-identificar"`, con la nota de `CTR-19.3` punto 3 |
| **Total** | **198** | |

**Los 6 temas del catálogo que no tienen línea**, y por eso no tienen conteo: *Pianito - Jam*,
*Invocación*, *Capricho Magyar*, *Sushi*, *Soga de Caín* y *San Telmo*. En el pozo de `US-02` están
cinco (todos menos *Pianito*), que quedan en Difícil. En el pozo de `US-07` no hay ninguno.

**Tres filas nuevas en `ALIAS`**, y ninguna es una ocurrencia:

| Título en setlist.fm | Título en `RES-20` | Por qué no alcanza la normalización | Respaldo |
|---|---|---|---|
| `Nuotatori profesionisti` | `Nuotatori professionisti` | le falta una "s" | `RES-91` |
| `Es hora de levantarse querido ¿Dormiste bien?` | `¡Es hora de levantarse querido!` | trae el subtítulo pegado. Es el mismo juicio que la fila `'¡Es Hora de Levantarse, Querido! (¿Dormiste Bien?)'`, que ya existe, con otra puntuación, y `ALIAS` compara el título exacto | `RES-90`, más esa fila |
| `Rock del país` | `Mariposa Pontiac - Rock del país` | nombra solo la segunda mitad del tema compuesto. Es la contracara de la fila `'Mariposa Pontiac'`, que ya existe | `RES-91` (*"confirmado sistemático"*) |

`ALIAS` sirve para todas las fuentes. Que *Rock del país* resuelva también en la pieza 2 es lo que
`CTR-19.2` ya preveía: dos entradas seguidas con el mismo slug y `pegadoAlAnterior`.

**Las variantes que `RES-91` anota y que resuelven solas** (no llevan alias, y `temas.test.ts`
rechazaría uno que sobre): *¡Cruz diablo!*, *Fanfarría del cabrío*, *¡Me matan limón!*, *Esto es
to-to-todo amigos!*, *¡Lobo ¿estás?!*, *Fusilados por la Cruz Roja* y *Semen Up*, y además *Toxi-taxi*,
*Gran lady*, *Lavi-Rap*, *Alien Duce*, *Un pacman en el Savoy*, *El árbol del Gran Bonete*, *Murga
de la Virgencita* y *Una piba con la remera de Greenpeace...*.

**Mariposa Pontiac, las tres formas.** Cuenta *Mariposa Pontiac* (43), que es la que más figura. Las
otras dos son `grafiaDe` (`CTR-19.2`). En la cola hay además un medley de cuatro (*Mariposa Pontiac /
Rock del país / Ese gordo tramposo / Un tal Brigitte Bardot*, 1) que no resuelve. `RES-91` lo pone
entre las *"apariciones combinadas"* de los inéditos, así que va `inedito`, con una nota que dice
qué tema del catálogo tiene adentro y que no se suma.

**La cola empatada en 1: se copia entera, y no mueve nada.** Son 51 líneas que la página publica.
Un 1 no es un 0, y lo que no cruza se declara en vez de tirarse (`CTR-19.2`). **Ninguna resuelve a
un tema del catálogo.** Que pueda tener huecos lo dice `completo: false`, y por eso "no figurar"
quiere decir "1 como mucho". No mueve ningún borde: el de `US-02` está en 57, y los de `US-07` en 32
y en 9.

**Los títulos que no son de la banda** van con `fuera: "cover"`. Se guardan, no suman nunca y no
suben ningún techo, porque se sabe que no son del pozo. Dos títulos aparecen dos veces con distinto
autor (`RES-89.3`, `RES-92.2`). *Hercules mío* de la banda (3) va `sin-identificar`: la ficha dice
de quién es la línea, no si el tema es de ellos. El de Vivi Tellas (1) va `cover`. *Olé olé olé olé,
Patricio Rey* de la banda (2) va `cantico`, y el de Lange Jojo (1) va `cover`.

**Las 26 líneas que la ficha clasifica**, para copiar sin volver a leer `RES-91`:

- `inedito` (5): *Un tal Brigitte Bardot*, *Nene nena*, *Ese gordo tramposo*, *El gordo tramposo /
  Un tal Brigitte Bardot*, el medley de cuatro.
- `cover` (9): *Es un sentimiento*, *Monólogo (Enrique Symns cover)*, *Mi mamá alemana (Vivi Tellas
  cover)*, *Monólogo (Sergio "Mufercho" Martínez cover)*, *Desde el alma*, *Imperialismo espacial
  (La Cofradía de la Flor Solar cover)*, *Cuando calienta el sol*, y los *Hercules mío* y *Olé…* de
  la cola.
- `intro` (7): *Patricio Disco Show*, *Patricio Super Show*, *Instrumental Jam*, *Skay Guitar Solo*,
  *Willy Crook Saxophone Solo*, *Palabras iniciales por Mufercho*, *Presentacion*.
- `cantico` (5): *"Pongan huevo Los Redondos"*, *"Vamos Redondos, con huevo vaya al frente"*,
  *"Vamos Los Redo"*, *Olé olé olé olé, Patricio Rey* (el de la banda), *Himno Nacional Argentino*.

**Lo que no se resuelve acá, y está pedido a `investigador`.** Ninguno de estos puntos cambia un
número de los que se usan:

1. *Perra dinamita* (2). ¿Es otra forma de escribir *Mi perro dinamita*? Hasta que una ficha lo diga,
   va `sin-identificar` y sin alias. *Mi perro dinamita* tiene 58 y es Fácil en los dos juegos, así
   que no mueve nada.
2. `RES-91` dice *"Desde el alma (cola, 1)"*, y el anexo dice *"95. Desde el alma — 6"*. Se copia lo
   del anexo.
3. `RES-89.1` dice que los puestos 1 a 146 tienen conteos *"decrecientes y distintos"*, y el anexo
   trae empates (49, 44, 41, 40…). Manda el anexo, y la regla de `CTR-19.15` existe justamente por
   esos empates.
4. De los dos títulos de la cola que traen una aclaración falta el título literal de la página.
   Mientras tanto rige `CTR-19.3` punto 3.

---

### Consecuencias

- **`T-279` tiene seis entregables fijos y tres más si hay fuentes, no dos.** Los fijos:
  (1) `setlistfm.json` y su schema; (2) `src/lib/en-vivo.ts` con `en-vivo.test.ts`; (3) el cambio
  de firma de `catalogo()` y de `adivinar-el-tema.astro`, con los cuatro comentarios de
  `CTR-19.5`; (4) los dos alias; (5) las líneas en `esquemas.test.ts`; (6) la reescritura de los
  dos tests de tercios en `catalogo.test.ts`. **Solo si `RES-76`+ trae alguna fuente:**
  (7) `recitales.json` y su schema; (8) `scripts/ingerir-recitales.mjs`; (9) `src/lib/recitales.ts`
  con `recitales.test.ts`.
- **La puerta de `BR-28` se abre con t5 en verde**, no cuando se escribe este contrato (`D-45`
  consecuencia 2).
- **Fácil:** refrescar, que es una ficha y 25 líneas. Cambiar Media y Difícil, que es una línea.
  Cambiar el plazo, que es un entero.
- **Caro, y a propósito:** sumar una fuente con una familia de licencia nueva, o mezclar BY-SA con
  NC-SA. Obliga a tocar este contrato.
- **Difícil, y asumido:** el schema no puede leer un texto de licencia. Declara la familia; que el
  texto diga eso lo revisa `revisor`.
- **`experiencia` hereda dos requisitos**: `RNF-CTR-19-A`, solo si muestra el nivel o el orden, y
  `RNF-CTR-19-B` para la primera pantalla de recitales.
- **`contenido` escribe el rótulo** a partir de la línea de referencia de `CTR-19.9`, con la
  restricción de "figura", no "se tocó".
- **Enmendados en esta misma tarea**, con una nota al principio de cada uno y sin borrar nada:
  `CTR-03.11` (el tercer insumo de `catalogo()` ya no es `popularidad.json`) y `CTR-07.8` (este
  dataset dejó de definir los Fáciles de `US-02`).

**Lo que agrega la enmienda del 2026-09-24 (`T-284`, `D-46`):**

- **`T-285` tiene ocho entregables:** (1) `setlistfm.json` reescrito entero desde `RES-90` y el
  schema de `CTR-19.10`; (2) los tres alias; (3) `repartirEnTercios()`, `grafiaDe` y
  `NivelDificultad` en `en-vivo.ts`; (4) t1 y t3 en `problemasDelConteo()`, el test de la ficha
  pasado a `RES-90`, c28 a c32, t13 y t15; (5) el retiro de `popularidad.ts` y su test; (6)
  `generar-por-la-letra.mjs` y el schema de `CTR-09.8`; (7) el banco regenerado; (8) t14 en
  `src/lib/por-la-letra/banco.test.ts`.
- **Fácil:** refrescar el conteo sigue siendo copiar una ficha, ahora más larga, y correr el
  generador de `US-07`. Si alguien se olvida, t14 lo avisa.
- **Caro, y asumido:** 198 líneas copiadas a mano. Es el precio de no usar bots contra setlist.fm
  (`RES-73.1`), y el test de la ficha lo verifica título por título.
- **Una sola decisión de reparto por juego, cada una en su función:** el corte de 8 de `US-02` y los
  tercios de `US-07`. Las dos están en `en-vivo.ts`, leen el mismo `ConteoCitado`, y ninguna lee
  vistas.
- **`CTR-09` pasa a `contratoVersion: 2`** y **`CTR-07` deja de alimentar cualquier dificultad**.
  Los dos están enmendados en su archivo. **`CTR-03` y `CTR-04` no cambian:** `US-02` ya derivaba
  la dificultad en build y no la guarda en el manifiesto (`CTR-03.11`), y `US-03` no migra
  (`BR-30`).

### Qué NO decide este contrato

- **Qué fuentes abiertas hay ni por qué vía se bajan**: `RES-76`+ (`T-281`).
- **Media y Difícil definitivos, el plazo definitivo y la salida de `D-27`**: `producto` y el
  usuario. *(La salida de `D-27` la cerró `D-46` el 2026-09-24.)*
- **El piso de 15 Fáciles de `US-07` y si los tercios son la regla para siempre**: `producto`
  (`BR-30`). Este contrato los mide, no los garantiza.
- **El texto del rótulo y dónde va**: `contenido` y `experiencia`.
- **Si los recitales se muestran, ni en qué juego**: `IDEA-15`, fuera de este ciclo.
- **La lectura legal de las licencias**: una ficha. Acá hay una tabla prudente, no un dictamen.
- **`ADR-01` no se toca**: este frente no toca audio.
