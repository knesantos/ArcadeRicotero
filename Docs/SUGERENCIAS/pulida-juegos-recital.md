# Pulida de los juegos: "Armá tu recital" (`D-72`)

> Propuesta del constructor de la ronda, para que el hilo principal la convierta en decisión
> (`D-XX`) o la corrija. No toca `ESTADO.md`, `Docs/DECISIONES.md` ni la carpeta de ningún rol.

## Ronda 1 (2026-11-21): la hoja, la entrada y el casete

### 1. Los objetos

La acotación de la portada ya lo nombraba: *"Tenés cinta y una lista en blanco."* El juego tiene
tres objetos, y cada pantalla es uno:

- **La hoja**: papel pegado con dos tiras de cinta cruzadas en las esquinas, escrito con fibrón.
  Está en la portada (en blanco, con el mecanismo escrito renglón por renglón), en el armado y en
  la noche. **Se escribe**: la tinta aparece de izquierda a derecha en cinco trazos y el fibrón
  —el cuerpo en la tinta del papel, el capuchón en el rojo del juego— va adelante.
- **La entrada**: papel con el nombre en el cuerpo y la ciudad en el talón, después de la línea
  de puntos. Las ciudades con más de un lugar son un **talonario** (la ciudad una sola vez, arriba,
  y sus entradas en columnas). La que se elige **viaja** a la cabecera del armado y queda ahí.
- **El casete**: el de "Adiviná el tema" (`lib/tema/casete.ts`), sin tocarlo. Chico en el pie del
  armado y grande en la cabina de la noche. Gira solo mientras suena, la cinta pasa de un carrete
  al otro y frena con inercia.

### 2. Qué cambió, pantalla por pantalla

1. **Portada.** El párrafo largo salió de la vista (queda para el lector de pantalla y para la
   descripción de la página). Lo reemplaza la hoja: «1 Elegí dónde tocan · 2 Poné los temas en
   orden · 3 Guardá algunos para los bises», el corte de los bises, «Suena un pedazo de cada uno»
   y el sello «No hay lista correcta». Es atajo del botón. **Con una lista a medio armar, la hoja
   es esa lista**: el lugar arriba, los cuatro primeros temas y «y N más».
2. **Dónde tocan.** Las cuatro pestañas en un renglón (dos y dos por debajo de 368 px). Los
   estadios: de 20 cajas iguales a tres talonarios y diez entradas sueltas en dos columnas. La
   pantalla de estadios mide 1362 px con el pie del sitio (la de base, unos 2100); la de teatros, 1050.
3. **El armado.**
   - La cabecera es la entrada elegida («ESTA NOCHE», el lugar y el talón con la ciudad).
   - El tema recién sumado **se escribe** en la hoja. Lo que suena ya no rehace la hoja: solo
     cambia el subrayado y el texto de «Escuchala».
   - **El pie mide siempre lo mismo**: casete, lo que suena (o «Tocá un tema: se suma y suena»),
     «Pará» (guarda su lugar aunque no se vea) y la cuenta de ruedas. Antes el renglón de lo que
     suena aparecía y desaparecía, y «SALÍ A TOCAR» se corría debajo del pulgar.
   - Con el cajón en pantalla (la hoja queda arriba), un **papelito** con el título vuela del tema
     tocado a la cuenta, y ahí gira la rueda. El tema tocado se sella «EN LA LISTA».
   - **Se rehace solo lo que cambió**: de los ciento cinco del cajón, el tocado. Se rehacen todos
     solo cuando la lista se llena.
   - Los bises son **el corte**: una raya de fibra de puntos con la palabra en el medio.
4. **La noche.** Cierre en dos tiempos: la lista se escribe sola, un renglón atrás del otro, y
   cuando termina entra el pie (`.pie-resultado`: la hoja que asoma, «Compartí», lo que compartir
   diga y «Armá otra»). Un toque lo adelanta. También pasa al abrir una lista que te pasaron.
   Arriba, la cabina: el casete y «ESCUCHÁ LA LISTA». Las salidas van chicas al final.
5. **La hoja que se comparte** (`lamina.ts`, bandera nueva `hoja`): la misma planta, pintada como
   hoja de papel torcida con cinta en las cuatro esquinas, tinta sobre papel y la raya de puntos
   entre la lista y los bises. "Ponelos en fila" no la pide y sale como antes.

### 3. Detalles vivos (para el registro)

| Detalle | Estado | Cómo | Con movimiento reducido |
|---|---|---|---|
| El renglón se escribe con el fibrón adelante | tema sumado, lista cerrada, portada | `renglon-se-escribe`, `fibron-escribe` | escrito de entrada; sin fibrón |
| El casete gira y la cinta pasa | suena un recorte o la lista | `correrCasete`, `ponerAvance` con un reloj de 200 ms | quieto; lo dice el sello SUENA o «Suena el N de M» |
| El papelito vuela a la cuenta y la rueda gira | tema sumado con la hoja fuera de vista | `volarPieza`, `rodarContador`, `estampar` | la rueda aparece puesta |
| La entrada viaja a la cabecera | lugar elegido | `volarPieza`, `pegar` | aparece puesta |
| El sello de la hoja cae | portada escrita | `sello-hoja-cae` | apoyado |
| El pie de la noche espera a la lista | lista cerrada | `noche-pie-llega` | a la vista de entrada |

