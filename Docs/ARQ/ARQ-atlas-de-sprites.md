# ARQ — El atlas de sprites: cómo se recorta la hoja y qué sale de ahí

> Rol dueño: `arquitectura`. **Produce: `CTR-15`** (`CTR-15.1` … `CTR-15.8`).
>
> **Consume:** `D-18`, `D-19`, `D-38`, `D-41`, `D-42`, **`D-43`**, `ADR-08`
> (`ARQ-motor-de-juego.md`), `CTR-16`, `IDEA-14`, `RES-64.3`, `RES-64.5` (`INV-60`),
> **`UX-27` (§2 la grilla, §4 la paleta, §5 el contraste, §6 el recorte), `UX-28 §3` (el
> estado de espera), `UX-29 §7` (que no hay derrota que dibujar)**, **`REV-14`** (`FIND-55`,
> `FIND-56`, `FIND-60`), **`ORQ-plan-ciclo-15.md §1.1`** (la hoja medida con `sharp`),
> `public/arte/README.md`, `public/arte/ensayo/README.md`,
> `.claude/rules/diseno-marca.md`.
>
> **Medido sobre el archivo el 2026-09-16:** `public/arte/skayboy_poligirl.png`, 1299×725,
> RGBA con **el alfa lleno** —el fondo verde azulado es píxel opaco, no transparencia—, con
> los rótulos pegados adentro de la imagen, las poses sin grilla y cada una con su tamaño.
>
> **Qué NO es:** no es el mapa sección→disco ni la convención de arte del sitio. `D-41`
> consecuencia 1 le dejó a `experiencia` escribir la convención del píxel al lado de la del
> recorte en `public/arte/README.md` (`UX-04`). Esto es lo de abajo de esa línea: el formato
> de archivo, la grilla, el alfa, dónde viven y cómo se versionan. Lo que se dibuja adentro
> del recuadro no es de `arquitectura`.
>
> Última actualización: 2026-09-16 (ciclo 15, primera versión, **enmendada el mismo día por
> `REV-14`**: `FIND-55` cambió la grilla de `CTR-15.3`, `FIND-60` el tope de paleta de
> `CTR-15.4`, `FIND-56` confirmó la carpeta de `CTR-15.5`, y la medición de
> `HILO-para-experiencia-y-arquitectura-la-hoja-no-se-corta-sola.md` corrigió `CTR-15.1` y
> `CTR-15.2`. Cada enmienda está marcada donde pasó).
>
> **Regla de escritura que nace de `FIND-55`: toda medida de píxel de este documento dice si
> es _nativa_ o _CSS_, en cada mención.** Este documento y `ARQ-motor-de-juego.md` escribían
> los dos "32 × 48" queriendo decir cosas distintas, y eso fue la mitad del choque.

---

## CTR-15 — Contrato del atlas de sprites

- **Fecha:** 2026-09-16
- **Estado:** **vigente, con un valor abierto que no es mío** (`CTR-15.2`: el módulo real del
  píxel de la hoja, que se mide con un comando, y qué hacer si no existe).
- **Para quién es:** para quien recorte la hoja; para el hilo principal, que carga el atlas
  en la isla; para `revisor`, que tiene que poder rechazar una pieza sin preguntarle nada a
  nadie.

---

### CTR-15.1 — Lo primero: la hoja que trajo el usuario es material de origen, no un atlas

Hay que decirlo antes que cualquier medida, porque de acá salen la mitad de las reglas de
abajo. `public/arte/skayboy_poligirl.png` **no se puede cargar como sprite**, y no por
gusto: por cuatro cosas medidas.

1. **El alfa está lleno.** El fondo verde azulado es píxel opaco. Cargada así, cada personaje
   viene adentro de un rectángulo de color.
2. **Los rótulos están pegados en la imagen.** Los cuatro globos que nombran rasgos y los
   pies de cada pose son parte del PNG. Un atlas con texto adentro dibujaría el texto.
3. **Las poses no están en grilla y cada una tiene su tamaño.** Un `sliceX`/`sliceY` sobre
   una grilla uniforme —que es como cualquier motor corta un atlas— no las encuentra.
