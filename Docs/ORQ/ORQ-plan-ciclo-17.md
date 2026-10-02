# ORQ — Plan del ciclo 17: la mesa y la carátula

> **Escrito por el hilo principal**, el 2026-10-02, a pedido del usuario: *"Hacé un ciclo
> entero y complejo de mejora visual de desktop para el home y todos los juegos. Debe quedar
> profesional y lindo en ambas formas desktop y mobile."*
>
> Arranca sobre `main` en `039bebd` (con el #23 de Skayboy por teclado adentro), **con el
> árbol limpio**, en la rama `ciclo-17/escritorio`. Sesión única: no hay otra sesión local
> escribiendo este repo.
>
> **Consume:** `D-09`, `D-14`, `D-17`, `D-19`, `D-21`, `D-49`, `UX-01`, `UX-04`, `UX-10`,
> `UX-24`, `UX-25`, `UX-28` §5, `.claude/rules/diseno-marca.md`,
> `.claude/rules/voz-ricotera.md`, `.claude/rules/codigo-juegos.md` y el traspaso
> `HILO-para-experiencia-el-escritorio-tampoco-cuenta-la-cabecera.md`.
>
> **Rango** (`Docs/IDS.md`, fila del 2026-10-02): `T-311`..`T-330`, `D-54`, `UX-35`,
> `REV-18`, `FIND-99`+. El plan usa `T-311`..`T-319`.

## 0. La idea del ciclo, en un párrafo

En una pantalla ancha el sitio era el teléfono en el medio de un monitor. El ciclo no lo
agranda —`UX-10` ya explicó por qué el tablero no crece—: **apoya la hoja en una mesa, al
lado de la carátula del casete** que la persona tocó en el portal. La carátula es la misma
pieza, el mismo número de pista y el mismo disco que el casete, sale del mismo dato (`JUEGOS`)
y por eso no puede contar otra cosa; en la computadora trae además la lista de temas, que es
la navegación entre juegos y que se va mientras se juega. Alrededor de eso, lo que una serie
de ocho juegos necesita para leerse como serie: un solo título, un solo botón, y el portal
como la pantalla de elegir que es.

## 1. Lo medido antes de cortar nada

Medido el 2026-10-02 sobre `039bebd`, con `npm run dev` y Chrome sin cabeza.

| Qué | Cómo | Cuánto |
|---|---|---|
| El portal a 1440 × 900 | captura | columna de **736 px**; 2 casetes por renglón, el A9 solo; ~350 px de negro a cada lado |
| Un juego a 1440 × 900 | captura | columna de **544 px**; el tablero de las preguntas termina en y ≈ 430 |
| Qué juego es, en partida | captura de los ocho | **nada**: la portada se esconde con su título |
| Los títulos de juego | `<style>` de cada página | **cuatro formas** en ocho páginas; los ocho en negrita falsa (`h1` sin `font-weight`) |
| Los botones principales | `.primario` y las páginas | **tres** en el rojo de la marca por defecto (dos ejes, letra, tapa) |
| Skayboy a 1440 × 900 | `teclasFuera` | ×4, el mueble terminaba en 978: **teclas fuera** (el traspaso de `T-271`) |
| Tests | `npm test` | 1387/1387 |

## 2. Las tareas

| ID | Rol | Qué | Archivos | Verifica con | [P] |
|---|---|---|---|---|---|
| `T-311` | hilo principal | **Las medidas de la mesa y la carátula.** Cinco tokens; `caratulaDe()` desde `JUEGOS`; el componente | `tokens.css`, `lib/sitio/caratula.ts`, `caratula.test.ts`, `components/Caratula.astro`, `lib/sitio/copy.ts` (`CARATULA`) | `node --test src/lib/sitio/caratula.test.ts`: pista, pieza y disco iguales al portal; una sola marcada en la lista; un juego fuera del portal **tira** | **[P]** |
| `T-312` | hilo principal | **La mesa en los ocho juegos.** La carátula como último hijo de `main` (primero, hasta que `UX-35` §6.2 mostró las once paradas de tabulación), la clase del disco, el crédito del pie; la grilla de 64 rem, la calcomanía del teléfono, la lista que se va en partida | las ocho páginas, `juego.css`, `sitio.css` (la carátula afuera de la regla del velo) | `caratula.test.ts` (cada página, su ruta, última en `main`, el pie acredita); medido a 1440, 1280, 1024 y 375 | dep. `T-311` |
| `T-313` | hilo principal | **Un título y un botón.** `.pantalla > h1` único en peso normal; `.juego--*` con la tinta de acción y el canto; las páginas dejan de escribir su `h1` | `juego.css`, `sitio.css`, las páginas, `contraste.test.ts`, `estilos.test.ts` | `estilos.test.ts` (el título pide su peso, ninguna página lo reescribe) y `contraste.test.ts` (cinco botones, tres títulos sobre tapa velada a 3:1); rojo visto en los tres | dep. `T-312` |
| `T-314` | hilo principal | **El portal como mesa.** El frente en dos columnas, tres por tres, el lado B centrado, la casetera alineada desde 46 rem, la bajada entera desde 80 | `index.astro`, `sitio.css` | Capturas a 1440, 1280, 1024, 768 y 375; `caratula.test.ts` (la bajada partida se vuelve a armar letra por letra) | dep. `T-311` |
| `T-315` | hilo principal | **Skayboy entra entero.** La cabecera acostada y los cortes de ×3 y ×4 que la cuentan; la negrita falsa del título | `skayboy.css` | `teclasFuera` 0 medido en siete tamaños (en el traspaso); `npm test` | **[P]** |
| `T-316` | hilo principal | **Los dos tableros que pedían otra forma.** "Ponelos en fila" en dos paños desde 80 rem; "Sacalo por la letra" con el buscador pegado a la hoja en la mesa | `juego.css` | Capturas en partida a 1440 | dep. `T-312` |
| `T-317` | `experiencia` | **`UX-35`** y las enmiendas de `UX-10`, `UX-28` §5 y la fila de `UX-04`; cierra el traspaso de `T-271` | `Docs/UX/` | `rg -n "^# UX-35" Docs/UX/`; que el checklist cite los números medidos lo mira `revisor` | dep. `T-311`..`T-316` |
| `T-318` | `revisor` | **`REV-18`**: lo construido contra `D-54`, `diseno-marca.md`, `voz-ricotera.md` y `UX-01` | `Docs/REVISIONES/REV-18-la-mesa.md` | Hallazgos `FIND-99`+ con evidencia | dep. `T-311`..`T-316` |
| `T-319` | **usuario** | **La hoja 15 en el lienzo.** Republicar el lienzo con `lienzo-hoja-15-la-mesa.dc.html` | el lienzo | Lo decide el usuario: republicarlo exige leer el lienzo entero | — |

## 3. Lo que este ciclo no hace

- **Las páginas de lectura** (Redondopedia, letras y acordes) se quedan como las dejó
  `UX-10`: el pedido nombró el portal y los juegos, y la medida de renglón de un artículo es
  la que está calibrada.
- **Atajos de teclado en los juegos de cuatro opciones** (1–4 para elegir, Enter para seguir).
  Es la otra mitad de "escritorio" y tocaría tres islas; queda como idea para cuando se pida.
- **La carátula de Skayboy.** El mueble es su propia carátula (`D-54`, excepción escrita en el
  test).
