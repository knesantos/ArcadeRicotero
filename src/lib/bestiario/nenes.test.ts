import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { NENES_PERSONAJE, PIEZAS_NENES } from './arte-nenes.ts';
import { CLAVADO, NENES, NENES_ARMADO, QUIETO, alRecinto, barcoEn, clavadoEn, enPedestal, marcas, type Punto } from './rig-nenes.ts';
import { VECINOS_DEL_BAJO, escenaBajo } from './escenas.ts';
import { NAUF } from './rig-nau.ts';
import { marcoDelRecinto } from './rig.ts';
import { DURA, FALSA_T, TOQUE_T, armarNenesCon, leToca, saltoEn, type Accion } from '../../scripts/bestiario/nenes.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Los nenes de oro (`D-73`, vigesimonovena vuelta, `T-529`): dos trofeos de natación a aerógrafo en un podio de mármol,
 * a la derecha de Pierre; que no sean otras dos cabezas en el agua, que la marea les tape la plaquita y paguen con un
 * barquito, que uno largue en falso, que tocados se claven los dos de cabeza con las piernas afuera y vuelvan trepando,
 * y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'los-nenes-de-oro';
const figura = capasDe('el-bajo', 'figura', nombres, 1, ID);
const pieza = (nombre: string) => PIEZAS_NENES.find((p) => p.nombre === nombre)!;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = pieza(nombre).caja;
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--nenes');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const A = NENES_ARMADO;
/** Hasta dónde llegan los pies de un nene (la `y` del recinto del títere), dado su transform: los pies están a `cadera` de la cadera. */
const pies = (transform: string): number => {
  const [, y] = trasladoDe(transform);
  return y + A.cadera * Math.cos((giro(transform) * Math.PI) / 180);
};

