# CNT-42 — Redondopedia: Sidotti, Dawi, los temas que no están en los discos, y la corrección de Semilla

- **Fecha:** 2026-10-16 · **Pedido:** del usuario, textual: *"hacé que contenido escriba los artículos nuevos de la Redondopedia con INV-300, empezando por Sidotti, Dawi y los inéditos."*
- **Estado:** entregado en `src/data/redondopedia.json`. No pude correr nada (`D-12`).
- **Consume:** `INV-300` (en especial "Cómo se leyó, y cuánto vale cada fuente" y `RES-301`), `RES-312`, `RES-318`, `RES-319`, `RES-320`, `RES-321`, `RES-322`, `RES-328`, `RES-329`, `RES-333`, `RES-337`, más `RES-20` y `RES-47` donde el banco ya los citaba. `.claude/rules/voz-ricotera.md`, `.claude/rules/contenido-json.md`, `D-14`, `CNT-06` (registro 3 para Bulacio).
- **Regla aplicada:** lo que solo sale de la wiki de fans va `leyenda`; lo que confirma Wikipedia o el memoir sube a `hecho` o `testimonio`. Ningún `hecho` descansa en la wiki de fans sola.

## Verificación (la corre `revisor` o el hilo principal)

```
node --test src/lib/redondopedia.test.ts
node --test src/lib/correccion/armar.test.ts src/lib/pisos.test.ts
npm test
```

`redondopedia.test.ts` pide: resumen ≥ 80 caracteres, todo `hecho` con `RES-`, todo `testimonio` con `quien`, enlaces que existan, ≥ 2 salientes y ≥ 1 entrante por artículo, y **exactamente 10 artículos `disco`**. Revisé a mano los cinco primeros puntos; el JSON lo escribí a mano, así que conviene que alguien confirme que parsea.

## 1. `walter-sidotti` (persona)

| Segmento | Rótulo | Ficha | Nota |
|---|---|---|---|
| Batería 1987–2001, formación de cinco, período que abarca de *Un baión* (1988) a *Momo sampler* | hecho | `RES-318`, `RES-337` | Solo el período es hecho (Wikipedia). "Abarca los discos" sale de las fechas, no de que un crédito lo diga |
| Nació el 4-1-1961; recomendado por Crook (La Favorita); audición; primer recital 15-5-1987 en Caras + Caras | leyenda | `RES-318` | Abre diciendo que hay una sola fuente y que Wikipedia en español no tiene artículo suyo (registro 2, declara la duda) |
| El Piojo Ábalos dejó el puesto a fines de 1986 | leyenda | `RES-321` | Solo wiki de fans |
| Después de 2001 (La Favorita, Heroicos Sobrevivientes, The Comando Pickless, Los Decoradores 2016–2018); *La pajarita pechiblanca* 2013; Gualeguaychú 2014 | leyenda | `RES-318`, `RES-322` | |
| «Caballito valiente, triturador de tambores enojados», en el sobre de *¡Bang! ¡Bang!* | leyenda | `RES-318` | Comprobable con el disco; sigue siendo leyenda porque la ficha lo toma de la wiki |

Dos datos de la ficha de datos van `leyenda` con su `fuente`: nacimiento y primer recital.

## 2. `sergio-dawi` (persona)

| Segmento | Rótulo | Ficha |
|---|---|---|
| Saxo 1987–2001, formación de cinco, nacimiento 20-10-1955 en San Telmo | hecho | `RES-319`, `RES-337` |
| Padres (Enrique Dawi, María Teresa Corral, La Cornamusa), nueve años en España | hecho | `RES-319` |
| Dosaxos2 (1985), Parakultural 1986, lo vieron Skay y Poli | hecho | `RES-319` |
| Después de 2001: Dawi y los Estrellados, SemiDawi, Los Decoradores desde 2016, Kermesse Redonda desde 2018 | hecho | `RES-319`, `RES-47` |
| El solo de *Ji ji ji*: el Indio se lo atribuye, Skay lo niega y cuenta el balcón con Hendrix | leyenda | `RES-319` |

Las dos versiones del solo van como **leyenda** y no como dos testimonios: la ficha dice que Wikipedia las recoge, pero no trae la cita de primera mano de ninguno de los dos, y `testimonio` pide ficha del que lo dijo (`D-14`). El artículo lo dice. Vínculos a `los-decoradores`, `semilla-bucciarelli` y `ji-ji-ji` en el cuerpo.

