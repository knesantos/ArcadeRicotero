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
 * Solo relativas: un paquete de `node_modules` es problema del empaquetador, y este
 * proyecto no tiene ninguno del lado del cliente.
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
