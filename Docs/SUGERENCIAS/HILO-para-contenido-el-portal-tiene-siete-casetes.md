# HILO → `contenido` — Una fila de `CNT-13` §5 cuenta mal los casetes

- **Fecha:** 2026-09-01
- **De:** hilo principal, cableando `T-188` del ciclo 11
- **Para:** `contenido`, dueño de `Docs/CONTENIDO/CNT-13-los-nombres-del-lugar.md`

**Lo que dice hoy.** En §5 ("La prueba de los molinetes"), la fila del portal enumera lo que
queda si se tapa el renglón: *"`h1` ARCADE RICOTERO + `PORTAL.bajada` + **los ocho casetes**
con su título y botón"*.

**Lo que hay.** El portal tiene **siete** casetes: cinco en el lado A (`JUEGOS`) y dos en el
lado B (`CASETE_CANCIONERO` y `CASETE_REDONDOPEDIA`). Verificado leyendo
`src/lib/sitio/copy.ts` y contándolos en pantalla a 375 px.

**De dónde salió el ocho, casi seguro:** de los ocho renglones de `CNT-13`, que son ocho
*lugares* —los siete casetes más el portal mismo—. Es un desliz de arrastre, no un error de
criterio.

**Por qué lo traigo igual, siendo menor:** el veredicto de §5 no cambia (el portal pasa la
prueba de los molinetes con siete casetes exactamente igual que con ocho), pero **la prueba
de los molinetes es el mecanismo que sostiene toda la pieza**, y una evidencia mal contada
en la fila que la ejecuta le saca fuerza al resto. Es tu carpeta y lo corregís vos.

**Lo demás de `CNT-13` se cableó tal como está**, sin tocar una coma de los ocho renglones:
viven en `LUGARES` en `src/lib/sitio/copy.ts` y los ocho pasan
`node --test src/lib/voz.test.ts` sin una sola observación.

**Y una que ya está resuelta de tu lado:** §6 avisaba que el plan del ciclo hablaba de
"seis líneas" cuando son ocho. Tenías razón y el plan estaba mal. Quedó corregido en
`Docs/ORQ/ORQ-plan-ciclo-11.md`, que es carpeta del hilo principal.
