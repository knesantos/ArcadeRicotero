# REV-01 — Revisión de la nota de derechos (`CNT-01`)

> Producida por `revisor` el 2026-08-19, tarea `T-11` del ciclo 1.
> Escrita por el hilo principal: `revisor` es read-only por diseño.
>
> **Primera revisión del proyecto.** Hasta hoy no había nada revisado.
> Pieza revisada: `Docs/CONTENIDO/CNT-01-nota-derechos.md`.
> Criterios: `D-06`, `D-07`, `D-09`, y las fichas `RES-03`, `RES-06`, `RES-07`, `RES-09`.
> Rango de IDs: `FIND-01` a `FIND-09`, reservado por `ORQ-plan-ciclo-1.md` §0.3.

---

## Veredicto

**No, la nota no alcanza hoy para levantar el gate de publicación de `D-07`** — y la propia
nota lo dice en su línea 4 ("esbozo… no cierra el gate"). Un "no" acá es el resultado
esperado, no un fallo.

Lo importante es **qué la separa** de estar cerrada, y son dos cosas de naturaleza muy
distinta:

1. **Está desactualizada respecto de investigación que ya existe.** Cuatro de las once
   preguntas de `Docs/SUGERENCIAS/CNT-para-investigador-derechos.md` tienen respuesta,
   entera o parcial, en `RES-06` y `RES-09`, y la nota las trata como si siguieran en cero.
   Eso es `FIND-01` a `FIND-04`, y se arregla leyendo: no hace falta investigar nada.
2. **Las ocho preguntas legales de fondo siguen genuinamente sin ficha** — si hay figura de
   uso permitido, quién es titular tema por tema, si hace falta autorización expresa. Ahí sí
   falta investigación real, y la nota lo declara correctamente.

**No se encontró una violación grave de `D-09`.** El documento es cuidadoso, casi sin
excepción, en distinguir evidencia de precaución propia. La única frase que se sale de esa
disciplina es `FIND-05`.

---

## Hallazgos

### `FIND-05` — "obra registrada" es una afirmación sin ficha · **importante**

- **Criterio incumplido:** `D-09`, criterio no negociable "ningún dato falso".
- **Evidencia:** sección B (Tapas), "Qué se usa", línea 139: `[x] Rocambole es artista vivo
  con obra registrada`.
- **Por qué incumple:** "artista vivo" **sí** está verificado por `RES-06` (líneas 187-193).
  **"Obra registrada" no lo está por ninguna ficha.** Ni `RES-03`, ni `RES-06`, ni `RES-09`
  — esta última confirma registro de **marca del nombre de la banda** vía Erks S.A., que no
  es lo mismo que registro de la **obra plástica** de Rocambole. La frase viene heredada tal
  cual de `D-04` (`Docs/DECISIONES.md`), escrita antes de que existiera investigación, y
  `CNT-01` la repite con casilla marcada `[x]` sin el hedging que sí aplica en otras partes
  del propio documento (comparar con la línea 208, que aclara "esto no es todavía un hecho
  verificado como suficiente legalmente").
- **Alcance:** acotado a una frase, pero es el candidato más cercano al hallazgo grave que
  esta revisión buscaba.

### `FIND-01` — La postura de Rocambole ya llegó y la nota no la refleja · **importante**

- **Criterio incumplido:** el propio criterio de `CNT-01` (líneas 9-10): "mientras esas
  fichas no existan, cualquier casilla sigue abierta" — que implica que al existir, hay que
  actualizarla.
- **Evidencia:** sección B, línea 157-158: `[ ] Si existe alguna postura pública de
  Rocambole sobre el uso fan de su obra… → pedido a investigador`.
- **Por qué incumple:** `RES-06` (`INV-02`, líneas 231-246) **ya responde**, con cita
  textual de Rocambole —"siempre me encantó la reproductibilidad del arte, que todos puedan
  tener acceso a mi obra"— y con los límites que esa cita **no** prueba. La nota trata la
  pregunta 5 como si nada hubiera llegado.
- **No bloqueante**, pero desactualiza la sección **más favorable** que produjo toda la
  investigación, y arriesga que se vuelva a pedir un trabajo ya hecho.

### `FIND-03` — La marca registrada ya tiene respuesta concreta · **importante**

- **Criterio incumplido:** mismo que `FIND-01`.
- **Evidencia:** sección D (Nombre y marca), línea 218-219: `[ ] Si el nombre o algún
  isotipo asociado está registrado como marca, y a nombre de quién. → pedido a investigador`.
- **Por qué incumple:** `RES-09` (`INV-02`, líneas 465-478) ya responde: hay registros en el
  **INPI** gestionados por **Erks S.A.**, y el titular es la sociedad, no una persona. Es la
  pregunta legal **más concretamente contestada** de las once. Además, el "Resumen para
  quien audita el gate" (línea 234) sigue diciendo "RES-03 + fichas de marca" sin nombrar a
  `RES-09`.
- Es donde el desfasaje es más flagrante, porque la respuesta ya es un sí/no con matiz y no
  solo contexto.

### `FIND-02` — El listado de tapas llegó parcial y figura como no pedido · **menor**

- **Evidencia:** sección B, línea 159-160: `[ ] Listado verificado de tapas del catálogo… →
  pedido a investigador`.
- **Por qué:** `RES-06` (líneas 265-292) trae una tabla parcial "De dónde salió cada tapa"
  con nivel de confianza por disco, y dice explícitamente que responde parcialmente la
  pregunta 6. Quedan tres discos sin explicación localizada.
- Dejarla en `[ ]` **no es falso** —la ficha misma se declara parcial— pero debería decir
  "parcial", no "pedido" a secas.

### `FIND-04` — La titularidad del catálogo llegó a nivel banda · **menor**

- **Evidencia:** sección A (Audio), línea 127-129: `[ ] Quién es el titular de derechos de
  cada tema… → pedido a investigador`.
- **Por qué:** `RES-09` (líneas 465-471) identificó a **Erks S.A.** como titular del
  catálogo y de los derechos del grupo. Es a nivel banda y no tema por tema, así que sigue
  siendo parcial — pero no es nulo, y la nota lo trata como nulo.

### `FIND-06` — Dos imprecisiones de redacción, por exceso de cautela · **menor**

Agrupadas por ser de la misma clase: afirmaciones desactualizadas **por quedarse cortas**,
no por afirmar de más. Ninguna bloquea el gate.

- **(a)** Encabezado, líneas 7-8: "Depende de: `RES-03` (marco de derechos, `investigador`
  la está produciendo en paralelo)". `RES-03` **ya existe completa** y se cita extensamente
  en el cuerpo, líneas 60-91.
