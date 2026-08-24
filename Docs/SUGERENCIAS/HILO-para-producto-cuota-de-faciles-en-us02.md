# Para `producto`: la cuota de fáciles de `US-02` no tiene dónde vivir

> De: hilo principal · Fecha: 2026-08-24 · Consume: `US-02`, `BR-01`, `CTR-03` (`.1`,
> `.5`, `.6`), `D-24`, y las tareas `T-99` y `T-104` del ciclo 7.
> **Es una tarea corta y de una sola decisión.** No bloquea nada hoy: `US-02` tiene cero
> fragmentos, así que la cuota no se puede violar todavía.

## Cómo apareció

`T-99` (tuya) y `T-104` (de `arquitectura`) corrieron **en paralelo** en el ciclo 7, y
cada una movió una punta de la misma cuerda sin ver a la otra:

- Vos subiste el piso de `US-02` de 20 a **30 temas**, y la cuota de fáciles de 5 a **8**.
- `arquitectura` formalizó que `src/data/adivinar-tema.json` **dejó de ser un banco de
  ítems y pasó a ser un manifiesto de archivos de audio** — cuatro campos por entrada:
  `slug`, `titulo`, `duracionSeg`, `entero`.

El choque: **la etiqueta `dificultad` por ítem ya no existe.** El pozo se arma en build
desde los 105 temas de `RES-20`, y qué tema es fácil depende de quién esté jugando, no de
un campo.

El piso de 30 sí se mide —son 30 temas con fragmento en disco, y hay comando— pero los
"8 fáciles" no se pueden contar contra nada.

## Las tres salidas que `arquitectura` dejó planteadas, sin elegir

1. **Retirar la cuota de `US-02`.** Es la única historia de las cuatro donde la dificultad
   no es una propiedad del ítem: en el quiz una pregunta difícil es difícil para todos, y
   acá un tema es fácil para el que lo escuchó mil veces y difícil para el que llegó ayer.
2. **Reemplazarla por una regla de producción**, no de banco: "los primeros 30 fragmentos
   salen de los temas más conocidos". Mide lo mismo que la cuota quería medir —que el que
   entra sin idea reconozca algo— sin pedir un campo que no existe.
3. **Pedir una etiqueta por tema.** Sería un dato nuevo, y `arquitectura` deja dicho que
   **no iría en el manifiesto**: el manifiesto declara qué archivos hay, no qué tan
   conocido es un tema.

## Un dato que llega justo, y que puede resolver la 2 sin inventar nada

El usuario acaba de pedir, para el **ciclo 8**, que el sitio incorpore **cantidad de
escuchas por tema en Spotify y en YouTube**, justamente para poder separar los populares
de los oscuros.

Si ese dato entra, la salida 2 deja de ser una regla blanda y pasa a ser medible: "fácil"
sería un tema por encima de un corte de escuchas, con la ficha `RES-XX` que lo respalde y
la fecha en que se midió. **No lo decido yo** — lo anoto porque cambia cuál de las tres
salidas es la barata, y porque conviene que lo mires antes de retirar la cuota.

## Lo que este hilo ya hizo y lo que no

- **Sí:** actualicé a 30 el número del comando de verificación (2) de `CTR-03.10`. Ahí el
  número no es un argumento, es una medición, y medir contra el piso viejo era un bug.
- **No:** el párrafo de `CTR-03` que plantea la pregunta quedó con los números viejos a la
  vista, con una nota fechada al lado. Corregirlos yo hubiera sido contestar por vos.
