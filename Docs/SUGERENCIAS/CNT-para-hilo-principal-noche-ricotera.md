# CNT-para-hilo-principal — la noche ricotera (`CNT-31`, `D-59`), con la vuelta 6 (2026-10-05)

De `contenido` al hilo principal. **Nada de esto bloquea el banco**: `src/data/dos-ejes.json` ya está escrito. Lo único que no es opcional es regenerar las tarjetas.

## 1. Lo obligatorio

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `npm run generar-dos-ejes` y después `node --test src/lib/dos-ejes/tarjetas.test.ts` | tarjetas y manifiesto con las bajadas de `CNT-30` | regenerarlas | Cambiaron las cuatro bajadas del banco con `D-59`, y **`CU-3` y `CU-4` cambiaron otra vez en la vuelta 6** (`CU-3`: *la vereda de siempre* en lugar de *el termo de siempre*; `CU-4`: *las botamangas* en lugar de *las zapatillas*). `huellaDelTaller()` entra con las bajadas, así que `tarjetas.test.ts` da rojo (9 de 10) hasta regenerar. No es un defecto del contenido |
| El taller (`taller.ts`), al medir | bajadas de 124 a 160 caracteres | bajadas de 162 a 168 (`CU-3` 167, `CU-4` 168; recontadas a mano en la vuelta 6) | El taller falla fuerte si una ocupa más de cinco renglones. Las de antes llegaron a 169 y pasaron, así que debería dar. Si falla, la que se acorta es `CU-4` (sacarle *ya*: *que vieron barro*) o `CU-3` (sacarle *de siempre*), no el costo |

## 2. Cadenas de pantalla que propongo cambiar (opcional)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/sitio/copy.ts` · `LUGARES.dosEjes` | `Entrá con la campera puesta.` | `Traés barro seco en las zapatillas.` | La campera puesta era el eco de la línea que canta de la previa (*Campera puesta, llaves en el bolsillo.*), que cambió. Las zapatillas son el eco de la línea que canta de la vuelta (*Zapatillas embarradas, llave en la puerta.*, que la vuelta 6 no tocó): el portal y la última hoja comparten el objeto. 6 palabras (techo 8), 35 caracteres (techo 40 del renglón `.donde-estas`, según `UX-36`), voseo, imagen física, sin suspensivos. Si no se cambia, no se rompe nada: *campera* sigue en `EJ-032`, `EJ-044`, `EJ-053` y `EJ-042` |
| `src/lib/sitio/copy.ts` · el comentario de `LUGARES` sobre `dosEjes` | «queda la imagen de la previa, sin plata y sin puerta» | «`CNT-31` §10: la imagen pasa a ser la de la vuelta (el barro seco), porque la línea que canta de la previa dejó de ser la campera» | Que el comentario no diga lo que el código ya no hace |
| `src/lib/sitio/copy.ts` · `JUEGOS[«¿Qué tipo de ricotero sos?»].baja` | `Nadie te toma examen. Una noche de recital, sin puntaje y sin saber nada de la banda.` | `Nadie te toma examen. Una noche de recital con barro y chori, sin puntaje y sin saber nada de la banda.` | La noche es la ricotera (`D-59`). La primera frase (la que el portal imprime y mide `voz.test.ts`, regla 5) no cambia: 4 palabras. Sigue sin número escrito a mano |
| `src/lib/dos-ejes/copy.ts` · `PANTALLA_0.subtitulo` | `Una noche de recital en cinco momentos y diez preguntas de cómo la pasás. No hace falta saber nada ni haber ido.` | sin cambio | Sigue siendo cierto: el test no pide haber ido ni saber nada de la banda, aunque la escena nombre a los Redondos |

