# Para `experiencia` y `arquitectura`: el quiz que cambió con `D-71`

**De:** hilo principal · **Fecha:** 2026-10-15 · **Ciclo 20**, rama `ciclo-20/preguntas-ricoteras`

El usuario pidió rehacer "Preguntas ricoteras" entero porque *"hoy está muy duro y feo"*. Lo
hizo el hilo principal en la isla y en `juego.css`; el banco lo reescribió `contenido`
(`CNT-41`). Sus documentos quedaron atrás en lo que sigue. Nada de esto traba: es para que el
papel diga lo que hay en el código.

## Para `experiencia` — `T-412`

`UX-01` v2 y `UX-07` describen la pantalla vieja. Lo que hay ahora (detalle en `D-71`):

1. **El tablero** reemplaza la cabecera de 13 px: fichas de vida grandes, `Nº` de la pregunta,
   un **riel** con un paso por pregunta partido en escalones (lleno = acierto, hueco = error,
   amarillo y alto = la que se juega, bajo y apagado = lo que falta), y **"Cerrá la partida"
   arriba a la derecha**. Antes caía entre las opciones y la respuesta.
2. **La pregunta es un recorte** con cinta, borde en la tinta de la categoría (`D-19`) y los
   sellos arriba. El aviso de escalón es una franja estampada adentro de la ficha, con su línea
   que canta. Mientras se lee la respuesta, el tablero sigue mostrando la pregunta respondida y
   no ofrece cerrar.
3. **Opciones con letra** (A–D), una columna hasta 40rem, teclado 1–4 o A–D. La elegida errada
   se tacha; las otras dos se apagan a `--texto-tenue`.
4. **La respuesta** reusa `.revelacion` de "Adiviná el tema": grito estampado, racha (3, 5 y 10)
   como segundo sello, la correcta escrita grande y **la tapa del disco** (`fijado`) si el ítem
   tiene `disco`. La explicación pasa a `--texto`.
5. **`SEGUÍ` en una barra pegada abajo** (`.seguir-barra`), como el mazo de "Ponelos en fila".
6. **El resultado**: sello del desenlace, `Nº` grande en `--acento-2` (la moneda de las vidas),
   y **la planilla** por escalón con ✔ ✕ ·. Viaja en el texto de compartir con ◆ y ✕.
7. **La portada** suma la línea que nombra cómo se juega, con las tres fichas.

**El lienzo** ("Sistema de marca Fichín Ricotero") no tiene ninguna de estas piezas. Por el
circuito de `diseno-marca.md` el cambio tendría que haber entrado primero por el lienzo; entró
por el código porque no se agregó ni un valor nuevo (ningún token, ningún hex, ninguna fuente):
todo es combinación de piezas que la hoja 08 ya tiene. Falta pegar la pantalla en la hoja 09.

## Para `arquitectura` — `T-413`

`CTR-02` (`Docs/ARQ/ARQ-schema-quiz.md`) tiene que asentar dos cambios que ya están en
`src/data/_schema/quiz.schema.json`:

1. **`disco`**, opcional: uno de los diez slugs de `src/lib/letra/discos.ts` (los mismos de
   `public/tapas/`). Viaja al cliente (`aPayload`) porque la pantalla lo muestra al revelar.
   Es aditivo: un ítem sin `disco` valida igual, así que `contratoVersion` sigue en 1.
2. **`fuentes`** acepta `RES-` de dos **o tres** dígitos (`^RES-\d{2,3}$`). Las fichas pasaron
   `RES-99` hace rato (`INV-100`, `INV-150`, `INV-172`) y el patrón viejo impedía citarlas.
