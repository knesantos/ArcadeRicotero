import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { CAMELLOS_PERSONAJE, PIEZAS_CAMELLOS } from './arte-camellos.ts';
import { BRAZO_AL_PLATILLO, CAMELLOS, CAMELLOS_ARMADO as A, CAMELLOS_NOMAS, QUIETO, alRecinto, marcas, platillo, puntaDeLaPinza, type Punto } from './rig-camellos.ts';
import { COSAS_DE_CYBERSIBERIA, CYBER, OJOS_DE_CYBERSIBERIA } from './rig-entornos.ts';
import { LUGAR as PORCO } from './rig-porco.ts';
import { escenaCybersiberia } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, PESA_T, RESBALA_T, TOQUE_T, armarCamellosCon, base, momentoDeAccion, type Accion } from '../../scripts/bestiario/camellos.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Los camellos prestigiosos (`D-73`, vigesimonovena vuelta): que sean un títere entero a aerógrafo, dos camellos de
 * sobretodo parados en la nieve de Cybersiberia vendiendo nieve en sobres arriba de un cajón de chapa, que no estén más
 * pintados en el piso, que al joyero se le derrita el copo, al campana le resbale la pata y se pasen un sobre sin que
 * nadie los toque, que tocados se tiren a cuatro patas y se hagan los camellos con el cajón tapado, y que la pose de la
 * isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'los-camellos-prestigiosos';
const figura = capasDe('cybersiberia', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_CAMELLOS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--camellos');
const sinRitmos = (): number => -1;
const giroDe = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const PARTES = ['entero', 'parados', 'joyero', 'j-cogote', 'j-quijada', 'j-parpado', 'brazo', 'copo', 'balanza', 'campana', 'c-cola', 'c-cogote', 'c-quijada', 'c-parpado', 'c-pata', 'sobre', 'cuatro', 'q-joyero', 'q1-cogote', 'q1-quijada', 'q1-parpado', 'q-campana', 'q2-cogote', 'q2-quijada', 'q2-parpado', 'suelto', 'polvo'];

test('los camellos son un títere entero, con sus dos poses: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--camellos" data-id="los-camellos-prestigiosos" role="button" tabindex="0" aria-label="Los camellos prestigiosos">/);
  for (const p of PARTES) assert.ok(figura.includes(`data-parte="${p}"`), `a los camellos les falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_CAMELLOS.map((p) => p.nombre).sort());
  for (const p of PIEZAS_CAMELLOS) assert.match(p.nombre, /^camellos-/);
  // Son dos, en las dos poses, y los dos llevan cabeza de camello: el mismo cogote, cuatro veces.
  assert.equal(figura.split('href="/bestiario/camellos-cogote.webp"').length - 1, 4);
  assert.equal(figura.split('href="/bestiario/camellos-cuerpo.webp"').length - 1, 2);
  assert.equal(figura.split('href="/bestiario/camellos-cuatro.webp"').length - 1, 2);
  // El joyero es el de la lupa, parado y a cuatro patas: el cambio no le saca el oficio.
  assert.equal(figura.split('href="/bestiario/camellos-lupa.webp"').length - 1, 2);
  // Los pivotes: el cogote sale del cuello del sobretodo, la pata de la cadera, la cola de atrás, el brazo del hombro.
  assert.ok(adentro('camellos-cuerpo', A.cogote) && adentro('camellos-cogote', [0, 0]), 'el cogote no sale del cuerpo');
  assert.ok(adentro('camellos-cuerpo', A.pata) && adentro('camellos-pata', [0, 0]) && adentro('camellos-pata', [0, -A.pata[1]]), 'la pata no va de la cadera al piso');
  assert.ok(adentro('camellos-cuerpo', A.cola) && adentro('camellos-cuerpo', A.hombro) && adentro('camellos-brazo', A.pinza), 'la cola, el hombro o la pinza no están en su pieza');
  assert.ok(adentro('camellos-cuatro', A.cuatro.cogote), 'a cuatro patas el cogote no sale del pecho');
  // El cajón y la balanza: el poste va del cajón a la cruz, y la pinza llega justo al platillo.
  assert.ok(adentro('camellos-cajon', A.balanza.pie) && adentro('camellos-cajon', A.balanza.cruz) && adentro('camellos-cajon', [A.cajon.x0, 0]) && adentro('camellos-cajon', [A.cajon.x1, A.cajon.tapa]), 'el cajón no mide lo que dice el rig');
  const [px, py] = puntaDeLaPinza(BRAZO_AL_PLATILLO);
  const [qx, qy] = platillo(1, QUIETO.balanza + 10);
  assert.ok(Math.hypot(px - qx, py - qy) < 3, `la pinza queda a ${Math.hypot(px - qx, py - qy).toFixed(1)} del platillo`);
  // El joyero está atrás del cajón (se le ve de la cintura para arriba) y el campana afuera, entero.
  assert.ok(A.joyero > A.cajon.x0 && A.joyero < A.cajon.x1 && A.campana > A.cajon.x1 + 30, 'el joyero no está atrás del cajón o el campana lo pisa');
  // Parados en dos patas, de sobretodo largo: las patas de atrás asoman poco abajo del ruedo, y el campana es más alto.
  assert.ok(-A.pata[1] < 50 && -A.cogote[1] > 150 && A.alto > 1.05, 'el sobretodo no llega a las rodillas, o son mellizos');
  // La otra pata de adelante del joyero también va en su manga, con la pezuña en un sobre, arriba del cajón.
  assert.equal(figura.split('href="/bestiario/camellos-mano.webp"').length - 1, 1);
  // La balanza y los sobres se tienen que ver: el fiel mide más que la cabeza de un camello.
  assert.ok(A.balanza.brazo * 2 >= 80 && A.balanza.pie[1] - A.balanza.cruz[1] >= 50, 'la balanza es chica');
  // La polvareda tiene grano y canto: no es una nube soplada sola.
  const polvo = PIEZAS_CAMELLOS.find((p) => p.nombre === 'camellos-polvo')!.dibujo;
  assert.ok(polvo.includes('url(#grano)') && polvo.includes('clip-path'), 'la polvareda no tiene grano ni canto');
  assert.ok(figura.indexOf('data-parte="joyero"') < figura.indexOf('camellos-cajon.webp') && figura.indexOf('camellos-cajon.webp') < figura.indexOf('data-parte="campana"'));
  // La polvareda va arriba de todo: tapa el cambio.
  assert.ok(figura.indexOf('data-parte="polvo"') > figura.indexOf('data-parte="cuatro"'));
  for (const p of PIEZAS_CAMELLOS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['camellos-cogote', 'camellos-cuerpo', 'camellos-cajon', 'camellos-cuatro', 'camellos-bulto']) assert.match(PIEZAS_CAMELLOS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_CAMELLOS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 240, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de los camellos están en su bloque de tokens.css, medidas en Último bondi, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨los camellos prestigiosos⟩'), tokens.indexOf('⟨/los camellos prestigiosos⟩'));
  const usadas = new Set(PIEZAS_CAMELLOS.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de los camellos`);
  assert.match(bloque, /public\/tapas\/ultimo-bondi-a-finisterre\.jpg/);
  // La única tinta que no es de la tapa es la nieve del recinto: es lo que venden y lo que levantan.
  const ajenas = new Set(PIEZAS_CAMELLOS.flatMap((p) => [...p.dibujo.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]!)).filter((t) => !t.startsWith('--bestia-camellos-')));
  assert.deepEqual([...ajenas], ['--entorno-cyber-nieve']);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨los camellos prestigiosos⟩ */'), sitio.indexOf('/* ⟨/los camellos prestigiosos⟩ */'));
  assert.match(suyo, /\.titere--camellos \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"polvo"') && suyo.includes('"copo"') && suyo.includes('[opacity="0"]'), 'la polvareda, el copo o la pose que no se ve se pueden tocar');
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b|shadow/);
});

