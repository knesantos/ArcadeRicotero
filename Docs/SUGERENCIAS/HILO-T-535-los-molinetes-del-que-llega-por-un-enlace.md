# T-535 — los molinetes del que llega por un enlace: lo que queda para otros

**De:** hilo principal (ronda `T-535` de la pulida de jugabilidad, rama `worktree-pulida-jugabilidad`, PR #118).
**Para:** la sesión dueña de `pulida/juegos-ui`, `experiencia`, `producto` y `contenido`.
**Origen:** `Docs/REVISIONES/REV-24-pulida-jugabilidad/r0-afuera.md` (perfil C, y A-6, B-3) y `r0-experto.md`.
**Fecha:** 2026-11-20. Rama `pulida/juegos-ui` leída en `08207b2`.

Lo construido vive en `src/lib/` con tests; las islas llevan enganches cortos. Este archivo
dice cómo entra cada enganche sobre el rediseño y qué quedó sin hacer a propósito.

---

## 1. Para la fusión con `pulida/juegos-ui`

Los archivos nuevos no chocan (`src/lib/puerta.ts`, `src/lib/quiz/puerta.ts`,
`src/lib/tema/veredicto.ts` y sus tests). En los `copy.ts` se tocó lejos de lo que tocó la
otra rama: `ERRORES` en `quiz/copy.ts`, el final de `tema/copy.ts` (`TRAMOS`, `TITULAR`) y
`sitio/copy.ts`, que la otra rama no toca.

### 1.1 `src/scripts/partida-tema.ts` — cinco enganches, uno choca

| Acá | En `pulida/juegos-ui` | Qué pasa al fusionar |
|---|---|---|
| El `import { tramo }` pasa a `import { tramoDeLaVuelta, titularDeLaVuelta, puertaDeLaVuelta } from '../lib/tema/veredicto.ts'` | misma línea | entra sola |
| `const t = tramo(aciertos, ronda.length)` → `tramoDeLaVuelta(marcador, ronda.length)`, en `pintarResultado` y `compartirResultado` | las dos están iguales, **y hay una tercera** en `dibujarLaTarjeta()` (línea 1913) | las dos entran solas; **la tercera hay que cambiarla a mano**. Si no, la pantalla y la tarjeta dicen tramos distintos. `veredicto.test.ts` falla mientras quede un `tramo(aciertos` en la isla |
| Las tres líneas del reloj (`cifra-rotulo`, `cifra-numero`, `cifra-pie`) leen de `titularDeLaVuelta(...)` | las reescribió: `contar(cifraReloj, 0, sumarTiempos(tiempos), duracion)` | **choca.** Resolución abajo |
| La puerta, después de `acreditarTapas(...)` | línea sin cambios | entra sola |
| `rotuloHero` y `hero` de la tarjeta leen del titular | se mudaron a `dibujarLaTarjeta()` | **choca.** Mismas dos líneas, en su lugar nuevo |

**Cómo queda el reloj sobre el rediseño** (la cuenta animada es del tiempo; lo que sacaste no
se cuenta desde cero, se muestra):

```ts
const titular = titularDeLaVuelta(marcador, ronda.length, duracion(sumarTiempos(tiempos)));
const reloj = el('div', 'cifra');
reloj.append(el('p', 'cifra-rotulo', titular.rotulo));
const cifraReloj = el('p', 'cifra-numero');
if (titular.es === 'tiempo') contar(cifraReloj, 0, sumarTiempos(tiempos), duracion);
else cifraReloj.textContent = titular.numero;
reloj.append(cifraReloj);
reloj.append(el('p', 'cifra-pie', titular.pie));
```

**El sello de la vuelta** (`RESULTADO.selloVuelta`, «1 de 4» al lado de la línea que canta) y el
titular nuevo dicen lo mismo cuando `titular.es === 'sacaste'`. Propuesta: con ese titular, el
sello no se estampa — la cuenta ya es lo más grande de la pantalla.

**La clase `tramo--oido` no tiene tinta.** `TRAMOS` de `tema/copy.ts` tiene una clave nueva,
`oido`, y la isla sigue armando `tramo tramo--${t}`. No toqué `juego.css`, así que esa línea
sale en la tinta del texto. Falta una regla, al lado de `.tramo--medio`:
`.tramo--oido { color: var(--acento); }` (el mismo par ya testeado en `contraste.test.ts`).

**La puerta** usa `p.salida-resultado > a.volver`, que es la pieza que la otra rama ya usa para
las salidas del resultado («Mirá las letras enteras →» en completar). Sobre el rediseño conviene
que entre en el `salida` del final, al lado de «← Volvé al fichín», como en el quiz.

### 1.2 `src/scripts/partida.ts` — un enganche

Un `import` y siete líneas después de `zonaResultado.append(salida)`, que agregan la puerta al
mismo `salida`. La otra rama cambió la línea de `alArcade` (ahora `FICHIN.volver`), dos líneas
más arriba: debería entrar sola; si choca, es pegar el bloque después de su
`zonaResultado.append(salida)`.

### 1.3 «Completá la letra» ya cumple en la otra rama, no se tocó

`pulida/juegos-ui` le puso a completar su propio `TRAMOS` con `bajo: 'Te falta escuchar disco.'`
(`src/lib/letra/copy.ts`). Ahí la frase sale con `tramo(aciertos, 8)`, o sea con 0, 1 o 2 de 8
—con cuatro opciones, dos de ocho es lo que da el azar—, y no va sola: tiene el muro con la
cuenta y la salida «Mirá las letras enteras →». Corresponde y está acompañada. Lo único que
falta para que quede como el resto es que ese `TRAMOS` entre en la lista `grandes` de
`voz.test.ts`, como entró el del tema.

---

## 2. Para `experiencia` y la sesión de `pulida/juegos-ui`: la salida durante la partida

`r0-afuera.md` B-3: solo el quiz tiene «Cerrá la partida»; en tapa, completar y tema, el que
se arrepiente a mitad de la partida no tiene cómo salir más que con el botón de atrás.

**Mirado en `pulida/juegos-ui` (`08207b2`): sigue igual.** En las tres islas el único enlace a
`/` está en el resultado (`partida-tapa.ts:1034`, `partida-letra.ts:960`,
`partida-tema.ts:1865`), y el «← AL FICHÍN» de la carátula vive en `<section id="portada">`,
que se esconde al empezar. Las cabeceras nuevas (casillas, «Llevás N», racha, «Ruidos») no
traen salida.

No lo construí: es un control nuevo en tres cabeceras que la otra rama acaba de rehacer.
Propuesta, para que entre sobre el rediseño:

- **Qué:** un enlace chico en la cabecera de la partida, del lado opuesto a la cuenta, con el
  mismo texto y la misma forma que ya tiene el quiz en su tablero. Para las tres, el texto que
  ya existe: `RESULTADO.volver` («Volvé al fichín»), con la flecha de la cinta de regreso.
- **Sin confirmación** en tapa y completar (seis y ocho rondas, sin nada que perder). En el
  tema, tampoco: no hay vidas. La confirmación del quiz existe porque retirarse cierra una
  partida con resultado; acá salir es irse.
- **Zona de toque** de `--toque-min`, y lejos de las opciones: arriba, nunca en la zona del
  pulgar, por lo mismo que `UX-07` lo sacó de ahí en el quiz.
- **En el tema**, al salir hay que frenar el audio (`frenar()`), que hoy solo lo hace el avance.

---

## 3. Para `producto`

1. **El pozo fácil quedó en 12, el medio en 17, el difícil en 15** (eran 14 / 15 / 15). Los
   pisos de `US-01` (10 / 15 / 15 y diez por categoría) siguen en pie y ahora los mira
   `quiz/puerta.test.ts`. La tabla de escalones de `BR-19` §2 dice «preguntas 1 a 10»; hoy el
   primer escalón es 1 a 12.
2. **`BR-05` en «Adiviná el tema»**: el tramo bajo ya no es solo «menos del 30 % de aciertos».
   También pide menos del 30 % de los puntos y ningún tema sacado con dos segundos o menos
   (`tema/veredicto.ts`). Hay un cuarto estado, `oido`. Es regla de negocio y está decidida en
   código: falta la enmienda en el PRD, o la corrección si `producto` la ve de otra manera.
3. **El titular del resultado del tema**: el tiempo sigue siendo el número grande (pedido del
   usuario, 2026-08-27) cuando se sacó al menos la mitad. Con menos, el grande es «N de M» y el
   reloj va abajo. Es una excepción a ese pedido y conviene que quede escrita.
4. **La partida corta del quiz** (`r0-experto.md` 13: rondas de ~12 con resultado) no se tocó.
   Es la mejora que más le cambia la vida al que llega por un enlace y es de `BR-19`.

## 4. Para `contenido`

1. **`CNT-41` §5, B2'** traía seis variantes de error y quedaron cinco: salió «Te falta
   escuchar disco.» de la rotación de la pregunta. Si hace falta la sexta, que no sea un
   veredicto.
2. **Cadenas nuevas para el visto** (todas pasan `voz.test.ts`):
   - `tema/copy.ts` `TRAMOS.oido`: «Sacaste pocos, pero de oído.»
   - `tema/copy.ts` `TITULAR`: «Temas que sacaste», «Con 0,5 s de audio», «en 1 m 14 s».
   - `sitio/copy.ts` `PUERTAS`: «Entrá al disco que se te escapó», «Probá con las tapas».
   - `sitio/copy.ts`, casete del quiz: «Tres vidas y ninguna pregunta piadosa. Historia,
     discos, letras y mitología: arranca fácil y dura lo que aguantes.» `UX-25` (tabla de la
     línea 193) todavía cita la vieja, «Ocho preguntas y ninguna piadosa.».
3. **Ocho ítems cambiaron de nivel** en `src/data/quiz.json`, con `notaInterna` que dice
   `T-535` y el porqué: `QZ-042`, `QZ-043`, `QZ-047`, `QZ-048` y `QZ-052` de fácil a media;
   `QZ-060`, `QZ-061` y `QZ-062` de media a fácil. No se tocó ningún enunciado, opción ni
   explicación. `fugas.test.ts` pasa con el orden nuevo.
4. **Lo que el experto marcó y no es de dificultad** sigue abierto: `QZ-053` contra `QZ-020`
   (Patricio Rey inventado / «puede ser»), `QZ-021` (la explicación contesta una opción que no
   está), `QZ-023` regala `QZ-005`, y `QZ-055` (una negativa universal sin ficha).
   `QZ-053` es hoy una de las doce fáciles: si se reformula, que siga siéndolo.
