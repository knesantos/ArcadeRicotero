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
