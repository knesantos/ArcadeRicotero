# ARQ — Schema de "Sacalo por la letra" (`US-07`)

> Rol dueño: `arquitectura`. Consume: `US-07`, `BR-20` (`Docs/PRODUCTO/PRD-adivinar-por-la-
> letra.md`), `BR-01`, `BR-18` (f), `CTR-03` v2 (el juego hermano, `Docs/ARQ/ARQ-schema-
> adivinar-tema.md`), `CTR-06` (el cancionero), `CTR-07` (popularidad), `RES-20`, `RES-23`,
> `RES-49`, `D-13`, `D-14`, `D-17`, `D-24`, `D-25`, `.claude/rules/contenido-json.md`,
> `.claude/rules/voz-ricotera.md` (sección 4.1, el largo de un verso).
> Produce: **`CTR-09`**. Tarea: `T-133` del ciclo 9.
> Escrito el **2026-08-27**. Es la v1: no hay versión previa que citar.
>
> **Enmendado el 2026-09-24 por `T-284` (ciclo 16), después de `D-46` y `BR-30`. El banco pasa a
> `contratoVersion: 2`.** La dificultad de `US-07` ya no sale de una etiqueta a mano ni de las vistas
> de YouTube, sino **del conteo citado de veces tocado en vivo, en tercios** (`CTR-19.15`). Cambian
> `CTR-09.1` (el envoltorio suma `conteo`), `CTR-09.2` (los valores de `dificultad` y
> `dificultadSegun`), `CTR-09.7` (entero), `CTR-09.8` (el schema), `CTR-09.9` (el ejemplo),
> `CTR-09.10` y `CTR-09.11` (qué se rechaza y cómo se prueba). Cada uno dice al principio qué decía
> antes. **No cambia** nada de los versos, la escalera, el filtro ni la fuente. Consume además:
> `D-27`, `D-46`, `BR-30`, `CTR-19` (`.3`, `.15`, `.16`), `RES-90`.
>
> **Depende de `CNT-11`, que `contenido` está escribiendo en paralelo (`T-137`).** Este
> contrato **no** define qué verso puede abrir la escalera: define **dónde corre esa regla,
> con qué firma, y cómo se declara en el dato que corrió** — que es lo que la vuelve
> verificable a máquina. El piso que sí fija acá sale de `US-07` criterio 2, que ya está
> escrito por `producto`. Todo lo que `CNT-11` agregue entra como `filtro.version: 2`.

---

## La decisión, en una línea

**El banco de `US-07` es un archivo generado que guarda, por tema, la ventana de 8 versos
que la escalera va a revelar — y no guarda ni un dato de la escalera.**

Lo demás de este documento es esa frase desarmada: por qué 8 versos viven en el dato
cuando en el juego hermano de audio no vive ninguno (`CTR-09.3`), qué se rechaza y quién
lo rechaza (`CTR-09.10`), y dónde se enchufa `CNT-11` (`CTR-09.5`).

---

## CTR-09 — Contrato del banco de "Sacalo por la letra"

- **Estado:** vigente, con **un hueco declarado y con dueño**: el contenido de
  `ventanaValida()` más allá del piso, que es de `CNT-11` (`T-137`). El schema, el
  envoltorio, la forma del ítem y los comandos de verificación **no esperan a nadie**.
- **Para quién es:** para `scripts/generar-por-la-letra.mjs` (`T-139`), que escribe el
  archivo; para `src/lib/por-la-letra/` (`T-140`), que lo lee; y para `contenido`, que
  **no escribe este archivo** pero sí el de curaduría de `CTR-09.7`.
- **Cambio de datos que deja pendiente:** el archivo entero, porque todavía no existe. Lo
  produce `T-139` en una corrida.
- **Enmienda del 2026-09-24 (`T-284`):** el cambio pendiente es **regenerar el banco a
  `contratoVersion: 2`** con la dificultad de `CTR-19.15`. Lo hace `T-285` en una corrida. El
  banco de hoy (88 ítems, todos `dificil`/`youtube`) no valida con el schema enmendado, y está
  bien que no valide.

---

### CTR-09.1 — Archivo, envoltorio y presupuesto

**Archivo de datos:** `src/data/por-la-letra.json`.
**Schema:** `src/data/_schema/por-la-letra.schema.json`.
**Quién lo escribe:** `scripts/generar-por-la-letra.mjs`, entero, en cada corrida.
**Nunca se edita a mano** — una edición se pierde en la corrida siguiente.

> **El nombre del schema no es libre.** `src/lib/esquemas.test.ts` levanta el par con
> `erroresDe(archivo, archivo)`: usa **el mismo nombre** para `src/data/<x>.json` y para
> `src/data/_schema/<x>.schema.json`. Así que el schema se llama `por-la-letra.schema.json`
> y el cambio en el test es exactamente un token agregado a su array:
> `['quiz', 'letra', 'tapa', 'cancionero', 'popularidad', 'dos-ejes', 'por-la-letra']`.

> **Enmendado el 2026-09-24 (`T-284`).** El envoltorio decía `"contratoVersion": 1` y no tenía
> `conteo`. Ahora `contratoVersion` es **2** y hay una clave obligatoria nueva, **`conteo`**: la
> `ficha` y la fecha (`consultado`) del bloque `conteo` de `setlistfm.json` con el que se calculó la
> dificultad. Cumple el mismo papel que `filtro.version` en `CTR-09.5`: **impide que un banco
> calculado con un conteo viejo pase por vigente**. Si se refresca el conteo y no se vuelve a correr
> el generador, t14 se pone en rojo (`CTR-19.13`). Sirve además para el rótulo: si una pantalla de
> `US-07` muestra el nivel, la fecha que pide `RNF-CTR-19-A` ya está en el banco. El número de cada
> tema **no** se copia al banco, por lo mismo que no se copiaban las vistas (`CTR-09.7`).

```json
{
  "contrato": "CTR-09",
  "contratoVersion": 2,
  "juego": "por-la-letra",
  "modoRespuesta": "buscador",
  "actualizado": "AAAA-MM-DD",
  "sensibleA": ["letra"],
  "filtro": { "regla": "CNT-11", "version": 1 },
  "conteo": { "ficha": "RES-90", "consultado": "2026-09-24" },
  "nota": "...",
  "items": []
}
```

| Clave | Tipo | Obligatoria | Nota |
|---|---|---|---|
| `contrato` | `"CTR-09"` | sí | |
| `contratoVersion` | `2` | sí | Era `1` hasta el 2026-09-24. |
| `conteo` | objeto | sí | `{ ficha: "RES-NN", consultado: AAAA-MM-DD }`, copiado del bloque `conteo` de `setlistfm.json`. Nuevo el 2026-09-24. |
| `juego` | `"por-la-letra"` | sí | Ver la nota de abajo sobre el nombre. |
| `modoRespuesta` | `"buscador"` | sí | Único valor, igual que `CTR-03.5`. |
| `actualizado` | `AAAA-MM-DD` | sí | Fecha de la corrida del generador. |
| `sensibleA` | `["letra"]` | sí | Const. Ver `CTR-09.6`. |
| `filtro` | objeto | sí | `{ regla: "CNT-11", version: entero ≥ 1 }`. Ver `CTR-09.5`. |
| `nota` | string | no | Para el que abre el archivo sin contexto. No la lee ningún código. |
| `items` | array, `minItems: 1` | sí | Un ítem **por tema**. |

**Por qué `juego: "por-la-letra"` y no `"adivinar-por-la-letra"`**, que es como se va a
llamar la página. El valor tiene que coincidir con lo que el código usa para encontrar las
cosas —el archivo de datos y la carpeta `src/lib/por-la-letra/`—, no con la ruta pública,
que es de `experiencia` y puede cambiar sin que cambie nada del dato. Hay precedente en el
repo: `adivinar-tema.json` alimenta a `/juegos/adivinar-el-tema`.
*Alternativa descartada:* calcar la ruta. Ata el contrato a una decisión de pantalla.

**Por qué `items` y no `fragmentos`.** `CTR-03.1` se apartó del nombre común porque adentro
tenía archivos y no ítems de contenido. Acá adentro **sí hay ítems de contenido**: cada
entrada lleva ocho versos que la gente va a leer, una etiqueta de dificultad que juzgó una
persona y un rótulo de fuente. `items` dice la verdad sobre lo que hay adentro.

