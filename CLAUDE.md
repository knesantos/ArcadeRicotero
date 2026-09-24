# CLAUDE.md — RicotaArcade

> Contexto persistente. Se lee al inicio de cada sesión.
> El objetivo completo está en `Docs/BRIEF.md`. El estado de hoy, en `ESTADO.md`.

## 1. Qué es

Un sitio de juegos sobre Patricio Rey y sus Redonditos de Ricota, con contenido
investigado en serio, para jugar desde el celular en ratos sueltos.

**Para:** fans con conocimiento muy variable, desde el que escuchó "Ji Ji Ji" en una
previa hasta el que sabe qué se tocó en Huracán en el 93. Dificultad escalonada, nunca un
muro en la primera pantalla.
**"Listo" de la v1:** cuatro juegos jugables de punta a punta en un celular, confirmados
en `/kickoff` por `D-05` — quiz, adivinar el tema con reveal progresivo, completar la
letra, y adivinar la tapa —, cada uno con su piso de ítems cumplido y con el tema completo
escuchable al revelar. **Los pisos que mandan están en `PRD-alcance-v1.md`**, no acá: un
número copiado en este archivo ya quedó viejo una vez.
**Fuera de alcance:** cuentas de usuario, ranking global, backend y multijugador en
tiempo real.

## 2. Cómo se trabaja acá

1. Sesión nueva → `/estado`. Te dice dónde quedó todo y cuál es el próximo paso. Es
   central acá porque el trabajo avanza **en ráfagas**, no por calendario.
2. Primera vez en este proyecto → `/kickoff`.
3. Un frente de trabajo por sesión. Cuando cambiás de tema, `/clear`.
4. Antes de dar algo por hecho: el validador del instanciador (sección 7) si tocaste
   agentes o skills; para el contenido, que el JSON valide contra el schema vigente de
   `arquitectura`; para el resto, el criterio de aceptación de la historia `US-XX`.

## 3. El equipo

| Rol | Misión | Carpeta | Prefijo ID |
|---|---|---|---|
| `producto` | Alcance de la v1, qué juegos entran, piso de ítems | `Docs/PRODUCTO/` | `US-`, `BR-` |
| `arquitectura` | Stack, motor de audio y de juego, schema | `Docs/ARQ/` | `ADR-`, `CTR-` |
| `investigador` | Hechos externos con URL y fecha, o leyenda rotulada | `Docs/INVESTIGACION/` | `RES-` |
| `contenido` | Banco de preguntas, distractores, tono, derechos | `Docs/CONTENIDO/` | `CNT-` |
| `experiencia` | Flujos de sesión corta en móvil, sistema visual | `Docs/UX/` | `UX-` |
| `revisor` | Verifica lo entregado contra los criterios | `Docs/REVISIONES/` | `FIND-` |
| `orquestador` | Tareas por ráfaga, coherencia entre roles | `Docs/ORQ/` | `T-` |

Siete roles, no seis: la justificación está escrita en `Docs/EQUIPO.md`, bajo
"Justificación del roster ampliado". Se invocan por nombre (`@agent-contenido`) o Claude
delega solo cuando la tarea coincide con la descripción del rol.

**Una sola puerta a la web:** `investigador` es el único rol con `WebSearch` y
`WebFetch`. `contenido` y `arquitectura` no salen a buscar por su cuenta — cuando
necesitan un hecho externo lo piden como ficha `RES-XX` en vez de buscarlo. Es lo que
garantiza que haya un solo responsable de que un dato sea falso.

**Regla de propiedad:** cada rol escribe únicamente en su carpeta. Si necesita algo de
otra, deja una propuesta en `Docs/SUGERENCIAS/` — no la edita.

## 4. Mapa de la documentación

| Ruta | Qué es |
|---|---|
| `Docs/BRIEF.md` | El objetivo, para quién, riesgos, supuestos. |
| `Docs/EQUIPO.md` | Roster, mapa de propiedad, roles descartados. |
| `Docs/DECISIONES.md` | Por qué las cosas son como son (`D-XX`), distinto de los `ADR-XX` de `arquitectura`. |
| `Docs/IDS.md` | Convención de identificadores. |
| `Docs/PRODUCTO/` … `Docs/ORQ/` | Un dueño cada una — ver tabla de arriba. |
| `Docs/SUGERENCIAS/` | Propuestas cruzadas entre roles, sin editar la carpeta ajena. |

**Antes de decidir algo que ya se decidió, buscá en `Docs/DECISIONES.md`.**

## 5. Identificadores

Convención completa en `Docs/IDS.md`. En resumen: `<PREFIJO>-<número de 2 dígitos>`, no
se reutiliza un número, un ítem cancelado se marca `[CANCELADO]` y se queda donde está.
Todo entregable referencia los IDs de los que depende. Un requisito sin ID no existe.

## 6. Reglas del proyecto

### La postura del proyecto — leer esto antes que las reglas de abajo

Esto es un **fan site sin fines de lucro, de poco volumen, hecho para divertirse**. No es un
producto, no hay plata en juego y no hay nadie a quien rendirle cuentas. La postura del
usuario, decidida con toda la evidencia sobre la mesa y registrada en `D-14`:

- **Si llega un reclamo, se da de baja y listo.** No es negligencia: es proporción. El
  riesgo real de un sitio de fans que no lucra y que ven veinte personas es que alguien
  pida que lo bajen, y bajarlo cuesta un minuto.
