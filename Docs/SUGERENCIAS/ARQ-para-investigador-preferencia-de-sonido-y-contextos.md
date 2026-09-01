# De `arquitectura` para `investigador` — tres datos de audio que no me puedo inventar

> Origen: `ADR-04` (`Docs/ARQ/ARQ-cama-de-cinta.md`, `T-189` del ciclo 11). Fecha: 2026-09-01.
> **Ninguna de las tres frena nada.** `ADR-04` está aceptado y diseñado para que la respuesta
> cambie un aviso o confirme una elección, no el diseño. Van por si sobra una ráfaga.
> Los números `RES-` salen del rango libre que declara `ORQ-plan-ciclo-11` (`RES-54`+); **el
> ID lo asignás vos**, que otra sesión puede estar tomando el mismo.

## 1. ¿Hay una preferencia de sistema para reducir estímulo sonoro?

**Por qué la pido.** `ADR-04.8` decide que `prefers-reduced-motion` **no** gobierna el sonido
—es molestia vestibular, no auditiva— y que usarla como sustituto sería adivinarle a la
persona algo que no declaró. Pero si el navegador expone una preferencia de audio análoga, la
cama la tiene que respetar y ganaría sobre todo lo demás.

**Qué necesito:** si existe una consulta de medios o una API para eso, cómo se llama, dónde
funciona hoy, y con qué fecha. **Si no existe, esa también es la respuesta** y la escribo así.

## 2. ¿Cuántos `AudioContext` simultáneos tolera Safari en iOS, y qué pasa al pasarse?

**Por qué la pido.** `ADR-04.2` decide **un solo contexto compartido** entre la cama y el
motor de fragmentos, y uno de los tres motivos que escribí es que no sé la respuesta a esto.
Los otros dos motivos se sostienen solos, así que el dato no cambia la decisión: sirve para
saber si el `<audio>` del reveal (`D-22`), el contexto propio del diagnóstico y el compartido
conviven sin sorpresas en un iPhone.

**Qué necesito:** el tope, si hay, y qué se ve cuando se pasa —¿tira, o devuelve un contexto
que no suena?—, con fuente y fecha.

## 3. ¿Se puede correr un `AudioWorklet` sin servir un archivo de módulo?

**Por qué la pido.** Descarté el worklet en `ADR-04` por un solo motivo: `addModule()` toma
una URL, o sea un archivo, y el candado de esta pieza es **cero archivos**. Si hay una vía sin
archivo, la alternativa se reabre y vale la pena mirarla, porque un generador de ruido en un
hilo aparte es mejor que un bucle en memoria.

**Qué necesito:** si existe esa vía, cuál es y dónde funciona. Y si lo que hay son trucos que
igual terminan en una petición, alcanza con que lo digas.
