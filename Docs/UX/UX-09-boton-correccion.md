# UX-09 — El botón de corrección: dónde vive y cómo se abre

> Rol dueño: `experiencia`. Consume `Docs/PRODUCTO/PRD-correcciones.md` (`BR-21` entero),
> `Docs/DECISIONES.md` `D-25`, `Docs/ORQ/ORQ-plan-ciclo-9.md` (frente D), `Docs/UX/UX-01-
> flujo-quiz.md`, `UX-07-quiz-por-vidas.md` y `UX-08-adivinar-por-la-letra.md` (el panel de
> respuesta que ya existe, para no rediseñarlo), `.claude/rules/diseno-marca.md` y
> `.claude/rules/voz-ricotera.md`. Código leído para no inventar sobre lo que ya corre:
> `src/scripts/partida.ts`, `partida-letra.ts`, `partida-por-la-letra.ts`. `T-152`, ciclo 9.

**Resuelve:** la parte de `BR-21` que el propio documento deja para acá — "dónde vive el
botón dentro de cada pantalla, tamaño de toque y que no compita visualmente con `SEGUÍ`" —
para `US-01` (quiz), `US-03` (completá la letra) y `US-07` (sacalo por la letra). No entra
`US-06` (`BR-21` apartado 4, punto 3: no hay dato que corregir).

**Fuera de esta hoja:** el payload y el transporte (`CTR-10`, `arquitectura`), el texto
exacto del disparador, el panel y la confirmación (`CNT-12`, `contenido`), y el componente
en sí (`Correccion.astro`, hilo principal, `T-153`/`T-154`). Acá fijo estructura, ubicación
y comportamiento — la forma del molde, no lo que se imprime adentro.

---

## 0. El panel de respuesta, tal como está hoy en los tres juegos — no como lo simplifica el pedido

El pedido describe un único panel con un orden fijo. El código real tiene tres variantes
del mismo panel, y las diferencias importan para decidir dónde entra el disparador:

| | `US-01` (quiz) | `US-03` (completá la letra) | `US-07` (sacalo por la letra) |
|---|---|---|---|
| `role="status"` en el panel | Sí | **No** — no está seteado en `partida-letra.ts` | Sí |
| Contenido del panel, en orden | micro · explicación · sello (si hay) · link a Spotify (si hay) | micro · explicación · sello (si hay) · **línea de fuente con enlace** | micro · explicación · ficha de disco (si hay) · puntos del paso · **línea de fuente con enlace** · link a la letra completa |
| Dónde vive `SEGUÍ` | **Afuera** del panel, a propósito (comentario del código: *"así la región viva anuncia el resultado y la explicación, y no 'SEGUÍ, botón' mezclado con ellos"*) | **Adentro** del panel (`panel.append(seguir)`) | **Afuera** del panel, mismo patrón que el quiz |

**Lo que hago con esto, antes de decidir nada más.** Dos de los tres juegos ya resolvieron
"un control no vive dentro de la región viva" sacando a `SEGUÍ` afuera; el tercero no lo
hizo, y de paso le falta el `role="status"` que los otros dos sí tienen. No es una decisión
mía tocar ese código — es de quien construya `T-153`/`T-154` —, pero si esta tarea entra a
`US-03` sin señalarlo, el disparador de corrección nuevo se suma a un panel que **ya**
tiene el problema que esta misma tarea me pide evitar. Dejo la regla en la sección 1 en
términos que valen para los tres sin depender de qué arregle o no arregle el código hoy, y
dejo el desvío anotado como bloqueo al final.

---

## 1. Dónde vive el disparador

### La regla, igual en los tres juegos

**El disparador es el último elemento de la pantalla de revelación de cada ítem, siempre
después de `SEGUÍ`, nunca dentro del panel `role="status"`.** No antes (no compite con el
primer vistazo al resultado ni al foco que aterriza en `SEGUÍ`) y no adentro (repetiría,
con un control nuevo, el mismo defecto que `UX-01` ya evitó una vez con `SEGUÍ`: una región
viva que un lector de pantalla anuncia entera, mezclando la noticia con un botón).

