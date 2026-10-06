# CNT-para-hilo-principal — la noche ricotera (`CNT-31`, `D-62`), con las vueltas 6 y 7 (2026-10-05)

De `contenido` al hilo principal. **Nada de esto bloquea el banco**: `src/data/dos-ejes.json` ya está escrito. Lo único que no es opcional es regenerar las tarjetas.

> **Estado al 2026-10-06 (`REV-20`, `FIND-125`, `CNT-31` §14).** Casi todo lo de abajo ya lo aplicó el hilo; cada fila lleva su marca entre corchetes y la tabla de acá la resume. La redacción original queda como estaba.
>
> | Qué | Estado | Con qué |
> |---|---|---|
> | Regenerar las tarjetas | **Aplicada** | `a596435`; `tarjetas.test.ts` en verde y las cuatro tarjetas coinciden con el banco |
> | `LUGARES.dosEjes` y su comentario | **Aplicada, y reabierta** | `a596435` la dejó en *Traés barro seco en las zapatillas.* (35 caracteres) y a 320×568 parte en dos renglones (`FIND-120`): la propuesta nueva está en `CNT-para-hilo-principal-lugar-320.md` |
> | La bajada del casete (`JUEGOS[…].baja`) | **Aplicada** | `src/lib/sitio/copy.ts:198` |
> | Guarda del piso de lo sucio por celda (§3, fila 1) | **Aplicada** | `4dbc8b3`, `banco.test.ts` («cada celda momento × eje trae lo sucio en algún enunciado» y «lo sucio no se cumple con la merca») |
> | Comentarios sobre los pronombres y sobre *caña* (§3, filas 2 y 4) | **Aplicados** | comentarios de `banco.test.ts` |
> | Guarda «ninguna opción nombra consumo» (§3, fila 3) | **Abierta** | sigue sin escribirse; hoy es costumbre del banco |
> | Guarda de la música que molesta (§3 bis) | **Aplicada, con otra lista** | `62cd0e1`: frases de queja (*demasiado fuerte*, *volumen cansa*, *tapo los oídos*…) y no las palabras sueltas de la propuesta; *tap\** no se suma, como se pedía. El comentario del test ya trae la frase del usuario |
> | Regla de voz para las líneas que cantan (§5, nueva) | **Propuesta**, con la redacción corregida el 2026-10-06 (vuelta 2 de `REV-20`) | abajo |

## 1. Lo obligatorio

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| **[Aplicada, `a596435`]** `npm run generar-dos-ejes` y después `node --test src/lib/dos-ejes/tarjetas.test.ts` | tarjetas y manifiesto con las bajadas de `CNT-30` | regenerarlas | Cambiaron las cuatro bajadas del banco con `D-62`, y **`CU-3` y `CU-4` cambiaron otra vez en la vuelta 6** (`CU-3`: *la vereda de siempre* en lugar de *el termo de siempre*; `CU-4`: *las botamangas* en lugar de *las zapatillas*) y **`CU-2` y `CU-3` en la vuelta 7** (`CU-2`: *un cantito* en lugar de *un mate*; `CU-3`: *el puesto de siempre* en lugar de *la vereda de siempre*). `huellaDelTaller()` entra con las bajadas, así que `tarjetas.test.ts` da rojo (9 de 10) hasta regenerar. No es un defecto del contenido |
| **[Resuelta: el taller generó las cuatro sin fallar]** El taller (`taller.ts`), al medir | bajadas de 124 a 160 caracteres | bajadas de 162 a 168 (`CU-2` 165, `CU-3` 167, `CU-4` 168; recontadas a mano en la vuelta 7) | El taller falla fuerte si una ocupa más de cinco renglones. Las de antes llegaron a 169 y pasaron, así que debería dar. Si falla, la que se acorta es `CU-4` (sacarle *ya*: *que vieron barro*) o `CU-3` (sacarle *de siempre*), no el costo |

