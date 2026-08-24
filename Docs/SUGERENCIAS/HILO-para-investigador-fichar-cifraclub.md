# Propuesta del hilo principal para `investigador`: fichar cifraclub como fuente de letras

> Escrita en el ciclo 6, al ingerir el cancionero. **Es un pedido concreto y acotado**, no
> una investigación abierta: hay 82 temas del sitio esperando esta ficha para poder entrar
> al juego de `US-03`.

## Qué pasó

El usuario trajo 149 archivos JSON con letra y acordes, raspados con un scraper propio de
**cifraclub.com** (preferida, trae cifra) y **letras.com** (repuesto, solo letra). El
cruce de `D-13` contra los 105 temas de `RES-20` dejó 104 adentro y 45 en cuarentena.

De esos 104, el reparto por fuente es:

| Fuente | Temas con letra |
|---|---|
| cifraclub.com | 82 |
| letras.com | 14 |

## El problema

`CTR-04` obliga a que cada ítem del juego declare `fuenteLetra` como una lista de fichas
`RES-XX`. **letras.com tiene la suya (`RES-23`); cifraclub no tiene ninguna.**

Así que el generador del banco (`scripts/generar-letra.mjs`) trabaja **solo sobre los 14
de letras.com**. Alcanza y sobra para el piso de 15 de `US-03` — salieron 313 versos
candidatos —, pero deja afuera el 85% del material que el usuario consiguió.

**Por qué no lo resolví yo:** citarle a cifraclub una ficha inventada, o estirar `RES-23`
para que cubra un sitio que nunca evaluó, es exactamente el problema de rótulo que `D-14`
dejó como lo único estricto del proyecto. Prefiero el banco chico y el rótulo verdadero.

## Lo que hace falta

Una ficha —`RES-49` está libre según `ESTADO.md`— que responda lo mismo que `RES-23`
respondió de letras.com:

1. **Qué es cifraclub** y qué tan confiable es su transcripción de letra (no de acordes:
   de letra).
2. **Si arrastra el mismo error demostrado** que letras.com — mezclar material del Indio
   solista y de Skay con el de la banda. Dato de acá que puede servir: de los 149
   archivos, 45 quedaron fuera de los 105 de `RES-20`, así que el error existe en el
   corpus combinado; falta saber si es de una fuente o de las dos.
3. **Si hay atribución de quién transcribió** cada cifra, que en cifraclub suele haber, y
   si eso cambia algo para el rótulo.

## Lo que este ciclo dejó listo para que la ficha se aproveche sola

`scripts/generar-letra.mjs` tiene la fuente en **una constante** (`FICHA_LETRA`) y filtra
por `t.fuente.sitio === 'letras.com'` en un solo lugar. Cuando la ficha exista, se cambian
esas dos líneas, se vuelve a correr, y los 82 temas entran con su rótulo correcto.

## Ojo con esto, que es aparte

Aun con la ficha, **ningún ítem pasa a `listo` automáticamente**: `CTR-04` pide además dos
fuentes de letra o una confirmación de oído, y eso lo decide una persona
(`src/data/letra-confirmaciones.json`). La ficha desbloquea el material, no la partida.
