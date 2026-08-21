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
  // La mezcla (D-19): las categorias visten la paleta real de su disco. Solo el color
  // principal se usa como texto; el "apoyo" es de bordes y no entra aca.
  ['marca (rojo de Oktubre) sobre fondo', 'marca-rojo', 'fondo'],
  // El collage de cassette: las etiquetas de papel llevan la tinta del fondo encima.
  ['tinta sobre papel de etiqueta', 'fondo', 'papel'],
  ['historia (Gulp!) sobre fondo', 'cat-historia', 'fondo'],
  ['discos (Ultimo bondi) sobre fondo', 'cat-discos', 'fondo'],
  ['letras (La mosca) sobre fondo', 'cat-letras', 'fondo'],
  ['mitologia (Lobo suelto) sobre fondo', 'cat-mitologia', 'fondo'],
];

test('WCAG AA: todo par de texto y fondo llega a 4,5:1', () => {
  const fallas: string[] = [];
  for (const [nombre, frente, fondo] of PARES) {
    const r = contraste(token(frente), token(fondo));
    if (r < 4.5) fallas.push(`${nombre}: ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(fallas, [], `pares por debajo de 4,5:1:\n  ${fallas.join('\n  ')}`);
});

/**
 * El velo de tapa (`D-21`, `UX-04`).
 *
 * Acá no alcanza con medir tinta contra token: debajo hay una foto, y una foto tiene mil
 * valores adentro. Lo que se mide es el **peor compuesto posible** — el velo apoyado
 * sobre un pixel blanco puro, que es lo mas claro que una tapa puede llegar a ser. Si el
 * texto pasa AA contra eso, pasa contra cualquier tapa. Es la unica forma de que este
 * test pruebe algo en vez de prometerlo.
 */
function velo(nombre: string): { rgb: string; alfa: number } {
  const m = CSS.match(new RegExp(`--${nombre}:\\s*rgba\\((\\d+),\\s*(\\d+),\\s*(\\d+),\\s*([\\d.]+)\\)`));
  assert.ok(m, `no se encontro el velo --${nombre} en tokens.css`);
  const hex = `#${[1, 2, 3].map((i) => Number(m![i]).toString(16).padStart(2, '0')).join('')}`;
  return { rgb: hex, alfa: Number(m![4]) };
}

/** El velo sobre el fondo mas claro que puede tener una tapa: blanco puro. */
function peorCaso(nombre: string): string {
  const { rgb, alfa } = velo(nombre);
  const canal = (i: number) => Math.round(alfa * parseInt(rgb.slice(i, i + 2), 16) + (1 - alfa) * 255);
  return `#${[1, 3, 5].map((i) => canal(i).toString(16).padStart(2, '0')).join('')}`;
}

test('el velo de tapa esta teñido con --fondo y no con un color suelto', () => {
  // Si alguien cambia --fondo y se olvida del velo, el sitio queda con dos negros
  // distintos y el peor caso deja de ser el que este test mide.
  for (const v of ['velo-tapa', 'velo-tapa-titular']) {
    assert.equal(velo(v).rgb, token('fondo'), `--${v} no usa los canales de --fondo`);
  }
});

test('D-21: sobre tapa velada, el texto de cuerpo llega a 4,5:1 en el peor caso', () => {
  const sobre = peorCaso('velo-tapa');
  const fallas: string[] = [];
  for (const tinta of ['texto', 'texto-tenue']) {
    const r = contraste(token(tinta), sobre);
    if (r < 4.5) fallas.push(`${tinta} sobre tapa velada (peor caso ${sobre}): ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(fallas, [], `pares por debajo de 4,5:1:\n  ${fallas.join('\n  ')}`);
});

test('D-21: sobre tapa velada de titular, el texto grande llega a 3:1 en el peor caso', () => {
  const sobre = peorCaso('velo-tapa-titular');
  const r = contraste(token('texto'), sobre);
  assert.ok(r >= 3, `texto grande sobre tapa velada de titular: ${r.toFixed(2)}:1 (peor caso ${sobre})`);
});

test('D-21: el velo de titular NO habilita texto de cuerpo', () => {
  // No es una curiosidad: es la razon por la que existen dos velos y no uno. Si algun
  // dia el velo de titular pasara 4,5:1 con la tinta tenue, la distincion se volveria
  // decorativa y alguien la usaria para parrafos. Que falle acá y se revise.
  const r = contraste(token('texto-tenue'), peorCaso('velo-tapa-titular'));
  assert.ok(r < 4.5, `el velo de titular ya da ${r.toFixed(2)}:1 con tinta tenue: revisar por que hay dos velos`);
});

test('D-21: el rojo de marca no se usa como texto sobre tapa velada', () => {
  // Queda escrito como test y no como comentario porque es la tentacion obvia: la marca
  // es roja y la tapa de Oktubre tambien. Sobre tapa velada ese rojo no llega a AA con
  // ningun alfa que deje ver la foto — va en --texto, o va sobre --fondo.
  const r = contraste(token('marca-rojo'), peorCaso('velo-tapa'));
  assert.ok(r < 4.5, `--marca-rojo ahora da ${r.toFixed(2)}:1 sobre tapa velada: revisar esta prohibicion`);
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
