/**
 * Los pisos de items que ya se cumplieron no vuelven a bajar.
 *
 * **Por que existe este archivo.** `producto` fija un piso por juego en
 * `Docs/PRODUCTO/PRD-alcance-v1.md`, y la regla es explicita: *"Ningun juego cierra un
 * ciclo por debajo de su piso"*. Pero hasta el ciclo 7 el unico piso con guarda corrible
 * era el de `US-04`. El del quiz decia `>= 20` cuando el piso es 40, y el de la
 * Redondopedia decia `>= 20` cuando el piso es 35 — los dos escritos cuando el banco
 * estaba a medio llenar, y nunca subidos al alcanzarse.
 *
 * Un piso que se cumple una vez y despues nadie mira es un piso que se puede perder
 * borrando un item, sin que nada avise.
 *
 * **Que guarda y que no.** Solo los pisos **ya alcanzados**: es una guarda de no
 * regresion, no una lista de deseos. `US-02` y `US-03` todavia no llegaron, y sus lineas
 * estan abajo comentadas con lo que falta — se prenden el dia que se cumplen, en el mismo
 * ciclo que las cumpla.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { leerTemas, slugDeTitulo } from './letra/temas.ts';
import { FICHAS } from './cancionero/banco.ts';
import { conjuntosOfrecidos } from './ponelos/conjuntos.ts';

interface ItemQuiz {
  readonly categoria: string;
  readonly dificultad: string;
  readonly estado: string;
}

function leer<T>(archivo: string): T {
  return JSON.parse(readFileSync(`src/data/${archivo}.json`, 'utf-8')) as T;
}

function contar(valores: readonly string[]): Readonly<Record<string, number>> {
  const cuenta: Record<string, number> = {};
  for (const v of valores) cuenta[v] = (cuenta[v] ?? 0) + 1;
  return cuenta;
}

/**
 * `US-01`, piso 40. No alcanza con el total: el piso de `producto` tiene tres condiciones
 * y las tres se pueden romper por separado sin que el total se mueva.
 *  1. 40 items jugables.
 *  2. Minimo 10 por cada una de las cuatro categorias.
 *  3. Minimo 10 faciles, 15 medias y 15 dificiles — para que `BR-01` pueda escalonar.
 * Cerrado en el ciclo 7 con las 10 preguntas de `letras` (`CNT-08`).
 */
test('US-01: el piso de 40 preguntas sigue cumplido, con su reparto', () => {
  const { items } = leer<{ items: readonly ItemQuiz[] }>('quiz');
  const jugables = items.filter((i) => i.estado === 'listo');

  assert.ok(jugables.length >= 40, `el piso de US-01 es 40 y hay ${jugables.length} jugables`);

  const porCategoria = contar(jugables.map((i) => i.categoria));
  for (const categoria of ['historia', 'discos', 'letras', 'mitologia']) {
    assert.ok(
      (porCategoria[categoria] ?? 0) >= 10,
      `la categoria ${categoria} tiene ${porCategoria[categoria] ?? 0} y el piso pide 10`,
    );
  }

  const porNivel = contar(jugables.map((i) => i.dificultad));
  for (const [nivel, minimo] of [
    ['facil', 10],
    ['media', 15],
    ['dificil', 15],
  ] as const) {
    assert.ok(
      (porNivel[nivel] ?? 0) >= minimo,
      `nivel ${nivel}: hay ${porNivel[nivel] ?? 0} y el piso pide ${minimo}`,
    );
  }
});

/** `US-05`, piso 35. Cerrado en el ciclo 6. La guarda vieja pedia 20 y quedo corta. */
test('US-05: el piso de 35 articulos de la Redondopedia sigue cumplido', () => {
  const { articulos } = leer<{ articulos: readonly unknown[] }>('redondopedia');
  assert.ok(articulos.length >= 35, `el piso de US-05 es 35 y hay ${articulos.length}`);
});

/**
 * 🔴 **Los dos que faltaban llegaron el 2026-08-27, y nadie prendio su guarda.**
 *
 * El encabezado de este archivo fija la regla: las lineas de un piso *"se prenden el dia
 * que se cumplen, en el mismo ciclo que las cumpla"*. `US-02` paso de 0 a 95 y `US-03` de
 * 0 a 21 en el ciclo 9, y el comentario que decia "Hoy: 0" para los dos siguio ahi cinco
 * dias — describiendo un repo que ya no existia.
 *
 * Lo encontro `REV-09` (`FIND-34`) y lo cierra `T-174` del ciclo 10. **Es exactamente el
 * riesgo que este archivo existe para cubrir:** los dos pisos que mas costaron —cuatro
 * ciclos el del audio— eran los unicos dos sin guarda de no regresion. Borrar un mp3 los
 * bajaba en silencio.
 */

