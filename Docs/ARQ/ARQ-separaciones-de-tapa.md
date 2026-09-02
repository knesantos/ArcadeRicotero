# ARQ — Las separaciones de tapa: la imprenta, en archivos

> Rol dueño: `arquitectura`. **Produce: `ADR-05` + `CTR-12`.** Fecha: **2026-09-01**.
> Versión: **v1**.
>
> **Consume** — leído para escribir esto, no citado de memoria: `CLAUDE.md` (la postura y
> las reglas), `.claude/rules/diseno-marca.md` (el circuito diseño → tokens → test, la
> tabla anti-slop, "el único archivo del repo donde vive un hex"),
> `.claude/rules/voz-ricotera.md` (los tres registros),
> `Docs/ORQ/ORQ-plan-ciclo-12.md` (`T-197` y las siete cosas que cambian),
> `Docs/UX/UX-20-el-sitio-como-lugar.md` (los cuatro límites, lo que nunca se mueve),
> `Docs/UX/UX-04-sistema-visual.md` ("Tapas reales en toda la pantalla": las tres formas,
> el piso de legibilidad, el mecanismo de crédito, el tope de 60 KB),
> `Docs/DECISIONES.md` `D-04`, `D-12`, `D-14`, `D-15`, `D-17`, `D-19`, `D-21`, `D-22`,
> `D-26`, `D-29`, `D-31`, `D-32`, `ADR-03` y `ADR-04` (los dos ADR del ciclo 11, por
> formato y por precedente), `CTR-01` (`ARQ-fragmento-audio.md`: el presupuesto de audio),
> `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md` (`RES-06`),
> `Docs/INVESTIGACION/INV-44-tapas-coveralia.md` (`RES-44`, la auditoría de edición de las
> 35 imágenes), `Docs/INVESTIGACION/INV-07-tipografia-lettering-tapas.md` (`RES-37`, el
> muestreo de las paletas), `public/arte/README.md`.
>
> **Y el código, que para esta decisión es la fuente más dura que hay:**
> `src/styles/tokens.css` entero, `scripts/generar-tapas.mjs` entero,
> `src/lib/sitio/arte.ts` entero, `src/lib/tema/paleta.ts`, `src/lib/letra/discos.ts`,
> `src/lib/estilos.test.ts` (el guardián del velo, líneas 95-113),
> `src/scripts/partida-tema.ts` (`cerrarTema`, `pintarRevelacion`, `avanzar`,
> `pintarResultado`, líneas 703-919), `src/lib/tema/copy.ts`, `src/data/tapa.json`,
> `package.json`, `.gitignore`.
>
> **Resuelve:** `T-197`. **Habilita:** `T-199` (el taller), `T-200` (la estampa), `T-203`
> (dala vuelta), `T-202` (la sala), `T-206` (el zoom que se abre).
>
> **No resuelve, y no se mete:** cómo se ve la impresión, cuánto dura cada pasada y qué se
> estampa y qué no — eso es `UX-22` (`T-195`, `experiencia`); las palabras — `CNT-14`
> (`T-198`, `contenido`); **el orden de las pasadas de una serigrafía de verdad** —
> `RES-54` (`T-196`, `investigador`), y el apartado `ADR-05.1` está construido para que ese
> orden llegue **sin obligar a regenerar un solo archivo**.

---

## De dónde sale cada afirmación de este documento

Tres orígenes, marcados uno por uno. Sin esto, dentro de dos meses no se distingue lo
medido de lo elegido:

| Marca | Qué significa |
|---|---|
| **medido en el repo** | se verificó leyendo el archivo, con ruta y línea, o lo midió el hilo principal hoy y lo dejó por escrito en el encargo. Está en disco |
| **criterio propio del rol** | lo decide `arquitectura` acá. Se puede discutir; no se puede citar como hecho externo |
| **pendiente de ficha** | dato del mundo de afuera. **No lo afirmo**: va a `investigador` como `RES-XX` |

Y la advertencia que este proyecto cuida de verdad: **todo lo que este documento dice
sobre la obra o la técnica de Rocambole sale de `RES-06` o de `RES-44`, y nada más.** Que
trabaja *"artesanal, con rodillo y serigrafía; también aerografía, grabado, collage e
ilustración"* es `RES-06`. Que la contratapa de `lobo-suelto-cordero-atado-cd1` trae el
tracklist de 13 temas que coincide exacto con `RES-20` es `RES-44`. **Cómo se imprime una
serigrafía —cuántas pasadas, en qué orden, por qué la clave va última— no lo afirmo acá:
es `RES-54`, todavía pendiente**, y por eso el diseño no depende de la respuesta.

Los contrastes de color que aparecen más abajo son **cálculo a mano sobre los valores de
`tokens.css`, no una corrida** (`D-12`: este rol no tiene con qué correr nada). Están para
que quien construya no los rehaga, y el que manda es el que imprima el taller.

---

## ADR-05 — Las separaciones de tapa

- **Estado:** **aceptada**, con **un pendiente declarado que no la bloquea** (`RES-54`, el
  orden de las pasadas). Ver `ADR-05.1`: la decisión de máscaras disjuntas hace que el
  orden sea un dato de la pantalla y no del archivo.
- **Contexto.** El ciclo 12 quiere que la tapa **se imprima** al acertar: tres pasadas de
  tinta con los colores medidos de esa tapa, la foto que se fija encima, y una sola tinta
  —la clave— cuando el tema se escapó. El material ya está: las diez fichas de 320 px
  existen en `public/tapas/`, las diez traseras existen como máster en
  `Docs/INVESTIGACION/TapasDiscos/`, y las veinte tintas medidas de `RES-37` viven en
  `tokens.css` (**medido en el repo**). Lo que no existe es la forma de que una isla que
  corre en el navegador reciba esa tapa separada en tintas sin bajarse medio disco, sin
  tocar `src/data/adivinar-tema.json`, sin romper `estilos.test.ts` y sin que un hex
  aparezca fuera de `tokens.css`.
- **Y el riesgo que ordena todo, que el propio plan del ciclo escribió:** que la estampa se
  vuelva "un efecto de impresión" de biblioteca. Lo que la separa de eso son tres cosas
  **verificables**, y la primera es de este documento: **que los colores sean los medidos
  de esa tapa y no una paleta.** Todo el diseño de abajo está torcido hacia que eso se
  pueda probar con un test y no con un ojo.
- **Decisión, en una línea:** cada tapa llega al navegador como **tres PNG con alfa,
  pre-teñidos en build con los colores que el taller lee de `tokens.css`**, del mismo
  tamaño que su ficha, con **máscaras disjuntas** y **tinta plana** (alfa 0 o 255), servidos
  por **convención de nombre desde el slug del disco** — sin un campo nuevo en ningún JSON,
  sin un schema tocado, y con un guardián que **falla el build si el color de un archivo
  dejó de ser el del token**.

