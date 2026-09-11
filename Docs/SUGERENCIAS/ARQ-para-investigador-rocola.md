# `arquitectura` → `investigador`: tres fichas para `ADR-07` (`RES-56`, `RES-57`, `RES-58`)

> Pedidas en `T-212` del ciclo 14. **Ninguna frena `ADR-07`**, que está aceptada: las tres
> cambiarían un repuesto o confirmarían una elección ya tomada. Están escritas en el propio
> ADR (`Docs/ARQ/ARQ-rocola.md`, apartado "Pendientes de ficha") y acá va el pedido con lo
> que cada una necesita responder para servir.
>
> Contexto en una línea: la cinta del sitio pasa a poner temas, transmitiendo un `<audio>`
> que entra al grafo de Web Audio por `createMediaElementSource()` para filtrarlo.

## `RES-56` — ¿`createMediaElementSource()` reproduce con sonido en Safari de iOS?

**Por qué importa:** si ese nodo devuelve silencio en iOS, la rocola queda muda **sin tirar un
error**, y no hay forma de detectarlo desde el código. El repuesto que dejé escrito solo salta
si el constructor **tira** una excepción.

Lo que la ficha tendría que traer, si hay fuente:

- si hay defectos conocidos y abiertos de `MediaElementAudioSourceNode` en Safari de iOS, y
  desde qué versión;
- si el audio de ese camino respeta o ignora la llave lateral de silencio del iPhone (el
  aparato ya tiene el problema documentado en `src/lib/sitio/aparato.ts:14-16`);
- si hay una forma publicada de saber que salió mudo.

## `RES-57` — ¿Existe una señal de "ahorro de datos" expuesta a la web?

**Por qué importa:** un tema entero son ~4 MB y el sitio promete partidas de dos minutos. Si
el navegador declara que la persona está ahorrando datos, la rocola pone recortes (~79 KB) en
vez de temas enteros. **Hoy no afirmo que esa señal exista**, así que la regla está escrita y
no corre.

Lo que la ficha tendría que traer: si existe, cómo se llama, en qué navegadores móviles está
—sobre todo Safari de iOS y Chrome de Android—, qué reporta cuando no se declaró nada, y si
hay además una consulta de medios equivalente.

## `RES-58` — ¿`play()` después de un `await` corto sigue contando como gesto en iOS?

**Por qué importa:** el diseño está hecho para que la respuesta no importe —el `play()` va
antes de cualquier `await`, igual que `ADR-04.2` diseñó para no tener que saber cuántos
`AudioContext` tolera un iPhone—. La ficha sirve para saber si esa regla se puede relajar
algún día o si hay que defenderla con una prueba.

Lo que la ficha tendría que traer: cómo está definida hoy la activación transitoria, cuánto
dura si dura, y si Safari de iOS se comporta distinto del resto.

---

**Rango libre al pedirlas:** `RES-56`+. Si alguna ya está fichada en `Docs/INVESTIGACION/`,
mejor: avisá y la cito en vez de pedirla.
