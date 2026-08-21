# CNT-01 — Mapa de derechos: qué se usa, de dónde salió, y qué respondemos si preguntan

- **Fecha:** 2026-08-19 — v2, reescrita en `T-32` del ciclo 3. **Corrección puntual
  2026-08-21** en la sección B, por hallazgo de la revisión de cierre del ciclo 4: `D-21`
  soltó las tapas a toda la pantalla y el origen real de las imágenes es Coveralia, no el
  Cover Art Archive que esta nota seguía citando.
- **Estado:** mapa activo, sin vencimiento. No es un cerrojo y no lo fue nunca desde `D-14`.
- **Consume:** `Docs/BRIEF.md` (sección "La postura: molinetes abiertos"), `D-14`, `D-06`,
  `D-04`, `D-13`, `D-08`, `D-21` (`Docs/DECISIONES.md`), `RES-03` (`INV-01`), `RES-06`,
  `RES-09` (`INV-02`), `RES-11`, `RES-12` (`INV-04`), `RES-13`, `RES-14` (`INV-05`), `RES-25`,
  `RES-26` (`INV-22`), `RES-44`, `RES-46` (`INV-44`), `Docs/UX/UX-05-tapas-en-pantalla.md`, y
  `ADR-01` (`Docs/ARQ/ARQ-spotify-integracion.md`, cerrado en opción B por `T-31`).

## Qué es esto ahora, y qué dejó de ser

Esta nota nació como cerrojo bajo `D-07`: nada se publicaba hasta cerrar ocho preguntas
legales. **`D-14` derogó ese encuadre, con toda la evidencia legal ya sobre la mesa.** La
decisión es del usuario y está tomada, no es un pendiente: RicotaArcade es un fan site sin
fines de lucro, de poco volumen, hecho para divertirse. El riesgo se asume. Si llega un
reclamo sobre una pieza puntual, se da de baja esa pieza y se sigue. Nada acá espera permiso.

Lo que esta nota hace ahora es distinto y, para el día a día, más útil: por cada superficie
que toca material de terceros, dice **qué usamos exactamente, de dónde salió, qué dice la
evidencia que juntamos, y qué haríamos si alguien pregunta o reclama**. El objetivo es poder
responder rápido y bien, no habilitar nada — ya está habilitado.

**No es un dictamen legal** y no pretende serlo. Cuatro fichas de investigador (`RES-03`,
`RES-11`, `RES-12`, `RES-13`, `RES-14`) buscaron cobertura legal en tres rondas distintas y
las tres terminaron en zona gris: ninguna fuente confirma ni descarta que este uso esté
cubierto. Esa evidencia no se tira — es lo que sigue en la sección siguiente — pero ya no
funciona como lista de obstáculos a resolver antes de poder avanzar. Funciona como **el
terreno en el que estamos parados**, que es la razón por la que el usuario decidió asumir el
riesgo en vez de esperar una respuesta que tres rondas de búsqueda no encontraron.

## El terreno legal en el que estamos parados

Cinco hallazgos, todos con fuente primaria citada en su ficha de origen. Se leen como mapa,
no como semáforo.

- **No hay *fair use* en Argentina (`RES-03`).** El derecho de cita del Art. 10 de la Ley
  11.723 topea en **8 compases** para obra musical o **1000 palabras** para obra literaria,
  con fin "didáctico o científico" y solo "las partes indispensables". Ninguna fuente dice
  que un fan site sin fines de lucro quede cubierto por esa excepción.
- **El derecho de cita cubre la obra, no el fonograma (`RES-11`).** El Art. 10 habla de
  "obras" y "el texto" — composición y letra. La grabación tiene un derecho aparte (Art. 5
  bis, productor fonográfico, 70 años), y el Art. 10 no lo menciona. Los fragmentos de audio
  del proyecto recortan el máster, no una partitura: la referencia de los 8 compases es orden
  de magnitud, no una zona segura confirmada para lo que efectivamente usamos.
- **El riesgo frente a YouTube es propio y distinto del de autor (`RES-12`).** Los términos
  de servicio prohíben explícitamente descargar contenido con un conversor. La consecuencia
  que el propio ToS contempla es administrativa — suspensión o cierre de cuenta —, y los
  litigios encontrados en prensa especializada (FLVTO, 2conv, Yout.com) fueron todos contra
  el **operador del sitio conversor**, nunca contra un usuario individual que descargó un
  tema para uso propio.
