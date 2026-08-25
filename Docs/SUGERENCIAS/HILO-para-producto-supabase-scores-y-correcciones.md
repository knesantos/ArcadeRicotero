# Para `producto`: la extensión a Supabase — correcciones, puntajes y jugadores

> De: hilo principal · Fecha: 2026-08-25 · Consume: pedido directo del usuario (2026-08-25),
> `CLAUDE.md` (Fuera de alcance), `D-14` (los molinetes), `D-09`, `D-08`, `BR-21` y `CTR-10`
> del ciclo 9.
> **Estado:** idea guardada, sin empezar. **No es alcance de la v1.**

## Lo que pidió el usuario, textual

Planificando el botón de corrección del ciclo 9, y después de elegir un transporte y
corregirlo:

> *"la idea no es que se vea la correccion primero, sino que nos llegue a nosotros, luego se
> podria extender con una base de datos gratis de supabase para guardar scores y los
> jugadores y correcciones."*

Lo primero —que la corrección **llegue** en vez de **verse**— ya está tomado y reorientó el
frente D del ciclo 9. Esta ficha es por lo segundo, que es más grande de lo que parece y por
eso se guarda en vez de hacerse.

## Por qué esto no es "agregar una base de datos"

Son **tres cosas distintas** metidas en una frase, y cada una choca con algo distinto:

| Qué guardaría | Con qué choca | Qué tan duro es el choque |
|---|---|---|
| **Correcciones** | nada | ✅ Ninguno. Es el destino natural de `CTR-10` y lo mejora: hoy la corrección cae en una casilla y nadie sabe si alguien la miró |
| **Puntajes** | *"Fuera de alcance: ranking global"* (`CLAUDE.md`) | 🟡 Medio. Guardar puntajes no es lo mismo que rankear, pero es el paso anterior y conviene decir cuál de las dos se quiere |
| **Jugadores** | *"Fuera de alcance: cuentas de usuario"* y **los molinetes** (`D-14`) | 🔴 Duro. Es la regla más fuerte del proyecto |

**El tercero es el que hay que mirar de frente.** `D-14` no dice "conviene que no haya
cuentas": dice que **nada acá se le niega a nadie por no tener con qué entrar**, y nombra
sin cuentas, sin login, sin Premium. Es la regla que unificó tres decisiones sueltas (`D-08`,
`D-09` y el alcance) bajo la imagen de los molinetes abiertos, que es lo más parecido que
tiene este proyecto a una idea rectora.

**Eso no quiere decir que no se pueda hacer.** Quiere decir que si se hace, se hace con una
`D-XX` escrita que diga qué pasa con los molinetes — igual que `D-22` sacó "alojar los temas
completos" de Fuera de alcance cuando hizo falta. Lo que no se puede es que aparezca un login
sin que nadie lo haya decidido.

## La salida que probablemente no rompe nada, para tenerla sobre la mesa

No es mi decisión, pero conviene que esté escrita porque puede ahorrar la discusión entera:
**un jugador puede tener puntaje sin tener cuenta.** Un identificador anónimo generado en el
propio aparato, sin mail, sin contraseña, sin recuperación. Guarda tu historial en ese
teléfono, entra en un ranking si se quiere, y **no le pide nada a nadie para entrar** — el
que llega por un enlace juega igual, exactamente como hoy.

Lo que se pierde es poder seguir a la misma persona entre dos aparatos. Lo que se gana es no
tocar `D-14`. Me parece un cambio barato, pero la decisión es de `producto`.

## Lo que el ciclo 9 ya dejó preparado para esto

**El salto no va a costar rehacer el botón.** `CTR-10` (`T-150`) define el payload de una
corrección **con el transporte detrás de una interfaz**, justamente para esto: cuando exista
la base, se cambia por dónde sale y no se toca ni el componente ni el contrato ni el texto.

Lo que **no** está preparado es lo de puntajes y jugadores, porque hoy no existe nada de eso:
el quiz por vidas del ciclo 9 no guarda nada entre partidas.

## Lo que le toca decidir a `producto`

1. **Cuál de las tres cosas entra**, y si entran juntas o de a una. La de correcciones es
   gratis; las otras dos no.
2. **Qué se mueve de Fuera de alcance**, con `D-XX` escrita, y qué le hace a los molinetes.
3. **Si un jugador puede existir sin cuenta**, que es la pregunta que decide si esto es un
   ajuste o un cambio de proyecto.
4. **Si esto es v1, v2 o backlog.** Mi lectura de *"luego se podria extender"* es que es
   backlog y no corre. Por eso está acá y no en una historia.

## Verificación

Que exista `IDEA-13` en `Docs/PRODUCTO/PRD-backlog-ideas.md`, con las tres cosas separadas y
con el choque contra `D-14` nombrado — no resuelto, nombrado. Es `T-155` del ciclo 9.