## 2. Cadenas de pantalla que propongo cambiar (opcional)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| **[Aplicada, `a596435`; reabierta por `FIND-120`: ver `CNT-para-hilo-principal-lugar-320.md`]** `src/lib/sitio/copy.ts` · `LUGARES.dosEjes` | `Entrá con la campera puesta.` | `Traés barro seco en las zapatillas.` | La campera puesta era el eco de la línea que canta de la previa (*Campera puesta, llaves en el bolsillo.*), que cambió. Las zapatillas son el eco de la línea que canta de la vuelta (*Zapatillas embarradas, llave en la puerta.*, que la vuelta 6 no tocó): el portal y la última hoja comparten el objeto. 6 palabras (techo 8), 35 caracteres (techo 40 del renglón `.donde-estas`, según `UX-36`), voseo, imagen física, sin suspensivos. Si no se cambia, no se rompe nada: *campera* sigue en `EJ-032`, `EJ-044`, `EJ-053` y `EJ-042` |
| **[Aplicada, `copy.ts:131-132`]** `src/lib/sitio/copy.ts` · el comentario de `LUGARES` sobre `dosEjes` | «queda la imagen de la previa, sin plata y sin puerta» | «`CNT-31` §10: la imagen pasa a ser la de la vuelta (el barro seco), porque la línea que canta de la previa dejó de ser la campera» | Que el comentario no diga lo que el código ya no hace |
| **[Aplicada, `copy.ts:198`]** `src/lib/sitio/copy.ts` · `JUEGOS[«¿Qué tipo de ricotero sos?»].baja` | `Nadie te toma examen. Una noche de recital, sin puntaje y sin saber nada de la banda.` | `Nadie te toma examen. Una noche de recital con barro y chori, sin puntaje y sin saber nada de la banda.` | La noche es la ricotera (`D-62`). La primera frase (la que el portal imprime y mide `voz.test.ts`, regla 5) no cambia: 4 palabras. Sigue sin número escrito a mano |
| `src/lib/dos-ejes/copy.ts` · `PANTALLA_0.subtitulo` | `Una noche de recital en cinco momentos y diez preguntas de cómo la pasás. No hace falta saber nada ni haber ido.` | sin cambio | Sigue siendo cierto: el test no pide haber ido ni saber nada de la banda, aunque la escena nombre a los Redondos |

