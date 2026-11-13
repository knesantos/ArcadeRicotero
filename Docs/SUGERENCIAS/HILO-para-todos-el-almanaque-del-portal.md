# Para todos los roles: el almanaque del portal — qué viste la portada cuando se apaga *Oktubre*

> De: hilo principal · 2026-10-29 · checkout principal, sin rama todavía.
> Pedido del usuario, textual: *"Actualicemos la portada de la página, quedó vieja de oktubre,
> que quede hasta el fin del mes, pero ya pensemos otra cosa."*
> **Decidida el mismo día** (*"Sí, armalo"*): es `D-84` en `Docs/DECISIONES.md`, `T-520`, y `UX-40` de
> `experiencia`. Lo que cambió al construir está en `D-84`: la separación (2-nov-2001, `hecho`) entra como
> taco de noviembre; `contenido` recortó las dos líneas que cuentan y el botón de noviembre pasó a
> «MIRÁ QUÉ SE TOCÓ EL 19»; Concordia no entra a diciembre porque no tiene ficha.

## 1. Lo que pasa solo el 1.º de noviembre

Nada que hacer para que el afiche "quede hasta el fin del mes": ya está hecho así. `D-49`
punto 2 lo decidió: el afiche está siempre impreso y **lo prende la fecha del teléfono**, con
una línea en la cabeza de `src/pages/index.astro` (`data-mes="oktubre"` si `getMonth() === 9`)
y `sitio.css` (`.oktubre { display: none }` salvo con ese atributo). El 1.º de noviembre, a las
cero horas de quien mira, el afiche desaparece y la casetera sube a donde estaba en septiembre.
Sin build, sin deploy, sin que nadie se acuerde.

Lo que queda después es **la portada de siempre**: marca, lugar, bajada, rodillo, los nueve
casetes del lado A y los dos del B. Esa es la base, y es la que hay que mejorar con "otra cosa".

## 2. La idea: el afiche de octubre pasa a ser el almanaque del portal

`D-49` construyó un mecanismo para un solo mes, pero el mecanismo es general: **un mes → un
afiche**, prendido por la fecha de quien mira, con los datos sacados de las fichas de la
Redondopedia y solo los rotulados `hecho`. Lo que propongo no es un afiche nuevo para
noviembre y otro para diciembre escritos a mano: es **convertir el de octubre en el almanaque
del portal**, una tabla mes → afiche, donde los meses que tienen algo que decir lo dicen y los
que no, no muestran nada.

Tres principios, antes de las fechas:

1. **El almanaque solo festeja.** Lo que es duelo —Bulacio en abril, Olavarría en marzo, la
   muerte del Indio en junio— se cuenta en la Redondopedia en registro 3 (`voz-ricotera.md` §6)
   y **nunca va en un afiche**. Esos meses, el portal se queda callado. No es una omisión: es
   la regla.
2. **Lo estricto de `D-49` punto 3 sigue entero:** una fecha entra al afiche solo si su ficha la
   tiene rotulada `hecho`. Si pasa a discutida, sale sola. Hay **una excepción declarada**, y es
   el punto más discutible de esta propuesta: la fundación del 28 de diciembre, que es
   `leyenda` y entra **con el rótulo LEYENDA a la vista** (sección 5).
3. **Un mes sin afiche es un mes sin afiche.** No se rellena con "efemérides" flojas para que
   el portal tenga siempre algo. *Gulp!* tiene tres fechas en discusión y por eso no cumple
   años en ningún mes; eso también lo dice `D-49`.

## 3. Lo que da cada mes, mirando las fichas (solo `hecho`, salvo donde se dice)

Medido el 2026-10-29 sobre `src/data/redondopedia.json` (41 artículos) e `INV-100`:

