# UX-21 — El interruptor de cinta

> Rol dueño: `experiencia`. `T-190`, ciclo 11, frente D.
>
> **Consumo** — leído entero para escribir esto, no citado de memoria:
> `Docs/ORQ/ORQ-plan-ciclo-11.md` (frente D, la fila de `T-190`, los tres candados
> declarados: *"apagado por defecto, sin archivo, y mudo cuando el juego suena"*);
> `Docs/ARQ/ARQ-cama-de-cinta.md` (`ADR-04` entero — el grafo, los cuatro estados de
> `EstadoCinta`, quién es dueño del `AudioContext`, la política de autoreproducción de
> `ADR-04.4`, la clave `arcade.cinta` de `ADR-04.5`, el contrato de `src/lib/sitio/cinta.ts`
> de `ADR-04.6`, el apagado de emergencia de `ADR-04.7`, y `ADR-04.8` sobre
> `prefers-reduced-motion`); `Docs/SUGERENCIAS/ARQ-para-experiencia-estados-de-la-cinta.md`
> (la propuesta de redacción que `arquitectura` me dejó, y las dos preguntas abiertas: el
> iPhone en silencio y la relación con `UX-03`); `Docs/UX/UX-20-el-sitio-como-lugar.md`
> (la doctrina vigente de este ciclo — la obedezco entera: los cuatro límites de su `§1`,
> lo que nunca se mueve de su `§3`, y su `§6` sobre qué es un fallo); `Docs/UX/UX-03-reveal-audio-sin-auriculares.md`
> (el aviso de "se juega mejor con sonido" y el ícono de volumen ya alcanzable con el
> pulgar en la entrada del juego 2); `.claude/rules/diseno-marca.md` (la tabla de tics
> vetados por nombre: pastilla cápsula, ícono de librería, altavoz tachado genérico —
> los tres prohibidos explícitamente para esta pieza en el encargo);
> `.claude/rules/voz-ricotera.md` (los tres registros, la regla de las dos líneas de su
> `§5`, y las siete reglas que audita `src/lib/voz.test.ts`); `Docs/DECISIONES.md` `D-09`
> y `D-14` (molinetes abiertos, jugable con el pulgar, sin muro de entrada); y el código:
> `src/pages/index.astro` (el portal no tiene `cabecera-sitio`, verificado leyendo el
> archivo entero), `src/layouts/Base.astro:93-101` (`cabecera-sitio` solo se pinta si
> hay `volverA` — hoy ausente en el portal), `src/styles/sitio.css:172-205` (`.cabecera-sitio`,
> `.volver`, `.marca-chica`), `sitio.css:385-396` (`.casete-accion`, el sello de goma que
> ya existe: *"rectángulo de borde fino, mayúsculas rotuladas, apenas torcido — nunca la
> pastilla cápsula genérica"*), `sitio.css:398-413` (`.casete--pronto`/`.casete-pronto`,
> el borde punteado para "esto no está disponible ahora"), `src/styles/tokens.css:190`
> (`--toque-min: 48px`), `tokens.css:61-66` (`--acento-3`, `--acento-4`,
> `--rotulo-leyenda`, `--rotulo-testimonio`).
>
> **Resuelve:** `T-190`. Dónde vive el interruptor, qué forma tiene, qué dice en cada uno
> de los cuatro estados de `EstadoCinta`, cómo se distingue sin depender solo del color,
> por qué arranca apagado, y cómo convive con `UX-03`. **No resuelve:** el motor de audio
> (`ADR-04`, cerrado), ni la construcción (`T-191`, hilo principal), ni el texto final
> palabra por palabra si `contenido` quiere afinarlo — dejo la redacción completa y
> compatible con `voz.test.ts`, no un placeholder.

## Cómo leer este documento

No hay ninguna ficha `RES-XX` de por medio: esto no es sobre la obra de la banda, es
sobre un control de interfaz. Todo acá es **criterio propio de `experiencia`**, apoyado
en tres cosas verificables: las decisiones ya cerradas (`D-09`, `D-14`, `ADR-04`), el
código real (citado con archivo y línea), y la doctrina de `UX-20`, que este documento
obedece sin reabrir — donde `UX-20` ya dice "esto no se mueve", acá no se mueve.

