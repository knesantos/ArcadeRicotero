# REV-19 — "¿Qué tipo de ricotero sos?" rehecho (`D-57`), verificado contra sus criterios

> Revisado el **2026-10-04** por **el hilo principal, no por `revisor`**. La revisión estaba
> armada para cuatro lentes de `revisor` con contexto fresco y un verificador adversarial por
> lente; el cupo de subagentes se agotó hasta el 8 de octubre y ninguna llegó a correr. Lo de
> abajo lo hizo quien construyó la pieza: **no es una revisión independiente**, y por eso cada
> hallazgo trae una evidencia que se puede volver a correr y la lista de lo que se descartó dice
> por qué. **Queda pedida una relectura de `revisor`** cuando haya cupo (`FIND-117`).
>
> **Qué se verificó:** `D-57` con sus siete enmiendas, `US-06` y su enmienda, `BR-17`, `BR-36`,
> `BR-37`, `CTR-08` v2 (con su enmienda 1), `ADR-02` v2, `UX-36` (§3 a §8 y el checklist del §12),
> `CNT-29`, `CNT-30`, `CNT-01`, `voz-ricotera.md`, `diseno-marca.md` y `codigo-juegos.md`. Cuatro
> lentes: el banco y la voz; la pantalla; el código, la accesibilidad y compartir; la coherencia
> de los papeles.
>
> **Sobre la base:** rama `ciclo-18/que-ricotero-sos`, sobre `main` en `bc27cd4`. Lo medido en el
> navegador es el build de producción servido con `astro preview`, no el servidor de desarrollo.

## Lo que pasó

- **`node --test 'src/**/*.test.ts'`: 1466 de 1466.** (`npm test`, que corre un subconjunto: 325
  de 325.)
- **`npm run check`: 0 errores, 0 avisos, 14 hints.** Las dos clases de siempre.
- **`npm run build`: 160 páginas** (156 + las cuatro postales).
- **El validador del instanciador** (`../InstanciadorProyectos/scripts/validar_instancia.py`) no
  está en este contenedor: no se corrió.
