/**
 * El auditor del motor (`ADR-08.8`, `T-247`): lee el fuente de la isla y falla si el motor
 * se usa de una manera que `ADR-08.2` prohíbe.
 *
 * Mismo mecanismo que `correccion/armar.test.ts`: barato, específico, y caza justo lo que una
 * revisión a ojo deja pasar. Son cinco reglas, y **la quinta es distinta de las otras
 * cuatro**: las cuatro primeras vigilan que la isla **no llame** a algo; la quinta, que
 * **llame** a algo — el cierre del `AudioContext` que el motor construye sin preguntar
 * (`ADR-08.2.1`), con `backgroundAudio: true` para que el motor no lo reanude después. Es
 * la única donde la ausencia de código es el defecto, y por eso es la más fácil de perder.
 *
 * Cada regla se ve en rojo contra un fuente inventado. Una guarda que nunca se vio en rojo
 * no es una guarda.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ISLA = 'src/scripts/partida-skayboy.ts';

/**
 * El fuente sin comentarios: una regla citada en un comentario no es una llamada.
 *
 * Se lee de izquierda a derecha, y lo que está adentro de un texto (`'…'`, `"…"`, `` `…` ``) o
 * de una expresión regular (`/…/`) **no abre un comentario**. Antes se borraba todo lo que
 * quedaba entre un literal `'/*'` y un literal `'*\/'`, y por ahí pasaba código entero sin que
 * ninguna regla lo viera (`FIND-77`, la revisión de `T-293`). Límite declarado: un `${…}` que
 * adentro tiene otra comilla invertida se lee mal; la isla no tiene ninguno.
 */
