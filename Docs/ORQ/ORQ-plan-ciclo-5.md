# ORQ — Plan del ciclo 5

- **Fecha:** 2026-08-22 · **Rol dueño:** `orquestador` · **Ciclo:** 5
- **Consume:** `ESTADO.md` (cerrado del ciclo 4), `Docs/ORQ/ORQ-plan-ciclo-4.md`,
  `Docs/REVISIONES/REV-05-adivinar-la-tapa.md`, `Docs/DECISIONES.md` (`D-14`, `D-15`,
  `D-19`, `D-21`), `Docs/PRODUCTO/PRD-alcance-v1.md` y `PRD-redondopedia.md`,
  `Docs/UX/UX-04-sistema-visual.md` y `UX-05-tapas-en-pantalla.md`, `Docs/ARQ/` (`CTR-04`,
  `CTR-05`), y las cinco notas abiertas de `Docs/SUGERENCIAS/`.
- **Produce:** `T-64`..`T-80`. Los ciclos 1 a 4 consumieron `T-01`..`T-63`.
- **Foco:** **el sitio sale a la calle y el quiz se viste.** Lo primero porque ya hay algo
  que mostrar; lo segundo porque es la mitad del pedido del ciclo 4 que quedó sin hacer.

---

## 0. De dónde arranca

El ciclo 4 cerró con **dos juegos jugables** (el quiz y adivinar la tapa), las tapas reales
vistiendo el sitio, y la Redondopedia en 29 de 35. Lo que quedó abierto, y este plan toma:

| Qué | De dónde viene |
|---|---|
| Desplegar. Nada lo bloquea desde `D-14` y `D-15` | `ESTADO.md`, punto 3 del próximo paso |
| Las **siete superficies del quiz** que `UX-05` §2 cataloga y nadie construyó | `FIND-C` del cierre del ciclo 4 |
| Tres deudas de contrato de `CTR-05` | `REV-05`: `FIND-18`, `FIND-19`, `FIND-21` |
| Las **bandas post-separación**, pedido directo del usuario | `Docs/SUGERENCIAS/HILO-para-producto-y-contenido-bandas-post-separacion.md` |
| Dos desvíos de `UX-05` esperando el visto bueno de `experiencia` | `Docs/SUGERENCIAS/HILO-para-experiencia-desvios-de-UX-05.md` |
| El pie de *La mosca y la sopa* y la exclusión por tono | `Docs/SUGERENCIAS/HILO-para-contenido-pie-de-la-mosca-y-tono.md` |

### 0.1 El frente de las letras, y por qué este plan lo corta distinto

`ESTADO.md` puso las letras primeras, y tiene razón en el valor: `US-03`, las 10 preguntas
de `letras` que cierran el piso de 40 de `US-01`, y los 6 artículos `tema` que cierran el
piso de 35 de `US-05` son **el mismo insumo tres veces**. Pero ese insumo es texto de
letras, y **este ciclo no lo transcribe**.

No es una cautela nueva ni una relectura de `D-14`, que sigue mandando entera. Es la misma
forma que el proyecto ya le dio a `US-02`: *"los recortes de audio los produce el usuario,
ningún rol puede inventarlos"*. Los versos son eso mismo — material de origen que entra por
la mano del usuario, no algo que se fabrique acá.

**Lo que sí hace este ciclo, y es casi todo lo demás:**

- **La maquinaria entera de `US-03`** (`T-77`, `T-78`): el banco según `CTR-04`, el cruce
  obligatorio contra los 105 temas de `RES-20` como test, y el juego. El día que existan
  los versos, cargarlos es pegar un JSON — no queda nada por diseñar.
- **Una pregunta a `producto` que puede destrabar un piso entero sin un solo verso**
  (`T-67`). `BR-12` fijó que un artículo `tema` lleva **versos citados y análisis**, no la
  letra entera. La pregunta que sigue es si lleva versos **necesariamente**: un artículo
  que cuenta la autoría real (`RES-20`), el disco y el año, el contexto de grabación, la
  mitología asociada rotulada y lo que dijeron el Indio o Skay del tema, ¿se sostiene sin
  citar? Si `producto` dice que sí, los **6 `tema` se escriben este ciclo** (`T-68`) y
  `US-05` llega a **35 de 35**.

---

## 1. La tabla