4. **Dice "8-bit" y eso hay que verificarlo, no creerlo.** Un dibujo *con estética* de píxel
   no es lo mismo que un dibujo *sobre una grilla* de píxel. Si el borde de las figuras tiene
   antialias —píxeles intermedios entre la tinta y el fondo—, entonces la hoja no está sobre
   grilla, y **`image-rendering: pixelated` sobre una imagen sin grilla no da pixel art: da
   barro**. Es el riesgo número uno de todo este contrato y lo mide `CTR-15.2`. **Ya se
   midió, y el riesgo se cumplió: `N = 1`.** El detalle, con los números, está en `CTR-15.2`.

**Entonces la hoja es la lámina de origen.** Se queda donde está, no la referencia ninguna
página, y las piezas de producción son otras, en otra carpeta (`CTR-15.5`).

**Y hay una quinta, medida después de escribir esta sección, que cambia quién hace el
trabajo:** `Docs/SUGERENCIAS/HILO-para-experiencia-y-arquitectura-la-hoja-no-se-corta-sola.md`
midió la hoja con `sharp` y **la segmentación automática no la separa**. Los rótulos y sus
flechas puentean los sprites: la banda del personaje masculino sale como **una sola pieza de
1072 px** con los seis sprites, la guitarra y las dos cabezas fundidos. Se probó enmascarar
el relleno crema de las cajas y **no mejoró en absoluto**, porque las que puentean son las
flechas, oscuras, que caen dentro del rango de la tinta del dibujo.

> **Entonces este contrato no supone un recorte a máquina, y hay que decirlo con todas las
> letras porque `CTR-15.2` se leía como si lo supusiera:** de la hoja actual, **las cajas se
> recortan a mano**, una por una. Lo que sí es automático es lo de después — llevar a grilla,
> forzar el alfa, ajustar a la paleta, armar el atlas.

**La salida barata no es mía y está pedida:** que el usuario reexporte la hoja **sin
anotaciones** —sin cajas, sin flechas, sin títulos— e idealmente **ya en grilla y con fondo
transparente**, que es lo que un atlas quiere de verdad y lo que este contrato termina
pidiendo igual. Si eso llega, el recorte automático vuelve a servir y las catorce medidas a
mano no hay que escribirlas ni mantenerlas.

**Lo que la hoja trae, contado pose por pose** (para que `experiencia` y `producto` sepan qué
hay sin volver a abrirla): por personaje, quieto de frente 3/4, quieto de perfil, quieto
mirando a la derecha, corriendo a la derecha, saltando y cayendo. Más dos cabezas de perfil
del personaje masculino, una del femenino, y una guitarra suelta.

**Lo que NO trae, y hace falta:** ciclo de caminata de varios cuadros, y —la que ninguna
lista anterior nombró— **un estado visual para el personaje que está quieto**, que `D-40` y
`D-43` necesitan sí o sí: el que juega solo deja a uno parado y tiene que ver de un vistazo
cuál de los dos tiene el dedo encima. Eso no es una pose más: es información de estado, y no
se puede comunicar solo con color (`diseno-marca.md`). Va en
`Docs/SUGERENCIAS/ARQ-para-experiencia-el-recorte-de-la-hoja.md`, y **`UX-28 §3` ya lo
resolvió sin dibujar nada nuevo**: de frente es esperando, de perfil es en juego.

**Lo que esta lista decía y ya no dice: "animación de muerte".** `UX-29` decidió que acá no
se muere nadie, así que esa fila no falta — **no va**. Ver `CTR-15.7`.

---

### CTR-15.2 — El módulo del píxel: cómo se mide, y qué pasa si no hay

**Antes de recortar nada hay que saber de qué tamaño es el píxel de la hoja.** Es un número
entero `N`: cuántos píxeles del archivo ocupa un píxel del dibujo.

**Ojo con dónde se mide, que es lo que `CTR-15.1` acaba de corregir: se mide sobre el recorte
de un sprite, no sobre la hoja entera.** Los rótulos de la hoja son texto suavizado; si el
comando corre sobre el lienzo completo, ese texto le va a contestar `N = 1` aunque los
dibujos estén perfectamente sobre grilla, y la conclusión sería la contraria de la
verdadera. Se recorta una pose a mano, se mide ahí, y se confirma con una segunda pose del
otro personaje.

