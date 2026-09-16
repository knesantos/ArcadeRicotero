# ARQ — Los efectos de sonido: el hueco que `D-39` dejó abierto

> Rol dueño: `arquitectura`. **Produce: `CTR-17`** (`CTR-17.1` … `CTR-17.7`).
>
> **Consume:** `D-37` (puntos 5 y 7), `D-39` (consecuencia 2, que traspasa esto con nombre),
> `D-40`, **`D-42` precisión 2**, **`D-43`**, `ADR-04` (`ARQ-cama-de-cinta.md`, en especial
> `ADR-04.1`, `ADR-04.2`, `ADR-04.3`, `ADR-04.4`, `ADR-04.8`, `ADR-04.9`), `ADR-07.5`,
> `ADR-07.7`, `ADR-07.10`, `CTR-01.3`, `CTR-14`, `ADR-08` (`ARQ-motor-de-juego.md`),
> `IDEA-14`, **`UX-28 §3`**, **`UX-29` (`§6` y `§9`, que es lo que sacó un efecto de esta
> tabla)**, `Docs/SUGERENCIAS/HILO-para-arquitectura-el-motor-y-el-sonido-del-juego.md`.
>
> **El encargo, textual, de `D-39` consecuencia 2:** *"Un efecto de 200 ms no es un tema, no
> es la cama y no es un fragmento de `CTR-01.3`. `D-37` punto 7 prohíbe `decodeAudioData`
> sobre un tema entero y no dice nada de un sample corto. De dónde salen, quién los produce y
> si se decodifican es de `arquitectura`."* Cero de nueve frentes lo cubrían.
>
> Última actualización: 2026-09-16 (ciclo 15, primera versión, **enmendada el mismo día**:
> `FIND-57` (`REV-14`) sacó el efecto **muerte** y el vocabulario de muerte entero, y `D-43`
> consecuencia 1 sacó el efecto **cambio**. De cinco efectos quedan **tres**. Se enmienda en
> el lugar y con la marca puesta: no hay una línea de código escrita sobre la versión vieja).

---

## CTR-17 — Contrato de los efectos de sonido

- **Fecha:** 2026-09-16
- **Estado:** **vigente, sin valores abiertos y sin nada que pedirle al usuario.** La pregunta
  se contesta entera con lo que el sitio ya tiene; no hace falta ninguna decisión nueva. Si
  el usuario quisiera lo contrario, la pregunta exacta está en `CTR-17.7`.

### La decisión, en una línea

> **Se sintetizan. Cero archivos, cero bytes de red, cero `decodeAudioData`, y salen del
> mismo `AudioContext` que todo lo demás.**

### Por qué, y no es una preferencia de oficio

La pregunta venía planteada como "de dónde salen los samples". **La respuesta es que no hay
samples**, y el motivo está escrito en tres lugares del repo desde antes de este juego:

1. **Es lo que el sitio ya hace dos veces.** La cama de `ADR-04` es ruido sintetizado: cero
   archivos, cero bytes prendida o apagada. La púa de `ADR-07.7` —el ruido de cambio entre
   tema y tema— también. Hay precedente construido, probado y con sus números en una tabla.
2. **`ADR-07.10` punto 8 lo dice casi con estas palabras:** *"Un archivo nuevo para la cama o
   para la púa: mp3, worklet, respuesta de impulso. **Cero**"*. Un efecto de salto no es la
   cama ni la púa, así que la letra no lo alcanza — **pero el fundamento sí**, y el
   fundamento es el que importa: `D-37` aflojó el candado 2 de `ADR-04` a medias, y lo que
   quedó en pie es que **un mp3 de ruido sigue prohibido**. Un `salto.mp3` sería exactamente
   eso.
3. **Un efecto grabado sería el primer archivo de audio del sitio que no es una grabación de
   la banda**, y habría que conseguirlo, licenciarlo y fichar de dónde salió — o sea, `BR-15`
   consecuencia 1 otra vez, por 200 ms de sonido. El ahorro de no hacerlo es todo el trabajo.

