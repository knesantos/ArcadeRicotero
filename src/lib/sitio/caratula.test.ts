/**
 * La carátula de cada juego es el casete del portal, en la mano (`D-54`, `UX-35`).
 *
 * Lo que estos tests cierran es que **el portal y la página no puedan contar dos cosas
 * distintas**: el número de pista, la pieza de tapa, el disco que se acredita. Y que ninguna
 * página de juego se olvide de llevarla, que es como empieza siempre una serie que deja de
 * serlo. Cada caso que puede fallar tiene su rojo al lado.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

import { JUEGOS, LADO_B } from './copy.ts';
import { arteDeCasete, discoDeRecorte } from './arte.ts';
import { caratulaDe, pistaDe, primeraOracion, restoDeLaBajada, tapasConCaratula } from './caratula.ts';

const leer = (ruta: string): string => readFileSync(ruta, 'utf-8').replace(/\r\n/g, '\n');

test('cada juego del lado A tiene su carátula, con el número de pista que le da el portal', () => {
  JUEGOS.forEach((c, i) => {
    const caratula = caratulaDe(c.href!);
    assert.equal(caratula.pista, `A${i + 1}`, c.titulo);
    assert.equal(caratula.numero, i + 1, c.titulo);
    assert.equal(caratula.casete.titulo, c.titulo);
  });
});

test('la pieza de la carátula es la misma del casete, y está en disco: no cae al dibujo de repuesto', () => {
  for (const c of JUEGOS) {
    const caratula = caratulaDe(c.href!);
    assert.equal(caratula.arte, arteDeCasete(c.arte), c.titulo);
    assert.notEqual(caratula.arte, '/arte/casete.svg', `${c.titulo}: la pieza no está y cae al casete dibujado`);
    assert.ok(existsSync(`public${caratula.arte}`), `${c.titulo}: falta ${caratula.arte}`);
    assert.ok(caratula.medida, `${c.titulo}: la pieza no se pudo medir`);
  }
});

test('el disco que acredita la carátula es el mismo que acredita el portal por ese casete', () => {
  for (const c of JUEGOS) {
    const { disco } = caratulaDe(c.href!);
    // **Y no es nulo** (`REV-18`, `FIND-107`): comparado solo contra la misma función que usa
    // la carátula, este control pasaba con `null === null`. Los nueve casetes llevan una pieza
    // de tapa (`D-49`), y una pieza de tapa siempre es de un disco.
    assert.ok(disco, `${c.titulo}: la pieza de la carátula no acredita ningún disco`);
    assert.equal(disco, discoDeRecorte(arteDeCasete(c.arte)), c.titulo);
  }
});

test('el número de pista de la carátula es el que el portal imprime en el casete', () => {
  // El portal numera con `pistaDe` en `index.astro`; si un día vuelve a hacer su propia cuenta,
  // este control lo dice. La lista de la carátula usa la misma función y la misma posición.
  const portal = leer('src/pages/index.astro');
  assert.match(portal, /pista: pistaDe\(/);
  JUEGOS.forEach((c, i) => {
    const caratula = caratulaDe(c.href!);
    assert.equal(caratula.pista, pistaDe('A', i));
    assert.equal(caratula.ladoA[i]!.numero, pistaDe('A', i), c.titulo);
  });
});

test('la lista de temas tiene los del lado A y los tres del lado B, y marca uno solo', () => {
  for (const c of JUEGOS) {
    const { ladoA, ladoB } = caratulaDe(c.href!);
    assert.deepEqual(
      ladoA.map((p) => p.titulo),
      JUEGOS.map((j) => j.titulo),
    );
    assert.deepEqual(
      ladoB.map((p) => p.titulo),
      ['Letras y acordes', 'La Redondopedia', 'Bestiario redondo'],
    );
    const actuales = [...ladoA, ...ladoB].filter((p) => p.actual);
    assert.deepEqual(
      actuales.map((p) => p.href),
      [c.href],
      `${c.titulo}: la lista tiene que marcar exactamente el juego de la página`,
    );
    assert.deepEqual(
      ladoB.map((p) => p.numero),
      ['B1', 'B2', 'B3'],
    );
  }
});

test('un juego que no está en el portal no tiene carátula: el build lo dice', () => {
  assert.throws(() => caratulaDe('/juegos/uno-que-no-existe/'), /no está en el lado A/);
});

test('la bajada cortada en dos se vuelve a armar entera: el escritorio no inventa texto', () => {
  for (const c of [...JUEGOS, ...LADO_B]) {
    const primera = primeraOracion(c.baja);
    const resto = restoDeLaBajada(c.baja);
    assert.equal(resto ? `${primera} ${resto}` : primera, c.baja, c.titulo);
  }
  // Una bajada de una sola oración no tiene resto.
  assert.equal(restoDeLaBajada('Nadie te toma examen.'), '');
});

test('el crédito suma el disco de la carátula una sola vez', () => {
  const caratula = caratulaDe('/juegos/adivinar-el-tema/');
  assert.ok(caratula.disco, 'la pieza del lobo es de un disco');
  assert.deepEqual(tapasConCaratula([], caratula), [caratula.disco]);
  assert.deepEqual(tapasConCaratula([caratula.disco!], caratula), [caratula.disco]);
  assert.deepEqual(tapasConCaratula(['Oktubre'], caratula), ['Oktubre', caratula.disco]);
});

/* ------------------------------------------------------------------
   Las páginas: cada juego lleva su carátula, la de su propia ruta.
   ------------------------------------------------------------------ */