**Presupuesto de tamaño.** Un ítem escrito con sangría de dos espacios pesa del orden de
**700 bytes** (ocho versos de ~35 caracteres son ~380 B, la URL ~80 B, el resto ~240 B).
Con los 101 temas con letra del cancionero, el archivo queda en **~70 KB**, contra el techo
de **150 KB** de `CTR-02.1`. Entra, pero **no con margen infinito, y eso tiene consecuencia
sobre `BR-20`**: si la escalera creciera a 16 versos, el archivo pasaría de 120 KB y quedaría
a un pelo del techo. `BR-20` ya descartó 16 y 32 por motivos de juego; queda anotado que el
presupuesto de datos empuja para el mismo lado.

**Presupuesto de precarga: este archivo viaja entero al navegador.** No hay backend
(`codigo-juegos.md`), así que no se puede servir una tajada por partida: la isla necesita el
pozo completo para sortear seis temas por vuelta. Son ~70 KB de texto, del orden de 20 KB
comprimidos — un costo de red normal para un celular de gama baja, y **cero costo de RAM de
audio**: el presupuesto de tres buffers de `CTR-01.5` no aplica acá, porque este juego no
toca la Web Audio API en ningún momento.

**Y la respuesta viaja en el mismo archivo**, al lado de sus versos. Es un juego de honor,
igual que el quiz —que manda `correcta: true` al cliente— y que `US-02` —donde el nombre del
mp3 es el título—. **Cuándo** se muestra el título es de `experiencia` (`UX-08`).

---

### CTR-09.2 — El ítem, campo por campo

Siete campos. Ninguno opcional salvo `fuente.ficha`, que tiene su regla en `CTR-09.6`.

| Campo | Tipo | Qué es |
|---|---|---|
| `slug` | slug | La **identidad del tema**, y por lo tanto la respuesta correcta. Tiene que ser uno de los 105 de `RES-20`. |
| `titulo` | string ≤ 80 | El título tal como lo escribe `RES-20`. Documentación **y operando del filtro** (ver abajo). |
| `desde` | entero ≥ 0 | Índice del primer verso de la ventana dentro de la lista de versos jugables del tema. |
| `versos` | array de **exactamente 8** strings | La ventana. En orden, contigua, tal como se canta. |
| `dificultad` | `facil` \| `media` \| `dificil` | `CTR-09.7`. *Hasta el 2026-09-24 admitía también `sin-clasificar`.* |
| `dificultadSegun` | `en-vivo` \| `sin-conteo` | De dónde salió la etiqueta. `CTR-09.7`. *Hasta el 2026-09-24 era `curaduria` \| `youtube`.* |
| `fuente` | objeto | `{ sitio, url, consultado, ficha? }`. `CTR-09.6`. |

**Por qué `titulo` está en el ítem aunque se pueda derivar del slug.** `CTR-03.2` lo justifica
como documentación; acá hay un segundo motivo que pesa más: **el chequeo de `CNT-11` compara
los versos contra el título**, y si el título no estuviera en el mismo archivo, ese chequeo
necesitaría parsear `RES-20` para poder correr. Con `titulo` adentro, la comprobación es
autocontenida: el schema y el test la hacen sobre el archivo solo. El cruce contra los 105
sigue existiendo aparte (`CTR-09.10`, fila 1) y es el que impide que ese título mienta.

**Lo que el ítem NO tiene, y por qué** — la tabla existe para que en dos meses nadie tenga
que adivinar si un campo se olvidó:

| Campo de `CTR-02`/`CTR-04` | Qué pasa acá | Por qué |
|---|---|---|
| `id` (`QZ-NNN`, `CL-NNN`) | **No existe.** La identidad es el `slug` | Un contador posicional sobre un banco generado se corre solo cuando cambia el filtro, y arrastra a un lugar equivocado todo lo que esté indexado por ese id. Ya pasó: `generar-letra.mjs` tuvo que escribir un guardián entero (`versosAnotados`) para que una confirmación de oído no se mudara sola de verso. Acá hay una clave natural —el tema— que sale de `RES-20` y no se puede correr. **`PL-NNN` no se gasta**: si algún día hay más de un ítem por tema, el contador arranca en `PL-001`. |
| `us` | Retirado | El banco entero es de `US-07`. Repetirlo 101 veces no informa (`CTR-03.2`). |
| `disco`, `pista`, `anio` | Retirados | Salen del catálogo cruzando por slug, como en `CTR-03`. Guardarlos sería una segunda copia que se puede desincronizar de `RES-20`. |
| `opciones` / `variantesAceptadas` | **No existen** | `modoRespuesta: "buscador"`: no hay distractores que curar y no hay texto que interpretar. Es el corolario de `CTR-03.5` y la razón por la que `US-07` puede llegar a su piso en un ciclo. |
| `explicacion` + `rotulo` | No existen | El ítem no afirma nada más que "estos versos son de este tema". Sin afirmación no hay nada que rotular, y la regla de las tres casillas de `D-14` sigue entera donde sí hay prosa: `CTR-02`, `CTR-04` y la Redondopedia. |
| `fuentes: ["RES-20"]` | **Cambia de lugar** | El respaldo del título es el cruce contra los 105 en build, no un string con formato de ficha. La tabla de `CTR-03.6` explica por qué el cruce es más fuerte que el campo; vale igual acá. |
| `sensibleA` | **Sube al envoltorio** | Los 101 ítems son letra. 101 copias del mismo array no son información. |
| `estado` (`borrador`/`listo`/`retirado`) | **No existe** | Si el ítem está en el archivo, es porque pasó el filtro y se puede jugar: **el JSON es la lista de lo que existe y validó, no de deseos.** Retirar un tema —el caso de `D-14`, llega un reclamo— es una línea en el archivo de curaduría (`CTR-09.7`) y volver a correr el generador. |
| `confirmadoDeOido` | No existe | Es el candado de `CTR-04`, y `US-07` criterio 3 explica por qué acá no hace falta: una palabra mal transcripta no cambia de qué tema se trata. **`D-25` no se invoca**: este juego nunca necesitó que se abriera. |
| `notaInterna` | No existe | El generador reescribe el archivo entero: un campo que no sobrevive a su propia herramienta es una trampa (`CTR-03.2`). |
| `spotify.trackId` | No existe | `D-22`. Igual que en `CTR-03.7`. |

---

### CTR-09.3 — Cómo viajan los versos por paso: la escalera **no** está en el dato

**El ítem guarda ocho versos y ningún paso.** Los cuatro pasos de `BR-20` los arma el motor
cortando esa lista:

| Paso | Qué muestra | Puntos si acierta |
|---|---|---|
| 1 | `versos.slice(0, 1)` | 100 |
| 2 | `versos.slice(0, 2)` | 80 |
| 3 | `versos.slice(0, 4)` | 60 |
| 4 | `versos.slice(0, 8)` | 40 |

La tabla vive en `src/lib/por-la-letra/escalera.ts` (`T-140`) como constante, igual que
`src/lib/tema/escalera.ts` en el juego hermano. El puntaje es de `BR-20`; los intentos son
cuatro, uno por escalón; **nada de eso se escribe en el JSON**.

**La única atadura entre el dato y la escalera es una línea de aritmética**, y es la
traducción exacta de la que `CTR-03.4` fija para el audio:

> `versos.length` ≥ los versos del **paso 4** de `BR-20`.

Con los números de hoy son 8, y el schema los fija como `minItems: 8, maxItems: 8`. Un ítem
con seis versos haría que el paso 4 mostrara lo mismo que el paso 3: el jugador gastaría el
intento más caro para recibir nada. Es el mismo modo de falla que en `US-02` se llama *"el
último paso sonaría a silencio"*.

**Alternativa descartada: guardar los cuatro pasos explícitos**
(`pasos: [{ n: 1, versos: [...] }, …]`). Dos motivos. Uno, guarda 15 renglones para mostrar
8 —el paso 3 repite lo del 2, el 4 repite lo del 3—. Dos, y es el que decide: crea una
segunda verdad sobre la escalera, y el día que `producto` mueva `BR-20` habría ítems que
contradicen al contrato sin que nada falle. Es la propiedad que `CTR-03.4` fue a buscar y
que ya se cobró una vez, cuando `D-24` pasó la escalera de audio de cinco pasos a seis sin
migrar un solo dato.

