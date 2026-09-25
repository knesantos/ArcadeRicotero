---
name: experiencia-metodo
description: Método para diseñar flujos UX-XX de sesión corta en móvil y el sistema visual rocambolesco de RicotaArcade. Usar cuando el rol experiencia tenga que definir una pantalla nueva, el recorrido de una partida o el brief de una pieza de arte original.
argument-hint: [juego o pantalla a diseñar]
---

<objetivo>
Diseñar un recorrido que un fan complete en dos o tres minutos desde el celular, sin
muro en la primera pantalla, y que vista el disco de su sección (`D-19`).
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/BRIEF.md` — el momento de uso (celular, ratos sueltos).
- `.claude/rules/diseno-marca.md` — el sistema de marca: qué disco viste cada sección, la
  base que no rota y lo que está vetado.
- `Docs/PRODUCTO/` — qué historia `US-XX` resuelve la pantalla o el flujo.
- `Docs/CONTENIDO/` — qué tipo de ítems tiene que mostrar cada pantalla.
</contexto>

<procedimiento>
1. Trazá el recorrido completo en texto: pantalla de entrada, la partida, el momento de
   revelar la respuesta (incluido el tema completo, que sirve el sitio en mp3 — `D-22`), el
   resultado, y el punto de compartir o volver a jugar.
2. Por cada pantalla, anotá qué pasa si el jugador acierta, si falla, y si abandona a
   mitad de camino — los tres estados existen siempre en una sesión de dos minutos.
3. Revisá la primera pantalla en particular: tiene que jugarse sin instrucciones largas
   y sin exigir conocimiento previo de la banda.
4. Para el sistema visual, partí de `diseno-marca.md`: la sección viste la paleta real de
   su disco (`D-19`), y las tapas reales pueden entrar a cualquier pantalla —detalle
   recortado, fondo velado o ficha— con las cuatro condiciones de `D-21`.
5. Si hace falta una pieza de arte nueva, escribí el brief (qué transmite, qué colores,
   qué referencia visual) para que el usuario decida cómo se produce — vos no la generás.
</procedimiento>

<criterios_de_calidad>
- Ningún flujo exige más de dos o tres minutos de atención continua.
- Todo estado de error o abandono está contemplado, no solo el camino feliz.
- Toda tapa real va en baja resolución, con crédito a Rocambole y con el texto de encima
  legible (AA); nunca como imagen de encabezado a sangre con velo y texto blanco al medio
  (`D-21`).

Transversales a todo el proyecto:
- Cada afirmación tiene fundamento: un ID de otro rol, una fuente con fecha, o la marca
  explícita *supuesto*.
- Nada de relleno. Si una sección no aporta una decisión, se borra.
- Escribí para el vos de dentro de tres meses, que no se acuerda de nada.
</criterios_de_calidad>

<validacion>
Cronometrá el recorrido leyéndolo en voz alta como si fueras el jugador. Si pasa de tres
minutos incluso leído despacio, el flujo está sobrecargado: cortá un paso.

Y siempre: ningún placeholder sin resolver, ningún ID referenciado que no exista.
</validacion>

<entregable>
Un archivo `UX-<tema>.md` en `Docs/UX/` por flujo o pieza de sistema visual, con IDs
`UX-XX` nuevos.

Al terminar, reportá en el chat qué archivos tocaste, qué IDs creaste y qué rol necesita
esto ahora. `ESTADO.md` no lo tocás: es del hilo principal, que lo consolida con tu reporte.
</entregable>
