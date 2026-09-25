# De `arquitectura` para `producto`: lo que el corte en vivo deja abierto en `US-02`

> 2026-09-23, ciclo 16, `T-273`. Lo escribí mientras vos escribías `BR-18` (h) en `T-274`, y
> leí (h) en disco antes de cerrar. **No toco tu carpeta.** El contrato completo está en
> `Docs/ARQ/ARQ-schema-recitales.md` (`CTR-19`). **Nada de esto frena `T-279`:** cada punto
> tiene un valor por defecto escrito en el contrato, y si lo cambiás se toca una línea o un
> entero, no un dato.

## 1. Media y Difícil: hoy rige una regla que no inventa números

(h) fija los 8 Fáciles y no dice cómo se reparte el resto. `US-02` dice *"resto repartido en
Media/Difícil"*. Hasta que lo digas vos, rige esto (`CTR-19.5`, paso 5):

- **Media:** los temas del pozo que figuran en la página de setlist.fm y no quedaron en Fácil.
  Hoy son 15.
- **Difícil:** los temas del pozo que no figuran. Hoy son 72.

Es *"sin escucha por ahora es difícil"* de `D-27`, con "escucha" cambiado por "figura en lo que
publicó la página". Con el top-25 de hoy da **8 / 15 / 72**, bastante torcido hacia Difícil.
**Qué necesito:** que confirmes esta regla o que escribas otra. Cambiarla es una línea de
`repartirEnVivo()`. Lo que no puede hacer ninguna regla es ordenar los 72 que no figuran: la
página no publica sus números (`completo: false`).

## 2. El plazo del conteo: 180 días, pero el motivo no se traslada

El contrato toma los 180 días de `BR-18` (d) porque (h) vive adentro de `BR-18`
(`CTR-19.6`). Ojo: el motivo original era la obligación de "esfuerzos razonables" de YouTube
(`RES-52` d), y setlist.fm no pide nada parecido para un número citado (`RES-73` no lo
menciona). Una banda que no toca desde 2001 cambia poco en seis meses.

**El reloj ya corre:** el conteo es del 2026-09-22 (`RES-74`), así que vence el
**2027-03-21**. Desde el día siguiente `npm test` se pone en rojo hasta que `investigador` lea
la página de nuevo. **Qué necesito:** que confirmes 180 o pongas otro plazo. Es el entero
`vigenciaDias` del JSON, y el schema acepta hasta 730.

## 3. 🔴 La vidriera fija: con 8 Fáciles, la vuelta de todos los discos es siempre la misma

Esto no lo causa `CTR-19`, pero sale a la luz el día que `T-279` cuente los 8. `escalonar()`
llena la vuelta desde el nivel más fácil hasta completar el largo, y la vuelta es de 4
(`partida-tema.ts:68`). **Con todos los discos, las cuatro canciones de cada vuelta salen
siempre de los mismos 8 Fáciles**, y los otros 87 temas del pozo no suenan nunca. Es la
"vidriera fija" de `BR-01` punto 3, pero ya no en un ítem sino en la vuelta entera. Hoy no se
ve porque todo es Difícil. Con un disco elegido no pasa: ningún disco tiene más de 2 de los 8.

La regla es tuya y el código es del hilo principal. Te dejo las salidas que veo, con lo que
cuesta cada una. **No elijo:**

- **Un cupo de Fáciles por vuelta** (1 o 2) y el resto del nivel siguiente. Cumple *"la
  dificultad no baja"* de `BR-01` punto 1. En el código es un parámetro de `escalonar()`. Ojo:
  esa función también la usa `US-07`, así que el parámetro tiene que ser opcional.
- **Dejarlo como está:** la primera vuelta de todos los discos siempre sale de los 8 más
  tocados. Cuesta cero, pero va contra `BR-01` punto 3.
- **Otra que se te ocurra.** El contrato no la condiciona: el reparto sale de `repartirEnVivo()`
  y la vuelta se arma en `escalonar()`, que son dos piezas separadas.

## 4. Cuatro citas de `BR-18` que este contrato deja viejas

No te pido cambiar la regla, solo corregir las citas:

1. **(h), "la normalización que `RES-75` deja propuesta y que fija `T-279`".** No es esa ni la
   fija `T-279`. El cruce es `resolverTema()` de `src/lib/letra/temas.ts`, la puerta de `D-13`
   que ya usan el cancionero y el audio, y lo fija `CTR-19.2`. La propuesta de `RES-75` se
   descartó con su motivo: dos normalizadores deciden distinto sobre el mismo título. El `vs.`
   entra como alias.
2. **(h), "se recalcula cada vez que se refresque el índice de recitales; la fecha de ese
   primer refresco no está fijada todavía (ver `PENDIENTE`)".** El corte sale del **conteo
   citado**, no del índice ni del archivo de recitales. Esas son otras piezas y ninguna alimenta
   el corte (`CTR-19.1`, `CTR-19.8` regla 4). El orden se recalcula en cada build. El conteo se
   refresca reescribiendo el bloque entero desde una ficha nueva (`CTR-19.6`). La fecha ya
   existe (punto 2 de arriba), y en `PENDIENTE` no hay ninguna entrada que la trate.
3. **(h), salida B, "104 o 105 temas, según se reconcilie".** Ya está reconciliado: son
   **105**. El que falta en `cancionero.json` es *Sushi*, que es instrumental. Lo dice la nota
   del hilo principal en `INV-73` y lo exige `banco.test.ts:23`.
4. **(g), condición 3, "`catalogo().medidos === 0`".** El campo pasa a llamarse `faciles` y
   conserva la misma lectura: `catalogo().faciles === 0` es "este juego no escalona"
   (`CTR-19.5`). En la condición 2, *"el día que haya mediciones los ocho aparecen solos"* pasa a
   *"el día que `T-279` cargue el conteo"*.

## 5. Lo que (h) promete y el contrato cumple, con un matiz

(h) dice que si uno de los 8 no tiene audio, *"el filtro sigue bajando en el ranking hasta
completar 8"*. Es cierto, **salvo en dos casos, y en los dos el contrato frena en vez de
seguir:** que haya un empate en el borde, o que el octavo empate con la última línea que
publica la página (un tema que no figura podría tener lo mismo). En esos casos `t5` se pone en
rojo con el motivo, la página se arma con los Fáciles que sí quedaron separados, y **la
decisión vuelve a vos y al usuario**. Es la condición de `D-45`, *"no se cae en silencio a
otra vara"*, escrita como test.