### Los seis candados, antes de los detalles

Si alguien afloja uno, que sepa cuál:

1. **El color sale de `tokens.css` y de ningún otro lado.** El taller lo lee y lo hornea.
   Nadie copia un hex a mano, ni al script, ni al test, ni al CSS.
2. **Tinta plana.** Alfa 0 o 255, nunca intermedia. Un degradado adentro de una pasada es
   el primer tic de la tabla anti-slop, y acá además es verificable a máquina.
3. **Una tinta por archivo.** Todos los píxeles visibles de una separación tienen
   exactamente el mismo RGB. Es lo que hace que "el color es el medido" sea una aserción y
   no una impresión.
4. **Nada se pide antes de que el tema se cierre.** Durante la partida el presupuesto de
   red es del audio (`CTR-01`). La estampa llega después de la respuesta.
5. **Un archivo que falta no rompe la pantalla.** Degrada por capa, y el botón no se mueve
   un píxel (`UX-20` §1.3).
6. **El corrimiento de registro no se hornea.** Los tres archivos comparten el mismo marco,
   perfectamente registrados. El registro imperfecto lo pone el CSS con `--registro`
   (`T-207`), que es lo único que se puede apagar bajo `prefers-reduced-motion`.

---

## ADR-05.1 — Qué es cada archivo: tres tintas y una clave

*(Todo este apartado es **criterio propio del rol**, salvo donde se cita `RES-06`.)*

Una separación es una máscara: qué parte de la tapa imprime esa tinta. Se saca de la
luminancia de la propia ficha, y las tres reparten la imagen entera:

| Archivo | Qué zona lleva | Con qué tinta |
|---|---|---|
| `<slug>-clara.png` | las zonas más luminosas de la tapa | el **más luminoso** de los dos colores medidos del disco |
| `<slug>-media.png` | los medios | el **menos luminoso** de los dos |
| `<slug>-clave.png` | las sombras | **`--fondo`**: la tinta del sitio, la base que `D-19` dice que no rota nunca |

**La clave es `--fondo` y no un negro nuevo, por dos motivos que van juntos.** El primero
es de regla: un `#000000` sería un hex nuevo, y el único lugar del repo donde vive un hex
es `tokens.css` (`diseno-marca.md`) — meter un negro puro para la clave sería inventar un
color con coartada, que es exactamente lo que el bloque de las diez paletas de `tokens.css`
prohíbe por escrito. El segundo es de sentido: la clave es **la única tinta que no rota**,
igual que la base de `D-19`. Cada tapa aporta sus dos colores; el negro es del sitio.

### Las cinco reglas de la separación

1. **Se saca de la ficha, no del máster.** `public/tapas/<slug>.jpg`, la misma imagen de
   320 px que después se fija encima. Dos motivos: **registro exacto** (una máscara sacada
   del máster y reducida no cae en el mismo píxel que la foto que ya sirve el sitio) y
   **una sola fuente de verdad** — si mañana cambia la ficha, cambian las pasadas, y el
   guardián lo detecta (`CTR-12`, el manifiesto).
2. **Luminancia perceptual, la misma que usa el resto del sitio.** Se calcula la luminancia
   relativa de WCAG —la que ya computa `contraste.test.ts`— y se la vuelve a codificar con
   la curva sRGB, para que 0 sea negro, 1 sea blanco y 0,5 caiga donde el ojo pone el medio.
   El sitio tiene **una sola** definición de "qué tan claro es esto"; esta no es la segunda.
3. **Suavizado antes del umbral.** Un desenfoque leve (`SIGMA_SUAVIZADO`) antes de cortar.
   Sin eso, el umbral persigue el ruido del JPEG y el borde sale hecho pelusa; con eso, el
   borde sale en bloques. **Es la diferencia entre una serigrafía y un filtro**: `RES-06`
   dice que el trabajo es de rodillo y serigrafía, y una serigrafía tiene bordes duros de
   forma grande, no granulados.
4. **Los umbrales son percentiles de la propia tapa, no números fijos.** La clara se lleva
   el 25 % más luminoso, la media el 40 % siguiente, la clave el 35 % restante. Con umbrales
   fijos, *Cordero atado* —que es casi negra— imprimiría una sola pasada y *Gulp!* no
   tendría casi clave: haría falta afinar diez juegos de números a mano y volver a
   afinarlos cada vez que se regenere una ficha. Con percentiles, **cada tapa entrega sus
   tres tintas sola**, y de paso la cobertura de cada archivo se vuelve un número esperado
   que el guardián puede verificar.
5. **Las tres máscaras son disjuntas y suman la imagen entera.** Ningún píxel pertenece a
   dos pasadas. **Y esta es la regla que desacopla este documento de `RES-54`:** con
   máscaras disjuntas y tinta opaca, **el resultado final es el mismo cualquiera sea el
   orden de impresión**, así que `RES-54` puede decir que la clave va última, o primera, o
   en el medio, y no se regenera un solo archivo — cambia un retraso en el CSS. Con
   máscaras acumulativas (cada tinta imprimiendo también lo más oscuro que ella), el orden
   quedaría horneado en los archivos y una ficha de `investigador` costaría treinta
   regeneraciones.

**Consecuencia visible de la disjunción, y es la correcta:** con el registro corrido dos
píxeles, en un borde queda una hendija de papel y en el de enfrente un solapamiento de
tintas. Eso **es** un registro imperfecto de verdad; la alternativa acumulativa nunca
muestra papel y por eso se ve más limpia y menos impresa.

### Tinta plana: alfa 0 o 255, nunca en el medio

La máscara no lleva medio tono. Una serigrafía sin trama es tinta plana, y `diseno-marca.md`
veta los degradados decorativos en cualquier forma. El beneficio de fondo es que **se puede
probar**: el guardián abre el PNG y afirma que no existe un solo píxel con alfa intermedia.
Un "efecto de impresión" de biblioteca no pasa ese test; una separación de verdad sí.

El costo, declarado: el borde de cada pasada es un escalón de píxel, sin suavizado. A 320
px sobre una pantalla de teléfono es exactamente la aspereza que se busca, y el suavizado
del punto 3 garantiza que ese escalón siga una curva y no un ruido.

---

## ADR-05.2 — De dónde salen los colores: el taller lee `tokens.css`

`diseno-marca.md` dice que `tokens.css` es el único archivo del repo donde puede vivir un
hex, y que el circuito es **lienzo → `tokens.css` → test**, nunca al revés. Un taller que
tuviera su propia tabla de colores rompería ese circuito en silencio: el día que `RES-37`
remuestree una tapa, el sitio cambiaría de color y la estampa no.