| ID | Rol | Qué | Archivos | Verifica con | [P] |
|---|---|---|---|---|---|
| `T-64` | hilo principal | Desplegar el sitio en Vercel (`D-15`) | `vercel.json` si hace falta, `README.md` | La URL pública responde y sirve el portal, el quiz y adivinar la tapa | |
| `T-65` | `investigador` | `RES-47`: las tres bandas post-separación — nombre exacto, fecha, estado y **qué es cada una** | `Docs/INVESTIGACION/INV-47-bandas-post-separacion.md` | Las tres con URL y fecha; si algún nombre del usuario no coincide, lo dice | ✅ |
| `T-66` | `producto` | `BR-13`: bajo qué tipo entran las bandas a la Redondopedia y qué pasa con el piso de `US-05` | `Docs/PRODUCTO/PRD-redondopedia.md` | El tipo elegido con alternativas descartadas, y el piso dicho como número | |
| `T-67` | `producto` | `BR-14`: si un artículo `tema` se sostiene **sin citar verso** | `Docs/PRODUCTO/PRD-redondopedia.md` | Dice sí o no; si es sí, qué lleva un `tema` en su lugar | ✅ |
| `T-68` | `contenido` | Los 6 artículos `tema` → `US-05` a 35/35 | `src/data/redondopedia.json` | `npm test` verde; `tema` 6/6 y `BR-09` sin huérfanos | |
| `T-69` | `contenido` | Los artículos de las bandas post-separación | `src/data/redondopedia.json` | `npm test` verde; enlazados desde `la-separacion`, `indio-solari`, `skay-beilinson` | |
| `T-70` | `arquitectura` | `CTR-05` v2: la ruta real de `detalle`, el crédito compartido y la ventana de precarga | `Docs/ARQ/ARQ-schema-adivinar-tapa.md`, `src/data/_schema/tapa.schema.json` | Los tres hallazgos abiertos de `REV-05` quedan cerrados | ✅ |
| `T-71` | `experiencia` | `UX-04` v4 y `UX-05` v2: confirmar los dos desvíos y bajar los números al techo real del material | `Docs/UX/UX-04-sistema-visual.md`, `UX-05-tapas-en-pantalla.md` | La fila de `letras` sale de la trasera; el número de píxeles dice el techo real, no un objetivo inalcanzable | ✅ |
| `T-72` | hilo principal | El quiz se viste: fondo velado en presentación y resultado (`UX-05` §2) | `src/pages/quiz.astro`, `src/styles/juego.css` | `npm test` y `npm run build` verdes; el velo presente en las dos pantallas | |
| `T-73` | hilo principal | El quiz se viste: detalle de tapa por categoría en la pregunta | `src/scripts/partida.ts`, `src/styles/juego.css` | Las cuatro categorías traen su recorte y ninguna invade la zona del pulgar | |
| `T-74` | hilo principal | El sello de esquina: el crédito a Rocambole en una isla que no tiene pie (`D-21`, condición 1) | `src/scripts/partida.ts`, `src/styles/juego.css` | El crédito aparece en cada pregunta que muestre tapa | |
| `T-75` | hilo principal | La ventana de precarga que pide `CTR-05.1` | `src/scripts/partida-tapa.ts` | La imagen del ítem siguiente ya está pedida al llegar a él | |
| `T-76` | `contenido` | El pie de *La mosca y la sopa* dice que es la contratapa, y el veredicto sobre la exclusión por tono | `Docs/CONTENIDO/CNT-07-pies-y-tono-de-tapas.md` | El texto del pie escrito, y el veredicto explícito sobre los tres artículos graves | ✅ |
| `T-77` | hilo principal | El banco de `US-03` según `CTR-04`, con el cruce contra los 105 como test | `src/lib/letra/`, `src/data/letra.json` (vacío) | `npm test` falla si un ítem cita un tema que no está entre los 105 de `RES-20` | ✅ |
| `T-78` | hilo principal | El juego de completar la letra, que se enciende solo cuando el banco tenga ítems | `src/pages/juegos/completar-la-letra.astro`, `src/scripts/partida-letra.ts` | Con banco vacío muestra la pantalla en la cocina; con ítems de prueba, juega una ronda | |
| `T-79` | `revisor` | `REV-06`: el despliegue y el quiz vestido | `Docs/REVISIONES/REV-06-despliegue-y-quiz.md` | Hallazgos con evidencia, o la declaración de que no hay | |
| `T-80` | `revisor` | Chequeo de cierre del ciclo | informe en `Docs/REVISIONES/` | `npm test`, `npm run build` y el validador de instancia, corridos | |

---

## 2. Paralelismo: qué corre junto y qué no

