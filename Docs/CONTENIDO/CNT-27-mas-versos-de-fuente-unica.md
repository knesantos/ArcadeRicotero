# CNT-27 — Más versos de fuente única para "Completá la letra" (`US-03`)

- **Fecha:** 2026-10-01.
- **Rol:** `contenido`. **Consume:** el encargo del hilo principal; `D-25` (la decisión y sus tres
  mitigaciones); `CNT-11` (criterio de curaduría de versos, mismo corpus que `US-07`); `CNT-23`
  (el criterio de "ninguna otra opción completa el verso"); `CTR-04` (`CTR-04.4` el tope de 8
  versos por tema, `CTR-04.6` los tres regímenes, `CTR-04.14` el nivel por tema); `BR-03` (qué ve
  el jugador en cada nivel); `RES-21` (el memoir, para un solo ítem); `src/data/letra.json` leído
  entero, ítem por ítem; `scripts/generar-letra.mjs` y `src/lib/letra/versos.ts`.
- **Produce:** 52 anclas nuevas en `src/data/letra-confirmaciones.json` → `fuenteUnica.items`
  (de 21 a 73), y la sugerencia
  `Docs/SUGERENCIAS/CNT-para-hilo-principal-anotaciones-y-erratas-que-pasan-el-filtro.md`.
- **No decide:** el schema, el generador, ni la regeneración de `letra.json` (la corre otro,
  `D-12`). No toca `confirmados`, `versos` ni `porDefecto`.

---

## 0. Por qué esta tanda

`US-03` salía con 21 ítems `listo`: los 14 de `T-138` y los 7 de `CNT-23`. Una partida tiene 8
rondas, así que el que jugaba dos veces veía los mismos versos. Las otras dos vías de `CTR-04.6`
siguen cerradas: nadie hizo la escucha, y hoy se intentó cotejar contra lacuerda.net como segunda
fuente y la red de este entorno bloquea el sitio (cifraclub y letras.com son del mismo dueño,
`INV-23`, no cotejan entre sí).

`D-25` se apoyaba en tres mitigaciones. La primera, el botón de corrección, no tenía casilla donde
caer: copiaba el texto y ahí moría. Según el encargo, hoy el usuario dio la casilla y el botón
empieza a llegar. Con esa pata en pie, esta pieza es la mitigación 2 a mayor escala: elegir los
versos de menor riesgo de transcripción. **No cambia lo que `D-25` ya asumió**: sigue siendo una
sola transcripción de fans por ítem, sin cotejar. Lo que cambia es cuánto de eso se publica.

## 1. El criterio

En orden de peso, el del encargo: estribillo o verso que se repite en el tema; rima que obliga la
palabra; frase hecha; palabra común bien escrita. Afuera: errata de transcripción, mayúscula rara,
guion blando, palabra mascullada, onomatopeya con grafía discutida, anotación de la cifra, y la
respuesta a la vista en el contexto. Quedaron afuera además los 26 ids que marcaron los
investigadores (18 en el encargo y 8 que llegaron a mitad de la sesión: `CL-305`, `CL-556`,
`CL-658`, `CL-1218`, `CL-634`, `CL-624`, `CL-045`, `CL-1122`). Ninguno está entre los elegidos.

Leyendo los 1.321 ítems aparecieron cinco cosas que el encargo no decía y que cambiaron qué entró:

1. **El contexto es parte del ítem.** En Fácil el jugador ve 2+2 versos y en Media 1+1 (`BR-03`),
   y el filtro de versos deja pasar líneas de anotación que terminan ahí. Leí el contexto exacto de
   cada Fácil y Media antes de elegirlo. Cayeron por eso: `CL-202` (le antecede `Parte 1 de 2 - 4x`),
   `CL-222` (`[Refrão ]]`), `CL-259` y `CL-260` (`ya no es el)` sin tilde), `CL-371` (`de que reír`
   sin tilde), `CL-557` (le antecede `BAJ0 (durante el solo de saxo)`), `CL-466` (dos versos
   después, `solo de guitarra (WAh WAH)`) y `CL-905` (le antecede `Lick de blues`).
