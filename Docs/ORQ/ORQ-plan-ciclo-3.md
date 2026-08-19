# ORQ — Plan del ciclo 3

- **Fecha:** 2026-08-19 · **Rol dueño:** `orquestador` · **Ciclo:** 3
- **Consume:** `Docs/BRIEF.md` (reescrito — sección **"La postura: molinetes abiertos"**),
  `ESTADO.md`, `Docs/DECISIONES.md` (en especial **`D-14`**, más `D-12`, `D-13`, `D-02`),
  `CLAUDE.md` §6, `Docs/EQUIPO.md` (**dos secciones nuevas**), `Docs/ORQ/ORQ-plan-ciclo-1.md`
  y `ORQ-plan-ciclo-2.md`, `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-01`, `BR-01`..`BR-06`),
  `Docs/ARQ/` (`CTR-01`, `CTR-02`, `CTR-03`, `ADR-01`, `ADR-02`), `Docs/UX/` (`UX-01`..`UX-04`),
  `Docs/CONTENIDO/` (`CNT-01`..`CNT-04`), `Docs/REVISIONES/` (`REV-01`, `REV-02`, `REV-03`),
  `Docs/INVESTIGACION/`, `.claude/rules/codigo-juegos.md`, y el estado real de `src/`.
- **Produce:** `T-28`..`T-43`. El ciclo 1 consumió `T-01`..`T-14`, el ciclo 2 `T-15`..`T-27`.
- **Foco del ciclo:** **el quiz jugable de punta a punta en un celular.** Cero preguntas
  nuevas. Cinco tareas documentales cortas que el código necesita, diez de código, una
  revisión que se corre en vez de leerse.

---

## 0. Lo que cambió desde el ciclo 2

Las reglas de tamaño de tarea del ciclo 1 (§0.4) siguen vigentes tal cual: cada `T-XX`
cierra entera en ~20 minutos o se corta sin dejar el repo inconsistente. Lo que cambió es
esto, y cambia bastante.

### 0.1 `D-14` retiró la mitad de los motivos por los que este ciclo no arrancaba antes

No es un matiz de encuadre: **borra tareas que estaban planificadas y desbloquea otras**.

| Lo que decía el plan anterior | Qué pasa ahora |
|---|---|
| El gate de publicación de `D-07` bloquea publicar hasta cerrar 8 preguntas legales | **No existe más.** Ninguna tarea de este plan espera permiso, y no hay tarea de "cerrar el gate". `CNT-01` pasa de cerrojo a **mapa** (`T-32`) |
| Un dato de la banda necesita ficha `RES-XX` para poder escribirse | **El conocimiento popular es fuente legítima**: se rotula como leyenda y entra. Ninguna tarea manda a `investigador` a verificar algo para poder escribirlo |
| `ADR-01` espera `E-13` (si un deep link es "acceder a la Spotify Platform") | **`E-13` dejó de bloquear.** El propio criterio de cierre de `ADR-01` manda esa rama a "decisión de riesgo que asume el usuario" — y el usuario la asumió el mismo día, para todo el proyecto. Se cierra en `T-31` |
| Lo que sigue estricto | **Que la respuesta correcta sea correcta**, y —agrego— que el rótulo **llegue a la pantalla**. Ver H-24 |

### 0.2 Quién escribe el código: el hilo principal, y por eso diez tareas son suyas

`Docs/EQUIPO.md` sumó la sección **"Quién escribe el código de la aplicación"**. Los cuatro
roles que escriben no tienen herramienta de ejecución, y no se construye software sin
correrlo. Consecuencia directa para el corte:

```
src/data/*.json                   -> contenido     (nadie lo toca este ciclo)
src/data/_schema/                 -> arquitectura  (nadie lo toca este ciclo)
src/ (todo lo demás), package.json, astro.config  -> hilo principal
```

`D-12` no se relaja: sigue valiendo que el que fabrica no se autocertifica. Por eso la
última tarea del ciclo (`T-43`) es de `revisor`, que tiene `Bash` y no escribió una línea
de lo que revisa.

### 0.3 Regla nueva y no negociable: para código, la verificación **corre**

Una tarea de código cuya verificación sea "el archivo dice que hace X" está mal cortada.
Cada tarea de `T-33` a `T-42` cierra con **un comando que se ejecuta**: el build pasa, el
test pasa, el dev server responde, la página contiene lo que tiene que contener. Y su
corolario, que es la mitigación central del riesgo del ciclo (§6):

> **Cada regla de negocio que el código implementa entra como función pura con su test.**
> `BR-01`→`T-35`, `BR-05`→`T-36`, `ADR-02`→`T-37`, contraste de `UX-04`→`T-38`. Una regla
> que no se puede expresar como test es una regla que el código va a interpretar solo.

**Restricción técnica del ciclo, verificada hoy en la máquina:** hay `node v24.14.1`,
`npm 10.8.3`, `git 2.53` y `python 3.11.1`. Node 24 ejecuta `.ts` directo (type stripping),
así que `node --test archivo.test.ts` corre **sin transpilador ni dependencia nueva**. A
cambio, el TypeScript de `src/lib/` no puede usar `enum`, `namespace` ni parámetros de
constructor con modificador. Si algo falla al arrancar, el fallback es
`node --experimental-strip-types --test`.

### 0.4 Reservas de ID — dos tareas nunca comparten contador

| Contador | Reserva de este ciclo |
|---|---|
| `CNT-` | `T-29` → **`CNT-05`**. `T-32` **edita** `CNT-01`, no toma número nuevo |
| `FIND-` | `T-43` arranca en **`FIND-15`**. `FIND-01`..`FIND-14` los consumieron `REV-01`..`REV-03` |
| `QZ-` | **Ninguna tarea escribe `src/data/quiz.json`.** El contador queda en `QZ-030`; el lote de `letras` del ciclo 4 arranca en `QZ-031` |
| `RES-` / `INV-` | **Ninguna tarea de `investigador`.** `RES-15`..`RES-19` siguen libres para esta sesión; `RES-20`+ es de la paralela. Si entrara una ficha nuestra: `RES-15` en archivo **`INV-06`** o mayor |
| `UX-`, `ADR-`, `CTR-`, `D-` | Ningún número nuevo. `T-30` edita `UX-01`, `T-31` cierra `ADR-01`. `CTR-04`/`CTR-05` **no se toman** (§5) |
| `T-` | `T-28`..`T-43` |

**Sesión paralela de investigación:** puede seguir activa y no la vemos. **Ninguna tarea de
este ciclo le pide nada**, y ninguna escribe en `Docs/INVESTIGACION/`. Colisión posible: cero.

---

## 1. Coherencia — huecos encontrados antes de planificar

Corrido sobre las siete carpetas de rol, la raíz y `src/`, el 2026-08-19. Numerados desde
`H-21`: `H-1`..`H-9` son del ciclo 1, `H-10`..`H-20` del ciclo 2.

