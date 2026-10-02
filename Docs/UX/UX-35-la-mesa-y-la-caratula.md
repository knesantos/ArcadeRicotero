# UX-35 — La mesa y la carátula: la hoja apoyada, en la computadora

> Rol dueño: `experiencia`. `T-317`, ciclo 17. Primera versión 2026-10-02.
>
> Esta hoja se escribe **después** de construido (`T-311`..`T-316`): el hilo principal dejó
> andando y medido lo que `D-54` decidió, y acá queda en el formato del repo, con el porqué de
> cada número. Que esté construido no lo cierra: donde una decisión no me cierra como diseño lo
> digo en `§6`, con el motivo y lo que cambiaría, y el hilo principal aplica lo que la hoja
> resuelva.
>
> **Puesta al día el 2026-10-02, al cerrar el ciclo.** El hilo principal aplicó y midió los
> cinco puntos de `§6`: cada uno lleva su marca **APLICADO** y su medida, y el texto original
> se conserva como registro de por qué se cambió. Esta pasada además corrige el método de
> medición de las piezas torcidas (`REV-18` `FIND-110`, `§7`), registra las medidas que
> cambiaron (`§1.1`, `§3.3`, `§4.5`, `§5.2` a `§5.5`) y nombra dos reglas nuevas de la
> carátula: la pieza que es una respuesta del juego se esconde en partida (`FIND-100`, `§3.3`)
> y la lista también se esconde en `#eleccion` (`FIND-103`, `§3.4`). Lo que dice **medido (hilo
> principal)** lo midió él; yo no corrí nada (`D-12`).
>
> **Consume:** `D-54` (la decisión y el pedido textual del usuario);
> `Docs/SUGERENCIAS/HILO-para-experiencia-la-mesa-y-la-caratula.md` (lo construido, la tabla y
> lo medido el 2026-10-02 a 1440 × 900, 1280 × 800, 1366 × 768, 1024 × 768, 768 × 1024 y
> 375 × 812); `Docs/SUGERENCIAS/HILO-para-experiencia-el-escritorio-tampoco-cuenta-la-cabecera.md`
> (el agujero de `T-271`); `Docs/ORQ/ORQ-plan-ciclo-17.md` §1 (lo medido antes de cortar nada);
> `UX-01` (un tap por decisión, la primera pantalla sin muro); `UX-04` (el mapa sección→disco);
> `UX-10` (el escritorio de antes); `UX-24` y `UX-25` (la portada y el portal en el teléfono);
> `UX-28` §2.3–§2.6 y §5 (Skayboy); `UX-30` §2 y `UX-34` §1 (por qué un disco puede vestir más
> de un lugar); `.claude/rules/diseno-marca.md` y `.claude/rules/voz-ricotera.md`; y el
> código tal como está: `src/components/Caratula.astro`, `src/lib/sitio/caratula.ts` y su
> test, los bloques "La mesa y la carátula" y "Ponelos en fila" de `juego.css`, "La mesa del
> portal" de `sitio.css`, "La cabecera acostada" de `skayboy.css`, las cinco medidas de
> `tokens.css`, y los pares nuevos de `contraste.test.ts` y `estilos.test.ts`.
>
> **Cómo leer los números.** Hay tres clases, y va dicho cada vez que importa: **medido**
> (figura en el traspaso, en el plan del ciclo o en un comentario del código, y lo cito),
> **cuenta** (lo derivé yo de tokens y reglas, sin correr nada: `D-12`) y **por medir** (no
> figura en ningún lado: va al checklist de `§7`).
>
> **Resuelve:** la hoja de la pantalla de `D-54`, para las historias de la tabla de `§0.3`.
> Es una pulida transversal como `UX-10`: no define pantallas nuevas, define cómo se apoyan en
> una pantalla ancha las que ya existen. Los flujos de cada juego —qué pasa al fallar, al
> acertar y al compartir— **no cambian** y siguen donde están (`UX-01`, `UX-06`, `UX-08`,
> `UX-23`, `UX-34`…).
>
> **No resuelve:** la hoja 15 del lienzo (la republica el usuario, `T-319`), los atajos de
> teclado (`ORQ` §3), las páginas de lectura (Redondopedia, letras y acordes), ni una carátula
> para Skayboy (`§5.1`).

---

## 0. Lo que había, y la idea

### 0.1 Medido antes de cortar nada

`ORQ-plan-ciclo-17.md` §1 y `D-54`, el 2026-10-02, a 1440 × 900 salvo que se diga otra cosa.

| Qué | Cómo estaba |
|---|---|
| El portal | Una columna de **736 px**: dos casetes por renglón, el noveno solo, torcido y corrido; ~350 px de tinta a cada lado |
| Un juego | Una columna de **544 px**; el tablero de las preguntas terminaba en y ≈ 430, a un tercio del alto |
| Qué juego es, en partida | **Nada**: la portada se va con su título y no queda en pantalla nada que lo nombre |
| Los títulos de juego | Cuatro formas en ocho páginas, los ocho con la negrita que el navegador le pone a un `h1` |
| Los botones principales | Tres en el rojo de la marca por defecto, sin que nadie lo hubiera elegido (dos ejes, completá la letra, adiviná la tapa) |
| Skayboy | A ×4 el mueble terminaba en 978: teclas fuera (`T-271`) |
| Tests | 1387/1387 |

### 0.2 La idea, en un párrafo

En una pantalla ancha el sitio era el teléfono puesto en el medio de un monitor. Agrandarlo no
es la salida —`UX-10` §2.3 y §3.1 ya explicaron por qué: el tablero calibrado no se juega
mejor más ancho, el mouse viaja más y la letra de 28 px se lee como una interfaz de
televisor—. La salida es **apoyar la hoja en una mesa, al lado de la carátula del casete que
la persona tocó en el portal**: la misma pieza de tapa, el mismo número de pista, el mismo
disco. Y alrededor de eso, lo que una serie de ocho juegos necesita para leerse como serie:
un solo título, un solo botón, y un portal que es la pantalla de elegir que es.

### 0.3 Las pantallas y las historias

El portal no tiene `US-XX` propio (`UX-10`, encabezado). El resto, sí; el casete es el del
portal (`JUEGOS` de `copy.ts`) y la carátula usa su mismo número.

| Casete | Pantalla | Historia | Carátula |
|---|---|---|---|
| A1 | `/quiz/` | `US-01` | sí |
| A2 | `/juegos/dos-ejes/` | `US-06` | sí |
| A3 | `/juegos/adivinar-el-tema/` | `US-02` | sí |
| A4 | `/juegos/adivinar-por-la-letra/` | `US-07` | sí |
| A5 | `/juegos/completar-la-letra/` | `US-03` | sí |
| A6 | `/juegos/ponelos-en-fila/` | `US-08` | sí |
| A7 | `/juegos/adivinar-la-tapa/` | `US-04` | sí |
| A8 | `/juegos/mas-o-menos/` | `US-10` | sí |
| A9 | `/juegos/skayboy-y-poligirl/` | `US-09` | **no** (`§5.1`) |
| B1, B2 | letras y acordes, Redondopedia | `US-05` (B2) | no: no son una partida |

---

## 1. Las medidas y los cortes

### 1.1 Las medidas de marca (cinco de `D-54` y una que entró después)

Viven en `tokens.css`, con su explicación. Acá, qué gobierna cada una y de dónde sale. Las
cinco primeras son las de `D-54`; la sexta, `--ancho-tablero-amplio`, entró con `REV-18`
(`FIND-106`) y se explica en `§4.5`.

| Token | Valor | Qué gobierna | De dónde sale |
|---|---|---|---|
| `--ancho-hoja` | 34 rem (544 px) | La hoja en el teléfono y de 46 a 64 rem | El tope de siempre, el que calibró `UX-10`: opciones de 268 × 59 px. Estaba escrito a mano en dos hojas de estilo; pasa a tener nombre sin cambiar de valor |
| `--ancho-tablero` | 38 rem (608 px) | La hoja **con una carátula al lado**, desde 64 rem | Cuatro rem más que la hoja: las dos columnas de opciones pasan de 268 a 300 px (cuenta: (608 − 8) / 2). No crece más porque el mouse viaja entre opción y opción |
| `--ancho-tablero-amplio` | 52 rem (832 px) | La hoja de "Ponelos en fila" **desde 80 rem**, con sus dos paños | La bandeja necesita su columna sin comerle el ancho a las fichas puestas. Es el único juego que lo usa; vive en `tokens.css` porque es una medida de marca (`FIND-106`) |
| `--ancho-caratula` | 19 rem (304 px) | La columna de la carátula | La pieza de tapa a 1× de su archivo (detalles de 480 px, tapas de 320) entra a la mitad sin estirarse (`tokens.css`) |
| `--ancho-mesa` | 76 rem (1216 px) | El portal entero, desde 64 rem | Tres casetes de ~384 px por renglón: el ancho en que la etiqueta de papel deja de partir el título en tres renglones (`tokens.css`) |
| `--aire-mesa` | `clamp(2rem, 4vw, 4rem)` | Entre la carátula y la hoja; entre la marca y el afiche del portal | Crece con la ventana y tiene techo: a 1920 la carátula no queda a medio metro del juego que nombra. Cuenta: 32 px hasta 800 de ancho, 64 px desde 1600 |