| Mes | Qué hay | Afiche |
|---|---|---|
| Enero | Nada rotulado `hecho` con día en las fichas (el cumpleaños de Sidotti es `leyenda`) | no |
| Febrero | Nada | no |
| Marzo | Olavarría (11-mar-2017) | **nunca** (duelo) |
| Abril | Bulacio (19-abr-1991); *Gulp!* versión A (22-abr-1985, en discusión) | **nunca** (duelo; y *Gulp!* no cumple años) |
| Mayo | *Un baión* (9-may-1988) · Rocambole (12-may-1943) · Huracán (14-may-1994, lista entera cargada) | sí, cuando llegue |
| Junio | Muerte del Indio (5-jun-2026) | **nunca** (duelo) |
| Julio | Montevideo, primer recital afuera (22-jul-1989); *Gulp!* versión B (en discusión) | flojo: no por ahora |
| Agosto | Obras 24-ago-1990 (lista cargada) | flojo: no por ahora |
| Septiembre | Nada | no |
| **Octubre** | Los seis discos (`D-49`) | **ya está** |
| **Noviembre** | *Momo Sampler* (17-nov-2000) · *Último bondi* (18-nov-1998) · **Huracán 93** (19 y 20-nov-1993) · el Lozanazo (26-nov-1977) | **sí: es el próximo** (sección 4) |
| **Diciembre** | Obras, el debut (2-dic-1989) · Concordia (8 y 9-dic-1995, las dos listas CC0) · Huracán 94 (16 y 17-dic-1994) · la fundación (28-dic-1976, `leyenda`) | **sí** (sección 5) |

Con esto el almanaque tiene **cuatro meses con afiche** (mayo, octubre, noviembre, diciembre)
y ocho sin nada. Un tercio del año, no todo el año: el portal corto de `UX-25` sigue siendo
la normalidad.

## 4. Noviembre: HURACÁN

**Por qué Huracán y no los dos discos.** Noviembre tiene las dos cosas, y las dos entran al
almanaque. Pero el afiche necesita **un** cumpleaños, como *Oktubre* tuvo el suyo, y el de
noviembre es Huracán 93: la primera vez de la banda en esa cancha, más de 70.000 personas,
*Lobo suelto, cordero atado* recién salido, Las Blacanblus de invitadas — todo `hecho` en la
ficha `huracan-93-94`. Es, además, el ejemplo que `CLAUDE.md` usa para describir al que sabe:
*"el que sabe qué se tocó en Huracán en el 93"*. Y el sitio **tiene** qué se tocó: las dos
noches están cargadas en `recitales.json` (`RES-210`, `RES-211`, de Discogs, con su rótulo de
transcripción de casete) y suenan de punta a punta en "En vivo". Los dos discos, en cambio,
cumplen 26 y 28: no tienen nada que *Oktubre* no haya tenido mejor.

Las líneas, para que `contenido` las lea y `voz.test.ts` las audite (misma estructura que
`OKTUBRE` en `src/lib/sitio/copy.ts`):

| Pieza | Texto | Registro |
|---|---|---|
| Sello | **HURACÁN** | 1 — en `--fuente-marca-firma` (la letra de la banda tiene la Á; el calco de *Oktubre* no, y además es la letra de *ese* disco) |
| Estampa | `EL 19 CUMPLE 33` · `HOY CUMPLE 33` · `CUMPLIÓ 33 EL 19` | 3 — las mismas tres funciones que octubre; los años los cuenta la fecha de quien mira |
| Canta | **Trepate al alambrado, que ya salen.** | 1 — seis palabras, imperativo, un objeto de la cancha, no explica nada |
| Cuenta | El 19 y el 20 de noviembre del 93, más de setenta mil personas en el Ducó, con el disco doble recién salido. | 2 — solo lo que la ficha tiene en `hecho`; no dice "primera cancha de fútbol" porque la ficha dice "primera vez en esa cancha" |
| Almanaque | `17 · Momo Sampler · 2000` — `18 · Último bondi · 1998` — `19 · Huracán · 1993` — `20 · Huracán · 1993` — `26 · El Lozanazo · 1977` | 3 — cinco tacos; los discos en su tinta (`--disco-momo-sampler-tinta`, `--disco-ultimo-bondi-a-finisterre-tinta`, par AA ya testeado), Huracán en la de *Lobo suelto* (el disco que se presentó), el Lozanazo en `--texto`; cada uno lleva a su ficha |
| Botón | **ESCUCHÁ LA NOCHE DEL 19** | 1 — a la lista del 19/11/93 en `/redondopedia/en-vivo/`, que suena diez segundos por tema |

Alternativa para el botón, si se prefiere un juego como en octubre: **ARMÁ TU HURACÁN**, a
"Armá tu recital" con el Ducó ya elegido. Hoy el juego no acepta un lugar por URL (la quinta
forma del link lleva la lista entera); sería un parámetro nuevo y chico. Recomiendo la lista
real: es lo que el sitio tiene y nadie más, y ya suena.

