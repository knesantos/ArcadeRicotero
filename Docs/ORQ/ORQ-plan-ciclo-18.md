# ORQ — Plan del ciclo 18: la noche y el libro

> **Escrito por `orquestador`**, el 2026-10-04, sobre el pedido del usuario: *"Hacé un ciclo
> entero de mejora importante sobre el juego de qué tipo de ricotero sos, mejora artística, de
> preguntas, de resultado y de otras cosas que analices que se puedan mejorar."*
>
> Arranca sobre `main` en `bc27cd4`, en la rama `ciclo-18/que-ricotero-sos`. Sesión única.
> **El plan se corta con el ciclo andando:** la rama ya tenía seis commits (`2b1a123`..`576c049`:
> el rango, `D-57`, `D-58`, `CTR-08` v2, `US-06`/`BR-36`/`BR-37` y la primera versión del banco)
> y `contenido` tenía `CNT-29` y `CNT-30` sin commitear. Las tareas cortan lo que `D-57`
> reparte; la sección 3 dice dónde está cada una.
>
> **Consume:** `D-57` (entera), `D-58`, `US-06`, `BR-17`, `CTR-08`, `ADR-02`, `UX-06`, `UX-20`
> §2, `UX-22` §12.6, `CNT-09`, `CNT-26`, `REV-07`, `D-14`, `D-17`, `D-33`, `D-51` punto 6,
> `D-54`, `D-56`, `RES-150`..`RES-171` (`INV-150`), `.claude/rules/voz-ricotera.md`,
> `.claude/rules/diseno-marca.md` y el brief del relevamiento de siete lectores.
>
> **Rango** (`Docs/IDS.md`, fila del 2026-10-04): `T-331`..`T-350`, `D-57`, `D-58`, `BR-36`,
> `BR-37`, `CTR-08` v2, `UX-36`, `CNT-29`, `CNT-30`+, `RES-150`..`RES-171`, `REV-19`,
> `FIND-111`+. El plan usa `T-331`..`T-346`; `T-347`..`T-350` quedan para lo que `REV-19`
> obligue a sumar.

## 0. La idea del ciclo, en un párrafo

El test era una revista con título ricotero: veinte escenas de plantas, muebles y playas,
cuatro astros de horóscopo como resultado, un rombo gris que dejaba las dos caras de luz siempre
arriba, y un doble toque que contestaba la pregunta siguiente sin leerla. El ciclo no toca los
ejes ni la regla de oro —cuatro maneras, ninguna mejor, ningún número—: **cambia de qué está
hecha la partida y qué se lleva la gente al terminar.** La partida pasa a ser una noche de
recital sin dueño en cinco momentos (la previa, la ida, la vereda, adentro, la vuelta), un ítem
de cada eje por momento. El resultado deja de ser una esencia y pasa a ser "esta noche", con
cuatro maneras con nombre de cosa que se dicen con el mismo orgullo. La única pieza de arte es
el libro de *Luzbelito*, sin óvalo, sin figura y sin título, igual para las cuatro. Y compartir
lleva imagen y una postal por manera: el que llega sabe qué es X antes de jugar, y al terminar
se compara sin ganar ni perder.

## 1. Lo medido antes de cortar nada

Medido el 2026-10-04 sobre `bc27cd4` por los siete lectores del relevamiento.

| Qué | Cómo | Cuánto |
|---|---|---|
| El doble toque | a mano, 375 × 667 | el clic avanza en el mismo tick y las opciones nuevas caen en el mismo lugar: **un doble toque contesta la siguiente sin leerla**. No hay estado de "elegida" |
| El foco | teclado y árbol de accesibilidad | cae al `<body>` en cada pregunta y en el resultado; **ninguna** región viva |
| El banco | lectura de los 20 listos | **ni una escena del mundo ricotero** (asado, planta, mueble, playa); 7 ítems rotos (`EJ-002`, `EJ-004`, `EJ-010`, `EJ-015`, `EJ-022`, `EJ-023`, `EJ-024`); **11 de 20** cierran con "¿Qué hacés?"; palabras que delatan el eje ("lista", "horario fijo", "reviso"); marcas de género ("solo", "tranquilo") |
| Los resultados | los cuatro nombres y bajadas | **4 de 4 astros** (Estrella fija, Cometa suelto, Luna llena, Eclipse repentino): horóscopo. Los de luz describen placeres; los de oscuridad, cómo aguantás algo malo |
| El rombo | captura y contraste | el punto a **2:1**, las etiquetas a **9,5 px**; la luz arriba, o sea las dos caras de luz siempre por encima. "Volvé al arcade" subrayado y a la izquierda |
| Compartir | la vista previa del enlace | texto y enlace, **sin imagen**, con la vista previa genérica del sitio. El que llega lee "A alguien le salió «X»" sin saber qué es X; al terminar no se compara |
| Repetir | dos partidas seguidas | 5 de 10 por eje: la segunda repite la mitad. "Probá de nuevo" suena a haber fallado; "Diste con esto", a definitivo |
| Lo demás | la isla | sin "volver a la anterior", sin teclado; "Diez" escrito a mano en tres textos; el intercalado ABAB delata el eje |
| Línea de base | `node --test 'src/**/*.test.ts'` · `npm run check` · `npm run build` | **1405/1405** · **0/0** · **156 páginas** |

