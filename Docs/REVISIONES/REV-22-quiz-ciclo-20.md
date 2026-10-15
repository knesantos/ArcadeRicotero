# REV-22 — Ciclo 20: Preguntas ricoteras rehecho (`D-71`, `CNT-41`)

Revisor, 2026-10-15. Rama `ciclo-20/preguntas-ricoteras`, sin commitear. Criterios: `CLAUDE.md` §6 (veracidad), `.claude/rules/contenido-json.md`, `voz-ricotera.md`, `diseno-marca.md`, `BR-19`, `CNT-04`, `CNT-41`. Numeración: `FIND-141` en adelante.

> El rol `revisor` es de solo lectura y no pudo escribir este archivo: lo pegó el hilo principal
> tal como lo entregó. Al pie, cómo quedó cada hallazgo.

Verificado: `npm test` 1608 de 1608. `npm run check` 0 errores, 14 hints. Fichas leídas: RES-02, 05, 06, 07, 08, 20, 22, 47, 48, 90, 100, 154–159, 168–171, más INV-172 y el PDF del memoir (RES-21) extraído a texto.

## Hallazgos

- **FIND-141 — QZ-064 (hecho, difícil) — `CLAUDE.md` §6 y `contenido-json.md` — ALTA.** El ítem dice «En Tandil, en octubre de 1997, la banda hizo algo por única vez»: una conferencia de prensa televisada, «el 4 de octubre, junto a un recital ante 21.000 personas». El memoir (RES-21) la ubica en **Olavarría**, después de que el intendente Helios Eseverri prohibiera el recital del 15 de agosto de 1997: «cuando nos prohibieron en Olavarría y dimos la conferencia de prensa», «la primera y última conferencia de prensa de Los Redonditos de Ricota», transmitida «en vivo y prácticamente en cadena». `INV-172` l.65 ya la dejaba «sin resolver: Olavarría (INV-02 l.551) o Tandil (RES-05, N-016)»; la única fuente de Tandil es RES-05 (Wikipedia), repetida en RES-100 N-016. El que sabe la historia ve un lugar y una fecha falsos en una pregunta de hecho. Arreglo: ubicarla donde dice el memoir, rotularla, o retirarla; `investigador` corrige RES-05 y N-016.
- **FIND-142 — QZ-055, explicación — `contenido-json.md` (cita pertinente) — MEDIA.** «Ni multinacional, ni televisión, ni avisos de los recitales»: «ni televisión» sale de RES-07, pero lo contradicen QZ-064, RES-05 l.99 y el memoir («la televisión transmitió en vivo»), y QZ-026 habla del último videoclip. La respuesta (multinacional) se sostiene y no hay segunda correcta: RES-05 trae Montevideo (22-jul-1989 y abr-2001) y River (abr-2000). Arreglo: sacar «ni televisión». `redondopedia.json` l.1581 repite la frase; `investigador` debería matizar RES-07.
- **FIND-143 — QZ-026 (media) y QZ-005 (difícil) — `CNT-41` §1 y el espíritu de `fugas.test.ts` — MEDIA.** Misma respuesta y mismas cuatro opciones; QZ-026 sale siempre antes e imprime «En Último bondi a Finisterre, de 1998». QZ-005 queda regalada. `fugas.test.ts` l.76 la perdona porque 026 «no dice nada del sello», y no alcanza.
- **FIND-144 — QZ-021, explicación — BAJA.** «80.000 personas cada una» sin cautela (`INV-100` l.241: supera la capacidad del estadio) y «se confunden seguido» sin ficha.
- **FIND-145 — QZ-060, explicación — BAJA.** RES-156 no dice «barrio» (`INV-172` l.199 lo avisa); el trabajo de campo fue entre dic-2008 y sep-2009, no «en 2009».
- **FIND-146 — QZ-045, explicación — BAJA.** «La receta venía de un libro de cocina de una tal Patricia Rey»: RES-05 l.130 pide verificarlo antes de usarlo, y el memoir cuenta otra cosa (un recetario de Postres Royal con una cocinera ficticia llamada Patricia Rey, de donde salió el nombre, sin atarlo a los buñuelos).
- **FIND-147 — QZ-050, explicación — voz §4.6 y precisión — BAJA.** «La vuelta de la banda, en 1991» inventa un regreso; el memoir habla del uno-dos de la consagración masiva y del tema del año.
- **FIND-148 — QZ-062 y QZ-064 — `D-17` — BAJA.** «Show» tiene equivalente corriente: «recital».
- **FIND-149 — `src/lib/voz.test.ts` — `voz-ricotera.md` §8 — BAJA.** No lee `src/data/quiz.json`, que es el mayor volumen de texto visible del sitio. Por eso pasó FIND-148.
- **FIND-150 — `partida.ts`, atajos A–D y 1–4 — WCAG 2.1.4 (A) — BAJA.** Atajos de una tecla, globales, sin forma de apagarlos; no excluyen `shiftKey`.
- **FIND-151 — `partida.ts`, `Nº` y `aria-describedby` — `UX-07` — BAJA.** `aria-label` sobre un `<p>` (ARIA 1.2 no le da nombre y varios lectores lo ignoran); y la descripción del enunciado arrastra el texto de «Cerrá la partida».
- **FIND-152 — `selloRevelado()` y los rótulos de QZ-020 y QZ-063 — voz §5 — BAJA.** Se lee «Esto es leyenda: Leyenda: …».

