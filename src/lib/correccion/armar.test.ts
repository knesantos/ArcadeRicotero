/**
 * Verificación de `CTR-10`.
 *
 * El test que más importa es el último: **lee el fuente de `armar.ts`** para comprobar que
 * no puede tocar el navegador. Es el mismo mecanismo que usan `estilos.test.ts` y
 * `voz.test.ts`, y existe porque la regla de `BR-21` —al que corrige no se le pide nada—
 * se sostiene mejor con un módulo que *no puede* leer al navegador que con la memoria de
 * quien lo edite dentro de seis meses.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  armar,
  aTexto,
  aTextoParaMail,
  CorreccionInvalida,
  LARGO_MAX_URL,
  DICE_MIN,
  type Correccion,
} from './armar.ts';
import { disponibles, enviar, ORDEN } from './transporte.ts';
import { CASILLA } from './destino.ts';

const base = {
  juego: 'letra' as const,
  itemId: 'CL-014',
  ubicacion: 'el hueco',
  dice: 'den la [alarma] !',
  deberiaDecir: 'la palabra es otra',
  fuente: { sitio: 'cifraclub.com', url: 'https://www.cifraclub.com/x', fichas: ['RES-49'] },
  banco: { contrato: 'CTR-04', version: 2, actualizado: '2026-08-27' },
};

test('armar valida lo que vuelve accionable a una correccion', () => {
  const c = armar(base);
  assert.equal(c.contrato, 'CTR-10');
  assert.equal(c.v, 1);
  assert.throws(() => armar({ ...base, itemId: '' }), CorreccionInvalida);
  assert.throws(() => armar({ ...base, itemId: 'con espacios' }), CorreccionInvalida);
  assert.throws(() => armar({ ...base, dice: '   ' }), CorreccionInvalida);
  assert.throws(() => armar({ ...base, deberiaDecir: '' }), CorreccionInvalida);
  assert.throws(() => armar({ ...base, ubicacion: 'x'.repeat(41) }), CorreccionInvalida);
});

test('el renderizador es lista blanca: un campo de mas NO se imprime', () => {
  // La guarda de CTR-10.3. Si alguien le agrega un campo al objeto —por ejemplo algo de
  // la persona— no sale del sitio hasta que tambien lo agregue al renderizador.
  const conIntruso = { ...armar(base), navegador: 'Firefox 140', hora: '12:34' } as unknown as Correccion;
  const { texto } = aTexto(conIntruso);
  assert.ok(!texto.includes('Firefox'), 'se imprimio un campo que no esta en el tipo');
  assert.ok(!texto.includes('12:34'));
  assert.ok(texto.includes('CL-014'), 'pero los campos legitimos si salen');
});

test('el texto lleva lo que hace falta para actuar sin volver a preguntar', () => {
  const { texto } = aTexto(armar(base));
  for (const esperado of ['CTR-10 v1', 'letra', 'CL-014', 'el hueco', 'den la [alarma]', 'la palabra es otra', 'cifraclub.com', 'CTR-04 v2']) {
    assert.ok(texto.includes(esperado), `falta "${esperado}" en el mensaje`);
  }
});

test('CTR-10.5.2: el recorte tira lo que se puede volver a buscar, en orden', () => {
  // 2.000 caracteres: pasa el tope entero, asi que obliga a la escalera de recorte.
  // Con 1.200 el mensaje entraba tal cual y el test no probaba nada.
  const c = armar({ ...base, dice: 'x'.repeat(2000) });
  const armado = aTextoParaMail(c, 100);
  assert.ok(armado, 'con dice largo pero deberiaDecir corto, tiene que entrar recortado');
  // Cayeron la URL y las fichas: estan en el banco y en Docs/INVESTIGACION.
  assert.ok(!armado.texto.includes('https://'), 'la URL tendria que haberse caido');
  assert.ok(!armado.texto.includes('RES-49'), 'las fichas tendrian que haberse caido');
  // Pero el sitio queda: es lo que nombra de donde salio el dato.
  assert.ok(armado.texto.includes('cifraclub.com'));
  assert.equal(armado.recortado, true);
  assert.ok(armado.texto.includes('[recortado por largo'), 'un mensaje incompleto tiene que avisar');
});

test('`deberiaDecir` no se recorta jamas: antes se cae el mail entero', () => {
  // Media correccion es peor que ninguna: se puede leer al reves y aplicar mal, y aplicar
  // mal un dato es el unico dano que este proyecto declara estricto.
  const enorme = 'la palabra correcta es otra y lo explico largo. '.repeat(60);
  const c = armar({ ...base, deberiaDecir: enorme });
  assert.equal(aTextoParaMail(c, 100), null, 'no puede devolver un mensaje con la correccion cortada');
});

test('`dice` se acorta a prefijo pero nunca por debajo del piso', () => {
  const c = armar({ ...base, dice: 'y'.repeat(3000) });
  const armado = aTextoParaMail(c, 100);
  if (armado) {
    const linea = armado.texto.split('\n').find((l) => l.startsWith('Dice: '))!;
    assert.ok(linea.length - 'Dice: '.length >= DICE_MIN, 'se acorto por debajo del piso');
  }
});

test('el tope se mide sobre la URL codificada, no sobre el texto', () => {
  // La trampa de CTR-10.5.1: un salto pasa a %0A y una vocal con tilde a %C3%A1.
  const conTildes = armar({ ...base, deberiaDecir: 'á'.repeat(400) });
  const armado = aTextoParaMail(conTildes, 100);
  if (armado) {
    assert.ok(100 + encodeURIComponent(armado.texto).length <= LARGO_MAX_URL);
  }
});

test('D-14: siempre hay una salida, aunque no haya casilla ni portapapeles', () => {
  const vias = disponibles();
  assert.ok(vias.includes('a-la-vista'), 'el piso tiene que estar siempre disponible');
  const piso = ORDEN.find((t) => t.via === 'a-la-vista')!;
  assert.equal(piso.disponible(), true);
});

test('sin casilla configurada, el mail no existe — ni boton muerto ni mailto a la nada', () => {
  if (CASILLA === null) {
    assert.ok(!disponibles().includes('mail'), 'el transporte de mail no puede ofrecerse sin casilla');
  }
});

test('enviar siempre entrega algo, y el texto viaja aunque el transporte falle', async () => {
  const e = await enviar(armar(base));
  assert.notEqual(e.resultado, 'no-pudo', 'la cadena termina en un transporte que no puede fallar');
  assert.ok(e.texto.includes('CL-014'));
});

test('🔴 armar.ts no puede tocar el navegador — auditado sobre el fuente', () => {
  // CTR-10 apartado 3. Al que corrige no se le pide nada (BR-21): un modulo que no puede
  // leer el navegador no puede filtrarlo ni por accidente.
  const fuente = readFileSync('src/lib/correccion/armar.ts', 'utf-8');
  // Se mira el codigo, no los comentarios: el encabezado nombra estas APIs para explicar
  // por que no estan.
  const codigo = fuente
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  for (const prohibida of ['navigator', 'localStorage', 'sessionStorage', 'screen', 'document', 'location', 'crypto', 'new Date', 'Date.now']) {
    assert.ok(!codigo.includes(prohibida), `armar.ts menciona "${prohibida}" en su codigo`);
  }
  assert.ok(!/^import /m.test(codigo), 'armar.ts no deberia importar nada');
});

test('la URL de la pagina no se copia nunca, y por un motivo medido', () => {
  // ADR-02 v2 mete `?n=<nombre>` en los links de desafio: `location.href` puede traer el
  // nombre de un tercero que no tiene nada que ver con la correccion.
  const codigo = readFileSync('src/lib/correccion/armar.ts', 'utf-8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!codigo.includes('location.href'), 'el codigo no puede leer la URL de la pagina');
  const { texto } = aTexto(armar(base));
  assert.ok(!texto.includes('http://localhost'), 'no puede filtrarse la URL de la pagina');
});
