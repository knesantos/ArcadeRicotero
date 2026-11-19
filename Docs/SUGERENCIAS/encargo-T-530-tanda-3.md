# Encargo `T-530` (`D-91`), tanda 3: los astilleros, Cybersiberia y el árbol

Escrito por el hilo principal el 2026-11-16. Sigue a `encargo-T-530-tres-ambientes.md` y a
`encargo-T-530-tanda-2.md`: leé los dos primero. Todo lo de ahí vale acá, salvo lo que se dice abajo.

## Qué dejó la tanda 2 (galpón, infierno, mesa; cinco vueltas)

Hecho y verde (2492 tests): la gente del galpón figura por figura con el seguidor que le prende el
canto, el que asoma en el infierno, la alfombra y la copa, la mesa con candelabro, vapor, reloj,
visita y ojos que huyen de la lupa; lo de adelante se corre con la lupa en la mesa y el galpón
(`FRENTE_QUE_SE_CORRE`). Las lecciones nuevas del constructor, que acá son reglas de trabajo:

1. **La cuenta primero por la memoria de imágenes decodificadas** (determinista aunque la PC esté
   cargada) y después por los cuadros. El decodificado depende de las dimensiones de la pieza, no de
   la calidad del webp. Techo: **+20 % sobre main** por región. Antes de comparar, mirá qué imágenes
   baja cada lado.
2. **Una capa partida en muchas capas chicas cuesta más que una grande.**
3. **Una multitud (o cualquier repetición) se pinta figura por figura**, no con una máscara y trama.
4. **Una luz que prende el canto de algo impreso: un solo trazo por figura, en el lugar del canto.**
   Si la luz y lo iluminado van en capas distintas, la zona se calcula con el corrimiento de las dos,
   con un test que barra a 300 y 1024.
5. **Lo que aparece si te quedás quieto va en la primera pantalla, contra un fondo que no compita.**
6. **La lupa se verifica agrandando sobre un punto**, y lo de adelante del piso se corre con ella.
7. **Lo que no se lee en la tira de seis cuadros se saca en la misma vuelta.**

## Por qué estas tres

En las capturas de `cap/` (430×860) son las más chatas:

- **Los astilleros** (`los-astilleros`): contenedores en bloques planos azul y naranja, un muelle
  vacío, agua oscura sin reflejo que valga. Es un puerto de noche: falta la escala (grúas que se
  pierden arriba, cascos de barco enormes que cortan el cuadro), el agua que se mueve y refleja los
  faroles, la niebla de río, sirenas y luces de barco a lo lejos, algo que flota.
- **Cybersiberia** (`cybersiberia`): gris lavado de punta a punta, la niebla aplana todo en vez de
  separar planos, la nieve es una lluvia de rayitas iguales. Tiene que ser frío **y** máquina: chapa
  con escarcha, cables con hielo colgando, luces de pantalla verdosas o rojas en la nevada, ventisca
  en planos a distintas velocidades, un horizonte blanco que se traga lo lejano.
- **El árbol** (`el-arbol`, *el árbol del gran bonete*): degradé violeta casi vacío, pastos negros
  repetidos abajo; el árbol, que es la región, casi no se ve. Necesita **el árbol**: un tronco que
  sea el lugar, ramas que salgan de cuadro y vuelvan, cosas colgando (lo que cuelga del árbol del
  gran bonete), un cielo con más que un degradé.

Las tres tienen que distinguirse de un vistazo en una captura chica, y la regla del punto de fuga
vale: algo que cruce el piso y se vaya al horizonte en cada una.

## Coordinación con `T-529` — ojo, acá sí se cruzan

La rama `claude/bestiario-rocambole-3238c6` (con commits de hoy, sin integrar) convirtió en títeres
del elenco a **el as del Club París** (muelle de los astilleros), **los camellos prestigiosos** (la
nieve de Cybersiberia) y **el ángel guardián** (el árbol, entre el tronco y el colgado), y para eso
**editó las funciones de esos tres recintos en `arte-entornos.ts`** (sacó el as y su valija, el
camello, el ángel, y corrió huevos del árbol). Por eso:

- **No edites las funciones del recinto de estas tres regiones en `arte-entornos.ts`** ni
  `rig-entornos.ts`, `escenas.ts`, `recintos.ts`, `elenco.ts`, `vivos.ts`. Si necesitás algo nuevo
  en el recinto, va en una pieza o archivo nuevo que se sume sin tocar esas líneas.
- Trabajá sobre el **camino** (`arte-camino.ts`, `escenas-camino.ts`, `scripts/camino.ts`), el
  **aire** (`aire.ts`, `arte-aire.ts`) y piezas nuevas.
- **Dejá libre el lugar de esos tres títeres**: mirá en esa rama dónde quedan (`git show
  origin/claude/bestiario-rocambole-3238c6:src/lib/bestiario/rig-asparis.ts`, `rig-camellos.ts`,
  `rig-guardian.ts`) y no les pongas nada encima ni detrás que los tape cuando lleguen.
- Si una mejora solo se puede hacer tocando esas líneas, no la hagas: anotala en tu entrega.

## Arrastre de la tanda 2 (chico, en la primera vuelta si entra)

- La lámpara de la mesa, a 1280 con lupa, pisa la sombra de un comensal.

## Al cerrar cada vuelta

Lo mismo que en las tandas anteriores: hojas antes/después en la misma posición (antes = `cap/`
para la primera vuelta), una a 1280×800, la tabla de memoria rama/main por región, y tu top 5 para
la vuelta siguiente en estas tres.
