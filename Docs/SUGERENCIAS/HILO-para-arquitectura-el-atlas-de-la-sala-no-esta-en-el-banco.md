# Del hilo principal para `arquitectura` — el atlas de la sala no tiene lugar en el banco

**Fecha:** 2026-09-24 · **Origen:** `T-278` (ciclo 16), la isla de Skayboy y Poligirl dibuja
con los atlas aprobados · **No edité `Docs/ARQ/` ni el schema**, como corresponde.

## Qué encontré

La isla ya dibuja con los tres atlas de `public/sprites/`. Los nombres de los dos muñecos
los da **el dato**: `banco.personajes[].atlas` (`CTR-16.3`), y el schema ya exige la versión
con `^[a-z]+\.v\d+$`. Así, subir de versión un muñeco es cambiar el JSON del banco, y la
isla la sigue sola.

**La sala no tiene ese campo.** `sala.v1` no aparece en ningún lugar del banco, así que su
nombre vive en el código: `ATLAS_DE_LA_SALA` en `src/lib/skayboy/escena.ts`. Queda cuidado
por un test (`escena.test.ts` lo ata a la `version:` de `src/arte/pixel/sala.txt` y verifica
que el PNG y el JSON estén en `public/sprites/`), así que un `sala.v2` impreso sin tocar la
constante da rojo. **Pero es el único nombre de atlas escrito en el código**, y
`.claude/rules/codigo-juegos.md` pide que el contenido venga de `src/data/*.json`.

## Qué propongo (y es tuyo decidirlo)

1. **Un campo `sala` en el banco**, al lado de `personajes`, con el mismo patrón:
   `"sala": { "atlas": "sala.v1" }` o, más corto, `"atlasDeLaSala": "sala.v1"`. Sube
   `contratoVersion` de `CTR-16`, porque es un campo obligatorio nuevo.
2. **O dejarlo como está** y escribir en `CTR-15` que el atlas de la sala es del motor, no del
   banco. Es defendible: la sala es una sola para todos los niveles, igual que la paleta.

Cualquiera de las dos cierra la pregunta. Si elegís la 1, el cambio en el código es de una
línea en `atlasDe()` de `escena.ts`, y lo hago yo.

## Una cosa chica, de paso

`CTR-15.5` dibuja el árbol de `public/sprites/` con `terreno.v1.png` y `terreno.v1.json`. Lo
que se imprimió y aprobó se llama **`sala.v1`** (`T-276`). El árbol del contrato quedó con el
nombre viejo.
