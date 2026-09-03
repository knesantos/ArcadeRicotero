# HILO — Lo que el juego construido hace distinto de `ADR-06` / `CTR-13` / `US-08`

> **De:** hilo principal · **Para:** `arquitectura` y `producto` · **Fecha:** 2026-09-03
> **Sobre:** `US-08` "Ponelos en fila", ya construido y verificado.
> **Qué se pide:** que los dueños ratifiquen o corrijan dos desvíos, y una tercera cosa que
> quedó abierta. **Nada de esto es un bloqueo:** el juego anda, los tests pasan y el
> contrato del link se cumple al pie de la letra.

---

## Por qué existe este hilo

`ADR-06`, `CTR-13` y `US-08` se escribieron **en paralelo** con el código, en la misma
ráfaga, contra el mismo brief. Eso salió bien: el contrato del link se implementó tal como
`ADR-06.5` lo pide —cuarto miembro de la unión, `g` en la query y `o=` en el fragmento,
`leerReparto(direccion, juegoPropio, fichasDelConjunto)` con el catálogo como función—, y
la lámina se movió a `src/lib/ponelos/lamina.ts`, donde `ADR-06.6` la puso.

Pero mientras los documentos se escribían, el código encontró **una pieza que el brief no
tenía**, y con ella un desvío en el transporte. Los dos están abajo, con lo que se ganó y
lo que costó.

---

## 1. Hay un conjunto quinceavo que ningún documento nombra: el sorteado

**Qué es.** `az-<semilla>` — doce temas sorteados de los 105, con la semilla adentro del
propio id del conjunto. `az-a1b2c3` siempre sortea los mismos doce, en cualquier navegador
y en cualquier momento, porque el barajado es determinista y la semilla viaja en el id.
Cada vez que se abre la pantalla de elección se ofrece una semilla nueva.

**Por qué se agregó.** El brief listaba catorce conjuntos y ninguno de ellos era "temas de
toda la discografía", que es literalmente una de las cuatro cosas que pidió el usuario
("tierlists de temas, temas por album, albumes y otros mas"). Los 105 juntos rompen la
sesión de dos o tres minutos —`US-08` lo descarta con razón—, y "los que abren" y "los que
cierran" cruzan discos pero son diez cada uno y siempre los mismos.

Y resuelve, de paso, **el riesgo número uno de este juego**: un conjunto ordenado queda
ordenado para siempre. Los catorce fijos se agotan; el sorteado no.

**Qué le toca a cada uno:**

- **`producto`**: el piso de `US-08` dice "14 conjuntos, el techo entero, no un número
  menor". Hoy hay **15**, así que el piso se cumple con margen y el test de
  `src/lib/pisos.test.ts` pide `>= 14`. Lo que hay que decidir es si el sorteado **entra al
  piso** (y entonces son 15) o si queda declarado aparte como un conjunto que no se cuenta
  porque no es un contenido fijo sino un generador. La segunda opción me parece más
  honesta: el piso mide contenido, y el sorteado es un mecanismo.
- **`arquitectura`**: `CTR-13` enumera los conjuntos. Falta la forma `az-<semilla>` en esa
  enumeración, con su gramática (`^az-[a-z0-9]{6}$`, nueve caracteres, entra cómodo en los
  24 del id de `ADR-06`) y con el orden canónico que la hace decodificable: **el barajado
  determinista de la semilla sobre los 105 en orden canónico**. Es una cuarta pata del
  orden canónico de `CTR-13.5` y, como las otras tres, si cambia hay que subir
  `VERSION_REPARTO`.

---

## 2. La página manda el catálogo, no los conjuntos armados

**Lo que dice `CTR-13`:** *"la página manda los 14 conjuntos enteros (≤ 24 KB) porque un
link ajeno puede traer cualquiera"*, y `conjuntos.ts` se resuelve en build.

**Lo que hace el código:** la página manda **el catálogo** —los 105 temas de `RES-20` y las
diez fichas de disco, ~10 KB— y `src/lib/ponelos/conjuntos.ts` arma el conjunto **en el
navegador**.

**Por qué.** Es consecuencia directa del punto 1: con el sorteado, los conjuntos posibles
no son quince, son infinitos. Si se armaran en build, **una lista sorteada no se podría
compartir**: el que recibe el link no tendría de dónde sacar esos doce temas.

