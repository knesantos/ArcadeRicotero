# Para `contenido` y `arquitectura`: los distractores de "Completá la letra" ahora se curan (`T-532`)

**De:** hilo principal (constructor de la ronda R1 de la pulida de jugabilidad, `T-532`).
**Fecha:** 2026-11-20. **Toca:** `US-03`, `CTR-04`, `BR-04`.

## Qué pasó

El usuario pidió que la palabra errada suene a la correcta. De los 72 ítems `listo`, 44 no
tenían ni un distractor que compitiera: se acertaba por gramática («Y se [___]» con
música / rockeros / cristal). Los distractores los sorteaba `scripts/generar-letra.mjs` del
vocabulario del disco, mirando solo el largo.

## Qué cambió, y pisa terreno de ustedes

1. **Archivo nuevo en `src/data/`: `letra-distractores.json`.** Es un compañero de
   `letra-confirmaciones.json`: una entrada por verso jugable, con la clase de palabra del
   hueco y los tres distractores elegidos a mano. Lo escribió el hilo principal por encargo
   directo; **de acá en más es de `contenido`**, como el resto de la carpeta.
2. **Regla nueva del generador: un verso sin entrada ahí no se promueve a `listo`.** Queda
   en `borrador` y el script lo dice. Elegir el verso (`fuenteUnica`, `confirmados`) ya no
   alcanza: hay que elegirle también los tres errados.
3. **`letra.json` no cambió de forma**: mismos campos, mismo `CTR-04` v3. Cambiaron las
   `opciones` (las de los 71 `listo`, curadas; las de los borradores, sorteadas con
   preferencia por la forma de la respuesta) y la `notaInterna` de los `listo`.

## Lo que les pido

- **`arquitectura`:** que `CTR-04` nombre el archivo y la regla del punto 2, y decida si
  quiere un schema en `src/data/_schema/`. Hoy la vara vive en
  `src/lib/letra/curaduria.ts` (`problemasDe`) y la corre `distractores-clase.test.ts`.
- **`contenido`:** releer los 71 con oído. La máquina mide clase, número, género, sílabas y
  que no esté a la vista; **no mide que el distractor no sea también cantable**. Los que más
  dudas me dejan: «Muchachitas [fatales]» con *mortales*, «Cuando [anochezca]» con
  *oscurezca*, «no les cambia la [racha]» con *suerte* (sinónimos: compiten fuerte, y la
  letra es una sola). Si alguno confunde al que se sabe el tema, se cambia en el JSON y se
  corre `npm run generar-letra`.
- **`contenido`:** 28 de los 213 distractores no salen del cancionero (están declarados en
  `fuera`). Si aparece uno mejor que sí cante la banda, mejor.
- **`producto`:** un verso bajó a `borrador` (`CL-274`, «rock 'n' [roll]»). Quedan 71, el
  piso de `US-03` es 15. Y hay huecos que ningún distractor salva porque la frase hecha
  completa la palabra («por [favor]», «milagro más, milagro [menos]», «hasta la [pasta]»):
  eso es elección de verso, no de distractor, y es de ustedes.

## Verificación

```
npm run generar-letra
node --test src/lib/letra/distractores-clase.test.ts src/lib/quiz/ronda-grupo.test.ts
```
