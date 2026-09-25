# CNT-23 — Siete anclas de repuesto para "Completá la letra" (`US-03`)

- **Fecha:** 2026-09-25, rama `ciclo-16/lo-barato-que-se-ve`.
- **Rol:** `contenido`. **Consume:** el pedido del hilo principal (medido jugando en el
  teléfono: 5 de 19 ítems `listo` mostraban la respuesta escrita en su propio contexto),
  `Docs/SUGERENCIAS/HILO-para-contenido-y-arquitectura-los-distractores-se-delataban.md`,
  `Docs/SUGERENCIAS/HILO-para-contenido-dos-anclas-sin-vecinos.md`, `PRD-alcance-v1.md`
  (piso de `US-03`: 15, `BR-03`), `CNT-11` (criterio de curaduría de versos, mismo
  proyecto que `US-07`), `D-25` (la curaduría es sobre el `verso`, no sobre el `id`).
- **Produce:** `src/data/letra-confirmaciones.json` con 7 versos nuevos en
  `fuenteUnica.items`, y `fuenteUnica.enEspera` vacío (las 7 anclas que esperaban
  reemplazo ya lo tienen).
- **No decide:** el schema (`CTR-04`, `arquitectura`), la regeneración de `letra.json`
  (la corre el hilo principal, `D-12` me lo impide a mí), ni la dificultad de cada ítem —
  eso lo calcula el generador por tercios de conteo en vivo sobre el tema (`D-46`,
  precisión del 2026-09-24), no lo asigna `contenido` a mano en este juego desde entonces.

---

## 0. El punto de partida

Ocho anclas quedaron en `fuenteUnica.enEspera` sin reemplazo: dos desde `T-288` (versos
sin vecinos suficientes tras el recorte con conteo en vivo) y cinco desde hoy (la
respuesta se copiaba de un verso vecino del propio ítem, ahora descartado por
`sirveDeRespuesta()`). El banco jugable había bajado a 14 (8 fácil, 2 media, 4 difícil),
por debajo del piso de 15, y con solo 2 medias — toda partida repetía el mismo tramo
medio.

Elegí **7 de 7**: no hizo falta bajar al mínimo aceptable de 5. El criterio de selección
fue leer cada candidato de `candidatos-letra.txt` con sus cuatro opciones ya sorteadas
por el script y descartar todo verso donde alguna opción se leyera como una alternativa
defendible — no solo si encajaba gramaticalmente, sino si un jugador que no se sabe el
tema podría justificar esa opción como la correcta.

---

## 1. Los siete elegidos

| Verso (ancla) | Id | Tema (disco) | Nivel | Reemplaza a |
|---|---|---|---|---|
| «Y el premio a [pique] se fue» | `CL-407` | Salando las heridas (*la mosca y la sopa*) | Media | «Con sus muecas rotas [cromadas]» |
| «Llegan buenas nuevas de los [escondidos] ,» | `CL-537` | Buenas noticias (*lobo suelto*) | Media | «Que los buenos [volvieron]» |
| «tanta [infidelidad] .» | `CL-619` | El lobo caído (*lobo suelto*) | Media | «Tu esqueleto te trajo hasta [aquí]» |
| «Mi racha de novato nunca [cambiará] .» | `CL-646` | Yo caníbal (*cordero atado*) | Media | «es un criminal [mambo] .» |
| «él es el [peligro] ,» | `CL-657` | Ladrón de mi cerebro (*cordero atado*) | Media | «[Superlógico] , sí, sí, sí.» |
| «Muchachitas [fatales]» | `CL-058` | Música para pastillas (*oktubre*) | Fácil | «[Superrígido] , sí.» |
| «Recuerdo como su mirada me [volteo]» | `CL-601` | La hija del fletero (*lobo suelto*) | Difícil | «Rockeros bonitos, [educaditos]» |

**Reparto de nivel:** 5 medias (quedan 7 sobre 21, en vez de 2 sobre 14), 1 fácil, 1
difícil. El tramo medio deja de repetir siempre las mismas dos preguntas.

**Reparto de tema y disco:** siete temas distintos, ninguno con un `listo` previo — no
tocan ningún tope de `CTR-04.4` (los que ya están en 2: *Blues de la artillería*,
*Vencedores vencidos*, *¡Es hora de levantarse querido!*, *Dr. Saturno*, y los que están
en 1 sin usar acá: *Nuestro amo juega al esclavo*, *Un ángel para tu soledad*). Los
discos: *la mosca y la sopa* (1), *lobo suelto* (3), *cordero atado* (2), *oktubre* (1) —
los dos primeros no tenían ningún `listo` hasta hoy (*lobo suelto* tenía uno, *Cuando
anochezca*; *cordero atado* tenía dos, ambos de *¡Es hora de levantarse querido!*), así
que el banco deja de concentrarse en *Un baión para el ojo idiota* y *Bang bang, estás
liquidado*.

**`CL-058` reemplaza dentro del mismo tema** al hueco de "educaditos" que quedó en
espera (mismo criterio que usó `T-288` con "cromadas"/"volvieron": el reemplazo puede
ser del mismo tema o de otro). Los otros seis van a temas nuevos en el banco.

---

## 2. Por qué cada uno pasa el filtro de "ninguna otra opción completa el verso"