/** Las páginas de juego del sitio, barridas del disco y no escritas a mano. */
const PAGINAS = [
  'src/pages/quiz.astro',
  ...readdirSync('src/pages/juegos')
    .filter((f) => f.endsWith('.astro'))
    .map((f) => `src/pages/juegos/${f}`),
];

/**
 * **Skayboy queda afuera, y es la única excepción** (`UX-35` §5): el mueble del fichín es
 * su propia carátula —la chapa de papel, el pie atornillado, la tinta de *Gulp!*— y ocupa el
 * ancho de la mesa entera a ×4. Su escritorio lo resuelve la cabecera acostada de
 * `skayboy.css`. Si mañana deja de ser la excepción, esta línea se borra y el test lo exige.
 */
const SIN_CARATULA = new Set(['src/pages/juegos/skayboy-y-poligirl.astro']);

const rutaDe = (pagina: string): string =>
  pagina === 'src/pages/quiz.astro' ? '/quiz/' : `/juegos/${pagina.split('/').pop()!.replace('.astro', '')}/`;

test('el barrido encuentra las nueve páginas de juego', () => {
  assert.equal(PAGINAS.length, JUEGOS.length);
});

test('cada página de juego pide la carátula de su propia ruta, y la pone última en main', () => {
  const faltan: string[] = [];
  for (const pagina of PAGINAS) {
    if (SIN_CARATULA.has(pagina)) continue;
    const fuente = leer(pagina);
    const ruta = rutaDe(pagina);
    if (!fuente.includes(`caratulaDe('${ruta}')`)) faltan.push(`${pagina}: no pide caratulaDe('${ruta}')`);
    // Hija directa de `main`, para seguir ahí cuando la isla esconde la portada, y **la
    // última**: con el teclado, la lista de once temas no se interpone entre quien llega y el
    // "Jugá" (`UX-35` §6.2). La grilla la pone a la izquierda igual.
    if (!/<Caratula caratula=\{caratula\}( piezaSopla)? \/>\s*<\/main>/.test(fuente)) {
      faltan.push(`${pagina}: la carátula no es el último hijo de main`);
    }
    if (!/<main id="app"[^>]*juego--\$\{caratula\.casete\.variante\}/.test(fuente)) {
      faltan.push(`${pagina}: main no viste el disco del casete (juego--…)`);
    }
    if (!/<PieImprenta [^>]*tapasConCaratula\(/.test(fuente)) {
      faltan.push(`${pagina}: el pie no acredita la pieza de la carátula`);
    }
  }
  assert.deepEqual(faltan, []);
});

test('la excepción sigue siendo una: ninguna otra página de juego se queda sin carátula', () => {
  for (const pagina of SIN_CARATULA) assert.ok(PAGINAS.includes(pagina), `${pagina} ya no existe: sacala de la excepción`);
  assert.equal(SIN_CARATULA.size, 1);
});

test('toda sección de juego de cada página esconde la lista de temas', () => {
  // La lista de la carátula son salidas, y en plena partida no hay salidas (`D-54` punto 2): el CSS
  // la esconde cuando está a la vista una de estas tres zonas. Un juego nuevo con su zona de
  // juego llamada de otra forma dejaría la lista abierta mientras se juega.
  const css = leer('src/styles/juego.css');
  const ZONAS = ['partida', 'pregunta', 'tablero', 'eleccion'];
  for (const zona of ZONAS) {
    assert.match(css, new RegExp(`> #${zona}:not\\(\\[hidden\\]\\)`), `juego.css no esconde la lista con #${zona}`);
  }
  for (const pagina of PAGINAS) {
    if (SIN_CARATULA.has(pagina)) continue;
    const ids = [...leer(pagina).matchAll(/<section id="([\w-]+)" class="pantalla/g)].map((m) => m[1]!);
    assert.ok(['portada', 'inicio'].includes(ids[0]!), `${pagina}: la primera sección no es la portada (${ids[0]})`);
    // **Todas**, y no alguna (`REV-18`, `FIND-103`): con `some` pasaba "Ponelos en fila", cuya
    // elección de conjunto —ya tocado "Empezá"— dejaba la lista a la vista. Lo que no es la
    // portada ni el resultado es juego.
    const sinCubrir = ids.slice(1).filter((id) => id !== 'resultado' && !ZONAS.includes(id));
    assert.deepEqual(sinCubrir, [], `${pagina}: secciones de juego que no esconden la lista`);
  }
});

test('en "Adiviná la tapa" la pieza de la carátula no se ve en partida: es una respuesta', () => {
  // El ojo de buey es de *Último bondi*, respuesta de `TP-006` y distractor de otras dos
  // (`REV-18`, `FIND-100`; el mismo motivo del `sinPasada` de su pie, `D-35`).
  const pagina = leer('src/pages/juegos/adivinar-la-tapa.astro');
  assert.match(pagina, /<Caratula caratula=\{caratula\} piezaSopla \/>/);
  const css = leer('src/styles/juego.css');
  assert.match(css, /main:has\(> #partida:not\(\[hidden\]\)\) > \.caratula--la-pieza-sopla \.caratula-arte \{\s*display: none;/);
  const componente = leer('src/components/Caratula.astro');
  assert.match(componente, /'caratula--la-pieza-sopla': piezaSopla/);
});
