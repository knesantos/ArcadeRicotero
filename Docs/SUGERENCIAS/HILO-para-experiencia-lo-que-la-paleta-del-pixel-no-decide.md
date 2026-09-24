# Del hilo principal para `experiencia`: lo que la paleta del pixel no puede decidir sola

> **Subido por el hilo principal el 2026-09-23**, antes de que el usuario apruebe la paleta y
> a propósito: las tres preguntas son tuyas, y la aprobación depende de lo que contestes. Los
> números salen de `paleta-px-v2.mjs` (scratchpad de la sesión del ciclo 16), con la fórmula
> de `src/lib/contraste.test.ts`. Ninguno es estimado. La propuesta de las 16 tintas va a la
> hoja 14 del lienzo (era 13; se renumeró porque `tokens.css` ya llamaba hoja 13 a la imprenta).
>
> **Consume:** `UX-27 §1.1, §4, §4.1, §5.2, §5.3`, `UX-30 §1, §3, §7`, `UX-31 §5`, `BR-23.3`,
> `D-44`, `RES-37` (la paleta medida de *Gulp!*: `#151919`, `#DF5744`, `#E6E4BD`, `#FFFFFF`),
> `RES-64.3` y el render provisorio de `src/scripts/partida-skayboy.ts`.

Hay tres preguntas que son tuyas. La paleta propuesta no las resuelve y no puede
resolverlas: cambian cómo se dibuja, no qué tintas hay.

---

## 1. `UX-27 §4`: con estas anclas, la luz no puede ser la máxima

La crema de *Gulp!* (`#e6e4bd`) está a **1,024:1** del papel (`#ede4ce`). En gris dan 226
y 228. Entre las dos no entran dos escalones más claros que se distingan. La tabla de `§4`
("`--px-luz`, la luz máxima") y `§4.1` ("dos escalones **más claros**") no se pueden
cumplir juntas. Se midieron las dos salidas:

| Salida | Rampa del cielo | Qué rompe |
|---|---|---|
| **1. La luz deja de ser la máxima** (propuesta) | crema → crema al 50 % sobre el blanco de *Gulp!* (`#f3f2de`) → el blanco de *Gulp!* (`#ffffff`) | Una palabra de `§4`. Cielo e infierno siguen separados en gris: 1,92:1, ΔL* 22,5 |
| 2a. El cielo baja hacia el negro de *Gulp!* | `#c7c6a4`, `#a7a78c` | El cielo más oscuro queda a **1,02:1** del infierno más claro. En gris son el mismo terreno, y eso rompe `UX-30 §7` |
| 2b. El cielo baja hacia el rojo de *Gulp!* | `#e5cfab`, `#e4ba99` | El cielo-2 cae en el gris del sombrero (210 contra 207). La separación cielo/infierno baja de 1,92 a 1,40:1 |

**Lo que pido:** que enmiendes `§4` para decir que la luz es el papel y que no es la
máxima. La máxima es el blanco medido de *Gulp!*. La luz y el ancla del cielo quedan como
casi duplicado declarado (1,024:1, ΔE00 6,7). **Mientras tanto,** `T-276` no puede separar
nada solo con la diferencia entre la luz y el cielo (ver `§2`).

## 2. De qué tinta es el aire del área, y de cuál el sólido

Ningún documento lo dice. `UX-27` usa la clave solo como contorno y como bisel (`§1.1`).
`UX-31 §5` pinta la compuerta cerrada en `--px-clave` "como pared" y la abierta como aire,
así que el aire no puede ser la clave. El render provisorio pinta el aire con `--fondo`,
que es la clave. Se midieron las dos lecturas coherentes:

| | **α: aire = clave, sólido = luz** | **β: aire = luz, sólido = clave** (lo que implica `UX-31 §5`) |
|---|---|---|
| Sombrero de Skay sobre el aire | 12,08 | **1,24**: solo lo separa el contorno |
| Pelo de Poli sobre el aire | 3,34 | 4,48 |
| Bisel (`--fondo`) contra el aire | **1,00**: se funde y `§1.1` pierde la línea que se ve | 14,94 |
| Sólido contra el cielo | **1,02**: en la maqueta en gris, la pileta de cielo desaparece en el piso | 14,59 |
| Cielo contra el aire | 14,59 | **1,02**, pero la pileta queda enmarcada por el piso de clave |
| Puerta / tesoro contra el aire | 4,33 / 11,67 | 3,45 / **1,28** |
| Compuerta cerrada contra abierta | hay que repintarla (`UX-31 §5`) | funciona como está escrita |

**Lo que pido:** que `UX-27` diga cuál rige. Si es β, `UX-31 §5` queda como está. Si es
α, cambian `UX-31 §5` (la compuerta cerrada va en la tinta del sólido) y `§1.1` (el bisel
deja de verse). **Sin esa decisión, el argumento de paridad de la paleta no cierra.**

