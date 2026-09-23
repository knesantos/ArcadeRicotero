# CNT-17 — El pie de homenaje

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-18
- **Estado:** propuesta, lista para cablear. Es condición de la pantalla (`D-42` precisión
  1) y **bloquea la publicación del juego** hasta que exista un texto — este documento lo
  entrega.
- **Consume:** `Docs/DECISIONES.md` `D-42` (los muñecos tienen cara; el pie pasa de
  conveniente a obligatorio), `D-38` barandas 1 y 3 (intactas), `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`
  `BR-26` (las tres cosas que tiene que decir, el registro, dónde va), `BR-27` punto 5 (va
  impreso adentro de la pieza que se comparte), `Docs/SUGERENCIAS/PRD-para-contenido-pie-de-homenaje-y-palabras-vetadas.md`
  §1, `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md` §1, `Docs/UX/UX-27-la-convencion-del-pixel.md`
  §1.1 (la chapa de 24 px), `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md` `RES-64.17` (el
  seudónimo notorio: por eso van los nombres completos y no los apodos), `.claude/rules/voz-ricotera.md`
  §5 (registro 3).
- **Resuelve:** `T-232`.

## 1. El texto exacto

> **`Homenaje de fans, no oficial: ni Eduardo Beilinson ni Carmen Castro tuvieron nada que
> ver.`**

Va **igual en los dos lugares** que pide `BR-26`: visible en la chapa de la pantalla del
juego sin tocar nada, e impreso adentro de la pieza que se comparte (`BR-27` punto 5). Es
la misma cadena en los dos casos — no hay una versión corta para la tarjeta y una larga
para la pantalla; si la tarjeta necesita achicar la letra, se achica la letra, no el texto
(el mismo criterio que `UX-27 §1.1` ya fija para la chapa).

## 2. Por qué este texto y no otro

Las tres cosas de `BR-26`, ninguna opcional, todas presentes:

1. **Que es un homenaje de fans** → "Homenaje de fans".
2. **Que no es oficial** → "no oficial".
3. **Que ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver** → literal, con los
   dos nombres completos y no los apodos (`RES-64.17`: el seudónimo notorio goza de la
   tutela del nombre, así que "Skay" y "la Negra Poli" identifican igual o más que el
   nombre civil — el pie tiene que decir de quién **no** es esto, y para eso sirve
   justamente el nombre, no el apodo con el que juega el muñeco).

**Registro 3, entero, sin excepción:**

- **Seco.** Es una oración informativa, sin adjetivo que la adorne.
- **Sin imagen.** No hay cuerpo, objeto, animal ni plata: es un aviso, no una letra.
- **Sin chiste.** No hay intruso ni jerga — cero palabras en jerga en las 15 que tiene.
- **Sin suspensivos.** Termina en punto.
- **Sin voseo de arenga.** No le pide nada a nadie ni lo interpela: informa y se calla, que
  es lo que `BR-26` compara con un rótulo `LEYENDA` — si el pie tuviera onda, no se podría
  confiar en él.

## 3. Verificación a mano contra las siete reglas de `src/lib/voz.test.ts` §8

> `Homenaje de fans, no oficial: ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver.`

1. Anglicismo (glosario `D-17`): ninguno. ✓
2. Fórmula de folleto: ninguna. ✓
3. Botón/enlace en infinitivo: primera palabra "Homenaje", no es verbo. No es un botón de
   todos modos, es texto informativo fijo. ✓
4. Título de más de 8 palabras: no está en la lista de títulos auditados (no es un título
   de casete ni un `h1`), no aplica. ✓
5. Bajada de casete: no aplica, no es una bajada. ✓
6. "los fans"/"los usuarios" en vez de "la gente": la frase dice **"de fans"**, sin el
   artículo "los" — mismo caso que `PORTAL.pie` en `CNT-16` ("Sitio hecho por ricoteros"),
   donde el sitio se nombra a sí mismo y no está nombrando a la gente como audiencia. La
   regex del test (`\b(los fans|...)\b`) no matchea "de fans". ✓
7. Puntos suspensivos en botón o rótulo: no lleva. ✓

Las siete reglas, verde a mano.

## 4. Nombre de campo sugerido

Sugerencia, no mandato — el nombre final es de quien cablee (`T-239`):

| Campo sugerido | Valor |
|---|---|
| `PIE_HOMENAJE` | `Homenaje de fans, no oficial: ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver.` |

Un solo campo, reusado en la pantalla del juego (`T-240`) y en el módulo de la tarjeta
compartible (`BR-27`, fuera de este ciclo — ver `PRD-skayboy-y-poligirl.md` §"Qué NO entra
al ciclo 15").

## 5. Qué no tiene comando y se mira a ojo

Según `Docs/ORQ/ORQ-plan-ciclo-15.md` §3.3, tres cosas de esta pieza no las corre ninguna
máquina y las verifica `revisor` en `T-250`:

- **Que las tres cosas de `BR-26` estén, con los nombres completos** — lo audita el ojo
  contra la letra de `BR-26`, no un test.
- **Que el registro sea 3 entero** — lo mira `revisor` con `voz-ricotera.md` §5 al lado.
- **Que el texto entre en la chapa de 24 px de `UX-27 §1.1`** sin empujar el área de
  juego — eso se ve recién en el navegador, en `T-240` ("las medidas de `T-240` ... se
  miran en el navegador"). Si no entra a un tamaño de letra legible, lo que se achica es la
  letra, no esta oración (§1 de esta nota).

Lo que sí corre solo, y recién cuando el texto aterrice en `src/lib/skayboy/copy.ts`
(`T-239`): `node --test src/lib/voz.test.ts`, con las siete reglas ya verificadas a mano en
§3.

## Bloqueos

Ninguno. No hace falta ficha `RES-XX`: es decisión de tono y de a quién nombrar, ya
resuelta por `D-42` y `BR-26`.

## Siguiente

`hilo principal` necesita `PIE_HOMENAJE` para cablearlo en `src/lib/skayboy/copy.ts`
(`T-239`) y para ubicarlo en la chapa de `src/styles/skayboy.css` (`T-240`).
