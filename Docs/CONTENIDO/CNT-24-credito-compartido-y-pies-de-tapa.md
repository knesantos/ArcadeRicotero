# CNT-24 — El crédito conjunto del doble de 1993, y el pie de las diez fichas de disco

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-25
- **Estado:** la parte de `tapa.json` queda cargada en esta misma tarea. La tabla de pies de
  la Redondopedia queda lista para cablear — no toco `src/pages/redondopedia/[slug].astro`,
  que no es mi carpeta.
- **Consume:** `Docs/SUGERENCIAS/ARQ-para-contenido-credito-compartido.md` (el pedido
  exacto), `Docs/REVISIONES/REV-05-adivinar-la-tapa.md` (`FIND-21`),
  `Docs/ARQ/ARQ-schema-adivinar-tapa.md` (`CTR-05.4` revisión 2, `CTR-05.9` chequeo 1),
  `RES-40`, `RES-36`, `RES-44`, `Docs/SUGERENCIAS/HILO-para-investigador-tapa-de-la-mosca.md`,
  `Docs/CONTENIDO/CNT-07-pies-y-tono-de-tapas.md` (precedente directo, ver §4),
  `scripts/generar-tapas.mjs` (comentario sobre `FICHAS`), `src/lib/letra/discos.ts` (los
  diez slugs), `.claude/rules/voz-ricotera.md` §5 (registro 3, "el que rotula"), `D-14`.
