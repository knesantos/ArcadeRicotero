# De `experiencia` para el hilo principal — el texto para `public/arte/README.md`, y los tokens

> 2026-09-16, ciclo 15. `public/arte/README.md` **no es mi carpeta**, así que la convención
> completa quedó en `Docs/UX/UX-27-la-convencion-del-pixel.md` y acá va el texto listo para
> pegar, más lo que hay que agregarle a `tokens.css`. Lo pega quien corresponda.
>
> Cierra la **consecuencia 1 de `D-41`**: *"`public/arte/README.md` deja de valer para todo y
> pasa a valer para el collage. Hay que escribir la convención del pixel al lado de la del
> recorte, y decir cuál rige dónde."*

---

## 1. Dónde va cada cosa en ese README

- **El bloque A** reemplaza la línea de formato del encabezado (la que hoy dice *"Formato:
  PNG con fondo transparente, borde tipo tijera (irregular, con grano — nunca vector
  liso)"*). Esa línea no está mal: está **incompleta desde `D-41`**, porque ahora hay dos
  formatos y ninguno de los dos manda en todos lados.
- **El bloque B** es una sección nueva, al final, antes de "Lo que NO va acá".
- **El bloque C** es una fila nueva para "Lo que NO va acá".

---

## 2. Bloque A — reemplaza la línea de formato del encabezado

```markdown
> **Formato: hay dos, y este README manda en uno solo.** El sitio tiene dos idiomas
> gráficos desde `D-41`, con la frontera escrita en `Docs/UX/UX-27-la-convencion-del-
> pixel.md`:
>
> | | **La imprenta** (este README) | **El pixel** (`UX-27`) |
> |---|---|---|
> | Dónde manda | Todo el sitio | **Solo adentro del área de juego** de los juegos que la tengan |
> | Formato | PNG con fondo transparente, borde tipo tijera (irregular, con grano — nunca vector liso) | PNG-32 con alfa binario (0 o 255), sin antialias, sin perfil de color |
> | Tamaño | 400–800 px del lado largo alcanza | Tile de 16 × 16 px lógicos; celda de personaje 16 × 24. Se entrega a ×1 |
> | Color | Tinta plana de los tokens | Paleta cerrada de 16 colores, declarados como `--px-*` en `tokens.css` |
> | Borde | Rasgado, de tijera | Contorno de 1 px en `--px-clave`, siempre |
> | Se escala | Libre | **Solo por múltiplos enteros**, con `image-rendering: pixelated` |
>
> **Los dos idiomas no se mezclan en la misma pieza** (`D-41` punto 4): ni un sprite con
> borde rasgado, ni un sello de goma pixelado. Cada archivo es de un lado de la frontera o
> del otro, y se sabe de cuál por la carpeta en la que vive.
```

---

## 3. Bloque B — sección nueva, antes de "Lo que NO va acá"

```markdown
## El otro idioma: el pixel art del área de juego (`D-41`)

Vive en `public/sprites/`, **fuera de esta carpeta y a propósito**: una subcarpeta acá
adentro sería la pieza compartida que `D-41` punto 4 prohíbe, y este README tendría que
mandar dos formatos incompatibles a la vez. **Nada de `public/sprites/` sigue las reglas de
arriba**, y nada de arriba entra ahí. La convención completa —grilla, paleta, alfa, escalado, el
recorte de la hoja de concepto, el inventario de poses y el mecanismo de contraste— está en
`Docs/UX/UX-27-la-convencion-del-pixel.md`. Acá va lo mínimo para no romper nada sin
tener que abrirlo:

| Regla | Valor |
|---|---|
| Tile | 16 × 16 px lógicos |
| Celda de personaje | 16 × 24 px lógicos (la figura ocupa 14 × 22, con 1 px de aire) |
| Escala | Múltiplos enteros y nada más. ×2 en teléfono, ×1 en vertical, ×3/×4 en escritorio |
| Alfa | Binario: 0 o 255. Un píxel semitransparente es antialias con otro nombre |
| Paleta | 16 colores, ni uno más, declarados como `--px-*` en `src/styles/tokens.css` |
| Contorno | 1 px de `--px-clave` en todo sprite y todo borde de tile |
| Texto adentro | **Ninguno.** Todo lo que se lee vive afuera del área |
| Archivo | PNG-32, a ×1, sin perfil de color ni metadatos |

**La hoja de concepto no es un atlas.** `public/arte/skayboy_poligirl.png` (1299 × 725) es
una lámina con el fondo opaco, las poses fuera de grilla y etiquetas pegadas adentro de la
imagen. Se queda acá: es material de origen, no una pieza de producción. No se usa como está:
hay que recortarla siguiendo los siete pasos de `UX-27 §6`, y **los dos primeros son a mano**
—está medido: las flechas de los rótulos puentean las poses y el fondo son 52 tintas, así que
no hay tijera ni "quitar fondo por color" que sirva—. **Ninguna de las palabras que trae
pegadas llega al sitio.**

**Lo que se verifica antes de dar por buena una pieza nueva:**

```
node --test src/lib/contraste.test.ts     # los 16 --px-* contra la clave, umbral 3:1
node scripts/auditar-paleta-pixel.mjs     # color fuera de paleta, o alfa intermedio
```
```

---

## 4. Bloque C — fila nueva para "Lo que NO va acá"

```markdown
- **Sprites y tiles.** Van en `public/sprites/` y siguen la convención de `UX-27`, no la
  de este archivo. Un sprite con borde de tijera es un defecto: a 16 px ese borde es ruido.
```

---

## 5. Lo que hay que agregarle a `tokens.css`

**El circuito de `.claude/rules/diseno-marca.md` manda y no lo saltea esto:** los valores
nacen en el lienzo (hoja nueva, "13 — el tubo"), de ahí bajan a `tokens.css`, y recién ahí
los usa un componente. Lo que sigue son los **nombres y el reparto**, que son míos; los hex
de los diez colores derivados los fija el lienzo.

```css
/* El tubo del fichín (D-41, UX-27). Paleta cerrada: 16 y ningun mas.
   Los dos primeros son alias, no hex nuevos: la clave y la luz del area son
   exactamente la tinta y el papel del sitio. */
--px-clave: var(--fondo);
--px-luz: var(--papel);

/* Terreno: el ancla medida de Gulp! (RES-37) mas dos escalones MAS CLAROS.
   No hay un cuarto escalon oscuro: la sombra es la clave (UX-27 §4.1). */
--px-infierno: var(--disco-gulp-tinta);
--px-infierno-2: /* del lienzo */;
--px-infierno-3: /* del lienzo */;
--px-cielo: var(--disco-gulp-apoyo);
--px-cielo-2: /* del lienzo */;
--px-cielo-3: /* del lienzo */;

/* Personajes: tres y tres. La paridad de D-38 convertida en numero. */
--px-skay-1: /* del lienzo: la paja del sombrero, RES-64.3 */;
--px-skay-2: /* del lienzo */;
--px-skay-3: /* del lienzo */;
--px-poli-1: /* del lienzo: el pelo, un escalon POR ENCIMA de la clave */;
--px-poli-2: /* del lienzo */;
--px-poli-3: /* del lienzo */;

/* Objetos. */
--px-puerta: /* del lienzo */;
--px-tesoro: /* del lienzo */;

/* Grilla. */
--px-tile: 16px;
--px-escala: 2;
```

**Dos cosas que el test tiene que mirar y hoy nadie mira:**

1. **`contraste.test.ts`**: cada `--px-*` contra `--px-clave`, umbral **3:1**. No es texto,
   es una línea de contorno separando dos superficies — 3:1 es el umbral de elemento
   gráfico, y `UX-27 §5.3` explica por qué alcanza.
2. **`scripts/auditar-paleta-pixel.mjs`** (no existe): lee los PNG de `public/sprites/`,
   junta los colores distintos y falla si aparece uno que no esté en la lista, o si hay un
   píxel con alfa entre 1 y 254. **Un color de más en un PNG es el mismo defecto que un hex
   suelto en un componente**, y hasta que ese script exista el área no tiene auditor.

---

## 6. El hueco de auditoría que `INV-60` ya había marcado, y que este ciclo activa

No es mío arreglarlo, pero es mío avisarlo porque mis documentos lo dan por cubierto:

- **Una hoja de CSS nueva se escapa de los dos auditores.** `movimiento.test.ts` y
  `estilos.test.ts` escanean `tokens.css`, `juego.css`, `sitio.css` y `cancionero.css` por
  nombre. Un `src/styles/skayboy.css` no lo mira nadie.
- **`MODULOS` de `voz.test.ts` tiene ocho entradas** y un `src/lib/skayboy/copy.ts` que nadie
  agregue pasa el build con anglicismos y botones en infinitivo adentro. Ya pasó dos veces.
- **`RUTAS_DE_JUEGO`, `ANIMACIONES` y el array de `esquemas.test.ts`** son listas escritas a
  mano. Los dos últimos commits (`5f5eeb2`, `d4f44fe`) fueron justamente en esa dirección;
  esta ruta nueva es la primera prueba de si alcanzó.
