# REV-24 — La pulida de jugabilidad de los cuatro juegos

Pedido del usuario del 2026-11-19 (ESTADO.md, "Ideas guardadas"): criticar quiz, Adiviná el tema,
Completá la letra y Adiviná la tapa desde siete perfiles de jugador, y mejorar en rondas.
Ronda 0 = `T-531`. Sitio real: build de `origin/main` 7d0a22d, vista previa, 375×812.

## Quién criticó

Tres críticos con contexto fresco (Sonnet), cada perfil anotado por separado:

| Archivo | Perfiles |
|---|---|
| `r0-experto.md` | 1. el experto en los Redondos, con barrido de datos de los ítems listos |
| `r0-afuera.md` | 2. el que está mirando · 3. el ricotero que se lleva mal con la tecnología · 4. el que llega sin idea por un enlace |
| `r0-uso.md` | 5. una mano en el bondi y sin auriculares · 6. el que vuelve todos los días · 7. baja visión o lector de pantalla |
| `r0-medidas-fragmentos.md` | el arranque real de los 95 mp3, medido por el hilo principal decodificando en el navegador |

## Lo que el hilo principal verificó contra los datos

- Completá la letra: los distractores son palabras sueltas del cancionero sin mirar la clase de palabra
  (`CL-081` "Y se ___" → *ofreció* contra *música / rockeros / cristal*). Confirmado.
- Adiviná el tema: once fragmentos con silencio en los pasos de 0,1 y 0,5 s. Confirmado por medición.
- `TP-005` ("el año antes de Montevideo", con el disco de 1989) contradice a `QZ-066` (Montevideo, 22 de
  julio de 1989). Confirmado que se contradicen; cuál está bien pide ficha de `investigador`.

## El plan de rondas (por impacto sobre costo)

1. `T-532` — distractores de Completá la letra que suenen a la correcta; sin dos ítems del mismo tema por ronda.
2. `T-533` — el corte del tema arranca en el primer sonido real; "Pasá" que se entienda; salida sin sonido.
3. `T-534` — lector de pantalla (acierto/error anunciado en letra, tapa y tema; foco) y el Seguí sobre la opción D.
4. `T-535` — los molinetes del que llega sin idea: "Te falta escuchar disco", fáciles que no son fáciles,
   el tiempo en grande en el resultado del tema, salida visible en cada partida.
5. `T-536` — el que vuelve: preferir lo no visto (guardado en el navegador, sin cuenta), más recortes de tapa.

Contenido y hechos (no es jugabilidad de código, va a sus dueños): `TP-005`/`QZ-066`, `TP-010` (recorte
irreconocible), `QZ-053` contra `QZ-020` (Patricio Rey "inventado" contra "la dejó abierta"). Propuesta en
`Docs/SUGERENCIAS/HILO-para-investigador-y-contenido-pulida-jugabilidad.md`.
