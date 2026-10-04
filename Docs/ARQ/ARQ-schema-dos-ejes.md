# ARQ — Schema del banco del test de dos ejes (`US-06`)

> Rol dueño: `arquitectura`. Consume: `Docs/BRIEF.md`, `US-06` y `BR-17`
> (`Docs/PRODUCTO/PRD-alcance-v1.md`), `D-02`, `D-12`, `D-14`, `D-17`, `CTR-02`
> (`Docs/ARQ/ARQ-schema-quiz.md`), `CTR-03`, `ADR-02`
> (`Docs/ARQ/ARQ-link-resultado-compartido.md`), `Docs/ORQ/ORQ-plan-ciclo-8.md` (`T-120`),
> `src/lib/esquemas.test.ts`, `.claude/rules/voz-ricotera.md`.
> **Para la v2, además:** `D-57`, `D-21`, `BR-36`, `BR-37`, `UX-06` §7, `CNT-29`, `RES-168`,
> `CTR-01.5`, `CTR-12`, `src/lib/dos-ejes/` (`partida.ts`, `arte.ts`, `taller.ts`, y sus tres
> tests), `scripts/generar-dos-ejes.mjs`, `package-lock.json`.
> Produce: `CTR-08` (v1 2026-08-24, **v2 2026-10-04**).
> Última actualización: 2026-10-04 (`CTR-08` v2, ciclo 18, `D-57`).

**Vigente: `CTR-08` v2.** La v1 queda abajo entera, sin borrar: el schema v2 es la v1 más lo
que suma la noche, y las alternativas descartadas de la v1 siguen valiendo. Donde una sección
de la v1 quedó reemplazada o ampliada, lo dice una marca al principio de la sección.

---

## CTR-08 v2 — Enmienda del 2026-10-04: la noche en cinco momentos

- **Fecha:** 2026-10-04
- **Estado:** **vigente.** El schema ya está bajado: `src/data/_schema/dos-ejes.schema.json`,
  `$id` `https://ricotaarcade.local/schema/dos-ejes/2`. No espera ninguna ficha `RES-XX`
  para decidir: el banco sigue sin afirmar nada sobre la banda (`CTR-08.5`, regla 5). Un solo
  hecho externo queda sin verificar —qué peso aceptan los previsualizadores de enlaces— y
  toca un techo del taller (v2.6), no una decisión.
- **Pedido por:** `D-57` ("`CTR-08` v2 lo formaliza") y su lista de consecuencias para
  `arquitectura`.
- **Escrito sobre lo que ya hay.** Cuando se escribió esta versión, el hilo principal ya
  tenía el motor (`partida.ts`), el taller y sus guardas a medio camino. **La v2 los toma
  como están** donde cumplen `D-57`, y marca aparte lo poco que falta (v2.10). No tiene
  sentido un contrato que obliga a reescribir un código que ya hace lo correcto.
- **Para quién:** `contenido` (`CNT-30`), que está reescribiendo el banco con esta forma; el
  hilo principal (motor, isla, postales, taller); `revisor` (`REV-19`).

### v2.1 — Qué no cambia, qué cambia, y qué reemplaza de la v1

**No cambia, y es lo que sostiene el juego:** un ítem mueve un solo eje (regla 1); dos
opciones, una por polo puro (regla 2); `preguntasPorEje` entero, impar, entre 3 y 9 (regla
3); ninguna opción correcta y ninguna clave fuera de las declaradas (regla 4); sin
`hecho`/`leyenda`/`testimonio` (regla 5); cuatro cuadrantes, ids `CU-1`..`CU-4`; la lista
negra de comparativos en el nombre; Bulacio, Olavarría y Cromañón fuera de todo texto;
`Resultado` con tres strings y ningún número.

| v1 | Qué pasa | Dónde |
|---|---|---|
| `CTR-08.1` archivo, ≤ 40 KB | sigue. 58 ítems (28 retirados con nota + 30) se estiman en ~25 KB | — |
| `CTR-08.2` envoltorio | **ampliado**: suma `momentos`; `contratoVersion` pasa a 2 | v2.2 |
| `CTR-08.3` ítem | **ampliado**: suma `momento`, obligatorio si el ítem está `listo` | v2.3 |
| `CTR-08.4` cuadrantes | **ampliado**: nombre ≤ 26, bajada ≤ 240; el ejemplo viejo salió | v2.4 |
| `CTR-08.5` las cinco reglas | sigue entera | — |
| `CTR-08.6` sorteo y resolución | **reemplazado**: la noche, `vistos`, `disposicion`, `relacion` | v2.5 |
| — | **nuevo**: el taller de tarjetas | v2.6 |
| `CTR-08.7` bloque normativo | **reemplazado**: manda el archivo, sin copia pegada | v2.7 |
| `CTR-08.8` lo que el schema no ve | **ampliado** | v2.8 |
| `CTR-08.9` verificación | **reemplazado**; el comando (3) citaba dos archivos que nunca existieron | v2.9 |
| `CTR-08.10` numeración | sigue. La v2 usa `EJ-998` de ejemplo | v2.3 |
| Consecuencias: "cambiar `preguntasPorEje` es barato" | **ya no**: ver v2.2 | v2.2 |

### v2.2 — El envoltorio y los cinco momentos

```json
{
  "contrato": "CTR-08",
  "contratoVersion": 2,
  "juego": "dos-ejes",
  "actualizado": "2026-10-04",
  "preguntasPorEje": 5,
  "momentos": [
    { "id": "previa", "nombre": "La previa", "canta": "(la línea de CNT-30)" },
    { "id": "ida", "nombre": "La ida", "canta": "(la línea de CNT-30)" },
    { "id": "vereda", "nombre": "La vereda", "canta": "(la línea de CNT-30)" },
    { "id": "adentro", "nombre": "Adentro", "canta": "(la línea de CNT-30)" },
    { "id": "vuelta", "nombre": "La vuelta", "canta": "(la línea de CNT-30)" }
  ],
  "cuadrantes": [ ... ],
  "items": [ ... ]
}
```

Los `nombre` y `canta` de arriba son de relleno: el texto es de `contenido` (`CNT-30`). De
este contrato son los ids, el orden y los largos.

| Campo | Tipo | Qué es |
|---|---|---|
| `momentos` | arreglo de **exactamente 5**, **en este orden** | La noche (`D-57` punto 1). Cada objeto, `additionalProperties: false` |
| `momentos[].id` | `previa` · `ida` · `vereda` · `adentro` · `vuelta` | Lo que referencia el ítem. No se muestra |
| `momentos[].nombre` | string 2–24 | El sello del momento: registro 3, seco |
| `momentos[].canta` | string 6–80 | La línea de registro 1. Las ocho palabras las mide `banco.test.ts`; los 80 caracteres son el techo de forma |

Los dos textos tampoco admiten Bulacio, Olavarría ni Cromañón: es la regla de `CTR-08.5`
llevada a los dos campos nuevos que se leen.

**El orden lo hace cumplir el schema, no solo el test.** `prefixItems` fija `previa` en la
posición 0, `ida` en la 1, y así hasta `vuelta`; `items: false` cierra la sexta. Eso da gratis
dos cosas que un `enum` suelto no da: que ningún id se repita (dos `previa` no validan) y que
la noche no se cuente al revés. `banco.test.ts` ya lo mira con un `deepEqual`; mirarlo también
acá cuesta cinco líneas y le da a `contenido` el error en el lugar exacto (`/momentos/1/id`)
en vez de dos arreglos comparados enteros.

**La invariante que importa: `momentos.length === preguntasPorEje`.** El motor sirve un
ítem de cada eje por momento, así que **la cantidad de preguntas por eje pasa a ser
`momentos.length`**. Si las dos cifras se separan, la paridad de `BR-17` regla 3 depende de
cuál de las dos mire cada uno.

- **No la vigila el schema, y no por descuido:** JSON Schema no sabe comparar un valor con el
  largo de un arreglo hermano. Se podría fingir con `const: 5` en los dos lados, pero eso
  congela `preguntasPorEje` en el schema y la regla 3 ("impar entre 3 y 9") quedaría escrita
  dos veces, una de ellas mintiendo.
- **La vigila `banco.test.ts`** (`assert.equal(BANCO.momentos.length, BANCO.preguntasPorEje)`).
- **Y el motor la vuelve a mirar en tiempo de ejecución** (v2.5, paso 1): si no coinciden,
  tira `PartidaImposible`. Que un test pase y que el motor no sirva una noche par son dos
  garantías distintas, y la segunda es la que ve la gente.

**Lo que esto le cuesta a la v1:** `CTR-08.2` decía que cambiar `preguntasPorEje` era tocar un
número. Ya no: una sexta pregunta por eje es un sexto momento de la noche, y eso es tocar
`momentos`, `preguntasPorEje` y el `prefixItems` del schema a la vez —más el texto de
`contenido` y la decisión de `producto`—. El test avisa si se olvida uno. Es el precio de que
la partida sea una noche y no una lista, y `D-57` ya lo pagó al descartar "siete por eje".

### v2.3 — El ítem: `momento`

```json
{
  "id": "EJ-998",
  "us": ["US-06"],
  "eje": "orden-caos",
  "momento": "previa",
  "enunciado": "Falta una hora para salir. ¿Qué te ponés?",
  "opciones": [
    { "texto": "La ropa elegida desde ayer", "polo": "orden" },
    { "texto": "Lo que agarre del ropero", "polo": "caos" }
  ],
  "estado": "listo"
}
```

`EJ-998` es de la reserva de `CTR-08.10` y no se carga nunca. Está escrito para pasar las
guardas de `banco.test.ts` —ocho palabras de enunciado, cinco por opción y menos de 28
caracteres, sin plata, sin género, sin la palabra del eje— así que sirve de molde. **El
ejemplo de la v1 (`EJ-999`, "Vas a un recital solo") ya no sirve de molde:** lleva género y
una entrada comprada, y `BR-36` veta las dos cosas.

| Campo | Tipo | Oblig. | Qué es |
|---|---|---|---|
| `momento` | `previa` · `ida` · `vereda` · `adentro` · `vuelta` | **sí, si `estado` es `listo`** | El momento de la noche de la escena. Un solo valor: el ítem vive en una sola celda |

El resto del ítem es el de `CTR-08.3`, sin cambios. Lo obligatorio lo hace cumplir un tercer
`if/then` en el `allOf` del ítem: si `estado` es `listo`, `momento` es `required`. **Los
retirados no lo necesitan y los borradores pueden no tenerlo todavía.** El schema no les
prohíbe tenerlo: prohibirlo obligaría a borrar el dato al retirar un ítem, y un retirado que
conserva su momento se entiende mejor dentro de dos meses.

