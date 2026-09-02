# ARQ — Cómo se pasa de una pantalla a la otra

> Rol dueño: `arquitectura`. Consume: `D-02` (islas, sin backend), `D-09` (jugable con el
> pulgar, sin muro de entrada), `D-14` (molinetes abiertos), `D-15` (salida estática en
> Vercel), `D-17` (voz), `D-19` (la mezcla por sección), `D-28` (el reloj de `US-02`),
> `D-29` (ninguna isla arrastra Node, y su guardián `src/lib/islas.test.ts`), `D-31` (lo
> que cuesta un `transform` sobre un contenedor de desplazamiento), `ADR-02` v2
> (`Docs/ARQ/ARQ-link-resultado-compartido.md`), `CTR-01` (motor de fragmentos),
> `Docs/ORQ/ORQ-plan-ciclo-11.md` (`T-176`..`T-183`, `T-185`, `T-193`),
> `.claude/rules/diseno-marca.md`, `.claude/rules/codigo-juegos.md`.
> Produce: **`ADR-03` v1**.
> Última actualización: 2026-09-01 (`T-180`, ciclo 11).

- **Estado:** **aceptada**, con **cinco supuestos declarados** (apartado 10). Ninguno de
  los cinco cambia la decisión si sale al revés: el peor caso de todos es *el sitio se ve
  como se ve hoy*. Por eso esto se puede cerrar sin esperar la ficha.
- **Implementa:** `T-181`, `T-182` y `T-183` (hilo principal). Este documento **no trae
  código de producción**: trae el mecanismo, los nombres, los topes y las prohibiciones.
- **No decide el efecto.** Cómo se ve el paso —qué se hunde, qué aclara, cuánto dura de
  verdad dentro del techo de acá— es de `experiencia` en `UX-20` (`T-176`). Este ADR dice
  con qué se hace y qué no se puede romper haciéndolo.
- **No toca el adentro de la partida.** El paso de pregunta a devolución vive en el
  `mostrar()` de cada isla y el plan del ciclo lo dejó afuera a propósito. Acá se decide
  cómo se pasa **de un documento a otro**.

---

## 1. Lo que hay hoy, medido

Tres datos, y los tres son de este repo, no de memoria:

1. **El sitio entero tiene dos movimientos.** `src/styles/juego.css:104`
   (`transition: border-color 120ms, background-color 120ms` en `.opcion`) y
   `src/styles/sitio.css:147` (el vuelo de la mosca, 17 s). Nada más. Medición del hilo
   principal, 2026-09-01.
2. **No hay un solo token de movimiento en `src/styles/tokens.css`**, y el corte de
   `prefers-reduced-motion` de `tokens.css:203-210` es un `*, *::before, *::after` con
   `!important` que apaga también los 120 ms de `.opcion`, que son información y no
   adorno. Lo arregla `T-178`; acá importa porque **ese `*` tampoco alcanza para apagar un
   tránsito** (apartado 6.4).
3. **Las seis islas de partida no sobreviven a un cambio de documento, ni pretenden
   hacerlo.** Las seis capturan el DOM y el contenido en el ámbito del módulo (y lo mismo
   vale para los otros seis archivos de `src/scripts/`, que son piezas sueltas de pantalla
   y no partidas):

   | Isla | Página | Qué captura al evaluarse |
   |---|---|---|
   | `partida.ts` | `quiz.astro` | `portada`/`partida`/`resultado` (l. 66-68), el banco (l. 70) y **`leerDesafio(location.search, …)` (l. 71)** |
   | `partida-tema.ts` | `juegos/adivinar-el-tema.astro` | las tres zonas (l. 71-73), el catálogo (l. 75), **`new Reproductor()` (l. 76)** y un `visibilitychange` a nivel `document` (l. 132) |
   | `partida-tapa.ts` | `juegos/adivinar-la-tapa.astro` | las tres zonas (l. 21-23) y el banco (l. 25) |
   | `partida-letra.ts` | `juegos/completar-la-letra.astro` | las tres zonas (l. 25-27) y el banco (l. 39) |
   | `partida-por-la-letra.ts` | `juegos/adivinar-por-la-letra.astro` | las tres zonas (l. 55-57), banco y catálogo (l. 64-65) y **`leerDesafio` (l. 144)** |
   | `partida-dos-ejes.ts` | `juegos/dos-ejes.astro` | el banco (l. 26) y las tres zonas (l. 28-30) |

   Un módulo se evalúa **una vez por documento**. Mientras cada pantalla sea un documento
   nuevo, eso es correcto y es la arquitectura de islas de `D-02` funcionando. En cuanto
   algo intercambie el documento sin recargarlo, las seis quedan apuntando a nodos que ya
   no están en el árbol.

