# De `arquitectura` para el hilo principal: lo que arrastra `T-298` (los contratos de `D-47`)

> 2026-09-24, ciclo 16, ráfaga 5. **No toco `src/`.** Los contratos están en:
>
> - `Docs/ARQ/ARQ-pantalla-completa.md`: `ADR-10`, nuevo;
> - `Docs/ARQ/ARQ-schema-niveles.md`: `CTR-16.4` con la subsección *"El coleccionable de cada
>   uno"*, el `CTR-16.11` nuevo, y `E9`, `E10` y `E11` en `CTR-16.10.10`;
> - `Docs/ARQ/ARQ-atlas-de-sprites.md`: `CTR-15.7` con la subsección *"El sexto estado"*, y
>   `CTR-15.8`;
> - `Docs/ARQ/ARQ-motor-de-juego.md`: `ADR-08.3` y `ADR-08.11` punto 5, enmendados para el modo.
>
> Lo de abajo es la lista de archivos por tarea del plan (`ORQ-plan-ciclo-16.md §2.6`). Manda el
> contrato; esto es para no tener que buscarlo.

## `T-300`: los dibujos

- **Los muñecos:** en `src/arte/pixel/skayboy.txt` y `poligirl.txt` va `version: 2` y
  `estado: baila  cuadros=N  porSegundo=V  repite=si`, con N de 2 a 8 y V de 3 a 10.
  **Si `UX-33` no fija otros valores, N es 4 y V es 6.** Van a `public/sprites/skayboy.v2.*` y
  `poligirl.v2.*`. Los v1 no se borran en el mismo cambio (`CTR-15.8`).
- **En `atlas.test.ts`, `baila` entra a `EN_EL_PISO`**: el pie en el renglón 23 en todos los
  cuadros (`CTR-15.7`, fila *"Dónde está la figura"*). La paridad de cuadros, velocidad y
  repetición ya la cuenta el test genérico de estados.
- **Para quien dibuja:** nada en la mano (`UX-27 §8.2`). El cuadro 0 tiene que leerse solo como
  festejo, porque es el que queda con movimiento reducido. Nada de gestos hacia el otro
  (`D-47` punto 3). La hoja de contacto la aprueba el usuario.
- **La sala:** dos tiles, `tesoroSkayboy` (la guitarra) y `tesoroPoligirl` (el cigarrillo), en
  lugar de `tesoro`. La versión es la siguiente a la que deje `T-290`. Si `UX-33` pinta alguno
  con tintas de personaje, **`sala.test.ts` tiene que cambiar `DE_LA_SALA`** (hoy no deja usar
  `--px-skay-*` ni `--px-poli-*`). Y cada tinta se queda con su dueño: la guitarra no lleva
  tinta de Poli.

## `T-301`: la pantalla completa (`ADR-10`)

- **`src/lib/skayboy/pantalla.ts`**, con `encuadre(anchoCss, altoCss, dpr)`, pura. Su test,
  `pantalla.test.ts`, lleva los seis casos de `ADR-10.4` y la grilla de `ADR-10.6`. **El rojo:**
  cambiar `floor` por `round` hace que el caso 1 dé `E = 8`, que se sale de la ventana.
- **La isla:**
  - `entrar()` y `salir()`: el atributo `data-pantalla="completa"` en `<html>` y `soltarTodas()`;
  - el pedido del sistema **sobre el contenedor**, sin `await` antes;
  - `lock('landscape')` solo si el sistema dio la pantalla completa;
  - las tres puertas de salida;
  - el `ResizeObserver` del contenedor, que escribe las cuatro propiedades CSS;
  - el botón de entrar, que se muestra cuando se esconde el rótulo de carga.
- **`skayboy.css`:** las reglas de `ADR-10.1`, solo debajo del atributo.
- **`motor.test.ts`, tres casos nuevos con su rojo:**
  - sin `setFullscreen(` ni `isFullscreen(`;
  - sin `stretch` ni `letterbox` en el init;
  - ningún `requestFullscreen` sobre el canvas.

  El motivo está leído en disco: con `stretch` o `letterbox`, el manejador de `resize` del motor
  rehace el buffer en cada cambio.
- **Todo lo que se ve en el modo, adentro del contenedor** (`ADR-10.5`), incluido el pie de
  homenaje.