**Alternativa descartada: no guardar los versos, guardar `slug` + `desde` y derivarlos del
cancionero en build.** Es tentadora —cero duplicación— y no va, por tres razones. (1) El
cancionero lo reescribe `ingerir-cancionero.mjs` desde material que vive fuera del repo: el
verso número 12 de un tema puede cambiar sin que nadie lo note, y el ítem apuntaría a otra
cosa. (2) `contenido` necesita **ver** los versos para etiquetar dificultad y para discutir
`CNT-11`, y un puntero no se lee. (3) La isla tendría que recibir el cancionero entero, que
pesa varios megas contra los 70 KB de este banco.

**Y acá es donde este contrato se aparta del hermano y conviene decirlo sin adornos:**
cambiar la escalera **sí migra datos**. En `US-02` los seis pasos salían del mismo mp3, así
que mover la escalera costaba una constante. Acá, pasar de 8 a 12 versos obliga a volver a
correr el generador y reescribe el banco entero. **El costo es real y es barato** —una
corrida, sin trabajo humano— pero no es cero, y decir que sí lo sería es la clase de
promesa que se descubre el día que hay que cumplirla. La contención es que el schema fija
`minItems`/`maxItems` en 8: un banco viejo contra una escalera nueva **no valida**, no se
juega roto.

---

### CTR-09.4 — Qué es un verso jugable acá, y por qué el piso es más alto que en `US-03`

En `US-03` un verso mal elegido aparece como **contexto** alrededor del hueco: se ve feo y
se sigue jugando. En `US-07` el verso **es el enunciado entero del paso 1**. Si el primer
verso de la ventana no es letra, el jugador ve eso y nada más, y no hay pregunta que
contestar. Es el mismo daño que `anotacion.ts` fue escrito para prevenir, un escalón más
arriba.

Un verso de este banco tiene que cumplir las cuatro:

1. **Pasar `sirveComoVerso()`** (`src/lib/cancionero/anotacion.ts`). Lo aplica el generador.
2. **No contener `<` ni `>`.** Igual que `CTR-04`.
3. **Tener al menos una palabra de cuatro letras o más.** Expresado en el schema como
   `pattern: "[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{4,}"`.
4. **No ser una línea entera entre corchetes rectos.** Expresado como `not`.

> **Por qué corchetes y no también paréntesis**, que fue mi primera redacción y estaba mal.
> El corchete recto es convención del que transcribe: nadie canta `[A  G]`. El paréntesis
> **sí aparece en versos cantados** —los coros, las segundas voces—, y el corpus tiene el
> caso a mano: *Dr. Saturno* trae `"(En las calles no me muestro más)"` como línea de letra.
> Una regla que barriera los dos borraría un verso real, que es la peor dirección en la que
> equivocarse (`anotacion.ts` lo declara en su encabezado: el renglón perdido no lo ve
> nadie). Para `(D G A)` y `(x4)` no hace falta esta regla: los mata la 3.

> **Las reglas 3 y 4 no son teoría: cierran un agujero medido en el corpus de hoy.**
> `src/data/letra.json` trae `"[A  G]"` como verso de contexto de `CL-265` y `CL-266`
> (*Vencedores vencidos*), lo que quiere decir que **`sirveComoVerso("[A  G]") es `true`**:
> no lo agarra `layout` (tiene letras), ni `tab-grafica` (no tiene barras ni corridas de
> guiones), ni `rotulo-entre-corchetes` (adentro del corchete no hay palabra de estructura,
> hay dos acordes). En `US-03` eso costaba un renglón feo. Acá, si cae primero, el paso 1
> del ítem es literalmente `[A  G]`.
> **El arreglo de fondo es de `anotacion.ts` y no es mío**: queda pedido en
> `Docs/SUGERENCIAS/ARQ-para-hilo-principal-verso-de-acordes.md`. Las reglas 3 y 4 son la
> red de este contrato, y se quedan aunque el arreglo llegue — un contrato que depende de
> que otra función esté bien no es un contrato.

**Largo máximo por verso: 90 caracteres**, el mismo número que `CTR-04` usa para los versos
de contexto, para no tener dos techos que reconciliar. El verso más largo que medí en el
corpus tiene 49.

**Lo que este número le deja a `experiencia`, con la cuenta hecha:** el paso 4 muestra ocho
versos. En el peor caso son **720 caracteres**, que a 375 px de ancho son del orden de
**veinte renglones** — una pantalla llena, con el buscador todavía visible. En el caso
mediano son ~280 caracteres y no hay problema. **Cómo se resuelve el peor caso es de
`UX-08`** (`T-135`): scroll, tipografía más chica en el último escalón, o lo que decida. Acá
queda el número, no la solución.

---

### CTR-09.5 — Dónde se engancha `CNT-11`, y cómo se sabe que corrió

**El piso, que ya está decidido por `producto` y no lo invento yo.** `US-07` criterio 2:
*"ninguno de esos versos contiene el título del tema como texto literal"*, y aplica a los
cuatro pasos, no solo al primero. Como los ocho versos del ítem son exactamente lo que se
llega a mostrar, el chequeo es sobre los ocho.

**Cómo se compara, que sí es mío:** sobre la forma **dura** (`normalizarDuro()`), la misma
que ya usa el buscador — sin tildes, sin puntuación y **sin espacios**. Un ítem se descarta
si `normalizarDuro(verso).includes(normalizarDuro(titulo))`.
*Por qué la forma dura y no la blanda:* la fuente parte y pega palabras donde el tracklist no
lo hace (`Ji JiJi` por `Jijiji`), así que comparar con espacios dejaría pasar la mitad de los
casos que importan. **El costo es que puede pegar de más**, cruzando el borde entre dos
palabras. Se acepta a propósito: **el filtro peca de descartar**, y descartar es barato — hay
101 temas para un piso de 60, o sea 41 de margen.
*(Nota del 2026-09-24, `T-284`: los 101 son los candidatos antes de filtrar. El banco que quedó,
`src/data/por-la-letra.json`, tiene **88 ítems**, así que el margen real sobre el piso es de 28.
El pozo de los tercios son esos 88, no el piso: `CTR-19.15`.)*

**El enganche, que es lo que `T-137` y `T-139` necesitan que exista:**

```ts
// src/lib/por-la-letra/filtro.ts
export const VERSION_FILTRO = 1;

export interface VersoDelTema {
  readonly texto: string;
  /** El `tipo` de la sección del cancionero: 'estribillo', 'verso', 'desconocida'… */
  readonly seccion: string;
}

