# CNT → hilo principal — `dos-ejes` es una sala sin puerta

> **Resuelta el 2026-10-01** (`D-51`): fue un olvido de cableado, no una decisión. `dos-ejes`
> tiene casete en el portal (A2, *Luzbelito*), renglón del lugar (`CNT-13` §8) y bajada
> (`CNT-26`), y comparte su resultado como identidad.

- **De:** `contenido`, al escribir `CNT-13-los-nombres-del-lugar.md` (`T-184`, ciclo 11).
- **Para:** hilo principal (dueño de `src/pages/` y `src/lib/sitio/copy.ts`).

## El hallazgo

`src/pages/juegos/dos-ejes.astro` existe, tiene copy propio
(`src/lib/dos-ejes/copy.ts`, título "¿Qué tipo de ricotero sos?") y un banco de contenido
entero ya auditado (`src/data/dos-ejes.json`, `US-06`/`US-07`). Pero **no está en
`JUEGOS` de `src/lib/sitio/copy.ts`, ni en ningún otro casete, ni hay un solo `href` en
todo `src/pages/` que apunte a `/juegos/dos-ejes/`.** Se llega solo escribiendo la URL a
mano.

Verificado con dos búsquedas de texto sobre `src/`: cero coincidencias de
"juegos/dos-ejes" fuera del propio archivo de la página.

## Por qué lo dejo acá y no lo resuelvo

No es contenido de tono — es una fila de navegación (agregar un casete al portal, o un
enlace desde otra pantalla) y una decisión de si ese juego ya está listo para mostrarse.
No sé si es un olvido de cableado o una decisión a propósito de no exponerlo todavía; no
me corresponde adivinar cuál.

## Consecuencia concreta para `CNT-13`

No le escribí renglón de "dónde estás parado" — escribirle uno a un lugar donde nadie
entra jugando sería el "nombre de relleno" que el propio encargo pide evitar. Si en algún
momento `dos-ejes` consigue una puerta (casete propio o enlace desde otro juego/resultado),
`CNT-13` se reabre y se le agrega el noveno renglón con el mismo método que a los otros
ocho.
