# ORQ — Plan del ciclo 1

- **Fecha:** 2026-08-19 · **Rol dueño:** `orquestador` · **Ciclo:** 1
- **Consume:** `Docs/BRIEF.md`, `ESTADO.md`, `Docs/DECISIONES.md` (`D-05`..`D-10`),
  `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-01`..`US-04`, `BR-01`..`BR-03`), `Docs/ARQ/`
  (`ADR-01`, `ADR-02`, `CTR-01`, `CTR-02`), `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`
  (`RES-01`..`RES-03`), `Docs/CONTENIDO/` (`CNT-01`, `CNT-02`), `Docs/UX/` (`UX-01`..`UX-04`),
  los seis archivos de `Docs/SUGERENCIAS/`.
- **Produce:** `T-01`..`T-14`.
- **Foco del ciclo:** `US-01` (quiz, P0). Cerrar las decisiones chicas de `producto` que
  bloquean el banco, cargar el primer lote real de preguntas, y arrancar `revisor`.

---

## 0. Reglas de este ciclo — leer antes de tomar cualquier tarea

### 0.1 Hay una sesión de `investigador` corriendo en paralelo sobre la banda

Discografía ampliada, cronología, recitales, letras y obra de Rocambole **están cubiertos
o en curso en otra sesión**, que no ve este plan y a la que este plan no ve. Consecuencias,
las tres obligatorias:

1. **Ninguna tarea de este ciclo pide hechos de la banda.** Si una tarea parece
   necesitarlos, está mal cortada o va afuera del ciclo (§4).
2. **`Docs/INVESTIGACION/` es carpeta en disputa.** Ninguna tarea de este ciclo toca
   `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`. Toda ficha nueva va en **archivo nuevo
   con nombre propio**.
3. **Ninguna tarea de este ciclo depende de que esa investigación termine.** Se puede
   cerrar el ciclo entero sin que la sesión paralela entregue una sola línea.

### 0.2 Reserva de numeración `RES-XX` — **`RES-04` a `RES-09` están reservados**

`Docs/IDS.md` fija que los `RES-XX` son correlativos y que un número no se reutiliza nunca.
La sesión paralela va a tomar `RES-04`, `RES-05`, `RES-06`… porque son los siguientes
libres, y no puede consultarnos. Entonces:

> **Toda ficha `RES-XX` que nazca de este ciclo numera desde `RES-10` en adelante.**
> El rango `RES-04`–`RES-09` queda reservado para la sesión paralela de la banda.

Dos `RES-04` distintos escritos por dos sesiones que no se ven rompen la trazabilidad justo
en el prefijo que sostiene el criterio no negociable "ningún dato falso" (`D-09`): una
pregunta del quiz que cite `RES-04` quedaría ambigua para siempre. El campo `fuentes` de
`CTR-02.5` valida `^RES-\d{2}$`, así que `RES-10` entra sin tocar el schema.

Esta regla vale para el ciclo 1. Si conviene asentarla más allá, `Docs/IDS.md` **no es
carpeta de `orquestador`**: va como propuesta (`T-14`) y decide el hilo principal.

### 0.3 Otras reservas de ID, por el mismo motivo (dos tareas, un contador)

| Contador | Reserva | Por qué |
|---|---|---|
| `BR-XX` | `T-01`→`BR-04` · `T-02`→`BR-05` · `T-03`→`BR-06` | Tres tareas de `producto` que podrían correr en cualquier orden. Sin reserva, dos toman "el siguiente libre". |
| `FIND-XX` | `T-11`→`FIND-01`..`FIND-09` · `T-12`→`FIND-10`+ | Dos revisiones, dos archivos, un solo contador de hallazgos. |
| `CNT-XX` | `T-05`→`CNT-03` | Único `CNT-` nuevo del ciclo. |
| `RES-XX` | `T-13`→`RES-10` | Ver §0.2. |

### 0.4 Tamaño de tarea