2. **El título está a la vista en Fácil y en Media** (`BR-03`). No elegí ninguna respuesta que sea
   una palabra del título en esos dos niveles (`CL-203`, `CL-293`, `CL-429`, `CL-638` y `CL-663`
   quedaron afuera por eso). En Difícil el título no se ve; ahí no hizo falta el filtro.
3. **El tope de 8 versos visibles por tema** (`CTR-04.4`). Es una precaución, no un cerrojo, y el
   generador solo avisa. Lo respeté donde se podía: en Fácil dejé uno o dos por tema, pegados
   entre sí o a los que ya había, para que las ventanas de contexto se superpongan. En Difícil no
   se aplica porque cada ítem muestra un solo verso. Lo que quedó afuera por esto está en la
   sección 5.
4. **Las opciones salen del vocabulario del disco, y ese vocabulario trae las erratas.** Cuando
   había alternativa no elegí ítems con una opción mal escrita (`CL-214` con `futbol`, `CL-204` con
   `salon`, `CL-008` y `CL-038` con `asficio`, `CL-896` con `disfrases`). La única que entró con una
   opción así es `CL-1178` (`ensueguida`): la rima `cadena`/`condena` manda. Detalle en la
   sugerencia.
5. **Un tema con muchas erratas se descarta entero; uno con pocas, solo entran los versos cuyo
   sentido fija la palabra.** Los temas descartados están en 4.2.

A esto se suma el filtro de `CNT-23`: ninguna opción puede leerse como una alternativa defendible.
Descarté por eso, entre otros, `CL-036` (`por amor`), `CL-037` (`empieza a brillar`), `CL-873` (`el
corazón de la prisión`), `CL-020` (`te quisiera mejor`), `CL-368` (`nada va a quedar`), `CL-375`
(`perdida en mi amor`), `CL-377` (`nunca la vi cambiar`) y `CL-213` (`con silbido`).

## 2. Cómo se hizo, y qué se verificó sin poder correr nada

Leí `src/data/letra.json` completo por ids, con el verso partido, el nivel, el tema y las cuatro
opciones de cada ítem, y de los candidatos de Fácil y Media su contexto exacto. **No corrí nada**
(`D-12`). Lo que sí se pudo comprobar leyendo con búsquedas:

- Cada una de las 52 anclas aparece **una sola vez** en `letra.json` con ese `antes`, esa
  `respuesta` y ese `despues`, y la línea del `antes` está catorce renglones debajo de la línea del
  `id` que le puse. O sea que el `verso` que escribí es el que armaría `renglon()` y el id es el
  del ítem.
- Ningún verso elegido contiene guion blando, espacio duro, espacio de ancho cero ni tabulación.
  Los guiones blandos del banco están solo en `vencedores-vencidos` (`CL-160`, `CL-167` y los
  ítems vecinos, que no elegí) y en `mi-perro-dinamita`.
- El JSON de confirmaciones queda con 73 entradas (21 + 52), con la forma de siempre.

Lo que **no** pude comprobar: que el generador siga produciendo estos ids en su corrida de hoy (si
el cancionero o el filtro cambiaron desde `letra.json` del 2026-09-25, hay corrimiento, y para eso
está `--reanclar`), ni que `distractores.test.ts` y `banco.test.ts` pasen. Los comandos están al
final.

## 3. Los 52 elegidos

El nivel es el del tema en el conteo de `RES-90` (`D-46`): lo da el generador, no esta tabla.
`tema` va como slug, igual que en el banco.

### Fácil (15)

