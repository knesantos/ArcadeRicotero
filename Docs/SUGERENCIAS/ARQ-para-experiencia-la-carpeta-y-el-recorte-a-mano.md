# De `arquitectura` para `experiencia` — la carpeta del pixel, y que la hoja no se corta sola

> 2026-09-16, después de `REV-14`. Son **tres correcciones a `UX-27`** y ninguna toca lo que
> decidiste: la convención, la paleta, el contorno y el inventario de poses quedan enteros.
> Lo que cambia es una ruta, un paso del recorte y dos números que mi contrato tenía mal y ya
> corregí de mi lado.
>
> **La regla de desempate que fijó el hilo principal el mismo día, para que se lea sin
> discusión:** lo que el jugador **ve y oye** lo fijás vos; **dónde viven los archivos y qué
> forma tienen** lo fijo yo. Las tres de abajo caen del lado de los archivos — salvo la 3,
> que es una consecuencia práctica que te toca porque el recorte es tuyo.

---

## 1. La carpeta es `public/sprites/`, no `public/arte/pixel/` (`FIND-56`)

`UX-27 §5.3` y `§6` paso 7 mandan `public/arte/pixel/`; `CTR-15.5` manda `public/sprites/`.
**Es `FIND-56`, severidad ALTA, y el revisor pidió una sola respuesta.**

**Releí `D-41` antes de contestar, por si me convencía de lo contrario.** No me convenció:
`D-41` punto 4 dice que los dos idiomas no se mezclan **en la misma pieza**, y una subcarpeta
adentro de la casa del collage es justamente la pieza compartida. El README de `public/arte/`
manda *"borde tipo tijera (irregular, con grano — nunca vector liso)"*, que es lo contrario
exacto de lo que pide un sprite de 16 × 24 px nativos. Dejándolas juntas, ese README tiene
que decir dos cosas incompatibles y alguien tiene que adivinar cuál rige. Separadas, **la
respuesta a "cuál rige" es la carpeta**, que es la forma más barata que existe de contestar
esa pregunta.

**Lo que te pido que cambies en `UX-27`, y son tres cadenas:**

| Dónde | Dice | Tiene que decir |
|---|---|---|
| `§5.3`, el comando | `leer los PNG de public/arte/pixel/` | `leer los PNG de public/sprites/` |
| `§6` paso 7 | `en public/arte/pixel/` | `en public/sprites/` |
| `§10`, el segundo comando | `node scripts/auditar-paleta-pixel.mjs` | igual, pero escaneando `public/sprites/` |

**Lo que no cambia:** el README del pixel sigue siendo tuyo (`D-41` consecuencia 1) y vive
adentro de `public/sprites/`; el de `public/arte/` solo tiene que apuntar a él. Y la hoja de
origen —`public/arte/skayboy_poligirl.png`— **se queda donde está**: es material de origen,
no una pieza de producción, y ninguna página la referencia.

---

## 2. La paleta: gana tu 16, y por eso el JSON deja de traer hexadecimales (`FIND-60`)

`CTR-15.4` decía **"32 tintas por atlas"**, que con tres archivos daba hasta 96 tintas adentro
del área. `UX-27 §4` dice **16 cerradas para toda el área**. **Manda tu número**, ya está
corregido en mi contrato, y el auditor que `T-243` tiene que escribir se escribe contra 16 y
ninguno otro.

**Y hay una consecuencia que me corresponde a mí y te la cuento porque toca `tokens.css`, que
es tuyo:** el JSON del atlas ya no declara la paleta como lista de hexadecimales sino **como
lista de nombres de token** — `["--px-clave", "--px-luz", …]`. El motivo es tuyo antes que
mío: si los 16 hex viven en `tokens.css`, ponerlos también en tres JSON son cuatro lugares
donde repintar una tinta y tres donde olvidarse, y `diseno-marca.md` dice que un hex vive en
un solo archivo. **Así el JSON declara cuáles de las 16 usa la pieza y el hex sigue viviendo
solo en tu hoja.**

No te pido ningún cambio por esto. Te lo cuento porque el auditor de `T-243` va a leer
`tokens.css` para resolver los nombres, y eso convierte a tu hoja en la fuente que hace
fallar un build.

---

## 3. La hoja **no se puede recortar a máquina**, y eso cambia el `§6`

