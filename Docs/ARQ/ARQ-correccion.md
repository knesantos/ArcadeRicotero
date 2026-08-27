# ARQ — El contrato de una corrección

> Rol dueño: `arquitectura`. Consume: `BR-21` (`Docs/PRODUCTO/PRD-correcciones.md`), `D-25`
> (`US-03` sale con fuente única y se corrige jugando), `D-14` (molinetes abiertos, el
> rótulo dice la verdad), `D-02` (sin backend), `D-12` (la verificación se rutea),
> `ADR-02` v2 (`Docs/ARQ/ARQ-link-resultado-compartido.md`), `CTR-02`, `CTR-03`, `CTR-04`
> v2, `CTR-05`, `CTR-09`, `Docs/ORQ/ORQ-plan-ciclo-9.md` (frente D), `IDEA-13`.
> Produce: **`CTR-10` v1**.
> Última actualización: 2026-08-27 (`T-150`, ciclo 9).

- **Estado:** **aceptada**, con **un número marcado como supuesto** — el tope real del
  `mailto:` (apartado 5). No bloquea: ese número vive en una sola constante y su error se
  paga con una degradación silenciosa, no con una pantalla rota. La ficha está pedida.
- **Implementa:** `T-153` y `T-154` (hilo principal). Este documento no trae código de
  producción: trae tipos, nombres, topes y la batería de pruebas.
- **No re-decide:** qué es una corrección, qué promete el sitio y qué se le pide a la
  persona. Eso es `BR-21` y se toma entero. El texto visible es `CNT-12`; dónde vive el
  botón en cada pantalla es `UX-09`.

---

## 1. El principio del que sale todo lo demás

**Una corrección es un mensaje sobre el sitio, no sobre quien lo manda.**

De ahí salen las cuatro reglas duras de este contrato, y conviene leerlas antes que los
campos:

1. **El payload se arma de dos fuentes y de ninguna más:** el ítem tal como está en
   `src/data/*.json`, y el texto que la persona escribió. Nada del navegador, nada del
   reloj, nada del almacenamiento local, nada de la barra de direcciones.
2. **Lo que no está en el tipo no viaja.** El renderizador es una lista blanca de campos,
   no un serializador genérico. Un campo de más agregado por descuido en el sitio de
   llamada **no llega al mensaje**: se cae solo.
3. **El objeto y el texto son dos cosas.** El objeto (`Correccion`) es lo que arma el
   componente y lo que un día va a mandar Supabase. El texto plano es lo que leen los ojos
   de una persona. Los dos transportes de hoy mandan **el mismo texto**.
4. **Lo único que se recorta es lo que se puede volver a buscar en el repo.** Lo que solo
   existe en el mensaje —lo que escribió la persona— no se toca nunca. Apartado 5.

---

## 2. El payload

```ts
export type JuegoCorregible =
  | 'quiz'          // US-01
  | 'tema'          // US-02
  | 'letra'         // US-03
  | 'tapa'          // US-04
  | 'por-la-letra'  // US-07
  | 'redondopedia'; // US-05

export type Rotulo = 'hecho' | 'leyenda' | 'testimonio';

export type Correccion = {
  readonly contrato: 'CTR-10';
  readonly v: 1;
  readonly juego: JuegoCorregible;
  readonly itemId: string;
  readonly ubicacion?: string;
  readonly dice: string;
  readonly rotulo?: Rotulo;
  readonly deberiaDecir: string;
  readonly fuente?: {
    readonly sitio?: string;
    readonly url?: string;
    readonly fichas?: readonly string[];
  };
  readonly banco: {
    readonly contrato: string;
    readonly version: number;
    readonly actualizado?: string;
  };
};
```

