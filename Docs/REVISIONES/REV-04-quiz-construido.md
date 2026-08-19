# REV-04 — El quiz construido, contra los documentos

> Producida por `revisor` el 2026-08-19, tarea `T-43` del ciclo 3.
> Escrita por el hilo principal: `revisor` es read-only por diseño.
>
> **Primera revisión de código del proyecto.** Las tres anteriores fueron de documentos.
> Piezas: `src/lib/quiz/`, `src/lib/desafio.ts`, `src/scripts/partida.ts`,
> `src/pages/index.astro`, `src/styles/tokens.css`, y el `dist/` generado.
> Rango de IDs: `FIND-15` en adelante.

---

## Veredicto

**¿Se puede jugar y compartir?** Mecánicamente sí: build, dev server, 39/39 tests y el
schema pasaban. Se completa una ronda de 8, se ve un resultado y se puede compartir. Pero
se jugaba **sin ninguna señal visual de acierto, error ni rótulo** (`FIND-15`).

**¿El código quedó como quinta fuente de verdad?** Que era el riesgo declarado del ciclo.
**Mayormente no.** `BR-01`, `BR-04`, `BR-05` y las reglas duras de `ADR-01` y `ADR-02`
están implementadas como funciones puras con test, y **los números coinciden con los
documentos, número por número**.

Donde sí se materializó fue en tres puntos que **"pasan" en apariencia y no en los
hechos**: el test de contraste medía tokens que la pantalla real nunca usaba (`FIND-15`),
el payload mandaba más de `testimonio` de lo que `UX-01` v2 aprobó (`FIND-16`), y una
cadena entera de `CNT-05` se reemplazó en silencio por texto inventado (`FIND-17`). Más
uno de los dos comandos no negociables del ciclo, que no pasaba limpio (`FIND-19`).

---

## Hallazgos

### `FIND-15` — Faltaba toda la hoja de estilos del juego · **bloqueante** · ✅ cerrado