Y dos cosas más que cualquier mecanismo tiene que respetar:

- **`ADR-02` no se puede romper.** El script en línea de `src/pages/index.astro:63-67`
  redirige los enlaces de desafío viejos (`?g=…`) a `/quiz/` con la consulta intacta, y
  dos islas leen `location.search` **en el ámbito del módulo**.
- **El foco se cae al `body` en cada cambio de pantalla.** Medido el 2026-08-24 y escrito
  en `src/scripts/partida.ts:92-108`. El arreglo (`enfocar()`) está en dos de las seis
  islas —`partida.ts` y `partida-por-la-letra.ts`—; `partida-tapa.ts` no lo tiene, y su
  `pintarResultado()` (l. 140-156) no enfoca nada.
  **Eso pasa adentro de una isla, sin cambiar de documento**, y ninguna de las candidatas
  de acá lo toca.

---

## 2. Las candidatas

| | Qué es | JavaScript | Qué le hace a la isla |
|---|---|---|---|
| **A** | `@view-transition { navigation: auto; }` — tránsito de CSS **entre documentos** | cero | nada: el documento se sigue cargando entero |
| **B** | `<ClientRouter/>` de Astro (ex `ViewTransitions`) | un enrutador en las 148 páginas | intercambia el documento: las seis quedan en riesgo |
| **C** | Pintado a mano, pantalla por pantalla, sin API de tránsito | el que se escriba | depende de cada pantalla |
| **D** | Solo la entrada del documento nuevo: una animación de llegada, sin salida ni cruce | cero | nada |

La cuarta la traigo yo, y no como alternativa: **D es el piso de A**, y por eso A no tiene
modo de falla. Ver apartado 5.

---

## 3. Decisión

**Se elige A: `@view-transition { navigation: auto; }`, declarado una sola vez en
`src/styles/tokens.css`, que es la hoja que importan las trece páginas del repo —
directamente o a través de `src/layouts/Base.astro`.**

El argumento entero cabe en una línea: **el tránsito no puede costar más que lo que
transporta.** Lo que se transporta acá es un cruce de medio segundo entre dos pantallas de
un sitio que promete partidas de dos o tres minutos. Cualquier mecanismo que a cambio de
eso ponga en riesgo seis islas, un motor de audio y el formato de enlace compartido está
pagando de más, y lo está pagando en la moneda que este proyecto declaró más cara: el
tiempo abajo del dedo (`D-09`).

Tres propiedades que la vuelven la elección obvia y no una preferencia:

1. **No hay ciclo de vida nuevo.** Navegar sigue siendo navegar. El documento viejo se
   descarta, el nuevo se carga, la isla nace como nace hoy. No hay nada que persistir, que
   desmontar, que volver a enganchar ni que acordarse de limpiar.
2. **No toca un solo archivo del ciclo 10.** La adhesión vive en `tokens.css`, así que
   `quiz.astro` —que es del otro agente hasta que cierre `T-167`— entra al tránsito **sin
   que nadie lo edite**. `T-182` lo dejaba afuera por prudencia; con A queda afuera del
   trabajo y adentro del efecto.