- **La baja resolución no tiene efecto jurídico verificado, y la declaración de Rocambole no
  es una licencia (`RES-13`).** El Art. 54 dice que ceder o vender una obra plástica no
  transfiere por defecto el derecho de reproducción; ninguna fuente encontrada trata la baja
  resolución como eximente. La frase de Rocambole sobre "la reproductibilidad del arte" es
  una postura pública favorable y real (`RES-06`), pero el Art. 53 exige formalidad registral
  para que una cesión valga, y ninguna fuente asimila una declaración periodística a eso.
- **Letra y música son dos obras distintas (`RES-14`), y "fin didáctico" es un punto ciego
  transversal.** El Art. 17/18 da titularidad de explotación separada a letra y música. No
  hay fuente que resuelva si citar solo texto cae bajo el tope de 1000 palabras o el de 8
  compases — aunque `BR-03` topea en 5 versos, cómodo bajo cualquiera de las dos lecturas. Y
  ninguna fuente, en ninguna de las tres superficies (audio, tapas, letras), confirma ni
  descarta que un juego de trivia entre en "fin didáctico o científico".

## Inventario por superficie

### A. Fragmentos de audio

| | |
|---|---|
| **Qué se usa** | Fragmentos cortos (techo de contenido: 10,0 s) de la grabación original, para el reveal progresivo del juego "adivinar el tema". Con crédito visible: tema, disco, año. |
| **De dónde salió** | Se bajan de YouTube con un conversor a mp3 y se recortan desde un máster en WAV guardado **fuera del repo** (`D-06`, `CTR-01.6`). No hay material propio ni licencia de origen. |
| **Qué dice la evidencia** | Dos riesgos separados, no uno (`RES-03`, `RES-11`, `RES-12`): descargar contraviene el ToS de YouTube, independientemente de qué se haga después con el archivo; y publicar el fragmento puede tocar el derecho sobre el fonograma, con el derecho de cita del Art. 10 aplicando (si aplica) a la obra y no a la grabación. Ninguna fuente cubre ni descarta el uso. |
| **Qué haríamos si llega un reclamo** | Se baja ese fragmento puntual del sitio. El máster WAV queda fuera del repo justamente para poder re-exportar más corto o directamente no volver a subirlo, sin tener que bajar el tema de nuevo. El crédito visible ya deja claro qué es y de dónde salió — no hay nada que ocultar ni que negociar. |

### B. Tapas de Rocambole

> **Corregido el 2026-08-21, hallazgo de la revisión de cierre del ciclo 4.** Esta sección
> decía dos cosas que dejaron de ser ciertas. La primera: que las tapas reales se usaban
> "únicamente en el juego adivinar la tapa" — **`D-21` las soltó a toda la pantalla**, con
> el catálogo pantalla por pantalla en `Docs/UX/UX-05-tapas-en-pantalla.md`. La segunda: que
> el origen era el Cover Art Archive — **los 10 ítems de `src/data/tapa.json` declaran
> `credito.origen: "coveralia"`**, y los 35 másters se bajaron de ahí, no del Cover Art
> Archive que `RES-25` había evaluado como vía preferida. Se corrige acá, sin tocar el
> encuadre de `D-14`: el riesgo se asume igual, y si llega un reclamo se baja igual.