**Decisión: el taller parsea `src/styles/tokens.css` y saca de ahí los tres valores que
necesita por disco** — `--disco-<slug>-tinta`, `--disco-<slug>-apoyo` y `--fondo`. Nada se
copia a mano, ni al script, ni al guardián, que hace el mismo parseo y compara contra los
píxeles del archivo.

### Cuál de los dos colores va a la clara: lo decide la luminancia, en build

**La regla:** el más luminoso de los dos a la clara, el otro a la media. No es una
preferencia estética: es la única asignación que conserva el orden tonal de la foto. Al
revés, las zonas claras se imprimen con el color oscuro y la tapa se lee como un negativo
— la gente reconoce el disco por su tono, no solo por su forma.

**Y se decide en build, no en una tabla**, porque el rol de `-tinta` y `-apoyo` en
`tokens.css` es "acento" y "borde/relleno", **no** "claro" y "oscuro": en dos de los diez
discos el `-apoyo` es el más luminoso. Cálculo a mano sobre `tokens.css` (no corrida,
`D-12`) — la luminancia relativa de cada par:

| Disco | `-tinta` | `-apoyo` | A la **clara** | A la **media** |
|---|---|---|---|---|
| `gulp` | `#df5744` · 0,229 | `#e6e4bd` · 0,760 | **apoyo** (crema) | tinta (rojo) |
| `oktubre` | `#f8360d` · 0,227 | `#9a9490` · 0,301 | **apoyo** (gris) | tinta (rojo) |
| `un-baion-para-el-ojo-idiota` | `#579ec5` | `#457eb1` | tinta (celeste) | apoyo (azul) |
| `bang-bang-estas-liquidado` | `#aeb9b4` | `#927051` | tinta (ceniza) | apoyo (ocre) |
| `la-mosca-y-la-sopa` | `#ce5c29` · 0,209 | `#114b58` · 0,059 | tinta (naranja) | apoyo (petróleo) |
| `lobo-suelto` | `#f28b16` · 0,374 | `#0b7792` · 0,153 | tinta (naranja) | apoyo (petróleo) |
| `cordero-atado` | `#f28b16` · 0,374 | `#030d0b` · 0,003 | tinta (naranja) | apoyo (negro) |
| `luzbelito` | `#af9178` | `#69635c` | tinta (cuero) | apoyo (topo) |
| `ultimo-bondi-a-finisterre` | `#8f8b84` | `#74726e` | tinta (plata) | apoyo (acero) |
| `momo-sampler` | `#cedae2` | `#656f70` | tinta (plata) | apoyo (peltre) |

Que *Gulp!* imprima los claros en crema y los medios en el rojo del título manuscrito, y
*Oktubre* los claros en el gris que el propio Rocambole contó que agregó (`tokens.css`,
comentario de `RES-37`) y los medios en el rojo de la bandera, **es la tapa**. Si alguien
lo hubiera puesto en una tabla a mano, habría escrito lo contrario.

### Las dos pasadas mudas, que existen y no son un defecto

Dos casos reales, encontrados calculando, que el taller tiene que **avisar** y **no
convertir en error**:

1. **La clara de `gulp` es del color del papel.** `--papel` es `#ede4ce` y el apoyo de
   *Gulp!* es `#e6e4bd`: contraste **1,02:1**. La pasada existe y no se ve. **Y en
   serigrafía eso es exactamente lo que pasa: el blanco de una serigrafía es el papel que
   no se imprimió.** No es una falla, es la técnica; la tapa queda leyéndose en rojo y
   negro sobre crema, que es *Gulp!*.
2. **La media de `cordero-atado` es del color de la clave.** El apoyo es `#030d0b` y
   `--fondo` es `#14100e`: contraste **1,04:1**. La estampa de *Cordero atado* se lee como
   naranja sobre negro, que es la tapa.

**Regla:** si una tinta queda a menos de **1,5:1** del papel o de la clave, el taller lo
imprime en la lista de avisos con el número, y sigue. **Emite las tres pasadas siempre**,
también las mudas: la alternativa —no emitirlas— convierte "existen los 40 archivos" en
"existen entre 34 y 40", que es un invariante mucho peor y obliga a la isla a saber cuáles
faltan. El costo es un archivo de pocos KB que no pinta nada, en dos discos de diez.

### Cómo falla el build si falta un token

Sin excepciones y sin repuesto, porque un color inventado es peor que un build roto:

| Caso | Qué hace el taller |
|---|---|
| Falta `--disco-<slug>-tinta` o `-apoyo` | **error**, nombra el token y el disco. No escribe nada de ese disco |
| Falta `--fondo` | **error**: sin clave no hay estampa ni fallo |
| El valor no es un hex de seis dígitos (`#abc`, `rgb()`, `color-mix()`, `var()`) | **error**, nombra el token y el valor leído. No se expande, no se interpreta |
| Falta `public/tapas/<slug>.jpg` | **error**, y dice el comando que la produce (`node scripts/generar-tapas.mjs`) |
| Falta el máster de la trasera | **error**, nombra el archivo esperado |

**No corta en el primer error: junta todos, no escribe nada de los discos afectados y
termina con código distinto de cero.** Una corrida tiene que decir todo lo que está mal,
no lo primero. Es lo contrario del criterio de `generar-tapas.mjs`, que trata los másters
faltantes como avisos (**medido en el repo**, línea 187): allá un derivado que falta deja
una pantalla sin adorno; acá deja un juego sin premio y un guardián en rojo.

---

## ADR-05.3 — PNG pre-teñido, no máscara en tiempo de ejecución

La alternativa obvia es servir **una** máscara en escala de grises por pasada y teñirla en
el navegador con `mask-image` más un fondo del color del token. Se descarta, y los motivos
importan más que la conclusión:

1. **No ahorra un solo archivo.** Son las mismas treinta máscaras; lo único que cambia es
   dónde se aplica el color. El argumento de peso, que es el único que la haría atractiva,
   no existe.
2. **Mueve trabajo al teléfono, que es el aparato que este proyecto defiende.** Tres capas
   enmascaradas del tamaño de la estampa, compuestas cada cuadro mientras corre la
   animación, en un celular de gama baja. `D-31` ya pagó una vez el precio de subestimar
   qué cuesta componer de más.
3. **El soporte de `mask-image` y sus prefijos es pendiente de ficha. No lo afirmo** — y el
   diseño está hecho para que la pregunta no haga falta: un PNG con alfa lo dibuja
   cualquier cosa que dibuje el sitio de hoy.
4. **Y el que decide todo: rompe la verificación.** Con la máscara teñida en CSS, "el color
   es el medido de esa tapa" se prueba leyendo una hoja de estilos, o sea, no se prueba:
   se comprueba que alguien escribió `var(--disco-...)`. Con el PNG pre-teñido, el guardián
   **abre el archivo y mira los píxeles**. El riesgo declarado del ciclo es que la imprenta
   sea un efecto de biblioteca; la única defensa que no depende de un ojo es esta.

