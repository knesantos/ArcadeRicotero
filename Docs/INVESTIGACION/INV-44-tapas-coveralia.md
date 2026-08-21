# INV-44 — Auditoría de edición de las 35 tapas y evaluación de Coveralia

> Ciclo 4, `T-47`, 2026-08-21. Consolida dos auditorías independientes (Tanda A y Tanda
> B) hechas sobre `Docs/INVESTIGACION/TapasDiscos/` contra `RES-02`/`RES-20` (discografía)
> y `RES-06`/`RES-22` (arte de tapa documentado). No se rehace ninguna de las dos: se
> consolidan tal cual llegaron, con una sola tabla y un solo criterio de columnas.
>
> Consume: `RES-02`, `RES-06`, `RES-20`, `RES-22`, `RES-25`, `D-21`.
> Numeración: `RES-44`, `RES-46` (`RES-45` reservado para `T-60`, no se toca acá).
>
> **Método de las columnas "veredicto"/"apto":** son inferencia razonada del
> investigador a partir de marcadores visibles (sello, catálogo, código de barras)
> cruzados contra `RES-02`/`RES-20`, no una declaración externa. Se rotulan como
> inferencia salvo donde la fuente web lo dice de forma textual.

---

## ⚠ ADVERTENCIA OPERATIVA — leer antes que la tabla

**Si `contenido` usa la cara `frontal` como la imagen de "adivinar la tapa" (lo más
natural para `US-04`), quedan exactamente 10 títulos aptos sobre 11 auditados — el piso
de `US-04` con margen cero.** El único título sin ninguna cara apta es *La mosca y la
sopa*. Y uno de esos 10 es *En directo*, álbum **en vivo que no figura entre los diez
discos de estudio de `RES-20`**. Si `producto`/`contenido` deciden que `US-04` es
solo sobre discografía de estudio, quedan **9 títulos — por debajo del piso**. Esta
decisión de alcance (¿entra un álbum en vivo?) no la tomo yo: la tiene que resolver
`producto`.

---

## RES-44 — Auditoría de edición: 10 de 11 títulos tienen al menos una cara apta para `US-04`; *La mosca y la sopa* queda afuera entera

**Hallazgo en una línea:** de las 35 imágenes de `TapasDiscos/`, la mayoría de
contratapas y discos CD muestran sello (`P. Rey Discos`/`Del Cielito Records`) y
catálogo que no corresponden a la edición original de `RES-02`/`RES-20`; la única
carátula frontal que falla por representar una **tapa rediseñada, no la obra de
Rocambole**, es *La mosca y la sopa*.

### Tabla consolidada (35 imágenes, slug = nombre de archivo sin extensión)

