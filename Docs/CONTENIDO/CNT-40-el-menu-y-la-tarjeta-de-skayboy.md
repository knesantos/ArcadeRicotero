# CNT-40 — El menú, la tarjeta de fin de nivel y el rótulo de entrada de Skayboy y Poligirl

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-04 (sesión de `D-61`, después del ciclo 17).
- **Estado:** propuesta, lista para cablear.
- **Consume:** `Docs/DECISIONES.md` `D-61` entera (el pedido del usuario y los seis puntos),
  `D-14` (los molinetes van abiertos: acá, que ningún nivel se muestre trabado), `D-17`
  (voseo, sin anglicismos, sin infinitivo), `D-38` (nada narra a las personas reales),
  `Docs/SUGERENCIAS/HILO-para-todos-skayboy-menu-y-mando.md` (la tabla de huecos, con sus
  borradores), `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md` `BR-24` (nada de vidas, muerte,
  puntaje, rango ni tiempo), `BR-31` (nada que narre un logro compartido) y `BR-40` (el menú no
  pregunta; sin confirmación al abandonar una partida; el sexto vuelve al primero como parche),
  `.claude/rules/voz-ricotera.md` entero (registros 1 y 3, la regla de las dos líneas, `§8` lo
  que audita `voz.test.ts`), `.claude/rules/diseno-marca.md` (las fuentes: qué letra tiene
  tildes), `Docs/CONTENIDO/CNT-21` (los seis nombres, que acá **no se tocan**) y `CNT-22` (el
  molde del interruptor de pantalla completa, que esta nota enmienda en su `§1`),
  `Docs/UX/UX-33` `§1.2` y `§1.5` (el sello y su segundo estado), `src/lib/voz.test.ts` y
  `src/lib/skayboy/copy.ts` (lo que audita la máquina y el tono de lo que ya existe),
  `src/lib/skayboy/menu.ts` y `menu.test.ts` (leídos, no editados: es `src/`; de ahí salen los
  tres momentos del menú de `§1.2`).
- **Resuelve:** el encargo a `contenido` del traspaso de `D-61`. No me asignaron un `T-XX`
  (`T-401`..`T-410` están reservadas, pero la fila no dice cuál es esta).

## 0. Cómo leer esta nota

**Los nombres de campo del traspaso no se tocan; los valores sí.** El código se construye al
mismo tiempo y apunta a los campos de la tabla del traspaso. Renombrar uno para que "quede
lindo" rompe una compilación a cambio de nada. Lo que mande esta nota es el **valor**. Los seis
nombres de nivel son los de `CNT-21` y no se vuelven a escribir acá.

**Dos borradores del hilo cambian y el resto pasa la vara tal como vino**: `MENU.niveles`
(`§1.4`) y `FIN_DE_NIVEL.sigue` (`§2.2`). Los dos sellos de pantalla completa son los que
propuso el hilo, y lo que cambian es `CNT-22 §1` (`§5`). De cada texto que pasa sin cambios dejo
dicho por qué pasa, y en `§7` queda la lista de lo que **no** escribí, que es parte de la
decisión.

**Las funciones van en objetos**, como el resto de `copy.ts`: `voz.test.ts` solo audita las
funciones que viven un nivel adentro de un objeto exportado (`MENU.cualToca`, no un `export
function` suelto). Los valores de las funciones están escritos con `{n}`, `{total}`, `{nombre}`
y `{estado}` donde van los datos.

## 1. El menú

### 1.1 Los textos

