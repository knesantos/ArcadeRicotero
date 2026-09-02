# De `arquitectura` para `experiencia` — los cuatro estados de la cama de cinta

> Origen: `ADR-04` (`Docs/ARQ/ARQ-cama-de-cinta.md`, `T-189`). Para: `UX-21` (`T-190`).
> Fecha: 2026-09-01. **No es una decisión de interfaz: es lo que el módulo te puede decir.**

`ADR-04` deja el motor de la cama resuelto y **no toca la pantalla**. Esto es lo único que
`UX-21` necesita saber de la máquina, más una propuesta de redacción que decidís vos con
`contenido`.

## Los cuatro estados, y por qué son cuatro

`src/lib/sitio/cinta.ts` va a exponer `estadoDeLaCinta(): 'apagada' | 'sonando' | 'callada'
| 'bloqueada'` y `alCambiarLaCinta(oyente)` para que el interruptor se entere de los cambios
que **no** produce el dedo.

| Estado | Cuándo | Lo que importa para el diseño |
|---|---|---|
| `apagada` | siempre en la primera visita, y cuando alguien la apaga | Es el default y no se negocia. El sitio es idéntico sin la cinta |
| `sonando` | prendida y sin nada más sonando | — |
| `callada` | prendida, pero hay un fragmento o un tema sonando | **Este es el que te va a dar trabajo.** Si el interruptor dice "prendida" y no se oye nada, la persona lo toca creyendo que se rompió. Necesita decir que está callada **a propósito** |
| `bloqueada` | la persona la prendió y el navegador no dejó sonar | Pasa de verdad: adentro de WhatsApp, Instagram o Telegram el audio está recortado (`src/scripts/diagnostico-audio.ts:69-79`). No se reintenta y **no se guarda la preferencia** |

## Lo que `ADR-04` sí fija, y no es negociable desde la pantalla

1. **Apagada por defecto.** Ningún estado inicial puede ser otro.
2. **El interruptor es el gesto** que los navegadores exigen. No hay otra puerta de entrada
   al sonido, así que ese control tiene que ser alcanzable con el pulgar y estar donde la
   persona esté, no en un menú.
3. **La cama no lleva información.** Nada del sitio depende de escucharla. Apagarla no pierde
   nada, así que no hace falta explicar qué se pierde: no se pierde nada.
4. **El aviso de `bloqueada` va en registro 3**, seco (`voz-ricotera.md` §5). Es un rótulo
   sobre lo que pasa, no una disculpa ni un chiste.

## Propuesta de redacción — la decidís vos con `contenido`

Escritas como referencia de largo y de registro, no como texto cerrado:

| Estado | Propuesta | Chequeo |
|---|---|---|
| `apagada` (botón) | **`Prendé la cinta`** | voseo, 3 palabras |
| `sonando` (botón) | **`Apagá la cinta`** | voseo, 3 palabras |
| `callada` (rótulo) | **`Callada mientras suena el tema`** | registro 3, seco, 5 palabras |
| `bloqueada` (rótulo) | **`Sin sonido: el navegador lo bloqueó`** | registro 3, 6 palabras, sin suspensivos |

## Dos cosas que te dejo como pregunta, no como pedido

- **El iPhone en silencio.** La llave lateral apaga el audio con el contexto corriendo y **no
  hay API que lo detecte** (`src/lib/sitio/aparato.ts:14-16`). O sea: puede decir prendida y
  no oírse. El juego ya avisa de esa llave a quien tiene iPhone (`partida-tema.ts:161-183`).
  Si el interruptor se apoya en ese aviso o no, es tuyo.
- **`UX-03`** resolvió jugar sin auriculares con un aviso antes de arrancar. La cinta no lo
  contradice —está apagada— pero conviene que `UX-21` diga en una línea qué pasa cuando
  alguien la prende y después entra a "Adiviná el tema".
