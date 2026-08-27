# CNT-11 — La regla de elección de versos de `US-07` ("Sacalo por la letra")

- **Fecha:** 2026-08-27.
- **Rol:** `contenido` · **Tarea:** `T-137` del ciclo 9 (`Docs/ORQ/ORQ-plan-ciclo-9.md`).
- **Consume:** `Docs/PRODUCTO/PRD-adivinar-por-la-letra.md` (`US-07` criterio 2, `BR-20` —
  la escalera 1/2/4/8 y "el punto de partida no lo fija esta regla"); `src/data/
  cancionero.json` (`CTR-06`, 104 temas, 101 con `"contenido": "letra"`); `src/lib/
  cancionero/anotacion.ts` (`sirveComoVerso`, ya construida para `US-03` — la reuso como
  piso, no la reinvento); `scripts/generar-letra.mjs` (precedente de cómo se recorren
  secciones y se normaliza texto); `Docs/ARQ/ARQ-schema-completar-letra.md` (`CTR-04`,
  precedente de cómo este proyecto documenta un filtro corrible sobre el mismo corpus).
- **Produce:** la regla que `T-139` (hilo principal) traduce a
  `scripts/generar-por-la-letra.mjs`. No escribo código ni toco `cancionero.json`: esta
  tarea tiene un solo archivo de salida, este documento.
- **No decide:** el schema del banco (`CTR-09`, `arquitectura`, `T-133`), la pantalla
  (`UX-08`, `experiencia`, `T-135`), ni qué 60 temas concretos entran — esta pieza deja el
  filtro; correrlo sobre los 101 temas y ver cuántos sobreviven es de quien tenga Bash
  (`D-12` me lo impide a mí).

---

## 0. Lo que ya excluye el propio dato, antes de tocar una sola regla

Leído directo de `src/data/cancionero.json` (dato interno del repo, no hecho externo: no
hace falta ficha `RES-XX` para citar el propio archivo del proyecto). De los 104 temas:

| `contenido` | Cuántos | Cuáles |
|---|---|---|
| `"instrumental"` | 2 | *Pianito - Jam* (`gulp`, pista 12), *Capricho Magyar* (`lobo-suelto`, pista 8) |
| `"solo-tablatura"` | 1 | *Soga de Caín* (`cordero-atado`, pista 6) |
| `"letra"` | 101 | el universo de partida de `US-07` |

Esto coincide exacto con lo que `US-07` ya cita ("101 temas con letra sobre 104"), así que
lo dejo escrito como piso 0 del filtro: **un tema con `contenido` distinto de `"letra"` no
entra a nada de lo que sigue.**

---

## 1. Qué es un "verso utilizable" para este juego

`sirveComoVerso()` (`src/lib/cancionero/anotacion.ts`) ya resuelve la mitad del problema
para `US-03`: saca de la letra la jerga de guitarra, la tablatura dibujada, los rótulos de
tramo (`INTRO:`, `VERSO 2:`, `[Solo Del Saxo]`) y las líneas de puro diseño. **La reuso
como piso**, pero leyendo a mano dos de los tres casos que el propio `T-137` señala como
frontera (título de una palabra y título largo) encontré líneas que se cuelan igual,
porque `sirveComoVerso` se afinó para el riesgo de `US-03` (marcar de más borra un verso
real) y ese riesgo acá es al revés en algunos casos puntuales. Cuatro hallazgos, todos
verificados leyendo el JSON, no supuestos:

| Patrón real encontrado | Dónde | Por qué se cuela hoy |
|---|---|---|
| `"TEMA (E7):"` (rótulo de tramo con nombre libre + acorde) | *Aquella solitaria vaca cubana*, seis veces | `TEMA` no está en la lista cerrada de palabras de estructura de `anotacion.ts` (que conoce `verso`, `estribillo`, `puente`, etc., pero no `tema`) |
| `"RE REsus LAm DO (3 VECES)"` (secuencia de acordes sueltos) | *Gualicho* | No arranca con una palabra de estructura ni tiene la puntuación que buscan las reglas existentes |
| `"            A                                 E                                       PD- verso"` (diagrama de acordes con espaciado ancho) | *Susanita* | Ni es solo caracteres de dibujo, ni arranca con palabra de estructura: es una fila de cifra suelta |
| `"Patricio Rey Aquella solitaria vaca cubana (TAB)"` / `"Tabbed by maria de los angeles cambra : *"` | *Aquella solitaria vaca cubana*, *Ella debe estar tan linda* | Es el encabezado de la página de origen, no algo que arranca con palabra de estructura ni con jerga de guitarra reconocida |