| Campo | Texto | Registro | Dónde se lee |
|---|---|---|---|
| `MENU.sello` | **`MENÚ`** | 3 | sello en el mueble, durante la partida |
| `MENU.abrir` | **`Abrí el menú`** | 1 | `aria-label` del sello |
| `MENU.jugar` | **`Jugá`** | 1 | botón grande, al entrar y al abrirlo con el nivel ganado |
| `MENU.seguirJugando` | **`Seguí jugando`** | 1 | botón grande, con una partida en pausa |
| `MENU.repetir` | **`Empezá el nivel de nuevo`** | 1 | botón chico, solo con una partida en pausa |
| `MENU.cualToca(n, nombre)` | **`Nivel {n}: {nombre}`** | 3 | renglón chico debajo del botón grande |
| `MENU.niveles` | **`Los niveles, todos abiertos`** | 3 | título de la lista |
| `MENU.numero(n)` | **`Nivel {n}`** | 3 | número de cada ficha |
| `MENU.pasado` | **`PASADO`** | 3 | sello en la ficha de un nivel pasado |
| `MENU.estasAca` | **`ACÁ ESTÁS`** | 3 | sello en la ficha del nivel armado |
| `MENU.etiqueta(n, nombre, estado)` | **`Nivel {n}, {nombre}. {estado}.`** | 3 | `aria-label` de cada ficha |

`MENU.etiqueta` sin ningún estado queda **`Nivel {n}, {nombre}.`**, sin el segundo tramo.
`{estado}` es lo que dicen los sellos de esa ficha, con la inicial en mayúscula y el resto en
minúscula, unidos con coma: `Pasado`, `Acá estás` o `Pasado, acá estás`. Que el lector diga lo
mismo que el sello (y no una paráfrasis) es la regla del nombre accesible de `§6.2`.

### 1.2 Qué dice el menú en cada momento

Los momentos son los tres de `momentoDe()` en `menu.ts`. El botón grande es lo único que cambia
de palabra, y el renglón de abajo siempre nombra el nivel que ese botón va a jugar.

| Momento | Botón grande | Botón chico | Renglón | Sello `ACÁ ESTÁS` |
|---|---|---|---|---|
| `entrada` (la página recién abierta) | `Jugá` | no hay | `Nivel {n}: {nombre}` del que corresponde | en ninguna ficha |
| `pausa` (abierto jugando) | `Seguí jugando` | `Empezá el nivel de nuevo` | `Nivel {n}: {nombre}` del que está en pausa | en la del nivel en pausa |
| `ganado` (abierto desde la tarjeta con `Elegí otro`) | `Jugá` | no hay | `Nivel {n}: {nombre}` del que sigue (en el sexto, el primero) | en la del que se acaba de pasar |

**`ACÁ ESTÁS` solo existe donde hay un "acá"**: una partida empezada o un nivel recién ganado.
En la entrada nadie está en ningún lado todavía, y ponerle ese sello al nivel que va a jugar el
botón grande sería decir dos veces lo mismo. **Condición para quien cablee:** en `entrada`,
`fichasDelMenu()` recibe `null` como `actual`. Si queda armado con el id del nivel de arranque,
el sello aparece sin necesidad; no miente, pero sobra.

### 1.3 La regla de las dos líneas, en el menú

El menú es una pantalla que presenta algo, así que tiene una línea que nombra y otra que canta.
**Las que cantan ya están escritas y son los seis nombres de `CNT-21`**: `De a dos, despacito`,
`Lo que pesa, se queda`, `El salto más largo de todos`. Las que nombran son `Los niveles, todos
abiertos`, el número de cada ficha y el renglón del botón grande.

**La prueba**, tapando los seis nombres: quien llegó por un enlace sigue viendo `Jugá`, un
renglón que dice `Nivel 1`, la lista titulada `Los niveles` y seis fichas numeradas. Sabe qué
tocar. Por eso no escribí una línea cantada extra para el menú: sería la segunda línea que canta
sobre una pantalla donde ya cantan seis.

### 1.4 Lo que se decidió, y lo que se descartó

**`MENU.niveles` pasa de `Los niveles` a `Los niveles, todos abiertos`.** Es la única línea de la
pantalla que puede decir en voz alta lo que `D-61` punto 2 y `BR-40` decidieron: que ningún nivel
está detrás de otro. Quien jugó videojuegos espera candados, y la ausencia de un ícono de candado
no se lee como una afirmación; una línea sí. Es registro 3 (dice qué hay y se calla), cuatro
palabras, y es de la misma familia que `Las dos puertas, abiertas.` (`CNT-22 §2`), sin arrancar
una frase nueva. **Dependencia:** si algún día un nivel vuelve a depender de otro, esta línea
miente y se cambia en el mismo commit.
Descarté `Los niveles` pelado (no dice lo que importa), `Elegí un nivel` (se repite con
`Elegí otro` de la tarjeta, y el menú ya muestra fichas que se tocan) y `Todos abiertos` solo
(sin sustantivo, el título deja de nombrar).