| archivo | título | cara | año/sello esperado | marcadores visibles | veredicto | apto US-04 | fuente |
|---|---|---|---|---|---|---|---|
| `gulp-frontal` | Gulp! | frontal | 1985, Wormo SW1013 | solo arte, manuscrito verde, sin catálogo | coincide con la original, sin marcador que lo pruebe (verde es variante de tinta real documentada) | **SÍ** | indiehoy.com/indieayer (búsqueda) — 2026-08-21 |
| `gulp-trasera` | Gulp! | trasera (inlay CD) | ídem | catálogo "CD 50.013", barcode 7796876500135, "Del Cielito Records"/DBN | reedición confirmada — CD Del Cielito, no LP Wormo original | **NO** | rateyourmusic.com/.../gulp (búsqueda) — 2026-08-21 |
| `gulp-interior-frontal` | Gulp! | interior-frontal | ídem | mismo manuscrito en rojo/amarillo, sin catálogo | coincide con la original, sin marcador que lo pruebe | **SÍ, con reserva** (panel interior, no la cara de venta) | ídem fila 1 |
| `oktubre-frontal` | Oktubre | frontal | 1986, Wormo(vinilo)/Del Cielito(CD) | solo arte, sin catálogo/sello/barcode | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `oktubre-trasera` | Oktubre | trasera (inlay CD) | ídem | "CD 50014" x2, "Del Cielito Records"/DBN, sin barcode | no determinable el año — catálogo reutilizado en reediciones 1990–2001 | **NO** | discogs.com/master/328889 (403 directo, vía snippet) — 2026-08-21 |
| `oktubre-cd` | Oktubre | cd | ídem | "CD 50.014", "Industria Argentina", "Publicado por P. Rey Discos" | reedición confirmada — P. Rey Discos no existe hasta 1998 (`RES-02`) | **NO** | `RES-02` (interno) |
| `un-baion-para-el-ojo-idiota-frontal` | Un baión... | frontal | 1988, Wormo | firma "Rocambole", sin catálogo | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `un-baion-para-el-ojo-idiota-trasera` | Un baión... | trasera (inlay CD) | 1988 Wormo (o reedición 1991 Del Cielito SW1015, `RES-02`) | "CD 50015", barcode 7796876500159, "P. Rey Discos" | reedición confirmada — tercera edición, ni Wormo ni Del Cielito 1991 | **NO** | `RES-02` (interno) |
| `bang-bang-estas-liquidado-frontal` | ¡Bang!¡Bang!... | frontal | 1989, Del Cielito | firma "Cohen" en el cuadro de la escena | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `bang-bang-estas-liquidado-trasera` | ídem | trasera (inlay CD) | ídem | "CD 50767", barcode 7796876507677, "P. Rey Discos" | reedición confirmada | **NO** | `RES-02` (interno) |
| `bang-bang-estas-liquidado-cd` | ídem | cd | ídem | mismo catálogo, "Industria Argentina", "P. Rey Discos" | reedición confirmada, misma que la trasera | **NO** | — |
| `bang-bang-estas-liquidado-interior-frontal` | ídem | interior-frontal | ídem | versión ampliada del cuadro, firma ilegible | coincide con la original, sin marcador que lo pruebe | **SÍ, con reserva** (panel interior) | — |
| `la-mosca-y-la-sopa-frontal` | La mosca y la sopa | frontal | 1991, Del Cielito | foto de recital en vivo, sello de goma amarillo con mosca; **no hay** gato momificado ni cerdos/peces (arte real, `RES-22`) | **rediseño confirmado — no es la tapa de Rocambole** | **NO — crítico** | redondossubtitulados.com (snippet, fetch 403, dominio ya "reportado" en `RES-06`) — 2026-08-21 |
| `la-mosca-y-la-sopa-trasera` | ídem | trasera (inlay CD) | ídem | edificio de columnas (hipótesis Plaza Lavalle/Tribunales, no confirmada) + personaje con caja y olla, temática compatible con `RES-22`; "CD 50 867", barcode 7796876508674 | reedición confirmada (formato); motivo compatible con el arte real, a diferencia del frontal | **NO** | — |
| `la-mosca-y-la-sopa-interior-frontal` | ídem | interior-frontal | ídem | foto aislada del mismo edificio, sin texto ni logo | no determinable sola | **NO** | — |
| `lobo-suelto-cordero-atado-cd1-frontal` | vol.1 (Lobo suelto) | frontal | 1993, Del Cielito | rostro gato/lobo en B&N, sin catálogo | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `lobo-suelto-cordero-atado-cd1-trasera` | vol.1 | trasera | ídem | "CD 51067" x2, "Del Cielito Records"/DBN, tracklist de 13 = `RES-20` exacto | **original confirmada** | **SÍ** | WebSearch cruzando Discogs/RYM — 2026-08-21 |
| `lobo-suelto-cordero-atado-cd1-interior-frontal` | vol.1 | interior-frontal | ídem | "CD 51067" impreso | original confirmada | **SÍ** | — |
| `lobo-suelto-cordero-atado-cd1-cd` | vol.1 (nominal) | cd | ídem | catálogo visible "CD51167" — **es el de vol.2** | original confirmada como objeto, pero **archivo cruzado con vol.2** | **NO** | WebSearch — 2026-08-21 |
| `lobo-suelto-cordero-atado-cd2-frontal` | vol.2 (Cordero atado) | frontal | 1993, Del Cielito | arte naif azul/naranja (autoría Semilla Bucciarelli, no Rocambole) | coincide con la original, sin marcador que lo pruebe | **SÍ** | es.wikipedia.org/wiki/Lobo_suelto,_cordero_atado,_vol._2 — 2026-08-21 |
| `lobo-suelto-cordero-atado-cd2-trasera` | vol.2 | trasera | ídem | "CD 51167" x2, "Del Cielito Records"/DBN, tracklist de 12 = `RES-20` exacto | original confirmada | **SÍ** | ídem fila lobo1-trasera |
| `lobo-suelto-cordero-atado-cd2-cd` | vol.2 (nominal) | cd | ídem | catálogo visible "CD51067" — **es el de vol.1** | original confirmada como objeto, pero **archivo cruzado con vol.1** (mismo problema, invertido) | **NO** | ídem |
| `luzbelito-frontal` | Luzbelito | frontal | 1996, Del Cielito | tapa tipo libro de cuero verde, sin catálogo | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `luzbelito-trasera` | Luzbelito | trasera | ídem | tracklist de 11 = `RES-20` exacto; sin sello/catálogo en el recorte | coincide con la original, apoyado en tracklist | **SÍ** | — |
| `luzbelito-interior-frontal` | Luzbelito | interior-frontal | ídem | ninguno | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `luzbelito-cd` | Luzbelito | cd | ídem | "SADAIC/AADI/CAPIF P(1996) Del Cielito Records CD51567" | **original confirmada** | **SÍ** | — |
| `ultimo-bondi-a-finisterre-frontal` | Último bondi | frontal | 1998, P. Rey Discos | texto rojo vertical parcial, ilegible (resolución insuficiente) | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `ultimo-bondi-a-finisterre-trasera` | Último bondi | trasera | ídem | "Producida por P. Rey Discos", "Impresa en La Plata - 1998", tracklist de 10 = `RES-20` exacto | **original confirmada** | **SÍ** | — |
| `ultimo-bondi-a-finisterre-interior-frontal` | Último bondi | interior-frontal | ídem | "Postales virtuales: Rocambole", sin catálogo/fecha | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `momo-sampler-frontal` | Momo Sampler | frontal | 2000, P. Rey Discos | máscara de piedra sobre negro, sin catálogo | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `momo-sampler-trasera` | Momo Sampler | trasera | ídem | tracklist de 11 = `RES-20` (diferencia mínima de segundos, sin relevancia); sin sello/catálogo | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `momo-sampler-interior-frontal` | Momo Sampler | interior-frontal | ídem | cita de Apuleyo, dedicatoria | coincide con la original, sin marcador que lo pruebe | **SÍ** | — |
| `en-directo-frontal` | En directo *(fuera del canon de `RES-20`, álbum en vivo)* | frontal | no está en `RES-02`/`RES-20`; en.wikipedia da 1992, Del Cielito | semitono/grano sobre foto de recital | coincide con la original, sin marcador que lo pruebe | **SÍ, con reserva de alcance** (ver advertencia) | en.wikipedia.org/wiki/En_Directo_(...) — 2026-08-21 |
| `en-directo-trasera` | En directo | trasera (inlay CD) | ídem | tracklist de 12 = Wikipedia exacto (incluye "El blues del noticiero"); catálogo "XXX000" (parece placeholder); barcode 7796876100007; "Publicado por P Rey Discos" (no Del Cielito, que da la fuente para el original) | reedición confirmada, con reserva — catálogo anómalo | **NO** | ídem |
| `en-directo-interior-frontal` | En directo | interior-frontal | ídem | foto de 6 personas al aire libre, sin título ni logo | no determinable | **NO** | — |

