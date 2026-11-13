import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PIEZAS_HEROE, HEROE, heroeEn } from './arte-heroe.ts';
import { HEROE_ARMADO as A, LADRA, QUIETO, SUBE_HUMO, marcas, puntaDeLaVarilla } from './rig-heroe.ts';
import { fierroDe } from './elenco.ts';
import { escenaRuta } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { FIERROS } from './rig-entornos.ts';
import { DE_LOS_OTROS } from './rig-pontiac.ts';
import { DURA, LADRIDOS, SACUDE, armarHeroeCon, base, bache, momentoDeAccion, type Accion } from '../../scripts/bestiario/heroe.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El héroe del whisky (`D-73`, vigesimoctava vuelta): el camión de la ruta pasa a ser un títere que viaja en el tránsito, con
 * el héroe tirado en la caja, las estrellas colgadas de una varilla, el perro y los sacos. Que sea un títere entero, que
 * reemplace la imagen del fierro, que la pose de la isla sea la del HTML, que intente cosas y le salgan mal, y que tocado el
 * perro se haga notar.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-heroe-del-whisky';
const html = heroeEn(QUIETO);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_HEROE.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: readonly [number, number]): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([html], 'xx');
const primero = (re: RegExp, texto: string, otro = 0): number => Number(re.exec(texto)?.[1] ?? otro);