**`ACÁ ESTÁS` se queda.** Pensé en `EN PAUSA`, que es más seco, y lo descarté por un caso que el
código ya tiene: con el menú abierto desde la tarjeta (`ganado`), el nivel recién pasado es el
armado y su ficha lleva `actual`. Ahí no hay nada en pausa; hay un nivel terminado. `ACÁ ESTÁS`
es verdad en los dos momentos. Es un sello de lugar, la misma familia de `Acá va el juego.`
(`PANTALLA.rotuloCarga`), y no suena a nada más.

**`PASADO` se queda.** Es la palabra del avance guardado (`pasados`, `BR-40`) y la que usa el
sitio cuando habla de esto. Descarté `GANADO` (`UX-33 §2.6` y `BR-31` vigilan todo lo que suene a
ganar) y `COMPLETO` (sugiere una barra de progreso que no hay).

**`Seguí jugando`** es la misma cadena que `quiz/copy.ts` ya usa para volver a una partida
(`volver: 'Seguí jugando'`). **`Jugá`** es la de `mas-o-menos/copy.ts` (`boton: 'Jugá'`). Ninguna es
una palabra nueva del sitio.

**`Empezá el nivel de nuevo` conserva las cinco palabras.** Sin `el nivel`, `Empezá de nuevo` se
puede leer como borrar el avance de los seis, y `BR-40` punto 6 deja claro que acá se abandona
**solo la posición dentro de un nivel**, sin confirmación. Decir el alcance en el botón es lo que
permite que no haya un `¿Seguro?` después.

**Sin confirmación.** Ningún texto de este documento pregunta, avisa ni pide confirmar. Es
`BR-40` punto 1 y punto 6, y es `D-32` límite 3: una pantalla más entre el dedo y el juego es un
molinete con forma de aviso.

## 2. La tarjeta de fin de nivel

### 2.1 Los textos

| Campo | Texto | Registro | Dónde se lee |
|---|---|---|---|
| `FIN_DE_NIVEL.rotulo(n, total)` | **`NIVEL {n} DE {total} · PASADO`** | 3 | sello grande de la tarjeta |
| `FIN_DE_NIVEL.sigue(nombre)` | **`Siguiente: {nombre}`** | 3 | renglón chico, solo si no es el último |
| `FIN_DE_NIVEL.seguir` | **`Seguí`** | 1 | botón principal. Es `PANTALLA.seguir`, no una cadena nueva |
| `FIN_DE_NIVEL.volverAlPrimero` | **`Volvé al primero`** | 1 | botón principal **en el sexto**, en lugar de `Seguí` |
| `FIN_DE_NIVEL.repetir` | **`Repetí`** | 1 | botón de la tarjeta |
| `FIN_DE_NIVEL.menu` | **`Elegí otro`** | 1 | botón de la tarjeta; abre el menú |
| (el renglón del sexto) | **`Último nivel.`** | 3 | en lugar de `sigue`. Es `PANTALLA.avisoUltimo`, no una cadena nueva |

### 2.2 Lo que se decidió

**`FIN_DE_NIVEL.sigue` pasa de `Sigue: {nombre}` a `Siguiente: {nombre}`.** La tarjeta tiene un
botón que dice `Seguí` pegado al renglón que dice `Sigue:`: el mismo verbo en dos personas, a un
dedo de distancia, uno rotulando y otro mandando. Se lee como un error de tipeo. `Siguiente` es
un sustantivo y no se parece a un verbo del botón.

**La tarjeta nunca dice que se ganó.** `NIVEL 2 DE 6 · PASADO` habla del nivel y no de las
personas. No dice `ganaron`, `lo lograron` ni nada con sujeto: no narra un logro compartido
(`BR-31`, `UX-33 §2.6`) ni uno individual (`BR-23`). Y no cuenta nada que se agote ni que
compare: `2 de 6` es el lugar en la fila, no un puntaje ni un rango (`BR-24`).

