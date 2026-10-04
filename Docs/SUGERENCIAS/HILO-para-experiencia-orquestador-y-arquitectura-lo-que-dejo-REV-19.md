# HILO → `experiencia`, `orquestador` y `arquitectura` — lo que `REV-19` cambió en el código y sus papeles todavía no dicen

- **De:** hilo principal, al cerrar `REV-19` (2026-10-04).
- **Para:** `experiencia` (`UX-36`), `orquestador` (`ORQ-plan-ciclo-18.md`), `arquitectura`
  (`ADR-02` v2, enmienda 2).
- **Por qué está acá y no hecho:** son documentos de cada rol, y los subagentes se quedaron sin
  cupo hasta el 8 de octubre. El código ya está; esto dice qué dejó de ser cierto en el papel.
  Es el `FIND-118` de `REV-19`.

## Para `experiencia` (`UX-36`)

1. **La tapa se aprieta bajo 22 rem** (`FIND-111`). A 320 × 568 era la única portada de los ocho
   juegos con el botón de arranque bajo el pliegue (terminaba en 633; los otros, entre 409 y 514).
   En `juego.css`, dentro del corte `max-width: 21.99rem`: margen de la tapa `--espacio-2` arriba y
   `--espacio-1` abajo, relleno 14/6/12 px, etiqueta a `1.1rem + 6px` del borde con relleno
   6/10 px, esquinero de 3,2 × 3,7 rem, índice a 0,9 rem (entra en dos renglones) y el nombre del
   amigo a 1,35 rem. Medido: el botón de la portada termina en 565 a 320 × 568; a 375 × 667 no
   cambió nada (590). `§3.4` y `§12.1` podrían sumar el corte de 320.
2. **Los rótulos de renglón de la grilla van en una columna de 7 rem, no de 5** (`FIND-112`).
   "OSCURIDAD" en la rotulada a 0,75 rem mide ≈ 100 px y a 5 rem (80 px) se metía en la celda de
   al lado. Medido a 736, 1024 y 1440: `scrollWidth` igual a `clientWidth` en los dos rótulos.
   `§5.3` dice `5rem 1fr 1fr`.

## Para `orquestador` (`ORQ-plan-ciclo-18.md`)

- El estado del plan quedó en la foto del armado ("sin empezar: `T-334`, `T-344`, `T-345`,
  `T-346`"). Hoy las dieciséis están hechas. `T-344` (`REV-19`) la hizo el hilo principal y no
  `revisor`, por el cupo: el documento lo dice arriba y deja pedida una relectura de `revisor`.
  `T-347`..`T-350` no se usaron.

## Para `arquitectura` (`ADR-02` v2, enmienda 2, y `CTR-08` v2, enmienda 1)

- **El punto 9 de `ADR-02` ya se cumple**: `Cabeza.astro` declara `imagen` e `imagenAlt` como
  "las dos o ninguna" con una unión de tipos, y `npm run check` lo rechaza (visto en rojo con una
  página de prueba que pasaba solo la imagen). La enmienda 2 dice "sigue exigido".
- **Lo exigido de `CTR-08` E1.5 ya está**: la guarda de letras en `tarjetas.test.ts`, con su caso
  en rojo (la Ñ en la calcada), y el taller que se niega a dibujar si falta una; la huella cuenta
  lo pintado armado (sello, línea que nombra, dominio). `VERSION_DEL_DIBUJO` va en 3 (renglones
  parejos del nombre, que pidió `experiencia`).
