import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { BOLLO_EN_LA_NIEVE, PIEZAS_ALIEN } from './arte-alien.ts';
import { ALIEN, ALIEN_ARMADO, EVANGELIO, PANTALLA, QUIETO, TICKET, alRecinto, bolloEn, type Punto } from './rig-alien.ts';
import { CYBER, COSAS_DE_CYBERSIBERIA, OJOS_DE_CYBERSIBERIA } from './rig-entornos.ts';
import { escenaCybersiberia } from './escenas-entornos.ts';
import { DURA, EVANGELIO_T, armarAlienCon, type Accion } from '../../scripts/bestiario/alien.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El Alien Duce (`D-73`, vigesimosegunda vuelta, pedido por el usuario): que sea un títere entero a
 * aerógrafo adentro de la pantalla de la tele grande, cortado por el ojo de buey, que la bola de efectos
 * tire puntos de luz afuera de la tele, que tocado se aplaste contra el vidrio, escupa el ticket del
 * evangelio hasta la nieve, lo chupe y lo escupa hecho un bollo, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-alien-duce';
const figura = capasDe('cybersiberia', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ALIEN.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--alien');

test('el Alien Duce es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--alien" data-id="el-alien-duce" role="button" tabindex="0" aria-label="El Alien Duce">/);
  for (const p of ['entero', 'puntos', 'busto', 'cabeza', 'antena-1', 'antena-2', 'lamparas', 'brillos', 'quijada', 'boca', 'brazo', 'palmas', 'ruido', 'ticket', 'bollo']) assert.ok(figura.includes(`data-parte="${p}"`), `al Alien le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ALIEN.map((p) => p.nombre).sort());
  const A = ALIEN_ARMADO;
  assert.ok(adentro('alien-bola', A.bola) && adentro('alien-brillos', A.bola), 'la bola no está en la cabeza');
  assert.ok(adentro('alien-cara', A.ojos[0]) && adentro('alien-cara', A.ojos[1]), 'los ojos no están en la cara');
  // Los ojos asoman abajo de la bola: el borde del cráneo le hace de ceño.
  for (const [, y] of A.ojos) assert.ok(y > A.bola[1] + A.radioBola * 0.92, 'la bola le tapa los ojos');
  assert.ok(adentro('alien-quijada', A.boca) && adentro('alien-boca', A.boca) && adentro('alien-ticket', A.boca) && adentro('alien-bollo', A.boca), 'la boca no está donde sale el ticket');
  assert.ok(adentro('alien-uniforme', A.cuello) && adentro('alien-cara', [A.cuello[0], A.cuello[1] - 2]), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('alien-brazo', A.hombro) && adentro('alien-uniforme', A.hombro) && adentro('alien-brazo', A.puno), 'el brazo no va del hombro al puño');
  for (const [[x0, y0], [x1, y1]] of A.antenas) {
    assert.ok(Math.hypot(x0 - A.bola[0], y0 - A.bola[1]) < A.radioBola + 4, 'la antena no sale de la bola');
    assert.ok(Math.hypot(x1, y1) < PANTALLA.r - 4, 'la lamparita queda afuera de la pantalla');
    assert.ok(adentro('alien-lamparas', [x1, y1]), 'la lamparita no se prende donde está');
  }
  for (const p of PIEZAS_ALIEN) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['alien-uniforme', 'alien-cara', 'alien-bola', 'alien-ticket']) assert.match(PIEZAS_ALIEN.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_ALIEN.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 260, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del Alien están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el alien duce⟩'), tokens.indexOf('⟨/el alien duce⟩'));
  const usadas = new Set(PIEZAS_ALIEN.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-alien-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del Alien`);
  assert.match(bloque, /ultimo-bondi-a-finisterre\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  assert.ok(sitio.includes('/* ⟨el alien duce⟩ */') && sitio.includes('.titere--alien'));
});

test('está en la pantalla de la tele, cortado por el ojo de buey; el ticket llega a la nieve y el bollo cae en ella', () => {
  assert.deepEqual([ALIEN.x, ALIEN.y], [CYBER.tele.x, CYBER.tele.pantalla.y]);
  // El círculo que lo corta es la pantalla de la tele, un poquito adentro del aro.
  assert.ok(PANTALLA.r * ALIEN.escala <= CYBER.tele.pantalla.r);
  assert.match(figura, new RegExp(`<clipPath id="alien-pantalla"><circle cx="0" cy="0" r="${PANTALLA.r}"/></clipPath>`));
  // Ya no es una cosa pintada en la pantalla.
  assert.ok(!COSAS_DE_CYBERSIBERIA['el-alien-duce'] || !escenaCybersiberia(nombres).includes('bestia--cosa" data-id="el-alien-duce"'));
  const [, finTicket] = alRecinto([0, ALIEN_ARMADO.boca[1] + TICKET.largo]);
  assert.ok(finTicket > CYBER.tele.piso, 'el ticket no sale de la tele');
  assert.ok(finTicket < 640, 'el ticket se sale del recinto');
  const [bx, by] = BOLLO_EN_LA_NIEVE;
  assert.ok(by > CYBER.horizonte && by < 640 && bx > CYBER.tele.x + CYBER.tele.ancho / 2 - 20 && bx < 900, 'el bollo no cae en la nieve, al lado de la tele');
  // En el vuelo, el bollo sube antes de caer.
  assert.ok(bolloEn(0.3)[1] < ALIEN_ARMADO.boca[1], 'el bollo no vuela en arco');
  // Ningún ojo de los demás queda adentro de la pantalla.
  for (const [id, [ox, oy]] of Object.entries(OJOS_DE_CYBERSIBERIA)) assert.ok(Math.hypot(ox - ALIEN.x, oy - ALIEN.y) > CYBER.tele.pantalla.r, `${id} queda adentro de la pantalla`);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAlienCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive en la tele: arenga, prende la bola, se le corta la señal, mueve las antenas y mira; la bola gira siempre', () => {
  const hechas: Record<Accion, number> = { arenga: 0, bola: 0, senal: 0, antenas: 0, mira: 0, evangelio: 0 };
  const giros = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAlienCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 40; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      giros.add(dom.de('puntos', 'transform'));
      assert.equal(dom.de('ticket', 'opacity'), '0', 'sacó el ticket sin que lo toquen');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['arenga', 'bola', 'senal', 'antenas', 'mira'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.evangelio, 0);
  assert.ok(giros.size > 1000, 'la bola no gira');
});

test('tocado: se aplasta contra el vidrio, escupe el ticket hasta la nieve, lo chupa y lo escupe hecho un bollo', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAlienCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let palmas = 0;
  let ticketEntero = false;
  let chupado = false;
  let bollo = false;
  let puntos = 0;
  for (let i = 1; i <= 60 * DURA.evangelio; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const u = t - 1;
    palmas = Math.max(palmas, Number(dom.de('palmas', 'opacity')));
    puntos = Math.max(puntos, Number(dom.de('puntos', 'opacity')));
    if (u > EVANGELIO_T.sale[1] && u < EVANGELIO_T.chupa[0]) ticketEntero ||= / scale\(1 1\) /.test(dom.de('ticket', 'transform'));
    if (u > EVANGELIO_T.chupa[1] && u < EVANGELIO_T.escupe[0]) chupado ||= dom.de('ticket', 'opacity') === '0';
    if (u > EVANGELIO_T.escupe[1]) bollo ||= dom.de('bollo', 'opacity') === '1';
  }
  assert.ok(palmas > 0.95, 'no se aplastó contra el vidrio');
  assert.ok(ticketEntero, 'el ticket no salió entero');
  assert.ok(chupado, 'no chupó el ticket');
  assert.ok(bollo, 'no escupió el bollo');
  assert.ok(puntos > 0.95, 'no prendió la bola');
  assert.equal(dom.de('bollo', 'opacity'), '0', 'el bollo quedó en la nieve para siempre');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de quieto al evangelio y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAlienCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('ticket', 'opacity'), '1');
  assert.equal(dom.de('puntos', 'opacity'), String(EVANGELIO.puntos));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('puntos', 'opacity'), String(QUIETO.puntos));
});
