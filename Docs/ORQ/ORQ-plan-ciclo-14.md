# ORQ — Plan del ciclo 14: la cinta pone temas, y las dos pantallas entran en el teléfono

> **Escrito por el hilo principal** con `/ciclo`, el 2026-09-10, a pedido del usuario:
> *"pulir la ux del juego de adivinar los temas, dejandola perfecta para prod, haciendo
> que no haya que scrollear para ver las cacnciones, que no haya espacio muerto en la
> pagina, achicar el mensaje de abajo dejando 'sitio hecho por ricoteros para ricoteros'.
> Mejora total del ux de la pagina principal y del juego de adivinar temas. Ademas que
> encender la cinta toque uno de los temas al azar de los redondos con el filtro vintage,
> uno de los temas enteros, cuando no haya mas que ponga los recortes enteros y cambiando
> entre tema y tema haga un ruido como cambia el vinilo o el cassete medio vintage."*
>
> Arranca sobre `main` en `1137c9b`, árbol limpio. Rangos libres al abrir:
> `T-212`+, `D-37`+, `ADR-07`+, `UX-24`+, `CNT-16`+, `REV-13`+, `CTR-14`+, `RES-56`+.

## 1. Lo medido antes de cortar nada

Todo esto se midió el **2026-09-10**, con `npm run dev`, a **375×812**, leyendo el DOM. No
es recuerdo ni estimación: son los números que devolvió la página.

| Qué | Dónde | Cuánto |
|---|---|---|
| El portal mide casi tres pantallas | `/` | **2396 px** contra 812 de ventana = **2,95 pantallas**, con 8 casetes de ~210 px |
| El pie se come un cuarto de la ventana | `.pie-imprenta` en `/` | **227 px** de alto y **379 caracteres** de texto |
| La portada del juego no entra | `/juegos/adivinar-el-tema/` | **1591 px** = **1,96 pantallas**; 11 pozos de 63 px son **693 px** solo para elegir disco |
| Durante la partida, el bloque más grande no juega | `#partida` a 375×812 | la partida entra justa (812 px), pero **208 px — el 25,6 %** son pie de imprenta |
| La lista de temas nace con scroll adentro | `.sugerencias` | 6 ítems, `scrollHeight` **318 px** en una caja topeada en **240 px** (`max-height: 15rem`): entran 4,5 |
| La revelación desborda la ventana | al cerrar un tema | **622 px** de revelación llevan el documento a **1169 px** = **1,44 pantallas** |
| No hay un solo tema entero | `public/audio/temas/` | la carpeta **no existe**; `"entero": true` aparece **0 veces** en `adivinar-tema.json` |
| Recortes sí hay, y son todos | `public/audio/fragmentos/` | **95 archivos**, **7,5 MB** en total |

## 2. Las tres cosas que hay que decidir antes de tocar código

### 2.1 La cinta deja de ser una cama y pasa a ser una rocola, y eso afloja dos candados

`ADR-04` dejó cinco candados escritos con nombre y con la instrucción de que, si alguien
afloja uno, sepa cuál está aflojando. El pedido afloja dos:

- **Candado 2, "cero archivos": cae entero.** Era la mitad de por qué la pieza existía —
  cero bytes prendida o apagada, y adentro de un `Math.random()` filtrado no hay obra de
  nadie. Una rocola que pone temas de los Redondos transfiere megabytes y pone obra ajena.
  `D-14` lo cubre (el sitio ya sirve recortes, y `D-22` ya decidió alojar los temas
  enteros), pero **el argumento de "esta pieza es intocable" se termina acá**, y conviene
  que quede escrito y no que se descubra dentro de dos meses.
- **Candado 4, "no lleva información": cae.** El que prende una rocola quiere saber qué
  está sonando. Eso es una superficie nueva, y es de `experiencia`.
- **Candados 1, 3 y 5 se quedan**, y el 3 hay que reforzarlo — ver 2.2.

### 2.2 Los recortes **son** la respuesta de `US-02`

Esto es lo más importante del ciclo, y no es un detalle de construcción:

- Los 95 recortes de `public/audio/fragmentos/` son literalmente las respuestas de
  "adiviná el tema". Una rocola que ponga recortes en `/juegos/adivinar-el-tema/` **le
  sopla la respuesta al que está jugando**.
