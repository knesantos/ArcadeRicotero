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
  **Cerrada por `D-74` (2026-10-17):** el proyecto se mudó a una cuenta Hobby.

## D-16 — El producto se llama Arcade Ricotero

- **Fecha:** 2026-08-20
- **Estado:** aceptada — decisión directa del usuario, en la sesión del sistema de marca.
  **El nombre lo reemplazó `D-60` (2026-10-04): el sitio se llama Fichín Ricotero.**
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

---

## D-37 — La cinta pasa a poner temas, y de sus cinco candados caen dos

- **Fecha:** 2026-09-11
- **Estado:** **reemplazada por `D-50`** (2026-10-01: la cinta y la rocola se sacaron del
  sitio). Era: aceptada. Ciclo 14, decidida en `ADR-07` antes de escribir una línea y
  construida en `T-217`/`T-218`.
- **Consume:** `D-14` (molinetes abiertos, riesgo asumido), `D-22` (el sitio sirve los temas
  enteros en mp3), `D-23` (el audio en dos niveles), `D-26` (la escalera del reveal), `D-29`
  (ninguna isla arrastra `node:*`), `ADR-03` (tránsito entre documentos), `ADR-04` (la cama
  de cinta y sus cinco candados), `ADR-07`, `CTR-14`, `UX-21`, `UX-26`, `RES-50`.

- **Contexto.** El usuario pidió, textual: *"que encender la cinta toque uno de los temas al
  azar de los redondos con el filtro vintage, uno de los temas enteros, cuando no haya mas
  que ponga los recortes enteros y cambiando entre tema y tema haga un ruido como cambia el
  vinilo o el cassete medio vintage"*.

  Hasta el ciclo 13 la cinta era **ruido sintetizado**: cero archivos, cero bytes prendida o
  apagada, y adentro de un `Math.random()` filtrado no hay obra de nadie. `ADR-04` había
  dejado sus cinco candados escritos **con nombre**, y la instrucción de que quien afloje
  uno sepa cuál está aflojando. Este pedido afloja dos.

- **Decisión.**

  1. **El candado 2 ("cero archivos") cae, pero cae la mitad.** Apagada, la cinta sigue
     transfiriendo **cero bytes**, y la rocola **no agrega un solo archivo al repo**: usa los
     que ya están, los recortes de `US-02` y los temas enteros de `D-22`. Lo que cae es
     "prendida = cero bytes". La mitad que queda importa: un mp3 de siseo sigue prohibido, y
     ese es el argumento que hay que poder defender mañana.
  2. **El candado 4 ("no lleva información") cae en su letra y se conserva en su
     consecuencia.** El que prende una rocola quiere saber qué suena, y `UX-26` lo resuelve:
     el título y si es recorte o completo. **Nunca el disco** — hay diez discos contra
     noventa y cinco temas, así que nombrarlo soplaría una respuesta de "Adiviná la tapa"
     casi diez veces más fuerte.
  3. **Los candados 1, 3 y 5 se quedan**, y el 3 se refuerza: además de callarse cuando algo
     suena, ahora hay que preguntar antes **si esta ruta puede oír un tema**.
  4. **Una pantalla de juego no pone temas. Ninguna, sin excepción.** No se discute juego por
     juego si su respuesta es soplable: `dos-ejes` no tiene respuesta correcta y
     `ponelos-en-fila` no tiene orden correcto, y van igual, porque uno de sus conjuntos son
     doce temas sorteados. Afinar el criterio caso por caso significa que el octavo juego
     llegue con una discusión en vez de con una respuesta.
  5. **Ahí vuelve la cama, no el silencio.** La cama no puede soplar nada y cuesta cero
     bytes. Apagar la cinta entera en los juegos sería sacarle a la gente algo que ya tenía y
     que no molesta a nadie: molinete al revés.
  6. **La lista es blanca, y hay un censo que rompe el build.** Un juego nuevo nace mudo, y
     una página que nadie clasificó hace fallar `rutas-sonoras.test.ts` con el nombre del
     archivo. No se agrega sola, pero tampoco puede pasar de largo.
  7. **Se transmite, no se decodifica**, y no se precarga nunca. Un tema de cuatro minutos en
     `AudioBuffer` son decenas de MB de RAM en un teléfono, y son 3–4 MB de red en un sitio
     que promete partidas de dos minutos.

- **Por qué no lo contrario.** Apagar la cinta entera en los juegos era más simple de
  explicar y peor para la gente. Una lista negra era más corta de escribir y deja al juego
  nuevo naciendo sonando, con el error descubriéndose jugando. Y decodificar habría reusado
  el motor que ya existe, al precio de que el navegador mate la pestaña en el teléfono de
  alguien.

- **Consecuencias.**
  1. **El argumento de que la cinta era una pieza intocable se termina acá.** Estaba apoyado
     en el candado 2, y el candado 2 ya no está entero. Queda escrito para que dentro de dos
     meses no se cite como si siguiera en pie.
  2. `ADR-04` **no se versiona**: sigue vigente y describe la cama, que no cambió una
     constante. `ADR-07` es la capa de arriba.
  3. Apareció una hoja nueva, `src/lib/audio/rutas-de-audio.ts`, porque la rocola necesitaba
     saber dónde vive el audio y traerlo de `tema/audio.ts` **cruzaba la flecha** que `ADR-04`
     había puesto entre los dos motores. Lo cazó el test que ese ADR dejó puesto.
  4. El riesgo número uno del ciclo no es técnico: es que el mapa de rutas salga corto en una
     ruta y el sitio le sople la respuesta al que se sabe el tema. Por eso el mapa es parte de
     la decisión y no del código, por eso hay una prueba que falla si suena donde no debe, y
     por eso `T-225` lo mira ruta por ruta en vez de confiar en el test.

---

## D-38 — Dos personas vivas se pueden dibujar, y hay tres barandas que dicen hasta dónde

- **Fecha:** 2026-09-11
- **Estado:** aceptada. Decidida por el usuario sobre el relevamiento `RES-64`, con la
  medición legal sobre la mesa.
- **Consume:** `D-14` (los molinetes abiertos, y el "si llega un reclamo se baja"), `D-17`,
  `RES-04` (la muerte del Indio, 5-jun-2026), `RES-09`, `RES-64` entero
  (`INV-60-skayboy-poligirl.md`), `BR-15` consecuencia 1, `IDEA-14`, y la sección 1 de
  `.claude/rules/voz-ricotera.md`.

- **Contexto.** `IDEA-14` propone un juego cuyos dos personajes son **Eduardo Beilinson y
  Carmen Castro**, personas reales, vivas, de 74 y 75 años, dibujadas como muñecos con sus
  apodos por nombre. El relevamiento midió lo que hay debajo y no es lo que la intuición
  dice:

  - *"Sin fines de lucro no pasa nada"* es medio cierto, y por eso peligroso. Es cierto para
    el art. 31 de la ley 11.723, que se dispara con el **retrato fotográfico puesto en el
    comercio**: un dibujo gratis no lo activa. **No** es cierto para el art. 53 del Código
    Civil y Comercial, que dice "de cualquier modo que se haga" y no menciona fin comercial.
  - Y es directamente falso para el que importa: **el art. 71 inc. c está redactado para
    este caso exacto** — el nombre de una persona usado *"para la designación de cosas o
    personajes de fantasía"* —, solo exige **perjuicio**, y el Código vigente **eliminó el
    requisito de malicia**. No pide lucro. El art. 72 remata: el **seudónimo notorio** goza
    de la tutela del nombre, así que "Skay" y "la Negra Poli" no son apodos sueltos —usar
    el apodo **sube** el riesgo, no lo baja, porque es justo aquello por lo que se los
    identifica sin confusión.
  - **La parodia no es defensa legislada en Argentina** (`RES-64.18`). "Es un homenaje
    cariñoso" es un argumento de tono, no jurídico.
  - Y el dato que más pesa y no es legal: **estas dos personas concretas ya reclamaron**
    por uso no autorizado de su propia marca compartida, en 2020, contra el Indio
    (`RES-64.13`).

  **Por qué `D-14` no alcanza, y esto es lo único nuevo de esta decisión.** Todo el
  andamiaje de "si llega un reclamo, se baja y listo" está calibrado para el reclamo de un
  **titular de una obra**, a quien bajar el sitio le devuelve lo suyo. Acá el reclamante
  posible es un hombre que salió a tocar en agosto y su mujer, y lo que estaría en juego es
  **su nombre**. Bajar el sitio no le devuelve nada a quien se sintió mal representado. Es
  la misma excepción que `BR-15` consecuencia 1 ya escribió para la licencia del motor,
  entrando por otra puerta: **hay un segundo chequeo previo que `D-14` no cubre.**

- **Decisión.** Se autoriza usar el nombre, el apodo y la caricatura de Eduardo Beilinson y
  Carmen Castro como personajes de `IDEA-14`. **Con tres barandas, y no son de estilo:**

  1. **El personaje nunca dice "yo".** Sin bocadillo, sin cartel en primera persona, sin
     frase con su firma. Un sprite que corre y salta no habla, y por eso no es lo que veta
     la sección 1 de `voz-ricotera.md`; una línea atribuida sí lo sería, y envenena el
     rótulo `testimonio` de todo el sitio. El muñeco puede gruñir, no puede opinar.
  2. **Se dibuja por insignia, no por parecido.** Sombrero, pelo atado, SG roja: cosas que
     él exhibe ante cámaras todas las noches. Cuanto más se parezca el sprite a la insignia
     y menos a la cara, más lejos queda del derecho a la imagen.
  3. **Nada narra la relación real entre Skay, Poli y el Indio.** Ni por mecánica ni por
     texto. Que resuelvan un nivel juntos es mecánica; que se peleen, se separen o que uno
     abandone al otro es contar la historia real de tres personas, una de las cuales murió
     hace tres meses. Y **Poligirl no es la compañera de Skayboy**: el propio sitio publica
     sobre ella, rotulado `hecho`, que fue *"un pilar, con el mismo rango que la voz y la
     guitarra"*. Paridad de peso, de pantalla y de agencia — que es distinto de simetría de
     habilidades, porque el género existe justamente porque los personajes son asimétricos.

  Y un pie en registro 3, seco, en la pantalla del juego: que es un homenaje de fans, que
  no es oficial, y que ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver.

- **Alternativas descartadas.** **Nombrarlos solo por sus emblemas**, sin los nombres:
  sacaba el art. 71 de la mesa y conservaba casi todo el chiste, pero costaba el título del
  juego, que es lo que el usuario pidió textual. **Esperar**: deja la idea guardada sin
  costo, y el usuario decidió con la medición delante.

- **Consecuencias.**
  1. **El riesgo real no es que demanden: es que lo vean y les moleste.** Eso no lo mide un
     abogado, lo mide el tono. Las tres barandas son el instrumento de medición.
  2. **Hay una asimetría entre los dos que la ley no distingue y el criterio sí.** Skay sube
     a un escenario; Poli construyó cincuenta años de perfil bajo deliberado, y su método
     era el aislamiento mediático. El único dato jugoso que circula sobre ella está
     contradicho entre fuentes (`RES-64.11`, rotulado **leyenda**) y el juego no se apoya en
     ningún vínculo sentimental, bajo ningún concepto.
  3. **Queda una pregunta sin dueño y es de diseño, no de derecho:** un plataformas mata al
     jugador decenas de veces por partida. Nadie decidió todavía qué registro rige la muerte
     repetida del muñeco de alguien que está vivo, ni si el fracaso puede ser otra cosa que
     muerte. Es de `experiencia`, antes de dibujar la primera animación.

---

## D-39 — El juego de plataformas suena entero, y es la primera excepción a `D-37`

- **Fecha:** 2026-09-11
- **Estado:** **reemplazada en parte por `D-50`** (2026-10-01): el tema fijo sobre la cinta se
  fue con la rocola; los efectos de sonido siguen. Era: aceptada. Decidida por el usuario el mismo día que `D-37`, con la advertencia
  sobre la mesa.
- **Consume:** `D-37` punto 4, `D-22` (el sitio sirve los temas enteros en mp3), `D-14`,
  `ADR-07` y `CTR-14` (`ARQ-rocola.md`), `BR-15` consecuencia 3, `IDEA-14`, `D-38`.

- **Contexto.** `D-37` punto 4 se escribió esta misma mañana y dice, sin rodeos: *"Una
  pantalla de juego no pone temas. Ninguna, sin excepción."* El fundamento no era el
  derecho —`D-22` ya alojó los temas— sino **no soplarle la respuesta al que está
  jugando**, y sobre todo **no discutirlo juego por juego**: *"afinar el criterio caso por
  caso significa que el octavo juego llegue con una discusión en vez de con una
  respuesta."*

  Y el octavo juego llegó esa misma tarde. `BR-15`, la regla que gobierna los clones, fue
  escrita sobre una instrucción del usuario cuya segunda mitad era literal: *"ponerle un
  skin y **música redonda**"*. Las dos reglas son del usuario y se contradicen en este
  caso puntual.

- **Decisión.** `IDEA-14` **suena**: un tema entero de los Redondos durante la partida.
  Es una excepción declarada a `D-37` punto 4, para este juego y para el tipo de juego que
  representa — **el que no tiene una respuesta que soplar porque no hay nada que adivinar**.

  Tres condiciones, que salen del fundamento de `D-37` y no se negocian por separado:

  1. **Se transmite, no se decodifica, y no se precarga nunca** (`D-37` punto 7). Un tema de
     cuatro minutos en `AudioBuffer` son decenas de MB de RAM en un teléfono. Esa parte de
     `D-37` no se toca: es la que evita que el navegador mate la pestaña.
  2. **La ruta entra al censo igual que todas.** `modoEnRuta()` devuelve `cama` por defecto y
     `rutas-sonoras.ts` rompe el build con el nombre del archivo si nadie la declara. La
     excepción se escribe **ahí**, a la vista, nunca como un caso especial escondido en la
     isla del juego.
  3. **El tema no se nombra en pantalla durante la partida si eso sopla algo de otro juego.**
     Es la misma cautela que `UX-26` ya resolvió para la rocola: título sí, disco nunca,
     porque hay diez discos contra noventa y cinco temas.

- **Alternativas descartadas.** **Solo efectos de sonido** —salto, muerte, puerta— y ningún
  tema: era lo más barato, no tocaba `D-37` y era mi recomendación. **Mudo como los otros
  siete**: cero trabajo y cero decisiones, al precio de que la mitad del pedido original de
  `BR-15` no se cumpla nunca.

- **Consecuencias, y la primera es un costo que conviene mirar de frente.**
  1. **Se reabre la discusión caso por caso que `D-37` existe para cerrar.** Y el precedente
     ya es incómodo: **`dos-ejes` pidió esta misma excepción con este mismo argumento** —"no
     tiene respuesta correcta, no hay nada que soplar"— y `D-37` se lo negó por escrito, en
     su propia tabla. Hoy hay dos pantallas con el mismo fundamento y distinta respuesta. O
     el criterio se vuelve a escribir para que diga qué separa a una de otra, o el noveno
     juego llega con la discusión que `D-37` quería evitar. **Esto no lo resuelve esta
     decisión: lo deja anotado como deuda, con nombre.**
  2. **Los efectos de sonido siguen sin cubrir.** Un efecto de 200 ms no es un tema, no es la
     cama y no es un fragmento de `CTR-01.3`. `D-37` punto 7 prohíbe `decodeAudioData` sobre
     un tema entero y no dice nada de un sample corto. De dónde salen, quién los produce y si
     se decodifican es de `arquitectura`, y está traspasado en
     `Docs/SUGERENCIAS/HILO-para-arquitectura-el-motor-y-el-sonido-del-juego.md`.
  3. **Falta elegir el tema, y no es un detalle de producción.** `IDEA-04` ya tiene el suyo
     (*Gualicho*, porque el verbo del juego está cantado adentro). Acá el par elemental es
     cielo/infierno, así que el candidato natural sale de esa familia. Es de `contenido` con
     `experiencia`.
  4. **El peso deja de ser despreciable.** El arte de un plataformas no movía la aguja contra
     los límites de Vercel; un tema entero sonando en cada partida sí toca la transferencia
     que `RES-50` y `RES-15` acotan. Hay que medirlo antes de publicar, no después.

---

## D-40 — Un acompañante también es un molinete: el juego se puede jugar solo

- **Fecha:** 2026-09-11
- **Estado:** aceptada. Decidida por el usuario sobre la pregunta abierta 4 que `producto`
  dejó en `PRD-backlog-ideas.md`.
- **Consume:** `D-14` (los molinetes abiertos), `D-08`, `D-09`, `D-15`, `D-38`, `D-39`,
  `RES-65.1`, `RES-65.3`, `RES-65.4`, `IDEA-14`, `BR-01`.

- **Contexto.** `IDEA-14` se juega **de a dos en un teléfono en horizontal**: cada uno agarra
  una punta y usa los botones de su lado. Es lo que el usuario eligió para conservar el
  corazón cooperativo del género.

  `producto` levantó lo que eso arrastra, y es la mejor objeción que salió de toda la sesión:
  **si el juego pide una segunda persona para poder jugarse, el que llega solo por un enlace
  no juega.** `D-14` nombra por su nombre lo que no se le pide a nadie para entrar — cuenta,
  login, Premium, saber lo suficiente. **Un acompañante no está en esa lista, pero tiene
  exactamente la misma forma:** algo que el jugador tiene que aportar para poder pasar.

  Y este sitio se llega por un enlace compartido. Esa es su forma de circular.

- **Decisión.** El juego tiene **las dos puertas**: de a dos en horizontal, como está
  decidido, **y además un camino para uno solo**, con el botón de cambio de personaje — el
  inactivo queda quieto y a salvo donde lo dejaron.

  No es un invento para tapar el agujero: **es exactamente cómo resuelve este mismo problema
  la versión móvil oficial del juego de origen** (`RES-65.1`, su FAQ dice que en un teléfono
  se juega alternando), y *The Lost Vikings* y *Trine* muestran que el patrón aguanta puzzle
  y acción (`RES-65.3`, `RES-65.4`).

- **Alternativas descartadas.** **Declararlo de a dos y avisarlo antes**, en registro 3, como
  el sitio ya avisa cuánto dura un fragmento: honesto, barato, y no duplicaba nada. Se
  descartó porque avisar que hay un molinete no lo abre — deja al que llegó solo mirando la
  puerta con un cartel bien redactado.

- **Consecuencias.**
  1. **El diseño de niveles se duplica.** Cada nivel tiene que ser resoluble de las dos
     maneras: con dos personas moviéndose a la vez, y con una sola alternando. Eso prohíbe
     por construcción el puzzle que **exige** simultaneidad —el salto sincronizado, la
     plataforma que solo aguanta si los dos saltan juntos— salvo que tenga una segunda
     solución para el que juega solo. **Es una restricción de diseño, no una preferencia**, y
     va escrita antes de que se dibuje el primer nivel porque después sale carísima.
  2. **El piso de niveles no sube, pero el trabajo por nivel sí.** La lectura de `producto`
     —seis niveles, 2/2/2— sigue en pie; lo que cambia es que cada uno se verifica dos veces.
     El piso definitivo se fija al promover a `US-XX` (`BR-16`).
  3. **Hay que decidir cuál de los dos modos es el que se ofrece primero**, y eso es de
     `experiencia`: el que llega solo no tiene que elegir un modo antes de jugar, porque
     elegir un modo es una pantalla previa y `D-32` límite 3 no la deja.
  4. **Queda dicho para todo lo que venga:** un juego de este sitio no puede necesitar a otra
     persona para arrancar. Es la extensión natural de `D-14` al único caso que no estaba en
     su lista.

---

## D-41 — Pixel adentro, imprenta afuera: el sitio es un fichín, no una pantalla suelta

- **Fecha:** 2026-09-16
- **Estado:** aceptada. El usuario trajo la hoja de sprites y eligió esta salida sobre las
  otras dos.
- **Consume:** `D-18`, `D-19`, `D-21`, `D-33`, `D-38`, `UX-04`, `UX-20`, `UX-22`, `RES-06`,
  `IDEA-14`, `.claude/rules/diseno-marca.md`, `public/arte/README.md`.

- **Contexto.** `IDEA-14` necesita sprites, y el usuario produjo la hoja
  (`public/arte/skayboy_poligirl.png`, 1299×725): **pixel art 8 bits**, con las poses de
  quieto, correr, saltar y caer para los dos personajes.

  Eso choca con lo único que el sistema visual no había tenido que negociar nunca. El
  README de `public/arte/` manda *"PNG con fondo transparente, borde tipo tijera
  (irregular, con grano — **nunca vector liso**)"*, y `diseno-marca.md` resuelve todo en el
  idioma de la serigrafía: tinta plana, borde grueso, registro corrido. **El pixel art no es
  ninguno de los dos.** No es serigrafía y tampoco es el vector liso que la regla veta: es
  un tercer idioma, con su propia tradición y su propia honestidad — la grilla se ve, como
  se ve la trama de una serigrafía.

- **Decisión. La frontera es la pantalla de juego, y la metáfora no es decorativa: es un
  fichín.** Un fichín de verdad son dos cosas distintas pegadas: **un tubo que muestra
  píxeles** y **un mueble serigrafiado** alrededor. Acá igual.

  1. **Adentro del área de juego manda el pixel art.** Sprites, tiles, charcos, puerta,
     coleccionables. Grilla visible, paleta acotada, sin antialias: `image-rendering:
     pixelated` y escalado por múltiplos enteros, o el píxel se ensucia y deja de ser un
     idioma para pasar a ser un archivo mal escalado.
  2. **Afuera manda la imprenta, sin cambiar una coma.** El marco, el pie, los rótulos, los
     casetes del portal, la tarjeta al compartir, los botones y el HUD que vive fuera del
     área de juego siguen siendo `UX-22`: tinta plana, borde de tijera, sello de goma.
  3. **La frontera se ve.** El área de juego es un recorte con borde, como todo lo demás del
     sitio — no un `<canvas>` a sangre contra el borde de la ventana. El píxel está
     **adentro de** algo impreso, y esa es justamente la idea.
  4. **Los dos idiomas no se mezclan en la misma pieza.** Ni un sprite con borde rasgado ni
     un sello de goma pixelado. Cada pieza es de un lado de la frontera o del otro.

- **Alternativas descartadas.** **Que el pixel art mande en todos los juegos**: más simple
  de ejecutar, pero parte el sistema visual en dos mitades que no se hablan y obliga a
  explicar dónde está la frontera en cada pantalla nueva — que es el problema que esta
  decisión resuelve de una vez. **Redibujar los sprites en serigrafía**: el ensayo del
  2026-09-11 probó que se puede (`public/arte/ensayo/`), pero costaba redibujar catorce
  piezas que el usuario ya produjo, y perdía lo que el pixel art le da a un juego de
  plataformas: legibilidad a 32 px, que es justo donde el ensayo flaqueaba.

- **Consecuencias.**
  1. **`public/arte/README.md` deja de valer para todo y pasa a valer para el collage.** Hay
     que escribir la convención del pixel —grilla, paleta, tamaño de tile, alfa— al lado de
     la del recorte, y decir cuál rige dónde. Es de `experiencia` (`UX-04`).
  2. **El ensayo del 2026-09-11 queda como registro, no como camino.** Contestó su pregunta
     —se podía— y la respuesta dejó de ser la que se usa. No se borra.
  3. **Aparece un problema de contraste que el sitio no tenía.** `contraste.test.ts` mide
     pares declarados en CSS; adentro del área de juego el fondo es un tileset. Sigue sin
     vara corrible, y ahora con más superficie. El mecanismo lo debe `experiencia`, como el
     velo plano de `D-21`.
  4. **El píxel entra por el juego, no por la marca.** Ni el logo, ni los títulos, ni la
     tarjeta compartible se pixelan. Si algún día se quiere eso, es otra decisión.

---

## D-42 — La baranda 2 de `D-38` se enmienda: los muñecos tienen cara

- **Fecha:** 2026-09-16
- **Estado:** aceptada. **Enmienda `D-38`**, que no se versiona ni se borra: sigue vigente
  entera salvo su baranda 2, que esta decisión reemplaza.
- **Consume:** `D-38`, `D-14`, `RES-64` (`INV-60`), `D-41`, `IDEA-14`.

- **Contexto.** `D-38` autorizó dibujar a dos personas reales y vivas, con tres barandas. La
  segunda decía, textual: *"se dibuja por insignia, no por parecido facial. Sombrero, pelo
  atado y SG roja son cosas que él exhibe ante cámaras; cuanto más se parezca el sprite a la
  insignia y menos a la cara, más lejos queda del derecho a la imagen."*

  La hoja de sprites que trajo el usuario el 2026-09-16 **no cumple esa baranda**: los dos
  personajes tienen cara, y las dos cabezas de perfil son caricaturas reconocibles — la
  propia hoja rotula *"Nariz Aguileña"*. Se le planteó el choque con las tres salidas
  posibles y eligió enmendar.

  **Por qué la enmienda se sostiene, y no es solo "el usuario quiso".** La baranda 2 no era
  un principio: era una **estimación de riesgo**, y estaba escrita como tal. El razonamiento
  legal de `RES-64` sigue intacto y no cambia: el art. 71 inc. c del Código Civil y
  Comercial protege el nombre usado para designar personajes de fantasía y solo exige
  perjuicio; el art. 72 extiende la tutela al seudónimo notorio; la parodia no es defensa
  legislada en Argentina. Nada de eso se movió. Lo que se mueve es la lectura de dónde está
  el perjuicio: **el nombre ya está en el título del juego**, así que la cara no agrega
  identificación que el nombre no haya dado antes. Y `RES-64` ya había cerrado que el riesgo
  real *"no es que demanden: es que lo vean y les moleste"*, y eso lo mide el tono, no la
  nariz.

- **Decisión.** **La baranda 2 de `D-38` queda reemplazada por esta:**

  > **Se dibuja con cara, en caricatura declarada, y el tono es la baranda.** El muñeco
  > puede ser reconocible. Lo que no puede ser, nunca, es **denigrante, ridiculizante ni
  > sexualizado** — que es el eje que `RES-64.19` identificó como el que separa los fallos
  > permisivos del que terminó en resarcimiento, junto con el lucro, que acá no existe.

  Tres precisiones que la enmienda arrastra:

  1. **El pie en registro 3 pasa de conveniente a obligatorio.** Con cara, el aviso de que
     es un homenaje de fans, que no es oficial, y que ni Eduardo Beilinson ni Carmen Castro
     tuvieron nada que ver, tiene que estar en la pantalla del juego. Antes era criterio;
     ahora es condición.
  2. **La muerte del avatar se mira de nuevo.** `D-38` ya dejó abierto qué registro rige la
     muerte repetida del muñeco de alguien vivo. Con cara reconocible, la pregunta pesa más,
     no menos: un sprite con la cara de alguien muriéndose cuarenta veces por partida es
     exactamente la clase de imagen que "lo vean y les moleste" contempla. Sigue siendo de
     `experiencia`, y ahora es bloqueante antes de animar la derrota.
  3. **Las cabezas de perfil de la hoja son retrato, no sprite.** Entran a la producción
     solo si alguna pantalla las necesita, y esa pantalla la mira `experiencia` con esta
     decisión al lado. El sprite jugable es otra cosa: a 32 px la caricatura de 8 bits
     identifica mucho menos que un perfil dibujado.

- **Lo que NO se enmienda, y sigue igual de firme.** Las barandas **1** y **3** de `D-38`:
  el muñeco **nunca dice "yo"** —sin bocadillo, sin cartel en primera persona, sin frase con
  firma, porque eso envenena el rótulo `testimonio` de todo el sitio— y **nada narra la
  relación real entre Skay, Poli y el Indio**, ni por mecánica ni por texto.

- **Alternativas descartadas.** **Dejar la cara en el sprite y sacar los dos perfiles**: era
  el punto medio y no obligaba a tocar `D-38`; se descartó porque dejaba la regla escrita
  diciendo una cosa y el arte haciendo otra, que es peor que cambiarla. **Respetar `D-38`
  como estaba**: obligaba a retocar arte que el usuario ya produjo, para comprar un margen
  de riesgo que `RES-64` no mide como decisivo.

- **Consecuencias.**
  1. **Un `D-XX` no se contradice en silencio: se enmienda con número.** Es la primera vez
     que este proyecto enmienda una baranda en vez de reemplazar una decisión entera, y
     queda como precedente de cómo se hace.
  2. **El pie de homenaje entra al alcance de `IDEA-14`** como requisito, no como detalle de
     copy. Dueño: `contenido`, en registro 3.
  3. **Si alguna vez llega un reclamo, se baja igual** (`D-14`). Eso no cambió nunca.

---

## D-43 — El botón de cambio no era el mecanismo: era el nombre de un mecanismo peor

- **Fecha:** 2026-09-16
- **Estado:** aceptada. **Enmienda `D-40`**, que sigue vigente entera: lo que cambia es el
  mecanismo, no el principio.
- **Consume:** `D-40`, `D-14`, `D-32` límite 3, `D-42` consecuencia 1, `UX-28`, `CTR-17`,
  `FIND-63` (`REV-14`).

- **Contexto.** `D-40` decidió que el juego se puede jugar solo, y escribió el mecanismo con
  todas las letras: *"un camino para uno solo, **con el botón de cambio de personaje** — el
  inactivo queda quieto y a salvo donde lo dejaron"*. Venía del relevamiento (`RES-65.1`): es
  como la versión móvil oficial del juego de origen resuelve este mismo problema.

  `UX-28` lo eliminó, y lo argumentó bien: **cada columna de mando maneja siempre al mismo
  personaje**. Dos personas tocan una columna cada una y se mueven a la vez; una persona toca
  una columna, después la otra, y el que dejó atrás se queda parado y a salvo.

  Eso **es** el botón de cambio, palabra por palabra lo que `D-40` pedía — salvo que no es un
  botón: es tocar del otro lado. Y resuelve además la consecuencia 3 de la propia `D-40`, que
  exigía que el que llega solo no tenga que elegir un modo, porque `D-32` límite 3 no deja
  poner una pantalla previa. Con un botón de cambio hay algo que aprender antes de jugar. Con
  dos columnas no hay nada que elegir: **no hay dos modos, hay una pantalla y dos maneras de
  agarrarla.**

  Pero `D-40` sigue diciendo "botón" en el disco, y `D-42` consecuencia 1 acaba de fijar la
  regla: **un `D-XX` no se contradice en silencio, se enmienda con número.** Esta es la
  enmienda.

- **Decisión.** La frase *"con el botón de cambio de personaje"* de `D-40` queda reemplazada
  por:

  > **Cada columna de mando maneja siempre al mismo personaje.** El que no tiene un dedo
  > encima se queda quieto y a salvo donde lo dejaron — que es lo que hace cualquier
  > plataformas cuando no apretás nada. Con dos personas, las dos columnas se usan a la vez.
  > Con una, se usa una y después la otra. **No hay modo que elegir, ni botón que aprender.**

  Todo lo demás de `D-40` queda **intacto**: cada nivel resoluble de las dos maneras, y
  prohibido por construcción el puzzle que exige simultaneidad sin segunda solución.

- **Alternativas descartadas.** **Dejar el botón y que `UX-28` se ajuste**: era defender la
  letra de una decisión contra un diseño mejor, y el botón traía una pantalla que enseñarlo.
  **Dejarlo contradicho en silencio**: es exactamente lo que `D-42` consecuencia 1 prohibió
  hace unas horas, y el primer caso de esa regla no puede ser su primera excepción.

- **Consecuencias.**
  1. **El efecto de sonido "cambio" de `CTR-17.1` se queda sin disparador y hay que sacarlo.**
     Estaba fundado en *"lo pide `D-40`"* y `D-40` ya no lo pide. Dueño: `arquitectura`. Es
     `FIND-63`, y es la mitad que esta decisión no puede cerrar sola.
  2. **La verificación de `D-40` consecuencia 1 se abarata y se vuelve física**, como observó
     `UX-28`: si una persona sola no puede resolver el nivel con un dedo por vez, el nivel
     está mal. No hace falta un modo aparte para probarlo — y eso le saca la mitad del trabajo
     a `T-249`.
  3. **`RES-65.1` no queda desmentida.** El juego de origen alterna con un ícono porque su
     pantalla móvil es vertical y de un solo jugador. Acá la pantalla es horizontal y hay dos
     columnas desde el principio (`D-40`), así que el mismo problema tiene una salida mejor.
     La ficha sigue siendo cierta sobre aquel juego.

## D-44 — El pixel lo dibuja el hilo principal, como código

- **Fecha:** 2026-09-22
- **Estado:** aceptada. Decidida por el usuario al abrir el ciclo 16, con las tres salidas
  sobre la mesa.
- **Consume:** `D-38` (las tres barandas), `D-41` (pixel adentro, imprenta afuera), `D-42`
  (los muñecos tienen cara), `BR-23`, `UX-27`, `CTR-15`, `ORQ-plan-ciclo-15.md` §1.1 y §5
  punto 2, `Docs/EQUIPO.md`.

- **Contexto.** El ciclo 15 midió la hoja de sprites que trajo el usuario y el resultado fue
  el desenlace 2 de `CTR-15.2`: **no está sobre grilla de píxel**. 108.705 colores, un fondo
  que son 52 tintas y bordes repartidos parejo en todas las fases de `N`. No se recorta: se
  redibuja. Y el mismo plan dejó escrito el otro hueco, que es de equipo y no de dibujo: **de
  los siete roles, ninguno produce arte.** Salían dos caminos —justificarlo en
  `Docs/EQUIPO.md` o que lo produzca el usuario— y el juego quedó en tinta plana esperando.

- **Decisión.** **Los sprites y los tiles del área de juego los dibuja el hilo principal,
  como código**: cada cuadro es una grilla de texto donde cada caracter nombra una de las 16
  tintas `--px-*` de `tokens.css`, un script la imprime a PNG con alfa binario, y el auditor
  de paleta la controla. **La hoja del usuario pasa a ser referencia, no fuente**: de ahí
  salen la silueta, el sombrero, la SG y la mata de pelo, no los píxeles.

  **El usuario aprueba mirando.** Nada entra al atlas sin una hoja de contacto —los cuadros
  a tamaño de juego, y los mismos en blanco y negro para la prueba de siluetas de `BR-23`
  punto 3— que el usuario vio y dio por buena.

- **Alternativas descartadas.** **Que el usuario reexporte la hoja**: era la salida barata
  de `ORQ-plan-ciclo-15.md` §5 punto 1, y dejaba el juego esperando algo que no tiene fecha.
  **Tinta plana definitiva**: el juego se jugaría, pero `D-42` le dio cara a los muñecos por
  algo, y un rectángulo de dos tintas no la tiene.

- **Consecuencias.**
  1. **No es un rol nuevo, y por eso no toca el tope.** El hilo principal ya escribe todo
     `src/` (`Docs/EQUIPO.md`, "Quién escribe el código"); una grilla de tintas impresa por
     script es de la misma familia. La justificación quedó escrita en `Docs/EQUIPO.md`.
  2. **Las barandas de `D-38` y `D-42` rigen igual para el que dibuja**, sea quien sea: la
     cara sí, el cuerpo caído no, ninguna pose que narre la muerte (`BR-24`). La hoja de
     contacto es el punto donde eso se mira.
  3. **La paridad de `BR-23` punto 2 pasa a ser contable a máquina**: mismos estados y mismos
     cuadros en los dos atlas se prueban comparando los dos JSON, no mirándolos.
  4. **La cadena es reutilizable.** El día que `IDEA-04` (el bondi a Finisterre) se promueva,
     hereda la paleta, la imprenta y el auditor sin volver a pagarlos.
  5. **Si la hoja de contacto no convence, no se rompe nada**: la isla sigue dibujando en
     tinta plana, como hoy.

## D-45 — Fácil es lo más tocado en vivo, y los setlists se guardan enteros

- **Fecha:** 2026-09-22
- **Estado:** aceptada, **con una condición**: que `RES-73` muestre cobertura suficiente
  para ordenar el primer puñado de temas sin empates que lo decidan el azar. Si no alcanza,
  vuelve al usuario —no se cae en silencio a otra vara—.
