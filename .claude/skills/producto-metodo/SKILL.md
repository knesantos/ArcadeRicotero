---
name: producto-metodo
description: Método para escribir historias US-XX con criterios de aceptación, reglas BR-XX y el piso de ítems de cada juego de RicotaArcade. Usar cuando el rol producto tenga que confirmar alcance, fijar un piso, o convertir una idea suelta en una historia trazable.
argument-hint: [historia o decisión de alcance a resolver]
---

<objetivo>
Convertir "queremos que se pueda hacer X" en una historia `US-XX` con criterio de
aceptación verificable y un piso de ítems que defina cuándo un juego está listo. Sin
piso, "listo" es una opinión.
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/BRIEF.md` — el objetivo del proyecto, sobre todo "Listo de la v1" y "Fuera de
  alcance".
- `Docs/PRODUCTO/` — historias y reglas ya escritas, para no duplicar ni contradecir.
- `Docs/UX/` y `Docs/CONTENIDO/` si la historia toca un flujo o el banco existente.
</contexto>

<procedimiento>
1. Ubicá la idea dentro de los cuatro juegos del brief (quiz, adivinar el tema, y los
   dos que confirmás o cambiás vos: hoy "completar la letra" y "adivinar la tapa").
2. Escribí la historia en formato: *Como <tipo de jugador>, quiero <acción>, para
   <beneficio>.*
3. Definí el criterio de aceptación en Given/When/Then. Al menos un caso feliz y un caso
   borde (el jugador que no sabe nada, el que llega sin conexión al reveal de Spotify).
4. Si la historia depende de una regla de negocio nueva (ej. cómo puntúa el reveal
   progresivo), escribila aparte como `BR-XX` y citala desde la historia.
5. Si la historia es sobre un juego entero, fijá o confirmá su piso de ítems: cuántas
   preguntas, temas o tapas mínimas hacen falta para que ese juego llegue a revisión.
6. Marcá explícitamente qué queda fuera de esta historia, para que no se infle sola.
</procedimiento>

<criterios_de_calidad>
- Todo criterio de aceptación se puede marcar hecho o no hecho sin discutir. Si admite
  "más o menos", está mal escrito.
- El piso de ítems es un número, no una sensación ("bastantes preguntas" no sirve).
- Ninguna historia exige más de dos o tres minutos de sesión para completarse.

Transversales a todo el proyecto:
- Cada afirmación tiene fundamento: un ID de otro rol, una fuente con fecha, o la marca
  explícita *supuesto*.
- Nada de relleno. Si una sección no aporta una decisión, se borra.
- Escribí para el vos de dentro de tres meses, que no se acuerda de nada.
</criterios_de_calidad>

<validacion>
Releé la historia como si fueras `revisor`: ¿alguien podría entregar algo que cumpla la
letra del criterio pero no la intención? Si sí, el criterio está flojo — ajustalo.

Y siempre: ningún placeholder sin resolver, ningún ID referenciado que no exista.
</validacion>

<entregable>
Un archivo `PRD-<tema>.md` en `Docs/PRODUCTO/` por historia o lote de historias
relacionadas, con IDs `US-XX` / `BR-XX` nuevos y el piso de ítems si aplica.

Al terminar, actualizá `ESTADO.md` y reportá en el chat, en máximo 10 líneas: qué
archivos tocaste, qué IDs creaste, y qué rol necesita esto ahora.
</entregable>