## 2. Las tareas

| ID | Rol | Qué | Archivos | Verifica con | [P] / dep. |
|---|---|---|---|---|---|
| `T-331` | hilo principal | **`D-57` y el rango.** La síntesis de los tres conceptos, el contrato que comparten los roles y el reparto; la fila del ciclo en `IDS.md` | `Docs/DECISIONES.md`, `Docs/IDS.md` | `rg -n "^## D-57" Docs/DECISIONES.md`; la fila `T-331`..`T-350` en `IDS.md` | — |
| `T-332` | `producto` | **La noche en el alcance.** Enmienda con fecha de `US-06` (cinco momentos, piso de 30 con 3 por celda, tarjeta y postales en el criterio 4); `BR-36`, la frontera entre escena y credencial con sus vetos; `BR-37`, "esta noche" y "otra noche" sin repetir en la visita | `Docs/PRODUCTO/PRD-alcance-v1.md` | `rg -n "BR-36\|BR-37" Docs/PRODUCTO/PRD-alcance-v1.md`; la fila de `US-06` en la tabla de pisos dice 30 y 3 por celda; `node --test src/lib/pisos.test.ts` | **[P]** con `T-333`; dep. `T-331` |
| `T-333` | `arquitectura` | **`CTR-08` v2.** `momentos`, `momento` por ítem, largos de nombre y bajada, el sorteo por momentos con `vistos`, `disposicion`, `relacion` y el taller; el schema v2; la enmienda de `ADR-02` (la identidad por ruta, los `?g=dos-ejes&r=CU-n` viejos siguen andando) | `Docs/ARQ/ARQ-schema-dos-ejes.md`, `src/data/_schema/dos-ejes.schema.json`, `Docs/ARQ/ARQ-link-resultado-compartido.md` | `$id` `…/schema/dos-ejes/2`; `node --test src/lib/esquemas.test.ts` con el banco v2 | **[P]** con `T-332`; dep. `T-331` |
| `T-334` | `experiencia` | **`UX-36`** (la tapa del libro con su etiqueta e índice; la hoja con el sello del momento y el canto de las que faltan; las opciones como etiquetas de igual peso, lado a lado en la mesa; la confirmación del toque; la última hoja con la marca arriba, la grilla relativa y la cinta; la postal) y las enmiendas en voz alta de `UX-06` (lo que reemplaza), `UX-20` §2 y `UX-22` §12.6 (entra un recorte pegado, sin imprenta ni estampa) | `Docs/UX/UX-36-*.md` (nuevo), `Docs/UX/UX-06-test-dos-ejes.md`, `Docs/UX/UX-20-el-sitio-como-lugar.md`, `Docs/UX/UX-22-la-imprenta-de-rocambole.md` | `rg -n "^# UX-36" Docs/UX/`; `rg -n "2026-10-04" Docs/UX/UX-06-test-dos-ejes.md Docs/UX/UX-20-el-sitio-como-lugar.md Docs/UX/UX-22-la-imprenta-de-rocambole.md` da las tres enmiendas; que cite las medidas de la isla construida lo mira `revisor` | **[P]** con `T-335`, `T-336`; dep. `T-333`. Se escribe sobre lo que `T-340`..`T-342` ya pintan, como `UX-35` en el ciclo 17: lo que cambie vuelve como hallazgo a `T-345` |
| `T-335` | `contenido` | **`CNT-30`, el banco de la noche.** Treinta ítems (`EJ-029`..`EJ-058`, tres por celda momento × eje); los veinte viejos a `retirado` con nota, sin reciclar ids; el `nombre` y la línea que canta de los cinco momentos; las bajadas de las cuatro maneras (un placer y un costo, los cuatro costos con la misma forma); las cadenas de pantalla de su §6 | `Docs/CONTENIDO/CNT-30-la-noche.md`, `src/data/dos-ejes.json` | Lo corre el hilo (`D-12`): `node --test src/lib/esquemas.test.ts src/lib/dos-ejes/banco.test.ts src/lib/pisos.test.ts src/lib/voz.test.ts` | dep. `T-332`, `T-333`, `T-337` (la guarda va antes que el banco) |
| `T-336` | `contenido` | **`CNT-29` y la fila de `CNT-01`.** Las cuatro líneas de contraste al volver (misma, comparten luz-oscuridad, comparten orden-caos, opuestas) y la llegada de la portada con la manera del amigo traducida; en `CNT-01`, el libro de *Luzbelito* recortado (`RES-168`) y las tarjetas y vistas previas fabricadas | `Docs/CONTENIDO/CNT-29-el-contraste-al-volver.md`, `Docs/CONTENIDO/CNT-01-nota-derechos.md` | `rg -n "^# CNT-29" Docs/CONTENIDO/`; `rg -n "libro\|RES-168" Docs/CONTENIDO/CNT-01-nota-derechos.md`; que ninguna línea diga ganar o perder lo mira `REV-19` | **[P]** con `T-335`; dep. `T-332` |
| `T-337` | hilo principal | **Las guardas, escritas antes que el banco.** `banco.test.ts` (la noche en orden, `momentos.length === preguntasPorEje`, tres por celda, los vetos de `BR-36` a máquina, los techos de `UX-06` §7, los polos de cada `CU-n` atados); los rojos e1–e11 de `CTR-08` v2.9 | `src/lib/dos-ejes/banco.test.ts`, `src/lib/esquemas.test.ts`, `src/lib/pisos.test.ts` | `node --test src/lib/dos-ejes/banco.test.ts src/lib/esquemas.test.ts`: cada rojo e1–e11 señala su lugar (`/items/N/momento`, `/momentos/0/id`…) con el control en verde al lado | **[P]** con `T-338`; dep. `T-333` |
| `T-338` | hilo principal | **El motor.** `partida.ts` v2: un ítem de cada eje por momento en orden al azar dentro del momento; `vistos` para la otra noche; `disposicion` (la grilla relativa) y `relacion`; `PartidaImposible` si la noche no es impar | `src/lib/dos-ejes/partida.ts`, `src/lib/dos-ejes/partida.test.ts` | `node --test src/lib/dos-ejes/partida.test.ts`, con la guarda que ata `disposicion` con `relacion` (al lado → `luz-oscuridad`, abajo → `orden-caos`, diagonal → `opuesta`) que `CTR-08` v2.10 punto 3 da por faltante | **[P]** con `T-337`; dep. `T-333` |
| `T-339` | hilo principal | **El taller de piezas y tarjetas.** `sharp` y `fontkitten` con versión exacta; la Archivo Black completa de `scripts/fuentes/` (`D-58`); tres piezas del libro, cuatro tarjetas de 1080 × 1350, cuatro vistas previas de 1200 × 630 y la del juego; el manifiesto con su huella | `scripts/generar-dos-ejes.mjs`, `scripts/dos-ejes-manifiesto.json`, `src/lib/dos-ejes/taller.ts`, `src/lib/dos-ejes/arte.ts`, `src/lib/dos-ejes/tarjetas.test.ts`, `public/tarjetas/dos-ejes/`, `public/arte/dos-ejes/`, `package.json` | `npm run generar-dos-ejes && node --test src/lib/dos-ejes/tarjetas.test.ts` (huella al día, medidas, pesos, ningún recorte toca el óvalo ni el título); las cuatro tarjetas a ojo: ninguna más linda | dep. `T-335`, `T-336`: pinta sus textos y **se vuelve a correr cada vez que cambia un nombre o una bajada** |
| `T-340` | hilo principal | **La isla.** El toque confirmado y bloqueado (las dos inertes en el acto, `aria-pressed`, la otra no se apaga, `--pausa-eleccion`); el foco al enunciado y al nombre; `role=group` y la región viva; "Volvé a la anterior" sin `pushState`; 1, 2 y Retroceso; el sello y la línea del momento; el resultado ("ESTA NOCHE TE SALIÓ", la línea de los polos, la grilla en HTML); el contraste con el amigo; "Empezá otra noche"; compartir con archivo. **Pega en `copy.ts` las cadenas de `CNT-30` §6 y de `CNT-29`** | `src/scripts/partida-dos-ejes.ts`, `src/pages/juegos/dos-ejes.astro`, `src/components/dos-ejes/Tapa.astro`, `src/lib/dos-ejes/copy.ts`, `src/lib/dos-ejes/servir.ts`, `src/lib/dos-ejes/isla.test.ts` | `node --test src/lib/dos-ejes/isla.test.ts src/lib/voz.test.ts src/lib/islas.test.ts`; a mano a 375 × 667: dos toques seguidos contestan **una** pregunta; el foco cae en el enunciado; 1, 2 y Retroceso andan; otra noche no repite ninguna escena de la anterior | dep. `T-338`, `T-339`; las cadenas, de `T-335` y `T-336` |
| `T-341` | hilo principal | **Los estilos.** La hoja, el sello, el canto, las etiquetas de igual peso (lado a lado desde 64 rem), la elegida apretada con borde grueso, la grilla, la cinta "Volvé al arcade"; el token `--pausa-eleccion` (de espera, no de movimiento) | `src/styles/juego.css`, `src/styles/tokens.css`, `src/lib/contraste.test.ts`, `src/lib/estilos.test.ts`, `src/lib/movimiento.test.ts` | `node --test src/lib/contraste.test.ts src/lib/estilos.test.ts src/lib/movimiento.test.ts` (cada par nuevo de texto, testeado); capturas a 375 × 667 y 1440 × 900: ni pastilla, ni barra lateral, ni sombra difusa, ni degradado; ningún estado solo con color | **[P]** con `T-340`, `T-342`; dep. `T-338` |
| `T-342` | hilo principal | **Las cuatro postales y la cabeza.** `/juegos/dos-ejes/cu-1/` a `cu-4/` con su `og:image` y su `og:title` ("Me salió «…»"), la manera del amigo y el botón que arranca la noche con el desafío puesto; la prop de imagen de `Cabeza.astro` (URL absoluta, crédito en `og:image:alt`) | `src/pages/juegos/dos-ejes/[cu].astro`, `src/components/dos-ejes/Amigo.astro`, `src/components/Cabeza.astro` | `npm run build`: **160 páginas** (156 + las cuatro postales); cuatro `og:image` distintas y absolutas en `dist/juegos/dos-ejes/cu-*/index.html`; un `?g=dos-ejes&r=CU-3` viejo abre oscuridad + orden; a 375 × 667 el botón queda arriba del pliegue | **[P]** con `T-340`, `T-341`; dep. `T-333`, `T-339` |
| `T-343` | hilo principal | **`compartir.ts`.** El `AbortError` (cerrar la hoja de compartir no copia ni avisa nada); el botón desactivado mientras la hoja está abierta; el archivo opcional (`canShare({ files })`, y si no, texto y postal); `a.secundario` para el enlace de bajar la tarjeta | `src/scripts/compartir.ts`, `src/styles/juego.css` (`a.secundario`) | `npm run check` 0/0; `node --test src/lib/estilos.test.ts`; a mano: cerrar la hoja no copia; sin `canShare` de archivos sale texto y postal; los otros juegos que usan `compartir.ts` (ponelos, skayboy) siguen iguales | dep. `T-339`, y después de `T-341` (mismo `juego.css`) |
| `T-344` | `revisor` | **`REV-19`, adversarial sobre el conjunto.** Los 30 ítems contra `BR-36` desde los cuatro lugares de `D-57` punto 3 (*nunca fui*, *sin plata*, *con silla de ruedas*, *volviendo de noche sin compañía*); las cuatro maneras con el mismo orgullo y los costos con la misma forma; ninguna escena de seguridad disfrazada; nada que se lea como velorio (punto 9); sin festejo (`D-33`); la voz y el diseño contra sus reglas; la isla contra `UX-36` | `Docs/REVISIONES/REV-19-*.md` | Hallazgos `FIND-111`+ con criterio citado y evidencia; corre la suite entera, `npm run check` y `npm run build` | dep. `T-334`..`T-343` |
| `T-345` | hilo principal | **Cierre de hallazgos.** Cada `FIND` alto o medio, cerrado o declarado con motivo; si cambia un texto que la tarjeta pinta, se vuelve a correr el taller | los que señale cada `FIND` | `node --test 'src/**/*.test.ts'` verde entero; `npm run check` 0/0; `npm run build` 160; `REV-19` con cada `FIND` marcado | dep. `T-344` |
| `T-346` | hilo principal | **El ciclo queda dicho.** `ESTADO.md` con el ciclo 18 cerrado, la vara nueva de tests y páginas, y **el posteo 5 del hilo de Twitter anotado como desfasado** (describe el rombo y los nombres viejos; no se rehace); la fila del ciclo en `IDS.md` pasa a cerrada con lo usado y lo quemado | `ESTADO.md`, `Docs/IDS.md` | `rg -n "ciclo 18" ESTADO.md`; `rg -n "05-que-tipo-de-ricotero-sos\|posteo 5" ESTADO.md`; la fila de `IDS.md` dice "cerrada" | dep. `T-345` |

