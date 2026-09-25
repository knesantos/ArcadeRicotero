# CNT-25 — "Más o menos": las palabras y todo lo que se lee

- **Fecha:** 2026-09-25 (cuarta vuelta, sobre la misma ráfaga)
- **Rol dueño:** `contenido`
- **Estado:** entrega completa — `datos[]` (35 números a mano de la banda, de `INV-100`,
  ajustados contra `CTR-20`), la familia `las-palabras` (20 palabras `listo`, sin cambios
  desde la primera vuelta) y todo el texto visible del juego, confirmado o corregido
  contra lo que el hilo principal ya tiene provisorio en `src/lib/mas-o-menos/copy.ts`.
- **Corrección de esta vuelta:** `arquitectura` cerró `CTR-20`
  (`Docs/ARQ/ARQ-schema-mas-o-menos.md`) con reglas más duras que las que usé para armar
  `datos[]` en la segunda vuelta. Ajusté el archivo real (no solo este documento) contra
  `CTR-20.2` y `CTR-20.4`: ver "1'.5 — Ajuste contra `CTR-20`" más abajo.
- **Consume, sumado en esta vuelta:** `Docs/ARQ/ARQ-schema-mas-o-menos.md` (`CTR-20.0`,
  `CTR-20.2`, `CTR-20.4`, `CTR-20.11`, `CTR-20.12` — el schema real, sus invariantes y la
  tabla completa de filas de `INV-100` que no se cargan).
- **Consume de la segunda vuelta:** `Docs/INVESTIGACION/INV-100-los-numeros-de-la-banda.md`
  (`RES-100`..`RES-105`, y su "Nota del hilo principal al pegar" — qué filas no sirven),
  `Docs/PRODUCTO/PRD-mas-o-menos.md` (`US-10`, `BR-32`, `BR-33`, el piso de ítems),
  `src/lib/mas-o-menos/datos.ts` (`DatoCrudo`, la forma exacta que lee el motor), y el
  `src/lib/mas-o-menos/copy.ts` real que ya escribió el hilo principal (fuente de verdad
  de esta vuelta: confirmo o corrijo contra ese archivo, no reinvento la forma).
- **Consume de la primera vuelta:** `D-48`, `Docs/SUGERENCIAS/HILO-para-todos-mas-o-menos-
  el-modelo.md`, `Docs/SUGERENCIAS/HILO-para-contenido-mas-o-menos-las-palabras.md`,
  `src/lib/mas-o-menos/conteo.ts`, `.claude/rules/voz-ricotera.md`,
  `.claude/rules/diseno-marca.md`, `CNT-02`, `CNT-04`, `CNT-06`, `CNT-13`, `D-17`,
  `Docs/CONTENIDO/CNT-09-test-dos-ejes.md` (molde de forma), `src/lib/dos-ejes/copy.ts`,
  `src/lib/por-la-letra/copy.ts`, `src/lib/sitio/copy.ts`, `src/lib/tema/copy.ts`,
  `src/lib/quiz/copy.ts`, `src/lib/voz.test.ts`, `Docs/INVESTIGACION/INV-89-conteo-
  completo.md` (`RES-89`..`RES-92`, el conteo de setlist.fm), `Docs/INVESTIGACION/INV-20-
  fuentes-primarias.md` (`RES-20`, los tracklists y duraciones), `Docs/UX/UX-34-mas-o-
  menos.md` (§1 la variante de disco y `'baion'`, §3.2/§3.4/§3.5 cómo se muestra la
  referencia y el panel reusado, §4 el formato de número/unidad, §9 los presupuestos).
- **Produce:** `src/data/mas-o-menos.json` completo (35 datos a mano `MM-01`..`MM-35`, 20
  palabras `MP-01`..`MP-20`), este documento con la confirmación/corrección del texto real
  de `src/lib/mas-o-menos/copy.ts`, y la corrección puntual de la bajada del casete del
  portal en la sección 3.2.
- **No hago acá:** el schema (`CTR-20`, `arquitectura`), la mecánica del motor —cómo se
  aleja la referencia, el sorteo de familia— (`arquitectura`/hilo principal), el mapa
  sección→disco ni la variante/arte del casete (`experiencia`).

---

## 1. La curaduría de las 20 palabras

### 1.1 Método

Partí de la tabla medida en `HILO-para-contenido-mas-o-menos-las-palabras.md` (formas con
3 temas o más, ya corrida contra el corpus real por la misma función que usa el juego,
`armarCorpus` + `temasDe` de `conteo.ts`). De ahí saqué, en este orden:

1. **Todo lo que la tabla ya marca como vocabulario de taller** (fila 1 del documento):
   *primera, tercera, cuarta, intermedio, fill, repite, toca, par, letra, tema, man, com*.
   Ninguna entró a la lista de candidatas.
2. **Los acordes en castellano** (*sol, la, mi, re, do, fa, si*): fuera de entrada, sin
   evaluar. El riesgo que señala el encargo es real — hay líneas de cifra tipadas como
   `t: "letra"` que no lo son — así que no vale la pena ni abrir la discusión sobre estas
   siete.