3. **Donde no hay soporte, no pasa nada.** Una regla-`@` desconocida se descarta entera al
   analizar la hoja: el navegador que no la entiende ve el sitio de hoy, con su documento
   nuevo. No hay repuesto que escribir porque el repuesto es el estado actual.

---

## 4. Qué le pasa a cada cosa

### 4.1 La partida en curso, en una línea sin ambigüedad

> **Una partida en curso se termina al navegar: el documento se descarta, la isla se va
> con él y el que vuelve encuentra la portada del juego. El tránsito no la guarda, no la
> reanuda y no promete nada — exactamente lo mismo que pasa hoy.**

Y que quede escrito el corolario, porque es lo que evita una discusión dentro de dos
meses: **este ADR no es el lugar donde se decide reanudar una partida.** Si algún día se
quiere que la vuelta atrás devuelva la vuelta empezada, eso es `producto` y `localStorage`,
no un mecanismo de tránsito.

### 4.2 El audio

El `AudioContext` lo crea `Reproductor.despertar()` (`src/lib/tema/audio.ts:93-115`) y el
`Reproductor` vive en el módulo de `partida-tema.ts` (l. 76). **Vive en el documento y se
va con el documento.** Nada que cerrar a mano, nada compartido entre pantallas, ningún
contexto huérfano sonando en una página donde no hay juego.

Tres consecuencias que hay que decir de frente:

- **Un fragmento sonando se corta al navegar**, como hoy. Si el navegador deja sonar el
  documento saliente mientras dura el cruce, la cola es de milisegundos y no la escucha
  nadie; el techo de duración del apartado 6.2 la acota sola.
- **La `bfcache` sigue siendo la de siempre.** Volver con el botón de atrás puede devolver
  un documento congelado —isla montada, módulo sin re-evaluar, contexto de audio
  suspendido— y eso ya es así hoy, con o sin tránsito. A no lo cambia; B lo elimina y lo
  reemplaza por algo peor (apartado 7.1).
- **Y esto le llega a `ADR-04` (`T-189`) antes de que se escriba:** con A, **la cama de
  cinta no cruza el tránsito**. Nace y muere con cada documento, y como los navegadores
  exigen un gesto para dejar sonar algo, en cada pantalla nueva va a necesitar uno. Eso no
  es un detalle de construcción: puede cambiar el diseño de la cama entera. Lo escribo acá
  porque es una consecuencia de este ADR, no un descubrimiento de aquel.

### 4.3 El foco

**Lo deja igual, y eso es una respuesta, no una evasión.**

Hay dos problemas de foco distintos y conviene no mezclarlos:

| Cuál | Dónde pasa | Qué hace A |
|---|---|---|
| El foco arranca arriba al cargar una página | navegación real entre documentos | nada, y está bien: es lo que el navegador hace y lo que corresponde |
| El foco se cae al `body` al cambiar de pantalla | **adentro** de una isla (`mostrar()`) | nada: no es un cambio de documento |

El segundo es el que midió la auditoría del 2026-08-24, el que `partida.ts` y
`partida-por-la-letra.ts` arreglaron con `enfocar()` y el que las otras cuatro resuelven a
medias o no resuelven — `partida-letra.ts` y `partida-tapa.ts` tienen **un** `.focus()`
cada una en todo el archivo.
**Ningún mecanismo de tránsito lo arregla**, porque no ocurre en un tránsito. Queda como
deuda con dueño: es del hilo principal, adentro de la isla, y no de este ADR.

Lo que sí decide este ADR es que **nadie lo empeore**: A no le agrega al sitio ni un solo
cambio de pantalla sin cambio de documento. B convierte en eso **todas** las navegaciones
del sitio, y con ellas hereda el problema del foco en cada una — más el título de la
página, que hoy el navegador anuncia gratis y allá hay que reponer a mano.

### 4.4 El botón de atrás y los enlaces de desafío

- **El atrás sigue siendo una navegación de verdad**: mismo historial, misma `bfcache`,
  mismo comportamiento que hoy, más el cruce si el navegador lo soporta.