**Regla, sobre lo que ya sirve `sirveComoVerso()`:** una línea `"t": "letra"` con `texto` no
vacío es **verso utilizable** si, además de pasar `sirveComoVerso()`, no cae en ninguno de
estos cuatro patrones adicionales, corribles sin juicio humano:

- **(a) Rótulo de tramo con nombre libre:** el texto entero (recortado) matchea
  `^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ]{0,20}\s*\([A-G](#|b)?m?\d*\)\s*:?\s*$` — una o dos palabras en
  mayúscula seguidas de un paréntesis con forma de acorde. No hace falta que la palabra
  esté en ninguna lista cerrada: la firma es "todo mayúsculas + paréntesis de acorde".
- **(b) Secuencia de acordes sueltos:** separando el texto por espacios y sacando un
  paréntesis final de repetición (`"(3 VECES)"`, `"(x2)"`), **todas** las palabras que
  quedan matchean un patrón de nombre de acorde (`^(DO|RE|MI|FA|SOL|LA|SI|[A-G])(#|b)?
  (m|sus\d?|dim|aum|maj\d?|\d)*$`, sin distinguir mayúsculas).
- **(c) Línea de crédito de la fuente:** el texto contiene (sin distinguir mayúsculas ni
  tildes) `"patricio rey"`, `"redonditos de ricota"`, `"tabbed by"`, o termina en
  `"(tab)"`.
- **(d) Nota del transcriptor:** el texto, recortado, empieza (sin distinguir mayúsculas)
  con `"nota:"`.

