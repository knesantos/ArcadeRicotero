# Para `producto`: `IDEA-11`, mayor o menor con las palabras del cancionero

> De: hilo principal · Fecha: 2026-08-23 · Consume: pedido directo del usuario
> (2026-08-23), `PRD-backlog-ideas.md` (`BR-15`, `BR-16`), `CLAUDE.md` (el único criterio
> estricto), `BR-03`, `BR-12`, `UX-02`, `D-13`, `D-17`, `RES-20`, `CTR-06` y el corpus
> `src/data/cancionero.json` medido hoy.
> **Estado:** nada empezado, y así se queda. El usuario dijo textual *"no hay que
> desarrollarlo ahora, agregalo como idea"*.

---

## Por qué esto llega como propuesta y no escrito en tu carpeta

`Docs/PRODUCTO/` es tuya y el backlog de ideas también. Abajo está la ficha entera, con el
número `IDEA-11` ya reservado en `Docs/IDS.md`, lista para pegar en
`PRD-backlog-ideas.md` y para sumar su fila al resumen. Lo que va entre corchetes es
decisión tuya, no mía.

La medición del corpus la corrí yo porque estaba a mano y porque cambia el tamaño de la
idea: es lo que separa "esto se hace en una tarde" de "esto necesita limpiar el
cancionero primero".

---

## IDEA-11 — Mayor o menor: qué palabra se dice más

**Tal cual la dijo el usuario:** *"que arrancas con una palabra y cuantas veces se dice en
toda la discografia y tenes que ir adivinando si la otra palabra que te muestran se dijo
mas o menos veces y asi ir sumando"*.

**Tipo:** género conocido —el mayor o menor de toda la vida—, pero **no aplica `BR-15`**.
La regla existe para no escribir un motor que ya existe; acá el motor son dos botones y un
contador, igual que en `IDEA-09`. Lo caro de esta idea no es el juego: es el dato.

**Ancla:** el cancionero del sitio. 104 temas cargados (`CTR-06`,
`src/data/cancionero.json`) sobre los 105 de `RES-20`.

### Cómo se juega, para que dentro de tres meses se entienda solo

Se abre con una palabra y su número a la vista. Aparece una segunda palabra sin número y
dos botones: **Más** / **Menos**. Si acierta, la segunda pasa al lugar de la primera con su
número ya revelado, entra una tercera, y así. Un error corta la racha. El puntaje es el
largo de la racha.

### Lo que esta idea tiene y ninguna de las diez anteriores tenía

**El insumo ya está en el repo.** El ciclo 6 metió las 104 letras. No necesita ficha nueva
de `investigador`, ni audio, ni imagen con derechos, ni motor genérico con licencia
(`BR-15`, consecuencia 1). Junto con `IDEA-09` es de las dos más baratas del backlog.

Y encaja con cuatro cosas que ya están decididas, sin mover ninguna:

- **Móvil y dos o tres minutos:** dos botones grandes en zona pulgar, y la partida termina
  sola al primer error.
- **Molinetes abiertos (`D-14`):** es el juego con la barrera de conocimiento más baja de
  todo el catálogo — más baja todavía que el quiz. El que nunca escuchó un tema puede
  arriesgar si *sangre* se dice más que *corazón*, y a veces acierta.
- **No expone letra:** se muestran palabras sueltas y números, no versos. **No roza `BR-03`
  ni `BR-12`.** Es la diferencia grande contra `IDEA-08`, que directamente los deroga.
- **Comparte solo (`UX-02`):** la racha es un número, que es lo que la tarjeta ya sabe
  mostrar.

### El choque, y es uno solo: el número **es** una respuesta correcta

`CLAUDE.md` dejó una sola cosa estricta, y no es de derechos: que la respuesta correcta sea
correcta, porque si está mal **el juego le marca error justo al que se sabe el tema**. Acá
la respuesta correcta es un conteo, y el conteo sale de un corpus que hoy **no está
limpio**.

Medido el 2026-08-23 sobre `src/data/cancionero.json`:

- 104 temas: **96 con letra**, 2 instrumentales y 6 con solo tablatura. O sea que "toda la
  discografía" son 96 temas de 105, y eso hay que decirlo.
- Contando en crudo todas las líneas tipadas `t: "letra"`, la palabra más cantada de los
  Redondos da **`riff`, 306 veces**, y la segunda **`guitarra`, 156**. No son letra: son
  anotaciones de la cifra que viajan adentro de líneas tipadas como letra —cifraclub aportó
  88 de los 104 temas—. `sol` da 42 y buena parte de esas son el acorde, no el astro.
- Filtrando a ojo lo que parece anotación se caen **1.070 líneas** y quedan **2.858 de
  letra**; hay al menos una línea sucia en **80 de los 104 temas**. Y aun así **queda
  basura arriba**: `criminal` 39 veces en un solo tema, `negrita` 25, `quemas` 26.

Con ese corpus, el juego se equivoca. No a veces: en la palabra más frecuente de todas.

**Lo que lo vuelve honesto es barato y ya lo sabe hacer este proyecto:** el número no se
afirma como hecho del mundo, se afirma como hecho del sitio. El rótulo va en registro 3
—de qué corpus salió, con qué regla se contó, cuántos temas entraron— y el reveal puede
listar en qué temas aparece la palabra. **Un dato que el jugador puede auditar deja de ser
un dato dudoso.** Es el mismo mecanismo del artículo que avisa que hay tres fechas.

### A resolver antes de promoverla

1. **Limpiar el corpus: separar anotación de letra.** Es lo primero y sin eso no hay juego.
   Dueño: `arquitectura` — hoy el contrato deja pasar la anotación adentro de `t: "letra"`.
   Es la misma deuda que ya arrastra `IDEA-08` y que roza `US-03`; si se paga una vez,
   sirve para las tres.
2. **La regla de conteo, escrita y a la vista del jugador.** ¿*corazón* cuenta *corazones*?
   ¿el estribillo repetido cuenta cada vez que se canta o una sola? ¿los 8 temas sin letra
   figuran como cero o no figuran? ¿entra solo lo que sobrevivió a `D-13`? Cada una de esas
   preguntas cambia el número, y una regla no declarada la paga el que sabe, que siente que
   le hicieron trampa. Dueño: `arquitectura` (contrato) con vos.
3. **Empates.** Dos palabras con el mismo número. La convención del género es que el empate
   cuenta como acierto; que lo fijes vos, y que el sitio lo diga **antes** y no después.
4. **El pool de palabras.** Material sobra: con el corpus a medio limpiar hay ~336 palabras
   con 5 o más apariciones y ~142 con 10 o más. Lo que falta es curaduría — que la palabra
   se reconozca y que el par tenga gracia. Dueño: `contenido`. El piso de ítems se fija al
   promover (`BR-16`), no antes.
5. **Cuánto se revela al acertar.** Solo el número no toca nada. El verso donde aparece la
   palabra sí toca `BR-03` y `BR-12`, y ahí hace falta tope tuyo.

### Dos detalles chicos que ya están resueltos

- **El nombre**, cuando se tome, va en registro 1: ocho palabras como techo y segunda
  persona (`voz-ricotera.md`, 4.1 y 4.2).
- **Los botones no dan problema:** *Más* y *Menos* no son infinitivos, así que `D-17` no
  tiene nada que objetar.

### Fila para el resumen del PRD

| ID | Idea | Tipo | Reutiliza | Choque principal |
|---|---|---|---|---|
| `IDEA-11` | Mayor o menor con palabras del cancionero | original (género conocido, motor mínimo) | `cancionero.json` (104 temas), `UX-02` | el conteo es respuesta correcta y el corpus tiene anotación adentro |

---

## Cómo reproducir la medición

No hay script en el repo: lo corrí de una en el scratchpad de la sesión y no lo dejé, para
no meter herramienta que nadie pidió. Es un recorrido de `temas[].secciones[].lineas[]`
quedándose con `t === "letra"`, normalizando a minúscula sin acentos y contando. Si al
tomar la idea hace falta, se escribe como corresponde y con test, que es lo que pide el
punto 1 de arriba.