| # | Hueco | Rol que lo debe | Dónde queda |
|---|---|---|---|
| **H-21** | **Después de dos ciclos no hay una sola línea de código.** No hay `package.json`, no hay Astro, no hay TypeScript. `src/` tiene únicamente `data/`. Y el "Listo" de la v1 son cuatro juegos **jugables en un celular**: hoy hay 30 preguntas validadas, `CTR-02`, `CTR-03`, `ADR-02`, `UX-01`, `UX-02`, `UX-04` y `BR-01`..`BR-07`. **Está todo especificado y nada construido.** `D-14` sacó el último motivo para esperar. | hilo principal (`Docs/EQUIPO.md`, sección nueva) | **es el ciclo entero: `T-33`..`T-42`** |
| **H-22** | **El copy que `UX-01` y `UX-02` delegaron a `contenido` no existe.** Las dos hojas dicen textualmente "texto final de `contenido`" para: título de la Pantalla 0, subtítulo de la variante A, plantilla del desafío de la variante B, micro-copy de acierto, micro-copy de error "que no humilla", los **tres títulos de tramo** de `BR-05`, el texto del tuit prefil y el mensaje de comparación. Son ocho cadenas que el código necesita y **que no son suyas**. Si nadie las escribe, el hilo principal inventa copy dentro de la carpeta de otro rol. | `contenido` | **`T-29` — el único gate del ciclo** |
| **H-23** | **`CNT-01` sigue redactada como cerrojo y contradice al BRIEF.** Línea 21: *"Mientras haya aunque sea una casilla de verificación legal sin marcar (…) el sitio no se publica"*. El BRIEF dice que ese gate no existe (`D-14`) y `ESTADO.md` también. Un lector futuro puede actuar sobre un gate muerto — es el mismo patrón de `FIND-05`, un supuesto que sobrevive por repetición. | `contenido` | `T-32` |
| **H-24** | **El rótulo de leyenda y de testimonio no tiene lugar en ninguna pantalla.** El schema lo hace obligatorio, `REV-03` lo audita ítem por ítem, y `D-14` dice que **la defensa es rotular bien**. Pero `UX-01` se escribió antes de que existiera la categoría y su pantalla de feedback no tiene dónde mostrarlo: 15 de los 30 ítems (10 leyenda + 5 testimonio) llegarían al jugador **con apariencia de hecho verificado**. `US-01` criterio 3 se cumple en el dato y se rompe en la pantalla. | `experiencia` | **`T-30`**, y `T-40` lo renderiza |
| **H-25** | **`ADR-01` quedó en "propuesta" esperando `E-13`, y la pregunta ya no es técnica.** Su propia tabla de criterio de cierre tiene la fila: *"no hay pronunciamiento y no lo va a haber — el desenlace más probable → decisión de riesgo, la asume el usuario"*. `D-14` la asumió para todo el proyecto. El ADR se puede cerrar hoy en la opción B, sin evidencia nueva. | `arquitectura` | `T-31` |
| **H-26** | **El repo no está bajo control de versiones.** `git status` devuelve *"not a git repository"*, y el ciclo que arranca es el primero que escribe código. El `.gitignore` ya existe y ya ignora `node_modules/` y `dist/`: se escribió esperando exactamente esto. Sin git, una ráfaga cortada a la mitad no tiene deshacer — que es el riesgo 1 del brief con otra ropa. | hilo principal / usuario | `T-28` |
| **H-27** | **`UX-04` deja el color en descripción y no en número** (*"el hex final lo fija quien produce el arte"*), y a la vez el checklist de `UX-01` exige contraste alto verificable. Alguien tiene que elegir los valores. No es una falla de `experiencia`: es la frontera donde el sistema visual se vuelve código, y del lado del código no había nadie. | hilo principal, dentro de las descripciones de `UX-04` | `T-38`, con umbral corrible |
| H-28 | **Ningún ítem del banco tiene `spotify.trackId`** (0 de 30). El campo existe en `CTR-02` y nadie lo llena, así que la promesa transversal de `BR-06` —acceso al tema al revelar— **no tiene dónde apoyarse en `US-01`**. No bloquea el quiz: el campo es opcional. | `contenido` + usuario (el `trackId` se copia de la app) | §5 — fuera del ciclo |
| H-29 | **`investigador` se queda sin tarea por primera vez**, y `Docs/EQUIPO.md` fija que si no se invoca al menos una vez por ciclo después de tres ciclos se fusiona en `contenido`. **No propongo fusionarlo**: el cero es consecuencia de `D-14`, que le sacó el papel de cuello de botella a propósito, y `US-02`/`US-04` lo van a volver a necesitar. Lo dejo nombrado porque la cláusula es de `EQUIPO.md` y ese archivo no es mío. | hilo principal | sin tarea |
| H-30 | **`Docs/UX/` sigue siendo la única carpeta que nunca pasó por `revisor`** (heredado del ciclo 2, §5). Sigue afuera, y ahora por un motivo mejor que el tamaño: el turno de `revisor` va al quiz construido, que es lo primero que se puede verificar corriendo algo en vez de leyendo. | `revisor` | §5 |

### ¿El ciclo entero depende de una decisión sin tomar?

**No. Y es la primera vez.** El ciclo 1 dependía de `BR-04`, el ciclo 2 de dos gates. Este
no depende de ninguna decisión pendiente, y conviene decir por qué, porque es lo que
habilita construir: `D-14` cerró el encuadre; `BR-01`, `BR-04`, `BR-05` y `BR-06` están
fijados; `CTR-02` está cerrado y **corriendo** contra 30 ítems; `ADR-02` está aceptado y no
depende de evidencia externa; `UX-01`, `UX-02` y `UX-04` están escritos; y el banco tiene
**30 ítems válidos, 10 de ellos fáciles**, cuando una ronda usa 8. Nada del código de este
ciclo espera que el banco llegue a 40.

Lo único que falta y el código necesita es **copy** (H-22), que no es una decisión trabada
sino un entregable no escrito, y cuesta una tarea corta. Por eso `T-29` va primero.

**Lo que sí es una precondición y no una decisión:** `npm install` necesita alcanzar el
registry una vez. Es la única dependencia externa del ciclo y está en el primer eslabón del
tramo de código. Ver §6.

---

## 2. Tareas

