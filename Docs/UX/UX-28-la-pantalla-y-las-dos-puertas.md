# UX-28 — La pantalla a 812 × 375, y por qué no hay un modo que elegir

> Rol dueño: `experiencia`. Ciclo 15, primera versión 2026-09-16, **enmendada el
> 2026-09-22 en `§2.2` (nueva)**: el hilo principal midió `T-240` en el navegador y las
> piezas dan bien por separado, pero la cuenta de `§2` nunca sumó la cabecera del sitio, y
> contra el peor caso real de alto —354 px CSS útiles, que `§2` ya nombraba pero no
> restaba de nada— **faltan 18 px que ningún margen resuelve**. El traspaso completo está
> en `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`. `§2.2`
> es la salida: no se achica la cabecera ni el mueble —ninguno de los dos tiene margen
> legal para achicarse—, **el fichín cae un escalón entero de escala en el sub-caso donde
> no entra**, que es exactamente el mecanismo que `§4` ya usa en vertical. Lo viejo de `§2`
> no se borra: sigue describiendo el caso donde sí entra.
>
> **Segunda enmienda, el mismo día (`T-261`, ciclo 16).** La sección anterior quedó
> numerada `§2.2` dos veces —cierra `FIND-55` otra vez— y, peor, **su cuenta tenía un
> agujero**: contaba que a ×1 el mueble baja a 180 px CSS, pero no contaba que las columnas
> de mando **no bajan con él** (`--salto-alto`, `--tecla-alto` y `--mando-aire` no escalan
> con `--escala`, y `UX-28 §2.1` las fija así a propósito: son blanco de dedo, no pixel
> art). En la grilla de una sola fila, la fila mide lo que mide **el más alto de sus tres
> ítems**, y con el mando siempre en 324, bajar la escala a ×1 no bajaba nada. Esta segunda
> enmienda: (1) corrige esa cuenta, (2) renumera para que `§2.2` valga una sola vez —queda
> para "el agarre", que es donde apuntan casi todas las citas—, (3) resuelve el reparto
> vertical (las teclas atrás del borde en 375 × 812), (4) fija qué promete la línea de
> `CNT-18` en cada tamaño, y (5) deja una tabla de alturas comparable para que `T-271` la
> mida en el navegador. El detalle vive en `§2.3` a `§2.6` y en `§4`.
>
> **Tercera enmienda, 2026-10-02 (`T-317`, ciclo 17), en `§5`.** El teléfono cerraba y el
> escritorio no: los cortes de alto de ×3 y ×4 (520 y 660) salían del marco del mueble solo y
> no contaban la cabecera, que arriba de 500 de alto se apilaba entera (366 px CSS medidos
> arriba del mueble) y dejaba teclas fuera de la ventana a 1024 × 600 y a 1280 × 800. `D-54`
> tomó una **tercera salida** que el traspaso de `T-271` no listaba —la cabecera se acuesta en
> un renglón y la bajada va al costado del título, sin sacarla— y los cortes pasan a **620 y
> 760**. La cuenta, los tamaños medidos y lo que sigue sin medir están en `§5`; la hoja de la
> pantalla que lo contiene es `UX-35` `§5`. El traspaso
> `HILO-para-experiencia-el-escritorio-tampoco-cuenta-la-cabecera.md` queda cerrado. Nada de
> `§2.3` a `§2.6` (el teléfono) cambia.
>
> **Consume:** `D-40` entero (las dos puertas, y su consecuencia 3, que es literalmente este
> documento), `D-41` (la frontera, el área con borde), `D-42` (el pie de homenaje
> obligatorio, y sus tres precisiones), `D-32` límite 3 (0 ms hasta que la acción principal
> es tocable; una pantalla que hay que esperar es un molinete con forma de animación),
> `D-14` (los molinetes abiertos: nada se le niega a quien llega sin nivel listo tampoco),
> `D-9` criterio 2 (jugable con el pulgar, nada de precisión fina), `D-17` (voseo), `RES-65.1`
> (el FAQ del juego de origen: en móvil se alterna), `RES-65.2` (*Ibb & Obb*: controlar dos
> personajes a la vez para una sola persona es el fracaso conocido), `RES-65.3`/`RES-65.4`
> (el botón de cambio aguanta puzzle y acción), `RES-65.6` (48 × 48 dp es el piso estándar y
> coincide con `--toque-min`), `RES-65.10` (en horizontal el viewport pasa a ~812 × 375 y hay
> precedente de género: cada uno agarra una punta), `UX-10` (el escritorio), `UX-27` §1.1,
> §1.2 y §5.1 (las tres capas del borde, "ningún sello de goma entra" y "adentro del área
> no hay texto"), `ADR-08.2` (el
> rótulo estático: existe, y queda si el `import` falla), `CNT-18` (el texto de las ocho
> cadenas: teclas, línea de vertical, rótulo de carga), `src/layouts/Base.astro` (el `meta
> viewport` real, que no bloquea horizontal), `src/styles/tokens.css` (`--toque-min: 48px`,
> `--espacio-2`, `--espacio-3`), `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`
> (el cuerpo del 2026-09-16 y el addendum del 2026-09-22, cerrados los dos por esta versión).
>
> **Resuelve:** el punto 3 y el punto 11 de "A resolver antes de promoverla" de `IDEA-14`, y
> la consecuencia 3 de `D-40`. Con la segunda enmienda, además: las "dos cosas sueltas" y "la
> pantalla muda" del addendum de `HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`.
> **No** resuelve el piso de niveles ni qué se comparte: eso es de `producto`, y lo nombro en
> `§7`. **No** escribe la línea de vertical ni el rótulo: ese texto es de `contenido`
> (`CNT-18`, `T-270`); acá fijo qué promesa puede ser verdadera, no las palabras.

---

## 1. La condición dura, y cómo se cumple sin trampa

`D-40` consecuencia 3 lo dejó escrito: *"el que llega solo no tiene que elegir un modo antes
de jugar, porque elegir un modo es una pantalla previa y `D-32` límite 3 no la deja."*

La salida no es esconder bien la pregunta. Es que la pregunta no exista.

> **No hay dos modos. Hay una pantalla y dos maneras de agarrarla.**
>
> Cada columna de mando maneja siempre al mismo personaje, y punto. **El personaje que no
> tiene un dedo encima se queda quieto, que es lo que hace cualquier plataformas cuando no
> apretás nada** — y es, palabra por palabra, lo que `D-40` pedía del botón de cambio: *"el
> inactivo queda quieto y a salvo donde lo dejaron"*.
>
> - **Dos personas:** cada una toca su columna, los dos se mueven a la vez. Es el juego.
> - **Una persona:** toca una columna, después la otra. El que dejó atrás se queda parado y
>   a salvo. **Eso es el botón de cambio**, salvo que no es un botón: es tocar del otro
>   lado.

Nadie elige nada, nadie lee un cartel, nadie toca una pantalla previa. El que llega por un
enlace y está solo juega; el que está con alguien juega distinto sin que el sitio se entere.