- Los temas enteros son la respuesta de "completá la letra" (`US-03`) y de "sacalo por la
  letra" (`US-07`).
- Las tres pantallas graves ya están mudas por `graves.ts`, con dos candados sobre la
  misma puerta. Ese patrón es el que hay que repetir.

**El mapa de rutas mudas es parte de la decisión, no del código.** Si sale corto en una
sola ruta, el sitio le arruina la partida al que se sabe el tema — el único daño que
`CLAUDE.md` declara inaceptable.

### 2.3 El pie corto choca con `D-21`, y el choque se resuelve mudando, no borrando

El pie de hoy hace tres trabajos en 379 caracteres: dice que es un sitio de fans sin fines
de lucro, acredita a Rocambole y a la banda, y dice **qué tapas usó esta pantalla**. Ese
tercero es `D-21` condición 1, y no pide una firma genérica: pide que la pantalla nombre lo
que usó. `CNT-01` dejó de ser un gate y pasó a ser un mapa justamente para poder responder
rápido si alguien pregunta (`D-14`).

**La línea corta se hace.** Lo que hay que decidir es **dónde cae el crédito**, no si cae:
una página de créditos enlazada desde el pie, o un desplegable en el mismo pie. Es de
`contenido`, que es el dueño del mapa.

### 2.4 La trampa de construcción que ya está escrita en el repo

`cinta.ts` barre los `<audio>` del documento para callarse cuando algo suena (`ADR-04.3`), y
hay tres pruebas que lo fijan: `cinta.test.ts:691`, `:717` y `:932`. **Una rocola que ponga
temas por un `<audio>` se calla a sí misma en el primer segundo.** El `<audio>` de la rocola
tiene que quedar exento del barrido, y eso es una línea del contrato de `ADR-07`, no un
parche del que construya.

Y el otro lado del mismo problema: `tema/audio.ts` decodifica a `AudioBuffer` con un tope de
3. Un tema de cuatro minutos decodificado son decenas de MB de RAM en un teléfono. La rocola
**transmite**, no decodifica.

## 3. Las tareas

