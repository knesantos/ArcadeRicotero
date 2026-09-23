import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

/**
 * Ninguna isla puede arrastrar un módulo de Node al navegador.
 *
 * ## El defecto que escribió este test
 *
 * `tema/paleta.ts` necesitaba la lista de los diez discos y la importó de
 * `letra/temas.ts`, que la exporta — y que **importa `node:fs` en su primera línea**,
 * porque parsea la ficha `RES-20`. En el navegador eso es fatal: Vite deja el módulo
 * afuera, la importación tira, y con la isla muerta **el juego entero deja de responder**.
 * La portada quedaba dibujada y no pasaba nada al tocar un disco.
 *
 * Lo grave no es el error, es **quién no lo vio**:
 *
 * - `npm test` pasó: en Node, `fs` existe.
 * - `npm run check` pasó: los tipos estaban perfectos.
 * - `npm run build` no se queja: la página es estática y sale igual.
 *
 * Lo agarró abrir la página en un navegador. Es exactamente la clase de defecto que este
 * proyecto ya decidió no dejar librada a que alguien mire: *"no dar por terminado nada
 * sin una verificación que se pueda correr"*.
 *
 * ## Cómo lo revisa
 *
 * Sigue el grafo de importaciones desde cada archivo de `src/scripts/` —que es lo único
 * que llega al navegador— y falla si en el camino aparece un `node:*`. Es el mismo
 * mecanismo con el que `correccion/armar.test.ts` lee el fuente para probar que ese
 * módulo no puede tocar el navegador; acá va en la dirección contraria.
 *
 * **No mira solo el archivo de la isla, mira todo lo que alcanza.** Eso es lo que
 * importa: `paleta.ts` no tenía ni una línea de Node, y sin embargo lo traía.
 *
 * ## Lo segundo que mira, desde el ciclo 15: qué paquete de npm llega al teléfono
 *
 * El mismo recorrido, por la otra puerta. Hasta que se instaló `kaplay`, este archivo
 * afirmaba por escrito que el proyecto no tenía ni un paquete del lado del cliente, y sobre
 * esa frase se apoyaba para no mirarlos. `ADR-08.7` lo avisó antes de que pasara: adoptar un
 * motor vuelve falsa la premisa, y **un guardián apoyado en una premisa falsa no avisa
 * nada** — se queda verde mientras la puerta queda abierta. Se comprobó el 2026-09-18 con la
 * isla de humo puesta: `npm test` no dijo una palabra del `import kaplay from 'kaplay'`.
 *
 * Así que el recorrido junta también las importaciones **desnudas** y las compara contra
 * `PAQUETES_DE_CLIENTE`, que es una lista blanca como el censo de `rutas-sonoras.ts`: lo que
 * no está declarado no pasa. **El paquete nuevo nace prohibido**, y el que quiera sumar uno
 * tiene que venir hasta esa línea y leer por qué existe.
 */

const leer = (ruta: string): string => readFileSync(ruta, 'utf-8').replace(/\r\n/g, '\n');

/** Las islas: lo único del repo que se descarga y corre en el teléfono de la gente. */
function islas(): string[] {
  return readdirSync('src/scripts')
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .map((f) => join('src/scripts', f));
}

/**
 * Las importaciones relativas de un archivo que **existen en tiempo de ejecución**.
 *
 * Solo relativas, porque son las que hay que seguir para armar el grafo. **Las desnudas las
 * junta `paquetes()`, acá abajo.** Hasta el ciclo 15 esta frase decía otra cosa —*"un
 * paquete de `node_modules` es problema del empaquetador, y este proyecto no tiene ninguno
 * del lado del cliente"*— y era verdad el día que se escribió; dejó de serlo el día que se
 * instaló el motor, sin que nadie tocara este archivo. Queda anotado acá porque un
 * comentario que miente es peor que ninguno: el que lo lee deja de mirar donde dice que no
 * hay nada (`ADR-08.7`).
 *
 * **Y solo las de valor: `import type` no cuenta, y no es un detalle.** TypeScript borra
 * esas líneas al compilar, así que no llegan al navegador ni arrastran nada. La primera
 * versión de este test las contaba y acusó a `completar-la-letra` de traer `node:fs`
 * cuando lo único que importa de ahí son dos tipos. Un guardián que grita por algo que no
 * pasa se termina apagando, y con él se apagan los avisos que sí importan.
 */
