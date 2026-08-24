# Mapa real del juego de referencia (Songless, lessgames.com)

> Lo escribe el **hilo principal**. No va en `Docs/INVESTIGACION/` porque esa carpeta es de
> `investigador` y su numeración `RES-XX` también; no va en `Docs/ORQ/` por lo mismo. Queda
> acá, que es donde el proyecto pone lo que cruza de una carpeta a otra.
>
> **Qué es:** el relevamiento que pidió el usuario, textual: *"Quiero que hagas un scrapeo
> y un mapa real del juego, no hay que reinventar la rueda, hay que aplicar este juego
> hecho a la página"*.
>
> **Fuente:** https://lessgames.com/songless — recorrido a mano el **2026-08-23**, con el
> navegador, jugando tres partidas completas y leyendo el DOM y el CSS.
> **Qué se relevó:** mecánica, pantalla y comportamiento. **Nada de código ni de material
> de ese sitio se copió**: lo que sigue son observaciones sobre cómo se comporta.

---

## 1. La mecánica, medida y no supuesta

**La escalera es de seis pasos y son exactamente estos.** Se midió apretando *Skip* cinco
veces seguidas y leyendo la etiqueta después de cada una:

```
0.1s → 0.5s → 2s → 4s → 8s → 15s
```

Coincide **carácter por carácter** con lo que el usuario pidió para `US-02`. No es
casualidad: el usuario está pidiendo este juego.

**Y la mecánica es la contraria a la que teníamos escrita.** Su propia ayuda lo dice en
una línea: escuchás un fragmento, adivinás, y **las respuestas equivocadas desbloquean
más**. O sea:

| | Lo que decía `BR-02` | Lo que hace el juego de referencia |
|---|---|---|
| Intentos por tema | **uno solo** | **seis**, uno por escalón |
| Qué pasa si errás | el tema se cierra en 0 | se abre el escalón siguiente |
| Qué pasa si pedís más audio | gratis, sin límite | no existe "pedir más": el audio se gana errando |
| Pasar | no estaba | consume un intento, igual que errar |

Después del sexto intento el botón *Skip* se convierte en *Give up* y el tema se cierra.

**Detalle que no se copia:** el juego de referencia **no limpia la caja de texto al
enviar**, así que se puede mandar seis veces la misma respuesta equivocada. Se comprobó a
propósito. Es un defecto, no una decisión.

---

## 2. La pantalla, de arriba hacia abajo

```
┌────────────────────────────────────────┐
│ menú   SONGLESS   ayuda ajustes entrar │  cabecera
├────────────────────────────────────────┤
│  [ All ] [ Rock ] [ Hip Hop ]          │  el pozo: partida distinta por pestaña
├────────────────────────────────────────┤
│  ─────────────────────────────────     │
│  ─────────────────────────────────     │  SEIS renglones de intento, vacíos
│  ─────────────────────────────────     │  desde el arranque
│  ─────────────────────────────────     │
│  ─────────────────────────────────     │
│  ─────────────────────────────────     │
├────────────────────────────────────────┤
│ ▮▮▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  ( ▶ )   │  barra de seis tramos + botón redondo
│  0.1s                                  │  etiqueta del paso, flotando sobre la barra
├────────────────────────────────────────┤
│  [ Buscar un tema...            ] [✕]  │  la lista se abre PARA ARRIBA
│  [        Skip / Submit         ]      │  un solo botón, cambia de nombre
└────────────────────────────────────────┘
```

**Los seis renglones se dibujan vacíos desde el principio.** La altura de la escalera se
ve antes de empezar a gastarla. Cada renglón se llena con el título equivocado, o con
*Skipped* si pasaste.

**La barra tiene un tramo por paso, y los anchos no son iguales.** Se leyeron del CSS:
`1,87% · 4,53% · 14,33% · 27,67% · 54,33% · 101%`. Traducido: **cada tramo mide lo que ese
paso *agrega*, no su duración total**. Por eso el último se come casi la mitad de la
barra. Los dos primeros quedan en un par de píxeles y llevan un ancho mínimo forzado.

**Un solo botón grande, que cambia de nombre.** Con la caja vacía dice *Skip*. En cuanto
elegís un tema de la lista dice *Submit*. Mismo lugar, mismo pulgar, dos funciones. Es lo
mejor que tiene el diseño y es lo primero que se copió.

---

## 3. El autocompletado, que es lo que el usuario marcó como importante