**Cómo se mide, y es corrible con lo que el repo ya tiene.** `sharp` está instalado como
dependencia transitiva de Astro (`node_modules/sharp/` verificado el 2026-09-16), y el
hallazgo del ensayo del 2026-09-11 —que `sharp` no puede rasterizar un SVG con
`feDisplacementMap` porque librsvg no lo implementa— **no aplica acá**: esto es un PNG y no
hay filtros SVG en el camino. Sobre un PNG, `sharp` sirve.

```js
// Para cada N de 8 a 1: achicar por N y volver a agrandar por N, las dos veces con
// vecino más cercano. Si el resultado es idéntico al original, la imagen está sobre una
// grilla de N. El N más grande que dé idéntico es el módulo.
const ida = await sharp(src).resize(w / N, h / N, { kernel: 'nearest' }).raw().toBuffer();
const vuelta = await sharp(ida, { raw: { width: w / N, height: h / N, channels: 4 } })
  .resize(w, h, { kernel: 'nearest' }).raw().toBuffer();
// idéntico = Buffer.compare(vuelta, original) === 0
```

**Los tres desenlaces, escritos antes de correrlo para que el resultado no se interprete:**

| Resultado | Qué significa | Qué se hace |
|---|---|---|
| Hay un `N ≥ 2` exacto | La hoja está sobre grilla y el dibujo está ampliado `N` veces | Se achica por `N` y **ese** es el tamaño nativo. Todo lo demás de este contrato corre normal |
| `N = 1` con antialias en los bordes | Es estética de píxel, no grilla de píxel | **La pieza se cuantiza**: se lleva a la celda de 16 × 24 nativos de `CTR-15.3` y el alfa se decide binario (`CTR-15.4`). No es un paso técnico, es dibujo, y tiene dueño |
| `N` distinto por personaje | Las poses se produjeron a escalas distintas | Cada pieza se normaliza a la celda de `CTR-15.3` **antes** de entrar al atlas. Nunca se escala en la carga |

#### El desenlace, ya no hipotético: **`N = 1`**

Se corrió, y el resultado está medido en `ORQ-plan-ciclo-15.md §1.1` (lectura de archivo, no
ficha `RES-`): **108.705 colores distintos**; con tolerancia ±10 cambian **1221 de 1298
columnas** y **679 de 724 filas**, y los bordes se reparten parejo en todas las fases de `N`
= 2, 3, 4, 5, 6, 8, 10, 12 y 16 (concentración 1,00× lo esperado, o sea ninguna). **Es el
desenlace 2 sin margen de duda: la hoja tiene estética de píxel y no está sobre grilla de
píxel.**

Los tres desenlaces estaban escritos antes de correrlo justamente para esto, así que no hay
nada que interpretar: **la pieza se cuantiza a la celda de 16 × 24 nativos, y cuantizar es
dibujo, no un paso técnico.** Los otros dos desenlaces quedan muertos y no se vuelven a
mirar.

**Lo que esto le cuesta al ciclo, dicho claro:** los sprites de producción hay que
**redibujarlos sobre la grilla**, no recortarlos. La hoja pasa a ser referencia de pose, de
insignia y de tono — que es muchísimo, y es lo caro del trabajo— pero no es la fuente de los
píxeles. Si el usuario reexporta en grilla (`CTR-15.1`), esto se cae y el circuito vuelve a
ser mecánico.

**No se recorta a ojo y no se escala con suavizado.** Cualquier remuestreo que no sea vecino
más cercano convierte un píxel en un degradado, y un degradado adentro del área de juego es
exactamente lo que `D-41` punto 1 y `diseno-marca.md` vetan.

---

### CTR-15.3 — La grilla: un tile de 16 nativos, una celda de 16 × 24 nativos

> **Enmendado el 2026-09-16 por `FIND-55` (`REV-14`).** Esta sección decía celda de **32 × 48
> px nativos** sobre un área de 416 × 192 nativos. **Manda `experiencia`** (`UX-27 §2`): el
> área es de **240 × 144 nativos**, 15 × 9 tiles, y la celda de personaje es de **16 × 24
> px nativos**, que a la escala ×2 del teléfono se ven como **32 × 48 px CSS**. Los dos
> documentos decían "32 × 48" y querían decir cosas distintas: el número que sobrevive es el
> de `UX-27`, y **es el mismo muñeco en pantalla** —32 × 48 px CSS— con la mitad de píxeles
> adentro. Lo que cambia de verdad es el detalle que entra en la figura, y esa es la razón
> por la que `§7` y `§8` de `UX-27` se escribieron pensando en 14 px de ancho de cuerpo.

