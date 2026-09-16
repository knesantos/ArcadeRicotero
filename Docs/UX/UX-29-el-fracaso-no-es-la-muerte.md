# UX-29 — El fracaso no es la muerte: a nadie lo matan, a alguien no lo dejan pasar

> Rol dueño: `experiencia`. Ciclo 15, 2026-09-16.
>
> **Es la pieza bloqueante del ciclo.** `D-38` consecuencia 3 dejó la pregunta sin dueño y
> se la dio a `experiencia` *"antes de dibujar la primera animación"*; `D-42` precisión 2 la
> agravó —ahora el muñeco tiene cara reconocible— y la declaró **bloqueante antes de animar
> la derrota**. `IDEA-14` punto 6 la anotó como una `BR-` sin número. Esto la cierra en lo
> que es mío: **qué registro rige y qué se ve.** Lo que se escribe es de `contenido`; lo que
> cuesta, de `producto`.
>
> **Consume:** `D-42` (la cara, el tono como baranda, la muerte del avatar mirada de nuevo),
> `D-38` barandas 1 y 3 y consecuencias 1 y 3, `D-14` (los molinetes: la figura rectora del
> sitio), `D-32` límite 3 (0 ms hasta que el dedo responde), `D-40` (el que espera está a
> salvo), `D-41` (la frontera), `RES-64.2` (Skay está vivo y salió de gira en 2026),
> `RES-64.9` (Poli está viva), `RES-64.19` (el eje que separa los fallos permisivos del que
> terminó en resarcimiento es denigración y lucro), `RES-04` (la muerte del Indio, hace tres
> meses), `.claude/rules/voz-ricotera.md` §5 y §6 (los tres registros; registro 3 entero
> para Bulacio, Olavarría y la muerte del Indio), `UX-27` (la convención y el inventario de
> poses), `UX-28` (la pantalla), `IDEA-14`.

---

## 1. Por qué esto era bloqueante y no un detalle de animación

Un plataformas mata al avatar decenas de veces por partida. Ese es el género: el reintento
**es** el juego, y el piso de niveles de `IDEA-14` se apoya explícitamente en eso.

Lo que hace que acá no sea una decisión de oficio son tres cosas que se cruzan y ninguna se
puede sacar:

1. **Las dos personas están vivas.** `RES-64.2` y `RES-64.9`. Uno salió a tocar en agosto.
2. **Ahora tienen cara.** `D-42` enmendó la baranda de la insignia y el muñeco es
   reconocible. Un sprite con la cara de alguien muriéndose cuarenta veces por partida es
   —palabras de `D-42`— *"exactamente la clase de imagen que 'lo vean y les moleste'
   contempla"*, y ese es el riesgo que `RES-64` midió como el real.
3. **El sitio ya reserva un registro para la muerte.** Registro 3 entero, sin voz, en las
   tres pantallas graves: Bulacio, Olavarría y la muerte del Indio (`voz-ricotera.md` §6).
   Si el juego usa la muerte como moneda de partida, el sitio queda usando la misma palabra
   para dos cosas que no se parecen en nada, y la que pierde es la de las tres pantallas.

Y hay una cuarta que es pura suerte y conviene aprovechar: **la hoja de sprites no trae
animación de muerte.** Nadie dibujó todavía lo que habría que borrar.

---

## 2. La decisión

> **En este juego nadie se muere. A alguien no lo dejan pasar, y lo devuelven a la entrada.**

No es un eufemismo puesto encima de la misma mecánica: cambia lo que se ve, lo que suena, lo
que se cuenta y lo que se dibuja. Y no es una idea nueva traída de afuera: **es la figura
rectora del sitio, dada vuelta.** `D-14` se llama "abrir los molinetes" porque en los
recitales los de adentro los abrían para que pasara el que no había podido pagar. Acá el
molinete está cerrado y te devuelve, y el juego entero consiste en abrírselo al otro.

`IDEA-14` ya había encontrado el verso que sostiene la puerta con el guardia adentro —
«Queso ruso», *La mosca y la sopa*, 1991 — y anotó que es *"justo la figura que `D-14`
invierte"*. Esta decisión es esa frase convertida en mecánica.

---

## 3. Qué se ve, cuadro por cuadro

Cuando un personaje toca lo que no puede tocar:

| # | Qué pasa | Cuánto dura |
|---|---|---|
| 1 | **El personaje no se descompone, no cae, no se apaga.** Queda un cuadro en su pose de quieto, de frente — la misma del que espera (`UX-28 §3`) | 1 cuadro |
| 2 | **Lo devuelve el lugar, no el cuerpo.** El área hace **una sola pasada de imprenta** sobre sí misma, como una hoja que vuelve a entrar a la prensa: el nivel se reimprime igual y el personaje ya está en la entrada | 1 compás, ≤ 400 ms, con `--duracion-pasada` |
| 3 | **El dedo responde desde el cuadro cero.** No hay espera, no hay bloqueo, no hay "volviendo…" | 0 ms (`D-32` límite 3) |

**Por qué el que se mueve es el lugar y no el muñeco.** Es `D-32` en su forma más literal:
*"nada se mueve para llamar la atención sobre sí mismo; lo que se mueve es la cámara"*. Una
animación de derrota es el elemento pidiendo que lo miren mientras le pasa algo. Una
reimpresión del nivel es la sala volviendo a empezar. Y de paso usa un mecanismo que el
sitio ya tiene construido y testeado (`UX-22 §2`), en vez de inventar uno.

**Y el otro personaje no se entera.** El que no falló se queda donde está, con lo que ya
consiguió. Devolver a los dos sería castigar al que no hizo nada, y eso es una lectura sobre
la relación entre ellos que `D-38` baranda 3 no permite ni por mecánica.

---

## 4. Qué cuesta fallar

**No hay vidas.** No hay corazones, no hay contador de intentos, no hay "te quedan dos", no
hay `GAME OVER`. Un contador de vidas es un contador de muertes con otro nombre, y encima
mete en pantalla exactamente el marcador que `UX-27 §5.1` prohíbe adentro del área.

**Lo que se gasta es el reloj.** El fracaso cuesta el tiempo de volver a la entrada y
rehacer el tramo, y eso alcanza: es lo que usa el género desde siempre, es un número que se
puede compartir sin narrar nada de nadie, y el sitio ya sabe poner el tiempo como el número
grande de una pantalla de resultado (`UX-22 §10`).

**Cuánto vale exactamente, y si hay tope, es de `producto`.** Lo único que fijo yo es el
borde: **no puede costar una vida, y no puede costar una pantalla.** Si al fallar aparece
algo que hay que mirar antes de seguir jugando, volvió el molinete.

---

## 5. Qué registro rige, que era la pregunta

> **Registro 3, y la mejor manera de cumplirlo es no decir nada.**

- **Registro 1 queda prohibido acá.** El que canta es ≤ 8 palabras, segunda persona, una
  imagen física. Una frase con imagen física sobre el muñeco de alguien vivo al que acaban
  de sacar es, aunque no lleve firma, el sitio haciendo un chiste sobre una persona real.
  Es la línea de `voz-ricotera.md` §1 cruzada por el costado.
- **Registro 2 no tiene lugar.** No hay nada que contar: no pasó nada que contar.
- **Registro 3 es el que corresponde** —seco, sin imagen, sin chiste, sin suspensivos— **y
  lo mejor que puede hacer el registro 3 acá es callarse.** El fracaso no necesita palabras:
  el personaje está en la entrada, se ve. Una palabra que no hace falta es una palabra que
  se puede leer mal.

**La regla, para que nadie tenga que volver a preguntar:**

| Momento | Qué dice el sitio |
|---|---|
| El personaje es devuelto | **Nada.** Ni una palabra, ni un rótulo, ni un sonido de agonía |
| Se reintenta | Nada. Ya está jugando |
| Se pasa el nivel | Lo que diga la tarjeta, en el registro que le toque — y sin narrar nada de nadie |
| Alguien se planta y no pasa | **Nada tampoco.** No hay rendirse: se sale del juego como se sale de cualquier pantalla del sitio |

**Si alguna vez hace falta una palabra** —por accesibilidad, por ejemplo, para un lector de
pantalla que tiene que anunciar que el personaje volvió a la entrada— va en registro 3, es
una sola, y **nombra el lugar, no a la persona**: lo que volvió a la entrada es un
personaje, no Eduardo Beilinson. Lo redacta `contenido`; el molde está pedido en
`Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md`.

---

## 6. Lo que queda prohibido, con nombre, para que no vuelva por la ventana

Nada de esto se dibuja, se anima, se programa ni se escribe:

