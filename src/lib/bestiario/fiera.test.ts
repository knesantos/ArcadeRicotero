import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capasDe } from './elenco.ts';
import { FIERA_PERSONAJE, PIEZAS_FIERA, fieraEn } from './arte-fiera.ts';
import { ATACA, FIERA, FIERA_ARMADO as A, QUIETO, cadena, collar, marcas } from './rig-fiera.ts';
import { JAULA_VACIA, VECINOS_DE_LA_PRISION, escenaPrision } from './escenas.ts';
import { PRISION } from './rig.ts';
import { DURA, TOQUE_T, armarFieraCon } from '../../scripts/bestiario/fiera.ts';
import { domDeJuguete } from './juguete.ts';
import { molde, nombres, quietud, tocar, trasl, vivir } from './juguete-tanda.ts';

/**
 * La fiera más fiera (`D-73`, vigesimonovena vuelta): la jaula de siempre, vuelta títere. A la fiera no se la dibuja:
 * se la nota en el collar que flota, la cadena, el hueso, el aliento y la puerta; que roa y se le caiga, que encare la
 * puerta y la cadena la frene, que tocada combe los barrotes y deje cuatro tajos, y que la pose de la isla sea la del HTML.
 */

const ID = 'la-fiera-mas-fiera';
const delante = capasDe('la-prision', 'delante', nombres, 1, ID);
const nuevo = () => domDeJuguete([delante], 'titere--fiera');
/** El primer número del último `scale(...)` de una transformación. */
const escala = (t: string): number => Number([...t.matchAll(/scale\((-?[\d.]+)/g)].at(-1)?.[1] ?? NaN);

test('la fiera es un títere entero y no tiene cuerpo: lo que se mueve es lo que tiene puesto', () => {
  molde({
    id: ID, clase: 'titere--fiera', marcado: delante, piezas: PIEZAS_FIERA, prefijo: 'fiera', nombre: 'La fiera más fiera', bloque: 'la fiera mas fiera', tapa: 'la-mosca-y-la-sopa', tintas: 9, peso: [40, 220],
    partes: ['entero', 'jaula', 'cadena-1', 'cadena-2', 'hueso', 'collar', 'chapita', 'aliento', 'barrotes', 'combada', 'puerta', 'tajos'], noSeTocan: '[data-parte="tajos"]',
  });
  // Ni un ojo, ni una pata, ni una cabeza: la pregunta de la letra queda sin contestar.
  for (const p of PIEZAS_FIERA) assert.doesNotMatch(p.nombre, /ojo|cabeza|pata|cuerpo|boca/);
  assert.ok(!delante.includes('ojos-'));
  // La jaula va tallada, como el resto de la prisión; el collar, soplado con grano.
  const dibujo = (n: string): string => PIEZAS_FIERA.find((p) => p.nombre === n)!.dibujo;
  assert.match(dibujo('fiera-jaula'), /url\(#gubia\)/);
  assert.match(dibujo('fiera-collar'), /url\(#grano\)/);
  assert.notEqual(dibujo('fiera-jaula'), dibujo('fiera-combada'));
});

test('está donde estuvo siempre la jaula, adelante de todo, y ya no hay otra jaula pintada en el piso', () => {
  const J = PRISION.jaula;
  assert.equal(FIERA_PERSONAJE.ancla, FIERA.x);
  assert.equal(FIERA.x + A.jaula.x0, J.x0);
  assert.equal(FIERA.x + A.jaula.x1, J.x1);
  assert.equal(FIERA.piso, J.piso);
  assert.equal(FIERA.piso + A.jaula.arriba, J.arriba);
  assert.equal(FIERA.x + A.puerta.x, J.puerta.x);
  assert.equal(JAULA_VACIA.id, ID);
  assert.ok(!(ID in VECINOS_DE_LA_PRISION));
  const escena = escenaPrision(nombres);
  assert.ok(!escena.includes('prision-jaula.webp') && !escena.includes('prision-puerta.webp') && !escena.includes('bestia--jaula'), 'sigue la jaula vieja');
  assert.ok(escena.indexOf('prision-columna.webp') < escena.indexOf(`data-marco="${ID}"`), 'la columna le queda delante');
  assert.equal(escena.split(`data-id="${ID}"`).length, 2);
  // El collar quieto flota adentro de la jaula, a la altura del cogote: ni tirado ni contra el techo.
  const [cx, cy] = collar(QUIETO);
  assert.ok(cx > A.jaula.x0 + 30 && cx < A.jaula.x1 - 30 && cy < -110 && cy > -220);
});

test('la pose quieta de la isla es la del HTML, y con movimiento reducido tocarla pasa de la jaula quieta a la combada', () => {
  quietud({ id: ID, nuevo, armar: armarFieraCon, marcas, quieto: QUIETO, toca: ATACA, parte: 'collar' });
  const q = marcas(QUIETO);
  assert.equal(q.opacity.barrotes, '1');
  assert.equal(q.opacity.combada, '0');
  assert.equal(q.opacity.tajos, '0');
  const a = marcas(ATACA);
  assert.equal(a.opacity.combada, '1');
  assert.equal(a.opacity.tajos, '1');
  assert.ok(fieraEn(ATACA).includes('fiera-tajos.webp'));
});

test('la cadena cuelga floja cuando está quieta y se pone tirante cuando ataca, sin soltarse de la argolla ni hundirse', () => {
  const floja = cadena(QUIETO);
  const tirante = cadena(ATACA);
  assert.ok(floja.estira <= 1.001, `quieta se estira ${floja.estira.toFixed(2)}`);
  assert.ok(tirante.estira >= 0.98 && tirante.estira < 1.2, `atacando se estira ${tirante.estira.toFixed(2)}`);
  for (const m of [QUIETO, ATACA]) {
    const { transform: t } = marcas(m);
    assert.deepEqual(trasl(t['cadena-1']!), [...A.argolla]);
    const [mx, my] = trasl(t['cadena-2']!);
    const c = cadena(m);
    assert.ok(Math.abs(mx - c.medio[0]) < 0.02 && Math.abs(my - c.medio[1]) < 0.02);
    assert.ok(c.medio[1] <= -3, 'la cadena se hunde en el piso');
  }
});

test('sola roe y se le cae, encara la puerta y la cadena la frena, se echa y huele; nunca sale ni comba los barrotes', () => {
  let hueso = 0;
  let izquierda = 0;
  let cerrada = 1;
  let abajo = -999;
  let estira = 0;
  const hechas = vivir(nuevo, armarFieraCon, (dom) => {
    hueso = Math.min(hueso, trasl(dom.de('hueso', 'transform'))[1]);
    const [x, y] = trasl(dom.de('collar', 'transform'));
    izquierda = Math.min(izquierda, x);
    abajo = Math.max(abajo, y);
    cerrada = Math.min(cerrada, escala(dom.de('puerta', 'transform')));
    estira = Math.max(estira, escala(dom.de('cadena-2', 'transform')));
    assert.equal(dom.de('combada', 'opacity'), '0');
    assert.equal(dom.de('tajos', 'opacity'), '0');
  });
  for (const a of ['roe', 'puerta', 'echa', 'huele']) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(hueso < -120, `el hueso subió hasta ${hueso.toFixed(0)}`);
  assert.ok(cerrada < -0.5, 'la puerta no se le cerró');
  // Llega al hueco de la puerta y no lo pasa: la bisagra está en -70.
  assert.ok(izquierda < -30 && izquierda > A.puerta.x, `llegó hasta ${izquierda.toFixed(0)}`);
  assert.ok(abajo > -60, 'no se echó');
  assert.ok(estira < 1.2, `la cadena se estiró ${estira.toFixed(2)}`);
});

test('tocada toma carrera, se tira contra los barrotes, que se comban, deja los tajos, y todo vuelve a su lugar', () => {
  const visto = { atras: 0, comba: 0, tajos: 0, tiembla: 0, antes: 0 };
  const { dichos, dom } = tocar(nuevo, armarFieraCon, DURA.toque, (d, u) => {
    visto.atras = Math.max(visto.atras, trasl(d.de('collar', 'transform'))[0] - A.cogote[0]);
    const comba = Number(d.de('combada', 'opacity'));
    if (u < TOQUE_T.salto[0]) visto.antes = Math.max(visto.antes, comba);
    visto.comba = Math.max(visto.comba, comba);
    visto.tajos = Math.max(visto.tajos, Number(d.de('tajos', 'opacity')));
    visto.tiembla = Math.max(visto.tiembla, Math.abs(trasl(d.de('jaula', 'transform'))[0]));
    assert.ok(Math.abs(Number(d.de('barrotes', 'opacity')) + comba - 1) < 0.011);
  });
  assert.ok(visto.atras > 12, 'no tomó carrera');
  assert.equal(visto.antes, 0, 'los barrotes se combaron antes del golpe');
  assert.equal(visto.comba, 1);
  assert.equal(visto.tajos, 1);
  assert.ok(visto.tiembla > 2, 'la jaula no se sacudió');
  assert.equal(dom.de('combada', 'opacity'), '0', 'los barrotes no se enderezaron');
  assert.equal(dom.de('tajos', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});
