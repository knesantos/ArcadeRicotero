/**
 * Guardas de `T-533`: **ningún tema del sorteo arranca en silencio, y la escalera no
 * promete más audio del que hay.**
 *
 * Tiene dos mitades. La primera prueba la regla (`arranque.ts`) con señales armadas a
 * mano. La segunda la corre contra lo real: las envolventes medidas de los mp3
 * (`scripts/fragmentos-envolvente.json`) y el manifiesto que lee el juego
 * (`src/data/adivinar-tema.json`). Si alguien edita un `inicioSeg` a mano, cambia un mp3
 * sin volver a medir, o mueve un umbral sin regenerar, esto se pone rojo y dice cuál.
 *
 * Para volver a ponerlo verde: `npm run medir-fragmentos` (o `-- --aplicar` si solo cambió
 * la regla).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import {
  codificarEnvolvente,
  decidirArranque,
  decodificarEnvolvente,
  medirInicio,
  nivelDb,
  PISO_DB,
  RESTO_MINIMO_SEG,
  UMBRAL_DB,
  VENTANA_MS,
} from './arranque.ts';
import { ESCALERA, ventana } from './escalera.ts';
import { catalogo, type Manifiesto } from './catalogo.ts';

// ---------------------------------------------------------------- la regla, a mano

/** Una envolvente de `segundos` armada por tramos: `[hastaSeg, dB]`, en orden. */
function envolvente(segundos: number, tramos: ReadonlyArray<readonly [number, number]>): number[] {
  const n = Math.round((segundos * 1000) / VENTANA_MS);
  return Array.from({ length: n }, (_, i) => {
    const t = (i * VENTANA_MS) / 1000;
    return (tramos.find(([hasta]) => t < hasta) ?? tramos[tramos.length - 1]!)[1];
  });
}

test('un fragmento que suena desde el principio arranca en 0', () => {
  assert.equal(medirInicio(envolvente(10, [[10, -15]])), 0);
});

test('el silencio de adelante se saltea: el arranque es el primer sonido', () => {
  const env = envolvente(10, [
    [0.84, -70],
    [10, -18],
  ]);
  assert.equal(medirInicio(env), 0.84);
  assert.deepEqual(decidirArranque(env, 10), { inicioSeg: 0.84, sorteo: true, motivo: null });
});

test('un clic no es un arranque: 10 ms fuertes y después nada no alcanzan', () => {
  // Es el caso que una regla de "primera ventana sobre el umbral" deja pasar, y el motivo
  // por el que el arranque mira la décima entera: el paso 1 sonaría a un chasquido.
  const env = envolvente(10, [
    [0.5, -70],
    [0.51, -6],
    [3, -70],
    [10, -18],
  ]);
  assert.equal(medirInicio(env), 3);
});

test('lo que queda bajo el umbral no arranca nunca, y sale del sorteo', () => {
  // `dr-saturno`: todo el recorte a −34 dBFS. No es silencio, pero por el parlante de un
  // teléfono no se oye, y ningún `inicioSeg` lo arregla.
  const env = envolvente(10, [[10, UMBRAL_DB - 4]]);
  assert.deepEqual(decidirArranque(env, 10), { inicioSeg: null, sorteo: false, motivo: 'sin-arranque' });
});

test('si después del arranque no queda el penúltimo paso, sale del sorteo', () => {
  const justo = envolvente(10, [
    [10 - RESTO_MINIMO_SEG, -70],
    [10, -18],
  ]);
  assert.equal(decidirArranque(justo, 10).sorteo, true, 'con el resto justo, entra');
  const tarde = envolvente(10, [
    [10 - RESTO_MINIMO_SEG + 0.01, -70],
    [10, -18],
  ]);
  assert.deepEqual(decidirArranque(tarde, 10), {
    inicioSeg: 10 - RESTO_MINIMO_SEG + 0.01,
    sorteo: false,
    motivo: 'arranque-tardio',
  });
});

test('la envolvente sobrevive a guardarse: medio dB de error como mucho', () => {
  const env = [-100, -73.26, -30.1, -12.74, 0];
  const vuelta = decodificarEnvolvente(codificarEnvolvente(env));
  env.forEach((v, i) => assert.ok(Math.abs(v - vuelta[i]!) <= 0.25, `${v} volvió como ${vuelta[i]}`));
});

test('el nivel de un tramo promedia potencia, no decibeles', () => {
  // Media décima a −10 y media en silencio dan −13, no −55.
  const env = envolvente(0.1, [
    [0.05, -10],
    [0.1, PISO_DB],
  ]);
  assert.ok(Math.abs(nivelDb(env, 0, 0.1) - -13.01) < 0.05);
});