/** `null` = la ventana sirve. Un string = el motivo del descarte, para el log. */
export function ventanaValida(
  ventana: readonly VersoDelTema[],
  tema: { readonly slug: string; readonly titulo: string },
): string | null;
```

Tres cosas de esa firma, y cada una responde a algo que ya se decidió en este proyecto:

- **Devuelve el motivo, no un booleano.** Un descarte silencioso no se puede auditar, y
  `ingerir-cancionero.mjs` ya fijó el criterio: lo que no pasa se aparta **con el motivo
  escrito**. El generador imprime el conteo por motivo al final de la corrida.
- **Recibe el `tipo` de sección de cada verso.** Es lo que `CNT-11` necesita si decide algo
  como "no arrancar en el estribillo". Sin ese dato en la firma, la regla no se podría
  escribir sin una segunda pasada por el cancionero.
- **Cada regla de `CNT-11` es una cláusula adentro de esta función, con su motivo.** Nadie
  tiene que tocar el schema ni el generador para agregar una.

**Y `filtro.version` es lo que impide que un banco viejo se haga pasar por filtrado.** El
envoltorio declara con qué versión de la regla se generó; el test compara ese número contra
`VERSION_FILTRO`. Cuando `contenido` endurezca `CNT-11`, se sube la constante a 2, y **todos
los ítems del archivo siguen diciendo 1 hasta que alguien vuelva a correr el generador**: el
test falla y nombra el problema.
*Alternativa descartada:* un booleano `filtrado: true`. Diría que **alguna** versión de la
regla corrió, que es exactamente lo que no sirve saber. Un banco generado con la regla vieja
tendría el booleano en `true` y sería mentira sin que nada lo notara.

---

### CTR-09.6 — La fuente: el sitio y la URL siempre; la ficha, cuando la hay

`US-07` criterio 3 obliga a declarar de dónde salió la letra, y `T-145` ya va a mostrarle esa
fuente al jugador en el juego hermano. Acá el ítem la lleva:

```json
"fuente": {
  "sitio": "letras.com",
  "url": "https://www.letras.com/los-redonditos-de-ricota/202986/",
  "consultado": "2026-08-24",
  "ficha": "RES-23"
}
```

**`sitio`, `url` y `consultado` son obligatorios y no pueden ser `null`.** Es más estricto
que `CTR-06`, que los declara nulables porque la ingesta tiene que poder guardar un tema
cuya fuente no dijo nada. **Acá un tema así no entra al banco**, y el generador lo dice en el
log. Ese es el "ítem sin fuente" que este contrato rechaza.

**`ficha` es opcional, y su ausencia es una declaración, no un hueco.** Es `D-14` puesto en
un campo: *cuando hay ficha se cita; cuando no la hay, se dice que no la hay y se usa igual*.

| `sitio` | `ficha` | Estado |
|---|---|---|
| `cifraclub.com` | **obligatoria**, `RES-49` | Fichada en el ciclo 7 (`INV-23`). |
| `letras.com` | **obligatoria**, `RES-23` | Fichada (`INV-21`). |
| `lacuerda.net` | opcional, hoy ausente | Sin ficha. El pedido está en `Docs/SUGERENCIAS/HILO-para-investigador-fichar-lacuerda.md`. |

El schema hace cumplir las dos primeras filas con `if`/`then`: un generador que se olvide de
mapear el sitio a su ficha no pasa. **Cuándo se revisa esta tabla:** el día que exista la
ficha de lacuerda.net, se agrega la tercera fila con su `RES-` y el `const` correspondiente.

**Y acá está la diferencia grande con `CTR-04`, que hay que decir en voz alta: los 21 temas
de lacuerda.net SÍ entran a este banco.** `generar-letra.mjs` los deja afuera porque `CTR-04`
pide `fuenteLetra` como lista de fichas `RES-XX`, y sin ficha no hay con qué llenarla. Este
contrato no pide eso, y no es una relajación: es que **la afirmación es otra**. En `US-03` el
jugador tipea la palabra exacta, y el ítem afirma "esta palabra es la que dice el tema" — una
afirmación sobre la obra. Acá el ítem afirma dos cosas: "este tema existe y se llama así"
—que la respalda `RES-20` por el cruce— y "esto es lo que transcribió tal sitio, acá está el
enlace" — que se respalda sola, porque es un hecho sobre la transcripción, no sobre la obra.
Una ficha `RES-XX` evalúa **al sitio**, y eso es útil, pero no es lo que sostiene a este ítem.
`US-07` criterio 3 y el PRD lo dicen con todas las letras: los 101 temas del cancionero están
disponibles enteros como universo de partida.

**`sensibleA: ["letra"]` en el envoltorio** es el mapa de `D-14`: qué está publicando el sitio
y de dónde salió. Con la fuente por ítem, responder a un reclamo sobre un tema puntual es
buscar el slug, ver el sitio y la URL, y sacarlo por el archivo de curaduría.

---

### CTR-09.7 — La dificultad: un archivo de curaduría, y el plan B declarado

> **Enmendado el 2026-09-24 (`T-284`, `D-46`, `BR-30`). Rige lo de este recuadro. Lo de abajo queda
> como estaba, para que se vea de dónde viene.** Abajo se describe una etiqueta que pone
> `contenido` a mano, con las vistas de YouTube como plan B. Eso quedó viejo dos veces. `D-27`
> (2026-08-27) la volvió inferida de las vistas, y `generar-por-la-letra.mjs` ya lo hacía con
> `dificultadSegun: "youtube"`, pero este documento nunca se enteró. Después `D-46` cambió la
> medida. **Hoy el banco trae los 88 ítems en `dificil`/`youtube`**, porque la clave de YouTube no
> llegó nunca.
>
> **La regla nueva.** La dificultad de cada ítem la da **`repartirEnTercios()`**
> (`src/lib/en-vivo.ts`, `CTR-19.15`) aplicada al pozo del banco con el conteo citado de
> `setlistfm.json`. Son los tercios de `D-27`, y un tema sin línea es `dificil`. Ninguna persona la
> escribe y ninguna fuente la corrige a mano.
>
> **Lo que cambia en `scripts/generar-por-la-letra.mjs`, en orden:**
>
> 1. **Lee `src/data/setlistfm.json` y toma su bloque `conteo`.** Si el archivo no existe o no trae
>    `conteo`, **aborta con un mensaje claro**. No arma un banco todo en `dificil`: el conteo está
>    commiteado, y que falte es un repo roto, no un dato que todavía no llegó. Sacarlo sin avisar
>    deshace lo único que `D-46` vino a arreglar.
> 2. **Deja de leer `popularidad.json` y de importar `popularidad.ts`**, que se retira
>    (`CTR-19.15`). Lo vigila t15.
> 3. **Arma los ítems sin dificultad.** Es el mismo recorrido de hoy: filtro, ventana, fuente. Si
>    algún día lee el archivo de curaduría, aplica `excluido` en este paso.
> 4. **El pozo son los slugs de los ítems que quedaron**, y recién ahí llama a
>    `repartirEnTercios(pozo, conteo)`. **Es un cambio de comportamiento, no de estilo.** Hoy el
>    reparto se calcula sobre las 105 entradas de `popularidad.json` antes del recorrido, o sea
>    sobre el catálogo entero. `BR-30` lo quiere sobre el pozo del juego, por la misma razón que
>    `CTR-07.8` punto 2: los más tocados del catálogo no son los más tocados de lo que se juega.
> 5. **A cada ítem le pone** `dificultad` (lo que da `porSlug`) y `dificultadSegun`: `sin-conteo` si
>    el tema está en `sinConteo`, y `en-vivo` en los demás casos.
> 6. **En el envoltorio escribe** `contratoVersion: 2` y `conteo: { ficha, consultado }`, copiados
>    del bloque que leyó.
> 7. **En el log imprime** cuántos quedaron en cada nivel, cuántos del pozo tienen conteo, la lista
>    `sinConteo` con sus títulos, la ficha y la fecha del conteo, y el piso de 60 y la cuota de 15
>    Fáciles de `US-07` como mediciones. Si faltan Fáciles, lo imprime en rojo y **no aborta**: la
>    cuota es de `producto`. Se borra el aviso 🔴 de `YT_API_KEY`.
>
> **Por qué `dificultadSegun` sigue siendo por ítem**, y no una sola clave del envoltorio. El
> conteo es uno para todo el banco, eso sí. Pero **un `dificil` puede decir dos cosas distintas**:
> "está en el tercio de abajo" o "no tiene conteo". El rótulo tiene que decir cuál es, y
> `sin-conteo` lo dice. El schema obliga a que `sin-conteo` vaya siempre con `dificil`.
>
> **El archivo de curaduría pierde la clave `dificultad`** (`D-46`: la dificultad no se etiqueta).
> `excluido` sigue siendo la forma de bajar un tema (`D-14`). Hoy el generador no lee ese archivo, y
> leerlo no es parte de esta tarea. Se retira `sin-clasificar`, que existía solo para los temas que
> nadie había etiquetado. Ahora todos los temas tienen nivel, y un valor menos es una rama menos
> (`CTR-03.11` punto 1). `escalonar()` sigue sabiendo ordenarlo porque lo usa para cualquier valor
> que no conoce, y no hay que tocarlo.
>
> *Alternativa descartada:* **calcular la dificultad de `US-07` en build, como `US-02`**, y sacarla
> del banco. No habría riesgo de banco viejo. Pero cambia la forma de `CTR-09` más que esta
> enmienda: habría que borrar un campo obligatorio y que la página importe el conteo. Y `US-02` la
> calcula en build porque su manifiesto es una lista de archivos, y un archivo no tiene
> dificultad (`CTR-03.11`). Este banco es de ítems de contenido, y el nivel es una propiedad del
> ítem tal como se juega. Con `conteo` en el envoltorio y t14, esta forma da la misma garantía de
> estar al día con una corrida del generador.
> *Alternativa descartada:* **degradar a todo `dificil` si falta `setlistfm.json`**, como hacía
> `D-27` con las vistas. Allá el dato no existía todavía. Acá existe y está en el repo, así que
> degradar en silencio taparía una rotura.
>
> **Lo que da hoy** (`CTR-19.15`, a confirmar con t14): **30 Fácil, 30 Media, 28 Difícil y ninguno
> sin conteo**, sobre 88. La cuota de 15 Fáciles de `US-07` queda cumplida con 15 de margen.

El generador puede sacar versos del cancionero. **Lo que no puede es saber qué tan conocido
es un tema**, y `US-07` pide 60 ítems con **mínimo 15 Fácil** para que `BR-01` no repita
siempre el mismo puñado. Esa etiqueta la pone `contenido` a mano.

**Dónde la pone:** `src/data/por-la-letra-curaduria.json`, **que no lo escribe el generador**
y sobrevive a cada corrida. Es el mismo mecanismo que `letra-confirmaciones.json` resolvió
para `US-03`: el archivo donde entra lo que solo una persona puede decidir.

```json
{
  "nota": "Lo que el generador no puede saber. Lo llena `contenido`. Clave: el slug del tema.",
  "temas": {
    "jijiji": { "dificultad": "facil" },
    "dr-saturno": { "dificultad": "media" },
    "capricho-magyar": { "excluido": "pedido de baja del 2026-XX-XX (D-14)" }
  }
}
```

- **Clave por `slug`, nunca por posición.** Es la misma lección que `CL-034`: un id
  posicional se corre cuando cambia el filtro y arrastra el juicio humano a otro ítem.
- **`excluido` es cómo se baja un tema** sin tocar código, cumpliendo `D-14` en un minuto.
- **El generador aborta la corrida entera si este archivo tiene un slug que no existe o una
  dificultad fuera del enum**, con el mensaje puntual, igual que `resolverConfirmaciones()`.
  *Por eso no le doy un JSON Schema propio:* el mensaje de ajv sobre un `additionalProperties`
  es peor que el del generador, y este archivo lo lee una sola herramienta.

**Un tema sin etiqueta entra igual, como `sin-clasificar`.** Es la decisión que más se puede
discutir de este contrato, así que va con su motivo y su alternativa:

- **Por qué.** En el quiz, la dificultad es una propiedad del ítem. Acá es una propiedad de
  **qué tan conocido es el tema**, y un tema sin etiquetar no está *mal*: está *sin ordenar*.
  Bloquearlo repetiría exactamente el pozo en que cayó `US-03`, que estuvo tres ciclos en
  cero ítems jugables esperando un insumo humano. Y cerrar el juego hasta que alguien emita
  60 juicios es un molinete puesto del lado de adentro.
- **Alternativa descartada:** exigir la etiqueta y dejar el ítem afuera sin ella. Es más
  prolijo y es el que deja el juego apagado hasta que se completen 60 etiquetas.
- **Alternativa descartada:** que lo no etiquetado caiga en `media` por defecto. Es la peor
  de las tres: el archivo diría "media" sobre un tema que nadie miró, y eso es un rótulo que
  no dice la verdad sobre lo que hay adentro — lo único que este proyecto no negocia.
- **Lo que esto le deja a `producto`, señalado y no resuelto por mí:** si un ítem
  `sin-clasificar` puede salir sorteado en el primer escalonamiento de `BR-01` es de
  `producto`, no mía. El dato lo permite; la ronda decide. **Lo que sí es medible desde acá**
  es la cuota, y el comando (2) de `CTR-09.11` la imprime en cada corrida.

**`dificultadSegun` es el plan B de `US-07` hecho campo.** `BR-18` (f) ya migró la dificultad
de `US-02` de etiqueta manual al ranking de vistas de YouTube, y el PRD de `US-07` deja
anotado que acá el encaje es todavía más directo. Hoy ese ranking no existe:
`src/data/popularidad.json` tiene los 105 temas en `"estado": "sin-video"`. Cuando exista, la
migración es por ítem y no en bloque —va a haber temas medidos y temas sin video—, así que el
campo tiene que decir **por ítem** de dónde salió la etiqueta. `curaduria` o `youtube`, y el
rótulo dice la verdad sobre cada uno.

**Lo que este ítem NO copia de `popularidad.json`: el número de vistas.** `CTR-07` es
explícito en que una cifra sin su fecha no existe, y copiar acá un `viewCount` sería
fabricar exactamente eso — una medición sin fecha que nadie refresca. El ítem dice de dónde
salió la etiqueta; el número vive en su contrato y en ningún otro lado.

---

### CTR-09.8 — El bloque normativo, listo para copiar

Draft 2020-12, igual que el resto. **Este documento manda sobre cualquier copia.**
**Sí se baja a archivo**, a `src/data/_schema/por-la-letra.schema.json`, y entra al array de
`src/lib/esquemas.test.ts`.

> **Por qué acá sí y en `CTR-03.8` no.** `CTR-03` decidió no bajar su bloque a un archivo con
> tres argumentos, y los tres se dan vuelta acá. (1) *La validación real es el cruce en
> build*: sigue existiendo, pero acá el archivo lleva además **texto que se le muestra a la
> gente** y un **rótulo de fuente**, y de eso el cruce no dice nada. (2) *Nadie carga a
> mano*: cierto para este archivo, falso para el de curaduría que lo alimenta — el juicio
> humano entra igual, solo que por otra puerta. (3) *Un schema suelto se desincroniza*: el
> riesgo real, y por eso el schema **no repite ni un número de la escalera** salvo el 8, que
> es justamente el que tiene que fallar si `BR-20` se mueve.

> **Enmendado el 2026-09-24 (`T-284`). `T-285` copia este bloque entero sobre
> `src/data/_schema/por-la-letra.schema.json`.** Son siete cambios, y un banco viejo **no valida**
> contra este schema. Es a propósito: obliga a volver a correr el generador.
> (1) `$id` decía `…/por-la-letra/1` y ahora dice `…/2`.
> (2) `contratoVersion` decía `const 1` y ahora dice `const 2`.
> (3) `required` suma `conteo`.
> (4) Aparece la propiedad `conteo`.
> (5) `item.dificultad` decía `["facil", "media", "dificil", "sin-clasificar"]`.
> (6) `item.dificultadSegun` decía `["curaduria", "youtube"]`, con el comment *"'curaduria' = lo
> juzgó contenido a mano. 'youtube' = salió del ranking de CTR-07, que hoy no tiene un solo tema
> medido."*
> (7) `item` suma el `if`/`then` que ata `sin-conteo` a `dificil`. Todo lo demás está igual, letra
> por letra.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ricotaarcade.local/schema/por-la-letra/2",
  "title": "CTR-09 — Banco de Sacalo por la letra (US-07)",
  "description": "Lo escribe scripts/generar-por-la-letra.mjs desde src/data/cancionero.json. Es la lista de lo que existe y validó, no de deseos: si un ítem está acá, pasó el filtro de CNT-11 y se puede jugar. No se edita a mano.",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contrato", "contratoVersion", "juego", "modoRespuesta",
    "actualizado", "sensibleA", "filtro", "conteo", "items"
  ],
  "properties": {
    "contrato": { "const": "CTR-09" },
    "contratoVersion": { "const": 2 },
    "juego": { "const": "por-la-letra" },
    "modoRespuesta": {
      "const": "buscador",
      "comment": "Único valor, igual que CTR-03.5. Sin distractores: la respuesta es la identidad del tema y se compara por slug."
    },
    "actualizado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
    "sensibleA": {
      "comment": "D-14: el mapa de qué publica el sitio. Va acá y no por ítem porque los 101 son letra.",
      "type": "array",
      "minItems": 1,
      "maxItems": 1,
      "items": { "const": "letra" }
    },
    "filtro": {
      "comment": "CTR-09.5. `version` tiene que ser igual a VERSION_FILTRO de src/lib/por-la-letra/filtro.ts: es lo que impide que un banco generado con la regla vieja se haga pasar por filtrado.",
      "type": "object",
      "additionalProperties": false,
      "required": ["regla", "version"],
      "properties": {
        "regla": { "const": "CNT-11" },
        "version": { "type": "integer", "minimum": 1 }
      }
    },
    "conteo": {
      "comment": "CTR-09.1 y CTR-09.7 (enmendados, D-46). Con que conteo citado se calculo la dificultad: la ficha y la fecha del bloque conteo de setlistfm.json. Un test los compara con ese archivo: si el conteo se refresco y el banco no, el banco quedo viejo. El numero de cada tema no se copia aca: vive en setlistfm.json.",
      "type": "object",
      "additionalProperties": false,
      "required": ["ficha", "consultado"],
      "properties": {
        "ficha": { "type": "string", "pattern": "^RES-\\d{2,3}$" },
        "consultado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" }
      }
    },
    "nota": { "type": "string", "maxLength": 400 },
    "items": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/item" }
    }
  },
  "$defs": {
    "item": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "slug", "titulo", "desde", "versos",
        "dificultad", "dificultadSegun", "fuente"
      ],
      "properties": {
        "slug": {
          "comment": "La identidad del tema y la respuesta correcta. Que sea uno de los 105 de RES-20 no lo puede decir un schema: lo dice el cruce en build (D-13, CTR-09.10 fila 1).",
          "type": "string",
          "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$",
          "maxLength": 90
        },
        "titulo": {
          "type": "string",
          "minLength": 1,
          "maxLength": 80,
          "pattern": "^[^<>]+$"
        },
        "desde": {
          "comment": "Índice del primer verso de la ventana dentro de la lista de versos jugables del tema (los que pasan sirveComoVerso), base 0. Es lo que permite re-derivar el ítem contra el cancionero y detectar un banco viejo.",
          "type": "integer",
          "minimum": 0
        },
        "versos": {
          "comment": "Exactamente 8: es el paso 4 de BR-20. Ni 7 (el último escalón no agregaría nada) ni 9 (el dato contradiría al contrato). Si BR-20 cambia, este número cambia y el banco se regenera.",
          "type": "array",
          "minItems": 8,
          "maxItems": 8,
          "items": { "$ref": "#/$defs/verso" }
        },
        "dificultad": { "enum": ["facil", "media", "dificil"] },
        "dificultadSegun": {
          "comment": "CTR-09.7 (enmendado, D-46). 'en-vivo' = salio de los tercios del conteo citado (CTR-19.15). 'sin-conteo' = el tema no tiene linea en el conteo y D-27 lo pone en dificil. Nadie lo escribe a mano.",
          "enum": ["en-vivo", "sin-conteo"]
        },
        "fuente": { "$ref": "#/$defs/fuente" }
      },
      "if": { "required": ["dificultadSegun"], "properties": { "dificultadSegun": { "const": "sin-conteo" } } },
      "then": { "properties": { "dificultad": { "const": "dificil" } } }
    },
    "verso": {
      "comment": "CTR-09.4. El schema es la red, no el filtro: el filtro de verdad es sirveComoVerso() + ventanaValida() en el generador. Estas dos reglas cierran el caso medido `[A  G]`, que hoy pasa sirveComoVerso.",
      "type": "string",
      "minLength": 1,
      "maxLength": 90,
      "allOf": [
        {
          "comment": "Ni `<` ni `>`, igual que CTR-04: aparecen donde hay taller de guitarra, no donde hay canto.",
          "pattern": "^[^<>]+$"
        },
        {
          "comment": "Al menos una palabra de cuatro letras. Deja afuera `[A  G]`, `RE MI` y `RE  MIx3`, que hoy pasan por verso.",
          "pattern": "[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{4,}"
        },
        {
          "comment": "Una línea que es toda un corchete recto es del que transcribió, no un verso. Los paréntesis NO entran acá: el corpus tiene versos cantados entre paréntesis, como `(En las calles no me muestro más)` en Dr. Saturno.",
          "not": { "pattern": "^\\s*\\[[^\\]]*\\]\\s*$" }
        }
      ]
    },
    "fuente": {
      "comment": "CTR-09.6. Más estricto que CTR-06: acá ninguno de los tres puede ser null. Un tema cuya fuente no dijo de dónde salió no entra al banco.",
      "type": "object",
      "additionalProperties": false,
      "required": ["sitio", "url", "consultado"],
      "properties": {
        "sitio": {
          "comment": "Enum cerrado a propósito: un sitio nuevo rompe la validación en vez de entrar sin que nadie lo mire, igual que FICHA_POR_SITIO en generar-letra.mjs.",
          "enum": ["cifraclub.com", "letras.com", "lacuerda.net"]
        },
        "url": { "type": "string", "pattern": "^https?://", "maxLength": 300 },
        "consultado": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" },
        "ficha": { "type": "string", "pattern": "^RES-\\d{2}$" }
      },
      "allOf": [
        {
          "comment": "Los dos sitios fichados citan su ficha. lacuerda.net todavía no tiene, y su ausencia es la declaración (D-14).",
          "if": { "required": ["sitio"], "properties": { "sitio": { "const": "cifraclub.com" } } },
          "then": { "required": ["ficha"], "properties": { "ficha": { "const": "RES-49" } } }
        },
        {
          "if": { "required": ["sitio"], "properties": { "sitio": { "const": "letras.com" } } },
          "then": { "required": ["ficha"], "properties": { "ficha": { "const": "RES-23" } } }
        }
      ]
    }
  }
}
```