### 4. Tokens, tests y copy

- **Ningún token nuevo.** Todo sale de `--duracion-umbral`, `--duracion-paso`,
  `--duracion-pasada` y `--curva-cinta`.
- **Tests cambiados a propósito:** `movimiento.test.ts` suma cuatro animaciones a `ANIMACIONES`
  (por token); `estilos.test.ts` suma dos estados a la isla (`.recital-pie--suena`,
  `.recital-noche--escribe`). Ninguno se relajó. El total no cambia: 2511.
- **Copy nuevo** (`recital/copy.ts`, para el visto de `contenido`): `PANTALLA_0.pasos`, `pasoBis`,
  `sello`, `yMas`; `LUGAR.entrada` («Esta noche»), `entradaAria`, `cuantos`; `ARMADO.pieQuieto`,
  `temas`.
- **`mirar-juego.mjs`**: recorrido `arma-tu-recital` (portada, las cuatro pestañas, la entrada
  que viaja, el renglón que se escribe, el casete, el papelito, mover, bises, buscar, el cierre,
  la noche sonando, la tarjeta, la lista ajena y la portada con lista guardada) y `--peor` (el
  lugar de nombre más largo y los veinticinco títulos más largos, con los bises llenos).

### 5. Lo que pide una decisión de otro

- **El párrafo de la portada ya no se ve.** El mecanismo lo dice la hoja. Si `contenido` quiere
  otra redacción de los tres pasos, es su copy.
- **Ruidos de interfaz: no hay.** Cada toque ya hace sonar un recorte, y la rocola es un
  `<audio>` que no despierta el audio de `efectos.ts`. Un trazo de fibrón al escribir quedaría
  bien; pisa el recorte, como pasó con el cartón de "Ponelos en fila".
- **`D-72` y `UX-`** describen la pantalla de antes (la lista de entradas, el pie de dos renglones).

### 6. Lo medido

- **Diez tamaños con el peor caso** (320 × 568 a 1440 × 900; el lugar de nombre más largo y los
  28 títulos más largos, con los bises llenos; sitio construido): nada desborda de costado y nada
  tocable baja de 48 px en la boletería, el armado ni la noche. El pie del armado mide 133 px en
  todos, y «SALÍ A TOCAR» termina 8 px arriba del borde de la ventana.
- **Rendimiento** (CPU ×4, 430 × 860 a ×2, sitio construido, dos tandas; controles quietos y con
  el casete girando: 16,7–17,0 ms, ningún cuadro sobre 34). Peor cuadro: «Elegí dónde» 67–100;
  elegir el lugar (la entrada viaja y se arma el cajón de 105) 184–200; sumar con la hoja a la
  vista 133; sumar desde el cajón 83–133; sumar el 15 con 14 puestos 117; «SALÍ A TOCAR» con 15
  temas 183–200 (antes de atrasar el dibujo de la hoja que se comparte, 333); «ESCUCHÁ LA LISTA»
  50–100. **No se midió la pantalla de antes de la ronda**: no hay número de base contra el cual
  comparar.
- **Control de "Ponelos en fila"** (comparte `lamina.ts`): su lámina sale con la batea, como antes.

### 7. Lo aprendido

1. **Si el juego es escribir una lista, la animación es escribirla**, y el útil va a la vista.
   Un recorte que avanza (`clip-path`) con el fibrón adelante se lee en una tira; un fundido no.
2. **Varias manos escribiendo a la vez no es una mano**: en la noche los renglones van de a uno,
   y el paso se apura con un número sin unidad (`--ritmo`) cuando la lista es larga.
3. **Una animación con demora y relleno hacia atrás muestra su primer cuadro desde el
   principio**: el sello esperaba en el aire, enorme. `visibility: hidden` en el `from` lo esconde
   hasta su turno sin fundido.
4. **Las cintas torcidas en `::before`/`::after` desbordan la página de a un píxel** y ningún
   elemento lo acusa: se ve en `scrollWidth`, no en las cajas. `overflow-x: clip` en el juego.
5. **`volarPieza` acepta un rectángulo guardado**: se mide el origen antes de cambiar de
   pantalla y se le pasa un objeto con `getBoundingClientRect`.

---

## Ronda 2 (2026-11-21): la hoja siempre a la vista, las fundas y el troquel

### 1. Lo que marcó el hilo principal, y qué era

1. **El pie tapaba y dejaba asomar cosas.** Su piso medía lo que la columna, y lo que pasaba por
   abajo (la tira de tapas, que salía de los márgenes) asomaba por los costados. Ahora el piso
   llega hasta los márgenes de la página con la raya arriba, y la tira de tapas ya no existe.
2. **La ciudad en cajita punteada se leía como campo vacío.** Ahora es el troquel: una línea de
   puntos **entre** la entrada y el talón, con dos muescas que le muerden el borde al papel. La
   ciudad va en la misma fibra que el nombre, más chica, y no en gris.
