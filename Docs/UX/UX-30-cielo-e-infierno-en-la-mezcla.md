# UX-30 — Cielo e infierno en la mezcla: qué disco viste este juego

> Rol dueño: `experiencia`. Ciclo 15, 2026-09-16. **Extiende `UX-04`** (el mapa
> sección→disco es suyo en última instancia, y `D-19` lo dice por escrito).
>
> **Consume:** `D-19` entera (la mezcla, el mapa inicial, las tres reglas que ordenan el
> caos, y la línea que dice que el mapa es mío), `D-18` (las paletas se muestrean, no se
> inventan), `D-41` (pixel adentro), `D-38`/`D-42` (paridad y tono), `UX-04` (sistema
> visual), `UX-27` (la paleta acotada de 16 y la regla de la sombra), `UX-29` (el fracaso),
> `RES-37` (las paletas reales medidas, que es de dónde salen los dos hex),
> `RES-64.3` (el sombrero claro, fichado), `IDEA-14` (el par elemental decidido por el
> usuario), `src/styles/tokens.css` (leído entero el bloque de las diez paletas de disco),
> la medición "`D-19` y la paleta: no es el callejón sin salida que parecía" de `INV-60`, y
> `Docs/SUGERENCIAS/HILO-para-experiencia-skayboy-y-poligirl.md` §4.
>
> **Resuelve:** de qué disco salen las dos tintas del juego, el choque de que ese disco ya
> viste otro lugar, y el reparto de quién camina qué. **No resuelve** el nombre del juego ni
> el tema que suena: eso es de `contenido` (`D-39` consecuencia 3 dice que el tema se elige
> entre `contenido` y `experiencia`; lo mío está en `§5`).

---

## 1. El disco es *Gulp!*, y no es una elección libre

El usuario fijó el par elemental: **cielo / infierno**. Los dos títulos que lo anclan
—«El infierno está encantador esta noche» y «Yo no me caí del cielo»— son **los dos de
*Gulp!* (1985)**. No hay nada que elegir: el disco viene con el par.

Y `RES-37` ya midió esa tapa, así que las dos tintas existen y no hay que inventar ninguna
(`D-18`):

| Elemento | Token | Hex | Qué es en la tapa |
|---|---|---|---|
| **Infierno** | `--disco-gulp-tinta` | `#df5744` | El rojo del título manuscrito |
| **Cielo** | `--disco-gulp-apoyo` | `#e6e4bd` | El crema |

Es una casualidad afortunada y conviene decirla: la tapa que trae los dos títulos trae
además **exactamente dos tintas, una caliente y una fría**, que es lo único que este juego
necesita. No hubo que elegir un color para el fuego ni uno para el agua.

**Las dos rampas de terreno salen de ahí** con la regla de `UX-27 §4.1`: el ancla más dos
escalones más claros, y la sombra es la clave. Ningún hex nuevo entra al sistema sin
muestreo detrás.

---

## 2. Que *Gulp!* vista dos lugares no es un defecto. La regla nueva

*Gulp!* ya viste **historia** en el mapa de `D-19` (`--cat-historia` es el mismo `#df5744`).
El traspaso planteó el problema y `INV-60` lo midió: el repo ya tiene dos precedentes —*La
mosca y la sopa* viste el juego de letras **y** el cancionero, y *Luzbelito* viste `dos-ejes`
sin ser siquiera variante de casete. O sea que la premisa "un juego, un disco propio" ya
estaba desmentida dos veces antes de este ciclo.

Lo que faltaba no era el permiso: era el criterio que separa la repetición legítima de la
casualidad. Lo escribo acá, y vale para todo lo que venga:

> **Un disco puede vestir más de un lugar cuando el lugar lo hereda del contenido, no de un
> reparto libre.** *Gulp!* no viste este juego porque quedaba lindo ni porque sobraba: lo
> viste porque los dos temas que le dan su par elemental son de ese disco. Si el contenido
> de una pantalla nombra un disco, esa pantalla viste ese disco aunque otra ya lo use.