## 3. Dónde está cada una al cortar el plan

Medido el 2026-10-04 sobre la rama, con `CNT-29` y `CNT-30` sin commitear:
`node --test 'src/**/*.test.ts'` da **1440/1441**.

- **Hechas y commiteadas:** `T-331` (`2b1a123`, `b70bd37`), `T-332` (`576c049`), `T-333`
  (`53e45db`).
- **Escritas, sin commitear:** `T-335` (el banco v2 ya está en el JSON: 5 momentos, 58 ítems,
  30 listos) y `T-336` (`CNT-29` nuevo, `CNT-01` modificado).
- **Construidas en parte** (`805b5a3`, `bf5a31d`): `T-337` sin los rojos e1–e11; `T-338` sin la
  guarda `disposicion`↔`relacion`; `T-339` **en rojo**, el único de la suite: el manifiesto
  quedó viejo después de que entró el banco (`npm run generar-dos-ejes`); `T-340`..`T-343`
  andando, con las cadenas de `copy.ts` todavía provisionales.
- **Sin empezar:** `T-334`, `T-344`, `T-345`, `T-346`.

## 4. Huecos entre roles al cortar

- **`UX-36` se cita y no existe** — `experiencia`. Lo citan `Tapa.astro` y `CTR-08` v2.10;
  sin él, `REV-19` no tiene contra qué medir la pantalla.