**Vestido.** Borde y sello en la tinta de *Lobo suelto* (mitología según `D-19`): el disco
que se presentó esas noches. La cinta, el giro de −0,6° y la estampa hueca quedan iguales.

**Qué hay que tocar para que el botón ande.** Las listas de "En vivo" se anclan hoy como
`lista-1`, `lista-2`… por posición (`en-vivo.astro`, línea 63): un enlace desde el portal se
rompería al cargar una lista más. Hace falta un ancla estable por fecha (`lista-1993-11-19`)
y que el `<details>` al que apunta el `#` se abra solo (`:target` no abre un `details`; lo
hace la isla `en-vivo.ts` al cargar). Dos cambios chicos en la página, con test.

## 5. Diciembre: CINCUENTA, con el rótulo LEYENDA a la vista

Este es el que hay que decidir con cuidado, por eso va separado. Lo que circula como
efeméride firme es que la banda se fundó el **28 de diciembre de 1976**, Día de los Inocentes.
La ficha `la-formacion` lo tiene así: *"nunca confirmada ni desmentida del todo"*, rotulado
`leyenda`. En diciembre de 2026 eso son **cincuenta años**, y la prensa lo va a decir sin
rótulo. El sitio puede decirlo **con** rótulo, que es exactamente para lo que existe `D-14`:
una leyenda rotulada como leyenda es contenido de primera.

| Pieza | Texto | Registro |
|---|---|---|
| Sello | **CINCUENTA** | 1 — en letras, no en cifra: la letra de la banda no tiene números |
| Rótulo | `LEYENDA` | 3 — el mismo sello de goma de la Redondopedia (◆ + palabra), pegado al lado de la estampa; **no se disfraza de disco** (`diseno-marca.md`) |
| Estampa | `EL 28 CUMPLE 50` · `HOY CUMPLE 50` · `CUMPLIÓ 50 EL 28` | 3 |
| Canta | **Soplá las velitas, por las dudas.** | 1 — seis palabras, un objeto, y la duda adentro |
| Cuenta | Circula que la banda nació el 28 de diciembre de 1976, Día de los Inocentes. Nadie lo confirmó ni lo desmintió del todo, y acá va como lo que es. | 2 — es la prosa de la ficha, acortada |
| Almanaque | `2 · Obras · 1989` — `8 y 9 · Concordia · 1995` — `16 y 17 · Huracán · 1994` — `28 · La formación · 1976` | 3 — el taco del 28 lleva el ◆ de leyenda; los otros tres son `hecho` |
| Botón | **LEÉ CÓMO EMPEZÓ** | 1 — a `/redondopedia/la-formacion/` |

**Vestido.** *Gulp!*, que es historia en la mezcla de `D-19` y el primer disco.

**Lo que no hace:** no dice "la banda cumple 50". La estampa y el sello dicen el número; el
rótulo dice de qué clase de número se trata; la que cuenta lo explica. Si el usuario prefiere
no poner una leyenda en el centro de un afiche, la alternativa es Obras 89 como cumpleaños
("EL 2 CUMPLE 37") y la fundación como un taco más del almanaque, con su ◆. Pierde la gracia
del 28 pero no pierde nada de honestidad.

## 6. Cómo se construye: lo que cambia respecto de `D-49`

- **`lib/sitio/oktubre.ts` pasa a `lib/sitio/almanaque.ts`.** `discosDeOktubre()` se vuelve
  `fechasDelMes(fichas, mes)`: lee discos **e hitos**, toma el año de la etiqueta cuando el
  valor no lo trae ("Fechas 1993" = "19 y 20 de noviembre") y devuelve los tacos. `esOktubre()`
  pasa a `mesDe(fecha)`, que devuelve el nombre del mes. `cumpleDelDia()` no cambia.
- **La tabla del almanaque** (en `copy.ts`, como `OKTUBRE` hoy): por mes, el sello, la ficha
  y el dato que hacen de cumpleaños, la que canta, la que cuenta y el botón. **Un test falla
  si la ficha del cumpleaños ya no tiene ese dato con el rótulo que el afiche dice** (`hecho`
  para los tres meses, `leyenda` para el 28 de diciembre): es la regla 3 de `D-49` extendida.