3. **Los homónimos conocidos** (*vino, mal*) y uno que encontré yo: **`plata`**. Grep
   sobre `src/data/cancionero.json` mostró que de los tres temas donde aparece, al menos
   dos citan **"La Plata"**, la ciudad ("Desde La Plata, 'Miguel Sánchez y los
   desterrados...'", "Santo fumador, de allá de La Plata") — el sentido de plata-dinero
   solo aparece una vez ("encadenada de plata"). Con 3 temas de piso y dos tercios
   posiblemente contaminados por el topónimo, descarté la palabra entera: no hay forma de
   separar "plata" (dinero) de "La Plata" (ciudad) con el filtro de formas exactas que usa
   `conteo.ts`, y el número mentiría sobre lo que cuenta.
4. **`rock`**, que no está en la lista de taller pero encontré igual de riesgosa con el
   mismo método. Grep mostró que la forma exacta "rock" aparece en al menos una línea que
   no es letra cantada: `"=============DEL ROCK EN ESPA~OL================="`, un divisor
   de sección de una cifra vieja, tipado `t: "letra"` en el JSON pero sin ninguna de las
   firmas que reconoce `anotacion.ts` (no es solo caracteres de dibujo — tiene letras
   mezcladas con los signos `=` — así que `esAnotacion()` no lo agarra). Descarté la
   palabra: no puedo saber cuántos de los 15 temas de la tabla arrastran esta clase de
   contaminación sin correr el conteo yo mismo, y no tengo con qué (`D-12`).

### 1.2 Qué sí entró, y por qué

Elegí **cuerpo, objeto, animal y plata** por sobre la abstracción (`voz-ricotera.md`
§4.3), y repartí la lista entre "muchas" y "pocas" como pide el encargo:

| Palabra | Temas (con todo) | Categoría | Nota |
|---|---|---|---|
| `amor` | 34 | (ancla alta, tema central) | El techo de la lista, tal cual lo cita el propio encargo. |
| `ojo` | 17 | cuerpo | `ojo` + `ojos`. |
| `dios` | 16 | figura | Sin plural con piso de 3; standalone. |
| `corazón` | 14 | cuerpo | El ejemplo textual del encargo (`corazón`/`corazon`, mal tipeado). |
| `rock` | — | — | **Descartado**, ver 1.1.4. |
| `perro` | 8 | animal | El otro ejemplo textual del encargo. |
| `luz` | 8 | objeto/imagen | `luz` + `luces`. |
| `diablo` | 9 | figura | `diablo` + `diablos`. |
| `fuego` | 9 | elemento | Sin plural con piso; standalone. |
| `guita` | 6 | plata | La palabra de plata más ricotera: 60 apariciones en el memoir del Indio (`voz-ricotera.md` §3.5). |
| `nariz` | 7 | cuerpo | `nariz` + `narices`. |
| `lengua` | 7 | cuerpo | `lengua` + `lenguas`. |
| `culo` | 6 | cuerpo | `culo` + `culos`. Informal, pero es del idioma de la banda, no una barrera para jugar — nadie necesita "entender el chiste" para contestar más o menos. |
| `tormenta` | 5 | elemento/clima | Standalone. |
| `oro` | 5 | plata/objeto | Ver homónimo verificado abajo. |
| `gato` | 5 | animal | `gato` + `gatos`. |
| `cerebro` | 4 | cuerpo | Standalone. |
| `carne` | 4 | cuerpo | Standalone. |
| `sangre` | 4 | cuerpo | Standalone. |
| `vidrio` | 3 | objeto | Standalone. |
| `lobo` | 3 | animal | El piso del encargo, tal cual lo cita ("lobo, 3"). |

**20 palabras `listo`**, de 3 a 34 temas.

### 1.3 El homónimo que sí entró, verificado

`oro` es homónimo posible con la primera persona del verbo *orar* ("yo oro"). Antes de
descartarlo de plano hice el mismo chequeo que hice con "plata": Grep sobre
`src/data/cancionero.json` (`\boro\b`) devuelve ocho líneas en total, repartidas en los 5
temas de la tabla. Las ocho son oro-metal: *"Chorros de oro cochino"* (dos veces, el mismo
estribillo), *"De presa seca, de oro falso, de vermouth"*, *"Demonio de lengua de oro"*,
*"Pagan con promesas los nenes de oro"* (dos veces), *"Descarados, lindos, varoncitos de
oro"*, *"Dicen que ya no hay huevos de oro"*. Ninguna es el verbo. Lo dejo con
`notaInterna` en el JSON para que quede escrito por qué el número no engaña, tal como pide
el encargo para este caso.

### 1.4 Lo que verifiqué y no encontré problema

Hice el mismo Grep de auditoría (buscar la forma exacta dentro de `"texto"` y mirar el
contexto) sobre `dios`, `diablo`, `lobo`, `fuego`, `vidrio`, `cerebro`, `nariz`, `lengua`,
`tormenta`, `culo`, `guita`, `luz`, `carne` y `sangre`. Todas las apariciones que revisé
son letra cantada genuina — nada de divisores de sección, tracklists ni jerga de guitarra
mezclada. No hago la misma afirmación sobre `amor`, `ojo`, `corazón`, `perro`, `gato`: son
palabras tan comunes que no tiene sentido temer que su conteo salga de un encabezado de
cifra, y son además los dos ejemplos que el propio encargo usa como canónicos.

### 1.5 Lo que no incluí y podría sumarse después

La tabla original tiene más candidatas limpias sin usar (`mundo`, `noche`, `flor`, `sueño`,
`silencio`, `soledad`, `miedo`...). Con 20 `listo` ya estoy en el piso alto del rango
15-25 que pide el encargo, así que no fuerzo más por ahora. Si el juego necesita más
variedad en una vuelta futura, esas son las siguientes candidatas a auditar con el mismo
método.

---

## 1'. `datos[]`: los 35 números a mano de la banda

### 1'.1 Los conteos, contra el piso de `US-10`/`BR-32`

| Familia | `listo` | Piso (`PRD-mas-o-menos.md`) |
|---|---|---|
| `la-banda` | **14** | ≥ 4 |
| `la-gente` | **12** | ≥ 4 |
| `los-recitales` | **9** | ≥ 4 |
| **Total** | **35** | ≥ 20, apuntando a 25–35 |

Los IDs son correlativos por familia: `MM-01`..`MM-14` (`la-banda`), `MM-15`..`MM-26`
(`la-gente`), `MM-27`..`MM-35` (`los-recitales`).

### 1'.2 El método: qué filas de `INV-100` entraron y cuáles no

Partí de las seis exclusiones que ya deja escritas la "Nota del hilo principal al pegar"
de `INV-100` (setlist.fm derivado, `N-044`, `N-049`, las trampas `N-050`..`N-053`, lo que
ya está en `RES-20`, estadios y ley) y sumé cuatro criterios propios:

1. **Nada que ya derive `los-discos`/`lo-que-dura`.** `N-008` (año de *Gulp!*) y `N-010`
   (año de *Oktubre*) parecían candidatas obvias para `la-banda`, pero el año de **cada
   disco** ya lo deriva la familia `los-discos` desde `RES-20` (`leerDiscos()`) — cargarlas
   a mano habría sido el mismo número en dos lugares, justo lo que `D-13`/`BR-32` punto 3
   prohíbe. Las descarté por esto, no por falta de interés.
2. **Nada que sea una fecha completa, solo años/cantidades.** `N-009` ("23 de agosto de
   1985") no entra en ninguna `escala` del modelo (`anio`, `entero`, `segundos`): no es un
   año solo ni una cantidad simple. La descarté en vez de forzarla a un formato que no le
   corresponde.
3. **Estimaciones con nombre, no rangos.** `N-020`/`N-090` (asistentes al último recital)
   traen una discrepancia real de prensa: 40.000, 45.000 o 50.000, sin una fuente que
   zanje. En vez de descartar el dato entero o promediar (inventar un número que nadie dio),
   lo cargué con `firmeza: "segun"` y `segun: "Infobae"` — la cifra que efectivamente cita
   esa fuente, rotulada como lo que es. Es exactamente el mecanismo que `BR-32` punto 1
   habilita para este caso.
4. **`N-022` con la formulación que pidió el encargo.** "¿Cuántos años pasaron entre el
   Lozanazo (1977) y la separación oficial de la banda (2001)?" nombra los dos años adentro
   de la propia pregunta — nadie puede confundir "cuántos años tocaron juntos" con una
   cuenta ambigua, cumple el pedido puntual de la segunda vuelta.

**Filas de `RES-100`–`RES-105` que evalué y no usé**, más allá de las seis exclusiones ya
dadas por buenas:

| Fila(s) | Por qué no |
|---|---|
| `N-003` | Firmeza `leyenda` explícita en la propia tabla — `BR-32` punto 1 la prohíbe como respuesta. |
| `N-004` | Gira puntual de menor peso frente al resto de `anio-show`/`la-banda` — curé por calidad, no por agotar la tabla. |
| `N-009` | Fecha completa, no encaja en ninguna `escala` (ver 1'.2.2). |
| `N-014` | Cota ("más de 70.000", "como mínimo") — `CTR-20.2` (c) la excluye explícitamente. Ajustado en la tercera vuelta (`1'.5`); reemplazada por `N-006` en `anio-show`. |
| `N-023`, `N-025`, `N-047`, `N-075`, `N-077`–`N-079`, `N-081`, `N-083` | Buenas y sin problema, pero recortadas para no inflar `la-banda` mucho más allá de las otras dos familias — quedan como candidatas de una próxima vuelta si el juego necesita más volumen (`Docs/IDS.md` deja `RES-106`..`RES-139` libres). |
| `N-032` | "Unos 15 (aprox.)" sin nombre de fuente que lo diga — no es un `hecho` limpio ni un `según X` con nombre real (es la propia ficha calificando su propio número). Preferí no forzarlo a ninguna de las dos casillas. |
| `N-042`–`N-043`, `N-045`–`N-046` | Buenas parejas comparables (edad en el lanzamiento de *Gulp!*, edad de ingreso), recortadas por el mismo motivo de volumen que arriba — quedan anotadas para una vuelta futura. |
| `N-085`–`N-089` | Capacidad de estadios: no son números "de la banda" sino de un edificio; la nota de `INV-100` pide que si se usan, la pregunta diga de qué son. Preferí no forzar ninguno para no diluir el foco del pozo en algo que no es la banda. |
| `N-104`–`N-107` (el libro del Indio) | Buenas, pero las dejé afuera de esta vuelta por el mismo criterio de volumen — la próxima candidata natural si `la-gente` necesita más. |
| `N-108`, `N-109` | Números de la Ley 11.723 (compases y palabras citables sin permiso): no son un dato "de la banda", son de la ley de derechos de autor que usa `CNT-01`. Fuera de tema para este juego. |
| `N-111` (discos de La Cofradía) | Buena, recortada por volumen — la Cofradía ya está representada por `MM-08`/`MM-09`. |

**Las tres exclusiones de `CNT-04`/`CNT-06`, confirmadas de nuevo acá:** `N-049` (edad de
Rocambole al despedir al Indio) no entró, ni ningún número derivado de Bulacio, Olavarría o
la muerte del Indio — ninguna fila de `INV-100` los trae, así que no hubo nada que
descartar puntualmente ahí más allá de lo que la propia nota ya excluyó.

### 1'.3 Los `medida` compartidos (para que el juego arme pares)

| `medida` | Familia | Sujetos |
|---|---|---|
| `anio-nacimiento` | `la-gente` | el Indio Solari, Skay Beilinson, Semilla Bucciarelli, Sergio Dawi, Walter Sidotti, la Negra Poli |
| `edad-lozanazo` | `la-gente` | el Indio Solari, Skay Beilinson |
| `anio-show` | `los-recitales` | Pan Caliente, Cemento con Luca Prodan, el show en Montevideo, el debut en Obras, el último recital |
| `asistentes-recital` | `los-recitales` | Huracán dic. 1994, Tandil 1997, River abr. 2000 |

El resto de los 35 —sobre todo en `la-banda`, y el dato `segun` de `los-recitales`— tiene
`medida` propia (el mismo `id`): son hechos de un tipo cada uno, o —en el caso del
`segun`— no pueden compartir medida por regla (`CTR-20.2`, ver 1'.5). No fuerzo una medida
compartida donde no hay una segunda cosa real para comparar — el modelo ya contempla que
la mayoría de los pasos sean de clase "número", no "par".

### 1'.4 `Walter Sidotti` y la fuente más floja del lote

`N-037` es, según la propia "Sin resolver" de `INV-100`, el único de los seis integrantes
sin artículo propio de Wikipedia. No lo descarté: no hay ninguna cifra en disputa (nadie da
otro año), solo una fuente de menor jerarquía. Lo cargué como `hecho` con `notaInterna`
explicando el matiz — `D-14` dice que el conocimiento verificado por cruce vale igual, y acá
no hay ni siquiera una leyenda de por medio, solo una fuente más floja que las otras cinco.

### 1'.5 Ajuste contra `CTR-20` (tercera vuelta)

`arquitectura` cerró el contrato con reglas más duras que las que usé al armar `datos[]`
en la segunda vuelta, y el build ya las hace cumplir. Dos correcciones sobre el archivo
real:

1. **`MM-35` (el dato `según Infobae`) pasó a medida propia, sin `sujeto`.** `CTR-20.2`:
   *"Un `segun` va con medida propia"* — su valor solo puede verse como respuesta
   revelada, con la fuente al lado; si fuera la referencia de un par, el jugador vería el
   número sin el rótulo "según", y una estimación de prensa se leería como un hecho. Salió
   de la medida compartida `asistentes-recital` (que ahora tiene 3 miembros, no 4) y quedó
   con `medida: "MM-35"`. Su `pregunta` ahora nombra a la fuente adentro, tal cual pide
   `i6`: *"¿Cuántas personas fueron al último recital de la banda, **según Infobae**?"* — y
   cambié `fuente` de `RES-05` a **`RES-100`**, siguiendo al pie de la letra el ejemplo
   normativo de `CTR-20.2` (que es exactamente este mismo dato, con `id: "MM-997"`).
2. **Salió `N-014` (Huracán, noviembre de 1993, 70.000) del pozo entero.** `CTR-20.2` (c) y
   `CTR-20.4` lo nombran de punta a punta: es una **cota** ("más de 70.000", "como
   mínimo"), y una cota no es una respuesta — con una referencia de 72.000 el juego diría
   "menos" y el número real podría ser 75.000. No tiene reemplazo por otro dato de Huracán
   (el de diciembre de 1994, `MM-32`, es una cifra exacta "por noche" y se queda). Lo
   reemplacé con **`N-006`** (el festival Pan Caliente, 1982), que no estaba en la segunda
   vuelta por recorte de volumen — entra ahora a `anio-show` como `MM-27`, y mantiene el
   total de `los-recitales` en 9.

El total no cambió: siguen siendo **35** (14/12/9), y el piso de `US-10`/`BR-32` sigue
sobrado en las tres familias.

### 1'.6 Dos correcciones de `REV-16` (cuarta vuelta)

`revisor` encontró dos preguntas que le podían marcar error a quien se sabe el tema —
exactamente lo único estricto del proyecto (`CLAUDE.md`). Las dos quedan arregladas en
`src/data/mas-o-menos.json`:

- **`FIND-80` (ALTA), `MM-01`.** Decía *"¿En qué año arrancó la banda, **tocando** por
  primera vez en La Plata?"*. `RES-05` no sostiene eso: su tabla dice *"1976 | Origen en
  La Plata"*, sin ninguna mención a un show — la primera presentación real es el Lozanazo
  de 1977, que ya es `MM-02`. La pregunta vieja le hacía decir a la fuente algo que no dice,
  y encima competía con `MM-02` por "la primera vez que tocaron". **Reformulada:** *"¿En
  qué año fue el origen de la banda en La Plata?"* — pregunta solo lo que `RES-05`
  sostiene, sin "tocando" y sin mencionar a La Cofradía (que hubiera regalado la respuesta,
  al estar a un paso de `MM-08`/`MM-09`). El `valor` (1976) y la `fuente` (`RES-05`) no
  cambian.
- **`FIND-81` (ALTA), `MM-23`.** Decía *"¿Cuántos años se llevan el Indio Solari y Skay
  Beilinson?"* con `valor: 3`. `N-039` de `INV-100` es una resta de años de nacimiento
  (1952 − 1949), pero "cuántos años se llevan" pregunta por la diferencia de **edad**, que
  con las fechas reales (17-mar-1949, 15-ene-1952) da 2 o 3 según qué día del año sea — un
  dato que depende de una tercera variable (el día en que se juega) no puede ser una
  respuesta fija. **Reformulada, no retirada** (la familia ya estaba sobrada, 12 sobre un
  piso de 4, así que no hacía falta bajar el número): *"¿Cuántos años hay entre el año en
  que nació el Indio Solari y el año en que nació Skay Beilinson?"* — pregunta por la resta
  de años de calendario, que es exactamente lo que `N-039` mide y lo que el `valor: 3` sigue
  siendo cierto. Sin ambigüedad de fecha posible.

Las dos correcciones son solo de `pregunta`: `valor`, `escala`, `medida`, `fuente` y
`estado` quedan iguales en los dos datos.

---

## 2. El texto de `src/lib/mas-o-menos/copy.ts`

**Segunda vuelta: esta sección ya no propone una forma — confirma o corrige la que el
hilo principal ya escribió** en el archivo real (`PLANTILLAS: Plantillas`, calzando contra
la interfaz de `src/lib/mas-o-menos/datos.ts`). Lo que sigue es una transcripción fiel de
`src/lib/mas-o-menos/copy.ts` tal como está hoy, con los cuatro ajustes del encargo
resueltos y un pedido de borrado puntual (ver "Notas" al pie). Pasé cada campo contra
`.claude/rules/voz-ricotera.md` §8 a mano, campo por campo. No puedo correrlo (`D-12`): el
comando de verificación real queda en la sección 4.

```ts
/**
 * El texto de "Más o menos" (`US-10`).
 *
 * Lo escribió `contenido` en `CNT-25` y el hilo principal lo transcribe acá. Lo audita
 * `voz.test.ts`, que entra con el juego y no después (la lección de `dos-ejes`: un módulo
 * que llega tarde al barrido pasa un tiempo pareciendo auditado sin estarlo).
 *
 * La mecánica: una pregunta con respuesta de número y una referencia de la misma unidad.
 * El jugador dice si la respuesta real es más o menos (para años: antes o después) que la
 * referencia. Se juega hasta el primer error (`D-48`).
 */

import type { Familia, Tramo } from './partida.ts';
import type { Plantillas } from './datos.ts';

export const PANTALLA_0 = {
  /** Fijo: es la mecánica dicha en rioplatense (`D-48`). */
  titulo: 'Más o menos',
  /**
   * Regla de las dos líneas: el título ya nombra el juego, así que el subtítulo es el que
   * canta. Primera frase, ocho palabras: "Tirás una ficha y no sabés cuál sale."
   */
  subtitulo:
    'Tirás una ficha y no sabés cuál sale. Un número contra otro: decís más o menos, ' +
    'y seguís hasta la primera que erres.',
  /** Registro 3: de dónde salen los números, seco y corto. */
  fuentes: 'Los números salen de fichas de investigación, del cancionero del sitio y de setlist.fm.',
  boton: 'Jugá',
  /**
   * Lo que dice la portada cuando alguien llega por el desafío de un amigo.
   *
   * `total` es la cantidad de preguntas del pozo (`ADR-02`, forma `marcador`, campo `t`),
   * no un máximo teórico: mismo criterio que `por-la-letra/copy.ts`.
   */
  desafio: (puntaje: number, total: number, nombre?: string) =>
    nombre
      ? `${nombre} llegó a una racha de ${puntaje}. ¿La superás?`
      : `Te desafiaron con una racha de ${puntaje}. ¿La superás?`,
} as const;
// `total` queda en la firma por si otro rol lo necesita (mismo molde que `por-la-letra`),
// pero la racha es abierta — no hay un "de T" que leer como en un quiz de largo fijo — así
// que `UX-34` §3.1 la ilustra sin nombrar el total, y sigo ese ejemplo tal cual.

export type RotuloBoton = 'Más' | 'Menos' | 'Antes' | 'Después';

export const PARTIDA = {
  mas: 'Más',
  menos: 'Menos',
  antes: 'Antes',
  despues: 'Después',
  /**
   * El nombre accesible del botón: "Más que 12 años", "Antes de 1990".
   *
   * `antes`/`después` van con "de"; `más`/`menos` van con "que" — son las dos
   * construcciones que existen en castellano para esto, y no se puede resolver con un solo
   * conector.
   */
  nombreBoton: (boton: RotuloBoton, referenciaTexto: string): string =>
    `${boton} ${boton === 'Antes' || boton === 'Después' ? 'de' : 'que'} ${referenciaTexto}`,
  /** La racha en curso, chica y siempre a la vista. */
  racha: (n: number) => `Racha: ${n}`,
  /** El único grito del sitio es el acierto (`D-33`). */
  acierto: '¡La diste!',
  /** No dice "mal" ni "perdiste": el texto acompaña, no marca. */
  error: 'Ahí se cortó la racha.',
  seguir: 'Seguí',
} as const;

/** El nombre corto de cada familia: el sello neutro de la cabecera (`UX-34` §3.2). */
export const FAMILIAS: Readonly<Record<Familia, string>> = {
  'la-banda': 'LA BANDA',
  'la-gente': 'LA GENTE',
  'los-recitales': 'LOS RECITALES',
  'los-discos': 'LOS DISCOS',
  'lo-que-dura': 'LO QUE DURA',
  'en-vivo': 'EN VIVO',
  'las-palabras': 'LAS PALABRAS',
};

/** Los tres encabezados del resultado, según la racha (0–2, 3–7, 8+). Registro 1. */
export const TRAMOS = {
  bajo: 'Tirás la carta y cruzás los dedos.',
  medio: 'Le vas agarrando la mano.',
  alto: 'Se lo cantás de memoria.',
} as const;

export const RESULTADO = {
  rotulo: 'Se terminó.',
  /**
   * El rótulo SIN número de la cifra grande (`.cifra-rotulo` + `.cifra-numero`, ajuste 3
   * del encargo). El número lo pone el motor con `RESULTADO.racha` sobre la misma clave de
   * dato que ya usa `PARTIDA.racha`.
   */
  rotuloRacha: 'Tu racha',
  /** `localStorage`, clave `arcade.mas-o-menos.mejor` (`D-48`). */
  mejor: (n: number) => `Tu mejor racha: ${n}`,
  /** El encabezado de la pregunta que cortó la racha. */
  teCorto: 'Te cortó acá',
  /** El disparador del desplegable de temas, solo si el dato era una palabra. */
  enCuales: 'En qué temas aparece',
  /** Qué formas se contaron, cuando el dato era una palabra. */
  contamos: (formas: readonly string[]) => `Contamos: ${formas.join(', ')}.`,
  /** Cuando se acaban las preguntas del pozo sin errar ninguna. */
  victoria: 'No quedan preguntas. Te las sabés todas.',
  compartir: 'Compartí',
  deNuevo: 'Jugá de nuevo',
  volver: 'Volvé al arcade',
  /** `ADR-02`, forma `marcador`: `p` la racha, `t` la cantidad de preguntas del pozo. */
  paraCompartir: (racha: number) =>
    `Llegué a una racha de ${racha} en Más o menos, en el arcade ricotero. ¿La superás?`,
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
} as const;

/** Cómo se dice el número con su unidad, cuidando el singular (`CNT-25`). */
export const UNIDADES = {
  temas: ['tema', 'temas'],
  setlists: ['setlist', 'setlists'],
} as const satisfies Record<string, readonly [string, string]>;

/** Las líneas de fuente (registro 3) de las familias derivadas. */
export const FUENTES = {
  discos: 'RES-20, los tracklists de cada disco.',
  duracion: 'RES-20, la duración de cada tema en el disco.',
  /** El total real cargado en setlist.fm, no un número fijo (256 hoy, `RES-90`). */
  enVivo: (totalSetlists: number) => `Según setlist.fm, sobre ${totalSetlists} setlists cargados.`,
  /** Cuántos de los 105 tienen letra en el cancionero (hoy, 100). */
  palabra: (temasContados: number, total: number) =>
    `Del cancionero del sitio, sobre ${temasContados} de los ${total} temas.`,
  /** Un dato a mano, `hecho`: cita su ficha. */
  hecho: (ficha: string) => `Fuente: ${ficha}.`,
  /** Un dato a mano, `segun`: nombra a quien lo dijo, y la ficha. */
  segun: (quien: string, ficha: string) => `Según ${quien} (${ficha}).`,
} as const;

/**
 * Las plantillas de las familias derivadas, en la forma que pide `datos.ts`.
 *
 * El nombre del disco, del tema o de la palabra va entre comillas latinas, como en el resto
 * del sitio: «Jijiji» (ajuste 2 del encargo). La de `en-vivo` dice "setlists de setlist.fm"
 * — no alcanza con "setlists" solo, porque sin nombrar la fuente nadie entiende de qué se
 * habla (ajuste 2). Ninguna `pregunta` dice "más o menos": eso ya lo dicen los botones.
 */
export const PLANTILLAS: Plantillas = {
  anioDisco: {
    pregunta: (disco) => `¿En qué año salió «${disco}»?`,
    fuente: FUENTES.hecho(FUENTES.discos.replace(/\.$/, '')),
  },
  temasDisco: {
    pregunta: (disco) => `¿Cuántos temas tiene «${disco}»?`,
    fuente: FUENTES.hecho(FUENTES.discos.replace(/\.$/, '')),
    unidad: UNIDADES.temas,
  },
  duracion: {
    pregunta: (tema) => `¿Cuánto dura «${tema}»?`,
    fuente: FUENTES.hecho(FUENTES.duracion.replace(/\.$/, '')),
  },
  enVivo: {
    /** "Figura en" y no "se tocó": son setlists que carga la gente (`D-48`, `RES-90`). */
    pregunta: (tema) => `¿En cuántos setlists de setlist.fm figura «${tema}»?`,
    fuente: FUENTES.enVivo,
    unidad: UNIDADES.setlists,
  },
  palabra: {
    pregunta: (palabra) => `¿En cuántos temas aparece «${palabra}»?`,
    fuente: FUENTES.palabra,
    unidad: UNIDADES.temas,
  },
  fuenteHecho: FUENTES.hecho,
  fuenteSegun: FUENTES.segun,
};
```

### Notas sobre esta segunda vuelta

- **Confirmado, ajuste 2 del encargo:** las preguntas de las cinco familias derivadas ya
  llevan el nombre entre comillas latinas (`«Jijiji»`), y la de `en-vivo` dice "setlists de
  setlist.fm" completo, no "setlists" solo — sin nombrar la fuente, "¿en cuántos setlists
  figura X?" es una pregunta que no se entiende si no jugaste ya un paso de esa familia
  antes. Con el nombre adentro, se entiende sola desde el primer paso.
- **Confirmado, ajuste 3:** `RESULTADO.rotuloRacha: 'Tu racha'` es el rótulo sin número que
  pide la pantalla de resultado (`.cifra-rotulo` + `.cifra-numero`); el número lo pone el
  motor con la racha final, no una función de `contenido`.
- **Confirmado, ajuste 4:** la pantalla de resultado no arma "la referencia era X" ni "la
  respuesta era Y" en prosa — reusa el mismo panel de la partida (caja de referencia +
  número real), así que `RESULTADO` no necesita, y no tiene, `eraReferencia` ni
  `eraRespuesta`.
- **Pedido de borrado puntual, no resuelto por mí:** al revisar el archivo real encontré
  que `src/lib/mas-o-menos/copy.ts` **todavía tiene** `eraReferencia: 'La referencia era'`
  y `eraRespuesta: 'La respuesta real era'` en su `RESULTADO` (dos líneas después de
  `teCorto`), sobrantes de una versión provisoria anterior al ajuste 4 ya acordado. La
  transcripción de arriba **no las incluye** — quedan afuera a propósito. Pido que se
  borren esas dos líneas del archivo real: no las uso en ningún lado y dejarlas es la
  misma clase de deuda que ya se comió el proyecto una vez con `"Link copiado."` (una
  cadena que nadie audita ni usa, escondida en un módulo que sí se audita).
- **`enCuales`/`contamos` quedan bajo `RESULTADO`** (no en un bloque `DETALLE_PALABRA`
  aparte, que fue mi primera idea antes de ver el archivo real): el hilo principal ya las
  puso ahí y funcionalmente da lo mismo, porque son las mismas constantes las que se leen
  en el revelado de cada paso y en el panel reusado del resultado — no hay una segunda
  copia del texto en ningún lado.
- **`FUENTES` separado de `PARTIDA.fuente`... espera, `PARTIDA.fuente` ya no existe.**
  Corrección sobre mi primera entrega: el archivo real no tiene un `PARTIDA.fuente(texto)`
  genérico — `FUENTES.hecho(ficha)` y `FUENTES.segun(quien, ficha)` arman el string
  completo ("Fuente: RES-05." / "Según Infobae (RES-05).") una sola vez, en
  `datos.ts`/`PLANTILLAS`, y lo que llega a la pantalla ya es el texto final. Confirmo esta
  forma: es más simple que la mía y evita el doble prefijo "Fuente: Fuente: ..." que yo
  mismo había señalado como riesgo.
- **`FUENTES` separado de `PLANTILLAS`**: `FUENTES.*` son los textos base (algunos ya
  completos, otros funciones); `PLANTILLAS` es la forma exacta que pide `datos.ts`
  (`Plantillas`), armada a partir de `FUENTES` y `UNIDADES`. No repetí "Fuente: " dentro
  de cada string de `FUENTES` para que no quede "Fuente: Fuente: ...".
- **`totalSetlists` y `temasContados` son parámetros, no números fijos**, a propósito: el
  256 de `RES-89.5` y el 100/105 de `conteo.ts` son números que cambian si `INV-89` se
  actualiza o si el cancionero suma un tema — hardcodearlos acá los deja mintiendo en
  silencio el día que cambien.
- **`UNIDADES` son tuplas `[singular, plural]`, no funciones que arman texto**, a
  propósito: es el mismo formato que `unidad?: [string, string]` en el `Dato` a mano
  (`HILO-para-todos-mas-o-menos-el-modelo.md` §2), así que el motor puede tratar un dato
  derivado y uno a mano con el mismo código de formateo — no hace falta una rama aparte
  para "los que trae `contenido` ya armados en oración" porque ya no existen.
- **No escribí las dos líneas de `aria-live` que pide `UX-34` §3.3/§3.4** ("Acertaste: X.
  Fuente: Y." / "Fallaste. La respuesta real era X. Fuente: Y."): `UX-34` ya las dio
  literales, armables con `PARTIDA.acierto`/`error` + el string de `fuente` que ya trae
  cada dato (armado una vez en `FUENTES.hecho`/`FUENTES.segun`) sin agregar ningún campo
  nuevo — sumar una función acá hubiera sido escribir el mismo texto dos veces con dos
  dueños distintos.
- **No escribí `PANTALLA_SIN_DATOS` ni ningún estado de "todavía no hay nada que jugar"**:
  no está en el encargo y con `datos: []` hoy más 20 palabras, el juego ya tiene con qué
  arrancar apenas lleguen los datos a mano.

---

## 3. Lo que se agrega a `src/lib/sitio/copy.ts` (texto; cableado del hilo principal)

### 3.1 `LUGARES.masOMenos` (`CNT-13`)

Mismo método que `CNT-13`: ocho palabras o menos, segunda persona, una imagen física y
barata, sin repetir el título ni el subtítulo del casete.

```ts
masOMenos: 'Tenés una ficha boca abajo en la mano.',
```

Por qué esta y no otra: el juego es, literalmente, decidir antes de dar vuelta algo. Una
ficha boca abajo en la mano es el objeto físico exacto de ese instante — ni "moneda"
(ya la usa `quiz`), ni ningún verbo de instrucción (eso ya lo hace `PANTALLA_0.boton`).

### 3.2 El casete del portal (`JUEGOS` en `sitio/copy.ts`)

**Corrección, ajuste 1 del encargo:** la bajada de la primera vuelta decía "cuántos
discos", y es justo la trampa que `BR-32` punto 4 prohíbe — el juego **nunca** pregunta
cuántos discos son en total (9 o 10, según se cuente el doble como uno o como dos). La
cambié por "cuántos temas", que sí es una pregunta real de la familia `los-discos`
(`temasDisco.pregunta`, arriba).

```ts
{
  titulo: 'Más o menos',
  baja:
    'Elegís más o menos, sin red. Preguntas de número sobre la banda: cuántos años, ' +
    'cuántos temas, cuánto dura. Hasta que le erres una.',
  variante: /* PENDIENTE — es de `experiencia`, `D-19`. `UX-34` §1 ya propone 'baion' */,
  arte: /* PENDIENTE — es de `experiencia` */,
  href: '/juegos/mas-o-menos/',
  accion: 'JUGÁ',
},
```

Primera frase de la bajada: "Elegís más o menos, sin red." — seis palabras, dentro del
techo de ocho. `variante` y `arte` quedan `PENDIENTE`: no me corresponde elegir con qué
disco viste esta sección (`CNT-13` §0, "no decido... el mapa sección→disco"). `UX-34` §1
ya investigó el tema y propone la clave `'baion'` (*Un baión para el ojo idiota*, el único
de los diez discos que seguía libre) con `accion: 'JUGÁ'` — coincide con lo que yo ya tenía
escrito acá, así que no hace falta tocar nada más que la palabra corregida.

---

## 4. Verificación (no puedo correrla, `D-12`)

```bash
# El banco de palabras contra el corpus real: formas válidas, sin repetidas entre
# palabras, tildes clasificadas, piso de 2+ temas por palabra listo.
node --experimental-strip-types scripts/medir-mas-o-menos.mjs

# Una vez que src/lib/mas-o-menos/copy.ts exista con este contenido, sumarlo a MODULOS en
# src/lib/voz.test.ts (como se sumó `dos-ejes` y `skayboy`) y correr:
node --test src/lib/voz.test.ts

# Y el test propio del conteo, si arquitectura ya lo escribió:
node --test src/lib/mas-o-menos/conteo.test.ts
```

Pido puntualmente que quien corra `voz.test.ts` sume `mas-o-menos/copy.ts` a la lista
`MODULOS` (el censo del propio archivo se cae con el nombre exacto si alguien lo olvida) y
que agregue `PANTALLA_0.titulo` ('Más o menos', 2 palabras) y la bajada del casete del
portal a las listas hardcodeadas de `grandes`/`bajadas` de `voz.test.ts` — el mismo ajuste
que hubo que hacer cuando entraron `dos-ejes` y `ponelos` (`voz.test.ts`, comentarios de
`T-167` y `US-08`).

Sobre `src/data/mas-o-menos.json` puntualmente (`BR-32`/`PRD-mas-o-menos.md`, "Cómo se
prueba cada punto"), pido que se confirme: 35 datos en `estado: "listo"` repartidos
14/12/9 en `la-banda`/`la-gente`/`los-recitales` (piso ≥ 20 total, ≥ 4 por familia); cada
`firmeza` en `["hecho","segun"]` y el único `"segun"` (`MM-35`) con `segun` no vacío;
ningún `id`/`medida` de un dato a mano coincide con `anio-disco`, `temas-disco`,
`duracion`, `en-vivo` ni `palabra` (las medidas que usan las familias derivadas); ninguna
`pregunta`/`explicacion` contiene "Bulacio", "Olavarría" ni nada de edad-al-morir o
cantidad de heridos.

---

## 5. Bloqueos y pendientes

- **`datos[]` ya está cargado — 35 datos, `MM-01`..`MM-35`** (sección 1'). El bloqueo de la
  primera vuelta queda cerrado.
- **Pedido puntual, ver sección 2:** borrar `eraReferencia`/`eraRespuesta` de
  `RESULTADO` en el `src/lib/mas-o-menos/copy.ts` real — quedaron de una versión anterior
  al ajuste 4 del encargo y no los uso en la transcripción de esta vuelta.
- **`variante` y `arte` del casete del portal**: son de `experiencia` (`D-19`, el mapa
  sección→disco). Dejé el texto listo; `UX-34` §1 ya deja propuesta la clave `'baion'`
  (ver sección 3.2), así que lo que falta cablear es código, no texto.
- **El schema exacto de `PLANTILLAS`/`FUENTES`/`UNIDADES`** ya lo fijó `arquitectura` en
  `src/lib/mas-o-menos/datos.ts` (`interface Plantillas`), y esta vuelta confirma que el
  texto real calza con esa forma — no queda ninguna propuesta mía pendiente de ese lado.
- **Candidatas de `INV-100` que quedaron afuera por volumen, no por problema** (tabla de
  la sección 1'.2): `N-023`, `N-025`, `N-032`, `N-042`/`N-043`, `N-045`/`N-046`, `N-047`,
  `N-075`, `N-077`–`N-079`, `N-081`, `N-083`, `N-104`–`N-107`, `N-111`. Si el pozo necesita
  más volumen en una próxima vuelta, son las primeras candidatas — ya evaluadas, ninguna
  descartada por firmeza ni por `BR-32`.
- **Nada de esta pieza necesita ficha `RES-XX` nueva**: los datos verificables que cito
  (`RES-05`, `RES-09`, `RES-20`, `RES-89`..`RES-92`, `RES-100`..`RES-102`) ya existen y los
  uso tal cual están.
