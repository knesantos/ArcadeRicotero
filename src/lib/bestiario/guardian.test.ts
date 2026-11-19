import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { GUARDIAN_PERSONAJE, PIEZAS_GUARDIAN } from './arte-guardian.ts';
import { GUARDIAN, GUARDIAN_ARMADO as A, QUIETO, TARDE, agarre, alRecinto, enLaCabeza, lonaEn, manos, marcas, nidoEnElCasco, type Punto } from './rig-guardian.ts';
import { ARBOL, COSAS_DEL_ARBOL, OJOS_DEL_ARBOL } from './rig-entornos.ts';
import { escenaArbol } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, ERRA, PASO, TOQUE_T, armarGuardianCon, base, momentoDeAccion, momentoDelToque, type Accion } from '../../scripts/bestiario/guardian.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El ángel guardián más tonto (`D-73`, vigesimonovena vuelta): que sea un títere entero a aerógrafo, parado al pie del
 * árbol con su lona de rescate tendida donde no hace falta (debajo de la rama, pero del tramo de la percha vacía, al
 * lado del que cuelga), una punta atada a la estaca y la otra en sus manos, que no esté
 * más pintado en el piso, que mida el viento, bostece y le erre a su propia aureola sin que nadie lo toque, que tocado le
 * caiga un nido en el casco y recién ahí se tape con la lona, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-angel-guardian';
