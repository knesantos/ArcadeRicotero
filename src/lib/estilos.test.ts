import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { hexDeRgb, leerDeclaraciones, paletaDelArea, resolverToken, rgbDeHex } from './pixel/tokens.ts';

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

/**
 * Las hojas de componentes: todo `src/styles/` menos `tokens.css`, **barrido del disco y no
 * escrito a mano**.
 *
 * Hasta el ciclo 15 esto era una lista literal de tres, repetida en seis controles, y
 * `ADR-08.8` la nombró como el agujero más barato de todos: **una hoja nueva se escapaba de
 * los dos escáneres de estética sin que nadie se enterara**. Sin chequeo de 999px, sin barra
 * lateral, sin velo. Nadie rompe nada al agregarla; simplemente nadie la mira, que es la
 * única forma en que un defecto de marca entra sin discusión.
 *
 * El mecanismo no se inventa acá: es el de `todoElCss()`, abajo, que barre el directorio
 * desde el ciclo 14. Lo mismo hacen el censo de islas de más abajo y el de `voz.test.ts`.
 *
 * **`tokens.css` queda afuera a propósito**: es el único archivo del repo donde un hex, una
 * fuente o una duración pueden vivir (`.claude/rules/diseno-marca.md`).
 */
const HOJAS = readdirSync('src/styles')
  .filter((f) => f.endsWith('.css') && f !== 'tokens.css')
  .map((f) => `src/styles/${f}`)
  .sort();

test('el barrido de hojas no se vuelve verde por vago: encuentra las que hay en disco', () => {
  // Si `readdirSync` devolviera una lista vacia, los seis controles de abajo pasarian sin
  // mirar nada y el archivo entero seria decorativo. Estas tres son un piso, no un techo:
  // la hoja que entre manana entra sola, que es justo el punto.
  for (const hoja of ['juego.css', 'sitio.css', 'cancionero.css']) {
    assert.ok(HOJAS.includes(`src/styles/${hoja}`), `el barrido perdio ${hoja}`);
  }
  assert.ok(!HOJAS.includes('src/styles/tokens.css'), 'tokens.css no es una hoja de componentes');
});

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

