---
paths:
  - "src/lib/bestiario/**"
  - "src/scripts/bestiario/**"
  - "src/data/bestiario*.json"
  - "scripts/imprimir-bestiario.mjs"
  - "public/bestiario/**"
---

# Cómo nace una bestia: mañas para hacer títeres del bestiario (y mejorar los que ya están)

> **Quien diseñe, anime, revise o encargue una bestia del bestiario lee esto antes de empezar**,
> hilo principal y subagentes por igual. Si le encargás una bestia a un agente, nombrale este archivo.

Lo pidió el usuario (2026-11-13): enseñanzas *"para hacer bestias, para mejorar las que ya están"*,
guardadas junto a las de inmersión del bestiario (`.claude/rules/bestiario-inmersion.md`, `D-90`), y
**flexibles, que admitan la creatividad, nada muy rígido.** Es la sección 13 que esa regla dejó
pendiente ("El diseño de las bestias"). Salen de la vuelta 27 de `D-73`: la rana rubia, el borrego,
la liebre muerta, el taxi paranormal y el polizón del remolque. Las diseñó un subagente Fable y las
auditó el hilo principal mirando capturas, en dos vueltas.

**Esto no es una receta.** Son principios y mañas, cada uno con el caso que lo enseñó. Una bestia
puede romper cualquiera si tiene con qué: lo que no se negocia sigue estando en `diseno-marca.md`
(cero sombras, hex solo en `tokens.css`), en `voz-ricotera.md` y en `bestiario-inmersion.md`. El
molde técnico (los cuatro archivos `arte-` · `rig-` · `scripts/bestiario/` · `.test.ts`, el registro
en `elenco.ts`, las tintas de la tapa) lo cuentan `D-73` y sus vueltas. Acá va lo que no se ve en el
molde.

---

## 1. De la letra al gesto

- **Leé el tema entero, no solo el verso de la ficha.** El verso te da el bicho; el resto del tema,
  todo lo que tiene encima. El taxi salió entero de *Pensando como una acelga*: fuera de foco,
  parpadeando, el jabón, la flor de espadas, el esqueleto, la colilla, el diablo. Nada de eso estaba
  en la ficha.
- **Preguntale a cada palabra qué objeto barato es.** *"Alquiló una rana rubia, tibia y haragana"*:
  *alquiló* es una etiqueta colgando de un piolín, *rubia* una peluca, *tibia* una reposera con un
  reflector de papel de aluminio, *haragana* una lengua que le erra a la mosca sin levantarse.
- **A veces el que manda es el verbo.** *"Jugando al borrego"* no describe un borrego: describe a uno
  que juega a serlo. Así el vellón pasó a ser un disfraz con cierre, y el toque, *"caen los
  disfraces"*. Si el sustantivo te da un bicho genérico, mirá el verbo.
- **Lo rocambolesco es tomarse la metáfora en serio.** *"Te van a carnear"* son los cortes del
  carnicero marcados a línea de puntos en el cuero. *"Todos te daban por muerto"* es una corona con
  cinta y una vela apagada arriba del bote. No hace falta inventar: hace falta creerle a la letra.
- **Humor seco: la contradicción va quieta, sin subrayar.** La rana toma sol de noche y con
  llovizna. La liebre muerta suspira. El polizón que todos dan por muerto saca un pocillo de café.
- **Separá, en el comentario del arte, lo que viene de la letra de lo que es invento.** Si la lista
  del invento es más larga, te falta leer.

## 2. Qué hace sola y qué hace tocada

- **Lo que hace sola tiene que poder fallar.** Las acciones más queribles son las que salen mal: la
  rana le erra a la mosca, al borrego se le resbala el cierre, a la liebre se le abre un ojo. Y el
  contraste es el chiste: tocada, la rana se come la mosca sin mirarla.
- **El toque es el verso llevado al extremo.** La liebre se muere *más fuerte*, el taxi hace lo
  *paranormal*, al borrego *le caen los disfraces*.
- **Y vuelve a empezar, con algo chiquito cambiado.** Todo lo que el toque gastó vuelve (la mosca, la
  guinda, el disfraz, la corona enderezada de un golpe); si no, la segunda vez no queda nada.
