# `arquitectura` → `producto` — ¿cómo se responde en "adivinar el tema"?

> De: `arquitectura` (`T-24`, al escribir `CTR-03` en `Docs/ARQ/ARQ-schema-adivinar-tema.md`).
> Para: `producto`. Toca `BR-02` y `BR-04`; no edito `Docs/PRODUCTO/`.
> Fecha: 2026-08-19.

## La pregunta, una sola

**¿`US-02` se responde con opción múltiple de 4, como `US-01` y `US-04`, o de otra forma?**

`BR-04` dice textual **"Aplica a `US-01` y a `US-04`"**, y `US-02` deja el mecanismo de
input fuera de la historia. O sea: hoy no hay regla. No la tomo yo. `CTR-03` soporta los
dos mecanismos y dejó **`modoRespuesta: "opciones"` como valor de trabajo marcado**,
porque "jugable con el pulgar" (`D-09`) es no negociable y `US-04` cita ese criterio para
prohibir el tipeo. Es un valor de trabajo, no una decisión.

## Por qué no alcanzaba con extender `BR-04` y seguir

Al escribir el schema me salió esta cuenta, y creo que cambia la respuesta. `BR-02` dice
que **errar antes no cambia el cálculo**: el puntaje depende solo del paso más alto
alcanzado al acertar. Con 4 opciones, entonces, tirar una en cada paso es **gratis** y va
descartando:

| Paso | Opciones que quedan | Prob. de pegarla ahí | Puntos | Aporte al esperado |
|---|---|---|---|---|
| 1 | 4 | 1/4 | 100 | 25 |
| 2 | 3 | 1/3 | 80 | 20 |
| 3 | 2 | 1/2 | 60 | 15 |
| 4 | 1 | 1/1 | 40 | 10 |
| | | | **Esperado** | **70** |

Tres consecuencias, y las tres se leen de la tabla:

1. **Un jugador que no reconoce nada saca 70 de promedio y nunca baja de 40**, sin
   escuchar. El que se lo sabe de memoria saca 100.
2. **El paso 5 (20 puntos) es inalcanzable**: a los 4 pasos ya quedaba una sola opción.
3. **La rama "si nunca acierta → 0 puntos" de `BR-02` no puede ocurrir nunca.** Ese solo
   hecho sugiere que `BR-02` no se escribió pensando en múltiple choice.

Es la misma cuenta de azar con la que `BR-04` descartó las 3 opciones —"empieza a rendirle
casi como al que sabe… eso vacía la promesa de premiar al que sabe"— solo que multiplicada
por cinco intentos gratis.

## Salidas posibles, sin que yo elija ninguna

1. **Extender `BR-04` a `US-02` tal cual** y aceptar la cuenta como el precio de "jugable
   con el pulgar".
2. **Que un error consuma un paso** (o cueste puntos). Es un cambio de una línea en `BR-02`
   y arregla la cuenta sin tocar el input. **Cero impacto en `CTR-03`.**
3. **Que las opciones aparezcan recién en el paso N** (p. ej. 3). Antes de eso se responde
   tipeando o no se responde. **Cero impacto en el schema**, es dato de interfaz.
4. **Texto libre**, y entonces `modoRespuesta: "texto"`. Habilita la promesa "lo reconocí
   con 0,1 segundos" en su forma pura, pero choca con "jugable con el pulgar" y abre la
   tolerancia de matching que `PRD-alcance-v1.md` ya tiene como PENDIENTE.

## Qué cuesta esperar la respuesta: casi nada

En `CTR-03` **la respuesta correcta no vive en `opciones`, vive en
`fragmento.credito.tema`** (`CTR-01.8` es la fuente canónica). Así que:

- **`contenido` puede cargar los 20 ítems enteros sin que esto esté decidido.** Lo único
  que depende de la respuesta son los **tres distractores**, y salen de la lista de 105
  títulos de `RES-20`, que ya está en disco.
- Cuando decidan, cambia **una clave a nivel archivo** en `src/data/adivinar-tema.json`.
- Si eligen la salida 2 o la 3, `CTR-03` no cambia en absoluto.

Lo que sí conviene: que esté decidido **antes** de que `experiencia` diseñe la pantalla del
juego 2. Si gana opción múltiple, esa pantalla tiene que bancar cuatro títulos de hasta
**61 caracteres reales** —"Las increíbles andanzas del Capitán Buscapina en Cybersiberia",
`RES-20`— en zona pulgar, además de los controles del reveal. Eso es distinto de diseñar
un campo de texto.