**Lo que este bloque deliberadamente NO dice, con su motivo:**

- **El piso de 60 ítems y la cuota de 15 fáciles.** Se podrían escribir —`minItems: 60`, y
  `contains` + `minContains: 15` sobre `dificultad: "facil"`— y sería tentador. No van: son
  números de `producto` (`US-07`, `BR-01`), y `producto` ya movió uno de esos números una vez
  (`US-02` pasó de 20 a 30 en `T-99`). Con el piso adentro del schema, un banco de 40 ítems
  en construcción sería **inválido** en vez de **incompleto**, y el build se pintaría de rojo
  por algo que no está roto. El piso se mide con el comando (2) de `CTR-09.11`, que es donde
  el número es una medición y no una regla de forma. Es el mismo reparto que usó `CTR-03.10`.
- **Que dos ítems no compartan `slug`.** JSON Schema no sabe decir "único por propiedad";
  `uniqueItems` solo caza objetos idénticos enteros. Va al comando (2).
- **Que los 8 versos sean contiguos y arranquen en `desde`.** Eso se comprueba contra el
  cancionero, no contra sí mismo: comando (3).

---

### CTR-09.9 — Ejemplo válido, con todo verificado contra el repo

> **La advertencia que se ganó `CTR-03.9`:** su ejemplo de la v1 salió con una ficha que no
> correspondía, un hecho falso y un `trackId` inventado que pasaba el schema. Acá **los ocho
> versos son los que hay hoy en `src/data/cancionero.json`**, y lo que no existe está puesto
> de forma que **no valide**.

