# CNT-28 — Las tres bandas de después de la separación, en la Redondopedia

- **Rol dueño:** `contenido`
- **Fecha:** 2026-10-01
- **Estado:** cargado en `src/data/redondopedia.json`. **No corrido:** `contenido` no tiene
  `Bash` (`D-12`); el comando está en la sección 6 y lo corre `revisor`, `orquestador` o el hilo
  principal. Hasta que corra, el estado honesto es "escrito, sin verificar a máquina".
- **Consume:** `BR-34` y `BR-35` (`Docs/PRODUCTO/PRD-redondopedia.md`, criterio de
  aceptación), `RES-47` (`Docs/INVESTIGACION/INV-47-bandas-post-separacion.md`), `RES-04` (la
  muerte del Indio, para el segmento grave), `RES-20` (los 105 temas, para decir qué no es de
  Patricio Rey), `RES-64.1` y `RES-64.2` (`INV-60`, ver 5.3), `CNT-04` y `CNT-06` (la vara de las
  muertes en prosa), `.claude/rules/voz-ricotera.md` (§5 y §6), `D-14`, `D-17`.
- **Produce:** tres artículos `concepto` (`los-fundamentalistas`, `skay-y-los-fakires`,
  `los-decoradores`) y cinco cambios de enlace. Redondopedia: **38 artículos**, el piso de `BR-34`.
- **No hago acá:** schema, plantilla, `SLUGS_GRAVES`, el `assert` de `redondopedia.test.ts`
  que `BR-34` §6 ofrece (es de código) ni ningún ítem de juego con este material (`BR-34` §5).

## 1. Qué escribí

| Slug | Título | Segmentos de cuerpo | Líneas de `datos` | Registro |
|---|---|---|---|---|
| `los-fundamentalistas` | Indio Solari y los Fundamentalistas del Aire Acondicionado | 6 | 11 | 2 en los tres primeros segmentos; **3 en los tres últimos** (muerte, homenaje, estado) |
| `skay-y-los-fakires` | Skay y los Fakires | 6 | 7 | 2; el segmento de estado en 3 |
| `los-decoradores` | Los Decoradores (La Kermesse Redonda) | 6 | 8 | 2; el segmento de estado en 3 |

El resumen de `los-decoradores` dice cuál es el nombre de la banda y cuál el del formato en sus
primeros 150 caracteres (la portada corta a 147 y agrega "…"): "Decoradores" empieza en
el carácter 5 y "Kermesse" en el 46. Los resúmenes de las otras dos no repiten el título, que
la portada ya imprime encima.

**Los cinco cambios de enlace**

| Artículo | Qué cambió | Rótulo y ficha |
|---|---|---|
| `la-separacion` | Segmento nuevo al final, "la puerta": nombra las tres bandas, dice que dos son de los fundadores y una de acompañantes, nombra los dos nombres de Los Decoradores y cierra con "Ninguna es Patricio Rey". Sin años: cada dato vive en el artículo de la banda | `hecho`, `RES-47` |
| `indio-solari` | El texto plano del último segmento pasa a enlace. Segmento nuevo de una oración, antes del último recital: banda propia desde 2004 | el nuevo, `hecho`, `RES-47`; el enlace no cambia el rótulo de `RES-04` |
| `skay-beilinson` | Segmento nuevo de dos oraciones antes de "Skay está vivo y activo": banda propia, 2002, nombre actual desde 2012 | `hecho`, `RES-47` |
| `muerte-del-indio` | **Solo** el envoltorio `[[los-fundamentalistas\|Los Fundamentalistas]]` sobre el nombre que ya estaba en el tercer segmento. Ni una palabra más. La línea de `datos` ("Por video, en un concierto de Los Fundamentalistas") queda como estaba: un `[[…]]` en `datos` se imprime crudo | sin cambio |
| `semilla-bucciarelli` | Segmento nuevo de una oración, al final: integra Los Decoradores (con el otro nombre entre paréntesis) | `hecho`, `RES-47` |

## 2. Cómo rotulé cada afirmación

Todo lo de `datos` y casi todo el cuerpo es `hecho` con `RES-47` en el punto del texto. Lo que
no es `hecho` simple, o lleva una ficha distinta:

