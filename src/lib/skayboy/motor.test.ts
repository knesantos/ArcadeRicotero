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

/** El fuente sin comentarios: una regla citada en un comentario no es una llamada. */
function sinComentarios(fuente: string): string {
  return fuente.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');
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