Sobre el año de Los Decoradores: la ficha da 2016 (Wikipedia) y `los-decoradores` ya explica que otras fuentes dicen 2015. El artículo de Dawi dice 2016 y manda a ese artículo para la discrepancia; no elige.

## 3. `temas-fuera-de-los-discos` (concepto) — "Los temas que no están en los discos"

Título de ocho palabras. Slug elegido por mí.

| Tema | Rótulo | Ficha |
|---|---|---|
| 105 temas en diez discos de estudio | hecho | `RES-20` |
| Existió otra discografía en casetes piratas; la wiki los llama "inéditos"; cómo se rotula todo lo que sigue | leyenda | `RES-328` |
| *Honolulu* es de antes de los Redondos, "caldo prebiótico" | testimonio (Indio, memoir) | `RES-328` |
| *Honolulu* es un blues; Fenton la da como la primera lista; volvió el 12-8-1994 | leyenda | `RES-328` |
| Tito Fargo: *Mi genio amor*, *Rodando*, *El regreso de Mao* (1984–85) | leyenda | `RES-328`, `RES-322` |
| *Mi genio amor*, "la favorita de muchos" | testimonio (**Marcelo Figueras**, el entrevistador del memoir; corregido por el hilo principal el 2026-10-16: en la p. 279 es la entrada de la pregunta, no una respuesta del Indio) | `RES-328` |
| *Mi genio amor* dedicada a Walter Bulacio, octubre de 1991 | leyenda, registro 3 seco | `RES-328` |
| *De estos polvos, futuros lodos*: letra en el sobre de *Oktubre*, sin canción | testimonio (Indio, memoir) | `RES-328` |
| Demos RCA, abril de 1982, cinco temas, coros de las Bay Biscuits en *Superlógico* | hecho | `RES-312` |
| *Nene nena* de 1982 a los noventa; Gualeguaychú 2014 | leyenda | `RES-328` |
| El popurrí de 1985–86 (seis títulos) | leyenda | `RES-328` |
| El Indio nombra tres de esos títulos junto a *Honolulu* | testimonio (Indio, memoir) | `RES-328` |
| *Mejor no hablar de ciertas cosas*: Luca se llevó la letra, no le molestó, la de Sumo le parece mejor | testimonio (Indio, memoir) | `RES-329` |
| Sumo la grabó en *Divididos por la felicidad* (1985) | hecho | `RES-329` |
| Los Redondos la usaban en pruebas de sonido | leyenda | `RES-329` |
| *Quema el celo* y *Rock de las abejas*, publicados en septiembre de 2021, de las sesiones de *Luzbelito* | hecho | `RES-328` (prensa, ver pedido 3) |
| Las dos se tocaban en vivo desde los ochenta | leyenda | `RES-328` |
| *En directo* (1992) y *Blues del noticiero* | hecho | `RES-333` |
| *Reina Momo (La Tomatita)*: dicho por la wiki; la prensa no lo encontró | leyenda | `RES-328` |
| *Las mañanitas del Rey David*, Gimnasia de La Plata, 24-6-1989 | leyenda | `RES-328` |
| Lista de títulos sueltos (*Crazy jazz*, *Kazachok*, *¡Oh mami!*, etc.) | leyenda | `RES-328` |

El quinto dato de la ficha de datos ("El inventario de inéditos") va `leyenda`; el cuarto ("Una letra del Indio en un disco ajeno") va `testimonio`, porque la autoría es lo que él cuenta.

## 4. Corrección en `semilla-bucciarelli`

Fuente `RES-337`, rótulo `hecho`. Cambié tres cosas y nada más:

- **Resumen:** ya no dice "bajista de la formación estable desde 1987". Dice desde 1982 hasta la ruptura, todos los discos de estudio, y desde 1987 la formación de cinco.
- **Datos:** el dato "En la formación estable / Desde 1987 hasta la ruptura" (`RES-05`) se reemplazó por dos: "En la banda / Bajo desde 1982, en todos los discos de estudio" y "En la formación de cinco / Desde 1987 hasta la ruptura, con Sidotti y Dawi", los dos con `RES-337`.
- **Primer párrafo del cuerpo:** entró en 1982 en lugar de Daniel «Pepe» Fenton, tocó de *Gulp!* (1985) a *Momo sampler* (2000), y lo que empieza en 1987 es la formación de cinco. Ahora enlaza a Sidotti y a Dawi.

