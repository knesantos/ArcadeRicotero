# HILO → contenido, experiencia, producto, arquitectura: el menú, el paso entre niveles y el mando de Skayboy (`D-61`)

> Lo escribe el hilo principal el 2026-10-04, con el pedido del usuario y lo que se construye en
> la misma sesión. **La decisión es `D-61`** (`Docs/DECISIONES.md`); acá está lo que cada rol
> tiene que escribir en su carpeta para que el papel diga lo mismo que el código. Números
> reservados en `Docs/IDS.md`: `UX-37`, `CNT-40`, `BR-40`, `T-401`..`T-410`, `REV-21`.

## Lo que se construye (resumen de `D-61`)

1. **Menú de entrada** encima del fichín, adentro de `.fichin` (para que se vea en la pantalla
   completa del sistema). Botón grande: jugar el nivel que corresponde (el primero sin pasar).
   Abajo, **los seis niveles, todos abiertos**, cada uno con número, nombre (`CNT-21`) y un sello
   si está pasado. Desde la partida se abre con un sello `MENÚ` en el mueble, arriba a la
   izquierda (el de pantalla completa está arriba a la derecha), y la partida queda en pausa:
   el mundo no avanza mientras el menú está abierto.
2. **Tarjeta de fin de nivel**: aparece en el mismo cuadro en que se gana, **abajo**, nunca en el
   centro del área (el baile y el contador de `UX-33` §2.5 quedan a la vista). Nombra el nivel
   pasado y ofrece: seguir al siguiente (nombrándolo), repetir, volver al menú. En el sexto, seguir
   lleva al primero (como hoy) y la tarjeta dice "Último nivel.". El toque invisible sobre el área
   (`#seguir-juego`) sigue igual.
3. **Rótulo de entrada de nivel**: al empezar cada nivel, arriba del área, número y nombre, un par
   de segundos, y se va solo. No toma toques, no anima (aparece y desaparece).
4. **El pulgar rueda**: la columna sigue al dedo por geometría (la tecla más cerca del dedo, sin
   franjas muertas), y si el pulgar sube de una flecha al bloque de saltar sin levantarse, salta y
   **sigue yendo para ese lado**. Un pulgar por columna alcanza para correr saltando.
5. **Pantalla completa en cualquier posición**: el botón aparece también parado y **dice lo que
   hace**, no el estado. En Android el teléfono gira solo al entrar; en iPhone, parado, el área va
   arriba y los mandos abajo. El menú también tiene el botón.
6. **Portada**: el casete pasa de A9 a **A4**, justo después de "Adiviná el tema".

## Para `contenido` → `CNT-40`

Los textos nuevos. El hilo pone un borrador para poder construir; **lo que mande `CNT-40` es lo
que queda**, y el hilo lo copia a `src/lib/skayboy/copy.ts` sin retocar. Reglas: `voz-ricotera.md`
(registro 1 en botones y títulos, registro 3 en sellos y avisos), `D-17` (voseo, sin anglicismos),
`BR-24` (nada de vidas, muerte, perder, puntaje, rango, tiempo), `BR-31` (nada que narre un logro
compartido: "ganaron", "lo lograron"). Los sellos van en la letra rotulada (Archivo Black, con
tildes). Hueco por hueco:

| Hueco | Dónde se ve | Borrador del hilo | Nota |
|---|---|---|---|
| `MENU.sello` | sello en el mueble, durante la partida | `MENÚ` | registro 3, una palabra |
| `MENU.abrir` | `aria-label` del sello | `Abrí el menú` | voseo |
| `MENU.jugar` | botón grande, al entrar | `Jugá` | |
| `MENU.seguirJugando` | botón grande, con una partida en pausa | `Seguí jugando` | |
| `MENU.repetir` | botón chico, con una partida en pausa | `Empezá el nivel de nuevo` | |
| `MENU.cualToca(n, nombre)` | renglón chico debajo del botón grande | `Nivel 3: Un favor que no se ve` | registro 3 |
| `MENU.niveles` | título de la lista | `Los niveles` | |
| `MENU.numero(n)` | número de cada ficha | `Nivel 3` | |
| `MENU.pasado` | sello en la ficha pasada | `PASADO` | registro 3 |
| `MENU.estasAca` | sello en la ficha que se está jugando (en pausa) | `ACÁ ESTÁS` | |
| `MENU.etiqueta(n, nombre, estado)` | `aria-label` de cada ficha | `Nivel 3, Un favor que no se ve. Pasado.` | |
| `FIN_DE_NIVEL.rotulo(n, total)` | sello grande de la tarjeta | `NIVEL 2 DE 6 · PASADO` | registro 3. No dice "ganaron" |
| `FIN_DE_NIVEL.sigue(nombre)` | renglón chico de la tarjeta | `Sigue: Un favor que no se ve` | |
| `FIN_DE_NIVEL.seguir` | botón principal de la tarjeta | `Seguí` (`PANTALLA.seguir`, el verbo del sitio) | ya existe |
| `FIN_DE_NIVEL.volverAlPrimero` | botón principal en el sexto | `Volvé al primero` | |
| `FIN_DE_NIVEL.repetir` | botón de la tarjeta | `Repetí` | |
| `FIN_DE_NIVEL.menu` | botón de la tarjeta | `Elegí otro` | abre el menú |
| `ENTRADA.rotulo(n, total)` | rótulo de entrada, primera línea | `NIVEL 2 DE 6` | registro 3 |
| (el nombre) | rótulo de entrada, segunda línea | el `nombre` de `CNT-21` | ya existe |
| `PANTALLA_COMPLETA.ventana` | sello del botón, fuera del modo | **hoy `PANTALLA NORMAL`** → borrador `PANTALLA COMPLETA` | **cambia `CNT-22` §1**: el usuario no lo encontró; tiene que decir lo que hace el toque |
| `PANTALLA_COMPLETA.completa` | sello del botón, en el modo | **hoy `PANTALLA COMPLETA`** → borrador `SALÍ` | ídem |
| `PANTALLA_COMPLETA.entrar` / `.salir` | `aria-label` | quedan como están | |

Si algún borrador no pasa la vara, cambialo: el hilo copia lo que diga `CNT-40`.

## Para `experiencia` → `UX-37`

Documentar el menú, la tarjeta, el rótulo y el pulgar tal como se construyen, y enmendar lo que
contradicen: `UX-27` §5.1 (tres capas de HTML con texto encima del área: menú, tarjeta y rótulo),
`UX-28` §1 (el menú de entrada) y §2.2 (el pulgar que rueda y el arrastre de dirección), `UX-32`
§4 y §5 (la tarjeta), `UX-33` §1.9 (el botón parado) y §1.2 (la estampa dice el verbo). Y los
desvíos que ya estaban en `HILO-para-experiencia-pantalla-completa.md`. El lienzo (hoja nueva
para el menú y la tarjeta) queda como tarea del usuario, igual que `T-319`.

## Para `producto` → `BR-40`

Enmendar `US-09` criterio 3 (el menú de entrada: no pregunta nada, el botón grande es jugar) y
criterio 9, y `BR-31` §3: **los seis niveles abiertos**; la fila manda dónde se retoma, no qué se
puede jugar.

## Para `arquitectura`

`ADR-10.5`: el menú, la tarjeta de fin de nivel y el rótulo de entrada viven adentro de
`.fichin`. `CTR-16.11.2`: se puede elegir cualquier nivel sembrado; el avance sigue siendo
`pasados` y se escribe igual; "dónde se retoma" no cambia.
