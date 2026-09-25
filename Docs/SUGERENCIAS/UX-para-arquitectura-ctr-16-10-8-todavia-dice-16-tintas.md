# De `experiencia` para `arquitectura` — `CTR-16.10.8` se quedó en 16 tintas y con la puerta con tinta propia

> 2026-09-24, ciclo 16, ráfaga 4, `T-289`. No toco `Docs/ARQ/`: esto es lo que encontró la
> verificación de esta ráfaga al cotejar `UX-32 §2.2` (nuevo, esta ráfaga) contra
> `Docs/ARQ/ARQ-schema-niveles.md`. Confirmé con `git diff` que el parche en curso de
> `T-291` sobre ese archivo toca solo las líneas 899-933 (cajas), no las 1105-1141
> (`CTR-16.10.8`): esto no se está resolviendo en paralelo ni figura en `REV-15`.

## El desfasaje, con línea

`UX-27 §4.1.2` —enmendado el 2026-09-23— le sacó a la puerta su tinta propia: la franja de
Objetos bajó de 2 a 1 (queda solo el coleccionable) y el total del área bajó de **16 a
15**. La tabla de `UX-27 §4` ya dice eso, y `UX-32 §2.2` (`Docs/UX/UX-32-ganar-se-ve.md`,
esta ráfaga) lo da por hecho: las cuatro puertas —dos cerradas, dos abiertas— "siguen
dentro de los dos colores fijos", sin pedir una tinta 16, tratamiento en forma igual al
que ya reciben palanca, placa, compuerta y caja.

`ARQ-schema-niveles.md:1109`, en `CTR-16.10.8` —sin marca de enmienda— todavía dice:

> "`UX-27 §4` reparte las 16 tintas en fijos (2), terreno (6), personajes (3 y 3) y
> objetos (2: la puerta y el coleccionable)."

Y la tabla de la línea 1121 sigue listando como amenaza vigente:

> "la tinta de la puerta → se leería como una salida, y 'puerta' y 'compuerta' ya
> comparten la mitad del nombre → rompe la condición de victoria, que es llegar a la
> puerta."

Esa fila advertía contra pintar un mecanismo con la tinta *reservada* de la puerta. Con la
puerta ya sin tinta propia (vive en `--px-clave`/`--px-luz`, como todo lo demás de esa
misma sección), no hay franja que reservarle: no hay nada que un mecanismo pueda "tomarle"
en tinta, porque la puerta ya no tiene una tinta que sea solo suya.

## Dos salidas, ninguna la elijo yo

1. **Actualizar el número** (16 → 15; "objetos (2: la puerta y el coleccionable)" →
   "objetos (1: el coleccionable)") y **retirar la fila de la puerta** de la tabla de
   amenazas, porque la amenaza que describía ya no puede pasar.
2. O dejar una fila, pero reescrita como advertencia de **forma**, no de tinta: algo del
   tipo "si un mecanismo se dibuja como un vano con el dintel retirado, se lee como una
   segunda puerta" — coherente con que la puerta misma pasa a ser un caso más de "estado
   por forma, nunca por tinta" (la misma regla que este contrato ya fija dos párrafos más
   abajo, línea 1127, para palanca/placa/compuerta).

Cuál es más barata de mantener es criterio de `arquitectura`, no mío.

## Para no perderlo

`UX-32 §2` ya da por buena la lectura post-enmienda: la puerta abierta y la cerrada, las
dos, adentro de las 15 tintas, sin franja propia — es la base sobre la que `T-290` va a
dibujar los dos tiles nuevos (`puertaSkayboyAbierta`, `puertaPoligirlAbierta`). Si
`CTR-16.10.8` termina fijando algo distinto de lo que ya asume `UX-32`, avisen antes de
`T-290`; hoy los dos documentos describen la misma paleta con dos números distintos, y ese
es el desfasaje a cerrar.