function importaciones(fuente: string): string[] {
  const rutas: string[] = [];
  const patron = /(?:^|\n)\s*(?:import|export)\s+(?!type\s)[\s\S]*?from\s+['"](\.[^'"]+)['"]/g;
  for (const m of fuente.matchAll(patron)) rutas.push(m[1]!);
  return rutas;
}

/** Los `node:*` que un archivo pide directamente. */
function modulosDeNode(fuente: string): string[] {
  return [...fuente.matchAll(/from\s+['"](node:[^'"]+)['"]/g)].map((m) => m[1]!);
}

/**
 * Los paquetes de npm que pueden llegar al navegador. **Es una lista blanca, como el censo
 * de `rutas-sonoras.ts`**: lo que no está acá no pasa, y el que quiera agregar uno tiene que
 * venir hasta esta línea y leer por qué existe (`ADR-08.7`).
 *
 * Hoy tiene un solo miembro, y no es casualidad que sea el primero: `kaplay` es la primera
 * pieza de terceros que corre en el teléfono de la gente (`ADR-08`). Va pineada exacta en
 * `package.json` por la misma razón por la que está sola acá.
 */
const PAQUETES_DE_CLIENTE = ['kaplay'] as const;

/**
 * `Set<string>` y no el `Set` de literales que infiere el `as const`, que es la lección que
 * `movimiento.test.ts` ya pagó: con el tipo estrecho, `has()` solo acepta los nombres que ya
 * conocemos — o sea, justo los que este test sale a buscar.
 */
const PERMITIDOS = new Set<string>(PAQUETES_DE_CLIENTE);

/** Sin comentarios: un paquete nombrado en una explicación no es una importación. */
const sinComentarios = (fuente: string): string =>
  fuente.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');

/**
 * Los paquetes de npm que un archivo pide **en tiempo de ejecución**.
 *
 * Las tres formas de traer uno, porque alcanza con que una quede afuera para que la lista
 * blanca no sirva: `import x from 'pkg'` (y su `export … from`), el de solo efecto
 * `import 'pkg'`, y el dinámico `import('pkg')`.
 *
 * Dos cosas quedan afuera a propósito y ninguna es un descuido:
 *
 * - **Los `node:*`**, que van por la otra puerta de este archivo y tienen su propio mensaje.
 * - **`import type`**, por lo mismo que en `importaciones()`: TypeScript lo borra y al
 *   navegador no llega nada.
 *
 * El nombre se recorta a la raíz del paquete —`ajv/dist/2020.js` es `ajv`— porque lo que se
 * declara es el paquete, no cada archivo que alguien le saque adentro.
 */
