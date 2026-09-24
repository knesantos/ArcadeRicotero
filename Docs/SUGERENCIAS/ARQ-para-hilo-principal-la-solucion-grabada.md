# De `arquitectura` para el hilo principal — la solución grabada mueve cuatro filas del plan

> 2026-09-22, ciclo 16, `T-263`. `ADR-09` y `CTR-18` están en
> `Docs/ARQ/ARQ-solucion-grabada.md`. Esto es lo que cambia para las tareas que corrés vos, y dos
> avisos para `T-264`. **No toco `Docs/ORQ/` ni `src/`.**

## 1. La decisión que más mueve: la traza no va adentro de `skayboy.json`

Va en **`src/data/skayboy-soluciones.json`**, con schema propio (`ADR-09.2`). Tres motivos en
una línea cada uno: la página siembra `skayboy.json` y así no hay nada que filtrar para que la
traza no viaje al teléfono; el script regraba un archivo que es solo suyo y no reformatea el que
se diseña a mano; y `CTR-16` y `skayboy.schema.json` no se tocan, así que `T-267` y `T-272` ya no
se pisan en ese schema.

## 2. Fila por fila

**`T-266` — el solucionador**

- **Lo que se graba es una traza ensanchada, no la más corta.** La más corta tiene tolerancia 0
  hasta en `NIV-01` (`CTR-18.9`: `["s< 39", "p> 39"]` mide 0, `["s< 60", "p> 39"]` mide 21). La
  duración mínima se imprime aparte (`ADR-09.5`).
- **La traza de a dos no se graba** (`CTR-18.4`). La búsqueda de a dos se puede quedar como
  herramienta: su duración mínima es un dato que `UX-31` quiere, y el script la imprime.
- **Una sola gramática de renglón**, en `src/lib/skayboy/soluciones.ts` (`CTR-18.3`, `CTR-18.11`).
  Si el solucionador ya tiene su propio lector, `T-267` lo muda ahí.
- **Tolerancia exacta en el script, con tope en 60 cuadros**: si llega, imprime `≥ 60`.
- **El cambio de columna de la traza de uno, solo con el que se deja en el suelo.** Coincide con
  tu `§2.1`, pero ahora es contrato: regla 7 de `CTR-18.6`, *el que espera no se mueve*. Ojo con
  el salto guardado: un cuerpo que aterriza con un toque de salto pendiente salta solo en el
  cuadro siguiente aunque ya no tenga dedo (`mundo.ts:343`), y eso rompe la regla 7.

**`T-267` — la traza entra, la isla pasa a paso fijo**

- **Archivos que cambian respecto del plan:** suma `src/data/skayboy-soluciones.json`,
  `src/data/_schema/skayboy-soluciones.schema.json` (texto entero en `CTR-18.10`),
  `src/lib/skayboy/soluciones.ts`, la línea `'skayboy-soluciones'` en la lista de
  `esquemas.test.ts:59-68`, y **una línea en `mundo.ts`**: `export const CUADRO_SEG = 1 / 60`.
  **No toca** `skayboy.json` ni `skayboy.schema.json`.
- **La isla:** acumulador con medio cuadro de fase y tope de `Math.round(PASO_MAXIMO_SEG /
  CUADRO_SEG)` cuadros por tic, lo que sobra se tira (boceto en `ADR-09.1`). `motor.test.ts` suma
  el caso: rojo si `paso(` recibe algo que no sea `CUADRO_SEG`.
- **Los tres rojos a mano, corregidos:**
  1. *"la traza recortada un cuadro"* → **recortada al final** (`"p> 38"`). Recortar el primer
     renglón **no** pone rojo: Skayboy llega igual.
  2. *"dos columnas en el mismo cuadro"* → el renglón `"s< p> 4"`: no pasa el schema ni el lector.
  3. **`GRAVEDAD` +10 % no pone rojo al banco de hoy**: en `NIV-01` nadie salta, y caminando por
     el piso la gravedad no mueve un píxel. Usá **`VELOCIDAD` ±10 %** —la victoria cambia de
     cuadro y cae la regla del último cuadro— o una sala de prueba que salte.
- **La regla 8 (tolerancia) necesita el número de `BR-29`.** Sin él no se escribe con uno
  inventado. *Actualizado el 2026-09-23: ya está. `BR-29` punto 3 pide **10, 6 y 4 cuadros**
  para los escalones 1, 2 y 3; van en `TOLERANCIA_MINIMA_CUADROS` de `soluciones.ts`, con
  `BR-29` citado en cada línea (`CTR-18.12`).*