| Dónde | Afirmación | Rótulo | Ficha | Por qué así |
|---|---|---|---|---|
| `los-fundamentalistas`, segmento 4 | El Indio murió el 5 de junio de 2026 | `hecho` | `RES-04` | Fecha y enlace; no repite causa ni lugar, que `muerte-del-indio` ya rotuló como versiones de prensa |
| `los-fundamentalistas`, segmento 5 | El recital del 6 de junio de 2026 en Comodoro Rivadavia se hizo, se transmitió en vivo y se convirtió en homenaje | `hecho` | `RES-47` | `BR-35` §3.3 |
| `los-fundamentalistas`, segmento 6 y `datos` | Recital anunciado en Tucumán para el 10 de octubre de 2026 | `hecho` **de que está anunciado** | `RES-47` | El texto dice "anunciado" y "este artículo no confirma que se haya hecho". Lo que se sabe es la fecha reportada, no el recital |
| `skay-y-los-fakires`, segmento 4 | Nómina de 2012 (Reyna, Quartero, Lecumberry, Espíndola) y la más reciente (Rosson, Sánchez) | **`leyenda`** | `RES-47` | `RES-47` las marca no verificadas. El texto dice que son dos notas, que no coinciden y que ninguna está confirmada. Precedente: el segundo segmento de `muerte-del-indio` |
| `skay-y-los-fakires`, `datos` "Integrantes" | "Sin nómina verificada: las fuentes relevadas no coinciden entre sí" | `hecho` | `RES-47` | No es una lista: es el estado de la evidencia, y es verdad |
| `los-decoradores`, segmento 3 y `datos` | Año de formación: **2016** (Wikipedia, ellitoral.com; fusión de SemiDawi y The Comando Pickless) y **2015** (ciudad.com.ar, nota del 2/6/2025, "cumple 10 años") | `hecho` en paralelo, una línea de `datos` por versión y la fuente de cada una dentro de la oración | `RES-47` | `BR-35` §1, criterio 5 de `US-05`. No se promedia ni se elige. "2015" es aritmética sobre un título; el texto lo dice ("lo que da 2015") |
| `los-decoradores` | "Kermesse Redonda" se usó desde 2018 como nombre de presentación y es el formato de gira | `hecho` | `RES-47` | Wikipedia vía `RES-47` |
| `los-decoradores` | No se encontraron discos propios | `hecho` **de la búsqueda** | `RES-47` | `RES-47` dice "no encontrado", no "confirmado que no existe"; el texto dice las dos cosas, y que no hubo búsqueda dedicada de un registro en vivo |
| `skay-y-los-fakires`, estado | Gira 2026 con fechas del 24 de enero al 7 de agosto | `hecho` | `RES-64.2` (consulta del 11/9/2026) | Ver 5.3 |
| Los tres, estado | Estado con fecha de consulta | `hecho` | `RES-47` | `BR-35` §2: "al 22 de agosto de 2026", nunca "sigue en actividad" a secas |
| Los tres, "ninguno es de Patricio Rey" | Los discos de estas bandas no están entre los diez de la banda ni los temas entre los 105 | `hecho` | `RES-20`, `RES-47` | Verdadero por definición (los 105 son los de los diez discos), no por una búsqueda nueva |

No hay ningún `testimonio` en los tres artículos. Ninguna ficha trae una voz con nombre y apellido.

## 3. Qué quedó afuera, y por qué

**Por no verificado (`BR-35` §1):**
- La nómina de Skay y los Fakires como `hecho`. Entra como `leyenda`, ver arriba.
- "Los Fakires ya existía en 1997". No aparece en ninguno de los tres artículos (verificable
  con grep). Tampoco aparece una frase que lo aluda: `RES-47` se contradice sobre si es un error
  detectado o un hueco sin cerrar, así que no afirmo ninguna de las dos cosas.
- "La banda sigue en actividad como homenaje" y "el Indio ya participaba solo virtualmente":
  inferencias de `investigador`, no fichadas. El estado de los Fundamentalistas dice lo que
  hay (recital anunciado, sin anuncio de disolución), **no dice "en actividad"**. Los de las
  otras dos bandas sí, porque sus fuentes lo dicen de forma directa.