**Lo que se paga, y hay que decirlo de frente: el color queda horneado.** Si `RES-37`
remuestrea una tapa y alguien cambia `tokens.css`, el sitio cambia de color y las treinta
imágenes no. La mitigación es la razón por la que el guardián compara píxel contra token:
**ese desfasaje no queda en silencio, deja el build en rojo con el nombre del disco.** Un
hex movido sin correr el taller es un error, y se entera solo.

---

## ADR-05.4 — Dónde viven y cómo los encuentra una isla

```
public/tapas/pasadas/<slug>-clara.png     320×320, PNG RGBA          30 archivos
public/tapas/pasadas/<slug>-media.png
public/tapas/pasadas/<slug>-clave.png
public/tapas/trasera/<slug>.jpg           320 px de lado largo       10 archivos
scripts/pasadas-manifiesto.json           lo lee el guardián, no el sitio
```

`<slug>` es uno de los diez de `src/lib/letra/discos.ts` — el mismo que ya usan el schema,
la Redondopedia, los tokens y `claseDisco` (**medido en el repo**).

### La convención, y por qué no hay un campo nuevo en ningún JSON

`src/scripts/partida-tema.ts` corre en el navegador y no puede leer un directorio.
`arte.ts` sí puede, pero importa `node:fs` y por eso solo sirve en build (**medido en el
repo**, línea 10). Entonces la ruta se **arma**, no se busca, y el insumo es un dato que la
isla ya tiene: `tema.disco` es el slug (`partida-tema.ts:766`, `claseDisco(tema.disco)`).

**Módulo hoja nuevo: `src/lib/tapa/pasadas.ts`.** Importa únicamente
`../letra/discos.ts`, que no importa nada — el mismo patrón exacto de `tema/paleta.ts`, y
la razón es la misma: `D-29` y `src/lib/islas.test.ts`. Vive en `tapa/` porque ahí vive su
guardián según el plan (`T-199`) y porque lo usan los dos juegos que muestran tapas.

```ts
export const PASADAS = ['clara', 'media', 'clave'] as const;
export type Pasada = (typeof PASADAS)[number];

/** `/tapas/pasadas/<slug>-<pasada>.png`, o null si el slug no es uno de los diez. */
export function rutaPasada(slug: string, pasada: Pasada): string | null;
/** `/tapas/trasera/<slug>.jpg`, o null. */
export function rutaTrasera(slug: string): string | null;
/** `/tapas/<slug>.jpg`, o null. La misma que `arte.ts:tapa()` devuelve en build. */
export function rutaFicha(slug: string): string | null;
```

**Devolver `null` ante un slug desconocido es la parte importante**, y es el criterio que
ya escribió `paleta.ts` para su caso: un disco que no está en la lista no arma una ruta
inventada que después va a dar 404. La pantalla pinta la revelación de siempre y listo.

**Para "Adiviná la tapa" (`T-206`) tampoco hace falta tocar `src/data/tapa.json` ni
`CTR-05`:** el ítem trae `imagen.archivo` con la forma `<slug>-zoom` (**medido en el
repo**: `tapa.json`, y la tabla `JUEGO` de `generar-tapas.mjs` que la produce), así que el
slug sale de sacarle el sufijo `-zoom`, y si lo que queda no es uno de los diez,
`rutaPasada` devuelve `null` y el juego sigue como hoy. **Ningún schema cambia en este
ciclo.**

Alternativa descartada: **agregarle a cada ítem un campo con la ruta de sus pasadas.**
Sería 105 líneas de JSON tocadas en `adivinar-tema.json`, un schema nuevo, una versión de
contrato, y una segunda fuente de verdad sobre algo que ya se deduce del slug. Un dato que
se puede derivar no se guarda.

---

## ADR-05.5 — Qué pasa cuando un archivo falta

Una isla no puede preguntar si un archivo existe: se entera cuando la imagen falla. La
regla, en orden de gravedad, y **ninguno de los tres casos mueve un píxel del botón**:

| Falta | Qué se ve |
|---|---|
| Una de las tres pasadas | **Degrada por capa**: se saca esa capa y se estampan las otras dos. Una tapa a dos tintas es una tapa a dos tintas, no un error |
| Las tres | Queda la foto sola (la ficha), que es el estado final de la estampa igual |
| También la ficha | La revelación de hoy: título, ficha de texto, puntos, botón. **El juego no pierde nada de lo que ya daba** |
| La trasera, al tocar | El objeto no gira y el control se retira. Las palabras son de `CNT-14`, en registro 3 |

**Las tres condiciones técnicas que hacen que eso sea cierto y no una intención:**

1. **La caja de la estampa tiene proporción declarada** (`aspect-ratio`, la de la ficha) y
   reserva su lugar antes de que llegue una imagen. Sin eso, cada capa que llega empuja el
   botón `Seguí` hacia abajo y el dedo toca lo que no quería. Es `UX-20` §1.3 aplicado a
   una imagen, y es el defecto más probable de toda la construcción.
2. **Cada `<img>` se crea con su manejador de error puesto**, y el manejador **saca el
   nodo**. Nunca queda el ícono de imagen rota: eso es la interfaz por defecto del
   navegador metida adentro de una pantalla que se pelea con la interfaz por defecto.
3. **La estampa se suma a una revelación que ya está pintada entera.** El texto, los
   puntos y el botón se pintan en el mismo cuadro que hoy (`pintarRevelacion`,
   `partida-tema.ts:753`); las capas aparecen cuando resuelven. **Nada espera a una
   imagen**, y si una llega tarde aparece en su lugar sin animación. El acierto puede ser
   el único grito del sitio, pero no puede ser una espera.

---

## ADR-05.6 — La trasera: es una ficha más, la de la otra cara

El encargo la llamaba "cuarta forma de `D-21`". **No hace falta una forma nueva, y es
mejor que no la haya:** `UX-04` ya define la **ficha** como "la tapa entera en baja, 320 px
del lado largo, con crédito visible junto a la imagen". Una contratapa a 320 px es
exactamente eso, aplicado a la otra cara. Así hereda sin escribir una línea el tope de
resolución de `D-04`, el mecanismo de crédito y la prohibición de la foto a sangre. **Si
`experiencia` quiere nombrarla aparte en `UX-04`, es su hoja; el contrato no lo necesita.**

### De qué máster sale cada una, con ficha y sin inventar

`RES-44` audita las 35 imágenes una por una, y el caso que el encargo marcaba como dudoso
ya está resuelto ahí (**leído en `INV-44`, filas 59 y 63**):

- `lobo-suelto-cordero-atado-cd1-trasera` → **vol. 1, *Lobo suelto***: "CD 51067" ×2,
  tracklist de **13** = `RES-20` exacto, veredicto **original confirmada**.