function sinComentarios(fuente: string): string {
  let salida = '';
  let i = 0;
  // Si una `/` acá abre una expresión regular: lo anterior no es un valor (`x / y`) sino algo
  // que espera uno (`(`, `=`, `,`, `return`…).
  const abreRegex = (): boolean => {
    const previo = salida.trimEnd();
    return previo === '' || /[(,=:[!&|?{};+\-*%<>~^]$/.test(previo) || /(?<![\w$])(return|typeof|case|in|of)$/.test(previo);
  };
  while (i < fuente.length) {
    const c = fuente[i]!;
    const d = fuente[i + 1];
    if (c === '/' && d === '/') {
      while (i < fuente.length && fuente[i] !== '\n') i++;
    } else if (c === '/' && d === '*') {
      const fin = fuente.indexOf('*/', i + 2);
      i = fin === -1 ? fuente.length : fin + 2;
      salida += ' ';
    } else if (c === "'" || c === '"' || c === '`' || (c === '/' && abreRegex())) {
      let j = i + 1;
      let clase = false;
      while (j < fuente.length) {
        const e = fuente[j]!;
        if (e === '\\') j++;
        else if (c === '/' && e === '[') clase = true;
        else if (c === '/' && e === ']') clase = false;
        else if (e === c && !clase) break;
        else if (e === '\n' && c !== '`') break;
        j++;
      }
      salida += fuente.slice(i, j + 1);
      i = j + 1;
    } else {
      salida += c;
      i++;
    }
  }
  return salida;
}

/** Los argumentos de cada `kaplay(...)`, con los paréntesis balanceados, y lo que sigue. */
function llamadasAlMotor(codigo: string): { opciones: string; despues: string }[] {
  const llamadas: { opciones: string; despues: string }[] = [];
  for (const m of codigo.matchAll(/\bkaplay\s*\(/g)) {
    let hondura = 1;
    let i = m.index + m[0].length;
    const desde = i;
    while (i < codigo.length && hondura > 0) {
      if (codigo[i] === '(') hondura++;
      else if (codigo[i] === ')') hondura--;
      i++;
    }
    llamadas.push({ opciones: codigo.slice(desde, i - 1), despues: codigo.slice(i) });
  }
  return llamadas;
}

/** Los problemas de ese fuente contra `ADR-08.2`, en castellano. Vacío es sano. */
function problemasDelMotor(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  const problemas: string[] = [];
  const llamadas = llamadasAlMotor(codigo);

  if (llamadas.length === 0) problemas.push('no hay ningún kaplay(): este auditor no está mirando nada');

  for (const { opciones, despues } of llamadas) {
    // 1. Nada colgado de `globalThis`.
    if (!/\bglobal\s*:\s*false\b/.test(opciones)) problemas.push('kaplay( sin global: false (ADR-08.2 punto 1)');
    // 2. El canvas es el del HTML.
    if (!/\bcanvas\b/.test(opciones)) problemas.push('kaplay( sin canvas: el motor crearía el suyo (ADR-08.2 punto 2, D-41)');
    // 4b. El inspector del motor también es texto.
    if (/\bdebug\s*:\s*true\b/.test(opciones)) problemas.push('debug: true dibuja texto en el canvas (ADR-08.2)');
    // 5b. Sin esto el motor le hace `suspend()`/`resume()` al contexto cerrado cada vez que
    // la pestaña se esconde y vuelve, y cada vuelta es un error sin atrapar. Medido en el
    // navegador el 2026-09-22: el cierre solo era la mitad del apagado.
    if (!/\bbackgroundAudio\s*:\s*true\b/.test(opciones)) {
      problemas.push('kaplay( sin backgroundAudio: true: el motor reanuda el contexto cerrado (ADR-08.2.1)');
    }
    // 5. El cierre, **en la sentencia siguiente**, sincrónico (`ADR-08.2.1` condición 1).
    const siguiente = /^\s*\)?\s*;\s*void\s+[\w$]+\.audioCtx\.close\(\)\s*;/.test(despues);
    if (!siguiente) {
      problemas.push('falta `void k.audioCtx.close()` en la línea siguiente a kaplay( (ADR-08.2.1)');
    }
  }

  // 3. Cero API de audio del motor: todo lo que suena sale del contexto del sitio.
  for (const [patron, nombre] of [
    [/\.play\s*\(/, 'play('],
    [/\bloadSound\s*\(/, 'loadSound('],
    [/\bloadMusic\s*\(/, 'loadMusic('],
    [/\.volume\s*\(/, 'volume('],
    [/\.burp\s*\(/, 'burp('],
    [/\bburp\s*:\s*true\b/, 'burp: true'],
  ] as const) {
    if (patron.test(codigo)) problemas.push(`usa la API de audio del motor: ${nombre} (ADR-08.2 punto 3)`);
  }

  // 4. Cero texto adentro del canvas, con cualquier fuente (`D-18`, `D-41` punto 2).
  for (const [patron, nombre] of [
    [/\.text\s*\(/, 'text('],
    [/\bdrawText\s*\(/, 'drawText('],
    [/\bdrawFormattedText\s*\(/, 'drawFormattedText('],
    [/\bformatText\s*\(/, 'formatText('],
    [/\bloadFont\s*\(/, 'loadFont('],
    [/\bloadBitmapFont\s*\(/, 'loadBitmapFont('],
  ] as const) {
    if (patron.test(codigo)) problemas.push(`dibuja texto en el canvas: ${nombre} (ADR-08.2 punto 4)`);
  }

  // 2b. Ningún canvas nuevo, por ningún camino.
  if (/createElement\(\s*['"]canvas['"]\s*\)/.test(codigo)) {
    problemas.push('crea un <canvas>: el área es el que ya está en el HTML (D-41 punto 3)');
  }
  return problemas;
}

test('la isla de verdad cumple los cinco apagados de ADR-08.2', () => {
  assert.deepEqual(problemasDelMotor(readFileSync(ISLA, 'utf8')), []);
});

/** Un fuente sano de referencia. Cada caso de abajo lo rompe en un solo lugar. */
const SANO = `
  const k = kaplay({ global: false, canvas, backgroundAudio: true, width: 240, height: 144 });
  void k.audioCtx.close();
  k.onDraw(() => k.drawRect({ pos: k.vec2(0, 0), width: 1, height: 1 }));
`;

test('control: el fuente de referencia está sano, si no los rojos de abajo no prueban nada', () => {
  assert.deepEqual(problemasDelMotor(SANO), []);
});

for (const [caso, roto, espera] of [
  ['sin global: false', SANO.replace('global: false, ', ''), 'global: false'],
  ['con global: true', SANO.replace('global: false', 'global: true'), 'global: false'],
  ['sin canvas', SANO.replace('canvas, ', ''), 'canvas'],
  ['con debug: true', SANO.replace('height: 144', 'height: 144, debug: true'), 'debug'],
  ['🔴 sin backgroundAudio: true', SANO.replace('backgroundAudio: true, ', ''), 'backgroundAudio'],
  ['🔴 sin el cierre del audio', SANO.replace('void k.audioCtx.close();', ''), 'audioCtx.close'],
  [
    '🔴 con el cierre tarde, después de otra sentencia',
    SANO.replace('void k.audioCtx.close();', 'k.setGravity(0);\n  void k.audioCtx.close();'),
    'audioCtx.close',
  ],
  [
    '🔴 con el cierre adentro de un then',
    SANO.replace('void k.audioCtx.close();', 'k.onLoad(() => { void k.audioCtx.close(); });'),
    'audioCtx.close',
  ],
  ['con un sonido del motor', SANO + 'k.play("salto");', 'audio'],
  ['cargando un sonido', SANO + 'k.loadSound("s", "/s.mp3");', 'audio'],
  ['con texto en el canvas', SANO + 'k.add([k.text("hola")]);', 'texto'],
  ['cargando una fuente', SANO + 'k.loadFont("f", "/f.ttf");', 'texto'],
  ['creando un canvas', SANO + 'document.createElement("canvas");', '<canvas>'],
] as const) {
  test(`el auditor sabe encontrar: ${caso}`, () => {
    const problemas = problemasDelMotor(roto);
    assert.ok(
      problemas.some((p) => p.includes(espera)),
      `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`,
    );
  });
}

test('una regla citada en un comentario no es una llamada', () => {
  const comentado = SANO + '\n// nunca k.play("x") acá\n/* ni k.text("y") */';
  assert.deepEqual(problemasDelMotor(comentado), []);
});
/**
 * ## El paso fijo (`ADR-09.1`, `T-267`): lo que la máquina prueba es lo que corre en el teléfono
 *
 * No es un apagado del motor, pero vive acá porque es el mismo mecanismo: leer el fuente de la
 * isla, que es lo único que no se puede cargar en Node. La traza grabada de cada nivel se juega
 * en el build con `paso(…, CUADRO_SEG)`; si la isla le pasa otra cosa —el `k.dt()` del motor,
 * que tiembla tic a tic—, cada salto integra con otro subpaso y la traza ganadora pasa a ser una
 * afirmación sobre un juego parecido.
 *
 * **El tic entero vive en `mundo.ts`** (`crearReloj()` y `jugarTic()`), y `mundo.test.ts` lo
 * juega: el reloj arranca en la fase, se queda con lo que sobró, juega los cuadros del reparto y
 * ninguno más, y cada cuadro es un `paso(…, CUADRO_SEG)`. Así cada línea del acumulador se ve en
 * rojo en Node. Lo que queda para este auditor es que **la isla no toque el tiempo por su
 * cuenta**, y eso son cinco reglas:
 *
 * 1. **la isla no llama a `paso(` ni a `repartirEnCuadros(`**: el único camino del tiempo al
 *    mundo es `jugarTic(`;
 * 2. **hay un solo `jugarTic(`, y su cuarto argumento es `k.dt()`**, escrito así: ni un `1 / 60`
 *    a mano —que dejaría a la isla jugando un cuadro por tic, al doble en una pantalla de 120 Hz
 *    y a la mitad en una de 30—, ni `k.dt()` estirado, ni nada;
 * 3. **su primer argumento es un reloj de `crearReloj()`**, declarado con `const` antes del
 *    `onUpdate(`: uno nuevo por tic es un reloj que nunca junta nada;
 * 4. **la isla no nombra `acumulado`**: el reloj no se toca desde afuera;
 * 5. y que exista el `jugarTic(`, porque un auditor que no encuentra nada no está mirando nada.
 */

/** Los argumentos de primer nivel de una llamada, desde el carácter que sigue a su paréntesis. */
function argumentos(codigo: string, desde: number): string[] {
  const partes: string[] = [];
  let hondura = 0;
  let inicio = desde;
  for (let i = desde; i < codigo.length; i++) {
    const c = codigo[i];
    if (c === '(' || c === '[' || c === '{') hondura++;
    else if (c === ')' || c === ']' || c === '}') {
      if (hondura === 0) {
        partes.push(codigo.slice(inicio, i));
        break;
      }
      hondura--;
    } else if (c === ',' && hondura === 0) {
      partes.push(codigo.slice(inicio, i));
      inicio = i + 1;
    }
  }
  return partes.map((p) => p.trim()).filter((p) => p !== '');
}

/** Los problemas de ese fuente contra el paso fijo de `ADR-09.1`, en castellano. Vacío es sano. */
function problemasDelPaso(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  const problemas: string[] = [];

  for (const prohibida of ['paso', 'repartirEnCuadros']) {
    if (new RegExp(`(?<![\\w$.])${prohibida}\\s*\\(`).test(codigo)) {
      problemas.push(`la isla llama a ${prohibida}( por su cuenta: el tiempo entra al mundo solo por jugarTic( (ADR-09.1)`);
    }
  }
  if (/(?<![\w$])acumulado(?![\w$])/.test(codigo)) {
    problemas.push('la isla nombra acumulado: el reloj lo lleva jugarTic(, no la isla (ADR-09.1)');
  }

  const tics = [...codigo.matchAll(/(?<![\w$.])jugarTic\s*\(/g)];
  if (tics.length === 0) problemas.push('no hay ningún jugarTic(: este auditor no está mirando nada');
  if (tics.length > 1) problemas.push(`hay ${tics.length} jugarTic(, y un tic del motor es uno solo`);

  const onUpdate = codigo.search(/(?<![\w$])onUpdate\s*\(/);
  for (const m of tics) {
    const args = argumentos(codigo, m.index + m[0].length);
    const dt = args[3];
    if (dt !== 'k.dt()') {
      problemas.push(`jugarTic( recibe «${dt ?? 'nada'}» de dt, y lo único que puede recibir es k.dt() (ADR-09.1)`);
    }
    const reloj = args[0] ?? '';
    const declaracion = /^[A-Za-z_$][\w$]*$/.test(reloj)
      ? new RegExp(`(?<![\\w$])const\\s+${reloj}\\s*=\\s*crearReloj\\s*\\(\\s*\\)`).exec(codigo)
      : null;
    if (declaracion === null) {
      problemas.push(
        `el reloj de jugarTic( («${reloj}») no es un const de crearReloj(): no arranca en la fase, o no guarda lo que sobra`,
      );
    } else if (onUpdate !== -1 && declaracion.index > onUpdate) {
      problemas.push(`el reloj «${reloj}» se crea después del onUpdate(: un reloj nuevo por tic nunca junta nada`);
    }
  }
  return problemas;
}

test('la isla de verdad corre a paso fijo: el tiempo del motor entra al mundo solo por jugarTic( (ADR-09.1)', () => {
  assert.deepEqual(problemasDelPaso(readFileSync(ISLA, 'utf8')), []);
});

/** Un fuente sano de referencia para el paso fijo. Cada caso de abajo lo rompe en un solo lugar. */
const SANO_PASO = `
  const mundo = crearMundo(banco, nivel);
  const reloj = crearReloj();
  k.onUpdate(() => {
    const ambos = { skayboy: s, poligirl: p };
    atender(jugarTic(reloj, mundo, ambos, k.dt()));
  });
`;

test('control: el fuente de referencia del paso fijo está sano', () => {
  assert.deepEqual(problemasDelPaso(SANO_PASO), []);
  // Una llamada citada en un comentario no cuenta, ni para bien ni para mal.
  assert.deepEqual(problemasDelPaso(SANO_PASO + '\n// antes era paso(mundo, m, k.dt()) con su acumulado'), []);
});

const TIC = 'atender(jugarTic(reloj, mundo, ambos, k.dt()));';

for (const [caso, roto, espera] of [
  ['🔴 con paso( de vuelta en la isla, con k.dt()', SANO_PASO.replace(TIC, 'atender(paso(mundo, ambos, k.dt()));'), 'paso('],
  [
    '🔴 con paso( de vuelta en la isla, aunque sea con CUADRO_SEG',
    SANO_PASO.replace(TIC, 'for (let i = 0; i < 1; i++) atender(paso(mundo, ambos, CUADRO_SEG));'),
    'paso(',
  ],
  [
    '🔴 con el acumulador de vuelta en la isla',
    SANO_PASO.replace(TIC, 'const r = repartirEnCuadros(reloj.resto, k.dt());'),
    'repartirEnCuadros(',
  ],
  ['🔴 con el cuadro escrito a mano en vez de k.dt()', SANO_PASO.replace('k.dt()));', '1 / 60));'), '«1 / 60»'],
  ['🔴 con k.dt() estirado', SANO_PASO.replace('k.dt()));', 'k.dt() * 2));'), '«k.dt() * 2»'],
  ['con jugarTic( de tres argumentos', SANO_PASO.replace(', k.dt()));', '));'), '«nada»'],
  ['🔴 con el reloj arrancando en cero', SANO_PASO.replace('crearReloj()', '{ acumulado: 0 }'), 'nombra acumulado'],
  ['🔴 con un reloj que no sale de crearReloj()', SANO_PASO.replace('crearReloj()', 'otroReloj()'), 'no es un const de crearReloj('],
  ['🔴 con un reloj nuevo en cada tic', SANO_PASO.replace('jugarTic(reloj,', 'jugarTic(crearReloj(),'), 'no es un const de crearReloj('],
  [
    '🔴 con el reloj creado adentro del tic',
    SANO_PASO.replace('  const reloj = crearReloj();\n', '').replace('const ambos', 'const reloj = crearReloj();\n    const ambos'),
    'después del onUpdate(',
  ],
  ['🔴 con el reloj tocado desde afuera', SANO_PASO.replace(TIC, `reloj.acumulado = 0;\n    ${TIC}`), 'nombra acumulado'],
  ['🔴 con dos tics por tic', SANO_PASO.replace(TIC, `${TIC}\n    ${TIC}`), 'hay 2 jugarTic('],
  ['sin ningún jugarTic(', SANO_PASO.replace(TIC, 'atender([]);'), 'no hay ningún jugarTic('],
] as const) {
  test(`el auditor del paso fijo sabe encontrar: ${caso}`, () => {
    const problemas = problemasDelPaso(roto);
    assert.ok(
      problemas.some((p) => p.includes(espera)),
      `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`,
    );
  });
}

/**
 * ## El dibujo sale de los atlas (`T-278`, `CTR-15`): ni tinta plana, ni un atlas sin versión
 *
 * Hasta `T-278` la isla pintaba el área con rectángulos de tinta plana leída de tokens del sitio
 * (`--texto-tenue`, `--acento-2`…), a la espera de los atlas. Los atlas llegaron y la tinta plana
 * se fue; estas reglas son para que no vuelva por la ventana —un `drawRect` "provisorio" para una
 * pieza nueva es exactamente cómo vuelve— y para que ningún atlas se pida sin la versión en el
 * nombre (`CTR-15.8`: Astro no le pone huella a `public/`, y un PNG repintado con el mismo nombre
 * se sirve viejo desde la caché).
 *
 * Qué se dibuja y en qué estado lo decide `escena.ts`, y lo juega `escena.test.ts` en Node. Lo que
 * queda para este auditor es lo que solo se ve en el fuente de la isla: **que la isla use esas
 * decisiones, y ninguna propia.**
 *
 * 1. **ninguna primitiva de tinta plana** —`drawRect`, `drawCircle`, `drawPolygon`… y los
 *    componentes `rect`, `circle`…—, **ni siquiera nombrada sin paréntesis** (un alias
 *    `const pintar = k.drawRect` o un `k['drawRect']` es el mismo rectángulo), **ni un sprite
 *    teñido** (`rgb(`, `color:`, `opacity:`): una variante de color es otro PNG (`CTR-15.6`), y el
 *    alfa es binario (`UX-27 §3`);
 * 2. **cada `drawSprite(` es un trazo de la escena**: lleva `frame: cuadroDelAtlas(` y
 *    `flipX: <trazo>.espejo`, y no se escala por su cuenta (ni `scale:`, ni `width:`, ni
 *    `height:`); y los trazos salen de `trazosDe(` **con sus dos argumentos** —sin el segundo, el
 *    cuadro que sigue a una vuelta no va de frente (`UX-29 §3`)—;
 * 3. **la única tinta que la isla lee de la hoja es `--px-luz`**, el aire (`UX-27 §1.1`), y el
 *    fondo del motor es **esa lectura, tal cual**: un `const` que es entero `leerTinta(…)` del aire,
 *    ni un arreglo, ni un `#hex`, ni el aire oscurecido con un `.map(`;
 * 4. **sin suavizado y con escala entera**: `crisp: true`, `texFilter: 'nearest'`, y `scale:` es un
 *    `const` que es entero `escalaCss()`, la que no devuelve más que enteros (`ADR-08.3` punto 5);
 * 5. **todo atlas con versión**: el argumento de cada `loadSprite(` y de cada `fetch(` es entero
 *    un `rutaDe(…)` —directo, o un `const` que lo es— o un literal `sprites/<pieza>.v<N>.<ext>`.
 *    Nada de post-procesar lo que devuelve `rutaDe(` (un `.replace(` le saca la versión), y la isla
 *    no nombra `CARPETA_DE_SPRITES`, que es con lo que se arma una ruta salteándose `rutaDe(`.
 *    Ningún literal nombra un archivo de `sprites/` sin versión. Y `fetch` y `loadSprite` **no se
 *    nombran sin llamarlos**: un alias (`const pedir = fetch`) es un `fetch(` que esta regla no
 *    ve, y por ahí sale un atlas sin versión (`FIND-77`).
 * 6. **el nivel que se juega en desarrollo** (`?nivel=`) se lee solo detrás de
 *    `import.meta.env.DEV ?`: en el build esa rama se va, y la dirección no elige nada. La
 *    condición es **entera** `import.meta.env.DEV`: lo que la precede abre una expresión (`=`,
 *    `(`, `,`, `:`, `?`, `=>`, `return`), nunca un `!` que la da vuelta ni un `||`, `&&` o `??`
 *    que la mezcla con otra cosa. Y la dirección es cualquier mención de `location` (también
 *    `document.location` y `window.location`), de `URL`, `documentURI` o `baseURI` que no sea
 *    `URL(` —así cae `document?.URL` y `{ URL: dir } = document`—, de `navigation` o
 *    `getEntriesByType` (la entrada de navegación trae la dirección), o un `searchParams`
 *    (`FIND-77`): fuera de la única lectura permitida, ninguna. Límites declarados: `history`
 *    y un nombre armado por partes (`w['loc' + 'ation']`) no se ven; un auditor de texto no
 *    sigue valores, y la isla no usa ninguno.
 */

/** Todos los literales de texto del código, con comillas simples, dobles o invertidas. */
function literales(codigo: string): string[] {
  return [...codigo.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)].map((m) => m[2] ?? '');
}

/** El índice del `)` que cierra la llamada cuyo primer argumento empieza en `desde`, o -1. */
function cierreDe(codigo: string, desde: number): number {
  let hondura = 1;
  for (let i = desde; i < codigo.length; i++) {
    if (codigo[i] === '(') hondura++;
    else if (codigo[i] === ')' && --hondura === 0) return i;
  }
  return -1;
}

/** Si la expresión es **entera** una llamada a `fn(`: nada antes, y nada después de su `)`. */
function esLlamadaEntera(expresion: string, fn: string): boolean {
  const e = expresion.trim();
  const m = new RegExp(`^${fn}\\s*\\(`).exec(e);
  return m !== null && cierreDe(e, m[0].length) === e.length - 1;
}

/** Con qué se declara `const nombre = …;`, hasta el `;` de primer nivel. */
function valorDeConst(codigo: string, nombre: string): string | undefined {
  const m = new RegExp(`(?<![\\w$])const\\s+${nombre}\\s*=\\s*`).exec(codigo);
  if (m === null) return undefined;
  let hondura = 0;
  for (let i = m.index + m[0].length; i < codigo.length; i++) {
    const c = codigo[i];
    if (c === '(' || c === '[' || c === '{') hondura++;
    else if (c === ')' || c === ']' || c === '}') hondura--;
    else if (c === ';' && hondura === 0) return codigo.slice(m.index + m[0].length, i).trim();
  }
  return undefined;
}

/** Un identificador, seguido una vez hasta su `const`: `ruta` → `rutaDe(…)`. Lo demás, tal cual. */
function resolver(codigo: string, expresion: string): string {
  const e = expresion.trim();
  return /^[A-Za-z_$][\w$]*$/.test(e) ? (valorDeConst(codigo, e) ?? e) : e;
}

const RUTA_CON_VERSION = /^\/?sprites\/[a-z][a-z0-9-]*\.v[1-9][0-9]*\.(png|json)$/;

/** Si esa expresión es una ruta de atlas con versión: entera `rutaDe(…)`, o un literal con versión. */
function rutaVersionada(codigo: string, expresion: string): boolean {
  const e = resolver(codigo, expresion);
  const literal = /^(['"`])(.*)\1$/.exec(e)?.[2];
  return esLlamadaEntera(e, 'rutaDe') || (literal !== undefined && RUTA_CON_VERSION.test(literal));
}

/** El valor de una opción de primer nivel del objeto de `kaplay(`, o `undefined` si no está. */
function opcion(opciones: string, nombre: string): string | undefined {
  const objeto = opciones.trim().replace(/^\{/, '').replace(/\}$/, '');
  for (const parte of argumentos(objeto + ')', 0)) {
    const m = new RegExp(`^${nombre}\\s*:\\s*([\\s\\S]*)$`).exec(parte);
    if (m) return m[1]!.trim();
  }
  return undefined;
}

/**
 * Las variables de la hoja que la isla lee o escribe y **no son tinta**: `--escala`, el entero
 * de `ADR-08.3` que reparte `UX-28 §2`; y desde `T-301` las del encuadre de la pantalla completa
 * (`ADR-10.4`): el bisel y el aire de las teclas, que la isla lee para armar la caja del área, y
 * las cuatro que escribe para que la hoja ubique el canvas. Una medida no pinta nada; cualquier
 * otro `--` sí, y sigue cayendo (el caso de `--texto-tenue`, abajo).
 */
const MEDIDAS = new Set([
  '--escala',
  '--bisel',
  '--tecla-aire',
  '--encuadre-ancho',
  '--encuadre-alto',
  '--encuadre-izquierda',
  '--encuadre-arriba',
]);

const PRIMITIVAS = /\b(draw(?:Rect|Circle|Ellipse|Polygon|Triangle|Lines?|Curve|Bezier|UVQuad))\b/g;
const COMPONENTES = /(?:\.\s*|\[\s*['"`])(rect|circle|ellipse|polygon)\b/g;

/** Los problemas de ese fuente contra el dibujo por atlas, en castellano. Vacío es sano. */
function problemasDelDibujo(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  const problemas: string[] = [];

  // 1. Tinta plana: primitivas de dibujo y componentes de forma, llamados o solo nombrados.
  for (const m of codigo.matchAll(PRIMITIVAS)) {
    problemas.push(`pinta tinta plana con ${m[1]}(: adentro del área todo es un cuadro de un atlas (T-278, CTR-15)`);
  }
  for (const m of codigo.matchAll(COMPONENTES)) {
    problemas.push(`pinta tinta plana con el componente ${m[1]}(: adentro del área todo es un cuadro de un atlas (T-278)`);
  }
  for (const [patron, nombre] of [
    [/(?<![\w$])rgb\s*\(/, 'rgb('],
    [/(?<![\w$])hsl2rgb\s*\(/, 'hsl2rgb('],
    [/(?<![\w$'"-])color\s*:/, 'color:'],
    [/(?<![\w$'"-])opacity\s*:/, 'opacity:'],
  ] as const) {
    if (patron.test(codigo)) {
      problemas.push(`tiñe o arma un color a mano con ${nombre}: una variante de color es otro PNG (CTR-15.6) y el alfa es binario (UX-27 §3)`);
    }
  }

  // 2. Que dibuje el atlas, y que cada sprite sea un trazo de la escena.
  const sprites = [...codigo.matchAll(/(?<![\w$])drawSprite\s*\(/g)];
  if (sprites.length === 0) problemas.push('no hay ningún drawSprite(: la isla no está dibujando los atlas');
  for (const m of sprites) {
    const dibujo = argumentos(codigo, m.index + m[0].length)[0] ?? '';
    if (!/\bframe\s*:\s*cuadroDelAtlas\s*\(/.test(dibujo)) {
      problemas.push('drawSprite( sin frame: cuadroDelAtlas(: el cuadro lo decide la escena, no la isla (T-278)');
    }
    if (!/\bflipX\s*:\s*[\w$]+\.espejo\b/.test(dibujo)) {
      problemas.push('drawSprite( sin flipX: <trazo>.espejo: el perfil que mira a la izquierda se dibujaría mirando a la derecha (UX-27 §7)');
    }
    for (const medida of ['scale', 'width', 'height']) {
      if (new RegExp(`\\b${medida}\\s*:`).test(dibujo)) {
        problemas.push(`drawSprite( con ${medida}: el sprite se escala por su cuenta, y la escala es una sola y entera (ADR-08.3)`);
      }
    }
  }
  const escenas = [...codigo.matchAll(/(?<![\w$.])trazosDe\s*\(/g)];
  if (escenas.length === 0) problemas.push('no hay ningún trazosDe(: la isla no dibuja la escena');
  for (const m of escenas) {
    const n = argumentos(codigo, m.index + m[0].length).length;
    if (n !== 2) problemas.push(`trazosDe( con ${n} argumento(s): sin deFrente, el cuadro que sigue a una vuelta no va de frente (UX-29 §3)`);
  }

  // 3. La única tinta de la hoja es el aire.
  const tokens = literales(codigo).filter((l) => /^--[a-z]/.test(l) && !MEDIDAS.has(l));
  for (const t of new Set(tokens)) {
    if (t !== '--px-luz') {
      problemas.push(`lee la tinta ${t} de la hoja: adentro del área dibuja el atlas, y la única tinta que se lee es el aire, --px-luz (UX-27 §1.1)`);
    }
  }
  if (!tokens.includes('--px-luz')) problemas.push('el aire no sale de --px-luz (UX-27 §1.1)');

  for (const { opciones } of llamadasAlMotor(codigo)) {
    const fondo = opcion(opciones, 'background');
    if (fondo === undefined) {
      problemas.push('kaplay( sin background: el aire es el fondo del motor (UX-27 §1.1)');
    } else if (/^(\[|['"`])/.test(fondo)) {
      problemas.push('el fondo del motor está escrito a mano: es el aire, y sale de --px-luz (UX-27 §1.1)');
    } else {
      const lectura = resolver(codigo, fondo);
      const aire = /^leerTinta\s*\(([\s\S]*)\)$/.exec(lectura)?.[1];
      const esElAire =
        esLlamadaEntera(lectura, 'leerTinta') && aire !== undefined && /^(['"`])--px-luz\1$/.test(resolver(codigo, aire));
      if (!esElAire) {
        problemas.push(`el fondo del motor es «${fondo}», y tiene que ser la lectura del aire tal cual, leerTinta('--px-luz') (UX-27 §1.1)`);
      }
    }
    // 4. Sin suavizado, y con escala entera.
    if (!/\bcrisp\s*:\s*true\b/.test(opciones)) problemas.push('kaplay( sin crisp: true: el canvas se suaviza al agrandar (ADR-08.3)');
    if (!/\btexFilter\s*:\s*['"]nearest['"]/.test(opciones)) {
      problemas.push("kaplay( sin texFilter: 'nearest': los atlas se muestrean con suavizado, y eso es barro (CTR-15.2)");
    }
    const escala = opcion(opciones, 'scale');
    if (escala === undefined || !esLlamadaEntera(resolver(codigo, escala), 'escalaCss')) {
      problemas.push(`kaplay( con scale «${escala ?? 'nada'}»: la escala es escalaCss(), entera, tal cual (ADR-08.3 punto 5)`);
    }
  }

  // 5. Todo atlas con versión en el nombre, y ninguna ruta armada a mano.
  const cargas = [...codigo.matchAll(/(?<![\w$])loadSprite(?:Atlas)?\s*\(/g)];
  if (cargas.length === 0) problemas.push('no hay ningún loadSprite(: la isla no carga los atlas');
  for (const m of cargas) {
    const ruta = argumentos(codigo, m.index + m[0].length)[1] ?? '';
    if (!rutaVersionada(codigo, ruta)) {
      problemas.push(`loadSprite( carga «${ruta || 'nada'}»: un atlas sin versión en el nombre se sirve viejo desde la caché (CTR-15.8); la ruta es rutaDe(…), entera`);
    }
  }
  for (const m of codigo.matchAll(/(?<![\w$])fetch\s*\(/g)) {
    const ruta = argumentos(codigo, m.index + m[0].length)[0] ?? '';
    if (!rutaVersionada(codigo, ruta)) {
      problemas.push(`fetch( pide «${ruta || 'nada'}»: la isla solo pide atlas, y un atlas sin versión en el nombre se sirve viejo desde la caché (CTR-15.8); la ruta es rutaDe(…), entera`);
    }
  }
  for (const m of codigo.matchAll(/(?<![\w$])(fetch|loadSprite(?:Atlas)?)(?![\w$])(?!\s*\()/g)) {
    problemas.push(`nombra ${m[1]} sin llamarlo: un alias es una carga que esta regla no ve, y por ahí sale un atlas sin versión (CTR-15.8)`);
  }
  if (/(?<![\w$])CARPETA_DE_SPRITES(?![\w$])/.test(codigo)) {
    problemas.push('nombra CARPETA_DE_SPRITES: una ruta armada con la carpeta se saltea rutaDe(, que es la que exige la versión (CTR-15.8)');
  }
  for (const l of literales(codigo)) {
    if (!/sprites\/|\.png\b/.test(l)) continue;
    if (!RUTA_CON_VERSION.test(l)) {
      problemas.push(`nombra «${l}», un archivo de sprites/ sin versión en el nombre (CTR-15.8)`);
    }
  }

  // 6. La dirección elige nivel solo en desarrollo.
  // Lo que precede a la condición abre una expresión: ni `!`, ni `||`, `&&` o `??` (FIND-77).
  const detrasDeDev =
    /(?:=>|(?<![=!<>])=(?!=)|(?<!\?)\?|[(,:[{;]|(?<![\w$])return)\s*import\.meta\.env\.DEV\s*\?\s*new\s+URLSearchParams\s*\(\s*location\.search\s*\)/g;
  const permitidas = [...codigo.matchAll(detrasDeDev)].length;
  // Cualquier mención cuenta, venga de donde venga (`document?.URL`, `(document).URL`,
  // `{ URL: dir } = document`, `document['URL']`), menos `URL(`: construir una dirección no es
  // leer la de la página (la revisión de `T-293`).
  const lecturas =
    [...codigo.matchAll(/(?<![\w$])location(?![\w$])/g)].length +
    [...codigo.matchAll(/(?<![\w$])(URL|documentURI|baseURI)(?![\w$])(?!\s*\()/g)].length +
    [...codigo.matchAll(/(?<![\w$])(navigation|getEntriesByType)(?![\w$])/g)].length;
  const parametros = [...codigo.matchAll(/(?<![\w$])(URLSearchParams|searchParams)(?![\w$])/g)].length;
  if (lecturas > permitidas || parametros > permitidas) {
    problemas.push('lee la dirección fuera de import.meta.env.DEV ?: en el build la dirección no elige nivel (T-278)');
  }
  return problemas;
}

test('la isla de verdad dibuja con los atlas: sin tinta plana, sin suavizado, y todo atlas con versión (T-278)', () => {
  assert.deepEqual(problemasDelDibujo(readFileSync(ISLA, 'utf8')), []);
});

/** Un fuente sano de referencia para el dibujo. Cada caso de abajo lo rompe en un solo lugar. */
const SANO_DIBUJO = `
  const AIRE = '--px-luz';
  const pedido = import.meta.env.DEV ? new URLSearchParams(location.search).get('nivel') : null;
  const aire = leerTinta(AIRE);
  const ruta = rutaDe(nombre, 'json');
  const respuesta = await fetch(ruta);
  const escala = escalaCss();
  const k = kaplay({ global: false, canvas, backgroundAudio: true, scale: escala, crisp: true, texFilter: 'nearest', background: aire });
  void k.audioCtx.close();
  const asset = k.loadSprite(null, rutaDe(nombre, 'png'), { sliceX: 4, sliceY: 5 });
  k.onDraw(() => {
    for (const t of trazosDe(mundo, deFrente)) {
      k.drawSprite({ sprite, frame: cuadroDelAtlas(json, t.estado, mundo.tiempo), pos: k.vec2(t.x, t.y), flipX: t.espejo });
    }
  });
`;

const DIBUJO = 'k.drawSprite({ sprite, frame: cuadroDelAtlas(json, t.estado, mundo.tiempo), pos: k.vec2(t.x, t.y), flipX: t.espejo });';
const CARGA = "k.loadSprite(null, rutaDe(nombre, 'png'), { sliceX: 4, sliceY: 5 })";
const RUTA_JSON = "const ruta = rutaDe(nombre, 'json');";

test('control: el fuente de referencia del dibujo está sano', () => {
  assert.deepEqual(problemasDelDibujo(SANO_DIBUJO), []);
  // Un literal con versión es tan bueno como rutaDe(.
  assert.deepEqual(problemasDelDibujo(SANO_DIBUJO.replace("rutaDe(nombre, 'png')", "'/sprites/skayboy.v2.png'")), []);
  // rutaDe( directo en el fetch(, sin const de por medio, también.
  assert.deepEqual(problemasDelDibujo(SANO_DIBUJO.replace('fetch(ruta)', "fetch(rutaDe(nombre, 'json'))")), []);
  // Y lo citado en un comentario no cuenta: ni la tinta plana de antes, ni una ruta sin versión.
  assert.deepEqual(
    problemasDelDibujo(SANO_DIBUJO + "\n// antes: k.drawRect({ color: k.rgb(1, 2, 3) }) con '--texto-tenue' y '/sprites/sala.png'"),
    [],
  );
});

for (const [caso, roto, espera] of [
  [
    '🔴 vuelve la tinta plana en lugar del atlas',
    SANO_DIBUJO.replace(DIBUJO, 'k.drawRect({ pos: k.vec2(0, 0), width: 16, height: 16, color: k.rgb(1, 2, 3) });'),
    'tinta plana con drawRect(',
  ],
  [
    '🔴 un rectángulo "provisorio" al lado del atlas',
    SANO_DIBUJO.replace(DIBUJO, `${DIBUJO} k.drawRect({ pos: k.vec2(0, 0), width: 6, height: 6 });`),
    'tinta plana con drawRect(',
  ],
  [
    '🔴 el rectángulo por un alias, sin paréntesis a la vista',
    SANO_DIBUJO.replace(DIBUJO, `${DIBUJO} const pintar = k.drawRect; pintar({ pos: k.vec2(0, 0), width: 6, height: 6 });`),
    'tinta plana con drawRect(',
  ],
  [
    "🔴 el rectángulo pedido por nombre, k['drawRect']",
    SANO_DIBUJO.replace(DIBUJO, `${DIBUJO} k['drawRect']({ pos: k.vec2(0, 0), width: 6, height: 6 });`),
    'tinta plana con drawRect(',
  ],
  ['🔴 el cuadro plano de UV, drawUVQuad', SANO_DIBUJO + 'k.drawUVQuad({ width: 16, height: 16 });', 'drawUVQuad('],
  ['🔴 una forma como componente', SANO_DIBUJO + 'k.add([k.rect(16, 16), k.pos(0, 0)]);', 'componente rect('],
  ["🔴 una forma como componente, k['rect']", SANO_DIBUJO + "k.add([k['rect'](16, 16)]);", 'componente rect('],
  ['🔴 un círculo', SANO_DIBUJO + 'k.drawCircle({ pos: k.vec2(8, 8), radius: 3 });', 'drawCircle('],
  ['🔴 sin ningún drawSprite(', SANO_DIBUJO.replace(DIBUJO, 'k.vec2(0, 0);'), 'ningún drawSprite('],
  ['🔴 el sprite teñido', SANO_DIBUJO.replace('flipX: t.espejo', 'flipX: t.espejo, color: k.rgb(255, 0, 0)'), 'tiñe'],
  ['🔴 el sprite a media opacidad', SANO_DIBUJO.replace('flipX: t.espejo', 'flipX: t.espejo, opacity: 0.5'), 'opacity:'],
  ['🔴 el sprite sin espejo', SANO_DIBUJO.replace(', flipX: t.espejo', ''), 'flipX'],
  ['🔴 el sprite siempre espejado', SANO_DIBUJO.replace('flipX: t.espejo', 'flipX: true'), 'flipX'],
  ['🔴 el sprite en un cuadro fijo', SANO_DIBUJO.replace('frame: cuadroDelAtlas(json, t.estado, mundo.tiempo)', 'frame: 0'), 'cuadroDelAtlas('],
  ['🔴 el sprite escalado por su cuenta', SANO_DIBUJO.replace('flipX: t.espejo', 'flipX: t.espejo, scale: 2'), 'con scale:'],
  ['🔴 la escena sin deFrente', SANO_DIBUJO.replace('trazosDe(mundo, deFrente)', 'trazosDe(mundo)'), 'trazosDe( con 1'],
  ['🔴 una tinta del sitio leída para pintar', SANO_DIBUJO + "const solido = leerTinta('--texto-tenue');", '--texto-tenue'],
  ['🔴 el aire sale de otra tinta', SANO_DIBUJO.replace("'--px-luz'", "'--fondo'"), 'no sale de --px-luz'],
  ['🔴 el fondo escrito a mano', SANO_DIBUJO.replace('background: aire', 'background: [237, 228, 206]'), 'escrito a mano'],
  ['🔴 el fondo como hex', SANO_DIBUJO.replace('background: aire', "background: '#ede4ce'"), 'escrito a mano'],
  [
    '🔴 el fondo es el aire oscurecido',
    SANO_DIBUJO.replace('const aire = leerTinta(AIRE);', 'const aire = leerTinta(AIRE).map((n) => n * 0.9);'),
    'lectura del aire tal cual',
  ],
  ['🔴 el fondo sale de otra variable', SANO_DIBUJO.replace('background: aire', 'background: sombra'), 'lectura del aire tal cual'],
  ['🔴 sin fondo', SANO_DIBUJO.replace(', background: aire', ''), 'sin background'],
  ['🔴 sin crisp', SANO_DIBUJO.replace('crisp: true, ', ''), 'crisp: true'],
  ["🔴 con texFilter: 'linear'", SANO_DIBUJO.replace("'nearest'", "'linear'"), 'texFilter'],
  ['🔴 sin texFilter', SANO_DIBUJO.replace("texFilter: 'nearest', ", ''), 'texFilter'],
  ['🔴 la escala no entera', SANO_DIBUJO.replace('scale: escala', 'scale: escala * 1.5'), 'escalaCss()'],
  ['🔴 la escala escrita a mano', SANO_DIBUJO.replace('scale: escala', 'scale: 3'), 'escalaCss()'],
  ['🔴 la escala de otra cuenta', SANO_DIBUJO.replace('const escala = escalaCss();', 'const escala = escalaCss() / 2;'), 'escalaCss()'],
  ['🔴 sin escala', SANO_DIBUJO.replace('scale: escala, ', ''), 'escalaCss()'],
  [
    '🔴 un atlas sin versión, escrito a mano',
    SANO_DIBUJO.replace(CARGA, "k.loadSprite(null, '/sprites/skayboy.png', { sliceX: 4, sliceY: 5 })"),
    'sin versión',
  ],
  [
    '🔴 un atlas armado con un template, sin pasar por rutaDe(',
    SANO_DIBUJO.replace(CARGA, 'k.loadSprite(null, `/sprites/${nombre}.png`, { sliceX: 4, sliceY: 5 })'),
    'sin versión',
  ],
  [
    '🔴 rutaDe( con la versión sacada después',
    SANO_DIBUJO.replace(CARGA, "k.loadSprite(null, rutaDe(nombre, 'png').replace(/\\.v\\d+/, ''), { sliceX: 4, sliceY: 5 })"),
    'loadSprite( carga',
  ],
  [
    '🔴 el JSON armado con la carpeta, sin pasar por rutaDe(',
    SANO_DIBUJO.replace(RUTA_JSON, 'const ruta = `${CARPETA_DE_SPRITES}${pieza}.json`;'),
    'fetch( pide',
  ],
  [
    '🔴 el JSON con rutaDe( y la versión sacada después',
    SANO_DIBUJO.replace('fetch(ruta)', "fetch(ruta.replace('.v1', ''))"),
    'fetch( pide',
  ],
  ['🔴 nombrando la carpeta de los atlas', SANO_DIBUJO + 'const base = CARPETA_DE_SPRITES;', 'CARPETA_DE_SPRITES'],
  ['🔴 el JSON del atlas pedido sin versión', SANO_DIBUJO + "const j = await fetch('/sprites/sala.json');", 'sin versión'],
  ['🔴 con la versión en el lugar equivocado', SANO_DIBUJO + "const j = await fetch('/sprites/v1/sala.json');", 'sin versión'],
  ['🔴 sin ningún loadSprite(', SANO_DIBUJO.replace(CARGA, 'null'), 'ningún loadSprite('],
  [
    '🔴 el nivel elegido por la dirección también en el build',
    SANO_DIBUJO.replace('import.meta.env.DEV ? new URLSearchParams', 'true ? new URLSearchParams'),
    'import.meta.env.DEV',
  ],
  ['🔴 la dirección leída por otro lado', SANO_DIBUJO + 'const n = location.hash.slice(1);', 'import.meta.env.DEV'],
  // FIND-77: las evasiones que la guarda no cazaba hasta T-293.
  [
    '🔴 la condición dada vuelta: !import.meta.env.DEV ?',
    SANO_DIBUJO.replace('import.meta.env.DEV ? new URLSearchParams', '!import.meta.env.DEV ? new URLSearchParams'),
    'import.meta.env.DEV',
  ],
  [
    '🔴 la condición mezclada: true || import.meta.env.DEV ?',
    SANO_DIBUJO.replace('import.meta.env.DEV ? new URLSearchParams', 'true || import.meta.env.DEV ? new URLSearchParams'),
    'import.meta.env.DEV',
  ],
  [
    '🔴 la condición mezclada: algo ?? import.meta.env.DEV ?',
    SANO_DIBUJO.replace('import.meta.env.DEV ? new URLSearchParams', 'algo ?? import.meta.env.DEV ? new URLSearchParams'),
    'import.meta.env.DEV',
  ],
  [
    '🔴 la dirección por document.URL y searchParams',
    SANO_DIBUJO + "const n = new URL(document.URL).searchParams.get('nivel');",
    'import.meta.env.DEV',
  ],
  ['🔴 la dirección por document.location', SANO_DIBUJO + "const n = String(document.location).split('nivel=')[1];", 'import.meta.env.DEV'],
  ['🔴 la dirección por document.documentURI', SANO_DIBUJO + "const n = document.documentURI.split('nivel=')[1];", 'import.meta.env.DEV'],
  ["🔴 la dirección por document['URL']", SANO_DIBUJO + "const n = document['URL'].split('nivel=')[1];", 'import.meta.env.DEV'],
  [
    '🔴 la dirección por otra puerta, pero leída con searchParams',
    SANO_DIBUJO + "const n = new URL(navigation.currentEntry.url).searchParams.get('nivel');",
    'import.meta.env.DEV',
  ],
  // La revisión de T-293: las que todavía pasaban.
  ['🔴 la dirección por document?.URL', SANO_DIBUJO + "const n = document?.URL.split('nivel=')[1];", 'import.meta.env.DEV'],
  ['🔴 la dirección por (document).URL', SANO_DIBUJO + "const n = (document).URL.split('nivel=')[1];", 'import.meta.env.DEV'],
  [
    '🔴 la dirección desestructurada: { URL: dir } = document',
    SANO_DIBUJO + "const { URL: dir } = document; const n = dir.split('nivel=')[1];",
    'import.meta.env.DEV',
  ],
  [
    '🔴 la dirección por navigation.currentEntry.url, sin searchParams',
    SANO_DIBUJO + "const n = navigation.currentEntry.url.split('nivel=')[1];",
    'import.meta.env.DEV',
  ],
  [
    '🔴 la dirección por la entrada de navegación de performance',
    SANO_DIBUJO + "const n = performance.getEntriesByType('navigation')[0].name.split('nivel=')[1];",
    'import.meta.env.DEV',
  ],
  [
    "🔴 la lectura escondida entre un '/*' y un '*/' de texto",
    SANO_DIBUJO + "const ab = '/*'; const n = new URL(document.URL).searchParams.get('nivel'); const ce = '*/';",
    'import.meta.env.DEV',
  ],
  [
    "🔴 un '//' de texto no se come el resto de la línea",
    SANO_DIBUJO + "const ab = '//'; const n = document.URL.split('nivel=')[1];",
    'import.meta.env.DEV',
  ],
  [
    '🔴 una comilla adentro de una expresión regular no abre texto',
    SANO_DIBUJO + "const r = /'/; const ab = '/*'; const n = document.URL.split('nivel=')[1]; const ce = '*/';",
    'import.meta.env.DEV',
  ],
  [
    '🔴 fetch nombrado sin paréntesis, para pedir por un alias',
    SANO_DIBUJO + "const pedir = fetch; const j = await pedir(ruta.replace('.v1', ''));",
    'nombra fetch sin llamarlo',
  ],
  [
    '🔴 loadSprite nombrado sin paréntesis, para cargar por un alias',
    SANO_DIBUJO + "const cargar = k.loadSprite; cargar(null, rutaDe(nombre, 'png').replace('.v1', ''));",
    'nombra loadSprite sin llamarlo',
  ],
] as const) {
  test(`el auditor del dibujo sabe encontrar: ${caso}`, () => {
    const problemas = problemasDelDibujo(roto);
    assert.ok(
      problemas.some((p) => p.includes(espera)),
      `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`,
    );
  });
}

/**
 * ## La pantalla completa (`ADR-10.6`, `T-301`): el motor no se entera
 *
 * La decisión es que el modo le cambia al canvas **solo la caja CSS**, y que el buffer del motor
 * queda como lo armó el init. Eso se sostiene mientras el motor no se meta, y hay cuatro maneras
 * de que se meta, las cuatro leídas en `node_modules/kaplay/dist/kaplay.mjs` por `ADR-10`:
 *
 * 1. **`k.setFullscreen()`** pide la pantalla completa **sobre el canvas**: se ven los píxeles y
 *    desaparecen las teclas, el botón de salir y el pie de homenaje. Y **`k.isFullscreen()`**
 *    contesta sobre el canvas, así que con el contenedor en pantalla completa diría que no.
 * 2. **`stretch` o `letterbox` en el init**: con cualquiera de los dos, el motor rehace el buffer
 *    a la caja CSS en cada cambio de tamaño, con un tamaño que no es múltiplo de nada.
 * 3. **`requestFullscreen` sobre el canvas** a mano: el mismo defecto que el punto 1 sin pasar
 *    por el motor.
 * 4. **Un `await` antes del `requestFullscreen`**: el navegador la da solo con el gesto de la
 *    persona todavía vivo, y una espera en el medio lo gasta. Rechazada, el modo sigue, pero la
 *    pantalla del sistema no llega nunca, y en Android es la que esconde la barra.
 *
 * Y tres presencias, porque la ausencia de código es el defecto: que el pedido exista, que el
 * sistema tenga su puerta de salida (`fullscreenchange`) y `Escape` la suya, y que el encuadre
 * se rehaga con un `ResizeObserver`.
 */
/**
 * La declaración `function` más de adentro cuyo cuerpo (de su `{` a la `}` que lo cierra)
 * contiene esa posición, con su `async` si lo tiene. `undefined` si está afuera de toda función.
 */
function funcionQueContiene(codigo: string, posicion: number): RegExpExecArray | undefined {
  let adentro: RegExpExecArray | undefined;
  for (const f of codigo.slice(0, posicion).matchAll(/(?<![\w$])(async\s+)?function\b[^{]*\{/g)) {
    let hondura = 1;
    let i = f.index + f[0].length;
    while (i < codigo.length && hondura > 0) {
      if (codigo[i] === '{') hondura++;
      else if (codigo[i] === '}') hondura--;
      i++;
    }
    if (i > posicion) adentro = f;
  }
  return adentro;
}

function problemasDePantallaCompleta(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  const problemas: string[] = [];

  for (const prohibida of ['setFullscreen', 'isFullscreen']) {
    if (new RegExp(`(?<![\\w$])${prohibida}(?![\\w$])`).test(codigo)) {
      problemas.push(`nombra ${prohibida} del motor: contesta y pide sobre el canvas, no sobre el contenedor (ADR-10.4)`);
    }
  }
  for (const { opciones } of llamadasAlMotor(codigo)) {
    for (const opcion of ['stretch', 'letterbox']) {
      if (new RegExp(`\\b${opcion}\\s*:`).test(opciones)) {
        problemas.push(`kaplay( con ${opcion}: el motor rehace el buffer en cada cambio de caja (ADR-10.4)`);
      }
    }
  }

  const pedidos = [...codigo.matchAll(/(?<![\w$])(?:webkitR|r)equestFullscreen(?![\w$])/g)];
  if (pedidos.length === 0) problemas.push('no hay ningún requestFullscreen: la pantalla del sistema no se pide nunca (ADR-10.2)');
  for (const m of pedidos) {
    // La sentencia entera donde aparece: de la `;` o la llave anterior a la `;` siguiente.
    const desde = Math.max(codigo.lastIndexOf(';', m.index), codigo.lastIndexOf('{', m.index), codigo.lastIndexOf('}', m.index)) + 1;
    const hasta = codigo.indexOf(';', m.index);
    const sentencia = codigo.slice(desde, hasta === -1 ? undefined : hasta);
    if (/(?<![\w$])canvas(?![\w$])|#juego/.test(sentencia)) {
      problemas.push('pide la pantalla completa sobre el canvas: se pide sobre el contenedor, o las teclas desaparecen (ADR-10.2)');
    }
    // La función que la pide —la más de adentro cuyo cuerpo la contiene, no la última escrita
    // antes: un `type` con `webkitRequestFullscreen` puede vivir debajo de cualquier función—:
    // ni `async`, ni un `await` entre su comienzo y el pedido.
    const funcion = funcionQueContiene(codigo, m.index);
    if (funcion !== undefined) {
      if (funcion[1] !== undefined) {
        problemas.push('el pedido vive en una función async: el gesto de la persona no sobrevive a la espera (ADR-10.2)');
      }
      if (/(?<![\w$])await(?![\w$])/.test(codigo.slice(funcion.index, m.index))) {
        problemas.push('hay un await antes del requestFullscreen: el gesto se gasta y el sistema la niega (ADR-10.2)');
      }
    }
  }
  if (/\.call\(\s*canvas\s*[,)]/.test(codigo)) {
    problemas.push('llama algo con el canvas de this: si es el pedido, es sobre el canvas (ADR-10.2)');
  }

  if (!/['"`]fullscreenchange['"`]/.test(codigo)) {
    problemas.push('no escucha fullscreenchange: si el sistema la termina, el modo se queda puesto (ADR-10.3)');
  }
  if (!/['"`]Escape['"`]/.test(codigo)) problemas.push('no escucha Escape: sin la API, el teclado no tiene salida (ADR-10.3)');
  if (!/(?<![\w$])ResizeObserver(?![\w$])/.test(codigo)) {
    problemas.push('no hay ResizeObserver: al girar o al esconderse la barra, el área queda con la escala vieja (ADR-10.1)');
  }
  return problemas;
}

/**
 * El modo vive en un módulo aparte de la isla (`modo-pantalla.ts`) para poder jugarse en Node con
 * utilería. Las prohibiciones de `ADR-10.6` son de la isla **entera**, así que se leen las dos
 * piezas juntas: separar el archivo no puede ser una manera de sacar algo de la vista.
 */
const MODO = 'src/lib/skayboy/modo-pantalla.ts';

test('la isla de verdad cumple ADR-10.6: el motor no se entera de la pantalla completa', () => {
  assert.deepEqual(problemasDePantallaCompleta(readFileSync(ISLA, 'utf8') + '\n' + readFileSync(MODO, 'utf8')), []);
});

/**
 * **Ni un `async` ni un `await` en el módulo del modo.** El auditor de arriba mira la función que
 * contiene el pedido; la revisión mostró que una espera en el manejador del botón —una flecha
 * `async`, que no es una `function`— lo esquivaba. Este módulo no tiene nada que esperar, así que
 * la regla es más simple y más dura: ninguna espera, en ningún lado. La conducta la juega aparte
 * `modo-pantalla.test.ts` (el pedido tiene que haber salido cuando vuelve el manejador); esto es
 * la segunda red, la que se lee.
 */
function esperasEn(fuente: string): string[] {
  return [...sinComentarios(fuente).matchAll(/(?<![\w$.'"`])(async|await)(?![\w$])/g)].map((m) => m[1]!);
}

test('ADR-10.2: el módulo del modo no espera nada, en ningún lado', () => {
  assert.deepEqual(esperasEn(readFileSync(MODO, 'utf8')), []);
});

for (const [caso, roto] of [
  ['🔴 una flecha async en el manejador', "boton.addEventListener('click', async () => { await Promise.resolve(); pedir(); });"],
  ['🔴 una flecha async con la espera adentro', 'const pedir = async () => { entrar(); };'],
  ['🔴 un await suelto antes del pedido', 'function pedir() { entrar(); }\nawait cargar();'],
] as const) {
  test(`esa regla sabe encontrar: ${caso}`, () => {
    assert.notDeepEqual(esperasEn(roto), []);
  });
}

test('control: nombrar la espera en un comentario o en un texto no es esperar', () => {
  assert.deepEqual(esperasEn("// sin ningún await antes\nconst x = 'await';\nfunction f() {}"), []);
});

/** Un fuente sano de referencia para la pantalla completa. Cada caso lo rompe en un solo lugar. */
const SANO_PANTALLA = `
  const k = kaplay({ global: false, canvas, backgroundAudio: true, width: 240, height: 144, scale: escala, crisp: true });
  void k.audioCtx.close();
  function pedirPantallaCompleta() {
    entrar();
    const contenedor = fichin;
    const pedir = contenedor.requestFullscreen ?? contenedor.webkitRequestFullscreen;
    if (typeof pedir !== 'function') return;
    Promise.resolve(pedir.call(contenedor)).catch(() => {});
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') salir(); });
  document.addEventListener('fullscreenchange', () => salir());
  new ResizeObserver(() => encuadrar()).observe(fichin);
`;

test('control: el fuente de referencia de la pantalla completa está sano', () => {
  assert.deepEqual(problemasDePantallaCompleta(SANO_PANTALLA), []);
  // Nombrarla en un comentario no es llamarla.
  assert.deepEqual(problemasDePantallaCompleta(SANO_PANTALLA + '\n// nunca k.setFullscreen(), que pide sobre el canvas'), []);
  // Un tipo con el prefijo, escrito debajo de una función async, no vive adentro de ella: el
  // primer auditor tomaba la última `function` escrita antes, y así cayó la isla de verdad.
  const conTipo = 'async function arrancar() { await algo(); }\ntype ConPrefijo = { webkitRequestFullscreen?: () => void };\n';
  assert.deepEqual(problemasDePantallaCompleta(conTipo + SANO_PANTALLA), []);
});

const PEDIDO = 'const pedir = contenedor.requestFullscreen ?? contenedor.webkitRequestFullscreen;';
const OBSERVADOR = 'new ResizeObserver(() => encuadrar()).observe(fichin);';

for (const [caso, roto, espera] of [
  ['🔴 con k.setFullscreen()', SANO_PANTALLA + 'k.setFullscreen(true);', 'setFullscreen'],
  ['🔴 preguntándole al motor con k.isFullscreen()', SANO_PANTALLA + 'if (k.isFullscreen()) salir();', 'isFullscreen'],
  ['🔴 con stretch en el init', SANO_PANTALLA.replace('crisp: true', 'crisp: true, stretch: true'), 'stretch'],
  ['🔴 con letterbox en el init', SANO_PANTALLA.replace('crisp: true', 'crisp: true, letterbox: true'), 'letterbox'],
  ['🔴 pidiéndola sobre el canvas', SANO_PANTALLA.replace(PEDIDO, 'const pedir = canvas.requestFullscreen;'), 'sobre el canvas'],
  [
    '🔴 pidiéndola sobre el #juego',
    SANO_PANTALLA.replace(PEDIDO, "document.querySelector('#juego').requestFullscreen();"),
    'sobre el canvas',
  ],
  ['🔴 con el canvas de this', SANO_PANTALLA.replace('pedir.call(contenedor)', 'pedir.call(canvas)'), 'canvas de this'],
  ['🔴 con un await antes del pedido', SANO_PANTALLA.replace('    entrar();', '    await cargarAlgo();'), 'await antes del requestFullscreen'],
  [
    '🔴 adentro de una función async',
    SANO_PANTALLA.replace('function pedirPantallaCompleta', 'async function pedirPantallaCompleta'),
    'async',
  ],
  ['🔴 sin ningún pedido', SANO_PANTALLA.replace(PEDIDO, 'const pedir = undefined;'), 'no hay ningún requestFullscreen'],
  ['🔴 sin escuchar al sistema', SANO_PANTALLA.replace("'fullscreenchange'", "'resize'"), 'fullscreenchange'],
  ['🔴 sin Escape', SANO_PANTALLA.replace("'Escape'", "'Esc'"), 'Escape'],
  ['🔴 sin ResizeObserver', SANO_PANTALLA.replace(OBSERVADOR, "addEventListener('resize', encuadrar);"), 'ResizeObserver'],
] as const) {
  test(`el auditor de la pantalla completa sabe encontrar: ${caso}`, () => {
    const problemas = problemasDePantallaCompleta(roto);
    assert.ok(
      problemas.some((p) => p.includes(espera)),
      `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`,
    );
  });
}

/* ==========================================================================
   El montaje del modo (`FIND-78`, `REV-15` tercera pasada)

   El auditor de arriba mira la sentencia del pedido, y esa sentencia vive en `modo-pantalla.ts`
   y dice `contenedor`. **Qué es ese contenedor lo decide la isla**, en la consulta que le pasa a
   `montarPantallaCompleta`: cambiar `'.fichin'` por `'canvas'` en esa línea dejaba todo en verde,
   y el pedido salía sobre el canvas, que es lo que `ADR-10.2` prohíbe (las teclas desaparecen).
   Y el montaje tiene que correr: una isla que no llama a la función que monta deja el botón a la
   vista e inerte, y eso también pasaba en verde.
   ========================================================================== */

/** El código con el adentro de cada texto en blanco, del mismo largo: para contar llaves. */
function sinTextos(codigo: string): string {
  let salida = '';
  let i = 0;
  while (i < codigo.length) {
    const c = codigo[i]!;
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < codigo.length && codigo[j] !== c && !(codigo[j] === '\n' && c !== '`')) j += codigo[j] === '\\' ? 2 : 1;
      const fin = Math.min(j, codigo.length);
      salida += c + ' '.repeat(Math.max(0, fin - i - 1)) + (j < codigo.length ? codigo[j] : '');
      i = j + 1;
    } else {
      salida += c;
      i++;
    }
  }
  return salida;
}

/** Cuántas llaves abiertas hay antes de esa posición. Cero es el nivel del módulo. */
function honduraEn(plano: string, posicion: number): number {
  let hondura = 0;
  for (let i = 0; i < posicion; i++) {
    if (plano[i] === '{') hondura++;
    else if (plano[i] === '}') hondura--;
  }
  return hondura;
}

/** Un nombre de la isla, escapado para meterlo en una expresión regular. */
function comoPatron(nombre: string): string {
  return nombre.replace(/\$/g, '\\$');
}

const CONSULTA_DEL_FICHIN = /^document\s*\.\s*querySelector\s*(?:<[^>]*>)?\s*\(\s*(['"`])\.fichin\1\s*\)\s*!?$/;

function problemasDelMontaje(fuente: string): string[] {
  const codigo = sinComentarios(fuente);
  const plano = sinTextos(codigo);
  const montajes = [...plano.matchAll(/(?<![\w$.])montarPantallaCompleta\s*\(/g)];
  if (montajes.length !== 1) {
    return [`montarPantallaCompleta( aparece ${montajes.length} veces: el modo se monta una sola vez (ADR-10.6)`];
  }
  const problemas: string[] = [];
  const m = montajes[0]!;

  // Los argumentos: de la `(` a su pareja.
  let hondura = 1;
  let i = m.index + m[0].length;
  const desde = i;
  while (i < plano.length && hondura > 0) {
    if (plano[i] === '(') hondura++;
    else if (plano[i] === ')') hondura--;
    i++;
  }
  const argumentos = codigo.slice(desde, i - 1);
  const argumentosPlanos = plano.slice(desde, i - 1);

  // `fichin` (atajo) o `fichin: <expresión>`, hasta la coma o la llave del mismo nivel.
  const clave = /(?<![\w$.])fichin(?![\w$])\s*(:)?/.exec(argumentosPlanos);
  let expresion: string | undefined;
  if (clave === null) {
    problemas.push('montarPantallaCompleta( no recibe el fichin: no se sabe sobre qué se pide (ADR-10.2)');
  } else if (clave[1] === undefined) {
    expresion = 'fichin';
  } else {
    let j = clave.index + clave[0].length;
    const inicio = j;
    let nivel = 0;
    while (j < argumentosPlanos.length && !(nivel === 0 && (argumentosPlanos[j] === ',' || argumentosPlanos[j] === '}'))) {
      if ('([{<'.includes(argumentosPlanos[j]!)) nivel++;
      else if (')]}>'.includes(argumentosPlanos[j]!)) nivel--;
      j++;
    }
    expresion = argumentos.slice(inicio, j).trim();
  }

  if (expresion !== undefined) {
    // Un nombre suelto se resuelve con su última declaración antes del montaje.
    if (/^[\w$]+$/.test(expresion)) {
      const declaracion = new RegExp(`(?<![\\w$.])(?:const|let|var)\\s+${comoPatron(expresion)}\\s*(?::[^=;]+)?=\\s*([^;]+);`, 'g');
      const declaraciones = [...codigo.slice(0, m.index).matchAll(declaracion)];
      expresion = declaraciones.length === 0 ? undefined : declaraciones[declaraciones.length - 1]![1]!.trim();
    }
    if (expresion === undefined || !CONSULTA_DEL_FICHIN.test(expresion)) {
      problemas.push(
        `el contenedor de la pantalla completa no sale de document.querySelector('.fichin') (sale de ${expresion ?? 'ningún lado'}): sobre el canvas, las teclas desaparecen (ADR-10.2)`,
      );
    }
  }

  // Que corra: o el montaje está al nivel del módulo, o la función que lo contiene se llama ahí.
  if (honduraEn(plano, m.index) !== 0) {
    const funcion = funcionQueContiene(codigo, m.index);
    const nombre = funcion === undefined ? undefined : /function\s+([\w$]+)/.exec(funcion[0])?.[1];
    const llamada =
      nombre === undefined
        ? undefined
        : [...plano.matchAll(new RegExp(`(?<![\\w$.])${comoPatron(nombre)}\\s*\\(\\s*\\)`, 'g'))].find(
            (l) => honduraEn(plano, l.index) === 0 && !/function\s+$/.test(plano.slice(0, l.index)),
          );
    if (llamada === undefined) {
      problemas.push(`el montaje vive en ${nombre ?? 'una función sin nombre'} y nadie la llama al cargar la isla: el botón queda a la vista e inerte`);
    }
  }
  return problemas;
}

test('la isla de verdad monta la pantalla completa sobre .fichin, y la monta al cargar (FIND-78)', () => {
  assert.deepEqual(problemasDelMontaje(readFileSync(ISLA, 'utf8')), []);
});

const SANO_MONTAJE = `
const botonPantalla = document.querySelector<HTMLButtonElement>('#pantalla-completa');
function escucharPantallaCompleta(): void {
  const fichin = document.querySelector<HTMLElement>('.fichin');
  if (fichin === null || botonPantalla === null) return;
  montarPantallaCompleta({ documento: document, ventana: window, fichin, boton: botonPantalla, soltarTodas });
}
escucharTeclas();
escucharPantallaCompleta();
void arrancar();
`;
const CONSULTA = "const fichin = document.querySelector<HTMLElement>('.fichin');";

test('control: el fuente de referencia del montaje está sano, y sus variantes legítimas también', () => {
  assert.deepEqual(problemasDelMontaje(SANO_MONTAJE), []);
  // Con otro nombre y la clave explícita.
  const renombrado = SANO_MONTAJE.replace(CONSULTA, "const caja = document.querySelector('.fichin');").replace('fichin, boton', 'fichin: caja, boton');
  assert.deepEqual(problemasDelMontaje(renombrado), []);
  // La consulta escrita adentro del objeto.
  const enLinea = SANO_MONTAJE.replace('fichin, boton', "fichin: document.querySelector<HTMLElement>('.fichin')!, boton");
  assert.deepEqual(problemasDelMontaje(enLinea), []);
  // Nombrar el montaje en un comentario no es montar.
  assert.deepEqual(problemasDelMontaje(SANO_MONTAJE + '\n// montarPantallaCompleta({ fichin: canvas })'), []);
});

for (const [caso, roto, espera] of [
  ['🔴 el contenedor es el canvas', SANO_MONTAJE.replace("'.fichin'", "'canvas'"), "no sale de document.querySelector('.fichin')"],
  ['🔴 el contenedor es el #juego', SANO_MONTAJE.replace("'.fichin'", "'#juego'"), "no sale de document.querySelector('.fichin')"],
  ['🔴 el contenedor es el .recorte', SANO_MONTAJE.replace("'.fichin'", "'.recorte'"), "no sale de document.querySelector('.fichin')"],
  [
    '🔴 la consulta del canvas escrita adentro del objeto',
    SANO_MONTAJE.replace('fichin, boton', "fichin: document.querySelector('canvas')!, boton"),
    "no sale de document.querySelector('.fichin')",
  ],
  ['🔴 el fichin pisado por otra cosa', SANO_MONTAJE.replace('fichin, boton', 'fichin: canvas, boton'), "no sale de document.querySelector('.fichin')"],
  ['🔴 sin el fichin', SANO_MONTAJE.replace('fichin, boton', 'boton'), 'no recibe el fichin'],
  ['🔴 nadie llama al montaje', SANO_MONTAJE.replace('escucharPantallaCompleta();\n', ''), 'nadie la llama'],
  [
    '🔴 la llamada escondida adentro de otra función',
    SANO_MONTAJE.replace('escucharPantallaCompleta();\n', 'function nunca() { escucharPantallaCompleta(); }\n'),
    'nadie la llama',
  ],
  ['🔴 sin montaje', SANO_MONTAJE.replace('montarPantallaCompleta(', 'otraCosa('), '0 veces'],
  ['🔴 montado dos veces', SANO_MONTAJE + "montarPantallaCompleta({ fichin: document.querySelector('.fichin') });", '2 veces'],
] as const) {
  test(`el auditor del montaje sabe encontrar: ${caso}`, () => {
    const problemas = problemasDelMontaje(roto);
    assert.ok(problemas.some((p) => p.includes(espera)), `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`);
  });
}
