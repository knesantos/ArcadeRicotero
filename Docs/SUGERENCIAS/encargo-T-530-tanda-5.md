# Encargo `T-530` (`D-91`), tanda 5: la prisión de Barbazul (la última)

Escrito por el hilo principal el 2026-11-17. Sigue a los encargos de las tandas 1 a 4: todo lo de ahí
vale acá. Es la última región del bestiario que no pasó por las rondas; con ella se cierran las trece.

## Qué dejó la tanda 4 (techos, bajo, templo; tres vueltas)

2512 tests en verde. En los recintos (`forma: 'recinto'`) lo del camino entra después del telón y,
en el bajo, también después del agua repintada (`EN_EL_RECINTO`, `conLoDelCamino`, la mano `luego`),
sin editar `escenas.ts`. La lupa baja el frente del recinto (`FRENTE_DEL_RECINTO`). Lecciones nuevas:

1. **En un recinto, lo nuevo entra después del telón y antes del primer bicho**, con un error si el
   telón cambia de nombre. Nunca pintado a ciegas encima de todo.
2. **Lo que no se lee y cuesta, se saca primero, antes de medir** (la niebla al ras del bajo).
3. **Cuando los tirones caen siempre del mismo lado, alterná el orden rama/main** antes de creerle a
   la diferencia.
4. **Una luz que no se puede mover se angosta**: el foco del templo dejó de ser carpa cambiando
   parámetros, sin tocar la pieza ni su test.

## Por qué la prisión, y qué le falta

En `cap/la-prision-*.png` (y en `t4-candidatas.png`, segunda fila) es la más fuerte de las que
quedaban: grabado blanco sobre negro, jaulas, Barbazul de barba azul, la reja con calaveras, un piso
de tablas en fuga. Por eso fue la última. **Acá la mejora no es llenar, es hundir**: más profundidad y
más encierro sin perder el blanco y negro de grabado, que es su mano (no le metas aerógrafo ni color
nuevo; el azul de la barba y el rojo de la reja son los únicos colores y así se quedan).

Ideas, para que elijas y mejores:
- **Que el calabozo siga hacia atrás**: pasillos de celdas que se pierden en lo negro, rejas que se
  repiten achicándose, una escalera que baja.
- **La luz de una sola ventana alta** (la reja proyectada en el piso, en tramado de grabado, no en
  degradé) y polvo que flota en el haz.
- **Lo que gotea, lo que cuelga, lo que se arrastra**: cadenas que se mecen (péndulos de la tanda 3),
  una gota que cae, ratas que cruzan, manos que asoman entre barrotes.
- **El misterio**: algo que se mueve en la celda del fondo si te quedás quieto; la puerta que se
  entreabre.
- Su punto de fuga: el piso de tablas que ya existe, llevado hasta una puerta al fondo.

## Coordinación con `T-529`

La rama `origin/claude/bestiario-rocambole-3238c6` (sin integrar) convirtió en títeres a **la fiera**
y **el pajarito** de la prisión, editó ese recinto en `arte-entornos.ts` y borró `prision-jaula.webp` y
`prision-puerta.webp`. Mismas reglas que en las tandas 3 y 4: no edites el recinto, ni
`rig-entornos.ts`, `escenas.ts`, `recintos.ts`, `elenco.ts`, `vivos.ts`; dejá libres sus lugares
(`git show origin/claude/bestiario-rocambole-3238c6:src/lib/bestiario/rig-fiera.ts` y `rig-pajarito.ts`)
con un test que lo afirme; y no dependas de las dos imágenes que esa rama borra.

## Arrastre de la tanda 4 (chico, si entra)

- Los ojos sin dueño del bajo (`ACECHOS`, lugar en 0,5 de la vista y 610) se abren pegados a la silla
  que flota: correr ese lugar.
- El canto de las columnas del templo se apaga con la lupa.

## Al cerrar cada vuelta

Lo de siempre: hojas antes/después (antes = `cap/` en la primera vuelta), una a 1280×800, la de
quedarse quieto, memoria rama/main (techo +20 %), cuadros con control en banda, visto separado de
escrito, y tu top 5 para la vuelta siguiente o si ya está para cerrar.
