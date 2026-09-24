# De `arquitectura` para `contenido`: "Completá la letra" con el conteo

> 2026-09-24, ciclo 16, ráfaga 4, `T-287`. El contrato es `CTR-04.14`, en
> `Docs/ARQ/ARQ-schema-completar-letra.md`. **No hay nada que hacer antes de que `T-288`
> regenere el banco.** Esto es para después, y ninguno de los puntos frena nada.
>
> **`T-288` ya regeneró el banco.** Lo que pasó de verdad, con los versos y los ids nuevos,
> está en `Docs/SUGERENCIAS/HILO-para-contenido-dos-anclas-sin-vecinos.md`. Los números de
> abajo eran una lectura indicativa, y el traspaso del hilo principal los corrige. Hay dos
> anclas apartadas en `fuenteUnica.enEspera`, cambiaron de nivel 8 `listo` y no 10, y hay
> 19 jugables. Hay una cosa que acá no estaba: *La bestia pop* salió del juego porque su letra
> tiene un solo verso limpio.

**Lo que cambia para vos:** desde `T-288`, el nivel de un ítem es el de su tema, en tercios
del conteo citado (`BR-30`). Elegir un verso ya no elige su nivel. Hasta hoy sí lo hacía: el
generador ponía el nivel según cuántos versos tenía el hueco alrededor dentro de su estrofa.
Y el contexto sigue al nivel (`BR-03`): cuando un ítem cambia de nivel, cambia lo que muestra.

## 1. Los `listo` que cambian de nivel

El generador va a listarlos en cada corrida, cruzados por verso y no por id, con el nivel
viejo y el nuevo (`CTR-04.14`, paso 9). **Los ids se van a correr.** Nombralos por el verso.

Lectura indicativa, no medición: **10 de los 21 cambian.** Tres **ganan** contexto y pasan a
mostrar dos versos de cada lado: `CL-093` (*"Rockeros bonitos, [educaditos]"*), `CL-096` y
`CL-383`. `CL-093` se promovió con el motivo *"Dificultad dificil, sin contexto mostrado: no
hay linea de anotacion que pueda colarse alrededor"*, y ese motivo deja de describir el ítem.
El filtro de `CNT-11` ya limpia el contexto, pero el juicio de si el verso sigue siendo de bajo
riesgo es tuyo. Mirá los tres.

## 2. Si se pierde un ancla

En un tema Fácil, los dos primeros versos y los dos últimos del tema no dan ítem, porque no
tienen dos vecinos de cada lado. En un tema Medio, el primero y el último. Si un verso que
elegiste cae ahí, el generador aborta con un mensaje propio, distinto de *"se corrieron los
ids"*: nombra el tema, el nivel y cuántos vecinos faltan. **Reemplazarlo es tuyo.** Elegí otro
verso, del mismo tema o de otro. El nivel ya no depende de cuál elijas.

## 3. La cota de 8 versos por tema ya no tiene la salida del segundo ítem

`CTR-04.4` dejaba dos salidas cuando dos ítems del mismo tema pasaban de 8 versos distintos:
que se solapen, o que el segundo sea Medio o Difícil. **La segunda ya no existe**, porque los
dos tienen el nivel del tema. Dos Fáciles del mismo tema son hasta 10 versos, así que tienen
que solaparse. Si no, el tema se queda con un solo Fácil `listo`. Varios temas ya tienen dos
`listo` Fáciles. `CL-408` y `CL-418` (*Un poco de amor francés*) están a diez ids de distancia
y pueden no solaparse. El generador imprime los temas que pasan de 8. No es un cerrojo (`D-14`):
es una precaución y se mide.

## 4. Si faltan Fáciles

La cuota de `US-03` sigue en 4 Fáciles sobre 15, y desde `T-288` la afirma un test (`n4`). La
lectura indicativa da 13, así que no debería faltar. Si falta, `BR-30` ya dice qué hacer:
cargar huecos de temas del tercio de arriba. El mensaje del test lo repite.
