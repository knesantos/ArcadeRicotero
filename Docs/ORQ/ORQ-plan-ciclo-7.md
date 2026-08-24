# ORQ — Plan del ciclo 7: se cierra el piso del quiz y se saldan las deudas de rol

> **Escrito por el hilo principal** con `/ciclo`, el 2026-08-23, sobre el pedido del
> usuario: *"comienza y termina el ciclo 7"*. Una sola ráfaga, plan y ejecución juntos.
> El ciclo 6 quedó cerrado, y las tres sesiones sueltas del 2026-08-23 también.

## Dónde está parado el proyecto — medido hoy, no recordado

Los cinco pisos de la v1, contados contra los archivos del repo:

| Historia | Juego | Piso | Hoy | Falta |
|---|---|---|---|---|
| `US-01` | Quiz | 40 | **30** | **10, y son las 10 de `letras`** |
| `US-02` | Adiviná el tema | 20 | 0 fragmentos | los mp3 — necesita ffmpeg y la mano del usuario |
| `US-03` | Completá la letra | 15 | 0 `listo` (226 borradores) | 15 confirmaciones de oído — la mano del usuario |
| `US-04` | Adiviná la tapa | 10 | **10** | ✅ cerrado |
| `US-05` | Redondopedia | 35 | **35** | ✅ cerrado |

**Lo que esto dice del ciclo, y es lo que lo ordena:** de las tres cosas que faltan, dos
son de la mano del usuario y **una sola la puede hacer un rol**. Las 10 preguntas de
`letras` cierran el tercer piso de la v1 y son el único piso que se mueve en esta ráfaga.

Reparto del banco de hoy: `discos` 10 · `mitologia` 10 · `historia` 10 · **`letras` 0**.
Por nivel: 10 fáciles · 13 medias · 7 difíciles. El piso pide 10/15/15, así que las diez
nuevas salen **2 medias y 8 difíciles**, sin una sola fácil. No es una preferencia: es
aritmética del piso.

## Y hay cuatro deudas entre roles, todas escritas y ninguna saldada

El ciclo 6 y las sesiones sueltas dejaron cuatro pedidos en `Docs/SUGERENCIAS/`. Tres de
ellas son **coherencia rota**: el código hace una cosa y el documento del rol dueño dice
otra. Eso es exactamente lo que `/coherencia` busca, y no conviene arrastrarlo a un ciclo
más — un contrato que miente sobre lo construido envejece peor que uno que falta.

| Deuda | Dueño | Por qué duele |
|---|---|---|
| `RES-49` — fichar cifraclub | `investigador` | 82 de los 96 temas con letra no pueden entrar al banco de `US-03` sin ficha |
| `RES-50` — límites de Vercel para ~180 MB de mp3 | `investigador` | `D-23` está tomada, pero nadie sabe dónde viven los archivos |
| `BR-02` — la mecánica de `US-02` | `producto` | La regla dice intento único; el juego construido da **seis intentos con desbloqueo** |
| `CTR-01.9` / `CTR-03.5` — escalera de seis y `modoRespuesta` | `arquitectura` | El contrato tiene cinco pasos y 10 s; el juego tiene seis y 15 s |

## Las tareas

| T | rol | qué | archivos | verifica con | [P] |
|---|---|---|---|---|---|
| `T-97` | `investigador` | `RES-49`: cifraclub como fuente de letra | `Docs/INVESTIGACION/INV-23-cifraclub.md` | la ficha existe y responde las 3 preguntas del pedido, con URL y fecha | [P] |
| `T-98` | `investigador` | `RES-50`: qué banca Vercel Hobby con ~180 MB de mp3 | `Docs/INVESTIGACION/INV-24-limites-vercel-audio.md` | la ficha responde las 6 preguntas del pedido, con cita textual en la 1 | [P] |
| `T-99` | `producto` | `BR-02` reescrita sobre la mecánica real de `US-02` | `Docs/PRODUCTO/PRD-alcance-v1.md` | `BR-02` describe seis intentos con desbloqueo y su tabla tiene seis filas | [P] |
| `T-100` | `producto` | `IDEA-11` entra al backlog con su choque medido | `Docs/PRODUCTO/PRD-backlog-ideas.md` | `IDEA-11` figura en el PRD y la tabla del PRD la lista | [P] |
| `T-101` | `contenido` | El máximo del fragmento: confirmar o corregir los 15 s | `Docs/CONTENIDO/CNT-01-nota-derechos.md` | `CNT-01` sección A dice un número y su fundamento | [P] |
| `T-102` | `contenido` | `CNT-08`: las 10 preguntas de `letras` — **cierra el piso de 40** | `src/data/quiz.json`, `Docs/CONTENIDO/CNT-08-lote-letras.md` | 40 ítems · 10 por categoría · 10/15/15 por nivel · schema OK · `npm test` | [P] |
| ~~`T-103`~~ | hilo | ~~Sacar la anotación de tablatura tipada como letra~~ | — | — | **[CANCELADO]** |
| `T-104` | `arquitectura` | `CTR-01` y `CTR-03` al día con el juego construido | `Docs/ARQ/ARQ-fragmento-audio.md`, `Docs/ARQ/ARQ-schema-adivinar-tema.md` | los dos contratos describen seis pasos, 15 s y `modoRespuesta: "buscador"` | ← `T-101` |
| ~~`T-105`~~ | hilo | ~~El banco de `US-03` con las dos fuentes, y hoja de escucha nueva~~ | — | — | **[CANCELADO]** |
| `T-106` | `revisor` | `REV-06`: revisar el lote de `letras` contra sus criterios | `Docs/REVISIONES/REV-06-lote-letras.md` | hallazgos `FIND-XX` con evidencia y criterio incumplido | ← `T-102` |
| `T-107` | hilo | Verificación entera, hallazgos corregidos y commit | — | `npm test`, `npm run check`, `npm run build` | ← todas |

