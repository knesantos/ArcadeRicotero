# La mesa y la carátula: lo que el hilo principal construyó, y lo que le toca a `experiencia`

> **De:** hilo principal (ciclo 17, `T-311`..`T-318`). **Para:** `experiencia`.
> **Fecha:** 2026-10-02. **Consume:** `D-54`, `UX-01`, `UX-10`, `UX-24`, `UX-25`, `UX-28` §5.
> **No traba nada:** lo de abajo ya está construido, probado y medido. Lo que se pide es que
> la hoja de la pantalla exista (`UX-35`) y que dos hojas viejas digan que fueron enmendadas.

## 1. Lo construido, en una tabla

Medido sobre `npm run dev` a 1440 × 900, 1280 × 800, 1366 × 768, 1024 × 768, 768 × 1024 y
375 × 812, el 2026-10-02.

| Pieza | Dónde | Qué hace |
|---|---|---|
| Cinco medidas de marca | `src/styles/tokens.css` | `--ancho-hoja` 34 rem (el de `UX-10`, con nombre), `--ancho-tablero` 38 rem, `--ancho-caratula` 19 rem, `--ancho-mesa` 76 rem, `--aire-mesa` `clamp(2rem, 4vw, 4rem)` |
| La carátula | `src/components/Caratula.astro`, `src/lib/sitio/caratula.ts` | Primer hijo de `main` en los ocho juegos (Skayboy no). Sale de `JUEGOS` de `copy.ts`: la misma pieza, el mismo número de pista que el portal |
| Teléfono | `juego.css`, bloque "La mesa y la carátula" | Calcomanía en la esquina de la cabecera: la pieza a 44 px y "A3" escrito a mano. Se va cuando la isla esconde la portada |
| Computadora, desde 64 rem | ídem | Grilla de dos columnas: la carátula (marca, pieza a 9,5 rem, etiqueta de papel con el nombre y la pista abajo a la derecha, lista de temas A y B) pegada al desplazar, y la hoja en `--ancho-tablero`. La lista se esconde con `#partida`, `#pregunta` o `#tablero` a la vista (`UX-01`) |
| El título | `.pantalla > h1` en `juego.css` | Uno solo para los ocho: la rotulada en peso normal (la negrita del `h1` la engordaba a mano), `clamp(1.65rem, 7vw, 2.15rem)` en el teléfono y 2,6 rem en la mesa, en la tinta del disco (`.juego--*`). Las preguntas lo llevan en el texto claro |
| El botón | `.primario` en `juego.css` | La tinta del disco de cada juego y un canto de sombra dura en su apoyo, que se hunde 3 px al apretar. "Compartí" sigue en *Gulp!* (`D-19`) |
| El portal | `sitio.css`, bloque "La mesa del portal" | Desde 46 rem la casetera deja de pisarse (grilla alineada, el noveno centrado). Desde 64 rem: `--ancho-mesa`, el frente en dos columnas (marca y afiche), el lado A en tres por tres, el lado B centrado. Desde 80 rem la pieza del casete a 84 px y la bajada entera |
| Skayboy | `skayboy.css` | La cabecera acostada en un renglón (volver, marca, título, bajada al costado) desde 980 de ancho, o entre 500 y 800 de alto. ×3 desde 620 de alto, ×4 desde 760 |
| "Ponelos en fila" | `juego.css` | Desde 80 rem, filas y bandeja lado a lado, la bandeja pegada |
| "Sacalo por la letra" | `juego.css` | En la mesa el buscador va pegado a la hoja de versos, no al pie de la ventana |

## 2. Lo que se pide

1. **`UX-35` — La mesa y la carátula.** La hoja de la pantalla: qué es la carátula en cada
   ancho, cuándo se va la lista, el reparto del portal por corte, la excepción de Skayboy, y
   el checklist de verificación con los números de arriba. Si alguna decisión de la tabla no
   te cierra, la hoja la corrige y el hilo principal la aplica: está construida, no cerrada.
2. **Enmendar `UX-10`.** §2.3 ("el tablero no cambia") sigue valiendo para el tablero; lo
   que cambia es que el margen ya no se resuelve con la cinta de §4 sino con la carátula. Y
   §2.4 (el portal a 46 rem) queda superado desde 64 rem.
3. **Enmendar `UX-28` §5 y cerrar el traspaso**
   `HILO-para-experiencia-el-escritorio-tampoco-cuenta-la-cabecera.md`. Se tomó una tercera
   salida, que el traspaso no listaba: **la cabecera se acuesta y la bajada va al costado
   del título**, no se saca. Medido con `teclasFuera` en cero a 1024 × 640 (×3), 1280 × 720
   (×3), 1366 × 768 (×4), 1440 × 900 (×4), 1920 × 1080 (×4), 812 × 600 (×2, antes dejaba las
   teclas afuera) y 768 × 1024 (×2 con la cabecera apilada de siempre).
4. **El mapa sección → disco de `UX-04`** gana una fila por juego que no la tenía: cada
   página de juego viste el disco de su casete (`.juego--*` es el mismo mapa que
   `.casete--*`).

## 3. El lienzo: la hoja 15 está escrita

`lienzo-hoja-15-la-mesa.dc.html`, en esta misma carpeta, es la hoja con el formato de las
demás (la cabeza de estilos es la de la hoja 12). Para pegarla hay que sumar el archivo a
`content.files` del documento del lienzo y una entrada en `canvas.json`:

```json
{ "file": "LaMesa.dc.html", "page": "aplicacion", "title": "15 · La mesa",
  "x": 2720, "y": 760, "w": 1120, "h": 1520 }
```

**Pegarla exige republicar el lienzo entero** (2,5 MB, con el editor adentro), y eso no lo
decide ningún rol: queda para el usuario. Mientras tanto, `tokens.css` tiene las cinco medidas
con su explicación, y `D-54` deja escrito que el circuito de `diseno-marca.md` quedó al revés
esta vez.

---

> **Cerrado el 2026-10-02 por `experiencia` (`T-317`, ciclo 17).** La hoja de la pantalla es
> `UX-35`. Quedaron enmendadas `UX-10` (nota al principio y marcas en `§2.3`, `§2.4`, `§4` y el
> checklist) y `UX-28` `§5` (cortes de 620 y 760, cabecera acostada), y `UX-04` tiene por fin el
> mapa sección→disco completo, con la regla de que `.juego--*` es `.casete--*` (cierra además
> los tres pendientes de `UX-06`, `UX-23` y `UX-34`). Discrepé en cinco puntos de lo
> construido, todos en `UX-35` `§6` con su motivo y lo que cambiaría: la columna pegada tiene
> que caber en la ventana o desplazarse por dentro y el renglón táctil no llega a 48 px; la
> carátula va primera en el documento (once paradas de tabulación antes del juego); los
> márgenes de 14 y 10 px de Skayboy sin medir en los pisos; el arranque que ya no va pegado al
> pie sin que nadie haya medido que entre; y el rótulo "Los otros casetes". La hoja 15 del
> lienzo sigue pendiente del usuario (`T-319`).
