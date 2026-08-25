# PRD — Correcciones: qué es y qué promete el sitio

> Consume: `Docs/BRIEF.md` (criterio no negociable "ningún dato falso"; postura "molinetes
> abiertos"), `Docs/DECISIONES.md` `D-14` (el riesgo se asume, nada se le niega a nadie por
> no tener con qué entrar) y `D-25` (`US-03` sale con letra de fuente única; el usuario
> valida jugando — pendiente de redactar por el hilo principal en `T-128`, esta regla asume
> que existe), `Docs/ORQ/ORQ-plan-ciclo-9.md` ("El frente D: el botón de corrección" — el
> pedido del usuario en sus dos versiones, y el cambio de transporte de issue de GitHub a
> mail/portapapeles).
>
> **`T-149` del ciclo 9.** El transporte (mail o portapapeles) y el payload con transporte
> intercambiable son de `arquitectura` (`CTR-10`, `T-150`) — no se re-deciden acá. Esta
> regla fija la política: qué es una corrección, qué promete el sitio al recibirla, qué se
> le pide a la persona, dónde entra y qué le hace a un ítem que se está jugando.

## Por qué esto no es un botón de adorno

`US-03` va a salir con letras transcriptas de **una sola fuente**, sin la confirmación de
oído que `CTR-04` pedía originalmente. El usuario aceptó ese riesgo con una condición
concreta: *"si hay que cambiar algo lo veo jugando el juego"* (`D-25`). Esa frase, para ser
un mecanismo y no solo una intención, necesita una vía por la que "lo veo" se convierta en
"lo puedo avisar" — y no solo para el usuario, sino para **cualquiera que esté jugando**.
Eso es lo que este botón resuelve, y por eso no es exclusivo de `US-03`: el mismo problema
—un dato que puede estar mal y nadie más que quien lo escribió tiene forma de marcarlo—
existe en los cuatro juegos y en la Redondopedia.

---

## BR-21 — Qué es una corrección y qué promete el sitio

**Aplica a:** todo ítem de contenido del sitio que afirme algo verificable — preguntas del
quiz (`US-01`), letras (`US-03`, `US-07`), temas y tapas (`US-02`, `US-04`), y artículos de
la Redondopedia (`US-05`). No aplica a `US-06` (ver apartado 4).

### 1. Qué es una corrección

Una corrección es cualquier mensaje de la gente que señala algo puntual sobre un ítem
concreto. No es un formulario de opinión general ni un canal de contacto abierto: siempre
va atado al ítem que se estaba jugando o leyendo en el momento de tocar el botón (eso lo
resuelve `CTR-10`, no esta regla). Entran tres categorías, y las tres usan el mismo
mecanismo — no hay un botón para "error" y otro para "aporte":

1. **Dato equivocado.** Un verso mal transcripto, una fecha, un disco, una respuesta de
   quiz que no es la que dice el sitio. Es el caso que motivó el pedido (`D-25`).
2. **Algo que falta.** El sitio no dice algo que la persona sabe — un dato, un matiz, una
   fuente que existe y el ítem no cita. Es la mitad del pedido original del usuario que la
   primera versión ("lo tomamos como error") no nombraba del todo: *"es más como para
   construir conocimiento entre todos"*. Cabe acá y no se descarta.
3. **Rótulo mal puesto.** Algo que el sitio marca `hecho` y la persona sabe que es
   `leyenda` (o al revés), o un `testimonio` sin quien lo contó. Es el caso que más le
   importa a este proyecto en particular: `D-14` construyó las tres casillas para separar
   el dato del relato, y una casilla mal marcada es el mismo daño que un dato falso.

No hace falta que la persona sepa en cuál de las tres cae lo que quiere decir. La distinción
es para que `contenido` sepa qué hacer al leerla, no una clasificación que se le exija a
quien corrige — pedirle a la gente que categorice su propio aviso es fricción que ningún
molinete necesita.

### 2. Qué promete el sitio — el punto que resuelve el riesgo del silencio

**El riesgo, tal como lo dejó planteado el ciclo 9:** mail y portapapeles llegan, pero no
hay forma de que el sitio muestre si alguien contestó, si se leyó, o si se corrigió algo.
Prometer una conversación sobre un canal que nadie puede ver desde afuera es exactamente lo
que `D-14` prohíbe: un rótulo que no dice la verdad sobre lo que hay adentro.

**Se descarta prometer que "se lee"**, aunque sea sin plazo. No es que sea mentira — es
razonable esperar que un mail a la casilla del proyecto se lea en algún momento — pero es
una promesa que **nadie puede verificar de manera mecánica**: no hay confirmación de
lectura, no hay bandeja pública, y una promesa que no se puede chequear es la misma clase de
problema que un dato sin fuente. `D-12` es taxativo con esto en otro contexto: lo que no se
puede correr y comprobar, no se declara cumplido.

