# Propuesta del hilo principal para `contenido` — la primera tanda de la Redondopedia y el copy del portal, para tu revisión

> Contexto: el usuario pidió (2026-08-21) la primera versión de la Redondopedia "con lo
> que tenemos". El hilo principal cargó **26 artículos** en `src/data/redondopedia.json`
> desde las fichas `RES-` existentes, con redacción y verificación adversarial en la misma
> corrida (21 hallazgos corregidos antes de integrar). La prosa de contenido es tuya:
> esto te deja el mapa para revisarla con tu vara, no te pide permiso retroactivo — es el
> mismo esquema de `D-12`: quien fabricó no se autocertifica, certificás vos o `revisor`.

## Qué hay cargado (26 de 35)

10 `disco` (En directo excluido: vivo, fuera de los 10 de estudio de `RES-20`),
5 `persona`, 5 `hito`, 4 `concepto`, 2 `leyenda`. Cada afirmación lleva rótulo y ficha
en el punto exacto (`BR-08`); las discrepancias van en paralelo con sus fuentes, sin
promediar (la fecha de *Gulp!*, el conteo de *Lobo suelto*/*Cordero atado*).

## Qué te queda a vos

1. **Los 6 `tema` del piso** — el tipo más caro: letra completa con fuente `D-13`,
   cruce obligatorio contra los 105 de `RES-20`. No se cargó ninguno a propósito.
2. **Bulacio y Olavarría** — esperan tu relectura de `CNT-04` con la vara de `BR-10`
   (de eso depende si `hito` cierra en 7 o baja a 6). Los artículos existentes los rozan
   con respeto y sin enlace, como pide el límite vigente.
3. **Revisión editorial de los 26** — en especial los resúmenes (¿se sostienen solos?) y
   el tono (la verificación ya cazó anglicismos y solemnidad académica, pero tu vara es
   la que vale, `CNT-02`).
4. **El copy del portal y de las pantallas "en la cocina"** vive en
   `src/lib/sitio/copy.ts` (mismo esquema que `CNT-05`): nombres de los casetes, bajadas,
   "En la cocina", el pie del sitio. Nota: el juego del quiz quedó como "Preguntas
   ricoteras" para esquivar el anglicismo — si tenés un nombre mejor, es un string.

## Dato que puede servirte

Los verificadores tumbaron cinco bloqueantes con el mismo patrón: inflar un dato de ficha
con una aposición que la ficha no trae ("Patricio Rey Discos, *el sello propio de la
banda*" — ninguna ficha dice de quién es el sello) y resúmenes que aplanaban un
testimonio de Rocambole a hecho. Si escribís los `tema`, ese es el error a vigilar.
