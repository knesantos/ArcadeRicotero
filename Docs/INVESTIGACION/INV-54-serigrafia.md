# INV-54 — Cómo se imprime una serigrafía de verdad: orden, registro, y qué hay documentado del taller de Rocambole

> Ciclo 12, `T-196`, investigado el 2026-09-01 por `investigador` y pegado en esta ruta por
> el hilo principal el 2026-09-02, como manda el README de esta carpeta (`investigador`
> devuelve hallazgos, no escribe archivos). Responde `ORQ-plan-ciclo-12.md`: orden de las
> pasadas, registro, por qué la clave va última, con URL y fecha — y qué hay sobre el
> proceso propio de Rocambole con las tapas, si existe.
>
> Consume: `RES-06` (`INV-02-banda-cultura-estetica.md`, técnica de Rocambole), `RES-37`
> (paletas medidas de las tapas, en `tokens.css`). Numeración: `RES-54`, el único número
> reservado para el ciclo 12 en `Docs/IDS.md`.
>
> **Aviso de método.** La primera mitad responde una pregunta de oficio —cómo se imprime
> una serigrafía en general— con fuentes técnicas de la industria, no material ricotero.
> La segunda busca el método propio de Rocambole y dice qué no encontró. Hubo dos rondas
> de búsqueda (la ficha original y una segunda tras la refutación adversarial); se listan
> las fuentes de las dos porque no se contradicen y se refuerzan.

---

## RES-54 — Orden de pasadas, registro, y por qué la tinta clave va última

