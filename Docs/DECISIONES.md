# Decisiones — RicotaArcade

> Toda decisión que costó pensarla y que sería caro revertir. Se escribe **cuando se
> toma**, no después: la reconstrucción posterior siempre pierde las alternativas
> descartadas, que son la parte útil.

## Formato

```
## D-XX — <título en una línea>
- **Fecha:** AAAA-MM-DD
- **Estado:** propuesta | aceptada | reemplazada por D-YY
- **Contexto:** qué problema había que resolver
- **Decisión:** qué se eligió
- **Alternativas descartadas:** cuáles y por qué no
- **Consecuencias:** qué se vuelve fácil y qué se vuelve difícil por haber elegido esto
```

Estos registros usan el prefijo `D-`, **distinto** del prefijo `ADR-` que la tabla de
`Docs/IDS.md` reserva en exclusiva para `arquitectura` dentro de `Docs/ARQ/` (por
ejemplo, `ADR-01`, la vía exacta de integración con Spotify, todavía pendiente). Este
archivo registra decisiones tomadas **antes** de que hubiera un equipo trabajando —
durante la entrevista de instanciación— y decisiones de estructura del propio equipo.

---

## D-01 — Estructura de trabajo con equipo de agentes

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** el proyecto tiene siete frentes de trabajo independientes (alcance,
  arquitectura técnica, investigación de hechos, contenido, experiencia, revisión y
  coordinación) que no caben en una sola sesión sin perder trazabilidad.
- **Decisión:** trabajar con el roster de siete roles (`producto`, `arquitectura`,
  `investigador`, `contenido`, `experiencia`, `revisor`, `orquestador`), arquetipo
  **sitio-contenido**, un dueño por carpeta y documentación con IDs trazables. El detalle
  completo de la justificación del séptimo rol está en `Docs/EQUIPO.md`, bajo
  "Justificación del roster ampliado".
- **Alternativas descartadas:** sesión única sin equipo, descartada porque el usuario
  pidió explícitamente investigación profunda como requisito del producto, y una sola
  sesión no puede separar quien trae el hecho de quien redacta sin perder la garantía;
  roster de seis con `investigador` fusionado en `contenido`, descartado porque el mismo
  agente que necesita una pregunta difícil terminaría decidiendo si el dato que la
  sostiene está verificado, que es justo el riesgo número cuatro del brief (mitología
  repetida como hecho).
- **Consecuencias:** se gana un responsable único de que un dato sea falso y trazabilidad
  completa; se paga con un rol más compitiendo por el ruteo y la obligación de mantener
  `ESTADO.md` al día entre ráfagas.

## D-02 — Stack: Astro + TypeScript con arquitectura de islas, sin backend

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** el sitio es un fan site sin fines de lucro, con presupuesto de costo
  recurrente cero, que tiene que cargar rápido en un celular y donde solo los juegos
  necesitan JavaScript interactivo.
- **Decisión:** Astro + TypeScript, HTML estático por defecto y JavaScript solo dentro de
  las islas de cada juego. Contenido en JSON versionado en el propio repositorio,
  validado contra schema. Sin backend ni base de datos.
- **Alternativas descartadas:** una SPA con framework pesado (React o Vue sin islas),
  descartada porque el sitio es mayoritariamente estático y cargar todo el JS de entrada
  penaliza justo el momento de uso declarado — móvil, ratos sueltos, sesiones de dos o
  tres minutos; un CMS con backend, descartado porque contradice la restricción de costo
  cero y de "sin backend", y porque el contenido versionado en JSON ya cubre la necesidad
  de curar preguntas sin necesitar una base de datos.
- **Consecuencias:** hosting estático gratuito y despliegue simple; a cambio, todo el
  contenido vive en archivos que hay que mantener disciplinadamente contra un schema, y
  cualquier necesidad futura de cuentas de usuario o ranking global (fuera de alcance de
  la v1) exigiría repensar el stack.

## D-03 — Motor de audio híbrido: fragmentos propios + Spotify para el tema completo

> **Nota del 2026-08-19 (`/kickoff`):** la decisión del motor híbrido sigue **vigente**,
> pero el título y el texto de abajo dicen "fragmentos propios" en el sentido de material
> del usuario, y eso ya no es cierto. `D-06` cambió el origen: no hay material propio, los
> fragmentos se bajan de YouTube y se recortan. Leé "propios" acá como "alojados y
> controlados por el proyecto", en oposición a streaming de terceros, que es la distinción
> que esta decisión realmente hace.

- **Fecha:** 2026-08-19
- **Estado:** aceptada — origen del audio modificado por `D-06`
- **Contexto:** el juego "Adivinar el tema" necesita un reveal progresivo de audio que
  arranque en 0,1 segundo, y separadamente el jugador tiene que poder escuchar el tema
  completo al revelar la respuesta, sin alojar los temas completos en el propio sitio.
- **Decisión:** fragmentos cortos propios, precargados con Web Audio API, para el reveal
  al milisegundo. Spotify entra únicamente para reproducir el tema completo al revelar la
  respuesta. La vía exacta de integración con Spotify (Web Playback SDK, embed o deep
  link) queda abierta como `ADR-01`, a cargo de `arquitectura`, con evidencia fechada de
  `investigador` sobre el estado real de esas APIs.
- **Alternativas descartadas:** usar un SDK de streaming como única fuente de audio,
  descartada porque un SDK de streaming tarda 200-400 ms en arrancar y hace imposible un
  reveal honesto de 0,1 segundo; alojar los temas completos en el propio sitio,
  descartada porque está explícitamente fuera de alcance y agrega riesgo de derechos
  directo sobre el material más sensible del catálogo.
- **Consecuencias:** el reveal queda bajo control total del proyecto y funciona sin
  login; a cambio, el fallback para cuando Spotify no está disponible (sin cuenta
  Premium, SDK caído) queda como deuda técnica hasta que `ADR-01` lo resuelva, y la
  verificación de latencia real en celulares de gama baja queda como tarea manual del
  usuario, no automatizable por el equipo.

## D-04 — Estética mixta: arte original rocambolesco + tapas reales acotadas

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** el sitio necesita una identidad visual reconocible para el público
  ricotero, pero las tapas de los discos son obra de Rocambole, **artista vivo** (`RES-06`),
  y el riesgo de derechos es el riesgo número uno del proyecto.

  > **Corregido el 2026-08-19 por `FIND-05`** (`Docs/REVISIONES/REV-01-nota-derechos.md`).
  > Este contexto decía "artista vivo **con obra registrada**". Que esté vivo lo verifica
  > `RES-06`; **que su obra esté registrada no lo respalda ninguna ficha.** `RES-09`
  > confirma registros de marca del **nombre de la banda** en el INPI a nombre de Erks
  > S.A., que no es lo mismo que el registro de la obra plástica de Rocambole. La frase se
  > escribió en la instanciación, antes de que hubiera investigación, y `CNT-01` la heredó
  > con casilla marcada — así es como un supuesto se convierte en hecho por repetición.
  > **La decisión no cambia:** vale igual, porque el derecho de autor no depende de que la
  > obra esté registrada. Lo que cambia es que ya no afirmamos un dato que no verificamos.