Corolario, para el día que quede un solo disco libre: **el mapa sección→disco no es un
reparto de diez lugares. Es una consecuencia.** Quedarse sin disco libre no es un problema;
vestir un disco que el contenido no nombra, sí.

**Y lo que sigue sin estar libre, porque nadie lo derogó:** *Un baión para el ojo idiota*
tinta hoy la sección del cancionero y un pie, y es el ancla de `IDEA-02`. Este juego no lo
toca.

### 2.1 Cómo no se confunde con la categoría "historia"

La tinta se repite; lo demás no. Tres cosas los separan, y no hace falta ninguna más:

1. **La letra grande.** *Gulp!* no tiene letra reconstruida (`UX-22 §7`: solo la tienen
   Oktubre y el par Lobo suelto / Cordero atado), así que el título va en
   `--fuente-rotulada`, igual que hoy. No hay una letra de disco que se pueda leer mal.
2. **La forma.** Historia es un casete del portal y preguntas de quiz. Esto es un mueble con
   un tubo adentro (`UX-27 §1`). No se parecen en nada.
3. **El uso de la tinta.** En historia el rojo es texto. Acá el rojo es **terreno**: nunca
   escribe, nunca rotula, nunca es un estado. `UX-27 §4.2` ya lo dijo por el otro lado — el
   rojo de error no entra al área.

---

## 3. Quién camina qué, y por qué no lo explica ninguna pantalla

`IDEA-14` dejó escrito el límite con todas las letras: *"Quién es inmune a qué es criterio
del sitio y se declara como criterio del sitio. Una pantalla que diga 'Skayboy es inmune a X
**porque** Y' inventa el porqué"*, y eso cae bajo lo único que `CLAUDE.md` declara estricto.
Los 105 títulos y los 2913 versos no asocian a ninguno de los dos con ningún elemento: no
hay ancla, y fabricarla sería inventar.

Entonces el reparto se decide por **legibilidad**, que es un criterio de diseño, se puede
medir y no afirma nada sobre nadie:

| Personaje | Camina | El motivo, que es de silueta |
|---|---|---|
| **Skayboy** | El infierno (terreno oscuro/rojo) | Su silueta la domina un **sombrero claro** — el Panamá beige de `RES-64.3`, ver `UX-27 §8.1`. Una masa clara arriba se lee mejor sobre terreno oscuro |
| **Poligirl** | El cielo (terreno claro) | Su silueta la domina una **masa de pelo oscuro**. Una masa oscura se lee mejor sobre terreno claro |

Y arregla, de paso, el hallazgo 3 del ensayo del 2026-09-11 —*"la mata de pelo de Poligirl
se empasta más"*—: se empastaba porque estaba puesta sobre el terreno equivocado.

**Ninguna pantalla dice por qué.** Ni "Skayboy resiste el fuego", ni "Poligirl es de arriba",
ni una línea que lo insinúe. El que juega lo aprende en tres segundos tocando, que es como
lo aprende cualquiera en este género.

### 3.1 El cuidado de tono, que es la razón por la que este apartado existe

Poner a la mujer en el cielo y al hombre en el infierno se puede leer como un lugar común
—ella el ángel, él el diablo— y eso toca la baranda de `D-42`, que dice que el tono es lo
que mide el riesgo. Se desactiva por construcción, de tres maneras:

1. **El par no es moral.** El título que lo ancla dice que el infierno está encantador. No
   hay un terreno bueno y uno malo, y ninguna pantalla los ordena.
2. **Ninguno de los dos terrenos lastima** (`UX-29 §7.2`): devuelven a la entrada. No se
   castiga a nadie con el suyo ni con el ajeno.
3. **La paridad está en la paleta, no en el discurso**: tres colores cada uno, exactamente
   (`UX-27 §4`). El primer lugar donde se ve si uno vale menos que el otro es la cantidad de
   tinta que le tocó.

