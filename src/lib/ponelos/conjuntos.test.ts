import { test } from 'node:test';
import assert from 'node:assert/strict';

import { leerTemas, slugDeTitulo } from '../letra/temas.ts';
import { FICHAS } from '../cancionero/banco.ts';
import { DISCOS } from '../letra/discos.ts';
import {
  armarConjunto,
  conjuntosOfrecidos,
  semillaNueva,
  idDeDisco,
  LARGO_SORTEO,
  ID_TODOS,
  type Catalogo,
} from './conjuntos.ts';
import { vacio, ubicar, porFila } from './tablero.ts';
import { armarLink, leerReparto } from '../desafio.ts';

/**
 * El catálogo real, armado igual que lo arma la página en build.
 *
 * Contra los datos de verdad y no contra un doble, porque lo que estos casos protegen es
 * justamente que **la derivación de `RES-20` siga dando lo que el juego espera**: un tema
 * que se renumere o un disco que cambie de nombre corre el orden canónico, y los links
 * viejos abren mal en silencio.
 */
function catalogo(): Catalogo {
  return {
    temas: leerTemas().map((t) => ({
      slug: slugDeTitulo(t.titulo),
      titulo: t.titulo,
      disco: t.disco,
      pista: t.pista,
    })),
    discos: FICHAS.map((f) => ({ slug: f.slug, titulo: f.titulo, anio: f.anio })),
  };
}

const CAT = catalogo();

/** Un azar determinista, para que la semilla del sorteo se pueda afirmar. */
function azarFijo(): () => number {
  let n = 0;
  return () => ((n = (n * 1103515245 + 12345) % 2147483648) / 2147483648);
}

/* ==================================================================
   Que cada conjunto sea jugable

   **El piso de `US-08` no está acá**: vive en `src/lib/pisos.test.ts`, con los otros
   cuatro, porque es una guarda de no regresión y no un contrato. Lo que se prueba acá es lo
   otro — que ninguno de los que se ofrecen sea injugable por tamaño.
   ================================================================== */

test('US-08: ningún conjunto es tan chico que no valga repartirlo', () => {
  // Con menos de ocho fichas y cuatro filas, repartir es poner dos en cada una: no hay
  // decisión que tomar. Es el mismo criterio del piso de ítems, aplicado adentro.
  const chicos = conjuntosOfrecidos(CAT)
    .filter((c) => c.cuantas < 8)
    .map((c) => `${c.id} (${c.cuantas})`);
  assert.deepEqual(chicos, []);
});

/*
 * Acá había un tope: "ningún conjunto pasa de dieciséis fichas", porque los 105 temas de un
 * saque eran un juego de veinte minutos. **Lo sacó `D-69`, a pedido del usuario**: *"la
 * gracia de los tierlist así es que sean muchísimas cosas las que estás poniendo en orden,
 * así que más está bien"*. Lo que cuida la sesión corta ya no es achicar el conjunto sino
 * repartir de a una (`mazo.ts`) y que la partida quede guardada para seguirla otro día.
 * El techo que queda es el del link: 120 fichas (`MAX_ITEMS_REPARTO`).
 */
test('D-69: ningún conjunto pasa de lo que el link puede llevar', () => {
  const grandes = conjuntosOfrecidos(CAT)
    .filter((c) => c.cuantas > 120)
    .map((c) => `${c.id} (${c.cuantas})`);
  assert.deepEqual(grandes, []);
});

test('D-69: "Todos los temas" son los 105, en el orden canónico, con el disco al lado', () => {
  const todos = armarConjunto(CAT, ID_TODOS)!;
  assert.ok(todos, 'no se armó "Todos los temas"');
  assert.equal(todos.fichas.length, CAT.temas.length);
  // El orden canónico: disco por disco en el orden de DISCOS, y dentro de cada uno por pista.
  const esperado = DISCOS.flatMap((d) => armarConjunto(CAT, idDeDisco(d)!)!.fichas.map((f) => f.slug));
  assert.deepEqual(todos.fichas.map((f) => f.slug), esperado);
  // Cada ficha dice su disco: es lo que pidió el usuario para reconocerlas.
  for (const f of todos.fichas) {
    const disco = CAT.discos.find((d) => d.slug === f.disco)!;
    assert.equal(f.pie, disco.titulo, `${f.slug} no dice su disco`);
  }
  // Y va primero en la elección.
  assert.equal(conjuntosOfrecidos(CAT)[0]!.id, ID_TODOS);
});

/* ==================================================================
   El orden canónico, que es lo que hace legible un link viejo
   ================================================================== */

test('CTR-13: los diez discos salen en el orden de DISCOS', () => {
  const c = armarConjunto(CAT, 'discos');
  assert.ok(c);
  assert.deepEqual(c!.fichas.map((f) => f.slug), [...DISCOS]);
});

