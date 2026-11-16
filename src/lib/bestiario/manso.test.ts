import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capasDe } from './elenco.ts';
import { MANSO_PERSONAJE, PIEZAS_MANSO } from './arte-manso.ts';
import { CONTADO, MANSO, MANSO_ARMADO as A, QUIETO, alRecinto, colgado, marcas, puntaDeLaCola } from './rig-manso.ts';
import { VECINOS_DEL_BALDIO, escenaBaldio } from './escenas.ts';
import { LUGAR as DINAMITA } from './rig-dinamita.ts';
import { DURA, TOQUE_T, armarMansoCon, puntaDelPalo } from '../../scripts/bestiario/manso.ts';
import { domDeJuguete } from './juguete.ts';
import { giro, molde, nombres, quietud, tocar, trasl, vivir } from './juguete-tanda.ts';

/**
 * El perro manso (`D-73`, vigesimonovena vuelta): un perro flaco con las costillas afuera como un xilofón, numeradas
 * con tiza, y un palo colgado de la cola; que se atragante y trague igual, que quiera gruñir y le salga una burbuja,
 * que tocado el palo le cuente las seis costillas mientras los cucharones se ríen, y que él no deje de comer.
 */

const ID = 'el-perro-manso';
const figura = capasDe('los-techos', 'figura', nombres, 1, ID);
const nuevo = () => domDeJuguete([figura], 'titere--manso');
const caja = (n: string): readonly [number, number, number, number] => PIEZAS_MANSO.find((p) => p.nombre === n)!.caja;
const adentro = (n: string, [x, y]: readonly [number, number]): boolean => {
  const [x0, y0, w, h] = caja(n);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const COSTILLAS = [1, 2, 3, 4, 5, 6];
const salto = (d: ReturnType<typeof domDeJuguete>, n: number): number => A.costillas.y - trasl(d.de(`costilla-${n}`, 'transform'))[1];

test('el perro manso es un títere entero: seis costillas, seis números, seis cucharones y un palo colgado de la cola', () => {
  molde({
    id: ID, clase: 'titere--manso', marcado: figura, piezas: PIEZAS_MANSO, prefijo: 'manso', nombre: 'El perro manso', bloque: 'el perro manso', tapa: 'luzbelito', tintas: 14, peso: [30, 200],
    partes: ['entero', 'perro', 'cola', 'tronco', ...COSTILLAS.map((n) => `costilla-${n}`), 'cogote', 'cabeza', 'quijada', 'parpado', 'oreja', 'espina', 'cucharon-1', 'cucharon-2', 'cucharon-3', 'burbuja', 'piolin', 'palo'], noSeTocan: '[data-parte="burbuja"]',
  });
  assert.equal(A.costillas.x.length, 6);
  // Las costillas caen sobre el tronco, y cada una tiene su número de tiza arriba.
  for (const x of A.costillas.x) assert.ok(adentro('manso-cuerpo', [x, A.costillas.y]) && adentro('manso-cuerpo', [x, A.costillas.y + 18]), `la costilla de ${x} se sale del tronco`);
  const cuerpo = PIEZAS_MANSO.find((p) => p.nombre === 'manso-cuerpo')!.dibujo;
  assert.equal((cuerpo.match(/stroke="var\(--bestia-manso-tiza\)"/g) ?? []).length, 6, 'no hay seis números de tiza');
  assert.match(cuerpo, /--bestia-manso-verde\b/, 'no tiene moretones');
  // Son tantos los cocineros: tres cucharones que se ríen y tres quietos.
  assert.equal((PIEZAS_MANSO.find((p) => p.nombre === 'manso-olla-atras')!.dibujo.match(/<g transform="translate\([-\d. ]+\) rotate/g) ?? []).length, 3);
  // El cogote une la cabeza con el tronco, y va por debajo de la cabeza.
  assert.ok(adentro('manso-cogote', A.cuello) && adentro('manso-cuerpo', A.cuello) && adentro('manso-cogote', [caja('manso-cabeza')[0] + caja('manso-cabeza')[2] - 4, A.cuello[1]]), 'el cogote no une la cabeza con el cuerpo');
  assert.ok(figura.indexOf('data-parte="cogote"') < figura.indexOf('data-parte="cabeza"'));
  assert.ok(adentro('manso-cabeza', A.ojo) && adentro('manso-parpado', A.ojo) && adentro('manso-quijada', A.quijada) && adentro('manso-oreja', A.oreja) && adentro('manso-cola', A.cola) && adentro('manso-cola', A.punta));
  // El hocico entra en la olla: la pared de adelante lo tapa, y ningún cucharón le cruza la cara.
  assert.ok(figura.indexOf('data-parte="cabeza"') < figura.indexOf('manso-olla.webp'));
  for (const [x] of A.cucharones) assert.ok(x < A.hocico[0] - 8, 'un cucharón le cruza el hocico');
});

test('el palo cuelga de la punta de la cola: el piolín no se corta ni se estira más de lo que mide', () => {
  const largo = (m: typeof QUIETO): number => {
    const [x, y, g] = m.palo;
    const r = (g * Math.PI) / 180;
    const [tx, ty] = puntaDeLaCola(m.cola);
    return Math.hypot(x + Math.sin(r) * (A.palo / 2) - tx, y - Math.cos(r) * (A.palo / 2) - ty);
  };
  assert.ok(Math.abs(largo(QUIETO) - A.piolin) < 1.5, `quieto, el piolín mide ${largo(QUIETO).toFixed(1)}`);
  assert.ok(largo(CONTADO) <= A.piolin + 1, `contando, el piolín mide ${largo(CONTADO).toFixed(1)}`);
  // Y en todo el toque: la punta que pega llega a la primera costilla sin que el piolín se estire.
  tocar(nuevo, armarMansoCon, DURA.toque, (d) => {
    const [x, y] = trasl(d.de('palo', 'transform'));
    const r = (giro(d.de('palo', 'transform')) * Math.PI) / 180;
    const [tx, ty] = trasl(d.de('piolin', 'transform'));
    const l = Math.hypot(x + Math.sin(r) * (A.palo / 2) - tx, y - Math.cos(r) * (A.palo / 2) - ty);
    assert.ok(l <= A.piolin + 2.5, `el piolín se estiró a ${l.toFixed(1)}`);
  });
  // Colgando no se entierra.
  assert.ok(colgado(0, 0)[1] + A.palo / 2 <= 1);
});

test('come en la tierra del baldío, a la derecha, sin pisar al perro dinamita ni a los ojos de los otros perros', () => {
  assert.equal(MANSO_PERSONAJE.ancla, MANSO.x);
  const [x0, y0] = alRecinto([-112, -70]);
  const [x1, y1] = alRecinto([56, 6]);
  assert.ok(x1 < 1500 && y1 < 640 && y0 > 400, 'se sale de la tierra del baldío');
  assert.ok(x0 > DINAMITA.x + 120, `arranca en ${x0}, encima del perro dinamita`);
  assert.ok(Math.abs(MANSO.piso - DINAMITA.piso) < 12, 'no pisa la misma tierra que el dinamita');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BALDIO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 - 10 && vx < x1 + 10 && vy > y0 - 10 && vy < y1 + 10), `${id} queda adentro del perro`);
  }
  const escena = escenaBaldio(nombres);
  assert.ok(escena.includes(`data-marco="${ID}"`) && !escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('baldio-frente.webp'), 'el pasto no le queda delante');
});

test('la pose quieta de la isla es la del HTML, y con movimiento reducido tocarlo le deja el palo en la tercera costilla', () => {
  quietud({ id: ID, nuevo, armar: armarMansoCon, marcas, quieto: QUIETO, toca: CONTADO, parte: 'palo' });
  // En las dos fotos tiene la cabeza en la olla: no dice nada.
  assert.equal(giro(marcas(QUIETO).transform.cabeza!), 0);
  assert.equal(giro(marcas(CONTADO).transform.cabeza!), 0);
  const punta = CONTADO.palo[0] - A.palo / 2;
  assert.ok(Math.abs(punta - A.costillas.x[2]!) < 3, 'el palo de la foto no está en la tercera');
  assert.ok(CONTADO.costillas[2]! > CONTADO.costillas[1]! && CONTADO.costillas[2]! > CONTADO.costillas[3]!);
});

test('solo se atraganta y traga igual, quiere gruñir y le sale una burbuja, mueve la cola a nadie y mira; nadie le cuenta nada', () => {
  const visto = { espina: 0, cabeza: 0, burbuja: 0, revento: 0, cola: 0, sexta: 0, primeras: 0, cucharones: 0 };
  let habia = false;
  const hechas = vivir(nuevo, armarMansoCon, (dom) => {
    visto.espina = Math.max(visto.espina, Number(dom.de('espina', 'opacity')));
    visto.cabeza = Math.max(visto.cabeza, giro(dom.de('cabeza', 'transform')));
    const hay = dom.de('burbuja', 'opacity') === '1';
    if (hay) visto.burbuja++;
    if (habia && !hay) visto.revento++;
    habia = hay;
    visto.cola = Math.max(visto.cola, Math.abs(giro(dom.de('cola', 'transform'))));
    visto.sexta = Math.max(visto.sexta, salto(dom, 6));
    visto.primeras = Math.max(visto.primeras, salto(dom, 1), salto(dom, 2), salto(dom, 3));
    for (const n of [1, 2, 3]) visto.cucharones = Math.max(visto.cucharones, Math.abs(giro(dom.de(`cucharon-${n}`, 'transform')) - A.cucharones[n - 1]![2]));
  });
  for (const a of ['atraganta', 'gruñe', 'colea', 'mira']) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.equal(visto.espina, 1, 'nunca se atragantó');
  assert.ok(visto.cabeza > 25, 'nunca levantó la cabeza de la olla');
  assert.ok(visto.burbuja > 0 && visto.revento > 0, 'la burbuja no salió o no reventó');
  assert.ok(visto.cola > 25 && visto.sexta > 2, 'no movió la cola o el palo no le pegó en la sexta');
  // Solo, el palo no pasa de la última costilla, y los cucharones no se ríen.
  assert.ok(visto.primeras < 2, `solo, le saltaron las primeras costillas ${visto.primeras.toFixed(1)}`);
  assert.equal(visto.cucharones, 0);
});

test('tocado, el palo le cuenta las seis costillas de ida y de vuelta, los cucharones se ríen, y él no levanta la cabeza', () => {
  const orden: number[] = [];
  const visto = { cabeza: 0, risa: 0, parpado: 0 };
  const { dichos, dom } = tocar(nuevo, armarMansoCon, DURA.toque, (d) => {
    const alta = COSTILLAS.map((n) => salto(d, n));
    const cual = alta.indexOf(Math.max(...alta)) + 1;
    if (Math.max(...alta) > 5 && orden.at(-1) !== cual) orden.push(cual);
    visto.cabeza = Math.max(visto.cabeza, Math.abs(giro(d.de('cabeza', 'transform'))));
    for (const n of [1, 2, 3]) visto.risa = Math.max(visto.risa, Math.abs(giro(d.de(`cucharon-${n}`, 'transform')) - A.cucharones[n - 1]![2]));
    visto.parpado = Math.max(visto.parpado, Number(/scale\(1 ([\d.]+)\)/.exec(d.de('parpado', 'transform'))?.[1] ?? 0));
  });
  assert.deepEqual(orden, [6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6], `las contó así: ${orden.join(' ')}`);
  assert.ok(visto.cabeza < 5, 'levantó la cabeza: dijo algo');
  assert.ok(visto.risa > 10, 'los cucharones no se rieron');
  assert.ok(visto.parpado >= 0.5, 'no entornó el ojo');
  for (const n of COSTILLAS) assert.equal(salto(dom, n), 0, `la costilla ${n} no volvió`);
  assert.equal(puntaDelPalo(0), null);
  assert.ok(TOQUE_T.vuelta[1] < DURA.toque);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});