test('los nenes de oro son un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--nenes" data-id="los-nenes-de-oro" role="button" tabindex="0" aria-label="Los nenes de oro">/);
  for (const p of ['entero', 'podio-fondo', 'botella', 'burbuja', 'a', 'b', 'brazos-a', 'brazos-b', 'brillo-a', 'brillo-b', 'podio', 'espuma', 'marea', 'aro-a', 'aro-b', 'manguera-a', 'manguera-b', 'salpica-a', 'salpica-b', 'burbujas-a', 'burbujas-b', 'barco-a', 'barco-b']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a los nenes les falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_NENES.map((p) => p.nombre).sort());
  for (const p of PIEZAS_NENES) assert.match(p.nombre, /^nenes-/);
  // Los dos salen del mismo molde: una sola pieza de cuerpo, espejada.
  assert.equal([...figura.matchAll(/nenes-cuerpo\.webp/g)].length, 2);
  assert.match(marcas(QUIETO).transform.a!, /scale\(-1 1\)/);
  assert.match(marcas(QUIETO).transform.b!, /scale\(1 1\)/);
  assert.ok(adentro('nenes-cuerpo', [0, 0]) && adentro('nenes-cuerpo', [0, -A.cadera]) && adentro('nenes-cuerpo', A.hombros) && adentro('nenes-brazos', A.hombros) && adentro('nenes-brazos', A.manos), 'los brazos no salen de los hombros');
  assert.ok(adentro('nenes-botella', A.suero) && adentro('nenes-suero', A.suero), 'la botella no cuelga del palo');
  const [px, py, pw, ph] = A.placa;
  assert.ok(adentro('nenes-podio', [px, py]) && adentro('nenes-podio', [px + pw, py + ph]) && adentro('nenes-podio', [A.pedestal, A.pisan + 1]) && adentro('nenes-podio', [-A.pedestal, A.pisan + 1]));
  // Van detrás del podio (cuando vuelven, trepan por atrás del pedestal), y todo eso se corta en la línea del agua.
  assert.ok(figura.indexOf('data-parte="podio-fondo"') < figura.indexOf('data-parte="a"') && figura.indexOf('data-parte="b"') < figura.indexOf('data-parte="podio"'));
  assert.match(figura, /<clipPath id="nenes-seco"><rect x="-400" y="-400" width="800" height="401"\/><\/clipPath>/);
  assert.ok(figura.indexOf('data-parte="podio"') < figura.indexOf('</g></g>' + '<g data-parte="marea"'), 'la espuma queda adentro del recorte');
  // Son de oro, la malla tiene dos tiras (no tres) y la botella no trae marca: ni una letra en ninguna pieza.
  const cuerpo = pieza('nenes-cuerpo').dibujo;
  assert.ok(cuerpo.includes('--bestia-nenes-oro)') && cuerpo.includes('M1 -53 v11 M4 -53 v11'), 'la malla no tiene sus dos tiras');
  for (const p of PIEZAS_NENES) assert.ok(!p.dibujo.includes('<text'), `${p.nombre} trae letras`);
  for (const p of PIEZAS_NENES) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['nenes-cuerpo', 'nenes-brazos', 'nenes-podio', 'nenes-barco']) assert.match(pieza(n).dibujo, /url\(#grano\)/);
  const peso = PIEZAS_NENES.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 160, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de los nenes están en su bloque de tokens.css, medidas en Luzbelito, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨los nenes de oro⟩'), tokens.indexOf('⟨/los nenes de oro⟩'));
  const usadas = new Set(PIEZAS_NENES.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-nenes-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de los nenes`);
  // La única tinta que no es suya es la luz del bajo, para la espuma.
  const ajenas = new Set(PIEZAS_NENES.flatMap((p) => [...p.dibujo.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]!)).filter((t) => !t.startsWith('--bestia-nenes-')));
  assert.deepEqual([...ajenas].sort(), ['--entorno-bajo-agua', '--entorno-bajo-celeste']);
  assert.match(bloque, /public\/tapas\/luzbelito\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨los nenes de oro⟩ */'), sitio.indexOf('/* ⟨/los nenes de oro⟩ */'));
  assert.match(suyo, /\.titere--nenes \{ cursor: pointer; \}/);
  for (const p of ['[data-parte="espuma"]', '[data-parte="marea"]', '[data-parte^="aro"]', '[data-parte^="salpica"]', '[data-parte^="burbujas"]']) assert.ok(suyo.includes(p), `${p} se puede tocar`);
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b|shadow/);
});

test('viven en el bajo, a la derecha de Pierre: parados arriba del agua (no son otras cabezas en el agua), lejos de los náufragos, y sus clavados no llegan a las sirenas', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-bajo');
  assert.equal(NENES_PERSONAJE.ancla, NENES.x);
  const marco = marcoDelRecinto('el-bajo');
  // Lo más ancho es el clavado: de un lado y del otro.
  const [x0] = alRecinto([-(A.pedestal + A.salto) - 16, 0]);
  const [x1] = alRecinto([A.pedestal + A.salto + 16, 0]);
  const [, y0] = alRecinto([0, A.suero[1] - 4]);
  assert.ok(x0 > marco.x && x1 < marco.x + marco.ancho && y0 > 300 && NENES.piso < 640, 'se salen del recinto');
  // Pierre llega hasta x ≈ 700 a la altura del agua, y las sirenas empiezan en x ≈ 1080.
  assert.ok(x0 > 700 && x1 < 1080, `van de ${x0.toFixed(0)} a ${x1.toFixed(0)}`);
  // No son cabezas en el agua: quietos, los pies de los dos están arriba del agua, encima de un pedestal, y miden más que el podio.
  const t = marcas(QUIETO);
  for (const n of ['a', 'b']) assert.ok(Math.abs(pies(t.transform[n]!) - A.pisan) < 0.01, `el ${n} no pisa su pedestal`);
  assert.ok(A.pisan < A.podio.tapa && A.podio.tapa < -40, 'el podio no saca a nadie del agua');
  assert.ok(Math.abs(NENES.x - NAUF.x) > 600, 'están pegados a los náufragos');
  // Los ojos de la lista están donde tiene las antiparras el de la derecha.
  const [ox, oy] = VECINOS_DEL_BAJO[ID]!;
  const [ex, ey] = alRecinto([A.pedestal + 6.4, A.pisan - 81.4]);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `las antiparras quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BAJO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < NENES.piso + 10), `${id} queda adentro de los nenes`);
  }
  const escena = escenaBajo(nombres);
  assert.ok(escena.includes(`data-marco="${ID}" data-capa="figura"`), 'no están en el bajo');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'siguen siendo ojos');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarNenesCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  const t = marcas(QUIETO);
  assert.deepEqual(trasladoDe(t.transform.podio!), [0, 0]);
  for (const n of ['a', 'b']) {
    assert.equal(giro(t.transform[n]!), 0);
    assert.equal(t.opacity[`salpica-${n}`], '0');
    assert.equal(t.opacity[`barco-${n}`], '0');
    assert.equal(t.opacity[`brillo-${n}`], '0');
  }
  // El clavado empieza y termina en el pedestal, y clavado quedan las piernas afuera: la cadera apenas bajo el agua.
  assert.deepEqual(clavadoEn(0), clavadoEn(3));
  const c = clavadoEn(1.3);
  assert.ok(c.giro === 180 && c.y > 0 && c.y < 10 && c.y - A.cadera < -36, `clavado, los pies quedan en y = ${(c.y - A.cadera).toFixed(0)}`);
  // Hundido, no se ve nada: la punta de los pies queda bajo el agua.
  assert.ok(clavadoEn(2).y - A.cadera - 4 > 0, 'hundido se le ven los pies');
  // Trepando, sale de atrás del pedestal: mientras está más abajo que la tapa del pedestal, está en la misma x.
  for (const s of [2.1, 2.4, 2.7]) assert.equal(clavadoEn(s).x, A.pedestal);
  assert.ok(enPedestal(0) === 1 && enPedestal(1.2) === 0 && enPedestal(3) === 1);
  // Clavado, el agua lo corta: tiene su aro de espuma clara, y la marea quieta no se ve.
  const clavados = marcas({ ...QUIETO, salto: [1.3, 1.3] });
  assert.equal(clavados.opacity['aro-a'], '1');
  assert.equal(t.opacity['aro-a'], '0');
  assert.equal(t.opacity.marea, '0');
  assert.equal(marcas({ ...QUIETO, marea: 1 }).opacity.marea, '1');
  for (const n of ['nenes-aro', 'nenes-salpica', 'nenes-marea']) assert.ok(PIEZAS_NENES.find((p) => p.nombre === n)!.dibujo.includes('--bestia-nenes-papel)'), `${n} no tiene espuma clara`);
  // Nada tiene halo: el brillo es de canto duro.
  for (const n of ['nenes-brillo', 'nenes-cuerpo', 'nenes-brazos']) assert.ok(!PIEZAS_NENES.find((p) => p.nombre === n)!.dibujo.includes('url(#soplo'), `${n} tiene algo soplado`);
  // Las mangueras son de goma: quietas llegan justo a la aguja; cuando arranca el salto se estiran; y clavado ya saltaron y cuelgan del gotero.
  const goma = (m: ReturnType<typeof marcas>, n: string): [number, number] => {
    const tr = m.transform[`manguera-${n}`]!;
    return [Number(/scale\(([\d.]+) /.exec(tr)![1]), giro(tr)];
  };
  for (const n of ['a', 'b']) assert.ok(Math.abs(goma(t, n)[0] - 1) < 0.06, `la manguera del ${n} no llega a la aguja`);
  assert.ok(goma(marcas({ ...QUIETO, salto: [0.27, 0.27] }), 'b')[0] > 1.1, 'la manguera no se estira');
  const suelta = goma(clavados, 'b');
  assert.ok(suelta[0] === 1 && Math.abs(suelta[1] - 90) < 30, `suelta, la manguera quedó a ${suelta[1]} grados`);
  assert.equal(barcoEn(0).se, 0);
  assert.equal(barcoEn(1).se, 0);
});