- La frase de la cobertura de 2026 sobre mantener viva "la llama". `RES-47` la marca como dato
  cultural sin cita textual de la banda. No se le atribuye a nadie.
- Lo posterior al 10 de octubre de 2026. No hay ficha.

**Por la regla del registro 3 y `BR-35` §3:**
- **La cita de la banda** ("no va a ser el concierto que habíamos pensado…"). `BR-35` §3.4 la deja
  a mi criterio. La saqué: la ficha no dice quién habló (no puede ser `testimonio`), y con la
  fecha y el homenaje alcanza. Entrarla como `hecho` de que "la banda dijo" habría sido
  hablar por ellos con la voz de un muerto reciente, que es la línea de `voz-ricotera` §1.
- La emoción del recital ("lágrimas, abrazos y ovación" es un título de nota, no un dato).
- La última aparición del Indio por video: no se copia; la nombra `muerte-del-indio`.
- Olavarría: ni un enlace; no hacía falta.
- Causa y lugar de la muerte.

**Por mi criterio, no por falta de verificación:**
- **Dani Castro (bajo) y Daniel Colombres (batería)**, 2002–2007. `RES-47` los trae como
  verificados, pero son una lista de integrantes de Skay y los Fakires y el criterio de `BR-35`
  §4 pide que **ninguna** lista de integrantes de ese artículo vaya como `hecho`. Los dejé fuera
  para cumplirlo al pie de la letra. Si `producto` quiere sumarlos, es una oración `hecho`
  más en el segmento de las etapas; no toca ningún enlace.
- Una leyenda inventada para ninguna de las tres. `RES-47` no trae ninguna (`BR-14`, punto 4).
- Años de formación en la puerta de `la-separacion`: cada dato vive en un solo artículo.

## 4. Decisiones de tono

- **Los tres de la banda en registro 2, el rótulo en 3.** Frases cortas, "pero" para arrancar por
  el medio ("Pero el nombre no fue siempre ese"), la duda dicha en voz alta ("la nómina de hoy no
  está fichada", "acá no se elige una"). Sin *che*, *viste*, *posta*; sin "los fans" (el sitio
  los llama "la gente" y acá no hizo falta nombrarla); sin épica; sin imagen de utilería.
  **Cero jerga**: en un artículo de hechos de agenda, la jerga era relleno.
- **Ningún suspensivo.** El registro 2 los permite al cierre de un párrafo que cuenta; en tres
  artículos de fichas de banda no había nada que dejar abierto salvo lo que ya se declara abierto.
- **Los segmentos de la muerte y el homenaje, y los de estado, en registro 3**: seco, sin
  imagen, sin jerga, sin suspensivos, sin adjetivo de emoción. Son segmentos cortos y propios,
  no oraciones metidas en un párrafo largo, para que se note dónde cambia la voz.
- **"Recital", no "show"; "en vivo", no "streaming"; "mercadería ricotera", no "merchandising"**
  (`D-17`). `RES-47` usa "show" y "merchandising": son las palabras de la ficha, no las del sitio.
- **"Es banda propia de uno de los fundadores"**, la frase de `RES-47` y de `BR-34`, y no
  "continuación del Indio": después del 5 de junio de 2026 "continuación" lo presenta como
  heredero, y `BR-35` §3.5 lo prohíbe.
- **La línea que no se cruza**, en cada artículo: ninguno presenta un tema de estas bandas como de
  Patricio Rey. Los Decoradores tocan el repertorio de los Redondos, y el artículo lo dice así:
  "la música es de los Redondos; el grupo es otro".

## 5. Tres cosas que conviene que `revisor` mire con atención

1. **El segmento `leyenda` de la nómina de Skay y los Fakires.** Nombra a seis personas con vida
   propia, rotulado como lo que es. Si `revisor` prefiere que no se nombren, se borra ese
   segmento entero: el resumen, el `dato` "Integrantes" y los enlaces siguen valiendo.
