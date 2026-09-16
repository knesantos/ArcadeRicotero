# De `arquitectura` para `experiencia` — seis cosas que salieron de medir la hoja de sprites

> Escrito el 2026-09-16, ciclo 15, al escribir `CTR-15`
> (`Docs/ARQ/ARQ-atlas-de-sprites.md`). Ninguna de las seis es mía: todas caen del lado de
> `UX-04` o de una decisión de `producto`. Las dejo nombradas y con el dato al lado para que
> no haya que volver a medir.
>
> **Corregido el mismo día, después de `REV-14`.** Los números de `§6` estaban mal y los
> cambié: ahora mandan los tuyos. Dejo el archivo con la corrección adentro en vez de
> borrarlo, porque el `§6` viejo es lo que te llegó primero.
>
> **Lo que `CTR-15` sí fija** y no vuelve a discutirse acá: tile de **16 × 16 px nativos**,
> celda de personaje de **16 × 24 px nativos** (32 × 48 px CSS a ×2, `FIND-55`), caja de
> colisión de **10 × 20 px nativos** igual para los dos, alfa binario, un atlas por personaje
> en `public/sprites/`, versión en el nombre del archivo. Lo de abajo es lo que ese contrato
> **deja explícitamente abierto porque es tuyo**.

## 1. La hoja dice "Sombrero Fedora" y la ficha dice Panamá beige

`RES-64.3` fichó, con dos URL y fecha, *"sombrero Panamá beige"*. La hoja que trajo el
usuario rotula *"Sombrero Fedora"*. Son dos sombreros distintos.

**No lo resuelvo yo y no es urgente para el motor.** Pero tiene un costado práctico que sí es
técnico: **el rótulo está pegado adentro del PNG**, así que no se corrige editando un texto —
se corrige en el dibujo, o no se corrige. Y el sombrero es la insignia que hace reconocible a
la figura en miniatura (lo midió el ensayo del 2026-09-11), así que la forma del ala no es
decoración.

Tres salidas, sin recomendar ninguna: se redibuja el sombrero según la ficha; se deja como
está y el sitio nunca lo nombra en texto (una insignia dibujada no afirma nada); o alguien
decide que el rótulo de la hoja está mal y no pasa nada porque la hoja no se publica.

## 2. Faltan tres poses, y una de ellas bloquea `D-40`

La hoja trae, por personaje: quieto de frente 3/4, quieto de perfil, quieto mirando a la
derecha, corriendo, saltando y cayendo. **No trae:**

- **el cuadro del personaje en pausa** — el que juega solo deja a uno quieto y tiene que ver
  de un vistazo cuál está manejando. `CTR-15.7` lo llama `enPausa` y lo declara obligatorio,
  porque sin él el camino de un jugador de `D-40` no se puede jugar. Y ojo: no se puede
  comunicar solo con color (`diseno-marca.md`);
- **el ciclo de caminata de varios cuadros** — hay una sola pose de correr;
- **la animación de derrota**, que `D-42` precisión 2 dejó **bloqueante antes de animar**.
  **`UX-29` la contestó el mismo día y la respuesta fue que no va ninguna**: al fallar se
  mueve el lugar, no el muñeco. `CTR-15.7` quedó corregido —cinco filas y ni una de derrota—
  y `CTR-17.1` perdió el efecto de sonido que le correspondía (`FIND-57`).

## 3. La hoja puede no estar sobre grilla, y eso cambia el trabajo

Esto es lo más caro de los seis y conviene mirarlo antes que nada. `D-41` punto 1 manda
`image-rendering: pixelated` y escalado por múltiplos enteros. **Eso solo funciona si el
dibujo está sobre una grilla de píxel de verdad.** Un dibujo *con estética* de píxel pero con
bordes suavizados no es lo mismo: escalado con `pixelated` no da pixel art, da barro.

`CTR-15.2` deja el comando que lo mide con el `sharp` que el repo ya tiene —es un PNG, así que
el problema de librsvg del ensayo no aplica— y los tres desenlaces escritos. Si el resultado
es "no está sobre grilla", **la pieza hay que cuantizarla**, y eso es dibujo, no un paso
técnico.

