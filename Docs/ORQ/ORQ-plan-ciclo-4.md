# ORQ — Plan del ciclo 4

- **Fecha:** 2026-08-21 · **Rol dueño:** `orquestador` · **Ciclo:** 4
- **Consume:** `ESTADO.md`, `Docs/DECISIONES.md` (`D-04`, `D-13`, `D-14`, `D-18`, `D-19`,
  `D-20`), `Docs/PRODUCTO/PRD-alcance-v1.md` (`US-01`..`US-04`) y `PRD-redondopedia.md`
  (`US-05`, `BR-07`..`BR-11`), `Docs/UX/UX-04-sistema-visual.md`,
  `.claude/rules/diseno-marca.md`, `public/arte/README.md`, `scripts/generar-tapas.mjs`,
  `Docs/SUGERENCIAS/HILO-para-investigador-fuente-coveralia.md` y
  `HILO-para-investigador-fuente-redondossubtitulados.md`, y el estado real de `src/`.
- **Produce:** `T-44`..`T-63`. Los ciclos 1, 2 y 3 consumieron `T-01`..`T-43`.
- **Pedido del usuario que ordena el ciclo:** *integrar las tapas reales a la página, usar
  los jpg reales, recortarlos y usar detalles o usarlos de fondo* — más seguir con los
  juegos, la página y la Redondopedia.

---

## 0. El foco: las tapas entran al sitio, y se termina el juego que vive de ellas

Las 35 imágenes ya están bajadas en `Docs/INVESTIGACION/TapasDiscos/` y hoy tocan una sola
pantalla del sitio: la ficha de disco de la Redondopedia, en baja. El ciclo las suelta al
resto de la página y, de paso, cierra **`US-04` (adivinar la tapa)** — el juego más barato
de los tres que faltan, porque su materia prima es exactamente lo que este ciclo va a
recortar. Es el único de los cuatro títulos de `D-05` que se puede terminar entero acá.

### 0.1 Hay una regla escrita que dice lo contrario, y por eso el ciclo arranca ahí

`UX-04` tiene una fila que es literal:

> Tapas reales · Solo el juego "adivinar la tapa o el disco" · Baja resolución, con crédito
> visible que nombra a Rocambole (Ricardo Cohen), **nunca como fondo decorativo de otra
> pantalla**.

El pedido del usuario es exactamente eso que la fila prohíbe. No es un conflicto para
resolver por las malas: es una decisión del usuario que todavía no está registrada. Por eso
`T-44` escribe `D-21` y `T-45` reescribe la fila. **Cualquier tarea de tapas que arranque
antes de `T-45` está construyendo contra una regla vigente**, y todo el frente depende de
esos dos pasos.

### 0.2 Lo que no cambia, aunque cambie la regla

- El crédito a Rocambole sigue siendo obligatorio donde aparezca una tapa. Deja de ser
  "crédito al lado de la imagen" y pasa a necesitar un mecanismo, porque un fondo no tiene
  dónde poner una firma. Lo define `T-45`.
- La baja resolución de `D-04` sigue en pie. Un fondo pide más píxeles que una estampilla de
  320 px: el número nuevo lo fija `T-45` y lo produce `T-49`.
- **La respuesta correcta tiene que ser correcta.** Con las tapas de fondo esto era
  decorativo; con `US-04` es el juego entero. `RES-25` ya avisó que el *Oktubre* de una de
  las fuentes es un CD yanqui del 93 y no el LP argentino del 86. Una tapa mal atribuida
  como respuesta correcta le marca error al que se sabe el disco. Por eso `T-47` audita
  edición por edición **antes** de que `contenido` escriba un solo ítem.

### 0.3 Dos números que este ciclo mueve

| Piso | Antes | Después de este ciclo | Qué falta |
|---|---|---|---|
| `US-04` — adivinar la tapa | 0/10 | **10/10** | nada |
| `US-05` — Redondopedia | 26/35 | **29/35** | los 6 `tema` (ciclo 5, con letras) |
| `US-01` — quiz | 30/40 | 30/40 | las 10 de `letras` (ciclo 5) |
| `US-02` — adivinar el tema | 0/20 | 0/20 | los recortes de audio los produce el usuario |
| `US-03` — completar la letra | 0/15 | 0/15 | contrato en `T-62`, versos en el ciclo 5 |