**Se descarta también no prometer nada y limitarse a "mostrar el estado del corpus"** como
reemplazo del botón. Esa idea es buena pero ya existe por otro lado: `T-145` va a mostrar,
en cada ítem de `US-03`, qué sitio lo transcribió y con qué enlace — esa es la transparencia
que informa sin comprometer a nadie, y ya está resuelta. No hace falta que el botón la
repita; el botón hace un trabajo distinto, que es dejar que alguien **avise** algo puntual,
no solo desconfiar por su cuenta.

**Lo que el sitio promete, entonces, es lo mínimo que puede verificar con un comando:**

> El botón arma el mensaje completo —qué juego, qué ítem, qué dice el sitio, qué debería
> decir según la persona— y lo entrega: por mail, sale dirigido a la casilla del proyecto
> con el texto ya puesto; por portapapeles, queda copiado entero para que la persona lo
> pegue donde quiera. Eso es lo único que el sitio garantiza, y es exactamente lo que
> `CTR-10` (`T-150`) verifica: *"un caso real viaja entero por mail y por portapapeles"*.

**Lo que el sitio explícitamente NO promete**, y ningún texto visible (`CNT-12`) puede
insinuar lo contrario:
- Que alguien la lea en un plazo determinado, ni sin plazo.
- Que haya una respuesta.
- Que el ítem se corrija, se marque o se saque mientras tanto (ver apartado 5).
- Que la corrección quede registrada en ningún lado visible para quien la mandó o para
  otros jugadores.

Cualquier confirmación que se muestre después de tocar el botón (dueño `UX-09`) puede
confirmar únicamente el hecho mecánico —"se armó", "se copió", "se abrió el mail"— nunca un
estado de revisión que el sitio no tiene cómo sostener.

**Por qué esto no es prometer poco por prometer poco.** Es la aplicación directa de la
regla de veracidad del proyecto (`D-14`) a un lugar nuevo: hasta ahora esa regla regía la
respuesta correcta de una pregunta; acá rige la promesa sobre qué pasa después de tocar un
botón. El mecanismo es el mismo — decir la verdad sobre lo que hay adentro — aplicado a una
interacción en vez de a un dato.

### 3. Qué se le pide a la persona

**Nada, salvo el texto de la corrección.** Sin cuenta, sin login, sin mail obligatorio, sin
nombre. Es la misma regla que rige todo lo demás en el sitio (`D-14`, molinetes abiertos) y
no hay motivo para que este botón sea la excepción — pedirle un mail "para poder
contestarle" es exactamente el tipo de condición que el proyecto decidió no poner nunca,
más aún cuando el punto 2 de esta regla ya deja claro que no hay compromiso de contestar.

Puede existir un campo **para dejar un contacto, si la persona quiere una respuesta** — pero
es optativo en el sentido estricto: el botón envía igual si queda vacío, y ningún estado de
la interfaz lo marca como incompleto por no llenarlo. El campo en sí, su formato y si existe
o no, lo define `arquitectura` en `CTR-10`; lo que fija esta regla es que **nunca puede ser
obligatorio**.

### 4. Dónde aparece el botón — alcance ahora, orden después

**Ahora, confirmado:** los tres juegos que ya lo integran por `T-154` — `US-01` (quiz),
`US-03` (completar la letra) y `US-07` (adivinar el tema por la letra). Coincide con el
frente que motivó el pedido (`US-03`) y con el juego que sale del mismo corpus (`US-07`); el
quiz entra porque el mismo riesgo de dato equivocado existe ahí desde el día uno de `D-09`.

**Después, en este orden:**

1. **`US-05`, la Redondopedia.** Es donde más rinde: prosa larga, rotulado de tres casillas
   por párrafo (`hecho`/`leyenda`/`testimonio`, `D-14`), y el lugar donde "construir
   conocimiento entre todos" —la frase original del pedido— tiene sentido más literal que en
   un juego de dos minutos. Va primero por valor, no por urgencia.
2. **`US-02` (adivinar el tema) y `US-04` (adivinar la tapa).** Mismo mecanismo que los tres
   de ahora, pero sin la urgencia de `D-25`: no cargan una decisión de fuente única sin
   confirmar, y `US-02` sigue en 0 de su piso — no hay nada que jugar todavía sobre lo que
   corregir.
3. **`US-06` (qué tipo de ricotero sos): no entra, y puede no entrar nunca.** `BR-17` es
   explícito — ninguna pregunta tiene respuesta correcta ni incorrecta, no mide
   conocimiento, no hay dato que verificar. No hay qué corregir en el sentido de esta regla.
   Si algún día se agrega un botón ahí, sería por otro motivo (una pregunta mal escrita o de
   mal gusto) y correspondería a un canal de contacto general, no a este mecanismo de
   corrección de contenido.

### 5. Qué pasa con un ítem corregido mientras se lo está jugando

