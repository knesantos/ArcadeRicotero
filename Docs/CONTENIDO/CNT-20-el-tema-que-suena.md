# CNT-20 — El tema que suena durante la partida (`temaFijo`)

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-18
- **Estado:** propuesta, lista para cablear.
- **Consume:** `Docs/DECISIONES.md` `D-39` (el juego suena entero, condición 3: el disco no
  se nombra en pantalla), `Docs/UX/UX-30-cielo-e-infierno-en-la-mezcla.md` §5 (sale de
  *Gulp!*, el mismo disco que viste la paleta; no puede ser uno de los dos títulos que
  anclan el par; el disco no se nombra), `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md` (`D-39`
  consecuencia 3: el tema es de `contenido` con `experiencia`), `src/data/cancionero.json`
  (leído entero el bloque de *Gulp!*, doce pistas).
- **Resuelve:** `T-235`.

## 1. El tema elegido

> **`slug: "nam-fri-frufi-fali-fru"`** — *"Ñam fri frufi fali fru"*, *Gulp!* (1985), pista 9.

Verificado leyendo `src/data/cancionero.json`, no de memoria:

```
"slug": "nam-fri-frufi-fali-fru",
"titulo": "Ñam fri frufi fali fru",
"disco": "gulp",
"pista": 9,
"anio": 1985,
```

## 2. Por qué este y no otro de los doce de *Gulp!*

*Gulp!* tiene doce entradas en el cancionero: `barbazul-versus-el-amor-letal`,
`la-bestia-pop`, `roto-y-mal-parado`, `pierre-el-vitricida`,
`unos-pocos-peligros-sensatos`, `yo-no-me-cai-del-cielo`, `te-voy-a-atornillar`,
`superlogico`, `nam-fri-frufi-fali-fru`, `el-infierno-esta-encantador-esta-noche`,
`criminal-mambo`, `pianito-jam`.

Descartados con motivo:

- **`yo-no-me-cai-del-cielo` y `el-infierno-esta-encantador-esta-noche`**: son los dos
  títulos que anclan el par elemental del juego (`UX-30 §1`). Que sonara uno de los dos
  mientras se juega convertiría el nombre del tema en un cartel explicando la mecánica —
  exactamente lo que `UX-30 §5` prohíbe ("un título arriba de la pantalla explicándolo
  sería explicarlo igual").
- **`unos-pocos-peligros-sensatos` y `roto-y-mal-parado`**: quedan afuera por prudencia,
  no por regla escrita. "Peligros" y "roto y mal parado" rozan el campo semántico del
  fracaso y del terreno hostil que el juego trabaja con tanto cuidado (`UX-29`, `BR-24`).
  No hace falta arriesgar la lectura cuando hay ocho temas más sin ese roce.
- **`pianito-jam`**: es un instrumental corto, más cerca de un interludio que de un tema
  con identidad propia — no aporta nada que los otros ocho no den mejor.

Quedan seis candidatos limpios: `barbazul-versus-el-amor-letal`, `la-bestia-pop`,
`pierre-el-vitricida`, `te-voy-a-atornillar`, `superlogico`, `criminal-mambo`. De esos,
elijo **`nam-fri-frufi-fali-fru`** — está afuera de la lista de seis de arriba a propósito,
y va primero en la explicación porque es la elección final, así que la reordeno acá:

**`nam-fri-frufi-fali-fru`** es un título de puro sonido, sin significado que se pueda leer
como pista de nada — ni terreno, ni fracaso, ni pareja, ni elemento. Es la opción con menos
riesgo de que alguien le busque una segunda lectura, y encaja con el tono de un juego que
no explica su mecánica por texto (`UX-30 §3`): un nombre que tampoco explica nada al lado
de una pantalla que tampoco explica nada. Y es letra pura de la banda tocando con el
sinsentido, que es un registro que a este sitio ya le sirvió antes (el "intruso" de
`voz-ricotera.md` §4.5).

La letra del tema (verificada en el JSON, no citada de memoria) es sobre un amor
tambaleante y no toca en ningún verso el campo de lo que pasa en pantalla — terreno,
puertas, caída, entrada — así que tampoco hay riesgo de que la letra, si en algún momento
se muestra en otra pantalla del sitio, entre en conflicto con lo que el jugador ve acá.

## 3. Lo que esta nota no decide

- **Que el disco no se nombre en pantalla.** Ya está resuelto por `D-39` condición 3 y
  `UX-30 §5`; esta nota lo hereda y no lo repite en ningún texto visible. El título del
  tema sí se puede mostrar (`D-39` condición 3, primera mitad) si `experiencia`/`hilo
  principal` deciden que el juego muestra "sonando ahora" en algún lado — pero **nunca
  junto a la palabra "Gulp"**.
- **Cómo se transmite el audio** (streaming, sin precarga, sin decodificar el tema entero
  en `AudioBuffer`) — es de `arquitectura`, `D-39` condición 1 y `ADR-08.9`.
- **El nombre de campo en el código** de `rutas-sonoras.ts`/`cinta.ts` — es de quien
  cablea (`T-239`, `T-244`).

## 4. Qué no tiene comando y se mira a ojo

Según `Docs/ORQ/ORQ-plan-ciclo-15.md` §3 (fila `T-235`): **que el título elegido no sea uno
que explique la mecánica no tiene comando: lo mira `revisor`**, con el razonamiento de §2
de esta nota como vara.

Lo que sí corre solo, y ya lo corrí a mano leyendo el JSON en vez de citarlo de memoria:

```
rg -n "\"slug\": \"nam-fri-frufi-fali-fru\"" -A 3 src/data/cancionero.json
```

Devuelve la entrada con `"disco": "gulp"` (confirmado arriba, §1). Que el disco no se
nombre en pantalla lo audita `rg -in "gulp" src/lib/skayboy/` (sin resultados esperados) en
`T-244`, una vez que exista ese módulo.

## Bloqueos

Ninguno. La elección del tema es criterio de tono, no un hecho verificable que necesite
ficha `RES-XX`; el dato que sí es verificable —que el tema exista y sea de *Gulp!*— está
verificado contra `src/data/cancionero.json` en §1, no citado de memoria.

## Siguiente

`experiencia` y `hilo principal` necesitan el `slug` de §1 para cablear el modo
`tema-fijo` de la cinta (`T-235` con `experiencia`, `T-244` para `rutas-sonoras.ts`,
`cinta.ts`, `rocola.ts`).
