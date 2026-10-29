import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { EFECTOS, MINIMO, RECETAS, SINTETIZADOS, SUELOS, efectosDe, fondoDe, rutaDeEfecto } from './sonido.ts';
import { CAMINOS, CON_CAMINO, ENTRADA } from './camino.ts';
import type { Bestiario } from './mapa.ts';

/**
 * Lo que suena en el camino del bestiario (`D-76`): el disco de lejos y los ruidos sintetizados.
 * Si esto se rompe, un camino promete un sonido que no está, o suena un disco que no es el suyo.
 */

const leer = (ruta: string): unknown => JSON.parse(readFileSync(ruta, 'utf-8'));
const datos = leer('src/data/bestiario.json') as Bestiario;
const cancionero = (leer('src/data/cancionero.json') as { temas: Array<{ slug: string; disco: string; anio: number }> }).temas;
const fragmentos = (leer('src/data/adivinar-tema.json') as { fragmentos: Array<{ slug: string }> }).fragmentos;
// Los que tienen recorte de verdad: el manifiesto y el archivo en disco.
const conAudio = new Set(fragmentos.map((f) => f.slug).filter((s) => existsSync(`public/audio/fragmentos/${s}.mp3`)));
const regionDe = new Map(datos.regiones.map((r) => [r.id, r]));

function fondoDelCamino(id: string) {
  const tramo = CAMINOS[id]!;
  const lista = [...datos.bestias.filter((b) => b.region === id), ...datos.bestias.filter((b) => tramo.deVisita?.includes(b.id))];
  return fondoDe(regionDe.get(id)!.disco, lista.flatMap((b) => (b.tema ? [b.tema] : [])), cancionero, conAudio);
}

test('el disco de la región suena si tiene recortes; si no, el de más bichos', () => {
  const temas = [
    { slug: 'a1', disco: 'a', anio: 1990 },
    { slug: 'a2', disco: 'a', anio: 1990 },
    { slug: 'a3', disco: 'a', anio: 1990 },
    { slug: 'b1', disco: 'b', anio: 1985 },
    { slug: 'b2', disco: 'b', anio: 1985 },
    { slug: 'b3', disco: 'b', anio: 1985 },
    { slug: 'c1', disco: 'c', anio: 1980 },
  ];
  const todos = new Set(temas.map((t) => t.slug));
  assert.deepEqual(fondoDe('a', ['b1', 'b2'], temas, todos), { disco: 'a', temas: ['a1', 'a2', 'a3'] });
  // El de la región no llega al mínimo: manda el de más bichos.
  assert.equal(fondoDe('c', ['b1', 'b2', 'a1'], temas, todos)?.disco, 'b');
  // Un disco con muchos bichos y sin recortes no sirve.
  assert.equal(fondoDe('c', ['c1', 'c1', 'c1'], temas, todos), null);
  // Empate de bichos y de recortes: el más viejo.
  assert.equal(fondoDe('x', ['a1', 'b1'], temas, todos)?.disco, 'b');
});

test('cada camino suena de lejos, con recortes que existen', () => {
  for (const id of CON_CAMINO) {
    const fondo = fondoDelCamino(id);
    assert.ok(fondo, `${id}: ningún disco llega a ${MINIMO} recortes`);
    assert.ok(fondo.temas.length >= MINIMO);
    for (const slug of fondo.temas) assert.ok(conAudio.has(slug), `${id}: ${slug} no tiene recorte`);
  }
  // El monte viste Lobo suelto y suena a Lobo suelto (`D-19`).
  assert.equal(fondoDelCamino('el-monte')?.disco, regionDe.get('el-monte')!.disco);
});

