# CNT-16 — El pie corto: qué queda a la vista y a dónde se muda el crédito

- **Rol dueño:** `contenido`
- **Fecha:** 2026-09-11
- **Estado:** cierra `T-213` del ciclo 14 (`Docs/ORQ/ORQ-plan-ciclo-14.md` §2.3). Insumo
  directo de `T-220` (hilo principal, que cablea esto en `src/lib/sitio/copy.ts` y
  `src/components/PieImprenta.astro`, dependencia declarada en el plan).
- **Consume:** `Docs/ORQ/ORQ-plan-ciclo-14.md` §2.3 (el encargo), `src/lib/sitio/copy.ts`
  (bloque `PORTAL`: `pie`, `creditoTapas`), `src/components/PieImprenta.astro` entero (cómo
  arma el crédito hoy, el contrato `data-tapas`), `src/scripts/partida-tema.ts`
  (`creditoDePantalla`, el mecanismo que recalcula `.credito-tapas`/`.credito-pantalla` en
  tiempo real), `Docs/DECISIONES.md` `D-21` (condición 1: la pantalla nombra qué tapas
  usó), `D-14` (postura: mapa, no gate; si llega un reclamo, se baja), `D-17` (voseo,
  glosario), `D-35` (toda pantalla termina en pie de imprenta, el crédito vive ahí),
  `Docs/CONTENIDO/CNT-01-nota-derechos.md` (el mapa que esta pieza no puede vaciar),
  `Docs/CONTENIDO/CNT-02-guia-tono.md`, `Docs/CONTENIDO/CNT-14-las-palabras-de-la-imprenta.md`
  (precedente directo de método y de formato de tabla), `.claude/rules/voz-ricotera.md`
  entera (§3.8, §5, §8), `.claude/rules/codigo-juegos.md` ("JavaScript solo dentro de la
  isla de cada juego" — pesa en la decisión de §2), `src/lib/voz.test.ts` entero (las siete
  reglas auditadas a máquina).
- **Resuelve:** `T-213`.

## 0. El pedido, textual, y por qué no alcanza con acortar una frase

> *"achicar el mensaje de abajo dejando 'sitio hecho por ricoteros para ricoteros'"*

El pie de hoy (`PORTAL.pie`, 197 caracteres) hace tres trabajos: dice que es un sitio de
fans sin fines de lucro, acredita a Rocambole y a la banda, y transmite la postura de
`D-14` ("si algo molesta, se baja y listo"). Pero **el texto que de verdad infla la
franja no es ese**: es `PORTAL.creditoTapas(discos)`, la frase dinámica que antecede al
pie y que en el portal (`/`) lista hasta ocho discos — la suma de las dos cosas es lo que
dio los 379 caracteres y 227 px que midió `ORQ-plan-ciclo-14.md` §1. Achicar solo
`PORTAL.pie` deja resuelto un tercio del problema y nada del resto: el portal seguiría
imprimiendo una oración con seis o siete nombres de disco debajo de la frase corta.

Por eso esta pieza no es "una frase nueva": es **dónde vive cada uno de los tres trabajos
después del cambio**, con el crédito dinámico como pieza central — es la condición 1 de
`D-21` y el mapa de `CNT-01`, y no se puede vaciar.

## 1. El pie nuevo — texto exacto para `PORTAL.pie`

> **`Sitio hecho por ricoteros, para ricoteros.`**

**42 caracteres** (antes: 197 en el propio campo; 379 medidos en pantalla con el crédito
dinámico ya sumado). Decisiones de forma, una por una:

- **Mayúscula inicial y punto final**, igual que las tres oraciones que reemplaza — el
  pie nunca fue un rótulo de sello (mayúsculas, sin puntuación), siempre fue prosa corta,
  y cambiar de convención acá sería la única línea del sitio que rompe su propia
  costumbre tipográfica sin motivo.
- **Coma antes de "para ricoteros"**, que el pedido original no llevaba. La sumo porque
  marca la vuelta de la frase — quién lo hizo / para quién es — sin agregar ni una
  palabra ni un carácter de más que no se note (una coma). Es la misma cadencia de un
  epígrafe real de fanzine ("hecho a pulmón, para los que aguantan"), no una fórmula de
  marketing: no hay "by fans, for fans" en inglés en ningún lado, hay dos frases
  preposicionales en español separadas por una coma.