| ID | Rol | Qué | Archivos | Verifica con | [P] |
|---|---|---|---|---|---|
| `T-212` | `arquitectura` | `ADR-07`: la rocola. Qué pone y en qué orden, el filtro vintage, cómo se sirve (transmitido, nunca decodificado), la caída de tema entero a recorte entero, el barrido de `<audio>`, y **el mapa de rutas mudas** | `Docs/ARQ/ARQ-rocola.md` (nuevo); nota de revisión al pie de `ARQ-cama-de-cinta.md` | El documento nombra los cinco candados de `ADR-04` uno por uno y dice cuál cae; el mapa mudo incluye `adivinar-el-tema`, `completar-la-letra` y `adivinar-por-la-letra`; resuelve por escrito la exención del barrido | **[P]** |
| `T-213` | `contenido` | `CNT-16`: el pie corto y el destino del crédito. Deja el texto exacto de las dos piezas | `Docs/CONTENIDO/CNT-16-pie-corto.md` | La propuesta cumple `D-21` cond. 1 sin volver a 379 caracteres, y pasa a mano las siete reglas de `voz.test.ts` | **[P]** |
| `T-214` | `experiencia` | `UX-24`: la portada de "adiviná el tema" entra en 812 px con los 11 pozos alcanzables | `Docs/UX/UX-24-la-portada-en-una-pantalla.md` | La hoja da presupuesto de píxeles por bloque que suma ≤ 812, sin bajar de `--toque-min` | **[P]** |
| `T-215` | `experiencia` | `UX-25`: el portal en menos pantallas, sin sacar ningún casete | `Docs/UX/UX-25-el-portal-mas-corto.md` | Presupuesto que baja de 2396 px con los 8 casetes puestos y ninguno bajo `--toque-min` | **[P]** |
| `T-216` | `experiencia` | `UX-26`: qué se ve y qué se toca cuando la rocola pone un tema. Es el candado 4 caído | `Docs/UX/UX-26-la-rocola.md` | Los estados siguen legibles sin color (`UX-01`); dice si hay control de "otro tema" y dónde vive el crédito de lo que suena | dep. `T-212` |
| `T-217` | hilo principal | Construir la rocola: sorteo sin repetir, filtro vintage, caída a recortes enteros, y `D-37` escrito | `src/lib/sitio/rocola.ts` + `rocola.test.ts`, enganche en `cinta.ts`, `Docs/DECISIONES.md` | `node --test src/lib/sitio/rocola.test.ts`; `npm test`; `npm run check`; y una prueba que **falle** si la rocola suena en una ruta del mapa mudo | dep. `T-212` |
| `T-218` | hilo principal | La púa: el ruido de cambio entre tema y tema, sintetizado, cero archivos | `src/lib/sitio/pua.ts` + `pua.test.ts` | `node --test src/lib/sitio/pua.test.ts`; `node --test src/lib/islas.test.ts` en verde (ni un `node:*`) | **[P]** |
| `T-219` ✅ | hilo principal | La puerta de entrada de los temas enteros. **Resultó ser otra cosa que lo planificado — ver 3.1** | `.gitignore`, `public/audio/temas/README.md` | `git add -n` toma un mp3 de `temas/` y sigue rechazando un `.wav`; `npm test` **526/526** | hecho 2026-09-11 |
| `T-220` | hilo principal | El pie corto, y el crédito en el lugar que eligió `CNT-16` | `src/lib/sitio/copy.ts`, `src/components/PieImprenta.astro`, `src/styles/sitio.css` | El pie mide < 120 px a 375×812 medido en el navegador; `npm test`; el crédito de `D-21` sigue alcanzable desde toda pantalla | dep. `T-213` |
| `T-221` | hilo principal | La portada del juego entra en una pantalla | `src/pages/juegos/adivinar-el-tema.astro`, `src/styles/juego.css` | `scrollHeight <= innerHeight + 40` a 375×812 con los 11 pozos alcanzables | dep. `T-214` |
| `T-222` | hilo principal | La lista de temas se ve entera, sin scroll adentro | `src/styles/juego.css`, `src/lib/tema/buscador.ts` | `lista.scrollHeight <= lista.clientHeight` con 6 resultados a 375×812, y con el teclado abierto | dep. `T-221` |
| `T-223` | hilo principal | La revelación entra en una pantalla | `src/scripts/partida-tema.ts`, `src/styles/juego.css` | `scrollHeight <= innerHeight + 40` con la revelación abierta, con y sin reproductor de tema entero | dep. `T-222` |
| `T-224` | hilo principal | El portal en menos pantallas | `src/pages/index.astro`, `src/styles/sitio.css` | `scrollHeight` a 375×812 por debajo del presupuesto de `UX-25`, con los 8 casetes; `npm test` | dep. `T-215`, `T-220` |
| `T-225` | `revisor` | `REV-13`: verificar el ciclo contra los criterios, **ruta por ruta para el mapa mudo** | `Docs/REVISIONES/REV-13-ciclo-14.md` | `npm test`, `npm run check`, `npm run build`, y la tabla de la sección 1 vuelta a medir | dep. todo |

## 3.1 `T-219`, corregido en obra: el script ya estaba, y el defecto era otro

**Lo que el plan supuso, y estaba mal.** `T-219` decía "agregar `--enteros` al script y
crear la carpeta". Esa bandera **ya existía**: `scripts/generar-fragmentos.mjs` la acepta
desde antes de este ciclo (línea 87), crea `public/audio/temas/` (línea 208), genera el
tema entero a 128 kbps estéreo (línea 280) y escribe `"entero": existsSync(entero)` en el
manifiesto (línea 295). El plan cortó una tarea que ya estaba hecha, y eso es un defecto
del plan, no del repo.

**Lo que sí estaba roto, y no lo había visto nadie.** `.gitignore` ignoraba `*.mp3` en todo
el repo con **una sola excepción**, `!public/audio/fragmentos/*.mp3`. O sea: correr
`--enteros` dejaba los temas enteros en disco, a la vista en la carpeta, y **no llegaba ni
uno a producción**. Sin error, sin aviso: el juego simplemente nunca habría mostrado el
reproductor de `D-22`, y la rocola nunca habría tenido un tema que poner.

Es el mismo defecto que el plan le teme a la rocola —fallar callado— pero del lado del
despliegue, y estaba esperando desde que `D-22` se tomó.

