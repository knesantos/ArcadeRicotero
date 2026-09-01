# HILO → `arquitectura` — Un temporizador que `ADR-04.3` no autoriza, y por qué está

- **Fecha:** 2026-09-01
- **De:** hilo principal, cerrando `T-191` del ciclo 11
- **Para:** `arquitectura`, dueño de `Docs/ARQ/ARQ-cama-de-cinta.md`
- **Consume:** `ADR-04.3` (los dos oídos, la curva, y la prohibición de encuestar)

## Lo que dice el ADR

> *"**No hay encuesta.** Ni `setInterval`, ni `requestAnimationFrame`. El barrido corre en el
> mismo evento que ya despertó la pregunta."*

Se cumplió al pie, y está bien: no hay un solo bucle de cuadros en la pieza.

## El agujero que dejó, y lo encontró una refutación, no una prueba

El barrido del conjunto de medios **solo corre adentro de un evento**. Y hay un caso sin
evento: un medio que la pantalla saca del documento y que el navegador frena sin avisar. No
hay evento de "me sacaron del árbol". Si eso pasa, `medios` nunca se vacía, `debeCallarse()`
devuelve `true` para siempre, y **la cama queda muda hasta que se recargue la página**.

El síntoma es el peor de todos: *ninguno*. Nadie reporta una atmósfera que no volvió.

La prueba que había —*"un `<audio>` que se saca del documento mientras sonaba no la deja muda
para siempre"*— pasaba porque **disparaba otro evento después**, que es el que barría. El
refutador quitó ese evento y el caso se cayó.

## Lo que hice, y es un desvío de tu apartado

Una **red**: un solo temporizador, armado **únicamente mientras la cama está callada por un
medio**, que vuelve a preguntar una vez y se rearma solo si sigue habiendo motivo.

```
if (medios.size > 0) armarRevision();   // en la rama que decide callarse
```

- Con la cama **sonando**, **apagada**, o callada por cualquiera de las otras tres razones
  —la salida tomada, la página escondida, el contexto interrumpido—, **no existe**: esas
  tres tienen evento propio y no necesitan red.
- El intervalo es `ESPERA_PARA_VOLVER_SEG`, que ya es tuyo.
- Se cancela en `apagarCinta()`, en `volver()` y en el reinicio de pruebas.

**El peor caso pasa de "muda para siempre" a "muda seis segundos de más".**

## Por qué esto y no las alternativas

| Alternativa | Por qué no |
|---|---|
| **`MutationObserver` sobre el documento** | Es el mecanismo correcto en teoría y el más caro en la práctica: dispararía en cada cambio del DOM de un juego —que redibuja pantallas enteras— para atender un caso que ocurre casi nunca |
| **Dejarlo como estaba** | Es la mudez permanente sin síntoma, que es justo lo que tu apartado 3 existe para evitar |
| **Un `setInterval` corto** | Eso sí sería una encuesta, y con razón la prohibiste |

## Lo que te pido

**Ratificalo o cambialo en `ADR-04.3`.** Si lo ratificás, la redacción de la prohibición
convendría que diga qué es lo que veda —el bucle de cuadros y la encuesta permanente— y qué
deja pasar —un temporizador acotado a un estado, como red de un caso sin evento—, porque hoy
dice "no hay encuesta" y esto, leído estricto, lo es.

Está construido, probado (`node --test src/lib/sitio/cinta.test.ts`, el caso *"un medio que
se va sin avisar y sin que pase nada más: la red la despierta"*) y comentado en el código con
este mismo argumento y con el puntero a esta ficha.

## Y tres cosas más de la misma refutación, ya arregladas, que te tocan mirar

1. **El candado del segundo toque estaba del lado equivocado del `await`.** Dos llamadas a
   `prenderCinta()` que se pisaran armaban **dos grafos**, y el segundo dejaba al primero
   sonando sin apagador. Ahora el segundo toque **espera la promesa del primero** en vez de
   irse con un estado viejo. No cambia nada de tu contrato.
2. **La cama nacía encima de un `<audio>` que ya estaba sonando**, porque los escuchas solo
   traen eventos futuros. Ahora `registrarOidos()` barre el documento una vez al registrar.
   Es una lectura, no una encuesta, y creo que estaba implícito en tu oído 2.
3. **`rearmarCinta()` no la llamaba nadie.** `ADR-04.4` promete el rearme con el primer toque
   de la página siguiente y la función existía huérfana. La isla ya la llama.
