# Lo que `T-271` aplicó distinto de `UX-28 §2`, y los dos tamaños que la tabla no mide

> **De:** hilo principal (`T-271`, ciclo 16, ráfaga 2, vuelta de la verificación).
> **Para:** `experiencia`. **Fecha:** 2026-09-23. **Pide:** enmendar `UX-28 §2.3` y
> `§2.5` para que el documento diga lo que hace el código. No bloquea nada: el teléfono
> cierra en los cinco tamaños de `§2.5` con `teclasFuera 0`.

Es el hermano de `HILO-para-experiencia-el-escritorio-tampoco-cuenta-la-cabecera.md`, que
habla del escritorio. Este habla del teléfono y de lo que quedó entre las franjas.

## 1. `§2.3` se contradice consigo mismo, y el código sigue a la tabla

La tabla de `§2.3` dice que a ×1 la cabecera vive **"arriba del mueble, en su columna"**.
El punto 2 de "Qué tiene que cambiar en el código" (líneas 334–339) dice otra cosa: que la
cabecera y el encabezado **"pasan a ser los dos primeros hijos de `.gabinete`"**.

El código sigue a la tabla. En `skayboy.css`, en la franja ×1 de costado, la grilla la arma
`#portada` y `.fichin` pasa a `display: contents`. Así la cabecera, el encabezado, el
mueble y las dos columnas de mando entran en la misma grilla, sin duplicar marcado y sin
cambiar el orden del documento.

Por qué no adentro de `.gabinete`:

- **La cinta de volver es papel.** Sobre `--papel` desaparece, y el título queda en pares
  de tinta que `contraste.test.ts` no mide. Un color sin par testeado no existe
  (`diseno-marca.md`).
- **La chapa se ensancha.** "← Volver al arcade" más el interruptor de la cinta no entran
  en 256; adentro del gabinete, el mueble crecería más allá del área.
- **`§2.3` mismo lo pide:** "no comparte renglón con el bisel ni con la chapa: tiene el
  suyo". Adentro de `.gabinete` lo compartiría.

**Pido:** que el punto 2 diga "arriba del mueble, en su columna", igual que la tabla. Si
no se enmienda, el cierre `T-280` o la próxima pasada de coherencia van a pedir que se
"corrija" el código hacia el punto 2.

## 2. La franja que no reclama nadie: 480 a 719 de ancho, más de 400 de alto

`§2.4` reclama el apilado para el ancho menor que 480. `§2.3` reclama el ×1 de costado
para 330–400 de alto. **De 480 a 719 de ancho con más de 400 de alto no lo reclama
ninguna.** El código de la primera vuelta la mandaba al apilado, que ahí pide 596. Medido
a 700 × 450: seis teclas afuera.

Lo que hace el código ahora, y es **una decisión mía que no está en `UX-28`**: esa franja
va de costado a ×1, hasta los 600 de alto, donde el apilado ya entra.

```
@media (min-width: 480px) and (max-width: 719.98px)
   and (min-height: 400.02px) and (max-height: 599.98px)   → ×1 de costado
```

| Ventana | Reparto | Borde de abajo de la última tecla | Teclas fuera |
|---|---|---|---|
| 700 × 450 | ×1 de costado | 324 | 0 |
| 600 × 599 | ×1 de costado | 324 | 0 |
| 600 × 600 | apilado | 596 | 0 |

Son ventanas de escritorio chicas y pantalla dividida, más que teléfonos. **Pido:** que
`§2.3` la escriba, o que la cambie por otra salida y el hilo principal la aplica.

## 3. Menos de 330 de alto, de costado: `§2.3` lo manda al apilado, que es lo peor

`§2.3` dice: "Alto disponible < 330: no aplica esta sección — es el ancho angosto de
`§2.4` (vertical)". Supone que abajo de 330 se está en vertical. **No siempre.** Un Android
de 360 de ancho puesto de costado, con la barra de Chrome, deja unos 640 × 280–300.

El código cumple `§2.3` y ahí cae al apilado. Medido a 812 × 329: apilado, borde de abajo
de la última tecla en 596, **seis teclas afuera**. De costado pediría 324: a 812 × 329
entraría entero, y a 640 × 290 las teclas de dirección quedarían cortadas por 34 px, no
seis teclas afuera.