| Campo | Qué es | De dónde sale | Validación |
|---|---|---|---|
| `contrato`, `v` | qué formato es esto | constante | literales, no configurables |
| `juego` | cuál de los seis | la isla que monta el botón | enum cerrado |
| `itemId` | el ítem en su banco | `id` (`QZ-007`, `CL-014`, `TP-003`) o `slug` (`por-la-letra`, `tema`, `redondopedia`) | `^[A-Za-z0-9-]{1,60}$`, no vacío |
| `ubicacion` | dónde adentro del ítem | el adaptador | ≤ 40 caracteres. `el hueco`, `la respuesta correcta`, `la explicación`, `párrafo 3`, `dato 2` |
| `dice` | **qué dice el sitio hoy**, textual | el banco, nunca el DOM | no vacío. Es el ancla durable cuando el índice se mueve |
| `rotulo` | con qué casilla lo marca el sitio | el ítem, si la tiene | enum de `D-14` |
| `deberiaDecir` | **lo único que escribe la persona** | el campo de texto | no vacío. **Sin tope de largo** (ver 5) |
| `fuente` | de dónde salió el dato **según el sitio** | `fuenteLetra` (`CTR-04`), `fuente` (`CTR-09`), `fuentes` (`CTR-02`, `CTR-05`), `fuente` del párrafo (Redondopedia) | al menos una de las tres claves si el objeto existe |
| `banco` | contra qué versión del banco se escribió | encabezado del JSON | ver 2.2 |

### 2.1 Qué pone cada juego en `itemId`, `dice` y `rotulo`

Un adaptador por banco, todos con la misma firma: `(item, deberiaDecir) => Correccion`.
Son los únicos que conocen la forma de un banco; el resto del módulo no.

| Juego | `itemId` | `dice` | `rotulo` | `fuente` |
|---|---|---|---|---|
| `quiz` | `id` (`QZ-007`) | enunciado + ` → ` + el texto de la opción marcada correcta | `esLeyenda ? 'leyenda' : 'hecho'` | `fichas: fuentes` |
| `letra` | `id` (`CL-014`) | `hueco.antes` + `[` + `hueco.respuesta` + `]` + `hueco.despues` | — | `sitio` + `url` de `fuenteLetra[0]`, `fichas` con las fichas de todas |
| `por-la-letra` | `slug` | los versos mostrados + ` → ` + `titulo` | — | `sitio` + `url` de `fuente` |
| `tapa` | `id` (`TP-003`) | la opción correcta + ` (` + `imagen.edicion` + `)` | — | `fichas: fuentes` |
| `tema` | `slug` | `titulo` del fragmento | — | — |
| `redondopedia` | `slug` del artículo | el texto del párrafo o el `valor` del dato | el `rotulo` del párrafo o del dato | `fichas` con lo que diga `fuente` |

**Por qué `rotulo` es un campo y no un detalle.** `BR-21` apartado 1 pone tres categorías,
y la tercera es *rótulo mal puesto*. Si el mensaje no dice con qué casilla está marcado hoy
el ítem, esa categoría entera llega incompleta: quien lee no puede saber qué se le está
discutiendo. Es el campo que un diseño hecho solo para las letras se olvida, y por eso está
puesto desde el día uno — el botón se expande a todo el sitio, no solo a `US-03`.

**La Redondopedia no tiene id por párrafo** (`redondopedia.json` es un array `cuerpo` sin
identificadores). Por eso ahí `ubicacion` lleva el índice (`párrafo 3`, base 1) y `dice`
lleva el texto: **el índice se mueve cuando alguien edita el artículo, el texto no**. Es la
razón concreta por la que `dice` se recorta a prefijo y nunca se borra (5.2). *Deuda mía,
anotada acá para que no se pierda:* `redondopedia.json` es el único banco sin encabezado de
contrato ni `actualizado`; cuando tenga su `CTR-XX`, este contrato deja de tener el caso
especial de 2.2.

### 2.2 `banco`: el reemplazo honesto de la fecha

**El payload no lleva la hora, y sin embargo hay que poder ordenar y descartar
correcciones.** Lo que resuelve eso no es cuándo se mandó, sino **contra qué versión del
banco se escribió**: si el ítem ya cambió, la corrección puede estar saldada sin que nadie
haga nada.

Sale del encabezado del propio JSON, que ya existe en cinco de los seis bancos:

| Banco | `contrato` | `version` | `actualizado` |
|---|---|---|---|
| `quiz.json` | `CTR-02` | 1 | `2026-08-24` |
| `adivinar-tema.json` | `CTR-03` | 2 | `2026-08-27` |
| `letra.json` | `CTR-04` | 2 | `2026-08-27` |
| `tapa.json` | `CTR-05` | 1 | `2026-08-21` |
| `por-la-letra.json` | `CTR-09` | 1 | `2026-08-27` |
| `redondopedia.json` | — | — | ausente: se manda `{ contrato: 'sin-contrato', version: 0 }` |

