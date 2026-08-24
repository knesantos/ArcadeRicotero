# CNT-08 — Lote de `letras`: las 10 preguntas que cierran el piso de `US-01`

- **Fecha:** 2026-08-24
- **Rol:** `contenido` · **Tarea:** `T-102` del ciclo 7.
- **Consume:** `Docs/ORQ/ORQ-plan-ciclo-7.md` (el criterio que define `T-102`),
  `Docs/ARQ/ARQ-schema-quiz.md` (`CTR-02`), `Docs/INVESTIGACION/INV-20-fuentes-primarias.md`
  (`RES-20`, `RES-21`, `RES-22`), `Docs/INVESTIGACION/INV-48-contexto-por-tema.md`
  (`RES-48`), `Docs/INVESTIGACION/INV-02-banda-cultura-estetica.md` (`RES-08`),
  `Docs/CONTENIDO/CNT-03-criterios-discografia.md`, `.claude/rules/voz-ricotera.md`.
- **Toca:** `src/data/quiz.json` — agrega `QZ-031`..`QZ-040`, categoría `letras`,
  2 `media` + 8 `dificil`, ninguna `facil` (aritmética del piso: hoy 10/13/7, con estas
  diez cierra en 10/15/15).
- **Bloquea/habilita:** cierra el piso de 40 de `US-01`. Habilita `T-106` (`revisor`).

## Criterio de selección — el mundo de las letras, nunca el verso

La instrucción del plan es explícita: `letras` no cita un verso, porque ese es el trabajo
de `US-03`. Elegí las diez preguntas repartidas en los cuatro tipos que habilita el plan,
buscando que cada una se apoye en un hecho puntual y citable, no en "es de discografía":

| Tipo | Ítems | De qué se agarran |
|---|---|---|
| **Autoría** | `QZ-031` | `RES-20`: las dos únicas excepciones a la firma Solari–Beilinson (ambas con Semilla Bucciarelli) — usé una («Mi perro dinamita») como respuesta y dejé la otra («Ella debe estar tan linda») mencionada en la explicación, para no repetir la misma pregunta con las dos caras. |
| **Personaje** | `QZ-032`, `QZ-033` | `RES-20` (Lupus el Lobo / Rulo el Cordero, el concepto detrás de *Lobo suelto, cordero atado*) y `RES-21`+`RES-22` (Capitán Buscapina como inspiración del último videoclip de la banda, contado por el propio Indio). |
| **Título** | `QZ-034`, `QZ-039`, `QZ-040` | Los tres salen de `RES-20` puro (tracklist): dos títulos de un mismo disco que arrancan igual («Todo…»), el título completo de la pista que da nombre al disco *Luzbelito* (que no es solo "Luzbelito"), y el track oculto de *Gulp!* («Pianito - Jam»). |
| **Documentado** | `QZ-035`, `QZ-036`, `QZ-037`, `QZ-038` | `RES-48` (la nota apócrifa del COMFER en *Gulp!*, la leyenda desmentida de Luca Prodan como coautor, el saludo de Skay a Todo un palo en Quilmes 2023) y `RES-21`+`RES-22` (los versos del sobre interno de *Oktubre* que no se cantan en el disco — un hallazgo distinto del que ya usa `QZ-029` en `historia`, mismo comentario del libro). |

**Ninguna pregunta necesita transcribir un verso para entenderse.** Las cuatro que usan
`testimonio` (`QZ-033`, `QZ-037`, y por extensión el resto de la categoría que las
acompaña) preguntan "qué contó el Indio", no "qué pasó" — regla 4 de `CTR-02.4`.

## De dónde sale cada respuesta correcta

- `QZ-031` — `RES-20`, sección "Autoría".
- `QZ-032` — `RES-20`, nota bajo el tracklist de *Lobo suelto, cordero atado* vol. 1/2.
- `QZ-033` — `RES-21` (admite la obra) + `RES-22` (sostiene la afirmación: el videoclip
  inspirado en Capitán Buscapina) + `RES-20` (confirma que el personaje da nombre a la
  pista 1 de *Último bondi a Finisterre*).