- **`ADR-02` queda intacto sin escribir una línea.** El script en línea de
  `index.astro:63-67` corre cuando se carga el documento, que es siempre; las dos islas que
  leen `location.search` en el ámbito del módulo lo leen del documento que efectivamente se
  cargó. Un enlace de desafío llega frío desde afuera (Twitter, un mensaje) y entra por una
  carga completa: no hay caso en que la consulta y el documento se desincronicen.
- **Ida y vuelta se ven igual**, salvo que `UX-20` pida lo contrario y traiga con qué. Ver
  la prohibición 6.5.

---

## 5. Por qué D no está descartada: es el piso de A

`T-185` va a construir el umbral de la portada como animación de llegada del documento. Esa
misma técnica, aplicada al resto, **es la candidata D**. Y es exactamente lo que ve quien no
tiene soporte para A: el documento nuevo llega y se presenta solo, sin cruce con el
anterior.

O sea que A y D **no compiten: se apilan**. A es D más la continuidad del cruce donde el
navegador la da. Esa es la razón real por la que el dato de soporte que le pido a
`investigador` (apartado 10) **no bloquea nada**: no elige entre dos caminos, solo dice
cuánta gente ve el escalón de arriba.

Con una condición que sí es dura, porque si no se paga doble movimiento:

> **El umbral de entrada y el tránsito no pueden dispararse en la misma navegación.** El
> umbral corre **una vez por visita** —ya está así en `T-185`—, así que en la navegación
> interna no aparece. Si alguna vez el umbral pasa a correr en cada página, esta regla se
> rompe y hay que volver acá.

---

## 6. Las reglas duras del tránsito

### 6.1 Una sola adhesión, en un solo archivo

`@view-transition { navigation: auto; }` se declara **una vez**, en `src/styles/tokens.css`.
No se declara por página. El tránsito entre documentos necesita que **los dos** documentos
adhieran: una adhesión por página es una matriz de pares que nadie va a mantener, y el
primer par que falte se cae en silencio.

### 6.2 Los topes numéricos

| Qué | Techo | Por qué |
|---|---|---|
| JavaScript que suma el tránsito | **0 bytes** | el portal transfiere hoy 3,9 KB sin ninguna biblioteca de interfaz, y ese número no se toca |
| CSS nuevo del tránsito en `tokens.css` | **≤ 400 bytes** sin comprimir | es una regla-`@`, tres nombres y un corte de movimiento; si necesita más, dejó de ser un mecanismo y se volvió un efecto |
| Duración del cruce | **≤ 200 ms** | por debajo del umbral en que un paso se siente como una espera. `UX-20` puede pedir menos, nunca más |
| Elementos con `view-transition-name` por documento | **3** | cada nombre es una captura de pintura más, y el destino son celulares de gama baja |
| Retraso del primer toque | **0 cuadros** | el documento nuevo es tocable desde el primer cuadro. Es `D-09` y no se negocia |

**La duración no se escribe en la regla del tránsito: sale de un token de `T-177`.** Nombre
propuesto: `--tiempo-transito`. El nombre final lo fija `T-177` con la hoja 12 del lienzo,
pero **tiene que existir uno**: un tiempo suelto en un componente es el mismo defecto que un
hex suelto (`.claude/rules/diseno-marca.md`).

### 6.3 Los tres nombres, y no hay un cuarto

`view-transition-name` es un identificador global del documento. Dos elementos con el mismo
nombre en el mismo documento hacen que el tránsito no ocurra, y no avisa. Entonces se fija
el vocabulario acá y no en cada página:

| Nombre | Qué lleva | Dónde se declara |
|---|---|---|
| `mosca` | lo único vivo del sitio (`T-183`) | `Base.astro` |
| `marca` | la firma `ARCADE RICOTERO` | `Base.astro` y la cabecera de cada juego |
| `lugar` | el fondo/velo de la sección (`T-181`) | `Base.astro` |

Y tres prohibiciones que van pegadas:

- **Ningún nombre sobre un contenedor de desplazamiento ni sobre `main`.** `D-31` ya pagó
  ese precio con un `transform` sobre la hoja de versos: crea bloque contenedor y complica
  el desplazamiento.
- **Ninguna pantalla de partida lleva nombre.** `#portada`, `#partida` y `#resultado` no
  participan del tránsito. Son las zonas que las islas vacían y rellenan con
  `replaceChildren()`: nombrarlas es pedirle al navegador que interpole algo que la isla
  está por borrar.
- **Un nombre nuevo es una modificación de este ADR**, no una línea de CSS.

### 6.4 El corte de movimiento reducido, que hoy no alcanza

El `*, *::before, *::after` de `tokens.css:203-210` **no llega a las pseudo del tránsito**:
el selector universal empareja elementos, y `::view-transition-old()` / `::view-transition-new()`
viven en un árbol de pseudo-elementos aparte. Traducido: si `T-178` reescribe el corte sin
tener esto en cuenta, **quien pidió menos movimiento va a recibir el único movimiento nuevo
del ciclo.**

La forma preferida, porque apaga el mecanismo y no sus síntomas:

```css
@media (prefers-reduced-motion: reduce) {
  @view-transition { navigation: none; }
}
```

Si la comprobación de `T-178` muestra que el navegador no respeta esa anidación, el
repuesto es apagar la animación de las pseudo (`::view-transition-group(*)`,
`::view-transition-old(*)`, `::view-transition-new(*)`), que deja el cambio instantáneo.
**Se prueba en el navegador y se deja escrito cuál de las dos quedó.** Con movimiento
apagado el sitio dice lo mismo: no hay información en el cruce, solo continuidad.

### 6.5 Lo prohibido mientras rija este ADR

1. **`<ClientRouter/>`, `astro:transitions`, `astro:page-load` y `transition:persist`.**
   Ninguno entra sin reabrir este documento.
2. **`document.startViewTransition()`** y cualquier tránsito manejado desde JavaScript: el
   presupuesto de este mecanismo es cero bytes y ese cero es la decisión, no la medición.
3. **Distinguir la ida de la vuelta con `pageswap` / `pagereveal`.** Si `UX-20` quiere que
   volver se vea distinto que entrar, se resuelve sin JavaScript o no se resuelve; y si la
   vía sin JavaScript necesita un dato de soporte, se pide ficha primero.
4. **Tocar el script en línea de `index.astro`.** Es `ADR-02` y no está en discusión.
5. **Que el tránsito lleve información.** Nada de lo que el jugador necesita saber puede
   estar solo en el cruce: hay gente que no lo ve nunca.

---

## 7. Alternativas descartadas

### 7.1 B — el `<ClientRouter/>` de Astro

Descartada, y no por gusto: **porque convierte cada navegación en un intercambio de
documento, y las seis islas están escritas contra la suposición contraria.** Lo que pasa,
archivo por archivo, con lo que hay hoy en el repo:

- **La segunda visita a un juego no arranca.** El módulo ya se evaluó; sus constantes
  (`portada`, `partida`, `resultado`, el banco) apuntan a nodos del documento anterior. La
  pantalla se dibuja y el botón no hace nada — que es, letra por letra, el defecto que
  `D-29` describe: *"la portada quedaba dibujada y no pasaba nada al tocar un disco"*.
- **El `AudioContext` sobrevive a la partida.** `new Reproductor()` está en el ámbito del
  módulo de `partida-tema.ts` (l. 76) y el `visibilitychange` de la l. 132 está enganchado
  a `document`. Los dos siguen vivos después de irse del juego, y el segundo sigue
  pausando un cronómetro de una partida que ya no existe. Lo mismo, con menos daño, en
  `cancion.ts:127` y en `armar-cancionero.ts:200-205`.
- **`ADR-02` queda a merced de un detalle interno de Astro.** `partida.ts:71` y
  `partida-por-la-letra.ts:144` leen `location.search` al evaluarse el módulo. Si el
  módulo no se re-evalúa, el desafío de la pantalla nueva no se lee; si se re-evalúa, hay
  que verificar qué pasa con el resto del ámbito.
