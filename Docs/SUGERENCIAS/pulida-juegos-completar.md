# Pulida de los juegos: "Completá la letra", ronda 1

> Propuesta del constructor de la ronda (2026-11-18). Es el juego 5 de la pulida; sigue a
> `pulida-juegos-por-la-letra.md` y `pulida-juegos-skayboy.md`. Nada de esto está decidido: son
> cosas hechas en la rama `pulida/juegos-ui` que necesitan el visto de su dueño.

## 1. El objeto: la pintada

La portada dice "te falta un diente en la sonrisa" (`CNT-13`). El objeto que elegí es **el verso
pintado en una pared, con una palabra que se cayó con el revoque**: en su lugar asoma el ladrillo.
Lo elegí contra la hoja del cancionero por un motivo: el hermano ("Sacalo por la letra") ya es un
papel claro escrito a mano sobre el jean, y dos papeles con versos se confunden. Acá es al revés:
tinta clara sobre una pared oscura, en la letra rotulada.

- **La pared** es la banda del medio, de ladrillo a la vista (`--borde` y la junta en `--fondo`,
  máscara impresa por `scripts/imprimir-pared-completar.mjs`, 8 KiB en total en
  `public/arte/completar/`). Es fondo y no lleva texto encima.
- **El paño** es donde el revoque aguantó: `--fondo` plano, con el canto roto arriba y abajo. Ahí
  van los versos.
- **El hueco** es el ladrillo que asoma, con filete punteado. El lector de pantalla escucha
  "falta una palabra" (antes leía ocho guiones bajos).
- **Las opciones son plantillas de cartón caladas** (papel, letra en `--fondo`).
- **De qué tema es** va en un afiche de papel pegado con cinta, no en la cabecera.

El disco no cambió: *La mosca y la sopa* (`D-19`, letras). Su naranja está en el filete de la
pregunta, el canto del rodillo, la tecla de ruidos y el botón.

**La cantidad de letra a la vista no cambió** (`CNT-01`): mismos versos de contexto por nivel
(`BR-03`), mismo hueco. El resultado muestra solo la palabra que era y el título del tema.

## 2. Lo que pide el visto de otro

1. **Los versos van en `--fuente-rotulada`, en mayúsculas.** `UX-01` y `diseno-marca.md` dicen que
   el texto largo va en `--fuente`. Lo tomé como letra pintada: renglones de hasta 49 caracteres,
   cinco como mucho. Si `experiencia` dice que es texto largo, se vuelve a `--fuente` cambiando
   dos reglas (`.pintada .verso-contexto` y `.pintada .verso-hueco`) y el objeto sigue en pie.
   Ojo: en mayúsculas no se distingue "Él" de "el" más que por la tilde.
2. **La ficha nombra el tema y el disco en difícil**, después de contestar. `BR-03` los esconde
   como pista; con el verso contestado ya no lo son. Es de `producto`.
3. **Textos nuevos para `contenido`** (`src/lib/letra/copy.ts`): "Llevás N", "+1", "N al hilo",
   "Mirá cómo te fue", "falta una palabra" (solo lector), "Los versos de esta vuelta",
   "«tema» · pusiste “palabra”", y los tres de los ruidos. Pasan `voz.test.ts`.
4. **`.accion-abajo` ya no se usa en este juego**: el resultado pasó a `.pie-resultado` y
   `.salida-resultado`. "Mirá las letras enteras" es un secundario del pie. Queda solo "Adiviná
   la tapa" con la pieza vieja.
5. **`.donde-estas` de la portada va adentro del paño**, en la rotulada. Deja de ser hija directa
   de `.pantalla`, así que las dos reglas de `html.incrustado .pantalla > .donde-estas` ya no la
   alcanzan en este juego. No miré la portada incrustada en X.
6. **El signo que sigue al hueco va pegado** ("vida" + "."): antes llevaba un espacio delante.

## 3. Detalles vivos

