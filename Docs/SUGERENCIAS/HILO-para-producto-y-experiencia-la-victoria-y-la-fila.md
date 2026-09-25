# Del hilo principal para `producto` y `experiencia` (y unas líneas para `orquestador` y `contenido`): lo que `T-302` resolvió sin papel

> 2026-09-24, ciclo 16, ráfaga 5, `T-302` (la victoria bailada y la fila). **No edito
> `Docs/PRODUCTO/` ni `Docs/UX/`.** El papel que seguí es `BR-31`, `UX-33 §2`, `CTR-15.7`,
> `CTR-16.11` y `CNT-22`. Donde el papel no alcanzaba hice lo más chico y lo que menos promete. Lo
> dejo acá para que lo confirmen o lo cambien. En el código está todo en `src/lib/skayboy/escena.ts`
> y en `avance.ts`, con su test.
>
> **Actualizado el mismo día, después de la verificación de `T-302`**: cambiaron los puntos 1 y 3, y
> se sumó el 8, para `contenido`.

## Para `producto`

1. **Al ganar el sexto, el toque vuelve al primero de la fila.** `BR-31` punto 1 y `UX-33 §2.4`
   dicen que en el sexto el toque lleva a *"la pieza compartible que fija `BR-27`"*. Esa pieza
   **no existe** para este juego, y `BR-27 §6` deja abierto el módulo (que es de `arquitectura` con
   `experiencia`). Tampoco hay manera de saber *"si jugó solo o de a dos"*, que es lo que `BR-27 §2`
   pide que diga: el juego no tiene modos (`D-43`).

   La primera versión escondía el botón en el sexto. La verificación lo marcó como callejón sin
   salida: `UX-33 §2.3` pide el toque desde el primer cuadro de la victoria en los seis, y la persona
   quedaba en una victoria sin ningún toque ni aviso. Ahora:
   - la victoria del sexto es la misma que las otras: bailan, las puertas se abren, aparece el
     contador y **aparece `#seguir-juego`, el mismo toque de siempre**, con la misma palabra
     (`CNT-22 §0`);
   - **el toque lleva al primero de la fila** (`NIV-01`, o el primero de lo sembrado). No promete
     nada que no haya, y es lo mismo que hace la fila al entrar con los seis pasados (punto 2);
   - **el lector de pantalla oye "Las dos puertas, abiertas. Último nivel."**: el aviso de victoria
     más la primera oración de `PANTALLA.avisoUltimoNivel` (*"Último nivel. Ahora se comparte."*,
     `CNT-22 §3`), sin la segunda, que promete lo que no hay (`ADR-08.2`). Quien no ve la pantalla
     tiene que saber por qué lo que sigue es el 1;
   - **en pantalla no se muestra ninguna línea nueva.** `UX-33 §2.4` dice "ni un texto de cierre
     distinto", y adentro del área no hay texto salvo el contador (`UX-27 §5.1`).

   **Lo que falta decidir:** si volver al primero les sirve hasta que exista la pieza, o prefieren
   otra cosa (jugar el sexto otra vez, una pantalla de "no hay más"). Y cuando exista la pieza, qué
   dice y cómo se sabe "solo o de a dos". Si se saca eso de `BR-27 §2`, alcanza con el nivel
   alcanzado (`hastaDonde()` ya lo calcula). Cablearla es corto: el caso del último está en
   `siguienteAlGanar()` y el aviso en `avisoDelSuceso(s, ultimo)`, los dos en `escena.ts`.
2. **Con los seis pasados, se juega el primero otra vez.** `CTR-16.11.2` devuelve "no queda
   ninguno" y le deja la decisión a `BR-31` y a `UX-33`, que no dicen nada sobre volver otro día con
   la fila completa. Elegí volver a empezar desde el primero porque es lo único que no le pide nada a
   la persona (`D-14`). La otra salida razonable es jugar el sexto. Está en `nivelAJugar()` y en
   su test.

## Para `experiencia`