| Prohibido | Por qué |
|---|---|
| Calavera, lápida, fantasma, cruz, esqueleto | Son iconografía de muerte sobre la cara de alguien vivo |
| **Angelito, alitas, aureola** | Doble motivo: es muerte, **y** el juego tiene el cielo como uno de sus dos terrenos. Un personaje que "sube al cielo" al fallar convierte el terreno en un más allá y la mecánica en una moraleja |
| El cuerpo tirado, desarmado, hecho pedazos, quemándose | `D-42`: nunca denigrante ni ridiculizante |
| **La pose de caída invertida de la hoja** | `UX-27 §7`: Skayboy dibujado dado vuelta, sombrero abajo. Es la única pieza de la hoja que toca el borde del tono, y no entra ni para caer ni para fallar |
| Contador de vidas, de muertes, de intentos | `§4` |
| `GAME OVER`, "perdiste", "moriste", "se acabó" | `§5` |
| Grito, quejido, sonido de agonía, música de derrota | El acierto es el único grito del sitio (`UX-22 §1`), y acá ni siquiera hay acierto que gritar |
| Una animación propia del personaje al fallar | `§3`: se mueve el lugar, no el muñeco |
| Cualquier cosa en primera persona | `D-38` baranda 1, intacta: el muñeco nunca dice "yo" |
| Que el fallo de uno afecte al otro | `D-38` baranda 3: sería narrar la relación |

---

## 7. Las dos consecuencias sobre el diseño de nivel, que hay que escribir antes de dibujar

`D-40` ya escribió la suya antes del primer nivel porque después salía carísima. Estas dos
son de la misma familia.

### 7.1 No hay vacío. El nivel es una sala cerrada.

**Ningún nivel tiene un pozo por el que se pueda caer fuera del mundo.** Caer al vacío es la
otra imagen de muerte que un plataformas produce sin querer, y la produce el nivel, no el
dibujo — por eso no alcanza con prohibir la animación.

El área es un cuarto con piso, techo y dos paredes: 15 × 9 tiles y nada afuera. Tiene
respaldo ricotero y no hubo que forzarlo: `IDEA-14` ya había fichado el escenario en «Templo
de Momo» (*Momo Sampler*, 2000), que es un galpón. **Un galpón tiene paredes.**

Y es barato: el nivel de una pantalla cerrada es lo que la grilla de `UX-27` ya necesitaba.

### 7.2 El terreno ajeno no lastima: no te deja pasar.

En el juego de origen cada personaje muere en el elemento del otro. Acá **el elemento ajeno
devuelve a la entrada**, que mecánicamente cuesta lo mismo y visualmente no es lo mismo: no
te consume, te rechaza. Es el molinete otra vez.

Efecto secundario que conviene: el cielo y el infierno dejan de ser bueno y malo. No son un
premio y un castigo, son dos terrenos, y ninguno de los dos mata a nadie. Eso también lo
dice el título que ancla al par: «El infierno está encantador esta noche» (*Gulp!*, 1985).

---

## 8. Y hacia el otro lado: ganar tampoco narra

Se dice acá porque es la misma baranda y es donde alguien va a querer poner una frase.

Los dos llegan a la puerta y la puerta se abre. **Eso es todo lo que pasa.** No se abrazan,
no se dan la mano, no se van juntos a ningún lado, no aparece un tercero, no hay un cartel
que diga que lo lograron juntos. `D-38` baranda 3 sigue intacta después de `D-42`: nada
narra la relación real entre Skay, Poli y el Indio, ni por mecánica ni por texto — y en
2026, con uno de los tres muerto hace tres meses (`RES-04`), una pantalla de final feliz
sobre los otros dos se lee como tomar partido en una pelea real. `RES-64` ya lo había
anotado con esas palabras.

---

## 9. Cómo se verifica

No hay comando: esto se audita con los ojos, y la lista es corta a propósito.

1. **Buscar la palabra.** `rg -i "vida|muerte|moriste|perdiste|game over"` sobre el copy y la
   isla del juego. Tiene que dar cero.
2. **Jugar y fallar veinte veces seguidas.** Si en algún momento apareció algo que mirar
   antes de volver a jugar, está mal.
3. **Mirar un fallo con el sonido prendido.** Si algo suena, está mal.
4. **Mirar la pose del cuadro 1.** Si el personaje está en el suelo, torcido o invertido,
   está mal.
5. **La prueba de la captura.** Sacarle una foto a la pantalla en el peor cuadro del fallo y
   preguntarse si esa imagen, suelta y sin contexto, le puede molestar a la persona que está
   dibujada ahí. Es la única vara que `RES-64` reconoce como la que mide el riesgo real, y
   no la mide un abogado.