- `lobo-suelto-cordero-atado-cd2-trasera` → **vol. 2, *Cordero atado***: "CD 51167" ×2,
  tracklist de **12** = `RES-20` exacto, **original confirmada**.

Así que **`lobo-suelto` ← cd1, `cordero-atado` ← cd2**, que además es el mismo reparto que
`generar-tapas.mjs` ya usa para los frontales y para los zooms (**medido en el repo**,
`FICHAS` y `JUEGO`). No es una decisión nueva: es la que ya está tomada, con ficha detrás.
**Ojo con lo que `RES-44` sí deja cruzado y no toca a nadie acá:** los archivos `-cd`
(la cara del disco) de los dos volúmenes tienen los catálogos intercambiados. Esta
decisión no usa ningún archivo `-cd`.

Las diez traseras existen (**medido en el repo**: `Docs/INVESTIGACION/TapasDiscos/`, 1181×929).

### La advertencia de edición, que es la única regla estricta que le queda al proyecto

`RES-44` marca **siete de estas diez traseras como "reedición confirmada"** o no
determinable: llevan catálogo y sello (`P. Rey Discos`, `Del Cielito`, barcodes) que no
corresponden a la edición original. Eso **no impide mostrarlas** —`D-21` prohíbe una sola
cosa, usar una imagen de edición no confirmada **como respuesta correcta**, y la trasera
acá no es una respuesta: es el objeto que ya ganaste— **pero prohíbe una cosa concreta**:

> **La pantalla no puede afirmar año, sello ni edición a partir de la trasera.** El año y
> el disco los sigue diciendo el catálogo de temas, que es dato fichado. Si algún texto de
> la vuelta dijera "esta es la edición de 1985" leyéndolo del inlay, el juego le estaría
> marcando error al que se sabe el disco, que es lo único que este proyecto declaró
> estricto (`CLAUDE.md`, `D-14`).

Y la excepción de crédito que ya existe y hay que arrastrar: **para `la-mosca-y-la-sopa`,
el pie no se le acredita a Rocambole** mientras `RES-44` siga diciendo que ese frontal es
un rediseño (**medido en el repo**: comentario de `generar-tapas.mjs`, y
`Docs/SUGERENCIAS/HILO-para-investigador-tapa-de-la-mosca.md`). Vale igual para su estampa.

### Se pide recién al tocar

El "dala vuelta" **no precarga nada**: el `<img>` de la trasera **se crea adentro del
manejador del toque**, no antes. No es `preload="none"` sobre un nodo que ya está —eso solo
vale para medios—, es no tener el nodo. Quien nunca da vuelta la tapa **no baja un byte**
de las diez traseras. Es el mismo criterio con el que `pintarRevelacion` sirve el tema
entero hoy (`partida-tema.ts:795`, `audio.preload = 'none'`, **medido en el repo**).

---

## ADR-05.7 — La sala se vuelve el disco: el velo alcanza, y hay un agujero en el guardián

`T-202` quiere que al acertar el fondo velado de la pantalla pase a ser la tapa que
sacaste, reusando la ficha de 320 px. **Ratifico que el velo de `UX-04` alcanza aunque la
imagen se estire, y no hace falta un token nuevo, ni un par nuevo en `contraste.test.ts`,
ni un archivo nuevo.** El argumento es de una línea:

> Lo que `contraste.test.ts` mide no es una tapa: es **el velo compuesto sobre blanco
> puro**, el peor caso matemático posible (`UX-04`, "El piso de legibilidad"). **Estirar
> una imagen no puede producir un píxel más claro que el blanco puro**, así que una ficha
> escalada a cualquier tamaño sigue estando por debajo del peor caso que ya está testeado.
> El velo no protege contra la definición de la imagen: protege contra su luminancia.

Con dos condiciones que sí son duras:

1. **Se reemplaza, no se apila.** La tapa del disco ocupa el lugar de `lobo-tiras`, no se
   suma. `UX-20` §1.2 topea en dos capas —grano + un recorte real— y ese techo existe
   justamente porque tres capas dejan de tener un peor caso auditable.
2. **La ficha se baja una sola vez.** Es la misma URL que usa la foto que se fija en la
   estampa. Una descarga, dos usos.

### El agujero, que hay que cerrar en el mismo commit

`estilos.test.ts` verifica que ninguna tapa entre de fondo sin velo, y lo hace buscando la
cadena **`/tapas/fondo/`** dentro del bloque de declaraciones (**medido en el repo**, línea
106). La ficha vive en `/tapas/<slug>.jpg` — **fuera de ese patrón** — y encima la va a
poner la isla, en tiempo de ejecución, donde ningún test de CSS mira. Traducido: **si
`T-202` se construye tal cual, la única tapa de fondo del sitio que se pone desde
JavaScript sería la única que nadie audita.**

La forma de cerrarlo sin inventar nada:

- **La isla nunca escribe una imagen de fondo en línea.** Escribe una **variable**:
  `estilo.setProperty('--tapa-de-la-sala', 'url("/tapas/gulp.jpg")')`. Quien pone la imagen
  es una regla de `juego.css`, y **esa regla lleva el velo en el mismo bloque**, como todas
  las demás.
- **Convención, para que la máquina pueda encontrarlas:** toda propiedad personalizada que
  transporte la URL de una tapa se llama **`--tapa-*`**. Ninguna otra cosa usa ese prefijo.
- **`estilos.test.ts` extiende su patrón** de `/tapas/fondo/` a `/tapas/` **o**
  `var(--tapa-`. Es una línea de test y cubre las dos vías. Lo escribe el hilo principal en
  `T-200`/`T-202`; acá queda el requisito.

Y una regla de borde, para que el velo no tenga que crecer: **sobre la estampa no va
texto.** El título, los puntos y el crédito van al lado o abajo, sobre `--fondo`, que es el
par testeado de siempre. Si `experiencia` quiere texto encima de la tapa impresa, eso
necesita velo y par testeado, y es una vuelta a `UX-04`, no una decisión de construcción.

---

## ADR-05.8 — El presupuesto

Cuatro números sobre la mesa, todos del repo: el sitio pesaba **11 KB comprimidos por
visita** (`D-15`); un fondo de tapa puede pesar hasta **60 KB** y el más pesado del
catálogo pesa **53 KB** (`UX-04`); las fichas de 320 px pesan hoy entre **6 y 34 KB**
(medición del hilo principal); y **un fragmento de audio pesa ≈80 KB, con 320 KB por vuelta**
(`CTR-01.5`, **medido en el repo**).