// ---------------------------------------------------------------- la ventana (escalera.ts)

test('la ventana arranca en el primer sonido', () => {
  assert.deepEqual(ventana(0.1, 0.84, 10), { desdeSeg: 0.84, duraSeg: 0.1 });
  assert.deepEqual(ventana(8, 2, 10), { desdeSeg: 2, duraSeg: 8 });
});

test('🔴 el último paso es el resto: desde el primer sonido hasta el final, sin volver atrás', () => {
  // Antes se corría a [0, 10] para completar los 10 s, y metía la entrada muda adentro:
  // "Dame 2 s más" daba silencio. Ahora suena lo que queda y se llama "el resto".
  const v = ventana(10, 0.84, 10);
  assert.equal(v.desdeSeg, 0.84);
  assert.ok(Math.abs(v.duraSeg - 9.16) < 1e-9);
});

test('🔴 ningún paso reproduce audio anterior al primer sonido, ni se sale del archivo', () => {
  for (const inicio of [0, 0.3, 1.67, 2, 9.9]) {
    for (const p of ESCALERA) {
      for (const largo of [10, 10.06, 9.5]) {
        const v = ventana(p.segundos, inicio, largo);
        assert.equal(v.desdeSeg, Math.min(inicio, largo), `${p.etiqueta} desde ${inicio} en ${largo}`);
        assert.ok(v.duraSeg >= 0 && v.duraSeg <= p.segundos);
        assert.ok(v.desdeSeg + v.duraSeg <= largo + 1e-9, `${p.etiqueta} desde ${inicio} en ${largo}`);
      }
    }
  }
  // Un arranque fuera del archivo no explota: no suena nada.
  assert.deepEqual(ventana(2, 15, 10), { desdeSeg: 10, duraSeg: 0 });
});

// ---------------------------------------------------------------- contra lo real

interface EnvolventeGuardada {
  readonly sha1: string;
  readonly duracionSeg: number;
  readonly picoDb: number;
  readonly env: string;
}
interface FragmentoReal {
  readonly slug: string;
  readonly titulo: string;
  readonly duracionSeg: number;
  readonly entero: boolean;
  readonly inicioSeg?: number | null;
  readonly sorteo?: boolean;
  readonly motivo?: string;
}

const manifiesto = JSON.parse(readFileSync('src/data/adivinar-tema.json', 'utf-8')) as Manifiesto & {
  readonly fragmentos: readonly FragmentoReal[];
  readonly medicion?: { readonly umbralDb: number; readonly ventanaMs: number };
};
const envolventes = JSON.parse(readFileSync('scripts/fragmentos-envolvente.json', 'utf-8')) as {
  readonly ventanaMs: number;
  readonly fragmentos: Record<string, EnvolventeGuardada>;
};
const medido = (slug: string): { env: number[]; duracionSeg: number } => {
  const f = envolventes.fragmentos[slug];
  assert.ok(f, `${slug} no tiene envolvente medida: corré npm run medir-fragmentos`);
  return { env: decodificarEnvolvente(f.env), duracionSeg: f.duracionSeg };
};
const delSorteo = manifiesto.fragmentos.filter((f) => f.sorteo !== false);

test('el manifiesto es CTR-03 v3 y dice con qué umbral se midió', () => {
  assert.equal(manifiesto.contratoVersion, 3);
  assert.equal(manifiesto.medicion?.umbralDb, UMBRAL_DB, 'cambió el umbral: npm run medir-fragmentos -- --aplicar');
  assert.equal(manifiesto.medicion?.ventanaMs, VENTANA_MS);
  assert.equal(envolventes.ventanaMs, VENTANA_MS);
});

test('🔴 cada número del manifiesto sale de la regla, no de una mano', () => {
  for (const f of manifiesto.fragmentos) {
    const { env, duracionSeg } = medido(f.slug);
    const regla = decidirArranque(env, duracionSeg);
    assert.equal(typeof f.sorteo, 'boolean', `${f.slug} no dice si entra al sorteo`);
    assert.deepEqual(
      { inicioSeg: f.inicioSeg, sorteo: f.sorteo, motivo: f.motivo ?? null },
      regla,
      `${f.slug}: el manifiesto no coincide con la medición`,
    );
  }
  assert.equal(Object.keys(envolventes.fragmentos).length, manifiesto.fragmentos.length);
});

