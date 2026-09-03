# Hilo principal → `experiencia` y `contenido`: el video de Último bondi

**Fecha:** 2026-09-02 · **Ciclo 13** · Escrito por el hilo principal, que no es dueño ni
del mapa sección→disco (`UX-04`, de `experiencia`) ni de la nota de derechos (`CNT-01`, de
`contenido`). Por eso esto es una propuesta y no una decisión.

## Qué llegó

El usuario dejó, junto a las tapas, un archivo de video: **la tapa de *Último bondi a
Finisterre* animada**. Los personajes se mueven dentro del ojo de buey y apoyan las manos
contra el vidrio. Ocho segundos, 1920×1080, sin audio útil.

Vive en `Docs/UX/video-master/ultimo-bondi-ojo-de-buey.mp4`, **afuera de `public/`**, por el
mismo criterio con el que viven ahí los másteres de las tapas y de los recortes: al sitio
sólo llega la versión chica, y hoy no hay versión chica porque todavía no está decidido si
va. Llegó con un nombre generado (`Animate_characters_inside_capsul…_1080p_…`) que traía un
`…` de una sola pieza: renombrado a ASCII, que es lo que hace falta para poder escribirlo en
un atributo sin percent-encodearlo cada vez.

## Por qué no entró en este ciclo, con números

1. **Pesa 3.114 KB.** El techo por derivado de tapa que fija `ARQ-schema-adivinar-tapa.md`
   es de 60 KB. Son **52 veces** ese techo, y **dieciséis veces todo el presupuesto de
   imagen del sitio de hoy** (los seis fondos juntos suman 188 KB).
2. **El índice está al final.** El átomo `moov` arranca en el byte 3.181.592 sobre
   3.188.511, o sea en el último 0,2 % del archivo. Sin `faststart`, el navegador **no puede
   pintar ni el primer cuadro hasta bajar los 3 MB**. Eso es un molinete nuevo con forma de
   animación, y los molinetes van abiertos (`D-14`).
3. **No hay ninguna pantalla libre donde ponerlo.** La que viste Último bondi por `D-19` es
   `/juegos/adivinar-la-tapa/`, y ahí el motivo de ese disco **es la respuesta correcta de
   `TP-006` y distractor en `TP-003` y `TP-009`**. Mostrarlo sería soplarle la respuesta a
   quien está jugando. Por eso esa pantalla es la única del sitio cuyo pie de imprenta va
   sin pasada y sin figura.

## Lo que proponemos, en tres partes

### 1. Recodificarlo a la medida del hueco, no del máster

```bash
ffmpeg -i Docs/UX/video-master/ultimo-bondi-ojo-de-buey.mp4 \
  -movflags +faststart -an -vf scale=640:-2 -c:v libx264 -crf 30 -t 6 \
  public/tapas/videos/ultimo-bondi-ojo-de-buey.mp4
```

Sin pista de audio, con el índice adelante, a 640 px de ancho — que es `ANCHO.fondo` en
`generar-tapas.mjs`, o sea la escala a la que el sitio ya sirve un fondo. **Si no baja de
~300 KB, no entra**: se usa un cuadro fijo y listo.

> **Ojo, y es la razón por la que este paso no está hecho:** esta máquina no tiene `ffmpeg`
> instalado (verificado el 2026-09-02). El comando queda escrito para que lo corra quien
> tenga la herramienta; nadie tiene que reinventar los parámetros.

### 2. El rótulo, que es la parte que no se puede saltear

**El dibujo es de Rocambole. El movimiento no.** Y la confusión no es rebuscada: `RES-06`
ficha que Rocambole está vivo y que desde 1996 suma arte digital y animación. El crédito que
el sitio ya usa —*"Tapa: Rocambole (Ricardo Cohen), en baja resolución"*— aplicado a este
archivo **miente sobre lo que hay adentro**, que es exactamente lo que `D-14` no admite.

Registro 3, seco, como pie y nunca como título:

> Dibujo: Rocambole (Ricardo Cohen), tapa de *Último bondi a Finisterre*. El movimiento no
> es de Rocambole: lo generó una inteligencia artificial a partir de esa tapa, en 2026. Él
> no participó.

La ficha de qué es y de dónde salió va a **`CNT-01`**, que es el mapa de *"qué usamos, de
dónde salió, y qué haríamos si alguien pregunta"* — y no a una `RES-`, porque el origen es
de casa y no es un hecho externo que haya que ir a verificar afuera.

Es de `contenido` decidir la redacción final. Lo único que el hilo principal sostiene con
firmeza es que **no puede llevar el crédito de tapa a secas**.

### 3. Dónde iría, si va

**El pie de imprenta de `/redondopedia/ultimo-bondi-a-finisterre/`, detrás de un toque
explícito.**

- Póster quieto por defecto: `preload="none"`, `poster="/tapas/fondo/bondi-engranajes.jpg"`
  —que ya pesa 36 KB y ya tiene su peor caso de contraste medido—, `muted playsinline`.
- Corre **sólo si la persona lo pide**. Así no hay autoplay que apagar bajo
  `prefers-reduced-motion`, no se baja un byte sin pedirlo, y el que no lo toca ve el póster,
  que es la pantalla completa: molinetes abiertos.

**Dónde NO va, y por qué:**

- **No detrás del tablero de "Adiviná la tapa"**: le sopla la respuesta (arriba).
- **No en la ficha del artículo**: `UX-20` §2 le da al artículo una sola capa y dice
  *"nada de movimiento nuevo — un artículo es lectura"*.
- **No en el acierto**: `D-33` cierra esa puerta con todas las letras —*"lo que se estampa
  es el marco, nunca la fotografía de adentro"*— y además un premio que es estampa para
  nueve discos y película para uno rompe la simetría del juego.

## Lo que hay que contestar

1. **`experiencia`**: ¿el pie de imprenta de la ficha de *Último bondi* es lugar para esto,
   o el video no entra en el sitio? El mapa sección→disco es tuyo.
2. **`contenido`**: la redacción del rótulo y su ficha en `CNT-01`.
3. **Quien tenga `ffmpeg`**: correr el comando y decir cuánto pesó. Si no baja de 300 KB, la
   pregunta 1 se cae sola.