**Los dos botones secundarios quedan en el verbo corto.** `Repetí` y `Elegí otro` se leen justo debajo de
`NIVEL 2 DE 6 · PASADO`, que ya dijo de qué nivel se habla; en la conversación el objeto se
omite solo. La alternativa con objeto (`Repetí el nivel`, `Elegí otro nivel`) la descarté por el
ancho de la tarjeta en un teléfono parado, donde son tres botones en un renglón. `Jugá de nuevo`
(es lo que dice `mas-o-menos`) también lo descarté: en la tarjeta, `Jugá` empezaría a significar
dos cosas que hacen distinto, y en el menú el botón grande ya se llama así.

**`Elegí otro` abre una pantalla titulada `Los niveles, todos abiertos`.** La palabra que
promete (`otro`) y la que se encuentra (`niveles`) son del mismo campo, y no hace falta decirle
a nadie que lo que se abre es el menú.

**El botón principal del sexto no es `Seguí`.** Ver `§3`.

## 3. El sexto nivel: el parche, dicho como parche

`BR-31` punto 1 manda el toque del sexto a la pieza compartible de `BR-27`, que no existe, y
`BR-40` punto 7 aceptó que mientras tanto el sexto vuelva al primero. Eso cambia una decisión
mía: **`CNT-22 §0` dejó escrito que el botón no cambia de palabra en el sexto**, porque `Seguí`
promete "lo que sigue" y lo que seguía era la pieza compartible. Con el toque llevando al primero,
`Seguí` ya no es verdad en el sexto: prometería lo que sigue y cumpliría un reinicio. El sitio no
promete lo que no va a cumplir (`ADR-08.2`). Así que, **mientras no exista la pieza**:

- el renglón de la tarjeta dice `Último nivel.` (no `Siguiente: {nombre del primero}`; el
  botón ya dice adónde va);
- el botón principal dice `Volvé al primero`;
- `Repetí` y `Elegí otro` quedan igual;
- el toque invisible sobre el área (`#seguir-juego`) conserva su `aria-label`, `PANTALLA.seguir`;
  con `Último nivel.` leído antes (`avisoUltimo`), quien lo usa sabe adónde lleva.

**El día que la pieza de `BR-27` exista** (`T-302`), el botón del sexto vuelve a ser `Seguí`, el
renglón pasa a `PANTALLA.avisoUltimoNivel` (`Último nivel. Ahora se comparte.`, que sigue en
`copy.ts` auditada y sin mostrarse) y `FIN_DE_NIVEL.volverAlPrimero` se borra. Ese día vuelve a valer
lo que dicen `CNT-22 §0` y `§3`, tal cual.

## 4. El rótulo de entrada

| Campo | Texto | Registro | Dónde se lee |
|---|---|---|---|
| `ENTRADA.rotulo(n, total)` | **`NIVEL {n} DE {total}`** | 3 | primera línea |
| (el nombre) | el `nombre` del nivel, de `CNT-21` | 1 | segunda línea |

Es la regla de las dos líneas más limpia que tiene este juego: **la primera nombra, la segunda
canta.** Tapando el nombre, `NIVEL 2 DE 6` dice dónde estás. Tapando el número, `De a dos,
despacito` es un verso que se queda solo. No lleva punto, ni verbo, ni nada para tocar: no toma
toques (`D-61` punto 3).

**Las dos líneas tienen que coincidir con las del menú y la tarjeta.** El mismo `NIVEL {n} DE
{total}` abre el nivel y lo cierra (`NIVEL {n} DE {total} · PASADO`), y el mismo nombre es el de
la ficha. Quien vio el rótulo de entrada reconoce el sello de salida.

**Un solo caso que conviene tener presente:** `El salto más largo de todos` tiene tilde (`más`),
y los nombres no pueden ir en `--fuente-titular` (el calco tiene doce letras y ninguna tilde) ni
el de `más` en `--fuente-marca-firma` (sin acentos). Van en `--fuente-rotulada` o en `--fuente`.

## 5. La pantalla completa: enmienda de `CNT-22 §1`