test('cada camino tiene su receta, y las recetas piden solo efectos del manifiesto', () => {
  for (const id of CON_CAMINO) assert.ok(RECETAS[id], `${id} no tiene receta de ruidos`);
  const suelto = (n: string) => EFECTOS[n] && !EFECTOS[n].bucle;
  const cama = (n: string) => EFECTOS[n]?.bucle === true;
  for (const [id, r] of Object.entries(RECETAS)) {
    assert.ok(SUELOS.includes(r.suelo), `${id}: ${r.suelo} no es un suelo`);
    assert.ok(r.zancada > 20 && r.zancada < 300, `${id}: zancada fuera de escala`);
    assert.ok(r.viento >= 0 && r.viento < 0.2 && r.grillos >= 0 && r.grillos < 0.1, `${id}: volumen de fondo demasiado alto`);
    if (r.sala) {
      // Más de cuatro segundos de eco ya es una catedral, y en un teléfono pesa.
      assert.ok(r.sala.largo > 0.1 && r.sala.largo <= 4, `${id}: la sala dura ${r.sala.largo} s`);
      assert.ok(r.sala.brillo >= 500 && r.sala.brillo <= 12000, `${id}: brillo de sala fuera de escala`);
      assert.ok(r.sala.mezcla >= 0 && r.sala.mezcla <= 0.5, `${id}: tanto eco tapa todo`);
    }
    for (const [nombre, vol] of Object.entries(r.cama ?? {})) {
      assert.ok(cama(nombre), `${id}: ${nombre} no es una cama del manifiesto`);
      assert.ok(vol > 0 && vol <= 1, `${id}: la cama ${nombre} tiene volumen ${vol}`);
    }
    for (const [nombre, [min, max]] of Object.entries(r.cadaTanto ?? {})) {
      assert.ok(suelto(nombre), `${id}: ${nombre} no es un efecto suelto del manifiesto`);
      assert.ok(min > 0 && max >= min);
    }
    for (const [bicho, nombre] of Object.entries(r.alTocar ?? {})) {
      assert.ok(suelto(nombre), `${id}: ${nombre} no es un efecto suelto del manifiesto`);
      assert.ok(datos.bestias.some((b) => b.id === bicho), `${id}: ${bicho} no es un bicho`);
    }
  }
});

test('cada efecto del manifiesto tiene su síntesis de respaldo, y sus variantes están en disco', () => {
  const sabidos = new Set<string>(SINTETIZADOS);
  for (const s of SUELOS) assert.ok(EFECTOS[`pasos-${s}`], `falta pasos-${s} en el manifiesto`);
  for (const [nombre, ef] of Object.entries(EFECTOS)) {
    // Sin respaldo, un archivo que no carga es un silencio que nadie pidió.
    assert.ok(sabidos.has(nombre), `${nombre} no tiene síntesis de respaldo`);
    assert.ok(/^[a-z0-9-]+$/.test(nombre), `${nombre}: el nombre va en minúsculas y guiones, es parte del archivo`);
    assert.ok(Number.isInteger(ef.variantes) && ef.variantes >= 0 && ef.variantes <= 12, `${nombre}: variantes fuera de escala`);
    assert.ok(ef.vol > 0 && ef.vol <= 1, `${nombre}: volumen fuera de escala`);
    assert.ok(ef.dice.trim().length > 0, `${nombre}: falta cómo se lo nombra`);
    for (let n = 1; n <= ef.variantes; n++) {
      const ruta = `public${rutaDeEfecto(nombre, n)}`;
      assert.ok(existsSync(ruta), `${nombre}: declara ${ef.variantes} variantes y falta ${ruta}`);
    }
  }
  for (const nombre of sabidos) assert.ok(EFECTOS[nombre], `${nombre} se sintetiza pero no está en el manifiesto`);
});

test('una receta carga solo lo que pide', () => {
  const r = RECETAS['el-bajo']!;
  const pedidos = efectosDe(r);
  assert.ok(pedidos.includes('pasos-agua'));
  assert.ok(pedidos.includes('agua-corriendo'));
  assert.ok(pedidos.includes('vidrio'));
  assert.ok(!pedidos.includes('viento'), 'el bajo no tiene viento y no tiene por qué cargarlo');
  assert.equal(rutaDeEfecto('vidrio', 2), '/audio/bestiario/fx/vidrio-2.mp3');
});

test('al bestiario se entra caminando, por el primer tramo', () => {
  assert.equal(ENTRADA, `/redondopedia/bestiario/${CON_CAMINO[0]}/`);
  const portada = readFileSync('src/pages/redondopedia/index.astro', 'utf-8');
  assert.ok(!portada.includes('href="/redondopedia/bestiario/"'), 'la Redondopedia sigue entrando por el plano');
});
