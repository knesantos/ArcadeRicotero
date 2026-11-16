# Encargo `T-530` (`D-91`), tanda 2: el galpón, el infierno y la mesa

Escrito por el hilo principal el 2026-11-16. Sigue a `encargo-T-530-tres-ambientes.md`: leé ese
primero (el pedido del usuario, las reglas, cómo es cada vuelta y qué se devuelve). Todo lo de ahí
vale acá, salvo lo que se dice abajo.

## Qué dejó la tanda 1 (monte, pastura, ruta; cuatro vueltas)

Hecho y verde (2487 tests): el velo que espera y tiene un signo propio por región; el monte con
troncos de papel rasgado, sendero en escorzo, charco y raíces; la pastura con cielo del cordero,
alambrado, molino, círculo pelado de tierra; la ruta con torres, cielo de chapa, paso a nivel y el
tren; la lupa que congela el paralaje (`camConLupa` en `lupa.ts`); piezas finas aparte para lo que
premia la lupa. Al usuario le gustaron mucho los fondos nuevos y dio permiso explícito para sumarles
detalle donde falte.

**Las cinco lecciones que dejó el constructor de la tanda 1**, que acá son reglas de trabajo:

1. **El fondo en planos, no en fila.** Lo lejano en dos planos separados por valor y bruma, y lo
   más cercano del fondo en una capa aparte que se corra a otra velocidad, marcada para que el modo
   liviano no la apague.
2. **No reutilizar la pieza del recinto en el camino.** Los tres arreglos más largos vinieron de
   ahí. Cada camino pinta lo suyo; lo del recinto se cambia solo detrás de una condición que lo deje
   igual.
3. **Nada con canto recto ni recorte de caja en el piso.** Lo que se apaga se apaga con manchas que
   se ralean. Antes de arreglar se aísla escondiendo capas.
4. **Un punto de fuga por región.** Algo que cruce el piso y se vaya al horizonte hizo más por la
   profundidad que cualquier niebla. Y una presencia en la primera pantalla, algo con peso en la última.
5. **El premio de la lupa va impreso fino aparte.** Medir a CPU ×6 con el control en la misma tanda
   (a ×4 todo se va al tope de 60 cuadros), y mirar la memoria de imágenes decodificadas.

## Por qué estas tres

Son las que la otra sesión de bestias (`T-529`, rama `claude/bestiario-rocambole-3238c6`) no toca:
dejó sin integrar reimpresiones del árbol, los astilleros, Cybersiberia, la prisión, y quizás de los
techos, el templo y el bajo. **No reimprimas ningún piso ni capa de esas regiones**, ni del monte.

## Lo que vio el hilo principal (capturas a 430×860 en `cap/` del scratchpad)

- **El galpón** (`el-galpon`, *Patricio Rey*): arriba, el escenario con su franja de bandera y los
  equipos, bien; pero **el 40 % de abajo de cada pantalla es la misma fila de siluetas negras de la
  gente** con trama de puntos, plana, que se repite. Es el lugar del recital: la gente tendría que
  ser la mitad del espectáculo (manos, banderas, bengalas, el pogo que se mueve en ola, humo del
  escenario que baja sobre la gente, el seguidor que barre). El galpón es la región con menos webp
  (33): hay margen.
- **El infierno** (`el-infierno`, *Lobo suelto*/la tapa que le toque): ya es fuerte (paredes de
  fuego naranja, piso de damero rojo y negro). Le falta aire: calor que tiembla, brasas que suben,
  el damero que se va al fondo en fuga (hoy es un plano), algo que asome entre las llamas. Que el
  fuego respire.
- **La mesa** (`la-mesa`, *La mosca y la sopa*): muy gráfica y de tinta plana (es su mano, no la
  rompas con aerógrafo). Pero es la más quieta y la más chata: pared roja, mantel, sillas. Necesita
  profundidad sin perder la tinta plana: la mesa que se va larga al fondo, la ventana con algo
  afuera, el vapor de la sopa, las moscas, lo que pasa debajo del mantel.

Mirá también la última pantalla de cada una (el cruce): en las tres es igual a las otras regiones.

## Arrastre de la tanda 1 (chico, hacelo en la primera vuelta)

- El tren de la ruta pasa por delante de los postes cercanos: que vaya detrás.

## Coordinación

`T-529` ya no tiene sesión abierta, pero su rama existe: no toques `elenco.ts` ni `vivos.ts`. Si un
bicho de estas tres regiones tapa algo nuevo o queda tapado, decilo y no lo muevas por tu cuenta.

## Al cerrar cada vuelta

Lo mismo que en la tanda 1, más: hojas antes/después en la misma posición (antes = `cap/` para la
primera vuelta), una a 1280×800, y tu top 5 para la vuelta siguiente en estas tres.