**El piso: tres por celda.** Diez celdas —cinco momentos por dos ejes— con al menos tres
ítems `listo` cada una, treinta en total (`D-57` punto 4). Es un piso de conjunto y por eso
el schema no lo ve (v2.8): lo vigila `banco.test.ts`. **El motor exige uno por celda; los
tres son de `contenido`.** Uno alcanza para servir una noche válida; tres son para que tres
noches seguidas no repitan escena (`BR-37`), que es variedad y no validez. Por eso el motor no
tira con dos: una noche con dos escenas en una celda sigue siendo una noche entera.

### v2.4 — Los cuadrantes

Misma forma que `CTR-08.4`. Cambian dos techos:

| Campo | v1 | v2 | Por qué |
|---|---|---|---|
| `nombre` | 3–48, ≤ 8 palabras | **3–26**, ≤ 8 palabras | `UX-06` §7: el nombre tiene que leerse en la miniatura de la tarjeta. Los cuatro de `D-57` punto 5 miden 22, 26, 24 y 25 |
| `bajada` | 10–220 | **10–240** | Aire para "un placer y un costo" (`D-57` punto 5). Las 36 palabras de `UX-06` §7 las mide `banco.test.ts`; los 240 caracteres son el techo de forma |

```json
{
  "id": "CU-1",
  "luzOscuridad": "luz",
  "ordenCaos": "orden",
  "nombre": "Mesa larga a las nueve",
  "bajada": "(la bajada de CNT-30: un placer y un costo)",
  "estado": "listo"
}
```

El nombre es el que fijó `D-57`; la bajada es de relleno, porque la escribe `contenido`.

**Los ids y sus polos no se mueven:** `CU-1` luz + orden, `CU-2` luz + caos, `CU-3`
oscuridad + orden, `CU-4` oscuridad + caos. Es lo que viaja en los enlaces y en las postales
(`ADR-02`, enmienda del 2026-10-04). El schema no lo puede atar porque ve cada cuadrante
suelto; lo ata `banco.test.ts` ("cada CU-n conserva sus polos"). Que el nombre no tenga
persona gramatical (`D-57` punto 5) también lo mira ese test. Que los cuatro se digan con el
mismo orgullo no lo mira ninguna máquina: es `REV-19`.

### v2.5 — El motor

**`src/lib/dos-ejes/partida.ts`.** Funciones puras con el azar inyectado, por la razón de
`CTR-08.6`. Lo que el archivo ya tiene es lo que este contrato fija:

```ts
interface Item     { /* v1 */ readonly momento?: string }          // el schema lo acota a los cinco
interface Momento  { readonly id: string; readonly nombre: string; readonly canta: string }
interface Banco    { /* v1 */ readonly momentos: readonly Momento[] }
interface ItemServido { readonly id; readonly eje; readonly momento: string; readonly enunciado; readonly opciones }
type Relacion = 'misma' | 'luz-oscuridad' | 'orden-caos' | 'opuesta';

sortearPartida(banco, rnd = Math.random, vistos: ReadonlySet<string> = new Set()) -> ItemServido[]
resolverCuadrante(banco, elegidos)  -> Resultado                    // sin cambios
disposicion(banco, id)              -> { celdas: [Cuadrante ×4], renglones: [polo LO ×2], columnas: [polo OC ×2] }
relacion(banco, mio, suyo)          -> Relacion
```

#### `sortearPartida`, en orden

1. **Si `momentos.length !== preguntasPorEje`, tira `PartidaImposible`** con los dos números
   en el mensaje (v2.2).
2. Recorre `banco.momentos` **en el orden del dato**, que fija el schema. En cada momento,
   **sortea cuál de los dos ejes va primero**, y para cada eje:
   - la **celda** son los ítems `listo` de ese momento y ese eje;
   - **si la celda está vacía, tira `PartidaImposible`** nombrándola. Una noche con un momento
     cojo sirve cuatro de un eje y cinco del otro: es el empate entrando por la puerta de
     atrás;
   - de la celda se apartan los que **no** están en `vistos`; si queda alguno, se sortea entre
     esos; **si no queda ninguno, se sortea entre todos los de la celda**: se agotó, vuelve a
     empezar.
3. Baraja las dos opciones de cada ítem (`CTR-08.3`, sin cambios).
4. Devuelve `2 × momentos.length` ítems: los dos de la previa, los dos de la ida, y así.

Lo que esto garantiza, y que `partida.test.ts` ya afirma: **exactamente `momentos.length` por
eje**, que es impar; **ningún ítem repetido en la noche** (cada ítem vive en una sola celda);
**nunca tres seguidas del mismo eje** (la racha más larga posible es dos: el último de un
momento y el primero del siguiente); y **con `vistos` acumulado y tres por celda, tres noches
seguidas sin repetir escena**. El orden por momento reemplaza el `ABAB` fijo de la v1, que
dejaba adivinar el eje de las diez sabiendo el de la primera.

**`vistos` es de la isla y vive en memoria** (`D-57` punto 6, `BR-37`): la isla junta los ids
que sirvió en cada noche de la visita y se los pasa a la siguiente. El motor no guarda nada,
no modifica el conjunto, y con el mismo `rnd` y los mismos `vistos` devuelve la misma noche.
Si algún día se quiere recordar entre visitas, es una decisión de `producto` sobre `BR-37`, no
un cambio de este parámetro.

#### `resolverCuadrante`, sin cambios

Firma, algoritmo y retorno de `CTR-08.6`: tres strings, ningún número.

**Una observación que no cambia el contrato.** Si un eje empata, la función cae en silencio en
`oscuridad` o en `caos` (el `>` del conteo). Una noche bien servida no puede empatar. El
camino nuevo por el que podría es "Volvé a la anterior" (`D-57` punto 13): si la isla
**agregara** la elección corregida en vez de **reemplazar** la anterior, un eje quedaría con
seis. La isla de hoy hace lo correcto —`volverAnterior()` saca la última y `elegir()` pone la
nueva—, pero nada lo vigila. Propongo, sin exigirlo en esta versión, que `resolverCuadrante`
tire `PartidaImposible` ante un empate en vez de desempatar: es una línea, no rompe ningún test
de hoy, y convierte un sesgo silencioso en un error que se ve. Es lo que `CTR-08.5` regla 3 ya
decía: si aparece un desempate en el motor, es que algo se rompió antes.

#### `disposicion` — la grilla de dos por dos relativa (`D-57` punto 7)

`celdas` trae las cuatro maneras en el orden de la grilla, **siempre relativo a la tuya**:

| Posición | Cuál | Dónde va |
|---|---|---|
| 0 | la tuya | arriba a la izquierda |
| 1 | la que comparte tu polo de luz-oscuridad (y no el de orden-caos) | al lado: tu mismo renglón |
| 2 | la que comparte tu polo de orden-caos (y no el de luz-oscuridad) | abajo: tu misma columna |
| 3 | la opuesta | en diagonal |

`renglones` y `columnas` son los polos de los márgenes —el primero siempre el tuyo—, no las
maneras: dicen qué tienen en común, que es lo que la grilla cuenta. Con `CU-1` da `CU-1, CU-2,
CU-3, CU-4`; con `CU-4`, `CU-4, CU-3, CU-2, CU-1`. **Cada manera encabeza su propia grilla y
ninguna otra**, así que ninguna queda fija arriba para todos: lo que el rombo de la v1 no
lograba.

**Ningún número.** Las celdas son `Cuadrante` (strings) y los márgenes son polos (strings). No
hay distancia, ni porcentaje, ni "qué tan opuesta". La regla de `CTR-08.6` —lo que no está en
el tipo no se puede mostrar— se extiende a esta función.

#### `relacion` — el contraste de `CNT-29`

Dice **qué polo comparten** dos maneras: `misma`, `luz-oscuridad`, `orden-caos` u `opuesta`.
La isla la usa al terminar una noche que arrancó con un desafío, para elegir la línea de
`CNT-29`. Es **simétrica** —no hay dirección, así que no hay "le ganaste"— y **ningún valor
ordena a otro**.

**`disposicion` y `relacion` tienen que decir lo mismo, y hoy nada lo ata.** Se calculan por
caminos distintos: una busca por polos, la otra los compara. Las dos están bien, pero si una
cambia, la grilla y la línea de contraste se pueden contradecir en la misma pantalla. La
guarda es una línea en `partida.test.ts`: para cada `id` y cada `k`,
`relacion(banco, id, celdas[k].id)` vale `misma`, `luz-oscuridad`, `orden-caos` y `opuesta`
en ese orden.

**Las dos piden `banco`, no solo ids.** Los polos de cada cuadrante son dato de
`src/data/dos-ejes.json`; una tabla `CU-1 → luz + orden` escrita en el código sería la segunda
fuente de verdad que `.claude/rules/codigo-juegos.md` prohíbe. Con un id que no resuelve
tiran `PartidaImposible`: la isla solo las llama con ids ya resueltos contra el banco, y un id
suelto ahí es un defecto del llamador.

#### Alternativas descartadas (v2.5)

1. **Sortear cinco por eje del banco entero y después ponerles momento.** Es el sorteo de la v1
   con una etiqueta: dos escenas de la vuelta en la misma noche y ninguna de la previa.
2. **Un ítem con dos momentos posibles** (`"momento": ["ida", "vuelta"]`). Contaría para dos
   pisos y podría salir dos veces en una noche. Un ítem, una celda.
3. **Historial entre visitas en `localStorage`.** `D-57` punto 6 lo dejó en memoria; y con tres
   por celda la cuarta noche repite igual. No compra nada que las tres primeras no den.
4. **Rotación perfecta al agotarse una celda** (servir la escena que hace más que no sale).
   Exige que `vistos` sea una lista ordenada que la isla mantenga, para una diferencia que
   aparece en la quinta noche de una visita a un juego de dos minutos.
5. **Que `disposicion` devuelva la relación de cada celda adentro.** Es más explícito, y lo
   pensé primero. Lo descarto porque los márgenes ya nombran los polos compartidos, que es lo
   que se pinta, y porque la guarda de arriba ata las dos funciones sin duplicar el dato.
6. **Una `distancia` numérica (0, 1, 2) en vez de `relacion`.** Es un número, y el primer
   componente que lo reciba lo va a mostrar: "están a dos de distancia". `US-06` criterio 3.

### v2.6 — El taller de tarjetas

