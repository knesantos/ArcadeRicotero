# CNT-para-hilo-principal — la noche ricotera (`CNT-31`, `D-59`)

De `contenido` al hilo principal. **Nada de esto bloquea el banco**: `src/data/dos-ejes.json` ya está escrito. Lo único que no es opcional es regenerar las tarjetas.

## 1. Lo obligatorio

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `npm run generar-dos-ejes` y después `node --test src/lib/dos-ejes/tarjetas.test.ts` | tarjetas y manifiesto con las bajadas de `CNT-30` | regenerarlas | Cambiaron las cuatro bajadas del banco (`huellaDelTaller()` entra con ellas), así que `tarjetas.test.ts` da rojo hasta regenerar. No es un defecto del contenido |
| El taller (`taller.ts`), al medir | bajadas de 124 a 160 caracteres | bajadas de 162 a 167 (`CU-1` 165, `CU-2` 162, `CU-3` 166, `CU-4` 167) | El taller falla fuerte si una ocupa más de cinco renglones. Las de antes llegaron a 169 y pasaron, así que debería dar. Si falla, la que se acorta es `CU-4` (sacarle *ya*) o `CU-3` (sacarle *de siempre*), no el costo |

## 2. Cadenas de pantalla que propongo cambiar (opcional)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/sitio/copy.ts` · `LUGARES.dosEjes` | `Entrá con la campera puesta.` | `Traés barro seco en las zapatillas.` | La campera puesta era el eco de la línea que canta de la previa (*Campera puesta, llaves en el bolsillo.*), que cambió. Las zapatillas son el eco de la línea que canta de la vuelta (*Zapatillas embarradas, llave en la puerta.*): el portal y la última hoja comparten el objeto. 6 palabras (techo 8), 35 caracteres (techo 40 del renglón `.donde-estas`, según `UX-36`), voseo, imagen física, sin suspensivos. Si no se cambia, no se rompe nada: *campera* sigue en `EJ-044` y `EJ-053` |
| `src/lib/sitio/copy.ts` · el comentario de `LUGARES` sobre `dosEjes` | «queda la imagen de la previa, sin plata y sin puerta» | «`CNT-31` §10: la imagen pasa a ser la de la vuelta (el barro seco), porque la línea que canta de la previa dejó de ser la campera» | Que el comentario no diga lo que el código ya no hace |
| `src/lib/sitio/copy.ts` · `JUEGOS[«¿Qué tipo de ricotero sos?»].baja` | `Nadie te toma examen. Una noche de recital, sin puntaje y sin saber nada de la banda.` | `Nadie te toma examen. Una noche de recital con barro y chori, sin puntaje y sin saber nada de la banda.` | La noche es la ricotera (`D-59`). La primera frase (la que el portal imprime y mide `voz.test.ts`, regla 5) no cambia: 4 palabras. Sigue sin número escrito a mano |
| `src/lib/dos-ejes/copy.ts` · `PANTALLA_0.subtitulo` | `Una noche de recital en cinco momentos y diez preguntas de cómo la pasás. No hace falta saber nada ni haber ido.` | sin cambio | Sigue siendo cierto: el test no pide haber ido ni saber nada de la banda, aunque la escena nombre a los Redondos |

## 3. Una guarda que propongo (opcional)

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/dos-ejes/banco.test.ts` · «lo que se toma o se fuma nunca separa los polos» | La guarda pide que las dos opciones nombren consumo o ninguna | Sumar, aparte, una guarda más estricta: **ninguna opción nombra consumo** (`CONSUMO` sobre las opciones, todas vacías) | `CNT-31` §4 resolvió el quinto lugar con esa regla (lo que se toma o se fuma vive en el enunciado y nunca en una opción). Hoy es costumbre y la guarda deja pasar otra cosa. Si `producto` o `REV-20` prefieren que sea regla, es un `assert.deepEqual` más. Si prefieren que una opción pueda nombrar consumo con las dos de un lado, la guarda actual alcanza |
| `banco.test.ts` · `VETOS_DE_LA_NOCHE` (`cana`) | La palabra se compara sin tildes ni ñ | Sin cambio; solo anotarlo en el comentario | El test saca la ñ, así que **caña** (la bebida) cae en el veto de la policía (*cana*). El banco la evita y no hay forma de decir *caña* en ningún texto de la noche. Si el usuario la quiere, hay que afinar la lista (`cana` como palabra, `caña` permitida) |

## 4. Lo que no cambió y conviene saber

- Los **cuatro nombres** de las maneras, los **cinco sellos** y los ids no se tocaron.
- `copy.ts` de `dos-ejes` no tiene ninguna cadena nueva: lo único que se lee de la noche vive en el JSON.
- `BR-38` todavía no existe (es de `producto`). `CNT-31` aplicó la síntesis de `D-59` tal cual; si `BR-38` dice otra cosa, vuelve a `contenido`.
