# CNT → hilo principal — vuelta 1 de arreglos de `dos-ejes`: lo que hay que pegar y lo que hay que regenerar

- **De:** `contenido`, vuelta 1 del ciclo 18 sobre `CNT-30` y `CNT-29` (2026-10-04).
- **Para:** hilo principal (dueño de `src/lib/dos-ejes/copy.ts`, `src/lib/sitio/copy.ts`,
  `src/lib/dos-ejes/banco.test.ts` y `Docs/DECISIONES.md`).
- **Por qué está acá y no hecho:** ninguno de los cuatro archivos es de `contenido`. El banco
  (`src/data/dos-ejes.json`) y los dos documentos sí, y ya están cambiados.

## 1. Cadenas de `copy.ts` (cuatro cambios, todos de texto)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/dos-ejes/copy.ts`, `POLOS.oscuridad` | `'por cuenta propia'` | `'con lo propio'` | Asimetría de calor: `con la gente` es la palabra con la que el sitio nombra a quien juega (`voz-ricotera` §3.8) y `por cuenta propia` es el cuentapropista (`CNT-30` §6.1) |
| `src/lib/dos-ejes/copy.ts`, `PANTALLA_0.subtitulo` | `…preguntas de cómo sos.` | `…preguntas de cómo la pasás.` | Presentaba el test como esencia, contra `BR-37` regla 1 y `D-57` punto 6 |
| `src/lib/sitio/copy.ts`, `LUGARES.dosEjes` | `'Hay un lugar libre en el micro.'` | `'Nadie te pide nada en la puerta.'` | El micro de larga distancia ya no existe en el banco y el lugar libre es la silla vacía (`CNT-30` §6.4). 7 palabras: entra en el techo de 8 de `voz.test.ts`. Alternativa si suena a chiste: `Pasá, nadie te pide nada` |
| `src/lib/dos-ejes/copy.ts`, `CONTRASTE` | `Con la tuya, comparte «${lo}» y «${oc}».` y las otras tres | `Con la tuya comparte: ${lo}, ${oc}.` / `…comparte: ${lo}.` / `…comparte: ${oc}.` / `Con la tuya no comparte: ${lo} ni ${oc}.` | Tres «con» seguidos y comillas que se leían como nombres (`CNT-29` §3, versión 2). La primera oración y las firmas de las funciones no cambian |

Ninguna prueba compara estos textos (`rg 'comparte|por cuenta propia' src` solo devuelve
`copy.ts` y el comentario de la isla): lo único que los mira es `voz.test.ts`.

## 2. Enmienda de `D-57` en `Docs/DECISIONES.md`

`D-57` (puntos 6 y contrato de datos) dice `Por tu cuenta` para la traducción del polo de
oscuridad. `CNT-30` §6.1 ya se había apartado a `por cuenta propia`, y la vuelta 1 se aparta otra
vez a **`con lo propio`**. El apartamiento solo está escrito en `CNT-30` y en `copy.ts`: conviene
una línea de enmienda con fecha en `D-57`, que es de quien escribe `DECISIONES.md`.

## 3. `banco.test.ts`: palabras que la lectura encontró y el test no tiene

El banco nuevo **no usa** ninguna de estas, así que sumarlas no rompe nada y cierra el hueco:

- En `delatores` (opciones, línea 226): `fij*`, `pensad*`, `pense`, `marcad*`, `vera`,
  `veremos`, `veamos`. Son el vocabulario de orden (*lo fijo, lo pensado, marcado*) y de caos
  (*se verá, veamos, veremos*) que repetían once de las quince opciones de orden-caos.
- Un veto de **vehículo y pasaje** para enunciados y opciones: `micro`, `pasaje`, `colectivo`,
  `tren`. La noche es de cualquiera y un transporte pago es el veto 3 de `BR-36` por el sentido
  (la versión inicial tenía tres micros en la ida).
- En `seguridad` (línea 194): `quien tenga`, `quien me mira`, `quien este`, `quien esté`,
  `a quien me`. Es el veto 6 de `BR-36` por el sentido: la opción de luz no apunta a quien está
  cerca ni a quien mira.
- **Solo en opciones** (no en enunciados, donde `hora` y `camino` son legítimos): `libro`,
  `radio`, `mochila`, `mesa`, `ronda`, `mapa`, `esquina`, `rincon`, `hora*`, `horario*`. Es la
  lista que `CNT-30` §2 marcaba como **(T)** y que el test no tenía; ahora el documento la
  marca **(O)**. Si se suma, `EJ-031` ("Esperás la hora de salir") tiene `hora` en el
  enunciado y por eso la lista no puede correr sobre enunciados.

## 4. Regenerar las tarjetas

`huellaDelTaller()` entra con las **bajadas** de los cuadrantes y con `POLOS`. La vuelta 1 ya
cambió tres bajadas en el banco (`CU-1`, `CU-3`, `CU-4`) y el punto 1 de arriba cambia `POLOS`:
`src/lib/dos-ejes/tarjetas.test.ts` ("el manifiesto está al día…") va a fallar hasta que se
corra el comando que el propio test imprime:

```
npm run generar-dos-ejes
```

Lo corre el hilo principal (`contenido` no tiene con qué: `D-12`). Después, en el mismo orden:

```
node --test src/lib/dos-ejes/banco.test.ts
node --test src/lib/dos-ejes/tarjetas.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/esquemas.test.ts
node --test src/lib/pisos.test.ts
node --test src/lib/dos-ejes/partida.test.ts
```

## 5. Dos cosas que no pido pero conviene saber

- **El orden dentro de un momento no necesita código.** `partida.ts` sortea qué eje va primero
  y qué ítem de cada celda; con tres por celda hay nueve parejas posibles por momento, en los
  dos órdenes. Ningún enunciado del banco nuevo fija un antes o un después dentro de su
  momento: se resolvió con el texto, no con el motor.
- **`voz.test.ts` no mira las `notaInterna`.** Las de los 30 ítems nombran *pogo*, *micro*,
  *velorio* y la banda, porque cuentan por qué se reescribió algo. Si alguna vez un test las
  recorre, hay que dejarlas afuera.
