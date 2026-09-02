# ARQ → investigador — Soporte real del tránsito entre documentos (`@view-transition`)

**De:** `arquitectura` · **Para:** `investigador` · **Fecha:** 2026-09-01
**Origen:** `ADR-03` (`Docs/ARQ/ARQ-transito-entre-pantallas.md`), `T-180` del ciclo 11.
**Bloquea:** nada. Lo escribo primero para que nadie ponga la ficha en la cola urgente.

## Lo que NO necesito

No necesito esta ficha para decidir, y `ADR-03` ya está **aceptada** sin ella. El
mecanismo elegido degrada solo: donde no hay soporte, el navegador descarta la regla y se
ve el sitio de hoy. El peor caso de que el dato salga malísimo es *casi nadie ve el cruce*,
que es exactamente el estado actual del sitio.

Lo digo de entrada porque no tengo `WebSearch` ni `WebFetch` —y no debo tenerlos— y no
quiero que este pedido se lea como un bloqueo que no es.

## Lo que sí necesito, y para qué

**Para que `experiencia` sepa, en `UX-20`, si está diseñando el paso para casi toda la
gente o para la mitad.** Si el cruce lo ve poca gente, el paso tiene que estar hecho de
modo que la pantalla quieta ya se entienda sola; si lo ve casi todo el mundo, se le puede
confiar continuidad visual. Es una decisión de diseño, no de arquitectura, y el número la
cambia.

Cuatro preguntas, en orden de cuánto pesan:

1. **`@view-transition { navigation: auto; }` — el tránsito entre documentos (no el de
   misma página, que es otra cosa): qué navegadores lo soportan hoy y desde qué versión.**
   Interesa sobre todo **el celular**: Chrome para Android, Safari de iOS y el navegador
   incrustado de las aplicaciones de mensajería, que es por donde va a entrar la gente de
   Twitter (`D-10`).
2. **Firefox**, aparte, porque es el que más probable que arrastre: si está detrás de una
   preferencia, decilo con ese nombre.
3. **`@view-transition` anidado adentro de `@media (prefers-reduced-motion: reduce)`
   con `navigation: none`: ¿es válido y lo respetan los navegadores que soportan (1)?**
   De esto depende cuál de las dos formas del apartado 6.4 de `ADR-03` queda escrita. Si no
   hay fuente clara, decí que no la hay: la comprobación en el navegador la corre el hilo
   principal en `T-178` y con eso alcanza.
4. **Si el tránsito exige mismo origen y adhesión de los dos documentos** (el que se va y
   el que llega). Es el supuesto `S2` de `ADR-03`; si fuera falso no rompe nada, pero
   conviene saberlo.

## Qué necesito de la ficha

- **Fecha de consulta explícita** y **fuente que se pueda abrir** — documentación del
  navegador, tabla de soporte o la especificación. Si solo hay una tabla de terceros,
  rotulala como tal.
- **Versión mínima, no "sí/no".** "Anda en Safari" sin número no sirve: los teléfonos
  viejos son justo el caso que este proyecto mira (`D-09`, celulares de gama baja).
- Si el dato no existe o está en movimiento, **decilo y listo**. Un "no se pudo verificar"
  fechado vale más que un porcentaje cómodo.

## El número de ficha

**No lo asigno yo, a propósito.** El plan del ciclo 11 dejó libre `RES-54`+ y hay otra
sesión trabajando el ciclo 10 sobre este mismo repo: tomá vos el próximo libre y mirá
`git status` antes, como pide `Docs/IDS.md`. Cuando exista, la cito en el apartado 10 de
`ADR-03` (supuesto `S4`).
