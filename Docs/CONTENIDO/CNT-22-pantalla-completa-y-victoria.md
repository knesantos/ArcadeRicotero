# CNT-22 — Pantalla completa y victoria bailada: los textos que pide `UX-33`

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-24 (ciclo 16, ráfaga 5).
- **Estado:** propuesta, lista para cablear.
- **Consume:** `Docs/DECISIONES.md` `D-47` (el pedido del usuario, textual), `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`
  `BR-31` (la victoria bailada, el coleccionable, la pantalla completa, todos como criterio
  verificable), `BR-23` (la paridad — cada uno el suyo, sin gesto de pareja), `BR-24` (el
  fracaso no se narra; acá no aplica, pero la lista de palabras vetadas la tengo al lado
  para no cruzarla por descuido), `Docs/DECISIONES.md` `D-38` baranda 3 (nada narra la
  relación real), `D-33` (el grito de la tapa no aplica a este juego), `D-17` (voseo, sin
  infinitivo), `Docs/UX/UX-33-pantalla-completa-y-victoria.md` entero, en particular `§1.2`
  y `§1.5` (el interruptor, dos estados, sin ícono), `§1.8` (iPhone: mismo resultado, sin
  texto nuevo), `§2.1`–`§2.5` (el baile, cuánto dura, el contador), `§2.6` (la tabla de lo
  prohibido), `§4` (la lista de los cinco textos que pide para esta nota),
  `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md` `§6` (el par que le
  faltaba a `avisoEntrada`) y `§7` (los moldes de esta tarea, ampliados), `.claude/rules/voz-ricotera.md`
  entero (los tres registros, la regla de las dos líneas, `§7` los tics vetados, `§8` lo
  que audita `voz.test.ts`), `Docs/CONTENIDO/CNT-17`..`CNT-21` (el tono ya fijado para este
  juego — nombres completos solo en el pie, el juego de origen no se nombra, el disco no se
  nombra, ningún texto explica la mecánica), `src/lib/skayboy/copy.ts` (cómo viven hoy
  `PANTALLA` y `TECLAS` — leído, no editado: es `src/`), `src/lib/sitio/copy.ts` `CINTA`
  (el molde de un control con más de un estado: **la estampa nombra el estado, el
  `aria-label` nombra el verbo**, y este documento lo reutiliza tal cual para el
  interruptor nuevo).
- **Resuelve:** `T-299`.

## 0. Qué no toco

No edito código (`src/` es del hilo principal en esta ráfaga) ni `UX-32`/`UX-33` (son de
`experiencia`). Esta nota agrega texto nuevo y dice, para cada uno, a qué campo de
`src/lib/skayboy/copy.ts` está destinado y por qué — el nombre final del campo es de quien
cablee, igual que en `CNT-17`..`CNT-21`.

**Una decisión que conviene dejar escrita antes de los textos:** el botón para pasar al
siguiente nivel **no cambia de palabra en el sexto nivel.** Sigue siendo `PANTALLA.seguir`
= `'Seguí'`, el mismo campo que ya existe (`UX-32 §5`, confirmado en el traspaso `§6`).
"Seguir" no promete "el próximo nivel": promete "lo que sigue", y en el sexto lo que sigue
es la pieza compartible. Inventar un verbo nuevo solo para el sexto nivel sería la clase de
relleno que `voz-ricotera.md` prohíbe cuando no hace falta — la diferencia la marca la
línea nueva de `§3`, no el botón.

> **Enmendado el 2026-10-04 por `CNT-40 §3` (`D-61`, `BR-40` punto 7).** Mientras la pieza
> compartible de `BR-27` no exista, el toque del sexto lleva al primero y no a compartir, y
> `Seguí` prometería lo que no se cumple. Hasta que exista, la tarjeta del sexto dice `Último
> nivel.` y su botón principal `Volvé al primero`. El día que la pieza exista, vuelve a valer
> este párrafo tal cual.

---

## 1. El interruptor de pantalla completa — dos estados, mismo molde que `CINTA`

> **Enmendado el 2026-10-04 por `CNT-40 §5` (`D-61`).** Los dos sellos de la tabla de abajo dejan
> de valer: `ventana` pasa a **`PANTALLA COMPLETA`** y `completa` a **`SALÍ`**, porque el sello
> tiene que nombrar lo que hace el toque y no el estado en que se está (el usuario no encontró
> el control). Los dos `aria-label` no cambian. Tampoco vale ya lo que se dice abajo de que
> ninguna estampa lleva tilde: `SALÍ` la lleva y va en `--fuente-rotulada`. El resto de este
> apartado queda como estaba, para que se vea qué se decidió y por qué se cambió.