Aparece **siempre** que aparece el panel de revelación — acierto o error, con o sin sello
de leyenda/testimonio, agotó intentos o no — porque `BR-21` no distingue por desenlace: una
corrección puede ser sobre la explicación de un acierto tanto como sobre el error de una
respuesta mal marcada.

**Dónde NO aparece, por alcance:**
- **Pantalla 0** (entrada): no hay ítem todavía que corregir.
- **Pantalla de resultado final** (`pintarResultado()` de los tres juegos): agrega
  puntaje, aciertos, tramo — ningún dato ahí está "atado a un ítem concreto" en el sentido
  del apartado 1 de `BR-21`. Poner el disparador ahí abriría una corrección sin decir de
  cuál de los N ítems de la ronda se trata, y `CTR-10` construye el payload a partir del
  ítem que se estaba jugando, no de un resumen.
- **Durante la pregunta, antes de responder**: en los tres juegos, "qué dice el sitio" (la
  opción marcada correcta, la palabra del hueco, el tema del verso) recién se revela al
  responder. Antes de eso no hay afirmación concreta que corregir, solo contenido que el
  jugador todavía está evaluando.

### Por qué no compite con `SEGUÍ`

No compite porque nunca están pidiendo atención al mismo tiempo. En su estado cerrado (el
default), el disparador es un enlace de texto chico que viene *después* de `SEGUÍ` en el
orden visual y en el orden del foco — la mirada y el pulgar llegan primero al botón que
manda el avance. Cuando se abre (sección 3), tapa el panel entero con una superposición:
en ese momento `SEGUÍ` queda cubierto e inerte, no hay dos controles disputándose el mismo
espacio, hay una pantalla a la vez. Cuando se cierra, todo vuelve exactamente a donde
estaba.

### Nota de código que dejo para quien implemente (`T-153`/`T-154`)

En `US-03`, `SEGUÍ` vive hoy adentro del panel y el panel no tiene `role="status"`. Antes
de sumar el disparador ahí, alinear ese juego al patrón que ya usan el quiz y `US-07`
(`SEGUÍ` afuera, panel con `role="status"`) no es una tarea aparte: es la misma tarea, y
hacerla evita que la regla de esta hoja ("nunca dentro de la región viva") se cumpla en dos
juegos y se rompa en el tercero por una diferencia de código que ya estaba antes de que
existiera este botón.

---

## 2. Qué forma tiene — y por qué no es el patrón de la retirada

`UX-07` ya resolvió un disparador secundario en este mismo proyecto: el de retirarse del
quiz, en esquina superior, texto chico, lejos del pulgar, con confirmación de dos pasos.
Es tentador copiarlo. Lo descarto, y la razón es de riesgo, no de gusto:

| | Retirada (`UX-07`) | Corrección (acá) |
|---|---|---|
| Costo de un toque accidental | **Alto**: termina la partida, se pierde todo el progreso — es irreversible | **Ninguno**: abre un panel que se cierra con un toque, no borra nada, no afecta la partida |
| Cuándo conviene que esté a mano | Nunca — es un escape que hay que *no* usar sin querer | **Justo en el momento en que se nota el error** — alejarlo del contenido que lo motivó rompe el vínculo entre "estoy leyendo esto" y "esto está mal" |
| Fricción de abrirlo | Deliberada: distancia física + confirmación de dos pasos | Ninguna extra: un toque abre el panel. La fricción real ya la pone `BR-21` — hay que escribir el texto, y eso alcanza para filtrar el toque perdido |
| Fricción de cerrarlo sin actuar | No aplica (retirarse es la acción, no hay "cerrar sin retirarse" en el disparador) | Cerrar sin mandar es gratis y esperable — es la salida más común, no una excepción |