**Lo que esto le cuesta al diseño de nivel, que ya estaba escrito:** `D-40` consecuencia 1
prohíbe el puzzle que exige simultaneidad sin segunda solución. Con este esquema la
verificación es física y barata: **si una persona sola no puede resolverlo con un dedo por
vez, el nivel está mal.** No hace falta un modo aparte para probarlo.

**Lo que no hace falta construir, y conviene decirlo para que nadie lo agregue:** un botón
de cambio, un rótulo de "modo un jugador", un aviso de "traé un amigo", una preferencia
guardada. Nada de eso existe.

---

## 2. El reparto de la pantalla, con números

Todo en píxeles CSS, **salvo el tile, que se mide en nativos y va dicho cada vez**: el tile
es de 16 nativos, o sea 32 CSS a ×2. El área y su contenido, en `UX-27`.

```
 ← 812 (peor caso útil: 724 con muescas laterales) →

┌──────────┬───┬────────────────────────────────┬───┬──────────┐
│          │ b │                                │ b │          │
│  mando   │ i │        ÁREA DE JUEGO           │ i │  mando   │
│ izquierdo│ s │        480 × 288  (×2)         │ s │ derecho  │
│  112     │ e │   15 × 9 tiles de 16 nativos   │ e │   112    │
│          │ l │                                │ l │          │
│          │   ├────────────────────────────────┤   │          │
│          │   │  chapa 24 — el pie de homenaje │   │          │
└──────────┴───┴────────────────────────────────┴───┴──────────┘
```

| Pieza | Medida | De dónde sale el número |
|---|---|---|
| Columna de mando | **112 × 324**, una de cada lado | Dos teclas de 52 más 8 de separación. 52 está por arriba de `--toque-min` (48) y de los 48 dp de `RES-65.6` |
| Bisel + chapa | 8 a los costados y arriba, 28 abajo | `UX-27 §1.1` |
| Área | **480 × 288** | `UX-27 §2` |
| Ancho total | 112 + 8 + 480 + 8 + 112 = **720** | Entra en 724, que es 812 menos el peor caso de muescas laterales (44 + 44). Sobran 4 px |
| Alto total | 8 + 288 + 28 = **324** | Entra en 354, que es 375 menos la barra de gesto de abajo. Sobran 30 px, que se reparten como aire arriba y abajo |

**El caso apretado es el teléfono con muesca en horizontal, y está contemplado.** En un
teléfono sin muesca sobran unos 90 px de ancho: no los toma el área (`UX-27 §2.1`, el área
no crece), los toman las columnas, que pueden llegar hasta 140 y quedar más cómodas. **La
grilla nunca se deforma para llenar la pantalla.**

### 2.1 Las teclas de cada columna

| Tecla | Tamaño | Dónde |
|---|---|---|
| Izquierda | 52 × 64 | Abajo de todo, al borde exterior |
| Derecha | 52 × 64 | Abajo de todo, pegada a la anterior |
| **Saltar** | **112 × 244** | Todo lo que queda arriba de las dos |

**Por qué saltar es el bloque grande, y es la respuesta al criterio 2 del brief.** El
criterio dice *"nada de precisión fina"*, y `INV-60` lo marcó como el choque frontal del
género: un plataformas es timing. El timing no se arregla achicando el juego, se arregla
**agrandando el blanco de la acción que hay que acertar en el momento justo**. Correr se
sostiene y perdona; saltar hay que acertarlo. Entonces saltar se lleva 244 px de alto y
correr se lleva 64. El dedo no tiene que apuntar: el salto ocupa casi toda la columna.

**Lo que las teclas no hacen:** no se deslizan, no tienen doble toque, no tienen mantener
para cargar, no hay gesto. Tres teclas, tres toques. Cualquier cosa que pida deslizar es
precisión fina con otro nombre.

### 2.2 El agarre, que es de dónde salen las tres teclas y no dos

Dos personas en un teléfono en horizontal no tienen dos pulgares cada una: la persona de la
izquierda sostiene la punta izquierda con **una** mano, y la de la derecha sostiene la
derecha con la suya. Si cada jugador tuviera un solo dedo disponible, **no podría correr y
saltar al mismo tiempo**, y sin eso no hay plataformas.

Lo que resuelve el agarre real es que la otra mano de cada persona **queda libre**: la punta
opuesta la sostiene el otro. Entonces cada jugador tiene dos puntos de contacto:

- **El pulgar de la mano que agarra** cae naturalmente en la esquina de abajo. Ahí van las
  dos teclas de dirección, que son las que se mantienen apretadas.
- **Un dedo de la mano libre** llega cómodo al bloque de arriba. Ahí va saltar, que es lo
  que se toca.

Y en solitario el mismo reparto funciona sin cambiar nada: el teléfono agarrado con las dos
manos, un pulgar por columna, el mismo lugar para las mismas teclas.

### 2.3 La escala baja un escalón cuando el alto no alcanza — y la cabecera cae con ella

> **Enmendado el 2026-09-22, cierra el traspaso
> `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`. Corregido
> el mismo día por `T-261`: la versión de abajo reemplaza una cuenta que `ESTADO.md` daba
> por cerrada y no lo estaba del todo — ver el aviso al final de esta sección.**

**El agujero.** `§2` reparte 375 px CSS de alto entre el mueble (324) y "30 de aire". Ese
aire no existe: la cabecera del sitio —el enlace de volver, `--toque-min` de alto porque
tiene que poder tocarse, más el interruptor de la cinta al lado, en la misma fila— mide
**48 px CSS**, y nadie la había puesto en la cuenta.

```
48  (cabecera: volver + interruptor de la cinta, una sola fila)
+ 324 (el mueble, a ×2: 8 + 288 + 28)
-----
  372
```

Contra los tres altos reales, en orden de aprieto:

| Alto disponible | De dónde sale | 372 entra? |
|---|---|---|
| 375 (el teléfono sin barra de gesto) | el caso ingenuo | Por 3 px, y solo con el aire en cero — un empate técnico, no un reparto |
| **354** | 375 menos la barra de gesto de abajo, que **`§2` ya cita como el caso real** | **No. Faltan 18** |
| 330 | el piso que esta misma hoja usa para activar el modo horizontal (`min-height: 330px` en `skayboy.css`) | No. Faltan 42 |

**Por qué no lo arregla un margen.** El mueble no tiene margen que darle: `324` sale de
sumar el área a ×2 (288, invariante por `UX-27 §2.1`) más la imprenta que la rodea (8 +
28, invariante por `UX-27 §1.1`). La cabecera tampoco: 48 es el piso de `--toque-min`, y
no es negociable. Dos medidas fijas que suman 372 no entran en un hueco de 354 aunque el
margen entre ellas sea cero, porque el margen entre ellas **ya es cero** desde que el
hilo principal lo llevó ahí. **No sobra nada que sacarle a ninguna de las dos partes.**