test('ninguna hoja de componentes trae un color literal: todo sale de los tokens', () => {
  // El circuito de diseno-marca: el UNICO archivo del repo donde vive un hex es
  // tokens.css. Un hex suelto en una hoja de componentes romperia esa separacion.
  // El titulo nombraba dos hojas y las miraba a las tres; ahora mira las que haya.
  for (const hoja of HOJAS) {
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
  for (const hoja of HOJAS) {
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
  for (const hoja of HOJAS) {
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
  for (const hoja of HOJAS) {
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
  for (const hoja of HOJAS) {
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

/*
 * La sombra salió de todos lados (`D-64`).
 *
 * Pedido del usuario, textual: *"saquemos la sombra de todos lados, no me gusta"*. Hasta el
 * 2026-10-05 este lugar tenía el test del registro imperfecto de `UX-22` §8 —el eco de segunda
 * tinta detrás de la letra grande—, con una lista cerrada de dónde podía ir. Ahora no puede
 * ir en ningún lado, y el test se da vuelta: en vez de cuidar dónde va la sombra, cuida que
 * no vuelva.
 *
 * Mira TODO el CSS del sitio —las hojas, `tokens.css` y el `<style>` de cada página—, porque
 * una sombra escrita a mano en una `.astro` era justo lo que la lista vieja no veía (había
 * dos: el botón de arranque de "Adiviná el tema" y el de "Sacalo por la letra").
 *
 * Lo que sí queda permitido no es sombra: un anillo sin desplazamiento ni difuminado
 * (`0 0 0 <ancho> <color>`, con o sin `inset`) dibuja un contorno pegado a la pieza. Lo usan
 * el filo de la aguja de la barra, la tecla que suena y los anillos de Skayboy (`UX-33` §1.4).
 */

/** Los valores de una propiedad en un CSS ya sin comentarios. */
function valoresDe(css: string, propiedad: string): string[] {
  // Con o sin prefijo de motor: `-webkit-box-shadow` es la misma sombra con otro nombre.
  return [...css.matchAll(new RegExp(`(?:^|[;{\\s])(?:-webkit-|-moz-)?${propiedad}\\s*:\\s*([^;}]+)`, 'g'))].map((m) =>
    m[1]!.trim(),
  );
}

/** Parte un valor de CSS en sus capas, por las comas que no están adentro de un paréntesis. */
function capas(valor: string): string[] {
  const out: string[] = [];
  let hondo = 0;
  let actual = '';
  for (const c of valor) {
    if (c === '(') hondo++;
    if (c === ')') hondo--;
    if (c === ',' && hondo === 0) {
      out.push(actual.trim());
      actual = '';
    } else actual += c;
  }
  out.push(actual.trim());
  return out;
}

/** Las sombras corridas de un CSS: toda capa que no sea `none` ni un anillo pegado. */
function sombrasCorridas(css: string): string[] {
  const limpio = sinComentarios(css);
  const malas: string[] = [];
  for (const v of valoresDe(limpio, 'text-shadow')) if (v !== 'none') malas.push(`text-shadow: ${v}`);
  for (const v of valoresDe(limpio, 'box-shadow')) {
    for (const capa of capas(v)) {
      if (capa === 'none') continue;
      if (/^(inset\s+)?0(px)?\s+0(px)?\s+0(px)?\s+\S/.test(capa)) continue;
      malas.push(`box-shadow: ${capa}`);
    }
  }
  // Y la que se escribe como filtro: `drop-shadow()` es una sombra corrida igual.
  for (const v of valoresDe(limpio, 'filter')) if (/drop-shadow\(/.test(v)) malas.push(`filter: ${v}`);
  return malas;
}

test('D-64: ninguna letra ni ninguna pieza lleva sombra', () => {
  const malas = sombrasCorridas(todoElCss());
  assert.deepEqual(
    malas,
    [],
    `volvió una sombra (D-64 la sacó de todos lados):\n  ${malas.join('\n  ')}\n` +
      'Lo que separa una pieza del fondo es el borde y el giro, no una sombra.',
  );
});

test('D-64: ese control sabe encontrar', () => {
  // Las tres formas en que una sombra puede volver, y las dos que no son sombra.
  assert.deepEqual(sombrasCorridas('.x{text-shadow:2px 2px 0 var(--borde)}'), ['text-shadow: 2px 2px 0 var(--borde)']);
  assert.deepEqual(sombrasCorridas('.x{box-shadow:0 4px 0 var(--borde)}'), ['box-shadow: 0 4px 0 var(--borde)']);
  assert.deepEqual(sombrasCorridas('.x{box-shadow:var(--registro) var(--registro) 0 red}').length, 1);
  assert.deepEqual(
    sombrasCorridas('.x{box-shadow:inset 0 0 0 2px var(--fondo), 3px 3px 0 color-mix(in srgb, red 40%, blue)}'),
    ['box-shadow: 3px 3px 0 color-mix(in srgb, red 40%, blue)'],
  );
  assert.deepEqual(sombrasCorridas('.x{box-shadow:inset 0 0 0 var(--anillo) var(--fondo)} .y{box-shadow:0 0 0 1px red}'), []);
  assert.deepEqual(sombrasCorridas('.x{text-shadow:none; transition: box-shadow 1s}'), []);
  assert.deepEqual(sombrasCorridas('/* text-shadow: 2px 2px 0 red */ .x{color:red}'), []);
  // Las dos formas que la primera versión no veía (las encontró la revisión del 2026-10-05).
  assert.deepEqual(sombrasCorridas('.x{-webkit-box-shadow:2px 2px 0 red}'), ['box-shadow: 2px 2px 0 red']);
  assert.deepEqual(sombrasCorridas('.x{filter: drop-shadow(2px 2px 0 red)}'), ['filter: drop-shadow(2px 2px 0 red)']);
  assert.deepEqual(sombrasCorridas('.x{filter: brightness(1.1)}'), []);
});

test('D-64: tampoco la dibuja una isla ni el canvas de la tarjeta', () => {
  // Las hojas no son la única vía: una isla puede escribir `style.boxShadow`, y la tarjeta
  // compartible y la lámina dibujan texto en un canvas, donde la sombra se pide por nombre.
  const fuentes: string[] = [];
  const recorrer = (dir: string): void => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const ruta = join(dir, e.name);
      if (e.isDirectory()) recorrer(ruta);
      else if (/\.(ts|mjs)$/.test(e.name) && !e.name.endsWith('.test.ts')) fuentes.push(ruta);
    }
  };
  recorrer('src/scripts');
  recorrer('src/lib');
  const malas = fuentes.filter((f) =>
    /\b(textShadow|boxShadow|shadowColor|shadowBlur|shadowOffset[XY])\b|setProperty\(\s*['"`](box|text)-shadow/.test(
      sinComentarios(leer(f)),
    ),
  );
  assert.deepEqual(malas, [], `estos archivos pintan una sombra por código: ${malas.join(', ')}`);
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
  // El renglon que toca (su numero de escalon se enciende) y el ultimo que gastaste, que es
  // el unico que queda a la vista con el teclado abierto.
  '.intento--actual',
  '.intento--ultimo',
  '.barra-tramo--abierto',
  // La regla graduada de abajo de la barra: el numero del escalon que ya tenes cambia de
  // tinta igual que su tramo. Sin regla que lo pinte, la regla queda toda del mismo gris
  // y deja de decir donde estas.
  '.barra-marca--abierta',
  // Y el numero del tope se estampa: es hasta donde llega el audio que tenes.
  '.barra-marca--actual',
  '.escuchar--sonando',
  // Lo que ya arriesgaste sigue en la lista, tachado y sin poder elegirse.
  '.sugerencia--probada',
  '.arriesgar--listo',
  '.sugerencia--marcada',
  '.sugerencia--vacia',
  '.resumen-fila--ok',
  '.resumen-fila--no',
  '.restantes--ultimo',
];

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
  // El ultimo intento gastado: el unico chip que queda con el teclado abierto.
  '.chip--ultimo',
  // Lo que ya arriesgaste sigue en la lista, tachado y sin poder elegirse.
  '.sugerencia--probada',
  '.verso--nuevo',
  '.arriesgar--listo',
  '.sugerencia--marcada',
  '.sugerencia--vacia',
  '.restantes--ultimo',
  '.resumen-fila--ok',
  '.resumen-fila--no',
  '.partida--revelada',
];

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
  // `D-69`: el mazo de a una y las filas propias.
  '.pieza--recien',
  '.carta--moviendo',
  '.mazo--moviendo',
  '.filas--editando',
];

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

/* ==================================================================
   El censo de islas: nadie suma un tablero sin que este archivo se entere
   ==================================================================

   ## Por que existe esta seccion

   Hasta el ciclo 14 los controles de `FIND-15` venian de a pares escritos a mano, uno por
   juego, y habia **cuatro pares para siete islas**: `partida-letra.ts`, `partida-tapa.ts` y
   `partida-dos-ejes.ts` no tenian ninguno. No rompian el build — simplemente nadie los
   miraba, que es la unica forma en que `FIND-15` se repite sin que se note.

   Agregar los tres pares que faltaban habria dejado el mismo agujero para el octavo juego.
   Asi que la lista **se deriva del disco**, con el mecanismo del censo de paginas que
   tenia `sitio/rutas-sonoras.test.ts` (se fue con la cinta, el 2026-10-01): no clasifica
   nada sola —eso seria adivinar— pero **falla con el nombre del archivo** cuando
   encuentra una isla que nadie declaro.

   ## Los tres candados, y por que hacen falta los tres

   1. **El censo.** Una isla nueva en `src/scripts/` que no este en `ISLAS` rompe el build.
   2. **El par reciproco**, ahora uno solo para las siete: lo declarado tiene regla, y lo
      que el CSS estila lo crea de verdad la isla.
   3. **La red derivada**, que cubre lo que el par no puede: el par audita lo *declarado*, y
      una clase que nadie puso en la lista se le escapa igual. Esta lee la isla y exige
      regla para **toda** clase modificadora que encuentre. Es la que encontro las dos que
      estaban sueltas hoy, `estampa--clave` y `rotulo--…`, ver mas abajo.
*/

const JS_COMPLETAR = leer('src/scripts/partida-letra.ts');
const JS_TAPA = leer('src/scripts/partida-tapa.ts');
const JS_EJES = leer('src/scripts/partida-dos-ejes.ts');

/*
 * Ojo con los nombres, que es una trampa real de este repo: `partida-letra.ts` es
 * **"completa la letra"** (`US-03`) y `partida-por-la-letra.ts` es **"sacalo por la letra"**
 * (`US-07`). La constante `JS_LETRA` de mas arriba es la del segundo, no la del primero, y
 * por eso el primero se llama aca `JS_COMPLETAR` en vez de seguir la serie.
 */

/** `US-03`. Calca la mecanica del quiz, y le suma el hueco del verso resuelto. */
const ESTADOS_COMPLETAR = [
  '.es-correcta',
  '.es-elegida',
  '.feedback.ok',
  '.feedback.no',
  '.sello--leyenda',
  '.sello--testimonio',
  // El hueco que se rellena al contestar: es la recompensa de haber respondido y tiene que
  // distinguirse del resto del verso, que ya estaba ahi.
  '.resuelto',
];

/** `US-04`. El quiz, mas lo que le pasa al recorte de tapa cuando se abre. */
const ESTADOS_TAPA = [
  '.es-correcta',
  '.es-elegida',
  '.feedback.ok',
  '.feedback.no',
  '.sello--leyenda',
  '.sello--testimonio',
  '.figura-tapa-juego--abierta',
  '.estampa-papel--abre',
  // Las tres tintas de la serigrafia (`RES-06`): cuando se acierta entran las tres, cuando
  // se falla entra sola la clave. Si la clave no tuviera regla propia, acertar y fallar se
  // verian igual.
  '.pasada--clara',
  '.pasada--media',
  '.pasada--clave',
];

/**
 * `US-06`, desde el ciclo 18 (`D-57`). Hasta ahí la lista estaba vacía y esa era la
 * declaración: no había acierto ni error, y el toque no dejaba ninguna marca —que era,
 * justamente, lo que dejaba pasar el doble toque—.
 *
 * Sigue sin haber acierto ni error (`BR-17`): ninguno de estos estados es verde ni rojo. Son
 * la opción **elegida** (apretada contra el papel durante la pausa), la que **se había
 * elegido** cuando se vuelve a una hoja, y en la grilla de las cuatro maneras **la tuya** y
 * **la de quien te mandó el enlace**. Cada una cambia de forma además de tinta.
 */
const ESTADOS_EJES = [
  '.ejes-opcion--elegida',
  '.ejes-opcion--antes',
  '.ejes-manera--tuya',
  '.ejes-manera--suya',
  // El sello del momento que se apoya cuando cambia el momento (`UX-36` §4.5): sin regla, la
  // noche pierde su único movimiento sin que nadie lo note.
  '.ejes-momento--entra',
  // La etiqueta del amigo que la isla pega en la tapa cuando llega un enlace viejo: sin regla,
  // el punteado "del otro" no se ve.
  '.ejes-tapa-etiqueta--amigo',
  // El plano de dos ejes (`UX-38`): la tuya y la del amigo se marcan con borde. Sin regla, la
  // marca desaparece del dibujo y nada falla.
  '.ejes-plano-cuadrante--tuya',
  '.ejes-plano-cuadrante--suya',
];

/**
 * `US-10`, "Más o menos". Reusa el acierto y el error del quiz sobre dos botones en vez de
 * cuatro (`UX-34` §3.3), y el panel del revelado. No tiene rótulos de leyenda ni de
 * testimonio: acá un número es hecho o "según", nunca leyenda (`D-48` punto 6).
 */
const ESTADOS_MAS_O_MENOS = ['.es-correcta', '.es-elegida', '.feedback.ok', '.feedback.no'];

interface Tablero {
  /** De que juego es, para que el mensaje de error no obligue a abrir el archivo. */
  readonly juego: string;
  readonly fuente: string;
  readonly estados: readonly string[];
  /**
   * La hoja propia del juego, si sus estados viven ahi y no en `juego.css`. Nace con
   * `US-09`, el primer juego con hoja propia: se nombra la hoja **de ese juego** y no se
   * suma todo `src/styles/` al control, que dejaria pasar un estado pintado en la hoja de
   * otro juego — o sea, un estado que en su pantalla no se ve.
   */
  readonly hoja?: string;
}
interface SinTablero {
  /** Por que esta isla no tiene clases de estado de partida. Escrito, no supuesto. */
  readonly sinTablero: string;
}

/**
 * Todas las islas del repo, una por una. Las siete que pintan un tablero traen su lista de
 * estados; las otras ocho dicen por escrito por que no tienen ninguno.
 *
 * **Las ocho de abajo no son relleno.** Mientras el universo fuera "los archivos que se
 * llaman `partida-*.ts`", una isla de juego con cualquier otro nombre se escapaba del censo
 * entero — y como se llama un archivo no es una garantia de nada. Declarando las quince, el
 * unico camino para sumar una isla pasa por esta tabla.
 */
const ISLAS: Readonly<Record<string, Tablero | SinTablero>> = {
  'partida.ts': { juego: 'US-01, el quiz', fuente: JS, estados: ESTADOS },
  'partida-tema.ts': { juego: 'US-02, adivinar el tema', fuente: JS_TEMA, estados: ESTADOS_TEMA },
  'partida-letra.ts': { juego: 'US-03, completar la letra', fuente: JS_COMPLETAR, estados: ESTADOS_COMPLETAR },
  'partida-tapa.ts': { juego: 'US-04, adivinar la tapa', fuente: JS_TAPA, estados: ESTADOS_TAPA },
  'partida-dos-ejes.ts': { juego: 'US-06, el test de dos ejes', fuente: JS_EJES, estados: ESTADOS_EJES },
  'partida-por-la-letra.ts': { juego: 'US-07, sacalo por la letra', fuente: JS_LETRA, estados: ESTADOS_LETRA },
  'partida-ponelos.ts': { juego: 'US-08, ponelos en fila', fuente: JS_PONELOS, estados: ESTADOS_PONELOS },
  'partida-mas-o-menos.ts': {
    juego: 'US-10, más o menos',
    fuente: leer('src/scripts/partida-mas-o-menos.ts'),
    estados: ESTADOS_MAS_O_MENOS,
  },
  // `US-09`: el area es un canvas y no tiene clases; lo unico que la isla pinta en el DOM es
  // la tecla que sigue apretada, que `:active` no alcanza a mostrar con cuatro dedos.
  'partida-skayboy.ts': {
    juego: 'US-09, skayboy y poligirl',
    fuente: leer('src/scripts/partida-skayboy.ts'),
    estados: ['.tecla--apretada'],
    hoja: 'src/styles/skayboy.css',
  },

  // Lo que comparten los dos juegos de sacar temas (`US-02` y `US-07`): la columna arriba
  // del teclado, las casillas de la vuelta y la escalerita del resultado. Sus estados viven
  // aca y no en cada isla porque los crea este modulo, no ellas.
  'sacar-temas.ts': {
    juego: 'US-02 y US-07, lo compartido',
    fuente: leer('src/scripts/sacar-temas.ts'),
    estados: [
      // La pantalla con el teclado abierto: sin regla que la pinte, la columna no existe y
      // el teclado vuelve a tapar la caja.
      '.partida--tecleando',
      // Las casillas de la vuelta: cuatro formas, ninguna de color solo.
      '.vuelta-casilla--actual',
      '.vuelta-casilla--ok',
      '.vuelta-casilla--no',
      // Los escalones de cada tema en el resultado.
      '.escalerita-paso--fallo',
      '.escalerita-paso--pasado',
      '.escalerita-paso--acierto',
    ],
  },

  // `D-72`: "Armá tu recital". Los dos estados de la hoja: el tema marcado (sus acciones a la
  // vista) y el que suena. Ninguno es solo color: contorno y subrayado.
  'partida-recital.ts': {
    juego: 'D-72, armá tu recital',
    fuente: leer('src/scripts/partida-recital.ts'),
    estados: ['.recital-renglon--marcado', '.recital-renglon--sonando', '.recital-renglon--entra'],
  },
  // `D-72`: la página "En vivo" de la Redondopedia, que vive en `sitio.css` como el resto de la
  // Redondopedia. Su único estado es el tema que suena.
  'en-vivo.ts': {
    juego: 'D-72, en vivo',
    fuente: leer('src/scripts/en-vivo.ts'),
    estados: ['.en-vivo-tema--sonando'],
    hoja: 'src/styles/sitio.css',
  },

  // `D-73`: el bestiario redondo, en la Redondopedia (`sitio.css`). Sus estados: la bestia que
  // está hablando y las ya anotadas (las dos con forma: un aro punteado y un sello con tilde),
  // la fila del índice anotada, el botón que suena y la soga del cordero cuando está tensa.
  'bestiario.ts': {
    juego: 'D-73, el bestiario redondo',
    fuente: leer('src/scripts/bestiario.ts'),
    estados: ['.bestia--elegida', '.bestia--anotada', '.bestiario-item--anotada', '.bestiario-escuchar--sonando', '.soga--tensa', '.bocadillo--abajo'],
    hoja: 'src/styles/sitio.css',
  },

  'analitica.ts': { sinTablero: 'la analitica de Vercel (D-56); pega un script y no toca el DOM visible' },
  'armar-cancionero.ts': { sinTablero: 'arma un HTML autocontenido que se descarga; sus estilos viajan adentro de ese archivo, no en las hojas del sitio' },
  'cancion.ts': { sinTablero: 'transportar y bajar solo en la ficha de un tema; no hay partida ni respuesta que senalar' },
  'compartir.ts': { sinTablero: 'el boton de compartir de tapa, letra y dos ejes (con la tarjeta fija de su identidad, D-57); sus tres clases son las de compartir de juego.css' },
  'correccion.ts': { sinTablero: 'el boton de correccion compartido; abre un formulario, no pinta estado de partida' },
  'diagnostico-audio.ts': { sinTablero: 'pantalla de medicion; sus reglas viven en el <style> de su propia pagina y la cubre la red derivada' },
  'lamina.ts': { sinTablero: 'pincel de canvas (US-08); dibuja pixeles, no crea nodos con clase' },
  'mosca.ts': { sinTablero: 'la mosca del portal (D-49); su unica clase, la de tomada a mano, vive en sitio.css y la cubre la red derivada' },
  'oktubre.ts': { sinTablero: 'la estampa del cumpleanos en el afiche de octubre (D-49); cambia un texto, no crea clases' },
  'oreja.ts': { sinTablero: 'la leyenda del dia en la portada de la Redondopedia (D-75); mueve un hidden, no crea nodos ni clases' },
  'rocola.ts': { sinTablero: 'la rocola de los recitales (D-72); un <audio> que suena en fila, no crea nodos' },
  'spotify.ts': { sinTablero: 'un <a> y nada mas, que es literalmente RQ-B2 de ADR-01' },
  'tarjeta.ts': { sinTablero: 'pincel de canvas (US-02 y US-07); dibuja pixeles, no crea nodos con clase' },
};

const esTablero = (i: Tablero | SinTablero): i is Tablero => 'estados' in i;

/** Las islas que hay en disco: lo unico del repo que llega al telefono de la gente. */
function islasEnDisco(): string[] {
  return readdirSync('src/scripts')
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .sort();
}

/** Lo que esta de un lado y no del otro. Aparte, para poder probarlo contra un caso falso. */
function faltantes(unos: readonly string[], otros: readonly string[]): string[] {
  return unos.filter((x) => !otros.includes(x));
}

test('el censo: no hay una isla que nadie haya declarado', () => {
  assert.deepEqual(
    faltantes(islasEnDisco(), Object.keys(ISLAS)),
    [],
    'hay islas sin declarar: abri `ISLAS` en este archivo y deci si pintan un tablero, o por que no',
  );
});

test('el censo tampoco deja declarada una isla que ya no existe', () => {
  // Una entrada fantasma no audita nada y ademas **miente sobre la cobertura**, que es peor
  // que el hueco declarado: el que lee la tabla cuenta quince y se queda tranquilo.
  assert.deepEqual(faltantes(Object.keys(ISLAS), islasEnDisco()), []);
});

test('ese censo sabe encontrar: se prueba contra una isla que nadie declaro', () => {
  // Un test que solo verifica ausencias no demuestra que sepa buscar. Las dos listas son
  // inventadas a proposito: mezclarlas con el disco ata el caso de prueba a que el nombre
  // inventado no exista nunca de verdad, y eso ya rompio una vez la prueba hermana de
  // `voz.test.ts` el dia que el intruso se creo para ver el auditor fallar.
  const enDisco = ['partida.ts', 'partida-skayboy.ts', 'tarjeta.ts'];
  const declaradas = ['partida.ts', 'tarjeta.ts'];
  assert.deepEqual(faltantes(enDisco, declaradas), ['partida-skayboy.ts']);
  assert.deepEqual(faltantes(declaradas, declaradas), []);
});

test('FIND-15, los siete tableros: toda clase de estado declarada tiene una regla que la pinta', () => {
  // El reemplazo de los cuatro pares escritos a mano. Mismo control, pero la lista de
  // tableros sale de `ISLAS`, y el censo de arriba garantiza que `ISLAS` este completa.
  const sinRegla: string[] = [];
  for (const [archivo, isla] of Object.entries(ISLAS)) {
    if (!esTablero(isla)) continue;
    const hoja = isla.hoja === undefined ? CSS : leer(isla.hoja);
    for (const clase of isla.estados) {
      if (!hoja.includes(clase)) sinRegla.push(`${archivo} (${isla.juego}): ${clase}`);
    }
  }
  assert.deepEqual(sinRegla, [], `clases creadas por el codigo y sin estilo:\n  ${sinRegla.join('\n  ')}`);
});

test('FIND-15 al reves: las clases que el CSS estila las crea de verdad su isla', () => {
  // El codigo arma varias con plantilla —`insignia--${clase}`, `tramo--${t}`— asi que
  // buscar la cadena completa daria falsos positivos. Se busca la **base**: si la isla no
  // menciona `tramo--` en ningun lado, las tres reglas de tramo son huerfanas.
  const huerfanas: string[] = [];
  for (const [archivo, isla] of Object.entries(ISLAS)) {
    if (!esTablero(isla)) continue;
    const bases = [
      ...new Set(isla.estados.map((c) => c.replace(/^\./, '').split('.').pop()!.replace(/--.*$/, '--'))),
    ];
    for (const base of bases) {
      if (!isla.fuente.includes(base)) {
        huerfanas.push(`${archivo} (${isla.juego}): el CSS estila "${base}..." y la isla no crea ninguna`);
      }
    }
  }
  assert.deepEqual(huerfanas, [], `\n  ${huerfanas.join('\n  ')}`);
});

/* ------------------------------------------------------------------
   La red derivada: lo que el par reciproco no puede ver
   ------------------------------------------------------------------ */

/**
 * Todo lo que puede pintar una clase: las cuatro hojas mas los `<style>` de las paginas.
 *
 * **Los `<style>` no son un detalle**: `diagnostico-audio.ts` crea `dg--ok` y `dg--mal`, y
 * esas reglas viven adentro de `src/pages/diagnostico-audio.astro`, no en `src/styles/`. Un
 * auditor que mirara solo las hojas las daria por huerfanas y estaria mintiendo.
 *
 * Se recorta el `<style>` en vez de leer la pagina entera, y es a proposito: si entrara el
 * marcado, una clase **nombrada** en el HTML contaria como clase **pintada**, que es
 * exactamente lo contrario de lo que este test mide.
 */
function todoElCss(): string {
  let css = readdirSync('src/styles')
    .filter((f) => f.endsWith('.css'))
    .map((f) => leer(`src/styles/${f}`))
    .join('\n');
  const paginas: string[] = [];
  const recorrer = (dir: string): void => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const completa = join(dir, entrada.name);
      if (entrada.isDirectory()) recorrer(completa);
      else if (entrada.name.endsWith('.astro')) paginas.push(completa);
    }
  };
  recorrer('src');
  for (const pagina of paginas) {
    for (const bloque of leer(pagina).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) css += '\n' + bloque[1];
  }
  return css;
}

/** Saca los comentarios: un `foo--bar` nombrado en prosa no es una clase que el codigo cree. */
function sinComentarios(fuente: string): string {
  return fuente.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

/**
 * Las clases modificadoras que una isla **crea de verdad**, leidas de sus literales.
 *
 * Solo mira adentro de comillas y plantillas, porque una clase nace de un literal siempre. Y
 * las que se arman con plantilla quedan como la base —`sello--`—, que es exactamente lo que
 * el par reciproco ya sabe buscar.
 *
 * El `(?<![\w-])` es el que evita el falso positivo caro: sin el, el `--marca-rojo` de un
 * `getPropertyValue()` entraria como si fuera una clase.
 */
function modificadores(fuente: string): string[] {
  const encontrados = new Set<string>();
  for (const m of sinComentarios(fuente).matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)) {
    const literal = m[1] ?? m[2] ?? m[3] ?? '';
    for (const clase of literal.matchAll(/(?<![\w-])([a-z][a-z0-9-]*?--[a-z0-9-]*)/g)) {
      encontrados.add(clase[1]!);
    }
  }
  return [...encontrados].sort();
}

test('ninguna isla crea una clase modificadora que ninguna hoja pinte', () => {
  /*
   * La red que el par reciproco no puede tender, porque el par audita **lo declarado** y
   * esto audita **lo que hay**. Las dos que encontro el dia que se escribio estaban vivas
   * desde hacia ciclos, y las dos eran invisibles para las listas a mano:
   *
   *  · `estampa--clave` en `partida-tema.ts`: la figura de la revelacion se marcaba cuando
   *    el jugador fallaba, y ninguna hoja la pintaba.
   *  · `rotulo--victoria` / `--derrota` / `--retirada` en `partida.ts`: el rotulo del
   *    desenlace del quiz, igual.
   *
   * Las dos se sacaron en vez de pintarlas, y el motivo es el circuito de
   * `.claude/rules/diseno-marca.md`: darles tinta es una decision que empieza en el lienzo,
   * no en un test. Sacar un gancho que no pinta nada no mueve un solo pixel; inventarle un
   * color lo moveria, y por la puerta de atras.
   */
  const CSS_TODO = todoElCss();
  const sueltas: string[] = [];
  for (const archivo of islasEnDisco()) {
    for (const clase of modificadores(leer(`src/scripts/${archivo}`))) {
      if (!CSS_TODO.includes(`.${clase}`)) sueltas.push(`${archivo}: .${clase}`);
    }
  }
  assert.deepEqual(
    sueltas,
    [],
    `clases que una isla crea y ninguna hoja pinta:\n  ${sueltas.join('\n  ')}`,
  );
});

test('esa red sabe encontrar: se prueba contra fuentes inventadas', () => {
  // Un test que solo verifica ausencias no demuestra que sepa buscar.
  assert.deepEqual(modificadores(`const f = el('div', 'ficha ficha--rota');`), ['ficha--rota']);
  // La plantilla queda en la base, que es lo que el par reciproco busca.
  assert.deepEqual(modificadores('const s = el("p", `sello sello--${tipo}`);'), ['sello--']);
  // Un nombre en un comentario no es una clase que el codigo cree.
  assert.deepEqual(modificadores('// ya no existe ficha--rota\nconst x = 1;'), []);
  assert.deepEqual(modificadores('/* ficha--rota se saco en el ciclo 9 */\nconst x = 1;'), []);
  // Y una variable de CSS no es una clase: el falso positivo que el lookbehind evita.
  assert.deepEqual(modificadores(`getComputedStyle(d).getPropertyValue('--marca-rojo');`), []);
  // El caso entero, contra una clase que ninguna hoja tiene.
  assert.deepEqual(modificadores(`el('div', 'pieza pieza--que-nadie-pinta');`), ['pieza--que-nadie-pinta']);
  assert.ok(!todoElCss().includes('.pieza--que-nadie-pinta'), 'el caso de prueba dejo de ser inventado');
});

/* ------------------------------------------------------------------
   La pantalla completa de Skayboy y Poligirl (`ADR-10`, `UX-33 §1`, `T-301`)
   ------------------------------------------------------------------ */

/**
 * Las reglas de una hoja, sin comentarios y con los `@media` abiertos: el cuerpo no puede tener
 * una llave, asi que el encabezado de un `@media` nunca se toma por selector de lo que envuelve.
 */
function reglas(css: string): Array<{ selector: string; cuerpo: string }> {
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
  return [...limpio.matchAll(/([^{};]+)\{([^{}]*)\}/g)].map((m) => ({
    selector: m[1]!.trim().replace(/"/g, "'").replace(/\s+/g, ' '),
    cuerpo: m[2]!.replace(/\s+/g, ' '),
  }));
}

const MODO = "[data-pantalla='completa']";

/**
 * Lo que `ADR-10.1` le pide a la hoja en el modo, en castellano. Vacio es sano.
 *
 * Son reglas de comportamiento, no de estetica: que la pagina no se desplace ni rebote, y que
 * ningun gesto que arranque adentro del fichin sea del navegador. Es la mitad del criterio 6 de
 * `US-09` enmendado por `D-47` —"ningun gesto de juego mueve la pagina"— y la unica mitad que
 * una maquina puede leer. La otra la mira el telefono.
 */
function problemasDelModo(css: string): string[] {
  const todas = reglas(css);
  const problemas: string[] = [];
  const del = (pedazo: string) => todas.filter((r) => r.selector.includes(MODO) && r.selector.includes(pedazo));

  const contenedor = del('.fichin').filter((r) => /\.fichin$/.test(r.selector));
  const cuerpoContenedor = contenedor.map((r) => r.cuerpo).join(' ');
  for (const [decl, porque] of [
    [/touch-action:\s*none/, 'touch-action: none: sin esto un gesto de juego desplaza o hace zoom (US-09 criterio 6)'],
    [/position:\s*fixed/, 'position: fixed: el fichin no queda clavado a la ventana'],
    [/inset:\s*0/, 'inset: 0: el fichin no ocupa la ventana entera'],
    [/(?<!-)user-select:\s*none/, 'user-select: none: el dedo que se corre selecciona texto'],
    [/-webkit-touch-callout:\s*none/, '-webkit-touch-callout: none: el toque largo abre la lupa de Safari'],
  ] as const) {
    if (!decl.test(cuerpoContenedor)) problemas.push(`el contenedor del modo sin ${porque}`);
  }

  const raiz = todas.filter((r) => r.selector.split(',').some((s) => s.trim() === `html${MODO}`));
  const cuerpo = todas.filter((r) => r.selector.split(',').some((s) => s.trim() === `${MODO} body`));
  for (const [nombre, rs] of [
    ['html', raiz],
    ['body', cuerpo],
  ] as const) {
    const texto = rs.map((r) => r.cuerpo).join(' ');
    if (!/overflow:\s*hidden/.test(texto)) problemas.push(`${nombre} sin overflow: hidden en el modo: la pagina se desplaza abajo del juego`);
    if (!/overscroll-behavior:\s*none/.test(texto)) {
      problemas.push(`${nombre} sin overscroll-behavior: none en el modo: tirar para abajo recarga en medio del nivel`);
    }
  }

  // **El pie de homenaje no se va de la ventana** (`BR-26`, `UX-33 §1.7`). La revision de la
  // primera entrega lo encontro afuera: con `1fr` a secas, la fila de la sala no bajaba de lo
  // que median las teclas (340 con su aire), y a 812 x 354 o 568 x 320 empujaba el pie abajo
  // del borde. Hacen falta las dos mitades: que la fila pueda bajar de su contenido, y que el
  // mando entonces ceda adentro de ella —el salto, con piso en `--toque-min`— en vez de salirse.
  // Esto es lo que se lee; lo medido en el navegador va en el reporte de `T-301`.
  if (!/grid-template-rows:\s*minmax\(\s*0\s*,/.test(cuerpoContenedor)) {
    problemas.push('la fila de la sala sin minmax(0, ...): crece por las teclas y empuja el pie de homenaje afuera de la ventana (BR-26)');
  }
  const mando = del('.mando')
    .filter((r) => /\.mando$/.test(r.selector))
    .map((r) => r.cuerpo)
    .join(' ');
  if (!/(?<![\w-])height:\s*min\([^;]*100%/.test(mando)) {
    problemas.push('el mando del modo sin tope de alto en la sala: en una ventana baja las teclas se salen por arriba o tapan el pie');
  }
  if (!/grid-template-rows:\s*minmax\(\s*var\(--toque-min\)/.test(mando)) {
    problemas.push('el salto del modo sin piso en --toque-min: al ceder alto no puede quedar mas chico que un dedo');
  }

  // Las cuatro propiedades del encuadre las lee solo el modo (`ADR-10.1`, `ADR-10.6`).
  for (const r of todas) {
    if (/var\(--encuadre-/.test(r.cuerpo) && !r.selector.split(',').every((s) => s.includes(MODO))) {
      problemas.push(`«${r.selector}» lee el encuadre afuera del modo: el mueble de D-41 no cambia (ADR-10.1)`);
    }
  }
  return problemas;
}

const SKAYBOY = leer('src/styles/skayboy.css');

test('ADR-10.1: en el modo la pagina no se mueve y ningun gesto del fichin es del navegador', () => {
  assert.deepEqual(problemasDelModo(SKAYBOY), []);
});

/**
 * **En la computadora no hay botones en pantalla, y en el teléfono sí** (`D-55`). Los botones
 * del mando se esconden solo bajo `(hover: hover) and (pointer: fine)`: una regla que los
 * escondiera afuera de ese corte dejaría a un teléfono sin forma de jugar. Y la leyenda que
 * los reemplaza nace escondida, para que el teléfono no la muestre al lado de los botones.
 */
/** Parte la hoja en lo que está adentro de los bloques "hay mouse" y lo que queda afuera. */
function partirPorMouse(css: string): { conMouse: string; sinMouse: string } {
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
  let conMouse = '';
  let sinMouse = '';
  let desde = 0;
  for (const m of limpio.matchAll(/@media \(hover: hover\) and \(pointer: fine\)(?: and \(not \(any-pointer: coarse\)\))? \{/g)) {
    let nivel = 1;
    let i = m.index! + m[0].length;
    const inicio = i;
    while (nivel > 0 && i < limpio.length) {
      if (limpio[i] === '{') nivel++;
      else if (limpio[i] === '}') nivel--;
      i++;
    }
    sinMouse += limpio.slice(desde, m.index);
    conMouse += limpio.slice(inicio, i - 1) + '\n';
    desde = i;
  }
  sinMouse += limpio.slice(desde);
  return { conMouse, sinMouse };
}

function botonesSinMouse(css: string): string[] {
  const { conMouse, sinMouse } = partirPorMouse(css);
  const problemas: string[] = [];
  const escondeBotones = (r: { selector: string; cuerpo: string }) =>
    /\.mando > \.tecla|\.mando-piso/.test(r.selector) && /display:\s*none/.test(r.cuerpo);
  if (!reglas(conMouse).some(escondeBotones)) problemas.push('con mouse los botones del mando siguen a la vista');
  if (reglas(sinMouse).some(escondeBotones)) problemas.push('los botones se esconden también sin mouse');
  const leyendaBase = reglas(sinMouse).find((r) => r.selector === '.juego-skayboy .mando-leyenda');
  if (!leyendaBase || !/display:\s*none/.test(leyendaBase.cuerpo)) problemas.push('la leyenda de teclas no nace escondida en el teléfono');
  return problemas;
}

test('D-55: con mouse no hay botones de Skayboy en pantalla; sin mouse, sí', () => {
  assert.deepEqual(botonesSinMouse(SKAYBOY), []);
  // Las letras de la leyenda salen del mismo mapa que aprieta los botones.
  const pagina = leer('src/pages/juegos/skayboy-y-poligirl.astro');
  assert.match(pagina, /teclaDelBoton\(lado, cual\)\?\.etiqueta/);
  assert.match(pagina, /class="mando-leyenda"/);
});

test('ese control sabe encontrar: los botones escondidos para todos', () => {
  const roto = SKAYBOY + '\n.juego-skayboy .mando > .tecla { display: none; }';
  assert.ok(botonesSinMouse(roto).some((p) => p.includes('sin mouse')));
});

test('ese control sabe encontrar: los botones a la vista con mouse', () => {
  const roto = SKAYBOY.replace(/\.juego-skayboy \.mando > \.tecla,\s*\.juego-skayboy \.mando-piso \{\s*display: none;/, '.juego-skayboy .mando-nada {');
  assert.notEqual(roto, SKAYBOY, 'el reemplazo no encontró la regla');
  assert.ok(botonesSinMouse(roto).some((p) => p.includes('siguen a la vista')));
});

/**
 * **Las capas de `D-61` encima del area** (`UX-37` §2, la enmienda de `ADR-10.5`): el rotulo de
 * entrada no toma toques —el primer dedo del nivel es del mando—, y el menu desplaza por dentro sin
 * arrastrar la pagina (el defecto que motivo `D-47`).
 */
test('D-61: el rótulo de entrada no toma toques, y el menú desplaza por dentro', () => {
  const rotulo = reglas(SKAYBOY).find((r) => r.selector === '.juego-skayboy .rotulo-nivel');
  assert.ok(rotulo && /pointer-events:\s*none/.test(rotulo.cuerpo), 'el rotulo de entrada se come el primer toque del nivel');
  const menu = reglas(SKAYBOY).find((r) => r.selector === '.juego-skayboy .menu-juego');
  assert.ok(
    menu && /overflow-y:\s*auto/.test(menu.cuerpo) && /overscroll-behavior:\s*contain/.test(menu.cuerpo),
    'el menu no desplaza por dentro, o arrastra la pagina',
  );
});

test('ese control sabe encontrar: el rótulo que toma toques', () => {
  const roto = SKAYBOY.replace(/(\.juego-skayboy \.rotulo-nivel \{[^}]*?)pointer-events: none;/, '$1');
  assert.notEqual(roto, SKAYBOY, 'el reemplazo no encontro la regla');
  const rotulo = reglas(roto).find((r) => r.selector === '.juego-skayboy .rotulo-nivel');
  assert.ok(rotulo && !/pointer-events:\s*none/.test(rotulo.cuerpo));
});

test('ADR-10.6: el modo lo lee solo skayboy.css', () => {
  // Un segundo lugar que lee el atributo es una segunda verdad sobre que es el modo.
  const otras = HOJAS.filter((h) => h !== 'src/styles/skayboy.css' && leer(h).includes('data-pantalla'));
  assert.deepEqual(otras, []);
});

for (const [caso, roto, espera] of [
  ['🔴 sin touch-action: none en el contenedor', SKAYBOY.replace(/(\.fichin \{[^}]*?)touch-action: none;/, '$1'), 'touch-action'],
  // La columna de mando tambien lo declara desde `D-61`: el que se saca es el del contenedor del modo.
  ['🔴 sin el callout de Safari', SKAYBOY.replace(/(\[data-pantalla='completa'\] \.juego-skayboy \.fichin \{[^}]*?)-webkit-touch-callout: none;/, '$1'), 'touch-callout'],
  ['🔴 sin overflow: hidden en html y body', SKAYBOY.replace(/overflow: hidden;\n  overscroll-behavior: none;/, 'overscroll-behavior: none;'), 'overflow: hidden'],
  ['🔴 con la pagina que rebota', SKAYBOY.replace(/overflow: hidden;\n  overscroll-behavior: none;/, 'overflow: hidden;'), 'overscroll-behavior'],
  ['🔴 con el encuadre leido en el mueble', SKAYBOY + '\n.juego-skayboy #juego { width: var(--encuadre-ancho); }', 'afuera del modo'],
  [
    '🔴 con la fila de la sala en 1fr a secas',
    SKAYBOY.replace('grid-template-rows: minmax(0, 1fr) auto;', 'grid-template-rows: 1fr auto;'),
    'pie de homenaje',
  ],
  ['🔴 con el mando sin tope de alto', SKAYBOY.replace(/(\.mando \{[^}]*?)height: min\([^;]*;/, '$1'), 'sin tope de alto'],
  [
    '🔴 con el salto sin piso',
    SKAYBOY.replace('grid-template-rows: minmax(var(--toque-min), var(--salto-alto))', 'grid-template-rows: minmax(0, var(--salto-alto))'),
    '--toque-min',
  ],
] as const) {
  test(`ese control sabe encontrar: ${caso}`, () => {
    assert.notEqual(roto, SKAYBOY, 'el caso no rompio nada: el reemplazo no encontro lo que buscaba');
    const problemas = problemasDelModo(roto);
    assert.ok(problemas.some((p) => p.includes(espera)), `tenia que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`);
  });
}

/**
 * **Medio transparente, y se lee igual** (`UX-33 §1.4`). El relleno de las teclas y del sello
 * es `--fondo` con el alfa bajado, mezclado con `color-mix` —tinta plana, nunca desenfoque—, y
 * lo que va encima (la figura, la palabra) es `--papel`, opaco. Debajo puede haber cualquiera
 * de las tintas del area, asi que se mide el **peor compuesto posible**: el relleno apoyado
 * sobre la tinta mas clara que el area puede tener. Si la palabra del sello llega a 4,5:1 ahi,
 * llega en cualquier nivel. Mismo mecanismo que el velo de tapa en `contraste.test.ts`.
 */
function luminancia(hex: string): number {
  const [r, g, b] = rgbDeHex(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
}

/** El porcentaje de `--fondo` en un relleno, o `undefined` si el relleno no es esa mezcla. */
function alfaDelRelleno(css: string, relleno: string): number | undefined {
  const m = new RegExp(
    String.raw`${relleno}:\s*color-mix\(\s*in srgb\s*,\s*var\(--fondo\)\s+([\d.]+)%\s*,\s*transparent\s*\)`,
  ).exec(css);
  return m === null ? undefined : Number(m[1]) / 100;
}

/** El peor contraste de `--papel` sobre ese relleno, y sobre que tinta del area. */
function peorLectura(css: string, tokens: string, relleno: string): { razon: number; sobre: string } | string {
  const alfa = alfaDelRelleno(css, relleno);
  if (alfa === undefined) return 'el relleno no es color-mix(in srgb, var(--fondo) N%, transparent): tinta plana con alfa, y nada mas';
  const { valores } = leerDeclaraciones(tokens);
  const fondo = resolverToken(valores, '--fondo');
  const papel = resolverToken(valores, '--papel');
  if ('error' in fondo || 'error' in papel) return 'no se resuelven --fondo y --papel en tokens.css';
  const { tintas } = paletaDelArea(tokens);
  let peor: { razon: number; sobre: string } = { razon: Infinity, sobre: '' };
  for (const [nombre, hex] of tintas) {
    const f = rgbDeHex(fondo.hex);
    const debajo = rgbDeHex(hex);
    const mezcla = hexDeRgb(...([0, 1, 2].map((i) => Math.round(alfa * f[i]! + (1 - alfa) * debajo[i]!)) as [number, number, number]));
    const razon = contraste(papel.hex, mezcla);
    if (razon < peor.razon) peor = { razon, sobre: nombre };
  }
  return peor;
}

const TOKENS = leer('src/styles/tokens.css');

/** Cada relleno, lo que lleva encima y cuanto pide: la palabra 4,5 y la figura 3 (WCAG 1.4.11). */
const RELLENOS = [
  ['--sello-relleno', 'la palabra del sello', 4.5],
  ['--mando-relleno', 'la figura de las teclas', 3],
] as const;

test('UX-33 §1.4: el relleno medio transparente deja leer lo de encima sobre la tinta mas clara del area', () => {
  for (const [relleno, que, pide] of RELLENOS) {
    const peor = peorLectura(SKAYBOY, TOKENS, relleno);
    assert.ok(typeof peor !== 'string', `${relleno}: ${peor as string}`);
    assert.ok(peor.razon >= pide, `${que} sobre ${peor.sobre} da ${peor.razon.toFixed(2)}:1, y pide ${pide}`);
  }
});

test('UX-33 §1.4: el borde y la figura no llevan alfa; los dos anillos son el par de siempre', () => {
  const control = reglas(SKAYBOY).find(
    (r) => r.selector.includes(MODO) && r.selector.includes('.tecla') && r.cuerpo.includes('--mando-relleno'),
  );
  assert.ok(control, 'no hay regla del modo que le ponga el relleno a las teclas');
  assert.match(control.cuerpo, /border:\s*var\(--anillo\) solid var\(--papel\)/, 'el anillo de afuera no es --papel opaco');
  assert.match(control.cuerpo, /box-shadow:\s*inset 0 0 0 var\(--anillo\) var\(--fondo\)/, 'el anillo de adentro no es --fondo opaco y sin difuminar');
  const tinta = reglas(SKAYBOY).find((r) => r.selector.includes(MODO) && r.selector.includes('.tecla') && /(?<![\w-])color:/.test(r.cuerpo));
  assert.match(tinta?.cuerpo ?? '', /(?<![\w-])color:\s*var\(--papel\)/, 'la figura no es --papel');
});

for (const [caso, css, relleno, pide, espera] of [
  [
    '🔴 con las teclas casi transparentes',
    SKAYBOY.replace(/(--mando-relleno: color-mix\(in srgb, var\(--fondo\) )[\d.]+%/, '$130%'),
    '--mando-relleno',
    3,
    ':1 sobre',
  ],
  [
    '🔴 con el sello tan transparente como las teclas',
    SKAYBOY.replace(/(--sello-relleno: color-mix\(in srgb, var\(--fondo\) )[\d.]+%/, '$156%'),
    '--sello-relleno',
    4.5,
    ':1 sobre',
  ],
  [
    '🔴 con un gris elegido a ojo en vez de --fondo',
    SKAYBOY.replace(/(--sello-relleno: color-mix\(in srgb, )var\(--fondo\)/, '$1var(--texto-tenue)'),
    '--sello-relleno',
    4.5,
    'tinta plana',
  ],
] as const) {
  test(`ese control sabe encontrar: ${caso}`, () => {
    assert.notEqual(css, SKAYBOY, 'el caso no rompio nada');
    const peor = peorLectura(css, TOKENS, relleno);
    const dijo = typeof peor === 'string' ? peor : peor.razon >= pide ? '(nada)' : `da ${peor.razon.toFixed(2)}:1 sobre ${peor.sobre}`;
    assert.ok(dijo.includes(espera), `tenia que caer por «${espera}» y dijo: ${dijo}`);
  });
}

/**
 * **Ni vidrio ni desenfoque, en ninguna hoja** (`diseno-marca.md`, tabla anti-slop). `UX-33 §1.4`
 * lo pide por nombre para los controles medio transparentes, que es justo donde mas tienta: un
 * `backdrop-filter: blur()` hace legible cualquier cosa sobre cualquier fondo, y se ve como
 * todas las interfaces que genera una IA.
 */
function vidrios(css: string): string[] {
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
  return [...limpio.matchAll(/backdrop-filter\s*:|(?<![\w-])blur\s*\(/g)].map((m) => m[0]);
}

test('anti-slop: ni vidrio ni desenfoque en ninguna hoja', () => {
  const malas = HOJAS.flatMap((h) => vidrios(leer(h)).map((v) => `${h}: ${v}`));
  assert.deepEqual(malas, []);
});

test('ese control sabe encontrar: se prueba contra un vidrio inventado', () => {
  assert.deepEqual(vidrios('.tecla { backdrop-filter: blur(6px); }'), ['backdrop-filter:', 'blur(']);
  assert.deepEqual(vidrios('.tecla { filter: blur(2px); }'), ['blur(']);
  // Nombrado en un comentario no es un vidrio.
  assert.deepEqual(vidrios('/* sin blur(), sin backdrop-filter: */ .tecla { color: red; }'), []);
});

/**
 * **Ninguna fuente de un solo peso se pide en negrita.** Archivo Black, Oktubre Calco y la
 * firma fan vienen con un peso y nada más: un `font-weight: 700` sobre ellas no elige otra
 * fuente, le pide al navegador que la engorde a mano, y le come el ojo a la letra. El
 * `.primario` de `juego.css` ya lo decía en su comentario desde agosto; las copias locales de
 * "Adiviná el tema" y "Adiviná la tapa" lo volvían a pedir hasta el ciclo 16. Mira las hojas y
 * el `<style>` de cada página, regla por regla.
 */
function negritasFalsas(css: string): string[] {
  return reglas(css)
    .filter(
      (r) =>
        /font-family:\s*var\(--fuente-(rotulada|titular|marca-firma|lobo-suelto|luzbelito|disco)[),]/.test(r.cuerpo) &&
        /font-weight:\s*(bold|bolder|[5-9]00)\b/.test(r.cuerpo),
    )
    .map((r) => r.selector);
}

test('ninguna fuente de un solo peso se pide en negrita', () => {
  assert.deepEqual(negritasFalsas(todoElCss()), []);
});

/**
 * **La negrita falsa que nadie pedía** (`D-54`). El control de arriba mira lo que se pide
 * por escrito; un `h1` la pide solo, porque el navegador lo pone en negrita por defecto. Los
 * ocho títulos de juego iban en la rotulada sin decir nada del peso, y el navegador la
 * engordaba a mano en los ocho. El título se declara en peso normal, una sola vez, y las
 * páginas no lo reescriben.
 */
test('el título de los juegos pide la letra de la banda en su peso: no hereda la negrita del h1 (D-65)', () => {
  const titulo = reglas(leer('src/styles/juego.css')).find((r) => r.selector === '.pantalla > h1');
  assert.ok(titulo, 'no existe la regla única del título de los juegos (.pantalla > h1)');
  // Desde `D-65` va en Patricio Rey Fan, con las tildes derivadas; antes, en la rotulada. Desde
  // `D-67`, los dos juegos cuyo disco tiene letra la traen de su variante (`--fuente-disco`).
  assert.match(titulo!.cuerpo, /font-family:\s*var\(--fuente-disco,\s*var\(--fuente-marca-firma\)\)/);
  assert.match(titulo!.cuerpo, /font-weight:\s*(normal|400)\b/);
  // Y ninguna página lo vuelve a escribir a mano: es como derivaron los ocho la primera vez.
  const conH1Propio = readdirSync('src/pages/juegos')
    .filter((f) => f.endsWith('.astro'))
    .map((f) => `src/pages/juegos/${f}`)
    .concat('src/pages/quiz.astro')
    .filter((p) => [...leer(p).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].some((b) => /(^|\s|\})h1\s*\{/.test(b[1]!.replace(/\/\*[\s\S]*?\*\//g, ''))));
  assert.deepEqual(conH1Propio, []);
});

/**
 * **La letra de pelo no se sella** (`D-67`). El título de cada juego lleva la sal de `D-64`,
 * que saca puntos enteros de la tinta. Sobre la rotulada o la letra de la banda no se nota;
 * sobre *Lobo suelto*, que es un trazo de pelo, se lleva trazos enteros. La variante que le pone
 * esa letra al título le saca la sal, y ninguna otra.
 */
test('la variante que escribe el título en Lobo suelto le saca la sal, y ninguna otra (D-67)', () => {
  const sello = reglas(leer('src/styles/juego.css')).find((r) => r.selector === '.pantalla h1');
  assert.ok(sello, 'no existe la regla de la sal del título (.pantalla h1)');
  assert.match(sello!.cuerpo, /(^|[;\s])mask-image:\s*var\(--sal-del-titulo,\s*var\(--textura-tinta-sal\)\)/);
  const variantes = reglas(leer('src/styles/sitio.css')).filter((r) => /--fuente-disco\s*:/.test(r.cuerpo));
  assert.equal(variantes.length, 2, 'el mapa de variantes tiene otra cantidad de letras de disco');
  for (const v of variantes) {
    const lobo = /--fuente-disco:\s*var\(--fuente-lobo-suelto\)/.test(v.cuerpo);
    const sinSal = /--sal-del-titulo:\s*none/.test(v.cuerpo);
    assert.equal(sinSal, lobo, `${v.selector}: ${lobo ? 'Lobo suelto sellado con sal' : 'sin sal y sin ser Lobo suelto'}`);
  }
});

test('ese control sabe encontrar: se prueba contra una negrita inventada', () => {
  assert.deepEqual(
    negritasFalsas('.primario { font-family: var(--fuente-rotulada); font-weight: 700; }'),
    ['.primario'],
  );
  // Las letras de disco tampoco tienen negrita, y la del título se pide por variable.
  assert.deepEqual(negritasFalsas('.n { font-family: var(--fuente-luzbelito); font-weight: bold; }'), ['.n']);
  assert.deepEqual(negritasFalsas('.t { font-family: var(--fuente-disco, var(--fuente-marca-firma)); font-weight: 700; }'), ['.t']);
  // La fuente del sistema sí tiene negrita de verdad: ahí el 700 está bien.
  assert.deepEqual(negritasFalsas('.micro { font-family: var(--fuente); font-weight: 700; }'), []);
  // Nombrada en un comentario no es una regla.
  assert.deepEqual(negritasFalsas('/* .x { font-family: var(--fuente-rotulada); font-weight: 700; } */'), []);
});

/**
 * **El piso de la letra en el test de dos ejes** (`UX-36` §8.4, `UX-38` §8, guarda G4). El plano
 * metió cuatro cuerpos chicos (polos, sellos y nombres de 12 a 12,8 px) en un recorte angosto,
 * y la palanca fácil cuando algo no entra es achicar la letra. Ninguna regla del bloque
 * `.ejes-*` pide menos de 0,75 rem (12 px), ni en `rem` ni en `px`.
 */
function letrasChicasDeEjes(css: string): string[] {
  return reglas(css)
    .filter((r) => r.selector.split(',').some((s) => s.trim().startsWith('.ejes-')))
    .filter((r) => {
      const m = /font-size:\s*([\d.]+)(rem|px)\b/.exec(r.cuerpo);
      if (!m) return false;
      const px = m[2] === 'rem' ? Number(m[1]) * 16 : Number(m[1]);
      return px < 12;
    })
    .map((r) => r.selector);
}

test('ninguna letra del test de dos ejes baja de 12 px', () => {
  assert.deepEqual(letrasChicasDeEjes(leer('src/styles/juego.css')), []);
});

test('ese control sabe encontrar: se prueba contra una letra de 11 px', () => {
  assert.deepEqual(letrasChicasDeEjes('.ejes-plano-nombre { font-size: 0.7rem; } .otra { font-size: 0.5rem; }'), ['.ejes-plano-nombre']);
  assert.deepEqual(letrasChicasDeEjes('.ejes-plano-polo, .x { font-size: 11px; }'), ['.ejes-plano-polo, .x']);
});