> **Enmendado el 2026-09-24 (`T-284`).** El ejemplo decía `"contratoVersion": 1`, no tenía
> `conteo` y llevaba `"dificultad": "media"` con `"dificultadSegun": "curaduria"`, una etiqueta
> que, según el mismo ejemplo, era *"ilustrativa"*. Ahora la dificultad **no es ilustrativa**. Es la
> que da la regla con `RES-90`: *Dr. Saturno* figura 3 veces, 86 de los 88 temas del pozo figuran al
> menos 3 veces, y 86 es más que `2t = 60`. Por eso sale `dificil`, `en-vivo` (`CTR-19.15`, a
> confirmar con t14). `actualizado` sigue puesto para que no valide.

```json
{
  "contrato": "CTR-09",
  "contratoVersion": 2,
  "juego": "por-la-letra",
  "modoRespuesta": "buscador",
  "actualizado": "<AAAA-MM-DD de la corrida — lo escribe el generador, no se pone a mano>",
  "sensibleA": ["letra"],
  "filtro": { "regla": "CNT-11", "version": 1 },
  "conteo": { "ficha": "RES-90", "consultado": "2026-09-24" },
  "nota": "Un ítem por tema. Los versos son la ventana que revela la escalera de BR-20.",
  "items": [
    {
      "slug": "dr-saturno",
      "titulo": "Dr. Saturno",
      "desde": 5,
      "versos": [
        "Te pido una mejoría",
        "Estoy meando la puerta en tu cueva, doctor de amor",
        "Los remos muy pinchados",
        "A la moda del rock'n roll",
        "Me cago en mis huesos",
        "Que gastan la pana",
        "Mojada en vinagre de nostalgias",
        "Voy ciego, tonteando"
      ],
      "dificultad": "dificil",
      "dificultadSegun": "en-vivo",
      "fuente": {
        "sitio": "letras.com",
        "url": "https://www.letras.com/los-redonditos-de-ricota/202986/",
        "consultado": "2026-08-24",
        "ficha": "RES-23"
      }
    }
  ]
}
```

**Qué es verdadero acá, y contra qué se comprobó:**