- **No agrego nada más.** El pedido dice "achicar... dejando" esa frase — es una
  instrucción de reemplazo, no de extensión. Todo lo que el pie de hoy dice y esta frase
  no dice (sin fines de lucro, el crédito a Rocambole y a la banda, la postura de `D-14`)
  se muda al §3, no se pierde: ver la tabla del §5.
- **Sobre `voz-ricotera.md` §3.8 ("la gente", no "los fans").** La regla marca
  explícitamente que el pie es la excepción: *"el pie puede seguir diciendo 'sitio de
  fans': ahí el sitio se nombra a sí mismo, no a la gente"*. Acá ni hace falta apoyarse en
  la excepción — la frase no usa "fans" ni "usuarios", usa **"ricoteros"**, la misma
  palabra con la que el propio pedido nombra a quienes hacen el sitio y a quienes lo
  juegan, en el mismo gesto. Queda resuelto por partida doble: aunque `voz.test.ts` no
  audite "ricoteros" (no está en su lista, con razón — no es la palabra que la regla
  vigila), la elección ya es la más alineada con la sección, no un caso límite que pasa
  de casualidad.
- **Registro:** 3 (nombra y se calla). El pie nunca fue un botón ni una línea que canta;
  sigue sin serlo. No lleva imperativo ni segunda persona porque no le pide nada a nadie
  — se presenta.

## 2. Dónde cae el crédito: un desplegable en el mismo pie, no una página aparte

El plan nombra dos opciones reales. Las repaso las dos, con lo que pesa cada una, y elijo.

### Opción A — página de créditos, enlazada desde el pie

**Descartada.** Dos problemas, no uno:

1. **Rompe la condición 1 de `D-21` en su letra exacta.** No pide una firma genérica:
   pide que **la pantalla nombre lo que usó**. `PORTAL.creditoTapas` no es un texto fijo
   — lo arma en el navegador `creditoDePantalla()` (`src/scripts/partida-tema.ts`),
   acumulando qué discos se imprimieron o vistieron el fondo **durante esa sesión de
   juego puntual** (`UX-22` §2.5). Una página aparte y estática no puede saber eso sin
   pasarle el estado por la URL o por `sessionStorage` — que es fabricar una superficie
   nueva de sincronización para resolver un problema que el pie de hoy ya resuelve solo,
   con el `data-tapas` que ya existe.
2. **Es una fricción que el propio proyecto vetó por nombre.** `CLAUDE.md`: *"Móvil
   primero, sesiones de dos o tres minutos... Todo lo que exija más está mal cortado."*
   Salir de la pantalla, cargar otra página y volver para leer un crédito es exactamente
   ese "más".

### Opción B — un desplegable en el mismo pie (elegida)

Un `<details>`/`<summary>` nativo, adentro de `PieImprenta.astro`, en el mismo lugar
donde hoy vive el párrafo. Cerrado por default, se abre con un toque.

**Por qué esta y no una tercera forma (un menú armado a mano con JS):**

- **No hace falta una línea de JavaScript para que abra y cierre.** `<details>` es HTML
  nativo — el navegador lo resuelve solo. `.claude/rules/codigo-juegos.md` es explícito:
  *"JavaScript solo dentro de la isla de cada juego — nada de hidratar toda la página."*
  El pie de imprenta vive en **todas** las páginas, incluidas las que no son un juego
  (Redondopedia, Letras y acordes, el portal): armar un desplegable con JS metería script
  fuera de una isla, en la única pieza que aparece en cada pantalla del sitio. Un
  `<details>` no tiene ese costo.
- **El mecanismo que ya recalcula el crédito no se toca.** `creditoDePantalla()` busca
  `.credito-tapas, .credito-pantalla` y le escribe el `textContent`. Ese `<span>` puede
  vivir adentro del `<details>` con la clase intacta: el JS lo sigue encontrando igual,
  esté abierto o cerrado el desplegable. Cero cambios de lógica, solo un padre distinto
  en el árbol.
- **Cierra el presupuesto de píxeles en todas las pantallas por igual**, no solo en las
  que acreditan un disco. El caso más pesado es el portal, con hasta ocho discos en la
  frase — exactamente el que más necesita no pagar su alto siempre. Un mismo componente
  se comporta igual en las diez rutas: no hay una versión "corta" para el juego y una
  "larga" para el portal, que sería la clase de rama especial que después nadie recuerda
  mantener.
