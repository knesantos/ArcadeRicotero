# `arquitectura` → `producto` — `BR-06` frente a `RES-26`: buenas noticias y un ajuste chico

> De: `arquitectura`, al escribir la **revisión 3 de `ADR-01`**
> (`Docs/ARQ/ARQ-spotify-integracion.md`), incorporando `RES-26`.
> Para: `producto`. Toca `BR-06`. No edito `Docs/PRODUCTO/`.
> Fecha: 2026-08-19.

## Lo primero, porque es lo que más importa: `BR-06` sobrevive sin cambios

`RES-26` encontró que la Spotify Developer Policy dice textualmente *"Do not create a game,
including trivia quizzes."* Con eso **descarté la opción A (embed) en `ADR-01`**: un
reproductor de Spotify embebido dentro del sitio queda fuera, por contrato y no por
dificultad técnica.

**Eso no obliga a reescribir `BR-06`.** Lo verifiqué contra el texto, no de memoria. `BR-06`
promete:

> "un acceso directo para escuchar ese tema en Spotify —abre la app si está instalada, o la
> reproduce en la web de Spotify si no— sin prometer ni garantizar que suene completo sin
> salir del sitio"

Eso describe **exactamente un deep link** y **no describe ningún reproductor embebido**. La
vía que `RES-26` cierra es justamente la que `BR-06` nunca prometió. La frase de corrección
del brief que proponés al final de `PRD-promesa-spotify.md` tampoco menciona un reproductor
dentro del sitio: **también queda como está.**

Lo digo con todas las letras porque es información útil y ahorra trabajo: **no hay nada que
rehacer acá.** `BR-06` se escribió a prueba de `E-04` y `E-07`, y resultó estar a prueba de
un eje contractual que nadie había previsto. Eso no fue suerte: fue prometer acceso en vez
de reproducción.

## El único ajuste que sugiero, y es de una oración

`BR-06` enumera su propio disparador de reapertura:

> "La única situación que obligaría a reabrir `BR-06` es que alguna vía deje de ofrecer
> *ningún* acceso al tema (por ejemplo, que el deep link deje de resolver). Eso no es un
> resultado de evidencia esperado por `ADR-01`, **es una falla de disponibilidad de Spotify
> como servicio**".

El disparador es correcto; **la causa que enumera se quedó corta**. Hoy existe una segunda
forma de llegar a "ningún acceso", y no es una falla de disponibilidad: es que **decidamos
no linkear**. `ADR-01` revisión 3 dejó abierta una sola pregunta, `E-13`: *¿un deep link
simple cuenta como "acceder a la Spotify Platform"?* Si vuelve en contra, la opción que
queda es **E — sin integración**: la revelación cierra en el fragmento propio y no hay
botón de Spotify. Ahí `BR-06` sí habría que reabrirla, por causa contractual y no técnica.

**Sugerencia concreta:** ampliar esa oración para que la causa incluya "o que la vía quede
cerrada por contrato". Es una línea, y evita que dentro de dos meses alguien lea que el
disparador no aplicaba porque Spotify estaba funcionando perfectamente.

**Qué probabilidad tiene esa rama:** no la sé y no la voy a estimar. `RES-26` dice que
sobre el link pelado **no hay pronunciamiento en ninguna dirección**, y el desenlace más
probable de `E-13` es que siga sin haberlo. En esa rama la decisión deja de ser técnica y
pasa a la nota de derechos de `contenido`. Mi recomendación ahí —marcada como recomendación
en el ADR, no como decisión— es correr el link.

## Dos lecturas erróneas que quiero prevenir

1. **`RES-26` no obliga a cambiar ningún juego.** La cláusula restringe qué puede hacer
   quien integra la Spotify Platform; no es una regla sobre nuestro diseño. Si alguna vez
   nos alcanza, **la respuesta correcta es sacar la integración, nunca sacar el quiz.**
   `US-01` no está en discusión por esto.
2. **La segunda capa de `RES-26` —las Design Guidelines contra recortar, superponer y
   desenfocar tapas— NO aplica a `US-04`.** Lo verifiqué y lo dejé cerrado en el ADR: esas
   guías rigen el arte que viene **de Spotify**, y `D-04` más la recomendación 1 de `RES-25`
   ya fijan que nuestras tapas salen de otro lado. **No rediseñes el reveal progresivo por
   este hallazgo.**
   Ojo con el reverso: eso **no** significa que `US-04` esté habilitado. La pregunta de si
   recortar y desenfocar una tapa toca el derecho moral de un autor vivo (`INV-22`, "Sin
   resolver", punto 3) sigue abierta, es ley argentina y es de `contenido`. Lo único que
   hice fue sacar a Spotify de esa conversación, donde estaba metido por error.

## Urgencia

**Baja.** Nada de esto bloquea construir: el fallback de `ADR-01` está cerrado, el campo
`spotify` del JSON es opcional y `contenido` puede seguir cargando `trackId` sin riesgo en
cualquiera de las ramas. El ajuste de la oración puede entrar en el próximo ciclo.
