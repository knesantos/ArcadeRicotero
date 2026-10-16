# Para todos los roles: lo que `D-72` deja en su carpeta sin escribir

> De: hilo principal · 2026-10-15 · rama `ciclo-21/recitales`
> Decisión: `D-72` en `Docs/DECISIONES.md`. Números reservados en `Docs/IDS.md`.

El usuario pidió la idea 15 (los recitales en pantalla) y, en el mismo acto, un juego para armar
tu propio recital que aproveche los recortes. Las dos cosas están construidas y probadas:

- **"En vivo"**: `src/pages/redondopedia/en-vivo.astro`, con su isla `src/scripts/en-vivo.ts`.
- **"Armá tu recital"**: `src/pages/juegos/arma-tu-recital.astro`, con su isla
  `src/scripts/partida-recital.ts`, la lógica pura en `src/lib/recital/` y la copia en
  `src/lib/recital/copy.ts`.
- **Lo compartido**: la rocola de recortes (`src/scripts/rocola.ts`) y la quinta forma del link
  (`src/lib/desafio.ts`, al final).

Como en `D-69`, los documentos de cada rol quedaron atrás del código. Esto es lo que le toca a
cada uno, con lo que el código ya decidió para que no haya que adivinarlo.

## `producto` — `T-421`

1. **`US-11`, "En vivo".** Criterios que el código ya cumple y conviene asentar: muestra solo listas
   enteras con licencia que permita copiarlas; cada una con el rótulo de `RNF-CTR-19-B`; el conteo
   de setlist.fm con el de `RNF-CTR-19-A`; el índice enlaza y no copia; cada tema con recorte
   suena al tocarlo y cada lista entera suena de corrido.
2. **`US-12`, "Armá tu recital".** Sin puntaje, como `BR-22`. Lo que el código fijó y es de
   `producto` confirmar o cambiar: **5** temas como mínimo para cerrar, **24** de techo en la
   lista y **4** de bis (`src/lib/recital/armado.ts`, `src/lib/desafio.ts`); suenan diez segundos
   por tema. **Enmienda del mismo día:** es una expresión de deseo; los lugares son 20 estadios y 14
   teatros de `src/data/lugares-recital.json`, más un descampado en la localidad que se escriba y un
   lugar escrito a mano.
3. **`PRD-backlog-ideas.md`**: `IDEA-15` (nunca se había escrito: estaba reservada en
   `ORQ-plan-ciclo-16.md` §5) e `IDEA-16` ("Armá tu recital"), las dos como promovidas.
4. **El piso.** "En vivo" no tiene piso de ítems: muestra lo que hay. Si `producto` quiere uno
   (por ejemplo, cinco listas enteras antes de anunciarla), es el pedido a `investigador` de
   abajo.

## `arquitectura` — `T-422`

1. **`CTR-19.8`, regla 4.** Decía que ningún módulo lee la pieza 2. Ahora la lee **una sola
   página**, `en-vivo.astro`, con los rótulos de `RNF-CTR-19-B` en el mismo bloque. El test t8 de
   `en-vivo.test.ts` la nombra en una lista de una línea (`LEEN_LA_PIEZA_2`). El argumento: la
   única fuente es CC0 y la salida es CC0, así que no hay "compartir igual" que se escape; si
   entra una fuente BY-SA, esa lista se vuelve a mirar. El juego no lee la pieza 2: saca los
   lugares de `lugares-recital.json` (desde la enmienda, nada de recitales de verdad).
2. **`ADR-02`, la quinta forma de link.** `?g=recital#r=1.<lugar>.<lista>.<bises>`: el lugar por
   su slug (que tiene que estar entre los que ofrece el juego), y cada tema como su lugar en los
   105 de `RES-20`, dos caracteres en base 36. Va **fuera de la unión `Desafio`**, con su propio
   par de funciones (`armarLinkRecital`, `leerRecital`), para no tocar las otras cuatro. Lista
   blanca, techos, sin repetidos; ante cualquier cosa rara, la lista entera se descarta. Tests en
   `src/lib/recital/link.test.ts`.
3. **La lámina** (`src/lib/ponelos/lamina.ts`) suma dos campos opcionales: `tintaJuego` y
   `renglonPorFicha`. Sin ellos dibuja lo mismo que antes. Si `CTR-13` describe la lámina, va ahí.
