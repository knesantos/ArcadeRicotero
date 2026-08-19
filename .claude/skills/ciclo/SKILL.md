---
name: ciclo
description: Planifica el próximo ciclo de trabajo de RicotaArcade por lote de ráfaga, no por calendario. Corta lo que sigue en tareas T-XX con dueño, archivos exactos y verificación, y marca cuáles son paralelizables. Usar cuando un ciclo cierre o no esté claro por dónde seguir.
argument-hint: [opcional: foco del ciclo, ej. "juego 2"]
disable-model-invocation: true
---

<objetivo>
Convertir "hay que seguir" en una lista de tareas que se pueden empezar sin pensar más,
del tamaño exacto de una ráfaga.
</objetivo>

<procedimiento>
1. Leé `ESTADO.md`, `Docs/BRIEF.md` y el backlog en `Docs/PRODUCTO/`.
2. La capacidad de este proyecto **no se mide en tiempo**: se mide en ráfagas. Planificá
   para lo que entra en una a tres ráfagas, no para un calendario. Si no sabés cuánto dura
   una ráfaga típica del usuario, preguntalo antes de cortar tareas.
3. Elegí qué entra, con este orden:
   1. Desbloquea a otro rol (ej. una ficha `RES-XX` que `arquitectura` está esperando).
   2. Reduce el riesgo número uno de `Docs/DECISIONES.md` (derechos o Spotify, según
      cuál esté más caliente).
   3. Acerca la definición de "listo" de la v1: piso de ítems de algún juego.
   4. Todo lo demás.
4. Cortá en tareas. Cada tarea `T-XX` lleva:
   - Un dueño (uno solo, de los siete roles).
   - Los archivos exactos que va a tocar.
   - El ID del requisito que satisface (`US-XX`, `BR-XX`…).
   - Cómo se verifica que está lista (un comando, un archivo que existe, un criterio).
   - Marca `[P]` si puede correr en paralelo: archivos distintos y sin dependencias.
5. Verificá conflictos: si dos tareas `[P]` tocan el mismo archivo, o una depende de la
   ficha `RES-XX` que la otra todavía no trajo, no son paralelas. Sacale la marca a una.
6. Tamaño: una tarea que no se puede terminar en una ráfaga está mal cortada. Subdividila.
7. Escribí el plan en `Docs/ORQ/ORQ-plan-ciclo-<n>.md` y actualizá `ESTADO.md`.
</procedimiento>

<criterios>
- Cada tarea tiene **una** responsabilidad. Si la descripción lleva un "y", son dos.
- Ninguna tarea depende de algo que no está en el ciclo o ya está hecho.
- Si el ciclo entero depende de una decisión sin tomar (`ADR-01` de Spotify, la nota de
  derechos), el ciclo es esa decisión, no lo que viene después.
</criterios>

<entregable>
Tabla en el chat, máximo 20 filas: `T-XX | rol | qué | archivos | verifica con | [P]`.
Abajo: qué quedó afuera y por qué, y cuál es el riesgo del ciclo.
</entregable>
