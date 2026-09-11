# Propuesta del hilo principal para `arquitectura`: `ADR-07.8` describe un mecanismo que el código no tiene

> Escrita el 2026-09-11, al cerrar `T-225`. Sale de `FIND-54` de `REV-13`, que lo encontró
> leyendo el ADR contra el código y no al revés.
>
> **No es un defecto de comportamiento.** Lo que el ADR quiere que pase, pasa. Lo que no
> existe es el mecanismo con el que el ADR dice que pasa.

## Qué dice `ADR-07.8`

Que `debeCallarse()` *"se parte en dos preguntas, una por modo"*: una para la cama, que se
calla con la pantalla escondida, y otra para la rocola, que sigue.

## Qué hay en el código

`src/lib/sitio/cinta.ts:552-558` sigue siendo **una función sola**:

```ts
function debeCallarse(): boolean {
  barrer();
  if (medios.size > 0) return true;
  if (salidaOcupada()) return true;
  if (typeof document !== 'undefined' && document.hidden) return true;
  const ctx = contextoVivo();
  return ctx !== null && ctx.state !== 'running';
}
```

No distingue modo. Nunca lo hizo.

## Por qué el comportamiento sale bien igual

Porque **la rocola nunca pasa por esa pregunta**. Tiene su propio elemento, su propio `gain` y
su propia cadena; `debeCallarse()` gobierna el `volumenCama` de `ADR-04` y nada más. Esconder
la pantalla calla la cama y deja el tema corriendo, que es exactamente lo que `ADR-07.8` pide
—y lo que el navegador ya hace solo con el audio de una pestaña escondida.

O sea: **el resultado es el correcto y el camino es otro.**

## Por qué no lo "arreglé" en el código

Porque el código no está mal. Partir `debeCallarse()` en dos para que calce con la prosa
sería agregarle una rama a la función más delicada de `ADR-04` —la que decide si el escalón de
0,1 s del reveal se oye limpio— para no cambiar un párrafo. El riesgo está todo de un lado.

Y porque la decisión es tuya: `ADR-07` es tuyo, y si la partición en dos preguntas era
deliberada por algo que yo no veo —un caso futuro, un modo tercero—, entonces lo que falta es
el código y no el párrafo. **No quise decidir eso desde afuera.**

## Lo que sí se hizo

Los casos **17** y **19** de la tabla de veinte no tenían ninguna prueba. Ahora la tienen, en
`src/lib/sitio/rocola.test.ts`:

- **Caso 17** fija que **la rocola no registre ningún escucha de visibilidad** —ni
  `visibilitychange` ni `document.hidden` aparecen en su código—, que es lo que hace que
  esconder la pantalla no pueda tocarla. Es la prueba del comportamiento que `ADR-07.8`
  promete, escrita contra el mecanismo que de verdad lo produce.
- **Caso 19** fija la forma del literal `ROCOLA_HABILITADA` y que se mire **antes** de crear
  el elemento: si estuviera después, apagarla igual pediría bytes.

## Las dos salidas, y ninguna me parece obvia

1. **Corregir `ADR-07.8`** para que describa el mecanismo real: la rocola no pasa por
   `debeCallarse()` porque es otra cadena, y el desvío respecto de `ADR-04.8` es
   estructural y no una rama de código.
2. **Partir `debeCallarse()` de verdad**, si había una razón detrás de esa redacción.

Si elegís la 1, alcanza con reescribir ese párrafo y esta propuesta se cierra. Si elegís la 2,
decí qué caso futuro la justifica: el que la construya va a tocar la función que decide si el
reveal de `US-02` se oye limpio, y eso merece un motivo escrito.
