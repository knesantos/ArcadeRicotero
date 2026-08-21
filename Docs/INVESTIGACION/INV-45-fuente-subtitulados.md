# INV-45 — redondossubtitulados.com como fuente de letras y de contexto

> Ciclo 4, `T-60`, 2026-08-21. Responde al encargo que el usuario dejo sin evaluar en
> `Docs/SUGERENCIAS/HILO-para-investigador-fuente-redondossubtitulados.md`.
>
> Consume: `RES-20` (los 105 temas), `RES-23` (por que se descarto letras.com),
> `RES-24` (el precedente de la limitacion de metodo), `D-13` y `D-14`.
> Numeracion: `RES-45`, del rango `RES-44`..`RES-49` reservado para el ciclo 4 en
> `Docs/IDS.md`.
>
> **Aviso de metodo, porque cambia como se lee todo lo de abajo:** el dominio devolvio
> **403 en todos los intentos de lectura directa**. Lo que sigue se reconstruyo con
> busqueda indexada, que alcanza para confirmar que una pagina existe y donde vive, pero
> **no para leer el texto de un tema ni para saber si esta entero o es un fragmento**.
> Donde eso importa, esta dicho en la propia afirmacion.
>
> **Esta ficha evalua el corpus, no reproduce nada de el.** Los temas se nombran por
> titulo y por URL.

---

## RES-45 — Evaluación de redondossubtitulados.com como fuente de letras/contenido, respondiendo al encargo de `Docs/SUGERENCIAS/HILO-para-investigador-fuente-redondossubtitulados.md`.

**Qué es y qué contiene.** Blog/sitio de fans, con entradas fechadas (archivo por año, ej. `/2023/`, `/2006/02/01/...`), organizado en tres ramas separadas por artista: `/patriciorey/` (la banda), `/indiosolari/` y `/skaybeilinson/` (carreras solistas). Dentro de `/patriciorey/` hay subcarpetas por disco (`gulp`, `oktubre`, `unbaion`, `bangbang`, `lamosca`, `lobosuelto`, `corderoatado`, `luzbelito`, `ultimobondi`, `momosampler`) más `ineditos-redondos` (temas fuera de disco) y `endirecto` (versiones en vivo). El nombre "subtitulados" y el patrón de URLs sugieren que cada tema trae video con subtítulos/letra sincronizada más comentario editorial (anécdotas, sentido del tema, contexto histórico) — esto último **es inferencia mía**, no lo confirmé leyendo la página completa (ver limitación de método abajo).
Fuente: https://redondossubtitulados.com/ — Consultado: 2026-08-21 · **verificado el listado de secciones vía indexación, no por lectura directa de la página** (ver más abajo).

**Limitación de método, y por qué importa.** `WebFetch` devolvió **HTTP 403 en todos los intentos** (portada, `/contacto/`, `/patriciorey/`, `/patriciorey/discos-redondos/`, y el mirror `.com.ar`, que además no resuelve DNS). Todo lo que sigue lo reconstruí con `WebSearch` sobre snippets indexados de Google, que alcanza para confirmar existencia y ubicación de páginas pero **no para leer el texto completo de una letra ni confirmar si está entera o parcial**. Es la misma limitación que `RES-24` documentó con el lector de *Fuimos reyes*: la verificación fina de esta fuente requiere abrirla en navegador real, tarea manual.

**Cobertura contra los 105 temas de `RES-20`, y la pregunta de contaminación.** Tomé una muestra de **18 temas repartidos en los 10 discos** (mínimo 1 por disco, hasta 3 en algunos): *Gulp!* → Barbazul versus el amor letal, Criminal mambo, Pianito; *Oktubre* → Jijiji, Preso en mi ciudad; *Un baión* → Todo un palo, Vencedores vencidos; *¡Bang! ¡Bang!* → Ropa sucia, Nadie es perfecto; *La mosca y la sopa* → Mi perro dinamita; *Lobo suelto vol. 1* → Susanita; *vol. 2* (carpeta `corderoatado`) → Etiqueta negra, Yo caníbal; *Luzbelito* → Juguetes perdidos, Rock yugular; *Último bondi* → Gualicho; *Momo Sampler* → Sheriff, Templo de momo. Los 18 aparecen bajo la carpeta del disco correcto, cero mezcla con material de Indio solista o Skay en la muestra — esos viven aparte, en `/indiosolari/` y `/skaybeilinson/` (confirmé "Espejismos" y "La luna hueca" ahí).
URLs de ejemplo: https://redondossubtitulados.com/patriciorey/gulp/criminal-mambo/ , https://redondossubtitulados.com/patriciorey/oktubre/jijiji/ , https://redondossubtitulados.com/patriciorey/corderoatado/yo-canibal/ , https://redondossubtitulados.com/patriciorey/momosampler/sheriff/ — Consultado: 2026-08-21 · **verificado por indexación (existencia y ubicación), no por conteo total del sitio**.
**No pude confirmar el total real de temas que vive bajo `/patriciorey/discos-redondos/`** (403 me bloqueó esa página), así que no tengo un número comparable a las "149" de letras.com. Lo que sí puedo afirmar con evidencia es que, a diferencia de letras.com, **la separación por artista y por disco está en la estructura de URL misma**, no en una lista plana — eso reduce estructuralmente el riesgo de contaminación que `RES-23` demostró, aunque no lo descarta del todo hasta un censo completo. **Esto es inferencia respaldada por muestra, no un conteo cerrado.**

