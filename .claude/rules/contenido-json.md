---
paths:
  - "src/data/**/*.json"
---

# Reglas de los JSON de contenido

Esta carpeta la llena `contenido`; el schema que la rige lo define `arquitectura` en
`Docs/ARQ/` (`CTR-XX`). Nadie más escribe acá.

> **Encuadre (`D-14`).** Lo que sigue se lee con la postura del proyecto puesta: fan site
> sin fines de lucro, molinetes abiertos, **el conocimiento popular vale**. No hace falta
> fuente oficial para nada — no existe, y `RES-23` lo verificó. Lo que hace falta es que
> **el rótulo diga la verdad sobre lo que hay adentro**.

- **Tres casillas, y hay que elegir bien:** **hecho** (`esLeyenda: false` + `fuentes`),
  **leyenda** (`esLeyenda: true` + `rotuloLeyenda`) y **testimonio** (objeto `testimonio`,
  para lo que alguien contó en primera persona). El schema las hace cumplir. **Elegir mal la
  casilla es el error de contenido más grave que hay acá**, más que no tener fuente.
- **La leyenda entra sin fuente y es contenido de primera.** Una historia que circula entre
  fans, que contó alguien que estuvo, que se dice en la previa: se carga rotulada y punto.
  **No la mandes a fichar.** La mitad de lo mejor que tiene esta banda se transmitió así.
- **Cuando hay ficha, se cita — y la cita tiene que ser pertinente.** El validador comprueba
  el **formato** de `fuentes`, no que la ficha sostenga lo que el ítem afirma. Eso lo tapás
  vos y `revisor`. Ya pasó tres veces en el ejemplo canónico del contrato.
- **Donde sí hay que ser estricto es en la respuesta correcta.** No por lo legal: si el
  dato está mal, **el juego le marca error justo al que se sabe el tema**. Si una respuesta
  depende de qué fuente mirás, la pregunta está rota — reformulala, rotulala como leyenda, o
  no la cargues. Ese es el único filtro duro que queda.
- **Todo ítem valida contra el schema vigente** de `arquitectura` antes de darse por
  cargado. Un JSON que no valida no está listo, aunque tenga el contenido correcto. Ojo:
  `contenido` **no puede correr el validador** (`D-12`) — dejá el comando escrito y lo corre
  `revisor` o el hilo principal.
- **`sensibleA` se llena igual, aunque ya no bloquee nada.** Con `D-14` la nota de derechos
  dejó de ser un cerrojo y pasó a ser un mapa: ese campo es lo que hace que el mapa se pueda
  consultar por comando. Si algún día hay que bajar o cambiar algo, es lo que permite
  encontrarlo en diez segundos en vez de leer el banco entero.
- Nada de datos sueltos sin ID trazable: todo ítem referencia, como mínimo, la historia
  `US-XX` del juego al que pertenece.