- **Criterio incumplido:** checklist de accesibilidad de `UX-01` ("color y forma o ícono,
  nunca solo color"; "el sello se distingue por color e ícono, nunca solo por la palabra").
- **Evidencia:** `grep -rn "insignia|feedback|sello--|es-correcta|es-elegida|tramo--"
  --include=*.css --include=*.astro src` **no devolvía nada**. Las clases sí las creaba
  `partida.ts` (líneas 90, 113-114, 119, 126). Los tokens `--acento-3` (acierto),
  `--acento-4` (error), `--rotulo-leyenda` y `--rotulo-testimonio` solo aparecían dentro
  de `tokens.css` y de su propio test.
- **Lo que lo hace grave:** **el test de contraste de `T-38` pasaba midiendo colores que
  el jugador nunca veía.** Un test verde sobre algo que no está en pantalla es peor que no
  tener test, porque da la impresión contraria.
- **Debilitaba, además, el mecanismo que `D-14` describe como la defensa del proyecto:**
  rotular tiene que **verse**, no solo estar en el JSON.

> **Cierre, verificado.** Nuevo `src/styles/juego.css`, con dos reglas propias.
> **Ni un hex literal**: todo sale de `var(--…)`, porque hay un brand system en curso y
> cuando aterrice reemplaza `tokens.css` sin tocar este archivo — lo que se define acá es
> qué elemento cambia de estado, que es estructura y no marca.
> **Ningún estado se comunica solo con color:** la correcta lleva `✔`, la elegida `✕`, la
> insignia de leyenda un rombo, la de testimonio comillas, y el sello borde punteado.
> Comprobado en el navegador con `getComputedStyle`: insignia en `rgb(201,167,255)` con
> borde de 2px y símbolo `◆`, correcta en `rgb(69,224,192)` con `✔`, borde del feedback en
> `rgb(255,93,143)`. Se agregó `estilos.test.ts`, que **falla si el código crea una clase
> de estado que ninguna regla pinta** — la regresión exacta.

### `FIND-16` — `ubicacion` y `afirmacion` viajaban al cliente · **importante** · ✅ cerrado

- **Criterio incumplido:** `UX-01` v2 ("no se muestran `testimonio.ubicacion` ni
  `testimonio.afirmacion`") y la propia regla que `banco.ts` declara en su encabezado.
- **Evidencia:** `banco.ts:120` hacía `...item.testimonio` completo. Confirmado que el
  texto de los cinco testimonios aparecía literal en `dist/index.html`.

> **Cierre, verificado.** `aPayload` recorta a `{ quien, obra }`, y se agregó el tipo
> `TestimonioVisible` **aparte** en vez de un `Partial<Testimonio>`, para que el
> compilador impida volver a mandar el objeto entero por descuido. Test contra el banco
> real: ninguna `ubicacion` ni `afirmacion` sale en `dist`.

### `FIND-17` — `D2` de `CNT-05` no estaba implementado · **importante** · ✅ cerrado

- **Evidencia:** `partida.ts:174` mostraba `` `${nombre}: ${puntaje}/${total}` ``, que ni
  siquiera compara. `CNT-05` define **tres** variantes: ganó, no alcanzó, empate.
- **Contradecía el propio encabezado de `partida.ts`**, que dice que todo el texto sale de
  `copy.ts`.

> **Cierre.** `comparacion()` en `copy.ts` con las tres variantes. La del medio importa:
> **no dice "perdiste"**, invita a otra vuelta, mismo espíritu que el tramo bajo.

### `FIND-18` — El botón de Spotify no estaba aislado · **mejora** · ✅ cerrado

- **Criterio incumplido:** `RQ-B8` de `ADR-01` ("vive en su propio componente; si borrarlo
  rompe otra cosa, el requisito está incumplido").
- `RQ-B1` a `RQ-B7` **sí se cumplían**, verificados uno por uno.

> **Cierre.** Sale a `src/scripts/spotify.ts`. Importa porque el plan de reversión de
> `ADR-01` es literalmente borrar el componente: que sea barato de borrar es lo que hace
> defendible haber cerrado en deep link sabiendo que la Developer Policy prohíbe juegos.

### `FIND-19` — `tsc --noEmit` fallaba con 13 errores · **importante** · ✅ cerrado

- **Criterio incumplido:** el plan del ciclo declaraba ese comando **no negociable**.
- **Evidencia:** faltaba `@types/node`; los cinco `*.test.ts` no resolvían `node:test`.
  `node --test` pasaba igual porque usa type-stripping, no chequeo de tipos.
- **Nota honesta:** el hilo principal reportó `T-34` como verificada **habiendo corrido
  solo uno de los dos comandos**.

> **Cierre.** `@types/node` agregado; `tsc --noEmit` pasa limpio. Y de paso **encontró un
> error real**: el tipo de `Item` seguía prometiendo los cuatro campos de `testimonio`
> después del arreglo de `FIND-16`. El comando que no se corría era el que iba a atrapar
> el arreglo incompleto del otro hallazgo.

### `FIND-20` — Jerga interna en pantalla · **menor** · ✅ cerrado

- **Evidencia:** la `explicacion` de `QZ-017` decía "que fichó RES-08", y `grep RES-08
  dist/index.html` daba una coincidencia. Para el jugador, "RES-08" no significa nada.
- No era un bug del código: `banco.ts` filtra bien, pero la `explicacion` **sí se muestra**
  y traía el identificador adentro.

> **Cierre.** Reescrita por `contenido`. Revisó el resto del banco contra todos los
> prefijos de ID: **era el único caso**. La trazabilidad no se pierde — la ficha sigue
> citada en `fuentes`, que no viaja como texto visible.

### `FIND-21` — El apóstrofo se filtraba contra lo que dice `ADR-02` · **menor** · ✅ cerrado

- **Evidencia:** `ADR-02` pide filtrar "a letras, números, espacios, guiones y
  **apóstrofos**". `armarLink(…, {nombre: "O'Connor"})` devolvía `OConnor`.
- Se llevaba puestos apellidos reales por una regla que el documento no pedía.

> **Cierre.** Lista blanca Unicode que deja pasar acentos, ñ y apóstrofo. **Y obligó a
> corregir un test**: el de XSS prohibía el apóstrofo, o sea codificaba una regla más
> estricta que el documento. Es seguro porque el nombre se pinta con `textContent`: bajo
> `textContent` un apóstrofo es un carácter, no un delimitador.

---

## Sin hallazgos — lo que resistió el contraste

- **`BR-01`:** verificado con 1000 rondas contra el banco real. Primer ítem siempre
  `facil`, dificultad nunca baja, sin cantidades hardcodeadas.
- **`BR-04`:** `verificarInvariantes` tira error de build si un ítem no tiene exactamente
  4 opciones. 4 en el JSON = 4 en pantalla.
- **`BR-05`:** `tramo.ts` usa los **números**, no el comentario. Test con las 9 filas
  exactas, y confirma que el azar puro (2/8) cae en "bajo".
- **`ADR-02`:** las cuatro reglas duras se cumplen. Desafío inválido se ignora entero, `n`
  se pinta con `textContent`, URL por debajo de 100 caracteres, puntaje ajeno no toca
  `localStorage`.
- **`D-14`, molinetes abiertos:** cero `<input>`, cero `<form>`, sin pedidos de permiso,
  sin cuenta regresiva.
- **`CNT-05`:** **recontado con script**, como `contenido` pidió explícitamente por no
  poder ejecutar nada. Las 25 cadenas entran dentro de su largo máximo y ninguna se
  transcribió mal.

## Sobre el arreglo de `barajarOpciones`, juzgado y no aceptado de oficio

`revisor` verificó por script que **ninguna** de las 30 opciones del banco depende del
orden — no hay "ninguna de las anteriores" ni equivalentes—, así que barajar no rompe nada
hoy.

Y encontró algo mejor: **`CTR-02.3` ya exigía este comportamiento** —"el motor baraja las
opciones para que nadie se apoye en el orden"— **antes de que existiera el código**. O sea
que no fue un parche improvisado: fue implementar un requisito que estaba escrito y que
nadie había ejecutado. **El contenido no necesita reescribirse.**

Queda como riesgo latente que `CNT-02` no prohíbe formalmente un distractor posicional,
pero hoy no es un hallazgo.
