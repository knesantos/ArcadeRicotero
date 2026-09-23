/**
 * Verificación del mapa de rutas (`ADR-07.2`).
 *
 * **Esta es la prueba del riesgo número uno del ciclo 14.** Si el mapa sale corto en una sola
 * ruta, la rocola le sopla la respuesta al que está jugando: los 95 recortes son las
 * respuestas de `US-02`, y los temas enteros son las de `US-03` y `US-07`. No es un defecto
 * que se descubra escuchando —suena perfecto— sino jugando, y para cuando alguien lo note ya
 * le arruinó la partida.
 *
 * Lo que se prueba acá es lo que no se puede ver mirando la pantalla:
 *
 * - que las **siete** rutas de juego caigan en `cama`, una por una y por nombre;
 * - que los tres graves y el instrumento caigan en `muda`, que **no es lo mismo** que `cama`;
 * - que una ruta que nadie clasificó caiga del lado del silencio y no del de la música;
 * - y **el censo**: que no exista una página en `src/pages/` que nadie haya clasificado. Ese
 *   es el candado que hace que el octavo juego no pueda nacer sonando.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { PAGINAS_DECLARADAS, RUTAS_CON_ROCOLA, esPantallaMuda, modoEnRuta } from './rutas-sonoras.ts';
import { SLUGS_GRAVES } from './graves.ts';

/**
 * Las **siete** pantallas donde se juega: las seis de `src/pages/juegos/` más `/quiz/`, que
 * no vive ahí y por eso va aparte.
 *
 * Decía "ocho" en dos lugares y el array siempre tuvo siete. No faltaba un elemento: estaba
 * mal el comentario. Contado contra el disco por `INV-60` — `adivinar-el-tema`,
 * `adivinar-la-tapa`, `adivinar-por-la-letra`, `completar-la-letra`, `dos-ejes`,
 * `ponelos-en-fila`, más el quiz.
 *
 * El octavo juego entra por el censo de más abajo, no por esta lista.
 */
const RUTAS_DE_JUEGO = [
  '/quiz/',
  '/juegos/adivinar-el-tema/',
  '/juegos/adivinar-la-tapa/',
  '/juegos/adivinar-por-la-letra/',
  '/juegos/completar-la-letra/',
  '/juegos/dos-ejes/',
  '/juegos/ponelos-en-fila/',
];

test('🔴 caso 1: ninguna pantalla de juego pone temas, una por una y por nombre', () => {
  for (const ruta of RUTAS_DE_JUEGO) {
    assert.equal(
      modoEnRuta(ruta),
      'cama',
      `${ruta} puede poner temas: le sopla la respuesta al que está jugando`,
    );
  }
});

test('🔴 caso 1b: en los juegos vuelve la CAMA, no el silencio', () => {
  // No es lo mismo y `ADR-07.2` lo elige a propósito: la cama no puede soplar nada —adentro
  // de un `Math.random()` filtrado no hay ningún tema— y cuesta cero bytes. Apagar la cinta
  // entera ahí sería sacarle a la gente algo que ya tenía. Molinete al revés.
  for (const ruta of RUTAS_DE_JUEGO) {
    assert.notEqual(modoEnRuta(ruta), 'muda', `${ruta} quedó muda del todo, no en cama`);
  }
});

test('🔴 caso 2: los tres graves y el instrumento no suenan nada, ni cama', () => {
  for (const slug of SLUGS_GRAVES) {
    assert.equal(modoEnRuta(`/redondopedia/${slug}/`), 'muda', `${slug} no quedó muda`);
    assert.ok(esPantallaMuda(`/redondopedia/${slug}/`));
  }
  assert.equal(modoEnRuta('/diagnostico-audio/'), 'muda');
  assert.ok(esPantallaMuda('/diagnostico-audio/'));
});

test('los tres graves salen de `graves.ts`: una sola verdad sobre quiénes son', () => {
  // Si alguien agrega un cuarto grave allá, este módulo tiene que enterarse solo. Un mapa
  // que reescribiera la lista dejaría la pantalla nueva sonando, y nadie lo notaría.
  assert.equal(SLUGS_GRAVES.length, 3);
  for (const slug of SLUGS_GRAVES) {
    assert.ok(esPantallaMuda(`/redondopedia/${slug}`), 'sin barra final tiene que valer igual');
  }
});

test('caso 4: una ruta que nadie clasificó cae a `cama`, que es el lado del silencio', () => {
  for (const inventada of [
    '/juegos/el-octavo-juego/',
    '/juegos/',
    '/algo/que/no/existe/',
    '/quiz/resultado/',
    '/letras-y-acordes/un-tema/algo-mas/',
  ]) {
    assert.equal(modoEnRuta(inventada), 'cama', `${inventada} nació sonando`);
  }
});

test('las cinco rutas de lectura sí ponen temas: ahí no se responde nada', () => {
  for (const ruta of [
    '/',
    '/letras-y-acordes/',
    '/letras-y-acordes/ji-ji-ji/',
    '/letras-y-acordes/armar-cancionero/',
    '/redondopedia/',
    '/redondopedia/oktubre/',
  ]) {
    assert.equal(modoEnRuta(ruta), 'rocola', `${ruta} no pone temas y debería`);
  }
});

test('un artículo grave gana sobre la regla de la Redondopedia, no al revés', () => {
  // El orden importa: si la lista blanca se mirara primero, `/redondopedia/walter-bulacio/`
  // saldría `rocola` porque encaja en la regla de la Redondopedia. La pregunta por lo mudo
  // va antes, y esta prueba es la que lo fija.
  assert.equal(modoEnRuta('/redondopedia/olavarria-2017/'), 'muda');
  assert.equal(modoEnRuta('/redondopedia/oktubre/'), 'rocola');
});

