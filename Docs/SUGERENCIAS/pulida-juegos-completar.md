# Pulida de los juegos: "Completá la letra", ronda 1

> Propuesta del constructor de la ronda (2026-11-18). Es el juego 5 de la pulida; sigue a
> `pulida-juegos-por-la-letra.md` y `pulida-juegos-skayboy.md`. Nada de esto está decidido: son
> cosas hechas en la rama `pulida/juegos-ui` que necesitan el visto de su dueño.

## 1. El objeto: la pintada

La portada dice "te falta un diente en la sonrisa" (`CNT-13`). El objeto que elegí es **el verso
pintado en una pared, con una palabra que se cayó con el revoque**: en su lugar asoma el ladrillo.
Lo elegí contra la hoja del cancionero por un motivo: el hermano ("Sacalo por la letra") ya es un
papel claro escrito a mano sobre el jean, y dos papeles con versos se confunden. Acá es al revés:
tinta clara sobre una pared oscura, en la letra rotulada.

- **La pared** es la banda del medio, de ladrillo a la vista (`--borde` y la junta en `--fondo`,
  máscara impresa por `scripts/imprimir-pared-completar.mjs`, 8 KiB en total en
  `public/arte/completar/`). Es fondo y no lleva texto encima.
- **El paño** es donde el revoque aguantó: `--fondo` plano, con el canto roto arriba y abajo. Ahí
  van los versos.
- **El hueco** es el ladrillo que asoma, con filete punteado. El lector de pantalla escucha
  "falta una palabra" (antes leía ocho guiones bajos).
- **Las opciones son plantillas de cartón caladas** (papel, letra en `--fondo`).
- **De qué tema es** va en un afiche de papel pegado con cinta, no en la cabecera.

El disco no cambió: *La mosca y la sopa* (`D-19`, letras). Su naranja está en el filete de la
pregunta, el canto del rodillo, la tecla de ruidos y el botón.

**La cantidad de letra a la vista no cambió** (`CNT-01`): mismos versos de contexto por nivel
(`BR-03`), mismo hueco. El resultado muestra solo la palabra que era y el título del tema.

## 2. Lo que pide el visto de otro

1. **Los versos van en `--fuente-rotulada`, en mayúsculas.** `UX-01` y `diseno-marca.md` dicen que
   el texto largo va en `--fuente`. Lo tomé como letra pintada: renglones de hasta 49 caracteres,
   cinco como mucho. Si `experiencia` dice que es texto largo, se vuelve a `--fuente` cambiando
   dos reglas (`.pintada .verso-contexto` y `.pintada .verso-hueco`) y el objeto sigue en pie.
   Ojo: en mayúsculas no se distingue "Él" de "el" más que por la tilde.
2. **La ficha nombra el tema y el disco en difícil**, después de contestar. `BR-03` los esconde
   como pista; con el verso contestado ya no lo son. Es de `producto`.
3. **Textos nuevos para `contenido`** (`src/lib/letra/copy.ts`): "Llevás N", "+1", "N al hilo",
   "Mirá cómo te fue", "falta una palabra" (solo lector), "Los versos de esta vuelta",
   "«tema» · pusiste “palabra”", y los tres de los ruidos. Pasan `voz.test.ts`.
4. **`.accion-abajo` ya no se usa en este juego**: el resultado pasó a `.pie-resultado` y
   `.salida-resultado`. "Mirá las letras enteras" es un secundario del pie. Queda solo "Adiviná
   la tapa" con la pieza vieja.
5. **`.donde-estas` de la portada va adentro del paño**, en la rotulada. Deja de ser hija directa
   de `.pantalla`, así que las dos reglas de `html.incrustado .pantalla > .donde-estas` ya no la
   alcanzan en este juego. No miré la portada incrustada en X.
6. **El signo que sigue al hueco va pegado** ("vida" + "."): antes llevaba un espacio delante.

## 3. Detalles vivos

| Detalle | Estado al que está atado | Con movimiento reducido |
|---|---|---|
| El rodillo destapa la pintada y las plantillas se apoyan | empezar, y cada verso nuevo | todo puesto |
| La plantilla va al hueco, se apoya y vuelve | elegir | no viaja |
| La palabra queda pintada y **chorrea** (dos gotas que bajan y se quedan) | se acaba de pintar | gotas puestas |
| El paño se sacude, el tachón de aerosol pasa y después se pinta la que era | error | quieto, tachado, las dos palabras |
| El sello cae en la esquina del paño | cerrar el verso | no se ve: llega la ficha |
| La casilla del verso y "N al hilo" se estampan | cerrar el verso | puestas |
| "+1" vuela de la ficha a "Llevás N" | acierto | la cuenta cambia de una |
| El rodillo tapa la pintada vieja | "Seguí" | el verso nuevo aparece |
| La cifra cuenta y las filas de la pared se pegan | resultado | todo puesto |

## 4. Lo que queda abierto

- Al errar, la línea del hueco crece (lo tachado más la que era) y puede partir en un renglón
  más: el paño salta ese alto una vez.
- Las tiras lentas no sirven para elegir ni para el pase (los tiempos los lleva la isla): en
  `mirar-juego.mjs` van como ráfagas a velocidad real.
- Sin tarjeta compartible: comparte texto y enlace, como antes.
