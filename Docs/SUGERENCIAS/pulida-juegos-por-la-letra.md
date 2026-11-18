# Pulida de los juegos: "Sacalo por la letra", ronda 1

> Propuesta del constructor de la ronda (2026-11-18). Es el juego 3 de la pulida; sigue a
> `pulida-juegos-jugo-y-casete.md`, `-ronda-2-sonido-y-entero.md`, `-ronda-3-cierre.md` y
> `-dos-ejes.md`. Nada de esto está decidido: son cosas hechas en la rama `pulida/juegos-ui`
> que necesitan el visto de su dueño.

## 1. Una regla que el encargo pisaba: el disco de este juego

El encargo decía que este juego viste *La mosca y la sopa* (la mezcla de `D-19` para "letras").
**No es así, y no lo cambié:** `UX-08` §1 le asignó *Momo Sampler* a propósito, para que no se
lea igual que "Completá la letra", y `contraste.test.ts` mide ese par ("boton primario de
por-la-letra"). El botón "Jugá" que se veía celeste lavado es la plata medida de esa tapa
(`--disco-momo-sampler-tinta`). Lo que hice fue darle forma de chapa —un filete del fondo por
adentro, dos anillos pegados— sin tocar la tinta. Si se quiere otro disco, es decisión de
`experiencia` y cambia `UX-08`.

## 2. Lo que cambió y conviene dejar escrito

1. **La hoja es un papel doblado, y cada escalón abre un doblez.** La escalera de `BR-20`
   (1, 2, 4, 8 versos) es lo que hace un papel doblado en tres cuando se abre: cada doblez
   duplica lo que se ve. Abajo asoma el canto de los dobleces que quedan, uno por intento sin
   gastar. **La cantidad de letra a la vista no cambió**: son los mismos versos, en los mismos
   escalones (`CTR-09.3`), y el papel de la portada trae un garabato impreso, no letra.
2. **Los chips salieron.** El intento gastado se anota en el papel, sobre el quiebre que abrió:
   lo arriesgado, con la cruz y un tachón de lápiz en el rojo del error; lo pasado, con el
   punto. Cambia `UX-08` §3 (los chips) y saca tres clases de `ESTADOS_LETRA`
   (`.chip--fallado`, `.chip--pasado`, `.chip--ultimo`) por `.nota--*`.
3. **La banda del medio es el bolsillo.** El lugar del juego (`CNT-13`: "un papel arrugado te
   pesa en el bolsillo") ahora se ve: el bolsillo de atrás del jean, con la sarga y el pespunte
   impresos como máscaras (`scripts/imprimir-papel-por-la-letra.mjs`, `public/arte/por-la-letra/`,
   unos 130 KiB en total). Tintas: `--borde` para la sarga, el peltre de *Momo Sampler* para el hilo.
4. **El rótulo de los versos es una etiqueta con fondo liso**, para que su letra siga sobre
   `--fondo` (el par medido) y no sobre la sarga.
5. **La letra se escribe.** Cada palabra del verso es un `span` y entra un instante después que
   la anterior. Entre palabra y palabra hay nodos de texto, así que se lee y se copia igual.
   Conviene que alguien lo pase por un lector de pantalla de verdad: yo no lo hice.
6. **Hay ruidos**, los mismos cuatro de `efectos.ts`: tecla al elegir y al pasar, golpe al
   errar, sello al acertar. Este juego no tiene música, así que nunca van encima de nada. El
   interruptor está en la portada, debajo de "Jugá".
7. **Textos nuevos para `contenido`** (`src/lib/por-la-letra/copy.ts`): la hazaña
   "¡Con un renglón!" (sacarlo con el primer verso; es un segundo grito, como "¡Con una
   décima!"), "N al hilo", "Llevás N puntos", y el sello "N de N" del resultado.
8. **El buscador es el de papel del hermano**: la ficha elegida se pega con cinta y la ayuda se
   va al escribir. No toqué su CSS compartido.
9. **`scripts/mirar-juego.mjs`** tiene el recorrido de este juego y esconde la barra de
   herramientas de `astro dev`, que flotaba sobre la zona del pulgar y se comía los toques.

## 3. Detalles vivos de esta ronda

| Detalle | Estado al que está atado | Con movimiento reducido |
|---|---|---|
| El papel de la portada viaja a su lugar en la partida | "Jugá" | no viaja |
| El verso se escribe palabra por palabra | abrir un tema o un doblez | aparece escrito |
| El doblez gira desde el quiebre hasta quedar plano | gastar un intento | aparece abierto |
| El papel se sacude y el tachón pasa sobre lo arriesgado | error | quieto, tachado |
| Lo que vale se vuelve a estampar | gastar un intento | cambia de una |
| El sello redondo cae en la esquina del papel | cerrar el tema | puesto |
| "+N" vuela del sello a la cuenta de la cabecera | acierto | la cuenta cambia de una |
| El papel del tema nuevo sube del bolsillo | "Seguí" | puesto |
| El sello de la vuelta, la cifra que cuenta y los temas que se pegan | resultado | todo puesto |

## 4. Lo que queda abierto

- La hoja va girada 1,1° siendo el contenedor de desplazamiento. `UX-08` §4 lo había evitado.
  No vi problemas, pero no lo probé con el dedo en un teléfono de verdad.
- Con el teclado abierto, mientras dura el golpe de un error queda un hueco entre el papel y el
  canto de los dobleces (es el doblez nuevo, todavía de canto). Se ve en la tira del error.
- Cuadros con la CPU ×4 (430 × 860, control en la misma tanda: 16,7 ms): pasar, errar y acertar
  dan p95 de 16,8, 16,9 y 33,4 ms. Cada toque deja **un** cuadro largo (200, 133 y 267 ms), que es
  el de armar el DOM, no la animación; el del acierto es el más caro porque arma la estampa.
- En la mesa (1280), el papel de la portada queda medio metido detrás de la chapa de puntajes.
- Con ocho versos, al acertar la pantalla baja hasta "Seguí" y el sello del papel queda arriba,
  fuera de la vista.

---

# Ronda 2 (2026-11-18)

## 5. Lo que cambió y conviene dejar escrito

1. **El cierre del tema tiene dos tiempos.** Primero, sobre el papel: debajo del último verso
   se escribe "Era …" y al lado cae el sello (tilde o cruz). Después de `--duracion-inercia` +
   `--duracion-umbral` (1,28 s; cero con movimiento reducido) el papel se pliega a ese renglón y
   aparece la ficha. El renglón del papel va con `aria-hidden`: la ficha (`role="status"`) dice
   lo mismo con el título como encabezado.
2. **El papel plegado se puede volver a abrir** ("Releé los versos" / "Doblá el papel"). El
   comentario viejo de `juego.css` pedía que los versos siguieran legibles al revelar; plegarlo
   sin esa puerta lo habría roto. Dos textos nuevos para `contenido`.
3. **La ficha tiene la gramática de la del hermano**: grito y suma, tapa, título, dato del disco,
   lo que costó (ahora tenue, `revelacion-costo`), "Mirá la letra y los acordes" como tecla
   secundaria de ancho completo (`revelacion-letra`) y "Seguí" adentro del panel. Debajo, un
   renglón con la fuente de la letra y "Corregí esto". **Toca `UX-09`** en un detalle:
   "Corregí esto" sigue afuera del panel y después de "Seguí", pero ya no sola.
4. **El anillo amarillo de "Seguí" no era un resto: era `:focus-visible`.** La isla le pasa el
   foco a "Seguí" desde la caja de texto, y una caja de texto siempre cuenta como foco visible,
   así que el anillo salía también al que venía tocando con el dedo. Ahora ese foco no dibuja
   anillo si el tema se cerró con un toque (`click` con `detail > 0`), y sí si se cerró con el
   teclado. La clase se va al salir del botón. **"Adiviná el tema" tiene el mismo anillo** y no
   lo toqué: si se quiere igual, es llevar `conPuntero` a `partida-tema.ts`.
5. **La banda del medio es el jean entero**, de borde a borde, con dos dobladillos
   pespunteados; el bolsillo es un parche cosido encima (tapa la sarga de la banda y lleva la
   suya). `sarga.webp` es una baldosa que cierra (ruido cosido, sin desplazamiento).
6. **Los rótulos son dos recortes de papel pegados al papel**: "Tenés N versos" con su cinta y
   "Vale N" como sello. La letra va en `--fondo` sobre `--papel`, el par medido. Con la ficha a
   la vista se van los dos.
7. **El resultado son los papeles de la vuelta sobre el jean**, uno por tema, doblado hasta
   donde lo abriste: cada intento gastado es un quiebre con su marca (cruz o punto) y abajo
   queda el canto de los dobleces sin abrir. Reemplaza a la escalerita en este juego (el
   hermano la sigue usando). El título va en `--fondo` sobre papel, no en la tinta del disco:
   ese par no está medido sobre papel. La tarjeta compartible no cambió.
8. **Un desplazamiento que se perdía.** Al cerrarse el teclado la mesa deja de ser
   `display: contents` y el navegador le borra el desplazamiento a la hoja: con ocho versos
   quedaba arriba. Ahora se vuelve a bajar (`alSalir`).
9. **El interruptor de los ruidos también está en la partida**, debajo de la tecla. Cuesta un
   renglón de 48 px: con ocho versos a 430 × 860 el papel ya no entra entero y desplaza por
   dentro (queda abajo, en lo nuevo).
10. **Token nuevo**: `--duracion-respiro` (4,5 s).

## 6. Detalles vivos de la ronda 2

| Detalle | Estado al que está atado | Con movimiento reducido |
|---|---|---|
| El canto de los dobleces se hincha cada 4,5 s | "esperando respuesta": tema abierto y nada escrito | quieto (`animation: none`) |
| El papel se endereza bajo el dedo | `:active` sobre el papel | igual: es respuesta al toque |
| "Era …" se escribe y cae el sello | cerrar el tema | puesto |
| El papel se pliega y apoya | llega la ficha | puesto |

---

# Ronda 3, el cierre (2026-11-18)

## 7. Decisiones del hilo principal, ya aplicadas

- **El respiro del papel salió**, con su token (`--duracion-respiro`), su estado
  (`.partida--esperando`) y su entrada en `movimiento.test.ts`. No se veía.
- **El papel plegado conserva el último verso leído**, con la tilde o la cruz. El título va solo
  en la ficha.
- **`conPuntero` está en los dos juegos de sacar temas**: el foco que la isla le pone a "Seguí"
  no dibuja anillo si el tema se cerró con un toque; con teclado se ve siempre.

## 8. Lo que cambió y conviene dejar escrito

1. **Los rótulos van al canto de afuera del papel** (pisan el borde, 3 px) y los dobleces
   llevan menos margen (0,7 rem). Con eso **el papel de ocho versos entra entero a 430 × 860**
   cuando los versos son de un renglón. Si no entra, desplaza por dentro y **el canto lleva un
   rayado impreso** del lado donde queda papel (`.hoja-canto`, la sarga en la tinta del fondo;
   ni sombra ni degradado). Dos estados nuevos: `.hoja-versos--sigue-arriba` y `--sigue-abajo`.
2. **La tecla de los ruidos está en la cabecera**: dice "Ruidos" siempre, el estado va en
   `aria-pressed` y en la forma (apagada: tachada y con el filete cortado). Mide 20 px de alto y
   su blanco de toque se agranda a 48 con una pieza que no ocupa renglón. Texto nuevo para
   `contenido`. En la portada sigue el interruptor con la frase entera.
3. **El primer tiempo del cierre es un sello grande** (7,4 rem) que cae al medio de lo que se
   ve del papel. **Si el teclado está abierto, se queda abierto durante ese tiempo**: la caja
   pasa a solo lectura con el foco puesto, y recién al llegar la ficha se suelta todo. No lo
   pude ver en un teléfono de verdad: en las capturas no hay teclado.
4. **El pase es una sola historia**: el papel usado baja torcido y se mete bajo el dobladillo
   (un sub-paso), y recién ahí sale el nuevo del bolsillo (otro).
5. **El detalle vivo que reemplaza al respiro es la birome** que asoma del bolsillo: cada vez
   que algo queda anotado en el papel (un error o un pase) baja la punta y vuelve, en saltos.
   Dos máscaras nuevas (`birome-cuerpo.webp`, `birome-clip.webp`).
6. **Los quiebres del resultado se leen**: "· pasaste" escrito, y la cruz con un tachón rojo.
   A 1280 la fila incompleta va al medio.
7. **La tarjeta compartible habla en papeles** (`DatosTarjeta.papeles`, `FilaTarjeta.recorrido`
   en `lib/tarjeta/plan.ts`): cada fila es un recorte con su sello y las marcas de lo gastado.
   La maqueta de `planificar()` no cambió y "Adiviná el tema" sigue con la suya. Se dibuja una
   vez, asoma arriba de "Compartí" y el botón usa esa misma imagen.
8. **El pie del resultado es una pieza** (`.pie-resultado`, en `juego.css`) para los tres
   juegos pulidos: la tarjeta que asoma, "Compartí", lo que compartir tenga para decir, la otra
   vuelta y, al final, `← Volvé al fichín` en `.salida-resultado`. Cambios por juego:
   - *Sacalo por la letra*: "COMPARTÍ" → "Compartí", "JUGÁ DE NUEVO" → "Jugá de nuevo",
     "← Al fichín" → "← Volvé al fichín", y ahora tiene la tarjeta que asoma.
   - *Adiviná el tema*: "Volvé al fichín" pasa de `.accion-abajo` a `.salida-resultado .volver`
     (la cinta de papel con la flecha, como los otros dos).
   - *¿Qué tipo de ricotero sos?*: solo suma la clase; `.ejes-acciones` queda como el nombre
     viejo de la misma pieza. Su vuelta al fichín sigue al final de la página, debajo del plano.
   `.accion-abajo` la siguen usando "Completá la letra" y "Adiviná la tapa": cuando les toque,
   pasan a la misma pieza.

9. **"Pasá" ya no abre el teclado en el teléfono.** Después de cada intento la isla enfocaba
   la caja de texto, y en un teléfono eso levanta el teclado: tapaba el bolsillo y achicaba el
   papel justo cuando llegaban los versos nuevos, también al que solo iba pasando. Ahora, sin
   teclado abierto y con dedo, el foco queda en el botón; con el teclado abierto o con mouse,
   en la caja como siempre. **Toca `UX-08`** (el foco después de un intento) y conviene que
   `experiencia` lo mire; "Adiviná el tema" no lo cambié.

## 9. Detalles vivos de la ronda 3

| Detalle | Estado al que está atado | Con movimiento reducido |
|---|---|---|
| La birome baja la punta y vuelve | algo queda anotado en el papel | quieta |
| El sello grande cae sobre el papel | cerrar el tema | puesto, y enseguida la ficha |
| El papel usado se guarda y sale el nuevo | "Seguí" | el tema nuevo aparece puesto |
| El canto rayado del papel | queda papel por ver para ese lado | igual: es información |

## 10. Lo aprendido para los juegos que quedan

1. **El objeto sale de la bajada.** La portada ya promete un objeto ("un papel arrugado te pesa
   en el bolsillo"): ese es el protagonista, y el lugar que nombra es el fondo de la partida.
2. **Buscar la regla del juego en el objeto**: 1, 2, 4, 8 versos es un papel que se desdobla. Si
   la mecánica y el objeto coinciden, la animación comunica el estado sin explicarlo.
3. **Lo que se gasta se anota sobre el objeto**, en el lugar donde se gastó, y el resultado
   reutiliza esa misma marca. La lista aparte y la escalerita sobran.
4. **El cierre en dos tiempos**: primero el golpe donde está el ojo, después la ficha. El objeto
   se achica a un renglón para que la ficha entre en una pantalla, con una puerta para reabrirlo.
5. **Un detalle vivo se juzga en la tira**: si en seis cuadros no se distingue, se saca.
6. **Lo que se lee va sobre papel o sobre el fondo, nunca sobre la textura**: es lo que deja usar
   fondos impresos sin abrir pares de contraste nuevos.
7. **Antes de culpar al diseño, mirar el foco y el desplazamiento**: el anillo de "Seguí" era
   `:focus-visible` heredado de la caja de texto, y la hoja que quedaba arriba era el navegador
   borrando el desplazamiento al pasar de `display: contents` a `flex`.
8. **Los relojes de JavaScript no se frenan con la tira**: las secuencias con `setTimeout` se
   capturan a velocidad real; frenar solo el CSS las desarma.
9. **Cuidado con los reemplazos globales en archivos compartidos** (`mirar-juego.mjs`,
   `juego.css`): acotar cada parche a la función o al bloque del juego, y mirar el `git diff`
   por secciones antes de correr.
10. **La gramática compartida se arma al tercer juego**, no al primero: la ficha, el pie del
    resultado y el anillo de foco se unificaron recién cuando hubo tres para comparar.
