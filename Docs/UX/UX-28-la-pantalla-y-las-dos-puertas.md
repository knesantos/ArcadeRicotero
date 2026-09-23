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
> **Consume:** `D-40` entero (las dos puertas, y su consecuencia 3, que es literalmente este
> documento), `D-41` (la frontera, el área con borde), `D-42` (el pie de homenaje
> obligatorio), `D-32` límite 3 (0 ms hasta que la acción principal es tocable; una pantalla
> que hay que esperar es un molinete con forma de animación), `D-14` (los molinetes
> abiertos), `D-9` criterio 2 (jugable con el pulgar, nada de precisión fina), `D-17`
> (voseo), `RES-65.1` (el FAQ del juego de origen: en móvil se alterna), `RES-65.2` (*Ibb &
> Obb*: controlar dos personajes a la vez para una sola persona es el fracaso conocido),
> `RES-65.3`/`RES-65.4` (el botón de cambio aguanta puzzle y acción), `RES-65.6` (48 × 48 dp
> es el piso estándar y coincide con `--toque-min`), `RES-65.10` (en horizontal el viewport
> pasa a ~812 × 375 y hay precedente de género: cada uno agarra una punta), `UX-10` (el
> escritorio), `UX-27` (la grilla y la frontera), `src/layouts/Base.astro` (el `meta
> viewport` real, que no bloquea horizontal), `src/styles/tokens.css` (`--toque-min: 48px`).
>
> **Resuelve:** el punto 3 y el punto 11 de "A resolver antes de promoverla" de `IDEA-14`, y
> la consecuencia 3 de `D-40`. **No** resuelve el piso de niveles ni qué se comparte: eso es
> de `producto`, y lo nombro en `§7`.

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

### 2.2 La cabecera no tiene lugar en `§2`, y el escalón que la resuelve

> **Enmendado el 2026-09-22, cierra el traspaso
> `Docs/SUGERENCIAS/HILO-para-experiencia-la-cabecera-no-entra-en-el-reparto.md`.**

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

**La salida: la escala baja un escalón entero, no la cabecera ni el mueble.**
`UX-27 §2.1` ya deja los escalones de escala como la única forma legal de que el área
cambie de tamaño — múltiplos enteros, nunca una fracción — y `§4` de este mismo documento
ya usa el escalón de ×1 para el caso angosto (el teléfono en vertical). Acá es el mismo
mecanismo para el caso bajo: cuando el alto disponible no le alcanza a ×2, el fichín no
se recorta ni se solapa con nada — **entra entero a ×1**.

```
A ×1:
  8 + 144 + 28  =  180   (el mueble: área de 144 en vez de 288, misma imprenta)
+  48                    (la cabecera, entera, en su fila, sin achicar nada)
-----
  228
```

228 contra el peor caso de 354 deja **126 px CSS de sobra** — más que los "51 px CSS para
todo lo que no es el fichín" que `skayboy.css` calculaba para el ×2 apretado. Con esa
sobra **no hace falta esconder la bajada del casete ni llevar los márgenes a cero**: los
ajustes que el hilo principal dejó acotados a `max-height: 500px` eran remiendos para el
×2 que no entraba, y a ×1 no hacen falta — se quedan solo para la franja donde ×2 sí
entra (ver abajo).

**El umbral, con número.** ×2 pide 372 (48 + 324). Se le da margen porque el alto que
mide una media query no siempre coincide con el alto útil real —la barra de gesto no
siempre se descuenta igual— así que el corte no va pegado a 372: va en **400**, veinte
y pico de aire de sobra para ese margen de error y ninguno para el drama.

> - **Alto disponible < 330:** no aplica esta sección — es el ancho angosto de `§4`
>   (vertical), que ya usa ×1 por su cuenta.
> - **330 ≤ alto disponible ≤ 400:** ×1. Cabecera entera, mueble entero, sin recortar
>   nada. Es la franja nueva de esta enmienda.
> - **Alto disponible > 400:** ×2, con los ajustes que ya existían (aire cero, bajada
>   fuera de pantalla — ver `skayboy.css`).

**Por qué no se eligió ninguna de las otras dos salidas del traspaso.** El traspaso
ofrecía tres: la cabecera al aire lateral, la cabecera atornillada al mueble (solapada,
sin fila propia), o `§2` reescrito con el mueble más bajo.

- **Al aire lateral, descartada:** el aire lateral que sobra (92 px a 812, 46 por lado)
  **no existe siempre** — en el peor caso de ancho (el teléfono con muesca, 724 px
  útiles) sobran 4, y una cabecera de 48 no entra parada de costado en 4 px. Resolvería
  el caso cómodo y dejaría roto justo el caso que más importa, que es el mismo error que
  esta enmienda vino a corregir.
