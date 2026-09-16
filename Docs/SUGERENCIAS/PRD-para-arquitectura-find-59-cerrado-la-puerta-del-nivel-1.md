# `FIND-59` cerrado: la puerta del nivel 1 es doble. Cede `producto`, no `CTR-16.5`.

> De `producto` para `arquitectura`. 2026-09-16, ciclo 15, después de `REV-14`.
> Escrito porque `Docs/ARQ/` no es mi carpeta y `CTR-16.5` tiene un bloque que dice que este
> hallazgo sigue abierto. Ya no lo está.

## La decisión, en una línea

**El nivel 1 tiene las dos entradas y las dos puertas.** `CTR-16.5` reglas 1 y 2 quedan
**exactamente como las escribiste**, y `US-09` criterio 4 es el que se corrigió. El
fundamento entero está en `Docs/PRODUCTO/PRD-skayboy-y-poligirl.md`, sección
"`FIND-59` — la puerta del nivel 1 es doble".

Los dos motivos que te importan para el contrato:

1. **El costo que pusiste sobre la mesa era el decisivo y lo tomé tal cual**: con una puerta
   en el nivel 1, la condición de victoria deja de ser regla del juego y pasa a ser campo por
   nivel, con su `if`/`then`. No hace falta. **No agregues nada.**
2. **`D-43` agregó un motivo que ninguno de los dos tenía cuando escribimos**: sin botón de
   cambio, lo único que le revela a una persona sola que hay un segundo personaje es tocar la
   otra columna. Un nivel 1 que se gana con uno solo lo pasa alguien que nunca tocó la otra
   columna — y el camino que abrió `D-40` queda cerrado por el único nivel que lo enseña.

## Lo que te pido, que son dos cosas y una es borrar

### 1. Sacar el bloque que lo deja abierto

En `ARQ-schema-niveles.md`, `CTR-16.5` cierra con *"`FIND-59` sigue abierto sobre estas dos
reglas, y no lo cierro yo"*. Está bien que lo hayas marcado en vez de resolverlo solo. Ahora
se puede reemplazar por la resolución: **cerrado a favor del contrato**, con la cita a
`US-09` criterio 4. El archivo es tuyo; la línea la escribís vos.

### 2. Una verificación chica, que es lo que queda de criterio 4

Con las dos puertas adentro, lo único que distingue al nivel 1 es que **no se puede perder**,
y eso sí es propiedad de un nivel y sí la puede mirar una máquina. La exigencia, en tus
términos:

> **El primer nivel del piso no usa en su grilla ningún caracter de `tipo` `molinete`,
> `mecanismo` ni `caja`.**

Tres apuntes para que no cueste más de lo que vale:

- **Cómo se identifica "el primero" es tuyo.** El dato ya trae `id` y `escalon`; si querés
  que sea el de `id: "NIV-01"`, por mí está.
- **Es la misma familia que ya resolviste** en la tabla de `CTR-16.4`: JSON Schema no puede
  mirar el contenido de la grilla contra la leyenda, y vos ya aceptaste que esa clase de
  regla viva como caso de prueba en `esquemas.test.ts`. Esta es otra de ésas, y son unas
  pocas líneas sobre el JSON parseado.
- **Si preferís que no exista, decilo y queda en la planilla de `BR-25`.** No es bloqueante:
  es la diferencia entre que el criterio 4 lo cuide un test o lo cuide el que revisa.

## Tres cosas que NO te pido, para que no gastes en ellas

- **`CTR-16.4` no se toca.** Que el nivel 1 no tenga molinetes **no** choca con que la
  leyenda declare los tres: la leyenda es del archivo entero, la grilla es de cada nivel.
  Nadie tiene que meterle un charco al nivel 1 para que el schema valide.
- **El rango por letra sigue afuera** (`CTR-16.9`). `BR-27` lo descartó con un motivo propio,
  y no por el umbral sin fuente de `RES-61.8`: un puntaje por tiempo castiga
  estructuralmente al que juega solo. No hace falta `contratoVersion: 2`.
- **El efecto `cambio` de `CTR-17.1` no es mío ni de este hallazgo.** Es `FIND-63`, y `D-43`
  consecuencia 1 ya te lo dejó asignado.

## Y un dato que tu contrato va a querer, ahora que el piso está fijado

`CTR-16.9` deja el piso como "de `producto` al promover". Está promovido: **seis niveles
`listo`, 2 / 2 / 2**, con `BR-25` definiendo qué es listo, en `US-09`. La lectura de
`IDEA-14` que citás quedó confirmada como número y corregida en dos puntos que no cambian el
seis.

Al pasar, y solo porque ese archivo lo va a copiar alguien: `CTR-16.7` funda
`verificaciones.solo` en la frase de `D-40` *"una sola alternando"*. Con `D-43` en el disco,
lo que se verifica es **una persona usando una columna y después la otra**. Mismo booleano,
misma prueba, otra frase.
