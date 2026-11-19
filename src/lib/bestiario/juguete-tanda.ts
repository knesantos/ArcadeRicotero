/**
 * Lo que comparten los tests de las cuatro bestias de la tanda A de la vigesimonovena vuelta (`D-73`, `T-529`): el
 * pajarito del Lavi-rap, la fiera mas fiera, el perro manso y el gato que llamas con silbidos. Es la misma cuenta que
 * hacen los tests de la vuelta 28, escrita una vez.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { azar, domDeJuguete, escenario } from './juguete.ts';

export const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
export const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
export const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
export const trasl = (transform: string): [number, number] => {
  const m = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(transform);
  return m ? [Number(m[1]), Number(m[2])] : [NaN, NaN];
};

/** Lo común a las cuatro de la tanda: títere entero, piezas impresas con su prefijo, sin hex, tintas en su bloque y bloque de sitio.css. */
export function molde(o: { id: string; clase: string; marcado: string; piezas: ReadonlyArray<{ nombre: string; dibujo: string }>; prefijo: string; partes: readonly string[]; bloque: string; tapa: string; tintas: number; peso: readonly [number, number]; nombre: string; noSeTocan: string }): void {
  assert.ok(o.marcado.includes(`<g class="titere ${o.clase}" data-id="${o.id}" role="button" tabindex="0" aria-label="${o.nombre}">`), 'no es un títere que se toca');
  for (const p of o.partes) assert.ok(o.marcado.includes(`data-parte="${p}"`), `le falta ${p}`);
  const imagenes = new Set([...o.marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), o.piezas.map((p) => p.nombre).sort());
  for (const p of o.piezas) {
    assert.match(p.nombre, new RegExp(`^${o.prefijo}-`));
    assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
    assert.doesNotMatch(p.dibujo, /drop-shadow|box-shadow/, p.nombre);
  }
  const peso = o.piezas.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= o.peso[0] && peso <= o.peso[1], `las piezas pesan ${peso.toFixed(0)} kB`);
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf(`⟨${o.bloque}⟩`), tokens.indexOf(`⟨/${o.bloque}⟩`));
  const usadas = new Set(o.piezas.flatMap((p) => [...p.dibujo.matchAll(new RegExp(`var\\((--bestia-${o.prefijo}-[a-z-]+)\\)`, 'g'))].map((m) => m[1]!)));
  assert.ok(usadas.size >= o.tintas, `usa ${usadas.size} tintas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en su bloque`);
  // Y ninguna tinta del bloque queda sin usar.
  for (const m of bloque.matchAll(/(--bestia-[a-z-]+):/g)) assert.ok(usadas.has(m[1]!), `${m[1]} sobra`);
  assert.ok(bloque.includes(`public/tapas/${o.tapa}.jpg`));
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf(`/* ⟨${o.bloque}⟩ */`), sitio.indexOf(`/* ⟨/${o.bloque}⟩ */`));
  assert.ok(suyo.includes(`.${o.clase} { cursor: pointer; }`) && suyo.includes(o.noSeTocan));
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b|shadow/);
}

/** La pose quieta de la isla es la del HTML, con y sin movimiento; con movimiento reducido, el toque alterna dos poses y dice el verso. */
export function quietud<M>(o: { id: string; nuevo: () => ReturnType<typeof domDeJuguete>; armar: (marcos: readonly SVGGElement[], esc: never, azar: () => number) => { mover(t: number, dt: number): void }; marcas: (m: M) => { transform: Record<string, string>; opacity: Record<string, string> }; quieto: M; toca: M; parte: string }): void {
  for (const q of [true, false]) {
    const dom = o.nuevo();
    const antes = dom.foto();
    o.armar(dom.marcos, escenario(q).esc as never, azar(7)).mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  const dom = o.nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = o.armar(dom.marcos, esc as never, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes, 'se movió con movimiento reducido');
  dom.oyentes.get('click')!({});
  const toca = o.marcas(o.toca);
  assert.equal(dom.de(o.parte, 'transform'), toca.transform[o.parte]);
  assert.notEqual(toca.transform[o.parte], o.marcas(o.quieto).transform[o.parte], 'la pose del toque es la quieta');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], o.id);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de(o.parte, 'transform'), o.marcas(o.quieto).transform[o.parte]);
}

/** Corre la vida sola dos minutos con tres semillas y devuelve cuántas veces hizo cada cosa; `mirar` ve cada cuadro. */
export function vivir(nuevo: () => ReturnType<typeof domDeJuguete>, armar: (marcos: readonly SVGGElement[], esc: never, azar: () => number) => { mover(t: number, dt: number): void; estado(): { accion: string | null; hechas: Record<string, number> } }, mirar: (dom: ReturnType<typeof domDeJuguete>, accion: string | null) => void): Record<string, number> {
  const hechas: Record<string, number> = {};
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armar(dom.marcos, esc as never, azar(semilla));
    for (let i = 1; i <= 60 * 120; i++) {
      poner(i / 60);
      vivo.mover(i / 60, 1 / 60);
      mirar(dom, vivo.estado().accion);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
  }
  return hechas;
}

/** Toca al títere al segundo 1 y deja mirar cada cuadro del toque. */
export function tocar(nuevo: () => ReturnType<typeof domDeJuguete>, armar: (marcos: readonly SVGGElement[], esc: never, azar: () => number) => { mover(t: number, dt: number): void }, dura: number, mirar: (dom: ReturnType<typeof domDeJuguete>, u: number) => void): { dichos: Array<[string, number, number]>; dom: ReturnType<typeof domDeJuguete> } {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armar(dom.marcos, esc as never, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  for (let i = 1; i <= 60 * (dura + 0.2); i++) {
    poner(1 + i / 60);
    vivo.mover(1 + i / 60, 1 / 60);
    mirar(dom, i / 60);
  }
  return { dichos, dom };
}