#### El dato que le faltaba a la cuenta: las teclas no bajan la escalera con el área

`UX-28 §2.1` fija `--salto-alto` (244), `--tecla-alto` (64) y `--mando-aire` (16) como
medidas de blanco de dedo, no de pixel art, y por eso **`skayboy.css` no las escribe en
función de `--escala`**: son constantes. La columna de mando mide siempre
`244 + 16 + 64 = 324`, sea cual sea la escala del área.

`.fichin` es una grilla de **una sola fila** en horizontal (`izquierda mueble derecha`),
y una fila sin alto explícito mide lo que mide **el más alto de los tres ítems que
contiene**. A ×2 el mueble (324) y el mando (324) empatan, así que la fila mide 324 y
nadie lo nota. Pero a ×1 el mueble baja a 180 y **el mando no baja con él** — la fila
sigue midiendo 324, gobernada por el mando, no por el mueble. Bajar la escala, sola, **no
baja un solo píxel del fichín**: sigue pidiendo 372 con la cabecera arriba, igual que a
×2. La versión de esta sección que estuvo escrita hasta hoy decía que a ×1 sobraban 126
px CSS; era la cuenta del mueble solo, sin el mando al lado, y por eso estaba mal.

#### La salida: la cabecera entra en la columna del mueble, no arriba de todo el fichín

La escalera de escala sigue siendo la pieza correcta —`UX-27 §2.1` la deja abierta y
`§4` ya la usa para el ancho angosto—, pero **sola no alcanza**. Lo que sí alcanza es
mirar qué le sobra a la columna del medio cuando el área baja a ×1: el mueble mide 180,
la fila mide 324 porque el mando lo pide, y esos **144 px CSS de diferencia son el único
lugar de la pantalla con margen real** — están ahí, en la propia columna del mueble,
sin usarse.

Ahí es donde entra la cabecera: **a ×1, la cabecera del sitio y el encabezado del juego
—achicados y en un renglón, la misma receta que ya usa el ×2 apretado (ver abajo)— se
apilan arriba del mueble, adentro de su columna, en vez de ocupar una fila propia arriba
de todo el fichín.**

```
Adentro de la columna del mueble, a ×1:
   48   (cabecera: volver + interruptor, achicada, puede partirse en dos líneas)
+  ≤32  (encabezado del juego: marca o rótulo + título, un renglón, sin bajada)
+ 180   (el mueble: 4 chapa + 4 bisel + 144 área + 4 bisel + 24 chapa del pie)
-----
 ≤260, con margen hasta 324 (lo que ya pide el mando al lado)
```

**El ≤32 es el mismo techo que fija `§2.4` para esta misma fila, no un número aparte.**
Hasta esta revisión acá decía `≤48`: dos presupuestos distintos para el mismo elemento
—`marca` a 1rem, `h1` a 1.05rem, `.tenue` oculta, la única regla que existe hoy para este
achicado (`skayboy.css:439` en adelante)— sin nota que explicara la diferencia. No hay
motivo para que el mismo renglón mida distinto según la orientación, así que las dos
secciones usan ahora el mismo techo: `§2.4` lo necesitaba ajustado porque ahí el margen
real es de apenas 67 px CSS en el peor caso (667 de alto); acá, con 144 px CSS de margen
de sobra, `≤48` también habría alcanzado, pero dejarlo en `≤32` es más preciso —está más
cerca de lo que mide en verdad una sola línea a esos tamaños de fuente— y hace que la
tabla de `§2.5` sea comparable entre las dos orientaciones sin ajustar el número según
dónde se lo mire. La cifra exacta, medida en navegador, la confirma `T-271`.

Con 64 px CSS de margen entre 260 y 324 (peor caso: cabecera partida en dos líneas de 48),
la columna del mueble nunca empuja la fila más allá de lo que el mando ya pedía. **El
alto total del fichín, con esto, es 324 — el mismo que a ×2, no menos, no más — pero esos
324 ya incluyen la cabecera.** No hay una fila extra arriba: la cabecera vive adentro.

| Pieza | ¿Dónde vive a ×1? | ¿Suma alto aparte? |
|---|---|---|
| Cabecera (volver + cinta) | Arriba del mueble, en su columna | No — cae dentro del presupuesto de 324 que el mando ya pedía |
| Encabezado del juego (marca/rótulo + título) | Debajo de la cabecera, misma columna | No, mismo motivo |
| Mueble (chapa + bisel + área + chapa del pie) | Debajo del encabezado, misma columna | No, mismo motivo |
| Mando (dos columnas) | A los costados | **Sí — es el que fija los 324** |

**El ancho de esa columna no está clavado en 256.** `UX-27 §2` ya declaró que las
columnas de mando crecen con `minmax` cuando sobra ancho; acá corre la misma lógica para
la columna del medio: si "← Volver al arcade" más el interruptor de la cinta no entran en
una línea a 256 px, la columna crece lo que haga falta (el área sigue fija en 240
nativos, centrada adentro) antes que forzar un tercer renglón. Es el mismo principio que
ya rige el resto de la hoja: **la medida de marca no se toca; lo que cede es el aire.**

#### El piso de ancho también baja, y por qué

`§2` fijó 720 como piso de ancho para el fichín horizontal, y ese número es correcto
**para ×2**: `112 + 8 + 480 + 8 + 112 = 720`, con el área a su ancho de ×2 (480). Pero a
×1 el área mide la mitad (240), así que el piso real es otro:

```
112 (columna mínima) + 256 (mueble a ×1: 240 + 2×bisel + 2×chapa) + 112 (columna mínima) = 480
```

Un teléfono angosto en horizontal —**667 × 375, el chico de la tabla de `§2.5`**— tiene
667 px CSS de ancho: no llega a 720, así que hoy cae al reparto apilado de `§2.4` (el de
vertical), que pide 600 px CSS de alto y no entra en 375. Con el piso bajado a 480, **667
entra al horizontal ×1 sin problema** (sobran 187, incluso con las columnas en su ancho
cómodo de 140 en vez del mínimo de 112) y el alto que pide es 324, no 600. Es la misma
franja que resuelve el caso grande (812 × 375): **el piso de ancho depende de qué escala
se está pidiendo, no es un solo número para todos los casos.**

#### El umbral de alto, con número

×2 pide 372 (48 + 324, cabecera arriba de todo). Se le da margen porque el alto que mide
una media query no siempre coincide con el alto útil real —la barra de gesto no siempre
se descuenta igual— así que el corte no va pegado a 372: va en **400**.

> - **Alto disponible < 330:** no aplica esta sección — es el ancho angosto de `§2.4`
>   (vertical), que ya usa ×1 por su cuenta.
> - **330 ≤ alto disponible ≤ 400, ancho ≥ 480:** ×1, con la cabecera y el encabezado
>   apilados adentro de la columna del mueble (arriba). El fichín entero mide 324.
> - **Alto disponible > 400, ancho ≥ 720:** ×2, cabecera arriba de todo el fichín (48),
>   con los ajustes que ya existían (aire cero, bajada fuera de pantalla).
> - **Ancho entre 480 y 720, cualquier alto en la franja de arriba:** ×1 igual — es
>   exactamente el caso del teléfono chico en horizontal (`§2.5`).