**Conclusión: transplantar el patrón de la retirada sería sobre-fricционar algo benigno**,
justo lo contrario de lo que pide "molinetes abiertos" — el jugador que más quiere usar
este botón es el que acaba de notar un error, y ponerlo lejos y en dos pasos es la forma
más directa de que se rinda antes de avisar.

### La forma elegida

Un **enlace de texto secundario**, mismo tratamiento visual que ya usan
`← Volver al arcade` y `Ver la letra completa` en el sitio de hoy (tenue, sin fondo propio,
sin ícono): chico en apariencia, pero un elemento nuevo, no reusa la clase `.volver` en el
sentido semántico porque no navega a ningún lado — abre un panel en el lugar donde está.
Por eso es un `<button type="button">`, igual que el disparador de retirada, aunque comparta
el estilo visual tenue de un link.

- **Sin ícono ni emoji.** Los símbolos funcionales del sitio (`✔ ✕ ◆ ❝`) tienen significado
  fijado; ninguno describe "avisar un error", y agregar uno nuevo solo para este botón es
  un brief de arte que esta tarea no pide.
- **Una palabra o dos, texto de `CNT-12`.** Acá no fijo la palabra, fijo que entra en una
  línea sin partirse y que no es un ícono solo.
- **Un solo tap para abrir.** Nada de confirmación previa: la razón está en la tabla de
  arriba.

### El tamaño de toque, igual que la retirada

Visualmente chico, pero `--toque-min` (48×48 px) igual que cualquier otro control del
sitio — la discreción es de contraste y tamaño de letra, nunca de área tocable.

---

## 3. El panel que se abre

### Cómo aparece

Una superposición (overlay) que cubre la pantalla del juego, anclada al borde inferior —
una hoja que sube desde abajo, no una tarjeta centrada — por dos motivos concretos: el
teclado en pantalla ya empuja el contenido desde abajo en cuanto la persona toca el campo
de texto, así que anclar ahí evita un salto raro entre "la tarjeta aparece centrada" y "el
teclado la empuja"; y es la zona que el pulgar ya tiene cerca, coherente con todo lo demás
del sitio.

El fondo del juego se cubre con un **velo plano** — mismo criterio que `--velo-tapa`
(tinta de `--fondo` a alta opacidad, nunca difuminado): confirma que el panel es lo único
interactivo sin usar blur ni glassmorphism, los dos tics que veta
`.claude/rules/diseno-marca.md`. Si no existe un token genérico para esto (`--velo-tapa`
está documentado específicamente para tapas), dejo la necesidad anotada como bloqueo — no
invento un hex nuevo, esa decisión es de quien mantiene `tokens.css`.

**La tarjeta en sí, tratamiento visual:** borde completo en las cuatro caras (nunca una
barra al borde izquierdo — el tic que la regla antislop vetó primero), fondo
`--fondo-elevado` (el par ya testeado "texto sobre fondo elevado"), esquina de estampa
(`border-radius: 3px`), sin sombra difusa. **Sin rotación**, a diferencia de las piezas de
collage (la hoja de versos de `UX-08`, por ejemplo): esto es un formulario que hay que leer
y llenar con precisión, no una pieza ilustrativa — la rotación leve queda reservada para lo
que el sitio ya usa como recorte pegado decorativo, no para una interfaz funcional.

**Ningún color de disco ni de categoría.** El componente es compartido por los tres juegos
de hoy y va a expandirse a la Redondopedia (`ORQ-plan-ciclo-9.md`, frente D) — no pertenece
a ninguna sección de la mezcla `D-19`, así que viste solo la base (`--texto`, `--borde`,
`--fondo-elevado`) más, donde haga falta un acento, `--acento-2` (destaque neutro, no
veredicto — ver sección 4).

### Qué contiene, en orden

