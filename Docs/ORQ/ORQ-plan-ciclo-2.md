# ORQ — Plan del ciclo 2

- **Fecha:** 2026-08-19 · **Rol dueño:** `orquestador` · **Ciclo:** 2
- **Consume:** `Docs/BRIEF.md`, `ESTADO.md`, `Docs/DECISIONES.md` (en especial `D-07`,
  `D-09`, **`D-12`**), `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-01`..`US-04`,
  `BR-01`..`BR-06`), `Docs/ARQ/` (`CTR-01`, `CTR-02`, `ADR-01`, `ADR-02`),
  `Docs/INVESTIGACION/` (`RES-01`..`RES-10`, `RES-20`..`RES-24`), `Docs/CONTENIDO/`
  (`CNT-01`..`CNT-03`), `Docs/UX/` (`UX-01`..`UX-04`), `Docs/REVISIONES/`
  (`REV-01`, `REV-02`, `FIND-01`..`FIND-11`), los siete archivos de `Docs/SUGERENCIAS/`.
- **Produce:** `T-15`..`T-27`. El ciclo 1 consumió `T-01`..`T-14`; no se reutiliza un número.
- **Foco del ciclo:** los **dos gates** que se vuelven caros si se deciden tarde, y recién
  después volumen de `US-01`. Meta realista del banco: **30 de 40**, no 40 — ver H-10.

---

## 0. Lo que cambió desde el ciclo 1

Las reglas §0.4 del ciclo 1 (tamaño de tarea: cierra entera en ~20 minutos o se corta
limpio) siguen vigentes tal cual y no las repito. Lo que cambió es esto.

### 0.1 `D-12` — cuatro de los siete roles no pueden correr un comando

`arquitectura`, `contenido`, `experiencia` y `producto` **no tienen herramienta de
ejecución**. En el ciclo 1 esto costó dos idas y vueltas porque las tareas les pedían
correr la verificación de su propio entregable. Consecuencia para el corte, obligatoria:

> **Toda tarea de este plan cuyo criterio de verificación sea un comando dice, en su
> propio bloque, quién lo corre.** O tiene un segundo paso con otro dueño (`T-18`), o
> nombra al ejecutor dentro de la línea de verificación. Ninguna la cierra el rol
> productor solo.

Y al revés, que también importa: hay tareas cuya verificación es **documental** y no
necesita comando (`T-15`, `T-16`, `T-24`, `T-25`, `T-27`). Están marcadas como tales para
que nadie vaya a buscar una terminal que no le hace falta.

### 0.2 La sesión paralela sigue corriendo y cambió de forma

Hay una segunda sesión de `investigador` sobre **hechos de la banda**, ahora en su tercera
tanda. No nos ve y no la vemos. Al momento de escribir esto llevaba consumidos
`RES-20`..`RES-24` y los archivos `INV-20` e **`INV-21`**.

1. **Ninguna tarea de este ciclo le pide hechos de la banda a `investigador`.**
   Discografía, cronología, tracklists, letras, Rocambole y el memoir están cubiertos o en
   curso. Las dos tareas de `investigador` de este ciclo (`T-22`, `T-23`) son **marco legal
   y términos de plataforma**, que no es territorio suyo.
2. **Ninguna tarea depende de que esa sesión entregue.** Las tres tareas de `contenido`
   consumen fichas que **ya están en disco**.
3. **Consumir no es pedir.** `T-20` y `T-21` usan `RES-05`, `RES-07`, `RES-09`, `RES-20`,
   `RES-21` y `RES-22`, que ya existen. Eso está bien y es el punto de haberlas pagado.
4. Si la sesión paralela **corrige** una ficha en medio del ciclo, **no se reabre nada**:
   se anota y lo mira `T-26`. Ya pasó (`RES-22` corrigió `RES-05`) y funcionó.

### 0.3 Reservas de ID de este ciclo — dos tareas nunca comparten contador

| Contador | Reserva | Por qué |
|---|---|---|
| `RES-XX` | `T-22`→`RES-11`,`RES-12` · `T-23`→`RES-13`,`RES-14` · libres `RES-15`..`RES-19` | Rango de esta sesión, fijado en `Docs/IDS.md`. `RES-04`..`RES-09` quemados; `RES-20`..`RES-29` son de la sesión paralela (van por `RES-24`). |
| Archivos `INV-` | `T-22`→`INV-04` · `T-23`→`INV-05` | `INV-01`, `INV-02`, `INV-03`, `INV-20` e `INV-21` están tomados. Ver H-14 y `T-27`. |
| `QZ-NNN` | `T-19`→`QZ-016`..`020` · `T-20`→`QZ-021`..`025` · `T-21`→`QZ-026`..`030` | Tres lotes, un solo archivo y un solo contador. Sin reserva, dos lotes escriben `QZ-016`. |
| `FIND-XX` | `T-26`→**`FIND-12`**+ | `FIND-01`..`FIND-09` los usó `REV-01`; `FIND-10` y `FIND-11`, `REV-02`. |
| `CNT-XX` | `T-15`→`CNT-04` | Único `CNT-` nuevo del ciclo. |
| `CTR-XX` | `T-24`→`CTR-03` | `CTR-04` y `CTR-05` **no se toman** este ciclo (§5). |

---

## 1. Coherencia — huecos encontrados antes de planificar

Corrido sobre las siete carpetas de rol el 2026-08-19, después del cierre del ciclo 1.
Numerados desde `H-10`: `H-1`..`H-9` son del ciclo 1 y no se reutilizan.