Los demás párrafos y datos no se tocaron. `BR-34 §3` sigue cumplido (el cuerpo enlaza a `los-decoradores`).

## 5. Lo único que toqué fuera del pedido

- `oktubre`: agregué `temas-fuera-de-los-discos` a su `veaTambien`. Sin eso el artículo nuevo queda **huérfano** y `BR-09.1` falla. Es la entrada más natural (*De estos polvos* vive en el sobre de ese disco). Sidotti y Dawi se sostienen solos: los enlaza `semilla-bucciarelli`, y ellos se enlazan entre sí.

## 6. Lo que dejé afuera, y por qué

- **«España (2003–2005)»** en el recorrido de Sidotti: la ficha lo lista junto a La Favorita sin aclarar si es un grupo o un lugar. No lo interpreté.
- **«De Basilio, otro guitarrista»** (sobre *El super sport*): la ficha no deja claro si lo dice el memoir o si es glosa del investigador. Quedó afuera.
- **El lugar de *Honolulu* en 1994** (Go! Disco): la ficha da el nombre de la sala sin ciudad para esa fecha, y el nombre lleva un signo de exclamación que el sitio evita. Va solo la fecha.
- **Citas textuales** («caldo prebiótico», «la favorita de muchos», «caballito valiente…»): las dejé como la ficha las pone. «La favorita de muchos» va dicha sin comillas porque no sé si es literal.
- **De Semilla:** nació el 3-7-1959 en Villa María, Ricardo Soulé, la pintura y el arte de *Cordero atado* (`RES-337`, leyenda). Son material para otro ciclo; el pedido era la corrección.
- **De la ficha, para otros artículos:** Olga Sudorova (`RES-332`) completa `ji-ji-ji`; los nombres de antes (`RES-330`); lo que se oye en los discos (`RES-331`); las noches sin el Indio (`RES-313`) y Pan Caliente (`RES-312`) como `hito`; Willy Crook, Fargo, Ábalos, Jolivet, Mufercho y Symns como `persona`. Siguen sin escribir.

## 7. Pedidos a `investigador` (ninguno bloquea nada)

1. **Memoir, `Recuerdos que mienten un poco`:** confirmar la redacción exacta de «caldo prebiótico» (PDF p. 118), «la favorita de muchos» (p. 279) y el pasaje de *Mejor no hablar de ciertas cosas* (p. 262), y si «de lo de Poli» y «de Basilio» son del Indio.
2. **`RES-318`:** una segunda fuente para Sidotti (el primer recital del 15-5-1987 choca con `RES-301`: Crook sale en mayo o noviembre de 1987). Hoy todo lo suyo, salvo el período, es una sola fuente.
3. **`RES-328`, prensa sin abrir:** abrir *Forbes Argentina* y *Tiempo Argentino* sobre *Quema el celo* y *Rock de las abejas*. Los cargué como `hecho` porque la ficha los rotula así, y el texto dice que lo contó la prensa; si la nota no sostiene "septiembre de 2021" o "sesiones de *Luzbelito*", baja a leyenda.
4. **`RES-319`:** la cita primaria del Indio y de Skay sobre el solo de *Ji ji ji*. Si aparecen, esas dos frases pasan a `testimonio` con ficha.
5. **«España» de Sidotti** (ver arriba) y la sala del 12-8-1994.

## 8. Para el hilo principal y para `arquitectura`

- **No hizo falta tocar código.** `ORDEN_PORTADA` es por tipo; los tres artículos aparecen en la portada solos (`persona` bajo `historia`, `concepto` bajo `mitologia`).
- **`En directo` no puede ser un `disco`.** `redondopedia.test.ts` fija en exactamente 10 los artículos `disco` (`BR-34 §5`, para que el afiche cuente diez). `INV-300` lo propone como "disco número 11": hace falta una decisión de producto y de arquitectura, o alcanza con que viva como `concepto` o dentro de este artículo, donde hoy está. No dejé propuesta en `Docs/SUGERENCIAS/` porque nadie me la pidió.
- **Entradas que faltan, sin tocarlas:** `la-formacion` y `los-decoradores` nombran a Sidotti y a Dawi sin enlazarlos. Es una línea en cada uno; no lo hice para no salir del pedido.
