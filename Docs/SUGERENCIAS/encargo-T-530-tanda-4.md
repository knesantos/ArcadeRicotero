# Encargo `T-530` (`D-91`), tanda 4: los techos, el bajo y el templo

Escrito por el hilo principal el 2026-11-16. Sigue a `encargo-T-530-tres-ambientes.md`,
`encargo-T-530-tanda-2.md` y `encargo-T-530-tanda-3.md`: leelos primero. Todo lo de ahí vale acá,
salvo lo que se dice abajo.

## Qué dejó la tanda 3 (astilleros, Cybersiberia, árbol; cuatro vueltas)

Hecho y verde (2501 tests): el carguero en su capa (`PLANOS`), las grúas, el río hasta la otra orilla,
la tiza y la rayuela; la escarcha, las torres, la aurora y la nieve teñida de Cybersiberia; las ramas,
los péndulos (`.pendula`, un cuadro sí y uno no), la luna con el ojo y el gran bonete caído del árbol;
las tres en `FRENTE_QUE_SE_CORRE`, con dos premios de lupa cada una. Todo sin editar los recintos:
lo lejano lo pinta el camino y al piso del recinto se le suma por debajo y por encima
(`SOBRE_EL_RECINTO`, `escorzo.ts`). Las lecciones del constructor, que acá son reglas de trabajo:

1. **Al piso de un recinto ajeno se le suma sin editarlo**: una mano por debajo y otra por encima en
   la misma imagen, y un test que exija que el dibujo original esté entero adentro.
2. **Lo que está entre lo lejano y el piso y no se repite va como capa suelta con su velocidad**
   (`PLANOS`), no pintado en lo lejano ni en una baldosa de aire.
3. **Lo que cuelga gira desde su nudo, pieza por pieza, y un cuadro sí y uno no.**
4. **Una luz clavada en una capa y un bicho en otra se van a cruzar en alguna pantalla**: mirarlo a
   1280 y con la lupa.
5. **El color sobre un fondo oscuro o gris necesita croma, no solo luz, y va delante de la niebla.**
6. **Un reflejo que tiembla al lado de una luz que se mueve no se lee.** Antes de construir, mirá qué
   más se mueve en ese cuadro.
7. **La primera pantalla del teléfono va de ~96 a ~416**, no de 0 a 320: la cámara ya dio su primer
   paso. Y un control de cuadros fuera de 27–35 ms invalida la tanda entera.

## Por qué estas tres

En `cap/` (430×860) y en la hoja `t4-candidatas.png` del scratchpad. La prisión queda para después:
su blanco y negro de grabado ya es la más fuerte de las cuatro que faltan.

- **Los techos** (`los-techos`, *los techos y el baldío*): la mitad de arriba tiene algo (tejados,
  ropa colgada, la lluvia de chispas), pero **la mitad de abajo es un piso violeta oscuro vacío** con
  un par de ojos. Es el baldío de noche: faltan las chapas, las antenas y los tanques que se van al
  fondo, la luna o el foco del barrio, los charcos, el pasto crecido, la medianera con algo escrito,
  los gatos de los techos, algo que cruce el baldío al horizonte.
- **El bajo** (`el-bajo`, *el bajo inundado*): azul parejo de punta a punta, el agua es un plano con
  rayas que no se distingue del cielo. Necesita **el agua de verdad**: la línea de flote que se lee,
  lo que asoma (techos de autos, carteles, postes, un colectivo), lo que flota y se mece, los reflejos
  de las pocas luces (ojo con la lección 6), la niebla al ras del agua, y un fondo que se hunda en planos.
- **El templo** (`el-templo`, *el templo de Momo*): arriba hay guirnalda de lamparitas, espirales y la
  luna de Momo, que están bien; pero **el 40 % de abajo es negro liso**. Es un templo de carnaval: el
  piso que se va al fondo (baldosas, alfombra, serpentina pisada, papel picado), columnas o telones en
  planos, el humo de las velas, máscaras y muñecos en las sombras, algo que brille al fondo.

Las tres tienen que distinguirse de un vistazo en una captura chica, y cada una necesita su punto de
fuga: algo que cruce el piso y se vaya al horizonte.

## Coordinación con `T-529`: igual que en la tanda 3

La rama `origin/claude/bestiario-rocambole-3238c6`, todavía sin integrar, convirtió en títeres a
**el manso y el silbido** (los techos), **los nenes** (el bajo) y **el sheriff** (el templo), y editó
las funciones de esos recintos en `arte-entornos.ts` (y `sitio.css`, `tokens.css`). Por eso:

- **No edites las funciones del recinto de estas tres regiones en `arte-entornos.ts`**, ni
  `rig-entornos.ts`, `escenas.ts`, `recintos.ts`, `elenco.ts` ni `vivos.ts`. Lo nuevo va en el camino,
  el aire, `PLANOS` y piezas nuevas, con la mano de abajo y la de arriba (`SOBRE_EL_RECINTO`).
- **Dejá libre el lugar de esos cuatro títeres**: miralo con `git show
  origin/claude/bestiario-rocambole-3238c6:src/lib/bestiario/rig-manso.ts` (y `rig-silbido.ts`,
  `rig-nenes.ts`, `rig-sheriff.ts`), y que un test lo afirme, como en la tanda 3.
- Si una mejora solo se puede hacer tocando esas líneas, no la hagas: anotala en tu entrega.

## Un pendiente que encontraste en la tanda 3

Yendo a los astilleros quedaban 94 imágenes de la mesa pedidas sin terminar (`canibal-mosca`,
`mosca-zumbido`, `mosca-pata-*`). En la primera vuelta, si entra, averiguá quién las pide (¿el plano,
un prefetch, una ficha?) y si pasa también yendo a estas tres. Arreglalo solo si es chico y del bestiario.

## Al cerrar cada vuelta

Lo mismo que en las tandas anteriores: hojas antes/después en la misma posición (antes = `cap/`
para la primera vuelta), una a 1280×800, la tabla de memoria rama/main por región (techo +20 %), lo
visto separado de lo escrito, y tu top 5 para la vuelta siguiente en estas tres.