**Licencia declarada.** Ninguna. Revisé `/contacto/` y `/ayudanos/` vía snippets: el sitio da un correo (`redondossubtitulados@gmail.com`) e invita a mandar material (audio, video, entrevistas, fotos, artículos) para que el sitio lo publique — es un modelo editorial/curado, no de edición abierta línea por línea como letras.com. No hay aviso de copyright, ni mención de SADAIC ni de acuerdo editorial. **El hallazgo es la ausencia**, igual que en `RES-23`.
Consultado: 2026-08-21 · **verificado — ausencia constatada, no inferida**.

**Para qué frente rinde.**
- `US-03` (completar la letra): puede sumarse como **segunda o tercera fuente para la mitigación 2 de `D-13`** ("dos fuentes que coincidan"), cruzada contra letras.com y contra el disco. No la recomiendo como fuente única ni primera, porque no pude confirmar si el texto de cada tema está completo o es fragmento acompañado de comentario — eso lo tiene que confirmar quien abra la página en navegador.
- Tipo `tema` de la Redondopedia: acá rinde mejor que letras.com. El contenido editorial que asoma en los snippets —la nota de censura de COMFER sobre "Criminal mambo", el origen de "Susanita" (antes "Zulemita"), la variante "Perra dinamita" detrás de "Mi perro dinamita"— es material de historia/mitología rotulable como leyenda o testimonio, justo lo que `D-20` pide para los artículos. Es más rico que una lista de letras desnuda.

**Comparación directa.**
- **Contra letras.com (`RES-23`):** mejor en estructura (separación real por artista y disco vs. lista plana de 149), mejor en profundidad de contenido (comentario editorial vs. solo texto), igual de mal en licencia (ninguna declarada en los dos casos), y peor en verificabilidad inmediata para mí porque bloquea `WebFetch` con 403 y letras.com no.
- **Contra bestiarioredondo:** no son comparables en el mismo eje. Según `INV-21`, bestiarioredondo es probablemente **obra ilustrada original** sobre las canciones, no transcripción de letra — rinde como fuente iconográfica, redondossubtitulados rinde como fuente de texto y de contexto narrativo.

**Recomendación (separada del hallazgo).** Sumarla como fuente secundaria de cruce para letras y como fuente primaria de contenido narrativo para la Redondopedia, con las mismas cinco mitigaciones de `D-13` aplicadas (cruzar contra los 105, dos fuentes coincidentes, empezar por temas conocidos, marcar `fuentes` en el JSON, confirmar de oído). No la pongo al nivel de "fuente única" de nada hasta que alguien la abra en navegador y confirme que el texto de cada tema está completo.

## Lo que quedo sin resolver
- Contenido exacto de una página de tema (¿letra completa, fragmento, o solo comentario con subtítulo de video?) — `WebFetch` da 403 en todo el dominio; hace falta abrirlo en navegador real, como se hizo con el lector de `RES-24`.
- Conteo total de temas bajo `/patriciorey/discos-redondos/` para comparar un número cerrado contra los 105 de `RES-20` (hoy solo tengo muestra de 18, no censo).
- Quién mantiene el sitio (no encontré nombre de autor, solo un correo genérico y una página de Facebook).

## Que sigue, y quien lo toma
- `contenido`: usar esta ficha para decidir si redondossubtitulados entra como segunda fuente de `US-03` (mitigación de `D-13`) y como fuente narrativa de artículos `tema` de la Redondopedia (`D-20`), siempre rotulando hecho/leyenda/testimonio y citando URL.
- Si `contenido` necesita confirmar el texto completo de un tema puntual, que lo pida como pregunta concreta nueva — esta ficha no cierra esa verificación, la deja pendiente de navegador real.
