# REV-20 — La noche ricotera (`D-62`) y el plano fijo, verificados contra sus criterios

> Revisado el **2026-10-05 y el 2026-10-06** por **`revisor`, con contexto fresco**: tres lentes, cada una con dos verificadores adversariales, sobre `d650eb8`, y una ronda final sobre la rama reabierta (banco y pantalla con dos verificadores cada una, papeles con uno). A diferencia de `REV-19`, no la hizo quien construyó la pieza. El cierre se re-corrió en el HEAD `6cccc1a`.
>
> **Qué se verificó:** `D-62` con sus tres enmiendas, `BR-38`, `US-06` (criterios 3, 7 —con la marca de `BR-38`— y 9), `CNT-31`, `UX-38` v1.1, `INV-172`, `voz-ricotera.md` y `diseno-marca.md`.
> - De `D-62`: la escena ricotera entera, la opción de quien juega, el consumo nunca de un solo lado, el quinto lugar (el que no toma ni fuma) y la merca solo como paisaje.
> - Enmienda 1: la música nunca molesta. Enmienda 2: vuelve el plano de dos ejes arriba de la grilla. Enmienda 3: el plano es fijo (Luz arriba, Orden a la izquierda).
> - Los lentes leyeron además `BR-17`, `BR-36`, `BR-37`, `D-57` (punto 7), `UX-36`, `INV-150`, `IDS.md` y `ESTADO.md`.
>
> **Sobre el número:** la decisión de la noche se escribió como `D-59` y al integrar se renumeró a `D-62`. El `D-59` de `main` es el dominio `fichinricotero.com.ar`. Los commits viejos de la rama dicen `D-59` por la noche. Es la misma decisión. Acá va siempre `D-62`, y donde un voto cita `D-59` por la noche está traducido.
>
> **Sobre la base:**
> - La lectura arrancó sobre la rama `ciclo-18/que-ricotero-sos`, HEAD `d650eb8`, árbol limpio. Arrancó antes de `3b4ae32` y de `d650eb8` y releyó con los dos adentro (`3b4ae32` confirmó `altPlano` y sumó `src/lib/dos-ejes/copy.test.ts`).
> - **El banco entró a `main` antes de esta lectura**, por decisión del usuario, que paró `REV-20` para integrar el ciclo 19 (PR #35; `ESTADO.md`; `BR-38`: «El banco no se integra sin esa lectura»). No es hallazgo. Lo que se arregla acá estuvo publicado sin ella.
> - Después la rama se reabrió desde `main` (`a528bd0` trajo `D-63` enm., `D-64`, `D-65`, `D-66` y `D-67`). Las evidencias de la primera lectura están ancladas a `d650eb8`. La ronda final midió entre `f9b21fd` y `bc19f8d`. **El cierre re-corrió todo en `6cccc1a`** y cada sección dice sobre qué commit está cada número.
> - Lo medido en el navegador es el build de producción (servido con `astro preview` en la primera lectura, servido estático en el cierre), en Chromium sin cabeza (Playwright).
> - **Todas las medidas de texto son con DejaVu Sans**, la pila del sistema de Linux, más ancha que Roboto o San Francisco. Los hallazgos de renglones y de portada a 320 dependen de eso.

## Cómo se hizo

- **Tres lentes** sobre `d650eb8`. Cada una leyó primero el criterio y después la pieza. Ninguna editó nada.
  - **Banco y voz:** `src/data/dos-ejes.json`, `banco.test.ts`, `voz-ricotera.md`, y la prueba de los cinco lugares ítem por ítem (N nunca fui · P sin plata · S silla de ruedas · V volviendo de noche sin compañía · Q no toma ni fuma).
  - **Pantalla y plano:** el plano y la noche entera en el navegador, el código del plano, las tarjetas.
  - **Papeles:** coherencia entre documentos, IDs, rótulos y propiedad (quién escribió dónde).
- **Dos verificadores por lente, con lentes distintas.** Uno de reproducción: ¿se ve lo que el hallazgo dice? Otro de criterio: ¿el criterio citado lo pide, o una decisión del usuario lo ampara? Cada uno vota real o no real, con gravedad y razón. En las fichas, el primer voto es el de reproducción y el segundo el de criterio.
- **Regla.** Entra como hallazgo, con ID, solo lo que confirman los dos. Si uno dice real y el otro no, va a «Sin consenso», sin ID, y decide el hilo. Si ninguno lo confirma, va a «Lo que se refutó».
- **Gravedad.** Si los votos de gravedad no coinciden, la ficha lleva la más baja y dice cuál fue el otro voto.
- **Unión.** Dos lentes (pantalla y papeles) encontraron por separado el mismo defecto de `UX-38`. Va en una sola ficha (`FIND-120`).
- **Ronda final** (2026-10-06, sobre la rama reabierta, después de los arreglos de los roles):
  - Banco y pantalla, dos verificadores cada una. Lo que salió con dos «real» entró con ID (`FIND-132`, `FIND-133`). Lo que salió con un voto fue a «Sin consenso».
  - Papeles, un verificador, ocho problemas. Ninguno tuvo segundo voto. El revisor reprodujo al cerrar lo que pudo leer en disco. Siete van a «Sin consenso» (14 a 21 más el 22, que vio el revisor sin voto).
  - La portada a 320 después de `D-67` (problema 1 del verificador de papeles) la midió el verificador, la repitió el revisor, y el hilo la numeró `FIND-131` en `b86b2db` y en `IDS.md` al arreglarla. No tuvo segundo verificador porque se arregló antes.
- **Resultados crudos.** Los votos de la primera ronda están en `Docs/REVISIONES/REV-20-votos.json` (anexo, `eda8e86`). Los de la ronda final no están anexados: ver «Cierre».

### Numeración

Los lentes numeraron por su cuenta y los números se pisaban. Los de acá son los definitivos, desde `FIND-119` (`REV-19` llegó a `FIND-118`). `FIND-128` y `FIND-129` **quedan quemados**: circularon con otro sentido (`ARQ` citaba `FIND-128` por `CTR-08`) y `IDS.md` los anota. `FIND-130` es la portada a 320, promovida desde «Sin consenso». Lo nuevo de la ronda final va desde `FIND-131`.

Correspondencia con lo que ya circula en el repo:

| Lente | Número del lente | En `REV-20` |
|---|---|---|
| banco | H1, H5, H9, H12 | refutados |
| banco | H2 | `FIND-119` |
| banco | H3, H4, H6, H7, H8, H10, H11 | sin consenso 1, 2, 3, 4, 5, 6, 7 |
| banco | DIFERIDO lecturas · DIFERIDO Ronda | sin consenso 8 · 9 |
| pantalla | `FIND-119` · `FIND-120` · `FIND-121` | sin consenso 10 (los enunciados largos) · `FIND-130` (la portada a 320) · `FIND-120` (`UX-38`) |
| papeles | `FIND-119`, `120`, `121`, `122` | `FIND-121`, `FIND-120`, `FIND-122`, `FIND-123` |
| papeles | `FIND-123` | refutado (`EJ-034`) |
| papeles | `FIND-124`, `125` | `FIND-124`, `FIND-125` |
| papeles | `FIND-126` · `127` · `128` · `129` | sin consenso 12 · `FIND-126` · `FIND-127` · sin consenso 13 |
| papeles (ronda final) | `FIND-131` propuesto | `FIND-131` (coincide) |

Los arreglos de los roles citaban números de los lentes (`PRD:130`, `ARQ`, `CNT-31` §14, `UX-36`, tres sugerencias). Los corrigieron con marca fechada y sin borrar los viejos (`7542573`, `d2e332e`, `d0b57dd`, `f5cde54`, `6b1beeb`).

## Lo que pasó

| Ronda | Puesto a votación | Confirmados por los dos | Sin consenso | Refutados |
|---|---|---|---|---|
| Primera lectura (`d650eb8`): 14 del banco, 3 de la pantalla, 11 de los papeles | 28 hallazgos (56 votos) | 10 (9 fichas, dos se unen) | 13 | 5 |
| Final, banco y pantalla (`f9b21fd` a `d2e332e`) | 3 hallazgos (6 votos): 1 del banco, 2 de la pantalla | 2 (`FIND-132`, `FIND-133`) | 1 (el 14) | 0 |
| Final, papeles (`bc19f8d`), un verificador | 8 problemas | 1 (`FIND-131`, repetido por el revisor) | 7 (con un voto, del 15 al 21) | 0 |

Fichas con ID: trece (`FIND-119` a `127`, `130`, `131`, `132`, `133`). El hilo promovió `FIND-130` desde «Sin consenso» al arreglarla.

### Lo corrido

**En `d650eb8`** (primera lectura):
- `node --test 'src/**/*.test.ts'`: 1531 de 1531, 0 fallan, 0 salteados. `ESTADO.md` y `UX-38` decían 1525; la diferencia eran los 6 tests de `copy.test.ts` (`3b4ae32`).
- `npm run check`: 0 errores, 0 avisos, 14 hints (229 archivos). `npm run build`: 160 páginas.
- `banco.test.ts`, `voz.test.ts`, `esquemas.test.ts` y `pisos.test.ts`: 112 de 112 (118 con `copy.test.ts`).

**En `6cccc1a`** (re-corrida del cierre, árbol limpio):
- `npm test`: **1575 de 1575**, 0 fallan, 0 salteados.
- `npm run check`: 0 errores, 0 avisos, 14 hints, 234 archivos. `tsc --noEmit` sale 0. Los hints son de `aparato.ts`, `diagnostico-audio.ts` y los `is:inline` de las páginas, ninguno del plano.
- `astro build` (a un directorio fuera del repo): 160 páginas, sin errores.
- `banco` + `copy` + `voz` + `esquemas` + `pisos`: 124 de 124 (`banco.test.ts` tiene 31 tests, tenía 27). Los cuatro archivos del criterio 9 (`partida`, `isla`, `copy`, `estilos`): 95 de 95. `contraste` y `fuentes`: 31 de 31.
- **Comandos de verificación del criterio 9 de `US-06` y de `BR-38`:**
  - `rg -n -i "ejes-plano.*(cu-[1-4]|data-|nth-)" src/styles/juego.css`: sin resultados.
  - `rg -n -i "plano" src/scripts/taller.ts src/pages`: sin resultados.
  - `rg -n "altPlano|RESULTADO\.lugares" src/scripts`: sin resultados.
  - `rg -n "^### Enmienda 2026-10-05 \(tercera\)"`: una línea (1537; en `d650eb8` era la 1497).
  - `rg -n "^## BR-38"`: una línea (2133; en `d650eb8`, 2043).
  - `rg -n '^[134]\. \*\*\[REEMPLAZADO por BR-38'`: tres líneas (1795, 1807, 1811; en `d650eb8`, 1705, 1717, 1721).
  - `rg -n "planoFijo|PLANO_FIJO" src/` y `rg -n "textoDelPlano|altPlano\(" src/` dan lo que prometen `CTR-08` E2.6 y `PRD`: el texto del lector se arma solo en `copy.ts:224` y lo llama la isla (`partida-dos-ejes.ts:259`).
- **La visible del banco** no cambió desde `f9b21fd`: comparado el JSON sin `notaInterna`, igual en `f9b21fd`, `783d430` y HEAD. Desde `d650eb8` cambió un solo ítem, `EJ-049`.

### Banco y voz

Todo lo de esta sección está medido sobre el banco de `d650eb8`, salvo donde dice otra cosa.

- **Barridos** sobre todo lo que se lee (30 enunciados, 60 opciones, 5 sellos, 5 cantas, 4 nombres, 4 bajadas):
  - Ningún dígito, ningún lugar con nombre, ningún tema por su título. El único cruce con el cancionero es «pogo», que `BR-38` permite en la escena.
  - Ningún *che*, *viste*, *digamos*, *posta* ni *bancate*. Ninguna exclamación.
  - Ninguna palabra de queja del volumen (ruido, aturdir, molesta, tapar, demasiado fuerte y la lista literal de la enmienda 1: oído, cansa, algodón, tapón, volumen; también sobre `src/lib/dos-ejes/copy.ts` y `src/lib/sitio/copy.ts`). Una sola coincidencia, y no es de música: «Si algo molesta a quien corresponde, se baja y listo.» (`sitio/copy.ts:59`, `creditosCuerpo`, la línea de la baja por derechos, `D-14`).
  - La merca sale una sola vez, en el enunciado de `EJ-049`. 0 de 60 opciones nombran algo de consumo. Ningún parentesco en una opción.
- **Lo sucio:** 12 de 30 enunciados traen algo de la lista del test (`EJ-029`, `031`, `034`, `035`, `039`, `041`, `045`, `048`, `049`, `052`, `053`, `056`).
  - Esperado por noche: 4,0 escenas sucias. En promedio salen 1,78 de 5 momentos sin ninguna. Probabilidad de una noche sin ninguna: 0,43 % (1 en 231).
  - El lente papeles midió lo mismo desde otro lado: 10 de 10 celdas con lo sucio, y 1 en 231.
  - `BR-38` declara aceptar esto. No es hallazgo.
- **Propuestas de texto verificadas en una copia**, sin tocar el repo, que pasaban las 27 guardas: «Pongo un tema sin mirar» (`EJ-039` B) y «Un padre y su hija de treinta cantan a dúo. La canción se pega.» (`EJ-051`, 14 palabras). **Ninguna se aplicó** (`EJ-039` B sigue «Pongo una sin mirar», `EJ-051` sigue «hija grande»). Ojo: «Pongo una canción sin mirar» cae en «ninguna opción apunta al nombre de una manera», porque *canción* está en la bajada de `CU-2`.
- **Prueba de los cinco lugares:** la tabla de 30 por 5 está en «Lo que `BR-38`, `CNT-31` y producto le pidieron a `REV-20`».
- **`altPlano`:** confirmado por `contenido` (`T-352`) y auditado por `copy.test.ts` en los 20 casos. Dice los dos ejes, los cuatro polos y el lugar de la tuya y de la del enlace. Sin dígitos, sin «mejor / peor / primera / última / más», seco, sin anglicismos. Sin hallazgos.
- **Seis respuestas en voz alta** (lectura del lente; no pasaron por votos):
  1. **¿Suena ricotera, con lo sucio y lo tierno?** Los enunciados sí.
     - Voz seca, de cuerpo y objeto («Mugre en las uñas y la boca seca», «La campera huele a humo y todavía te dura la noche», «Hay humo y merca dando vueltas»). Sin muletillas, sin épica, sin psicodelia. Lo tierno está (`EJ-030`, `042`, `047`, `050`, `051` en la lista estricta; ver la lectura (a) de `BR-38`).
     - Las opciones no: unas 10 de 60 tocan la materia de la noche (`EJ-038` A, `045`, `048`, `049`, `053` B, `055` B, `058` A). El resto son gestos de cualquier salida. Es consecuencia de `D-62` punto 2 (el consumo no se elige), no un defecto.
     - Prueba «tapá el título»: 18 de 30 enunciados no traen nada de lo sucio (13 si se cuenta también lo tierno). La noche suena ricotera por los otros 12 y por las cantas.
  2. **¿Algún polo queda como el del que toma?** No queda ninguno. Lo de `EJ-029` y `EJ-048` se refutó, porque es el modelo que escribe `D-62` punto 2. De `EJ-049` quedó solo la entrega total de la A (`FIND-119`); la B como contención no se confirmó.
  3. **¿Alguna manera se lee más pobre?** `CU-4`: el costo pasa por el celular, y `FIND-116` de `REV-19` sigue abierto (sin consenso 4). `CU-3` es la única sin nadie en el placer. `CU-1`, la más rica en cosas, queda fija arriba a la izquierda: el usuario lo aceptó y no se cuenta. La lectura del plano está en la sección de producto.
  4. **¿La merca aparece como elección?** No. Sale una vez, en el enunciado de `EJ-049`, en oración propia y sin glamour. Ninguna opción, nombre, bajada, sello ni canta la trae.
  5. **¿Alguna escena trata la música como algo que molesta?** No. «Radio bajita» (`CU-3`) es una preferencia. «Lo apago nomás» (`EJ-058`) es un parlante olvidado en la mochila.
  6. **¿Un pronombre esconde un consumo de un solo lado?** «Lo paso» (`EJ-029` A, `EJ-048` A) no esconde consumo: pasarlo no obliga. «Una» en `EJ-039` B podía, y los dos votos lo refutaron.

### Pantalla y plano

- **La noche** (Playwright, build de producción, `d650eb8`):
  - **Noche entera:** a 375×667 (10 hojas), a 1440×900 (10 hojas) y a 320×568 (portada, hoja 1 y resultado).
  - **Cosecha de las 30 escenas** (`EJ-029` a `EJ-058`): cinco noches seguidas con «Empezá otra noche», a 375 y a 320. En ninguna sale texto del papel, ninguna opción pasa de dos renglones, no hay desborde horizontal, y la línea que canta tiene dos renglones como mucho.
  - **Resultado** en las cuatro maneras a 320, 375 y 1440: nada sale del papel, con holgura de 26 px bajo la bajada.
  - **Foco:** cae en el h2 del nombre en todos los casos. «Empezá otra noche» deja 0 planos viejos y 1 nuevo.
  - **Enlaces:** `?r=CU-9`, `?g=quiz&r=CU-2`, `?g=dos-ejes&r=CU-9`, `?g=dos-ejes&r=` y sin parámetros no ponen punteado ni dan error. `?g=dos-ejes&r=CU-2` sí pone el punteado y la línea de contraste.
- **El plano**, matriz de 36 casos en `d650eb8` (4 maneras × sin amigo, amigo en otra celda y la misma × 320×568, 375×667 y 1440×900; además 375 y 320 con `forced-colors`, y 768, 1024 y 300 de ancho). En los 36:
  - Luz arriba, Oscuridad abajo, Orden a la izquierda, Caos a la derecha.
  - La tuya en su rincón (`CU-1` arriba a la izquierda, `CU-2` arriba a la derecha, `CU-3` abajo a la izquierda, `CU-4` abajo a la derecha), con un nombre igual al h2 de la hoja.
  - El punteado del amigo cae donde dice la postal. Con «la misma», borde `dashed` de 3 px y los dos sellos.
  - Los cuatro nombres son los del banco, en el orden `CU-1` a `CU-4`.
  - En cada caso los cuatro cuadrantes miden lo mismo de ancho y de alto. El alto común cambia con el caso: a 375, 80, 82 o 105; a 320, 82, 97, 119 o 134; a 1440, 80, 82, 90 o 105.
  - El eje vertical queda a 0,0 px del centro de la cruz. Los polos izquierdo y derecho no se pisan. Ningún sello sale de su cuadrante.
  - Sin dígitos en el texto ni en el `aria-label`. Letra mínima de 12 px. 0 elementos enfocables adentro. `role="img"` siempre.
- **Alturas del recorte** (`offsetHeight`, `d650eb8`): a 375, 327 / 331 / 378; a 320, 331 a 362, y 405 a 436 con «la misma»; a 1440, 327 a 378, con 416 de ancho. «Compartí» y «Empezá otra noche» no varían entre sin amigo, otra celda y «la misma».
- **Datos que el checklist de `UX-38` pedía:** «Ronda en cualquier esquina» ocupa 2 renglones a 375 y 3 a 320. El sello «Quien te lo mandó» se parte adentro de su rectángulo a 320, sin borde cortado. Tableta 768×1024 y 1024×768: 416 de ancho, sin desborde. Con `html{font-size:200%}` el plano queda contenido.
- **El texto del lector**, en los 12 casos a 375: «Dos ejes en cruz. Arriba, Luz, con la gente. Abajo, Oscuridad, con lo propio. A la izquierda, Orden, con plan. A la derecha, Caos, sobre la marcha. Tu manera, `<lugar>`: `<nombre>`.» Con enlace suma «La de quien te lo mandó, `<lugar>`: `<nombre>`.» o «La de quien te lo mandó es la misma.» Coincide con lo confirmado por `contenido` (`T-352`). El lugar de la tuya y el del enlace coinciden con el dibujo y con la línea de contraste.
- **CSS del plano** (`.ejes-plano*`): sin hex, `border-left`, `border-inline-start`, `gradient`, `blur`, `filter`, `backdrop`, `999px`, `:hover`, `:active`, `transition` ni `animation`. Ninguna regla atada a `cu-N`, `data-*` ni `nth-*`. Contraste: `--fondo` sobre `--papel` 14,94:1; `--papel-tenue` sobre `--papel` 5,39:1, los dos ya en `contraste.test.ts`.
  - **Cambió después con el merge de `main`:** `D-64` sacó la sombra dura del recorte (`4px 4px 0 var(--borde)` estaba en `d650eb8`; hoy el recorte no tiene `box-shadow`), y `D-67` pasó el nombre del plano de `--fuente-rotulada` a `--fuente-luzbelito`. Ver «Sin consenso» 22.
- **Contraste forzado, emulado** (`forcedColors:active`) a 375 (tres casos) y a 320 (uno): los cuadrantes sin marca no muestran recuadro; los ejes, el borde sólido de la tuya, el punteado del amigo y los sellos se ven.
- **Código:** `plano()` sale de `planoFijo(banco)` y no escribe polos a mano. El `try/catch` rodea solo `plano(id)` dentro de `grilla()`. El plano va después de `.ejes-acciones` y del contraste, antes de `.ejes-grilla`.
- **Tarjetas** (`public/tarjetas/dos-ejes/`):
  - En `d650eb8`: `cu-1` a `cu-4.png` (1080×1350), bajada idéntica palabra por palabra a la del banco, nombre, sello de polos y línea que nombra coinciden. `og-cu-1` a `og-cu-4.png` y `og-dos-ejes.png` (1200×630) llevan nombre, sello y línea que nombra, sin la bajada.
  - Los cuatro PNG de `cu-N` se regeneraron después en el merge del dominio (`49d9ea0`). En el cierre se releyó `cu-3.png` a ojo: la bajada es la del banco. Las otras tres se leyeron en `d650eb8`.
  - El nombre en las tarjetas sigue en la rotulada: lo declara `D-67` como pendiente.

#### La ronda final y la re-corrida del cierre

- **`f9b21fd` a `d2e332e`** (lente pantalla, build servido con `astro preview`): 104 casos en el navegador (44 en 375, 360 y 320, y 60 en 288, 292, 300, 310 y 319), 0 fallas. Cada caso verifica unas veinte cosas: rincón de la tuya y de la del enlace, nombre igual al h2, orden `CU-1` a `CU-4` arriba-izquierda, arriba-derecha, abajo-izquierda, abajo-derecha, cuadrantes de igual ancho y alto, misma letra, ≥ 12 px, polos en su lugar y sin solaparse, sin sello ni texto cortado, sin desborde, `aria-label` igual al esperado, plano después de los botones y antes de la grilla.
- **`6cccc1a`** (re-corrida del revisor, los mismos scripts y los mismos 104 casos sobre el build de ese commit): 0 fallas.
  - El `aria-label` es idéntico al esperado, derivado de los polos del JSON, en los 104.
  - Alto del recorte: 327 a 378 a 375; 327 a 408 a 360; 331 a 436 a 320; 331 a 464 de 288 a 319. Sin desborde horizontal. Letra mínima 12 px. 0 enfocables. 0 dígitos, 0 puntos.
  - El nombre del plano ya es `"Redonditos de Ricota Fan"` a 12,8 px, una sola combinación en los cuatro cuadrantes.
  - **Lo que `D-67` movió:** los botones del resultado. A 375×667, «Compartí» / «Empezá otra noche» terminan en 524 / 597 (`CU-1`, `CU-3`, `CU-4`) y 561 / 634 (`CU-2`); antes del merge eran 538 / 611 y 574 / 647. Los dos votos de `FIND-132` son de antes del merge; ver esa ficha.
- **A/B sin plano** (`6cccc1a`, 375 y 320 × 4 maneras): «Compartí» y «Empezá otra noche» idénticos con y sin plano. El plano suma 363 px de alto de documento a 375 y 394 a 320.
- **Falla forzada** (un `initScript` hace lanzar `setAttribute('role','img')` sobre `.ejes-plano`, 375, una postal): `.ejes-plano` = 0, botones 561 / 634 iguales que sin falla, contraste y las 4 celdas presentes, foco en el h2, 0 errores de página. La sección queda sin plano y todo lo demás igual.
- **Portada** (`#empezar.bottom`), a 320×568: 561,5 en `6cccc1a` (`b86b2db`), 569,5 en `bc19f8d`, 565 en `783d430`. A 360×640: 592,5. A 375×667: 595. Ver `FIND-130` y `FIND-131`.

### Papeles

- **Código contra decisión del usuario:** `planoFijo()` y `PLANO_FIJO` dan Luz arriba y Orden a la izquierda.
  - Las celdas `CU-1` (luz y orden), `CU-2` (luz y caos), `CU-3` (oscuridad y orden) y `CU-4` (oscuridad y caos) coinciden con la tabla de la enmienda tercera de `US-06`, con `UX-38` §2.1 y con los polos del JSON.
  - `plano()` va en `try/catch` dentro de `grilla()` y es `role="img"` con el `aria-label` de `textoDelPlano()` (desde `798cd54`; antes `RESULTADO.altPlano`). No crea `a`, `button`, `tabindex` ni punto.
  - La grilla sigue en `disposicion()` (relativa). Ningún papel ni comentario de código describe el plano como relativo, salvo los marcados `[v1]` como historia.
- **El rombo viejo contra el plano fijo** (`UX-06` §4; código en `bc27cd4`, `partida-dos-ejes.ts` 59-115): Luz al norte, Oscuridad al sur, Orden al oeste, Caos al este. Es la orientación de `PLANO_FIJO`: cada manera cae en el mismo rincón que su cara del rombo (luz y orden arriba a la izquierda, luz y caos arriba a la derecha, y así). Cambia la forma, no el rincón:
  - De rombo (cuadrado girado 45° en SVG, rótulos afuera) a cuadrado derecho en HTML con los ejes en cruz. Luz y Oscuridad van al centro de arriba y de abajo; Orden y Caos, montados sobre la raya.
  - El rombo **decía evitar** que dos maneras quedaran en la fila de arriba, y no lo conseguía: dibujaba los dos puntos de luz a la misma altura (`D-57`, diagnóstico 5: «el rombo dejaba las dos caras de luz siempre arriba (la jerarquía que decía evitar)»; `UX-38` línea 95 lo cita como punto 7, la decisión que lo saca). El cuadrado las deja arriba y a la vista. Es el costo de `US-06` enmienda tercera (costos 1 y 2) y de `UX-38` §2.1.
  - Pierde el punto en la cara (r = 8 en unidades del `viewBox` `-32 0 304 240`, escalado). Gana el nombre de las cuatro adentro de su cuadrante, los polos en palabras, el sello «Esta noche» con borde grueso para la tuya y el punteado con sello para la del amigo.
  - Pasa de `role="img"` con un `altPlano` fijo y sin lugar, al texto que dice los cuatro polos y el lugar de la tuya y de la del otro.
- **`UX-38` §4.1 y §4.3 contra `juego.css`** (`d650eb8`): relleno de 12 px, borde `--linea` en `--apoyo-disco`, sombra de 4 px, +0,5°, cinta de 72×22 a −4°, `minmax(0,1fr)`, `column-gap` de 10 px, ejes absolutos con borde, `min-height` de 5rem, tope `min(26rem, …)` y `display:none` bajo 18rem. Todo coincidía. **Hoy la sombra y la letra del nombre ya no coinciden** (`D-64`, `D-67`): «Sin consenso» 22.
- **Criterio 9 de `US-06`:** los tests que cita existen con ese nombre (`partida.test.ts:230`, `isla.test.ts:89`, `estilos.test.ts:616-617` y `:1295` en `d650eb8`). `UX-36` lleva las marcas del plano fijo (cabecera, §5.3, §5.6, §5.8, §6.2). `D-57` punto 7 tiene el puntero a `D-62` enmiendas 2 y 3. `BR-36` lleva las marcas (a) a (d) y los tres REEMPLAZADO.
- **`CNT-31` §13:** el texto del lector confirmado es exactamente el de `copy.ts` (37, 51 y 46 palabras, verificadas a mano). `copy.test.ts` lo guarda.
- **Banco medido con script:** 30 ítems listos, 3 por celda. Bajadas de 34, 30, 32 y 32 palabras, y de 165, 165, 167 y 168 caracteres. Líneas que cantan de 7, 8, 8, 7 y 6 palabras. Enunciado más largo: 14 palabras y 74 caracteres (`EJ-044`).
- **IDs del ciclo 19:** `T-351` a `T-353` dentro de `T-351` a `T-370`. `BR-38` libre antes de `BR-40`. `UX-38` distinto de `UX-37`. `CNT-31` distinto de `CNT-40`. `RES-172` a `RES-194` dentro de 172 a 199, sin citas a 195 a 199. Con otro script se buscaron IDs citados sin definición: solo `REV-20` (esta revisión).
- **Rótulos:** ningún dato de `INV-172` rotulado leyenda aparece en `CNT-31` ni en las `notaInterna` como hecho o testimonio. `RES-179` y `RES-181` van como leyenda. `RES-158` y `RES-157`, que son hecho en `INV-150`, van como hecho. `RES-175` cayó y se descartó. La excepción que se planteó (la certeza del barro en `EJ-034`) se refutó.
- **Propiedad:** los commits de producto tocan solo `PRD-alcance-v1.md` y sus sugerencias. Los de contenido, solo `Docs/CONTENIDO`, `Docs/SUGERENCIAS` y `src/data/dos-ejes.json`. Los de experiencia, solo `Docs/UX`. Los de arquitectura, solo `Docs/ARQ`. Ningún rol escribió fuera de su carpeta (verificado por el lente papeles hasta `bc19f8d`; en `b86b2db` y `6cccc1a` escribe el hilo, que es dueño de esos archivos).

## Lo que `BR-38`, `CNT-31` y producto le pidieron a `REV-20`

`BR-38` («Cómo se lee», «Quién vigila qué», «Huecos conocidos»), `CNT-31` (§4, §5, §7, §10, §12) y la pregunta de producto sobre el plano le dejaron lecturas a `REV-20`. Acá están. Donde un verificador objetó una lectura, la objeción va al lado.

Base: banco de `f9b21fd`, igual al de HEAD en todo lo que se lee. Los números de probabilidad salen de enumerar las 3^10 = 59.049 noches posibles.

### 1. La tabla de 30 por 5 lugares

`ok` pasa. Una reserva se escribe en la última columna. En Q va dónde aparece lo que se toma o se fuma (enunciado, opción A, opción B) y quién lo hace (quien juega, otros, nadie), o «no aparece». La última columna es la prueba del que no fue, que `BR-36` pide por ítem: cuál adivinaría quien lee, o «ninguna».

| Ítem | N nunca fui | P sin plata | S silla | V vuelta sin compañía | Q: dónde · quién | Reserva · que no fue adivina |
|---|---|---|---|---|---|---|
| 029 | ok | ok | ok | ok | enunciado (fernet, botella cortada) · otros, «los tuyos». A «Lo paso» lo toma por pronombre: pasarlo no obliga. B no | A, con duda (la que está en la ronda). Es el modelo literal de `D-62` punto 2 |
| 030 | ok | ok | ok | ok | no aparece | A, con duda (canta con la guitarra). El fogón no es el «fuego» del veto 2 |
| 031 | ok | ok (A usa teléfono: cuenta para el tope) | ok | ok | enunciado (birra tibia, yerba) · nadie, es olor | ninguna. «Yerba» se lee mate o marihuana: en las dos nadie la usa |
| 032 | ok | ok | ok | ok | no aparece | ninguna |
| 033 | ok | ok | ok | ok | no aparece | ninguna. B «en un rato» suena a atajo (oído, no regla) |
| 034 | ok (el barro es de esa noche, en presente) | ok | ok | ok | no aparece | ninguna |
| 035 | ok | ok (la combi es el lugar; nadie paga ni se nombra el pasaje) | ok | ok | enunciado (vino, olor en la combi) · nadie | ninguna |
| 036 | ok | ok (A usa teléfono: cuenta para el tope) | ok | ok | no aparece | ninguna |
| 037 | ok | ok (B pide el celular con el que se juega) | ok | ok | no aparece (panchos: comida) | ninguna. «A alguien» sin dueño: el veto 6 se vigila por palabra y «alguien» no está en la lista |
| 038 | ok | ok | ok | ok | no aparece | B, con duda («Si llueve, llueve»). La A es truco de veterano y se compensan |
| 039 | ok | ok | ok | ok | enunciado (birra «va de mano en mano», «en el fondo») · otros. B «una» es un tema: lo fija «Te pasan el parlante» y la A | ninguna |
| 040 | ok | ok | ok | ok | no aparece | B, con duda («Me dejo llevar» con los Redondos). Sin consenso 1: no cambia el texto, la salida está escrita en la `notaInterna` |
| 041 | ok | ok | ok | ok | no aparece (el humo es del puesto, comida) | ninguna |
| 042 | ok | ok | ok | ok | no aparece | ninguna |
| 043 | ok, con reserva: «trapo» es todo el enunciado. Tapada queda «cada barrio ata su ___», se lee por «ata» y las dos opciones se contestan igual | ok | ok | ok | no aparece | ninguna |
| 044 | ok | ok («Tenés campera y buzo» da ropa, no una compra) | ok | ok | no aparece | ninguna |
| 045 | ok | ok | ok (B «por ahí» no pide vadear) | ok | no aparece | ninguna (las dos traen cartón) |
| 046 | ok | ok | ok | ok | no aparece («Lo tomo como viene»: tomar es aceptar) | ninguna |
| 047 | ok | ok | ok | ok | no aparece | ninguna. Tono: canción lenta sin vela ni despedida; lectura de oído, a diferidos |
| 048 | ok | ok | ok (A usa las manos, no una capacidad del veto 5) | ok | enunciado (porro) · otros, «los tuyos». A «Lo paso» por pronombre. B «Miro subir el humo» (el del porro; mira, no fuma) | A, con duda |
| 049 | ok, con reserva: B sin letra (ver «Lo que quedó de `EJ-049`») | ok | ok | ok | enunciado («humo y merca dando vueltas») · nadie, sin sujeto. Ninguna opción | ninguna sin dudar |
| 050 | ok | ok | ok | ok | no aparece | ninguna |
| 051 | ok | ok | ok | ok | no aparece | ninguna. «Hija grande»: por ítem pasa; si se lee por momento decide producto (ver (a)) |
| 052 | ok, con reserva: tres palabras del código. Tapadas «misa» y «pogo» queda «no para… el reviente llega hasta la calle» | ok | ok (B «cambiando de sitio» no pide pararse) | ok | no aparece (reviente, sin consumo) | ninguna |
| 053 | ok | ok | ok | ok | enunciado (humo en la campera, sin decir de qué) · nadie, olor en la ropa | ninguna |
| 054 | ok | ok | ok | ok: empieza en casa, y «Aviso que llegué» es el «a quién se le cuenta» que `BR-36` acepta y el cierre de `FIND-113` | no aparece | ninguna. Sin consenso 3: queda como estaba |
| 055 | ok | ok (A usa teléfono: cuenta para el tope) | ok | ok | no aparece | ninguna. «Hecho pelota» está en el enunciado, no en una opción (no es `EJ-001` B) |
| 056 | ok | ok | ok (B «Me levanto» es de la cama) | ok | no aparece consumo. «Boca seca» sin causa dicha: puede ser de cantar, de polvo o de la noche | ninguna |
| 057 | ok | ok | ok | ok | no aparece | B, con duda (la disponible). B suena a trámite (oído) |
| 058 | ok | ok (el parlante es un objeto propio, nada se compra) | ok | ok | no aparece | ninguna. B «nomás» (oído) |

**Resumen por lugar:** N 30 de 30 (reservas en 043, 049 y 052). P 30 de 30. S 30 de 30. V 30 de 30. Q 30 de 30.

- **Lo que se toma o se fuma aparece en 7 enunciados** (029, 031, 035, 039, 048, 049, 053) **y en 0 de las 60 opciones por palabra.** Por referencia, 3 opciones lo tocan sin consumirlo: 029 A y 048 A («Lo paso», por pronombre) y 048 B («Miro subir el humo»). Las tres, aprobadas.
  - *Objeción de los dos verificadores:* el lente había escrito 6 enunciados y «0 de las 60 opciones» a secas. La columna Q de la misma tabla marca 053 como enunciado, y `BR-38` pone «el humo» entre lo que se toma o se fuma. El «0 de 60» es la cuenta por palabra de la guarda, que es justo lo que `BR-38` pide superar en esta columna.
- **Forma 6 del quinto lugar**, sobre el banco entero: en cada momento hay al menos una luz que no pasa por consumir. En los tres ítems con consumo en la escena y en una opción (029, 048, 049) la luz se hace sin consumir.
- **Lo que quedó de `EJ-049`** (par nuevo, `f9b21fd`): «Festejo con el resto» / «Canto para adentro».
  - *Prueba del que no fue:* no se adivina sin dudar. «Festejo con el resto» es lo que hace la sala (la línea ya dice «todos cantan»); «Canto para adentro» es la de quien se sabe la letra y la lleva adentro. Cada una puede ser «la de adentro» según quien lea, y ninguna lleva una marca de `BR-36`: grito, «en el medio», hasta el final o palabra del código. Queda la inclinación estructural de la luz «con la gente», que `contenido` declaró en `CNT-31` §14.1.
  - *Tapar la merca* («Hay humo dando vueltas…»): la A se lee igual y el ítem mide lo mismo. «Festejo» sale de «Entran los instrumentos», no de la merca.
  - *«La del reviente»:* no está. «Festejo» no es un verbo de exceso ni de aguante, y la B no es la limpia ni la del turista: también canta.
  - *Nunca fui con «Canto para adentro»:* pasa con reserva. No dice «la letra», «la» ni «lo que sé»: sin objeto, se canta para adentro tarareando. Eso la separa de «La canto a dúo» de `CNT-30`. La reserva es que «todos cantan» en la misma hoja inclina «canto» hacia «me la sé», al mismo grado que «Me arrimo y canto» (030 A) y «Tarareo una que me gusta» (035 B).
  - *El mismo orgullo:* dicho en voz alta en una previa, ninguna suena a excusa ni a alarde. «Para adentro» es lo que podría sonar a «soy tímido», y el modismo lo desactiva.

### 2. Lo que `BR-38` dejó para `REV-20`

**(a) Lo tierno** («que ninguna clase de gente sea la única»).
- Lista estricta (el enunciado trae a alguien querido —familia, pareja, amigos propios— o un gesto de cariño, y la escena no gira en torno a lo que se toma o se fuma): 030, 042, 047, 050, 051. Lista ancha: la estricta más 029 y 048, que traen «los tuyos» pero con la ronda. Lo sucio, con la lista exacta del test: los 12 de arriba.
- Resultados (esperado por noche · noche sin ninguna):
  - Sucio: 12 de 30 · 4,00 · 0,43 % (1 en 231).
  - Tierno estricto: 1,67 · 9,9 % (1 en 10).
  - Tierno ancho: 2,33 · 2,5 % (1 en 40).
  - La lista del borrador (036, 042, 047, 050, 051, 054, 057): 2,33 · 4,4 %. Reproduce su número, pero cuenta 036 y 054, cuya ternura vive en una opción, y 057.
- Por momento, la chance de al menos una escena tierna (estricta): previa 33 %, ida 0, vereda 33 %, adentro 78 %, vuelta 0. Con la ancha, la previa sube a 67 %. El borrador decía que la previa no trae ninguna: con 030 sí, en 1 de 3 noches.
- **Veredicto:** no es hallazgo. `BR-38` dice «lo tierno no se cuenta, se lee» y no escribe piso. Lo sucio tiene piso por celda y lo tierno no: la ida y la vuelta no traen ningún enunciado con alguien querido (su ternura está en las opciones de luz), así que una noche toda tierna no puede salir. Pedir lo tierno por momento sería una regla nueva, y cae sobre la vuelta, la celda más angosta.
- *Objeción de los dos verificadores:* el lente había escrito «ninguna noche es toda de una clase, porque 18 de 30 enunciados no traen ninguna de las dos listas». El 18 es la cuenta de los enunciados sin lo sucio (30 menos 12). Sin lo sucio ni lo tierno son **13** (032, 033, 036, 037, 038, 040, 043, 044, 046, 054, 055, 057, 058), con la lista estricta y con la ancha. Y una noche con las diez hojas sucias sí sale: previa × luz y adentro × luz tienen dos sucias de tres, las otras ocho celdas una, así que (2/3)² · (1/3)⁸ = 4/59.049, 1 en 14.762. El veredicto de que no es hallazgo se mantiene; la frase está reescrita.

**(b) Hueco 4: «ricotero» o la banda para puntuar en un enunciado.** Pasa. «Ricotero» no aparece en el banco. «Redondos» sale una vez (040), «misa» y «pogo» una (052), «trapo» una (043). Todas describen la escena y ninguna califica a quien juega.

**(c) Nombres y bajadas contra el quinto lugar.** Pasan. Ninguno trae consumo, merca, «tomás» ni «fumás». Bajadas: `CU-1` «chori en la parrilla» (comida), `CU-3` «el puesto de siempre» (lugar, no un verbo de comprar), `CU-4` «botamangas que ya vieron barro». «La noche toma forma» (`CU-2`) es otro «tomar». «Ronda en cualquier esquina» es el lugar; la bajada no dice qué se hace en la ronda. «Radio bajita» es una preferencia, no una queja del volumen.

**(d) «El mismo orgullo» y «las dos pagan», sobre las 30.** Pasan. Ningún par suena a excusa ni a alarde dicho en una previa. Reservas de oído, no de regla: 029 B («en la mía»), 033 B («en un rato»), 057 B (trámite) y 058 B («nomás»). Ninguna opción de orden confiesa un descuido. Las dos de caos que suenan a atajo (033 B, 058 B) y 039 B las compensan 038 B y 045 B, donde el caos paga: se moja, busca.

**(e) Los patrones del conjunto de `BR-36`, uno por uno.**
1. *Celda con tres escenas del mismo dilema.* Leve en vuelta × luz (las tres luces son decirle algo a alguien; las tres oscuridades son «Me» más campera, medias o ducha) y en previa × orden (032 y 034 son las dos «qué ropa»). No rompe: sale un solo ítem por celda por noche, y `BR-36` ya anticipaba que la vuelta es la celda más angosta.
2. *Un polo que paga siempre y otro que confiesa un descuido.* No se confirma (ver (d)).
3. *La opción de adentro cayendo siempre del mismo lado.* Señal débil. La prueba del que no fue se inclina, con duda, en 6 ítems de la tabla (luz en 029, 030 y 048; caos en 038, 040 y 057); el lente contó 7 sumando 049 hacia la luz, y su propia fila de 049 dice «ninguna sin dudar». Ninguna cae a oscuridad ni a orden. No es «siempre» (24 de 30 no se inclinan), así que no rompe. Si entra un ítem nuevo que incline hacia luz o caos, sí.
4. *Una sola clase de gente.* Ver (a).
5. *Lo sucio como firma de un polo.* No. En orden-caos tocan lo sucio en la opción 3 ítems (038, 045, 058) y al menos 4 opciones (045 lo toca en las dos). 038 y 058 ponen al caos como la que lo deja estar y al orden como la que protege o limpia; 045 las trata igual. 12 de 15 ítems de orden-caos no lo tocan en la opción. Son 3 de 15: a vigilar, no a cambiar.
   - *Objeción de un verificador:* el lente había escrito «3 opciones». Son 3 ítems.

**(f) Huecos 2 a 7 de «Huecos conocidos».**
- **2, la merca fuera de las opciones.** Pasa: 0 en sellos, cantas, nombres, bajadas y opciones; una sola mención, en 049. El barrido usó 24 palabras (merca, cocaína, falopa, raya, saque, pala, tiro, coca, polvo, nieve, paco, droga y otras). Hoy hay guarda (`bc19f8d`).
- **3, el consumo como verbo en opciones y bajadas.** «Tomo» suelto atrapa «Lo tomo como viene» (046 B) y «la noche toma forma» (`CU-2`): la lista tiene que ser de frases con su objeto. El lente propuso una lista; los dos verificadores mostraron que `pego una` caza «Pego una vuelta» (pegar la vuelta es una frase de este banco), `me clavo` caza «Me clavo en la fila», `me mando una` caza «Me mando una macana» y `me prendo uno` caza «Me prendo uno de los cantitos». La lista no pasa tal cual. `bc19f8d` escribió la de producto, sin esas cuatro: `me sirvo`, `servime`, `brindo`, `brindamos`, `brindar`, `fumo`, `fumamos`, `fumar`, `me fumo`, `tomamos algo`, `tomo algo`, `tomar algo`, `chupo`, `chupamos`, `me emborracho`, `emborrach*`, `me pongo en pedo`, `le doy una pitada`. Con 0 falsos positivos sobre el banco y casos en rojo. «Lo tomo como viene», «Tomo una foto» y «Me tomo mi tiempo» pasan.
- **4, «ricotero» y la banda en el enunciado.** Pasa (ver (b)). Faltaba `trapo*` en la lista de opciones: `BR-38` pone «los trapos» en «Nunca» y `VETOS_DE_LAS_OPCIONES` no lo traía. `783d430` lo sumó.
- **5, lugares con nombre y cifras.** Pasa: 0 dígitos, 0 lugares, 0 años; el único nombre propio es «Redondos». Hoy hay guarda de dígitos (`bc19f8d`).
- **6, un chico junto al consumo, y los temas por su título.** Chicos: solo «su hija grande» (051), en una hoja sin consumo. Títulos: 0 de 104 aparecen enteros, salvo «pogo» (tema de *Último bondi a Finisterre*, 1998), en minúscula, como el ritual, y `BR-38` lo permite en la escena. Una guarda tendría que exceptuarlo.
- **7, música que molesta con palabras fuera de la lista.** El banco está limpio (108 cadenas). La lista de `0a84d0d` dejaba pasar diez frases de queja («Los parlantes cansan los oídos», que es la frase de la vuelta 5 de 052 que `CNT-31` §12 dice que no vuelve; «El ruido cansa», «Me zumban los oídos», «Bajale el volumen», «Está demasiado alto», entre otras). `783d430` las sumó. Ver «Sin consenso» 14.

### 3. Lo que `CNT-31` le preguntó

- **§5, la merca.** Paisaje, no guiño: oración propia, sin sujeto, adjetivo, cantidad ni consecuencia, y «dando vueltas» es el verbo de circulación que ya usan «pasan» y «va de mano en mano». No hace falta sacar el humo.
- **§7, ¿paisaje sucio en `CU-2`?** No se pide. `BR-38` dice que la bajada «puede» traer la ronda o el humo como lugar, no que deba. El nombre ya trae la ronda, y `CU-1`, `CU-3` y `CU-4` traen chori, puesto y barro.
- **§10.4, los que no entraron (043, 045, 046).** Se lee como escena y no como lástima. Ninguna cadena dice «entrada» ni «no entraron» (0 en 108); es la reja, el charco y la fila vistos desde afuera, y ninguna opción habla de entrar ni de pagar. La pregunta quedó sin objeto.
- **§10.7, teléfono en las luces.** En el borde: 031, 036, 054 y 055 firmes, más 053, que puede ser en voz alta, suman 5 de 15, el tope de un tercio (`D-57` enmienda 7). Una sexta lo rompe. Firmes por noche: 0 en 14,8 %, 1 en 44,4 %, 2 en 33,3 %, 3 en 7,4 %; nunca más de tres.
- **§10.8, cruces flojos.** 047 + 052 salen juntas en 1 de 9 noches (11,1 %): roce de tono sin contradicción, no sobra. Más flojo y no nombrado: 047 + 051 (también 1 de 9) repiten «alguien querido canta una canción»; va a diferidos.
- **§10.9, repeticiones.** Estribillo, no rompe nada.
  - Dentro de una misma hoja, 8 de 30 enunciados repiten una palabra de la línea que canta: 029 (botella cortada, las dos palabras), 030, 031, 036, 037, 045, 047 y 051. Con las opciones, 049 B «Canto para adentro» repite «cantan»: son 9.
  - Entre hojas de una noche: «humo» en tres hojas en 7,4 % de las noches; «campera» en tres o más en 11,1 % y en cuatro en 1,2 %. Sin cambio pedido.
  - *Objeción de los dos verificadores:* el lente escribió «CNT declara 029 y 045; las otras no están dichas». `CNT-31` §10.9 declara también la yerba en 031 y la canta de la previa, y §14.1 discute el canto de 049.
- **§10.10, lo sucio de 035 y 039 como aire.** Pasa: el vino y la birra están en el aire o «en el fondo», las opciones son de otra cosa, y ese es el arreglo que escribe `BR-38`.
- **§12, ¿mover la regla?** No. Cada una de las seis cosas que pidió el hilo choca con una línea escrita que sigue siendo cierta: trapo, misa o Redondos en una opción (`BR-38`, «Nunca»); «cantar hasta quedarse sin voz» o «bancar la fila» (la marca de «más aguanta lo sucio»); «al de al lado» (veto 6); «pegar la vuelta» o «la vereda» en una opción (la vuelta sin trayecto); el cordón (la silla de ruedas). Mover la regla abriría un molinete. Lo que sí queda para el usuario, y no para la regla, es si unas 10 de 60 opciones que tocan la materia de la noche alcanzan; `D-62` punto 2 lo manda así.

### 4. Lo que preguntó producto

**¿Se lee más pobre alguna de las cuatro maneras en su rincón fijo?** Ninguna se lee más pobre por forma, peso o letra. Lo único que las separa es el lugar, y es el costo ya aceptado.
- Se miraron las ocho capturas de 375 (las cuatro, sin amigo y con la misma) y las de 320. La marca es idéntica en las cuatro: recuadro de 3 px, sello «ESTA NOCHE», misma letra, mismo tamaño (con la misma, 142,4 × 106,5 en las cuatro). Ninguna tiene color, relleno, número, punto ni flecha. Nada ordena.
- `CU-3` (abajo a la izquierda) y `CU-4` (abajo a la derecha) quedan debajo de la raya horizontal de Luz y al lado de «OSCURIDAD / con lo propio», que es lo último que se lee. `CU-4` es además la esquina más lejos de donde empieza la lectura. Esto no está en el dibujo: es la orientación elegida por el usuario (`US-06` tercera, costos 1 y 2).
- Lo que lo compensa: justo debajo, la grilla es relativa y deja la tuya primera con su sello.
- A 320 el nombre de `CU-2` y de `CU-4` parte en tres renglones y el recorte crece 31 px (331 a 362) para las cuatro celdas a la vez: no pesa a favor de nadie. *(Objeción de un verificador: pasa solo cuando `CU-2` o `CU-4` llevan marca, la tuya o la del amigo. Las cuatro celdas siguen iguales entre sí.)*
- Si «arriba» se lee como acierto no lo decide una captura: va a `UX-38` §10.5 con gente real.

**El rombo viejo contra el plano fijo:** ver «Papeles».

**El volumen en el sitio construido** (enmienda 1). Ninguna pantalla del juego trata la música como algo que molesta. Barrido con una lista ancha (oído, cansa*, algodón, tapón, tapo/tapar, volumen, ruido, aturd*, molest*, demasiado/muy fuerte, estruendo, ensordec*, zumbido, me duele, insoportable, bajar el volumen o la música, bajito/a, apag*) sobre el banco embebido en `dist/juegos/dos-ejes/index.html`:
- 108 cadenas visibles (30 enunciados, 60 opciones, 9 nombres, 5 cantas y 4 bajadas). 3 coincidencias y ninguna es queja: `EJ-042` A «Me tapo con un amigo» (llovizna, campera), `EJ-058` B «Lo apago nomás» (parlante prendido en la mochila) y `CU-3` «Radio bajita, misma hora» (preferencia; los nombres no se tocan, `D-62` punto 6). `CU-3` también está en el `title`, las metas y el contraste de su postal.
- El JS compilado de la isla: 0 coincidencias. Las cinco páginas del juego (portada y cuatro postales): solo el pie legal «Si algo molesta a quien corresponde, se baja y listo» (`D-14`).
- Re-corrida en `6cccc1a` sobre el HTML de las cinco páginas: `cansa`, `algod`, `tapón`, `oído`, `volumen`, `aturd`, `ensord`, `zumb` y `demasiado fuerte`, 0; `molest`, 5 (el pie legal). `notaInterna` no está en ninguna página.
- Las cadenas literales «El volumen cansa los oídos» y «algodón» viven solo en la `notaInterna` de `EJ-052` (el JSON fuente, que no se publica). La de `EJ-040` trae «nunca cansa el volumen» y «a todo volumen».
- *Objeciones de los verificadores a la lectura original:* eran «113 textos» (son 108; 113 contaba los 5 id de momento); `EJ-042` B «Me tapo con un amigo» (es la A; la B es «Miro llover contra el farol»); «solo el pie legal» en las cinco páginas (la postal `cu-3` trae también «Radio bajita»); y la cita de las literales a `EJ-040` y `EJ-052` (están solo en `EJ-052`).

### 5. Criterio 9 de `US-06`, condición por condición

«Si falla una, el plano no se da por bueno.» Medido sobre 104 casos en el navegador (a `d2e332e` y re-corrido en `6cccc1a`: 0 fallas en los dos) y sobre los tests. **Pasan las siete.**

| # | Condición | Veredicto | Cómo |
|---|---|---|---|
| 1 | El mismo mapa para todos | **Pasa** | `planoFijo(banco)` recibe un solo parámetro (`partida.ts:226`) y `partida.test.ts` («el plano es fijo…», `planoFijo.length === 1`) está en verde. En los 104 casos el orden arriba-izquierda, arriba-derecha, abajo-izquierda, abajo-derecha es `CU-1`, `CU-2`, `CU-3`, `CU-4`, con y sin enlace. Luz arriba de la raya y Oscuridad abajo; Orden a la izquierda y Caos a la derecha. |
| 2 | La tuya, con borde y sello; la del amigo, punteada | **Pasa** | Estilos computados: la tuya `solid 3px` más sello «Esta noche»; la del amigo `dashed 2px` más «Quien te lo mandó»; la misma `dashed 3px` más los dos sellos; el cuadrante sin marca `border none`. `estilos.test.ts` exige las dos reglas (616-617). La marca sale solo de borde y sello: ninguna regla toca color ni letra. |
| 3 | Los cuatro miden y pesan lo mismo | **Pasa (medido, no testeado)** | En los 104 casos los cuatro cuadrantes tienen el mismo ancho y el mismo alto a 0,1 px. El alto común cambia con el caso, de 81 a 149 px, y es el mismo para los cuatro de ese caso. Una sola combinación de letra en los cuatro nombres (12,8 px; en `6cccc1a` la de *Luzbelito*, `D-67`; antes Archivo Black 400). Letra mínima 12 px. Sin desborde, sello cortado ni texto cortado. El eje vertical cae a 0,0 px del centro de la cruz. Ningún test repite la igualdad de tamaños, como dice el propio criterio. |
| 4 | Sin número, punto ni graduación | **Pasa** | `/\d/` sobre texto más `aria-label`: false en los 104. 0 elementos punto, svg, img ni canvas. En `juego.css` los ejes son dos `span` vacíos con `border-right` / `border-top`. El único pseudo-elemento del bloque es `.ejes-plano::before` (la cinta). En el bloque no hay gradient, blur, filter, hex, transition, animation ni `box-shadow` (releído en `6cccc1a`). La lectura de «marcas» que el criterio asigna a `revisor` está hecha. |
| 5 | Ningún color por manera ni por rincón | **Pasa** | El `rg` no devuelve nada, y se leyó el bloque entero: solo `--tuya` y `--suya` tocan borde y relleno. |
| 6 | Nada que ordene en el texto del lector | **Pasa en lo medible; queda una reserva que el criterio no pide cerrar** | El texto de 44 casos en el navegador es igual al derivado de los polos y a `textoDelPlano()`. El lugar que dice es el lugar que dibuja, también con enlace. Con las palabras vedadas, 0 coincidencias. Chromium (CDP, `Accessibility.getFullAXTree`) expone una `image` con ese nombre. Lo que nadie oyó es VoiceOver o TalkBack (`UX-38` §10.4 sigue abierto). |
| 7 | No viaja ni estorba | **Pasa** | Los dos `rg` están vacíos y ninguna página de `dist/` trae `ejes-plano` en el HTML (se arma por JS). A/B con el plano sacado del DOM: «Compartí» y «Empezá otra noche» no se mueven. Cero enfocables adentro. **El fallo sí se forzó** (ver «Pantalla y plano»): con el fallo, el resto de la pantalla queda idéntico. |

### 6. `UX-38` §10: qué se puede tildar

- **Se puede tildar** (medido en esta revisión; lo tilda el hilo):
  - §10.1 «Debajo de 18 rem el plano no se ve y la grilla sí». A 240, 280 y 287 px: plano `display:none`; grilla `block`, una columna (208, 248 y 255 px), las 4 celdas visibles y dentro de la ventana, sin desborde, con la tuya primera. A 288 el plano ya está (251 de ancho).
  - §10.1 «De 288 a 320 px». Medido en 288, 292, 300, 310, 319 y 320 (4 maneras × sin enlace, opuesta y misma): 0 desborde, 0 texto o sello cortado, polos sin solaparse, letra ≥ 12 px. Alturas del recorte: 331 a 362 sin marca; hasta 389 con enlace; hasta 464 con la misma a 288 y 300; 405 a 436 a 310 y 319. A 288 el sello «QUIEN TE LO MANDÓ» parte en tres renglones dentro de su caja.
  - §10.1, §10.2 y §10.3 en lo que ya estaba: alto del recorte, «Ronda en cualquier esquina», sello a 320, tableta; nombre igual al h2, nombres del plano iguales a los de la grilla, `r=CU-9` y `g=quiz&r=CU-2`; sin dígitos, pie con *Luzbelito* una vez.
- **Hecha en aproximación:** §10.4, el recorrido lineal con lector. Árbol de accesibilidad de Chromium (CU-3 con enlace de CU-2 y de CU-4 sin enlace): heading «nombre» (h2) → polos → línea que nombra → bajada → botón «Compartí» → botón «Empezá otra noche» → región «Las cuatro maneras» → h3 → «Cuatro puntas de la misma hoja.» → [párrafo de contraste, si hay enlace] → **imagen «Dos ejes en cruz. Arriba, Luz…»** → lista «Las cuatro maneras, con la tuya primero.» → «Bajá la tarjeta» → «Volvé al fichín». O sea, después del contraste y antes de la grilla. Orden de Tab (14 pulsaciones): Compartí → Empezá otra noche → cuatro `summary` de la grilla → Bajá la tarjeta → Volvé al fichín → Mirá los créditos. Cero paradas en el plano. Medido a `d2e332e`; el marcado del plano no cambió después (`partida-dos-ejes.ts` solo perdió el `data-quedan` de la hoja, que es de `D-64`).
  - *Objeción de los verificadores:* el lente escribió «~55-60 nodos de texto estático bajo la image». Son 55 a 60 descendientes en total; solo 13-14 son `StaticText`. La conclusión (cero enfocables) se sostiene. El `ariaSnapshot` de Playwright muestra además el texto de los hijos porque no aplica la regla de hijos presentacionales: sirve para el orden, no para lo que oye un lector.
- **No se puede tildar:** lector real (VoiceOver, TalkBack), contraste forzado de Windows real, texto del sistema real al 200 %, teléfono real, Safari, Android de gama baja, y si «arriba» se lee como acierto.

## Hallazgos

Trece fichas: `FIND-119` a `127`, `130`, `131`, `132` y `133`. Todas en **baja**; en `FIND-119` a `123` un voto dijo media. `FIND-128` y `FIND-129` están quemados. Las líneas de `d650eb8` que cita cada ficha se dicen como tales.

### `FIND-119` — `EJ-049`: «Grito con el resto» es la entrega total de `BR-36` · **baja** (un voto dijo media) · cerrado

- **Criterio:** `BR-36` «Ninguna opción es más de adentro» (marca: «la entrega total (en el medio, a los gritos)»). `BR-38` la deja en pie y le suma otras marcas.
- **Evidencia** (`d650eb8`): `src/data/dos-ejes.json`, `EJ-049` (enunciado en la línea 650): «Hay humo y merca dando vueltas. Entran los instrumentos.» A «Grito con el resto» (luz) / B «Canto para adentro» (oscuridad).
  - La línea que canta del momento, «Golpe en el pecho y todos cantan.», deja la A como lo que hacen todos y la B como la excepción. En la prueba del que no fue, la A se adivina sin dudar.
  - Los otros dos luz de la celda («Escucho cómo la canta», «Lo paso y aplaudo») no llevan esa marca. Por eso se puede reescribir.
  - `REV-19` dejó la A «para el oído» por otra pregunta: si gritar es una capacidad del cuerpo (veto 5 de `BR-36`). No por entrega total.
- **Lo que no se confirmó:**
  - La lectura de «Canto para adentro» como contención frente a la merca. La B no toca la merca ni el efecto, y la vuelta 7 la cambió justamente para sacar esa lectura.
  - Que «luz con consumo en el enunciado» sea un patrón. Eso se apoyaba en el hallazgo de `EJ-029` y `EJ-048`, que se refutó.
  - Tampoco es «casi palabra por palabra» la marca de `BR-36`: falta «en el medio» y no hay «hasta».
- **Dueño:** `contenido`.
- **Propuesta:** cambiar la A por una luz que sea de gente y no de volumen ni de entrega, o llevar el par a qué se atiende (la voz, lo que pasa en la sala) en vez de cuánto se da.
- **Votos:** reproducción, real, baja («se reproduce a medias»: texto y guardas confirmados, la B como contención no). Criterio, real, media: `BR-36` lo pide casi con esas palabras, y «todos cantan» hace de la A lo que hacen todos.
- **Estado en `6cccc1a`:** cerrado. El par hoy es «Festejo con el resto» (luz) / «Canto para adentro» (oscuridad), en dos vueltas (`9107920`: «Canto con el resto» / «Sigo la batería», que se descartó; `f9b21fd`: el par vigente). La lectura del banco lo releyó (ver «Lo que quedó de `EJ-049`») y no encontró la marca. Queda una reserva de oído, en Diferidos.

### `FIND-120` — `UX-38` v1.1 dice «la versión construida» y describe lo anterior · **baja** (un voto dijo media) · cerrado

- **Criterio:** `UX-38`, cabecera («v1.1 — la versión construida… Esta versión describe lo que hay»). `D-62` enmienda 3, consecuencias («`experiencia` lleva `UX-38` a la versión construida»). Precedente: `REV-18` `FIND-109` y `REV-19` `FIND-118`, donde un papel que no dice lo que el código ya hace es baja.
- **Evidencia** (`Docs/UX/UX-38-el-plano-de-dos-ejes.md`, líneas de `d650eb8`; `experiencia` la puso al día en `ae1fc7f` y `d0b57dd`):
  - **§5, líneas 489-493:** el ejemplo del lector usa punto y coma entre polos y «La tuya, arriba a la izquierda: Mesa larga a las nueve.» Lo construido (`copy.ts:161-167`, `aria-label` medido en los 12 casos) dice «Dos ejes en cruz. Arriba, Luz, con la gente. Abajo, Oscuridad, … Tu manera, arriba a la izquierda: Mesa larga a las nueve.», con puntos entre polo y polo.
  - **Líneas 163 y 496-497:** seguían diciendo que `contenido` «la confirma o la cambia (`T-352`)» y que `voz.test.ts` saltea `altPlano` en silencio. `CNT-31` §13 ya la confirmó.
  - **G10, línea 585:** «No… El texto que oye el lector no lo vigila nadie». Desde `3b4ae32` lo vigila `copy.test.ts` (6 tests sobre 20 casos). La sugerencia `UX-para-contenido-altplano-sin-auditoria.md` ya estaba marcada «Resuelta».
  - **§8.2:** la fila de `T-352` (594), la ficha `HILO-para-contenido-el-texto-del-plano.md` (595, ya `[Resuelta]`) y el criterio 3 de `US-06` (593, lo hizo `717515c`) seguían como pendientes.
  - **«Consume» (24-30):** citaba `US-06` «criterios 3 y 4c» y ningún criterio 9. *(Opcional, un solo voto.)*
  - **Agravante:** `UX-38` v1.1 entró en el mismo commit `3b4ae32` que cambió `copy.ts`.
- **Lo que no cuenta:** «hilo: 1525» en §10.0 (línea 667). La misma frase dice que el número lo da la corrida, y hoy `npm test` da otro. Los dos votos de criterio lo descartaron (los dos de reproducción lo sostenían).
- **Dueño:** `experiencia`.
- **Propuesta:** poner en §5 el texto vigente de `copy.ts` (`CNT-31` §13); cerrar las filas de §8.2 que ya se hicieron; pasar G10 a «Hecho (`copy.test.ts`)»; dejar abierto solo el chequeo con un lector real; (opcional, un solo voto) citar el criterio 9 de `US-06` en «Consume»; el hilo actualiza el número de la suite al tildar §10.
- **Votos** (lo encontraron dos lentes, cada una con sus dos verificadores): papeles, reproducción: real, media. Papeles, criterio: real, baja (no hay efecto en la experiencia; mismo patrón que `REV-19` `FIND-118`). Pantalla, reproducción: real, baja. Pantalla, criterio: real, baja; rebatió el punto del 1525 y la cita a `CLAUDE.md` §8, que habla de `ESTADO.md` y no de las hojas de cada rol.
- **Estado en `6cccc1a`:** cerrado. `UX-38` cita `FIND-120`, trae el texto vigente, G10 «Hecho», `T-352` y `T-351` cerradas, «0 avisos y 14 hints». Lo que `UX-38` todavía no dice: `FIND-133` y «Sin consenso» 22.

### `FIND-121` — `D-62` enmienda 2 decía que el plano está «escondido al lector de pantalla» · **baja** (un voto dijo media) · cerrado

- **Criterio:** `US-06` criterio 9, condición 6 (quien usa lector recibe lo que recibe quien ve). `D-62` enmienda 3, consecuencias (`T-352`: el texto del lector). Coherencia decisión y código (`CLAUDE.md` §2 punto 4).
- **Evidencia** (`d650eb8`): `Docs/DECISIONES.md:3499-3501` decía «Es HTML, no SVG, y está escondido al lector de pantalla, que ya oye lo mismo en la hoja y en la grilla».
  - Código: `src/scripts/partida-dos-ejes.ts:264-275` (`role="img"` y `aria-label`) y `src/lib/dos-ejes/copy.ts:153-167`. Con el dist servido y una partida jugada hasta el resultado, `.ejes-plano` tiene `role="img"` y no tiene `aria-hidden`.
  - `UX-38` §5 (488-513) prueba que la grilla no dice los ejes ni dónde cae la tuya.
  - El cambio de código (`2fc87b8`) es posterior a la enmienda 2 (`2490120`). La enmienda 3 habla del «texto del lector» y la 2 seguía diciendo lo contrario.
- **Lo que no se confirmó:** que el punto «Relativo, como la grilla» necesite marca en su lugar. La enmienda 3 lo reemplaza por escrito.
- **Dueño:** hilo principal (`Docs/DECISIONES.md`).
- **Votos:** reproducción, real, media. Criterio, real, baja: ninguna decisión del usuario pide el plano escondido; defecto de papel frente a código, como `REV-19` `FIND-118`.
- **Estado en `6cccc1a`:** cerrado al integrar (`49d9ea0`). La enmienda 2 lleva la nota «(Se escribió "escondido al lector de pantalla"; … el plano quedó `role="img"` con su texto…)». `isla.test.ts` (G6) frena la vuelta a `aria-hidden`.

### `FIND-122` — `ESTADO.md`, bloque del ciclo 19: lista como abierto lo que ya cerró · **baja** (un voto dijo media) · cerrado en parte

- **Criterio:** `CLAUDE.md` §8 («No dejar `ESTADO.md` desactualizado»). Cabecera de `ESTADO.md` («si esto y el disco no coinciden, manda el disco»).
- **Evidencia** (`d650eb8`): línea 48, «1525 en verde», contra 1531. Líneas 53-54: `T-352` abierta, aunque `CNT-31` §13 la confirma, `copy.ts:149-151` dice «Confirmada por contenido» y `copy.test.ts` la guarda. Línea 59: «`UX-38` v1.1» como pendiente, cuando el documento existe. Líneas 30-31: «Tres vueltas de verificación adversarial; la última, sin hallazgos altos», cuando `CNT-31` documenta dos. Lo que seguía abierto de `T-352`, oír la cadena en un lector real, no figuraba.
- **Dueño:** hilo principal.
- **Votos:** reproducción, real, media. Criterio, real, baja: `CLAUDE.md` §8 obliga «al terminar una sesión» y la sesión seguía abierta; lo que no podía quedar era la frase de las tres vueltas.
- **Estado en `6cccc1a`:** cerrado al integrar (`49d9ea0`): «1525» y la frase «Tres vueltas de verificación adversarial» ya no aparecen, y el lector real figura entre lo que queda abierto. **Pero el bloque «REV-20 quedó a medio camino» (`ESTADO.md` 142-155) dice 1531 y describe el par viejo de `EJ-049`:** lo actualiza el hilo al cerrar esta revisión.

### `FIND-123` — «`D-59`» nombraba dos decisiones dentro de la misma rama · **baja** (un voto dijo media) · cerrado

- **Criterio:** `Docs/IDS.md` («no se reutiliza un número»; el prefijo `D-` lo escribe la sesión principal).
- **Evidencia** (`d650eb8`): `Docs/DECISIONES.md:3396` definía `D-59` como la noche ricotera. `D-60` citaba «`D-59` de la rama `dominio/fichinricotero`» con calificador (3534-3537) y sin calificador en 3560 y 3586; en la rama, esas citas caían en la noche. `ESTADO.md:172` y `177-178` y `Docs/SUGERENCIAS/HILO-para-todos-el-sitio-se-llama-fichin-ricotero.md:58-62` lo decían sin nombrar quién ni cuándo. `IDS.md:47` reservaba `D-59` para el ciclo 19.
- **Dueño:** hilo principal, con el usuario por la rama del dominio.
- **Votos:** reproducción, real, media: las citas sin calificador resuelven a la decisión equivocada. Criterio, real, baja: rebatió que «la del dominio no tiene fila» y que «el dueño falta»; quedaba real elegir cuál renumera.
- **Estado en `6cccc1a`:** cerrado. La noche pasó a `D-62` al integrar (`49d9ea0`); el encabezado de `D-62` dice «Se escribió como `D-59` y se renumeró al integrar (2026-10-05)». La sugerencia `HILO-para-todos…` lleva la marca «[Resuelto 2026-10-05…]» (`eda8e86`). `IDS.md` lleva `D-62` en la fila del ciclo 19 (`6cccc1a`). Los commits viejos de la rama siguen diciendo `D-59` por la noche.

### `FIND-124` — `BR-38` da por abierto un hueco que ya cerró un test · **baja** · cerrado

- **Criterio:** `BR-38` «Quién vigila qué» y «Huecos conocidos» (`Docs/PRODUCTO/PRD-alcance-v1.md`, líneas de `d650eb8` 2231, 2260 y 2280-2283).
- **Evidencia:**
  - PRD 2231: «Quién lo cuenta. Hoy, nadie (hueco 1)». PRD 2282-2283: «Lo sucio por celda: ningún test lo cuenta».
  - Pero `src/lib/dos-ejes/banco.test.ts:303-312` («cada celda momento × eje trae lo sucio en algún enunciado») y `:314-316` («lo sucio no se cumple con la merca») existen desde `4dbc8b3`.
  - La tabla de la línea 2260 enumera `VETOS_DE_LA_NOCHE` como tragedias, personas de la banda, policía, seguridad, épica y psicodelia. El test tiene una más, «la música que molesta» (`banco.test.ts:207-219`, con su «sabe ver» en 279).
  - `rg -i "volumen|nunca cansa|molest" Docs/PRODUCTO/PRD-alcance-v1.md` no devuelve nada.
- **Lo que no se confirmó:** que `BR-38` o el criterio 7 de `US-06` tengan que traer la regla del volumen. `D-62` enmienda 1 solo encarga la guarda y no le asigna nada a producto.
- **Dueño:** `producto`.
- **Propuesta:** marcar el hueco 1 como cerrado por el test, sin borrar, y sumar la sexta lista a la tabla «Quién vigila qué». Los huecos 2 a 6 siguen abiertos y son de lectura de `REV-20`.
- **Votos:** reproducción, real, baja. Criterio, real, baja: rebatió que la enmienda 1 le pida nada a producto.
- **Estado en `6cccc1a`:** cerrado (`301cc39`; `6b1beeb` agrega «Lo que `REV-20` leyó del banco» y los huecos 2 a 7 leídos). Quedan dos papeles viejos del propio PRD: «Sin consenso» 18 y 20.

### `FIND-125` — `CNT-31` dice «ninguna guarda» donde ya hay una · **baja** · cerrado

- **Criterio:** `CNT-31`, cabecera (describe el banco como queda; si una guarda dice otra cosa, «manda el de ellos y se vuelve acá»).
- **Evidencia** (`d650eb8`):
  - `Docs/CONTENIDO/CNT-31-la-noche-ricotera.md`, líneas 95 y 237: «Ninguna guarda lo cuenta». Línea 285: «una guarda para el piso de lo sucio por celda». Contra `banco.test.ts:303`.
  - `Docs/SUGERENCIAS/CNT-para-hilo-principal-noche-ricotera.md` no tenía marca de aplicada, aunque se aplicó casi todo: `LUGARES.dosEjes` y la baja del casete (`src/lib/sitio/copy.ts:133` y `196-198`), las tarjetas regeneradas (`a596435`), la guarda de lo sucio (`4dbc8b3`), la del volumen (`62cd0e1`, con una lista más angosta que la propuesta).
- **Lo que no cuenta:**
  - «Las 24 pruebas» (líneas 6 y 10; hoy son 31 `test()` de primer nivel) describe contra qué se midió en ese momento. `CNT-30:19` («57 de 60») es una nota de remisión. Marcar `[Aplicada]` es costumbre, no regla escrita (91 de 141 sugerencias no llevan marca).
  - `CNT-31` §13 (455-457, «Propongo la guarda»): un voto lo lee como el registro de una propuesta ya marcada `[Aplicada]`.
- **Dueño:** `contenido` (`CNT-31`). El hilo principal puede marcar la sugerencia (opcional).
- **Propuesta:** `contenido` actualiza las frases de «ninguna guarda» (95, 237, 285). El hilo marca la sugerencia como aplicada, dejando dicho que la guarda del volumen entró con otra lista (`banco.test.ts:207-210`).
- **Votos:** reproducción, real, baja. Criterio, real, baja: queda real solo «ninguna guarda».
- **Estado en `6cccc1a`:** cerrado (`9107920`, `2d61d7d`, `d2e332e`: marcas fechadas, sin borrar). La sugerencia lleva «Aplicada, reabierta y resuelta». Quedan tres cosas chicas de `CNT-31` en «Sin consenso» 15, 16 y 17.

### `FIND-126` — `PRD-alcance-v1.md` cita `UX-38` §2.1 y esa frase ya está en §2.4 · **baja** · cerrado

- **Criterio:** trazabilidad de citas (`Docs/IDS.md`). `PRD-alcance-v1.md`, nota de revisión 2026-10-05 (125-127): la excepción «está marcada» en las frases que decían «no cambian».
- **Evidencia** (`d650eb8`):
  - PRD 1531-1533 (la cita está en 1532): «`UX-38` §2.1 había descartado esta misma disposición («la jerarquía del rombo con otro dibujo»)». En `UX-38` v1.1 esa frase está en §2.4 (línea 274). §2.1 es ahora «Lo que se eligió y lo que cuesta».
  - En la v1 (`4dc3657`) era §2.1 (línea 170). El PRD (`717515c`, 03:07) es anterior a `UX-38` v1.1 (`3b4ae32`, 03:14).
  - Segundo resto, **un solo voto lo sostiene**: PRD 1494-1495 (enmienda segunda) dice «Los criterios 1 a 6 y 8, y `BR-17`, no cambian» sin la marca `[Matizado 2026-10-05]`, aunque el criterio 3 tiene la excepción. El otro voto dice que esa frase es de la enmienda del 2026-10-04, que su alcance sigue cierto, y que la nota 125-127 solo prometía marcar dos frases.
- **Dueño:** `producto`.
- **Propuesta:** corregir la cita a `UX-38` §2.4. Marcar 1495 es opcional.
- **Votos:** reproducción, real, baja (cita rota confirmada; la marca faltante es de coherencia, no incumplimiento literal). Criterio, real, baja (la cita está rota de verdad; la otra mitad es débil).
- **Estado en `6cccc1a`:** cerrado (`301cc39`, `6b1beeb`). La cita dice §2.4 con la marca «[Corregido 2026-10-06 (`FIND-126`…)]»; la frase de «no cambian» lleva «[Matizado 2026-10-06…; la sostuvo un solo voto]»; `PRD:130` dice `FIND-126` donde decía `FIND-127`.

### `FIND-127` — `CTR-08` no menciona `planoFijo()` y `D-62` no le asigna nada a `arquitectura` · **baja** · cerrado

- **Criterio:** `CTR-08` v2.5 («Lo que el archivo ya tiene es lo que este contrato fija»). `US-06` enmienda tercera (PRD 1505 y 1583: «el motor, de arquitectura (`planoFijo()` en `partida.ts`)»). `D-62` enmienda 3, consecuencias.
- **Evidencia** (`d650eb8`):
  - `Docs/ARQ/ARQ-schema-dos-ejes.md:412-430` lista la API del motor (`sortearPartida`, `resolverCuadrante`, `disposicion`, `relacion`). `rg -n "plano"` sobre ese archivo devuelve una sola línea (1572, «coordenadas en el plano»), que no tiene que ver. `planoFijo` y `PLANO_FIJO` no aparecen en ningún documento de `Docs/ARQ`.
  - `src/lib/dos-ejes/partida.ts:218-240` exporta `PLANO_FIJO` y `planoFijo()`. Las usan la isla, `copy.ts`, `partida.test.ts` (233, 247) e `isla.test.ts` (105-107).
  - `D-62` enmienda 3 reparte las consecuencias entre producto, experiencia y contenido. No nombra a `arquitectura`, aunque producto le atribuye el motor.
  - `disposicion()`, que también ordena una presentación, sí está en el contrato.
- **Dueño:** `arquitectura` (`CTR-08`), con el hilo principal por las consecuencias de `D-62`.
- **Propuesta:** sumar a `CTR-08` una versión corta que fije `planoFijo()` (sin parámetro de resultado; devuelve celdas, renglones y columnas) y su relación con `disposicion()`. O declarar por escrito que es código de presentación fuera del contrato.
- **Votos:** reproducción, real, baja (con el matiz del `rg`: una línea, no cero). Criterio, real, baja.
- **Estado en `6cccc1a`:** cerrado. `CTR-08` suma `planoFijo()` y `PLANO_FIJO` (`4b6c28b`); `D-62` nombra a `arquitectura` y el texto del lector se arma en `textoDelPlano()` con una guarda del orden de `RESULTADO.lugares` (`798cd54`); las citas dicen `FIND-127` (`f5cde54`). Los `rg` de `CTR-08` E2.6, corridos en el cierre, dan lo que prometen. Queda opcional `E2.4 a` y una inexactitud en `E2.7` (ver «Sin consenso» 19).

### `FIND-130` — La portada a 320×568 deja «Empezá la noche» bajo el pliegue · **baja** · cerrado (reabierto como `FIND-131`)

- **Criterio:** `UX-01` («nada de scroll para encontrar el botón»), `UX-36` §3.4 y `REV-19` `FIND-111` (cierre en 565). A 320 no había tope escrito en `UX-36` cuando se midió; lo escribió `experiencia` después (`#empezar.bottom ≤ 568`, §3.4 y §12.1).
- **Evidencia** (`d650eb8`, antes de la ronda final): `#empezar` va de 533 a 587 contra un viewport de 568.
  - La causa es `LUGARES.dosEjes` (`src/lib/sitio/copy.ts:133`), cambiada en `a596435` de «Entrá con la campera puesta.» (28 caracteres) a «Traés barro seco en las zapatillas.» (35). A 320 ocupa 2 renglones (47 px contra 25). Con la frase vieja el botón termina en 565.
  - A 360 y 375 no cambia (588 y 590). Con Liberation Sans la frase nueva entra en un renglón y el botón termina en 565.
  - No es «la línea del casete»: es el renglón del lugar (`.donde-estas`) de la portada del propio juego.
- **Dueño:** `contenido` (la línea) o el hilo (el relleno de la tapa bajo 22 rem); `experiencia` si cambia el criterio.
- **Votos:** reproducción, real, baja. Criterio, no real, baja (`UX-36` §3.4 daba `UX-01` por cumplida a 375×667 y el corte de 320 nunca entró a `UX-36`). Lo promovió el hilo al arreglarla: regresión del ciclo 19.
- **Estado en `6cccc1a`:** cerrado en `2d61d7d`: «Traés barro en las zapatillas.» (30 caracteres, 5 palabras), un renglón a 320, `#empezar` en 565 con DejaVu. **Ese 565 dejó de valer con `D-67`: ver `FIND-131`.**

### `FIND-131` — La portada a 320×568 volvió a quedar bajo el pliegue después de `D-67` · **baja** · cerrado

- **Criterio:** el mismo de `FIND-130`, ya con tope escrito: `UX-36` §3.4 y §12.1 (línea 1375, `#empezar.bottom ≤ 568` a 320).
- **Evidencia:** el merge `a528bd0` trae `D-67`. El `h1` de la portada pasa de Archivo Black a «Redonditos de Ricota Fan» y crece de 55 a 62 px. El renglón del lugar sigue en un solo renglón, así que acortarlo no lo arregla. Botón «Empezá la noche» (`#empezar.bottom`, DejaVu):

  | Commit | 320×568 | 360×640 | 375×667 |
  |---|---|---|---|
  | `783d430` (antes del merge) | 565 | 588 | 590 |
  | `bc19f8d` (verificador de papeles) | 570 | 592 | 595 |
  | `bc19f8d` (re-corrida del revisor, mismo build) | 569,5 | 592,5 | 595 |
  | `6cccc1a` (re-corrida del revisor) | **561,5** | 592,5 | 595 |

  A 320 quedaba 2 px bajo el pliegue de 568.
- **Papeles que lo dan por vigente, escritos antes del merge:** `UX-36` línea 44, §3.4 (450, 459, «vigente… (hoy: 565)» en 467), checklist 1375 y 1438; `CNT-31` §14.4 (565 y 587); `CNT-para-hilo-principal-lugar-320.md` y `CNT-para-hilo-principal-noche-ricotera.md` («el botón vuelve a 565»). La guarda de `UX-36` §3.4 se repite cuando cambian «el renglón del lugar, el índice o el relleno de la tapa»: no incluye la letra del título, que fue lo que cambió.
- **Dueño:** el hilo por `D-67` (código); `experiencia` para sumar el título a la guarda y poner la cifra vigente en `UX-36`; `contenido` para `CNT-31` §14.4 y las dos sugerencias.
- **Votos:** verificador de papeles, real, baja. Segunda lectura: la re-corrida del revisor (569,5 en el build de `bc19f8d`). No tuvo segundo verificador porque se arregló antes. El hilo lo numeró `FIND-131` (`b86b2db`, `IDS.md`).
- **Estado en `6cccc1a`:** código cerrado en `b86b2db`: debajo de 22 rem, el aire entre la bajada y el botón baja de 24 a 16 px, con una clase propia (`.ejes-empezar`) solo en este juego. Termina en 562 a 320; a 360 y 375 no cambia. Quedan los papeles de arriba, que dicen 565.

### `FIND-132` — `UX-36` da «Empezá otra noche» ≤ 621 y holgura de 66 px a 375×667; en `CU-2` termina más abajo · **baja** · abierto

- **Criterio:** `UX-36` §12.1 (checklist, línea 1384: «Resultado: Compartí y Empezá otra noche terminan ≤ 601 + 20»), §1.2 (línea 160: peor caso 531 y 601, holgura 66 px) y §5.6 (línea 822, «Holgura de 66 px»). El criterio de fondo de §1.2, «Empezá otra noche entra a 375×667», sí se cumple en las dos medidas de abajo.
- **Evidencia:**
  - **Los dos verificadores** (build de `783d430`, antes del merge de `D-67`, Chromium, `getBoundingClientRect().bottom` de «Compartí» / «Empezá otra noche»): a 375×667, `CU-1`, `CU-3` y `CU-4` = 538 / 611; `CU-2` = 574 / 647 (holgura 20 px). A 360×640: 562 / 635 (`CU-1`, `CU-3`) y 598 / 671 (`CU-2`, `CU-4`). A 320×568: 562 / 635, 622 / 695, 646 / 719. Idéntico sin enlace, con enlace de otra manera y con la misma, e idéntico con el plano sacado del DOM (A/B, 4 maneras × 2 ventanas): **no tiene que ver con el plano.**
  - Causa de `CU-2`: el nombre «Ronda en cualquier esquina» ocupa 3 renglones (111 px contra 75) en la letra rotulada. La bajada mide 121 px en las cuatro maneras, así que el hallazgo original sospechaba mal de las bajadas. Con `--fuente` forzada a Liberation Sans, `CU-2` a 375 da 574 / 646: no depende de la pila del sistema. Las cifras de 360 sí dependen de DejaVu.
  - **Re-corrida del revisor en `6cccc1a`** (con el merge de `D-67`, el nombre ahora en la letra de *Luzbelito*): a 375×667, 524 / 597 (`CU-1`, `CU-3`, `CU-4`) y 561 / 634 (`CU-2`). A 360×640: 524 / 597 (`CU-1`), 584 / 657 (`CU-2`), 548 / 621 (`CU-3`, `CU-4`). A 320×568: 568 / 641 (`CU-1`, `CU-3`), 629 / 702 (`CU-2`), 652 / 725 (`CU-4`). Ninguna cifra de `UX-36` §1.2 ni de `UX-38` §3.2 (538 / 611, 562 / 635) es la medida de hoy. A 375, `CU-2` termina en 634 (holgura de 33 px) y sigue 13 px por encima del tope de 621 de §12.1.
  - La cita de línea del hallazgo original (1348) está mal: la casilla es la 1340 en `d2e332e` y la 1384 en HEAD.
- **Lo que no se confirmó:** que `REV-19` informara mal. `UX-38` §3.2 rotula su tabla «Lo medido en `REV-19`» y `REV-19` informó una sola manera; lo más probable es que `CU-2` ya diera 647 entonces.
- **Dueño:** `experiencia`.
- **Propuesta:** corregir el peor caso medido de §1.2 y §5.6 (a 375, 634 con holgura de 33 px en `6cccc1a`; 647 con 20 antes de `D-67`), la casilla de §12.1 (o dejar el tope en «≤ 667» a 375, que es lo que §1.2 promete) y la tabla de `UX-38` §3.2: una cifra por ventana, que cambia con la manera y con la letra. Volver a medir cuando cambie una letra o una bajada. No pide tocar el diseño ni el plano.
- **Votos:** reproducción, real, baja. Criterio, real, baja (papel que no dice lo que hay; `REV-19` `FIND-118`; ninguna decisión de `D-62` toca los botones del resultado).

### `FIND-133` — `UX-38` §4.3 dice que a 360×640 el recorte mide «327 a 334»; con enlace da hasta 362 y con la misma hasta 408 · **baja** · abierto

- **Criterio:** `UX-38`, cabecera v1.1 («Esta versión describe lo que hay») y §4.3 «Lo medido». Precedente: `FIND-120` y `REV-19` `FIND-118`.
- **Evidencia:** `offsetHeight` de `.ejes-plano` a 360×640, 4 maneras (los dos verificadores y la re-corrida del revisor en `6cccc1a` coinciden):
  - sin enlace, 327 (`CU-1`, `CU-3`, `CU-4`) y 334 (`CU-2`);
  - con enlace de otra manera, 331 a 362;
  - con la misma, 378 (`CU-1`, `CU-3`, `CU-4`) y 408 (`CU-2`).
  La fila de `UX-38` §4.3 «360 × 640 | 327 a 334» (línea 454) recoge solo el caso sin enlace; las de 375 y 320 sí separan sin enlace, con enlace y la misma. Quien la lea entiende que a 360 el máximo es 334, y llega a 408. Sin efecto en pantalla: no hay desborde ni nada cortado.
- **Lo que no se confirmó como defecto:** la segunda mitad del hallazgo original. §4.3 («entre 288 y 320 px no hay medida») y la casilla de §10.1 sin tildar eran ciertas cuando se escribieron; la medida es de esta revisión. Es un pedido de puesta al día, no una falta. A 288-300 el recorte llega a 464 con la misma (433 a 464 según la manera; `CU-3` llega a 464 solo a 288 y 292).
- **Dueño:** `experiencia`.
- **Propuesta:** completar la fila de 360 (327 a 362 con enlace, 378 a 408 con la misma) y anotar en §4.3 y §10.1 el tramo de 288 a 320 ya medido (de 331 a 464, sin desborde), para poder tildar «De 288 a 320» y «la grilla se ve bajo 18 rem».
- **Votos:** reproducción, real, baja. Criterio, real, baja.

## Sin consenso

Un verificador dijo real y el otro no (o, del 15 al 21, hubo un solo verificador). No llevan ID. Decide el hilo, y el que decide lo pasa a ficha o lo descarta. Del 1 al 13, el estado es el de `6cccc1a`.

1. **`EJ-040`: «Me dejo llevar» con «los Redondos a todo lo que da»** (lente banco; en media). **Abierto.**
   - Dice: `dos-ejes.json:533`: «En la caravana, los Redondos a todo lo que da. Falta un buen tramo.» A «Lo parto en tramos» / B «Me dejo llevar». La `notaInterna` y `CNT-31` §12 fila 15 ya lo dejan a `REV-20`.
   - Reproducción: real, media. La B no tiene complemento, así que se pega a la música a todo lo que da. Es la devoción de `BR-36`, y tapar «Redondos» no lo arregla.
   - Criterio: no real, baja. Tapada «Redondos» la escena se entiende, así que para `BR-38` es paisaje. `D-62` punto 5 y la enmienda 1 ponen esa música en la noche. Ninguna marca escrita coincide con «Me dejo llevar».
   - Propuesta del lente: sacar la música del enunciado («La caravana avanza de a poco. Falta un buen tramo.») y mudar «los Redondos» a `EJ-036`. No toca las opciones.
   - La lectura de esta ronda: pasa con duda, la B se inclina a caos. Decide el hilo con `contenido`.
2. **`EJ-051`: «su hija grande» junto al porro o la merca** (lente banco; en media). **Decidido por producto el 2026-10-06 (`6b1beeb`): «escena» es la hoja; `EJ-051` no cambia.**
   - Dice: `dos-ejes.json:676`: «Un padre y su hija grande cantan a dúo. La canción se te pega.» El cruce con `EJ-048` (porro) o `EJ-049` (humo y merca) sale en 2 de cada 9 noches.
   - Reproducción: real, media. «La hija grande» puede ser la hija mayor, una nena. Criterio: no real, baja. `BR-38` separa por ítem, no por momento.
   - Producto decidió: leerla por momento obliga a tocar el sorteo (`CTR-08`) o a retirar `EJ-051`, por una imagen que no existe en ninguna pantalla, y la edad no decide nada. Condición nueva: si una hoja trae un chico, el sello y la línea que canta de su momento tampoco traen consumo. `CNT-31` §14.3 lo cierra por hoja.
   - Queda la lectura de oído («¿grande se lee adulta?») y la objeción del 18.
3. **`EJ-054` A «Aviso que llegué» como precaución** (lente banco; en baja). **Sin cambio.**
   - Reproducción: real, baja («Avisá cuando llegues» es el ritual de seguridad de quien vuelve solo). Criterio: no real, baja. El cuarto lugar marca el trayecto, y entre los arreglos de `BR-36` está «a quién se le cuenta»; esta A es el cierre aceptado de `FIND-113` en `REV-19`.
   - La lectura del banco lo deja pasar en V (ver la tabla). Queda como estaba, escrito en `CNT-31`.
4. **`CU-4`: el costo «averiguarlo en el celular»** (lente banco; en baja). **Abierto, arrastra `FIND-116` de `REV-19`.**
   - Reproducción: real, baja. Criterio: no real, baja (el criterio pide forma, no peso; el sitio se juega desde el celular).
   - Producto (`6b1beeb`): los cuatro costos comparten forma, no peso (`D-57` punto 5); `FIND-116` queda como reparo de oído de `contenido`, no como falta de `D-57`. Decide `contenido`.
5. **La vuelta × luz-oscuridad tiene una firma de forma por celda** (lente banco; en baja). **Abierto, sin obligación.**
   - Las tres oscuridad son «Me» más una prenda o gesto del cuerpo; las tres luz son un verbo hacia otro. Reproducción: real, baja («me» sale en 3 opciones de luz y en 5 de oscuridad en todo el eje; la guarda por eje no puede verlo). Criterio: no real, baja (ninguna regla escrita prohíbe una firma por celda; «un verbo hacia otro» es la definición de la luz).
   - La lectura de esta ronda la cuenta como leve (patrón 1 de `BR-36`): no rompe, porque sale un solo ítem por celda por noche.
6. **`EJ-052` junta tres palabras del código en una línea** (lente banco; en baja). **Abierto, sin obligación.**
   - «La misa no para: el pogo sigue y el reviente llega hasta la calle.» Reproducción: real, baja (`voz-ricotera` §3.5: una palabra de jerga por pantalla). Criterio: no real, baja (§3.5 mide lunfardo y solo «reviente» lo es; «misa» y «pogo» son rituales de `D-62` punto 1).
7. **Las cinco líneas que cantan (y «Cuatro puntas de la misma hoja») sin segunda persona ni imperativo** (lente banco; en baja). **`contenido` escribió la excepción; falta llevarla a `voz-ricotera.md` (hilo).**
   - Reproducción: real, baja. Criterio: no real, baja (§4.2 obliga a «la línea grande», y la canta es chica; `CNT-30` §3 las definió sin persona y `REV-19` las dejó pasar).
   - `CNT-31` §14.3 la redacta por la forma: «sin segunda persona ni imperativo: no le habla a quien juega ni le dice qué hace; pueden nombrar objetos, sonidos, el cuerpo o lo que hace la gente de la escena».
8. **Lecturas de oído del banco que no rompen un criterio escrito** (lente banco; ambos votos coinciden en que va a diferidos). **Pasa a Diferidos.**
   - Las seis: (a) `EJ-034` afirma el barro de esa noche; `RES-187` pide no afirmar «siempre hay barro» como dato de quiz y acá no hay quiz. (b) «Yerba» en `EJ-031` y en la canta de la previa se lee mate o marihuana; `contenido` la cuenta como mate. (c) «Guitarra» sale 4 veces (canta de la previa, `EJ-030`, `EJ-057`, `CU-2`) más fogón y yerba. (d) La vereda × luz cumple el piso de lo sucio solo con el humo del puesto de chori (`EJ-041`). (e) `EJ-057` B «Acepto, con el día abierto» suena a trámite. (f) `EJ-047` «canción lenta… ojos cerrados», a cuatro meses del 5 de junio: ternura y no velorio, porque no hay velas ni despedida.
9. **«Ronda en cualquier esquina» (`CU-2`) hace eco con la escena de `EJ-029`** (lente banco; en baja). **Decide el usuario, a lo sumo avisado.**
   - Reproducción: real, baja. Criterio: no real, baja (`D-62` punto 6 deja los cuatro nombres igual; las guardas ya vedan «ronda» y «esquina» en las opciones). La alternativa anotada en `D-57` punto 5 es «Mate en cualquier esquina».
10. **Enunciados de cuatro renglones a 375 y de cuatro o cinco a 320** (lente pantalla; en baja). **Abierto: `UX-36` §4.1 dejó el tope de tres renglones como estaba y lo decide con un teléfono real (§12.6).**
    - Con DejaVu, a 375×667 hay 2 hojas con 4 renglones (`EJ-044`, 74 caracteres; `EJ-047`, 71). A 320×568, 17 de 30 pasan de tres (14 con 4; `EJ-044`, `047` y `054` con 5). Con Liberation Sans (métrica Arial): a 375 ninguna pasa de 3, y a 320 siguen `EJ-044`, `045` y `047` con 4.
    - Reproducción: real, baja (lo firme es 320). Criterio: no real, baja (los 30 cumplen el presupuesto de `UX-36` §9; los cuatro renglones a 375 solo aparecen con DejaVu; a 320 no hay tope escrito).
11. **Portada a 320×568: «Empezá la noche» queda 19 px bajo el pliegue.** **Pasó a `FIND-130`** (ver arriba).
12. **`UX-36` §10.1 todavía dice la portada y la primera hoja de antes** (lente papeles; en baja). **Cerrado por `experiencia`** (`d0b57dd`): marcó las filas 20 y 6 como registro del 2026-10-04, con el lugar y la primera hoja de hoy.
13. **`T-351` a `T-353` sin ficha y verificaciones en aparato real sin dueño nombrado** (lente papeles; en baja). **Cerrado:** `T-351` está cerrada (`2a8d943`, el plano en el lienzo como hoja 16), `T-352` y `T-353` también (`IDS.md`, `6cccc1a`); las comprobaciones en aparato real tienen dueño en `UX-36` §12.6 y `UX-38` §10.5.

**Ronda final** (14 al 22):

14. **Las listas de `banco.test.ts` no cubrían dos motivos escritos: la música que molesta en otras formas, y «trapo» en una opción** (lente banco; baja). **Aplicado por el hilo en `783d430`; quedan tres entradas anchas declaradas.**
    - Dice: la lista de «la música que molesta» (`banco.test.ts:211-222`) dejaba pasar diez frases de queja (probadas con la misma `aparece()`): «Los parlantes cansan los oídos» (la frase de la vuelta 5 de `EJ-052`, que `CNT-31` §12 dice que no vuelve), «El ruido cansa», «Me cansa el ruido», «Me zumban los oídos», «Me queda un pitido en los oídos», «Me tapo las orejas», «Está demasiado alto», «Bajale el volumen», «Que bajen la música», «Me retumban los oídos». Y `BR-38` (línea 2136) pone «los trapos» en «Nunca» para una opción, pero `VETOS_DE_LAS_OPCIONES` no traía `trapo*`. Hoy el banco no cae en ninguno de los dos huecos: 0 de 108 cadenas.
    - Voto 1 (real, baja): reproducido con la misma `aparece()`; las 16 palabras propuestas atrapan los 10 casos con 0 falsos positivos sobre el banco. La propuesta se achica antes de pasar al test: `bajale` suelto caza «Bajale un cambio» (el imperativo de «Le bajo un cambio», que el test protege), `tan fuerte que` caza «Llueve tan fuerte que…», `demasiado alto` caza «El alambrado es demasiado alto», `zumb*` caza «Zumba un mosquito».
    - Voto 2 (no real): `BR-38` acepta este hueco a propósito y por escrito desde `301cc39` («Piso, no techo»; el hueco 7 dice «si aparece una, `revisor` propone la palabra» y no aparece ninguna); que la lista sea más angosta que el motivo no es una contradicción. Con «trapo», `BR-38` está partido: la tabla lo pone en «Nunca» y el detalle del veto 1 lista solo «banda, Redondos, misa, ricotero». La propuesta va contra el motivo en cuatro palabras (`bajale`, `tan fuerte que`, `zumb*`, `trapo*`: «Le paso un trapo a las zapatillas», un trapo para limpiar, en una opción de orden como `EJ-058` A). Lo único con ancla directa es `cansan los oidos`.
    - Estado: `783d430` sumó las palabras, con `bajale el volumen` y no `bajale`. `bc19f8d` dejó escritas en el comentario del test las tres entradas anchas que quedan: `zumb*` caza «Zumba el bombo», `tan fuerte que` caza «suena tan fuerte que llega a la calle», `trapo*` caza «Le paso un trapo». El banco de hoy no usa ninguna. Decide `producto` qué dice el veto 1 frente a la tabla; `contenido`, si necesita una de las tres, afina la lista antes de reescribir la escena.
15. **La cuenta de palabras de la propuesta para `EJ-051`** (papeles, problema 2; un voto; reproducido por el revisor). `CNT-31` §14.3 y la `notaInterna` de `EJ-051` dicen que «Un padre y su hija de treinta cantan. La canción se te pega.» tiene 12 palabras. Tiene 13. El argumento se sostiene igual: el tope es 14. Dueño: `contenido`.
16. **El comando de `CNT-31` §14.8 no corre como está escrito** (papeles, problema 3; reproducido). `rg -n "D-57`? punto 7|…"` lleva un backtick adentro de comillas dobles y bash da `unexpected EOF while looking for matching ``'`. Con comillas simples no devuelve nada, que es lo esperado. Dueño: `contenido`.
17. **`voz-ricotera` §4.2 citado fuera de lugar** (papeles, problema 4; un voto). En `CNT-31` §14.3 y en la nota de `EJ-051` dice que el «te» es la segunda persona «que `voz-ricotera` §4.2 pide en la línea grande». La línea grande tiene techo de 8 palabras (§4.1); el enunciado llega a 14 y es texto largo en `--fuente`. El mismo `CNT-31` usa §4.2 al revés para las cantas. La otra razón, que el «te» mete a quien juega en la escena, alcanza sola. Dueño: `contenido`.
18. **«Lo que `REV-20` leyó del banco» en el PRD (~2542-2590)** (papeles, problema 5; un voto). Dueño: `producto`. Tres puntos:
    - Se adelantaba al hilo: dice «Los cinco lugares: 30 de 30», con reservas solo en 043, 049 y 052, mientras el borrador dejaba `EJ-054`, `EJ-040` y `EJ-051` en «Sin consenso». Con este documento la lectura existe y coincide.
    - Se contradice con `contenido`: PRD:2505 dice «Un solo chico, «su hija grande»»; `CNT-31` la trata como adulta, y el propio PRD dice que la edad no decide.
    - «Escena es la hoja» cita la definición de PRD:2170, que es «todo lo que la gente lee de la noche menos lo que toca: enunciado, sello del momento, línea que canta y bajadas». Incluye las bajadas, que no están en ninguna hoja. Producto puede leerlo así, pero es una decisión suya y no sale de esa definición.
19. **`CTR-08` E2.7, alternativa 1** (papeles, problema 6; reproducido). Dice que la guarda b «no habría que tocarla» si `textoDelPlano` pasara a `disposicion()`. La lógica valdría, pero `copy.test.ts:86` llama a `planoFijo(BANCO)` fijo. Habría que cambiarla para que llame a `disposicion(banco, id)` por cada id. Dueño: `arquitectura`.
20. **Papeles que quedaron viejos después** (papeles, problema 7; un voto; los dos primeros reproducidos por el revisor). Los cambios llegaron después de que los roles escribieran:
    - PRD, huecos 2, 3 y 5: dicen «siguen sin prueba, como propuestas al hilo» (2502, 2537). `bc19f8d` sumó las tres pruebas. Dueño: `producto`.
    - `PRD-para-hilo-principal-br38-guardas-que-quedan.md`: lleva `[Aplicada 2026-10-06]` (línea 3) y dice «Estado: abierta» (línea 9). Marca el hilo.
    - `CNT-para-hilo-principal-lugar-320.md` §2: dice «Abierta… `UX-36:1079` sigue en ≤ 40». `UX-36` §9 ya lo contestó (respuesta en 1114-1122). Marca el hilo.
    - `CNT-para-experiencia-noche-ricotera.md`, fila 11: `experiencia` ya la aplicó, pero no está marcada y sus números de línea corrieron. Marca el hilo.
    - `CNT-para-producto-br38-un-chico-por-item.md`: sigue «abierta» (línea 6) y producto ya decidió que se lee por hoja. `CNT-31` §14.3 y la nota de `EJ-051` dicen «pendiente de que producto la confirme». Su sugerencia dice que lo marca `contenido` y su resumen dice que lo marca el hilo.
21. **`ESTADO.md` e `IDS.md`** (papeles, problema 8; reproducido). `ESTADO.md:146` dice 1531 (hoy 1575) y `:155` cita el par viejo de `EJ-049`. `IDS.md:47` todavía decía «(`D-59`)» y no anotaba `FIND-128` y `FIND-129` quemados ni `FIND-130`: **resuelto en `6cccc1a`**. Queda `ESTADO.md`, del hilo.
22. **`UX-38` no dice lo que `D-64` y `D-67` le hicieron al plano** (sin voto; lo vio el revisor al re-correr en `6cccc1a`). `UX-38` §4.1 y las líneas 388-421 y 653 dicen «sombra dura de 4 px» y el nombre en la letra rotulada. Hoy `.ejes-plano` no tiene `box-shadow` (`D-64`: «la sombra sale de todos lados») y `.ejes-plano-nombre` usa `--fuente-luzbelito` (`D-67`). La línea 762 («sin sombra difusa») sigue cierta. Mismo patrón que `FIND-120`; no pasó por verificadores. Dueño: `experiencia`.

## Lo que se refutó

Los dos verificadores dijeron que no es real.

- **`EJ-029` y `EJ-048`: «seguir en la ronda» como el eje, y «Lo paso» como consumo escondido** (lente banco; en media).
  - `D-62` punto 2 prescribe este modelo con esas palabras: «sumarse a la ronda, que no obliga a tomar, o quedarse con lo propio». `BR-38` lo repite en «Se arregla».
  - «Lo paso» no es tomar ni fumar. Quien dejó lo puede decir, así que tiene las dos salidas.
  - Ninguna B se va de la ronda («Me quedo en la mía», «Miro subir el humo»). La marca «la que no se va de la ronda» no separa A de B.
  - No se dan las formas 2, 4 ni 6 del quinto lugar: la previa tiene `EJ-030` y `EJ-031`, y «Cuando suena» tiene `EJ-047`.
  - `banco.test.ts:321` da verde contando palabras, como dice su propio comentario. Lo demás es la lectura que `CNT-31` §4 le dejó a esta revisión, y está hecha.
- **`EJ-039` B «Pongo una sin mirar» admite «una birra»** (lente banco; en baja).
  - «Te pasan el parlante» fija el referente. «Sin mirar» no tiene sentido con una birra. Las dos opciones se ven juntas en la hoja (`D-57` punto 14), y la A («Elijo la música con calma») fija de qué se habla.
  - «Pongo un tema sin mirar» es inocuo, pero ninguna regla lo pide.
- **`EJ-038` y `EJ-058`: orden es la que protege o limpia y caos la que deja estar** (lente banco; en baja).
  - Las marcas de `BR-38` («la del reviente, la del barro hasta el final, la que no se va de la ronda») no coinciden con «Si llueve, llueve» ni con «Lo apago nomás».
  - En `EJ-058` la suciedad solo la pone la A. `EJ-045` toca el barro en las dos por igual.
  - Que orden anticipe o cuide es la definición del eje (`BR-17`; `D-57` punto 5). `BR-38` pide el patrón «siempre», y uno de quince no llega. (La lectura (e)5 lo deja a vigilar.)
- **`EJ-030`: «junto al fogón» y el veto del fuego** (lente banco; en baja).
  - El veto 2 de `BR-36` es de muertes y tragedias y de lo que las evoca: Cromañón, una bengala en un lugar cerrado. Un fogón de plaza con guitarra es otra imagen.
  - `D-62` recoge el fogón entre lo que trae la investigación (`INV-172`). Producto lo dejó escrito en `BR-38` (`6b1beeb`): el fogón es paisaje y «fuego» sigue vedado.
- **`EJ-034`: afirma el barro como certeza** (lente papeles; en media).
  - `BR-38` «La escena no afirma» veda «en los recitales se…», cifras, fechas, lugares con nombre y «se cuenta que». Dice expresamente que una escena puede tener barro y que es una noche en presente. `EJ-034` habla de la ropa de esa noche.
  - `RES-187` corregido dice que es una inferencia por ausencia de mención. Solo pide no afirmar «siempre llueve» ni «siempre hay barro» como dato de quiz. Acá no hay quiz ni «siempre».
  - La noche ya tiene barro en las cantas («Pies en el barro…», «Zapatillas embarradas…»). El usuario dijo «el recital ricotero es barro», y reformularlo iría contra esa decisión.

La ronda final no refutó nada: lo que salió con un solo voto está en «Sin consenso».

## Diferidos

Lo que no rompe un criterio escrito y no pasó por votos. Quedan sin dueño hasta que alguno los pida.

**Del banco y la voz**
- **`EJ-049`, la reserva de oído del par nuevo.** «Canto para adentro» no tiene objeto y «todos cantan» en la misma hoja inclina «canto» hacia «me la sé», como «Me arrimo y canto» (030 A) y «Tarareo una que me gusta» (035 B). La luz de esa celda es lo que hace la sala: es el costo declarado de que la luz sea «con la gente» (`CNT-31` §14.1). `REV-19` dejó la pregunta «¿*Grito con el resto* se lee como algo que no todos pueden hacer?» para el oído; con el par nuevo cambia de objeto.
- **`EJ-051`:** «hija grande» y su cruce con el porro o la merca (2 de cada 9 noches). Producto leyó por hoja (`BR-38`, 2127-2128 define «escena»). La salida, si cambia la lectura, está en `CNT-31` §14.3.
- **`EJ-047`:** a cuatro meses del 5 de junio, la ternura puede oírse a homenaje. No trae vela, despedida ni velorio. Y su cruce con `EJ-051` (1 de 9) repite «alguien querido canta una canción».
- **`EJ-043`:** «trapo» es todo el enunciado. Tapada la palabra queda «cada barrio ata su ___», y solo se entiende porque «trapo» se infiere de «ata».
- **`EJ-052`:** tres palabras del código en 14 (sin consenso 6).
- **Lo tierno por momento:** la ida y la vuelta no tienen enunciado con alguien querido. No hay piso escrito. Si el usuario lo quiere, es una enmienda a `BR-38` más una escena nueva de `contenido`.
- **Las líneas que cantan sin segunda persona:** la excepción vive en `CNT-31` §14.3 y falta llevarla a `voz-ricotera.md`.
- **Repeticiones dentro de una hoja** (9 de 30, con 049 B): solo 029, 045, 031 y la canta de la previa están declaradas en `CNT-31`.
- **`pogo` es el único título del cancionero que aparece** (*Último bondi a Finisterre*, 1998). Una guarda de títulos tendría que exceptuarlo.
- **`JUEGOS[«¿Qué tipo de ricotero sos?»].baja`** (`sitio/copy.ts:196-198`): la segunda frase tiene 17 palabras contra la mediana de 13 de `voz-ricotera` §3.1. La primera, que es la que se audita, cumple.
- **`BR-38` dice «menos de una noche de cada cincuenta»** sin ninguna escena sucia. Lo medido es 1 en 231 (0,43 %): cierto, pero holgado.
- **`altPlano` dice «Tu manera, …» y no lleva «esta noche»**, que el sello visible sí trae (`BR-37` regla 1; `US-06` criterio 9, condición 6). `CNT-31` §13 lo defiende por escrito. Que lo mire el oído de quien decida.
- **Las tres entradas anchas de `banco.test.ts`** (`zumb*`, `tan fuerte que`, `trapo*`): ver «Sin consenso» 14.

**De la pantalla**
- **Portada a 320 y 375.** El índice «Las hojas de la noche» corta con un punto medio colgando al final del primer renglón («La previa · La ida · La vereda ·» / «Cuando suena · La vuelta»). El separador es un `::after` de cada `li` (`juego.css`) y `UX-36` §3.2 anotó la cuenta sin el punto del final. Es tipográfico; no hay regla escrita. Persiste en `6cccc1a` según el lente (medido a `d2e332e`).
- **Texto del sistema al 200 %.** Emulado con `html{font-size:200%}`, que no es fiel (los `@media` en rem no cambian). Con esa emulación, a 375 la grilla vieja de «Las cuatro maneras» se pasa de ancho (457 contra 375) y a 320 desborda la imagen del pie; el plano queda contenido en ambos. Hace falta probarlo con el ajuste real del navegador (`UX-38` §10.4).
- **«Compartí» a 320×568**, en `6cccc1a`: 568,4 (`CU-1`, `CU-3`), 629 (`CU-2`) y 652 (`CU-4`). Bajo el pliegue en las cuatro (en `CU-1` y `CU-3` por 0,4 px; antes de `D-67` terminaba en 562). Estaba aceptado en el pedido y en `UX-36` §3.2, y el plano, que va después, no lo empeora.
- **La postal a 320×568** deja «Empezá tu noche» bajo el pliegue: 640,7 (`cu-1`, `cu-3`) y 664,7 (`cu-2`, `cu-4`) en `6cccc1a`. A 360×640, 648,1 y 672,1 (aceptado en `UX-36` §3.4 y §12.1). A 375×667 entra: 632,6 y 656,6. Ningún criterio escrito cubre la postal a 320.
- **Ruido de las pruebas:** el 404 de `/_vercel/insights/script.js` en el preview local es esperado (solo existe en Vercel). La banda de grano distinta a los 900 px en las capturas `fullPage` a 1440 es el overlay fijo de `.con-grano`, un artefacto de la captura.
- **Las tarjetas de dos ejes** (`public/tarjetas/dos-ejes/`) escriben el nombre en la rotulada. Es el pendiente que declara `D-67` («pasar el taller a esta letra y regenerar los PNG»).
- **`CNT-31` §14:** el cierre de `contenido` quedó marcado donde corresponde. `CNT-31` §7 dice «165, 165, 167 y 168» con la corrección fechada, y los rótulos de §3 y §6 («todas leyenda», con fichas de `INV-150` que son hecho o testimonio) están corregidos en §14.5.

## Lo que ninguna máquina ve

- **Teléfono real.**
  - Nadie midió brillo, Android de gama baja ni Safari. Tampoco el texto del sistema real, ni una tableta real, ni el tramo de 288 a 320 en un aparato.
  - Todas las medidas de texto salen de DejaVu Sans. De ellas dependen los renglones de los enunciados (sin consenso 10), la portada a 320 (`FIND-130`, `FIND-131`) y las cifras a 360 y 320 de `FIND-132`. Con métrica Arial, a 375 ningún enunciado pasa de tres renglones y, antes de `D-67`, la portada a 320 daba 565 con 3 px de margen. Con la fuente real de `D-67` y el arreglo de `b86b2db`, no se midió.
  - **El recorte a la intemperie con el brillo alto:** ¿se leen los polos en `--papel-tenue` y los ejes? (`UX-38` §10.5, primera casilla.)
  - **¿La gente toca el cuadrante y espera algo?** (`UX-38` §10.5; §9.2, punto 2.) *Casilla que faltaba en el borrador.*
  - **Dos personas con resultados opuestos, con el teléfono al lado:** ¿hablan de un mapa donde cada una cayó, o de quién quedó arriba? (`UX-38` §10.5; §9.2, punto 1.) *Casilla que faltaba en el borrador.*
  - **¿Se confunde alguien porque su manera está en un rincón del plano y arriba a la izquierda en la grilla?** Las dos reglas de lugar, el plano fijo y la grilla relativa (`UX-38` §9.2, punto 3).
  - **¿La gente baja hasta la grilla, o se queda en el plano?** El recorte pesa 327 a 378 px arriba de las explicaciones (`UX-38` §9.2, punto 4).
- **Lector de pantalla real (VoiceOver, TalkBack).** Nadie oyó `altPlano`. Chromium expone una `image` con ese nombre y ningún hijo enfocable, pero eso no es lo que oye una persona. La pregunta que dejó `contenido` en `CNT-31` §13: con puntos entre polo y polo en vez de punto y coma, ¿los cuatro polos se oyen como cuatro frases separadas? Fue un juicio sin oído; si en un lector real se oye bien con punto y coma, se vuelve atrás sin tocar nada más. Sigue abierto `UX-38` §10.4.
- **Contraste forzado real.** Está emulado con `forcedColors:active` en Chromium, en cuatro casos. Se ve lo que tiene que verse, pero no es un Windows en alto contraste real.
- **Si la noche suena ricotera para el usuario.**
  - El oído del lente banco dice que los enunciados sí y las opciones no (unas 10 de 60 tocan la materia). Ya está dicho que eso sale de `D-62` punto 2.
  - Falta que alguien la juegue entera: 18 de 30 enunciados no traen nada de lo sucio (13 si se cuenta lo tierno), y una noche trae en promedio 4,0 escenas sucias. Si eso alcanza para «lo primero no puede faltar» lo dice el usuario, no una prueba.
  - Si lo tierno necesita piso por momento, y si el fogón le suena a fuego (producto lo deja al usuario).
- **Si el rincón fijo del plano se lee como mejor o peor.**
  - Está medido que los cuatro cuadrantes pesan lo mismo, que no hay número, punto, graduación ni color por manera, y que el texto del lector no ordena.
  - No está medido que «arriba» no se lea como acierto. `Mesa larga a las nueve` queda siempre arriba a la izquierda y `Mochila liviana, sin mapa` siempre abajo a la derecha. `CU-3` y `CU-4` quedan abajo para todos, y `producto` pidió leer si alguna de las cuatro maneras se ve más pobre en su rincón, sobre todo esas dos. Eso solo lo ve alguien con el teléfono en la mano.
  - **El cuadrado derecho contra el rombo.** La orientación es la del rombo (`UX-06` §4) y el costo de dejar las dos de luz arriba está aceptado por el usuario (`US-06` tercera, costos 1 y 2). Cómo se lee la forma nueva, solo con el teléfono en la mano.
- **Las lecturas de oído de «Sin consenso» (1, 2, 3 y 6) y de `EJ-049`:** si «Me dejo llevar» se lee como entrega, si «hija grande» se lee adulta, si «Aviso que llegué» se lee como precaución, si tres palabras del código en una línea suenan a sketch, si «Canto para adentro» pide sabérsela.

## Cierre

Al 2026-10-06, HEAD `6cccc1a`, árbol limpio. `git log d650eb8..HEAD` da 55 commits entre los de los roles, los del hilo y los dos merges de `main`.

### Qué se arregló de cada ficha

| Ficha | Qué se arregló | Commit |
|---|---|---|
| `FIND-119` `EJ-049` | Par nuevo «Festejo con el resto» / «Canto para adentro». Papeles de `CNT-31` y de las sugerencias al día. | texto: `9107920` (1.ª vuelta, descartada), `f9b21fd`; papeles: `2d61d7d`, `d2e332e` |
| `FIND-120` `UX-38` | Texto del lector vigente, G10 «Hecho», §8.2, «Consume» con el criterio 9, `T-351` cerrada, número de la suite, «0 avisos y 14 hints», `FIND-120` citado | `ae1fc7f`, `d0b57dd` (`UX-38`); `650f9a9`, `7542573` (`UX-36`) |
| `FIND-121` `D-62` enm. 2 | Nota «escondido al lector de pantalla» corregida; `isla.test.ts` (G6) frena `aria-hidden` | `49d9ea0` |
| `FIND-122` `ESTADO.md` | Bloque del ciclo 19 al día al integrar | `49d9ea0`; **queda 142-155** (ver abajo) |
| `FIND-123` el `D-59` doble | La noche pasa a `D-62`; sugerencia `HILO-para-todos…` marcada; `IDS.md` con `D-62` | `49d9ea0`, `eda8e86`, `6cccc1a` |
| `FIND-124` `BR-38` | Hueco 1 cerrado, sexta lista, criterio 9, huecos 2 a 7 leídos, y las guardas que producto dejó (consumo como verbo, merca fuera de lo que define, dígitos) | `301cc39`, `6b1beeb`, `bc19f8d` |
| `FIND-125` `CNT-31` | «Ninguna guarda» corregido con marcas fechadas | `9107920`, `2d61d7d`, `d2e332e` |
| `FIND-126` `PRD` | Cita a `UX-38` §2.4, `PRD:130` con `FIND-126`, marca del «no cambian» | `301cc39`, `6b1beeb` |
| `FIND-127` `CTR-08` | `planoFijo()` y `PLANO_FIJO` en el contrato; `D-62` nombra a `arquitectura`; `textoDelPlano()` en `copy.ts` con la guarda del orden de `RESULTADO.lugares`; citas a `FIND-127` | `4b6c28b`, `798cd54`, `f5cde54` |
| `FIND-128`, `FIND-129` | Quemados; anotados en `IDS.md` | `6cccc1a` |
| `FIND-130` portada a 320 | «Traés barro en las zapatillas.» (30 caracteres): `#empezar` en 565 | `2d61d7d` |
| `FIND-131` portada tras `D-67` | `.ejes-empezar` con 16 px de aire bajo 22 rem: 562 a 320, sin cambio a 360 y 375 | `b86b2db`, `6cccc1a` |
| `FIND-132`, `FIND-133` | Sin arreglar | — |

Salieron de la lectura sin ficha propia: la música que molesta en primera persona (`0a84d0d`), las diez frases de queja y los trapos en las opciones (`783d430`, ver «Sin consenso» 14), el plano en el lienzo como hoja 16 y `T-351` cerrada (`2a8d943`), los votos de la primera ronda como anexo (`eda8e86`).

### Qué queda abierto, con dueño

- **`experiencia`:**
  - `FIND-132` y `FIND-133`.
  - `UX-36`: cifra vigente de la portada a 320 (562) en la línea 44, §3.4 (450, 459, 467), 1375 y 1438, y sumar el título (la letra y la altura del `h1`) a la guarda que dice cuándo se repite la medida (`FIND-131`).
  - `UX-38`: sombra y letra del plano («Sin consenso» 22).
  - Tildar `UX-38` §10 con lo medido acá: «bajo 18 rem la grilla se ve» y «De 288 a 320» (la tilda el hilo con esta revisión).
- **`contenido`:** `CNT-31` §14.3 y la nota de `EJ-051` (13 palabras, §4.2 mal citado); el comando de §14.8; §14.4 y las dos sugerencias del lugar, que dicen 565 (`FIND-131`). Decidir con el hilo `EJ-040`; el costo de `CU-4` (`FIND-116`).
- **`producto`:** «Lo que `REV-20` leyó del banco» (los tres puntos del 18) y los huecos 2, 3 y 5 que dicen «sin prueba» (20). Qué dice el veto 1 frente a la tabla sobre los trapos (14).
- **`arquitectura`:** `CTR-08` E2.7 alternativa 1 (19). Opcional, del hilo: `E2.4 a`, tres líneas en `partida.test.ts`.
- **Hilo principal:**
  - `ESTADO.md`: 1575 en lugar de 1531; sacar el par viejo de `EJ-049` del bloque «REV-20 quedó a medio camino» (142-155); decir que `REV-20` cerró.
  - Marcar sugerencias: `PRD-para-hilo-principal-br38-guardas-que-quedan.md` («Estado: abierta» con `[Aplicada]`), `CNT-para-hilo-principal-lugar-320.md` §2, `CNT-para-experiencia-noche-ricotera.md` fila 11, `CNT-para-producto-br38-un-chico-por-item.md` (resuelta por hoja).
  - Llevar la excepción de las cantas a `voz-ricotera.md`.
  - Anexar a `REV-20-votos.json` los votos de la ronda final (banco, pantalla y papeles).
- **Usuario:** el teléfono real (lector de pantalla, portada a 320, enunciados, brillo, texto del sistema, Safari y Android); lo tierno por momento; el fogón; el nombre de `CU-2` frente a `EJ-029`; si la noche suena ricotera.

### Notas de cotejo para quien pega

- **`FIND-131`:** el pedido de numeración decía «lo nuevo, desde `FIND-131`». `IDS.md` (`6cccc1a`) y `b86b2db` ya asignan `FIND-131` a la portada después de `D-67`. Acá va así, y lo nuevo que sigue toma `FIND-132` y `FIND-133`.
- **Commits:** el texto de `EJ-049` cambió en `9107920` y en `f9b21fd`, no en `2d61d7d` (que toca papeles y `sitio/copy.ts`). `UX-38` cambió en `ae1fc7f` y `d0b57dd`; `650f9a9`, que en su mensaje dice «UX-38 y UX-36», toca solo `UX-36`.
- **Cifras que cambiaron desde el borrador:** `npm test` 1575 (era 1531), `check` 234 archivos (era 229), líneas del PRD (1537, 2133, 1795/1807/1811), botones del resultado a 375 (524 / 597 y 561 / 634, por `D-67`), portada a 320 (562 con `b86b2db`).
- **Comandos para volver a correr el cierre** (todos en la raíz, sobre `6cccc1a` o posterior): `npm test`; `npm run check`; `node --test src/lib/dos-ejes/banco.test.ts src/lib/dos-ejes/copy.test.ts src/lib/voz.test.ts src/lib/esquemas.test.ts src/lib/pisos.test.ts`; `node --test src/lib/dos-ejes/partida.test.ts src/lib/dos-ejes/isla.test.ts src/lib/dos-ejes/copy.test.ts src/lib/estilos.test.ts`; los `rg` de «Lo corrido». La portada a 320 y el plano se miden con un build servido y Chromium a 320×568, 360×640 y 375×667: `#empezar.bottom ≤ 568` a 320.