| Id | Tema | Respuesta | Por qué es de riesgo bajo |
|---|---|---|---|
| `CL-061` | `musica-para-pastillas` | mundo | Palabra común. Con `CL-058` el tema queda en 8 versos visibles. |
| `CL-071` | `semen-up` | católica | Adjetivo concreto que concuerda con "Saludable y"; ninguna opción compite. |
| `CL-082` | `jijiji` | nunca | Frase hecha. Cae entre `CL-081` y `CL-083`: no suma versos visibles. |
| `CL-145` | `aquella-solitaria-vaca-cubana` | tiempo | "Justo a tiempo", que el tema repite en varios versos. |
| `CL-150` | `vencedores-vencidos` | actual | Estribillo repetido (`CL-161` es la misma línea). |
| `CL-005` | `roto-y-mal-parado` | vida | Gancho repetido ("Quemás tu vida"). El error del tema está en otra línea, fuera del contexto. |
| `CL-200` | `ella-debe-estar-tan-linda` | esponja | Frase hecha: "tirar la esponja". |
| `CL-232` | `rock-para-los-dientes` | culpa | Frase hecha: "no es tu culpa". |
| `CL-244` | `un-pacman-en-el-savoy` | pierde | Frase hecha: "a veces gana, a veces pierde". |
| `CL-246` | `un-pacman-en-el-savoy` | vidrio | Imagen física ("ojos de vidrio"). Pegado a `CL-244`: 7 versos entre los dos. |
| `CL-295` | `nuestro-amo-juega-al-esclavo` | días | Frase hecha. Con `CL-297`, 7 versos visibles. |
| `CL-474` | `rock-para-el-negro-atila` | matón | Rima que obliga la palabra: "ratón" está a la vista en el verso de arriba. |
| `CL-476` | `rock-para-el-negro-atila` | ocasión | Frase hecha: "de ocasión". Pegado a `CL-474`: 7 versos. |
| `CL-399` | `el-pibe-de-los-astilleros` | camellos | Imagen que el sentido fija ("reyes"/"camellos"). Las erratas del tema están lejos del contexto. |
| `CL-997` | `mariposa-pontiac-rock-del-pais` | boleto | Palabra común bien escrita. La marca `X2` del tema (`CL-991`) queda fuera del contexto. |

### Media (16)

| Id | Tema | Respuesta | Por qué es de riesgo bajo |
|---|---|---|---|
| `CL-205` | `todo-un-palo` | llegó | Estribillo del tema. `Parte 1 de 2 - 4x` queda fuera de este tramo. |
| `CL-212` | `todo-un-palo` | peor | Frase hecha: "qué podría ser peor". |
| `CL-267` | `esa-estrella-era-mi-lujo` | anzuelo | Frase hecha: "morder el anzuelo". |
| `CL-274` | `esa-estrella-era-mi-lujo` | roll | Frase fija ("rock and roll"). |
| `CL-365` | `tarea-fina` | hablar | Frase hecha: "ni hablar". |
| `CL-373` | `tarea-fina` | libre | Frase hecha: "caída libre". |
| `CL-546` | `buenas-noticias` | fuego | Frase hecha: "marcados a fuego". Con `CL-537`, 6 versos. |
| `CL-640` | `yo-canibal` | bolsillos | Frase concreta ("cargar los bolsillos"); no es palabra del título. |
| `CL-642` | `yo-canibal` | mordiscos | Imagen física. Con `CL-640` y `CL-646`, 8 versos. |
| `CL-858` | `fanfarria-del-cabrio` | fuego | Frase hecha: "robar el fuego". Las erratas del tema (`fué`, `soniar`) están fuera. |
| `CL-865` | `fanfarria-del-cabrio` | prohibición | La fija el pasaje: "le prohibieron la manzana… nada más la prohibición". |
| `CL-906` | `blues-de-la-libertad` | muerto | Palabra común en una enumeración. `Lick de blues` está a dos versos y no entra. |
| `CL-908` | `blues-de-la-libertad` | soportar | Cierra la misma enumeración. Con `CL-906`, 5 versos. |
| `CL-1009` | `juguetes-perdidos` | vemos | La fija el sentido ("pájaros… que oímos cantar y nunca vemos"). |
| `CL-1011` | `juguetes-perdidos` | sonó | Rima con el verso de arriba (golpeó/sonó). |
| `CL-022` | `te-voy-a-atornillar` | poquito | Diminutivo común. Las marcas `POS-VERSO` del tema quedan fuera del tramo. |

### Difícil (21)

El verso va solo, sin contexto y sin título, así que el riesgo es la transcripción del verso y
nada más.