| Campo | Antes (`CNT-22 §1`) | Ahora | Registro |
|---|---|---|---|
| `PANTALLA_COMPLETA.ventana` | `PANTALLA NORMAL` | **`PANTALLA COMPLETA`** | 3, sello |
| `PANTALLA_COMPLETA.completa` | `PANTALLA COMPLETA` | **`SALÍ`** | 3, sello |
| `PANTALLA_COMPLETA.entrar` | `Entrá a pantalla completa` | sin cambios | 1, `aria-label` |
| `PANTALLA_COMPLETA.salir` | `Salí de pantalla completa` | sin cambios | 1, `aria-label` |

**El cambio de criterio.** `CNT-22 §1` copió el molde de `CINTA`: el sello nombra el **estado** y
el `aria-label` nombra el **verbo**. Funciona cuando el estado se ve en otro lado (una cinta que
suena se oye). Acá no: `PANTALLA NORMAL` es un estado que nadie ve ni oye, y el usuario no
encontró el control (`D-61`, contexto 1). **El sello pasa a nombrar lo que hace el toque.** Las
claves del objeto (`ventana`, `completa`) siguen siendo el estado en que se está; los valores,
lo que pasa si se toca. Ese cruce es raro de leer en el código y por eso lo dejo escrito acá y
no en un renombrado: renombrar es de quien cablea.

- **`PANTALLA COMPLETA`** es el nombre que cualquiera conoce de cualquier otro botón del mismo
  tipo, y es literal: el toque lleva a eso. Mide lo mismo que la estampa de `CNT-22`, que ya
  estaba en el sello y entraba.
- **`SALÍ`**: dentro de la pantalla completa no hay nada más del sitio a la vista, y salir de ahí
  es volver al resto del sitio. Es la palabra que dice eso. Contiene el mismo verbo que el
  `aria-label` (`Salí de pantalla completa`), que es una condición de `§6.2`.

**Descartados.** `PANTALLA NORMAL` fuera del modo (el defecto de partida; y no lo contiene el
`aria-label`). `AMPLIÁ` / `ACHICÁ` (es el verbo, pero no dice qué se agranda, y ninguno está
dentro de `Entrá a pantalla completa` ni de `Salí de pantalla completa`, así que quien maneja la
pantalla por voz no los puede decir). `SALÍ DE PANTALLA COMPLETA` (cuatro palabras en un sello
que `UX-33 §1.2` quiere con una palabra rotulada). `VOLVÉ` (se parece a `Volvé al primero` y
no dice de qué se vuelve).

**Se rompe una afirmación de `CNT-22 §1`**: *"Ninguna de las dos estampas lleva tilde… esta pieza
no hereda esa deuda"*. `SALÍ` lleva tilde, y `MENÚ` y `ACÁ ESTÁS` también. Los tres van en
`--fuente-rotulada` (Archivo Black, que tiene todas), que es lo que el hilo ya dijo y lo que
`diseno-marca.md` manda para las palabras con tilde. No es deuda nueva: es la deuda declarada, que
ahora se usa. El comentario de `copy.ts` sobre las dos estampas sin tilde se queda viejo, y el
cambio lo hace quien cablea.

**El botón también está en el menú, con las mismas cadenas.** No hay un texto aparte para ese
lugar.

## 6. Verificación a mano

### 6.1 Contra las siete reglas de `voz.test.ts §8` y `BR-24` / `BR-31`

**Contado a mano, no corrido**: este rol no tiene con qué correr el test (`D-12`). Las funciones
se evaluaron con los datos del ejemplo (nivel 3, `Un favor que no se ve`, 2 de 6). La primera
palabra se mira sin tilde, como lo hace el test. Lo corre el hilo principal con el comando de `§8`.