**(e) Deduplicado por texto repetido, dentro del mismo tema.** Un estribillo o un puente
que se repite igual dos o tres veces en la misma canción (como "Con lo que cuesta armar un
full" en *Gualicho*, que aparece cuatro veces idéntico) cuenta **una sola vez** en la lista
de versos utilizables de ese tema: la segunda aparición no suma información nueva para
adivinar el tema, y contarla infla artificialmente el paso 2/3/4 de la escalera con la
misma línea repetida. La comparación es sobre el texto normalizado (sección 2) — dos
versos que difieren solo en una coma o un signo de exclamación cuentan como el mismo.

**Lo que esto no promete.** No corrí este filtro sobre los 101 temas —no tengo entorno de
ejecución (`D-12`)— así que no hay garantía de que (a)-(d) agoten todo el ruido posible del
corpus. Por eso, además del filtro automático, **antes de marcar un ítem `listo` hace
falta una lectura humana de los 8 versos finales**, igual que `US-03` exige
`confirmadoDeOido` antes de jugar un hueco: acá no hace falta escuchar el disco, alcanza
con leer que ninguno de los versos remanentes sea, en realidad, una fila de cifra que el
filtro no cazó. Es un chequeo de segundos por ítem, no una tarea nueva.

---

## 2. La regla del título (`US-07` criterio 2) — la restricción central

**Normalización**, igual mecanismo que ya usa `normalizar()` en `scripts/generar-
letra.mjs` (minúsculas + Unicode NFD + sacar marcas combinantes), aplicado a la frase
entera en vez de a una palabra: pasar a minúsculas, plegar tildes y diéresis (`ñ` pliega a
`n`, aceptable acá porque hace el filtro más estricto, nunca menos), sacar todo carácter
que no sea letra, número o espacio, y colapsar espacios múltiples.

**Coincidencia — un verso "contiene el título" si:**

> la secuencia completa de palabras del título normalizado aparece **contigua, en el mismo
> orden y sin ninguna palabra intercalada**, dentro de la secuencia de palabras del verso
> normalizado.

- **Título de una palabra** (`Gualicho`, `Susanita`): la "frase" tiene un solo elemento, así
  que coincide si esa palabra aparece completa (con límite de palabra: `"vaca"` no coincide
  con `"vacaciones"`) en cualquier posición del verso. Verificado contra el dato real: el
  verso `"Gualicho de olvidar"` coincide con el título *Gualicho*; el verso `"Susanita...
  tan bonita!"` coincide con el título *Susanita*.
- **Título largo** (`Aquella solitaria vaca cubana`): coincide solo si las cuatro palabras
  aparecen juntas y en ese orden. Un verso que dijera solo `"la vaca cubana"` **no**
  coincidiría bajo esta regla — es a propósito: el criterio de `US-07` es "texto literal", y
  una subfrase parcial no es el título completo. Queda un riesgo residual aceptado: la
  alternativa (disparar con un subconjunto de palabras compartidas) deja de ser mecánica y
  pasa a ser "cuánto se parece", que es justo lo que esta tarea pide evitar.
- **Coincidencia literal, no semántica.** Un plural o una conjugación distinta del título no
  cuenta como coincidencia. Se acepta el riesgo simétrico al de arriba por el mismo motivo.
- Se usa el `titulo` tal como está en `cancionero.json`, completo. Hoy ningún título del
  catálogo trae subtítulo entre paréntesis; si apareciera uno, se normaliza igual, sin
  recortarlo.

**Aplica en los cuatro pasos, sin excepción** (así lo pide `US-07` criterio 2): un verso que
matchea la regla del título nunca puede ser parte del conjunto revelado de un ítem, ni
siquiera en el paso 4 acumulado. En la práctica, se saca de la lista de versos utilizables
del tema (sección 1) **antes** de elegir el tramo de 8 que arma la escalera.

**Qué pasa si el filtro deja menos de 8 versos utilizables — acá está la respuesta a "el
tema cuyo título aparece en TODOS los versos":**

> Si, después de sacar ruido (sección 1) y versos-título (esta sección), a un tema le
> quedan **menos de 8** versos utilizables, **el tema se descarta del banco entero.** No
> hay una escalera de "menos pasos" para él: `BR-20` fija que el paso 4 muestra 8 versos
> acumulados, y un ítem que no llega ahí no cierra la partida como pide `US-07` criterio 1.
> El caso límite de "el título aparece en todos los versos" es el caso extremo de esto
> mismo: le quedan 0.

**Ejemplo real, no hipotético, del margen exacto que justifica el piso de 60 y no 101.**
*Aquella solitaria vaca cubana* (`un-baion-para-el-ojo-idiota`, pista 3) tiene, después de
sacar ruido (los rótulos `"TEMA (E7):"` de sección 1) y los cuatro versos que repiten el
título completo (las dos estrofillas `"Aquella solitaria vaca cubana."`, en las dos
secciones marcadas `"tipo": "estribillo"`), **exactamente 8** versos utilizables:
`"Miraba el cielo justo a tiempo,"` / `"miraba el cielo justo a tiempo"` / `"Salvada del
motor eterno,"` / `"salvada del motor eterno justo a tiempo."` / `"Rumiaba el silbido del
viento,"` / `"rumiaba el silbido del viento"` / `"(la civilización la amaba,"` / `"la
civilización la amaba justo a tiempo)"`. Ocho, ni uno más: este tema pasa raspando. Si el
filtro de ruido hubiera atrapado una línea de más, se caería del banco. Es exactamente el
margen que el `PRD` reserva bajando el piso de 101 a 60.

---

## 3. Qué verso abre la escalera (paso 1, el más difícil)

Tres puertas, en cascada, y **ninguna requiere juicio humano**:

- **Puerta A — nunca el primer verso del tema.** Es el más reconocible (la frase de
  apertura), y regalarlo en el paso más difícil vacía el sentido de la escalera.
- **Puerta B — nunca un verso de una sección `"tipo": "estribillo"`.** Es el ejemplo que el
  propio `US-07` criterio 2 usa ("evitar arrancar justo en el estribillo"), hecho regla:
  `cancionero.json` ya trae ese dato limpio por sección (`intro`, `verso`, `estribillo`,
  `puente`, `solo`, `final`, `desconocida`). **Límite conocido:** en temas donde toda la
  letra quedó bajo una sola sección `"desconocida"` (pasa con parte del material de
  `lacuerda.net`, como *Susanita*), esta puerta no filtra nada porque no hay estribillo
  marcado — la regla del título (sección 2) sigue haciendo el trabajo pesado ahí.
- **Puerta C — nunca un verso demasiado corto o puramente interjectivo.** Un verso de menos
  de 4 palabras, o un verso donde el 100% de las palabras pertenece a esta lista cerrada de
  muletillas — `uh, ah, oh, eh, ay, la, na, ja, jo, che, ey, uy` (ampliable solo por
  `contenido`, nunca a criterio del generador) — no puede abrir el paso 1, aunque sí puede
  aparecer más adelante en la escalera si acumula con otros versos.

**Selección, determinística:** de todos los versos utilizables que pueden ser el arranque
de un tramo de 8 (es decir, que tienen 7 versos utilizables después en el orden del tema),
se elige **el de menor posición** que cumpla A + B + C. Si ninguno cumple las tres, se
relaja C (se admite el verso corto) y se repite la búsqueda con A + B. Si ninguno cumple
eso, se relaja B (se admite el estribillo) y se busca solo con A. Si ni así hay candidato
—pasa cuando al tema le quedan exactamente 8 versos utilizables, como el ejemplo de
*Aquella solitaria vaca cubana* de la sección 2, sin margen para saltear el primero— se
relaja también A y se abre en el primer verso utilizable.

**Por qué "el de menor posición" y no "uno del medio".** El propio texto de `US-07`
criterio 2 da el ejemplo: *"arrancar tres versos después del principio"* — es decir,
correrse lo mínimo necesario desde el arranque, no saltar a la mitad de la canción.
"Menor posición que cumple las puertas" hace exactamente eso: si el primer verso problema
está temprano, el punto de partida queda temprano; si toda la primera mitad es estribillo o
son versos cortos, el algoritmo sigue avanzando solo y el punto de partida naturalmente cae
más adentro — sin que nadie tenga que decidir "esto ya es el medio".

---

## 4. El orden de revelado (pasos 2, 3 y 4)

Fijado el punto de partida (sección 3) en la posición *i* de la lista de versos utilizables
del tema:

| Paso | Versos revelados (acumulado) |
|---|---|
| 1 | el verso en la posición *i* |
| 2 | los versos *i* e *i+1* |
| 3 | los versos *i* a *i+3* |
| 4 | los versos *i* a *i+7* |

Siempre en el orden en que aparecen en el tema, sobre la lista ya filtrada (sin ruido, sin
versos-título, sin repetidos) — nunca reordenados ni salteados a otro tramo de la canción.
Cumple al pie de la letra lo que ya fija `BR-20`: mismo punto de partida en los cuatro
pasos, la escalera "agrega versos siguientes, nunca salta a otro fragmento". Los huecos que
deja la limpieza (una línea de ruido o un verso-título salteados en el medio) no son un
salto de fragmento: es el mismo tramo cantado, leído sin la anotación de guitarra ni el
verso que delataría el tema.

---

## 5. Qué queda afuera del banco (por qué 60 y no 101)

1. **Los 3 temas sin `"contenido": "letra"`** (sección 0): *Pianito - Jam*, *Capricho
   Magyar*, *Soga de Caín*. Deja 101.
2. **Los temas cuya lista de versos utilizables, tras sacar ruido y versos-título (secciones
   1 y 2), queda por debajo de 8.** Incluye el caso extremo del título repetido en todos
   los versos, y cualquier tema corto donde el margen no alcanza (ver el ejemplo al límite
   de la sección 2, que sobrevive raspando con exactamente 8). **No corrí este chequeo
   sobre los 101 temas** — no tengo con qué ejecutar código (`D-12`). El número de
   sobrevivientes lo produce `T-139` al correr el filtro; si da menos de 60, es una señal
   para `producto`, no algo que yo pueda resolver eligiendo distinto sin ver el resultado.
3. **Nada más se descarta por esta regla.** La fuente única (`US-07` criterio 3) no es
   motivo de exclusión acá — a diferencia de `US-03`, este juego no necesita `CTR-04`.

---

## 6. La anotación de dificultad manual — el criterio, no las 60 etiquetas

**El eje de este juego es distinto al de los otros tres.** No es "qué tan famoso es el
tema en general" (`US-01`, `US-04`) ni "qué tan reconocible es de oído" (`US-02`, con su
plan de migrar a ranking de YouTube): acá es **qué tan reconocible es un tema por su
letra, con pocos versos y sin el título a la vista.** Dos temas igual de conocidos pueden
quedar en niveles distintos acá si uno tiene una letra muy citada (versos que se cantan
sueltos, de remera) y el otro es conocido por su sonido más que por lo que dice.