- **El tema.** *Dr. Saturno*, pista 4 de *Momo Sampler* (2000). Está en `cancionero.json` con
  `slug: "dr-saturno"`, y ese slug ya cruzó la puerta de `D-13`: la ingesta lo resolvió
  contra los 105 de `RES-20` con `resolverTema()` antes de escribirlo.
- **Los ocho versos** son los renglones de letra del tema en `cancionero.json`, en orden,
  salteando los renglones en blanco que separan estrofas (que `sirveComoVerso` descarta).
- **`desde: 5` no es un número decorativo: es el primer valor que pasa el filtro.** Los cinco
  versos anteriores son *"Estoy hasta la pasta!"*, *"De misas cómicas mal"*, *"A prueba de
  bobos y a las tres en casa"*, *"¿Querés creer? Oh, no!"* y **"Dr. Saturno, dame un
  turno!"** — el quinto dice el título entero. Cualquier ventana que arranque en 0, 1, 2, 3
  o 4 lo incluye, y las cinco se descartan por `US-07` criterio 2. La primera que no lo
  incluye es la que arranca en 5, y es esta.
- **La fuente** es la que declara el cancionero para ese tema, y `RES-23` es la ficha que
  `generar-letra.mjs` ya mapea a `letras.com`.
- ~~**`dificultad: "media"` es ilustrativa.** Esa etiqueta la emite `contenido` en el archivo de
  curaduría (`CTR-09.7`); no la decido yo y no la fija este ejemplo.~~ *Reemplazado el
  2026-09-24: ver el recuadro de arriba.* `conteo` es el de `RES-90`, que existe y se puede
  verificar (`CTR-19.3`).

**Qué está marcado como inexistente:** `actualizado`, con un texto que **no pasa** el patrón
de fecha. Si alguien copia el ejemplo tal cual, el comando (1) falla, en vez de dejar pasar
una fecha verosímil e inventada.

---

### CTR-09.10 — Qué rechaza, y quién lo rechaza

La tabla existe para que nadie confunda *"validó"* con *"está bien"*.

| # | Qué se rechaza | Quién lo caza | Qué pasa |
|---|---|---|---|
| 1 | **Un tema fuera de los 105 de `RES-20`** | El cruce en build (`D-13`) y el comando (2). **No el schema**: un schema solo puede decir que el string tiene forma de slug | Rompe la corrida nombrando el slug |
| 2 | **Un verso que delata el título** | `ventanaValida()` en el generador; el comando (2) lo re-verifica sobre el banco entero | El tema se descarta; si ninguna ventana pasa, el tema no entra y el log dice por qué |
| 3 | **Un banco generado con una versión vieja de `CNT-11`** | El test que compara `filtro.version` contra `VERSION_FILTRO` | Falla y pide re-generar |
| 4 | **Un ítem sin fuente**, o con `sitio`/`url`/`consultado` en `null` | El schema (`required`, sin `null` en los tipos) | No valida |
| 5 | **Un sitio de letras nuevo, sin decidir** | El schema (enum cerrado de tres) | No valida. Es a propósito: se decide, no se cuela |
| 6 | **`cifraclub.com` o `letras.com` sin su ficha** | El schema (`if`/`then` con `const`) | No valida |
| 7 | **Una ventana que no tiene 8 versos** | El schema (`minItems`/`maxItems`) | No valida |
| 8 | **Una línea que no es un verso** (`[A  G]`, `RE MI`, tablatura) | `sirveComoVerso()` en el generador, y el schema como red (`CTR-09.4`, reglas 3 y 4) | No valida |
| 9 | **Un verso de más de 90 caracteres, o con `<` / `>`** | El schema | No valida |
| 10 | **Dos ítems con el mismo slug** | El comando (2). El schema **no puede** | Sale como desalineado |
| 11 | **Un banco viejo contra un cancionero re-ingerido** | El comando (3), que re-deriva los 8 versos desde `desde` | Sale como desalineado |
| 12 | **Un tema que `contenido` bajó** (`excluido`) | El generador, leyendo el archivo de curaduría | No entra al banco |
| 13 | **Que el verso diga lo que la banda canta** | **Nadie, y hay que decirlo.** La fuente es única (`US-07` c.3) y este juego acepta el riesgo porque una palabra mal transcripta no cambia cuál es el tema | — |
| 14 | **Un banco de antes de `D-46`** (`contratoVersion: 1`, `youtube`, `curaduria`, `sin-clasificar`, sin `conteo`) | El schema | No valida. Hay que volver a correr el generador. *Fila nueva, 2026-09-24* |
| 15 | **Un banco calculado con otro conteo**, o un nivel tocado a mano | t14 (`CTR-19.13`): compara `conteo` con `setlistfm.json` y vuelve a calcular cada nivel con `repartirEnTercios()` | Falla, nombra el ítem y pide `npm run generar-por-la-letra`. *Fila nueva, 2026-09-24* |
| 16 | **`sin-conteo` con un nivel que no es `dificil`** | El schema (`if`/`then`) | No valida. *Fila nueva, 2026-09-24* |

La fila 13 no es un descuido: es el límite declarado de este contrato, y es la razón por la
que `US-07` no necesitó que se abriera el candado que `D-25` tuvo que abrir para `US-03`.

---

### CTR-09.11 — Verificación: qué correr, y quién

`arquitectura` no tiene con qué ejecutar (`D-12`) y no lo simula. **Lo corre el hilo
principal en `T-139`**, o `revisor` en `T-146`.

```bash
# (1) el banco contra el schema — lo que pide la fila "Verifica con" de T-133
node --test src/lib/esquemas.test.ts

# (2) lo que el schema no puede: D-13, slugs repetidos, el piso de CNT-11 y los numeros de US-07
node -e "Promise.all([import('./src/lib/letra/temas.ts'),import('node:fs')]).then(([t,{readFileSync}])=>{const j=JSON.parse(readFileSync('src/data/por-la-letra.json','utf8'));const ok=new Set(t.leerTemas().map(x=>t.slugDeTitulo(x.titulo)));const f=[],vistos=new Set();for(const it of j.items){if(!ok.has(it.slug))f.push('fuera de los 105: '+it.slug);if(vistos.has(it.slug))f.push('slug repetido: '+it.slug);vistos.add(it.slug);if(it.versos.length!==8)f.push('versos!=8: '+it.slug);const d=t.normalizarDuro(it.titulo);for(const v of it.versos)if(t.normalizarDuro(v).includes(d))f.push('delata el titulo: '+it.slug+' -- '+v);}const fac=j.items.filter(i=>i.dificultad==='facil').length,sc=j.items.filter(i=>i.dificultad==='sin-clasificar').length;console.log(f.length?'DESALINEADO:\n  '+f.join('\n  '):'OK '+j.items.length+' items');console.log('piso US-07 (60):',j.items.length>=60?'cumplido':'faltan '+(60-j.items.length),'| faciles (15):',fac>=15?'cumplida':'faltan '+(15-fac),'| sin clasificar:',sc)})"

# (3) que el banco no haya quedado viejo: los 8 versos se re-derivan del cancionero desde `desde`
node -e "Promise.all([import('./src/lib/cancionero/anotacion.ts'),import('node:fs')]).then(([a,{readFileSync}])=>{const c=JSON.parse(readFileSync('src/data/cancionero.json','utf8')),j=JSON.parse(readFileSync('src/data/por-la-letra.json','utf8'));const porSlug=new Map(c.temas.map(t=>[t.slug,t]));const f=[];for(const it of j.items){const t=porSlug.get(it.slug);if(!t){f.push('no esta en el cancionero: '+it.slug);continue;}const vs=t.secciones.flatMap(s=>s.lineas.filter(l=>l.t==='letra'&&a.sirveComoVerso(l.texto)).map(l=>l.texto.trim()));const esperado=vs.slice(it.desde,it.desde+8);if(JSON.stringify(esperado)!==JSON.stringify(it.versos))f.push('quedo viejo: '+it.slug);}console.log(f.length?'DESALINEADO:\n  '+f.join('\n  '):'OK: los '+j.items.length+' items se re-derivan del cancionero')})"

# (4) la escalera, el buscador y la version del filtro
node --test src/lib/por-la-letra/*.test.ts
```

