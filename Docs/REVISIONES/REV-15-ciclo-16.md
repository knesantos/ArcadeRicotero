# REV-15 — El ciclo 16, verificado contra sus criterios

> Revisado el **2026-09-24** por `revisor` en `T-280`, con contexto fresco y sin haber armado
> ninguna de las piezas. **Pegado en esta ruta por el hilo principal**, como manda el README
> de esta carpeta: `revisor` es read-only. El agente devolvió el veredicto y los hallazgos
> estructurados pero no el texto de la ficha, así que la redacción de este archivo es del
> hilo principal; **los hallazgos, las evidencias y los dueños son los del revisor, copiados
> sin cambiar el sentido.**
>
> **Qué se verificó:** las tareas `T-261` a `T-285` de `ORQ-plan-ciclo-16.md` (§2, §2.3 y
> §2.4) contra su columna "verifica con"; lo que dejó pendiente `T-252` del ciclo 15; y las
> tres imágenes de `public/sprites/`. **No entran** `T-286`..`T-288` ("Completá la letra"
> también sale del conteo, precisión de `D-46`): se sumaron al plan mientras esta revisión
> corría.

## Lo que pasó

- **`npm test`: 1081 de 1081.** Eran 673 al abrir el ciclo.
- **`npm run check`: 0 errores, 0 avisos.** `tsc --noEmit`: 0.
- **`npm run build`: 152 páginas.**
- **Validador del instanciador: `APTA`, 0 errores, 2 avisos**, los dos esperados que ya
  declara `CLAUDE.md` §7.
- **Auditor de paleta: 0.** Los tres atlas usan solo las 15 `--px-*` de `tokens.css`, con
  alfa binario. Los 30 tests de atlas, sala y contraste, en verde.
- **El barrido de vocabulario retirado de `T-252` sale limpio**: todo lo que devuelve son
  enmiendas rotuladas o citas históricas, ninguna regla viva.
- **Los seis nombres de `CNT-21` pasan las siete reglas de `voz.test.ts`**, revisados a mano
  porque el test no mira el dato.
- **`BR-29` reparte las condiciones de `BR-25` sin celdas vacías**, con la tolerancia en
  cuadros y no en adjetivos.

## Los hallazgos

| ID | Gravedad | Qué | Dueño |
|---|---|---|---|
| `FIND-71` | **ALTA** | **`BR-30` da por cumplido algo que el código no hace.** La fila de `US-02` dice, en presente y marcada como enmendada el 2026-09-24: *"Media/Difícil = tercios sobre los 87 restantes"*. Pero `src/lib/en-vivo.ts:139` (`repartirEnVivo`) sigue poniendo `media` a todo lo que no es Fácil y `dificil` solo a lo que no figura en el conteo: la regla vieja, que el propio `BR-30` (líneas 1600-1610) llama defecto porque *"un reparto 8/82/5 no escalona nada después del octavo ítem"*. `repartirEnTercios()` existe en el mismo archivo (:199) y solo la usa `scripts/generar-por-la-letra.mjs`. Y `CTR-19.14` punto 6 (`ARQ-schema-recitales.md:1241-1243`) todavía lo lista como abierto, con "mientras tanto rige el paso 5". **Los tres documentos no dicen lo mismo sobre qué rige hoy**, y ningún test cubre la distribución nueva | `arquitectura` (el contrato y el paso de `CTR-19.5`), con `producto` confirmando la redacción; el código, el hilo principal |
| `FIND-72` | BAJA | `mundo.ts` implementa dos casos de "el empujón no arranca" que `CTR-16.10.5` no escribe: una caja que anda y decidió apoyar acá, y una caja que es el apoyo de otro arranque del mismo subpaso (`mundo.ts:833-840`, `:874-878`). El código está bien —los agregó la corrección de `T-272` para cerrar un `ALTA`—; lo que falta es el traspaso para que el contrato los diga | hilo principal: traspaso a `arquitectura` |
| `FIND-73` | BAJA | `src/lib/escalonar.ts:61-62` dice que sin opciones *"`US-07` no se entera"*, pero `src/lib/por-la-letra/ronda.ts` llama a `armarRonda()` con `cupoPrimerNivel`: `US-07` usa esa opción desde `T-285` | hilo principal |
| `FIND-74` | BAJA | El traspaso y el reporte de `T-277` dicen que el ladrillo en `[6,7]` de `NIV-03` *"tampoco sirve ahí, medido"*, midiendo con la traza de tres turnos que eligió el solucionador. Con la de dos turnos, en la que Skayboy frena contra el ladrillo, sí sirve. `[9,7]` fue una elección entre dos lugares válidos, no una obligación de la medición | `experiencia` y el hilo principal |
| `FIND-75` | BAJA | El comando (3) de `CTR-09.11` usa `sirveComoVerso()`, y el generador real usa `ventanaValida()` desde `CNT-11` v7. Corrido hoy marca "DESALINEADO" unos 70 de 88 ítems aunque `por-la-letra.json` esté idéntico a `HEAD`. No es de este ciclo, pero sigue sin traspaso | hilo principal: traspaso a `arquitectura` |
| `FIND-76` | BAJA | `CTR-09.11`, enmendado por `T-284`, dice que los casos p0-p7 van junto a `esquemas.test.ts`; están en `src/lib/por-la-letra/banco.test.ts`. Corren y se ponen en rojo bien: lo que no coincide es dónde dice el contrato que están | hilo principal: traspaso a `arquitectura` |
| `FIND-77` | BAJA | Las guardas 5 y 6 del auditor de la isla no cazan dos evasiones obvias: `!import.meta.env.DEV ? … : null` y `new URL(document.URL).searchParams.get('nivel')`. La isla real no usa ninguna; la guarda no las detectaría | hilo principal |

## Lo que no encontró, que también es resultado

- **Ningún `ALTA` de código.** El único `ALTA` es de coherencia entre un documento y lo que
  hace el código, no de un comportamiento roto.
- **Nadie escribió en carpeta ajena**, y ningún agente tocó `ESTADO.md` ni `Docs/ORQ/`.
- **Ningún hex fuera de `tokens.css`, ninguna pastilla de 999px, ninguna barra lateral**,
  ningún anglicismo ni infinitivo en botón en lo que se agregó.
- **Ningún script lee setlist.fm**, y ninguna lista de temas de setlist.fm quedó guardada
  (`RES-73.1`).

## Lo que queda sin comando, y quién lo verifica

| Qué | Quién |
|---|---|
| **La partida en el teléfono**: dos personas a la vez (`BR-25` a), afinar la gravedad y la velocidad, y con eso `deDos: true` y los niveles a `listo` | **el usuario** |
| Que ganar un nivel se vea: hoy la sala no tiene dibujo de puerta abierta (`Docs/SUGERENCIAS/HILO-para-experiencia-ganar-no-se-ve-la-puerta-no-tiene-dibujo-abierto.md`) | `experiencia`, y después el hilo principal |

## Veredicto

**El ciclo 16 cierra en estado sólido, con un `ALTA` real (`FIND-71`) y seis `BAJA` de
arrastre**, casi todas traspasos que faltan escribir. La verificación mecánica está entera en
verde. **Nada bloquea salvo `FIND-71`**, y lo que queda del juego en sí es del usuario: jugarlo
en un teléfono.
