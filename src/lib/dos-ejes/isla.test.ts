/**
 * Lo que la isla de "¿Qué tipo de ricotero sos?" tiene que seguir haciendo (`D-57` puntos 12 y
 * 13), mirado sobre su fuente.
 *
 * Una isla no corre en Node, así que esto no la ejecuta: lee el archivo y exige las piezas que
 * cerraron los dos defectos más graves del relevamiento del ciclo 18 —el doble toque que
 * contestaba la pregunta siguiente, y el foco que caía al `<body>` en cada hoja—. Si alguien
 * las saca, el build se cae acá con el motivo, no en el teléfono de nadie.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ISLA = readFileSync('src/scripts/partida-dos-ejes.ts', 'utf-8');
const TOKENS = readFileSync('src/styles/tokens.css', 'utf-8');
const PAGINAS = ['src/pages/juegos/dos-ejes.astro', 'src/pages/juegos/dos-ejes/[cu].astro'].map((p) => ({
  p,
  html: readFileSync(p, 'utf-8'),
}));

test('el toque bloquea las dos opciones y espera el token de la pausa', () => {
  assert.match(ISLA, /if \(bloqueado\) return;/, 'elegir() no se protege del segundo toque');
  assert.match(ISLA, /setAttribute\('aria-disabled', 'true'\)/, 'las opciones no quedan inertes durante la pausa');
  // `disabled` le saca el foco al botón tocado y el lector no llega a decir "apretado"
  // (`UX-36` §4.3).
  assert.ok(!/\.disabled = true/.test(ISLA), 'volvió `disabled`: el foco se pierde en la pausa');
  assert.match(ISLA, /--pausa-eleccion/, 'la pausa no sale del token');
  assert.ok(!/setTimeout\([^,]+,\s*\d/.test(ISLA), 'hay una pausa escrita a mano en milisegundos');
});

test('la pausa es información: el corte de movimiento reducido no la toca', () => {
  assert.match(TOKENS, /--pausa-eleccion:\s*\d+ms;/);
  const corte = TOKENS.slice(TOKENS.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.ok(!/--pausa-eleccion/.test(corte), 'con la pausa en cero vuelve el doble toque');
});

test('el foco va al enunciado de cada hoja y al nombre del resultado', () => {
  assert.match(ISLA, /enfocar\(enunciado\)/, 'la hoja nueva no se lleva el foco');
  assert.match(ISLA, /enfocar\(nombre\)/, 'el resultado no se lleva el foco');
  assert.match(ISLA, /setAttribute\('role', 'group'\)/, 'las opciones no van agrupadas');
  assert.match(ISLA, /setAttribute\('aria-labelledby', enunciado\.id\)/, 'el grupo no se nombra con el enunciado');
});

test('una sola región viva, en el HTML de la página y afuera de lo que la isla vacía', () => {
  // Una región viva que nace junto con su texto no se anuncia de forma fiable (`UX-36` §8.2).
  for (const { p, html } of PAGINAS) {
    assert.match(html, /<p id="ejes-anuncio" class="solo-lector" role="status" aria-live="polite" aria-atomic="true"><\/p>/, `${p} no trae la región viva`);
    const region = html.indexOf('id="ejes-anuncio"');
    const finResultado = html.indexOf('<section id="resultado"');
    assert.ok(region > finResultado, `${p}: la región viva tiene que ir afuera y después de las secciones`);
  }
  assert.match(ISLA, /anuncio\.textContent = PARTIDA\.anuncio\(/, 'la hoja no actualiza la región viva');
  assert.ok(!/setAttribute\('role', 'status'\)/.test(ISLA), 'la isla volvió a crear su propia región viva');
});

test('una tecla sostenida no contesta la hoja siguiente', () => {
  assert.match(ISLA, /e\.repeat/, 'el teclado no ignora la repetición');
});

test('el sello del momento entra solo cuando cambia el momento', () => {
  assert.match(ISLA, /item\.momento !== momentoAnterior/);
  assert.match(ISLA, /momentoAnterior = undefined/, 'la noche nueva no vuelve a estampar el primer sello');
});

test('el enlace viejo no pisa el subtítulo ni redirige (ADR-02 punto 6, UX-36 §3.3)', () => {
  assert.ok(!/getElementById\('subtitulo'\)/.test(ISLA), 'la isla vuelve a tocar el subtítulo');
  assert.ok(!/location\.(replace|assign)|location\.href\s*=/.test(ISLA), 'la isla redirige');
  assert.match(ISLA, /replaceWith\(etiquetaDelAmigo\(suyo\)\)/, 'el enlace viejo no pega la etiqueta del amigo');
});

test('volver a la anterior no toca el historial: la analítica no cuenta hojas (D-56)', () => {
  assert.match(ISLA, /function volverAnterior/);
  assert.ok(!/history\.(pushState|replaceState)/.test(ISLA));
});

test('el resultado no muestra ningún número: no hay de dónde sacarlo', () => {
  // `resolverCuadrante` no devuelve números (`partida.test.ts`); acá se vigila que la isla no
  // cuente por su cuenta los polos elegidos para pintarlos.
  assert.ok(!/elegidos\.filter\(/.test(ISLA), 'la isla cuenta polos');
  assert.ok(!/elegidos\.length\s*[^=]/.test(ISLA.replace(/elegidos\.length = 0/g, '')), 'la isla mira cuántos eligió');
});

test('compartir lleva la tarjeta ya bajada, y el enlace es la postal de la identidad', () => {
  assert.match(ISLA, /fetch\(rutaDeTarjeta\(r\.id\)\)/, 'la tarjeta no se baja al pintar el resultado');
  assert.match(ISLA, /archivo: tarjeta/);
  assert.match(ISLA, /\/juegos\/\$\{JUEGO\}\/\$\{slugDe\(r\.id\)\}\//, 'el enlace no es la postal');
});

test('el plano se esconde al lector y no tiene nada que se toque (UX-38 §5)', () => {
  const desde = ISLA.indexOf('function plano(');
  assert.ok(desde > 0, 'no está la función del plano');
  const cuerpo = ISLA.slice(desde, ISLA.indexOf('\n}\n', desde));
  assert.match(cuerpo, /setAttribute\('aria-hidden', 'true'\)/, 'el plano se lee: dice dos veces lo que ya dicen la hoja y la grilla');
  for (const [que, re] of [
    ['un enlace', /'a'/],
    ['un botón', /'button'/],
    ['un tabindex', /tabindex|tabIndex/],
    ['un punto', /'circle'|ejes-punto/],
  ] as const) {
    assert.ok(!re.test(cuerpo), `el plano trae ${que}`);
  }
  // Una sola `disposicion()` para el plano y la grilla: así no pueden discrepar.
  assert.equal(ISLA.match(/disposicion\(banco/g)?.length, 1, 'el plano y la grilla calculan la disposición por separado');
});