- **Consume:** `BR-18` apartados (f) y (g), `BR-28`, `D-27`, `CTR-07.7`, `RES-05`, `RES-20`,
  `RES-51`, `RES-52`, `D-14`.

- **Contexto.** `US-02` tiene su piso de 30 temas cumplido con 95 y **0 de los 8 Fáciles**
  que `BR-01` le pide. La vara que fijó `BR-18` (f) son las vistas de YouTube, y la clave
  para medirlas (`YT_API_KEY`) no llegó nunca: se pidió en el ciclo 8, se volvió a pedir en
  el 10, y un mes después sigue sin estar. `BR-28` convirtió eso en un punto de control: si
  al cerrar el ciclo 15 seguía en cero —y sigue—, **no se abre un noveno juego** hasta que la
  clave llegue o hasta que una decisión escrita reemplace la cuota.

- **Decisión.**
  1. **"Fácil" en `US-02` pasa a ser lo más tocado en vivo**: dentro del pool de temas con
     fragmento de audio producido, los 8 que más veces figuran en los setlists de
     **setlist.fm**, que arma la gente que fue a los recitales. La cuota de 8 no se toca: se
     cambia de dónde sale el orden.
  2. **Los setlists se guardan enteros**, no solo la cuenta. Pedido del usuario, textual:
     *"Guardemos los setlist que encuentre también"*. Cada recital entra con su fecha, su
     lugar, los temas en el orden en que se tocaron y de dónde salió, como dato propio del
     sitio (`src/data/recitales.json`, contrato de `arquitectura`). El conteo de Fáciles se
     **deriva** de ese archivo en build y no se guarda —mismo motivo que `CTR-07.7`—.
  3. **El rótulo dice qué mide y de dónde sale**, en registro 3: lo más tocado en vivo según
     los setlists que carga la gente. Nunca "el más popular" ni "el más escuchado": un tema
     que se tocó en cada misa no es por eso el que más suena hoy, y el sitio no afirma lo que
     el dato no dice.

- **Por qué esta vara y no solo "la que hay".** En esta banda el recital fue el lugar donde
  la gente aprendió los temas: se cantaban enteros desde la tribuna. Lo que más veces se tocó
  es, casi literalmente, lo que más veces cantó la gente. Y es conocimiento popular con
  procedencia —cada setlist lo subió alguien que estuvo o que lo reconstruyó—, que es
  exactamente lo que `D-14` dice que vale, siempre que el rótulo no mienta.

- **Alternativas descartadas.** **Esperar la clave de YouTube**: un mes de espera y un juego
  de la v1 incompleto con siete títulos alrededor tapándolo, que es la forma del riesgo 4 del
  brief. **Retirar la cuota por escrito**: el argumento de la rampa de `BR-18` (g) se sostiene,
  pero dejaba a `US-02` sin escalón fácil para siempre. **Spotify o kworb**: `RES-51` y
  `BR-18` (a) ya los cerraron.

- **Consecuencias.**
  1. **`CTR-07.7` queda intacto.** Los recitales son otro archivo, otro contrato y otra
     cuenta. Si la clave de YouTube llega algún día, el ranking de vistas vive aparte y
     **no recupera el corte de Fáciles sin una decisión nueva**.
  2. **La puerta de `BR-28` se abre cuando los 8 Fáciles existan y un test los cuente, no
     cuando esta decisión se escribe.** Escribirla no alcanza: es la trampa de declarar un
     choque como resuelto.
  3. **`BR-18` (f) queda desactualizado** y lo enmienda su dueño, `producto`. Y queda una
     pregunta que no se contesta acá: si los tercios de `D-27` —la dificultad de "Sacalo por
     la letra", que hoy también esperan la clave— se alimentan de la misma cuenta. Es de
     `producto` con el usuario.
  4. **La única puerta a la web no se abre de más.** Qué se puede bajar de setlist.fm, con
     qué términos y con qué licencia lo trae `investigador` (`RES-73`); el script que lo baja
     es del hilo principal y corre por la vía que esa ficha diga, igual que
     `ingerir-popularidad.mjs` corre por la de `RES-52`.
  5. **Los setlists abren una puerta que esta decisión no cruza**: la Redondopedia puede
     tener recitales, y un juego puede salir de "qué se tocó en Huracán en el 93". Ninguna de
     las dos cosas entra con esta decisión.

- **Enmienda del 2026-09-23 — los setlists se guardan de fuentes que lo permiten.** Decidida
  por el usuario después de `RES-73` (`Docs/INVESTIGACION/INV-73-recitales-setlistfm.md`).
  - **Lo que encontró la ficha.** Los términos de setlist.fm dan una licencia **para ver**:
    prohíben reproducir el contenido y bajarlo con bots (`RES-73.1`, `RES-73.2`). La API es
    gratis con clave, pero prohíbe retener sus datos más allá de una caché corta
    (`RES-73.3`). El punto 2 de esta decisión, tal como estaba escrito, no se podía cumplir
    desde setlist.fm de forma legítima con una máquina, y el sitio no va a bajar 256 páginas
    contra los términos de nadie.
  - **Punto 1, precisado.** El orden de los Fáciles sale del **conteo por tema que publica la
    página de estadísticas de setlist.fm**, citado como dato —cuántas veces figura cada tema,
    con URL y fecha de consulta—, no de contar setlists guardados. Un número con su fuente no
    es reproducir el contenido de nadie. `RES-74` ya lo trae, y la condición de esta
    decisión **se cumple**: no hay empate en el puesto 8.
  - **Punto 2, reemplazado.** Los setlists enteros se guardan **solo desde fuentes cuya
    licencia lo permite** —MusicBrainz, Wikipedia, sitios de fans que lo digan—, con la
    fuente y la licencia de cada recital. De setlist.fm el sitio guarda el conteo citado y un
    índice con enlaces (fecha, lugar, página), nunca las listas. Las busca `investigador`
    (`T-281`).
  - **Descartadas:** guardar solo el conteo, que dejaba el pedido del usuario sin camino;
    transcribir a mano, que igual reproduce el contenido de setlist.fm y le cuesta el tiempo
    al usuario; y pedir permiso, que queda abierta para cuando haga falta y no traba nada.
  - **Arrastra:** `CTR-19` (`T-273`) pasa a contratar dos piezas, el conteo citado y el
    archivo de recitales, sin derivar una de la otra; `T-279` construye las dos.

## D-46 — La dificultad de todo juego con canciones sale de lo que más se tocó en vivo

- **Fecha:** 2026-09-24
- **Estado:** aceptada — decisión directa del usuario, al contestar la pregunta que `BR-18`
  apartado (h) le dejó pedida. Textual: *"La dificultad de todo lo que sea con canciones sale
  de ahí"*. **Enmienda `D-27`**, que sigue vigente en su principio.
- **Consume:** `D-27`, `D-45` (y su enmienda del 2026-09-23), `BR-18` (f) y (h), `CTR-07`,
  `CTR-19`, `RES-74`, `RES-75`.

- **Contexto.** `D-27` decidió que la dificultad de "Sacalo por la letra" no se etiqueta a
  mano, sino que **se infiere de cuánto circula el tema**, y eligió como medida las vistas de
  YouTube. La clave para medirlas no llegó nunca, así que hoy todos los temas dan `dificil`.
  `D-45` ya había llevado el corte de Fáciles de `US-02` al conteo de veces tocado en vivo
  que publica setlist.fm. `producto` le preguntó al usuario si `D-27` seguía el mismo camino,
  con la recomendación de no tocarlo todavía. El usuario contestó más amplio que la pregunta.

- **Decisión.** **La dificultad de todo juego del sitio que trabaje con canciones se infiere
  del conteo citado de veces tocado en vivo** (`CTR-19`, la pieza del conteo), no de las
  vistas de YouTube ni de una etiqueta a mano. El principio de `D-27` queda entero —la
  dificultad no se etiqueta, se infiere de cuánto circula el tema— y cambia la medida. La
  regla de reparto de `D-27` también queda: los temas con conteo se ordenan y se parten en
  tercios, y **un tema sin conteo es difícil** (*"sin escucha por ahora es difícil"*).

- **Por qué es la misma idea y no otra.** En esta banda la gente aprendió los temas en los
  recitales, cantándolos enteros. Lo que más veces se tocó es, casi literalmente, lo que más
  veces cantó la gente. Es la medida que `D-27` buscaba con las vistas, pero sin clave, con
  fuente citada, y más ricotera.

- **Consecuencias.**
  1. **El conteo tiene que cubrir el catálogo, no solo el top-25.** `RES-74` trajo los 25
     primeros de la página de estadísticas de setlist.fm; para partir en tercios hacen falta
     todos los temas que esa página lista. Lo trae `investigador`, como números citados
     (`RES-73.1`: la página se puede ver; lo que no se hace es bajarla con un bot).
  2. **Qué juegos son "con canciones" y cómo usa cada uno la dificultad lo fija
     `producto`**: `US-02` y `US-07` seguro; `US-03` (el hueco de la letra), `US-08` y las
     preguntas del quiz que son sobre temas, a revisar uno por uno. Un juego que hoy tiene
     dificultad escrita a mano y pasa a inferida cambia de contrato: eso es de
     `arquitectura`.
  3. **Las vistas de YouTube dejan de decidir nada.** `CTR-07` y `popularidad.json` quedan
     como estaban, sin uso para la dificultad. Si la clave llega algún día, es un ranking
     aparte y no recupera la dificultad sin una decisión nueva (`D-45` consecuencia 1).
  4. **El rótulo de cada juego dice qué mide**, en registro 3: lo más tocado en vivo según
     los setlists que carga la gente. Nunca "el más popular" ni "el más escuchado".

- **Precisión del 2026-09-24, decidida por el usuario: "Completá la letra" también.**
  `BR-30` (`T-283`) había leído *"todo lo que sea con canciones"* dejando afuera el quiz y
  `US-03`, con el argumento de que ahí la dificultad mide otra cosa (lo oscuro del dato, el
  contexto del hueco). El usuario lo contestó textual: *"Completá la letra también sale del
  conteo"*.
  - **`US-03` pasa a dificultad inferida del conteo en vivo**, como `US-07`. El hueco de un
    verso de un tema muy tocado es Fácil; el de un tema que casi no se tocó, Difícil.
  - **El quiz queda como `BR-30` lo dejó**: el usuario no lo incluyó, y su dificultad es la
    del dato, no la de una canción.
  - **Arrastra `BR-03`**: hoy la cantidad de versos de contexto alrededor del hueco sale
    del nivel del ítem (2, 1 o 0). Si el nivel pasa a salir del conteo, qué pasa con el
    contexto lo fija `producto` (`T-286`), el contrato `arquitectura` (`CTR-04`, `T-287`)
    y el código el hilo principal (`T-288`).

## D-47 — Skayboy y Poligirl a pantalla completa, con victoria bailada y un coleccionable para cada uno

- **Fecha:** 2026-09-24
- **Estado:** aceptada — decisión directa del usuario después de jugar el nivel 1 en su
  teléfono, en la vista previa del PR #17. Textual: *"me parece que la mejor idea es hacerlo
  pantalla completa con los controles medio transparentes en la pantalla. El scroll en
  horizontal rompe los controles, que la pantalla completa use la disposición de los
  controles del horizontal completo. Los controles se sienten bien, agrega la pantalla
  completa y larga los demás niveles. Además debe haber una pantalla de victoria en la que
  bailen los personajes. Skay debe juntar guitarras y Poli cigarrillos."*
- **Consume y enmienda:** `D-41` (el mueble alrededor del área), `UX-27 §5.1`, `UX-28`,
  `UX-32` (ganar: "nada más se mueve"), `BR-23` (la prohibición de "una animación de
  festejo al llegar juntos a la puerta"), `US-09` criterios 1, 6 y 9, el tesoro para los dos
  de `CTR-16.4`, `CTR-15.7` (los cinco estados de un muñeco).

- **Lo que dijo el teléfono.** Los controles se sienten bien: es la primera observación del
  pulgar que tiene el juego. Y el defecto que la máquina no podía ver: **en horizontal la
  página scrollea y el scroll rompe los controles.**

- **Decisión.**
  1. **Pantalla completa.** El juego tiene un modo en el que el área ocupa la pantalla y
     **los controles quedan superpuestos, medio transparentes, con la disposición del
     horizontal**: salto grande a cada lado y las flechas abajo. En ese modo la página no
     scrollea ni se mueve con el dedo. El mueble impreso de `D-41` sigue siendo la pantalla
     de entrada; la pantalla completa es la manera de jugar.
  2. **Los seis niveles, en fila.** Al ganar se pasa al siguiente, y el avance se guarda en
     el aparato (`US-09` criterio 9).
  3. **Pantalla de victoria: los personajes bailan.** Enmienda la prohibición de festejo de
     `BR-23` y el "nada más se mueve" de `UX-32`. **Lo que no se enmienda es por qué existía
     esa prohibición:** el juego no afirma ningún vínculo sentimental entre dos personas
     reales (`D-38` baranda 3). Por eso **cada uno baila su propio baile**, con la misma
     cantidad de cuadros (`BR-23` punto 2), y sin gestos de pareja: no se abrazan, no se
     toman de la mano, no bailan juntos.
  4. **Un coleccionable para cada uno: Skay junta guitarras, Poli junta cigarrillos.**
     Reemplaza al tesoro que servía para los dos. La paridad de `BR-23` se vuelve contable:
     la misma cantidad por nivel. Sigue sin ser condición para ganar. Y la guitarra se junta
     del piso: `UX-27 §8.2` (ni la guitarra ni ningún objeto en la mano) sigue en pie.

- **Una nota sobre el cigarrillo, sin veto.** Es un objeto que el sitio le asigna a una
  persona real y viva. `D-38` pidió cuidado con lo que se le atribuye; el usuario lo decidió
  sabiéndolo, y por `D-14`, si llega un reclamo, se cambia el objeto.

- **Consecuencias.**
  1. `producto` enmienda `US-09` y `BR-23` (`T-296`); `experiencia` diseña la pantalla
     completa y la victoria (`T-297`, `UX-33`); `arquitectura` fija los coleccionables en la
     leyenda, el sexto estado de los muñecos y el uso de la pantalla completa (`T-298`);
     `contenido` escribe lo que se lee (`T-299`); y el hilo principal dibuja y construye
     (`T-300`..`T-303`).
  2. **En iPhone no existe la pantalla completa de verdad para una página** (Safari solo la
     da para video). El modo tiene que andar igual sin ella: la página ocupa la ventana
     entera y bloquea el scroll. Donde el sistema sí la da (Android, escritorio), se pide.
  3. Los niveles siguen en `borrador` hasta que alguien juegue de a dos (`BR-25` a). Lo que
     dijo el usuario cuenta como la primera mitad de esa prueba, no como la prueba entera.

---

## D-48 — "Más o menos": preguntas de número sobre la banda, de todo tipo, y se juega hasta el primer error

- **Fecha:** 2026-09-25
- **Estado:** aceptada. **Reescrita el mismo día**, antes de que nadie la consumiera: la
  primera versión hacía de `IDEA-11` un juego de una sola cosa —en cuántos temas aparece
  una palabra— y el usuario la amplió mientras se construía. Lo que decía esa versión sobre
  las palabras sigue entero, como una de las familias (punto 4).
- **Los pedidos del usuario, textuales:** *"tomá un juego barato del estado que no esté
  hecho y resolvelo completamente"* (el hilo principal eligió `IDEA-11`: la otra barata del
  backlog, `IDEA-09`, ya es `US-06`), y después: *"que sean preguntas con respuesta de
  número pero diferentes, no todo sobre las letras, sino cuántos integrantes son, cuántos
  años tocaron, o sea sé creativo e investigá el juego para ver cómo debe ser"*.
- **Consume:** `IDEA-11` (`PRD-backlog-ideas.md`), `INV-93` (el género, `RES-93`..`RES-98`),
  `INV-100` (los números de la banda, `RES-100`+), `RES-20` (discografía, años, duraciones,
  y sus dos trampas), `RES-90` (el conteo de setlist.fm), `CTR-06`, `BR-15`, `BR-16`,
  `D-09`, `D-13`, `D-14`, `D-17`, `D-19`, `ADR-02`, `CNT-04`, `CNT-06`,
  `.claude/rules/voz-ricotera.md`, `.claude/rules/diseno-marca.md`.

- **Lo que dijo la investigación del género (`INV-93`).** El *Higher Lower Game* encadena
  pares y corta en el primer error (`RES-93`), pero **ningún derivado mezcla unidades dentro
  de una comparación** (`RES-94.1`). Lo que sí acepta cualquier pregunta con respuesta
  numérica es la mitad de encuesta de *Card Sharks* y *Play Your Cards Right*: **"¿el número
  real es más o menos que este?"** (`RES-95`). Y la familia de los diarios numéricos revela
  de golpe, sin el contador que sube (`RES-98`), que es lo único compatible con "solo se
  mueve la mosca".

