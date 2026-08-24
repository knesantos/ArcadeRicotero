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
 * Los dos que faltan, y lo que falta de cada uno. No se testean todavia porque un test
 * que falla a proposito no es una guarda: es ruido que se aprende a ignorar.
 *
 *  · `US-02` — piso **30** temas (subido de 20 por `producto` el 2026-08-24, `T-99`).
 *    Hoy: 0. Espera los mp3 — `npm run generar-fragmentos`, que necesita ffmpeg y la
 *    discografia del usuario. Ningun rol lo puede producir.
 *  · `US-03` — piso 15 versos. Hoy: 0 en `listo` sobre 226 candidatos. `CTR-04` no deja
 *    jugar un verso sin confirmacion de oido contra el disco, y eso no lo hace un
 *    programa sin mentir.
 */
