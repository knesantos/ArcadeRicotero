# El reparto de `UX-28 §2` no tiene lugar para la cabecera, y a 812 × 375 eso se ve

> **De:** el hilo principal. **Para:** `experiencia`. **Fecha:** 2026-09-22.
>
> Salió de mirar `T-240` en el navegador, que es lo que la tarea dejó declarado como "no
> tiene comando, se mira a ojo". **Las medidas de `T-240` están bien**: las verifiqué una
> por una y son exactas. Lo que no cierra es la cuenta de `UX-28 §2`, y es tuya.

---

## Lo medido, a 812 × 375

Todo en píxeles CSS. Primero lo que **sí** da, para que quede claro que el problema no es
la hoja de estilos:

| Pieza | `UX-28 §2` pide | Mide | |
|---|---|---|---|
| Ancho total | 112 + 8 + 480 + 8 + 112 = **720** | **720** (grilla `112px 496px 112px`) | ✅ |
| Área de juego | **480 × 288** (×2) | **480 × 288** | ✅ |
| Alto del mueble | **324** | **324** | ✅ |
| Tecla de dirección | **52 × 64** | **52 × 64** | ✅ |
| Tecla de saltar | **112 × 244** | **112 × 244** | ✅ |
| Zona de pulgar | ≥ `--toque-min` (48) | mínimo 52 | ✅ |

`T-240` clavó el reparto. **El problema es que el reparto no cierra contra la pantalla.**

## El choque, en una línea

> **`UX-28 §2` reparte los 375 px de alto entre el mueble (324) y 30 de aire. Esa cuenta no
> tiene una cabecera adentro, y la cabecera existe.**

El enlace de volver al arcade mide **48 px de alto**, porque tiene que poder tocarse. Y
entonces:

```
  48  (cabecera: volver + interruptor de la cinta)
+ 324 (el mueble)
-----
  372  en 375  →  sobran 3
```

Los "30 px de aire que se reparten arriba y abajo" **no existen**: existen tres, y solo si
ni el `main` ni el mueble suman un píxel de margen.

## Lo que pasaba antes de tocar nada, para que se vea el tamaño del asunto

El documento medía **622 px de alto en una ventana de 375**. El mueble arrancaba en y = 152
y terminaba en y = 476: **101 px fuera de la pantalla**. Las cuatro teclas de dirección
quedaban invisibles — y son justo las que `UX-28 §2.2` pone donde cae el pulgar de la mano
que agarra, las que se mantienen apretadas. **Había que scrollear para poder correr.**

## Lo que hice, que es lo mínimo y no es diseño

Dos cosas, las dos acotadas al `@media (min-width: 720px) and (max-height: 500px)`:

1. **Saqué la bajada del casete.** Acostada se parte en seis líneas y se come 136 px ella
   sola, contra los 51 que hay. No se pierde: sigue en el `<meta name="description">` y el
   `h1` queda a la vista. Y hay un argumento además del espacio — la bajada es **la que
   canta** (`voz-ricotera.md` §5), y su trabajo es que entres, en el casete del portal.
   Adentro ya lo hizo; lo que manda en esta pantalla es el registro 3.
2. **Llevé el aire a cero** en el `main` y en el mueble, que es lo único que permite que
   entre por esos tres píxeles.

**Resultado medido:** el mueble va de y = 48 a y = 372, las seis teclas entran, y
`teclasFuera = 0`. El juego completo se ve sin scrollear. (Queda scroll de página por el
`PieImprenta` del sitio, que va después del `main` y es igual en todas las pantallas de
juego — eso no es del juego.)

## Por qué esto igual es tuyo y no lo cierro yo

Que entre por tres píxeles **no es un reparto, es un empate técnico.** Y el ancho, en
cambio, sobra: a 812 quedan **92 px libres** (812 − 720), 46 por lado. `UX-28 §2` ya
contempla que ese sobrante lo tomen las columnas hasta 140, pero **hoy está vacío**.

Tres salidas que se me ocurren, y ninguna la elijo yo porque el reparto de la pantalla es
de `experiencia`:

- **La cabecera se va al aire lateral.** Hay 46 px por lado sin usar y la cabecera no tiene
  por qué ser una franja horizontal. Deja los 30 px de aire de `§2` intactos.
- **La cabecera se atornilla al mueble**, como ya hiciste con el pie de homenaje en su
  chapa. Un fichín de verdad tiene el botón de salir en el gabinete, no arriba flotando.
- **`§2` se reescribe con la cabecera adentro** y el mueble baja de 324. Es la más cara: el
  alto sale del área, y `UX-27 §2.1` dice que el área no se deforma.

## Lo que hay que decidir aparte, y es lo que más me preocupa

**375 no es el peor caso.** `UX-28 §2` ya contempla el teléfono con muesca para el ancho
—724 útiles de 812— pero **no hace la cuenta equivalente para el alto**. Un teléfono con
barra de gesto abajo deja menos de 375 útiles, y ahí los tres píxeles ya son negativos.

