import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { claseDisco, clases, DISCOS, PREFIJO } from './paleta.ts';

/**
 * El control de que la mezcla por disco esté completa de punta a punta.
 *
 * Es el mismo mecanismo de `FIND-15`, que encontró clases que el código creaba y ninguna
 * hoja pintaba. Acá la cadena tiene un eslabón más: la clase la escribe la isla, la pinta
 * `juego.css`, y el valor sale de `tokens.css`. Un disco al que le falte cualquiera de
 * los tres se revelaría sin color y **nadie se daría cuenta mirando la pantalla** — se
 * vería igual que la sección.
 */

const leer = (ruta: string): string => readFileSync(ruta, 'utf-8').replace(/\r\n/g, '\n');

const CSS = leer('src/styles/juego.css');
const TOKENS = leer('src/styles/tokens.css');

test('los diez discos tienen su tinta y su apoyo medidos en tokens.css', () => {
  const faltan = DISCOS.filter(
    (d) => !TOKENS.includes(`--disco-${d}-tinta:`) || !TOKENS.includes(`--disco-${d}-apoyo:`),
  );
  assert.deepEqual(faltan, [], `discos sin color medido en tokens.css: ${faltan.join(', ')}`);
});

test('los diez discos tienen una regla que los pinta en juego.css', () => {
  const faltan = clases().filter((c) => !CSS.includes(`.${c}`));
  assert.deepEqual(faltan, [], `clases de disco sin regla: ${faltan.join(', ')}`);
});

test('cada regla de disco toma su color del token de ESE disco, no de otro', () => {
  // El error que este test existe para cazar es de copiar y pegar: diez bloques casi
  // iguales y uno que quedo apuntando al token del de arriba. En pantalla se veria
  // perfecto — un color medido de una tapa real — y estaria diciendo que "Susanita" es
  // de Oktubre.
  for (const disco of DISCOS) {
    const clase = `.${PREFIJO}${disco}`;
    const desde = CSS.indexOf(`${clase} {`);
    assert.ok(desde >= 0, `falta el bloque de ${clase}`);
    const bloque = CSS.slice(desde, CSS.indexOf('}', desde));
    assert.ok(
      bloque.includes(`var(--disco-${disco}-tinta)`),
      `${clase} no usa la tinta de su propio disco`,
    );
    assert.ok(
      bloque.includes(`var(--disco-${disco}-apoyo)`),
      `${clase} no usa el apoyo de su propio disco`,
    );
  }
});

test('un disco desconocido no inventa un color: se queda sin clase', () => {
  // Un slug que no es de los diez no puede pintar la pantalla de cualquier cosa. Es el
  // mismo criterio con el que `arte.ts` devuelve null cuando el recorte no existe.
  assert.equal(claseDisco('gulp'), 'disco--gulp');
  assert.equal(claseDisco('un-disco-que-no-existe'), '');
  assert.equal(claseDisco(''), '');
});

test('las islas escriben la clase por este modulo y no a mano', () => {
  // Si maniana alguien arma la clase concatenando en una isla, este test no lo ve — pero
  // el de arriba tampoco lo protegeria. Lo que se verifica es que la isla IMPORTE el
  // modulo: mientras la unica via sea `claseDisco`, el slug desconocido no puede pasar.
  //
  // Son DOS islas desde `US-07`: los dos juegos de sacar temas revelan un tema, y los dos
  // tienen que vestirlo con la tinta de su disco. Cuando esto miraba solo a una, el juego
  // de la letra revelaba los 89 temas con el mismo par verde/rojo de estado.
  for (const isla of ['src/scripts/partida-tema.ts', 'src/scripts/partida-por-la-letra.ts']) {
    assert.match(leer(isla), /claseDisco/, `${isla} no usa claseDisco`);
  }
});
