# UX-04 — Sistema visual: paleta, tipografía, línea, brief de arte original

> Rol dueño: `experiencia`. Consume `D-04` (estética mixta), `Docs/BRIEF.md`
> (iconografía suelta, no una tapa concreta), y las fichas de `investigador` sobre
> Rocambole: **`RES-06`** (`Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`) y
> **`RES-22`** (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`, sube tres tapas de
> "reportado" a testimonio). El bloqueo que esta pieza tenía anotado —sin ninguna ficha
> de referencia sobre Rocambole— está **levantado desde `RES-06`** (2026-08-19); esta
> versión lo incorpora (`T-25`, ciclo 2).

**Resuelve:** `D-04` (arte original en lenguaje rocambolesco para la interfaz; tapas
reales solo en el juego que las necesita).

## Cómo leer este documento

Regla de trazabilidad, motivada por `FIND-05` en otra carpeta (una nota de derechos que
afirmaba "obra registrada" con casilla marcada y sin ninguna ficha detrás — un supuesto
que se volvió hecho por repetición): **toda afirmación sobre la obra o la técnica de
Rocambole cita `RES-06` o `RES-22`. Toda decisión de diseño que no sale de una ficha
—color exacto, tipografía puntual, si las figuras son "deformes"— se marca
explícitamente como criterio propio de `experiencia`.** No hay una tercera categoría.

## Quién es Rocambole, y por qué "en el lenguaje de Rocambole" ahora es una instrucción y no una frase

*(Todo este bloque, `RES-06`.)* Rocambole es **Ricardo Cohen** (12-may-1943), formado en
serigrafía y egresado de Bellas Artes de la UNLP; hizo **toda** la identidad visual de la
banda desde 1978 —tapas, afiches, escenografías, videos— y ganó el **premio ACE al mejor
diseño de portada por *Luzbelito***. Trabaja de forma **artesanal: rodillo, serigrafía,
aerografía, grabado, collage e ilustración**; desde 1996 suma **arte digital y
animación**. Su lenguaje mezcla **anarquismo, iconografía revolucionaria y raíz
popular**, y concibe cada tapa como **objeto artístico, declaración política y pieza
pensada para la reproducción masiva** — no como decoración de lo que ya existe.

La frase que ordena el criterio entero, textual: ***"yo no ilustraba la poesía o la
música, sino que era una parte integrante del mensaje"*** (`RES-06`). Consecuencia
directa para quien produzca el arte de este sitio: una pieza nueva no ilustra la
pantalla en la que vive — el ícono de acierto, el motivo del reveal, el personaje de
portada tienen que poder leerse como parte del mensaje de esa pantalla (qué se festeja,
qué se revela, qué tono tiene el sitio), no como un adorno pegado encima después. Es la
frase que le da una instrucción ejecutable a "en el lenguaje de Rocambole", que hasta
esta ficha era solo una descripción de estilo.

## Regla que ordena todo lo demás

Dos materiales que nunca se mezclan en la misma pantalla:

| Material | Dónde aparece | Cómo |
|---|---|---|
| Arte original rocambolesco | Toda la interfaz: portada, quiz, botones, íconos, tarjeta de resultado, reveal de audio | Libre, sin límite de resolución ni crédito obligatorio (es obra nueva) |
| Tapas reales | Solo el juego "adivinar la tapa o el disco" | Baja resolución, con crédito visible que nombra a **Rocambole (Ricardo Cohen)** (`RES-06`), nunca como fondo decorativo de otra pantalla |

## Paleta — criterio propio, sin ficha que fije colores

Ni `RES-06` ni `RES-22` describen una paleta de color ni la identidad cromática de
Rocambole. Lo que sigue es **decisión de `experiencia`**, heredada de la descripción
general de `D-04`/BRIEF ("paleta psicodélica saturada"), **no una referencia
verificada sobre su obra**.

Psicodélica saturada, no pastel. Base oscura para que los acentos exploten en contraste,
no una paleta clara con toques de color.

| Uso | Color (descripción, no hex — el hex final lo fija quien produce el arte) |
|---|---|
| Fondo base | Oscuro, casi negro con matiz cálido (no negro puro de pantalla apagada) |
| Acento 1 | Magenta saturado |
| Acento 2 | Verde ácido |
| Acento 3 | Naranja quemado |
| Acento 4 | Azul eléctrico |
| Estado acierto | Verde ácido (mismo acento 2, no un verde distinto) |
| Estado error | Un rojo saturado, único color reservado para error — no se reusa en nada más |

Nota de accesibilidad (ya en el checklist de `UX-01`): saturado no exime de contraste
alto entre texto y fondo.

## Tipografía — criterio propio, sin ficha sobre lettering

`RES-06` no ficha ninguna referencia sobre tipografía o rotulado de Rocambole — ningún
hallazgo describe cómo titula o rotula sus piezas. Lo que sigue sigue siendo **decisión
de `experiencia`**, coherente con lo artesanal de su técnica (eso sí confirmado,
`RES-06`) pero no una referencia tipográfica verificada.

Dos familias, nunca mezcladas dentro del mismo bloque de texto:

- **Dibujada / rotulada a mano**, con textura de trazo grueso tipo fanzine o serigrafía:
  para títulos, nombres de botón corto ("JUGÁ", "COMPARTIR") y el puntaje grande de la
  tarjeta de resultado. Nunca para texto largo — se vuelve ilegible en pantalla chica.
- **Sans legible de sistema**: para el enunciado de las preguntas, las opciones de
  respuesta y cualquier texto de más de una línea.

## Línea y tratamiento

- **Contorno grueso, tipo grabado o serigrafía** — confirmado por ficha: son dos de las
  técnicas reales de Rocambole (`RES-06`: "rodillo y serigrafía; también aerografía,
  grabado, collage e ilustración"). Nunca línea fina de ilustración vectorial genérica.
- **Instrucción ejecutable para quien produce en digital:** emular la textura de
  rodillo/serigrafía/grabado (grano, imperfección de borde) en vez de vector limpio.
  `RES-06` fichó que el propio Rocambole suma arte digital desde 1996, así que producir
  en digital no traiciona la referencia — producir en vector liso sí.
- **Collage como técnica de fondo** — confirmado por ficha: el collage es una de sus
  técnicas reales, no una interpretación libre de la descripción del BRIEF (`RES-06`).
  Texturas superpuestas, recortes, nunca una foto real de por medio salvo la tapa del
  juego 4.
- **Figuras deformes, orgánicas, nunca geometría perfecta ni íconos de librería
  estándar — criterio propio, no confirmado por ficha.** Ni `RES-06` ni `RES-22`
  describen la figura de Rocambole como "deforme"; venía de la descripción general del
  BRIEF, sin verificación en ese momento. La mantengo porque no contradice nada de lo
  fichado (línea artesanal, iconografía popular), pero la marco para que no se lea como
  más verificada de lo que es.
- **Capa simbólica — agregado por `RES-06`, no estaba en la versión anterior:**
  anarquismo, iconografía revolucionaria y raíz popular. No es solo tratamiento de
  línea, es contenido. Habilita motivos como banderas, tipografía de panfleto, símbolos
  de protesta genéricos y elementos de cultura popular — sueltos, sin citar una escena
  puntual (ver debajo).
- **Personajes y símbolos sueltos, no una escena citando una tapa puntual** — así lo
  pidió el usuario en el kickoff: menos citable, más libre, y de paso menos expuesto al
  riesgo de derechos que ya es el riesgo número uno del proyecto. Sigue vigente sin
  cambios.
  - **Motivo suelto ya fichado y disponible: el perro.** `RES-06` cita a Rocambole
    explicando la tapa de *Un baión para el ojo idiota* y agregando que "en toda la
    mitología solariana hay un perro"; `RES-22` lo confirma de forma independiente,
    llamándolo "una constante de la literatura solariana". Es un motivo transversal que
    el propio autor describe como recurrente en toda su obra, no un elemento exclusivo
    de esa tapa — candidato razonable para el set de íconos o el personaje de portada.
    **Cuidado al usarlo:** un perro suelto cumple la regla del kickoff; reproducir la
    composición específica de esa tapa (perro + televisor + el muñeco con antifaz) no
    la cumple, porque eso sí sería citar una escena puntual.
  - **Motivo que NO se usa como referencia todavía, y por qué:** el esclavo encadenado
    de *Oktubre* —la imagen más icónica de todo el universo ricotero— sigue en
    **"reportado, no verificado"** en `RES-06`: no está confirmado si integraba el arte
    original del vinilo o si llegó recién con la reedición en CD. Hasta que eso se
    cierre con una fuente mejor, no lo uso como referencia puntual de un ícono nuevo —
    sería construir el brief sobre un dato que la propia ficha pide no publicar todavía.

## Fuera del brief, con nombre y ficha — para que nadie lo use por error

- **El documental "Rocambole en el camino" (abril de 2026) y el libro "Rocambole: Arte,
  Diseño y Contracultura" (2026)** (`RES-06`) son **contexto actual, no obra de los
  80**. No son referencia estética para esta pieza: la interfaz busca el lenguaje de las
  tapas y afiches originales, no el material promocional o retrospectivo de 2026.
- **La postura pública de Rocambole sobre el uso de su obra.** `RES-06` cita
  textualmente: *"siempre me encantó la reproductibilidad del arte, que todos puedan
  tener acceso a mi obra"*. Es **contexto, no permiso** — la propia ficha lo dice: una
  declaración favorable no prueba titularidad ni autoriza un uso puntual, y parte de lo
  que dice sobre no creer en la propiedad intelectual está además marcado como
  "reportado, sin cita textual localizada", no verificado. La cito acá solo porque
  explica por qué "figuras sueltas, no citas de tapa" ya era una postura conservadora
  antes de que existiera esta ficha, y para que ninguna lectura futura de este documento
  la use como luz verde. La decisión legal sobre qué se puede usar es de `contenido`
  (nota de derechos, gate `D-07`), no de `experiencia`.

## Espaciado (para el pulgar)

- Zona pulgar: el 25–30% inferior de la pantalla reservado para la acción principal de
  cada pantalla (botón de jugar, de responder, de compartir).
- Objetivo de toque mínimo: 44×44 px.
- Separación mínima entre botones adyacentes para evitar toques accidentales con una
  sola mano sosteniendo el celular.

Sin cambios respecto a la versión anterior: es criterio de `experiencia` sobre ergonomía
móvil y no depende de ninguna ficha sobre Rocambole.

## Brief de arte original (para que el usuario decida cómo se produce)

| Pieza | Qué transmite | Dónde se usa |
|---|---|---|
| Personaje/ícono suelto de portada | Bienvenida, "esto es under y es para vos" — candidato: el perro (`RES-06`, `RES-22`), usado suelto, no en la composición de *Un baión* | `UX-01`, Pantalla 0 |
| Set de 4 íconos de categoría (historia, discos, letras, mitología) | Distinción rápida sin leer, un color por categoría | `UX-01`, pantallas de pregunta |
| Ícono de acierto (festejo) | Recompensa breve, sin texto largo | `UX-01`, feedback de acierto |
| Ícono de error (sin humillar) | Corrección sin bajón | `UX-01`, feedback de error |
| Tres variantes de "tramo de resultado" (bajo/medio/alto) | Jerarquía de logro | `UX-01` resultado, `UX-02` tarjeta |
| Motivo ecualizador/surco de vinilo | Progreso del reveal de audio, con o sin sonido | `UX-03` |

Técnica sugerida para toda la tabla, ahora con respaldo de ficha (`RES-06`): rodillo,
serigrafía, aerografía, grabado o collage si se produce a mano; textura equivalente si
se produce en digital. Nunca vector liso ni ícono de librería estándar. Y, por la frase
guía de más arriba: cada pieza responde primero "¿de qué pantalla es esto parte
integrante?" antes de resolverse como dibujo.

## Qué cambió en esta versión, y contra qué ficha

Trazabilidad de la pasada de `T-25`, para que quede visible qué era intuición y qué pasó
a ser hecho fichado:

| Afirmación original de `UX-04` | Qué dijo la ficha | Resultado |
|---|---|---|
| "Contorno grueso, tipo grabado o serigrafía" | `RES-06` confirma serigrafía y grabado como técnicas reales de Rocambole | **Confirmado** — ahora citado |
| "Collage como técnica de fondo" | `RES-06` confirma collage como técnica real | **Confirmado** — ahora citado |
| "Figuras deformes, orgánicas" | Ninguna ficha lo describe así | **Sin confirmar** — marcado como criterio propio |
| "Tipografía dibujada a mano" | Ninguna ficha describe su lettering | **Sin confirmar** — marcado como criterio propio |
| Paleta psicodélica saturada, colores puntuales | Ninguna ficha describe su paleta | **Sin confirmar** — marcado como criterio propio |
| "Personajes y símbolos sueltos, no una escena citando una tapa puntual" | No estaba en tensión con ninguna ficha; `RES-06`/`RES-22` agregan un motivo transversal (el perro) que cumple la regla sin citar tapa | **Reforzado**, con un candidato concreto |
| — no existía — | `RES-06`: técnica artesanal completa, la frase guía, la capa simbólica (anarquismo/iconografía revolucionaria/raíz popular), el documental marcado como no-referencia | **Agregado** |
| — no existía — | `RES-22`: sube tres tapas a testimonio; no cambia el estado del ícono del esclavo, que sigue reportado | **Agregado** — sin efecto directo en el brief de interfaz, es insumo del juego 4, no de esta pieza |

## Estado de las referencias — reemplaza la sección de bloqueos anterior

- **Bloqueo levantado.** La versión anterior de este documento no tenía ninguna ficha de
  `investigador` sobre Rocambole y lo decía explícitamente. Ya no es el caso: `RES-06` y
  `RES-22` cubren técnica, iconografía, origen de tapas y postura pública.
- **Lo que sigue sin ficha, a propósito:** color exacto, tipografía puntual, y si sus
  figuras son "deformes" en el sentido que usa este documento. No es un hueco de
  investigación pendiente — es una decisión de diseño que le corresponde a quien
  produce el arte (`D-04`), y quedó marcada arriba como criterio propio en cada caso,
  nunca mezclada con lo que sí está fichado.
- **Lo que no me corresponde decidir:** si usar la identidad visual de Rocambole
  necesita autorización más allá de lo que este brief ya hace por decisión propia
  (figuras sueltas, sin citar tapa, tapas reales solo en baja resolución y con
  crédito). Esa pregunta la responde `contenido` en la nota de derechos (`D-07`), con
  apoyo de las mismas fichas que usé acá.
