# La voz manda: cómo suena este sitio cuando habla

Esta regla la escribe el hilo principal y obliga a **todo el que escriba algo que el
jugador vaya a leer** — hilo principal, `contenido`, `experiencia`, y cualquier cadena
suelta que alguien meta en un componente.

Es la hermana de `.claude/rules/diseno-marca.md`. Aquella dice cómo se ve el sitio; esta
dice cómo suena. Las dos nacen del mismo pedido del usuario: **que nada acá parezca hecho
por defecto.**

---

## 1. La línea que no se cruza

El pedido que originó esta regla fue, textual: *"que dé la sensación de que habla el Indio
Solari a través de la web"*. La regla toma eso entero **menos una cosa**, y conviene que
esté escrita antes que nada:

> **El sitio escribe como aprendió a escribir escuchándolo. El sitio nunca se hace pasar
> por él.**

Tres razones, y ninguna es de trámite:

1. **Murió el 5 de junio de 2026** (`RES-04`). Un sitio de fans que le
   pone palabras en la boca a un muerto reciente no es un homenaje, es un truco de
   ventrílocuo — y se nota.
2. **Rompería lo único que el sitio promete de verdad.** Acá `testimonio` significa *lo
   contó alguien con nombre y apellido, y está la ficha* (`D-14`). Una frase inventada con
   su firma envenena el rótulo entero: si una cita puede ser de utilería, ninguna vale. Es
   el mismo daño que un dato falso puesto como respuesta correcta.
3. **Él mismo dejó la advertencia.** Su libro se llama *Recuerdos que mienten un poco* y
   el prefacio avisa que es apenas su versión (`RES-21`). Alguien que desconfía hasta de
   su propia memoria no es material para un oráculo de portada.

**En la práctica:** ninguna pantalla dice "yo" haciéndose pasar por él, ninguna frase
lleva su firma si no está fichada, y el sitio nunca habla en nombre de la banda. Lo que sí
hace —y es lo que esta regla desarrolla— es **usar sus procedimientos**: el largo de sus
frases, su manera de rodear en vez de definir, su desconfianza declarada, su modo de
nombrar a la gente.

Cuando el sitio necesite que hable el Indio, el Indio habla **citado, rotulado y con
ficha**. Como en el artículo de *Oktubre*. Eso ya funciona.

---

## 2. De dónde salen los números de esta regla

No están puestos a ojo. Salen de medir dos corpus que ya están en el repo:

| Corpus | Qué es | Tamaño |
|---|---|---|
| **Cómo habla** | *Recuerdos que mienten un poco*, el memoir en formato entrevista (`RES-21`) | 192.464 palabras · 12.326 oraciones · 4.254 párrafos |
| **Cómo escribe** | `src/data/cancionero.json`, las letras de 104 temas | 2.958 versos · 13.659 palabras |

El texto del memoir se regenera con:

```
pdftotext -layout -enc UTF-8 "Docs/INVESTIGACION/Recuerdos que mienten un poco -- Indio Solari.pdf" memoir.txt
```

**Ojo con ese corpus:** el texto plano mezcla las preguntas de Marcelo Figueras con las
respuestas del Indio, y los pies de foto. Las proporciones de abajo aguantan la mezcla
—las preguntas son una porción chica del texto—, pero **ningún número de acá se cita como
hecho fuera de esta regla sin volver a medir separando las voces.** Acá son vara de
estilo, no hallazgos de `investigador`.

---

## 3. Cómo habla — ocho rasgos medidos

### 3.1 La frase es corta y el párrafo también

Oración mediana: **13 palabras**. El 15% tiene seis o menos. El párrafo mediano: **36
palabras**. Solo el 9% de las oraciones pasa de treinta.

**Qué hago con esto:** si una bajada del sitio necesita una coma más para respirar, está
mal cortada. Dos frases cortas siempre le ganan a una con subordinada.

### 3.2 No define: rodea

*medio* 150 · *tipo* 258 · *un poco* 85 · *como si* 75 · *más bien* 55 · *una especie de*
49. Casi nunca dice qué es una cosa; dice **a qué se parece** y deja que el otro cierre.

**Qué hago con esto:** el sitio prefiere la aproximación concreta a la definición. "Es una
especie de misa" antes que "es un ritual colectivo de pertenencia".

### 3.3 Declara la duda en voz alta

*creo que* 81 · *no sé* 71 · *puede ser* 41 · *supongo* 26 · *qué sé yo* 17.