## Las tareas que aparecieron con el ciclo corriendo

Ninguna estaba en el plan. Cuatro salieron de revisar lo entregado; la quinta, de un aviso
del usuario a mitad de camino.

| T | rol | qué | por qué apareció |
|---|---|---|---|
| `T-108` | `contenido` | Corregir seis defectos del lote de `letras` | La pasada adversarial encontró lo que la revisión formal no: ver `REV-06` |
| `T-109` | hilo | Arreglar `armarRonda`: la ronda servía **solo preguntas fáciles** | Salió de revisar el lote. 30 de las 40 preguntas del banco no se jugaban nunca |
| `T-110` | hilo | Corregir el artículo `mi-perro-dinamita` de la Redondopedia | Un párrafo rotulado `testimonio` citaba una ficha que no dice lo que le atribuían |
| `T-111` | hilo | Reingerir el cancionero rehecho, con tres defectos nuevos de ingesta | El usuario avisó que el cancionero estaba actualizado. Revivió lo que `T-103` y `T-105` habían dejado cancelado |
| `T-112` | hilo | Correr los schemas de verdad, y guardar los pisos ya cumplidos | Ninguna de las dos verificaciones existía, y una regla del proyecto pide que todo se pueda correr |

## La pasada de conflictos, escrita y no mental

- **`T-97` y `T-98` son los dos de `investigador`** y escriben **archivos distintos**
  (`INV-23` e `INV-24`). Paralelas. Ninguna de las dos toca `ESTADO.md`: los rangos los
  cierra el hilo principal en `T-107`.
- **`T-99` y `T-100` son los dos de `producto`** y escriben archivos distintos
  (`PRD-alcance-v1.md` contra `PRD-backlog-ideas.md`). Paralelas.
- **`T-101` y `T-102` son los dos de `contenido`.** `T-101` escribe `CNT-01`, `T-102`
  escribe `quiz.json` y `CNT-08`. No se cruzan. Paralelas.
- **`T-104` NO es paralela**: el número de `CTR-01.3` sale de `CNT-01`, que es lo que
  `T-101` escribe. Arranca cuando `T-101` cierra.
- **`T-105` NO es paralela**: necesita el rótulo de `T-97` para poder citar `fuenteLetra`,
  y necesita el cancionero limpio de `T-103` — si corre antes, mete anotación de guitarra
  adentro de un hueco de letra, que es el defecto que `T-103` va a sacar.
- **`T-103` y `T-102` tocan cosas distintas** (`cancionero.json` contra `quiz.json`), pero
  se anotan como no paralelas por precaución de contenido, no de archivo: si `T-102`
  citara una línea que `T-103` retipa, la pregunta quedaría apoyada en un renglón que
  después no existe. Se resuelve solo con el criterio de `T-102` — ver abajo.
- **`T-106` es de `revisor` y llega después de `T-102` por definición**: revisar es
  verificar lo entregado, con contexto fresco y sin haber armado la pieza.

## `T-103` y `T-105` quedaron canceladas a mitad de ciclo, y por un buen motivo

**Aviso del usuario, 2026-08-24, mientras el ciclo corría:** el cancionero **se está
rehaciendo en otra sesión**, sobre `C:\Users\santi\Proyectos\TemasRedo\cancionero`, y esta
sesión no tiene que tocarlo.

Las dos tareas dependían de reescribir `src/data/cancionero.json`:

- **`T-103`** iba a retipar la anotación de guitarra que la fuente dejó adentro de líneas
  marcadas como letra. El detector ya estaba prototipado y medido — **378 líneas sobre
  6.354**, repartidas en `tab-grafica` 336, `layout` 33 y `repeticion` 9, con una segunda
  pasada pendiente para los casos mezclados del tipo `VERSO 1: (Riff 2) X7`. **No se
  aplicó nada.** Si el corpus nuevo llega con el mismo defecto, el detector se rehace: son
  seis reglas y un archivo.
