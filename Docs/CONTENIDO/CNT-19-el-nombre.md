# CNT-19 — El nombre del juego y la bajada del casete

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-18. Estado actualizado el 2026-09-20.
- **Estado:** confirmado. **El usuario confirmó el nombre `Skayboy y Poligirl` el
  2026-09-20**, conociendo el argumento de `§1.1` — que el nombre nombra una dupla, no un
  elemento, y por eso el cambio de par de fuego/agua a cielo/infierno no lo tocaba — y lo
  aceptó. `T-234` (`Docs/ORQ/ORQ-plan-ciclo-15.md` §3, fila "dep. usuario") queda cumplida.
  Cómo estuvo pendiente y cómo se cerró queda documentado en `§1`, sin borrar la versión
  anterior de esta nota.
- **Consume:** `Docs/ORQ/ORQ-plan-ciclo-15.md` §3 (`T-234`), `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`
  (`US-09`, el bloque "Lo ya decidido" — el par cielo/infierno, `IDEA-14`), `Docs/DECISIONES.md`
  `D-40`/`D-43` (el cambio de par y de mecanismo), `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md`
  `RES-60` (el nombre del juego de origen no se escribe en ningún lado) y `RES-64.17` (el
  seudónimo notorio), `Docs/UX/UX-30-cielo-e-infierno-en-la-mezcla.md` §5 (el disco no se
  nombra en pantalla), `Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md` §4,
  `.claude/rules/voz-ricotera.md` (registro 1, la regla de las dos líneas, 4.1, 4.2, 4.3),
  `src/lib/sitio/copy.ts` (formato de `JUEGOS`: `titulo` + `baja`).
- **Resuelve:** `T-234` (cumplida).

## 1. El nombre — confirmado por el usuario

> **`Skayboy y Poligirl`**

Este no es un nombre que invente `contenido`: es el que el usuario escribió, textual, en
el pedido que abrió `INV-60` — *"un juego que sea como [el juego de origen] que se llame
skayboy y poligirl"*. Lo único que hago acá es confirmarlo como título de casete en el
registro y formato que usa el resto del portal (mayúscula inicial, sin punto).

**Por qué estuvo pendiente (versión de esta nota del 2026-09-18):** se marcó como
pendiente de confirmación del usuario porque la premisa bajo la que se había elegido
cambió — se pensó cuando el par elemental era fuego/agua y pasó a ser cielo/infierno
(`D-40`, `D-43`). El argumento de por qué eso no obligaba a cambiar el nombre queda
completo, sin editar, en `§1.1`.

**Cómo se cerró:** el usuario confirmó `Skayboy y Poligirl` el 2026-09-20, después de que
se le mostrara ese mismo argumento de `§1.1`. El pendiente se cierra por esa confirmación
explícita, no por defecto ni por vencimiento de plazo.

### 1.1 Por qué el nombre no necesita cambiar aunque el par sí — sin nombrar el juego de origen

`Skayboy` y `Poligirl` se arman pegándole `-boy`/`-girl` a dos apodos reales, Skay y Poli.
Esa construcción nombra **una dupla**, no un elemento: ninguna de las dos palabras dice
fuego, agua, cielo ni infierno. Es un patrón de nombre de equipo (dos personas, un "y" en
el medio), no una etiqueta elemental. Por eso, cuando el par que pisan los personajes pasó
de fuego/agua a cielo/infierno, el nombre no tuvo que tocarse: nunca prometió el elemento,
prometía la pareja. Si algún día el par volviera a cambiar, el nombre seguiría sirviendo
por el mismo motivo.

**Lo que valía la pena que confirmara el usuario, y por eso quedó pendiente:** que
siguiera queriendo este nombre ahora que sabe que ya no calca el par del juego que lo
inspiró. La alternativa que quedó descartada en `RES-64` — nombrarlos solo por sus
emblemas, sin "Skayboy"/"Poligirl" — se dejó de lado ahí mismo porque *"costaba el título
del juego, que es lo que el usuario pidió textual"*; no la reabro acá, solo queda escrita
para que se vea qué se estaba confirmando. **Confirmado el 2026-09-20:** el usuario aceptó
`Skayboy y Poligirl` sabiendo exactamente esto.

### 1.2 Chequeo de `RES-60`

El nombre del juego de origen no aparece en esta nota ni en ningún otro documento de
`contenido`, ni por su título en inglés ni por ninguna de sus dos mitades. Se lo nombra
siempre como "el juego de origen", igual que hacen `PRD-skayboy-y-poligirl.md` e `INV-60`.

## 2. La bajada del casete

> **`Agarrás tu lado del teléfono. Cielo para uno, infierno para el otro: las dos puertas
> se abren juntas, o las cruzás solo, una por vez.`**

### 2.1 La regla de las dos líneas, aplicada al casete

- **La que nombra es el título**, `Skayboy y Poligirl`: dice de qué se trata sin que haga
  falta leer nada más para saber que hay dos personajes.