| Concepto | Tope | Por qué ese número |
|---|---|---|
| Una separación | **20 KB** | El caso peor teórico de una máscara de 320×320 sin comprimir es 12,8 KB (un bit por píxel); 20 KB deja margen para una tapa muy picada y **no deja margen para una imagen mal hecha** |
| Las tres de un disco | **48 KB** | Juntas tienen que costar **menos que un solo fondo de `UX-04`**. Es el techo que ya existía, aplicado a la pieza nueva |
| Una trasera | **40 KB** | Es una ficha: las diez frontales van de 6 a 34 KB. Se busca la calidad más alta que entre en el tope, como ya hace `escribirBajoTope` en `generar-tapas.mjs` |
| **Una revelación con acierto** | **≤ 82 KB** | tres pasadas (≤48) + la ficha (≤34), que además sirve a la estampa y a la sala. **Es lo que pesa un fragmento de audio del mismo tema**, y llega **después** de la respuesta, no antes |
| Una revelación con fallo | **≤ 20 KB** | la clave sola. El que no la sacó no paga el color, que es la decisión del juego |
| Una vuelta de cuatro temas | ≤ 328 KB, y menos si se repite disco | contra 320 KB de audio que la misma vuelta ya baja. **La estampa no es lo que hace pesada esta pantalla** |
| Los 40 archivos en el repo | ~500 KB versionados | `.gitignore` no excluye `public/tapas/` (**medido en el repo**): se versionan, como las fichas de hoy |

**Y la regla que ordena todo el presupuesto: nada de esto se pide antes de que el tema se
cierre.** Ni precarga, ni `<link rel=preload>`, ni bajar la tapa del tema mientras suena el
fragmento. Durante la partida el ancho de banda es del audio (`CTR-01`), y el reveal
progresivo de 0,1 s es lo único de este sitio que no puede esperar.

---

# CTR-12 — El contrato de las separaciones

Lo que sigue es lo que `T-199` tiene que producir y lo que
`src/lib/tapa/pasadas.test.ts` tiene que hacer cumplir. Un incumplimiento acá es un build
en rojo, no una discusión.

## 1. Los 40 archivos

| Ruta | Cantidad | Formato | Medidas | Tope |
|---|---|---|---|---|
| `public/tapas/pasadas/<slug>-clara.png` | 10 | PNG RGBA | las de su ficha (hoy 320×320) | 20 KB |
| `public/tapas/pasadas/<slug>-media.png` | 10 | PNG RGBA | ídem | 20 KB |
| `public/tapas/pasadas/<slug>-clave.png` | 10 | PNG RGBA | ídem | 20 KB |
| `public/tapas/trasera/<slug>.jpg` | 10 | JPEG | 320 px de **lado largo**, proporción del máster | 40 KB |

Los diez `<slug>` son los de `DISCOS`. **La trasera no se recorta a cuadrado**: recortar
sería elegir qué parte de la contratapa se ve, y eso es del catálogo de `experiencia`
(`UX-05`), no del taller.

## 2. El perfil del PNG, y por qué está acotado

**8 bits por canal, color type 6 (RGBA), sin entrelazado, sin paleta.** No es un detalle de
codificación: es lo que permite que el guardián **abra el archivo y mire los píxeles con
`node:zlib` y nada más**. Si el taller emitiera PNG con paleta o WebP, el guardián
necesitaría una dependencia para verificar la única afirmación que el riesgo del ciclo pide
verificar, y "el color es el medido" volvería a ser una promesa.

Si algún día un archivo no entra en su tope, **la salida no es cambiar de formato**: es
subir el suavizado, revisar la ficha, o volver a este documento.

## 3. Las constantes del taller, con nombre

Mismo criterio que `ADR-04.1` y que `D-32`: ningún número se escribe dos veces ni queda
suelto. Viven al principio de `scripts/generar-pasadas.mjs`.

| Constante | Valor | Qué pasa si se mueve |
|---|---|---|
| `SIGMA_SUAVIZADO` | `1.4` | menos, y el borde persigue el ruido del JPEG; **techo `3.0`**, arriba de eso la tapa deja de reconocerse |
| `CUOTA_CLARA` | `0.25` | la fracción de píxeles de la pasada clara |
| `CUOTA_MEDIA` | `0.40` | la de la media. La clave se lleva el resto (`0.35`) |
| `TOLERANCIA_COBERTURA` | `0.12` | cuánto puede apartarse la cobertura real de su cuota. Existe porque una tapa con grandes zonas planas empata en el histograma |
| `MIN_CONTRASTE_ENTRE_TINTAS` | `1.5` | por debajo, la pasada es **muda** y se avisa. No es error (`ADR-05.2`) |
| `TOPE_KB_PASADA` | `20` | por archivo |
| `TOPE_KB_PASADAS` | `48` | por disco, las tres juntas |
| `TOPE_KB_TRASERA` | `40` | por archivo |
| `ANCHO_TRASERA` | `320` | lado largo. `D-04`: el máster no llega al sitio |

## 4. El manifiesto: una declaración que se verifica, no una verdad

`scripts/pasadas-manifiesto.json`, escrito por el taller. **No lo baja nadie: no está en
`public/`.** Por disco: los dos hex usados y a qué pasada fue cada uno, la cobertura de
cada máscara, los bytes de cada archivo, los avisos de pasada muda, y el **hash corto
(SHA-1, 8 dígitos) de la ficha de la que salieron**.

El hash es lo único que el guardián no podría deducir solo, y cierra el agujero que ningún
otro control cubre: **una ficha regenerada con pasadas viejas.** El test recalcula el hash
de `public/tapas/<slug>.jpg` con `node:crypto` y compara. Todo lo demás del manifiesto se
vuelve a medir contra los archivos: **el manifiesto no se cree, se comprueba.**

## 5. Qué mira `src/lib/tapa/pasadas.test.ts`

Cada caso cierra un apartado. Sin esto, el `ADR-05` es una opinión.

