---
name: coherencia
description: Verifica que los entregables de los siete roles de RicotaArcade encajen entre sí y reporta cada hueco con el rol responsable. Usar antes de empezar a construir un juego nuevo y al cerrar cada ciclo, sobre todo si pasó mucho tiempo entre ráfagas.
disable-model-invocation: true
---

<objetivo>
Encontrar los huecos entre roles antes de que se conviertan en retrabajo. Los agentes
trabajan con contexto aislado: nadie ve el conjunto salvo acá.
</objetivo>

<procedimiento>
Verificá, en este orden, y pará en la primera capa que falle — arreglar una capa de
arriba invalida las de abajo:

1. **Requisitos → definición.** Toda `US-XX` de `Docs/PRODUCTO/` tiene su piso de ítems
   fijado. Toda `BR-XX` está referenciada por al menos una `US-XX`.
2. **Definición → diseño técnico y de contenido.** Toda decisión de producto tiene su
   contraparte en `Docs/ARQ/` (schema, motor de audio), `Docs/UX/` (flujo) y
   `Docs/CONTENIDO/` (banco de preguntas). Lo decidido en `Docs/DECISIONES.md` sigue
   vigente en los entregables.
3. **Hechos → uso.** Toda afirmación verificable en `Docs/CONTENIDO/` cita una ficha
   `RES-XX` de `Docs/INVESTIGACION/`, o está rotulada explícitamente como leyenda.
4. **Diseño → construcción.** Todo lo diseñado tiene una tarea `T-XX` en `Docs/ORQ/` o
   está explícitamente diferido. Todo `T-XX` traza a un requisito.
5. **Construcción → verificación.** Todo criterio de aceptación tiene cómo comprobarse,
   y si ya se entregó, tiene su hallazgo `FIND-XX` de `revisor` (o su ausencia explícita).
6. **Huérfanos.** Archivos en `Docs/` que nadie referencia; IDs citados que no existen;
   IDs existentes que nadie cita; JSON de `src/data/` sin schema que los valide.

Para cada hueco: **qué falta, en qué carpeta va, y qué rol lo tiene que producir.** Sin
dueño no es un hallazgo, es una queja.
</procedimiento>

<criterios>
Reportá solo lo que rompe la cadena. Un documento que podría estar mejor escrito no es
un hueco de coherencia. La nota de derechos incompleta **sí** es un hueco de coherencia:
bloquea la publicación entera. Si encontrás algo incidental sin ligazón causal con lo que
se está construyendo ahora, anotalo como diferido y seguí.
</criterios>

<entregable>
Máximo 25 líneas:

```
CAPA QUE FALLA: <requisitos | diseño | hechos | construcción | verificación | ninguna>

HUECOS
- <qué falta> → Docs/<CARPETA>/ → rol <id> → bloquea a <qué>

HUÉRFANOS
- <archivo o ID> — <por qué sobra>

DIFERIDOS
- <hallazgo incidental, para no perderlo>
```
</entregable>
