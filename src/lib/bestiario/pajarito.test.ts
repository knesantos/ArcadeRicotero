import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capasDe } from './elenco.ts';
import { PAJARITO_PERSONAJE, PIEZAS_PAJARITO } from './arte-pajarito.ts';
import { BUENA, PAJARITO, PAJARITO_ARMADO as A, QUIETO, alRecinto, marcas } from './rig-pajarito.ts';
import { PIEZAS_ED } from './arte-ed.ts';
import { PIEZAS_PRISION } from './arte-prision.ts';
import { VECINOS_DE_LA_PRISION, escenaPrision } from './escenas.ts';
import { marcoDelRecinto } from './rig.ts';
import { DURA, TOQUE_T, armarPajaritoCon } from '../../scripts/bestiario/pajarito.ts';
import { domDeJuguete } from './juguete.ts';
import { giro, molde, nombres, quietud, tocar, trasl, vivir } from './juguete-tanda.ts';

/**
 * El pajarito del Lavi-rap (`D-73`, vigesimonovena vuelta): el pajarito de la suerte, en una jaula linda con una
 * etiqueta de precio más grande que él; que saque un papelito en blanco y se le caiga, que mire el precio, que
 * tocado dé la buena y la etiqueta se dé vuelta, y que la pose de la isla sea la del HTML.
 */

const ID = 'el-pajarito-del-lavi-rap';
const figura = capasDe('la-prision', 'figura', nombres, 1, ID);
const nuevo = () => domDeJuguete([figura], 'titere--pajarito');
const caja = (n: string): readonly [number, number, number, number] => PIEZAS_PAJARITO.find((p) => p.nombre === n)!.caja;
const adentro = (n: string, [x, y]: readonly [number, number]): boolean => {
  const [x0, y0, w, h] = caja(n);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};

test('el pajarito es un títere entero: cada parte con su pieza y su pivote, y es pájaro antes que pompón', () => {
  molde({
    id: ID, clase: 'titere--pajarito', marcado: figura, piezas: PIEZAS_PAJARITO, prefijo: 'pajarito', nombre: 'El pajarito del Lavi-rap', bloque: 'el pajarito del lavi-rap', tapa: 'cordero-atado', tintas: 10, peso: [40, 200],
    partes: ['entero', 'colgada', 'pajaro', 'cola', 'bulto', 'ala', 'cabeza', 'parpado', 'papel', 'buena', 'pluma', 'suelto', 'etiqueta', 'cara', 'precio-1', 'precio-2'], noSeTocan: '[data-parte="suelto"]',
  });
  assert.ok(adentro('pajarito-cabeza', A.cuello) && adentro('pajarito-cuerpo', A.cuello), 'la cabeza no sale del cuerpo');
  assert.ok(adentro('pajarito-cabeza', A.ojo) && adentro('pajarito-parpado', A.ojo) && adentro('pajarito-cabeza', A.pico), 'el ojo o el pico no están en la cabeza');
  assert.ok(adentro('pajarito-ala', A.hombro) && adentro('pajarito-cola', A.cola) && adentro('pajarito-patas', A.pies), 'el ala, la cola o las patas no salen de donde giran');
  // Las patas agarran la percha, y la percha está en el fondo de la jaula.
  assert.equal(A.pies[1], A.percha);
  assert.ok(adentro('pajarito-fondo', [0, A.percha]) && adentro('pajarito-fondo', A.clavo));
  // Ningún barrote de adelante le cruza el ojo: queda entre dos.
  for (const x of A.jaula.barrotes) assert.ok(Math.abs(x - A.ojo[0]) > 5, `el barrote de ${x} le pasa por el ojo`);
  assert.ok(A.jaula.hombro < A.ojo[1] - 8, 'el aro de la cúpula le cruza la cara');
  // No es la jaula de Mister Ed: no comparte ni una pieza ni una tinta con el caballo.
  for (const p of PIEZAS_ED) assert.doesNotMatch(p.dibujo, /--bestia-pajarito-/);
});

test('la etiqueta del precio es más grande que él, se lee quieta y del otro lado tiene más ceros', () => {
  const E = A.etiqueta;
  const pajaro = caja('pajarito-cuerpo');
  assert.ok(E.ancho > pajaro[2] && E.ancho * E.alto > pajaro[2] * pajaro[3], 'la etiqueta no es más grande que el pajarito');
  const ceros = (n: string): number => (PIEZAS_PAJARITO.find((p) => p.nombre === n)!.dibujo.match(/<ellipse cx="[\d.-]+" cy="[\d.-]+" rx="[\d.]+" ry="[\d.]+" fill="none" stroke="var\(--bestia-pajarito-negro\)"/g) ?? []).length;
  assert.equal(ceros('pajarito-etiqueta-1'), 6);
  assert.equal(ceros('pajarito-etiqueta-2'), 15);
  assert.doesNotMatch(PIEZAS_PAJARITO.map((p) => p.dibujo).join(''), /<text|font-family/);
  // Quieta muestra la cara del precio; dada vuelta, la otra, sin quedar en espejo.
  assert.equal(marcas(QUIETO).opacity['precio-1'], '1');
  assert.equal(marcas(QUIETO).opacity['precio-2'], '0');
  assert.equal(marcas(BUENA).opacity['precio-2'], '1');
  assert.match(marcas(BUENA).transform.cara!, /scale\(-1 1\)/);
  assert.ok(figura.includes(`data-parte="precio-2" opacity="0"><g transform="translate(${2 * E.x + E.ancho} 0) scale(-1 1)">`));
});

