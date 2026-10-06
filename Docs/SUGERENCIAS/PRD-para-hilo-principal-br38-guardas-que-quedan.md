# De `producto` para el hilo principal — `BR-38`: las guardas que quedan después de la lectura de `REV-20`

> **[Aplicada 2026-10-06 por el hilo principal.]** El comentario de la línea 333, y tres pruebas
> nuevas en `banco.test.ts`: el consumo como verbo en opciones y bajadas (la lista de frases de
> acá, con su caso en rojo y los que tienen que pasar), la merca fuera de nombres, bajadas, sellos y
> líneas que cantan, y ningún dígito en lo que se lee. Las tres entradas anchas quedan como están,
> con un comentario que dice que manda el motivo. El hueco 6 sigue sin guarda, como pide `producto`.

> **Fecha:** 2026-10-06 (ronda final de `REV-20`). **Estado: abierta.** Nada bloquea el banco.
> **Consume:** `BR-38` («Huecos conocidos» 2 a 7 y «Lo que `REV-20` leyó del banco»),
> `src/lib/dos-ejes/banco.test.ts`. Las guardas son del hilo principal (`D-57`, consecuencias);
> `producto` fija el criterio, no las palabras.
>
> **Qué leyó `REV-20`:** los huecos 2 a 7 pasan. Lo que sigue son propuestas para dejar a la
> máquina lo que hoy cuesta una lectura, y una nota sobre tres entradas de las listas que ya
> están.

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `banco.test.ts`, comentario del test «lo que se toma o se fuma nunca separa los polos» (línea 333) | «Eso lo lee `REV-20` (`CNT-31` §4).» | «Eso lo lee `revisor` en cada `REV` que toque el banco (`CNT-31` §4, `BR-38`).» | `REV-20` ya lo leyó, y `BR-38` dice ahora la misma frase |
| `banco.test.ts`, prueba nueva (hueco 2): la merca fuera de las opciones | No existe | Recorrer **nombres, bajadas, sellos y líneas que cantan** con la lista «la merca como elección» de `VETOS_DE_LAS_OPCIONES`. No recorrer enunciados: ahí la merca puede estar, como paisaje (`EJ-049`) | `REV-20` midió 0 casos fuera de `EJ-049`; la guarda cuesta cero hoy y vigila el día que alguien la ponga en una bajada |
| `banco.test.ts`, prueba nueva (hueco 3): el consumo como verbo, en **opciones y bajadas** | No existe | Una lista **de frases con su objeto**, no de verbos sueltos. Punto de partida: `me sirvo`, `servime`, `brindo`, `brindamos`, `brindar`, `fumo`, `fumamos`, `fumar`, `me fumo`, `tomamos algo`, `tomo algo`, `tomar algo`, `chupo`, `chupamos`, `me emborracho`, `emborrach*`, `me pongo en pedo`, `le doy una pitada`. **Fuera de la lista:** `pego una`, `me clavo`, `me mando una`, `me mando otra`, `me prendo uno` (cazan «Pego una vuelta», «Me clavo en la fila»…), y `tomo` o `tomo una` sueltos. `me tomo una` y `tomamos una`, probarlas antes de sumarlas contra «Me tomo una pausa». Tiene que dejar pasar «Lo tomo como viene» (`EJ-046` B), «La noche toma forma» (`CU-2`), «Tomo una foto», «Me tomo mi tiempo» y «Lo paso y sigo charlando» | La lectura propuso una lista y sus verificadores mostraron que cuatro entradas cazan frases comunes. El criterio es de `BR-38` (hueco 3) |
| `banco.test.ts`, prueba nueva (hueco 5), **opcional**: cifras | No existe | `/\d/` sobre enunciados, opciones, sellos, líneas que cantan, nombres y bajadas | 0 dígitos hoy; los lugares con nombre no se cuentan por lista (lista abierta) y quedan por lectura |
| `banco.test.ts`, entradas `tan fuerte que` y `zumb*` de «la música que molesta», y `trapo*` de «la banda como credencial» | Presentes. Cazan «suena tan fuerte que llega a la calle», «Zumba el bombo» y «Le paso un trapo» | **No tocarlas hoy.** Afinarlas el día que `contenido` necesite una de esas frases, antes de reescribir la escena | `BR-38`: lo que cae es la queja, no el volumen, y lo vedado es el trapo-bandera, no el de limpiar. Si lista y motivo se contradicen, manda el motivo. El banco de hoy no usa ninguna |
| Hueco 6, temas por su título | Sin guarda | **No pido guarda.** Si algún día se escribe, tiene que exceptuar «pogo» (también es un tema de *Último bondi a Finisterre*, y acá es el ritual) | `REV-20`: 0 de 104 títulos aparecen enteros, salvo «pogo» |

## Cómo se verifica

```
node --test src/lib/dos-ejes/banco.test.ts
rg -n 'lo lee .REV-20.' src/lib/dos-ejes/banco.test.ts
```

El segundo no tiene que devolver nada cuando se cambie el comentario de la línea 333 (hoy
devuelve esa línea).
`producto` no ejecuta (`D-12`).