| | Valor | Por qué |
|---|---|---|
| **Tile del mundo** | **16 × 16 px nativos** (32 × 32 px CSS a ×2) | Con la resolución lógica de `ADR-08.3` —240 × 144 nativos— da **15 × 9 tiles** de pantalla. El nivel entra entero, sin cámara que persiga, que es lo que deja jugar a dos personas mirando lo mismo (`D-40`) y lo que `UX-29 §7.1` necesita para que el nivel sea una sala cerrada |
| **Celda de personaje** | **16 × 24 px nativos** (1 × 1,5 tiles; **32 × 48 px CSS** a ×2) | `UX-27 §2`. La figura ocupa 14 × 22 nativos y queda 1 px nativo de aire a cada lado, para que el contorno de clave (`UX-27 §5.2`) no toque el borde de la celda |
| **Origen de la figura dentro de la celda** | **abajo y al centro** | El pie apoya en el borde inferior de la celda. Así la caja de colisión se deriva de la celda y no hay que declarar un desplazamiento por pose |
| **Caja de colisión** | **10 × 20 px nativos**, anclada abajo y al centro, **igual para los dos personajes** | Es paridad mecánica y no estética: si una caja es más chica que la otra, un personaje pasa por huecos que el otro no, y eso contradice lo que el propio sitio publica rotulado `hecho` sobre Carmen Castro. **Va en el contrato justamente porque es donde la desigualdad se cuela sin que se vea.** Los dos números salen de la celda nueva: **10 de ancho es menos que el tile de 16**, así que los dos pasan por un pasillo de un tile; **20 de alto deja fuera los 2 px de sombrero y de flequillo**, que son silueta y no cuerpo — si el sombrero chocara, Skayboy no entraría donde entra Poligirl |
| **Filas por atlas** | una por animación, columnas por cuadro | Grilla uniforme: el motor corta con `sliceX`/`sliceY` y no hace falta JSON para que la corte |

**El sombrero es el caso borde y hay que resolverlo acá, no en el dibujo.** Un sombrero de
ala ancha se sale de 16 px nativos de ancho. La celda **no crece**: el ala se dibuja adentro
de la celda y la figura se achica lo necesario. Una celda distinta por personaje rompe la
grilla uniforme, y una grilla uniforme es lo que hace que este atlas no necesite un JSON de
recuadros por pieza. Con la celda de `FIND-55` el ala queda todavía más apretada que antes,
y eso refuerza lo que `UX-27 §8.1` ya decidió por su lado: **a este tamaño un Panamá y un
fedora no se distinguen por la forma del ala, se distinguen por el color.**

---

### CTR-15.4 — El alfa y la paleta

- **El alfa es binario: 0 o 255. Nada en el medio.** Eso no se negocia y es lo mismo que dice
  `UX-27 §3`.
- **La regla de "se saca el fondo por coincidencia exacta de color" está muerta, y hay que
  decirlo acá porque era mía.** La medición de `ORQ-plan-ciclo-15.md §1.1` encontró que **el
  fondo no es un color**: un bloque de 40 × 40 de fondo liso trae **52 tintas distintas**
  alrededor de `rgb(23,110,119)`. Un umbral con tolerancia sí funciona, pero con tolerancia
  aparecen halos — que es exactamente lo que este contrato y `UX-27 §3` prohíben. **Entonces
  el alfa no sale de la hoja: sale del dibujo.** Con la pieza cuantizada a mano
  (`CTR-15.2`), el fondo no se "saca": nunca se dibuja. Es el mismo trabajo mirado del
  derecho.
- **Ni matting, ni pluma, ni "suavizar borde".** Un píxel está adentro o está afuera.
> **Enmendado el 2026-09-16 por `FIND-60` (`REV-14`).** Acá decía **"32 tintas por atlas"**,
> que con tres archivos daba hasta 96 tintas adentro del área; `UX-27 §4` dice **16 cerradas
> para toda el área**. **Manda `experiencia`: son 16**, y el auditor que `T-243` tiene que
> escribir se escribe contra ese número y ninguno otro. Además `UX-27 §4` contestó lo que
> este contrato había dejado abierto —dónde vive la lista y qué tintas son— y la respuesta
> obliga a cambiar la forma del JSON: **ver la tercera viñeta.**

