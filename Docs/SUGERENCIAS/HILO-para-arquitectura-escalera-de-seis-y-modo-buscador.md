# Para `arquitectura`: `CTR-01.9` pasa a seis pasos y `CTR-03.5` necesita un modo nuevo

> De: hilo principal · Fecha: 2026-08-23 · Consume: `D-24`, `D-23`, `D-22`, `CTR-01`
> (`.3`, `.4`, `.5`, `.6`, `.7`, `.9`), `CTR-03` (`.1`, `.4`, `.5`), y el relevamiento en
> `HILO-mapa-del-juego-de-referencia.md`.
> **Estado del código:** `US-02` está construido y jugable. Vengo a decirte qué de tu
> contrato quedó viejo y qué escribí yo mientras tanto, para que lo confirmes o lo cambies.

---

## 1. La escalera: seis pasos, y termina en 15 s

`CTR-01.9` fija cinco pasos: 0,1 / 0,5 / 2,0 / 5,0 / 10,0. La escalera que fijó el usuario
es **0,1 · 0,5 · 2 · 4 · 8 · 15**.

**Los 15 segundos no los trae esta decisión: los trajo `D-23`**, que al partir el audio en
dos niveles escribió *"el fragmento: los 15 s de `CTR-01`, 96 kbps mono"* y *"`US-02`
necesita 15 segundos, no dos minutos"*. O sea que `CTR-01.3` —cuyo máximo de 10,0 s viene
de `CNT-01` sección A— **ya estaba desactualizado antes de que yo llegara**, y el que
tiene que decir si el número nuevo se sostiene es `contenido`, no yo.

Lo que hoy manda en el código es **`src/lib/tema/escalera.ts`**, con la tabla del usuario
escrita a mano en `escalera.test.ts` y un comentario que dice que si las dos dejan de
coincidir, la que se corrige es la del código. Ese archivo se puede borrar el día que
`CTR-01.9` diga lo mismo.

**Un número tuyo que hay que recalcular:** `CTR-01.5` (presupuesto de precarga) está
calculado sobre 10,0 s. A 15 s, un fragmento decodificado a 44,1 kHz mono son ~2,6 MB, así
que la ventana de tres buffers son ~8 MB. Lo implementé con ese techo —tres buffers, el
que suena más los dos que vienen, LRU— pero el número lo recalculé yo y es tuyo.

**Y uno que hay que corregir en `D-23`, a favor:** ahí dice 120 KB por fragmento y 12,5 MB
en total. 120 KB son 10 s a 96 kbps; a 15 s son ~180 KB, o sea **~19 MB** para los 104.
Sigue siendo nada, pero el número escrito estaba viejo.

## 2. `CTR-03.5` se cierra con un valor que no estaba en la lista

Dejaste `modoRespuesta` con dos valores —`"opciones"` y `"texto"`— y el pedido a `producto`
de que eligiera. El usuario eligió un tercero: **`"buscador"`**. Se escribe, se elige de
una lista de sugerencias, y lo que viaja es la **identidad** del tema.

Vale la pena decir por qué no es `"texto"` con otro nombre: con texto libre hay que
decidir si "Ji ji ji" y "Jijiji" son la misma respuesta —el caso que vos mismo dejaste
anotado en `CTR-03.3`, punto 4—, y esa pregunta no tiene una respuesta buena. Con lista no
existe: `acierta()` compara slugs y no hay comparación de títulos en ninguna parte del
juego.

**El corolario grande, y es el que te va a interesar:** con `"buscador"`, un ítem del banco
**ya no necesita distractores**. Y como la respuesta correcta es `credito.tema`
(`CTR-03.3`), un ítem tampoco necesita casi nada más. Tanto que **el banco dejó de hacer
falta**: el catálogo se arma en build desde `RES-20` (los 105, con disco, pista y año) y
el único dato que hace falta cargar es **qué archivos de audio existen**.

## 3. Lo que hice con `CTR-03.1`, y por qué se aleja de lo que escribiste

`src/data/adivinar-tema.json` existe, pero **no es un banco de ítems: es un manifiesto de
archivos**. Cada entrada es `{slug, titulo, duracionSeg, entero}` y la escribe
`scripts/generar-fragmentos.mjs`. Vacío es un estado válido y la pantalla lo dice.

Las dos reglas de `CTR-03.6` (fuentes obligatorias, `sensibleA` con `audio`) **no están en
el manifiesto**, y quiero que lo veas antes de que parezca un olvido:

- **`fuentes`**: tu regla exige `RES-XX` por ítem porque lo que el ítem afirma es
  tema + disco + año. Acá esos tres datos **no los afirma un ítem: los lee de `RES-20` en
  build**. La fuente no es una por ítem, es una para los 105, y es la misma ficha que ya
  cruza el cancionero por `D-13`. Un archivo de audio cuyo nombre no resuelve contra los
  105 **rompe el build** (`catalogo.test.ts` lo cubre).
- **`sensibleA`**: era el mapa para poder bajar algo rápido. Acá el mapa es la carpeta:
  `public/audio/fragmentos/` son, uno a uno, los temas que el sitio publica en audio.

Si querés esos campos igual, es una fila más en el manifiesto y la escribe el generador.
Decilo y lo hago.

## 4. Lo que sí respeté al pie

- **`CTR-01.4`**: `public/audio/fragmentos/<slug>.mp3`, slug ASCII derivado del título, y
  el JSON guarda el slug y no la ruta. El motor arma la URL desde una constante.
- **`CTR-01.6`**: el generador corre tus dos comandos —`loudnorm=I=-14:TP=-1:LRA=11` sobre
  el tema entero, después el recorte a 96 kbps mono 44,1 kHz con `-map_metadata -1`.
- **`CTR-01.7`**: la verificación que dejaste pedida como `scripts/validar_fragmentos.py`
  **está escrita**, adentro del generador, corriendo sobre cada archivo apenas se produce:
  codec, sample rate, canales, duración y peso. La quinta condición —escuchar los primeros
  100 ms— la imprime como recordatorio, porque ninguna máquina la puede hacer.
- **`CTR-03.4`**: el JSON no guarda **ni un solo dato de los pasos**. Los seis salen del
  mismo `AudioBuffer`. Cambiar la escalera no migra ningún dato.
- **`ADR-01`**: no hay nada de Spotify en la partida. El reveal ofrece el tema entero
  servido por el sitio (`D-22`) si el archivo existe, y si no, no ofrece nada.

## 5. Lo que queda tuyo y no toqué

`ADR-01` sigue abierto en la parte que `D-22` le cambió de pregunta: si Spotify se queda
como enlace extra o se retira del reveal. Hoy el código no lo usa, que es la opción
conservadora, pero **no lo decidí yo**.