**Criterio para marcar un tema como `Fácil`** (al menos uno de estos, editorial, sin
ficha `RES-XX` porque es juicio de curaduría, igual que la dificultad del quiz en `CNT-08`):

- Los versos que le tocaron en su tramo de escalera (después del filtro de título) incluyen
  una frase que circula suelta entre fans — la que se grita en la cancha, la que está en
  una remera, la que se cita en una nota — sin necesitar el título ni el disco al lado.
- El tema es de los que abren o cierran shows habitualmente, o de rotación alta en
  cualquier lista de "lo más escuchado" de la banda — la clase de tema que un fan casual,
  no solo el que se sabe la discografía entera, reconoce con pocas líneas.

**`Media`:** conocido por quien sigue la discografía completa, pero el tramo de versos que
le tocó no es una frase de remera — hace falta leer hasta el paso 4 para ubicarlo con
confianza.

**`Difícil`:** temas de discos de rotación más baja, o cuyo tramo de versos disponible (tras
el filtro de título) es genérico — podría pertenecer a varios temas del catálogo por su
tono— incluso con los 8 versos completos.

**Piso:** mínimo 15 de 60 en `Fácil` (25%, la misma proporción que ya usan los otros tres
juegos), fijado por `US-07`. No etiqueto los 60 en esta tarea — eso es carga de contenido
sobre el banco ya generado por `T-139`, y esta pieza solo deja el criterio con el que se
etiqueta, como pide `T-137`.