- **La paleta es una sola para toda el área: las 16 tintas de `UX-27 §4`**, declaradas como
  `--px-*` en `src/styles/tokens.css`, fondo excluido. **No hay paleta por atlas.** Los dos
  personajes y el tileset dibujan del mismo tarro, que es lo que hace que la figura y el
  terreno se puedan comparar de a pares sin abrir un PNG.
- **Tope: 16, y el número diecisiete no existe.** No es nostalgia: es lo que hace corrible la
  vara de `UX-27 §5.3` —ninguna tinta por debajo de 3:1 contra `--px-clave`— y lo que le da
  al auditor de `T-243` una lista contra la cual fallar. Si una pieza necesita un color más,
  **se cambia la paleta a propósito y se anota** (`UX-27 §6` paso 6); no se agrega en
  silencio.
- **En el JSON del atlas la paleta va por nombre de token, no por hexadecimal.** Es decir
  `["--px-clave", "--px-luz", …]` y nunca `["#1a1a1a", …]`. **Es consecuencia directa de
  `FIND-60`:** si los 16 hex viven en `tokens.css` (`UX-27 §4`) y también en tres JSON, hay
  cuatro lugares donde repintar una tinta y tres donde olvidarse — que es exactamente el
  defecto que `.claude/rules/diseno-marca.md` previene al decir que un hex solo puede vivir
  en `tokens.css`. Con nombres de token, el JSON declara **cuáles de las 16 usa la pieza** y
  el auditor resuelve el hex contra la hoja. La lista sigue existiendo, que es lo que este
  contrato pedía; lo que se va es el hex duplicado.
- **Un PNG no se puede auditar; una lista de tintas, sí.** Ese sigue siendo el fundamento, y
  ahora tiene dueño de los dos lados: `experiencia` puso las tintas (`UX-27 §4`), este
  contrato pone la forma en que la pieza las declara.
- **El sitio no tiene hoy ningún par testeado sobre fondo claro** y el ensayo del 2026-09-11
  ya lo cazó: sobre piso claro la figura casi desaparece, porque la tinta marfil está
  calibrada para `--fondo`, que es oscuro. **`UX-27 §5.2` lo resolvió con contorno de clave
  de 1 px nativo en todo sprite y todo borde de tile**, que es lo que deja convivir a los dos
  terrenos claros. Acá queda anotado para que nadie lo vuelva a abrir.

---

### CTR-15.5 — Dónde viven los archivos, y por qué no en `public/arte/`

> **Confirmado el 2026-09-16 contra `FIND-56` (`REV-14`).** `UX-27 §5.3` y `§6` mandan
> `public/arte/pixel/`; esta sección manda `public/sprites/`. **Acá manda `arquitectura`**
> —dónde viven los archivos y qué forma tienen es de esta carpeta— y **releí `D-41` antes de
> confirmar, por si me convencía de lo contrario.** No me convenció: `D-41` punto 4 dice que
> los dos idiomas no se mezclan **en la misma pieza**, y una subcarpeta adentro de la casa
> del collage es justamente la pieza compartida — el README de `public/arte/` pasaría a regir
> sobre algo a lo que no puede regir. Queda `public/sprites/`, y la corrección de `UX-27` va
> pedida en `Docs/SUGERENCIAS/ARQ-para-experiencia-la-carpeta-y-el-recorte-a-mano.md`. **Lo
> que no podía quedar es la contradicción.**

```
public/sprites/
  skayboy.v1.png        · el atlas del personaje  (celda 16 × 24 nativos)
  skayboy.v1.json       · qué fila es qué animación, y a cuántos cuadros
  poligirl.v1.png       · el otro, mismo tamaño de celda, misma cantidad de filas
  poligirl.v1.json
  terreno.v1.png        · el tileset  (tile 16 × 16 nativos)
  terreno.v1.json
  README.md             · el de `experiencia`: qué se dibuja adentro (`D-41` consecuencia 1)
```