---

## 0. El nombre de la pieza

**Se llama "la cinta", y se la prende o se la apaga.** No "sonido ambiente" (vocabulario
de folleto de producto), no "modo inmersivo" (la palabra que el pedido del usuario usó
para encargar el ciclo, no la que usa el sitio para hablarle a la gente), no "audio de
fondo" (describe dónde vive el sonido en la mezcla, no qué es en el mundo del sitio).

`ADR-04` ya bautizó el módulo (`src/lib/sitio/cinta.ts`), la clave de `localStorage`
(`arcade.cinta`) y el tipo (`EstadoCinta`) con este nombre. No hay una segunda decisión
que tomar acá: **la cinta es la cinta**, la misma que ya está pegada con cinta adhesiva a
cada casete del portal (`sitio.css:305-315`) y la misma metáfora que sostiene "lado A",
"lado B" y "grabado en casa" (`index.astro:4-11`). Ponerle un nombre de producto la
sacaría del mundo que el resto del sitio ya construyó.

---

## 1. Dónde vive

**En la cabecera de todas las pantallas, siempre en el mismo lugar — la portada
incluida.** No es una elección entre las tres opciones que ofrece el encargo: es que dos
de las tres (solo portada, o solo cabecera del resto) rompen algo que ya está decidido en
otro documento.

### Por qué no alcanza con la portada

`ADR-04.4` es explícito: *"ese control tiene que ser alcanzable con el pulgar y estar
donde la persona esté, no en un menú."* Y `D-10` ya había fijado el motivo de fondo: **la
mayoría de las visitas no entran por la portada.** El sitio se difunde por Twitter y por
links de amigos, casetes compartidos apuntan directo a un juego, y `US-02`/`US-03`/`US-04`
tienen entrada propia sin pasar por `/`. Un interruptor que solo viviera en `index.astro`
sería una pieza que la mayoría de las sesiones de dos o tres minutos **nunca llegaría a
ver**. Eso no rompe ningún molinete —nadie necesita la cinta para jugar—, pero sí
desperdicia el trabajo entero de `ADR-04`: una atmósfera que casi nadie encuentra la
puerta para prender.

### Por qué no alcanza con "la cabecera del resto" y la portada se queda afuera

Hoy es asimétrico, y no por diseño sino por historia del código: `Base.astro:93-101`
pinta `.cabecera-sitio` **solo si la página recibe `volverA`**, y `index.astro` no lo
recibe — es la raíz, no vuelve a ningún lado. Eso significa que, tal como está, `.volver`
y `.marca-chica` viven en nueve pantallas y faltan en una sola, que es justo la que más
gente ve primero. Dejar la cinta afuera de esa única pantalla sería raro además de
inconsistente: es donde más manos van a estar tocando cosas, y es el lugar de menor
compromiso de sesión, el ideal para probar el interruptor sin costo.

**Decisión:** el portal gana una franja equivalente a `.cabecera-sitio` — sin `.volver`
(no hay a dónde volver desde la raíz), con `.marca-chica` opcional o ausente (la marca ya
está gigante en `.marca-grande`, repetirla es ruido), y con el interruptor en la misma
esquina donde vive en cualquier otra pantalla. Es una línea de maquetado nueva en
`index.astro`, no una pantalla nueva ni un concepto nuevo: mismo componente, mismo lugar
relativo, coherente con que el pulgar aprenda una sola posición para toda la sesión.

### Por qué la esquina superior, y por qué eso no compite con la acción principal

`.volver` y `.marca-chica` ya viven arriba, fuera de la zona de descanso del pulgar donde
`UX-20 §1.3` exige tocabilidad de **0 ms** para la acción principal de cada pantalla
(`JUGÁ`, una opción del quiz, el botón `EMPEZAR`). La cinta se suma a ese mismo renglón,
no al área de juego. Esto no es una concesión a la comodidad: es la misma separación que
ya funciona hoy entre "navegación secundaria" (arriba, alcanzable con estiramiento del
pulgar, tocada pocas veces por sesión) y "acción de la partida" (abajo, en la zona de
descanso, tocada muchas veces por sesión). La cinta se toca **una vez por sesión, si
acaso** — pertenece arriba por frecuencia de uso, no solo por espacio disponible.