### Resumen por título (los 11 que `contenido` tiene que leer para elegir los 10 ítems de `US-04`)

**Aptos enteros (3):** Luzbelito (4/4), Momo Sampler (3/3), Último bondi a Finisterre (3/3).

**Aptos solo en alguna cara (7):** Oktubre (1/3, solo frontal), Gulp! (2/3, frontal +
interior con reserva), Un baión para el ojo idiota (1/2, solo frontal), ¡Bang! ¡Bang!...
Estás liquidado (2/4, frontal + interior con reserva), Lobo suelto vol.1 (3/4, falla solo
el `cd` por archivo cruzado con vol.2), Lobo suelto vol.2 (2/3, mismo problema invertido),
En directo (1/3, solo frontal, y fuera del canon de estudio).

**No apto en ninguna cara (1): La mosca y la sopa (0/3).** Es el único título que la
auditoría descarta entero — no por edición dudosa sino porque la tapa fichada **no es**
el arte de Rocambole documentado en `RES-22` (gato/cerdos/peces), sino una foto de recital
rediseñada cuando la banda fundó su propio sello.

### Sin resolver, y qué haría falta para cerrarlo

- **Año exacto de prensado de las contratapas/discos marcados "reedición confirmada".**
  Discogs recicla el mismo catálogo entre 1990–2001 y bloqueó `WebFetch` (403) en todas
  las URLs probadas de `discogs.com`/`rateyourmusic.com`. Haría falta acceso de pago o un
  scraper con user-agent distinto.
- **Sello inconsistente con mismo catálogo** (Oktubre, Un baión): la contratapa dice "Del
  Cielito" y el CD dice "P. Rey Discos" con el mismo número. No se pudo confirmar si son
  fotos de la misma unidad física o de dos ediciones distintas archivadas bajo un mismo
  nombre de carpeta.
- **La tapa rediseñada de *La mosca y la sopa*** viene de un snippet sobre
  `redondossubtitulados.com`, el mismo dominio que `RES-06` ya marcó "reportado" por
  HTTP 403. No se pudo leer el texto exacto en la fuente primaria.
- **Catálogo "XXX000" de `en-directo-trasera`:** no confirmado si es un valor real
  documentado o un artefacto de plantilla/prueba de escaneo.
