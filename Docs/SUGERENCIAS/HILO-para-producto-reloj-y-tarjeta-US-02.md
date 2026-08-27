# Del hilo principal para `producto` — `US-02` cambió de forma: entró el reloj y la tarjeta

**Fecha:** 2026-08-27 · **Origen:** `D-28` · **No edité `Docs/PRODUCTO/`**, como corresponde.

## Qué pasó

El usuario pidió una pasada estética a fondo sobre "Adiviná el tema" y, adentro del mismo
pedido, una cosa que no es estética: *"arma el boton compartir que arme un link para jugar
y la imagen de como le fue al jugador, **mas que el puntaje es importante y divertido
saber en cuanto tiempo y que temas adivino**"*.

Esa última frase mueve el criterio de aceptación de `US-02`, y por eso esto está acá.

## Lo que ya está construido y andando

1. **El juego mide tiempo.** Por tema y en total. Corre callado —no hay contador a la vista
   durante la partida, por `D-14`—, se muestra al revelar y se suma en el resultado. El
   reloj para cuando la pestaña se esconde y mide solo el tema, no la ficha.
2. **El resultado cambió de jerarquía.** El número grande dejó de ser el puntaje y pasó a
   ser **el tiempo**. El puntaje sigue, un renglón más abajo. El detalle tema por tema pasó
   de nota al pie a pieza central: cada fila dice el disco, cuánto audio hizo falta y cuánto
   se tardó.
3. **Compartir devuelve dos cosas**: la dirección de siempre (`ADR-02`) y una tarjeta de
   1080 × 1350 con el setlist de la vuelta.

## Lo que le pido a `producto`

**No es aprobación — ya está en el disco y el usuario lo pidió.** Es que los criterios
digan lo que el juego hace, porque hoy no lo dicen:

1. **Un criterio nuevo sobre el tiempo.** Hoy `US-02` no lo nombra. Como mínimo: que la
   vuelta reporte el tiempo por tema y el total, y —esto es lo que puede discutirse— **que
   no se muestre durante la partida**. Si `producto` prefiere el contador a la vista, es un
   cambio chico de código, pero conviene que quede escrito de qué lado está y por qué.

2. **Qué pasa con el piso de ítems.** No lo toqué y creo que no se mueve: el reloj no agrega
   trabajo de contenido. Lo digo explícitamente para que nadie lo dé por revisado sin
   mirarlo.

3. **Si el tiempo entra al desafío que viaja.** Hoy **no**: el enlace sigue llevando
   `puntaje` y `total` como `marcador` (`ADR-02` v2), y el tiempo viaja solo adentro de la
   imagen. Fue deliberado —meterlo en la dirección obliga a tocar `ADR-02`, y el puntaje ya
   es lo que el jugador puede editar a mano— pero es una decisión de producto, no mía.

4. **La regla de las dos líneas en el resultado.** La cambié de hecho: ahora canta el tramo
   (que es el `h2`) y nombra el bloque de tiempo y puntaje. Antes el `h2` era "Cómo te fue",
   que ahora es un rótulo de registro 3 arriba de todo, igual que el desenlace del quiz. Me
   parece que queda mejor y más parecido al juego hermano, pero el reparto de registros por
   pantalla es de `experiencia` y el criterio es de `producto`.

## Lo que NO hace la tarjeta, para que quede asentado

No lleva **ningún** dato de la persona: ni nombre, ni aparato, ni de dónde entró. Dice qué
temas salieron y cuánto tardaron, y se calla. Es el mismo criterio de `armar.ts` para el
botón de corrección, y conviene que esté escrito en la historia y no solo en el código.

## Cómo verificarlo

```
npm test && npm run check && npm run build
```

Y jugando: `npm run dev`, entrar a `/juegos/adivinar-el-tema/`, terminar una vuelta y tocar
`Compartí`. En un celular sale el menú del sistema con la imagen; en una computadora se
copia la dirección y queda el botón `Bajá la tarjeta`.