Esto no es mío ni tuyo: lo midió el hilo principal con `sharp` y está en
`Docs/SUGERENCIAS/HILO-para-experiencia-y-arquitectura-la-hoja-no-se-corta-sola.md`. Lo
traigo acá porque tu `§6` describe un circuito de siete pasos que se lee como automático, y
**el paso que separa las poses no lo es**.

- La banda del personaje masculino sale como **una sola pieza de 1072 px**: los seis sprites,
  la guitarra y las dos cabezas, fundidos.
- Se probó enmascarar el relleno crema de las cajas de rótulo y **no mejoró en absoluto**.
  Las que puentean no son las cajas: son **las flechas**, oscuras, que caen dentro del rango
  de la tinta del dibujo.

**Lo que corregí de mi lado** (`CTR-15.1` y `CTR-15.2`): el contrato dice ahora, con todas las
letras, que de la hoja actual **las cajas se recortan a mano**, y que lo automático empieza
después — llevar a grilla, forzar el alfa, ajustar a la paleta, armar el atlas.

**Lo que te toca a vos, y es una sola línea en `§6`:** que el orden diga que el paso 1 y el 2
son manuales sobre esta hoja. Tu `§6` está bien pensado y el orden es el correcto; lo único
que falta es que no prometa una tijera que no existe.

**Y un detalle que te va a morder en el paso 3, que es el que mide el píxel nativo:** **no se
mide sobre la hoja entera.** Los rótulos son texto suavizado y le contestan `N = 1` al
comando aunque los dibujos estén perfectamente sobre grilla — o sea, la conclusión contraria
a la verdadera, que además es la cara: "hay que cuantizar todo a mano". Se recorta una pose,
se mide ahí, y se confirma con una pose del otro personaje.

**Y la peor de todas, que también está medida y toca tu `§6` paso 2: el fondo no es un
color.** Un bloque de 40 × 40 de fondo liso trae **52 tintas distintas** alrededor de
`rgb(23,110,119)`, y la hoja entera tiene **108.705 colores**. Sacar el verde "por color"
—como dice tu paso 2 y como decía mi `CTR-15.4`— **no se puede**; con umbral y tolerancia sí,
pero con tolerancia aparecen halos, que es justo lo que los dos documentos prohíben.

Mi `CTR-15.4` quedó corregido así, y creo que es la forma que te sirve para el `§6`: **el
alfa no sale de la hoja, sale del dibujo.** Con la pieza cuantizada a mano, el fondo no se
"saca" — nunca se dibuja. Es el mismo trabajo mirado del derecho, y evita prometer un paso
automático que la medición ya descartó. (La medición completa —`N = 1`, la grilla latente que
no existe, las 52 tintas— está en `ORQ-plan-ciclo-15.md §1.1`.)

**La salida barata no es de ninguno de los dos:** que el usuario reexporte la hoja sin
anotaciones —sin cajas, sin flechas, sin títulos—, idealmente ya en grilla y con fondo
transparente. Si eso llega, el recorte automático vuelve a servir y las catorce medidas a
mano no hay que escribirlas ni mantenerlas. Conviene pedirlo antes de gastar trabajo en lo
otro.

---

## 4. Lo que tomé de tus documentos sin discutir, para que no te quede la duda

No hace falta que hagas nada con esto; lo listo porque lo mejor que puedo devolverte es la
confirmación de que ya está adentro de los contratos:

- **El área es 240 × 144 nativos, 15 × 9 tiles, celda de 16 × 24 nativos** (`FIND-55`).
  `ADR-08.3`, `CTR-15.3` y el envoltorio de `CTR-16.2` ya lo dicen. La caja de colisión se
  rehizo sobre esa celda: **10 × 20 nativos**, igual para los dos — 10 de ancho para que los
  dos pasen por un pasillo de un tile, 20 de alto para que el sombrero y el flequillo sean
  silueta y no cuerpo.
- **El fracaso no suena.** `CTR-17.1` perdió el efecto **muerte** (`FIND-57`) y el atlas
  perdió la fila de derrota que nunca tuvo que existir. En el contrato de audio quedó escrito
  que ahí **el silencio es la decisión, no un valor bajo**, para que nadie "agregue un
  toquecito" más adelante.
- **Tampoco suena el cambio de personaje**, porque no hay cambio: `D-43` sacó el botón y cada
  columna maneja siempre al mismo. `UX-28 §3` resolvió el estado de espera sin dibujar nada
  nuevo, y `CTR-15.7` lo tomó tal cual: de frente espera, de perfil juega.
