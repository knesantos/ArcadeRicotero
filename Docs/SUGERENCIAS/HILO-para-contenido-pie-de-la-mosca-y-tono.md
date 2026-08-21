# Hilo principal → `contenido` — dos cosas cortas que quedaron esperando tu palabra

> Ciclo 4, tareas `T-49` y `T-52`. Las dos salen de decisiones que tomó el hilo principal
> por defecto conservador y que son tuyas de verdad. Ninguna bloquea nada: el sitio
> funciona hoy con la opción prudente puesta.

---

## 1. La ficha de *La mosca y la sopa* muestra la contratapa, y no lo dice

**Qué pasó.** `RES-44` confirmó que `la-mosca-y-la-sopa-frontal.jpg` no es arte de
Rocambole: es un rediseño con una foto de recital. La única imagen disponible con el
collage real de ese disco es la **contratapa** (el edificio, el chico con la caja de cartón,
la olla con el cucharón).

`scripts/generar-tapas.mjs` ya genera la ficha de ese disco desde la contratapa — era eso o
mostrar arte ajeno firmado como de Rocambole.

**Lo que falta, y es tuyo.** El pie de esa imagen en la Redondopedia dice hoy, para los diez
discos por igual: *"Tapa: Rocambole (Ricardo Cohen), en baja resolución."* Para este disco
eso es medio cierto: el autor está bien, pero no es la tapa. **Un rótulo que no dice la
verdad sobre lo que hay adentro es exactamente lo que `D-14` no perdona**, aunque acá el
costo sea chico.

Alcanza con una línea distinta para ese slug. El pie sale de
`src/pages/redondopedia/[slug].astro`; si me decís el texto, lo cableo.

**Y hay una segunda mitad, más interesante:** que la única cara frontal que circula de ese
disco sea un rediseño es, en sí mismo, material de artículo. La ficha de disco de *La mosca
y la sopa* podría contarlo, rotulado como corresponde.

---

## 2. Los tres artículos de tono grave no llevan detalle de tapa. Confirmalo o levantalo

**Qué pasó.** `UX-05` habilita un recorte decorativo de tapa junto al título de todo
artículo que no sea de disco, y a la vez `experiencia` sugirió omitirlo en tres:
`muerte-del-indio`, `walter-bulacio` y `olavarria-2017`. Lo dejó marcado como llamada de
tono sin ficha detrás, y dijo que lo confirma `contenido` — dueño de `CNT-04` y ahora de
`CNT-06`.

**Qué se hizo.** Se implementó la omisión, porque entre poner un adorno de más al lado del
título de una muerte y ponerlo de menos, el error barato es el segundo. La lista vive en
`src/lib/sitio/arte.ts`, en `SIN_DETALLE_POR_TONO`, y está verificado: esos tres artículos
no traen detalle y el resto sí.

**Lo que falta.** Tu palabra. `CNT-06` ya fijó cómo se cuentan esas dos muertes en prosa;
esto es el borde visual del mismo asunto. Si concluís que el detalle no molesta, se saca la
lista y listo. Si concluís que además hay que revisar otra cosa de esas tres pantallas,
decilo acá.

---

## 3. Una deuda menor, que anoto para que no se pierda

El texto de `src/lib/tapa/copy.ts` —lo que se lee en "adiviná la tapa"— lo escribió el hilo
principal siguiendo `CNT-02` y `D-17`, porque no existe la `CNT-XX` equivalente a `CNT-05`
para este juego. Funciona, pero es criterio prestado: cuando escribas la tuya, ese archivo
se transcribe de ahí y deja de ser mío.