| # | Hueco | Rol que lo debe | Dónde queda |
|---|---|---|---|
| **H-10** | **La categoría `letras` —10 de las 40 preguntas del piso de `US-01`— no tiene fuente del texto de los versos.** `RES-23` descartó letras.com con dos motivos verificados (contribución abierta sin respaldo declarado; 149 temas contra los 105 de `RES-20`). El memoir cita versos sueltos dentro de la conversación y no sirve; la fuente correcta es el arte de los discos y nadie la tiene. **Como `US-01` pide mínimo 10 por categoría sobre un piso de 40 = 4×10 exacto, el piso no se puede cerrar hasta que aparezca la fuente.** No es falta de esfuerzo. | fuente: sesión paralela / usuario · alternativa (si la cuota por categoría se sostiene): `producto` | §5 — **fuera del ciclo** |
| **H-11** | **No hay límite editorial fijado sobre las dos muertes reales.** `RES-07` fichó a Walter Bulacio (17 años, 19-abr-1991, caso ante la Corte IDH) y las dos muertes de Olavarría (11-mar-2017). Son hitos de primer orden y son personas con nombre. Con `letras` afuera por H-10, **`historia` deja de ser una de dos opciones y pasa a ser el camino obligado del volumen**, así que el hueco pesa más que ayer. | `contenido` | **`T-15` — gate 1** |
| **H-12** | **`CTR-02` no puede expresar la categoría de fuente que `RES-21` estableció.** El memoir es *testimonio*: el prefacio se titula "Prefacio / advertencia" y declara que es "apenas mi versión", no verdad unívoca. El schema solo tiene el booleano `esLeyenda`, así que un ítem apoyado ahí solo puede declararse hecho verificado (miente por omisión) o leyenda (también falso: es el protagonista contándolo, con nombre y capítulo). Es la fuente **más rica** que tiene `historia`. | `arquitectura` | **`T-16`, `T-17`, `T-18` — gate 2** |
| H-13 | **Quedan 4 ítems `facil` sobre 15.** `FIND-11` bajó dos a `media`, con razón. `US-01` exige 10 fáciles sobre 40, así que los 15 nuevos tienen que aportar **6 fáciles**, y "fácil" después de `FIND-11` significa que el enunciado trae una pista aprovechable adentro. | `contenido` | cuota por lote en `T-19`, `T-20`, `T-21` |
| H-14 | **`Docs/IDS.md` está desactualizado en los nombres de archivo y ya puede provocar una colisión.** Dice "la próxima ficha de la sesión principal es `INV-03`", y `INV-03` existe desde el ciclo 1 (`RES-10`). Tampoco registra que la sesión paralela tomó `INV-21`. Una sesión nueva que lo lea al pie de la letra escribe encima de un archivo. | hilo principal (`Docs/IDS.md` no es de `orquestador`) | `T-27` |
| H-15 | **`UX-04` se apoya en la descripción del brief y las fichas ya llegaron.** `RES-06` (técnica, iconografía, origen de cada tapa, la frase que ordena el criterio) y `RES-22` (tres tapas suben de "reportado" a testimonio) levantaron el bloqueo, y nadie las incorporó. Es el mismo patrón que `FIND-05`: un supuesto que se vuelve hecho por repetición, esta vez en la única carpeta que **nunca** pasó por `revisor`. | `experiencia` | `T-25` |
| H-16 | **Las preguntas legales de fondo siguen sin ficha y son lo único que bloquea publicar** (`D-07`, `REV-01`). No son hechos de la banda, así que entran sin pisar la sesión paralela. | `investigador` | `T-22`, `T-23` (las cuatro que no tocan a la banda ni a su entorno) |
| H-17 | **`CTR-03`..`CTR-05` siguen sin escribir.** `RES-20` completó el insumo de `US-02` (105 temas con duración y autoría); `RES-23` dejó a `US-03` **sin** insumo. Los tres no están en la misma situación y no se planifican igual. | `arquitectura` | `T-24` (solo `CTR-03`); `CTR-04`/`CTR-05` en §5 |
| H-18 | **Sigue abierto si el sitio menciona en algún lado que el Indio murió, y dónde** (`RES-04`). Es copy del sitio, no política del banco: `REV-02` verificó que ningún ítem lo roza y que todo el tiempo verbal referido a él está en pasado. | `contenido` | §5 — no bloquea nada de este ciclo |
| H-19 | `ADR-01` espera `E-04`, que es **prueba empírica del usuario** (abrir el embed en incógnito y con sesión), no tarea de ningún rol. | usuario | §5 |
| H-20 | **Observación, no tarea:** `CNT-01` va a necesitar otra pasada cuando lleguen `RES-11`..`RES-14`. Hoy está al día contra las fichas que existen (`REV-01` cerrado), así que abrir la tarea ahora sería revisar contra un insumo que todavía no llegó. | `contenido`, ciclo 3 | §5 |

### ¿El ciclo entero depende de una decisión sin tomar?

**Sí de dos, y no del todo.** La respuesta corta es que los dos gates van primero; la
larga importa, porque de ella sale qué se puede hacer mientras están abiertos:

- **Gate 1 (`T-15`, límite editorial) bloquea 10 de las 15 preguntas nuevas** — las dos
  tandas de `historia`. No bloquea mitología, ni las fichas legales, ni `CTR-03`, ni
  `UX-04`.
- **Gate 2 (`T-16`..`T-18`, el testimonio en `CTR-02`) bloquea 5 de las 15** — la tanda
  apoyada en el memoir. La tanda de `historia` sobre hechos verificados (`RES-05`,
  `RES-07`, `RES-09`) **no lo necesita**, y por eso está cortada aparte.
- Sumados, **bloquean dos tercios del volumen del ciclo y ningún otro frente.**

Van primero igual, y la razón es la del ciclo 1 con `T-01`: **cuestan poco y se vuelven
caros si se deciden tarde.** Escribir diez preguntas de `historia` antes de `CNT-04` es
escribirlas para revisarlas; escribir cinco sobre el memoir antes de `CTR-02` v2 es
elegir entre mentir por omisión o rehacerlas. Es retrabajo puro, que es lo que corta la
racha (riesgo 1 del brief).

**Y hay una tercera decisión que no bloquea este ciclo pero sí el cierre del piso: H-10.**
Conviene decirlo con todas las letras antes de que alguien lea "30 de 40" como que faltó
empuje: **el piso de `US-01` no es alcanzable con lo que hay en disco**, y no lo va a ser
por escribir más rápido. Falta una fuente.

---

## 2. Tareas