- **En el navegador** (Chromium sin cabeza, Playwright), con el build:
  - **El toque:** tres toques seguidos en la hoja 1 (la opción, el mismo lugar, la otra opción)
    contestan **una** pregunta (folio "2 de 10"). Durante la pausa las dos opciones quedan con
    `aria-disabled="true"`, ninguna `disabled`, la elegida con `aria-pressed="true"` y **el foco
    sigue en ella**. Retroceso durante la pausa no vuelve; sin pausa vuelve y la de antes queda
    marcada.
  - **El teclado:** la tecla 1 sostenida un segundo (25 `keydown` con `repeat`) contesta una sola
    hoja; el 2 contesta; la leyenda se ve con mouse. Tabulación en una hoja: opción 1 → opción 2
    → "Volvé a la anterior" → el pie. En la hoja 1 no hay "Volvé a la anterior".
  - **La región viva:** existe vacía antes de empezar, dice "La previa. Pregunta 1 de 10." en la
    hoja 1 y calla al resultado. El foco cae en el enunciado en cada hoja y en el nombre al
    terminar.
  - **`BR-37`:** tres noches seguidas con "Empezá otra noche": 30 escenas, 30 distintas. El foco
    vuelve al enunciado de la hoja 1.
  - **Compartir**, con `navigator` sustituido en cada caso: con archivos sale la tarjeta
    (`cu-3-dos-ejes.png`, `image/png`, 99 808 bytes), el texto y la postal; sin archivos, texto y
    postal; sin `share`, copia texto y enlace y dice "Se copió el enlace."; sin `share` ni
    portapapeles, queda el campo "Copiá esto y mandalo" con texto y enlace; **al cancelar
    (`AbortError`) no copia ni avisa nada**; con la tarjeta bloqueada (sin red) comparte texto y
    postal y el resultado no se rompe.
  - **Movimiento reducido:** `--pausa-eleccion` sigue en 600 ms (a los 300 ms del toque la hoja
    no cambió) y `--duracion-paso` va a 0.
  - **Enlaces raros:** `r=CU-9`, `g=quiz&r=CU-2` y `r=<b>x</b>` abren la portada normal, sin
    error; la postal `cu-1/?g=dos-ejes&r=CU-3` es la de `CU-1` (la ruta manda, `ADR-02` punto 5).
  - **Alturas** (`getBoundingClientRect().bottom` del botón; `offsetHeight` de la tapa):

    | Ventana | Portada | Postales (`cu-1`/`cu-3` · `cu-2`/`cu-4`) | Resultado (Compartí · Empezá otra noche) |
    |---|---|---|---|
    | 375 × 667 | 590 | 626 · 650 | 538 · 611 |
    | 360 × 640 | 588 | 641 · 665 | 562 · 635 |
    | 320 × 568 | **633 → 565** (`FIND-111`) | 642 · 658 | 562 · 635 |
    | 1366 × 657 (mesa) | 514 | 563 · 563 | 506 · 579 |

    Sin desplazamiento horizontal en ninguna. Letra mínima en el resultado: 12 px. La grilla va
    en dos columnas a 360 y en una a 320.
  - **Lo que baja cada pantalla:** la portada pide `libro-marmol.jpg`, `libro-lomo.jpg` y
    `libro-esquinero.png` (15,8 KB entre las tres); ninguna página pide `libro-franja.jpg`.
  - **Las postales:** `og:image` absoluta por identidad y `og:image:alt` con el crédito (sin "en
    baja"). El pie acredita *Luzbelito* una vez por pantalla.
- **Las tarjetas** (leídas a ojo en PNG): las cuatro con la hoja de 769 px, el nombre en
  renglones parejos, nada fuera del papel; las vistas previas con la marca en la franja oscura y
  la línea que nombra debajo del sello; la de la portada con los nombres en orden alfabético.

## Hallazgos

### `FIND-111` — A 320 × 568 el botón de arranque quedaba bajo el pliegue · **media** · cerrado

- **Criterio:** `UX-01` ("nada de scroll para encontrar el botón") y `UX-36` §3.4; `REV-18` dejó
  320 × 568 entre los tamaños que se miden.
- **Evidencia:** "Empezá la noche" terminaba en **633** a 320 × 568. Los otros siete juegos, en
  la misma ventana: entre 409 y 514. Era la única portada de los ocho con el arranque afuera; lo
  que la empujaba era la tapa (175 px, con el índice en tres renglones).
- **Dueño:** hilo principal (código) y `experiencia` (`UX-36`).
- **Cierre:** bajo 22 rem la tapa se aprieta (margen, relleno, etiqueta, esquinero y el índice a
  0,9 rem, que entra en dos renglones). Ahora termina en **565**; a 375 × 667 no cambió nada (590).
  Lo que `UX-36` tiene que sumar está en `FIND-118`.

### `FIND-112` — En la mesa, el rótulo "OSCURIDAD" se metía en la celda de al lado · **media** · cerrado

- **Criterio:** `UX-36` §5.3 (rótulos de renglón al margen desde 46 rem) y §6.5 guarda 1 por
  analogía: ninguna línea sale de su lugar.
- **Evidencia:** captura del resultado a 1440 × 900: "OSCURIDAD" (rotulada a 0,75 rem, ≈ 100 px)
  en una columna de 5 rem (80 px) llegaba al borde de la celda.
- **Dueño:** hilo principal y `experiencia`.
- **Cierre:** la columna pasa a 7 rem. Medido a 736, 1024 y 1440: los dos rótulos con
  `scrollWidth` igual a `clientWidth` (112).

### `FIND-113` — `EJ-054`: *Dejo una nota para alguien*, de noche y en una casa en silencio · **media** · cerrado

- **Criterio:** `BR-36` veto 2 (lo que evoca una muerte o una despedida, no solo lo que la nombra)
  y `D-57` punto 9 (a cuatro meses del 5 de junio, "esta noche" se lee como un velorio aunque
  ningún texto lo diga).
- **Evidencia:** *Llegás y la casa está en silencio.* / *Dejo una nota para alguien.* — "dejó una
  nota" es la fórmula de la noticia de una despedida. Ninguna de las cuatro vueltas de lectura lo
  marcó.
- **Dueño:** `contenido`.
- **Cierre:** la luz pasa a *Aviso que llegué* (el gesto de cuidado de todas las noches, de cerca
  o por mensaje, sin parentesco). Está en la `notaInterna` y en `CNT-30` §13. `contenido` lo
  revisa cuando vuelva.

### `FIND-114` — `EJ-036` y `EJ-053` repetían *a quien quiero*, las dos en luz · **baja** · cerrado

- **Criterio:** `BR-17` (ninguna opción se reconoce como la de un polo) y `CNT-30` §2 (la firma
  de un polo). La guarda pide tres repeticiones; con dos, en una partida de cinco luces, la
  fórmula ya se aprende en la segunda noche.
- **Evidencia:** *La mando a quien quiero* (`EJ-036`) y *Le cuento a quien quiero* (`EJ-053`).
- **Dueño:** `contenido`.
- **Cierre:** `EJ-053` pasa a *Se lo cuento a alguien*. `contenido` lo revisa cuando vuelva.

### `FIND-115` — La carátula y el pie de este juego siguen con el medallón de la vela · **media** · abierto, del usuario

- **Criterio:** `RES-168` (la figura sale de la foto de una persona esclavizada: se trata en
  registro 3, "nunca como pieza ni mascota") y `D-57` punto 9 (velas).
- **Evidencia:** `dist/juegos/dos-ejes/index.html` carga `/arte/luzbelito-vela.png` en la carátula
  (`caratula-arte`) y en el pie (`figura-pie`). En la mesa el medallón convive con el libro nuevo
  en la misma pantalla.
- **Dueño:** usuario. `D-57` punto 9 lo dejó **a propósito** fuera de este ciclo: toca el casete
  A2 del portal (`UX-25`), la carátula (`UX-35`) y el pie (`D-51`, `D-54`).
- **Propuesta:** la de `UX-36` §11.1 — que el casete A2 y su carátula vistan la tira del libro
  (mármol, lomo y esquinero) y la vela quede, si queda, solo en el pie. No se hace sin pedido.

### `FIND-116` — Los cuatro costos de las bajadas no pesan lo mismo · **baja** · abierto

- **Criterio:** `D-57` punto 4 y `BR-17` (las cuatro maneras con el mismo orgullo y los costos con
  la misma forma).
- **Evidencia:** la forma es la misma ("Pero cuando alguien…, a vos te toca…"), el peso no:
  *rearmar la mesa* (`CU-1`) es trabajo para otros; *averiguarlo en el celular* (`CU-4`) es un
  trámite de segundos y vuelve a suponer un teléfono. `CNT-30` §9 ya lo deja como pregunta.
- **Dueño:** `contenido`.
- **Propuesta:** que el costo de `CU-4` sea un roce del mismo tamaño que el de `CU-1` y no pase
  por el teléfono.

### `FIND-117` — El banco final y esta revisión los cerró quien no es su dueño · **media** · abierto

- **Criterio:** `CLAUDE.md` §3 (cada rol escribe en su carpeta) y `D-57`, consecuencias (`REV-19`
  la hace `revisor` con contexto fresco).
- **Evidencia:** la vuelta 4 del banco la empezó `contenido` y se cortó por el cupo; la terminó el
  hilo principal (`EJ-041`, `EJ-047`, `EJ-052`, el crédito, `CNT-01` §H, `CNT-29` §4 y las tablas
  del §4 de `CNT-30`), y también escribió `EJ-053` y `EJ-054` por esta revisión. Cada cambio está
  marcado en su `notaInterna` y en `CNT-30` §13. Esta revisión tampoco es independiente.
- **Dueño:** `contenido` y `revisor`, cuando haya cupo.
- **Propuesta:** `contenido` relee los ítems marcados "hilo principal" y `revisor` relee esta
  revisión con contexto fresco, con el mismo encargo de `T-344`.

### `FIND-118` — Tres papeles no dicen lo que el código ya hace · **baja** · abierto

- **Criterio:** `CLAUDE.md` §5 (los papeles son la fuente para el que retoma).
- **Evidencia:** `UX-36` §3.4 y §5.3 no tienen el corte de 320 ni la columna de 7 rem
  (`FIND-111`, `FIND-112`); el estado de `ORQ-plan-ciclo-18.md` es el del armado; `ADR-02` v2,
  enmienda 2, dice que el punto 9 "sigue exigido" y ya se cumple.
- **Dueño:** `experiencia`, `orquestador`, `arquitectura`.
- **Propuesta:** escrita en
  `Docs/SUGERENCIAS/HILO-para-experiencia-orquestador-y-arquitectura-lo-que-dejo-REV-19.md`.

## Lo que se refutó

- **`EJ-050` *Elijo qué voy a contar* como "estar en otra cosa mientras suena".** La regla de la
  distracción (`D-57` enmienda 7) es de la luz; en orden-caos, armar lo que se va a contar es el
  polo de orden, y caos tiene su par con la misma forma (*Lo cuento de una*).
- **`EJ-046` *Lo tenía previsto* como "el que se las sabe todas".** Es el polo de orden dicho
  llano, frente a *Lo tomo como viene*; ninguno de los dos opina sobre el otro.
- **`EJ-049` *Grito con el resto* como capacidad del cuerpo.** `BR-36` veto 5 nombra pararse,
  saltar, correr, empujar y aguantar apretado; la voz no está. Queda para el oído de quien la juegue
  (abajo).
- **El botón de la postal a 360 × 640** (665): `UX-36` §3.4 lo acepta por escrito; a 375 × 667
  entra (650).
- **Que el destino de compartir descarte el enlace cuando va con archivo** (`UX-36` §6.1): no se
  reproduce con un `navigator` sustituido; es de un teléfono real.

## Lo que ninguna máquina ve (`UX-36` §12.6)

- Una noche entera, con cronómetro, de alguien que nunca vio el juego.
- Compartir con archivo en iOS y en Android: ¿llega el enlace junto con la tarjeta?
- La grilla, la tapa y la hoja a pleno sol: ¿se lee el sello? ¿se ve el canto?
- ¿Alguna de las cuatro maneras se lee más pobre, más triste o más sola? (`CNT-30` §9.)
- Con NVDA o JAWS en modo de lectura: ¿las teclas 1 y 2 siguen eligiendo, o se las queda el
  lector?
- `EJ-049`: ¿*Grito con el resto* se lee como algo que no todos pueden hacer?