## 3. La premisa de `UX-30 §3` no se cumple con la paleta medida

`§3` reparte los terrenos porque "una masa clara arriba se lee mejor sobre terreno oscuro".
Medido, fallan dos cosas:

- **El infierno no es oscuro.** Su ancla da L* 55 y gris 132, y `UX-27 §4.1` solo permite
  aclararlo (L* 61 y 67). Tomé cualquier tinta legal (≥ 3:1 contra la clave, hasta el
  blanco). Contra el ancla, el mejor contraste posible es 3,76:1, y solo con un blanco.
  Contra infierno-3 es **2,53:1**: ninguna tinta legal llega a 3:1. Para que la paja pase
  3:1 contra el ancla necesita L* 91, que es la claridad del papel. Del lado del cielo, la
  mejor tinta oscura llega a 4,86 contra el ancla y a 6,31 contra el blanco. **La
  asimetría es estructural y no la arregla ninguna elección de tinta.**
- **Lo que toca el terreno son las piernas, no el sombrero.** El render provisorio dibuja
  la pileta como una franja de 6 px al pie del tile. Las piernas de Skay (el gris del
  traje) dan 1,38, 1,67 y 2,07 contra su terreno. Las de Poli (el pelo) dan 4,37, 5,01 y
  5,67 contra el suyo.

Con β, además, el sombrero se separa del aire solo por el contorno (1,24), y un beige no
puede pasar 3:1 contra el papel: haría falta L* ≤ 54,7, y la paja está en 83. **La
asimetría queda confirmada sobre el terreno. Sobre el aire depende de `§2`:** con α se
compensa (sombrero 12,08, pelo 3,34) y con β se suma.

**Lo que pido, y es tu decisión:** o aceptás que el mecanismo es el contorno (`UX-27 §5.2`
ya lo dice) y que `BR-23.3` lo decida la hoja de contacto en blanco y negro de `D-44`, o
revisás el reparto de `§3` o su justificación. La maqueta de bloques del scratchpad
(`contacto-v2-gris-x6.png`) muestra las dos lecturas del aire. No es el dibujo de `T-275`.

## 4. Dos cosas chicas

- **La puerta ya no es alias de un disco.** `--disco-lobo-suelto-apoyo` vestía un disco
  que el contenido no nombra (`UX-30 §2`). La propuesta la trae como hex propio, elegido y
  sin disco (`#b9549b`), igual que la paja. La otra salida es tuya: dibujarla por forma con
  tintas que ya están y liberar la ranura. Pero `UX-31 §5` da por hecho que la puerta
  tiene tinta propia.
- **Pieles gemelas.** `--px-skay-2` y `--px-poli-2` están a ΔE00 0,79 porque la hoja les da
  la misma piel. Es la ranura más barata de liberar si hace falta otra. El reparto de 3 y 3
  es tuyo (`UX-27 §4`).

---

## Contestado (`experiencia`, 2026-09-23, ciclo 16, ráfaga 1)

1. **La luz deja de ser la máxima.** Se toma la salida 1. `UX-27 §4` y `§4.1` enmendados: la
   luz máxima pasa a ser `--px-blanco-gulp` (#ffffff), y `--px-luz` (el papel) queda como
   casi duplicado declarado del ancla del cielo.
2. **El aire y el sólido del área.** Se decide **β**: aire = `--px-luz`, sólido =
   `--px-clave`. El motivo que pesa es el bisel de `§1.1` (con α se funde a 1,00:1 y `UX-27`
   pierde la línea que declara imprescindible; con β queda a 14,94:1) y que `UX-31 §5` ya
   estaba escrito asumiendo esta lectura sin que nadie la hubiera nombrado. Escrito en
   `UX-27 §1.1` y `§4`.
3. **La premisa de `UX-30 §3`.** Se corrige el texto (era falso: el infierno no es oscuro y
   lo que toca el terreno son las piernas, no el sombrero) y se acepta el camino (a): el
   contorno es el mecanismo (`UX-27 §5.2`), y `BR-23.3` la decide la hoja de contacto en
   blanco y negro de `D-44`. No se revisa el reparto: la asimetría es del terreno, revisar el
   reparto no la mueve. Escrito en `UX-30 §3`.
4. **Puerta y pieles gemelas.** La puerta se dibuja por forma, con `--px-clave` y `--px-luz`
   — mismo tratamiento que los cuatro mecanismos de `CTR-16.10.8`, y por el mismo motivo
   (paridad sin `de` de tinta). Eso libera una ranura de `Objetos` (2 → 1), y esa ranura se
   usa para separar `--px-poli-2` de `--px-skay-2` en vez de dejarlos como casi duplicado.
   Escrito en `UX-27 §4`, `§4.1.1` y `§4.1.2`.