- **Sigue siendo el mapa de `CNT-01`, no un gate.** Nada se borra, nada exige loguearse
  ni entender nada para abrirlo: es un toque, sin JS de por medio, disponible en cualquier
  pantalla — cero fricción para quien pregunta, cero peso para quien no.

**Una combinación que consideré y descarté:** dejar el crédito de tapas siempre visible y
mandar solo el texto general (Rocambole/banda/`D-14`) al desplegable. No resuelve el caso
que más importa — el portal, donde el texto largo *es* el de las tapas — y deja el mismo
componente comportándose distinto según la pantalla. Todo o nada, y elijo "adentro del
desplegable" para las dos partes.

## 3. El texto exacto de la pieza nueva

**Disparador, siempre visible (el `<summary>`):**

> **`Mirá los créditos`**

Registro 1 (es un control que se toca, como "Dala vuelta" o "Volvé a la tapa" en
`CNT-14` §2.3 — mismo criterio: acción voseada, sin punto final porque no es una
oración, es un rótulo de botón). Imperativo conjugado, no infinitivo: "Mirá" no es
"Mirar" — pasa la regla de `voz.test.ts` igual que "Dala" y "Volvé" ya la pasan. Sin
anglicismo (nada de "ver detalles", nada de "info"). 3 palabras.

**Cuerpo, visible solo al abrir (adentro del `<details>`):**

Primero, sin cambios de lógica, la frase dinámica que ya existe:

