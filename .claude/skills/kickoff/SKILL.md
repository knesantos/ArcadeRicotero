---
name: kickoff
description: Entrevista profunda de arranque de RicotaArcade. Completa el conocimiento que la instanciación dejó pendiente, resuelve los supuestos del brief y llena las carpetas de los siete roles con su primer entregable. Usar la primera vez que se abre Claude Code en este proyecto, y cada vez que el objetivo cambie de forma.
argument-hint: [opcional: área a profundizar]
disable-model-invocation: true
---

<objetivo>
RicotaArcade se creó con una entrevista corta a propósito: en ese momento no había
equipo, ni carpetas, ni contexto. Ahora sí. Esta skill hace la entrevista que **de
verdad** define el proyecto, y la convierte en el primer entregable de cada rol.

Al terminar, `Docs/BRIEF.md` deja de tener supuestos sin confirmar y cada carpeta de rol
tiene algo adentro. Ese es el arranque real.
</objetivo>

<antes_de_empezar>
Leé `Docs/BRIEF.md` y `Docs/EQUIPO.md` completos.

Marcá todo lo que figure bajo "Supuestos sin confirmar" como pregunta obligatoria. Los
más urgentes: si los juegos 3 y 4 son "completar la letra" y "adivinar la tapa", si el
usuario ya tiene fragmentos de audio propios, y qué tan cerrada está la nota de derechos.
No vuelvas a preguntar nada que el brief ya conteste con confianza.
</antes_de_empezar>

<procedimiento>

## Bloque 1 — Confirmar lo que se asumió (obligatorio)

Una ronda de `AskUserQuestion` por cada supuesto de `Docs/BRIEF.md`, agrupados de a 4.
Formato: el supuesto como primera opción ("Sí, es así"), y las alternativas reales.
Incluí siempre: idioma y tono, juegos 3 y 4, origen de los fragmentos de audio, y si hay
fecha límite real pese a que el brief diga que no la hay.

## Bloque 2 — Profundizar el objetivo

1. **El día en la vida.** *Contame el momento exacto en que un fan abre esto en el
   celular. ¿Qué estaba haciendo antes? ¿Qué hace después de jugar una partida?*
2. **El fracaso.** *Si en tres meses esto no sirvió, ¿cuál va a haber sido el motivo más
   probable — derechos, Spotify, o que el banco de preguntas quedó corto?*
3. **El corte.** *Si tuvieras la mitad del tiempo, ¿cuál de los cuatro juegos sacarías
   primero?*
4. **El material.** *¿Ya tenés fragmentos de audio grabados, o hay que planificar cómo
   se producen?*

## Bloque 3 — Una pregunta por rol

- `producto`: ¿los juegos 3 y 4 quedan como "completar la letra" y "adivinar la tapa", o
  cambian?
- `arquitectura`: ¿hay cuenta de Spotify Premium disponible para evaluar el Web Playback
  SDK, o `ADR-01` debe asumir que no?
- `investigador`: ¿hay alguna fuente de discografía o cronología que el usuario ya
  confía y no hay que re-verificar?
- `contenido`: ¿cuánto texto de una letra está dispuesto el usuario a citar antes de que
  el riesgo de derechos se sienta real?
- `experiencia`: ¿hay referencia visual concreta de Rocambole que el usuario ya tenga en
  mente?
- `revisor`: ¿hay algún criterio no negociable (ej. tiempo de carga) que si se rompe
  bloquea todo lo demás?
- `orquestador`: ¿de cuántos tokens o cuántas horas suele ser una ráfaga típica?

## Bloque 4 — Riesgos y restricciones duras

Repasá los seis riesgos de `Docs/BRIEF.md` uno por uno: ¿sigue vigente, cambió, o se
resolvió? Prestá atención especial a derechos y a Spotify: son los que bloquean publicar.

## Bloque 5 — Escribir

1. Reescribí `Docs/BRIEF.md` completo: supuestos confirmados pasan a hechos, los
   corregidos se corrigen, lo que quede sin confirmar se marca **PENDIENTE**.
2. Registrá en `Docs/DECISIONES.md` toda decisión nueva, con alternativas descartadas.
3. Delegá a cada rol su primer entregable, en paralelo cuando sea posible: `producto`
   confirma juegos 3 y 4 y el piso de ítems; `arquitectura` abre `ADR-01`;
   `investigador` arranca las primeras fichas `RES-XX`; `contenido` esboza la nota de
   derechos; `experiencia` propone el primer flujo del quiz.
4. Actualizá `ESTADO.md`: kickoff hecho, primer entregable de cada rol, próximo paso.

</procedimiento>

<criterios>
- Una pregunta por vez cuando la respuesta cambia la siguiente. El resto, agrupado.
- Si el usuario dice "elegí vos", elegí, escribilo como decisión propia en
  `Docs/DECISIONES.md` y seguí.
- Si una respuesta contradice el brief, gana la respuesta de ahora y se anota el cambio.
- Máximo 20 preguntas en total.
</criterios>

<entregable>
Máximo 20 líneas en el chat: qué supuestos se confirmaron o corrigieron, el riesgo
número uno con las palabras del usuario, qué produjo cada rol y en qué archivo, qué
quedó PENDIENTE, y el próximo paso concreto.
</entregable>