2. **"hecho" para la versión 2015 de Los Decoradores.** Lo que es hecho es que ciudad.com.ar
   titula "cumple 10 años"; el 2015 es la cuenta. Está dicho en la oración, pero el chip de la
   plantilla solo dice "hecho · RES-47".
3. **Usé una segunda ficha en el estado de Skay y los Fakires.** `RES-64.2` (`INV-60`, consultada el
   11 de septiembre de 2026, seis fuentes coincidentes) es posterior y más sólida que lo que
   `RES-47` tenía del estado de Skay. El segmento lleva las dos fechas de consulta, cada una con su
   ficha, y la de agosto sigue siendo la de `BR-35` §2. También cité `RES-64.1` para "arranca en
   2002" y "canta, compone y toca la primera guitarra". **No usé nada más de `RES-64`**, y en
   particular nada de Poli ni de la sociedad (`RES-64.12` baja a "reportado" lo de Erks S.A.).

## 6. Cómo verificar (no lo corrí)

```
node --test src/lib/redondopedia.test.ts src/lib/voz.test.ts src/lib/sitio/oktubre.test.ts
```

Cubren: grafo de `BR-09` (cero huérfanos, cero callejones, enlaces que existen), `hecho` con ficha
`RES-` y `testimonio` con `quien` (`BR-08`), que `discosDeOktubre` siga contando 10 discos (los
tres artículos son `concepto`, no suman), y la voz de las pantallas. **`voz.test.ts` no lee los
artículos de la Redondopedia**: el tono de estos tres lo audita el oído de quien revisa.

Y el script de `BR-34` §6, copiado tal cual en el reporte de la sesión. El resultado esperado es
`ok` en las siete aristas, `total 38 | concepto 7 | disco 10`, y los tres `slug | tipo | título`
de `BR-34` §1, con "Decoradores" y "Kermesse" en los primeros 150 caracteres del resumen del
tercero. Además, `npm test` completo y `pisos.test.ts` (piso `>= 35`, ahora 38).

**Criterio de `BR-35` §4, uno por uno:**

| Criterio | Dónde se cumple |
|---|---|
| Cada nombre como en `BR-34` §1 y §2; el resumen de Decoradores dice cuál es cuál | Títulos; resumen y segmento 1 de `los-decoradores` |
| Los dos años de Decoradores, cada uno con su fuente; "1997" en ninguno | Segmento 3 y dos líneas de `datos`; grep sin resultados |
| Ninguna lista de integrantes de Skay y los Fakires como `hecho`; el texto dice que no está cerrada | Segmento 4 (`leyenda`) y la línea "Integrantes" |
| "Estado" con fecha de consulta; el 10 de octubre como anunciado | Los tres; `los-fundamentalistas`, segmento 6 y `datos` |
| Muerte y homenaje: ningún `testimonio`, ni jerga, ni suspensivos, ni emoción, ni causa ni lugar | `los-fundamentalistas`, segmentos 4 a 6 |

## 7. Pendiente, con dueño

Nada bloquea; todo entra con la duda declarada (`D-14`). Si se quiere cerrar, es ficha nueva a
`investigador`:

- Año de formación de Los Decoradores (2015 o 2016): una nota fundacional fechada o una
  declaración de Semilla Bucciarelli o Sergio Dawi.
- Nómina vigente de Skay y los Fakires: fanpage oficial o nota de gira reciente con la lista.
- **Si se hizo el recital de Tucumán del 10 de octubre de 2026** y qué pasó con los
  Fundamentalistas después. El segmento de estado de ese artículo caduca ese día. Es el único
  dato de los tres que tiene fecha de vencimiento conocida.
- Si Los Decoradores editaron un registro en vivo propio.

Para otros roles (no los toqué, el brief limita mi escritura):

- `experiencia`: la plantilla imprime `concepto` sobre el título de una banda; `BR-34` §1 ya lo
  dejó señalado. Y `SLUGS_GRAVES`: coincido con `producto`, **no** entra `los-fundamentalistas`
  (es una banda viva y solo tres segmentos son graves).
- Hilo principal: las tres líneas de `assert` de `BR-34` §6 y la actualización de `ESTADO.md`
  (35/38 pasa a 38/38 una vez que corran los comandos).
