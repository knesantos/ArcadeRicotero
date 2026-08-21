import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
  for (const hoja of ['src/styles/juego.css', 'src/styles/sitio.css']) {
    const hexes = leer(hoja).match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    assert.deepEqual(hexes, [], `${hoja} tiene colores literales: ${hexes.join(', ')}`);
  }
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
