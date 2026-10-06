# CNT-para-hilo-principal — el lugar de la portada a 320 px (`FIND-120`, `REV-20`, `D-62`)

De `contenido` al hilo principal, 2026-10-06. **Es código del hilo** (`src/lib/sitio/copy.ts`): acá solo va la línea y por qué. Nada de esto toca el banco ni las tarjetas.

**El problema** (`REV-20`, `FIND-120`; el hilo lo midió y decidió arreglarlo porque es una regresión del ciclo 19). `LUGARES.dosEjes` pasó de *Entrá con la campera puesta.* (28 caracteres) a *Traés barro seco en las zapatillas.* (35) en `a596435`. A 320×568 la línea parte en dos renglones y `#empezar` termina en 587 (19 px bajo el pliegue); con la frase vieja terminaba en 565, el número con que se había cerrado `FIND-111`. A 360 y 375 no cambia. **Medido por el hilo:** hasta 30 caracteres entra en un renglón a 320 y el botón vuelve a 565 (*Traés barro en las zapatillas.* 30, *Tenés barro en las zapatillas.* 30, *Barro seco en las zapatillas.* 29).

## 1. La línea

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/sitio/copy.ts` · `LUGARES.dosEjes` (línea 133) | `'Traés barro seco en las zapatillas.'` (35 caracteres, 6 palabras) | **`'Traés barro en las zapatillas.'`** (30 caracteres, 5 palabras) | **Una línea, de las que el hilo midió que entran.** Registro 1 del lugar: segunda persona y voseo, como todos los demás lugares (*Tenés…*, *Se te cae…*, *Te falta…*); una imagen física y barata (el barro, las zapatillas); no explica nada. Trae el barro de la vuelta y **su objeto**: *zapatillas* es el mismo de *Zapatillas embarradas, llave en la puerta.*, que es de lo que se trataba el cambio de `a596435` (el portal y la última hoja comparten objeto). Es lo que pidió el usuario con *«lo primero no puede faltar»*: la portada ya trae el barro. No lleva *seco*: ese es el costo, y está dicho |
| `src/lib/sitio/copy.ts` · el comentario de `LUGARES` sobre `dosEjes` (líneas 131-132: «la imagen pasa a ser la de la vuelta (el barro seco)») | dice *el barro seco* | «la imagen pasa a ser la de la vuelta (el barro en las zapatillas); a 320 px el renglón no puede pasar de 30 caracteres (`FIND-120`)» | Que el comentario no diga lo que el código ya no hace, y que la próxima vez que alguien toque la línea sepa el techo |

**Cómo comparé las que entran** (estimación a mano con las métricas de DejaVu Sans, sin medir en un navegador; vale solo para ordenarlas y lo decisivo es lo que midió el hilo). Con la raya inicial (`.donde-estas::before`): *Traés barro en las zapatillas.* ≈ 15,8 em; *Tenés barro en las zapatillas.* ≈ 16,0 em (la que el hilo midió que entra); *Barro seco en las zapatillas.* ≈ 15,3 em; *Traés barro seco en las zapatillas.* ≈ 18,4 em (la que parte). La que propongo es más angosta que una de las medidas que entran.

**Las que descarté:**

- *Barro seco en las zapatillas.* (29, medida por el hilo, entra). Conserva *seco* y las zapatillas, pero pierde la segunda persona y es la única de todos los lugares sin ella. Es la alternativa si el hilo prefiere *seco* a la persona.
- *Traés barro seco en las zapas.* (29). Conserva persona y *seco*, pero *zapas* parte el objeto que comparte con la última hoja y es más ancha que las dos medidas que entran (≈ 16,5 em). No la medí y no me arriesgo a que vuelva a partir.
- *Traés barro seco en la suela.* (29). Mismo ancho que la propuesta, pero *la suela* ya no es el objeto de la última hoja.
- Volver a *Entrá con la campera puesta.* (28). Entra, pero la campera era el eco de la línea que canta de la previa y esa cambió en `D-62` (`CNT-31` §10).

## 2. Un dato para `experiencia`, que lo decide ella

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `Docs/UX/UX-36-la-noche-en-pantalla.md` §9, el presupuesto del renglón del lugar | «≤ 8 palabras, 1 renglón (≤ 40 caracteres)» | «≤ 8 palabras, 1 renglón: ≤ 40 caracteres medidos a 360 y a 375 (con 35 entra); **a 320 con la pila de Linux, el techo medido es 30**» | `REV-20` midió 35 caracteres en dos renglones a 320 y 30 en uno. El presupuesto de 40 era cierto para la mayoría de los lugares, que miden entre 33 y 41, y lo es a 360 y a 375; a 320 no. Si `experiencia` lo prefiere en otra forma, es suya. Pasa por el hilo porque `contenido` no escribe en `Docs/UX/` |

## 3. Cómo se verifica

No corrí nada (`D-12`). Lo corre el hilo principal, con lo que ya midió:

```
node --test src/lib/voz.test.ts
# a 320x568, #empezar.bottom <= 568 en la portada de /juegos/dos-ejes/ (el cierre de FIND-111 fue 565)
```

`ESTADO.md` cuenta el lugar como reabierto (el bloque del ciclo 19): se cierra cuando la línea entre.