## 3. Guardas que propongo (opcional salvo la primera, que pidió el verificador)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/dos-ejes/banco.test.ts` · **nueva** «cada celda momento × eje trae lo sucio en un enunciado» (hueco 1 de `BR-38`) | Ninguna guarda lo cuenta. El verificador de la vuelta 6 lo midió a mano y la vuelta 5 fallaba en 4 de 10 celdas | Por cada celda, `LISTOS.filter(i => i.momento === m.id && i.eje === eje).some(i => SUCIO.some(v => aparece(i.enunciado, v)))`, con `const SUCIO = ['barro', 'embarrad*', 'mugre', 'humo', 'reviente', 'birra*', 'cerveza*', 'vino', 'vinito', 'tetra', 'fernet', 'escabi*', 'porro*', 'faso*', 'pitada', 'chupi*', 'trago*', 'whisky', 'petaca']` | Es la lista de `BR-38` (barro, mugre, humo, lo que se toma o se fuma, reviente). **Es `CONSUMO` sin `seca` y sin `merca`**: *seca* está en *la boca seca* de `EJ-056` y no es la pitada, y la merca **no cuenta** para el piso (`BR-38`: «si la merca sirviera para cumplirlo, pasaría de paisaje a protagonista»). Solo enunciados. Con el banco de la vuelta 6 pasa en las diez celdas (`CNT-31` §3). Ojo: *vino* es también el pretérito de *venir*; hoy ningún enunciado lo usa así |
| `banco.test.ts` · «lo que se toma o se fuma nunca separa los polos» | La guarda pide que las dos opciones nombren consumo o ninguna, y **cuenta palabras, no pronombres**: `EJ-029` A (*Lo paso y sigo charlando*) y `EJ-048` A (*Lo paso y aplaudo*) pasan el fernet y el porro con un *lo* y la guarda da 0 de 60 | Sin cambio en el test; solo anotarlo en el comentario de la guarda | El verificador lo vio. No hay forma barata de que una máquina siga un pronombre: lo lee `REV-20` (`CNT-31` §4). Si `REV-20` prefiere que no haya ni siquiera eso, es el cambio de una línea en cada ítem |
| `banco.test.ts` · «lo que se toma o se fuma nunca separa los polos» | La guarda pide que las dos opciones nombren consumo o ninguna | Sumar, aparte, una guarda más estricta: **ninguna opción nombra consumo** (`CONSUMO` sobre las opciones, todas vacías) | `CNT-31` §4 resolvió el quinto lugar con esa regla (lo que se toma o se fuma vive en el enunciado y ninguna opción lo nombra). Hoy es costumbre y la guarda deja pasar otra cosa. Si `producto` o `REV-20` prefieren que sea regla, es un `assert.deepEqual` más. Si prefieren que una opción pueda nombrar consumo con las dos de un lado, la guarda actual alcanza |
| `banco.test.ts` · `VETOS_DE_LA_NOCHE` (`cana`) | La palabra se compara sin tildes ni ñ | Sin cambio; solo anotarlo en el comentario | El test saca la ñ, así que **caña** (la bebida) cae en el veto de la policía (*cana*). El banco la evita y no hay forma de decir *caña* en ningún texto de la noche. Si el usuario la quiere, hay que afinar la lista (`cana` como palabra, `caña` permitida) |

## 4. Lo que no cambió y conviene saber

- Los **cuatro nombres** de las maneras, los **cinco sellos** y los ids no se tocaron. De la vuelta 6 cambió la línea que canta de la **ida** (*Ventanilla empañada, latas rodando, ruta que se estira.*, 55 caracteres: la más ancha de las cinco; `experiencia` lo tiene en `CNT-para-experiencia-noche-ricotera.md`).
- `copy.ts` de `dos-ejes` no tiene ninguna cadena nueva: lo único que se lee de la noche vive en el JSON.
- `BR-38` ya existe (es de `producto`). `CNT-31` lo aplica desde la vuelta 6; si `producto` lo enmienda, vuelve a `contenido`.
- Las siete reglas de `voz.test.ts` se miraron a mano sobre los textos nuevos (ningún botón en infinitivo, ningún anglicismo, ningún suspensivo, ningún título de más de ocho palabras). Los vetos de `banco.test.ts` se corrieron con `Grep` sobre el JSON; **ningún test se corrió** (`D-12`).