test('están en la nieve de atrás, a la izquierda, donde estaba pintado el camello, sin salirse ni pisar a nadie, y Drogocop sigue pintado', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'cybersiberia');
  assert.equal(CAMELLOS_PERSONAJE.ancla, CAMELLOS.x);
  assert.ok(Math.abs(CAMELLOS.x - OJOS_DE_CYBERSIBERIA[ID]![0]) < 20, 'se fueron lejos de sus ojos');
  // Apoyan en la nieve, abajo del horizonte y arriba de la tele chica.
  assert.ok(CAMELLOS.piso > CYBER.horizonte + 60 && CAMELLOS.piso < CYBER.teleChica.piso - CYBER.teleChica.alto, 'no apoyan en la nieve de atrás');
  // En ninguna de las dos poses se salen por la izquierda del recinto.
  const e = A.cuatro.escala;
  assert.ok(alRecinto([A.joyero - 72, 0])[0] > 0, 'parado, el joyero se sale');
  assert.ok(alRecinto([A.cuatro.joyero - 78 * e, 0])[0] > 0, 'a cuatro patas, el joyero se sale');
  // A cuatro patas, los dos quedan uno a cada lado del bulto, que es el cajón tapado: sigue en su lugar.
  assert.ok(A.cuatro.joyero + 58 * e < 0 && A.cuatro.campana - 62 * e > 0, 'a cuatro patas se pisan arriba del bulto');
  // No tapan los ojos de nadie (el robot sigue pintado al lado, y lo miran), ni en el recinto ni en el camino.
  const [x0, y0] = alRecinto([-190, -230]);
  const [x1, y1] = alRecinto([190, 0]);
  for (const k of [1, K_ENTORNO]) {
    const corre = CAMELLOS.x * (k - 1);
    for (const [id, [vx, vy]] of [...Object.entries(OJOS_DE_CYBERSIBERIA), ...Object.entries(COSAS_DE_CYBERSIBERIA)]) {
      if (id === ID) continue;
      assert.ok(!(vx * k > x0 + corre && vx * k < x1 + corre && vy > y0 && vy < y1), `con k ${k}, ${id} queda adentro de los camellos`);
    }
  }
  assert.ok(OJOS_DE_CYBERSIBERIA.drogocop![0] > x1 && OJOS_DE_CYBERSIBERIA.drogocop![1] > CAMELLOS.piso, 'Drogocop no está a la derecha y abajo: el campana no lo mira');
  // Porco trota al lado: lo más a la izquierda que llega (el ancla, menos lo que trota, menos medio chancho) no toca lo que
  // los camellos tienen a su altura, ni parados (el cuerpo del campana) ni a cuatro patas (el pecho y las patas de adelante).
  const porcoIzq = PORCO.x - PORCO.ida - 66 * PORCO.escala;
  assert.ok(alRecinto([A.campana + 30 * A.alto, 0])[0] < porcoIzq - 8, `parado, el campana llega a ${alRecinto([A.campana + 30 * A.alto, 0])[0]} y Porco a ${porcoIzq}`);
  assert.ok(alRecinto([A.cuatro.campana + 60 * e, 0])[0] < porcoIzq, `a cuatro patas, el campana llega a ${alRecinto([A.cuatro.campana + 60 * e, 0])[0]} y Porco a ${porcoIzq}`);
  const escena = escenaCybersiberia(nombres);
  assert.ok(escena.indexOf('/bestiario/cyber-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso los tapa');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'siguen sus ojos en lo oscuro');
  const pintura = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  assert.doesNotMatch(pintura, /at\('los-camellos-prestigiosos'\)|canto\(camello/, 'siguen pintados en el piso de Cybersiberia');
  assert.match(pintura, /at\('drogocop'\)/, 'Drogocop no es de esta vuelta: sigue pintado');
  const piso = pisoDelCamino(CAMINOS.cybersiberia!, nombres);
  const m = /data-marco="los-camellos-prestigiosos" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no están en la Cybersiberia del camino');
  assert.equal(Number(m![1]), Math.round(CAMELLOS.x * (K_ENTORNO - 1)));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento: parados, con la otra pose apagada', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarCamellosCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  const q = marcas(QUIETO);
  assert.equal(q.opacity.parados, '1');
  assert.equal(q.opacity.cuatro, '0');
  assert.equal(q.opacity.polvo, '0');
  assert.equal(q.opacity.copo, '1');
  assert.equal(q.opacity.sobre, '0');
  // El joyero mira para abajo, al platillo; el campana, derecho. Y la balanza cae del lado de la pesa.
  assert.ok(QUIETO.cogote[0] > QUIETO.cogote[1] + 10 && QUIETO.balanza < 0);
});