test('el héroe es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  for (const p of ['entero', 'hombre', 'cabeza', 'gorro', 'ojo', 'brazo-botella', 'brazo-alto', 'dedos', 'perro', 'perro-cabeza', 'perro-boca', 'perro-cola', 'ladrido', 'varilla', 'estrella-1', 'estrella-2', 'estrella-3', 'estrella-4', 'humo-1', 'humo-2', 'vacias', 'guitarra', 'rueda-1', 'rueda-2', 'rueda-3']) {
    assert.ok(html.includes(`data-parte="${p}"`), `al héroe le falta ${p}`);
  }
  const imagenes = new Set([...html.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_HEROE.map((p) => p.nombre).sort());
  for (const p of PIEZAS_HEROE) assert.match(p.nombre, /^heroe-/);
  assert.ok(adentro('heroe-cabeza', A.cuello) && adentro('heroe-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('heroe-brazo-alto', A.hombro) && adentro('heroe-cuerpo', A.hombro), 'el brazo no sale del hombro');
  assert.ok(adentro('heroe-dedos', A.muneca) && adentro('heroe-brazo-alto', A.muneca), 'los dedos no salen de la muñeca');
  assert.ok(adentro('heroe-perro-cabeza', A.perroCuello) && adentro('heroe-perro', A.perroCuello), 'el perro no tiene cogote');
  assert.ok(adentro('heroe-perro-cabeza', A.perroMandibula) && adentro('heroe-perro-boca', A.perroMandibula), 'la mandíbula no cuelga de la cara');
  assert.ok(adentro('heroe-perro-cola', A.perroCola), 'la cola no sale del anca');
  A.hilos.forEach((h, i) => assert.ok(adentro(`heroe-estrella-${i + 1}`, h), `el hilo ${i + 1} no está en su pieza`));
  A.ruedas.forEach(([x, y]) => assert.ok(adentro('heroe-chasis', [x, y - 10]), 'una rueda no cuelga del chasis'));
  for (const p of PIEZAS_HEROE) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['heroe-cabina', 'heroe-cuerpo', 'heroe-perro', 'heroe-gorro']) assert.match(PIEZAS_HEROE.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_HEROE.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 260, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del héroe están en su bloque de tokens.css, medidas en Bang! Bang!, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el heroe del whisky⟩'), tokens.indexOf('⟨/el heroe del whisky⟩'));
  const usadas = new Set(PIEZAS_HEROE.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-heroe-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del héroe`);
  assert.match(bloque, /public\/tapas\/bang-bang-estas-liquidado\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el heroe del whisky⟩ */'), sitio.indexOf('/* ⟨/el heroe del whisky⟩ */'));
  assert.ok(suyo.includes('"ladrido"') && suyo.includes('pointer-events: none'));
});

test('es el títere del fierro: reemplaza la imagen del camión en la ruta y en el camino, y las estrellas están a una mano de su mano', () => {
  assert.equal(HEROE.region, 'la-ruta');
  assert.equal(fierroDe(ID)?.includes('data-parte="estrella-1"'), true);
  assert.ok(escenaRuta(nombres).includes(`data-marco="${ID}" data-capa="fierro"`), 'el fierro sigue siendo la imagen');
  assert.ok(pisoDelCamino(CAMINOS['la-ruta']!, nombres).includes(`data-marco="${ID}" data-capa="fierro"`), 'en el camino sigue siendo la imagen');
  // La Mariposa Pontiac mira al héroe tirado: su cabeza está en la caja.
  assert.deepEqual(DE_LOS_OTROS[ID]!.pasajero, [A.cabeza[0], A.cabeza[1]]);
  // La estrella de más cerca queda a una mano del brazo estirado, pero no a su alcance.
  const [px, py] = puntaDeLaVarilla(0, [A.hilos[0]![0], A.hilos[0]![1] + A.cuelgan[0]! + A.estrellas[0]!]);
  const dist = Math.hypot(px - A.muneca[0], py - (A.muneca[1] - 14));
  assert.ok(dist > 4 && dist < 30, `la estrella queda a ${dist.toFixed(0)} de la mano`);
  // El camión entra en la caja del fierro de la imagen vieja, a lo ancho.
  const [x0, , w] = FIERROS[ID].caja;
  assert.ok(caja('heroe-chasis')[0] >= x0 && caja('heroe-chasis')[0] + caja('heroe-chasis')[2] <= x0 + w);
  assert.ok(Math.abs(A.globo) > SUBE_HUMO);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarHeroeCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).opacity.ojo, '0');
});

test('va por la ruta: las ruedas giran, rebota, se mece, y por su cuenta intenta cosas que le salen mal', () => {
  const hechas: Record<Accion, number> = { alcanza: 0, trago: 0, gorro: 0, ladridito: 0, salta: 0, ladra: 0 };
  const giros = new Set<string>();
  const baches = new Set<number>();
  let alcanzo = 0;
  let aire = 0;
  let botella = 0;
  let ojo = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarHeroeCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      if (i % 5 === 0) {
        giros.add(dom.de('rueda-1', 'transform'));
        baches.add(Math.round(bache(t) * 20));
      }
      alcanzo = Math.max(alcanzo, 175 - primero(/rotate\(([-\d.]+)/, dom.de('brazo-alto', 'transform'), 175));
      aire = Math.max(aire, -primero(/translate\(0 (-?[\d.]+)\)/, dom.de('perro', 'transform')));
      botella = Math.max(botella, -primero(/rotate\(([-\d.]+)/, dom.de('brazo-botella', 'transform')));
      ojo = Math.max(ojo, Number(dom.de('ojo', 'opacity')));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['alcanza', 'trago', 'gorro', 'ladridito', 'salta'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.ladra, 0);
  assert.ok(giros.size > 100 && baches.size > 10, 'no rueda o no rebota');
  assert.ok(alcanzo > 140 && aire > 10 && botella > 140 && ojo > 0.5, `alcanzo ${alcanzo} aire ${aire} botella ${botella} ojo ${ojo}`);
});

test('lo que intenta le sale mal: la estrella se le va de la mano y la botella está vacía', () => {
  const b = base(10);
  const cierra = momentoDeAccion(b, 'alcanza', 1.4);
  assert.ok(cierra.dedos > 0.95 && cierra.alcanza > 0.8, 'no cerró el puño estirado');
  assert.ok(Math.abs(cierra.estrellas[0] - b.estrellas[0]) > 10, 'la estrella no se le fue');
  const sacude = momentoDeAccion(b, 'trago', 3);
  assert.ok(sacude.botella > 0.2 && sacude.botella < 0.6, 'no sacudió la botella');
  assert.ok(momentoDeAccion(b, 'trago', 1.4).botella > 0.95, 'no tomó');
});

test('tocado, el perro se hace notar: ladra de a cuatro, salta, las estrellas se sacuden y el héroe se levanta el gorro y lo mira', () => {
  const dom = nuevo();
  const { esc, poner } = escenario(false);
  const vivo = armarHeroeCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  assert.equal(vivo.reaccionar('otro', 1), false);
  assert.equal(vivo.reaccionar(ID, 1), true);
  let ladridos = 0;
  let abierta = false;
  let salto = 0;
  let sacude = 0;
  let gorro = 0;
  let ojo = 0;
  for (let i = 1; i <= 60 * DURA.ladra; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const boca = Math.abs(primero(/rotate\(([-\d.]+)/, dom.de('perro-boca', 'transform')));
    if (boca > 24 && !abierta) {
      ladridos++;
      abierta = true;
    }
    if (boca < 10) abierta = false;
    salto = Math.max(salto, -primero(/translate\(0 (-?[\d.]+)\)/, dom.de('perro', 'transform')));
    sacude = Math.max(sacude, Math.abs(primero(/rotate\(([-\d.]+)/, dom.de('estrella-2', 'transform'))));
    gorro = Math.max(gorro, -primero(/translate\([-\d.]+ (-?[\d.]+)\)/, dom.de('gorro', 'transform')));
    ojo = Math.max(ojo, Number(dom.de('ojo', 'opacity')));
  }
  assert.equal(ladridos, LADRIDOS);
  assert.ok(salto > 8 && sacude > SACUDE * 0.5 && gorro > 14 && ojo > 0.95, `salto ${salto} sacude ${sacude} gorro ${gorro} ojo ${ojo}`);
  assert.equal(vivo.estado().hechas.ladra, 1);
  // Y vuelve a empezar con algo chiquito cambiado: el gorro le quedó torcido.
  const g = primero(/rotate\(([-\d.]+)/, dom.de('gorro', 'transform'));
  assert.ok(g < -3, `el gorro quedó en ${g}`);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de tirado a ladrando, y otra vez a tirado', () => {
  const dom = nuevo();
  const { esc } = escenario(true);
  const vivo = armarHeroeCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  vivo.reaccionar(ID, 3);
  assert.equal(dom.de('perro-boca', 'transform'), marcas(LADRA).transform['perro-boca']);
  assert.equal(dom.de('gorro', 'transform'), marcas(LADRA).transform.gorro);
  vivo.reaccionar(ID, 4);
  assert.equal(dom.de('gorro', 'transform'), marcas(QUIETO).transform.gorro);
});
