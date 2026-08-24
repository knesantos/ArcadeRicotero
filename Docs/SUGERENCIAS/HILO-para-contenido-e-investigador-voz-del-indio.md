# Del hilo principal para `contenido` e `investigador` — que el sitio intente hablar como el Indio

- **Fecha:** 2026-08-21
- **Origen:** el usuario, textual: *"analizar a fondo letras, entrevistas y demas archivo
  del indio solari para que la pagina intente hablar como el"*.
- **Estado: TOMADA el 2026-08-23.** Ver "Qué pasó cuando se tomó" al final: la regla
  existe (`.claude/rules/voz-ricotera.md`), el test existe, y quedan dos encargos.
- **Estado original (2026-08-21): idea guardada, NO se hace ahora** — lo dijo el usuario en el mismo pedido
  (*"Agrega como idea futura, no para hacerla ahora"*). No es tarea del ciclo 4, no entra
  al tablero, no tiene ID todavía.

## Qué es

Una capa de voz **por encima** de lo que ya está decidido, no un reemplazo. Hoy la voz la
fijan `CNT-02` (guía de tono: la jerga va en el tono, nunca en la barrera) y `D-17`
(sin anglicismos, voseo en cada botón). La idea es destilar de la obra y del archivo del
Indio una guía más fina —cadencia, imágenes, cómo arma una frase— y que el copy del sitio
la use.

## Quién hace qué cuando se tome

1. **`investigador`** junta el corpus y lo ficha. Es el único rol que sale a la web
   (`CLAUDE.md`, "una sola puerta"), así que ninguna entrevista entra al proyecto sin
   pasar por una ficha `RES-XX`. Insumo que ya existe y no hay que ir a buscar:
   - `RES-21` — el memoir, con el mapa de sus 27 capítulos, y su propio rótulo: se declara
     *"apenas mi versión"*, así que es **testimonio**, no verdad unívoca.
   - `RES-23` / `D-13` — las letras, con el filtro obligatorio de los **105 temas de
     `RES-20`**. Todo lo demás que circule como "letra del Indio" puede ser de
     Los Fundamentalistas, y eso es otra voz y otra época.
   - Lo que falta y sí es nuevo: entrevistas. Ahí sí hay que buscar, fichar y fechar.
2. **`contenido`** destila la guía como **revisión de `CNT-02`**, con los mismos pares
   bien/mal que ya usa ese documento. Es su carpeta y su decisión editorial.

## Las tres preguntas a resolver antes de escribir una sola línea de copy

1. **¿El sitio habla _como_ él o habla _citándolo_?** No es lo mismo. Citar es testimonio
   rotulado, que ya tiene casilla (`D-14`, `BR-08`). Escribir frases nuevas con su voz es
   ponerle palabras en la boca a una persona real que murió el 5-jun-2026 (`RES-04`). Se
   puede hacer, pero el rótulo tiene que seguir diciendo la verdad sobre lo que hay
   adentro: **una frase escrita por el sitio no puede quedar pareciendo una cita**.
2. **Dónde aplica y dónde no.** Un botón críptico es un molinete cerrado, y los molinetes
   van abiertos (`D-14`, `D-09`). La voz puede vestir títulos, resultados y prosa de la
   Redondopedia; los enunciados de las preguntas y todo lo que haya que entender para
   jugar siguen bajo la regla de `CNT-02` y `UX-01`.
3. **Que no termine en imitación de manual.** "Meter palabras raras" es el mismo defecto
   que la estética genérica de IA, pero en el texto — ver la tabla de tics vetados en
   `.claude/rules/diseno-marca.md`. Si la guía no puede mostrar el par bien/mal, no está
   lista.

## Cómo se verifica

Igual que `CNT-02`: pares bien/mal concretos, y `revisor` chequea copy real del sitio
contra ellos. **Hoy no hay test que audite el texto** — `src/lib/estilos.test.ts` audita
el CSS (anti-slop visual), no el copy, y `D-17` se cumple a ojo. Si la guía nueva deja
algo chequeable a máquina (lista de anglicismos vetados, por ejemplo), el test hay que
escribirlo: es la parte que hoy no existe.


---

## Qué pasó cuando se tomó — 2026-08-23

El usuario la pidió de nuevo, esta vez para hacerla: *"un análisis profundo de la forma de
hablar y escribir del Indio Solari [...] que presente los juegos como si fuese un tema"*.

**Lo que se hizo, y dónde vive:** `.claude/rules/voz-ricotera.md`, escrita por el hilo
principal con el mismo estatuto que `diseno-marca.md` — obliga a todos, roles incluidos.
Los números salen de medir dos corpus **que ya estaban en el repo**, sin salir a la web:
el memoir (`RES-21`, 192.464 palabras) y las letras de los 104 temas del cancionero.

