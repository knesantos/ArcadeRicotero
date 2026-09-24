# El escritorio tiene el mismo agujero que tenía el teléfono: los escalones ×3 y ×4 no cuentan la cabecera

> **De:** hilo principal (`T-271`, ciclo 16, ráfaga 2). **Para:** `experiencia`.
> **Fecha:** 2026-09-23. **Pide:** enmendar `UX-28 §5` (los umbrales del escritorio). No
> bloquea nada del teléfono.

## Lo que se midió

Con `UX-28 §2.3`–`§2.6` aplicado en `src/styles/skayboy.css`, medido en el navegador sobre
`npm run build` + `astro preview` (banco publicado vacío, `"niveles":[]`):

| Ventana | Escala | Reparto | Borde de abajo de la última tecla | Teclas fuera |
|---|---|---|---|---|
| 812 × 375 | ×1 | cabecera adentro de la columna del mueble | 324 | **0** |
| 812 × 354 | ×1 | igual | 324 | **0** |
| 667 × 375 | ×1 | igual | 324 | **0** |
| 375 × 812 | ×1 | apilado | 596 | **0** |
| 375 × 667 | ×1 | apilado | 596 | **0** |
| 812 × 401 | ×2 apretado | cabecera y encabezado acostados | 380 | **0** |
| 932 × 430 | ×2 apretado | igual | 380 | **0** |
| **1024 × 600** | **×3** | fila | **762** | **6** |
| **1280 × 800** | **×4** | fila | **834** | **4** |

El teléfono cierra en las cinco medidas de `§2.5`. El escritorio no.

(Tabla vuelta a medir el mismo día, después de darle aire al sello de volver: el apilado y
el ×2 apretado subieron 8. El escritorio no cambió. Lo del teléfono está en
`HILO-para-experiencia-lo-que-t-271-aplico-distinto-de-ux-28-2.md`.)

## Por qué

Es el mismo agujero que `§2.3` cerró para el teléfono, del otro lado de la escalera. Los
cortes de `§5` son `min-height: 520px` para ×3 y `660px` para ×4, y salen del marco solo:
×3 pide 468 de alto y ×4 pide 612. **Ninguno cuenta lo que va arriba del fichín.** Arriba de
500 de alto el encabezado no se achica (la bajada del casete entra entera, que es lo que
`§2.3` quiere cuando el alto sobra), y medido suma:

```
16 (padding de main) + 48 (cabecera) + 24 (su margen) + 254 (marca + h1 + bajada + rótulo)
+ 24 (margen del fichín) = 366 arriba del mueble
```

366 + 468 = 834 para ×3, contra 520 de corte. 366 + 612 = 978 para ×4, contra 660.

**No es de esta ráfaga.** Arriba de 500 de alto `T-271` no cambió nada que afecte la altura:
los números son los mismos que con la hoja de antes. Lo encontré porque la medición barrió
más tamaños que los cinco de `§2.5`.

## Las dos salidas que veo (decidís vos)

1. **Subir los cortes para que cuenten la cabecera:** ×3 en `min-height` ≈ 850 y ×4 en ≈ 990.
   Es la cuenta honesta, pero deja a casi todos los portátiles (768 a 800 de alto útil) en
   ×2. Eso no es un defecto: ×2 es la escala del teléfono, y el área no crece porque sobre
   pantalla (`UX-27 §2.1`).
2. **Achicar el encabezado también en el escritorio cuando la escala sube:** la misma receta
   que ya usan las otras tres franjas (sin bajada, un renglón), y así arriba del mueble
   quedan ≈ 90 en vez de 366. Entonces ×3 entra con ≈ 560 y ×4 con ≈ 700. Pero es la bajada
   la que se va justo donde más lugar hay, y `§2.3` hoy dice que arriba de 500 se queda.

Sea cual sea, el cambio es en `skayboy.css` (umbrales de media query) y lo aplica el hilo
principal. El comando que tiene que dar `teclasFuera 0` es el fragmento de medición que
dejó `T-271` en su reporte, a 1024 × 600, 1280 × 800 y 1440 × 900.

## Siguiente

`experiencia`: enmendar `UX-28 §5` con una de las dos salidas (u otra) y la cuenta del alto
de arriba del mueble. Después, el hilo principal ajusta los dos `@media` del escritorio.