function paquetes(fuente: string): string[] {
  const limpio = sinComentarios(fuente);
  const crudos: string[] = [];
  const formas = [
    /(?:^|\n)\s*(?:import|export)\s+(?!type\s)[\s\S]*?from\s+['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*import\s+['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const forma of formas) for (const m of limpio.matchAll(forma)) crudos.push(m[1]!);

  const raiz = (especificador: string): string => {
    const partes = especificador.split('/');
    return especificador.startsWith('@') ? partes.slice(0, 2).join('/') : partes[0]!;
  };
  const desnudos = crudos.filter((e) => !e.startsWith('.') && !e.startsWith('node:'));
  return [...new Set(desnudos.map(raiz))].sort();
}

/**
 * Recorre el grafo desde una isla y junta los paquetes que nadie declaró.
 *
 * Mismo recorrido que `caminoHastaNode` y por el mismo motivo: `paleta.ts` demostró que el
 * archivo de la isla puede estar impecable y traer igual lo que no tiene que traer. Devuelve
 * el camino entero hasta el paquete, no el nombre del paquete solo.
 */
function paquetesSinDeclarar(entrada: string): string[] {
  const vistos = new Set<string>();
  const pila: Array<{ ruta: string; camino: string[] }> = [{ ruta: entrada, camino: [entrada] }];
  const sueltos: string[] = [];

  while (pila.length > 0) {
    const { ruta, camino } = pila.pop()!;
    if (vistos.has(ruta) || !existsSync(ruta)) continue;
    vistos.add(ruta);

    const fuente = leer(ruta);
    for (const paquete of paquetes(fuente)) {
      if (!PERMITIDOS.has(paquete)) sueltos.push([...camino, paquete].join('\n     → '));
    }

    for (const relativa of importaciones(fuente)) {
      const destino = normalize(join(dirname(ruta), relativa));
      pila.push({ ruta: destino, camino: [...camino, destino] });
    }
  }
  return sueltos;
}

/**
 * Recorre el grafo desde una isla y devuelve el primer camino que llega a Node.
 *
 * Devuelve el **camino entero**, no el archivo culpable: cuando esto falla, lo que hace
 * falta saber no es "qué archivo importa `fs`" sino "por dónde llegué hasta él".
 */
function caminoHastaNode(entrada: string): string[] | null {
  const vistos = new Set<string>();
  const pila: Array<{ ruta: string; camino: string[] }> = [{ ruta: entrada, camino: [entrada] }];

  while (pila.length > 0) {
    const { ruta, camino } = pila.pop()!;
    if (vistos.has(ruta) || !existsSync(ruta)) continue;
    vistos.add(ruta);

    const fuente = leer(ruta);
    const node = modulosDeNode(fuente);
    if (node.length > 0) return [...camino, node[0]!];

    for (const relativa of importaciones(fuente)) {
      const destino = normalize(join(dirname(ruta), relativa));
      pila.push({ ruta: destino, camino: [...camino, destino] });
    }
  }
  return null;
}

test('ninguna isla llega a un modulo de Node, ni por el camino mas largo', () => {
  const culpables: string[] = [];
  for (const isla of islas()) {
    const camino = caminoHastaNode(isla);
    if (camino) culpables.push(camino.join('\n     → '));
  }
  assert.deepEqual(
    culpables,
    [],
    `una isla arrastra Node al navegador:\n\n  ${culpables.join('\n\n  ')}\n`,
  );
});

test('el test sabe encontrar un camino largo: se prueba contra uno que existe', () => {
  // Un test que solo verifica ausencias no prueba que sepa buscar. `catalogo.ts` corre en
  // build y llega a `node:fs` por `letra/temas.ts`, dos saltos: si el recorrido dejara de
  // funcionar, este caso lo delata antes de que el de arriba se vuelva verde por vago.
  const camino = caminoHastaNode('src/lib/tema/catalogo.ts');
  assert.ok(camino, 'el recorrido no encontro un camino a Node que existe de verdad');
  assert.ok(camino.length >= 3, `el camino quedo corto: ${camino.join(' -> ')}`);
  assert.match(camino[camino.length - 1]!, /^node:/);
});

test('un import de solo tipos no cuenta como camino', () => {
  // `completar-la-letra` importa `Item` y `Opcion` de `letra/banco.ts`, que si llega a
  // `node:fs`. Es un `import type`: TypeScript lo borra y al navegador no llega nada.
  // Este caso esta escrito porque la primera version del test lo daba por culpable.
  const isla = leer('src/scripts/partida-letra.ts');
  assert.match(isla, /import type \{[^}]*\} from '\.\.\/lib\/letra\/banco\.ts'/);
  assert.equal(caminoHastaNode('src/scripts/partida-letra.ts'), null);
});

test('ADR-08.7: ninguna isla importa un paquete que la lista blanca no declare', () => {
  // El agujero que abrio la instalacion del motor: hasta este caso, una isla podia importar
  // cualquier cosa de `node_modules` y ningun test miraba. Lo que se declara es el paquete,
  // y se declara aca arriba: agregarlo es una decision que alguien firma, no un `npm i`.
  const sueltos: string[] = [];
  for (const isla of islas()) sueltos.push(...paquetesSinDeclarar(isla));
  assert.deepEqual(
    sueltos,
    [],
    `una isla trae un paquete que PAQUETES_DE_CLIENTE no declara:\n\n  ${sueltos.join('\n\n  ')}\n\n` +
      'Si tiene que llegar al telefono de la gente, sumalo a esa lista y deci por que. ' +
      'Si no, sacalo de la isla.\n',
  );
});