- **La que canta es la primera oración de la bajada**: `Agarrás tu lado del teléfono.` — 5
  palabras, segunda persona (voseo), imagen física y barata (un objeto de la casa, el
  teléfono, y la mano que lo agarra), y no explica nada de la mecánica: solo describe el
  gesto de agarrar el aparato, que es literalmente lo primero que hace cualquiera de las
  dos personas que juegan (`UX-28 §2.2`, "el agarre").
- **El resto de la bajada nombra**, como hacen las demás bajadas del portal (`Ponelos en
  fila`, `Adiviná la tapa`): dice que hay dos terrenos, que las puertas se abren juntas si
  juegan de a dos, y que se puede jugar solo alternando. No dice **por qué** cada uno pisa
  el terreno que pisa — eso es criterio del sitio y `UX-30 §3` prohíbe explicarlo en
  cualquier pantalla — y no nombra el disco de donde sale la paleta (`UX-30 §5`) ni el
  tema que suena (`CNT-20`).

**La prueba de las dos líneas:** tapando "Agarrás tu lado del teléfono.", lo que queda —el
título más "Cielo para uno, infierno para el otro: las dos puertas se abren juntas, o las
cruzás solo, una por vez."— ya le alcanza a alguien que llega por un enlace para saber qué
es esto y qué botón tocar.

### 2.2 Verificación a mano contra las siete reglas de `voz.test.ts` §8

**`Skayboy y Poligirl`** (título del casete)
1. Anglicismo: ninguno (son nombres propios, no vocabulario del glosario). ✓
2. Fórmula de folleto: ninguna. ✓
3. Infinitivo: primera palabra "Skayboy", no es verbo. ✓
4. Largo: 3 palabras. ✓
6. "la gente": no aplica. ✓
7. Suspensivos: no lleva. ✓

**`Agarrás tu lado del teléfono. Cielo para uno, infierno para el otro: las dos puertas se abren juntas, o las cruzás solo, una por vez.`**
1. Anglicismo: ninguno. ✓
2. Fórmula de folleto: ninguna. ✓
3. Infinitivo: primera palabra "Agarrás" (voseo conjugado), no está en el set de
   infinitivos. ✓
5. Primera frase de la bajada (hasta el primer punto): "Agarrás tu lado del teléfono." = 5
   palabras. ✓
6. "la gente": no aparece "los fans" ni "los usuarios". ✓
7. Suspensivos: no lleva. ✓

## 3. Lo que esta nota no fija

- **El `h1` de la pantalla del juego.** El formato del sitio permite que el título de la
  página propia difiera del título del casete (`quiz.PANTALLA_0.titulo` es distinto de la
  entrada de `sitio.JUEGOS`). Mi propuesta es reusar `Skayboy y Poligirl` también ahí, por
  simpleza, pero si `experiencia` necesita otra cosa para la página en sí, no es esta nota
  la que lo impide.
- **Qué columna maneja a qué personaje** (`BR-23` punto 5). No nombro a nadie por su lado
  de la pantalla en ningún texto de este documento a propósito: esa asignación todavía no
  está escrita en ningún documento de `experiencia`, y fijarla acá sería tomar una decisión
  que no me corresponde.

## 4. Qué no tiene comando y se mira a ojo

- **Que el nombre se confirme por el usuario.** No era una verificación de texto: era una
  aprobación pendiente, explícita en `Docs/ORQ/ORQ-plan-ciclo-15.md` §3 (`T-234`, "dep.
  usuario"). **Se resolvió el 2026-09-20** — el usuario confirmó, ver `§1`.
- **La prueba de las dos líneas** (§2.1 de esta nota): que tapando la bajada, el título más
  el resto de la frase alcancen. La cuenta de palabras la corre `voz.test.ts`; que la frase
  *funcione* como promesa de juego lo mira `revisor`, con `voz-ricotera.md` §5 al lado.
- **Que el juego de origen no aparezca en ningún lado del sitio.** El comando es
  `rg -in "<el título que nombra RES-60>" src/ public/ Docs/UX/ Docs/CONTENIDO/` (plan,
  fila `T-234`) y lo corre `revisor` o el hilo principal — yo no tengo con qué correrlo
  (`D-12`), y esta nota fue escrita revisando a ojo que esa cadena no apareciera acá.

## Bloqueos

- **Cerrado el 2026-09-20.** El nombre no se podía dar por cerrado hasta que el usuario lo
  confirmara conociendo que ya no calca el par del juego de origen (§1.1). El usuario lo
  confirmó (§1), así que ya no queda bloqueo en esta nota.

## Siguiente

El nombre y la bajada de §2 quedaron confirmados para cablearse en `src/lib/skayboy/copy.ts`
(`T-239`). Según lo que reporta quien coordina esta ráfaga, ya están cableados ahí —
`contenido` no corrió ningún comando para comprobarlo (`D-12`) y esta nota no lo certifica
por su cuenta.