Cada `T-XX` está cortada para **cerrar entera en ~20 minutos**, o para cortarse a la mitad
sin dejar el repo inconsistente. Es la mitigación directa del **riesgo 1 del brief** ("que
se corte la racha"). Si una tarea te está llevando el doble, no la agrandes: cerrá lo hecho,
anotalo y partila.

---

## 1. Coherencia — huecos encontrados antes de planificar

Corrido sobre las siete carpetas de rol el 2026-08-19.

| # | Hueco | Rol que lo debe | Dónde queda |
|---|---|---|---|
| H-1 | Tres decisiones de `producto` abiertas. La de **cantidad de opciones por pregunta** es la única que bloquea trabajo de este ciclo: `CTR-02.5` fija `minItems/maxItems: 4` como **[VALOR DE TRABAJO]**, y si el banco se carga antes, cambiarlo obliga a rehacer preguntas (`CTR-02`, "Consecuencias"). | `producto` | `T-01`, `T-02`, `T-03` |
| H-2 | `revisor` no produjo nada y hay **seis entregables en disco**. `CLAUDE.md` dice que revisa inmediatamente después de que un rol entrega; nunca se activó. | `revisor` | `T-11`, `T-12` |
| H-3 | **`src/data/_schema/` no tiene dueño declarado.** `CTR-02.5` habla de "una copia en `src/data/_schema/quiz.schema.json`" y de que si se desincroniza manda el documento, pero ni `CLAUDE.md` ni los README dicen quién la escribe: `.claude/rules/codigo-juegos.md` cubre `src/**/*.ts` y `*.astro`, `Docs/CONTENIDO/README.md` reclama `src/data/*.json`. Sin esa copia **no hay verificación corrible** del banco. | `arquitectura` (propuesto acá; lo confirma el hilo principal) | `T-04` + §4 |
| H-4 | Dos de las cuatro categorías del quiz —**historia** y **letras**— no tienen hoy ninguna ficha que las respalde. `RES-02` cubre discos; nada cubre las otras. Son **20 de las 40 preguntas** del piso de `US-01`. | `investigador` — **ya cubierto por la sesión paralela** | §4 (fuera del ciclo) |
| H-5 | `CTR-01.3` tiene la duración del fragmento abierta en 15 s y **nadie tenía tarea de cerrarla**, aunque `RES-03` ya trae el fundamento (8 compases, Art. 10 Ley 11.723). El usuario no puede recortar audio con confianza hasta que cierre. | `contenido` (fija el número) → `arquitectura` (lo asienta) | `T-09`, `T-10` |
| H-6 | `UX-04` se apoya en la descripción del brief, no en referencias fichadas de Rocambole. | `investigador` — **territorio de la sesión paralela** | §4 |
| H-7 | `CTR-03`..`CTR-05` no existen: `US-02`, `US-03` y `US-04` no tienen contrato de datos. Deliberado según `ESTADO.md`. | `arquitectura` | §4 |
| H-8 | **Sugerencia ya atendida y sin marcar:** `Docs/SUGERENCIAS/PRD-para-arquitectura-pasos-reveal-audio.md` pedía mapear los 5 pasos de `BR-02` a segundos, y `CTR-01.9` ya los fija (0,10 / 0,50 / 2,0 / 6,0 / 15,0). No falta trabajo, falta el cierre visible. Observación, no tarea. | — | — |
| H-9 | Igual que H-8 con `Docs/SUGERENCIAS/UX-para-arquitectura-formato-link-resultado.md`: `ADR-02` ya lo resolvió. Observación. | — | — |

### ¿El ciclo entero depende de una decisión sin tomar?

**No.** Verificado punto por punto, porque si lo fuera, el ciclo tendría que ser esa
decisión y nada más:

- `D-07` habilita construir, cargar contenido y jugar en local **sin esperar a nadie**.
- El **fallback de `ADR-01` ya está cerrado** (`ARQ-spotify-integracion.md`, sección
  propia) y `US-02` criterio 3 queda cubierto igual; `ADR-01` abierto no frena construir.
- `CTR-02` está **vigente**, `CNT-02` hecho y `RES-02` hecho: `contenido` tiene los tres
  insumos que necesita para el primer lote.

Matiz que sí hay que respetar: **`T-01` es un gate interno del ciclo.** No es el ciclo, es
su primer paso — cuesta ~10 minutos y no requiere investigación ninguna. Pero mientras no
cierre, `T-06`, `T-07` y `T-08` no arrancan, porque cargar preguntas con un número de
opciones provisorio es exactamente el retrabajo que `CTR-02` avisó.

---

## 2. Tareas

| ID | Rol | Qué | Archivos | Verifica con | Dep. | [P] |
|---|---|---|---|---|---|---|
| T-01 | `producto` | Fijar `BR-04`: cantidad de opciones por pregunta | `Docs/PRODUCTO/PRD-alcance-v1.md` | `grep -n "BR-04" …` devuelve la regla con número explícito y fundamento | — | |
| T-02 | `producto` | Fijar `BR-05`: cortes de puntaje de los tres tramos | `Docs/PRODUCTO/PRD-alcance-v1.md` | `grep -n "BR-05" …` devuelve dos cortes en % que parten 0–100 en tres tramos | — | |
| T-03 | `producto` | Fijar `BR-06`: qué promete la v1 sobre escuchar el tema completo | `Docs/PRODUCTO/PRD-promesa-spotify.md` (nuevo) | El archivo existe, elige **una** de las tres salidas de `ADR-01` y cita la línea de `BRIEF.md` a corregir | — | **[P]** |
| T-04 | `arquitectura` | Bajar el schema normativo de `CTR-02.5` a archivo corrible | `src/data/_schema/quiz.schema.json` (nuevo) | Comando de §3 (T-04) imprime el `$id` y el número de opciones igual a `BR-04` | T-01 | |
| T-05 | `contenido` | `CNT-03`: criterio sobre las dos discrepancias de `RES-02` | `Docs/CONTENIDO/CNT-03-criterios-discografia.md` (nuevo) | El archivo dice, para cada discrepancia, si se puede usar y cómo | — | **[P]** |
| T-06 | `contenido` | Crear `quiz.json` con envoltorio válido y **5** preguntas de `discos` | `src/data/quiz.json` (nuevo) | Validación de §3 (T-06) sale `OK 5` | T-01, T-04, T-05 | |
| T-07 | `contenido` | Sumar **5** preguntas más de `discos` (llega a la cuota de categoría) | `src/data/quiz.json` | Validación sale `OK 10` y el conteo da `discos: 10` | T-06 | |
| T-08 | `contenido` | Sumar **5** preguntas de `mitologia` rotuladas como leyenda | `src/data/quiz.json` | Validación sale `OK 15`; los 5 nuevos con `esLeyenda: true` y `rotuloLeyenda` no vacío | T-06 | |
| T-09 | `contenido` | Cerrar el número de duración del fragmento en la nota de derechos | `Docs/CONTENIDO/CNT-01-nota-derechos.md` (sección A · Cantidad) | La sección A da **un** número en segundos + fundamento, y menciona el máster WAV de `CTR-01.6` | — | **[P]** |
| T-10 | `arquitectura` | Cerrar `CTR-01.3` con el número que fijó `CNT-01` | `Docs/ARQ/ARQ-fragmento-audio.md` | `CTR-01.3` ya no dice "valor de trabajo" ni "número abierto" y cita `CNT-01` | T-09 | |
| T-11 | `revisor` | Revisar `CNT-01` contra el gate `D-07` | `Docs/REVISIONES/REV-01-nota-derechos.md` (nuevo) | El archivo existe, dicta veredicto y cada `FIND-0X` cita criterio + evidencia | T-09 | |
| T-12 | `revisor` | Revisar el lote del quiz contra `CTR-02` y `D-09` | `Docs/REVISIONES/REV-02-lote-quiz.md` (nuevo) | El archivo pega la salida de los dos comandos de §3 y dicta veredicto | T-06, T-07, T-08 | |
| T-13 | `investigador` | `RES-10`: responder `E-07` (usuario free en Argentina, reproducción a demanda) | `Docs/INVESTIGACION/INV-02-spotify-free-argentina.md` (nuevo) | El archivo existe, la ficha se llama `RES-10` y trae URL + fecha de consulta | — | **[P]** |
| T-14 | `orquestador` | Proponer al hilo principal la reserva de rango `RES-04`–`RES-09` | `Docs/SUGERENCIAS/ORQ-para-hilo-principal-numeracion-res.md` (nuevo) | El archivo existe y explica la reserva en ≤ 20 líneas | — | **[P]** |

---

## 3. Las tareas, una por una — cada bloque es autocontenido

> Escritos para que una ráfaga nueva tome **un solo bloque** y arranque sin releer el repo.

### T-01 — `producto` — `BR-04`: cuántas opciones tiene una pregunta · **arranca primero**

- **Requisito:** `US-01` (criterio 1) · cierra el **[VALOR DE TRABAJO]** de `CTR-02.5`.
- **Archivo:** `Docs/PRODUCTO/PRD-alcance-v1.md` — agregar `BR-04` después de `BR-03`.
- **Contexto que ya está decidido:** `CTR-02.5` usa **4** (`minItems`/`maxItems`) porque
  entran en una grilla 2×2 con blancos grandes, que es lo que exige "jugable con el pulgar"
  (`D-09`); cinco obligan a lista flaca o scroll. Es un valor de trabajo de `arquitectura`,
  no una decisión de `producto`: falta que `producto` lo confirme o lo cambie.
- **Qué escribir:** una regla `BR-04` de cinco líneas — el número, a qué juegos aplica
  (`US-01` seguro; decidir si también `US-04`, que también es múltiple choice), y el
  fundamento en una línea.
- **Si el número cambia:** decilo explícito en `BR-04` — obliga a editar `CTR-02.5`
  (`minItems`/`maxItems`) y eso es de `arquitectura`, dejalo pedido en
  `Docs/SUGERENCIAS/PRD-para-arquitectura-*.md`. **No edites `Docs/ARQ/`.**
- **Verifica con:** `grep -n "BR-04" Docs/PRODUCTO/PRD-alcance-v1.md` devuelve la regla con
  un número explícito. Criterio objetivo: nadie tiene que abrir otro archivo para saber
  cuántas opciones lleva una pregunta.
- **Por qué primero:** desbloquea `T-04`, `T-06`, `T-07` y `T-08`, que son la mitad del ciclo.

### T-02 — `producto` — `BR-05`: cortes de puntaje de los tres tramos

- **Requisito:** `UX-01` (pantalla final) y `UX-02` (arte de tramo) lo piden por escrito en
  `Docs/SUGERENCIAS/UX-para-producto-historias-quiz-y-audio.md`, que es **lo único** que
  quedó abierto de esa sugerencia.
- **Archivo:** `Docs/PRODUCTO/PRD-alcance-v1.md` — agregar `BR-05` después de `BR-04`.
- **Qué escribir:** los dos cortes en **% de aciertos** que separan bajo / medio / alto, y
  cómo se redondea sobre una ronda de 8 preguntas (`US-01` criterio 1) para que no queden
  tramos vacíos. Nada más: los títulos de cada tramo son copy de `contenido`, el arte es de
  `experiencia`.
- **Verifica con:** `grep -n "BR-05" Docs/PRODUCTO/PRD-alcance-v1.md` devuelve dos cortes
  que parten 0–100 en tres tramos sin huecos ni solapes, y el resultado de 8/8 y de 0/8 cae
  en un tramo definido.
- **No desbloquea nada de este ciclo** — desbloquea a `experiencia` en el próximo. Va
  igual porque cuesta 10 minutos y es la única deuda viva de `producto` con `UX`.

### T-03 — `producto` — `BR-06`: la promesa de "escuchar el tema completo" · **[P]**

- **Requisito:** `ADR-01`, sección "Lo que esto le manda a `producto`" · toca la definición
  de **"Listo" de la v1** (`BRIEF.md`).
- **Archivo:** `Docs/PRODUCTO/PRD-promesa-spotify.md` (nuevo). **No es un archivo de
  `arquitectura` y no se edita `BRIEF.md`** — el brief lo actualiza el hilo principal.
- **El problema, completo:** `BRIEF.md` promete que al revelar la respuesta "se puede
  escuchar el tema completo vía Spotify". `RES-01` verificó con fuente primaria que
  `preview_url` está restringido para apps nuevas desde el 27-nov-2024 y que el Web
  Playback SDK exige Premium; `D-08` dice que el jugador **no** tiene Premium. Con las
  opciones C y D descartadas, esa promesa probablemente no se cumpla dentro del sitio.
- **Las tres salidas que `ADR-01` deja sobre la mesa, sin elegir ninguna:** (1) reformular a
  "se puede saltar al tema en Spotify"; (2) aceptar un preview dentro del sitio y decirlo
  así; (3) declarar que la escucha completa depende de la sesión del jugador.
- **Se puede decidir hoy:** `ADR-01` dice que la salida (1) "es honesta con cualquiera de
  los dos desenlaces de `E-04` y no depende de `E-07`". **Esta tarea no espera a `T-13`.**
- **Qué escribir:** `BR-06` con la salida elegida, en la redacción exacta que va a ir al
  brief, y la línea de `BRIEF.md` ("Listo de la v1") que hay que reemplazar.
- **Verifica con:** el archivo existe, contiene `BR-06`, elige **una** salida y cita la
  línea del brief a corregir. Lo que no vale: dejar las tres abiertas.

### T-04 — `arquitectura` — el schema de `CTR-02.5`, corrible

- **Requisito:** `CTR-02.5` ("Si una copia en `src/data/_schema/quiz.schema.json` se
  desincroniza de esto, manda esto") · habilita la verificación de `T-06`..`T-08` y `T-12`.
- **Archivo:** `src/data/_schema/quiz.schema.json` (nuevo). Ver **H-3**: esta carpeta no
  tiene dueño declarado; la asigno a `arquitectura` porque el texto normativo es suyo y una
  copia desincronizada es su problema. Si el hilo principal decide otro dueño, cambia el
  dueño de la tarea, no el contenido.
- **Qué hacer:** copiar **tal cual** el bloque JSON de `CTR-02.5`, con el número de opciones
  que haya fijado `BR-04` en `minItems`/`maxItems`. Nada más: no mejorar el schema acá.
- **Verifica con:**
  ```bash
  python -c "import json;s=json.load(open('src/data/_schema/quiz.schema.json',encoding='utf-8'));print(s['\$id'],s['\$defs']['item']['properties']['opciones']['minItems'])"
  ```
  Tiene que imprimir `https://ricotaarcade.local/schema/quiz/1` y el número de `BR-04`.
- **Depende de `T-01`.** Si se copia antes, se copia con el valor provisorio.

### T-05 — `contenido` — `CNT-03`: qué hacer con las discrepancias de `RES-02` · **[P]**

- **Requisito:** `US-01` criterio 3 (veracidad) · `D-09` (ningún dato falso) ·
  `.claude/rules/contenido-json.md`.
- **Archivo:** `Docs/CONTENIDO/CNT-03-criterios-discografia.md` (nuevo).
- **Las dos discrepancias, textuales de `RES-02`:** (a) **sello de *Luzbelito* (1996)** —
  Wikipedia ES y Discogs dicen Del Cielito, Wikipedia EN dice Patricio Rey Discos, dos de
  tres para Del Cielito, **no resuelto**; (b) **conteo total 9 o 10 álbumes**, según si
  *Lobo suelto, cordero atado* cuenta como doble o como dos — hay agregadores que dicen 10
  y listan 9. `RES-02` avisa que una pregunta "¿cuántos discos editaron?" es una trampa con
  dos respuestas defendibles.
- **Qué escribir:** para cada una, una de tres salidas — **no se usa como pregunta**, se usa
  **con el enunciado acotado** (y cuál), o **se usa rotulada**. Más los dos ítems que
  `RES-02` deja como nota y no como discrepancia: la fecha 1993 de *Lobo suelto* (error de
  agregador, usable) y si *Momo Sampler* es álbum de estudio "puro".
- **Lo que esta tarea NO hace:** resolver la discrepancia. Eso necesita web y `contenido` no
  la tiene; además cae en territorio de la sesión paralela (§0.1). Acá se decide **qué se
  puede preguntar con lo que hay**.
- **Verifica con:** el archivo dice, para cada una de las dos discrepancias, si se puede
  usar y cómo. Sin "queda pendiente" — el criterio se toma con la información de hoy.

### T-06 — `contenido` — el archivo del banco y las primeras 5 preguntas

- **Requisito:** `US-01` (piso de 40) · `BR-01` (etiqueta de dificultad) · `CTR-02`.
- **Archivo:** `src/data/quiz.json` (nuevo).
- **Insumos, todos en disco:** `CTR-02` (schema y campos), `CNT-02` (tono: la jerga va en el
  tono, nunca en la barrera), `RES-02` (nueve álbumes con año y sello), `CNT-03` (`T-05`).
- **Qué cargar:** el envoltorio (`contrato: "CTR-02"`, `contratoVersion: 1`,
  `juego: "quiz"`, `actualizado`, `items`) y **5** ítems `QZ-001`..`QZ-005`, todos
  `categoria: "discos"`, todos `estado: "listo"`, todos con `fuentes: ["RES-02"]`,
  `esLeyenda: false`, `us: ["US-01"]`. Mezclá dificultades — el piso pide 10 fáciles sobre
  40 (`CTR-02.6`), así que en un lote de discos conviene 2 fáciles / 2 medias / 1 difícil.
- **Prohibido en este lote:** el sello de *Luzbelito* y el conteo total de álbumes, salvo
  que `CNT-03` los haya habilitado con enunciado acotado. Y **ningún hecho de la banda que
  no esté en `RES-02`** — historia, recitales y letras no tienen ficha todavía (H-4).
- **Verifica con:**
  ```bash
  python -c "import json,jsonschema;d=json.load(open('src/data/quiz.json',encoding='utf-8'));s=json.load(open('src/data/_schema/quiz.schema.json',encoding='utf-8'));jsonschema.validate(d,s);ids=[i['id'] for i in d['items']];assert len(ids)==len(set(ids)),'ids repetidos';print('OK',len(ids))"
  ```
  Tiene que imprimir `OK 5`. (`jsonschema` 4.16 y Python 3.11 ya están instalados.)
- **Se corta limpio a la mitad:** con 3 ítems válidos el archivo valida igual. Guardá y
  seguí en la próxima ráfaga.

### T-07 — `contenido` — 5 preguntas más de `discos`

- **Requisito:** `US-01` (cuota de ≥ 10 por categoría, `CTR-02.6` consulta 2).
- **Archivo:** `src/data/quiz.json` — ítems `QZ-006`..`QZ-010`.
- **Mismas reglas que `T-06`.** Con esto la categoría `discos` queda **completa** contra el
  piso: es la única de las cuatro que se puede cerrar hoy (H-4).
- **Verifica con:** el comando de `T-06` imprime `OK 10`, más el conteo:
  ```bash
  python -c "import json;from collections import Counter;i=[x for x in json.load(open('src/data/quiz.json',encoding='utf-8'))['items'] if x['estado']=='listo'];print(len(i),Counter(x['categoria'] for x in i),Counter(x['dificultad'] for x in i),'sin fuente:',sum(1 for x in i if not x['esLeyenda'] and not x.get('fuentes')))"
  ```
  `discos: 10` y `sin fuente: 0`.

### T-08 — `contenido` — 5 preguntas de `mitologia`, rotuladas como leyenda

- **Requisito:** `US-01` criterio 3 · `D-09` · `.claude/rules/contenido-json.md` ("la
  leyenda se usa, pero rotulada… rotulada es contenido válido").
- **Archivo:** `src/data/quiz.json` — ítems `QZ-011`..`QZ-015`, `categoria: "mitologia"`.
- **Por qué esta categoría y no historia o letras:** es la única que **no necesita ficha**.
  Un ítem con `esLeyenda: true` + `rotuloLeyenda` valida sin `fuentes` (`CTR-02.5`,
  `allOf`), y por definición no compite con lo que traiga la sesión paralela: una leyenda
  rotulada sigue siendo leyenda aunque después llegue una ficha.
- **La línea que no se cruza:** si el ítem afirma un **hecho** (una fecha, un lugar, un
  nombre), no es leyenda y necesita ficha — va `estado: "borrador"` y no cuenta para el
  piso. El rótulo no es un permiso para inventar: es la etiqueta de "esto se cuenta, no
  está probado", y el `rotuloLeyenda` tiene que decirlo con todas las letras.
- **Verifica con:** el comando de `T-06` imprime `OK 15`, y:
  ```bash
  python -c "import json;i=json.load(open('src/data/quiz.json',encoding='utf-8'))['items'];m=[x for x in i if x['categoria']=='mitologia'];print(len(m),all(x['esLeyenda'] and len(x.get('rotuloLeyenda',''))>=10 for x in m))"
  ```
  `5 True`.

### T-09 — `contenido` — cerrar la duración del fragmento · **[P]**

- **Requisito:** `CTR-01.3` (el número abierto) · pedido textual en
  `Docs/SUGERENCIAS/ARQ-para-contenido-duracion-fragmento.md`.
- **Archivo:** `Docs/CONTENIDO/CNT-01-nota-derechos.md`, sección **A · Cantidad**.
- **Lo que `arquitectura` pidió, en tres puntos:** (1) un número; (2) con qué fundamento —
  una fuente, un criterio o "es lo que nos parece prudente" **dicho como tal**, cualquiera
  de los tres sirve, lo que no sirve es un número sin origen; (3) si hay que citar crédito
  junto al fragmento y en qué forma, porque `CTR-01` hoy no reserva campo para eso.
- **Ya tenés el fundamento en disco:** `RES-03` verificó que en Argentina no hay *fair use*
  y que el derecho de cita del Art. 10 de la Ley 11.723 topea la obra musical en **8
  compases**, que a 120 BPM en 4/4 son unos 16 s. El valor de trabajo de 15 s queda por
  debajo. **No hace falta investigación nueva para cerrar este número.**
- **Decí también** que guardar el máster en WAV fuera del repo (`CTR-01.6`) no es opcional:
  es lo único que hace barato bajar la duración después — re-exportar en vez de re-bajar.
- **Verifica con:** la sección A da **un** número en segundos, su fundamento explícito, una
  respuesta sí/no sobre el crédito, y menciona el máster WAV. Sin "a definir".

### T-10 — `arquitectura` — asentar el número en `CTR-01.3`

- **Requisito:** `CTR-01.3` · cierra el último número abierto de `CTR-01`.
- **Archivo:** `Docs/ARQ/ARQ-fragmento-audio.md`, `CTR-01.3` (y `CTR-01.9` si el número
  bajó: la escalera se recalcula con la regla que **ya está escrita ahí** — pasos 1, 2 y 3
  no cambian mientras `M ≥ 4,0 s`, así que es la misma edición, no una decisión nueva).
- **Qué hacer:** reemplazar "valor de trabajo" por el número de `CNT-01`, citando `CNT-01`
  como origen, y sacar la marca de número abierto del encabezado de `CTR-01`.
- **Verifica con:** `grep -n "valor de trabajo\|número abierto" Docs/ARQ/ARQ-fragmento-audio.md`
  no devuelve nada referido a la duración, y `CTR-01.3` cita `CNT-01`.
- **Depende de `T-09`.**

### T-11 — `revisor` — primera revisión: la nota de derechos contra el gate

- **Requisito:** `D-07` (el gate separa construir de publicar) · `D-09` · `CNT-01`.
- **Archivo:** `Docs/REVISIONES/REV-01-nota-derechos.md` (nuevo). Hallazgos **`FIND-01` a
  `FIND-09`** (§0.3). `revisor` es read-only: reporta, el hilo principal pega.
- **Qué verificar, en este orden:** (a) que cada casilla `[ ]` diga **quién** la trae y qué
  falta; (b) que ninguna casilla `[x]` afirme algo **legal** sin ficha `RES-XX` detrás —
  `CNT-01` declara que `[x]` significa "criterio interno definido", no "verificado
  legalmente", y el hallazgo es cualquier lugar donde esa distinción se borre; (c) que las
  cuatro superficies (audio, tapas, letras, nombre) estén cubiertas; (d) que el número de
  duración que dejó `T-09` esté y tenga fundamento.
- **Verifica con:** el archivo existe, dicta veredicto explícito (pasa / no pasa) y cada
  `FIND-0X` cita el criterio incumplido y la evidencia (archivo + sección). Cero
  correcciones: `revisor` reporta, no arregla.
- **Depende de `T-09`** — revisar la nota antes de que cierre su número es revisar una
  versión que ya sabemos incompleta.

### T-12 — `revisor` — el lote del quiz contra el contrato

- **Requisito:** `US-01` (criterios 1 y 3) · `BR-01` · `CTR-02.5` y `CTR-02.6` · `D-09`.
- **Archivo:** `Docs/REVISIONES/REV-02-lote-quiz.md` (nuevo). Hallazgos desde **`FIND-10`**.
- **Qué verificar:** correr los comandos de `T-06`/`T-07`/`T-08` y pegar la salida; después,
  lo que el schema **no puede** ver y `CTR-02.5` deja escrito: `id` únicos, que cada
  `RES-NN` citado exista de verdad en `Docs/INVESTIGACION/`, que cada `US-NN` exista en
  `Docs/PRODUCTO/`, y las cuotas de `CTR-02.6`. Sumale lo que ninguna máquina hace: que el
  ítem cumpla `CNT-02` (jerga en el tono, nunca en la barrera) y `CNT-03`.
- **Contra el piso, esperado:** 15 de 40. **Eso no es un hallazgo**, es el estado del ciclo;
  el hallazgo sería un ítem `listo` sin fuente y sin rótulo.
- **Verifica con:** el archivo pega la salida literal de los dos comandos y dicta veredicto.
- **Depende de `T-06`, `T-07`, `T-08`.**

### T-13 — `investigador` — `RES-10`: `E-07`, reproducción a demanda en Argentina · **[P]**

- **Requisito:** `E-07` de `ADR-01` ("Evidencia requerida") · riesgo 5 del brief.
- **Archivo:** `Docs/INVESTIGACION/INV-02-spotify-free-argentina.md` (**nuevo**).
  **Prohibido tocar `Docs/INVESTIGACION/INV-01-fichas-iniciales.md`** (§0.1). La ficha se
  numera **`RES-10`** (§0.2), no `RES-04`.
- **La pregunta, exacta:** ¿puede un usuario **free** en **Argentina** reproducir un tema
  **a demanda** desde la app móvil de Spotify, o el modo gratuito lo limita a shuffle /
  radio? `ADR-01` la marca como la que más pesa después de `E-04`: descartadas las opciones
  C y D, el deep link es el único camino que queda al tema completo, así que si la respuesta
  es no, **ninguna vía cumple la promesa del brief** tal como está escrita.
- **Requisitos de la ficha:** fecha de consulta explícita (acá pesa más que en ninguna otra:
  una respuesta correcta de 2023 hoy es un dato falso); fuente oficial de Spotify cuando
  exista, y si solo hay reportes de terceros, **decirlo y rotularlo**.
- **Esto es tema Spotify, no tema banda** — por eso entra al ciclo sin pisar la sesión
  paralela. No busques nada de la banda acá.
- **No bloquea a nadie de este ciclo.** `T-03` decide sin esperarla. Cerrar `ADR-01` queda
  afuera (§4) porque además necesita `E-04`, que es prueba empírica del usuario.
- **Verifica con:** el archivo existe, la ficha se llama `RES-10`, y trae URL + fecha de
  consulta o el rótulo de "no verificable con fuente oficial".

### T-14 — `orquestador` — dejar asentada la reserva de numeración · **[P]**

- **Requisito:** `Docs/IDS.md` (correlativos, no se reutiliza) · §0.2 de este plan.
- **Archivo:** `Docs/SUGERENCIAS/ORQ-para-hilo-principal-numeracion-res.md` (nuevo). Es la
  única salida de `Docs/ORQ/` que `orquestador` tiene, y es la que `CLAUDE.md` §3 prevé
  para pedir algo de una carpeta ajena. **No se edita `Docs/IDS.md`.**
- **Qué escribir, en ≤ 20 líneas:** que dos sesiones que no se ven comparten el contador
  `RES-XX`; que este ciclo reservó `RES-04`–`RES-09` para la sesión paralela de la banda y
  numera desde `RES-10`; y la pregunta concreta al hilo principal: si conviene una regla
  permanente de reserva de rango en `Docs/IDS.md` o si alcanza con hacerlo por ciclo.
- **Verifica con:** el archivo existe y responde esa pregunta sin ambigüedad.

---

## 4. Pasada de conflictos — hecha, no mental

Ninguna tarea `[P]` comparte archivo con otra `[P]`, y ninguna `[P]` depende de algo que no
esté cerrado al arrancar el ciclo. Las cinco `[P]` son `T-03`, `T-05`, `T-09`, `T-13` y
`T-14`: cinco archivos distintos, en cinco carpetas distintas, sin dependencias entre sí.
Lo que **perdió** la marca, y por qué:

| Choque | Tareas | Resolución |
|---|---|---|
| Mismo archivo `Docs/PRODUCTO/PRD-alcance-v1.md` | `T-01`, `T-02` | Ninguna lleva `[P]`. Son de la misma sección del mismo archivo y las dos agregan una `BR-XX` al final: en paralelo se pisan. Orden: `T-01` primero, porque desbloquea medio ciclo; `T-02` no desbloquea nada de este ciclo. `T-03` sí queda `[P]` porque escribe en archivo nuevo. |
| Mismo archivo `src/data/quiz.json` | `T-06`, `T-07`, `T-08` | Serializadas, ninguna `[P]`. `CTR-02.1` solo autoriza partir el banco por categoría si se pasa de **150 KB**, y con 15 ítems (~700 bytes c/u) estamos dos órdenes de magnitud abajo: partirlo ahora sería inventar un problema. Orden: `T-06` → `T-07` → `T-08`. |
| Dependencia de valor, no de archivo | `T-01` → `T-04`, `T-06` | `T-04` copia el schema con el número de opciones de `BR-04`, y `T-06` escribe preguntas con esa cantidad de opciones. Si arrancan antes de `T-01`, o se re-copia el schema o se rehacen las preguntas — el retrabajo exacto que `CTR-02` avisó. `T-04` sin `[P]`. |
| Lectura contra escritura del mismo archivo | `T-09` (escribe `CNT-01`) vs `T-11` (lo revisa) | `T-11` va después y sin `[P]`. Revisar la nota antes de que cierre su número abierto es levantar un hallazgo que ya tenía dueño y tarea. |
| Dos tareas colgadas de la misma dependencia | `T-10` y `T-11` (ambas de `T-09`) | Ninguna lleva `[P]`, porque al arrancar el ciclo su dependencia está abierta. **Una vez cerrada `T-09` sí pueden correr juntas**: tocan `Docs/ARQ/ARQ-fragmento-audio.md` y `Docs/REVISIONES/REV-01-nota-derechos.md`, archivos distintos. |
| Contador compartido `FIND-XX` | `T-11`, `T-12` | Archivos distintos, pero un solo contador de hallazgos. Rangos reservados: `T-11` usa `FIND-01`..`FIND-09`, `T-12` arranca en `FIND-10`. Sin la reserva, dos `FIND-01`. |
| Contador compartido `BR-XX` | `T-01`, `T-02`, `T-03` | Reserva fija: `BR-04` / `BR-05` / `BR-06` (§0.3). `T-03` puede ir `[P]` justamente porque su número ya está apartado. |
| Carpeta en disputa con la sesión paralela | `T-13` vs sesión de la banda | Archivo nuevo (`INV-02-…`) y rango `RES-10`+ (§0.2). Con eso, dos sesiones escriben en `Docs/INVESTIGACION/` sin pisarse ni un archivo ni un ID. |
| Cadena más larga del ciclo | `T-01` → `T-04` → `T-06` → `T-07`/`T-08` → `T-12` | Cinco eslabones, ninguno de más de ~20 min. Si una ráfaga corta solo alcanza para uno, el repo queda consistente igual: el schema copiado sin banco es inofensivo, y el banco con 5 ítems valida igual que con 15. |

---

## 5. Qué quedó afuera del ciclo, y por qué

- **Toda la investigación de hechos de la banda** — discografía ampliada, cronología,
  recitales, letras, obra de Rocambole. **Cubierta o en curso en la sesión paralela**
  (§0.1). Pedirla de nuevo acá es pagar dos veces la misma búsqueda y arriesgar dos fichas
  con el mismo hallazgo y numeración incompatible.
- **Las preguntas 5, 6 y 9 de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md`** — de
  las once que bloquean `CNT-01`, estas tres **no son legales, son hechos de la banda**:
  **5** postura pública de Rocambole sobre uso fan de su obra; **6** listado verificado de
  tapas del catálogo (disco → año → tapa); **9** fuente confiable del texto exacto de cada
  letra. Caen enteras en el territorio de la sesión paralela. **Las otras ocho** —marco
  legal, titularidad de derechos y registro de marca— siguen **pendientes de verdad** y no
  las toca nadie más; no entraron a este ciclo por tamaño, no por conflicto, y son el
  candidato número uno de `investigador` para el ciclo 2.
- **Historia y letras del banco del quiz — 20 de las 40 preguntas del piso de `US-01`.**
  No hay ninguna ficha que las respalde (H-4) y `contenido` no tiene `WebSearch`. Salen
  cuando la sesión paralela entregue. Por eso el ciclo cierra en 15 de 40 y eso está bien.
- **Cerrar `ADR-01`.** Necesita `E-04` **y** `E-07`. `E-04` se resuelve mejor con la prueba
  empírica del usuario —abrir `https://open.spotify.com/embed/track/<trackId>` en incógnito
  y con sesión, y anotar si suena entero o corta a los 30 s—, que ya está anotada como tarea
  suya en `ESTADO.md` y **no es de ninguno de los siete roles**. Este ciclo no depende de
  eso: `ADR-01` tiene el fallback cerrado y `T-03` decide la promesa sin esperarlo.
- **`CTR-03`..`CTR-05`** (schemas de `US-02`, `US-03`, `US-04`). `CTR-03` se podría escribir
  hoy, pero **no desbloquearía a nadie en este ciclo**: el audio de `US-02` todavía no
  existe (lo produce el usuario, `D-06`) y el `trackId` que el JSON necesita se obtiene de
  la web, que `contenido` no tiene. Escribir un contrato que nadie va a consumir en el ciclo
  es mover el problema de lugar. Ciclo 2, después de que `CTR-01.3` cierre (`T-10`).
- **Referencias visuales de Rocambole para `UX-04`** (H-6). Obra de Rocambole = sesión
  paralela.
- **Producir fragmentos de audio y conseguir hosting.** Tareas del usuario, no de un rol.
  `T-10` las habilita al cerrar la duración; el recorte en sí no se planifica acá.
- **Marcar como atendidas las sugerencias ya resueltas** (H-8, H-9). Es higiene de
  `Docs/SUGERENCIAS/`, carpeta compartida sin dueño único. Lo ve el hilo principal.

## 6. El riesgo de este ciclo

**El riesgo no es quedarse corto: es cargar quince preguntas y tener que rehacerlas.**

Trece de las catorce tareas son de bajo riesgo. La concentración está en `T-01`: si el
banco se carga antes de que `producto` fije `BR-04`, o `T-04` copia el schema con el valor
provisorio, cada pregunta escrita con cuatro opciones hay que rehacerla si el número
cambia. `CTR-02` lo dice en su sección de consecuencias: *"cambiar de cuatro opciones a otra
cantidad después de tener el banco cargado — el schema cambia en una línea; las preguntas
ya escritas, no"*. Es retrabajo puro, y el retrabajo es lo que corta la racha (riesgo 1 del
brief). **Mitigación: `T-01` primero, siempre, y es la tarea más barata del ciclo.**

Segundo riesgo, más chico y ya mitigado por escrito: que `T-08` (mitología) se convierta en
la puerta por la que entran hechos de la banda sin ficha, disfrazados de leyenda. El rótulo
no es un permiso para inventar. `T-12` lo verifica y `D-09` lo bloquea si pasa.

Tercero, de coordinación: que la sesión paralela entregue en medio del ciclo y alguien
quiera reabrir tareas para aprovechar las fichas nuevas. **No se reabre nada.** Las fichas
nuevas son insumo del ciclo 2 — ahí salen historia y letras, y el banco pasa de 15 a 40.