| | |
|---|---|
| **Qué se usa** | Tapas reales, en tres formas (`D-21`, catálogo completo en `UX-05`): **ficha** entera en baja resolución, en el juego "adivinar la tapa o el disco" (`D-04`) y en cada artículo de disco de la Redondopedia; **detalle recortado**, en los casetes del portal, en las cabeceras de pregunta del quiz por categoría, y junto al título de artículos de historia y mitología; y **fondo velado**, en la cabecera del portal, en la presentación y el resultado del quiz, en las pantallas "en la cocina" de los otros tres juegos, y en la portada de la Redondopedia. En las tres formas: baja resolución y con crédito. |
| **De dónde salió** | Coveralia (`RES-46`, `Docs/INVESTIGACION/INV-44-tapas-coveralia.md`), no el Cover Art Archive que `RES-25` había evaluado como el conducto preferido de las seis vías analizadas. El aviso legal de Coveralia, citado textual en `RES-46`, declara que sus imágenes vienen de "colaboradores anónimos o de nuestros partners" y no reclama licencia propia sobre ellas, con baja de contenido a pedido del autor — el mismo patrón sin contrato adverso que las ocho vías ya descartadas por `RES-25`: no mejora la posición legal, tampoco la empeora. |
| **Qué dice la evidencia** | Rocambole es artista vivo (`RES-06`) y el riesgo de derechos más alto del proyecto — por eso es el primer juego en el orden de corte (`D-05`). Su obra **no está registrada** (corrección de `FIND-05`: el registro de marca del nombre de la banda en el INPI, a nombre de Erks S.A., no es lo mismo que registrar la obra plástica). Su declaración pública sobre "la reproductibilidad del arte" es real y favorable, pero no prueba que sea hoy titular de los derechos sobre las tapas ni que cubra un uso que no vio (`RES-13`). Quién tiene la titularidad de la tapa como obra plástica — Rocambole, el sello, o Erks S.A. — sigue sin verificar. Aparte, la auditoría de edición de `RES-44` encontró que el frontal fichado de *La mosca y la sopa* es un **rediseño con foto de recital, no arte de Rocambole**: el crédito que acompaña cada aparición de una tapa asume que la imagen es su obra, y ese título es la excepción confirmada — por eso el ítem `TP-010` de `tapa.json` usa la contratapa en vez del frontal. |
| **Qué haríamos si llega un reclamo** | Se baja esa tapa puntual, o el juego entero si hace falta: es la pieza que ya está identificada como la primera en caer (`D-05`), así que sacarla no compromete el resto del sitio. El crédito a Rocambole viaja con cada aparición, no solo con la del juego original: pie del sitio (`footer.pie-sitio`) en las páginas que lo tienen, sello de esquina pegado a la imagen en el quiz, que no usa pie (`UX-05`) — así que decir qué se usó, dónde y con qué crédito es inmediato en cualquiera de las pantallas nuevas que abrió `D-21`. Escribirle directamente a Rocambole por sus canales públicos para pedir autorización explícita es barato y está evaluado como jugada razonable (`RES-25`) — no se planificó la v1 asumiendo esa respuesta, pero es el primer paso si hay contacto. |

### C. Letras

| | |
|---|---|
| **Qué se usa** | Citas parciales de versos, en el juego "completar la letra", con reveal decreciente: fácil da contexto, difícil da un verso pelado. Techo de contenido, independiente de la regla de dificultad que fije `producto`: nunca la letra completa, como máximo el fragmento puntual que la mecánica necesita. |
| **De dónde salió** | letras.com y bestiarioredondo (`D-13`), con la objeción de `RES-23` sobre la mesa: son fuentes de fan, sin documentación de licencia con editoriales. Se usan igual porque la banda deliberadamente nunca produjo una fuente oficial de letras (`RES-21`), y la mitigación real es de contenido, no legal — cruzar cada letra contra los 105 temas de `RES-20` y confirmar de oído contra el disco antes de dar un verso por bueno. |
| **Qué dice la evidencia** | Letra y música son dos obras distintas con titularidad separada (`RES-14`). No hay fuente que diga bajo qué tope cae citar solo texto, pero `BR-03` topea en pocos versos y queda cómodo bajo cualquiera de las dos lecturas del Art. 10. Si "fin didáctico" cubre un juego de trivia es, otra vez, zona gris sin fuente en ningún sentido. |
| **Qué haríamos si llega un reclamo** | Se saca esa cita puntual del banco; el juego sigue funcionando con el resto de los ítems. El campo `fuentes` de cada ítem (`D-13`) hace trazable de dónde salió cada verso, así que responder qué se citó y de dónde es inmediato. |

### D. Nombre y marca de la banda

| | |
|---|---|
| **Qué se usa** | "Patricio Rey y sus Redonditos de Ricota" y sus formas cortas ("los Redondos", "Redonditos") en el nombre del sitio, textos y metadata, de forma **nominativa** — para identificar de qué banda es el fan site, no como marca propia ni merchandising. |
| **De dónde salió** | Es el nombre público de la banda. El proyecto es un fan site sin fines de lucro, sin publicidad y sin venta (marco declarado en el brief, `D-14`). |
| **Qué dice la evidencia** | Hay registros de marca en el INPI a nombre de **Erks S.A.**, con renovación prevista en 2030 (`RES-09`) — el titular es la sociedad, no una persona. No se consultó qué clases del nomenclador cubre el registro, ni si existe una política pública de la banda o su management sobre uso del nombre por fan sites. |
| **Qué haríamos si llega un reclamo** | Se refuerza el disclaimer visible ("fan site no oficial, sin fines de lucro, sin relación con la banda ni con su sello" — texto pendiente de redacción final con `experiencia`). Si insisten con el nombre puntual del proyecto, cambiarlo es barato: `RicotaArcade` no tiene marca propia registrada ni la va a tener. |

### E. Deep link a Spotify