test('🔴 las envolventes son de los mp3 que están en disco', () => {
  // Un mp3 recortado de nuevo con la medición vieja es el defecto original con un número
  // falso arriba. En una copia sin audio no hay con qué comparar y no se afirma nada.
  let comparados = 0;
  for (const f of manifiesto.fragmentos) {
    const ruta = `public/audio/fragmentos/${f.slug}.mp3`;
    if (!existsSync(ruta)) continue;
    const sha1 = createHash('sha1').update(readFileSync(ruta)).digest('hex');
    assert.equal(sha1, envolventes.fragmentos[f.slug]?.sha1, `${f.slug}.mp3 cambió: npm run medir-fragmentos`);
    comparados++;
  }
  assert.ok(comparados === 0 || comparados === manifiesto.fragmentos.length, 'faltan mp3 sueltos');
});

test('🔴 ningún tema del sorteo arranca en silencio: el paso de 0,1 s suena', () => {
  const mudos: string[] = [];
  for (const f of delSorteo) {
    const { env, duracionSeg } = medido(f.slug);
    const v = ventana(ESCALERA[0]!.segundos, f.inicioSeg ?? 0, duracionSeg);
    const db = nivelDb(env, v.desdeSeg, v.desdeSeg + v.duraSeg);
    // Medio dB de holgura: es la resolución con la que se guarda la envolvente.
    if (db < UMBRAL_DB - 0.5) mudos.push(`${f.slug} (${db.toFixed(1)} dB)`);
  }
  assert.deepEqual(mudos, []);
});

test('🔴 el paso 2 no es el paso 1 repetido: lo que agrega también suena', () => {
  // El defecto que reportó el usuario era este: 0,1 s y 0,5 s sonaban iguales. Se mira el
  // tramo nuevo de cada paso corto, no el paso entero, que podría aprobar con lo de antes.
  const iguales: string[] = [];
  for (const f of delSorteo) {
    const { env } = medido(f.slug);
    const ini = f.inicioSeg ?? 0;
    const nuevo = nivelDb(env, ini + ESCALERA[0]!.segundos, ini + ESCALERA[1]!.segundos);
    if (nuevo < UMBRAL_DB - 6) iguales.push(`${f.slug} (${nuevo.toFixed(1)} dB)`);
  }
  assert.deepEqual(iguales, []);
});

test('🔴 la escalera no promete más audio del que hay, en ningún tema del sorteo', () => {
  const ultimo = ESCALERA[ESCALERA.length - 1]!;
  const penultimo = ESCALERA[ESCALERA.length - 2]!;
  for (const f of delSorteo) {
    const { duracionSeg } = medido(f.slug);
    const ini = f.inicioSeg ?? 0;
    for (const p of ESCALERA) {
      const v = ventana(p.segundos, ini, duracionSeg);
      // Ningún paso suena nada anterior al primer sonido. Ninguno: tampoco el último.
      assert.equal(v.desdeSeg, ini, `${f.slug}: el paso "${p.etiqueta}" no arranca en el primer sonido`);
      assert.ok(v.desdeSeg + v.duraSeg <= duracionSeg + 1e-9, `${f.slug}: el paso "${p.etiqueta}" se sale del archivo`);
      // Los cinco que prometen un número lo cumplen entero.
      if (p !== ultimo) assert.equal(v.duraSeg, p.segundos, `${f.slug}: el paso de ${p.etiqueta} suena ${v.duraSeg} s`);
    }
    // Y "el resto" es resto de verdad: llega al final y agrega audio sobre el penúltimo.
    const resto = ventana(ultimo.segundos, ini, duracionSeg);
    assert.ok(Math.abs(resto.desdeSeg + resto.duraSeg - duracionSeg) < 1e-9, `${f.slug}: el resto no llega al final`);
    assert.ok(resto.duraSeg > penultimo.segundos, `${f.slug}: "el resto" no agrega nada sobre los ${penultimo.etiqueta}`);
  }
});

test('lo que quedó fuera del sorteo dice por qué, y el juego no lo sortea', () => {
  const fuera = manifiesto.fragmentos.filter((f) => f.sorteo === false);
  for (const f of fuera) assert.ok(f.motivo, `${f.slug} está fuera sin motivo`);
  const cat = catalogo(manifiesto);
  const jugables = new Set(cat.temas.filter((t) => t.jugable).map((t) => t.slug));
  for (const f of fuera) assert.ok(!jugables.has(f.slug), `${f.slug} está fuera del sorteo y se sortea`);
  assert.equal(jugables.size, delSorteo.length);
  // Y siguen estando en el buscador: sacarlos de la lista sería dar una pista.
  for (const f of fuera) assert.ok(cat.temas.some((t) => t.slug === f.slug));
});