| ID | Rol | Qué | Archivos | Verifica con | Dep. | [P] |
|---|---|---|---|---|---|---|
| T-15 | `contenido` | `CNT-04`: límite editorial sobre las dos muertes reales | `Docs/CONTENIDO/CNT-04-limite-editorial-muertes.md` (nuevo) | Documental: cada caso con una salida elegida + un ejemplo que cumple y uno que no | — | |
| T-16 | `arquitectura` | `CTR-02` v2: la tercera categoría de fuente (testimonio), **aditiva** | `Docs/ARQ/ARQ-schema-quiz.md` | Documental: `CTR-02.5` trae el bloque JSON completo listo para pegar | — | **[P]** |
| T-17 | `arquitectura` | Bajar el bloque nuevo a la copia corrible | `src/data/_schema/quiz.schema.json` | `T-18` (no lo corre `arquitectura`, `D-12`) | T-16 | |
| T-18 | **hilo principal** | Cerrar el gate 2: el banco vigente valida **sin editarlo** | ninguno (corre y pega la salida) | Comandos §3 (1) y (2): pasan sobre los ítems que ya existen | T-17 | |
| T-19 | `contenido` | 5 preguntas de `mitologia` (`QZ-016`..`020`), cuota 10/10 | `src/data/quiz.json` | Comandos (1) y (2) → `OK 20`, `mitologia: 10`, `sin fuente: 0` — **los corre el hilo principal** | — | **[P]** |
| T-20 | `contenido` | 5 de `historia` sobre **hechos verificados** (`QZ-021`..`025`) | `src/data/quiz.json` | Comandos (1)(2)(3) → `OK 25`, `historia: 5` — **los corre el hilo principal** | T-15, T-19 | |
| T-21 | `contenido` | 5 de `historia` sobre el memoir, como **testimonio rotulado** (`QZ-026`..`030`) | `src/data/quiz.json` | Comandos (1)(2)(3) → `OK 30`, `historia: 10`, y los 5 con el rótulo de testimonio — **hilo principal** | T-15, T-18, T-20 | |
| T-22 | `investigador` | `RES-11`, `RES-12`: derechos del **audio** (preguntas 1 y 2 de `CNT-01`) | `Docs/INVESTIGACION/INV-04-derechos-audio.md` (nuevo) | Cada ficha con URL + fecha, o el rótulo "no verificable con fuente oficial" | — | **[P]** |
| T-23 | `investigador` | `RES-13`, `RES-14`: **tapas y cita de versos** (preguntas 4 y 7) | `Docs/INVESTIGACION/INV-05-derechos-tapas-y-cita.md` (nuevo) | Ídem `T-22` | — | **[P]** |
| T-24 | `arquitectura` | `CTR-03`: contrato de datos de `US-02` (adivinar el tema) | `Docs/ARQ/ARQ-schema-adivinar-tema.md` (nuevo) | Documental: expresa los 5 pasos de `BR-02` y los campos de `CTR-01.8` | — | **[P]** |
| T-25 | `experiencia` | Actualizar `UX-04` contra `RES-06` y `RES-22` | `Docs/UX/UX-04-sistema-visual.md` | Documental: cada afirmación cita ficha **o** se marca como criterio propio | — | **[P]** |
| T-26 | `revisor` | `REV-03`: revisar los 15 ítems nuevos | `Docs/REVISIONES/REV-03-lote-quiz-2.md` (nuevo) | Pega la salida literal de los tres comandos y dicta veredicto | T-19, T-20, T-21 | |
| T-27 | `orquestador` | Avisar al hilo principal que los nombres `INV-` ya colisionan | `Docs/SUGERENCIAS/ORQ-para-hilo-principal-nombres-inv.md` (nuevo) | El archivo existe y hace una sola pregunta concreta | — | **[P]** |

**Los tres comandos**, que se repiten en varias tareas y viven acá una sola vez:

```bash
# (1) valida e ids únicos
python -c "import json,jsonschema;d=json.load(open('src/data/quiz.json',encoding='utf-8'));s=json.load(open('src/data/_schema/quiz.schema.json',encoding='utf-8'));jsonschema.validate(d,s);ids=[i['id'] for i in d['items']];assert len(ids)==len(set(ids)),'ids repetidos';print('OK',len(ids))"
# (2) cuotas de CTR-02.6
python -c "import json;from collections import Counter;i=[x for x in json.load(open('src/data/quiz.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print(len(i),Counter(x['categoria'] for x in i),Counter(x['dificultad'] for x in i),'sin fuente:',sum(1 for x in i if not x['esLeyenda'] and not x.get('fuentes')))"
# (3) techos de longitud — es el que rompió el ciclo 1 (D-12)
python -c "import json;i=json.load(open('src/data/quiz.json',encoding='utf-8'))['items'];print('enunciado',max(len(x['enunciado']) for x in i),'/180 | opcion',max(len(o['texto']) for x in i for o in x['opciones']),'/60 | explicacion',max(len(x['explicacion']) for x in i),'/400')"
```

Estado al arrancar el ciclo, medido: `OK 15` · `discos 10, mitologia 5` ·
`facil 4, media 8, dificil 3` · `sin fuente: 0` · `enunciado 163/180`.

---

## 3. Las tareas, una por una — cada bloque es autocontenido

> Escritos para que una ráfaga nueva tome **un solo bloque** y arranque sin releer el repo.

### T-15 — `contenido` — `CNT-04`: el límite editorial sobre las dos muertes · **arranca primero**

- **Requisito:** `US-01` criterio 3 · `D-09` (ningún dato falso, sin muro de entrada) ·
  pedido textual en `Docs/SUGERENCIAS/INV-para-producto-y-contenido-muerte-indio.md`,
  punto 2: *"conviene decidir la regla antes de escribir preguntas, no después de tener
  cuarenta y tener que revisarlas"*.
- **Archivo:** `Docs/CONTENIDO/CNT-04-limite-editorial-muertes.md` (nuevo). No edites
  `CNT-02` ni `CNT-03`: la guía de tono y los criterios de discografía están cerrados.
- **Los dos casos, textuales de `RES-07`** (`Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md`,
  sección "Las dos muertes que no son anécdota"): **Walter Bulacio**, 17 años, detenido el
  19 de abril de 1991 en un operativo en las inmediaciones del Estadio Obras, muerto días
  después; el caso llegó a la **Corte Interamericana de Derechos Humanos**. Y las **dos
  muertes de Olavarría**, 11 de marzo de 2017, en el predio "La Colmena".
- **Por qué ahora y no en el ciclo 3:** con `letras` fuera del ciclo (H-10), `historia` es
  el **único** camino que queda para el volumen, y el capítulo 14 del memoir se llama
  *"Walter David Bulacio"* (`RES-21`). El material más rico de la categoría pasa por acá.
- **Qué escribir:** para cada uno de los dos casos, **una** de tres salidas — (a) no se usa
  en el banco; (b) se usa con el enunciado acotado, y decís cuál; (c) se usa como contexto
  dentro de la `explicacion` pero nunca como la respuesta que se adivina. Más **una regla
  general** que sirva para un tercer caso sin volver a decidir, y **un enunciado de ejemplo
  que cumple y uno que no** — que es lo que `contenido` va a mirar mientras escribe.
- **Lo que esta tarea NO hace:** decidir si el sitio menciona la muerte del Indio. Eso es
  copy del sitio, no política del banco, y va afuera del ciclo (§5, H-18).
- **Verifica con:** **verificación documental, sin comando.** `D-12` no aplica: no hay nada
  que ejecutar, así que `contenido` la cierra sola. Criterio: el archivo da, para cada
  caso, una salida elegida y el par de ejemplos. Sin "queda pendiente" — se decide con la
  información de hoy, que es toda la que va a haber.