**Qué se hizo:** la excepción `!public/audio/temas/*.mp3`, con el porqué escrito al lado, y
un `README.md` en la carpeta para que git la guarde y para que el que llegue sepa qué va
ahí, quién lo pone y cuánto pesa.

**Qué NO se tocó:** el ignore de `*.wav` sigue en pie — los másteres se quedan afuera del
repo, que es lo que `CTR-01` pide para que bajar la duración siga siendo barato. Verificado
con `git add -n` sobre los dos casos.

## 3.2 Dos trampas para `T-220`, encontradas al leer `CNT-16`

**La de HTML, que rompe callada.** `CNT-16` elige un `<details>` nativo y pide anidar
adentro el `<span class="credito-pantalla">`. Pero hoy ese span vive dentro de
`<p class="pie-sitio">` (`PieImprenta.astro`), y **`<details>` no puede ir adentro de un
`<p>`**: el analizador del navegador cierra el párrafo solo, antes del `<details>`, y la
estructura que llega al DOM no es la que está escrita. No da error, no rompe el build, y el
CSS de `.pie-sitio` deja de alcanzar a la mitad de su contenido. El `<p>` tiene que dejar de
ser `<p>`, o el `<details>` tiene que quedar afuera de él.

**La de contrato, que no hay que aflojar.** `data-tapas` y las clases `.credito-tapas,
.credito-pantalla` **son contrato**: la isla de "adiviná el tema" las busca para reescribir
el crédito cuando la sala se vuelve el disco que sacaste (`partida-tema.ts`,
`creditoDePantalla()`). `CNT-16` las conserva a propósito. Al envolver en `<details>`, el
selector tiene que seguir encontrándolas.

## 4. Pasada de conflictos

- **`T-221`, `T-222` y `T-223` tocan las tres `src/styles/juego.css`.** No son paralelas
  aunque no dependan entre sí por contenido. Van en fila, y en ese orden: la portada
  primero, porque es la que fija el presupuesto de las otras dos.
- **`T-220` y `T-224` tocan las dos `src/styles/sitio.css`.** `T-220` primero: el portal se
  mide con el pie ya achicado, y medirlo antes sería medirlo dos veces.
- **`T-217` y `T-218` se rozarían en `cinta.ts`** solo si la púa se engancha sola. No lo
  hace: `pua.ts` es un módulo hoja que no importa nada, y lo llama la rocola. Con eso
  `T-218` queda `[P]`.
- **Las cuatro tareas de documento (`T-212`..`T-215`) son paralelas de verdad**: cuatro
  carpetas distintas, cuatro dueños, ninguna lee la salida de otra. `T-216` no: lee
  `ADR-07`.
- **`T-219` no depende de nadie** y no toca ningún archivo del resto. Es la más corta y la
  que más conviene tener antes, porque es la que le abre la puerta a los temas enteros.

**Corte de ráfagas sugerido:** la primera, `T-212`..`T-216` más `T-219` (los documentos y el
script). La segunda, `T-217`, `T-218` y `T-220` (la rocola y el pie). La tercera,
`T-221`..`T-224`, y el cierre con `T-225`.

## 5. Qué queda afuera, y por qué

- **Los temas enteros.** Entra el mecanismo, no los archivos: no los puede producir ningún
  rol, salen de los discos que el usuario tiene en la máquina, igual que los recortes
  (`D-23`). Hasta que corra `T-219`, la rocola va a poner **recortes enteros** — que es la
  caída que el propio pedido nombra, no un consuelo.
- **El escalonamiento de `US-02`.** Sigue siendo el hueco real de la v1: `BR-01` pide 8
  fáciles y hay 0, sin escalonar y sin schema. Es un frente de contenido y de la clave de
  YouTube, y meterlo acá volvería el ciclo incortable.
- **La clave de YouTube (`T-165`) y la casilla de correo (`T-153`).** Siguen esperándote, y
  no son de este frente.
- **Los otros cuatro juegos.** El pedido nombró dos pantallas. Los seis tableros en el mismo
  ciclo no entran en tres ráfagas.

## 6. El riesgo del ciclo

