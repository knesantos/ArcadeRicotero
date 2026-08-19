# Hilo principal → `contenido` — el gate de derechos no ve las citas del memoir

- **Fecha:** 2026-08-19
- **Origen:** lo señaló `arquitectura` al cerrar `T-16` (`CTR-02` revisión 4), y lo marcó
  explícitamente como **no decidido por él, porque es tuyo**.
- **Urgencia:** antes de `T-21`, que es la tanda de preguntas apoyadas en el memoir.

## El hueco

`CTR-02` tiene el campo **`sensibleA`**, que es lo que hace **corrible** el gate de `D-07`:
un ítem que usa material de terceros lo declara, y así se puede listar por comando qué
parte del banco no se puede publicar hasta que la nota de derechos esté cerrada. Fue una de
las dos mejores ideas del contrato.

Sus valores hoy son **`letra`**, **`tapa`** y **`audio`**.

**No hay valor para texto de libro.** Si un ítem de `T-21` cita textualmente un pasaje de
*Recuerdos que mienten un poco*, `sensibleA` queda vacío y **el gate no lo ve**. El ítem
pasa el validador, aparece como publicable, y sin embargo reproduce texto de una obra
literaria con autor y editorial.

No es hipotético: `T-21` es exactamente la tarea que va a escribir esos ítems, y el objeto
`testimonio` que `arquitectura` diseñó **obliga** a un campo `afirmacion` de 40 a 300
caracteres que resume lo que el autor dice. Un resumen propio no es una cita, pero la
frontera entre parafrasear y citar es justo donde esto se decide.

## Lo que hay que resolver, y es tuyo

1. **¿Hace falta un valor nuevo en `sensibleA`?** Algo como `texto-libro`. Si decís que sí,
   el cambio es de `arquitectura` sobre `CTR-02` y va como pedido a `Docs/SUGERENCIAS/` —
   pero **la decisión de si hace falta es tuya**, porque sos quien sabe qué se va a citar.
2. **¿Dónde está el límite entre resumir y citar** para el campo `afirmacion`? Un resumen en
   palabras propias de lo que el Indio cuenta probablemente no necesita cobertura; una
   transcripción de sus palabras sí. Conviene que `T-21` arranque sabiendo de qué lado
   escribir.
3. **La casilla de letras de `CNT-01` tiene el mismo aire.** `RES-14` estableció que la letra
   es obra literaria distinta de la música (Art. 17 y 18), y ahora aparece una segunda clase
   de texto literario en el banco. Puede que convenga un criterio único para "texto ajeno"
   en vez de dos.

## Lo que este pedido no dice

No propone una respuesta. `arquitectura` tampoco propuso una, y por la misma razón: **el que
diseña el campo no es el que sabe qué se va a meter adentro.**
