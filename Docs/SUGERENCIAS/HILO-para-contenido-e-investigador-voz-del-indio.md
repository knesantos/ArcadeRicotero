# Del hilo principal para `contenido` e `investigador` — que el sitio intente hablar como el Indio

- **Fecha:** 2026-08-21
- **Origen:** el usuario, textual: *"analizar a fondo letras, entrevistas y demas archivo
  del indio solari para que la pagina intente hablar como el"*.
- **Estado: idea guardada. NO se hace ahora** — lo dijo el usuario en el mismo pedido
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
