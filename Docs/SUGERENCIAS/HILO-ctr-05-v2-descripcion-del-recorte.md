# Aviso a `arquitectura` y a `contenido`: `CTR-05` pasa a v2 (la descripción del recorte)

**De:** hilo principal, ronda R3 de la pulida de jugabilidad (`T-534`), 2026-11-20.
**Para:** `arquitectura` (`Docs/ARQ/ARQ-schema-adivinar-tapa.md`) y `contenido` (dueño de los
textos de `src/data/tapa.json`). El código y los datos ya están; falta que el contrato lo diga
y que `contenido` lea las diez descripciones. La decisión `D-` la numera el hilo principal al
integrar.

**De dónde sale:** `Docs/REVISIONES/REV-24-pulida-jugabilidad/r0-uso.md`, perfil C, hallazgo 1.
El `alt` del recorte decía "Arte de tapa sin identificar: es lo que hay que adivinar": el
juego no se podía jugar sin ver.

## Para `arquitectura`: qué cambió en el contrato

- `contratoVersion: 2` y `$id` `…/schema/tapa/2`. **Sube la versión** con el criterio de la
  revisión 2 de `CTR-05`: esta vez un ítem `listo` de la v1 **deja de validar**.
- Campo nuevo `imagen.descripcion`: texto, de 30 a 240 caracteres. Va después de `disco`.
- Regla nueva en `item.allOf`: si `estado` es `listo`, `imagen.descripcion` es obligatoria. Un
  borrador puede no tenerla.
- Lo que el schema no puede decir lo hace cumplir `src/lib/tapa/banco.ts`
  (`fugasDeDescripcion`, que corre en `verificarInvariantes` y por lo tanto en el build):
  1. la descripción no contiene el título entero de ninguno de los diez discos;
  2. ni una palabra con peso (todo menos artículos y preposiciones) del título de alguna de
     las cuatro opciones del ítem. Se compara palabra entera, sin tildes ni signos.
- La descripción **viaja al navegador** (`Imagen.descripcion` en el payload): es el `alt` del
  recorte mientras se juega, armado por `PARTIDA.altRecorte` en `src/lib/tapa/copy.ts`.
- La lista de los diez títulos quedó duplicada en `banco.ts` (`TITULOS_DE_DISCO`);
  `descripcion.test.ts` falla si deja de coincidir con `$defs.tituloDeDisco` del schema.

Verificación: `node --test src/lib/tapa/descripcion.test.ts src/lib/esquemas.test.ts`.

## Para `contenido`: las diez descripciones las escribió el hilo principal

Están en registro 3 (`voz-ricotera.md` §5): qué se ve, y nada más. Las escribí mirando cada
archivo de `public/tapas/detalle/`. Son tuyas para corregir; lo que no pueden hacer es
nombrar el disco ni usar una palabra de su título (el test lo frena).

| Ítem | Descripción |
|---|---|
| `TP-001` | Letras pintadas a mano en verde claro, de trazo grueso y chorreado, sobre un fondo negro con manchas blancas. Se lee parte del nombre de la banda, no un título. |
| `TP-002` | Dibujo en blanco y negro de una multitud de caras apretadas, de trazo duro. Arriba, sobre fondo negro, banderas rojas. |
| `TP-003` | Un marco ovalado color cobre sobre un fondo verde oscuro veteado. Adentro, un busto de cabeza calva, con antiparras oscuras y barba en punta, y una llama blanca encima de la cabeza. |
| `TP-004` | Foto de cerca, de poca definición. Un antifaz celeste con hileras de cuentas cubre media cara rosada. En el lugar de la nariz hay una flor de tela rosa. |
| `TP-005` | Ilustración a color. Un hombre de perfil, de barba oscura, con una gorra ocre de visera larga que le tapa la frente. Detrás, caras en violeta y verde; arriba, una franja roja. |
| `TP-006` | Imagen hecha por computadora. Una figura de frente, de cara angulosa y torso oscuro, entre otras cabezas. A la derecha, una esfera roja; arriba, una máscara blanca con la boca abierta. |
| `TP-007` | Dibujo de muy cerca, en tonos arena y gris. Un hocico de nariz negra, con dos colmillos blancos que asoman hacia abajo. |
| `TP-008` | Dibujo de muy cerca. Un ojo de iris verde, con el blanco a la vista, en medio de una textura marrón granulada. En la esquina de arriba a la derecha, un triángulo naranja liso. |
| `TP-009` | Imagen en grises, sin color. Un relieve que parece de metal labrado: una cara de frente, con cejas en surcos, dos ojos redondos y una nariz larga y recta. |
| `TP-010` | Recorte muy cerrado y fuera de foco. Una curva blanca gruesa cruza una franja negra horizontal. Arriba hay amarillo; abajo, marrón. No se distingue una figura. |

### Lo que conviene que mires

- **`TP-001`**: el recorte es letra pintada, pero del nombre de la banda ("PATRIC… REY"), no
  del título. La descripción lo dice así y no transcribe las letras. No regala el disco: las
  diez tapas son de la misma banda.
- **`TP-007`**: "hocico con colmillos" acerca a un animal, y el otro disco del doble es
  distractor. No dice más que lo que ve el que mira, pero es donde la descripción pesa más. Si
  te parece que inclina, es la que hay que reescribir.
- **`TP-008`**: reescrita en la auditoría de `T-534`. Decía "pupila" y "pelaje", que elegían
  especie; ahora describe el ojo, el blanco, la textura y el triángulo, sin nombrar animal.
- **`TP-010`**: no pude identificar qué objeto es el del recorte, y la descripción lo declara
  ("no se distingue una figura") en vez de adivinarlo. Quien conozca la tapa de memoria puede
  decirlo mejor. Para quien no ve, hoy es el ítem más difícil del banco.
- **`TP-004`, `TP-005`, `TP-006`**: describí lo que se ve sin conocer el original a tamaño
  completo. Si algo está mal nombrado (la "gorra", la "flor de tela"), el que marca error es
  el juego, al que se sabe la tapa: conviene una lectura de alguien que la tenga delante.

El prefijo del `alt` ("Pedazo de la tapa a adivinar.") está en `PARTIDA.altRecorte`, en
`src/lib/tapa/copy.ts`, que sigue con su deuda declarada de `CNT-XX`.