Es un dato **sobre el sitio**, no sobre la persona: la misma corrección mandada hoy y
dentro de un mes lleva exactamente los mismos caracteres. Una marca de tiempo, en cambio,
es la clase de dato que permite correlacionar dos mensajes entre sí o con un registro de
acceso, y no compra nada que esto no compre mejor.

---

## 3. Que no viaje nada de la persona, y que no sea cuestión de acordarse

`BR-21` apartado 3 dice que no se le pide nada. Este contrato hace que **no se pueda mandar
nada que no se pidió**, con cuatro mecanismos y una prueba que los corre:

1. **No hay campo de contacto.** `BR-21` lo permite y deja el "si existe o no" acá: **no
   existe**. Un campo que el 90% deja vacío es un campo que, cuando se llena, viaja sin que
   nadie lo haya pensado — y ya está escrito que no hay compromiso de contestar. Quien
   quiera dejar su contacto lo escribe adentro de `deberiaDecir`, que es un acto explícito
   suyo, en un campo que ya existe, y no una casilla que el sitio le ofreció.
2. **El módulo que arma el payload no puede tocar el navegador.** `src/lib/correccion/armar.ts`
   no importa nada y no menciona `navigator`, `Date`, `localStorage`, `sessionStorage`,
   `screen`, `document`, `location` ni `crypto`. Lo audita una prueba que lee el fuente,
   igual que hacen `estilos.test.ts` y `voz.test.ts`.
3. **El renderizador es una lista blanca.** Recorre los once campos del tipo en orden fijo.
   No hay `Object.entries`, no hay `JSON.stringify` del objeto entero. Un campo de más no
   se imprime.
4. **La URL de la página no se copia nunca.** Y no es una precaución teórica: `ADR-02` v2
   pone `?n=<nombre>` en los links de desafío, así que `location.href` puede traer **el
   nombre de un tercero** que no tiene nada que ver con la corrección. La ubicación del
   ítem se reconstruye desde `juego` e `itemId`, que son datos del banco.

**Lo que sí revela el transporte de mail, y hay que decirlo en vez de taparlo.** Cuando se
abre el cliente de correo, el mensaje sale **desde la casilla de esa persona**: eso lo pone
el cliente, no el sitio. El sitio no lo lee, no lo guarda y no lo agrega al payload, y la
persona lo ve en su propia pantalla antes de tocar enviar. El portapapeles no revela nada.
**Consecuencia para `CNT-12`:** si el texto del botón de mail no dice que se abre el correo
de uno, la persona se entera después — y eso es un rótulo que no dice la verdad sobre lo
que hay adentro (`D-14`). No escribo yo esa frase; dejo escrito que hace falta.

---

## 4. Los dos transportes, detrás de una interfaz

```ts
export type Via = 'mail' | 'portapapeles' | 'a-la-vista';

export type Entrega = {
  readonly via: Via;
  readonly resultado: 'copiado' | 'abierto' | 'a-la-vista' | 'no-pudo';
  readonly texto: string;      // el mensaje renderizado, siempre
  readonly recortado: boolean; // si hubo que recortar para que entrara
};

export type Transporte = {
  readonly via: Via;
  disponible(): boolean;                       // barato, sincrónico, sin efectos
  entregar(c: Correccion): Promise<Entrega>;
};

export const ORDEN: readonly Transporte[];     // [mail, portapapeles, aLaVista]
export function disponibles(): readonly Via[];
export function enviar(c: Correccion, preferida?: Via): Promise<Entrega>;
```

**El componente nunca nombra un transporte.** Pide `disponibles()` para saber cuántas
salidas ofrecer, y llama a `enviar()`. La etiqueta visible de cada salida la da `CNT-12`
indexada por `via` — `via` es una clave, no texto de pantalla.

**Los cuatro `resultado` no son decoración: son exactamente lo que el sitio puede
afirmar** sin romper `BR-21` apartado 2, que sólo deja confirmar el hecho mecánico.

| `resultado` | Qué pasó de verdad | Qué puede decir el sitio |
|---|---|---|
| `copiado` | `navigator.clipboard.writeText` resolvió | que quedó copiado |
| `abierto` | el sitio le pidió al sistema que abra el correo | **que se abrió el correo con el texto puesto** — nunca que se mandó |
| `a-la-vista` | el texto está renderizado en la pantalla | que está ahí para copiar a mano |
| `no-pudo` | ese transporte no pudo; `enviar()` sigue con el siguiente | nada: la persona no se entera de un intento fallido intermedio |