- **Por qué primero:** desbloquea `T-20` y `T-21`, que son 10 de las 15 preguntas del ciclo.
  Cuesta menos que cualquiera de ellas.

### T-16 — `arquitectura` — `CTR-02` v2: el testimonio · **[P]** · gate 2

- **Requisito:** `RES-21` (`Docs/INVESTIGACION/INV-20-fuentes-primarias.md`) · `US-01`
  criterio 3 · `D-09`.
- **Archivo:** `Docs/ARQ/ARQ-schema-quiz.md` — `CTR-02.3` (tabla de campos), `CTR-02.4`
  (las reglas que el schema hace cumplir solo), `CTR-02.5` (el bloque JSON) y `CTR-02.6`
  si las cuotas se tocan.
- **El problema, completo.** `RES-21` estableció que *Recuerdos que mienten un poco* es
  **testimonio**: el prefacio se titula "Prefacio / advertencia" y el Indio dice ahí que el
  libro es **apenas su versión** y que **no puede interpretarse como verdad unívoca e
  incontrastable**. Hoy `CTR-02` solo ofrece `esLeyenda: true|false`. Un ítem apoyado en el
  memoir tiene que declararse hecho verificado —y miente por omisión, porque el propio
  libro dice que no lo es— o leyenda —y también es falso: es el protagonista contándolo,
  con nombre, capítulo y página. **No es ninguna de las dos, y es la fuente más rica que
  tiene `historia`.**
- **El diseño del campo es tuyo. Las restricciones son del plan, y son cinco:**
  1. **Aditiva.** Los 15 ítems vigentes tienen que seguir validando **sin editarlos**. Es
     el criterio de cierre del gate, y lo verifica `T-18`.
  2. **El rótulo es obligatorio cuando la categoría es testimonio**, con la misma forma que
     `rotuloLeyenda`: tiene que decir **quién lo cuenta y dónde**.
  3. **El testimonio no exime de citar ficha.** `CTR-02.6` consulta 6 —ítems `listo` con
     `esLeyenda: false` y `fuentes` vacía: **0**— tiene que seguir dando 0.
  4. **No bumpees `contratoVersion` por tu cuenta.** Hoy el schema lo fija `const: 1` y
     `src/data/quiz.json` dice 1: subirlo a 2 rompe la restricción 1 y obliga a editar un
     archivo que es de `contenido`. Si concluís que hace falta, **dejalo escrito en
     `CTR-02` y avisá** — sale una tarea más que este plan no reservó, y prefiero el aviso
     antes que el gate roto.
  5. **Escribí en una línea cómo se formula el enunciado**, porque es lo que `contenido` va
     a copiar. `RES-21` ya dejó la regla: *"¿qué contó el Indio en sus memorias sobre…?"*
     es verificable y honesto; *"¿qué pasó en…?"* apoyado solo en el libro, no.
- **Verifica con:** **documental.** La tabla de campos nombra la tercera categoría, dice
  cuándo el rótulo es obligatorio, y `CTR-02.5` queda con el bloque JSON completo, listo
  para pegar sin pensar. **No intentes correr nada: no tenés herramienta de ejecución
  (`D-12`), y eso no es una limitación tuya, es el diseño.** El comando lo corre `T-18`.

### T-17 — `arquitectura` — la copia corrible del schema v2