## 3. Guardas que propongo (opcional salvo la primera, que pidió el verificador)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| **[Aplicada, `4dbc8b3`]** `src/lib/dos-ejes/banco.test.ts` · **nueva** «cada celda momento × eje trae lo sucio en un enunciado» (hueco 1 de `BR-38`) | Ninguna guarda lo cuenta. El verificador de la vuelta 6 lo midió a mano y la vuelta 5 fallaba en 4 de 10 celdas | Por cada celda, `LISTOS.filter(i => i.momento === m.id && i.eje === eje).some(i => SUCIO.some(v => aparece(i.enunciado, v)))`, con `const SUCIO = ['barro', 'embarrad*', 'mugre', 'humo', 'reviente', 'birra*', 'cerveza*', 'vino', 'vinito', 'tetra', 'fernet', 'escabi*', 'porro*', 'faso*', 'pitada', 'chupi*', 'trago*', 'whisky', 'petaca']` | Es la lista de `BR-38` (barro, mugre, humo, lo que se toma o se fuma, reviente). **Es `CONSUMO` sin `seca` y sin `merca`**: *seca* está en *la boca seca* de `EJ-056` y no es la pitada, y la merca **no cuenta** para el piso (`BR-38`: «si la merca sirviera para cumplirlo, pasaría de paisaje a protagonista»). Solo enunciados. Con el banco de la vuelta 6 pasa en las diez celdas (`CNT-31` §3). Ojo: *vino* es también el pretérito de *venir*; hoy ningún enunciado lo usa así |
| **[Aplicada: está en el comentario de la guarda]** `banco.test.ts` · «lo que se toma o se fuma nunca separa los polos» | La guarda pide que las dos opciones nombren consumo o ninguna, y **cuenta palabras, no pronombres**: `EJ-029` A (*Lo paso y sigo charlando*) y `EJ-048` A (*Lo paso y aplaudo*) pasan el fernet y el porro con un *lo*: la guarda da 0 de 60 en los dos. (`EJ-029` B era *Me quedo con la mía* en la primera mano de la vuelta 7, y *la mía* con *una botella cortada* a la vista se lee como mi botella; quedó *Me quedo en la mía*, modismo sin sustantivo, y ese tercer pronombre ya no existe) | Sin cambio en el test; solo anotarlo en el comentario de la guarda | El verificador lo vio. No hay forma barata de que una máquina siga un pronombre: lo lee `REV-20` (`CNT-31` §4). Si `REV-20` prefiere que no haya ni siquiera eso, es el cambio de una línea en cada ítem |
| **[ABIERTA, 2026-10-06: sigue sin escribirse]** `banco.test.ts` · «lo que se toma o se fuma nunca separa los polos» | La guarda pide que las dos opciones nombren consumo o ninguna | Sumar, aparte, una guarda más estricta: **ninguna opción nombra consumo** (`CONSUMO` sobre las opciones, todas vacías) | `CNT-31` §4 resolvió el quinto lugar con esa regla (lo que se toma o se fuma vive en el enunciado y ninguna opción lo nombra). Hoy es costumbre y la guarda deja pasar otra cosa. Si `producto` o `REV-20` prefieren que sea regla, es un `assert.deepEqual` más. Si prefieren que una opción pueda nombrar consumo con las dos de un lado, la guarda actual alcanza |
| **[Aplicada: está en el comentario de la lista]** `banco.test.ts` · `VETOS_DE_LA_NOCHE` (`cana`) | La palabra se compara sin tildes ni ñ | Sin cambio; solo anotarlo en el comentario | El test saca la ñ, así que **caña** (la bebida) cae en el veto de la policía (*cana*). El banco la evita y no hay forma de decir *caña* en ningún texto de la noche. Si el usuario la quiere, hay que afinar la lista (`cana` como palabra, `caña` permitida) |

## 3 bis. La regla del usuario «nunca cansa el volumen» (vuelta 7): la guarda que falta

El usuario lo dijo así: *"nunca cansa el volumen"*. En la noche ricotera la música nunca molesta: ninguna escena ni opción trata el volumen, el ruido o los parlantes como algo que cansa, aturde o hay que tapar. Lo suma el hilo principal a `banco.test.ts`; esta es la tabla.

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| **[Aplicada, `62cd0e1`, con otra lista: frases de queja y no palabras sueltas]** `src/lib/dos-ejes/banco.test.ts` · `VETOS_DE_LA_NOCHE` | cinco entradas: tragedias, personas de la banda, policía, seguridad, épica y psicodelia | una sexta: `['el volumen que cansa (la música nunca molesta)', ['volumen', 'ruido*', 'aturd*', 'ensordec*', 'cansa*', 'oido*', 'algodon', 'zumbid*', 'molest*', 'estruend*']]` | Entra a las dos pruebas de los vetos de la noche, así que vale para enunciado, opciones, sellos, líneas que cantan y bajadas. **Medida contra el banco de la vuelta 7: pasa** (con `Grep` sobre todo el texto visible: ninguna de las diez raíces aparece; el único *volumen* era `EJ-040`, que ya no lo trae). *Oido\** caza *oído* y *oídos* porque `aparece` saca las tildes; no caza *se oye* (`EJ-041`) |
| **[Respetada]** el mismo archivo | — | **No** sumar *tap\** ni *retumb\** | *Me tapo con un amigo* y *una pareja se tapa con una campera* (`EJ-042`) son la llovizna y la campera, y *retumbar* no es molestia (`EJ-049` B ya no lo usa, pero la palabra sola no es el defecto). Con *oido\** alcanza para cazar *taparse los oídos* y *me tapo los oídos* |
| **[Aplicada: el comentario del test trae la frase del usuario]** el mismo archivo, comentario de la lista | — | una línea: «el usuario, 2026-10-05: nunca cansa el volumen» | Que quien afine la lista sepa que el motivo es una frase del usuario y no una cuenta |