**Con `--toque-min: 48px` como piso no negociable** (`tokens.css:190`, ya usado por
`.volver`, `.casete`, `.tarjeta-articulo`, `.vea-tambien a`): el interruptor nunca baja de
48×48 px de área de toque, exista o no exista espacio visual para that. A 320 px de
ancho, si los tres elementos de la cabecera (`.volver`, `.marca-chica`, interruptor) no
entran en un renglón sin apretarse, **el que cede el renglón propio es el interruptor**,
nunca `.volver` (es la salida de la pantalla) ni `.marca-chica` (es la identidad,
ya reducida a 8ch). Es una decisión de prioridad para quien construya, no una preferencia
estética.

### Lo que queda explícitamente afuera de este ciclo

`quiz.astro` no pasa por `Base.astro` y `T-182` ya lo dejó fuera de la gramática de
tránsito de este ciclo hasta que cierre `T-167` del ciclo 10. La cinta no aparece ahí
todavía. No es un olvido: es el mismo límite de alcance que `UX-20` ya declaró para esa
pantalla, aplicado acá.

---

## 2. Qué forma tiene

**Adopto la propuesta del hilo principal, con la forma exacta que la hace legítima y no
un ícono con otro disfraz: un sello de goma — el mismo objeto que ya existe en
`.casete-accion` (`sitio.css:385-396`) — con el símbolo de una cabeza de reproducción
adentro, nunca un ícono de librería, nunca una pastilla, nunca un altavoz tachado.**

### Por qué es legítimo, y no una excepción a la regla de `diseno-marca.md`

La tabla de tics vetados nombra tres cosas por nombre, y las tres se evitan por
construcción, no por promesa:

| Vetado por `diseno-marca.md` | Qué construyo en su lugar |
|---|---|
| Pastilla cápsula (`border-radius: 999px`) | El mismo rectángulo de esquina casi viva (`--radio: 4px` o 3px de estampa, `tokens.css:200`) que ya usa `.casete-accion` — cero círculo, cero óvalo |
| Ícono de librería como decoración de UI | Ningún sprite importado. El símbolo es un glifo tipográfico —igual origen que ✔ ✕ ◆ ❝, que `diseno-marca.md` ya declara "símbolos funcionales testeados [que] no son decoración y se quedan"— renderizado en `--fuente-rotulada`, no un ícono de Font Awesome o Material. La diferencia no es de forma, es de procedencia: uno viene del alfabeto, el otro de un paquete de terceros |
| Altavoz tachado genérico | No hay parlante en ningún estado. No hay una sola barra diagonal de "mute". El símbolo es un triángulo — la cabeza de reproducción de una cinta, no un ícono de sonido apagado |

### Por qué el triángulo y no otra cosa

El sitio entero ya se presenta como un cassette grabado en casa: "lado A", "lado B",
cinta adhesiva pegando cada casete al collage (`index.astro:4-11`). El triángulo de
reproducción **es el objeto que ya vive en ese mundo** — no una metáfora nueva que hay
que instalar, es la pieza que faltaba en un aparato que el sitio entero ya dibuja. Usarlo
acá es la misma jugada que ya hizo el proyecto con la mosca, las banderas y el perro
(`UX-12`): tomar algo del propio universo en vez de importar un ícono de afuera.

### Por qué es tipografía y CSS, no un archivo nuevo

`ADR-04` construye toda la cama de cinta bajo un candado explícito: **cero archivos, cero
peso** (`ADR-04`, candado 2). Que el control que prende esa promesa sea una imagen nueva
—un SVG que hay que producir, con su propio ciclo de "el usuario decide cómo se
produce"— rompería la lógica de la propia pieza: la cinta no pesa nada, pero encenderla
pesaría un archivo. **Decisión: el símbolo se resuelve con tipografía y borde, igual que
`.casete-accion`**, que hoy no tiene una sola imagen adentro. Cero producción de arte
nueva, cero bloqueo esperando al usuario (`D-04`), disponible desde que alguien lo
construya.

