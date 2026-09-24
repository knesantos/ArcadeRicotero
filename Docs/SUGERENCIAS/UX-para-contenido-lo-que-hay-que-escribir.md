# De `experiencia` para `contenido` — las cuatro cosas que hay que escribir, y sus moldes

> 2026-09-16, ciclo 15. Yo fijo dónde va cada texto, en qué registro y qué no puede decir.
> **Las palabras son tuyas** (`CNT-02`, `D-17`). Los moldes de abajo son ejemplos para que
> se vea la forma, no redacción final.
>
> **Consume:** `D-42` precisión 1 (el pie de homenaje pasa de conveniente a obligatorio, y
> su dueño sos vos), `D-38` barandas 1 y 3, `D-17` (voseo, sin infinitivo),
> `.claude/rules/voz-ricotera.md` §5 (los tres registros y la regla de las dos líneas) y §8
> (lo que audita `voz.test.ts`), `UX-27`, `UX-28`, `UX-29`, `UX-30`. **`§6` suma
> `UX-32-ganar-se-ve.md` (2026-09-24, `T-289`).**

---

## 1. El pie de homenaje — registro 3, obligatorio, en la chapa

**Dónde va:** en la chapa del marco, la franja de 24 px abajo del área de juego (`UX-27
§1.1`). No es un pie de página que se cae abajo de todo: es la placa atornillada al mueble,
visible mientras se juega, sin scroll.

**Qué tiene que decir**, y las tres cosas las fija `D-42`, no yo:

1. que es un homenaje de fans,
2. que no es oficial,
3. que ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver.

**Registro 3 entero.** Seco, sin imagen, sin chiste, sin suspensivos, sin voseo simpático.
Es el mismo registro que `LEYENDA` y `TESTIMONIO`, y por el mismo motivo: si el rótulo tiene
onda, no se puede confiar en el rótulo.

**Molde de forma, no de palabras:** una o dos oraciones cortas, con los dos nombres completos
escritos como nombres, no como apodos. `D-42` es la única decisión del repo que obliga a un
texto en una pantalla de juego; si no entra en la chapa, se achica la letra, no el texto.

---

## 2. El fracaso — lo mejor que podés escribir es nada

`UX-29 §5` lo cierra: cuando a un personaje lo devuelven a la entrada, **el sitio no dice
nada**. Ni una palabra, ni un rótulo, ni un sonido. No hay `GAME OVER`, no hay "perdiste",
no hay contador de vidas ni de intentos.

**La única excepción posible es de accesibilidad**: si el lector de pantalla necesita que
algo se anuncie. Si llega a hacer falta:

- **Registro 3**, una sola línea.
- **Nombra el lugar, no a la persona.** Lo que volvió a la entrada es un personaje, no
  Eduardo Beilinson.
- **Ni el verbo morir, ni sus parientes.** Ni caer, ni perder, ni fallar como estado.
- **Molde de forma:** algo del orden de "de vuelta en la entrada". Cuatro palabras, sin
  emoción, sin imagen.

**Lo que está prohibido y va a tentar:** una frase de registro 1 al fallar. El que canta es
≤ 8 palabras con una imagen física, y una imagen física sobre el muñeco de alguien vivo al
que acaban de sacar es el sitio haciendo un chiste sobre una persona real.

---

## 3. La línea de vertical — registro 3, en la chapa

`UX-28 §4`: el que entra con el teléfono parado juega igual, a la mitad de tamaño, y una
línea en la chapa avisa que de costado se ve el doble de grande.

- **Registro 3.** Es una instrucción, y las instrucciones no se decoran.
- **No es un cartel ni una pantalla:** una línea, en la placa, que no tapa nada y que no hay
  que tocar para seguir.
- **No pide nada, informa una ganancia.** La diferencia importa: "girá el teléfono" es una
  orden en la puerta; decir que de costado se ve el doble es un dato. `D-14` no permite lo
  primero.
- **Molde de forma:** una oración corta, imperativa o no, con el dato adentro.