**Destino:** un objeto nuevo en `src/lib/skayboy/copy.ts`, `PANTALLA_COMPLETA`, con la
misma forma que `CINTA` en `src/lib/sitio/copy.ts`: la estampa visible en registro 3, el
verbo del toque en un campo aparte, en voseo.

**Por qué esta forma y no otra:** `UX-33 §1.2` pide exactamente el molde de `UX-21` — "la
estampa visible nombra el estado actual, el `aria-label` nombra el verbo" — y ese molde ya
tiene una implementación real y auditada en `CINTA` (`CINTA.apagada` / `CINTA.prender`).
No hace falta inventar una forma nueva, hace falta llenarla.

| Estado | Campo | Valor | Registro |
|---|---|---|---|
| Ventana | `PANTALLA_COMPLETA.ventana` | **`PANTALLA NORMAL`** | 3, estampa |
| Ventana → toque | `PANTALLA_COMPLETA.entrar` | **`Entrá a pantalla completa`** | 1, `aria-label` |
| Pantalla completa | `PANTALLA_COMPLETA.completa` | **`PANTALLA COMPLETA`** | 3, estampa |
| Pantalla completa → toque | `PANTALLA_COMPLETA.salir` | **`Salí de pantalla completa`** | 1, `aria-label` |

**Por qué "PANTALLA NORMAL" y no "VENTANA".** `UX-33` nombra el primer estado "Ventana"
como concepto técnico (así lo corrigió `UX-33` frente al `windowed` que tentaba), pero eso
es el nombre para hablar **entre roles**, no necesariammente la palabra que lee la
persona. "PANTALLA NORMAL" dice lo mismo sin pedirle a nadie que entienda una jerga de
sistema operativo, y sigue el mismo patrón de dos palabras que `CINTA APAGADA` / `CINTA
SONANDO`.

**Por qué ninguna de las dos estampas lleva tilde, y no es casualidad.** `UX-33 §1.2`
avisa que las palabras con tilde de este control (da el ejemplo "AMPLIÁ") van a necesitar
`--fuente-rotulada` porque el calco y la fuente fan todavía no tienen acentos
(`diseno-marca.md`, deuda declarada). Elegí a propósito dos estampas sin una sola tilde —
"PANTALLA NORMAL", "PANTALLA COMPLETA" — así que esta pieza **no hereda esa deuda**: entra
limpio en cualquiera de las fuentes de disco sin esperar a que alguien derive el acento.
No es la razón principal de la elección (la razón principal es que son las palabras que
dicen lo que hay), pero es un beneficio real y lo dejo anotado para que quien maquete sepa
que no tiene que resolver nada ahí.

**Sin ícono**, como pide `UX-33`: no hay un objeto propio del fichín que signifique
"expandir", y las flechas en diagonal de cualquier interfaz son el ícono de librería que
`diseno-marca.md` veta.

### Verificación a mano contra las siete reglas de `voz.test.ts §8`

| Cadena | 1. Anglicismo | 2. Folleto | 3. Infinitivo | 6. "la gente" | 7. Suspensivos |
|---|---|---|---|---|---|
| `PANTALLA NORMAL` | ninguno ✓ | ninguna ✓ | "pantalla" no es verbo ✓ | no aplica ✓ | no lleva ✓ |
| `PANTALLA COMPLETA` | ninguno ✓ | ninguna ✓ | "pantalla" ✓ | no aplica ✓ | no lleva ✓ |
| `Entrá a pantalla completa` | ninguno ✓ | ninguna ✓ | "Entrá" (voseo), no "Entrar" ✓ | no aplica ✓ | no lleva ✓ |
| `Salí de pantalla completa` | ninguno ✓ | ninguna ✓ | "Salí" (voseo) ✓ | no aplica ✓ | no lleva ✓ |

Ninguna de las cuatro es un título ni una bajada de casete, así que el techo de 8 palabras
de `voz.test.ts` no las mide — igual las cuatro entran en 2 a 4 palabras.

---

## 2. El aviso de victoria — el par que le faltaba a `avisoEntrada`

**Destino:** `PANTALLA.avisoVictoria`, nuevo campo en el objeto `PANTALLA` que ya existe.

**Por qué ahí y no en un objeto nuevo:** es exactamente el par de `PANTALLA.avisoEntrada`
(*"De vuelta en la entrada."*) que el traspaso de `experiencia` dejó pedido desde el
2026-09-24: *"ganar no tiene su par."* Mismo objeto, mismo molde, mismo registro.

> **`Las dos puertas, abiertas.`**