> `PORTAL.creditoTapas(acreditados)` — la misma función de hoy, mismo texto que arma
> ("En esta pantalla, arte de la tapa de Gulp!, en baja resolución." / "...de las tapas
> de X, Y y Z..."). No se toca una palabra: solo cambia el padre en el HTML.

Después, el texto general — todo lo que el pie de hoy decía y la frase corta de arriba ya
no dice:

> **`Sin fines de lucro: el arte de las tapas es de Rocambole (Ricardo Cohen); la
> música, de Patricio Rey y sus Redonditos de Ricota. Si algo molesta a quien
> corresponde, se baja y listo.`**

Es el pie de hoy, palabra por palabra, con un solo recorte: la apertura "Sitio de fans, "
sale porque ese trabajo ya lo hace la frase corta de afuera (§1), y "sin fines de lucro"
pasa de cierre de esa oración a apertura de esta, con dos puntos en vez de punto para que
la frase no arranque coja. Nada del contenido legal ni del crédito a Rocambole y a la
banda cambia una letra.

## 4. Nombres de campo sugeridos (para quien cablee, `T-220`)

Igual que en `CNT-14`: sugerencia, no mandato — el nombre final es de quien cablea.

| Campo sugerido | Valor | Reemplaza / es nuevo |
|---|---|---|
| `PORTAL.pie` | `Sitio hecho por ricoteros, para ricoteros.` | **Modifica** (antes: los 197 caracteres de hoy) |
| `PORTAL.creditosRotulo` | `Mirá los créditos` | **Nuevo** — texto del `<summary>` |
| `PORTAL.creditosCuerpo` | `Sin fines de lucro: el arte de las tapas es de Rocambole (Ricardo Cohen); la música, de Patricio Rey y sus Redonditos de Ricota. Si algo molesta a quien corresponde, se baja y listo.` | **Nuevo** — texto general adentro del `<details>` |
| `PORTAL.creditoTapas` | sin cambios | **Queda igual** — misma función, mismo `<span class="credito-pantalla" data-tapas=...>`, ahora anidado adentro del `<details>` en vez de directo en `<p class="pie-sitio">` |

## 5. Qué no se pierde — mapa completo de dónde queda cada cosa

| Trabajo que hacía el pie de hoy | Dónde queda después |
|---|---|
| "Sitio de fans" (se presenta como fan site) | En la frase corta, con otra palabra: "hecho por ricoteros" (§1) |
| "sin fines de lucro" | Textual, adentro del desplegable, en `PORTAL.creditosCuerpo` (§3) |
| Crédito a Rocambole (Ricardo Cohen) y a la banda | Textual, sin cambios, adentro de `PORTAL.creditosCuerpo` |
| Postura de `D-14` ("si algo molesta, se baja y listo") | Textual, sin cambios, adentro de `PORTAL.creditosCuerpo` |
| `PORTAL.creditoTapas` — qué tapas usó **esta pantalla** (`D-21` cond. 1) | Misma función, mismo mecanismo de `creditoDePantalla()`, mismo `data-tapas`; se muda de posición en el HTML (adentro del `<details>`), no de comportamiento |

**Nada se pierde a propósito.** Lo único que cambia de verdad es que tres de las cuatro
piezas dejan de estar siempre a la vista y pasan a estar a un toque — que es exactamente
lo que le pide `ORQ-plan-ciclo-14.md` a esta tarea: mudar el crédito, no borrarlo.

## 6. Verificación a mano contra las siete reglas de `src/lib/voz.test.ts` §8

Las tres cadenas nuevas/modificadas, una por una:

**`Sitio hecho por ricoteros, para ricoteros.`**
1. Anglicismo (glosario `D-17`): ninguno. ✓
2. Fórmula de folleto: ninguna. ✓
3. Botón/enlace en infinitivo: primera palabra "Sitio", no es verbo. ✓
4. Título de más de 8 palabras: 6 palabras (no está en la lista auditada de títulos, pero
   igual cumple). ✓
5. Primera frase de una bajada de casete > 8 palabras: no aplica, no es una bajada de
   casete. ✓
6. "los fans"/"los usuarios" en vez de "la gente": no aparece ninguna — usa "ricoteros". ✓
7. Puntos suspensivos en botón o rótulo: no lleva. ✓

**`Mirá los créditos`**
1. Anglicismo: ninguno ("créditos" no está en el glosario vetado). ✓
2. Fórmula de folleto: ninguna. ✓
3. Infinitivo: primera palabra "Mirá" (imperativo conjugado) — no es "Mirar", no está en
   el set `INFINITIVOS`. ✓
4. Largo: 3 palabras. ✓
5. No aplica (no es bajada de casete). ✓
6. No nombra a nadie. ✓
7. Sin puntos suspensivos. ✓

**`Sin fines de lucro: el arte de las tapas es de Rocambole (Ricardo Cohen); la música, de Patricio Rey y sus Redonditos de Ricota. Si algo molesta a quien corresponde, se baja y listo.`**
1. Anglicismo: ninguno — ojo con el falso positivo: "listo" no matchea `\blist\b` porque
   el límite de palabra exige la palabra exacta "list", no "listo". ✓
2. Fórmula de folleto: ninguna. ✓
3. Infinitivo: primera palabra "Sin", no es verbo. ✓
4. No está en la lista auditada de títulos (no aplica). ✓
5. No es bajada de casete (no aplica). ✓
6. No dice "los fans" ni "los usuarios". ✓
7. Sin puntos suspensivos. ✓

Las siete reglas, sobre las tres cadenas: **verde a mano.**

## 7. Cómo se corre después de cablear

No tengo con qué correrlo (`D-12`). Cuando `T-220` cargue las tres cadenas en
`src/lib/sitio/copy.ts` bajo `PORTAL`, el comando es:

```
node --test src/lib/voz.test.ts
```

`cadenas()` ya barre el módulo `sitio` entero, así que las tres cadenas nuevas entran
solas al recorrido de `VISIBLE` sin tocar el test. Lo único que exige atención manual de
quien cablee: si el `<summary>` necesita un `aria-label` además del texto visible,
tiene que salir de `copy.ts` igual que el texto visible — nunca escrito a mano en un
script de isla (`voz.test.ts`, test *"ninguna isla escribe a mano un placeholder ni un
aria-label"*). Mi lectura es que no hace falta: `<details>`/`<summary>` es un widget
nativo con semántica de expandido/colapsado que el lector de pantalla anuncia solo, sin
necesitar una etiqueta aparte — pero dejo la duda escrita para que `T-220` la resuelva
con el navegador real, no con mi lectura de la spec.

## Bloqueos

Ninguno. No hace falta ficha `RES-XX`: esto es una decisión de tono y de dónde vive un
componente, no un hecho verificable sobre la banda.

## Siguiente

`hilo principal` (`T-220`) necesita esto para cablear `PORTAL.pie`,
`PORTAL.creditosRotulo` y `PORTAL.creditosCuerpo` en `src/lib/sitio/copy.ts`, envolver el
crédito existente en un `<details>` en `src/components/PieImprenta.astro` sin tocar la
lógica de `creditoDePantalla()`, y darle estilo al disparador en `src/styles/sitio.css`
(sello de goma o el tratamiento que corresponda por `diseno-marca.md` — no hay un tic
vetado que el `<details>` nativo dispare, pero la forma final del triángulo/flecha del
navegador es una decisión visual, no de tono, y queda para quien construya).
