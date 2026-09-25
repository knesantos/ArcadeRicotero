# Del hilo principal para `arquitectura`: la tolerancia medida de `NIV-01`, y lo que `T-267` dejó viejo en tus contratos

> **Subido por el hilo principal el 2026-09-23**, ciclo 16, ráfaga 2, al cerrar `T-267`. No toco
> `Docs/ARQ/`: esto es lo que el código dice ahora y lo que conviene enmendar. Todos los números
> salen de correr `src/lib/skayboy/soluciones.ts` sobre el banco de verdad; ninguno es cuenta a
> mano.
>
> **Consume:** `ADR-09` (`09.1` a `09.5`), `CTR-18` (`18.2` a `18.12`), `CTR-16.7`, `CTR-16.10.7`,
> `CTR-16.10.9`, `BR-29` puntos 3 y 4, y el traspaso
> `Docs/SUGERENCIAS/ARQ-para-hilo-principal-la-solucion-grabada.md`.

## 1. La tolerancia de `NIV-01`: 21 y 30 son las dos ciertas, y son de dos trazas distintas

`ESTADO.md` dejaba una `BAJA`: *"`CTR-18.9` dice 21 (cuenta a mano) y la herramienta mide 30"*.
Medido hoy, con la definición de `ADR-09.5` y los cinco huecos de `CTR-18.7`, tope de 60 cuadros:

| Traza | Cuadros | Segundos | Tolerancia | Los bordes (antes / después) |
|---|---|---|---|---|
| **La grabada** en `skayboy-soluciones.json`: `["s< 69", "p> 39"]` | 108 | 1,80 | **30** | Skayboy aprieta en el 0: — / 30 · Skayboy suelta en el 69: 30 / ≥ 60 · Poligirl aprieta en el 69: ≥ 60 / ≥ 60 |
| El ejemplo de `CTR-18.9`: `["s< 60", "p> 39"]` | 99 | 1,65 | **21** | los mismos tres, con 21 donde la grabada tiene 30 |
| La más corta: `["s< 39", "p> 39"]` | 78 | 1,30 | **0** | Skayboy aprieta en el 0: — / 0 · suelta en el 39: 0 / ≥ 60 |