---

## 4. Los seis mandos y el título — registro 1, y lo que audita el test

**Las seis teclas** (dos por columna de dirección, más saltar, por dos personajes) llevan
nombre accesible aunque no lleven texto visible. `voz.test.ts` falla el build con un botón
en infinitivo: **`Saltá`, nunca `Saltar`.**

**El título del juego.** `IDEA-14` punto 7 lo dejó abierto y es tuyo con el usuario: el
nombre dejó de explicarse por el par cuando el usuario eligió cielo/infierno en vez de
fuego/agua. Dos cosas desde mi lado:

- **Techo de 8 palabras** para el `h1`, como todo título del sitio.
- **El nombre del juego de origen no se escribe en ningún lado** — ni en texto visible, ni
  en metadata, ni en comentarios del código (`RES-60`). Vale también para el `h1`, para el
  casete del portal y para la tarjeta al compartir.

**Y la regla de las dos líneas, aplicada al casete del portal:** una línea que nombra y otra
que canta. La prueba es la de siempre — tapá la que canta; si el que llegó por un enlace
todavía sabe qué es esto y qué botón tocar, está bien escrito.

---

## 5. Lo que ningún texto de este juego puede hacer, en una lista

Sale de `D-38` barandas 1 y 3, que `D-42` dejó intactas. No es estilo:

| Prohibido | Por qué |
|---|---|
| Que un personaje diga "yo" — bocadillo, cartel en primera persona, frase con firma | Envenena el rótulo `testimonio` de todo el sitio |
| Contar, insinuar o cerrar la relación real entre Skay, Poli y el Indio | Son tres personas, una murió hace tres meses |
| Explicar por qué cada uno camina su terreno | El reparto es criterio del sitio y `IDEA-14` prohíbe fabricarle un porqué |
| Nombrar el disco del tema que suena durante la partida | `D-39` condición 3: hay diez discos contra noventa y cinco temas, y nombrarlo le sopla el disco a otro juego |
| Una frase de final feliz cuando los dos llegan a la puerta | `UX-29 §8`. La puerta se abre y eso es todo lo que pasa |
| "Los fans", "los usuarios", "nuestra comunidad" | **La gente** |

---

## 6. El aviso de ganar, y la etiqueta del toque para seguir

> Sumado el 2026-09-24 (`T-289`, ciclo 16), al cerrar `Docs/UX/UX-32-ganar-se-ve.md`. Es el
> equivalente de `§2` para el otro lado: ahí el sitio calla, acá tiene que decir dos cosas
> cortas, y las dos son tuyas.

**El aviso de lector de pantalla, cuando los dos llegan a su puerta.** `PANTALLA.avisoEntrada`
ya existe para el fallo (*"De vuelta en la entrada."*); ganar no tiene su par. Mismo molde
que `§2`:

- **Registro 3**, una sola línea.
- **Nombra el lugar o el hecho, no a las personas.** Lo que pasó es que se llegó a las dos
  puertas, no que "ganaron" — evitar el verbo que sugiera un logro compartido si eso abre la
  puerta (nunca mejor dicho) a leerse como festejo.
- **Sin suspensivos, sin signo de exclamación** (`voz-ricotera.md` §7 y §8, punto 7 de lo que
  audita `voz.test.ts`).
- **Molde de forma:** algo del orden de "las dos puertas, abiertas". Cuatro palabras, sin
  emoción.

**La etiqueta del control para seguir** (`UX-32 §5`). El sitio ya tiene el verbo: **`Seguí`**,
nunca `Seguir` (`D-17`, y lo mismo que usa el resto del sitio después de revelar algo). No
hace falta inventar una palabra nueva — si alcanza con reutilizar `Seguí` tal cual, no hay
redacción pendiente; si el control necesita además un `aria-label` más largo porque el texto
visible no alcanza sin contexto (por ejemplo, si vive superpuesto al área y no lleva letra
visible), ese `aria-label` es tuyo, mismo registro 1 que un botón, mismo límite de
`voz.test.ts` sobre infinitivos.

