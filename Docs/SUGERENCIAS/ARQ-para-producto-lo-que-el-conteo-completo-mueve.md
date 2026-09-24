# De `arquitectura` para `producto`: lo que mueve el conteo completo

> 2026-09-24, ciclo 16, `T-284`. Leí `BR-30` en disco antes de escribir los contratos. **No toco
> tu carpeta.** Los contratos están en `Docs/ARQ/ARQ-schema-recitales.md` (`CTR-19.5` enmendado,
> `CTR-19.15` y `CTR-19.16`) y en `Docs/ARQ/ARQ-schema-adivinar-por-la-letra.md` (`CTR-09.7`
> enmendado). **Nada de esto frena `T-285`:** cada punto tiene un valor por defecto escrito, y si
> lo cambiás se toca una línea, no un dato. Las cuentas son a mano sobre `INV-89` y los bancos, y
> las confirman los tests de `T-285`.

## 1. `US-02`: el desvío no se corrige, se da vuelta (8 / 15 / 72 → 8 / 82 / 5)

`BR-30`, en *"Media y Difícil de US-02"*, dice que el reparto 8 / 15 / 72 *"se corrige solo"*
cuando llegue el conteo completo. Llegó, y con la regla vigente (Media = figura y no es de los 8;
Difícil = no figura) pasa esto:

- De los 95 temas con fragmento, **90 figuran** en la página. Los 8 Fáciles son los mismos que
  hoy, y el corte sigue determinado (57 contra 55).
- **5 no figuran**: *Invocación*, *Capricho Magyar*, *Sushi*, *Soga de Caín* y *San Telmo*. Casi
  todos son instrumentales o cortinas.
- Reparto: **8 Fácil, 82 Media, 5 Difícil.**

Hoy la vuelta de 4 escalona desde Fácil (`CTR-19.14` punto 3), así que casi no se nota. Pero
"Difícil" pasa a querer decir "nadie lo cargó nunca en setlist.fm", y no "poco tocado". **Lo que
necesito:** que confirmes la regla o escribas otra. Una opción que no inventa números es usar para
los 87 que no son Fáciles los mismos tercios de `US-07` (`CTR-19.15`, con el empate en el borde
que baja entero). Cambiar eso es tocar una línea de `repartirEnVivo()`.

## 2. `US-07`: el pozo es de 88, no de 60, y da 30 / 30 / 28 — **pendiente en `BR-30`**

> **Actualizado el 2026-09-24, en la segunda vuelta de `T-284`.** La verificación de `T-284` lo
> marcó con gravedad MEDIA: el número sigue mal escrito en `BR-30`, y el arreglo es tuyo porque
> la carpeta es tuya. Antes este apartado terminaba con *"No hay nada que decidir: es para que
> el número de `BR-30` no quede como si fuera el real"*. Sigue sin haber nada que decidir sobre
> el 88, pero ahora van las frases exactas, para que se corrija en una sola pasada.

**El dato, verificable en el disco:**
`node -e "console.log(JSON.parse(require('fs').readFileSync('src/data/por-la-letra.json','utf8')).items.length)"`
da **88**. Lo corrió `revisor`, y `rg -c '"dificultad"' src/data/por-la-letra.json` da lo mismo.

**Lo que está bien y no hay que tocar:** el **piso de 60** y la cuota de 15 Fáciles de `US-07`
(`PRD-adivinar-por-la-letra.md`). El error es usar el piso como si fuera el **tamaño del pozo**.
Hoy el pozo es de 88 y los tercios se calculan sobre esos 88 (`CTR-19.15`).

**Las frases de `BR-30` que quedan mal.** Van citadas porque los números de línea se mueven. Hoy
están cerca de las líneas 1578, 1588-1591 y 1621-1627. Cada una trae una redacción posible, que
podés cambiar:

1. En *"Dónde se calcula el pozo de `US-07`"* dice *"los temas con letra ya cargada en el banco
   (piso de 60, hoy)"*. Propuesta: *"los temas con letra ya cargada en el banco (88 hoy, sobre
   un piso de 60)"*.
2. En *"Cómo sigue cumpliendo `BR-01`"*, punto 3, dice *"los tercios de un pozo de 60 dan ~20
   por franja"*. Propuesta: *"los tercios del pozo de hoy (88) dan 30 / 30 / 28 (`CTR-19.15`).
   Con un pozo de 60, el piso, darían 20 por franja. El mínimo de 15 se sostiene en los dos
   casos"*.
3. En el mismo punto 3 dice *"con solo 25 líneas publicadas hoy, buena parte del pozo de 60
   puede caer en Difícil por falta de dato"*. Con `RES-90` eso ya no pasa: con los tres alias de
   `CTR-19.16`, los 88 tienen línea y **ninguno queda sin conteo**. Propuesta: pasar el aviso a
   condicional, *"si un tema del pozo se queda sin línea en el conteo, cae en Difícil (`D-27`) y
   el generador lo nombra"*.
4. En *"Media y Difícil de `US-02`"* dice que el 8 / 15 / 72 *"se corrige solo"*. Es el §1 de
   este pase: con el conteo completo da **8 / 82 / 5**. **Esta es la única que pide decisión.**

**Si no se corrige, no se rompe nada:** el generador calcula sobre el pozo real y no lee el
número de `BR-30`, así que `T-285` no depende de esto. El problema es que el documento dice algo
que el disco no sostiene.

**Verificación después del arreglo:**
`rg -n "pozo de 60|~20 por franja|se corrige\s+solo" Docs/PRODUCTO/PRD-alcance-v1.md` solo tiene
que encontrar esas frases dentro del recuadro de enmienda que guarda lo que decía antes. Y
`rg -n "\b88\b" Docs/PRODUCTO/PRD-alcance-v1.md` tiene que devolver al menos una línea dentro de
`BR-30`.

## 3. Un empate en el borde de un tercio baja entero

Con vistas de YouTube casi no pasaba. Con conteos pasa seguido: en el anexo hay empates en 49, 44,
41, 40, 39 y 36. Elegí que **un grupo empatado en el borde baje entero**, por coherencia con el
corte de `US-02`, que ya prefiere un Fácil menos antes que uno dudoso. Así una franja puede quedar
algo más chica que un tercio. Hoy no pasa. Si preferís que el empate suba entero, se descarta con
su motivo en `CTR-19.15`, y es un cambio de una línea.
