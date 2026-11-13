---
paths:
  - "src/lib/bestiario/**"
  - "src/scripts/bestiario/**"
  - "src/scripts/camino.ts"
  - "src/scripts/bestiario.ts"
  - "src/pages/redondopedia/bestiario*"
  - "src/pages/redondopedia/bestiario/**"
  - "src/components/bestiario/**"
  - "src/styles/camino.css"
  - "src/data/bestiario*.json"
  - "scripts/imprimir-bestiario.mjs"
  - "public/bestiario/**"
---

# La escena manda: cómo se construye un ambiente del bestiario

> **Quien arme, dibuje, anime, revise o encargue algo del bestiario lee esta regla antes de
> empezar**, hilo principal y subagentes por igual. Se carga sola al tocar los archivos de arriba;
> si encargás trabajo del bestiario a un agente, nombrásela en el encargo.

Esta regla la escribe el hilo principal a pedido del usuario, textual (2026-11-13): *"quiero que
guardemos las mejores cosas de estas pasadas para usarlas como reglas, es decir seguir construyendo
con esta calidad"*. Sale de las ocho rondas de `D-90` (`T-527`): cada ronda la construyó un agente y
la auditó otro mirando capturas, y casi todo lo de acá salió de algo que se veía mal en una captura.
Las lecciones son de las dos miradas: la del hilo principal, que auditaba, y la de Fable, que
construía y las escribió al cerrar la octava ronda.

Obliga a **todo el que toque una escena, un títere, una capa de aire o una luz del bestiario**. Es la
hermana de `diseno-marca.md` (cómo se ve el sitio) y de `voz-ricotera.md` (cómo suena), y no relaja
ninguna de las dos: cero sombras, tokens solo en `tokens.css`, el velo plano y la máscara cruzada con
textura siguen siendo ley.

---

## 1. Lo soplado se imprime; el teléfono solo mueve

- Niebla, luz, filo, piso: todo lo que tiene desenfoque o grano se dibuja en `arte-*.ts` y lo imprime
  `scripts/imprimir-bestiario.mjs` una sola vez. En vivo, solo `transform` y `opacity`, en el mismo
  reloj de la isla, sin un segundo `requestAnimationFrame`.
- Nunca una animación de CSS adentro del SVG del piso: obliga a repintarlo entero en cada cuadro. Así
  estuvo Cybersiberia a 12 cuadros por segundo hasta la ronda 3; mudar la nevada a una capa la llevó
  a 54.
- **El filtro de grano recorta al rectángulo de lo que no está soplado**: sin una hoja transparente
  de fondo en la pieza, la niebla sale con bordes de caja. Las baldosas que se repiten llevan sangría
  (`Pieza.sangria`) y copias idénticas en los bordes para cerrar sin costura.
- Cada región con **la mano de su tapa**: aerógrafo donde la tapa es aerógrafo; crayón, gubia o tinta
  plana donde la tapa es eso. Una niebla soplada sobre un grabado es un pegote.

## 2. El aire: entre las capas, nunca encima de todo

- Tres planos (`fondo`, `medio`, `cerca`), con un **tope de tres capas por región** y un peso medido.
- **La niebla va en jirones**: canto rasgado, alturas que varían, huecos por donde asoma el piso.
  Ninguna banda cruza la pantalla entera a la misma altura (ronda 1: se leían como estantes) y ningún
  jirón es más ancho que un teléfono.
- **El tope del quinto**: nada de `frente` ni de `cerca` ocupa más del 20 % del alto visible. Lo mide
  `aire.test.ts` sobre la imagen impresa. Las dos "losas negras" del monte eran tiras de adelante que
  tapaban un tercio de la pantalla. Una excepción se escribe en el test con su porqué, como la bengala
  del galpón.
- El aire **se abre al caminar** y se cierra despacio cuando quien mira se queda quieto.

## 3. Componer con peso, no salpicar

- El piso no es liso, pero tampoco es una alfombra de figuritas. Se agrupa en una o dos composiciones
  con peso (un claro con un charco grande, una raíz que lo cruza) en vez de repartir objetos parejos.