test('CTR-13: los temas de un disco salen por número de pista', () => {
  for (const d of DISCOS) {
    const c = armarConjunto(CAT, idDeDisco(d)!);
    assert.ok(c, `${d} no armó conjunto`);
    const pistas = c!.fichas.map((f) => Number(f.pie));
    assert.deepEqual(pistas, [...pistas].sort((a, b) => a - b), `${d} salió desordenado`);
  }
});

test('CTR-13: cada disco tiene su conjunto, y cada conjunto su disco', () => {
  const ids = DISCOS.map((d) => idDeDisco(d));
  assert.deepEqual(ids, ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10']);
  assert.equal(idDeDisco('un-disco-que-no-existe'), null);
});

test('CTR-13: "los que abren" y "los que cierran" son la primera y la última pista', () => {
  const abren = armarConjunto(CAT, 'abren')!;
  const cierran = armarConjunto(CAT, 'cierran')!;
  assert.equal(abren.fichas.length, DISCOS.length);
  assert.equal(cierran.fichas.length, DISCOS.length);
  for (const d of DISCOS) {
    const suyos = armarConjunto(CAT, idDeDisco(d)!)!.fichas;
    assert.ok(abren.fichas.some((f) => f.slug === suyos[0]!.slug), `falta el que abre ${d}`);
    assert.ok(
      cierran.fichas.some((f) => f.slug === suyos[suyos.length - 1]!.slug),
      `falta el que cierra ${d}`,
    );
  }
});

test('CTR-13: ninguna ficha se repite dentro de un conjunto', () => {
  // Un slug repetido rompe el link en silencio: dos fichas escribirían el mismo lugar.
  for (const r of conjuntosOfrecidos(CAT)) {
    const c = armarConjunto(CAT, r.id)!;
    const slugs = c.fichas.map((f) => f.slug);
    assert.equal(new Set(slugs).size, slugs.length, `${r.id} tiene un slug repetido`);
  }
});

test('CTR-13: cada conjunto trae el formato que el contrato le fija', () => {
  /*
   * **Este caso se escribió al revés la primera vez, y por eso existe así.** Miraba solo
   * la coherencia interna —"si el formato dice tapa, que haya imagen"— y con eso pasaba en
   * verde mientras `discos` y `tapas` se armaban **idénticos**: las mismas diez fichas, la
   * misma tapa, el mismo formato, y de diferencia el título. Un test que solo se pregunta
   * si el código se contradice a sí mismo no puede ver que el código entero esté mal.
   *
   * Ahora se compara contra la tabla de `CTR-13.2`, que es la que decide. `tapas` es el
   * único que se mira; el resto se lee.
   */
  const ESPERADO: Record<string, 'tapa' | 'titulo'> = { tapas: 'tapa' };
  for (const r of conjuntosOfrecidos(CAT)) {
    const c = armarConjunto(CAT, r.id)!;
    assert.equal(c.formato, ESPERADO[c.id] ?? 'titulo', `${c.id} cambió de formato`);
    for (const f of c.fichas) {
      // `D-21`: una tapa en pantalla lleva su crédito, y la lámina imprime el crédito que
      // corresponde según el formato. Si el formato y la imagen se contradicen, la lámina
      // firma una imagen donde no hay un trazo de Rocambole, o se calla cuando hay diez.
      if (c.formato === 'tapa') assert.match(f.imagen ?? '', /^\/tapas\//, `${c.id}/${f.slug}`);
      else assert.equal(f.imagen, null, `${c.id}/${f.slug} trae imagen sin ser de tapa`);
    }
  }
});

test('US-08: no hay dos conjuntos que sean el mismo con otro título', () => {
  /*
   * El piso de `US-08` cuenta conjuntos, así que **dos conjuntos idénticos son un piso
   * inflado**: catorce números donde hay trece pantallas distintas. Es el defecto que tuvo
   * este archivo hasta que `revisor` lo encontró (`FIND-52`), y el que ningún otro test
   * podía ver, porque cada uno era válido por separado.
   *
   * Dos conjuntos pueden compartir las fichas —`discos` y `tapas` comparten las diez— pero
   * entonces tienen que ordenarse mirando cosas distintas, y eso es el formato.
   */
  const vistos = new Map<string, string>();
  for (const r of conjuntosOfrecidos(CAT)) {
    const c = armarConjunto(CAT, r.id)!;
    const huella = c.formato + '|' + c.fichas.map((f) => f.slug + ':' + (f.imagen ?? '')).join(',');
    const gemelo = vistos.get(huella);
    assert.equal(gemelo, undefined, `"${c.id}" es exactamente lo mismo que "${gemelo}"`);
    vistos.set(huella, c.id);
  }
});

/* ==================================================================
   El sorteado: lo único que impide que el juego se agote en una partida
   ================================================================== */

test('el sorteado es reproducible: la misma semilla da los mismos doce', () => {
  // Es la condición para que se pueda compartir. Un sorteo que no se repite es un conjunto
  // que el que recibe el link no puede reconstruir.
  const a = armarConjunto(CAT, 'az-a1b2c3')!;
  const b = armarConjunto(CAT, 'az-a1b2c3')!;
  assert.deepEqual(a.fichas.map((f) => f.slug), b.fichas.map((f) => f.slug));
  assert.equal(a.fichas.length, LARGO_SORTEO);
});

test('dos semillas distintas dan doce temas distintos', () => {
  const a = armarConjunto(CAT, 'az-a1b2c3')!.fichas.map((f) => f.slug);
  const b = armarConjunto(CAT, 'az-z9y8x7')!.fichas.map((f) => f.slug);
  assert.notDeepEqual(a, b);
});

test('la semilla nueva cumple la gramática del id de conjunto de ADR-06', () => {
  const s = semillaNueva(azarFijo());
  assert.match(s, /^az-[a-z0-9]{6}$/);
  assert.ok(s.length <= 24, 'el id no entra en el fragmento');
});

test('un id inventado no arma nada, y el juego abre igual', () => {
  // `null` y no una excepción: el id llega de una dirección que escribió cualquiera.
  for (const id of ['', 'az-', 'az-MAYUS', 'az-cortito', 't0', 't11', 'discos-y-tapas', 'temas']) {
    assert.equal(armarConjunto(CAT, id), null, `armó con "${id}"`);
  }
});

/* ==================================================================
   Ida y vuelta por el link, con datos reales
   ================================================================== */

/** Lo que `leerReparto` necesita saber del catálogo, armado desde los conjuntos reales. */
const fichasDe = (id: string): number | null => armarConjunto(CAT, id)?.fichas.length ?? null;

const BASE = 'https://arcade.example/juegos/ponelos-en-fila/';

test('ADR-06 + CTR-13: una lista real va y vuelve idéntica por la dirección', () => {
  // El caso completo, y lo único que este juego promete al compartir: se arma un reparto,
  // se comparte, se lee, y las cuatro filas tienen exactamente las mismas fichas.
  for (const id of ['discos', 'abren', 't6', 'az-a1b2c3']) {
    const c = armarConjunto(CAT, id)!;
    let r = vacio(c.fichas.length);
    c.fichas.forEach((_, i) => {
      r = ubicar(r, i, (i % 4) + 1);
    });

    const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: id, casillas: r });
    const leido = leerReparto(url, 'ponelos', fichasDe)!;
    assert.ok(leido, `${id} no volvió`);
    assert.equal(leido.conjunto, id);

    const rehecho = armarConjunto(CAT, leido.conjunto)!;
    assert.deepEqual(
      porFila(rehecho, leido.casillas).map((f) => f.fichas.map((x) => x.slug)),
      porFila(c, r).map((f) => f.fichas.map((x) => x.slug)),
      `${id} no volvió igual`,
    );
  }
});

