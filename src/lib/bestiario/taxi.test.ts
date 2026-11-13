import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_TAXI, TAXI_PERSONAJE } from './arte-taxi.ts';
import { ABRE, ESCONDE, LEVITA, LEVITA_ALTO, QUIETO, TAXI, TAXI_ARMADO, alRecinto, marcas, type Punto } from './rig-taxi.ts';
import { PIBA } from './rig-piba.ts';
import { COSAS_DE_LA_RUTA, FIERROS, OJOS_DE_LA_RUTA, RUTA } from './rig-entornos.ts';
import { escenaRuta } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, GIRA, PARPADEOS, TOQUE_T, armarTaxiCon, type Accion } from '../../scripts/bestiario/taxi.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El taxi paranormal (`D-73`, vigesimoséptima vuelta): que sea un títere entero a aerógrafo volcado en la banquina
 * de este lado, con las ruedas para arriba, quieto y fuera del tránsito, que ya no esté pintado en el piso, que se
 * le escapen las cosas que le quedaron prendidas, que tocado levite, se vaya de foco, se le escape el diablo, salude
 * el chofer y caiga, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-taxi-paranormal';
const figura = capasDe('la-ruta', 'delante', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_TAXI.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--taxi');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const parpadoDe = (transform: string): number => Number(/scale\(1 ([\d.]+)\)/.exec(transform)?.[1] ?? NaN);

test('el taxi es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--taxi" data-id="el-taxi-paranormal" role="button" tabindex="0" aria-label="El taxi paranormal">/);
  for (const p of ['entero', 'fierro', 'haz', 'doble', 'cola', 'baul', 'diablo', 'rueda-1', 'rueda-2', 'libre', 'parpado', 'brazo', 'pompas']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al taxi le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_TAXI.map((p) => p.nombre).sort());
  for (const p of PIEZAS_TAXI) assert.match(p.nombre, /^taxi-/);
  const A = TAXI_ARMADO;
  for (const n of [0, 1] as const) {
    // Las ruedas, para arriba: el eje queda arriba del medio del fierro, y la rueda asoma del piso del auto.
    assert.ok(adentro(`taxi-rueda-${n + 1}`, A.ruedas[n]) && A.ruedas[n][1] < A.medio[1], `la rueda ${n + 1} no está para arriba`);
    assert.ok(A.ruedas[n][1] - A.radio < caja('taxi-carroceria')[1], `la rueda ${n + 1} no asoma`);
  }
  assert.ok(adentro('taxi-carroceria', A.faro.centro) && adentro('taxi-parpado', A.faro.centro) && adentro('taxi-haz', A.faro.centro), 'el faro no está en la trompa');
  assert.ok(adentro('taxi-baul', A.baul) && adentro('taxi-carroceria', A.baul), 'el baúl no tiene bisagra');
  assert.ok(adentro('taxi-diablo', A.diablo) && adentro('taxi-cola', A.cola), 'el diablo no sale del baúl');
  // El diablo cuelga del baúl: afuera queda abajo de la chapa y a la izquierda de la cabina; escondido, atrás de la chapa.
  const [dx0, dy0, dw, dh] = caja('taxi-diablo');
  assert.ok(dx0 + dw < -84 && dy0 + dh / 2 > -40, 'afuera, el diablo queda atrás de la cabina o de la chapa');
  assert.ok(A.diablo[1] - ESCONDE < -46 && A.diablo[1] - ESCONDE > caja('taxi-carroceria')[1], 'escondido, el diablo no queda atrás de la chapa');
  // La tapa del baúl se dibuja antes que él, para no cruzarle la cara; y la chapa, después de los dos.
  assert.ok(figura.indexOf('data-parte="baul"') < figura.indexOf('data-parte="diablo"') && figura.indexOf('data-parte="diablo"') < figura.indexOf('taxi-carroceria.webp'));
  // Es un taxi: negro y amarillo como el del carril, con el cartel del techo. Las tintas de la tapa van en los detalles.
  const chapa = PIEZAS_TAXI.find((p) => p.nombre === 'taxi-carroceria')!.dibujo;
  assert.ok(chapa.includes('var(--fondo)') && chapa.includes('var(--acento-2)') && chapa.includes('rotate(176'), 'no es negro y amarillo, o le falta el cartel');
  // Sus yuyos de adelante son bajos: no llegan al faro ni a los ojos del diablo.
  const [, yy] = caja('taxi-yuyos');
  assert.ok(yy > A.faro.centro[1] + A.faro.radio + 30 && yy > A.diablo[1] - ESCONDE * 0.4 + 6, 'los yuyos le cruzan la cara');
  assert.ok(adentro('taxi-brazo', A.codo) && adentro('taxi-carroceria', A.codo), 'el brazo no sale de la ventanilla');
  assert.ok(adentro('taxi-libre', A.libre) && adentro('taxi-carroceria', A.libre), 'la bandera no está en el parabrisas');
  assert.ok(adentro('taxi-carroceria', A.escape), 'el escape no está en el fierro');
  // El techo apoya en la banquina: la carrocería llega al piso y no lo pasa.
  const [, cy, , ch] = caja('taxi-carroceria');
  assert.ok(cy + ch >= 0 && cy + ch <= 6, 'el techo no apoya');
  for (const p of PIEZAS_TAXI) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  assert.ok(figura.lastIndexOf('taxi-yuyos.webp') > figura.indexOf('taxi-carroceria.webp'), 'los yuyos no van adelante');
  for (const n of ['taxi-banquina', 'taxi-carroceria', 'taxi-rueda-1']) assert.match(PIEZAS_TAXI.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  // El haz no es un degradado liso: va rociado.
  assert.match(PIEZAS_TAXI.find((p) => p.nombre === 'taxi-haz')!.dibujo, /url\(#rociado\)/);
  const peso = PIEZAS_TAXI.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del taxi están en su bloque de tokens.css, medidas en Momo Sampler, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el taxi paranormal⟩'), tokens.indexOf('⟨/el taxi paranormal⟩'));
  const usadas = new Set(PIEZAS_TAXI.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-taxi-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del taxi`);
  assert.match(bloque, /public\/tapas\/momo-sampler\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el taxi paranormal⟩ */'), sitio.indexOf('/* ⟨/el taxi paranormal⟩ */'));
  assert.match(suyo, /\.titere--taxi \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"haz"') && suyo.includes('"doble"') && suyo.includes('"pompas"'), 'el haz, el doble o las pompas se pueden tocar');
});

test('está volcado en la banquina de este lado, quieto y fuera del tránsito, sin pisar a nadie, y ya no está pintado en el piso', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'la-ruta');
  assert.equal(TAXI_PERSONAJE.ancla, TAXI.x);
  assert.deepEqual([TAXI.x, TAXI.piso], [RUTA.volcado.x, RUTA.volcado.piso]);
  // En la banquina: apoyado más abajo que el asfalto. Las ruedas, para arriba, asoman sobre el carril de adelante
  // (los fierros le pasan por detrás), pero ni así llega al carril de atrás.
  assert.ok(TAXI.piso > RUTA.asfalto.abajo + 20 && TAXI.piso < 640);
  const [x0, y0] = alRecinto([-172, -126 - LEVITA_ALTO]);
  const [x1] = alRecinto([172, 0]);
  const [, arriba] = alRecinto([0, -TAXI_ARMADO.radio + TAXI_ARMADO.ruedas[0][1]]);
  assert.ok(arriba > RUTA.carriles[0] + 20, `apoyado llega a ${arriba.toFixed(0)}, al carril de atrás`);
  assert.ok(x0 > 0 && x1 < 900, 'se sale del recinto');
  // No pisa a la piba que duerme ni a la bella señora.
  assert.ok(x0 > PIBA.x + 120, 'pisa a la piba');
  for (const [id, [vx, vy]] of Object.entries(OJOS_DE_LA_RUTA)) assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < TAXI.piso), `${id} queda adentro del taxi`);
  // Donde decía su lugar de cosa pintada está él, y ya no es una cosa ni un fierro que pasa.
  const [cx, cy] = COSAS_DE_LA_RUTA[ID]!;
  assert.ok(cx > x0 && cx < x1 && cy > y0 && cy < TAXI.piso);
  assert.ok(!(ID in FIERROS), 'pasa con el tránsito');
  const escena = escenaRuta(nombres);
  assert.ok(!escena.includes(`bestia--cosa" data-id="${ID}"`), 'sigue siendo una cosa pintada');
  assert.ok(escena.indexOf('class="fierros"') < escena.indexOf(`data-marco="${ID}"`), 'los fierros le pasan por delante');
  // Va adelante de los yuyos de `ruta-frente`, que si no lo rayan entero.
  assert.ok(escena.indexOf('/bestiario/ruta-frente.webp') < escena.indexOf(`data-marco="${ID}"`), 'los yuyos de adelante lo tapan');
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /RUTA\.volcado/, 'sigue pintado en el piso de la ruta');
  const piso = pisoDelCamino(CAMINOS['la-ruta']!, nombres);
  const m = /data-marco="el-taxi-paranormal" data-capa="delante" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en la ruta del camino');
  assert.equal(Number(m![1]), Math.round(TAXI.x * (K_ENTORNO - 1)));
  assert.ok(!piso.includes(`bestia--cosa" data-id="${ID}"`), 'sigue siendo una cosa en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarTaxiCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.deepEqual(trasladoDe(marcas(QUIETO).transform.fierro!), [0, 0], 'quieto no está apoyado');
  // En reposo ya se le escapa un poquito el diablo: asoma, pero no entero.
  const asoma = 1 + trasladoDe(marcas(QUIETO).transform.diablo!)[1] / ESCONDE;
  assert.ok(asoma > 0.4 && asoma < 0.8, `en reposo el diablo asoma ${asoma}`);
});

test('se le escapa lo que le quedó prendido: gira una rueda y se frena sola, parpadea, larga pompas, se le escapa la cola, tamborilea, se va de foco y titila', () => {
  const hechas: Record<Accion, number> = { rueda: 0, parpadea: 0, pompas: 0, cola: 0, dedos: 0, foco: 0, libre: 0, levita: 0 };
  let parpadeos = 0;
  let pompas = 0;
  let rapido = 0;
  let frenadas = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarTaxiCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    let saliendo = false;
    let girando = false;
    for (let i = 1; i <= 60 * 70; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const k = parpadoDe(dom.de('parpado', 'transform'));
      if (k > 0.9 && !cerrado) parpadeos++;
      if (k > 0.9) cerrado = true;
      if (k < 0.6) cerrado = false;
      const hay = Number(dom.de('pompas', 'opacity')) > 0.9;
      if (hay && !saliendo) pompas++;
      saliendo = hay;
      const v = Math.max(...vivo.estado().giro.map(Math.abs));
      rapido = Math.max(rapido, v);
      // Una rueda que venía girando y ya no la empuja nadie se frena sola, de a poco: no se clava.
      if (girando && v === 0) frenadas++;
      girando = v > 0;
      // Sin tocarlo, no levita ni se le escapa el diablo entero.
      assert.deepEqual(trasladoDe(dom.de('fierro', 'transform'))[1], 0);
      assert.ok(-trasladoDe(dom.de('diablo', 'transform'))[1] > ESCONDE * 0.15, 'se le escapó el diablo entero');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['rueda', 'parpadea', 'pompas', 'cola', 'dedos', 'foco', 'libre'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.levita, 0, 'levitó sin que lo toquen');
  assert.equal(parpadeos, hechas.parpadea * PARPADEOS, `parpadeó ${parpadeos} veces`);
  assert.equal(pompas, hechas.pompas);
  assert.ok(rapido > GIRA.sola * 0.9 && rapido < GIRA.sola * 1.01 && frenadas > 0 && frenadas <= hechas.rueda, `la rueda llegó a ${rapido.toFixed(0)} y se frenó ${frenadas} veces`);
});

test('tocado hace lo paranormal: tiembla, levita inclinado y fuera de foco, se le abre el baúl, asoma el diablo, saluda el chofer, cae, se aplasta, parpadea tres veces y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarTaxiCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { tiembla: 0, alto: 0, foco: 0, baul: 0, diablo: 0, brazo: 0, aplasta: 1, parpadeos: 0, giro: 0, hamaca: 0, accion: '' };
  let cerrado = false;
  let caeEn = Infinity;
  for (let i = 1; i <= 60 * DURA.levita; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [tx, ty] = trasladoDe(dom.de('fierro', 'transform'));
    if (u < TOQUE_T.tiembla[1]) visto.tiembla = Math.max(visto.tiembla, Math.abs(tx));
    visto.alto = Math.max(visto.alto, -ty);
    if (u > TOQUE_T.cae[0] && -ty < 0.5 && caeEn === Infinity) caeEn = u;
    visto.foco = Math.max(visto.foco, Number(dom.de('doble', 'opacity')));
    visto.baul = Math.max(visto.baul, -giro(dom.de('baul', 'transform')));
    visto.diablo = Math.max(visto.diablo, 1 + trasladoDe(dom.de('diablo', 'transform'))[1] / ESCONDE);
    visto.brazo = Math.min(visto.brazo, giro(dom.de('brazo', 'transform')));
    visto.aplasta = Math.min(visto.aplasta, Number(/scale\([\d.]+ ([\d.]+)\)/.exec(dom.de('fierro', 'transform'))?.[1] ?? 1));
    visto.giro = Math.max(visto.giro, Math.abs(vivo.estado().giro[0]));
    if (u > TOQUE_T.parpadea[0] - 0.1) {
      const k = parpadoDe(dom.de('parpado', 'transform'));
      if (k > 0.9 && !cerrado) visto.parpadeos++;
      if (k > 0.9) cerrado = true;
      if (k < 0.6) cerrado = false;
    }
    // El brazo cuelga: después del golpe sigue hamacándose, con el taxi ya quieto.
    if (u > TOQUE_T.golpe[0] + 0.15 && u < TOQUE_T.golpe[0] + 1.5) visto.hamaca = Math.max(visto.hamaca, Math.abs(giro(dom.de('brazo', 'transform'))));
    // Mientras está arriba, tiene el faro abierto de par en par.
    if (u > 2 && u < TOQUE_T.cae[0]) assert.ok(parpadoDe(dom.de('parpado', 'transform')) < 0.05, 'cerró el faro levitando');
    if (i === 60 * 2) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.tiembla > 1.5, 'no tembló');
  assert.ok(visto.alto > LEVITA_ALTO * 0.98, `levitó ${visto.alto.toFixed(0)}`);
  assert.ok(visto.foco > 0.66, 'no se fue de foco');
  assert.ok(visto.baul > ABRE * 0.98 && visto.diablo > 0.98, 'no se le abrió el baúl o no asomó el diablo');
  assert.ok(visto.brazo < LEVITA.brazo * 0.95, 'el chofer no saludó');
  // Cae de golpe (en menos de lo que tardó en subir) y se aplasta.
  assert.ok(caeEn - TOQUE_T.cae[0] < (TOQUE_T.sube[1] - TOQUE_T.sube[0]) / 2, `tardó ${(caeEn - TOQUE_T.cae[0]).toFixed(2)} s en caer`);
  assert.ok(visto.aplasta < 0.94, 'no se aplastó contra el pasto');
  assert.ok(visto.hamaca > 8, 'el brazo no siguió hamacándose');
  assert.equal(visto.parpadeos, PARPADEOS, `parpadeó ${visto.parpadeos} veces`);
  assert.ok(visto.giro > GIRA.levita * 0.9, 'las ruedas no giraron');
  assert.equal(visto.accion, 'levita');
  // Al final está apoyado, con el diablo adentro y las ruedas todavía frenándose.
  assert.deepEqual(trasladoDe(dom.de('fierro', 'transform')), [0, 0]);
  assert.equal(dom.de('diablo', 'transform'), marcas(QUIETO).transform.diablo);
  const queda = Math.abs(vivo.estado().giro[0]);
  assert.ok(queda > 0 && queda < GIRA.levita * 0.5, `las ruedas quedaron a ${queda.toFixed(0)}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de volcado a levitando, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarTaxiCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('fierro', 'transform'), marcas(LEVITA).transform.fierro);
  assert.equal(dom.de('diablo', 'transform'), marcas(LEVITA).transform.diablo);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('fierro', 'transform'), marcas(QUIETO).transform.fierro);
});