- **No hace falta cambiar el init del motor.**
- **La segunda línea de `ADR-10.7`** (el `touchmove` no pasivo) **no se escribe** hasta que la
  ficha o el teléfono la pidan.

## `T-302`: la victoria y la fila

- **`escena.ts`:**
  - `ESTADOS_DE_PERSONAJE` suma `'baila'`;
  - con `mundo.terminado`, los dos cuerpos se dibujan en `baila`, en lugar del `enPausa` forzado
    de `UX-32 §3`;
  - el cuadro sale de `t − tGanado` con el reloj del motor, no de `mundo.tiempo`, que se congela
    al ganar;
  - con `prefers-reduced-motion: reduce`, el cuadro 0 fijo (`CTR-15.7`).
- **En el mismo commit que los v2 de `T-300`:** `personajes[].atlas` de `src/data/skayboy.json`
  pasa a `skayboy.v2` y `poligirl.v2` (`CTR-15.7`, *"La versión"*). `problemasDelAtlas()` sigue
  pidiendo `contratoVersion: 1`, y eso está bien, porque la forma del JSON no cambió.
- **`src/lib/skayboy/avance.ts`** y `avance.test.ts` (`CTR-16.11.3`), con la tabla de rojos.
  - La clave es `arcade.skayboy.avance`.
  - Se escribe en el cuadro de la victoria, no al tocar "seguí".
  - `nivelAJugar()` pasa a elegir con el avance: el pedido de desarrollo primero, después el
    primero de la fila que falte.
- **Pasar al siguiente** es `crearMundo(banco, siguiente)` en la misma isla, sin navegar
  (`CTR-16.8`). `null` quiere decir "no queda ninguno", y qué se hace entonces lo dicen
  `BR-31` y `UX-33`.
- **`niveles.ts`, `E11`:** orden de `id`, sin ids repetidos, y el escalón no baja. **Rojo:**
  `NIV-02` y `NIV-03` cambiados de lugar. El banco de hoy ya cumple.

## `T-303`: guitarras y cigarrillos en los seis niveles

**Un solo commit** (`CTR-16.4`, migración, paso 5):

- **El schema:** `skayboy.schema.json` a `$id …/skayboy/3` y `contratoVersion: 3`, con la rama
  nueva de `tesoro` y el `comment` de la raíz, que están para pegar en `CTR-16.4`.
- **El dato:** la leyenda sin `o` y con `g` y `-`. `NIV-01` pasa a `"#A.g.1...2.-.B#"`.
  `contratoVersion: 3`.
- **La escena:**
  - `TILES_DE_LA_SALA`: `tesoro` sale y entran `tesoroSkayboy` y `tesoroPoligirl`;
  - `tileDe()` elige por `para[0]`;
  - `ATLAS_DE_LA_SALA` apunta a la versión nueva.
- **Las pruebas:** `sala.test.ts`, de un tile a dos. `esquemas.test.ts` suma `E9`, y
  `niveles.ts` suma `E10`, cada una con los rojos de la tabla de `CTR-16.4`.
- **`mundo.ts` no cambia.**

**Las trazas no hace falta regrabarlas por la migración.** Para un cuerpo, un tesoro es aire.
Solo haría falta si `BR-31` pide que cada coleccionable se pruebe alcanzable y se elige la salida
(b) de `CTR-16.4`: la traza que gana juntando todo. En ese caso, antes enmiendo `CTR-18`.

## Verificación

```bash
rg -n "T-298" Docs/ARQ/ARQ-schema-niveles.md Docs/ARQ/ARQ-atlas-de-sprites.md Docs/ARQ/ARQ-motor-de-juego.md Docs/ARQ/ARQ-pantalla-completa.md
rg -n "^## CTR-16\.11|^### CTR-16\.11\.[1-5]" Docs/ARQ/ARQ-schema-niveles.md   # seis líneas
rg -n "^### ADR-10\.[1-7]" Docs/ARQ/ARQ-pantalla-completa.md                    # siete líneas
```

Los fragmentos de schema de `CTR-16.4` validan con `ajv`, y quien lo corre tiene que ver los
rojos de la tabla. El comando lo corre quien tenga con qué (`D-12`).