## Sin hallazgos

- `npm test` 1608/1608, `npm run check` 0 errores; todas las `RES-` del banco existen y el schema valida.
- 44 `listo`, 14/15/15, 11 por categoría, 34 hecho, 7 leyenda, 3 testimonio. La correcta es la más larga solo en QZ-031.
- Los versos de QZ-047, 048 y 058 están solo en su tema entre los 104 del cancionero, y ningún distractor los contiene. Pistas, duraciones y autorías contra RES-20: QZ-031, 039, 040, 042, 043, 047, 049 correctas.
- Verificados contra fichas: QZ-004, 012, 014, 015, 020, 021 (el año), 022, 023, 025, 026, 028, 029, 032, 035, 036, 041, 052, 053, 054, 056, 057, 059, 063, 065.
- QZ-025 (Bulacio) cumple `CNT-04` caso 1: registro 3 seco, pregunta institucional.
- Campo `disco`: coincide en los 23 ítems que lo traen, y las tapas existen.
- Copy nuevo: cumple `D-17` y la tabla del §7; solo grita el acierto.
- CSS del bloque `D-71`: sin sombras, hex, gradientes, pastillas ni barras laterales; estados con símbolo y forma; pares de color ya testeados; movimiento por `--duracion-*`.
- `BR-19`: retirada arriba, en dos pasos, sin temporizador; escalón = pozo; derrota gana sobre victoria.
- Foco, región viva, `role=img` en vidas y planilla, riel oculto al lector, `alt` en la tapa, nada por `innerHTML`.

## Diferidos (no rompen un criterio escrito)

- «Te falta escuchar disco.» le dice «te falta» al que entró sin idea (choca con el espíritu de `CNT-02`); «¡Justo en el hueso!» no es modismo corriente.
- Criterio dispar de casilla: QZ-015 hecho («según él», entrevista publicada) contra QZ-026/028 testimonio; QZ-061 leyenda con respuesta de calendario; QZ-053 podría ser testimonio.
- QZ-029: un distractor es compatible con la correcta. QZ-051: «La fiesta» tiene uso periodístico.
- QZ-046, 050 y 053 traen datos del memoir en la explicación de un fácil.
- QZ-057: «Rex suena a Rey, y la trampa era esa» explica el chiste.
- Rótulos de QZ-062 y QZ-063 con frases de registro 2.
- `fugas.test.ts`: entradas muertas en `MENCION_SIN_RESPUESTA` (QZ-002, 008, 009, 030, 033 retirados).
- La región viva nace con contenido (patrón anterior a `D-71`).
- La partida entera de 44 supera los 2–3 minutos del brief; la retirada lo resuelve (`BR-19` §7).
- Pedidos abiertos a `investigador` de `CNT-41` §6.

## Siguiente

- `contenido`: FIND-141 a 148 y 152.
- `investigador`: RES-05/N-016 (Olavarría o Tandil), matizar RES-07, cerrar la advertencia de RES-05 sobre Patricia Rey, y los pedidos de `CNT-41` §6.
- Hilo principal: FIND-149, 150 y 151.
