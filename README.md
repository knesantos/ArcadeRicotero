# RicotaArcade

Un sitio de juegos sobre Patricio Rey y sus Redonditos de Ricota, con contenido
investigado en serio, pensado para jugarse desde el celular en ratos sueltos.

## Arrancar

```bash
cd RicotaArcade
claude
```

Adentro, en este orden:

| Comando | Cuándo |
|---|---|
| `/kickoff` | La primera vez. Completa la definición del proyecto. |
| `/estado` | Al empezar cualquier sesión. |
| `/ciclo` | Cuando hay que planificar el próximo tramo de trabajo. |
| `/coherencia` | Antes de construir un juego nuevo y al cerrar cada ciclo. |

## El equipo

| Rol | Qué hace | Carpeta |
|---|---|---|
| `producto` | Alcance de la v1, qué juegos entran, piso de ítems | `Docs/PRODUCTO/` |
| `arquitectura` | Stack, motor de audio, integración con Spotify, schema | `Docs/ARQ/` |
| `investigador` | Hechos externos con URL y fecha, o leyenda rotulada | `Docs/INVESTIGACION/` |
| `contenido` | Banco de preguntas, distractores, tono, nota de derechos | `Docs/CONTENIDO/` |
| `experiencia` | Flujos de sesión corta en móvil, sistema visual | `Docs/UX/` |
| `revisor` | Verifica lo entregado contra los criterios declarados | `Docs/REVISIONES/` |
| `orquestador` | Corta el trabajo en tareas por ráfaga, detecta huecos | `Docs/ORQ/` |

Detalle completo, con la justificación del séptimo rol, en `Docs/EQUIPO.md`.

## Dónde está cada cosa

| Archivo | Qué es |
|---|---|
| `Docs/BRIEF.md` | El objetivo. Si dudás de para qué existe algo, está acá. |
| `ESTADO.md` | Dónde quedó todo. |
| `Docs/DECISIONES.md` | Por qué las cosas son como son. |
| `Docs/EQUIPO.md` | Quién hace qué y quién es dueño de qué carpeta. |
| `Docs/IDS.md` | Cómo se numeran los requisitos y las tareas. |
| `CLAUDE.md` | Las reglas que Claude Code lee en cada sesión. |

## Convenciones

- Cada rol escribe **solo** en su carpeta. Para pedirle algo a otro:
  `Docs/SUGERENCIAS/<PREFIJO>-para-<OTRO>-<tema>.md`.
- Todo requisito y toda tarea tienen ID trazable (ver `Docs/IDS.md`).
- `ESTADO.md` se actualiza al terminar cada sesión. Es el contrato con tu yo futuro,
  clave en un proyecto que avanza por ráfagas y no por calendario.
- **Construir y jugar en local está habilitado; publicar no.** El gate de derechos
  bloquea la publicación hasta que la nota de `Docs/CONTENIDO/` esté cerrada y el usuario
  complete su investigación previa (`D-07`). Escribir preguntas y código no espera a nadie.

---

*Generado por InstanciadorProyectos el 2026-08-19.*