3. **"Estadio Marcelo Bielsa" en beige oscuro era el `:hover`**, que en el teléfono queda pegado
   a lo último que se tocó (ahí cayó el toque de «Elegí dónde»). No era ningún estado. El papel
   ya no cambia: con puntero, un contorno de tinta; con teclado, el contorno más grueso.
4. **El armado medía ~8000 px.** Con el cajón cerrado mide lo que diez fundas (ver lo medido).
5. **Las pestañas** van en un renglón a 430, cada una del ancho de su leyenda. Por debajo de
   420 px, dos y dos.

### 2. Qué se hizo

1. **El cajón son diez fundas.** Cada disco es una funda con su tapa, el año, cuántos temas trae
   y cuántos ya están en la lista. Se abre una por vez. Con algo escrito en el buscador no hay
   fundas: van los temas que lo dicen, de todos los discos. «Sorteá uno» sortea de la funda
   abierta, o de los ciento cinco si están todas cerradas.
2. **La hoja se pliega y queda pegada arriba.** Plegada (como arranca) deja ver los dos últimos
   de la lista, el corte y cuántos bises hay, y no se va de la pantalla mientras se elige: **el
   tema que se suma se escribe siempre a la vista**. «Mirá los otros N» la abre entera; marcar
   un renglón también. «Plegala» la vuelve a cerrar. En un teléfono bajo deja ver uno solo.
3. **Mover es mover.** Al subir, bajar o mandar al bis, cada renglón se corre de donde estaba a
   donde quedó (se mide antes y después y se anima la diferencia; solo `transform`).
4. **Sacar es tachar.** La fibra cruza el título (el trazo de "Sacalo por la letra"), el tema
   sale y los de abajo suben.
5. **La hoja que se comparte tiene planta propia** (`lib/recital/hoja.ts`, con tests, y
   `scripts/hoja-recital.ts`): el título en la letra de la banda, el lugar, los temas numerados en
   fibra mayúscula, todos con la misma letra, el corte con la palabra adentro y los bises
   enseguida. La letra crece con una lista corta y la hoja se alarga con una larga. `lamina.ts`
   volvió a ser solo de "Ponelos en fila" (la bandera `hoja` de la ronda 1 salió; quedan
   exportados `tinta` y `granular`, que la hoja nueva usa).
6. **Ruidos**, detrás del interruptor de siempre («Apagá los ruidos», en la portada): el roce de
   cartón al cortar la entrada, el trazo al escribir un renglón y al tachar, y el sello al salir
   a tocar. Son efectos que ya existían (`carton`, `racleta`, `sello`); no hay ninguno nuevo.
7. **Chicos:** el talonario va siempre de a dos y la entrada que queda sola ocupa el renglón.

### 3. Tests y copy

- Tests nuevos: `lib/recital/hoja.test.ts` (5). `estilos.test.ts` suma cuatro estados a la isla
  y el censo de `hoja-recital.ts`. Ninguno relajado.
- Copy nuevo: `PANTALLA_0.ruidosApagar`, `ruidosPrender`; `ARMADO.funda`, `enLaLista`,
  `desplegar`, `plegar`. Salieron `ARMADO.todos`, `discoElegido` y `losCiento`.

### 4. Lo medido (sitio construido)

- **El armado**: 1525 px con el cajón cerrado a 430 × 860 (ronda 1: 7971) y 2263 con una funda
  abierta. Eligiendo, con la hoja plegada y pegada: hoja 186 px, pie 133, y 541 libres para el cajón.
- **Diez tamaños con el peor caso** (28 temas, el lugar más largo): nada desborda y nada tocable
  baja de 48 px. Plegada, la hoja mide 189 px (106 en los dos teléfonos más bajos, donde deja
  ver un renglón), y entre la hoja y el pie quedan de 330 px (320 × 568) a 702.
- **Rendimiento** (CPU ×4, 430 × 860 a ×2, dos tandas, controles 16,7). Peor cuadro: abrir una
  funda 33; sumar 117; sumar el 14 con la hoja plegada 50–67 (ronda 1, con la hoja entera:
  117–133); «Subila» 67; «Sacala» 83; «Elegí dónde» 100–167; elegir el lugar 133–167 (ronda 1:
  184–200, armaba los ciento cinco); «SALÍ A TOCAR» con 14 temas 217–267.
- **Control de "Ponelos en fila"**: su lámina sale igual que antes.

### 5. Lo que queda abierto

- **Al subir o bajar, el renglón que cede el lugar cruza por encima de las teclas del marcado**;
  y al sacar, el aviso de «Sin bises» sobresale un cuadro por abajo de la hoja, que ya se achicó.
- **El trazo del fibrón suena encima del recorte que arranca en el mismo toque**, como pasó con
  el cartón de "Ponelos en fila". Sin oír: el navegador de las capturas va mudo.
- **El papelito que vuela a la cuenta casi no se ve más**: con la hoja pegada arriba, el
  renglón nuevo siempre está a la vista y se escribe ahí. Queda para la hoja abierta y corrida.
- `D-72` y los `UX-` del juego describen la pantalla de antes.