- `QZ-034` — `RES-20`, tracklist de *Un baión para el ojo idiota*.
- `QZ-035` — `RES-48`, ficha de "Criminal Mambo" (nota apócrifa del COMFER, fuente
  Wikipedia leída completa).
- `QZ-036` — `RES-48`, misma ficha (la leyenda de Luca Prodan, que la propia fuente marca
  como rumor falso).
- `QZ-037` — `RES-21` + `RES-22` (el mismo comentario de *Oktubre* que usa `QZ-029`, pero
  una afirmación distinta: los versos que cierran la letra impresa y no se cantan).
- `QZ-038` — `RES-48`, ficha de "Todo un palo" (el saludo de Skay en Quilmes, 2023, fuente
  leída completa y verificada, no solo indexada).
- `QZ-039` — `RES-20`, tracklist de *Luzbelito*.
- `QZ-040` — `RES-20`, tracklist de *Gulp!* y la nota sobre el track oculto.

**Nivel:** `media` para `QZ-033` (Capitán Buscapina es un personaje bastante reconocible
para quien sigue a la banda) y `QZ-040` (el track oculto de *Gulp!* es una trivia
relativamente difundida). Las otras ocho piden precisión de tracklist o del memoir que
un fan casual no tiene a mano — de ahí `dificil`.

## Qué descarté, y por qué (para `revisor` en `T-106`)

1. **El cambio de nombre en "Susanita" (de *Lobo suelto*), hacia el apodo de la hija de
   Menem.** Está en `RES-48`, pero la propia ficha avisa: *"No releí el PDF para
   confirmarlo de primera mano: lo encontré indexado en notas que citan el mismo libro."*
   El schema exige `testimonio.ubicacion` con capítulo o comentario de disco concreto, y no
   tengo ese dato verificado de primera mano — inventarlo sería exactamente el riesgo que
   `CTR-02.4` regla 3 existe para evitar. Queda para cuando alguien re-extraiga el pasaje
   exacto del PDF.
2. **El significado de "Todo un palo" según el Indio** (la advertencia a no dejarse
   llevar). Mismo problema que el punto 1: `RES-48` dice *"no lo verifiqué releyendo el
   PDF"*. Descartado por la misma razón.
3. **El origen del título del libro** *Recuerdos que mienten un poco* (sale de un verso de
   "Perdiendo el tiempo"). Está en `INV-02`, pero adentro del "Apéndice — Bibliografía",
   que el propio documento marca *"sin ID a propósito… ninguna pregunta del quiz va a citar
   esta lista"*. No hay `RES-XX` que respalde puntualmente ese hecho. Si se quiere usar,
   hace falta pedirle a `investigador` que lo fiche con ID propio.
4. **La historia de grabación de "Ropa sucia"** (la maqueta, el saxo regrabado por sugerencia
   de Gustavo Gauvry, el diálogo con el tango *Traicionera*). Las fuentes de `RES-48` para
   este tema están marcadas **"indexado"**, no **"leído completo"** — un escalón más flojo
   que el resto del lote, que sí tiene lectura completa donde importa (Criminal Mambo,
   Todo un palo). Queda disponible para un lote futuro si se sube la confianza de la fuente.
5. **Una segunda pregunta de autoría** sobre "Ella debe estar tan linda" (la otra excepción
   con Bucciarelli). Habría sido la misma pregunta que `QZ-031` mirada del otro lado.
   Preferí una sola pregunta de autoría bien hecha y usar la segunda canción como dato
   extra en la explicación.
6. **Cualquier pregunta que dependiera de "9 o 10 discos" o de la fecha exacta de *Gulp!*.**
   Los dos vetos siguen vigentes (`CNT-03`, `ESTADO.md`) y ninguna de las diez los toca.
