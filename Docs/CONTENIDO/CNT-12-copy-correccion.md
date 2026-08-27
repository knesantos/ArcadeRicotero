# CNT-12 — Copy del botón de corrección y su panel

- **Fecha:** 2026-08-27.
- **Estado:** listo para `T-153` (hilo principal, componente compartido) y `T-150`
  (`arquitectura`, `CTR-10` — define las claves de datos exactas; esta pieza solo pone la
  parte legible encima).
- **Consume:** `Docs/PRODUCTO/PRD-correcciones.md` (`BR-21`) entero, en particular el
  apartado 2 ("qué promete el sitio") y su lista negra de cuatro frases prohibidas;
  `Docs/ORQ/ORQ-plan-ciclo-9.md` frente D; `.claude/rules/voz-ricotera.md` completa,
  registro 3 (sección 5); `CNT-05`/`CNT-10` como precedente de formato y de cómo ya se
  resolvieron botones imperativos sin infinitivo (`Cerrá la partida`).
- **No decide:** las claves de datos, el tope de largo por campo, ni si existe un campo
  de contacto — eso es `CTR-10` (`T-150`, todavía no escrito al momento de esta pieza).
  Uso nombres de placeholder entre llaves (`{juego}`, `{item}`...) solo para mostrar dónde
  va cada dato; `arquitectura` los reemplaza por sus claves reales sin que este documento
  necesite reescribirse.
- **No decide:** dónde vive el botón, tamaño de toque ni si compite con `SEGUÍ` — `UX-09`
  (`experiencia`).
- **No edita** `CTR-10` ni ningún `copy.ts`: eso lo transcribe quien implemente (`T-153`).

## Nota sobre el archivo

El plan del ciclo (`ORQ-plan-ciclo-9.md`, tabla del frente D) nombra este archivo
`CNT-12-copy-correcciones.md` (plural). La tarea `T-151` tal como llegó a este rol pide
el nombre en singular, `CNT-12-copy-correccion.md`, y es el que uso: la instrucción de
tarea manda sobre una tabla de planificación cuando difieren en un detalle así de menor.

---

## El filo de toda esta pieza

`BR-21` apartado 2 es taxativo: el sitio arma y entrega el mensaje, y eso es lo único que
garantiza. Ninguna cadena de acá puede insinuar que alguien lo va a leer, que va a haber
respuesta, que el ítem se va a corregir, o que la corrección queda registrada en algún
lado visible. Repaso cada texto contra esas cuatro frases antes de darlo por cerrado, y
lo dejo anotado sección por sección en vez de una sola vez al final, porque es el tipo de
cosa que se cuela de a una palabra.

Registro 3 en todo el panel, sin excepción: seco, sin imagen, sin humor, sin puntos
suspensivos. Es el mismo registro que ya usan `LEYENDA`/`TESTIMONIO` — dice qué hay
adentro y se calla.

---

## 1 — El disparador (botón que abre el panel)

> **`Corregí esto`**

Dos palabras, imperativo voseado, sin infinitivo. "Corregir" es la palabra que ya usa
`BR-21` como paraguas de las tres categorías (dato mal, algo que falta, rótulo mal
puesto) — no hace falta una palabra distinta por categoría porque la persona tampoco
tiene que elegir una (`BR-21` apartado 1). Deíctico a propósito ("esto", no "este verso"
ni "esta pregunta"): el mismo componente vive en el quiz, en completar la letra y en
adivinar por la letra, y un texto que nombrara el tipo de ítem tendría que bifurcarse por
juego para algo que no lo necesita.

Descarté `Avisá un error` porque "error" deja afuera a "algo que falta" (no es un error
que el sitio no diga algo) y a "rótulo mal puesto" (un `hecho` marcado `leyenda` no es un
error de dato, es un error de casillero) — de las tres categorías del apartado 1 de
`BR-21`, "error" solo cubre bien la primera.

---

## 2 — Encabezado del panel y la instrucción

**Encabezado:**
> **`Corregí este ítem`**

**Instrucción (debajo del encabezado, antes del campo):**
> `Contanos qué está mal, qué falta o qué rótulo no corresponde. No hace falta que sepas
> cuál de las tres es.`