---

## 7. Qué NO decide este documento

- **Cuántos y cuáles de los 101 temas sobreviven el filtro.** Lo produce `T-139` corriendo
  el filtro como código. Si el resultado da menos de 60, es una señal para `producto` sobre
  el piso de `US-07`, no algo que yo pueda ajustar sin ver el número real.
- **El schema del banco** (`CTR-09`, `arquitectura`, `T-133`): cómo se guarda la lista de
  versos por ítem, si guarda solo el tramo de 8 o el tema entero con un índice, etc. Esta
  pieza describe el algoritmo, no la forma del dato — mismo reparto de responsabilidad que
  `CTR-04` hizo con `US-03`.
- **Las 60 etiquetas de dificultad concretas.** Queda el criterio (sección 6); cargarlas es
  una tarea de contenido aparte, sobre el banco ya filtrado.
- **La pantalla y qué disco de la mezcla `D-19` la viste**: `UX-08`, `experiencia`.

---

## Verificación

No la puedo correr (`D-12`). La deja escrita para quien tenga Bash (`T-139`, hilo
principal), como casos de prueba concretos sobre datos reales del propio repo:

| # | Entrada (real, de `cancionero.json`) | Resultado esperado |
|---|---|---|
| 1 | Verso `"Gualicho de olvidar"`, título `"Gualicho"` | coincide con el título → se filtra |
| 2 | Verso `"Susanita... tan bonita!"`, título `"Susanita"` | coincide con el título → se filtra |
| 3 | Verso `"Aquella solitaria vaca cubana."`, título `"Aquella solitaria vaca cubana"` | coincide (frase completa) → se filtra |
| 4 | Verso hipotético `"la vaca cubana es mansa"`, mismo título | **no** coincide (falta "aquella solitaria") → queda |
| 5 | Línea `"TEMA (E7):"` | no es verso utilizable (regla 1.a) |
| 6 | Línea `"RE REsus LAm DO (3 VECES)"` | no es verso utilizable (regla 1.b) |
| 7 | Línea `"Patricio Rey Aquella solitaria vaca cubana (TAB)"` | no es verso utilizable (regla 1.c) |
| 8 | Tema *Aquella solitaria vaca cubana* completo | quedan exactamente 8 versos utilizables → entra al banco, se abre en el primero (única opción, sección 3) |
| 9 | Un tema con menos de 8 versos utilizables tras los filtros | se descarta del banco (sección 5) |
| 10 | Un tema con estribillo marcado y con más de 8 versos utilizables | el paso 1 no abre en un verso de sección `estribillo` |

```
node --experimental-strip-types scripts/generar-por-la-letra.mjs
```

(comando de la futura `T-139`; hoy el script no existe todavía).

---

## Tabla resumen

| Sección | Qué fija | Verificable a máquina |
|---|---|---|
| 1 | Qué es un verso utilizable (base `sirveComoVerso` + 4 patrones nuevos + dedupe) | sí |
| 2 | La regla del título (normalización + coincidencia de frase contigua) | sí |
| 2 | Descarte de tema con menos de 8 versos utilizables | sí |
| 3 | Punto de apertura de la escalera (cascada de 3 puertas) | sí |
| 4 | Orden de revelado 1/2/4/8, mismo punto de partida | sí |
| 5 | Qué queda afuera del banco (3 sin letra + los que no llegan a 8) | sí, salvo correr el conteo final |
| 6 | Criterio de `Fácil`/`Media`/`Difícil` | **no** — manual, rotulado como tal |