**Qué hago con esto:** es el rasgo que más se parece a algo que este proyecto ya decidió
por otro camino. Cuando el dato no está firme, el sitio lo dice — y lo dice **como él**,
no como una nota al pie. El artículo de *Gulp!* que avisa que hay tres fechas y que
desconfíes del que tire una sola ya está escrito en este registro. Ese es el modelo.

### 3.4 **No es el porteño de la caricatura**

Este es el hallazgo que más corrige la intuición, y el que más vergüenza ajena ahorra: en
192.464 palabras dice ***che* 9 veces**, ***viste* 15** y ***digamos* 3**.

**Qué hago con esto:** meter *che*, *viste*, *digamos*, *posta* o *bancate* para sonar
argentino es exactamente lo que **no** suena a él. El voseo solo ya alcanza; lo demás es
disfraz. Si una frase necesita un *che* para sonar de acá, el problema es la frase.

### 3.5 La jerga es especia, no plato

*guita* 60 · *pelotudo* 31 · *joda* 27 · *quilombo* 26 · *cana* 24 · *mina* 23 · *boludo*
22 · *laburo* 19. Suma poco más de 250 en casi 200.000 palabras: **una cada setecientas**.

**Qué hago con esto:** una palabra de jerga por pantalla, y que cargue peso. Dos seguidas
ya es un personaje de sketch. (Y sigue rigiendo `CNT-02`: la jerga va en el tono, nunca en
la barrera.)

### 3.6 No hay épica militante

*revolución* 31 · *pueblo* 25 · *resistencia* 7 · *lucha* 6 · *militancia* 8. En un libro
de esa extensión, de un tipo que vivió lo que vivió, eso es **nada**.

**Qué hago con esto:** "la resistencia ricotera", "la lucha", "el aguante" como bandera —
todo eso es vocabulario de la tribuna y de las notas *sobre* él, no de él. El sitio no
arenga. La épica, si aparece, aparece en un hecho concreto contado seco.

### 3.7 Arranca en la mitad y se va sin cerrar

109 párrafos empiezan con *Pero* y 80 con *Y*: entra como si la conversación ya viniera
andando. Y termina de a poco — **1.684 puntos suspensivos**, uno cada 115 palabras, con el
**8,1% de los párrafos** terminando en "…".

**Qué hago con esto:** el sitio puede empezar una bajada por el medio y puede dejar una
frase abierta. **Pero el suspensivo es de él, no del sitio:** en "…" se apoya la prosa que
*cuenta* (la Redondopedia), nunca un botón, nunca un rótulo, nunca un aviso de error. Tres
puntos en una instrucción no son estilo, son ambigüedad.

### 3.8 Dice **la gente**

*la gente* 333 · *el público* 39 · *los fans* **2**.

**Qué hago con esto:** es la palabra del sitio para nombrar a quien está del otro lado.
Ni usuarios, ni fans, ni comunidad, ni ricoteros con mayúscula. **La gente.** (El pie
puede seguir diciendo "sitio de fans": ahí el sitio se nombra a sí mismo, no a la gente.)

---

## 4. Cómo escribe — seis rasgos medidos

Esto es lo que gobierna **los títulos, los casetes y los botones**: el pedido de que los
juegos se presenten *como si fueran un tema*.

### 4.1 Un verso son cinco palabras

Mediana **5**. El cuartil bajo, 3. El 90% no pasa de **8**.

**Qué hago con esto:** techo duro de **8 palabras** para toda línea grande del sitio —
título de casete, título de pantalla, encabezado de resultado. Si no entra en ocho, no es
un verso: es una explicación disfrazada de título.

### 4.2 Le habla a alguien

*tu / tus* 146 contra *mi / mis* 115, y unos 200 imperativos voseados. La letra no es
confesión: **es alguien diciéndole algo a alguien**.

**Qué hago con esto:** la línea grande está en segunda persona o tiene un imperativo. El
botón siempre. Es `D-17` sin excepción: **`Empezá`, `Seguí`, `Volvé`** — nunca `Empezar`,
`Seguir`, `Volver`.

### 4.3 El cuerpo y el objeto, no los colores

Palabras de cuerpo (ojos, boca, manos, piel, sangre, dientes, corazón, lengua): **75**.
Palabras de color: **17**. Cuatro a uno.

**Qué hago con esto:** cuando una línea necesita una imagen, la imagen es **física y
barata**: una parte del cuerpo, un objeto de la casa, un animal, una plata. La psicodelia
de utilería —*viaje*, *delirio*, *colores*, *caleidoscopio*— es de la remera del puesto,
no de las letras.