**Las tres preguntas de arriba quedaron contestadas así:**

1. **¿Habla como él o citándolo?** Citándolo, cuando hable él. El sitio usa sus
   procedimientos —largo de frase, rodeo, duda declarada, cómo nombra a la gente— y
   **nunca firma una frase con su nombre.** Sección 1 de la regla, con las tres razones.
2. **Dónde aplica.** Resuelto con tres registros (sección 5): *el que canta* (títulos,
   casetes, botones), *el que cuenta* (Redondopedia, explicaciones) y *el que rotula*
   (leyenda, testimonio, errores, avisos, y los tres temas de `CNT-04`/`CNT-06`), que va
   seco. Y la regla de las dos líneas: una nombra, la otra canta; tapá la que canta y el
   que llegó de afuera tiene que seguir sabiendo qué tocar.
3. **Que no termine en imitación de manual.** El corpus dio el antídoto medido: en 192.464
   palabras dice *che* 9 veces, *viste* 15 y *digamos* 3. La imitación de manual es
   justamente lo que **no** suena a él. Tabla de tics vetados en la sección 7.

**El test que este documento decía que no existía, ahora existe:** `src/lib/voz.test.ts`,
seis pruebas sobre las cadenas visibles de los cinco módulos de copy. 185/185 en verde.

### Los dos encargos que quedan, y son de otras carpetas

**1. Para `contenido` — once botones cambiaron en el código y `CNT-05` todavía dice lo
viejo.** El test encontró once cadenas en infinitivo, que `D-17` no permite ("voseo en
cada botón"). Se corrigieron en el producto, que es lo que se ve, con el mismo criterio
que ya se había usado con la variante *"¡Con la gorra bien puesta!"*:

| Dónde | Decía | Dice |
|---|---|---|
| `quiz` (C4, C5 de `CNT-05`) | `COMPARTIR` · `JUGAR DE NUEVO` | `COMPARTÍ` · `JUGÁ DE NUEVO` |
| `sitio` | `VOLVER` | `VOLVÉ` |
| `letra` | `Empezar` · `Seguir` · `Volver al arcade` · `Ver las letras enteras` · `Ir a letras y acordes` | `Empezá` · `Seguí` · `Volvé al arcade` · `Mirá las letras enteras` · `Andá a letras y acordes` |
| `tapa` | `Empezar` · `Seguir` · `Volver al arcade` | `Empezá` · `Seguí` · `Volvé al arcade` |

Los identificadores `C4`/`C5` de `CNT-05` siguen trazando; lo que cambió es el texto. **El
mismo par aparece en `UX-01`, `UX-02`, `UX-04` y `UX-05`**, que son de `experiencia`: ahí
no se tocó nada, y conviene que el ejemplo de `UX-04` ("COMPARTIR") se actualice para no
seguir citando como modelo lo que el test ahora rechaza.

**2. Para `contenido` — la guía fina que `CNT-02` no tiene.** La regla nueva fija los
números y los registros; lo que le falta es lo que `CNT-02` hace mejor que nadie: **pares
bien/mal concretos** para las preguntas del quiz, que son el terreno de `contenido` y
donde la voz **no** puede entrar (el enunciado tiene que entenderse antes que sonar). La
regla dice qué registro va en cada superficie; `CNT-02` sigue mandando adentro del
enunciado.

### Y hay un tercer encargo, del barrido del mismo día

El usuario aprobó aplicar la voz a las superficies que presentan. **Dos cadenas del quiz
que `CNT-05` fija cambiaron de texto** (los identificadores siguen siendo los mismos):

| `CNT-05` | Decía | Dice |
|---|---|---|
| C2, tramo medio | Ya sabés más de lo que pensabas. Seguí así. | Ya sabés más de lo que creías. Una vuelta más y los tenés. |
| C3, tramo alto | Te la sabés de memoria. Grande, campeón. | Te la sabés de memoria. Sos de los que abren el molinete. |

El motivo del segundo: *"grande, campeón"* es aliento de cancha genérico, y el tramo alto
es justo donde el sitio puede decir algo que solo este sitio puede decir. El que se la sabe
es el que abre el molinete para el que recién llega — que es el principio de `D-14`
devuelto como devolución.

**Nada de esto toca el enunciado de una sola pregunta.** El barrido se detuvo en la puerta
de la partida a propósito: adentro sigue mandando `CNT-02`, porque ahí entender va antes
que sonar.