test('la consulta tolera barra final, ausencia de barra, query y ancla', () => {
  for (const forma of ['/quiz', '/quiz/', '/quiz/?g=1', '/quiz/#arriba', '/quiz?g=1']) {
    assert.equal(modoEnRuta(forma), 'cama', `${forma} se leyó distinto`);
  }
});

test('se compara por segmento y no por parecido', () => {
  // Un artículo que mañana se llame `homenaje-a-walter-bulacio` es otro artículo, y hacerlo
  // callar por parecido sería decidir por adivinanza. Mismo criterio que `esPantallaGrave`.
  assert.equal(modoEnRuta('/redondopedia/homenaje-a-walter-bulacio/'), 'rocola');
  assert.equal(modoEnRuta('/diagnostico-audio-viejo/'), 'cama');
});

// ---------------------------------------------------------------------------------------
// El censo (candado B)
// ---------------------------------------------------------------------------------------

/** Todas las páginas `.astro` de `src/pages/`, tal como las nombra Astro. */
function paginasEnDisco(): string[] {
  const raiz = 'src/pages';
  const encontradas: string[] = [];
  const recorrer = (dir: string): void => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const completa = join(dir, entrada.name);
      if (entrada.isDirectory()) recorrer(completa);
      else if (entrada.name.endsWith('.astro')) {
        encontradas.push(relative(raiz, completa).split(sep).join('/'));
      }
    }
  };
  recorrer(raiz);
  return encontradas.sort();
}

test('🔴 caso 3, el censo: no hay ninguna página que nadie haya clasificado', () => {
  /*
   * **Este es el candado que hace que un juego nuevo no pueda nacer sonando.**
   *
   * No agrega la página sola —eso sería adivinar—, pero tampoco la deja pasar de largo:
   * quien sume una pantalla tiene que abrir `rutas-sonoras.ts`, leer el criterio de
   * `ADR-07.2` y decidir. Si no lo hace, el build se cae acá con el nombre del archivo.
   */
  const enDisco = paginasEnDisco();
  const declaradas = Object.keys(PAGINAS_DECLARADAS).sort();

  const sinClasificar = enDisco.filter((p) => !declaradas.includes(p));
  assert.deepEqual(
    sinClasificar,
    [],
    'hay páginas sin clasificar: abrí `src/lib/sitio/rutas-sonoras.ts` y decidí qué hace la cinta ahí',
  );

  const fantasmas = declaradas.filter((p) => !enDisco.includes(p));
  assert.deepEqual(fantasmas, [], 'hay páginas declaradas que ya no existen en disco');
});

test('🔴 el censo y el mapa dicen lo mismo: cada página declarada resuelve a su modo', () => {
  /*
   * El censo por sí solo no alcanza: alguien podría clasificar una página como `cama` en la
   * tabla y que `modoEnRuta()` devuelva `rocola` para su ruta, y las dos cosas estarían
   * "bien" por separado. Esto las cruza.
   *
   * Las rutas con segmento variable se prueban con un valor de ejemplo que **no** sea grave:
   * los graves tienen su propia prueba arriba, y son la excepción declarada de esa fila.
   */
  const ejemplo: Record<string, string> = {
    'index.astro': '/',
    'quiz.astro': '/quiz/',
    'diagnostico-audio.astro': '/diagnostico-audio/',
    'juegos/adivinar-el-tema.astro': '/juegos/adivinar-el-tema/',
    'juegos/adivinar-la-tapa.astro': '/juegos/adivinar-la-tapa/',
    'juegos/adivinar-por-la-letra.astro': '/juegos/adivinar-por-la-letra/',
    'juegos/completar-la-letra.astro': '/juegos/completar-la-letra/',
    'juegos/dos-ejes.astro': '/juegos/dos-ejes/',
    'juegos/ponelos-en-fila.astro': '/juegos/ponelos-en-fila/',
    'juegos/skayboy-y-poligirl.astro': '/juegos/skayboy-y-poligirl/',
    'letras-y-acordes/index.astro': '/letras-y-acordes/',
    'letras-y-acordes/[slug].astro': '/letras-y-acordes/un-tema/',
    'letras-y-acordes/armar-cancionero.astro': '/letras-y-acordes/armar-cancionero/',
    'redondopedia/index.astro': '/redondopedia/',
    'redondopedia/[slug].astro': '/redondopedia/un-articulo/',
  };
  for (const [pagina, modo] of Object.entries(PAGINAS_DECLARADAS)) {
    const ruta = ejemplo[pagina];
    assert.ok(ruta, `falta la ruta de ejemplo de ${pagina} en esta prueba`);
    assert.equal(modoEnRuta(ruta), modo, `${pagina} está declarada ${modo} y resuelve distinto`);
  }
});

test('la lista blanca es corta y cada regla tiene nombre', () => {
  // Es una lista blanca: si crece sin que nadie lo note, el candado A se afloja en silencio.
  // Que cada regla tenga nombre obliga a decir qué se está abriendo.
  assert.ok(RUTAS_CON_ROCOLA.length <= 5, 'la lista blanca creció: revisá el criterio de ADR-07.2');
  for (const regla of RUTAS_CON_ROCOLA) {
    assert.ok(regla.nombre.length > 0, 'una regla sin nombre no dice qué está abriendo');
  }
});
