---
name: revisor-metodo
description: Método para producir hallazgos FIND-XX verificando lo entregado contra criterios declarados y contra el schema vigente de RicotaArcade. Usar cuando el rol revisor reciba una entrega para chequear antes de que se dé por lista.
argument-hint: [entrega a revisar]
---

<objetivo>
Confirmar, con contexto fresco, si lo entregado cumple lo que se prometió — ni más
estricto que el criterio escrito, ni más permisivo.
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/BRIEF.md` — el objetivo del proyecto.
- El criterio contra el que revisás: una historia `US-XX` en `Docs/PRODUCTO/`, un
  contrato `CTR-XX` o `ADR-XX` en `Docs/ARQ/`, o el schema de `src/data/`.
- Lo entregado en sí: el archivo, el JSON, o el diff.
</contexto>

<procedimiento>
1. Leé el criterio primero, y anotá en qué consistiría cumplirlo, antes de mirar lo
   entregado — así no te contaminás con la intención del que lo escribió.
2. Compará línea por línea o campo por campo. Si es un JSON, corré la validación contra
   el schema con `Bash` (nunca edites el archivo para "arreglarlo" de paso).
3. Por cada desvío, clasificá la severidad: bloquea (rompe un criterio de aceptación o
   el schema), importante (afecta la experiencia pero no rompe nada), menor (gusto,
   diferible).
4. Prestá atención especial a dos cosas que este proyecto no perdona: un dato
   verificable sin ficha `RES-XX` ni marca de leyenda, y cualquier pieza que use audio,
   tapas o letras sin que la nota de derechos la cubra.
5. Si no encontrás nada mal, decilo con esas palabras — no inventes un hallazgo menor
   para justificar la revisión.
</procedimiento>

<criterios_de_calidad>
- Todo hallazgo cita el ID exacto del criterio incumplido, no una impresión general.
- Todo hallazgo trae evidencia verificable: archivo, línea, o salida de comando.
- El gusto personal sin criterio escrito detrás no es un hallazgo: se difiere.

Transversales a todo el proyecto:
- Cada afirmación tiene fundamento: un ID de otro rol, una fuente con fecha, o la marca
  explícita *supuesto*.
- Nada de relleno. Si una sección no aporta una decisión, se borra.
- Escribí para el vos de dentro de tres meses, que no se acuerda de nada.
</criterios_de_calidad>

<validacion>
Preguntate si un hallazgo, de resolverse, cambiaría si algo pasa o no pasa la revisión.
Si la respuesta es no, es una sugerencia, no un hallazgo: movelo a diferido.

Y siempre: ningún placeholder sin resolver, ningún ID referenciado que no exista.
</validacion>

<entregable>
Como sos read-only, no escribís el archivo: devolvés cada hallazgo `FIND-XX` completo,
listo para pegar en `Docs/REVISIONES/`, en tu mensaje de reporte.

Al terminar, reportá en el chat, en máximo 10 líneas: los hallazgos con su severidad, y
qué rol tiene que resolver cada uno.
</entregable>