/**
 * `US-02`, piso **30** temas con fragmento (subido de 20 por `producto` el 2026-08-24,
 * `T-99`). Cumplido el 2026-08-27 con los 95 fragmentos del PR #8.
 *
 * **Se cuenta sobre el manifiesto, que es la lista de archivos que existen de verdad.**
 * La cuota de 8 Faciles **no se testea aca y no es un olvido**: la dificultad de este
 * juego no vive en el dato, se deriva en build del conteo citado de setlist.fm (`D-45`,
 * `BR-18` h, `CTR-19.5`). La cuenta de los 8 sobre el pozo real vive en
 * `src/lib/escalonar.test.ts` y en `src/lib/en-vivo.test.ts` (t5).
 */
test('US-02: el piso de 30 temas con fragmento sigue cumplido', () => {
  const { fragmentos } = leer<{ fragmentos: readonly unknown[] }>('adivinar-tema');
  assert.ok(fragmentos.length >= 30, `el piso de US-02 es 30 y hay ${fragmentos.length}`);
});

/**
 * `US-03`, piso 15 versos. Cumplido el 2026-08-27 con 21, cuando `D-25` abrio el candado
 * de `CTR-04` y `T-138` eligio los versos de menor riesgo de transcripcion.
 *
 * Se cuenta sobre `estado: "listo"` y no sobre el total: el archivo tiene ~1.500
 * candidatos y contar esos seria contar otra cosa.
 */
test('US-03: el piso de 15 versos jugables sigue cumplido', () => {
  const { items } = leer<{ items: readonly { estado: string; dificultad: string }[] }>('letra');
  const jugables = items.filter((i) => i.estado === 'listo');
  assert.ok(jugables.length >= 15, `el piso de US-03 es 15 y hay ${jugables.length} en listo`);

  // `BR-01` necesita con que abrir la partida. Sin un solo facil, `armarRonda` tira.
  const faciles = jugables.filter((i) => i.dificultad === 'facil').length;
  assert.ok(faciles >= 1, 'US-03 no tiene ningun verso facil: BR-01 no puede abrir la partida');
});

/**
 * `US-08`, piso **14 conjuntos ordenables**. Cumplido el dia que se construyo el juego.
 *
 * **Se cuenta en conjuntos y no en fichas, y esa es la parte que hay que entender.** Las
 * 105 fichas ya estaban en el repo antes del juego: salen de `RES-20` y de `FICHAS`, no las
 * cargo nadie una por una. Un piso por item habria medido trabajo que nadie hizo y se
 * habria cumplido solo el dia uno. Lo que de verdad se puede agotar en este juego es **la
 * cantidad de listas distintas que hay para armar** — un conjunto ordenado queda ordenado
 * para siempre—, y eso es lo que este numero protege.
 *
 * Producto lo fijo en el techo entero y no en un subconjunto (`PRD-ponelos-en-fila.md`):
 * con el contenido ya disponible, un piso mas bajo dejaria material gratis afuera.
 */
test('US-08: el piso de 14 conjuntos ordenables sigue cumplido', () => {
  const catalogo = {
    temas: leerTemas().map((t) => ({
      slug: slugDeTitulo(t.titulo),
      titulo: t.titulo,
      disco: t.disco,
      pista: t.pista,
    })),
    discos: FICHAS.map((f) => ({ slug: f.slug, titulo: f.titulo, anio: f.anio })),
  };
  const ofrecidos = conjuntosOfrecidos(catalogo);
  assert.ok(ofrecidos.length >= 14, `el piso de US-08 es 14 y hay ${ofrecidos.length}`);

  // Y ninguno puede quedar sin fichas: un conjunto vacio en el menu es una puerta que no
  // abre, que es la version de este juego del "banco a medio llenar" del riesgo 4.
  const vacios = ofrecidos.filter((c) => c.cuantas === 0).map((c) => c.id);
  assert.deepEqual(vacios, []);
});