### El boceto — cuatro estampas, un solo molde

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌ ─ ─ ─ ─ ─ ─ ┐
│  ▷ APAGADA   │   │  ▶ SONANDO   │   │  ❚❚ CALLADA  │   │ ▷  BLOQUEADA│
└──────────────┘   └──────────────┘   └──────────────┘   └ ─ ─ ─ ─ ─ ─ ┘
  borde sólido       borde sólido       borde sólido        borde punteado
  triángulo hueco     triángulo lleno    barras llenas       (`.casete-pronto`,
                                                               ya existe)
```

Mismo rectángulo, mismo tipo de letra, apenas torcido como cualquier estampa del sitio
— lo que cambia entre los cuatro es lo que dice la sección 3 y la forma del símbolo que
describe la sección 4, nunca el molde.

### De qué color — y por qué de ninguno de disco

`.volver` y `.marca-chica` (`sitio.css:180-205`) no llevan `--tinte` de ningún disco: son
navegación de base, la misma en cualquier sección. La cinta es exactamente esa misma
categoría — vive en la cabecera, no en el cuerpo de la pantalla que sí viste su disco
(`D-19`) — así que va en los mismos tokens neutros que ya usan sus vecinos de renglón
(`--borde`, `--texto-tenue`, `--papel`), nunca en un `--cat-*`. Es también la lectura
correcta de la alternativa que `ADR-04` ya descartó por su cuenta: *"que la cama cambie
con el disco de cada sección [...] la mezcla rota el acento y la letra, no la base, y la
cama es base."* Si la cama es base, su interruptor también.

---

## 3. Qué dice — los cuatro estados

`ADR-04.6` fija cuatro valores de `EstadoCinta` y ninguno más. Acá van los cuatro textos,
en **registro 3** (seco, sin puntos suspensivos, sin infinitivo, ninguno pasa las ocho
palabras) porque este control no es un botón de arranque que invita a algo nuevo — es un
**rótulo de estado**, como `LEYENDA` o `TESTIMONIO`: dice honestamente qué hay adentro y
se calla. La estampa de un aparato de cinta real tampoco dice "presioná para grabar":
dice `REC`.

| Estado | Texto en la estampa (registro 3) | Palabras | Cuándo |
|---|---|---|---|
| `apagada` | **`CINTA APAGADA`** | 2 | siempre en la primera visita, y cuando alguien la apaga |
| `sonando` | **`CINTA SONANDO`** | 2 | prendida y audible |
| `callada` | **`CINTA CALLADA`** | 2 | prendida, pero hay un fragmento o el tema completo sonando |
| `bloqueada` | **`CINTA BLOQUEADA`** | 2 | se intentó prender y el navegador no dejó |

Cuatro palabras compartidas ("CINTA" + un participio), la misma estructura en las
cuatro, para que el estado se lea de un vistazo sin tener que memorizar cuatro frases
distintas — es la misma economía que ya usa el sitio en `.casete-pronto` ("EN LA COCINA")
y en los rótulos de la Redondopedia.

### La única excepción: una línea más para `bloqueada`

`CINTA BLOQUEADA` sola no explica **por qué** — a diferencia de `CALLADA`, que tiene una
pista sensorial inmediata (se está escuchando otra cosa en ese mismo momento), bloqueada
no tiene ninguna señal que la explique. Sin una palabra más, se lee como que el sitio se
rompió. Debajo de la estampa, en tipografía chica, la misma línea que ya venía en la
propuesta de `arquitectura` y que cumple el registro:

> **`El navegador no la deja sonar acá`** (7 palabras, sin infinitivo, sin puntos
> suspensivos)

No dice "probá desde otro navegador" ni culpa a nadie: nombra el hecho y se detiene, como
manda `.claude/rules/voz-ricotera.md §5` para el registro que rotula.

### El nombre accesible: la única línea con verbo, y va en voseo

`D-17` no le pide verbo a todo lo que se toca (`.marca-chica` dice "ARCADE RICOTERO", no
un verbo, y es un enlace tocable) — le pide que, **cuando hay un verbo, sea voseo y nunca
infinitivo**. La estampa nombra un estado; el nombre accesible (`aria-label`, lo único que
lee un lector de pantalla además del texto visible) nombra la acción que ese toque
dispara, y ahí sí corresponde el voseo:

| Estado visible | `aria-label` | Qué hace el toque |
|---|---|---|
| `apagada` | **`Prendé la cinta`** | intenta prenderla |
| `sonando` / `callada` | **`Apagá la cinta`** | la apaga, aunque esté sonando en ese instante o callada por un fragmento |
| `bloqueada` | **`Prendé la cinta`** | intenta de nuevo — ver `§3.1` |

### `§3.1` — bloqueada no es un final, es un gesto nuevo cada vez

`ADR-04.4` prohíbe que el **módulo** reintente solo o deje un escucha armado para el
próximo toque en cualquier otro lado de la pantalla — es la política de autoreproducción,
y no se toca. Pero un segundo toque **sobre el propio interruptor** es un gesto explícito
nuevo de la persona, no un reintento automático: **decisión de `experiencia`, no
contradice `ADR-04`**. Un interruptor que queda muerto para siempre después de un
bloqueo —sin más señal que "bloqueada" clavada en la pantalla— es peor que uno que
vuelve a intentarlo si se lo tocan de nuevo. `D-14`: nada se le niega a nadie por no
haber podido la primera vez.

Estas ocho cadenas —cuatro estampas, una línea de contexto, tres nombres accesibles—
tienen que vivir en un `copy.ts` (ver `§6`), nunca escritas a mano dentro de
`src/lib/sitio/cinta.ts`: es exactamente el defecto que `voz.test.ts` ya documenta haber
atrapado dos veces (`"Link copiado."` con anglicismo, tres ciclos en producción; el
`placeholder` y el `aria-label` de `US-07` sin auditar), y esta pieza tiene ocho
oportunidades de repetirlo.

---

## 4. Cómo se sabe que está prendida sin usar solo el color

Tres señales independientes, ninguna es el color solo:

1. **La palabra cambia.** `APAGADA` / `SONANDO` / `CALLADA` / `BLOQUEADA` son cuatro
   palabras distintas, no la misma palabra en cuatro tintes. Alguien con daltonismo o con
   la pantalla en blanco y negro forzado lee exactamente lo mismo que cualquiera.
2. **El símbolo cambia de forma, no solo de color.** Triángulo hueco (apagada/bloqueada)
   contra triángulo lleno (sonando) contra dos barras llenas (callada) — tres siluetas
   distintas, no la misma silueta rellena con tres tintas.
3. **El borde cambia de trazo.** Sólido para los tres estados donde el sitio puede actuar
   con normalidad; punteado —el mismo que ya usa `.casete-pronto`— únicamente para
   `bloqueada`, donde algo quedó a mitad de camino.

Y una cuarta, que no es visual: **`aria-pressed`** en el elemento (`true` cuando
`sonando`/`callada`, `false` cuando `apagada`/`bloqueada`) para que un lector de pantalla
anuncie el estado sin depender de que alguien lea la palabra en la estampa. El foco por
teclado reusa el mismo tratamiento que ya tiene `.casete:focus-visible`
(`outline: var(--linea) solid var(--acento-2)`, `sitio.css:317-320`) — ningún token
nuevo, ningún par de contraste nuevo que auditar.

**Lo que el símbolo nunca hace, bajo ningún estado: moverse.** `UX-20 §3.2` es taxativa
—`--acento-3`/`--acento-4` "nunca entran con fade, nunca tienen parallax"— y esta pieza
no es un estado de acierto o error, pero el criterio es el mismo: un triángulo que
pulsa, titila o gira mientras la cinta suena sería exactamente "un elemento clickeable
[con] su propia animación [...] que ningún otro elemento de la pantalla comparte" —
el primer síntoma de fallo que `UX-20 §6` nombra por punto uno. La diferencia entre
`sonando` y `apagada` es de **palabra y de forma**, nunca de movimiento. Esto también
resuelve solo el paso por `prefers-reduced-motion`: no hay nada que apagar, porque nunca
hubo nada animado (`ADR-04.8` ya lo dice desde el lado del audio — "esa consulta no dice
nada sobre el sonido"; acá lo digo desde el lado del pixel).

---

## 5. Por qué apagada es el default

No es cautela. Es el mismo principio que `D-14` nombró para la entrada al sitio, aplicado
al oído en vez de a la puerta.

**Los molinetes abiertos son de ida y de vuelta.** `D-14` dice que nadie tiene que traer
algo para entrar —ni cuenta, ni login, ni Premium, ni saber lo suficiente—. Lo que esta
pieza agrega, porque es la primera vez que el sitio quiere sumar algo que la persona no
pidió, es la mitad que faltaba escribir: **tampoco nadie tiene que sacarse algo de encima
para entrar.** Un sitio que arranca haciendo ruido sin permiso le exige a la persona una
acción activa —bajar el volumen del teléfono, sacarse un auricular, cerrar la pestaña— antes
de poder usarlo con tranquilidad. Eso es un molinete con la forma de un altavoz en vez de
la forma de un login, y es exactamente el mismo daño que `D-14` ya identificó y prohibió
por nombre para todo lo demás.

**Y hay un motivo de uso, no solo de principio.** El brief que sostiene `UX-03` describe
a quien juega así: *"lo abre solo, en un rato muerto, posiblemente sin auriculares"* — en
el colectivo, en la sala de espera, con el teléfono en modo silencio no siempre
respetado por el navegador. Un sitio que arranca sonando en ese contexto no suma
inmersión: suma la razón número uno por la que alguien cierra la pestaña antes de leer
qué es. `ADR-04` lo escribe en su tabla de alternativas descartadas: *"prendida por
defecto [...] es la razón número uno por la que alguien cierra una pestaña. Un sitio que
hace ruido sin permiso le pide algo a la gente antes de dejarla entrar."*

**Molinetes, la comprobación concreta:** apagá la cinta, o no la toques nunca. El sitio
es exactamente el mismo. Ningún juego cambia su mecánica, ningún puntaje depende de
haberla escuchado, ninguna pantalla explica menos. Es la aplicación literal del candado 4
de `ADR-04` ("la cama no lleva información") al terreno de la experiencia: apagarla no
cuesta nada porque nunca prometió nada.

---

## 6. Qué pasa con `UX-03`

Las dos piezas conviven sin pisarse porque resuelven problemas distintos, y conviene
decirlo así de directo porque a primera vista se parecen (las dos son avisos sobre
sonido, las dos están cerca del botón de entrada a un juego):

| | `UX-03` | La cinta (`UX-21`) |
|---|---|---|
| Qué sonido cubre | El fragmento del reveal — el corazón mecánico de `US-02` | Un ruido ambiental que no mide nada |
| Qué pasa si no se oye | El jugador pierde información real: no puede reconocer el tema de oído. Por eso `UX-03` **avisa antes de arrancar la partida**, explícito, como pide el criterio de `US-02` | Nada. La partida es idéntica con o sin ella |
| Dónde vive el aviso | En la pantalla de entrada del juego 2, siempre visible, sin bloquear el tap en `EMPEZAR` | En la cabecera, en cualquier pantalla, tocable o ignorable |

**Lo que no cambia:** la línea de `UX-03` (*"se juega mejor con sonido — igual podés
arrancar sin auriculares"*) y el ícono de volumen que ya vive junto a `EMPEZAR` en la
entrada del juego 2 **siguen exactamente iguales**. La cinta no los reemplaza ni los
vuelve redundantes: son dos capas de sonido distintas y las dos pueden estar mudas al
mismo tiempo por razones distintas (auriculares no puestos vs. cinta nunca prendida).

**Lo que sí cambia, y es una ganancia silenciosa:** si la persona prendió la cinta en
cualquier pantalla anterior, el gesto que la prendió ya destrabó el `AudioContext`
compartido (`ADR-04.2`) — el mismo que el juego 2 necesita para el fragmento. Cuando
entra a "Adiviná el tema" con la cinta ya sonando, **`EMPEZAR` ya no tiene que despertar
nada por primera vez**: el reveal arranca sobre un contexto que ya está `running`. Esto
no lo construye esta pieza —lo construye `T-191` siguiendo `ADR-04.2`— pero es la razón
por la que vale la pena que la cinta esté disponible antes de llegar al juego, no solo
adentro de él.

**Y el instante exacto del cruce:** apenas el primer paso del reveal empieza a sonar, el
oído 1 de `ADR-04.3` calla la cinta en 20 ms — antes de que el escalón de 0,1 s termine
de sonar. La persona no tiene que hacer nada para que las dos capas no se pisen; es
automático y está resuelto en la capa de audio, no en la pantalla (`§7` explica qué ve el
interruptor mientras tanto).

---

## 7. La pantalla de un juego con audio: la cama se calla, el interruptor se queda

**Se muestra, en su estado `callada`. Nunca se esconde, nunca se atenúa más allá de lo
que el propio estado `callada` ya comunica con su símbolo y su palabra.**

Dos razones, y las dos vienen de otro documento que ya resolvió el mismo problema:

1. **Esconderlo sería peor que dejarlo.** `ADR-04.6` lo dice con toda claridad: *"si la
   cama se calla sola y el interruptor sigue diciendo prendida, la persona toca el
   interruptor pensando que se rompió."* Si en cambio el interruptor desaparece por
   completo mientras el juego suena, el problema no se resuelve, se esconde: la persona
   que quiere apagar la cinta —por ejemplo, porque va a mostrarle el resultado a alguien
   y no quiere que el bombo compita con la explicación en voz alta— no encuentra el
   control justo cuando más lo necesita.
2. **Atenuar de más rompe la señal de `§4`.** Un interruptor con opacidad reducida al
   punto de no leerse bien no es "una versión discreta de sí mismo", es un estado quinto
   sin nombre. Los cuatro estados de `EstadoCinta` son los únicos que existen; inventar un
   quinto look visual para "callada, pero además apagado a medias" contradice la lista
   cerrada de `ADR-04.6` sin necesidad.

**Lo que sí pasa, y es la aplicación de `§4` a este caso puntual:** la estampa muestra
`❚❚ CALLADA` con su borde sólido normal — ni más grande, ni más chica, ni más pálida que
en cualquier otro estado. Tocarla apaga la cinta entera (no "la reanuda para después"):
es la fila `sonando / callada → Apagá la cinta` de la tabla del `§3`. No hay una acción
separada para "saltear el silencio de este ítem": la única palanca que el interruptor
ofrece es prendida/apagada, nunca "pausada por mí" contra "pausada por el sistema" — esa
distinción no le importa a la persona que juega, y agregarla sería una decisión nueva
sin necesidad, justo lo que este documento evita en cada punto.

---

## 8. Lo que dejo para quien construye

- **Las ocho cadenas del `§3` van en un `copy.ts`**, no escritas a mano dentro de
  `src/lib/sitio/cinta.ts` ni en ningún script de isla. Sugiero que vivan en
  `src/lib/sitio/copy.ts` (junto a `PORTAL`, que ya es donde vive el resto del texto del
  cascarón) bajo una clave nueva, por ejemplo `CINTA`, para que `voz.test.ts` las
  encuentre igual que encuentra el resto de `sitio.copy.ts` — el propio archivo del test
  ya recorre ese módulo entero (`voz.test.ts:5`, `MODULOS`).
- **El elemento es un `<button type="button">`**, no un enlace: no navega a ningún lado.
  Lleva `aria-pressed` (`§4`) y `aria-label` (`§3`) generados desde `copy.ts`, nunca con
  `setAttribute` a mano — es exactamente el patrón que `voz.test.ts` ya audita y que
  rompió dos veces antes de esta pieza.
- **`data-estado`** con los cuatro valores literales de `EstadoCinta` (`'apagada'`,
  `'sonando'`, `'callada'`, `'bloqueada'`) para que el CSS pinte cada estampa sin lógica
  duplicada en JavaScript.
- **Si `CAMA_HABILITADA` es `false`** (`ADR-04.7`), el botón no se pinta — cero hueco
  vacío en la cabecera, el layout de dos elementos (`.volver` + `.marca-chica`) se
  acomoda solo, igual que hoy cuando no hay `tapas` que acreditar en el pie.
- **Ningún token de movimiento nuevo**: esta pieza no necesita ni `--duracion-toque` ni
  ninguno de los nombres que cataloga `UX-20 §4` — no tiene transición propia más allá de
  la que ya comparte cualquier borde/fondo tocable del sitio (`--duracion-toque`, si
  `T-177` ya la definió para cuando esto se construya; si no, sin transición y en paz).

## Bloqueos que dejo anotados

- **El iPhone en silencio** (la pregunta que `arquitectura` me dejó explícitamente
  abierta en `Docs/SUGERENCIAS/ARQ-para-experiencia-estados-de-la-cinta.md`): no hay
  forma de detectarlo, así que el interruptor **no intenta resolverlo**. Puede decir
  `SONANDO` y no sonar nada si la llave lateral está puesta — el mismo límite que ya
  tiene el aviso de `partida-tema.ts:161-183` para el reveal, y esta pieza no promete
  más de lo que esa ya promete. No agrego un segundo aviso: sería redundante y el sitio
  ya tiene uno para ese problema exacto.
- **Producir el símbolo final** (tipografía + CSS, sin archivo nuevo, `§2`) es del hilo
  principal en `T-191`; esta ficha da la especificación completa, no el CSS.
- **La afinación de `voz.test.ts` con las ocho cadenas nuevas** la corre quien construye
  (`D-12`): acá dejo el texto ya revisado contra las siete reglas de `.claude/rules/voz-ricotera.md §8`
  a mano, pero la corrida real es de `T-191` o de `revisor`.

---

## Cómo se verifica

Nada de esta hoja es código, así que no hay comando propio. Lo que sí es corrible, y
queda para quien construya (`D-12`):

- **Las ocho cadenas del `§3` pasan `node --test src/lib/voz.test.ts`** una vez que vivan
  en `copy.ts` — en particular la prueba de infinitivo (ninguna arranca con un verbo de
  la lista prohibida: "Prendé"/"Apagá" son imperativo, no infinitivo), la de puntos
  suspensivos (ninguna los usa) y la de ocho palabras (la más larga, la línea de
  contexto de `bloqueada`, tiene 7).
- **`§1` (dónde vive):** a 320, 375 y 1280 px, el interruptor es tocable con el pulgar sin
  invadir la zona de descanso donde vive la acción principal de cada pantalla, y aparece
  en el portal igual que en cualquier otra página que pase por `Base.astro`.
- **`§4` (sin depender solo del color):** con la pantalla en escala de grises forzada
  (herramienta de accesibilidad del propio navegador), los cuatro estados siguen siendo
  distinguibles por palabra y por forma de símbolo.
- **`§4`, la prueba de movimiento:** con `prefers-reduced-motion: reduce` activo, la
  estampa en estado `sonando` se ve exactamente igual, cuadro por cuadro, que con el
  movimiento normal — porque nunca tuvo nada animado que apagar. Es el mismo tipo de
  prueba que `UX-20 §5` ya pide para las tres pantallas de registro 3, aplicada acá.
- **`§6` (con `UX-03`):** jugar una vuelta completa de "Adiviná el tema" con la cinta
  prendida — el escalón de 0,1 s tiene que sonar exactamente igual que con la cinta
  apagada (ya es un caso de prueba manual de `ADR-04`, punto 2 de su cierre), y el aviso
  de `UX-03` sigue apareciendo sin que la cinta lo tape ni lo reemplace.
- **`§7` (la pantalla de un juego):** entrar a cualquiera de los cinco juegos con la
  cinta prendida y disparar un sonido del juego (un reveal, el tema completo al
  revelar): la estampa cambia a `CALLADA` sola, sin que nadie la haya tocado, y sigue
  siendo tocable — tocarla la apaga.