### 4.4 La ternura metida adentro de lo feo

72 diminutivos en 13.659 palabras, y aparecen justo donde el verso es más duro
(*angelito*, *torito*, *pajaritos*). El diminutivo no ablanda la escena: la empeora.

**Qué hago con esto:** el sitio puede ser áspero y cariñoso en la misma línea. Es la
diferencia entre "te falta escuchar disco" (áspero y de adentro) y "seguí intentando"
(neutro y de afuera).

### 4.5 El intruso

En cada tema hay una palabra que no pertenece al idioma del resto: una marca, una
onomatopeya, un nombre propio raro, un latinajo. Es lo que rompe la solemnidad justo antes
de que se instale.

**Qué hago con esto:** una línea del sitio puede traer un intruso. **Uno.** Y nunca un
emoji: eso lo veta `UX-04` y lo repite `diseno-marca.md`.

### 4.6 No explica

La letra no aclara lo que acaba de decir. Nunca hay una segunda línea que traduzca la
primera.

**Qué hago con esto:** y acá está la trampa, porque el sitio **sí** tiene que explicarse —
los molinetes van abiertos y el que llega sin idea tiene que poder jugar. La salida es la
regla de la sección 5.

---

## 5. Los tres registros, y la regla de las dos líneas

El sitio no habla de una sola manera. Habla de tres, y **mezclarlas es el defecto**.

| Registro | Dónde vive | Cómo se reconoce | Qué no hace nunca |
|---|---|---|---|
| **1. El que canta** | Títulos, casetes, botones, encabezado del resultado | ≤ 8 palabras · segunda persona o imperativo · una imagen física · no explica | No informa. No promete. No vende. |
| **2. El que cuenta** | Redondopedia, explicación post-respuesta, fichas de disco, pies | Oración de ~13 palabras · párrafo de ~36 · rodea, atenúa, declara la duda · puede arrancar por el medio y cerrar en "…" | No arenga. No hace chiste sobre un muerto. |
| **3. El que rotula** | `LEYENDA` · `TESTIMONIO` · fuentes · errores · avisos · instrucciones · Bulacio, Olavarría y la muerte del Indio | Seco. Sin imagen, sin chiste, sin suspensivos. Dice qué hay adentro y se calla. | **No actúa.** Acá el sitio se saca la voz. |

**La acotación de una escena** (la línea que canta de un momento de la noche en «¿Qué tipo de
ricotero sos?», y la que va bajo el título de la grilla del resultado) es registro 1 sin la
segunda persona: **puede ir sin segunda persona ni imperativo**, porque no le habla a quien juega
ni le dice qué hace; puede nombrar objetos, sonidos, el cuerpo o lo que hace la gente de la
escena. El resto del registro 1 la obliga igual: ocho palabras, una imagen física, no explica.
(La pidió `contenido` en `CNT-31` §14.3, la leyó `REV-20`, la trae el hilo principal, 2026-10-06.)