| ID | Rol | Qué | Archivos | Verifica con | Dep. | [P] |
|---|---|---|---|---|---|---|
| T-28 | **hilo principal** | Poner el repo bajo control de versiones, con un commit inicial | `.git/` (nuevo) | `git log --oneline \| wc -l` → 1 · `git status --porcelain` vacío | — | |
| T-29 | `contenido` | `CNT-05`: las ocho cadenas de copy que `UX-01` y `UX-02` le delegaron | `Docs/CONTENIDO/CNT-05-copy-quiz.md` (nuevo) | Documental: una cadena por línea, con destino y largo máximo | — | **[P]** |
| T-30 | `experiencia` | `UX-01` v2: dónde se ve en pantalla el rótulo de leyenda / testimonio | `Docs/UX/UX-01-flujo-quiz.md` | Documental: ubicación, jerarquía y qué pasa con el auto-avance | — | **[P]** |
| T-31 | `arquitectura` | Cerrar `ADR-01` en la opción B (deep link), bajo `D-14` | `Docs/ARQ/ARQ-spotify-integracion.md` | Documental: estado `aceptada`, `E-13` cerrada por decisión y no por evidencia | — | **[P]** |
| T-32 | `contenido` | `CNT-01` v2: de cerrojo a **mapa** de qué se usa y de dónde salió | `Docs/CONTENIDO/CNT-01-nota-derechos.md` | Documental: cero frases de gate; cada superficie con origen y respuesta de una línea | — | **[P]** |
| T-33 | **hilo principal** | Andamiaje Astro + TypeScript que compila | `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` | Comando **(A)** | T-28 | |
| T-34 | **hilo principal** | `banco.ts`: tipos de `CTR-02`, carga y payload de cliente | `src/lib/quiz/banco.ts`, `banco.test.ts` | Comandos **(B)** | T-33 | |
| T-35 | **hilo principal** | El motor de ronda: `BR-01` + `US-01` criterio 1 | `src/lib/quiz/ronda.ts`, `ronda.test.ts` | Comandos **(B)**, 1000 rondas | T-34 | |
| T-36 | **hilo principal** | `tramo()`: los dos cortes de `BR-05` | `src/lib/quiz/tramo.ts`, `tramo.test.ts` | Comandos **(B)**, las 9 filas exactas | T-33 | **[P]** |
| T-37 | **hilo principal** | `desafio.ts`: leer y armar el link de `ADR-02` | `src/lib/desafio.ts`, `desafio.test.ts` | Comandos **(B)**, tabla de válidos e inválidos | T-33 | **[P]** |
| T-38 | **hilo principal** | Tokens visuales de `UX-04` con contraste verificado | `src/styles/tokens.css`, `src/lib/contraste.test.ts` | Comandos **(B)**: ratio WCAG ≥ 4,5:1 calculado | T-33 | **[P]** |
| T-39 | **hilo principal** | Pantalla 0 de `UX-01`: la entrada, un solo tap | `src/pages/index.astro` | **(A)** + **(C)** + greps de §2 | T-29, T-37, T-38 | |
| T-40 | **hilo principal** | La isla de la partida: pregunta, feedback y avance | `src/components/quiz/Partida.astro`, `src/scripts/partida.ts` | **(A)** + greps: 30 ids, 0 `notaInterna`, rótulo presente | T-35, T-39 | |
| T-41 | **hilo principal** | La pantalla de resultado: puntaje, tramo y jugar de nuevo | `src/components/quiz/Resultado.astro`, `src/scripts/resultado.ts` | **(A)** + los tres títulos de tramo aparecen en `dist/` | T-36, T-40 | |
| T-42 | **hilo principal** | El botón COMPARTIR: Web Share API con respaldo de copiar | `src/components/quiz/Compartir.astro`, `src/scripts/compartir.ts` | **(A)** + `navigator.share` y el respaldo presentes en `dist/` | T-37, T-41 | |
| T-43 | `revisor` | `REV-04`: el quiz construido contra `US-01`, `BR-01`, `BR-04`, `BR-05` y los checklists de `UX-01` | `Docs/REVISIONES/REV-04-quiz-construido.md` (nuevo) | Pega la salida literal de (A)(B)(C)(D) y dicta veredicto | T-42 | |

**Los comandos**, que se repiten en varias tareas y viven acá una sola vez:

```bash
# (A) el build pasa y escribe dist/
npm run build && test -f dist/index.html && echo "BUILD OK"

# (B) tipos y lógica pura — runner nativo de Node 24, sin transpilador
npx tsc --noEmit
node --test src/lib/quiz/*.test.ts src/lib/*.test.ts
#   si el type stripping no arranca: node --experimental-strip-types --test <archivo>

# (C) el dev server responde
npm run dev &                                                    # http://localhost:4321
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/  # 200
kill %1

# (D) el banco sigue validando — comando (1) del ciclo 2, sin un cambio
python -c "import json,jsonschema;d=json.load(open('src/data/quiz.json',encoding='utf-8'));s=json.load(open('src/data/_schema/quiz.schema.json',encoding='utf-8'));jsonschema.validate(d,s);ids=[i['id'] for i in d['items']];assert len(ids)==len(set(ids)),'ids repetidos';print('OK',len(ids))"
```

Estado medido al arrancar el ciclo: `OK 30` · `discos 10, mitologia 10, historia 10,
letras 0` · `facil 10, media 13, dificil 7` · `sin fuente: 0` · 10 leyendas y 5 testimonios
· `spotify.trackId`: 0 ítems · `notaInterna`: 0 ítems.

---

## 3. Las tareas, una por una — cada bloque es autocontenido

> Escritos para que una ráfaga nueva tome **un solo bloque** y arranque sin releer el repo.

### T-28 — hilo principal — el repo bajo control de versiones · **arranca primero**

- **Requisito:** H-26 · riesgo 1 del brief (que se corte la racha) · `CLAUDE.md` §6
  ("JSON versionado").
- **Qué hacer:** `git init`, verificar que `.gitignore` ya cubre `node_modules/`, `dist/` y
  `.claude/settings.local.json` (lo cubre), y un commit inicial con lo que hay hoy: la
  documentación de dos ciclos y `src/data/`.
- **Qué NO hacer:** no crear remoto, no configurar hosting, no tocar `.gitignore` salvo que
  falte algo. Nada de esto es alcance de producto.
- **Si el usuario prefiere no versionar todavía**, se saltea y ninguna otra tarea cambia —
  pero entonces cada tarea de código se cierra sin red y conviene saberlo antes, no después.
- **Verifica con:** `git log --oneline | wc -l` → `1`, y `git status --porcelain` vacío.
- **Por qué primero:** después de esta tarea, las diez de código son reversibles con un
  comando. Cuesta dos minutos y es la única que protege a las otras quince.

### T-29 — `contenido` — `CNT-05`: el copy del quiz · **[P]** · **el gate del ciclo**

- **Requisito:** H-22 · `UX-01` (Pantalla 0, feedback, pantalla final) · `UX-02` (tuit
  prefil, mensaje de comparación) · `BR-05` (los tres tramos) · `CNT-02` (guía de tono:
  la jerga va en el tono, nunca en la barrera).
- **Archivo:** `Docs/CONTENIDO/CNT-05-copy-quiz.md` (nuevo). **No** edites `UX-01` ni
  `UX-02`: son de `experiencia`, y lo que falta es el texto, no el flujo.