**`abierto` no es `enviado`, y la diferencia es técnica, no de redacción:** un `mailto:` no
devuelve nada. El navegador no informa si había cliente de correo, si se abrió, si la
persona escribió algo más o si lo canceló. **No existe forma de detectarlo**, y por eso el
mail nunca es el único camino ni un camino automático (apartado 6).

### 4.1 Cómo se elige

1. Si viene `preferida` y ese transporte está `disponible()`, se usa.
2. Si no viene, se toma el primero disponible de `ORDEN`.
3. Si `entregar()` devuelve `no-pudo`, se sigue con el siguiente de `ORDEN`.
4. **La cadena siempre termina en `aLaVista`, que no puede fallar** porque no hace nada más
   que devolver el texto que ya está renderizado. `disponible()` de `aLaVista` devuelve
   `true` siempre, y esa constante es la que hace cumplir `D-14` en este frente.

### 4.2 El día de Supabase

`IDEA-13` prevé que esto termine en una base. Ese día: se agrega un `transporteSupabase`
adelante en `ORDEN`, con `disponible()` atado a que exista la configuración del proyecto, y
`entregar()` mandando **el objeto**, no el texto — por eso el objeto y el texto son dos
cosas desde hoy. **No se toca el componente, ni el payload, ni las islas.**

Aviso para ese día, que es de `producto` y no mío: `Entrega` **no tiene** estado de
revisión, y agregarlo no es un cambio de transporte — es reabrir `BR-21` apartado 2, que
hoy prohíbe prometer lo que no se puede verificar.

**Prueba de que la interfaz sirve:** `navigator.share` entraría como cuarto transporte sin
tocar nada más. No entra hoy porque comparte hacia donde quiera la persona, no hacia la
casilla del proyecto, y en ese caso duplica al portapapeles con una dependencia más.

---

## 5. El tope del `mailto:` y la regla de recorte

### 5.1 El número

```
LARGO_MAX_URL = 1800   // caracteres de la URL mailto: YA codificada
DICE_MIN      = 60     // prefijo mínimo de `dice` que se conserva
```

**Se mide la URL codificada, no el texto.** Es la trampa de este apartado: un salto de
línea pasa a `%0A` (tres caracteres) y una vocal con tilde en UTF-8 pasa a `%C3%A1` (seis).
Un mensaje de 450 caracteres de texto castellano con seis saltos de línea ronda los 700
codificados. **El presupuesto útil de texto plano es de unos 1.000 caracteres**, no 1.800.

**Supuesto, y está marcado como tal:** el piso práctico de largo de URL en clientes de
correo y navegadores anda por los 2.000 caracteres. **No lo verifiqué y no tengo con qué
hacerlo** (no tengo `WebSearch`): queda pedida una ficha `RES-53` a `investigador` con el
tope real por cliente. **No bloquea este contrato**, y el motivo es de diseño, no de
apuro: el número es una constante en un solo archivo, el peor caso si está alto es que un
cliente corte el cuerpo —y el texto completo siguió estando a la vista y en el
portapapeles—, y el peor caso si está bajo es que se recorte antes de lo necesario. Ningún
valor de esa ficha cambia la forma del payload ni la interfaz.

### 5.2 Qué se recorta, en este orden

**El criterio, en una línea: se recorta lo que se puede volver a buscar en el repo con
`itemId`. Nunca lo que solo existe en el mensaje.**

1. **`fuente.url`** — se cae, queda `fuente.sitio`. La URL está en el banco, al lado del
   ítem.
2. **`fuente.fichas`** — se caen. Son `RES-XX`: están en `Docs/INVESTIGACION/`.
3. **`dice`** — se **acorta a prefijo**, con marca de recorte. Nunca se borra: con menos de
   `DICE_MIN` caracteres deja de servir para encontrar un párrafo de la Redondopedia, que
   es el único ítem del sitio sin identificador propio (2.1).
4. **`deberiaDecir` no se recorta jamás.** Si después de los tres pasos anteriores todavía
   no entra, el transporte de mail devuelve `no-pudo` y `enviar()` pasa al portapapeles,
   que no tiene tope. **Media corrección es peor que ninguna**: se puede leer al revés y
   aplicar mal, y aplicar mal un dato es exactamente el daño que este proyecto declara como
   lo único estricto.

