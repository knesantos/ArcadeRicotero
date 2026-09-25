---
name: orquestador-metodo
description: Método para cortar tareas T-XX de una ráfaga y detectar huecos de coherencia entre los siete roles de RicotaArcade. Usar cuando el rol orquestador tenga que armar el plan de un ciclo o revisar si las piezas entregadas encajan.
argument-hint: [ciclo o foco a planificar]
---

<objetivo>
Bajar "hay que seguir" a tareas que un futuro yo, con contexto en cero y tokens
limitados, pueda ejecutar sin releer todo el repo.
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/BRIEF.md` — el objetivo y los seis riesgos conocidos.
- `ESTADO.md` — qué quedó a medias, bloqueado o pendiente.
- Las siete carpetas de rol: `Docs/PRODUCTO/`, `Docs/ARQ/`, `Docs/INVESTIGACION/`,
  `Docs/CONTENIDO/`, `Docs/UX/`, `Docs/REVISIONES/`.
</contexto>

<procedimiento>
1. Recorré cada carpeta de rol y armá el mapa de qué existe, qué falta y qué contradice
   a otra carpeta.
2. Para cada hueco, identificá la capa (requisitos, diseño, hechos, construcción,
   verificación) y el rol dueño de cerrarlo. Un hueco sin dueño no entra al plan: se
   reporta aparte.
3. Cortá el trabajo restante en tareas `T-XX`, cada una con un dueño, los archivos
   exactos, el requisito que satisface y cómo se verifica.
4. Marcá `[P]` las tareas que un usuario con poco tiempo podría delegar en paralelo:
   archivos distintos, sin dependencia de una tarea que todavía no cerró.
5. Ordená por: qué desbloquea a otro rol, qué reduce el riesgo número uno vigente en
   `Docs/DECISIONES.md`, qué acerca el piso de ítems de algún juego.
6. Escribí el plan en `Docs/ORQ/ORQ-plan-ciclo-<n>.md`.
</procedimiento>

<criterios_de_calidad>
- Ninguna tarea mezcla dos responsabilidades.
- Ninguna tarea `[P]` comparte archivo con otra `[P]` del mismo plan.
- Toda tarea traza a un `US-XX`, `BR-XX`, `ADR-XX` o hallazgo `FIND-XX` — una tarea sin
  ID de origen es trabajo que nadie pidió.

Transversales a todo el proyecto:
- Cada afirmación tiene fundamento: un ID de otro rol, una fuente con fecha, o la marca
  explícita *supuesto*.
- Nada de relleno. Si una sección no aporta una decisión, se borra.
- Escribí para el vos de dentro de tres meses, que no se acuerda de nada.
</criterios_de_calidad>

<validacion>
Elegí al azar una tarea del plan y leela sin ver el resto: ¿alcanza para arrancarla sin
preguntar nada más? Si no, le falta contexto — completala.

Y siempre: ningún placeholder sin resolver, ningún ID referenciado que no exista.
</validacion>

<entregable>
Un archivo `ORQ-plan-ciclo-<n>.md` en `Docs/ORQ/` con la tabla de tareas y el reporte de
coherencia del ciclo.

Al terminar, reportá en el chat qué archivos tocaste, qué IDs creaste y qué rol necesita
esto ahora. `ESTADO.md` no lo tocás: es del hilo principal, que lo consolida con tu reporte.
</entregable>
