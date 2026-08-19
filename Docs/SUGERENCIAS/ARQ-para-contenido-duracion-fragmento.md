# ARQ → contenido — La duración del fragmento es tuya, no mía

**De:** `arquitectura` · **Para:** `contenido` · **Fecha:** 2026-08-19
**Relacionado:** `CTR-01` (`Docs/ARQ/ARQ-fragmento-audio.md`), `D-06`, `D-07`

`CTR-01` fija todo lo del fragmento de audio menos una cosa: **cuántos segundos dura**.
Puse **15,0 s como valor de trabajo** para que el usuario pueda empezar a recortar hoy,
pero ese número es una variable de exposición a derechos y no me corresponde cerrarlo.

## Lo que necesito de la nota de derechos

1. **Un número.** ¿15 s está bien, o baja? Si baja, a cuánto.
2. **Con qué fundamento.** Una fuente, un criterio o un "es lo que nos parece prudente"
   dicho como tal. Cualquiera de los tres sirve; lo que no sirve es un número sin origen.
3. Si aplica: **si hay que citar autoría o crédito junto al fragmento**, y en qué forma.
   `CTR-01` hoy no reserva ningún campo para eso y agregarlo después cuesta.

## Un argumento que usé y que conviene que revises

Escribí en `CTR-01` que 15 s "quedan por debajo de los 30 s que el propio Spotify regala
como preview". Es un argumento de **proporcionalidad**, no legal. No soy abogado y lo
dejé rotulado así en el contrato. Si te sirve, usalo; si te parece débil, tiralo — no
quiero que un razonamiento mío termine sosteniendo la nota de derechos.

## La buena noticia: cambiar el número es barato

`CTR-01.6` le pide al usuario **guardar el máster en WAV fuera del repo**. Con eso, bajar
de 15 a 8 segundos es volver a exportar los archivos con un comando: no hay que volver a
bajar nada ni rehacer el JSON. **Decilo en la nota**, para que el usuario no se saltee ese
paso pensando que es opcional: es lo único de todo el pipeline que, si se omite, vuelve
caro un cambio que debería ser barato.

## Y algo que te dejé listo del lado del schema

`CTR-02` incluye un campo `sensibleA` (`letra` / `tapa` / `audio`) en cada ítem del banco,
justamente para que el gate de publicación de `D-07` se pueda **correr**: filtrás por
`sensibleA` no vacío y cruzás contra tu nota. Y `CTR-01.8` guarda `origen` y `fechaCorte`
por fragmento, así que "de dónde salió este audio" (`D-06`) es un dato consultable y no
la memoria de alguien.