**Cuando hubo recorte, el mensaje lo dice.** Se agrega `[recortado por largo — CTR-10]` al
final, en registro 3, y `Entrega.recortado` queda en `true`. Un mensaje incompleto que no
avisa que está incompleto es un rótulo que miente.

**`itemId`, `juego`, `banco` y `rotulo` no se recortan nunca.** Suman menos de 90
caracteres entre los cuatro y son lo que hace que el mensaje se pueda accionar sin volver a
preguntar.

### 5.3 El texto que viaja

Mismo texto por las tres vías. Las etiquetas de abajo son **las de referencia**: si
`CNT-12` las reescribe, cambia el rótulo — **nunca el orden ni los campos**, que son de
este contrato. Registro 3 (`voz-ricotera.md`): seco, sin imagen, sin suspensivos.

```
Asunto: Corrección — letra — CL-014

Corrección
Juego: completar la letra
Ítem: CL-014
Dónde: el hueco
Dice: Y el sol te desnuda y hace tanto [calor]
Rótulo: hecho
Debería decir: en el disco no es "hace tanto calor", es "hay tanto calor"
Fuente que declara el sitio: cifraclub.com — https://www.cifraclub.com/...
Banco: CTR-04 v2, actualizado 2026-08-27
CTR-10 v1
```

Las líneas de campos vacíos no se imprimen. `Rótulo` sólo aparece si el ítem lo tiene.

---

## 6. Sin casilla, sin portapapeles, sin nada: la salida que siempre existe

**Hoy el repo no tiene casilla de correo**, y poner el mail personal del usuario en un
`mailto:` de un sitio público es entregárselo a los raspadores. Este contrato está diseñado
para que eso **no frene nada**:

```ts
// src/lib/correccion/destino.ts — el único lugar del repo donde vive la dirección
export const CASILLA: string | null = null;
```

- `transporteMail.disponible()` es `CASILLA !== null`. **Con `null`, el mail no existe:**
  `disponibles()` devuelve `['portapapeles', 'a-la-vista']`, el componente muestra una
  salida menos y **no se genera ningún `mailto:`**. No hay botón muerto, no hay dirección de
  relleno, no hay error.
- El día que exista la casilla: **se cambia esa línea y nada más**. Una prueba comprueba el
  formato si el valor no es `null`.
- **La dirección tiene que ser descartable y dedicada al sitio, no la personal.** No ofrezco
  ofuscarla: cualquier dirección que el sitio pueda usar, un raspador la puede leer del
  mismo paquete de JavaScript. Ofuscar sería teatro, por el mismo motivo por el que
  `ADR-02` descartó firmar el puntaje con una clave que viaja en el cliente. Lo que sí
  funciona es que el día que se llene de spam se dé de baja y se cambie una línea. **Cuál
  es esa dirección lo decide el usuario (`T-153`), y este contrato no lo espera.**

**Y si tampoco hay portapapeles.** `navigator.clipboard.writeText` no existe fuera de
contexto seguro y puede rechazar por permisos o por falta de gesto. En los dos casos el
transporte devuelve `no-pudo` y **queda `aLaVista`, que es el piso y no puede fallar**: el
texto ya renderizado, en la pantalla, seleccionable, para copiar a mano o para sacarle una
captura. No hay combinación de fallas que deje a alguien sin poder avisar algo. Eso no es
un caso borde amable: es `D-14` — el molinete no se puede cerrar, tampoco el de salida.

---

## 7. Módulos, y qué le toca a `T-153`

| Archivo | Qué | Regla |
|---|---|---|
| `src/lib/correccion/tipos.ts` | `Correccion`, `JuegoCorregible`, `Rotulo`, `Via`, `Entrega`, `Transporte` | sin lógica |
| `src/lib/correccion/armar.ts` | los seis adaptadores de 2.1 | **prohibido tocar el navegador** (3.2) |
| `src/lib/correccion/texto.ts` | `renderizar(c)`, `recortarPara(c, presupuesto)` | lista blanca de campos (3.3) |
| `src/lib/correccion/destino.ts` | `CASILLA` | una constante y un comentario |
| `src/lib/correccion/transportes.ts` | `mail`, `portapapeles`, `aLaVista`, `ORDEN`, `disponibles`, `enviar` | el único que toca el navegador |
| `src/components/Correccion.astro` | el panel | no nombra transportes; texto de `CNT-12`, forma de `UX-09` |