**La línea que el taller (`T-199`) necesita, y la ficha respalda:** clara → media → clave
(oscura, negro, detalle), **la clave siempre última**. Es la convención fotográfica y de
cuatricromía de reproducción, no la del bloque-contorno-primero de la xilografía
(`RES-54.8`).

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-54.1` | En serigrafía multicolor de proceso fotográfico el orden va **siempre de tinta clara a tinta oscura** | https://www.mrprint.com/blog/848-determine-print-order | 2026-09-01 | verificado |
| `RES-54.2` | Secuencia concreta sobre soporte claro: blanco (si aplica) → amarillo → magenta → cian → **negro/clave, siempre último** | https://www.mrprint.com/blog/848-determine-print-order | 2026-09-01 | verificado |
| `RES-54.3` | Por qué la clave va última: mezclar las otras tintas para lograr negro es impreciso y exige un registro imposible de sostener en detalle fino; una tinta clave propia da contorno fiel y **es la que sostiene el registro de las demás**. "Key plate" es el término del que sale la K de CMYK | https://www.exposign.com.ar/k-el-negro-de-cmyk/ · https://en.wikipedia.org/wiki/Key_plate | 2026-09-01 | verificado |
| `RES-54.4` | No hay consenso total sobre el orden interno entre cian, magenta y amarillo entre las fuentes consultadas, **pero sí consenso absoluto en que el negro/clave va al final**, en todas las cruzadas | https://www.mrprint.com/blog/848-determine-print-order y cruce técnico | 2026-09-01 | verificado |
| `RES-54.4b` | Matiz que impide leerlo como ley física: el mismo blog de industria (M&R, fabricante de equipos) dice que "no hay reglas absolutas" sobre el orden, y confirma que las tintas de mayor densidad como el negro "usualmente se imprimen al final o justo antes de un secado". En colores planos, el más claro primero y el más oscuro al final | https://www.wcibags.com/2019/03/19/spot-color-vs-full-color-printing-whats-the-difference/ · https://www.todoexpertos.com/categorias/tecnologia-e-internet/diseno-grafico/respuestas/1844236/orden-de-impresion-en-cuatricomia | 2026-09-01 | verificado; la segunda es un foro de oficio, sostenida porque coincide con las de industria |
| `RES-54.5` | **Qué es el registro:** la alineación exacta entre pasadas de tinta distintas de la misma pieza, garantizada con marcas o cruces de registro idénticas fuera del área imprimible en cada pantalla, usadas para calibrar cada pasada contra la anterior | https://www.printablepress.com/how-to-register-multi-color-screens-screen-printing/ | 2026-09-01 | verificado |
| `RES-54.6` | **Por qué el registro se corre:** movimiento del papel o la tela entre pasadas, montaje impreciso de cada pantalla nueva, alineación manual imperfecta, tensión de malla y cambios de ángulo o presión de racleta entre tiradas | https://printplanet.com/threads/tolerance-for-misregistration.14432/ | 2026-09-01 | verificado (síntesis consistente entre varias fuentes técnicas) |
| `RES-54.7` | **Cuánto es un corrimiento normal a mano:** en diseños simples con colores separados, 1–2 mm es aceptable; donde los colores se tocan o hay detalle fino, tiene que bajar de 0,5 mm; en textil, 0,8 mm (1/32") es lo esperable y hasta 1,6 mm (1/16") en tela elástica | https://printplanet.com/threads/tolerance-for-misregistration.14432/ · https://www.ketegroup.com/printing-registration/ | 2026-09-01 | verificado; son fuentes de serigrafía comercial y textil en inglés, no de un taller de afiche artesanal |
| `RES-54.8` | **Hay una segunda convención real, y no se promedia con la anterior:** en la xilografía tradicional (ukiyo-e) y en mucha ilustración plana de afiche, el "bloque clave" —el contorno en negro— se talla y se imprime **primero**, como guía de registro, y los colores, a menudo transparentes, van encima sin taparlo | https://woodblock.com/encyclopedia/entries/000_09/000_09.html · https://www.britannica.com/technology/key-block | 2026-09-01 | verificado |
| `RES-54.9` | **Cuál convención aplica al ciclo 12, y por qué** — criterio de síntesis de `investigador`, no un hallazgo con fuente propia: el taller separa una **fotografía** (la tapa existente) en capas tonales, no dibuja un contorno de línea nuevo. Corresponde la convención fotográfica (`RES-54.1`–`.4`, clave última), no la del bloque-contorno-primero, que es para ilustración de línea dibujada desde cero | — | — | criterio propio |

**Lectura para el proyecto, que no es hallazgo:** la clave sola —sin color— sigue siendo
una imagen legible; las tintas clara y media solas, sin la clave, no lo son. Es la lectura
correcta del fallo del juego ("te faltó el color"). Y el "registro imperfecto" que `UX-22`
usa como textura es exactamente la falla que un taller real evita (`RES-54.5`–`.7`): acá se
usa a propósito como marca de mano, con fundamento técnico real, no como efecto inventado.

---

## RES-54 (continuación) — El proceso real de Rocambole con las tapas: qué hay, y qué no

| # | Hallazgo | URL | Consultado | Estado |
|---|---|---|---|---|
| `RES-54.10` | `RES-06` ya fichó: Rocambole trabaja "artesanal, con rodillo y serigrafía; también aerografía, grabado, collage e ilustración", con formación en serigrafía 1961–1963. Esta ficha no repite esa fuente, la reusa | ver `INV-02` | — | verificado en `RES-06` |
| `RES-54.11` | **Nuevo, cita textual de Rocambole sobre *Gulp!* (1985)**, entrevista de Clarín del 18-jun-1999 reproducida por Redondos Subtitulados: *"pasamos un rodillo con tinta de grabado y aplicamos serigrafía con las letras en plasticola de color"*. La misma cita, ampliada, en un blog de cátedra universitaria de diseño | https://redondossubtitulados.com/1999/06/18/rocambole-cuenta-los-secretos-por-detras-de-las-tapa-de-patricio-rey/ · https://www.catedracosgaya.com.ar/tipoblog/2016/rocambole-y-sus-dibujitos-de-ricota/ | 2026-09-01 | verificado **con reserva**: fuentes secundarias que reproducen la nota de Clarín; no se confirmó contra el original |
| `RES-54.12` | **Nuevo, misma fuente y misma reserva:** sobre *Lobo suelto* y *Cordero atado* (1993) Rocambole dice *"Son todas aerografías gigantes creadas en relación a los textos"*. Esas dos tapas puntuales fueron **aerografía, no serigrafía** | https://redondossubtitulados.com/1999/06/18/rocambole-cuenta-los-secretos-por-detras-de-las-tapa-de-patricio-rey/ | 2026-09-01 | verificado con la misma reserva |
| `RES-54.13` | **NO ENCONTRADO, con todas las letras:** ninguna fuente consultada —la entrevista de 1999, la tienda oficial Rocambole Art, las notas ya citadas en `RES-06`, La Nación, Infoarte— da un número de tintas o pantallas que Rocambole haya usado en una tapa o afiche puntual, ni el orden en que las aplicaba | — | 2026-09-01 | **sin fuente**, no se inventa un número |
| `RES-54.14` | Afiches de recital serigrafiados en general (no específico de Rocambole): la práctica de talleres de afiches de edición limitada ronda **3 a 5 tintas**, por costo y legibilidad a distancia | https://anatol.com/the-art-of-screen-printing-gig-posters/ | 2026-09-01 | reportado: guía de taller, no cifra dura ni específica de la banda |
| `RES-54.15` | Consecuencia práctica para el riesgo que el plan nombra ("que la clave sola del fallo no sea un número caprichoso"): **tres tintas** es verosímil frente a un afiche de recital real (`RES-54.14`), y el orden clara → media → clave última es el de la convención fotográfica probada (`RES-54.1`–`.4`) — no un efecto que "queda lindo" | — | — | criterio propio, apoyado en lo anterior |

**Rótulo que manda sobre todo el sitio:** el orden clara → media → clave que usa el taller
es **el de la convención general del oficio**, no una reconstrucción del método de
Rocambole. Cualquier pieza que lo mencione dice *"así se imprime una serigrafía"*, nunca
*"así imprimía Rocambole esta tapa"*. Y dos de las diez tapas (`RES-54.12`) no fueron
serigrafías en origen: la estampa del sitio es una **lectura** de la tapa en el idioma de la
técnica, no una restauración de cómo se hizo.

## Sin resolver

- El orden de pasadas propio de Rocambole, tapa por tapa: necesitaría la entrevista de 1999
  contra el original de Clarín, o el libro *Solos y de noche* (`RES-06`), ninguno
  accesible por web.
- Si Rocambole hacía separación manual de color o trabajaba sobre positivos ya separados:
  ninguna fuente lo dice.
- El corrimiento de registro en milímetros (`RES-54.7`) sale de serigrafía comercial y
  textil; es la mejor cifra encontrada, no una medición sobre una pieza de Rocambole.

## Dato al costado, para quien mantiene `RES-06`

`redondossubtitulados.com`, que `RES-06` marcó "reportado — HTTP 403" el 2026-08-19,
respondió 200 en la primera ronda del 2026-09-01 y 403 otra vez en la segunda. Cuando
esté arriba, conviene revalidar la sección de tapas de `RES-06` (el esclavo de *Oktubre*,
*La mosca y la sopa*) contra el texto entero.

## Qué sigue, y quién lo toma

- `arquitectura` (`ADR-05`) y hilo principal (`T-199`): el orden clara → media → clave queda
  verificado como convención de oficio; el comentario de `scripts/generar-pasadas.mjs` puede
  citar esta ficha tal cual, pero no puede decir que así imprimía Rocambole.
- `experiencia` (`UX-22`): el registro imperfecto como textura tiene fundamento técnico
  real (`RES-54.5`–`.7`), no es solo gesto estético.
- `contenido`: donde el sitio nombre la técnica, la palabra es "serigrafía" como oficio,
  y para *Lobo suelto* y *Cordero atado* la tapa real fue aerografía (`RES-54.12`).