4. **El texto de `cambios`** de la pieza 2 ahora se lee en pantalla, así que se le pusieron las
   tildes y se sacó "slug" (en `scripts/ingerir-recitales.mjs` y en el JSON, el mismo texto).

## `experiencia` — `T-423`

El flujo es: puerta → lugar → armado → la noche. Lo que conviene llevar a un `UX-` y al lienzo:

- **La hoja**: la lista es papel (`--papel`) con cinta, tinta `--fondo`, números en
  `--papel-tenue`, títulos en la rotulada en mayúsculas. Los pares son los del collage, ya en
  `contraste.test.ts`.
- **El tema marcado** muestra sus acciones abajo del renglón (Subila, Bajala, Al bis, Escuchala,
  Sacala). El estado es contorno; lo que suena, subrayado grueso.
- **El cajón**: los 105 con su tapa chica, filtro por disco (el borde de cada uno en la tinta de
  su disco), "Sorteá uno" y "Silenciá".
- **El pie pegado abajo** con "SALÍ A TOCAR". Falta probar la barra de Safari (`T-426`).
- **La noche**: el título en la letra de la banda, la lista numerada con los bises aparte, y
  "Escuchá la lista" marcando el renglón que suena.
- **En vivo**: las listas enteras como hojas de papel; el conteo y el índice sobre el fondo.

## `contenido` — `T-424`

Leer `src/lib/recital/copy.ts` entero contra `voz-ricotera.md` y `CNT-02`. Tres cosas para mirar
con atención:

1. **El renglón de lugar** nuevo de `LUGARES`: *"Tenés cinta y una lista en blanco."* (la hoja
   del escenario). Contra `CNT-13`.
2. **La bajada del casete**: *"Esta noche la lista la escribís vos."* canta; la segunda oración
   nombra.
3. **La entrada de "En vivo"** está en registro 2 y declara la duda (hay muy pocas listas
   enteras). Los rótulos van en registro 3.

## `contenido` e `investigador` — `T-427`, los lugares para soñar

`src/data/lugares-recital.json` lo escribió el hilo principal (la carpeta es de `contenido`):
veinte estadios y catorce teatros de la Argentina, con su ciudad. No hay ficha detrás: son
nombres conocidos, y el archivo dice que no afirma que la banda haya tocado ahí. Pedidos:
`investigador`, confirmar cada nombre y ciudad (en particular los nombres oficiales que cambiaron:
el Monumental, el Único de La Plata); `contenido`, leer la lista y sumar lo que falte (Jujuy,
Corrientes, la Patagonia).

## `investigador` — `T-425`

**Más listas enteras con licencia abierta.** Hoy son dos (Concordia, diciembre de 1995). Cada
una que entre a `recitales.json` por `scripts/ingerir-recitales.mjs` aparece sola en "En vivo",
con su rótulo, sin tocar código. Las que más valdrían: Huracán 93 y 94, Obras 89, River 2000 y
2001. Si alguna fuente que no sea CC0 tiene listas, avisar antes de cargarla: cambia la frontera
de `CTR-19.8`.

## Enmienda del mismo día: las listas de Discogs (`T-425`, `INV-425`)

Entraron 25 noches de Discogs a `recitales.json`, con el pedido textual del usuario: *"Cargá las
listas de Discogs con el rótulo de cargadas por la gente y sin revisar. Fandom no, hasta confirmar
la licencia."* Lo que le toca a cada uno:

- **`arquitectura`**: asentar en `CTR-19.11` el campo optativo `revision: "sin-revisar"` de la
  fuente, en `CTR-19.7` la vía de Discogs del script (tabla `GRABACIONES`, lugar y fecha desde la
  ficha, partir un renglón de dos temas solo si las dos partes cruzan) y en `CTR-19.2` el bloque de
  alias de Discogs de `temas.ts`.
- **`investigador`**: lo que dejó abierto `INV-425`, que es el volcado CC0 de los releases, los
  "datos restringidos" de los términos de Discogs, la licencia del Fandom y las tres fechas en
  disputa.
- **`contenido`**: los 48 renglones sin identificar (inéditos como "Roxana Porchelana", "Pura
  suerte" o "Blues del noticiero", cánticos como "Es un sentimiento", y renglones con varios temas).
  Clasificarlos con ficha es trabajo suyo; el script nunca pone una clase por su cuenta.
