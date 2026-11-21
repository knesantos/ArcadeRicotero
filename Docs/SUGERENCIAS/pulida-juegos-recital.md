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