| | |
|---|---|
| **Qué se usa** | Un link `https://open.spotify.com/track/<trackId>` que abre la app de Spotify o el reproductor web, para dar acceso al tema completo al revelar la respuesta, en los cuatro juegos (`BR-06`). Opción B de `ADR-01`, cerrada por `T-31`. |
| **De dónde salió** | Es la URL pública de la ficha de catálogo del tema, la misma que produce el botón de compartir de cualquier usuario común de Spotify. No requiere cuenta de desarrollador — el proyecto decidió explícitamente no registrar una (`ADR-01`, restricción dura). |
| **Qué dice la evidencia** | La Spotify Developer Policy, sección III cláusula 2, prohíbe textualmente crear "un juego, incluyendo quizzes de trivia" (`RES-26`). RicotaArcade son cuatro juegos. Un link pelado **probablemente no** cuenta como "usar o acceder a la Spotify Platform" — es discutible, según la propia ficha, y no hay pronunciamiento de Spotify en ninguna dirección sobre el caso del link simple. `ADR-01` cerró en esta opción **por decisión de riesgo de `D-14`, no porque apareciera evidencia nueva que la confirme**: es exactamente el mismo tipo de apuesta que las demás superficies de esta nota, no una excepción más segura. |
| **Qué haríamos si llega un reclamo** | Se saca el botón. El fallback de `ADR-01` está diseñado justamente para esto: la revelación (respuesta correcta, explicación, puntaje) está completa sin Spotify, así que sacar el link no rompe ninguna partida — se pierde una comodidad, no una función. |

## Preguntas sin respuesta, y no las esperamos

Estas preguntas se buscaron activamente, en más de una ronda de investigación, y las tres
terminaron igual: sin fuente en ningún sentido. Dejan de tratarse como pendientes con dueño y
pasan a tratarse como **zona gris declarada**, que es un estado distinto y estable — no algo
que quede esperando a que alguien lo cierre.

- **Si "fin didáctico o científico" (Art. 10) cubre un juego de trivia.** Buscado para audio
  (`RES-11`), tapas y letras (`RES-14`) por separado, con el mismo resultado en las tres: sin
  fuente, en ningún sentido.
- **Titularidad tema por tema del catálogo de audio.** `RES-09` da titularidad a nivel banda
  (Erks S.A.), no tema por tema — sello o gestión individual del intérprete podrían diferir y
  no hay fuente que lo desarme.
- **Si el estándar de formalidad registral del Art. 53 alcanza a la obra plástica**, o solo a
  literaria, científica y musical como dice su letra literal (`RES-13`).
- **Qué contrato rigió entre Rocambole y el sello o la banda, tapa por tapa.** Sin fuente
  pública (`RES-13`, `RES-25`).
- **Si el deep link a Spotify cuenta como "acceder a la Spotify Platform".** Era `E-13` en
  `ADR-01`: se cerró por decisión de riesgo de `D-14`, no porque apareciera un
  pronunciamiento. Sigue sin haberlo.
- **Qué clases del nomenclador INPI cubre el registro de marca de la banda.** No se consultó
  el padrón directamente (`RES-09`).

## Una cosa aparte: lo único que sigue siendo estricto no es legal

`D-14` dejó una sola exigencia firme, y no tiene que ver con derechos: que la **respuesta
correcta de una pregunta sea correcta**. Si el dato está mal, el juego le marca error
justo al que se sabe el tema, y eso rompe lo único que el sitio promete. La defensa es
**rotular bien** — hecho, leyenda o testimonio — y ese mecanismo vive en el schema y en el
rotulado de cada ítem, no en esta nota. Se menciona acá solo para que no se confunda con un
criterio de derechos: es un criterio de calidad de contenido, y sigue siendo tan estricto
como siempre.

## Resumen rápido — para responder en el momento

| Superficie | Qué se usa | Si preguntan o reclaman |
|---|---|---|
| Audio | Fragmento ≤10,0 s de la grabación, con crédito | Se baja ese fragmento puntual |
| Tapas de Rocambole | Tapa real en baja resolución: ficha en el juego y en la Redondopedia, detalle y fondo en todo el sitio (`D-21`, `UX-05`) | Se baja esa tapa, o el juego entero (es el primero en caer, `D-05`) |
| Letras | Verso o estrofa puntual, reveal decreciente | Se saca esa cita puntual del banco |
| Nombre y marca | Uso nominativo del nombre de la banda | Se refuerza el disclaimer; el nombre del proyecto se puede cambiar |
| Deep link a Spotify | `open.spotify.com/track/<id>` tras revelar | Se saca el botón; la partida sigue completa sin él |

En los cinco casos la lógica es la misma: **la pieza puntual se da de baja, el sitio sigue.**
Es la postura que fijó el usuario en `D-14`, con la evidencia de arriba ya sobre la mesa.
