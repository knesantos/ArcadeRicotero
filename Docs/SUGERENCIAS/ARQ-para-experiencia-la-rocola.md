# `arquitectura` → `experiencia`: lo que `ADR-07` le deja a `UX-26`

> Escrita en `T-212` del ciclo 14, después de `ADR-07` (`Docs/ARQ/ARQ-rocola.md`). **No es
> una decisión de pantalla**: son las cuatro consecuencias del ADR que caen del lado de
> `experiencia`, con el dato técnico que cada una necesita. La hoja es `UX-26` (`T-216`) y
> las decide ella.

## 1. El candado 4 cayó: hay que mostrar qué está sonando

`ADR-04` prometía que la cinta no llevaba información y por eso no había nada que pintar. Con
la rocola, el que prende quiere saber qué puso el aparato. El módulo lo expone así:

```ts
export function piezaSonando(): Pieza | null;   // { slug, titulo, entero }
```

Dos cosas que el ADR sí fija y que no son de pantalla:

- **El crédito va en registro 3** (`voz-ricotera.md` §5): dice qué hay adentro y se calla. Es
  el mismo criterio que `ADR-04.4` le puso al aviso de `bloqueada`.
- **La pieza puede ser un recorte de diez segundos o un tema entero**, y hoy siempre es lo
  primero: hay 95 recortes y 0 enteros. Si el rótulo dice "tema" cuando son diez segundos,
  miente sobre lo que hay adentro.

## 2. El interruptor tiene una posición más, y aparece sola después de navegar

`ADR-07.8` decide que el rearme automático de página prende **la cama**, nunca la rocola:
4 MB por pantalla sin que nadie los pida es exactamente lo que `D-14` no le hace al que tiene
datos contados. La consecuencia visible:

> En una ruta donde la rocola puede sonar, después de navegar la cinta puede estar **sonando
> en modo cama**, y el control tiene que poder ofrecer "poné un tema" sin que el único camino
> sea apagar y volver a prender.

Hoy la isla hace `apagarCinta()` con un toque cuando el estado es `sonando` o `callada`
(`src/scripts/cinta.ts:136-147`). Eso alcanzaba con dos posiciones y ya no.

## 3. Si hay control de "poné otro", mueve bytes

`proximaPieza()` existe en el contrato. Lo único que `ADR-07` le pide: **que sea un gesto
deliberado**, porque cada toque puede costar hasta 4 MB (`CTR-14`). Un control que se toque
sin querer es plata de otro.

## 4. En ocho pantallas la cinta nunca va a poner temas, y no es un defecto

El mapa de `ADR-07.2`: las siete pantallas de juego y el quiz van en modo **cama**, porque los
95 recortes son las respuestas de `US-02` y los temas enteros son las de `US-03` y `US-07`. Si
`UX-26` quiere que el interruptor diga algo distinto en esas pantallas, es decisión suya; lo
que no se puede es ofrecer ahí un control que no va a sonar. Y los tres graves y
`/diagnostico-audio/` siguen sin interruptor, como hoy.

## Lo que no hace falta que mires

El grafo, el filtro, la púa, el orden del sorteo y el presupuesto de red están cerrados en
`ADR-07` y `CTR-14`. Si algo de eso te queda chico, propuesta a `Docs/SUGERENCIAS/` y lo
miramos: el mapa sección→disco sigue siendo tuyo (`UX-04`), el timbre es mío.
