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
