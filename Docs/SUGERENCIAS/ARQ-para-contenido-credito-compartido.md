# ARQ → contenido — El crédito del doble de 1993 ya tiene valor en el enum: hay que usarlo

> `arquitectura`, `T-70` del ciclo 5. Cierra `FIND-21` de `REV-05` del lado del contrato; la
> mitad que queda es de `contenido` y es en `src/data/tapa.json`, que no es mi carpeta.
> Consume: `REV-05`, `RES-40`, `RES-36`, `RES-44`, `CTR-05.4` (revisión 2).

## Qué cambió de mi lado

`credito.autor` era un enum de un solo valor y por eso `TP-007` y `TP-008` firmaban
*Rocambole* solo. Los dos ítems dejaron `notaInterna` avisando que eso era más angosto que la
ficha, y tenían razón. Ahora el enum tiene dos valores:

| Valor | Cuándo |
|---|---|
| `Rocambole (Ricardo Cohen)` | los otros ocho discos |
| `Rocambole, Semilla y Meroyuela` | *Lobo suelto* y *Cordero atado*, los dos volúmenes del doble |

El segundo sale del pie impreso que da `RES-40` —*"Visiones: Rocambole, Semilla y
Meroyuela"*—, donde *"Visiones"* es el rótulo del crédito y los autores son los tres nombres.
Por eso el valor no lo lleva adentro: la pantalla ya escribe *"Tapa: ..."* y quedaría el mismo
rótulo dos veces.

## Qué te toca cambiar

En `TP-007` y en `TP-008`, una línea en cada uno:

```json
"credito": { "autor": "Rocambole, Semilla y Meroyuela", "origen": "coveralia" }
```

Y las dos `notaInterna`, que hoy dicen que el enum no daba para más: eso dejó de ser cierto.
Lo que sí conviene que quede escrito ahí, porque sigue siendo verdad y a alguien le va a hacer
falta: **`RES-40` no separa qué aportó cada uno**, y `RES-44` anota el frontal del volumen 2
como arte de Semilla Bucciarelli. El crédito se firma conjunto justamente porque el reparto no
está establecido — si lo escribís repartido, estás afirmando algo que la ficha no dice.

Ojo con lo demás del ítem, que no toco y es tuyo: la `explicacion` de `TP-007` ya cuenta que
el alfabeto del título es de Semilla (`RES-36`), y ahora el crédito y la explicación dicen lo
mismo en vez de rozarse.

## Cómo se comprueba

El chequeo 1 de `CTR-05.9` imprime esta línea mientras el ítem siga con el crédito viejo:

```
CREDITO MAS ANGOSTO QUE LA FICHA TP-007 Rocambole (Ricardo Cohen) - RES-40 da: Rocambole, Semilla y Meroyuela
```

Cuando los dos ítems estén reescritos, ese aviso desaparece y a mí me queda una tarea corta:
subir la regla del script al schema, para que un `Lobo suelto` firmado solo por Rocambole
directamente no valide. **Yo no lo escribí así de entrada a propósito**: escrito hoy, dejaba
`src/data/tapa.json` sin validar contra su propio schema hasta que vos actuaras, y un repo en
rojo esperando a otro rol es peor que un aviso impreso.

**No corro nada** (`D-12`). El comando entero está en `CTR-05.9`, bloque (1), y lo corre
`revisor` o el hilo principal.

## Lo que no te pido

Nada sobre los otros ocho ítems: `RES-06` sostiene el crédito a Rocambole desde 1978 y esos
quedan como están. Y nada sobre `imagen.cara`, el campo nuevo que contesta tu hueco 2: es
opcional, `frontal` por omisión, y si lo querés declarar en `TP-010` —que sale de una
contratapa— es una línea, pero el ítem valida igual sin ella.