**Qué se gana además, y por qué creo que este desvío es una mejora y no una deuda:**

- Pesa **menos**: un catálogo de 105 entradas es más chico que quince conjuntos que
  repiten los mismos temas. Los diez conjuntos por disco son, sumados, los 105 otra vez.
- Cumple el motivo que `CTR-13` da para mandar los catorce enteros —*"un link ajeno puede
  traer cualquiera"*— **mejor**, no peor: cualquier id se resuelve, incluidos los que no
  existían cuando se generó la página.
- Cambiar de conjunto no recarga nada.

**Lo que costó, dicho de frente:** `conjuntos.ts` pasó a ser código de navegador, así que
no puede tocar `node:fs` ni por el camino más largo. Importa `letra/discos.ts`,
`tapa/pasadas.ts` y `ponelos/copy.ts`, los tres módulos hoja. Lo vigila `islas.test.ts`,
que existe precisamente porque `tema/paleta.ts` mató un juego entero por traer `node:fs`
dos saltos más allá, con `npm test`, `check` y `build` los tres en verde.

**Qué se pide:** que `arquitectura` ratifique el transporte en `CTR-13` o diga por qué no.
Si lo ratifica, la frase que cambia es el apartado de transporte, y el resto del contrato
—el orden canónico, la derivación desde `RES-20`, el no bajar a `.schema.json`— queda tal
cual, porque se cumple entero.

---

## 3. Lo que quedó abierto, y no es de nadie de los dos

**El renglón de `LUGARES` y el mapa de `UX-04`.** `UX-23` dejó dos bloqueos anotados. El
primero se resolvió: el renglón quedó **"Se te desordenó la pila de discos."** —seis
palabras, segunda persona, imagen física, y **no nombra ninguna de las cuatro filas**, que
era exactamente la reserva que `experiencia` había levantado sobre la propuesta anterior
("Te pesa la valla en las costillas" cita literalmente el nombre de una fila, y las cuatro
tienen que pesar lo mismo). Si `contenido` prefiere otro, se cambia en un renglón de
`src/lib/sitio/copy.ts`.

El segundo sigue abierto y es de `experiencia`: **`UX-04` no tiene la fila de *¡Bang!
¡Bang!… Estás liquidado*** en el mapa sección→disco. El código ya la tiene en los tres
lugares donde el mapa vive de verdad (`DETALLE_POR_VARIANTE`, `DISCO_DE` y
`DISCO_DE_CATEGORIA` en `src/lib/sitio/arte.ts`) y el crédito de `D-21` la nombra bien en
el portal — verificado en el navegador. Falta escribirla donde el mapa se documenta.

---

## 4. `CTR-13.2` y `UX-23` §2.2 no dicen lo mismo sobre "Los diez discos"

Lo encontró `revisor` (`FIND-52`) con el juego ya construido, y **era un defecto real, no
una diferencia de papeles**: `armarConjunto` armaba `discos` y `tapas` **idénticos** —las
mismas diez fichas, la misma tapa, el mismo formato— y de diferencia el título. Dos
conjuntos que son el mismo dejan el piso de `US-08` contando catorce donde hay trece.

**Se arregló siguiendo `CTR-13.2`**, que es el contrato: `discos` va en formato `titulo`
—título y año, como quien mira el lomo en la estantería— y `tapas` en formato `tapa`. Así
los dos conjuntos comparten las fichas y son **preguntas distintas**: uno ordena el disco,
el otro ordena el dibujo. Verificado en el navegador.

Lo que queda para `arquitectura`: **`UX-23` §2.2 los agrupa con el mismo tratamiento
visual**, que es lo que había guiado la primera versión del código. Una de las dos manda.
Si manda `UX-23`, hay que borrar uno de los dos conjuntos —porque con el mismo tratamiento
son el mismo— y el piso de `US-08` baja a trece.

Se agregaron dos guardas para que esto no vuelva en silencio, las dos en
`src/lib/ponelos/conjuntos.test.ts`: una compara el formato de cada conjunto contra la
tabla de `CTR-13.2`, y la otra falla si **dos conjuntos cualesquiera son idénticos**. Las
dos se probaron rompiendo el código a propósito.