**Y el punto que cierra la pregunta del encargo:** *¿se decodifican?* **No, porque no hay
nada que decodificar.** `D-37` punto 7 prohíbe `decodeAudioData` sobre un tema entero y no
dice nada de un sample corto; acá la pregunta no se llega a hacer. Un `decodeAudioData` en
este juego es un defecto, no una opción.

---

### CTR-17.1 — Los tres efectos, y los dos que se cayeron

> **Enmendado el 2026-09-16.** Esta tabla tenía cinco filas y perdió dos el mismo día:
>
> - **`muerte` — lo saca `FIND-57` (`REV-14`), y manda `experiencia`.** `UX-29` decidió que
>   en este juego **no se muere nadie**: a alguien no lo dejan pasar y lo devuelven a la
>   entrada. Su `§6` prohíbe con nombre *"grito, quejido, sonido de agonía, música de
>   derrota"* y su `§9` deja la verificación en una línea que no admite interpretación:
>   *"mirar un fallo con el sonido prendido. **Si algo suena, está mal**"*. `D-42` precisión 2
>   declaró esto bloqueante antes de animar la derrota, y el sonido es parte de la derrota.
> - **`cambio` — lo saca `D-43` consecuencia 1.** Estaba fundado en *"lo pide `D-40`"*, y
>   `D-40` ya no lo pide: **no hay botón de cambio.** Cada columna de mando maneja siempre al
>   mismo personaje, así que no hay instante de alternancia que avisar. Un efecto sin
>   disparador es código muerto con presupuesto asignado.

| Efecto | Cuándo suena | Por qué está |
|---|---|---|
| **salto** | al despegar | Es el verbo del juego. Sin él, el control se siente apagado |
| **tesoro** | al levantar el coleccionable | Único premio del juego que no es terminar |
| **puerta** | cuando un personaje entra a la suya | Es la mitad de la condición de victoria (`RES-61.2`): hay que oír que uno ya está |

**Tres y no más.** Cada efecto nuevo es una fila en la tabla de `CTR-17.3` y una voz más en
el tope de `CTR-17.4`. Uno que se agregue después entra escribiéndose acá, como cualquier
número de audio del sitio.

**El salto es el mismo para los dos personajes, y eso es contrato.** Un sonido por personaje
sería una diferencia entre ellos que ninguna decisión pidió, y la paridad de `D-38` no se
rompe por el costado del audio más de lo que se rompe por el de la caja de colisión
(`CTR-15.3`).

**Los que no están, y por qué ninguno vuelve por la ventana:**

| No existe | Por qué |
|---|---|
| **Cualquier sonido al fallar** — golpe, quejido, chasquido, "uh", acorde descendente | `UX-29 §6` y `§9.3`. **Es la única regla de este contrato que no se afina escuchando: el silencio no es un valor bajo, es la decisión.** Un compositor de efectos que "solo agrega un toquecito" acá está rompiendo `D-42` |
| Un efecto para el acierto o el error | Acá no hay respuesta correcta. Y el par acierto/error del sitio ya tiene su idioma y sus tokens (`--acento-3`, `--acento-4`), que no se disfrazan de nada |
| Un efecto de alternancia | `D-43`: no hay alternancia, hay dos columnas |
| Música de victoria | `UX-29 §8`: ganar tampoco narra. La puerta se abre y eso es todo lo que pasa |

---

### CTR-17.2 — Dónde vive, y de qué cuelga

```
contextoDeAudio()               ← el único del sitio (`ADR-04.2`), en `contexto.ts`
   │
   ├── la cinta (cama · rocola · tema-fijo)         `ADR-04`, `ADR-07`, `ADR-08.9`
   │
   └── volumenEfectos   GainNode   ← se crea UNA vez por página
          └── una voz por disparo, creada y descartada en `onended`
```

Cuatro reglas de construcción, y ninguna es nueva: son las mismas que ya rigen para la cama y
la púa.

1. **Un solo `AudioContext`, el de `contexto.ts`** (`ADR-07.10` punto 7). El motor de juego
   trae el suyo y **está apagado y prohibido** (`ADR-08.2` punto 3).
2. **Un solo `volumenEfectos` por página**, creado dentro del primer gesto, como todo el resto
   del grafo.