| # | Caso | Cierra |
|---|---|---|
| 1 | **Existen los 40 archivos**, uno por disco y por pasada, más las diez traseras | `CTR-12.1` |
| 2 | Ninguna pasada pasa **20 KB**; las tres de un disco no pasan **48 KB**; ninguna trasera pasa **40 KB** | `ADR-05.8` |
| 3 | Cada PNG tiene **alfa**: IHDR con bit depth 8, color type 6, entrelazado 0 | `CTR-12.2` |
| 4 | Las medidas de cada pasada **son las de su ficha**, leídas del archivo con `medidas()` de `arte.ts` — no un 320 escrito a mano | `ADR-05.1` |
| 5 | **Una sola tinta por archivo:** entre los píxeles con alfa > 0 hay un único RGB | candado 3 |
| 6 | **Ese RGB es el del token**, con el taller y el test parseando `tokens.css` cada uno por su lado, y **±2 por canal** de tolerancia de redondeo | `ADR-05.2`, y es **el test del riesgo del ciclo** |
| 7 | **La asignación clara/media respeta la luminancia:** la clara es el más luminoso de los dos tokens del disco, recalculado por el test | `ADR-05.2` |
| 8 | La clave de los diez discos es **`--fondo`** | `ADR-05.1` |
| 9 | **Tinta plana:** no existe un solo píxel con alfa distinta de 0 y de 255 | candado 2 |
| 10 | Hay al menos un píxel opaco y al menos uno transparente. **Una pasada no puede ser un rectángulo lleno ni un archivo vacío** | `ADR-05.1` |
| 11 | Las tres máscaras de un disco son **disjuntas** y cubren la imagen entera: ningún píxel opaco en dos, ninguno transparente en las tres | `ADR-05.1` |
| 12 | La cobertura de cada pasada cae dentro de su cuota ± `TOLERANCIA_COBERTURA` | `ADR-05.1` |
| 13 | El hash de ficha del manifiesto coincide con el de `public/tapas/<slug>.jpg` | `CTR-12.4` |
| 14 | `rutaPasada`/`rutaTrasera`/`rutaFicha` devuelven **`null`** para un slug que no está en `DISCOS`, y para `''` | `ADR-05.4` |
| 15 | `rutaFicha(slug)` devuelve **lo mismo** que `arte.ts:tapa(slug)` para los diez. Dos convenciones de ruta que se separan en silencio es un 404 esperando | `ADR-05.4` |
| 16 | `src/lib/tapa/pasadas.ts` **no importa `node:*`** ni nada que lo arrastre (lo cubre `islas.test.ts`, se corre igual) | `D-29` |

**Y dos que no son de este archivo pero son de este contrato**, y las tiene que hacer
`T-200`/`T-202` en `src/lib/estilos.test.ts`:

| # | Caso | Cierra |
|---|---|---|
| 17 | El patrón del guardián del velo pasa de `/tapas/fondo/` a `/tapas/` **o** `var(--tapa-` | `ADR-05.7` |
| 18 | Ninguna isla escribe `style.backgroundImage` con una ruta de tapa: la imagen entra por `--tapa-*` | `ADR-05.7` |

## 6. Lo prohibido, en una lista para revisar

1. Un hex de disco escrito fuera de `tokens.css` — en el taller, en el guardián o en el CSS.
2. Un color de clave que no sea `--fondo`.
3. Alfa intermedia en una separación.
4. Más de un RGB adentro de una separación.
5. El corrimiento de registro horneado en el archivo.
6. Pedir una pasada, una ficha o una trasera **antes** de que el tema se cierre.
7. Una imagen de fondo escrita en línea desde una isla.
8. Texto encima de la estampa sin velo y sin par testeado.
9. Un campo nuevo en `adivinar-tema.json` o en `tapa.json` para llegar a estos archivos.
10. Que el taller corra dentro de `npm run build` (ver el apartado siguiente).
11. Afirmar año, sello o edición a partir de una trasera (`ADR-05.6`).
12. Emitir menos de tres pasadas por disco, aunque una sea muda.

## 7. El taller no entra al build, y esto no es una preferencia

`sharp` **no está declarado en `package.json`** — ni en `dependencies` ni en
`devDependencies` (**medido en el repo**). `generar-tapas.mjs` ya vive así: se corre a mano
y sus salidas se versionan. `generar-pasadas.mjs` hereda ese régimen entero, y la razón es
dura: **el despliegue estático de `D-15` no puede depender de una herramienta que el repo
no declara.** Un `npm run build` en Vercel que necesite `sharp` es un sitio que deja de
publicarse el día que alguien limpie `node_modules`.

Que el comando entre a `package.json` como `generar-pasadas` está bien —los otros nueve
generadores están ahí— **mientras no se lo cuelgue de `build`**.

---

## Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| **`mask-image` en tiempo de ejecución, con máscaras en gris** | No ahorra archivos, mueve composición al teléfono, depende de un soporte que no tengo fichado, y **rompe la única verificación que prueba que el color es el medido**. Ver `ADR-05.3` |
| **Máscaras acumulativas (cada tinta imprime también lo más oscuro)** | Hornea el orden de impresión en los archivos: el día que llegue `RES-54` habría que regenerar treinta. Y con tinta opaca, lo que queda debajo no se ve: es peso por nada |
| **Umbrales fijos iguales para las diez tapas** | *Cordero atado* es casi negra y *Gulp!* casi crema: con un número fijo, una imprime una sola pasada y la otra casi ninguna clave. Obligaría a afinar diez juegos de números a mano, y a reafinarlos cada vez que se regenere una ficha |
| **Alfa con medio tono (la máscara lleva la luminancia adentro)** | Es un degradado con otro nombre, y `diseno-marca.md` los veta. Además la separación dejaría de ser probable a máquina: "una tinta plana" es una aserción, "un degradado del color correcto" no |
| **Separar desde el máster de 953 px y reducir** | Rompe el registro con la foto que se fija encima —la ficha no es una reducción exacta de la máscara— y crea una segunda fuente de verdad sobre la misma tapa |
| **WebP o AVIF con alfa** | Pesan menos y **no los puede abrir el guardián sin una dependencia**. El ahorro es de pocos KB sobre un presupuesto que ya entra; el costo es dejar de poder probar el color |
| **PNG con paleta (dos colores + `tRNS`)** | Mismo argumento: pesaría la mitad y complicaría el decodificador del guardián con otro camino (PLTE, `tRNS`, profundidades menores a 8). El peso no es el problema de esta pieza |
| **Un campo `tapa`/`pasadas` en el JSON de cada juego** | 105 ítems tocados, un schema nuevo, una versión de contrato y una segunda verdad sobre algo que se deduce del slug |
| **Un manifiesto que la isla lea en el navegador para saber qué archivos existen** | Un pedido de red más, en la pantalla que menos lo necesita, para evitar un 404 que ya está manejado por capa (`ADR-05.5`) |
| **Generar las pasadas en el build de Astro (a demanda)** | Ata el despliegue a `sharp` (apartado 7), y convierte cuarenta archivos deterministas en trabajo repetido en cada publicación |
| **Sumar las dos formas nuevas a `generar-tapas.mjs`** | Ese script produce lo que ya funciona y trata los faltantes como avisos; el taller nuevo tiene que **fallar**. Dos políticas de error en un archivo terminan siendo una sola, la más floja |
| **No emitir las pasadas mudas** (`gulp` clara, `cordero-atado` media) | Convierte "existen los 40" en "existen entre 34 y 40" y obliga a la isla a saber cuáles faltan. El ahorro es de dos archivos de pocos KB |
| **Un negro propio para la clave** | Un hex nuevo fuera del circuito del lienzo, para reemplazar a un token que ya existe y que además es la base que `D-19` dice que no rota |
| **Recortar la trasera a cuadrado en build** | Elegir qué parte de la contratapa se ve es del catálogo de `experiencia` (`UX-05`), no del taller |
| **Precargar las pasadas del tema en curso mientras se juega** | Compite con el fragmento de audio, que es lo único de este sitio que no puede esperar (`CTR-01`, `D-26`) |