## 4. Lo que no cambió y conviene saber

- **Vuelta 7:** once opciones nuevas (el té, el dibujo, el mazo, el barquito y el cargador salen de las opciones), ocho enunciados (`033`, `034`, `045`, `046`, `047`, `049`, `051`, `052`; la misa se muda de `046` a `052`) y dos bajadas. **Ningún `copy.ts` cambia, ni el sello ni la que canta.** Lo único que hay que hacer es regenerar las tarjetas. El largo del enunciado más ancho baja de 79 a 74 caracteres (`044`).
- Los **cuatro nombres** de las maneras, los **cinco sellos** y los ids no se tocaron. De la vuelta 6 cambió la línea que canta de la **ida** (*Ventanilla empañada, latas rodando, ruta que se estira.*, 55 caracteres: la más ancha de las cinco; `experiencia` lo tiene en `CNT-para-experiencia-noche-ricotera.md`).
- `copy.ts` de `dos-ejes` no tiene ninguna cadena nueva: lo único que se lee de la noche vive en el JSON.
- `BR-38` ya existe (es de `producto`). `CNT-31` lo aplica desde la vuelta 6; si `producto` lo enmienda, vuelve a `contenido`.
- Las siete reglas de `voz.test.ts` se miraron a mano sobre los textos nuevos (ningún botón en infinitivo, ningún anglicismo, ningún suspensivo, ningún título de más de ocho palabras). Los vetos de `banco.test.ts` se corrieron con `Grep` sobre el JSON; **ningún test se corrió** (`D-12`).

## 5. La línea que canta de un momento y la regla de voz (2026-10-06, `REV-20`, `CNT-31` §14.3)

`REV-20` dividió dos votos sobre si las cinco líneas que cantan de los momentos (y *Cuatro puntas de la misma hoja.*) tienen que ir en segunda persona. `contenido` dejó los textos como están y **declaró la excepción en `CNT-31` §14.3**: son acotaciones de escena, del momento y no de la hoja. La regla de voz es del hilo principal; si quiere que la excepción viva ahí y no solo en el banco, es una línea.

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `.claude/rules/voz-ricotera.md`, §5, tabla de los tres registros, fila «1. El que canta» (columna «Cómo se reconoce») | «≤ 8 palabras · segunda persona o imperativo · una imagen física · no explica» | «≤ 8 palabras · segunda persona o imperativo · una imagen física · no explica. **La acotación de una escena** (la línea que canta de un momento de la noche, y la que va bajo el título de la grilla del resultado) puede ir sin segunda persona ni imperativo: es una acotación de la escena (objetos, sonidos o lo que hace la gente de la escena), nunca de quien juega» | La tabla no distingue la línea grande de la chica ni lista la acotación de una hoja entre los lugares del registro 1, y §4.2 habla de «la línea grande». Sin esta línea, la próxima lectura de `voz-ricotera` vuelve a marcar las seis (cinco en el JSON y una en `copy.ts`). Si el hilo prefiere no tocar la regla, la excepción queda en `CNT-31` §14.3 y alcanza. **[2026-10-06, vuelta 2 de `REV-20`: la primera redacción decía «puede ir sin sujeto: objetos y sonidos» y no describía *Golpe en el pecho y todos cantan.* (tiene sujeto y verbo: lo hace la gente) ni *Ruta que se estira* (lleva verbo); con esa frase, la próxima lectura contra `voz-ricotera` volvía a marcar justo la línea de *Cuando suena*. Se redacta por lo que la línea no hace, igual que en `CNT-31` §14.3.]** |
| `voz.test.ts` | no mira la persona de ninguna línea | sin cambio | Es lo que dejó pasar a las seis desde el principio y es correcto: la persona es de oído, no de máquina (`voz-ricotera` §8) |