- **Decisión.**
  1. **`IDEA-11` pasa a `US-10`: "Más o menos".** Vive en `/juegos/mas-o-menos/` y su
     desafío es `g=mas-o-menos` (`ADR-02`). El nombre es la mecánica dicha en rioplatense, y
     de paso el "más o menos" de quien no se la sabe toda.
  2. **Cada paso es una pregunta con respuesta de número y una referencia.** El jugador dice
     si la respuesta real es **más o menos** que la referencia. La referencia es de dos
     clases, y **siempre de la misma unidad que la respuesta** (`RES-94.1`):
     - **un número** que pone el juego ("¿Cuántos años tocaron juntos? ¿Más o menos que
       12?"), como la encuesta de *Card Sharks*;
     - **otro dato de la misma familia, con su número a la vista** ("*Jijiji* dura 5:34.
       ¿*Juguetes perdidos* dura más o menos?"), como el *Higher Lower Game*.

     De un paso al siguiente **cambia la familia**: es lo que pidió el usuario.
  3. **Para los años, los botones dicen "Antes" y "Después".** "¿Más o menos que 1990?" no
     lo dice nadie. Todo lo demás dice **Más** y **Menos** (`D-17`: no son infinitivos).
  4. **Las familias, y de dónde sale cada número.** Ningún número se escribe dos veces
     (`D-13`): el que ya está en una ficha o en un dato del repo **se deriva en build**, y
     solo los que no existen en otro lado se cargan en el dato del juego, cada uno con su
     ficha.
     - **La banda** (a mano, de `INV-100`): formación, años, integrantes, recitales, lo que
       tenga respuesta de número y ficha.
     - **Los discos** (de `RES-20`): el año de cada disco y cuántos temas tiene. ***Gulp!*
       queda afuera de "cuántos temas"** (11 o 12, según cuente el track oculto) y **nunca
       se pregunta cuántos discos son** (9 o 10): son las dos trampas que `RES-20` ya marcó.
     - **Lo que dura un tema** (de `RES-20`): la versión de disco, en minutos y segundos.
       Los once del vol. 2 de *Lobo suelto* sin duración no entran.
     - **En vivo** (de `RES-90`): en cuántos setlists de setlist.fm figura un tema. **Se
       rotula como lo que es**: setlists que carga la gente, no veces que se tocó.
     - **Las palabras** (del cancionero): en cuántos temas aparece una palabra. Acá sigue
       valiendo todo lo de la primera versión: **temas y no veces** (*criminal* suma 37
       apariciones en un solo tema porque cifraclub escribió cada vuelta del estribillo:
       "veces" mide al que transcribió), las formas escritas declaradas y mostradas al
       revelar, y la lista de temas enlazada a cada letra para que el número se pueda
       auditar (`src/lib/mas-o-menos/conteo.ts`).
  5. **Cada familia pesa lo mismo** en el sorteo, no importa cuántos datos tenga: si no, los
     94 temas con duración taparían a los datos de la banda, que son los que pidió el
     usuario.
  6. **El número tiene que ser un hecho, o un "según" con nombre.** Nunca una leyenda como
     respuesta (`CLAUDE.md`, lo único estricto). Una estimación de prensa entra como "según
     Clarín, N" y el rótulo lo dice. **Nada sobre muertes** (`CNT-04`, `CNT-06`): ni Bulacio,
     ni Olavarría, ni la muerte del Indio.
  7. **Se juega hasta el primer error**, y el puntaje es la racha (`RES-93.3`, `RES-93.4`). La
     mejor racha queda en el aparato (`localStorage`). No hay reloj.
  8. **Escalonado, sin muro (`BR-01`, `D-09`).** La referencia arranca lejos de la respuesta
     y se acerca con la racha: al principio alcanza con el sentido común ("¿tocaron más o
     menos que 3 años?"), después hay que saber. El que llegó sin idea juega igual.
  9. **No hay empates.** La referencia nunca es igual a la respuesta. Una regla de empate que
     hay que explicar es peor que un empate que no pasa (`RES-93.5`: ni el género se pone de
     acuerdo).
  10. **El revelado es de golpe**: el número real, ✔ o ✕ además del color, y de dónde salió,
      en registro 3. Sin contador que sube (`RES-98`, `diseno-marca.md`).
  11. **Compartir es texto y dirección** (`ADR-02`, forma `marcador`: `p` la racha, `t` la
      cantidad de preguntas posibles). Sin tarjeta-imagen en esta versión.
  12. **Casete propio en el lado A del portal.**

- **Alternativas descartadas.**
  1. **Solo palabras, en cadena** (la primera versión). Es un juego de una nota; el usuario
     pidió variedad.
  2. **Encadenar mezclando unidades** ("1986 contra 7 integrantes"). No lo hace ningún juego
     del género (`RES-94.1`), y con razón: comparar un año con una cantidad no es una
     pregunta.
  3. **Una familia por partida** (los modos del *Higher Lower Game*). Resuelve la unidad
     pero no la variedad, y las familias chicas (los diez discos) se agotan en tres pasos.
  4. **Estimar con tolerancia** (*Wits & Wagers*, `RES-96`). Más de un toque por pregunta:
     no entra en la sesión de dos minutos en el teléfono.
  5. **Que `contenido` fije a mano la referencia de cada pregunta.** La fija el juego según
     la racha, y así la misma pregunta sirve fácil al principio y difícil después sin
     escribirla dos veces. Lo que sí declara el dato es la escala de su número (un año, una
     cantidad, una duración), que es lo que le dice al juego cómo alejar la referencia.
  6. **El contador que sube al revelar** (`RES-94.3`). Movimiento decorativo.

- **Consecuencias y reparto.**
  1. `producto` escribe `US-10` y `BR-32`/`BR-33` (qué número puede ser respuesta y cómo se
     arma la partida) y marca `IDEA-11` promovida. `arquitectura` escribe `CTR-20` (el
     schema de `src/data/mas-o-menos.json`, las derivaciones, la referencia y el sorteo).
     `contenido` escribe `CNT-25` (los datos de la banda desde `INV-100`, las palabras, y
     todo lo que se lee). `experiencia` escribe `UX-34`. El hilo principal construye.
     `revisor` escribe `REV-16`.
  2. **Un dato del repo que se corrige se corrige en el juego solo.** Si `RES-20` cambia una
     duración o el cancionero una letra, el número cambia en el próximo build.
  3. **El juego hereda los huecos de sus fuentes y los dice.** Una palabra cantada en
     *San Telmo* no suma, porque de *San Telmo* el cancionero tiene solo la tablatura; el
     rótulo nombra cuántos temas se contaron (hoy, 100 de 105).

---

## D-49 — Octubre en el portal, una pieza de tapa distinta en cada casete, y una mosca que se acerca

- **Fecha:** 2026-10-01
- **Estado:** aceptada — pedido directo del usuario.
- **El pedido, textual:** *"Entramos en OKTUBRE, el mes del disco, hagamos que la página
  refleje esto. Además que la mosca en desktop vuele alrededor del mouse como una mosca y en
  mobile que vuele como ahora pero si el usuario toca trate de ir a volar alrededor de donde
  toca. Que todas las entradas de juegos del home tengan un detalle o un disco entero, no el
  svg del cassete, cada uno diferente."*
- **Consume:** `D-14`, `D-17`, `D-19`, `D-21`, `UX-04`, `UX-20` §5, `UX-25`, `RES-02`,
  `RES-20`, `.claude/rules/diseno-marca.md`, `.claude/rules/voz-ricotera.md`.

- **Contexto: por qué octubre es "el mes del disco", y no solo por el nombre.** *Oktubre*
  salió el **4 de octubre de 1986** (ficha de la Redondopedia, rotulada `hecho`, "sin
  discrepancia entre fuentes"), así que este mes cumple 40. Y al revisar las diez fichas
  apareció lo que hizo de esto un afiche y no un adorno: **seis de los diez discos salieron
  en octubre** — *Oktubre* (4-oct-1986), *¡Bang! ¡Bang!* (7-oct-1989), *La mosca y la sopa*
  (27-oct-1991), *Lobo suelto* y *Cordero atado* (los dos el 4-oct-1993) y *Luzbelito*
  (7-oct-1996). Los seis están rotulados `hecho` en sus fichas. La primera cuenta del hilo
  principal fue "cinco", mirando solo los artículos que tenían la fecha a mano; *Luzbelito*
  apareció al cruzar contra `INV-20`. Por eso la cuenta del afiche **no está escrita a mano**.

- **Decisión.**
  1. **En octubre, el portal lleva un afiche de *Oktubre*** entre la marca y la casetera: el
     sello OKTUBRE en la letra calcada de la tapa, la estampa del cumpleaños ("EL 4 CUMPLE
     40" / "HOY CUMPLE 40" / "CUMPLIÓ 40 EL 4"), la línea que canta ("Sacá el disco del
     sobre, soplale el polvo."), la cuenta ("De los diez discos, seis salieron en octubre.")
     y un almanaque con las seis fechas, cada una en la tinta de su disco y llevando a su
     ficha. El botón lleva a "Adiviná el tema" con *Oktubre* ya elegido
     (`/juegos/adivinar-el-tema/?disco=oktubre`).
  2. **Lo decide la fecha del teléfono, no el build.** Una línea en la cabeza del portal pone
     `data-mes="oktubre"` antes del primer cuadro (como el umbral), y el afiche no ocupa
     lugar sin ese atributo. La estampa la corrige una isla mínima (`scripts/oktubre.ts`) con
     la fecha de quien mira, y cuenta los años con esa fecha: en 2027 dice 41 sin tocar nada.
  3. **La cuenta sale de las fichas** (`lib/sitio/oktubre.ts`, `discosDeOktubre()`): solo
     entra un dato de salida rotulado `hecho`. Si una fecha pasa a discutida, sale del afiche
     sola. Es lo único estricto del proyecto aplicado a un adorno: el afiche no puede decir
     "salió en octubre" de algo que no se sabe.
  4. **Cada casete del portal lleva una tapa entera, un detalle de tapa o un recorte de una
     figura de tapa, y ninguno repite.** Nunca el casete dibujado ni el perro. Quedan:
     *Oktubre* entero (Preguntas), el lobo (Adiviná el tema), el medallón de Momo (Sacalo
     por la letra), la olla de *La mosca y la sopa* (Completá la letra), *¡Bang! ¡Bang!*
     entero (Ponelos en fila), el bondi (Adiviná la tapa), el antifaz de *Un baión* (Más o
     menos), *La mosca y la sopa* entero (Letras y acordes) y el "Patricio Rey" de *Gulp!*
     (La Redondopedia). Las dos del lado B también: el pedido dice "entradas de juegos", pero
     "cada uno diferente" no se cumplía con la mosca repetida en dos casetes, y el perro
     dibujado era el último dibujo sin tapa del portal.
  5. **Los tres materiales se pegan distinto** (`sitio.css`): el recorte con su alfa, como
     siempre; el detalle con borde grueso teñido, como el de la Redondopedia; la tapa entera
     con filete de papel y sombra dura corrida. Los tres miden 58 px por afuera, para que las
     nueve etiquetas arranquen en la misma columna.
  6. **La mosca revolotea alrededor de quien la busca.** Con mouse, en cuanto se mueve, va a
     volar alrededor del puntero y lo sigue; si el puntero sale de la ventana, vuelve. Con el
     dedo vuela el recorrido de siempre, y un toque —no un arrastre— la manda a revolotear
     alrededor del punto unos cuatro segundos y medio. "Volver" es volar hasta el primer
     cuadro de `vuelo-de-mosca` —mismo lugar, misma cara— y recién ahí soltar: el CSS
     retoma sin salto. La física es pura y está probada (`lib/sitio/mosca.ts`); la isla
     (`scripts/mosca.ts`) solo traduce eventos. Con movimiento reducido no toma nunca la
     mosca, y si la preferencia cambia con la página abierta, la suelta.

- **Alternativas descartadas.**
  - **Prender el afiche en el build.** El sitio no se reconstruye el 1.º de octubre ni el 1.º
    de noviembre: con un build del 30 de septiembre el afiche no salía, y con uno del 31 de
    octubre se quedaba todo noviembre.
  - **Recomponer la tapa de *Oktubre* en el afiche** (el título rojo sobre la multitud de la
    franja de fondo). Es armar la composición entera de una tapa con recortes, que
    `public/arte/README.md` veta; y la tapa entera ya está, honesta, en el casete de las
    preguntas.
  - **Teñir todo el portal de rojo en octubre.** La base no rota nunca y cada casete viste su
    disco (`D-19`): pintar los nueve del mismo color borraba justo lo que el punto 4 pide.
  - **Que la mosca siga al puntero con un resorte.** Se lee como un cursor de plantilla. Una
    mosca no persigue: pica hacia un punto cerca, frena, tiembla y vuelve a picar. El destino
    nunca es el puntero, es un punto a entre 26 y 110 px que se sortea de nuevo cada fracción
    de segundo.
  - **Que en el teléfono la mosca siga el dedo mientras arrastra.** El arrastre es la persona
    desplazando la página; ahí la mosca no tiene nada que ir a ver.

- **Consecuencias.**
  - En octubre la casetera arranca más abajo: medido a 375×812, el afiche suma unos 370 px y
    el primer casete queda asomando en el pie de la primera pantalla. Es un mes por año.
  - La mosca deja de ser "lo único vivo del sitio que no responde a nada": sigue siendo el
    único movimiento decorativo (`diseno-marca.md`), pero ahora responde.
  - **Queda pendiente reflejarlo en el lienzo** (hojas 08 componentes y 09 pantallas): no
    entró ni un hex, ni una fuente, ni una medida de marca nuevos —todo sale de tokens que ya
    existían—, pero el afiche y los tres materiales del casete son estructura nueva, y el
    circuito de `diseno-marca.md` pide que la estructura empiece en el diseño.
  - `public/arte/README.md` decía que las tapas enteras solo aparecen en las fichas y en
    "Adiviná la tapa": se corrige. `D-21` ya las había habilitado en cualquier pantalla.

---

## D-50 — Se saca la cinta de todo el sitio: el interruptor, la cama de ruido y la rocola

- **Fecha:** 2026-10-01
- **Estado:** aceptada — pedido directo del usuario. **Reemplaza** a `D-37` y a la parte de
  `D-39` que hacía sonar el tema fijo sobre la cinta; deja sin vigencia `ADR-04` (cama de cinta),
  `ADR-07` (rocola), `UX-21` (el interruptor), `UX-26` (la rocola) y el tema fijo de Skayboy
  de `ADR-08.9` / `CNT-20`. Esos documentos no se reescriben: son de sus roles, y queda el
  pedido en `Docs/SUGERENCIAS/HILO-para-todos-se-saco-la-cinta.md`.
- **El pedido, textual:** *"Saquemos lo de la cinta en todos lados, en el juego de adivinar
  el tema a veces salta sola y hace un ruido blanco molesto."*

- **Por qué "saltaba sola" — y no era un error de una línea, era el diseño.**
  1. La preferencia quedaba guardada para siempre (`arcade.cinta` en `localStorage`). Quien
     la había prendido una vez, en cualquier pantalla y quizás sin querer, la tenía prendida
     en todas.
  2. Ningún navegador deja sonar nada sin un gesto, así que cada pantalla armaba un escucha
     de un solo uso que **prendía la cama con el primer toque, cualquiera**
     (`rearmarCinta()`). En "Adiviná el tema" ese toque era "Empezá".
  3. Cada fragmento callaba la cama, y **seis segundos después de que paraba, la cama volvía
     a subir sola** (`ESPERA_PARA_VOLVER_SEG`), con una rampa de 1,2 s. En un juego hecho
     de escuchar fragmentos, eso es ruido que entra y sale entre pregunta y pregunta.
  4. Y no había cómo apagarla jugando: el interruptor vivía en la cabecera de `#portada`,
     que la partida esconde. El desvío ya estaba anotado en el propio `cinta.ts` contra
     `UX-21` §7.

- **Decisión.** Se va todo lo que existía solo para la cinta: la isla `scripts/cinta.ts`, los
  módulos `sitio/cinta.ts`, `rocola.ts`, `rutas-sonoras.ts` y `pua.ts` con sus tests, la
  siembra de la rocola en `Base.astro`, el bloque `CINTA` de la copia, sus estilos, y la
  señal de "algo está sonando" de `audio/contexto.ts`, que solo la escuchaba la cama.
  **Se queda todo el audio de los juegos**: la escalera de fragmentos, el reveal y el tema
  completo de "Adiviná el tema" (`D-22`) suenan igual que sonaban con la cinta apagada.

- **Skayboy y Poligirl, que era el único juego cuyo sonido dependía de la cinta.** Con la
  cinta apagada quedaba mudo del todo; ahora suenan sus tres efectos (salto, tesoro,
  puerta), armados con el primer toque o tecla de la página. Lo que se pierde: el primer
  salto, si es lo primero que se toca, sale callado; **el tema fijo** (*Ñam fri frufi fali
  fru*, `D-39`) se fue con la rocola —igual nunca había sonado: `public/audio/temas/` está
  vacía y caía a la cama—; y **Skayboy ya no tiene cómo callarse**. No se inventó un
  control: si hace falta, es una decisión de `experiencia` y `arquitectura`, y
  `soltarEfectos()` quedó en el módulo para ese día.

- **Alternativas descartadas.**
  - **Arreglar el arranque solo** (que el primer toque no la prenda, que no vuelva sola). Lo
    que molestaba era el ruido, no el mecanismo; el pedido fue sacarla "en todos lados".
  - **Dejar la rocola y sacar solo la cama.** La rocola se montaba sobre el mismo
    interruptor, la misma preferencia guardada y el mismo rearme por gesto: era la misma
    puerta para el mismo problema.

- **Consecuencias.**
  - Las pantallas ya no tienen ningún control de sonido en la cabecera; la portada pierde la
    fila que existía solo para colgar la estampa.
  - La clave `arcade.cinta` sigue en los navegadores de quien la usó, pero ya no la lee
    nadie.
  - `npm test` pasa de 1442 a 1373 casos: los de la cinta, la rocola, la púa y la señal de
    sonido se borraron con lo que probaban, más los nuevos de `D-49`.

---

## D-51 — Lo que estaba hecho y nadie podía encontrar entra al sitio: dos ejes, Skayboy, la casilla, y lo que se pudo sin el usuario

- **Fecha:** 2026-10-01
- **Estado:** aceptada. Pedido directo del usuario sobre un relevamiento de otro agente, textual:
  *"Resolvé esto que relevó otro agente. Resolvé todo de la mejor forma y dejalo integrado en
  el sitio."* Dos puntos los decidió él mismo esa tarde, a pregunta del hilo principal: **publicar
  Skayboy y Poligirl ya**, sin la prueba en el teléfono, y **la casilla de corrección**, que
  dio él.

- **Lo que se integró, punto por punto del relevamiento.**
  1. **"¿Qué tipo de ricotero sos?" tiene puerta.** Casete A2 del portal, vestido de
     *Luzbelito* con la cabeza de la vela (`UX-06` §5), segundo porque es el molinete más
     abierto del sitio; renglón del lugar y bajada de `CNT-26`. Era un olvido, no una decisión:
     ninguna `D-` lo había dejado afuera.
  2. **Skayboy y Poligirl se publica.** Los seis niveles pasan a `listo` con
     `verificaciones.deDos: true`. Ese booleano, dice su schema, *"no prueba que se jugó,
     prueba que alguien se hizo cargo de decir que sí"*: **se hizo cargo el usuario**, sabiendo
     que nadie los jugó de a dos en un teléfono. La máquina sí los juega en cada build (la traza
     de `CTR-18`). La victoria bailada (`D-47`) sale como está, sin la aprobación de la hoja del
     baile que pedía `D-44`: publicar fue la aprobación. Casete A9, vestido de *Gulp!* (`UX-30`).
  3. **La casilla de corrección.** Hasta hoy `CASILLA` era `null` por decisión del usuario
     (un mail personal en un sitio público es para los raspadores), y el botón cerraba por
     portapapeles: la corrección se armaba y **no llegaba a ningún lado**. Era la primera de
     las tres mitigaciones de `D-25`. El usuario dio la dirección sabiendo el costo; va
     **partida en el código** y se arma al cargar el módulo, así no queda escrita como `usuario@dominio`
     en el JavaScript publicado (un test lo vigila). El botón llegó también a la Redondopedia,
     que `PRD-correcciones.md` §4 ponía primera en la fila: al pie de cada artículo.
  4. **"Completá la letra" pasa de 21 a 72 versos** (24 fáciles, 23 medios, 25 difíciles, de
     15 a 39 temas), por la vía que `D-25` ya había abierto: la selección curada de fuente
     única, ampliada por `contenido` (`CNT-27`, +52) con el mismo criterio de riesgo bajo,
     ahora que la mitigación 1 llega de verdad. El hilo principal sacó una de las viejas,
     `CL-601` (`CNT-23`): su respuesta venía sin tilde ("volteo"), la misma errata por la que
     esta tanda dejó afuera a otras. Seis temas pasan de ocho versos visibles (`CTR-04.4`, que
     es precaución y no cerrojo); `CNT-27` §5 deja 19 versos más en reserva si se relaja. **La vía de dos fuentes se
     intentó primero y la red no dejó**: cifraclub y letras.com son del mismo dueño (`INV-23`),
     y lacuerda.net —la independiente— está bloqueada por la política de red del entorno
     (`INV-141`). Cuando se habilite `acordes.lacuerda.net`, los cuatro lotes de cotejo se
     regeneran y los versos que coincidan suben de `fuente-unica` a `dos-fuentes` solos.
  5. **El desafío de "Adiviná el tema" se lee**: el amigo ya no cae en la portada pelada.
  6. **Compartir** en "Adiviná la tapa", "Completá la letra" y dos ejes (texto y enlace, sin
     tarjeta, como "Más o menos"); dos ejes manda la identidad, nunca un número (`BR-17`).
  7. **Spotify en el quiz**: siete preguntas con el ID de cinco temas verificados (`INV-140`).
     Los dos ambiguos (*Mi perro dinamita*, *La bestia pop*) quedan sin botón hasta abrirlos.
  8. **"Más o menos"**: entran 10 de los 18 números que `CNT-25` había dejado por volumen; los
     otros 8 tenían un problema de veracidad que la primera pasada no vio (`CNT-25` §2).
  9. **Las bandas de después de la separación**: tres artículos `concepto` (`BR-34`, `BR-35`,
     `CNT-28`), sin tocar el schema.
  10. **Las dos calcomanías que faltaban**: el muñeco del antifaz para *Un baión*, recortado
     del máster como lo pedía el despiece, y para *La mosca y la sopa* **el rótulo de la tapa
     con la mosca adentro**, no el gato momificado: el gato no está en ninguna de las cuatro
     imágenes del disco que hay en el repo, y recortarlo era inventarlo.
  11. **Peso muerto, ~4,9 MB menos publicados**: el video de *Último bondi* (era copia exacta
     del máster de `Docs/UX/video-master/`), cinco derivados de tapa que ninguna pantalla
     mostraba, la fuente *Redonditos Fan* que se declaraba y nadie usaba, y la copia de las
     pantallas "en la cocina", que ya no existen. La hoja original de Skayboy, el lobo-lupus y
     el ensayo de Skayboy **no se borraron**: salieron de `public/` a `Docs/UX/`, porque son
     material de trabajo, no del sitio.

- **Lo que no se pudo sin el usuario, y sigue siendo suyo.**
  - **Los temas enteros en mp3** (`D-22`, `D-39`): salen de sus discos con
    `npm run generar-fragmentos -- "<carpeta>" --enteros`. Lo mismo los 9 temas sin fragmento
    (*Cordero atado* y "Pianito").
  - **La escucha de la letra**, si quiere subir versos al régimen más fuerte, o habilitar
    `acordes.lacuerda.net` en el acceso de red del entorno para el cotejo de dos fuentes.
  - **Jugar Skayboy en el teléfono**: ya está publicado; si algo no se siente bien, se corrige.

- **Consecuencias.**
  - El portal pasa de siete a nueve casetes en el lado A. `UX-25` midió el largo del portal
    con ocho; con once es más largo, y lo tiene que mirar `experiencia`.
  - El campo `temaFijo` de `skayboy.json` sigue ahí sin uso (resto de la cinta, `D-50`); sacarlo
    es un cambio de schema y es de `arquitectura`.

---

## D-52 — Las filas de "Ponelos en fila" pasan a ser el pogo

- **Fecha:** 2026-10-01
- **Estado:** aceptada — decisión directa del usuario. Pidió *"otras categorías más
  ricoteras"*, descartó una primera tanda de tres (el casete, el cuerpo, la misa), guardó la
  del cuerpo, vio dos en el tablero y eligió esta.
- **Decisión:** las cuatro filas de `US-08` pasan de lugares de un recital (CONTRA LA VALLA ·
  EN EL MEDIO · ATRÁS DE TODO · EN LA VEREDA) a **cuánto te mueve el cuerpo ese tema**:
  **EN EL POGO · SALTANDO · CABECEANDO · QUIETITO**.
- **Lo que no cambia, y es lo que importa:** `BR-22`. Las filas ordenan sin calificar: nadie
  que escucha un tema quietito se equivocó. Siguen siendo registro 3 (rótulos secos) y
  siguen siendo cuatro, con los mismos números de fila (`ADR-06`): **un enlace compartido con
  las filas viejas abre igual**, y lo que estaba contra la valla aparece en el pogo.
- **Descartadas:** el casete (en la casetera → prestado sin vuelta), la misa (adentro del
  estadio → en casa con la radio), los redonditos (recién horneados → en la bandeja), el
  canto (a garganta pelada → ni la letra). El cuerpo (en la piel → en el cajón) quedó como la
  segunda.
- **Consecuencias:** la bajada del casete del portal cambia su primera oración a *"Unos te
  tiran al pogo; otros, quietito."*. `UX-23` y `PRD-ponelos-en-fila.md` siguen nombrando las
  filas viejas: son de `experiencia` y `producto`, y describen la decisión de entonces.

---

## D-53 — Skayboy y Poligirl se juega con el teclado de la computadora: W A D y las flechas

- **Fecha:** 2026-10-02
- **Estado:** aceptada — pedido directo del usuario, textual: *"Agregá a skayboy y poligirl que
  en desktop se pueda jugar con awsd y las flechitas. Confirmo que los niveles son jugables"*.
- **Decisión:** **W A D mueven a Skayboy y las flechas a Poligirl** (W y ↑ saltan). El reparto
  no se eligió: sale de `D-43`, que le da la columna izquierda a Skayboy para siempre, así que
  la mano izquierda del teclado es la suya. Cada tecla **aprieta el mismo botón del mando** que
  el dedo (se ve hundido, y el motor lee lo de siempre): no hay un segundo camino de control.
- **Cómo:** el mapa vive en `src/lib/skayboy/teclado.ts` (módulo hoja, probado en Node) y lo
  leen la isla y la página. Se lee `KeyboardEvent.code` —la posición, no la letra—, así que en
  un teclado francés Z Q D mueven a Skayboy sin configurar nada. Con Ctrl, Alt o la tecla de
  sistema no se aprieta nada (`Ctrl+D`, `Alt+←` y `Cmd+W` siguen siendo del navegador); las
  seis teclas del mapa no desplazan la página; S y la flecha para abajo no hacen nada (nadie se
  agacha); si la ventana pierde el foco con una tecla apretada, se suelta todo.
- **Lo que se ve:** cada botón del mando lleva impresa su tecla (W, A, D, ↑, ←, →) **solo donde
  hay mouse** (`hover: hover` y `pointer: fine`): en un teléfono no hay teclado que nombrar. Y
  cada botón la declara en `aria-keyshortcuts` para el lector de pantalla.
- **Y la confirmación del usuario:** dijo que los seis niveles son jugables. Cierra las notas de
  excepción de `D-51` punto 2 en `PRD-skayboy-y-poligirl.md` y en `CTR-16.7`, en lo que dijo: que
  se juegan. No dijo si fue de a dos ni en qué aparato.

---

## D-54 — La mesa y la carátula: el sitio en una pantalla ancha deja de ser un teléfono en el medio

- **Fecha:** 2026-10-02
- **Estado:** aceptada — pedido directo del usuario.
- **El pedido, textual:** *"Hacé un ciclo entero y complejo de mejora visual de desktop para
  el home y todos los juegos. Debe quedar profesional y lindo en ambas formas desktop y
  mobile."*
- **Consume:** `D-09`, `D-14`, `D-17`, `D-19`, `D-21`, `D-49`, `UX-01`, `UX-04`, `UX-10`,
  `UX-24`, `UX-25`, `UX-28` §5, `.claude/rules/diseno-marca.md`,
  `.claude/rules/voz-ricotera.md`, y el traspaso
  `HILO-para-experiencia-el-escritorio-tampoco-cuenta-la-cabecera.md`.

- **Lo medido antes de tocar nada, a 1440 × 900.** El portal era una columna de 736 px: dos
  casetes por renglón, el noveno solo y torcido, y 350 px de negro a cada costado. Cada juego
  era una columna de 544 px; arrancada la partida **no quedaba nada en pantalla que dijera qué
  juego era**, y el tablero de las preguntas terminaba a un tercio del alto con dos tercios de
  negro abajo. Los ocho títulos de juego estaban escritos a mano en ocho páginas y habían
  derivado a cuatro formas (la rotulada a 1,5 rem, a 2,3 rem, la del sistema en negrita, la del
  sistema a 1,75 rem), los ocho con la negrita falsa que el navegador le pone a un `h1`. Tres
  botones principales iban en el rojo de la marca por defecto, sin que nadie lo hubiera
  elegido. Y Skayboy, a ×4, dejaba las teclas de abajo fuera de la ventana (el traspaso de
  `T-271`, abierto desde el ciclo 16).

- **Decisión.**
  1. **En una pantalla ancha la hoja se apoya en una mesa, al lado de la carátula del casete.**
     Desde 64 rem cada juego es una grilla de dos columnas: a la izquierda la carátula —la
     marca, la misma pieza de tapa que el juego tiene en el portal, la etiqueta de papel con el
     nombre y el número de pista, y la lista de temas del lado A y del lado B—; a la derecha la
     hoja, en `--ancho-tablero` (38 rem). La carátula se queda pegada mientras se desplaza.
  2. **La lista de temas no está mientras se juega.** Son salidas, y en plena partida no hay
     salidas: es el criterio que ya aplica la portada de cada juego —la cinta de regreso vive
     solo ahí, y la isla la esconde al arrancar (`quiz.astro`, sobre el flujo de `UX-01`, que
     lo dice como "un tap por decisión")—. Con un tablero a la vista (`#partida`, `#pregunta` o `#tablero`) la
     carátula muestra solo la pieza y el nombre. En la portada y en el resultado, la lista
     está, y es la forma de pasar de un juego a otro sin volver a la puerta.
  3. **En el teléfono la carátula es una calcomanía** en la esquina de la cabecera, en el hueco
     que estaba vacío a la derecha de "← AL ARCADE": la pieza y el número de pista ("A3"). Se
     va con la cabecera cuando arranca la partida.
  4. **El portal se ensancha a `--ancho-mesa` (76 rem):** el frente en dos columnas (la marca y
     el afiche de octubre), el lado A en tres por tres, el lado B centrado con el mismo ancho
     de casete. Desde 80 rem el casete crece (la pieza a 84 px) y la bajada se lee entera; en
     el teléfono sigue la primera oración sola (`UX-25` §2.4).
  5. **Un solo título para los ocho juegos** (`.pantalla > h1`): la rotulada en su peso, la
     tinta del disco que viste el juego. Las páginas no lo reescriben.
  6. **Un solo botón principal:** la tinta del disco de cada juego y un canto de sombra dura en
     su apoyo, que se hunde al apretar —lo que ya tenían dos juegos, ahora de todos—. El
     "Compartí" del resultado sigue en *Gulp!* (`D-19`: resultado = Gulp!).
  7. **Skayboy acuesta la cabecera en un renglón** cuando el alto no sobra (desde 980 de ancho,
     o entre 500 y 800 de alto), con la bajada al costado del título en vez de abajo, y los
     cortes de ×3 y ×4 la cuentan (620 y 760 de alto). Cierra el traspaso de `T-271` con una
     tercera salida: no se saca la bajada.
  8. **"Ponelos en fila" va en dos paños desde 80 rem** (las filas y la bandeja lado a lado,
     la bandeja pegada), y **"Sacalo por la letra" suelta el buscador del pie de la ventana**
     en la mesa: va pegado a la hoja de versos.

- **Alternativas descartadas.**
  - **Agrandar el teléfono** (columna más ancha, letra más grande). `UX-10` §2.3 y §3.1 ya
    explicaron por qué no: el tablero calibrado a 34 rem no se juega mejor a 60, el mouse
    viaja más, y la letra de 28 px se lee como interfaz de televisor.
  - **Llenar los costados con decoración** (la tira de cinta de `UX-10` §4). Decora el vacío
    en vez de usarlo, y no resuelve lo que más pesaba: que en partida no se sabía qué juego
    era.
  - **Una barra de navegación arriba, de sitio de noticias.** Es la plantilla de cualquier
    sitio, y pone las salidas a la vista en plena partida.
  - **La foto de tapa de cada juego a pantalla entera.** Los archivos miden 400 a 600 px de
    ancho (`D-21`, baja resolución a propósito): a 1440 se ven al 40 %. Se queda detrás de la
    hoja, con un margen de sangre, y la carátula trae la pieza del disco a 1×.
  - **Carátula también para Skayboy.** El mueble del fichín es su propia carátula y a ×4 ocupa
    la mesa entera. Es la única excepción, escrita en `caratula.test.ts`.
  - **Esconder la bajada de Skayboy en el escritorio** (la salida 2 del traspaso). Se iba
    justo donde más lugar hay; acostada al lado del título entra entera.

- **Consecuencias.**
  - Seis medidas de marca nuevas en `tokens.css` (`--ancho-hoja`, `--ancho-tablero`,
    `--ancho-tablero-amplio`, `--ancho-caratula`, `--ancho-mesa`, `--aire-mesa`). `--ancho-hoja`
    es el 34 rem de siempre, con nombre; `--ancho-tablero-amplio` (52 rem) es el de "Ponelos en
    fila" en dos paños, y entró como token después de `REV-18` (`FIND-106`): estaba escrito en
    `juego.css`.
  - Cada página de juego (menos Skayboy) pide `caratulaDe()` de su ruta y viste
    `.juego--<disco>`, que es el mismo mapa de `.casete--<disco>` del portal: el casete que se
    toca en la puerta y el juego que abre no pueden vestir discos distintos. El pie acredita la
    pieza de la carátula (`D-21`, condición 1), que se ve en el teléfono y en la computadora.
  - Entran ocho pares a `contraste.test.ts`: los cinco botones en la tinta de su disco que no
    tenían par con nombre, y el título en la tinta del disco sobre la tapa velada (texto
    grande, 3:1) para los tres juegos que tienen foto de fondo.
  - **Cambia el teléfono, y nada de lo que cambia es de lugar:** la calcomanía de la cabecera;
    el título único (en "Completá la letra" pasa de la letra del sistema a la rotulada, en las
    preguntas pasa a la rotulada en el texto claro, y en los ocho —Skayboy incluido— pierde la
    negrita falsa); el eco de segunda tinta del título, que pasa del borde del papel al apoyo
    del disco en seis juegos (lo midió `REV-18`, `FIND-109`); y el botón con canto en la tinta
    de cada disco. El orden, los anchos y los cortes del teléfono no se tocaron: `REV-18`
    comparó el portal a 375, 320, 414 y 600 contra el `HEAD` de antes y dio idéntico.
  - **Dos ajustes a la regla de la lista, después de `REV-18`.** La elección de conjunto de
    "Ponelos en fila" (`#eleccion`) también esconde la lista: ya se tocó "Empezá"
    (`FIND-103`). Y en "Adiviná la tapa" la carátula esconde también la pieza en partida,
    porque el ojo de buey es de *Último bondi*, la respuesta de `TP-006` (`FIND-100`; el mismo
    motivo del `sinPasada` de su pie, `D-35` excepción 3). Queda la etiqueta con el nombre.
  - **La carátula va última en el documento**, aunque se vea a la izquierda: primera, ponía
    once enlaces entre el teclado y el "Jugá" (`UX-35` §6.2, `FIND-105`). Tiene tope de alto y
    se desplaza por dentro si no entra en la ventana, y con puntero táctil sus renglones miden
    48 px (`UX-35` §6.1, `FIND-102`, `FIND-104`).
  - **Queda pendiente reflejarlo en el lienzo** (una hoja 15, "La mesa"): entraron medidas de
    marca nuevas, y también nacieron fuera del lienzo decisiones de tinta —el botón y el título
    en la tinta del disco, el canto en su apoyo (y el del "Compartí", que es el rojo de *Gulp!*
    hundido al 45 % en el fondo), el eco del título en el apoyo—; el circuito de
    `diseno-marca.md` pide que empiecen en el diseño. La hoja
    está escrita (`Docs/SUGERENCIAS/lienzo-hoja-15-la-mesa.dc.html`, con las instrucciones en
    `HILO-para-experiencia-la-mesa-y-la-caratula.md`); pegarla exige republicar el lienzo
    entero, y eso lo decide el usuario.
  - `experiencia` escribe la hoja de la pantalla (`UX-35`) y enmienda `UX-10`, `UX-28` §5 y
    `UX-04`. `REV-18` la revisó con el código.

---

## D-55 — En la computadora, Skayboy y Poligirl no muestran sus botones: cada columna dice sus teclas

- **Fecha:** 2026-10-02
- **Estado:** aceptada — pedido directo del usuario, al cerrar el ciclo 17, textual: *"En
  desktop que no muestre los botones de skauboy y poligirl. Luego integra todo"*.
- **Consume:** `D-43`, `D-53`, `D-54`, `UX-10` §1, `UX-28` §2, `UX-33` §1.4.
- **Decisión.** Con mouse —el corte de capacidad `(hover: hover) and (pointer: fine)`, el
  mismo que desde `D-53` imprimía la letra de cada tecla— los seis botones del mando no se
  ven. **La columna se queda** y en su lugar lleva una leyenda: el nombre de quien la maneja
  (Skayboy a la izquierda, Poligirl a la derecha, `D-43`) y sus tres teclas armadas como en el
  teclado, la de saltar arriba y las de caminar abajo, que se encienden mientras se aprietan.
  En pantalla completa, con mouse, la columna se va entera. Sin mouse —teléfono, tableta,
  pantalla táctil grande— nada cambia: los botones son la única forma de jugar.
- **Cómo.** Los botones siguen en el documento, escondidos: la isla guarda en ellos qué tecla
  está apretada y el motor lee eso (`mandoDe`), así que el teclado los aprieta igual. La
  leyenda se enciende leyendo ese mismo estado con CSS (`.tecla--apretada`), sin tocar la isla.
  Las letras salen de `teclado.ts`, el mapa que aprieta los botones, y la frase para el lector
  de pantalla, de `TECLAS.comoSeMueve` en `lib/skayboy/copy.ts`.
- **Alternativas descartadas.**
  - **Sacar las columnas y agrandar el área.** Cambiaba los cortes de escala y el reparto de
    `UX-28 §2` en todos los tamaños de escritorio, para ganar un escalón en pocas ventanas; y
    se perdía el único lugar donde decir qué teclas mueven a quién.
  - **Esconder por ancho.** Una pantalla táctil grande se quedaría sin forma de jugar
    (`UX-10` §1: el ancho no dice que haya mouse).
  - **Poner las teclas en la cabecera.** La cabecera acostada de `D-54` ya va justa, y las
    teclas de cada personaje pierden su lado.
- **Consecuencias.**
  - `estilos.test.ts` falla si los botones se esconden afuera del corte de mouse, si con mouse
    siguen a la vista, o si la leyenda no nace escondida (los dos rojos vistos).
  - Medido con Chrome sin cabeza: a 1440×900 con mouse no hay botones, la leyenda está, la D
    enciende su tecla y mueve a Skayboy, y al soltar se apaga; a 1280×800 táctil y a 812×375
    en un teléfono los botones siguen, sin teclas afuera.
  - `UX-28` §2 y `UX-35` §5 describen la columna con sus botones: queda para `experiencia`
    sumar la leyenda.

## D-56 — Entra la analítica de Vercel: cuánta gente entra y a qué pantalla

- **Fecha:** 2026-10-02
- **Estado:** aceptada — pedido directo del usuario, textual: *"Activa el web analitics de
  vercel en el repo"*, con la pantalla de "Get Started" del tablero de Vercel adjunta.
- **Consume:** `D-02`, `D-10`, `D-14`, `D-15` (y `RES-15`), `ADR-08.7`.
- **Reemplaza:** la frase *"La analítica sigue fuera de alcance"* de `D-10`, y la fila
  correspondiente de `BRIEF.md`. El rol `analitica` sigue descartado (`EQUIPO.md`): esto es
  un script, no un frente de trabajo.
- **Decisión.** Vercel Web Analytics en todas las pantallas. El paquete `@vercel/analytics`
  (pineado exacto, 2.0.1) entra por una isla propia, `src/scripts/analitica.ts`, que se
  engancha en `Cabeza.astro`: esa cabeza la llevan todas las páginas, el quiz incluido, que
  no pasa por `Base`. La isla solo corre en el sitio publicado (`import.meta.env.PROD`).
- **Por qué esta y no otra.** Ya vive donde vive el sitio: el script sale del propio dominio
  (`/_vercel/insights/script.js`), no deja cookies y no le pide nada a la gente, ni
  consentimiento ni cuenta. **No cierra ningún molinete** (`D-14`). Tampoco abre un costo:
  el proyecto está en Hobby, donde un cupo agotado se frena y no se factura (`RES-15`).
- **Alternativas descartadas.**
  - **El `<Analytics />` que trae el paquete**, que es lo que muestra el tablero. Pone una
    etiqueta propia (`<vercel-analytics>`) adentro del `<head>`, el navegador cierra la
    cabecera al encontrarla y todo lo que viene después —las etiquetas de la tarjeta
    compartida, la ranura `cabeza` de `Base`— pasa al cuerpo. Y además llegaría al teléfono
    sin pasar por `islas.test.ts`, que es el que lleva la cuenta de qué paquete de npm llega
    (`ADR-08.7`).
  - **El `<script>` pelado de Vercel, sin paquete.** Funciona igual, pero queda escrito a mano
    y sin versión: el paquete se actualiza con `npm` y se ve en la lista blanca.
- **Consecuencias.**
  - `@vercel/analytics` es el segundo miembro de `PAQUETES_DE_CLIENTE` (`islas.test.ts`), y
    `analitica.ts` entra al censo de `ISLAS` (`estilos.test.ts`) como isla sin tablero.
  - Pesa 974 bytes comprimidos por página, en línea en el `<head>`; el script de Vercel se
    baja aparte y con `defer`.
  - En `astro preview` la consola avisa que no encuentra `/_vercel/insights/script.js`:
    es lo esperado, ese archivo lo sirve Vercel en el sitio publicado, no el repo.
  - Los números son del tablero de Vercel y de nadie más. **El sitio no los muestra**: sigue
    en pie lo de `UX-01`, nada de "tantos ricoteros jugaron hoy".
  - Si un bloqueador lo frena, no se pierde nada: ninguna pantalla depende de esto.

## D-57 — "¿Qué tipo de ricotero sos?" se rehace: una noche en cinco momentos, cuatro maneras que se dicen con orgullo, y el libro de *Luzbelito* como única pieza

- **Fecha:** 2026-10-04
- **Estado:** aceptada — pedido directo del usuario, textual: *"Hacé un ciclo entero de
  mejora importante sobre el juego de qué tipo de ricotero sos, mejora artística, de
  preguntas, de resultado y de otras cosas que analices que se puedan mejorar."*
- **Consume:** `US-06`, `BR-17`, `CTR-08`, `ADR-02`, `UX-02`, `UX-06`, `UX-20` §2, `UX-22`
  §12.6, `UX-35`, `CNT-09`, `CNT-26`, `REV-07`, `D-14`, `D-17`, `D-19`, `D-21`, `D-33`,
  `D-50`, `D-51` punto 6, `D-52`, `D-54`, `D-56`, `RES-150`..`RES-171` (`INV-150`),
  `.claude/rules/voz-ricotera.md`, `.claude/rules/diseno-marca.md`.
- **Cómo se llegó.** Siete lectores relevaron el juego (contrato, contenido, visual, código,
  deudas, investigación y un crítico de completitud); tres diseñadores propusieron tres
  conceptos completos e independientes ("la noche del recital", "el libro de *Luzbelito*",
  "la identidad que se comparte") y tres jueces los puntuaron por reglas, por oficio y por
  factibilidad. Los tres jueces eligieron la tercera como base, con injertos de las otras dos.
  Esta decisión es esa síntesis.

- **Lo que estaba mal, medido el 2026-10-04 sobre `bc27cd4`.**
  1. Un doble toque contestaba la pregunta siguiente sin leerla: el clic avanzaba en el mismo
     tick y las opciones nuevas caían en el mismo lugar. Corrompía en silencio el único
     resultado que da el juego.
  2. El foco caía al `<body>` en cada pregunta y en el resultado; ninguna región viva.
  3. **Ni una escena del banco era del mundo ricotero** (asado, planta, mueble, playa): un test
     de revista con título ricotero. `CNT-09` le había dejado la pregunta a `producto` en el
     ciclo 8 y nadie la contestó. Siete ítems medían otra cosa o cruzaban de eje; quedaban
     marcas de género; once de veinte enunciados cerraban con "¿Qué hacés?".
  4. Los cuatro resultados eran astros (Estrella fija, Cometa suelto, Luna llena, Eclipse
     repentino): el horóscopo que la regla de voz veta, y **no halagaban parejo**: los de luz
     describían placeres, los de oscuridad cómo aguantás algo malo.
  5. El resultado no tenía arte; el rombo dejaba las dos caras de luz siempre arriba (la
     jerarquía que decía evitar), con el punto a 2:1 de contraste y las etiquetas a 9,5 px.
  6. Compartir era texto y enlace, con la vista previa genérica del sitio; el que llegaba leía
     "A alguien le salió «X»" sin saber qué era X, y al terminar no se comparaba.
  7. "Probá de nuevo" sonaba a haber fallado y repetía la mitad de las preguntas.

- **Decisión.**
  1. **La partida es una noche de recital en cinco momentos**: *la previa*, *la ida*, *la
     vereda*, *adentro* y *la vuelta* ("la ida" y no "el viaje": rima con la vuelta, y
     "viaje" es psicodelia de utilería en voz-ricotera §7). En cada momento sale un ítem de cada eje, en orden al
     azar dentro del momento: siguen siendo diez preguntas, cinco por eje, impar (`BR-17`
     regla 3 intacta). Cada momento tiene su sello y una línea que canta.
  2. **El recital es "un recital", sin dueño.** Nunca la banda, sus temas, el Indio, la misa,
     el pogo ni el aguante. Los Redondos no tocan desde 2001 y el Indio murió el 5-jun-2026:
     la noche es la de cualquiera que sale a ver música, contada en presente. Nada pide haber
     ido nunca, saber algo, tener plata ni un cuerpo capaz de algo, y nada es una cuestión de
     seguridad disfrazada de temperamento (volver de noche sin compañía, hablar con
     desconocidos, la multitud apretada). Las reglas las fija `producto` en `BR-36` y las
     vigila un test **escrito antes que el banco**.
  3. **Esto da vuelta, por escrito, el criterio con el que se retiró `EJ-011`** ("el sabor
     ricotero funciona como credencial de pertenencia"). `BR-17` prohíbe ejes que midan
     conocimiento, no escenas del ritual: la escena es de todos, y lo que no puede pasar es que
     una de las dos opciones sea "más de adentro" que la otra. Esa prueba es por ítem y la
     corre `REV-19` desde cuatro lugares: *nunca fui*, *sin plata*, *con silla de ruedas* y
     *volviendo de noche sin compañía*.
  4. **Treinta ítems nuevos** (`EJ-029`..`EJ-058`), tres por celda (momento × eje). Se retiran
     los veinte listos de hoy, con nota y sin reciclar ids. Con tres por celda, tres noches
     seguidas no repiten ninguna escena.
  5. **Cuatro maneras, con nombre de cosa y sin persona gramatical**, para que se digan igual
     en "me salió", "te salió" y "le salió" (es una excepción declarada a voz-ricotera §4.2: la
     segunda persona vive en "Esta noche te salió", no en el nombre):
     - `CU-1`, luz + orden: **«Mesa larga a las nueve»**
     - `CU-2`, luz + caos: **«Ronda en cualquier esquina»**
     - `CU-3`, oscuridad + orden: **«Radio bajita, misma hora»**
     - `CU-4`, oscuridad + caos: **«Mochila liviana, sin mapa»**

     El sistema se arma solo: luz es algo de gente (mesa, ronda), oscuridad algo de uno
     (radio, mochila); orden es una hora o un lugar puestos, caos lo abierto. Los ids y sus
     polos **no se mueven**: un enlace viejo con `r=CU-3` sigue diciendo oscuridad + orden, y
     un test lo ata. Las bajadas las escribe `contenido` (`CNT-30`): un placer y un costo,
     **los cuatro costos con la misma forma**, y ninguno de oscuridad dicho como exclusión.
     Alternativas que quedan anotadas por si el usuario prefiere otra, como en `D-52`:
     «Mate en cualquier esquina» (`CU-2`) y «Libro con señalador» (`CU-3`).
  6. **El resultado es "esta noche", no una esencia.** Rótulo "ESTA NOCHE TE SALIÓ" en vez de
     "Diste con esto"; "Empezá otra noche" en vez de "Probá de nuevo", con escenas que no
     salieron en la visita (en memoria, sin `localStorage`). Debajo, la línea seca que nombra
     los dos polos ("Con la gente, con plan."), que traduce las puntas que hoy nadie traducía.
  7. **El plano pasa a ser una grilla de dos por dos relativa**: tu manera primero, al lado la
     que comparte tu polo de luz-oscuridad, abajo la que comparte tu polo de orden-caos, y en
     diagonal la opuesta. Para cada persona "primero" es la suya, así que ninguna queda fija
     por encima de otra. Sin punto, sin graduación: los cuatro nombres en papel, cada uno con
     su bajada para leer. Es texto HTML, no un SVG escalado. *(Desde `D-62` enmienda 2, del
     2026-10-05, vuelve también un plano de dos ejes, relativo y sin punto, arriba de la
     grilla, que se queda; y desde la enmienda 3, fijo como el rombo, por decisión del usuario.)*
  8. **Una sola pieza de arte para los cuatro: el libro de *Luzbelito*.** El disco salió como
     un libro de tapas de cartón con lomo de cuero (`RES-168`): el mármol, el lomo y el
     esquinero se recortan del frente, **sin el óvalo, sin la figura y sin la palabra
     LUZBELITO**. Es la tapa de la portada del juego (con el índice de los cinco momentos en
     una etiqueta de papel), el canto de las hojas en la partida y la esquina de la última
     hoja en el resultado, la tarjeta y la vista previa. **Ninguna pieza se asigna a un
     cuadrante**: los tres jueces coincidieron en que un pedazo por identidad deja siempre una
     más linda.
  9. **Sin velas en lo nuevo y sin el verso de «Juguetes perdidos».** Dos velas encendidas, el
     verso de cierre de los shows del Indio y "esta noche", cuatro meses después del 5 de
     junio, se leen como un velorio aunque ningún texto lo diga. El verso, además, está en
     `borrador` en "Completá la letra" (`CL-1000`): nadie lo confirmó de oído. Si el usuario lo
     confirma y lo quiere, entra después sin tocar nada más. La vela de la carátula y del pie
     (`D-51`, `D-54`) no se toca: no es de este ciclo.
  10. **Compartir con imagen, y una vista previa por identidad. Revierte `D-51` punto 6 para
      este juego.** Como hay solo cuatro identidades y ninguna lleva un dato de la persona,
      todo se fabrica una vez y queda fijo: un taller en Node (`sharp` y `fontkitten`, con las
      letras reales del sitio) dibuja cuatro tarjetas de 1080 × 1350, cuatro vistas previas de
      1200 × 630 y la del juego, con un manifiesto que un test vigila. La isla baja la tarjeta
      al pintar el resultado, así `navigator.share({ files })` sale en el mismo toque.
  11. **Cuatro postales**, `/juegos/dos-ejes/cu-1/` a `cu-4/`, cada una con su `og:image` y su
      `og:title` ("Me salió «Mesa larga a las nueve»"). Muestran la manera del amigo —qué
      es X, antes de jugar— y un botón que arranca la noche directo, con el desafío puesto.
      El enlace que se comparte es la postal; los viejos `?g=dos-ejes&r=CU-n` siguen andando.
      Al terminar, una línea neutra de contraste (`CNT-29`): misma manera, comparten un polo,
      u opuestas. Nunca ganar ni perder.
  12. **El toque se confirma y se bloquea.** Las dos opciones quedan inertes en el acto, la
      elegida cambia de forma (borde grueso, apretada contra el papel, `aria-pressed`) y la
      otra no se apaga. La siguiente llega a los `--pausa-eleccion` (600 ms, un token de
      **espera** y no de movimiento: con movimiento reducido no se va a cero, porque es lo que
      tapa el doble toque). No choca con "el avance lo manda el dedo" del quiz: aquello es no
      cortar una explicación por reloj; acá el toque **es** el avance y no hay nada que leer.
  13. **Accesibilidad y teclado.** El foco va al enunciado de cada pregunta y al nombre del
      resultado; las opciones van en `role=group`; el avance se anuncia en una región viva.
      "Volvé a la anterior" desde la segunda pregunta (sin `pushState`: inflaría las vistas de
      `D-56`). Con teclado, 1 y 2 eligen y Retroceso vuelve.
  14. **La portada, la partida y el resultado en el idioma del sitio**: la tapa del libro con
      su etiqueta, la pregunta en una hoja de papel con el sello del momento y el canto de las
      que faltan, las opciones como etiquetas de papel de igual peso (lado a lado en la mesa,
      donde arriba y abajo ordenarían), el resultado como la última hoja con la marca arriba
      —la captura sale con contexto— y la cinta "Volvé al arcade" en vez del enlace subrayado.
      Ningún hex nuevo; nada se anima salvo el sello del momento con los tiempos de siempre.

- **Alternativas descartadas.**
  - **Una pieza de tapa por identidad** (las cuatro luces del libro, o cuatro pedazos en una
    sola tinta): aun con la luminancia igualada por máquina, a 72 × 96 px siempre hubo una más
    linda (la vela gruesa, el cielo) y una más pobre (la pared, las piedras). Y `UX-20` §2 ya
    advertía que estampar un resultado con una tapa sugiere que hay que reconocerla.
  - **Un tema o un verso por cuadrante**: ubica la obra en el plano, que el usuario descartó
    en `US-06`.
  - **"Sumá otra tanda" acumulando respuestas** (5 → 9 → 13 por eje): sostiene mejor la
    identidad, pero redefine "partida" en `BR-17` y lleva la sesión a 26 preguntas, contra los
    dos o tres minutos de `CLAUDE.md`.
  - **Siete por eje**: mejora la estabilidad de 4 a 8 puntos a cambio de cuatro preguntas más,
    y rompe los cinco momentos. La inestabilidad se asume en el texto ("esta noche").
  - **Un sello "EL 7 CUMPLE 30"** por el aniversario de *Luzbelito*: `RES-167` pone esa fecha
    en duda (`HILO-para-investigador-y-contenido-la-fecha-de-luzbelito.md`).
  - **Tarjeta dibujada en canvas en el teléfono**: pierde el gesto en Safari (dibuja con
    `await` antes de compartir) y no sirve como vista previa.

- **El contrato de datos que comparten todos los roles** (`CTR-08` v2 lo formaliza):
  - El banco suma `momentos`: cinco objetos `{ id, nombre, canta }` en el orden de la noche
    (`previa`, `ida`, `vereda`, `adentro`, `vuelta`). `nombre` es el sello (registro 3) y
    `canta` la línea de registro 1.
  - Cada ítem `listo` suma `momento` (uno de esos cinco ids). Los retirados no lo llevan.
  - `momentos.length === preguntasPorEje` (hoy 5) y cada celda momento × eje tiene al menos
    tres ítems listos: lo vigila el test.
  - Los cuadrantes conservan forma e ids; cambian nombre y bajada. `Resultado` sigue siendo
    tres strings sin números.
  - La traducción de los polos ("Con la gente", "Por tu cuenta", "Con plan", "Sobre la
    marcha") es copy, en `src/lib/dos-ejes/copy.ts`.

- **Consecuencias.**
  - **`producto`**: enmienda `US-06` con fecha (cinco momentos, piso de 30 con 3 por celda,
    tarjeta y postales en el criterio 4) y escribe `BR-36` (la frontera entre escena y
    credencial, con sus vetos) y `BR-37` ("esta noche", y "otra noche" sin repetir en la
    visita).
  - **`arquitectura`**: `CTR-08` v2 y su schema; enmienda `ADR-02` con la forma por ruta.
  - **`experiencia`**: `UX-36`, y enmiendas en voz alta de `UX-06` (lo que reemplaza), `UX-20`
    §2 y `UX-22` §12.6 (entra un recorte pegado; sigue sin imprenta ni estampa).
  - **`contenido`**: `CNT-30` (los 30 ítems, los cinco momentos, los cuatro nombres y bajadas,
    el copy de pantallas), `CNT-29` (el contraste al volver) y la fila nueva en `CNT-01`.
  - **El hilo principal**: el motor, la isla, las postales, el taller de tarjetas, los estilos
    y las guardas. `fontkitten` y `sharp` se declaran en `devDependencies`; entra
    `scripts/fuentes/archivo-black.ttf` con su licencia OFL, solo para el taller.
  - **`revisor`**: `REV-19`, adversarial sobre el conjunto y no ítem por ítem, antes de
    integrar.
  - El posteo 5 del hilo de Twitter (`difusion/hilo-twitter/`) describe el rombo y los nombres
    viejos: queda desfasado y se anota en `ESTADO.md`.
  - Los enlaces que ya circulan con "Estrella fija" van a abrir con el nombre nuevo del mismo
    cuadrante. Se acepta: viaja el id.

- **Enmiendas del 2026-10-04, al construir** (las escribe el hilo principal; lo de arriba queda
  como se decidió):
  1. **El polo de oscuridad se traduce "con lo propio", no "Por tu cuenta".** El contrato de
     datos decía "Por tu cuenta" y se rompía donde la línea viaja ("Me salió…: por tu cuenta"
     se lee como un reproche). `CNT-30` pasó primero a "por cuenta propia", y la lectura
     adversarial encontró al cuentapropista: una palabra de trámite al lado de "con la
     gente", que es como el sitio nombra a quien juega. Queda "con lo propio", con la misma
     forma que su par. Las cuatro van en minúscula en `POLOS` (`copy.ts`).
  2. **La tapa de la portada son tres piezas, no la franja** (`UX-36` §2.2). A 343 px la franja
     mide 91 de alto y estirarla engorda el lomo: el mármol, el lomo y el esquinero se
     recortan aparte y se acomodan al alto de la etiqueta. La franja queda solo para el
     taller (el libro bajo la hoja de la tarjeta), y el canto de las hojas lo pintan las
     sombras, así que la pieza `canto` se retira. La guarda de lo prohibido no cambia.
  3. **El enlace viejo no redirige a la postal** (`ADR-02` punto 6, contra la propuesta de
     `UX-36` §3.3): la isla le pega a la tapa la misma etiqueta del amigo que la postal trae
     escrita, y esconde el renglón del lugar. El subtítulo no se pisa nunca, y la línea
     `PANTALLA_0.desafio` se retira.
  4. **La sans de la tarjeta va en DejaVu, recortada y como trazos** (`scripts/fuentes/`, con
     su licencia). La primera pasada la dejaba a la fuente del sistema, y así el taller no
     podía medir: el crédito y la línea que nombra se salían del papel sin que nada fallara.
     Ahora cada renglón se mide antes de dibujarlo, el taller falla si algo no entra, y el PNG
     sale igual en cualquier máquina (`VERSION_DEL_DIBUJO` 2).
  5. **El toque usa `aria-disabled` y no `disabled`**, y la región viva es una sola, escrita en
     el HTML de la página (`UX-36` §4.3 y §8.2): con `disabled` el botón tocado perdía el foco
     y el lector no llegaba a decir "apretado", y una región que nace con su texto no se
     anuncia de forma fiable.
  6. **El sello del cuarto momento dice "Cuando suena", no "Adentro"** (el `id` sigue siendo
     `adentro`: lo ata el schema). El sello daba por hecho que quien juega entró, y `BR-36`
     veto 3 dice que una escena de adentro tomada por la normal deja afuera otra vez al que
     se quedó en la vereda (`RES-154`). Las seis escenas de ese momento ya se oyen igual desde
     afuera desde la vuelta 2 de `CNT-30`; faltaba el nombre. La propuesta es de `contenido`
     (`Docs/SUGERENCIAS/CNT-para-hilo-principal-vuelta-2-dos-ejes.md` §4) y se toma tal cual.
  7. **Qué puede suponer una opción de luz**, para cortar una oscilación. Tres vueltas de
     lectura adversarial empujaron la luz de un lado al otro: con alguien presente excluía a
     quien fue sin compañía; sin nadie al lado pasó a mandar mensajes y excluyó a quien no
     tiene saldo; con "mi hermana" o "mis viejos" excluyó a quien no los tiene; con
     desconocidos cae en el veto 6 de `BR-36`. Ninguna luz es posible sin otro: **es la
     definición del eje** (`BR-17`, el usuario lo eligió). Queda así:
     - La luz **puede** suponer a alguien —en el enunciado, al lado o a distancia—. El cuarto
       lugar de la prueba es *volviendo de noche sin compañía*: mira la seguridad de la
       vuelta, no exige que toda luz se pueda elegir sin nadie.
     - **No puede:** nombrar un parentesco (le cierra la opción a quien no lo tiene; se dice
       *alguien tuyo*, *quien vino con vos*, *los de casa* solo si el enunciado ya los puso),
       hablar con desconocidos (veto 6), ni ser la distracción del que no está mirando
       (filmar, cuchichear durante el tema): eso la hace "menos de adentro".
     - **Teléfono, como mucho en un tercio de las luces.** Es una forma de estar con otro, no
       la forma.
     - El balance lo mira `REV-19` sobre el banco entero, no ítem por ítem: si quien fue sin
       compañía no tiene **ninguna** luz posible en un momento, eso sí es un defecto.

## D-58 — La rotulada vuelve a ser Archivo Black: el archivo del sitio no traía la A-Z

- **Fecha:** 2026-10-04
- **Estado:** aceptada — la tomó el hilo principal dentro del pedido del ciclo 18 (*"y de
  otras cosas que analices que se puedan mejorar"*). Es la corrección de un defecto, no un
  cambio de diseño: el diseño ya pedía esta fuente.
- **Consume:** `.claude/rules/diseno-marca.md` (tabla de fuentes: `--fuente-rotulada`,
  Archivo Black, "completa, es el repuesto de todo"), `D-54`, `RES-30`..`RES-43`.
- **Lo que pasaba.** `public/fuentes/archivo-black.woff2` (14 KB) era el subconjunto
  *latin-ext* de Google Fonts: traía Ā, Ă, Ő y compañía, y **ni una letra de la A a la Z, ni
  las tildes del castellano, ni las cifras**. El navegador la bajaba y la daba por cargada, y
  cada título y cada botón del sitio caía letra por letra a la de repuesto: Arial Black en una
  computadora con Windows o Mac, la sans del sistema en Android y en Linux. Nada fallaba, así
  que nadie lo vio. El ciclo 18 lo encontró mirando por qué el nombre del resultado de "¿Qué
  tipo de ricotero sos?" salía fino: dibujado con repuesto serif, solo "ĀĂ" salía en Archivo
  Black.
- **Decisión.** El archivo pasa a ser Archivo Black 1.006 (la misma fuente y la misma versión,
  OFL) recortada a latín y latín extendido con `pyftsubset`: 26,6 KB. La regla `@font-face`,
  el nombre del archivo y la precarga de `Cabeza.astro` no cambian.
- **Lo medido antes y después** (Chromium, portal, quiz, los ocho juegos y la Redondopedia, a
  375 × 667 y a 1366 × 657): ningún desborde horizontal en ninguna; todos los botones de
  arranque siguen arriba del pliegue. Lo único que se mueve: el título de "Sacalo por la letra"
  pasa a dos renglones en el teléfono y su botón baja de 471 a 497 px (el pliegue está en
  667). A ojo, la diferencia es la que el diseño pedía: "JUGÁ", los sellos y los títulos
  salen por fin en la letra de marca.
- **Consecuencias.**
  - `src/lib/fuentes.test.ts` abre el `.woff2` (Brotli de `node:zlib`, sin dependencias), lee
    su `cmap` y falla si no cubre lo que el sitio escribe en rotulada. Con el archivo viejo
    falla con la lista entera; con el nuevo pasa.
  - El TTF completo de la misma fuente vive en `scripts/fuentes/` con su licencia: lo usa el
    taller de tarjetas de `D-57`, y de ahí se vuelve a sacar el `.woff2` si hiciera falta.
  - En Windows y Mac el cambio casi no se nota (Arial Black y Archivo Black son primas); en
    Android es otro sitio. Las mediciones de ciclos anteriores en Linux se hicieron con la
    letra de repuesto, que es más angosta: si una pantalla quedó justa, puede haber cambiado.

## D-59 — El dominio es fichinricotero.com.ar, comprado en NIC Argentina

- **Fecha:** 2026-10-04
- **Estado:** aceptada — la tomó el usuario. Pidió *"investigá dónde y cómo comprar lo más
  barato posible el dominio arcadericotero.ar o fichinricotero.ar"*, después *"vamos a probar
  con fichinricotero, si entra de una nos quedamos con ese"*, y al final *"ya compré y pagué,
  metelo en Vercel"*.
- **Consume:** `D-15` (salida estática en el tier gratuito de Vercel), `D-56`, `D-57` (la
  tarjeta de "¿Qué tipo de ricotero sos?" lleva el dominio dibujado).
- **Lo que se averiguó.** Los `.ar` los vende un solo registro, NIC Argentina, y los
  revendedores cobran el mismo arancel más su margen: lo más barato es ir directo, por TAD con
  Clave Fiscal nivel 2. Arancel vigente (Resolución 5/2024 de la Secretaría Legal y Técnica,
  desde el 15/01/2024, sin cambios posteriores encontrados): `.ar` a secas $25.500 por año,
  `.com.ar` $8.500 por año, igual el alta que la renovación. No se pudo leer la tabla en nic.ar
  (la red del entorno lo bloquea): sale de la prensa que la cita.
- **Lo que pasó con arcadericotero.com.ar.** El pedido no dio para pagar. NIC lo caratuló como
  *"Alta de dominio de internet banquinado/zona especial"* y lo pasó a revisión manual de su
  área de Registro y Validación. "Banquinado" es un término que NIC bloquea contra el phishing.
  **Sospecha, no confirmada:** el término es *arca*, el nombre de la ex AFIP. Ese trámite quedó
  abierto; si se aprueba y no se paga, NIC lo cancela solo y no cobra nada.
- **Decisión.** El dominio público es **`fichinricotero.com.ar`**: entró sin revisión y se pagó
  el mismo día. Lo tiene el usuario a su nombre en NIC. En Vercel va el dominio pelado como
  principal y `www.fichinricotero.com.ar` redirigiendo a él; en NIC se delega a
  `ns1.vercel-dns.com` y `ns2.vercel-dns.com` (NIC no guarda registros DNS, solo delega).
- **Lo que esta decisión no decide: el nombre.** Lo decidió aparte `D-60`, en otra rama y el
  mismo día: el sitio se llama Fichín Ricotero, y al calco de `--fuente-titular` se le
  derivaron la F, la H, la N y la Í que no tenía.
- **Consecuencias.**
  - `astro.config.mjs` pasa a `site: 'https://fichinricotero.com.ar'`. De ahí salen
    `og:url`, `og:image` y el dominio que el taller dibuja en las cuatro tarjetas `cu-*.png`,
    que se regeneraron con `npm run generar-dos-ejes` (las `og-*` salieron idénticas).
  - Los enlaces del hilo de Twitter (`difusion/hilo-twitter/`, sin publicar) apuntan al
    dominio nuevo.
  - `arcade-ricotero.vercel.app` sigue respondiendo: ningún enlace viejo se rompe. Los ejemplos
    con ese dominio en `Docs/ARQ/` son de `arquitectura` y quedan como historia; la base nueva
    mide 29 caracteres contra 34, así que el presupuesto de largo de `ARQ-link-resultado-compartido`
    sobra.
  - **El orden importa:** este cambio entra a `main` recién cuando el dominio responda por
    HTTPS. Antes, toda vista previa apuntaría a un dominio que todavía no resuelve. Entró el
    2026-10-05, con el dominio andando según el usuario; al fusionar, las tarjetas del taller se
    volvieron a dibujar sobre las de `D-60`, con su marca y este dominio.
  - **Se renueva todos los años en NIC**, desde TAD; vencido hay 45 días de gracia. Si se deja
    vencer, el sitio sigue vivo en `arcade-ricotero.vercel.app` y basta con volver `site` atrás.

## D-60 — El sitio se llama Fichín Ricotero: el dominio de Arcade Ricotero no se pudo comprar

- **Fecha:** 2026-10-04
- **Estado:** aceptada — pedido del usuario, textual: *"Vamos a cambiar el nombre de la pagina
  por fichin ricotero. Hace los cambios pertinentes. Esto se debe a que arcade ricotero no se
  podia comprar el dominio. Dale que sale hoy la pagina al publico"*. Entre tres maneras de
  escribir la marca, el usuario eligió derivar las letras que faltaban para que quede entera en
  la letra de la tapa. La tilde de *Fichín* la pone la ortografía, no una preferencia.
- **Consume:** `D-59` de la rama `dominio/fichinricotero` (el dominio; sin integrar al escribir
  esto), `RES-43` y `RES-39` (Oktubre Calco y el paso 5 del flujo foto→fuente), `D-58` (la
  rotulada y `fuentes.test.ts`), `D-17` (la voz), `.claude/rules/diseno-marca.md`.
- **El número.** `D-59` está tomado dos veces: la rama del dominio y la reserva del ciclo 19
  (`IDS.md` de esa rama). Por eso esto es `D-60`, con su fila propia.
- **Lo que cambia en lo que se ve.**
  - **El nombre** es *Fichín Ricotero*, con tilde; en el logo, `FICHÍN RICOTERO`
    (`PORTAL.titulo`). Lo llevan las cuatro formas de la marca (la grande del portal, la chica
    del cascarón, la de la cabecera de cada juego y la de la carátula), los dos pinceles que
    dibujan en el teléfono (`tarjeta.ts`, `lamina.ts`), las nueve tarjetas del taller de "¿Qué
    tipo de ricotero sos?" (regeneradas con `npm run generar-dos-ejes`), la pestaña, el
    `og:site_name`, los `aria-label` y el ícono.
  - **En lo que la gente comparte**, como nombre común: *"en el fichín ricotero"*, donde decía
    *"en el arcade ricotero"*. Fichín es la palabra de acá para la máquina de fichas; el nombre
    nuevo, además de tener dominio, es la palabra castellana que `D-17` pide cuando existe.
  - **Los botones que nombran el lugar:** *Volvé al fichín* y la cinta *← AL FICHÍN*.
  - Las imágenes que bajan los dos pinceles se llaman `fichin-ricotero-*.png` (las tarjetas
    de "¿Qué tipo de ricotero sos?" siguen saliendo con el nombre de su manera,
    `cu-1-dos-ejes.png`, sin el del sitio); el asunto del correo de corrección dice
    *"Corrección del fichín ricotero"*.
- **Lo que no cambia, a propósito.**
  - **Los nombres internos.** La clave `arcade.` de `localStorage` (`ADR-04.5`: cambiarla borra
    el avance de Skayboy y el récord de "Más o menos" de quien ya jugó), las clases
    (`.portada-arcade`), los `$id` de los schemas (`ricotaarcade.local`), los nombres de
    variable (`volverAlArcade`), el repo y el proyecto de Vercel (`arcade-ricotero`, el que
    nombra `BAJAR-EL-SITIO.md`). Nada de eso lo lee la gente.
  - **El dominio.** `site` sigue en `arcade-ricotero.vercel.app`: el cambio es de `D-59`, que
    espera a que `fichinricotero.com.ar` responda por HTTPS. Al escribir esto el dominio no
    resuelve (8.8.8.8: dominio inexistente), y con `site` apuntando ahí cada enlace compartido
    perdería su vista previa. Mientras tanto el sitio se llama Fichín Ricotero y vive en la
    dirección de Vercel.
  - **Los papeles viejos.** Los `D-`, `UX-`, `CNT-`, `ADR-` y `REV-` anteriores siguen diciendo
    Arcade Ricotero donde lo decían: son la traza de lo que se decidió con ese nombre.
- **Oktubre Calco v0.4.** FICHÍN pide cuatro letras que el calco no tenía (traía once, `RES-43`).
  Se derivaron con el paso 5 de `RES-39`, sin dibujar: recortando y pegando con operaciones
  booleanas pedazos de las letras calcadas, así heredan el borde comido de la tapa. **F** = la
  E sin el brazo de abajo; **H** = dos palos de I y el brazo del medio de la E de travesaño;
  **N** = dos palos de I y una diagonal del grosor del palo; **Í** = la I y un acento de la
  misma tinta. Las métricas no se tocan: el acento sube a 856 sobre un `usWinAscent` de 800, y
  se probó en Chromium sobre Windows, en HTML y en canvas, que se dibuja entero. Lo hace
  `scripts/derivar-oktubre-calco.py` (fontTools + skia-pathops) desde la v0.3 de
  `Docs/INVESTIGACION/Tipografia/`, con las fechas de `head` fijas: volver a correrlo da el
  mismo archivo byte a byte, y la huella del taller de tarjetas no cambia. La F y la N dejan
  a la derecha el mismo aire que las letras calcadas (33 a 34 unidades). La alternativa que
  la regla de marca daba para las letras que faltan —la palabra en la rotulada— habría
  dejado el logo con dos letras distintas.
- **Consecuencias.**
  - `src/lib/fuentes.test.ts` suma un lector de WOFF y tres casos: la marca entra en el calco;
    los dos pinceles y el taller dibujan `PORTAL.titulo`; ninguna marca escrita en una página
    pide una letra que el calco no tenga. Con el calco viejo fallan con `[F, H, Í, N]`.
  - `diseno-marca.md`: el nombre, la tabla de fuentes (v0.4) y la deuda de las tildes, que se
    achica a todo menos la Í.
  - **Cuando `D-59` entre a `main`**, las tarjetas del taller y su manifiesto
    (`scripts/dos-ejes-manifiesto.json`) chocan. Se resuelve volviendo a correr
    `npm run generar-dos-ejes`, que dibuja la marca de acá y el dominio de allá. Los demás
    choques son de texto: el final de `DECISIONES.md` e `IDS.md` y el bloque de arriba de
    `ESTADO.md`.
  - El hilo de difusión pasó al nombre nuevo en el commit `be7b9e2` de la rama
    `difusion/hilo-twitter`, que todavía no tiene PR: el #26 se integró antes, sin ese
    cambio, así que en `main` el hilo sigue diciendo Arcade Ricotero. Sus capturas muestran
    la marca vieja y se vuelven a sacar cuando esto esté publicado.
  - Lo que toca a cada rol (los nombres del lugar de `CNT-13`, la hoja de marca del lienzo, el
    archivo `.otf` v0.4 junto al de `RES-43`) está en
    `Docs/SUGERENCIAS/HILO-para-todos-el-sitio-se-llama-fichin-ricotero.md`.

---

## D-61 — Skayboy y Poligirl: menú de entrada con los seis niveles abiertos, tarjeta al pasar de nivel, el pulgar que rueda y la pantalla completa en cualquier posición

- **Fecha:** 2026-10-04
- **Número:** se escribió como `D-56` (con `UX-36`, `CNT-30`, `BR-36` y `T-331`+) y se renumeró al
  integrar: el ciclo 18 llegó antes a `main` con esos números, y `D-59` y `D-60` ya los tienen otras
  ramas. Ver la fila de `IDS.md`.
- **Estado:** aceptada — pedido directo del usuario, textual: *"Hacé una sesión entera agregándole
  menú, paso entre niveles y corrigiendo la jugabilidad de las teclas en mobile de skayboy y
  poligirl. Además ponele en el home al lado de Adiviná el tema. La idea es que tenga un botón para
  ponerse en pantalla completa, y que en la misma pantalla completa estén los controles medio
  transparentes para jugar dentro de la pantalla completa. Agregá el menú para jugar y ver qué
  niveles hay y eso."*
- **Consume y enmienda:** `D-32` límite 3 (en la lectura de `D-40` y `D-43`, ver la precisión al
  final), `D-41` punto 4, `D-43`, `D-47` puntos 1 y 2, `D-55`, `US-09` criterios 3 y 9, `BR-31` §3,
  `UX-27` §1.2 puntos 3 y 4, §5.1 y §9, `UX-28` §1, §2.1 y §2.2, `UX-32` §4 y §5, `UX-33` §1.2 y
  §1.9, `CTR-16.11.2`, `ADR-10.1` y `ADR-10.5`, `CNT-22` §1.
- **Contexto.** Se relevó el juego entero antes de tocarlo (cinco lectores en paralelo). Lo que
  había: los seis niveles `listo`, el paso al siguiente con un toque invisible sobre el área, y la
  pantalla completa con los mandos ya superpuestos y medio transparentes **de costado**. Lo que
  explicaba el pedido:
  1. **El botón de pantalla completa no existía con el teléfono parado** (`UX-33` §1.9), que es como
     se entra desde un enlace; y donde sí aparecía decía `PANTALLA NORMAL`, que nombra el estado y
     no lo que hace el toque.
  2. **El pulgar no podía rodar entre teclas.** Cada botón capturaba su puntero: un pulgar que baja
     en ← y se corre a → sigue caminando a la izquierda. Y correr saltando pedía dos dedos en la
     misma columna, cuando los niveles 4 a 6 —medido en `skayboy-soluciones.json`— solo se ganan
     con salto y dirección a la vez.
  3. **No había menú, ni un nombre de nivel a la vista en ningún lado.** Los seis nombres de
     `CNT-21` viajaban al navegador y nadie los mostraba; el paso entre niveles era un toque sobre
     un área sin ninguna señal de que había que tocarla.
- **Decisión.**
  1. **Menú de entrada.** El juego abre con un menú: el botón grande juega el nivel que corresponde
     (el primero sin pasar, como hasta hoy), y al lado o abajo están **los seis niveles, todos
     abiertos**, cada uno con su número, su nombre y si está pasado. El mismo menú se abre jugando,
     con un sello `MENÚ` en el mueble, y entonces la partida queda en pausa. Es HTML, vive adentro de
     `.fichin` (así se ve en la pantalla completa del sistema, `ADR-10.5`) y nunca dibuja en el
     canvas (`ADR-08.2` punto 4). **Ocupa la región del tubo y los mandos, nunca el pie de homenaje
     ni la cabecera** (`UX-37` §3.3, `BR-26`): parado, la zona de las teclas, con el nivel dibujado
     arriba; de costado, el tubo y las dos columnas; en el modo, la sala.
  2. **Los seis abiertos.** El candado de orden que `producto` glosó en `US-09` criterio 9 y
     `BR-31` §3 no estaba en el pedido del usuario de `D-47` ("los seis niveles, en fila") y es un
     molinete: "saber lo suficiente" con forma de nivel (`D-14`). La fila sigue mandando **dónde se
     retoma** —el primero sin pasar— y el avance se sigue guardando igual (`CTR-16.11`); lo que
     cambia es que se puede elegir cualquiera.
  3. **Pasar de nivel se ve.** En el mismo cuadro en que se gana aparece una tarjeta **en la banda
     de arriba del área** (`UX-37` §4.3: las seis puertas están en la fila de abajo, y el baile y el
     contador ocupan la mitad de abajo), que nombra el nivel pasado y ofrece tres cosas: seguir al
     siguiente (nombrándolo, cuando hay lugar), repetir, o elegir otro. A ×1 va compacta. El toque
     sobre el área sigue funcionando igual (`D-32` límite 3: tocable en el cuadro cero). Al empezar
     cada nivel, un rótulo con su número y su nombre aparece un rato arriba del área y se va solo;
     no toma toques.
  4. **El pulgar rueda.** Cada columna sigue al dedo por geometría: el puntero lo captura la
     columna, no el botón, y la tecla es la que queda más cerca del dedo, sin franjas muertas
     entre teclas. **Y la dirección viaja con el pulgar al saltar**: si el pulgar sube de una
     flecha al bloque de saltar sin levantarse, salta y sigue yendo para ese lado. Así correr
     saltando se hace con un solo pulgar por columna, que es como `UX-28` §2.2 contaba que se iba a
     jugar en solitario. La física, las trazas y el solucionador no cambian.
  5. **La pantalla completa en cualquier posición.** El botón aparece también con el teléfono
     parado y dice lo que hace. Al entrar, donde el sistema deja (Android), el teléfono gira solo
     y los mandos quedan encima del área, medio transparentes, como ya estaba de costado. Donde no
     deja (iPhone), parado el área va arriba y los mandos abajo, en la misma tinta. El menú también
     tiene el botón.
  6. **En la portada, al lado de "Adiviná el tema".** El casete pasa de A9 a A4.
- **Alternativas descartadas.**
  - **El menú solo desde adentro, sin abrir al entrar.** Es lo que pedían `D-32` límite 3 y
    `US-09` criterio 3 ("empieza a jugar sin que ninguna pantalla le pregunte"). El usuario pidió
    *"el menú para jugar"*, y el menú de entrada no pregunta nada: el botón grande es jugar, a cero
    milisegundos, y es el mismo nivel que se jugaba antes. Un toque más, a cambio de ver qué hay.
  - **Niveles bloqueados en orden.** Ver el punto 2.
  - **Una tarjeta en el centro del área al ganar.** Taparía el baile y el contador de lo que juntó
    cada uno (`UX-33` §2.5), que es justo lo que se gana mirar.
  - **La tarjeta abajo**, que era la primera versión de esta decisión. `experiencia` mostró que en
    los seis niveles las puertas están en la fila 8 de 9: abajo tapaba justo lo que se quería
    dejar a la vista, y de costado pisaba el pie de homenaje.
  - **Un menú que tapa la ventana entera**, con el pie copiado adentro. Fue lo primero que se
    construyó y se midió en el navegador; se cambió por la región de `UX-37` §3.3 porque `BR-26`
    pide el pie **sin tocar nada y en su lugar**, y porque la cabecera con el volver tiene que
    seguir a mano. De paso, parado el nivel queda dibujado arriba mientras se elige.
  - **Partir el bloque de salto en dos diagonales dibujadas.** Resolvía lo mismo que el arrastre
    de dirección, pero cambiaba el dibujo de las teclas y sumaba dos blancos chicos donde hoy hay
    uno grande. El arrastre no cambia nada de lo que se ve.
  - **Que el salto conserve la dirección en el aire.** Cambia la física y obliga a regrabar las
    seis trazas.
  - **Girar el fichín 90° con CSS en el iPhone.** Es la única manera de forzar el horizontal donde
    no hay bloqueo de orientación, y rompe la medida de todo el encuadre. Queda anotado.
- **Consecuencias.**
  - El menú, la tarjeta y el rótulo son texto encima del área: `UX-27` §5.1 ("adentro del área no
    hay texto") sigue valiendo para el canvas y para la partida en curso, y deja de valer para esas
    tres capas de HTML, igual que ya no valía para el contador de la victoria.
  - Los textos nuevos los escribe `contenido` en `CNT-40` y pasan por `voz.test.ts`.
  - `experiencia` documenta el menú, la tarjeta y el pulgar en `UX-37` y enmienda `UX-33` §1.9;
    `producto` enmienda `US-09` y `BR-31` (`BR-40`); `arquitectura` enmienda `ADR-10.5` y
    `CTR-16.11.2`. El traspaso es `Docs/SUGERENCIAS/HILO-para-todos-skayboy-menu-y-mando.md`.
  - La lógica nueva vive en módulos puros probados en Node (`dedos.ts`, `menu.ts`), como el resto
    del juego: la isla solo pega.
- **Precisiones del mismo día**, después de que los cuatro roles escribieran su parte (`CNT-40`,
  `UX-37`, `BR-40`, la enmienda de `ADR-10` y `CTR-16.11.2`):
  - **`D-32` límite 3 no prohibía un menú.** Su texto es "0 ms hasta que la acción principal es
    tocable", sobre animación; la lectura de "ninguna pantalla previa" es de `D-40`, `D-43` y
    `UX-28` §1 (lo notaron `contenido` y `producto`). El menú de entrada cumple el límite al pie de
    la letra —el botón grande es tocable en el primer cuadro— y lo que enmienda es esa lectura.
  - **La estampa de pantalla completa dice el verbo**: `PANTALLA COMPLETA` afuera del modo y
    `SALÍ` adentro (`CNT-40` §5). En el menú, donde hay lugar, el botón lleva la frase entera
    ("Entrá a pantalla completa", "Salí de pantalla completa", que ya eran los `aria-label`): un
    `SALÍ` solo al lado de `Jugá` se leía como salir del juego.
  - **Un solo "Seguí" en la tabulación** (`UX-37` §4.5): `#seguir-juego` sigue siendo el toque
    sobre el área y sale del orden de tab y del árbol de accesibilidad; el de la tarjeta lo aprieta.
  - **"Hasta dónde llegó" se cuenta en cualquier orden** (`BR-40`): `pasadosDeLaFila()`, para la
    pieza compartible de `BR-27` cuando exista. `hastaDonde()` queda para dónde se retoma.
  - **En la portada, A4**: justo después de "Adiviná el tema". En el teléfono queda abajo y en dos
    columnas al lado; en tres columnas (1024 px o más) es el primero del renglón de abajo, porque
    ahí "Adiviná el tema" cierra el primer renglón. Ponerlo literalmente al lado en los tres anchos
    pide mover también "Adiviná el tema" o sacar a "¿Qué tipo de ricotero sos?" del A2 (`D-51`).

## D-62 — La noche del test es la ricotera entera: el barro, el chori, la birra, el porro y la merca, y también la familia, los amigos y el amor

> **Se escribió como `D-59` y se renumeró al integrar** (2026-10-05): el `D-59` del dominio
> (`dominio/fichinricotero`) llegó antes a `main`. Los commits de la rama `ciclo-18/que-ricotero-sos`
> dicen `D-59`; donde el repo decía `D-59` por esta decisión, ahora dice `D-62`.

- **Fecha:** 2026-10-04
- **Estado:** aceptada — **la tomó el usuario**, con estas palabras: *"Vamos a seguir
  mejorándolo haciendo las preguntas más ricoteras. El recital ricotero es barro, sucio, drogas,
  reviente, y también es familia, amigos, amor: es todo eso, pero lo primero no puede faltar
  tampoco. Un choripán, un pancho, una birra, un porro, hasta cocaína debe ser parte del
  recital. La previa, ir un rato antes a escabiar o no, eso es un recital ricotero. Anotá esto,
  hacé una pequeña investigación de lo que te digo y que quede plasmado en el juego. Me gustó
  mucho la idea de que el test sea una noche de recital."*
- **Consume:** `D-57` (la noche en cinco momentos, que el usuario confirma), `BR-17`, `BR-36`,
  `US-06`, `CNT-30`, `D-14` (la postura del proyecto), `CLAUDE.md` §6 (los molinetes).
- **Qué cambia.** `D-57` punto 2 había sacado de la noche a la banda y a lo que se consume
  ("un recital sin dueño", y los vetos 1 y 4 de `BR-36`): la noche era de cualquiera que sale a
  ver música. El usuario la quiere **ricotera**: con la previa en la esquina, el humo del chori,
  la birra que pasa, el porro que gira, el barro hasta el tobillo, el reviente, y con la familia,
  los amigos y el amor en la misma noche. **Lo sucio no es un adorno opcional: "lo primero no
  puede faltar".** La noche en cinco momentos queda como está.
- **Lo que no cambia** (y por qué no choca con el pedido): el test sigue sin pedir **saber**
  nada de la banda (`BR-17`, los molinetes), sigue sin una respuesta mejor que otra, y las
  tragedias (Bulacio, Olavarría, Cromañón, la muerte del Indio) siguen fuera de la escena de un
  test de dos botones (`BR-36` veto 2). Cómo se compatibiliza "lo sucio no puede faltar" con
  "nadie queda afuera por no consumir" lo fija la síntesis de abajo, con la investigación
  (`INV-172`) sobre la mesa.
- **La investigación** (`INV-172`, `RES-172`..`RES-194`): cuatro investigadores y cuatro
  verificadores. **Ninguna página se pudo abrir** (el proxy bloquea los diarios) y el memoir del
  Indio no está en este entorno, así que casi todo quedó rotulado *leyenda*: se cuenta en la
  prensa según el buscador. Para un test sin respuestas correctas alcanza —da escenas y palabras,
  no datos—. Lo que trae: la previa de días en carpas, el fogón, la guitarra criolla, el mate y el
  vino que pasan de mano en mano, el fernet con Coca en la botella de dos litros cortada, la birra
  por litro, el chori y el asado, los puestos con remeras, el micro y la combi del barrio en fila
  por la ruta, el barro del acceso que se traga una zapatilla, el frío con agua nieve o los 38
  grados, los trapos y los pasacalles, el porro (lo único del consumo que nombra la crónica de
  color), padres que pasan la música a los hijos y parejas que se conocieron en una misa. La
  cocaína no aparece en ninguna crónica de color: está en la policial y en lecturas de fans.
- **Síntesis — cómo queda la noche:**
  1. **La escena es la ricotera entera.** Enunciado, sello, línea que canta y bajadas pueden
     traer la previa en la esquina o la plaza, el escabio, la birra, el vino, el fernet, el
     chori y el pancho, el humo, el porro que gira, el reviente, el barro, la mugre, el micro, la
     carpa, el pogo adelante, los trapos, la misa, los Redondos, "ricotero", la gente sin
     entrada, la madrugada; y la familia, los amigos y el amor **de la gente de la escena** (un
     padre que le pasa la canción a su hija, una pareja que se conoció en una misa). **"Lo primero
     no puede faltar"**: cada momento lleva su parte sucia, no solo la tierna.
  2. **Quien juega elige cómo se mueve, no si consume.** Lo que se toma o se fuma puede estar en
     una opción, pero nunca de un solo lado: si una toma y la otra no, el eje mide si tomás, y el
     que no toma —por salud, por los hijos, porque dejó— cae siempre en el mismo polo. *"Ir a
     escabiar o no"* se juega así: la previa está en la escena, y las dos opciones son de la
     previa (sumarse a la ronda, que no obliga a tomar, o quedarse con lo propio). Se suma **un
     quinto lugar** a la prueba de `D-57` punto 3: **el que no toma ni fuma** tiene que poder
     contestar cada ítem de verdad. Lo vigila `banco.test.ts` (el consumo de un solo lado) y lo
     lee `REV-20` (el quinto lugar).
  3. **La merca está en la noche como paisaje, nunca como elección.** Es la línea editorial del
     hilo principal sobre el pedido —*"hasta cocaína debe ser parte del recital"*—: el sitio no
     tiene muro de edad ni de entrada (los molinetes), y una opción que se elige convierte el
     consumo en una manera de ser. En la escena dice que está, sin glamour ni sermón, que es lo
     que pidió el usuario. Si el usuario la quiere también como opción, se cambia esta línea y la
     guarda, y nada más.
  4. **Lo que se paga puede estar; lo que se elige no lo pide.** El chori, la birra, el micro y el
     puesto están en la escena; ninguna opción dice que compraste, pagaste o tenés entrada.
  5. **La banda y sus rituales entran a la escena; sus personas, no.** La misa, los Redondos, los
     trapos y el pogo son paisaje. El Indio, Skay, Poli: no (el Indio murió el 5 de junio y una
     escena con él en el escenario es un velorio aunque no lo diga). En una opción, "la misa" o
     "los Redondos" puntúan quién es más de adentro, y siguen fuera. Ninguna pregunta pide saber
     nada de la banda (`BR-17`).
  6. **Siguen igual:** las tragedias fuera de la escena (Olavarría, con sus crónicas de barro;
     Cromañón y las bengalas; Bulacio; la muerte del Indio y las plazas del 5 de junio), el cuerpo
     capaz (el pogo suena, nadie elige meterse), la seguridad (sin dedo ni desconocidos), las
     reglas de la luz de la enmienda 7 de `D-57` (sin parentesco ni pareja propia en una opción),
     la noche en cinco momentos, tres por celda, los cuatro nombres de las maneras.
- **Consecuencias.**
  - **`producto`:** `BR-38`, la regla de la noche ricotera, que reemplaza los vetos 1, 3 y 4 de
    `BR-36` por lo de arriba, con el quinto lugar; y una línea en `US-06`.
  - **`contenido`:** `CNT-31`, el banco de la noche ricotera: las escenas, las líneas que cantan
    y, si hace falta, las bajadas, con `INV-172` como material.
  - **El hilo principal:** las guardas (ya escritas antes del banco: `banco.test.ts`), el copy y
    el taller si cambian las bajadas.
  - **`revisor`:** `REV-20`, con el quinto lugar y la pregunta de si la noche suena ricotera.
  - El sitio no tiene muro de edad (`D-09`, los molinetes): desde `D-62` el test habla de birra,
    porro y merca. Es decisión del usuario y queda dicha acá.
- **Enmienda 1 (2026-10-05) — la música nunca molesta.** El usuario, mirando en el sitio
  publicado la hoja vieja de `EJ-052` ("El volumen cansa los oídos", con "Me tapo con los dedos"
  y "Traje algodón por las dudas"), textual: *"Esta creo que es vieja pero no va, nunca cansa el
  volumen."* En el recital ricotero el volumen no es un problema que alguien resuelve: es parte
  de la noche. **Ninguna escena ni opción trata la música como algo que molesta**: ni oídos
  cansados, ni algodón, ni tapones, ni "demasiado fuerte". La hoja ya había salido del banco en
  la vuelta de `CNT-31`; lo que se suma es la guarda, para que no vuelva: `banco.test.ts`,
  apartado *la música que molesta* de los vetos de la noche (escena, momentos, bajadas y
  opciones).
- **Enmienda 2 (2026-10-05) — el plano de dos ejes vuelve, arriba de la grilla.** Enmienda
  `D-57` punto 7. El usuario, en el mismo mensaje: *"Me gustan las explicaciones pero quiero
  que esté el gráfico también, queda lindo ver que está en un plano de dos ejes."* La grilla
  con sus explicaciones **se queda**; el plano **se suma** encima, en la sección de las cuatro
  maneras, debajo de los botones (`UX-38`). Es un recorte de papel con los dos ejes en cruz,
  los cuatro polos en palabras, las cuatro maneras y la tuya marcada con borde y sello (la del
  amigo, punteada).
  - **Relativo, como la grilla:** tu polo de luz-oscuridad arriba, tu polo de orden-caos a la
    izquierda y tu manera arriba a la izquierda, para cada uno la suya. Lo que `D-57` punto 7
    le sacó al rombo era que dejaba las mismas maneras arriba para todos; con el plano
    relativo, entre los cuatro planos posibles cada manera pasa una vez por cada lugar
    (`partida.test.ts` lo vigila). Lo que se pierde es que dos amigos con resultados opuestos
    ven el dibujo espejado. **Si el usuario lo prefiere igual para todos** (luz siempre arriba),
    es un cambio chico en la isla y en esa guarda, y vuelve la jerarquía que el punto 7 sacó:
    es decisión suya.
  - **Sigue sin punto ni graduación** (`BR-17`): la marca es el borde y el sello, nunca una
    posición calculada. Es HTML, no SVG. *(Se escribió "escondido al lector de pantalla"; la
    crítica de `UX-38` mostró que la grilla no dice que hay dos ejes ni dónde cae la tuya, y el
    plano quedó `role="img"` con su texto, `RESULTADO.altPlano`, confirmado por `contenido`
    en `CNT-31` §13.)*
  - **No viaja en la tarjeta** (`UX-38` §6): no entra sin sacar la bajada y el libro, y en
    la miniatura no se lee. `VERSION_DEL_DIBUJO` no sube por esto.
- **Enmienda 3 (2026-10-05) — el plano es fijo, como el rombo viejo.** Reemplaza el punto
  *"Relativo, como la grilla"* de la enmienda 2. El hilo principal le mostró al usuario las dos
  versiones lado a lado, para «Mesa larga a las nueve» y para «Mochila liviana, sin mapa»: la
  relativa (la tuya siempre arriba a la izquierda, los ejes giran) y la fija (Luz arriba y Orden
  a la izquierda para todos). El usuario, textual: *"B, el fijo como el rombo viejo"*.
  - **Qué es:** `planoFijo()` en `src/lib/dos-ejes/partida.ts` (`PLANO_FIJO`: renglones luz y
    oscuridad, columnas orden y caos). Cada manera tiene su rincón por sus dos polos, el mismo
    para todos, y la tuya se marca donde cae. Dos amigos con resultados opuestos miran el mismo
    mapa. Lo vigila `partida.test.ts`, y `isla.test.ts` que el plano salga del motor y no de una
    tabla escrita en la isla.
  - **Lo que se acepta, dicho:** «Mesa larga a las nueve» queda siempre arriba a la izquierda y
    «Mochila liviana, sin mapa» siempre abajo a la derecha. Es la jerarquía de lugar que `D-57`
    punto 7 le había sacado al rombo, y vuelve **por decisión del usuario**, con el costo a la
    vista. Lo que sigue sin volver: el punto, la graduación, cualquier número (`BR-17`).
  - **La grilla de abajo sigue relativa** (la tuya primero), porque es la lista para leer: el
    plano es el mapa, la grilla es de cada uno. Si el usuario la quiere fija también, es otro
    pedido.
  - **Consecuencias:** `producto` enmienda el criterio 3 de `US-06` (el plano queda exceptuado
    por decisión del usuario); `experiencia` lleva `UX-38` a la versión construida; `contenido`
    confirma el texto del lector, que ahora dice el lugar de la tuya (`T-352`); `arquitectura`
    suma `planoFijo()` y `PLANO_FIJO` a `CTR-08` (lo pidió `REV-20`, que encontró el contrato
    sin el motor nuevo: hecho el 2026-10-06). `T-353` queda
    cerrada con esta enmienda.

## D-63 — El fondo del portal es negro liso, y la gente de *Oktubre* mira desde el final de la página

- **Fecha:** 2026-10-04
- **Número:** se escribió como `D-62` y se renumeró al integrar, el 2026-10-05: el `D-62` de la
  noche ricotera llegó antes a `main`. Ver la fila de `IDS.md`.
- **Estado:** aceptada — pedido directo del usuario, con la imagen adjunta, textual: *"Usemos
  esta imagen de fondo de la pagina, sin la parte de las letras de oktubre, un fondo negro y
  sobre el final de la pagina las personas mirando."* La imagen es la tapa de *Oktubre* estirada
  a 16:9 (1280×720), con el wordmark rojo arriba y la multitud de Rocambole abajo.
- **Consume y enmienda:** `D-19` (portada = *Oktubre*, sin cambio de disco), `D-21`, `UX-04`,
  `UX-05` (la fila de la franja inferior fija de `/`), `UX-20` §1.4 (quién lleva la deriva),
  `UX-25` §4 (el nombre `lugar` del portal), `public/arte/README.md` (la fila de la multitud).
- **Decisión.** El portal deja la franja fija de banderas que vivía al pie de la ventana —la
  foto `oktubre-banderas` velada al 86 %, que casi no se veía— y queda en **negro liso** de
  arriba abajo. **La gente va al final de la página**: es el piso del pie de imprenta, de borde
  a borde, abajo del crédito, mirando para arriba. Va **a tinta plena**: el recorte trae solo
  dos tintas de `tokens.css` —`--papel` para lo claro y `--disco-oktubre-tinta` para las
  banderas— sobre transparente, así que donde no hay gente se ve `--fondo`.
- **Cómo.**
  - El máster es la imagen del usuario, guardada en
    `Docs/INVESTIGACION/TapasDiscos/oktubre-frontal-ancha.webp`. `scripts/generar-multitud.mjs`
    la corta abajo del wordmark (desde y=352: el rayo y las letras quedan afuera enteros), vuelve
    transparente el negro —que no era el del sitio: gris neutro con nubes de aerógrafo— y
    reimprime cada píxel en las dos tintas, leídas de `tokens.css`. Sale
    `public/arte/multitud-oktubre.png`, 1280×368, 64 KB en paleta.
  - `PieImprenta` toma `multitud` (lo pasa `Base` con `conBanderas`) y, si el disco tiene
    multitud (`multitudDeDisco`, hoy solo `oktubre`), la pega después del crédito **en lugar
    de la pasada**: son el mismo motivo y la multitud ya trae sus banderas. El crédito de `D-21`
    lo suma el pie, como con la figura.
  - En el teléfono el recorte (3,5 a 1) quedaba en 107 px de alto: lleva un piso de 14 rem con
    `cover`, que muestra el centro —la tapa de verdad— y corta los costados.
  - La deriva de `UX-20` §1.4 pasa de la franja fija a la gente, **corriendo al revés**: arranca
    subida y termina apoyada, así que el borde de abajo no se descubre nunca (el piso solo se ve
    con el desplazamiento al final, que es cuando la capa vuelve a cero).
- **Alternativas descartadas.**
  - **La misma franja fija con la imagen nueva.** Fija al pie de la ventana, el texto de los
    casetes pasa por arriba de las caras, y entonces lleva velo (`D-21`): la gente vuelve a ser
    un fantasma al 14 %, que es lo que el pedido vino a cambiar.
  - **La imagen como fondo del `body`, anclada abajo.** Es lo más literal, pero el último casete
    y el crédito quedaban encima de las caras más grandes, sin velo y sin contraste medido.
  - **La foto entera en JPEG, con el negro pintado de `--fondo`.** Un JPEG no garantiza el mismo
    negro en el borde y deja un rectángulo apenas distinto; además el negro del máster trae
    nubes. Con alfa el borde es la silueta de la gente.
  - **En todas las pantallas.** Cada juego viste su disco (`D-19`) y su pie lleva la pasada de
    ese disco. La multitud es de *Oktubre*, que es la portada.
- **Consecuencias.**
  - Salen `public/tapas/fondo/oktubre-banderas.jpg` (y su fila en `generar-tapas.mjs`) y el
    dibujo de repuesto `public/arte/banderas.svg`: no los mostraba ninguna pantalla (criterio de
    `D-51`).
  - **El portal ya no tiene `.tapa-fondo`**, o sea que no lleva el nombre de tránsito `lugar`
    (`ADR-03` §6.3, `UX-25` §4): al pasar del portal a un juego, el fondo del juego entra con el
    fundido por defecto en vez de transformarse desde la franja. No hay animación propia sobre
    `lugar`, así que no se rompe nada.
  - `multitud.test.ts` falla si falta el recorte, si pesa más de 90 KB, si la primera fila no es
    transparente, si un píxel visible se aleja de las dos tintas o si la gente queda antes que el
    crédito en el pie (rojo visto con el recorte sin procesar: negro opaco, 316 KB).
  - **Los costados del máster no son de Rocambole**: la tapa cuadrada cae entre x≈257 y x≈987, lo
    demás son caras agregadas por quien la estiró, sin fichar. El crédito dice "la tapa de
    Oktubre" y en el teléfono solo se ve el centro; en la computadora se ve todo el ancho.
  - Para `experiencia`: la fila de `/` en `UX-05`, la línea de la portada en `UX-20` §2 y el
    tránsito en `UX-25` §4 describen la franja vieja. Y el lienzo (hojas 05 y 09) no tiene esto:
    el circuito de `diseno-marca.md` pide cambiarlo allá primero, y acá entró al revés por pedido
    directo, sin token nuevo.

- **Enmienda 1 (2026-10-05): la multitud se acerca al bajar.** Pedido del usuario, textual:
  *"me gustaria que mientras vas bajando en la pagina en el fondo se vean banderas rojas y
  gente, como si la gente del final fuese el final de una multitud gigante, como si ir para
  abajo fuese acercase a la multitud, me explico?"*
  - **Qué se ve.** Arriba del portal, al pie de la ventana, una multitud chica y lejana: gente
    y banderas rojas en el horizonte. Al bajar, ese plano crece y entra desde abajo uno más
    cercano, más grande y con más tinta. Al final llega la fila del pie, con las caras grandes.
    Cada fila tapa a la de atrás, como en una multitud de verdad.
  - **Cómo.** Dos planos fijos detrás de todo (`.plano-gente--lejos`, `--cerca`), cada uno con
    tres tintas enmascaradas en el orden de una serigrafía: la silueta de la gente en
    `--fondo`, lo claro en `--papel` y las banderas en `--disco-oktubre-tinta`, mezcladas con
    el fondo en `--peso-multitud-*` y `--peso-bandera-*`. Las máscaras salen del frente
    **original** de la tapa (Rocambole entero, de las banderas para abajo), en espejo para que
    el mosaico no tenga costura: `public/arte/multitud-lejos-{clara,roja,silueta}.png`, 82 KB
    las tres, de `scripts/generar-multitud.mjs`. La fila del pie gana su silueta horneada en
    `--fondo`: sin ella, la gente de atrás se veía por adentro de las caras de adelante.
  - **El movimiento es del lugar** (`UX-20`): dos animaciones atadas al desplazamiento
    (`acercarse-lejos`, `acercarse-cerca`), sin JavaScript. `--acercamiento` vale 0 con
    movimiento reducido, y ahí los dos planos quedan quietos en su lugar de llegada; donde no
    hay `animation-timeline`, también.
  - **El peso tiene techo.** Todo el texto del portal pasa por encima de los planos al subir.
    `contraste.test.ts` mezcla cada peso con su tinta y falla si `--texto-tenue` baja de 4,5:1
    o la marca —letra grande en `--marca-rojo`— baja de 3:1 (rojo visto: con la gente de cerca
    al 30 % la marca queda en 2,10:1). Hoy el par más justo es la marca contra las banderas de
    cerca (3,25:1, con las banderas al 34 %); la gente de cerca va al 16 % (3,34:1). Y tiene piso: lo de lejos con menos tinta que
    lo de cerca, y todo a doce niveles o más del fondo.
  - **Alternativas descartadas.** La foto velada de antes, fija y con velo: deja a la gente al
    14 %, que es lo que este pedido viene a cambiar. Un plano solo que crece: no da
    profundidad, se lee como un zoom. Tres planos: el tercero no se distinguía del segundo en
    un teléfono, y costaba otra capa fija.
  - **Consecuencias.** En el teléfono el efecto es más tenue que en la computadora: los casetes
    ocupan casi todo el ancho y tapan los planos. Es lo que permite el techo de contraste.
    `multitud.test.ts` vigila las tres máscaras (que existan, que calcen, que el mosaico no
    tenga costura, que la silueta llegue al piso) y la silueta de la fila del pie (rojo visto
    con el recorte de antes, sin silueta).

## D-66 — La llave de silencio del iPhone no apaga "Adiviná el tema": el juego pide la sesión de la música

- **Fecha:** 2026-10-06
- **Estado:** aceptada — pedido directo del usuario, textual: *"Investiga la forma de que el
  boton de silencio de iphone no silencie el juego adivina el tema. Analiza el resultado y
  desarrolla la solucion e integrala si no rompe nada"*. **Falta la prueba en un iPhone real**
  (ver Consecuencias): todo lo que sigue sale del código de WebKit y de la documentación, no de
  un teléfono.
- **Consume:** `INV-200` (`RES-200`..`RES-206`), `ADR-04.2` (el contexto compartido), `US-02`
  criterio 2 (el aviso de sonido), `D-14`, `D-29` (las islas no arrastran nada).
- **Contexto.** Con la llave lateral en silencio, el iPhone no tocaba un solo fragmento del
  reveal, con el volumen al máximo y sin avisar. Es la causa que se llevó una partida entera del
  usuario, y hasta hoy la única respuesta era decírselo: el aviso de la portada, el panel
  "¿No se escucha?" y una fila del diagnóstico. La causa está en el código de WebKit (`RES-200`):
  Web Audio sale con la categoría de los efectos (`AmbientSound`), que la llave apaga, y `<audio>`
  sale con la de la música (`MediaPlayback`), que no. Por eso el tema entero de la revelación se
  oía y el fragmento no.
- **Decisión.**
  - **En el toque de "Empezá", antes de despertar el motor, el juego pone
    `navigator.audioSession.type = 'playback'`** (la Audio Session API, en Safari desde la 16.4,
    `RES-201`). Con eso la página entera, Web Audio incluido, sale por la categoría de la música,
    y la llave deja de apagarla. Vive en `src/lib/audio/sesion.ts`, una hoja que no importa nada:
    `sonarAunqueEsteEnSilencio()` pide, `laLlaveManda()` solo mira.
  - **Con guarda y sin romper a nadie** (`RES-203`): donde la API no existe —Chrome en Android,
    Firefox, un iPhone viejo— no se toca nada y el juego suena como antes. Si el navegador tira
    al asignarla, se traga el error y queda como estaba.
  - **El aviso de la llave solo sale donde la llave todavía manda**: un iPhone sin la API. En los
    demás diría algo que ya no es cierto, y un rótulo que miente es lo que `D-14` no deja pasar.
    Vale para el aviso de la portada y para el panel "¿No se escucha?".
  - **El diagnóstico de audio hace lo mismo que el juego**, en el mismo orden, y dice si la llave
    manda o no. Si no, mediría un motor que ya no es el del juego.
  - **Solo "Adiviná el tema" (y el diagnóstico) la piden.** Skayboy no: sus efectos se siguen
    mezclando con la música de la persona y se siguen callando con la llave, que es lo que se
    espera de los ruiditos de un juego. Como el sitio no tiene enrutador del lado del cliente,
    cada página es su propio documento y el pedido no se filtra de una a otra.
- **Alternativas descartadas.**
  - **Pedirla en `contextoDeAudio()`**, justo antes de construir el contexto, que es lo que
    recomendó `investigador`. Es el lugar natural si la sesión fuera de todo el sitio, y por eso
    mismo no: el contexto lo comparten el reveal y Skayboy (`ADR-04.2`), y con la sesión de la
    música Skayboy cortaría la música de quien juega y sonaría con la llave puesta. Pedirla desde
    la isla del juego, antes de `despertar()`, da el mismo orden sin tocar a nadie más, y deja
    `despertar()` sin una coma cambiada, que es lo que pide `ADR-04.2`.
  - **El repuesto para los iPhone sin la API: un `<audio>` mudo sonando en loop al mismo tiempo**
    (`RES-204`, las librerías `unmute-ios-audio` y `unmute`). No entra, por tres razones:
    1. **Puede romper justo lo que vendría a arreglar.** Hay un reporte de que en iOS 16.3 ese
       truco dejaba Web Audio sonando un segundo y nada más (`RES-204`), y la cola sin API son
       exactamente esos teléfonos: tope iOS 15, o 16.3 y menos. No hay cómo probarlo acá.
    2. **Tiene efectos que se ven**: controles de reproducción en la pantalla bloqueada que no
       hacen nada, y un `<audio>` sonando mientras dure la partida.
    3. **Es poca gente, y ya tiene su aviso.** Ninguna cifra publicada la mide, pero todo lo que
       StatCounter muestra para Argentina en julio de 2026 es 16.4 o más (`RES-205`). Para esos
       teléfonos el aviso de la llave sigue saliendo, y sigue siendo verdad.
  - **Sacar Web Audio por un `MediaStreamAudioDestinationNode` hacia un `<audio>`** (`RES-206`).
    Sin fuente seria, sin una sola medición de latencia —que es lo que importa en un paso de 0,1
    s— y con un reporte de que en iOS 11 no sonaba.
  - **Tocar los fragmentos con `<audio>`, que ya ignora la llave.** Es el repuesto que ya existe
    y por algo es repuesto: un `<audio>` no arranca y corta con la precisión de un paso de 0,1 s
    (`src/lib/tema/audio.ts`).
  - **`ambient`, `transient` o `play-and-record`.** Los dos primeros son la misma categoría de los
    efectos que la llave apaga; el tercero pone el teléfono en modo de grabar (`RES-201`).
- **Consecuencias.**
  - **La música de la persona se corta cuando arranca el juego** (`RES-201`, punto 5): la
    sesión de la música no se mezcla. En un juego de adivinar temas de oído es lo que
    corresponde, y el tema entero de la revelación ya lo hacía. Nada suena sin que se pida: cada
    fragmento sale de un toque en "Escuchá".
  - **Quien puso la llave a propósito** —en un colectivo, en la oficina— va a oír el fragmento
    que toque. Es lo que el usuario pidió, y el mismo comportamiento que ya tenía el tema entero.
    Si alguna vez se quiere devolverle esa elección a la gente, es un interruptor nuevo y es de
    `experiencia`.
  - `src/lib/audio/sesion.test.ts` falla si la isla deja de pedir la sesión en "Empezá" o la pide
    después de despertar (rojo visto sacando la llamada), si Skayboy la pide, si `sesion.ts`
    importa algo, o si `vercel.json` o `public/_headers` le apagan el micrófono al sitio: con
    `Permissions-Policy: microphone=()` WebKit ignora el pedido sin un error (`RES-202`, punto 3;
    rojo visto con un `vercel.json` de prueba).
  - **Las ventanas incrustadas quedan en duda** (WhatsApp, Instagram): la API existe adentro,
    pero nadie sabe si la aplicación anfitriona deja que la página mande sobre la sesión
    (`RES-202`, punto 5). Ahí el aviso de la llave se calla y sigue saliendo el de "abrilo
    aparte", que ya salía y es el que corresponde.
  - **Abierto, sin trabar: la prueba en un iPhone real**, que no se puede hacer desde acá. Casos
    mínimos para `revisor` o para el usuario: llave en silencio con y sin música de otra
    aplicación sonando, en iOS 17 o más; y si aparece un equipo con 16.3 o menos, que el aviso de
    la llave siga saliendo. El diagnóstico (`/diagnostico-audio/`) dice en su primera parte si la
    llave manda en ese aparato.
  - Para `arquitectura`: `ADR-04` no dice quién pide la sesión de sonido. La propuesta está en
    `Docs/SUGERENCIAS/HILO-para-arquitectura-la-sesion-de-la-musica.md`.
  - Para `experiencia`: `UX-24` cuenta la altura que suma el aviso de la llave en la portada; en
    casi todos los iPhone ahora no sale. `UX-22` la nombra como causa de silencio.
    Propuesta en `Docs/SUGERENCIAS/HILO-para-experiencia-el-aviso-de-la-llave.md`.

## D-64 — La sombra sale de todos lados, y las tapas de los juegos se sellan: tinta gastada sobre papel viejo

- **Fecha:** 2026-10-05
- **Estado:** aceptada — dos pedidos directos del usuario, en orden. Con la captura del Lado A:
  *"Saquemosle la sombra a las letras de las tapas de los juegos, busquemos un efecto mas de
  impresion vieja sobre papel o sello, algo asi como tinta en papel viejo o eso. Ponete en rol de
  diseñador. Ademas que queden todas coherentes."* Y cuando se le preguntó por la marca y el título
  de cada juego: *"Sisi saquemos la sombra de todos lados, no me gusta."*
- **Consume y enmienda:** `D-33` consecuencia 1 (el registro deja de ser recurso permanente de la
  letra), `D-49` (la sombra de recorte de la tapa pegada), `D-54` puntos 5 y 6 (el eco del título y
  el canto de la tecla), `D-57` (el canto de las hojas que faltan), `D-31` (la sombra de la hoja de
  versos), `UX-22` §8, §9 y §13, `UX-04`, la tabla anti-slop de `.claude/rules/diseno-marca.md`
  (enmendada acá mismo) y la hoja 07 del lienzo.
- **Lo que había.** El título de cada casete llevaba detrás un eco del mismo texto, corrido 2 px,
  en el apoyo de su disco (el "registro imperfecto" de `UX-22` §8). En nueve casetes había siete
  ecos distintos —marrón, petróleo, azul, ocre— y dos en crema sobre el crema de la etiqueta, que
  no se veían. El mismo eco tenían la marca, el título de cada juego, el de los artículos y la
  estampa. Y había 34 sombras duras más sobre objetos: la tapa pegada, los botones que se hundían
  sobre un canto, las chapas, las hojas, el sello del casete.
- **Decisión, en dos partes.**
  1. **No hay sombra en ningún lado**, ni sobre una letra ni sobre una pieza. Lo que recorta una
     pieza contra el fondo es el borde, la cinta y el giro; un estado se marca con borde o con
     tinta. Quedan los anillos pegados (`0 0 0 <ancho>`), que son contorno y no sombra.
  2. **Las tapas de los juegos se sellan**: el título del casete y el de la carátula salen de una
     almohadilla de goma medio seca —les faltan puntos de tinta y zonas donde la mano aflojó, pero
     la letra que queda es `--fondo` pleno, nunca un gris—; la etiqueta es papel viejo, con manchas
     de humedad de borde duro y pecas en `--papel-borde`; el sello de acción sale moteado de la
     misma almohadilla, con el filete y la letra enteros; y el título de cada juego, que es tinta
     de color sobre el negro, lleva solo la sal. Lo único que cambia de un casete a otro es dónde
     apretó la mano (`--semilla`, del mismo mapa de variantes), así que el casete del portal, la
     carátula de su juego y el título de su página tienen el mismo golpe.
- **Cómo lo decidimos.** Un panel de tres diseñadores con enfoques distintos (imprenta de tipos,
  sello de goma, fotocopia de fanzine) y tres jueces con lentes distintas (marca, lectura,
  técnica). Ganó el sello de goma, 24,5 contra 20 y 18,5. La especificación quedó en
  `Docs/SUGERENCIAS/ESPEC-D-64-la-tapa-se-sella.md` y el inventario de las 41 sombras en
  `Docs/SUGERENCIAS/ANALISIS-letras-de-disco-y-sin-sombra.md`.
- **Cómo.**
  - Tres texturas en `tokens.css`: `--textura-tinta` (sal y presión acopladas), `--textura-tinta-sal`
    (solo la sal) y `--textura-papel-viejo`. Alfa sola, como máscara, con la región de filtro en
    0/0/1/1 para que la tesela cosa. La sal se subió de 3,5 a 4,4 % de huecos mirándolo en el
    portal: a un brazo de distancia no se notaba.
  - Sale `--tinta-registro` con sus 20 declaraciones, `--canto-accion` y `--canto-tecla`.
    `--registro` queda solo para el corrimiento de las pasadas de la estampa, que no es sombra.
  - Los botones que se hundían sobre un canto ahora bajan 2 px y se aclaran (`brightness`):
    aclarar el relleno solo le puede subir el contraste a la letra, que es `--fondo`.
  - Los estados que se decían con sombra: el pozo elegido de "Adiviná el tema" engrosa el borde
    hacia adentro (un anillo `inset`), la opción elegida de "¿Qué tipo de ricotero sos?" queda con
    su borde de 4 px, y las hojas que faltan dejan de dibujarse (el folio ya dice "3 de 10").
  - "En la cocina" y la pista pasan a `--papel-tenue`: lo escrito a mano es lápiz y no se gasta.
    La opacidad del casete pendiente pasa a la pieza, porque sobre el papel viejo la pista bajaba.
  - Alto contraste y colores forzados apagan la máscara y el papel: tinta lisa y papel limpio.
- **Alternativas descartadas.**
  - **El eco en una sola tinta para todos.** Coherente, pero sigue siendo una sombra.
  - **La fotocopia de fanzine** (tóner con motas): las motas negras detrás de la bajada se leían
    como tildes y puntos.
  - **Letterpress con mancha amarilla:** pedía un hex nuevo, y la pista bajaba de AA.
  - **Filtro SVG con desplazamiento**, que come el contorno de la letra: Safari ablanda el texto
    y el resultado depende de la densidad de la pantalla.
  - **Una fuente gastada:** todas las A se gastarían igual.
- **Consecuencias.**
  - `estilos.test.ts` se da vuelta: el test del registro, que cuidaba dónde iba la sombra, ahora
    falla si vuelve una sombra corrida en cualquier hoja o en el `<style>` de cualquier página, o
    si una isla o el canvas la pintan por código. Lleva su control de que sabe encontrar.
  - `texturas.test.ts` (nuevo) dibuja cada textura con sharp: que no salga vacía —una máscara rota
    borra el título entero—, que la tinta gaste entre 2 y 7 % y ningún bloque de 12 px pierda más
    del 30 %, y que el papel no pase su techo (rojos vistos).
  - `contraste.test.ts` suma la etiqueta sellada: el título gastado, la bajada, la pista y los
    nueve sellos sobre la peor mancha del papel y con el grano encima. Con el papel al 30 % la
    pista cae de AA (rojo visto); el techo de 0,18 es eso.
  - El sello de Momo es plata, más clara que el papel, y casi no muestra el desgaste. Es lo que
    hace una tinta clara sobre papel claro, y se acepta así.
  - Quedan sin consumidor `--cat-historia-apoyo`, `--cat-discos-apoyo` y `--cat-letras-apoyo`.
    No se borran: son paleta medida (`RES-37`).
  - Quedan márgenes de 5 y 6 px debajo de algunos botones que eran el lugar del canto. Son aire.
  - Para `experiencia`: `UX-22` §8, §9 y §13, `UX-04` y los comentarios de `UX-36`, `UX-37` y
    `UX-35` §3 que describen el eco o el canto (nota en `Docs/SUGERENCIAS/HILO-para-experiencia-sin-sombra-y-letras.md`).
    El lienzo (hojas 07 y 08) tampoco lo tiene.

## D-65 — La letra de la banda escribe el título de cada juego, con tildes y signos derivados de ella misma

- **Fecha:** 2026-10-05
- **Estado:** aceptada — pedido directo del usuario, textual: *"Ademas hay que usar la tipografia de
  los discos en mas lados. Analicemos como integrarlas mejor."*
- **Consume y enmienda:** `D-17` (el voseo con tilde, que ahora entra en la letra), `D-19` (el
  resultado viste el logo), `D-54` punto 5 (el título único de los ocho juegos cambia de letra),
  `D-58`, `RES-42`, la tabla de fuentes y la deuda de tildes de `.claude/rules/diseno-marca.md`
  (enmendadas acá mismo).
- **Lo que había.** Tres letras de disco en `public/fuentes/`, y ninguna podía escribir una palabra
  del sitio entera: el calco de *Oktubre* tiene 14 letras; *Lobo suelto*, la A-Z de trazo de pelo y
  con la U dibujada como W; *Patricio Rey*, la A-Z y los números, sin una tilde ni un signo. Por
  eso Patricio Rey no se dibujaba en ningún lado: el único botón que la pedía, el de compartir,
  llevaba `.con-tilde`, que lo mandaba a la rotulada porque COMPARTÍ tiene tilde.
- **Decisión.**
  - **Patricio Rey pasa a escribir el título de cada juego**, y el botón de compartir vuelve a
    ella. Son textos de dos a cinco palabras, de 29 px para arriba (la letra se lee desde unos 19).
    Los comparte la página de diagnóstico de audio, que usa la misma regla. **Skayboy no**: su
    título va acostado en una cabecera de un renglón, a unos 16 px, y ahí se probó y no se leía.
  - **El título del casete del portal y el de la carátula siguen en Archivo Black**, sellados
    (`D-64`): a 15-16 px, la letra de la banda es una fila de cuñas, y el que llega sin idea tiene
    que poder leer qué es cada juego (los molinetes).
  - **El encabezado del resultado sigue en la rotulada:** son frases de cinco a ocho palabras, y el
    giro de cada letra de Patricio Rey cansa en frases largas.
  - El calco sigue en la marca y en las piezas de *Oktubre*, y *Lobo suelto* donde ya estaba (la
    estampa): las dos no alcanzan para más sin dibujar letras que no existen.
- **Cómo.** `scripts/derivar-patricio-rey.py`, con el mismo método que el calco: lo que falta no se
  dibuja de cero, se recorta y se pega de letras que ya están, con operaciones booleanas.
  - La tilde es la I entera en miniatura, girada: conserva la ranura, así se lee de esta letra.
  - El punto y la coma son cuñas casi cuadradas; la admiración, la I achicada sobre el punto; la
    pregunta, la cabeza del 2 sobre el punto; ¡ y ¿, los de cierre dados vuelta.
  - Salen Á É Í Ó Ú y ¿ ? ¡ ! . y la coma. Las minúsculas apuntan a las mayúsculas, como en el original. El
    ascendente sube de 666 a 798 para que la tilde entre en la caja de la línea.
  - El título de los juegos sube un escalón (de 2,15 a 2,35 rem; 2,85 rem en la mesa) porque a
    igual cuerpo esta letra se ve más chica que la rotulada.
- **Alternativas descartadas.**
  - **Patricio Rey en el título del casete:** a 15 px no se lee, y subirlo a 20 px deja los títulos
    en tres renglones en el teléfono.
  - **Injertar las tildes de Archivo Black o de DejaVu:** no empatan el peso, y traen otra licencia.
  - **Una letra por sección según `D-19`** (Lobo suelto en mitología, el calco en la portada): no
    alcanzan las letras; habría que dibujar más de la mitad del abecedario.
  - **Dibujar la Ñ y los dos puntos:** ningún texto que use esta letra los pide hoy.
- **Consecuencias.**
  - `fuentes.test.ts` abre la fuente y exige que tenga lo derivado, y que el título de cada juego y
    los dos rótulos de compartir entren enteros: un título nuevo con una Ñ falla acá en vez de
    partirse en pantalla (rojos vistos con la fuente de antes). `estilos.test.ts` enmienda el test
    del título único: ahora pide `--fuente-marca-firma`.
  - `.con-tilde` sale del sitio, del CSS y de las seis islas que lo ponían.
  - En el teléfono el título en Patricio Rey se lee con esfuerzo si no se conoce la letra. Lo
    sostienen el tamaño, la bajada que canta debajo y el casete del portal, que ya lo nombró en
    letra clara. Si el usuario lo ve difícil, la salida es dejarlo solo en la mesa (desde 64 rem).

## D-67 — Lobo suelto y la letra que viste *Luzbelito* escriben el título de su juego, con tildes y signos derivados de ellas mismas

- **Fecha:** 2026-10-06
- **Estado:** aceptada — pedido directo del usuario, textual: *"mantene el analisis de tipografia,
  vamos a seguir integrando las otras dos que no estan en el sistema, la de lobo suelto y la otra
  que es medio luz belito"*, y después *"dale, seguí con lobo suelto y la de luzbelito"*.
- **Consume y enmienda:** `D-19` (mitología viste *Lobo suelto*; *Luzbelito* no tenía letra),
  `D-65` (la alternativa descartada "una letra por sección": ahora alcanza para los dos juegos cuyo
  disco tiene letra, y el título único cambia de letra en dos de los ocho), `D-64` (la sal del
  título, que Lobo no lleva), `RES-42`, la tabla de fuentes y la deuda de tildes de
  `.claude/rules/diseno-marca.md` (enmendadas acá mismo). `CNT-14` §2.7 no cambia.
- **Cuál es "la otra".** En `Docs/INVESTIGACION/Tipografia/` quedaban tres zips fuera del sistema.
  Dos ya los había descartado `RES-42`: "INDIO" es *Masterplan* de Billy Argel, una grunge
  genérica, y "Rock Argentina" son logos de bandas. La tercera es **"Redonditos de Ricota", de
  Benjamín Zavala**: mano alzada, alturas desparejas y la i con su punto en medio de las
  mayúsculas, como la palabra LUZBELITO de la tapa. **No es la letra de la tapa**: esa es un
  trazo fino de pluma que nadie digitalizó, y `RES-42` dice que esta copia "el arte del muñeco",
  sin verificar. Que vista *Luzbelito* es una elección de diseño del usuario y no un dato, y por
  eso tiene dos bordes: se llama por lo que es (`Redonditos de Ricota Fan`, en
  `--fuente-luzbelito`) y no escribe el nombre del disco en la estampa, que `CNT-14` §2.7 reserva
  para la letra de la tapa.
- **Decisión.**
  - **Lobo Suelto Fan escribe el título de "Adiviná el tema"**, que viste mitología. Sin la sal de
    `D-64`: es trazo de pelo, y la sal le comería trazos enteros.
  - **Redonditos de Ricota Fan escribe lo que canta en "¿Qué tipo de ricotero sos?"**: el título,
    el nombre de cada manera donde aparezca (el resultado, la tapa del amigo, la grilla de las
    cuatro y el plano), "Las cuatro maneras" y el nombre del juego en el membrete de la hoja. Esta
    sí lleva la sal, como los otros títulos.
  - **La letra viaja con la variante**: `--fuente-disco` en el mapa de variantes de `sitio.css`,
    al lado de la tinta y del golpe. El título la toma, y los demás siguen en la de la banda.
  - **Lo que no cambia:** el casete del portal y la carátula, en Archivo Black (a 15 px ninguna
    de las dos se lee); los sellos de goma de la noche (el momento, los polos), en la rotulada,
    que es la letra de todo sello del sitio; los otros seis títulos, en Patricio Rey; y la
    estampa, que sigue con sus tres nombres en su letra.
- **Cómo.** `scripts/derivar-lobo-suelto.py` y `scripts/derivar-redonditos.py`, con el método del
  calco y de la firma: lo que falta no se dibuja de cero, se recorta y se pega de la propia letra
  con operaciones booleanas.
  - **Lobo**: todo sale de la I, que es un palo de pelo con una bocha en cada punta. La tilde es
    un pedazo del palo con la bocha en la punta; el punto, la bocha; la coma, la bocha con un
    pedazo de palo; la admiración, la I sin travesaños. Salen Á É Í Ó Ú . , ! ¡, y vuelve la Ñ de
    Zavala, que estaba en el TTF y se había perdido al recortar la `.woff`.
  - **Redonditos**: casi todo sale de la i. El punto es su punto; la tilde, el dedo del pie
    estirado y girado; la Í, la i sin el punto y con la tilde; la admiración, la i dada vuelta; la
    pregunta, la cabeza del 2; la virgulilla de la Ñ, la S acostada. Salen Á É Í Ó Ú Ñ . , ! ? ¡ ¿.
  - **El renglón y la medida.** Zavala apoyó las dos letras unas cien unidades por debajo de la
    línea de base; suben (Lobo 112, Redonditos 91). Redonditos además venía grande (mayúscula de
    787 contra 688) y se escala a la mayúscula del sistema, así el mismo cuerpo sirve para los ocho
    títulos.
  - Contornos TrueType, como el original: Lobo pesa 9,1 KB (antes 8,3) y Redonditos 10,0 KB, que
    se bajan solo en la página que las usa.
- **Alternativas descartadas.**
  - **Lobo en el casete, en botones o en texto chico:** a 15 px es trazo de pelo, y su U se dibuja
    como W (SWELTO). En el título de su juego no hay U.
  - **Signos de pregunta y números para Lobo:** ningún texto en esta letra los pide, y la letra no
    tiene una curva de la que sacarlos sin inventarla.
  - **Redonditos en la estampa de *Luzbelito*:** no es la letra de la tapa (ver arriba).
  - **Redonditos en los sellos del momento:** el sello de goma del sitio va en mayúsculas
    rotuladas (`diseno-marca.md`), y esos son sellos.
- **Consecuencias.**
  - `fuentes.test.ts` abre las dos fuentes y exige lo derivado y que no vea lo que no hay; lee del
    CSS qué variante pone qué letra y exige que el título de ese juego entre entero; y vigila los
    nombres de las cuatro maneras, "Las cuatro maneras" y los dos nombres de la estampa en Lobo.
    Con la Lobo de antes, dos de esos tests fallan. `estilos.test.ts` enmienda el test del título
    único (`--fuente-disco` con la de la banda de repuesto), suma que solo Lobo se queda sin sal, y
    el control de la negrita falsa mira también las dos letras nuevas.
  - **Pendiente:** las postales de dos ejes (`R14`) todavía escriben el nombre en la rotulada: hay
    que pasar el taller (`scripts/generar-dos-ejes.mjs`) a esta letra y regenerar los PNG. Se dejó
    afuera para no pisar la rama `ciclo-18/que-ricotero-sos`, que trabaja sobre ese juego. Falta
    también la hoja 04 del lienzo, y que `contenido` sume Redonditos al mapa de `CNT-01`
    (propuesta en `Docs/SUGERENCIAS/HILO-para-contenido-redonditos-en-cnt01.md`).

## D-68 — El orden de los juegos en el portal

- **Fecha:** 2026-10-06
- **Estado:** aceptada — pedido directo del usuario, textual: *"Vamos a hacer un ordenamiento
  rapido de los juegos en el home, que queden en este orden: Adivina el tema, que tipo de
  ricotero sos, sacalo por la letra, skayboy y poligirl, completa la letra, preguntas y desp
  como esta"*.
- **Enmienda:** `D-61` punto 6 (Skayboy y Poligirl al lado de "Adiviná el tema": queda cuarto,
  después de "Sacalo por la letra"). `D-51` no cambia: "¿Qué tipo de ricotero sos?" sigue segundo.
- **Decisión.** El lado A queda así: A1 Adiviná el tema · A2 ¿Qué tipo de ricotero sos? · A3
  Sacalo por la letra · A4 Skayboy y Poligirl · A5 Completá la letra · A6 Preguntas ricoteras ·
  A7 Ponelos en fila · A8 Adiviná la tapa · A9 Más o menos. El lado B no cambia.
- **Consecuencias.** Solo cambia el orden del arreglo `JUEGOS` en `src/lib/sitio/copy.ts`. El
  número de pista lo calcula `pistaDe()` con el índice, así que la carátula de cada juego (`D-54`)
  sigue diciendo lo mismo que su casete en el portal sin tocarla. "Preguntas ricoteras" deja de
  ser el A1 y pasa a ser el A6.

## D-69 — "Ponelos en fila" se reparte de a una, las filas las nombra el que juega, y entran los 105 temas

- **Fecha:** 2026-10-10
- **Estado:** aceptada — pedidos directos del usuario, en una misma sesión y en este orden:
  1. *"Hagamos una pulida de ui/ux sobre el juego ponelos en fila. Dejemos al usuario poder
     editar las categorias por lo que el quiera y agregar. Agreguemos el tierlist de TODOS LOS
     TEMAS con nombre y disco para identificarlos."*
  2. *"Ademas que el juego se vea mas lindo y sea mas divertido y facil de jugar."*
  3. *"Un poco la gracia de los tierlist asi es que sean muchisimas cosas las que estas poniendo
     en orden asi que mas esta bien."*
  4. *"Me gustaria que al seleccionar una cancion suene el recorte que tenemos para el juego
     adivina el tema. Lo mismo con albumnes, que suenen temas de ese album."*
  5. *"Que en el album si termina el recorte que suene otro del mismo album."*
- **Enmienda:** `D-52` (las cuatro filas del cuerpo pasan a ser **las de siempre**, no las
  únicas); `US-08` y su test de tamaño (el tope de dieciséis fichas por conjunto se va: el techo
  es el del link, 120); `ADR-06` regla 1 ("ningún campo es texto": entra uno, con lista blanca);
  `UX-23` §3 y §5 (el "tocás una ficha, tocás una fila" deja de ser el gesto principal);
  `CTR-13` (un conjunto nuevo, `todos`, y el catálogo suma `conAudio`). `BR-22` **no cambia**: no
  hay puntaje, ni orden correcto, ni fila con tinte propio, ni festejo.

### Decisión

1. **Se reparte de a una.** Abajo, en la zona del pulgar, queda pegada *la que sigue*: la ficha
   grande, con su tapa, su disco y su pista. Debajo hay un botón por fila. Con un toque la ficha
   queda ubicada y aparece la próxima. También están "Salteala" (al fondo del mazo), "Elegí otra"
   (el mazo entero, con un filtro por disco), "Mezclá el mazo" y "Deshacé". Las filas siguen
   siendo destino, y una ficha ya puesta se toca para cambiarla de fila ("La estás moviendo").
   El orden del mazo vive en `src/lib/ponelos/mazo.ts`, no viaja en el link y se reconcilia
   siempre contra el tablero. Antes eran dos toques y un salto de pantalla por ficha, porque la
   bandeja y las filas no entraban juntas en un teléfono. Con ciento cinco eso no se jugaba.
2. **Las filas las nombra el que juega.** "Cambiá las filas" abre los nombres para escribirlos,
   "Sumá una fila" llega hasta siete, "Sacala" baja hasta dos (las fichas de la fila que se va
   vuelven al mazo, no se borran), y "Volvé a las de siempre" trae las cuatro de `D-52`. El número
   de una fila es su posición. Las filas propias se guardan en el navegador (`ponelos:filas`) y
   valen para todos los conjuntos. **Siete no es un número de diseño**: son los tres bits del link
   menos el cero de "sin ubicar".
3. **El link lleva las filas propias.** Con las de siempre, el link es el mismo de la versión 1 y
   los links viejos abren igual. Con filas propias es la versión 2:
   `#o=2.<conjunto>.<carga>&f=<fila>&f=…`. Se eligió una versión nueva y no un campo opcional
   porque un lector de la 1 habría abierto la lista con las fichas en su lugar y los carteles de
   otro, sin avisar. Los nombres son **el único texto libre que entra por el fragmento**. Pasan
   por `limpiarNombreFila` (lista blanca: letras, números, espacio y `- ' . , ! ? ¡ ¿`, hasta 24
   caracteres) al escribirlos y al leerlos, y se pintan con `textContent`. Un nombre que la
   limpieza deja vacío descarta el reparto entero.
4. **"Todos los temas"** es un conjunto nuevo (`todos`): los 105, en el orden canónico, cada ficha
   con el nombre de su disco al lado y vestida con la tinta del disco. Va primero en la elección,
   con las diez tapas en tira. La partida se guarda en el navegador, **una por conjunto**
   (`ponelos:partidas`, las ocho más recientes). Abrir de nuevo un conjunto que quedó a medias
   sigue donde quedó, y la elección ofrece arriba de todo "Te quedó a medias · Seguí con…", la
   más reciente. Las listas que llegaron por link no se guardan: son de otro, y pisarían la
   propia del mismo conjunto. Con un solo lugar de guardado, mover una ficha en otro conjunto
   borraba los 105, y lo encontró la revisión. Sacar el tope de dieciséis es
   decisión del usuario (punto 3 de arriba). La sesión corta ya no se cuida achicando el conjunto:
   se cuida repartiendo de a una y pudiendo seguir otro día.
5. **Suena al tocarte una ficha.** Cada vez que te toca una ficha —la que sigue, una que tomaste
   de una fila, una que elegiste del mazo— suena su recorte de diez segundos de "Adiviná el tema"
   (95 de los 105 lo tienen). En una ficha de disco suena un tema de ese disco al azar, la carta
   dice cuál ("Suena …"), y cuando termina arranca otro del mismo disco. Va con un `<audio>` (suena
   aunque el iPhone tenga la llave de silencio, `D-66`), dentro del toque que trae la ficha. Se
   apaga desde las herramientas ("Apagá el sonido") y esa preferencia se guarda. Lo único que
   suena es la banda: no hay festejo (`BR-22` punto 5, `D-33`).
6. **La lámina aguanta todo eso.** Van de dos a siete bandas, con los nombres propios en
   mayúsculas. Si no entra, primero se achica la letra hasta su piso y después se estira el lienzo
   (hasta 2700 px de alto) antes de cortar un tema. Los 105 en seis filas dan una lámina de
   1080 × 1724.
7. **Se ve como el resto del sitio.** Sellos de goma, borde grueso, rotación leve, tinta de cada
   disco en las fichas y en la carta, sin sombras, sin pastillas y sin barra lateral. Las filas
   siguen sin tinte propio. El único movimiento es el hundirse del botón al tocarlo.

### Consecuencias

- **Código:** `src/lib/desafio.ts` (versión 2 y `limpiarNombreFila`), `src/lib/ponelos/`
  (`filas.ts`, `tablero.ts`, `mazo.ts` nuevo, `conjuntos.ts`, `lamina.ts`, `copy.ts`),
  `src/scripts/partida-ponelos.ts` (reescrita), `src/scripts/lamina.ts`, `src/styles/juego.css`
  (el bloque de "Ponelos en fila"), y la página, que ahora manda `conAudio` en el catálogo.
- **Tests:** link v1 y v2 de ida y vuelta, nombres sucios, filas imposibles; filas propias del
  tablero; el mazo; "Todos los temas"; la lámina de dos a siete bandas, estirada y con su techo.
  `estilos.test.ts` suma los cuatro estados nuevos (`.pieza--recien`, `.carta--moviendo`,
  `.mazo--moviendo`, `.filas--editando`).
- **Quedan atrás, y lo dicen sus dueños, no este archivo:** `UX-23` (el gesto y la zona del
  pulgar), `ADR-06` (la versión 2), `CTR-13` (el conjunto `todos` y `conAudio`), y en
  `PRD-ponelos-en-fila.md` el tope de tamaño y el piso de conjuntos (quince desde ahora, con
  `todos`). La propuesta para cada uno está en
  `Docs/SUGERENCIAS/HILO-para-todos-d69-ponelos-mazo-y-filas.md`.
- **Revisión independiente** (tres revisores y tres verificadores, el 2026-10-10). De trece
  hallazgos se confirmaron siete, y se arreglaron todos antes de integrar:
  - el mazo pegado tapaba el foco del teclado: ahora hay `scroll-padding-bottom` medido;
  - el foco se caía al `<body>` al cambiar de pantalla y al deshacer con las filas abiertas;
  - el botón de escuchar tenía un nombre accesible que no decía "Pará";
  - había `aria-pressed` doble en botones que ya cambian de palabra;
  - el disco seguía sonando con el mazo abierto;
  - un nombre de fila con una letra de fuera del plano básico quedaba cortado al medio y dejaba
    sin compartir.
  Además, la partida guardada pasó a ser una por conjunto.
- **Lo que no se hizo, a propósito:** reordenar filas arrastrando (se suman al final y se sacan),
  y recortes para los diez temas que no tienen (esas fichas se juegan mudas, con el botón de
  escuchar escondido).

## D-70 — "Ponelos en fila" sube al A6 del portal, en el lugar de "Preguntas ricoteras"

- **Fecha:** 2026-10-10
- **Estado:** aceptada — pedido directo del usuario, textual: *"cambia el lugar de ponelos en fila
  por el de preguntas ricoteras en el home"*.
- **Enmienda:** `D-68` (el lado A). Quedan cambiados de lugar el A6 y el A7.
- **Decisión.** El lado A queda así: A1 Adiviná el tema · A2 ¿Qué tipo de ricotero sos? · A3
  Sacalo por la letra · A4 Skayboy y Poligirl · A5 Completá la letra · **A6 Ponelos en fila** ·
  **A7 Preguntas ricoteras** · A8 Adiviná la tapa · A9 Más o menos. El lado B no cambia.
- **Consecuencias.** Se cambia el orden del arreglo `JUEGOS` de `src/lib/sitio/copy.ts`, como en
  `D-68`. La pista de cada carátula sale del índice y acompaña sola. La bajada del casete de
  "Ponelos en fila" conserva la primera frase, que es la que canta y mide `voz.test.ts`, y la
  segunda dice lo que hay desde `D-69`: *"Los ciento cinco temas, los discos o las tapas, en las
  filas que vos nombres."*

## D-71 — Preguntas ricoteras se rehace entero: que se sienta como un fichín y que las preguntas se lean bien

- **Fecha:** 2026-10-15
- **Estado:** aceptada — pedido directo del usuario, textual: *"Hace un ciclo entero mejorando la
  ui/ux del juego de preguntas ricoteras. Que la mejora sea total de como se siente, hoy esta muy
  duro y feo. Mejoremos el banco de preguntas, como estan escritas las preguntas todo."* Es el
  ciclo 20 (el 19 fue la noche ricotera, `D-62`). Sin plan de `orquestador`: la escribe el hilo
  principal, `contenido` toma `CNT-41` y las tareas abiertas van de `T-412` en adelante.
- **Enmienda:** `UX-01` v2 y `UX-07` en lo que se ve (la lógica de `BR-19` no cambia), `CTR-02`
  (un campo opcional nuevo, `disco`, y `fuentes` acepta `RES-` de tres dígitos), `CNT-05` y
  `CNT-10` en el copy que `CNT-41` reemplaza.
- **El diagnóstico, jugado a 375 px.** Lo "duro" eran dos cosas. La primera, la dificultad: los
  fáciles no eran fáciles (la partida abría con leyendas oscuras marcadas `facil`) y el que
  escuchó «Ji Ji Ji» en una previa perdía dos vidas en las primeras cinco. La segunda, la
  pantalla: cuatro cajas grises de formulario, una cabecera de 13 px, el `SEGUÍ` abajo del
  pliegue y "Cerrá la partida" entre las opciones y la respuesta, justo donde baja el pulgar.
  Lo "feo": nada de la pantalla hablaba el idioma del sitio.
- **Decisión, la pantalla** (`src/scripts/partida.ts`, `juego.css`):
  - **El tablero**: tres fichas de vida grandes, el `Nº` de la pregunta y un riel con un paso
    por pregunta, partido en los escalones. "Cerrá la partida" sube ahí, arriba a la derecha:
    es lo más lejos del pulgar que hay (`BR-19` apartado 7 queda mejor cumplido que antes).
  - **La pregunta es un recorte** con cinta, torcido apenas y con el borde en la tinta de su
    categoría (`D-19`). Los sellos de categoría, nivel y rótulo van arriba. El aviso de
    escalón es una franja estampada adentro de la ficha, con su línea que canta.
  - **Las opciones llevan letra** (A–D), van en una columna en el teléfono y se eligen también
    con el teclado (1–4 o A–D). La elegida que no iba queda tachada; las otras dos se apagan.
  - **La respuesta** reusa la pieza de "Adiviná el tema": el acierto cae como sello de goma, la
    racha (3, 5 y 10 seguidas) cae como segundo sello, la respuesta correcta va escrita grande,
    y **la tapa del disco** del que se hablaba se fija al lado cuando el ítem tiene `disco`.
  - **`SEGUÍ` va pegado abajo**, en la zona del pulgar y siempre a la vista.
  - **El resultado** estampa el desenlace, pone grande el `Nº` al que llegaste y trae **la
    planilla**: pregunta por pregunta, por escalón, con ✔ ✕ y ·. La planilla viaja también en
    el texto de compartir, con ◆ y ✕ (símbolos de texto, no emoji).
  - **La portada** suma la línea que nombra cómo se juega, con las tres fichas a la vista.
  - Todo con lo que el sistema ya tenía: `sello-golpe`, `momento-entra` y `fijado`, ni un hex,
    ni una sombra, ni una pastilla, y solo pares de color que ya están en `contraste.test.ts`.
- **Decisión, el banco** (`src/data/quiz.json`, `CNT-41`): cada ítem que se queda se reescribe
  (enunciado corto y directo, explicación en registro 2 que regala un dato más en vez de
  repetir la pregunta), la dificultad se recalibra para que el fácil lo saque el que fue a una
  previa, se retiran los flojos y repetidos y entran nuevos con más variedad de forma y de
  tema. El detalle está en `CNT-41`.
- **Lo que no cambia.** Tres vidas, el escalón es el pozo, agotar el banco es la victoria, la
  retirada en dos pasos, sin temporizador, la insignia de rótulo antes de responder y el sello
  completo después (`BR-19`, `UX-01` v2, `UX-07`). La lógica (`vidas.ts`, `ronda.ts`) no se
  tocó; lo nuevo que hacía falta saber de la partida (historial, racha, escalones) vive en
  `src/lib/quiz/recorrido.ts`, con sus tests.
- **Consecuencias.** `experiencia` tiene que poner `UX-01` y `UX-07` al día y el lienzo no tiene
  esta pantalla (`T-412`, nota en `Docs/SUGERENCIAS/HILO-para-experiencia-y-arquitectura-d71-el-quiz.md`).
  `arquitectura` tiene que asentar el campo `disco` y el patrón de `fuentes` en `CTR-02`
  (`T-413`, misma nota).

## D-72 — Los recitales en pantalla ("En vivo") y el juego de armar tu propio recital

- **Fecha:** 2026-10-15
- **Estado:** aceptada — pedido directo del usuario, textual: *"Hace la idea 15, hace al mismo
  tiempo el juego de CREAR tu propio recital. Esta muy bueno aprovechar los recortes de temas
  para cuando aparece en pantalla mostrarlo."* Sin plan de `orquestador`: la escribe el hilo
  principal en la rama `ciclo-21/recitales`, sobre `main` en `afbe3ff`. Las tareas que quedan
  abiertas van de `T-421` en adelante.
- **Promueve** `IDEA-15` (los recitales en pantalla, reservada en `ORQ-plan-ciclo-16.md` §5 y
  nunca escrita) y abre y promueve en el mismo acto `IDEA-16` ("Armá tu recital"). `BR-16` pide
  pasar por un `US-XX` antes de entrar a un ciclo: acá el que decidió el alcance es el usuario,
  como en `D-51` y `D-69`, y `producto` escribe las dos historias después (`US-11`, `US-12`,
  reservadas en `Docs/IDS.md`).
- **Enmienda** `CTR-19.8` regla 4 (una página lee la pieza 2) y suma una quinta forma de link a
  `ADR-02` (en `desafio.ts`, fuera de la unión `Desafio`). Las dos, con propuesta escrita para
  `arquitectura` en `Docs/SUGERENCIAS/HILO-para-todos-d72-los-recitales.md`.

### Lo que hay en el repo, y lo que no

Antes de decidir se midió qué datos de recitales tiene el sitio (`CTR-19`):

- **Listas enteras que el sitio puede copiar: dos.** Concordia, 8 y 9 de diciembre de 1995, de
  MusicBrainz, bajo CC0 (`RES-76`..`RES-78`). Es todo lo que encontró la búsqueda de fuentes
  abiertas del ciclo 16.
- **El conteo citado de setlist.fm**: cuántas veces figura cada tema en 256 listas que cargó la
  gente (`RES-90`), y **un índice de 40 noches** con fecha, lugar y enlace. Las listas de
  setlist.fm se pueden mirar y no copiar (`RES-73.1`): no están en el repo y no van a estar.

Con eso la idea 15 no puede ser "todos los recitales con su lista": sería inventar lo que el
sitio no tiene. Es **lo que hay, rotulado como lo que es**.

### Decisión 1: la página "En vivo" de la Redondopedia (`/redondopedia/en-vivo/`)

- **Tres bloques, cada uno con el régimen de su dato.** Las dos listas enteras, con lo que pide
  `RNF-CTR-19-B` en el mismo bloque (fuente con enlace al recital, licencia de la fuente, qué le
  hizo el sitio, bajo qué licencia la ofrece, y que la fuente no dice si está completa). Lo que
  más aparece en las listas de setlist.fm, con `RNF-CTR-19-A` al lado (qué mide, de dónde sale,
  cuándo se consultó; "figura", nunca "se tocó"; quince a la vista y los otros plegados). Y el
  índice de las 40 noches por año, con el enlace a cada lista en setlist.fm.
- **Los bises salen de la fuente.** MusicBrainz marca «Encore», «Encore 2»… en la nota de cada
  tema; la página los muestra como "Bis", "Segundo bis", "Tercer bis", sin interpretar nada.
- **Cada tema con recorte suena al tocarlo**, y cada lista entera suena de punta a punta, diez
  segundos por tema, marcando el renglón que suena. Es el pedido del usuario: el tema que
  aparece en pantalla, se escucha.
- **No es un artículo.** No tiene casilla de hecho, leyenda ni testimonio: cada dato lleva el
  rótulo de su fuente. Por eso no entra al índice por tipo (`BR-07`): va como puerta aparte
  arriba de la portada de la Redondopedia.
- **La frontera de licencias.** `CTR-19.8` regla 4 decía que ningún módulo lee la pieza 2, para
  que el "compartir igual" de una fuente BY-SA no alcanzara a nada más. La única fuente es CC0 y
  la salida es CC0: no hay nada que compartir igual. Igual el borde queda angosto: **una sola
  página la lee**, y `en-vivo.test.ts` (t8) la nombra en una lista de una línea. Si entra una
  fuente BY-SA, esa lista se vuelve a mirar.

### Decisión 2: "Armá tu recital" (`/juegos/arma-tu-recital/`, el A10 del portal)

- **El juego.** Elegís un lugar donde tocó la banda, armás la lista con los temas de los diez
  discos —en orden, con bises— y la escuchás. Sin puntaje y sin lista correcta, como "Ponelos en
  fila" (`BR-22`): no se compara con ninguna lista de verdad. Las de verdad están en "En vivo",
  para mirarlas, y el resultado lleva el enlace.
- **Los lugares** ~~son de verdad y salen del índice de setlist.fm~~ — ver la enmienda de abajo:
  el juego es una expresión de deseo y los lugares son para soñar.
- **Lo que suena.** Un tema suena al sumarlo a la lista; se vuelve a escuchar desde sus acciones;
  y al cerrar la lista suena **la noche entera**, diez segundos por tema, con los bises al final,
  marcando el renglón que suena. Se silencia y la elección queda en el navegador. Con un
  `<audio>`, como "Ponelos en fila" (`D-69`), así suena aunque el iPhone tenga la llave de
  silencio puesta (`D-66`).
- **La lista y los bises.** Dos tiras: hasta 24 temas en la lista y 4 de bis, con 5 como mínimo
  para cerrar. El borde se cruza moviendo (bajar el último de la lista lo vuelve el primer bis),
  y hay un botón directo "Al bis" / "A la lista". La lógica es pura y tiene tests
  (`src/lib/recital/armado.ts`).
- **Cuánto dura**, sumando lo que dura cada tema en su disco (`RES-20`). Los que no tienen
  duración medida (*Cordero atado*) se dicen y no se cuentan como cero.
- **Se comparte** como dirección (la quinta forma de link: lugar, lista y bises en el fragmento,
  dos caracteres por tema) y como **hoja**: la misma lámina de "Ponelos en fila", con la tinta de
  *Oktubre* y un tema por renglón. Y se baja como imagen, para el que no tiene menú de compartir.
- **Viste *Oktubre***, como la portada (`D-19`): la tapa es la gente. El casete pega la multitud
  de cerca (`oktubre-zoom`), que ningún otro casete usaba (`D-49`).
- **La lista a medio armar** se guarda en el navegador y la puerta ofrece seguirla.

### Lo que no cambia

Ningún juego existente cambia de lógica. La lámina de "Ponelos en fila" suma dos campos
opcionales (`tintaJuego` y `renglonPorFicha`) y sin ellos dibuja lo mismo que antes. El orden
del portal no se toca: el nuevo entra al final del lado A, como entraron los anteriores.

### Consecuencias

- **`producto`**: escribir `US-11` ("En vivo") y `US-12` ("Armá tu recital") con criterios y,
  para `US-12`, decidir si 5/24/4 son los números o solo los del primer corte. Marcar `IDEA-15`
  e `IDEA-16` como promovidas en `PRD-backlog-ideas.md` (`T-421`).
- **`arquitectura`**: asentar en `CTR-19.8` la enmienda de la regla 4 y en `ADR-02` la quinta
  forma de link (`T-422`).
- **`experiencia`**: el flujo y la hoja de papel en un `UX-` y en el lienzo (`T-423`).
- **`contenido`**: leer la copia de `src/lib/recital/copy.ts` y el renglón de lugar nuevo de
  `LUGARES` contra `CNT-13` (`T-424`).
- **`investigador`**: buscar más listas enteras con licencia abierta. Cada una que entre suma una
  noche a "En vivo" sin tocar código (`T-425`).
- **Revisión independiente:** `REV-23` (`FIND-153`..`FIND-168`), sin altas; todo arreglado en la
  misma rama.

### Enmienda del 2026-10-15: "Armá tu recital" es una expresión de deseo

Pedido del usuario, textual: *"La idea de arma tu recital es que sea ficticio y actual, una
expresion de deseo. Que se puedan poner estadios de toda argentina, los teatros mas conocidos de
varias ciudades y que en un descampado en una localidad sea una opcion, ademas que pueda ser texto
libre osea que no sea una seleccion si no aparece."*

- **Los lugares ya no salen de recitales de verdad.** Salen de `src/data/lugares-recital.json`
  (con su schema, en `esquemas.test.ts`): veinte estadios y catorce teatros de todo el país. El
  archivo y la pantalla dicen que es una expresión de deseo: **no afirman que la banda haya tocado
  ahí**. El juego ya no lee nada de setlist.fm.
- **Cuatro pestañas**: Estadios, Teatros, **Un descampado** (se escribe la localidad: queda "Un
  descampado en Tandil") y **Otro lugar** (se escribe el lugar y, si se quiere, la ciudad). Cada
  estadio y cada teatro es una entrada de papel, con la ciudad en el talón.
- **El link lleva lo escrito a mano** (`l` y `c` en el fragmento), limpio por lista blanca al
  entrar y al salir (`limpiarLugar`, `desafio.ts`), como los nombres de fila de `D-69`. Con
  tests en `src/lib/recital/link.test.ts`.
- **De paso, una pulida del armado** pedida el mismo día: el cajón tiene buscador, los discos son
  una tira de tapas en vez de once botones, los temas van agrupados bajo su disco con la duración,
  el tema que suena se ve siempre en el pie (sello "SUENA", título y "Pará"), el tema sumado entra
  a la hoja con el gesto de `momento-entra`, y en la noche "Escuchá la lista" va arriba de la hoja
  con el sello "SUENA" estampado en el renglón. En "En vivo", saltos a los tres bloques arriba y
  botones de escuchar más livianos.
- **Lo que se cayó con esto:** `FIND-161` (los lugares como muestra de setlist.fm) ya no aplica, y
  `lugaresDe` salió de `listas.ts`. La verdad de los nombres de estadios y teatros queda pedida a
  `investigador` y la lista a `contenido` (`T-427`).
- **Probarlo en un teléfono de verdad**: la lista sonando de corrido en un iPhone, y el pie
  pegado abajo con la barra de Safari (`T-426`).

### Enmienda del 2026-10-15 (2): las listas de Discogs entran, rotuladas "sin revisar"

`T-425` la buscó una sesión aparte con `investigador` (`INV-425`, `RES-207`..`RES-239`): Discogs
publica sus datos bajo CC0 en volcados mensuales y tiene 29 grabaciones piratas de recitales con la
lista entera, transcriptas por sus usuarios y sin votar. El Fandom de la banda tiene páginas por
recital, pero su licencia sería CC BY-SA y no se pudo confirmar. Pedido del usuario, textual:
*"Cargá las listas de Discogs con el rótulo de cargadas por la gente y sin revisar. Fandom no,
hasta confirmar la licencia."*

- **Entran 25 noches de Discogs** (1987 a 2000: Cemento, Obras, Huracán 93 y 94, River 2000, Mar
  del Plata, La Plata, Rosario, Santa Fe, Tandil…), con las dos de MusicBrainz suman 27. Quedan
  afuera, por lo que dice la ficha: Concordia del 9/12/1995 (es una parte de la de MusicBrainz),
  Letoile (sin año), un release que no es de la banda y uno de un solo tema.
- **El rótulo.** La fuente lleva `revision: "sin-revisar"` (campo nuevo y optativo del schema de
  la pieza 2). "En vivo" pone el sello "SIN REVISAR" en el resumen de cada lista y, en el rótulo,
  *"La cargó la gente y nadie la revisó. Puede faltar algún tema, y la fecha o algún título pueden
  estar mal."* Cada lista suma el aviso que trae la ficha (fechas en disputa, numeración que salta,
  dos versiones de la misma noche) y, si la ciudad la completó el sitio, lo dice.
- **El script** (`scripts/ingerir-recitales.mjs`) aprende Discogs con las mismas reglas que
  MusicBrainz: User-Agent con contacto, pausa entre pedidos, todo validado antes de escribir. Lugar,
  ciudad y fecha no vienen en campos: salen de la ficha, en la tabla `GRABACIONES`. Un renglón con
  dos temas se parte solo si las dos partes cruzan con los 105.
- **Los alias.** Las erratas de quien transcribió el casete ("Lobo Caido", "La Hija Del Fletro",
  "TV Führer", "Vaca Cubana") entran a `ALIAS` de `temas.ts`, en un bloque con su comentario: son
  juicios sobre la obra, y ahí se discuten. De 531 renglones cruzan 466; lo demás son inéditos,
  cánticos y renglones con varios temas, y se muestran como los da la fuente.
- **"En vivo" se reordena**: con 27 noches, las listas van por año y plegadas; cada resumen dice la
  noche, cuántos temas y el sello.
- **Lo que queda abierto** (`INV-425`, "Sin resolver"): confirmar que esos releases están en el
  volcado CC0 y qué son los "datos restringidos" de los términos de la API de Discogs; la licencia
  del Fandom; y las fechas en disputa (River 15 o 16 de abril de 2000, Lanús 1 o 3 de mayo de 1992,
  Atenas 11 o 12 de mayo de 1990). Con `D-14` nada de eso frena: si llega un reclamo, se baja.

## D-73 — El bestiario redondo: los bichos y la gente de las letras, en un mapa que se recorre

- **Fecha:** 2026-10-16
- **Estado:** aceptada — pedido directo del usuario, textual: *"Analiza diseña y construi el
  bestiario redondo. Arma una lista de TODOS los personajes que son parte de la mitologia de los
  redondos. Mi idea es que cada "bestia" este en un entorno relacionado con ella y cerca de otras
  bestias parecidas. Por ejemplo el cordero que este en una pastura atado a un palo y que no se
  pueda alejar, cerca de el que este el lobo suelto, acechando al cordero, en un entorno que rodee
  la pastura pero sea diferente [...] el gordo pier que tenga una botella y este en un lugar
  inundado con un vidrio roto [...] un lugar que se puede recorrer desde arriba y entrar a ver el
  entorno mas en detalle cosas asi. Se creativo."* Sin plan de `orquestador`: la escribe el hilo
  principal en la rama `ciclo-22/bestiario`, sobre `main` en `fdaea84`. Las tareas abiertas van de
  `T-431` en adelante.
- **Dónde vive:** `/redondopedia/bestiario/`, con una puerta en la portada de la Redondopedia al
  lado de la de "En vivo". No es un juego: no puntúa, no hay acierto ni error (`BR-22`, como
  "Ponelos en fila" y "Armá tu recital").

### Decisión 1: la lista sale de las letras, y el verso se coteja a máquina

"Todos los personajes" se tomó al pie de la letra: se leyeron las 104 letras de `cancionero.json`
y se sacó **todo bicho y todo personaje con nombre o con figura** — 120 entradas. A cada uno lo
respalda **el verso exacto de su tema**, y `bestiario.test.ts` coteja cada verso contra el
cancionero, palabra por palabra (sin tildes ni signos, porque la transcripción de lacuerda.net no
siempre los trae). Es la regla que `CLAUDE.md` deja estricta: un dato mal puesto le marca error al
que se sabe el tema, y en el bestiario el dato es el verso.

- **Tres del mito no salen de ninguna letra:** Patricio Rey, los buñuelos de ricota y la bestia
  pop (que sí es un tema, pero cuya bestia nadie identificó). Van con lo que se cuenta, rotulado
  (`RES-22`, `RES-05`, `RES-341`, `RES-342`).
- **Lo que el sitio agrega es la estampa, y lo dice.** Cada ficha tiene "La estampa": el dibujo
  del sitio y lo que pone de más. Cuando el dibujo toma algo al pie de la letra (la rana rubia es
  una rana, el que mordió el anzuelo es un pescado, el Morta relincha), la estampa lo avisa. La
  botella del gordo Pierre es del dibujo, no de la letra, y también lo dice.
- **El gordo Pierre tiene historia, con tres versiones** (`RES-340`): la noche de lluvia en La
  Esquina del Sol con la sala inundada y el vidrio de la puerta roto (testimonio del Indio, en el
  memoir y en Rolling Stone), la de 1985 donde el Indio cuenta que Pierre niega haber roto nada
  (testimonio), y la del dueño del bar (leyenda). Las tres van, cada una con su rótulo.
- **La gente real fuera de las letras no se dibuja como bestia.** El Mufercho, Symns, el Soldado
  o la Negra Poli son personas con nombre y apellido: tienen su lugar en la Redondopedia, no en un
  bestiario. Patricio Rey sí, porque es un personaje inventado.

### Decisión 2: el mundo es redondo, y cada uno vive al lado de los que se le parecen

Un mapa circular visto desde arriba, como un disco o un buñuelo: el galpón de Patricio Rey en el
medio, once regiones alrededor y **la ruta del último bondi dando la vuelta por el borde, que es
el surco**. Cada región viste el disco de lo que vive ahí (`D-19`) y está pegada a las que se le
parecen:

- **La pastura es un claro adentro del monte del lobo.** El cordero está atado al palo en el
  medio, con un círculo pelado del largo de la soga; el lobo suelto acecha en el borde, justo
  afuera (un test lo mide). Al lado, la mesa servida del caníbal ("un cordero de mi estilo").
- **El bajo inundado** (el gordo Pierre, el amorcito que mordió el vidrio, el ahogado y su fiel
  fantasma, los nenes de oro nadando) toca **el infierno** por el barro de la anguila y por las
  sirenas, que le cantan a Luzbelito desde el agua. Al otro lado, los astilleros.
- **Los techos y el baldío**: los gatos arriba, los perros abajo. Al lado, la prisión de
  Barbazul, con la jaula vacía de la fiera más fiera.
- **El árbol del gran bonete** con los pájaros y los ángeles; **Cybersiberia**, la tele en la
  nieve (el Capitán Buscapina, el Alien Duce, el pac-man); **el templo de Momo** con la murga.

### Decisión 3: tres capas, y la de abajo alcanza sola (molinetes abiertos)

1. **El índice**: abajo de todo, cada bestia con su ficha entera en HTML, región por región. Se
   lee sin JavaScript y lo encuentra un buscador.
2. **El mapa**: un SVG armado en build (`lib/bestiario/mapa.ts`). Las figuras salen de una
   imprenta de piezas (`lib/bestiario/figuras.ts`): un cuadrúpedo con otras orejas, otro hocico y
   otra pose es un lobo, un perro o un cordero; la gente es una cabeza, la ropa y lo que lleva
   encima. Así las 120 tienen el mismo trazo de serigrafía, en las tintas de los tokens.
3. **La isla** (`scripts/bestiario.ts`): de lejos se toca una región y la cámara baja; de cerca se
   viaja a la de al lado sin volver a subir; una bestia abre su ficha (copiada del índice, una
   sola versión), suena diez segundos del tema con la rocola de `D-72`, y queda **anotada en el
   teléfono** ("Anotaste X de 120"), que es una comodidad: sin dónde guardar, anda igual.

### Consecuencias

- **Una cosa aprendida en el navegador, que queda escrita en `figuras.ts`:** las copias de un
  `<use>` no toman un selector con ancestro (`.bestiario-svg .tn`). Con esa forma, todas las
  figuras salían negras. Las tintas del bestiario llevan el prefijo `b-` y se pintan sin ancestro.
- `voz.test.ts` audita lo que el sitio escribe en el JSON (nombres y líneas de las regiones,
  estampas, lo que se cuenta), pero **no** los nombres de las bestias ni los versos: son citas.
- Los datos (`src/data/bestiario.json`) los cargó el hilo principal; la carpeta es de
  `contenido`, que puede revisar las estampas con `voz-ricotera.md` (`T-431`).

### Abierto, sin trabar

- `T-431`: que `contenido` lea las 120 estampas y lo que se cuenta, con el oído de `CNT-02`.
- `T-432`: que `investigador` lea el memoir con `pdftotext` y confirme de primera mano la noche
  de La Esquina del Sol (`RES-340`), que hoy está citada de segunda.
- `T-433`: que `experiencia` diga si el mapa entero necesita un modo para arrastrar con el dedo
  (hoy se recorre de región en región, con los botones de "Al lado").
- `T-434`: probarlo en un iPhone (la hoja de la ficha con la barra de Safari).

### Enmienda del 2026-10-16: el zoológico, con el lobo y el cordero de Rocambole vivos

Pedido del usuario, sobre el esqueleto de arriba, textual: *"Lo que quiero como objetivo final es
personajes con diseños lindos, al estilo rocambole, animados y viviendo en su entorno, que sea algo
scrolleable y explorable. Que sea interactivo. Algo asi como un zoologico ponele. Me gustan las
zonas. Los diseños del cordero y el lobo que ya existen deben ser una adaptacion fiel del diseño de
rocambole a una figura animada que vive en su entorno. Los entornos tambien con arte estilo
rocambole."*

- **El recorrido.** El mapa redondo queda como **plano de la entrada**: sus rótulos son enlaces que
  bajan a cada recinto. Abajo, los recintos uno detrás del otro, como un zoológico, cada uno con su
  cartel de sello. El monte y la pastura son un solo recinto, el primero (la pastura es un claro del
  monte). La ruta es la salida: una carretera recta por donde pasan los fierros.
- **El lobo y el cordero son títeres de Rocambole** (`lib/bestiario/titeres.ts`), armados por piezas
  que se mueven: patas, cola, cabeza, párpados, pupilas, boca. El lobo sale de la tapa de *Lobo
  suelto*: la cara de frente partida en claro y oscuro, el ojo grande con ojera, el hocico de dos
  almohadillas con los colmillos, el cuerpo a rayas como el pecho, y la cadena de papel recortado,
  que acá está rota y arrastra. El cordero sale de *Cordero atado*: azul pizarra con la lana en
  escamas, la máscara marrón con ojos verdes de párpado pesado, el hocico negro, los cuernos curvos
  y las pezuñas con uñas. Las tintas se muestrearon de las tapas y viven en `tokens.css`
  (`--bestia-*`, `--entorno-*`).
- **El aerógrafo de Rocambole se traduce como lo traduce todo el sitio** (`RES-06`): pasadas de
  tinta plana y una trama de puntos donde él soplaba sombra. Ni un degradé.
- **El entorno sale de las mismas tapas** (`lib/bestiario/escena-monte.ts`): el monte son las tiras
  dentadas en sepia de la contratapa de *Lobo suelto*, en tres planos; la pastura es el naranja de
  *Cordero atado* con los trazos de crayón y los espirales azules de la contratapa del disco 2.
- **Viven**: el lobo ronda la pastura por afuera, siempre del lado del cordero, y cuando lo alcanza
  se agazapa y lo mira; el cordero pasta masticando, deambula hasta donde le da la soga, y cuando el
  lobo se acerca huye al otro lado del palo hasta que la soga lo frena tensa. Se ordenan por
  profundidad: el lobo pasa por atrás de la pastura, entre las tiras, o por adelante. **El cordero
  se arrastra con el dedo, y no sale del círculo de la soga.**
- **Tocar un bicho** lo hace reaccionar (el lobo aúlla, el cordero bala y salta, los demás pegan un
  salto) y le hace decir su verso en un bocadillo; desde ahí se abre su ficha.
- **Los otros recintos** quedan con las figuras de la primera vuelta, que respiran, se balancean y
  saltan, mientras les llega su arte. En el del monte, los demás bichos viven con esas figuras en el
  fondo del monte y en la orilla de la pastura.

#### Excepción a la regla del movimiento

`diseno-marca.md` dice que el único movimiento decorativo del sitio es la mosca. **Los bichos del
bestiario se mueven, y no es decoración: es el contenido.** Un zoológico de bichos quietos es una
lámina. La excepción queda escrita en la regla y acotada: solo adentro de las escenas del bestiario,
solo lo que se ve (`IntersectionObserver`), con la animación en la isla y no en CSS, y con
movimiento reducido no se mueve nada.

#### Abierto, sin trabar

- `T-435`: que las tintas `--bestia-*` y `--entorno-*` pasen al lienzo (hoja nueva del bestiario):
  esta vez se cargaron primero en `tokens.css`, al revés del circuito de `diseno-marca.md`.
- `T-436`: el arte de los demás recintos, uno por ráfaga, con el mismo método: el títere sale de la
  tapa de su disco cuando la tapa tiene al bicho (la mosca, el perro de *Un baión*, Luzbelito, el
  bondi), y si no, se dibuja en el idioma de ese disco.
- `T-437`: probar en un teléfono de verdad el arrastre del cordero y los cuadros por segundo con los
  doce recintos.

### Enmienda del 2026-10-16 (2): el monte de noche, a aerógrafo

Pedido del usuario, textual: *"Que sea el arte más oscuro, no tan infantil. Tratá de que se note más
que se basa en arte de Rocambole. Que tenga toda su estética. Más espacio."*

Lo que hacía infantil a la segunda vuelta era la técnica: contorno negro, tinta plana sin volumen,
ojos de caricatura y las figuritas del mapa de relleno. Lo de Rocambole en las tapas del disco
doble es **aerógrafo**: volúmenes soplados, borde duro donde él ponía una máscara de papel y borde
blando adentro, grano, sombras hondas, ojos humanos en los animales, fondos oscuros.

- **El aerógrafo se imprime una vez, no se pinta en el teléfono.** `lib/bestiario/aerografo.ts`
  arma manchas sopladas, máscaras de borde duro y grano en SVG; `lib/bestiario/arte.ts` dibuja con
  eso las piezas del recinto; `scripts/imprimir-bestiario.mjs` (`npm run imprimir-bestiario`) las
  resuelve contra `tokens.css` y las imprime con `sharp` a `public/bestiario/*.webp` (20 piezas,
  272 kB). El navegador solo mueve imágenes: el desenfoque y el grano, que en cada cuadro serían
  carísimos, ya vienen hechos. Si se cambia `arte.ts`, se vuelve a correr la imprenta;
  `bestiario.test.ts` falla si una pieza que pide la página no está impresa.
- **Sin contornos.** Ningún títere ni pieza del entorno lleva borde negro: la forma la da la
  máscara y el volumen el soplo.
- **El lobo**: la cara de la tapa, con la mitad derecha hundida en sombra, cuencas hondas, el ceño
  que baja, el ojo grande ojeroso y el chico perdido en lo oscuro, iris humanos, colmillos
  amarillos. La cabeza va más chica que en la tapa (allá es un busto) y baja, en postura de acecho.
- **El cordero**: la lana en escamas como tejas, cada una con su luz; la máscara marrón con el ceño
  pesado; ojos humanos verdes; la trompa oscura con sus fosas, no una boca.
- **La escena es de noche y más grande** (900 × 640, `rig.ts`): las tiras de la contratapa de
  *Lobo suelto* oscuras con el canto encendido, y la pastura naranja que brilla en el claro y se
  apaga en la orilla. En el teléfono va de borde a borde y se recorre de costado; arranca con la
  pastura en el medio. El lobo ronda afuera de la pastura, entre las tiras, y el frente lo tapa
  cuando pasa por abajo.
- **Los demás del monte y la pastura ya no son figuritas: son ojos en lo oscuro**, que parpadean y
  se tocan igual. Oro los que acechan, papel los otros.
- **La isla no se lleva el dibujo**: la geometría que necesita vive en `rig.ts`, sin importar
  `arte.ts`.

#### Excepción a la regla de los degradados

`diseno-marca.md` veta los degradados decorativos. **El aerógrafo de las ilustraciones del
bestiario no es decoración: es la técnica de las tapas que el bestiario adapta.** La excepción queda
acotada en la regla: solo adentro de las piezas impresas del bestiario, y siempre con grano; la
interfaz alrededor (carteles, fichas, botones, bocadillo) sigue en tinta plana.

#### Abierto, sin trabar

- `T-438`: el mismo método para los demás recintos, uno por ráfaga (`T-436` queda adentro de esta).
- `T-439`: medir en un teléfono de gama baja la escena del monte (cuadros por segundo, memoria de
  las imágenes) antes de sumar más recintos a aerógrafo.

### Enmienda del 2026-10-16 (3): el lobo y el cordero son las tapas, recortadas

Pedido del usuario, textual: *"Animados se refiere a que se muevan, no estilo cartoon. Deben ser lo
más fiel posible al diseño real y los inventados lo más fiel a la estética posible."*

- **El lobo y el cordero ya no se redibujan.** Son el arte de Rocambole de los frentes del disco
  doble (`Docs/INVESTIGACION/TapasDiscos/`, 953 px), recortado en piezas como un títere de papel
  (`lib/bestiario/recortes.ts`, `scripts/recortar-bestiario.mjs`). Lo que se mueve son esas piezas.
  Se fueron el lobo y el cordero dibujados a aerógrafo de la vuelta anterior.
- **El lobo es un busto, como en la tapa, y no se le inventan patas.** Acecha como acecha en la
  tapa: asoma desde lo oscuro detrás de la pastura, del lado del cordero, sube despacio, ladea la
  cabeza hacia él, respira y parpadea, y se vuelve a hundir. Para eso el fondo se partió en dos
  capas (`monte-lejos` y `monte-cerca`) y el lobo vive entre las dos.
- **El cordero es la criatura entera de la tapa**: la máscara dada vuelta con los ojos verdes y los
  cuernos, el cuerpo de escamas y las dos patas con sus pies de uñas, en cuatro piezas. La silueta
  sale del recorte que ya estaba en el repo (`public/arte/cordero-rulo.png`, el frente entero
  achicado), llevada a 953 px. Camina con esas dos patas, que se turnan; pasta, huye cuando el lobo
  asoma cerca, y sigue atado: la soga va al cogote y no lo deja salir del círculo.
- **Lo único inventado del cordero** es el lomo que lo completa donde la tapa lo corta (arriba y a
  la izquierda), a aerógrafo, en los azules medidos de la tapa y del lado de la sombra, por debajo
  del recorte. **Los párpados** son elipses del color de la piel de arriba de cada ojo, medido en la
  tapa (`--bestia-*-parpado`), que bajan al parpadear.
- **El entorno sigue siendo inventado en la estética de las tapas** (`arte.ts`): las tiras de la
  contratapa de *Lobo suelto* y la pastura de *Cordero atado*. Los demás bichos del recinto siguen
  siendo ojos en lo oscuro.
- Los recortes pesan 150 kB y el monte, 330 kB. Son imágenes de las tapas, como el resto del
  collage del sitio (`D-14`: si llega un reclamo, se baja).

#### Abierto, sin trabar

- `T-440`: los demás recintos con el mismo criterio: si el bicho está en una tapa (la mosca, el
  perro de *Un baión*, Luzbelito, el bondi, el medallón de Momo), se recorta de ahí y se articula;
  si no, se inventa en la estética de su disco.
- `T-441`: con el lobo y el cordero ya recortados, sumar los eslabones de la cadena del lobo como
  piezas sueltas, para que se balanceen.

### Enmienda del 2026-10-16 (4): tres más de tapa — el perro, Luzbelito y Momo

Pedido del usuario: *"Elegí otras 3 bestias y continuá haciéndolas"*. Se eligieron con el criterio de
la tercera enmienda: bichos del bestiario que **tienen diseño real en una tapa**, para recortarlos y
no inventarlos.

- **"Ese perro que sigue allí"** (*Todo un palo*, de *Un baión*): el perro rojo de crayón de la tapa
  de *Un baión* (`RES-06`, `RES-22`), cortado en cabeza, mandíbula y fondo de boca. La tapa lo corta
  en el borde izquierdo, y así entra al baldío: por el borde. Sigue ahí, se asoma un poco más o
  menos, y de a ratos ladra abriendo la mandíbula. El baldío está en el violeta rayado a crayón de
  esa tapa, con los techos de chapa contra un farol.
- **Luzbelito**: la cabeza esculpida con la vela en la coronilla, de su tapa (`RES-06`), separada del
  fondo negro del óvalo por luminosidad. Está en su piedra en el infierno; la llama titila y el
  resplandor de la vela la sigue. **El fuego del infierno es la pincelada seca de la tapa de
  *Gulp!***, sin las letras y teñida de brasa: las llamas son pinceladas de Rocambole, no un dibujo.
- **Momo**: el medallón de *Momo Sampler*, que es la cara del rey del carnaval. Cuelga de un cordón
  en su templo, en el negro y la plata de esa tapa, bajo una guirnalda de focos; se mece, le pasa
  un brillo, y tocado gira como una moneda.
- **Los demás bichos de esos tres recintos** son ojos en lo oscuro, como en el monte: los gatos en
  los techos, los diablos con ojos rojos.
- El bocadillo dice las dos primeras líneas del verso cuando entran cortas: *"¿Cómo no sentirme así
  / Si ese perro sigue allí?"*.
- **Quedaron afuera, a propósito**: la mosca (en la tapa es chiquita y está pegada a las letras del
  rótulo, y recortada saldría sucia) y el bondi de *Último bondi* (la tapa es la banda, gente real).

#### Abierto, sin trabar

- `T-442`: la mosca, si aparece una imagen grande de la mosca de la tapa (la nota de `public/arte/`
  ya la pide); si no, inventada en la estética de *La mosca y la sopa*.
- `T-443`: los ocho recintos que quedan con figuras del mapa: el árbol, Cybersiberia, los astilleros,
  el bajo, la prisión, la mesa, el galpón y la ruta.

### Enmienda del 2026-10-16 (5): la pulida de UI/UX

Pedido del usuario: *"Hacele una pulida entera de UI/UX al bestiario"*. Se recorrió entero a 375 px y
a 1280 px, y se corrigió lo que se vio:

- **El bocadillo se iba de la pantalla** en las escenas de noche: se medía contra la escena entera y
  no contra lo que se ve después de correrla. Ahora se mide contra lo visible, la punta sigue al bicho
  aunque el bocadillo se corra, va abajo cuando arriba no entra, y dura ocho segundos en vez de cinco.
- **El perro arrancaba fuera de cuadro** en el teléfono: cada escena de noche arranca mirando a su
  protagonista (`data-foco`), y un rótulo seco avisa que se desliza de costado hasta que la gente lo hace.
- **En la compu las escenas de noche salen del renglón** (hasta 60rem) y entran enteras, sin correrse.
- **Los cinco de tapa se retratan con su recorte** en la ficha y en el índice, no con la figura del
  plano: el que tocó al perro en la escena ve al perro en la ficha.
- **El índice va en el orden del recorrido**, y cada recinto termina con "Volvé al plano".
- **Los rótulos del plano llegan a 44 px de toque**, y la barra de las escenas anchas va en la tinta.

### Enmienda del 2026-10-17 (6): el gordo Pierre, a pincel seco, en la Esquina del Sol inundada

Pedido del usuario, textual: *"hace otro ciclo sobre el bestiario redondo. Agrega otro personaje y
pulilo a fondo, se creativo que qeude como uno de rocambole."* La escribe el hilo principal en la rama
`ciclo-23/bestiario`, sobre `main` en `348ff26`.

- **Por qué Pierre.** Es el que el usuario pidió en el pedido que armó el bestiario (*"el gordo pier
  que tenga una botella y este en un lugar inundado con un vidrio roto"*), y el bajo era uno de los
  ocho recintos que seguían con las figuras del plano (`T-443`). No está en ninguna tapa, así que se
  inventa en la estética de su disco (`T-440`), que es *Gulp!* (1985).
- **La técnica es la de la tapa de *Gulp!*: pincel seco y fotocopia** (`lib/bestiario/pincel.ts`).
  Una pincelada son cerdas que siguen el recorrido del pincel, pegadas en mechones que se cargan y se
  secan juntos —eso deja las rayas largas de papel de la tapa, y no un picado parejo—, y la imprenta
  le pasa una fotocopia (`#xerox` en `aerografo.ts`) que corre el borde con ruido y lo deja duro.
  **Lo oscuro no es un contorno, es claroscuro**: en cada forma redonda (el cráneo, los cachetes, la
  nariz, la papada, la panza) la sombra es la medialuna del lado contrario a la luz, pintada con
  pasadas que le dan la vuelta a la forma (`volumen`). La luz entra por el vidrio roto. La primera
  prueba, a contorno, salió de dibujito; la que quedó es la segunda.
- **Pierre es un títere de papel**: pintado, recortado a tijera en seis piezas (cuerpo, cabeza, boca,
  mandíbula, brazo y antebrazo con la botella) y articulado. El canto del papel se dibuja solo donde
  se ve: donde una pieza tapa a otra no queda una costura cruzándole la cara. Los colores son los de
  *Gulp!*: el negro, la crema del papel, el rojo de las letras corrido sobre el amarillo (la nariz de
  vino, los cachetes, la corbata) y el verde de la letra del frente, que es la botella.
- **Lo único de Pierre que sale de una tapa es la etiqueta de la botella**: el «gulp.» pegado en la
  contratapa del disco. La imprenta aprendió a meter una tapa de verdad adentro de lo que imprime
  (`href="tapa:<archivo>"` en `scripts/imprimir-bestiario.mjs`), y con eso se recorta.
- **El bajo es la noche de la Esquina del Sol** (`RES-340`), con la ropa de *Un baión* (`D-19`): la
  pared es el crayón azul de la contratapa de ese disco, la tapa misma llevada a lo oscuro, y el agua
  es el mismo crayón, el pedazo sin letras, aplastado y espejado. La puerta deja ver la calle con el
  farol por un agujero despatarrado; por ahí entra el agua, que cae por la puerta, y afuera llueve. En
  el escenario, el bafle, el pie del micrófono con el cable que se va al agua y el bombo con un sol
  pintado: la banda tocó igual. Adelante flotan un bote dado vuelta, una silla y una botella vacía.
- **Pierre está metido hasta la panza**: el agua de adelante es la misma imagen del agua, cortada
  donde lo toca, así le tapa la panza de abajo sin costura. **Y se refleja**: una copia viva
  (`<use>`) dada vuelta y cortada en tiras, que hace todo lo que hace él.
- **Vive**: flota con el agua y respira; cada tanto se empina la botella (el brazo se dobla en el codo
  y el pico le llega a la boca: un test lo mide) o se ríe de algo que se acordó. **Tocado, se ríe a
  carcajadas hasta que tose**, que es lo que dice la letra. Cuando se sacude, la panza le hace ondas en
  el agua. En el teléfono el bocadillo le cuelga de la papada, para no taparle la cara.
- **Los demás del bajo son ojos en lo oscuro**, como en los otros recintos de noche; los que están en
  el agua llevan su reflejo. El amorcito que mordió el vidrio mira desde la ventana de al lado, rota
  también.
- **La estampa de Pierre dice qué es del dibujo**: la botella y la cara no salen de la letra ni de una
  foto (Pierre es una persona; el dibujo no la retrata). La etiqueta sí es de verdad.
- Las diez piezas nuevas pesan 268 kB.

#### La pulida que vino con la vuelta: la isla ya no se lleva el dibujo

Desde la quinta vuelta la isla importaba `escenas.ts` para leer dónde iban Luzbelito y Momo, y
`escenas.ts` arrastra `titeres.ts` y `arte.ts`: el teléfono corría el aerógrafo entero de los cinco
recintos al abrir la página para no usar nada (la isla pesaba 33,6 kB). La geometría de los recintos
de noche se pasó a `rig.ts`, que son números; con Pierre adentro la isla pesa 22,1 kB.
`bestiario.test.ts` sigue los imports de la isla de punta a punta y falla si vuelve a alcanzar un
módulo que dibuja.

#### Abierto, sin trabar

- Sin tareas nuevas. Siguen `T-431` (que `contenido` lea la estampa nueva de Pierre), `T-435` (las
  tintas nuevas, `--bestia-pierre-*` y `--entorno-bajo-*`, al lienzo: se cargaron primero en
  `tokens.css`, como las demás del bestiario), `T-437` y `T-439` (los cuadros por segundo en un
  teléfono de verdad: el reflejo con máscara es la capa más cara del bestiario, y con el panel del
  navegador oculto no se pudo medir) y `T-443`, que baja a siete recintos.
- Para el próximo inventado de *Gulp!* (Barbazul, el que no se cayó del cielo) la técnica ya está:
  `pincel.ts`.

### Enmienda del 2026-10-18 (7): el camino con cruces, empezando por el monte y la pastura

Pedido del usuario, en dos tiempos. Primero, textual: *"Me gustaria que los diferentes entornos esten
conectados y sea todo mas inmersivo en el bestiario. Quiero que sea una aventura scrolleable, que
vayan apareciendo los personajes y puedas elegir con flechas a donde ir y scrolleando avanzas o asi.
Investiga como hacer esto o diferentes formas de lograr mi deseo."* Se investigaron cinco caminos (la
bajada continua, el cuarto por cuarto con flechas, el mundo entero con cámara libre, un juego de
plataformas con `kaplay` y el camino que camina de costado) y se le mostró una maqueta. Eligió,
textual: *"Dale con el camino con cruces: una página por región, scroll que camina de costado y
flechas en el cruce. Arrancá por el monte y la pastura como prueba."* La escribe el hilo principal en
la rama `bestiario/camino-con-cruces`, sobre `main` en `159b1bc`. **Se escribió como novena**
porque la drácula y la carga de a una, de `ciclo-24/bestiario`, ya se habían escrito como séptima y
octava; **se renumeró a séptima al integrar**, porque esta llegó antes a `main` (PR #54). Las de
`ciclo-24/bestiario` pasan a octava y novena cuando entren, como dice `integrar.md`.

- **Una página por región** (`/redondopedia/bestiario/el-monte/`, `/la-pastura/`;
  `pages/redondopedia/bestiario/[region].astro`). Cada región que tiene su tramo en
  `lib/bestiario/camino.ts` es una página. El plano redondo y los recintos siguen donde estaban; el
  recinto del monte suma una puerta, "Entrá caminando".
- **Bajar es caminar.** La escena queda pegada a la pantalla mientras su sección pasa, y la isla
  (`scripts/camino.ts`) corre cada capa a su velocidad: lo lejano a 0,45, el piso con los bichos a la
  par del dedo, lo de adelante a 1,3. La sección mide de alto lo que hay que caminar: **un píxel de
  bajar es un píxel de caminar**. No se secuestra el scroll: la página baja como baja siempre, con su
  inercia y su barra, y la isla solo lee dónde está.
- **Los bichos aparecen al llegar.** Los ojos de lo oscuro se encienden cuando entran a la vista. El
  lobo suelto, en su monte, asoma desde atrás del borde del piso cuando lo tenés cerca, te sigue con la
  cabeza mientras pasás y se hunde cuando te alejás. En la pastura viven el lobo y el cordero como en
  su recinto: la lógica pasó a `scripts/bestiario/pastura.ts`, que comparten las dos islas, y el claro
  va corrido adentro del piso largo con las mismas coordenadas de `rig.ts`.
- **El cruce, al final de cada camino**: un cartel de papel por región vecina (`vecinas` en el JSON),
  con el borde en la tinta de su disco y **la flecha para el lado donde queda en el plano redondo**.
  Las que todavía no se caminan llevan a su recinto, con el borde cortado y el sello "EN EL PLANO".
  Antes de llegar, el cruce se anuncia: al final del monte se ve la luz naranja de la pastura entre los
  árboles, y al salir del claro, la vela de la mesa servida. Al pasar de una región a otra, la página
  cambia con el tránsito de todo el sitio (`ADR-03`); no se agregó una adhesión ni un nombre de tránsito.
- **El arte es el mismo monte, largo** (`lib/bestiario/arte-camino.ts`): las tiras de *Lobo suelto* y
  la pastura de *Cordero atado*, a lo largo de 2400 unidades. Lo lejano y lo de adelante los comparten
  los dos tramos, porque la pastura es un claro del monte: el que pasa de uno al otro sigue viendo los
  mismos árboles, y la segunda página carga del caché. Para apoyar el claro sin arrastrar el piso del
  recinto, `arte.ts` separa `claroDeLaPastura()` de `monteCerca()` (el recinto se imprime igual). Las
  cuatro piezas pesan 567 kB y cada página carga tres.
- **Una sola ficha**: la del índice pasó a `components/bestiario/FichaBestia.astro`, y la usan el
  bestiario y cada camino. Abajo de la escena va la lista de los que andan por ahí; el lobo, en la
  pastura, con el sello "DE PASO". La libreta es la misma: lo que anotás en un lado cuenta en el otro.

#### La capa de abajo alcanza sola (molinetes abiertos)

Sin JavaScript y con movimiento reducido, la escena es una tira que se corre de costado con el dedo,
como los recintos de noche: las capas van juntas, los ojos y el cruce están a la vista, y el lobo y el
cordero quedan en una pose quieta que trae el HTML. Por eso lo lejano mide lo mismo que el piso,
aunque su velocidad pida menos: si no, al final quedaba la noche vacía. Para el teclado, un salto
directo al cruce, y lo que recibe el foco adentro de la escena se trae a la vista.

#### El movimiento

Lo que se mueve con el dedo no es animación: es la escena siguiendo al scroll, y con movimiento
reducido no pasa. Lo que aparece solo (los ojos, el cruce) aparece con opacidad sobre
`--duracion-umbral`, que el corte lleva a cero. Sigue valiendo la excepción de la segunda vuelta: los
bichos se mueven adentro de las escenas, solo lo que se ve.

#### Abierto, sin trabar

- `T-470`: los tramos de las otras regiones, uno por ráfaga. La sesión de los fondos
  (`bestiario/fondos-rocambole`) arma el arte de seis entornos con funciones que reciben
  `(ancho, alto = 640)`, la geometría en `rig-entornos.ts` y una `luzQueAsoma(region, x, y)` para el
  final de los pisos vecinos, siguiendo la especificación de esta enmienda. Cada tramo nuevo suma sus
  tres piezas en `arte-camino.ts` y su entrada en `CAMINOS`.
- `T-471`: probarlo en un teléfono de verdad, gama baja e iPhone: los cuadros por segundo con tres capas
  de ~3000 px y `will-change`, y la escena pegada con `100svh` y la barra de Safari.
- `T-472`: que `experiencia` escriba el flujo del camino (`UX-`) y decida si los rótulos del plano
  tienen que llevar al camino en vez de al recinto cuando la región ya se camina.
- `T-473`: el recinto del monte de la página del bestiario, sin JavaScript, dibuja al lobo y al cordero
  sin pose (enormes, en la esquina): el mismo defecto que el camino resolvió con la pose quieta en el
  HTML. Se arregla igual en `escena-monte.ts`.
- `T-474`: el cartel del cruce y la puerta "Entrá caminando" al lienzo (hoja 08, componentes). No
  trajeron tintas nuevas: todo sale de `tokens.css`.

### Enmienda del 2026-10-18 (8): la drácula con tacones, tallada, en la prisión de Barbazul

Pedido del usuario, textual, el mismo de la sexta vuelta: *"hace otro ciclo sobre el bestiario
redondo. Agrega otro personaje y pulilo a fondo, se creativo que qeude como uno de rocambole."* Le
llegó a dos sesiones; al ver que la otra ya había hecho a Pierre, el usuario eligió *"Otro más,
encima del #52"*. La escribe el hilo principal en la rama `ciclo-24/bestiario`, sacada de
`ciclo-23/bestiario` en `b30b481`. Se escribió como séptima enmienda y pasó a octava al integrar:
el camino con cruces (PR #54) llegó antes a `main` con la séptima (`integrar.md`).

- **Por qué ella.** La prisión de Barbazul viste *Oktubre* (`D-19`), y de los diez que viven ahí la
  única que sale de un tema de ese disco es la drácula con tacones (*"Preso en mi ciudad"*). Así el
  personaje y su recinto comparten la técnica de la tapa, que en el bestiario todavía no estaba. No
  está en ninguna tapa: se inventa en esa estética (`T-440`).
- **La técnica es la de la gente de *Oktubre*: grabado** (`lib/bestiario/grabado.ts`). La plancha
  es negra y la luz se le saca a gubia: cada corte es una línea con ancho, que engorda donde pega la
  luz hasta juntarse con la de al lado (queda un plano blanco) y se afina hasta cortarse donde la
  forma se da vuelta (queda el negro). Los cortes no son paralelos de regla: dan la vuelta a la
  forma (`envolventes`), bajan por el cachete (`siguiendo`) o salen de un punto (`rayos`). La luz
  se aprieta (`apretada`): en la tapa casi no hay medio tono, y la raya queda para el paso de lo
  blanco a lo negro. La imprenta le pasa la gubia al filo de cada corte (`#gubia`) y deja motas de
  papel en el negro, como la tinta de una prensa a mano (`#motas`). La primera prueba de la cara
  salió rayada como una cebra, por exceso de medio tono; la que quedó es la cuarta.
- **Los colores son los de la tapa.** La plancha es `--fondo`; el blanco de la gente se midió en las
  caras del frente (`--bestia-dracula-papel`); lo de atrás del recinto se talla con el gris que
  Rocambole contó que agregó (`--disco-oktubre-apoyo`), y así la drácula, tallada en blanco, se
  despega de la pared sin un contorno. **El único color es el rojo de las banderas**, y ella lo lleva
  adentro: la boca, el cuello alto de la capa por dentro y el forro.
- **Es un títere de papel de trece piezas**: la espalda de la capa con el cuello alto, las dos
  piernas con medias y tacos aguja, el vestido con el escote, la cabeza (con la boca y la mandíbula
  adentro, como Pierre), las dos mitades negras de la capa, los dos forros, la mano de uñas largas
  que cierra la capa sobre el pecho y los dos mechones que caen encima. **La capa se abre como dos
  puertas de papel**: cada mitad negra se achica contra su hombro hasta quedar de canto, y del otro
  lado se despliega el forro, que es un ala de murciélago roja con el brazo levantado y la mano que
  tira del borde. Abierta, la capa es una bandera.
- **La prisión es un pasillo de celdas tallado**, visto de frente: hiladas de ladrillo, rejas de
  celda (en blanco las de adelante, en gris las del fondo), el charco de luz de la ventana en el piso
  con la sombra de cada barrote, un foco pelado, la jaulita del pajarito del Lavi-rap colgada del
  techo, la puerta de Barbazul con su manojo de llaves y la garita de la guardia. Adelante, la jaula
  de la fiera más fiera, abierta y vacía, con la cadena rota y un hueso.
- **Lo que sale de una tapa de verdad es la calle**: por la ventana enrejada del fondo se ve la
  gente de la tapa de *Oktubre*, y sus cinco banderas flamean afuera. Es *"Preso en mi ciudad"*
  dibujado sin dibujar nada: el preso mira la ciudad por la reja. La imprenta mete la tapa entera y
  la parte con dos filtros nuevos: a la calle le saca el rojo (`#sin-rojo`), y cada bandera es lo
  rojo de la tapa recortado por su polígono (`#solo-rojo`), así flamean sin quedar dobles. Son
  imágenes de la tapa, como el resto del collage del sitio (`D-14`: si llega un reclamo, se baja).
- **Vive.** Taconea por el pasillo: camina un tramo, se para, y cada taco que apoya suena con dos
  cortes blancos en el piso. Quieta, a veces se acomoda la capa (asoma el rojo) y a veces mira para
  la ventana. Mira siempre con los ojos a media asta (`entornados`). **Tocada, abre la capa**, echa
  la cabeza para atrás, abre la boca con los colmillos y entorna los ojos, y afuera las banderas
  flamean más fuerte. **La jaula vacía se toca aunque no tenga a nadie** (la estampa ya decía que a
  la fiera la estás buscando vos): la puerta chirría y va y viene. Los demás del recinto son ojos en
  lo oscuro, como en los otros recintos de noche: Barbazul en su puerta, la guardia en la garita, el
  pichón en el alféizar, el pajarito en su jaula.
- **La estampa de la drácula dice qué es del dibujo**: la capa y la cara no salen de la letra; la
  gente y las banderas de la ventana sí son de verdad. La ficha la retrata con la capa abierta.
- **Pulida de la vuelta.** La escala la decidió el navegador: a 0,94 era más alta que las puertas de
  las celdas y quedó en 0,8. La cara se apretó a planos (los ojos redondos le daban cara de asustada;
  ahora el párpado pesa y las cejas bajan en V). El foco se corrió a la derecha porque le quedaba de
  aureola. El fondo pasó de 215 kB a 118 kB: los planos de atrás van sin motas, que lejos no se ven
  y pesan mucho, y se imprime un poco más comprimido (`calidad` en `Pieza`, nuevo). Las 23 piezas
  nuevas pesan 385 kB.
- **Lo que vigila `bestiario.test.ts`**: que la drácula tenga cada parte que mueve la isla, con su
  imagen y su bisagra en el hombro; que el forro arranque plegado (sin la isla, la capa está
  cerrada); que la prisión tenga a sus diez y que la jaula de la fiera no tenga ojos; que la
  drácula camine por el piso del pasillo sin meterse en la jaula; que la calle y las banderas sean
  la tapa de *Oktubre*, con cada asta adentro de la ventana; que la talla salga igual en cada
  impresión y no corte nada donde no hay luz; y que la isla no se lleve `grabado.ts` ni
  `arte-prision.ts` al teléfono (pesa 26,1 kB, 4 más que con Pierre).

#### Abierto, sin trabar

- `T-444`: Barbazul, el dueño de la prisión, que hoy es un par de ojos en su puerta. Su tema es de
  *Gulp!*: puede ir a pincel seco (`pincel.ts`) como Pierre, o tallado como su recinto
  (`grabado.ts`); que lo decida la vuelta que lo haga.
- `T-445`: el bestiario baja cerca de 1,8 MB de imágenes de una al abrir la página, y con cada
  recinto nuevo crece. Diferir la carga de las escenas de noche hasta que el recinto se acerca, sin
  romper la página sin JavaScript. Es la mitad de `T-439` que se puede hacer sin un teléfono.
- Siguen `T-431` (que `contenido` lea la estampa nueva), `T-435` (`--bestia-dracula-papel` al
  lienzo), `T-437`/`T-439` (cuadros por segundo en un teléfono de verdad: con el panel del navegador
  oculto el navegador frena los cuadros, y la animación se vio con movimiento reducido simulado) y
  `T-443`, que baja a seis recintos.

### Enmienda del 2026-10-18 (9): lo que pesa llega cuando se acerca (`T-445`)

Pedido del usuario: que la tarea `T-445`, propuesta al cerrar la vuelta de la drácula, se hiciera en
la misma sesión (*"Do this task here"*). La escribe el hilo principal en `ciclo-24/bestiario`, encima
de la octava vuelta. Se escribió como octava enmienda y pasó a novena al integrar, por la misma razón.

- **Lo que pasaba.** Cada recinto de noche y cada retrato de un títere son un SVG con `<image>` que
  apuntan a las piezas impresas, y el navegador las baja apenas carga la página. Medido en el HTML
  construido el 2026-10-18: **59 imágenes, 1673 kB**, antes de que la gente vea el plano. El índice
  no ayudaba: sus retratos (`retrato()`) usan las mismas piezas que las escenas, así que diferir
  solo las escenas no alcanzaba.
- **Lo que se hizo: cada escena y cada retrato esperan en un `<noscript>`** (`lib/bestiario/carga.ts`,
  `enEspera`). Adentro va el SVG entero; afuera, un SVG vacío con la misma clase y la misma caja que
  le guarda el lugar (`data-espera`). Con JavaScript, lo de adentro de un `<noscript>` es texto: no se
  dibuja ni baja nada. La isla lo pasa a SVG (`materializar`) cuando el recinto o la ficha quedan a una
  pantalla y media (`IntersectionObserver` de `150%`), y lo pone en el lugar del vacío, que ya medía lo
  mismo: la página no salta. El armado de cada recinto (su controlador, el foco, las anotadas) pasó a
  `montar()`, que corre en ese momento. Una ficha que se abre en la hoja antes de que su lugar en el
  índice se haya armado se arma en la copia.
- **Sin JavaScript se ve todo, igual que antes, y no hay nada repetido**: el `<noscript>` se dibuja
  como siempre y una regla que solo existe sin JavaScript (`SIN_ISLA`) esconde los vacíos. Se
  descartó poner la ruta en un atributo y que la isla la pase a `href`: sin JavaScript las escenas
  quedaban negras. También se descartó tener cada escena dos veces, una diferida y otra en un `<noscript>`:
  pesaba en el HTML de todos y repetía los `id` de los recortes.
- **Lo que no espera**: los recintos que no piden piezas (los de figuritas del plano) salen tal cual,
  y el plano redondo de arriba es vector.
- **Medido después.** En el HTML construido, la página no pide ninguna pieza de entrada, y las 59
  esperan en 20 `<noscript>` (6 escenas y los 14 retratos del índice). En el navegador del panel, a
  375 px y arriba de todo, baja solo el monte con el lobo y el cordero: **10 piezas, 466 kB, un 72 %
  menos**. Al bajar hasta la prisión se arman ella y sus dos vecinas (el baldío y el infierno); en el
  índice, los retratos que quedan cerca. La isla pesa 27,3 kB (1,2 más).
- **Una cosa aprendida en el navegador, que vale para probar**: con el panel del navegador oculto, el
  navegador no pinta, y un `IntersectionObserver` no avisa nada (tampoco uno nuevo hecho a mano). Una
  captura de pantalla fuerza el pintado, y ahí se arma lo que estaba cerca.
- **Lo que vigila `bestiario.test.ts`**: que el vacío no pida ni una pieza y mida lo mismo que el de
  verdad; que el de verdad esté entero en el `<noscript>`; que lo que no pide piezas no espere; y que la
  página no vuelva a dibujar de entrada una escena o un retrato, y que la isla arme lo que espera al
  montar un recinto y al copiar una ficha a la hoja.

#### Abierto, sin trabar

- **`T-445` queda hecha.** De `T-439` queda la mitad que necesita un teléfono: los cuadros por
  segundo y la memoria con varios recintos armados a la vez.
- Cuando entren los recintos nuevos de `bestiario/fondos-rocambole`, sus escenas tienen que pasar por
  `enEspera` como las demás: si llegan con `set:html={rc.svg}`, la prueba de la página falla.
- **Al integrar, con el camino ya en `main`**: la ficha se mudó a `FichaBestia.astro`, que comparte la
  página del camino. Los retratos esperan solo cuando la página lo pide (`espera`), y lo pide la del
  bestiario: el camino ya dibuja de entrada al lobo y al cordero que retrata, así que ahí diferirlos no
  ahorraba nada y le hubiera pedido a su isla armarlos.

### Enmienda del 2026-10-18 (10): los seis entornos, cada uno en la tapa de su disco

Pedido del usuario, textual: *"Armá un fondo bien rocambole para cada uno de los entornos del bestiario
redondo [...] un entorno adecuado para cada parte del mapa. Si ya tiene un entorno hecho bien buscá cómo
mejorarlo."* Y a mitad de camino: *"ahora el bestiario es una especie de aventura scrolleable. Que tus
fondos lo tengan en cuenta."* La escribe el hilo principal en la rama `bestiario/fondos-rocambole`, sobre
`main` en `159b1bc`, en paralelo con la drácula (`ciclo-24/bestiario`, que hizo la prisión) y el camino
con cruces (`bestiario/camino-con-cruces`). Por eso la prisión no está acá. Es la décima porque el camino entró
a `main` como la (7) (PR #54), y la drácula y la carga de a una como la (8) y la (9) (PR #56).

- **Cierra `T-443`**: los seis recintos que seguían con las figuras del plano pasan a ser de noche,
  pintados a aerógrafo en tres capas (`lib/bestiario/arte-entornos.ts`). Cada uno viste la tapa de su
  disco (`D-19`), con los colores medidos con k-medias sobre las tapas reales de
  `Docs/INVESTIGACION/TapasDiscos/` (los `--entorno-*` nuevos de `tokens.css`):
  - **El galpón** es la noche de *En directo*: la luz roja que revienta arriba a la derecha, la gente
    impresa en trama de puntos, de espaldas, con una bengala, y en el tablado la silla vacía bajo el
    seguidor, la fuente de buñuelos y la bestia pop, encorvada y con lentejuelas. De fondo cuelga un disco.
  - **El árbol del gran bonete** es *Luzbelito*: la llanura roja con huevos de plata bajo el cielo violeta
    del interior del disco, y el árbol hecho del mármol verde del frente. Del marco de cobre de la tapa,
    colgado vacío de una rama, se ve otra noche, con luna.
  - **Cybersiberia** es *Último bondi*: el cielo es la chapa remachada de la tapa, con las pistas de
    circuito en relieve, y la tele es el ojo de buey, prendida en la nieve, con el Alien Duce adentro. La
    fila de agujeros de la tapa son los puntos que se come el pac-man. **Nieva** (una animación en bucle,
    `nevar`, que se apaga con movimiento reducido como la mosca).
  - **Los astilleros** son la contratapa del disco 2 de *Cordero atado*: tiza azul y espirales sobre lo
    oscuro, los containers en el naranja del frente, y la luz de un farol de sodio.
  - **La mesa** es *La mosca y la sopa*: un collage de papel rasgado sobre el rojo de la tapa. La foto del
    escenario del frente tiene su seguidor, que se escapa de la foto y cae en la olla de la contratapa. Por
    la ventana se ve la pastura. **La mosca queda pintada acá** (`T-442`, en su estética).
  - **La ruta** es el surco del disco: el asfalto es vinilo, y en el horizonte se recorta el mundo redondo
    entero, cada región con su luz. Los cuatro fierros pasan pintados —el último bondi de chapa remachada
    con ojos de buey por ventanillas, la Mariposa Pontiac con alas, el camión del héroe del whisky y el
    toxi-taxi con su sombra atrás— y lo que espera en la banquina se queda quieto.
- **Los bichos siguen el régimen de los recintos de noche**: los que miran desde lo oscuro son ojos, y los
  que no tienen ojos —una cosa, como la silla, la tele o el balde de almejas, o uno que se ve de
  espaldas— se tocan donde están pintados (`cosa()` en `escenas-entornos.ts`). Cada uno tiene su silueta
  pintada debajo de los ojos, para que no floten.
- **Para el camino** (la aventura que se camina de costado): cada capa es una función de `(ancho, alto)`
  que siembra todo el ancho de una vez, lo lejano es ambiente y los hitos van en el piso, y la geometría
  vive en `rig-entornos.ts`, que son números. `luzQueAsoma(región, x, y)` pinta la luz de cada entorno
  para anunciarlo desde el vecino. El recinto imprime las capas a 900; las largas las suma el camino
  cuando arme cada tramo. Un test las arma a 1850, 2400 y 3036 sin imprimirlas.
- **Mejora de dos que ya estaban**: el infierno encantador tenía la mitad de abajo vacía y ahora es un
  salón de baile, con piso de damero en perspectiva que devuelve el fuego de *Gulp!*; el templo de Momo
  tiene serpentinas colgando de la guirnalda y papel picado en el piso, en la plata y el oro de *Momo
  Sampler*.
- **La ruta de papel del plano** (`dibujarRuta` en `mapa.ts`) se borró: ya no la usaba nadie.
- Las 23 piezas nuevas pesan 2,5 MB: lo lejano a 2 por unidad y lo transparente a 1,5, que con alfa pesa
  el doble y en un teléfono no se distingue.

#### Abierto, sin trabar

- Sin tareas nuevas. `T-435` suma las tintas nuevas al lienzo; `T-437` y `T-439` (los cuadros por segundo en
  un teléfono de verdad) ahora incluyen la nieve.

### Enmienda del 2026-10-18 (12): el negro Atila, a aerógrafo, en la medianera del baldío

Pedido del usuario, textual: *"Hace a El negro Atila para el bestiario redondo, diseñalo como rocambole,
integra todo, que tenga sentido y detalles bien redondos, se creativo, chisotos y acido"*. La escribe el hilo
principal en la rama `bestiario/negro-atila`, sobre `main` en `45777d4`, con `main` adentro en `46d36d1` (los
seis entornos, PR #57). Es la duodécima porque la (11) la tiene reservada Barbazul (`bestiario-25`); si
alguna entra antes con este número, se renumera al integrar, como dice `integrar.md`.

- **Por qué el Atila.** Es uno de los 27 que el usuario puso primero a diseño (`HILO-para-bestiario-prioridad-de-figuras`),
  y su fondo, el baldío, ya estaba. No está en ninguna tapa: se inventa en la de su disco (`T-440`), que es
  *Lobo suelto* (1993; el tema es la pista 2).
- **La técnica es la de esa tapa: aerógrafo en sepia** (`lib/bestiario/arte-atila.ts`, con las tintas
  `--bestia-lobo-*` que ya existían: no suma tokens). La cara va partida en una mitad de luz y otra hundida
  en sombra, como la del lobo; el ojo de la luz es grande, ojeroso y de iris humano, y el de la sombra,
  chico y amarillo. La bufanda va acanalada como el pecho del lobo, y el cuello levantado del gabán abre en
  punta, como sus orejas. El canto que da al farol lleva la luz lila del baldío: es un recorte de *Lobo
  suelto* pegado en la noche de *Un baión*.
- **Lo que sale de la letra**: el gabán donde se hunde (la cabeza baja detrás del cuello), el frío
  masticado (masca, y le sale vaho), el metálico brillo del bolsillo (se escapa cada tanto), el olfato del
  ratón (del gato matón no pasa: lo huele y se vuelve) y el ladrón al que nunca atrapan.
- **Lo que agrega el dibujo, y la estampa lo dice**: cada tanto barre los techos la sirena de la cana, una
  luz roja de ocasión que falla. Él se tira del otro lado de la medianera (lo que baja del canto del muro no
  se ve: `atila-pared`), y lo delata el vaho, que va afuera del recorte y sube igual. Después asoman el funyi
  y los ojos, miran para los dos lados, y vuelve. **Tocado, abre el gabán como un vendedor de vereda**, con
  las dos hojas que giran en la costura como la capa de la drácula. En el forro tiene relojes, cucharitas,
  una llave, un eslabón de la cadena del lobo (por algo anda suelto), la dentadura del caníbal desdentado
  (por eso enseña a masticar sin dientes) y la sirena de la cana, que se prende (por eso compró matraca
  nueva, de ocasión). Y guiña. La ficha lo retrata así, abierto.
- **En los techos de la derecha, un tanque de agua** en el crayón del baldío. El gato que llamás con
  silbidos mira desde ahí.
- **Lo que se cuenta: tres testimonios del memoir** (`RES-21`, p. 321, cotejados con `pdftotext`): que el
  tema es una declaración de amor a los perejiles que iban a ver a la banda y que Atila es una invención;
  que hay gente que se calza el saco del personaje para tener más levante, como pasó con el Negro Cañón; y
  que la batería electrónica sonó rudimentaria y todavía le duele.
- **La isla no se lleva el dibujo**: la geometría vive en `rig.ts` (`ATILA`, `ATILA_ARMADO`) y la conducta en
  `scripts/bestiario/atila.ts`, aparte, como la pastura; la isla del bestiario solo lo arma en el recinto del
  perro. Lo compartido se tocó lo mínimo, porque otras sesiones están haciendo personajes al mismo tiempo.
- **El baldío arranca mirando entre el perro y el Atila** (`foco` 470): en el teléfono entran los dos.
- Las 17 piezas nuevas pesan 117 kB (119.572 bytes).

#### Cómo se verificó

`bestiario.test.ts` suma tres pruebas: el títere entero con sus bisagras, que escondido no se le ve ni el
funyi y asomado sí los ojos, y que lo que se llevó es de bestias que existen. La conducta se corrió en Node
contra un DOM de juguete, un minuto: mientras pasa la luz estuvo escondido el 100 % de los cuadros, caminó
entre 471 y 693, y al tocarlo abrió el forro y lo volvió a cerrar. En el navegador del panel, a 375 px: la
escena arranca con él a la vista, el bocadillo dice el verso colgado sobre la pared y la ficha lo muestra
con el gabán abierto. **El panel estuvo oculto**, así que la animación no se vio correr: eso queda para `T-480`.

#### Abierto, sin trabar

- `T-480`: ver al Atila animado con el panel visible o en un teléfono: el paso por la medianera, la sirena
  que barre, el vaho que lo delata y el gabán que se abre.
- Siguen `T-431` (que `contenido` lea la estampa y los testimonios nuevos) y `T-437`/`T-439` (los cuadros por
  segundo: el baldío suma una luz con `mix-blend-mode`).

## D-74 — El sitio se muda a una cuenta Hobby de Vercel

- **Fecha:** 2026-10-17
- **Estado:** cerrada — pedido directo del usuario, textual: *"Estoy pensando mudar el proyecto de
  vercel a una cuenta free para poder usar mi cuenta pro en otro proyecto de mayor importancia."*
  La mudanza la hizo el usuario en el panel, guiado por el hilo principal; esta decisión la escribe
  el hilo principal en la rama `vercel/hobby`, sobre `main` en `76cf504`.
- **Cierra** la acción pendiente que `RES-15` le dejó al usuario en `D-15`: el proyecto ya no vive en
  un equipo Pro. En Hobby no hay cargo posible; al agotar un cupo el recurso se frena.

### Dónde quedó

- **Cuenta:** una cuenta de Vercel aparte, con otro mail, cuyo equipo Hobby se llama `knesantos` y
  tiene conectado el GitHub `knesantos`. El proyecto conserva el nombre `arcade-ricotero` (`D-60`).
- **Direcciones:** `fichinricotero.com.ar` (redirige con 308 a `www`), `www.fichinricotero.com.ar` y
  `arcade-ricotero-ochre.vercel.app`. **`arcade-ricotero.vercel.app` murió** con el proyecto viejo:
  da 404 desde el 2026-10-17.
- **DNS:** en NIC no cambió nada, siguen `ns1.vercel-dns.com` y `ns2.vercel-dns.com`. El dominio pasó
  de cuenta con el *Verify & Claim* de Vercel: un TXT en `_vercel.fichinricotero.com.ar`, cargado en
  la zona que todavía servía la cuenta Pro.
- **Verificado desde afuera el 2026-10-17:** `www` responde 200, la raíz 308, un mp3 de
  `public/audio/` 200 con `audio/mpeg`, y `/_vercel/insights/script.js` 200.

### Por qué así y no con *Transfer Project*

La transferencia de Vercel no corta el servicio y mueve el dominio sola, pero pide ser miembro del
equipo de destino (https://vercel.com/docs/projects/transferring-projects, consultado 2026-10-17). El
login Pro no tenía equipo Hobby (su espacio personal era el que estaba en Pro), y a un Hobby no se le
suman miembros. Así que el proyecto se importó de nuevo en la otra cuenta y el dominio se reclamó
con el TXT.

### Lo que se perdió

- `arcade-ricotero.vercel.app`, y con él cualquier enlace viejo a esa dirección.
- La historia de la analítica (`D-56`). En Hobby hay 50.000 eventos por mes y un mes de historia
  (https://vercel.com/docs/analytics/limits-and-pricing, consultado 2026-10-17).

### El riesgo de los commits, y por qué el repo es público

El repo es privado y parte de los commits los firma `Claude <noreply@anthropic.com>`. La documentación
oficial de Vercel se contradice sobre si eso frena un despliegue en Hobby:

- https://vercel.com/docs/git#using-hobby-teams dice que el chequeo del autor solo aplica a
  repos de *GitHub organizations*, no a cuentas personales como `knesantos`.
- https://vercel.com/docs/deployments/troubleshoot-project-collaboration dice, sin esa excepción, que en
  Hobby el autor del commit tiene que ser el dueño del equipo. Y también: *"Collaboration is free for
  public repositories."*

Producción despliega el commit de fusión de cada PR, que firma `knesantos`, y el primero salió bien
(`76cf504`). **Si algún despliegue aparece como *Blocked*, el repo se hace público**: lo autorizó el
usuario el mismo día (*"Si hacer el repo publico facilita todo se puede hacer y corta"*). La historia
ya se revisó para eso: nunca se commiteó un PDF ni un `.env`, y no hay cadenas con forma de clave.
Quedarían a la vista los mp3 de `public/audio/`.

**Pasó el mismo día, y el repo ya es público.** La vista previa del PR #51 (`8217561`) salió *Blocked*
con *"Git author knesantos must have access to the project on Vercel to create deployments"*, y eso que
el commit lo firma `knesantos`, no Claude. El despliegue de `76cf504` había salido porque lo disparó la
importación, no un push: con el repo privado, el próximo push a `main` tampoco se habría publicado. El
usuario eligió hacerlo público (*"Sí, hacé público el repo"*), y el hilo principal lo cambió el
2026-10-17 con `gh repo edit --visibility public`.

### Pendiente del usuario

- Borrar el TXT `_vercel` de la zona del dominio, ahora en la cuenta Hobby.
- Confirmar que Web Analytics figure *Enabled* en el proyecto nuevo.
- Hacer un despliegue de prueba del otro proyecto de la cuenta Pro. Vercel ata cada GitHub a una sola
  cuenta, y conectar `knesantos` a la cuenta Hobby pudo haberlo desconectado de la Pro.

## D-75 — La Redondopedia de noche: un lugar en el borde de la hoja, hilos al pie, y la lectura quieta

- **Fecha:** 2026-10-17
- **Estado:** activa. Pedido directo del usuario, textual: *"Hace una pulida extrema de ui/ux a la
  redondopedia, debe sentirse inmersiva, misteriosa y mistica. Al mismo tiempo debe ser facil de leer
  y que leyendo algo te de ganas de seguir con otra cosa, no de forma forzada sino que cause interes
  real."* La escribe el hilo principal en la rama `diseno/redondopedia-inmersiva`, sobre `main` en
  `83f6172`. Antes de tomar el número se miraron `origin/main` y las ramas remotas: la última es `D-74`.
  `D-75`, `UX-39` y `T-450`+ se acordaron con las dos sesiones del bestiario que corrían a la vez (el
  ciclo 24 del bestiario usa `T-444`..`T-449`).
- **Enmienda** la fila "Redondopedia — un artículo" de `UX-20` §2 (*"Nada de movimiento nuevo"*) y la
  frase de `T-187` que decía que la inmersión de un artículo era *"tipográfica y nada más"*. **No toca**
  `UX-20` §3: rótulos, símbolos y las tres pantallas graves siguen igual que antes.

### El principio: el misterio en el borde, la lectura en el medio

El pedido trae dos cosas que tiran para lados distintos, y `T-187` ya había explicado por qué: un
artículo con clima propio puede ser más difícil de leer y **borrar la frontera entre el hecho y la
leyenda**. La salida fue no tocar el medio. Todo lo nuevo vive en el borde de la hoja (arriba la tapa
y el título, abajo los hilos), y el cuerpo rotulado sigue sobre tinta lisa, quieto, con los rótulos
fríos. Lo único que cambió en el medio es que la letra creció a 17 px.

### Lo que se hizo

1. **El lugar.** Cada artículo trae una tapa velada que sube desde arriba de la ventana, detrás del
   regreso y del título, y se pierde en la tinta antes del cuerpo (`.lugar` en `Base.astro`, prop
   `lugar`). Un disco se viste con su propia tapa, en el detalle de cerca (`<disco>-zoom.jpg`); los demás
   con el fondo de su categoría, el mismo que ya viste esa parte del sitio (`LUGAR_POR_CATEGORIA`, antes
   `DETALLE_POR_VARIANTE`); **los tres graves no llevan nada** (`UX-20` §3.4). Es una `.tapa-fondo` como
   cualquier otra: velo plano (`--velo-tapa`), racleta abajo (con `--desgaste` de 7rem, más lenta) y el
   nombre de tránsito `lugar`, así que **pasar de un artículo a otro corre la cámara de una tapa a la
   otra** sin un nombre nuevo (`ADR-03` sigue con tres). En la computadora se abre hasta 52rem
   (`--ancho-lugar`) con los costados gastados por la misma racleta puesta de canto
   (`--textura-rodillo-canto`). Lleva la deriva de `UX-20` §1.4 atada a su salida de la ventana
   (`view()`, tramo `exit`, la misma `deriva-de-capa` de la multitud, al revés), y con movimiento
   reducido se queda quieta. Reemplaza al recorte chico que flotaba junto al título.
   La portada de la Redondopedia usa el mismo lugar con *Gulp!*; dejó de ser un recuadro.
2. **El título en la letra de la banda.** Redonditos de Ricota Fan (`--fuente-luzbelito`), **si entra
   entero** (`sitio/letras.ts`, vigilado por `fuentes.test.ts` contra el `cmap`), en la tinta de su
   categoría o de su disco, con la sal de la almohadilla como el de cada juego. Hoy entran todos menos
   dos, y los dos van en la rotulada con la misma tinta y la misma sal: *Luzbelito*, porque la letra se
   le parece y no es la suya (`diseno-marca.md`), y Los Decoradores, por los paréntesis. Los graves van
   en la rotulada y en `--texto`, como siempre. *Oktubre* sobre su tapa va en `--texto`: su tinta es el
   rojo de marca, que `D-21` saca de encima de una tapa velada.
3. **Lo que hay adentro**, abajo del título y en registro 3: el sello del tipo (con chapa de `--fondo`),
   cuántos hechos, cuántas leyendas (◆), cuántos testimonios (❝) y cuánto se tarda en leerlo. Es la
   promesa de `D-14` en un renglón: el que va a encontrar una leyenda lo sabe antes de leerla.
4. **Los hilos del pie**, en orden de cercanía:
   - **"Seguí por acá"**: el "vea también" deja de ser un renglón de títulos pelados y pasa a tarjetas
     (`TarjetaArticulo.astro`, la misma de la portada) con el gancho —el arranque del resumen, cortado
     en palabra— y lo que hay adentro: si hay leyenda, **quién da testimonio** ("lo contó Rocambole") y
     los minutos. Un disco lleva su tapa chica.
   - **"Pará la oreja"**: el arranque de una leyenda que vive **en otro artículo**, mejor si es uno al
     que este no manda ya, con su rótulo entero y "Seguí en …". Determinista por artículo, como un libro.
     Entran solo las leyendas que **se cuentan** (circula, corre, cuentan, versión, rumor, se repite):
     la nómina de los Fakires es leyenda en su artículo porque no está confirmada, pero no es algo que
     se le cuente a nadie al oído. **Los graves no la llevan y no la prestan.**
   - **"También anda por"**: los artículos que nombran a este (los entrantes del grafo de `BR-09`) que
     no están ni en el "vea también" ni en la oreja. Al Indio lo nombran 32 artículos, y 27 quedan en
     esa línea. Cada enlace mide 48 px de alto tocable.
5. **La portada**, en este orden: el lugar con el título en la letra de la banda y en el rojo de *Gulp!*;
   **"Pará la oreja", una leyenda por noche** según la fecha del teléfono de quien mira
   (`scripts/oreja.ts`, que mueve un `hidden`; sin JavaScript queda la primera); la clave de los rótulos
   en tres renglones, en vez del párrafo de cinco; las dos puertas aparte; **los saltos a cada parte**,
   con cuántos artículos tiene; y el índice: **los diez discos con su tapa y su año**, y el resto con
   la tarjeta nueva. Lo ya leído se apaga (`:visited`).
6. **La lectura**: el cuerpo a 17 px (de 75 caracteres por renglón a entre 60 y 70), la bajada a 18, y
   más aire alrededor de cada párrafo rotulado.

### Lo que no se hizo, a propósito

- **Nada se mueve adentro del cuerpo.** Ni entrada, ni aparición al bajar, ni nada en los rótulos.
- **Ninguna frase nueva sobre la banda.** El gancho, el rumor y las voces salen de lo que el artículo ya
  dice; si `contenido` reescribe un resumen, cambian solos. La única copia nueva es de navegación y de
  rótulo (`REDONDOPEDIA` en `copy.ts`), y la clave dejó de decir "entre fans" (`voz-ricotera.md` §3.8).
- **Sin sombra, sin degradé decorativo, sin vidrio** (`D-64`, anti-slop): la tapa entra por velo plano y
  máscara cruzada con textura, como todas.

### Verificado

`npm test` (1668), `npm run check` (0 errores) y `npm run build` (163 páginas). Pares nuevos en
`contraste.test.ts` (los títulos sobre el lugar a 3:1, lo de adentro a 4,5:1, *Oktubre* en `--texto`),
en `fuentes.test.ts` (la letra de la banda), en `redondopedia.test.ts` (ganchos, voces, años, entrantes,
la oreja y su ronda diaria) y la isla nueva en el censo de `estilos.test.ts`. Mirado en el navegador a
375 px y a 1366 px: portada, un disco, una leyenda, un tema, la persona más nombrada, los dos títulos
que no entran en la letra y un artículo grave.

### Pendiente

- ~~`T-450`~~ **hecha el 2026-10-17**: la Redondopedia está en el lienzo como **hoja 17, "La
  Redondopedia de noche"** (versión 20, página Aplicación, debajo de la 11). Trae tres teléfonos a
  escala (un disco, una leyenda y un grave), el pie con los tres hilos, las medidas y un así no / así
  sí. La letra de la banda, las dos texturas y las tapas van embebidas, sacadas de `tokens.css` y de
  `public/` en el momento de pegarla. Las medidas llegaron a `tokens.css` primero, como con la mesa
  (`T-319`).
- ~~`T-451`~~ **hecha el 2026-10-17**: `experiencia` escribió `UX-39` y enmendó las dos filas de la
  Redondopedia en `UX-20` §2 (la de los graves y §3 no cambian). De sus huecos (§11), el hilo
  principal cerró el mismo día A1 (las tarjetas de los graves van en la rotulada), A2 (el toque de
  "También anda por"), A7 (12 px para la clave y los saltos) y la excepción de `:visited`, escrita en
  `diseno-marca.md`. Quedan A4 (En vivo podría tomar el lugar), A6 (los ganchos alrededor de los
  graves, de `contenido`) y los criterios M1 a M7 de su §10.
- `T-452`: que `contenido` lea los ganchos y la ronda de la oreja, y los "cuentan los fans" y "los fans
  se pasaron" que quedan en la prosa del Indio y de la leyenda de *Ji Ji Ji* (`voz-ricotera.md` §3.8:
  la gente). Ahora la oreja los muestra fuera de su artículo.
- `T-453`: probarlo en un iPhone. La deriva con `view()` y la máscara de los costados son lo más nuevo.

La propuesta para los tres roles está en `Docs/SUGERENCIAS/HILO-para-experiencia-y-contenido-d75-la-redondopedia-de-noche.md`.

## D-76 — Al bestiario se entra caminando, el camino es la pantalla entera, y suena

- **Fecha:** 2026-10-18
- **Estado:** activa. Pedido directo del usuario, textual: *"El entorno caminable debe ser lo
  principal del bestiario, es decir arrancar ahi y que para salir debas tocar algo, no puedas salirte
  scrolleando sin querer, al final de las escenas que no siga para abajo. Ademas que en cada personaje
  suene la parte del tema que habla de el si tiene, ahora no tenemos eso, hagamos que se escuchen
  recortes como lejos de el album donde esta inspirado o que mas personajes tenga ese entorno."* Y
  a mitad de camino: *"y que se escuchen otras cosas, pasos, sonidos de los personajes, ruidos del
  entorno, que sea todo bien inmersivo"*. La escribe el hilo principal en la rama
  `bestiario/entorno-primero`, sobre `main` en `46d36d1` (con el PR #57 adentro).
- **Es una decisión aparte y no una enmienda de `D-73`** porque cambia la puerta y suma un sentido
  (el oído). Además, las enmiendas de `D-73` las estaban esperando cuatro ramas a la vez. Antes de
  tomar el número se miraron `origin/main`, las ramas remotas y los worktrees: nadie usa `D-76`.
- **Enmienda** la frase de `D-73` que decía que al bestiario se entra por el plano. **No toca** los
  recintos, el plano, las fichas ni la regla de `enEspera`.

### Lo que cambia

1. **La puerta.** El casete B3 de la home y la tarjeta de la Redondopedia llevan a `ENTRADA`
   (`lib/bestiario/camino.ts`), que es el primer tramo: el monte. El plano con los recintos sigue en
   `/redondopedia/bestiario/` y se llega desde el camino con "Al plano".
2. **La pantalla entera.** Con la isla andando, `html.camino-pantalla`:
   - el camino es la página: la cabecera y el tablero (el cartel, la instrucción, la libreta y los
     botones) flotan encima de la escena;
   - no hay pie ni lista abajo, así que el documento termina en el cruce;
   - `overscroll-behavior` saca el rebote y el "tirá para recargar";
   - se sale tocando "Al plano" o un cartel del cruce;
   - la lista de fichas se abre con "Mirá la lista" y se cierra con la cruz o con Escape;
   - en el cruce, el tablero se achica al nombre de la región.

   **Sin JavaScript o con movimiento reducido no cambia nada**: todo queda en el flujo, la lista
   abajo y el pie al final (molinetes abiertos).
3. **El recital de lejos** (`scripts/bestiario/lejos.ts`). Suenan los recortes del disco de la región
   si tiene al menos tres. Si no, los del disco del que salen más bichos del camino (`fondoDe`, en
   `lib/bestiario/sonido.ts`). El monte suena a *Lobo suelto* y la pastura a *Cordero atado*. El
   recorte pasa por un pasabajos, un pasaaltos y un eco corto, todo bajito; a medida que se camina el
   filtro se abre un poco. Cuando suenan los diez segundos de una ficha, el recital se aparta. Un
   renglón dice qué disco suena: es registro 3, y dice la verdad sobre lo que se oye.
4. **Los ruidos del camino** (`scripts/bestiario/entorno.ts`), sintetizados, sin un solo archivo:
   - pasos atados a lo caminado (hojas o pasto), con tope de velocidad;
   - viento, grillos, la lechuza del monte y el cencerro de la pastura, que suena también al tocar a
     la vaca.

   Las recetas por región son números en `RECETAS`, y el test mira que no pidan un sonido que no se
   sabe hacer.
5. **Nada suena sin un toque** (como en `D-66`). Un botón prende el recital y los ruidos juntos, y
   pide la sesión de la música (`sonarAunqueEsteEnSilencio`). Si quedó prendido, la próxima región lo
   recuerda, pero espera el primer toque.

### Lo que queda afuera, y por qué

- **La parte del tema que nombra a cada personaje** (`T-481`). Los recortes del sitio son los
  primeros 15 segundos de cada tema, los temas enteros no están en el repo y no hay minuto de cada
  verso. Hacer sonar el arranque del tema con el verso escrito en el bocadillo sería un rótulo que
  miente. Queda pedido en `Docs/SUGERENCIAS/HILO-sonidos-del-bestiario.md`.
- **Las voces y los animales.** La risa del gordo Pierre la graba el usuario; los perros, los gatos,
  los balidos y los cristales salen de Freesound CC0. El reparto completo, región por región, está en
  la misma sugerencia (`T-482`).
- **Las otras diez regiones** suenan cuando tengan su camino: la receta es un renglón por región.

### Verificado

`npm test` (1691), `npm run check` (0 errores) y `npm run build`. En el navegador del panel, a
375×812:

- el monte arranca con la escena entera y el documento termina en el cruce;
- la lista abre y cierra;
- el botón de sonido baja los recortes de *Lobo suelto*, y la pastura anuncia *Cordero atado*.

**Falta:** oírlo en un teléfono de verdad (`T-483`): el filtro, el volumen relativo, los pasos al
scrollear rápido y la llave de silencio del iPhone.