---

## 1. La tabla

| ID | Rol | Qué | Archivos | Verifica con | [P] |
|---|---|---|---|---|---|
| `T-44` | hilo principal | Registrar `D-21`: las tapas reales entran a toda la pantalla, no solo a un juego | `Docs/DECISIONES.md` | Existe `## D-21` con alternativas descartadas y consecuencias | |
| `T-45` | `experiencia` | Reescribir la fila "Tapas reales" de `UX-04` bajo `D-21`: qué entra, piso de legibilidad numérico, dónde va el crédito | `Docs/UX/UX-04-sistema-visual.md` | La fila ya no dice "nunca como fondo decorativo" y declara un ratio mínimo sobre tapa y un mecanismo de crédito para fondo | |
| `T-46` | `experiencia` | `UX-05`: catálogo detalle→sección — qué recorte de qué tapa viste cada pantalla, coherente con `D-19` | `Docs/UX/UX-05-tapas-en-pantalla.md` | Las 6 secciones de `D-19` y los 10 discos tienen fila; ninguna recompone una tapa que `UX-04` no habilita | |
| `T-47` | `investigador` | `RES-44`: ficha de Coveralia **con auditoría de edición** de las 35 imágenes bajadas | `Docs/INVESTIGACION/INV-44-tapas-coveralia.md` | Las 35 filas tienen edición anotada o "no determinable"; las dudosas quedan marcadas para no usarse como respuesta correcta | ✅ |
| `T-48` | hilo principal | Lienzo: la hoja 05 gana la regla de tapa en pantalla y se salda la deuda de `--papel`/`--radio` | lienzo "Sistema de marca Arcade Ricotero" | La hoja 05 muestra los tres usos (detalle, fondo con velo, ficha) y `--papel`/`--textura-grano`/`--radio 4px` figuran | |
| `T-49` | hilo principal | Derivados: `generar-tapas.mjs` produce detalle recortado y fondo desde los másters | `scripts/generar-tapas.mjs`, `public/tapas/` | `node scripts/generar-tapas.mjs` corre limpio, los archivos nuevos existen y el script imprime el peso de cada uno | |
| `T-50` | hilo principal | Velo de legibilidad: tokens `--velo-tapa-*` y su par en el test de contraste | `src/styles/tokens.css`, `src/styles/sitio.css`, `src/lib/contraste.test.ts`, `src/lib/estilos.test.ts` | `node --test src/lib/contraste.test.ts` pasa con el par nuevo; `estilos.test.ts` falla si una tapa entra de fondo sin velo | |
| `T-51` | hilo principal | Aplicar las tapas en el portal y en las tres pantallas "en la cocina" | `src/pages/index.astro`, `src/pages/juegos/*.astro`, `src/styles/sitio.css` | `npm run build` OK y cada pantalla vestida trae su crédito a Rocambole en el marcado | |
| `T-52` | hilo principal | Aplicar las tapas en la Redondopedia: cabecera de ficha de disco con detalle | `src/pages/redondopedia/[slug].astro`, `src/pages/redondopedia/index.astro` | `npm run build` OK; las 10 fichas `disco` traen cabecera y crédito | |
| `T-53` | `arquitectura` | `CTR-05`: schema de adivinar la tapa (`US-04`), con 4 opciones (`BR-04`) y campo de edición | `Docs/ARQ/ARQ-schema-adivinar-tapa.md`, `src/data/_schema/tapa.schema.json` | El schema rechaza 3 o 5 opciones, ítem sin crédito, ítem sin edición, y ninguna opción correcta | ✅ |
| `T-54` | `contenido` | Los 10 ítems de `US-04`, solo con tapas de edición confirmada por `T-47` | `src/data/tapa.json` | 10 ítems que validan contra `tapa.schema.json`; ninguna tapa marcada dudosa en `RES-44` | |
| `T-55` | hilo principal | El juego jugable de punta a punta en `/juegos/adivinar-la-tapa/` | `src/pages/juegos/adivinar-la-tapa.astro`, `src/lib/tapa/`, `src/scripts/partida-tapa.ts` | Las reglas entran como funciones puras con test; `npm test` verde y una ronda completa en el navegador | |
| `T-56` | `revisor` | `REV-05`: `US-04` contra sus criterios de aceptación y contra `BR-04` | `Docs/REVISIONES/REV-05-adivinar-la-tapa.md` | Hallazgos `FIND-XX` con evidencia y criterio incumplido, o la declaración de que no hay ninguno | |
| `T-57` | `contenido` | `CNT-06`: relectura de `CNT-04` para prosa larga — veredicto sobre Bulacio y Olavarría (`BR-10`) | `Docs/CONTENIDO/CNT-06-muertes-en-prosa.md` | El veredicto es explícito; si es negativo, deja escrito que el piso de `hito` baja de 7 a 6 | ✅ |
| `T-58` | `contenido` | Los 2 artículos `hito`: Walter Bulacio y Olavarría | `src/data/redondopedia.json` | `npm test` verde (`BR-09` sin huérfanos ni callejones); `hito` queda 7/7 | |
| `T-59` | `contenido` | El tercer artículo `leyenda`, para cerrar 3/3 | `src/data/redondopedia.json` | `npm test` verde; la afirmación central va rotulada leyenda sin excepción (`BR-08`) | |
| `T-60` | `investigador` | `RES-45`: ficha de redondossubtitulados.com, cruzada contra los 105 temas de `RES-20` | `Docs/INVESTIGACION/INV-45-fuente-subtitulados.md` | La ficha dice qué contiene, con qué licencia, y cuántos de los 105 cubre | ✅ |
| `T-61` | `producto` | `BR-12`: qué reproduce un artículo `tema` — versos citados y análisis, no letra completa | `Docs/PRODUCTO/PRD-redondopedia.md` | La fila `tema` de `BR-07` ya no pide "letra completa"; el piso de 6 sigue en pie | ✅ |
| `T-62` | `arquitectura` | `CTR-04`: schema de completar la letra (`US-03`) | `Docs/ARQ/ARQ-schema-completar-letra.md`, `src/data/_schema/letra.schema.json` | El schema rechaza ítem sin cruce contra los 105 de `RES-20` y sin fuente de la letra | ✅ |
| `T-63` | `revisor` | Chequeo de cierre del ciclo: contraste, anti-slop, `BR-09` y build | informe en `Docs/REVISIONES/` | `npm test` y `npm run build` verdes, y el ojo contra la tabla de tics vetados de `.claude/rules/diseno-marca.md` | |