**Lo que mide la mesa de un juego** (cuenta: 304 + aire + 608): 953 px a 1024, 970 a 1440,
976 desde 1600. A 1440 sobran 235 px de tinta por lado; antes eran 448 (`UX-10`, sección 2.1).
El portal, en cambio, mide 1216: la pantalla de elegir es más ancha que la de jugar, a
propósito (`§2.1`).

### 1.2 Los cortes

| Corte | Valor | Qué cambia | A quién afecta |
|---|---|---|---|
| Ancho 46 rem | 736 px | Dos columnas alineadas (`§2.3`). Es el de `UX-10`, sigue igual | Portal, índice de la Redondopedia |
| **Ancho 64 rem** | 1024 px | **La mesa**: la carátula en columna (`§3.3`) y el portal en tres (`§2.4`) | Los ocho juegos con carátula, portal |
| Ancho 80 rem | 1280 px | El casete crece y la bajada se lee entera (`§2.5`); "Ponelos en fila" en dos paños (`§4.5`); la elección de conjuntos pasa a tres columnas | Portal, "Ponelos en fila" |
| Capacidad | `(hover: hover) and (pointer: fine)` | El cambio de borde de la lista de la carátula. Separado del ancho a propósito, igual que en `UX-10` §1 | Carátula |
| Capacidad, táctil | `(pointer: coarse)` desde 64 rem | Los renglones de la lista llegan a `--toque-min` (`§3.3`, `§6.1`) | Carátula |
| Skayboy | 980 / 1220 px de ancho y 620 / 760 de alto | Las escalas ×3 y ×4 (`§5.4`) | Skayboy |
| Skayboy, cabecera | 980 de ancho, o 720 con alto entre 500 y 800 | La cabecera acostada (`§5.3`) | Skayboy |

**Por qué la mesa arranca en 64 rem y no en 46.** A 46 rem no entran una carátula de 19 y una
hoja de 34 sin apretar las dos (cuenta: 19 + 34 + 2 de aire como mínimo = 55 rem, y la
ventana mide 46). A 64 rem sobran unos 70 px (cuenta: 1024 − 953, sin contar el relleno
lateral de `main`). Entre 46 y 64 rem el sitio sigue como el teléfono acostado, que es lo que
ya era.

**Por qué el casete crece recién a 80 rem.** Medido a 1024, con tres casetes por renglón la
etiqueta mide ~170 px y la bajada entera la estiraba a ocho renglones; ahí sigue la primera
oración sola, como en el teléfono (comentario de `sitio.css`).

**Ninguno de los cortes toca un teléfono parado.** Por debajo de 46 rem el sitio se ve como
antes, con **tres** excepciones que no son de lugar y que `D-54` declara: la calcomanía de la
cabecera (`§3.2`), el título único (`§4.2`) y el botón con canto (`§4.3`).

---

## 2. El portal: el reparto por corte

### 2.1 Es la pantalla de elegir, y por eso la única que ensancha su contenedor

El argumento es el de `UX-10` §2.4, que sigue en pie: elegir no es leer ni jugar, y mostrar
más a la vez es el trabajo mismo de la pantalla. Una hoja de juego no se ensancha por la razón
inversa: allá el ancho es lo que se juega, y el mouse viaja por él. La diferencia entre 1216
(portal) y ~970 (mesa) es intencional.

### 2.2 Hasta 46 rem: nada cambia

Una columna, casetes apenas solapados y corridos, como lo dejó `UX-25`. El presupuesto de
`UX-25` §1 (cabecera, rodillo, lados, casetes de 136 px) sigue valiendo entero.

### 2.3 De 46 a 64 rem: dos columnas que se alinean, y el noveno al centro