- **Son once reglas, no diez** *(agregado el 2026-09-22, pasada de coherencia)*. La 11 —ninguna
  caja en `espera`, y ninguna caja andando cuando cambia la columna— la piden `CTR-16.10.5`,
  `.10` y `.11`. Como la 9, se enciende con `T-272`: si la escribís antes, sin cajas pasa en verde.
  `CTR-16.10.10` dice que la suma el primero que toque `soluciones.test.ts` después de `T-272`;
  cualquiera de las dos manos sirve.

**`T-272` — los mecanismos en el mundo**

- **Emite un suceso nuevo, no tres:** el `compuerta` de `CTR-16.10.7`, con `id`, `abierta` y
  `por`; y el `por` de una apertura hecha por una caja es su `empujadaPor` (`CTR-16.10.5`). La
  apertura y el cierre de la paridad son ese suceso. **El cruce no lo emite el mundo**: lo lee la
  cuenta en `soluciones.ts`, cuadro a cuadro (`CTR-18.8`, enmendado).
  > *Enmendado el 2026-09-22 (pasada de coherencia): este punto pedía tres sucesos —`apertura`,
  > `cierre` y `cruce`— con la atribución como un conjunto de cuerpos. `CTR-16.10.7` trae uno
  > solo, con `por`, y manda.*
- **La isla lo tiene que dejar pasar callado.** Hoy `atender()` le manda a `sonar()` todo lo que
  no sea `vuelta` (`partida-skayboy.ts:205-218`), y `CTR-17` tiene tres efectos.

**`T-277` — los cinco niveles**

- **Una traza por nivel, en `skayboy-soluciones.json`**, no dos, y no en `skayboy.json`.
- El `--todos` del script imprime por nivel: duración de la grabada, duración mínima de uno y de
  a dos, tolerancia exacta y el par de paridad. **La paridad ≤ 1 la exige el test sobre el banco
  entero**, así que armar los cinco niveles de una vez evita un rojo intermedio.
- **El par de cada nivel se compara contra la tabla de `CTR-18.8`** *(agregado el 2026-09-22)*:
  0·0, 0·0, 1·0, 0·1, 1·1, 1·1, y 3 a 3 en el banco, que es la de `UX-31 §4` leída con
  `empujadaPor`. Dos cosas de los bocetos de `UX-31 §3` que la grilla tiene que arreglar, y no la
  cuenta: `UX-31 §2` lee la palanca como *"queda abierta para siempre"*, y `CTR-16.10.2` la
  devuelve a reposo si se la cruza caminando para el otro lado —en el boceto de `NIV-03`, Skayboy
  la cruza y después camina hacia A por encima de ella—; y en ese mismo boceto la compuerta
  (columna 8) no queda entre Poligirl (columna 11) y su puerta (columna 13), así que ella no la
  necesita y el 1·0 no aparecería.

## 3. Dos avisos para `T-264`, que tiene abierto `ARQ-schema-niveles.md`

1. **`CTR-16.10` tiene que decir a quién se le atribuye cada apertura.** Sin esa regla, `T-272`
   no tiene qué emitir y la paridad no se puede contar. Y si trae un mecanismo **con reloj**,
   avisame: la traza de uno pasa a necesitar una pausa mínima en cada cambio de columna
   (`CTR-18.12`).
   > *Enmendado el 2026-09-22 (pasada de coherencia): el aviso adelantaba la regla entre guiones
   > y decía "nadie si fue una caja". `CTR-16.10.7` decidió lo contrario —la apertura es del
   > `empujadaPor` de la caja— y es el dueño de la regla: manda. `CTR-18.8` quedó alineado. Y no
   > trajo reloj (su regla 1), así que la pausa en el cambio de columna no hace falta.*
2. **`alternativaSolo` (`CTR-16.6`) pasó de prueba a descripción**: la traza ya prueba que el
   nivel se pasa solo, y el texto puede contar una estrategia distinta de la que usa la traza
   (por ejemplo: dice "la caja tapa la placa" y la traza estaciona al otro personaje encima, que
   también vale). Queda para `T-264` decidir si el campo se queda.

**Y una deuda mía, para cuando `T-264` cierre:** `CTR-16.7` todavía dice que `solo` es "se pasa
solo", y `CTR-16.8` no tiene la fila de los módulos nuevos. Se enmiendan con puntero a `ADR-09.3`
y `CTR-18.11`. No los toqué para no tener dos manos en el mismo archivo en la misma ráfaga (§3 del
plan).

> **Pagada el 2026-09-23, y fue más que un puntero:** `BR-29` retiró `verificaciones.solo`, así
> que `CTR-16.7` pide un solo booleano, `deDos`, y trae el fragmento de schema para pegar.
> `CTR-16.8` apunta a `CTR-18.11`. Lo que eso le suma a `T-272` está en el punto 8 de
> `Docs/SUGERENCIAS/ARQ-para-hilo-principal-lo-que-arrastra-ctr-16-10.md`.