1. **Un título corto que nombra qué se está corrigiendo** (juego + ítem, ej. "Corrección ·
   [tema]"), armado con los mismos datos que ya arma `CTR-10` para el payload — no le pide
   nada nuevo a la persona, solo repite lo que el sitio ya sabe. Es de solo lectura y es el
   texto que ancla la accesibilidad (sección 5).
2. **Una cita corta de "lo que dice el sitio"**, también de solo lectura y también tomada
   del mismo contexto que arma el payload — el verso, la respuesta marcada correcta, o la
   explicación, según el juego. Existe para que la persona no tenga que memorizar el dato
   exacto que quiere corregir mientras el panel tapa el resto de la pantalla: la referencia
   viaja con el panel, no depende de que se acuerde de memoria lo que acababa de leer atrás.
3. **El campo obligatorio — el único que `BR-21` pide.** Un área de texto donde la persona
   escribe la corrección o el aporte, sin campos separados para "qué está mal" / "qué
   debería decir" / "categoría": una sola caja de texto libre, tal como fija `BR-21`
   apartado 1 ("no hace falta que la persona sepa en cuál de las tres cae"). Etiqueta clara
   de qué se espera ahí, texto de `CNT-12`.
4. **El campo de contacto, si `CTR-10` decide que exista.** Si existe, va después del
   campo obligatorio, con la palabra "opcional" escrita en la propia etiqueta —no solo en
   el `placeholder`, que desaparece al tipear y no lo lee de forma confiable un lector de
   pantalla— y **sin ningún estado visual de "incompleto" si queda vacío**: nada de
   asterisco, nada de borde en `--acento-4`, nada que sugiera que falta algo.
5. **Las dos acciones de envío** (sección 4).
6. **Una salida para cerrar sin mandar nada** — texto chico, tenue, la última línea del
   panel.

### Cómo se cierra sin mandar

Tres caminos, todos gratis (no hay nada que confirmar para salir sin enviar, a diferencia
de la retirada):

- Tocar la salida explícita del punto 6.
- Tecla `Esc`, comportamiento estándar de un panel modal.
- Tocar el velo, fuera de la tarjeta — es un agregado de cortesía, no un requisito: quien
  navega con teclado o lector de pantalla no tiene equivalente a "tocar afuera", así que la
  salida explícita del punto 6 es la que **tiene** que estar, siempre.

Cerrar sin mandar no deja rastro ni pide confirmar nada — es la salida esperada la mayoría
de las veces que alguien abre el panel para mirar y se arrepiente, y tratarla como gratis
es coherente con que abrir tampoco costó nada.

---

## 4. Las dos salidas, y la regla dura de la confirmación

### Mandar por mail y copiar — mismo tamaño, sin transplantar la jerarquía de la retirada

A diferencia de la retirada, donde el proyecto **quiere** desalentar la salida (el botón
que se queda es el grande, el que se va es el chico), acá pasa lo contrario: si la persona
llegó hasta escribir su corrección, el sitio **quiere** que la mande — es exactamente lo
que `BR-21` existe para habilitar. Las dos acciones de envío llevan tratamiento de acción
principal dentro de este panel (`--acento`, el mismo naranja de "acción" del resto del
sitio, tamaño de toque completo), sin la reserva que sí tiene sentido en la retirada.

Entre las dos, **mandar por mail va primero**: es el camino que termina solo, sin que la
persona tenga que hacer un segundo paso (pegar el texto en algún lado). Copiar queda
segundo, como respaldo para quien no tiene un cliente de mail configurado en el teléfono.
Ninguna de las dos es más chica que la otra — el orden es de lectura, no de tamaño.

### La regla dura: la confirmación no puede sugerir un estado de revisión

Es el punto que `BR-21` deja taxativo y el que más fácil se rompe sin querer, porque el
reflejo natural de cualquier interfaz es "premiar" un envío exitoso. Acá no se puede.

- **Nunca `✔` ni `--acento-3` (el verde de acierto).** Usar el símbolo o el color que en
  todo el resto del sitio significa "esto está bien, está verificado" sobre un mensaje que
  nadie verificó todavía es exactamente el error que `BR-21` prohíbe — visualmente, aunque
  el texto no lo diga.
- **Ningún símbolo nuevo.** Ni un ícono de sobre, ni un tilde de éxito genérico: el sitio
  no tiene un símbolo para "esto se mandó", y no hace falta inventar uno para una
  confirmación que dura un instante y dice una sola frase.
- **Tratamiento neutro:** `--texto` sobre `--fondo-elevado`, y si hace falta un acento
  puntual, `--acento-2` — el mismo tono que `UX-07` ya usa para el aviso de escalón
  justamente porque "no es acierto, no es error, es destaque": acá cumple la misma función,
  llamar la atención sobre el mensaje sin emitir un veredicto que el sitio no tiene.
- **El texto es de `CNT-12`, pero la estructura que dejo es una sola frase que nombra el
  hecho mecánico** ("se copió", "se abrió tu mail") **y nada más** — sin agregar "gracias",
  sin "lo vamos a revisar", sin ningún verbo en futuro que prometa una respuesta. La lista
  negativa completa ya está en `BR-21` apartado 2; acá la regla es que la interfaz no tiene
  ningún elemento —color, símbolo, ícono— que la contradiga por su cuenta aunque el texto
  esté bien escrito.

### Qué pasa después de confirmar

El formulario se reemplaza por la confirmación (mismo mecanismo que ya usa `UX-07` para la
tarjeta de retirada: el contenido del panel cambia en el lugar, no se abre una pantalla
nueva) y queda un solo control: **cerrar**. No hay "mandar otra" en el mismo panel — si la
persona quiere corregir algo más, vuelve a tocar el disparador desde cero, que sigue
disponible en el mismo lugar apenas cierra.

**Si el mecanismo de copiado falla** (puede pasar sin permiso del navegador): el mensaje
que se muestre sigue la misma regla — dice el hecho ("no se pudo copiar"), no inventa una
causa ni sugiere reintentar con lenguaje de disculpa. El texto exacto y si hay un camino de
reintento es de `CTR-10`/`CNT-12`; dejo anotado que, exista o no, no rompe esta regla.

---

## 5. Foco: dónde aterriza al abrir y adónde vuelve al cerrar

Mismo patrón que ya usa el resto del sitio para anunciar una pantalla nueva —
`enfocar(enunciado)` en la pregunta, `enfocar(encabezado)` en el resultado— y no el que usa
la confirmación de retirada, que foca directo un botón: acá primero hay que orientar, no
decidir entre dos opciones.

- **Al abrir:** el foco aterriza en el **título del panel** (punto 1 de la sección 3), con
  `tabindex="-1"`. Es el mismo elemento que sirve de `aria-labelledby` del contenedor
  (`role="dialog"`, `aria-modal="true"`), así que un lector de pantalla anuncia primero
  "corrección sobre [ítem]" antes de que la persona llegue a cualquier campo — orienta antes
  de pedir que escriba, en vez de tirarla directo a una caja de texto vacía sin contexto.
- **Recorrido con `Tab`:** título → cita de solo lectura (no interactiva, se salta) → campo
  obligatorio → campo opcional (si existe) → mandar por mail → copiar → cerrar. El foco
  queda atrapado adentro del panel mientras está abierto (foco no se escapa hacia el juego
  tapado detrás del velo) — es lo mínimo que un panel modal necesita para no desorientar a
  quien navega sin mouse.
- **Al cerrar, por cualquier camino** (cancelar, `Esc`, tocar el velo, o después de ver la
  confirmación): el foco **vuelve al disparador que abrió el panel**, no al botón `SEGUÍ`
  ni al cuerpo de la página. Es el patrón estándar de cierre de un modal y hoy no está
  aplicado en el único precedente que existe en el sitio (la confirmación de retirada de
  `UX-07`/`partida.ts` no reenfoca nada al cancelar) — no es una corrección a esa pantalla,
  que queda fuera del alcance de esta tarea, pero esta hoja no repite el hueco: lo fija bien
  desde el día uno de este componente nuevo.

---

## Checklist — accesibilidad

- [ ] El disparador cumple `--toque-min` (48×48 px) aunque se vea chico.
- [ ] El panel tiene `role="dialog"`, `aria-modal="true"` y `aria-labelledby` apuntando al
      título de solo lectura.
- [ ] El foco aterriza en el título al abrir, recorre el formulario con `Tab` sin escapar
      del panel, y vuelve al disparador al cerrar por cualquier camino.
- [ ] El campo opcional de contacto dice "opcional" en su propia etiqueta, nunca solo en
      el `placeholder`, y ningún estado visual lo marca como incompleto si queda vacío.
- [ ] La confirmación de envío no usa `✔`, `--acento-3` ni ningún símbolo nuevo — tratamiento
      neutro (`--texto`/`--fondo-elevado`, acento puntual en `--acento-2` si hace falta).
- [ ] `Esc` cierra el panel sin mandar nada, igual que la salida explícita.
- [ ] Ninguna transición de apertura/cierre usa un efecto vetado por
      `.claude/rules/diseno-marca.md` (glow, blur, rebote): el velo es tinta plana, la
      tarjeta no rota, el cambio es un aparecer/desaparecer simple.

## Pares de color: ninguno nuevo, una necesidad anotada

| Uso | Token | Par ya testeado |
|---|---|---|
| Cuerpo del panel, título, cita de solo lectura | `--texto` sobre `--fondo-elevado` | "texto sobre fondo elevado" |
| Disparador (enlace tenue) | `--texto-tenue` | "texto tenue sobre fondo" |
| Botones de envío (mail, copiar) | `--acento` | "acento sobre fondo" |
| Confirmación de envío, acento puntual si hace falta | `--acento-2` | "acento-2 sobre fondo" |

**Una necesidad que dejo anotada, no un pedido de color nuevo:** el velo que cubre el juego
detrás del panel necesita un token de "tinta plana semitransparente" genérico. Hoy el único
que existe con ese propósito es `--velo-tapa`, documentado específicamente para fondos de
tapa real (`D-21`). Puede reusarse tal cual (mismos canales de `--fondo`, mismo criterio) o
crearse un `--velo` genérico calcado del mismo valor — cualquiera de las dos cumple; la
decisión de cuál es de quien mantiene `tokens.css`, no mía.

---

## Bloqueos que dejo anotados

- **`US-03` tiene hoy `SEGUÍ` adentro del panel de revelación y el panel sin
  `role="status"`** (sección 0). No lo edito porque es código, no `Docs/UX/`; dejo dicho
  que alinearlo al patrón de los otros dos juegos es parte de instalar este disparador ahí,
  no una tarea aparte.
- **El texto exacto** del disparador, el título del panel, la etiqueta del campo
  obligatorio, la del campo opcional (si existe) y las dos confirmaciones es de `contenido`
  (`CNT-12`, `T-151`) — acá dejo la estructura y qué reglas no puede romper ese texto
  (sección 4), no las palabras.
- **Si existe el campo de contacto y su formato** es de `arquitectura` (`CTR-10`, `T-150`)
  — dejo el lugar que ocupa en el panel y la regla de que nunca es obligatorio, no si
  existe.
- **El token genérico de velo** (reusar `--velo-tapa` o crear `--velo`) queda para quien
  mantiene `tokens.css` — ver tabla de pares de color arriba.
- **El foco perdido al cancelar la retirada del quiz** (`UX-07`/`partida.ts`, sección 5) no
  es una corrección que esta tarea pida ni que yo pueda aplicar sin salirme de `T-152`: lo
  dejo anotado acá porque apareció revisando el precedente, no porque lo resuelva.

---

## Trazabilidad

Esta hoja no reemplaza nada de `UX-01`, `UX-07` ni `UX-08`: agrega un elemento nuevo al
final de un panel que las tres ya describen completo. Ninguna de las tres queda
desactualizada por esta tarea.