| Detalle | Estado al que está atado | Con movimiento reducido |
|---|---|---|
| El rodillo destapa la pintada y las plantillas se apoyan | empezar, y cada verso nuevo | todo puesto |
| La plantilla va al hueco, se apoya y vuelve | elegir | no viaja |
| La palabra queda pintada y **chorrea** (dos gotas que bajan y se quedan) | se acaba de pintar | gotas puestas |
| El paño se sacude, el tachón de aerosol pasa y después se pinta la que era | error | quieto, tachado, las dos palabras |
| El sello cae en la esquina del paño | cerrar el verso | no se ve: llega la ficha |
| La casilla del verso y "N al hilo" se estampan | cerrar el verso | puestas |
| "+1" vuela de la ficha a "Llevás N" | acierto | la cuenta cambia de una |
| El rodillo tapa la pintada vieja | "Seguí" | el verso nuevo aparece |
| La cifra cuenta y las filas de la pared se pegan | resultado | todo puesto |

## 4. Lo que queda abierto

- Al errar, la línea del hueco crece (lo tachado más la que era) y puede partir en un renglón
  más: el paño salta ese alto una vez.
- Las tiras lentas no sirven para elegir ni para el pase (los tiempos los lleva la isla): en
  `mirar-juego.mjs` van como ráfagas a velocidad real.
- Sin tarjeta compartible: comparte texto y enlace, como antes.

---

# Ronda 2 (2026-11-18)

## 5. Decisiones del hilo principal, ya aplicadas

- **Excepción declarada: los versos van en `--fuente-rotulada`, en mayúsculas.** `UX-01` y
  `diseno-marca.md` piden `--fuente` para el texto largo. Acá son renglones cortos pintados en
  una pared (cinco como mucho, de hasta 49 caracteres), no texto de lectura: la letra pintada es
  el objeto. Condiciones: el contexto va a **16 px** (`1rem`) y el del hueco a 20–24 px; los
  pares son `--texto` y `--texto-tenue` sobre `--fondo`, los dos en `contraste.test.ts`. No se
  copia a otra pantalla: es de este juego. Conviene sumarla a la tabla de `diseno-marca.md`.
- **`BR-03`, para `producto`:** en difícil la ficha nombra tema y disco **después** de contestar.
  Queda como está; falta que `producto` lo escriba en la regla.

## 6. Lo que cambió y conviene dejar escrito

1. **La que era se pinta en su propio renglón.** Debajo del verso del hueco hay un renglón
   guardado (`.verso-correccion`, vacío mientras se juega). Si errás, lo elegido queda donde se
   pintó, apagado, con la raya de aerosol (ahora fina: se sigue leyendo) y la cruz; la que era
   aparece debajo, en verde y con tilde, a la altura de lo tachado, y se corre para adentro si
   no entra. **El verso ya no se mueve** después del toque. El costo: ese renglón vacío (33 px)
   está siempre.
2. **La ficha es un afiche de papel**, pegado con dos cintas donde estaban las plantillas: la
   marca (tilde o cruz en `--fondo` sobre el verde o el rojo), el grito como sello, "+1", y
   "Seguí" en la tinta del disco con filete de chapa. Dos pares nuevos en `contraste.test.ts`
   (`fondo` sobre `acento-3` y sobre `acento-4`). La fuente y "Corregí esto" van en un zócalo
   pintado debajo. Lo que se anuncia (`role="status"`) es el texto del afiche, sin el botón.
3. **La pared llega hasta abajo**: las plantillas y la ficha están apoyadas en ella. La componen
   un caño con dos abrazaderas, arriba, y una pintada vieja tapada a rodillo (`tapada.webp`).
   El afiche del tema es más grande y va arriba.
4. **El sello cae justo arriba del renglón del hueco**, al costado, y al apoyar salta polvo de
   revoque (siete motas que caen y se van).
5. **El resultado es el muro de la vuelta**: la pared con las ocho palabras pintadas en dos
   columnas (cuatro en la compu). La errada, tachada, y debajo la que era. Arriba, la línea que
   canta y la cuenta en su sello.
6. **Textos nuevos para `contenido`** (`letra/copy.ts`): los tres tramos —"Te falta escuchar
   disco.", "La cantás, pero masticando.", "La tenés tatuada."—, la hazaña "¡Vuelta entera!", y
   dos frases solo para lector de pantalla ("X, de Y: la sacaste" / "…: pusiste Z"). El tramo
   usa los cortes de `lib/quiz/tramo.ts`: con 6 de 8 ya dice "La tenés tatuada", que puede ser
   mucho. Lo decide `contenido` o `producto`.