- **Lo que solo pasa en el toque, media gente no lo ve nunca.** Al principio el diablo del taxi salía
  solo al tocarlo, chico y en un rincón. Ahora cuelga del baúl y en reposo ya asoma los cuernos. El
  mejor detalle de la letra tiene que verse quieto, aunque sea a medias.
- **Pensá primero la foto quieta del toque.** Con movimiento reducido el toque es una segunda foto, y
  esa pose es también el retrato de la ficha. Si el bicho no se entiende en esa foto, moviéndose
  tampoco.

## 3. Dónde se para

- **Mirá el recinto entero con las capas de adelante puestas antes de fijar el lugar.** Unos ojos en
  lo oscuro caben en cualquier hueco; un cuerpo, no. La liebre nació donde estaban sus ojos y la
  tapaban las tiras de `monte-frente`, así que se mudó.
- **Quién tapa a quién lo decide el orden de las capas, no la `y`.** La vaca se dibuja después que el
  elenco, y su sombra se comía las patas de la liebre. Leé qué se dibuja después.
- **La capa también es diseño.** En `figura`, los yuyos de la ruta rayaban al taxi entero: "una
  franja violeta detrás de rejas". Correrlo no alcanzaba: pasó a `delante`, con sus propias matas
  bajas al pie, que no llegan a la cara.
- **El tamaño se decide al lado del vecino**, no de cerca y solo. A 0,5 el taxi era la mitad de la
  Pontiac que pasa por atrás.
- **La geometría que importa se escribe como afirmación.** El borrego tiene que quedar afuera de la
  soga del cordero aunque brinque: lo dice el test, y la primera vez falló por la cabeza. Si la bestia
  se muda, se mudan sus ojos (y el test se entera), salvo que otro bicho los esté mirando.

## 4. Que se lea qué es

- **Primero qué es; después, de qué disco.** El taxi violeta y oro viejo era fiel a *Momo Sampler* y
  no parecía un taxi. Cuando una cosa tiene un color que la nombra (el negro y amarillo de los taxis
  de Buenos Aires), ese color manda aunque no esté en la tapa: se toma de las tintas del sitio, y
  **la tapa va en los detalles**. La prueba: mostrale el PNG a alguien sin decirle el nombre.
- **Una pieza se juzga por lo que parece de lejos, no por lo que es.** El reflector de la rana, un
  rectángulo con dos líneas, se leía como una notebook; en abanico y con un destello se lee como papel
  de aluminio. La cinta de la corona parecía una flecha.
- **Si la tapa no tiene el color que pide la letra, buscá su píxel más saturado y decilo.**
  *Luzbelito* no tiene rojo; *Lobo suelto* tiene un solo magenta, el del sello. Si así no alcanza,
  **dos tintas**: el canto en la más oscura de la tapa y lunares o filete en la más clara. El
  contraste lo hace el canto. La limitación se anota en el bloque de tokens; nunca se inventa un hex.
- **Sobre fondo de noche, el negro se resuelve con canto y con brillo**, no cambiando el negro. El
  taxi negro sobre la banquina negra se salvó perfilado en plata y con un brillo soplado en el lomo.
- **Lo negro y chico necesita marco y aire.** Los anteojos subidos de la rana eran una mata negra
  sobre la peluca: dos lentes que no se tocan, cada uno con su filete claro y su reflejo, se leen.
- **Un canto derecho en una mancha oscura se lee como un objeto.** La sombra bajo el bote parecía un
  paño parado; con el canto roto a mano es sombra.

## 5. La cara

- **Nada le pasa por encima al ojo**: ni una mata fija (se corrió el taxi para despejarle el
  faro-ojo), ni lo que le cuelga de la cara (la lengua de la liebre le tapaba el ojo cerrado, que es
  toda su actuación).
- **Una cara a medias es una cabeza cortada.** Por la rendija del bote se veía la cara del polizón de
  las cejas para abajo, pegada al agua. La geometría estaba bien y la imagen, mal. La salida fue otra
  idea: a oscuras es **una sombra con dos ojos**, y la cara aparece con la luz. Sirve para cualquiera
  que espíe desde lo oscuro.

## 6. El rig y el peso