`D-57` puntos 8, 10 y 11. Como hay cuatro identidades y ninguna lleva un dato de la persona,
lo que se comparte se fabrica una vez, se guarda en el repo y queda fijo.

| | |
|---|---|
| Script | **`scripts/generar-dos-ejes.mjs`**, corrido con **`npm run generar-dos-ejes`** (`node --experimental-strip-types`, para importar los `.ts` de `src/lib/dos-ejes/`) |
| Dependencias | **`sharp` y `fontkitten` en `devDependencies`, con versión exacta** (`D-57`). Hoy están en el árbol solo de rebote: según `package-lock.json`, `sharp` 0.34.5 (Apache-2.0, instalado como `optional` de otro paquete) y `fontkitten` 1.0.3 (MIT). Un taller que depende de la instalación opcional de otro paquete deja de andar el día que ese paquete cambie de dependencias |
| Fuentes | `public/fuentes/oktubre-calco.woff` y **`scripts/fuentes/archivo-black.ttf`** (OFL, con su licencia al lado; `D-57`). El `.ttf` existe porque `fontkitten` no lee el `.woff2` que sirve el sitio (encabezado del taller) |
| Módulos | **`src/lib/dos-ejes/arte.ts`**: módulo hoja, sin imports. El máster, sus medidas, las cajas de recorte, lo prohibido y las rutas. Lo leen la isla, las páginas, el taller y el test. **`src/lib/dos-ejes/taller.ts`**: la huella. Usa `node:fs`, así que solo lo importan el taller y su test (`islas.test.ts` lo vigila) |
| Corre | **A mano, nunca en el build.** Las salidas se versionan, como las pasadas de `CTR-12` |

**Por qué a mano y no en el build:** `sharp` es un binario nativo, y meterlo en el build de
Vercel hace que el sitio no se publique el día que no instale, por nueve imágenes que cambian
una vez por ciclo. El riesgo que trae correrlo a mano —que el banco cambie y las tarjetas
no— lo caza el test de abajo, que es para lo que existe.

#### Las salidas

| Archivo | Medida | Techo | Para qué |
|---|---|---|---|
| `public/tarjetas/dos-ejes/cu-N.png` (×4) | **1080 × 1350** | **≤ 160 KB** c/u | El archivo de `navigator.share({ files })`. La isla lo baja al pintar el resultado |
| `public/tarjetas/dos-ejes/og-cu-N.png` (×4) | **1200 × 630** | **≤ 120 KB** c/u | `og:image` de cada postal |
| `public/tarjetas/dos-ejes/og-dos-ejes.png` | **1200 × 630** | **≤ 120 KB** | `og:image` de `/juegos/dos-ejes/` |
| `public/arte/dos-ejes/libro-*.{jpg,png}` (×3) | las de `PIEZAS`, achicadas y nunca agrandadas | **≤ 30 KB** c/u | La franja, el canto y el esquinero del libro (cuáles y dónde, `UX-36`) |

`N` es el id del cuadrante en minúscula. **Ninguna ruta se escribe a mano:** salen de
`arte.ts` (`slugDe`, `rutaDeTarjeta`, `rutaDeVistaPrevia`, `VISTA_PREVIA_JUEGO`,
`rutaDePieza`). El formato es libre mientras se cumplan medida y techo: hoy las tarjetas y las
vistas son PNG, y las piezas JPEG cuando no necesitan alfa. **WebP no**, para lo que sale del
sitio: lo abre una aplicación ajena y que todas lo lean no está verificado.

**De dónde salen los techos.** Los 160 KB de la tarjeta quedan por debajo de un fragmento de
audio (180 KB, `CTR-01.5`), que es la vara que el sitio ya usa para "lo que un teléfono paga
por una revelación"; y esta se baja sin que nadie la pida. Las piezas, 90 KB entre las tres,
son del orden de la estampa de una revelación de "Adiviná la tapa" (≤ 82 KB, `CTR-12`): la
portada del juego es la primera pantalla de una sesión de dos minutos. **Los 120 KB de la vista
previa son un techo nuestro, no un límite verificado de ninguna plataforma.** Qué peso y qué
formato aceptan los previsualizadores de WhatsApp, X y Telegram es un hecho externo que no
tengo y que queda pedido como ficha. Si una vista previa no aparece, es lo primero que hay que
mirar.

#### Las reglas del taller

1. **Lo que es de marca va en las letras reales, como trazo.** La marca y los títulos se
   dibujan con `fontkitten` desde las fuentes del repo y entran al SVG como `<path>`: no
   dependen de qué tenga instalado la máquina, y no cae la pila del sistema como voz de título
   (`diseno-marca.md`).
2. **El texto largo va en la sans del sistema**, por `librsvg`, que es lo mismo que hace
   `--fuente` en pantalla. **Consecuencia, y es la que ordena todo lo demás:** el PNG puede
   salir apenas distinto en otra máquina. Por eso el manifiesto guarda la huella de **lo que
   entra**, no la de los píxeles.
3. **Ningún hex en el script.** Los colores se leen por nombre de `src/styles/tokens.css`
   (`TOKENS_DEL_TALLER`); si un token falta o no es un hex, el taller tira.
4. **Piezas sueltas, nunca la tapa entera, y nunca el óvalo ni el título** (`D-57` punto 8,
   `RES-168`). Las cajas de recorte y las dos zonas prohibidas —el óvalo con la figura y la
   palabra LUZBELITO— están en `arte.ts`, medidas una vez sobre el máster. El taller tira si
   una caja toca una zona prohibida o se sale del máster, y el test lo vuelve a mirar. Es la
   parte de `RES-168` que una máquina puede ver; que una pieza no recomponga la tapa lo ve
   `revisor`.
5. **Ninguna pieza se asigna a un cuadrante** (`D-57` punto 8). Lo garantiza la forma: `PIEZAS`
   no tiene una entrada por cuadrante, así que las cuatro tarjetas usan las mismas.
6. **El crédito viaja con la imagen** (`D-21`, condición 1). La tarjeta sale del sitio como
   archivo, sin pie y sin `alt`: **lleva el crédito pintado** (`TARJETA.credito`). La vista
   previa lo lleva en `og:image:alt`, por la prop `imagenAlt` de `Cabeza.astro` (`ADR-02`,
   enmienda).
7. **La tijera corta igual cada vez:** el borde se dibuja con azar de semilla fija. Una pieza
   que cambia de borde en cada corrida ensucia el repo sin que nada haya cambiado.

**Recomendado, no exigido en esta versión:** que el taller tire si a una fuente le falta un
glifo. Hoy Oktubre Calco solo escribe "ARCADE RICOTERO", que entra en sus once letras; el
riesgo aparece el día que alguien le pase un texto con tilde y la fuente devuelva el glifo
vacío sin quejarse. Es una línea en la función que traza.

#### El manifiesto: `scripts/dos-ejes-manifiesto.json`

Fuera de `public/` para que no se sirva, como el de `CTR-12`. Lo escribe el taller. Tres
campos que importan:

- **`huella`**: un sha256 de todo lo que entra al dibujo —los cuatro cuadrantes (id, polos,
  nombre y bajada), los textos fijos de `copy.ts` que se pintan, los colores, las cajas, las
  zonas prohibidas, el máster, las dos fuentes y `VERSION_DEL_DIBUJO`—, calculado por
  `huellaDelTaller()` en `taller.ts`;
- **`salidas`**: la lista de archivos que escribió;
- **`version`**: la del dibujo.

**`VERSION_DEL_DIBUJO` se sube a mano cuando cambia la composición** (un margen, un cuerpo,
dónde va el libro). Eso no está en ningún dato, y es el único cambio que la huella no ve sola.
Queda aceptado: es el mismo acuerdo de palabra que cualquier cambio de diseño, y lo ve el ojo
de quien revisa la tarjeta.

#### El test: `src/lib/dos-ejes/tarjetas.test.ts`

**No corre el taller:** recalcula la huella de las entradas de hoy y la compara con la del
manifiesto. Por eso no importa que `sharp` y `librsvg` no den los mismos píxeles en dos
máquinas, y por eso el test corre donde `sharp` no instala. Hoy falla si:

1. falta el manifiesto, o **la huella no coincide**: cambió un nombre, una bajada, un texto
   fijo, un color, una caja, el máster o una fuente, y las tarjetas quedaron viejas. El mensaje
   dice qué correr. **Es el defecto que todo esto existe para cazar:** `contenido` cambia un
   nombre en el JSON, la postal lo dice nuevo en `og:title` y la imagen lo sigue mostrando
   viejo;
2. la lista de `salidas` no es exactamente la esperada (tres piezas, y tarjeta y vista por cada
   cuadrante del banco, más la del juego), o falta un archivo;
3. una tarjeta o una vista no mide lo que dice la tabla (leído de la cabecera del PNG, sin
   dependencias);
4. un archivo pasa su techo;
5. una caja de recorte toca el óvalo o el título, se sale del máster, o se agranda; con su caso
   en rojo, que prueba que la guarda sabe ver.

**Dos agujeros que quedan, dichos para que sean decisión y no descuido:**

- **Un archivo de salida editado a mano no se caza.** La huella es de la entrada. Cerrarlo
  costaría guardar también un hash de cada salida y compararlo con el disco —que no depende de
  la máquina, porque compara lo que está con lo que la misma corrida anotó—. Recomendado, no
  exigido: hoy nadie tiene motivo para retocar un PNG generado.
- **Un archivo de más en las dos carpetas tampoco**: el test mira la lista del manifiesto, no
  el contenido de la carpeta. Un huérfano se serviría sin que nadie lo pida. Es un
  `readdirSync` y una comparación. Recomendado.

#### Qué ve la gente si una imagen no carga

- **La tarjeta no bajó** (sin red, o tardó): el resultado no la espera nunca. "Compartí" manda
  el enlace a la postal sin archivo —que trae su vista previa igual—, y si no hay
  `navigator.share`, el camino de siempre de `src/scripts/compartir.ts`. Nada se rompe y nada
  avisa con un error.
- **Una pieza del libro no cargó:** la pantalla queda en papel y tinta con el texto entero.
  Ninguna pieza lleva información que no esté también escrita.
- **El previsualizador no levantó la vista:** el enlace llega con `og:title` y
  `og:description`, que nombran la manera. Es lo que pasaba hasta hoy con todos los juegos.

#### Alternativas descartadas (v2.6)

1. **Generar las tarjetas en el build.** Ver arriba: el sitio dejaría de publicarse por un
   binario nativo, para nueve archivos casi fijos.
2. **Dibujarlas en canvas, en el teléfono.** `D-57` ya la descartó: pierde el gesto en Safari
   y un previsualizador no le puede pedir una imagen a un canvas.
