# UX-26 — La rocola: qué se ve y qué se toca cuando la cinta pone un tema

> Rol dueño: `experiencia`. `T-216`, ciclo 14.
>
> **Consumo** — leído entero para escribir esto, no citado de memoria:
> `Docs/ARQ/ARQ-rocola.md` (`ADR-07` completo, los cinco candados de `ADR-07.1`, el mapa de
> rutas de `ADR-07.2`, `ADR-07.4` sobre el hueco de arranque y la púa de `ADR-07.7`,
> `ADR-07.6` sobre la vuelta y las fallas seguidas, `ADR-07.8` sobre el rearme, `ADR-07.9`
> el contrato revisado de `cinta.ts` y el nuevo `rocola.ts`); `Docs/SUGERENCIAS/ARQ-para-
> experiencia-la-rocola.md` (las cuatro consecuencias que me deja); `Docs/UX/UX-21-el-
> interruptor-de-cinta.md` entera (la hoja que extiendo, y que obedezco donde `ADR-07` no
> la contradice: `§0` el nombre, `§1` dónde vive, `§2` la forma, `§3` los cuatro textos,
> `§4` cómo se lee sin color, `§5` por qué apagada es el default, `§7` la pantalla de un
> juego); `src/scripts/cinta.ts` entero (`pintar()`, `dondeVa()`, `montar()`, el patrón
> `boton.after(motivo)`); `src/lib/sitio/copy.ts` (el bloque `CINTA`, líneas 95-120, y el
> patrón de función dinámica de `creditoTapas`); `src/lib/sitio/cinta.ts` (el tipo
> `EstadoCinta`, `cambiarEstado()` con su guarda `if (estado === nuevo) return`,
> `alCambiarLaCinta()`); `Docs/UX/UX-20-el-sitio-como-lugar.md` (el catálogo de qué nunca
> se mueve, `prefers-reduced-motion`); `Docs/UX/UX-22-la-imprenta-de-rocambole.md` (`§1` la
> doctrina de que el acierto es el único grito, para no repetir el error de tratar esto
> como un segundo grito); `Docs/DECISIONES.md` `D-14` (molinetes abiertos, riesgo asumido),
> `D-17` (voseo, sin infinitivo, sin anglicismo), `D-21` (las tapas reales — de dónde sale
> y hasta dónde llega la obligación de crédito), `D-33` (el acierto es el único grito),
> `D-35` (el pie de imprenta, y que `PORTAL.pie` es incondicional en toda pantalla);
> `src/components/PieImprenta.astro` entero (dónde vive hoy el crédito de tapas y por qué
> el pie genérico es incondicional); `.claude/rules/diseno-marca.md` entera (tics vetados,
> la excepción de barra lateral que no aplica acá); `.claude/rules/voz-ricotera.md` entera
> (los tres registros, la regla de las dos líneas); `src/lib/voz.test.ts` entero (las siete
> reglas auditadas, verificadas a mano una por una sobre cada cadena nueva de este
> documento); y `src/data/tapa.json` (los diez discos del catálogo de "Adiviná la tapa",
> contados a mano: diez apariciones de `"disco"`), usado para fundamentar la sección 1.
>
> **Resuelve:** `T-216`. Qué se ve cuando la rocola pone un tema (el candado 4 caído de
> `ADR-04`), el crédito de lo que suena, el control de "poné otro", los cuatro estados de
> `UX-21` revisados contra el modo nuevo, y qué pasa en el hueco del primer arranque. **No
> reabre** `ADR-07` (el motor, el grafo, la vuelta, la púa) ni `UX-21` donde `ADR-07` no la
> contradice. **No resuelve:** la construcción (`T-217`/`T-218`, hilo principal), ni el
> texto final si `contenido` quiere afinarlo — dejo redacción completa y compatible con
> `voz.test.ts`, no un placeholder.

## Cómo leer este documento

