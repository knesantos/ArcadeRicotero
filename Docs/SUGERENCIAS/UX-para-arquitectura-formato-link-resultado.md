# Sugerencia de `experiencia` para `arquitectura` — formato del link de resultado

> `arquitectura` decide si incorpora esto. No lo edito directamente, esto vive en
> `Docs/SUGERENCIAS/` hasta que alguien con permiso en `Docs/ARQ/` lo mueva.

`UX-02` (la tarjeta de resultado compartible) necesita que el link que alguien comparte
lleve consigo su puntaje, para que:

1. La pantalla de entrada (`UX-01`, Pantalla 0, Variante B) pueda mostrar *"Fulano sacó
   7/8. ¿Te la bancás?"*.
2. La pantalla de resultado del que recibe el link pueda comparar su puntaje contra el
   recibido, sin backend ni cuenta de por medio.

## Lo que necesito, sin meterme en cómo se resuelve

- Alguna forma de codificar el puntaje (y quizás el nombre de quien comparte, si
  `producto` decide que se muestre) en la propia URL — parámetro de consulta, un código
  corto, lo que decida `arquitectura` — compatible con "sin backend" (`D-02`) y con que
  el proyecto es JSON estático.
- Que sea liviano: nada que dependa de un servicio externo para acortar o resolver el
  link, porque eso reintroduce una dependencia de red que el proyecto no tiene en
  ningún otro lado.
- Un límite claro de qué tan manipulable es ese dato (si alguien edita el número en la
  URL a mano, no hay forma de evitarlo sin backend — lo doy por aceptable, es un fan
  site sin ranking real, pero lo dejo explícito para que la decisión sea consciente y no
  un descuido).

## Lo que no necesito de esto

No necesito una vía de autenticación ni de verificación del puntaje: el desafío es
social ("¿lo superás?"), no competitivo con integridad garantizada. Si `arquitectura`
ya tenía en mente algo más robusto, con esto alcanza.

## Referencia

Contexto completo en `Docs/UX/UX-01-flujo-quiz.md` (Pantalla 0, Variante B) y
`Docs/UX/UX-02-tarjeta-resultado.md` (sección "Camino de vuelta").
