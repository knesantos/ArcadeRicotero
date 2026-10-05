# Letras de disco y sin sombra: el relevamiento (a medio camino)

> Análisis del hilo principal, 2026-10-05. Lo pidió el usuario, textual: *"Sisi saquemos la
> sombra de todos lados, no me gusta. Ademas hay que usar la tipografia de los discos en mas
> lados. Analicemos como integrarlas mejor."* Y después: *"para y subi e integra todo lo que
> hayas hecho, despues seguimos"*.
>
> **Estado:** terminaron los cuatro relevamientos de abajo. **No llegaron** las tres propuestas
> de tipografía (D-19 llevado a la letra, una sola voz de disco con repuesto, letras recortadas
> como collage), los jueces ni la síntesis: el usuario cortó antes. Se retoma desde acá.
> Va junto con `ESPEC-D-64-la-tapa-se-sella.md`, que es la especificación del sello de goma
> (ya juzgada) y que hay que ajustar: ahora la sombra sale de **todos** lados, marca incluida.
>
> Cobertura medida con fontTools: *Patricio Rey Fan* tiene A-Z y 0-9; *Lobo Suelto Fan*, A-Z;
> *Oktubre Calco*, solo A B C D E F H I K N O R T U. Ninguna tiene tildes, Ñ ni signos.
>
> Las rutas a PNG que nombran los informes viven en el temporal de la sesión y pueden no estar.


---

## Sombras: todas las que hay y qué test depende de cada una

INFORME: INVENTARIO DE SOMBRAS Y ECOS (para "sacar la sombra de todos lados")
Base: worktree C:/Users/santi/Proyectos/InstanciadorProyectos/RicotaArcade-fondo, rama diseno/fondo-multitud. Los números de línea de sitio.css son los del árbol de trabajo, que todavía tiene D-63 sin commitear.

