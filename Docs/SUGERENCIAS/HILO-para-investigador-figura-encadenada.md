# Para `investigador`: la figura encadenada ya está en pantalla, y le falta la ficha

**Del:** hilo principal · **Fecha:** 2026-08-24 · **Urgencia:** media — no bloquea nada,
pero mientras no se cierre hay una pieza en la portada de la que el sitio no puede decir
de dónde salió.

## Qué pasó

El usuario trajo el calco de la figura encadenada (`Docs/UX/OktubreCadena.png`, ahora
`public/arte/oktubre-cadena.png`) y pidió que reemplace al perro al lado del título del
portal. Está hecho. También es la imagen de `public/tarjeta.png`, que es lo que se ve
cuando alguien comparte cualquier pantalla del sitio.

## El problema, que no es de derechos

`public/arte/README.md` decía, textual: *"el esclavo encadenado de Oktubre no se usa hasta
que su ficha se verifique"*. Fui a ver por qué, y la razón no es legal — es de veracidad,
que es lo único que este proyecto dejó estricto.

`INV-02` (§ "El dato más valioso de esta ficha") reporta:

> el esclavo encadenado **no estaba en el arte original del vinilo de *Oktubre* (1986)**;
> se difundió con la reedición en CD.
> Consultado 2026-08-19 · **reportado, con buena base — verificar contra la entrevista
> original antes de usarlo**.

O sea: la atribución que cualquiera daría por obvia —"la figura de la tapa de *Oktubre*"—
es justamente la que puede ser falsa. Y `UX-04` lo tiene anotado en dos lugares como
motivo que no se usa como referencia mientras siga reportado.

## Qué hice mientras tanto

Ni frenar la pieza ni afirmar el dato. La pieza se muestra; **el sitio no dice de qué disco
sale**, en ningún lado:

- No entra en `tapasUsadas` del portal, que es lo que arma el crédito del pie (`D-21`).
- El texto de la tarjeta al compartir (`PORTAL.altTarjeta`) acredita a Rocambole —eso sí
  está firme— y no nombra el álbum.
- Los comentarios de `index.astro`, de `copy.ts` y la fila del README dicen por qué.

Es la misma lógica de siempre: cuando no hay fuente, se dice que no la hay y se usa igual;
lo que no entra es la leyenda vestida de hecho.

## Lo que se pide

Una ficha `RES-XX` que resuelva **una sola pregunta**:

> ¿La figura encadenada formaba parte del arte del vinilo de *Oktubre* (1986), o apareció
> con la reedición en CD?

Con tres desenlaces posibles, y los tres sirven:

1. **Se verifica que estaba en el vinilo** → la pieza pasa a acreditarse como *Oktubre*, se
   suma a `tapasUsadas` y el crédito del pie la nombra.
2. **Se verifica que no estaba** → mejor todavía: es contenido de quiz de primer nivel, y
   `INV-02` ya explica por qué ("casi todo ricotero asocia el esclavo a *Oktubre* y casi
   ninguno sabe que no venía en el vinilo"). Ahí la pieza se acredita a la edición que
   corresponda.
3. **No se puede cerrar** → se rotula como leyenda y queda como está: se muestra, se
   acredita a Rocambole, no se le atribuye álbum.

Pistas que ya están en el repo: `INV-02` dice que el dato viene de una entrevista de 1999;
`INV-20` § 267 compara la solidez de este dato con otro y explica por qué este es el más
frágil (depende de una entrevista que no se pudo releer). Los originales de tapa están en
`Docs/INVESTIGACION/TapasDiscos/` — hay `oktubre-frontal.jpg`, `oktubre-trasera.jpg` y
`oktubre-cd.jpg`, y `RES-25` ya avisó que las ediciones se mezclan: el *Oktubre* del CAA es
un CD yanqui del 93, no el LP argentino del 86. Anotar edición por imagen.