- **Toda cabeza que gira más de unos 30° necesita cogote.** Al borrego se le abría un hueco en la
  nuca al agachar: una pieza de cogote que gira la mitad que la cabeza, en el mismo pivote y por
  debajo, lo tapa en cualquier ángulo.
- **Lo que cuelga, cuelga para abajo, y llega después.** Las orejas de la liebre giraban con la
  cabeza y quedaban paradas como cuernos. Lo que cuelga gira al revés, un poco más y un rato después.
  El pañuelo, la corona, la etiqueta y el brazo del chofer llevan la misma onda que el cuerpo, con
  retraso.
- **Subir despacio, caer de golpe.** El taxi tarda 1,2 s en levitar y 0,3 s en caer, y se aplasta. El
  aliento no es un seno: se llena en dos tercios del período y se vacía en el resto.
- **Lo que gira guarda velocidad.** Las ruedas del taxi agarran rápido y frenan despacio, así siguen
  girando cuando ya cayó.
- **Lo que se esconde se esconde detrás de otra pieza**, no solo con opacidad: el polizón entra
  entero bajo el casco y lo que está en el agua se recorta en la línea del agua. Con `id` por
  parámetro en el `clipPath`, porque la ficha y la escena pueden estar en la misma página.
- **Cada intención, su transformación.** Mecerse y abrirse son dos `rotate`; sumados en uno, nadie
  puede leer cuánto está abierto el bote.
- **Dibujá la pieza en la pose que importa.** El brazo del polizón está dibujado con el dedo en la
  boca; al revés, el dedo nunca llegaba.

## 7. Cómo se mira

- **Cuatro vistas**: de cerca, el recinto entero, el tramo del camino (para ver que no flota) y **la
  tira de seis cuadros del toque**, armada con la conducta y no con poses a mano. En la tira aparecen
  las piezas que se separan y los cuadros feos del medio.
- **Elegí los seis tiempos para mostrar el defecto, no para esconderlo.** El hueco del borrego y la
  cabeza cortada estaban los dos en la bajada, el tramo que uno mira menos. Poné siempre un cuadro en
  la vuelta a la pose quieta.
- **Lo que dura menos que el hueco entre dos cuadros no existe.** La peluca saltaba 0,3 s y no salía
  en ninguna tira; en un teléfono, tampoco.
- **Imprimí y mirá con la mitad hecha.** La mudanza de la liebre salió con el arte y el rig, antes de
  la conducta.
- **El que dibuja no ve lo que quiso dibujar.** Los cinco arreglos de la segunda vuelta los vio
  alguien que no las dibujó. Por eso una bestia se cierra con una auditoría ajena sobre capturas, y
  quien la construyó deja su propio top 5 para la vuelta siguiente (`bestiario-inmersion.md` §12).

## 8. Para mejorar las que ya están

Las mismas varas sirven para volver sobre el elenco viejo. Por dónde empezar con una bestia hecha:

- **Pasala por la tira de seis cuadros** si nunca la tuvo: es donde aparecen los cogotes abiertos,
  lo que cuelga parado y las piezas que se despegan.
- **Mirala en su recinto con las capas de adelante**, a 430×860: ¿algo fijo le cruza la cara? ¿La
  tapa un vecino que se sumó después?
- **Hacé la prueba del nombre tapado**: ¿se entiende qué es sin leer la ficha? Si no, falta el color
  o el objeto que lo nombra.
- **Buscá el mejor detalle de su letra**: ¿se ve quieto o solo al tocarla?
- **Mirá si lo que hace sola puede fallar.** Una bestia que solo respira es decorado.
- **Pendientes que dejó esta vuelta**: los vecinos que reaccionan al toque ajeno (que el pibe mire a
  la rana cuando croa, que el cordero se asuste con el borrego, que el lobo asome cuando la liebre se
  pone tiesa), sumar el elenco a `scripts/bestiario/mirada.ts` cuando esté en la rama, y darles filo de
  luz (el faro-ojo del taxi y los ojos del polizón son los que más lo piden).

---

Si algo de acá te queda chico o te frena una buena idea, rompelo y contá por qué en la enmienda de
`D-73`. Si lo que aprendiste vale para la próxima, sumalo acá con su caso.