3. **Hashear las salidas en vez de las entradas.** Con el texto largo en la sans del sistema,
   el mismo taller corrido en dos máquinas daría dos hashes, y el test fallaría por la máquina
   y no por el dato.
4. **Todo el texto como trazo, también el largo.** Haría las salidas reproducibles y le
   sacaría a la tarjeta la letra que el sitio usa para leer. `--fuente` es la pila del sistema
   a propósito (`UX-01`).
5. **Una pieza del libro por cuadrante.** `D-57` la descartó: siempre hay una más linda.

### v2.7 — El bloque normativo

**Manda `src/data/_schema/dos-ejes.schema.json`, y esta versión no lo pega.** La v1 lo pegó
entero porque el archivo no existía (`CTR-08.7`). Hoy existe, `esquemas.test.ts` lo corre en
cada build, y una copia acá sería una segunda fuente de verdad que se desincroniza la primera
vez. Lo que la v2 le cambió a la v1, entero:

- `$id` termina en `/2`; `contratoVersion` es `const: 2`; `required` suma `momentos`.
- `momentos`: arreglo de 5 (`minItems` y `maxItems`), `prefixItems` con un `$ref` a
  `#/$defs/momento` y un `const` de id por posición —`previa`, `ida`, `vereda`, `adentro`,
  `vuelta`—, e `items: false`.
- `$defs/momento`: `additionalProperties: false`; `required` `id`, `nombre`, `canta`; `id`
  con el `enum` de los cinco; `nombre` 2–24 y `canta` 6–80, los dos con el `not` de Bulacio,
  Olavarría y Cromañón.
- `$defs/cuadrante`: `nombre.maxLength` 26 (era 48); `bajada.maxLength` 240 (era 220).
- `$defs/item`: `momento` con el `enum` de los cinco, fuera de `required`; un tercer elemento
  en `allOf`: si `estado` es `listo`, entonces `required: ["momento"]`.

Vale la advertencia de `CTR-08.7`, ahora con una palabra más: `prefixItems`, como
`minContains` y `maxContains`, es de draft 2020-12. Con un `$schema` anterior, ajv lo ignora y
el orden de la noche deja de aplicarse **en silencio**. Un `$ref` con propiedades hermanas
también es válido recién desde 2019-09.

### v2.8 — Lo que el schema sigue sin poder ver

Los siete de `CTR-08.8`, con el punto 2 al día —el piso es de 30 listos y tres por celda,
no de 20 y diez por eje—, y tres más:

8. **`momentos.length === preguntasPorEje`** (v2.2) → `banco.test.ts`, y el motor en tiempo de
   ejecución.
9. **Que el `momento` de un ítem esté entre los `momentos` del archivo** → `banco.test.ts`. Hoy
   el `enum` lo cubre; deja de cubrirlo el día que los momentos dejen de ser cinco fijos.
10. **Que un `CU-n` conserve sus polos entre una versión del banco y la siguiente** →
    `banco.test.ts`.

Y lo que no ve ninguna máquina, que es de `REV-19`: que una opción no sea "más de adentro" que
la otra (`BR-36`), que las cuatro maneras se digan con el mismo orgullo, y que una escena no
sea una cuestión de seguridad disfrazada de temperamento.

### v2.9 — Verificación: qué correr, y quién

`arquitectura` no ejecuta (`D-12`). Lo corre el hilo principal al integrar, o `revisor` en
`REV-19`.

```bash
# (1) Forma: el banco contra el schema v2. Más los rojos de la tabla de abajo, cuando entren.
node --test src/lib/esquemas.test.ts

# (2) Conjunto: la noche en orden, momentos === preguntasPorEje, tres por celda, los vetos
#     de BR-36, los techos de UX-06 §7 y los polos de cada CU-n.
node --test src/lib/dos-ejes/banco.test.ts

# (3) Motor: la noche por momentos, vistos, resolverCuadrante, disposicion y relacion.
node --test src/lib/dos-ejes/partida.test.ts

# (4) Taller: la huella al día, las salidas completas, medidas, techos y lo prohibido.
node --test src/lib/dos-ejes/tarjetas.test.ts

# (5) La enumeración de CTR-08.9 (2) sigue corriendo sin cambios sobre un banco v2: no mira
#     los momentos, y "0 empates, 4 cuadrantes alcanzables" no depende de ellos. Sus avisos de
#     piso (20 y 10) son de la v1; el piso que manda es el de (2).
```

**Mientras `src/data/dos-ejes.json` siga en v1, (1) y (2) dan rojo, y es lo esperado:** el
schema v2 y `banco.test.ts` llegaron antes que el banco, a propósito (`D-57` punto 2: las
guardas se escriben antes). Se ponen en verde cuando `contenido` entrega `CNT-30`.

**Los rojos que le faltan a `esquemas.test.ts`.** El schema de este juego nunca se vio en
rojo: la v1 entró sin un solo caso, y una guarda que nunca se vio en rojo no es una guarda
(encabezado de ese archivo). Cada caso sale del banco de verdad tocado en **un solo campo**, y
el schema lo tiene que rechazar **señalando ese lugar**; con el control en verde al lado. Los
de la v1 van también, porque nunca se probaron.

| # | Caso | Lugar que tiene que señalar |
|---|---|---|
| e1 | un ítem `listo` sin `momento` | `/items/N` |
| e2 | un `momento` que la noche no tiene (`"viaje"`) | `/items/N/momento` |
| e3 | cuatro momentos | `/momentos` |
| e4 | la ida antes que la previa | `/momentos/0/id` |
| e5 | un momento con una clave de más | `/momentos/N` |
| e6 | un nombre de cuadrante de 27 caracteres | `/cuadrantes/N/nombre` |
| e7 | una bajada de 241 caracteres | `/cuadrantes/N/bajada` |
| e8 | `contratoVersion: 1` | `/contratoVersion` |
| e9 | un ítem de luz-oscuridad con una opción `caos` (regla 1) | `/items/N/opciones` |
| e10 | `correcta: true` en una opción (regla 4) | `/items/N/opciones/0` |
| e11 | `preguntasPorEje: 6` (regla 3) | `/preguntasPorEje` |
| verde | un ítem `retirado` sin `momento`, y uno en `borrador` sin `momento` | — |

**Lo que le falta a `partida.test.ts`:** la guarda que ata `disposicion` con `relacion`
(v2.5). Lo demás de v2.5 ya está.

**Lo que le falta a `tarjetas.test.ts`:** nada exigido. Los dos agujeros de v2.6 quedan
recomendados.

| # | Chequeo | Quién |
|---|---|---|
| 1 | Un ítem mueve un solo eje; dos polos opuestos; ninguna clave de más | (1), y en rojo cuando entren e9–e10 |
| 2 | `preguntasPorEje` impar | (1) |
| 3 | La noche en orden, sin momentos repetidos | (1) y (2) |
| 4 | Todo ítem listo tiene momento | (1) y (2) |
| 5 | `momentos.length === preguntasPorEje` | (2) y el motor |
| 6 | Tres por celda, treinta listos | (2) |
| 7 | Un ítem de cada eje por momento, impar por eje, sin repetir, otra noche sin repetir | (3) |
| 8 | El resultado, la grilla y la relación sin números | (3) y los tipos |
| 9 | Empate imposible y cuatro cuadrantes alcanzables, por enumeración | (5) |
| 10 | Las tarjetas dicen lo que dice el banco hoy | (4) |
| 11 | Ningún recorte toca el óvalo ni el título | (4) y el taller |
| 12 | Que una opción no sea "más de adentro"; que las cuatro maneras pesen igual | `REV-19` |

### v2.10 — Consecuencias

- **Fácil, y es lo que destraba `CNT-30`:** el schema ya está bajado, así que el banco valida
  o no en el momento en que se escribe.
- **Fácil:** que la segunda noche no repita la primera. Es un parámetro con valor por omisión;
  la isla que no lo pasa sigue andando como antes.
- **Difícil, a propósito:** que un ítem caiga en dos celdas, que la grilla traiga una
  distancia, que la relación ordene. Las tres cosas serían cambiar el contrato.
- **Difícil, y es nuevo:** cambiar la cantidad de preguntas (v2.2).
- **Lo que le impone a `contenido` (`CNT-30`):** la forma de v2.2 a v2.4. Y una que no es de
  forma: **cada vez que cambia un nombre, una bajada o un texto que la tarjeta pinta, hay que
  correr el taller** (`contenido` no puede, `D-12`: lo deja dicho y lo corre el hilo). El test
  lo recuerda.
- **Lo que le impone a `experiencia` (`UX-36`):** `ItemServido` trae `momento`, y el sello y
  la línea que canta se buscan en `banco.momentos`; la grilla recibe celdas y márgenes, nunca
  un número.
- **Lo que falta del hilo principal, para que esta versión quede entera:**
  1. `sharp` y `fontkitten` a `devDependencies` con versión exacta, y el script
     `generar-dos-ejes` en `package.json`. Hoy no están, y el comando que el taller dice en su
     encabezado no existe;
  2. los rojos e1–e11 en `esquemas.test.ts`;
  3. la guarda `disposicion`/`relacion` en `partida.test.ts`;
  4. las postales y la prop nueva de `Cabeza.astro` (`ADR-02`, enmienda del 2026-10-04).
- **Pendiente sin bloquear:** la ficha sobre lo que aceptan los previsualizadores (peso y
  formato de `og:image`). Si dice menos de 120 KB, baja el techo de la vista; nada más cambia.

### Qué NO decide la v2

- **El texto** de los momentos, los ítems, los nombres y las bajadas: `contenido` (`CNT-30`).
- **Qué piezas, dónde y cómo se componen** la portada, la hoja y la tarjeta: `experiencia`
  (`UX-36`).
- **Si la visita recuerda entre visitas:** `producto` (`BR-37`).
- **La línea de cada uno de los cuatro contrastes:** `contenido` (`CNT-29`).

---

## CTR-08 v1 — Contrato de `src/data/dos-ejes.json`

> **[2026-10-04: reemplazada en parte por la v2, arriba.]** Sigue valiendo en todo lo que la
> tabla de v2.1 marca como "sigue". Se conserva sin reescribir, salvo dos correcciones
> anotadas en su lugar (`CTR-08.4` y `CTR-08.9`).

- **Fecha:** 2026-08-24
- **Estado:** **vigente, sin valores abiertos.** Todo lo que este contrato necesitaba de
  `producto` ya está en `US-06` y `BR-17`: los dos ejes, el piso de 20, las 5 por eje y
  las 2 opciones por pregunta. No espera ninguna ficha `RES-XX`: el banco no afirma nada
  sobre la banda, así que no hay hecho externo que verificar (`CTR-08.5`, regla 5).