**Carpeta nueva y aparte, a propósito.** `D-41` punto 4 dice que los dos idiomas no se
mezclan en la misma pieza; acá se separan también en el disco. `public/arte/` es la casa del
collage y su README manda *"PNG con fondo transparente, borde tipo tijera (irregular, con
grano — nunca vector liso)"*, que es exactamente **lo contrario** de lo que pide una pieza
de 16 × 24 px nativos. Dejarlas juntas obliga a que ese README diga dos cosas incompatibles
y a que alguien adivine cuál rige. Separadas, la respuesta es la carpeta.

**Dos cosas que arrastra la confirmación, y son de otros:**

- **El auditor `scripts/auditar-paleta-pixel.mjs` que pide `UX-27 §5.3` escanea
  `public/sprites/`**, no `public/arte/pixel/`. Es una cadena en un script que todavía no
  existe: se corrige antes de escribirlo y no cuesta nada (`T-243`).
- **La hoja de origen no se mueve.** `public/arte/skayboy_poligirl.png` se queda donde está:
  es material de origen, no una pieza de producción (`CTR-15.1`), y ninguna página la
  referencia.

**Consecuencia que hay que mirar de frente:** `src/lib/sitio/arte.ts` levanta solo
`public/arte/`. `public/sprites/` **no entra ahí y no debe entrar**: ese módulo llega a
`node:fs` y un import cruzado sería el defecto de `D-29` otra vez. Las piezas del juego se
piden por ruta desde la isla, como cualquier archivo de `public/`.

---

### CTR-15.6 — Cómo se carga, y por qué la RAM no depende del DPR

- **Un atlas por personaje, PNG único, grilla uniforme.** Doce piezas sueltas son doce
  pedidos; un atlas es uno. Y con grilla uniforme el motor lo corta solo.