test('posan y les sale a medias: uno se lustra, uno larga en falso y el otro ni se mueve, la marea les tapa la plaquita y pagan con un barquito que se hunde, y chupan del suero', () => {
  const hechas: Record<string, number> = {};
  const visto = { brazos: 0, marea: 0, barco: 0, barcoLejos: 0, burbuja: 0, tiembla: 0, brillo: 0, falsas: 0, juntos: 0, solos: new Set<string>() };
  for (const semilla of [1, 2, 3, 4]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarNenesCon(dom.marcos, esc, azar(semilla));
    let enFalsa = false;
    for (let i = 1; i <= 60 * 100; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const ta = dom.de('a', 'transform');
      const tb = dom.de('b', 'transform');
      visto.brazos = Math.max(visto.brazos, giro(dom.de('brazos-a', 'transform')), giro(dom.de('brazos-b', 'transform')));
      visto.marea = Math.max(visto.marea, trasladoDe(dom.de('podio', 'transform'))[1]);
      visto.barco = Math.max(visto.barco, Number(dom.de('barco-a', 'opacity')));
      if (Number(dom.de('barco-b', 'opacity')) > 0.5) visto.barcoLejos = Math.max(visto.barcoLejos, trasladoDe(dom.de('barco-b', 'transform'))[0]);
      visto.burbuja = Math.max(visto.burbuja, Number(dom.de('burbuja', 'opacity')));
      visto.brillo = Math.max(visto.brillo, Number(dom.de('brillo-a', 'opacity')), Number(dom.de('brillo-b', 'opacity')));
      // Clavado es cuando giró media vuelta. En la largada en falso se clava uno solo: nunca los dos.
      const ca = Math.abs(giro(ta)) > 150;
      const cb = Math.abs(giro(tb)) > 150;
      if (ca && cb) visto.juntos++;
      if ((ca || cb) && !enFalsa) {
        visto.falsas++;
        visto.solos.add(ca ? 'a' : 'b');
      }
      enFalsa = ca || cb;
      // El podio se hunde con la marea y ellos con él: parados, siguen pisando el pedestal.
      const hunde = trasladoDe(dom.de('podio', 'transform'))[1];
      const hace = vivo.estado().accion;
      if (hace === null || hace === 'pagan') assert.ok(Math.abs(pies(ta) - (A.pisan + hunde)) < 0.6 && Math.abs(pies(tb) - (A.pisan + hunde)) < 0.6, 'se despegaron del pedestal');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
  }
  for (const a of ['lustra', 'falsa', 'pagan', 'chupan'] as Accion[]) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(visto.brazos > 140, `bajó los brazos ${visto.brazos.toFixed(0)}`);
  // La marea alta tapa la plaquita entera, y no llega a taparles los pies.
  const [, py, , ph] = A.placa;
  assert.ok(visto.marea > A.marea - 1.5 && py + ph + A.marea > 0 && py + A.marea > -3 && A.pisan + A.marea < -20, `la marea subió ${visto.marea.toFixed(0)}`);
  assert.ok(visto.barco === 1 && visto.barcoLejos > A.pedestal + 40 && visto.barcoLejos < A.pedestal + A.salto - 16, `el barquito llegó a ${visto.barcoLejos.toFixed(0)}`);
  assert.ok(visto.burbuja > 0.95 && visto.brillo > 0.95, 'no chuparon o no brillaron');
  assert.equal(visto.falsas, hechas.falsa, 'las largadas en falso no coinciden');
  assert.equal(visto.juntos, 0, 'se tiraron los dos sin que los toquen');
  assert.equal(visto.solos.size, 2, 'siempre larga en falso el mismo');
  assert.deepEqual([leToca(10.05), leToca(10.15)], [0, 1]);
  assert.equal(saltoEn(FALSA_T.trepa[1], FALSA_T), 0);
});

test('tocados, la marea sube, pagan, y se tiran los dos a la vez: quedan clavados de cabeza con las piernas afuera, uno torcido; se van a pique y vuelven trepando por atrás', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarNenesCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const T = TOQUE_T;
  const visto = { marea: 0, barcos: 0, salpica: 0, burbujas: 0, torcido: 0, tiembla: 0, clavadoDesde: 0, clavadoHasta: 0, alto: 0 };
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const ta = dom.de('a', 'transform');
    const tb = dom.de('b', 'transform');
    visto.marea = Math.max(visto.marea, trasladoDe(dom.de('podio', 'transform'))[1]);
    visto.barcos = Math.max(visto.barcos, Math.min(Number(dom.de('barco-a', 'opacity')), Number(dom.de('barco-b', 'opacity'))));
    visto.salpica = Math.max(visto.salpica, Math.min(Number(dom.de('salpica-a', 'opacity')), Number(dom.de('salpica-b', 'opacity'))));
    visto.burbujas = Math.max(visto.burbujas, Math.min(Number(dom.de('burbujas-a', 'opacity')), Number(dom.de('burbujas-b', 'opacity'))));
    // Saltan espejados: mientras están en el aire, uno para cada lado, a la misma altura.
    if (u > T.saltan[0] && u < T.saltan[1]) {
      assert.ok(Math.abs(trasladoDe(ta)[0] + trasladoDe(tb)[0]) < 0.02 && Math.abs(trasladoDe(ta)[1] - trasladoDe(tb)[1]) < 0.02, 'no saltaron a la vez');
      visto.alto = Math.min(visto.alto, trasladoDe(tb)[1] - (A.pisan - A.cadera));
    }
    // Clavados: de cabeza, con la cadera en la línea del agua: se ven las piernas enteras, y nada de la cintura para arriba.
    if (u > T.clavados[0] + 0.1 && u < T.clavados[1] - 0.1) {
      if (!visto.clavadoDesde) visto.clavadoDesde = u;
      visto.clavadoHasta = u;
      for (const tr of [ta, tb]) {
        assert.ok(Math.abs(Math.abs(giro(tr)) - 180) < 22, `clavado giró ${giro(tr)}`);
        assert.ok(trasladoDe(tr)[1] > 0 && pies(tr) < -34, `clavado, los pies quedan en y = ${pies(tr).toFixed(0)}`);
      }
      visto.torcido = Math.max(visto.torcido, Math.abs(Math.abs(giro(ta)) - Math.abs(giro(tb))));
      visto.tiembla = Math.max(visto.tiembla, Math.abs(Math.abs(giro(tb)) - 180));
    }
    // Con la marea alta todavía no saltaron, y cuando saltan ya bajó.
    if (u > T.saltan[0]) assert.ok(trasladoDe(dom.de('podio', 'transform'))[1] < 5, 'saltaron con la marea alta');
  }
  assert.ok(visto.marea > A.marea - 1 && visto.barcos === 1, 'la marea no subió o no pagaron los dos');
  assert.ok(visto.alto < -4, 'no saltaron para arriba antes de caer');
  assert.ok(visto.salpica > 0.9 && visto.burbujas > 0.9, 'no salpicaron o no se fueron a pique');
  assert.ok(visto.clavadoHasta - visto.clavadoDesde > 1.6, 'quedaron clavados muy poco: en un teléfono no se ve');
  assert.ok(visto.torcido > 10 && visto.tiembla > 1.5, 'ninguno entró torcido, o no les temblaron las piernas');
  // Al final están los dos en su pedestal, derechos, y los barquitos ya se hundieron.
  const fin = marcas(QUIETO);
  for (const n of ['a', 'b']) {
    assert.equal(giro(dom.de(n, 'transform')), 0);
    assert.equal(trasladoDe(dom.de(n, 'transform'))[0], trasladoDe(fin.transform[n]!)[0]);
    assert.equal(dom.de(`barco-${n}`, 'opacity'), '0');
  }
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueven: tocarlos los pasa de posando a la largada en falso, uno clavado y el otro en su pedestal, y dicen su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarNenesCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  const t = marcas(CLAVADO);
  assert.equal(dom.de('a', 'transform'), t.transform.a);
  assert.ok(Math.abs(giro(dom.de('a', 'transform'))) > 150 && giro(dom.de('b', 'transform')) === 0, 'no hay uno clavado y otro parado');
  // En la foto se ven las dos cosas: el trofeo entero y las piernas del clavado; la marea a medio subir y los dos pagarés.
  assert.ok(pies(dom.de('a', 'transform')) < -30 && trasladoDe(dom.de('podio', 'transform'))[1] > 10);
  assert.equal(dom.de('barco-a', 'opacity'), '1');
  assert.equal(dom.de('barco-b', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dom.foto(), antes);
});