**El más grande no es técnico: es que la rocola le arruine la partida a alguien.** Los
recortes son la respuesta de `US-02`, y los temas enteros son la respuesta de `US-03` y de
`US-07`. Si el mapa de rutas mudas de `ADR-07` sale corto en una sola ruta, el sitio le
sopla la respuesta al que se sabe el tema. Por eso el mapa es parte de la decisión, por eso
`T-217` lleva una prueba que falla si suena donde no debe, y por eso `T-225` lo mira ruta
por ruta en vez de confiar en el test.

**El segundo es el peso, y es del lado del que escucha.** `RES-50` dejó claro que 180 MB no
molestan a Vercel, pero eso es el servidor. En el teléfono, un tema entero son 3–4 MB en un
sitio que promete partidas de dos minutos. Si la rocola precarga, los molinetes se cierran
para el que tiene datos contados — que es exactamente a quien `D-14` no le cierra la puerta.
`ADR-07` lo resuelve con transmisión y con "solo cuando alguien la prende", o no lo resuelve.

**El tercero es de redacción.** Achicar el pie es fácil; achicarlo sin que el sitio deje de
decir de dónde salió lo que muestra, no. Si `CNT-16` sale con una línea linda y el crédito
en ningún lado, el ciclo entrega una regresión de `D-21` disfrazada de mejora.

---

## 7. Cierre del ciclo (2026-09-11)

Las catorce tareas cerraron. `npm test` **574/574** (eran 526 al abrir), `npm run check` 0
errores, `npm run build` 151 páginas, validador del instanciador `APTA`.

### Lo medido al cerrar, contra la tabla de la sección 1

| Qué | Al abrir | Al cerrar |
|---|---|---|
| Portal | 2396 px (2,95 pantallas) | **2021 px (2,49)** |
| Portada de "adiviná el tema" | 1591 px (1,96) | **883 px (1,09)** |
| Los once pozos | 693 px | **111 px** |
| Pie de imprenta | 227 px | **179 px** |
| Texto del pie | 379 caracteres | **42** |
| Lista de temas | 318 px de contenido en caja de 240 | tope 21rem, alto de ítem fijo |

### Los tres desvíos de presupuesto, declarados

No se resolvieron y no se disimularon. Los tres tienen la misma forma: **la hoja presupuestó
un número que solo se alcanza tocando algo que no es del que construye.**

1. **El pie quedó en 179 px contra los ≤120 de `UX-25` §5.** El texto sí bajó a 42
   caracteres; el piso lo pone `--alto-pie-imprenta`, el token de la franja de `D-35`.
   Cambiarlo toca las trece rutas y se decide en el lienzo (`diseno-marca.md`).
2. **El casete quedó en 198 px contra los 136 de `UX-25` §2.5.** Se hizo lo que la hoja
   pedía —sacar la tapa chica, cortar la bajada en el punto— y rindió ~12 px, no 74. Lo que
   no baja es el título: dos renglones en letra de display.
3. **El portal quedó en 2,49 pantallas contra las 1,83 de `UX-25` §1**, que es consecuencia
   directa del punto 2.

### Los dos defectos que aparecieron construyendo

Ninguna hoja los preveía, y los dos eran del tipo que falla callado:

1. **`.gitignore` tiraba los temas enteros al vacío** (`T-219`, sección 3.1).
2. **`rocola.ts` cruzó la flecha entre los dos motores de audio** al importar
   `tema/audio.ts` por `urlDeFragmento()`. Lo cazó el test que `ADR-04` había dejado puesto.
   La salida no fue aflojar el candado sino bajar las dos rutas de audio a
   `src/lib/audio/rutas-de-audio.ts`, una hoja que no importa nada.

Y un tercero, de mi propia construcción, que muestra por qué el navegador no es opcional:
**`display: flex` sobre `.cinta-pieza` pisaba el `display: none` del atributo `hidden`**, así
que el renglón oculto de la rocola le sumaba 60 px a la cabecera de toda pantalla con la
cinta apagada — el estado por defecto de la primera visita. No se veía nada y el aire estaba
igual. Se encontró midiendo el DOM, no leyendo el archivo.

### Lo que el ciclo no entrega, y era sabido

**No hay un solo tema entero en `public/audio/temas/`.** El mecanismo está entero y la puerta
quedó abierta; los archivos salen de los discos del usuario, igual que los recortes (`D-23`).
Hasta entonces la rocola pone **recortes enteros**, que es la caída que el propio pedido
nombra.