- **`CNT-30` dice dos cosas que ya no son** — `contenido`. Que el schema "sigue en la versión
  1 y va a rechazar este JSON" (está en v2 desde `53e45db`) y que `BR-36`/`BR-37` "los escribe
  `producto` en este ciclo" (están en `576c049`).
- **Las cadenas de `CNT-30` §6 y `CNT-29` no tenían quién las pasara a `copy.ts`**: es código y
  no es de `contenido`. Quedan en `T-340`.
- **La ficha de lo que aceptan los previsualizadores** (peso y formato de `og:image`, `CTR-08`
  v2.6) no tiene número: `INV-150` consumió `RES-150`..`RES-171` entero. Si se pide, el hilo
  reserva antes `RES-172`+ en `IDS.md`. No bloquea: solo podría bajar el techo de peso.

## 5. Lo que este ciclo no hace

- **Lo que `D-57` descartó, y por qué sigue afuera:** una pieza de tapa por identidad (siempre
  hubo una más linda); un tema o un verso por cuadrante (ubica la obra en el plano, `US-06`);
  "Sumá otra tanda" (26 preguntas contra los dos o tres minutos); siete por eje (rompe los cinco
  momentos); el sello "EL 7 CUMPLE 30" (la fecha está en duda); la tarjeta dibujada en canvas en
  el teléfono (Safari pierde el gesto y no sirve de vista previa).
- **La vela de la carátula y del pie** (`D-51`, `D-54`). No es de este ciclo; lo nuevo va sin
  velas.
- **La fecha de *Luzbelito*.** `RES-167` no encontró ninguna fuente para el 7-oct-1996 que el
  sitio publica rotulado `hecho` (`redondopedia.json`, `oktubre.ts`, `INV-20`). Es la regla
  estricta del proyecto, pero no es de este juego: queda en
  `Docs/SUGERENCIAS/HILO-para-investigador-y-contenido-la-fecha-de-luzbelito.md` para que
  `investigador` cierre la ficha y `contenido` corrija.
- **El verso de «Juguetes perdidos».** Está en `borrador` en "Completá la letra" (`CL-1000`) y
  nadie lo confirmó de oído. Si el usuario lo confirma y lo quiere, entra después sin tocar nada
  más.
- **Rehacer el posteo 5 del hilo de Twitter.** Se anota como desfasado (`T-346`), no se toca.
- **Recordar entre visitas.** "Otra noche" vive en memoria, sin `localStorage` (`BR-37`).