| Cadena | 1 Anglicismo | 2 Folleto | 3 Infinitivo | 4 ≤ 8 | 6 "la gente" | 7 Suspensivos | `BR-24` / `BR-31` |
|---|---|---|---|---|---|---|---|
| `MENÚ` | ninguno | ninguna | `menu` ✓ | 1 | no aplica | no lleva | ✓ |
| `Abrí el menú` | ninguno | ninguna | `abri`, no `abrir` ✓ | 3 | no aplica | no lleva | ✓ |
| `Jugá` | ninguno | ninguna | `juga`, no `jugar` ✓ | 1 | no aplica | no lleva | ✓ |
| `Seguí jugando` | ninguno | ninguna | `segui` ✓ | 2 | no aplica | no lleva | ✓ |
| `Empezá el nivel de nuevo` | ninguno | ninguna | `empeza` ✓ | 5 | no aplica | no lleva | ✓ |
| `Nivel 3: Un favor que no se ve` | ninguno | ninguna | `nivel` ✓ | 8 | no aplica | no lleva | ✓ |
| `Los niveles, todos abiertos` | ninguno | ninguna | `los` ✓ | 4 | no aplica | no lleva | ✓ |
| `Nivel 3` | ninguno | ninguna | `nivel` ✓ | 2 | no aplica | no lleva | ✓ |
| `PASADO` | ninguno | ninguna | `pasado`, no `pasar` ✓ | 1 | no aplica | no lleva | ✓ |
| `ACÁ ESTÁS` | ninguno | ninguna | `aca` ✓ | 2 | no aplica | no lleva | ✓ |
| `Nivel 3, Un favor que no se ve. Pasado.` | ninguno | ninguna | `nivel` ✓ | 9 | no aplica | no lleva | ✓ |
| `NIVEL 2 DE 6 · PASADO` | ninguno | ninguna | `nivel` ✓ | 6 | no aplica | no lleva | ✓ |
| `Siguiente: Un favor que no se ve` | ninguno | ninguna | `siguiente` ✓ | 7 | no aplica | no lleva | ✓ |
| `Volvé al primero` | ninguno | ninguna | `volve` ✓ | 3 | no aplica | no lleva | ✓ |
| `Repetí` | ninguno | ninguna | `repeti` ✓ | 1 | no aplica | no lleva | ✓ |
| `Elegí otro` | ninguno | ninguna | `elegi`, no `elegir` ✓ | 2 | no aplica | no lleva | ✓ |
| `NIVEL 2 DE 6` | ninguno | ninguna | `nivel` ✓ | 4 | no aplica | no lleva | ✓ |
| `PANTALLA COMPLETA` | ninguno | ninguna | `pantalla` ✓ | 2 | no aplica | no lleva | ✓ |
| `SALÍ` | ninguno | ninguna | `sali`, no `salir` ✓ | 1 | no aplica | no lleva | ✓ |

La columna "≤ 8" **no la mide el test para estas cadenas** (solo mira las líneas de la lista de
`voz 4.1`); la cuento porque `voz-ricotera.md §4.1` es la vara y todas la cumplen. Ninguna
cadena de este documento lleva `…` ni `¿`, ni nombra una vida, una muerte, un puntaje, un
rango, un tiempo, ni a Skayboy y Poligirl por su nombre real. Ninguna pregunta ni avisa nada
sobre con cuántas personas se juega (`BR-40`, criterio B).

### 6.2 El nombre accesible contiene el texto visible

Lo que se ve tiene que estar dentro de lo que dice el lector. Es la condición para que quien
maneja la pantalla por voz diga lo que ve y funcione. **El sello `PANTALLA NORMAL` de `CNT-22`
no la cumplía**: `Entrá a pantalla completa` no lo contiene. Es una razón más del cambio de `§5`.

| Control | Se ve | Lo que lee el lector | ¿Lo contiene? |
|---|---|---|---|
| sello del mueble | `MENÚ` | `Abrí el menú` | sí |
| botón de pantalla completa, fuera del modo | `PANTALLA COMPLETA` | `Entrá a pantalla completa` | sí |
| botón de pantalla completa, en el modo | `SALÍ` | `Salí de pantalla completa` | sí |
| ficha del menú | `Nivel 3`, el nombre, `PASADO`, `ACÁ ESTÁS` | `Nivel 3, {nombre}. Pasado, acá estás.` | sí, todo |
| *(antes)* botón de pantalla completa | `PANTALLA NORMAL` | `Entrá a pantalla completa` | **no** |

