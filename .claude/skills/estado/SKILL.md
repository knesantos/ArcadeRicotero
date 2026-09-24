---
name: estado
description: Muestra dónde quedó RicotaArcade y cuál es el próximo paso, leyendo ESTADO.md y las siete carpetas de rol. Usar al empezar cualquier sesión de trabajo en este proyecto, sobre todo después de una ráfaga larga sin tocarlo.
disable-model-invocation: true
---

<objetivo>
Que una ráfaga nueva, con contexto en cero, sepa en treinta segundos dónde está el
proyecto y qué sigue. Es lo primero que se corre siempre.
</objetivo>

<procedimiento>
1. Leé `ESTADO.md`.
2. Contrastá contra la realidad del disco — `ESTADO.md` puede estar desactualizado:
   - Qué archivos hay en `Docs/PRODUCTO/`, `Docs/ARQ/`, `Docs/INVESTIGACION/`,
     `Docs/CONTENIDO/`, `Docs/UX/`, `Docs/REVISIONES/` y `Docs/ORQ/`, y de cuándo son.
   - Qué IDs están declarados (`US-`, `BR-`, `ADR-`, `CTR-`, `RES-`, `CNT-`, `UX-`,
     `FIND-`, `T-`) y cuáles no tienen entregable asociado.
3. Si `ESTADO.md` y el disco no coinciden, **manda el disco**. Corregí `ESTADO.md` y
   avisá qué estaba desfasado.
4. Calculá el próximo paso con esta prioridad, en orden:
   1. Algo marcado `en curso` que quedó a medias.
   2. Algo marcado `bloqueado` cuyo bloqueo ya se resolvió.
   3. El primer `pendiente` sin dependencias abiertas.
   4. Si no hay nada: proponer el próximo ciclo con `/ciclo`.
5. Regla de estado: **nunca degrades un estado por inferencia.** Si el disco sugiere que
   algo retrocedió, reportalo como inconsistencia y preguntá. Solo el usuario baja un
   estado.
</procedimiento>

<entregable>
En este formato:

```
RicotaArcade — <fecha>

HECHO       <n>  <lo último, una línea>
EN CURSO    <n>  <qué y de qué rol>
BLOQUEADO   <n>  <qué falta y de quién depende>
PENDIENTE   <n>

PRÓXIMO PASO
<una acción concreta, con el rol y el comando para arrancarla>

DESFASAJES
<qué decía ESTADO.md que el disco desmiente, o "ninguno">
```
</entregable>