- **Se carga a tamaño nativo y nunca se reescala en la carga.** Este es el punto que evita el
  problema que el traspaso del hilo principal levantó ("un atlas a DPR 3 son megabytes de
  bitmap vivo"): acá **no hay versión a DPR 3**. Hay una sola imagen, chica, y el escalado lo
  hace el dibujo con vecino más cercano (`ADR-08.3`).
- **La cuenta, rehecha con la celda de `FIND-55`:** cinco animaciones y cuatro cuadros en la
  más larga dan un atlas de **64 × 120 px nativos** por personaje (4 columnas de 16 × 5 filas
  de 24); el tileset entra en **128 × 128 nativos**, que son 64 tiles y sobran. A 4 bytes por
  píxel: `2 × 30 KB + 64 KB ≈ 0,12 MB` de bitmap vivo, **con cualquier DPR**. El techo de
  `ADR-08.10` era 0,5 MB y ahora sobra cuatro veces. **El techo no se baja**: un techo se
  ajusta cuando alguien mide el archivo de verdad, no cuando alguien rehace la estimación. En
  disco, los tres PNG son unos pocos KB.
- **Sin sprite atlas dinámico, sin generación en tiempo de ejecución, sin `<canvas>` auxiliar
  para teñir.** Si hace falta una variante de color, es otro PNG.

---

### CTR-15.7 — El JSON que acompaña al atlas

Es chico a propósito: la grilla ya dice dónde está cada cuadro, así que esto solo nombra
filas y velocidades.

```json
{
  "contrato": "CTR-15",
  "contratoVersion": 1,
  "pieza": "skayboy",
  "celda": { "ancho": 16, "alto": 24 },
  "colision": { "ancho": 10, "alto": 20 },
  "paleta": ["--px-clave", "--px-luz", "--px-piel", "--px-tela-1"],
  "animaciones": {
    "quieto":   { "fila": 0, "cuadros": 1, "porSegundo": 0,  "repite": false },
    "corre":    { "fila": 1, "cuadros": 4, "porSegundo": 10, "repite": true },
    "salta":    { "fila": 2, "cuadros": 1, "porSegundo": 0,  "repite": false },
    "cae":      { "fila": 3, "cuadros": 1, "porSegundo": 0,  "repite": false },
    "enPausa":  { "fila": 4, "cuadros": 1, "porSegundo": 0,  "repite": false }
  }
}
```

- **`celda` y `colision` están en píxeles nativos**, siempre, en este archivo y en todos. La
  escala a la que se ven en pantalla la fija `experiencia` y no vive acá (`ADR-08.3`).
- **`paleta` son nombres de token `--px-*`, no hexadecimales** (`CTR-15.4`, enmendado por
  `FIND-60`). Los nombres tienen que existir en `src/styles/tokens.css` y no pueden ser más
  de 16 en total entre las tres piezas. Lo verifica el auditor de `T-243`.
- **`contrato` y `contratoVersion` adentro del dato**, igual que en `CTR-02` y `CTR-08`:
  dentro de dos meses, mirando solo el archivo, se tiene que poder saber contra qué documento
  validarlo.
- **Las cinco animaciones son obligatorias y son las mismas para los dos personajes.** Si una
  falta en uno, falta en los dos: la paridad se verifica comparando los dos JSON, que es algo
  que un test hace en tres líneas.
- **`enPausa` es la que la hoja no trae** y `D-43` necesita. Sin ella el que juega solo no ve
  cuál de los dos tiene el dedo encima. `UX-28 §3` ya le dio forma y **no hay que dibujar
  nada nuevo**: de frente es esperando, de perfil es en juego — las dos poses están en la
  hoja.
- **No hay una sexta animación, y la que falta no falta: no existe.** `UX-29` decidió que en
  este juego **nadie se muere**; al fallar, el personaje queda un cuadro en su pose de frente
  y **lo que se mueve es el lugar**, no el muñeco. Un atlas con una fila de derrota sería un
  archivo invitando a animar lo que `D-42` precisión 2 declaró bloqueante.
- **`porSegundo: 0`** quiere decir cuadro fijo. No se usa `null` ni se omite el campo: un
  campo ausente es una pregunta, un cero es una respuesta.

---

### CTR-15.8 — Versionado, y el detalle de caché que se paga caro

**El número de versión va en el nombre del archivo: `skayboy.v1.png`.** No es capricho.
Astro no le pone huella a lo que vive en `public/`, así que un PNG repintado y guardado con
el mismo nombre se le sigue sirviendo viejo a quien ya lo tenga en caché. Con la versión en
el nombre, repintar es publicar un archivo nuevo y no hay caché que engañe a nadie.

- **Se sube de versión cuando cambia lo que el motor da por cierto:** la celda, la caja de
  colisión, el orden de las filas o la cantidad de cuadros. Repintar una tinta sin mover nada
  de eso no sube versión — sube `contratoVersion` solo si cambia la forma del JSON.
- **La versión vieja no se borra en el mismo cambio.** Se borra cuando nada la referencia,
  como cualquier archivo huérfano.
- **Los dos personajes suben de versión juntos**, aunque uno no haya cambiado. Es la forma
  más barata de que la paridad no se desincronice por descuido.

---

## Lo que este contrato **no** decide, y de quién es

| Qué | De quién |
|---|---|
| Qué se dibuja adentro del recuadro: tintas, rasgos, cuántas caras, el tono de la caricatura (`D-42`) | `experiencia`, con `D-38` y `D-42` al lado |
| El estado visual del personaje quieto (`D-40`, `D-43`) | `experiencia` — **cerrado el mismo día en `UX-28 §3`**: de frente es esperando, de perfil es en juego, y afuera el sello de la columna va lleno o hueco |
| El estado visual de la derrota (`D-42` precisión 2, **bloqueante antes de animar**) | `experiencia` — **cerrado el mismo día en `UX-29`**, y la respuesta fue que no hay derrota que animar: se mueve el lugar, no el muñeco |
| El mecanismo de contraste sobre superficie dibujada (`D-41` consecuencia 3) | `experiencia` — **cerrado el mismo día en `UX-27 §5`**: 16 tintas declaradas, contorno de clave, y la vara de 3:1 contra `--px-clave` |
| **La discrepancia entre la hoja y la ficha:** la hoja rotula *"Sombrero Fedora"* y `RES-64.3` fichó un **Panamá beige**. Son dos sombreros distintos y el sitio tiene una ficha que dice uno de los dos | **No es mía y no la resuelvo.** Queda nombrada acá y traspasada en `Docs/SUGERENCIAS/ARQ-para-experiencia-el-recorte-de-la-hoja.md`. Ojo: el rótulo está pegado *en la imagen*, así que si se corrige, se corrige en el dibujo, no en un texto |
| Si las cabezas de perfil se usan y dónde (`D-42` precisión 3: son retrato, no sprite) | `experiencia` |
| El nombre del juego y el copy (`IDEA-14` punto 7) | `contenido` |