test('solos, al joyero se le derrite el copo en la balanza, al campana le resbala la pata, y se pasan un sobrecito con la cola', () => {
  const hechas: Record<Accion | 'toque', number> = { pesa: 0, vigila: 0, pase: 0, toque: 0 };
  const visto = { sinCopo: 0, balanza: -99, pata: 0, ladeo: 0, sobreAlto: 0, sobreIzq: 99, cola: 0, rumia: 0 };
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarCamellosCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      if (dom.de('copo', 'opacity') === '0') visto.sinCopo++;
      visto.balanza = Math.max(visto.balanza, giroDe(dom.de('balanza', 'transform')));
      visto.pata = Math.min(visto.pata, giroDe(dom.de('c-pata', 'transform')));
      visto.ladeo = Math.max(visto.ladeo, giroDe(dom.de('campana', 'transform')));
      visto.cola = Math.max(visto.cola, giroDe(dom.de('c-cola', 'transform')));
      visto.rumia = Math.max(visto.rumia, Math.abs(trasladoDe(dom.de('j-quijada', 'transform'))[0]));
      if (dom.de('sobre', 'opacity') === '1') {
        const [sx, sy] = trasladoDe(dom.de('sobre', 'transform'));
        visto.sobreAlto = Math.min(visto.sobreAlto, sy);
        visto.sobreIzq = Math.min(visto.sobreIzq, sx);
      }
      // Sin tocarlos, siguen parados: ni polvareda ni cuatro patas.
      assert.equal(dom.de('parados', 'opacity'), '1');
      assert.equal(dom.de('cuatro', 'opacity'), '0');
      assert.equal(dom.de('polvo', 'opacity'), '0');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['pesa', 'vigila', 'pase'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque, 0);
  assert.ok(visto.sinCopo > 60, 'el copo no se derritió');
  assert.ok(visto.balanza > 3, `la balanza no se inclinó con el copo (${visto.balanza})`);
  assert.ok(visto.pata < -45 && visto.ladeo > 6, 'al campana no le resbaló la pata');
  assert.ok(visto.cola > 60, 'no levantó la cola');
  assert.ok(visto.sobreIzq < A.cajon.x1 && visto.sobreAlto < A.cajon.tapa - 30, 'el sobrecito no voló al cajón');
  assert.ok(visto.rumia > 2, 'no rumian');
  // El copo se derrite despacio (se ve) y la pata resbala de golpe.
  assert.ok(PESA_T.derrite[1] - PESA_T.derrite[0] >= 1 && RESBALA_T[1] - RESBALA_T[0] <= 0.3);
  // Con el copo apoyado, la balanza se inclina para ese lado; derretido, vuelve sola.
  const apoyado = momentoDeAccion(base(10, sinRitmos), 'pesa', 1.6);
  const derretido = momentoDeAccion(base(10, sinRitmos), 'pesa', 3.2);
  assert.ok(apoyado.balanza > 3 && apoyado.copo > 0.9 && derretido.copo < 0.05 && derretido.balanza < 0);
});