**Una salida posible:** sacarle el piso de 330 a la franja ×1 de costado (ancho ≥ 480,
alto ≤ 400, sin mínimo). Entre 324 y 330 de costado entra entero; con menos de 324 no entra
nada, y de costado es el reparto que menos pierde. No lo apliqué porque `§2.3` lo dice explícito. Es un tamaño real
que la tabla de `§2.5` no mide.

## 4. A 480 justos la cuenta no cierra por 12

A 480 de ancho —el piso de la franja ×1 de costado, `112 + 256 + 112`— la cabecera no
entra en un renglón y se parte en dos. Medido a 480 × 360:

```
120 (cabecera en dos renglones, con su aire) + 36 (encabezado) + 180 (mueble) = 336
```

Son **12 más que los 324 del mando**, y el encabezado pasa el techo de ≤32 de `§2.3`. Las
teclas entran igual (`teclasFuera 0`: cuelgan de arriba de su columna). A 480 × 330 el pie
de la chapa queda 6 px abajo del borde. Es un ancho exacto y un alto exacto a la vez;
queda escrito para que la tabla no prometa 324 en todo el piso.

## 5. Tres números de `§2.3` y `§2.5` que cambiaron con el código

- **La cabecera mide 56, no 48, donde el encabezado va achicado.** El sello de volver está
  rotado y, con margen cero, se salía 2 px por arriba de la ventana y pisaba 2 px del
  título (medido a 812 × 354: el sello de −1,97 a 49,97, el `h1` desde 48). Lleva medio
  `--espacio-1` arriba y abajo. En la fila "Cabecera" de `§2.5` el medido es **76**
  (56 + 20), dentro del ≤80.
- **El apilado mide 596, no 600 ni 588.** Medido a 375 × 667 y a 375 × 812. Sobran 71 a
  667.
- **El ×2 apretado pide 380, no 372.** Medido a 812 × 401: 56 de cabecera + 324. Sigue
  entrando.

Y los cortes no son `min-height: 401px`, como dice `§2.3` punto 1: son `400.02px`. Con
`401` queda una rendija para las alturas fraccionarias (un teléfono de densidad 2,625 da
400,38), donde no manda ningún escalón. La sintaxis de rango (`height > 400px`) la cerraba,
pero Safari anterior a 16.4 y Chrome anterior a 104 no la leen: descartan la consulta y el
fichín cae al apilado a cualquier tamaño. El 0,02 cierra la rendija sin dejar afuera esos
aparatos.

## Lo medido, entero

Sobre `npm run build` + `astro preview`, banco publicado vacío (`"niveles":[]`), con el
fragmento de medición del reporte de `T-271`:

| Ventana | Reparto | Borde de abajo de la última tecla | Teclas fuera | Cabecera + encabezado | Mueble |
|---|---|---|---|---|---|
| 812 × 375 | ×1 de costado | 324 | 0 | 56 + 20 | 180 |
| 812 × 354 | ×1 de costado | 324 | 0 | 56 + 20 | 180 |
| 667 × 375 | ×1 de costado | 324 | 0 | 56 + 20 | 180 |
| 375 × 812 | apilado | 596 | 0 | 56 + 20 | 180 |
| 375 × 667 | apilado | 596 | 0 | 56 + 20 | 180 |
| 700 × 450 | ×1 de costado (§2 de acá) | 324 | 0 | 56 + 20 | 180 |
| 480 × 360 | ×1 de costado | 324 | 0 | 120 + 36 | 180 |
| 812 × 329 | apilado (§3 de acá) | 596 | **6** | 56 + 20 | 180 |
| 812 × 401 | ×2 apretado | 380 | 0 | 56, al lado del título | 324 |

## Siguiente

`experiencia`: enmendar `UX-28 §2.3` (el punto 2, la franja de 480–719 y lo de abajo de
330) y los números de `§2.5`. Si la salida de §3 se adopta, el hilo principal le saca el
piso a la consulta del ×1 de costado en `skayboy.css`, y lo verifica con el fragmento de
medición a 640 × 290 y a 812 × 329.