- Se abre **hacia arriba** (`--translate-y: -100%` en su CSS). En un celular el teclado se
  come la mitad de abajo: una lista que se abre hacia abajo la tapa el teclado que la está
  alimentando.
- Muestra **diez** resultados como máximo, con la forma `Título - Artista`.
- **Resalta con `<mark>` la parte que coincide** con lo tipeado.
- Busca **por título y por artista**: escribir el nombre de un artista trae sus temas.
- **Es difuso, y de más:** escribiendo `zzzzq` ofrece temas de ZZ Top. Se probó a
  propósito. Eso mete candidatos que nadie pidió y tapa el que sí se buscaba.
- La respuesta **se elige de la lista**, no se escribe libre. Lo que viaja es una
  identidad, no una cadena que haya que interpretar.

---

## 4. El audio

- **No hay una etiqueta `<audio>` en la página** y el `AudioContext` está disponible: usan
  Web Audio, igual que lo que `CTR-01` ya había decidido para nosotros.
- El fragmento **llega como `blob:`**, no como una URL de mp3 a la vista. Es una decisión
  de ellos y no la copiamos: nuestro `CTR-01.4` pide ruta estable y predecible, y el
  crédito del tema se publica igual al revelar (`D-14`, `CTR-01.8`).
- Tienen efectos de sonido propios de interfaz (`button.wav`, `switch.wav`). No se copian:
  `UX-04` no los pidió y un sitio de dos minutos que hace ruiditos molesta.

---

## 5. El final de la partida

Muestra: *Game Over* · **el tema que era** · estadísticas de hoy y de siempre · un
histograma de en qué intento suele caer la gente · una línea de comparación social
(*"vos y el 63,7% fallaron el de hoy"*) · una cuenta regresiva al próximo · *Share* ·
*Next* · y un carrusel con sus otros juegos.

**Es un juego diario, uno por día y por pozo, con el estado guardado en el navegador.**
Recargar no da un tema nuevo.

---

## 6. Qué se copió y qué no

| Del juego de referencia | ¿Entró? | Por qué |
|---|---|---|
| Escalera de seis pasos 0,1 → 15 s | **Sí** | Es lo que pidió el usuario, y coincide exacto |
| Errar abre el escalón siguiente | **Sí** | Es el corazón del juego. Cambia `BR-02` (ver `D-24`) |
| Seis renglones de intento, visibles desde el arranque | **Sí** | La escalera se tiene que ver antes de gastarla |
| Barra de tramos proporcionales al audio que agrega cada paso | **Sí** | Dice la verdad sobre lo que te están dando |
| Un solo botón *Pasar* / *Arriesgar* | **Sí** | Lo mejor de su diseño |
| Lista de sugerencias abriéndose hacia arriba | **Sí** | Es lo correcto en un celular |
| Elegir de la lista, no escribir libre | **Sí** | Y acá compara por identidad, no por texto |
| Elegir el pozo (ellos por género, nosotros por disco) | **Sí** | Pedido explícito del usuario |
| Búsqueda difusa por distancia de edición | **No** | Mete ruido. Acá se perdona tilde, espacio, palabra del medio y letra salteada, y la salteada solo si no hay nada mejor |
| No limpiar la caja al enviar | **No** | Es un defecto suyo: deja mandar seis veces lo mismo |
| Juego diario con estado guardado | **No** | El brief pide entrar y jugar. Acá es una vuelta de cuatro temas, sorteada, y otra cuando quieras |
| Cuenta, estadísticas, ranking, comparación social | **No** | `D-14`: molinetes abiertos. Sin cuentas, y el alcance de la v1 lo deja afuera |
| Efectos de sonido de interfaz | **No** | Nadie los pidió y estorban |
| Publicidad y carrusel de otros juegos | **No** | No hay plata en juego (`D-14`) |

---

## 7. Lo que este mapa deja pedido

- A **`producto`**: `BR-02` cambia de mecánica y de cantidad de pasos.
  Ver `HILO-para-producto-mecanica-y-escalera-de-us02.md`.
- A **`arquitectura`**: `CTR-01.9` pasa de cinco pasos a seis y de 10 s a 15 s (que `D-23`
  ya había adelantado), y `CTR-03.5` necesita un `modoRespuesta` nuevo.
  Ver `HILO-para-arquitectura-escalera-de-seis-y-modo-buscador.md`.
- A **`experiencia`**: la pantalla de este juego se construyó sin `UX-XX` propia, con la
  regla de marca y este mapa como vara. Si algo del reparto de registros o del mapa
  sección→disco no cierra, es de `UX-04`.