test('tocados se hacen los camellos: caen a cuatro patas detrás de la polvareda, rumian, se les escapa un sobre, y se paran de nuevo; dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarCamellosCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { cuatro: 0, rumia: 0, pasta: 0, suelto: 0, duros: 0, cambios: 0 };
  let antes = '1';
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const parados = dom.de('parados', 'opacity');
    // Nunca se ven las dos poses a la vez, ni ninguna.
    assert.notEqual(parados, dom.de('cuatro', 'opacity'), `a los ${u.toFixed(2)} se ven las dos poses, o ninguna`);
    if (parados !== antes) {
      visto.cambios++;
      // El cambio de pose pasa detrás de la polvareda, bien cerrada.
      assert.ok(Number(dom.de('polvo', 'opacity')) > 0.85, `el cambio de los ${u.toFixed(2)} se ve: la polvareda está en ${dom.de('polvo', 'opacity')}`);
      // Y ya tiene su tamaño: una polvareda chiquita no tapa a dos camellos.
      assert.ok(Number(/scale\(([\d.]+) /.exec(dom.de('polvo', 'transform'))?.[1] ?? 0) > 0.95, 'la polvareda es chica cuando cambian de pose: ' + dom.de('polvo', 'transform'));
      antes = parados;
    }
    if (parados === '0') {
      visto.cuatro++;
      visto.rumia = Math.max(visto.rumia, Math.abs(trasladoDe(dom.de('q1-quijada', 'transform'))[0]));
      visto.pasta = Math.max(visto.pasta, giroDe(dom.de('q2-cogote', 'transform')));
      if (dom.de('suelto', 'opacity') === '1') visto.suelto++;
      if (u > TOQUE_T.duros[0] + 0.1 && u < TOQUE_T.duros[1] && Math.abs(trasladoDe(dom.de('q1-quijada', 'transform'))[0]) < 0.05) visto.duros++;
    }
  }
  assert.equal(visto.cambios, 2, 'se tiran y se paran: dos cambios');
  assert.ok(visto.cuatro > 60 * 4, 'no se quedaron a cuatro patas un buen rato');
  assert.ok(visto.rumia > 2.4, 'a cuatro patas no rumian');
  assert.ok(visto.pasta > 12 && visto.pasta < 30, `el campana no bajó a olfatear la nieve, o bajó tanto que se mete con Porco (${visto.pasta})`);
  assert.ok(visto.suelto > 60, 'no se les escapó el sobre');
  assert.ok(visto.duros > 20, 'no se quedaron duros cuando se les escapó');
  // Al final están parados, despachando, con copo nuevo.
  assert.equal(dom.de('parados', 'opacity'), '1');
  assert.equal(dom.de('polvo', 'opacity'), '0');
  assert.equal(dom.de('copo', 'opacity'), '1');
  assert.match(dom.de('parados', 'transform'), /^scale\(1 1\)$/);
  assert.ok(TOQUE_T.fin <= DURA.toque);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueven: tocarlos los pasa de parados a cuatro patas, con el sobre asomando, y dicen su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarCamellosCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('parados', 'opacity'), '0');
  assert.equal(dom.de('cuatro', 'opacity'), '1');
  assert.equal(dom.de('suelto', 'opacity'), '1');
  assert.equal(dom.de('polvo', 'opacity'), '0');
  assert.equal(dom.de('q2-cogote', 'transform'), marcas(CAMELLOS_NOMAS).transform['q2-cogote']);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('parados', 'opacity'), '1');
  assert.equal(dom.de('cuatro', 'opacity'), '0');
});
