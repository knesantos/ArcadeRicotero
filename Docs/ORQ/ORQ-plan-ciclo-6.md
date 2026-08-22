# ORQ — Plan del ciclo 6: las letras entran

> **Escrito por el hilo principal** con `/ciclo`, el 2026-08-22, sobre el pedido directo
> del usuario. Ciclo 5 queda cerrado por arrastre: lo que faltaba de su alcance era
> exactamente el insumo que este ciclo recibe.

## El hecho que abre el ciclo

**El usuario trajo el material que faltaba.** En
`C:\Users\santi\Proyectos\TemasRedo\cancionero\data` hay **149 archivos JSON**, uno por
tema, con **letra y acordes alineados por columna**, raspados por un scraper propio y
documentado desde cifraclub.com (preferida, trae cifra) y letras.com (repuesto, solo
letra). Cada archivo trae fuente, URL, fecha y hash del HTML de origen.

Esto desbloquea de una sola vez los tres frentes que `ESTADO.md` venía listando por
separado — `US-03` (completar la letra), las 10 preguntas de `letras` de `US-01`, y los 6
artículos `tema` de `US-05` — porque los tres esperaban el mismo insumo: **versos**.

## Lo que el cruce de `D-13` dice del material — medido, no supuesto

Corrido contra los 105 temas de `RES-20` antes de escribir una línea de código:

| Medición | Valor |
|---|---|
| Archivos en la carpeta | 149 |
| Temas de `RES-20` cubiertos, normalización dura | **95 / 105** |
| Cubiertos sumando la tabla de alias | **104 / 105** |
| Único sin archivo | *Sushi* (`lobo-suelto` 13, instrumental) |
| Archivos **fuera de los 105** (cuarentena `D-13`) | **44** |
| Temas con acordes cifrados | ~72 |

**Los 149 contra 105 son exactamente el error que `RES-23` denunció y que `D-13` mandó
atajar**: la carpeta trae material del Indio solista, de Skay y rarezas que no son de los
diez discos. No se borran: se apartan a un archivo de cuarentena con su motivo, para que
el descarte sea auditable y no un silencio.

**Y el cruce encontró un defecto propio, no del material:** `leerTemas()` en
`src/lib/letra/temas.ts` corta mal 6 de los 105 títulos — se le pega la prosa de la nota
que sigue en la ficha (`Etiqueta negra (5:38) > Los dos volúmenes…`). Con el parser de hoy
el cruce daba 83/105 y habría rechazado temas legítimos. Se arregla en `T-83`.

## Las tareas

| T | rol | qué | archivos | verifica con | [P] |
|---|---|---|---|---|---|
| `T-82` | hilo | Contrato del cancionero: schema del dataset propio | `src/data/_schema/cancionero.schema.json` | el schema existe y `T-84` valida contra él | |
| `T-83` | hilo | Arreglar el corte de títulos de `RES-20` + tabla de alias | `src/lib/letra/temas.ts`, `src/lib/letra/temas.test.ts` | `node --test` — los 105 títulos limpios | |
| `T-84` | hilo | Ingesta: 149 archivos → dataset propio + cuarentena | `scripts/ingerir-cancionero.mjs`, `src/data/cancionero.json`, `Docs/CONTENIDO/cuarentena-cancionero.md` | el script corre y reporta 104/105 | |
| `T-85` | hilo | Lib del cancionero: carga, agrupado por disco, invariantes | `src/lib/cancionero/banco.ts` + test | `node --test` | [P] |
| `T-86` | hilo | Acordes: transposición y render de la grilla | `src/lib/cancionero/acordes.ts` + test | `node --test` | [P] |
| `T-87` | hilo | Las 10 paletas de disco como tokens (`RES-37`) | `src/styles/tokens.css`, `src/lib/contraste.test.ts` | `node --test` — AA en todo par nuevo | |
| `T-88` | hilo | Hoja de estilo de la sección, con la estética por disco | `src/styles/cancionero.css` | `estilos.test.ts` no encuentra slop | |
| `T-89` | hilo | Índice `/letras-y-acordes/` ordenado por disco | `src/pages/letras-y-acordes/index.astro` | `npm run build` | |
| `T-90` | hilo | Ficha de tema: letra con acordes, tono, transposición, autoscroll | `src/pages/letras-y-acordes/[slug].astro`, `src/scripts/cancion.ts` | `npm run build` | |
| `T-91` | hilo | Armar cancionero: elegís temas → HTML propio con índice y autoscroll | `src/pages/letras-y-acordes/cancionero.astro`, `src/scripts/armar-cancionero.ts` | `npm run build` + prueba en el navegador | |
| `T-92` | hilo | Generar el banco de `US-03` desde las letras (`CTR-04`) | `scripts/generar-letra.mjs`, `src/data/letra.json` | `node --test` — piso de 15 de `US-03` | |
| `T-93` | hilo | El juego jugable: partida de completar la letra | `src/pages/juegos/completar-la-letra.astro`, `src/scripts/partida-letra.ts` | `npm run build` + partida completa | |
| `T-94` | hilo | La Redondopedia enlaza la letra de cada tema | `src/pages/redondopedia/[slug].astro`, `src/lib/redondopedia.ts` | `node --test` — grafo sin huérfanos | |
| `T-95` | hilo | Portal y copy: la sección nueva entra al collage | `src/lib/sitio/copy.ts`, `src/pages/index.astro` | `npm run build` | |
| `T-96` | hilo | Verificación entera y PR | — | `npm test`, `npm run check`, `npm run build` | |

## Qué queda afuera, y por qué

- **Las preguntas de `letras` de `US-01` (10 para el piso de 40).** El material ya está,
  pero una pregunta de quiz **no se genera a máquina**: `CNT-02` pide distractor plausible
  y explicación, y eso es trabajo de `contenido`. El ciclo deja el dataset listo para que
  esa tarea sea escribir, no buscar.
- **Los 6 artículos `tema` de `US-05`.** Mismo motivo: `BR-12` pide versos citados **y
  análisis**. `T-94` deja el enlace y el andamio; el texto es de `contenido`.
- **Los 44 de la cuarentena.** No entran al sitio. Quedan listados por si alguno resulta
  ser un tema legítimo mal titulado y hay que promoverlo a mano.
- **`US-02` (adivinar el tema)** sigue esperando los recortes de mp3. No lo toca nada acá.

## El riesgo del ciclo

**Que el generador de `T-92` produzca huecos malos.** Un hueco de "completar la letra" es
bueno cuando la palabra que falta es adivinable por rima, por sentido o por saberse el
tema — y es malo cuando es una palabra funcional intercambiable ("de", "que", "y"), porque
entonces el juego premia la suerte, no el saber. Es el mismo problema que `CLAUDE.md`
declara como lo único estricto del proyecto, visto del otro lado: no un dato falso, sino
una pregunta sin respuesta defendible.

**Mitigación:** el generador no elige la palabra, la propone; entra como `estado:
"borrador"` con el hueco marcado, y **sube a `"listo"` solo lo que pasa filtros duros**
(largo mínimo, no ser palabra vacía, tener rima o ser sustantivo cargado, y los tres
distractores salir del mismo disco para que sean plausibles). Lo que no pasa el filtro
queda cargado y jugable-a-futuro, pero fuera de la partida.

**Riesgo segundo, menor:** el peso. 104 temas con letra y tablatura son ~1,2 MB de JSON.
Vive en build (`src/data/`), no viaja al navegador; lo único que se sirve por tema es su
propio JSON chico, para que "armar cancionero" no baje el corpus entero.