`enviar()` tira `RangeError` ante un payload imposible —`deberiaDecir` vacío, `itemId` que
no valida, `juego` fuera del enum—, igual que `armarLink` en `ADR-02`. Un mensaje inválido
no se genera: rompe el test o el build, nunca la pantalla de la gente.

---

## 8. Verificación — para que la corra el hilo principal (`D-12`)

```bash
node --test src/lib/correccion/*.test.ts
npm test
npm run check
npm run build
```

`npm test` ya barre `src/**/*.test.ts`, así que los archivos nuevos entran solos.

**La batería, con los nombres de las pruebas:**

1. `un caso real de letra viaja entero` — se toma `CL-001` de `src/data/letra.json` tal como
   está, se arma la corrección y el texto renderizado contiene `CL-001`, el verso con el
   hueco, `cifraclub.com`, la URL de `fuenteLetra` y lo que escribió la persona.
2. `un párrafo real de la Redondopedia viaja con su rótulo` — `gulp`, párrafo 2, el de las
   tres fechas: el texto lleva `párrafo 2`, un prefijo del párrafo y `Rótulo: hecho`.
3. `el mailto de un caso real entra en el presupuesto` — la URL codificada de los casos 1 y
   2 mide menos de 1800, y `recortado` es `false`.
4. `un párrafo largo con una corrección larga recorta en el orden de 5.2` — cae la URL de
   fuente, cae la ficha, `dice` queda en prefijo de al menos 60, aparece la marca de
   recorte, y **`deberiaDecir` está entero, carácter por carácter**.
5. `si no entra ni recortando, el mail se corre y no miente` — `deberiaDecir` de 4.000
   caracteres: el transporte de mail devuelve `no-pudo` y `enviar()` termina en
   `portapapeles` con el texto completo.
6. `el payload no lleva nada de la persona` — con un ítem envenenado y globales falsos, el
   texto renderizado no contiene la hora, ni un identificador, ni nada de `location`; y un
   objeto con campos de más renderiza exactamente igual que sin ellos.
7. `armar.ts no toca el navegador` — se lee el fuente y no aparece ninguno de los siete
   identificadores prohibidos de 3.2.
8. `sin casilla no hay mail` — con `CASILLA = null`, `disponibles()` no incluye `mail` y
   `enviar()` no genera ninguna cadena que empiece con `mailto:`.
9. `la cadena siempre termina en algo` — con el portapapeles rechazando y sin casilla,
   `enviar()` devuelve `a-la-vista` con el texto completo.
10. `los seis juegos arman` — un ítem real de cada banco produce una `Correccion` válida.

**Y una comprobación a mano, que ninguna prueba cubre** y que el plan pide como criterio
(*"un caso real viaja entero por mail y por portapapeles"*): abrir el juego en un celular,
tocar el botón, y confirmar que el cuerpo llega **completo** al cliente de correo, con los
acentos bien y sin cortarse. Es lo único que mide de verdad el tope del apartado 5, y hasta
que exista la casilla se hace contra una dirección de prueba.

---

## 9. Alternativas descartadas

- **Un campo de contacto en el panel.** Descartada. `BR-21` lo permite y me deja la
  decisión: no existe. Un campo optativo es una invitación a mandar un dato que después
  nadie va a usar —no hay compromiso de contestar— y convierte la regla "no lleva nada de la
  persona" en "no lleva nada, salvo cuando sí". Quien quiera dejar su contacto lo escribe en
  el texto libre, que es un acto suyo.
- **Marca de tiempo en el payload.** Descartada por 2.2: `banco.actualizado` da lo mismo que
  se buscaba —saber si la corrección sigue vigente— sin un dato que permita correlacionar
  dos mensajes o cruzarlos con un registro de acceso. El mail, además, ya lleva su fecha
  puesta por el correo, no por el sitio.
- **Un identificador de corrección (`crypto.randomUUID`).** Descartada: un id sólo sirve si
  hay dónde guardarlo, y sin backend no lo hay (`D-02`). Y si se persistiera para reusarlo,
  sería un identificador de aparato — exactamente lo que este contrato prohíbe.