| Id | Tema | Respuesta | Por qué es de riesgo bajo |
|---|---|---|---|
| `CL-676` | `es-hora-de-levantarse-querido` | días | Frase hecha: "a vivir, que son dos días". |
| `CL-686` | `es-hora-de-levantarse-querido` | explicar | Par de opuestos ("difícil de explicar / fácil de enseñar"). |
| `CL-705` | `perdiendo-el-tiempo` | poco | Coincide con el título del libro *Recuerdos que mienten un poco* (`RES-21`). |
| `CL-699` | `perdiendo-el-tiempo` | miedo | Palabra común. |
| `CL-698` | `perdiendo-el-tiempo` | llamas | Imagen física que el sentido fija. |
| `CL-880` | `nuotatori-professionisti` | sangre | Frase hecha: "llevar el juego en la sangre". |
| `CL-879` | `nuotatori-professionisti` | racha | Frase hecha: "cambiar la racha". |
| `CL-1190` | `murga-de-la-virgencita` | perder | Frase hecha: "no tener nada que perder". |
| `CL-1213` | `murga-de-la-virgencita` | menos | Par de opuestos: "milagro más, milagro menos". |
| `CL-1214` | `murga-de-la-virgencita` | busca | Frase hecha: "en busca de la luz". |
| `CL-1048` | `las-increibles-andanzas-del-capitan-buscapina-en-cybersiberia` | sapito | Imagen de cuento ("princesita… sapito"). |
| `CL-1054` | ídem | corta | Frase hecha: "la vida es corta". |
| `CL-1055` | ídem | queridos | Frase hecha: "abróchense los cinturones, mis queridos". |
| `CL-484` | `sorpresa-de-shangai` | duelen | Estribillo repetido (`CL-509`). Verso limpio; el tema trae marcas de vuelta. |
| `CL-501` | `sorpresa-de-shangai` | piedras | Imagen concreta. Mismo aviso. |
| `CL-569` | `espejismo` | arrepentís | Verbo voseado bien escrito. |
| `CL-568` | `espejismo` | corazón | Palabra del cuerpo. |
| `CL-1178` | `dr-saturno` | condena | Rima que obliga la palabra (cadena/condena). Una opción trae `ensueguida`. |
| `CL-1119` | `drogocop` | muerte | Frase hecha: "vida y muerte". |
| `CL-1275` | `pensando-como-una-acelga` | pocas | Frase hecha: "a veces, muy pocas veces". |
| `CL-1283` | `pensando-como-una-acelga` | huevos | Frase hecha: "huevos de oro". |

## 4. Los descartados

### 4.1 Los que ya venían marcados

Los 26 ids del encargo y del cuarto investigador (2.). Ninguno entró.

### 4.2 Temas enteros, y por qué

- **Sin tildes en el texto**, con la errata a la vista en el contexto o en la respuesta:
  `masacre-en-el-puticlub`, `noticias-de-ayer`, `vamos-las-bandas`, `yo-no-me-cai-del-cielo`,
  `la-hija-del-fletero`, `rock-yugular`, `luzbelito-y-las-sirenas`, `la-murga-de-los-renegados`,
  `templo-de-momo`, `lavi-rap`, `pool-averna-y-papusa`, `murga-purga`, `sheriff`, `rato-molhado`,
  `una-piba-con-la-remera-de-greenpeace`, `la-pequena-novia-del-carioca`.
- **Anotaciones de cifra, acordes o de estructura mezclados con la letra**: `superlogico`,
  `ropa-sucia`, `blues-de-la-artilleria` (ya tenía dos), `mi-perro-dinamita`, `pogo`, `alien-duce`,
  `la-dicha-no-es-una-cosa-alegre`, `queso-ruso`, `nueva-roma`, `el-lobo-caido` (ya tenía uno),
  `ladron-de-mi-cerebro` (ya tenía uno), `botija-rapado`, `cruz-diablo`,
  `ya-nadie-va-a-escuchar-tu-remera`, `heroe-del-whisky`, `susanita`, `ella-baila-con-todos`,
  `el-arte-del-buen-comer`, `te-voy-a-atornillar` (entra solo `CL-022`).
- **Erratas de palabra**: `gran-lady`, `salando-las-heridas` (ya tenía uno),
  `el-infierno-esta-encantador-esta-noche`, `cana-seca-y-un-membrillo` (`durmio`, `sofoco`).