- **Las cadenas, todas las que el código necesita y ninguna más:**
  1. Título de la Pantalla 0 — una línea, sin explicación debajo.
  2. Subtítulo variante A (link frío) — neutro. **Prohibido un contador inventado**:
     `UX-01` lo veta explícitamente y no hay analítica que lo respalde.
  3. Plantilla del desafío, variante B — con un hueco para el nombre y otro para el
     puntaje, del tipo *"{n} sacó {p}/{t}. ¿Te la bancás?"*.
  4. Texto del botón de arranque y del de jugar de nuevo.
  5. Micro-copy de acierto y micro-copy de error **que no humilla** (`UX-01`).
  6. Los **tres títulos de tramo** de `BR-05` — bajo (0–29%), medio (30–69%), alto
     (70–100%). `producto` fijó los cortes y dejó el título explícitamente a `contenido`.
  7. Texto del tuit prefil (`UX-02`) y mensaje de comparación del desafiado.
  8. **La etiqueta corta que precede al rótulo** de un ítem de leyenda y la de uno de
     testimonio — dos o tres palabras, del tipo *"Esto es leyenda:"* / *"Lo cuenta el
     Indio:"*. Es lo que hace que `D-14` se vea en la pantalla y no solo en el JSON.
- **Cada cadena lleva su largo máximo en caracteres.** El código lo va a respetar y
  `revisor` lo va a medir; sin número, la primera pantalla chica lo rompe. Referencia de
  lo que ya pasó: `D-12`, dos enunciados de 242 y 277 contra un tope de 180.
- **Verifica con:** **documental, sin comando.** Criterio: las ocho entradas presentes, cada
  una con destino (qué pantalla), texto final y largo máximo. Sin "queda pendiente".
- **Por qué gate:** `T-39`, `T-41` y `T-42` la consumen. Si no está, el hilo principal
  escribe copy — que es inventar contenido en la carpeta de otro rol.

### T-30 — `experiencia` — `UX-01` v2: el rótulo en la pantalla · **[P]**

- **Requisito:** H-24 · `D-14` (*"la defensa no es verificar: es rotular bien"*) ·
  `CTR-02.3` (campos `esLeyenda`, `rotuloLeyenda`, `testimonio`) · `REV-03`.
- **Archivo:** `Docs/UX/UX-01-flujo-quiz.md`, sección "Pantallas 1..N — Pregunta", bloque
  de feedback. Es una revisión acotada: **no rediseñes el flujo**, que funciona.
- **El problema, completo.** El banco tiene 30 ítems: **10 rotulados como leyenda y 5 como
  testimonio del Indio**. El schema obliga el rótulo, `revisor` lo auditó ítem por ítem, y
  `D-14` construyó toda su postura encima de él. Pero tu pantalla de feedback muestra verde
  o rojo y auto-avanza en 1,2 / 1,6 s: **el jugador nunca ve que eso era una leyenda.** La
  mitad del banco llega con apariencia de hecho verificado, que es exactamente lo que la
  postura dice que hace quedar mal al jugador.
- **Qué decidir, y es tuyo:** dónde aparece (feedback del ítem, tarjeta aparte, línea bajo
  la respuesta correcta), con qué jerarquía, y **qué pasa con el auto-avance** — si el
  rótulo necesita más segundos, decilo, y decí cuántos. Restricción única del plan: el
  presupuesto total de la partida sigue siendo el de tu propia tabla, 2–3 minutos.
- **Lo que esta tarea NO hace:** escribir el texto de la etiqueta (es `T-29`, `contenido`)
  ni tocar el schema (está cerrado y corriendo).
- **Verifica con:** **documental.** Criterio: la sección dice en qué pantalla aparece el
  rótulo, en qué jerarquía visual, y qué pasa con los 1,2 / 1,6 s. `T-40` lo implementa.

### T-31 — `arquitectura` — cerrar `ADR-01` en la opción B · **[P]**

- **Requisito:** H-25 · `D-14` · tu propia tabla de criterio de cierre, fila *"no hay
  pronunciamiento y no lo va a haber"*.
- **Archivo:** `Docs/ARQ/ARQ-spotify-integracion.md`. Es una revisión 4 corta.
- **El argumento, para que no lo reconstruyas:** la revisión 3 dejó `E-13` como única
  pregunta bloqueante y escribió que, si no hay pronunciamiento —"el desenlace más
  probable", dijiste—, deja de ser pregunta técnica y pasa a ser **decisión de riesgo que
  no es tuya: la asume el usuario**. `D-14` la asumió, para todo el proyecto, el mismo día:
  fan site sin fines de lucro, si llega un reclamo se da de baja. **Tu propia tabla ya
  contiene el desenlace; lo que faltaba era la decisión de riesgo, y está tomada.** Tu
  recomendación marcada para esa rama era B.
- **Qué escribir:** estado de `propuesta` a **aceptada**; `E-13` cerrada **por decisión, no
  por evidencia** (rotulalo así, que no parezca que apareció una fuente); `E-12` (obtener un
  `trackId` sin cuenta de dev) resuelta por la vía barata — se copia el link desde la app,
  observación del proyecto; y **una línea con lo que el código tiene que implementar**
  cuando `US-02` llegue: qué atributo, qué pasa si el campo falta.
- **Lo que NO cambia:** `BR-06` queda tal cual — tu propia tabla dice que la rama B no la
  toca. No abras nada de `producto`.
- **Verifica con:** **documental.** Criterio: el ADR ya no dice "pendiente" en ningún lado y
  `ESTADO.md` puede sacar la última fila "en curso" del tablero.

### T-32 — `contenido` — `CNT-01` v2: de cerrojo a mapa · **[P]**