- **Atornillada al mueble (solapada), descartada:** para no sumar altura tendría que
  ocupar el mismo renglón que ya ocupan el bisel (4 px) o la chapa (4 u 8 px) del mueble,
  y ninguno de los dos tiene 48 px para darle sin invadir el área de juego o el bloque de
  saltar de una columna — exactamente lo que `UX-27 §1.2` punto 3 prohíbe ("ningún sello
  de goma entra" al área) y lo que este mismo documento prohíbe para las teclas (una zona
  de toque no se comparte con otra).
- **`§2` reescrito con el mueble más bajo, descartada:** bajar el mueble por debajo de
  324 a ×2 significa bajar el área por debajo de 288, y eso es achicar el área fuera de
  sus escalones enteros — lo que `UX-27 §2.1` prohíbe en su primera línea.

La única pieza de las tres que **sí** tenía margen legal para moverse era la escala
misma, porque `UX-27 §2.1` ya la declaró movible por escalones. No es una cuarta opción
inventada: es la que el propio documento de la grilla ya dejaba abierta y el traspaso no
miró.

**Lo que esto no toca.** El caso de ancho de `§2` (720 contra 724 útiles) sigue igual, sin
tocar. La franja de escala ×2 con sus remiendos sigue igual, solo que ahora acotada a
`min-height: 401px` en vez de aplicarse siempre que el ancho alcance. La línea del
vertical de `§4` no cambia. Ningún cartel nuevo, ningún bloqueo de orientación.

#### Qué tiene que cambiar en el código

Todo en `src/styles/skayboy.css`, sin un hex nuevo — solo `var(--...)` y el `--escala`
que la hoja ya declara:

1. **Bajar el piso de la regla que hoy fuerza `--escala: 2`.** La regla
   `@media (min-width: 720px) and (min-height: 330px)` deja de fijar `--escala: 2` para
   toda esa franja. Pasa a fijarla solo cuando el alto también supere el nuevo umbral.
2. **Agregar la franja nueva**, entre el piso angosto y el techo apretado:
   `@media (min-width: 720px) and (min-height: 330px) and (max-height: 400px)` fija
   `--escala: 1` en `.juego-skayboy .fichin`. No toca ningún otro selector: a ×1 la
   cabecera y la bajada entran solas, así que **no** se le suman las reglas que esconden
   `.encabezado-juego .tenue` ni las que ponen `padding-block: 0` en `main` ni
   `margin: 0` en `.cabecera-sitio` — esas son remiendos del ×2 apretado y acá no hacen
   falta.
3. **Acotar la franja existente al alto alto.** El bloque
   `@media (min-width: 720px) and (max-height: 500px)` —el que hoy esconde la bajada,
   pone `padding-block: 0` y acuesta la cabecera— pasa a
   `@media (min-width: 720px) and (min-height: 401px) and (max-height: 500px)`. El
   contenido del bloque no cambia, solo el rango que lo activa.
4. **Nada en `UX-27` ni en `tokens.css` se toca.** El área, la paleta y los 16 `--px-*`
   siguen exactamente como están: esta enmienda mueve un umbral de media query, no una
   medida de marca.

**Cómo se verifica**, comando ya existente, corrido a tres alturas (330, 400, 500, todas
con ancho 720+):

```
node --test src/lib/estilos.test.ts    # --toque-min en las seis teclas y en la cabecera, en las tres franjas
```

Y a ojo, con un teléfono o el inspector puesto en 812 × 354 (Chrome DevTools permite un
alto de viewport que no es el de ningún preset, y es el número que hace falta probar):
que el mueble entre completo, que la cabecera se lea entera y que ninguna tecla quede
recortada por el borde de la pantalla.

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
  vertical las teclas no se achican: se achica el área.
- **Una línea en la chapa, en registro 3**, que dice que de costado se ve el doble de
  grande. Una línea, seca, en la placa del mueble. **No es una pantalla, no tapa nada, no
  hay que tocarla para seguir.**

**Por qué así y no con un aviso a pantalla completa.** Un cartel de "girá el teléfono" es
una pantalla previa, la prohíbe `D-32` límite 3, y encima llega justo en el peor momento: el
primer segundo del que vino por un enlace de Twitter. Con esta salida, la persona toca,
el personaje se mueve, y gira el teléfono porque el juego mejora — no porque un cartel la
mandó.

**Lo que se gana al girar es medible y es lo único que la línea promete:** el doble de
tamaño, ×1 a ×2. Nada más aparece ni desaparece al girar.

---

## 5. El escritorio

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
4. **Entrando en vertical:** el dedo mueve un personaje sin haber tocado nada antes.
