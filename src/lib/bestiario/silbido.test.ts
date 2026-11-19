import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capasDe } from './elenco.ts';
import { PIEZAS_SILBIDO, SILBIDO_PERSONAJE } from './arte-silbido.ts';
import { QUIETO, SILBIDO, SILBIDO_ARMADO as A, TREN, alRecinto, marcas, vuelo } from './rig-silbido.ts';
import { VECINOS_DEL_BALDIO, escenaBaldio } from './escenas.ts';
import { ATILA, CHAPA } from './rig.ts';
import { MATON } from './rig-maton.ts';
import { DURA, TOQUE_T, armarSilbidoCon } from '../../scripts/bestiario/silbido.ts';
import { azar, escenario } from './juguete.ts';
import { domDeJuguete } from './juguete.ts';
import { giro, molde, nombres, quietud, tocar, trasl, vivir } from './juguete-tanda.ts';

/**
 * El gato que llamás con silbidos (`D-73`, vigesimonovena vuelta): un gato linyera sentado de espaldas en una señal
 * de tren, con el atadito al hombro y los silbidos apilados al lado; que al silbido de quien toca le gire una oreja y
 * nada más, que al del tren se pare tarde, y que la pose de la isla sea la del HTML.
 */

const ID = 'el-gato-que-llamas-con-silbidos';
const figura = capasDe('los-techos', 'figura', nombres, 1, ID);
const nuevo = () => domDeJuguete([figura], 'titere--silbido');
const caja = (n: string): readonly [number, number, number, number] => PIEZAS_SILBIDO.find((p) => p.nombre === n)!.caja;
const adentro = (n: string, [x, y]: readonly [number, number]): boolean => {
  const [x0, y0, w, h] = caja(n);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
/** Cuánto giró una oreja: su transformación es `translate(...) rotate(...)`. */
const oreja = (d: ReturnType<typeof domDeJuguete>, n: number): number => giro(d.de(`oreja-${n}`, 'transform'));
const escalaY = (t: string): number => Number(/scale\(-?[\d.]+ ([\d.]+)\)/.exec(t)?.[1] ?? NaN);

test('el gato es un títere entero, en su señal: cada parte con su pieza y su pivote, y nada fijo le cruza la cara', () => {
  molde({
    id: ID, clase: 'titere--silbido', marcado: figura, piezas: PIEZAS_SILBIDO, prefijo: 'silbido', nombre: 'El gato que llamás con silbidos', bloque: 'el gato que llamas con silbidos', tapa: 'un-baion-para-el-ojo-idiota', tintas: 14, peso: [25, 180],
    partes: ['entero', 'tren', 'brazo', 'pila', 'pila-1', 'pila-2', 'pila-3', 'gato', 'cola', 'lomo', 'arriba', 'cabeza', 'oreja-1', 'oreja-2', 'parpado', 'atadito', 'bulto', 'silbido'], noSeTocan: '[data-parte="tren"]',
  });
  assert.ok(adentro('silbido-cabeza', A.ojo) && adentro('silbido-parpado', A.ojo) && adentro('silbido-cabeza', A.cuello) && adentro('silbido-cuerpo', [A.cuello[0], A.cuello[1] + 3]), 'la cabeza no sale del lomo');
  for (const o of A.orejas) assert.ok(adentro('silbido-cabeza', o), 'una oreja no sale de la cabeza');
  assert.ok(adentro('silbido-cola', A.cola) && adentro('silbido-cuerpo', A.cola) && adentro('silbido-bulto', A.bulto) && adentro('silbido-palito', [A.hombro[0] + 2, A.hombro[1] + 5]));
  assert.ok(adentro('silbido-brazo', A.eje) && adentro('silbido-poste', A.eje) && adentro('silbido-poste', [0, 0]) && adentro('silbido-poste', [A.asiento[0], A.tabla + 2]));
  // La cara: el palo de la señal queda detrás de la nuca, el brazo sale para el otro lado, y el bulto no llega al ojo.
  const [cx, , cw] = caja('silbido-cabeza');
  assert.ok(cx > 3, 'el palo le pasa por la cabeza');
  const [, by, , bh] = caja('silbido-brazo');
  assert.ok(by + bh < caja('silbido-cabeza')[1] - 6, 'el brazo de la señal le cruza la cabeza');
  assert.ok(A.bulto[0] + 12 < A.ojo[0] - 8 && A.ojo[0] < cx + cw);
  // De espaldas, pero con la cara entera: el ojo, de perfil, mira para donde pasa el tren.
  assert.ok(A.ojo[0] > A.cuello[0] && A.tren.desde > A.ojo[0]);
  // Mira para la izquierda del recinto: la escena lo da vuelta.
  assert.equal(SILBIDO.lado, -1);
  assert.ok(marcas(QUIETO).transform.entero!.includes(`scale(${-SILBIDO.escala} ${SILBIDO.escala})`));
});

test('está en la chapa de los techos, entre el Atila y la torre, y no se parece ni le pisa el lugar al gato matón', () => {
  assert.equal(SILBIDO_PERSONAJE.ancla, SILBIDO.x);
  assert.ok(SILBIDO.piso >= CHAPA.arriba && SILBIDO.piso <= CHAPA.piso, 'el palo no está clavado en la chapa');
  const [x1, y0] = alRecinto([-16, A.eje[1] - 16]);
  const [x0, y1] = alRecinto([56, 0]);
  assert.ok(x0 > ATILA.x + 60 && x0 > MATON.x + 300 && y0 > 0 && x1 < 1500, 'pisa al Atila, al matón, o se sale');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BALDIO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro de la señal`);
  }
  // El tren pasa lejos, del lado para donde mira, y no llega al Atila.
  const [tx] = alRecinto([A.tren.hasta + 14, A.tren.y]);
  assert.ok(tx < x0 && tx > ATILA.x + 30, `el tren llega hasta ${tx}`);
  const escena = escenaBaldio(nombres);
  assert.ok(escena.includes(`data-marco="${ID}"`) && !escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // El matón es atigrado y está agazapado; este es rosa, flaco y está sentado: más alto que ancho.
  const [, , w, h] = caja('silbido-cuerpo');
  assert.ok(h > w);
});

test('la pose quieta de la isla es la del HTML, y con movimiento reducido tocarlo lo pasa de sentado a parado, con la señal baja', () => {
  quietud({ id: ID, nuevo, armar: armarSilbidoCon, marcas, quieto: QUIETO, toca: TREN, parte: 'brazo' });
  const q = marcas(QUIETO);
  assert.equal(q.opacity.tren, '0');
  assert.equal(q.opacity.silbido, '0');
  assert.equal(q.opacity['pila-1'], '0');
  const t = marcas(TREN);
  assert.ok(Number(t.opacity.tren) > 0.9, 'en la foto del toque no se ve el tren');
  assert.equal(t.opacity['pila-1'], '1');
  assert.equal(giro(t.transform.brazo!), -45);
  assert.ok(escalaY(t.transform.lomo!) > 1.2);
});

test('el silbido le pega en el lomo y cae al montón; lo de arriba del lomo sube lo que el lomo se estira', () => {
  const pega = vuelo(0.6);
  assert.ok(Math.abs(pega.x - A.silbido.pega[0]) < 0.5 && Math.abs(pega.y - A.silbido.pega[1]) < 0.5);
  assert.ok(adentro('silbido-cuerpo', A.silbido.pega), 'no le pega en el lomo');
  const cae = vuelo(0.999);
  assert.ok(Math.abs(cae.x - A.silbido.cae[0]) < 1 && Math.abs(cae.y - A.silbido.cae[1]) < 1.5 && cae.y < A.tabla, 'no cae en la tabla');
  assert.equal(vuelo(0).opacidad, 0);
  assert.equal(vuelo(1).opacidad, 0);
  for (const para of [0, 0.5, 1]) {
    const t = marcas({ ...QUIETO, para }).transform;
    assert.ok(Math.abs(-trasl(t.arriba!)[1] - A.hombros * (escalaY(t.lomo!) - 1)) < 0.02, 'la cabeza se despega del lomo');
  }
});

test('solo le llegan silbidos y se le juntan en la tabla hasta el tope, amaga a pararse, le late el atadito y cabecea; el tren no pasa, la señal no baja y no barre nada', () => {
  const visto = { silbido: 0, barre: 0, para: 0, late: 0, cabecea: 0, pila: 0, baja: 0 };
  let antes = 0;
  const hechas = vivir(nuevo, armarSilbidoCon, (dom) => {
    visto.silbido = Math.max(visto.silbido, Number(dom.de('silbido', 'opacity')));
    visto.barre = Math.max(visto.barre, trasl(dom.de('pila', 'transform'))[1]);
    // El montón: cuántos silbidos nuevos hay. Solo, crece de a uno y nunca baja.
    const hay = [1, 2, 3].reduce((s, n) => s + Number(dom.de(`pila-${n}`, 'opacity')), 0);
    if (hay < antes) visto.baja++;
    assert.ok(hay - antes <= 1, 'el montón creció de a más de uno');
    antes = hay;
    visto.pila = Math.max(visto.pila, hay);
    visto.para = Math.max(visto.para, escalaY(dom.de('lomo', 'transform')));
    visto.late = Math.max(visto.late, Number(/scale\(([\d.]+)\)/.exec(dom.de('bulto', 'transform'))?.[1] ?? 1));
    visto.cabecea = Math.max(visto.cabecea, giro(dom.de('gato', 'transform')));
    assert.equal(dom.de('tren', 'opacity'), '0', 'pasó el tren sin que lo toquen');
    assert.equal(giro(dom.de('brazo', 'transform')), 0, 'la señal bajó sola');
  });
  for (const a of ['llega', 'amaga', 'late', 'cabecea']) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.equal(visto.silbido, 1);
  assert.equal(visto.barre, 0, 'barrió sin que lo toquen');
  assert.equal(visto.pila, A.tope, `el montón llegó a ${visto.pila}`);
  // Baja solo al empezar cada una de las tres vidas de la prueba (un gato nuevo arranca sin silbidos).
  assert.equal(visto.baja, 2);
  // Amaga, pero no se para del todo: parado mide 1,28.
  assert.ok(visto.para > 1.12 && visto.para < 1.22, `se paró ${visto.para.toFixed(2)}`);
  assert.ok(visto.late > 1.15 && visto.cabecea > 12);
});

test('tocado, a tu silbido le gira una oreja y nada más; al del tren se para, se agazapa, y ya pasó: se sienta y barre tu silbido', () => {
  const visto = { orejaAntes: 0, otraAntes: 0, paraAntes: 1, para: 0, agazapa: 0, tren: 0, brazo: 0, paradoConTren: 0, pila: 0, barre: 0 };
  const { dichos, dom } = tocar(nuevo, armarSilbidoCon, DURA.toque, (d, u) => {
    const alto = escalaY(d.de('lomo', 'transform'));
    if (u < TOQUE_T.senal[0]) {
      visto.orejaAntes = Math.min(visto.orejaAntes, oreja(d, 1));
      visto.otraAntes = Math.max(visto.otraAntes, Math.abs(oreja(d, 2)));
      visto.paraAntes = Math.max(visto.paraAntes, alto);
      assert.equal(d.de('tren', 'opacity'), '0');
    }
    visto.para = Math.max(visto.para, alto);
    visto.agazapa = Math.max(visto.agazapa, giro(d.de('gato', 'transform')));
    const tren = Number(d.de('tren', 'opacity'));
    visto.tren = Math.max(visto.tren, tren);
    visto.brazo = Math.min(visto.brazo, giro(d.de('brazo', 'transform')));
    // Cuando termina de agazaparse, el tren ya va por la mitad: llega tarde.
    if (u > TOQUE_T.agazapa[1] && u < TOQUE_T.agazapa[1] + 0.05) visto.paradoConTren = trasl(d.de('tren', 'transform'))[0];
    visto.pila = Math.max(visto.pila, Number(d.de('pila-1', 'opacity')));
    visto.barre = Math.max(visto.barre, trasl(d.de('pila', 'transform'))[1]);
  });
  assert.ok(visto.orejaAntes < -40, 'no giró la oreja');
  assert.ok(visto.otraAntes < 6 && visto.paraAntes < 1.04, 'a tu silbido le hizo más caso que una oreja');
  assert.ok(visto.brazo < -44, 'la señal no bajó');
  assert.equal(visto.tren, 1);
  assert.ok(visto.para > 1.27 && visto.agazapa > 9, 'no se paró o no se agazapó');
  assert.ok(visto.paradoConTren > (A.tren.desde + A.tren.hasta) / 2, 'el tren todavía no había pasado');
  assert.equal(visto.pila, 1);
  assert.ok(visto.barre > 40, 'no barrió tu silbido');
  assert.equal(dom.de('pila-1', 'opacity'), '0', 'el montón no volvió a empezar');
  assert.ok(escalaY(dom.de('lomo', 'transform')) < 1.03, 'no se sentó');
  assert.equal(giro(dom.de('brazo', 'transform')), 0, 'la señal no volvió');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('el montón persiste: los silbidos que juntó solo siguen ahí cuando lo tocan, el tuyo suma uno, y el toque los barre todos', () => {
  const dom = nuevo();
  const { esc, poner } = escenario(false);
  const vivo = armarSilbidoCon(dom.marcos, esc, azar(2));
  const hay = (): number => [1, 2, 3].reduce((s, n) => s + Number(dom.de(`pila-${n}`, 'opacity')), 0);
  let t = 0;
  const correr = (hasta: () => boolean, tope: number): void => {
    for (let i = 0; i < 60 * tope && !hasta(); i++) {
      t += 1 / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
    }
  };
  // Vive solo hasta juntar un silbido y quedar libre.
  correr(() => hay() === 1 && vivo.estado().accion === null, 200);
  assert.equal(hay(), 1, 'no juntó ningún silbido');
  dom.oyentes.get('click')!({});
  correr(() => hay() === 2, TOQUE_T.silbido[1] + 0.3);
  assert.equal(hay(), 2, 'tu silbido no se sumó al que ya tenía');
  correr(() => vivo.estado().accion !== 'toque', DURA.toque + 0.5);
  assert.equal(hay(), 0, 'no barrió el montón');
  // Y otro gato, armado aparte, no hereda la cuenta de este.
  const otro = nuevo();
  armarSilbidoCon(otro.marcos, escenario(false).esc, azar(2)).mover(0.1, 1 / 60);
  assert.equal(otro.de('pila-1', 'opacity'), '0');
});