- **`T-105`** iba a regenerar el banco de `US-03` con las dos fuentes, ahora que `RES-49`
  existe, y a sacar una hoja de escucha mejor surtida. Regenerar sobre un corpus que está
  por cambiar es trabajo que se tira, y peor: los ids de `letra.json` son posicionales, así
  que la hoja quedaría apuntando a versos que el corpus nuevo va a correr de lugar.

**Lo que no se perdió:** `RES-49` quedó escrita igual y es lo caro de `T-105`. El generador
ya tiene la fuente en una constante (`FICHA_LETRA`) y el filtro en un solo lugar. Cuando el
cancionero nuevo aterrice, son dos líneas y una corrida.

**Y una advertencia para el ciclo que lo retome:** hoy no hay ninguna confirmación de oído
cargada — las 24 filas de `src/data/letra-confirmaciones.json` están todas en `_:__`. Eso
hace que rehacer el corpus **hoy salga gratis**. Después de que alguien escuche, no.

## El criterio que define `T-102`, y es una decisión, no un detalle

**Una pregunta de la categoría `letras` no cita un verso.** Trabaja sobre el *mundo* de
las letras: títulos, personajes, lugares, objetos, autoría, y hechos documentados sobre la
obra. Tres razones, y la primera es la que manda:

1. **Citar versos es el juego de al lado.** `US-03` existe justamente para eso, con hueco,
   contexto y confirmación de oído. Un quiz que además cite versos duplica a `US-03` y le
   roba lo único propio que tiene.
2. **El rótulo se sostiene mejor.** Un hecho sobre un título o un personaje se cita contra
   `RES-20`, que es tracklist verificado. Un verso citado se apoya en la transcripción de
   un sitio de fans — que es material perfectamente bueno para leer y para jugar a
   completar, pero es el escalón más flojo para poner **como respuesta correcta**, que es
   lo único estricto del proyecto.
3. **`RES-03` no obliga pero tampoco invita**: el derecho de cita topea, y no hay ninguna
   razón para gastar ese margen en el juego que menos lo necesita.

Los cuatro tipos de pregunta que sí entran, con ejemplo de forma (no de contenido):
**el personaje** (quién aparece en qué tema), **el título** (qué tema se llama como algo
que la letra nunca nombra, o al revés), **la autoría** (los dos temas con tercer autor,
`RES-20`), y **lo documentado** (`RES-22`: la letra impresa en el sobre de *Oktubre* de un
tema que no está en el disco).

## Qué queda afuera, y por qué

- **Los mp3 de `US-02`.** No es una tarea de rol: hace falta ffmpeg, que en esta máquina no
  está, y la carpeta con la discografía del usuario. El comando está escrito y esperando.
- **Las 15 confirmaciones de oído de `US-03`.** Es lo único del proyecto que un programa no
  puede hacer sin mentir (`CTR-04`). `T-105` deja la hoja mejor surtida; escuchar es del
  usuario.
- **Desplegar en Vercel.** Nada lo bloquea desde `D-14` y `D-15`, pero publicar es un acto
  hacia afuera y lo decide el usuario, no un ciclo. `T-98` deja fichado lo que hace falta
  saber antes de subir el primer mp3.
- **Los 6 artículos `tema` de la Redondopedia.** Ya están: la Redondopedia cerró su piso en
  35/35 durante el ciclo 6. Esta línea queda escrita porque el `ESTADO.md` viejo todavía la
  listaba como pendiente.
- **`IDEA-01`..`IDEA-11` como juegos.** `BR-16` no deja entrar una idea a un ciclo sin
  promoverla antes a `US-XX`, y nadie la promovió.

## El riesgo del ciclo

**Que las diez preguntas de `letras` salgan blandas.** Es el riesgo real y es de contenido,
no de código: ocho de las diez tienen que ser **difíciles** por aritmética del piso, y una
pregunta difícil mal hecha no es una pregunta difícil — es una pregunta con un distractor
que también es correcto, o con una respuesta que sale de una transcripción de fans puesta
como si fuera un hecho. Eso es exactamente lo que `CLAUDE.md` declara como lo único
estricto: **si la respuesta está mal, el juego le marca error justo al que se sabe el
tema.**

Por eso `T-106` no es opcional y por eso el criterio de arriba ata cada pregunta a
`RES-20`, `RES-22` o a una ficha con nombre — y no a un renglón de cifraclub.

**El segundo riesgo, más chico:** que `T-103` retipe de más. Sacar "RIFF 2 x7" de la letra
es obvio; sacar una línea que *parece* anotación y era letra, no. El test que la tarea deja
tiene que contar las líneas movidas y la revisión mira la lista, no el número.