**Las seis `[P]` de arranque** (`T-65`, `T-67`, `T-70`, `T-71`, `T-76`, `T-77`) no dependen
de nada del ciclo y tocan archivos distintos. Se lanzan todas en la primera ráfaga mientras
el hilo principal despliega.

**Cadenas:**

```
T-64  (suelta, y va primera: es la que más cambia el estado del proyecto)
T-65 -> T-66 -> T-69
T-67 -> T-68 -> T-69          (los dos escriben redondopedia.json: van en fila)
T-71 -> T-72 -> T-73 -> T-74  (los tres tocan juego.css y partida.ts)
T-70 -> T-75
T-77 -> T-78
T-72..T-74 -> T-79 -> T-80
```

**Conflictos que le sacaron la marca a una tarea:**

| Par | Choque | Qué se hizo |
|---|---|---|
| `T-68` y `T-69` | Los dos escriben `src/data/redondopedia.json` | Van en fila. Primero los `tema`, que cierran el piso; después las bandas, que lo amplían |
| `T-66` y `T-67` | Los dos son de `producto` y los dos escriben `PRD-redondopedia.md` | `T-67` lleva `[P]` porque no depende de nada; `T-66` espera a `T-65` **y** a que `T-67` suelte el archivo |
| `T-72`, `T-73`, `T-74` | Los tres tocan `juego.css` y dos tocan `partida.ts` | Son del hilo principal, que es uno solo: secuenciales por construcción |
| `T-73` y `T-74` | Los dos pintan sobre la pantalla de pregunta del quiz | `T-74` va después: el crédito se cuelga del detalle que `T-73` pone |

---

## 3. Qué queda afuera, y por qué

- **Los versos.** `US-03` no carga un solo ítem, las 10 preguntas de `letras` no se
  escriben, y si `BR-14` (`T-67`) dice que un `tema` necesita citar, esas citas tampoco. El
  motivo está en §0.1: es material de origen y entra por la mano del usuario, como el audio
  de `US-02`. Lo que este ciclo deja listo es todo lo que va alrededor, para que cargarlos
  después no requiera diseñar nada.
- **`US-02` (adivinar el tema).** Sin cambios desde el ciclo 4: `CTR-03` pide `origen` y
  `fechaCorte` por ítem y esos salen de recortar los mp3.
- **La "voz del Indio"** (`Docs/SUGERENCIAS/HILO-para-contenido-e-investigador-voz-del-indio.md`).
  El usuario la registró explícitamente como idea futura y dijo que no era para ahora. Se
  respeta.
- **`ADR-01`** (embed contra enlace directo). Sigue teniendo sentido solo cuando `US-02`
  exista.

---

## 4. El riesgo del ciclo

**Que desplegar convierta en público lo que hasta ahora era un repo, y que vestir el quiz
rompa la única pantalla que ya funcionaba.** Son dos riesgos distintos y los dos tienen
nombre.

**El primero no es técnico, es de exposición.** Hasta hoy el sitio lo veía quien clonara el
repo. Desde `T-64` lo ve cualquiera con el enlace, con las tapas reales, los versos que
vengan después y la Redondopedia entera adentro. `D-14` ya decidió la postura y no se
reabre: *fan site sin fines de lucro, el riesgo se asume, si llega un reclamo se baja y
listo*. Lo que sí corresponde es que la baja **sea barata de verdad** — que exista escrito
dónde se aprieta para bajarlo, no que se descubra el día que haga falta. Va dentro de
`T-64`.

**El segundo sí es técnico, y la mitigación es el orden.** El quiz es la pantalla más vieja
y la única con una isla de JavaScript madura; `T-72` a `T-74` la tocan tres veces seguidas.
Tres cosas lo acotan: van en fila y no en paralelo, cada una cierra con `npm test` y
`npm run build` corridos, y **el cierre de cada tarea es una ronda jugada en el navegador**
— no alcanza con que compile. `estilos.test.ts` ya falla el build si entra una tapa de
fondo sin velo, así que el defecto más probable de los tres está cubierto a máquina.

**Un riesgo secundario que conviene nombrar:** las bandas post-separación traen material
que **no es de Patricio Rey**. La nota de `Docs/SUGERENCIAS/` ya escribió la línea y este
plan la hereda entera — un artículo sobre esas bandas es contenido de primera, pero un
ítem de juego con material de ellas no entra a `US-01`..`US-04` mientras el piso de esos
juegos siga definido sobre los 105 temas de `RES-20`. Si `producto` quiere que entren, es
una `BR-XX` escrita, no un efecto colateral de haber sumado artículos.