La propia tabla de `§2` dice *"entra en 354, que es 375 menos la barra de gesto de abajo"*.
**Con 354 útiles, 48 + 324 = 372 no entra: faltan 18.** O sea que el caso que tu propio
documento declara como el real ya está roto hoy, y no lo arregla ajustar márgenes.

Es el mismo tipo de hallazgo que `FIND-55`: dos documentos que hacen cuentas distintas
sobre la misma pantalla. Acá es un solo documento haciendo dos cuentas.

---

# Addendum del 2026-09-22: el rótulo de carga tampoco entra, y ahora la pantalla publicada está muda

> Escrito después de `T-247`. El problema de arriba se arregló; este es su consecuencia, y
> es peor porque **ya se ve en lo que se publica**.

## Qué pasó

La revisión adversarial encontró, por cuatro lentes independientes, que el rótulo de carga
(`Acá va el juego.`) se pintaba **adentro del área de juego** — contra `UX-27 §5.1`, que no
admite excepción: *"Adentro del área no hay texto. Ninguno. Ni rótulos"*.

Se corrigió: el rótulo salió de `.recorte`. Pero **afuera no había lugar**, así que en
horizontal quedó visualmente oculto (`clip-path: inset(50%)`, caja de 1 × 1), visible solo
para lectores de pantalla.

## Lo que se ve hoy en lo publicado, medido en `dist/`

En producción el banco sale con **`"niveles":[]`** —correcto: `NIV-01` sigue en `borrador`
hasta que `T-249` lo juegue—, así que **el motor no baja y nunca dibuja**. El rótulo no es
un cartel de 114 ms: es **el estado permanente de la pantalla**.

Y en horizontal está oculto. Entonces lo que ve la persona que entra al juego, en la
orientación en la que el juego se juega, es:

> **Un rectángulo negro de 480 × 288, seis teclas que no hacen nada, y ni una palabra.**

**Eso es un molinete**, y de los que `D-14` nombra con todas las letras: *"el que llega sin
idea juega igual"*. Acá el que llega sin idea no tiene de dónde agarrarse. Es peor que el
defecto que vino a arreglar: un rótulo mal ubicado se lee; una pantalla muda, no.

## Por qué no lo arreglé yo

Porque no hay dónde ponerlo, y eso no se arregla con CSS. Medido a 812 × 375:

| | |
|---|---|
| Alto del gabinete | 324 |
| Área | 296 |
| Chapa del pie (homenaje, obligatorio por `D-42`) | 24 |
| **Hueco libre** | **4 px** |

La línea del vertical ya está en `display: none` en horizontal —bien, ahí no tiene
sentido— y su lugar tampoco alcanza. Las columnas de mando están llenas (244 de saltar + 16
de aire + 64 de dirección = 324). Y arriba, la cabecera ya dejaba el reparto entrando por
tres píxeles.

## El choque, dicho como es

**Tres reglas del proyecto que, juntas, en horizontal, no se pueden cumplir:**

1. `UX-27 §5.1` — adentro del área no hay texto, ninguno.
2. `ADR-08.2` — hay un rótulo estático, y es lo que la persona mira mientras el motor
   arranca (`T-226` midió 114 ms, y hoy es permanente).
3. `UX-28 §2` — el reparto de la pantalla, que no deja un píxel libre para ese rótulo.

No es un defecto de implementación: **es el reparto que no contempló el caso.** Cualquiera
de las tres que se toque resuelve, y cuál se toca es tuyo.

## Cuatro salidas, ninguna elegida acá

- **El mueble apagado no es el área.** Distinguir el canvas *dibujando* del canvas
  *apagado*: mientras el motor no dibuja no hay área de juego, hay un fichín apagado, y un
  cartel sobre un fichín apagado no es texto mezclado con píxeles — que es lo que `UX-27
  §5.1` quiere impedir. Es la más barata y la que menos mueve, pero **hay que escribir la
  excepción en `UX-27`**, no dejarla implícita.
- **El rótulo toma la chapa y el pie de homenaje se va a otro lado** dentro del mueble.
  Cuesta tocar `D-42`.
- **El reparto baja a ×1 en horizontal apretado** y libera 144 px de golpe. Es tu `§2.2`
  nueva — pero ojo con lo que ya detectó `T-247`: si se aplica, la línea *"De costado se ve
  el doble de grande"* (`CNT-18`) **pasa a mentir**, y `UX-28 §4` dice que el doble es lo
  único que esa línea promete. Arrastra a `contenido`.
- **El rótulo va afuera del mueble**, en los 92 px de ancho que sobran a 812.

## Dos cosas más que quedaron sueltas y son tuyas

- **`UX-28` tiene hoy dos secciones numeradas `§2.2`** (`:117`, el agarre; `:135`, la nueva
  del alto). Dos ramas con el mismo número es exactamente cómo nació `FIND-55`.
- **En vertical (375 × 812) las teclas de dirección quedan abajo del borde**: se ven los dos
  bloques de saltar y hay que scrollear para correr. Mismo defecto que ya se arregló en
  horizontal, en la otra orientación.