- **Requisito:** `CTR-02.5` ("si una copia en `src/data/_schema/quiz.schema.json` se
  desincroniza de esto, manda esto").
- **Archivo:** `src/data/_schema/quiz.schema.json` (existe, se reemplaza).
- **Qué hacer:** copiar **tal cual** el bloque de `CTR-02.5`. Nada más. Si al copiar ves
  que algo no cierra, **no lo arregles acá**: se arregla en `CTR-02` y se vuelve a copiar,
  porque el documento manda sobre la copia y una copia "mejorada" es una copia
  desincronizada con otro nombre.
- **Verifica con:** `T-18`. Esta tarea no se cierra sola (`D-12`).
- **Depende de `T-16`.**

### T-18 — **hilo principal** — cerrar el gate 2 · el paso que `D-12` hace obligatorio

- **Requisito:** `D-12` ("una tarea cuyo criterio de verificación sea un comando no la
  cierra el rol productor solo") · restricción 1 de `T-16`.
- **Archivo:** ninguno. Se corre y se pega la salida donde el hilo principal consolide
  (`ESTADO.md`).
- **Qué correr:** los comandos **(1)** y **(2)** de §2, sin tocar `src/data/quiz.json`.
- **Criterio de cierre, y leelo con cuidado:** lo que se verifica **no es el número de
  ítems** —va a ser 15 o 20 según si `T-19` ya entregó— sino que **ninguno de los ítems que
  ya existían haya tenido que editarse** para pasar el schema nuevo. Si para que valide hay
  que tocar aunque sea un ítem, el cambio no era aditivo y el gate **no** está cerrado.
- **Si falla, no lo arregles.** Es hallazgo para `arquitectura` (`T-16`/`T-17`), y mientras
  tanto `T-21` no arranca. Arreglar el JSON del banco para que pase un schema roto es
  exactamente el movimiento que `D-12` existe para impedir.
- **Por qué el hilo principal y no `revisor`:** `D-12` manda al hilo principal cuando no hay
  una tarea de revisión abierta sobre la pieza. La revisión del ciclo es `T-26` y llega
  después; poner el gate detrás de ella serializaría todo el volumen.
- **Depende de `T-17`.**

### T-19 — `contenido` — 5 preguntas de `mitologia`, y la cuota queda en 10/10 · **[P]**

- **Requisito:** `US-01` (mínimo 10 por categoría) · `BR-01` · `CTR-02.6` ·
  `.claude/rules/contenido-json.md`.
- **Archivo:** `src/data/quiz.json` — ítems **`QZ-016`..`QZ-020`**, `categoria: "mitologia"`.
- **Insumos, los dos en disco:** `RES-08` (mitología rotulada, en `INV-02`) y `RES-22` (en
  `INV-20`), que la confirma y corrige el punto de Patricio Rey.
- **Mezcla obligatoria: 3 fáciles / 1 media / 1 difícil.** Hoy hay 4 fáciles sobre 15 y el
  piso pide 10 sobre 40 (H-13). Mitología es la categoría que más se presta: son las
  historias que cualquiera escuchó en una previa.
- **Qué cuenta como `facil` después de `FIND-11`:** el enunciado trae **una pista
  aprovechable adentro**. Una fecha exacta o un detalle puntual sin ningún indicio **no es
  fácil** aunque el tema sea archiconocido, y una pista relativa del tipo "un año después
  de…" tampoco sirve si hay que saber el año de referencia.
- **La línea que no se cruza, igual que en el ciclo 1:** si el ítem afirma un **hecho**
  —una fecha, un lugar, un nombre— no es leyenda y necesita ficha. El rótulo no es permiso
  para inventar: es la etiqueta de "esto se cuenta, no está probado", y `rotuloLeyenda`
  tiene que decirlo con todas las letras.
- **Techos que el ciclo 1 rompió en silencio:** enunciado ≤ 180, opción ≤ 60, explicación
  ≤ 400. **Contarlos a mano no cuenta como verificación** (`D-12`, y la evidencia son los
  242 y 277 caracteres de aquella vez).
- **Verifica con:** comandos **(1)** y **(2)** → `OK 20`, `mitologia: 10`, `sin fuente: 0`.
  **Los corre el hilo principal**; la tarea no cierra hasta que la salida esté pegada.
- **Por qué `[P]`:** archivo distinto del de los dos gates, y no depende de ninguno — una
  leyenda rotulada no es testimonio y no roza las dos muertes.
- **Se corta limpio a la mitad:** con 2 ítems válidos el archivo valida igual.

### T-20 — `contenido` — 5 de `historia` sobre hechos verificados

- **Requisito:** `US-01` (mínimo 10 por categoría) · `BR-01` · `CNT-04` (`T-15`) · `D-09`.
- **Archivo:** `src/data/quiz.json` — ítems **`QZ-021`..`QZ-025`**, `categoria: "historia"`,
  `esLeyenda: false`, `fuentes` no vacía.
- **Insumos, todos en disco y ninguno del memoir:** `RES-05` (formación, origen del nombre,
  debut en Obras el 2-dic-1989, Huracán en el 93 y el 94, separación en 2001), `RES-07`
  (misa ricotera, aguante, autogestión, el circuito de La Cofradía de la Flor Solar),
  `RES-09` (Erks S.A. constituida en 1992; catálogo completo en Spotify desde el
  28-jul-2017), `RES-20` cuando el hecho sea histórico y no discográfico.
- **Cruzá `RES-05` contra `RES-22` antes de usar un dato.** `RES-22` **corrigió** `RES-05`
  en el punto de Patricio Rey: el personaje es un invento, pero Rocambole declaró que
  existía y vivía en Salta, y el Indio no lo desmiente. Si el hecho que ibas a usar es uno
  de los corregidos, usás la versión corregida o no lo usás.
- **Prohibido en este lote:** cualquier cosa que `CNT-04` no habilite, y **cualquier dato
  que solo esté en el memoir** — ese es `T-21` y necesita el rótulo que todavía no existe.
  Y `letras`: no hay fuente del texto de los versos (`RES-23`, H-10).
- **Mezcla: 2 fáciles / 2 medias / 1 difícil**, con el criterio de `facil` de `T-19`.
- **Verifica con:** comandos **(1)(2)(3)** → `OK 25`, `historia: 5`, `sin fuente: 0`,
  enunciado ≤ 180. **Los corre el hilo principal.**
- **Depende de `T-15`** (el gate) **y de `T-19`** (mismo archivo, ver §4).

### T-21 — `contenido` — 5 de `historia` desde el memoir, como testimonio rotulado

- **Requisito:** `US-01` · `RES-21` · `CNT-04` · la regla de formulación que fijó `T-16`.
- **Archivo:** `src/data/quiz.json` — ítems **`QZ-026`..`QZ-030`**, `categoria: "historia"`.
- **Insumo:** el PDF en `Docs/INVESTIGACION/Recuerdos que mienten un poco -- Indio Solari.pdf`,
  con el **mapa de los 27 capítulos de `RES-21`** para no releer 863 páginas. Formato
  entrevista: pregunta en un tipo de letra, respuesta del Indio en otro.
- **La regla que es la razón de ser del gate 2:** el enunciado pregunta **qué contó el
  Indio**, no qué pasó. *"¿Qué contó el Indio en sus memorias sobre…?"* es verificable y
  honesto. *"¿Qué pasó en…?"* apoyado solo en este libro, no lo es — por decisión explícita
  del autor, que escribió el prefacio para decir exactamente eso.
- **Rótulo obligatorio con capítulo**, en la forma que haya fijado `CTR-02` v2. Un ítem de
  testimonio sin rótulo es peor que no tenerlo: es un hecho no verificado con apariencia de
  verificado.
- **Ojo con el capítulo 14, "Walter David Bulacio":** cae adentro de `CNT-04`. Si `CNT-04`
  lo veda, no entra **ni como testimonio** — el rótulo resuelve la veracidad, no el límite
  editorial, que es otra cosa.
- **Mezcla: 1 fácil / 2 medias / 2 difíciles.** El memoir es material de detalle; es la
  tanda natural para levantar la cuota de `dificil`, que hoy está en 3.
- **Verifica con:** comandos **(1)(2)(3)** → `OK 30`, `historia: 10`. Más el chequeo del
  rótulo, **cuyo comando exacto sale de `CTR-02` una vez cerrada `T-16`** (el campo todavía
  no tiene nombre mientras escribo esto): el criterio es que los 5 lleven la marca de
  testimonio y su rótulo no vacío. **Lo corre el hilo principal**, y lo vuelve a mirar
  `T-26` ítem por ítem.
- **Depende de `T-15`, `T-18` y `T-20`.** Es la única tarea del ciclo con dos cadenas
  colgando; si el ciclo se corta antes, el banco queda en 25 y valida igual.

### T-22 — `investigador` — `RES-11` y `RES-12`: los derechos del audio · **[P]**

- **Requisito:** `D-07` (el gate que bloquea publicar) · `D-06` (riesgo abierto declarado) ·
  `CNT-01` sección A · `REV-01` ("`investigador` sigue debiendo las 8 preguntas legales
  genuinas. Nada de este reporte las reemplaza").
- **Archivo:** `Docs/INVESTIGACION/INV-04-derechos-audio.md` (**nuevo**). No toques
  `INV-01`, `INV-02` ni `INV-03`, y **`INV-20`/`INV-21` son de la otra sesión.**
  Numeración: **`RES-11` y `RES-12`** (§0.3), no `RES-25`.
- **Las dos preguntas, textuales de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`:**
  **(1)** ¿"fragmento corto + sin fines de lucro + con crédito" configura alguna figura de
  uso permitido para audio, y qué duración orientativa es razonable bajo esa figura?
  **(2)** descargar de YouTube con un conversor, ¿agrega un riesgo propio frente a YouTube
  como plataforma, distinto del derecho de autor sobre la canción?
- **Lo que ya está fichado y no hay que volver a buscar:** `RES-03` verificó que en
  Argentina **no hay fair use**, que el derecho de cita del Art. 10 de la Ley 11.723 topea
  la obra musical en **8 compases**, y que los ToS de YouTube **prohíben explícitamente**
  descargar. Lo que falta es el paso siguiente: si esa figura cubre o no este caso.
- **Por qué pesa:** `CNT-01` cerró la duración del fragmento en **10,0 s** con un fundamento
  que mezcla evidencia y precaución propia, y ese número ya está adentro de un contrato
  (`CTR-01.3`). Una ficha acá o lo confirma o lo mueve — y moverlo es barato **solo si el
  usuario guardó el máster en WAV** (`CTR-01.6`).
- **No es un hecho de la banda:** es marco legal y términos de plataforma, así que entra sin
  pisar la sesión paralela. **No busques nada de la banda acá**, y en particular **no
  busques fuente de letras**: la sesión paralela está justo en ese tema (`RES-23`).
- **Verifica con:** el archivo existe, las dos fichas se llaman `RES-11` y `RES-12`, y cada
  una trae **URL + fecha de consulta** o el rótulo explícito de "no verificable con fuente
  oficial". Un **"no hay respuesta clara", rotulado, es un resultado válido**: `RES-23` es
  exactamente eso y le ahorró al proyecto un juego entero mal construido.

### T-23 — `investigador` — `RES-13` y `RES-14`: tapas y cita de versos · **[P]**

- **Requisito:** igual que `T-22` · además `US-03` criterio 3 y `BR-03` (tope de 5 versos) ·
  `US-04` criterio 3.
- **Archivo:** `Docs/INVESTIGACION/INV-05-derechos-tapas-y-cita.md` (nuevo). Fichas
  **`RES-13`** y **`RES-14`**.
- **Las dos preguntas, textuales:** **(4)** ¿baja resolución + crédito + carácter no
  comercial alcanza en la práctica para tapas de discos, o hace falta autorización expresa
  del artista? **(7)** ¿citar unos versos con fines de juego encuadra en algún derecho de
  cita reconocido, y qué cantidad es razonable bajo esa figura?
- **Lo que NO entra, y por qué:** la **5** (postura de Rocambole) ya está respondida por
  `RES-06`. La **6** (listado de tapas por disco) y la **9** (fuente de letras) son hechos
  de la banda — la 6 está parcial por `RES-06`+`RES-22` y la 9 la cerró `RES-23` en
  negativo. La **11** (política del management sobre fan sites) es del **entorno** de la
  banda: territorio de la sesión paralela. **Las cuatro quedan afuera de esta tarea.**
- **Contexto ya fichado:** `RES-06` trae la cita de Rocambole —*"siempre me encantó la
  reproductibilidad del arte, que todos puedan tener acceso a mi obra"*— y `FIND-05` avisó
  que **eso no prueba nada legalmente**. La pregunta 4 es justamente qué falta entre una
  cosa y la otra.
- **Verifica con:** ídem `T-22`.

### T-24 — `arquitectura` — `CTR-03`, el contrato de `US-02` · **[P]** · **la primera que se cae**

- **Requisito:** `US-02` · `BR-02` (5 pasos fijos, 100/80/60/40/20) · `CTR-01` (fragmento
  cerrado: MP3 mono 44,1 kHz 96 kbps, máx **10,0 s**, escalera 0,1 / 0,5 / 2,0 / 5,0 /
  10,0) · `ADR-01` (fallback ya cerrado) · `RES-20` (105 temas con duración y autoría).
- **Archivo:** `Docs/ARQ/ARQ-schema-adivinar-tema.md` (nuevo). Toma el ID **`CTR-03`**.
- **Qué tiene que poder expresar el ítem de `US-02`:** tema y disco; dificultad (`BR-01`);
  el fragmento con su ruta y con `origen` y `fechaCorte` (`CTR-01.8`, para que "de dónde
  salió este audio" sea consultable y no la memoria de alguien, `D-06`); los 5 pasos de
  `BR-02`; el `trackId` de Spotify **opcional**, porque se obtiene de la web y `contenido`
  no la tiene; y las respuestas aceptadas si el input no es múltiple choice — `US-02` deja
  ese mecanismo a `experiencia`, así que el contrato lo prevé sin decidirlo.
- **Lo que NO hace:** la copia corrible en `src/data/_schema/`. Todavía no hay un solo ítem
  de `US-02`; la copia sale cuando exista el primero, y ahí sale la tarea con su comando y
  su ejecutor. **Este contrato se verifica de forma documental, y está bien dicho así.**
- **`CTR-04` (`US-03`) queda afuera a propósito** (§5): `RES-23` dejó ese juego sin insumo,
  y escribir el contrato de un juego cuyo material no existe es mover el problema de lugar.
- **Es la primera tarea que se cae si la ráfaga no alcanza.** No desbloquea a nadie dentro
  del ciclo. Está acá porque es el único contrato cuyos insumos están **completos**, y
  porque el ciclo 1 la difirió a este ciclo por nombre.
- **Verifica con:** documental — el contrato expresa los 5 pasos de `BR-02` sin renumerarlos
  y reserva los campos de `CTR-01.8`.

### T-25 — `experiencia` — `UX-04` contra las fichas que ya llegaron · **[P]**

- **Requisito:** `UX-04` · `D-04` · `RES-06` y `RES-22`. `ESTADO.md` marca el bloqueo de
  `UX-04` como **levantado** desde `RES-06`, y nadie lo aprovechó (H-15).
- **Archivo:** `Docs/UX/UX-04-sistema-visual.md`.
- **Qué hay ahora que no había cuando lo escribiste:** técnica verificada (rodillo,
  serigrafía, aerografía, grabado, collage); iconografía recurrente; el origen de cada tapa
  **con su nivel de confianza**; el premio ACE por *Luzbelito*; y la frase que ordena el
  criterio entero — *"yo no ilustraba la poesía o la música, sino que era una parte
  integrante del mensaje"*. `RES-22` sube además **tres tapas** de "reportado" a testimonio
  y cubre el hueco de *Último bondi*.
- **El hallazgo que hay que no repetir:** `FIND-05` encontró que `CNT-01` afirmaba
  "Rocambole tiene obra registrada" con casilla marcada `[x]` y sin ninguna ficha detrás —
  un supuesto convertido en hecho por repetición. Acá el riesgo es idéntico. **Cada
  afirmación sobre la obra de Rocambole en `UX-04` o cita `RES-06`/`RES-22`, o se marca
  como criterio propio de `experiencia`.** Las dos cosas valen; lo que no vale es
  mezclarlas.
- **Ojo con el dato de contexto:** `RES-06` registra que en **abril de 2026** se estrenó un
  documental. Es contexto actual, **no obra de los 80**, y no es referencia estética.
- **Verifica con:** documental — `UX-04` deja de decir que espera referencias, y no queda
  ninguna afirmación visual sin ficha ni sin marca de criterio propio. Sin comando: `D-12`
  no aplica.

### T-26 — `revisor` — `REV-03`: los 15 ítems nuevos

- **Requisito:** `US-01` criterios 1 y 3 · `BR-01` · `CTR-02` v2 · `CNT-02`, `CNT-03`,
  `CNT-04` · `D-09`.
- **Archivo:** `Docs/REVISIONES/REV-03-lote-quiz-2.md` (nuevo). Hallazgos desde **`FIND-12`**.
  `revisor` es read-only: reporta, el hilo principal pega.
- **Qué verificar, en este orden:**
  1. Correr los tres comandos de §2 y **pegar la salida literal**.
  2. **Lo que ninguna máquina ve: la pertinencia de la cita.** Es lo que encontró
     `FIND-10` — un hecho verdadero con una ficha que no lo hace único. Abrí las fichas.
  3. **Que ningún ítem de `historia` cruce `CNT-04`.**
  4. **Que ningún ítem de testimonio afirme un hecho en tercera persona.** La regla de
     `RES-21`: se pregunta qué contó el Indio, no qué pasó. **Este es el hallazgo que este
     ciclo puede producir y el ciclo 1 no podía.**
  5. Que las etiquetas `facil` traigan pista real dentro del enunciado (`FIND-11`).
  6. `CNT-02`: la jerga va en el tono, nunca en la barrera.
- **Contra el piso, esperado: 30 de 40, con `letras` en 0.** **Eso no es un hallazgo**, es
  el techo del ciclo y su motivo está fichado (`RES-23`, H-10). El hallazgo sería un ítem de
  testimonio disfrazado de hecho, o un `facil` sin pista.
- **Depende de `T-19`, `T-20` y `T-21`.**

### T-27 — `orquestador` — los nombres de archivo `INV-` ya colisionan · **[P]**

- **Requisito:** `Docs/IDS.md`, sección "Reserva de rangos" · H-14.
- **Archivo:** `Docs/SUGERENCIAS/ORQ-para-hilo-principal-nombres-inv.md` (nuevo). Misma vía
  que `T-14` del ciclo 1, que es la que `CLAUDE.md` §3 prevé para pedir algo de una carpeta
  ajena. **No se edita `Docs/IDS.md`.**
- **Qué decir, en ≤ 20 líneas:** que `Docs/IDS.md` afirma *"la próxima ficha de la sesión
  principal es `INV-03`"* y que **`INV-03` ya existe** desde el ciclo 1 (`RES-10`,
  spotify free en Argentina); que la sesión paralela tomó `INV-20` **e `INV-21`**, que la
  tabla no registra; y que la reserva de rangos funcionó perfecto para los **IDs** y no
  cubre los **nombres de archivo**, que son el otro contador compartido. Propuesta: que la
  tabla liste también los archivos consumidos, y que este ciclo tome `INV-04` e `INV-05`.
- **Verifica con:** el archivo existe, nombra los archivos consumidos y hace **una sola**
  pregunta concreta al hilo principal.

---

## 4. Pasada de conflictos — hecha, no mental

Las siete `[P]` son `T-16`, `T-19`, `T-22`, `T-23`, `T-24`, `T-25` y `T-27`: siete archivos
distintos en cinco carpetas, sin dependencias entre sí. Lo que **perdió** la marca, y por qué:

| Choque | Tareas | Resolución |
|---|---|---|
| Mismo archivo `src/data/quiz.json` | `T-19`, `T-20`, `T-21` | Serializadas. Solo `T-19` lleva `[P]`, y es contra los gates, que viven en otras carpetas. Orden: `T-19` → `T-20` → `T-21`. Con 15 ítems (~700 bytes c/u) partir el banco por categoría sigue estando dos órdenes de magnitud debajo de los 150 KB de `CTR-02.1`. |
| Lectura contra escritura del banco | `T-18` (lee) vs `T-19` (escribe) | `T-18` **no fija el número esperado**: verifica que ningún ítem vigente haya tenido que editarse. Si `T-19` está a medio escribir, se corre después — es un comando de dos segundos, no una tarea alrededor de la cual planificar. |
| Cambio de schema contra banco en curso | `T-16`/`T-17` vs `T-19` | Resuelto por la **restricción 1 de `T-16`**: el cambio es aditivo y opcional. Si dejara de serlo, `T-19` y `T-18` chocan de frente — por eso está escrita como criterio de cierre del gate y no como recomendación, y por eso `T-16` tiene prohibido bumpear `contratoVersion` en silencio. |
| Documento contra copia corrible | `T-16` → `T-17` | Serializadas. `CTR-02.5` manda sobre la copia: si algo no cierra, se arregla en el documento y se vuelve a copiar. |
| Misma carpeta `Docs/ARQ/` | `T-16`/`T-17` vs `T-24` | Archivos distintos (`ARQ-schema-quiz.md` contra `ARQ-schema-adivinar-tema.md`) y contadores distintos (`CTR-02` ya existe; `T-24` toma `CTR-03`). `T-24` conserva `[P]`. |
| Dos tareas del mismo rol a la vez | `T-15` y `T-19` (`contenido`) | Las dos `[P]` por archivo, pero si la ráfaga alcanza para una sola va **`T-15`**: es el gate y desbloquea diez preguntas. `[P]` marca que no se pisan, no que haya dos manos. |
| Contador `QZ-` | `T-19`, `T-20`, `T-21` | Reserva fija: `016`–`020` / `021`–`025` / `026`–`030`. Sin reserva, dos lotes escriben `QZ-016`. |
| Contador `RES-` y nombres `INV-` | `T-22`, `T-23` | `RES-11`+`RES-12` / `RES-13`+`RES-14`, archivos `INV-04` / `INV-05`. La sesión paralela va por `RES-20`..`RES-29` (consumió hasta `RES-24`) y por `INV-20`/`INV-21`. |
| Contador `FIND-` | `T-26` | Arranca en `FIND-12`. `FIND-01`..`FIND-11` los consumieron `REV-01` y `REV-02`. |
| Carpeta en disputa con la sesión paralela | `T-22`, `T-23` | Archivos nuevos, rango propio, y **ninguna pide hechos de la banda**: son marco legal y términos de plataforma. La instrucción "no busques fuente de letras" está escrita dentro de `T-22`, que es donde alguien podría tener la tentación. |
| Dependencia de una sesión que no vemos | ninguna | Las tres tareas de `contenido` consumen fichas **ya en disco**. Si llega una corrección en medio del ciclo, no se reabre nada: se anota y lo mira `T-26`. |
| Cadena más larga | `T-16` → `T-17` → `T-18` → `T-21`, y `T-15` → `T-20` → `T-21` | Cuatro eslabones, ninguno de más de ~20 minutos. Si la ráfaga alcanza para uno, el repo queda consistente igual: el schema aditivo sin ítems nuevos es inofensivo, y el banco con 20 o 25 ítems valida igual que con 30. |

---

## 5. Qué quedó afuera del ciclo, y por qué

- **La categoría `letras` entera — 10 de las 40 preguntas del piso.** No hay fuente del
  texto de los versos. `RES-23` evaluó letras.com, el candidato obvio, y lo descartó con
  dos motivos verificados: es **contribución abierta sin respaldo declarado** —una letra de
  ahí es la transcripción de un fan anónimo y no hay forma de saber si tiene un verso
  cambiado— y lista **149 temas contra los 105 reales** de `RES-20`, mezclando al Indio
  solista, a Los Fundamentalistas y a Skay. El modo de falla es el peor posible contra el
  criterio no negociable 1: **si el verso está mal transcripto, el juego le marca error a
  quien se sabe la letra de verdad.** Es el público al que el sitio dice premiar.
- **Buscar otra fuente de letras no es tarea nuestra.** La sesión paralela está en ese tema.
  Queda anotado como **dependencia externa del ciclo 3**, no como `T-XX`.
- **Cerrar el piso de `US-01` (40).** Consecuencia directa de lo anterior: `US-01` pide
  mínimo 10 por categoría sobre 40, que es 4×10 exacto, así que **el piso no se cierra
  escribiendo más `historia`**. O aparece la fuente de letras, o `producto` decide si la
  cuota por categoría se sostiene. **Es una decisión de `producto` y no la tomo yo.**
- **`CTR-04` (`US-03`, completar la letra).** Mismo motivo: el juego no tiene insumo.
  Escribir el contrato de un juego cuyo material no existe es mover el problema de lugar.
  **`CTR-05` (`US-04`)** tampoco: es P1, el primero que se cae (`D-05`), y su superficie es
  la de mayor exposición a derechos.
- **Si el sitio menciona en algún lado que el Indio murió** (H-18, `RES-04`). Dueño:
  `contenido`. No bloquea nada del banco — `REV-02` verificó que ningún ítem lo roza y que
  todo el tiempo verbal referido a él está en pasado. Es copy del sitio y se decide igual de
  barato en el ciclo 3.
- **Cerrar `ADR-01`.** Falta `E-04`, que es **prueba empírica del usuario** (abrir
  `https://open.spotify.com/embed/track/<trackId>` en incógnito y con sesión, y anotar si
  suena entero o corta a los 30 s). No es tarea de ninguno de los siete roles, y el fallback
  ya está cerrado, así que no frena a nadie.
- **La próxima pasada de `CNT-01`** (H-20). Hoy está al día contra las fichas que existen y
  `REV-01` quedó cerrado; abrir la tarea antes de que lleguen `RES-11`..`RES-14` sería
  revisar contra un insumo que no existe. Ciclo 3, después de `T-22` y `T-23`.
- **Las preguntas 5, 6, 9 y 11 de derechos.** La 5 y la 9 están respondidas (`RES-06`,
  `RES-23`); la 6 y la 11 son hechos de la banda o de su entorno — sesión paralela.
- **Revisar `Docs/UX/`.** Es la única carpeta que nunca pasó por `revisor`, y `T-25` la
  actualiza pero no la revisa. Dos revisiones por ciclo fue el techo del ciclo 1 y `T-26` ya
  es la de este. Candidata número uno de `revisor` para el ciclo 3.
- **Producir los fragmentos de audio y conseguir hosting.** Tareas del usuario. `CTR-01`
  está cerrado en 10,0 s y ya se puede recortar; el máster en WAV fuera del repo
  (`CTR-01.6`) **no es opcional** — es lo único que hace barato bajar la duración si
  `RES-11` o `RES-12` la mueven.

---

## 6. El riesgo de este ciclo

**El riesgo del ciclo 1 era rehacer quince preguntas. El de este es peor de ver: que el
rótulo `testimonio` se vuelva un tilde.**

El gate 2 le agrega al banco una tercera casilla, y la casilla nueva es cómoda: el memoir es
la fuente más rica que tiene el proyecto, tiene 863 páginas de material, está en el repo y
no exige buscar nada. La tentación —bajo presión de ráfaga, que es la única presión que hay
acá— es tildar "testimonio" y seguir. Si el rótulo no dice **quién lo cuenta y dónde**, y si
el enunciado no está formulado como *"qué contó el Indio"*, entonces la mitad del volumen
nuevo del ciclo queda apoyada en una fuente que **su propio autor declaró que no es verdad
unívoca**, con apariencia de hecho verificado. Eso es el criterio no negociable 1 rompiéndose
en silencio, que es la única forma en que se rompe.

Y no alcanza con el criterio de quien escribe: `D-12` dejó la evidencia de que la
autoverificación falla incluso cuando el rol tiene buen criterio y buena intención. Por eso
la mitigación está repartida en tres tareas y no en una advertencia: `T-16` restricción 2
hace el rótulo obligatorio y con contenido; `T-21` fija la formulación del enunciado antes de
escribir el primero; `T-26` punto 4 lo audita ítem por ítem, y es un hallazgo que el ciclo 1
no podía producir porque la categoría no existía.

**Segundo riesgo, ya mitigado por diseño:** que el cambio de schema rompa el banco vigente.
Por eso `T-18` es una **tarea** con dueño propio y no una línea de verificación al pie de
`T-17`. Si falla, el gate no cierra y `T-21` no arranca — que es exactamente lo que tiene que
pasar.

**Tercero, y conviene decirlo antes de que parezca un fracaso:** con `letras` afuera,
`historia` es el único camino del volumen, así que **un `CNT-04` restrictivo se paga en
preguntas**. Si `contenido` decide que Bulacio y Olavarría no se usan, el ciclo cierra en 25
de 40 en vez de 30. **Es un resultado legítimo y la decisión es suya.** Prefiero un 25 honesto
que un 30 con dos preguntas sobre un pibe de diecisiete años que haya que sacar después de
publicar — y "después de publicar" es el único momento en que sacar algo no alcanza.
