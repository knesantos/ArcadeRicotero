import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

/**
 * Impide que vuelva a pasar `FIND-15`.
 *
 * `partida.ts` creaba clases que ninguna hoja de estilo pintaba: el juego corria sin
 * ninguna senal de acierto, de error ni de rotulo, y el test de contraste de `T-38`
 * pasaba igual porque medía tokens que la pantalla nunca usaba. Un test verde sobre algo
 * que el jugador no ve es peor que no tener test.
 */

// El checkout de git en Windows deja CRLF: se normaliza para que las busquedas con
// '\n' literal no dependan de la maquina en la que corre el test.
const leer = (ruta: string): string => readFileSync(ruta, 'utf-8').replace(/\r\n/g, '\n');

const CSS = leer('src/styles/juego.css') + leer('src/styles/tokens.css');
const JS = leer('src/scripts/partida.ts');

/** Las clases de estado que el codigo crea y que tienen que verse distinto. */
const ESTADOS = [
  '.es-correcta',
  '.es-elegida',
  '.feedback.ok',
  '.feedback.no',
  '.insignia--leyenda',
  '.insignia--testimonio',
  '.sello--leyenda',
  '.sello--testimonio',
  '.tramo--bajo',
  '.tramo--medio',
  '.tramo--alto',
];

test('FIND-15: toda clase de estado que el codigo crea tiene una regla que la pinta', () => {
  const sinRegla = ESTADOS.filter((c) => !CSS.includes(c));
  assert.deepEqual(sinRegla, [], `clases creadas por el codigo y sin estilo: ${sinRegla.join(', ')}`);
});

test('el acierto y el error no se comunican solo con color', () => {
  // UX-01, checklist de accesibilidad. Quien no distingue rojo de verde tiene que poder
  // jugar igual: mismo principio de los molinetes, aplicado a la vista.
  for (const clase of ['.opcion.es-correcta', '.opcion.es-elegida']) {
    const bloque = CSS.slice(CSS.indexOf(clase));
    const hastaElSiguiente = bloque.slice(0, bloque.indexOf('\n}\n', bloque.indexOf('::after')) + 3);
    assert.ok(
      hastaElSiguiente.includes('::after') && hastaElSiguiente.includes('content:'),
      `${clase} no agrega un simbolo, solo color`,
    );
  }
});

test('los rotulos se distinguen por forma ademas de por color', () => {
  assert.ok(CSS.includes(".insignia--leyenda::before"), 'la insignia de leyenda no tiene simbolo');
  assert.ok(CSS.includes(".insignia--testimonio::before"), 'la insignia de testimonio no tiene simbolo');
  assert.ok(CSS.includes('border: 2px dashed'), 'el sello no se distingue por borde');
});

test('ni juego.css ni sitio.css traen un color literal: todo sale de los tokens', () => {
  // El circuito de diseno-marca: el UNICO archivo del repo donde vive un hex es
  // tokens.css. Un hex suelto en una hoja de componentes romperia esa separacion.
  for (const hoja of ['src/styles/juego.css', 'src/styles/sitio.css', 'src/styles/cancionero.css']) {
    const hexes = leer(hoja).match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    assert.deepEqual(hexes, [], `${hoja} tiene colores literales: ${hexes.join(', ')}`);
  }
});

test('anti-slop: sin pastillas capsula ni barras de acento laterales', () => {
  // La regla de marca (.claude/rules/diseno-marca.md, seccion anti-slop) veta los
  // tics de interfaz generica de IA. Dos son detectables por maquina: la pastilla
  // capsula (border-radius: 999px) y la barra de acento en el borde izquierdo de
  // una tarjeta. La UNICA barra lateral permitida es la sangria de cita de los
  // parrafos rotulados de la Redondopedia (.parrafo--leyenda / .parrafo--testimonio),
  // que es tipografia editorial y mecanismo de BR-08, no decoracion.
  for (const hoja of ['src/styles/juego.css', 'src/styles/sitio.css', 'src/styles/cancionero.css']) {
    const css = leer(hoja).replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!css.includes('999px'), `${hoja}: pastilla capsula (border-radius 999px)`);
    for (const regla of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      // **`border-left` tambien, no solo la propiedad logica.** El chequeo miraba unicamente
      // `border-inline-start` y por ese hueco entro una barra lateral de verdad, escrita con
      // la propiedad fisica, en el panel de "si no se escucha". Un auditor que solo conoce
      // una de las dos formas de escribir lo mismo no audita nada.
      if (/border-(inline-start|left)\s*:/.test(regla[2]!)) {
        assert.match(
          regla[1]!.trim(),
          /^\.parrafo--/,
          `${hoja}: barra lateral fuera de la cita rotulada, en "${regla[1]!.trim()}"`,
        );
      }
    }
  }
});

