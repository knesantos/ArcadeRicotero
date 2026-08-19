# BRIEF — RicotaArcade

> Fuente de verdad del objetivo. Todos los agentes leen esto antes de trabajar.
> Se actualiza con `/kickoff` y cada vez que el objetivo cambie de forma.
> Última actualización: 2026-08-19 (post-`/kickoff`)

## Objetivo

Un sitio web de juegos sobre Patricio Rey y sus Redonditos de Ricota, con contenido
investigado en serio, que un fan juega desde el celular en ratos sueltos.

## Para quién

Fans de los Redondos con conocimiento muy variable: desde el que escuchó "Ji Ji Ji" en una
previa hasta el que sabe qué se tocó en Huracán en el 93. El sitio tiene que **premiar al
que sabe sin expulsar al que recién llega**: dificultad escalonada, nunca un muro en la
primera pantalla.

> **Corregido el 2026-08-19 por `RES-05`.** Esta frase decía "Huracán en el 89" desde la
> instanciación. **En 1989 no hubo Huracán:** los recitales en el Ducó fueron en noviembre
> de 1993 y diciembre de 1994; lo del 89 fue el debut en Obras, el 2 de diciembre. Se
> corrige y se deja anotado a propósito, porque el error estaba en el archivo que define
> quién es el público, y porque "ningún dato falso" es criterio no negociable (`D-09`): si
> el brief se permite un dato de color sin verificar, el banco de preguntas también.

**El momento de uso:** celular, en ratos sueltos, sesiones de dos o tres minutos. Se entra,
se juega una partida, se comparte el resultado y se cierra.

No hay un único momento. El usuario piensa mostrarlo **por Twitter y a amigos**, así que
conviven tres entradas y las tres tienen que funcionar.

| Entrada | Qué implica para el diseño |
|---|---|
| Llega por un link de Twitter | El primer contacto es un desconocido sin contexto. La primera pantalla decide si se queda. |
| Se lo pasa un amigo con su resultado | El resultado compartido **es** la puerta de entrada, no el final de la partida. Tiene que dar ganas de superarlo. |
| Lo abre solo, en un rato muerto | Puede estar sin auriculares. El juego de audio tiene que avisarlo o degradarse con dignidad. |

## "Listo" de la v1

Cuatro juegos confirmados, todos jugables de punta a punta en un celular:

1. **Quiz de preguntas** por dificultad: historia, discos, letras y mitología ricotera.
2. **Adivinar el tema** con reveal progresivo de audio: arranca en 0,1 seg y se va
   estirando a pedido del jugador. Menos audio escuchado, más puntaje.
3. **Completar la letra.** Confirmado en `/kickoff`. La dificultad escala **mostrando
   menos letra**, no cambiando de tema: fácil da contexto, difícil da un verso pelado.
4. **Adivinar la tapa o el disco.** Confirmado en `/kickoff`. Es el **primero que se cae**
   si hay que recortar alcance (ver "Orden de corte").

Transversal a los cuatro: al revelar la respuesta el jugador tiene acceso directo para
**escuchar el tema en Spotify** —la v1 no garantiza que suene completo sin salir del
sitio—, y cada juego llega a revisión con un **piso de ítems** que fija `producto`. Un
juego con el motor terminado y doce preguntas adentro no cuenta como listo.

> **Corregido el 2026-08-19 por `BR-06`** (`Docs/PRODUCTO/PRD-promesa-spotify.md`). Esta
> frase prometía "escuchar el tema **completo** vía Spotify". `RES-01` mostró que para un
> jugador sin Premium eso probablemente no se cumple dentro del sitio: el `preview_url`
> quedó restringido para apps nuevas y el Web Playback SDK exige cuenta paga. `producto`
> eligió prometer **acceso** y no **reproducción**, de forma que ningún desenlace de
> `E-04` ni de `E-07` obligue a reescribir la promesa ni a recortar el alcance.

Si esto existe y funciona, la v1 está lista. Nada más es requisito.

## Orden de corte

Si hay que recortar, se recorta en este orden. Lo decidió el usuario en `/kickoff`.

1. **Adivinar la tapa** — sale primero. Máxima exposición a derechos (obra de Rocambole,
   artista vivo) y el que menos depende del resto del sistema.
