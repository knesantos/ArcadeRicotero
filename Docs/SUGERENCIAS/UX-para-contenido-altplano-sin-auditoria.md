# UX → `contenido` (y hilo principal) — el texto del plano que oye el lector de pantalla no pasa por `voz.test.ts`

> **[Resuelta 2026-10-05, `3b4ae32`.]** La guarda es `src/lib/dos-ejes/copy.test.ts`: `altPlano` con los datos
> de verdad en veinte casos (las cuatro como tuya × sin enlace, la misma y las otras tres), con las reglas
> de anglicismo y de la gente más las de registro 3. `contenido` confirmó el texto (`CNT-31` §13). La ficha
> vieja del hilo quedó marcada.

- **De:** `experiencia`, al llevar `UX-38` a la v1.1 (2026-10-05).
- **Para:** `contenido` (`T-352`, que confirma `RESULTADO.altPlano` y `RESULTADO.lugares`) y el hilo principal (es código de test).
- **Por qué está acá:** el plano es ahora `role="img"` y esa cadena es lo **único** que el lector de pantalla
  oye del plano (`UX-38` §5). Es la cadena más larga de `RESULTADO` y la única que dice un lugar. Y hoy nadie
  la audita.

## Qué pasa

`voz.test.ts` → `cadenasDeFunciones()` llama a cada función del copy con dos comodines (un número y `'X'`) y
audita lo que devuelva si es una cadena. `altPlano` recibe **un objeto**: con `1` o con `'X'`, `p.tuya.lugar`
lanza un `TypeError`, y el `catch` lo traga sin avisar (*"una función que no aguanta el comodín no se audita"*).
Resultado: ni el glosario de anglicismos (`D-17`), ni las fórmulas de folleto, ni *los fans / los usuarios* se
miran en esa frase. `RESULTADO.lugares` sí se audita (es un arreglo de cadenas).

## Qué propongo

1. **Un test que llame a `altPlano` con datos reales:** las cuatro maneras de `planoFijo()` en el papel de la
   tuya, cada una sin enlace, con el amigo en otra celda y con la misma (4 × 3 = 12 frases), y les aplique las
   tres reglas que `cadenasDeFunciones` ya aplica (anglicismo, folleto, cómo se nombra a la gente). Vive en
   `voz.test.ts` o en `isla.test.ts`; lo escribe el hilo.
2. **Lo que `contenido` mira al confirmar `T-352`:** que la frase sea registro 3 (seca, sin imagen, sin
   suspensivos) en las doce versiones, y que suene bien leída en voz alta, con "imagen" delante.

## Aparte, de paso

`Docs/SUGERENCIAS/HILO-para-contenido-el-texto-del-plano.md` quedó vieja: dice que el orden de los lugares es el
de `disposicion().celdas` y que la orientación la decide el usuario (`T-353`). Desde `D-59` enmienda 3 el orden
es el de `planoFijo().celdas` (arriba a la izquierda, arriba a la derecha, abajo a la izquierda, abajo a la
derecha: Luz + Orden, Luz + Caos, Oscuridad + Orden, Oscuridad + Caos) y `T-353` está cerrada. La cadena de
ejemplo de esa ficha sigue valiendo para `CU-1`; para las otras tres cambia el lugar.

## Para verlo

`node --test src/lib/voz.test.ts`; y `document.querySelector('.ejes-plano').getAttribute('aria-label')` en
`/juegos/dos-ejes/` después de una noche, y en `/juegos/dos-ejes/cu-4/` para la versión con enlace.
