# Del hilo principal para `producto` y `contenido` — dos huecos que encontró el ciclo de `US-07`

**Fecha:** 2026-08-27 · **Origen:** el ciclo estético de "Sacalo por la letra" (`D-30`,
`D-31`) · **No edité ni `Docs/PRODUCTO/` ni `Docs/CONTENIDO/`**, como corresponde.

Los dos son cosas que **encontré tocando otra cosa** y que no me corresponde resolver. Van
juntos porque comparten forma: los dos tienen dueño, y los dos están hoy a la vista de la
gente.

---

## 1. Para `producto` — el `h1` del quiz tiene diez palabras, y la regla dice ocho

`voz-ricotera.md` 4.1 fija el techo en **ocho palabras** para toda línea grande del sitio, y
sale de medir los 104 temas: el verso mediano tiene cinco y el 90% no pasa de ocho. El
título de la portada del quiz es:

> *"Entrá a jugar con los Redondos, sepas lo que sepas."*

Diez palabras, y sale como `<h1>` en `src/pages/quiz.astro`.

**Por qué te llega ahora.** Extendí `voz.test.ts` en este ciclo y quise sumarle los
`PANTALLA_0.titulo` de los cinco juegos a la lista de líneas grandes que audita. **Ese
cambio rompe el build hoy**, y por esta línea sola. Así que lo dejé sin hacer: cerrar el
auditor dejando al quiz afuera de la lista sería escribir un test que mira para otro lado, y
recortar la línea es una decisión tuya, no mía.

**Lo que pido:** o se recorta a ocho, o se declara la excepción por escrito. Cualquiera de
las dos me deja cerrar el hueco del auditor. Si sirve, el problema no es el largo sino que
la línea hace **los dos trabajos a la vez** —nombra y canta—, que es justo lo que la regla
de las dos líneas reparte en dos.

Dato para decidir: los otros cuatro juegos pasan holgados. Es una línea, no un patrón.

---

## 2. Para `contenido` — un verso del banco viene corrupto desde el cancionero

En `por-la-letra.json`, el tema `maldicion-va-a-ser-un-dia-hermoso` muestra este verso:

> *"Pintan mal las cosas para **,l** mi viejo"*

No es del generador: viene así de `src/data/cancionero.json` (dos veces, líneas ~26614 y
~26686), o sea que **también se ve en la ficha de letra y acordes**. Tiene toda la pinta de
un accidente de codificación donde había un `él`.

**Cuánto es:** barrí los 712 versos del banco buscando puntuación pegada y salieron cuatro.
Los otros tres no son defectos —son puntos suspensivos y signos del original, que en las
letras del Indio son estilo y no error—:

- `"Maté... y maté... y maté!.....y maté"`
- `"Estos ojos...de quién son? de quién son mis deseos de hoy?"`
- `"entre sopores,modorras ciegas"` (a este le falta un espacio, y es cosmético)

**El único roto de verdad es el primero.** No lo toqué porque el banco es tuyo y porque el
proyecto ya tiene el mecanismo para esto: la vía de corrección de `D-25`, que además está
enganchada en este juego — cualquiera que lo vea jugando puede reportarlo desde la pantalla.

**Lo que pido:** que lo mires y decidas si se corrige en `cancionero.json` (que arregla los
dos lugares de una) o si esperás a que llegue por la vía de corrección. Si es lo primero,
conviene revisar de dónde salió: si el `,l` entró en la ingesta, puede haber más en temas
que este juego no toca.

---

## Cómo verificar lo que sí se hizo

```
npm test && npm run check && npm run build
```

Y jugando: `npm run dev`, `/juegos/adivinar-por-la-letra/`, una vuelta entera hasta el
resultado y `COMPARTÍ`.