2. Los otros tres se defienden. Antes de sacar un segundo juego se recorta el piso de
   ítems de los tres que quedan.

## Criterios no negociables

Los eligió el usuario en `/kickoff`. Si uno se rompe, bloquea todo lo demás. `revisor`
verifica contra estos tres antes que contra cualquier otro criterio.

1. **Ningún dato falso — reencuadrado por `D-14`.** No significa "todo lleva URL y fecha":
   significa que **el rótulo diga la verdad sobre lo que hay adentro**. Una historia que
   circula entre fans entra **rotulada como leyenda** y es contenido de primera, sin
   ninguna fuente. Lo que no entra es una leyenda vestida de hecho. Y donde esto se aplica
   con rigor es en **la respuesta correcta de una pregunta**: si está mal, el juego le marca
   error al que se sabe el tema.
2. **Jugable con el pulgar.** Una mano, parado, en movimiento. Nada de precisión fina.
3. **Sin muro de entrada.** El que recién llega juega su primera partida sin sentirse
   expulsado. **Es "abrir los molinetes"** (`D-14`): también cubre no pedirle cuenta, login
   ni Premium. No es una regla de UX, es la identidad del sitio.

**Lo que quedó deliberadamente afuera:** la velocidad de carga **no** es criterio
bloqueante. El usuario la descartó como no negociable. Sigue siendo deseable y sigue
siendo el riesgo 6, pero no frena una entrega.

## Fuera de alcance

- Cuentas de usuario y ranking global.
- Backend y base de datos. El sitio es estático; el contenido vive en JSON versionado.
- Multijugador en tiempo real.
- Alojar los temas completos. Solo fragmentos cortos y reproducción vía Spotify.

Lo que está acá no se discute durante la v1. Si aparece la tentación, va al backlog de
la v2, no al ciclo actual.

## Restricciones

| Tipo | Restricción |
|---|---|
| Tiempo | Dedicación irregular, en ráfagas **muy variables**: a veces veinte minutos, a veces un domingo entero. Las tareas `T-XX` tienen que poder **cortarse en cualquier punto** sin dejar el repo a medio hacer. No hay fecha de entrega. |
| Presupuesto | Cero costo recurrente. Hosting estático gratuito, sin servicios pagos. |
| Técnicas | Astro + TypeScript con arquitectura de islas: HTML estático por defecto, JavaScript solo dentro de los juegos. Móvil primero. Contenido en JSON versionado, validado contra schema. Sin backend. |
| Spotify | **El jugador no tiene Premium.** El usuario sí, y puede probar, pero `ADR-01` no puede apoyarse en que el jugador la tenga. Esto saca al Web Playback SDK de las vías principales. |
| Terceros | Fragmentos de audio, tapas de los discos (obra de Rocambole) y letras. Nada se publica antes de la investigación de derechos (ver el gate más abajo). |

## La postura: molinetes abiertos

**Esta sección manda sobre cualquier otra cosa que diga este documento.** La fijó el usuario
en `D-14`, con toda la evidencia legal ya sobre la mesa, y reencuadra el proyecto entero.

Es un **fan site sin fines de lucro, de poco volumen, hecho para divertirse**. No hay plata
en juego ni nadie a quien rendirle cuentas.

- **El riesgo se asume. Si llega un reclamo, se da de baja y listo.** Nada espera permiso.
  El gate de publicación que existió entre `/kickoff` y el ciclo 2 **ya no existe**.
- **El conocimiento popular es contenido legítimo.** Esta banda se transmitió por relato:
  lo que contó alguien que estuvo, lo que se dice en la previa. **No hay mucho oficial y no
  debería importarnos** — y no es una excusa, es un hallazgo: `RES-23` verificó que no
  existe fuente autorizada de letras y nunca existió, y `RES-21` que el propio memoir del
  Indio se declara "apenas mi versión". **Exigir fuente oficial es exigir algo que la banda
  deliberadamente nunca produjo.**
- **Abrir los molinetes.** En los recitales, los de adentro abrían los molinetes para que
  pasara el que no había podido pagar. Ese es el principio rector: **nada acá se le niega a
  nadie por no tener con qué entrar.** Sin cuenta, sin login, sin Premium, sin saber lo
  suficiente. Tres decisiones que ya estaban tomadas por separado —`D-08`, `D-09` y el "sin
  cuentas de usuario" del alcance— resultaron ser la misma, y ahora tienen nombre.

