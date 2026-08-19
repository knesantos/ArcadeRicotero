# Propuesta de `investigador` para el hilo principal — registrar un `D-XX` sobre fuentes de letras

- **Fecha:** 2026-08-19
- **Origen:** `RES-23` y la sección "Decisión del usuario sobre `RES-23`" en
  `Docs/INVESTIGACION/INV-21-letras-y-fuimos-reyes.md`.
- **Por qué va como propuesta:** `Docs/DECISIONES.md` es archivo de raíz y **no hay reserva
  del prefijo `D-` entre sesiones**. `D-12` es el último usado. Si yo asigno `D-13` desde
  una sesión paralela, arriesgo exactamente la colisión que `Docs/IDS.md` existe para
  evitar. **Asignale el número vos.**

## Qué hay que registrar

**El usuario decidió usar letras.com y bestiarioredondo como fuentes de letras, después de
que `RES-23` concluyera que no califican.** No es un descuido: es una decisión tomada con
la objeción sobre la mesa, y tiene fundamento.

### Fundamento

*La banda tiene una mística de pocas cosas oficiales.* No hay sitio oficial de letras, no
lo hubo nunca, el memoir del Indio no trae letras completas (`RES-21`), y la única fuente
con autoridad —el arte de los discos— es material físico y offline. Construyeron todo
**sin multinacional, sin TV y sin publicitar los recitales** (`RES-07`): que no exista un
canon digital oficial es coherente con cómo funcionó siempre la banda.

**Exigir una fuente oficial es exigir algo que la banda deliberadamente nunca produjo, y
bloquearía `US-03` para siempre.**

### Alternativa descartada

Esperar una fuente autorizada. Descartada porque no va a existir.

### Consecuencia asumida

Riesgo de verso mal transcripto. Si pasa, **el juego le marca error justo al que se sabe la
letra**, que es el peor fallo posible frente a este público (criterio no negociable 1).

### Mitigaciones que la decisión lleva adjuntas

1. **Cruzar todo contra los 105 temas de `RES-20`. Obligatorio.** letras.com lista 149
   entradas mezclando Indio solista, Fundamentalistas y Skay. Es el único error concreto y
   demostrado de la fuente, y se arregla comparando dos listas.
2. Dos fuentes que coincidan antes de dar un verso por bueno.
3. Empezar por los temas más conocidos, donde un error se caza rápido.
4. Marcar la fuente en el campo `fuentes` de cada ítem (`CTR-02` ya lo exige), para que una
   corrección futura sea trazable.
5. **Confirmar de oído contra el disco.** Es lo que cierra de verdad y es realista:
   `BR-03` muestra 2/1/0 versos, así que el piso de `US-03` necesita **~30 versos**, no 15
   letras enteras. Es una tarde, no un proyecto.

## Lo que también habría que tocar

- **`CNT-01`, casilla de letras.** Hoy está abierta porque no había fuente. Con esta
  decisión pasa a "fuente aceptada con mitigaciones", que es un estado distinto de
  "resuelta". **El gate de `D-07` no se levanta con esto**: la casilla de letras deja de
  estar vacía, pero las 8 preguntas legales de fondo siguen sin responder.
- **`CNT-03`** podría sumar el filtro de los 105 como criterio, que es donde vive el resto
  de los criterios sobre discografía.