La segunda frase es casi cita textual de `BR-21` apartado 1 ("No hace falta que la
persona sepa en cuál de las tres cae lo que quiere decir") a propósito: es la línea que
más le baja la fricción a alguien que duda si "vale la pena" tocar el botón por no saber
clasificar lo que vio. No promete nada — solo explica qué escribir.

---

## 3 — Etiqueta del campo de texto y marcador de posición

**Etiqueta:**
> `Corrección`

**Marcador de posición (placeholder, adentro del campo vacío):**
> `Por ejemplo: la fecha es otra, falta la fuente, esto es leyenda y no hecho.`

Tres ejemplos, uno por categoría de `BR-21` apartado 1, en el mismo orden en que esa
regla los lista — para que el placeholder haga de mapa silencioso sin necesidad de que la
instrucción de arriba los repita en detalle.

---

## 4 — Los tres botones de salida

| Botón | Texto |
|---|---|
| Mandar por mail | `Mandá por mail` |
| Copiar | `Copiá el texto` |
| Cerrar sin mandar | `Cerrá sin mandar` |

Los tres imperativos voseados, ninguno en infinitivo (`Mandar`, `Copiar`, `Cerrar` quedan
afuera a propósito — es el ejemplo que la propia tarea cita). "Cerrá sin mandar" nombra
el objeto completo de la acción (no manda nada, no solo "cierra algo" ambiguo) siguiendo
el mismo criterio con el que `CNT-10` ya resolvió `Cerrá la partida` contra candidatos
ambiguos como "Salir" o "Dejalo acá".

---

## 5 — Las confirmaciones (una por vía, solo el hecho mecánico)

**Al copiar:**
> `Se copió el texto.`

**Al mandar por mail:**
> `Se abrió el mail, con el texto ya puesto.`

Ninguna de las dos dice "enviado", "recibido" ni "listo, gracias": copiar es un hecho que
el sitio puede verificar con un comando (la API de portapapeles devuelve éxito o no), y
abrir un `mailto:` es lo máximo que el sitio puede afirmar — no puede saber si la persona
completó el envío del lado de su programa de mail, así que la confirmación describe la
acción del sitio ("se abrió"), nunca el resultado del lado de la persona ("se mandó",
"llegó").

---

## 6 — Cuando no hay ninguna vía disponible

`D-14` no permite que el molinete se cierre acá: si el dispositivo no tiene ni mail
configurado ni portapapeles, el panel no puede terminar en un callejón sin salida. La
salida es mostrar el texto entero para copiar a mano.

**Aviso:**
> `No hay mail ni portapapeles en este dispositivo.`

**Instrucción:**
> `Copiá el texto de abajo y llevalo adonde quieras mandarlo.`

Debajo de esas dos líneas va el mismo texto armado que iría en el cuerpo del mail (ver
punto 8, con la línea de asunto agregada arriba porque un texto pegado en cualquier lado
no tiene un campo de asunto aparte), en un bloque de texto seleccionable — no editable, no
hace falta que la persona lo retoque, solo que lo pueda marcar entero y copiar con el
gesto propio del sistema operativo.

**Botón de esta pantalla (uno solo, ya no hay "mandar" ni "copiar" que ofrecer):**
> `Cerrá`

---

## 7 — La línea que dice qué NO promete el sitio

**Decisión: va escrita, una sola línea, cerca de los botones de salida, no como
disclaimer legal sino como el mismo gesto de `voz-ricotera.md` 3.3 ("declara la duda en
voz alta").**

> `No hay manera de saber si esto se lee o se corrige.`

**Por qué no alcanza con el silencio.** Las confirmaciones del punto 5 ya evitan prometer
de más, pero eso protege el momento *después* de tocar el botón. Antes de tocarlo, alguien
que nunca usó este panel puede asumir —por costumbre de otros formularios de internet—
que "mandar" equivale a "entra en una cola que alguien mira". Esa expectativa no la crea
ninguna palabra de este documento, pero tampoco la corrige el silencio: la corrige una
línea. Es barata (nueve palabras), no se disculpa, no dice "lamentablemente" ni
"gracias por tu paciencia" —eso sí sería folleto—, y hace exactamente lo que el proyecto
ya premia en otro lado: la Redondopedia declara que hay tres fechas y que desconfíes del
que tire una sola en vez de callarlo; esto declara que nadie confirma la lectura en vez
de dejarlo para que la gente lo descubra sola, con desilusión, más tarde.

**Por qué no la puse en el encabezado ni en la instrucción del punto 2.** Ahí competiría
con "contanos qué escribir", que es la instrucción que más importa que se lea primero.
Va después del campo, pegada a los botones de salida, que es el momento exacto en que la
expectativa de "y ahora qué pasa" se forma.

---

## 8 — Asunto y cuerpo del mail (la parte legible)

`CTR-10` define las claves de datos exactas, sus topes de largo y el orden final de
campos. Acá van los rótulos y el texto fijo que envuelve esos datos — los nombres entre
llaves son placeholders de contenido, no los nombres de campo del contrato.

**Asunto:**
> `Corrección del arcade ricotero — {juego}`

Uso "arcade ricotero", no "RicotaArcade": es la frase que ya usan `CNT-05` (D1, "en el
arcade ricotero") y `CNT-10` (S1-S3, "del arcade ricotero") para que el sitio se nombre a
sí mismo en un texto que sale de acá. No invento una segunda forma de decir lo mismo.

**Cuerpo:**
```
Corrección del arcade ricotero.

Juego: {juego}
Ítem: {item}

Dice el sitio:
{texto_actual}

Debería decir, según quien corrige:
{texto_persona}
```

"Debería decir, según quien corrige" es cita casi literal de `BR-21` apartado 2 ("qué
debería decir según la persona") — mismo motivo que en el punto 2: reusar la palabra que
ya fijó `producto` en vez de inventar un sinónimo.

**Si `CTR-10` incluye un campo de contacto opcional** (`BR-21` apartado 3), agregar al
final, y solo cuando la persona lo llenó — nunca con la etiqueta puesta y el valor vacío,
porque eso sí leería como un campo obligatorio que faltó completar:
```
Contacto: {contacto}
```

**El mismo cuerpo, con la línea de asunto adelante, es el texto que va al portapapeles**
(punto 4, botón `Copiá el texto`) y el que se muestra en el bloque seleccionable del
punto 6 — porque al pegarse en cualquier otro lado no hay un campo de asunto separado
donde ese dato pueda vivir.

---

## Tabla resumen

| ID | Qué es | Texto | Registro |
|---|---|---|---|
| T1 | Disparador | `Corregí esto` | 3 |
| P1 | Encabezado del panel | `Corregí este ítem` | 3 |
| P2 | Instrucción | `Contanos qué está mal, qué falta o qué rótulo no corresponde. No hace falta que sepas cuál de las tres es.` | 3 |
| C1 | Etiqueta del campo | `Corrección` | 3 |
| C2 | Marcador de posición | `Por ejemplo: la fecha es otra, falta la fuente, esto es leyenda y no hecho.` | 3 |
| B1 | Botón mandar | `Mandá por mail` | 3 |
| B2 | Botón copiar | `Copiá el texto` | 3 |
| B3 | Botón cerrar sin mandar | `Cerrá sin mandar` | 3 |
| K1 | Confirmación copiar | `Se copió el texto.` | 3 |
| K2 | Confirmación mail | `Se abrió el mail, con el texto ya puesto.` | 3 |
| F1 | Aviso sin vías | `No hay mail ni portapapeles en este dispositivo.` | 3 |
| F2 | Instrucción sin vías | `Copiá el texto de abajo y llevalo adonde quieras mandarlo.` | 3 |
| F3 | Botón cerrar (sin vías) | `Cerrá` | 3 |
| D1 | Línea de no-promesa | `No hay manera de saber si esto se lee o se corrige.` | 3 |
| M1 | Asunto del mail | `Corrección del arcade ricotero — {juego}` (plantilla) | 3 |
| M2 | Cuerpo del mail | ver bloque del punto 8 (plantilla) | 3 |

---

## Verificación

Todas las cadenas fijas de esta pieza (`T1`, `P1`, `P2`, `C1`, `C2`, `B1`-`B3`, `K1`,
`K2`, `F1`-`F3`, `D1`) son literales y auditables tal cual contra las siete reglas de
`voz-ricotera.md` sección 8. `M1`/`M2` son plantillas: se auditan con datos reales
sustituidos en las llaves, no con `{llaves}` literales — mismo criterio que ya deja
escrito `CNT-10`.

Repasadas contra la lista negra de `BR-21` apartado 2 (lectura en plazo, respuesta,
corrección del ítem, registro visible de la corrección): ninguna de las diecisiete
cadenas de la tabla contiene ninguna de las cuatro.

```
node --test src/lib/voz.test.ts
```

Lo corre quien tenga con qué (`D-12`) — `contenido` no tiene `Bash`.

**Aviso para quien implemente (`T-153`):** `voz.test.ts` audita hoy los módulos `sitio`,
`quiz`, `tema`, `letra` y `tapa` (`src/lib/voz.test.ts`, arreglo `MODULOS`). Si el copy de
esta pieza se transcribe a un `copy.ts` nuevo (por ejemplo `src/lib/correccion/copy.ts`),
ese módulo tiene que sumarse a `MODULOS` para que las siete reglas lo alcancen — si no se
agrega, el texto queda escrito bien pero fuera del radar de la auditoría a máquina.