**Lo único que sigue siendo estricto**, y no por lo legal: que la **respuesta correcta de
una pregunta sea correcta**. Si el dato está mal, el juego le marca error justo al que se
sabe el tema, y eso rompe lo único que el sitio promete. La defensa no es verificar más:
es **rotular bien**. Hecho, leyenda o testimonio — las tres casillas que el schema ya hace
cumplir. Una leyenda rotulada es contenido de primera; una leyenda disfrazada de hecho hace
quedar mal al jugador.

`CNT-01`, la nota de derechos, **sigue existiendo pero cambió de función**: ya no es un
cerrojo, es un mapa de qué se usa y de dónde salió, para poder responder rápido y bien si
alguien pregunta.

## Decisiones ya tomadas

Insumo, no discusión. Las de instanciación más las de `/kickoff`. Detalle completo con
alternativas descartadas en `Docs/DECISIONES.md`.

- **Motor de audio híbrido** (`D-03`). Fragmentos cortos precargados con Web Audio API
  para el reveal de 0,1 seg; Spotify para el tema completo al revelar. La vía exacta es
  `ADR-01`, condicionada ahora por que el jugador no tiene Premium.
- **Estética mixta** (`D-04`). Arte original en lenguaje rocambolesco; las tapas reales
  solo en el juego que las necesita, en baja resolución y con crédito.
- **Stack: Astro + TypeScript** (`D-02`).
- **Juegos 3 y 4 confirmados y orden de corte** (`D-05`).
- **Los fragmentos de audio se producen bajando los temas de YouTube y recortándolos**
  (`D-06`). Decisión del usuario, tomada con el reparo sobre términos de servicio y
  derechos ya planteado y asumido. Es un **riesgo abierto**, no un tema cerrado.
- **El gate de derechos separa construir de publicar** (`D-07`).
- **No se asume Spotify Premium en el jugador** (`D-08`).
- **Tres criterios no negociables** (`D-09`).
- **Hay difusión en la v1: Twitter y amigos** (`D-10`).

## Idioma y tono

Español rioplatense, **fan a fan, con jerga**. Como habla un ricotero: guiños internos,
humor, nada de manual ni de enciclopedia.

Con una tensión que `contenido` y `experiencia` tienen que sostener a la vez: el tono es
de club, pero el criterio "sin muro de entrada" dice que el recién llegado no puede quedar
afuera. La jerga va en el **tono**, no en la **barrera**: se puede escribir con guiño
interno una pregunta que igual se entiende sin agarrar el guiño.

## Supuestos confirmados en `/kickoff`

- Español rioplatense con vocabulario de la banda, tono fan a fan. **Confirmado.**
- Juegos 3 y 4: completar la letra y adivinar la tapa. **Confirmado.**
- No hay fecha de entrega. **Confirmado.**
- Fan site sin fines de lucro, sin publicidad, sin venta. **Confirmado.**
- Puntajes y rachas en `localStorage`, sin sincronización entre dispositivos.
  **Confirmado por omisión** — no se cuestionó y sigue siendo coherente con "sin backend".

## Supuestos corregidos en `/kickoff`

| Decía el brief | Dice ahora |
|---|---|
| "Los fragmentos los provee el usuario desde material propio. El proyecto no descarga ni extrae audio de ningún servicio." | El usuario **no tiene material propio**. Los fragmentos se producen bajando los temas de YouTube y recortándolos (`D-06`). |
| "No hay analítica ni difusión activa en la v1." | **Sí hay difusión**: Twitter y amigos (`D-10`). La analítica sigue afuera. |
| "Nada se publica antes de que exista la nota de derechos" (gate único) | El gate separa construir de publicar (`D-07`). |

## PENDIENTE

Lo que sigue sin respuesta después de `/kickoff`. Un pendiente no es un supuesto: tiene
dueño y tarea.

- **PENDIENTE — Formato, duración y presupuesto de precarga de los fragmentos.** Dueño:
  `arquitectura`. Ahora es más urgente: el audio no existe todavía, así que la spec llega
  **antes** que el material, no después.
