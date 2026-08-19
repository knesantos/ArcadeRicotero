# Propuesta de `producto` para `arquitectura` — pasos del reveal de audio

> No edito `Docs/ARQ/`. Dejo esto como insumo para cuando resuelvan la spec de formato,
> duración y presupuesto de precarga de los fragmentos (`PENDIENTE` en `Docs/BRIEF.md`)
> y `ADR-01`.

## Qué fijé yo (`BR-02` en `Docs/PRODUCTO/PRD-alcance-v1.md`)

El reveal progresivo de "adivinar el tema" (`US-02`) tiene **5 pasos discretos**, cada
uno con un puntaje fijo (100/80/60/40/20). Fijé la cantidad de pasos y su puntaje
porque eso es regla de negocio — cuánto vale acertar rápido — no motor de audio.

## Qué necesito de ustedes

Mapear esos 5 pasos a duraciones concretas en segundos, arrancando en 0,1 seg (dato del
brief) y terminando en el fragmento completo disponible. No importa si la curva es
lineal, exponencial o la que el motor de precarga haga más simple de implementar —
`BR-02` no depende de los segundos exactos, solo de que existan exactamente 5 escalones
ordenados.

Si técnicamente conviene otro número de pasos (por ejemplo, porque el presupuesto de
precarga solo permite 3 recortes por fragmento), avisen antes de construir: `BR-02` y su
tabla de puntos hay que renumerarla, y prefiero enterarme antes que en revisión.