**Por qué no se eligió ninguna de las otras dos salidas del traspaso original.** El
traspaso de 2026-09-16 ofrecía tres: la cabecera al aire lateral, la cabecera atornillada
al mueble (solapada, sin fila propia), o `§2` reescrito con el mueble más bajo.

- **Al aire lateral, descartada:** el aire lateral que sobra (92 px a 812, 46 por lado)
  **no existe siempre** — en el peor caso de ancho (el teléfono con muesca, 724 px
  útiles) sobran 4, y una cabecera de 48 no entra parada de costado en 4 px.
- **Atornillada al bisel o la chapa del mueble (solapada), descartada:** esos renglones
  miden 4 u 8 px y ninguno tiene 48 px para darle sin invadir el área de juego —
  exactamente lo que `UX-27 §1.2` punto 3 prohíbe ("ningún sello de goma entra" al área).
  **Esto es distinto de lo que sí se adopta acá**: la cabecera no se solapa con nada del
  mueble, se apila **arriba** de él, en el espacio propio que la columna tiene de sobra
  cuando el área es más chica que el mando. No comparte renglón con el bisel ni con la
  chapa: tiene el suyo.
- **`§2` reescrito con el mueble más bajo, descartada:** bajar el mueble por debajo de
  324 a ×2 significa bajar el área por debajo de 288, y eso es achicar el área fuera de
  sus escalones enteros — lo que `UX-27 §2.1` prohíbe en su primera línea.

#### Lo que esto no toca

El caso de ancho de `§2` a ×2 (720 contra 724 útiles) sigue igual. La franja de escala ×2
con sus remiendos sigue igual, solo que ahora acotada a `min-height: 401px`. `UX-27` y
`tokens.css` no se tocan: esta enmienda mueve umbrales de media query y reordena dónde
vive la cabecera, no una medida de marca ni un color.

#### Qué tiene que cambiar en el código

Todo en `src/styles/skayboy.css`, sin un hex nuevo — solo `var(--...)` y el `--escala`
que la hoja ya declara:

1. **Bajar el piso de la regla que hoy fuerza `--escala: 2`** y bajarle también el piso de
   ancho a la mitad para la franja de ×1: la horizontal deja de ser un solo bloque con un
   único `min-width`. Quedan dos:
   - `@media (min-width: 480px) and (min-height: 330px) and (max-height: 400px)`: fija
     `--escala: 1`, arma la grilla de tres columnas (`izquierda mueble derecha`), y
     **además** apila cabecera + encabezado del juego adentro de la columna del mueble
     (punto 2).
   - `@media (min-width: 720px) and (min-height: 401px)`: fija `--escala: 2`, arma la
     misma grilla de tres columnas, cabecera arriba de todo el fichín (el reparto que ya
     existía).
2. **La cabecera y el encabezado del juego se mueven adentro de `.gabinete`, solo en la
   franja de ×1.** Hoy son hermanos de `.fichin` en `#portada`; en esta franja pasan a ser
   los dos primeros hijos de `.gabinete`, arriba de `.recorte`, con la misma reducción de
   fuente y el mismo ocultamiento de `.tenue` que ya usa la franja apretada de ×2 (marca
   1rem, `h1` 1.05rem, `.tenue` con `display: none`, el rótulo de carga reemplazando a la
   marca). Es tocar el maquetado, no solo la hoja de estilos — queda para `T-271`.
3. **Acotar la franja de ×2 apretado al alto alto.** El bloque
   `@media (min-width: 720px) and (max-height: 500px)` pasa a
   `@media (min-width: 720px) and (min-height: 401px) and (max-height: 500px)`. El
   contenido no cambia, solo el rango que lo activa.
4. **Nada en `UX-27` ni en `tokens.css` se toca.**

**Cómo se verifica**, comando ya existente más las medidas nuevas:

```
node --test src/lib/estilos.test.ts    # --toque-min en las seis teclas y en la cabecera, en todas las franjas
```

Y a ojo, con el inspector puesto en las cinco medidas de `§2.5` (incluida 812 × 354, que
no es preset de ningún navegador): que el mueble entre completo, que la cabecera se lea
—arriba de todo o adentro de la columna del mueble, según la franja— y que ninguna tecla
quede recortada por el borde de la pantalla.

### 2.4 El reparto vertical: la misma receta, para que las teclas no queden atrás del borde

> **Nueva el 2026-09-22 (`T-261`).** Cierra "lo que quedó suelto" de
> `HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`: en 375 × 812 se ven los
> dos bloques de saltar y hay que scrollear para llegar a las teclas de dirección.

**Por qué acá no sirve el truco de `§2.3`.** En vertical el mueble no comparte fila con
el mando: `§4` ya fija que ahí la grilla es apilada (`mueble mueble` arriba, `izquierda
derecha` abajo), porque a 375 px de ancho no entran las tres columnas lado a lado ni
siquiera a ×1 (`112 + 256 + 112 = 480` no entra en 375). Sin fila compartida no hay
sobrante que aprovechar: el mueble (180) y el mando (324) se **suman**, no se empatan.

```
180  (el mueble a ×1)
+ 16  (el aire entre el mueble y el mando, --espacio-2)
+ 324  (el mando, debajo)
-----
 520
```

A eso hay que sumarle la cabecera y el encabezado del juego, que en vertical tampoco
pueden fusionarse en un solo renglón de 48 —a 375 px de ancho "← Volver al arcade" más el
interruptor no entran al lado del título, es el mismo cálculo que ya midió `sitio.css`
para un caso parecido (369 contra 343 disponibles)—, así que quedan en dos renglones
propios:

```
48  (cabecera: volver + interruptor, su propia fila)
+ ≤32  (encabezado del juego achicado: marca o rótulo + título, un renglón, sin bajada)
+ 520  (el fichín de arriba)
-----
 ≤600
```

**Contra los dos altos que pide `§2.5` para vertical:**

| Alto disponible | 600 entra? |
|---|---|
| 812 (el teléfono grande) | Sí, sobran 212 |
| 667 (el chico) | Sí, sobran 67 — ajustado, pero sin negativo |

Los 67 px de sobra en el peor caso **solo alcanzan si los márgenes de alrededor se llevan
a cero**, la misma receta que ya usa la franja apretada de `§2.3`: `padding-block: 0` en
`main` y `margin-block: 0` en `.fichin`. Sin esa poda, `main` (`--espacio-2` × 2 = 32) más
el margen del fichín (`--espacio-3` × 2 = 48) agregan 80 px, y 667 − 680 da negativo —
que es, medido, el defecto que reportó el traspaso.