- **Para quién es esto:** para `contenido`, que en `T-121` carga el banco y los cuatro
  cuadrantes; para el hilo principal, que en `T-123` construye el juego; y para `revisor`,
  que en `T-124` tiene que poder rechazar un ítem sin preguntarle nada a nadie.
- **Qué NO es:** no es una variante de `CTR-02`. El banco del quiz tiene una respuesta
  correcta y este no puede tenerla. Copiar la forma de `CTR-02` es el modo más rápido de
  romper `BR-17`, y por eso la sección `CTR-08.5` empieza por lo que se sacó.

`US-06` dejó explícitamente en manos de `arquitectura` una sola cosa además del schema:
**el mecanismo de sorteo de las 5 de 10 por eje.** Está en `CTR-08.6`, porque el sorteo es
la mitad de la garantía de que no haya empate: el conteo impar no sirve de nada si el
motor puede servir una partida corta cuando el banco no alcanza.

---

### CTR-08.1 — El archivo

| | |
|---|---|
| Ruta del dato | **`src/data/dos-ejes.json`** |
| Ruta del schema | **`src/data/_schema/dos-ejes.schema.json`** |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Versionado | Git, más el par `contrato` / `contratoVersion` adentro del archivo |
| Presupuesto de tamaño | **≤ 40 KB sin comprimir** |

**Los dos nombres importan y no son libres.** `src/lib/esquemas.test.ts` empareja dato y
schema por nombre de archivo: recorre un arreglo de nombres y abre `src/data/<n>.json`
contra `src/data/_schema/<n>.schema.json`. Con estas dos rutas, sumar el banco a la
verificación es agregar `'dos-ejes'` a ese arreglo (hoy `['quiz', 'letra', 'tapa',
'cancionero']`, línea 44). Cualquier otro par de nombres obliga a escribir un caso aparte.

**Presupuesto:** 20 ítems de ~230 bytes más cuatro cuadrantes son unos **5 KB**. El techo
de 40 KB está para que nadie descubra el problema con el archivo ya armado; si el banco
creciera a 200 ítems seguiría entrando holgado.

**La isla de este juego no importa nada del motor de audio (`CTR-01`) ni del buscador de
`CTR-03`.** Es texto y dos botones. El que entra al test no tiene por qué descargar un
decodificador ni un índice de 105 títulos.

---

### CTR-08.2 — Envoltorio

> **[AMPLIADO por v2.2, 2026-10-04]:** suma `momentos`, y `contratoVersion` pasa a 2. El
> último párrafo de esta sección ("el motor lee este número") sigue valiendo; lo que dejó de
> valer es que cambiar `preguntasPorEje` sea tocar un solo número.

```json
{
  "contrato": "CTR-08",
  "contratoVersion": 1,
  "juego": "dos-ejes",
  "actualizado": "2026-08-24",
  "preguntasPorEje": 5,
  "cuadrantes": [ ... ],
  "items": [ ... ]
}
```

`contrato` y `contratoVersion` van adentro del dato por el mismo motivo que en `CTR-02`:
dentro de dos meses, mirando solo el JSON, se tiene que poder saber contra qué documento
validarlo.

**`preguntasPorEje` es el campo que hace verificable a `BR-17` regla 3, y por eso vive en
el dato y no en el código.** El schema lo declara entero, impar y entre 3 y 9:

```json
"preguntasPorEje": { "type": "integer", "minimum": 3, "maximum": 9, "not": { "multipleOf": 2 } }
```

`not: { multipleOf: 2 }` es "impar" escrito en JSON Schema. Con eso, **el comando que
valida el archivo contra el schema ya demuestra que ninguna partida puede empatar**: no
hace falta leer `BR-17` ni confiar en que el motor puso un 5. Si alguien alguna vez lo
mueve a 6 porque "diez preguntas son muchas", el archivo deja de validar en el acto.

