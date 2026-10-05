# CNT-para-hilo-principal — el texto que oye el lector en el plano de dos ejes (`T-352`, 2026-10-05)

> **[Aplicada 2026-10-05, `3b4ae32`.]** Los dos cambios de §1 están en `copy.ts` y la guarda de §2 es
> `src/lib/dos-ejes/copy.test.ts` (veinte casos, las siete afirmaciones).

De `contenido` al hilo principal, respuesta a `HILO-para-contenido-el-texto-del-plano.md`. El razonamiento completo está en `CNT-31` §13. **Nada de esto bloquea nada**: el texto de hoy funciona; esto lo deja mejor. No toqué `src/` ni `src/data/`.

## 1. Lo que cambia (dos cosas, ambas en `RESULTADO.altPlano`)

| Dónde | Hoy | Pasa a |
|---|---|---|
| `src/lib/dos-ejes/copy.ts` · `RESULTADO.altPlano`, primera línea de la plantilla (los polos) | `` `Dos ejes en cruz. Arriba, ${p.arriba}; abajo, ${p.abajo}; a la izquierda, ${p.izquierda}; a la derecha, ${p.derecha}. ` `` | `` `Dos ejes en cruz. Arriba, ${p.arriba}. Abajo, ${p.abajo}. A la izquierda, ${p.izquierda}. A la derecha, ${p.derecha}. ` `` |
| el mismo archivo · segunda línea (la tuya) | `` `La tuya, ${p.tuya.lugar}: ${p.tuya.nombre}.` `` | `` `Tu manera, ${p.tuya.lugar}: ${p.tuya.nombre}.` `` |
| el mismo archivo · las dos líneas de la de quien mandó el enlace | `' La de quien te lo mandó es la misma.'` y `` ` La de quien te lo mandó, ${p.suya.lugar}: ${p.suya.nombre}.` `` | **sin cambio** |
| el mismo archivo · `RESULTADO.lugares` | `arriba a la izquierda` · `arriba a la derecha` · `abajo a la izquierda` · `abajo a la derecha` | **sin cambio** |
| el comentario de `altPlano` | «`contenido` la confirma o la cambia (`T-352`)» | «Confirmada por `contenido` (`T-352`, `CNT-31` §13)» |

Qué dice el lector después, en los tres casos (la tuya en `CU-2`, la del enlace en `CU-4`):

- **Sin enlace:** *Dos ejes en cruz. Arriba, Luz, con la gente. Abajo, Oscuridad, con lo propio. A la izquierda, Orden, con plan. A la derecha, Caos, sobre la marcha. Tu manera, arriba a la derecha: Ronda en cualquier esquina.*
- **Con enlace, otra manera:** lo mismo y *La de quien te lo mandó, abajo a la derecha: Mochila liviana, sin mapa.*
- **Con enlace, la misma:** lo mismo y *La de quien te lo mandó es la misma.*

Ninguna prueba existente fija el texto exacto: `isla.test.ts` solo busca `RESULTADO.altPlano(` y `role="img"`, y el plano no entra en `huellaDelTaller()` (no viaja en la tarjeta), así que no hay que regenerar nada.

## 2. Una guarda que falta (opcional, pero es el único agujero)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/voz.test.ts` o `src/lib/dos-ejes/copy.test.ts` (**nueva**) | `cadenasDeFunciones()` llama cada función con `1` y con `'X'`; `altPlano` recibe un objeto y revienta en `p.tuya.lugar`, el `catch` se la traga y **la cadena queda fuera del barrido** | Llamar `RESULTADO.altPlano` con datos de verdad —las cuatro celdas de `planoFijo(banco)` como tuya, y para cada una: sin enlace, la misma y las otras tres como del enlace— y sobre cada resultado afirmar lo de abajo | Es la cadena más larga del resultado y la única que solo oye quien usa lector. Es el mismo hueco que `dos-ejes` tuvo una vez (ver el comentario de `MODULOS`). Veinte llamadas, ninguna depende del azar |

Lo que la guarda afirma (todo de `PRD-alcance-v1.md` criterio 9, condiciones 4 y 6, y del registro 3):

1. Ningún dígito (`/\d/`).
2. Ninguna de *mejor*, *peor*, *primera*, *última*, *más*, comparadas sin tildes y como palabra.
3. Ningún `…` ni `...`, ningún `!` ni `¡`.
4. Los cuatro `EJES` y las cuatro `POLOS` aparecen, y el nombre de la tuya también.
5. Con la misma: dice *es la misma* y **no** repite el nombre; con otra: dice el nombre de la otra y **no** dice *es la misma*.
6. Sin `;` (la regla de arriba), sin `..`, `,,`, `:.` ni dobles espacios, y termina en punto.
7. Pasa los patrones de `D-17` (anglicismos) y de nombrar a la gente que ya usa el resto del archivo.

## 3. Para verlo (lo corre el hilo o `revisor`; `contenido` no ejecuta, `D-12`)

```bash
npm run build
node --test src/lib/voz.test.ts src/lib/dos-ejes/isla.test.ts
# en el navegador, en el resultado de una noche:
document.querySelector('.ejes-plano').getAttribute('aria-label')
# con enlace (la de CU-4 mirando desde otra): /juegos/dos-ejes/cu-4/
# sin dígitos (condición 4 del criterio 9):
/\d/.test(document.querySelector('.ejes-plano').getAttribute('aria-label'))   // false
```

Y si se puede, una vez con VoiceOver o TalkBack: la pregunta es si los cuatro polos se oyen como cuatro frases separadas (el motivo del cambio de los puntos). Si no hace falta, se vuelve al punto y coma sin tocar nada más.