- **Requisito:** H-23 · `D-14` (*"`CNT-01` sigue existiendo pero cambió de función: ya no es
  un cerrojo, es un mapa de qué se usa y de dónde salió"*) · `REV-01` (cerrado).
- **Archivo:** `Docs/CONTENIDO/CNT-01-nota-derechos.md`. Se reescribe el encuadre, **no se
  tira el contenido**: el inventario de las cuatro superficies es bueno y las fichas
  `RES-03`, `RES-06`, `RES-09`, `RES-11`..`RES-14` están bien citadas.
- **Qué sacar, textual:** el estado "no cierra el gate" (línea 4), el "Recordatorio del
  gate" completo (líneas 21–27, *"mientras haya aunque sea una casilla sin marcar el sitio
  no se publica"*), y el "Resumen para quien audita el gate" del final. **Hoy contradicen al
  BRIEF y a `ESTADO.md`**, y alguien puede actuar sobre un cerrojo que ya no existe.
- **Qué poner en su lugar:** por cada superficie —audio, tapas, letras, marca— tres cosas:
  **qué se usa, de dónde salió, y la respuesta de una línea si alguien pregunta**. El objeto
  de la nota pasa a ser *responder rápido y bien*, no *habilitar*. Las casillas `[ ]` que no
  tienen respuesta se quedan, pero como **zona gris declarada**, no como pendiente que
  bloquea: cuatro fichas la buscaron y las cuatro volvieron con "ninguna fuente lo dice".
- **Sumá una fila que hoy no está:** el **deep link a Spotify** como quinta superficie
  (`ADR-01` opción B, ver `T-31`) y la Developer Policy III.2 de `RES-26`. Es exposición
  real y el mapa tiene que tenerla. Si `T-31` no cerró todavía, escribí "vía B (deep link),
  marcada como valor de trabajo en `ADR-01`" — no la dejes afuera por orden de llegada.
- **Verifica con:** **documental.** Criterio: `grep -in "gate\|no se publica" ` sobre el
  archivo no devuelve ninguna frase que condicione publicar, y cada superficie tiene sus
  tres campos. Lo puede correr quien consolide; leerlo también alcanza.

### T-33 — hilo principal — el andamiaje que compila

- **Requisito:** H-21 · `D-02` (Astro + TypeScript, islas, sin backend) ·
  `.claude/rules/codigo-juegos.md` · restricción de presupuesto: cero costo recurrente.
- **Archivos:** `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`
  (mínimo: un `<h1>` y nada más — la Pantalla 0 real es `T-39`).
- **Qué hacer:** escribir `package.json` **a mano** e instalar con `npm install astro
  typescript`. **No uses `npm create astro`: es interactivo** y no hay quien conteste.
  Scripts mínimos: `dev`, `build`, `preview`. `output: 'static'`, sin adaptador, sin
  integración de framework de UI — las islas de este proyecto son `<script>` de Astro con
  TypeScript, que es lo más liviano y no agrega una dependencia que después hay que mantener.
  `tsconfig.json`: extender `astro/tsconfigs/strict`.
- **Qué NO hacer:** no crear páginas de `US-02`, `US-03` ni `US-04`. Cuatro carpetas vacías
  son deuda con forma de progreso (§6, riesgo 3). No instalar Tailwind, ni un framework de
  test, ni linters: `node --test` viene con Node.
- **Verifica con:** comando **(A)**. Además `npx astro --version` imprime versión.
- **Si `npm install` no alcanza el registry**, esta tarea no cierra y el tramo de código
  queda detrás. No la fuerces con dependencias copiadas a mano: anotalo y avisá. Es el
  único punto de falla externo del ciclo.

### T-34 — hilo principal — `banco.ts`: tipos, carga y payload de cliente

- **Requisito:** `CTR-02` (`Docs/ARQ/ARQ-schema-quiz.md`) · `.claude/rules/codigo-juegos.md`
  ("nada de datos hardcodeados: el contenido viene siempre de `src/data/*.json`").
- **Archivos:** `src/lib/quiz/banco.ts` y `src/lib/quiz/banco.test.ts`.
- **Qué hacer, tres cosas y ninguna más:**
  1. **Tipos** que reflejen `CTR-02.3` — sin `enum` (§0.3): uniones de literales.
  2. **Carga** de `src/data/quiz.json` con validación de invariantes **en tiempo de build**:
     `contrato === "CTR-02"`, `contratoVersion === 1`, exactamente 4 opciones por ítem,
     exactamente una `correcta`, ids únicos, y solo entran los de `estado: "listo"`. Si algo
     falla, **tirá el error y que el build se caiga**: un banco roto no puede llegar callado
     a producción.
  3. **`paraElCliente(items)`**: el payload que se serializa a la página. **Regla dura —
     nada que ninguna pantalla renderice viaja al cliente.** Pasan `id`, `categoria`,
     `dificultad`, `enunciado`, `opciones` y **el rótulo** (`esLeyenda`, `rotuloLeyenda`,
     y de `testimonio` solo lo que `T-30` decida mostrar). **No pasan** `fuentes`, `us`,
     `sensibleA`, `estado`, `explicacion` ni `notaInterna`.
- **Por qué la regla dura importa:** `notaInterna` es un campo de trabajo de `contenido`.
  Hoy hay 0 ítems que lo usen, así que nadie lo notaría hasta el día que alguien lo use y
  se publique una nota interna en el HTML.
- **Verifica con:** comandos **(B)**. El test cubre: carga los 30; rechaza (en memoria) un
  ítem con 3 opciones, uno con 2 correctas, un id duplicado y `contratoVersion: 2`; y el
  payload no contiene **ninguna** de las claves prohibidas.

### T-35 — hilo principal — el motor de ronda (`BR-01`)

- **Requisito:** `BR-01` (escalonamiento sin muro) · `US-01` criterio 1 (ronda de 8, al
  menos 2 de las 4 categorías) · `UX-01` ("jugar de nuevo → set nuevo sorteado del pool").
- **Archivos:** `src/lib/quiz/ronda.ts`, `src/lib/quiz/ronda.test.ts`.
- **Qué hacer:** `armarRonda(items, n = 8)` → un arreglo de 8 ítems tal que **el primero es
  `facil`** y la dificultad **nunca baja** (fácil → media → difícil). Sin repetidos dentro
  de la ronda. Con el pool real —10 fáciles, 13 medias, 7 difíciles, tres categorías— hay
  de sobra; **no hardcodees esos números**, que el banco crece.
- **Qué NO hacer:** no inventes una regla de mezcla de categorías más allá del mínimo de
  `US-01` (al menos 2). Si querés una distribución más linda, es `BR-XX` de `producto`, no
  una decisión del motor.
- **Verifica con:** comandos **(B)**. El test corre **1000 rondas** y afirma en todas: largo
  8, `[0].dificultad === "facil"`, secuencia no decreciente, ids únicos, ≥ 2 categorías. Más
  una: dos rondas seguidas no son idénticas (si lo fueran, el pool de 40 de `US-01` no
  serviría para nada).
- **Depende de `T-34`** (usa el tipo del ítem).

### T-36 — hilo principal — `tramo()`: los cortes de `BR-05` · **[P]**

- **Requisito:** `BR-05` (bajo `0 ≤ x < 30%`, medio `30 ≤ x < 70%`, alto `70 ≤ x ≤ 100%`).
- **Archivos:** `src/lib/quiz/tramo.ts`, `src/lib/quiz/tramo.test.ts`.
- **Qué hacer:** `tramo(aciertos, total)` → `"bajo" | "medio" | "alto"`. Diez líneas.
- **Por qué es una tarea propia y no un `if` adentro de la pantalla:** `BR-05` fijó el corte
  de abajo en **30% y no en 25%** a propósito, para que el que responde al azar caiga
  firmemente en "bajo". Ese es exactamente el tipo de número que alguien "arregla" a 25 seis
  meses después sin saber que vacía la promesa de premiar al que sabe. Con test, no.
- **Verifica con:** comandos **(B)**. El test afirma **las nueve filas exactas** de la tabla
  de `BR-05`: 0→bajo, 1→bajo, 2→bajo, 3→medio, 4→medio, 5→medio, 6→alto, 7→alto, 8→alto
  sobre 8. Más los bordes con otro total (por ejemplo 10) para que el corte sea porcentual
  y no una tabla de 8 disfrazada.

### T-37 — hilo principal — `desafio.ts`: el link de `ADR-02` · **[P]**

- **Requisito:** `ADR-02` (`Docs/ARQ/ARQ-link-resultado-compartido.md`), sus cuatro reglas
  duras · `UX-01` Pantalla 0 variante B · `UX-02` camino de vuelta.
- **Archivos:** `src/lib/desafio.ts`, `src/lib/desafio.test.ts`.
- **Qué hacer:** dos funciones puras. `leerDesafio(search)` → el desafío o `null`, y
  `armarLink(juego, p, t, n?)` → la URL. Las reglas, textuales de `ADR-02`:
  1. **Si algo no valida, se ignora el desafío entero** y se entra como visita normal.
     Nunca un error en pantalla, nunca una pantalla rota por una URL mal copiada.
  2. **`n` es entrada no confiable**: se filtra a letras, números, espacios, guiones y
     apóstrofos, y se renderiza con `textContent`, **nunca** `innerHTML`. Es el único
     agujero de seguridad real que tiene un sitio estático.
  3. La URL entera por debajo de ~100 caracteres.
  4. El puntaje ajeno **no se escribe nunca en `localStorage`**.
- **Si una regla te parece mal** (por ejemplo que un `n` de 25 caracteres tire todo el
  desafío), **no la cambies acá**: propuesta en `Docs/SUGERENCIAS/` y decide `arquitectura`.
- **Verifica con:** comandos **(B)**, con tabla: `?g=quiz&p=7&t=8&n=Santi` → válido ·
  `p=9&t=8` → ignorado · `t=0` y `t=51` → ignorados · `g=ajedrez` → ignorado · sin
  parámetros → visita normal · `n=<script>alert(1)</script>` → el nombre sale sin `<` ni
  `>` · `armarLink("quiz",7,8)` → longitud < 100 y round-trip con `leerDesafio`.

### T-38 — hilo principal — tokens visuales con contraste verificado · **[P]**

- **Requisito:** H-27 · `UX-04` (paleta, tipografía, espaciado) · checklist de accesibilidad
  de `UX-01`.
- **Archivos:** `src/styles/tokens.css`, `src/lib/contraste.test.ts`.
- **Qué hacer:** bajar a variables CSS lo que `UX-04` dejó en descripción — base oscura casi
  negra con matiz cálido (no negro puro), magenta saturado, verde ácido, naranja quemado,
  azul eléctrico, **verde ácido para acierto** (el mismo acento 2, no otro verde) y **un rojo
  saturado reservado en exclusiva para error**. Más: familia sans de sistema para texto
  largo, familia display para títulos y botones cortos (con fallback de sistema — no hay
  archivo de fuente y no se descarga uno de un tercero), toque mínimo 44×44 px y zona pulgar
  del 25–30% inferior.
- **El hex lo elegís vos, dentro de la descripción de `UX-04`, que lo dejó explícitamente
  para "quien produce el arte".** No es libertad: es la descripción más un umbral que corre.
- **Qué NO hacer:** no inventes arte. Los seis íconos del brief de `UX-04` no existen; el
  feedback de acierto/error se resuelve con **forma o glifo más color** —el checklist exige
  las dos cosas, nunca solo color— y el arte real entra cuando el usuario decida producirlo.
- **Verifica con:** comandos **(B)**. El test parsea `tokens.css`, calcula el **ratio de
  contraste WCAG** y afirma ≥ **4,5:1** para texto de cuerpo sobre fondo base y para texto
  sobre cada color que se use como fondo de botón; ≥ 3:1 para bordes y estados; y que el
  color de error no se reusa en ningún otro token.

### T-39 — hilo principal — Pantalla 0: la entrada

- **Requisito:** `UX-01` Pantalla 0 (variantes A, B y C) y su checklist "primera pantalla
  sin muro" · `CNT-05` (`T-29`) · `D-14` molinetes abiertos.
- **Archivos:** `src/pages/index.astro` (reemplaza el mínimo de `T-33`).
- **Qué hacer:** una sola pantalla: título de `CNT-05`, **un** botón grande anclado en el
  tercio inferior, y nada más. Variante B: si `leerDesafio()` (`T-37`) devuelve un desafío,
  se reemplaza **una línea de texto** por el desafío — no es un modo aparte ni una pantalla
  nueva. Variante C es la A sin desafío.
- **Prohibido, y es literal del checklist:** campos de texto, pedidos de permiso, pantalla
  de instrucciones intermedia, scroll para encontrar el botón, contadores inventados.
- **Verifica con:** comando **(A)** y **(C)**, más tres greps sobre `dist/index.html`:
  `grep -c "<input\|<form"` → **0**; el texto del botón de `CNT-05` aparece; y el HTML
  estático **no** trae ninguna etiqueta `<script>` de terceros. La variante B se prueba a
  nivel función en `T-37` — es lógica de cliente y no se ve en el HTML servido.

### T-40 — hilo principal — la isla de la partida

- **Requisito:** `US-01` criterios 1 y 2 · `BR-01` · `BR-04` (4 opciones) · `UX-01`
  "Pantallas 1..N" · `UX-01` v2 de `T-30` (el rótulo) · `.claude/rules/codigo-juegos.md`
  (islas: JS solo adentro del juego).
- **Archivos:** `src/components/quiz/Partida.astro`, `src/scripts/partida.ts`.
- **Qué hacer:** el payload de `paraElCliente()` (`T-34`) se serializa en la página; el
  script arma la ronda con `armarRonda()` (`T-35`) **en el cliente**, para que "jugar de
  nuevo" sortee un set nuevo sin recargar. Por ítem: contador de progreso, insignia de
  categoría, enunciado en la tipografía legible, **cuatro** opciones en botones verticales
  grandes. Al tocar: verde con glifo si acierta, rojo con glifo distinto y la correcta
  resaltada si falla, **más el rótulo si el ítem es leyenda o testimonio** (donde `T-30` lo
  puso), y auto-avance con los tiempos de `UX-01`/`T-30`.
- **`US-01` criterio 2 es una línea de código y es no negociable:** tres errores seguidos
  **no** cortan la partida ni cambian nada. No hay ninguna rama de "perdiste".
- **Qué NO hacer:** nada de temporizador de cuenta regresiva (`UX-01` no lo asume y sería
  una mecánica nueva, o sea `BR-XX` de `producto`). Nada de `localStorage` todavía.
- **Verifica con:** comando **(A)**, más greps sobre `dist/`:
  `grep -o 'QZ-0[0-9][0-9]' dist/index.html | sort -u | wc -l` → **30**;
  `grep -c "notaInterna\|\"fuentes\"" dist/index.html` → **0**; y que el primer
  `rotuloLeyenda` del banco aparezca en la página (sacalo con
  `python -c "import json;d=json.load(open('src/data/quiz.json',encoding='utf-8'))['items'];print(next(x['rotuloLeyenda'] for x in d if x['esLeyenda'])[:30])"`).
- **Al cerrar esta tarea el quiz ya se juega**, aunque termine en una pantalla pelada. Ese
  es el punto de corte: si la ráfaga muere acá, el repo queda consistente y jugable.

### T-41 — hilo principal — la pantalla de resultado

- **Requisito:** `UX-01` "Pantalla final" · `BR-05` vía `tramo()` (`T-36`) · `CNT-05`.
- **Archivos:** `src/components/quiz/Resultado.astro`, `src/scripts/resultado.ts`.
- **Qué hacer:** puntaje grande ("7/8"), el tramo con su título de `CNT-05` y tratamiento
  visual distinto por tramo (color y forma de `tokens.css`; el arte de los tres tramos no
  existe todavía y no se inventa), botón secundario "jugar de nuevo" que vuelve a la
  pregunta 1 con ronda nueva. El botón primario COMPARTIR es `T-42`: dejá el lugar.
- **Verifica con:** comando **(A)**, más: los **tres** títulos de tramo de `CNT-05` aparecen
  en `dist/` (`grep -rl "<título del tramo>" dist/` para cada uno). La lógica del corte ya
  está probada en `T-36`; acá se verifica que la pantalla usa esa función y no un `if`
  paralelo — `grep -c "tramo(" src/scripts/resultado.ts` ≥ 1 y ningún `0.25`/`0.3` suelto.

### T-42 — hilo principal — el botón COMPARTIR

- **Requisito:** `D-10` (hay difusión y el resultado compartido es la puerta de entrada) ·
  `UX-01` (COMPARTIR es el botón más grande de la pantalla final) · `UX-02` · `ADR-02`
  vía `armarLink()` (`T-37`).
- **Archivos:** `src/components/quiz/Compartir.astro`, `src/scripts/compartir.ts`.
- **Qué hacer:** Web Share API nativa si el navegador la tiene; si no, **copiar el link al
  portapapeles** con confirmación visible. El texto del tuit prefil sale de `CNT-05`, el
  link de `armarLink()`. Nada más.
- **Qué NO hacer:** **no generes la imagen 1200×630 de `UX-02`.** Necesita arte que no
  existe, y `ADR-02` ya dejó dicho que en un sitio estático la vista previa del tuit no
  puede llevar el puntaje. Ese es un ciclo aparte, no un pedazo de este.
- **Verifica con:** comando **(A)**, más: `grep -rc "navigator.share" dist/` ≥ 1 y el camino
  de respaldo presente (`clipboard`). El armado de la URL ya está probado en `T-37`. Que el
  diálogo nativo abra de verdad **lo prueba el usuario en el celular** — no hay comando.

### T-43 — `revisor` — `REV-04`: el quiz construido

- **Requisito:** `D-12` (el que fabrica no se autocertifica) · `US-01` criterios 1 y 2 ·
  `BR-01`, `BR-04`, `BR-05` · los dos checklists de `UX-01` · `.claude/rules/codigo-juegos.md`.
- **Archivo:** `Docs/REVISIONES/REV-04-quiz-construido.md` (nuevo). Hallazgos desde
  **`FIND-15`**.
- **Qué hacer, y esta vez se corre entero:** los comandos (A), (B), (C) y (D) de §2, con la
  **salida literal pegada** en la revisión. Después, seis chequeos que ningún test cubre:
  1. **El rótulo llega a la pantalla** en un ítem de leyenda y en uno de testimonio. Es la
     verificación de `D-14`, y es la que más importa.
  2. **Cuatro opciones en pantalla** en todos los ítems (`BR-04`), no cuatro en el JSON.
  3. **Ningún dato interno en `dist/`**: `notaInterna`, `fuentes`, `estado`, `explicacion`.
  4. **El checklist "sin muro"** de `UX-01`, punto por punto, contra el HTML servido.
  5. **El checklist de accesibilidad**: 44×44, color **más** forma, contraste (el test de
     `T-38` te da el número; verificá que los tokens que mide sean los que la página usa).
  6. **Nada hardcodeado**: ninguna pregunta, opción ni explicación escrita en un componente.
- **Qué NO hacer:** no arregles lo que encuentres. Es hallazgo con dueño (hilo principal), y
  arreglarlo vos rompe la separación que hace que la revisión valga.
- **Verifica con:** el archivo existe, trae la salida literal de los cuatro comandos y un
  veredicto explícito por cada uno de los seis chequeos.

---

## 4. Pasada de conflictos — hecha, no mental

Las `[P]` son `T-29`, `T-30`, `T-31`, `T-32` (ola 1: cuatro documentos en tres carpetas de
rol distintas) y `T-36`, `T-37`, `T-38` (ola 2: tres pares de archivos nuevos bajo
`src/lib/`, colgados solo del andamiaje). **`[P]` marca que no comparten archivo y que sus
dependencias están cerradas cuando les toca**, no que haya dos manos.

| Choque | Tareas | Resolución |
|---|---|---|
| El commit inicial contra un árbol en movimiento | `T-28` vs `T-33` | `T-28` **primero y sola**. Si corre mientras `T-33` escribe `package.json`, el commit inicial captura medio archivo. Son dos minutos; no vale la pena resolverlo de otra forma |
| Cuello de botella real del ciclo | `T-33` | Diez tareas cuelgan de ella. No es un choque de archivos, es de orden: sin andamiaje no compila nada. Por eso las cuatro documentales son `[P]` contra ella — si `npm install` falla, el ciclo igual entrega cinco cosas |
| Mismo archivo `src/pages/index.astro` | `T-33` (mínimo) vs `T-39` (real) | Serializadas. `T-33` deja un placeholder de tres líneas **a propósito**: probar que el build corre no es lo mismo que construir la pantalla, y mezclarlas hace que una falla no diga cuál de las dos cosas se rompió |
| Cadena de la partida | `T-39` → `T-40` → `T-41` → `T-42` | Serializadas por dependencia de estado, no por archivo (cada una toca archivos propios). Cuatro eslabones, ninguno de más de ~20 min, y **cada uno deja el repo jugable**: entrada sola, entrada + partida, + resultado, + compartir |
| Dos tareas de `contenido` a la vez | `T-29` y `T-32` | Archivos distintos (`CNT-05` nuevo, `CNT-01` existente), las dos `[P]`. Si la ráfaga alcanza para una sola va **`T-29`**: es el gate y desbloquea tres tareas de código. `T-32` no desbloquea nada, solo corrige una contradicción |
| Copy contra ubicación del rótulo | `T-29` (la etiqueta) vs `T-30` (dónde va) | Las dos `[P]`, archivos y roles distintos, y **ninguna necesita el resultado de la otra**: `contenido` escribe el texto, `experiencia` decide el lugar. Quien las junta es `T-40`. Si una falta, `T-40` implementa la que haya y lo deja anotado |
| `ADR-01` contra el mapa de derechos | `T-31` vs `T-32` | Archivos y roles distintos, las dos `[P]`. Acoplamiento de contenido, no de escritura: `T-32` suma el deep link como quinta superficie. Si `T-31` no cerró, `T-32` lo escribe como valor de trabajo (instrucción dentro de la tarea) |
| Carpeta `src/` compartida con dos roles | código vs `contenido`/`arquitectura` | **Cero riesgo este ciclo:** ninguna tarea toca `src/data/quiz.json` ni `src/data/_schema/`. El código los **lee**. Por eso `QZ-` no se mueve y el comando (D) tiene que dar `OK 30` de principio a fin |
| Sesión paralela de investigación | ninguna | No hay tarea de `investigador` y ninguna tarea escribe en `Docs/INVESTIGACION/`. Si llega una ficha nueva en medio del ciclo, **no se reabre nada** |
| Contador `FIND-` | `T-43` | Arranca en `FIND-15`. `FIND-01`..`FIND-14` los consumieron `REV-01`, `REV-02` y `REV-03` |
| Cadena más larga | `T-28` → `T-33` → `T-34` → `T-35` → `T-40` → `T-41` → `T-42` → `T-43` | Ocho eslabones — es el ciclo más serializado de los tres, y es inevitable: el software se apila. Mitigación: los cortes están elegidos para que el repo quede **consistente y jugable** en cada uno, y las siete `[P]` se pueden intercalar en cualquier ráfaga suelta |

---

## 5. Qué quedó afuera del ciclo, y por qué

- **Las 10 preguntas de `letras` y el piso de 40 de `US-01`.** Y no porque estén bloqueadas:
  `D-13` decidió las fuentes y `D-14` sacó la exigencia de fuente oficial, así que hoy se
  podrían escribir. Quedan afuera porque **no reducen ningún riesgo de este ciclo**: con 30
  ítems y rondas de 8, el quiz se juega igual, y ninguna línea del código de acá espera 40.
  Además, la obligación concreta que `D-13` dejó —**cruzar cada letra contra los 105 temas
  de `RES-20`**, porque letras.com mezcla material del Indio solista y de Skay, y confirmar
  de oído— es un criterio de `contenido` que conviene escribir **pegado al primer verso**, no
  dos ciclos antes. Ciclo 4, con su gate propio, como funcionó dos veces.
- **Ítems de `US-02`.** `arquitectura` avisó que `origen` y `fechaCorte` de `CTR-03` **no son
  inventables** hasta que el usuario recorte los primeros mp3. Abrir tarea de contenido antes
  es pedirle a un rol que invente un dato — exactamente lo que el proyecto entero evita.
- **`CTR-04` y `CTR-05`** (schemas de `US-03` y `US-04`). Mismo motivo del ciclo 2, más uno
  nuevo y mejor: **el primer juego construido va a enseñar cosas del contrato que ningún
  documento previo sabe**. Escribirlos antes de que el quiz corra es escribirlos dos veces.
- **La imagen compartible 1200×630 de `UX-02`.** Necesita arte original que no existe, y
  `ADR-02` ya dejó dicho que en un sitio estático la vista previa del tuit **no puede llevar
  el puntaje**. Lo que sí funciona hoy —texto + link— entra en `T-42`.
- **El arte original entero** (los seis briefs de `UX-04`). Es producción del usuario. El
  ciclo entrega el sistema visual funcionando con color, forma y tipografía; los dibujos
  entran encima sin rehacer nada.
- **Publicar.** `D-14` sacó el permiso del camino, pero no hay build subido ni dominio.
  Conviene después de `REV-04`, no antes, y es tarea del usuario.
- **`spotify.trackId` en los ítems del quiz** (H-28) y **si el sitio menciona la muerte del
  Indio** (H-18 del ciclo 2). Los dos son de `contenido`, los dos son baratos, ninguno
  bloquea nada de acá.
- **Revisar `Docs/UX/`** (H-30). El turno de `revisor` va al quiz construido.
- **`localStorage`** (puntajes y rachas, "confirmado por omisión" en el brief). No es
  requisito de `US-01` y agrega estado que hay que probar. Cuando haya algo que valga la
  pena recordar entre partidas.

**Del usuario, y no es tarea de ningún rol:**
1. **Abrir el sitio en su celular** con `npm run dev -- --host` y la IP de la LAN. Es lo
   único que verifica de verdad el "jugable en un celular" del brief: ningún comando de
   `T-43` prueba que el pulgar llega al botón.
2. **Recortar los mp3** siguiendo `CTR-01.6` y `CTR-01.7`, con el máster en WAV **fuera del
   repo**. Es lo que desbloquea `US-02` en el ciclo 4.

---

## 6. El riesgo de este ciclo

**El riesgo del ciclo 1 era rehacer quince preguntas. El del 2 era que el rótulo
`testimonio` se volviera un tilde. El de este es nuevo: que el código se convierta en la
quinta fuente de verdad.**

Hasta hoy cada decisión vivía en un documento con un dueño, y cuando dos se contradecían se
notaba leyendo. El código es el primer artefacto que puede contradecir a los cinco a la vez
y **seguir pareciendo que funciona**: un corte de tramo en 25% en vez de 30, cuatro opciones
en el JSON y tres en la pantalla, un primer ítem que no es fácil, un color que no contrasta,
un `<input>` de nombre "para personalizar la tarjeta". Ninguna de esas cosas rompe el build.
Todas rompen algo que costó dos ciclos decidir, y en tres de los cinco casos rompen un
**criterio no negociable** del brief.

Por eso la mitigación no es una advertencia, es la forma de las tareas: **cada regla de
negocio entra como función pura con su test** —`BR-01` en `T-35`, `BR-05` en `T-36`,
`ADR-02` en `T-37`, el contraste de `UX-04` en `T-38`— y el veredicto final lo da `revisor`
**corriendo**, no leyendo (`T-43`). Un `BR-XX` que no se puede expresar como test es un
`BR-XX` que el código va a interpretar solo, y ahí es donde se pierde.

**Segundo riesgo, concreto y con fecha de aparición: `npm install`.** Es la única
dependencia externa del ciclo y está en el primer eslabón del tramo de código. Node 24.14.1,
npm 10.8.3, git 2.53 y Python 3.11.1 están instalados —lo verifiqué hoy—; lo que falta es la
primera bajada del registry. Si no hay red, `T-33` no cierra y las diez tareas de código
quedan detrás de ella. Mitigación: las cuatro documentales son `[P]` y no dependen de nada,
así que el peor ciclo posible igual entrega `CNT-05`, `UX-01` v2, `ADR-01` cerrado y
`CNT-01` convertido en mapa. No es un ciclo perdido, es un ciclo más chico.

**Tercero, y es el que más veces arruina un primer ciclo de código: el andamiaje que
crece.** La tentación, con el build recién andando, es dejar las cuatro páginas hechas "ya
que estoy". `US-02` no tiene un solo ítem, `US-03` no tiene contrato y `US-04` es el primero
que se cae (`D-05`). Cuatro carpetas vacías son deuda con forma de progreso: parecen avance
en el árbol de archivos y no se pueden verificar con nada. **Este ciclo construye un juego,
el que ya tiene 30 ítems adentro.**

**Cuarto, y el más silencioso: que el rótulo se pierda en el camino al navegador.** `D-14`
apoya la postura entera del proyecto en rotular bien, el schema lo obliga y `REV-03` lo
auditó ítem por ítem — pero hoy **ninguna pantalla lo muestra** (H-24). Si `T-30` no se hace
o `T-40` lo saltea, la mitad del banco llega al jugador como hecho verificado y el trabajo
de dos ciclos se pierde en la última milla, justo donde nadie estaba mirando.