> **Enmendado el 2026-09-24 (`T-284`).** El comando (4) ahora también corre
> `src/lib/por-la-letra/banco.test.ts`, que es t14: el banco da los niveles de la regla con el
> conteo vigente. El comando (2) sigue sirviendo tal como está: el contador de *"sin clasificar"*
> va a dar siempre 0, y la cuota de 15 Fáciles pasa a ser una medición real. Casos del schema
> enmendado, para escribir junto a los de `esquemas.test.ts` con su control en verde:
>
> | # | Caso | Se espera |
> |---|---|---|
> | p0 | el banco regenerado, tal cual | **valida** |
> | p1 | un ítem con `dificultadSegun: "youtube"` | rechaza |
> | p2 | un ítem con `dificultadSegun: "curaduria"` | rechaza |
> | p3 | un ítem con `dificultad: "sin-clasificar"` | rechaza |
> | p4 | `dificultadSegun: "sin-conteo"` con `dificultad: "facil"` | **rechaza** |
> | p5 | banco sin `conteo` | rechaza |
> | p6 | `contratoVersion: 1` | rechaza |
> | p7 | `conteo.ficha: "74"` (sin la forma `RES-`) | rechaza |
>
> p1, p4 y p5 son las tres reglas que esta enmienda existe para hacer cumplir. Si una de las tres
> valida, la enmienda no sirve.

**Qué chequea la máquina y qué no:**

| # | Chequeo | Quién |
|---|---|---|
| 1 | Envoltorio, forma del ítem, forma del verso, fuente y su ficha | comando (1) |
| 2 | Que cada slug sea uno de los 105 (`D-13`) y que no se repita | comando (2) |
| 3 | El piso de `CNT-11`: ningún verso contiene el título | comando (2) |
| 4 | El piso de 60 y la cuota de 15 fáciles de `US-07` | comando (2) |
| 5 | Que el banco corresponda al cancionero de hoy | comando (3) |
| 6 | Que `filtro.version` sea la vigente | comando (4) |
| 7 | Que la escalera corte 1/2/4/8 y que se compare por identidad | comando (4) |
| 8 | Que las reglas finas de `CNT-11` estén bien escritas | **humano**: `contenido` las escribe, `revisor` las lee contra `CNT-11` |
| 9 | Que el verso diga lo que la banda canta | **nadie** — fila 13 de `CTR-09.10` |
| 10 | Que el paso 4 entre en una pantalla de 375 px | **humano**, con `UX-08` a la vista |

---

## Dónde me aparto de `CTR-03`, y por qué

Los dos juegos comparten catálogo (105 temas), modo de respuesta (buscador), comparación por
identidad y lenguaje de puntaje. Le robé la estructura a `CTR-03` donde tenía sentido. Estas
son las siete filas donde no:

| Punto | `CTR-03` (audio) | `CTR-09` (letra) | Por qué |
|---|---|---|---|
| Qué es el archivo | Manifiesto de archivos que existen | **Banco de ítems con contenido adentro** | El fragmento vive en `public/audio/`; el verso no vive en ningún otro lado |
| La clave del array | `fragmentos` | `items` | Adentro hay ítems de contenido de verdad |
| Schema en `src/data/_schema/` | **No se baja** | **Se baja, y entra al test** | Acá el archivo lleva texto que lee la gente y un rótulo de fuente, y lo alimenta un archivo hecho a mano |
| Los pasos | Ni un dato en el JSON | **8 versos por ítem**; los pasos siguen sin estar | Los 6 pasos de audio salen del mismo mp3; los 4 de texto necesitan los renglones |
| Mover la escalera | No migra un solo dato | **Regenera el banco entero** | Consecuencia directa de la fila anterior. Se paga con una corrida, no con trabajo humano |
| `dificultad` | Retirada: no hay ítems que etiquetar | **Está, con archivo de curaduría y plan B.** *Desde el 2026-09-24: está, la escribe el generador con los tercios del conteo (`CTR-09.7`, enmendado). `US-02` la calcula en build con el corte de 8. Es la misma fuente con dos reglas, y las dos viven en `en-vivo.ts`* | Acá hay un ítem por tema y `US-07` pide 15 fáciles |
| La fuente | Solo el cruce contra `RES-20`, sin campo | **Cruce + campo `fuente`** | El cruce respalda el título; nada respalda el verso salvo decir de dónde salió (`US-07` c.3) |

---

## Consecuencias

- **Para `contenido`:** dos entregas, y ninguna es este archivo. `CNT-11` se vuelve código
  adentro de `ventanaValida()` (`CTR-09.5`), y las etiquetas de dificultad van a
  `src/data/por-la-letra-curaduria.json` (`CTR-09.7`), keyed por slug. El juego **no espera**
  a que estén las 60: sale con `sin-clasificar` y se ordena después.
  *Enmendado el 2026-09-24 (`D-46`): la segunda entrega ya no existe. `contenido` no etiqueta
  dificultad en este juego; en la curaduría le queda solo `excluido`.*
- **Para el hilo principal (`T-285`), desde el 2026-09-24:** el generador de `CTR-09.7`
  (enmendado), el schema de `CTR-09.8`, el banco regenerado y t14. El detalle de la regla está en
  `CTR-19.15`.
- **Para `producto`, señalado y no resuelto acá:** si un ítem `sin-clasificar` puede salir en
  el primer escalonamiento de `BR-01`. El dato lo permite; la ronda decide.
- **Para `experiencia` (`UX-08`):** el paso 4 puede llegar a 720 caracteres en el peor caso,
  ~20 renglones a 375 px, con el buscador en pantalla. El caso mediano es un tercio de eso.
  El número está en `CTR-09.4`; la salida es de `UX-08`.
- **Para el hilo principal (`T-139`):** el generador sale de `cancionero.json`, filtra por
  `contenido === "letra"`, aplica `sirveComoVerso()` y desliza la ventana de 8 hasta la
  primera que pasa `ventanaValida()`. **La función que lista los versos jugables de un tema
  hoy vive adentro de `generar-letra.mjs`** (`versosDe`), y el comando (3) la necesita
  también: conviene que suba a `src/lib/cancionero/` con el `tipo` de sección al lado de cada
  verso, que es lo que `CNT-11` va a mirar. Y el log tiene que imprimir **el conteo de
  descartes por motivo**: un descarte silencioso no se audita.
- **Para el hilo principal (`T-140`):** `escalera.ts` de este juego es cuatro constantes;
  `buscador.ts` y `catalogo.ts` de `src/lib/tema/` se reusan sin tocarlos, igual que pide el
  plan. Lo único nuevo es cortar `versos.slice(0, n)`.
- **Fácil:** bajar un tema si llega un reclamo (`D-14`) — una línea en el archivo de
  curaduría y volver a correr el generador, sin tocar código.
- **Fácil:** endurecer `CNT-11` — una cláusula más en `ventanaValida()`, subir
  `VERSION_FILTRO`, re-generar. El test avisa si alguien se olvida del último paso.
- **Difícil:** volver a un banco con prosa por tema, o con más de un ítem por tema. No
  imposible, pero es otro contrato: el `slug` dejaría de alcanzar como identidad y volvería
  un `PL-NNN`, que por eso quedó sin gastar.
- **Este contrato no frena nada.** El encuadre es `D-14`, y el piso de `US-07` se alcanza en
  la misma corrida que lo genera.

## Qué NO decide este contrato

- **Qué verso puede abrir la escalera, más allá del piso de `US-07` criterio 2:** `CNT-11`
  (`contenido`, `T-137`). Acá está el lugar donde esa regla corre y cómo se declara que corrió.
- ~~**La etiqueta de dificultad de cada tema:** `contenido`, en el archivo de curaduría.~~
  *Desde el 2026-09-24 no la decide nadie tema por tema: sale de la regla de `CTR-19.15`. Cambiar
  la regla es de `producto` (`BR-30`).*
- ~~**Si un ítem `sin-clasificar` entra al escalonamiento de `BR-01`:** `producto`.~~ *Desde el
  2026-09-24 ya no hay `sin-clasificar`.*
- **El piso de 60 y la cuota de 15:** `producto` (`US-07`). Acá solo se miden.
- **La pantalla, el disco que la viste y cómo entran 8 versos en 375 px:** `UX-08`
  (`experiencia`, `T-135`).
- **La tolerancia del buscador:** ya resuelta para `US-02`, se reusa sin cambios.
- **El copy del casete, del enunciado y del resultado:** `contenido`.
- **El botón de corrección:** `CTR-10` (`T-150`). Se engancha acá como en los otros juegos, y
  el payload que mande va a poder nombrar el ítem por su `slug`, que es la identidad estable
  de este banco.