**Por qué esta frase y no una que nombre el baile.** `UX-33 §4` deja la pregunta abierta:
*"por si el aviso de lector de pantalla necesita nombrarlo ('bailan' en vez de 'llegaron',
si corresponde)."* Decido que no hace falta. El baile es una animación decorativa sin
información de juego — no hay nada que tocar, nada que cambie si se lo pierde — y
`voz-ricotera.md §5` dice que el registro 3 "dice qué hay y se calla": lo que hay que
informar es el **hecho de juego**, que las dos puertas quedaron abiertas (`mundo.terminado`),
no la coreografía que decidió `experiencia`. Además, cualquier verbo sobre los dos
personajes juntos — "llegaron", "bailan", "festejan" — empieza a sonar a logro compartido
si no se lo redacta con cuidado, y "las dos puertas, abiertas" lo evita de raíz: nombra el
**lugar/hecho**, no a las personas, que es literalmente el criterio que pide `§6` del
traspaso ("nombra el lugar o el hecho, no a las personas... evitar el verbo que sugiera un
logro compartido").

**Descartada:** una frase con verbo de personas ("los dos llegaron", "los dos bailan") —
por el motivo de arriba, y porque `UX-32 §2.6`/`BR-31` prohíben nombrar un logro compartido
en cualquier texto de esta pantalla.

### Verificación a mano

| 1. Anglicismo | 2. Folleto | 3. Infinitivo | 6. "la gente" | 7. Suspensivos |
|---|---|---|---|---|
| ninguno ✓ | ninguna ✓ | "Las" ✓ | no aplica ✓ | no lleva ✓ (4 palabras, sin "…") |

---

## 3. La línea del final del sexto nivel

**Destino:** `PANTALLA.avisoUltimoNivel`, nuevo campo en `PANTALLA`.

**Por qué hace falta una línea nueva si el botón sigue diciendo "Seguí" (`§0`).** El
botón no cambia, pero `UX-33 §4` pide igual una línea que marque que acá el toque no lleva
al próximo nivel: alguien que juega de corrido los seis y llega al sexto puede esperar un
séptimo, y el sitio no promete nada que no vaya a cumplir (`ADR-08.2`, el mismo criterio
que ya rige `rotuloCarga`).

> **`Último nivel. Ahora se comparte.`**

**Por qué este registro y no el 1.** `UX-33 §4` deja la elección entre registro 1 (canta)
y registro 3 (rotula) según a dónde apunte la línea. Apunta a informar un hecho de
navegación —no hay séptimo nivel, lo que sigue es compartir— y no a generar una emoción:
es exactamente el trabajo del registro 3, el mismo que ya hace `avisoEntrada` y el
`avisoVictoria` de `§2`. Dos oraciones cortas, sin verbo dirigido a la persona (no dice
"compartí" ni "mirá"), sin narrar qué lograron los dos juntos — solo el hecho de que la
serie de niveles terminó y qué pasa ahora.

**Verificada contra `BR-31`/`UX-32 §2.6`:** no dice "ganaron", no dice "lo lograron", no
nombra a Skayboy ni a Poligirl, no narra ningún vínculo entre los dos.

### Verificación a mano

| 1. Anglicismo | 2. Folleto | 3. Infinitivo | 6. "la gente" | 7. Suspensivos |
|---|---|---|---|---|
| ninguno ✓ | ninguna ✓ | "Último" ✓ | no aplica ✓ | no lleva ✓ (5 palabras, sin "…") |

---

## 4. El contador del coleccionable — las cuatro palabras exactas

**Destino:** un objeto nuevo, `COLECCIONABLE`, con singular y plural de cada objeto —
`UX-33 §2.5` deja abierto si el número se lee "3 guitarras" o con el singular cuando
corresponda, así que doy las dos formas y quien cablee elige según la cantidad.

| Campo | Valor |
|---|---|
| `COLECCIONABLE.guitarra` | **`guitarra`** |
| `COLECCIONABLE.guitarras` | **`guitarras`** |
| `COLECCIONABLE.cigarrillo` | **`cigarrillo`** |
| `COLECCIONABLE.cigarrillos` | **`cigarrillos`** |

**Por qué palabras sueltas y no una función con el número adentro.** `BR-27` punto 2 ya
prohíbe la comparación entre los dos personajes en el texto — nunca "3 contra 2" — así que
la única composición que hace falta es "número + palabra" (`"3 guitarras"`), y eso lo arma
quien cablee concatenando un `number` con el campo que corresponda. Agregar acá una
función de formato sería tomar una decisión de código que no es mía, y esta nota ya vio en
`CNT-17`/`CNT-18` que lo más chico que se puede entregar es lo más fácil de auditar.

**Sin ícono, sin comparación, sin puntaje** — `BR-31 §2` último punto: si esto entra a la
pieza compartible, entra como dato de cada uno, nunca como "quién juntó más". Esa
restricción no la impone esta nota, ya estaba impuesta; la repito acá para que quien
cablee no tenga que ir a buscarla.

### Verificación a mano

Las cuatro son sustantivos comunes, sin verbo, sin puntuación, sin jerga: pasan las siete
reglas trivialmente (ninguna tiene anglicismo, fórmula de folleto, primera palabra en
infinitivo, mención a "la gente" ni suspensivo).

---

## 5. El anuncio de accesibilidad al levantar un objeto

**Destino:** `COLECCIONABLE.avisoGuitarra` y `COLECCIONABLE.avisoCigarrillo`, mismo
objeto que `§4`.

| Campo | Valor |
|---|---|
| `COLECCIONABLE.avisoGuitarra` | **`Guitarra.`** |
| `COLECCIONABLE.avisoCigarrillo` | **`Cigarrillo.`** |

**Por qué una sola palabra y no una frase.** `UX-33 §4` pone el techo en cuatro palabras y
pide registro 3: "nombra el objeto y no narra nada más". Una palabra sola es el mínimo que
cumple esa instrucción sin sobrar — es el mismo criterio que ya usa `avisoEntrada` ("De
vuelta en la entrada.": nombra el lugar, no inventa una emoción alrededor). Decir más —"Se
juntó una guitarra", "Conseguiste una guitarra"— empezaría a narrar un logro individual en
una pantalla donde `BR-23`/`BR-31` piden no narrar logros de ningún tipo alrededor de
estos dos personajes.

### Verificación a mano

Dos sustantivos con mayúscula inicial y punto, sin verbo: pasan las siete reglas
trivialmente, igual que `§4`.

---

## 6. Lo que esta nota no fija

- **Que no hace falta un texto distinto para iPhone.** `UX-33 §1.8` ya lo resuelve: el
  resultado que ve la persona es el mismo en cualquier plataforma, así que no hay una
  palabra que diga "esto no es pantalla completa de verdad" — sería explicar el mecanismo
  en vez de dejar que funcione, y `D-14` pide lo segundo.
- **El nombre final de cada campo** en `src/lib/skayboy/copy.ts` es de quien cablee, igual
  que en `CNT-17`..`CNT-21`. Lo que fijo acá es el valor y el registro, no el identificador
  de TypeScript.
- **Dónde vive el contador en el marcado** (superpuesto, en qué esquina, con qué tipografía)
  — de `experiencia`/quien construya (`UX-33 §2.5`, `T-300`/`T-301`).
- **El sexto estado `baila` y el schema del coleccionable por personaje** — de
  `arquitectura` (`CTR-15.7`, `CTR-16.4`, `T-298`). Esta nota da las palabras; no toca el
  contrato.
- **Los cuadros exactos del baile y el tile exacto de cada objeto** — de quien dibuje
  (`T-300`), con `UX-33 §2.2`/`§3` como vara.

---

## 7. Qué no tiene comando y se mira a ojo

Según el patrón de `CNT-17`..`CNT-21`:

- **Que ninguna de las doce cadenas narre un vínculo entre Skayboy y Poligirl ni un logro
  compartido** (`D-38` baranda 3, `BR-23`, `BR-31`): lo audita `revisor` con las
  justificaciones de `§2` y `§3` de esta nota al lado — no hay regex que distinga "logro
  compartido" de "hecho de juego", así que sigue siendo criterio de lectura.
- **Que "PANTALLA NORMAL"/"PANTALLA COMPLETA" entren en la estampa sin recortarse** — se ve
  recién en el navegador, igual que ya quedó dicho en `CNT-17 §5` para el pie de homenaje.

Lo que sí corre solo, apenas las doce cadenas aterricen en `src/lib/skayboy/copy.ts`:

```
node --test src/lib/voz.test.ts
rg -in "vida|muerte|moriste|perdiste|game over|ganaron|se abrazan|de la mano" src/lib/skayboy/ src/scripts/partida-skayboy.ts
```

## Bloqueos

Ninguno. No hace falta ficha `RES-XX`: los doce textos son decisión de tono y de registro,
no un hecho verificable sobre la banda — la única persona real que estos textos podrían
tocar es Eduardo Beilinson o Carmen Castro, y ninguno de los doce los nombra, cumpliendo
`D-38` baranda 1 y `CNT-17`.

## Siguiente

`hilo principal` necesita las doce cadenas de esta nota para `src/lib/skayboy/copy.ts`
(`PANTALLA_COMPLETA` nuevo, `COLECCIONABLE` nuevo, y dos campos sumados a `PANTALLA` ya
existente), una vez que termine lo que ya tiene en curso de esta ráfaga (`T-290` y
compañía) y sin tocar `Docs/UX/UX-32-ganar-se-ve.md`. `arquitectura` necesita el sexto
estado `baila` y el schema del coleccionable (`T-298`) antes de que estas cadenas tengan
un lugar de verdad donde vivir en pantalla.