- **El edificio de columnas** de `la-mosca-y-la-sopa-trasera`/`-interior-frontal` como
  "Plaza Lavalle/Tribunales" es lectura visual propia, no una fuente escrita — va como
  hipótesis, no como hallazgo.
- **`lobo-suelto-cordero-atado-cd1-cd.jpg`/`-cd2-cd.jpg` tienen los catálogos cruzados
  entre sí.** No es un problema de edición sino de gestión de archivos del repo — lo
  señalo para quien administre esa carpeta, no lo resuelvo yo.
- **Texto rojo vertical parcial** en `ultimo-bondi-a-finisterre-frontal.jpg`: no legible
  con certeza por resolución insuficiente de la imagen.
- **No se rastrearon reediciones con tapa gráficamente distinta** de *Último bondi* o
  *Momo Sampler* — quedaba fuera del alcance puntual de esta auditoría.
- **`gulpcaratula-2.webp`** es un archivo extra en la carpeta, fuera de los 35 auditados
  por `T-47` (no sigue el patrón frontal/trasera/cd/interior de ningún título) —
  sin auditar, señalado para quien gestione la carpeta.

---

## RES-46 — Coveralia: sin licencia propia sobre imágenes, mismo patrón que las ocho vías ya descartadas por `RES-25`

- **Hallazgo:** Coveralia (`https://www.coveralia.com/caratulas-de/patricio-rey-y-sus-redonditos-de-ricota.php`)
  cataloga los mismos **11 títulos** que esta auditoría, con **4 caras por álbum**
  (frontal, trasera, cd, interior) — coincide exactamente con la estructura de los 35
  archivos ya presentes en `TapasDiscos/`. Consultado: 2026-08-21.
- **Qué es:** agregador español de música (letras, tapas, videoclips, noticias), activo
  desde 2001. Imágenes alojadas como miniaturas en
  `images.coveralia.com/audio/thumbs/[ID].jpg` (ej. Oktubre frontal:
  `https://images.coveralia.com/audio/thumbs/17447.jpg`) — el propio nombre de carpeta
  ("thumbs") indica baja resolución.
- **Licencia declarada, textual, del aviso legal** (`coveralia.com/aviso-legal.php`,
  consultado 2026-08-21): *"Las imágenes mostradas en Coveralia tienen como fin único
  informar, promocionar y/o comentar un producto (CD-DVD musical)"*, enviadas
  *"por colaboradores anónimos o por nuestros partners"*, con mecanismo de baja:
  *"En caso de que algún autor o editor considere que se ha utilizado algún material
  restringido bastará con que se ponga en contacto con Coveralia para eliminar dichos
  contenidos."* **No declara ninguna licencia propia sobre las imágenes** — eso es un
  hallazgo, no un hueco: el texto/biografías del sitio sí van bajo CC BY-SA 3.0 Genérica,
  pero esa licencia **no cubre las carátulas**, que quedan bajo simple deslinde y
  notice-and-takedown. Estado: **verificado** (texto citado de la página oficial).
- **Coveralia no distingue ediciones ni reediciones:** por título muestra una sola tapa
  marcada "Cd", sin año de prensado ni volumen — coincide con el patrón de reedición que
  `RES-44` ya encontró en el material bajado (catálogos "P. Rey Discos"/"Del Cielito" con
  barcode, sin marcar qué año de reedición es).
- **Dato aparte, verificado:** Coveralia anunció su cierre en 2022, citando la nueva
  Directiva de Copyright de la UE (2019/790) como empujón final para cerrar el proyecto.
  El sitio, sin embargo, respondió con normalidad hoy (2026-08-21) — discrepancia sin
  explicar (¿reflote, archivo parcial?) que no perseguí más porque no cambia el veredicto
  de licencia.
- **Inferencia, rotulada como tal, no como hecho:** por la coincidencia exacta de 11
  títulos y 4 caras por álbum, es plausible que el material de `TapasDiscos/` ya haya
  salido de Coveralia. **No lo confirmé por comparación imagen a imagen** — no bajé ni
  crucé los archivos de `images.coveralia.com` contra los `.jpg` del repo.
- **Veredicto para el proyecto:** Coveralia entra a la misma fila que las ocho vías que
  `RES-25` ya cerró — conducto sin licencia propia sobre imágenes, deslinde por
  notice-and-takedown, contenedor ≠ contenido. **No mejora ni empeora la posición legal**
  (`D-14` ya asumió el riesgo). Su único aporte real sería como referencia visual de qué
  tapa es cada una, igual que ya se usa Wikipedia EN en `RES-25` — no como fuente de
  derechos ni como forma de confirmar edición, porque justamente no distingue ediciones.