3. **Una voz por disparo, y se descarta sola.** Los nodos se crean al disparar y se sueltan en
   `onended`. No hay pool, no hay nodos vivos esperando: un plataformas dispara decenas de
   veces por minuto y un pool de nodos es un `Map` que alguien se olvida de vaciar.
4. **Todo se agenda contra `ctx.currentTime`.** Nunca `setTimeout`, nunca `setInterval`, nunca
   un `requestAnimationFrame` contando milisegundos. Dos relojes que no son el mismo no se
   sincronizan a mano (`ADR-07.10` punto 12 y `ADR-08.11` punto 11).

**Y una regla que cuelga de otro lado y conviene decirla junta:** el efecto lo dispara la
lógica del juego, no el motor. La isla llama a `src/lib/skayboy/sonido.ts`, que no importa el
motor ni sabe que existe.

---

### CTR-17.3 — Los números, y la enmienda de `ADR-07.10` punto 11

`ADR-07.10` punto 11 prohíbe *"un número de audio escrito fuera de las tablas de `ADR-04.1`,
`ADR-07.5` y `ADR-07.7`"*. **Esta tabla es la cuarta**, y queda declarada acá con número para
que no aparezca como una excepción escondida. Es el mismo criterio con que `D-42` enmendó una
baranda: un contrato no se contradice en silencio.

| Efecto | Fuente | Forma | Duración | Registro |
|---|---|---|---|---|
| **salto** | oscilador | barrido de tono **hacia arriba**, envolvente de ataque instantáneo y caída corta | **≤ 120 ms** | medio |
| **tesoro** | oscilador | dos tonos cortos, el segundo más agudo | **≤ 180 ms** | agudo |
| **puerta** | oscilador | un tono sostenido que se apaga solo | **≤ 400 ms** | **grave** |

**El registro de `puerta` bajó a grave**, y es consecuencia de `FIND-57`: con `muerte` afuera
quedó libre el único registro grave del juego, y `puerta` tenía que salir de "medio" porque
compartía registro con `salto` — los dos pueden sonar en el mismo segundo (uno entra a su
puerta mientras el otro salta). La regla de abajo obliga a que se separen.

**Cuatro reglas duras sobre la tabla, que valen más que los valores exactos:**

- **Ningún efecto pasa de 400 ms.** Es el techo del contrato. Un efecto largo se pisa con el
  siguiente y con el tema.
- **Ninguno usa el mismo registro que otro que pueda sonar al mismo tiempo.** Con tres
  efectos y tres registros la regla se cumple sola; el día que aparezca un cuarto, el que
  tiene que buscarle lugar es el que lo agrega.
- **Los valores finos —frecuencias, tiempos de envolvente, ganancias— se escriben en una
  tabla de constantes en `src/lib/skayboy/sonido.ts` y en ningún otro lado.** Es literal lo
  que `ADR-04.1` ya hace: los números viven juntos, nombrados, y se afinan en un solo
  archivo.
- **Se afinan escuchando.** No hay ficha que fije cómo suena un salto y no la va a haber. Lo
  que el contrato fija son los topes; lo de adentro se prueba con el oído, igual que
  `CTR-01.1` dejó dicho para el bitrate del fragmento.

---

### CTR-17.4 — El presupuesto

| Concepto | Cuenta | Total |
|---|---|---|
| **Red, siempre** | cero archivos | **0 bytes** |
| **RAM, buffers** | **ninguno.** El buffer de ruido era del efecto `muerte` y se fue con él (`FIND-57`): los tres que quedan son osciladores puros | **0 MB** |
| **Voces simultáneas** | tope duro | **4.** La quinta no suena: se descarta, no se encola |
| **Un mismo efecto en el mismo cuadro** | tope duro | **1.** Los dos personajes saltando en el mismo instante suenan una vez — y es lo correcto, no una limitación: dos voces idénticas en fase suman amplitud y se escucha como un golpe, no como dos saltos |
| **Nodos vivos en reposo** | solo `volumenEfectos` | **1** |
| **Nodos vivos en el peor caso** | 4 voces × 2 nodos (oscilador + envolvente) + el gain | **9**, encima de los 17 de la rocola |