---

## 4. La mezcla afuera del área

Adentro manda la paleta de 16 (`UX-27`). Afuera manda `UX-22`, sin cambios, y la base no
rota (`D-19`, primera regla): fondo de tinta, grano, `--toque-min`, contraste AA.

| Pieza | Tinta |
|---|---|
| Título del juego, en `--fuente-rotulada` | `--disco-gulp-tinta`, con el eco de registro de `UX-22 §8` en `--disco-gulp-apoyo` |
| Chapa y pie de homenaje | `--papel` con tinta `--fondo`, y `--papel-tenue` si hace falta tinta apagada — el par ya está testeado |
| Las seis teclas de mando | La tinta del disco para el borde; el relleno sigue siendo el de cualquier control del sitio |
| El casete del juego en el portal | Como todos: `--papel`, sello de goma, rotación leve |
| El rodillo, entre el marco y lo que haya debajo | `--textura-rodillo`, tomando `currentColor` |

**Lo que no rota nunca, y acá vuelve a decirse porque el juego es el lugar donde más se va a
tentar:** el verde de acierto, el rojo de error y los rótulos de leyenda y testimonio no se
disfrazan de ningún disco (`D-19`, tercera regla).

---

## 5. El tema que suena: lo que aporto y lo que no

`D-39` dejó abierto cuál es el tema, con `contenido`. Lo mío es el borde, no el título:

- **Sale de *Gulp!*, por lo mismo que la paleta.** Que el disco que se ve y el disco que se
  escucha sean el mismo es gratis y hace que la pantalla suene a un solo lugar.
- **Se cumple `D-39` condición 3:** el título se puede mostrar; **el disco no se nombra en
  pantalla durante la partida**, porque hay diez discos contra noventa y cinco temas y
  nombrarlo le sopla el disco a otro juego. Es la misma cautela que `UX-26` ya tomó para la
  rocola.
- **Y un cuidado que es de este juego y de ninguno más:** el tema no puede ser uno de los
  dos que anclan el par si mostrar su título convierte la pantalla en un cartel que explica
  la mecánica. El reparto de `§3` no se explica (`§3`), y un título arriba de la pantalla
  explicándolo sería explicarlo igual.

---

## 6. Qué le agrega este documento a `UX-04`

`UX-04` sigue entero. Lo que cambia es una línea y se suma otra:

| Antes | Ahora |
|---|---|
| El mapa sección→disco era una asignación (`D-19`: portada Oktubre, historia Gulp!, mitología Lobo suelto, letras La mosca, discos Último bondi, resultado Gulp! + logo) | Sigue igual, y se le agrega la **regla de por qué se puede repetir un disco** (`§2`): el lugar hereda el disco de su contenido. Nada del mapa viejo se mueve |
| El sistema visual tenía un solo idioma, el de la imprenta | Tiene dos, con frontera escrita (`D-41`, `UX-27`). `UX-04` sigue rigiendo **afuera** del área, sin una coma de cambio |
| La paleta de `UX-04` está descrita sin hex, a propósito ("el hex final lo fija quien produce el arte") | Para el área de juego el hex sí está fijado, porque un tileset no se puede dejar abierto: son 16, viven en `tokens.css` y salen de dos anclas medidas |

---

## 7. Cómo se verifica

```
node --test src/lib/contraste.test.ts    # los --px-* contra la clave (UX-27 §5.3)
node --test src/lib/estilos.test.ts      # que ningún estado se comunique solo con color
npm test
```

A ojo, y es una sola prueba que vale por todas: **mirar la pantalla en escala de grises.**
Si se sigue distinguiendo cuál personaje está en qué terreno, el reparto de `§3` está bien
hecho. Si hay que ver el color para saberlo, está mal — y esa es la misma vara que el sitio
usa desde siempre para acierto y error.