> **La regla de las dos líneas.** Toda pantalla que presenta algo tiene **una línea que
> nombra y otra que canta**. La que canta hace el trabajo de `CNT-02` ("la jerga va en el
> tono"); la que nombra hace el de los molinetes ("nunca en la barrera").
>
> Cuál de las dos es la grande **depende de la pantalla, y no importa**. En un casete la
> que nombra es el título ("Adiviná la tapa") y la que canta es la bajada. En el resultado
> es al revés: canta el encabezado y nombra el puntaje.
>
> **La prueba:** tapá la que canta. Si el que llegó por un enlace de Twitter todavía sabe
> qué es esto y qué botón tocar, está bien escrito. Si no, la que canta estaba haciendo un
> trabajo que no le toca — y eso es un molinete.

El registro 3 es el más importante y el que más tienta decorar. **No se decora.** Es la
contracara exacta de lo que dice `CLAUDE.md`: si el rótulo miente sobre lo que hay
adentro, el sitio le marca error al que se sabe el tema. Un `LEYENDA` con onda es un
`LEYENDA` en el que no se puede confiar.

---

## 6. La Redondopedia: registro 2, con el rótulo en 3

La pregunta estaba abierta: ¿enciclopedia neutra o voz ricotera? **Las dos, y no es un
empate: son capas distintas del mismo artículo.**

- **La prosa va en registro 2.** `D-20` ya lo había fijado —"enciclopedia en la forma y
  ricotera en la voz"—; esta regla lo hace operable. Y encaja de casualidad perfecta: el
  rasgo 3.3 (declarar la duda) es *exactamente* el mecanismo que Wikipedia no puede usar.
  Allá, un dato con tres fechas se resuelve con una plantilla de "cita requerida". Acá se
  cuenta que hay tres fechas y que desconfíes del que tire una sola. **Eso es a la vez más
  honesto y más ricotero**, y es la ventaja competitiva que `D-20` fue a buscar.
- **El rótulo va en registro 3, sin excepción.** `hecho`, `leyenda`, `testimonio`, la
  ficha `RES-` y el nombre del que contó. Fríos. La voz vive en el párrafo; el rótulo es
  el que garantiza que el párrafo se pueda creer.
- **Registro 3 entero, prosa incluida**, en los tres lugares que `CNT-04` y `CNT-06` ya
  marcaron: Bulacio, Olavarría y la muerte del Indio. Ahí no hay voz que valga.

**Lo que la Redondopedia no es:** no es la letra de un tema. Un artículo ambiguo, oracular
o hecho de imágenes es ilegible como enciclopedia y, peor, **borra la frontera entre el
hecho y la leyenda** — que es lo único que la sostiene. El registro 1 en la Redondopedia
aparece en los títulos y en el "Seguí por acá". En el cuerpo, nunca.

---

## 7. Prohibido: la voz genérica de IA (el "slop" del texto)

Mismo criterio que la tabla de `diseno-marca.md`, para lo que se lee:

| Tic vetado | En su lugar |
|---|---|
| *Descubrí todo sobre…*, *Sumergite en…*, *la experiencia definitiva* | Una imagen física y corta (4.3). El sitio muestra, no invita a mostrar |
| *¡Y listo!*, *¡Y a jugar!*, *¡Dale que va!* | Nada. El botón ya dice qué hacer |
| Entusiasmo de folleto: *increíble*, *único*, *imperdible*, *definitivo* | El dato pelado. La emoción la pone la banda, no el adjetivo |
| *No es solo X, es Y* | Una sola afirmación |
| Cada ítem de una lista arrancando con negrita-título | Prosa, o una lista sin sermón |
| *Che*, *viste*, *digamos*, *posta* metidos para sonar argentino | Voseo y punto (3.4: los usa 9, 15 y 3 veces en 200.000 palabras) |
| Épica de tribuna: *la lucha*, *la resistencia*, *el aguante* como bandera | El hecho concreto, seco (3.6) |
| Psicodelia de utilería: *viaje*, *delirio*, *caleidoscopio*, colores | Cuerpo, objeto, animal, plata (4.3) |
| Emoji, o el ícono como decoración | Ya vetado por `UX-04`. Los símbolos funcionales testeados (✔ ✕ ◆ ❝) se quedan |
| Infinitivo en un botón: *Empezar*, *Seguir*, *Volver* | `Empezá`, `Seguí`, `Volvé` (`D-17`, y 4.2) |
| *Los fans*, *los usuarios*, *nuestra comunidad* | **La gente** (3.8) |
| Explicar el chiste en la línea siguiente | Cortar antes (4.6) |
| Signo de exclamación en una bajada | Solo grita el acierto, que es un grito de verdad |

---

## 8. Qué se audita a máquina

`src/lib/voz.test.ts` falla el build si en el texto visible aparece:

1. un anglicismo del glosario de `D-17`;
2. una fórmula de folleto de la tabla de arriba;
3. un botón en infinitivo (`Empezar`, `Seguir`, `Volver`, `Jugar`, `Compartir`…);
4. un título de más de 8 palabras;
5. una bajada de casete cuya **primera frase** —la que canta— pasa de 8 palabras;
6. *los fans* / *los usuarios* como forma de nombrar a la gente;
7. puntos suspensivos en un botón o en un rótulo.

Lo demás —si la imagen es física, si el intruso es uno solo, si la frase respira— **lo
audita el oído de quien revisa, con esta regla como vara.** Igual que el ojo audita el
diseño.

---

## 9. Si algo de esta regla te queda chico

Propuesta en `Docs/SUGERENCIAS/`, como siempre. El glosario de palabras visibles es de
`contenido` (`CNT-02`, `CNT-05`); los rótulos son de `arquitectura` y de `D-14`; el
reparto de registros por pantalla es de `experiencia`. Esta regla fija el principio y los
números.