- **`CL-407` (pique):** "irse a pique" es una frase hecha reconocible; ninguno de
  `cuida`/`montado`/`parte` arma una expresión fija con "a ___ se fue".
- **`CL-537` (escondidos):** único sustantivo plural entre las opciones — `espacio` y
  `secreto` son singulares, `chasquear` es infinitivo. Ninguno concuerda con "de los
  ___".
- **`CL-619` (infidelidad):** único sustantivo femenino singular — `acalorado` es
  masculino, `acostumbre` es una forma verbal, `diamantes` es masculino plural. Ninguno
  concuerda con "tanta ___".
- **`CL-646` (cambiará):** único verbo conjugado entre las opciones — `eternamente` es
  adverbio, `bolsillos` y `desterrados` son sustantivo/participio sin el auxiliar que
  necesitarían. Además, `eternamente` es un distractor sutil: "nunca eternamente" suena a
  frase hecha hasta que se piensa dos veces, y ahí se cae por contradictorio.
- **`CL-657` (peligro):** sin competencia real. Revisé `saltar` con cuidado —"el saltar"
  nominalizado existe en español ("el vivir", "el cantar")— pero "él es el saltar" no
  arma una idea coherente como sujeto de una frase de identidad, a diferencia de "él es
  el peligro". Tampoco coincide con ninguna palabra del título del tema (evita el
  problema que ya tuvieron "Superlógico"/"Superrígido": la palabra del título visible en
  el nivel Media o Fácil).
- **`CL-058` (fatales):** único adjetivo que concuerda en género y número con
  "Muchachitas" (`deriva`, `tiro`, `gusta` no concuerdan ni como adjetivo).
- **`CL-601` (volteo):** único verbo conjugado — `además` es adverbio, `chasquear` es
  infinitivo, `gato` es sustantivo. Ninguno completa "su mirada me ___".

**Lo que descarté por este mismo filtro, para que quede registrado:**

- Toda la tanda de *El infierno está encantador esta noche* (`CL-044` a `CL-057`): la
  respuesta cae en varios casos sobre la palabra del título ("encantador"), visible en el
  nivel Media — el mismo problema que ya sacó a "Superlógico"/"Superrígido" del banco.
- `CL-534` (*Buenas noticias*, "lunáticos [diamantes]"): la estructura en lista
  ("pobres tontos, pobres diablos, lunáticos ___") hace que `dramas` arme el mismo patrón
  gramatical [adjetivo + sustantivo] que la respuesta — demasiado defendible.
- `CL-620` (*El lobo caído*, "poco [bongó]"): `metálico` es slang real para "dinero en
  efectivo" — "mucha merca, poco metálico" tiene sentido propio, no solo gramatical.
- `CL-639` (*Yo caníbal*, "un [banquete] así"): `vivir` nominalizado ("un vivir así")
  es una construcción válida en español y no suena forzada.
- `CL-609` (*La hija del fletero*, "no se [endurece]"): la transcripción no lleva
  tildes, así que "no se elegir" se lee igual que "no sé elegir" (frase corriente) —
  riesgo de ambigüedad por la falta de acento, no por el contenido.
- `CL-605`, `CL-606`, `CL-612`, `CL-613`, `CL-616` (*La hija del fletero*, varios): en
  construcciones abiertas ("no tengo el ___", "me da ___", "por ___", "sopa de ___")
  encontré al menos un distractor con lectura propia (`rock`, `cuerdas`, `television`,
  `fallar`, `tibia` como hueso) — descarté todo el lote en vez de arriesgar.
- `CL-638` (*Yo caníbal*, "Al [caníbal] que hay en mí") y `CL-663` (*Ladrón de mi
  cerebro*, "ladrón de mi [cerebro]"): la respuesta es una palabra del título del propio
  tema, visible en Fácil y Media.
- `CL-429` (*Salando las heridas*, "Salando las [heridas]"): mismo problema, título
  repetido en la respuesta.

---

## 3. Motivo cargado en el JSON

Cada entrada de `fuenteUnica.items` lleva su `motivo` en el mismo registro seco que ya
usan las 14 anteriores (nota interna, no texto de cara al jugador): qué hace única a la
respuesta frente a las otras tres opciones, y una palabra sobre el tema al que pertenece
para quien retome esto sin memoria reciente.

---

## 4. Lo que no toqué

- `src/data/letra.json` — lo regenera el hilo principal con `npm run generar-letra`.
- `src/data/tapa.json` y `CNT-24` — otro agente de `contenido` trabaja ahí en paralelo,
  en esta misma ráfaga.
- Código y schema.

---

## Verificación

No la puedo correr (`D-12`). La deja escrita para quien tenga Bash:

```bash
npm run generar-letra                       # tiene que listar los 7 nuevos y "Piso de US-03 cumplido"
node --test src/lib/letra/*.test.ts         # distractores.test.ts y el resto, sobre el banco regenerado
```

Si `npm run generar-letra` no promueve alguno de los 7 (por ejemplo, si el tema quedó con
menos de 2 vecinos de cada lado tras el recorte, como pasó con `CL-383`/`CL-096` en
`T-288`), ese verso vuelve a `fuenteUnica.enEspera` y hay que avisar: la curaduría del
reemplazo es de `contenido`, no del generador.