**La regla que queda, entonces, es una sola y vale para toda la franja angosta (ancho <
480, cualquier alto):** el encabezado va siempre achicado —sin bajada, marca e `h1` más
chicos, un renglón, el rótulo de carga reemplazando a la marca cuando corresponde— y los
márgenes de `main` y de `.fichin` van a cero. No es condicional a la altura porque no
cuesta nada aplicarlo siempre: la bajada ya hizo su trabajo en el casete del portal
(`voz-ricotera.md` §5), y con 812 px de alto la poda de márgenes no se nota; con 667 es
lo que hace que las teclas entren.

**Lo que esto no cambia:** el mueble sigue a ×1, la grilla apilada sigue siendo
`mueble mueble` / `izquierda derecha`, y las medidas de las seis teclas (`§2.1`) no se
tocan — nada de esto le pide precisión fina a nadie, solo le saca aire a lo que ya sobraba.

#### Qué tiene que cambiar en el código

En `src/styles/skayboy.css`, para el caso base (sin media query de ancho, que es donde
vive hoy el reparto apilado) y no solo para la franja `max-height: 500px` que hoy limita
el achique a horizontal:

1. El achicado de `.encabezado-juego` (marca 1rem, `h1` 1.05rem, `.tenue` oculta, el
   rótulo reemplazando a la marca) deja de estar condicionado a `min-width: 720px`. Pasa a
   aplicarse siempre que `--escala` sea 1 — angosto o apretado, da lo mismo el motivo.
2. `padding-block: 0` en `main` y `margin-block: 0` en `.fichin` se extienden con el mismo
   criterio: siempre que `--escala` sea 1.
3. Nada de esto toca `grid-template-areas` del caso apilado: sigue siendo `mueble mueble`
   / `izquierda derecha`, sin fusionar cabecera y encabezado en un renglón porque a este
   ancho no entran juntos.

**Cómo se verifica:**

```
node --test src/lib/estilos.test.ts
```

Y a ojo, en 375 × 812 y en 375 × 667 (`§2.5`): que las seis teclas —las cuatro de
dirección incluidas— estén visibles sin scrollear.

### 2.5 La tabla de alturas, comparable para quien la mida en el navegador

Los cinco tamaños que pide `T-271`. **Cabecera**, acá, es todo lo que va arriba del
mueble —la fila de volver + cinta y el encabezado del juego juntos—, porque en la franja
de ×1 viajan pegados y separarlos en dos filas de la tabla escondería justo el ahorro que
`§2.3` describe. **Chapa** y **pie** son piezas de `UX-27 §1.1` (chapa de arriba/costados,
chapa del pie); **mueble** es el tubo con su bisel (`UX-27` capas 2 y 3); **teclas** es la
columna de mando entera (`§2.1`), fija en 324 sin importar la escala.

| | 812 × 375 | 812 × 354 | 375 × 812 | 667 × 375 | 375 × 667 (chico) |
|---|---|---|---|---|---|
| Reparto | horizontal ×1, cabecera adentro (`§2.3`) | igual | apilado (`§2.4`) | horizontal ×1, cabecera adentro (`§2.3`) | apilado (`§2.4`) |
| Cabecera (volver+cinta+encabezado) | ≤ 80, adentro de la columna del mueble | igual | 48 + ≤32 = ≤80, filas propias | ≤ 80, adentro de la columna del mueble | 48 + ≤32 = ≤80, filas propias |
| Chapa (arriba) | 4 | 4 | 4 | 4 | 4 |
| Mueble (bisel + área a ×1) | 152 | 152 | 152 | 152 | 152 |
| Pie (chapa del pie) | ≥ 24 | ≥ 24 | ≥ 24 | ≥ 24 | ≥ 24 |
| Teclas (mando) | 324 — gobierna la fila | 324 | 324 — fila propia, debajo | 324 — gobierna la fila | 324 — fila propia, debajo |
| **Suma del fichín** (cabecera + chapa + mueble + pie, dentro del presupuesto de 324) | **324** | **324** | 180 (chapa+mueble+pie) + 16 (aire) + 324 (teclas) = **520** | **324** | **520** |
| **Suma total** (fichín + cabecera si no viajó adentro) | 324 | 324 | 80 + 520 = **600** | 324 | 80 + 520 = **600** |
| **Alto útil** | 375 | 354 | 812 | 375 | 667 |
| **Sobra** | 51 | 30 | 212 | 51 | 67 |

**Lo que esta tabla no mide:** el ancho de la columna del mueble cuando la cabecera no
entra en 256 px de una línea (`§2.3`, "el ancho de esa columna no está clavado"). Eso es
horizontal, no altura, y no cambia ninguna fila de esta tabla — solo el ancho del fichín,
que a ×1 ya tiene margen de sobra: 812 − 480 = 332 px CSS en la columna de 812, 667 − 480
= 187 en la de 667.

### 2.6 La pantalla sin nivel listo: qué ve el que entra, y por qué no hace falta tocar `UX-27 §5.1`

> **Nueva el 2026-09-22 (`T-261`).** Cierra "el rótulo de carga tampoco entra, y ahora la
> pantalla publicada está muda" del addendum de
> `HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`.

**Por qué esto no es un caso de borde.** `nivelesListos()` filtra a `listo` en producción
(`copy.ts`, `T-239`), y hoy `skayboy.json` tiene un solo nivel y está en `borrador`. Hasta
que alguien lo juegue en un teléfono (`§4` punto 3, `T-249`) el banco publicado sale
`"niveles":[]`, el `import()` del motor nunca se dispara (`ADR-08.2`) y **lo único que la
pantalla puede decir es el rótulo estático**. No es un cartel de 114 ms — es el estado
real que ve cualquiera que entre hoy, y va a seguir siéndolo varios ciclos. Diseñar esta
pantalla como si el rótulo fuera transitorio fue el error original.

**Las cuatro salidas del addendum, pesadas:**