- **(b)** Línea 44: "puede chocar contra los términos de servicio de YouTube" usa un
  condicional **más débil** que el que ya fijan `D-06` ("la descarga en sí **contraviene**
  los términos") y `RES-03` ("prohíben **explícitamente** descargar contenido"). La nota se
  queda corta respecto de su propia evidencia.

---

## Sin hallazgos — lo que está bien y conviene no romper

- **`D-07`, el gate:** la nota se declara explícitamente esbozo y distingue con claridad qué
  habilita (construir y jugar en local) de qué bloquea (publicar), sin ambigüedad. **Cumple.**
- **`D-06`, el origen del audio:** lo trata **de frente y sin eufemismos**. Nombra YouTube,
  el conversor y el recorte, y separa los dos riesgos —plataforma contra derecho de autor—
  en vez de fundirlos. **Cumple**, y era lo que más riesgo tenía de esquivarse.
- **Los requisitos de `T-09`, uno por uno:** da **un** número (10,0 s, líneas 52-53), con
  fundamento que separa evidencia de precaución (líneas 58-91), responde el sí/no sobre
  crédito (línea 108), y pone el máster WAV como **requisito** y no como consejo (líneas
  93-99). Ningún "a definir" sin dueño.
- **Las cuatro superficies** —audio, tapas, letras, nombre— están cubiertas, y la clave
  `[x]`/`[ ]` se explica al inicio de forma consistente.
- **Ninguna casilla huérfana:** cada `[ ]` dice quién la trae.
- **Cero IDs colgados**, verificado con `grep`: `D-04`, `D-06`, `D-07`, `D-10`, `RES-03`,
  `CTR-01.3`, `CTR-01.6`, `CTR-01.8` y `CTR-01.9` existen todos. Tampoco hay placeholders
  sueltos tipo `TBD` o `XXX`.
- **Fuera de `FIND-05`, ninguna casilla `[x]` afirma una conclusión legal sin ficha detrás.**
  La sección de fundamento de la duración (líneas 58-91) es la parte más sólida del
  entregable.

---

## Qué sigue, y de quién es

- **`contenido`** — incorporar lo que `RES-06` y `RES-09` ya respondieron (`FIND-01` a
  `FIND-04`), actualizar el "Resumen para quien audita el gate", y acotar la frase de
  `FIND-05` marcándola como supuesto heredado de `D-04` en vez de hecho verificado. Más la
  prolijidad de `FIND-06`.
- **Hilo principal** — `FIND-05` tiene su **origen** en `D-04` (`Docs/DECISIONES.md`), que
  no es de `contenido`. Corregir ahí también, o el error se vuelve a heredar.
- **`investigador`** — sigue debiendo las **8 preguntas legales genuinas**. Nada de este
  reporte las reemplaza.