const figura = capasDe('el-arbol', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_GUARDIAN.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--guardian');
const sinRitmos = (): number => -1;
/** Lo que se estira un brazo: el segundo número del `scale(1 …)`. */
const estira = (transform: string): number => Number(/scale\(1 ([\d.]+)\)/.exec(transform)?.[1] ?? NaN);
const aplasta = (transform: string): number => Number(/scale\(1 ([\d.]+)\)/.exec(transform)?.[1] ?? NaN);
const giroDe = (transform: string): number => Number(/rotate\((-?[\d.]+)\)/.exec(transform)?.[1] ?? NaN);
/** Dónde está el medio de la lona cuando está tendida, quieta. */
const TENDIDA = lonaEn(QUIETO).centro;

test('el ángel guardián es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--guardian" data-id="el-angel-guardian" role="button" tabindex="0" aria-label="El ángel guardián más tonto">/);
  for (const p of ['entero', 'todo', 'ala-i', 'ala-d', 'cuerpo', 'cabeza', 'parpados', 'bocaza', 'llama', 'aureola', 'brazo-i', 'brazo-d', 'lona', 'nido']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al ángel le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_GUARDIAN.map((p) => p.nombre).sort());
  for (const p of PIEZAS_GUARDIAN) assert.match(p.nombre, /^guardian-/);
  assert.ok(adentro('guardian-cuerpo', A.cogote) && adentro('guardian-cabeza', [0, 0]), 'la cabeza no sale del cogote');
  for (const h of A.hombros) assert.ok(adentro('guardian-cuerpo', h), 'un brazo no sale del hombro');
  assert.ok(adentro('guardian-brazo', [0, 0]) && adentro('guardian-brazo', [0, A.brazo]), 'el brazo dibujado no mide lo que dice el rig');
  assert.ok(adentro('guardian-cabeza', [A.casco[0], A.casco[1] + 4]), 'el casco no está en la cabeza');
  assert.ok(adentro('guardian-lona', [A.lona.rx, 0]) && adentro('guardian-lona', [0, A.lona.ry]), 'la lona no mide lo que dice el rig');
  // La aureola flota arriba de la llama, que está arriba del casco: no le tapa la cara ni se come la vela.
  assert.ok(A.aureola[1] < A.casco[1] - 30, 'la aureola pisa la llama');
  // La lona está tendida: una punta en la estaca, clavada en el piso, y la otra levantada en sus dos manos, a la altura de la cintura.
  assert.ok(adentro('guardian-estaca', A.estaca) && Math.abs(A.estaca[1]) < 8, 'la estaca no está clavada en el piso');
  const q = lonaEn(QUIETO);
  const a = (q.giro * Math.PI) / 180;
  const punta: Punto = [q.centro[0] + A.lona.rx * Math.cos(a), q.centro[1] + A.lona.rx * Math.sin(a)];
  assert.ok(Math.hypot(punta[0] - A.estaca[0], punta[1] - A.estaca[1]) < 1, 'la punta de adelante de la lona no está en la estaca');
  assert.ok(q.giro >= 20 && q.giro <= 40, `la lona está inclinada ${q.giro} grados: ni mesa ni escudo`);
  for (const i of [0, 1] as const) assert.ok(agarre(QUIETO, i)[1] < -50 && agarre(QUIETO, i)[1] > -100 && agarre(QUIETO, i)[0] > 20, 'no tiene la otra punta levantada adelante');
  // La percha vacía es una pieza suya, y no se mueve con él.
  assert.ok(adentro('guardian-percha', A.percha) && figura.indexOf('guardian-percha.webp') < figura.indexOf('data-parte="todo"'), 'la percha se va con él cuando se corre');
  for (const p of PIEZAS_GUARDIAN) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['guardian-cuerpo', 'guardian-cabeza', 'guardian-lona', 'guardian-ala', 'guardian-nido']) assert.match(PIEZAS_GUARDIAN.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_GUARDIAN.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del ángel están en su bloque de tokens.css, medidas en Luzbelito, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el angel guardian⟩'), tokens.indexOf('⟨/el angel guardian⟩'));
  const usadas = new Set(PIEZAS_GUARDIAN.flatMap((p) => [...p.dibujo.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del ángel guardián`);
  assert.match(bloque, /public\/tapas\/luzbelito\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el angel guardian⟩ */'), sitio.indexOf('/* ⟨/el angel guardian⟩ */'));
  assert.match(suyo, /\.titere--guardian \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"nido"') && suyo.includes('"llama"') && suyo.includes('"aureola"'), 'el nido, la llama y la aureola se pueden tocar');
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b|shadow/);
});

test('guarda donde no hace falta: debajo de la rama soldada pero al lado del colgado, sin pisar a nadie, y ya no está pintado en el piso', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-arbol');
  assert.equal(GUARDIAN_PERSONAJE.ancla, GUARDIAN.x);
  // Sus ojos se mudaron con él.
  assert.equal(OJOS_DEL_ARBOL[ID]![0], GUARDIAN.x);
  // Está debajo de la rama de la que cuelga el que duerme…
  assert.ok(GUARDIAN.x > ARBOL.soldada.x0 + 20 && GUARDIAN.x < ARBOL.soldada.x1, 'no está debajo de la rama soldada');
  assert.ok(alRecinto(enLaCabeza(A.aureola, QUIETO.cabeza))[1] > ARBOL.soldada.y1 + 30, 'la aureola toca la rama');
  // … pero la lona queda entera a la izquierda de él, para el lado del tronco, y el colgado a su espalda: ese es el chiste.
  const colgado = OJOS_DEL_ARBOL['el-que-duerme-colgado']![0];
  const lonaDer = Math.max(alRecinto(agarre(QUIETO, 0))[0], alRecinto(agarre(QUIETO, 1))[0]);
  const estaca = alRecinto(A.estaca)[0];
  assert.ok(lonaDer < GUARDIAN.x && GUARDIAN.x + 44 * GUARDIAN.escala < colgado - 20, `la lona llega a ${lonaDer.toFixed(0)}, él a ${GUARDIAN.x} y el colgado cuelga en ${colgado}: quedó donde hace falta`);
  assert.ok(Math.abs(estaca - (ARBOL.tronco.x + ARBOL.tronco.ancho / 2)) < 16, `la estaca (${estaca.toFixed(0)}) no está al pie del tronco`);
  // La percha vacía cuelga de la rama soldada, arriba de la lona, lejos del colgado: es lo que mira.
  const [px, py] = alRecinto(A.percha);
  const ramaEn = ARBOL.soldada.y0 + ((ARBOL.soldada.y1 - ARBOL.soldada.y0) * (px - ARBOL.soldada.x0)) / (ARBOL.soldada.x1 - ARBOL.soldada.x0);
  assert.ok(px > ARBOL.soldada.x0 + 10 && px < GUARDIAN.x && Math.abs(py - ramaEn) < 5, `la percha (${px.toFixed(0)}, ${py.toFixed(0)}) no cuelga de la rama (${ramaEn.toFixed(0)})`);
  assert.ok(px > estaca && px < lonaDer + 10 && colgado - px > 80, 'la percha no está arriba de la lona, o está al lado del colgado');
  // Mira para la izquierda, de espaldas al colgado: la escena lo da vuelta.
  assert.match(marcas(QUIETO).transform.entero!, /scale\(-/);
  assert.ok(QUIETO.cabeza < -15, 'no mira para arriba');
  // No tapa los ojos ni las cosas de nadie, ni en el recinto ni en el camino.
  const [x0, y0] = [GUARDIAN.x - 160 * GUARDIAN.escala, GUARDIAN.piso - 250 * GUARDIAN.escala];
  const [x1, y1] = [GUARDIAN.x + 60 * GUARDIAN.escala, GUARDIAN.piso];
  for (const k of [1, K_ENTORNO]) {
    const corre = GUARDIAN.x * (k - 1);
    for (const [id, [vx, vy]] of [...Object.entries(OJOS_DEL_ARBOL), ...Object.entries(COSAS_DEL_ARBOL)]) {
      if (id === ID) continue;
      assert.ok(!(vx * k > x0 + corre && vx * k < x1 + corre && vy > y0 && vy < y1), `con k ${k}, ${id} queda adentro del ángel guardián`);
    }
  }
  const escena = escenaArbol(nombres);
  assert.ok(escena.indexOf('/bestiario/arbol-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso lo tapa');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'siguen sus ojos en lo oscuro');
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('el-angel-guardian'\)/, 'sigue pintado en el piso del árbol');
  const piso = pisoDelCamino(CAMINOS['el-arbol']!, nombres);
  const m = /data-marco="el-angel-guardian" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en el árbol del camino');
  assert.equal(Number(m![1]), Math.round(GUARDIAN.x * (K_ENTORNO - 1)));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento, y las manos tienen la lona', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarGuardianCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Quieto: sin nido, la vela prendida, y cada mano en su agarre de la lona, con el brazo sin estirar de más.
  const q = marcas(QUIETO);
  assert.equal(q.opacity.nido, '0');
  assert.equal(q.opacity.llama, '1');
  assert.deepEqual(manos(QUIETO), [agarre(QUIETO, 0), agarre(QUIETO, 1)]);
  for (const b of ['brazo-i', 'brazo-d']) assert.ok(estira(q.transform[b]!) > 0.7 && estira(q.transform[b]!) < 1.25, `${b} se estira ${estira(q.transform[b]!)}`);
  // Y con la lona de techo, tampoco: los brazos llegan.
  for (const b of ['brazo-i', 'brazo-d']) assert.ok(estira(marcas(TARDE).transform[b]!) < 1.4, `${b} no llega al techo sin estirarse (${estira(marcas(TARDE).transform[b]!)})`);
});

test('solo, mide el viento y corre la lona para el lado contrario al colgado, bosteza y se le cae, y le erra a su propia aureola', () => {
  const hechas: Record<Accion | 'toque', number> = { viento: 0, bosteza: 0, ensaya: 0, toque: 0 };
  const visto = { paso: 0, lonaCae: 0, bocaza: 0, aureolaBaja: -Infinity, suelta: 0 };
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarGuardianCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      visto.paso = Math.max(visto.paso, trasladoDe(dom.de('todo', 'transform'))[0]);
      visto.lonaCae = Math.max(visto.lonaCae, A.lona.tendida - giroDe(dom.de('lona', 'transform')));
      if (dom.de('bocaza', 'opacity') === '1') visto.bocaza++;
      visto.aureolaBaja = Math.max(visto.aureolaBaja, trasladoDe(dom.de('aureola', 'transform'))[1]);
      // Sin tocarlo, no cae ningún nido y la vela no se apaga.
      assert.equal(dom.de('nido', 'opacity'), '0');
      assert.equal(dom.de('llama', 'opacity'), '1');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['viento', 'bosteza', 'ensaya'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque, 0);
  // El paso es para el lado de su cara, que en el recinto es la izquierda: se aleja del colgado.
  assert.ok(visto.paso > PASO * 0.95, `corrió la lona ${visto.paso.toFixed(0)}`);
  assert.ok(alRecinto([PASO, 0])[0] < GUARDIAN.x, 'el paso lo acerca al colgado');
  assert.ok(visto.lonaCae > 10, `al bostezar no se le cayó la punta de la lona (${visto.lonaCae})`);
  assert.ok(visto.bocaza > 30, 'no bostezó');
  // La aureola le cae en el piso, del lado del colgado: justo donde tendría que estar la lona.
  assert.ok(visto.aureolaBaja > -20, `la aureola no llegó al piso (${visto.aureolaBaja.toFixed(0)})`);
  const cayo = alRecinto(ERRA)[0];
  assert.ok(Math.abs(cayo - OJOS_DEL_ARBOL['el-que-duerme-colgado']![0]) < 16, `la aureola cae en ${cayo.toFixed(0)}, y el colgado cuelga en ${OJOS_DEL_ARBOL['el-que-duerme-colgado']![0]}`);
  // Mientras mide el viento, la mano derecha suelta la lona y sube más alto que la cabeza.
  const m = momentoDeAccion(base(10, sinRitmos), 'viento', 2);
  assert.ok(m.suelta > 0.95 && manos(m)[1][1] < A.cogote[1] - 60, 'no levantó el dedo');
});

test('tocado, le cae un nido en el casco, se le apaga la vela, y recién después se tapa con la lona; todo vuelve, y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarGuardianCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { nidoArriba: 0, golpe: -1, apagada: -1, techo: -1, lonaSube: 0, hundida: 0 };
  let nidoAntes = -Infinity;
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const ny = trasladoDe(dom.de('nido', 'transform'))[1];
    if (dom.de('nido', 'opacity') === '1') {
      visto.nidoArriba = Math.min(visto.nidoArriba, ny);
      // Mientras cae, cae: nunca sube.
      if (u < TOQUE_T.cae[1]) assert.ok(ny >= nidoAntes - 0.01, 'el nido subió en la caída');
      nidoAntes = ny;
    }
    if (visto.apagada < 0 && dom.de('llama', 'opacity') === '0') visto.apagada = u;
    const sube = TENDIDA[1] - trasladoDe(dom.de('lona', 'transform'))[1];
    visto.lonaSube = Math.max(visto.lonaSube, sube);
    if (visto.techo < 0 && sube > 100) visto.techo = u;
    visto.hundida = Math.max(visto.hundida, trasladoDe(dom.de('cabeza', 'transform'))[1] - A.cogote[1]);
    // Los brazos nunca sueltan la lona ni se estiran como un chicle.
    assert.ok(estira(dom.de('brazo-i', 'transform')) < 1.45, `el brazo se estiró ${estira(dom.de('brazo-i', 'transform'))} a los ${u.toFixed(2)}`);
  }
  assert.ok(visto.nidoArriba < -400, 'el nido no cayó de la copa');
  assert.ok(visto.apagada > TOQUE_T.cae[1] - 0.05 && visto.apagada < TOQUE_T.cae[1] + 0.1, `la vela se apagó a los ${visto.apagada}`);
  assert.ok(visto.hundida > 12, 'el golpe no le hundió la cabeza');
  // Tarde: la lona sube bastante después de que el nido ya le pegó.
  assert.ok(visto.techo > TOQUE_T.cae[1] + 1, `se tapó a los ${visto.techo.toFixed(2)}, y el nido le pegó a los ${TOQUE_T.cae[1]}`);
  assert.ok(visto.lonaSube > (TENDIDA[1] - A.techo[1]) * 0.98, 'la lona no llegó a taparlo');
  // Con el nido encima, apoya en el casco.
  const m = momentoDelToque(base(4, sinRitmos), 3.4);
  const [nx, ny] = nidoEnElCasco(m.cabeza, m.hundida);
  assert.ok(Math.hypot(m.nido[0] - nx, m.nido[1] - ny) < 0.5, 'el nido no le quedó en el casco');
  assert.ok(aplasta(marcas(m).transform.lona!) < 0.7 && Math.abs(giroDe(marcas(m).transform.lona!)) < 1, 'la lona de techo no queda derecha y de canto');
  // De techo, una mano de cada lado.
  assert.ok(agarre(m, 0)[0] < -20 && agarre(m, 1)[0] > 20, 'de techo no la tiene una mano de cada lado');
  // Al final está como antes: la lona tendida, sin nido, la vela prendida.
  assert.ok(Math.abs(trasladoDe(dom.de('lona', 'transform'))[1] - TENDIDA[1]) < 0.5 && Math.abs(giroDe(dom.de('lona', 'transform')) - A.lona.tendida) < 0.5);
  assert.equal(dom.de('nido', 'opacity'), '0');
  assert.equal(dom.de('llama', 'opacity'), '1');
  assert.ok(TOQUE_T.fin <= DURA.toque);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de guardar a taparse tarde, con el nido en el casco, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarGuardianCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('lona', 'transform'), marcas(TARDE).transform.lona);
  assert.equal(dom.de('nido', 'opacity'), '1');
  assert.equal(dom.de('llama', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('lona', 'transform'), marcas(QUIETO).transform.lona);
  assert.equal(dom.de('nido', 'opacity'), '0');
});