Sin ficha `RES-XX`: esto es interfaz, no investigación sobre la banda. Todo acá es
**criterio propio de `experiencia`**, apoyado en lo ya decidido (`ADR-07`, `D-14`, `D-17`,
`D-21`, `D-33`, `D-35`) y en el código real, citado con archivo. Donde uso un número del
catálogo de contenido (los diez discos de "Adiviná la tapa", los 95 recortes de "Adiviná
el tema") lo cuento a mano desde el JSON, igual que hace `ADR-07` con sus propios conteos.

---

## 1. Qué se ve cuando la rocola pone un tema

**Se ve el título del tema, siempre acompañado de si es un recorte o el tema entero.
Nunca se ve el disco.**

### 1.1 Por qué el título sí

Es la consecuencia directa del candado 4 caído: *"el que prende una rocola quiere saber
qué puso el aparato"* (`ARQ-para-experiencia-la-rocola.md` §1). Ocultarlo del todo
desperdiciaría exactamente lo que `ADR-07` construyó para que yo lo pintara
(`piezaSonando(): Pieza | null`), y volvería a UX-21 sin sentido el paso de "no lleva
información" a "nombra su propia pieza".

### 1.2 Por qué el recorte/completo sí, siempre

Hoy los 95 ítems de `src/data/adivinar-tema.json` son recortes (0 con `"entero": true`,
contado a mano). Si la estampa solo dijera el título, no mentiría, pero tampoco diría toda
la verdad que un rótulo de registro 3 tiene que decir: un jukebox real distingue el corte
promocional de 30 segundos del tema entero, y acá la diferencia es la mitad del pedido del
usuario (*"uno de los temas enteros [...] cuando no haya más que ponga los recortes
enteros"*). La forma que no miente y no exige leer nada de más es marcar los dos casos con
la misma regla, siempre, en vez de solo avisar la excepción — así el día que llegue el
primer tema entero (`T-219`) no hace falta decidir de nuevo si avisar o no.

### 1.3 Por qué el disco no — el riesgo del portal, resuelto

Este es el punto que `ADR-07` me dejó explícitamente para resolver por escrito, y la
resolución tiene un motivo cuantificable, no solo prudencia.

**El riesgo real:** alguien lee en el portal el título de un tema que la rocola está
poniendo, y treinta segundos después entra a un juego donde ese mismo tema es la
respuesta. No es un riesgo teórico — el catálogo de audio es el mismo: los 95 recortes de
la rocola son también las respuestas de `US-02`, y varios de ellos son además la materia
de `US-07`.

**Por qué la respuesta es "nombrar el tema sí, nombrar el disco no", y no "no nombrar
nada":**

| Si la rocola nombrara... | Universo de respuestas posibles que puede filtrar | Contado en |
|---|---|---|
| El **tema** | 95 recortes | `adivinar-tema.json`, 95 apariciones de `"slug"` |
| El **disco** | **10 discos** | `tapa.json`, 10 apariciones de `"disco"` |

Nombrar el disco es un filtro casi diez veces más específico que nombrar el tema, porque
`US-04` ("Adiviná la tapa") tiene un universo de respuestas de solo diez discos. Si la
rocola dijera "estás escuchando algo de *Último bondi*" y treinta segundos después esa
persona entra a "Adiviná la tapa" y el ítem es *Último bondi*, la rocola le regaló la
respuesta con una probabilidad de una en diez. Nombrar el tema, en cambio, filtra sobre
noventa y cinco posibilidades, y solo afecta a los juegos que piden reconocer **cuál** es
el tema (`US-02`, `US-07`) — no a "Completá la letra" (`US-03`), donde ya sabés qué tema es
y lo que hay que adivinar es la palabra que falta, ni a "Adiviná la tapa", que pregunta por
el disco. **Por eso el disco no se nombra nunca, ni junto al título ni en su lugar: es la
información que más barato compra una respuesta ajena.**

**Por qué igual alcanza con nombrar el tema, y no hace falta ocultarlo también:**

1. **Es conocimiento previo, no un soplo del propio mecanismo del juego.** `ADR-07.2` ya
   resuelve el soplo estructural — el que importa de verdad — con la lista blanca: la
   rocola **nunca suena en la** pantalla de un juego. Lo que queda acá es
   alguien que, por casualidad, ya sabía el título antes de jugar. Eso no es distinto de
   alguien que reconoce el tema porque lo escuchó mil veces en la vida real: ningún juego
   de trivia se protege contra el jugador que ya sabe la respuesta, y protegerse sería,
   literalmente, penalizar al que se sabe el tema — que es exactamente lo que `D-14`
   prohíbe por el lado contrario (marcarle error).
2. **La ventana es corta y se corta sola.** `ADR-07.8`: al navegar, el tema se corta y no
   sigue sonando. La exposición dura, como mucho, lo que la persona se queda mirando esa
   pantalla antes de tocar un casete.
3. **La probabilidad de colisión exacta es baja y no manipulable.** Nadie —ni la rocola ni
   el juego— elige a propósito coincidir: son dos sorteos independientes sobre el mismo
   catálogo. Un accidente de una en noventa y cinco, repetido pocas veces por sesión, no es
   la clase de daño que `CLAUDE.md` declara inaceptable (un dato falso marcado como
   correcto); es una casualidad favorable, del mismo tipo que ya tolera cualquier trivia.

**Lo que esto no decide:** si algún día el catálogo de "Adiviná el tema" crece mucho más
rápido que el de "Adiviná la tapa" o viceversa, esta cuenta se puede repetir con los
números nuevos — el criterio (nombrar lo que filtra menos) no cambia, los números sí
pueden.

### 1.4 El texto exacto

Nueva entrada en `CINTA` (`src/lib/sitio/copy.ts`), función dinámica, mismo patrón que
`PORTAL.creditoTapas`:

```ts
/**
 * Qué pieza está sonando, para la línea que cuelga del interruptor cuando la rocola
 * pone un tema (`UX-26`). Nunca nombra el disco: es la mitad del riesgo de soplar una
 * respuesta de "Adiviná la tapa" que esta hoja decidió no correr.
 */
suena: (titulo: string, entero: boolean) => `${titulo} · ${entero ? 'completo' : 'recorte'}`,
```

Ejemplos reales, contra el catálogo de hoy (0 enteros): `"Ji Ji Ji · recorte"`,
`"Un pobre diablo · recorte"`. El día que exista un entero: `"Vencedores vencidos ·
completo"`.

---

## 2. El crédito de lo que suena

**No hace falta un mecanismo nuevo. El pie genérico ya lo cubre, y `D-21` no se extiende
acá.**

### 2.1 Por qué `D-21` es de tapas, no de audio

`D-21` nace, literalmente, de un problema de **imágenes**: qué edición de qué tapa, si esa
imagen corresponde de verdad al disco que dice ser (`RES-25`, la figura encadenada de
`INV-02`). El mecanismo que construyó —`credito-pantalla`, `PORTAL.creditoTapas`, el pie
de `D-35`— existe para responder **"¿qué tapa se usó en esta pantalla, para poder
defenderlo si alguien pregunta?"**. La rocola no muestra una imagen nueva: reproduce un
archivo de audio que el sitio **ya sirve** desde otros tres juegos, sin que nadie haya
necesitado, hasta hoy, un crédito por ítem para eso.

### 2.2 Lo que ya existe y alcanza

`PORTAL.pie` (`src/lib/sitio/copy.ts:28-31`) se imprime **siempre**, en cualquier pantalla,
sin condición (`PieImprenta.astro:104`, `{PORTAL.pie}` fuera de cualquier `if`), y ya dice:

> *"[...] la música, de Patricio Rey y sus Redonditos de Ricota. [...]"*

Es un crédito genérico, de todo el sitio, para toda la música que el sitio reproduce —el
mismo que ya cubre los fragmentos de `US-02`, los mp3 enteros de `D-22` y ahora la rocola.
No pide un crédito por canción porque no hay una pregunta de edición o de atribución
dudosa como la que sí tiene una tapa: la banda es la banda, no hay una versión "verdadera"
contra una "editada" que discutir.

### 2.3 Lo que sí necesito de `contenido`

`CNT-16` está reescribiendo el pie **en esta misma ráfaga**. No doy por sentado qué texto
va a quedar. Lo que pido, como requisito de esta pieza y no como sugerencia de redacción:
**que la frase que acredita la música a la banda se mantenga, en cualquier forma que
`CNT-16` elija**, porque es el único crédito que sostiene a la rocola. Si `CNT-16` la saca
o la reduce a "arte de tapas" sin mencionar la música, esta sección deja de estar resuelta
y hay que volver a esta hoja.

### 2.4 Lo que decido no hacer

- **No sumar el título de cada pieza al crédito recalculado de `D-35`** (el que hoy suma
  discos vistos por la sesión). Ese mecanismo existe para tapas —imágenes con un problema
  real de edición— y extenderlo a canciones sería inventar una obligación que ninguna
  decisión pide y que además reintroduce el riesgo del disco que la sección 1 evitó: ese
  crédito nombra discos, no canciones.
- **No repetir "Patricio Rey y sus Redonditos de Ricota" junto a cada título.** Todo el
  sitio es sobre esta banda; nombrarla en cada línea de la rocola sería ruido — la misma
  lógica del rasgo 4.6 de `voz-ricotera.md` ("no explica lo que ya se sabe por contexto").

---

## 3. El control de "poné otro"

**Existe, en dos formas según el modo, vive pegado al interruptor, y es un botón de
acción, no un rótulo de estado.**

### 3.1 Las dos formas, y por qué son dos y no una

| Texto visible | Cuándo aparece | Qué hace | Por qué existe |
|---|---|---|---|
| **`PONÉ UN TEMA`** | `modoDeLaCinta() === 'cama'`, la ruta es de rocola (`modoEnRuta(location.pathname) === 'rocola'`), y el estado es `sonando` o `callada` | Intenta `prenderRocola()`: sube la cinta de cama a rocola sin apagar nada | Es la consecuencia de `ADR-07.8`: `rearmarCinta()` siempre arma en modo cama, así que alguien que navega con la cinta ya prendida llega a una pantalla que podría sonar y se encuentra con silencio ambiente. Sin este botón, el único camino sería apagar y volver a prender — dos toques por uno |
| **`PONÉ OTRO TEMA`** | `modoDeLaCinta() === 'rocola'` y `piezaSonando() !== null` y el estado es `sonando` | Llama a `proximaPieza()` | Es el control de "poné otro" que pide el encargo, y mueve bytes: por eso exige el mismo gesto explícito que ya exige `ADR-07` para cualquier cosa que cueste hasta 4 MB |

**Por qué no es un solo botón con un solo texto:** dicen cosas distintas y hacen cosas
distintas. "Poné un tema" es la primera vez; "poné otro" ya asume que hay uno sonando.
Fusionarlos en una sola palabra ambigua ("Cambiar") sería exactamente la clase de rótulo
que no dice la verdad sobre lo que hay adentro.

### 3.2 Por qué no aparece en más casos

- **Nunca en `apagada`.** El primer toque sobre el interruptor principal ya arranca en el
  modo que la ruta permite (`prenderCinta()` sin argumento, `ADR-07.9`): en una ruta de
  rocola, ya intenta poner un tema directamente. Un segundo botón ahí sería un segundo tap
  para lo mismo que el primero ya hace.
- **Nunca en `bloqueada`.** No hay nada que subir de modo: no hay grafo. El interruptor
  principal ya ofrece reintentar (`UX-21 §3.1`).
- **Nunca cuando la rocola está `callada`.** Saltar una pieza que no se puede oír gasta
  bytes sin ningún beneficio perceptible — es la aplicación literal de "un control que se
  toque sin querer es plata de otro" (`ARQ-para-experiencia-la-rocola.md` §3) llevada al
  caso de un control que sí se toca a propósito pero no tiene con qué recompensar el toque.
- **Nunca fuera de una ruta de rocola.** Es el punto 4 de la propuesta de `arquitectura`,
  literal: no se ofrece ahí un control que no va a sonar. La isla mira `modoEnRuta()`, no
  solo el modo actual.

### 3.3 Forma y accesibilidad

Mismo lenguaje visual que `.casete-accion` (sello de goma: rectángulo de esquina casi
viva, borde fino, mayúsculas, apenas torcido — nunca pastilla, nunca ícono de librería),
`--toque-min: 48px` como piso. Es un botón de una sola acción, no un interruptor: **no
lleva `aria-pressed`** (eso es del botón principal, que sí alterna entre dos estados). El
texto visible es autosuficiente como nombre accesible — a diferencia del interruptor
principal, acá no hace falta separar "qué dice la estampa" de "qué hace el toque", porque
el texto **es** el verbo de la acción.

### 3.4 Dónde vive en el DOM

Mismo patrón que ya usa `src/scripts/cinta.ts:92-100` para `.cinta-motivo`
(`boton.after(...)`): un elemento hermano del botón principal, en su propio renglón debajo
de `.cabecera-sitio`, nunca compitiendo por el ancho ajustado de esa fila (`UX-21 §1`, los
369 px contra 343 disponibles a 375 px ya medidos ahí). Boceto de las dos combinaciones
posibles:

```
┌──────────────┐
│  ▶ SONANDO   │                  ← modo cama, en ruta de rocola
└──────────────┘
[ PONÉ UN TEMA ]

┌──────────────┐
│  ▶ SONANDO   │                  ← modo rocola, con pieza sonando
└──────────────┘
Ji Ji Ji · recorte    [ PONÉ OTRO TEMA ]
```

La línea del tema (`§1.4`) y el botón de esta sección conviven en el mismo renglón cuando
los dos corresponden; nunca se solapan porque son mutuamente excluyentes con
`.cinta-motivo` (`bloqueada` no tiene pieza ni modo cama-en-ruta-de-rocola al mismo
tiempo).

---

## 4. Los estados, revisados

Los cuatro valores de `EstadoCinta` **no cambian** — `ADR-07.9` ya lo fija y lo repito para
que quede junto a la tabla: describen el sonido, no el modo. Lo que agrego es una capa
ortogonal (modo × pieza) que decide **qué elementos adicionales cuelgan del interruptor**,
nunca una quinta palabra ni un quinto símbolo en la estampa misma.

| Modo | Estado | Estampa (sin cambios de `UX-21`) | Línea del tema (`§1`) | Control secundario (`§3`) |
|---|---|---|---|---|
| — | `apagada` | `▷ CINTA APAGADA` | no | no |
| `cama` | `sonando` | `▶ CINTA SONANDO` | no | `PONÉ UN TEMA` (solo en ruta de rocola) |
| `cama` | `callada` | `❚❚ CINTA CALLADA` | no | `PONÉ UN TEMA` (solo en ruta de rocola) |
| `rocola` | `sonando`, sin pieza confirmada todavía (hueco de arranque, `§5`) | `▶ CINTA SONANDO` | no (todavía no hay qué mostrar) | no |
| `rocola` | `sonando`, con pieza | `▶ CINTA SONANDO` | sí | `PONÉ OTRO TEMA` |
| `rocola` | `callada` | `❚❚ CINTA CALLADA` | sí, **la misma pieza, congelada** (ver abajo) | no |
| — | `bloqueada` | `▷ CINTA BLOQUEADA` + motivo | no | no |

**Por qué la línea del tema se congela en vez de desaparecer durante `callada`:** la pieza
no cambió, solo dejó de ser audible por un rato (algo más importante está sonando, `ADR-
07.1` candado 3). Borrar el título ahí sería mentir por omisión — como si la rocola se
hubiera olvidado de qué estaba poniendo. El símbolo `❚❚` ya dice "no se oye ahora"; el
título sigue diciendo "esto es lo que va a seguir cuando se libere".

**Por qué esto no inventa un quinto estado y no rompe `ADR-04.6`/`UX-21 §4`:** ninguna
palabra ni símbolo nuevos entran a la estampa. Los elementos nuevos son **hermanos** del
botón, legibles con las mismas reglas de siempre —texto, nunca solo color, sin pastilla,
sin ícono de librería— y su presencia o ausencia ya es, en sí misma, información sin
depender de ningún tinte: hay línea de tema o no la hay, hay botón secundario o no lo hay.

**Con `prefers-reduced-motion`:** no aplica nada nuevo. Ninguno de estos elementos tiene
movimiento propio — aparecen y desaparecen con el cambio de estado/modo, igual que
`.cinta-motivo` ya lo hace hoy sin animación.

---

## 5. El momento del estreno

**No hay indicador de carga. La cama tapa el hueco, la línea del tema aparece recién
cuando hay algo real que mostrar, y si todo falla la cinta se queda sonando lo de
siempre, sin avisar nada.**

### 5.1 Qué se ve y qué se oye

Desde el primer toque sobre el interruptor en una ruta de rocola:

1. **Al instante:** la cama de `ADR-04` arranca como siempre (siseo, arrastre, la rampa de
   `SUBIDA_SEG`), y la estampa pasa a `▶ CINTA SONANDO` — es verdad, se está oyendo algo,
   aunque todavía no sea un tema.
2. **La púa de `ADR-07.7` suena encima**, tapando los primeros ~500 ms mientras el
   `<audio>` recién apunta a su `src`. Es exactamente para lo que esa pieza existe.
3. **Ningún texto nuevo aparece todavía.** `piezaSonando()` devuelve `null` hasta que el
   navegador confirma que la pieza está sonando de verdad — no en el instante en que se le
   pidió `play()`. La línea del `§1` no se imprime antes de tener algo cierto que decir.
4. **Cuando la pieza arranca de verdad**, la línea del tema aparece (y, si corresponde,
   `PONÉ OTRO TEMA`). Con buena conexión esto pasa dentro de la ventana que tapa la púa, y
   se siente instantáneo. Con una conexión lenta, la cama sigue sonando sola —ambiente
   honesto, no silencio— hasta que el tema llega.

**Por qué no hay un tercer texto tipo "buscando" o un ícono de espera:** dos razones, y
las dos vienen de reglas que ya existen. Primero, **`loading` es un anglicismo vetado** por
el glosario de `voz.test.ts` línea 146, así que ni la palabra en inglés ni su traducción
literal ("cargando") encajan con lo que el resto del sitio hace en estos huecos — el
proyecto no tiene precedente de un estado de espera textual en ningún lado. Segundo, **un
ícono de reloj o un spinner es exactamente el tic que `diseno-marca.md` prohíbe** por
nombre (ícono de librería, o el "glow"/animación de espera que ninguna otra pieza del
sitio usa). No hace falta inventar ninguno de los dos: `CINTA SONANDO` ya es cierto durante
todo el hueco, porque la cama está, de hecho, sonando.

### 5.2 Qué pasa si falla

Si la pieza elegida no baja (`ADR-07.6`: `error` en el elemento, o `ended` sin haber
sonado), la rocola prueba con la siguiente **sin que nada cambie en pantalla** — la cama
sigue sonando, la línea del tema sigue sin aparecer. Si fallan `FALLAS_SEGUIDAS` (3)
seguidas, `modoDeLaCinta()` vuelve a `'cama'` **sola**, y en ese momento el control
secundario `PONÉ UN TEMA` reaparece —es la misma condición de la sección 3.1, sin que la
isla tenga que enterarse de que hubo una falla: solo mira el modo actual—.

**No hay ningún aviso de error.** No porque se esconda un problema, sino porque no hay
nada roto que declarar: la cinta sigue haciendo exactamente lo que prometía antes de que
existiera la rocola —sonar como una cinta—, y `PONÉ UN TEMA` es, en sí mismo, la invitación
a reintentar sin que nadie tenga que leer la palabra "error". Es la misma lógica que ya usa
el resto del módulo para fallas de `localStorage` o de red: se traga y se sigue (`sitio/
cinta.ts:263-266`, `:648-650`).

---

## 6. Lo que no se toca

Confirmado, sin reabrir nada:

- **El nombre.** Sigue siendo "la cinta" (`UX-21 §0`). La rocola es lo que la cinta hace
  ahora en ciertas pantallas, no una pieza nueva con nombre propio.
- **La posición del interruptor.** Cabecera, misma esquina, mismo criterio de prioridad de
  renglón (`UX-21 §1`) — los elementos nuevos de esta hoja viven **debajo**, nunca compiten
  por ese renglón.
- **El apagado por defecto.** Ni la rocola ni sus controles nuevos se ofrecen, se sugieren
  ni se insinúan antes del primer gesto sobre el interruptor. `§5` de esta hoja no cambia
  eso: el hueco de arranque ocurre **después** de tocar, nunca antes.
- **Las tres pantallas graves.** Bulacio, Olavarría, la muerte del Indio: la cinta no se
  pinta ahí, y por lo tanto ninguno de los elementos de esta hoja tampoco.

---

## Las cadenas nuevas — texto exacto y las siete reglas, a mano

Adición a `CINTA` en `src/lib/sitio/copy.ts` (junto a las ocho cadenas que ya audita
`voz.test.ts`, mismo módulo, mismo mecanismo de auditoría):

```ts
export const CINTA = {
  apagada: 'CINTA APAGADA',
  sonando: 'CINTA SONANDO',
  callada: 'CINTA CALLADA',
  bloqueada: 'CINTA BLOQUEADA',
  porQueBloqueada: 'El navegador no la deja sonar acá',
  prender: 'Prendé la cinta',
  apagar: 'Apagá la cinta',

  // Nuevo — UX-26
  /** La línea que cuelga del interruptor cuando la rocola pone un tema. Nunca nombra el
   *  disco (§1.3): es la mitad del riesgo de soplar una respuesta que esta hoja no corre. */
  suena: (titulo: string, entero: boolean) => `${titulo} · ${entero ? 'completo' : 'recorte'}`,
  /** Sube la cinta de cama a rocola sin apagar nada (§3.1). Solo en ruta de rocola, con
   *  la cinta prendida y sin pieza sonando todavía. */
  ponerTema: 'PONÉ UN TEMA',
  /** Pasa a la próxima pieza (§3.1). Solo con una pieza sonando de verdad. */
  otroTema: 'PONÉ OTRO TEMA',
} as const;
```

Verificación a mano, cadena por cadena, contra las siete reglas de `src/lib/voz.test.ts §8`:

| Cadena | 1. sin anglicismo | 2. sin fórmula de folleto | 3. "la gente", no "fans"/"usuarios" | 4. sin infinitivo en primera palabra | 5. ≤ 8 palabras | 6. la que canta ≤ 8 (n/a, no es bajada) | 7. sin puntos suspensivos |
|---|---|---|---|---|---|---|---|
| `'PONÉ UN TEMA'` | ok | ok | ok | ok — "PONÉ" es imperativo, no está en el set de infinitivos (`voz.test.ts:165-174`) | ok, 3 palabras | n/a | ok |
| `'PONÉ OTRO TEMA'` | ok | ok | ok | ok, mismo motivo | ok, 3 palabras | n/a | ok |
| `suena('Ji Ji Ji', false)` → `"Ji Ji Ji · recorte"` | ok | ok | ok | ok — la función solo se audita contra anglicismo/folleto/"la gente" (`cadenasDeFunciones()`, `voz.test.ts:242-277`); a mano, "Ji" tampoco es infinitivo | ok | n/a | ok |
| `suena('...', true)` → `"... · completo"` | ok | ok | ok | ok | ok | n/a | ok |

Las cuatro pasan las siete reglas. El texto que compone `suena()` con un título real de la
banda no está bajo control de `experiencia` ni de `contenido` —es el nombre del tema, dato
del catálogo— y por eso `cadenasDeFunciones()` no lo audita palabra por palabra, mismo
criterio que ya rige para `PORTAL.creditoTapas` con nombres de disco.

---

## Lo que dejo para quien construye

- **Las tres cadenas nuevas van en `copy.ts`**, nunca escritas a mano en `src/scripts/
  cinta.ts` — mismo motivo que ya dejó anotado `UX-21 §3`: es la pieza que `voz.test.ts`
  puede auditar, y una cadena fuera de un `copy.ts` es una cadena que nadie audita.
- **`.cinta-tema` no lleva `aria-hidden`.** A diferencia del símbolo `▷/▶/❚❚` (que sí lo
  lleva porque la palabra de al lado ya dice lo mismo), el título de la pieza es
  información nueva que no está en ningún otro lado de la pantalla.
- **`.cinta-accion` es un `<button type="button">` sin `aria-pressed`** (no alterna entre
  dos estados; dispara una acción y listo). El texto visible alcanza como nombre
  accesible.
- **La visibilidad de `.cinta-accion` con texto `PONÉ UN TEMA` depende de la ruta**, no
  solo del modo: la isla necesita poder preguntar `modoEnRuta(location.pathname) ===
  'rocola'` (`rutas-sonoras.ts`, `ADR-07.9`) para no ofrecerlo en las ocho pantallas de
  juego y quiz, donde nunca va a sonar.
- **`--toque-min: 48px`** para `.cinta-accion`, igual que el resto de los controles
  tocables del sitio.

## Bloqueos que dejo anotados

- **Falta un aviso de cambio de pieza dentro de un mismo `sonando`.** `alCambiarLaCinta()`
  solo notifica transiciones de `EstadoCinta` (`cambiarEstado()` tiene una guarda
  `if (estado === nuevo) return`, `sitio/cinta.ts`), y cuando la rocola pasa sola de un
  tema al siguiente sin salir de `sonando`, ese cambio **no dispara ningún evento**. Sin
  algo que avise ese momento, la línea del `§1` se queda mostrando el título del tema
  anterior mientras ya suena el siguiente — un rótulo de registro 3 que dejó de decir la
  verdad. No lo resuelvo acá porque es una decisión de contrato de módulo, no de pantalla:
  queda pedido en `Docs/SUGERENCIAS/UX-para-arquitectura-cambio-de-pieza.md`.
- **El texto final palabra por palabra**, si `contenido` quiere afinar `ponerTema` u
  `otroTema` manteniendo las siete reglas — esta hoja entrega redacción completa, no un
  placeholder, así que no bloquea nada mientras tanto.

---

## Cómo se verifica

Nada de esta hoja es código (`D-12`); lo que sigue lo corre quien construya `T-217`/
`T-218` o `revisor`:

- **Las tres cadenas nuevas pasan `node --test src/lib/voz.test.ts`** una vez que vivan en
  `copy.ts` — en particular la regla de infinitivo (ninguna arranca con un verbo de la
  lista prohibida) y la de puntos suspensivos.
- **El riesgo del `§1.3`, a mano en un teléfono real:** prender la rocola en el portal,
  anotar el título que muestra, navegar a "Adiviná la tapa" y a "Adiviná el tema" varias
  veces seguidas — confirmar que en ningún momento aparece el nombre de un disco en la
  cinta, solo el título de un tema.
- **`§3`, los dos controles:** en una ruta de rocola, apagar y prender de nuevo con la
  preferencia guardada (simula el rearme de `ADR-07.8`) — tiene que aparecer `PONÉ UN
  TEMA`, nunca `PONÉ OTRO TEMA`, mientras el modo siga en cama. Tocarlo tiene que dejar
  sonando un tema y reemplazar el botón por `PONÉ OTRO TEMA` más la línea del `§1`.
- **`§4`, sin color:** con la pantalla en escala de grises forzada, la presencia o
  ausencia de la línea del tema y del botón secundario se sigue leyendo igual — ninguna de
  las dos depende de un tinte para existir.
- **`§5`, el hueco:** con la red simulada a "Slow 3G" (herramientas de desarrollo del
  navegador), prender la cinta en una ruta de rocola — tiene que sonar la cama con la púa
  encima sin que aparezca ningún texto de "cargando", y la línea del tema tiene que
  aparecer recién cuando se escucha la pieza de verdad, nunca antes.
- **`§5.2`, la falla:** con la red cortada del todo, prender la cinta en una ruta de
  rocola — tras el reintento la cinta cae a `cama` (`▶ CINTA SONANDO`, sin línea de
  tema) y `PONÉ UN TEMA` reaparece, sin ningún mensaje de error en pantalla.
- **`§6`, lo que no se toca:** repetir las pruebas manuales de `UX-21` (`§1`, `§4`, `§7`)
  tal como están escritas ahí — ninguna tiene que dar un resultado distinto al de antes de
  esta hoja.