- **La cabeza del portal** pone `data-mes="<mes>"` con el nombre del mes, no solo octubre.
  `sitio.css` muestra `.afiche[data-para-mes="noviembre"]` cuando `:root[data-mes="noviembre"]`.
  Los cuatro afiches se imprimen siempre (unos 2 KB de HTML cada uno) y se ve uno o ninguno.
  `.oktubre` pasa a `.afiche` con modificador por mes; la clase vieja no queda.
- **Las fuentes.** *Oktubre* conserva el calco. Los otros tres sellos van en
  `--fuente-marca-firma` (Patricio Rey Fan), que desde `D-65` tiene tildes y signos.
  `fuentes.test.ts` ya vigila que nadie le pida al calco una letra que no tiene.
- **La voz.** `voz.test.ts` líneas 384–386 auditan `OKTUBRE.sello`, `.canta` y `.jugar`: se
  extiende a los cuatro meses. Botones en imperativo, sin suspensivos, sello de ≤ 8 palabras.
- **El contraste.** Todas las tintas que se usan como texto ya tienen su par sobre `--fondo`
  en `contraste.test.ts` (*Momo*, *Último bondi*, *Lobo suelto*, *Gulp!*). No entra ningún
  hex nuevo.
- **El lienzo primero** (`diseno-marca.md`, el circuito): `D-49` dejó anotado que el afiche
  nunca llegó a las hojas 08 y 09. El almanaque es la ocasión de pegarlo: una hoja con los
  cuatro afiches, el mismo componente con cuatro tintas y dos letras. Eso es `UX-40`, de
  `experiencia`, y va antes del código.

## 7. Lo que cuesta, dicho antes

- **El portal se alarga.** `D-49` midió ~370 px de afiche a 375×812 y lo aceptó como "un mes
  por año". Con el almanaque son cuatro. `UX-25` peleó por un portal corto; esto lo alarga un
  tercio del año. La alternativa —un afiche más chico fuera de la semana del cumpleaños— la
  dejo escrita y no la recomiendo: es un segundo componente para ahorrar una pantalla.
- **Cuatro juegos de texto que mantener** en vez de uno. Son veinte líneas en `copy.ts`.
- **El ancla de "En vivo"** (sección 4) es un cambio fuera del portal.
- **Lo que no cuesta:** ni una ficha nueva de `investigador` (todo lo que se usa ya está
  rotulado), ni un hex, ni una fuente.

## 8. Lo que decide el usuario

1. **¿Almanaque, o solo noviembre?** Recomiendo el almanaque: el mecanismo es el mismo y lo
   que se escribe por mes son veinte líneas.
2. **Noviembre: ¿Huracán de cumpleaños, o los discos?** Recomiendo Huracán (sección 4).
3. **Diciembre: ¿la leyenda de los cincuenta en el centro, con rótulo?** Recomiendo que sí,
   con la alternativa de Obras 89 escrita en la sección 5.
4. **El botón de noviembre: ¿la lista real que suena, o el juego de armar?** Recomiendo la lista.

Con el OK, el orden es: `UX-40` en el lienzo (hoja 08/09) → `copy.ts` y `almanaque.ts` con
tests → `sitio.css` → el ancla de "En vivo" → `D-84` escrita → PR. Entra en una ráfaga.

## 9. A quién le toca qué, cuando se confirme

- **`experiencia`** — `UX-40`: el almanaque en el lienzo, el afiche como componente de cuatro
  tintas, y el reparto de registros por pieza (que acá está propuesto, no fijado).
- **`contenido`** — leer y corregir las ocho líneas que cantan y cuentan (secciones 4 y 5);
  el glosario de `CNT-02` manda sobre lo que escribí.
- **`investigador`** — nada nuevo. Si alguien quiere el Lozanazo o Poli (15-nov-1950, `N-038`)
  con más peso, lo primero sería ponerle fecha a la ficha de Poli, que hoy no la tiene.
- **`difusion`** — la semana del 17 al 20 de noviembre merece su `DIF-`: el calendario tiene
  posteos hasta el 7 de noviembre y nada después.
- **`orquestador`** — `T-520` en adelante, si se corta en más de una tarea.
