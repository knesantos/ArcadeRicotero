---
name: contenido-metodo
description: Método para escribir preguntas CNT-XX con distractores, cargar los JSON de cada juego y mantener la nota de derechos. Usar cuando el rol contenido tenga que sumar preguntas al banco, ajustar el tono, o poner al día la nota de derechos.
argument-hint: [tema o lote de preguntas]
---

<objetivo>
Llenar el banco de contenido antes que el motor lo necesite, con dificultad escalonada y
sin inventar un solo dato verificable. El fracaso típico de este proyecto es un motor
hermoso con doce preguntas adentro: tu trabajo existe para que eso no pase.
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/BRIEF.md` — la regla de veracidad y la postura sobre derechos (`D-14`).
- `Docs/PRODUCTO/` — el piso de ítems que tiene que alcanzar cada juego.
- `Docs/ARQ/` — el schema `CTR-XX` que tiene que cumplir cada JSON.
- `Docs/INVESTIGACION/` — fichas `RES-XX` disponibles antes de afirmar nada verificable.
</contexto>

<procedimiento>
1. Elegí el juego y el nivel de dificultad: arrancá siempre por lo que un fan casual
   contesta bien, y escalá hacia lo que solo sabe quien vio a la banda en vivo.
2. Por cada pregunta, escribí tres o cuatro distractores creíbles — un distractor obvio
   no suma nada, hace la pregunta más fácil de lo que debería.
3. Si la pregunta afirma un hecho verificable (una fecha, un sello, un tracklist), citá
   la ficha `RES-XX` que lo respalda. Si no existe todavía, pedísela a `investigador` en
   vez de escribir el dato de memoria.
4. Si es una historia que circula entre fans, entra como **leyenda**, rotulada y sin
   ficha: no la mandes a fichar (`D-14`). Si la contó en primera persona alguien con
   nombre y apellido, va como **testimonio**. En los dos casos el enunciado o la
   explicación post-respuesta dice qué es, y la respuesta correcta no puede depender de
   qué versión creas: si depende, reformulá la pregunta o no la cargues.
5. Cargá el resultado en el JSON correspondiente de `src/data/`, validado contra el
   schema de `arquitectura`.
6. Si la pieza involucra un fragmento de audio, una tapa o una cita de letra, actualizá
   la nota de derechos: duración, resolución, crédito y cuánto se citó.
</procedimiento>

<criterios_de_calidad>
- Ninguna pregunta afirma un dato verificable sin ID de ficha `RES-XX` o marca de leyenda.
- El banco cubre las cuatro categorías del quiz (historia, discos, letras, mitología)
  antes de profundizar en una sola.
- Todo JSON nuevo valida limpio contra el schema vigente.

Transversales a todo el proyecto:
- Cada afirmación tiene fundamento: un ID de otro rol, una fuente con fecha, o la marca
  explícita *supuesto*.
- Nada de relleno. Si una sección no aporta una decisión, se borra.
- Escribí para el vos de dentro de tres meses, que no se acuerda de nada.
</criterios_de_calidad>

<validacion>
Contá cuántos ítems tiene el juego contra su piso en `Docs/PRODUCTO/`. Si no lo alcanza,
no está listo, aunque el motor funcione perfecto.

Y siempre: ningún placeholder sin resolver, ningún ID referenciado que no exista.
</validacion>

<entregable>
Un archivo `CNT-<tema>.md` en `Docs/CONTENIDO/` con las piezas nuevas y sus IDs, más el
JSON actualizado en `src/data/` cuando corresponda.

Al terminar, reportá en el chat qué archivos tocaste, qué IDs creaste y qué rol necesita
esto ahora. `ESTADO.md` no lo tocás: es del hilo principal, que lo consolida con tu reporte.
</entregable>