> Esta es la sección que cita `sitio.css` ("los casetes dejan de pisarse cuando hay
> columnas").

El solapamiento de −10 px y el corrimiento alternado de 14 px son de la pila del teléfono:
una columna, cada casete encima del de arriba. En una grilla de dos, el solapamiento le subía
10 px también al casete de la columna derecha y el corrimiento par/impar los corría hacia el
medio. Medido a 1440 × 900 en el ciclo 16: las dos columnas arrancaban con **8 px de
diferencia** y el A9 quedaba solo, torcido y corrido. Una pila desordenada se ve a mano; una
grilla desalineada se ve rota.

Lo que se hace, desde 46 rem:

- **Separación pareja** en los dos ejes (`--espacio-3`) y **sin solapamiento**.
- **Cada casete llena su celda**: los dos de un renglón miden lo mismo de alto.
- **La rotación se queda.** Es lo que lo hace collage; lo que sobra era el desorden de lugar.
- **El noveno va al centro de su renglón**, con el ancho de los demás (la mitad menos medio
  espacio). Un casete pegado a un costado parece que se cayó de la pila; centrado, es el
  último del lado. La regla vale para cualquier último casete en lugar impar, así que el
  lado B (dos casetes) no la dispara.

El contenedor sigue en 46 rem, como dice `UX-10` §2.4.

### 2.4 Desde 64 rem: la mesa del portal

- **El contenedor sube a `--ancho-mesa`** (76 rem), con `--espacio-3` de relleno a los
  costados.
- **El frente va en dos columnas**: a la izquierda la cabecera (la marca grande, "dónde
  estás", la bajada), a la derecha el afiche de octubre. Proporción 1 a 1,12, separadas por
  `--aire-mesa`, centradas en alto. **Fuera de octubre no hay afiche** y el frente queda en
  una sola columna: un renglón, no media mesa vacía.
- **La marca crece** (`clamp(4.25rem, 5.6vw, 5.75rem)`), la bajada del sitio se limita a 46
  caracteres por renglón y la figura del recorte de portada pasa a `clamp(150px, 12vw,
  196px)` (en el teléfono, `clamp(92px, 30vw, 132px)`): en el teléfono el techo lo ponía el
  primer renglón de la bajada, y acá la bajada tiene su ancho.
- **El lado A son nueve casetes en tres por tres**, sin huérfano. **El lado B**, con dos,
  usa el mismo ancho de casete que el lado A y va centrado: dos casetes estirados a media
  mesa serían otra pieza, y una celda vacía a la derecha, un hueco.
- **La rotación se reparte por columna** (−0,8°, 0,55°, −0,35°), no por par e impar: con tres
  por renglón, el del medio de un renglón saldría torcido igual que el de la punta del
  siguiente.
- **El casete**: pieza de tapa de 64 px (en el teléfono, 58), separación y relleno de 14 px.

### 2.5 Desde 80 rem: el casete crece y la bajada se lee entera

La pieza pasa a **84 px**, separación de 18, relleno de 16, título de 1,04 rem y bajada de
0,86 rem. Y la bajada se lee **entera**: en el teléfono la casetera no tiene alto para la
segunda oración (`UX-25` §2.4) y en un monitor sobra.

El corte se hace como lo fijó `UX-25`: **en el punto que el autor ya puso**, no con un
recorte por altura (el suspensivo en este sitio es del Indio y de la Redondopedia, no de un
casete: `voz-ricotera.md` §3.7). `caratula.ts` parte la bajada en `primeraOracion()` y
`restoDeLaBajada()`; las dos mitades se imprimen siempre, y el resto está oculto hasta 80
rem. `caratula.test.ts` vuelve a armar cada bajada letra por letra: **el escritorio no
inventa texto**. La que canta sigue siendo la primera oración (la que audita `voz.test.ts`
con su techo de ocho palabras); la segunda es mecánica, como ya decía `UX-25`.

### 2.6 El reparto, de un vistazo

| Ancho | Lado A | Lado B | Pieza | Bajada | Frente |
|---|---|---|---|---|---|
| < 46 rem | 1 columna, solapados | 1 columna | 58 px | primera oración | apilado |
| 46 – 64 rem | 2 columnas alineadas, el A9 al centro | 2 columnas | 58 px | primera oración | apilado |
| 64 – 80 rem | 3 × 3 | 2 centrados, ancho de uno del lado A | 64 px | primera oración | dos columnas (octubre) |
| ≥ 80 rem | 3 × 3 | ídem | 84 px | **entera** | ídem |

**Lo que el portal no toca:** el umbral de entrada y su animación (`UX-25` §4), los dos
nombres de tránsito del documento (`lugar` y `marca`) y el pie.

---

## 3. La carátula

### 3.1 Qué es

> **El casete que tocaste en la puerta, ahora en la mano.**

La carátula de un juego es su casete del portal: la misma pieza de tapa, el mismo número de
pista, el mismo disco. **No tiene datos propios**: `caratulaDe(href)` lo arma desde `JUEGOS`
de `copy.ts`, que es lo mismo que lee el portal. Si mañana un casete cambia de pieza o de
lugar, la carátula de su juego cambia sola, y no hay manera de que el portal diga A3 y la
página diga A4. `caratulaDe()` **tira** si la ruta no está en el lado A: una página de juego
que no está en el portal es un juego que nadie puede encontrar, que es lo que `D-51` vino a
cerrar, y más vale que lo diga el build que la gente.

Es **un solo elemento con dos formas**, y ninguna es un agregado del escritorio: la
calcomanía del teléfono (`§3.2`) y la columna de la computadora (`§3.3`). Va como **último** hijo
de `main` (era el primero hasta el 2026-10-02: `§6.2`) y no adentro de la portada, porque en la
computadora tiene que seguir ahí cuando la isla esconde la portada. Las islas no la tocan: buscan sus zonas por `id` y la carátula no
tiene ninguno. No lleva JavaScript: lo que cambia entre jugar y no jugar es CSS sobre el
`hidden` que las islas ya ponían.

**Registro 3, entero** (`voz-ricotera.md` §5): "Carátula de …", "Lado A · pista 3", el nombre
del juego y el de la lista. Dice qué hay y se calla.

**Una consecuencia que no estaba escrita y me importa** (es mía, no de `D-54`): quien llega
por un enlace a un solo juego (Twitter, un amigo: `UX-01`, pantalla 0) ve en la computadora
de dónde salió y cuántos más hay. El sitio se lee como un arcade y no como un quiz suelto.
Es un molinete abierto más: nada de eso pide algo para entrar.

### 3.2 En el teléfono: una calcomanía en la esquina de la cabecera

El renglón de la cabecera tenía "← AL ARCADE" a la izquierda y nada a la derecha. Ahí va la
pieza del casete y su número, como una calcomanía pegada en la tapa:

- **La pieza a 44 px** y **"A3"** escrito a mano (la rotulada a 1 rem, torcida 3°, en
  `--texto-tenue`). El número es el que el casete llevaba en el portal.
- **Pegada** a la esquina de arriba a la derecha de `main`, a `--espacio-2` de los dos
  bordes.
- **Sin nada que tocar**: `pointer-events: none`. No es un control, así que no entra en la
  cuenta del `--toque-min`.
- **Se va cuando arranca la partida**, junto con la cabecera: la isla esconde la portada y
  ya no hay cabecera a la que pegarse, y en plena partida no hay más que el juego (la regla
  de un tap por decisión de `UX-01`). Tampoco está en el resultado, por la misma razón.
- **Para el lector de pantalla** queda el `aside` con su nombre ("Carátula de …") y la pista
  larga ("Lado A · pista 3"), escondida a la vista. La marca, el título y la lista no se
  muestran.

**Entre 46 y 64 rem es lo mismo**: la calcomanía y la hoja de 34 rem, como un teléfono
acostado.

**Lo que se descartó:** un rótulo "LADO A · PISTA 3" arriba del título (hoja 15, "así no").
Es un cartel que explica; el número escrito a mano en la etiqueta es lo que hace un casete
grabado en casa.

### 3.3 En la computadora, desde 64 rem: la columna de la mesa

```
 ≥ 64 rem
┌─────────────────────┬──── aire ────┬───────────────────────────────┐
│ ARCADE              │              │ ADIVINÁ EL TEMA      (2,6 rem)│
│ RICOTERO            │              │ la bajada                     │
│ ┌─────────────────┐ │              │                               │
│ │  pieza de tapa  │ │              │ [      JUGÁ      ]            │
│ │   (8,5 rem)     │ │              │                               │
│ │ ┌─────────────┐ │ │              │                               │
│ │ │ ADIVINÁ EL  │ │ │              │                               │
│ │ │ TEMA     A3 │ │ │              │                               │
│ │ └─────────────┘ │ │              │                               │
│ └─────────────────┘ │              │                               │
│ LADO A ──────────── │              │                               │
│ A1 Preguntas…       │              │                               │
│ A3 Adiviná el tema◄ │              │                               │
│ …                   │              │                               │
│ LADO B ──────────── │              │                               │
│ B1 Letras y acordes │              │                               │
│ B2 La Redondopedia  │              │                               │
└─────────────────────┴──────────────┴───────────────────────────────┘
   19 rem (304 px)         aire          38 rem (608 px)
```

De arriba abajo:

1. **La marca** ("ARCADE RICOTERO") en la letra calcada, 1,85 rem, en dos renglones, en el
   rojo de la marca. Es **la misma marca de la hoja**, mudada: en la mesa la de la hoja se
   esconde, y la de la carátula lleva el nombre del tránsito `marca`, así que el paso desde
   el portal lleva la marca grande hasta acá. Nunca se ven las dos a la vez (un nombre
   repetido a la vista apaga el paso sin avisar: `ADR-03` §6.3). Todas las letras de la marca
   están en el calco (`diseno-marca.md`, tabla de fuentes).
2. **El frente**: la pieza sobre la tinta del sitio, recortada por un borde grueso en la tinta
   del disco (55 % del tinte mezclado con `--borde`), apenas torcida (−0,6°) y sostenida con
   una cinta a la derecha. La cinta va a la derecha porque a la izquierda cruzaba la marca,
   que termina justo arriba. Es el idioma de recorte pegado de `diseno-marca.md`, no una
   tarjeta elevada. El relleno de arriba es `--espacio-2` (era `--espacio-3` hasta el
   2026-10-02, por el alto: `§6.1`).
3. **La pieza grande**: **8,5 rem** (136 px); un recorte sin marco, **9,5 rem** (152 px),
   porque el aire lo pone su silueta. (Eran 9,5 y 10,5 rem en la primera versión de esta hoja;
   bajaron para que la columna ocupe menos alto: `§6.1`.)
4. **La etiqueta de papel**, la del casete del portal: tinta del fondo sobre papel rayado.
   Arriba el nombre (rotulada, 1,15 rem), y **la pista abajo a la derecha**, escrita a mano en
   la tinta apagada del papel. No es un rótulo arriba del título: es la pista, donde la
   escribe quien graba el casete.
5. **La lista**: "Lado A" y "Lado B" como rótulos con regla punteada, y debajo un renglón por
   casete, con su número escrito a mano y su nombre. Nueve y dos: los once casetes del portal.
   El juego de la página va **marcado con tres canales**: borde en la tinta del disco, letra
   plena (los demás, tenue) y `aria-current="page"`. Nunca solo color.

**La grilla.** `--ancho-caratula` y, a su derecha, `--ancho-tablero`, separadas por
`--aire-mesa`, centradas. Dos filas, la segunda flexible; la carátula cruza las dos y la
sección a la vista va en la primera. Si la carátula es más alta que la sección, **crece la
fila flexible y no la de la sección**, y el tablero no se despega de arriba. La carátula queda
**pegada al desplazar**, a `--espacio-3` del borde de arriba, y **no pasa del alto de la
ventana menos dos `--espacio-3`**: si el contenido es más alto, se desplaza por dentro, sin
arrastrar la página (`max-height`, `overflow-y: auto` y `overscroll-behavior: contain`:
`§6.1`). Con puntero táctil (`(pointer: coarse)`, desde 64 rem) cada renglón de la lista llega
a `--toque-min`.

**La tapa de fondo** de los juegos que la tienen se queda detrás de la hoja, con un margen de
sangre, y no detrás de la mesa entera: estirado a 1440 px, un archivo de 591 px (el más
grande del catálogo: `UX-04`) se ve al 40 % de su resolución, y la carátula ya trae la pieza
del disco a 1×. El margen de sangre evita que el borde de la foto coincida con el borde del
texto y el título se pegue a la costura.

**El crédito.** La pieza de la carátula acredita su disco en el pie, y es cierto en las dos
formas porque la carátula está en el teléfono y en la computadora (`tapasConCaratula()`,
`D-21` condición 1).

**La pieza que es una respuesta se esconde en partida** (`REV-18` `FIND-100`, 2026-10-02).
En "Adiviná la tapa" la pieza de la carátula es el ojo de buey de *Último bondi a Finisterre*,
que es la respuesta correcta de `TP-006` y un distractor en otras rondas: dejarla a la vista
en la mesa le soplaba la respuesta a quien está jugando. Es el mismo motivo por el que ese
juego va sin figura en el pie (`D-35`). El componente tiene la propiedad `piezaSopla`, que
pone la clase `.caratula--la-pieza-sopla`; con `#partida` a la vista el CSS esconde la pieza y
**queda la etiqueta con el nombre**, que no sopla nada. En la portada y en el resultado la
pieza está. En el teléfono no hace falta: la calcomanía ya se va con la portada. **La regla
para un juego nuevo**: si la pieza de su casete es una respuesta o un distractor de sus
propias rondas, su página pasa `piezaSopla`. `caratula.test.ts` vigila que "Adiviná la tapa"
la pase.

### 3.4 La lista se va mientras se juega, y vuelve al terminar

| Pantalla | Teléfono | Computadora |
|---|---|---|
| Portada | calcomanía | marca, pieza, etiqueta y **lista** |
| En partida | nada | marca, pieza (salvo que sea una respuesta del juego: `§3.3`), etiqueta; **sin lista** |
| Resultado | nada | marca, pieza, etiqueta y **lista** |

**La regla.** Con `#partida`, `#pregunta`, `#tablero` o `#eleccion` a la vista, la lista no
está. Son las cuatro zonas de juego de los ocho tableros; la portada y el resultado no se
llaman así. `#eleccion` es el paso de "Ponelos en fila" después de tocar "Empezá" (qué
repartís): lo agregó `REV-18` `FIND-103` el 2026-10-02, porque en la primera versión de esta
hoja eran tres zonas y ese paso, que ya es parte de la partida, dejaba la lista abierta.

**Por qué.** La lista son once enlaces, o sea once salidas. `D-54` lo cita de `UX-01`; esa
hoja no lo dice con esas palabras, lo dice como un tap por decisión, y de ahí sale: en plena
partida la decisión es la del juego, y una pantalla que a mitad de una pregunta ofrece once
maneras de irse no cumple eso. Lo que sí queda a la vista es lo único que antes no había:
qué juego es.

**Por qué vuelve en el resultado.** Terminada la partida, elegir el siguiente es lo que hay
que hacer, y la lista lo deja a un clic y sin pasar por el portal. El botón de compartir
sigue siendo el primario, el más grande de la pantalla (`UX-01`, pantalla final), y la lista
es chica y tenue. Está en el checklist de `§7.8`.

**Cómo se esconde sin tocar una isla.** Es CSS sobre el atributo `hidden` que las islas ya
ponen. Un juego nuevo cuya zona de juego se llame de otra forma dejaría la lista abierta
mientras se juega. Por eso `caratula.test.ts` exige que `juego.css` nombre las cuatro zonas y
que **toda sección que no sea la primera (la portada, `portada` o `inicio`) ni `resultado`
esté cubierta** por esa lista: una sección nueva con otro nombre rompe el build, que es lo
que no pasaba en la primera versión (el test pedía "una de las tres" y `#eleccion` se
escapaba).

**Lo que se descartó:** una barra de navegación arriba, de sitio de noticias. Es la plantilla
de cualquier sitio y pone las salidas a la vista en plena partida (`D-54`).

### 3.5 El recorrido, pantalla por pantalla

1. **Portal** (`§2`): tocás el casete A3.
2. **Portada del juego.** *Teléfono:* la calcomanía con A3, el título, el botón. *Computadora:*
   la carátula con la lista, y la hoja con el título a 2,6 rem y el botón.
3. **Partida.** *Teléfono:* nada más que el juego. *Computadora:* la carátula sin la lista.
4. **Fallar o acertar.** Como en cada juego; esta hoja no lo toca.
5. **Resultado.** *Teléfono:* como siempre. *Computadora:* la lista vuelve; el botón de
   compartir sigue siendo el principal.
6. **Compartir y cerrar**, o pasar al siguiente de la lista.

La sesión sigue siendo de dos o tres minutos: la carátula no agrega un solo paso entre el
portal y la primera jugada.

### 3.6 Accesibilidad de la carátula

- El `aside` tiene nombre ("Carátula de …"); la lista es un `nav` con el suyo.
- La marca y la pieza son decorativas (`aria-hidden`, `alt=""`): lo que las nombra está en el
  título de la hoja y en la etiqueta.
- El cambio de borde de la lista con mouse vive solo bajo `(hover: hover) and (pointer:
  fine)`: reusa el tinte que el elemento ya tiene, sin elevación ni escala (`UX-10` §3.2).
- La carátula no tiene animación propia, así que el movimiento reducido no tiene nada que
  apagar; la transición de color y borde de la lista es respuesta al toque y dura
  `--duracion-toque`.
- Los pares de color que usa (`--fondo` sobre `--papel`, `--papel-tenue`, `--texto-tenue`) ya
  están en `contraste.test.ts`; la hoja no suma uno nuevo.
- **Dos cosas que no cerraban** —el blanco táctil del renglón y el orden de tabulación— se
  corrigieron el 2026-10-02 (`§6.1` y `§6.2`).

---

## 4. La hoja sobre la mesa

### 4.1 El disco de cada hoja

`.juego--*` es el mismo mapa que `.casete--*`: están escritos en la misma regla de `sitio.css`.
**El casete que se toca en la puerta y el juego que abre no pueden vestir dos discos
distintos**, y no lo hacen por construcción: la página toma `juego--${variante}` del mismo
dato de donde sale el casete (`caratula.test.ts` lo exige).

| Casete | Juego | Variante | Disco | Tinta del título | Tinta del botón y canto |
|---|---|---|---|---|---|
| A1 | Preguntas ricoteras | `marca` | Oktubre | `--texto` (la hoja de preguntas lo lleva en el texto claro) | `--marca-rojo` / `--disco-oktubre-apoyo` |
| A2 | ¿Qué tipo de ricotero sos? | `luzbelito` | Luzbelito | `--disco-luzbelito-tinta` | ídem tinta / `-apoyo` |
| A3 | Adiviná el tema | `mitologia` | Lobo suelto | `--cat-mitologia` | ídem / `--cat-mitologia-apoyo` |
| A4 | Sacalo por la letra | `momo` | Momo Sampler | `--disco-momo-sampler-tinta` (`--tinte-sello`); el borde, el apoyo | ídem / `-apoyo` |
| A5 | Completá la letra | `letras` | La mosca y la sopa | `--cat-letras` | ídem / `--cat-letras-apoyo` |
| A6 | Ponelos en fila | `bang` | ¡Bang! ¡Bang!… Estás liquidado | `-tinta` del disco | ídem / `-apoyo` |
| A7 | Adiviná la tapa | `discos` | Último bondi a Finisterre | `--cat-discos` | ídem / `--cat-discos-apoyo` |
| A8 | Más o menos | `baion` | Un baión para el ojo idiota | `-tinta` del disco | ídem / `-apoyo` |
| A9 | Skayboy y Poligirl | `historia` en el portal | Gulp! | no usa `.juego--*`: el mueble trae su tinta (`UX-30` §2) | `skayboy.css` |

**Lo que no rota por disco** (`diseno-marca.md`, reglas duras): la **marca** es de Oktubre en
todas las pantallas, y el apoyo de cada disco es para el título del juego, no para la firma
del sitio; **"Compartí"** del resultado sigue en *Gulp!* (`D-19`: resultado = Gulp! + logo),
con un canto de la misma tinta hundida en el fondo; y acierto, error y los rótulos de leyenda
y testimonio no se disfrazan de ningún disco. El mapa completo, con la fuente de cada fila,
está en `UX-04` ("Mapa sección→disco").

### 4.2 Un solo título

`.pantalla > h1` vale para los ocho, y **ninguna página lo reescribe** (lo vigila
`estilos.test.ts`). Se había derivado a cuatro formas: la rotulada a 1,5 rem, a 2,3 rem, la del
sistema en negrita, la del sistema a 1,75 rem. Ocho títulos de ocho familias puestos uno al
lado del otro en la lista de la carátula no son una serie, son ocho sitios.

| Propiedad | Valor | Por qué |
|---|---|---|
| Familia | `--fuente-rotulada` (Archivo Black) | Completa: tiene tildes y Ñ, así que no choca con la deuda de las fuentes de disco |
| Peso | **normal** | Un `h1` sale en negrita por defecto y Archivo Black tiene un solo peso: el navegador la engordaba a mano en los ocho. `estilos.test.ts` ya prohibía esa negrita falsa en los botones; ahora también acá |
| Tamaño | `clamp(1.65rem, 7vw, 2.15rem)`; **2,6 rem** desde 64 rem | La letra de cartel crece con la mesa; la de juego no (cuenta: 26,4 px a 375; 41,6 px en la mesa) |
| Resto | interlínea 1,04, espaciado 0,02 em, mayúsculas, renglones equilibrados | — |
| Tinta | la del disco (`§4.1`), con `--texto` de repuesto | Lo que rota por sección es el acento y la letra grande (`D-19`) |

El título **no lleva velo propio**: va sobre el de la hoja. Tres juegos lo apoyan sobre una
tapa velada (adiviná el tema, adiviná la tapa, completá la letra) y por eso entraron tres
pares a `contraste.test.ts`: la tinta del disco contra el peor caso del velo, en el piso de
**3:1 de texto grande**. El de la letra pasó del texto claro a la tinta de su disco con este
cambio; los otros dos ya iban así sin que ningún test lo midiera.

Voz: el techo de ocho palabras de `voz-ricotera.md` §4.1 sigue siendo de `voz.test.ts`, y
2,6 rem no lo cambia.

### 4.3 Un solo botón

`.primario` es el botón principal de los ocho: fondo en la tinta del disco (`--tinte-accion`),
letra en `--fondo`, la rotulada a 1,25 rem en su peso normal, y **un canto**: una sombra dura
de 4 px hacia abajo, en el apoyo del disco (`--canto-accion`). Apretado, **se hunde 3 px** y el
canto queda en 1. Deshabilitado, sin canto.

Cinco de los ocho ya iban en la tinta de su disco, y dos de ellos ya tenían el canto, cada uno
escrito a mano. Tres iban en el rojo de la marca, que es el repuesto de `.primario` y que
nadie había elegido: tres juegos de tres discos distintos con el mismo botón rojo dicen que
son el mismo juego. Ahora es del botón, y cada juego le pone su apoyo.

- **Es sombra plana, sin difuminar**: la única que `diseno-marca.md` admite. El hundirse no es
  decoración sino respuesta al toque, y por eso dura `--duracion-toque`, que el movimiento
  reducido no apaga.
- **Pares nuevos** (`contraste.test.ts`): cinco botones con `--fondo` encima —dos ejes, completá
  la letra, adiviná la tapa, y los dos que ya iban en su tinta sin un par que nombrara el
  uso: adiviná el tema y más o menos—. Un color sin par testeado no existe.
- **"Compartí"** (`.primario.firma`) queda en *Gulp!* en los ocho y con su propio canto.
- **El imperativo no cambia** (`D-17`): `JUGÁ`, `EMPEZÁ`, `ARMÁ`, `SEGUÍ`.

### 4.4 La hoja a 38 rem, y la letra que no crece

Desde 64 rem la hoja mide `--ancho-tablero` (608 px), no los 544 de antes. **Esto enmienda la
cifra de `UX-10` §2.3** ("34 rem, sin excepción"), no su criterio: el tablero no crece
porque haya lugar, crece 4 rem porque la carátula lo pidió, y no más porque el mouse viaja.
Lo que `UX-10` §3.1 fijó **sigue entero**: el enunciado (20,8 px), las opciones, el piso de
`--toque-min` y todos los botones no cambian de escala. En las hojas de juego solo crecen el
título (`§4.2`) y la marca de la mesa. El portal, que es de elegir y no de jugar, sube además
su cartel y los textos del casete unos puntos (`§2.4` y `§2.5`).

La Redondopedia y el cancionero no entran en esto: su cifra (34 rem, y su 66 caracteres por
renglón) es otra, y no se toca.

### 4.5 "Ponelos en fila" en dos paños, desde 80 rem

> Esta es la sección que cita `juego.css` ("la mesa: el tablero en dos paños").

En el teléfono el tablero es una columna, y la bandeja tiene desplazamiento propio (42 % del
alto) para que las filas y la bandeja entren juntas. En una pantalla ancha eso sigue siendo
un viaje: el mouse baja a la bandeja, agarra una ficha, sube a la fila, baja otra vez. Con
las filas y la bandeja **lado a lado**, el viaje es de costado y corto.

- **Es el único tablero que pide más que `--ancho-tablero`**: `--ancho-tablero-amplio`, 52 rem
  (832 px), porque la bandeja necesita su columna sin comerle el ancho a las fichas puestas.
  **APLICADO 2026-10-02 (`REV-18` `FIND-106`).** Lo que la primera versión de esta hoja
  señalaba: el CSS declaraba los 52 rem desde 64 rem aunque los dos paños empiezan en 80, y
  entre las dos la hoja era una columna única más ancha de lo que hace falta. Ahora es un
  token de `tokens.css` y se aplica **desde 80 rem, junto con los dos paños**; entre 64 y 80
  rem "Ponelos en fila" usa el `--ancho-tablero` de 38 rem como los demás. Medido (hilo
  principal): a 1100 × 800 la hoja mide 608 px.
- **Desde 80 rem**: dos columnas, las filas a la izquierda (`1fr`) y la bandeja a la derecha
  (entre 15 y 18 rem, o sea 240 a 288 px; cuenta). La cabecera, la mano y la lámina ocupan las
  dos.
- **La bandeja se pega** a 3,5 rem del borde de arriba, debajo de la mano, que ya está pegada
  arriba; la lista de piezas de la bandeja no pasa del alto de la ventana menos 11 rem. Con una
  ficha en la mano se ve entonces la mano, la bandeja y al menos una fila.
- **El orden del documento no cambia**: cabecera, mano, filas, bandeja, lámina. Lo pone la
  grilla; el lector de pantalla y el teclado recorren lo mismo que en el teléfono.
- **Lo que no cambia de `UX-23`**: ninguna fila tiene color ni se distingue por tinte. Se
  distinguen por nombre, posición y contador.
- **La elección de conjuntos** (qué repartís) pasa a dos columnas desde 46 rem y a tres desde
  80, con el criterio de `UX-10` §2.1: elegir qué jugar no es leer.

### 4.6 "Sacalo por la letra": el buscador pegado a la hoja

En el teléfono la columna de la partida mide `100svh` y el buscador queda anclado al pie
(`UX-08`): ahí es donde cae el pulgar. En la mesa eso abría un hueco de **~400 px** entre el
primer verso y la caja de escribir (medido a 1440 × 900): el ojo leía el verso arriba y tenía
que bajar a buscar dónde contestar. Con mouse no hay pulgar que alcanzar al pie.

Desde 64 rem la partida deja de ser de `100svh`, la hoja de versos pierde su margen de abajo y
**el buscador queda pegado a los versos**; la hoja crece con los versos, como ya hacía en el
teléfono. A 375 × 812 el buscador sigue anclado al pie, sin un cambio.

**Y algo parecido pasa con el botón de arranque de cada portada.** `UX-24` §2 lo pegó al pie
de la ventana porque la lista de discos lo empujaba afuera; en la mesa va en el flujo y sin la
franja de tinta que tapaba la foto de fondo detrás del botón. Esto tenía un costo de medición
(`§6.4`), que se resolvió el 2026-10-02 bajando lo que empuja el botón y no volviendo a
pegarlo.

---

## 5. Skayboy y Poligirl: la excepción y la cabecera acostada

### 5.1 Por qué no tiene carátula

El mueble del fichín **es su propia carátula**: la chapa de papel, el pie atornillado, la
tinta de *Gulp!*. Y a ×4 ocupa la mesa entera: el marco pide 1200 px de ancho, y con una
carátula al lado harían falta más de 1500 (cuenta: 1200 + 304 + el aire), cuando el corte de
×4 está en 1220. Es la **única excepción**, y está escrita como excepción en
`caratula.test.ts` (`SIN_CARATULA`, un solo elemento, con un test que falla si la página deja
de existir).

Consecuencia que conviene tener presente: **Skayboy no tiene lista de casetes**, así que de
ahí no se pasa a otro juego sin volver al portal. Es el costo de la excepción y es chico:
la partida es de un nivel, que es el corte de sesión (`UX-28` §6).

### 5.2 El agujero de `T-271`, y la tercera salida

Con `UX-28` §2.3–§2.6 aplicado, el teléfono cerraba y el escritorio no. Los cortes de alto
salían del marco del mueble solo —**468** para ×3 (432 de área más 36 de bisel y chapa) y
**612** para ×4— y ninguno contaba lo que va arriba. Medido por `T-271`:

```
16  padding de main
+ 48  cabecera (volver)
+ 24  su margen
+ 254 marca + h1 + bajada + rótulo
+ 24  margen del fichín
= 366 arriba del mueble
```

366 + 468 = **834** para ×3, contra un corte de 520. 366 + 612 = **978** para ×4, contra un
corte de 660. De ahí que 1024 × 600 dejara 6 teclas fuera y 1280 × 800, 4.

El traspaso ofrecía dos salidas: subir los cortes (a ≈ 850 y ≈ 990, que dejaba a casi todos
los portátiles en ×2) o achicar el encabezado también en el escritorio (que sacaba la bajada
justo donde más lugar hay). `D-54` tomó **una tercera**, y es la que esta hoja confirma:

> **La cabecera se acuesta en un renglón, con la bajada al costado del título.** No se saca
> nada. Volver, marca, título y bajada comparten una sola fila.

Resultado (el ~90 es del comentario de `skayboy.css`; el desglose no figura en el traspaso):
la cabecera pasa de **326** (48 + 24 + 254, cuenta) a **~90**, y lo que hay arriba del mueble,
contando la sangría y el aire, de **366 a ~122**.

**Corrección del 2026-10-02: ese ~90 era una cota alta.** El hilo principal midió en los
pisos de los cortes que el mueble termina en 568 (×3, 980 × 620) y en 692 (×4, 1220 × 760),
antes del ajuste de `§5.3`. Con 468 y 612 de mueble y 16 + 16 de sangría y aire (cuenta), la
cabecera acostada mide **~68 a 980 y ~48 a 1220**, no ~90 (probablemente porque la bajada
parte en dos renglones en el ancho más angosto y entra en uno en el más ancho; no está
medido por separado). Los márgenes de `§5.4` son más holgados de lo que decía la cuenta.

### 5.3 Cuándo se acuesta

| Ancho | Alto | Cabecera |
|---|---|---|
| ≥ 980 | > 500 | **acostada** |
| de 720 a 979 | de 500 a 799 | **acostada** |
| de 720 a 979 | ≥ 800 | apilada de siempre (una tableta parada: 768 × 1024) |
| cualquiera | ≤ 500 | las franjas de `UX-28` §2.3 y §2.4, sin cambios |

**Por qué no se acuesta de 720 a 979 de ancho con 800 de alto o más.** Ahí la escala no pasa
de ×2 y el alto sobra: la apilada de siempre entra con aire (366 + 324), y acostada dejaba
media pantalla de negro bajo el mueble, medido a 768 × 1024. Entre 500 y 800 de alto la
apilada no entra (pide ~750), y se acuesta.

La cabecera acostada mide lo mismo que el fichín, así que "volver" arranca donde arranca la
columna de mando izquierda y no pegado al borde de la ventana. Marca a 1,15 rem, título a
1,6 rem, bajada en el mismo renglón o debajo si no entra (`flex: 1 1 20rem`, 0,92 rem).

**Ajuste del 2026-10-02 (`REV-18` `FIND-99`).** El `.fichin` de la cabecera acostada pasó de
`margin-block: var(--espacio-2) 0` a `var(--espacio-3) 0` (24 px): el sello de pantalla
completa asoma 22 px sobre el mueble y tapaba la última palabra de la bajada a 1024 × 640 y a
720 × 600. Son 8 px más de aire entre la cabecera y el mueble, que ya están contados en las
medidas de `§5.4` y `§5.5`.

### 5.4 Los cortes de ×3 y ×4

| Escala | El marco pide (ancho × alto) | La cuenta con cabecera y aire (cota de ~90, primera versión) | Corte antes | **Corte ahora** | Margen de esa cuenta (el real es mayor: abajo) |
|---|---|---|---|---|---|
| ×3 | 960 × 468 | 16 + ~90 + 16 + 468 + 16 = **606** | 520 de alto | **980 de ancho y 620 de alto** | 14 px |
| ×4 | 1200 × 612 | 16 + ~90 + 16 + 612 + 16 = **750** | 660 de alto | **1220 de ancho y 760 de alto** | 10 px |

**Con el ajuste de `§5.3` (aire de 24) la cuenta de la tabla suma 8 más: 614 y 758 con el
~90 de la cota.** Medido (hilo principal, 2026-10-02): en 980 × 620 el mueble termina en 576
(568 antes del ajuste) y en 1220 × 760 en 700 (692 antes). O sea que sobran **44 px** de
ventana bajo el mueble en el piso de ×3 y **60** en el de ×4, contra los 14 y 10 que daba la
cuenta con la cota alta; sin la sangría de abajo (16) quedan 28 y 44.

Los de ancho tienen 20 px de margen (980 contra 960 y 1220 contra 1200). Los de alto son los
que cambiaron. La regla de `UX-28` §5, "la escala sube por enteros mientras entre", sigue,
con una aclaración que ahora está escrita: **"mientras entre" cuenta el marco, la cabecera y
el aire**, no el marco solo.

### 5.5 Lo medido (`teclasFuera` en cero)

| Ventana | Escala | Cabecera |
|---|---|---|
| 1024 × 640 | ×3 | acostada |
| 1280 × 720 | ×3 | acostada |
| 1366 × 768 | ×4 | acostada |
| 1440 × 900 | ×4 | acostada |
| 1920 × 1080 | ×4 | acostada |
| 812 × 600 | ×2 | acostada (antes dejaba las teclas afuera) |
| 768 × 1024 | ×2 | apilada de siempre |

El traspaso no traía el borde de abajo de la última tecla de esa pasada, solo que
`teclasFuera` dio cero, ni los dos tamaños que fallaban antes ni los pisos de los cortes.
**Esa segunda pasada la midió el hilo principal el 2026-10-02**, todas sin teclas afuera:

| Ventana | Escala | Lo medido |
|---|---|---|
| 980 × 620 (piso de ×3) | ×3 | el mueble termina en 568, y en 576 con el ajuste de `§5.3` |
| 1220 × 760 (piso de ×4) | ×4 | el mueble termina en 692, y en 700 con el ajuste |
| 1024 × 600 (fallaba: 6 teclas fuera) | ×2 | cae a ×2 por el corte, como decía la cuenta |
| 1280 × 800 (fallaba: 4 teclas fuera) | ×4 | sin teclas afuera |
| 1366 × 657 | ×3 | sin teclas afuera |
| 979 × 620 (un ancho menos que el piso de ×3) | ×2 | el mueble termina en 434; 0 teclas afuera |
| 1219 × 760 (un ancho menos que el piso de ×4) | ×3 | el mueble termina en 576; 0 teclas afuera |

### 5.6 Lo que no cambia

El teléfono (`UX-28` §2.3–§2.6) y sus cinco medidas de `§2.5`; las columnas de mando, que
siguen en pantalla porque una pantalla táctil grande existe; el teclado de `D-53`, que espeja
las teclas en vez de reemplazarlas; la pantalla completa (`UX-33`). Y el título de Skayboy
también deja la negrita falsa.

---

## 6. Lo que no me cierra, y qué cambiaría

Está construido, no cerrado. Cinco puntos que cambiaría, de más a menos peso (`§6.1` a
`§6.5`), y uno (`§6.6`) con lo que mantengo aunque pese. Ninguno trababa el ciclo.

> **Los cinco quedaron APLICADOS el 2026-10-02.** El hilo principal los aplicó y los midió;
> cada subsección lleva su marca y su medida. El texto original de cada una se conserva sin
> tocar, como registro de por qué se cambió y de qué se esperaba. Los ítems que `§7` había
> dejado "por medir" los midió después el hilo principal (Chrome sin cabeza por CDP sobre
> `astro dev`, 2026-10-02) y están cerrados en `§7`; queda en pie `§6.6` (lo que mantengo) y
> una confirmación en un portátil real (`§7.7`).

### 6.1 La columna pegada tiene que caber o desplazarse por dentro, y el renglón táctil no llega a 48

> **APLICADO 2026-10-02.** `.caratula` tiene `max-height: calc(100svh - 2 * var(--espacio-3))`,
> `overflow-y: auto` y `overscroll-behavior: contain`. La pieza bajó a 8,5 rem (9,5 el recorte)
> y el frente tiene `--espacio-2` de relleno arriba. Con `(pointer: coarse)` desde 64 rem los
> renglones tienen `min-height: var(--toque-min)`. **Medido (hilo principal):** a 1366 × 768 la
> carátula mide **720** y su contenido **772**, así que se desplaza por dentro; esos 772
> confirman el primer punto de abajo, porque aun con la pieza más chica la columna no cabe en
> una ventana de 768. A 1024 × 768 táctil cada renglón mide **51 px** (≥ 48). Es la primera
> opción de "Qué cambiaría", no la alternativa.

**Lo construido.** La carátula queda pegada a `--espacio-3` del borde. La pieza a 9,5 rem es,
según `juego.css`, "el techo de alto que deja la carátula entera dentro de una ventana de
768 px de alto con la lista abierta". Los renglones de la lista aparecen desde 64 rem sin
mirar el puntero.

**Qué no me cierra, dos cosas.**

- **El alto.** 768 es el alto de la *ventana*. En un portátil de 768 de pantalla la ventana
  mide menos, y un elemento pegado que no cabe no se desplaza solo: los renglones del fondo
  (el lado B) quedan **inalcanzables con el mouse** hasta el final de la página. Por medir: el
  alto real de `.caratula` con la lista abierta (`§7.3`).
- **El toque.** El renglón mide ~28 px (cuenta: 0,88 rem × 1,3 de interlínea + 6 de relleno
  + 4 de borde). Un iPad apaisado mide 1024 de ancho, cruza el corte de 64 rem y es táctil.
  `UX-10` §3.1 ya lo dejó escrito: *ancho de ventana no es lo mismo que hay mouse*, y
  `--toque-min` es un piso. El comentario de `juego.css` ("con mouse no hace falta el pulgar de
  48 px") solo es cierto bajo `(pointer: fine)`, y el CSS no lo condiciona.

**Qué cambiaría.** Que la columna pegada no pase del alto de la ventana menos dos
`--espacio-3` y se desplace por dentro (sin arrastrar la página), y que con `(pointer:
coarse)` cada renglón llegue a `--toque-min`. El costo honesto de once salidas a 48 px es que
la lista se desplace dentro de su columna. Alternativa, si no gusta: dejar la lista solo con
`(pointer: fine)`; el jugador táctil conserva el camino de siempre, que no cambió.
**Quién:** hilo principal, en `juego.css`.

### 6.2 La carátula va primera en el documento: once paradas de tabulación antes del juego

> **APLICADO 2026-10-02.** La carátula es el **último** hijo de `main` en las ocho páginas, y
> `caratula.test.ts` lo exige (cambió la aserción: ya no "primera en main" sino "último hijo").
> La grilla la sigue poniendo a la izquierda. **Medido a 1440 (hilo principal):** la primera
> parada de tabulación es "← AL ARCADE", la segunda "JUGÁ", y después la lista. El lector de
> pantalla encuentra el juego antes que la lista.

**Lo construido.** La carátula es el primer hijo de `main` (y el test lo exige). Desde 64 rem
la lista es visible en la portada y en el resultado, así que con el teclado hay 11 enlaces
antes de llegar al botón de la hoja. El lector de pantalla encuentra también la lista antes
que el juego.

**Qué no me cierra.** `UX-10` dejó el teclado afuera de aquel ciclo, pero la lista es una
navegación nueva y trae un problema nuevo. Nada del CSS que leí depende de que la carátula sea
la primera: la grilla la ubica por columna y fila explícitas, el selector que la esconde en el
teléfono mira a un hijo directo sin orden, y en el teléfono es absoluta.

**Qué cambiaría.** Que la carátula sea el **último** hijo de `main`: el orden de lectura y de
tabulación pasa a ser el juego primero y la lista después, y a la vista no cambia nada. Exige
cambiar la aserción de `caratula.test.ts` ("primera en main" por "hija directa de main").
Antes de moverla, el hilo principal confirma que ninguna regla ni ningún script de las islas
dependa del orden (no leí los scripts). **Quién:** hilo principal.

### 6.3 Skayboy: dos márgenes finos, y los tamaños que fallaban no se volvieron a medir

> **APLICADO 2026-10-02: medido, y sin cambiar los cortes.** El hilo principal midió los pisos
> y los tamaños que fallaban antes, todos sin teclas afuera: 980 × 620 (×3, el mueble termina
> en 568, y en 576 con el ajuste de abajo), 1220 × 760 (×4, 692 y 700), 1024 × 600 (×2),
> 1280 × 800 (×4) y 1366 × 657 (×3), un alto de ventana de portátil. Los cortes de 620 y 760 se
> quedan. Los márgenes eran más holgados que los 14 y 10 px de la cuenta (`§5.4`). Además, por
> `REV-18` `FIND-99`, el `.fichin` de la cabecera acostada subió de 16 a 24 px de margen
> (`§5.3`).

**Lo construido.** Los cortes de 620 y 760 dejan **14 y 10 px** de margen sobre la cuenta, y
la cuenta usa un ~90 de cabecera que el traspaso no desglosa. Se midió a siete tamaños, todos
holgados.

**Qué no me cierra.**

- Los pisos exactos (980 × 620 y 1220 × 760) no figuran medidos. A 980 la cabecera tiene
  menos ancho, y si la bajada parte en dos renglones suma ~20 px (cuenta: 0,92 rem × 1,35), que
  es más que cualquiera de los dos márgenes.
- Los tamaños del traspaso son *ventana*. Una ventana de portátil, con las barras del
  navegador, mide menos de alto que su pantalla: 1366 × 768 de pantalla no es 1366 × 768 de
  ventana. No está medido qué escala toca ahí.

**Qué cambiaría.** Nada hasta medir (`§7.7`). Si en un piso las teclas quedan fuera, subir
ese corte lo que falte, con la regla de que el corte es la cuenta de `§5.4` más una holgura
de un renglón de bajada. **Quién:** hilo principal mide, `experiencia` ajusta la cifra.

### 6.4 El botón de arranque dejó de ir pegado al pie, y nadie midió que entre

> **APLICADO 2026-10-02, por la vía de "bajar lo que lo empuja".** La mesa pasó de
> `padding-block: var(--espacio-4) var(--espacio-3)` a `var(--espacio-3)`, y el `h1` de la hoja
> de `margin-top: var(--espacio-2)` a `var(--espacio-1)`. **Medido (hilo principal):** el
> "Empezá" de "Adiviná el tema" termina en **652** a 1366 × 657 (antes 676), o sea que entra,
> pero a 5 px del borde (cuenta: 657 − 652): sin holgura. **Las otras siete portadas, medidas
> después a 1366 × 657:** el botón termina en 356 (preguntas), 340 (dos ejes), 420 (sacalo por
> la letra), 320 (completá la letra), 296 (ponelos en fila), 312 (adiviná la tapa) y 358 (más
> o menos); las ocho entran, y las siete sobran por 299 px o más (cuenta: 657 − 358). Solo
> "Adiviná el tema" va justo (`§7.8`).

**Lo construido.** En la mesa el arranque va en el flujo y transparente (`§4.6`). La razón es
buena: pegado abajo era una franja de tinta plana tapando la foto de fondo.

**Qué no me cierra.** Lo que sostenía el punto de `UX-01` "nada de scroll para encontrar el
botón de jugar" era justamente el pegado. Ahora lo tiene que sostener la medida, y el
traspaso no dice que se haya contado el botón de cada portada a 1366 × 768 de ventana
(`D-54` afirma que "todo entra").

**Qué cambiaría.** Nada hasta medir (`§7.8`). Si en alguna portada el botón cae bajo el pliegue
con la ventana de un portátil, volver a pegarlo con una franja del alto del botón y no de toda
la hoja, o bajar lo que lo empuja. **Quién:** hilo principal.

### 6.5 El rótulo de la lista dice "otros" y la lista trae todos

> **APLICADO 2026-10-02.** `CARATULA.lista` dice **"Los casetes"**. El lector de pantalla ya no
> anuncia "otros" sobre una lista que incluye el casete abierto.

`CARATULA.lista` es "Los otros casetes", y la lista incluye el casete de la propia página
(con `aria-current`). El lector de pantalla anuncia "otros" y después nombra el que está
abierto. El registro 3 dice qué hay, y acá dice una cosa y trae otra. Cambiaría a "Los
casetes" (o "Los casetes del arcade"). **Quién:** `contenido`: la cadena es suya.

Y una nota de vocabulario: los traspasos llaman a la lista "lista de temas", pero en este
sitio *tema* es una canción. En esta hoja es **la lista de la carátula** y ningún texto
visible dice "temas".

### 6.6 Lo que mantengo aunque pese

- **La mesa no crece a 1920.** Mide ~976 px y deja ~472 de tinta por lado (cuenta). Se ve igual
  a 1600 y a 1920. Es el mismo argumento de `UX-10` §3.1 (la hoja no crece por llenar, la
  letra de juego no es de televisor), y además la foto de fondo es de 591 px como mucho y
  `--aire-mesa` tiene techo a propósito. Si el usuario quiere llenar más, el candidato es una
  segunda columna con algo que mostrar, no ensanchar la hoja.
- **La calcomanía del teléfono no se toca.** Parece un adhesivo y alguien va a tocarla. Es a
  propósito: el único destino sensato es el portal, y "← AL ARCADE" ya lo es. Si en una prueba
  con gente la tocan seguido, es la señal para hacerla enlace, y no antes.
- **38 rem contra los 34 de `UX-10` §2.3** es un cambio de cifra con el criterio intacto, y lo
  dejo dicho en `§4.4` y en la enmienda de esa hoja.

---

## 7. Checklist de verificación (la corre quien implemente o `revisor` — `D-12`)

Dos clases de ítem: lo **medido** trae su número del traspaso o de la medición del hilo
principal del 2026-10-02, y lo que es **por medir** lo dice. Los tamaños son de *ventana*, con
las barras del navegador puestas, que es lo que ve la gente, salvo donde diga otra cosa.

**El método de medida (`REV-18` `FIND-110`).** Las piezas, los casetes, el frente de la carátula
y los renglones de la lista están torcidos a propósito, y `getBoundingClientRect()` mide la
caja del giro: da más que el lado (46,96 contra 44 en la calcomanía del teléfono; 89 contra 84
en el casete del portal a 80 rem). Para el lado de una pieza torcida se usa `offsetWidth`,
`offsetHeight` u `offsetTop`, que no cuentan la rotación; si no, hay que aclarar "sin contar la
rotación". Es un error mío de la primera versión de esta hoja, que pedía `getBoundingClientRect()`
en esos lugares.

### 7.0 Comandos

```
rg -n "^# UX-35" Docs/UX/
node --test src/lib/sitio/caratula.test.ts
node --test src/lib/contraste.test.ts
node --test src/lib/estilos.test.ts
node --test src/lib/voz.test.ts
npm test
```

- [ ] `npm test` en verde. Antes del ciclo daba 1387/1387; el número de ahora lo da la corrida.
- [ ] `caratula.test.ts`: pista, pieza y disco iguales al portal; una sola marcada en la lista;
      un juego fuera del portal tira; la bajada partida se vuelve a armar letra por letra; la
      carátula es el **último** hijo de `main` en las ocho páginas (`§6.2`); `juego.css` nombra
      las cuatro zonas de juego y toda sección que no sea la primera ni `resultado` queda
      cubierta (`§3.4`); "Adiviná la tapa" pasa `piezaSopla` (`§3.3`).

### 7.1 El portal

- [ ] 375 × 812: una columna, casetes solapados, sin cambios respecto de antes (`UX-25`).
- [ ] 768 × 1024 (48 rem): dos columnas; A1 a A8 en cuatro renglones; **A9 centrado** con el
      ancho de los demás; en cada renglón, los dos casetes con el mismo `offsetTop` y el mismo
      `offsetHeight` (con `getBoundingClientRect()` la rotación los desparejaría). (En el ciclo
      16 las columnas arrancaban con 8 px de diferencia.)
- [ ] 1024 × 768 (64 rem): tres por tres; lado B con dos casetes del mismo ancho, centrado;
      pieza de 64 px (`offsetWidth` de `.casete-arte`); la bajada es la primera oración sola.
- [ ] 1280 × 800 (80 rem): pieza de 84 px (`offsetWidth`: con `getBoundingClientRect().width`
      da 89 por la rotación); `.casete-baja-resto` visible; bajada entera.
- [ ] 1440 × 900: el portal mide 1216 px (`--ancho-mesa`). Cuenta: 112 px de tinta por lado, no
      los ~350 de antes.
- [ ] Fuera de octubre (`data-mes` distinto de `oktubre`), el frente queda en una columna.
- [ ] En ningún ancho hay desplazamiento horizontal:
      `document.documentElement.scrollWidth <= window.innerWidth`.
- [ ] La figura del recorte de portada, que sube a 150–196 px desde 64 rem, sigue acreditada a
      Rocambole sin nombrar álbum (la ficha pedida en
      `HILO-para-investigador-figura-encadenada.md`).

### 7.2 La carátula en el teléfono (375 × 812 y 320 de ancho)

- [ ] En la portada de los ocho juegos con carátula: la calcomanía. Medición:
      `document.querySelector('.caratula-arte').offsetWidth` da **44** (con
      `getBoundingClientRect().width` da 46,96 por la rotación), y el número ("A1" a "A8") es el
      del casete en el portal.
- [ ] No tapa "← AL ARCADE" ni el título, a 375 y a 320.
- [ ] Al arrancar la partida desaparece, y tampoco está en el resultado.
- [ ] No intercepta el toque (`pointer-events: none`).
- [ ] `.caratula-lista` tiene `display: none` y ningún enlace de la carátula recibe foco con
      Tab.

### 7.3 La carátula en la computadora (1440 × 900, 1366 × 768, 1280 × 800, 1024 × 768)

- [ ] `.caratula.offsetWidth` es 304 px; la hoja, 608 como mucho (832 en "Ponelos en fila",
      solo desde 80 rem; de 64 a 80 rem también 608: medido a 1100 × 800, `§4.5`).
- [ ] Pegada: con la página desplazada, el `top` de `.caratula` es 24 px (`--espacio-3`).
- [ ] La lista está en la portada y en el resultado, y tiene `display: none` con `#partida`,
      `#pregunta`, `#tablero` o `#eleccion` a la vista (este último, el paso de "Ponelos en
      fila" después de "Empezá"). Probado **a mano en los ocho**: el test cubre los nombres, no
      que la isla lo muestre.
- [ ] En "Adiviná la tapa", con `#partida` a la vista, la pieza de la carátula no se ve y queda
      la etiqueta con el nombre; en la portada y en el resultado, la pieza está (`§3.3`).
- [ ] Una sola marca visible:
      `[...document.querySelectorAll('.marca, .caratula-marca')].filter(e => e.offsetParent !== null).length`
      da 1.
- [ ] Hay un solo `.caratula-tema--actual`, con `aria-current="page"`, borde y letra plena.
- [ ] El alto de la columna con la lista abierta: `document.querySelector('.caratula').offsetHeight`
      no pasa del alto de la ventana menos 48, y si el contenido es más alto
      (`scrollHeight`), se desplaza por dentro. **Medido (hilo principal)** a 1366 × 768:
      `offsetHeight` 720, `scrollHeight` 772. **Medido** también en la carátula de "dos
      ejes" a 1024 × 768: mide 720 (termina en 728) y su contenido 788, así que se desplaza por
      dentro (`§6.1`).
- [ ] El alto de cada renglón,
      `[...document.querySelectorAll('.caratula-tema')].map(a => a.offsetHeight)`. La cuenta
      daba ~28 px sin la corrección; con `(pointer: coarse)` tiene que dar ≥ 48. **Medido
      (hilo principal)** a 1024 × 768 táctil: 51 px (`§6.1`).
- [ ] El orden de tabulación desde el comienzo de la página. **Medido a 1440 (hilo
      principal):** "← AL ARCADE", "JUGÁ", y después la lista (`§6.2`).
- [ ] Con mouse, pasar por un renglón cambia color y borde; con puntero táctil no hay cambio.
- [ ] El pie acredita el disco de la pieza de la carátula una sola vez.

### 7.4 Título y botón

- [ ] En los ocho, `getComputedStyle(h1)` da familia Archivo Black, `font-weight` **400** y
      mayúsculas. Tamaño: 26,4 px a 375 (cuenta) y 41,6 px desde 64 rem.
- [ ] Color del título = la tinta de la columna "Tinta del título" de `§4.1`.
- [ ] Ningún título pasa de dos renglones a 2,6 rem en la hoja de 38 rem. **Medido (hilo
      principal)** a 1366 × 657: dos renglones en "Preguntas ricoteras" y en "¿Qué tipo de
      ricotero sos?", uno en los otros seis.
- [ ] `.primario` de los ocho: fondo = su `--tinte-accion`; `box-shadow` de 4 px abajo; al
      apretar, se hunde 3 px y el canto queda en 1.
- [ ] "Compartí" sigue en *Gulp!* en los ocho.
- [ ] `contraste.test.ts`: cinco pares de botón (dos ejes, completá la letra, adiviná la tapa,
      adiviná el tema, más o menos) y tres de título sobre tapa velada a 3:1 (Lobo suelto,
      Último bondi, La mosca y la sopa).
- [ ] `estilos.test.ts`: el título pide la rotulada en peso normal y ninguna página reescribe
      el `h1`.
- [ ] `voz.test.ts`: ningún título de más de ocho palabras, ningún botón en infinitivo.

### 7.5 "Ponelos en fila"

- [ ] 1440 × 900 y 1280 × 800: filas y bandeja lado a lado; la bandeja mide entre 240 y 288 px
      de ancho y queda pegada a 3,5 rem; con una ficha en la mano se ven la mano, la bandeja y
      al menos una fila.
- [ ] 1024 × 768: una columna, sin desplazamiento horizontal, con las cuatro `.fila`.
- [ ] De 64 a 80 rem la hoja usa `--ancho-tablero` (38 rem), no `--ancho-tablero-amplio`.
      **Medido (hilo principal)** a 1100 × 800: 608 px (`§4.5`, `FIND-106`). Desde 80 rem, 832.
- [ ] El orden del documento es el del teléfono.
- [ ] La elección de conjuntos: dos columnas a 768 y a 1024, tres a 1280.

### 7.6 "Sacalo por la letra" (1440 × 900)

- [ ] El hueco entre el último verso y la caja de escribir ya no es de ~400 px (la medida del
      traspaso). **Medido (hilo principal)** a 1440 × 900: **32 px** entre la hoja de versos y
      el buscador.
- [ ] A 375 × 812 el buscador sigue anclado al pie.

### 7.7 Skayboy

- [ ] `teclasFuera` = 0 en los siete tamaños medidos: 1024 × 640 (×3), 1280 × 720 (×3),
      1366 × 768 (×4), 1440 × 900 (×4), 1920 × 1080 (×4), 812 × 600 (×2), 768 × 1024 (×2 con
      la cabecera apilada). Con el fragmento de medición que dejó `T-271` en su reporte.
- [ ] Los que fallaban antes. **Medido (hilo principal, 2026-10-02):** 1024 × 600 (×2) y
      1280 × 800 (×4), sin teclas afuera.
- [ ] Los pisos (`§6.3`). **Medido:** 980 × 620 (×3, el mueble termina en 576) y 1220 × 760 (×4,
      700), sin teclas afuera. Un ancho por debajo de cada piso, **medido**: 979 × 620 baja a
      ×2 (el mueble termina en 434) y 1219 × 760 baja a ×3 (termina en 576), los dos con 0
      teclas afuera: la escala baja un escalón y no se rompe.
- [ ] La bajada se lee completa y el sello de pantalla completa no la tapa, a 1024 × 640 y a
      720 × 600 (`REV-18` `FIND-99`, `§5.3`): la última palabra, a la vista.
- [ ] Las cinco medidas de `UX-28` §2.5 (812 × 375, 812 × 354, 375 × 812, 667 × 375, 375 × 667)
      siguen en cero.
- [ ] Qué escala toca en una ventana de portátil real de 768 de pantalla. **Medido** a
      1366 × 657, un alto de ventana de portátil: ×3, sin teclas afuera (`§6.3`). Falta
      confirmarlo en un portátil real, con sus barras.

### 7.8 Accesibilidad y primera pantalla sin muro

- [ ] Ningún estado se comunica solo con color: la lista marca el juego con borde, letra y
      `aria-current`.
- [ ] Foco visible (`:focus-visible` de `tokens.css`) en cada renglón de la lista.
- [ ] El botón principal de la portada de los ocho está a la vista sin desplazar, a 1366 × 657
      de ventana (`§6.4`: el arranque ya no va pegado al pie). **Medido (hilo principal)**, el
      borde de abajo del botón: preguntas 356, dos ejes 340, adiviná el tema 652, sacalo por la
      letra 420, completá la letra 320, ponelos en fila 296, adiviná la tapa 312, más o menos
      358. Las ocho entran; "Adiviná el tema" a 5 px del borde y las demás con 299 o más.
- [ ] En el resultado, el botón de compartir sigue siendo la pieza de más peso de la hoja; la
      lista es tenue y chica.
- [ ] Cero campos y cero permisos antes de jugar, y un solo toque entre el portal y la
      primera partida: la carátula no suma ningún paso.
- [ ] La lista no está mientras se responde: nunca hay un enlace de salida a la vista en
      plena partida, incluido el paso `#eleccion` de "Ponelos en fila" (`§3.4`).
- [ ] La pieza de la carátula de "Adiviná la tapa" no se ve en partida (`§3.3`, `FIND-100`).
- [ ] En un teléfono real, nada cambió salvo la calcomanía, el título y el botón (`D-54`,
      consecuencias).

---

## 8. Lo que queda abierto

- **La hoja 15 del lienzo.** Está escrita (`Docs/SUGERENCIAS/lienzo-hoja-15-la-mesa.dc.html`)
  y falta pegarla: republicar el lienzo entero lo decide el usuario (`T-319`). El circuito de
  `diseno-marca.md` quedó **al revés** esta vez —las cinco medidas entraron a `tokens.css`
  antes que al diseño—, y `D-54` lo deja dicho. Mientras la hoja no se pegue, `tokens.css` y
  esta hoja son la referencia.
- **El décimo juego.** El tres por tres es de nueve. Con diez, el reparto de 64 rem deja uno
  solo en el renglón de abajo, y con once, dos. Cuando entre el décimo, hay que extender a tres
  columnas la regla de `§2.3` (centrar el último del renglón). La carátula y su lista salen de
  `JUEGOS` y lo toman solas.
- **Atajos de teclado** en los juegos de cuatro opciones (`ORQ` §3): idea guardada, no pedida.
- **Páginas de lectura** (Redondopedia, letras y acordes): `UX-10` §2.1 y §2.2 intactos.
