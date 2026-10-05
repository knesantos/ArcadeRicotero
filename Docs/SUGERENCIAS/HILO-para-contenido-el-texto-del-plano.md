# HILO → `contenido` — el texto que oye el lector de pantalla en el plano de dos ejes (`T-352`)

> **[Resuelta 2026-10-05.]** `contenido` la confirmó con dos cambios (`CNT-31` §13,
> `CNT-para-hilo-principal-texto-del-plano.md`) y el hilo los aplicó en `3b4ae32`. Desde `D-59`
> enmienda 3 el plano es **fijo** y el orden de los lugares es el de `planoFijo().celdas`, no el
> de `disposicion()`; `T-353` está cerrada. Lo de abajo queda como historia.

- **De:** hilo principal, ciclo 19 (2026-10-05).
- **Para:** `contenido` (`CNT-29`, `CNT-31`).
- **Por qué está acá:** el plano de dos ejes volvió al resultado (`D-59` enmienda 2, `UX-38`). La
  crítica de `UX-38` encontró que la grilla nunca dice que hay dos ejes ni dónde cae la tuya, así
  que el plano se lee como una imagen con su texto (`role="img"`), como el rombo viejo. La cadena
  ya está en el código porque sin ella el lector se perdía el gráfico; **es tuya: confirmala o
  cambiala**.

## Dónde | Hoy | Pasa a

| Dónde | Hoy | Pasa a |
|---|---|---|
| `src/lib/dos-ejes/copy.ts` · `RESULTADO.altPlano` (nueva, la propuso el hilo) | *Dos ejes en cruz. Arriba, Luz, con la gente; abajo, Oscuridad, con lo propio; a la izquierda, Orden, con plan; a la derecha, Caos, sobre la marcha. La tuya, arriba a la izquierda: Mesa larga a las nueve.* | Lo que decidas. Con un enlace se suma: *La de quien te lo mandó, abajo a la derecha: Mochila liviana, sin mapa.*, o *La de quien te lo mandó es la misma.* |
| el mismo archivo · `RESULTADO.lugares` (nueva) | `arriba a la izquierda` · `arriba a la derecha` · `abajo a la izquierda` · `abajo a la derecha` | Lo que decidas; se usan solo dentro de `altPlano` |

## Lo que tiene que seguir siendo cierto

- **Registro 3** (`voz-ricotera.md` §5): seco, sin imagen, sin suspensivos. Dice qué hay adentro.
- Los polos salen de `EJES` y `POLOS`, y los nombres del banco: no repetir texto a mano.
- El orden de los lugares es el de `disposicion().celdas` (la tuya, la de tu renglón, la de tu
  columna, la opuesta). Si cambia la orientación (`T-353`, la decide el usuario), cambian los
  lugares pero no la forma de la frase.

## Para verlo

`npm run build`, jugar una noche y leer `document.querySelector('.ejes-plano').getAttribute('aria-label')`;
con enlace, `/juegos/dos-ejes/cu-4/`. `node --test src/lib/voz.test.ts src/lib/dos-ejes/isla.test.ts`.
