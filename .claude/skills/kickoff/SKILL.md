---
name: kickoff
description: Entrevista profunda de arranque de RicotaArcade. Completa el conocimiento que la instanciación dejó pendiente, resuelve los supuestos del brief y llena las carpetas de los siete roles con su primer entregable. Usar la primera vez que se abre Claude Code en este proyecto, y cada vez que el objetivo cambie de forma.
argument-hint: [opcional: área a profundizar]
disable-model-invocation: true
---

<objetivo>
Esta skill hace la entrevista que define el proyecto —o que lo redefine, cuando el
objetivo cambia de forma— y la convierte en un entregable para cada rol.

Al terminar, `Docs/BRIEF.md` no tiene un **PENDIENTE** que el usuario pueda contestar, y
cada rol sabe qué le toca.
</objetivo>

<antes_de_empezar>
Leé `Docs/BRIEF.md`, `Docs/EQUIPO.md` y `Docs/DECISIONES.md` completos.

Lo que la entrevista tiene que resolver es lo que el brief marca **PENDIENTE** y lo que el
cambio de objetivo vuelve a abrir. No vuelvas a preguntar nada que el brief o una
decisión `D-XX` vigente ya contesten con confianza.
</antes_de_empezar>

<procedimiento>

## Bloque 1 — Confirmar lo que se asumió (obligatorio)

Una ronda de `AskUserQuestion` por cada supuesto que el cambio de objetivo toque,
agrupados de a 4. Formato: el supuesto como primera opción ("Sí, es así"), y las
alternativas reales.

## Bloque 2 — Profundizar el objetivo

1. **El día en la vida.** *Contame el momento exacto en que un fan abre esto en el
   celular. ¿Qué estaba haciendo antes? ¿Qué hace después de jugar una partida?*
2. **El fracaso.** *Si en tres meses esto no sirvió, ¿cuál va a haber sido el motivo más
   probable?*
3. **El corte.** *Si tuvieras la mitad del tiempo, ¿qué sacarías primero?*

## Bloque 3 — Una pregunta por rol

Leé el último entregable de cada rol y preguntá, por rol, lo que solo el usuario puede
contestar sobre lo que esa carpeta tiene abierto. Si un rol no tiene nada abierto que
dependa del usuario, no se pregunta nada por él.

## Bloque 4 — Riesgos y restricciones duras

Repasá los riesgos de `Docs/BRIEF.md` uno por uno: ¿sigue vigente, cambió, o se
resolvió?

## Bloque 5 — Escribir

1. Reescribí `Docs/BRIEF.md` completo: supuestos confirmados pasan a hechos, los
   corregidos se corrigen, lo que quede sin confirmar se marca **PENDIENTE**.
2. Registrá en `Docs/DECISIONES.md` toda decisión nueva, con alternativas descartadas.
3. Delegá a cada rol el entregable que el cambio de objetivo le abre, en paralelo cuando
   sea posible.
4. Actualizá `ESTADO.md`: kickoff hecho, qué se le pidió a cada rol, próximo paso.

</procedimiento>

<criterios>
- Una pregunta por vez cuando la respuesta cambia la siguiente. El resto, agrupado.
- Si el usuario dice "elegí vos", elegí, escribilo como decisión propia en
  `Docs/DECISIONES.md` y seguí.
- Si una respuesta contradice el brief, gana la respuesta de ahora y se anota el cambio.
- Máximo 20 preguntas en total.
</criterios>

<entregable>
En el chat: qué supuestos se confirmaron o corrigieron, el riesgo número uno con las
palabras del usuario, qué produjo cada rol y en qué archivo, qué quedó PENDIENTE, y el
próximo paso concreto.
</entregable>