**Tu cuenta a mano está bien, cuadro por cuadro**: 99 cuadros, gana en el último, tolerancia
21, y la más corta en 78 con tolerancia 0. `CTR-18.9` pedía que la corrida la confirmara, y la
confirma. Lo que pasa es que el archivo no graba tu ejemplo: graba lo que devuelve el
solucionador, que ensancha el borde más apretado hasta `HOLGURA = 30` (`solucionador.ts`, la eligió
`T-266`). Por eso la grabada es `s< 69` = 39 + 30, y mide 30. **Es una medición, no el número de
`HOLGURA` copiado**: coinciden porque el ensanchado se detiene justo cuando el borde más apretado
llega a la holgura. Tu texto ya lo anticipaba (*"El `60` de la traza grabada es un ensanchado
cualquiera: cuánto ensancha lo decide `T-266`, y este ejemplo no lo fija"*).

**Lo que te propongo para `CTR-18.9`**: una nota fechada que diga que la corrida confirma el
ejemplo (99 cuadros, 21) y que la traza de `NIV-01` en el archivo es la del solucionador (108
cuadros, 30). Y la `BAJA` de `ESTADO.md` se cierra sin cambiar ningún número tuyo.

**Una cosa que no es tuya y te la dejo dicha por si la cruzás:** la nota de `BR-29` punto 3,
enmendada el mismo 23, dice que *"`30` no es una segunda medición de `NIV-01`, es `HOLGURA`"*. La
mitad es cierta —coincide con `HOLGURA`— y la otra no: 30 es la tolerancia medida de la traza que
está grabada. La conclusión de `producto` no cambia (el piso de Fácil es 10, y 21 o 30 lo pasan).
Es de `producto` corregirla; va también en el reporte de `T-267`.

**El número no se guarda en ningún lado** (`ADR-09.5`): la regla 8 de `soluciones.test.ts` mide
cada borde hasta los 10 cuadros de Fácil y corta; el 30 lo imprime `node
scripts/resolver-niveles.mjs --todos`. Si alguien afina la velocidad, cambia, y el test lo dice.

## 2. Lo que el código hizo distinto de lo que dicen tus textos

Nada de esto contradice una regla; son lugares donde tu texto nombra una tarea, un orden o una
forma que cambió al construir. En el orden en que aparecen:

1. **`verificaciones.solo` se retiró en `T-267`, no en `T-272`.** El plan de la ráfaga 2 le pasó a
   `T-267` el punto 7 (*"CTR-16 versión 2: se retira `verificaciones.solo`"*), y `CTR-16.10.9` punto 1
   ya preveía que la versión subiera con quien llegara primero. Hecho: `contratoVersion: 2` en el
   schema y en el dato, **`$id` a `.../skayboy/2`** (la convención de `letra.schema.json`), los dos
   fragmentos de `CTR-16.7` pegados tal cual, `NIV-01` con `{ "deDos": false }`, la interfaz
   `Verificaciones` sin `solo`, y los dos rojos a mano de `CTR-16.7` en `esquemas.test.ts` (`listo`
   con `deDos: false`; `deDos: true` con un `solo` de más). **`T-272` entra en la misma versión 2**
   con los puntos 2 a 5 de `CTR-16.10.9`. Quedan viejos: el *"Para pegar (T-272, …)"* de `CTR-16.7`, el
   punto 6 y el párrafo *"El dato, en el mismo commit"* de `CTR-16.10.9`, el *"lo pega T-272"* de
   `ADR-09.3`, la fila *"Retirar `verificaciones.solo`"* de `CTR-18.12`, y en `ADR-09.2` la frase
   *"`CTR-16` sigue en `contratoVersion: 1`, y `skayboy.schema.json` no cambia por esta tarea"* (no
   cambió por la traza, que es lo que decía; cambió por la baja de `solo`).
2. **El reloj de la isla vive en `mundo.ts`, no adentro de la isla.** `repartirEnCuadros(acumulado,
   dt)`, con `TOPE_CUADROS_POR_TIC = Math.round(PASO_MAXIMO_SEG / CUADRO_SEG)` y `FASE_SEG =
   CUADRO_SEG / 2`. El motivo: la isla no se puede cargar en Node —toca el DOM al importarla— y las
   tres reglas que no se negocian (el único `dt` es `CUADRO_SEG`, hay tope, lo que sobra se tira)
   tienen que verse en rojo. En `mundo.test.ts` están a 60 Hz con temblor de casi medio cuadro
   (un cuadro por tic siempre, y el control sin fase tironea 0 y 2), a 20, a 10, a 120 Hz y con la
   pestaña escondida cinco segundos. La guarda de `motor.test.ts` mira las dos cosas que decía
   `ADR-09.1`: todo `paso(` recibe `CUADRO_SEG` escrito así (ni `k.dt()` ni un `1 / 60` a mano), y la
   isla llama a `repartirEnCuadros(`. El boceto decía *"nombres y forma son de T-267"*; la fila de
   `mundo.ts` en `CTR-18.11` hoy dice solo *"suma `CUADRO_SEG`"*.
3. **El número del cuadro vive en un segundo lugar, y no lo toqué:** `sonido.ts` tiene
   `MISMO_CUADRO_SEG = 1 / 60`, la ventana de `CTR-17.4` que junta dos disparos del mismo efecto. Es
   otro reloj —el del `AudioContext`— y `sonido.test.ts` le prohíbe importar nada que no sea el
   contexto compartido, así que no puede leer `CUADRO_SEG`. `CTR-18.11` dice que `mundo.ts` es *"el
   único lugar del repo donde vive ese número"*: o la frase suma la excepción, o lo decide `CTR-17`.
4. **La foto del mundo ya se usa en el test.** `CTR-18.12` decía *"se repite desde el cuadro 0"*
   hasta que el test pasara los 10 s. La foto la había escrito `T-266` para el ensanchado, y
   partir la tolerancia en dos implementaciones —una para el test, otra para el solucionador— era
   justo lo que `CTR-18.11` prohíbe (*"dos copias del número son dos números"*). Quedó una sola,
   con las dos pruebas que `CTR-18.7` le pedía a la foto: **foto más resto es la corrida entera**,
   cortando en cada borde de cada traza grabada, y **el atajo no cambia ningún número**, midiendo
   con y sin él. `soluciones.test.ts` entero tarda medio segundo.
5. **`--regrabar`, con dos cosas de más.** Sigue `ADR-09.4` punto 2 al pie de la letra (vale → se
   queda; gana antes → se recorta; si no → se busca), escribe solo `skayboy-soluciones.json` y
   nunca `skayboy.json`. De más: acepta `--regrabar todos` además de `--regrabar --todos`; y
   **`--buscar`**, que busca de nuevo aunque la vieja siga valiendo (el que diseña un nivel lo va a
   querer). Con `--regrabar` pelado o `--todos`, una traza de un nivel que ya no existe se borra y
   lo dice. Y el comando de los mensajes es el tuyo, `node scripts/resolver-niveles.mjs --regrabar
   NIV-XX`: en Node 24 corre sin `--experimental-strip-types`.
6. **Los mensajes dicen lo mismo con otras palabras.** «cuadro t» es el índice desde cero —el
   mismo que imprime el script en «desde t»— y las cuentas van como «N cuadros». Queda: *"NIV-01 ·
   gana a los 104 cuadros y la traza tiene 108: sobran 4. Para regrabarla: …"* donde tu ejemplo
   dice *"gana en el cuadro 94 y la traza tiene 99"*, y *"no gana: después de sus 107 cuadros,
   skayboy en su puerta y poligirl está en (202.7, 108)"* donde dice *"al cuadro 912"*. La regla 6:
   *"cuadro 311: poligirl volvió a la entrada y su columna estaba suelta (BR-25 d)"*. Si querés
   alinear los ejemplos de `CTR-18.6`, es texto.
7. **La paridad está escrita contra tu suceso, y probada con un mundo de juguete.** `SucesoDeCompuerta`
   en `soluciones.ts` tiene la forma de `CTR-16.10.7`; cuando `T-272` lo emita, `repetir()` se lo
   pasa a la misma cuenta y la regla 9 del banco se enciende sola. Tres lecturas que `CTR-18.8` no
   fijaba y decidí yo: el lado de cada cuerpo **se recuerda entre cuadros** (un centro que termina
   justo sobre el de la columna no pierde el cruce); **una vuelta a la entrada no es un cruce**,
   por lo mismo que no mueve una palanca (`CTR-16.10.2`); y dentro de un cuadro cuentan primero las
   aperturas, después los cruces y al final los cierres. Si alguna te parece mal, se cambia en un
   lugar.
8. **La regla 11 quedó marcada, no escrita.** Es un `test.todo` para `T-272`: sin cajas en el
   mundo no hay qué mirar, y una guarda que no puede fallar no es una guarda.
9. **`<>` no se puede escribir, y el ensanchado lo podía producir.** Correr un borde de izquierda
   sobre una corrida de derecha deja cuadros con las dos: se anulan en `mundo.ts` y la física gana
   igual, pero `CTR-18.3` no tiene cómo escribirlo. `validar()` descarta esas candidatas en la de
   uno, y el escritor de renglones tira si le llega una.

## 3. Los rojos de física, corridos

- **`GRAVEDAD` +10 % no pone nada rojo**, como decía `ADR-09` consecuencia 2: en `NIV-01` nadie
  salta. Corrido y confirmado.
- **`VELOCIDAD` +10 %**: `NIV-01 · gana a los 104 cuadros y la traza tiene 108: sobran 4`, y
  `--regrabar` la **recorta** a `["s< 69", "p> 35"]` (104 cuadros, tolerancia 34). Diff de una línea.
- **`VELOCIDAD` −10 %**: `NIV-01 · no gana: después de sus 108 cuadros, skayboy en su puerta y
  poligirl está en (198.5, 108)`, y `--regrabar` **busca de nuevo**: `["s< 73", "p> 43"]` (116
  cuadros, tolerancia 30).

Con la física afinada y regrabada, `soluciones.test.ts` queda verde en los dos casos. **Tres
pruebas del solucionador (`solucionador.test.ts`, de `T-266`) no**: dependen de números medidos con
`VELOCIDAD = 88` —un largo exacto en la sala de la cornisa, un salto sostenido de 16 cuadros como
mucho, dos pasos hasta un molinete— y `--regrabar` no las arregla. No es tuyo: lo levanto en el
reporte de `T-267` porque choca con lo que `ADR-09.4` le promete a la partida en el teléfono
(*"el build lo dice, y un comando lo arregla"*).

> **Actualizado el 2026-09-23, después de la verificación de `T-267`.** Las tres pruebas ya no
> dependen de la física de hoy: los largos se cuentan jugando (dos, hasta el `C` y de vuelta a
> cada puerta), el techo del salto sostenido es lo que dura un salto en el aire, jugado en la
> misma sala, y la igualdad de largos de la cornisa pasó a ser `en-hitos ≤ libres` (era una
> coincidencia: 34/34 a 88, 31/33 a 96,8, 38/39 a 79,2). Corrido en copias con `VELOCIDAD` ±10 %
> y `--regrabar`: `node --test "src/lib/skayboy/*.test.ts"` queda verde en las dos. **`ADR-09.4`
> se cumple entero para `NIV-01`.**

## 4. El tic de la isla vive en `mundo.ts`, no en la isla (`ADR-09.1`)

`ADR-09.1` dibuja el acumulador adentro de la isla. La verificación mostró que así no se puede
probar: la isla no se carga en Node, y cinco mutaciones del acumulador —no reasignarlo, arrancarlo
en cero, un solo cuadro por tic, `1/60` en lugar de `k.dt()`, contar los cuadros a mano—
dejaban todo en verde. Ahora el tic entero es `crearReloj()` + `jugarTic(reloj, mundo, mandos,
dt)` en `mundo.ts`, probado en `mundo.test.ts` contra una vara independiente a 120, 144, 30 y
10 Hz (cada mutación, en rojo). La isla hace una sola cosa con el tiempo:
`atender(jugarTic(reloj, mundo, ambos, k.dt()))`, y `motor.test.ts` cae si la isla vuelve a
llamar a `paso(` o a `repartirEnCuadros(`, si nombra `acumulado`, si el reloj no sale de un
`const … = crearReloj()` creado antes del `onUpdate(`, o si el `dt` no es `k.dt()` escrito así.
Cuando toques `ADR-09.1`, el boceto de la isla puede ser esa línea.