7. **Cualquier formulación que necesitara citar un verso para entenderse.** Es el criterio
   de fondo de `T-102`: si una pregunta no cerraba sin transcribir una línea de letra,
   quedó afuera antes de llegar a esta lista.

## Una nota sobre `testimonio.ubicacion` repetida

`QZ-033` reutiliza `"comentario de «Último bondi a Finisterre»"` (ya usada en `QZ-026` y
`QZ-030`) y `QZ-037` reutiliza `"comentario de «Oktubre»"` (ya usada en `QZ-029`). No es un
descuido: las cuatro preguntas nuevas y las tres viejas sacan afirmaciones distintas del
mismo tramo del libro — el comentario que el Indio dedica a cada disco cubre varios hechos,
y cada ítem cita uno diferente. Lo dejo anotado para que `T-106` no lo lea como una señal de
alarma sin mirar antes qué afirma cada uno (`CTR-02.6`, consulta 7).

## Verificación

No la puedo correr (`D-12`). La deja escrita para que la corra `revisor` o el hilo
principal:

```bash
npm test
```

Y el chequeo de reparto sobre `src/data/quiz.json`: 40 ítems, 10 por categoría
(`historia`, `discos`, `letras`, `mitologia`), 10 `facil` / 15 `media` / 15 `dificil`. Ya
lo conté a mano contra el archivo antes de cerrar este documento: da exacto.

---

## Corrección — `T-108` (ciclo 7): seis defectos reales sobre este lote

Dos revisiones pasaron sobre los diez ítems de este lote: `REV-06` (formal, sin hallazgo
bloqueante) y una pasada adversarial que fue al PDF del memoir y a las fichas, verificada
ítem por ítem por el hilo principal contra `RES-48` y el archivo. Los seis defectos que
encontró son reales, no opinión. Corregidos acá, sobre `src/data/quiz.json`. La aritmética
del piso no se movió: sigue en 40 / 10-10-10-10 / 10-15-15, porque ningún arreglo cambió
una `dificultad` ni una `categoria`.

### 1. `QZ-035` — la explicación afirmaba dos cosas falsas

Corregido: ya no llama al COMFER "el organismo de censura de la dictadura" — era el Comité
Federal de Radiodifusión, ente real que siguió en democracia hasta 2009; la nota apócrifa
sí está fechada como si fuera de la dictadura (`RES-48`), pero eso es un atributo del papel,
no del organismo. Se corrigió "nunca hubo censura real" por "nunca hubo una censura real
sobre ese tema" — `RES-48` lo dice así, con el artículo, y sin él la frase suena a que no
hubo censura real en la dictadura, punto, que es falso. Y se sacó "por su letra" del
enunciado: el chiste de la nota es al revés — advierte sobre un tema cuya letra casi no dice
nada (`RES-48`, sección "Criminal Mambo", cita de Wikipedia leída completa). No abrí el PDF
del memoir para esta corrección: `RES-48` ya alcanza, citada completa, para sostener las
tres correcciones. La respuesta (COMFER) no cambió.

### 2. `QZ-026` le regalaba la respuesta a `QZ-033`

Corregido: se sacó de la explicación de `QZ-026` la oración sobre el tercer y último
videoclip (inspirado en «Capitán Buscapina»), que es la respuesta de `QZ-033`. Queda solo
el dato de la tapa de superhéroes, que es lo que pregunta `QZ-026`. `BR-01` ordena la ronda
de fácil a difícil, así que esta fuga se veía siempre que las dos preguntas coincidían en
una partida — ahora no puede pasar.

### 3. `QZ-040` tenía una cláusula sin ficha

Corregido: se sacó "sin aparecer en el arte original del disco" del enunciado. Ninguna
ficha (`RES-20`, la Redondopedia, el memoir) sostiene ese detalle, y depende de la edición
del vinilo — territorio de coleccionista donde no conviene afirmar de más sin fuente. La
pregunta queda igual de válida sin esa cláusula: «Pianito - Jam» sigue siendo el track
oculto de *Gulp!* según `RES-20`.