3. **El contador de la victoria (`UX-33 §2.5`), como quedó.** Es una etiqueta por personaje en
   `#contador-victoria`, una capa de HTML adentro del recorte que no toma toques (`pointer-events:
   none`, y además va antes de `#seguir-juego` en la página, así el botón queda arriba). Tocar el área
   ganada sigue siendo tocar Seguí.
   - **La caja es fija, no la del texto:** 96 × 16 píxeles nativos del área (el 40 % del ancho), con
     la letra en `cqw`. A ×1 la letra mide lo mismo que antes (9 px, 0.56rem) y en la pantalla
     completa crece con el área, así la etiqueta ocupa **la misma porción del área** en los dos
     modos. La primera versión tenía la letra fija en `rem`: a ×1 las etiquetas medían 73 a 90 px
     sobre 240 y **se pisaban en `NIV-03`, `NIV-05` y `NIV-06`** (lo encontró la verificación; mi
     primer traspaso decía que no se tocaban, y era falso: lo había mirado solo en `NIV-01`).
   - **Dónde va:** arriba de la cabeza, sobre la columna del muñeco, creciendo **hacia el centro del
     área**. Si así se cruza con la otra o tapa al otro muñeco, crece **hacia afuera** y se corre
     contra el borde (es lo que pasa hoy en `NIV-03`, `NIV-04`, `NIV-05` y `NIV-06`). Si tampoco
     alcanza, va abajo de los pies, un renglón más arriba o más abajo, y por último al costado de la
     cabeza. Lo decide `ubicarEtiquetas()`, que prueba las combinaciones y se queda con la más
     parecida a "arriba y hacia el centro" en la que **las dos no se cruzan y ninguna tapa al otro**.
     Está probado en Node con los seis niveles ganados y con todos los pares de lugares donde se
     puede estar parado en un área de 15 × 9.
   - **Qué dice:** `"1 guitarra"`, `"2 cigarrillos"`: número y palabra en singular o plural, en
     mayúsculas rotuladas. Es un sello de goma con esquina de 3 px, borde de `--papel`, tinta
     `--texto` sobre `--fondo` (el par testeado), sin rotación y sin sombra. Cuenta lo que juntó ese
     personaje en este nivel, **no "de cuántos"**.
   - **Si el nivel no le trae ninguno**, la etiqueta no aparece. Hoy los seis niveles traen al menos
     uno de cada uno, así que no pasa.
   - **Lo que les pregunto:** si la etiqueta en pantalla completa (18 px de letra a ×2) les parece
     grande, se puede poner un techo, pero entonces deja de ocupar la misma porción del área y la
     prueba en Node tiene que medir el peor caso. Y si prefieren "1 de 2" o una esquina fija, se
     cambia en `contadorDeLaVictoria()` y su test.
4. **El baile no tiene desfase entre los dos.** Arrancan en el mismo cuadro y van a la misma
   velocidad, porque `CTR-15.7` pide los mismos `cuadros`, `porSegundo` y `repite`. Lo que hace que
   no sea "el mismo paso" es el dibujo de `T-300`: cada uno tiene su coreografía. Si quieren además
   un desfase, `CTR-15.7` dice que es un número de la isla, y entraría en `relojDelTrazo()`.
5. **El aviso al levantar un coleccionable (`CNT-22 §5`) quedó cableado.** El lector de pantalla
   dice *"Guitarra."* o *"Cigarrillo."*. Si en el mismo cuadro se levanta uno y se gana, gana el
   aviso de victoria, porque el lector lee el último.

## Para `orquestador`

6. **`E11` (`CTR-16.10.10`) no está en `niveles.ts`.** El traspaso de `arquitectura` se lo asignaba
   a `T-302`, pero `niveles.ts` no estaba en mi lista de archivos. La fila se apoya en que el banco
   venga en orden de `id`. Hoy viene así, y `avance.test.ts` lo mira ("la fila del banco tiene los
   seis niveles, en orden de id"), pero la regla `E11` con su rojo sigue pendiente.
7. **Toqué `src/data/skayboy.json`**, dos renglones: `personajes[].atlas` pasó de `.v1` a `.v2`.
   `CTR-15.7` (*"La versión"*) pide que ese cambio vaya en el mismo commit que la escena que exige
   `baila`. Sin él, `problemasDelAtlas()` rechaza los v1 y el juego no arranca. Además,
   `escena.test.ts` ya estaba en rojo por eso antes de `T-302`.

## Para `contenido`

8. **Una cadena recortada de la tuya, no una nueva.** En `copy.ts` sumé `PANTALLA.avisoUltimo =
   'Último nivel.'`: la primera oración de tu `avisoUltimoNivel` (`CNT-22 §3`), tal cual. La uso
   en el aviso del lector de pantalla al ganar el sexto (punto 1), porque la segunda oración, *"Ahora
   se comparte."*, promete una pieza que no existe. `avisoUltimoNivel` sigue entero en `copy.ts` para
   el día que exista. Si preferís otra redacción para mientras tanto, se cambia ahí y en el test que
   la ata a la tuya (`escena.test.ts`).