test('esa lista sabe encontrar: se prueba contra fuentes inventadas', () => {
  // Un test que solo verifica ausencias no demuestra que sepa buscar, y hoy no hay un solo
  // paquete en una isla: sin estos casos, el de arriba estaria verde por vacio. Las fuentes
  // son inventadas y no salen del disco, que es la leccion de los censos hermanos.
  assert.deepEqual(paquetes(`import kaplay from 'kaplay';`), ['kaplay']);
  assert.deepEqual(paquetes(`import 'phaser';`), ['phaser']);
  assert.deepEqual(paquetes(`const m = await import('matter-js');`), ['matter-js']);
  assert.deepEqual(paquetes(`export { X } from 'excalibur';`), ['excalibur']);
  // El nombre se recorta a la raiz del paquete, con y sin alcance.
  assert.deepEqual(paquetes(`import Ajv from 'ajv/dist/2020.js';`), ['ajv']);
  assert.deepEqual(paquetes(`import { g } from '@scope/cosa/sub.js';`), ['@scope/cosa']);
  // Y las cuatro que NO son un paquete de cliente: lo relativo, lo de Node, lo de solo
  // tipos —que TypeScript borra— y un nombre que vive adentro de un comentario.
  assert.deepEqual(paquetes(`import { X } from './vecino.ts';`), []);
  assert.deepEqual(paquetes(`import { readFileSync } from 'node:fs';`), []);
  assert.deepEqual(paquetes(`import type { GameObj } from 'kaplay';`), []);
  assert.deepEqual(paquetes(`// ninguna isla importa 'phaser'\nconst x = 1;`), []);
  assert.deepEqual(paquetes(`/* el humo importaba 'kaplay' */\nconst x = 1;`), []);
  // Y el filtro de la lista blanca, que es la otra mitad: `kaplay` pasa, el resto no.
  assert.ok(PERMITIDOS.has('kaplay'), 'el motor de ADR-08 dejo de estar declarado');
  assert.ok(!PERMITIDOS.has('phaser'), 'la lista blanca dejo de ser blanca');
});

test('ese recorrido encuentra un paquete que esta a dos saltos, no solo en la isla', () => {
  // La mitad que de verdad protege, y la que `paleta.ts` enseño: el archivo de la isla puede
  // estar impecable y traer igual lo que no tiene que traer. Se prueba contra el camino
  // largo que ya existe —`catalogo.ts` llega a `letra/temas.ts`— sin declarar nada nuevo:
  // si el recorrido dejara de seguir importaciones, este caso lo delata.
  const camino = caminoHastaNode('src/lib/tema/catalogo.ts');
  assert.ok(camino && camino.length >= 3, 'el recorrido que este caso reusa dejo de funcionar');
  // Y la lista blanca con un solo miembro no deja pasar a los otros dos finalistas de
  // `RES-62`, que son los nombres que mas cerca estuvieron de terminar en un `package.json`.
  for (const descartado of ['littlejs', 'phaser']) {
    assert.ok(!PERMITIDOS.has(descartado), `${descartado} no es el motor de ADR-08`);
  }
});

test('la lista de discos es la misma de los dos lados', () => {
  // El arreglo fue partir la constante en un archivo hoja. Lo que no puede pasar es que
  // se hayan vuelto dos listas: seria cambiar un defecto ruidoso por uno silencioso.
  const hoja = leer('src/lib/letra/discos.ts');
  const temas = leer('src/lib/letra/temas.ts');
  assert.match(temas, /export \{ DISCOS.*\} from '\.\/discos\.ts'/, 'temas.ts no re-exporta la hoja');
  assert.ok(
    !/^\s*export const DISCOS = \[/m.test(temas),
    'temas.ts volvio a declarar su propia lista de discos',
  );
  assert.match(hoja, /^\s*export const DISCOS = \[/m, 'la hoja dejo de declarar la lista');
});