- **El conocimiento popular vale.** La historia de esta banda se transmitió por relato,
  por lo que contó alguien que estuvo, por lo que se dice en la previa. **No hay mucho
  oficial y no debería importarnos**: `RES-23` confirmó que no existe fuente autorizada de
  letras y nunca existió, y `RES-21` que el propio memoir del Indio se declara "apenas mi
  versión". Exigir fuente oficial es exigir algo que la banda deliberadamente nunca produjo.
- **Abrir los molinetes.** En los recitales, los que estaban adentro abrían los molinetes
  para que pasara el que no había podido pagar la entrada. Ese es el principio rector del
  sitio, y no es decoración: **nada acá se le niega a nadie por no tener con qué entrar.**
  Sin cuentas, sin login, sin Premium, sin saber lo suficiente. El que llega sin idea juega
  igual. Tres decisiones que ya estaban tomadas por separado —`D-08` (no se le exige Premium
  al jugador), `D-09` (sin muro de entrada) y el "sin cuentas de usuario" del alcance— son
  todas la misma cosa, y ahora tienen nombre.

**Lo único que sigue siendo estricto, y no por lo legal:** que una respuesta del quiz sea
**correcta**. No por miedo a nadie, sino porque si el dato está mal, **el juego le marca
error justo al que se sabe el tema**. Eso rompe lo único que el sitio promete de verdad, que
es premiar al que sabe. Una leyenda **rotulada como leyenda** es contenido perfecto; una
leyenda **disfrazada de dato** hace quedar mal al jugador, no al sitio.

### Las reglas

- **Móvil primero, sesiones de dos o tres minutos.** Se entra, se juega una partida, se
  comparte el resultado, se cierra. Todo lo que exija más está mal cortado.
- **Stack: Astro + TypeScript**, islas, JSON versionado, sin backend, hosting estático
  gratuito. Detalle de código en `.claude/rules/codigo-juegos.md`.
- **Motor de audio:** el reveal desde 0,1 seg es fragmento propio con Web Audio API, y
  **el tema completo lo sirve el sitio en mp3** (`D-22`; niveles y peso en `D-23`, límites
  de Vercel en `RES-50`), porque negarle el tema al que no tiene Premium cerraba un
  molinete. Spotify es un enlace opcional por deep link (`ADR-01`, opción B), nunca la vía
  al tema.
- **Regla de veracidad, en su forma actual (`D-14`):** lo que importa es que **el rótulo
  diga la verdad sobre lo que hay adentro**, no de dónde salió el dato. Tres casillas:
  **hecho**, **leyenda** y **testimonio**, y el schema las hace cumplir. Una historia que
  circula entre fans **entra rotulada como leyenda y es contenido de primera** — no hace
  falta URL ni fecha para eso. Lo que no entra es una leyenda vestida de hecho. Cuando hay
  fuente, se cita; cuando no la hay, **se dice que no la hay y se usa igual**. Detalle en
  `.claude/rules/contenido-json.md`.
- **Los derechos no bloquean nada, y si llega un reclamo se baja** (`D-14`). La nota de
  `contenido` (`CNT-01`) **es un mapa, no un gate**: qué se está usando y de dónde salió,
  para poder responder rápido y bien si alguien pregunta. Donde el repo todavía hable de un
  cerrojo antes de publicar, es `D-07`, y `D-14` lo reemplazó.
- **Dedicación en ráfagas.** El trabajo se corta en tareas `T-XX` autocontenidas que
  cierran enteras en una ráfaga. `ESTADO.md` tiene que alcanzar para retomar sin releer
  el repo entero.

## 7. Comandos

```bash
python3 ../InstanciadorProyectos/scripts/validar_instancia.py .
```

El validador **vive en el instanciador, no acá** (`D-11`): valida frontmatter de agentes
y skills, presupuestos y colisiones de ruteo, desde afuera de la instancia. Se corre desde
la raíz del proyecto. Sale `APTA` con **dos avisos esperados** — el largo de este archivo, que se acerca al tope de 200 líneas, y siete roles sobre un tope de
seis, justificado en `Docs/EQUIPO.md`. Un aviso no es un error: el código de salida es 0.

`/kickoff` la primera vez · `/estado` al empezar · `/ciclo` para planificar el próximo
tramo · `/coherencia` antes de construir algo nuevo y al cerrar cada ciclo.

## 8. Qué NO hacer

- No escribir en la carpeta de otro rol.
- No agregar un agente nuevo sin sacar otro, salvo que lo justifiques por escrito en
  `Docs/EQUIPO.md` como se hizo con el séptimo rol.
- No dejar `ESTADO.md` desactualizado al terminar una sesión: es lo único que sobrevive
  al reinicio de contexto entre ráfagas.
- No dar por terminado nada sin una verificación que se pueda correr. Ojo: los cuatro roles
  que escriben **no tienen con qué correrla** (`D-12`), así que dejan el comando y lo corre
  `revisor`, `orquestador` o el hilo principal.
- **No frenar nada esperando permiso, ni por derechos ni por falta de fuente oficial**
  (`D-14`). Si un dato no tiene respaldo, se rotula como leyenda y entra. Si algún día llega
  un reclamo, se baja.
- **No poner un dato dudoso como respuesta correcta de una pregunta.** Es lo único que
  quedó estricto, y no es por lo legal: si la respuesta está mal, el juego le marca error al
  que se sabe el tema. Va rotulado como leyenda, o va reformulado, o no va.
- **No agregar nada que le pida algo al jugador para entrar**: cuenta, login, Premium,
  saber lo suficiente. Los molinetes van abiertos.
