# CNT para hilo principal — anotaciones y erratas que pasan el filtro de "Completá la letra"

- **Fecha:** 2026-10-01. **De:** `contenido` (al armar `CNT-27`). **Para:** hilo principal, con
  `arquitectura` si toca el contrato.
- **No urgente y no bloquea nada.** `CNT-27` ya esquivó todo lo de abajo a mano. Esto sirve para
  que la próxima tanda de curaduría no tenga que esquivarlo, y para el día que un ítem llegue a
  `listo` por otra vía (oído, dos fuentes) sin que nadie lo lea con este ojo.

## 1. Líneas de anotación que `versosDelTema()` deja pasar y terminan en el contexto

El filtro de `CNT-11` (`motivoDescarteVerso` + `sirveComoVerso` + `sinEtiquetaFinal`) cae bien en
acordes y rótulos con acorde. Leyendo los 1.321 borradores, estas siguen entrando como verso, y por
lo tanto aparecen **como contexto de un ítem vecino**, a la vista del jugador:

| Patrón | Ejemplo real | Dónde |
|---|---|---|
| Parte `N` de `M` con repetición | `Parte 1 de 2 - 4x`, `Parte 1 de 3 - 2x` | `CL-201` (contexto de `CL-202`), `CL-1027` |
| Marca de refrán de otra fuente | `[Refrão ]]` | contexto de `CL-222` |
| Indicación de solo o arreglo entre paréntesis | `BAJ0 (durante el solo de saxo)`, `solo de guitarra (WAh WAH)`, `guitarra solo: (falta el solo)`, `VIOLIN (arreglo para guitarra)`, `SAXO: (arreglo para guitarra)`, `esto se canta sin musica` | `CL-556`, `CL-468`, `CL-461`, `CL-566`, `CL-628`, `CL-1079` |
| Número de verso con "igual" | `2do VERSO: (igual)`, `3er VERSO: (Igual a los demas)`, `4to VERSO: (igual)`, `INTERMEDIO: (IGUAL)`, `Intermedio: D7-C7x3 ...` | `CL-401`, `CL-351`, `CL-334`, `CL-776`, `CL-1277` |
| Leyenda de técnica de guitarra | `e: estirar`, `d: deslizar`, `v: vibrato`, `s: estira`, `Lick de blues`, `SOBD` | `CL-025` a `CL-027`, `CL-1216` a `CL-1218`, `CL-904`, `CL-910` |
| Contador de vuelta pegado al verso | `...1er`, `....3ra`, `.....6ta`, `vuelta 1` a `vuelta 4` | `CL-490` a `CL-509` |

**Propuesta:** subir `VERSION_FILTRO` con estas reglas como (f)-(i) de `CNT-11` §1. Si lo aceptan, la
redacción la escribo yo (`CNT-28`); el código es de ustedes. **Ojo con lo que arrastra:** el filtro
cambia la lista de versos de cada tema y por eso corre los ids; las anclas de `fuenteUnica` llevan el
`verso` y se mudan con `npm run generar-letra -- --reanclar`.

## 2. Erratas del cancionero que entran como opción

Las opciones salen del vocabulario del disco (`sirveDeDistractor`), y ese vocabulario trae las
erratas de la transcripción. Con cuatro opciones por ítem, una errata es una opción que se delata
sola y queda mal escrita en pantalla. No cambia la respuesta correcta, pero regala el punto.

Casos vistos en opciones de ítems reales: `veses`, `soniar`, `trmontina`, `kamikase`, `amenisa`,
`disfrases`, `ensueguida`, `asficio`, `galpon`, `jamon`, `veni`, `futbol`, `salon`, `television`,
`pomulos`, `loteria`, `conoci`. Las que son solo una tilde faltante ya las arregla
`formaDelDistractor()` cuando la forma con tilde existe en otro tema; las de arriba son las que no.

**Propuesta, la más barata:** un `src/data/letra-opciones-vetadas.json` que mantiene `contenido` (lista
de palabras sin tilde o mal escritas, con el ítem donde se vieron) y que `sirveDeDistractor()` lee.
Es una lista corta y estable; el criterio automático ("aparece una sola vez en todo el cancionero")
también descarta palabras raras bien escritas (`desdentado`, `psicohéroe`) y no lo recomiendo.

## 3. Menor

`notaInterna` de todo ítem promovido dice "Promovido por T-138 bajo D-25"; con `CNT-27` ya no es solo
`T-138`. No se renderiza y no cambia nada; si se toca el generador, que diga `D-25` y nada más.