test('D-21: ninguna tapa entra de fondo sin su velo', () => {
  // La mitigacion central del riesgo del ciclo 4, hecha maquina. `contraste.test.ts`
  // prueba que el velo alcanza; esto prueba que el velo ESTA. Una tapa puesta de fondo
  // sin velo no falla ningun test de color —el color no cambio— y sin embargo deja el
  // texto sobre una foto: es justo el caso que la regla de marca veta como "foto a
  // sangre con texto encima". Se exige en el mismo bloque de declaraciones, no en la
  // hoja entera, para que no alcance con que el velo aparezca en cualquier otro lado.
  //
  // Desde el ciclo 12 hay una tapa de fondo que NO vive en `/tapas/fondo/`: la sala que se
  // vuelve el disco acertado usa la ficha de `/tapas/<slug>.jpg`, y la ruta la pone la
  // isla en tiempo de ejecucion a traves de `--tapa-de-la-sala`. Por eso el patron cubre
  // las dos vias (`ADR-05.7`): cualquier `/tapas/` en un `background`, y cualquier
  // `var(--tapa-`. Toda propiedad personalizada que transporte una tapa se llama `--tapa-*`.
  for (const hoja of ['src/styles/juego.css', 'src/styles/sitio.css', 'src/styles/cancionero.css']) {
    const css = leer(hoja).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const regla of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      const declaraciones = regla[2]!;
      const poneTapa = /background[^;]*(\/tapas\/|var\(--tapa-)/.test(declaraciones);
      if (!poneTapa) continue;
      assert.ok(
        declaraciones.includes('--velo-tapa'),
        `${hoja}: "${regla[1]!.trim()}" pone una tapa de fondo sin velo`,
      );
    }
  }
});

test('ciclo 13: el velo se queda plano; lo que se desvanece es la capa entera', () => {
  /*
   * El agujero que este test tapa es de los que pasan en verde.
   *
   * El test de arriba exige `--velo-tapa` en el mismo bloque que la tapa, y lo hace por
   * subcadena. O sea que `linear-gradient(var(--velo-tapa), transparent)` **lo pasa** — y
   * deja media foto desnuda debajo del texto, que es exactamente lo que el velo existe
   * para impedir. Es la forma obvia de "integrar" un fondo cuando a alguien le molesta el
   * borde, y el ciclo 13 la nombró como la trampa a evitar antes de escribir una línea.
   *
   * La regla: el velo es un lavado PLANO —dos paradas idénticas— y el borde se resuelve
   * con máscara, que es alfa y no toca el color. Se verifica que las dos paradas del
   * gradiente del velo sean el mismo valor.
   */
  const malos: string[] = [];
  for (const hoja of ['src/styles/juego.css', 'src/styles/sitio.css', 'src/styles/cancionero.css']) {
    const css = leer(hoja).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/linear-gradient\(\s*var\(--velo-tapa[^)]*\)\s*,\s*([^),]+)\)/g)) {
      const segunda = m[1]!.trim();
      if (!/^var\(--velo-tapa/.test(segunda)) malos.push(`${hoja}: velo que se desvanece hacia "${segunda}"`);
    }
  }
  assert.deepEqual(malos, [], malos.join('\n  '));
});

