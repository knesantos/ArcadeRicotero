# `arquitectura` → hilo principal: `sirveComoVerso()` deja pasar una línea de acordes

> Encontrado escribiendo `CTR-09` (`T-133`, ciclo 9). **No es una hipótesis de lectura de
> código: está en el dato de hoy.** No lo arreglo yo porque `src/lib/cancionero/anotacion.ts`
> es código de producción (`D-12`, `Docs/EQUIPO.md`).

## El hecho

`src/data/letra.json` trae `"[A  G]"` como verso de contexto en **`CL-265`** y **`CL-266`**
(*Vencedores vencidos*, cifraclub.com). Ese archivo lo escribe `generar-letra.mjs`, que filtra
cada línea con `sirveComoVerso()`. O sea: **`sirveComoVerso("[A  G]") devuelve `true`**.

Por qué se escapa de las seis reglas de `anotacion.ts`, una por una:

| Regla | Por qué no lo caza |
|---|---|
| `layout` | Pide que la línea sea **solo** caracteres de dibujo. Tiene letras. |
| `repeticion` | No es `x2`, ni `bis`, ni `repetir…`. |
| `tab-grafica` | No hay corrida de tres guiones ni barra de compás. |
| `rotulo-de-tramo` | Pide una palabra de estructura (`intro`, `verso`, `solo`…) después del corchete. Adentro hay dos acordes. |
| `rotulo-entre-corchetes` | Lo mismo. `A` y `G` no están en la lista de palabras de estructura. |
| `esEncabezado` | Arranca con `[`, no con palabra de estructura. |
| `TECNICA` | No dice *riff*, *acorde*, *cejilla* ni ninguna de las otras. |

## Por qué en `US-03` era feo y en `US-07` es un ítem roto

En `US-03` esa línea aparece **alrededor** del hueco: se ve un renglón que no es letra y se
sigue jugando. En `US-07` (`CTR-09`) los versos **son el enunciado**: si `[A  G]` cae primero
en la ventana, el paso 1 del ítem es literalmente `[A  G]` y nada más. Eso es una pregunta
que nadie puede contestar — el mismo daño que el encabezado de `anotacion.ts` describe como
motivo de su propia existencia.

## Lo que propongo, y lo que ya está cubierto sin esto

**Cubierto:** `CTR-09.4` obliga a que todo verso del banco tenga al menos una palabra de
cuatro letras y no sea una línea entera entre corchetes o paréntesis, y el schema lo hace
cumplir. Así que **`US-07` no está bloqueado por esto** y `T-139` puede avanzar.

**Lo que igual conviene arreglar en el origen**, porque la red de `CTR-09` protege a un banco
solo y el defecto está en la función que usan todos:

- Una regla `acordes-entre-corchetes` en `REGLAS`: la línea es un corchete o paréntesis
  cuyo contenido son solo nombres de acordes y espacios. `normalizarAcorde()`
  (`src/lib/cancionero/notacion.ts`) ya sabe decir si un token es un acorde, así que la
  regla puede apoyarse en eso en vez de escribir otra expresión regular de cero.
- **Ojo con el criterio asimétrico que `anotacion.ts` declara en su encabezado:** en la
  pantalla del cancionero, marcar de más **borra un verso real y nadie se entera**. Una
  regla que exija que **todos** los tokens de adentro sean acordes es segura; una que se
  conforme con "empieza con corchete" no lo es —hay versos cantados que arrancan entre
  paréntesis, por ejemplo `"(En las calles no me muestro más)"` en *Dr. Saturno*—.
- Un caso en `anotacion.test.ts` con `[A  G]`, `[Am]` y `(D G A)` del lado de anotación, y
  `(En las calles no me muestro más)` del lado de letra.

**Cuánto cambia lo que ya está publicado:** `letra.json` se regenera con `npm run
generar-letra`, y los ítems se recalculan. Los ids son posicionales, así que **si esto se
hace, hay que hacerlo antes de que `T-144` promueva ítems a `listo`** — o el guardián de
`versosAnotados` va a avisar que se corrieron los ids, que es exactamente para lo que está.