test('una carga de un conjunto no abre en otro de distinto largo', () => {
  // `discos` tiene 10 fichas y `t1` tiene 12: la carga del primero no puede leerse como la
  // del segundo. Es lo que impide que un link viejo pinte una lista inventada.
  const diez = armarConjunto(CAT, 'discos')!;
  const otro = armarConjunto(CAT, 't1')!;
  assert.notEqual(otro.fichas.length, diez.fichas.length, 'el caso dejó de ser el que se quería probar');

  const url = armarLink(BASE, {
    forma: 'reparto',
    juego: 'ponelos',
    conjunto: 'discos',
    casillas: vacio(diez.fichas.length),
  });
  // La misma carga, pero diciendo que es del otro conjunto: no abre.
  const mentida = url.replace('#o=1.discos.', '#o=1.t1.');
  assert.equal(leerReparto(mentida, 'ponelos', fichasDe), null);
});

test('el sorteado también se reconstruye desde un link ajeno', () => {
  // Es la condición que justifica que `conjuntos.ts` corra en el navegador: la semilla
  // viene adentro del id, así que el que recibe el link sortea los mismos doce temas.
  const c = armarConjunto(CAT, 'az-9m2k0q')!;
  const casillas = c.fichas.map((_, i) => (i % 4) + 1);
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: c.id, casillas });
  const leido = leerReparto(url, 'ponelos', fichasDe)!;
  assert.deepEqual(armarConjunto(CAT, leido.conjunto)!.fichas.map((f) => f.slug), c.fichas.map((f) => f.slug));
});

/* ==================================================================
   El hueco declarado
   ================================================================== */

test('el catálogo sale de RES-20 y no del cancionero: los 105 están todos', () => {
  // `D-13`: la ficha manda. El cancionero tiene 104 temas —falta *Sushi*, de Lobo suelto—
  // y armar el juego desde ahí dejaría un disco con un tema menos **sin decirlo**. Esta
  // línea es la que avisa si alguien cambia la fuente por comodidad.
  assert.equal(CAT.temas.length, 105);
  const enJuego = new Set(
    DISCOS.flatMap((d) => armarConjunto(CAT, idDeDisco(d)!)!.fichas.map((f) => f.slug)),
  );
  assert.equal(enJuego.size, 105, 'algún tema de RES-20 no llega a ningún conjunto');
});