Cómo lo verifiqué:
- Lectura estática con un parser de llaves propio, que da selector y @media de cada declaración. Recorrió src/styles/*.css, todos los <style> de src/**/*.astro, las islas src/scripts/*.ts, src/lib (sin los tests), tarjeta.ts, lamina.ts y scripts/*.mjs.
- Barrido del sitio ya construido (dist/ es posterior a todas las hojas), servido en local. En cada elemento, y en sus ::before y ::after, leí con getComputedStyle el textShadow y el boxShadow. Lo corrí a 1440 y a 375 px en: el portal, quiz, los 9 juegos, el índice de la Redondopedia, los artículos de Oktubre, Ji Ji Ji y Bulacio, letras-y-acordes (índice y un tema) y diagnostico-audio.
- No toqué nada del repo. Lo único que escribí son scripts de análisis, en el scratchpad (sombras/inv.py y sombras/vivos.py).

====================================================================
1. TIPO A: text-shadow sobre letras (el eco de registro). SALEN TODAS
====================================================================

A1. sitio.css:1634-1638
    Selector: .marca-grande, .casete-titulo, .articulo:not(.articulo--grave) h1
    Declaración: text-shadow: var(--registro) var(--registro) 0 var(--tinta-registro);
    Toca tres cosas:
    - La marca del portal, "FICHÍN RICOTERO" (index.astro:209). Su eco es --disco-oktubre-apoyo (rgb 154,148,144), que lo fija sitio.css:1642-1644: `.marca-grande { --tinta-registro: var(--disco-oktubre-apoyo); }`.
    - Los 11 títulos de casete del portal. El color del eco sale del mapa de variantes, medido en el navegador:
      · A1 Preguntas ricoteras: --borde rgb(59,48,42)
      · A2 ¿Qué tipo de ricotero sos?: rgb(105,99,92)
      · A3 Adiviná el tema: rgb(11,119,146)
      · A4 Skayboy y Poligirl: crema rgb(230,228,189)
      · A5 Sacalo por la letra: --borde
      · A6 Completá la letra: rgb(17,75,88)
      · A7 Ponelos en fila: rgb(146,112,81)
      · A8 Adiviná la tapa: rgb(116,114,110)
      · A9 Más o menos: rgb(69,126,177)
      · B1 Letras y acordes: rgb(17,75,88)
      · B2 La Redondopedia: crema
    - El h1 de los artículos de la Redondopedia, salvo los tres graves. El eco es el -apoyo de la categoría: en "Oktubre" rgb(116,114,110), en "La leyenda de Ji Ji Ji" rgb(11,119,146). Bulacio sale sin sombra, como corresponde.
    El comentario que va con la regla está en sitio.css:1607-1632 y sale entero.

A2. juego.css:3636-3650 (.marca)
    Declaraciones: 3648 `--tinta-registro: var(--borde);` y 3649 `text-shadow: var(--registro) var(--registro) 0 var(--tinta-registro);`
    Toca "FICHÍN RICOTERO" en la cabecera de quiz, de los 8 juegos y de dos-ejes/cu-*.
    - En el teléfono se ve siempre.
    - A 64 rem o más se esconde, porque se muda a la carátula.
    - En Skayboy se ve a todo ancho, porque esa página no tiene carátula.
    Comentario a quitar: 3644-3647.

A3. juego.css:3661-3663 (.pantalla h1)
    Declaración: text-shadow: var(--registro) var(--registro) 0 var(--tinta-registro);
    Toca el h1 de cada juego: "Entrá, sepas lo que sepas." (quiz), "Adiviná el tema", "Sacalo por la letra", "Adiviná la tapa", "Completá la letra" y su h1 SIN_BANCO, "Ponelos en fila", "Más o menos", "¿Qué tipo de ricotero sos?" (también en dos-ejes/[cu]) y "Skayboy y Poligirl".
    El eco sale de .juego--* (sitio.css:1022-1055). En quiz y en Sacalo cae a --borde; en Skayboy es crema, por skayboy.css:74 (`--tinta-registro: var(--disco-gulp-apoyo);`).
    Comentario a quitar: 3652-3660. En skayboy.css, comentario 65-68 y la línea 74.

A4. juego.css:3895, dentro de @media (min-width: 64rem) (.caratula-marca)
    Declaración: text-shadow: var(--registro) var(--registro) 0 var(--borde);
    Toca "FICHÍN RICOTERO" en la carátula de la mesa (Caratula.astro:57), en los 8 juegos con carátula y solo en escritorio.

A5. juego.css:4314 (.estampa-disco)
    Declaración: text-shadow: var(--registro) var(--registro) 0 var(--apoyo-disco, var(--borde));
    Toca el nombre del disco bajo la estampa de la revelación, en la tinta de su disco, con .estampa-disco--oktubre (calco) y --lobo-suelto. Pantalla: revelación de "Adiviná el tema" y de "Sacalo por la letra" (sacar-temas.ts:113).
    Comentario a quitar: 4304-4306.

Nada más pone sombra sobre letras:
- Las islas no escriben style.textShadow ni boxShadow. Los setProperty que hay solo tocan --marcas, --tapa-de-la-sala, --vv-*, --encuadre-* y --contador-*.
- El canvas tampoco dibuja sombras. tarjeta.ts:163-168 y lamina.ts:120-133 hacen un solo fillText, sin shadowColor, shadowBlur ni shadowOffset. generar-marca-social.mjs no escribe texto (línea 18) y declara "sin degradados ni sombras" (línea 219).
- No hay ::before ni ::after que dupliquen texto con attr(), ni -webkit-text-stroke.
- Los SVG de public/arte no tienen feOffset ni feDropShadow.

====================================================================
2. TIPO B: box-shadow de eco o segunda pasada sobre un sello o botón con letra. SALEN
====================================================================

B1. sitio.css:983-984 (.casete-accion)
    Comentario: "La tinta del sello no llega pareja al borde: el eco de la segunda pasada, corrido."
    Declaración: box-shadow: 2px 2px 0 color-mix(in srgb, var(--tinte-sello, var(--tinte)) 40%, var(--papel));
    Toca los 11 sellos del portal: JUGÁ, EMPEZÁ, ARMÁ, TOCÁ y LEÉ. ESPEC-D-64 ya lo saca.

B2. sitio.css:703 (.oktubre-jugar)
    Declaración: box-shadow: 2px 2px 0 color-mix(in srgb, var(--marca-rojo) 40%, var(--papel));
    Toca el sello "ADIVINÁ TEMAS DE OKTUBRE" del afiche de octubre en el portal (index.astro:240).
    - Hoy está a la vista: data-mes="oktubre" está activo y la fecha es 2026-10-05.
    - Es la misma fórmula que B1, y su comentario (695-696) dice "como el JUGÁ de los casetes".
    - **ESPEC-D-64 no lo nombra, y es un hueco.** Si sale el eco del sello del casete y este se queda, los dos sellos dejan de ser coherentes. Si se adopta la almohadilla, también tendría que llevarla.

====================================================================
3. TIPO C: sombra dura de un objeto o recorte, sin eco de letra
====================================================================

diseno-marca.md (fila 77) admite "sombra dura desplazada ... o nada". El usuario dijo "de todos lados", así que recomiendo que salgan todas, salvo donde se aclara otra cosa. Las marco en cuatro familias.

C-registro. Usan el mismo mecanismo del eco (--registro / --tinta-registro), así que son el eco aplicado a un objeto. SALEN.
- C1. sitio.css:1274 (.papel-ficha)
  Declaración: `box-shadow: var(--registro) var(--registro) 0 var(--tinta-registro);`
  Toca el marco de papel de la tapa en los 10 artículos de disco de la Redondopedia. En Oktubre el eco es rgb(116,114,110). UX-22 §9 lo llama "sombra de registro".
  Comentarios: sitio.css:1259-1262, 1272 y [slug].astro:144-146.
- C2. skayboy.css:177 (.juego-skayboy .gabinete)
  Declaración: `box-shadow: var(--registro) var(--registro) 0 var(--tinta-registro);` con 171 `--tinta-registro: var(--disco-gulp-apoyo);`
  Toca el mueble del fichín, con eco crema.
  Comentarios: skayboy.css:18, 164-169, 1188-1189 y skayboy-y-poligirl.astro:12.
- C3. skayboy.css:1492 (.juego-skayboy .fin-nivel)
  Declaración: `box-shadow: var(--registro) var(--registro) 0 var(--disco-gulp-apoyo);`
  Toca la tarjeta de fin de nivel (Repetí / Elegí otro / Seguí).
  Comentarios: 1467-1468 y 1620. El de 1637-1638 ("Sin eco: …") queda bien.

C-tecla. El canto que se hunde al apretar. Es box-shadow desplazada en vertical, sobre el botón principal de cada juego. Es la sombra más visible del sitio después de los títulos. Recomiendo que salga y que el :active pase a un cambio de tinta: translate 0 2px más un relleno de color-mix(tinta, fondo). La tabla anti-slop ya admite "cambio de tinta o de borde", y el sello lleno sin canto queda en la misma familia que el sello del casete después de D-64. Hay que confirmarlo con el usuario, porque retira D-54 punto 6.
- C4. juego.css:330, 339 y 345 (.primario)
  `box-shadow: 0 4px 0 var(--canto-accion, var(--borde));`
  `:active:not(:disabled) { box-shadow: 0 1px 0 …; }`
  `:disabled { box-shadow: none; }`
  Transición en 333. Toca JUGÁ, EMPEZÁ y SEGUÍ de todos los juegos, el COMPARTÍ (.primario.firma, que fija su canto en 425) y los botones de fin-nivel y del menú de Skayboy.
  Los colores medidos coinciden con el apoyo de cada disco (quiz rgb(154,148,144), Skayboy crema, etc.). Comentarios: 324-329 y 422-424.
- C5. adivinar-el-tema.astro:311, 319 y 324 (.primario local)
  `box-shadow: 0 5px 0 var(--cat-mitologia-apoyo);` con :active a 0 1px 0 y :disabled a none. Toca el "Empezá" de la portada. Duplica C4 con 5 px. Comentario: 295-296.
- C6. adivinar-por-la-letra.astro:200 y 209 (#jugar)
  `box-shadow: 0 5px 0 var(--disco-momo-sampler-apoyo);` con :active a 0 1px 0. Toca el JUGÁ. Comentario: 196-197.
- C7. juego.css:1137, 1146, 1176-1178 y 1192 (.escuchar)
  `0 5px 0 var(--cat-mitologia-apoyo)`, que al apretar pasa a `0 1px 0`. En el estado sonando (1176) la sombra es `inset 0 0 0 var(--linea) var(--cat-mitologia), 0 1px 0 var(--cat-mitologia-apoyo)`, y en disabled `none`.
  Toca la tecla de escuchar en la partida de "Adiviná el tema". Del sonando sale solo la segunda capa: el inset es contorno (ver D2). Comentario: 1114-1119.
- C8. juego.css:1427, 1436 y 1441 (arriesgar y seguir en .juego-tema y .juego-por-la-letra)
  `0 4px 0 var(--borde)` / `0 4px 0 var(--canto-tecla)` / `0 1px 0 var(--borde)`. Toca Arriesgar, Pasá y Seguí en las dos partidas de sacar temas. La regla de 1435-1437 queda vacía y hay que borrarla, porque .arriesgar--listo ya tiene su propia regla en 1402. Comentario: 1413-1417.

C-recorte. Papel sobre papel, sobre piezas de contenido. SALEN. Casi todas ya tienen borde completo, que es lo que recorta la pieza.
- C9. sitio.css:442 (.volver)
  `box-shadow: 0 2px 0 color-mix(in srgb, var(--papel-borde) 60%, transparent);`
  Toca la cinta "← AL FICHÍN", "← A LA REDONDOPEDIA" y "← Letras y acordes", en todas las páginas interiores. Es un botón con letra.
- C10. sitio.css:890 (.casete-arte--entera)
  `box-shadow: 3px 3px 0 color-mix(in srgb, var(--tinte) 70%, var(--fondo));`
  Toca la tapa entera pegada en A1 Oktubre, A7 ¡Bang! y B1 La mosca y la sopa en el portal, y en la carátula de quiz y de ponelos-en-fila, tanto en escritorio como en la calcomanía del teléfono. Es la de D-49. ESPEC-D-64 (B.6) la dejaba; con el pedido nuevo sale. Comentario: 882-884.
- C11. sitio.css:1246 (.tapa-disco)
  `box-shadow: 0 3px 0 color-mix(in srgb, var(--papel-borde) 35%, transparent);`
  **Ya está muerta:** la única .tapa-disco del sitio vive dentro de .papel-ficha, y sitio.css:1281 (`.papel-ficha .tapa-disco { box-shadow: none; }`) la anula. El barrido lo confirma. Salen las dos.
- C12. cancionero.css:65 (.boton-recorte)
  `box-shadow: 4px 4px 0 var(--borde);`
  Toca el botón "Armá tu cancionero" en /letras-y-acordes/. Comentario: 64.
- C13. cancionero.css:85 (.disco)
  `box-shadow: 5px 5px 0 var(--apoyo);`
  Toca las 10 secciones de disco de /letras-y-acordes/. La de Cordero atado da rgb(3,13,11), casi invisible.
- C14. juego.css:488 (.verso-bloque)
  `box-shadow: 4px 4px 0 var(--borde);`
  Toca el bloque de versos de la partida de "Completá la letra".
- C15. juego.css:972 (.barra)
  `box-shadow: 3px 3px 0 var(--cat-mitologia-apoyo);`
  Toca la regla de cinta de la partida de "Adiviná el tema".
- C16. juego.css:1289 (.sugerencias), con 1617 `none` en tecleando
  `box-shadow: 4px 4px 0 var(--borde);`
  Toca la lista de sugerencias de tema y de por-la-letra. La línea 1617 queda sobrando.
- C17. juego.css:1640 (.premios)
  `box-shadow: 4px 4px 0 var(--canto-tecla, var(--cat-mitologia-apoyo));`
  Toca la chapa "Cuánto vale cada paso" en las portadas de tema y por-la-letra.
- C18. juego.css:1715 (.revelacion)
  `box-shadow: 4px 4px 0 var(--apoyo-disco, var(--borde));`
  Toca el panel de revelación de tema y por-la-letra. Comentario: 1700-1712.
- C19. juego.css:2132 (.ejes-tapa)
  `box-shadow: 5px 5px 0 var(--borde);`
  Toca la tapa del libro en la portada de dos-ejes.
- C20. juego.css:2182 (.ejes-tapa-etiqueta)
  `box-shadow: 3px 3px 0 var(--borde);`
  Toca la etiqueta con letra "Las hojas de la noche…".
- C21. juego.css:2481 (.ejes-hoja--final)
  `box-shadow: 5px 5px 0 var(--borde);`
  Toca la hoja del resultado de dos-ejes.
- C22. juego.css:3163 (.hoja-versos)
  `box-shadow: 4px 4px 0 var(--disco-momo-sampler-apoyo);`
  Toca la hoja de versos de la partida de "Sacalo por la letra" (D-31).
- C23. juego.css:4187 (.estampa-papel)
  `box-shadow: 4px 4px 0 var(--apoyo-disco, var(--borde));`
  Toca el papel de la estampa en la revelación. ESPEC-D-64 lo dejaba; ahora sale.
- C24. juego.css:4499 (.masomenos-referencia)
  `box-shadow: 4px 4px 0 var(--apoyo-disco, var(--borde));`
  Toca la referencia de la partida de "Más o menos". Comentario: 4492-4494.

C-estado. Hoy la sombra es parte de cómo se ve un estado. **Si sale, hay que reemplazarla.**
- C25. juego.css:688 (.pozo[aria-pressed='true'])
  `box-shadow: 3px 3px 0 var(--apoyo-disco, var(--cat-mitologia-apoyo));`
  Toca el pozo elegido en la portada de "Adiviná el tema" ("Todos los discos" o un disco).
  **Si sale la sombra, el estado elegido se dice solo con color:** border-color y color del título. Eso viola "ningún estado se comunica solo con color" de diseno-marca.md. Hay que darle una señal de forma, por ejemplo border-width 4 px como ya hace .ejes-opcion--elegida.
- C26. juego.css:2391 y 2419 (.ejes-opcion y .ejes-opcion--elegida/--antes)
  En reposo `3px 3px 0 var(--fondo)`; elegida `translate: 3px 3px; box-shadow: 0 0 0 var(--fondo); border-width: 4px`.
  Toca las dos opciones de cada hoja de dos-ejes. Sin la sombra en reposo, el translate de la elegida deja de leerse como "apretada" y queda corrido sin más. El borde de 4 px, que es forma, alcanza como señal. Hay que sacar el translate, la transición de box-shadow (2397) y actualizar el comentario 2410-2413 ("tres cambios de forma" pasan a uno o dos).
- C27. juego.css:2277, 2282, 2287, 2291 y 2295 (.ejes-hoja y .ejes-hoja[data-quedan='3'|'2'|'1'|'0'])
  Sombras escalonadas `3px 3px 0 var(--papel-borde), 5px 5px 0 var(--fondo), … 17px 17px 0 var(--borde)`, que dibujan el canto de las hojas que faltan (D-57).
  Toca la hoja de pregunta de dos-ejes. Es un dibujo de objeto que además informa el avance, pero esa información ya la da el folio en texto ("3 de 10", partida-dos-ejes.ts:142). Recomiendo que salga.
  Las cuatro reglas [data-quedan] quedan vacías y salen. `hoja.dataset['quedan']` en partida-dos-ejes.ts:127-133 queda como gancho sin pintar, y ningún test lo detecta (la red de estilos.test.ts solo mira clases), así que conviene sacarlo también. Comentario: 2268-2270.

====================================================================
4. NO SON SOMBRA. SE QUEDAN
====================================================================

- D1. juego.css:1046 (.barra-aguja): `box-shadow: 0 0 0 1px var(--papel)`. Es el filo de la aguja, un anillo sin desplazamiento. El comentario ya lo dice.
- D2. juego.css:1176 (.escuchar--sonando), primera capa: `inset 0 0 0 var(--linea) var(--cat-mitologia)`. Es contorno.
- D3. juego.css:3456 (hover de .escuchar--sonando): `inset 0 0 0 var(--linea) var(--acento-2)`. Es contorno.
- D4. skayboy.css:1267 (teclas y sello-mueble en pantalla completa): `inset 0 0 0 var(--anillo) var(--fondo)`. Es el anillo de UX-33 §1.4, y lo exige un test (ver T3).
- D5. juego.css:3449 y 3455: `filter: brightness(1.12)` y `filter: none` en el hover.
- D6. tokens.css:500 y 507: `filter: brightness(var(--hondura-transito))` en el tránsito.
- D7. juego.css:4216-4217 y 4223-4224 (.pasada--media, .pasada--clave): translate y rotate con --registro y --registro-angulo.
  - Es el registro corrido de las separaciones de imagen de la estampa (UX-22 §2.3), no una sombra ni una letra.
  - Con acierto la foto lo tapa al final de la impresión. Con fallo queda la clave sola, corrida 4 px, con una franja de papel a la vista.
  - Es lo único que mantiene vivos --registro y --registro-angulo. Si el usuario también lo cuenta como "eco", los dos tokens mueren (ver T4).
- Tampoco son sombra el pie de imprenta (.rodillo, la pasada del pie) ni los anillos de foco (outline).

====================================================================
5. TOKENS Y VARIABLES QUE QUEDAN SIN USO
====================================================================

Calculado con un cierre transitivo de var() sobre todas las hojas, los <style> y los var() de las islas. Escenario: sale todo A, B y C, y se quedan D1-D7.

- --tinta-registro: muere entera. Son 20 declaraciones:
  - tokens.css:251, con su comentario 245-250, que dice que el eco "no entra a contraste.test.ts";
  - juego.css:3648;
  - sitio.css:1023, 1024, 1025, 1026, 1040, 1047 y 1054 (mapa de variantes);
  - sitio.css:1164-1167 (.cocina--*, que además es CSS muerto: no hay marcado .cocina);
  - sitio.css:1602-1605 (.articulo--* y .tarjeta-articulo--*; .tarjeta-articulo ya hoy no la lee);
  - sitio.css:1643;
  - skayboy.css:74 y 171.
- --canto-accion: muere. juego.css:425 y 3730-3738 (en esas líneas hay que borrar solo esa variable; --tinte-accion sigue).
- --canto-tecla: muere. juego.css:1422 y 3026.
- Tres colores de la paleta quedan sin ningún consumidor: --cat-historia-apoyo (tokens.css:66), --cat-discos-apoyo (68) y --cat-letras-apoyo (70). --cat-mitologia-apoyo sigue, como borde de .sugerencias. Recomiendo no borrarlos: son paleta medida (RES-37, hoja 03/05 del lienzo) y ningún test los exige. Basta con anotar que quedan sin consumidor.
- --registro (tokens.css:242) y --registro-angulo (243) **siguen vivos** por D7. Hay que reescribir su comentario (239-241): ya no describen "la segunda tinta" detrás de las letras, sino solo el corrimiento de las pasadas. También hay que tocar el comentario del corte de movimiento (tokens.css:545).
- --apoyo-disco (juego.css:565-574) sigue vivo solo por el borde de .ejes-tapa (juego.css:2131). En tema y por-la-letra queda declarado sin que nadie lo lea.
- --tinte-sello y el --apoyo local de cancionero .disco siguen (relleno del sello, color del h1, borde).

Escenario alternativo, si se conservaran las C (no es lo que pidió el usuario): --tinta-registro seguiría viva por .papel-ficha y .gabinete. Morirían solo las líneas del mapa casete/juego, juego.css:3648, sitio.css:1643 y skayboy.css:74.

====================================================================
6. TESTS QUE DEPENDEN DE ESTO, Y CÓMO ENMENDARLOS
====================================================================

T1. estilos.test.ts:269-303, "UX-22 §8: el registro imperfecto vive solo en la letra grande, nunca en un parrafo"
- Se rompe. La línea 300 (`assert.ok(encontrados.length > 0, 'el registro imperfecto desaparecio de las hojas')`) falla en cuanto sale A1-A5.
- Además solo mira HOJAS: no ve los <style> de las páginas.
- Enmienda: invertirlo a "D-64: ninguna letra lleva sombra".
  - Barrer todoElCss() (estilos.test.ts:793-811: hojas, tokens.css y todos los <style> de .astro, con los comentarios ya sacados).
  - Fallar ante cualquier `text-shadow` cuyo valor no sea `none`.
  - Sumar su "ese control sabe encontrar": `.x{text-shadow:2px 2px 0 var(--borde)}` tiene que caer; el mismo texto dentro de un comentario y `text-shadow: none` no.
  - Así quedan cubiertos solos los cuatro "nunca" de UX-22 §8, incluidos los artículos graves.
- Con esto sobran C.1 1) de ESPEC-D-64 (sacar ítems de PERMITIDOS) y C.1 3) ("la tapa de un juego no lleva sombra"). La lista PERMITIDOS desaparece.

T2. Test nuevo propuesto: "D-64: ninguna pieza lleva sombra desplazada"
- Sobre el mismo todoElCss(), cada capa de cada `box-shadow` tiene que tener los dos desplazamientos en 0 literal y blur 0. Solo pasan `none`, `0 0 0 <ancho> <color>` e `inset 0 0 0 <ancho> <color>`.
- Un desplazamiento hecho con var() (var(--registro)) o un `0 4px 0` falla.
- Permite D1-D4 sin lista de excepciones.
- "Ese control sabe encontrar": tiene que caer `.x{box-shadow:0 4px 0 var(--borde)}` y `.x{box-shadow:var(--registro) var(--registro) 0 red}`, y pasar `.x{box-shadow:inset 0 0 0 3px var(--fondo)}`.
- Complemento opcional: un grep de src/scripts y src/lib (sin tests) por `textShadow|boxShadow|shadowColor|shadowBlur|shadowOffset[XY]` y por `setProperty('(box|text)-shadow'`, para cuidar las islas y el canvas de tarjeta.ts y lamina.ts.

T3. estilos.test.ts:1154-1163, "UX-33 §1.4: el borde y la figura no llevan alfa; los dos anillos son el par de siempre"
- En la línea 1160 exige `box-shadow: inset 0 0 0 var(--anillo) var(--fondo)`.
- Sigue verde si D4 se queda y si T2 se escribe permitiendo anillos sin desplazamiento.
- Si en cambio se prohibiera todo box-shadow, habría que pasar el anillo a `outline` con offset negativo y cambiar esa regex.

T4. movimiento.test.ts:126-146, "los tokens de movimiento que UX-20 §4 nombra existen de verdad"
- Las líneas 140-141 piden '--registro' y '--registro-angulo'.
- Sigue verde mientras las pasadas (D7) los usen. No pide --tinta-registro, así que borrarla no lo rompe.
- Solo hay que enmendarlo si D7 también sale: sacar las dos entradas y cambiar UX-22 §13.
- Las transiciones que pierden `box-shadow` (juego.css:333, 1140, 1430, 2397 y las de las .astro) siguen usando `--duracion-toque` y `--curva-cinta`, así que los tests de tiempos y curvas sueltas no cambian.

T5. contraste.test.ts
- Ningún par depende de una sombra. tokens.css:248-250 ya dejaba el eco fuera a propósito. No se rompe nada ni hace falta enmendar.
- Los pares nuevos de ESPEC-D-64 C.3 (tinta, mano y sellos sobre el papel viejo) no cambian por esto.

T6. tema/paleta.test.ts:35-55, "cada regla de disco toma su color del token de ESE disco"
- Exige que `.disco--X` use `var(--disco-X-apoyo)`. Sigue verde.
- Después del cambio, ese --apoyo-disco solo pinta el borde de .ejes-tapa. Lo dejaría así, con una nota.

T7. estilos.test.ts:256-267 (.estampa-papel con papel e isolation): no mira la sombra. Sigue verde.

T8. Listas de estados de estilos.test.ts (ESTADOS_TEMA 311-334 con .escuchar--sonando y .arriesgar--listo; ESTADOS_EJES 603-614 con .ejes-opcion--elegida y --antes) y la red "ninguna isla crea una clase modificadora que ninguna hoja pinte" (~840)
- Siguen verdes: esas clases conservan reglas propias (1402, 2416-2421 sin la sombra, 1169-1179).
- Ojo: el `:is(...) :is(.arriesgar--listo, .seguir)` de 1435 queda vacío y se borra. `.arriesgar--listo` sigue pintada por 1402.

Ningún otro test toca sombras. En skayboy/escena.test.ts y motor.test.ts "sombra" es nombre de variable. voz, fuentes, islas, redondopedia y sitio/*.test no dependen de nada de esto.

====================================================================
7. LO QUE HAY QUE CAMBIAR DE ESPEC-D-64 Y DE LOS PAPELES
====================================================================

ESPEC-D-64 (Docs/SUGERENCIAS/ESPEC-D-64-la-tapa-se-sella.md) quedó corta frente al pedido nuevo:
- B.1: --tinta-registro se borra, no se recomenta.
- B.2 g): la regla de registro de sitio.css:1607-1644 se borra entera, no se achica a `.marca-grande, .articulo… h1`.
- B.3 a): en .marca salen 3648-3649.
- B.4: también salen el eco de .gabinete y el de .fin-nivel.
- B.6: casi todo lo que listaba como "lo que no se toca" pasa a estar en el alcance: .marca, .marca-grande, .caratula-marca, el h1 de artículo, .estampa-disco, .papel-ficha, .estampa-papel, .ejes-tapa-etiqueta, .casete-arte--entera y el canto de .primario.
- C.1 1) y 3): los reemplazan T1 y T2.
- F.5 queda contestado por el usuario: la marca entra.
- Hay que sumar .oktubre-jugar (B2).
- En D.1, la línea "La marca, el h1 de artículo y la estampa conservan el registro" se invierte.
- En "Consume y enmienda" hay que sumar: D-33 entero (el registro como recurso permanente se retira), D-49 (sombra de recorte), D-54 punto 6 (canto), D-57 (canto de las hojas), D-31 (sombra dura de hoja-versos), UX-22 §8, §9 y §13, UX-30 §4, UX-36 §3.2 y §4, UX-37 §2 y §4, y UX-35 §3 (.caratula-marca).

Regla de marca: en .claude/rules/diseno-marca.md:77, el reemplazo de la "sombra difusa" dice "Sombra dura desplazada (offset plano, como papel sobre papel) o nada". Pasa a "nada: la pieza se recorta por borde grueso y cinta". La escribe el hilo principal.

Comentarios de código que justifican la sombra ("la única sombra que diseno-marca.md admite") y hay que reescribir:
- tokens.css: 239-251 y 545.
- sitio.css: 695-696, 882-884, 983, 1016-1021, 1036-1037 ("y el apoyo para el registro"), 1259-1262, 1272 y 1607-1632.
- juego.css: 324-329, 422-424, 486-487, 686-687, 970-971, 1114-1119, 1413-1417, 1700-1712, 2268-2270, 2410-2413, 2532, 3644-3660, 3720-3728 ("el canto es apoyo: borde y sombra"), 4128-4129 y 4304-4306.
- skayboy.css: 18, 65-68, 164-169, 1188-1189, 1467-1468 y 1620.
- Fuera de las hojas: cancionero.css:64, adivinar-el-tema.astro:295-296, adivinar-por-la-letra.astro:196-197, redondopedia/[slug].astro:144-146 y skayboy-y-poligirl.astro:12.

Lienzo: según el circuito de diseno-marca.md, el cambio entra primero por el lienzo. Lo que se ve de la sombra está en las hojas 07 (línea y textura) y 08 (componentes), y queda una deuda de pegado del mismo tipo que T-411. No abrí el lienzo.

====================================================================
8. CUENTA FINAL
====================================================================

- Letras con sombra (A): 5 reglas. A la vista: 1 marca grande, 11 títulos de casete, 9 o más h1 de juego, la marca de cabecera en todas las páginas de juego, la de la carátula y el nombre de disco de la estampa.
- Eco en sellos (B): 2 reglas, 12 sellos.
- Objetos y recortes (C): 27 entradas, más 2 copias locales en .astro.
  - Tres de ellas quitan una señal de estado y necesitan reemplazo: C25 (el pozo elegido queda solo con color), C26 y C27.
  - Una ya es CSS muerto (C11).
- Se quedan 7 (D1-D7): anillos sin desplazamiento, filtros y el corrimiento de las pasadas.
- Muere --tinta-registro con sus 20 declaraciones, más --canto-accion y --canto-tecla. --registro y --registro-angulo viven por las pasadas.
- Un solo test se rompe: estilos.test.ts:269-303, que hay que invertir. Hay que tener en cuenta uno más, estilos.test.ts:1154-1163, si la regla nueva prohíbe todo box-shadow.

Para la parte (b), solo como referencia, porque no la analicé: hoy las letras de disco aparecen en .marca-grande, .marca-chica, .marca, .caratula-marca y .oktubre-sello (calco de Oktubre), en .estampa-disco--oktubre y --lobo-suelto, y en .primario.firma (Patricio Rey Fan).


---

## Letras: cobertura, métricas, derivación de tildes

INFORME: las letras de disco, relevamiento técnico (worktree RicotaArcade-fondo, rama diseno/fondo-multitud). No toqué nada del repo.

Base de todo lo generado: C:/Users/santi/AppData/Local/Temp/claude/C--Users-santi-Proyectos-InstanciadorProyectos-RicotaArcade/52dfba30-4949-4ce7-a4bb-dc9786518d2d/scratchpad/letras/ (en adelante, BASE)

RESUMEN
- A Patricio Rey Fan y a Lobo Suelto Fan les faltan solo 11 glifos para cubrir todo el texto grande del sitio. Medí 45 textos (títulos de casete, h1, botones, encabezados de resultado, categorías, marca y nombres de disco). Faltan Á (aparece en 11 textos), Í (6), É (3), Ó (3), Ú (1) y los signos ! ¡ ? ¿ . ,
- Al calco de Oktubre le falta casi todo lo de afuera de la marca: L (27 textos), S (21), P (16), M (13), G y V (9 cada una), además de Q Y J Z, las tildes y los signos.
- La Ñ de Lobo Suelto existe. Benjamín Zavala la dibujó y está en el TTF del zip, pero se perdió cuando se armó la .woff. Recuperarla cuesta cero.
- Las dos fuentes de Zavala apoyan las letras unas 100 unidades por debajo de la línea de base. Por eso cada letra que cae al repuesto salta de renglón. Corregido el renglón, la altura de mayúscula de Lobo (686) y la del calco (688) coinciden con la de Archivo Black (688).
- Patricio Rey Fan hoy no se dibuja en ninguna parte. Los seis botones de compartir llevan `.con-tilde`, que los pasa a la rotulada.
- Los acentos hechos con la propia fuente se sostienen en Lobo y en Patricio. El injerto desde Archivo Black o DejaVu funciona a la vista en Patricio y mal en Lobo, pero trae un problema de licencia (punto 4).

------------------------------------------------------------
1) CADA FUENTE (fontTools 4.60, medido)
------------------------------------------------------------

**Oktubre Calco** (oktubre-calco.woff, 2476 B, contornos CFF, v0.4)
- Cubre 31 caracteres: espacio, A B C D E F H I K N O R T U y la Í.
  - Ojo: el contexto dice "ni tildes", pero la Í existe desde `D-60`.
  - Las minúsculas apuntan al mismo glifo que la mayúscula. Son 17 glifos en total.
- Métricas: unitsPerEm 1000.
  - hhea y typo 760/-140; win 800/200.
  - El bit de USE_TYPO_METRICS está apagado, así que Windows y Mac dan alturas de línea distintas.
  - OS/2 declara capHeight y xHeight en 0. La mayúscula medida mide 688 y el pie apoya en 0 a 9.
  - La Í llega a 856, por encima del alto de ventana (800).
- Avance medio 578 (de 261 a 650): los textos salen un 15 % más angostos que en Archivo Black.
- Sin kerning (no hay tabla kern ni GPOS). La Í es una unión de contornos, no un componente.
- Trazo macizo: trazo medio 165 u (16,5 % del em), palo de la I de 186 u. Es casi el mismo peso que Archivo Black (178).
- El canto es recto. Hay esquirlas del calco en la T, la U y la A, y la B va espejada.

**Patricio Rey Fan** (patricio-rey.woff, 4848 B, contornos TrueType, hecha con Calligraphr el 29-06-2026)
- Cubre 63 caracteres: espacio, 0-9, A-Z, a-z. Las minúsculas son la misma mayúscula; son 38 glifos.
  - Sin tildes, sin Ñ, sin signos.
- Métricas: hhea 666/-150 con 90 de interlínea; typo 800/-200/90; win 666/150. OS/2 declara capHeight 531.
- El pie está corrido: la mediana de las mayúsculas va de -96 a 536.
- Avance medio 759: los textos salen del mismo ancho que en Archivo Black (±3 %). Sin kerning.
- Estilo: recorte de papel macizo, trazo medio 164 u (el peso de Archivo Black).
  - Cada letra está girada distinto: el canto se inclina hasta 60 px en 800.
  - Casi todas llevan una ranura blanca.
- La referencia del zip es el "PATRICIO REY" del PR coronado, no la letra de una tapa.

**Lobo Suelto Fan** (lobo-suelto.woff, 8304 B, TrueType, Calligraphr, 08-07-2026)
- Cubre 53 caracteres: espacio, A-Z, a-z (son 28 glifos). La .woff es un recorte del TTF del zip y le sacó la Ntilde.
- Métricas: hhea 743/-163/90; typo 800/-200/90. OS/2 declara capHeight 584. Pie corrido: de -112 a 578.
- Avance medio 594: los textos salen un 25 % más angostos que en Archivo Black. Sin kerning.
- Estilo: un trazo a mano alzada, de grosor parejo, hecho contorno.
  - Trazo de 44 a 47 u (4,7 % del em); el palo de la I mide de 32 a 37.
  - Remata en bochas y tiene doble trazo en la E y la F. Son unos 157 puntos por glifo.
- Formas "cirílicas": R espejada (Я), N espejada (И), una B que se lee 8.
- La U dibujada como W: se lee "SWELTO", "JWGÁ", "PINGWINO". Es un riesgo de lectura.
- Tamaño mínimo: a 15 px el trazo mide 0,7 px y se empasta. Hacen falta unos 28 px para que el trazo llegue a 1,3 px.

**Archivo Black** (el repuesto)
- 379 caracteres, mayúscula de 688, kern en GPOS. Licencia OFL sin nombre reservado.

**Tamaño mínimo para leer:** Lobo desde 28 px; Patricio desde 18 px (las ranuras se pierden, y el giro de cada letra cansa en frases de más de unas cuatro palabras); el calco desde 17 px (ya va a 16,8 en la marca chica).

------------------------------------------------------------
2) QUÉ SE PUEDE DERIVAR, CÓMO, RIESGO Y COSTO
------------------------------------------------------------

El prototipo está en BASE/proto/:
- componer.py arma los acentos y signos de Patricio y Lobo; calco.py, los del calco.
- pagina.py arma la página de prueba; también hay prueba.html, zoom.html y calco.html.
- Las .woff que salieron: patricio-{propio,injerto,propio-renglon}, lobo-{propio,injerto,propio-renglon} y calco-proto.

Lo comparé en Chrome sin interfaz, a 1x y 2x.

**Lobo Suelto**
- Ñ: se recupera la de Zavala del zip `Docs/INVESTIGACION/Tipografia/Lobo-Suelto-Cordero-Ata-Regular.zip`. Costo cero, riesgo nulo: es del autor.
- Tildes Á É Í Ó Ú, diéresis y los signos . , ! ? ¡ ¿ hechos con material propio:
  - Método: un trazo dibujado con `pathops.stroke` al grosor medido (44 u) y la bocha de remate de la tilde de Zavala (radio 30).
  - Se sostiene de 34 a 72 px: mismo peso, mismo remate.
  - Lo que lo delata: la línea sale más lisa que el pulso del original. Se corrige metiéndole 2 o 3 u de temblor.
  - Con el mismo método salen : ; · – — " ' ( ).
- El injerto desde DejaVu Sans no sirve: ninguna escala empata a la vez el tamaño y el grosor. DejaVu de peso normal tiene el doble de trazo.
- Hoy, con la caída a Archivo Black, es el peor caso: una mancha negra cuatro veces más gruesa en mitad de la palabra, más el salto de renglón.
- Números: el alfabeto original no los trae (`RES-42`: 58 glifos). Dibujarlos es inventar, riesgo alto. No los recomiendo.
- Costo: 3 a 5 horas en total. Riesgo bajo a medio.

**Patricio Rey**
- Tilde aguda propia: la cabeza del palo de la I, recortada a 0,30 × 0,85 y sesgada unos 35 grados, queda como una cuña cortada a tijera.
  - La primera prueba, sin sesgo, se leía como punto o tilde grave. Ya está corregida.
- Ñ: la S acostada y aplastada. Se lee como tilde y conserva la ranura; queda algo barroca.
- Diéresis: dos tacos sacados del palo de la I.
- Signos propios: fallan. El ? armado con la cabeza del 2 se lee como ";", y la coma sale como punto.
- Las piezas de Archivo Black, giradas 6 grados, pegan bien porque tienen el mismo peso. Pero se puede evitar copiarlas: alcanza con dejar que los signos caigan a Archivo Black por la pila de CSS, ya con el renglón corregido.
- Costo: 2 a 4 horas. Riesgo bajo.

**Oktubre Calco** (mismo método que `scripts/derivar-oktubre-calco.py`: recortar y pegar con operaciones booleanas)

| Qué | Cómo | Probado | Costo | Riesgo |
|---|---|---|---|---|
| Á É Ó Ú | el mismo polígono de acento de la Í, corrido al centro de cada vocal | sí | 30 min | bajo |
| Ñ | una onda de 92 u (lo único dibujado a mano) | sí; queda lisa al lado del borde comido, hay que "morderla" | 1 h | medio |
| L | palo de la I + brazo bajo de la E | sí | 1 h (con la P) | bajo |
| P | la R sin la pierna | sí; deja un resto del arranque de la pierna que hay que limpiar | 1 h (con la L) | bajo |
| . , ! | tacos del palo de la I | — | 30 min | bajo |
| Q, G, M, V, W, Y, Z | palos de la I y la diagonal de la N, espejada | no | 3 a 6 h | medio; la M y la W se notan armadas |
| S, J, números | no salen de recortes | no | — | alto |

Para la S, la J y los números, el camino auténtico es calcar la minúscula de la contratapa (`RES-41`) o una foto a 300–600 dpi del disco del usuario (`RES-39`, paso 1).

**Para producción, en las tres**
- Corregir el renglón: +92 en Patricio y +108 en Lobo. Reescribir hhea, typo y win, y prender USE_TYPO_METRICS.
- Mantener contornos TrueType. El prototipo pasó a CFF por comodidad y duplicó el peso (Lobo, de 8,3 a 15,7 KB).
- Servir en woff2. Medido sobre las fuentes actuales: Lobo 7,5 KB, Patricio 4,0 KB, calco 2,2 KB.
- Script reproducible con fechas fijas, y una guarda de cobertura por fuente en `fuentes.test.ts`.

**Cruce con la almohadilla de `D-64`** (la tinta gastada en máscara de la especificación ganadora)
- La máscara recorta en el borde de la caja. Cualquier tilde que suba por encima de la caja de línea se corta: hace falta el mismo colchón que la especificación le calculó a Archivo Black.
- En Lobo, la sal (3,5 % de huecos de ~1 px) corta trazos de 1 a 2 px. No conviene enmascarar Lobo por debajo de unos 2,5 rem.

------------------------------------------------------------
3) USO ACTUAL
------------------------------------------------------------

**`--fuente-titular`** (Oktubre Calco, luego Archivo Black, luego Arial Black). Todo lo que se escribe en el calco hoy entra entero.

| Selector | Archivo:línea | Texto |
|---|---|---|
| `.marca-chica` | sitio.css:446 | FICHÍN RICOTERO (Base.astro:98-99) |
| `.marca-grande` | sitio.css:459 | FICHÍN RICOTERO (index.astro:209) |
| `.oktubre-sello` | sitio.css:564 | OKTUBRE (index.astro:222) |
| `.ejes-marca-sitio` | juego.css:2495 | la marca, desde partida-dos-ejes.ts:299 |
| `.marca` | juego.css:3637 | FICHÍN RICOTERO en las páginas de juego |
| `.caratula-marca` | juego.css:3891 | FICHÍN RICOTERO (Caratula.astro:57) |
| `.estampa-disco--oktubre` | juego.css:4319 | OKTUBRE |
| canvas | tarjeta.ts:71 y lamina.ts:53 | FICHÍN RICOTERO |

- `.marca` tiene además tres reglas propias de página: adivinar-el-tema.astro:248, adivinar-por-la-letra.astro:166 y quiz.astro:86.
- Lo vigila `fuentes.test.ts:141-184`.

**`--fuente-marca-firma`** (Patricio Rey Fan)
- Se usa en `.primario.firma`, juego.css:417.
- Pero los seis botones llevan además `con-tilde`, que en juego.css:441 lo pasa a la rotulada:
  - compartir.ts:72, partida.ts:386, partida-tema.ts:1332, partida-por-la-letra.ts:896, partida-ponelos.ts:413, partida-mas-o-menos.ts:278.
- Resultado: la fuente no pinta nada y el navegador ni la baja.

**`--fuente-lobo-suelto`**
- Se declara en tokens.css:256, fuera de la tabla de `diseno-marca.md`.
- Solo la usa `.estampa-disco--lobo-suelto` (juego.css:4325) para "LOBO SUELTO" y "CORDERO ATADO". Lo decide `LETRA_PROPIA` en pasadas.ts:89-93.
- Aparece en la estampa de la revelación de "Adiviná el tema" y de "Sacalo por la letra".

**Todo lo demás va en `--fuente-rotulada`** (121 usos en CSS y 7 en .astro): títulos de casete, h1 de juego (juego.css:3704), h1 de artículo (sitio.css:1660), título de sección, sellos y botones.

**Hoy no cae nada al repuesto, porque el código lo esquiva:**
- `.con-tilde` para el botón de compartir.
- `CNT-14` §2.7: solo tres nombres de disco van en su propia letra.
- `.oktubre-cumple` va en la rotulada por "CUMPLIÓ" y los números (sitio.css:571-572).
- El h1 de Skayboy va en la rotulada "por la deuda del calco" (skayboy.css:65-75).

**Mecanismo**
- No hay `unicode-range` en ningún lado. El repuesto es letra por letra, por la pila de `font-family`.
- Las cuatro fuentes llevan `font-display: swap`. Solo se precargan el calco y Archivo Black (Cabeza.astro:69-70).
- Lobo se baja tarde: cuando aparece la estampa hay un parpadeo de Archivo Black a Lobo, con un cambio grande de ancho y de peso.
- `fuentes.test.ts` vigila Archivo Black y el calco, no Patricio ni Lobo.

**Inventario de sombras sobre letras** (para la parte "sacar la sombra de todos lados")

| Selector | Dónde |
|---|---|
| `.marca-grande`, `.casete-titulo`, `.articulo:not(.articulo--grave) h1` | sitio.css:1634-1638 (+ tinta en 1642) |
| `.marca` | juego.css:3648-3649 |
| `.pantalla h1` | juego.css:3661-3663 |
| `.caratula-marca` | juego.css:3895 |
| `.estampa-disco` | juego.css:4314 |
| `.juego-skayboy .pantalla h1` (fija la tinta del eco) | skayboy.css:73-80 |
| sombra de eco del sello `.casete-accion` | sitio.css, la línea que borra el punto B.2 c) de la especificación |

- La lista cerrada de `estilos.test.ts:269-303` necesita al menos un selector permitido para seguir verde. Si se va todo, hay que reescribir ese test.
- Los pinceles de canvas no dibujan eco.

**Ideas para usar las letras en más lugares**, una vez derivadas y respetando `D-19`
- Patricio: sacar `.con-tilde` (el botón vuelve a la firma) y llevar los encabezados de resultado.
- Lobo: títulos de mitología grandes, nunca botones (por la U que se lee W) y nunca con números.
- Calco: con L, P y las tildes entran "LA REDONDOPEDIA", "TOCÁ" y "LEÉ". Para los títulos de casete hacen falta además S, M, G, V, Y y Q.

------------------------------------------------------------
4) LICENCIAS Y CRÉDITO
------------------------------------------------------------

**Las dos fuentes de Zavala**
- `RES-42` dice que se distribuyen gratis en ffonts.net "sin licencia declarada".
- El zip trae NOTA.txt ("FUENTE CREADA POR BENJAMIN ZAVALA") y ffonts.net.txt ("Downloaded from https://www.ffonts.net/…").
- La tabla de nombres dice "Created with Calligraphr.com" y no tiene aviso de copyright.
- El indicador de incrustación (`fsType`) está en 0: es un bit técnico, no un permiso.
- No hay permiso escrito para usarlas ni para modificarlas. El dibujo de base además es de otros: el alfabeto de Semilla Bucciarelli (`RES-36`) y el logo del PR.

**Oktubre Calco**
- `RES-43`: el calco es nuestro y el dibujo es de Rocambole (`RES-31`).

**CNT-01**
- No tiene fila para ninguna de las tres letras de disco. Solo cubre Archivo Black (G) y DejaVu (H). Es un hueco del mapa.
- Zavala no aparece acreditado en ninguna parte visible del sitio.
- Bajo `D-14` nada de esto bloquea: si alguien reclama, se saca el `@font-face` y todo cae a Archivo Black sin romper nada.
- Propuesta para contenido, vía `Docs/SUGERENCIAS/`: una fila "Letras de disco" y una línea de crédito.

**El injerto tiene un costo de licencia que conviene evitar**
- La cláusula 5 de la OFL dice que la fuente, modificada o no, en parte o entera, "must be distributed entirely under this license". Copiar contornos de Archivo Black adentro de una fuente de Zavala obligaría a ponerla bajo OFL, y la parte de Zavala no se puede relicenciar.
- DejaVu exige llevar su aviso.
- Salida limpia: derivar solo con material de la propia fuente y dejar el repuesto en su archivo aparte, por la pila de CSS.

**Fichas RES- que habría que pedirle a investigador**
- Auditar Lobo Suelto contra las tapas reales: la U-W, la R espejada (`RES-42` lo dejó pendiente).
- Si en la gráfica de *Lobo suelto* o *Cordero atado* hay tildes, Ñ o números de Semilla para calcar.
- Si Zavala publicó condiciones de uso.
- A qué pieza corresponde su "Redonditos de Ricota", que está en el zip y salió del sitio con `D-51`.

------------------------------------------------------------
PNG (en BASE/png/)
------------------------------------------------------------
- specimen-oktubre-calco.png, specimen-patricio-rey.png, specimen-lobo-suelto.png, specimen-archivo-black.png
- zoom-lobo.png, zoom-patricio.png, calco-contornos.png
- lobo-ntilde-original-zavala.png (la Ñ recuperada)
- ref-lobo-zip.png, ref-patricio-zip.png, ref-redonditos-zip.png
- proto-acentos-1.png a proto-acentos-4.png (cuatro variantes por fuente a 64, 34 y 15 px; la página entera es proto-acentos.png)
- proto-zoom-x2-patricio.png, proto-zoom-x2-lobo.png (a 2x)
- proto-calco.png, proto-calco-x2-crop.png

Scripts de medición en BASE: inspeccion.py, trazo.py, cobertura.py, specimen.py.


---

## Lo que grita: cada texto corto del sitio y qué letra podría llevar

INFORME: lo que grita en Fichín Ricotero. Inventario de piezas, sombras y letras de disco

Base de todas las rutas: C:/Users/santi/Proyectos/InstanciadorProyectos/RicotaArcade-fondo (rama diseno/fondo-multitud, con D-63 todavía sin commitear en el árbol). No se editó nada del repo. Las muestras y las cuentas quedaron en C:/Users/santi/AppData/Local/Temp/claude/C--Users-santi-Proyectos-InstanciadorProyectos-RicotaArcade/52dfba30-4949-4ce7-a4bb-dc9786518d2d/scratchpad/inv-fuentes/:
- muestras.png: las cinco letras con textos reales.
- tamanos.png: legibilidad sobre papel entre 13 y 34 px.
- cobertura.py: los huecos de cada pieza en cada fuente, medidos sobre los textos reales del copy y de los JSON.

======================================================================
0. HALLAZGOS QUE CAMBIAN EL PLANTEO
======================================================================

1. Patricio Rey Fan no se dibuja en ninguna pantalla.
   - D-19 la asigna a "resultado y compartir (Gulp! + el lettering del logo)".
   - Su único uso es .primario.firma (juego.css:410-426). Los seis botones que la llevan también llevan .con-tilde (juego.css:441-444), que la pisa con Archivo Black: compartir.ts:72, partida.ts:386, partida-tema.ts:1332, partida-por-la-letra.ts:896, partida-mas-o-menos.ts:278 y partida-ponelos.ts:413.
   - El navegador ni la baja. Para que vuelva falta una sola letra: la Í de COMPARTÍ.

2. Lobo Suelto Fan se usa en un solo lugar: el nombre del disco en la estampa de la revelación cuando el tema es de Lobo suelto o de Cordero atado (juego.css:4324-4327, lib/tapa/pasadas.ts:90-94, scripts/sacar-temas.ts:113).

3. Oktubre Calco sí tiene una tilde, la Í (U+00CD y U+00ED), derivada en D-60 por scripts/derivar-oktubre-calco.py.
   - Cubre A B C D E F H I K N O R T U Í, con la minúscula apuntando a la misma mayúscula.
   - Hay dos lugares que todavía dicen "solo A B C D E I K O R T U" y están desactualizados: la tabla de fuentes de .claude/rules/diseno-marca.md y skayboy.css:69-70. El texto de la tarea también dice "ni tildes", y no es así.
   - Lo que de verdad le falta es G J L M P Q S V W X Y Z, además de los números y los signos. Fuera de FICHÍN RICOTERO y OKTUBRE no escribe casi nada del sitio.

4. El lobo-suelto.woff que sirve el sitio perdió la Ñ que el original sí trae. Docs/INVESTIGACION/Tipografia/Lobo-Suelto-Cordero-Ata-Regular.zip tiene Ntilde dibujada (U+00D1 y U+00F1), así que se recupera volviendo a recortar el subconjunto, sin dibujar nada. El Patricio Rey del zip no trae nada más que lo que ya se sirve (A-Z, 0-9).

5. En el repo hay una cuarta letra fan que no se usa: "Redonditos de Ricota", de Zavala (RES-42, mismo lote).
   - Tiene A-Z y 0-9, sin tildes ni signos.
   - Es el lettering del logo de la banda con la figura encadenada.
   - Chica, es la más legible de las cuatro fan (tamanos.png).
   - No viste ningún disco fichado.

6. El test del eco exige que el eco exista. estilos.test.ts:300 dice `assert.ok(encontrados.length > 0, 'el registro imperfecto desaparecio de las hojas')`.
   - Sacar la sombra "de todos lados" lo pone en rojo por construcción. Hay que invertirlo ("ningún text-shadow en letra"), no ir borrando selectores de PERMITIDOS (estilos.test.ts:281-290).
   - La ESPEC-D-64 contaba con que la marca, el artículo y la estampa conservaran el eco (punto C.1-1 y "lo que no se toca" en B.6). El pedido nuevo lo cambia; la espec ya lo había dejado anotado como riesgo F.5.

7. La ESPEC-D-64 no nombra el eco del sello del afiche de octubre. .oktubre-jugar (sitio.css:703) tiene el mismo box-shadow de "segunda pasada" que .casete-accion (sitio.css:984).

8. Hoy el encabezado del resultado tiene cuatro formas distintas:
   - Quiz y Más o menos: rótulo más h2.tramo.
   - Adiviná el tema y Sacalo por la letra: rótulo, h2.tramo y la cifra.
   - Completá la letra y Adiviná la tapa: un h2 sin clase que dice "Cómo te fue" (partida-letra.ts:233, partida-tapa.ts:264). Sale en la letra del sistema, en negrita y a 1,5em, que es lo que pone el navegador por defecto.
   - Skayboy no tiene resultado.

   Conviene igualarlas antes de tocar la letra.

======================================================================
1. SOMBRAS Y ECOS DE LETRA (lista completa)
======================================================================

Hay cinco reglas de text-shadow con --registro, todas detrás de letra:

a) sitio.css:1634-1638, sobre .marca-grande, .casete-titulo y .articulo:not(.articulo--grave) h1.
   - La marca grande lleva el gris de Oktubre (sitio.css:1642-1644).
   - El título de casete toma el --tinta-registro del mapa de variantes (sitio.css:1023-1026, 1040, 1047, 1054). A1 (marca) y A5 (momo) no lo fijan y caen a --borde.
   - El artículo lleva el apoyo de su categoría (sitio.css:1602-1605).
   - sitio.css:1164-1167 (.cocina--*) es CSS muerto: ninguna página usa .cocina.

b) juego.css:3636-3650, .marca: la firma de la cabecera de los diez juegos, con eco en --borde (líneas 3648-3649).

c) juego.css:3661-3663, .pantalla h1. Alcanza a:
   - los h1 de los nueve juegos;
   - el de Skayboy, que tiñe el eco con el crema de Gulp! (skayboy.css:74);
   - "Diagnóstico de audio" (diagnostico-audio.astro:35), que está adentro de section.pantalla.

d) juego.css:3895, .caratula-marca (solo desde 64rem), con eco en --borde.

e) juego.css:4314, .estampa-disco, con eco en --apoyo-disco.

Los tokens están en tokens.css:239-251 (--registro, --registro-angulo, --tinta-registro). Si salen todos los text-shadow:
- --registro lo siguen usando los box-shadow de abajo y movimiento.test.ts:140-141;
- --tinta-registro solo lo leen .papel-ficha y Skayboy.

Los pinceles no dibujan eco: tarjeta.ts, lamina.ts y el taller de postales (scripts/generar-dos-ejes.mjs). public/tarjeta.png no tiene texto (generar-marca-social.mjs:18).

box-shadow en piezas que llevan letra que grita (hace falta decidir si "de todos lados" las incluye):

- Eco de sello:
  - .casete-accion, sitio.css:984 (D-64 ya lo saca);
  - .oktubre-jugar, sitio.css:703 (D-64 no lo nombra);
  - .fin-nivel de Skayboy, skayboy.css:1492: registro en el crema de Gulp!, la tarjeta de "NIVEL N DE 6 · PASADO".

- Canto de tecla (sombra dura abajo, que se hunde al apretar):
  - .primario, juego.css:330 y 339, más el de .primario.firma (juego.css:425);
  - .escuchar, juego.css:1137 y 1146;
  - .arriesgar y .seguir de tema y por-la-letra, juego.css:1427-1441;
  - las copias con alcance en adivinar-el-tema.astro:311/319 y adivinar-por-la-letra.astro:200/209.

- Recorte sobre recorte:
  - .boton-recorte, cancionero.css:65;
  - .ejes-tapa-etiqueta, juego.css:2182;
  - la cinta .volver, sitio.css:442.

- Sin letra grande (son objetos o cajas):
  - sitio.css:890, 1246 y 1274 (.papel-ficha, de registro);
  - juego.css:488, 688, 972, 1176, 1289, 1640, 1715, 2132, 2277-2295 (la pila de hojas de dos ejes), 2391, 2481, 3163, 4187 y 4499;
  - cancionero.css:85;
  - skayboy.css:177 (.gabinete, de registro).

No cuento los filetes de juego.css:1046 y 3456 ni el de skayboy.css:1267.

======================================================================
2. LAS LETRAS, MEDIDAS (fontTools sobre los archivos servidos)
======================================================================

Referencia: Archivo Black (AB) tiene un ancho medio de 754 unidades por letra y la E mide 688.

| Letra | Archivo | Cubre | Ancho medio (AB 754) | Altura de la E (AB 688) | Cómo se lee chica |
|---|---|---|---|---|---|
| Oktubre Calco | 17 glifos, 2,5 KB | ABCDEFHIKNORTU Í y espacio | 578 | 689 | Bloque, se lee bien. El problema es que le faltan 12 letras comunes. |
| Patricio Rey Fan | 38 glifos, 4,8 KB | A-Z, 0-9 y espacio | 762 | de -96 a 542 (las letras bailan) | Pesada, en cuña. Se lee desde unos 19 px. A igual cuerpo se ve más chica que AB. |
| Lobo Suelto Fan | 28 glifos, 8,3 KB | A-Z y espacio | 547 | de -158 a 598 | Trazo de pelo con adornos, R y N espejadas. Ilegible por debajo de unos 24 px. |
| Redonditos de Ricota (no se sirve) | zip de RES-42 | A-Z y 0-9 | 664 | 690 | La más legible chica de las fan. |

- En las cuatro fan la minúscula es la misma mayúscula: text-transform no cambia nada, y "JUGÁ", "Empezá" y "Jugá" salen iguales.
- Ninguna tiene signos: ni . , : · ¿ ? ¡ ! ( ) + … ←.
- El repuesto es glifo por glifo, así que una palabra con tilde sale con dos letras distintas. Es lo que se midió en US-02 y dio origen a .con-tilde.

======================================================================
3. INVENTARIO POR PANTALLA
======================================================================

Cada pieza da: marcado (archivo:línea) ← de dónde sale el texto, el selector con su letra y tamaño por corte (teléfono / 46 / 64 / 80 rem), la sección y el disco que viste, el texto, los caracteres especiales que pide y si es corta o larga.

3.1 PORTAL (src/pages/index.astro, src/layouts/Base.astro)

P1 Marca grande
- Marcado: index.astro:209, literal "FICHÍN RICOTERO". PORTAL.titulo (lib/sitio/copy.ts:18) existe, pero el marcado no lo usa.
- Estilo: .marca-grande (sitio.css:458-474), Oktubre Calco, rojo de marca.
- Tamaño: clamp(2.6rem, 13vw, 4rem) hasta 64rem; desde ahí clamp(4.25rem, 5.6vw, 5.75rem) (sitio.css:2003-2005).
- Disco: portada = Oktubre.
- Pide: Í. Corta. Lleva eco.

P2 Marca chica
- Marcado: Base.astro:98-100, literal.
- Estilo: .marca-chica (sitio.css:445-454), calco a 1.05rem en todos los cortes.
- Dónde: Redondopedia y cancionero. Pide Í. No lleva eco.

P3 Renglón de lugar
- Marcado: index.astro:210 ← LUGARES (copy.ts:109-132). Son 11 textos, el mismo componente en cada juego, en la Redondopedia y en el cancionero. El del portal: "Estás en la puerta, con las dos cintas."
- Estilo: .donde-estas (sitio.css:131-143), letra del sistema, 1.02rem; 1.12rem desde 64rem.
- Es la línea que canta (registro 1), pero va en --fuente por una decisión escrita en sitio.css:115-125: dos renglones seguidos en Archivo Black se empastan.
- Pide: Á É Ó , . Es una frase corta.

P4 Lado A / Lado B
- Marcado: index.astro:254 ← PORTAL.ladoA y PORTAL.ladoB (copy.ts:26-27): "Lado A · Para jugar", "Lado B · Para leer".
- Estilo: h2.lado (sitio.css:723-734), rotulada 0.85rem, mayúsculas, tinta tenue.
- La misma pieza aparece en las secciones de la Redondopedia (E2) y en la carátula (.caratula-lado, Caratula.astro:89, juego.css:3986-3996, 0.7rem).
- No viste disco. Pide ·. Corta, nombra.

P5 Título de casete (11)
- Marcado: index.astro:292 ← JUEGOS[].titulo (copy.ts:179-278), CASETE_CANCIONERO (copy.ts:297), CASETE_REDONDOPEDIA (copy.ts:308) y el de Skayboy (skayboy/copy.ts:13).
- Estilo: strong.casete-titulo (sitio.css:926-935), rotulada en mayúsculas.
- Tamaño: 0.95rem en teléfono y desde 46rem; 1rem desde 64rem (sitio.css:2082-2084); 1.04rem desde 80rem (sitio.css:2108-2110).
- Cada casete viste su disco:
  - A1 "Preguntas ricoteras": marca, Oktubre.
  - A2 "¿Qué tipo de ricotero sos?": Luzbelito.
  - A3 "Adiviná el tema": mitología, Lobo suelto.
  - A4 "Skayboy y Poligirl": historia, Gulp!.
  - A5 "Sacalo por la letra": Momo.
  - A6 "Completá la letra": letras, La mosca.
  - A7 "Ponelos en fila": ¡Bang!.
  - A8 "Adiviná la tapa": discos, Último bondi.
  - A9 "Más o menos": Un baión.
  - B1 "Letras y acordes": letras, La mosca.
  - B2 "La Redondopedia": historia, Gulp!.
- Pide: ¿ ? Á É. Corto (5 palabras o menos). Lleva eco.

P6 Sello de acción
- Marcado: index.astro:299 ← accion.
- Textos: JUGÁ (A1, A3, A4, A5, A6, A8, A9), EMPEZÁ (A2), ARMÁ (A7), TOCÁ (B1), LEÉ (B2).
- Estilo: .casete-accion (sitio.css:973-985), rotulada 0.9rem, letra --fondo sobre la tinta del disco.
- Pide: Á É. Lleva el box-shadow de eco.

P7 Pista
- Marcado: index.astro:303 ← pistaDe() de lib/sitio/caratula.ts: A1 a A9, B1, B2.
- Estilo: .casete-pista (sitio.css:990-997), rotulada 1rem en --papel-tenue.
- Es "escrita a mano". Registro 3.

P8 "En la cocina"
- Marcado: index.astro:301 ← PORTAL.enLaCocina (copy.ts:28).
- Estilo: .casete-pronto (sitio.css:1004-1014), 0.75rem.
- Solo aparece si "Completá la letra" no tiene banco. Registro 3.

P9 Afiche de octubre (se ve solo con data-mes=oktubre)
- Sello: index.astro:222 ← OKTUBRE.sello (copy.ts:342), "OKTUBRE". Estilo .oktubre-sello (sitio.css:562-569), calco, clamp(2.5rem, 13vw, 3.4rem); 4rem desde 64rem (sitio.css:2028-2030). No lleva eco.
- Estampa del cumpleaños: index.astro:223-225 ← copy.ts:344-346: "EL 4 CUMPLE 40", "HOY CUMPLE 40", "CUMPLIÓ 40 EL 4". Estilo .oktubre-cumple (sitio.css:573-583), rotulada 0.72rem. Registro 3.
- La que canta: index.astro:227 ← OKTUBRE.canta (copy.ts:348), "Sacá el disco del sobre, soplale el polvo.". Letra del sistema, 1.05rem / 1.12rem. Es una frase.
- Fechas: index.astro:233-235.
  - .oktubre-dia: rotulada 1.45rem / 1.7rem; textos "4", "7", "27".
  - .oktubre-disco: letra del sistema 0.74rem / 0.82rem; textos "Oktubre", "¡Bang! ¡Bang!", "La mosca y la sopa", "Lobo suelto", "Cordero atado", "Luzbelito".
- Botón: index.astro:240 ← OKTUBRE.jugar (copy.ts:355), "ADIVINÁ TEMAS DE OKTUBRE". Estilo .oktubre-jugar (sitio.css:689-704), rotulada 0.82rem, con box-shadow de eco.

P10 Cinta de regreso
- Marcado: Base.astro:97 y la cabecera de cada juego.
- Textos:
  - "AL FICHÍN" (PORTAL.volverAlArcade);
  - "Letras y acordes" (literal en letras-y-acordes/[slug].astro:41 y armar-cancionero.astro:34);
  - "A LA REDONDOPEDIA" (REDONDOPEDIA.volverPortada).
- Estilo: a.volver (sitio.css:429-443), rotulada 0.8rem, sin mayúsculas. Por eso "← Letras y acordes" sale en caja mixta.
- Pide: ← Í. Lleva el box-shadow de la cinta.

3.2 CABECERA COMÚN DE LOS JUEGOS

J1 Marca de cabecera
- Marcado: <p class="marca"> literal en quiz.astro:57, adivinar-el-tema.astro:91, adivinar-la-tapa.astro:57, adivinar-por-la-letra.astro:99, completar-la-letra.astro:62, dos-ejes.astro:57, dos-ejes/[cu].astro:65, mas-o-menos.astro:53, ponelos-en-fila.astro:95 y skayboy-y-poligirl.astro:103.
- Estilo base: .marca (juego.css:3636-3650), calco, clamp(1.9rem, 9vw, 2.6rem).
- Overrides:
  - el <style> de quiz.astro:85-92 la sube a clamp(2.4rem, 11vw, 3.5rem);
  - los de adivinar-el-tema.astro:247-255 y adivinar-por-la-letra.astro la bajan a clamp(1.3rem, 6vw, 1.8rem);
  - Skayboy la pone en 1rem o 1.15rem según la media (skayboy.css:721 y 967);
  - desde 64rem con carátula se esconde (juego.css:3883-3885).
- Lleva eco.

J2 Marca de la carátula
- Marcado: Caratula.astro:57.
- Estilo: .caratula-marca (juego.css:3887-3897), calco 1.85rem, solo desde 64rem. Lleva eco.

J3 h1 de cada juego
- Estilo común: .pantalla > h1 (juego.css:3703-3717), rotulada, peso normal, clamp(1.65rem, 7vw, 2.15rem), mayúsculas, en la tinta del disco. Desde 64rem con carátula sube a 2.6rem (juego.css:4063-4066). El eco viene de juego.css:3661-3663.
- Textos y discos:
  - quiz.astro:58 ← quiz/copy.ts:19, "Entrá, sepas lo que sepas.". Viste marca (Oktubre), pero la tinta es --texto (la fija el <style> de quiz.astro). Pide , . Á
  - adivinar-el-tema.astro:92, "Adiviná el tema". Mitología. Pide Á
  - adivinar-por-la-letra.astro:100, "Sacalo por la letra". Momo. Nada especial.
  - completar-la-letra.astro:67, "Completá la letra"; y en :76 "Todavía no" (sin banco). Letras. Pide Á
  - adivinar-la-tapa.astro:58, "Adiviná la tapa". Discos. Pide Á
  - ponelos-en-fila.astro:96, "Ponelos en fila". ¡Bang!. Nada especial.
  - mas-o-menos.astro:54, "Más o menos". Un baión. Pide Á
  - dos-ejes.astro:58 y dos-ejes/[cu].astro:66, "¿Qué tipo de ricotero sos?". Luzbelito. Pide ¿ ? É
  - skayboy-y-poligirl.astro:104 ← skayboy/copy.ts:13, "Skayboy y Poligirl". Gulp!. Nada especial.
  - diagnostico-audio.astro:35, "Diagnóstico de audio". Herramienta, sin disco. Recibe el estilo común y el eco.
- El de Skayboy no es `.pantalla > h1`: está adentro de .encabezado-juego. Por eso:
  - no va en mayúsculas;
  - skayboy.css:73-80 lo pone en rotulada y en el rojo de Gulp!;
  - mide 1.05rem en el teléfono apaisado chico (media de skayboy.css:689) y 1.6rem desde 980×500 (media de skayboy.css:936);
  - en los demás tamaños queda el 2em del navegador.
- Todos son cortos.

J4 Carátula (solo desde 64rem)
- Título: Caratula.astro:71 ← los mismos títulos de casete. Estilo .caratula-titulo (juego.css:3970-3979), rotulada 1.15rem, mayúsculas. No lleva eco.
- Pista corta: Caratula.astro:77, 1rem; 1.05rem desde 64rem. Registro 3.

J5 Pozo de discos en Adiviná el tema
- "¿Con qué jugás?": h2.elegi en adivinar-el-tema.astro:135, 0.95rem, tinta tenue. Es un rótulo.
- "Todos los discos" (:139) y los nombres de disco (:156): .pozo-titulo (juego.css:701-705), rotulada 0.95rem.

3.3 BOTONES DE ACCIÓN (registro 1, voseo)

B1 .primario
- Estilo: juego.css:308-346, rotulada 1.25rem, sin mayúsculas. Letra --fondo sobre --tinte-accion, el que fija cada disco (juego.css:3730-3738). Lleva canto.
- Overrides con alcance: adivinar-el-tema.astro:297-321 (1.35rem) y adivinar-la-tapa.astro:90-104.
- Textos:
  - "JUGÁ": quiz.astro:61 ← quiz/copy.ts:21, y Sacalo por la letra.
  - "Empezá": tema, letra y tapa.
  - "Jugá": Más o menos y el menú de Skayboy.
  - "Seguí jugando": Skayboy, y el quiz al cancelar la retirada (partida.ts:236).
  - "Empezá la noche" y "Empezá tu noche": dos ejes.
  - "Elegí qué repartir": Ponelos.
  - "Andá a letras y acordes": completar-la-letra.astro:79, cuando no hay banco.
  - "SEGUÍ": quiz (partida.ts:311).
  - "Seguí": partida-letra.ts:207, partida-tapa.ts:150, partida-mas-o-menos.ts:194 y el fin de nivel de Skayboy (skayboy-y-poligirl.astro:208).
  - "Revisá el audio": diagnóstico.

B2 .seguir (juego.css:1836-1847, rotulada 1.15rem)
- "Seguí" y "Mirá cómo te fue", en partida-tema.ts:1141 y partida-por-la-letra.ts:794.

B3 .arriesgar y .escuchar (tema y por-la-letra)
- .arriesgar (juego.css:1385, 1.15rem): "Arriesgá", "Pasá", "Pasá (+0,4 s)".
- .escuchar (juego.css:1122, 1.25rem): "Escuchá", "Pará".

B4 Compartí
- Clase: .primario.firma.con-tilde. Está declarada en Patricio Rey (juego.css:417) pero se dibuja en la rotulada a 1.15rem (juego.css:441-444), sobre fondo --cat-historia.
- Textos: "COMPARTÍ" (quiz, por-la-letra) y "Compartí" (el resto).

B5 .secundario (juego.css:348-359, letra del sistema en negrita, 1rem)
- "Otra vuelta", "JUGÁ DE NUEVO", "Jugá de nuevo", "Armá otra", "Desarmala", "Repetí", "Elegí otro", "Empezá otra noche", "Cerrá igual".

B6 .accion-abajo (sitio.css:1188-1203, rotulada 1.1rem)
- "Volvé al fichín" (tema, letra, tapa), "Mirá las letras enteras" (letra), "← A LA REDONDOPEDIA" ([slug].astro:251).

B7 .boton-recorte (cancionero.css:49-66, rotulada 0.95rem, mayúsculas)
- "Armá tu cancionero" en letras-y-acordes/index.astro:47.
- "Armar el cancionero" y "Empezar de nuevo" en armar-cancionero.astro:48-49. Son infinitivos: van contra D-17.

3.4 RESULTADO Y REVELACIÓN

R1 Rótulo de desenlace
- Estilo: .rotulo-desenlace (juego.css:2949-2956), rotulada 0.8rem, mayúsculas, tinta tenue. Registro 3.
- Textos:
  - quiz (partida.ts:358): "DERROTA", "VICTORIA", "RETIRADA";
  - tema (partida-tema.ts:1283) y por-la-letra (partida-por-la-letra.ts:865): "Cómo te fue";
  - Más o menos (partida-mas-o-menos.ts:258): "Se terminó." y "Se acabaron las preguntas. No le erraste a ninguna.".

R2 Encabezado que canta
- Estilo: h2.tramo (juego.css:259-266), rotulada 1.5rem, en la tinta del estado (juego.css:276-286 y 2960-2970).
- Textos:
  - quiz (partida.ts:369 ← DESENLACES): "Se te apagaron las tres vidas." / "Llegaste con las tres vidas prendidas." / "Te vas con las vidas que te quedan."
  - tema (partida-tema.ts:1284): "Te falta escuchar disco." / "Los conocés, tardaste un poco." / "Los tenés de memoria."
  - por-la-letra (partida-por-la-letra.ts:866): "No te suena ni el estribillo." / "Los tenés en la punta de la lengua." / "Con un renglón te alcanza."
  - Más o menos (partida-mas-o-menos.ts:260): "Tirás la carta y cruzás los dedos." / "Le vas agarrando la mano." / "Se lo cantás de memoria."
- Viste resultado = Gulp! + logo. Pide , . Á É Ó. Cortos, de 4 a 8 palabras.
- Los TRAMOS del quiz (quiz/copy.ts:101-114) no los pinta nadie. voz.test.ts los audita igual.

R3 h2 pelado "Cómo te fue"
- partida-letra.ts:233 y partida-tapa.ts:264. No tiene clase ni regla: sale con lo que pone el navegador.

R4 Puntaje
- Estilo: p.puntaje (juego.css:250-257, pisado por 2974-2977). Termina en 1.6rem para todos, en la rotulada.
- Textos: "Pregunta 12 de 24 · nivel Difícil" en el quiz (partida.ts:362); "7 de 10" en letra (partida-letra.ts:234) y tapa (partida-tapa.ts:265).

R5 Cifra grande
- Estilo: .cifra-numero (juego.css:2041-2048), rotulada 3rem; 3.75rem desde 46rem (juego.css:3425-3427). Color --cat-historia.
- Textos:
  - tema (partida-tema.ts:1290): "1 m 23 s", "45 s" y "+30 m" como tope (formato de lib/tema/reloj.ts:52-59);
  - por-la-letra (partida-por-la-letra.ts:871): "7 versos";
  - Más o menos (partida-mas-o-menos.ts:265): "12".
- El rótulo de arriba (.cifra-rotulo, juego.css:2032) dice "Tardaste", "Gastaste" o "Tu racha", a 0.8rem. Registro 3.

R6 Sello de acierto
- Estilo: .revelacion.ok .micro (juego.css:1742-1757), rotulada 1.3rem, mayúsculas, en --acento-3, animado.
- Textos: "¡La sacaste!" (partida-tema.ts:1086) y "¡Lo sacaste!" (partida-por-la-letra.ts:734). Es estado.

R7 Suma
- .revelacion-suma (juego.css:1759), 2.1rem en verde, "+100". Es estado.

R8 Título revelado
- h2.revelacion-titulo (juego.css:1784-1791), rotulada 1.6rem en la tinta del disco: "Era <título del tema>" (partida-tema.ts:1102, partida-por-la-letra.ts:758).
- Los títulos salen de cancionero.json (104). Es un catálogo abierto: aparecen ! , - . ? ¡ ¿ Á É Í Ñ Ó Ú Ü …, por ejemplo en "Divina TV. Führer".

R9 Estampa
- Marcado: sacar-temas.ts:113 ← pasadas.ts:75-86. Aparece en tema y en por-la-letra.
- Estilo: .estampa-disco (juego.css:4307-4315), rotulada 1rem. Llevan letra propia:
  - OKTUBRE, en calco a 1.6rem (juego.css:4318-4322);
  - LOBO SUELTO y CORDERO ATADO, en Lobo Suelto Fan a 1.45rem (juego.css:4324-4327).
- Lleva eco. Pide ¡ ! Á Ó Ú.

R10 Feedback
- Estilo: .micro (juego.css:188-192), letra del sistema en negrita, 1.1rem. Lo usan quiz, letra, tapa y Más o menos.
- Textos: "¡Ahí la tenés!", "¡Sabés, che!", "¡Esa era!", "¡La tenías!", "¡La diste!", "No era esa.", "Se te escapó, en una tinta sola."… Es estado y es frase.

R11 Títulos de lista
- h3.resumen-titulo (juego.css:1853-1860), 0.9rem, mayúsculas, tinta tenue.
- Textos: "Los temas de esta vuelta" y "Te cortó acá". Nombran.

R12 Tarjeta compartible
- Canvas de 1080 px: src/scripts/tarjeta.ts:228-317. Los cuerpos están en lib/tarjeta/plan.ts:241-248.
- Qué dibuja:
  - "FICHÍN RICOTERO" en calco, 62 px (piso 34);
  - el nombre del juego en mayúsculas en la rotulada, 54 px: "ADIVINÁ EL TEMA", "SACALO POR LA LETRA";
  - el tramo a 38 px y las filas a 42 px;
  - "TIEMPO TOTAL" o "VERSOS GASTADOS" a 26 px;
  - el número grande a 128 px (piso 72) en --cat-historia.

R13 Lámina de Ponelos
- lamina.ts:228-307: la marca en calco; "PONELOS EN FILA" y el conjunto en la rotulada.

R14 Postales de dos ejes
- Son PNG fijos en public/tarjetas/dos-ejes/. Los arma scripts/generar-dos-ejes.mjs con lib/dos-ejes/taller.ts:90-105.
- Letras:
  - calco para "FICHÍN RICOTERO";
  - rotulada para "¿Qué tipo de ricotero sos?", "ME SALIÓ", "¿Y A VOS CUÁL TE SALE?", los cuatro nombres y "LUZ · ORDEN";
  - DejaVu para las bajadas.
- Usa fontkitten, que lee .woff pero no .woff2. Si falta un glifo, el taller falla (generar-dos-ejes.mjs:69-77).

3.5 "¿QUÉ TIPO DE RICOTERO SOS?" (viste Luzbelito)

D1 Nombre de la manera
- h2.ejes-nombre (partida-dos-ejes.ts:309) ← dos-ejes.json, cuadrantes. Estilo juego.css:2533-2540: rotulada 2.1rem; 2.6rem desde 64rem (juego.css:2849-2851).
- Textos: "Mesa larga a las nueve", "Ronda en cualquier esquina", "Radio bajita, misma hora", "Mochila liviana, sin mapa". Pide coma.
- En la postal es .ejes-amigo-nombre (Tapa.astro:44, partida-dos-ejes.ts:408), a 1.5rem.

D2 Sello del momento
- p.ejes-momento (partida-dos-ejes.ts:136; juego.css:2310-2320), rotulada 0.8rem, mayúsculas.
- Textos: "La previa", "La ida", "La vereda", "Cuando suena", "La vuelta". Nada especial.

D3 Hoja final
- .ejes-marca-sitio "Fichín Ricotero" en calco, 1.15rem.
- .ejes-marca-juego "¿Qué tipo de ricotero sos?" en rotulada, 0.75rem.

D4 "Las cuatro maneras"
- h3.ejes-cuatro-titulo (partida-dos-ejes.ts:239; juego.css:2609), 1.1rem.

D5 Rótulos
- .ejes-rotulo "Esta noche te salió" (0.8rem).
- .ejes-polos "LUZ · ORDEN" (0.75rem).
- .ejes-tapa-rotulo "Las hojas de la noche" (0.75rem).
- Registro 3.

3.6 PONELOS EN FILA (viste ¡Bang!)

F1 "Qué repartís"
- h2.eleccion-titulo (partida-ponelos.ts:134; juego.css:4664), 1.1rem, tinta tenue.

F2 Conjuntos
- .conjunto-titulo (partida-ponelos.ts:141; 1.05rem) y h2.tablero-titulo (partida-ponelos.ts:335; 1.25rem).
- Textos: "Los diez discos", "Las diez tapas", "Los que abren", "Los que cierran", "Doce al azar" y "Los temas de <disco>".

F3 Filas y bandeja
- .fila-sello (partida-ponelos.ts:356) ← ponelos/filas.ts:49-52: "EN EL POGO", "SALTANDO", "CABECEANDO", "QUIETITO".
- "SIN UBICAR" y "EN LA MANO", a 0.7-0.8rem.
- juego.css:4855 las declara registro 3.

F4 "Así te quedó la fila"
- h2.lamina-titulo (partida-ponelos.ts:411; juego.css:5047), 1.15rem.

3.7 MÁS O MENOS (viste Un baión)

M1 Familia
- .categoria (partida-mas-o-menos.ts:129), letra del sistema 0.8rem: "LA BANDA", "LA GENTE", "LOS RECITALES", "LOS DISCOS", "LO QUE DURA", "EN VIVO", "LAS PALABRAS". Registro 3.

M2 Número de referencia
- .masomenos-valor (partida-mas-o-menos.ts:173; juego.css:4512-4518), rotulada 2.2rem: "1986", "5:34", "1.234 setlists", "12 temas".

M3 Opciones
- .masomenos-opciones .opcion (partida-mas-o-menos.ts:146; juego.css:4535-4542), rotulada 1.1rem: "Más", "Menos", "Antes", "Después".

M4 Número real
- .masomenos-real (partida-mas-o-menos.ts:212), 1.6rem, en la tinta del estado. Es estado.

3.8 SKAYBOY Y POLIGIRL (viste Gulp!)

S1 h1: ver J3.

S2 Rótulo de entrada
- .rotulo-nivel-numero (skayboy.css:1439), rotulada 4.4cqw en el rojo de Gulp!: "NIVEL 1 DE 6" (partida-skayboy.ts:733).
- .rotulo-nivel-nombre (skayboy.css:1446), letra del sistema 5cqw ← skayboy.json: "De a dos, despacito", "Un piso con favoritos", "Un favor que no se ve", "Lo que pesa, se queda", "El primer salto es a ciegas", "El salto más largo de todos".
- Vive sobre el área del mueble.

S3 Fin de nivel
- .fin-nivel-rotulo (skayboy.css:1508), 0.68rem: "NIVEL N DE 6 · PASADO". La caja lleva box-shadow de registro.

S4 Menú
- .menu-niveles "Los niveles, todos abiertos", 0.72rem.
- .ficha-nivel-numero "1" a "6", 1.5rem.
- .ficha-nivel-sello "PASADO" y "ACÁ ESTÁS".
- .sello-mueble "MENÚ", "PANTALLA COMPLETA", "SALÍ", 0.62rem.

3.9 REDONDOPEDIA

E1 "LA REDONDOPEDIA"
- h1.titulo-seccion (redondopedia/index.astro:52 ← sitio/copy.ts:375). Estilo sitio.css:1539-1546, rotulada 1.6rem. No lleva eco. Viste Gulp!.

E2 Secciones
- h2.lado (index.astro:74): "La historia", "La banda y los suyos", "Los discos", "Los temas", "La cultura ricotera", "Las leyendas".
- "Seguí por acá" ([slug].astro:224).

E3 Tarjeta del índice
- strong (index.astro:82) ← los 38 títulos de redondopedia.json. Estilo sitio.css:1580-1586, rotulada 1rem en el tinte de la categoría.

E4 h1 del artículo
- [slug].astro:140. Estilo .articulo h1 (sitio.css:1660-1667), rotulada 1.7rem.
- Lleva eco salvo en los tres graves (Walter Bulacio, Olavarría 2017, La muerte del Indio), que van en registro 3 entero.
- Los títulos traen ! ( ) , . ¡ Á Í Ó Ú y números. "Indio Solari y los Fundamentalistas del Aire Acondicionado" tiene 8 palabras.

E5 Lo que nombra
- .articulo-tipo, la capitular (sitio.css:1697-1704: la primera letra del resumen, puede ser cualquiera), .sello-credito, .ficha dt, y los rótulos LEYENDA y TESTIMONIO (.marca-rotulo).
- Registro 3, BR-08.

3.10 LETRAS Y ACORDES (letras, La mosca y la sopa)

C1 h1
- "Letras y acordes" (letras-y-acordes/index.astro:36) y "Armá tu cancionero" (armar-cancionero.astro:37), ambos literales.
- Estilo: cancionero.css:26-33, rotulada clamp(2rem, 9vw, 3.2rem), en --cat-letras.

C2 Nombre del disco
- h2.disco-titulo (index.astro:62, armar-cancionero.astro:62) ← lib/letra/discos.ts:53-62. Estilo cancionero.css:108-115, rotulada clamp(1.15rem, 5vw, 1.7rem), en la tinta de cada disco.
- Los diez nombres traen ! ¡ Á Ó Ú ….

C3 Título del tema
- h1.tema-titulo ([slug].astro:50) ← los 104 títulos. Estilo cancionero.css:220-227, clamp(1.6rem, 7vw, 2.6rem). Catálogo.

3.11 404
- No existe src/pages/404.astro. Cae al del hosting.

======================================================================
4. TABLA DE CIERRE
======================================================================

- PR = Patricio Rey Fan, LS = Lobo Suelto Fan, OK = Oktubre Calco.
- "Falta" son los caracteres del texto que el archivo servido no tiene.
- Entre paréntesis va cuántos textos entran enteros hoy.

| Pieza | Disco que viste | Falta en PR | Falta en LS | Falta en OK | ¿Candidata a letra de disco? |
|---|---|---|---|---|---|
| Marca (P1, P2, J1, J2, D3, tarjeta, lámina, postal) | Oktubre | Í | Í | nada | Ya está en su letra (calco). Solo hay que sacarle el eco. |
| Renglón de lugar (P3, 11) | la de su sección | , . Á É Ó (0/11) | igual (0/11) | , . G J L M P S V Z Á É Ó | No. Es frase y va en la del sistema por decisión vigente (sitio.css:115-125). |
| Lado A/B, secciones, Seguí por acá (P4, E2) | base | · Á Í | · Á Í | G J L M P S Y · Á Í | No. Nombra, es chica y tenue. |
| Título de casete y de carátula (P5, J4; 11) | uno por casete | ¿ ? Á É (6/11) | ¿ ? Á É (6/11) | ¿ ? G L M P Q S V Y Á É (0/11) | Sí, con tildes derivadas, en PR. LS no: a 0,95rem es trazo de pelo. |
| Sello de acción (P6: JUGÁ, EMPEZÁ…) | el del casete | Á É (0/5) | Á É (0/5) | G J L M P Z Á É | Sí, con tildes derivadas (PR), junto con P5. |
| Pista A1… (P7) | mano | nada | 1-9 | 1-9 | No. Es lo escrito a mano (D-64) y registro 3. |
| "En la cocina" (P8) | mano | nada | nada | L | No. Lápiz, registro 3. |
| OKTUBRE, sello del afiche (P9) | Oktubre | nada | nada | nada | Ya está en calco. |
| Estampa de cumpleaños (P9) | Oktubre | Ó | 0 4 Ó | 0 4 L M P Y Ó | No. Registro 3. |
| Día de las fechas (P9) | la de cada disco | nada | 2 4 7 | 2 4 7 | No. Dato de almanaque. |
| Nombre corto en las fechas (P9) | cada disco | ¡ ! (5/6) | ¡ ! (5/6) | !GLMPSYZ¡ (2/6) | Solo "Oktubre" en calco. LS a 0,74rem no se lee. |
| ADIVINÁ TEMAS DE OKTUBRE (P9) | Oktubre | Á | Á | M S V Á | Sí, con Á derivada (PR). Al calco no le alcanza. |
| Cinta de regreso (P10) | — | ← Í | ← Í | ← L P S Y | No. Es la salida, va a 0,8rem. |
| h1 de los juegos (J3; 10) | uno por juego | , . ¿ ? Á É Í (3/10) | igual (3/10) | , . ¿ ? G L M P Q S V Y Á É (0/10) | Sí, con tildes y signos derivados (PR), la misma letra que su casete. Skayboy entra entero hoy. |
| "Diagnóstico de audio" (J3) | — | Ó | Ó | G L P S Ó | No. Es una herramienta. |
| Pozo de discos (J5) | cada disco | ¡ ! Á Ó Ú … | igual | casi todo (2/10) | Solo "Oktubre" en calco. LS a 0,95rem no. |
| Botón primario (B1) | el del juego | Á É Í (0/11) | Á É Í | G J L M P Q S V Y Z Á É | Sí, con tildes derivadas (PR). |
| Seguí, Arriesgá, Escuchá (B2, B3) | mitología, Momo | Á Í Ó ( ) + , | lo mismo y 0-9 | — | Sí, con tildes derivadas. Lo que va entre paréntesis en "Pasá (+0,4 s)" queda en la rotulada o pide ( ) + , |
| Compartí (B4) | resultado (Gulp! + logo) | Í (0/2) | Í | M P | Sí, y es la que más rinde: D-19 ya la pide en PR y falta solo la Í. |
| Secundarios (B5) | — | Á Í (2/9) | Á Í | — | No. Van en la del sistema por jerarquía. |
| accion-abajo (B6) | — | ← Á É Í | igual | — | No. Es una salida. |
| Botones del cancionero (B7) | letras | Á (2/3) | Á | — | Después de corregir los infinitivos, sí con Á (PR). |
| Rótulo de desenlace (R1) | — | . Ó (3/6) | igual | (2/6) | No. Registro 3. |
| Encabezado del resultado (R2; 12) | resultado (Gulp! + logo) | , . Á É Ó (0/12) | igual | , . G L M P Q S V Y Z Á É Ó | Sí, con tildes y signos derivados (PR, por D-19). El color sigue siendo el del estado. |
| h2 pelado "Cómo te fue" (R3) | — | Ó | Ó | M Ó | Así como está, no. Primero hay que igualarlo a R1 y R2. |
| Puntaje (R4) | resultado | · Í (2/3) | 0-9 · Í | — | Sí. "7 de 10" entra entero hoy en PR; el del quiz pide · e Í. |
| Cifra grande (R5) | resultado | + (3/4) | + 0-9 | — | Sí (PR). Solo el tope "+30 m" pide el +. |
| Sello de acierto (R6) | estado | ¡ ! (0/2) | ¡ ! | L S ¡ ! | No. Acierto y error no se disfrazan de ningún disco (diseno-marca.md). |
| Suma, feedback, número real (R7, R10, M4) | estado | — | — | — | No. Es estado; R10 además es frase. |
| "Era <tema>" (R8; 104) | el del tema | ! , - . ? ¡ ¿ Á É Í Ñ Ó Ú Ü … (64/104) | igual (64; 67 con la Ñ del zip) | (1/104) | No. Catálogo abierto. |
| Estampa del disco (R9; 10) | su disco | ¡ ! Á Ó Ú (6/10) | igual | (2/10) | Los tres que pueden ya van en su letra. Los otros siete no tienen letra fichada. Sale el eco. |
| Títulos de lista (R11) | — | Á Ó (1/2) | igual | — | No. Nombran. |
| Tarjeta: nombre del juego (R12) | el del juego | Á (1/2) | Á | L M P S V Á | Sí, con Á derivada, si cambia el h1: la tarjeta copia al h1. |
| Tarjeta: tramo, cifra y rótulo (R12) | resultado | , . Á É Ó + | igual | — | Sí, con derivados (sigue a R2 y R5). Los rótulos entran hoy. |
| Lámina "PONELOS EN FILA" (R13) | ¡Bang! | nada | nada | L P S | Sí. Entra entera hoy en PR. |
| Postales de dos ejes (R14) | Luzbelito | ¿ ? É Ó · , | igual | — | Sí, con derivados. Después hay que regenerar los PNG con el taller. |
| Nombre de la manera (D1; 4) | Luzbelito | , (2/4) | , (2/4) | , G J L M P Q S V | Sí, con la coma derivada (PR). |
| Sello del momento (D2; 5) | Luzbelito | nada (5/5) | nada (5/5) | L P S V | Sí. Entra hoy en PR; conviene subirle el tamaño de 0,8rem. |
| "Las cuatro maneras" (D4) | Luzbelito | nada | nada | L M S | Sí. Entra hoy en PR. |
| Rótulos y polos (D5) | — | Ó · | igual | — | No. Registro 3. |
| "Qué repartís" (F1) | ¡Bang! | É Í | É Í | P Q S É | Sí, con tildes, o se queda como rótulo tenue. |
| Conjuntos (F2; 15) | ¡Bang! | ¡ ! Á Ó Ú … (11/15) | igual | (0/15) | Sí (PR) para los cinco fijos, que entran hoy. "Los temas de X" pide derivados. |
| Filas y bandeja (F3; 6) | ¡Bang! | nada (6/6) | nada (6/6) | G L M P Q S | Dudosa. Los glifos alcanzan, pero juego.css:4855 las declara registro 3. Que decida experiencia. |
| "Así te quedó la fila" (F4) | ¡Bang! | Í Ó | Í Ó | L Q S Ó | Sí, con tildes derivadas (PR). |
| Familias (M1) | Un baión | nada (7/7) | nada | G L P Q S V | No. Es categoría, registro 3. |
| Número de referencia (M2) | Un baión | : . (3/4) | 0-9 : . | — | Sí, derivando : y . (PR). |
| Más / Menos / Antes / Después (M3) | Un baión | Á É (2/4) | Á É | M P S Á É | Sí, con tildes derivadas (PR). |
| h1 de Skayboy (S1) | Gulp! | nada | nada | G L P S Y | Sí. Entra hoy en PR. Antes conviene pasarlo a `.pantalla > h1`. |
| NIVEL N DE 6 y fin de nivel (S2, S3) | Gulp! | · | 1 6 · | — | No. Registro 3 y está adentro del mueble (D-41). |
| Nombre de nivel (S2; 6) | Gulp! | , Á (3/6) | igual | — | Dudosa. Canta, pero vive sobre el área del fichín. Hoy va en la del sistema. |
| Menú, sellos y fichas (S4) | — | Í Ú Á , | igual | — | No. Son controles, de 0,72rem para abajo. |
| "LA REDONDOPEDIA" (E1) | Gulp! | nada | nada | L P | Sí. Entra hoy en PR. LS no corresponde: es la letra de Lobo suelto. |
| Tarjeta y h1 de artículo (E3, E4; 38) | la de la categoría | ! ( ) , . ¡ Á Í Ó Ú (27/38) | lo mismo y 0-9 (27/38) | (2/38) | En general no: es enciclopedia, la voz va en la prosa (§6) y es catálogo. Sí para los tres discos con letra propia, a 1,7rem. Nunca los tres graves. |
| Tipo, capitular, sellos, LEYENDA/TESTIMONIO (E5) | — | — | — | — | No. Registro 3 y BR-08. |
| h1 del cancionero (C1) | letras | Á (1/2) | Á | L M S Y Á | Sí, con Á derivada (PR). No hay letra de La mosca. |
| Nombre del disco en el cancionero (C2; 10) | cada disco | ¡ ! Á Ó Ú … (6/10) | igual | (2/10) | Sí para los tres con letra propia, por la regla de la estampa. El resto, en la rotulada. |
| Título del tema (C3; 104) | su disco | catálogo (64/104) | igual | — | No. Catálogo abierto. |
| 404 | — | — | — | — | No hay pieza. |

======================================================================
5. CÓMO INTEGRARLAS (para decidir)
======================================================================

Lo que dice D-19 en tipografía. Solo tres partes tienen letra:
- portada (Oktubre): el calco;
- mitología (Lobo suelto): Lobo Suelto Fan;
- resultado y compartir (el logo): Patricio Rey Fan.

Gulp!, La mosca, Último bondi, Momo, ¡Bang!, Un baión y Luzbelito no tienen letra fichada (RES-33 y RES-34). Por eso "cada juego en la letra de su disco" no alcanza para que queden coherentes: cambiaría uno de once casetes.

Tres caminos, de menos a más:

a) Sin derivar nada. Seguir la regla de la estampa (CNT-14 §2.7): el nombre de un disco que tiene letra propia va siempre en su letra cuando es título.
   - Aplica a C2, a E3 y E4 de esos tres discos, a J5 y a las fechas del afiche.
   - Límite: Lobo Suelto Fan no se lee por debajo de unos 1,45rem, así que el pozo, la tarjeta de artículo y las fechas quedan solo para el calco.

b) Derivar una letra: la Í de Patricio Rey. Con eso D-19 se cumple en Compartí y .con-tilde se puede borrar.

c) El paso grande: Patricio Rey Fan como la letra que grita del sitio, con la marca en calco arriba.
   - Alcanza a casete, carátula, los diez h1, el primario, el sello de acción, el encabezado y la cifra del resultado, y los títulos de tarjeta, lámina y postal.
   - Es la única de las fan que se lee chica, tiene números, mide casi lo mismo de ancho que Archivo Black (762 contra 754, así que no se mueven los cortes de renglón) y tiene trazo grueso como para aguantar la máscara de D-64.
   - Hay que derivar 14 glifos: Á É Í Ó Ú, ¿ ?, ¡ !, . , : · y +. El método es el de scripts/derivar-oktubre-calco.py: recortar y pegar trazos de la misma fuente con pathops.
   - El costo de fondo: es la letra del logo, no la de un disco. Los once quedan en la misma letra y lo que rota por disco sigue siendo la tinta. Si además se quiere que rote la letra, solo Lobo suelto tiene con qué, y no aguanta el tamaño de casete.

Lo que no puede pasar a letra de disco, por regla:
- el registro 3: desenlaces, LEYENDA y TESTIMONIO, fuentes, pistas, instrucciones y los tres artículos graves;
- el estado: acierto, suma, número real y feedback;
- el texto largo: enunciado, opciones, bajadas y renglón de lugar;
- los catálogos abiertos: títulos de tema y de artículo.

Cuidados técnicos si se hace:
- Altura. Patricio Rey sube hasta 542 y baja a -96. Al sumarle tildes hay que subirle el ascent (hhea 666); si no, la tilde queda fuera de la caja y la máscara de D-64 la recorta. Es el mismo caso que D-64 resolvió con padding-block para Archivo Black.
- Tamaño. A igual cuerpo se ve más chica. Se compensa con size-adjust en su @font-face de tokens.css, y después hay que volver a medir los cortes de renglón.
- Máscara de D-64. Las texturas se midieron sobre Archivo Black; sobre Patricio Rey hay que volver a medir los huecos. Sobre Lobo Suelto Fan, nunca máscara: con trazo de pelo perdería trazos enteros.
- Precarga. Cabeza.astro:69-70 precarga solo el calco y Archivo Black. Si Patricio Rey pasa a los títulos, hay que sumar su preload (4,8 KB).
- Test. Extender fuentes.test.ts, con el mismo patrón de D-58 y D-60, a patricio-rey.woff y lobo-suelto.woff: que toda pieza que el CSS ponga en letra de disco pida solo glifos que están en el cmap. El taller de postales ya falla solo cuando falta un glifo.
- Al recortar de nuevo lobo-suelto.woff, traer la Ñ del zip.

Fichas que harían falta (investigador):
- Para que el calco escriba más que OKTUBRE y la marca: la minúscula de la contratapa (RES-41, el material ya está ubicado) y una foto en alta (RES-39, paso 1).
- Letras de Gulp!, La mosca, Último bondi y el resto: no hay material ni fuente comercial (RES-33, RES-34). Cada una sería un calco propio desde fotos en alta, con una ficha nueva por disco.
- "Redonditos de Ricota": a qué arte copia. RES-42 dice "el arte del muñeco", y la figura encadenada sigue reportada, no verificada (INV-02). Hace falta ficha antes de atribuirle un disco. Si se usa como letra del logo de la banda, no la necesita.
- Licencia de las tres de Zavala: RES-42 dice "sin licencia declarada". Por D-14 no frena; va al mapa de CNT-01.

======================================================================
6. FUERA DE ALCANCE, UNA LÍNEA CADA UNO
======================================================================

- Hay infinitivos en el marcado del cancionero: armar-cancionero.astro:48-49 ("Armar el cancionero", "Empezar de nuevo") y letras-y-acordes/[slug].astro:74 ("Bajar solo"). voz.test.ts no los ve porque solo lee los copy.ts.
- Los botones tienen caja mixta: el copy alterna "JUGÁ", "Empezá" y "Jugá", y .primario no tiene text-transform.
- La cinta "← Letras y acordes" sale en caja mixta; las otras, en mayúscula.
- CSS muerto: .cocina* en sitio.css:1131-1185.


---

## Papeles: qué está decidido sobre letras y sombras

INFORME: qué dicen los papeles sobre la tipografía y la sombra/eco
(rutas relativas a C:/Users/santi/Proyectos/InstanciadorProyectos/RicotaArcade-fondo; las líneas salen de leer ese worktree el 2026-10-05)

RESUMEN
- Ningún papel exige la sombra en la letra. El eco nació en el código: lo pidió UX-22 §8 y quedó como decisión en D-33 (ciclo 12). El lienzo nunca lo tuvo: el lienzo usa un filtro "rugosa" que le come el borde a la letra. Sacarlo de todos lados enmienda D-33 consecuencia 1, UX-22 §8, D-54 (el eco del título), la tabla anti-slop de diseno-marca.md:77 y el test de lista cerrada. No choca con nada que no se pueda negociar.
- Usar la letra de cada disco en más lugares lo cumplen D-18, D-19 y la hoja 05 del lienzo, que ya pedía más de lo que se construyó. El freno real son tres cosas: no hay tildes, siete de los diez discos no tienen letra (RES-34), y UX-35 §4.2 / D-54 punto 5 eligieron un solo título en Archivo Black para los ocho juegos.
- No se negocian: el texto largo va en --fuente (UX-01, D-19 regla 2), nunca se escribe sin tilde (D-17), nunca se usa la letra de otro disco (CNT-14 §2.7), los rótulos, el acierto y el error no se disfrazan, el registro 3 no se decora, las tres pantallas graves van sin adorno, y una línea grande tiene como mucho 8 palabras.

0. CORRECCIONES AL CONTEXTO (lo medí con fontTools)
- public/fuentes/oktubre-calco.woff (v0.4) sí trae la Í (U+00CD/U+00ED), derivada para FICHÍN por D-60. Cubre A B C D E F H I K N O R T U y la Í. Las minúsculas apuntan a las mismas mayúsculas. No trae ningún otro acento, ni Ñ, ni signos, ni cifras. diseno-marca.md:53 ya lo dice así.
- patricio-rey.woff: A-Z y 0-9; las minúsculas son las mismas mayúsculas.
- lobo-suelto.woff: A-Z y nada más. El TTF original de Zavala (Docs/INVESTIGACION/Tipografia/Lobo-Suelto-Cordero-Ata-Regular.zip) sí trae Ñ/ñ (glifo "Ntilde"). Se perdió al recortar el archivo para el sitio.
- Hay una cuarta letra de disco que nunca llegó al código: "Redonditos de Ricota" de Zavala (RES-42), con A-Z y 0-9, en Tipografia/Redonditos-De-Ricota-Regular.zip. La hoja 05 del lienzo se la asigna a historia (ver §6).
- Ninguna de las cuatro letras fan o calcadas trae ¿ ? ¡ ! , . …
- Los .woff no traen datos de copyright ni de licencia en la tabla name.

1. LA SOMBRA Y EL ECO: QUÉ DICE CADA PAPEL

a) .claude/rules/diseno-marca.md:77. En la tabla anti-slop, "Sombra difusa…" se reemplaza por "Sombra dura desplazada (offset plano, como papel sobre papel) o nada". Admite la sombra dura sin limitarla a la letra.
   Veredicto: hay que enmendarla. Si "todos lados" es solo la letra, se agrega "en la letra, nada". Si incluye los objetos, el reemplazo queda en "nada". La regla la escribe el hilo principal.

b) Docs/DECISIONES.md:1584-1590, D-33 consecuencia 1. Fija "el registro imperfecto quedó como recurso permanente y estático en la letra grande de todo el sitio": un eco del texto corrido 2 px en el apoyo del disco. También dice que "Como es la única sombra que diseno-marca.md admite" lo encierra estilos.test.ts.
   Veredicto: el pedido la contradice de frente y la enmienda entera. ESPEC-D-64 la enmendaba solo en parte (sacaba el título del casete y el h1).

c) Docs/UX/UX-22-la-imprenta-de-rocambole.md:608-642, §8 "El registro imperfecto en toda la página". Pone el eco en la marca (.marca, .marca-grande), los títulos de casete, el h1 de cada juego y el h1 de artículo, y lo prohíbe en el cuerpo, los rótulos, el acierto y el error y las tres pantallas graves.
   Veredicto: se retira el §8 entero. Su tabla de "dónde no" queda cumplida de sobra. Toca además:
   - §9 (665-670): pide "sombra de registro" alrededor de la ficha de disco de la Redondopedia; en código es .papel-ficha, box-shadow con --registro.
   - §13 (806-811): los tokens --registro y --registro-angulo.
   UX-22 es de experiencia, así que va como propuesta en Docs/SUGERENCIAS/.
   Ojo: el §2.3 (382-396), el corrimiento de las pasadas de la estampa (juego.css:4216-4224, translate/rotate), no es una sombra. Queda tapado por la foto al fijarse y es el núcleo de D-33. Mi lectura es que se queda, y entonces --registro y --registro-angulo siguen vivos (movimiento.test.ts:140-141).

d) Docs/DECISIONES.md:2992-2996, D-54 puntos 5 y 6, y consecuencias 3038-3039 y 3053-3054. El título único lleva el eco en el apoyo del disco (REV-18, FIND-109). El botón principal lleva "un canto de sombra dura en su apoyo, que se hunde al apretar".
   Veredicto: el eco del título se retira. El canto es otra cosa: Docs/UX/UX-35-la-mesa-y-la-caratula.md:502-504 dice "El hundirse no es decoración sino respuesta al toque". Si sale, hace falta otra respuesta al toque. Además, sacar una sombra que marca un estado (.pozo[aria-pressed='true'], juego.css:688) puede dejar ese estado comunicado solo con color, y diseno-marca.md:44 lo prohíbe.

e) Docs/DECISIONES.md:1423-1424 (D-31, la hoja de versos con "sombra dura desplazada"), 2727-2730 (D-49, la tapa entera del casete "con filete de papel y sombra dura corrida") y 3317-3321 (D-57 enmienda 2, "el canto de las hojas lo pintan las sombras"). Son sombras de objeto, no de letra. La de .ejes-hoja[data-quedan] cuenta cuántas hojas quedan, o sea que tiene función.
   Veredicto: solo se enmiendan si "todos lados" incluye objetos. Hay que preguntarlo.

f) Docs/SUGERENCIAS/ESPEC-D-64-la-tapa-se-sella.md:
   - B.6 (295-299) dejaba con eco la marca, el h1 de artículo, .estampa-disco y .papel-ficha.
   - F.5 (571) preguntaba si sacar el eco de la marca y avisaba que eso "contradice D-33".
   Veredicto: el usuario ya contestó: sale todo. La espec se cumple y hay que ampliarla:
   - el test 3 de C.1 pasa a prohibir cualquier text-shadow;
   - el test de lista cerrada (src/lib/estilos.test.ts:269-303) se invierte;
   - el comentario de --tinta-registro y todas sus asignaciones por variante (sitio.css:1023-1054, 1164-1167, 1602-1605, 1643; skayboy.css:74 y 171) quedan sin uso.

g) Comentarios que repiten "la única sombra que la regla admite" y hay que corregir: sitio.css:1607-1645, juego.css:3644-3663 y 4304-4306, tokens.css:239-251, skayboy.css:65-72, estilos.test.ts:272-273, y UX-35:502.

h) El lienzo (lo extraje del artifact 59acd1de; las hojas viven en el script appifact-doc):
   - Ninguna hoja usa text-shadow.
   - La hoja 07 (Textura.dc.html) dice "Cada forma y cada título pasan por rugosa" (feTurbulence + feDisplacementMap, escala 2,4 en piezas chicas y 4,2 en títulos) y "Textura en la forma, nunca en el texto de lectura".
   - La hoja 11 dice "La textura la pone el filtro, no la letra".
   Veredicto: sacar la sombra devuelve el código a lo que pedía el lienzo. ESPEC-D-64 descartó el filtro con desplazamiento porque Safari ablanda el texto y depende del DPR, y propone una máscara en su lugar. La hoja 07 hay que actualizarla igual (T-411).
   El borrador de la hoja 15 (Docs/SUGERENCIAS/lienzo-hoja-15-la-mesa.dc.html:164) describe el canto. Si el canto sale, hay que corregirlo antes de pegarlo (T-319).

i) Docs/INVESTIGACION/INV-07-tipografia-lettering-tapas.md:76-77 (RES-33). El título de Gulp! llevaba "una sombra agregada para efecto de relieve", y RES-36 (139-141) agrega que "las letras tenían textura".
   Veredicto: es una tensión de fidelidad (D-18), no una regla. Conviene anotarla como alternativa descartada en la D- nueva: la preferencia del usuario manda. La textura sí apoya el camino de la almohadilla.

Inventario en el código de las sombras de letra (siete selectores):
- sitio.css:1637 (.marca-grande, .casete-titulo, .articulo:not(.articulo--grave) h1)
- juego.css:3649 (.marca)
- juego.css:3662 (.pantalla h1)
- juego.css:3895 (.caratula-marca)
- juego.css:4314 (.estampa-disco)

Ecos sobre sellos con letra:
- sitio.css:984 (.casete-accion)
- sitio.css:703 (.oktubre-jugar)

Ecos de objeto con --registro:
- sitio.css:1274 (.papel-ficha)
- skayboy.css:177 (.gabinete)
- skayboy.css:1492 (.fin-nivel)

Sombras duras de objeto: unas 40 más (botones con canto, hojas, recortes, estampa-papel). La lista completa sale con una pasada de box-shadow sobre las tres hojas.

2. TIPOGRAFÍA: QUÉ DICE CADA PAPEL

a) diseno-marca.md:39-42: "Lo que rota por sección es el acento y la letra grande", y "Las letras de disco gritan títulos cortos". Cumple el pedido de más letras de disco: da permiso explícito.

b) diseno-marca.md:58-62, la deuda declarada: las palabras con tilde van en --fuente-rotulada "hasta derivarlas", "No 'resolver' esto escribiendo sin tilde", y el método está en scripts/derivar-oktubre-calco.py. Cumple y marca el camino: derivar, no recortar.

c) DECISIONES.md:580-593 (D-18): reconstrucción fiel de la letra real de cada tapa, y "La letra reconstruida se usaría para los títulos del sitio". Cumple. Asume que es obra derivada, bajo D-14.

d) DECISIONES.md:609-626 (D-19): el sitio es polifónico, paleta medida más letra reconstruida por parte.
   - Mapa: portada en Oktubre Calco, historia en Gulp!, mitología en Lobo suelto, resultado en Gulp! más "Patricio Rey".
   - Regla 2: "las letras de disco gritan títulos, no explican".
   - Regla 3: acierto, error y rótulos no rotan.
   - Deuda: "derivar tildes es el próximo paso del calco".
   Veredicto: cumple. El pedido es en buena parte terminar D-19.

e) DECISIONES.md:3359-3392 (D-58). Ver §3.

f) DECISIONES.md:3435-3447 (D-60). Derivó F, H, N e Í del calco con operaciones booleanas sobre letras calcadas (el paso 5 de RES-39). Descartó escribir FICHÍN en la rotulada porque "habría dejado el logo con dos letras distintas".
   Veredicto: cumple, y es el precedente de cómo extender la letra sin mezclar familias.

g) Docs/UX/UX-04-sistema-visual.md:
   - 340-346: dos familias, "nunca mezcladas dentro del mismo bloque de texto"; la dibujada solo para títulos, botones cortos y el puntaje grande, "Nunca para texto largo".
   - 353-356: "emular la textura… en vez de vector limpio".
   Veredicto: cumple, con una condición: no se puede tapar letra por letra con la de repuesto. Si una palabra en el calco pide una Á, el navegador la dibuja en Archivo Black. Es el mismo defecto silencioso de D-58, y hoy fuentes.test.ts solo lo vigila en la marca.

h) UX-04:497-534, el mapa sección→disco:
   - A3 Adiviná el tema viste Lobo suelto;
   - A9 Skayboy y B2 Redondopedia visten Gulp!;
   - "La marca no rota" (529-530).
   Sirve para saber qué letra le toca a cada lugar.

i) UX-22:577-604 (§7 "El disco en sus letras") y D-33 consecuencia 4 (DECISIONES.md:1599-1601). El nombre de un disco va en su propia letra cuando existe: OKTUBRE, LOBO SUELTO y CORDERO ATADO. Los otros siete van en la rotulada.
   Veredicto: cumple, y está a medio construir. Va en .estampa-disco--oktubre y --lobo-suelto, pero el h1 de la ficha de disco de la Redondopedia sigue en la rotulada para todos (sitio.css:1660-1667). Es una extensión ya decidida que falta hacer.

j) Docs/CONTENIDO/CNT-14-las-palabras-de-la-imprenta.md:258-282 (§2.7). El nombre de un disco va siempre en mayúsculas, sin tilde solo en esos tres discos, y "nunca recortado para que entre en una letra que no le pertenece".
   La repiten UX-06:292-297 (Luzbelito), UX-23:333-337 (Bang!) y UX-34:79-85 (Un baión): si el disco no tiene letra, la sección va en la rotulada.
   Veredicto: limita. Prohíbe prestar la letra de un disco a la sección de otro.

k) UX-35:466-479 (§4.2 "Un solo título") y D-54 punto 5. El h1 de los ocho juegos va en Archivo Black porque está "Completa: tiene tildes y Ñ", y porque "Ocho títulos de ocho familias… no son una serie, son ocho sitios".
   Veredicto: es la contradicción principal. Poner cada h1 o cada título de casete en su letra va en contra de esta hoja: hay que enmendarla o justificarla. Hoy solo cuatro de los once casetes tienen letra (ver §5), así que la serie quedaría mezclada sí o sí.

l) UX-35:315-320. Todas las letras de la marca están en el calco. Cumple.

m) UX-01-flujo-quiz.md:92-93 y 266-272. El enunciado y las opciones nunca van en la dibujada. El texto del sello (rotuloLeyenda, quien, obra) va en la legible, y solo "la palabra corta de la insignia" puede ir en la letra de mostrar. No se negocia.

n) .claude/rules/voz-ricotera.md:
   - 153: tope de 8 palabras para toda línea grande.
   - 163: voseo en el botón (Empezá, Seguí, Volvé).
   - 213 y 227: el registro 3 "No se decora".
   - 290: nada de puntos suspensivos en botones ni rótulos.
   Veredicto: limita. Una letra de disco no entra a LEYENDA, TESTIMONIO, avisos ni errores.

o) Docs/UX/UX-20-el-sitio-como-lugar.md:242-247 (las tres pantallas de registro 3, sin clima) y UX-22:642. En Bulacio, Olavarría y la muerte del Indio no va adorno, ni siquiera en la letra grande. Limita: ahí no van ni sombra ni letra de disco.

p) DECISIONES.md:556-561 (D-17): voseo, tildes, glosario (display→rotulada). No se negocia.

q) Docs/CONTENIDO/CNT-01-nota-derechos.md:171-197. Mapea solo Archivo Black TTF y DejaVu, las dos del taller de tarjetas. No hay entrada para Oktubre Calco, Patricio Rey Fan, Lobo Suelto Fan ni Redonditos Fan.
   Veredicto: falta. Por D-14 no frena nada, pero si estas letras se usan más, CNT-01 tendría que mapearlas: Zavala las publicó "sin licencia declarada" (RES-42) y el calco es obra derivada (D-18).

r) Docs/INVESTIGACION/INV-07-tipografia-lettering-tapas.md:
   - RES-31 (26-33) y RES-36 (125-135): el origen de las letras de Oktubre y de Lobo suelto.
   - RES-39 (215-228): el flujo de foto a fuente, y el paso 5 (diseñar los glifos que faltan con las letras guía).
   - RES-40 (230-242): viabilidad alta para Oktubre y para Lobo suelto, que es "un alfabeto diseñado como sistema".
   - RES-41 (244-258): la contratapa de Oktubre trae la minúscula redondeada, "casi el abecedario completo", ubicada y sin calcar.
   - RES-42 (275-293): las tres digitalizaciones de Zavala.
   - RES-43 (295-311): el calco v0.2, y el aviso de que el alfabeto completo exige el paso 5.
   - El tablero (313-323) deja pendiente "auditar fidelidad" de las tres de Zavala.
   Veredicto: cumple y da el camino: derivar tildes con el método de D-60, y calcar la minúscula de la contratapa.

s) Docs/SUGERENCIAS/HILO-auditoria-impeccable-portal-y-quiz.md:
   - 152-158: MITOLOGIA salía sin tilde porque venía del JSON; se corrigió con una tabla.
   - 206-208: la titular parpadeaba de Arial Black a la calcada; hoy se precarga en src/components/Cabeza.astro:69-70.
   Sumar letras de disco a la primera pantalla trae el mismo parpadeo, salvo que se precarguen.

3. POR QUÉ D-58 VOLVIÓ A ARCHIVO BLACK (DECISIONES.md:3359-3392)
No fue un cambio de diseño, fue un defecto (3362-3364). El archivo archivo-black.woff2 de 14 KB era el subconjunto latin-ext de Google: traía Ā, Ă, Ő, y "ni una letra de la A a la Z, ni las tildes del castellano, ni las cifras" (3367-3369). Cada título y cada botón caía a Arial Black en Windows y Mac, o a la sans del sistema en Android, y nada fallaba (3370-3374).
Se reemplazó por Archivo Black 1.006 (OFL) recortada a latín y latín extendido, de 26,6 KB. Desde entonces src/lib/fuentes.test.ts lee el cmap y falla si no cubre lo que el sitio escribe en rotulada.
Consecuencia para hoy: Archivo Black es la única letra del sitio que escribe todo (tildes, Ñ, signos, cifras). Por eso cargan con ella el h1 único, los botones, los sellos y toda palabra con tilde. Y D-58 avisa (3390-3392) que cambiar de letra mueve la caja: el título de "Sacalo por la letra" pasó a dos renglones.

4. INTENTOS PREVIOS DE USAR LETRAS DE DISCO, Y POR QUÉ SE RETIRARON O SE FRENARON
1) Los "equivalentes de trabajo" de Google Fonts en la hoja 05 (Pacifico y otras). El usuario los rechazó: "parecen parodias, quiero que sean las reales". Los retiró D-18 (DECISIONES.md:575-580).
2) La hoja 04 del lienzo antes de RES-42: "Imitar el método, no la letra", con Archivo Black más el filtro rugosa, porque "No hay fuente" (RES-30). La superaron RES-42/43, D-18 y D-19, pero el texto de la hoja nunca se actualizó (ver §6). ESTADO.md:3929 registra esa consecuencia vieja.
3) El mapa de D-19 en la hoja 05 del lienzo: historia en "Redonditos Fan", mitología en "Lobo Suelto Fan", resultado ("COMPARTIR") en "Patricio Rey Fan".
   - Al código llegaron solo la marca en el calco y "Compartí" en Patricio Rey Fan (juego.css:417).
   - Redonditos Fan nunca entró a public/fuentes/.
   - Lobo suelto se usa solo en .estampa-disco--lobo-suelto (juego.css:4324-4327).
   - Ningún papel lo retiró: se frenó por las tildes (MITOLOGÍA, ADIVINÁ) y porque a los títulos de sección los terminó tomando la rotulada.
4) Los títulos de juego. Antes de D-54 ya no iban en letra de disco: había cuatro formas entre rotulada y sistema. D-54 punto 5 y UX-35 §4.2 los unificaron en Archivo Black por las tildes y la Ñ y para que formen "una serie". Skayboy va en la rotulada "por la deuda del calco" (skayboy.css:65-72).
5) CNT-22:83-91 eligió a propósito los sellos "PANTALLA NORMAL" y "PANTALLA COMPLETA", sin tilde, para que entraran en las letras de disco. CNT-40:241-245 y D-61 los cambiaron por "SALÍ", que va en la rotulada, porque el sello tiene que nombrar el toque (CNT-22:53-58). Lección: el texto se elige por lo que dice, no por los glifos que tiene la letra.
6) UX-22 §7: el h1 de ficha de disco en su letra quedó sin construir (ver §2 i).
7) La única extensión que salió bien: D-60. Derivó F, H, N e Í sin dibujar en lugar de mezclar familias.

5. QUÉ PUEDE ESCRIBIR HOY CADA LETRA, CASETE POR CASETE (títulos de src/lib/sitio/copy.ts)
- A1 "PREGUNTAS RICOTERAS" (Oktubre, calco): le faltan P, G y S.
- A3 "ADIVINÁ EL TEMA" (Lobo suelto): le falta solo la Á.
- A9 "SKAYBOY Y POLIGIRL" y B2 "LA REDONDOPEDIA" (Gulp!): Patricio Rey Fan o Redonditos Fan los escriben enteros. Falta confirmar que alguna de las dos sea de verdad la letra de Gulp! (ver §8).
- A2 Luzbelito, A4 Momo, A5 y B1 La mosca, A6 Bang!, A7 Último bondi y A8 Un baión: no existe letra (RES-34). Van en la rotulada sí o sí (CNT-14 §2.7).
- Botones (JUGÁ, SEGUÍ, EMPEZÁ, ARMÁ, VOLVÉ, SALÍ): ninguna letra de disco los escribe hoy.
- Patricio Rey Fan trae cifras. Encaja con D-19 (resultado = Gulp! más el logo) para el puntaje grande del resultado y de la tarjeta, sin ninguna tilde en juego. Hoy el puntaje va en la rotulada (HILO-auditoria-impeccable:391; la hoja 04 del lienzo también lo pone en la rotulada).

6. LA HOJA 04 DEL LIENZO (Tipografia.dc.html, extraída del artifact) Y SUS VECINAS
- La hoja 04, "Una que grita y una que se deja leer":
  - dos familias que nunca se mezclan en un bloque;
  - Archivo Black "con el filtro de serigrafía encima: el borde irregular es lo que la vuelve dibujada";
  - escala: puntaje 64, título 26, enunciado 20, opciones 17, botón 18 en versalita, insignia 11;
  - "Así no": la rotulada en texto largo;
  - remata con "No hay fuente… Imitar el método, no la letra… lettering original encargado".
  Está desactualizada: es anterior a RES-42/43, D-18 y D-19, y no nombra el calco ni las fuentes de Zavala. Por el circuito de diseno-marca.md:22-31, cualquier cambio de letras empieza reescribiendo esta hoja.
- La hoja 05 (Tapas.dc.html), en la tabla "La mezcla", asigna la letra grande así:
  - Portada: Oktubre Calco ("FICHÍN RICOTERO").
  - Historia: Redonditos Fan.
  - Mitología: Lobo Suelto Fan, con la muestra escrita "mitologia", sin tilde, en el propio lienzo (choca con D-17).
  - Letras y Discos: "rotulada del sistema".
  - Resultado: Patricio Rey Fan ("COMPARTIR").
  También repite las tres reglas de D-19 y la deuda de las tildes.
- La hoja 07 (Textura.dc.html): ver §1 h.

7. LO QUE NO SE NEGOCIA
- El texto largo (enunciado, opciones, explicación, sellos con quien/obra, la prosa) va en --fuente: UX-01:92-93 y 266-272, D-19 regla 2, diseno-marca.md:41-42.
- D-17: voseo y tildes; nunca se escribe sin tilde para que entre en la letra (diseno-marca.md:58-61, CNT-14:278-282).
- La letra de un disco solo va en la sección de ese disco; si el disco no tiene letra, va la rotulada (CNT-14 §2.7, UX-06 §5, UX-23 §5, UX-34).
- Acierto, error, LEYENDA y TESTIMONIO no se disfrazan; ningún estado se comunica solo con color (diseno-marca.md:43-44, D-19 regla 3).
- El registro 3 no se decora (voz-ricotera.md:227), y las tres pantallas graves van sin adorno (UX-20:242-247).
- La base no rota: fondo, grano, zona del pulgar, contraste AA (diseno-marca.md:39-40). Cambiar la letra no cambia los pares de color, pero estas letras son más finas y rasposas, así que hay que mirar la legibilidad al tamaño real.
- Nada de negrita falsa en fuentes de un solo peso (estilos.test.ts:1219-1236). Toda letra que se sume tiene que entrar a esa lista.
- Línea grande de 8 palabras como mucho (voz.test.ts).

8. QUÉ SE ENMIENDA, Y LO QUE HABRÍA QUE PEDIR
Papeles:
- D- nueva o D-64 ampliada. D-64 está libre en DECISIONES.md e IDS.md; antes de numerar, hacer fetch y mirar las ramas remotas (memoria). Tiene que enmendar D-33 consecuencia 1, D-54 punto 5/6 y sus consecuencias, y UX-35 §4.2 si cambia el título único.
- diseno-marca.md: la línea 77, la tabla de fuentes y la deuda (cuando se deriven tildes).
- Propuestas a experiencia en SUGERENCIAS: UX-22 §8, §9 y §13; UX-35 §4.2 y §4.3; UX-04 (tipografía y mapa).
- CNT-01: entrada para las cuatro letras de disco.
- El lienzo: hojas 04, 05 y 07, y la 15 antes de pegarla.

Tests:
- estilos.test.ts:269-303 se invierte: ningún text-shadow.
- fuentes.test.ts: extender la guarda del cmap a cada lugar donde escriba una letra de disco, no solo la marca.
- movimiento.test.ts:140-142, solo si algún token se va.
- Los tests nuevos de ESPEC-D-64 (C.1 a C.3).

Fichas RES- a pedirle a investigador (no frenan nada, por D-14):
- Auditar las tres fuentes de Zavala contra las tapas (pendiente del tablero de RES-42). En particular: ¿Patricio Rey Fan es el lettering del "Patricio Rey" de la tapa de Gulp! (la pieza de B2, D-49) o el del logo coronado posterior? ¿De qué pieza sale "Redonditos de Ricota", que el lienzo pone en historia sin ficha?
- Los términos de esas fuentes en ffonts.net, para CNT-01.
- Siguen abiertas, y necesitan al usuario: la foto a 300-600 dpi de la contratapa de Oktubre (RES-41) y el álbum de Facebook de Rocambole (pide login).
Derivar Á, É, Í, Ó, Ú y Ñ no pide ficha: es oficio, como D-60. Para Lobo suelto la Ñ ya existe en el TTF original y solo hay que volver a incluirla al recortar.

9. PREGUNTAS PARA EL USUARIO ANTES DE DECIDIR
1) ¿"Todos lados" es solo la letra (los siete selectores más los sellos con eco), o también las sombras duras de objetos? Ojo con tres de esas sombras de objeto: el canto del botón es la respuesta al toque, las hojas apiladas cuentan las que quedan y la sombra del pozo apretado marca un estado.
2) ¿Se mantiene un solo título en la rotulada para los ocho juegos (UX-35 §4.2), o cada juego va en la letra de su disco donde exista? Hoy existe para cuatro de once, y A1 y A3 necesitan derivar letras primero.