- **Otros**: `nam-fri-frufi-fali-fru` (las opciones compiten con la respuesta),
  `cancion-para-naufragios` (el único ítem tiene la respuesta casi igual al título).
- **Temas que entraron aunque tienen errata o anotaciones en otras líneas** (los ítems elegidos no
  las tocan): `roto-y-mal-parado`, `el-pibe-de-los-astilleros`, `fanfarria-del-cabrio`,
  `juguetes-perdidos`, `sorpresa-de-shangai`, `dr-saturno`, `drogocop` y
  `pensando-como-una-acelga`. Los cuatro últimos son Difíciles, donde el contexto no existe. En
  los demás entraron uno o dos ítems, y cada uno con su contexto leído.

### 4.3 Ítems sueltos en temas buenos

Por contexto con anotación o errata, ver la sección 1 (punto 1). Por opción mal escrita, punto 4.
Por opción defendible, lo de arriba. Por tope de 8 o por cercanía con otro ítem, la sección 5.

### 4.4 Un aviso sobre una ancla vieja

**`CL-601`** (`Recuerdo como su mirada me [volteo]`, de `CNT-23`) tiene la **respuesta sin tilde**:
`volteo` por `volteó`. Es la misma clase de errata que los investigadores marcaron en `CL-427`,
`CL-445` y `CL-581`, y yo la había elegido. El jugador no pierde nada (la opción correcta es la
única que coincide con el verso), pero queda una respuesta mal escrita en pantalla. **No la saqué**:
el encargo era sumar. Si el hilo principal prefiere retirarla, se borra de `fuenteUnica.items` y
`US-03` queda en 72.

## 5. La reserva (leída y no cargada)

Ítems que cumplen el criterio y quedaron afuera para no pasar el tope de 8 versos, para no repetir
la respuesta o para que los tres niveles queden parejos. Los de Fácil tienen el contexto leído; los
de Difícil no lo necesitan. **No están contrastados con el generador.**

| Id | Tema | Nivel | Verso exacto | Por qué quedó afuera |
|---|---|---|---|---|
| `CL-077` | `jijiji` | Fácil | `Una noche de cristal que se hace [añicos]` | el tema pasaría de 7 a 11 versos |
| `CL-093` | `jijiji` | Fácil | `Ibas corriendo a la [deriva]` | de 7 a 12 |
| `CL-062` | `musica-para-pastillas` | Fácil | `Puede dar sólo lo que [tiene] para dar` | de 8 a 9; ya entró `CL-061` |
| `CL-237` | `un-pacman-en-el-savoy` | Fácil | `Si tu grito es un [ladrido] ,` | de 7 a 12 |
| `CL-194` | `ella-debe-estar-tan-linda` | Fácil | `Conduje toda la noche reventando los [cambios]` | de 5 a 10 |
| `CL-549` | `buenas-noticias` | Media | `si nada te [conmueve]` | de 6 a 9 |
| `CL-360` | `tarea-fina` | Media | `¿Vas a volver a herirme [otra] vez?` | de 6 a 9 |
| `CL-648` | `yo-canibal` | Media | `Me cansé de tanto [esperar] .` | de 8 a 10 |
| `CL-665` | `es-hora-de-levantarse-querido` | Difícil | `Soñaste [angelitos]` | el tema ya llega a 4 |
| `CL-677` | `es-hora-de-levantarse-querido` | Difícil | `Descolgalos del [laurel]` | ídem |
| `CL-1188` | `murga-de-la-virgencita` | Difícil | `Es aguijón picante y [miel]` | parejidad de niveles |
| `CL-1193` | `murga-de-la-virgencita` | Difícil | `Los coches van y [vienen]` | ídem |
| `CL-1204` | `murga-de-la-virgencita` | Difícil | `Para el túnel del [amor]` | ídem |
| `CL-1051` | `las-increibles-andanzas-del-capitan-buscapina-en-cybersiberia` | Difícil | `Y vaga con su corazón entre las [manos] .` | ídem |
| `CL-562` | `espejismo` | Difícil | `Cerrás los ojos y ves la boutique del [rock]` | ídem |
| `CL-503` | `sorpresa-de-shangai` | Difícil | `falopas duras en tipos [blandos]` | ídem |
| `CL-874` | `nuotatori-professionisti` | Difícil | `Pagan con promesas los [nenes] de oro.` | ídem |
| `CL-1281` | `pensando-como-una-acelga` | Difícil | `Vas en carne [viva]` | ídem; una opción trae `galpon` |
| `CL-945` | `me-matan-limon` | Difícil | `Por los techos viene el [bloque]` | ídem |

