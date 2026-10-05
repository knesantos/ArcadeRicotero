# ARQ — Schema de los niveles: `src/data/skayboy.json`

> Rol dueño: `arquitectura`. **Produce: `CTR-16`** (`CTR-16.1` … `CTR-16.11`; la `.11` nació el
> 2026-09-24).
>
> **Consume:** `CLAUDE.md` (*"nada de datos hardcodeados: el contenido viene siempre de
> `src/data/*.json`"*), `D-14`, `D-32` (límite 3), `D-38`, `D-39`, `D-40`, `D-41`, `D-42`,
> **`D-43`**, `BR-01`, `BR-16`, `IDEA-14` (par elemental cielo/infierno, piso leído 2/2/2),
> `RES-61.1` … `RES-61.8` (`INV-60`), `ADR-08` (`ARQ-motor-de-juego.md`), `CTR-15`,
> `CTR-17`, `CTR-02`, `CTR-08` (forma del envoltorio), **`UX-27 §2`** (la grilla),
> **`UX-28 §1`** (dos columnas, ningún modo que elegir), **`UX-29 §7`** (el terreno ajeno
> devuelve a la entrada, y el nivel es una sala cerrada), **`REV-14`** (`FIND-55`, `FIND-58`,
> y `FIND-59`), **`US-09` criterio 4**, `src/lib/esquemas.test.ts`.
> **Sumado el 2026-09-22 para `CTR-16.10` (`T-264`):** `D-44`, `BR-23` puntos 1 y 4,
> `BR-24`, `BR-25` (b), (c), (d) y (f), `UX-27 §4`, `§5.2` y `§9`, `UX-28 §2.1` y `§3`,
> `UX-29 §3` y `§6`, `UX-30 §3`, `CTR-17.1`, `.3`, `.4` y `.6`, `RES-61.4`, `RES-61.5`,
> `RES-61.6`, `ORQ-plan-ciclo-16.md` (`§2` fila `T-264`, `§2.1`, `§2.2`, `§5`, `§6`),
> `src/lib/skayboy/mundo.ts`, `niveles.ts`, `src/data/_schema/skayboy.schema.json`, y las
> dos colas del ciclo 15 en `ESTADO.md` ("Lo que la verificación dejó abierto").
> `CTR-18` (`ARQ-solucion-grabada.md`) lo escribe `T-263` el mismo día, en paralelo: acá
> se cita por su número reservado (`Docs/IDS.md`, fila del 2026-09-22).
>
> **Qué NO es:** no es el diseño de los niveles ni el piso de cuántos hay. El piso lo fija
> `producto` al promover (`BR-16`), y a quién devuelve cada terreno es **criterio del sitio**
> y se declara como tal (`IDEA-14`): este schema lo deja escrito en el dato, no lo decide.
>
> Última actualización: 2026-09-16 (ciclo 15, primera versión, **enmendada el mismo día por
> `REV-14`**: `FIND-55` cambió la grilla —el envoltorio de `CTR-16.2` decía 26 × 12 y ahora
> dice 15 × 9— y `FIND-58` rehízo `CTR-16.3` y `CTR-16.4`, que decían dos veces quién se
> lastima y una de las dos no era computable. Cada enmienda está marcada donde pasó).
> **2026-09-22:** el ejemplo de `CTR-16.4` tenía `C` e `I` invertidos respecto del dato y de
> `UX-30 §3`; enmendado en el lugar.
> **2026-09-22, más tarde (`T-264`, ciclo 16):** entra **`CTR-16.10`**, los mecanismos del
> escalón Media, y con él cuatro enmiendas marcadas donde pasaron: `CTR-16.4` (el enum de
> `tipo` y el `elemento` que declara que `C` es cielo e `I` infierno), `CTR-16.5` (el
> ejemplo, la tabla, y la aceptación de `T-253`), `CTR-16.6` (`sostenido` y
> `alternativaSolo` se van) y `CTR-16.9`.
> **2026-09-23 (cierre de la ráfaga 1 del ciclo 16), cinco colas cerradas en el lugar,
> cada una marcada donde pasó:** `CTR-16.7` pide un solo booleano, `deDos`, porque
> `BR-29` retiró `verificaciones.solo` (arrastra `CTR-16.5`, `CTR-16.9`, `CTR-16.10.1` y
> `CTR-16.10.9`); `CTR-16.5` suma la **regla 3**, cada entrada tiene dónde pararse;
> `CTR-16.10.5` y `CTR-16.10.10` dejan de exigirle nada a una traza de a dos que no se graba;
> `CTR-16.10.7` dice qué vale `por` cuando los dos hacen lo mismo en el mismo subpaso; y
> `CTR-16.8` apunta a los módulos de `CTR-18.11`, que era deuda de `ADR-09`. **Consume
> además:** `BR-29` puntos 1, 3 y 4,
> `Docs/SUGERENCIAS/PRD-para-arquitectura-verificaciones-solo-se-retira.md`, `UX-31 §3` (los
> bocetos) y lo que midió `T-266` en `src/lib/skayboy/solucionador.ts` y su test (la entrada
> en el aire).
> **2026-09-24 (`T-291`, ciclo 16, ráfaga 4):** `CTR-16.10.5` suma los puntos 5, 6 y 7 de
> "el empujón no arranca", que `mundo.ts` ya hacía y el contrato no decía (`FIND-72` de
> `REV-15`). Está marcado en el lugar. **Consume además:** `REV-15`, y `src/lib/skayboy/mundo.ts`
> (`cajaEncima()`, `hayOtraCajaEn()` y `empujar()`) y `mundo.test.ts`, leídos en disco ese día.
> **2026-09-24, más tarde (`T-298`, ciclo 16, ráfaga 5): los contratos de `D-47`.**
> `CTR-16.4` pasa del tesoro para los dos a **un coleccionable para cada uno** (subsección nueva,
> `contratoVersion: 3`). Nace **`CTR-16.11`, el avance guardado en el aparato**. Hay enmiendas
> marcadas en `CTR-16.3` (seis estados y los tesoros en la paridad), `CTR-16.8` (los módulos
> nuevos), `CTR-16.9` (qué queda abierto) y `CTR-16.10.10` (`E9`, `E10`, `E11`). De paso,
> `CTR-16.10.8` se pone al día con las 15 tintas: lo pedía
> `Docs/SUGERENCIAS/UX-para-arquitectura-ctr-16-10-8-todavia-dice-16-tintas.md`. **Consume
> además:** `D-47`, `US-09` criterios 1, 6 y 9 y `BR-23` con sus enmiendas del 2026-09-24
> (`PRD-skayboy-y-poligirl.md`, y el párrafo *"No entra el coleccionable como condición"*),
> `ADR-04.5` (el espacio de nombres `arcade.`), `ADR-10` (`ARQ-pantalla-completa.md`),
> `CTR-15.7` y `CTR-15.8` enmendados hoy, `UX-27 §4.1.2` y `§8.2`, `UX-32 §3` y `§5`, y en
> disco `src/data/skayboy.json` (un solo nivel con tesoros, `NIV-01`), `skayboy.schema.json`
> (v2), `mundo.ts:343-353` y `:738-742`, `escena.ts:105-150` (de `ESTADOS_DE_PERSONAJE` a
> `nivelAJugar()`) y `:359-365` (las ramas `tesoro` y `puerta` de `tileDe()`), y
> `src/lib/sitio/cinta.ts:118-119` (`CLAVE_PREFERENCIA`) y `:300-324` (`preferenciaGuardada()` y
> `guardarPreferencia()`). **`BR-31` y `UX-33` se escriben en paralelo**
> y no estaban en disco: lo que es de ellos queda nombrado como suyo.
> *Citas de línea corregidas el mismo día por la verificación de `T-298`:* las dos de
> `escena.ts` de este párrafo y la de `CTR-16.11.2` no coincidían con el código. La segunda de
> `cinta.ts` (decía `:310-320`) arrancaba en el medio de una función y ahora abarca las dos. Los
> números son los del árbol de trabajo al corregir, con la ráfaga 4 todavía escribiendo en
> `escena.ts`. **Si un número se corre, manda el símbolo** que va al lado, y se busca con
> `rg -nF "<símbolo>" <archivo>`.
> **2026-10-02 (`FIND-89` de `REV-17`):** nota fechada en `CTR-16.7`. Los seis `deDos: true`
> los puso el hilo principal por `D-51` punto 2, sin partida en el teléfono. Schema y contrato
> sin cambios. **Consume además:** `D-51`. Cerrada el mismo día con la confirmación del
> usuario (`D-53`), que no dice de a dos ni en qué aparato.
> **2026-10-04 (`D-61` punto 2): se puede elegir cualquier nivel.** Enmiendas marcadas en
> `CTR-16.11` (*"De dónde sale"*), `CTR-16.11.1` (fila *"Cuándo se lee"*) y `CTR-16.11.2` (el
> candado de orden se va; dónde se retoma y cómo se escribe el avance, no). Schema, clave, valor
> y `contratoVersion`, sin cambios. **Consume además:** `D-61`,
> `Docs/SUGERENCIAS/HILO-para-todos-skayboy-menu-y-mando.md`, `ADR-10.5` enmendado el mismo día,
> y en disco `src/lib/skayboy/avance.ts` (`siguienteDeLaFila`, `hastaDonde`, `cargarAvance`,
> `guardarPasado`) y `src/lib/skayboy/escena.ts` (`nivelAJugar`, `siguienteAlGanar`). `BR-40`
> (que enmienda `US-09` criterios 3 y 9 y `BR-31` §3) y `UX-37` se escriben en paralelo y no
> estaban en disco; `menu.ts` tampoco existía todavía.
>
> **Regla de escritura que nace de `FIND-55`: toda medida de píxel dice si es _nativa_ o
> _CSS_. En este documento todo es nativo, porque un dato de nivel no sabe a qué escala se
> va a ver — eso es de `ADR-08.3` y de `UX-27`.**

---

## CTR-16 — Contrato de `src/data/skayboy.json`

- **Fecha:** 2026-09-16
- **Estado:** **vigente, con un valor abierto que no es mío** — `temaFijo` (lo elige
  `contenido` con `experiencia`, `D-39` consecuencia 3) y el reparto personaje→terreno
  (`CTR-16.4`).
- **Para quién es:** para quien diseñe los niveles; para el hilo principal, que los carga;
  para `revisor`, que tiene que poder rechazar un nivel sin preguntarle nada a nadie.

### Por qué un JSON propio y no un editor

`RES-63.8` cerró que un mapa de Tiled **no** hereda la GPL del editor, y `RES-62.18` que LDtk
es MIT de punta a punta: los dos se pueden usar. **Y aun así el dato de este juego es un JSON
propio.** El motivo es del repo, no de la licencia: el formato de LDtk son miles de líneas de
JSON generado con campos que nadie de acá escribió, y `esquemas.test.ts` lo validaría contra
un schema que tampoco escribimos. Seis niveles de 15 × 9 tiles son **nueve renglones de
quince caracteres cada uno**, legibles en un diff, editables sin instalar nada y validables
contra un schema de una página. El editor gana cuando hay cien niveles; acá hay seis.

Si algún día son cien, el camino está: LDtk exporta y un script de ingesta escribe este mismo
formato. Es una decisión de producción, no de arquitectura.

---

### CTR-16.1 — El archivo

| | |
|---|---|
| Ruta del dato | **`src/data/skayboy.json`** |
| Ruta del schema | **`src/data/_schema/skayboy.schema.json`** |
| Codificación | UTF-8 sin BOM, saltos `LF` |
| Versionado | Git, más el par `contrato` / `contratoVersion` adentro del archivo |
| Presupuesto de tamaño | **≤ 24 KB sin comprimir** |

**Los dos nombres importan y no son libres.** `src/lib/esquemas.test.ts` empareja dato y
schema por nombre de archivo: recorre un arreglo (hoy siete entradas, línea 48) y abre
`src/data/<n>.json` contra `src/data/_schema/<n>.schema.json`. Sumar los niveles a la
verificación es agregar **`'skayboy'`** a ese arreglo — y **el día que los dos archivos
existan, no antes**, que es la regla escrita en el comentario de la línea 44.

**Sobre el nombre `skayboy`:** el título del juego todavía no está fijado (es de `contenido`,
punto 7 de `IDEA-14`). Si cambia, el renombre son tres lugares —el dato, el schema y esa
línea del arreglo— y el test rompe hasta que los tres coincidan. Se paga barato y con aviso.

**Presupuesto:** seis niveles de 9 renglones de 15 caracteres son menos de 1 KB de grilla;
con leyenda, mecanismos y metadatos, unos 5 KB. El techo de 24 KB está para que nadie
descubra el problema con el banco ya armado, y con la grilla de `FIND-55` quedó todavía más
lejos.

---

### CTR-16.2 — Envoltorio

```json
{
  "contrato": "CTR-16",
  "contratoVersion": 1,
  "juego": "skayboy",
  "actualizado": "2026-09-16",
  "tile": 16,
  "ancho": 15,
  "alto": 9,
  "temaFijo": null,
  "personajes": [ ... ],
  "leyenda": { ... },
  "niveles": [ ... ]
}
```

- **`tile`, `ancho`, `alto` viven en el dato y son iguales para todos los niveles.** El schema
  los fija en **16, 15 y 9 px nativos / tiles** (`ADR-08.3`, `CTR-15.3`, `UX-27 §2`) — decían
  26 y 12 hasta que `FIND-55` los corrigió. Están escritos igual, y no es redundancia: es lo
  que permite que el validador compare cada renglón de grilla contra `ancho` sin que el
  número esté en el código.
- **Que la grilla se haya achicado de 312 tiles a 135 no es un detalle de formato: cambia lo
  que entra en un nivel.** Un nivel de 15 × 9 con dos personajes de 1 × 1,5 tiles adentro es
  una sala chica, y eso es exactamente lo que `UX-29 §7.1` pidió —una sala cerrada, sin vacío
  por donde caerse— y lo que `UX-28 §6` presupuesta —un nivel que se pasa en menos de un
  minuto. **El que diseñe los niveles lo va a sentir en el primero**, así que queda anotado
  acá y no en una nota al pie.
- **`temaFijo` es el tema que la cinta repite durante la partida** (`D-39`, `ADR-08.9`). Es el
  `slug` de un tema del catálogo, o `null` mientras no esté elegido. **Con `null` el juego
  suena a cama, como los otros siete, y no rompe nada**: es el estado seguro.
  Quién lo elige: `contenido` con `experiencia` (`D-39` consecuencia 3). El candidato natural
  sale de la familia cielo/infierno, que es el par elemental decidido.
- **`contrato` y `contratoVersion` adentro del dato**, por el mismo motivo que en `CTR-02` y
  `CTR-08`: dentro de dos meses, mirando solo el JSON, se tiene que poder saber contra qué
  documento validarlo.

---

### CTR-16.3 — Los dos personajes

> **Enmendado el 2026-09-16 por `FIND-58` (`REV-14`), y lo encontró el revisor: no lo vio
> ningún rol.** Este bloque declaraba `inmuneA: ["cielo"] / ["infierno"]`, y eso tenía dos
> defectos que se tapaban entre sí:
>
> 1. **No era computable.** `"cielo"` e `"infierno"` no eran valores de ningún enum del
>    contrato: ningún caracter de la leyenda declaraba pertenecer a un terreno llamado así.
>    Un validador no podía decir si el dato era coherente, y un lector tampoco.
> 2. **Era la segunda vez que el archivo decía lo mismo.** La leyenda ya lo decía por otro
>    camino (`tipo: "letal"` + `mata`), y **dos lugares que dicen quién se lastima es un lugar
>    donde se van a contradecir.**
>
> **Se va `inmuneA` entero.** Quién es devuelto por qué terreno se escribe **una sola vez, en
> la leyenda**, que es donde vive el terreno. Y de paso se va el vocabulario de muerte, que
> `UX-29 §7.2` retiró con todas las letras: *"ninguno de los dos mata a nadie"*.

```json
"personajes": [
  { "id": "skayboy",  "atlas": "skayboy.v1" },
  { "id": "poligirl", "atlas": "poligirl.v1" }
]
```

**Exactamente dos, ni uno más ni uno menos**, y el schema lo exige con `minItems: 2` /
`maxItems: 2`. **Un personaje acá es un `id` y un atlas, y nada más.** Todo lo que lo
distingue del otro está del lado del terreno (`CTR-16.4`), que es el que lo deja pasar o no.

**Por qué eso es mejor y no solo más corto:** un campo por personaje invita a que aparezca el
segundo. Con `inmuneA` en la ficha del personaje, el día que alguien quiera que uno salte más
alto el lugar ya está hecho. Sin campos, agregar una diferencia obliga a escribir una
decisión.

**Paridad, que es contrato y no preferencia** (`D-38`, y lo que el propio sitio publica
rotulado `hecho` sobre Carmen Castro):

- Los dos usan la misma celda y la misma caja de colisión (`CTR-15.3`).
- Los dos tienen las mismas seis animaciones (`CTR-15.7`). *(Decía "cinco" hasta el
  2026-09-24: `baila` entra por `D-47`.)*
- *(Sumado el 2026-09-24, `D-47` punto 4.)* Los dos tienen **exactamente un** coleccionable
  propio en la leyenda, y cada nivel trae **la misma cantidad** del de uno que del del otro
  (`CTR-16.4`, `E9` y `E10`).
- Los dos tienen **exactamente un** terreno que los devuelve a ellos solos, y no es el mismo
  (`CTR-16.4`).
- **No hay campos de habilidad por personaje en este schema, a propósito.** Si mañana uno
  salta más alto, eso entra por una decisión escrita y no por un campo que aparece un martes.

**El reparto sigue siendo criterio del sitio y sigue sin fundamento fichado.** En los 105
títulos y en los 2913 versos del cancionero no hay un solo verso que asocie a ninguna de las
dos personas con un elemento (medición de `INV-60`). Quién es devuelto por qué terreno lo
decide `experiencia` con `contenido`, se escribe en la leyenda, y **ninguna pantalla puede
explicar el porqué** — decir "no puede pasar por X porque Y" inventa un fundamento que no
existe, y eso cae bajo lo único que `CLAUDE.md` declara estricto.

---

### CTR-16.4 — La leyenda: qué es cada caracter de la grilla

> **Enmendado el 2026-09-16 por `FIND-58`.** Cambian dos cosas: el `tipo` `"letal"` con su
> campo `mata` pasa a llamarse **`"molinete"` con `devuelve`**, y esta tabla queda como **el
> único lugar del archivo donde se declara quién no puede pasar por dónde.**

```json
"leyenda": {
  ".": { "tipo": "aire" },
  "#": { "tipo": "solido" },
  "C": { "tipo": "molinete", "elemento": "cielo",    "devuelve": ["skayboy"] },
  "I": { "tipo": "molinete", "elemento": "infierno", "devuelve": ["poligirl"] },
  "X": { "tipo": "molinete", "devuelve": ["skayboy", "poligirl"] },
  "g": { "tipo": "tesoro", "para": ["skayboy"] },
  "-": { "tipo": "tesoro", "para": ["poligirl"] },
  "1": { "tipo": "entrada", "de": "skayboy" },
  "2": { "tipo": "entrada", "de": "poligirl" },
  "A": { "tipo": "puerta",  "de": "skayboy" },
  "B": { "tipo": "puerta",  "de": "poligirl" },
  "/": { "tipo": "palanca" },
  "=": { "tipo": "placa" },
  "|": { "tipo": "compuerta" },
  "n": { "tipo": "caja" }
}
```

> **Enmendado el 2026-09-24 por `D-47` (`T-298`), en el lugar.** El bloque traía
> `"o": { "tipo": "tesoro", "para": ["skayboy", "poligirl"] }`, un tesoro que juntaba
> cualquiera de los dos. Ahora son dos, **`g` para Skayboy y `-` para Poligirl**. Qué es cada uno
> y cómo se retira `o`: subsección *"El coleccionable de cada uno"*, al final de esta sección.

> **Enmendado el 2026-09-22 por `CTR-16.10` (`T-264`), en el lugar.** Tres cambios en el
> bloque de arriba, y ninguno toca el reparto:
>
> 1. **`=` deja de ser `mecanismo` y pasa a ser `placa`; entran `/` (`palanca`) y `|`
>    (`compuerta`).** `mecanismo` se partía en dos cosas que la física corre distinto, y la
>    diferencia vivía en un booleano del arreglo (`sostenido`, `CTR-16.6`), no en la grilla.
> 2. **`n` sigue siendo `caja`, pero ya no es un sólido quieto:** marca dónde **arranca** una
>    caja que se empuja, y debajo de ella la celda es aire (`CTR-16.10.5`).
> 3. **`C` es cielo e `I` es infierno, y desde hoy lo dice el dato**, no las iniciales. El
>    molinete que devuelve a uno solo lleva `elemento`; el que devuelve a los dos no lleva
>    ninguno. Cierra lo que la enmienda de abajo dejó dicho —*"ningún lugar del contrato la
>    declara"*— y **no pisa el reparto**: `elemento` nombra el lugar, `devuelve` dice a quién
>    rechaza, y lo segundo sigue siendo de `experiencia`. **Coincide con `UX-30 §3`:** el
>    cielo es el terreno claro, lo camina Poligirl, y por eso `C` devuelve a Skayboy. Si
>    algún día `experiencia` cambia el reparto, cambia `devuelve` y `C` sigue siendo cielo.

> **Enmendado el 2026-09-22: el reparto de `C` e `I` estaba al revés.** El ejemplo decía
> `C → ["poligirl"]` e `I → ["skayboy"]`. El dato real (`src/data/skayboy.json`, leyenda) y
> `UX-30 §3` coinciden entre sí y dicen lo contrario: **Skayboy camina el infierno y Poligirl
> el cielo** (reparto por legibilidad de silueta, `UX-30 §3`), así que el cielo (`C`)
> devuelve a Skayboy y el infierno (`I`) devuelve a Poligirl. **Manda el dato con `UX-30`:**
> el reparto es de `experiencia` (`CTR-16.3`), este ejemplo solo lo ilustraba. El dato no
> se toca. Dos cosas quedan dichas: la lectura `C` = cielo, `I` = infierno es la de las
> iniciales, y **ningún lugar del contrato la declara** (el schema solo ve `devuelve`);
> y el contrato no se movió — el test de `esquemas.test.ts` exige uno solo por personaje
> más el de los dos, y lo cumplían las dos versiones. Lo que estaba mal era el ejemplo, que
> es lo que copia quien diseña un nivel.

**Por qué `molinete` y no `letal`, `peligro` o `dañino`.** `UX-29 §7.2` decidió la mecánica y
le puso nombre en la misma línea: *"el elemento ajeno devuelve a la entrada… no te consume,
te rechaza. **Es el molinete otra vez**"*. Usar acá cualquier palabra de daño sería dejar en
el schema el vocabulario que `UX-29` retiró del juego, y el dato es justo el lugar donde ese
vocabulario sobrevive más tiempo: un `tipo: "letal"` en un JSON termina siendo una clase de
CSS llamada `letal`, un nombre de función `mata()` y, tarde o temprano, una palabra en
pantalla. **El enum completo de `tipo`** es entonces: `aire`, `solido`, `molinete`, `tesoro`,
`entrada`, `puerta`, `palanca`, `placa`, `compuerta`, `caja` — *enmendado el 2026-09-22 por
`CTR-16.10`: eran ocho, con `mecanismo` donde ahora están `palanca` y `placa`, y sin
`compuerta`.*

- **La leyenda es del archivo entero, no de cada nivel.** Un caracter que significa una cosa
  en el nivel 2 y otra en el 5 es un defecto esperando.
- **`devuelve` es la única declaración de quién no pasa, y es obligatoria en todo
  `molinete`.** Nombra uno o dos `id` de `personajes`, sin repetidos. No hay un segundo lugar
  donde decirlo y no hay manera de que dos lugares se contradigan, que era `FIND-58`.
- **El tercer molinete —el que devuelve a los dos— no es opcional.** `RES-61.1` lo verificó
  en el juego de origen y es lo que hace que los dos tengan que cuidarse del mismo obstáculo
  alguna vez. Sin él, el par no coopera: se turna.
- **Lo que la leyenda no dice:** cómo se ve. Eso es el tileset (`CTR-15`) y el mapa
  caracter→tile vive en el JSON del tileset, no acá. Un dato de nivel que traiga un color es
  un dato de nivel que hay que editar cuando cambie la paleta.

#### Cómo se verifica, y qué parte no la puede hacer el schema

`FIND-58` pide que esto sea validable por `esquemas.test.ts`, así que conviene decir con
precisión qué hace cada mitad — porque **JSON Schema no sabe contar propiedades de un objeto
por su contenido**, y afirmar que sí sería el mismo defecto que el hallazgo vino a arreglar.

| Regla | Quién la hace cumplir |
|---|---|
| `tipo` es uno de los **diez** del enum *(eran ocho; enmendado por `CTR-16.10`)* | `skayboy.schema.json`, `enum` |
| Todo `molinete` trae `devuelve` con 1 o 2 entradas, `uniqueItems`, y cada entrada es `"skayboy"` o `"poligirl"` | el schema, con `if`/`then` sobre `tipo` |
| `de` y `para` solo nombran esos mismos dos `id` | el schema |
| Los caracteres de la leyenda son de un solo caracter y no se repiten | **el schema, gratis**: son claves de un objeto |
| **Hay exactamente un molinete que devuelve solo a `skayboy`, exactamente uno que devuelve solo a `poligirl`, y exactamente uno que devuelve a los dos** | **un caso de prueba propio en `esquemas.test.ts`**, cuatro líneas de JavaScript sobre el JSON ya parseado |
| *(Sumada por `CTR-16.10`)* Todo molinete de uno solo trae `elemento` (`cielo` \| `infierno`); el de los dos y cualquier otro `tipo` no lo traen | el schema, con `if`/`then`/`else` |
| *(Sumada por `CTR-16.10`)* **Los dos molinetes de uno solo son uno de cielo y uno de infierno** — no dos de cielo | el mismo caso de prueba que cuenta los tres: el schema no cuenta por contenido en un mapa, y es la misma razón de la fila de arriba |
| *(Sumada por `D-47`, 2026-09-24)* **Todo `tesoro` nombra a uno solo en `para`** | el schema: `maxItems: 1` en la rama de `tesoro` |
| *(Sumada por `D-47`)* **Hay exactamente un `tesoro` de `skayboy` y exactamente uno de `poligirl`** (`E9`) | `esquemas.test.ts`, al lado de la cuenta de los molinetes, por la misma razón: el schema no cuenta por contenido en un mapa |
| *(Sumada por `D-47`)* **Cada nivel trae la misma cantidad de celdas del tesoro de uno que del otro** (`E10`) | `niveles.ts` (`problemasDelBanco`): es contar caracteres de la grilla por lo que la leyenda dice de ellos, y eso no lo hace ningún schema |

**Alternativa descartada, y es la que parece mejor hasta que se mira de cerca:** hacer que
`leyenda` sea un **arreglo** de `{ "caracter": …, "tipo": … }`. Con un arreglo, `contains` +
`minContains`/`maxContains` expresan la última fila **dentro del schema**, que es lo que uno
quiere. Se descarta porque se pierde algo peor: en un arreglo **nada impide dos entradas para
el mismo caracter**, y eso el schema tampoco lo puede chequear. Entre "una regla de conteo
vive en el test" y "un caracter duplicado entra en silencio y el segundo pisa al primero", la
elección es fácil — **el defecto que el mapa hace imposible es el que nadie vería.**

#### El coleccionable de cada uno: la guitarra y el cigarrillo (sumado el 2026-09-24, `D-47` punto 4, `T-298`)

`D-47`: *"Skay debe juntar guitarras y Poli cigarrillos"*. **Reemplaza al tesoro que servía
para los dos.** La paridad de `BR-23` se vuelve contable —la misma cantidad por nivel—, **sigue
sin ser condición para ganar**, y la guitarra se junta del piso (`UX-27 §8.2` en pie).

**La decisión, en siete puntos:**

1. **El `tipo` sigue siendo `tesoro`.** Nombra la mecánica: algo que se junta, que no decide la
   victoria y que no vuelve al fallar (`mundo.ts:352`, *"lo conseguido se queda"*). Qué objeto
   es no lo dice el `tipo`, igual que `molinete` no dice si es cielo o infierno.
2. **`para` nombra a uno solo.** El schema lo exige con `maxItems: 1` en la rama de `tesoro`. El
   tesoro de los dos deja de validar: esa es la baja de `o`.
3. **Un caracter por personaje: `g` es de Skayboy y `-` es de Poligirl.** `g` por guitarra, como
   `C` e `I` son las iniciales del cielo y del infierno. `-` porque dibuja un cigarrillo tirado en
   el piso. Son dato, no contrato: las pruebas buscan por `tipo` y `para`, nunca por caracter.
4. **Qué objeto es lo dibuja la sala, no lo dice el dato.** Hay un tile por personaje,
   **`tesoroSkayboy` y `tesoroPoligirl`**, como ya pasa con `puertaSkayboy` y `puertaPoligirl`.
   `tileDe()` elige por `para[0]`, como hoy elige la puerta por `de`. Adentro del de Skayboy se
   dibuja una guitarra, y adentro del de Poligirl, un cigarrillo. **`D-47` avisa que el
   cigarrillo puede cambiar si llega un reclamo**: así, cambiarlo es redibujar un tile y subir
   la versión de la sala, sin tocar ni el dato ni el schema.
5. **La paridad: en cada nivel, la misma cantidad de celdas `g` que de celdas `-`** (`E10`).
   Cero y cero cumple este contrato. **Si `BR-31` fija un mínimo por nivel**, entra en la misma
   prueba como una constante con su cita. Leer *"la misma cantidad por nivel"* como *"la misma
   cantidad en todos los niveles"* es otra regla, y la fija `BR-31`, no este contrato.
6. **Nada más cambia en la física ni en el sonido.** `mundo.ts` ya junta solo al que figura en
   `para` (`:738-742`), y `mundo.test.ts:364` ya lo prueba con un tesoro de uno solo. El suceso
   sigue siendo `{ tipo: 'tesoro', quien }`. **Suena igual para los dos**: `CTR-17` no se
   enmienda, y un mismo sonido es paridad gratis.
7. **Si la victoria muestra cuántos juntó cada uno** (`UX-33`, `CNT-22`), la cuenta se deriva de
   `mundo.juntados` y la leyenda. No se suma ningún contador al mundo.

**Cómo se retira `o`: una migración en cinco pasos.**

1. **El schema pasa a `contratoVersion: 3`** (fragmento de abajo). Es incompatible: el dato v2,
   con `o` para los dos, no valida contra el v3.
2. **El dato.** La leyenda pierde `o` y gana `g` y `-`. **`NIV-01` es el único nivel con tesoros**
   (leído en disco el 2026-09-24): `"#A.o.1...2.o.B#"` pasa a **`"#A.g.1...2.-.B#"`**. La `o` de la
   columna 3 está en el camino de Skayboy, de su entrada en la 5 a su puerta en la 1. La de la
   columna 11 está en el de Poligirl, de la 9 a la 13. Queda uno y uno. `contratoVersion: 3`.
   `deDos` sigue en `false`, que ya está.
3. **Las trazas no se regraban por esto.** Para un cuerpo, un tesoro es aire y no decide la
   victoria, y la traza se juega contra la grilla de hoy en cada build (`CTR-18`). La `deUno` de
   `NIV-01` sigue ganando. El control de `soluciones.test.ts:559` (*"la copia juntó tesoros"*)
   sigue en verde, porque Skayboy pasa por la columna 3 para llegar a su puerta.
4. **El código** (hilo principal; la lista está en el traspaso): `escena.ts`, `sala.txt` y
   `sala.test.ts` pasan de un tile `tesoro` a dos. Se suman `E9` en `esquemas.test.ts` y `E10` en
   `niveles.ts`, cada una con su rojo. **`mundo.ts` no cambia.**
5. **Un solo commit para 1, 2 y 4:** la escena que pide los dos tiles, la sala nueva que los trae
   y el dato que usa `g` y `-` van juntos. Separados, la isla no arranca (`problemasDelAtlas()`
   no encuentra un tile) o dibuja un tile que no existe.

**Para pegar en `src/data/_schema/skayboy.schema.json`:**

`$id` pasa a `https://ricotaarcade.local/schema/skayboy/3`, y `properties.contratoVersion` a:

```json
"contratoVersion": {
  "comment": "CTR-16.4 enmendado por D-47 (T-298): el tesoro para los dos se retira y cada personaje tiene el suyo. Es incompatible con la versión 2 —un tesoro con dos en `para` deja de validar—, y por eso es la 3. `tiempoObjetivo` (CTR-16.9), si llega, sería la 4.",
  "const": 3
}
```

Y en `$defs.caracter.allOf`, la rama de `tesoro` se reemplaza entera por:

```json
{
  "comment": "CTR-16.4 enmendado por D-47: cada tesoro es de uno solo —la guitarra de skayboy, el cigarrillo de poligirl— y el que servía para los dos se retiró. Qué objeto es lo dibuja la sala (tesoroSkayboy, tesoroPoligirl), no lo dice el dato. Que haya exactamente uno por personaje en la leyenda lo cuenta esquemas.test.ts (E9), y que cada nivel traiga la misma cantidad de los dos, niveles.ts (E10).",
  "if": { "required": ["tipo"], "properties": { "tipo": { "const": "tesoro" } } },
  "then": {
    "required": ["para"],
    "properties": { "para": { "maxItems": 1 }, "devuelve": false, "de": false }
  }
}
```

Y el `comment` de la raíz suma, antes de *"Todo eso vive en…"*: *"ni cuenta los tesoros de cada
personaje en la leyenda (E9) ni en cada nivel (E10), ni mira que los niveles vayan en orden
(CTR-16.11, E11)"*.

**Los rojos que se tienen que ver** (el schema con `ajv`, y los tests):

| Caso | Dónde da rojo |
|---|---|
| `"o": { "tipo": "tesoro", "para": ["skayboy", "poligirl"] }` en la leyenda | el schema, en `/leyenda/o/para` (`maxItems`) |
| La leyenda sin `-`: solo el tesoro de Skayboy | `E9`, nombrando a `poligirl` |
| `"g"` y `"h"`, los dos `tesoro` para `skayboy` | `E9`, nombrando los dos caracteres |
| `NIV-01` con `"#A.g.1...2.g.B#"` | `E10`, nombrando el nivel: 2 de `skayboy` y 0 de `poligirl` |
| Control en verde | el dato migrado del paso 2 |

**Descartadas:**

| Descartada | Por qué, puntual |
|---|---|
| **Renombrar el `tipo` a `coleccionable`** | La palabra no se lee en ninguna pantalla, y el cambio arrastra el nombre del efecto de `CTR-17`, el suceso de `mundo.ts`, la cuenta de `soluciones.ts`, `sonido.ts` y media docena de tests, sin cambiar un solo comportamiento. `tesoro` sigue nombrando bien la mecánica |
| **Un campo `objeto` (`guitarra` \| `cigarrillo`) en la leyenda** | Pondría en dos lugares, dato y dibujo, qué objeto es de quién. Y es justo la pieza que `D-47` anticipa que puede cambiar: con el campo, cambiar el cigarrillo toca enum, schema, dato y tile; sin él, solo el tile. `elemento` no es precedente, porque nombra un lugar cuyo reparto puede cambiar solo (`CTR-16.4`, enmienda del 2026-09-22). Acá dueño y objeto los fija `D-47` juntos |
| **Mantener `o` para los dos y sumar los de cada uno** | `D-47`: *"Reemplaza al tesoro que servía para los dos"* |
| **Contar la paridad en el schema** | Las mismas dos razones de siempre: JSON Schema no cuenta propiedades de un mapa por su contenido (`E9`), y `minContains` cuenta renglones que contienen un caracter, no cuántas veces aparece (`E10`) |
| **`c` para el cigarrillo** | En una grilla que ya usa `C` para el cielo, `c` y `C` se confunden a simple vista, y el que se confunde es quien diseña el nivel |

**Lo que ninguna prueba mira todavía, y no decido yo solo: que cada uno se pueda juntar.** Una
guitarra donde Skayboy no llega es un defecto que se ve. La traza de uno gana sin juntar nada, así
que hoy no lo prueba. Hay tres salidas:

- **(a)** que lo mire `revisor` en cada nivel;
- **(b)** que la traza `deUno` grabada gane **juntando todo**: el build lo reprobaría en cada
  corrida;
- **(c)** que lo busque el solucionador sin grabarlo: queda afuera del build.

**Recomiendo (b)**, con tres costos dichos:

- es una enmienda de `CTR-18` que escribiría yo;
- la búsqueda crece, porque los juntados ya entran en la clave de estado
  (`solucionador.test.ts:899`), y es el riesgo *"el solucionador no converge"* del plan (§6);
- la *"duración mínima"* de `BR-29` se tendría que seguir midiendo sobre una traza que no junta
  nada.

**Si es requisito o no lo decide `BR-31`** (`producto`). La fila `T-303` del plan dice *"con las
trazas regrabadas"*: eso solo hace falta con (b). Traspaso:
`Docs/SUGERENCIAS/ARQ-para-producto-y-experiencia-lo-que-deja-abierto-t298.md`.

---

### CTR-16.5 — Un nivel

```json
{
  "id": "NIV-01",
  "nombre": "",
  "escalon": 1,
  "estado": "borrador",
  "grilla": [
    "###############",
    "#.............#",
    "..."
  ],
  "mecanismos": [
    { "id": "MEC-01", "en": [5, 7], "abre": ["COM-01"] }
  ],
  "compuertas": [
    { "id": "COM-01", "en": [7, 5] }
  ],
  "verificaciones": { "deDos": false }
}
```

> **Enmendado el 2026-09-23:** `verificaciones` traía también el booleano `solo`, que
> `BR-29` retiró (`CTR-16.7`, enmendado el mismo día).

> **Enmendado el 2026-09-22 por `CTR-16.10` (`T-264`), y cierra la `BAJA` del ciclo 15:** el ejemplo decía `"abre": ["PUE-01"]`, un id que no tenía ninguna pieza del juego.
> Las puertas son los caracteres `A` y `B`, y **una puerta no se abre: se llega** (regla 2
> de abajo). Lo que un mecanismo abre es una **compuerta**, con id propio `COM-NN` y su
> arreglo `compuertas`. Se fueron también `sostenido` (lo dice la leyenda: `CTR-16.6`
> enmendado) y el arreglo `cajas` (una caja se dibuja en la grilla y no conecta con nada:
> `CTR-16.10.1`). Un ejemplo completo y válido, con las cuatro piezas, está en `CTR-16.10.1`.

| Campo | Regla del schema |
|---|---|
| `id` | `NIV-` más dos dígitos. No se reutiliza, y un nivel descartado se marca y se queda (`Docs/IDS.md`) |
| `nombre` | **≤ 8 palabras.** Es una línea grande del sitio y le rige el techo de `voz-ricotera.md` §4.1. El texto es de `contenido` |
| `escalon` | entero **1, 2 o 3**. Es lo que hace verificable el escalonamiento de `BR-01` sin que nadie cuente a mano |
| `estado` | `borrador` \| `listo`. La página sirve **solo** los `listo`, igual que `dos-ejes` (`CTR-08`) |
| `grilla` | exactamente `alto` renglones de exactamente `ancho` caracteres, todos declarados en `leyenda`. Es la regla que más defectos caza y la más barata de correr |
| `mecanismos`, `compuertas` | *(enmendado por `CTR-16.10`: decía `mecanismos`, `cajas`)* coordenadas `[columna, fila]` en tiles, dentro de la grilla, e ids `MEC-NN` / `COM-NN` únicos **dentro del nivel**. Que cada `en` caiga en la celda que corresponde y que `abre` nombre compuertas que existen no lo puede ver el schema: lo hace `niveles.ts` (`CTR-16.10.10`) |
| `verificaciones` | ver `CTR-16.7` |

**Tres reglas de composición que no son estética.** Las dos primeras las exige el schema; la
tercera, `niveles.ts`, porque mira celdas vecinas *(eran dos hasta el 2026-09-23: la 3 se
sumó ese día y su texto está abajo)*.

1. **Exactamente una entrada y exactamente una puerta por personaje.** Cero es un nivel que no
   se puede terminar; dos es un nivel con dos finales y ningún motivo.
2. **La condición de victoria es que los dos estén en su puerta al mismo tiempo**
   (`RES-61.2`). No es un campo: es la regla del juego, y está acá escrita para que nadie la
   parametrice por nivel. Un nivel que se gana con uno solo en la puerta es otro juego.
3. **Cada entrada tiene dónde pararse.** Abajo de la celda de la entrada hay `solido`, o la
   entrada está en la última fila y abajo está el borde. Y arriba, la entrada no está en la
   fila 0, y la celda no es `solido` ni un `molinete` que devuelva a ese personaje: el cuerpo
   mide 20 px nativos de alto sobre un tile de 16 (`CTR-15.3`, `CAJA_ALTO` en `mundo.ts:73`) y
   `puntoDeEntrada()` lo para con 4 px metidos en la celda de arriba (`mundo.ts:179-182`). Por
   qué existe, qué se descartó y quién la programa: al final de esta sección.

> **`FIND-59` cerrado a favor de estas dos reglas: rigen desde el nivel 1.** `US-09` criterio
> 4 le da al primer nivel **las dos entradas y las dos puertas**, y `producto` lo confirmó
> cediendo su lado (`T-231`). Las reglas 1 y 2 quedan como están: ningún campo por nivel,
> ningún `if`/`then`.

> **`T-253` aceptada por `arquitectura` el 2026-09-22 (`T-264`).** Se registra acá porque el
> test existía desde el ciclo 15 y ningún documento decía que yo lo había aceptado — la
> tarea era condicional a eso, y la verificación del ciclo lo marcó `MEDIA`. **Se acepta
> sin reservas:** es lo único que quedó del criterio 4 de `US-09` cuando `FIND-59` se cerró
> a favor del contrato, y es de la misma familia que la cuenta de los tres molinetes — una
> regla sobre el contenido del dato que ningún schema puede correr y que sin ese test no la
> corre nadie.
>
> **Acepto también cómo identifica al primero**, que era la parte que me dejaba a mí: **el
> `listo` de `id` más chico, y si no hay ninguno `listo`, el de `id` más chico del
> archivo.** `escalon` no sirve —el nivel 2 también es Fácil, y es el que trae el primer
> molinete propio—, y mirar primero los `listo` es mirar lo que la página sirve
> (`CTR-16.8`).
>
> **Con `CTR-16.10` la lista crece, y la tiene que seguir el test:** el primero del piso no
> trae en su grilla ningún `molinete`, `palanca`, `placa`, `compuerta` ni `caja`, y trae
> `mecanismos` y `compuertas` vacíos. El caso en rojo los sigue nombrando **a mano**, que es
> la lección que dejó ese mismo archivo el 2026-09-20.

#### La regla 3: por qué existe, y por qué es regla del nivel y no cuenta del mundo

> **Sumada el 2026-09-23** (cierre de la ráfaga 1). Lo que la originó lo midió `T-266` al
> escribir el solucionador: **un cuerpo en una entrada dibujada en el aire salta en el aire en
> el cuadro 0** —suceso `salto` y `vy = −255` al cerrar el cuadro, que es −270 más dos
> subpasos de gravedad—. Ninguna regla de este contrato lo prohibía; lo dice el propio test del
> solucionador (`FLOTA_POLIGIRL`, `solucionador.test.ts:133-148`).

**El defecto está en una suposición del código, no en la física.** `crearMundo()` y
`devolver()` paran al cuerpo en su entrada con `enSuelo: true` sin mirar la grilla
(`mundo.ts:193` y `:318`). Con la regla 3, eso es cierto por construcción y el código no cambia
de comportamiento. Sin ella pasan tres cosas; la primera es la que se midió, las otras dos
salen de leer el código:

1. **Salta en el aire en su primer cuadro**, el de arranque y el de cada vuelta a la entrada.
2. **El que espera se mueve en el cuadro 0**: si la persona sola agarra primero la otra
   columna, el que flota cae mientras el otro juega. Es la regla 7 de `CTR-18.6` en rojo en la
   raíz, y `BR-25` (d) —el que espera, quieto— roto antes de la primera tecla. El solucionador
   tuvo que escribirse una excepción para empezar (su poda 3, `solucionador.ts:800-805`).
3. **Una entrada arriba de un molinete que la devuelve es una vuelta por subpaso, para
   siempre**: cae, toca el molinete, vuelve a la entrada, cae. Ciento veinte por segundo, y ese
   personaje no puede jugar. **No es hipotético: el boceto de `NIV-05` en `UX-31 §3` lo trae**
   —la entrada `2` en la columna 9, arriba de la `X` de la fila 8—. Va dicho en
   `Docs/SUGERENCIAS/ARQ-para-experiencia-los-bocetos-contra-las-reglas-de-la-sala.md`.

**Por qué `solido` y nada más debajo.** Una caja se empuja (`CTR-16.10.5`): la primera vez que
alguien la corre, la vuelta a esa entrada cae. Una compuerta no puede estar ahí de todos modos
(`E4` le pide sólido arriba del tramo). Placa, palanca, tesoro y aire son aire para un cuerpo.
En la celda de arriba, `compuerta` y `caja` tampoco pueden aparecer —las descartan `E4` y `E5`,
que piden sólido o apoyo debajo, y la entrada no lo es—, así que alcanza con nombrar `solido` y
el molinete.

**Las puertas no llevan esta regla, y es a propósito.** El código no supone nada de una
puerta: `estaEnSuPuerta()` pregunta el `enSuelo` que calculó la física (`mundo.ts:300`). Una
puerta en el aire no es un estado falso, es un nivel que no se gana, y un nivel sin traza que
gane no entra al banco (`CTR-18.6` reglas 1 y 5). Y la regla prohibiría un diseño legítimo:
la puerta a la que se llega parado en una caja, que la tabla de `CTR-16.10.5` deja (la caja no
entra en la celda de una puerta ni en la de arriba; en la de abajo, sí).

**Quién la escribe:** `T-272`, como `E8` de `problemasDelBanco()` (`CTR-16.10.10`), con su caso
en rojo —la sala `FLOTA_POLIGIRL` es exactamente ese caso—. Es la tarea que ya escribe `E1` a
`E6` en `niveles.ts` y la que abre `mundo.ts`; va antes de `T-277`, que es la que dibuja
niveles. **En `mundo.ts` no cambia una línea de lógica:** `enSuelo: true` en `cuerpoNuevo()` y
en `devolver()` suma un comentario que cita esta regla. La excepción de la raíz del
solucionador y sus dos pruebas `FLOTA_*` no contradicen nada —prueban una sala que el banco ya
no admite—: si se quedan como robustez o se van lo decide el hilo principal.

| | Opción | Por qué sí / por qué no |
|---|---|---|
| ✅ | **Regla de composición en el nivel, verificada por `niveles.ts`** | La suposición del código pasa a ser cierta por construcción, y un nivel que la rompe no entra al banco, con nombre y celda en el mensaje |
| ✕ | **Que el mundo calcule `enSuelo` de verdad al crear** | No alcanza un campo: con `enSuelo: false` y `desdeElSuelo: 0`, el perdón tarde (`PERDON_TARDE_SEG` = 0,1 s, `mundo.ts:91` y `:343`) lo deja saltar en el aire seis cuadros más — el mismo defecto, corrido. Habría que tocar dos campos en dos lugares (`cuerpoNuevo()`, `devolver()`). Y no arregla nada del nivel: el que espera sigue cayendo en el cuadro 0, toda vuelta a esa entrada es una caída —`UX-29 §3` la quiere *de una*— y la entrada arriba de un molinete sigue en su vuelta infinita. **El mundo sería honesto sobre un nivel que sigue roto** |
| ✕ | **Las dos cosas: la regla, y el cálculo de respaldo** | Dos lugares que dicen dónde puede empezar un cuerpo (`FIND-58`). Con la regla, el cálculo nunca da otra cosa que `true`, y un código que nunca cambia un resultado no lo prueba nada |
| ✕ | **Dejárselo al solucionador**, que ya maneja la raíz flotante | Encuentra traza igual —el que flota cae primero—, y la traza no ve la vuelta a esa entrada porque no vuelve nadie (regla 6 de `CTR-18.6`). La entrada arriba del molinete daría "sin solución" sin nombrar la causa |
| ✕ | **La misma regla para las puertas** | Por lo dicho dos párrafos antes: el código no supone nada de ellas, y la regla prohibiría la puerta sobre una caja |

---

### CTR-16.6 — `D-40` hecho cumplir por el schema, no por la buena voluntad

> **Enmendado el 2026-09-22 por `CTR-16.10` (`T-264`): `sostenido` y `alternativaSolo` salen
> del schema, y lo que protegían queda más protegido que antes, no menos.** Este bloque
> obligaba a declarar a mano qué mecanismo pedía dos cuerpos y a escribir en prosa la
> segunda solución, porque el schema no podía separar presencia de entrada (`BR-25` c) ni
> probar que un nivel se resuelve. Eso dejó de ser cierto por tres lados:
>
> 1. **La simultaneidad de entrada ya no se puede construir con las piezas que hay.**
>    `CTR-16.10` regla 1: ninguna pieza tiene reloj. Lo único que una placa pide es
>    **presencia**, y la presencia la cumple el que juega solo dejando a uno quieto encima
>    (`UX-28 §3`) o dejando una caja. Este bloque decía que `sostenido: true` *"pide dos
>    cuerpos a la vez"*: los pide, pero de presencia — y eso `BR-25` (c) lo permite.
> 2. **`sostenido` quería decir "placa", y eso ahora lo dice la leyenda** (`=`, `CTR-16.4`),
>    que es lo que corre la física. No queda un segundo lugar donde declararlo distinto, que
>    era justo la forma de esquivar esta regla que el texto de abajo dejaba en manos de
>    `revisor` ("una mentira escrita a mano").
> 3. **La segunda solución deja de ser prosa y pasa a ser prueba:** la traza de uno solo de
>    `CTR-18` (`T-263`), grabada al lado del nivel y repetida por el build (`T-267`). Una
>    frase no gana un nivel; una traza sí. Es lo que `BR-25` (b) pedía — *"no 'se puede',
>    sino así se hace"* — dicho por una máquina.
>
> **Cuándo salen, para que no haya un solo commit sin segunda solución escrita:** en
> `T-272`, que depende de `T-267`. Cuando `alternativaSolo` se va, la traza ya está en el
> schema. Y de paso, porque lo iba a copiar alguien: el ejemplo de abajo decía *"la caja de
> [7,9]"*, y la fila 9 no existe desde `FIND-55` (son 0 a 8). El texto original queda
> debajo, como registro de por qué existió.

`D-40` consecuencia 1 dice, textual: queda prohibido **por construcción** el puzzle que
**exige** simultaneidad, salvo que tenga una segunda solución para el que juega solo. Un
schema no puede probar que un nivel se resuelve; **sí puede hacer imposible declararlo sin la
segunda solución.**

```json
"sostenido": true,
"alternativaSolo": "la caja de [7,9] tapa la placa y la deja abierta"
```

- **`sostenido: true`** quiere decir que el mecanismo solo aguanta mientras alguien lo pisa —
  o sea, que pide dos cuerpos a la vez.
- **Cuando `sostenido` es `true`, `alternativaSolo` pasa a ser obligatorio** y con texto de
  verdad (`minLength: 10`). Se hace con un `if`/`then` del schema, que es JSON Schema 2020-12
  estándar y `ajv` ya lo corre.
- **No hay manera de esquivarlo:** `sostenido` es obligatorio en todo mecanismo, así que un
  puzzle simultáneo declarado como no-simultáneo es una mentira escrita a mano, no un
  descuido. Y una mentira escrita a mano la caza `revisor` jugando, que es lo que le toca.

Esto es lo más importante de todo el contrato y por eso tiene sección propia: es la única
consecuencia de `D-40` que, si no se escribe **antes** de que se dibuje el primer nivel, sale
carísima después.

---

### CTR-16.7 — `listo` cuesta dos pasadas: una de la máquina, una de dos personas

> **Enmendado el 2026-09-23 (cierre de la ráfaga 1): `verificaciones.solo` se retira.** Esta
> sección pedía dos booleanos escritos a mano, `deDos` y `solo`, y el schema exigía los dos en
> `true` para `listo`. El 2026-09-22 `ADR-09.3` le cambió el sentido a `solo` —"se pasa solo"
> ya lo probaba la traza, así que pasaba a decir "una persona sola lo jugó en el teléfono"— y
> dejó escrita una salida: si `BR-29` no le dejaba al pulgar nada del modo solo, el booleano se
> retiraba en la versión 2. **`BR-29` punto 1 le dio (b), (c) y (d) enteras a la traza, y el
> punto 4 lo retiró** (`Docs/SUGERENCIAS/PRD-para-arquitectura-verificaciones-solo-se-retira.md`).
> El título decía *"`listo` cuesta dos pasadas"* y lo sigue diciendo: lo que cambió es quién
> da cada una. El texto original queda al final de la sección.

```json
"verificaciones": { "deDos": true }
```

**Las dos pasadas de `D-40` consecuencia 2 siguen siendo dos**, y cada una se prueba donde se
puede probar:

| Pasada | Qué prueba (`BR-25`) | Dónde vive | Quién la da |
|---|---|---|---|
| **De uno** | (b), (c), (d) y (f): se pasa solo, nada pide dos dedos a la vez, el que espera queda quieto, la paridad | la traza `deUno` de `skayboy-soluciones.json` (`CTR-18`), repetida por `soluciones.test.ts` en cada build | la máquina, **para todo nivel del banco, esté en `borrador` o en `listo`** |
| **De a dos** | (a): dos personas a la vez, en un teléfono, lo terminan | **`verificaciones.deDos`** | escrito a mano después de la partida en el teléfono (`ORQ-plan-ciclo-16.md §4` punto 3); lo escribe quien tenga con qué (`D-12`). *Los seis del banco no: ver la nota del 2026-10-02, abajo* |

> **Nota del 2026-10-02 (`FIND-89` de `REV-17`): los seis `deDos: true` del banco no salen de
> una partida.** Para `NIV-01` … `NIV-06`, lo que dice la fila de arriba no pasó. Los puso en
> `true` el hilo principal el 2026-10-01, cuando el usuario decidió publicar sin esa prueba
> (`D-51` punto 2). Nadie los jugó de a dos en un teléfono. **Se hizo cargo el usuario**, y
> eso es todo lo que prueba el booleano (lo dice el comentario del `allOf` de
> `skayboy.schema.json`). La pasada de uno sí está: la traza de `CTR-18` los juega en cada
> build. El JSON no tiene dónde anotarlo, porque `verificaciones` es `additionalProperties:
> false` a propósito (abajo). Por eso queda escrito acá, y ni el schema ni el contrato cambian.
> **Mientras esta nota siga abierta, un `deDos: true` de este banco no significa que dos
> personas lo jugaron.** Se cierra acá, con fecha, el día que lo jueguen.
>
> **Cerrada el 2026-10-02.** El usuario escribió, textual: *"Confirmo que los niveles son
> jugables"* (`D-53`). Confirmó que los seis se juegan; no dijo si fue de a dos ni en qué
> aparato. **No alcanza para la fila (a) de arriba:** un `deDos: true` de este banco sigue sin
> decir que dos personas lo terminaron a la vez en un teléfono, y la salvedad de la celda se queda.

**El schema exige: si `estado` es `listo`, `verificaciones.deDos` es `true`.** El mismo
`if`/`then`, con un booleano menos. La pasada de uno **no es condición de schema, es condición
de build**: sin traza que gane, el nivel no entra al banco (`CTR-18.6` regla 1), y eso rige desde
`borrador`.

**Un booleano no prueba nada por sí mismo**, y eso no cambió: lo que hace es que nadie pueda
marcar un nivel como terminado sin haber escrito, con la mano, que dos personas lo jugaron. Es
el mismo mecanismo que un rótulo: no garantiza el contenido, garantiza que alguien se hizo
cargo. **Regla de oficio que hereda de `ADR-09.3`:** el que toca la grilla de un nivel pone
`deDos` en `false`.

**`verificaciones` sigue siendo un objeto, con un solo campo.** Aplanarlo a un `deDos` suelto
en el nivel sería un segundo cambio incompatible que no compra nada, y el objeto dice qué es
lo que hay adentro: el registro de quién lo jugó. **`additionalProperties: false` se queda, y
es la guarda de esta enmienda:** un `solo` que vuelve por costumbre —copiado de un nivel viejo o
de un ejemplo— no valida.

**Para pegar (`T-272`, en el mismo commit que `contratoVersion: 2`, `CTR-16.10.9` paso 6).** En
`src/data/_schema/skayboy.schema.json`, `$defs.nivel.properties.verificaciones` se reemplaza
entero por:

```json
"verificaciones": {
  "comment": "CTR-16.7 enmendado el 2026-09-23: una sola pasada escrita a mano, la de dos personas a la vez en un teléfono (BR-25 a, BR-29 punto 1). La de uno la prueba la traza en cada build (CTR-18) y no vive acá: `solo` se retiró (BR-29 punto 4, ADR-09.3). additionalProperties false es lo que impide que vuelva.",
  "type": "object",
  "additionalProperties": false,
  "required": ["deDos"],
  "properties": {
    "deDos": { "type": "boolean" }
  }
}
```

y el primer elemento de `$defs.nivel.allOf` por:

```json
{
  "comment": "CTR-16.7, que es D-40 consecuencia 2: `listo` cuesta dos pasadas. La de uno es de la máquina —la traza de CTR-18 gana en cada build, para todo nivel— y no es condición de este schema. La de dos es de dos personas en un teléfono (BR-25 a): el booleano no prueba que se jugó, prueba que alguien se hizo cargo de decir que sí.",
  "if": { "required": ["estado"], "properties": { "estado": { "const": "listo" } } },
  "then": {
    "properties": {
      "verificaciones": { "properties": { "deDos": { "const": true } } }
    }
  }
}
```

**En el mismo commit:** `NIV-01` en `src/data/skayboy.json` pasa a `"verificaciones": { "deDos":
false }`; la interfaz `Verificaciones` de `niveles.ts` pierde `solo`; y los niveles de prueba
escritos en TypeScript que lo traen (`mundo.test.ts:46`, `solucionador.test.ts:66`,
`esquemas.test.ts:124` y `:172`) lo pierden también. **Dos rojos a mano en `esquemas.test.ts`**,
que reemplazan al caso de hoy: `listo` con `deDos: false` no valida (señala
`/verificaciones/deDos`), y `deDos: true` con un `solo` de más no valida (señala
`/niveles/0/verificaciones` con *additional properties*: `erroresDeInstancia()`, en
`esquemas.test.ts:43-48`, no imprime el nombre del campo sobrante). El verde: `listo` con
`{ "deDos": true }`.

| | Opción | Por qué sí / por qué no |
|---|---|---|
| ✅ | **Un booleano, `deDos`; la pasada de uno es la traza** | Cada condición de `BR-25` se dice en un solo lugar, y el único booleano que queda dice algo que ninguna máquina puede decir |
| ✕ | **Sostener `solo` con el sentido de `ADR-09.3`** ("una persona sola lo jugó y se deja jugar") | `BR-29` punto 4: la única sensación que le quedaba —que nada pida precisión de un cuadro— ya es un número, la tolerancia por escalón (`BR-29` punto 3). Un campo que nadie tiene motivo para escribir se llena por costumbre, y ahí miente |
| ✕ | **Que `listo` pida además que la traza gane, dentro del schema** | Un schema no juega trazas. Y no hace falta: la traza ya es condición de build para todo nivel, antes de `listo` |
| ✕ | **Aplanar `verificaciones` a un `deDos` suelto** | Arriba: un cambio incompatible más, sin nada a cambio |

> **Texto original (2026-09-16), como registro.** El bloque de ejemplo traía los dos booleanos,
> `deDos` y `solo`, en `true`. Decía: *"El schema exige: **si `estado` es `listo`, los dos
> booleanos tienen que ser `true`.** Otro `if`/`then`. Es `D-40` consecuencia 2 vuelta
> contrato: 'cada uno se verifica dos veces —dos personas moviéndose a la vez y una sola
> alternando'. Seis niveles que valen por doce en diseño, no doce niveles. **Quién los pone en
> `true`:** el que probó, y es `revisor` (`D-12`: los cuatro roles que escriben no tienen con
> qué correr nada)."* Los seis niveles ya no valen por doce partidas: valen por seis, más una
> traza que la máquina repite gratis.

---

### CTR-16.8 — Qué le llega al navegador, y los límites de módulo

La página resuelve el banco en build y le manda al navegador **solo los niveles `listo`**,
sembrados como `<script type="application/json">`, igual que `dos-ejes`
(`dos-ejes.astro:82`). Seis niveles son un par de KB: no hace falta pedirlos por red ni
partirlos.

Los módulos y sus límites, que es lo que evita el defecto de `D-29`:

| Módulo | Qué hace | Qué **no** puede importar |
|---|---|---|
| `src/lib/skayboy/niveles.ts` | tipos del dato y las funciones puras que lo leen | nada de `node:*`, nada de `sitio/arte.ts`, nada del motor |
| `src/lib/skayboy/copy.ts` | el texto visible | idem. **Y entra a `MODULOS` de `voz.test.ts`** (`ADR-08.8`) |
| `src/scripts/partida-skayboy.ts` | la isla: lo único que importa el motor | nada de `node:*`. Es el único archivo del repo con un import desnudo de npm, y está en la lista blanca de `ADR-08.7` |
| `src/lib/skayboy/sonido.ts` | los efectos de `CTR-17` | el motor, y cualquier cosa que cree un `AudioContext` que no sea `contexto.ts` |
| `src/lib/skayboy/avance.ts` *(sumado el 2026-09-24, `CTR-16.11`)* | el avance guardado: leerlo, sumarle un nivel, elegir el siguiente de la fila. Todo puro salvo dos funciones chicas que tocan `localStorage` | el motor, el DOM, `node:*`. Toca `localStorage` solo adentro de esas dos, con `try`/`catch` |
| `src/lib/skayboy/pantalla.ts` *(sumado el 2026-09-24)* | `encuadre()`: la escala entera del modo de pantalla completa | su tabla vive en `ADR-10.6` (`ARQ-pantalla-completa.md`), no acá |

**La isla no lee `src/data/` en tiempo de ejecución.** Lee el `<script type="application/json">`
que la página ya sembró. Un `import` de JSON dentro de la isla mete el banco entero al bundle,
incluidos los `borrador`.

**Los seis niveles en fila viven en la isla** *(sumado el 2026-09-24, `D-47` punto 2)*. Pasar al
siguiente es crear un mundo nuevo (`crearMundo(banco, siguiente)`) con el mismo motor y los
mismos atlas. **No se navega ni se recarga la página**, por dos razones: una navegación saca de
la pantalla completa del sistema (`ADR-10`), y la página ya sembró todos los niveles que hay para
jugar. Qué nivel es "el siguiente" lo dice `CTR-16.11`.

> **Sumado el 2026-09-23 (deuda de `ADR-09`, consecuencia 3).** Los módulos de la solución
> grabada —`soluciones.ts`, `solucionador.ts`, `scripts/resolver-niveles.mjs`— y el archivo
> `skayboy-soluciones.json` tienen su tabla en **`CTR-18.11`**, y **ninguno entra a la isla ni a
> la página**: lo caza la regla 10 de `CTR-18.6`. No se copian acá para que la tabla viva en un
> solo lugar. `mundo.ts` suma `CUADRO_SEG` (`ADR-09.1`), y sigue sin importar nada de lo de
> arriba.

---

### CTR-16.9 — Lo que este contrato deja abierto a propósito

| Qué | De quién |
|---|---|
| **El piso de niveles** y el criterio Given/When/Then | `producto` al promover (`BR-16`). La lectura que existe es 2/2/2, y `escalon` está en el schema para que ese número sea verificable |
| **`temaFijo`** | `contenido` con `experiencia` (`D-39` consecuencia 3) |
| **El reparto de `devuelve`** — qué molinete rechaza a quién | `experiencia` con `contenido`. Es criterio del sitio y no se explica en ninguna pantalla. (Se llamaba "el reparto `inmuneA` / `mata`" hasta `FIND-58`) |
| **El rango por letra** de `RES-61.8` | **No está en este schema, y es a propósito.** `RES-61.8` avisa que el umbral de tiempo no se puede copiar de ningún lado y que es trabajo de afinación. Si `producto` lo quiere, entra como **la versión siguiente a la vigente** con un campo `tiempoObjetivo` por nivel. Mientras tanto, **no se promete un puntaje que no está**. *Enmendado el 2026-09-23: decía "entra como `contratoVersion: 2`", y la 2 ya es la de `CTR-16.10` con la baja de `verificaciones.solo` (`CTR-16.10.9`, `CTR-16.7`): `tiempoObjetivo` sería la 3.* *Enmendado otra vez el 2026-09-24: la 3 es la de los coleccionables de `D-47` (`CTR-16.4`). `tiempoObjetivo` sería la 4* |
| **Los mecanismos que el juego de origen suma después** —espejos, portales, hielo, ventiladores (`RES-61.12` … `RES-61.15`) | Ampliación de un ciclo posterior. La leyenda es abierta por diseño: sumar un `tipo` es sumar una entrada al `enum` del schema y un tile. *Enmendado el 2026-09-22:* **cualquier `tipo` nuevo tiene que pasar las cuatro reglas de `CTR-16.10`**, y por eso **las plataformas móviles y los ascensores (`RES-61.6`) no entran ni como ampliación** sin una decisión nueva: mueven al que espera (regla 2) y llevan reloj (regla 1) |
| *(Sumada el 2026-09-22)* **El sonido de palanca, placa y compuerta** | Hoy no suenan, con fundamento (`CTR-16.10.7`). Si el teléfono dice que la palanca se siente muerta, es una enmienda de `CTR-17` en el ciclo 17, y el único candidato es la palanca |
| *(Sumada el 2026-09-22)* **Los callejones sin salida** —una caja contra la pared, un pozo más hondo que el alcance— | No son física, son nivel, y la traza no los ve (`CTR-16.10.11`). Si un nivel puede tenerlos es de `producto`; qué hace el que cae en uno, de `experiencia`. Traspaso en `Docs/SUGERENCIAS/ARQ-para-experiencia-y-producto-mecanismos-y-callejones.md` |
| *(Sumada el 2026-09-24, `D-47`)* **Cuántos coleccionables por nivel como mínimo, y si cada uno tiene que probarse alcanzable** | `producto` (`BR-31`). El contrato exige la igualdad (`E10`). Si hay mínimo, entra en la misma prueba. Si hace falta probar que se alcanzan, la recomendación está al final de `CTR-16.4` y la enmienda de `CTR-18` sería mía |
| *(Sumada el 2026-09-24, `D-47`)* **Qué pasa con la fila completa**: qué se ve al ganar el sexto y qué se juega al volver con los seis pasados | `producto` (`BR-31` punto 1) con `experiencia` (`UX-33`). `CTR-16.11` devuelve `null` como "no queda ninguno" y no decide qué se muestra |
| *(Sumada el 2026-09-24, `D-47`)* **Si el avance guarda también los coleccionables** | `producto` (`BR-31`). Hoy no se guardan. La forma en que entrarían sin cambiar la clave está en `CTR-16.11` |

---

## CTR-16.10 — Los mecanismos del escalón Media: palanca, placa, compuerta y caja

- **Fecha:** 2026-09-22 (ciclo 16, `T-264`).
- **Estado:** **vigente para construir.** Lo programa `T-272` —mundo, schema, dato y
  pruebas— después de `T-267`; lo dibuja `T-276` (`D-44`); diseñan niveles con esto `T-265`
  y `T-277`. No deja ningún valor abierto que sea mío: lo que queda afuera tiene dueño en
  `CTR-16.10.11`.
- **Para quién es:** para `T-272`, que tiene que poder programarlo sin preguntar; para
  `T-266`, que lo busca; para quien dibuja y quien diseña niveles; y para `revisor`, que
  tiene que poder rechazar un comportamiento citando una línea.

> **De dónde sale el comportamiento, para que nadie lo lea como copia.** `RES-61.4` y
> `RES-61.5` fundan que estas cuatro piezas son las del género: palancas y placas con las
> que uno le abre paso al otro, cajas que sirven de escalón o de tapón. **Ninguna ficha dice
> cómo se comporta cada una fino a fino, y no hace falta pedirla:** todo lo que sigue es
> criterio del sitio, deducido de reglas que ya estaban escritas acá. Donde el juego de
> origen haga otra cosa, manda esto — que es además la lectura que `INV-60` dejó sobre
> `RES-60.4` y `RES-60.5`: la mecánica del género se toma, la expresión concreta no.

### La decisión: cuatro reglas, y todo lo demás sale de ellas

1. **Ninguna pieza tiene reloj.** Nada se abre por un rato, nada se cierra después de un
   rato, nada arranca a moverse sin que alguien lo empuje (lo que sigue después es la
   gravedad, o el tramo de una caja que ya empujaron: `CTR-16.10.5`). Una compuerta está
   como la dejan sus mecanismos **en el mismo cuadro** — salvo que tenga a alguien adentro,
   y eso depende de dónde está alguien, no de cuánto tiempo pasó (`CTR-16.10.4`). Es la
   regla que convierte `D-40` consecuencia 1 en algo que se cumple por
   construcción: sin tiempo en ninguna pieza **no hay con qué armar un puzzle de
   simultaneidad de entrada** (`BR-25` c). Lo único que estas piezas pueden pedir es
   presencia, y la presencia la cumple el que juega solo dejando a uno quieto (`UX-28 §3`).
2. **Nada le mueve el piso a un cuerpo, salvo su propia columna de mando.** Ni el otro, ni
   una caja, ni una compuerta. Es `BR-23` punto 4 (nadie es carga del otro), `BR-25` (d)
   (quedarse quieto no te pierde) y `UX-28 §3` dichos en física: *"nada lo alcanza mientras
   nadie lo toca"*.
3. **El que ocupa, gana.** Una compuerta no se cierra sobre nadie; una caja no se empuja ni
   cae sobre nadie. Ninguna pieza tiene con qué lastimar porque **ninguna tiene fuerza: solo
   ocupan lugar libre.** Es `BR-24` y `UX-29 §6` sin excepción, en un juego donde por primera
   vez las cosas se mueven.
4. **El orden en que el mundo recorre a los dos no decide nada.** `mundo.ts` mueve primero a
   `skayboy` y después a `poligirl` (`PERSONAJES`). Los mecanismos se resuelven **después de
   mover a los dos** en cada subpaso, y cuando los dos hacen cosas opuestas en el mismo
   subpaso, **se anulan**. Un empate que siempre gana el primero de una lista es `BR-23` roto
   por el costado del código, y no lo vería nadie jugando.

---

### CTR-16.10.1 — Qué se escribe dónde: la grilla dibuja, los arreglos conectan

Es la regla que `FIND-58` dejó para la leyenda —un hecho, un lugar— aplicada a las piezas:

| Qué | Dónde vive | Qué **no** vive ahí |
|---|---|---|
| Qué es cada celda: palanca, placa, compuerta, dónde arranca una caja | **la grilla**, con su caracter de la leyenda | nada más |
| Con qué compuertas se conecta una palanca o una placa | **`mecanismos[].abre`** | si es palanca o placa: lo dice la celda `en` |
| Cómo se llama una compuerta | **`compuertas[].id`**, con `en` en la celda de arriba de su tramo | hasta dónde llega: lo dibuja la grilla |
| Dónde arranca una caja | **la grilla** (`n`) | **el arreglo `cajas` se va**: solo traía `en`, que la grilla ya decía, y una caja no se conecta con nada |

**La leyenda** suma `palanca` (`/`), `placa` (`=`) y `compuerta` (`|`), y pierde `mecanismo`
(`CTR-16.4`, enmendado). Los caracteres se eligieron porque dibujan —una palanca inclinada,
una chapa en el piso, una pared que se corre— pero **son dato, no contrato**: las pruebas
buscan por `tipo`, no por caracter, igual que con los molinetes.

**El nivel** trae dos arreglos, obligatorios aunque vayan vacíos (`[]` dice "no tiene"):

- **`mecanismos`**: `{ "id": "MEC-NN", "en": [col, fila], "abre": ["COM-NN", …] }`. Una
  entrada por cada celda `palanca` o `placa` de la grilla.
- **`compuertas`**: `{ "id": "COM-NN", "en": [col, fila] }`. Una entrada por **tramo** —la
  columna de celdas `compuerta` contiguas—, con `en` en la de arriba.

**Los ids son del nivel, no del archivo:** `MEC-01` de `NIV-03` y `MEC-01` de `NIV-04` son
dos cosas, porque `abre` nunca cruza de un nivel a otro. Dentro de un nivel no se repiten.

> **Enmendado el 2026-09-22: `abre` aceptaba `PUE-NN`, y ese prefijo no nombraba ninguna pieza del juego.** Ahora
> acepta `COM-NN` y **tiene que nombrar una compuerta de ese nivel**. Y la inversa: **toda
> compuerta la abre al menos un mecanismo** — una compuerta que no abre nadie es una pared
> disfrazada de puerta, el gemelo al revés del molinete que no devuelve a nadie y que
> `esquemas.test.ts` ya caza.

**Un nivel completo, válido contra el schema de `CTR-16.10.9` y contra las pruebas de
`CTR-16.10.10`**, con las cuatro piezas. Es además la sala de prueba que el plan le pide a
`T-272` —*"caja sobre placa"*—, porque acá la caja no es opcional:

```json
{
  "id": "NIV-03",
  "nombre": "",
  "escalon": 2,
  "estado": "borrador",
  "grilla": [
    "###############",
    "#......#...#..#",
    "#......#...#..#",
    "#......#...#..#",
    "#......#...#..#",
    "#......|...|..#",
    "#......|...|..#",
    "#1.2n=.|./.|AB#",
    "###############"
  ],
  "mecanismos": [
    { "id": "MEC-01", "en": [5, 7], "abre": ["COM-01"] },
    { "id": "MEC-02", "en": [9, 7], "abre": ["COM-02"] }
  ],
  "compuertas": [
    { "id": "COM-01", "en": [7, 5] },
    { "id": "COM-02", "en": [11, 5] }
  ],
  "verificaciones": { "deDos": false }
}
```

*(Enmendado el 2026-09-23: `verificaciones` traía también `solo`, retirado por `CTR-16.7`. Y
la frase que seguía al ejemplo decía "Más lo que sume `CTR-18` para la traza": no suma nada,
la traza vive en su propio archivo, `ADR-09.2`. Las dos entradas cumplen la regla 3 de
`CTR-16.5`: sólido abajo, aire arriba.)* Los dos entran por la izquierda y salen por la
derecha. La placa (`MEC-01`) abre la primera compuerta **mientras algo la pisa**: si la pisa
uno, pasa el otro y el que pisaba queda del lado equivocado, sin nadie que le devuelva el
favor. **La caja arriba de la placa** —o trabada adentro de la compuerta abierta, que
también vale (`CTR-16.10.4`)— es lo que deja pasar a los dos. La palanca (`MEC-02`) queda
para el lado que la cruzás: el primero que pasa hacia la derecha abre la segunda, y queda
abierta para el otro.

---

### CTR-16.10.2 — La palanca: queda para el lado que la cruzaste

| | |
|---|---|
| Dónde va | una celda `palanca` con sólido (o el borde de la sala) **abajo** |
| Para un cuerpo | aire: se camina a través |
| Para una caja | no entra (`CTR-16.10.5`) |
| Estado | activa o en reposo. **Arranca en reposo.** Mientras está activa, sus compuertas están mandadas abiertas |

**Cómo se mueve, sin tecla nueva** (`UX-28 §2.1`: tres teclas, tres toques, ninguna más):
**un cuerpo en el suelo, con los pies en la fila de la palanca, cuyo centro cruza el centro
de la celda.** Cruzándola hacia la derecha queda activa; hacia la izquierda, en reposo. Es
una palanca de verdad: la empujás con el cuerpo para el lado que caminás.

**Qué no la mueve:**

- **Saltarla por arriba.** Es la manera de cruzar sin tocarla, y es a propósito.
- Pararse encima y darse vuelta: sin cruce no hay cambio.
- Una caja.
- **Volver a la entrada** (`UX-29 §3`): la vuelta cambia de lugar de una, no es un
  recorrido, y no cruza nada en el camino.
- Dos cuerpos que la cruzan en sentidos opuestos en el mismo subpaso: se anulan (regla 4).

**Por qué por sentido y no "cada cruce la da vuelta":** así volver sobre tus pasos no
deshace lo que hiciste. Cruzarla dos veces para el mismo lado la deja igual, y **lo que se
ve —para qué lado está— es lo que elegiste.** Una palanca que se da vuelta cada vez que
pasás obliga a acordarse de cuántas veces pasaste, que es precisión fina con otro nombre.

---

### CTR-16.10.3 — La placa: abre mientras algo la pisa

| | |
|---|---|
| Dónde va | una celda `placa` con sólido (o el borde de la sala) abajo |
| Para un cuerpo | aire |
| Para una caja | aire: **una caja puede quedarse arriba**, y ese es el punto |
| Estado | pisada o libre, **en el mismo subpaso** en que cambia lo que tiene encima |

**Pisada** quiere decir: un cuerpo **en el suelo** con el punto medio de los pies en la
columna de la placa y los pies en su piso —la misma medida que `estaEnSuPuerta()`, *"casi
adentro cuenta"*—, **o** una caja quieta en esa celda. Un cuerpo en el aire no la pisa: el
que salta de una placa la suelta.

**El que espera la pisa para siempre, y eso es lo que la hace legal.** *"Uno la pisa para
que pase el otro"* es presencia (`BR-25` c): el que juega solo deja a uno sin dedo encima
parado en la placa (`UX-28 §3`) y agarra al otro. **La caja arriba de la placa** —el tapón
de `RES-61.5`— es la otra manera de dejarla pisada, y la única cuando el que pisaba también
tiene que pasar.

**Reemplaza a `sostenido`** (`CTR-16.6`, enmendado): una placa era un mecanismo sostenido,
y ahora lo dice la celda.

---

### CTR-16.10.4 — La compuerta: una pared que se corre, y no se cierra sobre nadie

**La forma, y por qué es la que es.** Una compuerta es un **tramo vertical** de celdas
`compuerta` en una columna, **de sólido a sólido**: arriba de la celda de arriba hay sólido
(o el borde de la sala), y abajo de la de abajo, también. La consecuencia es la buscada:
**arriba de una compuerta no puede haber nadie**, ni un cuerpo ni una caja, así que abrirla
nunca le saca el piso a nadie (regla 2). **No hay compuertas horizontales:** un piso que se
abre deja caer al que espera arriba, y por la mano del otro.

| Estado | Para cuerpos y cajas |
|---|---|
| **Cerrada** (es la de arranque) | sólido |
| **Abierta** | aire |

**Qué la manda.** Está **mandada abierta si cualquiera de sus mecanismos** está activo o
pisado: uno alcanza. Así cada lado de una compuerta puede tener su palanca o su placa, y
**el que llega primero le abre al otro**, que es la paridad de `BR-23` punto 1 hecha algo
que se puede programar en un nivel.

**Abrir es inmediato** (arriba no hay nadie). **Cerrar también, salvo en un caso, que es la
pregunta que había que contestar:**

> **Si se manda a cerrar con alguien adentro, no se cierra.** Mientras la caja de colisión
> de un cuerpo, o una caja, toque cualquier celda del tramo, la compuerta **se queda
> abierta y espera**. Se cierra en el primer subpaso en que el tramo queda libre. No
> devuelve a nadie a la entrada, no empuja a nadie para ningún lado, no suena, no dice nada:
> **se queda abierta.**

Por qué esa y no las otras tres:

- **Devolverlo a la entrada** sería el fallo de uno causado por el otro (`UX-29 §3`: *"el
  otro no se entera"*; `§6` prohíbe *"que el fallo de uno afecte al otro"*), y si el de
  adentro es el que espera, es `BR-25` (d) roto de frente.
- **Empujarlo afuera** es mover un cuerpo con algo que no es su columna (regla 2). ¿Para qué
  lado? El de atrás puede ser un molinete.
- **Cerrarse igual** es aplastarlo (`BR-24`, `UX-29 §6`).

**Abierta o cerrada se dibuja de una**, como la vuelta a la entrada: sin animación de
apertura. Lo que se ve es el estado de ese cuadro, y una compuerta dibujada a medio cerrar
mientras la física ya la tiene cerrada es la pantalla mintiéndole al que la está cruzando.

**Una consecuencia que conviene saber antes de diseñar: una caja que queda adentro de una
compuerta abierta la traba abierta.** Es el tapón de `RES-61.5` aplicado a una puerta, es
legítimo, y en el ejemplo de `CTR-16.10.1` es la segunda manera de pasar. Si un nivel no lo
quiere, el problema es del nivel, y el solucionador lo va a encontrar antes que cualquier
persona (`ORQ-plan-ciclo-16.md §6`, riesgo 3).

**No confundir con la compuerta de `ADR-08.1`**, la del motor: esa nunca aparece en el dato,
y en `skayboy.json` `compuerta` es siempre esta.

---

### CTR-16.10.5 — La caja: escalón y tapón, nunca martillo

**Qué es.** Un tile, **16 × 16 nativos**. Arranca en su celda `n`, apoyada en sólido o en
otra caja, y la celda de abajo del caracter es aire. **Nunca vuelve a la entrada:** los
molinetes devuelven cuerpos (`CTR-16.4`), no cosas.

> **Ojo con el nombre en el código.** En `mundo.ts`, `CAJA_ANCHO` y `CAJA_ALTO` son la caja
> de colisión **del cuerpo** (`CTR-15.3`). En este documento "caja" es siempre la que se
> empuja. Dos cajas distintas en el mismo archivo es un defecto esperando: conviene que
> `T-272` renombre las constantes del cuerpo antes de escribir la primera línea de esta.

**Descansa siempre en la grilla.** Se mueve de a un tile: cuando la empujan arranca un tramo
hasta la celda siguiente, **y lo termina aunque el que empujaba se detenga.** Quieta, está
siempre en una celda. Eso compra tres cosas:

1. **Entra en un pozo de un tile sin apuntar.** Una caja de 16 de ancho libre en píxeles,
   sobre un hueco de 16, cae solo si queda alineada al píxel: precisión fina, la misma que
   `BR-29` va a medir en cuadros.
2. **"La caja está en la placa" es sí o no**, no un umbral.
3. **La sala quieta se puede escribir como una grilla**, que es lo que `T-266` cuantiza.

**Para un cuerpo es sólido por todos lados, y se le puede subir encima.** Es el escalón de
`RES-61.5`, y **sube el alcance un tile**: `ALCANCE_ALTO_TILES` se mide desde donde el cuerpo
está parado, y parado en una caja está un tile más arriba. El que diseña niveles lo cuenta.

**Se empuja caminando contra ella:** un cuerpo en el suelo, con los pies a la altura de la
base de la caja, caminando contra su costado. Se mueve a `VELOCIDAD_EMPUJE`, constante
provisional como las otras (`T-249`) y nunca mayor que `VELOCIDAD`. **El empujón no
arranca** —la caja no se mueve y el cuerpo frena como contra una pared— si:

1. **la celda siguiente no es libre para una caja** (tabla de abajo), o es otra caja: se
   empuja una por vez;
2. **tiene algo encima**, caja o cuerpo. Empujar una caja con el otro parado arriba es
   llevarlo (`BR-23` punto 4), y empujar la de abajo de una pila es mover dos;
3. **la caída no es limpia:** en la columna por la que caería, desde la celda de destino
   hasta donde apoyaría, hay un cuerpo o una celda donde una caja no entra (regla 3);
4. **los dos la empujan en sentidos opuestos en el mismo subpaso** (regla 4);
5. **otra caja que anda ya decidió apoyarse en ella.** Una caja que anda tiene decidido
   desde el arranque dónde queda: el tramo y la caída terminan en esa celda, y no vuelven a
   mirar abajo. Si ese apoyo es esta caja, esta caja es su piso desde ese subpaso. Empujarla
   dejaría a la otra quieta en el aire. Es el punto 2 corrido en el tiempo: *"algo encima"*
   incluye lo que **va a estar** encima. Con dos personas se llega: una empuja la caja de
   arriba y la otra, mientras esa todavía anda, empuja la de abajo (`mundo.ts`, la segunda
   mitad de `cajaEncima()`);
6. **es el apoyo de otra caja que arranca en el mismo subpaso.** Es el caso 5 con los dos
   empujones a la vez. Los arranques se deciden todos con la sala como estaba antes de mover
   nada, así que la de arriba ya contó con esta para apoyarse. Arranca la de arriba y esta
   no. El resultado es el mismo que si la de arriba se hubiera empujado un subpaso antes, y
   eso es lo que se busca: la física no distingue entre "a la vez" y "uno detrás del otro"
   (`mundo.ts`, `sostiene` adentro de `empujar()`);
7. **su camino pisa el de otra caja.** Una caja que anda reserva su camino entero: la celda de
   al lado y la columna por la que cae, hasta donde apoya. Una caja que entraría en ese camino
   no arranca, y esto extiende los puntos 1 y 3 a lo que otra caja ya reservó. Si dos cajas
   que arrancan en el mismo subpaso piden celdas que se pisan en la misma columna, **no
   arranca ninguna**. Si arrancara una sola, decidiría el orden de la lista de cajas, y eso
   es la regla 4 aplicada a las cajas (`mundo.ts`, `hayOtraCajaEn()` y `choca` adentro de
   `empujar()`). *(5, 6 y 7: sumados el 2026-09-24, ver abajo de la tabla.)*

| Una caja entra en | No entra en, y por qué |
|---|---|
| aire · placa · compuerta **abierta** | sólido · compuerta cerrada · otra caja · afuera de la grilla |
| **molinete**: la caja no vuelve a ningún lado, y el que se le para encima no toca el molinete de abajo. Es el **tapón de trampa** de `RES-61.5` | **palanca**: la taparía y la dejaría sin alcance |
| | **tesoro**: lo taparía |
| | **entrada, y la celda de arriba de una entrada**: el que vuelve a su entrada aparece ahí (`UX-29 §3`), y aparecería adentro de una caja |
| | **puerta, y la celda de arriba de una puerta**: el que llega a su puerta no entraría |

*Enmendado el 2026-09-24 (`T-291`, `FIND-72` de `REV-15`). La lista de "el empujón no arranca"
tenía los puntos 1 a 4, y el punto 3 decía solo "un cuerpo o una celda donde una caja no entra".
El código ya hacía los otros tres. Según `FIND-72`, el 5 y el 6 los agregó la corrección de
`T-272`, que cerró un `ALTA`. El contrato no los decía: quien programara solo con el contrato
habría hecho una caja que puede quedar quieta en el aire (sin el 5 y el 6) o dos cajas metidas
una en la otra (sin el 7). `FIND-72` nombraba el 5 y el 6. El 7 lo agregué al leer el mismo
código: es la misma familia de casos, y dejarlo afuera habría dejado el mismo hueco. Los tres
tienen su prueba con rojo en `src/lib/skayboy/mundo.test.ts`: el 5 y el 6 en "la caja que va a
apoyar en otra le reserva el apoyo…" (primera y segunda mitad), y el 7 en "una caja que anda
tiene su camino reservado, y dos cajas que piden el mismo lugar a la vez no arrancan".*

*Alternativa descartada, para los tres:* **que una caja en movimiento vuelva a mirar abajo en
cada subpaso y corrija dónde apoya.** Con eso sobrarían los puntos 5 y 7, porque ninguna caja
necesitaría reservar nada. Pero choca con lo que este apartado fija más arriba: la caja *"descansa
siempre en la grilla"*, y el tramo, una vez que arranca, se termina en la celda que se decidió.
Eso es lo que hace que la sala quieta se pueda escribir como una grilla (`T-266`). Además, si dos
cajas se mueven en el mismo subpaso y una apoya en la otra, lo que ve la de arriba dependería de
cuál de las dos movió primero el mundo, y eso es lo que prohíbe la regla 4.
*Alternativa descartada, para el 6:* **que arranquen las dos.** La de abajo se va y la de arriba
termina su caída en la celda que decidió, arriba de nada.
*Alternativa descartada, para el 6:* **que arranque la de abajo y no la de arriba.** Sería tan
determinista como la elegida, pero daría otro resultado que el caso 5, que es la misma situación
con un subpaso de diferencia. Que dos personas coordinen al cuadro no puede cambiar lo que pasa.

**Cae** con la misma `GRAVEDAD` y la misma `CAIDA_MAXIMA` que los cuerpos —una sola física—
y apoya alineada en sólido o en otra caja.

**¿Puede apretar a un cuerpo? No, y es por construcción.** Solo se mueve a lugar libre, y
para ella un cuerpo es sólido. La única manera de que una caja en movimiento y un cuerpo se
crucen es una **carrera**: alguien camina justo debajo de una caja que ya está cayendo, o
adentro de la celda a la que ya está yendo. Entonces **la caja frena contra el cuerpo y
espera** (`espera`) hasta que el lugar se libere, y sigue. No empuja, no aprieta, no
devuelve a nadie.

> **El residuo, declarado para que nadie lo descubra solo.** Una caja que espera arriba de
> la cabeza de alguien es un piso para el otro, y eso es un escalón humano con una caja en
> el medio: `BR-23` punto 4 por la puerta de atrás. **No se prohíbe en la física**
> —prohibirlo pide cajas que flotan o cuerpos que atraviesan cajas, y las dos cosas son
> peores— **se prohíbe en la solución grabada:** la traza de uno (`CTR-18`), que es la única
> que se graba (`CTR-18.4`), no pasa por ningún cuadro con una caja en `espera`, y
> `soluciones.test.ts` lo mira en cada cuadro (regla 11 de `CTR-18.6`). Solo se llega por una
> carrera, y en la traza de uno el que espera no se mueve (regla 7), así que **la única
> carrera posible es la del que juega con su propia caja**: la empuja al borde y se mete
> debajo mientras cae. Por eso la regla mira todos los cuadros y no solo los cambios de
> columna. **Un nivel que solo se pasa así no es un nivel, y para descartarlo alcanza la
> traza de uno:** si gana sin pasar por ahí, el nivel tiene otra manera. Lo que dos personas
> hagan con una carrera en el teléfono es física permitida, no prueba de nada.
>
> *Enmendado el 2026-09-23 (cierre de la ráfaga 1). Decía: "Solo se llega por una carrera,
> así que la traza de uno que cambia de columna con los dos quietos no lo produce; la de dos
> sí podría, y por eso la prueba mira las dos." Tenía dos errores. La de a dos no se graba
> (`CTR-18.4`), y lo que no se graba no se puede exigir en un test. Y la de uno sí podía
> producirlo, por la carrera del que juega con su propia caja: por eso ahora dice cuál es.*

**Qué recuerda.** Además de dónde está y si se mueve, la caja guarda `empujadaPor`: quién la
empujó la última vez, o nadie si la empujaron los dos a la vez. Sirve para saber quién abrió
una compuerta con una caja arriba de una placa (`CTR-16.10.7`).

**Lo que la caja no hace:** no se tira, no se levanta, no se lleva. Tirar de una caja pediría
una cuarta tecla o un gesto (`UX-28 §2.1`), y el callejón sin salida de una caja contra la
pared no desaparecería: se mudaría a otro lado (`CTR-16.10.11`).

---

### CTR-16.10.6 — Los dos cuerpos: se atraviesan

**Los dos cuerpos no chocan entre sí.** Se atraviesan: no se empujan, no se paran uno arriba
del otro, no se frenan. Es `BR-23` punto 4 cumplido de la manera más corta que existe
—*"ninguna mecánica convierte a un personaje en objeto que el otro levanta, empuja o
transporta"*—: sin contacto no hay con qué. Y es la regla 4 también, porque con cuerpos
sólidos, cuando los dos se empujan en el mismo subpaso, gana el que el mundo mueve primero.

**Lo que se pierde, dicho:** *"que uno le haga de escalón al otro"*, que `UX-27 §8.3` dejaba
pasar como mecánica que no narra. Aquella frase decía que no narra; `BR-23` punto 4,
posterior y específica, dice que una persona no es un objeto del otro, y cierra con cuatro
palabras: *"Cajas sí; personas no."* El escalón es la caja.

**Cuando se superponen, arriba se dibuja el que tiene el dedo**, que es el que se está
mirando; si lo tienen los dos o ninguno, el último que se movió. Nunca uno fijo arriba: es la
regla 4 en el dibujo, y la aplica `T-278`.

---

### CTR-16.10.7 — Lo que el mundo avisa, y por qué no suena

**Un suceso nuevo**, que se suma a los cuatro de `mundo.ts`:

```ts
| { readonly tipo: 'compuerta'; readonly id: string; readonly abierta: boolean;
    readonly por: IdPersonaje | null }
```

- **Se emite cuando la compuerta cambia de verdad**, no cuando cambia el mandato: al abrirse,
  y al cerrarse — también cuando se cierra tarde porque alguien estaba adentro.
- **`por`** es de quién fue el acto que cambió el mandato: el que cruzó la palanca, el que
  pisó o soltó la placa, o el `empujadaPor` de la caja que la pisa. **`null`** cuando no fue
  nadie: el cierre que esperaba a que el tramo se liberara (lo cerró el lugar), o el empujón
  de los dos a la vez.
- **Palanca y placa no tienen suceso propio.** Importa lo que le hacen a una compuerta: una
  palanca que se mueve mientras otra cosa mantiene abierta su compuerta no tiene nada que
  avisar.

> **Enmendado el 2026-09-23 (cierre de la ráfaga 1): faltaba qué vale `por` cuando el cambio
> lo hacen los dos en el mismo subpaso.** El punto de arriba nombraba un solo caso de dos
> —*"el empujón de los dos a la vez"*— y dejaba afuera el que la regla 4 deja más a mano:
> **los dos pisan la misma placa en el mismo subpaso.** La regla, entera:
>
> **`por` es el autor del cambio si es uno solo, y `null` si no.** En el subpaso en que el
> mandato de una compuerta cambia, se miran los mecanismos de esa compuerta que cambiaron en
> ese subpaso **en el mismo sentido que el mandato** y quién los cambió —el cuerpo que cruzó la
> palanca, el que pisó o soltó la placa, el `empujadaPor` de la caja que llegó o se fue—. Si
> todo eso es un mismo cuerpo, `por` es ese cuerpo. Si aparecen los dos, o una caja con
> `empujadaPor: null`, **`por` es `null`**. Casos: los dos pisan la misma placa; los dos
> cruzan la misma palanca para el mismo lado; uno pisa una placa y el otro cruza la palanca de
> la misma compuerta; a la placa llega la caja que empujó uno mientras el otro la pisa. **Vale
> igual al cerrar**: los dos se bajan de la placa en el mismo subpaso, un cierre con
> `por: null`.
>
> **La física no se anula, la autoría sí.** Los dos actos van para el mismo lado: la placa queda
> pisada y la compuerta se abre, como con uno. Lo que no se puede decir es de quién fue, igual
> que el `empujadaPor` de la caja que empujan los dos (`CTR-16.10.5`).
>
> | | Opción | Por qué sí / por qué no |
> |---|---|---|
> | ✅ | **`null`** | La regla 4 cumplida: el orden en que el mundo recorre a los dos no decide nada. Y es lo que ya valía para el empujón doble: una sola respuesta para "lo hicieron los dos" |
> | ✕ | **El primero que recorre el mundo** | Es `skayboy` siempre (`PERSONAJES`): la apertura doble sería suya por el orden de una lista. La regla 4 rota, y no lo vería nadie jugando |
> | ✕ | **Los dos**, con `por` como arreglo | Cambia el tipo del suceso para un caso que la cuenta de la paridad no puede ver —en la traza de uno se mueve un cuerpo por vez (`CTR-18.8`)— y no contesta la pregunta de la cuenta: si abrieron los dos y cruza uno, ¿se lo abrió el otro o se lo abrió él? |
> | ✕ | **Dos sucesos**, uno por autor | La compuerta cambió una vez: dos sucesos contradicen la primera línea de esta sección |
>
> Lo prueba `M7` (`CTR-16.10.10`).

**Quién lo usa:**

1. **La cuenta de la paridad** (`BR-23` punto 1, `BR-25` f), que `T-277` hace sobre las
   trazas. La lectura computable que propongo —la vara es `BR-23`, y el detalle de la cuenta
   es de `T-265` y `T-262`: si la leen distinto, manda la de ellos—: **X le abrió paso a Y**
   cuando a un suceso `compuerta` con `abierta: true` y `por: X` le sigue, antes de que esa
   compuerta se cierre, que Y ≠ X cruce su columna. Una caja usada de tapón sobre un
   molinete también abre paso, y esta lectura no la ve: si la cuenta la quiere, lo dice
   `BR-23`.
2. **La isla, que no lo hace sonar ni lo escribe.** El dibujo lee el estado del mundo, no el
   suceso.

**Por qué no suena, que era la pregunta.** El plan recomendaba no sumar un cuarto efecto en
este ciclo. No es "este ciclo no"; son cuatro motivos, y ninguno vence solo:

1. **La sala entera está a la vista:** 15 × 9 sin desplazamiento (`UX-27 §2`). Una compuerta
   que se abre se ve, y `CTR-17.6` ya decidió que lo que se ve alcanza y que lo que suena
   nunca es la única fuente.
2. **No queda registro libre.** `CTR-17.3` repartió tres registros entre tres efectos y le
   dejó al que sume un cuarto el trabajo de encontrarle uno que no choque con otro que pueda
   sonar al mismo tiempo. Una compuerta se abre justo cuando alguien salta o llega a su
   puerta.
3. **La placa titila.** El que salta encima la suelta y la vuelve a pisar en pocos cuadros;
   un sonido ahí tartamudea, y `CTR-17.4` corta en cuatro voces.
4. **El sonido se afina escuchando** (`CTR-17.3`), y el oído de este ciclo es el teléfono del
   final (`ORQ-plan-ciclo-16.md §4` punto 3), no este documento.

**Consecuencia: `CTR-17` no se enmienda y `sonido.ts` no nombra `compuerta`.** Si el teléfono
dice que la palanca se siente muerta, es la enmienda de `CTR-17` del ciclo 17 (`§5` del
plan), y **el único candidato es la palanca**: es un acto a propósito, uno por cruce, del que
tiene el dedo. Nunca la placa (titila) y nunca la compuerta misma (sonaría por lo que hizo el
otro).

**El lector de pantalla** tiene el suceso a mano si lo quiere, pero anunciarlo no es mío:
`UX-29 §5` pidió solo la vuelta a la entrada, y qué se anuncia es de `experiencia`.

---

### CTR-16.10.8 — Con qué tintas se dibujan: condición para `T-276`

El dibujo es del hilo principal (`D-44`). Lo que el contrato le pone como condición:

`UX-27 §4` reparte las 15 tintas en fijos (2), terreno (6), personajes (3 y 3) y objetos (1:
el coleccionable). **Palanca, placa, compuerta y caja no tienen franja propia y no piden una
tinta más.**

> **Enmendado el 2026-09-24 (`T-298`), a pedido de
> `Docs/SUGERENCIAS/UX-para-arquitectura-ctr-16-10-8-todavia-dice-16-tintas.md`.** Decía *"las 16
> tintas… objetos (2: la puerta y el coleccionable)"*. `UX-27 §4.1.2`, enmendado el 2026-09-23,
> le sacó la tinta a la puerta: son 15 y el tope de `CTR-15.4` sigue en 16. La fila de la puerta
> en la tabla de abajo pasa de tinta a **forma**, que es la salida 2 del traspaso: es la que
> sirve ahora que `T-290` dibuja la puerta abierta (`UX-32 §2.2`). **Y los coleccionables ahora
> son dos, uno por personaje** (`CTR-16.4`, `D-47`). Con qué tintas se dibujan es de `UX-33`, con
> dos condiciones: no hay tinta 17, y si hace falta la 16 nace en el lienzo (`diseno-marca.md`).
> La fila del coleccionable de la tabla sigue valiendo: ningún mecanismo toma su tinta.

**Van en la clave y la luz —los dos fijos— y se distinguen por forma.** El plan decía *"con
las del terreno y la clave"*, y se precisa, porque las seis del terreno no son neutrales: son
tres de cielo y tres de infierno (`UX-27 §4.1`). Por qué ninguna otra franja:

| Si se pintara con… | Se leería como… | Y eso rompe |
|---|---|---|
| una rampa de un elemento | "de Skayboy" o "de Poligirl", según quién camina ese terreno (`UX-30 §3`) | la paridad (`BR-23` punto 1): toda pieza de este contrato es **de los dos**, y el schema le prohíbe el `de` |
| las dos rampas mezcladas | el molinete que devuelve a los dos | que una pieza para usar parezca un peligro |
| *(enmendada el 2026-09-24: decía "la tinta de la puerta", que ya no existe)* **la forma de la puerta**: un vano, un marco, un dintel —cerrada o abierta (`UX-32 §2.2`)— | una salida, y "puerta" y "compuerta" ya comparten la mitad del nombre | la condición de victoria, que es llegar a la **puerta**. Sobre todo la compuerta **abierta**, recogida contra su anclaje: no puede parecerse a la puerta abierta |
| la del coleccionable | un premio | `UX-27 §9`: nada de brillos de recompensa |
| una de personaje | un pedazo de uno de los dos | `D-38` |

Si hace falta un medio tono, es **trama** de clave y luz (`UX-27 §9`: dither, no un color).

**El estado también va por forma, nunca solo por color** (`UX-27 §5.2`, y el primo de
`CTR-17.6`): la palanca **inclinada** a un lado o al otro; la placa **levantada** libre y **a
ras** pisada; la compuerta **llena** cerrada y **recogida** contra su anclaje de arriba
abierta. La caja no tiene estado. Qué forma exacta, es del que dibuja.

**Una condición que es la única cara: la compuerta cerrada no puede leerse como sólido.** Si
parece pared, nadie busca la palanca, y el nivel se vuelve un muro sin que falle una sola
prueba. Es forma otra vez —barrotes contra ladrillo, por ejemplo— y la mira `revisor` en la
hoja de contacto en blanco y negro (`UX-30 §7`), donde con dos tintas el color ya no ayuda y
queda solo la forma.

**Lo que `sala.test.ts` puede contar:** un tile por cada `tipo` de `CTR-16.4`, y **dos por
cada pieza con estado** —palanca, placa y compuerta—. La tinta 17 la caza el auditor de
paleta (`T-268`).

---

### CTR-16.10.9 — El schema, para pegar (`T-272`)

Qué se toca en `src/data/_schema/skayboy.schema.json`, en orden:

1. **`contratoVersion`: `{ "const": 2 }`.** El cambio es incompatible —un valor del enum que
   se va, un campo obligatorio que sale, otro que entra—, y `CTR-16.2` puso la versión adentro
   del dato para que eso se sepa mirando el JSON. **Si `T-267` ya la subió a 2 por la traza
   de `CTR-18`, no se sube de nuevo:** la versión 2 es la forma con la que cierra el ciclo 16,
   traza y mecanismos juntos, y ningún banco con una sola de las dos llega a producción (no
   hay un solo nivel `listo`).
2. **`$defs.elemento`**: nuevo. **`$defs.caracter`**: se reemplaza entero.
3. **`$defs.mecanismo`**: se reemplaza entero. **`$defs.compuerta`**: nuevo. **`$defs.caja`**:
   se borra.
4. **`$defs.nivel`**: en `required` sale `"cajas"` y entra `"compuertas"`; en `properties`
   sale `cajas` y entra el bloque de abajo. **Lo demás de `nivel` no se toca**, incluido lo
   que haya sumado `T-267`.
5. **El `comment` de la raíz** suma una cosa más que el schema no hace: no mira la grilla
   desde los arreglos (`CTR-16.10.10`). *(Sumado el 2026-09-23:)* ni si cada entrada tiene
   dónde pararse (`CTR-16.5` regla 3, `E8`).
6. *(Sumado el 2026-09-23.)* **`$defs.nivel.properties.verificaciones` y el primer elemento
   de `$defs.nivel.allOf`**: se reemplazan por los dos fragmentos de `CTR-16.7`, que retiran
   `solo`. Es otro cambio incompatible, y por eso va en esta misma versión 2 y no en una 3.

```json
"elemento": {
  "comment": "CTR-16.4 enmendado por CTR-16.10: de qué elemento es el molinete que devuelve a uno solo. Nombra el lugar; a quién rechaza lo dice `devuelve`, y eso es de experiencia (UX-30 §3).",
  "enum": ["cielo", "infierno"]
},
"caracter": {
  "comment": "El enum de `tipo` no trae ninguna palabra de daño (FIND-58, UX-29 §7.2). CTR-16.10 partió `mecanismo` en `palanca` y `placa` —la física las corre distinto y la diferencia vivía en un booleano del arreglo— y sumó `compuerta`.",
  "type": "object",
  "additionalProperties": false,
  "required": ["tipo"],
  "properties": {
    "tipo": {
      "enum": ["aire", "solido", "molinete", "tesoro", "entrada", "puerta",
               "palanca", "placa", "compuerta", "caja"]
    },
    "devuelve": { "$ref": "#/$defs/quienes" },
    "elemento": { "$ref": "#/$defs/elemento" },
    "para": { "$ref": "#/$defs/quienes" },
    "de": { "$ref": "#/$defs/quien" }
  },
  "allOf": [
    {
      "comment": "CTR-16.4: `devuelve` es la única declaración de quién no pasa, y es obligatoria en todo molinete.",
      "if": { "required": ["tipo"], "properties": { "tipo": { "const": "molinete" } } },
      "then": { "required": ["devuelve"], "properties": { "para": false, "de": false } }
    },
    {
      "comment": "CTR-16.10: el molinete que devuelve a uno solo dice de qué elemento es. El que devuelve a los dos no es de ninguno, y ningún otro tipo tiene elemento. Que sean uno de cielo y uno de infierno lo cuenta esquemas.test.ts: en un mapa no se cuenta por contenido.",
      "if": {
        "required": ["tipo", "devuelve"],
        "properties": { "tipo": { "const": "molinete" }, "devuelve": { "maxItems": 1 } }
      },
      "then": { "required": ["elemento"] },
      "else": { "properties": { "elemento": false } }
    },
    {
      "if": { "required": ["tipo"], "properties": { "tipo": { "const": "tesoro" } } },
      "then": { "required": ["para"], "properties": { "devuelve": false, "de": false } }
    },
    {
      "if": { "required": ["tipo"], "properties": { "tipo": { "enum": ["entrada", "puerta"] } } },
      "then": { "required": ["de"], "properties": { "devuelve": false, "para": false } }
    },
    {
      "comment": "El terreno que no le habla a nadie no nombra a nadie. Y palanca, placa, compuerta y caja son de los dos (CTR-16.10.8, BR-23 punto 1): un `de` en una palanca sería una palanca de uno.",
      "if": {
        "required": ["tipo"],
        "properties": { "tipo": { "enum": ["aire", "solido", "palanca", "placa", "compuerta", "caja"] } }
      },
      "then": { "properties": { "devuelve": false, "para": false, "de": false } }
    }
  ]
},
"mecanismo": {
  "comment": "CTR-16.10.1: una palanca o una placa. Cuál de las dos lo dice la celda `en` de la grilla y ningún otro lugar (`sostenido` era ese segundo lugar y se fue: CTR-16.6 enmendado). Acá vive solo con qué compuertas se conecta. Que `en` caiga en una palanca o una placa, que cada una tenga su entrada y que `abre` nombre compuertas del nivel lo verifica niveles.ts: un schema no mira la grilla desde un arreglo.",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "en", "abre"],
  "properties": {
    "id": { "type": "string", "pattern": "^MEC-\\d{2}$" },
    "en": { "$ref": "#/$defs/coordenada" },
    "abre": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": { "type": "string", "pattern": "^COM-\\d{2}$" }
    }
  }
},
"compuerta": {
  "comment": "CTR-16.10.4: el tramo lo dibuja la grilla —una columna de celdas `compuerta`, de sólido a sólido— y acá se nombra, por su celda de arriba. Una entrada por tramo, y el anclaje, los verifica niveles.ts.",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "en"],
  "properties": {
    "id": { "type": "string", "pattern": "^COM-\\d{2}$" },
    "en": { "$ref": "#/$defs/coordenada" }
  }
}
```

Y adentro de `$defs.nivel.properties`, en el lugar de `cajas`:

```json
"compuertas": {
  "comment": "Obligatorio aunque vaya vacío, como `mecanismos`: `[]` dice «este nivel no tiene ninguna».",
  "type": "array",
  "items": { "$ref": "#/$defs/compuerta" }
}
```

**El dato, en el mismo commit** (`src/data/skayboy.json`): la leyenda queda como el bloque de
`CTR-16.4` —`elemento` en `C` e `I`, `/`, `=` y `|` con sus tipos nuevos—, y `NIV-01` cambia
`"cajas": []` por `"compuertas": []` **y pierde `solo` en `verificaciones`** *(sumado el
2026-09-23, `CTR-16.7`)*. `contratoVersion`, según el punto 1. La lista de archivos de prueba
que arrastra la baja de `solo` está en `CTR-16.7`.

---

### CTR-16.10.10 — Lo que el schema no puede, y tiene que ser prueba

**Estáticas, en `niveles.ts` (`problemasDelBanco`)**, para todos los niveles y cada una con
su caso en rojo:

| # | Regla | Por qué no la hace el schema |
|---|---|---|
| E1 | Cada `mecanismos[].en` cae en una celda `palanca` o `placa`, y cada celda de esas tiene **exactamente un** mecanismo | un schema no mira la grilla desde un arreglo |
| E2 | Cada tramo de `compuerta` tiene **exactamente una** entrada en `compuertas`, con `en` en su celda de arriba; ninguna entrada apunta a otra cosa | ídem |
| E3 | Ids únicos dentro del nivel; **cada id de `abre` es una compuerta de ese nivel**; **toda compuerta la abre al menos un mecanismo** | `uniqueItems` compara objetos enteros, no un campo, y JSON Schema no cruza dos arreglos. **Es la que cierra la `BAJA` del ciclo 15** |
| E4 | Anclajes: tramo de compuerta con sólido o borde **arriba y abajo**; palanca y placa con sólido o borde **abajo** | mirar la celda vecina es mirar un valor hermano |
| E5 | Toda caja de arranque apoyada: sólido, otra caja o borde abajo | ídem |
| E6 | Un nivel de `escalon` 3 no usa ningún `tipo` que no aparezca en algún nivel de escalón menor | es la regla del último escalón de `PRD-skayboy-y-poligirl.md` ("Qué enseña cada escalón"), y la cuenta la hace mejor un test que un script que hay que acordarse de correr |
| E8 | *(Sumada el 2026-09-23.)* **Cada entrada tiene dónde pararse** (`CTR-16.5` regla 3): abajo, `solido` o el borde; arriba, no es la fila 0 y la celda no es `solido` ni un `molinete` que devuelva a ese personaje. El mensaje nombra el nivel, el personaje, la celda y qué hay abajo o arriba. **Rojo:** la sala `FLOTA_POLIGIRL` de `solucionador.test.ts`, y una entrada con un molinete propio abajo | mira la celda vecina y lo que la leyenda dice de ella. (`E7` vive en `esquemas.test.ts`; por eso esta es la 8) |
| E10 | *(Sumada el 2026-09-24, `D-47`, `CTR-16.4`.)* **En cada nivel, tantas celdas del `tesoro` de `skayboy` como del de `poligirl`.** El mensaje nombra el nivel y las dos cuentas. **Rojo:** `NIV-01` con `"#A.g.1...2.g.B#"` (2 y 0) | contar caracteres de la grilla por lo que la leyenda dice de ellos. (`E9` vive en `esquemas.test.ts`) |
| E11 | *(Sumada el 2026-09-24, `CTR-16.11`.)* **Los niveles del banco van en orden de `id`, sin ids repetidos, y el `escalon` no baja de uno al siguiente.** Así el primero del arreglo (`nivelAJugar()`), el de `id` más chico (`T-253`, `CTR-16.5`) y el primero de la fila son el mismo nivel por construcción. **Rojo:** una copia del banco con `NIV-02` y `NIV-03` cambiados de lugar | `uniqueItems` compara objetos enteros, y el orden de un arreglo según un campo no se expresa en JSON Schema |

**Estáticas, en `esquemas.test.ts`:**

- **E7.** Los dos molinetes de uno solo son **uno de cielo y uno de infierno.** Va adentro de
  la cuenta de los tres (`problemasDeMolinetes`), con su caso en rojo.
- **E9.** *(Sumada el 2026-09-24, `D-47`.)* La leyenda tiene **exactamente un** `tesoro` de
  `skayboy` y **exactamente uno** de `poligirl`. Va al lado de la cuenta de los molinetes, por
  la misma razón. Rojos: la leyenda sin el de `poligirl`, y dos caracteres `tesoro` para
  `skayboy` (`CTR-16.4`, tabla de rojos).
- **`T-253` sigue la lista nueva** (`CTR-16.5`): molinete, palanca, placa, compuerta y caja en
  la grilla del primero, `mecanismos` y `compuertas` vacíos, y el caso en rojo nombrando los
  cinco **a mano**. El caso de *"una caja declarada y no dibujada"* se va con el arreglo: la
  grilla es el único lugar.
- **El caso de `CTR-16.6`** (*"un mecanismo sostenido sin `alternativaSolo` no valida"*) se va
  con los dos campos, y lo reemplaza el rojo de E3: **un `abre` que nombra una compuerta que
  no existe no pasa.** Los `abre` de prueba que quedan en ese archivo con el prefijo viejo
  pasan a `['COM-01']`.

**Dinámicas, en `mundo.test.ts`.** Las tres que el plan le pide a `T-272` y cuatro que este
contrato agrega porque son sus promesas *(eran tres: `M7` se sumó el 2026-09-23)*. Cada una con su rojo a mano, como manda el
encabezado de ese archivo:

| # | Caso | Verde | Cómo verla en rojo |
|---|---|---|---|
| M1 | **La placa sin nadie encima cierra** (plan) | un cuerpo pisa la placa y la compuerta se abre; se va, y se cierra en ese subpaso | dejar la placa enganchada |
| M2 | **La caja no atraviesa un sólido** (plan) | empujada contra sólido, contra compuerta cerrada y contra otra caja, no se mueve un píxel | sacarle a la caja el chequeo de celda libre |
| M3 | **Un cuerpo no empuja ni carga a otro** (plan, `BR-23` punto 4) | A camina a través de B y B no se mueve; A cae sobre B y apoya en el piso, no en B | hacer sólidos a los cuerpos entre sí |
| M4 | **La compuerta no se cierra sobre nadie** (`CTR-16.10.4`) | B adentro del tramo y la placa suelta: queda abierta, B no se mueve, ningún suceso `vuelta`. B sale: se cierra, con `por: null` | que se cierre igual |
| M5 | **La caja no cae sobre nadie** (regla 3) | B debajo de la cornisa y el empujón no arranca. Y en la carrera forzada, la caja frena contra B y en ningún cuadro se le mete adentro | sacar el chequeo de la columna de caída |
| M6 | **El que espera no se mueve, haga lo que haga el otro; y la sala quieta no cambia** (reglas 1 y 2) | en la sala de `CTR-16.10.1`, con B quieto en cuatro lugares —el piso, la placa, adentro de una compuerta abierta, arriba de la caja—, 2.000 cuadros de mandos al azar **con semilla fija** para A: B no cambia de `x` ni de `y`, y no hay `vuelta` de B. Después, sin mandos: una vez que todo apoya, 600 cuadros más no cambian nada salvo el reloj | darle a la compuerta una demora de cierre, o dejar empujar una caja con alguien encima |
| M7 | *(Sumada el 2026-09-23.)* **Lo que hacen los dos a la vez no es de ninguno** (`CTR-16.10.7`, regla 4) | los dos llegan a pisar la misma placa en el mismo subpaso —la prueba los puede poner a mano, a la misma distancia de lados opuestos—: **un** suceso `compuerta` con `abierta: true` y `por: null`. Se bajan en el mismo subpaso: **un** cierre con `por: null`. Control: uno solo pisa, y `por` es él | darle el `por` al primero de `PERSONAJES` |

M6 cuesta unos 11.000 cuadros: a la velocidad medida en `ORQ-plan-ciclo-16.md §1`, unos
50 ms. Es la prueba que más barato compra lo que el pulgar no puede probar: que ninguna
combinación de lo que hace uno alcanza al otro.

**Sobre la traza, en `soluciones.test.ts`** (el archivo es de `T-267`; la regla la suma el
primero que lo toque después de `T-272`): **la traza de uno no pasa por ningún cuadro con una
caja en `espera`** (`CTR-16.10.5`). Es la primera mitad de la regla 11 de `CTR-18.6`, y mira
**cada cuadro**, no solo los cambios de columna: la carrera que la produce es la del que juega
con su propia caja.

*Enmendado el 2026-09-23: decía "ninguna traza grabada pasa por un cuadro con una caja en
`espera`, ni la de uno ni la de dos". La de a dos no se graba (`CTR-18.4`), y lo que no se graba
no se puede exigir en un test. Para lo que la regla protege alcanza la de uno
(`CTR-16.10.5`, enmendado el mismo día).*

---

### CTR-16.10.11 — Lo que no entra, y lo que queda de otros

| Qué | Por qué no, o de quién |
|---|---|
| Plataformas móviles y ascensores (`RES-61.6`) | Mueven al que espera y llevan reloj: reglas 1 y 2. No entran sin una decisión nueva que las cambie |
| Compuertas horizontales, trampillas | Abrirse debajo de alguien le saca el piso, por la mano del otro: regla 2 |
| Temporizadores, compuertas que se cierran "en un rato" | Regla 1. Y un "corré antes de que se cierre" es precisión, que es lo que `BR-29` va a medir en cuadros |
| Una compuerta que piden dos mecanismos a la vez | Sería presencia, así que no rompe nada; no entra porque seis niveles no la necesitan. Si un nivel la pide, entra por decisión escrita |
| **Los callejones sin salida** | Una caja empujada contra una pared no vuelve —no se tira— y un pozo más hondo que el alcance no tiene salida. **No es física, es nivel, y la traza no lo ve:** prueba que hay un camino desde el principio, no que no exista un paso sin vuelta en el medio. El solucionador lo podría probar (desde todo estado alcanzable se sigue pudiendo ganar); si un nivel puede tenerlos es de `producto`, y qué hace el que cae en uno, de `experiencia`. Traspaso: `Docs/SUGERENCIAS/ARQ-para-experiencia-y-producto-mecanismos-y-callejones.md` |
| Lo que cuantiza `T-266` | Suma a la lista de `ORQ-plan-ciclo-16.md §2.1` cada palanca, cada compuerta **en su estado real** (no el mandato) y la celda de cada caja, con si se está moviendo. Y la traza de uno cambia de columna con los dos parados **y ninguna caja en movimiento** |
| Los archivos que `T-272` toca de más | La fila del plan nombra cuatro; el cambio arrastra otros. Traspaso: `Docs/SUGERENCIAS/ARQ-para-hilo-principal-lo-que-arrastra-ctr-16-10.md` |

---

### Alternativas descartadas

| Pregunta | Descartado | Por qué, puntual |
|---|---|---|
| Cómo se mueve la palanca | **saltando encima** | la tecla de saltar querría decir dos cosas; saltar *desde* una palanca la movería; y el efecto `salto` de `CTR-17` sonaría como si fuera ella |
| | **cada cruce la da vuelta** | volver sobre tus pasos deshace lo que hiciste, y el estado depende de cuántas veces pasaste |
| | **una tecla nueva** | `UX-28 §2.1`: tres teclas, ningún gesto. Una cuarta es algo que aprender antes de jugar, y en la columna no entra |
| | **que también la mueva una caja** | la cuenta de `BR-23` punto 1 pierde al autor, y una caja estacionada encima la tapa |
| La compuerta con alguien adentro | **devolverlo · empujarlo · cerrarse igual** | los tres motivos de `CTR-16.10.4` |
| | **cerrarse con demora**, para dar tiempo a cruzar | pone reloj (regla 1): con demora se arma el "corré antes de que se cierre", que es simultaneidad de entrada con otro nombre |
| El tipo del mecanismo | **un solo caracter `=` y `sostenido` en el arreglo**, que era lo que había | la grilla no muestra cuál es cuál, y la física corre una cosa mientras el dato puede declarar otra: `FIND-58` con otra ropa |
| A qué apunta `abre` | **a las puertas `A` y `B`**, de donde salía el prefijo viejo | una puerta no se abre: se llega (`CTR-16.5` regla 2) |
| Dónde vive una compuerta | **cada celda listada en el arreglo** | dos lugares que dibujan lo mismo; la grilla dibuja, el arreglo nombra |
| | **un caracter de leyenda por compuerta** (`a`, `b`…) | la leyenda es del archivo (`CTR-16.4`): un caracter por compuerta es un id de nivel en un lugar de archivo |
| La caja | **libre en píxeles, sin grilla** | cae en un pozo de su ancho solo si queda alineada al píxel; "pisa la placa" pasa a ser un umbral; el estado del solucionador deja de ser contable |
| | **que se apoye en un cuerpo** al caer | un cuerpo sosteniendo una caja que sostiene al otro es un escalón humano (`BR-23` punto 4) |
| | **que se pueda tirar** | cuarta tecla o gesto (`UX-28 §2.1`), y el callejón sin salida no desaparece: se muda |
| | **seguir en el arreglo `cajas`** | solo traía `en`, que la grilla ya decía: dos lugares para un hecho y ninguna conexión que lo justifique |
| Los cuerpos | **sólidos entre sí** | uno empuja al otro o se le para arriba (`BR-23` punto 4), y el orden del recorrido decide quién empuja a quién (regla 4) |
| Las tintas | **las del terreno**, como sugería el plan | cada una es de un elemento: la pieza parecería de uno de los dos (`CTR-16.10.8`) |
| El sonido | **un cuarto efecto ahora** | los cuatro motivos de `CTR-16.10.7` |
| **Qué es el fracaso, y cómo se narra** (`D-42` precisión 2) | Era de `producto` con `contenido`, y **`UX-29` lo cerró el mismo día**: no se muere nadie, a alguien lo devuelven a la entrada, el fracaso no suena y no cuesta vidas sino reloj. Este schema nunca tuvo campo de muerte y ahora no lo va a tener: lo que hay es `devuelve` (`CTR-16.4`). Lo que sigue siendo de `producto` es **cuánto cuesta el reloj y si hay tope** (`UX-29 §4`) |

---

## CTR-16.11 — El avance guardado en el aparato

- **Fecha:** 2026-09-24 (ciclo 16, ráfaga 5, `T-298`).
- **Estado:** **vigente para construir** (`T-302`). La parte de los coleccionables es
  **condicional**: no se guardan hasta que `BR-31` lo pida.
- **De dónde sale:** `US-09` criterio 9 con su enmienda del 2026-09-24: los seis niveles **en
  fila**, ganar el *n* habilita el *n + 1*, y *"el avance se guarda en el aparato
  (`localStorage`…), sin cuenta y sin sincronización"*, con el valor que ve la persona:
  **"hasta qué nivel llegó, un número entre 0 y 6, no un puntaje ni un tiempo"**. `D-47` punto 2.
  `ADR-04.5` para el espacio de nombres y para qué hacer cuando `localStorage` falla.
  *Enmendado el 2026-10-04: "ganar el n habilita el n + 1" ya no rige. `D-61` punto 2 abre los
  seis; la fila manda dónde se retoma, no qué se puede jugar (`CTR-16.11.2`).*

### CTR-16.11.1 — La clave y el valor

| | |
|---|---|
| **Clave** | **`arcade.skayboy.avance`**. Es literal: no se arma con el campo `juego` ni con el nombre del archivo. **Si el juego cambia de nombre** (`CTR-16.1`), la clave no se mueve, y nadie pierde lo que jugó. El `arcade.` es el espacio de nombres del sitio (`ADR-04.5`), y hoy la única otra clave es `arcade.cinta` |
| **Valor** | Texto JSON: `{"pasados":["NIV-01","NIV-02"]}` |
| **`pasados`** | Los `id` de los niveles ganados en este aparato, en el orden en que se ganaron, sin repetir. **Nada más**: ni tiempo, ni puntaje, ni fecha, ni cuántas veces se falló (criterio 9) |
| **Ausente** | Sin avance: se juega el primero de la fila. **No se escribe nada hasta la primera victoria** |
| **Roto** | Si no es JSON, no es un objeto o `pasados` no es un arreglo, cuenta como **sin avance**, y la próxima victoria lo pisa. Las entradas que no son texto con la forma `^NIV-\d{2}$` se descartan, y las repetidas cuentan una vez. Un valor corrupto no es un avance (`ADR-04.5`) |
| **Ids que la fila de hoy no tiene** | Se conservan al escribir y no cuentan al leer. Es el nivel que producción dejó de servir, o uno que todavía no pasó a `listo`: si vuelve, vuelve pasado |
| **Campos que no conoce** | Se conservan al escribir (se lee, se modifica y se escribe) y se ignoran al leer. Así una versión posterior puede sumar un campo sin clave nueva, y una pestaña con el código viejo no se lo borra |
| **Si `localStorage` tira** (Safari en privado, cuota llena) | **Se traga y se sigue**, con el avance en memoria mientras dure la página (`ADR-04.5`). Perder el avance es una molestia; romper el juego por no poder guardar sería ridículo |
| **Cuándo se escribe** | **En el cuadro en que el mundo marca `terminado`**, no cuando la persona toca "seguí". Así, quien cierra el teléfono con la victoria en pantalla no pierde el nivel. Se lee lo que hay guardado, se suma el `id` y se escribe: **dos pestañas abiertas se juntan por unión** y ninguna borra a la otra |
| **Cuándo se lee** | Una vez, al arrancar la isla, para elegir el nivel. *Enmendado el 2026-10-04 (`D-61`): también puede leerse al abrir el menú, siempre con `cargarAvance()` (`CTR-16.11.2`, punto 7)* |

**Lo que ve la persona se calcula, no se guarda.** *"Hasta qué nivel llegó"* es cuántos niveles
de la fila de hoy, **empezando por el primero y sin saltear**, están en `pasados`: un número de 0
a 6. Si se guardara el número, dejaría de decir la verdad el día en que la fila cambie. Por
ejemplo, si un nivel del medio pasa a `listo` después, el 3 guardado apunta a otro nivel, y la
persona se saltea uno sin enterarse o repite uno ya pasado.

### CTR-16.11.2 — La fila, y dónde se retoma

- **La fila son los niveles que la página sembró** (`CTR-16.8`: en producción, los `listo`; en
  desarrollo y en la vista previa de cada PR, todos), **en orden de `id`**. `E11`
  (`CTR-16.10.10`) exige que el arreglo ya venga en ese orden y que el `escalon` no baje. Por
  eso el orden de la fila, el primero de `nivelAJugar()` y el de `id` más chico de `T-253` son
  una sola cosa.
- **Dónde se retoma:** en **el primer nivel de la fila que no está en `pasados`**. Si hay un
  hueco (se ganó `NIV-01` y `NIV-03`, pero no `NIV-02`), se retoma en el hueco: *"no hay forma
  de saltear uno sin haber pasado el anterior"* (criterio 9 enmendado). *Enmendado el
  2026-10-04: esa cita ya no dice qué se puede jugar —`D-61` abre los seis—; queda como la razón
  de dónde se retoma. Ver la enmienda al final de esta sección.*
- **Si están todos:** la función devuelve `null`, que quiere decir "no queda ninguno". **Qué se
  muestra y qué se juega entonces lo deciden `BR-31` punto 1 y `UX-33`, no este contrato.**
- **El pedido de desarrollo** (`?nivel=`, que solo existe en desarrollo: lo resuelve
  `nivelAJugar()`, con su comentario, en `escena.ts:140-150`, y la isla lo lee solo si
  `import.meta.env.DEV`, en `partida-skayboy.ts:353-354`) **le gana al avance**. Si se gana así, se guarda igual: un `NIV-04` ganado sin haber pasado el
  1 no saltea nada, porque se retoma en el primero que falte.
- **Distintos orígenes no comparten nada**: `localhost`, cada vista previa de Vercel y
  producción tienen cada uno su `localStorage`. No hay nada que hacer al respecto, y está bien
  así.

> **Enmendado el 2026-10-04 por `D-61` punto 2, en el lugar: se puede elegir cualquier nivel de
> la fila.** El candado de orden que glosaban `US-09` criterio 9 y `BR-31` §3 se va (los enmienda
> `BR-40`): `D-61` lo llama un molinete, *"saber lo suficiente"* con forma de nivel (`D-14`).
> **El contrato del avance no se toca**: misma clave, mismo valor, mismo momento de escritura, y
> ningún avance escrito antes de hoy cambia de sentido. Lo que cambia es qué lee cada quien:
>
> 1. **Qué se puede jugar: cualquier nivel de la fila**, o sea cualquiera que la página sembró
>    (`CTR-16.8`): en producción, los `listo`; en desarrollo y en la vista previa, todos. El menú
>    lista la fila y nada más. Un `id` de `pasados` que la fila de hoy no tiene no aparece
>    (*"Ids que la fila de hoy no tiene"*, `CTR-16.11.1`), y un borrador no se puede elegir en
>    producción porque no está.
> 2. **Dónde se retoma, igual que antes:** el primero de la fila que no está en `pasados`
>    (`siguienteDeLaFila()`), y con todos pasados, el primero (`nivelAJugar()`, ancla
>    `export function nivelAJugar` en `escena.ts`). Es lo que juega el botón grande del menú
>    (`D-61` punto 1: *"el primero sin pasar, como hasta hoy"*). La cita del criterio 9 de arriba
>    pasa de candado a brújula: nadie tiene que ganar el 3 para jugar el 4, pero el botón grande
>    nunca saltea un hueco.
> 3. **El avance sigue siendo `pasados`, y se escribe igual:** en el cuadro en que el mundo marca
>    `terminado` (`CTR-16.11.1`), que es el mismo en que aparece la tarjeta de fin de nivel
>    (`ADR-10.5`, condición 3). **Ningún botón de la tarjeta ni del menú escribe ni borra nada**:
>    ni seguir, ni repetir, ni elegir otro, ni empezar de nuevo un nivel en pausa. Ganar otra vez
>    un nivel pasado no lo duplica (`conPasado()` no repite), y dejarlo por la mitad no lo saca.
> 4. **Ganar fuera de orden pasa de caso de desarrollo a caso de todos los días.** El contrato ya
>    lo cubría por el pedido de desarrollo (párrafo de arriba): un `NIV-04` ganado sin el 1 se
>    guarda, y se retoma en el 1. No hace falta nada nuevo para que eso funcione en producción.
> 5. **"Pasado", en el menú, es pertenencia, no `hastaDonde()`.** El sello de cada ficha dice si
>    su `id` está en `pasados`. `hastaDonde()` cuenta desde el primero y sin saltear: con
>    `pasados` = `["NIV-04"]` da 0, y un menú que sellara con eso mostraría sin sellar el nivel que
>    la persona acaba de ganar. `hastaDonde()` sigue siendo lo que era —*"hasta qué nivel llegó"*,
>    el número que se muestra (`US-09` criterio 9)— y no sella fichas.
> 6. **Hay dos "siguiente", y está bien que no coincidan.** El de la tarjeta es **el que sigue en
>    la fila al nivel que se acaba de ganar**, y después del último, el primero
>    (`siguienteAlGanar()` en `escena.ts`; `D-61` punto 3, y el traspaso: *"en el sexto, seguir
>    lleva al primero (como hoy)"*). El del botón grande es dónde se retoma (punto 2). Con
>    `pasados` = `["NIV-01"]`, quien elige el 4 y lo gana ve en la tarjeta que sigue el 5, y en el
>    menú el botón grande lo lleva al 2. Las dos cosas son verdad. Con la fila jugada en orden
>    coinciden siempre, y por eso hasta hoy no hacía falta decirlo.
> 7. **El menú lee el avance de `avance.ts`, nunca de `localStorage` por su cuenta**: lo que
>    devolvió `cargarAvance()` o el último `guardarPasado()`. `cargarAvance()` une lo guardado con
>    lo que la página ya tiene en memoria, así que llamarla otra vez al abrir el menú está
>    permitido y no pierde nada: es la manera de ver lo que ganó otra pestaña. Por eso se enmienda
>    la fila *"Cuándo se lee"* de `CTR-16.11.1`.
> 8. **`menu.ts` es puro** (`D-61`, consecuencias): puede importar `avance.ts` y `niveles.ts`; no
>    puede importar el motor, tocar el DOM, tocar `localStorage` ni usar `node:*`. Son los límites
>    de `avance.ts` en `CTR-16.8`, sin sus dos funciones que tocan el aparato. Si el módulo nace
>    con otro nombre, la regla va con él.
>
> **Las pruebas que suma, cada una con su rojo** (las escribe el hilo principal, en
> `avance.test.ts`, `escena.test.ts` o la prueba de `menu.ts`):
>
> | Caso | Verde | Rojo que se tiene que ver |
> |---|---|---|
> | Ganar fuera de orden | Sin avance, se gana `NIV-04`: `pasados` es `["NIV-04"]`, la ficha del 4 sale pasada y el botón grande lleva a `NIV-01` | Sellar con `hastaDonde()`: el 4 sale sin sello |
> | Los dos "siguiente" | Con `pasados` = `["NIV-01"]`, se gana `NIV-04`: la tarjeta nombra `NIV-05` y el botón grande lleva a `NIV-02` | Que la tarjeta use `siguienteDeLaFila()`: nombra `NIV-02` |
> | Los botones no escriben | Con `pasados` = `["NIV-02"]`, se elige el 2, se pausa, se empieza de nuevo y se elige otro: lo guardado no cambió | Un `guardarPasado()` colgado de un botón |
> | La fila manda qué se lista | Con la fila de producción (solo `listo`) y un `pasados` que trae un `id` que la fila no tiene, el menú tiene tantas fichas como la fila, y ese `id` no aparece | Listar el banco entero |
>
> **Descartadas en esta enmienda:**
>
> | Descartada | Por qué, puntual |
> |---|---|
> | **Dejar el candado en el contrato**: que la isla no deje empezar el *n* sin el *n − 1* en `pasados` | `D-61` punto 2 lo saca por molinete, y el contrato ya sabía guardar un nivel ganado fuera de orden |
> | **Retomar en el último nivel elegido o jugado**, guardado en el avance | Suma un campo que dice qué se tocó y no qué se ganó (*"nada más"*, `CTR-16.11.1`), y el botón grande empezaría a llevar a un nivel ya pasado. `D-61`: la fila manda dónde se retoma |
> | **Que el seguir de la tarjeta lleve al hueco** (`siguienteDeLaFila()`) | Quien eligió el 4 para jugar para adelante lo gana y lo mandan al 2: el candado vuelve con otra forma |
> | **Sellar las fichas con `hastaDonde()`** | Esconde los niveles ganados fuera de orden (punto 5) |
> | **Una clave o una versión nueva para el avance** | No cambió nada de lo que se guarda. Una clave nueva borraría el avance de todos (`CTR-16.11.5`) |

### CTR-16.11.3 — El módulo y las pruebas

`src/lib/skayboy/avance.ts` (fila en `CTR-16.8`). Firmas orientativas: los nombres son del hilo
principal, pero el reparto entre lo puro y lo que toca el aparato es contrato.

```ts
export interface Avance { readonly pasados: readonly string[]; readonly resto: Readonly<Record<string, unknown>> }
export function leerAvance(texto: string | null): Avance;                        // pura
export function conPasado(avance: Avance, id: string): Avance;                   // pura
export function textoDeAvance(avance: Avance): string;                            // pura; conserva `resto`
export function siguienteDeLaFila(fila: readonly Nivel[], avance: Avance): Nivel | null; // pura
export function hastaDonde(fila: readonly Nivel[], avance: Avance): number;       // pura: de 0 a fila.length
export function cargarAvance(): Avance;          // toca localStorage, con try/catch
export function guardarPasado(id: string): Avance; // lee, suma, escribe; con try/catch
```

Las pruebas, en `avance.test.ts`, con un `localStorage` de mentira, como hace `cinta.test.ts`. Cada
una con su rojo a mano:

| Caso | Verde | Rojo que se tiene que ver |
|---|---|---|
| Valor roto | `null`, `''`, `'basura'`, `'{"pasados":"NIV-01"}'` y `'[]'` dan sin avance | Un `JSON.parse` sin `try`: el test explota en vez de dar rojo con nombre |
| Entradas raras | `{"pasados":["NIV-01","xx",3,"NIV-01"]}` da `["NIV-01"]` | No filtrar |
| Campo desconocido | `{"pasados":[],"otra":1}`, después de ganar `NIV-01`, se escribe con `"otra":1` | Escribir solo `pasados` |
| Hueco en la fila | Con `pasados` `[NIV-01, NIV-03]`, el siguiente es `NIV-02` y `hastaDonde` da 1 | Retomar después del último ganado |
| Todos pasados | `siguienteDeLaFila` da `null` y `hastaDonde` da 6 | — |
| `localStorage` que tira | `guardarPasado` no tira, y el avance en memoria incluye el nivel | Sacar el `try` |
| Dos pestañas | Lo guardado tiene `NIV-02`, esta pestaña gana `NIV-03`: queda con los dos | Escribir el avance en memoria sin leer antes |

**Y en `niveles.ts`, `E11`** (`CTR-16.10.10`), con su rojo.

### CTR-16.11.4 — Si `BR-31` pide guardar los coleccionables

Entran **en la misma clave**, como un campo más, sin que el lector de hoy se rompa (se conserva y
se ignora):

```json
{ "pasados": ["NIV-01"], "juntados": { "NIV-01": { "skayboy": 1, "poligirl": 1 } } }
```

**Guarda el mejor de cada nivel, por personaje, nunca la suma.** Si se sumara, rejugar un nivel
inflaría la cuenta. **Sin ese pedido no se escribe**: *"no se guarda nada más"* (`ADR-04.5`)
sigue valiendo.

### CTR-16.11.5 — Descartadas

| Descartada | Por qué, puntual |
|---|---|
| **Guardar el número de 0 a 6** (las palabras del criterio 9) | Deja de decir la verdad cuando la fila cambia, sin avisar: ver *"Lo que ve la persona se calcula"*. El número es lo que se muestra; el `id` es lo que se guarda |
| **Guardar solo el `id` del último ganado** | Tiene la misma fragilidad si se agrega un nivel, y con el pedido de desarrollo (`?nivel=`) el "último" salta de lugar |
| **Una clave por nivel** (`arcade.skayboy.NIV-01`) | Seis escrituras sueltas, y leer el avance pasa a ser recorrer claves. La unión entre pestañas deja de ser una sola lectura y una sola escritura |
| **Armar la clave con el campo `juego`** | Un cambio de nombre borraría el avance de todos (`CTR-16.1`) |
| **Cookie** | Viaja al servidor en cada pedido, y no hay servidor (`D-15`) |
| **IndexedDB** | Es asincrónica y mucho más pesada para cuarenta bytes |
| **`sessionStorage`** | Se muere con la pestaña, y el criterio 9 dice *"otro día"* |
| **El avance en la dirección** (`#NIV-03`) | Un enlace compartido llevaría el avance de otro. Y *"vuelve otro día"* solo funcionaría con la dirección guardada |
| **Escribir al tocar "seguí"** | Quien cierra el teléfono con la victoria en pantalla pierde el nivel que acaba de ganar |
