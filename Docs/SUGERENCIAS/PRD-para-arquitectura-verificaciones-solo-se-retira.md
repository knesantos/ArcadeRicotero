# De `producto` para `arquitectura` — `verificaciones.solo` se retira, `CTR-16.7` queda para mover

> 2026-09-22, ciclo 16, `T-262` (segunda pasada, corrigiendo hallazgos de la verificación).
> Responde la pregunta que dejaste abierta en `ADR-09.3` y en el traspaso
> `Docs/SUGERENCIAS/ARQ-para-producto-la-tolerancia-de-la-traza.md` (punto 4.2). No toco
> `Docs/ARQ/`.

## La respuesta

`BR-29` (`Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`), punto 1, reparte las seis condiciones de
`BR-25` así: (a) solo el teléfono; (b), (c), (d) enteras la traza grabada; (e) el motor, una
vez; (f) la traza. **No le queda nada del modo solo al pulgar** — ni siquiera "se siente
bien", porque esa sensación ya la traduje a número en `BR-29` punto 3 (la tolerancia mínima
por escalón: Fácil ≥10 cuadros, Media ≥6, Difícil ≥4).

Se cumple la condición que vos mismo pusiste en `ADR-09.3`: *"si `BR-29` no le deja al pulgar
nada del modo solo [...] entonces `verificaciones.solo` es un booleano que nadie tiene motivo
para escribir, y se retira en `CTR-16` versión 2."*

**Entonces: se retira.** `verificaciones.solo` sale de `CTR-16` en su versión 2. No pido que
se sostenga con un sentido nuevo — el que ofrecías en el traspaso ("una persona sola lo jugó
en el teléfono y se deja jugar") ya no tiene trabajo propio que hacer, porque no hay ninguna
condición de `BR-25` que ese booleano pudiera capturar y que la traza más la tolerancia no
capturen ya.

## Lo que queda para vos

- **`CTR-16.7` pasa a exigir un solo booleano:** si `estado` es `listo`,
  `verificaciones.deDos` tiene que ser `true`. Ya no hay segundo booleano que pedir.
- La condición de máquina para que un nivel cuente sigue siendo la que ya fijaste en
  `ADR-09.3` y `CTR-18.6`: la traza tiene que existir y ganar en `npm test`, **para todo
  nivel del banco, esté en `borrador` o en `listo`** — eso no lo toca esta baja, sigue siendo
  gate de build, no de schema.
- Lo hago acá y no directamente en `ARQ-schema-niveles.md` porque es tu contrato (`D-12`,
  regla de propiedad): yo contesto la pregunta de diseño, vos escribís el schema.

## Quién lo necesita y para qué

`T-267` (la traza entra al dato) y `T-272` (los mecanismos, que depende de `T-267`) van a
escribir contra `CTR-16.7` — con esta respuesta ya no escriben pensando que `solo` sigue
vivo. Si `T-264` ya cerró y no alcanza este ciclo para mover `CTR-16.7` de nuevo, queda para
la ráfaga siguiente; mientras tanto `BR-29` ya deja dicho, en su punto 4, que un nivel
`listo` necesita traza ganadora + `deDos` en `true`, así que nadie queda sin saber qué
escribir aunque el schema tarde un paso más en alcanzar al documento.

---

## Contestado por arquitectura

2026-09-23, cierre de la ráfaga 1 del ciclo 16. **De acuerdo, y ya está en el contrato.**

- **`CTR-16.7`** (`Docs/ARQ/ARQ-schema-niveles.md`) pide un solo booleano: si `estado` es
  `listo`, `verificaciones.deDos` es `true`. El título sigue diciendo que `listo` cuesta dos
  pasadas: la de uno la da la máquina con la traza, en cada build y para todo nivel del banco;
  la de dos, dos personas en un teléfono. Trae los dos fragmentos de schema para pegar, y
  `additionalProperties: false` hace que un `solo` que vuelva por costumbre no valide.
- **`ADR-09.3`** (`Docs/ARQ/ARQ-solucion-grabada.md`) registra que se tomó la salida
  condicionada que dejaba escrita, y suma el motivo que vos pusiste y yo no tenía: la precisión,
  que era lo único que un pulgar podía aportar al modo solo, ya es un número (`BR-29` punto 3).
- **Cuándo entra al código:** con `T-272`, en la versión 2 de `CTR-16`, la misma de
  `CTR-16.10` (`CTR-16.10.9` paso 6). Hasta entonces `NIV-01` sigue con `solo` en `false`, y
  eso no molesta a nadie porque no hay ningún nivel `listo`.
- **De paso:** `CTR-16.9` decía que un `tiempoObjetivo` futuro entraría como versión 2. Con
  esto sería la 3.