- **Lo que está en el piso apoya**: mancha húmeda donde toca, la base un poco enterrada, más apagado
  cuanto más lejos, en escorzo. Es dibujo impreso, no `box-shadow`. Sin eso flotan como calcomanías
  (ronda 3).
- **Los reflejos se rompen**: manchas acostadas, más oscuras, más cortas, cortadas por el canto del
  charco. Una fila de triángulos iguales se lee como una guirnalda de banderines (ronda 4).
- Un primer plano vacío en vertical es el defecto más fácil de no ver en la compu y el más grande en
  el teléfono. Se mira primero a 430×860.

## 4. Nada fijo le cruza la cara a un bicho

- Barrotes, focos, velas, haces: ninguna pieza fija cae sobre la cara de un títere en su posición de
  reposo (el barrote sobre Drácula, ronda 3; las velas sobre las patas del Morta y de Saturno, ronda 6).
- **Una baldosa que se repite no sabe quién está parado.** Lo que va sobre el piso de un recinto se
  imprime del ancho de la escena, en huecos sacados de los datos (`ofrendas.ts`), y nunca en el cruce,
  debajo de los carteles.
- La posición de los bichos se lee de los datos de la escena, no de números medidos a mano: si un
  bicho se corre, el test se tiene que enterar.

## 5. El misterio premia al que se queda

- **Lo que aparece si te quedás quieto**: ojos que se abren a los cinco o seis segundos, parpadean y
  se apagan si los mirás (con el dedo, el mouse, la lupa o una ficha abierta), y después vuelven en
  otro lugar. Nunca abren ficha. Con movimiento reducido no están.
- **Lo que cruza lejos es raro**: de a uno, cada 14 a 40 segundos. Si se ve siempre, deja de ser
  misterio y pasa a ser decorado.
- Es sistema por región (`ACECHOS`, `VIDAS`, `LUCES` en `aire.ts`), no un caso suelto en un controlador.

## 6. La luz toca

- Una luz por región, impresa, que se mueve: el cono que se hamaca y titila, la brasa que late en dos
  golpes y una pausa, el reflector que barre.
- Su borde va cortado a mano y con la máscara cruzada con textura. Un haz de borde liso es un
  degradado con otro nombre (el templo, ronda 6).
- Cuando la luz le pasa por encima a un títere, le prende **su propio contorno** impreso
  (`filo-de-*.webp`), en una tinta que contraste con él. Una medialuna genérica no se ve, y blanco
  sobre un grabado blanco tampoco (la prisión pasó al rojo de las banderas). **La tinta del canto se
  elige contra el títere, no contra la luz**: un filo que marca 0,9 de opacidad puede no verse.
- Lo que la luz mide para saber si le pega a un bicho se mide **al medio del cuerpo**, no a la
  coronilla, y sin dejar afuera a los altos: Drácula no se prendió nunca hasta arreglar las dos cosas.
- Un títere chico (el botija mide 46 unidades) no se ilumina con un canto: se lo pone donde la luz
  le dé de lleno, o la luz se lo dice de otra manera.
- **Con movimiento reducido, ninguna luz queda como un paño claro de borde duro**: se apaga o queda a
  media fuerza con el borde roto.

## 7. Los títeres tienen peso

- Respiran despacio al llenarse y más rápido al vaciarse. Lo que cuelga (cola, pelo, llama, cadena)
  llega después que el cuerpo.
- Saben dónde está el dedo o el mouse: giran la cabeza, entornan los ojos, ladean el medallón. Es
  `scripts/bestiario/mirada.ts`; un títere nuevo se suma ahí.
- Una animación se juzga en **una tira de seis cuadros**, no en una captura quieta.

## 8. Rendimiento: medir con control y no culpar a ciegas

- **Lo que no se ve no se mueve**, y eso incluye a los títeres grandes de `recintos.ts`.
- El modo liviano automático apaga primero `fondo` y después la luz. Se fuerza con `?liviano=1` o
  `?liviano=2` para poder mirarlo: lo que no se puede forzar no se puede revisar.