---

## 2. Paralelismo: qué corre junto y qué no

**Las seis `[P]` de arranque** (`T-47`, `T-53`, `T-57`, `T-60`, `T-61`, `T-62`) no dependen
de nada del ciclo y tocan archivos distintos entre sí. Se pueden lanzar todas en la primera
ráfaga mientras el hilo principal escribe `D-21`.

**Cadenas serias, en orden:**

```
T-44 -> T-45 -> T-46 -> T-49 -> T-51
              -> T-48 -> T-50 -> T-51, T-52
T-47 -> T-54 ; T-53 -> T-54 -> T-55 -> T-56
T-57 -> T-58
```

La más larga es `T-44 → T-45 → T-46 → T-49 → T-51 → T-63`: seis eslabones. Cada corte deja
el repo consistente — si la ráfaga muere después de `T-49`, hay derivados generados que
todavía nadie usa y el sitio construye igual.

**Conflictos que le sacaron la marca a una tarea:**

| Par | Choque | Qué se hizo |
|---|---|---|
| `T-58` y `T-59` | Los dos escriben `src/data/redondopedia.json` | Ninguna lleva `[P]`: van una después de la otra, en cualquier orden |
| `T-45` y `T-46` | Los dos son de `experiencia` y el catálogo aplica la regla | `T-46` espera a `T-45`. Sin la regla, el catálogo se escribe contra la fila vieja |
| `T-50` y `T-51` | Los dos tocan `src/styles/sitio.css` | Son del hilo principal, que es uno solo: secuenciales por construcción |
| `T-54` y `T-47` | `contenido` no puede elegir tapas sin saber qué edición es cada archivo | `T-54` espera la auditoría. Es la dependencia que protege lo único estricto del proyecto |

---

## 3. Qué quedó afuera, y por qué