**El motor lee este número, no lo repite.** Un `const POR_EJE = 5` en TypeScript al lado
de un `5` en el JSON son dos fuentes de verdad que se desincronizan la primera vez que
alguien toca una sola. La regla de `.claude/rules/codigo-juegos.md` ("nada de datos
hardcodeados") se aplica también a esto.

---

### CTR-08.3 — El ítem

> **[AMPLIADO por v2.3, 2026-10-04]:** suma `momento`, obligatorio si el ítem está `listo`. El
> ejemplo de abajo ya no sirve de molde: "solo" le pone género a quien juega y "la entrada
> sacada" pide plata, y `BR-36` veta las dos cosas. El molde vigente es `EJ-998`, en v2.3.

El ID de ejemplo es `EJ-999`, reservado en `CTR-08.10` y que nunca se carga en el banco.

```json
{
  "id": "EJ-999",
  "us": ["US-06"],
  "eje": "orden-caos",
  "enunciado": "Vas a un recital solo. ¿Cómo llegás?",
  "opciones": [
    { "texto": "Con la entrada sacada hace un mes y el bondi averiguado", "polo": "orden" },
    { "texto": "Sin entrada, ya voy a ver cómo entro", "polo": "caos" }
  ],
  "estado": "listo"
}
```

| Campo | Tipo | Oblig. | Qué es y por qué |
|---|---|---|---|
| `id` | `EJ-NNN` | sí | Ver `CTR-08.10`. No se reutiliza nunca. |
| `us` | array de `US-NN` | sí | Hoy siempre `["US-06"]`. Un ítem que no traza a un requisito es contenido que nadie pidió (`Docs/IDS.md`). |
| `eje` | enum | sí | `luz-oscuridad` · `orden-caos`. **Uno solo, y es la clave de todo el contrato** (`CTR-08.5`, regla 1). |
| `enunciado` | string, 10–120 | sí | La situación que se plantea. Techo bajo a propósito: ver abajo. |
| `opciones` | array de exactamente **2** | sí | Una por extremo del eje. Ver abajo. |
| `estado` | enum | sí | `borrador` · `listo` · `retirado`. El piso se cuenta sobre `listo`. |
| `notaInterna` | string | no | Para el equipo. **Nunca se renderiza.** |

**Y eso es todo. El ítem es `additionalProperties: false`, así que no hay dónde escribir
`correcta`, ni `dificultad`, ni `peso`, ni `explicacion`, ni `fuentes`.** No es un olvido
ni una lista que se completa después: es la sección `CTR-08.5`.

**Opciones.** Cada una es `{ "texto": string 2–72, "polo": enum }`. Exactamente dos, con
polos distintos y los dos del eje del ítem — el schema lo valida, no es un acuerdo de
palabra.

- **El motor baraja las dos opciones. El orden del JSON no significa nada.** Está escrito
  por una razón concreta: si `luz` cayera siempre primera, el que toca siempre el botón de
  arriba caería siempre en el mismo cuadrante, y el resultado dejaría de decir algo sobre
  él. Es la misma lección que `CTR-02` aprendió con `correcta`, aplicada a `polo`.
- **`polo` viaja adentro de la opción**, no como un índice ni como un orden implícito
  (`opciones[0]` = extremo A). Alternativa descartada por lo mismo de siempre: el día que
  alguien reordene las dos opciones para que se lean mejor, el índice apunta al polo
  equivocado y el error es silencioso — el juego sigue andando y devuelve otra identidad.

**Los techos de largo salen de la pantalla, no del gusto.** Enunciado ≤ 120 y opción ≤ 72
entran, en un celular de 360 px de ancho, como tres líneas y dos bloques de dos líneas,
dejando la zona pulgar libre para los dos destinos grandes. Son más holgados que los 60
caracteres de `CTR-02` porque acá hay dos opciones y no cuatro; una elección de
temperamento necesita más aire que un distractor.

---

### CTR-08.4 — Los cuatro cuadrantes

> **[AMPLIADO por v2.4, 2026-10-04]:** `nombre` baja a 26 caracteres y `bajada` sube a 240.
> **El ejemplo que estaba acá se sacó el mismo día:** proponía un nombre de cuadrante con
> persona gramatical ("El que…"), que es justo lo que `D-57` punto 5 descarta, y desde un
> contrato un ejemplo se lee como sugerencia. El ejemplo vigente está en v2.4.

Viven en el mismo archivo que los ítems, porque son la otra mitad del banco: sin los
cuatro nombres, el juego no tiene qué devolver.

| Campo | Tipo | Oblig. | Qué es y por qué |
|---|---|---|---|
| `id` | `CU-1`..`CU-4` | sí | Es lo que viaja en el link compartido (`CTR-08.7`, nota sobre `ADR-02`). |
| `luzOscuridad` | enum | sí | `luz` · `oscuridad`. La coordenada del cuadrante en el primer eje. |
| `ordenCaos` | enum | sí | `orden` · `caos`. La coordenada en el segundo. |
| `nombre` | string, 3–48, **máximo 8 palabras** | sí | Registro 1 de `.claude/rules/voz-ricotera.md`. El techo de 8 palabras lo hace cumplir el patrón `^\S+( \S+){0,7}$`, no la buena voluntad. |
| `bajada` | string, 10–220 | sí | Registro 2. Es lo que hace que el resultado sea una identidad y no una etiqueta suelta. |
| `estado` | enum | sí | `borrador` · `listo`. Los cuatro tienen que estar `listo` para que el juego se pueda jugar. |

**Son cuatro, ni tres ni cinco.** `minItems: 4` y `maxItems: 4`. El quinto resultado
"neutro" que `BR-17` prohíbe no tiene dónde escribirse, y las cuatro combinaciones de
coordenadas se verifican en `CTR-08.9`.

**El schema rechaza un puñado de palabras en `nombre`:** `más`, `menos`, `mejor`, `peor`,
`nivel`, `ranking`, `top`, `verdadero`, `superior`, `inferior`. Es el piso mecánico del
criterio 3 de `US-06` — ningún cuadrante se presenta como el bueno. Es un piso y no una
garantía: un nombre puede jerarquizar sin usar ninguna de esas palabras, y eso lo caza
`revisor`. La lista es corta a propósito; ampliarla es aditivo y cuesta una línea.

**No hay campo de "intensidad", ni de porcentaje, ni de conteo.** `US-06` descartó los
grados dentro del cuadrante y este contrato no los deja volver por la puerta del dato.

---

### CTR-08.5 — Las cinco reglas que el schema hace cumplir solo

**Regla 1 — un ítem mueve un solo eje, y no por promesa.**

Es la regla más fácil de romper por descuido al cargar el banco y la que más caro sale: un
ítem que empuja los dos ejes hace que el resultado deje de ser reproducible y, peor, le
saca al jugador la posibilidad de tener una postura distinta en cada eje, que es lo que
hace que haya cuatro cuadrantes y no dos (`BR-17`, regla 1).

La hace cumplir la **forma**, no una validación agregada encima:

1. El eje se declara **una vez, en el ítem**, con un enum de dos valores. No hay manera de
   escribir dos.
2. El polo se declara **en la opción**, y el schema lo **estrecha según el eje del ítem**
   con una rama `if/then`: si `eje` es `luz-oscuridad`, los polos admitidos son `luz` y
   `oscuridad`; si es `orden-caos`, son `orden` y `caos`. Un ítem con una opción `luz` y
   otra `caos` **no valida**.

**Regla 2 — dos opciones, una por extremo puro.**

`BR-17` regla 2 pide que las dos opciones sean los extremos y no matices. El schema lo
exige con dos `contains` de `minContains: 1` y `maxContains: 1` dentro de la misma rama:
uno por cada polo del eje. Dos opciones del mismo polo **no validan**; una opción sin polo
tampoco.

Esta regla es la que sostiene la invariante 3 de `CTR-08.9`, y conviene ver por qué: si
**todo** ítem de un eje ofrece los dos extremos, entonces cualquier cantidad de respuestas
hacia un lado —de 0 a `preguntasPorEje`— es alcanzable, y por lo tanto los cuatro
cuadrantes lo son. La reachability no se argumenta: se deduce de esta regla más el barrido
del comando.

**Regla 3 — el conteo impar vive en el dato.**

Ya está en `CTR-08.2`. Lo que agrega esta sección es la consecuencia: **el empate es
imposible por aritmética, no por una rama del código que lo desempate.** Con
`preguntasPorEje` impar y cada respuesta valiendo exactamente uno para exactamente un eje,
ningún eje puede terminar mitad y mitad. Si alguna vez aparece una función
`desempatar()` en el motor, es la señal de que alguna de las tres reglas anteriores se
rompió.

**Regla 4 — ninguna opción es la correcta, y no hay dónde escribir que lo sea.**

En un test de identidad no hay respuesta correcta. `CTR-02` tiene `correcta: true` en cada
opción y **esa forma no se copia acá**: si el banco tuviera una respuesta correcta, el
test pasaría a medir cuánto sabés, que es lo único que `BR-17` prohíbe y lo que en `D-14`
se llama cerrar el molinete.

Cómo se hace cumplir: `additionalProperties: false` en el ítem y en la opción. `correcta`,
`dificultad`, `peso`, `puntos`, `explicacion` y `fuentes` no fallan por estar prohibidos
en una lista negra —una lista negra siempre se queda corta— sino porque **no hay ninguna
clave admitida fuera de las declaradas**. El mensaje de ajv para ese caso es genérico
("must NOT have additional properties"), así que el comando de `CTR-08.9` mira aparte esas
seis claves y las nombra: es la diferencia entre que `contenido` entienda el rechazo en
diez segundos o en diez minutos.

**Sobre `dificultad` en particular:** `US-06` dice que `BR-01` no aplica, y este contrato
lo toma al pie de la letra. No hay campo, ni opcional, ni con default. Un campo opcional
de dificultad sería la puerta de entrada exacta al defecto que `BR-17` prohíbe: alguien lo
llena, alguien lo usa para ordenar la partida, y el test empieza a medir nivel sin que
nadie haya decidido que lo haga.

**Regla 5 — acá no hay `hecho` / `leyenda` / `testimonio`, y no se agregan después "por
consistencia".**

Lo dejo escrito con nombre y motivo, porque es el campo que alguien va a querer sumar
mirando `CTR-02` de reojo.

El rotulado de `D-14` clasifica **el origen de una afirmación**. Un ítem de este banco no
afirma nada sobre la banda: le ofrece al jugador dos maneras de contestar sobre sí mismo.
Donde no hay afirmación, las tres casillas no tienen qué clasificar, y una casilla que no
clasifica nada es exactamente el campo que se llena por inercia — el riesgo que `CTR-02.4`
regla 3 se pasó media sección tratando de evitar. Un `esLeyenda: false` en veinte ítems
que no afirman nada no agrega verdad: le saca peso al mismo campo cuando aparece en el
quiz, donde sí decide algo.

**La regla práctica, y es la que hay que recordar:** *si un ítem necesita una ficha
`RES-XX` para ser honesto, no es un ítem de este banco — es una pregunta del quiz mal
ubicada.* El schema la hace cumplir sola: no hay campo `fuentes`, así que el ítem que lo
necesitaría no valida.

Dos corolarios que no son teóricos:

- **El enunciado no puede presuponer un hecho discutido.** "Después de que se separaron en
  el 2001, ¿vos qué hubieras hecho?" afirma una fecha adentro de una pregunta de
  temperamento, y no tiene dónde citarla. Se reescribe sin el dato. Esto el schema **no**
  lo ve; lo ve `revisor`.
- **El banco no cita letras.** No hay campo para declarar material de terceros —no existe
  `sensibleA` acá— y eso es la decisión, no un olvido: si una opción necesita un verso para
  funcionar, es un ítem de `US-03`. Mencionar el **título** de un tema está bien y no es
  material sensible; pegar el verso, no. Si `contenido` cree que hace falta, sale como
  revisión aditiva de este contrato, no como un campo improvisado en un lote.

**Y un límite duro que sí está en el schema:** `enunciado` y `texto` no pueden contener
`Bulacio`, `Olavarría` ni `Cromañón`. Son los lugares donde el sitio se saca la voz
(registro 3, `.claude/rules/voz-ricotera.md` §6, `CNT-04` y `CNT-06`), y una pregunta de
temperamento del tipo "¿vos qué hubieras hecho?" sobre un pibe muerto por la policía no
tiene forma de estar bien escrita. Tres nombres propios, sin ambigüedad posible.

**Lo que deliberadamente NO está en el schema es la muerte del Indio**, que es el tercer
tema de esa lista. Un patrón sobre `muerte`, `murió` o `falleció` reventaría el polo
`oscuridad` entero: la mitad de ese eje vive de imágenes duras, y prohibir la palabra
sería prohibir el eje. Va como señal para leer con los ojos, en el comando de `CTR-08.9`.

#### Alternativas descartadas

Seis, y las seis se pueden retomar sabiendo lo que cuestan.

1. **`efectos: [{ eje, polo }]`, un arreglo por ítem.** Es la forma flexible y natural, y
   es **exactamente la que permite mover dos ejes**. Con `maxItems: 1` daría el mismo
   resultado que el campo `eje`, a cambio de una estructura que invita a subir el tope el
   día que alguien quiera "una pregunta que valga doble". Descartada: la forma tiene que
   hacer imposible lo prohibido, no difícil.
2. **Un vector de pesos por opción: `{ "luzOscuridad": -1, "ordenCaos": 0 }`.** Descartada
   dos veces. Primero porque el cero es el valor por omisión y "mueve los dos ejes" queda a
   un tipeo de distancia. Segundo porque los pesos reintroducen los grados que `US-06`
   descartó: con un −2 y un −1 aparece "bastante caótico", y con él la jerarquía.
3. **No declarar `eje` en el ítem y deducirlo de los polos de las opciones.** Es menos
   redundante y es peor: contar ítems por eje pasa a exigir un barrido de opciones, la rama
   `if/then` que estrecha los polos desaparece, y una contradicción entre lo que el ítem
   dice ser y lo que sus opciones hacen deja de existir como error detectable. La
   redundancia acá es el mecanismo, no un descuido.
4. **Reusar `CTR-02` con `correcta: false` en las cuatro opciones.** Se escribió y se tiró:
   `maxContains: 1` sobre `correcta: true` pasaría a `minContains: 0`, y el banco quedaría
   a un tilde de tener una respuesta correcta. Un campo booleano que siempre vale `false`
   es una invitación.
5. **Guardar el resultado como dos números (`-3`, `+1`) en vez de dos polos.** Tentador
   para el link compartido, y descartado porque un número es un puntaje disfrazado: la
   primera pantalla que lo reciba lo va a mostrar, y el criterio 3 de `US-06` dice que el
   conteo no se muestra. Ver `CTR-08.6`.
6. **Cuadrantes en un archivo aparte (`src/data/cuadrantes.json`).** Descartada porque la
   invariante que más importa —que las cuatro combinaciones estén cubiertas y sean
   alcanzables— cruza ítems con cuadrantes, y partirla en dos archivos convierte una
   consulta de una línea en un cruce con dos rutas que se pueden desincronizar. Son 4
   objetos: no justifican un archivo.

---

### CTR-08.6 — El sorteo y la resolución, que es lo que `US-06` me dejó a mí

> **[REEMPLAZADO por v2.5, 2026-10-04]:** el sorteo recorre los cinco momentos y deja de
> intercalar `ABAB`; suma `vistos` (en memoria, no en `localStorage`), `disposicion` y
> `relacion`. `resolverCuadrante` y su retorno sin números quedan como están acá.

Esto no es dato: es lo que el motor tiene que hacer, y el contrato lo fija porque de acá
depende que el empate siga siendo imposible en tiempo de ejecución.

**Dos funciones puras, en `src/lib/dos-ejes/`.** Puras porque si no, no hay test.

```
sortearPartida(banco, rnd = Math.random) -> ItemServido[]
resolverCuadrante(banco, polosElegidos)  -> { id, nombre, bajada }
```

**`sortearPartida`, en orden:**

1. Arma un pozo por eje con los ítems de `estado: "listo"` de ese eje.
2. **Si algún pozo tiene menos de `preguntasPorEje`, tira error y no devuelve partida.**
   No sirve una partida corta. Es la regla que cierra el último agujero del empate: con
   4 preguntas en un eje, un jugador parejo empata y el juego no tiene qué mostrar. Falla
   ruidoso, en build o al abrir el juego, nunca en silencio.
3. Sortea `preguntasPorEje` de cada pozo, sin reposición (Fisher-Yates sobre una copia).
4. **Intercala los dos ejes alternando**, arrancando por un eje sorteado. Cinco preguntas
   seguidas del mismo eje se leen como la misma pregunta cinco veces.
5. Baraja las dos opciones de cada ítem servido (`CTR-08.3`).

**`rnd` es un parámetro con default, no `Math.random` escrito adentro.** Es la única forma
de que el sorteo se pueda testear: con un generador determinista, `node --test` puede
afirmar que salieron exactamente 5 y 5, que no se repite un ítem y que el error salta con
el pozo corto. Un `Math.random()` incrustado convierte esas tres afirmaciones en una
inspección a ojo.

**`resolverCuadrante`:** cuenta los polos elegidos por eje, toma la mayoría de cada uno
—que siempre existe, porque el conteo es impar— y busca el cuadrante cuyo par
`luzOscuridad` / `ordenCaos` coincide.

**Lo que devuelve es tan importante como lo que calcula: no devuelve el conteo.** El tipo
de retorno tiene tres campos y ninguno es un número. Es la forma de hacer cumplir el
criterio 3 de `US-06` desde la arquitectura y no desde la buena intención de quien pinta
la pantalla: **lo que no está en el tipo no se puede mostrar.** Si `experiencia` alguna vez
necesita el "4 a 1", va a tener que pedir un cambio de contrato, que es exactamente la
conversación que hay que tener antes y no después.

**Alternativa descartada: sortear 10 ítems del banco entero sin mirar el eje.** Es la
implementación de una línea y rompe todo: la cantidad por eje pasa a ser aleatoria, sale
un 6 y 4 en cualquier partida, y con 6 el empate vuelve — silencioso, en una de cada
tantas partidas, y sin que nadie lo pueda reproducir. `BR-17` regla 3 habla de la
**partida**, no del banco.

**Alternativa descartada: servir siempre los mismos 10.** Más barato y mata la razón por
la que el piso son 20 y no 10 (`US-06`: dos partidas seguidas pueden no coincidir).

**Fuera de este contrato:** que el juego recuerde qué ítems ya te tocaron entre partidas.
No hace falta para nada de lo de arriba y agregaría `localStorage` a un juego que hoy no
lo necesita. Si se quiere, es de `producto` y `experiencia`.

---

### CTR-08.7 — El bloque normativo, para pegar y correr

> **[REEMPLAZADO por v2.7, 2026-10-04]:** el bloque de abajo es el schema v1, que ya no es el
> vigente. Manda `src/data/_schema/dos-ejes.schema.json` (`$id` `…/dos-ejes/2`), y v2.7 lista
> todo lo que le cambió a esto. La nota que sigue ("la copia todavía no existe") quedó vieja:
> la bajó el hilo principal en el ciclo 8.

Texto normativo. Si la copia en `src/data/_schema/dos-ejes.schema.json` se desincroniza de
esto, **manda esto**, y la copia se regenera en la misma ráfaga.

> **La copia todavía no existe y no tiene tarea asignada en el plan del ciclo 8.** `T-121`
> le pide a `contenido` el JSON del banco y su documento `CNT-09`, pero
> `src/data/_schema/dos-ejes.schema.json` es un archivo de código y no es carpeta de
> `contenido`. **Lo baja el hilo principal**, y tiene que estar antes de que se verifique
> `T-121`: sin la copia, el banco no se puede validar contra nada. Queda señalado en el
> reporte de `T-120`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/dos-ejes/1",
  "title": "CTR-08 — Banco del test de dos ejes",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contrato", "contratoVersion", "juego", "actualizado",
    "preguntasPorEje", "cuadrantes", "items"
  ],
  "properties": {
    "contrato": { "const": "CTR-08" },
    "contratoVersion": { "const": 1 },
    "juego": { "const": "dos-ejes" },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "preguntasPorEje": {
      "comment": "BR-17 regla 3: impar, para que el empate sea imposible.",
      "type": "integer",
      "minimum": 3,
      "maximum": 9,
      "not": { "multipleOf": 2 }
    },
    "cuadrantes": {
      "type": "array",
      "minItems": 4,
      "maxItems": 4,
      "items": { "$ref": "#/$defs/cuadrante" }
    },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/item" }
    }
  },
  "$defs": {
    "cuadrante": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "luzOscuridad", "ordenCaos", "nombre", "bajada", "estado"],
      "properties": {
        "id": { "type": "string", "pattern": "^CU-[1-4]$" },
        "luzOscuridad": { "enum": ["luz", "oscuridad"] },
        "ordenCaos": { "enum": ["orden", "caos"] },
        "nombre": {
          "comment": "Registro 1: 8 palabras como techo. Y sin comparativos (US-06, criterio 3).",
          "type": "string",
          "minLength": 3,
          "maxLength": 48,
          "pattern": "^\\S+( \\S+){0,7}$",
          "not": {
            "pattern": "\\b([Mm][áa]s|[Mm]enos|[Mm]ejor|[Pp]eor|[Nn]ivel|[Rr]anking|[Tt]op|[Vv]erdadero|[Ss]uperior|[Ii]nferior)\\b"
          }
        },
        "bajada": { "type": "string", "minLength": 10, "maxLength": 220 },
        "estado": { "enum": ["borrador", "listo"] }
      }
    },
    "item": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "us", "eje", "enunciado", "opciones", "estado"],
      "properties": {
        "id": { "type": "string", "pattern": "^EJ-\\d{3}$" },
        "us": {
          "type": "array",
          "minItems": 1,
          "items": { "type": "string", "pattern": "^US-\\d{2}$" }
        },
        "eje": { "enum": ["luz-oscuridad", "orden-caos"] },
        "enunciado": {
          "type": "string",
          "minLength": 10,
          "maxLength": 120,
          "not": { "pattern": "[Bb]ulacio|[Oo]lavarr|[Cc]roma[ñn]" }
        },
        "opciones": {
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": { "$ref": "#/$defs/opcion" }
        },
        "estado": { "enum": ["borrador", "listo", "retirado"] },
        "notaInterna": { "type": "string" }
      },
      "allOf": [
        {
          "comment": "BR-17 regla 1 y 2, eje luz-oscuridad.",
          "if": {
            "required": ["eje"],
            "properties": { "eje": { "const": "luz-oscuridad" } }
          },
          "then": {
            "properties": {
              "opciones": {
                "items": { "properties": { "polo": { "enum": ["luz", "oscuridad"] } } },
                "allOf": [
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "luz" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  },
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "oscuridad" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  }
                ]
              }
            }
          }
        },
        {
          "comment": "BR-17 regla 1 y 2, eje orden-caos.",
          "if": {
            "required": ["eje"],
            "properties": { "eje": { "const": "orden-caos" } }
          },
          "then": {
            "properties": {
              "opciones": {
                "items": { "properties": { "polo": { "enum": ["orden", "caos"] } } },
                "allOf": [
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "orden" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  },
                  {
                    "contains": {
                      "required": ["polo"],
                      "properties": { "polo": { "const": "caos" } }
                    },
                    "minContains": 1,
                    "maxContains": 1
                  }
                ]
              }
            }
          }
        }
      ]
    },
    "opcion": {
      "comment": "Sin `correcta`: en un test de identidad no hay respuesta correcta (BR-17).",
      "type": "object",
      "additionalProperties": false,
      "required": ["texto", "polo"],
      "properties": {
        "texto": {
          "type": "string",
          "minLength": 2,
          "maxLength": 72,
          "not": { "pattern": "[Bb]ulacio|[Oo]lavarr|[Cc]roma[ñn]" }
        },
        "polo": { "enum": ["luz", "oscuridad", "orden", "caos"] }
      }
    }
  }
}
```

**Dos detalles de implementación que no son decorativos:**

- `comment` en vez de `$comment` porque `src/lib/esquemas.test.ts` corre ajv con
  `strict: false` justamente para admitirlo, igual que los otros cuatro schemas del repo.
- `minContains` y `maxContains` son de draft 2020-12 y `ajv/dist/2020` los implementa. El
  `$schema` de arriba tiene que quedar tal cual: con un draft anterior, ajv ignora los dos
  y la regla 2 deja de aplicarse **en silencio**.

---

### CTR-08.8 — Lo que el schema NO puede verificar

> **[AMPLIADO por v2.8, 2026-10-04]:** tres más, y el piso del punto 2 pasa a 30 con tres por
> celda.

1. Que los `id` sean únicos dentro del archivo. `uniqueItems` compara objetos enteros.
2. **El piso de 20 y las 10 por eje.** Un schema valida ítems sueltos, no propiedades del
   conjunto. Van a `CTR-08.9`.
3. **Que los cuatro cuadrantes cubran las cuatro combinaciones.** Ídem: es un cruce entre
   los cuatro objetos, no una propiedad de uno.
4. Que el enunciado no presuponga un hecho discutido (`CTR-08.5`, regla 5).
5. **Que las dos opciones de un ítem sean de verdad los dos extremos** y no dos formas de
   decir lo mismo. El schema ve que hay un `luz` y un `oscuridad`; que el texto de la
   opción `oscuridad` sea oscura lo ve `revisor`.
6. **Que un cuadrante no se lea como mejor que otro** aunque no use ninguna palabra de la
   lista negra.
7. Que el texto pase `.claude/rules/voz-ricotera.md`. Eso lo corre `src/lib/voz.test.ts`
   sobre el texto visible, y el oído de quien revisa sobre el resto.

---

### CTR-08.9 — Verificación: qué correr, y quién

> **[REEMPLAZADO por v2.9, 2026-10-04]:** los comandos vigentes están allá. El (2) de acá
> sigue corriendo sin cambios y v2.9 lo usa. El (3) se corrigió en su lugar: citaba
> `sorteo.test.ts` y `resultado.test.ts`, que no existieron nunca; los tests del motor
> siempre estuvieron en `partida.test.ts`.

`arquitectura` no tiene con qué ejecutar (`D-12`) y no lo simula. **Lo corre el hilo
principal** al cerrar `T-121` y `T-123`, o `revisor` en `T-124`.

```bash
# (1) El banco contra el contrato, item por item: un solo eje, dos polos opuestos,
#     ningun campo de mas, y `preguntasPorEje` impar.
#     Requiere agregar 'dos-ejes' al arreglo de src/lib/esquemas.test.ts (linea 44).
node --test src/lib/esquemas.test.ts