### 4. `QZ-036` tenía una imposibilidad cronológica y un rótulo que exageraba

Corregido en tres frentes:
- El enunciado ahora dice explícito que «Criminal Mambo» salió en 1985 y que la coescritura
  se rumorea a partir de un episodio de 1987 — la imposibilidad queda a la vista en vez de
  escondida en una cadena causal que "cerraba" de más.
- Se sacó "este referente del post-punk local": esa descripción, sumada al año 1987, dejaba
  una sola opción posible entre los cuatro nombres. Ahora dice "este músico", y con eso la
  pregunta vuelve a ser difícil de verdad, sin bajarle el nivel ni tocar la aritmética del
  piso.
- `rotuloLeyenda` pasó de "Rumor sin fundamento" a "Coautoría desmentida": la coautoría es
  falsa, sí, pero el episodio (Prodan tocando el tema de improviso en el boliche Cemento,
  1987) tiene núcleo real en `RES-48`. Un rótulo que exagera la falsedad de un episodio real
  es tan poco confiable como uno que esconde que es falso.

### 5. `QZ-032` — dos ajustes pedidos y un tercero por precaución

- La explicación ya no abre con "El álbum doble de 1993": esa afirmación roza el veto de
  `CNT-03` sobre si *Lobo suelto, cordero atado* es álbum doble o dos discos, y esta
  pregunta no la necesita para nada — pregunta por el nombre de un personaje, no por el
  conteo de discos.
- Se sacó "según la ficha de discografía" del final de la explicación: rompía la cuarta
  pared (`FIND-23`, el mismo patrón que `FIND-20` ya había marcado en `QZ-017` durante
  `REV-04`, un ciclo antes).
- Se sacó "dos personajes enfrentados" del enunciado. La caracterización de la relación
  entre Lupus el Lobo y Rulo el Cordero depende de a qué fuente mirás: `RES-20` (Wikipedia)
  dice "personajes opuestos", y el hilo principal verificó contra el memoir que el propio
  Indio lo recuerda distinto — como una colección de temas a la que el concepto le llegó
  después, y a los dos personajes como socios, no como enfrentados. No tengo una ficha
  propia con la ubicación exacta de ese pasaje para citarlo con precisión (`testimonio`
  exige capítulo o comentario de disco concreto), así que en vez de reemplazar una
  caracterización dudosa por otra sin fichar, saqué la caracterización entera: la pregunta
  no necesita decir si están enfrentados o son socios para funcionar. Si `investigador`
  ficha el pasaje exacto del memoir, esto se puede enriquecer en un lote futuro.

### 6. `FIND-22` — `sensibleA` recalculado ítem por ítem

Los diez ítems de este lote (`QZ-031` a `QZ-040`) pasan de `sensibleA: ["letra"]` a
`sensibleA: []`. Ninguno cita un verso —fue el criterio de selección del lote desde
`T-102`— así que ninguno toca el material que protege `CNT-01` sección C (citas parciales
de versos, en "completar la letra"). El patrón ya estaba en los 30 ítems previos, incluidos
los testimonios sobre tapas y videoclips: describir un hecho sobre una letra, un personaje
o un título no es lo mismo que citarla. Recalculado ítem por ítem, no por categoría, como
pide `FIND-22`.

### 7. `FIND-24` — no tocado, como corresponde

`QZ-038` (el saludo de Skay en Quilmes 2023) se queda en `letras`, mismo enunciado y misma
explicación: si encaja floja como categoría es decisión de `producto`, no mía. Lo único que
cambió es su `sensibleA` (punto 6, arriba — le tocaba igual que al resto del lote). Queda
anotado acá como pendiente ajeno, sin tocar `Docs/REVISIONES/`.

## Verificación de la corrección

```bash
npm test
```
