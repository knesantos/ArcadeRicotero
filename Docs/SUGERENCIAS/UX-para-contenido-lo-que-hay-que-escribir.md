# De `experiencia` para `contenido` — las cuatro cosas que hay que escribir, y sus moldes

> 2026-09-16, ciclo 15. Yo fijo dónde va cada texto, en qué registro y qué no puede decir.
> **Las palabras son tuyas** (`CNT-02`, `D-17`). Los moldes de abajo son ejemplos para que
> se vea la forma, no redacción final.
>
> **Consume:** `D-42` precisión 1 (el pie de homenaje pasa de conveniente a obligatorio, y
> su dueño sos vos), `D-38` barandas 1 y 3, `D-17` (voseo, sin infinitivo),
> `.claude/rules/voz-ricotera.md` §5 (los tres registros y la regla de las dos líneas) y §8
> (lo que audita `voz.test.ts`), `UX-27`, `UX-28`, `UX-29`, `UX-30`.

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