- **Decisión:** la interfaz lleva arte original en el lenguaje visual de Rocambole
  (paleta psicodélica saturada, línea gruesa, figuras deformes, collage, tipografía
  dibujada). Las tapas reales aparecen únicamente en el juego que las necesita ("adivinar
  la tapa o el disco"), en baja resolución y con crédito.
- **Alternativas descartadas:** usar tapas reales en toda la interfaz, descartada porque
  maximizaría la exposición al riesgo de derechos ya identificado como bloqueante de la
  publicación, sin necesidad funcional en las pantallas que no dependen de reconocer una
  tapa específica; usar arte genérico sin ninguna conexión al lenguaje visual de
  Rocambole, descartada porque el público objetivo reconoce y espera esa estética, y
  perderla debilita el "premiar al que sabe" que pide el brief.
- **Consecuencias:** se gana una identidad visual fuerte y de menor riesgo legal en la
  mayoría de las pantallas; a cambio, `experiencia` necesita briefs de arte original
  claros para que el usuario decida cómo se produce cada pieza, y `contenido` tiene que
  sostener la nota de derechos actualizada para las pantallas que sí usan tapas reales.

---

> Las decisiones que siguen (`D-05` en adelante) salieron de la entrevista de `/kickoff`
> del 2026-08-19, con el equipo de siete roles ya armado. Varias **corrigen supuestos**
> del brief de instanciación; donde eso pasa, está dicho en el contexto.

## D-05 — Juegos 3 y 4 confirmados, y orden de corte de la v1

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** el brief de instanciación proponía "completar la letra" y "adivinar la
  tapa" como juegos 3 y 4, pero los dejaba explícitamente sin cerrar. Sin esa definición,
  `producto` no puede fijar pisos de ítems y `contenido` no sabe qué banco llenar.
- **Decisión:** los cuatro juegos de la v1 son quiz, adivinar el tema con reveal de audio,
  completar la letra, y adivinar la tapa o el disco. Además, si hay que recortar alcance,
  el primero que se cae es **adivinar la tapa**; los otros tres se defienden recortando
  piso de ítems antes que sacando un segundo juego.
- **Alternativas descartadas:** sacar "completar la letra" y reemplazarla por un juego de
  cronología, descartada porque el usuario la quiere y porque la dificultad graduable por
  cantidad de letra mostrada resuelve sola el "premiar al que sabe sin expulsar al que
  llega"; sacar "adivinar la tapa" ya en el kickoff por su exposición a derechos,
  descartada porque el usuario prefiere intentarla, y tenerla identificada como la primera
  en caer es información más útil que no tenerla.
- **Consecuencias:** `producto` puede escribir las cuatro historias y sus pisos de una
  vez, y `orquestador` tiene un orden de prioridad explícito para cuando una ráfaga corta
  obligue a elegir. A cambio, el juego con más riesgo legal sigue en alcance y arrastra su
  nota de derechos hasta el final.

## D-06 — Los fragmentos de audio se producen bajando los temas de YouTube

- **Fecha:** 2026-08-19
- **Estado:** aceptada — **con riesgo abierto declarado**
- **Contexto:** el brief de instanciación asumía que el usuario aportaba fragmentos desde
  material propio, y afirmaba que "el proyecto no descarga ni extrae audio de ningún
  servicio". En `/kickoff` el usuario informó que **no tiene material propio** y que su
  plan es bajar los temas de YouTube con un conversor a mp3 y recortar los fragmentos
  desde ahí. Se le planteó que eso contradice el brief, va contra los términos de servicio
  de YouTube, y toca la grabación original, que es el material más sensible del catálogo.
  El usuario reafirmó la decisión con este fundamento: es un trabajo de fan, sin fines de
  lucro, sobre una banda con ese espíritu, y a su entender no hay restricciones fuertes
  sobre obras de fans.
- **Decisión:** se procede como decidió el usuario. Los fragmentos salen de descargas de
  YouTube recortadas localmente. El reparo quedó planteado antes de decidir; la decisión
  es del usuario y está tomada con la información sobre la mesa.
- **Alternativas descartadas:** recortar desde colección propia en CD, vinilo o archivos
  comprados, descartada porque el usuario no tiene ese material y conseguirlo sería un
  proyecto en sí mismo; grabar versiones propias del riff, descartada porque cambia qué se
  está adivinando y rompe el juego — el jugador reconoce la grabación, no la melodía
  abstracta; usar YouTube solo para prototipar en local y publicar con otra fuente,
  descartada porque no resuelve de dónde saldría esa otra fuente; replantear el juego 2
  sin audio de la grabación original, descartada porque vacía el juego que más entusiasma
  al usuario.
- **Consecuencias:** el juego 2 deja de estar bloqueado por falta de material, y
  `arquitectura` puede especificar formato y duración sabiendo de dónde va a salir el
  audio. A cambio quedan dos cosas abiertas que **no** son cuestión de opinión y hay que
  resolver antes de publicar. **(a)** Que un fan site sin fines de lucro no enfrente
  restricciones fuertes es la posición del usuario, no un hecho verificado: necesita una
  ficha `RES-XX` con fuente y fecha, y es parte de la investigación previa a publicar que
  el propio usuario se comprometió a hacer. **(b)** La descarga en sí contraviene los
  términos de servicio de YouTube, con independencia de cómo resulte el punto de derechos
  de autor. Mientras el sitio no se publique la exposición es baja; publicar sin cerrar
  (a) es tomar el riesgo a ciegas. La nota de derechos de `contenido` tiene que tratar
  este origen de frente en vez de asumir material propio.
- **Actualización del 2026-08-19, misma sesión — la ficha `RES-03` ya llegó:** la
  decisión **sigue en pie y sigue siendo del usuario**, pero el punto (a) de arriba ya
  tiene respuesta y no es la que la premisa suponía. `RES-03`
  (`Docs/INVESTIGACION/INV-01-fichas-iniciales.md`) trae dos hallazgos verificados que
  contradicen el fundamento con el que se tomó esta decisión:
  **(i)** los términos de servicio de YouTube prohíben explícitamente descargar contenido
  salvo autorización expresa o función habilitada por el propio servicio
  (https://www.youtube.com/static?template=terms, consultado 2026-08-19);
  **(ii)** Argentina no tiene *fair use*: tiene el derecho de cita del Art. 10 de la Ley
  11.723, que para obra musical topea en **8 compases**
  (https://servicios.infoleg.gob.ar/infolegInternet/anexos/40000-44999/42755/texact.htm,
  consultado 2026-08-19).
  Ninguna fuente encontrada dice que un fan site sin fines de lucro quede cubierto por esa
  excepción; es zona gris sin ley ni jurisprudencia que la resuelva. Lo que cambia en la
  práctica: la premisa "no hay restricciones fuertes sobre obras de fans" pasa de
  no verificada a **contradicha en el punto de la descarga**, y el número de 8 compases le
  da a `CTR-01` un techo con fuente para la duración del fragmento en vez de un valor
  elegido a ojo. Nada de esto bloquea construir (`D-07` lo habilita); todo esto es insumo
  de la investigación previa a publicar que el usuario se comprometió a hacer.

## D-07 — El gate de derechos separa construir de publicar

- **Fecha:** 2026-08-19
- **Estado:** aceptada — reemplaza el gate único del brief de instanciación
- **Contexto:** el brief original decía "nada se publica antes de que exista la nota de
  derechos", y en la práctica se estaba leyendo como que nada se hace antes de la nota.
  Con ráfagas de tamaño impredecible, esperar a cerrar un tema legal para escribir la
  primera pregunta congela el proyecto entero. En `/kickoff` el usuario precisó su
  postura: no es con fines de lucro, y va a hacer una investigación más profunda **antes
  de hacerlo público**.
- **Decisión:** el gate se parte en dos. Construir el sitio, cargar el banco de contenido
  y jugar en local está habilitado y no espera a nadie. Publicar está bloqueado hasta que
  el usuario cierre la investigación de derechos, apoyada en la nota de `contenido` y en
  fichas `RES-XX`.
- **Alternativas descartadas:** mantener el gate único que bloquea todo, descartada porque
  paraliza el proyecto por un trámite que se puede hacer en paralelo, y porque el riesgo
  real aparece al publicar y no al escribir un JSON en una carpeta local; eliminar el gate
  y publicar cuando esté listo resolviendo derechos después, descartada porque el usuario
  la rechazó explícitamente, y porque publicar es el acto irreversible — una vez indexado,
  bajarlo no borra que estuvo.
- **Consecuencias:** el equipo trabaja a máxima velocidad desde hoy, y la nota de derechos
  deja de ser el cuello de botella del ciclo 1. A cambio aparece un riesgo nuevo de
  proyecto: llegar a cuatro juegos terminados y no poder mostrarlos. `revisor` verifica
  antes de cualquier publicación que la nota esté cerrada, y `ESTADO.md` mantiene el gate
  visible para que nadie lo olvide entre ráfagas.

## D-08 — No se asume Spotify Premium en el jugador

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** `ADR-01` tiene que elegir entre Web Playback SDK, embed y deep link para
  reproducir el tema completo al revelar la respuesta. El Web Playback SDK exige cuenta
  Premium. En `/kickoff` el usuario informó que él tiene Premium y puede probar, pero que
  **no puede exigírsela al que juega**.
- **Decisión:** `ADR-01` se decide pensando en el jugador, no en el usuario. La vía
  elegida tiene que funcionar para alguien sin Premium, lo que saca al Web Playback SDK de
  las opciones principales y deja embed y deep link como candidatas. Que el usuario tenga
  Premium sirve para probar, no para justificar la elección.
- **Alternativas descartadas:** elegir el Web Playback SDK y pedirle Premium al jugador,
  descartada porque convierte una cuenta paga en muro de entrada y choca de frente con el
  criterio no negociable "sin muro de entrada" (`D-09`); asumir que no hay Premium en
  ningún lado, descartada porque desperdicia que el usuario sí pueda probar el SDK para
  medir latencias y descartarlo con evidencia en vez de por supuesto.
- **Consecuencias:** `ADR-01` arranca con el espacio de opciones ya recortado y puede
  concentrarse en comparar embed contra deep link, incluido el fallback para cuando
  Spotify no está disponible. A cambio, se acepta de entrada una experiencia de
  reproducción menos integrada que la que daría el SDK.

## D-09 — Tres criterios no negociables, y la velocidad de carga no es uno

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** `revisor` necesita saber qué verifica primero, y hasta ahora todos los
  criterios pesaban igual. En `/kickoff` se le ofrecieron al usuario cuatro candidatos a
  criterio bloqueante y eligió tres.
- **Decisión:** son no negociables **ningún dato falso**, **jugable con el pulgar** y
  **sin muro de entrada**. Si uno se rompe, bloquea la entrega. La **velocidad de carga**
  quedó explícitamente afuera: el usuario no la eligió. Sigue siendo deseable y sigue
  siendo el riesgo 6, pero no frena nada.
- **Alternativas descartadas:** declarar los cuatro no negociables, descartada porque un
  criterio que nunca cede no es un criterio sino una expresión de deseo, y cuatro gates
  duros en un proyecto de ráfagas cortas garantizan que alguno se incumpla en silencio;
  dejar que `revisor` los pondere caso por caso, descartada porque convierte al revisor en
  quien decide el alcance, que es rol de `producto`.
- **Consecuencias:** `revisor` tiene un orden de verificación claro y puede reportar un
  `FIND-XX` bloqueante con respaldo. El de "ningún dato falso" refuerza la regla de la
  puerta única a la web: si una afirmación no tiene ficha `RES-XX` ni rótulo de leyenda,
  es un hallazgo bloqueante y no una observación. A cambio, se acepta explícitamente que
  una entrega lenta en un celular de gama baja puede pasar la revisión.

## D-10 — Hay difusión en la v1: Twitter y amigos

- **Fecha:** 2026-08-19
- **Estado:** aceptada — corrige el supuesto de instanciación
- **Contexto:** el brief asumía que no había analítica ni difusión activa en la v1. En
  `/kickoff` el usuario dijo que piensa mostrarlo por Twitter y a amigos, así que el
  primer contacto de mucha gente va a ser un link frío o un resultado compartido.
- **Decisión:** la difusión entra en el alcance de la v1 como restricción de diseño, no
  como rol nuevo. Consecuencias concretas: el **resultado compartible es la puerta de
  entrada** y `experiencia` lo diseña como pieza de primera clase; la primera pantalla se
  diseña para un desconocido sin contexto; y como el sitio efectivamente va a ser público,
  el gate de `D-07` deja de ser hipotético. La **analítica sigue fuera de alcance**.
- **Alternativas descartadas:** sumar un rol `difusion`, descartada porque el roster ya
  está en siete con justificación escrita y esto se resuelve con dos requisitos de
  `experiencia`, no con un agente más compitiendo por el ruteo; mantener el supuesto de
  "sin difusión" y tratar el compartir como adorno, descartada porque contradice lo que el
  usuario dijo que va a hacer, y dejaría la puerta de entrada real sin dueño.
- **Consecuencias:** `experiencia` suma dos entregables — la tarjeta de resultado
  compartible y la primera pantalla para desconocidos — y el criterio "sin muro de
  entrada" pasa de deseo a requisito medible. A cambio, sube la urgencia del gate de
  derechos: el plan explícito es publicar, no guardarlo en un cajón.

## D-11 — El validador de instancia vive en el instanciador, no en este repo

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** `CLAUDE.md` mandaba correr `python3 scripts/validar_instancia.py .` en las
  secciones 2 y 7, pero `scripts/` no existe en este repo: el comando fallaba y dejaba sin
  cumplir la regla "no dar por terminado nada sin una verificación que se pueda correr".
  El script sí existe, y funciona, en el proyecto hermano
  `../InstanciadorProyectos/scripts/validar_instancia.py`. Corrido contra esta instancia
  devuelve `APTA: 0 errores, 1 avisos`, y el único aviso es el roster de siete sobre un
  tope de seis — la escotilla que el propio instanciador agregó **por causa de este
  proyecto** (ver `docs/DECISIONES-DE-DISENO.md` §15 del instanciador).
- **Decisión:** no se copia el script acá. `CLAUDE.md` documenta la ruta real
  (`python3 ../InstanciadorProyectos/scripts/validar_instancia.py .`, desde la raíz) y
  aclara que el aviso de siete roles es esperado y no un error.
- **Alternativas descartadas:** copiar `validar_instancia.py` a `scripts/` para que el
  repo sea autocontenido, descartada porque el script codifica el esquema de frontmatter
  de Claude Code (`CLAVES_AGENTE`, `CLAVES_SKILL`, verificado 2026-08-18 contra
  `catalogo/esquema-claude-code.md` del instanciador) — una copia queda desactualizada en
  silencio, y un validador viejo que imprime `APTA` es peor que no tener validador: es
  exactamente la clase de falsa garantía que la regla de verificación existe para evitar.
  Además el instanciador no provisiona `scripts/` en ninguna plantilla ni en
  `.instancia.json`, porque por diseño el validador corre **desde afuera** sobre la
  instancia; escribir uno nuevo a mano, descartada porque ya existe uno mantenido y
  probado, y dos validadores con el mismo nombre en carpetas hermanas es una trampa.
- **Consecuencias:** la verificación de agentes y skills es ejecutable y hay un solo
  validador, que se actualiza junto con el esquema que valida. A cambio, este repo deja de
  ser autocontenido para esa verificación: depende de que `InstanciadorProyectos/` siga
  siendo carpeta hermana. Si se mueve, el comando falla ruidosamente (`No such file`) y
  hay que corregir la ruta en la sección 7 de `CLAUDE.md` — falla visible, no silenciosa.
  Esto **no** cubre la verificación del contenido del sitio (JSON contra schema de
  `arquitectura`) ni los criterios `US-XX`, que siguen siendo caminos separados.

## D-12 — Quien escribe un artefacto no puede verificarlo, y está bien: la verificación se rutea

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** en el ciclo 1 pasó dos veces lo mismo. `arquitectura` escribió
  `src/data/_schema/quiz.schema.json` (`T-04`) y `contenido` escribió `src/data/quiz.json`
  (`T-06`..`T-08`). Las dos tareas traían un comando de verificación en su definición, y
  **ninguno de los dos roles pudo correrlo**: de los siete roles, solo `orquestador` y
  `revisor` tienen `Bash`. Los cuatro que producen artefactos —`arquitectura`, `contenido`,
  `experiencia`, `producto`— no tienen herramienta de ejecución.
  Los dos agentes se comportaron **bien**: reportaron el bloqueo y **no inventaron una
  salida de terminal**. Pero `CLAUDE.md` dice "no dar por terminado nada sin una
  verificación que se pueda correr", y tal como estaba, esa regla era **incumplible por
  diseño** justo para los roles que fabrican las cosas que hay que verificar.
- **Decisión:** **no se les da `Bash`.** La verificación se **rutea**: el rol productor deja
  el comando exacto en su entrega, y lo corre quien tiene la herramienta — `revisor` cuando
  hay una tarea de revisión, el hilo principal cuando no la hay. Una tarea `T-XX` cuyo
  criterio de verificación sea un comando **no la cierra el rol productor solo**: se cierra
  cuando alguien lo corrió y pegó la salida. `orquestador` tiene que cortar las tareas
  sabiendo esto.
- **Alternativas descartadas:** darles `Bash` a los cuatro roles productores, descartada
  porque rompe la separación que hace confiable al equipo — un rol que fabrica y además se
  autocertifica es el mismo conflicto de interés que motivó separar `investigador` de
  `contenido` en `D-01`, y acá sería peor, porque el que escribe el schema es el que más
  ganas tiene de que el schema pase; mover toda verificación a `revisor` como gate único,
  descartada porque serializa el ciclo entero detrás de un rol y contradice el corte en
  tareas paralelas de una ráfaga; dejar que el rol productor declare "validado a mano",
  descartada porque es exactamente lo que la regla de `CLAUDE.md` prohíbe, y hoy los dos
  agentes tuvieron el criterio de no hacerlo — pero no hay que depender del criterio de
  cada agente para algo que puede ser estructural.
- **Consecuencias:** ninguna verificación queda declarada sin correrse, y el que corre el
  comando nunca es el que escribió el artefacto, que es una propiedad valiosa y gratis.
  A cambio, toda tarea que produce un archivo verificable tiene un **segundo paso
  obligatorio** con otro dueño, y `orquestador` no puede cerrarla en un solo eslabón. En el
  ciclo 1 esto se resolvió con el hilo principal corriendo los comandos; el resultado fue
  que el schema pasó los 8 casos y el banco dio `OK 15 items, sin fuente: 0`.
- **La evidencia que cerró la discusión, el mismo día:** al corregir los hallazgos de
  `REV-02`, `contenido` reforzó dos enunciados con pistas nuevas, **validó a mano campo por
  campo**, y reportó que estaba todo bien. No lo estaba: los dos enunciados quedaron en
  **242 y 277 caracteres** contra un `maxLength` de 180, y el banco **dejó de pasar el
  schema**. Nadie hizo nada mal — el rol no tiene con qué contar caracteres de forma
  confiable, y de hecho su decisión editorial de fondo era buena. Pero muestra por qué
  "validado a mano" no puede contar como verificación, y por qué el segundo paso con otro
  dueño no es burocracia: es lo único que separa "creo que está bien" de "está bien".

## D-13 — Las letras salen de fuentes de fans, con la objeción sobre la mesa

- **Fecha:** 2026-08-19
- **Estado:** aceptada — **con riesgo abierto declarado y mitigaciones adjuntas**
- **Contexto:** `RES-23` evaluo letras.com, el candidato obvio para el texto de las letras,
  y lo **descarto**: es de contribucion abierta, sin ninguna documentacion de licencia con
  editoriales, y lista **149 canciones contra las 105 reales** de `RES-20`, mezclando
  material del Indio solista, de Los Fundamentalistas y de Skay. La ficha describio ademas
  el modo de falla exacto: si un verso esta mal transcripto, **el juego le marca error a
  quien se sabe la letra de verdad**, que es el peor fallo posible frente a este publico.
  Con esa conclusion, la categoria `letras` del quiz y el juego `US-03` entero quedaban sin
  insumo, y el piso de `US-01` —definido como 10 por categoria sobre 40— dejaba de ser
  alcanzable por aritmetica: techo real 30/40.
- **Decision:** **se usan letras.com y bestiarioredondo igual.** El usuario la tomo con la
  objecion de `RES-23` explicitamente sobre la mesa, y el fundamento es del proyecto, no de
  conveniencia: *la banda tiene una mistica de pocas cosas oficiales*. No hay sitio oficial
  de letras y no lo hubo nunca, el memoir no las trae (`RES-21`), y la unica fuente con
  autoridad —el arte de los discos— es material fisico y offline. Construyeron todo sin
  multinacional, sin TV y sin publicitar los recitales (`RES-07`). **Exigir una fuente
  oficial es exigir algo que la banda deliberadamente nunca produjo.**
- **Alternativas descartadas:** esperar una fuente autorizada, descartada porque no va a
  existir y bloquearia `US-03` para siempre; transcribir de oido como fuente primaria del
  proyecto, descartada como punto de partida por costo, aunque **entra como paso de
  confirmacion**, que es distinto; sacar `US-03` del alcance de la v1, descartada porque el
  usuario lo confirmo en `/kickoff` (`D-05`) y porque el problema es de insumo, no de valor.
- **Consecuencias:** se recupera la categoria `letras`, se desbloquea `US-03`, y **el piso
  de 40 de `US-01` vuelve a ser alcanzable** — el techo de 30/40 que aparecio al planificar
  el ciclo 2 queda sin efecto, y `producto` no tiene que revisar la definicion de "Listo".
  A cambio se acepta el riesgo de `RES-23`, acotado por cinco mitigaciones que **son parte
  de la decision y no recomendaciones**. Dos hacen el trabajo pesado: **cruzar todo contra
  los 105 temas de `RES-20`**, que es obligatorio, gratis, y mata el unico error demostrado
  de la fuente; y **confirmar de oido contra el disco**, que es realista porque `BR-03`
  muestra 2/1/0 versos, asi que el piso de `US-03` necesita ~30 versos y no 15 letras
  enteras. Las otras tres: dos fuentes coincidentes antes de dar un verso por bueno,
  empezar por los temas mas conocidos donde un error se caza rapido, y dejar la fuente en
  el campo `fuentes` de cada item para que una correccion futura sea trazable.
  **Esto no levanta el gate de `D-07`:** la casilla de letras de `CNT-01` pasa de vacia a
  "fuente aceptada con mitigaciones", que es un estado distinto de resuelta, y las 8
  preguntas legales de fondo siguen sin responder.

## D-14 — La postura del proyecto: molinetes abiertos, riesgo asumido, conocimiento popular

- **Fecha:** 2026-08-19
- **Estado:** aceptada — **reencuadra `D-06`, `D-07`, `D-09` y `D-13`, y le da nombre a un
  principio que ya estaba disperso en tres decisiones**
- **Contexto:** el proyecto venia acumulando cautela. `D-07` partio el mundo en "construir"
  y "publicar" con un cerrojo en la segunda puerta. Las fichas `RES-03`, `RES-11`, `RES-13`
  y `RES-14` fueron cerrando el marco legal hacia el lado desfavorable: no hay *fair use* en
  Argentina, el derecho de cita cubre la obra y no el fonograma, la baja resolucion no
  protege nada, y "fin didactico" no se sabe si cubre un juego. En paralelo, el criterio
  "ningun dato falso" se estaba leyendo como "todo lleva URL y fecha", y `RES-23` habia
  llegado a bloquear una categoria entera del quiz por falta de fuente autorizada.
  Todo eso era correcto como investigacion y estaba desproporcionado como postura.
- **Decision:** el usuario fija el encuadre, con toda esa evidencia sobre la mesa.
  **(1) El riesgo se asume.** Es un fan site sin fines de lucro, de poco volumen, hecho para
  divertirse. Si llega un reclamo, **se da de baja y listo**. Nada espera permiso.
  **(2) El conocimiento popular es contenido legitimo.** La historia de esta banda se
  transmitio por relato: lo que conto alguien que estuvo, lo que se dice en la previa. **No
  hay mucho oficial y no deberia importarnos.** Se deja de exigir fuente autorizada.
  **(3) Molinetes abiertos.** En los recitales, los de adentro abrian los molinetes para que
  pasara el que no habia podido pagar. **Nada en el sitio se le niega a nadie por no tener
  con que entrar**: ni cuenta, ni login, ni Premium, ni saber lo suficiente.
- **Lo unico que NO se relaja, y no es por lo legal:** que la **respuesta correcta de una
  pregunta sea correcta**. Si el dato esta mal, el juego le marca error justo al que se sabe
  el tema, y eso destruye lo unico que el sitio promete: premiar al que sabe. La defensa no
  es verificar mas, es **rotular bien**. Una leyenda rotulada es contenido de primera; una
  leyenda disfrazada de hecho hace quedar mal al jugador. El sistema de tres casillas
  —hecho, leyenda, testimonio— que el schema ya hace cumplir es exactamente el mecanismo que
  esta postura necesita: **se construyo para dejar entrar el relato, no para filtrarlo.**
- **Alternativas descartadas:** sostener el gate de `D-07` hasta cerrar las preguntas
  legales de fondo, descartada porque esas preguntas **no tienen respuesta** —cuatro fichas
  las buscaron y las cuatro terminaron en "zona gris, ninguna fuente lo dice"— asi que el
  gate no era una espera sino un bloqueo permanente disfrazado de tramite; exigir fuente
  verificada para todo dato, descartada porque `RES-23` y `RES-21` probaron empiricamente
  que la fuente oficial **no existe y nunca existio**, de modo que la exigencia no subia la
  calidad, solo vaciaba el banco; abandonar del todo el rotulado y cargar cualquier cosa,
  descartada por el usuario mismo al mantener el interes en que el juego no se equivoque —
  y descartada tambien porque el rotulado **no es cautela legal**, es lo que hace que una
  leyenda sea disfrutable como leyenda.
- **Consecuencias:** se destraba el proyecto entero. `CNT-01` deja de ser un gate y pasa a
  ser **un mapa**: que se usa y de donde salio, para responder rapido y bien si alguien
  pregunta. `investigador` deja de ser el cuello de botella de cada dato y pasa a rendir
  donde de verdad rinde, que es cuando una discrepancia entre fuentes haria que una pregunta
  tenga dos respuestas defendibles. `contenido` puede escribir desde el conocimiento
  ricotero sin pedir permiso, siempre que rotule. Y el criterio "sin muro de entrada" deja
  de ser una regla de UX para pasar a ser **la identidad del sitio**, con nombre propio.
  A cambio se acepta, con los ojos abiertos, que el sitio puede tener que bajarse algun dia
  — y que eso esta bien.

## D-15 — Hosting en Vercel, salida estatica, y Supabase disponible pero sin usar

- **Fecha:** 2026-08-19
- **Estado:** aceptada
- **Contexto:** `D-02` fijo "hosting estatico gratuito" sin elegir proveedor, y el brief
  pone **cero costo recurrente** como restriccion dura. El usuario informa que tiene
  **Vercel Pro y Supabase Pro ya pagas**, y reafirma que **el costo de mantener esto tiene
  que ser 0 pesos**. Que una cuenta ya este paga no es lo mismo que que el proyecto sea
  gratis: si el sitio depende de una suscripcion, el dia que se da de baja el sitio muere.
- **Decision:** **Vercel, con salida estatica pura.** Astro genera HTML y assets, sin
  adapter, sin funciones serverless, sin runtime. La razon no es que Vercel Pro este pago,
  es que **un sitio estatico entra de sobra en el tier gratuito de Vercel**: si manana la
  suscripcion Pro desaparece, el sitio sigue en linea sin cambiar una linea. El Pro suma
  comodidad, no viabilidad. Y el tier gratuito de Vercel prohibe uso comercial, cosa que
  encaja exacto con lo que este proyecto es (`D-14`).
  **Supabase queda disponible y sin usar en la v1.**
- **Alternativas descartadas:** usar Supabase para puntajes, ranking o cuentas, descartada
  por tres razones que apuntan al mismo lado. Contradice `D-02` ("sin backend") y el
  "fuera de alcance" del brief, que ya excluye cuentas y ranking global. Contradice
  **"abrir los molinetes"** (`D-14`): una cuenta es, literalmente, un molinete — es pedirle
  algo al jugador para dejarlo entrar, y es lo unico que el principio rector prohibe por
  nombre. Y rompe el cero costo real: el tier gratuito de Supabase **pausa los proyectos
  por inactividad**, asi que un fan site de poco trafico es justo el caso que se apaga solo
  — el proyecto pasaria a depender de que la suscripcion Pro siga viva.
  Tambien se descarto usar funciones serverless de Vercel aunque esten incluidas: no hay
  nada en la v1 que las necesite, y agregarlas convierte un sitio que no puede fallar en
  uno que si.
- **Consecuencias:** desplegar es conectar el repo y listo, sin configuracion de runtime.
  `localStorage` sigue siendo la unica persistencia, y el link con parametros de `ADR-02`
  sigue siendo la unica forma de transportar un puntaje — las dos decisiones se vuelven
  mas coherentes, no menos. A cambio se acepta que no hay ranking global ni puntajes entre
  dispositivos, que ya estaba fuera de alcance. **Si algun dia se quiere ranking, esta
  decision es el lugar donde se discute**, y la conversacion arranca reconociendo que un
  ranking sin cuentas es dificil y un ranking con cuentas cierra un molinete.
- **Actualizacion del 2026-08-19, verificada contra la documentacion (`RES-15`):** el
  usuario desplego y pregunto como asegurarse de no pagar. La ficha confirma el diseno de
  esta decision y corrige una intuicion razonable pero incompleta — la de que alcanza con
  no activar Speed Insights ni Analytics.
  **Lo que decide no son los add-ons: es el scope.** En **Hobby no hay cargo posible**,
  porque al agotar un cupo el recurso se **frena** en vez de facturarse; en un **equipo
  Pro se cobra el excedente** de transferencia y edge requests aunque no se toque ningun
  add-on. Y hay una vuelta contraintuitiva: **Spend Management, el tope de gasto, solo
  existe en Pro** — en Hobby no existe porque no hace falta.
  La clausula de uso no comercial de Hobby encaja limpio: nada de cobrar, ads ni
  afiliados, y **las donaciones estan explicitamente permitidas**
  (https://vercel.com/docs/limits/fair-use-guidelines, consultado 2026-08-19).
  Los numeros reales del sitio: **11 KB comprimidos por visita**, tres archivos. Un millon
  de visitas serian ~10 GB contra los 100 GB de Hobby. **Accion pendiente del usuario:**
  verificar en Settings -> General que el proyecto viva en el scope personal y no en el
  equipo Pro, y moverlo con Transfer Project si hace falta.

## D-16 — El producto se llama Arcade Ricotero

- **Fecha:** 2026-08-20
- **Estado:** aceptada — decisión directa del usuario, en la sesión del sistema de marca.
- **Contexto:** el proyecto nació como "RicotaArcade", un nombre de carpeta más que de
  producto. Al armar el sistema de marca quedó a la vista que el nombre iba a estar en la
  portada, en el título del navegador y en la tarjeta compartible — y "RicotaArcade" mezcla
  orden inglés de palabras con un compuesto que nadie diría en voz alta.
- **Decisión:** el producto se llama **Arcade Ricotero**. "Arcade" se queda porque ya es
  palabra castellanizada de uso corriente; "Ricotero" es la identidad. El nombre cumple la
  regla de voz de `D-17` en vez de violarla.
- **Alcance del renombre:** lo que ve el jugador cambió ya (el `<title>` de
  `src/pages/index.astro`; el copy visible ya decía "el arcade ricotero" desde `CNT-05`).
  Las ~50 menciones en prosa interna (`Docs/`, `.claude/`, `CLAUDE.md`, `README.md`) se
  migran de a poco, sin apuro: son documentación, no producto. **Lo que NO se renombra sin
  su dueño:** el `$id` de los schemas (`ricotaarcade.local`) es contrato de `arquitectura`
  (`CTR-02`) — cambiarlo rompe la validación de los JSON y espera una decisión de ese rol.
  El nombre de la carpeta del repo tampoco se toca: no lo ve nadie y romperlo cuesta.
- **Consecuencia:** el sistema de marca (lienzo "Sistema de marca Arcade Ricotero") ya usa
  el nombre nuevo en la marca dibujada, la tarjeta compartible y todas las hojas.

## D-17 — Regla de voz: sin anglicismos, en español, argentino y ricotero

- **Fecha:** 2026-08-20
- **Estado:** aceptada — decisión directa del usuario, en la sesión del sistema de marca.
- **Contexto:** el copy del quiz ya venía en rioplatense con voseo (`CNT-02`, `CNT-05`),
  pero no había una regla que lo hiciera obligatorio ni que alcanzara a la prosa de diseño
  y a la documentación. Los anglicismos entraban por costumbre técnica: feedback, reveal,
  display, quiz.
- **Decisión:** **se evita el anglicismo siempre que exista la palabra castellana
  corriente.** Todo lo que el jugador lee va en español, argentino (voseo, nada de tú ni de
  neutro) y ricotero (la jerga va en el tono, nunca en la barrera — regla de `CNT-02`).
  Glosario inicial, fijado en la hoja 02 del sistema de marca: feedback → devolución,
  reveal → revelado, display (rol tipográfico) → rotulada, quiz → preguntas/trivia,
  link → enlace, score → puntaje, tokens (en prosa) → variables.
- **Límites explícitos, para que la regla no se vuelva caza de brujas:** los nombres
  propios y siglas (Spotify, WCAG, PNG, CSS) no son anglicismos; las palabras ya
  castellanizadas (arcade, collage, fanzine, rock) tampoco; y los identificadores internos
  del código (clases CSS como `.feedback`, la carpeta `src/lib/quiz/`, `tokens.css`) se
  renombran solo cuando el costo lo justifique — la regla manda sobre lo que **se lee**,
  no sobre el nombre de una carpeta.
- **Dueños:** el glosario de palabras visibles es de `contenido` (extiende `CNT-02`); la
  aplicación en pantallas es de `experiencia`; la prosa de cada carpeta, de su dueño.

## D-18 — Tipografía fiel y estética real por disco: nada de símiles

- **Fecha:** 2026-08-20
- **Estado:** aceptada — decisión directa del usuario, en la sesión del sistema de marca.
- **Contexto:** la hoja de tapas del sistema de marca mostraba "equivalentes de trabajo"
  (fuentes de Google Fonts parecidas al estilo documentado de cada tapa). El usuario los
  rechazó de plano: *"parecen parodias, quiero que sean las reales, no símiles"*. Y sumó:
  aprovechar la investigación para levantar la estética (paleta) real de cada disco y
  aplicarla al lienzo, y buscar más material de diseño en contratapas, folletos y afiches.
- **Decisión:** **(1)** los equivalentes tipográficos se retiran del sistema de marca.
  **(2)** El objetivo pasa a ser la **reconstrucción fiel** del lettering real de cada
  tapa — primero verificando si alguien ya lo digitalizó; si no, armando la fuente desde
  fotos con herramienta dedicada (barrido de herramientas y método en curso, ficha al
  llegar). **(3)** La **estética de cada disco entra al sistema medida, no recordada**:
  paleta muestreada por conteo de píxeles sobre la tapa real (`RES-37`), con método y
  límites declarados.
- **Tensión que esta decisión asume, y con qué respaldo:** reconstruir fiel la letra de
  las tapas es obra derivada del arte real — más cerca de "citar la tapa" que la postura
  de figuras sueltas de `D-04`/`UX-04`. Corre bajo el encuadre de `D-14` (fan site sin
  fines de lucro; el riesgo se asume; si llega un reclamo se baja) y con el contexto de
  `RES-06` (la postura pública de Rocambole sobre la reproductibilidad de su obra — que
  la propia ficha marca como contexto, no permiso). La letra reconstruida se usaría para
  los títulos del sitio, no para reponer composiciones de tapas.
- **Consecuencia inmediata:** hoja 05 del lienzo rehecha — paleta real medida por disco +
  estado de la evidencia sobre su letra. Pendiente al cierre: el barrido de fuentes ya
  hechas / herramientas foto-a-fuente / mapa de gráfica por disco, corriendo en paralelo.

## D-19 — La mezcla ricotera: cada pantalla viste un disco, la base no rota nunca

- **Fecha:** 2026-08-21
- **Estado:** aceptada — decisión directa del usuario, en la sesión del sistema de marca.
- **Contexto:** el sistema tenía una sola estética (tinta cálida + una rotulada). El
  usuario pidió otra cosa: *"que el sitio sea una mezcla de toda la cultura y los discos
  [...] que algunas secciones te hagan acordar a Gulp, otras a Oktubre, otras a La mosca
  y la sopa. Una mezcla bien ricotera, manteniendo ese caos de la banda."* Para entonces
  ya existían los insumos que lo hacen posible sin inventar nada: las paletas reales
  muestreadas (`RES-37`), las fuentes fan de Zavala (`RES-42`) y el calco propio de
  *Oktubre* (`RES-43`).
- **Decisión:** el sitio es **polifónico**: cada parte viste la estética de un disco
  distinto — paleta medida + letra reconstruida — sobre una base que no cambia. El mapa
  inicial (hoja 05 del lienzo): portada y título en **Oktubre** (rojo/negro, Oktubre
  Calco — el título del sitio va en la letra calcada, con las cuatro letras derivadas A
  C D I); historia en **Gulp!**; mitología en **Lobo suelto** (con el alfabeto de
  Semilla); letras en **La mosca y la sopa**; discos en **Último bondi**; resultado y
  compartir en **Gulp! + el lettering del logo** (fuente "Patricio Rey").
- **Las tres reglas que ordenan el caos:** (1) la base no rota — fondo de tinta, grano,
  serigrafía, zona pulgar y contraste AA son idénticos en todas las pantallas; rotan el
  acento y la letra grande. (2) El texto largo va siempre en la legible del sistema
  (`UX-01` intacto): las letras de disco gritan títulos, no explican. (3) El verde de
  acierto y el rojo de error no se disfrazan, y los rótulos de leyenda/testimonio no
  rotan nunca.
- **Deuda técnica declarada:** las fuentes fan y el calco **no traen acentos** (JUGÁ,
  SEGUÍ, MITOLOGÍA los necesitan) — derivar tildes es el próximo paso del calco. Y
  aplicar la mezcla al código real requiere variables de paleta por sección en
  `tokens.css` + el test de contraste extendido a cada combinación nueva: pasa por el
  hilo principal y el ciclo que lo planifique.
- **Dueños:** el mapa sección→disco es de `experiencia` en última instancia (extiende
  `UX-04`); esta decisión fija el principio y la primera asignación.

## D-20 — La Redondopedia: enciclopedia ricotera navegable, quinto frente del producto

- **Fecha:** 2026-08-21
- **Estado:** aceptada — decisión directa del usuario
- **Contexto:** el usuario pidió sumar al sitio una **"Redondopedia"**: una sección estilo
  Wikipedia con la historia completa de la banda, biografías de los miembros, letras, los
  casos reales alrededor de las canciones (Bulacio), y toda la cultura ricotera —
  navegable por enlaces entre artículos, como se navega Wikipedia. El fundamento es que la
  investigación acumulada **ya es más grande que lo que los juegos consumen**: más de
  cuarenta fichas `RES-` con cronología (`RES-05`), cultura (`RES-07`), mitología rotulada
  (`RES-08`), tracklists con autoría (`RES-20`), el memoir (`RES-21`), Rocambole y las
  tapas (`RES-06`, `RES-31`, `RES-33`, `RES-36`) — y hoy solo se asoma en preguntas de
  trivia. El usuario también pidió que **a futuro** la gente pueda sumar data; eso quedó
  explícitamente para después, no para ahora.
- **Decisión:** la Redondopedia entra como **quinto frente del producto**, con cinco
  cláusulas:
  **(1) No toca el "Listo" de la v1.** Los cuatro juegos (`D-05`) siguen siendo la v1 y
  conservan sus pisos y su orden de corte. La Redondopedia es un frente nuevo con historia
  propia (`US-05`, la escribe `producto`) y su propio "listo"; la prioridad relativa entre
  frentes se decide en `/ciclo`, no acá.
  **(2) Estática, sin backend — `D-02` intacta.** Artículos Markdown versionados en el
  repo, enlaces internos estilo wiki, HTML estático generado por Astro. Un artículo es un
  archivo, igual que una pregunta es una línea de JSON.
  **(3) El rotulado de tres casillas se extiende a los artículos.** Hecho, leyenda y
  testimonio (`D-14`) rigen dentro de la prosa igual que en el quiz. Esta es la ventaja
  competitiva real: **Wikipedia no puede contar la leyenda como leyenda** — su política de
  fuentes es exactamente la exigencia que `D-14` decidió no adoptar. Una enciclopedia que
  rotula el relato y lo cuenta igual es la única que puede escribir la historia de esta
  banda entera.
  **(4) El insumo inicial es la investigación existente.** El primer lote de artículos
  sale de las fichas `RES-` ya escritas, no de investigación nueva.
  **(5) "Que la gente sume data" queda fuera de alcance por ahora.** Cuando se discuta,
  la conversación arranca en esta decisión y con dos restricciones ya tomadas: sin backend
  (`D-02`, `D-15`) y sin cuentas (`D-14`, los molinetes) — la vía natural es el repo
  público en GitHub o un buzón de sugerencias, nunca un login.
- **Alternativas descartadas:** un wiki con motor real (MediaWiki o similar), descartado
  porque exige backend, cuentas y moderación — contradice `D-02` y `D-15`, y una cuenta de
  editor es un molinete igual que una de jugador; enlazar a Wikipedia en vez de escribir
  artículos propios, descartado porque regala la voz (el tono ricotero de `CNT-02` no
  existe allá) y porque allá la leyenda sin fuente se borra en vez de rotularse; meterla
  dentro del "Listo" de la v1, descartado porque los cuatro juegos tienen pisos y promesa
  cerrados y la enciclopedia todavía no tiene piso — sumarla al gate sería frenar lo
  terminado con lo recién nacido; esperar a terminar los juegos para siquiera
  registrarla, descartado porque la decisión ya está tomada por el usuario y no
  registrarla es como no tenerla (un requisito sin ID no existe).
- **Consecuencias:** se gana la superficie donde la investigación rinde entera, y un
  circuito nuevo entre juegos y artículos — la pregunta enlaza al artículo ("leé más") y
  el artículo devuelve al juego. Cada rol hereda trabajo concreto: `producto` escribe
  `US-05` con estructura y piso; `arquitectura` debe un contrato nuevo (colección
  Markdown, frontmatter con rótulo y fuentes, convención de enlaces internos);
  `experiencia` debe el patrón de navegación móvil de artículo largo — que es **otro
  modo de uso** que el de sesión de juego de 2-3 minutos — y puede vestirla con `D-19`
  (el mapa sección→disco ya existe: historia=Gulp!, mitología=Lobo suelto); `contenido`
  escribe los artículos bajo `CNT-02` y `CNT-04`. La decisión **fuerza dos pendientes
  que venían pateándose**: cómo y dónde el sitio cuenta la muerte del Indio (`RES-04` —
  una biografía no puede esquivarla) y el límite editorial sobre Bulacio y Olavarría,
  que deja de ser un borde del quiz para volverse artículos enteros (`CNT-04` se relee
  con esa vara). Las letras completas por tema son más exposición que los ~30 versos del
  juego: corren bajo `D-13` (fuentes de fans con mitigaciones, cruce obligatorio contra
  los 105 temas de `RES-20`) y bajo `D-14` (el riesgo se asume; si llega un reclamo, se
  baja). Y una aclaración de tono para que nadie la tropiece: el BRIEF dice "nada de
  manual ni de enciclopedia" — eso rige **la voz, no la estructura**. La Redondopedia es
  enciclopedia en la forma y ricotera en la voz.

## D-21 — Las tapas reales entran a toda la pantalla, no solo al juego de adivinarlas

- **Fecha:** 2026-08-21
- **Estado:** aceptada — decisión directa del usuario, al arrancar el ciclo 4.
- **Contexto:** las 35 imágenes de las tapas ya están bajadas y viven como másters fuera
  del sitio, en `Docs/INVESTIGACION/TapasDiscos/`. Hoy llegan a **una sola pantalla**: la
  ficha de disco de la Redondopedia, a 320 px. El usuario pidió otra cosa, textual:
  *"integrar las tapas reales a la página, utilizar los jpg reales. Recortarlos y usar
  detalles o usarlos de fondo."* Eso choca de frente con una fila de `UX-04` que dice
  igual de textual: tapas reales **"solo el juego adivinar la tapa o el disco [...] nunca
  como fondo decorativo de otra pantalla"**.
- **Por qué la regla decía lo contrario, y por qué eso ya no se sostiene:** `UX-04` se
  escribió bajo `D-04` (arte original rocambolesco, tapas reales acotadas) y en un momento
  donde el gate de derechos de `D-07` todavía existía — la cautela era de publicación, no
  de diseño. **`D-14` sacó ese cerrojo** y reencuadró el proyecto entero: fan site sin
  fines de lucro, riesgo asumido, si llega un reclamo se baja. La restricción de `UX-04`
  sobrevivió al encuadre que la justificaba. Lo que queda de `D-04` que sí sigue vivo es
  otra cosa: **la baja resolución y el crédito**, y esos no se tocan.
- **Decisión:** las tapas reales entran a **cualquier pantalla del sitio**, en tres formas
  — **detalle recortado** (un pedazo de la tapa, tratado como recorte pegado), **fondo
  velado** (la tapa detrás del contenido, con un velo que garantiza la lectura) y **ficha**
  (la tapa entera en baja, como ya está en la Redondopedia). Con cuatro condiciones que no
  son negociables:
  **(1) El crédito a Rocambole sigue siendo obligatorio donde aparezca una tapa.** Deja de
  alcanzar con "crédito al lado de la imagen", porque un fondo no tiene dónde poner una
  firma: hace falta un mecanismo, y lo define `experiencia` en `UX-04`.
  **(2) La legibilidad gana siempre.** Texto sobre tapa pasa AA o no va. El velo es un
  **token con test de contraste**, no una opacidad elegida a ojo en cada pantalla. Es la
  base que `D-19` declaró que no rota nunca, aplicada a un fondo nuevo.
  **(3) La forma sigue siendo la del proyecto.** Recorte de borde rasgado, borde grueso de
  serigrafía, rotación leve, tinta plana encima — no la imagen de encabezado a sangre con
  velo oscuro y texto blanco al medio, que es exactamente el tic genérico que veta
  `.claude/rules/diseno-marca.md`. Usar la tapa real **no habilita** a resolverla como la
  resolvería cualquier plantilla.
  **(4) La baja resolución de `D-04` sigue vigente.** Un fondo pide más píxeles que una
  estampilla de 320 px, y el número nuevo lo fija `experiencia`; el máster no llega nunca
  al sitio.
- **Lo único que esta decisión deja explícitamente prohibido:** usar como **respuesta
  correcta** de "adivinar la tapa" una imagen cuya edición no esté confirmada. No es una
  cautela legal: es lo único estricto que le queda al proyecto — si el archivo es un CD
  yanqui del 93 y la respuesta dice LP argentino del 86, **el juego le marca error al que
  se sabe el disco**. `RES-25` ya cazó ese caso concreto con *Oktubre*.
- **Alternativas descartadas:** *resolver todo con dibujos propios y dejar `UX-04` como
  está*, descartado porque el usuario pidió las tapas reales y porque no es o uno o el otro
  — los recortes originales de `public/arte/` conviven y siguen siendo el default del
  collage; *usar las tapas sin tocar la regla escrita*, descartado porque una regla que se
  incumple en silencio deja de ordenar nada y el próximo rol la va a leer y a obedecer,
  construyendo contra el sitio real; *tapas enteras a sangre como fondo de cada pantalla*,
  descartado por las condiciones 2 y 3 — rompe el contraste y trae de vuelta el slop que
  costó una corrida entera sacar; *esperar la ficha de evaluación de Coveralia para tocar
  nada*, descartado porque esa evaluación importa para **la edición de cada imagen** (o
  sea, para `US-04`), no para si un detalle puede vestir una pantalla.
- **Consecuencias:** `experiencia` reescribe la fila de `UX-04` y escribe `UX-05`, el
  catálogo de qué detalle de qué tapa viste cada sección bajo el mapa de `D-19`;
  `scripts/generar-tapas.mjs` gana los derivados (detalle y fondo) además de la baja que ya
  produce; `tokens.css` gana el velo y `contraste.test.ts` el par nuevo; el lienzo de marca
  gana la regla en la hoja 05, porque el circuito es diseño → tokens → test y no al revés.
  Y habilita de una vez **`US-04`**, que era el juego con la materia prima más cerca y la
  regla más en contra. El riesgo es el de `D-14` sin novedad: si llega un reclamo, se baja.
- **Dueños:** la regla y el catálogo son de `experiencia` (`UX-04` es suya); los valores de
  marca salen del lienzo; el riesgo lo asume el usuario bajo `D-14`. Esta decisión fija el
  principio y las cuatro condiciones, no los números.

---

## D-22 — Los temas enteros se alojan en el sitio, en mp3

- **Fecha:** 2026-08-22
- **Estado:** aceptada — decisión directa del usuario, textual: *"Vamos a alojar temas
  enteros en .mp3 seguro."*
- **Contexto:** hasta hoy, "alojar los temas completos" era una de las cuatro líneas de
  **Fuera de alcance** del brief, y la única vía al tema entero era Spotify. Eso arrastraba
  un problema que el proyecto venía sin poder cerrar: `RES-01` mostró que un jugador sin
  Premium probablemente no escuche el tema completo, `E-07` de `ADR-01` quedó registrado en
  `ESTADO.md` como **"la pregunta que más pesa"** —si un usuario free en Argentina no puede
  reproducir a demanda, ninguna vía cumple la promesa del brief—, y `BR-06` tuvo que
  redactarse justamente para **no prometer** lo que el sitio no podía dar. La contradicción
  de fondo era con el principio del propio proyecto: los molinetes abiertos (`D-14`) dicen
  que nada se le niega a nadie por no tener con qué entrar, y el tema completo era
  exactamente eso — algo que solo escuchaba el que tenía Premium.
- **Decisión:** el sitio aloja los temas enteros en mp3 y los sirve él mismo. Deja de estar
  en Fuera de alcance.
- **Alternativas descartadas:** seguir con fragmento propio + Spotify, descartada porque es
  el estado actual y es el que no cumple — deja al jugador sin Premium sin tema completo, que
  es cerrar el molinete; alojar solo los temas que los juegos necesitan (los 20 de `US-02`)
  en vez de los 105, descartada como decisión pero **no como orden de carga**: se puede
  empezar por esos 20 sin que eso cambie la decisión; alojar en un tercero (Archive, Drive,
  bucket externo), no descartada por el usuario sino **no planteada** — queda como pregunta
  abierta de abajo, porque cambia el costo y no la decisión.
- **Consecuencias, y son varias:**
  **(1) Se levanta el bloqueo que más pesaba.** `E-07` y `E-04` de `ADR-01` dejan de decidir
  si la promesa se cumple: el sitio ya no depende de Spotify para el tema entero. Spotify
  puede quedarse como enlace —no cuesta nada y suma para el que sí tiene cuenta— pero baja
  de ser *la promesa* a ser *un extra*. Quién decide eso: `arquitectura` en `ADR-01`, con
  `producto` revisando `BR-06`.
  **(2) `D-06` se simplifica en vez de crecer.** El usuario ya baja los temas de YouTube; lo
  que cambia es que deja de tener que recortar a mano cada fragmento, porque los pasos del
  reveal de `US-02` se pueden derivar del archivo entero. Si `arquitectura` lo confirma, el
  trabajo manual de `D-06` casi desaparece.
  **(3) El peso pasa a ser el problema real, y no es chico.** Contra las duraciones fichadas
  en `RES-20` —94 de los 105 temas las traen, suman 385 minutos— el catálogo completo son
  **unas 7,2 horas de audio**. Traducido, y esto es aritmética, no opinión:

  | Bitrate | Catálogo completo (105 temas) |
  |---|---|
  | 96 kbps | ~300 MB |
  | 128 kbps | ~400 MB |
  | 192 kbps | ~600 MB |
  | 320 kbps | ~1 GB |

  **(4) Y de ahí sale el que hay que mirar antes de subir el primer archivo: el repo.** El
  proyecto está en GitHub y Vercel construye desde ahí, así que meter cientos de MB de mp3
  al repo versionado es una decisión de infraestructura, no un detalle de carga. `RES-15` ya
  verificó que en Vercel Hobby **no hay cargo posible** —al agotarse un cupo el recurso se
  frena, no se factura—, o sea que el riesgo no es una factura sorpresa; el riesgo es que el
  sitio deje de servir, o que el repo se vuelva impracticable. Los límites concretos de
  Vercel para este volumen **no están fichados**: hace falta `RES-XX` de `investigador`
  antes de tomar la vía. Es lo único de esta decisión que conviene chequear antes y no
  después.
  **(5) El codec es la palanca, y no la fija esta decisión.** El usuario dijo mp3 y mp3
  queda. Pero si el peso resulta ser la restricción que manda, la tabla de arriba muestra
  que bajar el bitrate vale más que cualquier otra cosa, y que un codec moderno pesaría
  bastante menos a igual calidad percibida. Eso es de `arquitectura`, no de acá.
  **(6) `IDEA-10` (Guitar Hero) se desbloquea.** Era la única de las diez ideas guardadas con
  bloqueo estructural, y el bloqueo era exactamente este. Sigue sin estar empezada y sigue
  necesitando promoverse a `US-XX` (`BR-16`); lo que cambió es que ahora se puede.
  **(7) La exposición sube y el encuadre no cambia.** Servir la grabación entera es más que
  usar un fragmento, y conviene decirlo una vez en voz alta en lugar de dejarlo implícito.
  Pero el encuadre ya está decidido y no lo reabre esta decisión: `D-14` dice fan site sin
  fines de lucro, riesgo asumido, y si llega un reclamo se baja. Lo que sí vuelve más
  cargante es `BAJAR-EL-SITIO.md`: bajar el sitio ahora también significa bajar el audio.
- **Preguntas que quedan abiertas al usuario, y ninguna frena la decisión:** si los mp3 van
  adentro del repo o en un almacenamiento aparte; y si Spotify se queda como enlace o se
  retira del reveal.
- **Dueños:** la decisión y el riesgo son del usuario bajo `D-14`. La vía técnica —dónde
  viven los archivos, qué bitrate, cómo se derivan los pasos del reveal— es de
  `arquitectura` (`ADR-01`, `CTR-01.3`). La promesa que se le hace al jugador es de
  `producto` (`BR-06`). Los límites de Vercel, de `investigador`.

---

## D-23 — El audio va en dos niveles, y los 2,5 GB no entran al repo

- **Fecha:** 2026-08-23
- **Estado:** aceptada — el usuario trajo el número y decidió sobre una propuesta del hilo
  principal. Cierra la primera de las dos preguntas que `D-22` había dejado abiertas: *"si
  los mp3 van adentro del repo o en un almacenamiento aparte"*.
- **Contexto:** el usuario preguntó si convenía subir al repo **la discografía completa que
  tiene, 2,5 GB**, para usarla en juegos, ambiente y demás. Tres cosas de ese número, y las
  tres cambian la pregunta:

  1. **2,5 GB no es la discografía: es la discografía en calidad de archivo.** Contra las
     ~7,2 h que `D-22` calculó desde `RES-20`, esos 2,5 GB dan del orden de **770 kbps
     promedio** — más del doble de un mp3 a 320. Es lossless o casi. La tabla de `D-22`
     dice que el mismo catálogo a 128 kbps son ~400 MB, y a 96 kbps —el bitrate que
     `CTR-01` ya usa para el fragmento— unos 300 MB. **El peso no viene de cuántos temas
     son, viene del formato**, y la diferencia no la escucha nadie en un celular con datos
     móviles.
  2. **Git no es un disco.** Guarda cada versión para siempre y el audio ya viene
     comprimido, así que no delta-comprime: 2,5 GB en el repo son 2,5 GB en cada clone,
     cada checkout de CI y **cada build de Vercel**, para siempre. Y sacarlo después no es
     un `revert`, es reescribir la historia del repo.
  3. **Los topes conocidos lo dejan afuera.** GitHub bloquea archivos de más de 100 MiB
     (ningún mp3 llega, tranquilos) pero recomienda repos **por debajo de 1 GB** y
     "fuertemente" por debajo de 5. Del lado de Vercel, el número documentado —100 MB de
     fuente en Hobby— es el del despliegue **por CLI**, y este proyecto despliega **desde
     git**, que es otra vía. Ese hueco es exactamente lo que `D-22` dejó anotado como sin
     fichar y lo que ahora se le pide a `investigador` como `RES-50`.

- **Decisión:** tres partes.

  **(1) Los 2,5 GB no entran al repo.** Se quedan en la máquina del usuario como material
  de trabajo. De ahí salen los fragmentos, de ahí salen los mp3 que sirve el sitio, y de
  ahí sale la confirmación de oído de `CTR-04` que hoy tiene apagado el juego de `US-03`.

  **(2) Al sitio va un derivado, en dos niveles y no en tres:**

  | Nivel | Qué es | Cuánto pesa | Para qué |
  |---|---|---|---|
  | **Fragmento** | los 15 s de `CTR-01`, 96 kbps mono | **120 KB** × 104 ≈ **12,5 MB** | que los 104 temas con letra sean jugables en `US-02` |
  | **Tema entero** | el mp3 completo, a definir bitrate | ~4 MB c/u a 128 kbps | cumplir `D-22` con el que ya adivinó |

  **(3) El nivel "entero" se carga por demanda, no por catálogo.** Arranca por los temas
  que algún juego revela —del orden de 40, unos 160 MB— y no por los 105. Es el "orden de
  carga" que `D-22` ya había dejado explícitamente permitido.

- **Alternativas descartadas:**

  1. **Subir los 2,5 GB tal cual.** Descartada por las tres razones del contexto. No es una
     carga de material: es una decisión de infraestructura que en la práctica no se
     revierte, y encima paga peso por una calidad que el destino final no distingue.
  2. **Guardar la mitad de cada tema**, propuesta del usuario para que los 104 se pudieran
     jugar sin alojar 105 temas enteros. **Descartada por aritmética, no por criterio.** El
     juego de `US-02` necesita 15 segundos, no dos minutos: medio tema son ~1,4 MB contra
     los 120 KB del fragmento, **doce veces más para exactamente el mismo juego**. Y del
     lado de `D-22` tampoco alcanza — el que adivinó quiere el tema, y la mitad es media
     promesa. Lo que la mitad quería comprar ya lo compra el fragmento de `CTR-01`, y más
     barato.
  3. **Música de ambiente en el sitio.** No se descarta el gusto, se descarta la vía por
     default: en móvil el audio automático lo bloquean los navegadores, se le pisa al
     jugador lo que ya venía escuchando, y contradice la sesión de dos o tres minutos del
     brief. Si va, va **a pedido y con un control visible**, y lo diseña `experiencia`.
  4. **Alojar en un tercero** (Archive, bucket externo). **No descartada** — sigue abierta,
     igual que en `D-22`. Lo que cambió es la urgencia: con ~180 MB deja de ser la única
     salida. Si `RES-50` dice que el repo no aguanta, vuelve al primer plano.

- **Consecuencias:**

  **(1) El primer paso queda chico y no lo discute nadie.** 12,5 MB de fragmentos hacen
  jugables los 104 temas. Es la carga que se puede empezar hoy sin esperar ninguna ficha.

  **(2) `RES-50` importa más, no menos.** Con 2,5 GB no hacía falta preguntar: no entraba
  por ningún lado. Con ~180 MB la respuesta de Vercel es la que decide si el audio vive en
  el repo o afuera. Es lo único de esta decisión que conviene chequear **antes**.

  **(3) `D-22` mantiene su promesa entera.** Lo que se acota es el catálogo alojado, no la
  experiencia: el que adivina un tema lo escucha completo, sin cuenta, sin Premium y sin
  pedirle nada. Los molinetes siguen abiertos en los dos niveles.

  **(4) El destrabe de `US-03` es el uso más valioso de esos 2,5 GB, y no pasa por el
  sitio.** `CTR-04` deja llegar a `listo` por dos puertas —dos fichas de letra o
  confirmación de oído— y la primera **hoy no la cruza ningún ítem**: letras.com aportó 14
  temas con letra y cifraclub 82, con **solapamiento cero**. No hay atajo, alguien tiene que
  escuchar. Tener la discografía en la máquina es exactamente lo que lo hace posible, y no
  requiere subir un byte.

  **(5) Dos ideas de juego quedan planteadas y fuera de alcance.** Un juego tipo Crazy Taxi
  y otro tipo Doom, con el tema entero sonando de fondo. `D-05` fijó **cuatro** juegos para
  la v1 y ninguno es eso. Esta decisión no los mete ni los mata: si entran, entran como
  `US-XX` de `producto`, por la vía de `BR-16`. Lo que sí cambia es que el audio que
  necesitarían ya no es un bloqueo.

- **Preguntas que quedan abiertas, y ninguna frena la decisión:** cuántos temas enteros
  exactamente —depende de qué juegos revelan cuáles—; y si Spotify se queda como enlace,
  que viene abierta desde `D-22`.
- **Dueños:** la decisión y el riesgo son del usuario bajo `D-14`. El bitrate, la ubicación
  y si el fragmento se deriva del mp3 entero, de `arquitectura` (`ADR-01`, `CTR-01.3`). Los
  límites de Vercel y GitHub, de `investigador` (`RES-50`). El sonido de ambiente, de
  `experiencia`. Los dos juegos nuevos, de `producto`.

---

## D-24 — "Adiviná el tema" se hace calcado del juego de referencia: seis pasos y errar abre audio

- **Fecha:** 2026-08-23
- **Estado:** aceptada — decisión directa del usuario, con el juego de referencia sobre la
  mesa. Textual: *"Utilizar como plantilla del juego esta pagina que es basicamente el
  juego que queremos hacer"*, y *"no hay que reinventar la rueda, hay que aplicar este
  juego hecho a la página"*.
- **Contexto:** `US-02` estuvo dos ciclos en la cocina. El contrato estaba entero
  (`CTR-01`, `CTR-03`) pero con dos cosas sin cerrar: **cómo se responde** —`CTR-03.5`
  dejó `"opciones"` como valor de trabajo y pidió a `producto` que decidiera— y **la
  aritmética de `BR-02`**, que `arquitectura` ya había mostrado rota: con cuatro opciones
  y errar gratis, el que no reconoce nada sacaba 70 puntos de promedio. La revisión de
  `BR-02` del 2026-08-19 lo tapó con **intento único**: errás una vez y el tema se cierra
  en cero.

  El usuario trajo el juego que quiere. Está relevado en
  `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`, jugado y medido, no mirado de
  costado. Y lo que ese juego hace es **exactamente lo contrario** de lo que `BR-02` había
  quedado diciendo.

- **Decisión:** cuatro partes.

  **(1) La escalera pasa de cinco pasos a seis, y de 10 a 15 segundos:**
  **0,1 · 0,5 · 2 · 4 · 8 · 15**. Los tres primeros son los que `CTR-01.9` ya tenía; lo
  que cambia es la cola, que ahora duplica hasta el final. Los 15 segundos no los inventa
  esta decisión: `D-23` ya había escrito *"los 15 s de `CTR-01`"* al partir el audio en
  dos niveles, y **`US-02` necesita 15 segundos** está en ese mismo texto.

  **(2) Errar es lo que desbloquea el audio.** Seis intentos por tema, uno por escalón.
  Cada respuesta equivocada —o cada "pasar"— abre el paso siguiente. Se acaban los seis y
  ahí sí el tema se cierra en cero. **Esto reemplaza el intento único de `BR-02`.**

  **(3) Se responde con un buscador con autocompletado, no con cuatro opciones.** El
  jugador escribe y **elige de una lista**; lo que viaja es la identidad del tema, no una
  cadena de texto. Pedido explícito del usuario: *"es importante el autocompletar de las
  canciones para agilizar el juego"*. Esto cierra `CTR-03.5` con un valor que el contrato
  no contemplaba: `modoRespuesta: "buscador"`.

  **(4) El pozo lo elige el jugador: todos los temas, o un disco.** También pedido
  explícito. La lista del buscador sigue siendo la de los 105 aunque el pozo sea de un
  solo disco.

- **Por qué la mecánica nueva no reabre el agujero que `BR-02` había tapado.** Es la
  pregunta que hay que contestar, porque la mecánica vieja existía justamente para eso.
  La cuenta cambia de raíz al cambiar el mecanismo de respuesta:

  | | Cuatro opciones (lo que `BR-02` temía) | Buscador sobre 105 títulos |
  |---|---|---|
  | Probabilidad de pegarla sin reconocer nada | 1 de 4 | 1 de 105 |
  | Seis intentos al azar rinden | esperado de 70 puntos | ~5,5% de sacar **algo** |

  Con cuatro opciones, errar gratis era una máquina de descartar. Con 105 títulos no
  descarta nada: seis intentos al azar dejan al jugador con 99 títulos sin probar. **El
  azar dejó de pagar, así que ya no hay que castigarlo.** Y hay un motivo de proyecto
  además del aritmético: cerrar el tema en el primer error deja al que entró sin idea
  escuchando una décima de segundo y nada más, que es cerrar un molinete (`D-14`).

- **La tabla de puntaje, provisoria y de `producto`:** 100 · 80 · 60 · 40 · 20 · 10, y
  **0 solo por no sacarla**. Las cinco primeras filas son las de `BR-02` sin tocar; la
  sexta la agrega esta decisión porque hay un escalón más. Cero sigue sin ser nunca el
  resultado de haber tardado.

- **Alternativas descartadas:**
  - **Dejar `BR-02` como está (intento único, cinco pasos) y no copiar el juego.**
    Descartada: es lo contrario de lo que pidió el usuario, y además el paso 5 y la rama
    de cero eran inalcanzables en la práctica.
  - **Mantener las cuatro opciones y sumarles la escalera de seis.** Descartada por la
    tabla de arriba: con opciones, seis intentos gratis es peor que cinco.
  - **Texto libre en vez de lista** (`modoRespuesta: "texto"`, que el contrato sí
    contemplaba). Descartada: obliga a decidir si "Ji ji ji" y "Jijiji" son la misma
    respuesta, y esa pregunta no tiene una respuesta buena. Con lista no existe.
  - **Copiar el juego de referencia entero, partida diaria incluida.** Descartada: una
    partida por día contradice "se entra, se juega, se cierra" y deja afuera al que llega
    un martes a la noche con ganas de tres vueltas.
  - **Copiar también su búsqueda difusa.** Descartada por ruido: se midió que `zzzzq`
    ofrece temas de ZZ Top.
  - **Copiar sus estadísticas y su comparación social.** Descartada por alcance y por
    `D-14`: sin cuentas, sin ranking.

- **Consecuencias:**
  1. **`US-02` deja la cocina y se juega.** Es el tercero de los cuatro juegos de `D-05`.
  2. **`BR-02` y `CTR-01.9` quedan desactualizados** y hay que rescribirlos. Los pedidos
     están en `Docs/SUGERENCIAS/`. Mientras tanto la única fuente de la escalera es
     `src/lib/tema/escalera.ts`, con la tabla del usuario escrita a mano en su test.
  3. **`CTR-03` va a v2** por el `modoRespuesta` nuevo. Nada de lo ya cargado se pierde:
     no hay banco cargado de este juego, y el que había que cargar a mano —veinte ítems
     con cuatro distractores cada uno— **ya no hace falta**. El catálogo sale de `RES-20`
     en build. Es trabajo de `contenido` que esta decisión borra, no que posterga.
  4. **El cuello de botella queda en un solo lugar: el audio.** El juego está entero y no
     tiene con qué sonar hasta que corran los fragmentos desde la máquina del usuario
     (`npm run generar-fragmentos`). Sin audio la pantalla lo dice y no se rompe.
  5. **Un número de `D-23` hay que corregirlo, y es a favor:** ahí dice "12,5 MB" para los
     104 fragmentos, pero eso son 120 KB cada uno, que es el peso de **10** segundos a
     96 kbps. A 15 segundos son ~180 KB, o sea **~19 MB** en total. Sigue siendo nada
     contra cualquier tope, pero el número escrito estaba viejo.
  6. **La escalera no vive en ningún dato.** Los seis pasos salen del mismo archivo de
     audio (`CTR-03.4`): si mañana cambia, cambia una constante y ningún JSON.
- **Dueños:** la decisión es del usuario. La tabla de puntaje y la mecánica de intentos
  son de `producto` (`BR-02`); la escalera en segundos y el `modoRespuesta`, de
  `arquitectura` (`CTR-01.9`, `CTR-03.5`). Lo construido por el hilo principal se ajusta a
  lo que esos dos escriban.

---

## D-25 — `US-03` sale con letras de fuente única, y se corrige jugando

- **Fecha:** 2026-08-25
- **Estado:** aceptada — decisión directa del usuario, tomada con la advertencia sobre la
  mesa. Se le ofrecieron tres salidas y se le dijo cuál era el riesgo de esta. Textual:
  *"salen con los temas que ya tenemos, si hay que cambiar algo lo veo jugando el juego"*.

- **Contexto: las dos vías de `CTR-04.6` están cerradas, y eso se midió, no se supuso.**

  El juego de completar la letra está construido desde el ciclo 6 y no se juega a propósito.
  `CTR-04.6` pone una sola condición de estado: para que un verso sea `listo` necesita **o**
  confirmación de oído contra el disco, **o** dos fichas de fuente de letra. Hoy hay 1.784
  versos candidatos y **los 1.784 están en `borrador`**.

  Al planificar el ciclo 9 se fue a ver por qué, y las dos vías están cerradas por motivos
  distintos:

  1. **Dos fuentes: imposible con lo que hay.** Cada tema del cancionero tiene **una sola**
     fuente —cifraclub 78, lacuerda.net 21, letras.com 5— y los 149 archivos crudos del
     scraper son **uno por tema**. Solapamiento cero, comprobado en el material crudo y no
     solo en el derivado. No es que sea caro cruzar: **no hay con qué cruzar**.
  2. **De oído:** los 26 huecos `_:__` de `src/data/letra-confirmaciones.json` siguen en
     blanco desde el ciclo 6. Son veinte minutos de una persona, y llevan tres ciclos sin
     que nadie los haga.

- **Decisión:** un verso puede llegar a `"estado": "listo"` **con una sola fuente de letra
  declarada**, sin confirmación de oído. `arquitectura` escribe la vía nueva en `CTR-04`.

  **Lo que la decisión cambia de verdad no es el rigor, es el orden.** Antes era *verificar y
  después publicar*; ahora es *publicar y corregir*. El usuario no dijo que los datos estén
  bien: dijo que se va a enterar jugando. Eso es una apuesta sobre **cuándo** aparece el
  error, no sobre si existe.

- **Lo que no cambia, y conviene que esté escrito porque es lo que evita que esto sea barra
  libre:**

  1. **El ítem sigue necesitando su fuente declarada.** Lo que se relaja es *cuántas*, no
     *si hay*. Un verso sin fuente sigue sin validar.
  2. **El tema sigue teniendo que estar en los 105 de `RES-20`.** Ese filtro no lo toca nada.
  3. **El rótulo sigue sin poder mentir.** Si el sitio muestra un verso sostenido por una
     sola transcripción de fans, no puede presentarlo como si estuviera cotejado.
  4. **Esto vale para `US-03` y para nada más.** No es una regla general sobre la veracidad
     del sitio. El banco del quiz sigue con `CTR-02` intacto.

- **🔴 Lo que esta decisión erosiona, dicho sin adornos.** `D-14` abrió casi todos los
  molinetes del proyecto y dejó **una sola cosa estricta**, con este argumento: si la
  respuesta está mal, *"el juego le marca error justo al que se sabe el tema"*. `CTR-04.6`
  es la traducción de esa frase a una regla corrible, y su propio contrato la nombra como
  *"la que protege lo único estricto del proyecto"*.

  **`D-25` la afloja.** No la borra —la fuente sigue siendo obligatoria— pero la afloja, y
  hay que decirlo así y no como una mejora de proceso. El proyecto acepta que en `US-03`
  algún jugador va a recibir un error injusto antes de que alguien lo corrija.

- **Las tres mitigaciones que hacen que la apuesta sea razonable**, en orden de cuánto
  aportan:

  1. **El botón de corrección** (frente D del ciclo 9). Es lo que convierte *"lo veo jugando
     el juego"* de una intención en un mecanismo, y lo extiende a cualquiera que juegue, no
     solo al que mantiene el sitio. **Sin el botón, esta decisión es solo un riesgo asumido;
     con el botón es un método.**
  2. **Elegir los versos menos riesgosos** (`T-138`). De 1.784 candidatos se eligen 15. Una
     transcripción se equivoca más en una palabra rara, en un pasaje mascullado o en una
     línea que no rima; se equivoca poco en un estribillo repetido y rimado. No cuesta nada
     y baja el riesgo más que cualquier regla.
  3. **Mostrar la fuente en el juego** (`T-145`). Cuando el jugador se topa con un verso
     dudoso, ve de dónde salió. Un error con la fuente a la vista se lee como una
     transcripción floja; el mismo error sin fuente se lee como que el sitio no sabe.

- **Por qué `US-07` no necesitó esta decisión, aunque toma del mismo corpus.** Los dos juegos
  salen de las mismas transcripciones de fuente única y **no corren el mismo riesgo**. En
  `US-03` el jugador escribe la palabra que falta: si la transcripción está mal, el error es
  suyo aunque tenga razón. En `US-07` ve unos versos y adivina **cuál es el tema**, y una
  palabra mal transcripta no cambia de qué tema se trata. Por eso uno sale con una decisión
  encima y el otro sale sin discusión.

- **Qué la revierte.** Cualquiera de estas tres, y ninguna requiere volver a discutir:

  - **Que aparezca una segunda fuente fichada** para los temas del banco. Ahí `CTR-04.6`
    vuelve a cerrar sola, sin tocar nada: la vía de las dos fuentes ya está escrita.
  - **Que alguien haga los 26 minutos de escucha.** La hoja está generada y esperando.
  - **Que las correcciones que lleguen muestren que el corpus está peor de lo que se
    pensaba.** Si el botón trae errores seguido, la apuesta salió mal y lo va a decir el
    propio mecanismo — que es, en el fondo, para lo que sirve.

- **Consecuencias:**

  1. **`CTR-04.6` se rescribe** (`T-131`, `arquitectura`). La condición de estado pasa de dos
     vías a tres, y la tercera tiene que dejar rastro de cuál es: un ítem `listo` por fuente
     única no se puede confundir con uno confirmado de oído.
  2. **El frente D deja de ser un agregado y pasa a ser parte de la mitigación.** Si el ciclo
     se corta y el botón queda afuera, `US-03` sale con una pata menos. Anotado en el plan.
  3. **`producto` no tiene que bajar el piso de `US-03`.** Los 15 salen de sobra de 1.784
     candidatos; lo que faltaba era la vía, no el material.
  4. **Queda una deuda que esta decisión no toca:** los 21 temas de lacuerda.net siguen fuera
     del banco por no tener ficha. Con 80 temas alcanza, así que no se fuerza.

- **Dueños:** la decisión es del usuario. La regla corrible es de `arquitectura` (`CTR-04`);
  la elección de los versos, de `contenido`; el botón y lo que promete, de `producto`
  (`BR-21`) y del hilo principal.

---

## D-26 — La escalera se topea en los 10 segundos de los fragmentos reales

- **Fecha:** 2026-08-26
- **Estado:** aceptada — consecuencia directa de dos decisiones del usuario que chocan
  entre sí, resuelta a favor de la más nueva.
- **Contexto:** `D-24` fijó la escalera del reveal en seis pasos que terminan en **15
  segundos**, y `D-23` dimensionó los fragmentos en 15 s. Pero lo que llegó de verdad fue
  otra cosa: el **PR #8** trajo **95 fragmentos recortados a mano, de 10,06 s** (64 kbps,
  mono, CBR — medidos por `scripts/ingerir-fragmentos.mjs`), con el pedido de terminar el
  juego con ellos. Y `catalogo.ts` rechaza el manifiesto entero si un fragmento dura menos
  que el último paso de la escalera — ese chequeo existe justamente para que el escalón
  más caro no devuelva silencio.
- **Decisión:** el sexto paso baja de 15 a **10 segundos** (`0,1 / 0,5 / 2 / 4 / 8 / 10`)
  y `DURACION_FRAGMENTO_SEG` baja a 10, **mientras los fragmentos midan 10**. Entre una
  escalera que promete 15 y reproduce 10, y una que promete 10 y cumple, gana la que no
  miente — es la regla del rótulo de `D-14` aplicada a un botón de audio.
- **Lo que se pierde, dicho de frente:** el último salto ya no duplica (8 → 10 en vez de
  8 → 15). La lógica de "cada paso te da el doble" de `D-24` se conserva en los cinco
  primeros y se achata en el último. Es el costo de usar el material real en vez de
  esperar el ideal.
- **Qué la revierte:** regenerar los fragmentos a 15 s con `generar-fragmentos.mjs`
  (necesita ffmpeg y los masters). Son dos líneas en `escalera.ts` y una en su test;
  ningún dato migra, porque la escalera nunca vivió en el JSON (`CTR-03.4`).
- **Dueños:** la escalera es de `arquitectura` (`CTR-01.9`) y la tabla de puntaje de
  `producto`; el puntaje **no cambia** (100/80/60/40/20/10). Esta decisión solo toca
  segundos.

---

## D-27 — La dificultad de "Sacalo por la letra" se infiere de las escuchas

- **Fecha:** 2026-08-27
- **Estado:** aceptada — decisión directa del usuario. Textual: *"Las dificultades podes
  inferirlas de la popularidad de la cancion, con la informacion de escuchas que sacamos
  inferi las dificultades, sin escucha por ahora es difícil"*.

- **Contexto.** `REV-08` encontró (`FIND-29`) que `US-07` repartía la ronda con un barajado
  puro: **`dificultad` no se leía en ningún punto del código**, y los 89 temas estaban en
  `sin-clasificar` porque el archivo de curaduría que `CTR-09.7` preveía nunca se escribió.
  El que llegaba sin saber nada podía recibir el tema más oscuro del catálogo como primera
  pregunta — el muro de entrada que `D-09` y `BR-01` existen para impedir.

  La salida obvia era pedirle a `contenido` **89 juicios a mano** de "qué tan conocido es
  este tema". El usuario eligió la otra.

- **Decisión:** la dificultad sale del ranking de escuchas de `src/data/popularidad.json`.
  Los temas **con medición** se ordenan por vistas y se parten en tercios —`facil`, `media`,
  `dificil`—; un tema **sin medición es `dificil`**.

- **Por qué es mejor que la etiqueta a mano, y no solo más barato.** No es una idea nueva
  del proyecto: **`BR-18` apartado (f) ya había hecho exactamente esto para `US-02`** en el
  ciclo 8, con este argumento — una etiqueta manual de "qué tan conocido es" se corrompe
  sola y nadie la mantiene.

  Y acá encaja todavía mejor que allá: en este juego **"qué tan conocido es el tema" no es
  un proxy de la dificultad, es la dificultad**. Sacar *Ji Ji Ji* por un verso es fácil
  porque lo cantó todo el mundo; sacar un lado B de *Momo Sampler* es difícil por lo mismo
  al revés. La medición no aproxima lo que se quiere medir: lo mide.

- **Un detalle del reparto que no es obvio:** los temas sin medición **no entran al
  ranking**, se les asigna `dificil` directo. Si ocuparan lugar en los tercios, empujarían
  a los medidos hacia arriba y un tema de popularidad media pasaría a `facil` por el peso
  de los que nadie midió — la etiqueta diría "fácil" por un motivo que no tiene nada que
  ver con lo conocido que es el tema.

- **🔴 Lo que esta decisión produce hoy, y hay que decirlo en vez de festejar.**
  `popularidad.json` tiene los **105 temas en `sin-video` y cero mediciones**: la clave de
  YouTube (`YT_API_KEY`) nunca se cargó, así que la fase de resolución no corrió nunca.
  Con eso, la regla devuelve **`dificil` para los 89**, y el juego **sigue sin escalonar**.

  La diferencia con antes no es de funcionamiento, es de honestidad: antes el barajado era
  **accidental** —nadie había conectado la dificultad— y ahora es la **consecuencia
  declarada** de que falta un dato. El generador lo grita en cada corrida en vez de dejar
  que el tablero diga ✅.

- **Qué lo prende, y es un comando:**

  ```
  YT_API_KEY=... npm run ingerir-popularidad -- --resolver
  ```

  El día que eso corra, los tercios aparecen solos y `BR-01` empieza a cumplirse **sin
  tocar una línea de código**. Es la única cosa que separa a `US-07` de tener
  escalonamiento real.

- **Consecuencias:**

  1. **`CTR-09.7` cambia de eje.** El archivo de curaduría manual (`por-la-letra-curaduria.json`)
     deja de ser el camino previsto y no se escribe. `dificultadSegun` queda fijo en
     `'youtube'`, que era el "plan B declarado" del contrato y pasa a ser el plan A.
  2. **`sin-clasificar` deja de usarse** en la práctica. Sigue en el enum del schema: sacarlo
     obligaría a una versión de contrato por un valor que ya no se emite.
  3. **La cuota de fáciles de `US-07`** (mínimo 15 sobre el piso de 60) **no se cumple hoy**,
     y no se puede cumplir sin la clave. Es de `producto` decidir si eso frena algo — mi
     lectura es que no, porque `US-07` está fuera del "Listo" de la v1 por `D-05`.
  4. **Le sirve también a `US-02`**, que tiene la misma dependencia por `BR-18` (f). Una sola
     corrida de la clave destraba los dos juegos.

- **Dueños:** la decisión es del usuario. El ranking y su vigencia son de `BR-18`
  (`producto`); el reparto en tercios vive en `src/lib/por-la-letra/dificultad.ts` con sus
  cinco pruebas.

## D-28 — El reloj entra a "Adiviná el tema", corre callado, y la vuelta se comparte como tarjeta

- **Fecha:** 2026-08-27
- **Estado:** aceptada — pedido directo del usuario. Textual: *"Ademas arma el boton
  compartir que arme un link para jugar y la imagen de como le fue al jugador, mas que el
  puntaje es importante y divertido saber en cuanto tiempo y que temas adivino"*. Las tres
  bifurcaciones se le consultaron por separado y eligió las tres recomendadas.

- **Contexto.** `US-02` puntuaba una sola cosa: **cuánto audio necesitaste** (la escalera
  de `D-24`, topeada por `D-26`). Eso es la mitad del juego. La otra mitad es lo que
  cualquiera cuenta al salir de una partida —*la saqué al toque*— y no se medía en ningún
  lado. Compartir, además, era una línea de texto con un número: `160 de 400`. Nadie puede
  leer eso sin abrir el juego, y sobre todo **no dice qué temas salieron**, que es
  justamente lo que da ganas de contar.

- **Decisión, en tres partes.**

  1. **El reloj corre callado.** Se mide por tema, se muestra al revelar y se suma en el
     resultado, pero **no hay ningún número subiendo en pantalla mientras se juega**. La
     alternativa —un contador a la vista en la cabecera— es más deportiva y se descartó por
     `D-14`: un cronómetro corriendo convierte una partida de dos minutos en una prueba, y
     el que llega sin saber nada ya tiene bastante. El dato aparece cuando es premio, no
     cuando es presión.

     Dos reglas lo hacen honesto, y están en `src/lib/tema/reloj.ts` con doce pruebas: para
     cuando la pestaña se esconde (atender el teléfono no puede arruinar la vuelta) y mide
     **solo el tema, no la ficha** — leer la revelación es gratis.

  2. **El tema revelado viste la tinta real de su disco.** Los diez colores están
     muestreados de las tapas (`RES-37`), viven en `tokens.css` y los diez pasan AA sobre
     `--fondo`. Este juego no usaba ninguno: revelaba los 105 temas con el mismo naranja de
     Lobo suelto, que es el color de la **sección**, no del tema. Y acá el tema no es el
     contenido de la pantalla, **es la respuesta**.

     No contradice a `D-19`, que reparte un disco por **categoría**: la pantalla sigue
     siendo `mitologia` y la base no rota (fondo, grano, zona pulgar, acierto y error
     siguen igual). Lo que rota es la ficha del tema. El precedente ya estaba escrito en
     `tokens.css` para el cancionero: *"la misma idea llevada a su conclusión, no una idea
     nueva"*.

  3. **La vuelta se comparte en dos piezas que dicen lo mismo:** la dirección de siempre
     (`armarLink`, `ADR-02`, que es el molinete abierto) y **una tarjeta de 1080 × 1350**
     dibujada en el navegador con el setlist de la vuelta: qué temas salieron, cuánto audio
     hizo falta en cada uno y cuánto se tardó, con el tiempo total abajo de todo. Vertical y
     no apaisada porque lo que se manda por teléfono se mira en vertical; el apaisado
     `1200 × 630` sigue siendo el de la previsualización del sitio (`public/tarjeta.png`) y
     no se toca.

- **Consecuencias:**

  1. **La jerarquía del resultado se da vuelta.** El número grande de la pantalla pasa a
     ser **el tiempo**; el puntaje se queda, en su renglón, abajo. El setlist deja de ser
     una nota al pie y pasa a ser la pieza central.
  2. **Compartir puede fallar sin dejar a nadie afuera.** Si la tarjeta no se dibuja, se
     comparte igual sin ella; si no hay menú del sistema, se copia; si no hay portapapeles,
     la dirección queda escrita y seleccionable. Misma escalera que el botón de corrección.
  3. **La tarjeta no lleva ningún dato de la persona** — ni nombre, ni aparato, ni de dónde
     entró. Lo que no se junta no se puede filtrar (`armar.ts`, mismo criterio).
  4. **Sale un archivo nuevo de infraestructura, `src/lib/letra/discos.ts`.** La lista de
     los diez discos vivía en `temas.ts`, que importa `node:fs`; el navegador ahora la
     necesita. Ver `D-29`.

- **Dueños:** la decisión es del usuario. Los criterios de aceptación de `US-02` son de
  `producto`, y el pedido de actualizarlos quedó en
  `Docs/SUGERENCIAS/HILO-para-producto-reloj-y-tarjeta-US-02.md`.

## D-29 — Ninguna isla puede importar un módulo de Node, y ahora hay un test que lo mira

- **Fecha:** 2026-08-27
- **Estado:** aceptada — es la corrección de un defecto que produje construyendo `D-28`.

- **Contexto, que es el defecto.** `src/lib/tema/paleta.ts` necesitaba la lista de los diez
  discos y la importó de `src/lib/letra/temas.ts`, que la exportaba — y que **importa
  `node:fs` en su primera línea** porque parsea la ficha `RES-20`. En el navegador eso es
  fatal: el módulo queda afuera, la importación tira, y **con la isla muerta el juego entero
  deja de responder**. La portada quedaba dibujada y no pasaba nada al tocar un disco.

- **🔴 Lo grave no es el error, es quién no lo vio.** `npm test` pasó (en Node existe `fs`).
  `npm run check` pasó (los tipos estaban perfectos). `npm run build` no se quejó (la página
  es estática y sale igual). **Lo agarró abrir la página en un navegador**, que es
  exactamente la clase de verificación que este proyecto decidió no dejar librada a que
  alguien se acuerde de mirar.

  Es el mismo patrón que `REV-08` ya había señalado por cuarto ciclo: el defecto no estaba
  en ningún ítem, estaba en el conjunto — acá, en el grafo de importaciones.

- **Decisión, en dos partes.**

  1. **La lista se muda a un archivo hoja, `src/lib/letra/discos.ts`, que no importa nada.**
     `temas.ts` la re-exporta, así que nada de lo que ya la usaba cambió. No es un patrón
     nuevo: `temas.ts` ya lo había hecho con los normalizadores de texto, y con el mismo
     argumento escrito ahí. Lo que faltaba era aplicárselo a la lista de discos. **Sigue
     habiendo una sola lista.**
  2. **`src/lib/islas.test.ts` recorre el grafo de importaciones desde cada archivo de
     `src/scripts/` y falla si en el camino aparece un `node:*`.** No mira solo el archivo
     de la isla, mira **todo lo que alcanza** — que es lo que importa, porque `paleta.ts` no
     tenía una sola línea de Node y sin embargo lo traía. Informa el camino entero, no el
     archivo culpable: cuando esto falla, lo que hace falta saber es por dónde se llegó.

- **Consecuencias:**

  1. **Los `import type` no cuentan**, y está probado con un caso real. TypeScript los borra
     al compilar. La primera versión del test los contaba y acusó a `completar-la-letra` de
     arrastrar `node:fs` cuando lo único que importa de ahí son dos tipos. **Un guardián que
     grita por algo que no pasa se termina apagando, y con él se apagan los avisos que sí
     importan.**
  2. **El test se prueba contra un camino que existe de verdad** (`catalogo.ts`, que llega a
     `node:fs` en dos saltos). Un test que solo verifica ausencias no demuestra que sepa
     buscar, y se vuelve verde por vago sin que nadie se entere.

- **Dueños:** hilo principal. La regla que esto hace cumplir ya estaba escrita en
  `.claude/rules/codigo-juegos.md` ("arquitectura de islas") y en el encabezado de
  `temas.ts` ("corre en build y en los tests, nunca en el navegador"); lo que no había era
  con qué verificarla.

## D-30 — En el juego que se lee, el número grande son los versos y no el reloj

- **Fecha:** 2026-08-27
- **Estado:** aceptada — sale del ciclo estético de `US-07` que pidió el usuario ("el mismo
  ciclo estético" que `US-02`). Es la decisión que **se apartó** de copiar al hermano, y por
  eso está escrita.

- **Contexto.** `D-28` le puso reloj a "Adiviná el tema" y dejó el tiempo como el número
  grande del resultado, porque el usuario pidió saber *"en cuánto tiempo y qué temas
  adivinó"*. Al pedir el mismo ciclo para "Sacalo por la letra", lo obvio era portar
  `reloj.ts` y listo.

- **Decisión: no se porta el reloj.** El hermano **se escucha** y éste **se lee**, y eso
  cambia qué mide un cronómetro:

  - Allá el audio dura 0,1 segundos y después decidís: el reloj mide **decisión**.
  - Acá, en el cuarto escalón, hay que **leer ocho versos**. El reloj mide velocidad de
    lectura, que no es una habilidad de este juego. Cronometrarla castiga al lector lento
    por leer, y eso es cerrar un molinete (`D-14`) en la única pantalla del sitio hecha de
    texto.

  Lo que va en su lugar es la moneda propia del juego, la de `BR-20`: **con cuántos versos
  lo sacaste**. Es el equivalente exacto del "cuánto audio te hizo falta" del hermano, y
  además es un dato que el juego ya producía en cada tema **y tiraba** — lo único que
  sobrevivía a la vuelta era `puntaje`.

- **Consecuencias:**

  1. **La clase del bloque grande dejó de llamarse `reloj`.** Es `.cifra`, en los dos
     juegos: la maqueta es la misma, el dato no. Una clase llamada `reloj` conteniendo
     "40 versos" es una mentira esperando al próximo que lea.
  2. **La tarjeta compartible se volvió compartida** (`lib/tarjeta/plan.ts` y
     `scripts/tarjeta.ts`, antes `lib/tema/tarjeta.ts` y `scripts/tarjeta-tema.ts`). No
     sabe de qué juego es: recibe el nombre, el token que lo viste, y **un número grande
     con su rótulo**. Por eso el campo se llama `hero` y no `tiempo` — un módulo que
     hablara de milisegundos obligaría a este juego a inventarse un reloj que no le sirve.
  3. **El tramo se calcula sobre temas sacados, jamás sobre puntos.** Cinco de cinco
     sacados siempre en el último escalón dan 200 sobre 500 (40%), y el que los sacó todos
     se llevaría la línea del que sacó la mitad.

- **Dueños:** la decisión es del hilo principal, sobre el pedido del usuario. `BR-20` (la
  escalera de versos) es de `producto`; el reparto de registros por pantalla, de
  `experiencia`.

## D-31 — La hoja de versos es un recorte pegado que crece, y `UX-08` ya lo decía

- **Fecha:** 2026-08-27
- **Estado:** aceptada. **No es una idea nueva: es una spec de `experiencia` que llevaba un
  ciclo escrita y sin construir.**

- **Contexto, y es lo incómodo.** El hallazgo más grave del ciclo estético de `US-07` no
  fue un defecto de gusto: fue que `UX-08` §4 especificaba la pieza central del juego con
  todas las letras —*"la hoja entera es un recorte pegado, borde completo (las cuatro
  caras, nunca solo la izquierda), fondo `--fondo-elevado`, esquina de estampa"*, más *"un
  fino filete inferior separa cada renglón del siguiente"*— y lo que había en `juego.css`
  eran **tres propiedades de layout y ninguna de dibujo**.

  O sea: el juego se construyó, el tablero decía ✅, y la mitad visual de la hoja de
  `experiencia` no había entrado nunca. Es la misma clase de hueco que `REV-08` viene
  encontrando desde el ciclo 8 — el defecto no está en ningún ítem, está en el conjunto.

- **Decisión, en tres partes.**

  1. **Se construye la spec**: borde completo en el apoyo de Momo, fondo elevado, esquina
     de estampa, sombra dura desplazada, y filete por verso. El filete **no es adorno**: en
     este juego contar versos es contar el precio, y sin él un verso largo que envuelve se
     leía como dos versos, o sea como un intento gastado que no se gastó.
  2. **No se construye la rotación** que esa misma spec pedía. La hoja es el contenedor de
     scroll, no un recorte estático: un `transform` ahí crea bloque contenedor y complica
     el scroll. El borde teñido y la sombra ya son el recorte pegado.
  3. **Y se agrega algo que la spec no pedía: la hoja crece con los versos.** Estaba en
     `flex: 1 1 auto`, o sea que ocupaba toda la banda libre desde el arranque — medido,
     **545 px de recorte con un solo verso adentro**. Con `flex: 0 1 auto` y
     `margin-bottom: auto` toma el alto de su contenido y el buscador sigue clavado abajo.
     Y hace **literal** lo que `UX-08` §0 decía de la escalera: *"la barra no existe, los
     versos acumulados SON la barra"*. Si la hoja crece a cada escalón, la barra se dibuja
     sola con el contenido, sin dibujar ninguna barra. Medido: 63 → 106 → 216 → 385 px.

- **Consecuencias:**

  1. El aviso de escalón dejó de ser invisible: `.verso--nuevo` tiñe el filete de los
     versos que trajo el escalón en curso, y un rótulo vivo dice cuántos tenés. Ese rótulo
     **es además el nombre accesible de la hoja** — antes la hoja era `role="status"` con
     `aria-label`, así que al abrir cada tema el lector de pantalla anunciaba el contador
     **en vez del verso**.
  2. **La pieza más grande del tablero dejó de vestir el disco equivocado.** La lista del
     buscador tenía el borde de Lobo suelto en el juego de Momo Sampler; ahora cada tablero
     declara su `--tinte-lista`.

- **Dueños:** `UX-08` es de `experiencia` y no se tocó — se construyó. La única parte que
  se apartó de la spec (la rotación) está justificada arriba y queda anotada como tal.

---

## D-32 — El movimiento es del lugar, no del elemento

- **Fecha:** 2026-09-01
- **Estado:** aceptada. Ciclo 11, construida y verificada antes de escribirse acá.
- **Consume:** `UX-20` (la doctrina, de `experiencia`), `ADR-03` (el mecanismo del
  tránsito), `ADR-04` (la cama de cinta), `CNT-13` (los nombres del lugar), `D-14`
  (molinetes abiertos), `D-19` (la mezcla), `.claude/rules/diseno-marca.md`.

- **Contexto.** El usuario pidió que el sitio entero fuera una experiencia inmersiva, *"que
  cada paso se sienta como meterse en un universo mitológico misterioso"*. La medición del
  punto de partida es de dos líneas: **todo el sitio tenía dos movimientos** —los 120 ms del
  borde de una opción y el vuelo de la mosca— y **ni un solo token de movimiento**. El mundo
  estaba construido y no se movía.

  Y con el pedido venía una trampa: **casi todo lo que se hace cuando piden "inmersivo" ya
  estaba vetado en este repo.** El resplandor, el desenfoque, el degradado, la tarjeta que
  se levanta, el héroe que aparece con fundido, el micro-rebote. Un ciclo de inmersión sin
  doctrina era la corrida anti-slop al revés.

- **La decisión, en una línea:**

  > **Nada en este sitio se mueve para llamar la atención sobre sí mismo. Lo que se mueve es
  > la cámara: el aire, el fondo, la tinta, el paso de una pantalla a la otra.**

  Un botón que rebota es un botón pidiendo aplausos. Una sala que respira es un lugar.

- **Los cuatro límites que la vuelven ejecutable** (`UX-20` §1, con número):

  1. **400 ms** el paso más largo — y **200 ms** el cruce entre pantallas (`ADR-03` §6.2).
  2. **2 capas** de fondo como techo: el grano, que no rota nunca, más un recorte real
     velado. Tres capas dejan de tener un peor caso que `contraste.test.ts` pueda auditar.
  3. **0 ms** hasta que la acción principal es tocable. Es `D-14` aplicado a una animación:
     una pantalla que hay que esperar es un molinete nuevo, con forma de animación.
  4. **8 %** de recorrido máximo de una capa al desplazar.

- **Y la contracara, que es lo que hace creíble al resto: el misterio lo sostiene el rótulo
  frío.** `LEYENDA`, `TESTIMONIO`, la ficha `RES-` y las tres pantallas de registro 3
  —Bulacio, Olavarría, la muerte del Indio— **no se decoran, no se atmosferan y no suenan.**
  Un sitio donde todo es niebla no tiene misterio: tiene humo. El misterio necesita piso
  firme en algún lado, y el piso es el rótulo.

- **Lo que se construyó con esto, y por qué cada cosa pasó el filtro:**

  | Pieza | Se mueve | Por qué no es el elemento pidiendo aplausos |
  |---|---|---|
  | El umbral de la portada | el grano, la figura, el ángulo de la marca | ninguna de las tres es tocable, y la marca **llega ya estampada**: se endereza, no aparece |
  | El paso entre pantallas | la tinta entera | es la cámara bajando un escalón, no un elemento entrando |
  | La deriva de la franja | una sola capa fija, 8 % | es aire; adentro de una caja acotada descubriría su borde, y ahí no se puso |
  | La mosca | sigue volando | hace catorce ciclos que está ahí y es lo único vivo del sitio |
  | El borde de una opción | 120 ms | **no es atmósfera, es información**, y por eso es lo único que el corte de movimiento reducido no apaga |

- **Consecuencias, y la primera es la que más importa:**

  1. **El corte de `prefers-reduced-motion` dejó de ser una guillotina.** Era un `*` con
     `!important` que apagaba todo, incluida la respuesta al toque. Ahora **opera por familia
     de token**: se apaga la cámara, nunca el dedo. Era un P3 abierto desde el 2026-08-24.
  2. **Un tiempo suelto en un componente pasa a ser el mismo defecto que un hex suelto.**
     `src/lib/movimiento.test.ts` falla el build si aparece una duración o una curva fuera
     de `tokens.css`, si una animación no declara su equivalente quieto, o si alguien mete
     un enrutador de cliente.
  3. **El sistema de marca tiene hoja de movimiento** (hoja 12 del lienzo), y el circuito se
     respetó en el orden que manda: lienzo → `tokens.css` → componentes.
  4. **Lo que no se puede auditar a máquina queda dicho como se reconoce que falla**
     (`UX-20` §6): un elemento con animación propia que ningún otro comparte, un paso que
     pasa de 400 ms, y —la más barata y la más importante— que con el movimiento apagado el
     sitio diga **menos** que con el movimiento prendido.

- **Lo que esta decisión no dice.** No dice que el adentro de la partida tenga que moverse:
  el paso entre pregunta y devolución quedó fuera del ciclo a propósito, porque es el gesto
  que más se repite y donde un beat de más se paga cuarenta veces por vuelta. Si `REV-10`
  dice que la doctrina funciona afuera, el adentro es el ciclo siguiente.

---

## D-33 — El acierto es el único grito del sitio

- **Fecha:** 2026-09-02
- **Estado:** aceptada. Ciclo 12, construida y verificada antes de escribirse acá.
- **Consume:** `UX-22` (la doctrina, de `experiencia`), `RES-54` (cómo se imprime una
  serigrafía de verdad), `ADR-05` + `CTR-12` (las separaciones), `CNT-14` (las palabras de
  la imprenta), `D-32` (el movimiento es del lugar), `D-19` (la mezcla), `D-21` (el crédito
  de tapa), `RES-06` y `RES-37`.
- **La probaron:** `T-199`..`T-208`. La estampa por pasadas (`T-200`), el acierto que suena
  entero (`T-201`), la sala que se vuelve el disco (`T-202`), "dala vuelta" (`T-203`), la
  cinta que gira (`T-204`), la tirada como afiche (`T-205`), el zoom que se abre (`T-206`),
  el registro en toda la página (`T-207`) y el rodillo con la ficha estampada (`T-208`).

- **Contexto.** `D-32` convirtió el sitio en un lugar y dejó una cosa deliberadamente
  afuera: **el premio**. Cuando alguien sacaba un tema, la revelación era una ficha de
  texto —el título, la pista, los puntos, un botón—, correcta y sobria, y **la tapa no
  aparecía**. El jugador se llevaba el nombre del disco y no el disco. Y eso pasaba con las
  diez tapas ya en el repo, con su paleta medida píxel por píxel viviendo en `tokens.css`
  desde `RES-37`: todo el material de Rocambole bajado y fichado, y el momento en que más
  se lo necesita sin usarlo.

  El pedido del usuario fue textual: *"que te sorprenda la tapa cuando adivinás"*.

- **La decisión, en una línea:**

  > **El acierto es el único momento en que algo puede durar más de un paso y ocupar la
  > pantalla. No es un elemento pidiendo aplausos: es la sala volviéndose el disco.**

  Es la excepción de `D-32`, y es una sola. `voz-ricotera.md` §7 ya lo decía del texto
  —*"solo grita el acierto, que es un grito de verdad"*—; esto lo extiende al movimiento.

- **El techo, que es lo que impide que la excepción se coma la regla** (`UX-22` §1.1):
  cada pasada **≤ 400 ms**, la secuencia entera de cuatro compases —clara, media, clave, el
  fijado de la foto— **≤ 1200 ms**, y el fallo es **una sola tinta**. Los cuatro límites de
  `UX-20` siguen enteros: nada bloquea, nada retrasa el dedo, nada pisa un par testeado, y
  con el movimiento apagado la estampa aparece ya impresa y el sitio dice lo mismo.

- **Y la forma que toma: el sitio no se dibuja, se imprime.** `RES-06` dice cómo trabaja
  Rocambole —*"artesanal, con rodillo y serigrafía"*—. El ciclo 11 tomó el collage; este
  toma la serigrafía. La tapa que sacaste no se muestra: **se estampa por pasadas**, un
  color por vez, con el registro apenas corrido, sobre papel. Si no la sacaste, te queda en
  la tinta de la clave: lo que una imprenta te da cuando no pagaste el color.

- **Las tres cosas que separan esto de un "efecto de impresión" de biblioteca**, y las tres
  se verifican:

  1. **Los colores son los medidos de esa tapa** (`RES-37`), no una paleta. Los lee el
     taller de `tokens.css`, el único lugar del repo donde puede vivir un hex, y
     `pasadas.test.ts` falla si una separación deja de llevar el color de su disco.
  2. **El orden de las pasadas es el de una serigrafía de verdad** (`RES-54`), no el que
     queda lindo: clara, media, clave, y la clave última.
  3. **La clave sola del fallo es una decisión del juego** —te faltó el color—, no un
     estado a medio cargar.

- **Consecuencias:**

  1. **El registro imperfecto quedó como recurso permanente y estático** en la letra grande
     de todo el sitio (`UX-22` §8): un eco del texto corrido 2 px en el apoyo del disco de
     esa sección. **No es movimiento** —llega así desde el primer cuadro— y **no es la
     tinta que se lee**, así que no agrega un par a `contraste.test.ts`. Como es la única
     sombra que `diseno-marca.md` admite, es la más fácil de volver tic: `estilos.test.ts`
     la encierra en una lista cerrada de selectores y falla si toca un párrafo, un rótulo o
     uno de los tres artículos de tono grave.
  2. **La tapa entró en las dos puntas del juego de tapas.** `UX-13` §4 había dejado por
     escrito que el premio del formato splash es ver la obra entera después de adivinar por
     un pedazo, y que no se podía. Ahora se puede, y sin mecanismo nuevo: es el mismo de
     acá (`T-206`).
  3. **Nada de esto se estampa en un artículo.** `UX-20` §2 dice que un artículo no se
     mueve, y este ciclo no lo revisa: la ficha de disco de la Redondopedia gana el marco
     —papel, sello, registro— y llega así desde el primer cuadro. Lo que se estampa es el
     marco, nunca la fotografía de adentro.
  4. **No se inventó una letra que no existe.** Las fuentes fan que el sitio aloja cubren,
     verificado glifo por glifo, tres nombres de disco. Esos tres se estampan con su letra;
     los otros siete van en la rotulada, con su tilde real.

- **Lo que esta decisión no dice.** No dice que el quiz ni "Completá la letra" tengan que
  imprimir nada: ahí el premio es la explicación, y un ciclo que imprime tapas no tiene qué
  imprimirles. Tampoco toca la tarjeta que se comparte: `D-21` dice que una tapa afuera del
  sitio viaja sin su crédito, y lo que se imprime acá se imprime adentro.

---

## D-34 — Una capa de fondo es una pasada, no un campo

- **Fecha:** 2026-09-02
- **Estado:** aceptada. Ciclo 13, construida y verificada antes de escribirse acá.
- **Consume:** `D-19` (la mezcla), `D-21` (el crédito de tapa), `D-32` (el movimiento es
  del lugar), `D-33` (el acierto es el único grito), `UX-04` (la regla madre del despiece),
  `UX-20` §3.4 (las tres pantallas graves), `ADR-05.1` (la clave lleva `--fondo`),
  `RES-06` y `RES-54` (cómo se imprime una serigrafía).
- **La probó:** el ciclo 13 entero, y sobre todo la corrida de auditoría del 2026-09-02 que
  midió, pantalla por pantalla, dónde cortaba cada capa.

- **Contexto.** El pedido fue textual: *"que no quede duro ni cortado, que los fondos se
  integren bien"*. Medido antes de tocar nada, a 375×812, había dos cosas distintas y una
  era la causa de la otra:

  - **La franja del portal arrancaba en y=568 con una línea geométrica de x=0 a x=375.** El
    velo es un lavado plano —dos paradas idénticas— que vale lo mismo en el centro que en
    el último píxel, así que la multitud de *Oktubre* empezaba de golpe.
  - **Y la capa medía el alto del documento.** En `adivinar-el-tema`, `.tapa-fondo` salía
    343×1513 sobre un archivo de 591×381: `cover` la escalaba a 2347×1513 y se veía **el
    14,6 % de la tapa con un aumento de cuatro veces**. Una tira vertical borrosa de algo
    irreconocible, cuyo borde de abajo era otra línea recta.

- **La decisión.** Una capa de fondo **tiene una dirección, un principio y un final**. Los
  dos extremos de la pasada se apagan en mota; los costados los corta el esténcil. Si la
  pasada sigue de largo por un lado —se va de la ventana—, **ese lado no se desgasta**.

  Y el techo: una capa no puede medir más de una ventana. Lo que se estira con el documento
  deja de ser un lugar y pasa a ser una mancha.

- **Cómo se hace, y por qué no es un degradado.** La tabla anti-slop veta el degradado
  decorativo por nombre, y con razón. Lo que hay acá es una máscara de dos capas: un núcleo
  transparente hasta el 55 % de la franja de desgaste, y encima la veta de
  `--textura-rodillo`. **En la mitad exterior de la franja la única alfa que existe es la
  de la textura**, así que lo que se ve no es un desvanecido: es la racleta levantando. Es
  la misma decisión que ya había tomado `.rodillo` cuando eligió enmascarar `currentColor`
  en vez de dibujar una línea.

  Sin `mask-composite`, además, y no por pereza: sin operador declarado las capas se unen,
  que es exactamente lo que hace falta, así que un motor que no lo entienda no puede
  arruinarlo.

- **Lo que esto le da al sitio, más allá del borde.** El sitio es 80 % negro y ese negro no
  significaba nada: era el rectángulo muerto donde no pusieron nada. Con esta regla es **el
  papel donde no llegó la tinta**.

- **Consecuencias:**

  1. **El velo no se toca nunca.** `linear-gradient(var(--velo-tapa), transparent)` es la
     forma obvia de "integrar" un fondo y **pasa el test viejo por subcadena**, dejando
     media foto desnuda debajo del texto. El velo se queda plano y lo que se desvanece es
     el alfa de la capa entera. Hay un test nuevo que lo mira.
  2. **Enmascarar sólo puede mejorar el contraste.** El peso de la foto en el compuesto
     pasa de 0,14 a 0,14·m y nunca sube, así que el peor caso que mide `contraste.test.ts`
     sigue siendo el peor caso y no entra ni un par nuevo.
  3. **Es reposo, no movimiento.** No hay `@keyframes`, no hay tiempos, no hay curvas: la
     lista `ANIMACIONES` de `movimiento.test.ts` queda intacta y el corte de
     `prefers-reduced-motion` no tiene nada nuevo que apagar. Es del mismo material que
     `--registro`.

- **Lo que esta decisión no dice.** No dice que toda pantalla tenga que tener fondo: cinco
  no lo tienen y está bien que así sea. Y no habilita el campo fijo con desgaste en los
  cuatro bordes: eso es una viñeta, que es lo único en lo que esto se puede convertir si se
  usa mal. Ninguna máquina puede verificar esa diferencia — la sostiene esta entrada.

---

## D-35 — Toda pantalla termina en un pie de imprenta, y el crédito vive ahí

- **Fecha:** 2026-09-02
- **Estado:** aceptada. Ciclo 13, construida y verificada antes de escribirse acá.
- **Consume:** `D-19`, `D-21` (condición 1: la pantalla nombra qué tapas usó), `D-34`,
  `ADR-03` (el tránsito y su nombre único), `ADR-05.1`, `UX-04` (piezas sueltas, nunca la
  composición entera), `UX-20` §3.4, `D-33`.

- **Contexto.** El sitio terminaba donde terminaba su texto. Medido a 375×812: en
  `/juegos/dos-ejes/` el pie flotaba a media pantalla con **337 px de negro debajo** —el
  41 % de la ventana, por afuera de todo—, y `document.scrollHeight` daba 844 contra 812 de
  ventana: 32 px de arrastre que no llevaban a ninguna parte. Cinco pantallas no tenían
  ningún fondo y tres de ellas **declaraban por escrito, en su propio CSS, el disco que no
  vestían**.

  Y una capa de fondo apoyada sobre eso no tiene dónde apoyarse: por eso su borde de abajo
  siempre se leyó como una guillotina. El corte no era un problema de máscara.

- **La decisión.** El `body` es la mesa: columna flex de una ventana. La hoja crece hasta
  el pie. Y abajo, hermana de la hoja, hay una franja a sangre por los dos costados: la
  costura de rodillo, la segunda tinta de la serigrafía de su disco, una figura recortada
  que se corta contra el borde derecho, y el crédito impreso encima.

  **El crédito de `D-21` deja de ser una promesa y pasa a ser estructura**: la tapa y su
  crédito son el mismo componente, y no se pueden escribir por separado.

- **Va la `-media`, nunca la `-clave`.** Las tres razones son verificables en el repo:

  1. Las diez claves están teñidas con el valor de `--fondo` a propósito (`ADR-05.1`: *"el
     negro es del sitio"*), así que sobre el fondo del sitio dan 1:1 y no se ven.
  2. La clave es **la silueta de la composición entera de una tapa**, que es lo que
     `public/arte/README.md` prohíbe por escrito en su regla madre.
  3. La estampa completa es la carta que el sitio se guarda para el acierto (`D-33`). De
     empapelado se gasta.

- **Y no lleva `.tapa-fondo`.** La franja no muestra ninguna foto: la pasada entra como
  alfa y lo que llega a pantalla es un color medido de `tokens.css`. Eso deja como mucho
  **una `.tapa-fondo` por documento**, que es lo que el `view-transition-name: lugar` de
  `ADR-03` necesita para que el paso ocurra. En `/redondopedia/` había dos y el tránsito
  estaba apagado en silencio, justo en la ruta que más se cruza con el portal.

- **Las excepciones, declaradas:**

  1. **Los tres artículos de tono grave** (`SLUGS_GRAVES`) llevan la franja desnuda: sin
     pasada y sin figura. `UX-20` §3.4 les apaga la pantalla entera y
     `.claude/rules/voz-ricotera.md` §6 dice que ahí no hay voz que valga.
  2. **Las herramientas** —el armador de cancionero y el diagnóstico de audio— también: una
     herramienta no es una hoja impresa.
  3. **"Adiviná la tapa" va sin pasada y sin figura, y por un motivo que no es de tono**:
     el motivo de *Último bondi* es la respuesta correcta de `TP-006` y distractor en
     `TP-003` y `TP-009`. Una silueta de ese disco al pie del tablero le sopla la respuesta
     al que está jugando.
  4. **Oktubre va sin figura**: la única pieza calcada que hay de ese disco es la figura
     encadenada, y el despiece prohíbe atribuirle álbum *"ni en el crédito del pie"*
     (`INV-02`, reportado y no verificado).
  5. **Momo Sampler va con la banda casi sin pasada, y no es un error**: su `-media` cubre
     el 2,73 % de la lámina. Esa pantalla se sostiene con la costura y con el medallón.

- **El peso de la pasada no lo decide el gusto.** `contraste.test.ts` mezcla
  `--peso-pasada` con las diez tintas y falla si alguna deja el crédito por debajo de AA. Y
  falla **también por lo contrario**: si el salto sobre el fondo baja de 12 niveles de 255,
  porque una atmósfera que puede leerse como nada no es sutileza, es relleno con coartada.

- **Lo que esta decisión no dice.** No dice que la franja tenga que llevar la foto de la
  tapa: la tapa real sigue apareciendo donde una foto corresponde —la ficha del artículo,
  el zoom del juego, la estampa del acierto—. Y no saca la franja fija de *Oktubre* del
  portal: esa es la única imagen que hay sobre el pliegue de la pantalla de entrada, y
  cambiarla por un pie al que se llega desplazando era mal negocio.

## D-36 — El juego de ordenar no tiene colores de fila: tiene lugares de un recital

- **Fecha:** 2026-09-03
- **Estado:** aceptada. Ciclo 14, decidida antes de escribir una línea del juego y
  verificada con el juego construido.
- **Consume:** `D-09` (jugable con el pulgar, sin muro de entrada), `D-14` (molinetes
  abiertos), `D-17` (sin anglicismos), `D-19` (la mezcla: una sección viste un disco),
  `D-21` (la pantalla nombra qué tapas usó), `D-33` (el grito es del acierto),
  `BR-17`/`US-06` (el precedente del juego sin respuesta correcta), `BR-22`, `ADR-06`,
  `CTR-13`, `UX-23`.

- **Contexto.** El usuario pidió el juego de armar *tier lists* y compartirlas, con una
  instrucción explícita: *"investiga como funcionan en la web y como armar el tipico, no
  reinventes la rueda"*. La investigación se hizo (TierMaker y sus clones, el arrastre en
  táctil, cómo se comparte, qué rankean los fans de música) y trajo un choque que no era
  de gusto sino de significado.

  **El formato estándar pinta las filas de rojo a verde.** En este sitio `--acento-3` es
  el verde del acierto y `--acento-4` el rojo del error, los dos reservados por
  `.claude/rules/diseno-marca.md` y ya atados en `juego.css` a `.feedback.ok`,
  `.feedback.no` y a los tramos de victoria y derrota del quiz. Una fila verde arriba y
  una roja abajo **le dicen a cualquiera que ya jugó al quiz que la de arriba está bien**.

  Y esa es exactamente la afirmación que este juego no puede hacer. El sitio no tiene un
  orden correcto de los discos de esta banda; si lo tuviera, el juego dejaría de ser del
  jugador. Es el mismo criterio con el que `US-06` se negó a asignarles coordenadas a los
  105 temas: una posición fija por tema es una afirmación sobre la obra, y habría que
  defenderla tema por tema.

  Las letras del formato —**S A B C D F**— traen el mismo problema por otra puerta: son
  notas de boletín anglosajón, "F" es *fail*, y encima `D-17` veta el anglicismo.

- **La decisión, en tres partes.**

  **1. Las filas no tienen color. Tienen nombre, posición y contador.** Un sello de goma a
  la izquierda con el nombre, el borde completo teñido con el disco del juego —el mismo
  para las cuatro—, y el número de fichas. Ninguna de las cuatro se distingue de las otras
  por tinte. Se abren las cuatro a la vez cuando hay algo en la mano: destacar una sería el
  sitio opinando.

  **2. Las filas son lugares de un recital, no notas.** `CONTRA LA VALLA` · `EN EL MEDIO`
  · `ATRÁS DE TODO` · `EN LA VEREDA`, y la bandeja es `SIN UBICAR`. Un lugar ordena sin
  calificar: contra la valla se está más cerca que en el medio, y eso es geografía, no un
  juicio — nadie que se quedó atrás de todo *se equivocó*. Y es la imagen que este
  proyecto ya tiene en el centro desde `D-14`: los molinetes, la valla, el que entró y el
  que se quedó en la vereda.

  **Cuatro y no seis.** TierMaker trae seis porque es una fábrica de plantillas y quien la
  usa arma las suyas; acá el conjunto viene armado y las filas no se editan, así que el
  número lo decide otra cosa: cuántos lugares distintos hay de verdad en esa imagen. Hay
  cuatro, y ninguno se confunde con el de al lado. Un quinto —"en el pogo", "adelante"—
  obligaría al jugador a decidir si está más cerca o más lejos que la valla, y una fila
  cuyo orden se puede discutir no ordena nada.

  **3. Se toca, no se arrastra.** Tocás una ficha, tocás una fila. El arrastre queda como
  agregado para quien tiene mouse, llamando a la misma función.

- **Por qué no se arrastra, que es la parte que más parece un recorte y no lo es.** El
  arrastre de HTML5 tiene la API presente en iOS Safari y Chrome Android desde hace años,
  pero **ningún motor dispara `dragstart` con el dedo**: piden mouse, trackpad, lápiz o
  modo escritorio. O sea que "arrastrar en el celular" no es usar una función del
  navegador: es escribir un motor propio con Pointer Events, y con él `touch-action: none`,
  el clic fantasma del `touchend`, el desplazamiento automático de los bordes y
  `overflow-anchor`.

  Ese motor iría **encima de una vía sin arrastre que hay que escribir igual**, no en
  lugar de ella: WCAG 2.5.7 la pide, `D-09` dice "jugable con el pulgar", y `D-14` no deja
  poner un molinete nuevo con forma de gesto. Un juego que solo se puede jugar arrastrando
  le cierra la puerta a quien no puede hacer ese gesto — que es literalmente lo que este
  proyecto decidió no hacer nunca.

  De yapa, con botones el teclado y el lector de pantalla salen gratis, y el único atajo
  propio del juego es `Escape` para soltar lo que tenés en la mano.

- **Lo que sí se copia del formato, tal cual.** Bandas horizontales apiladas con la
  etiqueta a la izquierda; la bandeja de lo no ubicado debajo, con desplazamiento propio;
  sacar una ficha de una fila la devuelve a la bandeja y **nunca la borra**; el orden es
  100 % manual, sin sugerencia ni comparación por pares; y la salida es una imagen que se
  arma en el navegador y se baja. Eso es "no reinventar la rueda": la estructura es la del
  género y lo que cambia es lo que este sitio no puede decir.

- **Alternativas descartadas.**

  1. **La rampa rojo→verde con hexes medidos de `RES-37`.** Tentadora porque no inventaría
     ningún color. Descartada porque **lo que colisiona es el significado, no el hex**: en
     un sitio donde el verde ya significa acierto, un verde arriba de todo significa
     acierto aunque salga de la tapa de *Gulp!*.
  2. **Un disco distinto por fila.** Contradice `D-19` —una sección viste un disco— y,
     peor, **jerarquiza los discos entre sí**: pondría a Oktubre arriba de Momo Sampler por
     decisión del sitio.
  3. **S / A / B / C / D / F.** Ver arriba: notas, anglicismo, y "F" reintroduce el error.
  4. **Escribir el motor de arrastre táctil.** Ver arriba: cuatro trampas propias, encima
     de algo que hay que escribir igual, para un sitio de ratos sueltos.
  5. **Promedio de las listas de la gente** (los *Community Rankings* del formato).
     Necesita backend, que `D-15` cerró, y **sería el orden correcto que `BR-22` prohíbe**
     entrando por la puerta de atrás.

- **Consecuencias.**

  1. `voz.test.ts` suma `tier`, `list` y `top` al glosario de `D-17`. Hasta este ciclo
     "tier list" **pasaba el build**.
  2. `estilos.test.ts` verifica que el bloque del juego no use `--acento-3` ni `--acento-4`
     y que ninguna regla de fila pida tinta de disco. La barra de acento lateral —el
     significante del formato— ya rompía el build por la regla anti-slop.
  3. El juego viste **¡Bang! ¡Bang!… Estás liquidado**, el último de los diez discos que
     ninguna sección había tomado. *Cordero atado* quedó afuera porque `RES-37` lo midió
     junto con *Lobo suelto* y comparten hex; *Un baión*, porque su celeste choca con
     `--rotulo-testimonio`, que no rota.
  4. `D-33` no le presta el grito: no hay estampa por pasadas al terminar, porque no hay
     acierto. Lo que hay es una lámina, que llega ya impresa.
  5. El crédito de `D-21` se imprime **adentro de la lámina** —dice lo que hay en esa
     imagen y no lo que suele haber—, cerrando el caso que `D-33` había dejado abierto: una
     tapa que sale del sitio viajaba sin su firma.