- **Cada capa de pantalla entera que se mueve cuesta de 2 a 5 ms** con la CPU ×4, y fundir dos en una
  casi no ahorra. Una por región; la segunda se paga, y hay que poder decir por qué vale.
- **Cada medición lleva un control en la misma tanda** (el monte, sin tocar). El mismo día, sin
  tocarlo, el monte dio 9,9, 16 y 24 ms: un número sin control no se compara con otro, y una condición
  se evalúa en proporción al control.
- Antes de arreglar, se aísla: se esconden las capas nuevas y se vuelve a sacar la captura. Así se
  descubrió que la "lluvia" de los techos era el crayón previo del telón, que la losa era `frente` y no
  `cerca`, y que el halo del camello venía de `canto()`. Se dice de quién era el defecto.

## 9. La lupa y el toque conviven con caminar

- Con la lupa en `z`, la tira mide `z` veces su ancho y el scroll nativo no se entera (`D-77` intacto).
- El doble toque se cuenta con el reloj del `pointerdown`, con 520 ms y 44 px de margen; con menos
  falla con la máquina cargada. Se traga solo el segundo toque, así el toque que abre la ficha
  (`T-522`) no cambia.
- Con la lupa, lo pegado a la cámara se desvanece para no tapar lo que se está mirando.

## 10. Cómo se verifica una escena

- `npm test`, `npm run check`, `npm run build`, y además **se mira**: build y vista previa (en dev el
  bestiario se cuelga), capturas a 430×860 y 1280×800, con y sin movimiento reducido. Si la ventana no
  está a la vista, `requestAnimationFrame` se reemplaza por un `setTimeout` de 16 ms antes de medir.
- **Antes y después en la misma posición**: lo que no se compara en el mismo cuadro no se puede juzgar.
- **Toda pasada se mira también a 1280×800**: las velas que pisaban al Morta no existían en el
  teléfono, porque ese tramo no entraba en pantalla. Y con movimiento reducido cada luz se mira quieta:
  lo que barriendo es un haz, clavado es un paño.
- Una vez por tanda, **una recorrida como de alguien nuevo**: el plano, una región entera, dos fichas,
  la lupa, la vuelta.
- Los servidores se apagan, y los perfiles temporales del navegador se borran al terminar.

## 11. Cómo se cuenta lo hecho

- Se separa **lo visto** de **lo escrito**: "se prende (medido a 0,6) pero se ve poco" vale más que
  "toca a los bichos". `ESTADO.md` no dice nada que no se haya visto, y si un test cambió a propósito,
  lo dice.
- Un test que protege algo que se quiere cambiar se cambia con criterio y se cuenta; no se borra para
  que pase.

## 12. Cómo se trabaja una mejora grande

- **En rondas**, cada una auditada por alguien que no la construyó, mirando capturas. Primero los
  arreglos de lo que se vio mal, después lo nuevo.
- Quien construye cierra cada ronda con su propio top 5 para la siguiente. Quien audita lo cruza con
  lo que vio y decide el orden. Las dos miradas valen: la mitad de lo mejor de `D-90` salió de la lista
  del que construía.
- Una ronda prioriza profundidad sobre amplitud: el sistema bien hecho en tres regiones, y después se
  extiende.

## 13. El diseño de las bestias

**Pendiente.** El usuario pidió sumar acá cómo se diseña una bestia en general: el títere, sus
piezas, su rig, su gesto al tocarlo y su ficha. Hasta que se escriba, mandan `D-73` y sus vueltas, y
lo que ya dicen las secciones 4, 6 y 7 de esta regla. Lo que se aprenda al diseñar la próxima tanda
de bestias entra en esta sección, con el caso que lo enseñó.

---

Si algo de esta regla te queda chico, propuesta en `Docs/SUGERENCIAS/`, como siempre. El detalle y
los números de cada ronda están en `D-90` y sus enmiendas.