Si alguien decide relajar el tope de 8, los Fáciles y Medios de arriba se suman sin releer nada más.

## 6. La cuenta final

| | Fácil | Media | Difícil | Total |
|---|---:|---:|---:|---:|
| `listo` antes (`T-138` + `CNT-23`) | 9 | 7 | 5 | 21 |
| Suma `CNT-27` | 15 | 16 | 21 | 52 |
| **`listo` después, si el generador los promueve a todos** | **24** | **23** | **26** | **73** |

- **Temas:** de 15 a 39. Ningún tema aporta más de 3 en este lote, y ninguno pasa de 4 contando los
  anteriores (`es-hora-de-levantarse-querido` queda en 4).
- **Respuestas repetidas:** `fuego` dos veces (`CL-546`, `CL-858`, las dos Media) y `días` dos veces
  (`CL-295` Fácil, `CL-676` Difícil). Ninguna otra respuesta se repite en el lote.
- **Versos visibles por tema** (`CTR-04.4`), contados por posición en el tema: ninguno de los que
  toqué pasa de 8 (`musica-para-pastillas`, `vencedores-vencidos` y `yo-canibal` llegan justo a 8;
  `jijiji`, `un-pacman-en-el-savoy`, `rock-para-el-negro-atila` y `nuestro-amo-juega-al-esclavo`,
  a 7). Es una estimación mía y la corrida del generador la confirma. **El que ya pasaba antes de
  esta tanda es `un-poco-de-amor-frances`** (`CL-307` y `CL-317`, 10 versos): si el generador avisa
  solo por ese, mi cuenta está bien.
- **Si el conteo en vivo se refresca**, el nivel de un tema puede cambiar y con él cuánto contexto
  pide su ítem. Las anclas son del verso, no del nivel: lo que pase queda dicho por el generador
  ("le faltan N versos para el contexto").
- **Tope de la tanda: 52 y no 100.** El material limpio se acabó antes. 40 temas no aportaron
  ninguna ancla por erratas o anotaciones demasiado seguidas (4.2), y el tope de 8 versos y
  la parejidad de niveles recortaron lo demás (sección 5). El encargo decía que no hay piso, y no
  rellené para llegar a un número.

## Verificación

No la puedo correr (`D-12`). La deja escrita para quien tenga Bash:

```bash
npm run generar-letra                       # tiene que dar LISTOS: 73 {"facil":24,"media":23,"dificil":26}
node --test 'src/lib/letra/*.test.ts'       # distractores.test.ts, banco.test.ts y el resto, sobre el banco regenerado
```

Qué esperar de la primera:

- **`✔ Piso de US-03 cumplido: 73 ítems jugables`**, y `Fáciles jugables: 24`.
- **Un aviso de tope** (`temas listo con más de 8 versos distintos`) solo por `un-poco-de-amor-frances`.
  Si lista otro tema, mi estimación falló en ese y se me devuelve.
- **`seleccion(es) apuntan a otro verso`** → los ids se corrieron desde que se generó el banco que
  leí. Corré con `-- --reanclar`: las anclas llevan el verso y se mudan solas.
- **`le faltan N antes/después para el contexto`** → un tema cambió de nivel y ese verso ya no tiene
  vecinos suficientes. Eso me lo devuelven y elijo otro del mismo tema.

## Lo que no toqué

`src/data/letra.json` (lo regenera quien corra el generador), `confirmados`, `versos`, `porDefecto`
y `enEspera` de `letra-confirmaciones.json`, el schema, el código y el test. La sugerencia sobre
las anotaciones que pasan el filtro y las erratas que entran como opción está en `Docs/SUGERENCIAS/`.