- **Mandar `location.href` para ubicar el ítem.** Descartada, y no por precaución teórica:
  `ADR-02` v2 pone `?n=<nombre>` en los links de desafío, así que esa URL puede llevar el
  nombre de un tercero.
- **Formulario a un servicio de terceros** (Formspree, Google Forms, Netlify Forms).
  Descartada: mete una dependencia de red y un tercero que el proyecto no tiene en ningún
  otro lado, le entrega a ese tercero quién corrige qué, y algunos piden cuenta para ver o
  hasta para responder — un molinete importado (`D-14`). Y contradice `D-02`.
- **Issue de GitHub prellenado.** Ya descartada por el usuario en el plan del ciclo 9
  (`T-148` cancelada) y queda anotado por qué no vuelve: exige cuenta de GitHub, y con el
  repo privado quien no es colaborador ni siquiera ve un login, ve un 404.
- **JSON crudo en el cuerpo del mail.** Descartada: lo lee una persona, y el texto plano
  rotulado se lee sin herramienta. El objeto queda para el transporte que lo necesite
  (Supabase, 4.2), que es justamente por qué son dos representaciones y no una.
- **base64 o compresión para meter más adentro del `mailto:`.** Descartada por lo mismo que
  `ADR-02` v1 descartó el payload opaco: agrega un decodificador y un modo de falla nuevo, y
  lo vuelve ilegible para quien lo recibe. Además el problema real no es el tamaño: es que
  media corrección no sirve.
- **Ofuscar la dirección** (entidades HTML, partirla en el JavaScript). Descartada por 6:
  cualquier dirección que el sitio use está en el paquete que el raspador baja. Lo que
  funciona es que sea descartable.
- **Un tope de largo al campo donde escribe la persona.** Descartada: el tope es del
  transporte, no de la persona. Cortarle el texto al que se tomó el trabajo de explicar algo
  es un molinete, y el portapapeles no tiene tope.
- **Intentar `mailto:` primero y detectar si falló para caer al portapapeles.** Descartada
  porque **no se puede detectar** (4). Un temporizador que adivine si el cliente se abrió es
  la clase de heurística que falla justo en el celular de gama baja que es el caso de uso
  declarado.

---

## 10. Consecuencias

- **Fácil: sumar un juego.** Un valor en el enum y un adaptador de seis líneas. Los cinco
  juegos y la Redondopedia ya están cubiertos, así que el orden de despliegue de `BR-21`
  apartado 4 no vuelve a tocar este contrato.
- **Fácil: cambiar de transporte.** Es agregar un objeto a `ORDEN`. El componente, las
  islas y el payload no se enteran. Era el pedido explícito del plan y está cumplido por
  construcción, no por promesa.
- **Fácil, y conviene decirlo: esto no necesita casilla para existir.** El frente D puede
  cerrarse entero por portapapeles. `T-153` no está bloqueado.
- **Difícil, y hay que escribirlo con cuidado: mientras `CASILLA` sea `null`, `BR-21` no se
  cumple entero.** Su promesa tiene dos mitades —"por mail sale dirigido a la casilla" y
  "por portapapeles queda copiado"— y hoy sólo se puede sostener la segunda. **`CNT-12`
  tiene que escribir las dos salidas como textos separados**, y el de mail no puede
  mostrarse cuando no hay casilla. Si se escribe un texto único que nombra las dos vías, el
  sitio promete un canal que no tiene: el defecto exacto que `BR-21` apartado 2 existe para
  impedir.
- **Difícil, y no lo arregla nadie: el sitio nunca va a saber si el mail se mandó.** Lo
  máximo verificable es `abierto`. Eso acota lo que pueden decir `CNT-12` y `UX-09` y ya
  está en la tabla de 4.
- **Difícil, aceptado: quien manda por mail revela su dirección al hacerlo.** No lo hace el
  payload, lo hace el transporte, y la persona lo ve antes de enviar. La alternativa
  —ofrecer sólo el portapapeles— le sacaría a `BR-21` la mitad que el usuario pidió.
- **Conocido y sin cambios: no hay forma de mostrar cuántas correcciones llegaron.** Es el
  riesgo del silencio que el plan del ciclo 9 ya anotó y que `IDEA-13` viene a cerrar. Este
  contrato no lo agrava ni lo disimula: `Entrega` deliberadamente no tiene un estado de
  revisión que el sitio no pueda sostener.