- **PENDIENTE — `ADR-01`, vía de Spotify sin Premium del jugador.** Dueño: `arquitectura`,
  con evidencia fechada de `investigador`.
- **PENDIENTE — Piso de ítems por juego.** Dueño: `producto`.
- **PENDIENTE — Cuánta letra se muestra en cada nivel de dificultad.** Dueño: `producto`
  fija la regla `BR-XX`, `contenido` la aplica.
- **PENDIENTE — Qué formato tiene el resultado compartible.** Dueño: `experiencia`. Es
  puerta de entrada, no adorno (`D-10`).
- **PENDIENTE — Investigación de derechos previa a publicar.** Dueño: el usuario, apoyado
  en la nota de `contenido` y en fichas `RES-XX`.

## Riesgos conocidos

Repasados uno por uno en `/kickoff`. El orden cambió.

1. **Que se corte la racha.** *Ascendió al puesto uno: es el fracaso que el usuario
   considera más probable.* Con ráfagas de tamaño impredecible, el riesgo es que una tarea
   quede a medio hacer y la sesión siguiente arranque releyendo el repo. Mitigación:
   `ESTADO.md` al día y tareas `T-XX` que cierren enteras en veinte minutos o se corten
   limpio. Dueño: `orquestador`.
2. **Derechos. Bajó de riesgo a contingencia** (`D-14`). Ya no bloquea nada: si llega un
   reclamo, se baja el sitio. Cuatro fichas (`RES-03`, `RES-11`, `RES-13`, `RES-14`)
   buscaron cobertura legal y las cuatro terminaron en "zona gris, ninguna fuente lo dice",
   así que esperar era un bloqueo permanente disfrazado de trámite. `CNT-01` sigue como
   **mapa** de qué se usa, no como cerrojo.
3. **Mitología repetida como hecho.** Sigue vigente, y es el riesgo que **más subió** en
   importancia relativa ahora que los otros bajaron. Pero cambió de forma: ya **no** se pide
   verificar todo —`D-14` retiró esa exigencia y `RES-23` mostró que la fuente oficial no
   existe— sino **rotular bien**. El peligro no es usar una leyenda: es no decir que lo es.
   Dueño: `contenido`, con el schema haciendo cumplir las tres casillas.
4. **El banco de contenido corto.** Sigue vigente sin cambios. Cuatro juegos hermosos con
   doce preguntas adentro. El contenido va adelante del motor. Dueño: `contenido`.
5. **Spotify.** Sigue vigente y **se acotó**: al no poder asumir Premium en el jugador
   (`D-08`), el Web Playback SDK sale de las opciones principales y quedan embed y deep
   link. Falta verificar con evidencia fechada. Dueños: `investigador`, `arquitectura`.
6. **Latencia en celular de gama baja.** Sigue vigente pero **bajó de prioridad**: el
   usuario descartó la velocidad de carga como criterio bloqueante. Se mide, no se
   convierte en gate. Verificación manual del usuario.

## Insumos

| Insumo | ¿Ya lo tenemos? | Quién lo consigue |
|---|---|---|
| Discografía verificada: años, sellos, tracklists | No | `investigador` — fichas `RES-XX` con URL y fecha. **Verificar todo**: no hay fuente de partida confiada |
| Cronología de la banda y de los recitales grandes | No | `investigador` |
| Letras de los temas | No | `investigador` localiza la fuente; `contenido` fija cuánto se cita por nivel |
| Fragmentos de audio de los temas | **No, y no hay material de origen** | Usuario: baja de YouTube y recorta (`D-06`). `arquitectura` fija formato, duración y presupuesto de precarga **antes** de que se produzcan |
| Tapas en baja resolución | No | `investigador` las ficha; `contenido` fija el criterio de uso |
| Referencias visuales de Rocambole | No | `investigador`. El usuario pide **iconografía suelta**, no una tapa específica: personajes y símbolos recurrentes, menos citable y más libre |
| Arte original en lenguaje rocambolesco | No | `experiencia` entrega los briefs; el usuario decide cómo se produce |
| Cuenta de desarrollador de Spotify | No | Usuario, si `ADR-01` elige una vía que la requiera |
| Hosting estático gratuito | No | Usuario |