7. **La tarjeta compartible es el muro** (`src/scripts/tarjeta-pared.ts`, pincel propio; reusa
   de `tarjeta.ts` el grano, la espera de las letras y la lectura de tokens, que ahora se
   exportan). Asoma sobre "Compartí" y viaja con el enlace si el teléfono acepta archivos.
   Cambia `CNT-26`, que decía "sin tarjeta, como Más o menos".
8. **La pared de la portada es más alta, con su caño, y viaja**: al tocar "Empezá" crece hasta
   ser la de la partida.
9. **La hazaña**: con la vuelta entera, la cuenta lleva doble filete verde, cae el sello
   "¡Vuelta entera!" y el golpe suena dos veces.

## 7. Detalles vivos de la ronda 2

| Detalle | Estado al que está atado | Con movimiento reducido |
|---|---|---|
| La pared de la portada crece hasta la de la partida | "Empezá" | aparece puesta |
| La que era se pinta en su renglón, después del tachón | error | puesta |
| El polvo de revoque salta y cae | el sello apoya | no está |
| El afiche de la ficha se pega | segundo tiempo del cierre | puesto |
| El sello "¡Vuelta entera!" | 8 de 8 | puesto |

## 8. Lo medido y lo aprendido

- **La pared no se rehace de un verso al otro.** Rehacerla hacía que el navegador volviera a
  imprimir las máscaras del ladrillo en cada pase: un cuadro de ~220 ms con la CPU ×4. Ahora se
  le cambia lo pegado y lo pintado, y el ladrillo queda. Lo mismo vale para cualquier fondo de
  máscara de pantalla entera: **el fondo impreso se arma una vez por partida**.
- **La pared de la portada se abre con `clip-path`, no cambiando de escala.** Escalarla dejaba un
  cuadro de ~420 ms al terminar (volver a imprimir el ladrillo a su tamaño final). Es un barrido
  como los de la imprenta (`pasada`); va por `animate()`, así que `movimiento.test.ts` no lo ve:
  lo apaga `duracionDe()`, que con movimiento reducido da cero.
- CPU ×4 a 430 × 860, dos tandas, control en la misma tanda (el hermano quieto: 17,8 ms, p95
  18,3): la pared quieta 17,8 / 18,3; elegir 18,5 / 18,6 (peor 55); el pase 17,8 / 18,3 (peor
  36). "Empezá" deja un cuadro de ~130 ms, que es armar la partida.
- La medición de la ronda 1 se colgaba en la segunda tanda. Con la página traída al frente y el
  freno de CPU soltado antes de cerrarla no volvió a pasar en tres corridas; no aislé cuál de
  las dos cosas era.

## 9. Lo que queda abierto

- En un teléfono bajo (375 × 667) un verso fácil con cinco renglones no entra con las cuatro
  plantillas: la segunda fila queda abajo del borde y hay que desplazar.
- El renglón guardado para la corrección está siempre, también cuando acertás.
- La tarjeta se dibuja con ocho palabras; con rondas de otro largo no se probó.

---

# Ronda 3, el cierre (2026-11-19)

## 10. Lo que cambió y conviene dejar escrito

1. **La que era cuelga de lo tachado.** Va justo debajo, corrida un codo para adentro, y el
   codo (dos trazos en la misma pintura) baja de lo tachado y la señala. En la ronda 2 iba en un
   renglón aparte: cuando lo tachado arrancaba el renglón se leía como un verso suelto, y
   cuando el verso seguía en otro renglón quedaba 30 px más abajo. Ahora, si el verso sigue,
   lo tachado le hace lugar **en el mismo toque** en que el hueco toma su ancho; después de
   eso nada se mueve. Medido en diez tamaños: 21 px a la derecha de lo tachado, pegada debajo,
   siempre adentro del paño.
2. **El renglón guardado ya no es un vacío**: pasó de 33 a 21 px y es el aire entre el verso
   del hueco y el contexto. Ni lo tachado ni la que era chorrean (las gotas pisaban el renglón
   de abajo); chorrea lo que se pinta bien.
3. **El sello cae sobre el canto de arriba del paño**, a la derecha, y nunca sobre lo pintado.
   Al irse deja su marca chica ahí, hasta el verso siguiente.