- **Habría que tocar `quiz.astro` y `partida.ts`**, que son del ciclo 10. B no respeta la
  frontera entre los dos ciclos; A ni la roza.

El arreglo existe —`astro:page-load` y reescribir las seis islas como funciones de montaje
y desmontaje— y por eso hay que decir claro **por qué no vale la pena**: es reescribir las
seis islas de partida contra un comportamiento de re-ejecución de scripts que **no
verifiqué y no voy a escribir de memoria** (usamos `astro ^5.14.1`, `package.json:23`),
para conseguir un efecto que A da gratis. Y son seis de seis de lo que corre en el teléfono
de la gente cuando juega. El trabajo, además, no lo cubre ningún test: `islas.test.ts` mira
el grafo de importaciones, no el ciclo de vida (apartado 8).

Su única ventaja real —que un elemento sobreviva de verdad, sin re-crearse— se paga en el
apartado 4.2 y en el 4.3, y no la pidió nadie. Si algún día se pide, **este es el documento
donde se discute**, y la conversación arranca con la medición del peso del enrutador sobre
las 148 páginas, que hoy no está hecha.

### 7.2 C — pintado a mano, pantalla por pantalla

Descartada por dos motivos, uno de costo y uno de doctrina.

El de costo: sin API de tránsito no hay forma de tener a la vez la pantalla que se va y la
que llega, así que "a mano" termina siendo **o** una animación de llegada —que es la
candidata D, o sea el piso que ya tenemos— **o** un simulacro con JavaScript que retiene la
navegación mientras dibuja la salida. Lo segundo es un enrutador de cliente hecho en casa,
con todos los problemas de B y sin nadie que lo mantenga.

El de doctrina: **retener la navegación es cerrar un molinete.** `D-14` en la forma que le
dio el plan de este ciclo — *una animación que hay que aguantar es un molinete nuevo*. Un
mecanismo que puede llegar ahí no entra, aunque la primera versión no llegue.

### 7.3 Lo que ni siquiera llegó a candidata

- **Una sola página con todo adentro (el sitio como aplicación).** Contradice `D-02` y
  `D-15` de frente, y tira a la basura la propiedad que hace que este sitio cargue en 3,9 KB.
- **Cargar la pantalla siguiente por adelantado al pasar el dedo.** Suma JavaScript y
  tráfico para ahorrar milisegundos en un sitio que ya es estático y chico. Si alguna vez
  el tránsito se siente lento, primero se mide.

---

## 8. ¿Alcanza `islas.test.ts` como guardián?

**No, y no es un defecto suyo: mira otra cosa.** `src/lib/islas.test.ts` recorre el grafo
de importaciones desde `src/scripts/` y falla si aparece un `node:*` (`D-29`). No sabe nada
del ciclo de vida de una isla, ni de escuchas que no se desenganchan, ni de constantes que
quedan apuntando a un documento muerto.

Ahora bien: **con la opción A no hace falta un guardián de islas nuevo, porque el ciclo de
vida no cambia.** `islas.test.ts` sigue verde y sigue alcanzando **para lo suyo**, y su
verde es además parte de la comprobación de este ADR: si `T-181` o `T-182` lo pusieran en
rojo, es que alguien se salió del mecanismo.

Lo que sí hace falta es un guardián **del mecanismo**, y su lugar natural es
`src/lib/movimiento.test.ts`, el archivo que `T-179` crea en este mismo ciclo. Tres
aserciones, redactadas para que se puedan copiar:

1. **Nadie mete un enrutador de cliente.** Leer todos los `.astro` de `src/pages/` y
   `src/layouts/` y afirmar que **ninguno** contiene `ClientRouter`, `astro:transitions`,
   `astro:page-load` ni `transition:persist`. Mensaje de falla: *"el tránsito entre
   documentos es `ADR-03`; un enrutador de cliente reabre el ciclo de vida de las seis
   islas"*.