**No pasa nada automático, y no puede pasar nada automático.** El transporte es mail o
portapapeles: el mensaje sale del sitio y no vuelve a entrar a ningún lado que el sitio lea.
No hay backend (`D-02`), no hay cola de revisión, no hay bandera "en revisión" en el JSON —
crear eso sería agregar la infraestructura que este frente decidió no construir (`ORQ-plan-
ciclo-9.md`, frente D). Así que, en concreto:

- **El ítem no se saca del juego.** No hay ningún proceso que lo pueda sacar sin que alguien
  edite el JSON a mano.
- **El ítem no se marca visualmente como "en duda".** No existe ese estado en el schema ni
  esta regla lo crea — inventar un cuarto rótulo a mitad de camino entre las tres casillas
  de `D-14` es exactamente el tipo de decisión de contrato que le toca a `arquitectura`, no
  a este documento, y no hay pedido de nadie para abrirla ahora.
- **El ítem se deja como está**, hasta que alguien del equipo lea la corrección, la verifique
  y —si corresponde— la aplique editando el contenido en una ráfaga posterior. Es el mismo
  camino que ya existe para cualquier fix de contenido: no hay un camino especial para
  "corrección recibida por el botón" versus "error que alguien notó de otra forma".

**Por qué esto no reabre lo único que `CLAUDE.md` declara estricto.** La objeción obvia es:
si el ítem sigue jugándose sin cambios, el juego le sigue marcando error al que se sabe el
tema, que es justo el daño que el proyecto no tolera. Pero ese riesgo no lo crea el botón:
ya existía, y `D-25` lo aceptó explícitamente para `US-03` con la mitigación que sí depende
del proyecto (`T-138`, elegir los versos de menor riesgo) y con la fuente a la vista del
jugador (`T-145`). El botón no agrava ese riesgo — agrega una vía más para que alguien lo
detecte y lo reporte, además de la propia desconfianza del jugador. Lo que el botón **no
puede hacer**, porque no tiene con qué, es cerrar ese riesgo en el momento. Eso está bien
mientras el sitio no diga lo contrario, que es exactamente lo que el apartado 2 de esta
regla deja escrito.

**Consecuencia práctica para `contenido`, fuera de esta regla:** cuando una corrección
llegue y se confirme, corregirla en `US-03` no es opcional ni de baja prioridad — es la
única categoría de ítem del sitio donde un dato mal marcado rompe el criterio no negociable
de `Docs/BRIEF.md`. Priorizarla en la próxima ráfaga que toque ese banco es trabajo de
`contenido`, no algo que esta regla pueda exigir en tiempo real.

### 6. Criterio de aceptación

Verificable sin ambigüedad, comparando contra lo efectivamente construido en `CTR-10`
(`T-150`), `CNT-12` (`T-151`) y el componente (`T-153`/`T-154`):

1. El botón cubre las tres categorías del apartado 1 sin pedirle a la persona que elija una.
2. Ningún texto visible del botón, del panel o de la confirmación posterior promete lectura
   en plazo, respuesta, ni corrección del ítem — se puede releer `CNT-12` entero contra la
   lista negativa del apartado 2 y no encontrar ninguna de las cuatro frases prohibidas.
3. El formulario/panel no exige ningún campo de identidad para poder enviarse; si existe un
   campo de contacto, el envío funciona igual con el campo vacío.
4. El botón aparece en `US-01`, `US-03` y `US-07` en esta ráfaga, y no aparece en `US-06`.
5. Un caso de prueba real (un ítem con un dato inventado a propósito) genera, por las dos
   vías de transporte, un mensaje completo con juego, ítem, lo que dice el sitio y lo que
   debería decir — el mismo criterio que ya usa `CTR-10`, así que esta regla no agrega una
   segunda verificación en paralelo, la comparte.

## Fuera de esta regla

- El payload exacto, sus campos y el tope de largo: `CTR-10` (`arquitectura`).
- El texto exacto del botón, el panel y la confirmación: `CNT-12` (`contenido`), en
  registro 3 (`.claude/rules/voz-ricotera.md`).
- Dónde vive el botón dentro de cada pantalla, tamaño de toque y que no compita visualmente
  con `SEGUÍ`: `UX-09` (`experiencia`).
- Cómo se procesa una corrección una vez leída (editar el JSON, quién lo hace, con qué
  cadencia): trabajo de `contenido` en la ráfaga que corresponda, no una regla nueva.
- La extensión a Supabase para que una corrección sí pueda mostrar su propio estado
  (leída/aplicada): queda guardada como `IDEA-13` en `PRD-backlog-ideas.md` (`T-155`). El
  día que eso exista, el apartado 2 de esta regla hay que releerlo — una promesa que hoy es
  mecánicamente imposible de verificar puede dejar de serlo, y ahí sí subiría lo que el
  sitio promete. Hasta entonces, esta regla es la que manda.