## 4. El contraste sobre superficie dibujada — **ya lo resolviste; queda una corrección**

`D-41` consecuencia 3 te lo dejó, y el ensayo del 2026-09-11 ya lo cazó: sobre piso claro la
figura casi desaparece, porque la tinta está calibrada para `--fondo`, que es oscuro.
`contraste.test.ts` mide pares declarados en CSS y adentro del área de juego el fondo es un
tileset.

**Lo que aportaba: dónde se puede hacer corrible.** `CTR-15.4` exige que la paleta vaya
declarada como lista en el JSON de la pieza, para que un test mida cada tinta de figura
contra cada tinta de terreno sin abrir un PNG — un PNG no se audita, una lista sí.

**`UX-27 §5` lo cerró, y con eso caen dos cosas de `CTR-15.4` que corregí** (`FIND-60`):

1. **El tope es 16 para toda el área, no 32 por atlas.** Manda tu número; el mío habría dado
   96 tintas entre tres archivos. El auditor de `T-243` se escribe contra 16.
2. **La lista del JSON pasa a ser de nombres de token, no de hexadecimales** —
   `["--px-clave", "--px-luz", …]`. Es por lo que vos misma escribiste: si los 16 hex viven
   en `tokens.css`, ponerlos también en tres JSON es tener cuatro lugares donde repintar y
   tres donde olvidarse, y `diseno-marca.md` dice que un hex vive en un solo lado. El JSON
   declara **cuáles de las 16 usa la pieza**; el hex lo resuelve el auditor contra la hoja.

## 5. La convención del píxel va en `public/arte/README.md`, y `public/sprites/` es carpeta aparte

`D-41` consecuencia 1 te dejó escribir la convención del píxel al lado de la del recorte y
decir cuál rige dónde. `CTR-15.5` toma una decisión que te toca saber: **las piezas de píxel
viven en `public/sprites/`, no en `public/arte/`**. El motivo es que el README de
`public/arte/` manda *"borde tipo tijera, nunca vector liso"*, que es lo contrario de lo que
pide una pieza de 32 px, y dejarlas juntas obliga a que ese README diga dos cosas
incompatibles.

Con la carpeta separada, la respuesta a "cuál rige" es la carpeta, y tu README solo tiene que
apuntar a la otra.

**Esto chocó con `UX-27`, que manda `public/arte/pixel/`, y el choque es `FIND-56`.** Lo
resolví y la corrección te la pido en
`Docs/SUGERENCIAS/ARQ-para-experiencia-la-carpeta-y-el-recorte-a-mano.md`. La frase de acá
—*"si preferís otra cosa, decilo"*— ya no corre: el revisor pidió una sola respuesta y la
respuesta es `public/sprites/`.

## 6. La resolución de la pantalla — **acá me equivoqué yo y el número es el tuyo**

Lo que decía este punto: *"`ADR-08.3` fija el área de juego en 416 × 192 píxeles lógicos =
26 × 12 tiles… Si el reparto no entra, **el que se mueve es el 416×192**: decímelo y lo
cambio."*

**No entró, y lo cambié.** `UX-27 §2` y `UX-28 §2` fijaron **240 × 144 nativos · 15 × 9
tiles · escala ×2 · 480 × 288 px CSS**, y esos son los números que quedan en `ADR-08.3` y
`CTR-15.3` desde `FIND-55`. Tus cuentas cierran y las mías no: 416 nativos a ×2 serían 832
px CSS, que no entran al lado de dos columnas de mando de 112.

**La lección que dejo escrita, porque el choque no fue por el número:** los dos documentos
escribíamos **"32 × 48"** y queríamos decir cosas distintas — vos la celda en píxeles CSS a
×2, yo la celda en píxeles nativos. A partir de ahora, en todo `Docs/ARQ/` cada medida dice
**nativa** o **CSS** en cada mención. Te pido lo mismo del lado de `Docs/UX/` cuando toques
`UX-27 §2`: es la línea más barata de escribir y la que nos habría ahorrado el hallazgo.