2. **La adhesión es una sola.** `@view-transition` aparece **exactamente una vez** en todo
   `src/styles/`, y en `tokens.css`. Dos adhesiones son dos fuentes de verdad sobre qué
   pantallas cruzan.
3. **El tránsito tiene su equivalente quieto.** El archivo que declara `@view-transition`
   contiene también, adentro de un bloque `prefers-reduced-motion: reduce`, **o**
   `navigation: none` **o** una regla que apague las pseudo `::view-transition-*`. Es el
   caso concreto de la regla general que `T-179` ya tenía que escribir (*"si una animación
   no tiene su equivalente quieto, falla"*), aplicado a la única animación del ciclo que el
   `*` no alcanza.

Y una cuarta, si `T-179` la quiere barata: **como mucho tres `view-transition-name`
distintos en todo `src/`**, y ninguno igual a otro dentro del mismo archivo.

---

## 9. El presupuesto

| | Hoy | Con A | Con B |
|---|---|---|---|
| JavaScript del portal | 3,9 KB, sin biblioteca de interfaz | **3,9 KB — no suma nada** | un enrutador en las 148 páginas; **no medido** |
| CSS nuevo | — | ≤ 400 bytes sin comprimir | además del enrutador |
| Archivos nuevos que bajar | — | **ninguno** | al menos uno |

**El número que manda es el cero.** No es "casi nada": es cero, y por eso está escrito como
tope y no como resultado. Si alguna vez se reabre esto, el techo absoluto para reemplazar a
A es **+1 KB comprimido en el portal, con la medición adjunta** — y aun así habría que
contestar el apartado 7.1 entero.

El peso del `<ClientRouter/>` **no lo cito porque no lo medí**. Lo que sé sin medirlo es que
no es cero y que corre en las 148 páginas que genera el build (el número está en `ADR-02`
v2). Contra un portal de 3,9 KB, eso no es un detalle de rendimiento: es un cambio de orden
de magnitud en lo único que este sitio nunca tuvo que optimizar.

---

## 10. Los cinco supuestos, y qué pasa si me equivoco

Ninguno se escribió de memoria como si fuera un hecho. Los cinco están acá para que se
puedan tachar de a uno.

| | Supuesto | Si sale al revés |
|---|---|---|
| **S1** | Una regla-`@` desconocida se descarta entera y no rompe la hoja | nada: se ve el sitio de hoy. Riesgo nulo |
| **S2** | El tránsito entre documentos exige que **los dos** documentos adhieran y sean del mismo origen | el cruce no pasa en algún par de pantallas. Cosmético |
| **S3** | El `*` de `tokens.css:203-210` **no** alcanza a las pseudo del tránsito | sobra la regla de 6.4 y no molesta a nadie. Se comprueba en el navegador, no se discute |
| **S4** | **Cuál es el soporte real hoy, por navegador y por versión** | cambia **cuánta gente** ve el cruce. **No cambia la decisión**: el que no lo tiene ve la candidata D (apartado 5) |
| **S5** | Cuánto pesa el `<ClientRouter/>` | solo importa el día que alguien quiera reabrir 7.1, y ese día se mide antes de discutir |

**`S4` es lo único que le pido a `investigador`**, y lo pido igual aunque no bloquee: el
número sirve para que `UX-20` sepa si está diseñando el paso para casi todos o para la
mitad. El pedido queda en
`Docs/SUGERENCIAS/ARQ-para-investigador-soporte-transito-entre-documentos.md`, **sin número
de ficha**: lo toma `investigador` del rango libre que dejó el plan del ciclo (`RES-54`+).

---

## 11. Consecuencias

- **Fácil, y es lo mejor de esta decisión:** `T-181` es un bloque de CSS en `tokens.css` y
  tres `view-transition-name` en `Base.astro`. `T-182` no necesita tocar las cinco páginas
  de juego salvo para nombrar su cabecera. `quiz.astro` entra sin que nadie lo abra.
- **Fácil:** agregar una pantalla al sitio. Si importa `tokens.css` —y las trece lo
  hacen— ya está adentro del tránsito. No hay lista que mantener.
- **Difícil, y hay que hacerlo igual:** `T-178` deja de ser un arreglo cosmético del corte
  de movimiento y pasa a ser parte de este mecanismo (6.4). Si sale mal, el que pidió menos
  movimiento recibe el único movimiento nuevo.
- **Difícil:** `T-183` no consigue lo que su título promete. **La misma mosca no cruza: lo
  que cruza es la continuidad visual del cruce.** El vuelo de 17 s vuelve a empezar en cada
  documento, porque no hay forma de transportar la fase de una animación entre documentos
  sin JavaScript. Si `UX-20` exige que el vuelo no reinicie, **eso reabre este ADR** y hay
  que traer con qué; mientras tanto, lo que se compra es que la mosca esté en el mismo
  lugar de un lado y del otro, que a 200 ms es lo que se ve.
- **Se hereda, sin cambios:** el foco adentro de la isla sigue siendo deuda del hilo
  principal (`partida-tapa.ts` es el caso más claro), y el "adentro de la partida" sigue
  afuera de este ciclo por decisión del plan.
- **Y una que conviene escribir para el que revise `REV-10`:** si el paso se siente pobre,
  la respuesta correcta **no** es cambiar de mecanismo. Es `UX-20` pidiendo otro efecto
  adentro de los mismos 200 ms. Cambiar de mecanismo para conseguir un efecto es cómo se
  llega a tener un enrutador de cliente sin haberlo decidido nunca.

---

## 12. Cómo se verifica

Lo corre el hilo principal o `revisor` (`D-12`: yo no tengo con qué).

**A máquina, ahora mismo — tiene que dar esto aunque el tránsito todavía no exista:**

```bash
node --test src/lib/islas.test.ts     # verde: el mecanismo no toca ninguna isla
npm test
npm run check
```

```powershell
# Cero enrutador de cliente en todo el repo. Tiene que devolver 0 líneas.
Select-String -Path src\**\*.astro,src\**\*.ts -Pattern 'ClientRouter|astro:transitions|astro:page-load|transition:persist|startViewTransition'
```

**A máquina, cuando `T-181` construya:**

```powershell
# Exactamente UNA adhesion, y en tokens.css.
Select-String -Path src\styles\*.css -Pattern '@view-transition'
# Como mucho tres nombres distintos en todo el repo.
Select-String -Path src\**\*.css,src\**\*.astro -Pattern 'view-transition-name'
```

```bash
node --test src/lib/movimiento.test.ts   # las tres aserciones del apartado 8
node --test src/lib/contraste.test.ts    # el tránsito no cambia un par, pero se corre igual
```

**A ojo, en un teléfono, que es lo que ninguna máquina hace (375 × 812):**

1. Portada → un juego → **atrás del navegador**. Vuelve sin parpadeo y con la partida
   cerrada. Ningún estado a medias.
2. Tocar el botón principal del documento nuevo **durante** el cruce: tiene que responder.
   Si no responde, el mecanismo está reteniendo el dedo y eso lo descalifica (6.2).
3. Con `prefers-reduced-motion` activo: **no hay cruce**, la mosca quieta, y el borde de la
   opción sigue cambiando al tocar (`T-178`).
4. Abrir `/quiz/?g=quiz&p=23&t=40&d=retirada` de una pegada, desde afuera: el desafío se
   lee igual (`ADR-02`).
5. En la pestaña de red: el documento del portal sigue **por debajo de 5 KB transferidos** y
   **cero pedidos de JavaScript nuevos**.
6. Una vuelta entera jugada en cada uno de los cinco juegos, más el quiz. Es la
   comprobación que `D-29` dejó escrita con sangre: `npm test`, `npm run check` y
   `npm run build` los tres pasaron mientras el juego estaba muerto.