# (2) Las invariantes de conjunto: piso, cuadrantes cubiertos, empate imposible
#     y los cuatro cuadrantes alcanzables. No necesita que el motor exista todavia.
node -e "import('node:fs').then(({readFileSync})=>{const j=JSON.parse(readFileSync('src/data/dos-ejes.json','utf8'));const n=j.preguntasPorEje,f=[],EJ=['luz-oscuridad','orden-caos'];const it=(j.items||[]).filter(x=>x.estado==='listo'),cu=(j.cuadrantes||[]).filter(c=>c.estado==='listo');const pe=e=>it.filter(x=>x.eje===e);if(!Number.isInteger(n)||n%2===0)f.push('preguntasPorEje no es impar: '+n);if(it.length<20)f.push('piso de US-06: '+it.length+'/20 listos');for(const e of EJ){const p=pe(e).length;if(p<10)f.push('eje '+e+': '+p+'/10');if(p<n)f.push('eje '+e+' no alcanza para servir una partida ('+p+'<'+n+')');}const ids=it.map(x=>x.id),du=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];if(du.length)f.push('ids repetidos: '+du.join(', '));const PROH=['correcta','dificultad','peso','puntos','explicacion','fuentes','esLeyenda'];for(const x of j.items||[]){for(const k of PROH)if(k in x)f.push(x.id+': campo prohibido \`'+k+'\` (CTR-08.5 regla 4)');for(const o of x.opciones||[])for(const k of PROH)if(k in o)f.push(x.id+': opcion con campo prohibido \`'+k+'\`');const ps=(x.opciones||[]).map(o=>o.polo).sort().join('+');if(ps!=='luz+oscuridad'&&ps!=='caos+orden')f.push(x.id+': polos '+ps+' (CTR-08.5 reglas 1 y 2)');if((x.eje==='luz-oscuridad')!==(ps==='luz+oscuridad'))f.push(x.id+': el eje declarado no coincide con los polos');}const k=(a,b)=>a+'|'+b,tabla=new Map(cu.map(c=>[k(c.luzOscuridad,c.ordenCaos),c.id]));if(cu.length!==4)f.push('cuadrantes listos: '+cu.length+'/4');if(tabla.size!==4)f.push('las 4 combinaciones no estan cubiertas, hay '+tabla.size+': '+[...tabla.keys()].join(' '));const vis=new Set();let emp=0;for(let a=0;a<=n;a++)for(let b=0;b<=n;b++){if(a*2===n||b*2===n){emp++;continue;}const q=tabla.get(k(a*2>n?'luz':'oscuridad',b*2>n?'orden':'caos'));if(q)vis.add(q);else f.push('resultado sin cuadrante: '+a+'/'+b);}if(emp)f.push('EMPATE POSIBLE en '+emp+' resultados');const inal=cu.filter(c=>!vis.has(c.id)).map(c=>c.id);if(inal.length)f.push('cuadrantes inalcanzables: '+inal.join(', '));const ojo=(j.items||[]).filter(x=>/[Mm]uer|[Ff]alleci|[Ss]olari/.test(JSON.stringify(x)));console.log(f.length?'ROTO:\n- '+f.join('\n- '):'OK CTR-08.9 · '+it.length+' items ('+pe(EJ[0]).length+' + '+pe(EJ[1]).length+') · '+((n+1)*(n+1))+' resultados posibles, 0 empates, 4 cuadrantes alcanzables');if(ojo.length)console.log('PARA LEER CON LOS OJOS (registro 3, voz-ricotera §6): '+ojo.map(x=>x.id).join(', '));})"