4. **El cierre se adelanta con un toque** en la pared (o con Enter o la barra). No saltea
   pasos: corre los que falten, cada uno una sola vez, y llega la ficha con la casilla, la
   racha, la marca y la cuenta en su lugar.
5. **Teléfonos bajos**, medido en diez tamaños con los ocho versos fáciles más largos: de 720
   px de alto para abajo la pared se aprieta (menos aire, el afiche en un renglón, sin caño ni
   pintada vieja). **De 600 para abajo (320 × 568) el contexto baja a 14 px**: es el único caso
   donde baja de los 16 que pidió el hilo principal, y solo para que entren las cuatro
   plantillas. Si no se acepta, en ese teléfono la segunda fila queda 88 px bajo el borde.
6. **La portada**: el hueco va en el mismo renglón (la acotación pierde la raya de apertura y
   su cuerpo sigue al ancho, 13 px a 430) y hay una plantilla apoyada con la palabra del botón.
   Tocarla la lleva al hueco y arranca. Es un atajo de "Empezá": va fuera del orden de
   tabulación y escondida del lector, porque el botón dice lo mismo.
7. **Las dos salidas del resultado van en `.salida-resultado`**: "← Volvé al fichín" y "Mirá las
   letras enteras →", las dos como cinta. El pie queda con tres piezas.
8. **La tarjeta**: la dirección va de lado a lado y grande, y cada palabra se achica hasta
   entrar en su columna. Probada con palabras de 16 letras.
9. **La pintada vieja tapada cambia de lugar con cada verso** (corrida, altura, giro y lado,
   con el verso como semilla) y se ve más (0,78).

## 11. Lo aprendido para los juegos que quedan

1. **El objeto contrario al del hermano.** Dos juegos parientes se distinguen por material y
   por luz (papel claro contra pared oscura), no por un color.
2. **El fondo impreso se arma una vez por partida.** Rehacer por pregunta un fondo de máscara
   de pantalla entera cuesta un cuadro de ~220 ms con la CPU ×4; escalarlo, ~420. Se persiste
   el contenedor y se abre con recorte.
3. **Lo que corrige cuelga de lo corregido**, no de un renglón aparte: así queda al lado en
   cualquier quiebre de línea. Y si hay que hacerle lugar, se hace en el toque, nunca después.
4. **Las reglas de pantalla chica van al final del bloque.** Con el mismo peso de selector,
   una media query puesta antes de la regla base no pisa nada (así se "arregló" 375 × 667 dos
   veces sin que cambiara un píxel).
5. **Medir en diez tamaños con los datos peores**, cambiando el banco que recibe el navegador:
   dos capturas con un verso al azar no encuentran el caso largo.
6. **Adelantar no es saltear.** Un cierre por tiempos se vuelve salteable si cada paso se
   corre una sola vez, venga de su reloj o del toque.
7. **Un selector sin `#partida` agarra la portada**: al sumar una plantilla y un paño a la
   portada, los guiones de captura y de medición midieron piezas escondidas.
8. **Los tests de estilo también dibujan**: el codo no puede ser un `border-left` (barra
   lateral) ni un tiempo puede ir escrito (`0s`); se resuelven con dos trazos y `animation: none`.

## 12. Lo medido en la ronda 3, y lo que no quedó resuelto

- El ladrillo va en su propia capa (`will-change: transform`) y la pintada vieja se mueve solo
  con `transform`. En la misma tanda, antes y después: elegir bajó de cuadros de 217–300 ms a
  133–167, y el pase de 117–183 a 67–133 (CPU ×4, control 16,7 ms).
- **Quedan uno o dos cuadros de 130 a 170 ms al elegir** (al pintar y al cerrar), con la CPU ×4.
  No son el ladrillo: escondiéndolo siguen ahí. Son armar el DOM y medir. En la ronda 2 el peor
  cuadro de elegir era de 55 ms; ese día el control daba 17,8 y no 16,7, así que los dos
  números no se comparan directo, y no pude aislar qué parte es de la ronda 3 y qué parte es la
  máquina. Varía mucho de corrida a corrida (de 133 a 267 en el mismo estado).
- "Empezá" deja un cuadro de ~330 ms con la CPU ×4, que es armar la partida. Por eso la
  plantilla de la portada no vuelve a su lugar: llega al hueco, se queda apoyada y ahí arranca.