- **`US-02` (adivinar el tema) entero.** No es prioridad mal puesta: `CTR-03` pide `origen`
  y `fechaCorte` por ítem, y esos dos campos salen de recortar los mp3 — trabajo del
  usuario, no de un rol. Mientras no existan los recortes, cualquier tarea de `US-02`
  produce un juego sin materia prima. `ADR-01` tampoco lo frena: el repuesto ya está
  cerrado.
- **Las 10 preguntas de `letras` del quiz y los 6 artículos `tema`.** Las dos cosas necesitan
  el mismo insumo — versos — y ese insumo hoy no está en el repo. `D-13` decidió la fuente
  pero nadie la fue a buscar todavía, y `contenido` no tiene acceso a la web. Por eso el
  ciclo se lleva las tres tareas que convierten el ciclo 5 en pura carga (`T-60`, `T-61`,
  `T-62`) en vez de empezar una carga que se traba a la segunda hora.
- **Desplegar en Vercel.** Nada lo bloquea desde `D-14` y `D-15`, y sigue siendo cierto.
  Queda afuera porque desplegar el sitio justo mientras se le cambia la piel entera obliga a
  mirar dos veces lo mismo. Va primero en el ciclo 5, con las tapas ya adentro.
- **`ADR-01` (embed contra enlace directo).** Solo tiene sentido cuando `US-02` exista.

### Una cosa que cambié de alcance, y la digo acá para que no pase inadvertida

`BR-07` describe el tipo `tema` de la Redondopedia con **"letra completa con la fuente
citada"**. Reproducir letras enteras no es lo mismo que citar versos, y el propio proyecto ya
tiene el límite escrito para el otro lado: `BR-03` arma el juego con 2/1/0 versos y `RES-03`
fijó el techo de la cita en el orden de 8 compases. Un artículo de enciclopedia se sostiene
con versos citados más análisis, contexto y autoría — que es además lo que la Redondopedia
puede hacer y una letra pelada no. `T-61` le pide a `producto` que corrija ese campo antes de
que se escriba el primer `tema`. **Es un cambio de alcance de un campo, no del piso**: los 6
artículos siguen siendo 6.

---

## 4. El riesgo del ciclo

**Que las tapas de fondo rompan las dos cosas que el sitio ya tenía ganadas: la legibilidad y
no parecer hecho por una máquina.**

No es un riesgo teórico. Una foto a sangre completa con un velo oscuro encima y texto blanco
al medio es, textualmente, el recurso más gastado de la interfaz genérica que
`.claude/rules/diseno-marca.md` prohíbe — y encima es la forma más rápida de que un par de
color que hoy pasa AA deje de pasarlo, porque el fondo deja de ser un token medible y pasa a
ser una imagen con mil valores adentro. El ciclo pasado costó una corrida entera de limpieza
sacar siete pastillas y una barra de acento; sería mal negocio recuperarlas por la puerta de
atrás.

**Tres mitigaciones, y las tres son tareas de esta tabla:**

1. **El velo es un token con test** (`T-50`), no una opacidad elegida a ojo en cada pantalla.
   El par "tinta sobre tapa velada" entra a `contraste.test.ts` como los otros 18.
2. **El recorte se pega, no se estira** (`T-46`, `T-49`). La forma que manda es la del
   proyecto — recorte de borde rasgado, borde grueso de serigrafía, rotación leve — y no la
   imagen de encabezado a sangre. El catálogo de `T-46` lo fija pieza por pieza antes de que
   se escriba una línea de estilo.
3. **`estilos.test.ts` gana una regla más** (`T-50`): una tapa que entra de fondo sin su token
   de velo hace fallar el build. Lo auditable se audita a máquina; el resto lo mira `T-63` con
   la tabla de tics vetados en la mano.

**El riesgo secundario** es la edición equivocada. Está acotado a una sola tarea (`T-47`) y
tiene salida declarada: la tapa dudosa no se usa como respuesta correcta de `US-04`, se usa
como distractor o no se usa. Con 11 títulos y un piso de 10 ítems el margen es fino — si la
auditoría deja más de un título afuera, `contenido` avisa en `T-54` y `producto` decide si el
piso se toca. No se resuelve inventando una edición.
