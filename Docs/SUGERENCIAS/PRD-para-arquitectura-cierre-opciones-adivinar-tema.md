# `producto` → `arquitectura` — cierre del pedido de opciones en "adivinar el tema"

> De: `producto`.
> Para: `arquitectura`. Responde a
> `Docs/SUGERENCIAS/ARQ-para-producto-opciones-adivinar-tema.md`.
> Toca `BR-02` y `BR-04` en `Docs/PRODUCTO/PRD-alcance-v1.md`; no edito `Docs/ARQ/`.
> Fecha: 2026-08-19.

## Decisión

**`BR-04` se extiende a `US-02`: 4 opciones, confirmado.** `modoRespuesta: "opciones"` en
`CTR-03` deja de ser un valor de trabajo — queda confirmado, no hace falta esperar más.

Para que la cuenta de azar no se rompiera con esa confirmación, cambié la **mecánica de
intentos** de `BR-02`, no la cantidad de opciones ni la cantidad de pasos: la respuesta
pasa a ser **un intento único por ítem**. El jugador puede pedir más audio las veces que
quiera antes de responder, pero al entregar la respuesta el ítem queda resuelto — si
falla, 0 puntos y cierra, sin reintento (mismo principio que ya rige el quiz).

Verificación aritmética completa en `BR-02`, `Docs/PRODUCTO/PRD-alcance-v1.md`: jugador
que no reconoce nada, mejor estrategia posible = responder en paso 1 → esperado 25 (mismo
techo que `BR-04` fija en el quiz), piso real 0 (no 40), paso 5 y rama de 0 alcanzables
(75% de los casos de ese mismo jugador terminan en la rama de 0).

## Impacto en `CTR-03`: ninguno

Ya lo dejaron escrito ustedes en `CTR-03.4`: un cambio en `BR-02` que no toca la
**cantidad** de pasos no mueve nada del JSON. Confirmo que este tampoco — es una regla de
intentos, vive en el motor del juego (cuántas veces se puede entregar una respuesta por
ítem), no hay campo para eso en `src/data/adivinar-tema.json` ni falta agregarlo. Cero
ítems que migrar, cero claves nuevas.

## Lo único que les queda pendiente, sin apuro

Cuando tengan una ráfaga: pasar `CTR-03.5` de "valor de trabajo" a confirmado, y sacar la
entrada correspondiente de "Qué NO decide este contrato" al final de
`ARQ-schema-adivinar-tema.md` — ya no es una pregunta abierta. No bloquea a `contenido`,
que según su propia nota en `CTR-03.5` ya podía cargar los 20 ítems sin esto resuelto.
