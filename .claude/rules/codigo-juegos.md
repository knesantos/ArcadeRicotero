---
paths:
  - "src/**/*.ts"
  - "src/**/*.astro"
---

# Reglas del código de los juegos

Esta carpeta la escribe el hilo principal (no hay rol de implementación: en Claude Code
el que escribe código es quien tiene todo el contexto de la sesión), guiado por los
contratos de `arquitectura` en `Docs/ARQ/` y los flujos de `experiencia` en `Docs/UX/`.

- **Móvil primero.** Diseñá y probá primero para una pantalla chica y una sesión de dos o
  tres minutos. El escritorio es un caso derivado, no el punto de partida.
- **Arquitectura de islas.** HTML estático por defecto. JavaScript solo dentro de la isla
  de cada juego — nada de hidratar toda la página para que funcione un quiz.
- **Presupuesto de precarga de audio.** Los fragmentos propios del reveal progresivo se
  precargan con Web Audio API dentro del presupuesto que fije `arquitectura` en su
  contrato (`CTR-XX`); si no hay contrato todavía, no se hardcodea un número a ojo — se
  pide a `arquitectura`. El reveal tiene que responder al milisegundo desde 0,1 segundo.
- **Spotify entra recién al revelar la respuesta**, nunca antes: no se precarga el SDK ni
  se dispara ninguna llamada a Spotify durante la partida en sí.
- **Nada de datos hardcodeados.** El contenido (preguntas, distractores, tapas, letras)
  viene siempre de `src/data/*.json`, nunca escrito directo en el componente.
- **Sin backend.** Ninguna llamada a un servidor propio: hosting estático, sin sesión de
  usuario, sin persistencia más allá de `localStorage`.
