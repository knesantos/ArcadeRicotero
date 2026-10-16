# REV-23 — Los recitales en pantalla y "Armá tu recital" (`D-72`)

Revisor, 2026-10-15. Rama `ciclo-21/recitales`, sin commitear. Criterios: `voz-ricotera.md`,
`diseno-marca.md`, `CTR-19.9` (`RNF-CTR-19-A` y `RNF-CTR-19-B`), `CLAUDE.md` §6 (veracidad),
la seguridad de `desafio.ts` y los estados de la isla. Numeración: `FIND-153` en adelante.

> El rol `revisor` es de solo lectura y no pudo escribir este archivo: lo pegó el hilo principal
> tal como lo entregó, resumido en una línea por hallazgo. Al pie, cómo quedó cada uno.

Verificado por el revisor: `npm test` 1626 de 1626, `npm run check` 0 errores. Leyó el código; no
abrió el navegador (eso lo hizo el hilo principal antes y después). **Sin hallazgos de severidad
alta.**

## Hallazgos

- **FIND-153 — media.** Al cambiar de pantalla el foco cae al `<body>` (`mostrar()` de
  `partida-recital.ts`). Vara: `enfocarTitulo` de "Ponelos en fila".
- **FIND-154 — media.** Después de sumar un tema el foco se pierde: el botón tocado vuelve
  deshabilitado y `.focus()` no hace nada; con teclado se vuelve al principio de los 105.
- **FIND-155 — media.** "Cambiá la lista" no corta la lista que suena: `irAlArmado()` no llamaba
  a `pararTodo()`.
- **FIND-156 — media.** Elegir lugar desde la puerta, con una lista guardada, la borraba sin aviso.
- **FIND-157 — baja.** La lista guardada se rearmaba con las operaciones y volvía distinta
  (`{lista:[], bises:[7,8]}` → `{lista:[7], bises:[8]}`).
- **FIND-158 — baja.** En "En vivo" el botón de un tema decía "Escuchá la lista: …" en el nombre
  accesible.
- **FIND-159 — baja.** "En vivo" no decía que suenan diez segundos de la versión del disco (no el
  audio de esa noche) ni que se saltean los que no tienen recorte. `CLAUDE.md`: veracidad.
- **FIND-160 — baja.** "Muchas a medias" sin ficha que lo respalde, y "Dos listas enteras" cuando
  la fuente no dice si están completas (`CTR-19.7`). "Dos" escrito a mano.
- **FIND-161 — baja.** Los lugares salen de una muestra de 40 noches y se ordenaban por cuántas
  figuran, sin decirlo: se lee como importancia.
- **FIND-162 — baja.** "Lo que más aparece" numeraba puestos que `CTR-19.3` dice que no se
  guardan (y el corte separaba un empate).
- **FIND-163 — baja.** La lista plegada no mostraba la clase de los temas fuera de catálogo (95 de
  183).
- **FIND-164 — baja.** El aviso decía "de la lista" también cuando el tema iba al bis; `ARMADO.suena`
  sin usar.
- **FIND-165 — baja.** "Terminó. Las luces se prenden." salía también al frenar o si fallaba, y es
  una imagen en un aviso de registro 3.
- **FIND-166 — baja.** `scrollIntoView` suave sin mirar `prefers-reduced-motion`.
- **FIND-167 — baja.** El lugar elegido se marcaba solo con color de borde.
- **FIND-168 — baja.** El link depende del orden de los 105 sin un test que lo ancle.

## Diferidos que dejó anotados

`LUGARES.recital` a 320 px (34 caracteres); "Mi lista" al reenviar una ajena; la propia noche
recargada se leía como ajena; la semántica del `<dl>` del rótulo; Concordia aparece en las dos
secciones; rótulos a 0,7 rem; el enlace de la hoja sin revocar; lo que solo se ve en un iPhone
(`T-426`); y `CTR-19.8` adelantado al contrato hasta `T-422`.

## Cómo quedó cada uno (hilo principal, 2026-10-15)

| Hallazgo | Estado | Dónde |
|---|---|---|
| `FIND-153` | arreglado: `enfocarTitulo` al entrar a cada pantalla | `partida-recital.ts` |
| `FIND-154` | arreglado: el foco pasa al tema que sigue en el cajón | `partida-recital.ts` |
| `FIND-155` | arreglado: `irAlArmado()` para lo que suena | `partida-recital.ts` |
| `FIND-156` | arreglado: "Elegí dónde" conserva la lista guardada; empezar de cero es "Armá otra" | `partida-recital.ts` |
| `FIND-157` | arreglado: se restaura tal cual y se valida con `esPosible()`, con test | `armado.ts` |
| `FIND-158` | arreglado: "Escuchá <tema>" y `aria-pressed` | `en-vivo.astro` |
| `FIND-159` | arreglado: rótulo `comoSuena` en cada lista | `copy.ts`, `en-vivo.astro` |
| `FIND-160` | arreglado: la bajada no afirma nada sin ficha, el título es "Noche por noche, tema por tema", sin número | `copy.ts` |
| `FIND-161` | arreglado: el rótulo dice que es una muestra de 40 noches y que no están todos; orden por la primera noche anotada | `copy.ts`, `listas.ts` |
| `FIND-162` | arreglado: `ul` sin número | `en-vivo.astro`, `sitio.css` |
| `FIND-163` | arreglado | `en-vivo.astro` |
| `FIND-164` | arreglado: `sumado` dice "bis N"; `suena` sale | `copy.ts`, `partida-recital.ts` |
| `FIND-165` | arreglado: "Terminó la lista." solo si sonó hasta el final (la rocola avisa `completa`) | `rocola.ts`, `copy.ts` |
| `FIND-166` | arreglado en las dos islas | `en-vivo.ts`, `partida-recital.ts` |
| `FIND-167` | arreglado: borde doble y más grueso | `juego.css` |
| `FIND-168` | arreglado: `HUELLA_RECITAL` y un test que la recalcula | `desafio.ts`, `link.test.ts` |
| Diferidos | arreglados: reenviar una ajena dice "Una lista para…"; la propia recargada no se lee como ajena; el `<dl>` tiene su `dt` para la licencia de salida; el enlace de la hoja se revoca. Quedan para `T-426` y para `contenido`/`experiencia` el renglón a 320 px y el tamaño de los rótulos | varios |

Verde después de los arreglos: `npm test` 1628 de 1628, `npm run check` 0 errores, `npm run build`.
Repasado en el navegador: foco en cada pantalla, el foco después de sumar, la lista que deja de
sonar al volver al armado, la lista guardada que no se borra, y "En vivo".