### 6.3 Un panel de HTML necesita nombre, y no hace falta cadena nueva

El menú y la tarjeta son paneles encima del área. Para que el lector sepa dónde está, **se
nombran por referencia** (`aria-labelledby` al título de la lista y al sello de la tarjeta), no
con un `aria-label` escrito a mano: `voz.test.ts` falla el build si una isla escribe uno, y con
razón (`ninguna isla escribe a mano un placeholder ni un aria-label`).

## 7. Lo que no escribí, y por qué

- **Ningún texto de confirmación** (`¿Seguro?`, `Vas a perder…`). `BR-40` punto 6.
- **Ningún contador de niveles pasados en el menú** (`2 de 6 pasados`). La lista ya lo dice ficha
  por ficha, `BR-40` no lo pide, y un total arriba de la lista empieza a ser un puntaje con otro
  nombre (`BR-24`).
- **Nada que explique el mando que rueda** (`D-61` punto 4). El mando no se explica (`TECLAS` son
  `aria-label` y nada más); una línea que diga "deslizá el pulgar" sería la segunda línea que
  traduce la primera, que es lo que `voz-ricotera.md §4.6` no hace.
- **Ningún texto para iPhone** ni para el giro automático de Android. Ya lo decidió `CNT-22 §6`:
  explicar el mecanismo no le sirve a nadie para jugar.
- **Ninguna línea cantada nueva para el menú, la tarjeta o el rótulo** (`§1.3`, `§4`). Cantan los
  nombres de `CNT-21`.
- **Ningún texto que nombre el disco.** `CNT-20` vale entero: el disco no se nombra en pantalla.

## 8. Qué no tiene comando y se mira a ojo

- **Que `ACÁ ESTÁS` aparezca solo donde hay partida o nivel recién ganado** (`§1.2`): se ve
  abriendo el menú en la entrada, en pausa y desde la tarjeta.
- **Que la ficha con `ACÁ ESTÁS` en pausa siga la partida y no la empiece de cero** (lo hace
  `alTocarFicha()` en `menu.ts`, y `menu.test.ts` lo juega). Si algún día no, el sello miente.
- **Que `PANTALLA COMPLETA` entre en el sello fuera del modo** en un teléfono parado de 375
  de ancho, con `MENÚ` a la izquierda: recién se ve en el navegador, igual que en `CNT-22 §7`.
- **Que ninguna cadena narre un vínculo entre los dos ni un logro compartido** (`D-38` baranda 3,
  `BR-31`): criterio de lectura, lo audita `revisor`.

Lo que corre solo, apenas las cadenas aterricen en `src/lib/skayboy/copy.ts`:

```
node --test src/lib/voz.test.ts
rg -in "vida|muerte|moriste|perdiste|game over|ganaron|se abrazan|de la mano" src/lib/skayboy/ src/scripts/partida-skayboy.ts
```

## Bloqueos

Ninguno. No hace falta ficha `RES-XX`: son decisiones de tono y de registro. Las personas
reales que estos textos podrían tocar son las de `CNT-17`, y ninguno las nombra (`D-38`
baranda 1).

## Siguiente

- `hilo principal` copia las cadenas de `§1`, `§2`, `§4` y `§5` a `src/lib/skayboy/copy.ts` como
  objetos nuevos (`MENU`, `FIN_DE_NIVEL`, `ENTRADA`) y cambia los dos valores de
  `PANTALLA_COMPLETA`; arregla el comentario que dice "sin tilde" (`copy.ts:147-149`). **No hace
  falta tocar `voz.test.ts`**: `skayboy/copy.ts` ya está en el barrido.
- `experiencia` (`UX-37`): el mando de `§5` ahora nombra lo que hace el toque, y `UX-33 §1.2`
  dice lo contrario (el sello nombra el estado). Ver `§5` para el motivo. También: con la tarjeta
  a la vista hay dos controles que dicen `Seguí` (el botón de la tarjeta y el toque invisible
  sobre el área); decidir si el invisible deja de anunciarse mientras la tarjeta está.
- `producto`: si `BR-27` se construye (`T-302`), el sexto vuelve a `Seguí` (`§3`).
