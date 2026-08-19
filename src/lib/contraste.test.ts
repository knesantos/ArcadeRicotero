import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * Verifica que los tokens de `src/styles/tokens.css` cumplan WCAG AA.
 *
 * `UX-04` fija que la paleta es psicodelica saturada y **que eso no exime de
 * contraste**. Este test es la traduccion de esa frase a algo que falla el build.
 *
 * Lee el CSS de verdad en vez de repetir los hex: si alguien cambia un color y rompe
 * el contraste, el test lo agarra. Repetirlos aca seria probar una copia.
 */

const CSS = readFileSync('src/styles/tokens.css', 'utf-8');

function token(nombre: string): string {
  const m = CSS.match(new RegExp(`--${nombre}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `no se encontro el token --${nombre} en tokens.css`);
  return m![1]!;
}

/** Luminancia relativa segun WCAG 2.1. */
function luminancia(hex: string): number {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
}

/** Los pares que de verdad aparecen en pantalla. */
const PARES: Array<[string, string, string]> = [
  ['texto sobre fondo', 'texto', 'fondo'],
  ['texto sobre fondo elevado', 'texto', 'fondo-elevado'],
  ['texto tenue sobre fondo', 'texto-tenue', 'fondo'],
  ['texto tenue sobre fondo elevado', 'texto-tenue', 'fondo-elevado'],
  ['acento sobre fondo', 'acento', 'fondo'],
  ['acento-2 sobre fondo', 'acento-2', 'fondo'],
  ['acierto sobre fondo', 'acento-3', 'fondo'],
  ['error sobre fondo', 'acento-4', 'fondo'],
  ['rotulo de leyenda sobre fondo', 'rotulo-leyenda', 'fondo'],
  ['rotulo de leyenda sobre fondo elevado', 'rotulo-leyenda', 'fondo-elevado'],
  ['rotulo de testimonio sobre fondo', 'rotulo-testimonio', 'fondo'],
  ['rotulo de testimonio sobre fondo elevado', 'rotulo-testimonio', 'fondo-elevado'],
];

test('WCAG AA: todo par de texto y fondo llega a 4,5:1', () => {
  const fallas: string[] = [];
  for (const [nombre, frente, fondo] of PARES) {
    const r = contraste(token(frente), token(fondo));
    if (r < 4.5) fallas.push(`${nombre}: ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(fallas, [], `pares por debajo de 4,5:1:\n  ${fallas.join('\n  ')}`);
});

test('los rotulos de leyenda y testimonio se distinguen entre si', () => {
  // Si los dos rotulos se ven igual, el sistema de tres casillas se cae en la ultima
  // milla: el jugador no puede saber si le estan contando folclore o un testimonio.
  const r = contraste(token('rotulo-leyenda'), token('rotulo-testimonio'));
  assert.ok(r >= 1.2, `los dos rotulos son casi el mismo color: ${r.toFixed(2)}:1`);
});

test('el area de toque minima cumple lo que pide jugable con el pulgar', () => {
  const m = CSS.match(/--toque-min:\s*(\d+)px/);
  assert.ok(m, 'no hay token de area de toque');
  assert.ok(Number(m![1]) >= 44, `el area de toque es ${m![1]}px, muy chica para el pulgar`);
});

test('la base es oscura, como fija UX-04', () => {
  assert.ok(luminancia(token('fondo')) < 0.1, 'el fondo no es una base oscura');
});