`CTR-14` no sube: los efectos no agregan un byte de red ni, ahora, un byte de RAM de buffer.
**El techo que importa acá no es el peso: son las voces.**
Un plataformas puede disparar sesenta veces por minuto, y en un teléfono de gama baja lo que
se rompe no es la memoria, es el hilo de audio.

---

### CTR-17.5 — De qué interruptor cuelga

**Del mismo que todo lo demás. Un solo interruptor.**

Si la cinta está apagada, el juego se juega **en silencio entero**: ni tema ni efectos. Si
está prendida, suenan las dos cosas.

- **Por qué no un interruptor propio para los efectos.** Es exactamente la alternativa que
  `ADR-07` ya descartó por escrito para la rocola: *"dos controles para una sola cosa que
  hace ruido"*. Y acá sería peor, porque serían tres.
- **Y por qué no que los efectos suenen igual con la cinta apagada.** Porque apagar es una
  instrucción, no una preferencia de género musical. Alguien que apagó el sitio en el colectivo
  no espera que el juego le haga ruido.
- **`ADR-04.8` sigue mandando** en las tres preferencias del sistema que ya se respetan.
- **Los efectos están exentos del barrido de `ADR-04.3`**, igual que la púa. Si un salto
  hiciera callar a la cinta, el tema se cortaría sesenta veces por minuto. El barrido existe
  para que dos cosas no se tapen; acá las dos son del mismo grafo y se mezclan con ganancia,
  que es la forma correcta de que convivan.

---

### CTR-17.6 — Lo que un efecto no puede ser nunca: la única fuente de un aviso

Regla dura, y es la hermana exacta de la que ya está escrita en `diseno-marca.md` para el
color: **ningún estado se comunica solo con sonido.**

- Que un personaje esté en su puerta se ve además de oírse.
- Que se levantó el coleccionable se ve además de oírse.
- **Que a alguien lo devolvieron a la entrada se ve y nada más** (`UX-29 §3`): el área hace
  una pasada de imprenta sobre sí misma y el personaje ya está en la entrada. Es el único
  estado del juego que **no** tiene mitad sonora, y no es un descuido de este contrato: es
  `UX-29` decidiendo que el silencio ahí es la decisión. La regla de arriba se cumple igual,
  porque se cumple del lado que importa — **lo que se ve alcanza solo; lo que suena, nunca.**
- Cuál de los dos tiene el dedo encima se ve —de frente espera, de perfil juega (`UX-28 §3`,
  el cuadro `enPausa` de `CTR-15.7`)— y **no suena de ninguna manera** (`D-43`).

El motivo es el de siempre en este sitio: **la cinta puede estar apagada, y los molinetes van
abiertos.** Un juego que solo se puede entender con sonido le pide algo al que entra: en este
caso, tener el volumen puesto. Eso es un molinete con otra forma.

---

### CTR-17.7 — Si el usuario quisiera efectos grabados

No hace falta que decida nada para que este contrato corra. Pero si alguna vez quiere sonidos
grabados —un salto de fichín de verdad, una puerta de galpón—, **esto es lo que habría que
decidir, y conviene que esté escrito para que la conversación empiece del punto correcto:**

1. **Serían los primeros archivos de audio del sitio que no son grabaciones de la banda.**
   Eso abre la pregunta de licencia que `BR-15` consecuencia 1 ya hace para el motor: quien
   reclamaría es el autor del sample, y bajar el sitio no le devuelve nada. Ficha `RES-` por
   paquete de sonidos, antes y no después.
2. **Habría que decidir si se decodifican.** Tres samples de 200 ms en `AudioBuffer` son
   fracciones de MB: técnicamente no hay problema, y `D-37` punto 7 no los alcanza. Pero
   entonces `decodeAudioData` vuelve a existir en el sitio para algo que no es un fragmento
   de `US-02`, y eso hay que escribirlo.
3. **Habría que aflojar `ADR-07.10` punto 8 con nombre**, como `D-37` aflojó el candado 2 de
   `ADR-04`. No en silencio.

Mientras tanto, **lo sintetizado no es un parche**: es lo mismo que hace sonar a cinta la
cinta del sitio desde el ciclo 13, y es lo único que cuesta cero y no le debe nada a nadie.