---

## Consecuencias

**Lo que se vuelve fácil:**

- El premio del juego pasa a ser **el disco**, y no cuesta un schema, un campo, ni una
  decisión de contenido: una función que arma una ruta con un slug que la isla ya tenía.
- "Adiviná la tapa" (`T-206`) hereda todo gratis: mismos archivos, mismo módulo, misma
  convención, y por fin muestra la tapa entera al revelar — lo que el ciclo 10 dejó afuera.
- Si `RES-37` remuestrea una tapa, el sitio y la estampa **no pueden desincronizarse en
  silencio**: el build queda en rojo con el nombre del disco.
- Si `RES-54` dice que el orden de las pasadas es otro, se cambia un retraso en el CSS.
  Cero archivos regenerados.

**Lo que se paga:**

- **Cuarenta archivos más en el repo**, ~500 KB versionados, y un taller más que hay que
  acordarse de correr cuando cambia una ficha. La mitigación es el hash del manifiesto:
  olvidarse deja de ser silencioso.
- **El color queda horneado** (`ADR-05.3`). Es el precio de poder probarlo.
- **El guardián tiene que decodificar un PNG a mano**, con `node:zlib`. Son unas setenta
  líneas de test que nadie va a querer escribir, y son las que sostienen la afirmación más
  cara del ciclo.
- **Dos tapas imprimen dos tintas visibles en vez de tres**, y no hay nada que arreglar:
  es lo que da la paleta medida de esas tapas.
- **Nada de esto prueba que la estampa se vea a serigrafía.** Los tests fijan el material y
  las prohibiciones; que parezca impresa lo decide un ojo, con `UX-22` de vara y `REV-11`
  de juez.

---

## Lo que no decido yo

- **Cómo se ve y cuánto dura la impresión**, qué se estampa y qué no, y el equivalente
  quieto de cada pieza: `UX-22` (`T-195`, `experiencia`). Le dejé en
  `Docs/SUGERENCIAS/ARQ-para-experiencia-limites-de-la-estampa.md` las cuatro cosas de este
  documento que le llegan como restricción.
- **Las palabras**: `CNT-14` (`T-198`, `contenido`). Tres que este documento genera y no
  escribe: qué dice la pantalla cuando la trasera no llega, cómo se nombra el crédito de la
  estampa, y el crédito de *La mosca y la sopa*, que **no lleva el nombre de Rocambole**
  mientras `RES-44` siga en pie.
- **El sello de crédito tiene que nombrar el disco que se estampó.** Es la condición 1 de
  `D-21` (*el crédito dice qué tapas se usaron en esa pantalla*), y hoy la pantalla de
  "Adiviná el tema" viste un solo disco fijo. El mecanismo ya está definido en `UX-04`
  (sello de esquina en islas de partida); lo que cambia es que el texto pasa a depender del
  tema. Lo construye `T-200`.
- **El orden de las pasadas**: `RES-54` (`T-196`). No lo escribo de memoria.
- **La construcción y la verificación**: hilo principal (`T-199`..`T-206`) y `revisor`.
  Este rol no tiene con qué correr un comando (`D-12`).

## Pendientes de ficha — para `investigador`

Ninguno frena esta decisión.

1. **`RES-54`, ya pedida en `T-196`:** el orden real de las pasadas de una serigrafía y por
   qué la clave va última. **Cambia un retraso de CSS, no un archivo** (`ADR-05.1`).
2. **Soporte real de `mask-image` y sus prefijos** en los navegadores de gama baja. Hoy no
   lo afirmo en ninguna dirección; el diseño está hecho para que no importe. Serviría el
   día que alguien quiera reabrir `ADR-05.3`.
3. **Si existe algo escrito sobre cómo separaba Rocambole sus propias tapas** — cuántas
   tintas, con qué criterio. Si aparece, este documento se revisa entero: hoy la separación
   en tres es criterio propio del rol apoyado en `RES-06` (rodillo y serigrafía), no una
   reconstrucción de su método.

---

## Cómo se verifica

Lo corre el hilo principal o `revisor` (`D-12`: yo no tengo con qué). En este orden.

**Antes de construir nada — la línea de base, que tiene que dar exactamente esto:**

```powershell
# Las diez fichas estan y son de las que salen las pasadas.
Get-ChildItem public\tapas\*.jpg | Select-Object Name, Length
# Los veinte tokens de disco + --fondo + --papel viven en tokens.css y en ningun otro lado.
Select-String -Path src\styles\*.css -Pattern '--disco-.*-(tinta|apoyo):'
# Cero hex fuera de tokens.css (tiene que seguir en cero despues de todo el ciclo).
node --test src/lib/estilos.test.ts
```

**Después de `T-199` (el taller):**

```bash
node scripts/generar-tapas.mjs        # primero: las pasadas salen de las fichas
node scripts/generar-pasadas.mjs      # imprime KB, cobertura y avisos por disco
node --test src/lib/tapa/pasadas.test.ts
node --test src/lib/islas.test.ts     # D-29: pasadas.ts no arrastra node:*
```

La corrida del taller tiene que terminar con **código 0**, cuarenta archivos, y **exactamente
dos avisos de pasada muda** —`gulp` clara contra el papel, `cordero-atado` media contra la
clave—. Un tercer aviso es un dato nuevo: se mira antes de seguir.

**Después de `T-200`..`T-203` (la estampa, la sala, la trasera):**

```bash
npm test
npm run check
npm run build
node --test src/lib/contraste.test.ts
node --test src/lib/movimiento.test.ts
node --test src/lib/estilos.test.ts
```

**A ojo, en un teléfono de verdad a 375×812, que es lo que ninguna máquina hace:**

1. Una vuelta con **acierto**: la tapa se imprime, el botón `Seguí` **está desde el primer
   cuadro y no se mueve** cuando llegan las capas.
2. Una vuelta con **fallo**: **una sola tinta**, y se lee como una decisión del juego, no
   como una imagen a medio cargar. Es la pregunta que `REV-11` va a hacer.
3. **En la pestaña de red:** al abrir el juego no se pide ni una pasada; al cerrar el tema
   se piden tres; **la trasera recién aparece cuando se toca la tapa**.
4. Con la red estrangulada a 3G: la revelación se lee entera antes de que llegue una sola
   imagen.
5. Con **`prefers-reduced-motion`** activo: la estampa aparece terminada, sin secuencia, y
   dice lo mismo (`UX-20` §5).
6. *Gulp!* y *Cordero atado*, de a una: **se reconocen igual** aunque impriman dos tintas.
7. Con `public/tapas/pasadas/` renombrada a mano: la revelación cae a la foto sola y
   después al texto, **sin un solo ícono de imagen rota y sin que el botón se corra**.