---

## 7. Pantalla completa y victoria bailada — cinco textos, para `CNT-22` (`T-299`)

> Sumado el 2026-09-24 (`T-297`, ciclo 16, ráfaga 5), al cerrar
> `Docs/UX/UX-33-pantalla-completa-y-victoria.md`. Sale de `D-47` y `BR-31`.

### 7.1 El interruptor de pantalla completa — dos estados, mismo molde que la cinta (`UX-21 §3`)

**Dónde vive:** un sello de goma superpuesto a una esquina del mueble (ventana) o del área
(pantalla completa) — `UX-33 §1.2`/`§1.5`. Mismo patrón que la cinta: **la estampa visible
nombra el estado actual** (no la acción), y el `aria-label` nombra el verbo, en voseo.

| Estado | Estampa (registro 3, 2-3 palabras) | `aria-label` (voseo, sin infinitivo) |
|---|---|---|
| Ventana | algo del orden de **"PANTALLA NORMAL"** o el nombre que seas de lo que hay ahora | **"Entrá a pantalla completa"** o equivalente |
| Pantalla completa | algo del orden de **"PANTALLA COMPLETA"** | **"Salí de pantalla completa"** o equivalente |

Sin ícono (`UX-33 §1.2`: no hay un objeto propio del fichín que signifique "expandir", así
que no se inventa uno — es la misma lógica por la que la cinta sí pudo usar un triángulo y
esto no puede). Van en `--fuente-rotulada` en cuanto lleven tilde.

**No hace falta texto distinto para iPhone.** El resultado que ve la persona es igual en
cualquier plataforma (`UX-33 §1.8`).

### 7.2 La línea de victoria — solo si hace falta más que el aviso de `UX-32 §6`

`UX-32 §6` ya te pidió `PANTALLA.avisoEntrada` para cuando los dos llegan a la puerta ("las
dos puertas, abiertas", o tu versión). Con el baile agregado (`UX-33 §2`), esa misma línea
puede necesitar nombrar el hecho nuevo si el aviso de lector de pantalla se queda corto sin
él — por ejemplo, si "las dos puertas, abiertas" ya no basta porque ahora también hay
movimiento que un lector de pantalla no ve solo. Registro 3, una sola línea, sin
suspensivos, sin exclamación, nombra el hecho — no a las personas ni el logro compartido.

### 7.3 La línea del final del sexto nivel — distinta de la de cualquier otro

`UX-33 §2.4`: al ganar el sexto nivel, el toque para seguir no lleva al próximo nivel, lleva
a la pieza compartible (`BR-27`). Hace falta una línea corta que marque esa diferencia —
puede vivir en el mismo lugar que el aviso de `§7.2`, o al lado del control para seguir.
Restricciones: nada de "ganaron" ni de logro compartido (`voz-ricotera.md §5`, `BR-31`), y
el registro es tuyo a elegir entre el 1 (canta) y el 3 (rotula), según si la línea informa
un hecho o invita a un paso.

### 7.4 El contador del coleccionable, si existe (`UX-33 §2.5`)

Si el sitio muestra cuántas guitarras juntó Skayboy y cuántos cigarrillos Poligirl —en la
pantalla de victoria de cada nivel, nunca durante la partida—, hacen falta las dos palabras
en la forma exacta en que se van a leer al lado de un número: "guitarra(s)" y
"cigarrillo(s)". Sin comparación entre los dos personajes en el texto (`BR-27` punto 2, la
misma restricción que ya rige el tiempo).

### 7.5 El anuncio de accesibilidad al levantar un objeto, opcional

Si hace falta que un lector de pantalla anuncie que se juntó una guitarra o un cigarrillo:
registro 3, cuatro palabras como techo, nombra el objeto y no narra nada más — el mismo
molde que ya usa `§2` de este documento para el fracaso ("de vuelta en la entrada").