- **Resuelve:** el pedido de `arquitectura` entero, y la mitad de `contenido` en el hallazgo
  abierto de `HILO-para-investigador-tapa-de-la-mosca.md` ("mientras no haya respuesta, el
  pie de esa imagen no le acredita nada a Rocambole").

## 1. `TP-007` y `TP-008` en `src/data/tapa.json`: crédito conjunto, ya cargado

Cambié una línea en cada ítem:

```json
"credito": { "autor": "Rocambole, Semilla y Meroyuela", "origen": "coveralia" }
```

Y reescribí las dos `notaInterna` (sin tocar el resto del ítem, `explicacion` incluida):
agregué, al final del texto que ya tenían sobre el mecanismo de zoom, una frase que dice por
qué el crédito va conjunto y no repartido — `RES-40` firma la tapa completa como *"Visiones:
Rocambole, Semilla y Meroyuela"* sin precisar qué aportó cada uno, y en `TP-008` sumé que
`RES-44` anota además que el frontal de ese volumen es arte de Semilla Bucciarelli. Ninguna
ficha reparte el aporte de cada uno del trío: escribirlo repartido sería afirmar algo que las
fichas no dicen, exactamente lo que `arquitectura` pidió no hacer.

No toqué nada más del archivo: ni los otros ocho ítems (`RES-06` sostiene el crédito exclusivo
a Rocambole desde 1978 y eso no cambió), ni `imagen.cara`, ni `TP-010`.

## 2. El pie de las diez fichas de disco en la Redondopedia

Hoy `src/pages/redondopedia/[slug].astro` (línea ~153) imprime, fijo para los diez discos:

> `Tapa: Rocambole (Ricardo Cohen), en baja resolución.`

Eso deja de ser cierto, o queda más angosto que la ficha, en tres de los diez — los mismos
tres que tocan el crédito o la evidencia de autoría. Los otros siete no cambian.

### 2.1 Los siete que quedan como están

`gulp`, `oktubre`, `un-baion-para-el-ojo-idiota`, `bang-bang-estas-liquidado`, `luzbelito`,
`ultimo-bondi-a-finisterre`, `momo-sampler`. Sus fichas usan el `-frontal.jpg` real de un solo
disco sin ninguna nota de autoría compartida en las fichas de investigación. El pie de hoy
sigue siendo verdad tal cual está.

### 2.2 `lobo-suelto` y `cordero-atado`: el mismo crédito que acabo de cargar en `tapa.json`

`CNT-07` ya había verificado que la ficha de estos dos discos usa el frontal real de cada
volumen (CD1 y CD2), no una tapa y su reverso. Es la misma obra que se juzga en "adivinar la
tapa" — mismo máster, misma auditoría, mismas fichas —, así que el pie tiene que decir lo
mismo que ahora dice `credito.autor` en `TP-007`/`TP-008`. Dejar la Redondopedia diciendo
"Rocambole" solo mientras el juego ya dice "Rocambole, Semilla y Meroyuela" sería el mismo
error que `FIND-21` encontró, mudado de un componente a otro.

### 2.3 `la-mosca-y-la-sopa`: sin autor, sin disfrazar que la pregunta sigue abierta

Esta es la que no admite la misma fórmula. Desde que el usuario corrigió el veredicto viejo
(2026-08-24), la ficha muestra el frontal real de una edición distinta, no la contratapa que
`CNT-07` había resuelto en su momento — así que el texto que esa pieza dejó escrito
("Contratapa: Rocambole (Ricardo Cohen)...") ya no describe lo que hay en pantalla y queda
reemplazado por el de abajo (ver §4).

Lo que hoy se sabe, sin inventar nada:

- La imagen es la tapa (no la contratapa) de una reedición sin confirmar de 1991, Del
  Cielito Records.
- `RES-44` dictaminó "rediseño, no arte de Rocambole" para esta fila, pero con la evidencia
  más floja de las 35 de su tabla — un snippet indexado, con el fetch a la fuente devolviendo
  403. `investigador` tiene el pedido de volver a mirarlo (`RES-53` libre para eso), y todavía
  no hay respuesta.
- Ni afirmar "Rocambole" ni afirmar "rediseño" está sostenido hoy con la firmeza que el resto
  de las nueve fichas tiene. Lo único que se puede decir sin mentir es que no se sabe.

Por eso el pie no nombra a nadie y no cuenta la historia — no hace falta, y contarla en una
sola línea de pie la simplificaría de un lado o del otro—, pero tampoco finge que hay un
crédito: dice que la autoría no está confirmada y se calla, que es exactamente el registro 3
de `voz-ricotera.md` §5 ("dice qué hay adentro y se calla").

## 3. La tabla, lista para cablear tal cual

| slug (`src/lib/letra/discos.ts`) | Pie exacto |
|---|---|
| `gulp` | `Tapa: Rocambole (Ricardo Cohen), en baja resolución.` |
| `oktubre` | `Tapa: Rocambole (Ricardo Cohen), en baja resolución.` |
| `un-baion-para-el-ojo-idiota` | `Tapa: Rocambole (Ricardo Cohen), en baja resolución.` |
| `bang-bang-estas-liquidado` | `Tapa: Rocambole (Ricardo Cohen), en baja resolución.` |
| `la-mosca-y-la-sopa` | `Tapa: autoría sin confirmar, en baja resolución.` |
| `lobo-suelto` | `Tapa: Rocambole, Semilla y Meroyuela, en baja resolución.` |
| `cordero-atado` | `Tapa: Rocambole, Semilla y Meroyuela, en baja resolución.` |
| `luzbelito` | `Tapa: Rocambole (Ricardo Cohen), en baja resolución.` |
| `ultimo-bondi-a-finisterre` | `Tapa: Rocambole (Ricardo Cohen), en baja resolución.` |
| `momo-sampler` | `Tapa: Rocambole (Ricardo Cohen), en baja resolución.` |

Mantuve el mismo molde de siempre — `Tapa: <crédito>, en baja resolución.` — en los diez,
`la-mosca-y-la-sopa` incluida: cambia el valor de `<crédito>`, no la forma de la oración. Es
la misma lógica que ya tiene `credito.autor` en el schema de `tapa.json` (un campo, distintos
valores posibles), aplicada a una oración fija en vez de a un campo de datos.

Verificación a mano contra `voz-ricotera.md` §5 (registro 3: seco, sin imagen, sin
suspensivos, dice qué hay y se calla) sobre las dos cadenas nuevas:

- `Tapa: Rocambole, Semilla y Meroyuela, en baja resolución.` — seca, sin adjetivo, sin
  intruso, cierra en punto. Es el mismo texto de siempre con tres nombres en vez de uno.
- `Tapa: autoría sin confirmar, en baja resolución.` — no interpela, no explica el porqué
  (eso es materia de artículo, no de pie), no tiene suspensivos, no nombra a nadie sin
  fundamento. Pasa además las siete reglas de `src/lib/voz.test.ts` §8: sin anglicismo, sin
  fórmula de folleto, no es un botón, no es un título ni una bajada de casete, no dice "los
  fans"/"los usuarios", sin puntos suspensivos.

## 4. Qué queda expresamente afuera de esta tarea, y por qué

- **La reescritura del segmento de `cuerpo` sobre la tapa de *La mosca y la sopa*** que
  `CNT-07` §1 había dejado propuesto para `redondopedia.json` — el que contaba que la única
  cara frontal disponible era ajena a Rocambole — queda **superada** por el cambio de imagen
  del 2026-08-24: ese segmento daba por cerrado algo que hoy está en revisión
  (`HILO-para-investigador-tapa-de-la-mosca.md`). No la reemplazo en esta tarea porque
  `redondopedia.json` no es uno de los dos archivos que esta tarea me habilita a tocar
  (`tapa.json` y este documento); queda pedida para una `CNT-XX` propia cuando haya
  novedades de `investigador` sobre `RES-53`, o antes si `orquestador` decide que el artículo
  no puede seguir sin decir algo mientras tanto.
- **`Docs/CONTENIDO/CNT-01-nota-derechos.md`, sección B**, todavía dice que "el ítem `TP-010`
  de `tapa.json` usa la contratapa en vez del frontal" citando el viejo veredicto sin matiz.
  Esa frase quedó desactualizada por el mismo cambio del 2026-08-24 y por esta tarea (el
  crédito conjunto del doble tampoco está anotado ahí). No la toco porque no es lo que esta
  tarea pidió; queda anotado como pendiente para la próxima actualización de `CNT-01`.
- **`TP-010` en `tapa.json`** no se toca: `arquitectura` fue explícito en que el pedido era
  solo `TP-007`/`TP-008`, y ese ítem es un juego distinto (adivinar la tapa) con su propia
  auditoría ("reedicion confirmada") que no cambia con esto.
- **Los otros ocho ítems de `tapa.json`** no cambian: `RES-06` sostiene el crédito exclusivo
  a Rocambole desde 1978.

## Verificación

No tengo con qué correr nada (`D-12`). Lo corre `revisor` o el hilo principal:

```bash
node --test src/lib/esquemas.test.ts src/lib/tapa/*.test.ts
```

Y el chequeo 1 de `CTR-05.9` (bloque python de "chequeos sobre el banco real" en
`Docs/ARQ/ARQ-schema-adivinar-tapa.md`): el aviso `CREDITO MAS ANGOSTO QUE LA FICHA` que
imprimía para `TP-007`/`TP-008` tiene que desaparecer, porque los dos ítems ya declaran
`Rocambole, Semilla y Meroyuela`.

## Bloqueos

- Ninguno para lo que entrega esta pieza. La pregunta de fondo sobre la autoría de la tapa de
  *La mosca y la sopa* sigue abierta en `investigador` (`RES-53`, libre y sin usar todavía) —
  el pie de §3 no espera esa respuesta: está escrito para ser correcto hoy, y si la respuesta
  cambia el estado del disco, se reescribe esa fila y ninguna otra.

## Siguiente

- **Hilo principal**, para cablear en `src/pages/redondopedia/[slug].astro` (línea ~153): el
  pie fijo de hoy pasa a ser un `switch`/mapa por slug con los diez valores de la tabla del
  §3, usando los slugs de `src/lib/letra/discos.ts`.
- **`revisor` o hilo principal**, para correr la verificación de arriba y confirmar que el
  aviso de `CTR-05.9` desaparece.
- **`investigador`**, cuando retome `RES-53` sobre la tapa de *La mosca y la sopa* — esta
  pieza queda como el punto de partida para la próxima revisión del pie y del segmento de
  `cuerpo` pendiente (§4).
