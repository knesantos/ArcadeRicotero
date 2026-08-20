# HILO → experiencia — El sistema de marca fija valores que `UX-04` dejaba abiertos

- **Fecha:** 2026-08-20
- **De:** hilo principal (sesión del sistema de marca, con el usuario al volante)
- **Para:** `experiencia`, dueño de `Docs/UX/UX-04-sistema-visual.md`
- **Consume:** `UX-04`, `RES-06`, `RES-22`, `RES-04`, `D-14`, `D-16`, `D-17`

## Qué pasó

El usuario pidió un sistema de marca ("misterioso, argentino, oscuro y bien ricotero") y
quedó armado como lienzo de diez hojas: **"Sistema de marca Arcade Ricotero"**
(https://claude.ai/code/artifact/59acd1de-80ab-4074-b1ba-b75da05cb134). Fija los valores
exactos que `UX-04` dejó a propósito en manos de "quien produce el arte": hex de paleta,
tipografías, diez estenciles originales, textura de serigrafía y componentes con las
clases que `partida.ts` ya escribe.

`UX-04` es tuyo y no se editó. Esta nota es la propuesta para que decidas qué adoptar.

## Las tres diferencias contra `UX-04`, que te tocan a vos

1. **El error vuelve a rojo.** `UX-04` reservaba "un rojo saturado, único color de error";
   `tokens.css` (T-38) lo había resuelto en rosa (`#ff5d8f`). El sistema vuelve a rojo
   (`#FF4B4B`) — más cerca de tu letra original, pero es tu casilla.
2. **Aparece un oro (`#F5C544`) que no está entre tus cuatro acentos** (magenta, verde
   ácido, naranja quemado, azul eléctrico). Se usa para destaque y foco.
3. **El azul eléctrico queda reservado al sello de testimonio** (`#6FC7FF`), no como
   acento general.

Además la paleta entera corrió hacia tinta cálida sobre negro `#0D0A07` — más oscura que
la descripción "casi negro con matiz cálido" de tu tabla, a pedido del usuario. Los doce
pares texto/fondo pasan WCAG AA (peor par: error sobre fondo, 5,58:1); el comando de
verificación sigue siendo `node --test src/lib/contraste.test.ts`.

## Simbología que se sumó, con ficha

- Perro (`RES-06`/`RES-22`), bandera y estrella (`RES-06`, capa simbólica), molinete
  (`D-14`), la misa/manos (`RES-04`). El trazo es original; el motivo está fichado.
  El esclavo de *Oktubre* sigue afuera (reportado, no verificado).

## Qué se te pide

- Adoptar, ajustar o rechazar las tres diferencias en la próxima revisión de `UX-04`.
- Si adoptás, los hex de trabajo quedan en la hoja 03 del lienzo y en el diff de la
  hoja 10 (listo para pegar en `tokens.css`).

## Pendiente que puede pisar esto

El usuario pidió además usar **tipografías reales de los discos** (fuentes hechas por
fans sobre el lettering de las tapas). `investigador` está buscando qué existe y con qué
licencia. Si eso avanza, la hoja 04 (tipografía) cambia — y la decisión de estética final
vuelve a ser tuya con `D-04` sobre la mesa.
