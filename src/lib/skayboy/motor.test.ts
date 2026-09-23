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