# (3) El motor: que haga lo que dice CTR-08.6.
#     [Corregido el 2026-10-04: decía sorteo.test.ts y resultado.test.ts, que nunca existieron.]
node --test src/lib/dos-ejes/partida.test.ts
```

**Por qué el barrido de (2) es una demostración y no una muestra.** El resultado de un eje
depende solo de **cuántas** respuestas fueron a cada polo, no de cuáles ni en qué orden.
Entonces recorrer `a` de 0 a `n` y `b` de 0 a `n` cubre **todos** los resultados que el
juego puede producir: son `(n+1)²` = 36 con `n = 5`. Que ninguno empate y que los cuatro
cuadrantes aparezcan no es una estimación, es la enumeración completa.

Y la cadena que hace válida esa reducción está escrita entera en este contrato: cada ítem
ofrece los dos extremos de su eje (regla 2, la valida el comando 1), así que cualquier
conteo de 0 a `n` es realmente alcanzable por un jugador; el conteo es impar (regla 3), así
que siempre hay mayoría; y los cuatro pares de coordenadas están cubiertos (comando 2). Las
tres cosas juntas son "los cuatro cuadrantes son alcanzables y el empate es imposible".

**Qué chequea la máquina y qué no:**

| # | Chequeo | Quién |
|---|---|---|
| 1 | Un ítem mueve un solo eje (reglas 1 y 2) | comandos (1) y (2) |
| 2 | Ninguna opción es la correcta; ningún campo de más | comandos (1) y (2) |
| 3 | `preguntasPorEje` impar | comandos (1) y (2) |
| 4 | Piso de 20 y de 10 por eje, sobre `estado: "listo"` | comando (2) |
| 5 | Los cuatro cuadrantes cubren las cuatro combinaciones | comando (2) |
| 6 | Empate imposible y cuatro cuadrantes alcanzables, por enumeración | comando (2) |
| 7 | El sorteo sirve 5 y 5, sin repetir, y falla con el pozo corto | comando (3) |
| 8 | Que el resultado no exponga el conteo | comando (3), y el tipo de retorno |
| 9 | Que las dos opciones sean de verdad opuestas | `revisor` |
| 10 | Que ningún cuadrante se lea como el bueno | `revisor` |
| 11 | Que el enunciado no presuponga un hecho | `revisor` |

**El comando (3) todavía no se puede correr** porque `src/lib/dos-ejes/` no existe: lo crea
`T-123`. Los dos primeros sí, apenas `T-121` deje el JSON y el hilo baje la copia del
schema. *(2026-10-04: los tres corren desde el ciclo 8.)*

---

### CTR-08.10 — Numeración

`EJ-NNN`, tres dígitos, correlativo, **no se reutiliza**. Un ítem que sale de circulación
se marca `"estado": "retirado"` y se queda en el archivo (`Docs/IDS.md`).

**`EJ-990`..`EJ-999` quedan reservados para los ejemplos de esta documentación y no se
cargan nunca en `src/data/dos-ejes.json`.** Hoy está tomado `EJ-999`. Si copiás el bloque
de `CTR-08.3`, cambiale el `id`.

`EJ-` se suma a la lista de prefijos de banco que abrió `CTR-02.7`: `QZ-` quiz · `AT-`
adivinar el tema · `CL-` completar la letra · `TP-` tapa · **`EJ-` test de dos ejes**. Vale
la misma excepción declarada allá: son tres dígitos y no dos porque viven en `src/data/`,
no en `Docs/`, y no se mezclan con ningún `US-`, `ADR-` ni `RES-`. **No edito
`Docs/IDS.md`**, que no es mi carpeta.

Los cuadrantes son `CU-1`..`CU-4`, un dígito, porque son cuatro y siempre van a ser cuatro:
un patrón de dos dígitos sugeriría que puede haber un quinto.

---

### Consecuencias

- **Fácil, y es lo que destraba `T-121`:** `contenido` arranca sin esperar nada. No
  necesita el motor, ni una ficha `RES-XX`, ni una decisión de `experiencia`. Necesita
  `US-06`, `BR-17` y este archivo.
- **Fácil:** rechazar un ítem mal cargado sin discutirlo. Un ítem que mueve dos ejes, o que
  trae una respuesta correcta, no valida, y eso no es opinión de nadie.
- **Fácil:** saber, con un comando, que ninguna partida puede empatar y que los cuatro
  cuadrantes se pueden alcanzar. Es el defecto que el ciclo 7 tuvo abierto un ciclo entero
  —el quiz sirviendo solo preguntas fáciles sin que nadie lo notara— y que solo se ve
  mirando el conjunto.
- **Difícil, y a propósito:** meter una noción de nivel en este juego. No hay `dificultad`,
  no hay `peso`, no hay `correcta`, no hay conteo en el resultado. Cada una de esas cuatro
  ausencias es una línea del schema o del tipo de retorno, y las cuatro habría que
  discutirlas de nuevo con `producto`, que es lo que corresponde.
- **Difícil:** cambiar de 2 opciones a 3. El schema cambia en dos líneas y **todo el banco
  se cae**: con tres opciones, dos polos no alcanzan y aparece el punto intermedio que
  `BR-17` regla 2 prohíbe. La ventana para discutirlo es antes del primer lote.
- **Cambiar `preguntasPorEje` es barato y está previsto.** Se toca un número del JSON, el
  motor lo lee, el comando (2) rehace la enumeración sobre el nuevo valor. Lo único que no
  se puede es ponerlo par: el schema no valida. **[Ya no, desde la v2 (2026-10-04): una
  pregunta más por eje es un momento más de la noche. Ver v2.2.]**
- **Lo que le impone a `experiencia` (`T-122`):** el resultado que recibe son tres campos
  —`id`, `nombre`, `bajada`— y **ningún número**. Si la pantalla que tiene en la cabeza
  necesita mostrar "4 a 1" o una barra, es un pedido de cambio de contrato, no un detalle
  de render. Y las dos opciones llegan barajadas: no puede apoyarse en que la primera sea
  siempre la misma.
- **Lo que le impone al hilo principal (`T-123`):** dos funciones puras con el generador
  aleatorio inyectado, y el error ruidoso cuando el pozo no alcanza.
- **Lo que queda pendiente de `arquitectura`, y no lo abro acá:** `ADR-02` define el link
  compartido con `g` (juego), `p` (puntaje) y `t` (total). **Este juego no tiene puntaje**,
  así que necesita un parámetro nuevo que lleve el `id` del cuadrante y ningún número. Es
  una revisión de `Docs/ARQ/ARQ-link-resultado-compartido.md`, que `T-120` no habilita a
  tocar. Lo que este contrato deja fijado por adelantado: **lo que viaja es `CU-N`, nunca
  un conteo** — por lo mismo que dice la alternativa descartada 5.
- **Este contrato no frena nada.** No hay derechos de terceros adentro: el banco es texto
  escrito por `contenido`, sin letra, sin tapa y sin audio.

### Qué NO decide este contrato

- **El texto de las preguntas, las opciones y los cuatro nombres:** `contenido` (`T-121`).
- **Si `UX-02` se reutiliza para un resultado sin puntaje:** `experiencia` (`T-122`).
- **Cuántas preguntas entran en 2 o 3 minutos de verdad:** `experiencia`, midiendo. Si el
  número cambia, cambia `preguntasPorEje` y tiene que seguir siendo impar (`BR-17`).
- **Si el test entra al "Listo" de la v1:** ya está decidido que no (`US-06`, `D-05`).
- **Si alguna vez los 105 temas tienen coordenadas en el plano:** quedó fuera del ciclo 8 y
  sería otro contrato, no este. Ubicar un tema es afirmar algo sobre la obra; ubicar al
  jugador no afirma nada, y todo este documento se apoya en esa diferencia.