test('ciclo 13: una imagen de /tapas/ que entra por mascara solo puede ser una pasada', () => {
  /*
   * El pie de imprenta abrió una vía nueva para que un archivo de `/tapas/` llegue a
   * pantalla: la máscara. Y esa vía **no la mira ninguno de los tests de arriba**, porque
   * todos buscan la palabra `background`.
   *
   * La diferencia importa y no es formal. Una máscara usa el canal ALFA: lo que se ve es
   * tinta de `tokens.css` recortada con una silueta, no un píxel de nadie — por eso no
   * lleva velo y por eso no entra al peor caso de `contraste.test.ts`. Pero si por ahí
   * entrara un `fondo/` o una tapa entera, sería una foto sin velo con coartada de
   * máscara.
   *
   * Entonces: por máscara sólo pasan las separaciones de `/tapas/pasadas/`, que es lo
   * único del repo que se produce como alfa (`generar-pasadas.mjs`, `ADR-05`).
   */
  const malos: string[] = [];
  for (const hoja of ['src/styles/juego.css', 'src/styles/sitio.css', 'src/styles/cancionero.css']) {
    const css = leer(hoja).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const regla of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      for (const decl of regla[2]!.split(';')) {
        if (!/mask[a-z-]*\s*:/.test(decl) || !decl.includes('/tapas/')) continue;
        for (const url of decl.matchAll(/\/tapas\/[^"')\s]+/g)) {
          if (!url[0]!.startsWith('/tapas/pasadas/')) {
            malos.push(`${hoja}: "${regla[1]!.trim()}" enmascara con ${url[0]}, que no es una pasada`);
          }
        }
      }
    }
  }
  /*
   * Y la otra via, que es la que el marcado usa: la franja recibe su pasada por una
   * propiedad `--pasada-*` escrita en linea. Ahi la ruta es una expresion, no un literal,
   * asi que no hay nada que leer en el `.astro` — **lo que se audita es el unico lugar
   * donde la ruta existe de verdad**, que es la funcion que la arma. Es el mismo criterio
   * que `ADR-05.7` uso para las islas: se cierra por convencion de nombre, y el nombre
   * `--pasada-*` esta elegido para que este test lo encuentre.
   */
  const arte = leer('src/lib/sitio/arte.ts');
  const desde = arte.indexOf('export function pasadaDeDisco');
  assert.ok(desde > 0, 'arte.ts ya no exporta pasadaDeDisco: la franja arma la ruta en otro lado');
  const cuerpo = arte.slice(desde, arte.indexOf('\n}', desde));
  for (const url of cuerpo.matchAll(/\/tapas\/[^`'")\s]+/g)) {
    if (!url[0]!.startsWith('/tapas/pasadas/')) malos.push(`arte.ts: pasadaDeDisco devuelve ${url[0]}`);
  }
  const pie = leer('src/components/PieImprenta.astro');
  if (!pie.includes('pasadaDeDisco')) {
    malos.push('PieImprenta.astro arma la ruta de la pasada a mano en vez de pedirsela a arte.ts');
  }
  for (const m of pie.matchAll(/--pasada-[\w-]+:\s*url\(["']?(\/[^"')]+)/g)) {
    if (!m[1]!.startsWith('/tapas/pasadas/')) malos.push(`PieImprenta.astro: --pasada-* trae ${m[1]}`);
  }
  assert.deepEqual(malos, [], malos.join('\n  '));
});

test('ADR-05.7: ninguna isla escribe una imagen de fondo en linea; una tapa entra por --tapa-*', () => {
  // La unica tapa de fondo que se pone desde JavaScript seria la unica que ningun test de
  // CSS mira. Se cierra por convencion: la isla escribe la variable, y el velo lo pone la
  // regla de la hoja, donde el test de arriba lo ve.
  const islas = readdirSync('src/scripts').filter((f) => f.endsWith('.ts'));
  const malas: string[] = [];
  for (const isla of islas) {
    const fuente = leer(`src/scripts/${isla}`);
    if (/style\.backgroundImage\s*=/.test(fuente)) malas.push(`${isla}: escribe style.backgroundImage`);
    if (/setProperty\(\s*['"]background/.test(fuente)) malas.push(`${isla}: escribe background por setProperty`);
    for (const m of fuente.matchAll(/setProperty\(\s*['"](--[\w-]+)['"]\s*,\s*`?url/g)) {
      if (!m[1]!.startsWith('--tapa-')) malas.push(`${isla}: una url de imagen entra por ${m[1]} y no por --tapa-*`);
    }
  }
  assert.deepEqual(malas, [], malas.join('\n  '));
});

test('CTR-12 caso 19 (candado 7 de ADR-05.9): la estampa se apoya en papel opaco y aislado', () => {
  /*
   * La enmienda `ADR-05.9` ratifica el papel como cuarta zona: hasta un 16 % de cada tapa
   * NO se imprime, y ahi lo que se ve es el papel. Eso vuelve al fondo del contenedor una
   * pieza del contrato, no una decoracion: **el papel no viaja en ningun archivo**, lo
   * pone esta regla. Sin el, la zona sin imprimir es un agujero a la tapa velada de atras.
   *
   * Y con `isolation` pasa lo mismo por el otro lado: sin aislar, el `multiply` de las
   * tintas se mezcla con lo que haya detras del contenedor en vez de detenerse en el
   * papel. Ya paso una vez y se llamo `FIND-48`.
   *
   * Las dos declaraciones se exigen en el MISMO bloque, no en la hoja entera: que
   * `--papel` e `isolation` aparezcan en algun otro lado no salva a la estampa.
   */
  const css = leer('src/styles/juego.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const bloque = css.match(/(^|\})\s*\.estampa-papel\s*\{([^}]*)\}/m);
  assert.ok(bloque, 'no existe el bloque .estampa-papel en juego.css');
  const declaraciones = bloque![2]!;
  assert.match(declaraciones, /background:\s*var\(--papel\)/, '.estampa-papel perdio su papel opaco');
  assert.match(declaraciones, /isolation:\s*isolate/, '.estampa-papel perdio el aislamiento del multiply');
});

test('UX-22 §8: el registro imperfecto vive solo en la letra grande, nunca en un parrafo', () => {

  /*
   * El eco de segunda tinta es la unica sombra que `diseno-marca.md` admite, y por eso es
   * la mas facil de convertir en tic: una sombra dura corrida queda "bien" en cualquier
   * cosa. Esta lista es CERRADA. Sumar un selector es una decision de `UX-22` §8 —que
   * dice donde si y donde no—, no un descuido de quien pasa por la hoja.
   *
   * Lo que el test protege de verdad son los cuatro "nunca" de esa tabla: cuerpo de
   * texto, rotulos de registro 3, estados de acierto y error, y los tres articulos de
   * tono grave. Ninguno puede aparecer aca sin que alguien lo escriba a proposito.
   */
  const PERMITIDOS = new Set([
    '.marca-grande', // la marca del portal
    '.marca', // la marca de la cabecera de cada juego
    '.pantalla h1', // el h1 de cada juego
    '.casete-titulo', // el titulo de un casete
    '.articulo:not(.articulo--grave) h1', // el titulo de articulo, salvo los tres graves
    '.estampa-disco', // el nombre del disco en la estampa (`UX-22` §2)
  ]);
  const encontrados: string[] = [];
  for (const hoja of ['src/styles/sitio.css', 'src/styles/juego.css', 'src/styles/cancionero.css']) {
    const css = leer(hoja).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const regla of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      if (!/text-shadow[^;]*var\(\s*--registro\s*\)/.test(regla[2]!)) continue;
      for (const sel of regla[1]!.split(',')) encontrados.push(sel.trim().replace(/\s+/g, ' '));
    }
  }
  assert.ok(encontrados.length > 0, 'el registro imperfecto desaparecio de las hojas');
  const intrusos = encontrados.filter((s) => !PERMITIDOS.has(s));
  assert.deepEqual(intrusos, [], `UX-22 §8 no nombra estos lugares: ${intrusos.join(', ')}`);
});

test('toda clase de estado usada en el CSS existe de verdad en el codigo', () => {

  // El reves del primer test: estilos huerfanos de clases que ya nadie crea.
  //
  // El codigo arma varias con plantilla —`insignia--${clase}`, `tramo--${t}`— asi que
  // buscar la cadena completa daria falsos positivos. Se busca la **base**: si el codigo
  // no menciona `tramo--` en ningun lado, las tres reglas de tramo son huerfanas.
  const bases = [...new Set(ESTADOS.map((c) => c.replace(/^\./, '').split('.').pop()!.replace(/--.*$/, '--')))];
  for (const base of bases) {
    assert.ok(JS.includes(base), `el CSS estila "${base}…" pero el codigo no crea ninguna`);
  }
});

/* ==================================================================
   Adivinar el tema (US-02): el mismo control que FIND-15, para el juego nuevo
   ================================================================== */

const JS_TEMA = leer('src/scripts/partida-tema.ts');

/** Las clases de estado que crea la isla del tema y que tienen que verse distinto. */
const ESTADOS_TEMA = [
  '.intento--libre',
  '.intento--fallado',
  '.intento--pasado',
  '.barra-tramo--abierto',
  // La regla graduada de abajo de la barra: el numero del escalon que ya tenes cambia de
  // tinta igual que su tramo. Sin regla que lo pinte, la regla queda toda del mismo gris
  // y deja de decir donde estas.
  '.barra-marca--abierta',
  '.escuchar--sonando',
  '.arriesgar--listo',
  '.sugerencia--marcada',
  '.sugerencia--vacia',
  '.resumen-fila--ok',
  '.resumen-fila--no',
  '.restantes--ultimo',
];

test('US-02: toda clase de estado que crea la isla del tema tiene una regla que la pinta', () => {
  const sinRegla = ESTADOS_TEMA.filter((c) => !CSS.includes(c));
  assert.deepEqual(sinRegla, [], `clases creadas por el codigo y sin estilo: ${sinRegla.join(', ')}`);
});

test('US-02: las clases que el CSS estila las crea de verdad la isla', () => {
  // El reves del anterior: estilos huerfanos. Se busca la base de cada familia, porque
  // el codigo arma varias con plantilla.
  const bases = [...new Set(ESTADOS_TEMA.map((c) => c.replace(/^\./, '').replace(/--.*$/, '--')))];
  for (const base of bases) {
    assert.ok(JS_TEMA.includes(base), `el CSS estila "${base}..." pero la isla no crea ninguna`);
  }
});

test('US-02: el intento fallado, el pasado y el resumen no se comunican solo con color', () => {
  // UX-01. En este juego el simbolo lo escribe el JavaScript (es contenido del renglon,
  // no decoracion de la caja), asi que se verifica ahi y no en el CSS.
  for (const simbolo of ['✕', '·', '✔']) {
    assert.ok(JS_TEMA.includes(simbolo), `la isla no escribe el simbolo ${simbolo} en ningun estado`);
  }
});

test('US-02: el boton de escuchar dice con un simbolo si esta sonando o no', () => {
  // Es el unico control que cambia de funcion sin cambiar de lugar: tiene que
  // distinguirse de un vistazo, no leyendo.
  const bloque = CSS.slice(CSS.indexOf('.escuchar::before'));
  assert.ok(bloque.includes('content:'), 'el boton de escuchar no lleva simbolo');
  assert.ok(
    CSS.includes('.escuchar--sonando::before'),
    'el boton no cambia de simbolo cuando esta sonando',
  );
});

test('US-02: la barra de tramos no tapa el primer paso con un ancho de cero', () => {
  // El primer tramo es el 0,67% de la barra: medio pixel en un celular. Sin `min-width`
  // el jugador no ve el escalon que esta usando.
  const bloque = CSS.slice(CSS.indexOf('.barra-tramo {'), CSS.indexOf('.barra-tramo:first-child'));
  assert.match(bloque, /min-width:\s*\d/, '.barra-tramo no tiene ancho minimo');
});

/* ==================================================================
   Sacalo por la letra (US-07): el mismo control, para el tercer juego
   ================================================================== */

const JS_LETRA = leer('src/scripts/partida-por-la-letra.ts');

/** Las clases de estado que crea la isla de la letra y que tienen que verse distinto. */
const ESTADOS_LETRA = [
  '.chip--fallado',
  '.chip--pasado',
  '.verso--nuevo',
  '.arriesgar--listo',
  '.sugerencia--marcada',
  '.sugerencia--vacia',
  '.restantes--ultimo',
  '.resumen-fila--ok',
  '.resumen-fila--no',
  '.partida--revelada',
];

test('US-07: toda clase de estado que crea la isla de la letra tiene una regla que la pinta', () => {
  const sinRegla = ESTADOS_LETRA.filter((c) => !CSS.includes(c));
  assert.deepEqual(sinRegla, [], `clases creadas por el codigo y sin estilo: ${sinRegla.join(', ')}`);
});

test('US-07: las clases que el CSS estila las crea de verdad la isla', () => {
  const bases = [...new Set(ESTADOS_LETRA.map((c) => c.replace(/^\./, '').replace(/--.*$/, '--')))];
  for (const base of bases) {
    assert.ok(JS_LETRA.includes(base), `el CSS estila "${base}..." pero la isla no crea ninguna`);
  }
});

test('US-07: el estado de un intento gastado no se comunica solo con color', () => {
  // UX-01. El simbolo lo escribe el JavaScript: es contenido del chip, no decoracion.
  for (const simbolo of ['✕', '·', '✔']) {
    assert.ok(JS_LETRA.includes(simbolo), `la isla no escribe el simbolo ${simbolo}`);
  }
});

test('US-07: lo que se esconde con `hidden` tiene su regla, o no se esconde nada', () => {
  // El defecto que este test existe para cazar ya paso: `.chips` declaraba `display: flex`
  // y `chips.hidden = true` no apagaba nada, porque el estilo de autor le gana siempre a
  // la hoja del navegador. Es silencioso: no hay error, solo un renglon vacio ocupando
  // pantalla en el unico tablero del sitio que pelea el espacio por pixel.
  for (const clase of ['.chips', '.buscador', '.sugerencias', '.revelacion']) {
    const declaraDisplay = new RegExp(`\\${clase} \\{[^}]*display:`).test(CSS);
    if (!declaraDisplay) continue;
    assert.ok(
      CSS.includes(`${clase}[hidden]`),
      `${clase} declara display propio y no tiene regla [hidden]: esconderla no hace nada`,
    );
  }
});

/* ==================================================================
   Ponelos en fila (US-08): el mismo control que FIND-15, para el septimo juego
   ================================================================== */

const JS_PONELOS = leer('src/scripts/partida-ponelos.ts');

/** Las clases de estado que crea la isla de repartir y que tienen que verse distinto. */
const ESTADOS_PONELOS = [
  '.fila--abierta',
  '.pieza--puesta',
  '.pieza--en-mano',
  '.bandeja--vacia',
  '.mano--cargada',
  '.lista--compartida',
];

test('US-08: toda clase de estado que crea la isla de repartir tiene una regla que la pinta', () => {
  const sinRegla = ESTADOS_PONELOS.filter((c) => !CSS.includes(c));
  assert.deepEqual(sinRegla, [], `clases creadas por el codigo y sin estilo: ${sinRegla.join(', ')}`);
});

test('US-08: las clases que el CSS estila las crea de verdad la isla', () => {
  const bases = [...new Set(ESTADOS_PONELOS.map((c) => c.replace(/^\./, '').replace(/--.*$/, '--')))];
  for (const base of bases) {
    assert.ok(JS_PONELOS.includes(base), `el CSS estila "${base}..." pero la isla no crea ninguna`);
  }
});

test('US-08: lo que tenes en la mano no se comunica solo con color', () => {
  // `UX-01`. En este juego la senal ademas del borde es **texto**: el rotulo `EN LA MANO`,
  // que sale de `copy.ts` y que la isla escribe en dos lugares (la ficha y la franja de
  // arriba). Un borde dorado entre otros trece bordes se pierde; una palabra, no.
  assert.ok(JS_PONELOS.includes('enLaMano'), 'la isla dejo de escribir el rotulo de la mano');
  assert.ok(JS_PONELOS.includes('aria-pressed'), 'la ficha dejo de decir si esta tomada');
  // Y el punto medio que distingue el renglon chico de una ficha puesta, sin depender del tinte.
  assert.ok(JS_PONELOS.includes('·'), 'la isla no escribe el simbolo del renglon de una ficha puesta');
});

/**
 * `BR-22` hecho test: **ninguna fila de este juego tiene color propio.**
 *
 * Es el defecto mas probable de todo el juego y el mas dificil de ver revisando: la tier
 * list del genero pinta la fila de arriba de verde y la de abajo de rojo, y en este sitio
 * `--acento-3` es acierto y `--acento-4` es error. Una rampa asi le diria al que jugo al
 * quiz que la fila de arriba **esta bien**, que es exactamente la afirmacion que este juego
 * no puede hacer. Y no alcanza con no usar esos dos tokens: cualquier tinte que varie entre
 * filas reintroduce la jerarquia por la ventana.
 *
 * Se mira el bloque entero del juego, que arranca en su encabezado y llega hasta el final
 * de la hoja.
 */
test('US-08 (BR-22): ninguna fila se distingue por tinte, y el acierto no le presta el suyo', () => {
  const css = leer('src/styles/juego.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const desde = css.indexOf('.ponelos {');
  assert.ok(desde > 0, 'el bloque de "Ponelos en fila" desaparecio de juego.css');
  const bloque = css.slice(desde);

  for (const reservado of ['--acento-3', '--acento-4']) {
    assert.ok(
      !bloque.includes(reservado),
      `el tablero de repartir usa ${reservado}, que es acierto o error y no rota (BR-22)`,
    );
  }

  // Ninguna regla de fila puede pedir una tinta de disco: las cuatro se visten con el
  // mismo `--tinte-juego`, que es el del juego y no el de ninguna de ellas.
  for (const regla of bloque.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selector = regla[1]!.trim();
    if (!/^\.fila\b|^\.fila--/.test(selector)) continue;
    assert.ok(
      !/--tinta-disco|--disco-/.test(regla[2]!),
      `"${selector}" le pone tinta propia a una fila`,
    );
  }
});

test('US-08: la ficha y la banda de destino entran en la zona de pulgar', () => {
  // `D-09` ("jugable con el pulgar") y `--toque-min`. Las dos son blancos de toque, y la
  // banda tiene que serlo entera: apuntarle a un sello de 24 px con el dedo no es jugable.
  const css = leer('src/styles/juego.css').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const clase of ['.pieza', '.fila-destino', '.conjunto']) {
    const bloque = css.match(new RegExp(`(^|\\})\\s*\\${clase}\\s*\\{([^}]*)\\}`, 'm'));
    assert.ok(bloque, `no existe el bloque ${clase} en juego.css`);
    assert.match(
      bloque![2]!,
      /min-height:\s*var\(--toque-min\)/,
      `${clase} no reserva la zona de pulgar`,
    );
  }
});

/**
 * **El foco no se cae al `<body>` cuando el tablero se rehace.**
 *
 * De todos los defectos posibles de este juego, éste es el que más lejos llega sin que
 * nadie lo vea: con mouse no se nota nada, y con teclado el juego es injugable — cada ficha
 * colocada devuelve el foco al principio del documento.
 *
 * Pasa porque `pintarTablero()` rehace el tablero entero en cada toque (que es lo que hace
 * imposible que la pantalla y el reparto se desincronicen), y al reemplazar los hijos **el
 * botón que tenía el foco deja de existir**. Es el mismo defecto que la auditoría del
 * 2026-08-24 encontró en el quiz, y por eso las siete islas hacen `focus()` después de
 * repintar.
 *
 * Acá se verifica en el fuente y no en el navegador porque en Node no hay DOM. Lo que se
 * exige es el mecanismo, no el resultado: que exista quien devuelve el foco, que se lo
 * llame al final del repintado, y que las piezas y las filas lleven la marca con la que se
 * las vuelve a encontrar. El resultado se probó en el navegador el 2026-09-03: tomar,
 * ubicar y `Escape` dejan el foco en una pieza o en una fila, nunca en el `<body>`.
 */
test('US-08: el tablero se rehace entero, y el foco no se cae con el', () => {
  const isla = leer('src/scripts/partida-ponelos.ts');
  assert.match(isla, /function devolverElFoco/, 'la isla ya no devuelve el foco tras repintar');
  // Y se lo llama DESPUES de rehacer el tablero, no antes: antes enfocaria un boton que
  // esta por dejar de existir, que es exactamente el defecto que esto ataja.
  const rehace = isla.indexOf('zonaTablero.append(pintarAcciones())');
  const devuelve = isla.indexOf('devolverElFoco(veniaDeAdentro)');
  assert.ok(rehace > 0 && devuelve > rehace, 'devolverElFoco dejo de llamarse al final de pintarTablero');
  // Sin estas dos marcas, `devolverElFoco` no tiene contra que buscar el elemento nuevo.
  assert.match(isla, /dataset\.i = String\(indice\)/, 'la pieza perdio su indice');
  assert.match(isla, /dataset\.fila = String\(/, 'la fila de destino perdio su numero');
  // Y el foco no puede quedar en algo que ya no existe: se resuelve DESPUES de repintar.
  assert.match(isla, /querySelector<HTMLElement>\(`\.pieza\[data-i=/, 'ya no busca la pieza repintada');
});