test('cuelga en el ala izquierda de la prisión, donde colgaba la jaulita pintada, que ya no está en el piso', () => {
  assert.equal(PAJARITO_PERSONAJE.ancla, PAJARITO.x);
  const pasillo = marcoDelRecinto('la-prision');
  const [x0, y0] = alRecinto([-A.jaula.medio - 6, A.clavo[1]]);
  const [x1, y1] = alRecinto([A.etiqueta.x + A.etiqueta.ancho + 4, A.etiqueta.y + A.etiqueta.alto]);
  assert.ok(x0 > pasillo.x && x1 < 0, 'se sale del ala de la izquierda');
  assert.ok(y0 <= 0, 'la cadena no llega al techo');
  // Abajo está la celda del reo y del chivato: la etiqueta no les llega a la reja.
  assert.ok(y1 < 268, `la etiqueta baja hasta ${y1.toFixed(0)}`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DE_LA_PRISION)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro de la jaula`);
  }
  const escena = escenaPrision(nombres);
  assert.ok(escena.includes(`data-marco="${ID}"`) && !escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  assert.ok(!PIEZAS_PRISION.some((p) => /jaul/.test(p.nombre)), 'queda una jaula entre las piezas de la prisión');
});

test('la pose quieta de la isla es la del HTML, y con movimiento reducido tocarlo lo pasa a con el papelito bueno', () => {
  quietud({ id: ID, nuevo, armar: armarPajaritoCon, marcas, quieto: QUIETO, toca: BUENA, parte: 'cabeza' });
  assert.equal(marcas(QUIETO).opacity.papel, '0');
  assert.equal(marcas(BUENA).opacity.papel, '1');
  assert.equal(marcas(BUENA).opacity.buena, '1');
});

test('solo saca un papelito en blanco y se le cae, mira el precio, se rasca y pierde una pluma, se hamaca; nunca da la buena', () => {
  const visto = { blanco: 0, cae: 0, pluma: 0, mece: 0, inclina: 0 };
  const hechas = vivir(nuevo, armarPajaritoCon, (dom) => {
    if (dom.de('papel', 'opacity') === '1') visto.blanco++;
    assert.equal(dom.de('buena', 'opacity'), '0', 'dio la buena sin que lo toquen');
    assert.equal(dom.de('precio-2', 'opacity'), '0', 'la etiqueta se dio vuelta sola');
    visto.cae = Math.max(visto.cae, trasl(dom.de('suelto', 'transform'))[1] * (Number(dom.de('suelto', 'opacity')) > 0 ? 1 : 0));
    visto.pluma = Math.max(visto.pluma, Number(dom.de('pluma', 'opacity')));
    visto.mece = Math.max(visto.mece, Math.abs(giro(dom.de('colgada', 'transform'))));
    visto.inclina = Math.max(visto.inclina, giro(dom.de('pajaro', 'transform').split(') ')[1]!));
  });
  for (const a of ['saca', 'precio', 'rasca', 'hamaca']) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(visto.blanco > 0, 'nunca sacó un papelito');
  assert.ok(visto.cae > A.jaula.base, `el papelito cayó hasta ${visto.cae.toFixed(0)}: no salió de la jaula`);
  assert.equal(visto.pluma, 1);
  assert.ok(visto.mece > 4, 'la jaula no se hamacó');
  assert.ok(visto.inclina > 28, 'no se estiró a mirar el precio');
});

test('tocado da la buena: saca el papelito de la tilde, lo levanta, y la etiqueta se da vuelta; después lo guarda', () => {
  const visto = { buena: 0, pico: 0, vuelta: 0, antes: 0, ala: 0 };
  const { dichos, dom } = tocar(nuevo, armarPajaritoCon, DURA.toque, (d, u) => {
    const buena = Number(d.de('buena', 'opacity')) * Number(d.de('papel', 'opacity'));
    if (u < TOQUE_T.busca[1] - 0.05) visto.antes = Math.max(visto.antes, buena);
    visto.buena = Math.max(visto.buena, buena);
    visto.pico = Math.min(visto.pico, giro(d.de('cabeza', 'transform')));
    visto.vuelta = Math.max(visto.vuelta, Number(d.de('precio-2', 'opacity')));
    visto.ala = Math.min(visto.ala, giro(d.de('ala', 'transform')));
  });
  assert.equal(visto.antes, 0, 'tenía el papelito antes de ir a buscarlo');
  assert.equal(visto.buena, 1);
  assert.ok(visto.pico < -10, 'no levantó el pico');
  assert.equal(visto.vuelta, 1, 'la etiqueta no se dio vuelta');
  assert.ok(visto.ala < -15, 'no aleteó');
  assert.equal(dom.de('papel', 'opacity'), '0', 'no guardó el papelito');
  assert.equal(dom.de('precio-1', 'opacity'), '1', 'la etiqueta no volvió');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});