1. *"El mueble apagado no es el área."* Distinguir un canvas *dibujando* de uno *apagado*
   para poder pintar texto encima mientras no dibuja. **Descartada.** No hace falta:
   ninguna de las otras tres opciones pone texto adentro de `.recorte`, así que esta
   salida resuelve un problema que las otras tres no tienen. Y tiene un costo que las
   otras no tienen — debilitaría la única regla absoluta de `UX-27 §5.1` ("adentro del
   área no hay texto. Ninguno") para un caso que se resuelve sin tocarla, y abre la puerta
   a que la próxima vez alguien pida la misma excepción para algo que sí importa. **No se
   escribe ninguna excepción en `UX-27 §5.1`**: sigue absoluta.
2. *"El rótulo toma la chapa y el pie de homenaje se va a otro lado."* **Descartada.**
   Mueve un rótulo obligatorio (`D-42` precisión 1: *"el pie en registro 3 pasa de
   conveniente a obligatorio"*) sin necesidad — `§2.3` ya le hace lugar al rótulo en el
   encabezado, así que tocar `D-42` sería pagar un costo por nada.
3. *"El reparto baja a ×1 en horizontal apretado."* Es la dirección correcta, pero **tal
   como estaba escrita no alcanzaba** — es exactamente el agujero que corrige `§2.3`: bajar
   la escala sola no bajaba el alto del fichín, así que tampoco le hacía lugar al rótulo.
4. *"El rótulo va afuera del mueble."* **Elegida — y es la misma idea que la 3, completa.**
   El rótulo ya vive en `.encabezado-juego` (`T-247`, interino) y no en `.recorte`: eso
   nunca fue el problema. El problema era que el encabezado no tenía dónde estar sin
   empujar las teclas fuera de la pantalla, y **`§2.3` y `§2.4` le hacen ese lugar en
   todos los tamaños** — arriba de todo cuando sobra alto, adentro de la columna del
   mueble cuando no. Con eso, el rótulo deja de ser un remiendo interino y pasa a ser la
   solución de fondo: siempre hay un renglón de encabezado, y el rótulo vive ahí.

**Contra `D-14`.** Una pantalla que dice la verdad sobre su estado no es un molinete —lo
sería si pidiera algo para entrar (cuenta, login, saber jugar) o si mintiera sobre lo que
hay. "Acá va el juego." (`CNT-18`) no pide nada y no miente: hoy no hay nivel, y el rótulo
no promete que lo haya. El molinete real era el rectángulo negro y mudo, no el rótulo —
y ese defecto lo cierra `§2.3`/`§2.4` haciéndole lugar, no escondiéndolo mejor.

**Contra `D-42`.** El pie de homenaje sigue exactamente donde estaba (`chapa-pie`, 24 px,
atornillado al mueble) y sigue siendo la única placa obligatoria del fichín. Nada de esta
sección lo mueve ni lo comparte con otro texto.

**Contra `UX-27 §5.1`.** Sigue absoluta, sin excepción. El rótulo nunca estuvo, no está y
no va a estar adentro de `.recorte`.

---

## 3. Lo que se ve cuando un personaje está quieto

La hoja de sprites no trae una pose de espera, y hace falta una: `§1` apoya todo el modo de
uno solo en que se vea cuál de los dos está bajo el dedo. **No hace falta dibujar nada
nuevo** — la hoja ya trae las dos poses que hacen la diferencia.

> **De frente = esperando. De perfil = en juego.**

| Estado | Adentro del área (`UX-27`) | Afuera, en su columna (`UX-22`) |
|---|---|---|
| **Con dedo encima** | Pose de perfil, mirando hacia donde va | El sello de la columna, **entintado lleno** |
| **Sin dedo encima** | Pose de frente 3/4, mirando a cámara | El sello de la columna, **solo contorno** |

Son dos señales y ninguna es color: adentro cambia la **forma** (de perfil a de frente),
afuera cambia el **relleno** (lleno o hueco). Es la misma doctrina que `estilos.test.ts` ya
hace cumplir para acierto y error, aplicada a esto.

**Tres cosas que el estado de espera no hace, y las tres importan:**

1. **No se duerme, no se sienta, no se apaga, no se pone en gris.** Cualquiera de esas
   cuatro dice que el personaje está de más, y `D-38` no permite que uno valga menos que el
   otro ni por un segundo.
2. **No tiene reloj ni cuenta atrás.** Esperar no cuesta nada. Si esperar costara, el que
   juega solo estaría pagando por estar solo, que es el molinete que `D-40` vino a abrir.
3. **No se mueve para pedir atención.** Ni saludo, ni golpecito de pie, ni parpadeo. `D-32`
   no tiene excepción acá: quieto es quieto.

**Y la promesa que el nivel tiene que sostener:** el que está esperando está a salvo. Nada
lo alcanza mientras nadie lo toca. Es de `D-40` y acá se hace visible — si un personaje
quieto puede ser alcanzado, el nivel está mal diseñado, no el estado.

---

## 4. La orientación: no se fija, y el vertical no es un cartel

Hoy el sitio no fija orientación: el `meta viewport` de `Base.astro` es
`width=device-width, initial-scale=1` y no bloquea nada. **Eso no cambia.**

**No se bloquea la orientación aunque el navegador deje.** Bloquearla es decirle a alguien
cómo tiene que agarrar el teléfono antes de dejarlo jugar, y eso tiene la forma exacta de un
molinete. Es además la misma familia de decisión que `UX-03` ya tomó con el audio: el que
llega sin auriculares no queda afuera, el juego se degrada con dignidad.

**Lo que ve el que entra en vertical (375 × 812):**

- El juego, entero y jugable, **a escala ×1**: área de 240 × 144 px CSS, con la misma grilla
  de 15 × 9 tiles. No se recorta el nivel ni se cambia la grilla: se ve más chico.
- Las dos columnas de mando **abajo, una al lado de la otra** (112 + 8 + 112 = 232, entra
  holgado en 375), con las mismas tres teclas cada una y el mismo tamaño de tecla. En
  vertical las teclas no se achican: se achica el área. **Que las cuatro teclas de
  dirección entren sin scrollear es reparto, no orientación, y se resuelve en `§2.4`.**
- **Una línea en la chapa, en registro 3**, que dice qué se gana girando el teléfono —
  cuándo, exactamente, es lo que fija `§4.1`, más abajo. Una línea, seca, en la placa del
  mueble. **No es una pantalla, no tapa nada, no hay que tocarla para seguir.**

**Por qué así y no con un aviso a pantalla completa.** Un cartel de "girá el teléfono" es
una pantalla previa, la prohíbe `D-32` límite 3, y encima llega justo en el peor momento: el
primer segundo del que vino por un enlace de Twitter. Con esta salida, la persona toca,
el personaje se mueve, y gira el teléfono porque el juego mejora — no porque un cartel la
mandó.

### 4.1 Qué promete la línea, en cada tamaño

> **Enmendado el 2026-09-22 (`T-261`).** Hasta acá esta sección decía, sin condición,
> *"lo que se gana al girar es medible y es lo único que la línea promete: el doble de
> tamaño, ×1 a ×2"*. Con `§2.3` eso dejó de ser siempre cierto: **hay una franja de alto
> horizontal —330 a 400 px CSS útiles— donde girar el teléfono no cambia la escala.** El
> área sigue a ×1 de los dos lados. Prometer "el doble" ahí es prometer algo falso, y el
> mismo registro 3 que existe para no mentir en un rótulo (`voz-ricotera.md` §5) no puede
> mentir en esta línea tampoco.

**El dato que hace falta para saber si la promesa se cumple, y dónde se puede leer
antes de girar.** Girar un teléfono intercambia ancho y alto: **el ancho que tiene la
pantalla en vertical es, aproximadamente, el alto que va a tener en horizontal** (es el
mismo lado corto del aparato, medido por el navegador en las dos orientaciones). Por
`§2.3`, ese alto solo entra a ×2 si supera 400 px CSS. Entonces, mientras el teléfono
todavía está parado, **su propio ancho ya dice si girarlo va a doblar el juego**:

| Ancho actual (vertical) | Alto que va a tener al girar | ¿Girar dobla el tamaño? |
|---|---|---|
| ≤ 400 px CSS — la mayoría de los teléfonos (375, 390, 393 son los anchos más comunes) | 330–400, la franja de `§2.3` | **No.** Sigue en ×1 de los dos lados |
| > 400 px CSS — los teléfonos grandes (412 a 430 y pico) | > 400 | **Sí.** Pasa a ×2 |

**Esto no es un caso raro: es la mayoría.** De los anchos de teléfono más comunes, casi
todos caen en la fila de arriba. No es un umbral que convenga mover: 400 sale de sumar la
cabecera (48, `--toque-min`, no negociable) más el mando (324, blanco de dedo, no
negociable) más el margen de medición (`§2.3`) — es un piso físico, no una elección de
diseño que se pueda correr para que "más gente gane".

**La tabla de arriba mira un solo lado del teléfono y alcanza para los cinco tamaños de
`§2.5`, pero no es la cuenta completa.** El alto que tiene hoy, en vertical, es el ancho
que va a tener al girar — y `§2.3` también exige **ancho ≥ 720** para llegar a ×2 (a
menos, el fichín se queda en ×1 aunque el alto sobre). Un teléfono angosto y muy alto
(ancho vertical > 400 pero alto vertical < 720) prometería el doble por la fila de arriba
y no lo daría por esta segunda cuenta. Los dos teléfonos de `§2.5` (375 × 812 y 375 × 667) tienen los dos un ancho vertical de
375 —por debajo de 400— así que ninguno prueba el cruce; hace falta un tercer dato, con
más de 400 de ancho, para confirmar que en los teléfonos reales las dos condiciones
viajan siempre juntas. Mientras tanto, la condición completa para mostrar la línea es
**las dos a la vez** —ancho vertical > 400 y alto vertical ≥ 720—, no una sola.

**Lo que esto le deja a `contenido` (`T-270`), sin escribir la línea:**

- **La promesa "doblás girando" solo puede aparecer cuando es cierta**: con el ancho
  vertical actual por encima de 400 px CSS. Eso es una condición para *mostrar* la línea
  (o para elegir cuál de dos líneas mostrar), no una palabra distinta — sigue siendo
  responsabilidad de `contenido` decidir si hace falta una segunda línea para el caso "no
  vas a ganar nada" o si ahí el silencio es la respuesta correcta (la placa ya no promete
  nada, y no prometer nada no es mentir).
- **La condición se puede escribir en CSS sin adivinar nada**, porque el ancho y el alto
  actuales ya están disponibles sin esperar a que la persona gire: `.chapa-linea` se
  esconde salvo que se cumplan las dos a la vez, `min-width: 401px` y `min-height: 720px`,
  en el reparto apilado de `§2.4`.
- **Lo que la línea nunca puede volver a decir sin condición** es "el doble", salvo que
  sea la única versión que se muestre (condicionada al ancho). Un texto fijo que se
  cumple para una minoría de teléfonos y no para la mayoría es el mismo defecto que
  `D-14` nombra para un dato mal rotulado: le falla justo a quien más necesitaba que le
  dijeran la verdad.

---

## 5. El escritorio

> **Enmendado el 2026-10-02 (`T-317`, ciclo 17, `D-54`, `UX-35` `§5`). Cierra
> `HILO-para-experiencia-el-escritorio-tampoco-cuenta-la-cabecera.md` (`T-271`).** Los tres
> puntos de abajo se conservan; esta enmienda dice qué quiere decir "mientras entre" y cambia
> los cortes de alto.
>
> **El agujero.** La escala de abajo se cortaba en `min-height` 520 (×3) y 660 (×4), que salen
> del marco del mueble solo: 468 para ×3 (432 de área más 8 de bisel y 28 de chapa del pie) y
> 612 para ×4 (576 más 36). Ninguno contaba lo que va arriba del mueble, que medido sumaba:
>
> ```
> 16 (relleno de main) + 48 (cabecera) + 24 (su margen) + 254 (marca + h1 + bajada + rótulo)
> + 24 (margen del fichín) = 366
> ```
>
> 366 + 468 = 834 contra un corte de 520; 366 + 612 = 978 contra uno de 660. Medido el
> 2026-09-23: 1024 × 600 (×3) dejaba **6 teclas fuera** y 1280 × 800 (×4), **4**. Es el mismo
> agujero que `§2.3` cerró para el teléfono, del otro lado de la escalera.
>
> **La salida: la tercera.** El traspaso proponía subir los cortes a ≈ 850 y ≈ 990 (deja a
> casi todos los portátiles en ×2) o achicar el encabezado también en el escritorio (saca la
> bajada justo donde más lugar hay, y `§2.3` quiere que arriba de 500 de alto se quede). Se
> tomó otra: **la cabecera se acuesta en un renglón** —volver, marca, título y la bajada al
> costado del título en vez de abajo—, con la misma forma del ×2 apretado pero con aire. No se
> saca nada. La cabecera pasa de 326 (48 + 24 + 254, cuenta) a **~68 a 980 de ancho y ~48 a
> 1220** (cuenta, sobre lo medido por el hilo principal el 2026-10-02: el mueble termina en 576
> a 980 × 620 y en 700 a 1220 × 760, con 16 de sangría, 24 de aire y 468 o 612 de mueble). Y lo
> que hay arriba del mueble, contando la sangría y el aire, de 366 a ~108 a 980 y ~88 a 1220.
> (La primera versión de esta enmienda daba ~90 de cabecera, una cota alta tomada de un
> comentario de `skayboy.css`; está corregida.)
>
> **Cuándo se acuesta** (`skayboy.css`): con 980 px de ancho o más y más de 500 de alto, o con
> 720 px de ancho o más y entre 500 y 800 de alto. **No** de 720 a 979 de ancho con 800 de alto
> o más (una tableta parada, 768 × 1024): ahí la escala no pasa de ×2, el alto sobra, y
> acostada dejaba media pantalla de negro bajo el mueble. Las franjas de 500 de alto o menos
> son las de `§2.3` y `§2.4`, sin cambios.
>
> **Los cortes nuevos.** La cuenta ahora incluye la cabecera y el aire, y el aire entre la
> cabecera acostada y el mueble es de 24 px (era 16; subió por `REV-18` `FIND-99`, porque el
> sello de pantalla completa asoma 22 px y tapaba la última palabra de la bajada a 1024 × 640 y
> 720 × 600):
>
> | Escala | El marco pide | Dónde termina el mueble (medido, en el piso) | Corte viejo | **Corte nuevo** | Sobra bajo el mueble |
> |---|---|---|---|---|---|
> | ×3 | 960 × 468 | 576, a 980 × 620 | 520 de alto | **980 de ancho, 620 de alto** | 44 px |
> | ×4 | 1200 × 612 | 700, a 1220 × 760 | 660 de alto | **1220 de ancho, 760 de alto** | 60 px |
>
> Contando los 16 px de sangría de abajo sobran 28 y 44. La versión anterior de esta tabla
> daba 14 y 10 px de margen: salían de la cota alta de ~90 para la cabecera, y la medida real
> es más holgada.
>
> **Lo medido** el 2026-10-02 con `teclasFuera` (el fragmento de medición de `T-271`), todas
> en cero:
>
> | Ventana | Escala | Cabecera |
> |---|---|---|
> | 1024 × 640 | ×3 | acostada |
> | 1280 × 720 | ×3 | acostada |
> | 1366 × 768 | ×4 | acostada |
> | 1440 × 900 | ×4 | acostada |
> | 1920 × 1080 | ×4 | acostada |
> | 812 × 600 | ×2 (antes dejaba las teclas fuera) | acostada |
> | 768 × 1024 | ×2 | apilada de siempre |
>
> **Y una segunda pasada, también del 2026-10-02**, que cierra lo que la primera dejó sin
> medir, todas con 0 teclas afuera:
>
> | Ventana | Escala | Lo medido |
> |---|---|---|
> | 980 × 620 (piso de ×3) | ×3 | el mueble termina en 576 |
> | 1220 × 760 (piso de ×4) | ×4 | el mueble termina en 700 |
> | 979 × 620 | ×2 | termina en 434 |
> | 1219 × 760 | ×3 | termina en 576 |
> | 1024 × 600 (fallaba: 6 teclas fuera) | ×2 | cae a ×2 por el corte |
> | 1280 × 800 (fallaba: 4 teclas fuera) | ×4 | — |
> | 1366 × 657 (un alto de ventana de portátil) | ×3 | — |
>
> **Lo que sigue sin medir** (`UX-35` `§7.7`): una ventana de portátil real, con sus propias
> barras. Si en algún tamaño las teclas quedan fuera, el corte sube lo que falte.

`UX-10` ya trata el escritorio como caso derivado y el usuario dejó el teclado explícitamente
afuera del ciclo 9. Lo que fijo acá, corto, porque el traspaso lo marcó como "va a aparecer
igual":

- **La escala sube por enteros mientras entre**: ×3 (720 × 432) y ×4 (960 × 576). Nunca una
  fracción.
- **Las columnas de mando siguen en pantalla y siguen siendo tocables.** No desaparecen
  porque hay un teclado: una pantalla táctil grande existe.
- **El teclado, si se agrega, no reemplaza a las teclas en pantalla: las espeja.** Y si se
  agrega, el reparto es el del género —un grupo de teclas por personaje— y lo fija quien lo
  construya, no este documento.

---

## 6. Cuánto tiene que durar esto

El sitio promete sesiones de dos o tres minutos, y un plataformas puede comerse una tarde.
Lo que fijo, que es de pantalla y no de contenido:

> **El corte de sesión es el nivel, no la tanda.** Un nivel es una partida completa: se
> entra, se pasa (o no), y se sale a la tarjeta. Nadie tiene que pasar seis niveles seguidos
> para llegar a algo que se comparte.

El presupuesto que uso para diseñar: **un nivel se pasa en menos de un minuto la primera vez
que sale bien**, contando los reintentos. Si un nivel necesita más, está mal cortado y lo
marco como tal, que es lo que este rol hace.

**Ese número se mide, no se cita** (lo pide `IDEA-14` punto 9 y tiene razón): se mide con
cronómetro, con alguien que no juega plataformas, y el resultado manda sobre esta línea.

---

## 7. Lo que este documento no fija

- **Qué se comparte al terminar** (`IDEA-14` punto 8). Es mío con `producto` y no entra a
  este ciclo. Lo único que dejo dicho, porque afecta a la pantalla: la tarjeta sale al
  terminar un nivel, no una tanda, y **el candidato natural de qué mostrar es el reloj** —
  es lo que el fracaso gasta (`UX-29 §4`), es lo que no necesita una muerte para contarse, y
  ya hay precedente en el sitio de que el número grande sea el tiempo (`UX-22 §10`).
- **El piso de niveles y el criterio Given/When/Then.** De `producto` al promover (`BR-16`).
- **Los efectos de sonido y el motor.** De `arquitectura`. Lo que necesito de ellos está en
  `Docs/SUGERENCIAS/UX-para-arquitectura-el-area-de-juego.md`.
- **El texto de la línea de vertical y el del pie de homenaje.** De `contenido`, en registro
  3. Está pedido en `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md`.

---

## 8. Cómo se verifica

Comandos que dejo escritos y corre otro (`D-12`):

```
node --test src/lib/estilos.test.ts     # --toque-min en las seis teclas
node --test src/lib/voz.test.ts         # los rótulos nuevos, si contenido ya los escribió
npm test
```

Lo que se verifica a ojo y con un teléfono en la mano, en este orden:

1. **Con una persona sola:** se toca una columna, se juega; se toca la otra, se juega el
   otro. En ningún momento apareció una pregunta.
2. **Con dos personas:** los dos se mueven a la vez, y ninguno tapa la pantalla del otro con
   la mano.
3. **En un teléfono con muesca, en horizontal:** nada queda debajo de la muesca ni de la
   barra de gesto.
4. **Entrando en vertical:** el dedo mueve un personaje sin haber tocado nada antes, y las
   seis teclas —las cuatro de dirección incluidas— están a la vista sin scrollear (`§2.4`).
5. **En las cinco medidas de `§2.5`** (812 × 375, 812 × 354, 375 × 812, 667 × 375, 375 × 667):
   ninguna tecla queda fuera de pantalla, y la cabecera se lee completa — arriba de todo o
   adentro de la columna del mueble, según la franja (`§2.3`).
6. **Con `skayboy.json` sin ningún nivel en `listo`** (el caso real de hoy): el rótulo de
   carga se lee en las cinco medidas de arriba, nunca superpuesto al área de juego ni
   recortado por el borde (`§2.6`).
7. **En vertical, cruzando los dos umbrales de `§4.1` por separado** (ancho 400 y 401 px
   CSS con alto 812 fijo; alto 719 y 720 px CSS con ancho 420 fijo): la línea de `CNT-18`
   se esconde apenas cruza cualquiera de los dos hacia abajo, y solo se ve cuando los dos
   están por encima a la vez.

---

> **Enmendado el 2026-10-04 por `UX-37` (`D-61`).** Tocan este documento tres cosas, y el texto
> viejo y el nuevo de cada una están en `UX-37` `§8.2` y `§8.3`: **`§1`**, *"nadie toca una pantalla
> previa"*, deja de ser literal (hay un menú de entrada con un botón grande; lo que sigue sin
> existir es elegir un modo); **`§2.2`**, *"en solitario … un pulgar por columna"*, era falso para
> correr saltando y ahora se cumple porque la dirección viaja con el pulgar (`UX-37` `§6`); y
> **`§2.1`**, *"no hay gesto"*, admite uno, opcional: subir de la flecha al bloque de saltar.
